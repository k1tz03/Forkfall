'use strict';
// Les briques de construction de la ville : façades, toits, mobilier, arbres, voitures, stade.
const E = require('./engine');
const { M } = require('./mats');
const { LEFT, RIGHT, hash, rng, textBitmap, material } = E;

M.BOOTH = material('vitre de cabine', c => { c.cr = 0.5; c.cg = 0.55; c.cb = 0.5; c.er = 0.09; c.eg = 0.085; c.eb = 0.06; if (((c.a % 6) + 6) % 6 === 0) { c.er = c.eg = c.eb = 0; c.cr = c.cg = c.cb = 0.15; } }, { noAOrecv: true, trans: 0.7 });

// ---------------------------------------------------------------- façade
class Facade {
  constructor(W, face, bx, by, bw, bd) { Object.assign(this, { W, face, bx, by, bw, bd }); this.len = face === LEFT ? bw : bd; }
  xy(s, depth) { return this.face === LEFT ? [this.bx + s, this.by + this.bd - 1 - depth] : [this.bx + this.bw - 1 - depth, this.by + this.bd - 1 - s]; }
  set(s, z, depth, m, t = 0) { const [x, y] = this.xy(s, depth); this.W.set(x, y, z, m, t); }
  tag(s, z, depth, t) { const [x, y] = this.xy(s, depth); if (this.W.inb(x, y, z)) this.W.tag[this.W.idx(x, y, z)] = t; }
  rect(s0, z0, s1, z1, depth, m, t = 0) { for (let s = s0; s < s1; s++) for (let z = z0; z < z1; z++) this.set(s, z, depth, m, t); }
  a0(s0) { return this.face === LEFT ? this.bx + s0 : this.by + this.bd - s0; }
  // le point du monde devant la façade (pour poser une lumière)
  front(s, z, out = 2) { const [x, y] = this.xy(s, -out); return { x: x + 0.5, y: y + 0.5, z }; }
  window(s0, z0, w, h, o = {}) {
    this.rect(s0, z0, s0 + w, z0 + h, 0, 0);
    const id = this.W.obj(Object.assign({ type: 'window', face: this.face, a0: this.a0(s0), z0, w, h, state: 'dark' }, o));
    this.rect(s0, z0, s0 + w, z0 + h, 1, M.GLASS, id);
    if (o.sill !== false) this.rect(s0 - 1, z0 - 1, s0 + w + 1, z0, -1, o.sillMat || M.STONE);
    if (o.lintel !== false) this.rect(s0, z0 + h, s0 + w, z0 + h + 1, 0, o.lintelMat || M.STONE);
    if (o.shutter) {
      if (o.closed) this.rect(s0, z0, s0 + w, z0 + h, 0, o.shutter);
      else { const sw = Math.ceil(w / 2); this.rect(s0 - sw, z0, s0, z0 + h, -1, o.shutter); this.rect(s0 + w, z0, s0 + w + sw, z0 + h, -1, o.shutter); }
    }
    if (o.balcony) {
      const b = o.balcony; // dalle + garde-corps
      this.rect(s0 - 1, z0 - 1, s0 + w + 1, z0, -1, M.STONE); this.rect(s0 - 1, z0 - 1, s0 + w + 1, z0, -2, M.STONE);
      for (let s = s0 - 1; s < s0 + w + 1; s++) { this.set(s, z0 + 3, -2, M.METAL_DARK); if ((s - s0) % 2 === 0) for (let z = z0; z < z0 + 3; z++) this.set(s, z, -2, M.METAL_DARK); }
      this.set(s0 - 1, z0, -1, M.METAL_DARK); this.set(s0 + w, z0, -1, M.METAL_DARK);
      if (b === 'plants') { this.set(s0, z0, -1, M.HEDGE); this.set(s0 + w - 1, z0, -1, M.HEDGE); this.set(s0 + w - 1, z0 + 1, -1, M.HEDGE); }
    }
    if ((o.state === 'lit' || o.state === 'office' || o.state === 'tv') && o.spill !== false) {
      const f = this.front(s0 + w / 2, z0 + h / 2, 2);
      const col = o.state === 'office' ? [0.5, 0.55, 0.5] : o.state === 'tv' ? [0.22, 0.28, 0.5] : [0.7, 0.48, 0.24];
      const I = o.spillI || 0.55;
      this.W.light({ x: f.x, y: f.y, z: f.z, r: o.spillR || 22, cr: col[0] * I, cg: col[1] * I, cb: col[2] * I, shadow: false });
    }
    return id;
  }
  shop(s0, z0, w, h, kind, o = {}) {
    this.rect(s0, z0, s0 + w, z0 + h, 0, 0);
    const id = this.W.obj(Object.assign({ type: 'shop', kind, face: this.face, a0: this.a0(s0), z0, w, h }, o));
    this.rect(s0, z0, s0 + w, z0 + h, 1, M.GLASS, id);
    this.rect(s0, z0 + h, s0 + w, z0 + h + 1, 0, o.lintelMat || M.STONE);
    if (o.light) {
      const f = this.front(s0 + w / 2, z0 + h * 0.6, 3);
      const L = o.light;
      this.W.light({ x: f.x, y: f.y, z: f.z, r: L.r || 40, cr: L.c[0], cg: L.c[1], cb: L.c[2], shadow: true, skip: 2.5 });
    }
    return id;
  }
  sign(s0, zTop, text, o = {}) {
    const bmp = textBitmap(text), sc = o.scale || 1;
    const padX = o.padX != null ? o.padX : (o.plate ? 2 : 0), padY = o.padY != null ? o.padY : (o.plate ? 2 : 0);
    const texW = bmp.w * sc + padX * 2, texH = bmp.h * sc + padY * 2;
    const nw = Math.ceil(texW / 2), nh = Math.ceil(texH / 2);
    const depth = o.depth != null ? o.depth : (o.plate ? -1 : 0);
    const id = this.W.obj(Object.assign({ type: 'sign', face: this.face, a0: this.a0(s0), zTop, text, bmp, scale: sc, padX, padY }, o));
    for (let s = s0; s < s0 + nw; s++) for (let z = zTop - nh; z < zTop; z++) {
      if (o.plateMat || o.plate) this.set(s, z, depth, o.plateMat || M.METAL_DARK, id); else this.tag(s, z, depth, id);
    }
    if (o.light) { const f = this.front(s0 + nw / 2, zTop - nh / 2, 3); const L = o.light; this.W.light({ x: f.x, y: f.y, z: f.z, r: L.r || 36, cr: L.c[0], cg: L.c[1], cb: L.c[2], shadow: true, skip: 2.5 }); }
    return { nw, nh, id };
  }
  poster(s0, z0, w, h, o = {}) {
    const id = this.W.obj(Object.assign({ type: 'poster', face: this.face, a0: this.a0(s0), z0, w, h }, o));
    for (let s = s0; s < s0 + w; s++) for (let z = z0; z < z0 + h; z++) this.tag(s, z, o.depth || 0, id);
    return id;
  }
  crest(s0, z0, w, h) {
    const id = this.W.obj({ type: 'crest', face: this.face, a0: this.a0(s0), z0, w, h });
    for (let s = s0; s < s0 + w; s++) for (let z = z0; z < z0 + h; z++) this.tag(s, z, 0, id);
  }
  door(s0, z0, w, h, o = {}) {
    this.rect(s0, z0, s0 + w, z0 + h, 0, 0); this.rect(s0, z0, s0 + w, z0 + h, 1, 0);
    if (o.kind) { const id = this.W.obj(Object.assign({ type: 'shop', kind: o.kind, face: this.face, a0: this.a0(s0), z0, w, h }, o)); this.rect(s0, z0, s0 + w, z0 + h, 2, M.GLASS, id); }
    else this.rect(s0, z0, s0 + w, z0 + h, 2, o.mat || M.WOOD_DARK);
    if (o.frame !== false) { this.rect(s0 - 1, z0, s0, z0 + h + 1, 0, o.frameMat || M.STONE); this.rect(s0 + w, z0, s0 + w + 1, z0 + h + 1, 0, o.frameMat || M.STONE); this.rect(s0, z0 + h, s0 + w, z0 + h + 1, 0, o.frameMat || M.STONE); }
    if (o.step) this.rect(s0 - 1, z0 - 1, s0 + w + 1, z0, -1, M.STONE);
  }
  // store de toile qui descend vers la rue
  awning(s0, w, zTop, depthOut, mat) {
    for (let k = 0; k < depthOut; k++) {
      const z = zTop - Math.floor(k * 0.6);
      this.rect(s0, z, s0 + w, z + 1, -1 - k, mat);
    }
    this.rect(s0, zTop - Math.floor((depthOut - 1) * 0.6) - 1, s0 + w, zTop - Math.floor((depthOut - 1) * 0.6), -depthOut, mat);
  }
  // enseigne en drapeau perpendiculaire à la façade
  blade(s, z0, h, out, mat) { for (let k = 1; k <= out; k++) for (let z = z0; z < z0 + h; z++) this.set(s, z, -k, mat); }
  pipe(s, z0, z1, mat = M.METAL) { for (let z = z0; z < z1; z++) this.set(s, z, -1, mat); }
}

