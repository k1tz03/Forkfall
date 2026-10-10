'use strict';
// FUSIBLE — la vieille ville d'Aubérive, au nord de la rivière (200 m × 45 m, 1 voxel = 20 cm).
// La place de la Mairie et son marché du dimanche, l'église et son clocher, la rédaction de L'Écho et sa
// rotative, le cinéma L'Aurore, le café de la Mairie, la boulangerie, la librairie-papeterie, les ruelles,
// les jardins de derrière, et la rangée de façades sur le quai (la vue depuis la rivière).
// Coordonnées locales : x ∈ [0, 1000) vers l'est, y ∈ [0, 226) vers le sud ; le quai nord est au sud (y = 226).
const E = require('./engine');
const { M } = require('./mats');
const B = require('./build');
const SPR = require('./sprites');
const { LEFT, RIGHT, TOP, hash, vnoise, fbm, mod, clamp, material, overlay, textBitmap } = E;
const { Facade } = B;

const WD = 1000, HT = 226, G = 2;

// ================================================================ petites fonctions de teinte
const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const grain = (c, amt, s = 0) => mul(c, 1 + (hash(c.a, c.b, c.face * 7 + s, c.m) - 0.5) * 2 * amt);
const along = c => c.face === LEFT ? c.hx : c.hy;
const grime = (c, h = 4, k = 0.24) => { if (c.face !== TOP) { const t = clamp((c.hz - G) / h, 0, 1); mul(c, 1 - k * (1 - t)); } };
const puddle = (c, scale, thr, s) => { if (c.face !== TOP) return; const p = fbm(c.hx / scale + 3.1, c.hy / scale - 1.7, s, 3); if (p > thr) c.wet = clamp((p - thr) * 12, 0, 1); };
const fallen = (c, k = 1) => {
  if (c.face !== TOP) return;
  const W = c.W; const ix = Math.floor(c.hx), iy = Math.floor(c.hy);
  if (ix < 0 || iy < 0 || ix >= W.X || iy >= W.Y) return;
  const d = W.leaf[iy * W.X + ix] * k; if (d <= 0) return;
  if (hash(c.a, c.b, 913, 5) < d * 0.42) { const v = hash(c.a, c.b, 914, 1); if (v < 0.4) rgb(c, 0.62, 0.42, 0.14); else if (v < 0.7) rgb(c, 0.52, 0.24, 0.10); else rgb(c, 0.40, 0.33, 0.13); c.wet *= 0.3; }
};
const tintC = (c, k) => { c.cr *= k[0]; c.cg *= k[1]; c.cb *= k[2]; };

// ================================================================ matières (sept, pas plus)
const VM = {};
VM.ASHLAR = material('vieille ville · pierre de taille', c => {
  if (c.face === TOP) { rgb(c, 0.64, 0.61, 0.54); grain(c, 0.05); return; }
  const course = Math.floor(c.b / 5), off = (course & 1) * 6;
  const la = mod(c.a + off, 12), lb = mod(c.b, 5);
  if (lb === 0 || la === 0) rgb(c, 0.56, 0.53, 0.47);
  else { const h = hash(Math.floor((c.a + off) / 12), course, 401, c.face); const k = 0.9 + h * 0.15; rgb(c, 0.75 * k, 0.71 * k, 0.61 * k); grain(c, 0.03); }
  mul(c, 0.92 + 0.14 * fbm(along(c) / 9, c.hz / 12, 402));
  grime(c, 6, 0.24);
});
VM.CHURCH = material("vieille ville · pierre de l'église", c => {
  if (c.face === TOP) { rgb(c, 0.50, 0.48, 0.43); grain(c, 0.08); return; }
  const course = Math.floor(c.b / 4), off = Math.floor(hash(course, 0, 403, 0) * 12);
  const L = 6 + Math.floor(hash(course, 1, 403, 0) * 6);
  const la = mod(c.a + off, L), lb = mod(c.b, 4);
  if (lb === 0 || la === 0) rgb(c, 0.40, 0.38, 0.34);
  else {
    const h = hash(Math.floor((c.a + off) / L), course, 404, c.face); const k = 0.82 + h * 0.3;
    rgb(c, 0.62 * k, 0.58 * k, 0.50 * k); grain(c, 0.05);
    if (hash(c.a >> 1, c.b >> 1, 405, 0) < 0.05) { c.cg *= 1.12; c.cr *= 0.9; c.cb *= 0.85; }
  }
  mul(c, 0.84 + 0.26 * fbm(along(c) / 8, c.hz / 10, 406));
  grime(c, 9, 0.3);
});
VM.FLAGSTONE = material('vieille ville · dallage', c => {
  if (c.face !== TOP) { rgb(c, 0.50, 0.48, 0.44); grain(c, 0.05); return; }
  const row = Math.floor(c.b / 6), off = (row & 1) * 4;
  const ga = mod(c.a + off, 8), gb = mod(c.b, 6);
  const slab = hash(Math.floor((c.a + off) / 8), row, 407, 0);
  let k = 0.47 + slab * 0.09; if (ga === 0 || gb === 0) k *= 0.7;
  rgb(c, k * 1.03, k * 0.99, k * 0.91); grain(c, 0.035);
  puddle(c, 10, 0.64, 408); fallen(c, 1);
});
VM.TILE = material('vieille ville · tuiles plates', c => {
  const row = Math.floor(c.b / 2), off = row & 1;
  const h = hash(Math.floor((c.a + off) / 2), row, 409, c.face);
  let k = 0.8 + h * 0.3; if (h > 0.97) k *= 0.7;
  rgb(c, 0.46 * k, 0.27 * k, 0.18 * k);
  if (c.face === TOP) { if (mod(c.b, 2) === 0) mul(c, 0.84); } else { mul(c, 0.7); if (mod(c.b, 2) === 0) mul(c, 0.85); }
  if (fbm(c.hx / 5, c.hy / 5 + c.hz / 4, 410) > 0.63) { c.cr *= 0.82; c.cg *= 1.02; c.cb *= 0.78; }
});
VM.WATER = material('vieille ville · eau de fontaine', c => {
  if (c.face === TOP) { rgb(c, 0.06, 0.10, 0.11); c.wet = 0.95; if (vnoise(c.hx * 0.9, c.hy * 0.9, 411) > 0.72) rgb(c, 0.12, 0.17, 0.18); return; }
  rgb(c, 0.50, 0.62, 0.66); if (mod(c.b + c.a, 3) === 0) rgb(c, 0.72, 0.80, 0.82);
}, { noAO: true, noAOrecv: true, noShadow: true });
VM.GOLD = material('vieille ville · dorure', c => { rgb(c, 0.82, 0.63, 0.22); if (c.face === TOP) mul(c, 1.15); grain(c, 0.1); });
VM.BRONZE = material('vieille ville · bronze patiné', c => {
  rgb(c, 0.30, 0.43, 0.37); const h = hash(c.a, c.b, 412, c.face);
  if (h < 0.22) rgb(c, 0.20, 0.25, 0.21); else if (h > 0.86) rgb(c, 0.45, 0.58, 0.49);
  if (c.face === TOP) mul(c, 1.12);
});

// ================================================================ calques
function loc(o, c) {
  const la = o.face === LEFT ? Math.floor(2 * c.hx) - 2 * o.a0 : 2 * o.a0 - 1 - Math.floor(2 * c.hy);
  return [la, Math.floor(2 * c.hz) - 2 * o.z0];
}
overlay('vieille_tint', (o, c) => tintC(c, o.k));
overlay('vieille_paint', (o, c) => {
  const p = o.col; rgb(c, p[0], p[1], p[2]); grain(c, o.grain != null ? o.grain : 0.05);
  if (o.emit) { c.er = o.emit[0]; c.eg = o.emit[1]; c.eb = o.emit[2]; }
});
overlay('vieille_stripe', (o, c) => {
  const t = o.dir === 'z' ? Math.floor(2 * c.hz) : o.dir === 'y' ? Math.floor(2 * c.hy) : Math.floor(2 * c.hx);
  const p = o.cols[mod(Math.floor(t / (o.p || 3)), o.cols.length)];
  rgb(c, p[0], p[1], p[2]); if (c.face !== TOP && o.dir !== 'z') mul(c, 0.86); grain(c, 0.04);
});
// colombages : poteaux, sablières, allèges, écharpes et croix de Saint-André sur l'enduit
overlay('vieille_timber', (o, c) => {
  if (o.k) tintC(c, o.k);
  if (c.face !== o.face) return;
  const [la, lb] = loc(o, c);
  const W2 = o.w * 2; if (la < 0 || la >= W2 || lb < 0) return;
  const ps = o.ps || 10, fh = (o.fh || 15) * 2, sill = o.sill || 8;
  const st = Math.floor(lb / fh), sl = lb - st * fh;
  const pa = mod(la, ps), pi = Math.floor(la / ps);
  let beam = pa < 2 || la < 2 || la >= W2 - 2 || sl < 2 || sl >= fh - 1 || sl === sill || sl === sill + 1;
  if (!beam) {
    const kind = hash(pi, st, 461, o.seed || 0);
    const u = (pa - 1.5) / (ps - 2);
    if (sl > sill + 1) {
      const v = (sl - sill - 1.5) / (fh - sill - 3);
      if (kind < 0.3) beam = Math.abs(u - v) < 0.13;
      else if (kind < 0.55) beam = Math.abs(u - (1 - v)) < 0.13;
      else if (kind < 0.68) beam = Math.abs(u - v) < 0.11 || Math.abs(u - (1 - v)) < 0.11;
    } else {
      const v = (sl - 1.5) / (sill - 2);
      if (kind > 0.45) beam = Math.abs(u - v) < 0.17 || Math.abs(u - (1 - v)) < 0.17;
    }
  }
  if (beam) { const bc = o.beam || [0.23, 0.15, 0.10]; const g = 0.82 + hash(pi, st, 462, Math.floor(lb / 4)) * 0.3; rgb(c, bc[0] * g, bc[1] * g, bc[2] * g); }
});
// bossages du rez-de-chaussée (refends horizontaux)
overlay('vieille_rustic', (o, c) => {
  if (c.face === TOP) return;
  const lb = Math.floor(2 * c.hz);
  if (mod(lb, 6) === 0) mul(c, 0.62); else if (mod(lb, 6) === 1) mul(c, 1.08);
  const course = Math.floor(lb / 6), la = Math.floor(2 * along(c)) + (course & 1) * 9;
  if (mod(la, 18) === 0) mul(c, 0.8);
});
// cadran d'horloge : couronne dorée, douze index, deux aiguilles, éclairé la nuit
overlay('vieille_clock', (o, c) => {
  if (c.face !== o.face) return;
  const [la, lb] = loc(o, c);
  const r = o.w;  // rayon en texels (le cadran fait 2r texels = w voxels de diamètre ... w = rayon voxel ×2 / 2)
  const cx = la + 0.5 - r, cy = lb + 0.5 - r, d = Math.hypot(cx, cy);
  if (d > r) return;
  let col = [0.88, 0.86, 0.78];
  if (d > r - 1.4) col = [0.82, 0.63, 0.22];
  else {
    for (let i = 0; i < 12; i++) { const a = i / 12 * 2 * Math.PI; if (Math.hypot(cx - Math.sin(a) * (r - 2.6), cy - Math.cos(a) * (r - 2.6)) < (i % 3 ? 0.6 : 0.95)) col = [0.12, 0.10, 0.08]; }
    const hand = (a, len, wd) => { const ux = Math.sin(a), uy = Math.cos(a), t = cx * ux + cy * uy; if (t < -0.6 || t > len) return false; return Math.hypot(cx - ux * t, cy - uy * t) < wd; };
    const hA = ((o.hour % 12) + o.min / 60) / 12 * 2 * Math.PI, mA = o.min / 60 * 2 * Math.PI;
    if (hand(hA, r * 0.52, 0.85) || hand(mA, r * 0.82, 0.62) || d < 0.9) col = [0.08, 0.07, 0.06];
  }
  rgb(c, col[0], col[1], col[2]);
  if (o.lit) { c.er = col[0] * o.lit; c.eg = col[1] * o.lit * 0.92; c.eb = col[2] * o.lit * 0.7; } else { c.er = c.eg = c.eb = 0; }
});
// vitraux : lancettes en arc brisé et rose ; plomb, verres colorés, lueur la nuit
const VIT = [[0.18, 0.28, 0.85], [0.85, 0.16, 0.14], [0.95, 0.72, 0.20], [0.20, 0.62, 0.32], [0.55, 0.24, 0.72], [0.22, 0.45, 0.85], [0.90, 0.45, 0.15]];
overlay('vieille_vitrail', (o, c) => {
  if (c.face !== o.face) return;
  const [la, lb] = loc(o, c); const W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  const cx = la + 0.5 - W2 / 2;
  let inside = true, lead = false, col = VIT[0];
  if (o.shape === 'rose') {
    const R = W2 / 2, cy = lb + 0.5 - H2 / 2, d = Math.hypot(cx, cy);
    if (d > R) inside = false;
    else if (d > R - 1.3) lead = true;
    else {
      const t = (Math.atan2(cy, cx) / (2 * Math.PI) + 1) * 12, sec = Math.floor(t) % 12, fr = t - Math.floor(t);
      const ring = d < R * 0.32 ? 0 : d < R * 0.66 ? 1 : 2;
      if (ring > 0 && (fr < 0.14 || fr > 0.86)) lead = true;
      if (Math.abs(d - R * 0.32) < 0.55 || Math.abs(d - R * 0.66) < 0.55) lead = true;
      col = ring === 0 ? VIT[2] : VIT[(ring * 3 + sec) % VIT.length];
    }
  } else {
    const half = W2 / 2, spring = H2 - Math.sqrt(3) / 2 * W2;
    if (lb >= spring) { const h = lb + 0.5 - spring; const lim = Math.sqrt(Math.max(0, W2 * W2 - h * h)) - half; if (Math.abs(cx) > lim) inside = false; }
    if (inside) {
      if (mod(lb, 5) === 0 || (o.w >= 4 && Math.abs(cx) < 0.6) || la === 0 || la === W2 - 1) lead = true;
      col = VIT[Math.floor(hash(Math.floor(la / 3), Math.floor(lb / 5), 421, o.seed || 0) * VIT.length)];
    }
  }
  if (!inside) { const s = o.stone || [0.50, 0.47, 0.42]; rgb(c, s[0], s[1], s[2]); c.er = c.eg = c.eb = 0; return; }
  if (lead) { rgb(c, 0.06, 0.055, 0.05); c.er = c.eg = c.eb = 0; return; }
  const e = o.lit || 0;
  if (e > 0) { rgb(c, col[0] * 0.3, col[1] * 0.3, col[2] * 0.3); c.er = col[0] * e; c.eg = col[1] * e; c.eb = col[2] * e; }
  else { rgb(c, 0.05 + col[0] * 0.2, 0.05 + col[1] * 0.2, 0.06 + col[2] * 0.22); if (mod(la - lb, 7) === 0) mul(c, 1.5); }
});
// marchandises du marché, vues du dessus : cageots, fruits, légumes, fleurs, fromages
overlay('vieille_produce', (o, c) => {
  if (c.face !== TOP) return;
  const la = Math.floor(2 * c.hx), lb = Math.floor(2 * c.hy);
  const ca = Math.floor(la / 5), cb = Math.floor(lb / 4), ia = mod(la, 5), ib = mod(lb, 4);
  if (ia === 0 || ib === 0) { rgb(c, 0.44, 0.32, 0.19); return; }
  const p = o.pal[Math.floor(hash(ca, cb, 471, o.seed || 0) * o.pal.length)];
  const d = hash(la, lb, 472, 0); let k = 0.78 + d * 0.42; if (d < 0.16) k *= 0.6;
  rgb(c, p[0] * k, p[1] * k, p[2] * k);
});
// jardinières : feuillage piqué de fleurs, sur toutes les faces
overlay('vieille_flowers', (o, c) => {
  const h = hash(c.a, c.b, 591, c.face);
  if (h < 0.42) { const p = o.pal[Math.floor(hash(c.a >> 1, c.b >> 1, 592, c.face) * o.pal.length)]; rgb(c, p[0], p[1], p[2]); if (c.face === TOP) mul(c, 1.1); }
});
// cercles de pavés autour de la fontaine
overlay('vieille_rings', (o, c) => {
  if (c.face !== TOP) return;
  const d = Math.hypot(c.hx - o.cx, c.hy - o.cy);
  if (d < o.r0 || d > o.r1) return;
  const ring = Math.floor((d - o.r0) / 1.5);
  if (ring % 4 === 0) { mul(c, 0.72); c.cb *= 1.05; } else if (ring % 4 === 2) { c.cr *= 1.12; c.cg *= 1.04; c.cb *= 0.9; }
});
// enseigne-tableau : lettres et plaque, pour les vitrines et les panneaux (texte centré possible)
overlay('vieille_une', (o, c) => {
  if (c.face !== o.face) return;
  const [la, lb] = loc(o, c); const W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  const lt = H2 - 1 - lb;
  let col = [0.84, 0.82, 0.74];
  if (la === 0 || la === W2 - 1 || lt === 0 || lt === H2 - 1) col = [0.10, 0.10, 0.09];
  else {
    if (!o.bm) { o.bm = textBitmap(o.mast || "L'ÉCHO"); o.bt = textBitmap(o.title || ''); }
    const mx = la - Math.floor((W2 - o.bm.w) / 2), tx = la - Math.floor((W2 - o.bt.w) / 2);
    if (lt >= 1 && lt <= 6 && o.bm.at(mx, lt - 1)) col = [0.10, 0.09, 0.08];
    else if (lt === 8) col = [0.20, 0.18, 0.16];
    else if (lt >= 10 && lt <= 15 && o.bt.at(tx, lt - 10)) col = [0.42, 0.10, 0.16];
    else if (lt >= 17 && lt < H2 - 3) {
      if (la < W2 * 0.6 && lt < H2 * 0.7) { col = [0.36, 0.38, 0.40]; const fx = la - W2 * 0.3, fy = lt - H2 * 0.45; if (fx * fx + fy * fy * 0.6 < 5 || (Math.abs(fx) < 3 && fy > 1.5)) col = [0.62, 0.62, 0.60]; }
      else if (mod(lt, 2) === 1 && hash(Math.floor(la / 3), lt, 431, o.seed || 0) < 0.8) col = [0.46, 0.45, 0.42];
    }
  }
  rgb(c, col[0], col[1], col[2]);
  if (o.lit) { c.er = col[0] * o.lit; c.eg = col[1] * o.lit; c.eb = col[2] * o.lit * 0.85; } else { c.er = c.eg = c.eb = 0; }
});
// affiches de cinéma : un dessin simple, le titre, et la barre « FERMÉ » en mauvaise saison
overlay('vieille_affiche', (o, c) => {
  if (c.face !== o.face) return;
  const [la, lb] = loc(o, c); const W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  const lt = H2 - 1 - lb;
  let col = o.bg;
  if (la === 0 || la === W2 - 1 || lt === 0 || lt === H2 - 1) col = [0.14, 0.11, 0.08];
  else {
    const cx = W2 / 2, cy = H2 * 0.36, r = W2 * 0.3, d = Math.hypot(la + 0.5 - cx, lt + 0.5 - cy);
    if (o.art === 'sun') { if (d < r) col = [0.96, 0.74, 0.24]; else if (lt > cy + 1 && lt < cy + r + 2) col = o.fg; }
    else if (o.art === 'face') { if (d < r) col = lt < cy - r * 0.35 ? [0.18, 0.11, 0.07] : [0.86, 0.66, 0.50]; else if (Math.abs(la + 0.5 - cx) < r * 1.4 && lt > cy + r - 1 && lt < H2 - 10) col = o.fg; }
    else if (o.art === 'ball') { if (d < r) col = (mod(Math.floor(la / 2) + Math.floor(lt / 2), 2) ? [0.92, 0.90, 0.84] : [0.15, 0.14, 0.14]); else if (lt > H2 * 0.62 && lt < H2 - 10) col = [0.22, 0.42, 0.20]; }
    else if (o.art === 'city') { if (lt > H2 * 0.3 && lt < H2 - 10 && hash(Math.floor(la / 3), 0, 441, o.seed || 0) * H2 * 0.4 + H2 * 0.3 < lt) col = mod(la + lt, 4) === 0 ? [0.95, 0.8, 0.4] : o.fg; }
    if (!o.bmp) o.bmp = textBitmap(o.title || '');
    const tx = la - Math.floor((W2 - o.bmp.w) / 2), ty = lt - (H2 - 8);
    if (ty >= 0 && o.bmp.at(tx, ty)) col = o.tc || [0.95, 0.90, 0.75];
  }
  if (o.barre) {
    const s = W2 / H2;
    if (Math.abs(la - lt * s) < 1.6 || Math.abs(la - (H2 - 1 - lt) * s) < 1.6) col = [0.78, 0.10, 0.10];
    const m0 = Math.floor(H2 * 0.42);
    if (lt >= m0 && lt < m0 + 8) {
      if (!o.fbm) o.fbm = textBitmap('FERMÉ');
      col = [0.93, 0.91, 0.86];
      if (o.fbm.at(la - Math.floor((W2 - o.fbm.w) / 2), lt - m0 - 1)) col = [0.80, 0.08, 0.08];
    }
  }
  rgb(c, col[0], col[1], col[2]);
  if (o.lit) { c.er = col[0] * o.lit; c.eg = col[1] * o.lit; c.eb = col[2] * o.lit; } else { c.er = c.eg = c.eb = 0; }
});
// plaque du monument : pierre sombre, lignes de noms gravés à l'or
overlay('vieille_names', (o, c) => {
  if (c.face !== o.face) return;
  const [la, lb] = loc(o, c); const W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  rgb(c, 0.20, 0.20, 0.21);
  const lt = H2 - 1 - lb;
  if (la === 0 || la === W2 - 1 || lt === 0 || lt === H2 - 1) { rgb(c, 0.55, 0.52, 0.46); return; }
  if (lt >= 2 && lt <= 3 && la > 2 && la < W2 - 3) rgb(c, 0.80, 0.62, 0.24);
  else if (lt > 5 && mod(lt, 2) === 0 && la > 1 && la < W2 - 2 && hash(Math.floor(la / 2), lt, 451, o.seed || 0) < 0.72) rgb(c, 0.70, 0.56, 0.26);
});

