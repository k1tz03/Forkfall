'use strict';
// Moteur de rendu « voxel → pixel art » isométrique (préproduction FUSIBLE).
// Un voxel = 20 cm. Projection 2:1 : u = 2(x − y), v = (x + y) − 2z.
// Chaque pixel lance un rayon dans la grille ; textures, occlusion, ombres,
// lumières ponctuelles, reflets mouillés, brume, puis contours, halo et tramage.
const zlib = require('zlib');
const fs = require('fs');

const TOP = 0, LEFT = 1, RIGHT = 2; // LEFT = face +y (gauche-bas), RIGHT = face +x (droite-bas)

// ---------------------------------------------------------------- aléa déterministe
function hash(a, b, c, d) {
  let h = (Math.imul(a | 0, 0x27d4eb2d) + Math.imul(b | 0, 0x165667b1) + Math.imul(c | 0, 0x9e3779b1) + Math.imul(d | 0, 0x85ebca77)) | 0;
  h ^= h >>> 15; h = Math.imul(h, 0x2c1b3c6d); h ^= h >>> 12; h = Math.imul(h, 0x297a2d39); h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}
function vnoise(x, y, s) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, s, 1), b = hash(xi + 1, yi, s, 1), c = hash(xi, yi + 1, s, 1), d = hash(xi + 1, yi + 1, s, 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y, s, oct = 3) {
  let sum = 0, amp = 0.5, f = 1, norm = 0;
  for (let i = 0; i < oct; i++) { sum += amp * vnoise(x * f, y * f, s + i * 31); norm += amp; amp *= 0.5; f *= 2.03; }
  return sum / norm;
}
const mod = (n, m) => ((n % m) + m) % m;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);
const bayer = (x, y) => BAYER[(y & 3) * 4 + (x & 3)];
// Générateur séquentiel déterministe pour la construction de la scène.
function rng(seed) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }

// ---------------------------------------------------------------- matériaux
const MATS = [null];
function material(name, shade, flags = {}) { if (MATS.length > 255) throw new Error('trop de matières (255 au plus) : ' + name); MATS.push(Object.assign({ name, shade }, flags)); return MATS.length - 1; }
const OVERLAYS = {};
function overlay(type, fn) { OVERLAYS[type] = fn; }

// ---------------------------------------------------------------- le monde
class World {
  // ox, oy : décalage du quartier en cours de construction ; zl : sol logique (on peut creuser sous la rue).
  constructor(X, Y, Z, zl = 0) {
    this.X = X; this.Y = Y; this.Z = Z;
    this.mat = new Uint8Array(X * Y * Z);
    this.tag = new Uint16Array(X * Y * Z);
    this.objects = [null];
    this.lights = [];
    this.sprites = [];
    this.leaf = new Float32Array(X * Y); // densité de feuilles mortes au sol
    this.ox = 0; this.oy = 0; this.zl = zl;
  }
  at(ox, oy) { this.ox = ox; this.oy = oy; return this; }
  idx(x, y, z) { return ((z + this.zl) * this.Y + (y + this.oy)) * this.X + (x + this.ox); }
  inb(x, y, z) { x += this.ox; y += this.oy; z += this.zl; return x >= 0 && y >= 0 && z >= 0 && x < this.X && y < this.Y && z < this.Z; }
  get(x, y, z) { return this.inb(x, y, z) ? this.mat[this.idx(x, y, z)] : 0; }
  set(x, y, z, m, t = 0) { if (!this.inb(x, y, z)) return; const k = this.idx(x, y, z); this.mat[k] = m; this.tag[k] = t; }
  box(x0, y0, z0, x1, y1, z1, m, t = 0) {
    x0 = Math.max(0, Math.round(x0) + this.ox); y0 = Math.max(0, Math.round(y0) + this.oy); z0 = Math.max(0, Math.round(z0) + this.zl);
    x1 = Math.min(this.X, Math.round(x1) + this.ox); y1 = Math.min(this.Y, Math.round(y1) + this.oy); z1 = Math.min(this.Z, Math.round(z1) + this.zl);
    for (let z = z0; z < z1; z++) for (let y = y0; y < y1; y++) { let k = (z * this.Y + y) * this.X + x0; for (let x = x0; x < x1; x++, k++) { this.mat[k] = m; this.tag[k] = t; } }
  }
  obj(o) { o.ox = this.ox; o.oy = this.oy; this.objects.push(o); return this.objects.length - 1; }
  light(l) { this.lights.push(Object.assign({ spot: 0, shadow: true }, l, { x: l.x + this.ox, y: l.y + this.oy, z: l.z + this.zl })); }
  sprite(s) { this.sprites.push(Object.assign({}, s, { x: s.x + this.ox, y: s.y + this.oy, z: s.z + this.zl })); }
  stampLeaves(cx, cy, r, amt) {
    cx += this.ox; cy += this.oy;
    for (let y = Math.max(0, Math.floor(cy - r)); y < Math.min(this.Y, cy + r); y++)
      for (let x = Math.max(0, Math.floor(cx - r)); x < Math.min(this.X, cx + r); x++) {
        const d = Math.hypot(x - cx, y - cy) / r; if (d < 1) this.leaf[y * this.X + x] += amt * (1 - d) * (1 - d);
      }
  }
}