// ---------------------------------------------------------------- toits
function gableRoof(W, x0, y0, w, d, z0, mat, o = {}) {
  const oh = o.oh != null ? o.oh : 1, sl = o.slope || 1, axis = o.axis || 'x';
  for (let k = 0; ; k++) {
    if (axis === 'x') {
      const ya = y0 - oh + k * sl, yb = y0 + d + oh - k * sl; if (yb - ya <= 0) break;
      W.box(x0, ya, z0 + k, x0 + w, yb, z0 + k + 1, mat);
      if (o.gable) for (let y = ya + sl + 1; y < yb - sl - 1; y++) if (y >= y0 && y < y0 + d) W.set(x0 + w - 1, y, z0 + k, o.gable);
      if (yb - ya <= 2 * sl && o.ridge) W.box(x0, ya, z0 + k, x0 + w, yb, z0 + k + 1, o.ridge);
    } else {
      const xa = x0 - oh + k * sl, xb = x0 + w + oh - k * sl; if (xb - xa <= 0) break;
      W.box(xa, y0, z0 + k, xb, y0 + d, z0 + k + 1, mat);
      if (o.gable) for (let x = xa + sl + 1; x < xb - sl - 1; x++) if (x >= x0 && x < x0 + w) W.set(x, y0 + d - 1, z0 + k, o.gable);
      if (xb - xa <= 2 * sl && o.ridge) W.box(xa, y0, z0 + k, xb, y0 + d, z0 + k + 1, o.ridge);
    }
  }
}
function mansard(W, x0, y0, w, d, z0, h, o = {}) {
  W.box(x0 - 1, y0 - 1, z0, x0 + w + 1, y0 + d + 1, z0 + 1, M.STONE);
  for (let k = 0; k < h; k++) { const i = Math.floor(k / 3); W.box(x0 + i, y0 + i, z0 + 1 + k, x0 + w - i, y0 + d - i, z0 + 2 + k, o.mat || M.SLATE); }
  const i = Math.floor(h / 3);
  W.box(x0 + i, y0 + i, z0 + 1 + h, x0 + w - i, y0 + d - i, z0 + 2 + h, M.ZINC);
  return z0 + 2 + h;
}
function dormer(W, face, x0, y0, w, d, at, z0, o = {}) {
  // lucarne posée sur la pente d'une mansarde, côté visible
  if (face === LEFT) {
    W.box(at, y0 + d - 3, z0, at + 5, y0 + d, z0 + 8, M.STONE);
    const f = new Facade(W, LEFT, at, y0 + d - 3, 5, 3); f.window(1, z0 + 1, 3, 5, Object.assign({ sill: false }, o));
    W.box(at - 1, y0 + d - 4, z0 + 8, at + 6, y0 + d + 1, z0 + 9, M.ZINC); W.box(at, y0 + d - 4, z0 + 9, at + 5, y0 + d, z0 + 10, M.ZINC);
  } else {
    W.box(x0 + w - 3, at, z0, x0 + w, at + 5, z0 + 8, M.STONE);
    const f = new Facade(W, RIGHT, x0 + w - 3, at, 3, 5); f.window(1, z0 + 1, 3, 5, Object.assign({ sill: false }, o));
    W.box(x0 + w - 4, at - 1, z0 + 8, x0 + w + 1, at + 6, z0 + 9, M.ZINC); W.box(x0 + w - 4, at, z0 + 9, x0 + w, at + 5, z0 + 10, M.ZINC);
  }
}
function flatRoof(W, x0, y0, w, d, z0, wall, o = {}) {
  W.box(x0, y0, z0, x0 + w, y0 + d, z0 + 1, M.ROOF_FLAT);
  const ph = o.parapet != null ? o.parapet : 2;
  if (ph > 0) {
    W.box(x0, y0, z0 + 1, x0 + w, y0 + 1, z0 + 1 + ph, wall); W.box(x0, y0 + d - 1, z0 + 1, x0 + w, y0 + d, z0 + 1 + ph, wall);
    W.box(x0, y0, z0 + 1, x0 + 1, y0 + d, z0 + 1 + ph, wall); W.box(x0 + w - 1, y0, z0 + 1, x0 + w, y0 + d, z0 + 1 + ph, wall);
    W.box(x0, y0, z0 + 1 + ph, x0 + w, y0 + 1, z0 + 2 + ph, M.STONE); W.box(x0, y0 + d - 1, z0 + 1 + ph, x0 + w, y0 + d, z0 + 2 + ph, M.STONE);
    W.box(x0, y0, z0 + 1 + ph, x0 + 1, y0 + d, z0 + 2 + ph, M.STONE); W.box(x0 + w - 1, y0, z0 + 1 + ph, x0 + w, y0 + d, z0 + 2 + ph, M.STONE);
  }
}
function chimney(W, x, y, z0, h, mat = M.BRICK) {
  W.box(x, y, z0, x + 2, y + 2, z0 + h, mat);
  W.box(x, y, z0 + h, x + 2, y + 2, z0 + h + 1, M.STONE);
  W.set(x, y + 1, z0 + h + 1, M.TERRACOTTA); W.set(x, y + 1, z0 + h + 2, M.TERRACOTTA); W.set(x + 1, y, z0 + h + 1, M.TERRACOTTA);
}
function antenna(W, x, y, z0, h = 12) {
  W.box(x, y, z0, x + 1, y + 1, z0 + h, M.METAL);
  for (const [dz, len] of [[h - 1, 4], [h - 4, 3], [h - 7, 2]]) for (let i = -len; i <= len; i++) W.set(x + i, y, z0 + dz, M.METAL);
  for (let i = -2; i <= 2; i++) W.set(x, y + i, z0 + h - 2, M.METAL);
}