// ---------------------------------------------------------------- intérieurs de vitrines
const VSHOP = {
  cafe(la, lb, W2, H2, c, o) {
    if (mod(la, 16) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.10, 0.07, 0.05); return null; }
    if (lb < 7) return lb === 6 ? [0.72, 0.70, 0.64, 0.6] : [0.34, 0.20, 0.12, 0.36];
    if (lb >= 12 && lb <= 21) {
      if (mod(lb - 12, 5) === 4) return [0.46, 0.30, 0.18, 0.46];
      const h = hash(la, Math.floor((lb - 12) / 5), 481, 0);
      if (h < 0.55 && mod(la, 2) === 0) { const p = [[0.25, 0.48, 0.25], [0.62, 0.36, 0.12], [0.82, 0.76, 0.56], [0.58, 0.15, 0.12], [0.30, 0.30, 0.52]][Math.floor(h / 0.55 * 5)]; return [p[0], p[1], p[2], 0.7]; }
    }
    if (lb >= H2 - 5 && lb <= H2 - 3 && mod(la, 10) >= 4 && mod(la, 10) <= 6) return [1.25, 1.05, 0.72, 0.95];
    for (const hx of o.heads || []) { const dx = la - hx; if (dx * dx + (lb - 10.5) * (lb - 10.5) * 1.2 < 4.5 || (lb <= 8 && lb >= 5 && Math.abs(dx) < 3.5)) { rgb(c, 0.05, 0.035, 0.03); return null; } }
    return [1.0, 0.64, 0.30, 0.62 + 0.14 * lb / H2];
  },
  boulangerie(la, lb, W2, H2, c, o) {
    if (mod(la, 14) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.12, 0.09, 0.06); return null; }
    if (lb < 7) { if (lb === 6) return [0.92, 0.86, 0.70, 0.6]; if (lb >= 3) { const h = hash(la, 0, 491, 0); const p = [[0.95, 0.80, 0.45], [0.72, 0.36, 0.20], [0.92, 0.56, 0.62], [0.96, 0.92, 0.80], [0.56, 0.30, 0.16]][Math.floor(h * 5)]; return [p[0], p[1], p[2], 0.6]; } return [0.50, 0.34, 0.20, 0.35]; }
    const row = Math.floor((lb - 7) / 5), rl = (lb - 7) % 5;
    if (rl === 0) return [0.42, 0.28, 0.16, 0.42];
    if (row >= 1 && row <= 2 && mod(la, 3) !== 2) return [0.90, 0.64, 0.30, 0.72];
    if (row === 0 && rl <= 3 && hash(Math.floor(la / 3), row, 492, 0) < 0.8) return mod(Math.floor(la / 3), 2) ? [0.82, 0.54, 0.26, 0.72] : [0.66, 0.40, 0.18, 0.72];
    return [1.0, 0.84, 0.56, 0.62];
  },
  librairie(la, lb, W2, H2, c, o) {
    if (mod(la, 15) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.10, 0.08, 0.06); return null; }
    if (lb < 6) { if (lb === 5) return [0.70, 0.62, 0.48, 0.5]; const h = hash(Math.floor(la / 2), 0, 501, 0); const p = [[0.85, 0.82, 0.70], [0.30, 0.40, 0.60], [0.70, 0.25, 0.20], [0.85, 0.70, 0.30]][Math.floor(h * 4)]; return [p[0], p[1], p[2], 0.55]; }
    const row = Math.floor((lb - 6) / 5), rl = (lb - 6) % 5;
    if (rl === 0) return [0.40, 0.27, 0.15, 0.45];
    const h = hash(la, row, 502, 0);
    if (h < 0.88) { const p = [[0.60, 0.14, 0.14], [0.18, 0.28, 0.52], [0.20, 0.42, 0.24], [0.82, 0.72, 0.42], [0.85, 0.82, 0.74], [0.42, 0.22, 0.40], [0.12, 0.12, 0.12]][Math.floor(h / 0.88 * 7)]; return [p[0], p[1], p[2], rl === 1 && h < 0.3 ? 0.4 : 0.66]; }
    return [1.0, 0.80, 0.50, 0.6];
  },
  fleuriste(la, lb, W2, H2, c, o) {
    if (mod(la, 14) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.08, 0.10, 0.07); return null; }
    if (lb < 12) { const h = hash(Math.floor(la / 2), Math.floor(lb / 2), 511, 0); if (lb < 4) return [0.30, 0.32, 0.30, 0.4]; if (h < 0.4) return [0.20, 0.50, 0.22, 0.6]; const p = [[0.90, 0.20, 0.25], [0.95, 0.85, 0.30], [0.95, 0.95, 0.90], [0.85, 0.45, 0.70], [0.95, 0.55, 0.15]][Math.floor((h - 0.4) / 0.6 * 5)]; return [p[0], p[1], p[2], 0.75]; }
    if (lb < 20 && hash(Math.floor(la / 3), Math.floor(lb / 3), 512, 0) < 0.5) return [0.18, 0.45, 0.20, 0.55];
    return [0.92, 0.95, 0.80, 0.55];
  },
  boucherie(la, lb, W2, H2, c, o) {
    if (mod(la, 16) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.10, 0.08, 0.08); return null; }
    if (lb < 7) return lb === 6 ? [0.90, 0.90, 0.88, 0.6] : [0.82, 0.82, 0.80, 0.5];
    if (lb >= 7 && lb < 10) { const h = hash(Math.floor(la / 3), 0, 521, 0); return h < 0.6 ? [0.70, 0.18, 0.15, 0.62] : [0.90, 0.70, 0.62, 0.6]; }
    if (lb >= H2 - 12 && lb < H2 - 4 && mod(la, 6) >= 2 && mod(la, 6) <= 3 && hash(Math.floor(la / 6), 0, 522, 0) < 0.7) return [0.60, 0.16, 0.14, 0.62];
    if (lb >= H2 - 4) return [0.55, 0.55, 0.55, 0.3];
    return mod(la, 4) < 2 === mod(lb, 4) < 2 ? [0.95, 0.95, 0.92, 0.62] : [0.80, 0.30, 0.28, 0.55];
  },
  epicerie(la, lb, W2, H2, c, o) {
    if (mod(la, 14) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.10, 0.08, 0.06); return null; }
    const row = Math.floor(lb / 5), rl = lb % 5;
    if (rl === 0) return [0.45, 0.32, 0.18, 0.45];
    const h = hash(Math.floor(la / 2), row, 531, 0);
    if (h < 0.8) { const p = [[0.85, 0.25, 0.15], [0.95, 0.80, 0.25], [0.25, 0.45, 0.70], [0.92, 0.90, 0.82], [0.30, 0.55, 0.25], [0.65, 0.35, 0.15]][Math.floor(h / 0.8 * 6)]; return [p[0], p[1], p[2], 0.62]; }
    return [1.0, 0.86, 0.60, 0.55];
  },
  quincaillerie(la, lb, W2, H2, c, o) {
    if (mod(la, 16) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.10, 0.10, 0.10); return null; }
    if (lb < 6) return [0.50, 0.38, 0.22, 0.4];
    const h = hash(Math.floor(la / 3), Math.floor(lb / 4), 541, 0);
    if (h < 0.45) return [0.55, 0.56, 0.56, 0.5];
    if (h < 0.6) return [0.70, 0.22, 0.15, 0.55];
    if (h < 0.7) return [0.20, 0.35, 0.55, 0.55];
    return [0.85, 0.82, 0.70, 0.5];
  },
  mercerie(la, lb, W2, H2, c, o) {
    if (mod(la, 14) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.10, 0.08, 0.08); return null; }
    if (lb < 5) return [0.55, 0.40, 0.30, 0.4];
    const h = hash(Math.floor(la / 2), Math.floor(lb / 3), 551, 0);
    if (mod(lb, 3) !== 0 && h < 0.75) { const p = [[0.85, 0.30, 0.45], [0.30, 0.45, 0.80], [0.95, 0.85, 0.40], [0.35, 0.70, 0.45], [0.90, 0.90, 0.88], [0.60, 0.30, 0.70]][Math.floor(h / 0.75 * 6)]; return [p[0], p[1], p[2], 0.6]; }
    return [0.98, 0.88, 0.72, 0.55];
  },
  horlogerie(la, lb, W2, H2, c, o) {
    if (mod(la, 14) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.08, 0.07, 0.06); return null; }
    if (lb < 6) return [0.40, 0.28, 0.16, 0.4];
    const cx = mod(la, 7) - 3, cy = mod(lb - 6, 8) - 4; const d = Math.hypot(cx, cy);
    if (d < 2.6 && hash(Math.floor(la / 7), Math.floor((lb - 6) / 8), 561, 0) < 0.7) { if (d < 0.8 || (cx === 0 && cy > 0) || (cy === 0 && cx > 0)) return [0.15, 0.12, 0.10, 0.4]; return d > 2 ? [0.85, 0.66, 0.25, 0.7] : [0.95, 0.92, 0.84, 0.7]; }
    return [0.95, 0.80, 0.52, 0.55];
  },
  restaurant(la, lb, W2, H2, c, o) {
    if (mod(la, 12) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.08, 0.06, 0.05); return null; }
    if (lb >= 4 && lb <= 6) return [0.95, 0.93, 0.88, 0.62];
    if (lb < 4) return [0.30, 0.15, 0.10, 0.35];
    if (lb === 7 && mod(la, 6) === 3) return [1.3, 1.0, 0.5, 1.0];
    for (const hx of o.heads || []) { const dx = la - hx; if (dx * dx + (lb - 10.5) * (lb - 10.5) * 1.2 < 4.5 || (lb <= 8 && lb >= 6 && Math.abs(dx) < 3.5)) { rgb(c, 0.05, 0.035, 0.03); return null; } }
    if (lb > H2 - 6 && mod(la, 8) === 4) return [1.2, 0.95, 0.6, 0.9];
    return [0.95, 0.56, 0.28, 0.6];
  },
  coiffeur(la, lb, W2, H2, c, o) {
    if (mod(la, 12) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.10, 0.10, 0.10); return null; }
    if (lb >= 10 && lb <= 20 && mod(la, 12) >= 3 && mod(la, 12) <= 9) return [0.70, 0.78, 0.82, 0.6];
    if (lb < 8 && mod(la, 12) >= 4 && mod(la, 12) <= 8) return [0.55, 0.15, 0.15, 0.55];
    return [0.92, 0.94, 0.90, 0.55];
  },
  cinema(la, lb, W2, H2, c, o) {
    if (mod(la, 10) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.42, 0.34, 0.16); return null; }
    if (lb < 3) return [0.70, 0.12, 0.14, 0.6];
    if (lb > H2 - 5) return [1.3, 1.05, 0.6, 0.85];
    if (lb > 12 && lb < H2 - 6 && mod(la, 10) >= 3 && mod(la, 10) <= 7) { const h = hash(Math.floor(la / 10), 0, 571, 0); const p = [[0.85, 0.25, 0.20], [0.20, 0.30, 0.60], [0.90, 0.70, 0.25]][Math.floor(h * 3)]; return [p[0], p[1], p[2], 0.7]; }
    return [1.0, 0.62, 0.36, 0.65];
  },
  hall(la, lb, W2, H2, c, o) {
    if (la === 0 || la === W2 - 1 || lb === H2 - 1 || mod(la, 8) === 0 && lb > H2 * 0.7) { rgb(c, 0.14, 0.10, 0.07); return null; }
    if (lb > H2 * 0.7) return [1.0, 0.85, 0.55, 0.55];
    if (lb < 3) return [0.55, 0.20, 0.18, 0.45];
    if (mod(la + lb, 7) === 0 && lb < H2 * 0.6) return [0.40, 0.28, 0.16, 0.45];
    return [1.0, 0.76, 0.44, 0.52];
  },
  cycles(la, lb, W2, H2, c, o) {
    if (mod(la, 16) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.10, 0.10, 0.10); return null; }
    const cx = mod(la, 12), wheel = Math.hypot(cx - 3, lb - 6) , wheel2 = Math.hypot(cx - 9, lb - 6);
    if ((Math.abs(wheel - 2.6) < 0.6 || Math.abs(wheel2 - 2.6) < 0.6) && lb < 10) return [0.15, 0.15, 0.15, 0.3];
    if (lb === 9 && cx > 2 && cx < 10) return mod(Math.floor(la / 12), 2) ? [0.70, 0.15, 0.15, 0.6] : [0.20, 0.35, 0.65, 0.6];
    return [0.92, 0.90, 0.82, 0.55];
  },
  vide(la, lb, W2, H2, c, o) {
    rgb(c, 0.62, 0.61, 0.57);
    if (mod(la, 16) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.12, 0.10, 0.09); return null; }
    const n = vnoise(la / 3, lb / 9, 581); if (n > 0.55) mul(c, 0.9);
    if (hash(la, lb, 582, 0) < 0.04) mul(c, 0.6);
    return null;
  },
};
overlay('vieille_shop', (o, c) => {
  if (c.face !== o.face) return;
  const [la, lb] = loc(o, c); const W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  rgb(c, 0.05, 0.05, 0.05); c.er = c.eg = c.eb = 0;
  const r = VSHOP[o.kind](la, lb, W2, H2, c, o);
  if (r) { const k = r[3] * (o.k || 1); rgb(c, r[0] * 0.3, r[1] * 0.3, r[2] * 0.3); c.er = r[0] * k; c.eg = r[1] * k; c.eb = r[2] * k; }
});

// ================================================================ personnages (1 pixel = 10 cm)
const K = [0.06, 0.045, 0.04];
const BASE = {
  k: K, s: [0.86, 0.69, 0.55], S: [0.66, 0.48, 0.37], h: [0.17, 0.11, 0.08], H: [0.30, 0.20, 0.13],
  o: [0.09, 0.09, 0.09], j: [0.24, 0.30, 0.42], J: [0.16, 0.20, 0.30], g: [0.46, 0.46, 0.45], G: [0.32, 0.32, 0.32],
  b: [0.84, 0.82, 0.76], B: [0.58, 0.56, 0.50], w: [0.66, 0.66, 0.64],
};
const pal = extra => Object.assign({}, BASE, extra);
const PEOPLE = {
  // Camille : la queue de cheval, le pull orange, la baguette sous le bras
  CAMILLE: { rows: [
    '...kkkk....', '..khhhhk...', '..khhhhhkk.', '..khsssk.hk', '..kssksk.hk', '..kssssk.k.', '...kSSk....',
    '..koooook..', '.koooooook.', '.kooOoooobk', '.kooOoooobk', '.ksoOooobk.', '..koooobk..', '..kjjjjk...',
    '..kjjkjjk..', '..kjjkjjk..', '..kjjkjjk..', '..kJJkJJk..', '..kkk.kkk..'],
    pal: pal({ o: [0.88, 0.46, 0.16], O: [0.66, 0.32, 0.10], h: [0.36, 0.22, 0.12], b: [0.86, 0.64, 0.32] }), ax: 4 },
  // le curé, soutane noire et col blanc
  CURE: { rows: [
    '...kkkk...', '..kggggk..', '..kgsssk..', '..kssksk..', '..kssssk..', '...kwwk...', '..kccccck.', '.kcccccck.',
    '.kcccccck.', '.kscccccsk', '.kcccccck.', '.kcccccck.', '.kcccccck.', '.kcccccck.', '.kcccccck.', '..kcccck..',
    '..kookok..', '...kk.kk..'],
    pal: pal({ c: [0.10, 0.10, 0.12], w: [0.90, 0.90, 0.88], g: [0.62, 0.62, 0.60] }), ax: 4 },
  // la boulangère, blouse blanche et chignon
  BAKER: { rows: [
    '...kkk....', '..khhhk...', '..khhhhk..', '..khsssk..', '..kssksk..', '..kssssk..', '...kSSk...', '..kwwwwk..',
    '.kwwwwwwk.', '.kwwwwwwk.', '.kswwwwsk.', '.kwwwwwwk.', '.kwwwwwwk.', '..kwwwwk..', '..kjjjjk..', '..kssksk..',
    '..kook.ok.', '...kk..k..'],
    pal: pal({ w: [0.88, 0.86, 0.80], h: [0.30, 0.20, 0.14] }), ax: 4 },
  // un marchand, tablier bleu et casquette
  VENDOR: { rows: [
    '...kkkk...', '..kvvvvvk.', '..kvvvvk..', '..kssssk..', '..kskskk..', '..kssssk..', '...kSSk...', '..kbbbbk..',
    '.kbaaaabk.', '.kbaaaabk.', '.ksaaaask.', '.kbaaaabk.', '..kaaaak..', '..kaaaak..', '..kjjjjk..', '..kjjkjk..',
    '..kook.ok.', '...kk..k..'],
    pal: pal({ v: [0.20, 0.22, 0.30], a: [0.22, 0.32, 0.55], b: [0.70, 0.66, 0.58] }), ax: 4 },
  // une vieille dame, fichu et cabas
  GRANNY: { rows: [
    '...kkkk...', '..kffffk..', '.kffssfk..', '..kssksk..', '..kssssk..', '...kSSk...', '..kmmmmk..', '.kmmmmmmk.',
    '.kmmmmmmkk', '.kmmmmmmbk', '.kmmmmmsbk', '.kmmmmmkbk', '..kmmmmkk.', '..kmmmmk..', '..kssksk..', '..kssksk..',
    '..kookok..', '...kk.k...'],
    pal: pal({ f: [0.45, 0.20, 0.30], m: [0.38, 0.36, 0.42], b: [0.62, 0.40, 0.18] }), ax: 4 },
  // Léa, la jeune journaliste de L'Écho, le carnet ouvert
  LEA: { rows: [
    '...kkkk...', '..khhhhk..', '..khhhhhk.', '..khsssk..', '..kssksk..', '..kssssk..', '...kSSk...', '..kttttk..',
    '.kttttttk.', '.kttTtttkk', '.ktttTtsbk', '.ktttttkbk', '..kttttkk.', '..kjjjjk..', '..kjjkjk..', '..kjjkjk..',
    '..kook.ok.', '...kk..k..'],
    pal: pal({ t: [0.70, 0.60, 0.42], T: [0.52, 0.44, 0.30], h: [0.20, 0.13, 0.09], b: [0.92, 0.90, 0.84] }), ax: 4 },
  // un lecteur assis sur un banc, le journal déplié
  READER: { rows: [
    '..kkkk...', '.khhhhk..', '.khsssk..', '.kssksk..', '..kssk...', 'kbbbbbbbk', 'kbBbbBbbk', 'kbbbbbbbk',
    'kbBbbbBbk', 'kkkkkkkkk', '.kjjjjjk.', '....kjjk.', '....kook.'],
    pal: pal({ b: [0.86, 0.84, 0.76], B: [0.40, 0.40, 0.38] }), ax: 3 },
  // un pigeon
  PIGEON: { rows: ['.kk..', 'kgggk', '.kggk', '..k.k'], pal: pal({ g: [0.48, 0.50, 0.56] }), ax: 2, shadowR: 2 },
  // une poule
  HEN: { rows: ['..r.', '.kwk', 'kwwk', '.kk.'], pal: pal({ w: [0.90, 0.88, 0.82], r: [0.80, 0.15, 0.10] }), ax: 2, shadowR: 2 },
  // un chien
  DOG: { rows: ['k....kk', 'k.kkkdk', '.kddddk', '.kdddk.', '.k.k.k.'], pal: pal({ d: [0.52, 0.36, 0.20] }), ax: 3, shadowR: 3 },
};

// ================================================================ outillage
// Le monde vu à travers le rectangle du quartier : rien ne déborde.
function clipped(W) {
  const P = Object.create(W);
  P.box = (x0, y0, z0, x1, y1, z1, m, t) => W.box(Math.max(0, x0), Math.max(0, y0), z0, Math.min(WD, x1), Math.min(HT, y1), z1, m, t);
  P.set = (x, y, z, m, t) => { if (x < 0 || y < 0 || x >= WD || y >= HT) return; W.set(x, y, z, m, t); };
  return P;
}
// la cote du dessus de la matière en (x, y) : là où l'on pose une cheminée, une antenne
const surf = (P, x, y) => { for (let z = 99; z > -9; z--) if (P.get(x, y, z)) return z + 1; return G; };
const chim = (P, x, y, h, m = M.BRICK) => { const z = Math.min(surf(P, x, y), surf(P, x + 1, y), surf(P, x, y + 1), surf(P, x + 1, y + 1)); B.chimney(P, x, y, z - 2, h + 2, m); };
const octD = (dx, dy) => Math.max(Math.abs(dx), Math.abs(dy), (Math.abs(dx) + Math.abs(dy)) / 1.414);