// ---------------------------------------------------------------- rayon de vue
// Le rayon passe par le centre du pixel et descend selon −(1,1,1).
// cutS : plan de coupe arrière (x + y < cutS : rien) ; cutF, cutZ : coupe avant, au-dessus du sol (x + y > cutF et z > cutZ : rien),
// pour que les immeubles du premier plan ne cachent pas le personnage
function castRay(W, u, v, R, cutS = -1e9, cutF = 1e9, cutZ = 0) {
  const X = W.X, Y = W.Y, Z = W.Z, mat = W.mat;
  const uc = u + 0.5, vc = v + 0.5;
  const x0 = (vc + 2 * Z + uc / 2) / 2, y0 = (vc + 2 * Z - uc / 2) / 2;
  let ix = Math.floor(x0), iy = Math.floor(y0), iz = Z - 1;
  const fx = x0 - ix, fy = y0 - iy;
  const xFirst = fx < fy;
  R.x0 = x0; R.y0 = y0;
  let m;
  const cut = (x, y, z) => x + y > cutF && z > cutZ;
  if (ix >= 0 && iy >= 0 && ix < X && iy < Y && (m = mat[(iz * Y + iy) * X + ix]) && !cut(ix, iy, iz)) return hitAt(R, TOP, 0, ix, iy, iz, m, Z);
  for (let k = 0; k <= Z; k++) {
    if (ix + iy < cutS) return false;
    if (xFirst) {
      ix--; if (ix < 0) return false;
      if (iy >= 0 && iy < Y && ix < X && (m = mat[(iz * Y + iy) * X + ix]) && !cut(ix, iy, iz)) return hitAt(R, RIGHT, k + fx, ix, iy, iz, m, Z);
      iy--; if (iy < 0) return false;
      if (ix >= 0 && iy < Y && ix < X && (m = mat[(iz * Y + iy) * X + ix]) && !cut(ix, iy, iz)) return hitAt(R, LEFT, k + fy, ix, iy, iz, m, Z);
    } else {
      iy--; if (iy < 0) return false;
      if (ix >= 0 && iy < Y && ix < X && (m = mat[(iz * Y + iy) * X + ix]) && !cut(ix, iy, iz)) return hitAt(R, LEFT, k + fy, ix, iy, iz, m, Z);
      ix--; if (ix < 0) return false;
      if (iy >= 0 && iy < Y && ix < X && (m = mat[(iz * Y + iy) * X + ix]) && !cut(ix, iy, iz)) return hitAt(R, RIGHT, k + fx, ix, iy, iz, m, Z);
    }
    iz--; if (iz < 0) return false;
    if (ix >= 0 && iy >= 0 && ix < X && iy < Y && (m = mat[(iz * Y + iy) * X + ix]) && !cut(ix, iy, iz)) return hitAt(R, TOP, k + 1, ix, iy, iz, m, Z);
  }
  return false;
}
function hitAt(R, face, t, ix, iy, iz, m, Z) {
  R.face = face; R.t = t; R.ix = ix; R.iy = iy; R.iz = iz; R.m = m;
  R.hx = R.x0 - t; R.hy = R.y0 - t; R.hz = Z - t;
  if (face === TOP) R.hz = iz + 1; else if (face === LEFT) R.hy = iy + 1; else R.hx = ix + 1;
  return true;
}