// ---------------------------------------------------------------- rue
const SODIUM = [1.0, 0.64, 0.28];
function streetLamp(W, x, y, zg, dx, dy, o = {}) {
  const h = o.h || 22, I = o.I || 2.3;
  W.box(x, y, zg, x + 1, y + 1, zg + h, M.METAL_DARK);
  W.box(x, y, zg, x + 1, y + 1, zg + 2, M.METAL_DARK);
  for (let i = 1; i <= 4; i++) W.set(x + dx * i, y + dy * i, zg + h - 1 + (i < 2 ? 0 : 0), M.METAL_DARK);
  const hx = x + dx * 5, hy = y + dy * 5;
  W.box(Math.min(hx, hx + dx) , Math.min(hy, hy + dy), zg + h - 1, Math.min(hx, hx + dx) + (dx ? 2 : 1) + (dy ? 1 : 0), Math.min(hy, hy + dy) + (dy ? 2 : 1) + (dx ? 1 : 0), zg + h, M.METAL_DARK);
  W.set(hx, hy, zg + h - 2, M.BULB);
  if (dx) W.set(hx + dx, hy, zg + h - 2, M.BULB); else W.set(hx, hy + dy, zg + h - 2, M.BULB);
  if (o.on !== false) W.light({ x: hx + 0.5 + dx * 0.5, y: hy + 0.5 + dy * 0.5, z: zg + h - 2.6, r: o.r || 66, fall: 2.3, cr: SODIUM[0] * I, cg: SODIUM[1] * I, cb: SODIUM[2] * I, spot: 0.6, skip: 2.2 });
}
function planeTree(W, x, y, zg, o = {}) {
  const R = rng(o.seed || 7);
  const th = o.trunk || 15;
  W.box(x, y, zg, x + 2, y + 2, zg + th, M.BARK);
  const blobs = [[x + 1, y + 1, zg + th + 9, o.r || 8.5]];
  const nb = o.branches || 4;
  for (let i = 0; i < nb; i++) {
    const ang = i * Math.PI * 2 / nb + R() * 0.9, len = 5 + R() * 4;
    for (let t = 0; t < len; t++) W.set(Math.round(x + 0.5 + Math.cos(ang) * t * 0.75), Math.round(y + 0.5 + Math.sin(ang) * t * 0.75), zg + th + Math.round(t * 0.85), M.BARK);
    blobs.push([x + 1 + Math.cos(ang) * len * 0.9, y + 1 + Math.sin(ang) * len * 0.9, zg + th + len * 0.85 + 3, 5.5 + R() * 3]);
  }
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, z0 = 1e9, z1 = -1e9;
  for (const b of blobs) { x0 = Math.min(x0, b[0] - b[3]); x1 = Math.max(x1, b[0] + b[3]); y0 = Math.min(y0, b[1] - b[3]); y1 = Math.max(y1, b[1] + b[3]); z0 = Math.min(z0, b[2] - b[3]); z1 = Math.max(z1, b[2] + b[3]); }
  const seed = o.seed || 7;
  for (let z = Math.floor(z0); z <= z1; z++) for (let yy = Math.floor(y0); yy <= y1; yy++) for (let xx = Math.floor(x0); xx <= x1; xx++) {
    let dens = 0;
    for (const b of blobs) { const d = Math.hypot(xx - b[0], yy - b[1], (z - b[2]) * 1.25) / b[3]; dens = Math.max(dens, 1 - d); }
    const n = E.vnoise(xx * 0.35 + z * 0.21, yy * 0.35 - z * 0.17, seed) * 0.5 + hash(xx, yy, z, seed) * 0.5;
    if (dens > 0.05 + 0.32 * n && W.get(xx, yy, z) === 0) W.set(xx, yy, z, M.FOLIAGE);
  }
  W.stampLeaves(x + 1, y + 1, o.leafR || 20, o.leafAmt || 0.9);
}
function car(W, x, y, zg, axis, paint, o = {}) {
  const B = (a0, b0, z0, a1, b1, z1, m) => axis === 'x' ? W.box(x + a0, y + b0, zg + z0, x + a1, y + b1, zg + z1, m) : W.box(x + b0, y + a0, zg + z0, x + b1, y + a1, zg + z1, m);
  const S = (a, b, z, m) => axis === 'x' ? W.set(x + a, y + b, zg + z, m) : W.set(x + b, y + a, zg + z, m);
  B(2, 0, 0, 5, 1, 3, M.TIRE); B(14, 0, 0, 17, 1, 3, M.TIRE); B(2, 7, 0, 5, 8, 3, M.TIRE); B(14, 7, 0, 17, 8, 3, M.TIRE);
  B(0, 1, 1, 19, 7, 5, paint);
  B(0, 1, 1, 1, 7, 2, M.CHROME); B(18, 1, 1, 19, 7, 2, M.CHROME);
  B(1, 1, 5, 6, 7, 6, paint);
  B(6, 1, 5, 17, 7, 8, M.CAR_GLASS);
  B(6, 1, 5, 7, 7, 8, paint); B(11, 1, 5, 12, 7, 8, paint); B(16, 1, 5, 17, 7, 8, paint);
  B(6, 1, 8, 17, 7, 9, paint);
  B(17, 1, 5, 18, 7, 7, paint);
  S(0, 1, 3, M.WHITE); S(0, 6, 3, M.WHITE);
  S(18, 1, 3, M.PLASTIC_RED); S(18, 6, 3, M.PLASTIC_RED);
}
function bench(W, x, y, zg, axis) {
  const B = (a0, b0, z0, a1, b1, z1, m) => axis === 'x' ? W.box(x + a0, y + b0, zg + z0, x + a1, y + b1, zg + z1, m) : W.box(x + b0, y + a0, zg + z0, x + b1, y + a1, zg + z1, m);
  B(0, 0, 0, 1, 2, 2, M.METAL_DARK); B(6, 0, 0, 7, 2, 2, M.METAL_DARK);
  B(0, 0, 2, 7, 2, 3, M.WOOD); B(0, 0, 3, 7, 1, 5, M.WOOD);
}
function bollard(W, x, y, zg, m = M.METAL_BORD) { W.box(x, y, zg, x + 1, y + 1, zg + 4, m); W.set(x, y, zg + 4, M.STONE); }
function bin(W, x, y, zg) { W.box(x, y, zg, x + 2, y + 2, zg + 4, M.BIN); }
function terraceTable(W, x, y, zg) { W.box(x + 1, y + 1, zg, x + 2, y + 2, zg + 4, M.METAL_DARK); W.box(x, y, zg + 4, x + 3, y + 3, zg + 5, M.METAL); }
function chair(W, x, y, zg, back) { W.box(x, y, zg, x + 2, y + 2, zg + 2, M.WOOD); if (back === 'x') W.box(x, y, zg + 2, x + 1, y + 2, zg + 5, M.WOOD); else W.box(x, y, zg + 2, x + 2, y + 1, zg + 5, M.WOOD); }
function parasol(W, x, y, zg) { W.box(x, y, zg, x + 1, y + 1, zg + 12, M.METAL); W.box(x - 1, y - 1, zg + 7, x + 2, y + 2, zg + 12, M.CANVAS); W.box(x, y, zg + 12, x + 1, y + 1, zg + 13, M.CANVAS); }
function keg(W, x, y, zg) { W.box(x, y, zg, x + 2, y + 2, zg + 3, M.KEG); }
function crates(W, x, y, zg, n, m = M.CRATE_RED) { for (let i = 0; i < n; i++) W.box(x, y, zg + i * 2, x + 3, y + 2, zg + i * 2 + 2, i % 2 ? M.CRATE_GREEN : m); }
function phoneBooth(W, x, y, zg) {
  W.box(x, y, zg, x + 5, y + 5, zg + 12, M.BOOTH);
  for (const [a, b] of [[0, 0], [4, 0], [0, 4], [4, 4]]) W.box(x + a, y + b, zg, x + a + 1, y + b + 1, zg + 12, M.METAL_DARK);
  W.box(x, y, zg + 12, x + 5, y + 5, zg + 14, M.METAL_DARK); W.box(x + 1, y + 1, zg + 2, x + 2, y + 2, zg + 7, M.METAL);
  W.box(x, y, zg + 14, x + 5, y + 5, zg + 15, M.METAL_DARK);
  W.light({ x: x + 2.5, y: y + 2.5, z: zg + 11, r: 16, cr: 0.32, cg: 0.30, cb: 0.22, shadow: false });
}
function busShelter(W, x, y, zg, len, o = {}) {
  // abri le long de x, ouvert côté +y
  W.box(x, y, zg, x + len, y + 1, zg + 11, M.BOOTH);
  W.box(x, y, zg, x + 1, y + 5, zg + 11, M.METAL_DARK); W.box(x + len - 1, y, zg, x + len, y + 5, zg + 11, M.METAL_DARK);
  W.box(x - 1, y - 1, zg + 11, x + len + 1, y + 6, zg + 12, M.METAL);
  W.box(x + len, y + 1, zg + 1, x + len + 1, y + 5, zg + 10, M.LIT_PANEL);
  W.box(x + 2, y + 1, zg + 2, x + len - 2, y + 3, zg + 3, M.WOOD);
  if (o.poster) { const f = new Facade(W, RIGHT, x + len, y + 1, 1, 4); f.poster(0, zg + 1, 4, 9, Object.assign({ depth: 0, lit: 0.7 }, o.poster)); }
  W.light({ x: x + len + 1.5, y: y + 3, z: zg + 6, r: 18, cr: 0.5, cg: 0.52, cb: 0.48, shadow: false });
}
function kiosk(W, x, y, zg, o = {}) {
  W.box(x, y, zg, x + 11, y + 11, zg + 12, M.METAL_GREEN);
  W.box(x - 1, y - 1, zg + 12, x + 12, y + 12, zg + 13, M.METAL_GREEN);
  W.box(x, y, zg + 13, x + 11, y + 11, zg + 15, M.METAL_GREEN);
  W.box(x + 2, y + 2, zg + 15, x + 9, y + 9, zg + 16, M.METAL_GREEN);
  W.box(x + 4, y + 4, zg + 16, x + 7, y + 7, zg + 18, M.METAL_GREEN);
  W.set(x + 5, y + 5, zg + 18, M.METAL_GREEN); W.set(x + 5, y + 5, zg + 19, M.METAL_GREEN);
  const fl = new Facade(W, LEFT, x, y, 11, 11), fr = new Facade(W, RIGHT, x, y, 11, 11);
  fl.door(2, zg, 7, 9, { frame: false, kind: 'rideau' });
  fl.sign(2, zg + 13, "L'ÉCHO", { scale: 1, fg: [0.85, 0.80, 0.62], depth: 0 });
  fr.poster(1, zg + 2, 4, 8, { title: o.headline || 'DERBY', bg: [0.82, 0.78, 0.66], fg: [0.10, 0.09, 0.08], band: [0.42, 0.10, 0.16], seed: 3 });
  fr.poster(6, zg + 2, 4, 8, { title: 'COUPE', bg: [0.78, 0.74, 0.62], fg: [0.42, 0.10, 0.16], seed: 4 });
}
function railing(W, x0, y0, x1, y1, zg, h = 4, m = M.METAL_DARK, step = 3) {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  for (let i = 0; i <= n; i++) {
    const x = Math.round(x0 + (x1 - x0) * i / n), y = Math.round(y0 + (y1 - y0) * i / n);
    W.set(x, y, zg + h, m);
    if (i % step === 0) for (let z = zg; z < zg + h; z++) W.set(x, y, z, m);
  }
}
function moped(W, x, y, zg, axis) {
  const B = (a0, b0, z0, a1, b1, z1, m) => axis === 'x' ? W.box(x + a0, y + b0, zg + z0, x + a1, y + b1, zg + z1, m) : W.box(x + b0, y + a0, zg + z0, x + b1, y + a1, zg + z1, m);
  B(0, 0, 0, 2, 1, 2, M.TIRE); B(5, 0, 0, 7, 1, 2, M.TIRE);
  B(1, 0, 2, 6, 1, 3, M.CAR_BLUE); B(3, 0, 3, 5, 1, 4, M.WOOD_DARK); B(1, 0, 3, 2, 1, 6, M.METAL_DARK); B(1, -1, 6, 2, 2, 7, M.METAL_DARK);
}