// Toit à deux pans (axis 'x' : faîtage le long de x, pignon visible à l'est ; 'y' : pignon visible au sud),
// pente p (montée par voxel de recul), croupe possible (hip). Renvoie la cote du faîtage.
function pitched(P, x0, y0, w, d, z0, mat, o = {}) {
  const ax = o.axis || 'x', p = o.pitch || 1, oh = o.oh != null ? o.oh : 1, oe = o.oe || 0;
  let ridge = z0;
  for (let k = 0; k < 120; k++) {
    const ins = Math.floor(k / p);
    if (ax === 'x') {
      const ya = y0 - oh + ins, yb = y0 + d + oh - ins; if (yb - ya <= 0) break;
      const xa = x0 - oe + (o.hip ? ins : 0), xb = x0 + w + oe - (o.hip ? ins : 0); if (xb - xa <= 0) break;
      P.box(xa, ya, z0 + k, xb, yb, z0 + k + 1, mat);
      if (o.gable && !o.hip) for (let y = Math.max(ya + 1, y0); y < Math.min(yb - 1, y0 + d); y++) P.set(x0 + w - 1, y, z0 + k, o.gable, o.gtag || 0);
    } else {
      const xa = x0 - oh + ins, xb = x0 + w + oh - ins; if (xb - xa <= 0) break;
      const ya = y0 - oe + (o.hip ? ins : 0), yb = y0 + d + oe - (o.hip ? ins : 0); if (yb - ya <= 0) break;
      P.box(xa, ya, z0 + k, xb, yb, z0 + k + 1, mat);
      if (o.gable && !o.hip) for (let x = Math.max(xa + 1, x0); x < Math.min(xb - 1, x0 + w); x++) P.set(x, y0 + d - 1, z0 + k, o.gable, o.gtag || 0);
    }
    ridge = z0 + k + 1;
  }
  return ridge;
}
// toit à la Mansart : brisis raide, terrasson en croupe à faible pente
function mansardRoof(P, x0, y0, w, d, z0, h, o = {}) {
  const mat = o.mat || M.SLATE;
  P.box(x0 - 1, y0 - 1, z0, x0 + w + 1, y0 + d + 1, z0 + 1, M.STONE);
  for (let k = 0; k < h; k++) { const i = Math.floor(k / 3); P.box(x0 + i, y0 + i, z0 + 1 + k, x0 + w - i, y0 + d - i, z0 + 2 + k, mat); }
  const i = Math.floor(h / 3);
  return pitched(P, x0 + i, y0 + i, w - 2 * i, d - 2 * i, z0 + 1 + h, o.upper || M.ZINC, { axis: w >= d ? 'x' : 'y', pitch: 0.5, oh: 0, hip: true });
}
// lucarne sur un pan sud : jouées, fenêtre, petit toit à pignon
function dormerS(P, x, yf, zb, o = {}) {
  const wall = o.wall || M.PLASTER_CREAM;
  P.box(x, yf - 5, zb, x + 6, yf, zb + 8, wall, o.tag || 0);
  const f = new Facade(P, LEFT, x, yf - 5, 6, 5);
  f.window(1, zb + 1, 4, 6, Object.assign({ sill: false, lintel: false, state: 'dark' }, o.win || {}));
  pitched(P, x, yf - 6, 6, 6, zb + 8, o.roof || M.SLATE, { axis: 'y', pitch: 1, oh: 1, gable: wall, gtag: o.tag || 0 });
}
const CURTAINS = [[0.62, 0.30, 0.22], [0.55, 0.50, 0.32], [0.35, 0.40, 0.55], [0.55, 0.25, 0.35], [0.72, 0.64, 0.46], [0.40, 0.48, 0.32]];
const SHUT = [M.SHUTTER_GREEN, M.SHUTTER_BLUE, M.SHUTTER_GREY, M.SHUTTER_BORD];
// l'état d'une fenêtre d'habitation, selon l'heure et la saison
function winState(ctx, bias = 0) {
  if (!ctx.night) return { state: 'dark' };
  const r = ctx.R(), pl = (ctx.mood === 'bad' ? 0.17 : 0.32) + bias;
  if (r < pl) return { state: 'lit', curtain: CURTAINS[Math.floor(ctx.R() * CURTAINS.length)] };
  if (r < pl + 0.07) return { state: 'tv', seed: Math.floor(ctx.R() * 9) };
  return { state: 'dark' };
}
// des colonnes de fenêtres régulières sur une longueur de façade
function cols(len, ww, n, m = 3) {
  const out = []; const slot = (len - 2 * m) / n;
  for (let i = 0; i < n; i++) out.push(Math.round(m + slot * i + (slot - ww) / 2));
  return out;
}
// vitrine à intérieur peint (comme Facade.shop, avec nos propres intérieurs)
function vshop(f, s0, z0, w, h, kind, o = {}) {
  f.rect(s0, z0, s0 + w, z0 + h, 0, 0);
  const id = f.W.obj(Object.assign({ type: 'vieille_shop', kind, face: f.face, a0: f.a0(s0), z0, w, h }, o));
  f.rect(s0, z0, s0 + w, z0 + h, 1, M.GLASS, id);
  if (o.lintel !== false) f.rect(s0, z0 + h, s0 + w, z0 + h + 1, 0, o.lintelMat || M.WOOD_DARK);
  if (o.light) { const p = f.front(s0 + w / 2, z0 + h * 0.6, 3); const L = o.light; f.W.light({ x: p.x, y: p.y, z: p.z, r: L.r || 36, cr: L.c[0], cg: L.c[1], cb: L.c[2], shadow: true, skip: 2.5 }); }
  return id;
}
function tagRect(f, s0, z0, s1, z1, id, depth = 0) { for (let s = s0; s < s1; s++) for (let z = z0; z < z1; z++) f.tag(s, z, depth, id); }

// ================================================================ la maison de ville générique
// o : x0, y0, w, d, gh (rez), fh (étage), nf (étages), wall, k (teinte), base (soubassement), timber, jetty,
//     roof {t:'gx'|'gy'|'hip'|'mans'|'flat', m, p, oh}, east (décorer la face est), win {w,h,cols,shutter},
//     gf(fS, info) pour le rez-de-chaussée, eastGf(fE, info), dorm [s…], chim [[x,y]…], ant, bal (étage à balcon)
const HOUSES = [];
let FLOWER = 0;
function house(P, ctx, o) {
  const R = ctx.R, night = ctx.night, bad = ctx.mood === 'bad';
  const { x0, y0, w, d } = o;
  const gh = o.gh || 17, fh = o.fh || 15, nf = o.nf != null ? o.nf : 2;
  const wall = o.wall || M.PLASTER_CREAM;
  const k = o.k || null;
  if (o.flowers === undefined) o.flowers = FLOWER && R() < 0.45 ? FLOWER : 0;
  if (o.ant === undefined) o.ant = R() < 0.4 ? [Math.floor(w / 2), Math.floor(d / 2)] : null;
  const tid = k ? P.obj({ type: 'vieille_tint', k }) : 0;
  const J = o.jetty ? 1 : 0;
  const top = G + gh + nf * fh;
  P.box(x0, y0, G, x0 + w, y0 + d, G + gh, o.base || wall, o.base ? 0 : tid);
  for (let f = 1; f <= nf; f++) {
    const z0 = G + gh + (f - 1) * fh;
    P.box(x0, y0, z0, x0 + w, y0 + d + J * f, z0 + fh, wall, tid);
    if (J) P.box(x0, y0 + d + f - 1, z0 - 1, x0 + w, y0 + d + f, z0, M.WOOD_DARK);
  }
  const dTop = d + J * nf;
  const fS = f => new Facade(P, LEFT, x0, y0, w, d + J * Math.max(0, f));
  const fE = new Facade(P, RIGHT, x0, y0, w, d);
  const timberId = o.timber ? P.obj({ type: 'vieille_timber', face: LEFT, a0: x0, z0: G + gh, w, fh, ps: 10, sill: 8, k, seed: x0 * 7 + y0, beam: o.beam }) : 0;
  if (timberId) for (let f = 1; f <= nf; f++) tagRect(fS(f), 0, G + gh + (f - 1) * fh, w, G + gh + f * fh, timberId);
  // bandeaux et corniche
  if (!o.timber && o.bands !== false) {
    for (let f = 1; f <= nf; f++) fS(f).rect(0, G + gh + (f - 1) * fh, w, G + gh + (f - 1) * fh + 1, -1, o.bandMat || M.STONE);
    if (o.east) for (let f = 1; f <= nf; f++) fE.rect(0, G + gh + (f - 1) * fh, d, G + gh + (f - 1) * fh + 1, -1, o.bandMat || M.STONE);
  }
  if (o.cornice !== false && !o.timber && o.roof && o.roof.t !== 'gy') {
    fS(nf).rect(-1, top - 1, w + 1, top, -1, M.STONE);
    if (o.east) fE.rect(0, top - 1, d + 1, top, -1, M.STONE);
  }
  if (o.quoins) {
    for (let z = G + 1; z < top; z += 4) { fS(0).rect(w - 2, z, w, z + 2, 0, M.STONE); fS(0).rect(0, z, 2, z + 2, 0, M.STONE); if (o.east) fE.rect(0, z + 2, 2, z + 4, 0, M.STONE); }
  }
  // étages : fenêtres
  const ww = o.win && o.win.w || (o.timber ? 4 : 5), wh = o.win && o.win.h || (fh - 6);
  const sc = o.win && o.win.cols || (o.timber ? null : cols(w, ww, Math.max(1, Math.floor((w - 4) / (ww + 5)))));
  const tcols = []; if (o.timber) for (let s = 1; s + 4 < w - 1; s += 5) if (Math.floor(s / 5) % 2 === 1 || w < 16) tcols.push(s);
  const useCols = o.timber ? (o.win && o.win.cols || tcols) : sc;
  const shutter = o.win && o.win.shutter !== undefined ? o.win.shutter : (o.timber ? null : SHUT[Math.floor(R() * SHUT.length)]);
  for (let f = 1; f <= nf; f++) {
    const z0 = G + gh + (f - 1) * fh + (o.timber ? 5 : 3);
    const fa = fS(f);
    for (const s of useCols) {
      const st = winState(ctx);
      const closed = shutter && st.state === 'dark' && R() < (bad ? 0.6 : 0.32);
      const wo = Object.assign({ shutter, closed, sill: !o.timber, lintel: !o.timber, frame: o.timber ? [0.28, 0.20, 0.13] : undefined, spill: f === 1 }, st);
      if (o.bal === f && !o.timber) wo.balcony = R() < 0.5 ? 'plants' : true;
      if (o.surround) { fa.rect(s - 1, z0 - 1, s, z0 + wh + 1, 0, M.STONE); fa.rect(s + ww, z0 - 1, s + ww + 1, z0 + wh + 1, 0, M.STONE); }
      fa.window(s, z0, ww, wh, wo);
      if (!bad && o.flowers && R() < 0.6) { fa.rect(s, z0, s + ww, z0 + 1, -1, M.HEDGE, o.flowers); }
    }
  }
  if (o.east) {
    const ec = o.eastCols || cols(d, 5, Math.max(1, Math.floor((d - 4) / 12)));
    for (let f = 1; f <= nf; f++) for (const s of ec) {
      const st = winState(ctx);
      fE.window(s, G + gh + (f - 1) * fh + 3, 5, fh - 6, Object.assign({ shutter: o.timber ? null : shutter, closed: !o.timber && st.state === 'dark' && R() < 0.4, spill: x0 + w < WD && f === 1 }, st));
    }
  }
  // rez-de-chaussée
  if (o.gf) o.gf(fS(0), { top, gh, tid });
  if (o.east && o.eastGf) o.eastGf(fE, { top, gh, tid });
  // toit
  let ridge = top;
  const rf = o.roof || { t: 'gx', m: M.SLATE };
  const gmat = wall;
  if (rf.t === 'gx' || rf.t === 'hip') ridge = pitched(P, x0, y0, w, dTop, top, rf.m, { axis: 'x', pitch: rf.p || 1, oh: rf.oh != null ? rf.oh : 1, hip: rf.t === 'hip', gable: gmat, gtag: tid });
  else if (rf.t === 'gy') {
    ridge = pitched(P, x0, y0, w, dTop, top, rf.m, { axis: 'y', pitch: rf.p || 1.5, oh: rf.oh != null ? rf.oh : 1, oe: rf.oe || 0, gable: gmat, gtag: timberId || tid });
    // fenêtre de grenier dans le pignon
    const ga = new Facade(P, LEFT, x0, y0, w, dTop);
    if (w >= 14) { const st = winState(ctx, -0.1); ga.window(Math.floor(w / 2) - 2, top + 3, 4, 6, Object.assign({ sill: false, lintel: !o.timber, frame: o.timber ? [0.28, 0.20, 0.13] : undefined }, st)); }
  } else if (rf.t === 'mans') {
    ridge = mansardRoof(P, x0, y0, w, dTop, top, rf.h || 10, { mat: rf.m || M.SLATE, upper: rf.u || (R() < 0.5 ? M.SLATE : M.ZINC) });
    for (const s of o.dorm || []) B.dormer(P, LEFT, x0, y0, w, dTop, x0 + s, top + 1, Object.assign({}, winState(ctx, -0.08)));
    if (o.east) for (const s of o.dormE || []) B.dormer(P, RIGHT, x0, y0, w, dTop, y0 + s, top + 1, Object.assign({}, winState(ctx, -0.08)));
  } else if (rf.t === 'flat') { B.flatRoof(P, x0, y0, w, dTop, top, wall, { parapet: 2 }); ridge = top + 3; }
  if ((rf.t === 'gx' || rf.t === 'hip') && o.dorm) {
    const p = rf.p || 1, oh = rf.oh != null ? rf.oh : 1;
    for (const s of o.dorm) { const kb = 3; const yf = y0 + dTop + oh - Math.floor(kb / p) - 1; dormerS(P, x0 + s, yf, top + kb - 1, { wall: o.dormWall || M.PLASTER_CREAM, roof: rf.m, win: winState(ctx, -0.08) }); }
  }
  // tabatières sur les grands pans
  if ((rf.t === 'gx' || rf.t === 'gy') && w >= 26 && o.skylight !== false) {
    const p = rf.p || (rf.t === 'gy' ? 1.5 : 1), oh = rf.oh != null ? rf.oh : 1, n = 1 + (w > 40 ? 1 : 0);
    for (let i = 0; i < n; i++) {
      const lit = night && R() < 0.3, m = lit ? M.SKYLIGHT : M.GLASS;
      for (let k = 4; k < 6; k++) {
        const ins = Math.floor(k / p);
        if (rf.t === 'gx') { const y = y0 + dTop + oh - ins - 1, xs = x0 + 6 + Math.floor(R() * 4) + i * Math.floor(w / 2); if (P.get(xs, y, top + k)) { P.set(xs, y, top + k, m); P.set(xs + 1, y, top + k, m); } }
        else { const x = x0 + w + oh - ins - 1, ys = y0 + 8 + i * Math.floor(dTop / 2); if (P.get(x, ys, top + k)) { P.set(x, ys, top + k, m); P.set(x, ys + 1, top + k, m); } }
      }
    }
  }
  for (const [cx, cy, ch] of o.chim || []) chim(P, x0 + cx, y0 + cy, ch || 7, o.chimMat || M.BRICK);
  if (o.ant) B.antenna(P, x0 + o.ant[0], y0 + o.ant[1], surf(P, x0 + o.ant[0], y0 + o.ant[1]) - 1, 11);
  HOUSES.push({ x0, y0, w, d, top, gh, fh, nf, wall, tid, east: !!o.east, timber: !!o.timber, roof: rf.t });
  return { top, ridge, dTop, tid, fS, fE };
}
// Les murs mitoyens que personne ne cache : jours de souffrance, réclames peintes passées, lierre, conduits.
const ADS = ['BIÈRE DE LA RIVE', 'MEUBLES DU PONT', "CAFÉ L'AUBE", 'TEINTURERIE', 'GRAINS · FOURRAGES'];
function partyWalls(P, ctx) {
  const R = ctx.R; let ad = 0;
  for (const h of HOUSES) {
    if (h.east) continue;
    const fE = new Facade(P, RIGHT, h.x0, h.y0, h.w, h.d);
    const xe = h.x0 + h.w;
    let exposedFloors = 0;
    for (let f = 1; f <= h.nf; f++) {
      const zm = G + h.gh + (f - 1) * h.fh + Math.floor(h.fh / 2);
      let run = 0, best = -1, bestLen = 0;
      for (let y = h.y0 + 3; y < h.y0 + h.d - 3; y++) {
        if (P.get(xe, y, zm) === 0 && P.get(xe - 1, y, zm) !== 0 && P.get(xe, y, zm - 4) === 0) { run++; if (run > bestLen) { bestLen = run; best = y; } } else run = 0;
      }
      if (bestLen < 8) continue;
      exposedFloors++;
      const yC = best - Math.floor(bestLen / 2);
      const sC = h.y0 + h.d - 1 - yC;
      if (R() < 0.75) fE.window(sC - 1, G + h.gh + (f - 1) * h.fh + 4, 3, 5, Object.assign({ sill: true, lintel: false }, winState(ctx, -0.1)));
    }
    if (h.roof === 'gx') {
      const ym = h.y0 + Math.floor(h.d / 2), zg = h.top + 3;
      if (P.get(xe, ym, zg) === 0 && P.get(xe - 1, ym, zg) && P.get(xe - 1, ym, zg + 4)) fE.window(Math.floor(h.d / 2) - 1, zg, 3, 4, Object.assign({ sill: false, lintel: false }, winState(ctx, -0.15)));
    }
    if (exposedFloors >= 2 && ad < ADS.length && R() < 0.55) {
      const text = ADS[ad++]; const bm = textBitmap(text);
      const nw = Math.ceil(bm.w / 2);
      if (nw < h.d - 6) fE.sign(Math.floor((h.d - nw) / 2), G + h.gh + Math.floor(h.fh * 1.6), text, { fg: [0.78, 0.72, 0.56], depth: 0, worn: 0.35 });
    } else if (exposedFloors >= 1 && R() < 0.4) {
      // lierre qui grimpe depuis le pied
      const s0 = 2 + Math.floor(R() * (h.d - 10));
      for (let z = G; z < G + h.gh + h.fh; z++) for (let s = s0; s < s0 + 6; s++) if (hash(s, z, 17, h.x0) < 0.55 - (z - G) / (h.gh + h.fh) * 0.4) fE.set(s, z, -1, M.HEDGE);
    }
  }
}

// ================================================================ mobilier et décor
function lanternPost(P, ctx, x, y, on, o = {}) {
  const h = o.h || 16;
  P.box(x - 1, y - 1, G, x + 2, y + 2, G + 2, M.METAL_DARK);
  P.box(x, y, G + 2, x + 1, y + 1, G + h, M.METAL_DARK);
  P.set(x, y, G + h, M.METAL_DARK);
  for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) P.box(x + a, y + b, G + h, x + a + 1, y + b + 1, G + h + 4, M.METAL_DARK);
  P.box(x, y - 1, G + h + 1, x + 1, y + 2, G + h + 4, on ? M.BULB : M.GLASS);
  P.box(x - 1, y, G + h + 1, x + 2, y + 1, G + h + 4, on ? M.BULB : M.GLASS);
  P.box(x - 1, y - 1, G + h + 4, x + 2, y + 2, G + h + 5, M.METAL_DARK); P.set(x, y, G + h + 5, M.METAL_DARK);
  if (on) { const I = o.I || 2.5; P.light({ x: x + 0.5, y: y + 1.6, z: G + h - 0.4, r: o.r || 64, fall: 2.2, cr: 1.0 * I, cg: 0.64 * I, cb: 0.28 * I, skip: 0.6 }); }
}
function wallLantern(f, s, z, on) {
  f.set(s, z + 3, -1, M.METAL_DARK); f.set(s, z + 3, -2, M.METAL_DARK);
  f.set(s, z + 2, -2, on ? M.BULB : M.GLASS); f.set(s, z + 1, -2, M.METAL_DARK);
  if (on) { const p = f.front(s, z + 2, 3); f.W.light({ x: p.x, y: p.y, z: p.z, r: 42, fall: 2, cr: 1.3, cg: 0.84, cb: 0.38, skip: 1.6 }); }
}
// lanterne en console, scellée dans la façade : potence de fer, lanterne pendue, sodium la nuit
function consoleLantern(f, s, z, on, o = {}) {
  for (let k = 1; k <= 3; k++) f.set(s, z + 5, -k, M.METAL_DARK);
  f.set(s, z + 4, -1, M.METAL_DARK); f.set(s, z + 3, -1, M.METAL_DARK);
  f.set(s, z + 4, -3, M.METAL_DARK);
  f.set(s, z + 3, -3, M.METAL_DARK); f.set(s, z + 2, -3, on ? M.BULB : M.GLASS); f.set(s, z + 1, -3, on ? M.BULB : M.GLASS); f.set(s, z, -3, M.METAL_DARK);
  if (on) { const p = f.front(s, z + 1.5, 4); const I = o.I || 2.3; f.W.light({ x: p.x, y: p.y, z: p.z, r: o.r || 60, fall: 2.1, cr: 1.0 * I, cg: 0.64 * I, cb: 0.28 * I, skip: 1.2 }); }
}
// étal de marché : tréteaux, marchandises, bâche rayée
function stall(P, x, y, o) {
  const L = o.L || 16, D = 8;
  for (const [a, b] of [[1, 1], [L - 2, 1], [1, D - 2], [L - 2, D - 2]]) P.box(x + a, y + b, G, x + a + 1, y + b + 1, G + 4, M.WOOD_DARK);
  P.box(x, y, G + 4, x + L, y + D, G + 5, M.WOOD, o.goods || 0);
  if (o.goods) { P.box(x + 1, y + 1, G + 5, x + L - 1, y + D - 3, G + 6, M.WOOD, o.goods); }
  for (const [a, b] of [[0, -1], [L - 1, -1], [0, D], [L - 1, D]]) P.box(x + a, y + b, G, x + a + 1, y + b + 1, G + 13, M.METAL);
  if (o.canvas !== false) {
    for (let j = -2; j <= D + 1; j++) { const z = G + 14 - Math.floor((j + 2) / 4); P.box(x - 1, y + j, z, x + L + 1, y + j + 1, z + 1, M.CANVAS, o.stripe); }
    P.box(x - 1, y + D + 1, G + 10, x + L + 1, y + D + 2, G + 12, M.CANVAS, o.stripe);
  }
  if (o.crates) { B.crates(P, x + 2, y - 3, G, 1); B.crates(P, x + L - 5, y - 3, G, 2, M.CRATE_GREEN); }
}
function lampStreet(P, ctx, x, y, dx, dy, o = {}) { B.streetLamp(P, x, y, G, dx, dy, Object.assign({ on: ctx.night && !o.off }, o)); }
function bike(P, x, y, axis, m = M.METAL_DARK) {
  const S = (a, b, z, mm) => axis === 'x' ? P.set(x + a, y + b, G + z, mm) : P.set(x + b, y + a, G + z, mm);
  for (const a of [0, 1, 2, 4, 5, 6]) for (const z of [0, 2]) S(a, 0, z, M.TIRE);
  S(0, 0, 1, M.TIRE); S(2, 0, 1, M.TIRE); S(4, 0, 1, M.TIRE); S(6, 0, 1, M.TIRE);
  S(1, 0, 3, m); S(2, 0, 3, m); S(3, 0, 3, m); S(4, 0, 3, m); S(5, 0, 3, m); S(2, 0, 4, M.WOOD_DARK); S(5, 0, 4, m); S(5, 0, 5, m);
}
function bench2(P, x, y, axis) { B.bench(P, x, y, G, axis); }
function planter(P, x, y, w, d, flowerId) {
  P.box(x, y, G, x + w, y + d, G + 3, M.STONE);
  P.box(x + 1, y + 1, G + 3, x + w - 1, y + d - 1, G + 4, M.HEDGE, flowerId || 0);
}
// petite fourgonnette (la camionnette de L'Écho)
function van(P, x, y, axis, paintId, o = {}) {
  const Bx = (a0, b0, z0, a1, b1, z1, m, t) => axis === 'x' ? P.box(x + a0, y + b0, G - 1 + z0, x + a1, y + b1, G - 1 + z1, m, t) : P.box(x + b0, y + a0, G - 1 + z0, x + b1, y + a1, G - 1 + z1, m, t);
  Bx(2, 0, 0, 5, 1, 3, M.TIRE); Bx(15, 0, 0, 18, 1, 3, M.TIRE); Bx(2, 7, 0, 5, 8, 3, M.TIRE); Bx(15, 7, 0, 18, 8, 3, M.TIRE);
  Bx(0, 1, 1, 20, 7, 11, M.CAR_WHITE, paintId);
  Bx(14, 1, 7, 19, 7, 10, M.CAR_GLASS); Bx(19, 1, 1, 20, 7, 3, M.CHROME); Bx(0, 1, 1, 1, 7, 2, M.CHROME);
  Bx(16, 1, 7, 17, 7, 10, M.CAR_WHITE, paintId);
}
function car2(P, x, y, axis, paint) { B.car(P, x, y, G - 1, axis, paint); }