// ---------------------------------------------------------------- rayon d'ombre (DDA)
function transmit(W, px, py, pz, dx, dy, dz, maxT) {
  const X = W.X, Y = W.Y, Z = W.Z, mat = W.mat;
  let ix = Math.floor(px), iy = Math.floor(py), iz = Math.floor(pz);
  const sx = dx > 0 ? 1 : -1, sy = dy > 0 ? 1 : -1, sz = dz > 0 ? 1 : -1;
  const tdx = dx !== 0 ? Math.abs(1 / dx) : 1e30, tdy = dy !== 0 ? Math.abs(1 / dy) : 1e30, tdz = dz !== 0 ? Math.abs(1 / dz) : 1e30;
  let tmx = dx > 0 ? (ix + 1 - px) * tdx : dx < 0 ? (px - ix) * tdx : 1e30;
  let tmy = dy > 0 ? (iy + 1 - py) * tdy : dy < 0 ? (py - iy) * tdy : 1e30;
  let tmz = dz > 0 ? (iz + 1 - pz) * tdz : dz < 0 ? (pz - iz) * tdz : 1e30;
  let T = 1;
  for (let n = 0; n < 2000; n++) {
    let t;
    if (tmx < tmy) { if (tmx < tmz) { ix += sx; t = tmx; tmx += tdx; } else { iz += sz; t = tmz; tmz += tdz; } }
    else { if (tmy < tmz) { iy += sy; t = tmy; tmy += tdy; } else { iz += sz; t = tmz; tmz += tdz; } }
    if (t >= maxT) return T;
    if (iz >= Z || iz < 0 || ix < 0 || iy < 0 || ix >= X || iy >= Y) return T;
    const m = mat[(iz * Y + iy) * X + ix];
    if (m) {
      const M = MATS[m];
      if (M.noShadow) continue;
      if (M.trans) { T *= M.trans; if (T < 0.05) return 0; } else return 0;
    }
  }
  return T;
}

// Rayon de reflet (sol mouillé) : renvoie la couleur émise/éclairée de ce qu'il touche.
function reflectRay(W, px, py, pz, dx, dy, dz, maxT, out, ctx) {
  const X = W.X, Y = W.Y, Z = W.Z, mat = W.mat;
  let ix = Math.floor(px), iy = Math.floor(py), iz = Math.floor(pz);
  const sx = dx > 0 ? 1 : -1, sy = dy > 0 ? 1 : -1, sz = dz > 0 ? 1 : -1;
  const tdx = dx !== 0 ? Math.abs(1 / dx) : 1e30, tdy = dy !== 0 ? Math.abs(1 / dy) : 1e30, tdz = dz !== 0 ? Math.abs(1 / dz) : 1e30;
  let tmx = dx > 0 ? (ix + 1 - px) * tdx : dx < 0 ? (px - ix) * tdx : 1e30;
  let tmy = dy > 0 ? (iy + 1 - py) * tdy : dy < 0 ? (py - iy) * tdy : 1e30;
  let tmz = dz > 0 ? (iz + 1 - pz) * tdz : dz < 0 ? (pz - iz) * tdz : 1e30;
  for (let n = 0; n < 600; n++) {
    let t, axis;
    if (tmx < tmy) { if (tmx < tmz) { ix += sx; t = tmx; tmx += tdx; axis = 0; } else { iz += sz; t = tmz; tmz += tdz; axis = 2; } }
    else { if (tmy < tmz) { iy += sy; t = tmy; tmy += tdy; axis = 1; } else { iz += sz; t = tmz; tmz += tdz; axis = 2; } }
    if (t >= maxT || iz >= Z || iz < 0 || ix < 0 || iy < 0 || ix >= X || iy >= Y) return false;
    const m = mat[(iz * Y + iy) * X + ix];
    if (m) {
      ctx.face = axis === 2 ? TOP : axis === 1 ? LEFT : RIGHT;
      ctx.hx = px + dx * t; ctx.hy = py + dy * t; ctx.hz = pz + dz * t;
      ctx.ix = ix; ctx.iy = iy; ctx.iz = iz;
      shadeSurface(W, ctx, m, (iz * Y + iy) * X + ix);
      out[0] = ctx.er + ctx.cr * ctx.reflAmb[0]; out[1] = ctx.eg + ctx.cg * ctx.reflAmb[1]; out[2] = ctx.eb + ctx.cb * ctx.reflAmb[2];
      return true;
    }
  }
  return false;
}

// ---------------------------------------------------------------- matière + calques
function shadeSurface(W, c, m, k) {
  c.hz -= W.zl;
  if (c.face === TOP) { c.a = Math.floor(2 * c.hx); c.b = Math.floor(2 * c.hy); }
  else if (c.face === LEFT) { c.a = Math.floor(2 * c.hx); c.b = Math.floor(2 * c.hz); }
  else { c.a = -Math.floor(2 * c.hy); c.b = Math.floor(2 * c.hz); }
  c.cr = 0.5; c.cg = 0.5; c.cb = 0.5; c.er = 0; c.eg = 0; c.eb = 0; c.wet = 0; c.m = m;
  c.W = W;
  MATS[m].shade(c);
  const tg = W.tag[k];
  if (tg) {
    const o = W.objects[tg]; const f = OVERLAYS[o.type];
    if (f) { const ox = o.ox || 0, oy = o.oy || 0; c.hx -= ox; c.hy -= oy; f(o, c); c.hx += ox; c.hy += oy; }
  }
}