// ---------------------------------------------------------------- stade
function pylon(W, x, y, zg, h, o = {}) {
  // pylône en treillis : quatre montants, croisillons, rampe de projecteurs
  const base = 4;
  for (let z = zg; z < zg + h; z++) {
    const t = (z - zg) / h, inset = Math.round(t * 1.5);
    const a = x + inset, b = x + base - 1 - inset, c = y + inset, d = y + base - 1 - inset;
    W.set(a, c, z, M.METAL_DARK); W.set(b, c, z, M.METAL_DARK); W.set(a, d, z, M.METAL_DARK); W.set(b, d, z, M.METAL_DARK);
    const ph = (z - zg) % 8;
    if (ph === 0) { for (let i = a; i <= b; i++) { W.set(i, c, z, M.METAL_DARK); W.set(i, d, z, M.METAL_DARK); } for (let j = c; j <= d; j++) { W.set(a, j, z, M.METAL_DARK); W.set(b, j, z, M.METAL_DARK); } }
    else if (b - a >= 2) { const k = Math.round(ph / 8 * (b - a)); W.set(a + k, d, z, M.METAL_DARK); W.set(b, c + k, z, M.METAL_DARK); }
  }
  const tz = zg + h;
  W.box(x - 3, y + 1, tz, x + base + 3, y + 3, tz + 7, M.METAL_DARK);
  const FL = o.on === false ? M.FLOOD_OFF : M.FLOOD;
  for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) W.box(x - 2 + i * 2.5, y + 2, tz + 1 + j * 3, x - 2 + i * 2.5 + 2, y + 3, tz + 3 + j * 3, FL);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) W.box(x - 2 + i * 2.5, y + 1, tz + 7, x - 2 + i * 2.5 + 2, y + 3, tz + 8, FL);
  if (o.on !== false) {
    const ax = o.aim || [-0.55, -0.55, -0.62]; const al = Math.hypot(ax[0], ax[1], ax[2]);
    W.light({ x: x + 2, y: y + 2, z: tz + 4, r: o.r || 300, fall: 1.4, cr: 0.95 * (o.I || 0.7), cg: 0.93 * (o.I || 0.7), cb: 0.86 * (o.I || 0.7), skip: 6, axis: [ax[0] / al, ax[1] / al, ax[2] / al], c0: 0.55, c1: 0.85, spill: o.spill != null ? o.spill : 0.12 });
  }
}

module.exports = { Facade, gableRoof, mansard, dormer, flatRoof, chimney, antenna, streetLamp, planeTree, car, bench, bollard, bin, terraceTable, chair, parasol, keg, crates, phoneBooth, busShelter, kiosk, railing, moped, pylon };