// ================================================================ le quartier
module.exports = {
  w: WD, h: HT, seed: 1991,
  build(W0, ctx) {
    HOUSES.length = 0;
    const P = clipped(W0);
    FLOWER = P.obj({ type: 'vieille_flowers', pal: [[0.86, 0.12, 0.14], [0.92, 0.42, 0.58], [0.95, 0.93, 0.88], [0.95, 0.60, 0.15]] });
    const R = ctx.R, night = ctx.night, bad = ctx.mood === 'bad', day = !night;
    const places = [];
    const place = (key, label, x, y, z) => places.push({ key, label, x, y, z });
    const sp = (def, x, y, z = G, extra = {}) => P.sprite(Object.assign({ x, y, z }, def, extra));
    const obj = o => P.obj(o);
    const paint = (col, extra = {}) => obj(Object.assign({ type: 'vieille_paint', col }, extra));
    const stripe = (cols, p = 3, dir = 'x') => obj({ type: 'vieille_stripe', cols, p, dir });
    const ClockHM = ctx.time === 'day' ? [10, 40] : ctx.time === 'dusk' ? [19, 50] : [22, 15];

    // ------------------------------------------------------------ sols : la place, les rues, les ruelles
    // la place de la Mairie : pavés, dalles devant la mairie et l'église, cercles autour de la fontaine
    const FX = 510, FY = 140;
    const rings = obj({ type: 'vieille_rings', cx: FX, cy: FY, r0: 15, r1: 28 });
    P.box(380, 62, 1, 656, 212, 2, M.COBBLE, rings);
    P.box(656, 62, 1, 700, 140, 2, M.COBBLE);
    P.box(466, 62, 1, 554, 78, 2, VM.FLAGSTONE);
    P.box(372, 90, 1, 392, 124, 2, VM.FLAGSTONE);
    // rue du Stade, du quai jusqu'à la place
    P.box(496, 197, 1, 524, 226, 2, 0); P.box(496, 197, 0, 524, 226, 1, M.ASPHALT);
    P.box(495, 197, 0, 496, 226, 2, M.CURB); P.box(524, 197, 0, 525, 226, 2, M.CURB);
    P.box(496, 196, 0, 524, 197, 2, M.CURB);
    P.box(496, 197, 0, 497, 226, 1, M.GUTTER); P.box(523, 197, 0, 524, 226, 1, M.GUTTER);
    for (let y = 202; y < 226; y += 12) P.box(509, y, 0, 511, y + 6, 1, M.ROADLINE);
    // rue des Halles : chaussée pavée, trottoirs
    P.box(700, 66, 1, WD, 80, 2, 0); P.box(700, 66, 0, WD, 80, 1, M.COBBLE);
    P.box(700, 65, 0, WD, 66, 2, M.CURB); P.box(700, 80, 0, WD, 81, 2, M.CURB);
    P.box(700, 66, 0, WD, 67, 1, M.GUTTER); P.box(700, 79, 0, WD, 80, 1, M.GUTTER);
    P.box(699, 66, 0, 700, 80, 2, M.CURB);
    // rue du Cloître (pavée, caniveau au milieu), ruelle des Tanneurs, passage du Four, rue du Chevet
    P.box(0, 60, 1, 380, 74, 2, M.COBBLE); P.box(0, 66, 1, 376, 67, 2, M.GUTTER);
    P.box(112, 74, 1, 126, 212, 2, M.COBBLE); P.box(118, 74, 1, 119, 212, 2, M.GUTTER);
    P.box(836, 84, 1, 848, 212, 2, M.COBBLE); P.box(841, 84, 1, 842, 212, 2, M.GUTTER);
    P.box(126, 140, 1, 380, 156, 2, M.COBBLE); P.box(126, 147, 1, 376, 148, 2, M.GUTTER);

    // ------------------------------------------------------------ la mairie (au nord de la place)
    {
      const x0 = 440, y0 = 6, w = 140, d = 54, ZG = G + 4;
      const top = ZG + 20 + 20;
      P.box(x0, y0, G, x0 + w, y0 + d, top, VM.ASHLAR);
      // avant-corps central
      const ax0 = 490, aw = 40;
      P.box(ax0, y0 + d, G, ax0 + aw, y0 + d + 4, top + 6, VM.ASHLAR);
      const rus = obj({ type: 'vieille_rustic' });
      P.box(x0, y0 + d - 1, G, x0 + w, y0 + d, ZG + 20, VM.ASHLAR, rus);
      P.box(ax0, y0 + d + 3, G, ax0 + aw, y0 + d + 4, ZG + 20, VM.ASHLAR, rus);
      const f = new Facade(P, LEFT, x0, y0, w, d), fa = new Facade(P, LEFT, ax0, y0, aw, d + 4);
      // bandeau et corniche
      f.rect(0, ZG + 19, w, ZG + 21, -1, M.STONE); fa.rect(0, ZG + 19, aw, ZG + 21, -1, M.STONE);
      f.rect(-1, top - 2, w + 1, top, -1, M.STONE); fa.rect(-1, top + 4, aw + 1, top + 6, -1, M.STONE);
      f.rect(0, G, w, ZG, -1, VM.ASHLAR);
      // fenêtres cintrées du rez et hautes fenêtres de l'étage noble, dans les ailes
      const wing = [6, 20, 34, 92, 106, 120];
      for (const s of wing) {
        const st = night ? (R() < (bad ? 0.15 : 0.35) ? { state: 'office' } : { state: 'dark' }) : { state: 'dark' };
        f.window(s, ZG + 3, 8, 13, Object.assign({ shutter: null, frame: [0.62, 0.60, 0.54] }, night ? { state: 'dark' } : st));
        f.rect(s - 1, ZG + 16, s + 9, ZG + 17, 0, M.STONE);
        f.window(s, ZG + 23, 8, 14, Object.assign({ shutter: null, frame: [0.62, 0.60, 0.54] }, st));
        f.rect(s - 1, ZG + 22, s + 9, ZG + 23, -1, M.STONE);
        for (let i = 0; i < 10; i += 2) f.set(s - 1 + i, ZG + 23, -1, M.METAL_DARK);
        f.rect(s - 1, ZG + 37, s + 9, ZG + 38, 0, M.STONE);
      }
      // porte, marches, balcon, enseigne, horloge
      fa.door(14, ZG, 12, 15, { mat: M.WOOD_DARK, frameMat: M.STONE });
      fa.rect(14, ZG + 12, 26, ZG + 15, 2, M.GLASS, obj({ type: 'window', face: LEFT, a0: ax0 + 14, z0: ZG + 12, w: 12, h: 3, state: night && !bad ? 'lit' : 'dark' }));
      fa.window(4, ZG + 4, 6, 12, { state: 'dark', frame: [0.62, 0.60, 0.54] });
      fa.window(30, ZG + 4, 6, 12, { state: 'dark', frame: [0.62, 0.60, 0.54] });
      for (let k = 0; k < 4; k++) P.box(ax0 + 6 - k * 2, y0 + d + 4 + k * 2, G, ax0 + aw - 6 + k * 2, y0 + d + 6 + k * 2, ZG - k, M.STONE);
      // étage noble central : trois fenêtres, balcon
      for (const s of [6, 17, 28]) {
        const st = night ? (R() < (bad ? 0.3 : 0.7) ? { state: 'office' } : { state: 'dark' }) : { state: 'dark' };
        fa.window(s, ZG + 23, 7, 15, Object.assign({ frame: [0.62, 0.60, 0.54] }, st));
      }
      fa.rect(4, ZG + 21, 36, ZG + 22, -1, M.STONE); fa.rect(4, ZG + 21, 36, ZG + 22, -2, M.STONE);
      for (let s = 4; s < 36; s++) { fa.set(s, ZG + 25, -2, M.METAL_DARK); if (s % 2 === 0) for (let z = ZG + 22; z < ZG + 25; z++) fa.set(s, z, -2, M.METAL_DARK); }
      fa.sign(8, top + 4, 'MAIRIE', { scale: 2, fg: [0.86, 0.68, 0.26], depth: 0 });
      // fronton et horloge
      for (let k = 0; k < 12; k++) P.box(ax0 + 2 + k * 1.5, y0 + d - 2, top + 6 + k, ax0 + aw - 2 - k * 1.5, y0 + d + 4, top + 7 + k, VM.ASHLAR);
      for (let k = 0; k < 12; k++) { P.set(Math.round(ax0 + 2 + k * 1.5), y0 + d + 4, top + 6 + k, M.STONE); P.set(Math.round(ax0 + aw - 3 - k * 1.5), y0 + d + 4, top + 6 + k, M.STONE); }
      const clk = obj({ type: 'vieille_clock', face: LEFT, a0: ax0 + 15, z0: top + 7, w: 10, hour: ClockHM[0], min: ClockHM[1], lit: night && !bad ? 0.75 : 0 });
      for (let s = 15; s < 25; s++) for (let z = top + 7; z < top + 17; z++) { P.set(ax0 + s, y0 + d + 4, z, VM.ASHLAR, clk); }
      // toit : mansarde d'ardoise, lucarnes, campanile, drapeau
      mansardRoof(P, x0, y0, w, d, top, 10, { upper: M.SLATE });
      for (const s of [9, 23, 37, 95, 109, 123]) B.dormer(P, LEFT, x0, y0, w, d, x0 + s, top + 1, Object.assign({}, night && R() < 0.2 ? { state: 'lit' } : { state: 'dark' }));
      for (const cx of [x0 + 24, x0 + w - 26]) chim(P, cx, y0 + 26, 7, VM.ASHLAR);
      // campanile
      const cx = 508, cy = y0 + 25, cz = surf(P, 509, y0 + 27) - 2;
      P.box(cx - 3, cy - 3, cz - 1, cx + 7, cy + 7, cz + 2, M.ZINC);
      for (const [a, b] of [[-2, -2], [5, -2], [-2, 5], [5, 5]]) P.box(cx + a, cy + b, cz + 2, cx + a + 1, cy + b + 1, cz + 12, M.METAL_DARK);
      P.box(cx, cy, cz + 6, cx + 3, cy + 3, cz + 10, VM.BRONZE);
      for (let k = 0; k < 5; k++) P.box(cx - 3 + k, cy - 3 + k, cz + 12 + k, cx + 7 - k, cy + 7 - k, cz + 13 + k, M.ZINC);
      P.box(cx + 1, cy + 1, cz + 17, cx + 2, cy + 2, cz + 32, M.METAL_DARK);
      const flag = stripe([[0.46, 0.10, 0.17], [0.46, 0.10, 0.17], [0.58, 0.58, 0.56], [0.46, 0.10, 0.17]], 2, 'z');
      for (let i = 0; i < 12; i++) { const wv = Math.round(Math.sin(i * 0.7) * 0.6); P.box(cx + 2 + i, cy + 1 + wv, cz + 24 - (i > 8 ? 1 : 0), cx + 3 + i, cy + 2 + wv, cz + 31, M.CANVAS, flag); }
      // lanternes de la porte, projecteurs de façade
      wallLantern(fa, 11, ZG + 9, night && !bad);
      wallLantern(fa, 28, ZG + 9, night);
      if (night && !bad) {
        for (const lx of [478, 542]) P.light({ x: lx, y: 80, z: 3, r: 86, fall: 1.6, cr: 0.95, cg: 0.78, cb: 0.52, axis: [0, -0.55, 0.835], c0: 0.35, c1: 0.75, spill: 0.0, skip: 2 });
      }
      if (bad) { const fb = new Facade(P, LEFT, ax0, y0, aw, d + 6); fb.sign(3, ZG + 21, 'LE RACING VIVRA', { plate: [0.86, 0.84, 0.78], plateMat: M.CANVAS, fg: [0.46, 0.10, 0.16], depth: -2, padX: 1, padY: 1 }); }
      place('mairie', 'La mairie', 510, 66, ZG + 18);
    }

    // ------------------------------------------------------------ l'église (à l'ouest de la place), clocher-porche sur la place
    {
      const S0 = VM.CHURCH, AW = 18, NW = 32;
      const vit = night && !bad;
      // le petit enclos autour du chevet : herbe, vieilles tombes, un if
      P.box(250, 76, 1, 268, 140, 2, M.GRASS);
      for (const [gx, gy] of [[253, 79], [258, 81], [254, 130], [259, 133], [263, 129]]) { P.box(gx, gy, G, gx + 2, gy + 1, G + 3, M.STONE); P.set(gx, gy, G + 3, M.STONE); }
      B.planeTree(P, 256, 134, G, { seed: 91, trunk: 7, r: 4.5, branches: 2, leafR: 6, leafAmt: 0.3 });
      // collatéraux, nef, abside en hémicycle
      P.box(268, 78, G, 346, 92, G + AW, S0); P.box(268, 122, G, 346, 136, G + AW, S0);
      P.box(268, 92, G, 346, 122, G + NW, S0);
      for (let y = 90; y < 125; y++) for (let x = 250; x < 268; x++) if ((268 - x) ** 2 + (107 - y) ** 2 <= 15.5 * 15.5) P.box(x, y, G, x + 1, y + 1, G + 28, S0);
      // toits : nef, appentis des collatéraux, cul-de-four de l'abside
      pitched(P, 268, 92, 78, 30, G + NW, M.SLATE, { axis: 'x', pitch: 1.2, oh: 1 });
      for (let y = 122; y < 138; y++) { const zt = G + AW + Math.round((138 - y) * 0.6); P.box(266, y, G + AW, 347, y + 1, zt, M.SLATE); }
      for (let y = 76; y < 92; y++) { const zt = G + AW + Math.round((y - 76) * 0.6); P.box(266, y, G + AW, 347, y + 1, zt, M.SLATE); }
      for (let k = 0; k < 16; k++) { const r = 16.5 - k * 1.05; for (let y = 89; y < 126; y++) for (let x = 248; x < 268; x++) if ((268 - x) ** 2 + (107 - y) ** 2 <= r * r) P.set(x, y, G + 28 + k, M.SLATE); }
      // le transept sud : son pignon et sa grande verrière dépassent des toits du quai
      {
        const x0 = 270, w = 22, y0 = 118, d = 34;
        P.box(x0, y0, G, x0 + w, y0 + d, G + NW, S0);
        const apex = pitched(P, x0, y0, w, d, G + NW, M.SLATE, { axis: 'y', pitch: 1.4, oh: 1, gable: S0 });
        const ft = new Facade(P, LEFT, x0, y0, w, d);
        const id = obj({ type: 'vieille_vitrail', face: LEFT, a0: x0 + 7, z0: G + 12, w: 8, h: 24, lit: vit ? 0.5 : 0, seed: 77 });
        ft.rect(7, G + 12, 15, G + 36, 0, 0); ft.rect(7, G + 12, 15, G + 36, 1, M.GLASS, id);
        ft.rect(6, G + 11, 16, G + 12, -1, M.STONE);
        for (const s2 of [0, w - 2]) { P.box(x0 + s2, y0 + d, G, x0 + s2 + 2, y0 + d + 3, G + 26, S0); for (let k = 0; k < 3; k++) P.box(x0 + s2, y0 + d + k, G + 26 + (2 - k) * 2, x0 + s2 + 2, y0 + d + k + 1, G + 28 + (2 - k) * 2, M.SLATE); }
        P.box(x0 + 10, y0 + d - 2, apex - 1, x0 + 12, y0 + d, apex + 4, M.STONE); P.set(x0 + 9, y0 + d - 1, apex + 2, M.STONE); P.set(x0 + 12, y0 + d - 1, apex + 2, M.STONE);
      }
      // contreforts et vitraux du flanc sud, fenêtres hautes de la nef
      const fs = new Facade(P, LEFT, 268, 78, 78, 58);
      for (let s2 = 2; s2 < 78; s2 += 13) { if (s2 > 0 && s2 < 26) continue; P.box(268 + s2, 136, G, 268 + s2 + 2, 139, G + 14, S0); for (let k = 0; k < 3; k++) P.box(268 + s2, 136 + k, G + 14 + (2 - k) * 2, 268 + s2 + 2, 137 + k, G + 16 + (2 - k) * 2, M.SLATE); }
      for (let s2 = 32; s2 < 74; s2 += 13) {
        const id = obj({ type: 'vieille_vitrail', face: LEFT, a0: 268 + s2, z0: G + 4, w: 4, h: 12, lit: vit ? 0.42 : 0, seed: s2 });
        fs.rect(s2, G + 4, s2 + 4, G + 16, 0, 0); fs.rect(s2, G + 4, s2 + 4, G + 16, 1, M.GLASS, id);
      }
      const fn = new Facade(P, LEFT, 268, 92, 78, 30);
      for (let s2 = 30; s2 < 76; s2 += 11) {
        const id = obj({ type: 'vieille_vitrail', face: LEFT, a0: 268 + s2, z0: G + 27, w: 3, h: 5, lit: vit ? 0.38 : 0, seed: s2 + 50 });
        fn.rect(s2, G + 27, s2 + 3, G + 32, 0, 0); fn.rect(s2, G + 27, s2 + 3, G + 32, 1, M.GLASS, id);
      }
      // faces est des collatéraux (visibles depuis la place)
      for (const [y0, d] of [[78, 14], [122, 14]]) {
        const fe2 = new Facade(P, RIGHT, 268, y0, 78, d);
        const id = obj({ type: 'vieille_vitrail', face: RIGHT, a0: y0 + d - 5, z0: G + 4, w: 4, h: 12, lit: vit ? 0.42 : 0, seed: y0 });
        fe2.rect(5, G + 4, 9, G + 16, 0, 0); fe2.rect(5, G + 4, 9, G + 16, 1, M.GLASS, id);
      }
      // le clocher-porche
      const tx = 346, ty = 94, tw = 26, tt = G + 58;
      P.box(tx, ty, G, tx + tw, ty + tw, tt, S0);
      const fe = new Facade(P, RIGHT, tx, ty, tw, tw), fsT = new Facade(P, LEFT, tx, ty, tw, tw);
      for (const z of [G + 22, G + 38]) { fe.rect(-1, z, tw + 1, z + 1, -1, M.STONE); fsT.rect(-1, z, tw + 1, z + 1, -1, M.STONE); }
      fe.rect(-1, tt - 2, tw + 1, tt, -1, M.STONE); fsT.rect(-1, tt - 2, tw + 1, tt, -1, M.STONE);
      // portail en arc brisé, voussures
      const ps = 8, pw = 10;
      for (let k = 0; k < 3; k++) {
        const ww = pw + 4 - k * 2, s0 = ps - 2 + k;
        for (let z = G; z < G + 21 - k; z++) {
          const h = z - (G + 11), half = ww / 2;
          let lim = half; if (h > 0) lim = Math.sqrt(Math.max(0, ww * ww - h * h)) - half;
          for (let s2 = s0; s2 < s0 + ww; s2++) { const cx = s2 + 0.5 - (s0 + half); if (Math.abs(cx) <= lim + 0.01) fe.set(s2, z, k, 0); }
        }
      }
      fe.rect(ps, G, ps + pw, G + 12, 3, M.WOOD_DARK);
      fe.rect(ps, G + 12, ps + pw, G + 19, 3, M.STONE);
      fe.rect(ps + 5, G, ps + 6, G + 12, 3, M.METAL_DARK);
      for (let k = 0; k < 3; k++) P.box(tx + tw + k * 2, ty + ps - k * 2, G, tx + tw + 2 + k * 2, ty + ps + pw + k * 2, G + 2 - (k > 1 ? 1 : 0), M.STONE);
      // rose au-dessus du portail
      { const id = obj({ type: 'vieille_vitrail', face: RIGHT, a0: ty + tw - 8, z0: G + 24, w: 10, h: 10, shape: 'rose', lit: vit ? 0.55 : 0 }); fe.rect(8, G + 24, 18, G + 34, 0, 0); fe.rect(8, G + 24, 18, G + 34, 1, M.GLASS, id); }
      // une horloge sur la face sud du clocher
      { const ck = obj({ type: 'vieille_clock', face: LEFT, a0: tx + 9, z0: G + 26, w: 8, hour: ClockHM[0], min: ClockHM[1], lit: vit ? 0.5 : 0 }); for (let s2 = 9; s2 < 17; s2++) for (let z = G + 26; z < G + 34; z++) fsT.set(s2, z, -1, S0, ck); }
      // abat-sons du beffroi, la cloche
      for (const f2 of [fe, fsT]) for (const s2 of [6, 15]) { f2.rect(s2, G + 41, s2 + 5, G + 54, 0, 0); for (let z = G + 41; z < G + 54; z++) f2.rect(s2, z, s2 + 5, z + 1, 1, z % 2 ? M.WOOD_DARK : M.WOOD); }
      P.box(tx + 10, ty + 10, G + 43, tx + 16, ty + 16, G + 52, VM.BRONZE);
      // balustrade, clochetons d'angle, flèche octogonale en retrait, lucarnes, croix et coq
      for (let i = 0; i < tw; i += 2) { P.set(tx + i, ty, tt, S0); P.set(tx + i, ty + tw - 1, tt, S0); P.set(tx, ty + i, tt, S0); P.set(tx + tw - 1, ty + i, tt, S0); }
      for (const [a2, b2] of [[0, 0], [tw - 2, 0], [0, tw - 2], [tw - 2, tw - 2]]) { P.box(tx + a2, ty + b2, tt, tx + a2 + 2, ty + b2 + 2, tt + 6, S0); P.set(tx + a2, ty + b2, tt + 6, M.SLATE); P.set(tx + a2 + 1, ty + b2 + 1, tt + 6, M.SLATE); P.set(tx + a2, ty + b2 + 1, tt + 7, M.SLATE); }
      const scx = tx + tw / 2 - 0.5, scy = ty + tw / 2 - 0.5;
      for (let k = 0; k < 40; k++) {
        const r = 7.6 - k * 0.19; if (r < 0.6 || tt + k > 97) break;
        for (let y = ty; y < ty + tw; y++) for (let x = tx; x < tx + tw; x++) if (octD(x - scx, y - scy) <= r) P.set(x, y, tt + k, M.SLATE);
      }
      { const ly = ty + 16; P.box(tx + 10, ly, tt, tx + 16, ly + 5, tt + 7, M.SLATE); pitched(P, tx + 10, ly, 6, 5, tt + 7, M.SLATE, { axis: 'y', pitch: 1.2, oh: 0 }); const fd = new Facade(P, LEFT, tx + 10, ly, 6, 5); fd.rect(2, tt + 1, 4, tt + 6, 0, 0); fd.rect(2, tt + 1, 4, tt + 6, 1, M.WOOD_DARK); }
      { const lx = tx + 16; P.box(lx, ty + 10, tt, lx + 5, ty + 16, tt + 7, M.SLATE); pitched(P, lx, ty + 10, 5, 6, tt + 7, M.SLATE, { axis: 'x', pitch: 1.2, oh: 0 }); const fd = new Facade(P, RIGHT, lx, ty + 10, 5, 6); fd.rect(2, tt + 1, 4, tt + 6, 0, 0); fd.rect(2, tt + 1, 4, tt + 6, 1, M.WOOD_DARK); }
      P.box(tx + 12, ty + 12, 94, tx + 13, ty + 13, 99, M.METAL_DARK);
      P.box(tx + 11, ty + 12, 96, tx + 14, ty + 13, 97, M.METAL_DARK);
      P.set(tx + 12, ty + 12, 99, VM.GOLD); P.set(tx + 13, ty + 12, 99, VM.GOLD);
      // monument aux morts, devant le collatéral sud
      {
        const mx = 386, my = 128;
        P.box(mx - 4, my - 4, 1, mx + 12, my + 12, 2, VM.FLAGSTONE);
        P.box(mx - 2, my - 2, G, mx + 10, my + 10, G + 1, M.STONE);
        P.box(mx, my, G + 1, mx + 8, my + 8, G + 14, VM.ASHLAR);
        P.box(mx - 1, my - 1, G + 14, mx + 9, my + 9, G + 15, M.STONE);
        const fm = new Facade(P, LEFT, mx, my, 8, 8), fr = new Facade(P, RIGHT, mx, my, 8, 8);
        const nm = obj({ type: 'vieille_names', face: LEFT, a0: mx + 1, z0: G + 3, w: 6, h: 9, seed: 1 });
        tagRect(fm, 1, G + 3, 7, G + 12, nm);
        const nm2 = obj({ type: 'vieille_names', face: RIGHT, a0: my + 7, z0: G + 3, w: 6, h: 9, seed: 2 });
        tagRect(fr, 1, G + 3, 7, G + 12, nm2);
        // le soldat de bronze
        const bz = G + 15, bx = mx + 3, by = my + 3;
        P.box(bx, by, bz, bx + 3, by + 2, bz + 1, VM.BRONZE);
        P.box(bx, by, bz + 1, bx + 1, by + 2, bz + 5, VM.BRONZE); P.box(bx + 2, by, bz + 1, bx + 3, by + 2, bz + 5, VM.BRONZE);
        P.box(bx, by, bz + 5, bx + 3, by + 2, bz + 9, VM.BRONZE);
        P.box(bx - 1, by, bz + 6, bx, by + 1, bz + 9, VM.BRONZE); P.box(bx + 3, by + 1, bz + 4, bx + 4, by + 2, bz + 12, VM.BRONZE);
        P.box(bx + 1, by, bz + 9, bx + 2, by + 2, bz + 11, VM.BRONZE); P.box(bx, by, bz + 11, bx + 3, by + 2, bz + 12, VM.BRONZE);
        // chaîne et bornes, fleurs
        for (const [a, b] of [[-3, -3], [10, -3], [-3, 10], [10, 10], [3, -3], [3, 10], [-3, 3], [10, 3]]) { P.box(mx + a, my + b, G, mx + a + 1, my + b + 1, G + 4, M.STONE); }
        B.railing(P, mx - 3, my + 10, mx + 10, my + 10, G, 3, M.METAL_DARK, 13);
        B.railing(P, mx + 10, my - 3, mx + 10, my + 10, G, 3, M.METAL_DARK, 13);
        const fl = obj({ type: 'vieille_produce', pal: [[0.80, 0.12, 0.12], [0.85, 0.85, 0.80], [0.30, 0.50, 0.25]], seed: 3 });
        if (!bad) { P.box(mx - 2, my + 8, G, mx + 9, my + 10, G + 1, M.HEDGE, fl); P.box(mx + 8, my - 2, G, mx + 10, my + 9, G + 1, M.HEDGE, fl); }
        place('monument', 'Le monument aux morts', mx + 4, my + 4, G + 28);
      }
      if (night && !bad) P.light({ x: tx + tw + 4, y: ty + 13, z: G + 18, r: 30, cr: 0.9, cg: 0.6, cb: 0.3, skip: 2 });
      wallLantern(fe, 6, G + 14, night && !bad); wallLantern(fe, 23, G + 14, night);
      place('eglise', "L'église", tx + tw + 1, ty + 13, G + 23);
    }

    // ------------------------------------------------------------ rez-de-chaussée commerçant générique
    // o : s, w, h, kind (vieille_shop) ou std (overlay 'shop' de mats), sign, signO, door (s), awn (matière), awnTag,
    //     nightLit (vitrine allumée la nuit), open (ouvert la nuit), bad ('rideau' | 'vide' | 'open')
    const gfShop = o => f => {
      const h = o.h || 13, s = o.s != null ? o.s : 2, w = o.w || f.len - 10;
      const badMode = bad ? (o.bad || 'rideau') : 'open';
      const isOpen = badMode === 'open' && (day || o.open || o.nightLit);
      f.rect(s - 1, G, s + w + 1, G + 1, 0, M.STONE);
      if (isOpen) {
        const lit = night && (o.open || o.nightLit);
        const light = lit ? { r: o.lr || 34, c: o.lc || [0.62, 0.42, 0.22] } : null;
        if (o.std) f.shop(s, G + 1, w, h, o.std, { light, lintelMat: M.WOOD_DARK, k: night ? 1 : 0.9 });
        else vshop(f, s, G + 1, w, h, o.kind, { light, heads: o.heads, k: night ? 1 : 0.9 });
      } else if (badMode === 'vide') {
        vshop(f, s, G + 1, w, h, 'vide', {});
        f.poster(s + Math.floor(w / 2) - 4, G + 5, 9, 5, { title: 'À LOUER', bg: [0.86, 0.84, 0.78], fg: [0.50, 0.10, 0.12], depth: 1, seed: s });
      } else f.shop(s, G + 1, w, h, 'rideau', { lintelMat: M.WOOD_DARK });
      if (o.door != null) {
        const dk = isOpen && (o.open || day) ? 'door' : 'rideau';
        if (o.plainDoor) f.door(o.door, G, 5, 12, { mat: o.doorMat || M.WOOD_DARK, frameMat: M.STONE });
        else f.door(o.door, G, 5, 12, { kind: dk, frameMat: M.WOOD_DARK });
      }
      if (o.awn && (day || o.awnNight) && !(bad && o.awnBad === false)) f.awning(s - 1, w + 2, G + h + 2, o.awnOut || 6, o.awn);
      if (o.sign) {
        const bm = textBitmap(o.sign), sc = (o.signO && o.signO.scale) || 1;
        const nw = Math.ceil((bm.w * sc + 4) / 2);
        const s0 = o.signS != null ? o.signS : Math.max(0, Math.round((f.len - nw) / 2));
        const so = Object.assign({ plate: [0.12, 0.10, 0.08], fg: [0.88, 0.80, 0.56] }, o.signO || {});
        if (night && so.glow && !bad) so.emit = so.glow;
        if (bad && o.signWorn) so.worn = o.signWorn;
        f.sign(s0, o.signZ || G + h + 7, o.sign, so);
      }
    };
    const pick = a => a[Math.floor(R() * a.length)];

    // ------------------------------------------------------------ le café de la Mairie (angle nord-ouest de la place)
    {
      const open = !(bad && night);
      house(P, ctx, {
        x0: 380, y0: 8, w: 56, d: 52, gh: 22, fh: 15, nf: 2, wall: M.PLASTER_CREAM, k: [1.08, 1.02, 0.82],
        roof: { t: 'mans', h: 10 }, dorm: [8, 25, 42], bal: 1, chim: [[3, 22, 7], [50, 22, 7]], ant: [30, 30],
        win: { w: 6, h: 10, cols: [4, 15, 26, 37, 47], shutter: M.SHUTTER_BORD },
        gf: f => {
          if (open) {
            vshop(f, 3, G, 19, 15, 'cafe', { heads: night ? [8, 26] : [6, 18, 30], light: night ? { r: 46, c: [0.80, 0.50, 0.22] } : null });
            f.door(24, G, 7, 15, { kind: 'door', frameMat: M.WOOD_DARK });
            vshop(f, 33, G, 20, 15, 'cafe', { heads: night ? [12] : [10, 24], light: night ? { r: 40, c: [0.75, 0.46, 0.2] } : null });
          } else { f.shop(3, G, 19, 15, 'rideau'); f.shop(33, G, 20, 15, 'rideau'); f.door(24, G, 7, 15, { kind: 'rideau' }); }
          f.awning(2, 52, G + 17, 7, M.AWNING);
          f.sign(11, G + 24, 'CAFÉ DE LA MAIRIE', { plate: [0.10, 0.20, 0.15], plateMat: M.METAL_GREEN, fg: [0.90, 0.78, 0.45], emit: night && !bad ? [0.95, 0.72, 0.34] : null });
        },
      });
      // la terrasse
      if (open) {
        const tables = day ? [[384, 71], [394, 71], [404, 71], [414, 71], [424, 71], [389, 80], [400, 80], [411, 80], [422, 80]] : [[386, 71], [398, 71], [410, 71]];
        for (const [x, y] of tables) { B.terraceTable(P, x, y, G); B.chair(P, x - 2, y, G, 'x'); B.chair(P, x + 3, y + 1, G, 'y'); }
        if (day) { B.parasol(P, 395, 85, G); B.parasol(P, 417, 85, G); }
        // l'ardoise du plat du jour
        P.box(436, 64, G, 437, 65, G + 7, M.WOOD); P.box(436, 65, G + 2, 437, 69, G + 8, M.METAL_DARK);
      }
      place('cafe_mairie', 'Le café de la Mairie', 407, 62, G + 27);
    }

    // ------------------------------------------------------------ la rédaction de L'Écho et sa rotative (angle nord-est)
    {
      const x0 = 584, y0 = 8, w = 112, d = 52, gh = 22, top = G + gh + 32;
      P.box(x0, y0, G, x0 + w, y0 + d, top, M.BRICK_PALE);
      const f = new Facade(P, LEFT, x0, y0, w, d);
      // la salle des machines, ouverte sur la place par quatre baies
      P.box(x0 + 2, y0 + 20, G, x0 + w - 2, y0 + d - 1, G + gh - 2, 0);
      P.box(x0 + 2, y0 + 20, 1, x0 + w - 2, y0 + d - 1, 2, M.CONCRETE);
      f.rect(0, G, w, G + 2, -1, M.STONE);
      const pil = [[0, 4], [20, 4], [40, 2], [70, 2], [88, 4], [108, 4]];
      for (const [s, pw] of pil) { f.rect(s, G, s + pw, top, -1, M.STONE); f.rect(s, top - 4, s + pw, top, -2, M.STONE); }
      f.rect(0, G + gh, w, G + gh + 2, -1, M.STONE);
      f.rect(-1, top - 2, w + 1, top, -2, M.STONE); f.rect(-1, top - 3, w + 1, top - 2, -1, M.STONE);
      const bays = [5, 25, 73, 93];
      for (const s0 of bays) {
        f.rect(s0, G + 2, s0 + 14, G + 16, 0, 0);
        f.rect(s0 + 1, G + 16, s0 + 13, G + 17, 0, 0); f.rect(s0 + 3, G + 17, s0 + 11, G + 18, 0, 0);
        // imposte vitrée en éventail, appui de pierre, clé d'arc
        for (let s = s0 + 1; s < s0 + 14; s += 3) f.set(s, G + 15, 0, M.METAL_DARK);
        f.rect(s0, G + 14, s0 + 14, G + 15, 0, M.METAL_DARK);
        f.rect(s0 - 1, G + 1, s0 + 15, G + 2, -1, M.STONE);
        f.rect(s0 + 6, G + 18, s0 + 8, G + 20, 0, M.STONE);
      }
      // la porte, le millésime, les vitrines de la Une
      f.door(53, G, 6, 15, { kind: night && bad ? 'rideau' : 'door', frameMat: M.STONE, step: true });
      f.sign(52, G + 21, '1902', { fg: [0.86, 0.68, 0.26], depth: 0 });
      const une = (s, title, seed) => {
        f.rect(s, G + 2, s + 10, G + 18, -1, M.WOOD_DARK);
        const id = obj({ type: 'vieille_une', face: LEFT, a0: x0 + s + 1, z0: G + 3, w: 8, h: 14, mast: 'ÉCHO', title, lit: night ? 0.6 : 0, seed });
        for (let ss = s + 1; ss < s + 9; ss++) for (let z = G + 3; z < G + 17; z++) f.set(ss, z, -2, M.PLASTIC_WHITE, id);
      };
      une(42, bad ? '0-3' : '1-0', 1); une(60, bad ? 'CRISE' : 'COUPE', 2);
      if (night) { for (const s of [41, 70]) wallLantern(f, s, G + 17, true); }
      // étages : la rédaction, qui veille
      for (const [s0, n] of [[4, 2], [24, 2], [44, 3], [72, 2], [92, 2]]) {
        const ws = n === 3 ? [s0 + 1, s0 + 9, s0 + 17] : [s0 + 1, s0 + 9];
        for (const s of ws) for (const z of [G + gh + 4, G + gh + 19]) {
          const lit = night && R() < (bad ? 0.3 : 0.62);
          f.window(s, z, 6, 10, { state: lit ? 'office' : 'dark', sil: lit && R() < 0.3 ? 'head' : null, silX: 4, spillR: 20, spillI: 0.45 });
        }
      }
      // le nom, en lettres d'or sur l'attique
      P.box(x0, y0 + d - 2, top, x0 + w, y0 + d, top + 10, M.BRICK_PALE);
      P.box(x0 - 1, y0 + d - 2, top + 10, x0 + w + 1, y0 + d + 1, top + 11, M.STONE);
      f.sign(24, top + 9, "L'ÉCHO D'AUBÉRIVE", { scale: 2, plate: [0.10, 0.19, 0.14], plateMat: M.METAL_GREEN, fg: [0.90, 0.72, 0.30], emit: night && !bad ? [0.55, 0.42, 0.16] : null });
      if (night && !bad) for (const s of [34, 56, 78]) { f.set(s, top + 10, -2, M.METAL_DARK); f.set(s, top + 10, -3, M.BULB); const p = f.front(s, top + 9, 4); P.light({ x: p.x, y: p.y, z: p.z, r: 22, cr: 0.9, cg: 0.65, cb: 0.32, shadow: false }); }
      // toit à sheds de l'atelier
      B.flatRoof(P, x0, y0, w, d - 2, top, M.BRICK_PALE, { parapet: 0 });
      for (let j = 0; j < 4; j++) { const ys = y0 + 4 + j * 10; for (let t = 0; t < 7; t++) P.box(x0 + 4, ys + t, top + 1, x0 + w - 4, ys + t + 1, top + 1 + (7 - t), M.ZINC); P.box(x0 + 4, ys, top + 1, x0 + w - 4, ys + 1, top + 8, night ? M.SKYLIGHT : M.GLASS); }
      B.chimney(P, x0 + 6, y0 + 6, top, 12, M.BRICK);
      // la rotative : cinq groupes, les bobines, la plieuse
      const RY = y0 + 34;
      for (let i = 0; i < 5; i++) {
        const ux = x0 + 8 + i * 14;
        P.box(ux, RY, G, ux + 2, RY + 10, G + 12, M.METAL_GREEN); P.box(ux + 8, RY, G, ux + 10, RY + 10, G + 12, M.METAL_GREEN);
        P.box(ux, RY, G + 12, ux + 10, RY + 2, G + 13, M.METAL_GREEN);
        P.box(ux + 2, RY + 3, G + 5, ux + 8, RY + 5, G + 7, M.CHROME); P.box(ux + 2, RY + 5, G + 8, ux + 8, RY + 7, G + 10, M.CHROME);
        P.box(ux + 2, RY + 2, G + 9, ux + 8, RY + 3, G + 10, M.METAL_DARK);
        P.box(ux + 2, RY + 7, G + 10, ux + 8, RY + 8, G + 11, M.WHITE);
        P.box(ux + 2, RY + 11, G, ux + 8, RY + 15, G + 4, M.WHITE); P.box(ux + 1, RY + 12, G + 1, ux + 2, RY + 14, G + 3, M.METAL_DARK); P.box(ux + 8, RY + 12, G + 1, ux + 9, RY + 14, G + 3, M.METAL_DARK);
        P.box(ux + 3, RY + 10, G + 4, ux + 7, RY + 11, G + 10, M.WHITE);
        P.box(ux + 10, RY + 5, G + 11, ux + 14, RY + 6, G + 12, M.WHITE);
        P.box(ux - 1, RY + 9, G + 12, ux + 11, RY + 10, G + 13, M.METAL_DARK);
      }
      P.box(x0 + 78, RY, G, x0 + 94, RY + 10, G + 14, M.METAL_GREEN);
      P.box(x0 + 80, RY + 2, G + 14, x0 + 92, RY + 8, G + 15, M.WHITE); P.box(x0 + 83, RY + 3, G + 15, x0 + 89, RY + 7, G + 16, M.WHITE);
      P.box(x0 + 94, RY + 4, G + 5, x0 + 106, RY + 8, G + 6, M.METAL);
      for (const xx of [x0 + 96, x0 + 100, x0 + 104]) P.box(xx, RY + 5, G + 6, xx + 2, RY + 7, G + 7 + (xx % 3), M.WHITE);
      for (const xx of [x0 + 88, x0 + 98]) { P.box(xx, RY + 12, G, xx + 6, RY + 16, G + 1, M.WOOD); P.box(xx + 1, RY + 12, G + 1, xx + 5, RY + 16, G + 4, M.PLASTIC_WHITE); }
      if (night) {
        const I = bad ? 1.0 : 1.9;
        for (const lx of [x0 + 16, x0 + 56, x0 + 96]) P.light({ x: lx, y: y0 + 46, z: G + 18, r: 44, fall: 1.4, cr: 0.80 * I, cg: 0.86 * I, cb: 0.74 * I, skip: 1.2 });
      } else for (const lx of [x0 + 30, x0 + 82]) P.light({ x: lx, y: y0 + 46, z: G + 18, r: 36, fall: 1.6, cr: 0.35, cg: 0.37, cb: 0.33, skip: 1.2, shadow: false });
      place('echo', "L'Écho d'Aubérive", x0 + 56, y0 + d + 2, G + 20);
    }

    // ------------------------------------------------------------ le cinéma L'Aurore, sur le quai (angle sud-est de la place)
    {
      const x0 = 656, w = 80, yb = 196, yf = 212;
      const ivory = obj({ type: 'vieille_tint', k: [1.14, 1.12, 1.06] });
      // la salle : un volume enduit à toit-terrasse, ses lanterneaux et ses extracteurs
      P.box(x0, 140, G, x0 + w, yb, G + 40, M.PLASTER_GREY);
      B.flatRoof(P, x0, 140, w, yb - 140, G + 40, M.PLASTER_GREY, { parapet: 2 });
      for (const [vx, vy] of [[x0 + 14, 150], [x0 + 46, 150], [x0 + 14, 170], [x0 + 46, 170]]) { P.box(vx, vy, G + 41, vx + 14, vy + 10, G + 42, M.METAL); P.box(vx + 1, vy + 1, G + 42, vx + 13, vy + 9, G + 44, night && !bad ? M.SKYLIGHT : M.GLASS); }
      for (const [vx, vy] of [[x0 + 6, 186], [x0 + 70, 146], [x0 + 70, 186]]) { P.box(vx, vy, G + 41, vx + 4, vy + 4, G + 46, M.METAL); P.box(vx - 1, vy - 1, G + 46, vx + 5, vy + 5, G + 47, M.METAL_DARK); }
      // la cabine de projection, en saillie sur le toit
      P.box(x0 + 30, 184, G + 40, x0 + 50, yb, G + 50, M.PLASTER_CREAM, ivory); B.flatRoof(P, x0 + 30, 184, 20, yb - 184, G + 50, M.PLASTER_CREAM, { parapet: 0 });
      P.box(x0, yb, G, x0 + w, yf, G + 56, M.PLASTER_CREAM, ivory);
      const f = new Facade(P, LEFT, x0, yb, w, yf - yb);
      // fronton à gradins
      P.box(x0 + 12, yf - 6, G + 56, x0 + w - 12, yf, G + 60, M.PLASTER_CREAM, ivory);
      P.box(x0 + 22, yf - 6, G + 60, x0 + w - 22, yf, G + 64, M.PLASTER_CREAM, ivory);
      P.box(x0 + 31, yf - 6, G + 68 - 4, x0 + w - 31, yf, G + 68, M.PLASTER_CREAM, ivory);
      // ailettes, soubassement bordeaux, filets d'or
      for (const s of [2, 10, 68, 76]) f.rect(s, G + 22, s + 2, G + 56, -1, M.PLASTER_CREAM, ivory);
      f.rect(0, G, w, G + 2, -1, M.METAL_BORD);
      f.rect(0, G + 32, w, G + 33, -1, VM.GOLD); f.rect(0, G + 52, w, G + 53, -1, VM.GOLD);
      const neonOn = night && !bad;
      // ampoules qui soulignent le fronton
      const bulbM = neonOn ? M.BULB : M.WHITE;
      for (let s = 12; s < 68; s += 2) f.set(s, G + 59, -1, bulbM);
      for (let s = 22; s < 58; s += 2) f.set(s, G + 63, -1, bulbM);
      for (let s = 31; s < 49; s += 2) f.set(s, G + 67, -1, bulbM);
      for (let z = G + 56; z < G + 68; z += 2) { f.set(12, Math.min(z, G + 59), -1, bulbM); }
      // le nom
      f.sign(18, G + 49, "L'AURORE", { scale: 3, fg: neonOn ? [1.0, 0.45, 0.30] : [0.55, 0.16, 0.16], emit: neonOn ? [1.6, 0.46, 0.26] : null, depth: 0 });
      if (neonOn) P.light({ x: x0 + 40, y: yf + 7, z: G + 44, r: 44, fall: 2, cr: 0.50, cg: 0.16, cb: 0.10, skip: 3 });
      // entrée, marquise, affiches
      const lobbyOpen = !bad;
      if (lobbyOpen) vshop(f, 28, G + 1, 24, 14, 'cinema', { light: night ? { r: 44, c: [0.85, 0.55, 0.28] } : null, lintelMat: VM.GOLD });
      else f.shop(28, G + 1, 24, 14, 'rideau', { lintelMat: VM.GOLD });
      const films = [['LE DERBY', 'ball', [0.20, 0.30, 0.55], [0.85, 0.85, 0.80]], ["L'AUBE", 'sun', [0.55, 0.15, 0.18], [0.30, 0.10, 0.12]], ['NUIT', 'city', [0.10, 0.12, 0.22], [0.22, 0.25, 0.40]], ['LA RIVE', 'face', [0.80, 0.70, 0.45], [0.45, 0.12, 0.16]]];
      [[3, 0], [16, 1], [53, 2], [66, 3]].forEach(([s, i]) => {
        const [title, art, bg, fg] = films[i], pw = 11;
        f.rect(s - 1, G + 2, s + pw + 1, G + 3, -1, M.METAL_DARK); f.rect(s - 1, G + 15, s + pw + 1, G + 16, -1, M.METAL_DARK);
        f.rect(s - 1, G + 3, s, G + 15, -1, M.METAL_DARK); f.rect(s + pw, G + 3, s + pw + 1, G + 15, -1, M.METAL_DARK);
        const id = obj({ type: 'vieille_affiche', face: LEFT, a0: x0 + s, z0: G + 3, w: pw, h: 12, title, art, bg, fg, lit: night ? (bad ? 0.0 : 0.62) : 0, barre: bad, seed: i });
        tagRect(f, s, G + 3, s + pw, G + 15, id);
      });
      for (let k = 1; k <= 7; k++) f.rect(20, G + 17, 60, G + 20, -k, M.METAL_DARK);
      f.rect(20, G + 20, 60, G + 21, -7, VM.GOLD);
      const mq = new Facade(P, LEFT, x0 + 20, yf, 40, 7);
      mq.sign(3, G + 20, bad ? 'FERMÉ' : 'LA NUIT DU DERBY', { plate: [0.92, 0.90, 0.84], plateEmit: neonOn ? [0.78, 0.74, 0.62] : null, fg: bad ? [0.70, 0.08, 0.08] : [0.10, 0.08, 0.08], depth: 0, padX: bad ? 25 : 2, padY: 0 });
      for (let s = 20; s < 60; s += 2) f.set(s, G + 17, -7, bulbM);
      if (neonOn) P.light({ x: x0 + 40, y: yf + 4, z: G + 14, r: 46, fall: 1.7, cr: 1.05, cg: 0.78, cb: 0.45, skip: 2.5 });
      // l'enseigne verticale CINÉMA
      P.box(x0 + w - 6, yf, G + 20, x0 + w - 4, yf + 7, G + 60, M.METAL_DARK);
      const bl = new Facade(P, RIGHT, x0 + w - 6, yf, 2, 7);
      [...'CINÉMA'].forEach((ch, i) => {
        const bm = textBitmap(ch); const padX = Math.floor((14 - bm.w * 2) / 2);
        bl.sign(0, G + 59 - Math.round(i * 6.5), ch, { scale: 2, fg: neonOn ? [1.0, 0.82, 0.45] : [0.72, 0.62, 0.40], emit: neonOn ? [1.35, 1.0, 0.45] : null, depth: 0, padX, padY: 0 });
      });
      if (neonOn) P.light({ x: x0 + w - 2, y: yf + 4, z: G + 42, r: 40, cr: 0.95, cg: 0.72, cb: 0.32, skip: 2.5 });
      // la cabine de projection
      for (const s of [34, 39, 44]) f.window(s, G + 44, 3, 4, { state: neonOn ? 'lit' : 'dark', sill: false, lintel: false, spill: false });
      place('cinema', "Le cinéma L'Aurore", x0 + 40, yf + 2, G + 26);
    }

    // ------------------------------------------------------------ la rangée du quai, à l'ouest de la place
    const QY = 156, QD = 56;
    // Q1 mercerie
    house(P, ctx, { x0: 0, y0: QY, w: 30, d: QD, gh: 17, nf: 3, wall: M.PLASTER_OCHRE, roof: { t: 'mans', h: 9 }, dorm: [12], chim: [[3, 20]], ant: [16, 28],
      gf: gfShop({ s: 2, w: 18, kind: 'mercerie', door: 23, sign: 'MERCERIE', awn: M.AWNING_GREEN, bad: 'vide' }) });
    // Q2 maison à colombages, pignon sur quai : horlogerie
    house(P, ctx, { x0: 30, y0: QY, w: 32, d: QD - 2, gh: 18, nf: 2, wall: M.PLASTER_CREAM, k: [1.12, 1.10, 1.02], base: VM.CHURCH, timber: true, jetty: true,
      roof: { t: 'gy', m: VM.TILE, p: 1.7, oh: 1 }, chim: [[24, 10]],
      gf: gfShop({ s: 3, w: 18, kind: 'horlogerie', door: 24, sign: 'HORLOGERIE', nightLit: true, lc: [0.6, 0.45, 0.25] }) });
    // Q3 l'hôtel de la Rive
    {
      const hq = house(P, ctx, { x0: 62, y0: QY - 4, w: 50, d: QD + 4, gh: 18, fh: 14, nf: 4, wall: M.PLASTER_CREAM, k: [1.10, 1.08, 1.02], quoins: true, bal: 1, surround: true,
        roof: { t: 'mans', h: 11 }, dorm: [2, 43], chim: [[4, 24, 8], [44, 24, 8]], ant: [26, 30],
        win: { w: 5, h: 9, cols: [6, 16, 27, 38], shutter: M.SHUTTER_GREY },
        gf: f => {
          gfShop({ s: 2, w: 26, kind: 'restaurant', heads: night ? [6, 30] : [10], open: !bad, nightLit: true, lc: [0.8, 0.5, 0.25], awn: M.AWNING_GREEN, awnOut: 5 })(f);
          f.door(33, G, 7, 14, { kind: bad && night ? 'rideau' : 'door', frameMat: M.STONE, step: true });
          vshop(f, 42, G + 1, 6, 12, 'hall', { light: night ? { r: 26, c: [0.7, 0.5, 0.25] } : null });
          // marquise de verre au-dessus de l'entrée
          for (let k = 1; k <= 4; k++) f.rect(32, G + 15, 41, G + 16, -k, k === 4 ? M.METAL_DARK : M.BOOTH);
        } });
      // le nom de l'hôtel, en lettres montées sur la corniche
      { const fr = new Facade(P, LEFT, 62, QY - 4, 50, QD + 4); const lit = night && !bad;
        fr.sign(9, hq.top + 8, 'HOTEL DE LA RIVE', { plate: [0.10, 0.12, 0.16], plateMat: M.METAL_DARK, fg: lit ? [1.0, 0.92, 0.75] : [0.86, 0.82, 0.70], emit: lit ? [1.1, 0.95, 0.70] : null, depth: -2, padX: 2, padY: 1 });
        if (lit) P.light({ x: 87, y: 216, z: hq.top + 4, r: 30, cr: 0.5, cg: 0.45, cb: 0.35, shadow: false }); }
      // l'enseigne en drapeau HÔTEL
      const fx = new Facade(P, LEFT, 62, QY - 4, 50, QD + 4);
      fx.blade(48, G + 30, 22, 4, M.METAL_DARK);
      const bl = new Facade(P, RIGHT, 62 + 48, QY + QD, 1, 4);
      [...'HOTEL'].forEach((ch, i) => { const bm = textBitmap(ch); bl.sign(0, G + 51 - i * 4, ch, { fg: night && !bad ? [1.0, 0.85, 0.5] : [0.85, 0.80, 0.62], emit: night && !bad ? [1.2, 0.9, 0.45] : null, depth: 0, padX: Math.floor((8 - bm.w) / 2), padY: 0 }); });
      if (night && !bad) P.light({ x: 112.5, y: 214, z: G + 40, r: 26, cr: 0.8, cg: 0.6, cb: 0.3, skip: 2 });
      place('hotel', "L'hôtel de la Rive", 98, 214, G + 18);
    }
    // Q4 maison à porche sur la ruelle des Tanneurs : la librairie-papeterie
    {
      house(P, ctx, { x0: 112, y0: QY, w: 48, d: QD, gh: 18, nf: 2, wall: M.PLASTER_ROSE, roof: { t: 'gx', m: M.TERRACOTTA, oh: 1 }, dorm: [30], chim: [[40, 26]], ant: [8, 30],
        gf: gfShop({ s: 18, w: 22, kind: 'librairie', door: 41, sign: 'LIBRAIRIE · PAPETERIE', nightLit: true, lc: [0.65, 0.48, 0.28], awn: M.AWNING, awnOut: 5, signS: 13 }) });
      // le passage voûté
      P.box(112, QY, G, 126, QY + QD, G + 14, 0);
      const f = new Facade(P, LEFT, 112, QY, 48, QD);
      for (let s = 0; s < 14; s++) { const t = Math.abs(s + 0.5 - 7) / 7; const zt = G + 14 + Math.round(3 * Math.sqrt(Math.max(0, 1 - t * t))); for (let z = G + 14; z < zt; z++) f.rect(s, z, s + 1, z + 1, 0, 0); }
      f.rect(0, G, 1, G + 15, -1, M.STONE); f.rect(13, G, 14, G + 15, -1, M.STONE);
      P.box(112, QY, G + 14, 126, QY + QD, G + 15, M.WOOD_DARK);
      if (night) P.light({ x: 119, y: QY + 30, z: G + 12, r: 26, cr: 0.8, cg: 0.55, cb: 0.25, skip: 1 });
      // présentoirs de journaux devant la librairie
      if (day && !bad) { P.box(132, 213, G, 136, 215, G + 7, M.METAL_DARK); P.box(132, 214, G + 3, 136, 215, G + 7, M.PLASTIC_WHITE, paint([0.86, 0.84, 0.78])); P.box(150, 213, G, 152, 215, G + 9, M.METAL); P.box(149, 213, G + 4, 153, 216, G + 9, M.POSTER); }
      place('librairie', 'La librairie-papeterie', 155, 214, G + 16);
    }
    // Q5 colombages : fleuriste
    house(P, ctx, { x0: 160, y0: QY, w: 32, d: QD - 3, gh: 17, nf: 3, wall: M.PLASTER_OCHRE, k: [1.08, 1.04, 0.95], base: M.STONE, timber: true, jetty: true,
      roof: { t: 'gy', m: M.TERRACOTTA, p: 1.7, oh: 1 }, chim: [[4, 12]],
      gf: gfShop({ s: 3, w: 18, kind: 'fleuriste', door: 24, sign: 'FLEURS', awn: M.AWNING_GREEN, awnOut: 5, bad: 'vide' }) });
    if (day && !bad) { const fl = obj({ type: 'vieille_produce', pal: [[0.9, 0.2, 0.25], [0.95, 0.85, 0.3], [0.95, 0.95, 0.9], [0.85, 0.45, 0.7], [0.3, 0.55, 0.25]], seed: 7 }); for (const x of [162, 166, 170, 174, 178]) { P.box(x, 213, G, x + 3, 216, G + 2, M.KEG); P.box(x, 213, G + 2, x + 3, 216, G + 4, M.HEDGE, fl); } }
    // Q6 pharmacie
    house(P, ctx, { x0: 192, y0: QY, w: 44, d: QD, gh: 17, nf: 3, wall: M.PLASTER_BLUE, roof: { t: 'mans', h: 10 }, dorm: [8, 30], chim: [[2, 22], [40, 22]], bal: 1,
      gf: f => {
        gfShop({ s: 3, w: 26, std: 'pharmacie', door: 33, sign: 'PHARMACIE', signO: { plate: [0.12, 0.23, 0.17], plateMat: M.METAL_GREEN, fg: [0.86, 0.88, 0.84] }, nightLit: true, lc: [0.3, 0.5, 0.42] })(f);
        const crossOn = night && !bad;
        for (let k = 1; k <= 5; k++) for (let z = G + 18; z < G + 25; z++) if (k === 2 || k === 3 || z === G + 21 || z === G + 22) f.set(41, z, -k, crossOn ? M.NEON_TEAL : M.METAL_GREEN);
        if (crossOn) P.light({ x: 233.5, y: 215, z: G + 21, r: 28, cr: 0.12, cg: 0.42, cb: 0.36, skip: 3 });
      } });
    // devant l'église, des maisons moins profondes : le flanc de l'église se montre par-dessus leurs toits
    // Q7 boucherie
    house(P, ctx, { x0: 236, y0: 172, w: 34, d: 40, gh: 17, nf: 2, wall: M.PLASTER_OCHRE, k: [1.06, 0.94, 0.80], roof: { t: 'gx', m: M.TERRACOTTA }, dorm: [14], chim: [[28, 14]],
      gf: gfShop({ s: 2, w: 22, kind: 'boucherie', door: 26, sign: 'BOUCHERIE', signO: { plate: [0.42, 0.10, 0.12], plateMat: M.METAL_BORD, fg: [0.92, 0.86, 0.70] }, awn: M.AWNING }) });
    // Q8 maison basse, toit de tuiles : quincaillerie
    house(P, ctx, { x0: 270, y0: 178, w: 30, d: 34, gh: 17, nf: 1, wall: M.PLASTER_CREAM, k: [1.12, 1.12, 1.08], roof: { t: 'gy', m: VM.TILE, p: 1.2, oh: 1 }, chim: [[4, 12]],
      gf: gfShop({ s: 2, w: 18, kind: 'quincaillerie', door: 22, sign: 'QUINCAILLERIE', signS: 1, bad: 'vide' }) });
    // Q9 maison étroite : coiffeur
    {
      house(P, ctx, { x0: 300, y0: 172, w: 24, d: 40, gh: 17, nf: 1, wall: M.PLASTER_ROSE, k: [1.08, 0.96, 0.86], roof: { t: 'gy', m: M.SLATE, p: 1.3, oh: 1 }, chim: [[18, 6]],
        win: { w: 5, h: 9, cols: [4, 15] },
        gf: gfShop({ s: 2, w: 13, kind: 'coiffeur', door: 17, sign: 'COIFFEUR', signS: 3 }) });
      const f = new Facade(P, LEFT, 300, 172, 24, 40);
      for (let z = G + 8; z < G + 14; z++) f.set(16, z, -1, (z % 2 ? M.PLASTIC_RED : M.PLASTIC_WHITE));
    }
    // Q9b maison de rapport, étroite et haute
    house(P, ctx, { x0: 324, y0: 172, w: 18, d: 40, gh: 17, nf: 2, wall: M.PLASTER_CREAM, k: [0.98, 1.0, 1.04], roof: { t: 'gy', m: VM.TILE, p: 1.4, oh: 1 }, chim: [[12, 6]],
      win: { w: 5, h: 9, cols: [7] },
      gf: f => { f.door(6, G, 6, 13, { mat: M.SHUTTER_BLUE, frameMat: M.STONE, step: true }); f.rect(5, G + 15, 13, G + 16, -1, M.STONE); } });
    // les cours derrière, et la placette du chevet
    P.box(236, 156, 1, 342, 172, 2, M.GRAVEL);
    for (const x of [236, 270, 300, 324]) P.box(x, 156, G, x + 1, 172, G + 7, VM.CHURCH);
    P.box(236, 156, G, 342, 157, G + 8, VM.CHURCH); P.box(236, 156, G + 8, 342, 157, G + 9, VM.TILE);
    for (const x of [252, 284, 312]) { P.box(x, 156, G, x + 5, 157, G + 8, 0); P.box(x, 156, G, x + 5, 157, G + 7, M.WOOD_DARK); }
    B.planeTree(P, 286, 164, G, { seed: 71, trunk: 9, r: 6, branches: 3, leafR: 8, leafAmt: 0.5 });
    P.box(342, 156, 1, 380, 166, 2, M.COBBLE);
    // Q10 la boulangerie, à l'angle de la place
    {
      const x0 = 342, w = 38;
      house(P, ctx, { x0, y0: 166, w, d: 46, gh: 18, nf: 2, wall: M.PLASTER_CREAM, k: [1.04, 0.98, 0.84], quoins: true, east: true, eastCols: [5, 17, 29], bal: 1,
        roof: { t: 'mans', h: 9 }, dorm: [6, 26], dormE: [8, 28], chim: [[4, 18], [32, 26]], ant: [20, 22],
        win: { w: 5, h: 9, cols: [5, 16, 27] },
        gf: gfShop({ s: 3, w: 20, kind: 'boulangerie', door: 26, sign: 'BOULANGERIE', signS: 3, awn: M.AWNING, awnOut: 5, bad: 'rideau' }),
        eastGf: f => {
          gfShop({ s: 4, w: 28, kind: 'boulangerie', door: 36, sign: 'BOULANGERIE', signO: { plate: [0.42, 0.11, 0.16], plateMat: M.METAL_BORD, fg: [0.92, 0.84, 0.62], glow: [0.6, 0.45, 0.2] }, awn: M.AWNING, awnOut: 5, nightLit: true, lc: [0.7, 0.5, 0.25] })(f);
        } });
      place('boulangerie', 'La boulangerie', 382, 173, G + 16);
    }

    // ------------------------------------------------------------ la rangée du quai, à l'est de la place
    // E1 colombages : épicerie
    house(P, ctx, { x0: 736, y0: 154, w: 34, d: 56, gh: 17, nf: 2, wall: M.PLASTER_CREAM, k: [1.10, 1.06, 0.96], base: M.STONE, timber: true, jetty: true,
      roof: { t: 'gy', m: M.TERRACOTTA, p: 1.6, oh: 1 }, chim: [[6, 12]],
      gf: gfShop({ s: 3, w: 20, kind: 'epicerie', door: 26, sign: 'ÉPICERIE', awn: M.AWNING_GREEN, awnOut: 5, nightLit: false }) });
    if (day && !bad) { const fr = obj({ type: 'vieille_produce', pal: [[0.85, 0.20, 0.12], [0.95, 0.62, 0.15], [0.35, 0.60, 0.22], [0.95, 0.85, 0.30]], seed: 11 }); for (const x of [738, 744, 750]) { P.box(x, 213, G, x + 5, 217, G + 3, M.WOOD); P.box(x, 213, G + 3, x + 5, 217, G + 4, M.WOOD, fr); } }
    // E2 brasserie du Pont
    house(P, ctx, { x0: 770, y0: 152, w: 42, d: 60, gh: 18, nf: 3, wall: M.PLASTER_CREAM, k: [1.0, 0.98, 0.92], quoins: true, bal: 1, roof: { t: 'mans', h: 10 }, dorm: [8, 28], chim: [[3, 24], [38, 24]], ant: [20, 30],
      gf: gfShop({ s: 2, w: 28, kind: 'restaurant', heads: [5, 22, 40], door: 33, sign: 'BRASSERIE DU PONT', signO: { plate: [0.42, 0.11, 0.16], plateMat: M.METAL_BORD, fg: [0.92, 0.84, 0.62], glow: [0.9, 0.7, 0.35] }, open: true, lc: [0.85, 0.52, 0.24], lr: 44, awn: M.AWNING, awnOut: 6, awnNight: true, bad: 'rideau' }) });
    // E3 maison étroite : cordonnier
    house(P, ctx, { x0: 812, y0: 156, w: 24, d: 56, gh: 17, nf: 3, wall: M.PLASTER_ROSE, roof: { t: 'gy', m: M.SLATE, p: 1.5 }, win: { w: 5, h: 9, cols: [4, 15] }, east: true, eastCols: [10, 30],
      gf: gfShop({ s: 2, w: 12, kind: 'quincaillerie', door: 16, sign: 'CORDONNIER', signS: 1 }) });
    // la porte du Four (arche sur le passage)
    { P.box(836, 208, G + 16, 848, 212, G + 21, VM.CHURCH); P.box(836, 208, G + 21, 848, 212, G + 22, M.STONE);
      for (let s = 0; s < 12; s++) { const t = Math.abs(s + 0.5 - 6) / 6; const zb = G + 16 + Math.round(3 * (1 - Math.sqrt(Math.max(0, 1 - t * t)))); P.box(836 + s, 208, G + 16, 837 + s, 212, zb, 0); } }
    // E4 cycles
    house(P, ctx, { x0: 848, y0: 154, w: 42, d: 58, gh: 17, nf: 2, wall: M.PLASTER_OCHRE, roof: { t: 'gx', m: M.TERRACOTTA }, dorm: [8, 28], chim: [[36, 26]],
      gf: gfShop({ s: 2, w: 26, kind: 'cycles', door: 32, sign: 'CYCLES', awn: M.AWNING_GREEN, awnOut: 4, bad: 'vide' }) });
    if (day && !bad) for (const x of [852, 860, 868]) bike(P, x, 214, 'x', pick([M.CAR_BORD, M.CAR_BLUE, M.METAL_DARK]));
    // E5 colombages : tabac
    {
      house(P, ctx, { x0: 890, y0: 156, w: 34, d: 54, gh: 17, nf: 2, wall: M.PLASTER_CREAM, k: [1.0, 0.95, 0.88], base: VM.CHURCH, timber: true, jetty: true, beam: [0.30, 0.18, 0.12],
        roof: { t: 'gy', m: VM.TILE, p: 1.7, oh: 1 }, chim: [[26, 10]],
        gf: gfShop({ s: 3, w: 20, std: 'tabac', door: 26, sign: 'TABAC DU QUAI', signO: { plate: [0.12, 0.23, 0.17], plateMat: M.METAL_GREEN, fg: [0.86, 0.80, 0.62] }, open: true, lc: [0.7, 0.48, 0.24], bad: 'rideau' }) });
      const f = new Facade(P, LEFT, 890, 156, 34, 54);
      f.blade(31, G + 15, 7, 3, M.RED_SIGN);
      if (night && !bad) P.light({ x: 921.5, y: 214, z: G + 18, r: 24, cr: 0.6, cg: 0.08, cb: 0.06, skip: 3 });
    }
    // E6 articles de sport : les maillots du Racing en vitrine
    house(P, ctx, { x0: 924, y0: 152, w: 36, d: 60, gh: 17, nf: 3, wall: M.PLASTER_CREAM, k: [1.12, 1.12, 1.08], roof: { t: 'mans', h: 9 }, dorm: [15], chim: [[30, 22]], bal: 2,
      gf: gfShop({ s: 2, w: 22, std: 'boutique', door: 27, sign: 'SPORTS', signO: { plate: [0.42, 0.11, 0.16], plateMat: M.METAL_BORD, fg: [0.86, 0.80, 0.62] }, nightLit: true, lc: [0.55, 0.35, 0.25], bad: 'rideau' }) });
    // E7 la dernière maison, son pignon peint à l'est
    {
      house(P, ctx, { x0: 960, y0: 150, w: 40, d: 62, gh: 18, nf: 3, wall: M.PLASTER_GREY, k: [1.05, 1.02, 0.95], east: true, eastCols: [4, 54], quoins: true,
        roof: { t: 'gx', m: M.SLATE, p: 1.3 }, dorm: [16], chim: [[36, 30, 10]],
        gf: gfShop({ s: 2, w: 24, std: 'buvette', door: 30, sign: 'CAFÉ DES SPORTS', open: true, lc: [0.85, 0.5, 0.22], awn: M.AWNING, awnOut: 5, awnNight: true, bad: 'rideau' }),
        eastGf: f => { f.window(10, G + 4, 5, 9, { state: night && !bad ? 'lit' : 'dark', spill: false }); f.window(40, G + 4, 5, 9, { state: 'dark', shutter: M.SHUTTER_GREY, closed: true }); f.door(26, G, 6, 12, { mat: M.WOOD_DARK, frameMat: M.STONE }); } });
      const fe = new Facade(P, RIGHT, 960, 150, 40, 62);
      fe.sign(16, G + 60, 'MOULINS', { scale: 2, fg: [0.82, 0.78, 0.64], depth: 0, worn: 0.25 });
      fe.sign(12, G + 51, "D'AUBÉRIVE", { scale: 2, fg: [0.82, 0.78, 0.64], depth: 0, worn: 0.25 });
      fe.sign(17, G + 42, 'FARINES · SONS', { scale: 1, fg: [0.70, 0.28, 0.20], depth: 0, worn: 0.3 });
      fe.sign(20, G + 36, 'DEPUIS 1887', { scale: 1, fg: [0.70, 0.28, 0.20], depth: 0, worn: 0.35 });
    }

    // ------------------------------------------------------------ la rangée nord, sur la rue du Cloître (à l'ouest)
    const north = [
      { x0: 0, w: 36, wall: M.PLASTER_GREY, nf: 2, roof: { t: 'gx', m: M.SLATE }, gfk: null },
      { x0: 36, w: 40, wall: M.PLASTER_CREAM, k: [1.1, 1.06, 0.95], nf: 2, timber: true, jetty: true, roof: { t: 'gy', m: VM.TILE, p: 1.7 }, gfk: ['horlogerie', 'ANTIQUITÉS'] },
      { x0: 76, w: 36, wall: M.PLASTER_OCHRE, nf: 3, roof: { t: 'mans', h: 9 }, dorm: [14], gfk: null },
      { x0: 126, w: 40, wall: M.PLASTER_ROSE, k: [1.0, 0.95, 0.9], nf: 2, roof: { t: 'gx', m: M.TERRACOTTA }, gfk: ['mercerie', 'LAINES'], east: false },
      { x0: 166, w: 40, wall: M.PLASTER_CREAM, nf: 2, timber: true, jetty: true, roof: { t: 'gy', m: M.TERRACOTTA, p: 1.6 }, gfk: null },
      { x0: 206, w: 44, wall: M.PLASTER_BLUE, nf: 3, roof: { t: 'mans', h: 10 }, dorm: [10, 30], gfk: ['epicerie', 'ÉPICERIE'] },
      { x0: 250, w: 50, wall: M.PLASTER_OCHRE, k: [1.05, 0.98, 0.86], nf: 2, roof: { t: 'hip', m: VM.TILE, p: 1.2 }, gfk: null, notaire: true },
    ];
    for (const n of north) {
      house(P, ctx, Object.assign({ y0: 6, d: 54, gh: 17, chim: [[4, 20], [n.w - 6, 30]], ant: R() < 0.5 ? [Math.floor(n.w / 2), 28] : null,
        gf: n.gfk ? gfShop({ s: 2, w: n.w - 12, kind: n.gfk[0], door: n.w - 8, sign: n.gfk[1], awn: R() < 0.5 ? M.AWNING_GREEN : null, awnOut: 4, bad: 'vide' })
          : f => { f.door(Math.floor(n.w / 2) - 3, G, 6, 13, { mat: pick([M.WOOD_DARK, M.SHUTTER_GREEN, M.SHUTTER_BLUE, M.SHUTTER_BORD]), frameMat: M.STONE, step: true });
            for (const s of [4, n.w - 10]) f.window(s, G + 4, 5, 8, Object.assign({ shutter: pick(SHUT), closed: R() < 0.4 }, winState(ctx)));
            if (n.notaire) f.sign(Math.floor(n.w / 2) - 4, G + 17, 'NOTAIRE', { plate: [0.70, 0.56, 0.24], plateMat: VM.GOLD, fg: [0.15, 0.12, 0.08] }); } }, n));
    }
    // le presbytère
    house(P, ctx, { x0: 300, y0: 8, w: 76, d: 50, gh: 17, nf: 2, wall: M.PLASTER_GREY, k: [1.02, 1.0, 0.96], quoins: true, roof: { t: 'hip', m: M.SLATE, p: 1.1 }, dorm: [14, 54], chim: [[10, 24], [64, 24]],
      gf: f => { f.door(35, G, 6, 13, { mat: M.WOOD_DARK, frameMat: M.STONE, step: true }); for (const s of [8, 20, 48, 60]) f.window(s, G + 4, 5, 9, Object.assign({ shutter: M.SHUTTER_GREY, closed: R() < 0.5 }, winState(ctx))); } });

    // ------------------------------------------------------------ la rangée nord, sur la rue des Halles (à l'est)
    const northE = [
      { x0: 696, w: 40, wall: M.BRICK_PALE, nf: 2, roof: { t: 'gx', m: M.SLATE }, gfk: ['librairie', 'IMPRIMERIE'] },
      { x0: 736, w: 40, wall: M.PLASTER_CREAM, k: [1.08, 1.04, 0.9], nf: 3, roof: { t: 'mans', h: 9 }, dorm: [8, 26], gfk: null },
      { x0: 776, w: 30, wall: M.PLASTER_OCHRE, nf: 2, timber: true, jetty: true, roof: { t: 'gy', m: VM.TILE, p: 1.7 }, gfk: ['boulangerie', 'PAINS'] },
      { x0: 806, w: 50, lavoir: true },
      { x0: 856, w: 44, wall: M.PLASTER_ROSE, nf: 3, roof: { t: 'gx', m: M.TERRACOTTA }, dorm: [12, 30], gfk: null },
      { x0: 900, w: 40, wall: M.PLASTER_CREAM, nf: 2, timber: true, jetty: true, roof: { t: 'gy', m: M.TERRACOTTA, p: 1.6 }, gfk: ['fleuriste', 'GRAINES'] },
      { x0: 940, w: 60, wall: M.PLASTER_GREY, k: [0.98, 1.0, 1.02], nf: 3, roof: { t: 'hip', m: M.SLATE, p: 1.1 }, east: true, gfk: null },
    ];
    for (const n of northE) {
      if (n.lavoir) {
        // le lavoir : un toit sur poteaux au-dessus du bassin
        const x0 = n.x0, y0 = 22, w = n.w, d = 40;
        P.box(x0, y0, G, x0 + w, y0 + d, G + 3, VM.CHURCH);
        P.box(x0 + 4, y0 + 4, G - 1, x0 + w - 4, y0 + d - 6, G + 2, 0);
        P.box(x0 + 4, y0 + 4, G - 1, x0 + w - 4, y0 + d - 6, G + 1, VM.WATER);
        P.box(x0 + 3, y0 + d - 6, G + 3, x0 + w - 3, y0 + d - 5, G + 4, M.STONE);
        for (const [a, b] of [[0, 0], [w - 2, 0], [0, d - 2], [w - 2, d - 2], [Math.floor(w / 2) - 1, d - 2], [Math.floor(w / 2) - 1, 0]]) P.box(x0 + a, y0 + b, G + 3, x0 + a + 2, y0 + b + 2, G + 20, M.WOOD_DARK);
        pitched(P, x0, y0, w, d, G + 20, VM.TILE, { axis: 'x', pitch: 0.9, oh: 2, hip: true });
        P.box(x0, 6, G, x0 + w, y0, G + 9, VM.CHURCH);
        const fl = new Facade(P, LEFT, x0, y0, w, d);
        fl.sign(14, G + 25, 'LAVOIR', { fg: [0.80, 0.76, 0.62], depth: -1, plate: [0.30, 0.22, 0.14], plateMat: M.WOOD_DARK });
        if (day && !bad) { P.box(x0 + 8, y0 + d - 4, G + 4, x0 + 14, y0 + d - 3, G + 5, M.WHITE); P.box(x0 + 30, y0 + d - 4, G + 4, x0 + 36, y0 + d - 3, G + 5, M.CANVAS); }
        if (night) P.light({ x: x0 + w / 2, y: y0 + d - 2, z: G + 17, r: 30, cr: 0.8, cg: 0.55, cb: 0.25, skip: 1.5 });
        continue;
      }
      house(P, ctx, Object.assign({ y0: 6, d: 56, gh: 17, chim: [[4, 20], [n.w - 6, 32]], ant: R() < 0.5 ? [Math.floor(n.w / 2), 30] : null,
        gf: n.gfk ? gfShop({ s: 2, w: n.w - 12, kind: n.gfk[0], door: n.w - 8, sign: n.gfk[1], awn: R() < 0.5 ? M.AWNING : null, awnOut: 4, bad: 'vide' })
          : f => { f.door(Math.floor(n.w / 2) - 3, G, 6, 13, { mat: pick([M.WOOD_DARK, M.SHUTTER_GREEN, M.SHUTTER_BORD]), frameMat: M.STONE, step: true });
            for (const s of [4, n.w - 10]) f.window(s, G + 4, 5, 8, Object.assign({ shutter: pick(SHUT), closed: R() < 0.4 }, winState(ctx))); } }, n));
    }

    // ------------------------------------------------------------ les jardins de derrière, leurs murs, leurs cabanes
    const gardenWall = (x0, y0, x1, y1, h = 9) => { P.box(x0, y0, G, x1, y1, G + h, VM.CHURCH); P.box(x0, y0, G + h, x1, y1, G + h + 1, VM.TILE); };
    const shed = (x, y, w, d, h, roofM) => { P.box(x, y, G, x + w, y + d, G + h, M.WOOD); pitched(P, x, y, w, d, G + h, roofM || VM.TILE, { axis: 'x', pitch: 0.7, oh: 1 }); const f = new Facade(P, LEFT, x, y, w, d); f.door(2, G, 3, h - 2, { mat: M.WOOD_DARK, frame: false }); };
    const veg = obj({ type: 'vieille_produce', pal: [[0.25, 0.45, 0.20], [0.35, 0.55, 0.22], [0.30, 0.40, 0.18], [0.55, 0.35, 0.20]], seed: 21 });
    const clothes = [[0.86, 0.86, 0.82], [0.30, 0.40, 0.65], [0.70, 0.25, 0.25], [0.85, 0.75, 0.40], [0.44, 0.12, 0.18]].map(c => paint(c));
    const hens = [];
    const well = (x, y) => {
      for (let j = -3; j <= 3; j++) for (let i = -3; i <= 3; i++) { const d = Math.hypot(i, j); if (d <= 3.2 && d > 1.8) P.box(x + i, y + j, G, x + i + 1, y + j + 1, G + 4, VM.CHURCH); else if (d <= 1.8) P.box(x + i, y + j, G - 2, x + i + 1, y + j + 1, G - 1, VM.WATER); }
      P.box(x - 3, y, G + 4, x - 2, y + 1, G + 12, M.WOOD_DARK); P.box(x + 3, y, G + 4, x + 4, y + 1, G + 12, M.WOOD_DARK); P.box(x - 3, y, G + 11, x + 4, y + 1, G + 12, M.WOOD_DARK);
      pitched(P, x - 4, y - 2, 9, 5, G + 12, VM.TILE, { axis: 'x', pitch: 0.8, oh: 0 });
    };
    const greenhouse = (x, y) => { P.box(x, y, G, x + 12, y + 7, G + 6, M.BOOTH); for (let i = 0; i <= 12; i += 4) P.box(x + Math.min(i, 11), y, G, x + Math.min(i, 11) + 1, y + 7, G + 6, M.METAL); P.box(x, y + 1, G + 6, x + 12, y + 6, G + 7, M.BOOTH); P.box(x, y + 3, G + 7, x + 12, y + 4, G + 8, M.METAL); };
    const coop = (x, y) => { P.box(x, y, G, x + 7, y + 5, G + 5, M.WOOD); pitched(P, x, y, 7, 5, G + 5, M.ZINC, { axis: 'x', pitch: 0.6, oh: 1 }); B.railing(P, x - 2, y + 7, x + 12, y + 7, G, 3, M.METAL, 2); B.railing(P, x + 12, y - 1, x + 12, y + 7, G, 3, M.METAL, 2); if (day && !bad) for (let i = 0; i < 4; i++) hens.push([x + 1 + i * 2.5, y + 6.2 + (i % 2)]); };
    const garden = (x0, y0, x1, y1, seed) => {
      P.box(x0, y0, 1, x1, y1, 2, M.GRASS);
      const RR = R, gw = x1 - x0, gd = y1 - y0;
      // l'allée, les planches de légumes
      const ym = y0 + Math.floor(gd / 2);
      P.box(x0 + 2, ym, 1, x1 - 2, ym + 3, 2, M.GRAVEL);
      const kind = seed % 4;
      if (kind !== 2) for (let y = y0 + 4; y < y1 - 4; y += 4) if (Math.abs(y - ym) > 3 && RR() < 0.65) P.box(x0 + 3, y, G, Math.min(x1 - 3, x0 + 3 + Math.floor(RR() * (gw - 6))), y + 2, G + 1, M.HEDGE, veg);
      if (gw > 24 && RR() < 0.8) shed(x0 + 2 + Math.floor(RR() * (gw - 16)), y0 + 2, 10, 8, 9, RR() < 0.5 ? VM.TILE : M.ZINC);
      // un arbre, parfois deux (verger)
      const nt = kind === 2 ? 2 : RR() < 0.75 ? 1 : 0;
      for (let i = 0; i < nt; i++) B.planeTree(P, x0 + 6 + Math.floor(RR() * Math.max(1, gw - 12)), y0 + 10 + Math.floor(RR() * Math.max(1, gd - 20)), G, { seed: seed * 3 + i, trunk: 8 + Math.floor(RR() * 6), r: 5 + RR() * 2.5, branches: 3, leafR: 9, leafAmt: 0.6 });
      if (kind === 1 && gw >= 30) well(x1 - 8, ym - 6);
      if (kind === 3 && gw >= 30) greenhouse(x0 + 4, y1 - 12);
      if (kind === 0 && gw >= 30) coop(x1 - 16, y1 - 14);
      // le linge du jour
      if (day && !bad && RR() < 0.55) {
        const lx = x0 + 4, ly = y1 - 5, ln = Math.min(14, gw - 8);
        P.box(lx, ly, G, lx + 1, ly + 1, G + 9, M.WOOD); P.box(lx + ln, ly, G, lx + ln + 1, ly + 1, G + 9, M.WOOD);
        for (let i = 1; i < ln; i++) { P.set(lx + i, ly, G + 9, M.METAL); if (RR() < 0.7) P.box(lx + i, ly, G + 5 + Math.floor(RR() * 2), lx + i + 1, ly + 1, G + 9, M.CANVAS, clothes[Math.floor(RR() * clothes.length)]); }
      }
      // une table et deux chaises, des fûts, du bois
      if (RR() < 0.4) { B.terraceTable(P, x0 + 6, ym + 5, G); B.chair(P, x0 + 4, ym + 5, G, 'x'); B.chair(P, x0 + 9, ym + 6, G, 'y'); }
      if (RR() < 0.5) B.keg(P, x1 - 5, y0 + 3, G);
      if (RR() < 0.5) for (let i = 0; i < 3; i++) P.box(x0 + 1, y0 + 2 + i * 2, G, x0 + 3, y0 + 4 + i * 2, G + 4 - i, M.WOOD_DARK);
    };
    // à l'ouest : derrière les maisons du quai, entre la rue du Cloître et le quai
    gardenWall(0, 74, 112, 76); gardenWall(126, 74, 250, 76); gardenWall(126, 138, 250, 140, 7);
    for (const [x0, x1, s] of [[0, 30, 31], [30, 62, 32], [62, 112, 33]]) { garden(x0, 76, x1, 150, s); gardenWall(x1 - 1, 76, x1, 150, 7); }
    for (const [x0, x1, s] of [[126, 166, 34], [166, 206, 35], [206, 250, 36]]) { garden(x0, 76, x1, 138, s); gardenWall(x1 - 1, 76, x1, 138, 7); }
    gardenWall(112, 76, 113, 150, 9); gardenWall(125, 76, 126, 138, 9);
    // portails sur la rue du Cloître
    for (const x of [14, 44, 84, 140, 182, 226]) { P.box(x, 74, G, x + 6, 76, G + 9, 0); P.box(x, 75, G, x + 6, 76, G + 8, M.WOOD_DARK); }
    // à l'est : entre la rue des Halles et le quai
    gardenWall(700, 84, 836, 86); gardenWall(848, 84, WD, 86); gardenWall(700, 86, 702, 120, 9);
    for (const [x0, x1, s] of [[702, 736, 41], [736, 770, 42], [770, 812, 43], [812, 836, 44], [848, 890, 45], [890, 924, 46], [924, 960, 47], [960, WD, 48]]) { const y1 = x0 < 736 ? 138 : 148; garden(x0, 86, x1, y1, s); if (x1 < WD) gardenWall(x1 - 1, 86, x1, y1, 7); }
    gardenWall(702, 138, 736, 140, 7);
    for (const x of [716, 790, 868, 940]) { P.box(x, 84, G, x + 6, 86, G + 9, 0); P.box(x, 85, G, x + 6, 86, G + 8, M.WOOD_DARK); }
    gardenWall(835, 86, 836, 212, 4); gardenWall(848, 86, 849, 154, 4);

    // ------------------------------------------------------------ la place : fontaine, platanes, réverbères, bancs, marché
    {
      // la fontaine
      for (let y = FY - 15; y <= FY + 15; y++) for (let x = FX - 15; x <= FX + 15; x++) {
        const dd = octD(x - FX + 0.5, y - FY + 0.5);
        if (dd <= 13.5) {
          if (dd > 11.5) P.box(x, y, G - 1, x + 1, y + 1, G + 4, VM.ASHLAR);
          else { P.box(x, y, G - 1, x + 1, y + 1, G, M.STONE); P.box(x, y, G, x + 1, y + 1, G + 2, bad ? 0 : VM.WATER); if (bad) P.box(x, y, G - 1, x + 1, y + 1, G, M.GRAVEL); }
        } else if (dd <= 15) P.box(x, y, 1, x + 1, y + 1, 2, VM.FLAGSTONE);
      }
      P.box(FX - 3, FY - 3, G - 1, FX + 3, FY + 3, G + 10, VM.ASHLAR);
      for (let y = FY - 7; y < FY + 7; y++) for (let x = FX - 7; x < FX + 7; x++) { const dd = octD(x - FX + 0.5, y - FY + 0.5); if (dd <= 6.5) { P.box(x, y, G + 10, x + 1, y + 1, G + 12, dd > 5.2 ? VM.ASHLAR : (bad ? M.STONE : VM.WATER)); } }
      P.box(FX - 1, FY - 1, G + 12, FX + 1, FY + 1, G + 17, VM.BRONZE); P.box(FX - 2, FY - 2, G + 15, FX + 2, FY + 2, G + 16, VM.BRONZE); P.set(FX, FY, G + 17, VM.GOLD); P.set(FX - 1, FY, G + 17, VM.GOLD);
      if (!bad) {
        // filets d'eau des quatre mascarons
        for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
          P.set(FX + dx * 3, FY + dy * 3, G + 7, VM.BRONZE);
          for (let t = 1; t <= 6; t++) { const z = G + 7 - Math.floor(t * t / 7); if (z >= G + 2) P.set(FX + dx * (3 + t), FY + dy * (3 + t), z, VM.WATER); }
          for (let t = 0; t < 3; t++) P.set(FX + dx * (6 + t) + (dy ? 0 : 0), FY + dy * (6 + t), G + 10 - t * 3, VM.WATER);
        }
        if (night) {
          P.light({ x: FX + 0.5, y: FY + 7, z: G + 3, r: 26, fall: 1.5, cr: 0.30, cg: 0.46, cb: 0.50, shadow: false });
          for (const [dx, dy] of [[-9, -9], [9, -9], [-9, 9], [9, 9]]) {
            P.set(FX + dx, FY + dy, G + 4, M.BULB);
            const l = Math.hypot(dx, dy, 14);
            P.light({ x: FX + dx + 0.5, y: FY + dy + 0.5, z: G + 5, r: 30, fall: 1.6, cr: 0.85, cg: 0.80, cb: 0.62, axis: [-dx / l, -dy / l, 14 / l], c0: 0.45, c1: 0.85, spill: 0.15, skip: 1 });
          }
        }
      }
      place('fontaine', 'La fontaine', FX, FY, G + 20);
      // platanes
      const trees = [[452, 112, 61], [568, 112, 62], [452, 172, 63], [568, 172, 64], [392, 168, 65], [636, 96, 66]];
      for (const [x, y, s] of trees) { B.planeTree(P, x, y, G, { seed: s, trunk: 16 + (s % 3), r: 9 + (s % 2), leafAmt: bad ? 1.4 : 0.9 }); P.box(x - 2, y - 2, 1, x + 4, y + 4, 2, M.GRAVEL); }
      // réverbères de la place (lanternes de style, sodium)
      const lampOff = (i) => bad && (i === 1 || i === 4);
      [[416, 100], [604, 100], [416, 150], [604, 150], [470, 198], [550, 198], [640, 186], [478, 80], [542, 80]].forEach(([x, y], i) => lanternPost(P, ctx, x, y, night && !lampOff(i)));
      // bancs face à la fontaine, sous les platanes
      for (const [x, y, ax] of [[490, 120, 'x'], [524, 158, 'x'], [446, 140, 'y'], [574, 140, 'y'], [400, 182, 'y'], [628, 120, 'y']]) bench2(P, x, y, ax);
      // bornes et chaîne vers le quai
      for (let x = 386; x < 652; x += 8) if (x < 488 || x > 532) B.bollard(P, x, 210, G, M.METAL_BORD);
      for (let x = 498; x < 524; x += 6) B.bollard(P, x, 194, G, M.METAL_BORD);
      // poubelles, cabine, kiosque à journaux, colonne d'affiches
      B.bin(P, 438, 196, G); B.bin(P, 580, 196, G); B.bin(P, 640, 72, G);
      B.phoneBooth(P, 586, 176, G);
      B.kiosk(P, 610, 184, G, { headline: bad ? 'CRISE' : 'DERBY' });
      {
        const cx = 646, cy = 150;
        for (let y = cy - 3; y <= cy + 3; y++) for (let x = cx - 3; x <= cx + 3; x++) if ((x - cx) ** 2 + (y - cy) ** 2 <= 9.5) P.box(x, y, G, x + 1, y + 1, G + 14, M.METAL_GREEN);
        for (let y = cy - 2; y <= cy + 2; y++) for (let x = cx - 2; x <= cx + 2; x++) if ((x - cx) ** 2 + (y - cy) ** 2 <= 5) P.box(x, y, G + 14, x + 1, y + 1, G + 17, M.METAL_GREEN);
        P.set(cx, cy, G + 17, M.METAL_GREEN);
        const af = new Facade(P, LEFT, cx - 3, cy - 3, 7, 7), ar = new Facade(P, RIGHT, cx - 3, cy - 3, 7, 7);
        const a1 = obj({ type: 'vieille_affiche', face: LEFT, a0: cx - 2, z0: G + 3, w: 5, h: 9, title: 'DERBY', art: 'ball', bg: [0.2, 0.3, 0.55], fg: [0.85, 0.85, 0.8], barre: false, seed: 31 });
        tagRect(af, 1, G + 3, 6, G + 12, a1);
        const a2 = obj({ type: 'vieille_affiche', face: RIGHT, a0: cy + 3, z0: G + 3, w: 5, h: 9, title: 'BAL', art: 'sun', bg: [0.55, 0.15, 0.18], fg: [0.3, 0.1, 0.12], barre: bad, seed: 32 });
        tagRect(ar, 1, G + 3, 6, G + 12, a2);
      }
      // voitures garées le long de L'Écho, et la camionnette de L'Écho
      const echoVan = paint([0.86, 0.84, 0.76]);
      van(P, 664, 64, 'y', echoVan);
      { const fv = new Facade(P, RIGHT, 664, 64, 8, 20); fv.sign(5, G + 9, "L'ÉCHO", { fg: [0.42, 0.10, 0.16], depth: 0 }); }
      car2(P, 676, 66, 'y', M.CAR_BEIGE); car2(P, 686, 92, 'y', M.CAR_BLUE);
      if (night) {
        P.set(665, 84, G + 3, M.HEADLIGHT); P.set(670, 84, G + 3, M.HEADLIGHT);
        P.light({ x: 668, y: 86, z: G + 3, r: 44, fall: 1.4, cr: 1.0, cg: 0.95, cb: 0.75, axis: [0, 1, -0.12], c0: 0.82, c1: 0.97, spill: 0, skip: 1 });
        // les ballots du matin, sur le trottoir devant la porte
        for (const [bx, by] of [[652, 62], [656, 63], [652, 66]]) P.box(bx, by, G, bx + 3, by + 2, G + 2, M.PLASTIC_WHITE);
      }
      // le marché du dimanche
      if (day) {
        const pals = [
          [[0.85, 0.15, 0.12], [0.30, 0.55, 0.22], [0.95, 0.60, 0.12], [0.90, 0.88, 0.75], [0.45, 0.20, 0.40]],
          [[0.95, 0.85, 0.30], [0.95, 0.60, 0.15], [0.85, 0.20, 0.15], [0.40, 0.65, 0.25]],
          [[0.90, 0.85, 0.62], [0.95, 0.75, 0.30], [0.80, 0.55, 0.25], [0.95, 0.92, 0.85]],
          [[0.70, 0.75, 0.78], [0.85, 0.88, 0.90], [0.55, 0.60, 0.65], [0.90, 0.40, 0.30]],
          [[0.90, 0.20, 0.30], [0.95, 0.85, 0.30], [0.95, 0.95, 0.90], [0.80, 0.45, 0.75], [0.30, 0.55, 0.25]],
          [[0.30, 0.40, 0.70], [0.85, 0.30, 0.25], [0.90, 0.88, 0.80], [0.30, 0.30, 0.32]],
        ];
        const stripes = [
          [[0.46, 0.12, 0.18], [0.80, 0.76, 0.66]], [[0.17, 0.34, 0.24], [0.80, 0.76, 0.66]], [[0.22, 0.32, 0.55], [0.82, 0.80, 0.72]],
          [[0.80, 0.55, 0.15], [0.84, 0.80, 0.70]], [[0.55, 0.15, 0.12], [0.86, 0.84, 0.78]],
        ].map(c2 => stripe(c2, 3, 'x'));
        const goods = pals.map((p, i) => obj({ type: 'vieille_produce', pal: p, seed: 100 + i }));
        // quatre rangées d'étals, de part et d'autre de l'allée qui va de la rue du Stade à la mairie
        const slots = [];
        for (const y of [88, 122, 156, 186]) {
          for (const x of [398, 418, 438, 458]) if (!(y === 186 && x === 398)) slots.push([x, y]);
          for (const x of [530, 550, 570, 590, 610]) if (!(y === 186 && x === 610) && !(y === 156 && x === 610)) slots.push([x, y]);
        }
        let n = 0;
        for (const [x, y] of slots) {
          if (bad && hash(x, y, 7, 1) < 0.45) continue;
          stall(P, x, y, { L: 16, stripe: stripes[n % stripes.length], goods: bad ? 0 : goods[(n * 7 + 3) % goods.length], crates: bad || n % 3 === 0 });
          n++;
        }
        // la camionnette d'un maraîcher, des cageots vides empilés
        van(P, 452, 192, 'x', paint([0.30, 0.42, 0.30]));
        B.crates(P, 474, 194, G, 3); B.crates(P, 474, 198, G, 2, M.CRATE_GREEN); B.crates(P, 626, 126, G, 3, M.CRATE_GREEN);
        if (bad) for (let i = 0; i < 30; i++) { const x = 400 + Math.floor(R() * 220), y = 84 + Math.floor(R() * 120); if (!P.get(x, y, G)) P.set(x, y, G, pick([M.PLASTIC_WHITE, M.POSTER, M.CANVAS, M.CRATE_RED])); }
      }
      place('marche', 'Le marché du dimanche', 440, 110, G + 18);
    }

    // ------------------------------------------------------------ le quai : réverbères, bancs, poubelles, vélos
    // le quai est éclairé par les réverbères du maître, côté chaussée ; côté façades, des lanternes en console
    [[30, 210], [112, 212], [192, 212], [270, 212], [342, 212], [770, 210], [848, 212], [924, 212]].forEach(([x, yf], i) => {
      const f = new Facade(P, LEFT, x - 1, yf - 4, 2, 4);
      consoleLantern(f, 1, G + 21, night && !(bad && (i === 2 || i === 5)));
    });
    for (const x of [60, 290, 800, 940]) B.bin(P, x, 220, G);
    // l'arrêt du car, côté quai
    B.busShelter(P, 566, 216, G, 16, { poster: { title: 'DERBY', bg: [0.80, 0.76, 0.66], fg: [0.42, 0.10, 0.16], band: [0.42, 0.10, 0.16], lit: night ? 0.7 : 0, seed: 12 } });
    P.box(584, 222, G, 585, 223, G + 14, M.METAL_DARK); P.box(583, 222, G + 11, 586, 223, G + 14, M.METAL_GREEN);
    B.bench(P, 176, 221, G, 'x'); B.bench(P, 880, 221, G, 'x');
    bike(P, 214, 215, 'x', M.CAR_BLUE); bike(P, 312, 215, 'x', M.CAR_BORD);
    // la rue du Cloître et la rue des Halles : lanternes murales, réverbères, voitures
    for (const [x, on] of [[56, true], [190, !bad], [330, true]]) { const f = new Facade(P, LEFT, x - 1, 6, 2, 54); wallLantern(f, 0, G + 15, night && on); }
    [[760, 82], [870, 82], [970, 82]].forEach(([x, y], i) => lampStreet(P, ctx, x, y, 0, -1, { off: bad && i === 1 }));
    car2(P, 720, 71, 'x', M.CAR_WHITE); car2(P, 812, 71, 'x', M.CAR_BORD); car2(P, 905, 71, 'x', M.CAR_BEIGE);
    car2(P, 150, 216, 'x', M.CAR_BLUE);

    // les terrasses du quai, les mobylettes, les chats
    if (!(bad && night)) {
      const tb = day ? [[774, 215], [784, 215], [794, 215]] : [[776, 215], [788, 215]];
      for (const [x, y] of tb) { B.terraceTable(P, x, y, G); B.chair(P, x - 2, y, G, 'x'); B.chair(P, x + 3, y + 1, G, 'y'); }
      if (day) for (const [x, y] of [[964, 216], [974, 216]]) { B.terraceTable(P, x, y, G); B.chair(P, x + 3, y + 1, G, 'y'); }
    }
    B.moped(P, 900, 216, G, 'x'); B.moped(P, 880, 81, G, 'x'); B.moped(P, 330, 216, G, 'x');
    partyWalls(P, ctx);
    for (const [hx, hy] of hens) P.sprite(Object.assign({ x: hx, y: hy, z: G }, PEOPLE.HEN));
    // du linge tendu au-dessus du passage du Four
    if (day && !bad) {
      const cloth = [[0.86, 0.86, 0.82], [0.30, 0.40, 0.66], [0.72, 0.25, 0.25], [0.86, 0.76, 0.40], [0.44, 0.12, 0.18], [0.55, 0.60, 0.55]];
      for (const [y, z] of [[181, G + 44], [201, G + 29]]) {
        for (let x = 836; x < 848; x++) P.set(x, y, z, M.METAL);
        for (let x = 837; x < 847; x += 2) { const c = cloth[Math.floor(R() * cloth.length)], hgt = 2 + Math.floor(R() * 3); P.box(x, y, z - hgt, x + 2, y + 1, z, M.CANVAS, paint(c)); }
      }
    }
    // en mauvaise saison : des tags
    if (bad) {
      const fe7 = new Facade(P, RIGHT, 960, 150, 40, 62);
      fe7.sign(36, G + 13, 'AUBES', { scale: 2, fg: [0.62, 0.10, 0.16], depth: 0, drip: true });
      const fq8 = new Facade(P, LEFT, 270, 178, 30, 34);
      fq8.sign(4, G + 22, 'R.A. 91', { fg: [0.15, 0.15, 0.18], depth: 0, drip: true });
      const fn7 = new Facade(P, RIGHT, 940, 6, 60, 56);
      fn7.sign(8, G + 12, 'VAUBOURG DEHORS', { fg: [0.86, 0.84, 0.80], depth: 0, drip: true });
      const fp = new Facade(P, LEFT, 192, QY, 44, QD);
      fp.sign(30, G + 22, 'AUBES', { fg: [0.20, 0.30, 0.60], depth: 0, drip: true });
    }
    place('pharmacie', 'La pharmacie', 227, 214, G + 16);
    place('brasserie', 'La brasserie du Pont', 805, 214, G + 16);
    place('tabac', 'Le tabac du Quai', 918, 212, G + 16);
    place('kiosque', 'Le kiosque à journaux', 615, 197, G + 18);
    place('lavoir', 'Le lavoir', 831, 64, G + 22);

    // ------------------------------------------------------------ les gens
    const PE = PEOPLE;
    if (day && !bad) {
      // le marché : marchands derrière leurs étals, chalands devant
      const crowd = [PE.GRANNY, PE.CAMILLE, SPR.WALKER, SPR.WALKER2, PE.GRANNY, SPR.KID, SPR.FAN, SPR.COAT, PE.LEA, SPR.WALKER, PE.GRANNY, SPR.WALKER2];
      let ci = 0;
      for (const y of [88, 122, 156, 186]) for (const x of [398, 418, 438, 458, 530, 550, 570, 590, 610]) {
        if (!P.get(x + 2, y + 2, G + 4)) continue;
        if (hash(x, y, 3, 3) < 0.7) sp(hash(x, y, 4, 4) < 0.3 ? PE.BAKER : PE.VENDOR, x + 6 + Math.floor(hash(x, y, 5, 5) * 5), y - 1);
        const k = hash(x, y, 6, 6);
        if (k < 0.8) sp(crowd[ci++ % crowd.length], x + 3 + Math.floor(k * 10), y + 12 + (k < 0.4 ? 1 : 0));
        if (k < 0.3) sp(crowd[ci++ % crowd.length], x + 11, y + 13.5);
      }
      sp(PE.CURE, 474, 108); sp(SPR.VAUBOURG, 506, 65, G + 4); sp(SPR.COACH, 512, 176); sp(PE.DOG, 520, 168);
      sp(SPR.KID, 380, 205); sp(SPR.BALL, 384, 207); sp(PE.READER, 527, 160.5, G); sp(PE.LEA, 644, 66); sp(SPR.COAT, 652, 70);
      // la terrasse du café
      sp(SPR.FAN_SIT, 389, 73); sp(SPR.COACH_SIT, 409, 73); sp(PE.READER, 418, 82); sp(SPR.GEGE, 426, 69); sp(SPR.FAN_SIT, 397, 82);
      // pigeons autour de la fontaine
      for (const [x, y] of [[498, 158], [503, 160], [520, 157], [530, 116], [495, 122], [527, 160], [512, 162]]) sp(PE.PIGEON, x, y);
      // le quai
      sp(SPR.WALKER, 90, 219); sp(PE.GRANNY, 230, 218); sp(SPR.COAT, 140, 219); sp(PE.CAMILLE, 784, 219); sp(SPR.FAN, 905, 218); sp(SPR.KID, 870, 218);
      sp(PE.BAKER, 384, 196); sp(SPR.WALKER2, 600, 216); sp(PE.GRANNY, 655, 218); sp(SPR.WALKER, 560, 214);
      sp(SPR.FAN_SIT, 773, 217); sp(PE.READER, 786, 217); sp(SPR.FAN_SIT, 795, 217); sp(SPR.FAN_SIT, 966, 218); sp(SPR.CAT, 158, 220, 10); sp(SPR.CAT, 200, 75, G + 10);
      // les rues de derrière
      sp(PE.GRANNY, 160, 68); sp(SPR.WALKER, 300, 70); sp(PE.CURE, 360, 72); sp(SPR.KID, 760, 74); sp(SPR.WALKER2, 860, 82); sp(PE.DOG, 866, 83);
      sp(SPR.CAT, 930, 80, G + 9);
    } else if (day && bad) {
      sp(PE.GRANNY, 460, 120); sp(SPR.COAT, 600, 160); sp(PE.READER, 418, 82); sp(SPR.COACH, 512, 186); sp(PE.DOG, 548, 150);
      sp(PE.PIGEON, 500, 158); sp(PE.PIGEON, 520, 160); sp(SPR.WALKER, 200, 219); sp(PE.CURE, 380, 112);
    } else if (!bad) {
      // la séance de 22 heures : la file devant L'Aurore
      sp(SPR.COACH, 689, 220); sp(PE.CAMILLE, 692, 220.5); sp(SPR.WALKER, 700, 219); sp(SPR.WALKER2, 703, 218.5); sp(SPR.COAT, 680, 219); sp(PE.GRANNY, 708, 219.5); sp(SPR.FAN, 714, 220);
      // la terrasse du café, les habitués
      sp(SPR.FAN_SIT, 389, 73); sp(SPR.GEGE, 404, 66); sp(PE.READER, 412, 73); sp(SPR.COACH_SIT, 401, 73);
      // L'Écho boucle : Léa à la porte, un rotativiste dans la salle des machines, la camionnette charge
      sp(PE.LEA, 640, 66); sp(PE.VENDOR, 650, 56, G); sp(PE.VENDOR, 612, 57, G); sp(SPR.WALKER2, 668, 88);
      sp(SPR.CAT, 452, 118, G); sp(PE.DOG, 520, 200);
      // le quai : on sort de la brasserie, on rentre
      sp(SPR.WALKER2, 790, 219); sp(SPR.FAN, 940, 219); sp(SPR.WALKER, 805, 219); sp(PE.CAMILLE, 120, 219); sp(SPR.COAT, 260, 220);
      sp(SPR.FAN_SIT, 775, 217); sp(SPR.FAN_SIT, 787, 217); sp(SPR.CAT, 158, 220, 10);
      // un couple sur un banc, près de la fontaine
      sp(SPR.FAN_SIT, 526, 160.5, G); sp(PE.READER, 530, 160.5, G);
    } else {
      sp(SPR.COACH, 512, 190); sp(SPR.COAT, 700, 219); sp(SPR.CAT, 452, 118, G); sp(SPR.KID, 380, 205);
    }

    return { places };
  },
};