// ---------------------------------------------------------------- occlusion ambiante
const AO_SETS = [[], [], []];
(function buildAO() {
  const normals = [[0, 0, 1], [0, 1, 0], [1, 0, 0]];
  for (let f = 0; f < 3; f++) {
    const n = normals[f];
    const t = f === 0 ? [1, 0, 0] : f === 1 ? [1, 0, 0] : [0, 1, 0];
    const b = [n[1] * t[2] - n[2] * t[1], n[2] * t[0] - n[0] * t[2], n[0] * t[1] - n[1] * t[0]];
    for (let i = 0; i < 10; i++) {
      const th = i / 10 * Math.PI * 2;
      for (const [el, dist] of [[0.35, 2.2], [0.8, 3.5], [0.55, 6.5]]) {
        const ce = Math.cos(el), se = Math.sin(el);
        const d = [0, 1, 2].map(j => (Math.cos(th) * t[j] + Math.sin(th) * b[j]) * ce + n[j] * se);
        AO_SETS[f].push([d[0] * dist + n[0] * 0.5, d[1] * dist + n[1] * 0.5, d[2] * dist + n[2] * 0.5, 1 / Math.sqrt(dist)]);
      }
    }
  }
})();
function solidAO(W, x, y, z) {
  if (x < 0 || y < 0 || z < 0 || x >= W.X || y >= W.Y || z >= W.Z) return 0;
  const m = W.mat[(z * W.Y + y) * W.X + x];
  return m && !MATS[m].noAO ? 1 : 0;
}
function cornerAO(W, face, ix, iy, iz, hx, hy, hz) {
  let s, fa, fb;
  if (face === TOP) { const z = iz + 1; s = (da, db) => solidAO(W, ix + da, iy + db, z); fa = hx - ix; fb = hy - iy; }
  else if (face === LEFT) { const y = iy + 1; s = (da, db) => solidAO(W, ix + da, y, iz + db); fa = hx - ix; fb = hz - iz; }
  else { const x = ix + 1; s = (da, db) => solidAO(W, x, iy + da, iz + db); fa = hy - iy; fb = hz - iz; }
  const am = s(-1, 0), ap = s(1, 0), bm = s(0, -1), bp = s(0, 1);
  const f = (s1, s2, cc) => (s1 && s2) ? 0 : 3 - (s1 + s2 + cc);
  const a00 = f(am, bm, s(-1, -1)), a10 = f(ap, bm, s(1, -1)), a01 = f(am, bp, s(-1, 1)), a11 = f(ap, bp, s(1, 1));
  return (a00 * (1 - fa) * (1 - fb) + a10 * fa * (1 - fb) + a01 * (1 - fa) * fb + a11 * fa * fb) / 3;
}
function broadAO(W, face, px, py, pz) {
  const set = AO_SETS[face];
  let occ = 0, tot = 0;
  for (let i = 0; i < set.length; i++) {
    const s = set[i];
    tot += s[3];
    if (solidAO(W, Math.floor(px + s[0]), Math.floor(py + s[1]), Math.floor(pz + s[2]))) occ += s[3];
  }
  return 1 - occ / tot;
}

// ---------------------------------------------------------------- rendu
const NORM = [[0, 0, 1], [0, 1, 0], [1, 0, 0]];
function render(W, opt) {
  const FW = opt.width, FH = opt.height, N = FW * FH;
  const col = new Float32Array(N * 3), emi = new Float32Array(N * 3);
  const dv = new Float32Array(N).fill(-1e9), sB = new Float32Array(N), face = new Int8Array(N).fill(-1);
  const R = {}, c = { reflAmb: opt.reflAmb || [0.18, 0.15, 0.15] }, rc = { reflAmb: opt.reflAmb || [0.18, 0.15, 0.15] };
  const lights = W.lights;
  const amb = opt.ambient, sun = opt.sun, Ls = opt.sunDir;
  const faceAmb = opt.faceAmb || [1.0, 0.8, 0.62];
  const Q = opt.lightQuant || 6;
  const tmp = [0, 0, 0];
  const t0 = Date.now();
  for (let py = 0; py < FH; py++) {
    for (let px = 0; px < FW; px++) {
      const k = py * FW + px, k3 = k * 3;
      if (!castRay(W, px + opt.cu, py + opt.cv, R, opt.cutS, opt.cutF, opt.cutZ)) {
        const bg = opt.backdrop(px, py);
        col[k3] = bg[0]; col[k3 + 1] = bg[1]; col[k3 + 2] = bg[2];
        emi[k3] = bg[3] || 0; emi[k3 + 1] = bg[4] || 0; emi[k3 + 2] = bg[5] || 0;
        continue;
      }
      const f = R.face, n = NORM[f];
      c.face = f; c.hx = R.hx; c.hy = R.hy; c.hz = R.hz; c.ix = R.ix; c.iy = R.iy; c.iz = R.iz;
      const vk = (R.iz * W.Y + R.iy) * W.X + R.ix;
      shadeSurface(W, c, R.m, vk);
      face[k] = f; dv[k] = R.hx + R.hy + R.hz; sB[k] = R.hx + R.hy;
      const M = MATS[R.m];
      // lumière
      const P0 = R.hx + n[0] * 0.03, P1 = R.hy + n[1] * 0.03, P2 = R.hz + n[2] * 0.03;
      let ao = 1;
      if (!M.noAOrecv) {
        const ca = cornerAO(W, f, R.ix, R.iy, R.iz, R.hx, R.hy, R.hz);
        const ba = broadAO(W, f, R.hx, R.hy, R.hz);
        ao = (0.45 + 0.55 * ca) * (0.35 + 0.65 * ba);
      }
      const fa = faceAmb[f] * ao;
      let lr = amb[0] * fa, lg = amb[1] * fa, lb = amb[2] * fa;
      const nds = n[0] * Ls[0] + n[1] * Ls[1] + n[2] * Ls[2];
      if (nds > 0 && sun[0] + sun[1] + sun[2] > 0) {
        const T = opt.sunShadow === false ? 1 : transmit(W, P0, P1, P2, Ls[0], Ls[1], Ls[2], 400);
        if (T > 0) { const s = nds * T; lr += sun[0] * s; lg += sun[1] * s; lb += sun[2] * s; }
      }
      // lumières ponctuelles, quantifiées et tramées
      let qr = 0, qg = 0, qb = 0;
      for (let i = 0; i < lights.length; i++) {
        const L = lights[i];
        const dx = L.x - P0, dy = L.y - P1, dz = L.z - P2;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 >= L.r * L.r) continue;
        const d = Math.sqrt(d2) || 1e-6;
        const ndl = (n[0] * dx + n[1] * dy + n[2] * dz) / d;
        if (ndl <= 0) continue;
        let att = Math.pow(1 - d / L.r, L.fall || 2);
        if (L.spot) { const down = clamp(dz / d * 1.3 + 0.25, 0, 1); att *= (1 - L.spot) + L.spot * down; }
        if (L.axis) { const dd = -(dx * L.axis[0] + dy * L.axis[1] + dz * L.axis[2]) / d; att *= clamp((dd - L.c0) / (L.c1 - L.c0), L.spill || 0, 1); }
        let w = att * (0.35 + 0.65 * ndl);
        if (w < 0.004) continue;
        if (L.shadow) { const T = transmit(W, P0, P1, P2, dx / d, dy / d, dz / d, d - (L.skip || 1.2)); if (T <= 0) continue; w *= T; }
        qr += L.cr * w; qg += L.cg * w; qb += L.cb * w;
      }
      const bt = bayer(px, py);
      const lmax = Math.max(qr, qg, qb);
      if (lmax > 0) { const qq = Math.floor(lmax * Q + bt) / Q, kq = qq / lmax; qr *= kq; qg *= kq; qb *= kq; }
      lr += qr * (0.55 + 0.45 * ao); lg += qg * (0.55 + 0.45 * ao); lb += qb * (0.55 + 0.45 * ao);
      let r = c.cr * lr, g = c.cg * lg, b = c.cb * lb;
      // sol mouillé : reflet
      if (c.wet > 0 && f === TOP) {
        const rip = (vnoise(R.hx * 1.3, R.hy * 0.5, 77) - 0.5) * (opt.ripple || 0.1);
        let rdx = -1 + rip, rdy = -1 - rip * 0.5, rdz = 1.15;
        const rl = Math.hypot(rdx, rdy, rdz); rdx /= rl; rdy /= rl; rdz /= rl;
        if (reflectRay(W, R.hx, R.hy, R.hz + 0.02, rdx, rdy, rdz, 160, tmp, rc)) {
          const w = c.wet * (opt.wetStrength || 0.7);
          r = r * (1 - 0.55 * c.wet) + tmp[0] * w; g = g * (1 - 0.55 * c.wet) + tmp[1] * w; b = b * (1 - 0.55 * c.wet) + tmp[2] * w;
        } else {
          const sk = opt.backdrop(px, clamp(Math.round(opt.wetRow || 20), 0, FH - 1));
          const w = c.wet * 0.55; r = r * (1 - 0.45 * c.wet) + sk[0] * w; g = g * (1 - 0.45 * c.wet) + sk[1] * w; b = b * (1 - 0.45 * c.wet) + sk[2] * w;
        }
      }
      // brume de profondeur
      const s = R.hx + R.hy;
      let fog = clamp((opt.fogS1 - s) / (opt.fogS1 - opt.fogS0), 0, 1); fog = fog * fog * (3 - 2 * fog);
      const fc = opt.fogColor(px, py);
      r = r * (1 - fog) + fc[0] * fog; g = g * (1 - fog) + fc[1] * fog; b = b * (1 - fog) + fc[2] * fog;
      const ef = (1 - 0.55 * fog) * (opt.emitScale != null ? opt.emitScale : 1);
      col[k3] = r + c.er * ef; col[k3 + 1] = g + c.eg * ef; col[k3 + 2] = b + c.eb * ef;
      emi[k3] = c.er * ef; emi[k3 + 1] = c.eg * ef; emi[k3 + 2] = c.eb * ef;
    }
  }
  const t1 = Date.now();
  // contours et arêtes éclairées
  if (opt.outline !== false) {
    const out = new Float32Array(col);
    for (let py = 1; py < FH - 1; py++) for (let px = 1; px < FW - 1; px++) {
      const k = py * FW + px; if (face[k] < 0) continue;
      const d = dv[k];
      const far = d - 4.5;
      if (dv[k - 1] < far || dv[k + 1] < far || dv[k - FW] < far || dv[k + FW] < far) {
        const m = opt.outlineDark || 0.58;
        out[k * 3] = col[k * 3] * m; out[k * 3 + 1] = col[k * 3 + 1] * m; out[k * 3 + 2] = col[k * 3 + 2] * m;
      } else if (face[k] === TOP && face[k + FW] > 0 && Math.abs(dv[k + FW] - d) < 1.6) {
        const m = opt.rim || 1.16;
        out[k * 3] = col[k * 3] * m; out[k * 3 + 1] = col[k * 3 + 1] * m; out[k * 3 + 2] = col[k * 3 + 2] * m;
      }
    }
    col.set(out);
  }
  // personnages et objets peints (sprites)
  for (const sp of W.sprites) drawSprite(W, sp, opt, col, emi, dv);
  // halo des lumières
  if (opt.bloom) {
    for (const [rad, str] of opt.bloom) {
      const bl = blur(emi, FW, FH, rad);
      for (let i = 0; i < N * 3; i++) col[i] += bl[i] * str;
    }
  }
  // étalonnage et tramage final
  const img = Buffer.alloc(N * 3);
  const lift = opt.lift || [0.02, 0.013, 0.01];
  const levels = opt.levels || 40;
  for (let py = 0; py < FH; py++) for (let px = 0; px < FW; px++) {
    const k = py * FW + px;
    const bt = bayer(px, py) - 0.5;
    for (let ch = 0; ch < 3; ch++) {
      let v = col[k * 3 + ch];
      v = v < 0.82 ? v : 0.82 + 0.18 * (1 - Math.exp(-(v - 0.82) / 0.18));
      v = v * (1 - lift[ch]) + lift[ch];
      v = Math.pow(clamp(v, 0, 1), opt.gamma || 1);
      v = Math.round(v * levels + bt * 0.9) / levels;
      img[k * 3 + ch] = clamp(Math.round(v * 255), 0, 255);
    }
  }
  if (opt.log !== false) console.log(`  rayons ${t1 - t0} ms, total ${Date.now() - t0} ms`);
  return { img, FW, FH, dv, face };
}

function blur(src, W, H, r) {
  const a = new Float32Array(src), b = new Float32Array(src.length);
  const pass = (from, to, horiz) => {
    const len = horiz ? W : H, lines = horiz ? H : W;
    for (let l = 0; l < lines; l++) {
      for (let ch = 0; ch < 3; ch++) {
        let acc = 0;
        const at = i => { const x = horiz ? i : l, y = horiz ? l : i; return from[(y * W + x) * 3 + ch]; };
        for (let i = -r; i <= r; i++) acc += at(clamp(i, 0, len - 1));
        for (let i = 0; i < len; i++) {
          const x = horiz ? i : l, y = horiz ? l : i;
          to[(y * W + x) * 3 + ch] = acc / (2 * r + 1);
          acc += at(clamp(i + r + 1, 0, len - 1)) - at(clamp(i - r, 0, len - 1));
        }
      }
    }
  };
  pass(a, b, true); pass(b, a, false); pass(a, b, true); pass(b, a, false);
  return a;
}

// ---------------------------------------------------------------- sprites
// Un sprite est une image de pixels debout sur le sol ; son relief suit la hauteur de chaque ligne.
function drawSprite(W, sp, opt, col, emi, dv) {
  const FW = opt.width, FH = opt.height;
  // derrière le plan de coupe d'une vue de jeu, un personnage n'existe pas
  if (opt.cutS != null && sp.x + sp.y < opt.cutS) return;
  const fu = 2 * (sp.x - sp.y) - opt.cu, fv = sp.x + sp.y - 2 * sp.z - opt.cv;
  const rows = sp.rows, h = rows.length, w = rows[0].length;
  const ax = sp.ax != null ? sp.ax : Math.floor(w / 2);
  // lumière reçue par le personnage
  const P = [sp.x, sp.y, sp.z + 4];
  const amb = opt.ambient;
  let lr = amb[0] * 0.9, lg = amb[1] * 0.9, lb = amb[2] * 0.9;
  const Ls = opt.sunDir, sun = opt.sun;
  if (sun[0] + sun[1] + sun[2] > 0) { const T = transmit(W, P[0], P[1], P[2] + 2, Ls[0], Ls[1], Ls[2], 400); const s = 0.75 * T; lr += sun[0] * s; lg += sun[1] * s; lb += sun[2] * s; }
  for (const L of W.lights) {
    const dx = L.x - P[0], dy = L.y - P[1], dz = L.z - P[2];
    const d = Math.hypot(dx, dy, dz); if (d >= L.r) continue;
    let att = Math.pow(1 - d / L.r, L.fall || 2);
    if (L.axis) { const dd = -(dx * L.axis[0] + dy * L.axis[1] + dz * L.axis[2]) / d; att *= clamp((dd - L.c0) / (L.c1 - L.c0), L.spill || 0, 1); }
    const T = L.shadow ? transmit(W, P[0], P[1], P[2], dx / d, dy / d, dz / d, d - (L.skip || 1.2)) : 1;
    const face = clamp((dx + dy) / d * 0.5 + 0.6, 0.15, 1);
    lr += L.cr * att * T * face; lg += L.cg * att * T * face; lb += L.cb * att * T * face;
  }
  const s = sp.x + sp.y;
  let fog = clamp((opt.fogS1 - s) / (opt.fogS1 - opt.fogS0), 0, 1); fog = fog * fog * (3 - 2 * fog);
  // ombre portée au sol (ellipse)
  if (sp.shadow !== false) {
    const rx = sp.shadowR || Math.max(3, w / 2), ry = rx / 2;
    for (let j = -Math.ceil(ry); j <= Math.ceil(ry); j++) for (let i = -Math.ceil(rx); i <= Math.ceil(rx); i++) {
      if ((i * i) / (rx * rx) + (j * j) / (ry * ry) > 1) continue;
      const px = Math.round(fu + i), py = Math.round(fv + j);
      if (px < 0 || py < 0 || px >= FW || py >= FH) continue;
      const k = py * FW + px;
      if (Math.abs(dv[k] - (sp.x + sp.y + sp.z)) > 3) continue;
      col[k * 3] *= 0.55; col[k * 3 + 1] *= 0.55; col[k * 3 + 2] *= 0.58;
    }
  }
  for (let i = 0; i < h; i++) {
    const row = rows[i];
    for (let j = 0; j < w; j++) {
      const ch = row[j]; if (ch === '.' || ch === ' ') continue;
      const px = Math.round(fu - ax + j), py = Math.round(fv - (h - 1) + i);
      if (px < 0 || py < 0 || px >= FW || py >= FH) continue;
      const k = py * FW + px;
      const z = sp.z + (h - 1 - i) / 2;
      const d = sp.x + sp.y + z;
      if (d < dv[k] - 0.6) continue;
      const pc = sp.pal[ch]; if (!pc) continue;
      let r, g, b;
      if (sp.emit && sp.emit[ch]) { const e = sp.emit[ch]; r = e[0]; g = e[1]; b = e[2]; emi[k * 3] = r; emi[k * 3 + 1] = g; emi[k * 3 + 2] = b; }
      else { r = pc[0] * lr; g = pc[1] * lg; b = pc[2] * lb; }
      const fc = opt.fogColor(px, py);
      col[k * 3] = r * (1 - fog) + fc[0] * fog; col[k * 3 + 1] = g * (1 - fog) + fc[1] * fog; col[k * 3 + 2] = b * (1 - fog) + fc[2] * fog;
      dv[k] = d;
    }
  }
}

// ---------------------------------------------------------------- police 3×5 (+ accent)
const GLYPHS = {
  'A': ['.#.', '#.#', '###', '#.#', '#.#'], 'B': ['##.', '#.#', '##.', '#.#', '##.'], 'C': ['.##', '#..', '#..', '#..', '.##'],
  'D': ['##.', '#.#', '#.#', '#.#', '##.'], 'E': ['###', '#..', '##.', '#..', '###'], 'F': ['###', '#..', '##.', '#..', '#..'],
  'G': ['.##', '#..', '#.#', '#.#', '.##'], 'H': ['#.#', '#.#', '###', '#.#', '#.#'], 'I': ['###', '.#.', '.#.', '.#.', '###'],
  'J': ['..#', '..#', '..#', '#.#', '.#.'], 'K': ['#.#', '#.#', '##.', '#.#', '#.#'], 'L': ['#..', '#..', '#..', '#..', '###'],
  'M': ['#...#', '##.##', '#.#.#', '#...#', '#...#'], 'N': ['#..#', '##.#', '#.##', '#..#', '#..#'], 'O': ['.#.', '#.#', '#.#', '#.#', '.#.'],
  'P': ['##.', '#.#', '##.', '#..', '#..'], 'Q': ['.#.', '#.#', '#.#', '#.#', '.##'], 'R': ['##.', '#.#', '##.', '#.#', '#.#'],
  'S': ['.##', '#..', '.#.', '..#', '##.'], 'T': ['###', '.#.', '.#.', '.#.', '.#.'], 'U': ['#.#', '#.#', '#.#', '#.#', '###'],
  'V': ['#.#', '#.#', '#.#', '#.#', '.#.'], 'W': ['#...#', '#...#', '#.#.#', '##.##', '#...#'], 'X': ['#.#', '#.#', '.#.', '#.#', '#.#'],
  'Y': ['#.#', '#.#', '.#.', '.#.', '.#.'], 'Z': ['###', '..#', '.#.', '#..', '###'],
  '0': ['###', '#.#', '#.#', '#.#', '###'], '1': ['.#.', '##.', '.#.', '.#.', '###'], '2': ['##.', '..#', '.#.', '#..', '###'],
  '3': ['##.', '..#', '.#.', '..#', '##.'], '4': ['#.#', '#.#', '###', '..#', '..#'], '5': ['###', '#..', '##.', '..#', '##.'],
  '6': ['.##', '#..', '###', '#.#', '###'], '7': ['###', '..#', '.#.', '.#.', '.#.'], '8': ['###', '#.#', '###', '#.#', '###'],
  '9': ['###', '#.#', '###', '..#', '##.'], "'": ['#', '#', '.', '.', '.'], '·': ['.', '.', '#', '.', '.'], '-': ['...', '...', '###', '...', '...'],
  ':': ['.', '#', '.', '#', '.'], '.': ['.', '.', '.', '.', '#'], '+': ['...', '.#.', '###', '.#.', '...'],
};
const ACCENTS = { 'É': ['E', '.#.'], 'È': ['E', '.#.'], 'À': ['A', '.#.'], 'Ç': ['C', null] };
function textBitmap(text) {
  const cols = [];
  const H = 6;
  const chars = [...text];
  chars.forEach((ch, i) => {
    if (ch === ' ') { for (let k = 0; k < 2; k++) cols.push(new Array(H).fill(0)); return; }
    let g = GLYPHS[ch], acc = null;
    if (!g && ACCENTS[ch]) { acc = ACCENTS[ch][1]; g = GLYPHS[ACCENTS[ch][0]]; }
    if (!g) g = GLYPHS['-'];
    const gw = g[0].length;
    for (let x = 0; x < gw; x++) {
      const colv = new Array(H).fill(0);
      if (acc && acc[Math.min(x, acc.length - 1)] === '#' && x === Math.floor(gw / 2)) colv[0] = 1;
      for (let y = 0; y < 5; y++) colv[y + 1] = g[y][x] === '#' ? 1 : 0;
      cols.push(colv);
    }
    if (i < chars.length - 1) cols.push(new Array(H).fill(0));
  });
  return { w: cols.length, h: H, at: (x, y) => (x >= 0 && x < cols.length && y >= 0 && y < H) ? cols[x][y] : 0 };
}

// ---------------------------------------------------------------- PNG
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(buf) { let c = 0xffffffff; for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function writePNG(file, img, W, H, scale = 1) {
  fs.mkdirSync(require('path').dirname(file), { recursive: true });
  const SW = W * scale, SH = H * scale;
  const raw = Buffer.alloc((SW * 3 + 1) * SH);
  for (let y = 0; y < SH; y++) {
    const ro = y * (SW * 3 + 1); raw[ro] = 0;
    const sy = Math.floor(y / scale);
    for (let x = 0; x < SW; x++) { const sx = Math.floor(x / scale), si = (sy * W + sx) * 3, di = ro + 1 + x * 3; raw[di] = img[si]; raw[di + 1] = img[si + 1]; raw[di + 2] = img[si + 2]; }
  }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(SW, 0); ihdr.writeUInt32BE(SH, 4); ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
  fs.writeFileSync(file, png);
  return png.length;
}

module.exports = { TOP, LEFT, RIGHT, hash, vnoise, fbm, mod, clamp, bayer, rng, MATS, material, overlay, OVERLAYS, World, render, textBitmap, writePNG, transmit };
