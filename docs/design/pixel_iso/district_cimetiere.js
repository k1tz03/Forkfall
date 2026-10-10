'use strict';
// Le cimetière d'Aubérive, à l'ouest du stade de la Rive : « là où vont les carrières finies ».
// Bords : nord (y = 0) le quai sud de la rivière ; est (x = 292) la rue de l'Ouest, où donne la grille ;
// sud (y = 156) l'avenue du Stade, où le fleuriste funéraire tient le coin.
// Tout regarde vers le sud (+y) ou vers l'est (+x) : stèles, chapelles, loge, vitrines.
const E = require('./engine');
const { M } = require('./mats');
const B = require('./build');
const SP = require('./sprites');
const { LEFT, RIGHT, TOP, hash, vnoise, fbm, mod, clamp, material, overlay, textBitmap } = E;
const { Facade } = B;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const along = c => c.face === LEFT ? c.hx : c.hy;

// ---------------------------------------------------------------- trois matières (le reste vient de mats.js)
M.CIM_GRANITE = M.CIM_GRANITE || material('granit poli', c => {
  const h = hash(c.a, c.b, 611, c.face);
  const k = 0.085 + 0.03 * fbm(c.hx * 0.7 + c.hz * 0.4, c.hy * 0.7 - c.hz * 0.3, 612, 2);
  rgb(c, k, k * 1.01, k * 1.1);
  if (h < 0.16) mul(c, 2.1); else if (h > 0.965) mul(c, 3.4);
  if (c.face === TOP) c.wet = Math.max(c.wet, 0.4);
  else if (mod(c.b, 7) === 0 && hash(c.a, c.b, 613, 0) < 0.5) mul(c, 1.25); // reflet de polissage
});
M.CIM_FLEURS = M.CIM_FLEURS || material('fleurs de cimetière', c => {
  const P = [[0.88, 0.72, 0.16], [0.86, 0.85, 0.80], [0.60, 0.30, 0.60], [0.82, 0.44, 0.14], [0.72, 0.12, 0.14], [0.86, 0.52, 0.60]];
  const p = P[Math.floor(hash(c.ix >> 1, c.iy >> 1, c.iz, 621) * P.length)];
  const t = hash(c.a, c.b, 622, c.face);
  if (t < 0.24) rgb(c, 0.15, 0.30, 0.13); else { rgb(c, p[0], p[1], p[2]); if (t < 0.42) mul(c, 0.7); }
  if (c.face === TOP) mul(c, 1.1);
});
M.CIM_CYPRES = M.CIM_CYPRES || material('cyprès', c => {
  const n = vnoise(c.hz * 0.8 + along(c) * 1.6, (c.face === TOP ? c.hx + c.hy : 0) * 0.9, 631);
  const h = hash(c.a, c.b, 632, c.face);
  let k = 0.72 + 0.56 * n;
  if (h < 0.2) k *= 0.55; else if (h > 0.9) k *= 1.4;
  rgb(c, 0.075 * k, 0.15 * k, 0.10 * k);
  if (c.face === TOP) mul(c, 1.3);
});

// ---------------------------------------------------------------- calques
// patine commune : teinte, mousse et lichen, coulures, fleurs fanées
function surf(o, c) {
  if (o.tint) { c.cr *= o.tint[0]; c.cg *= o.tint[1]; c.cb *= o.tint[2]; }
  if (o.fade) {
    const h = hash(c.a, c.b, 641, c.face), l = 0.4 + 0.6 * Math.max(c.cr, c.cg, c.cb);
    if (h < 0.45) rgb(c, 0.30 * l, 0.22 * l, 0.12 * l); else if (h < 0.8) rgb(c, 0.38 * l, 0.31 * l, 0.20 * l); else rgb(c, 0.22 * l, 0.20 * l, 0.15 * l);
  }
  if (o.moss) {
    const n = fbm(c.hx * 0.55 + c.hz * 0.35, c.hy * 0.55 - c.hz * 0.3, 642 + (o.seed || 0), 3) + (c.face === TOP ? 0.1 : 0);
    if (n > 1 - o.moss * 0.42) { const g = hash(c.a, c.b, 643, c.face); if (g < 0.5) rgb(c, 0.25, 0.29, 0.17); else if (g < 0.8) rgb(c, 0.34, 0.37, 0.24); else rgb(c, 0.55, 0.55, 0.44); }
  }
  if (o.stain && c.face !== TOP) { const s = vnoise(along(c) * 1.3, 0.5, 644 + (o.seed || 0)); if (s > 0.6) mul(c, 0.84 - (s - 0.6) * 0.5); }
  if (o.spray && c.face !== o.sprayNot) { // la bombe de peinture sur la tombe saccagée : du noir, un trait rouge
    const s1 = Math.abs(vnoise(c.hx * 0.55 + c.hz * 0.5, c.hy * 0.55 - c.hz * 0.2, 645) - 0.5);
    const s2 = Math.abs(vnoise(c.hx * 0.4 - c.hz * 0.3, c.hy * 0.4 + c.hz * 0.5, 646) - 0.5);
    if (s1 < 0.05) rgb(c, 0.07, 0.07, 0.08); else if (s2 < 0.035) rgb(c, 0.78, 0.12, 0.10);
  }
}
overlay('cim_surf', surf);
// inscription gravée : lignes de « texte » (nom, dates), croix, médaillon
overlay('cim_text', (o, c) => {
  surf(o, c);
  if (c.face !== o.face) return;
  const la = o.face === LEFT ? Math.floor(2 * c.hx) - 2 * o.a0 : 2 * o.a0 - 1 - Math.floor(2 * c.hy);
  const lt = 2 * o.zTop - 1 - Math.floor(2 * c.hz);
  if (la < 0 || la >= o.w2 || lt < 0) return;
  const ink = o.ink;
  const mid = (o.w2 - 1) / 2;
  if (o.cross && lt <= 4 && ((Math.abs(la - mid) < 0.6) || (lt === 1 && Math.abs(la - mid) <= 1.5))) { rgb(c, ink[0], ink[1], ink[2]); return; }
  if (o.photo && Math.hypot((la - o.photo[0]) * 1.2, lt - o.photo[1]) < 1.6) { rgb(c, 0.80, 0.74, 0.62); if (Math.hypot(la - o.photo[0], lt - o.photo[1] + 0.6) < 0.8) rgb(c, 0.30, 0.25, 0.22); return; }
  for (const L of o.lines) {
    if (lt >= L.r && lt < L.r + L.h && la >= L.a && la < L.b) {
      if (hash(la, lt, 661, L.s) < 0.22) return;
      rgb(c, ink[0], ink[1], ink[2]);
      return;
    }
  }
});
// columbarium : la grille des cases ; grises tant qu'elles ne sont pas « découvertes »
overlay('cim_plaques', (o, c) => {
  surf(o, c);
  if (c.face !== LEFT) return;
  const la = Math.floor(2 * c.hx) - 2 * o.a0, lb = Math.floor(2 * c.hz) - 2 * o.z0;
  if (la < 0 || lb < 0 || la >= o.w * 2 || lb >= o.h * 2) return;
  const CW = 8, CH = 6, cx = Math.floor(la / CW), cy = Math.floor(lb / CH), ia = la % CW, ib = lb % CH;
  if (ia === 0 || ib === 0) { rgb(c, 0.30, 0.29, 0.27); return; }
  const h = hash(cx, cy, 651, 0);
  const found = h < o.found;
  if (found) {
    rgb(c, 0.12, 0.12, 0.13);
    if ((ib === 4 && ia >= 2 && ia <= 6) || (ib === 2 && ia >= 3 && ia <= 5)) rgb(c, 0.78, 0.62, 0.28);
    if (ib === 1 && ia === 4 && hash(cx, cy, 652, 0) < 0.6) { const v = hash(cx, cy, 653, 0); if (o.fade) rgb(c, 0.32, 0.25, 0.15); else if (v < 0.5) rgb(c, 0.86, 0.72, 0.16); else rgb(c, 0.72, 0.14, 0.16); }
  } else {
    const k = 0.50 + 0.05 * hash(cx, cy, 654, 0);
    rgb(c, k, k * 0.98, k * 0.94);
    if ((ia === 1 || ia === CW - 1) && (ib === 1 || ib === CH - 1)) rgb(c, 0.36, 0.35, 0.32);
  }
});
// vitrail derrière la grille d'une chapelle
overlay('cim_vitrail', (o, c) => {
  if (c.face !== o.face) return;
  const la = o.face === LEFT ? Math.floor(2 * c.hx) - 2 * o.a0 : 2 * o.a0 - 1 - Math.floor(2 * c.hy);
  const lb = Math.floor(2 * c.hz) - 2 * o.z0;
  if (mod(la, 3) === 0 || mod(lb, 4) === 0) { rgb(c, 0.05, 0.05, 0.05); return; }
  const P = [[0.20, 0.30, 0.62], [0.62, 0.14, 0.16], [0.78, 0.62, 0.20], [0.20, 0.45, 0.30], [0.45, 0.25, 0.55]];
  const p = P[Math.floor(hash(Math.floor(la / 3), Math.floor(lb / 4), 681, o.seed || 0) * P.length)];
  rgb(c, p[0] * 0.45, p[1] * 0.45, p[2] * 0.45);
  if (o.glow) { const k = o.glow * (0.7 + 0.3 * hash(la, lb, 682, 0)); c.er = p[0] * k + 0.25 * k; c.eg = p[1] * k + 0.06 * k; c.eb = p[2] * k; }
});
// la vitrine du fleuriste : seaux de chrysanthèmes, couronnes suspendues, lumière chaude
overlay('cim_vitrine', (o, c) => {
  if (c.face !== o.face) return;
  const la = o.face === LEFT ? Math.floor(2 * c.hx) - 2 * o.a0 : 2 * o.a0 - 1 - Math.floor(2 * c.hy);
  const lb = Math.floor(2 * c.hz) - 2 * o.z0;
  const W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  rgb(c, 0.05, 0.05, 0.05);
  if (mod(la, 14) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.10, 0.16, 0.12); return; }
  const P = [[0.90, 0.74, 0.18], [0.90, 0.88, 0.82], [0.64, 0.30, 0.66], [0.86, 0.46, 0.14], [0.76, 0.12, 0.16], [0.90, 0.55, 0.62]];
  let e;
  if (lb <= 2) e = [0.28, 0.18, 0.10, 0.4];
  else if (lb <= 9) {
    const cell = Math.floor(la / 3), p = P[Math.floor(hash(cell, Math.floor(lb / 4), 671, o.seed || 0) * P.length)];
    if (lb === 3 && mod(la, 3) !== 2) e = [0.40, 0.42, 0.44, 0.5];
    else if (hash(la, lb, 672, 0) < 0.25) e = [0.22, 0.42, 0.18, 0.55];
    else e = o.fade ? [0.45, 0.33, 0.18, 0.5] : [p[0], p[1], p[2], 0.7];
  } else if (o.kind === 'couronnes' || lb <= 17) {
    let hit = false;
    for (let cxw = 6; cxw < W2 - 3; cxw += 12) {
      const d = Math.hypot(la - cxw, (lb - 14) * 1.15);
      if (Math.abs(d - 2.6) < 0.9) { hit = true; const p = P[Math.floor(hash(la, lb, 673, cxw) * P.length)]; e = hash(la, lb, 674, 0) < 0.4 ? [0.18, 0.38, 0.16, 0.55] : (o.fade ? [0.45, 0.33, 0.18, 0.5] : [p[0], p[1], p[2], 0.68]); }
      else if (Math.abs(la - cxw) < 0.6 && lb > 16) { hit = true; e = [0.30, 0.28, 0.25, 0.4]; }
    }
    if (!hit) e = [1.0, 0.84, 0.62, 0.64];
  } else e = [1.0, 0.86, 0.66, 0.66 + 0.12 * lb / H2];
  if (o.sil != null && Math.abs(la - o.sil) <= 2 && lb >= 3 && lb <= 15) {
    const dx = la - o.sil;
    if ((lb >= 12 && dx * dx + (lb - 13.5) * (lb - 13.5) < 3.2) || (lb < 12 && Math.abs(dx) <= 2 - (lb > 10 ? 1 : 0))) { rgb(c, 0.05, 0.04, 0.04); c.er = 0.03; c.eg = 0.02; c.eb = 0.02; return; }
  }
  const k = e[3] * (o.k || 1);
  rgb(c, e[0] * 0.3, e[1] * 0.3, e[2] * 0.3); c.er = e[0] * k; c.eg = e[1] * k; c.eb = e[2] * k;
});

// ---------------------------------------------------------------- personnages du cimetière (1 pixel = 10 cm)
const K = [0.06, 0.045, 0.04];
const BASE = {
  k: K, s: [0.86, 0.69, 0.55], S: [0.66, 0.48, 0.37], h: [0.17, 0.11, 0.08], H: [0.30, 0.20, 0.13],
  o: [0.09, 0.09, 0.09], j: [0.24, 0.30, 0.42], J: [0.16, 0.20, 0.30], g: [0.46, 0.46, 0.45], G: [0.32, 0.32, 0.32],
};
const pal = extra => Object.assign({}, BASE, extra);
// le gardien : bleu de travail, casquette, le râteau à la main
const GARDIEN = {
  rows: [
    '....kkkkk....',
    '...kvvvvvk...',
    '..kvvvvvvvkk.',
    '...ksssssk...',
    '...kskskSk...',
    '...ksSssSk...',
    '....kSSSk....',
    '...kbbbbbk...',
    '..kbbbbbbbk..',
    '..kbBbbbbbkr.',
    '..kbBbbbbbsr.',
    '..kbbbbbbbkr.',
    '..ksbbbbbk.r.',
    '...kbbbbbk.r.',
    '...kBBkBBk.r.',
    '...kbbkbbk.r.',
    '...kbbkbbk.r.',
    '...kbbkbbk.r.',
    '...kookook.r.',
    '....kk.kk.RRR',
  ],
  pal: pal({ v: [0.14, 0.18, 0.30], b: [0.22, 0.32, 0.50], B: [0.15, 0.22, 0.36], r: [0.45, 0.32, 0.18], R: [0.40, 0.40, 0.40], h: [0.55, 0.52, 0.48] }), ax: 6,
};
// la veuve : manteau noir, fichu, l'arrosoir vert
const VEUVE = {
  rows: [
    '...kkkk.....',
    '..kffffk....',
    '.kfffffk....',
    '.kfssssfk...',
    '.kfsksskk...',
    '..kssSsk....',
    '..kkSSkk....',
    '.kcccccck...',
    'kcccccccck..',
    'kccccccccka.',
    'kcccccccsak.',
    'kcccccccckaa',
    'kccccccccka.',
    '.kcccccccck.',
    '.kccccccck..',
    '..kccccck...',
    '..kSSkSSk...',
    '..kookook...',
    '...kk.kk....',
  ],
  pal: pal({ f: [0.22, 0.20, 0.24], c: [0.11, 0.11, 0.13], a: [0.20, 0.42, 0.28] }), ax: 5,
};
// la fleuriste : tablier vert, un pot de chrysanthèmes dans les bras
const FLEURISTE = {
  rows: [
    '...kkkk....',
    '..khhhhk...',
    '.khhhhhhk..',
    '.khsssshk..',
    '.khskskhk..',
    '..ksssSk...',
    '...kSSk....',
    '..kbbbbk...',
    '.kbbyrybk..',
    '.kbyryrysk.',
    '.kaayyyaak.',
    '.kaakkkaak.',
    '.kaaaaaaak.',
    '.kaaaaaaak.',
    '..kaaaaak..',
    '..kjjkjjk..',
    '..kjjkjjk..',
    '..kookook..',
    '...kk.kk...',
  ],
  pal: pal({ h: [0.42, 0.24, 0.14], b: [0.72, 0.66, 0.56], a: [0.18, 0.34, 0.24], y: [0.88, 0.72, 0.18], r: [0.70, 0.14, 0.16] }), ax: 5,
};
const DEUIL = Object.assign({}, SP.WALKER, { pal: pal({ q: [0.10, 0.10, 0.12], Q: [0.06, 0.06, 0.08], h: [0.52, 0.50, 0.48], j: [0.10, 0.10, 0.12], J: [0.07, 0.07, 0.08] }) });
const DEUIL2 = Object.assign({}, SP.WALKER, { pal: pal({ q: [0.16, 0.15, 0.17], Q: [0.10, 0.10, 0.11], h: [0.20, 0.13, 0.09], j: [0.12, 0.12, 0.14], J: [0.08, 0.08, 0.09] }) });
const DEUIL3 = Object.assign({}, SP.COAT, { pal: Object.assign({}, SP.COAT.pal, { c: [0.13, 0.13, 0.15], C: [0.08, 0.08, 0.10], b: [0.80, 0.80, 0.76], h: [0.70, 0.68, 0.64] }) });

// ---------------------------------------------------------------- le quartier
module.exports = {
  w: 292, h: 156, seed: 1991,
  build(W, ctx) {
    const { G, night, R } = ctx;
    const bad = ctx.mood === 'bad';
    const WW = 292, HH = 156;
    const obj = o => W.obj(o);
    const S = o => obj(Object.assign({ type: 'cim_surf' }, o));
    const T_GRAV = S({ tint: [1.16, 1.26, 1.5] });
    const T_ALLEE = S({ tint: [1.36, 1.48, 1.78] });
    const T_WALL = S({ stain: 1, moss: 0.25, seed: 3 });
    const GREY = [0.93, 0.97, 1.06];
    const T_OLD = S({ tint: GREY, moss: 0.62, stain: 1, seed: 1 });
    const T_MID = S({ tint: GREY, moss: 0.3, stain: 1, seed: 2 });
    const T_NEW = S({ tint: GREY, stain: 0.5, seed: 4 });
    const FADE = S({ fade: 1 });
    const flowerTag = bad ? FADE : 0;
    const used = new Uint8Array(WW * HH);
    const mark = (x0, y0, x1, y1) => { for (let y = Math.max(0, y0); y < Math.min(HH, y1); y++) for (let x = Math.max(0, x0); x < Math.min(WW, x1); x++) used[y * WW + x] = 1; };
    const free = (x0, y0, x1, y1) => { for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) if (x < 0 || y < 0 || x >= WW || y >= HH || used[y * WW + x]) return false; return true; };
    const lumignon = (x, y, z) => { if (night) { W.set(x, y, z, M.RED_LIGHT); W.light({ x: x + 0.5, y: y + 0.5, z: z + 0.7, r: 12, fall: 1.6, cr: 0.95, cg: 0.16, cb: 0.06, skip: 1 }); } else W.set(x, y, z, M.PLASTIC_RED); };
    const pot = (x, y, z, w = 1, d = 1, potMat = M.TERRACOTTA) => { W.box(x, y, z, x + w, y + d, z + 1, potMat); W.box(x, y, z + 1, x + w, y + d, z + 2, M.CIM_FLEURS, flowerTag); };

    // ------------------------------------------------ sol : gravier clair, herbe dans les vieux carrés (à l'ouest)
    for (let y = 9; y < 143; y++) for (let x = 7; x < 279; x++) {
      const age = fbm(x / 21, y / 15, 701) + (1 - x / 260) * 0.55;
      if (age > 0.9) W.set(x, y, 1, M.GRASS); else W.set(x, y, 1, M.GRAVEL, T_GRAV);
    }
    const alley = (x0, y0, x1, y1) => { W.box(x0, y0, 1, x1, y1, 2, M.GRAVEL, T_ALLEE); mark(x0, y0, x1, y1); };
    alley(7, 64, 279, 76);         // l'allée principale, de la grille au mur ouest
    alley(135, 9, 145, 143);       // l'allée transversale
    alley(7, 9, 279, 14);          // les allées de ronde
    alley(7, 9, 12, 143); alley(7, 138, 210, 143); alley(274, 9, 279, 109);
    alley(12, 41, 135, 45); alley(145, 41, 250, 45); // allées secondaires
    alley(12, 104, 135, 109); alley(145, 104, 207, 109);
    W.box(7, 63, 1, 279, 64, 2, M.CURB); W.box(7, 76, 1, 279, 77, 2, M.CURB);
    // le rond-point du calvaire
    const RX = 140, RY = 70;
    for (let y = RY - 16; y <= RY + 16; y++) for (let x = RX - 16; x <= RX + 16; x++) {
      const d = Math.hypot(x - RX + 0.5, y - RY + 0.5);
      if (d < 14.5) W.set(x, y, 1, M.GRAVEL, T_ALLEE); else if (d < 15.5) W.set(x, y, 1, M.CURB);
      if (d < 16) used[y * WW + x] = 1;
    }

    // ------------------------------------------------ le mur d'enceinte : enduit gris, chaperon de tuiles
    const wall = (x0, y0, x1, y1, h) => {
      W.box(x0, y0, 2, x1, y1, 2 + h, M.PLASTER_GREY, T_WALL);
      W.box(x0, y0, 2 + h, x1, y1, 3 + h, M.TERRACOTTA);
      if (x1 - x0 > y1 - y0) W.box(x0, y0 + 1, 3 + h, x1, y1 - 1, 4 + h, M.TERRACOTTA); else W.box(x0 + 1, y0, 3 + h, x1 - 1, y1, 4 + h, M.TERRACOTTA);
      mark(x0, y0, x1, y1);
    };
    wall(4, 6, 282, 9, 13);        // nord, côté quai
    wall(4, 6, 7, 146, 13);        // ouest
    wall(4, 143, 210, 146, 10);    // sud, sur l'avenue
    wall(279, 6, 282, 22, 10);     // est, au nord de la loge
    wall(279, 52, 282, 54, 10);
    wall(279, 86, 282, 112, 10);   // est, au sud de la grille
    wall(207, 109, 279, 112, 10); wall(207, 109, 210, 146, 10); // l'angle du fleuriste
    // lierre : sur la face intérieure du mur nord, et qui déborde sur l'avenue
    for (let x = 8; x < 278; x++) {
      const n = fbm(x / 9, 3.3, 711);
      if (n > 0.6) { const top = 2 + Math.floor((n - 0.6) * 40); for (let z = 2; z < Math.min(15, top); z++) if (hash(x, z, 712, 0) < 0.8) W.set(x, 9, z, M.HEDGE); }
    }
    for (let x = 8; x < 206; x++) {
      const n = fbm(x / 8, 7.7, 713);
      if (n > 0.62) { const bot = 12 - Math.floor((n - 0.62) * 34); for (let z = Math.max(3, bot); z < 13; z++) if (hash(x, z, 714, 0) < 0.78) W.set(x, 146, z, M.HEDGE); if (hash(x, 0, 715, 0) < 0.5) W.set(x, 144, 14, M.HEDGE); }
    }
    // de vieilles stèles adossées au mur ouest, des croix de fer
    for (let y = 18; y < 136; y += 9) {
      if (y > 58 && y < 82) continue;
      const hgt = 6 + (y % 4);
      W.box(7, y, 2, 8, y + 4, 2 + hgt, M.STONE, T_OLD); W.box(7, y + 1, 2 + hgt, 8, y + 3, 3 + hgt, M.STONE, T_OLD);
      if (y % 2) { W.box(8, y + 5, 2, 9, y + 6, 8, M.METAL_DARK); W.box(8, y + 4, 6, 9, y + 7, 7, M.METAL_DARK); }
    }
    // la porte de service sur l'avenue
    W.box(96, 143, 2, 104, 146, 12, 0); W.box(94, 143, 2, 96, 146, 15, M.STONE); W.box(104, 143, 2, 106, 146, 15, M.STONE);
    for (let x = 96; x < 104; x++) { W.set(x, 144, 11, M.METAL_DARK); W.set(x, 144, 3, M.METAL_DARK); if (x % 2 === 0) W.box(x, 144, 3, x + 1, 145, 12, M.METAL_DARK); }
    W.box(96, 143, 1, 104, 146, 2, M.GRAVEL, T_ALLEE);

    // ------------------------------------------------ la grille d'entrée, sur la rue de l'Ouest
    const pillar = (y0) => {
      W.box(277, y0, 2, 282, y0 + 5, 21, M.STONE, T_MID);
      W.box(276, y0 - 1, 21, 283, y0 + 6, 22, M.STONE); W.box(277, y0, 22, 282, y0 + 5, 23, M.STONE);
      W.box(278, y0 + 1, 23, 281, y0 + 4, 26, M.STONE); W.box(279, y0 + 2, 26, 280, y0 + 3, 28, M.STONE); // pot à feu
      W.box(276, y0 - 1, 2, 283, y0 + 6, 3, M.STONE);
      mark(276, y0 - 1, 283, y0 + 6);
    };
    pillar(54); pillar(81);
    // les vantaux : celui du nord fermé, celui du sud ouvert vers l'intérieur
    for (let y = 59; y < 70; y++) { W.set(280, y, 3, M.METAL_DARK); W.set(280, y, 9, M.METAL_DARK); W.set(280, y, 15, M.METAL_DARK); if (y % 2 === 1) { W.box(280, y, 3, 281, y + 1, 16, M.METAL_DARK); W.set(280, y, 16, M.METAL); } }
    for (let x = 269; x < 280; x++) { W.set(x, 80, 3, M.METAL_DARK); W.set(x, 80, 9, M.METAL_DARK); W.set(x, 80, 15, M.METAL_DARK); if (x % 2 === 1) { W.box(x, 80, 3, x + 1, 81, 16, M.METAL_DARK); W.set(x, 80, 16, M.METAL); } }
    // l'arceau et le nom
    for (let y = 59; y < 81; y++) { const t = (y - 69.5) / 11; const z = 22 + Math.round(4 * (1 - t * t)); W.set(280, y, z, M.METAL_DARK); if (y % 3 === 0) W.set(280, y, z - 1, M.METAL_DARK); }
    W.box(280, 60, 17, 281, 80, 21, M.METAL_DARK);
    const gsign = new Facade(W, RIGHT, 280, 60, 1, 20);
    gsign.sign(0, 21, 'CIMETIÈRE', { fg: [0.86, 0.80, 0.62], depth: 0, padX: 1 });
    W.box(274, 59, 1, 282, 81, 2, M.GRAVEL, T_ALLEE); mark(248, 53, 279, 87);
    W.box(248, 56, 1, 279, 84, 2, M.GRAVEL, T_ALLEE);
    // le panneau du règlement, les poubelles vertes, le tas de fleurs fanées
    W.box(270, 86, 2, 271, 87, 12, M.METAL_DARK); W.box(276, 86, 2, 277, 87, 12, M.METAL_DARK);
    W.box(269, 86, 8, 278, 87, 13, M.WOOD_DARK);
    { const f = new Facade(W, LEFT, 270, 86, 7, 1); f.poster(0, 9, 7, 3, { title: 'ARRÊTÉ', bg: [0.80, 0.78, 0.70], fg: [0.12, 0.12, 0.12], seed: 13, depth: 0 }); }
    B.bin(W, 262, 86, G); B.bin(W, 265, 86, G); B.bin(W, 262, 89, G);
    for (let i = 0; i < 30; i++) { const x = 256 + Math.floor(R() * 7), y = 89 + Math.floor(R() * 7), z = 2 + Math.floor(R() * 3), r = R(); if (W.get(x, y, z - 1) || z === 2) W.set(x, y, z, r < 0.4 ? M.HEDGE : M.CIM_FLEURS, FADE); }
    mark(254, 84, 279, 98);

    // ------------------------------------------------ la loge du gardien
    {
      const x0 = 252, y0 = 22, w = 30, d = 30, h = 17;
      W.box(x0, y0, 2, x0 + w, y0 + d, 2 + h, M.BRICK_PALE);
      const fl = new Facade(W, LEFT, x0, y0, w, d), fr = new Facade(W, RIGHT, x0, y0, w, d);
      for (const f of [fl, fr]) {
        f.rect(0, 2, 2, 2 + h, 0, M.STONE); f.rect(f.len - 2, 2, f.len, 2 + h, 0, M.STONE);
        f.rect(0, 2, f.len, 3, -1, M.STONE);
      }
      fl.door(13, 3, 5, 11, night ? { kind: 'door', step: true, k: 0.8 } : { mat: M.WOOD_DARK, step: true });
      const lit = night;
      fl.window(4, 6, 6, 8, { state: lit ? 'lit' : 'dark', shutter: M.SHUTTER_BORD, curtain: [0.62, 0.30, 0.22], sil: lit ? 'head' : null, silX: 4 });
      fl.window(21, 6, 6, 8, { state: lit ? 'tv' : 'dark', shutter: M.SHUTTER_BORD, seed: 5 });
      fr.window(5, 6, 6, 8, { state: lit ? 'lit' : 'dark', shutter: M.SHUTTER_BORD, curtain: [0.55, 0.50, 0.32] });
      fr.window(20, 6, 5, 8, { state: 'dark', shutter: M.SHUTTER_BORD, closed: true });
      B.gableRoof(W, x0, y0, w, d, 2 + h, M.TERRACOTTA, { axis: 'x', oh: 1, gable: M.BRICK_PALE });
      { const fg = new Facade(W, RIGHT, x0, y0, w, d); fg.window(14, 22, 4, 5, { state: lit ? 'lit' : 'dark', sill: false, spill: false }); }
      B.chimney(W, x0 + 8, y0 + 8, 2 + h + 9, 7);
      // la lanterne au-dessus de la porte, la jardinière, le vélo
      fl.set(15, 15, -1, night ? M.BULB : M.METAL_DARK); fl.set(15, 16, -1, M.METAL_DARK);
      if (night) W.light(Object.assign(fl.front(15, 15, 2), { r: 30, cr: 0.85, cg: 0.58, cb: 0.28, skip: 1.5 }));
      fl.rect(5, 6, 9, 7, -1, M.TERRACOTTA); fl.rect(5, 7, 9, 8, -1, M.CIM_FLEURS, flowerTag);
      // le vélo contre le mur
      const by = y0 + d;
      for (const cx of [x0 + 21.5, x0 + 27.5]) for (let a = 0; a < 16; a++) { const t = a / 16 * Math.PI * 2; W.set(Math.floor(cx + Math.cos(t) * 2.2), by, Math.floor(4.5 + Math.sin(t) * 2.2), M.METAL_DARK); }
      W.box(x0 + 22, by, 5, x0 + 28, by + 1, 6, M.CAR_BLUE); W.box(x0 + 26, by, 6, x0 + 27, by + 1, 9, M.METAL_DARK); W.box(x0 + 22, by, 6, x0 + 23, by + 1, 8, M.METAL_DARK); W.box(x0 + 21, by, 8, x0 + 24, by + 1, 9, M.WOOD_DARK);
      // le jardinet : buis taillés
      for (const bx of [x0 + 2, x0 + 9]) { W.box(bx, by + 2, 2, bx + 3, by + 4, 4, M.HEDGE); }
      mark(x0 - 2, y0, 282, y0 + d + 4);
    }

    // ------------------------------------------------ le calvaire
    for (let k = 0; k < 3; k++) { const r = 6.5 - k * 1.6; for (let y = RY - 7; y <= RY + 7; y++) for (let x = RX - 7; x <= RX + 7; x++) if (Math.max(Math.abs(x - RX + 0.5), Math.abs(y - RY + 0.5)) < r) W.set(x, y, 2 + k, M.STONE, T_MID); }
    W.box(RX - 2, RY - 2, 5, RX + 2, RY + 2, 12, M.STONE, T_MID);
    W.box(RX - 3, RY - 3, 12, RX + 3, RY + 3, 13, M.STONE);
    W.box(RX - 1, RY - 1, 13, RX + 1, RY + 1, 45, M.STONE, T_MID);
    W.box(RX - 6, RY - 1, 37, RX + 6, RY + 1, 39, M.STONE, T_MID);
    W.box(RX - 1, RY + 1, 31, RX + 1, RY + 2, 38, M.METAL_DARK); W.box(RX - 4, RY + 1, 37, RX + 4, RY + 2, 38, M.METAL_DARK); W.set(RX - 1, RY + 1, 39, M.METAL_DARK);
    W.box(RX - 1, RY - 1, 45, RX + 1, RY + 1, 46, M.STONE);
    pot(RX - 4, RY + 4, 4, 2, 1); pot(RX + 2, RY + 4, 4, 2, 1);
    if (night) lumignon(RX, RY + 4, 4);

    // ------------------------------------------------ cyprès, ifs et buis
    const cypres = (cx, cy, H, r0, seed) => {
      W.box(cx, cy, 2, cx + 1, cy + 1, 5, M.WOOD_DARK);
      for (let z = 4; z < 2 + H; z++) {
        const t = (z - 2) / H;
        const r = r0 * (t < 0.28 ? 0.72 + 0.28 * t / 0.28 : Math.pow(1 - (t - 0.28) / 0.72, 0.85)) + 0.25;
        const R2 = Math.ceil(r + 1);
        for (let y = cy - R2; y <= cy + R2; y++) for (let x = cx - R2; x <= cx + R2; x++) {
          const d = Math.hypot(x - cx, y - cy);
          const n = (hash(x, y, z, seed) - 0.5) * 1.1 + (vnoise(x * 0.7 + z * 0.3, y * 0.7, seed) - 0.5) * 0.8;
          if (d < r + n && W.get(x, y, z) === 0) W.set(x, y, z, M.CIM_CYPRES);
        }
      }
      W.set(cx, cy, 2 + H, M.CIM_CYPRES);
      mark(cx - 3, cy - 3, cx + 4, cy + 4);
    };
    const buis = (cx, cy, r) => { for (let z = 2; z < 2 + 2 * r; z++) for (let y = cy - r; y <= cy + r; y++) for (let x = cx - r; x <= cx + r; x++) { if (Math.hypot(x - cx, y - cy, (z - 1.5 - r) * 1.1) < r + 0.3 && W.get(x, y, z) === 0) W.set(x, y, z, M.HEDGE); } mark(cx - r, cy - r, cx + r + 1, cy + r + 1); };
    // (attention : un volume haut cache ce qui est derrière lui sur la même colonne d'écran, u = 2(x − y))
    cypres(127, 56, 40, 2.6, 731); cypres(152, 55, 42, 2.6, 732);
    for (const [x, hgt] of [[26, 46], [222, 42]]) cypres(x, 79, hgt, 2.6, 740 + x);
    for (const [x, hgt] of [[38, 40], [62, 46], [196, 40], [236, 36]]) cypres(x, 57, hgt, 2.4, 760 + x);
    cypres(176, 26, 36, 2.4, 751); cypres(16, 20, 52, 3.0, 753); cypres(16, 128, 48, 2.8, 754);
    buis(246, 62, 2); buis(246, 77, 2); buis(130, 84, 2); buis(150, 84, 2);

    // ------------------------------------------------ les tombes
    const GRANITES = [null, [4.6, 4.6, 4.4], [5.8, 4.0, 3.7], [2.7, 2.9, 3.5], [3.4, 3.4, 3.2]];
    const lineSet = (w2, rows, cross) => {
      const L = []; let r = cross ? 6 : 2;
      for (let i = 0; i < rows; i++) {
        const big = i % 2 === 0; const inset = big ? 1 : 2 + Math.floor(R() * 2);
        L.push({ r, h: big ? 2 : 1, a: inset, b: w2 - inset - (big ? Math.floor(R() * 2) : 0), s: Math.floor(R() * 1000) });
        r += big ? 3 : 3;
      }
      return L;
    };
    // une tombe orientée sud : emprise x..x+w, y..y+11 ; la stèle au nord (y..y+2)
    const tomb = (x, y, kind, o = {}) => {
      const w = o.w || 5, age = o.age;
      const tagA = age > 0.66 ? T_OLD : age > 0.33 ? T_MID : T_NEW;
      const r1 = R(), r2 = R(), r3 = R(), r4 = R(), r5 = R();
      const res = { x, y, w, kind, top: 4, front: y + 2 };
      if (kind === 'terre') {
        W.box(x + 1, y + 3, 2, x + w - 1, y + 10, 3, r1 < 0.5 ? M.GRASS : M.SOIL);
        const cx = x + (w >> 1), mat = r2 < 0.5 ? M.WOOD_DARK : M.METAL_DARK;
        const lean = r3 < 0.35 ? 1 : 0;
        W.box(cx, y + 2, 2, cx + 1, y + 3, 7, mat); W.box(cx, y + 2 + lean, 7, cx + 1, y + 3 + lean, 10, mat);
        W.box(cx - 1, y + 2 + lean, 8, cx + 2, y + 3 + lean, 9, mat);
        if (r4 < 0.4) W.set(cx, y + 3, 5, M.WHITE);
        res.top = 3; res.front = y + 3;
      } else if (kind === 'grille') {
        W.box(x, y, 1, x + w, y + 11, 2, M.GRASS);
        for (let i = 0; i < w; i++) for (const yy of [y, y + 10]) { W.set(x + i, yy, 5, M.METAL_DARK); if (i % 2 === 0) W.box(x + i, yy, 2, x + i + 1, yy + 1, 5, M.METAL_DARK); }
        for (let j = 0; j < 11; j++) for (const xx of [x, x + w - 1]) { W.set(xx, y + j, 5, M.METAL_DARK); if (j % 2 === 0) W.box(xx, y + j, 2, xx + 1, y + j + 1, 5, M.METAL_DARK); }
        for (const [xx, yy] of [[x, y], [x + w - 1, y], [x, y + 10], [x + w - 1, y + 10]]) W.set(xx, yy, 6, M.METAL_DARK);
        const cx = x + (w >> 1);
        W.box(cx - 1, y + 1, 2, cx + 2, y + 3, 5, M.STONE, tagA);
        W.box(cx, y + 1, 5, cx + 1, y + 2, 15, M.STONE, tagA); W.box(cx - 1, y + 1, 12, cx + 2, y + 2, 13, M.STONE, tagA);
        if (r2 < 0.5) W.box(x + 1, y + 6, 2, x + w - 1, y + 9, 3, M.HEDGE);
        res.top = 5; res.front = y + 2;
      } else if (kind === 'sarco') {
        W.box(x, y + 1, 2, x + w, y + 11, 3, M.STONE, tagA);
        W.box(x, y + 2, 3, x + w, y + 10, 6, M.STONE, tagA);
        W.box(x, y + 1, 6, x + w, y + 11, 7, M.STONE, tagA);
        if (r2 < 0.5) W.box(x + (w >> 1), y + 4, 7, x + (w >> 1) + 1, y + 8, 8, M.STONE, tagA);
        res.top = 7; res.front = y + 5;
      } else if (kind === 'enfant') {
        W.box(x + 1, y + 3, 2, x + w - 1, y + 9, 3, M.WHITE);
        W.box(x + 1, y + 2, 2, x + w - 1, y + 3, 7, M.WHITE);
        W.set(x + 1, y + 2, 6, 0); W.set(x + w - 2, y + 2, 6, 0);
        pot(x + 2, y + 6, 3, 1, 1, M.WHITE);
        res.top = 3; res.front = y + 3;
      } else if (kind === 'obelisque') {
        W.box(x, y + 1, 2, x + w, y + 11, 3, M.CIM_GRANITE);
        W.box(x + 1, y + 1, 3, x + w - 1, y + 5, 5, M.CIM_GRANITE);
        W.box(x + 1, y + 2, 5, x + w - 1, y + 4, 16, M.CIM_GRANITE); W.box(x + 2, y + 2, 16, x + w - 2, y + 4, 19, M.CIM_GRANITE);
        res.top = 3; res.front = y + 5;
      } else { // 'dalle' (calcaire) ou 'granit'
        const gran = kind === 'granit';
        const mat = gran ? M.CIM_GRANITE : M.STONE;
        const tint = gran ? GRANITES[Math.floor(r1 * GRANITES.length)] : null;
        const tg = gran ? (tint ? S({ tint }) : 0) : tagA;
        W.box(x, y, 2, x + w, y + 11, 3, mat, tg);
        W.box(x, y + 2, 3, x + w, y + 11, 4, mat, tg);
        const H = 4 + Math.floor(r2 * 5) + (w > 6 ? 2 : 0);
        W.box(x, y, 3, x + w, y + 2, 4 + H, mat, tg);
        if (r3 < 0.5) { W.set(x, y, 3 + H, 0); W.set(x, y + 1, 3 + H, 0); W.set(x + w - 1, y, 3 + H, 0); W.set(x + w - 1, y + 1, 3 + H, 0); }
        const cross = !gran && r4 < 0.45;
        if (cross) { const cx = x + (w >> 1); W.box(cx, y, 4 + H, cx + 1, y + 1, 9 + H, mat, tg); W.box(cx - 1, y, 7 + H, cx + 2, y + 1, 8 + H, mat, tg); }
        // l'inscription, sur la face avant de la stèle
        const ink = gran ? [0.80, 0.64, 0.30] : (age > 0.66 ? [0.36, 0.34, 0.30] : [0.24, 0.22, 0.20]);
        const tx = obj(Object.assign({ type: 'cim_text', face: LEFT, a0: x, zTop: 4 + H, w2: w * 2, ink, cross: gran && r4 < 0.5, photo: gran && r5 < 0.3 ? [3, 5] : null, lines: lineSet(w * 2, Math.min(4, 1 + Math.floor((H - 2) / 1.6)), gran && r4 < 0.5) }, tint ? { tint } : (gran ? {} : { tint: GREY, moss: age > 0.66 ? 0.62 : age > 0.33 ? 0.3 : 0, stain: 1, seed: 7 })));
        for (let i = 0; i < w; i++) for (let z = 4; z < 4 + H; z++) if (W.get(x + i, y + 1, z) === mat) W.tag[W.idx(x + i, y + 1, z)] = tx;
        res.top = 4; res.front = y + 2;
        // vase, jardinière, plaques
        if (gran || r5 < 0.4) pot(x + 1, y + 2, 4, w - 2, 1, gran ? M.CIM_GRANITE : M.STONE);
        if (gran && r5 > 0.5) { W.set(x + 1, y + 6, 4, M.WHITE); W.set(x + w - 2, y + 7, 4, M.CIM_GRANITE); }
      }
      return res;
    };

    // les rangées : (y de la stèle, x de départ, x de fin)
    const ROWS = [
      [15, 12, 135], [29, 12, 135], [15, 145, 178], [29, 145, 250], [48, 12, 125], [48, 145, 248],
      [78, 12, 125], [92, 12, 135], [78, 155, 272], [92, 145, 272], [110, 12, 135], [124, 12, 135], [110, 145, 207], [124, 145, 207],
    ];
    // ce qui est déjà posé : chapelles, caveau du club, columbarium, tombe fraîche, point d'eau
    const special = [];
    const chapelAt = (x, y, w, d, o) => { special.push(Object.assign({ x, y, w, d }, o)); mark(x - 1, y - 1, x + w + 1, y + d + 2); };
    chapelAt(18, 46, 13, 15, { name: 'MAUDET', mat: M.STONE, tag: T_OLD, roof: M.SLATE, glow: 0 });
    chapelAt(45, 47, 12, 14, { name: 'BESSAC', mat: M.PLASTER_CREAM, tag: T_MID, roof: M.SLATE, glow: 0.35 });
    chapelAt(69, 46, 13, 15, { name: 'VERNAY', mat: M.STONE, tag: T_MID, roof: M.STONE, glow: 0 });
    chapelAt(214, 47, 12, 14, { name: 'AUBERT', mat: M.STONE, tag: T_NEW, roof: M.SLATE, glow: 0.4 });
    mark(85, 44, 115, 63);    // le caveau du Racing
    mark(156, 40, 178, 63);   // la chapelle Vaubourg
    mark(180, 9, 248, 28);    // le columbarium et le jardin du souvenir
    mark(158, 78, 174, 91);   // la tombe fraîche
    mark(236, 78, 246, 86);   // le point d'eau
    mark(60, 128, 66, 138);   // un banc
    const tombs = [];
    for (const [ty, x0, x1] of ROWS) {
      let x = x0 + 1;
      while (x + 5 <= x1) {
        const r = R(), rw = R(), rk = R();
        const age = clamp(1.25 - x / 230 + (r - 0.5) * 0.5 + (ty < 64 ? 0.08 : -0.05), 0, 1);
        let w = rw < 0.16 ? 9 : rw < 0.24 ? 7 : 5;
        if (x + w > x1) w = 5;
        if (!free(x, ty, x + w, ty + 11)) { x += 2; continue; }
        if (rk < 0.06) { x += w + 2; continue; } // concession reprise : une place vide
        let kind;
        if (w >= 7) kind = age > 0.6 ? (rk < 0.5 ? 'sarco' : 'dalle') : (rk < 0.12 ? 'obelisque' : 'granit');
        else if (age > 0.72) kind = rk < 0.32 ? 'terre' : rk < 0.55 ? 'grille' : rk < 0.68 ? 'sarco' : 'dalle';
        else if (age > 0.4) kind = rk < 0.14 ? 'terre' : rk < 0.24 ? 'grille' : rk < 0.6 ? 'dalle' : 'granit';
        else kind = rk < 0.08 ? 'enfant' : rk < 0.25 ? 'dalle' : 'granit';
        const t = tomb(x, ty, kind, { w, age });
        t.lum = R(); t.age = age;
        tombs.push(t);
        mark(x, ty, x + w, ty + 11);
        x += w + 2;
      }
    }
    const VT0 = tombs.find(t => t.kind === 'dalle' && t.x > 84 && t.x < 118 && t.y === 78) || tombs.find(t => t.kind === 'dalle' && t.y === 78);
    // lumignons de la nuit : quelques-uns, rouges, sur les tombes qu'on visite encore
    for (const t of tombs) if (t.lum < 0.105 && t.kind !== 'terre' && !(bad && t === VT0)) lumignon(t.x + 1 + Math.floor(t.lum * 40) % Math.max(1, t.w - 2), t.front, t.top);

    // ------------------------------------------------ les chapelles
    const chapel = (c) => {
      const { x, y, w, d, mat, tag } = c, H = 15;
      W.box(x - 1, y - 1, 2, x + w + 1, y + d + 1, 3, M.STONE, tag);
      W.box(x, y, 3, x + w, y + d, 3 + H, mat, tag);
      W.box(x - 1, y - 1, 3 + H, x + w + 1, y + d + 1, 4 + H, M.STONE, tag);
      B.gableRoof(W, x, y, w, d, 4 + H, c.roof, { axis: 'y', oh: 1, gable: mat });
      // pilastres d'angle et pinacles
      for (const px of [x, x + w - 1]) { W.box(px, y + d - 1, 3, px + 1, y + d, 4 + H, M.STONE, tag); W.box(px, y + d - 1, 4 + H, px + 1, y + d, 7 + H, M.STONE, tag); }
      const f = new Facade(W, LEFT, x, y, w, d);
      const dw = 5, s0 = Math.floor((w - dw) / 2), dh = 10;
      for (let k = 0; k < dh + 2; k++) { const half = k < dh ? 2.5 : k === dh ? 1.5 : 0.5; for (let s = s0; s < s0 + dw; s++) if (Math.abs(s + 0.5 - (s0 + 2.5)) < half) { f.set(s, 3 + k, 0, 0); f.set(s, 3 + k, 1, 0); } }
      const vid = obj({ type: 'cim_vitrail', face: LEFT, a0: x + s0, z0: 3, seed: x, glow: night ? c.glow : 0 });
      for (let k = 0; k < dh + 2; k++) for (let s = s0; s < s0 + dw; s++) if (f.xy(s, 0) && W.get(...f.xy(s, 0), 3 + k) === 0) { const [gx, gy] = f.xy(s, 2); W.set(gx, gy, 3 + k, M.GLASS, vid); }
      for (let k = 0; k < dh + 1; k++) for (let s = s0; s < s0 + dw; s++) { const [bx, by] = f.xy(s, 0); if (W.get(bx, by, 3 + k) === 0 && (s - s0) % 2 === 1) W.set(bx, by, 3 + k, M.METAL_DARK); }
      for (let s = s0; s < s0 + dw; s++) { const [bx, by] = f.xy(s, 0); if (W.get(bx, by, 9) === 0) W.set(bx, by, 9, M.METAL_DARK); }
      W.box(x + s0 - 1, y + d, 2, x + s0 + dw + 1, y + d + 2, 3, M.STONE, tag);
      // le nom au fronton
      const nm = c.name;
      const tw = Math.ceil(textBitmap(nm).w / 2);
      f.sign(Math.max(0, Math.floor((w - tw) / 2)), 3 + H, nm, { fg: [0.24, 0.22, 0.20], depth: 0 });
      // la croix au faîte
      const apex = 4 + H + Math.ceil((w + 2) / 2);
      const cx = x + (w >> 1);
      W.box(cx, y + d - 2, apex, cx + 1, y + d - 1, apex + 6, M.STONE, tag); W.box(cx - 1, y + d - 2, apex + 3, cx + 2, y + d - 1, apex + 4, M.STONE, tag);
      if (night && c.glow) W.light({ x: x + w / 2, y: y + d + 1.5, z: 6, r: 14, cr: 0.7, cg: 0.14, cb: 0.08, shadow: false });
    };
    for (const c of special) chapel(c);

    // ------------------------------------------------ la chapelle Vaubourg : un petit temple, comme le président
    {
      const x = 157, y = 41, w = 19, d = 19;
      for (let k = 0; k < 3; k++) W.box(x - 1 + k, y - 1, 2 + k, x + w + 1 - k, y + d + 1 - k, 3 + k, M.STONE, T_NEW);
      W.box(x + 2, y + 2, 5, x + w - 2, y + d - 5, 22, M.STONE, T_NEW);
      const f = new Facade(W, LEFT, x + 2, y + 2, w - 4, d - 7);
      f.rect(4, 5, 11, 16, 0, M.METAL_DARK); f.rect(4, 5, 11, 16, 1, M.METAL_DARK);
      f.rect(7, 5, 8, 16, -1, M.METAL); f.rect(4, 16, 11, 17, 0, M.STONE);
      for (const cx of [x + 2, x + 6, x + w - 7, x + w - 3]) { W.box(cx, y + d - 4, 5, cx + 2, y + d - 2, 22, M.STONE, T_NEW); W.box(cx - 1, y + d - 5, 5, cx + 3, y + d - 1, 6, M.STONE); }
      W.box(x + 1, y + 1, 22, x + w - 1, y + d - 1, 25, M.STONE, T_NEW);
      const fe = new Facade(W, LEFT, x + 1, y + 1, w - 2, d - 2);
      fe.sign(1, 25, 'VAUBOURG', { fg: [0.20, 0.18, 0.16], depth: 0 });
      for (let k = 0; k < 6; k++) W.box(x + 1 + k * 1.5, y + 1, 25 + k, x + w - 1 - k * 1.5, y + d - 1, 26 + k, k === 5 ? M.ZINC : M.STONE, T_NEW);
      W.box(x + 9, y + d - 2, 31, x + 10, y + d - 1, 36, M.METAL_DARK); W.box(x + 8, y + d - 2, 34, x + 11, y + d - 1, 35, M.METAL_DARK);
      pot(x + 3, y + d + 1, 5, 2, 1, M.STONE); pot(x + w - 5, y + d + 1, 5, 2, 1, M.STONE);
    }

    // ------------------------------------------------ le caveau du Racing : granit noir, lettres d'or, l'écharpe posée dessus
    const CV = { x: 86, y: 45, w: 28 };
    {
      const { x, y, w } = CV;
      W.box(x, y + 4, 2, x + w, y + 17, 3, M.CIM_GRANITE);
      W.box(x + 1, y + 5, 3, x + w - 1, y + 16, 4, M.CIM_GRANITE);
      W.box(x + 3, y + 9, 4, x + w - 3, y + 10, 5, M.CIM_GRANITE);       // la croix du couvercle, en relief
      W.box(x + 13, y + 6, 4, x + 15, y + 15, 5, M.CIM_GRANITE);
      W.box(x, y, 2, x + w, y + 4, 18, M.CIM_GRANITE);                  // la stèle
      W.box(x + 10, y + 1, 18, x + 18, y + 4, 26, M.CIM_GRANITE);        // le fronton de l'écusson
      const f = new Facade(W, LEFT, x, y, w, 4);
      const GOLD = [0.86, 0.68, 0.30];
      f.sign(8, 17, 'RACING', { fg: GOLD, depth: 0 });
      f.sign(6, 14, 'AUBÉRIVE', { fg: GOLD, depth: 0 });
      f.sign(4, 10, 'DAN CORVEN', { fg: [0.92, 0.80, 0.50], depth: 0 });
      f.sign(1, 7, "J'ÉTAIS DEVANT", { fg: [0.70, 0.56, 0.28], depth: 0 });
      const fc = new Facade(W, LEFT, x + 10, y + 1, 8, 3);
      fc.crest(2, 19, 4, 6);
      // le ballon de pierre sur le fronton
      for (let z = 26; z < 30; z++) for (let yy = y + 1; yy < y + 4; yy++) for (let xx = x + 12; xx < x + 16; xx++) if (Math.hypot(xx - (x + 13.5), yy - (y + 2), (z - 27.5) * 1.1) < 1.9) W.set(xx, yy, z, (xx + yy + z) % 3 === 0 ? M.METAL_DARK : M.WHITE);
      // l'écharpe : posée sur la stèle, elle pend sur le côté et devant
      const sc = (xx, yy, z, i) => W.set(xx, yy, z, i % 2 ? M.SEAT_GREY : M.SEAT);
      let i = 0;
      for (let xx = x + 11; xx < x + w; xx++) { if (xx >= x + 10 && xx < x + 18) continue; sc(xx, y + 2, 18, i); sc(xx, y + 3, 18, i++); }
      for (let z = 17; z >= 9; z--) { sc(x + w, y + 2, z, i); sc(x + w, y + 3, z, i++); }
      W.set(x + w, y + 2, 8, M.SEAT_GREY); W.set(x + w, y + 3, 7, M.SEAT_GREY);
      for (let z = 18; z >= 14; z--) { sc(x + 24, y + 4, z, z); sc(x + 25, y + 4, z, z + 1); }
      W.set(x + 24, y + 4, 13, M.SEAT_GREY); W.set(x + 25, y + 4, 13, M.SEAT_GREY);
      // fleurs bordeaux et blanches, la plaque du club, le lumignon
      pot(x + 2, y + 5, 4, 3, 2, M.CIM_GRANITE); pot(x + w - 5, y + 5, 4, 3, 2, M.CIM_GRANITE);
      W.box(x + 4, y + 12, 4, x + 8, y + 13, 5, M.WHITE); W.box(x + 20, y + 12, 4, x + 24, y + 13, 5, M.SEAT);
      lumignon(x + 9, y + 5, 4);
    }

    // ------------------------------------------------ le columbarium : le mur des plaques, et le jardin du souvenir
    {
      const x0 = 182, x1 = 246;
      W.box(x0, 9, 2, x1, 14, 16, M.STONE, T_NEW);
      W.box(x0 - 1, 9, 16, x1 + 1, 15, 17, M.STONE);
      const pid = obj({ type: 'cim_plaques', a0: x0 + 1, z0: 3, w: x1 - x0 - 2, h: 12, found: 0.28, fade: bad });
      for (let x = x0 + 1; x < x1 - 1; x++) for (let z = 3; z < 15; z++) W.set(x, 13, z, M.STONE, pid);
      W.box(x0, 14, 2, x1, 15, 3, M.STONE);
      // le jardin du souvenir : un cercle de galets, une stèle, deux bancs
      for (let y = 16; y < 28; y++) for (let x = 200; x < 228; x++) { const d = Math.hypot((x - 214) / 1.6, y - 21.5); if (d < 6) W.set(x, y, 1, M.COBBLE); else if (d < 6.8) W.set(x, y, 2, M.STONE); }
      W.box(212, 20, 2, 216, 22, 9, M.STONE, T_NEW);
      B.bench(W, 196, 18, G, 'y'); B.bench(W, 230, 17, G, 'y');
      pot(203, 24, 2, 2, 1); pot(225, 24, 2, 2, 1);
      if (night) { lumignon(214, 22, 2); lumignon(206, 14, 3); }
    }

    // ------------------------------------------------ la tombe fraîche : le jour, l'enterrement ; la nuit, le tertre et les couronnes
    const FG = { x: 160, y: 79 };
    {
      const { x, y } = FG;
      if (!night) {
        W.box(x, y + 1, -6, x + 5, y + 11, 2, 0);
        W.box(x - 1, y, -7, x + 6, y + 12, -6, M.SOIL);
        for (let yy = y + 1; yy < y + 11; yy++) for (let z = -6; z < 2; z++) { W.set(x - 1, yy, z, M.SOIL); W.set(x + 5, yy, z, M.SOIL); }
        for (let xx = x - 1; xx < x + 6; xx++) for (let z = -6; z < 2; z++) { W.set(xx, y, z, M.SOIL); W.set(xx, y + 11, z, M.SOIL); }
        W.box(x - 1, y + 3, 2, x + 6, y + 4, 3, M.WOOD); W.box(x - 1, y + 8, 2, x + 6, y + 9, 3, M.WOOD);
        W.box(x + 1, y + 2, 3, x + 4, y + 10, 5, M.WOOD_DARK); W.box(x + 1, y + 2, 5, x + 4, y + 10, 6, M.WOOD);
        W.set(x + 2, y + 4, 6, M.METAL); W.box(x + 2, y + 5, 6, x + 3, y + 8, 7, M.CIM_FLEURS, flowerTag);
        for (let k = 0; k < 6; k++) W.box(x + 6, y + 1 + k, 2, x + 12 - Math.abs(k - 3), y + 2 + k, 3 + (k > 0 && k < 5 ? 2 : 0), M.SOIL);
        W.box(x + 7, y + 2, 4, x + 10, y + 5, 6, M.SOIL);
        W.box(x + 12, y + 2, 2, x + 13, y + 3, 9, M.WOOD); W.box(x + 12, y + 6, 2, x + 13, y + 7, 7, M.METAL_DARK);
      } else {
        W.box(x, y + 2, 2, x + 5, y + 11, 3, M.SOIL); W.box(x + 1, y + 3, 3, x + 4, y + 10, 4, M.SOIL);
        W.box(x + 2, y + 1, 2, x + 3, y + 2, 9, M.WOOD); W.box(x + 1, y + 1, 7, x + 4, y + 2, 8, M.WOOD);
        lumignon(x + 2, y + 3, 4);
      }
      // les couronnes debout, sur leur chevalet
      const wreath = (cx, cy, z0) => { for (let a = 0; a < 14; a++) { const t = a / 14 * Math.PI * 2; W.set(Math.round(cx + Math.cos(t) * 1.6), cy, Math.round(z0 + 2 + Math.sin(t) * 1.6), a % 3 ? M.CIM_FLEURS : M.HEDGE, flowerTag); } W.box(cx, cy - 1, 2, cx + 1, cy, z0 + 1, M.METAL_DARK); };
      wreath(x + 8, y + 11, 3); wreath(x + 13, y + 10, 3); wreath(x - 3, y + 11, 3);
    }

    // ------------------------------------------------ la tombe saccagée (mauvaise saison) : stèle renversée, croix brisée, peinture
    const VT = VT0;
    if (bad && VT) {
      const { x, y, w } = VT;
      const SPR = S({ tint: [0.93, 0.97, 1.06], spray: 1, sprayNot: -1 });
      W.box(x, y, 3, x + w, y + 2, 30, 0);                                  // la stèle arrachée
      W.box(x, y, 3, x + w, y + 2, 5, M.STONE, SPR);                         // le moignon
      W.set(x + 1, y + 1, 5, M.STONE, SPR); W.set(x + 3, y, 5, M.STONE, SPR);
      W.box(x, y - 8, 2, x + w, y - 1, 3, M.STONE, SPR);                     // la stèle, tombée à la renverse dans l'allée
      W.box(x + w + 2, y - 11, 2, x + w + 3, y - 2, 3, M.STONE, SPR);        // une croix arrachée, couchée en travers
      W.box(x + w, y - 8, 2, x + w + 5, y - 7, 3, M.STONE, SPR);
      W.box(x + 1, y + 3, 4, x + w - 1, y + 9, 5, M.STONE, SPR);             // la dalle, barbouillée
      for (let i = 0; i < 12; i++) W.set(x - 3 + Math.floor(R() * (w + 8)), y - 10 + Math.floor(R() * 9), 2, i % 3 === 0 ? M.TERRACOTTA : M.CIM_FLEURS, i % 3 === 0 ? 0 : FADE);
    }

    // ------------------------------------------------ le point d'eau : la fontaine et les arrosoirs verts
    {
      const x = 237, y = 79;
      W.box(x, y, 2, x + 4, y + 3, 4, M.STONE, T_MID); W.box(x + 1, y + 1, 3, x + 3, y + 2, 4, 0);
      W.box(x + 1, y, 4, x + 2, y + 1, 10, M.METAL_GREEN); W.box(x + 1, y + 1, 9, x + 2, y + 2, 10, M.METAL_GREEN);
      W.box(x + 5, y, 2, x + 6, y + 1, 11, M.METAL_GREEN); W.box(x + 5, y, 10, x + 10, y + 1, 11, M.METAL_GREEN); W.box(x + 9, y, 2, x + 10, y + 1, 11, M.METAL_GREEN);
      for (const ax of [x + 6, x + 8]) { W.box(ax, y + 1, 7, ax + 1, y + 2, 9, M.METAL_GREEN); W.set(ax, y + 1, 9, M.METAL_DARK); }
    }
    B.bench(W, 60, 129, G, 'x');

    // ------------------------------------------------ le fleuriste du coin : « Aux Immortelles »
    {
      const x0 = 240, y0 = 112, w = 42, d = 34, H = 31;
      W.box(x0, y0, 2, x0 + w, y0 + d, 2 + H, M.PLASTER_CREAM);
      const fl = new Facade(W, LEFT, x0, y0, w, d), fr = new Facade(W, RIGHT, x0, y0, w, d);
      for (const f of [fl, fr]) { f.rect(0, 2, f.len, 20, 0, M.SHUTTER_GREEN); f.rect(0, 20, f.len, 21, -1, M.STONE); f.rect(0, 2 + H, f.len, 3 + H, -1, M.STONE); }
      const closed = bad;
      const vit = (f, s0, z0, ww, hh, kind, extra = {}) => {
        f.rect(s0, z0, s0 + ww, z0 + hh, 0, 0);
        const id = obj(Object.assign({ type: 'cim_vitrine', kind, face: f.face, a0: f.a0(s0), z0, w: ww, h: hh, k: night ? 1 : 0.8, fade: bad, seed: s0 }, extra));
        f.rect(s0, z0, s0 + ww, z0 + hh, 1, M.GLASS, id);
        f.rect(s0 - 1, z0 - 1, s0 + ww + 1, z0, -1, M.STONE);
        if (night && !closed) { const p = f.front(s0 + ww / 2, z0 + hh * 0.6, 3); W.light({ x: p.x, y: p.y, z: p.z, r: 34, cr: 0.80, cg: 0.58, cb: 0.32, skip: 2.5 }); }
      };
      if (closed) { fl.shop(4, 3, 20, 10, 'rideau'); fr.shop(6, 3, 18, 10, 'rideau'); }
      else { vit(fl, 4, 3, 20, 10, 'fleurs', { sil: night ? 22 : null }); vit(fr, 6, 3, 18, 10, 'couronnes'); }
      fl.door(27, 3, 5, 11, { kind: closed ? 'rideau' : 'door', frame: false });
      fl.window(35, 5, 4, 8, { state: 'dark', sill: false, lintel: false });
      fl.sign(5, 19, 'AUX IMMORTELLES', { fg: [0.90, 0.84, 0.66], depth: 0 });
      for (const s of [9, 21, 33]) { fl.set(s, 21, -1, M.METAL_DARK); fl.set(s, 21, -2, M.METAL_DARK); fl.set(s, 20, -2, night ? M.BULB : M.METAL_DARK); if (night) W.light(Object.assign(fl.front(s, 18, 3), { r: 14, cr: 0.7, cg: 0.5, cb: 0.26, skip: 1.5 })); }
      fl.awning(3, 22, 13, 4, M.AWNING_GREEN);
      fr.sign(9, 19, 'FLEURS', Object.assign({ depth: 0 }, night && !bad ? { fg: [1.0, 0.45, 0.68], emit: [1.25, 0.34, 0.62], light: { r: 34, c: [0.6, 0.16, 0.32] } } : { fg: [0.78, 0.42, 0.55] }));
      // l'étage : fenêtres à volets, géraniums, une lampe allumée
      const curtains = [[0.62, 0.30, 0.22], [0.55, 0.50, 0.32]];
      for (const s of [5, 16, 27, 36]) fl.window(s, 23, 5, 8, { state: night && (s === 16 || s === 36) ? 'lit' : 'dark', shutter: M.SHUTTER_GREEN, closed: !night && s === 27, curtain: curtains[s % 2], sil: night && s === 16 ? 'chignon' : null, silX: 6 });
      for (const s of [6, 18]) fr.window(s, 23, 5, 8, { state: night && s === 6 ? 'tv' : 'dark', shutter: M.SHUTTER_GREEN, seed: 2 });
      for (const s of [5, 16, 36]) { fl.rect(s, 22, s + 5, 23, -2, M.TERRACOTTA); fl.rect(s, 23, s + 5, 24, -2, M.CIM_FLEURS, flowerTag); }
      const top = B.mansard(W, x0, y0, w, d, 2 + H, 9);
      B.dormer(W, LEFT, x0, y0, w, d, x0 + 10, 3 + H, { state: 'dark' });
      B.dormer(W, LEFT, x0, y0, w, d, x0 + 26, 3 + H, { state: night ? 'lit' : 'dark', curtain: [0.6, 0.5, 0.3] });
      B.chimney(W, x0 + 6, y0 + 8, top, 6); B.chimney(W, x0 + 34, y0 + 6, top, 5); B.antenna(W, x0 + 20, y0 + 14, top, 11);
      W.box(x0 + 12, y0 + 18, top, x0 + 18, y0 + 23, top + 1, M.METAL); W.box(x0 + 13, y0 + 19, top + 1, x0 + 17, y0 + 22, top + 2, night ? M.SKYLIGHT : M.GLASS);
      // le jour, les chrysanthèmes sortent sur le trottoir
      if (!night) {
        for (let k = 0; k < 3; k++) { W.box(x0 + 4, y0 + d + 1 + k, 2, x0 + 24, y0 + d + 2 + k, 5 - k, M.WOOD); for (let s = 0; s < 10; s++) pot(x0 + 4 + s * 2, y0 + d + 1 + k, 5 - k, 1, 1); }
        for (let k = 0; k < 3; k++) pot(x0 + w + 1, y0 + 14 + k * 3, 2, 2, 2);
      }
    }
    // la cour de la marbrerie, derrière le fleuriste : on la devine par le portail ; le mur peint donne sur l'avenue
    {
      const x0 = 210, x1 = 240;
      W.box(x0, 112, 1, x1, 143, 2, M.GRAVEL);
      W.box(x0, 143, 2, x1, 146, 13, M.PLASTER_GREY, T_WALL); W.box(x0, 143, 13, x1, 146, 14, M.TERRACOTTA); W.box(x0, 144, 14, x1, 145, 15, M.TERRACOTTA);
      W.box(230, 143, 2, 238, 146, 15, 0);
      W.box(229, 143, 2, 230, 146, 16, M.STONE); W.box(238, 143, 2, 239, 146, 16, M.STONE);
      for (let x = 230; x < 238; x++) { W.set(x, 144, 3, M.METAL_DARK); W.set(x, 144, 12, M.METAL_DARK); if (x % 2 === 0) { W.box(x, 144, 3, x + 1, 145, 13, M.METAL_DARK); W.set(x, 144, 13, M.METAL); } }
      W.box(230, 143, 1, 238, 147, 2, M.GRAVEL);
      const wf = new Facade(W, LEFT, x0, 143, x1 - x0, 3);
      wf.sign(0, 12, 'MARBRERIE', { fg: [0.88, 0.86, 0.80], depth: 0, worn: 0.1 });
      wf.sign(3, 8, 'GRAVURE', { fg: [0.88, 0.86, 0.80], depth: 0, worn: 0.14 });
      let k = 0;
      for (const [sx, sy, sw] of [[213, 116, 5], [220, 116, 7], [229, 116, 5], [214, 128, 5], [222, 128, 5], [231, 134, 5], [231, 124, 5]]) {
        const tint = GRANITES[k++ % GRANITES.length], tg = tint ? S({ tint }) : 0;
        W.box(sx, sy, 2, sx + sw, sy + 3, 3, M.CIM_GRANITE, tg);
        W.box(sx, sy, 3, sx + sw, sy + 2, 9 + (k % 3), M.CIM_GRANITE, tg);
      }
      W.box(212, 112, 2, 222, 114, 8, M.WOOD_DARK); W.box(212, 112, 8, 222, 114, 9, M.ZINC);
      // deux modèles exposés sur le trottoir de la rue de l'Ouest
      for (const [sy, gi] of [[112, 2], [117, 3]]) {
        const tg = S({ tint: GRANITES[gi] });
        W.box(284, sy, 2, 287, sy + 4, 3, M.CIM_GRANITE, tg);
        W.box(284, sy, 3, 286, sy + 4, 9, M.CIM_GRANITE, tg); W.set(284, sy, 8, 0); W.set(285, sy, 8, 0);
      }
    }
    // ------------------------------------------------ le trottoir : réverbères, une borne, des feuilles
    const lampOn = night;
    B.streetLamp(W, 284, 50, G, 1, 0, { on: lampOn });
    B.streetLamp(W, 120, 148, G, 0, 1, { on: lampOn });
    B.streetLamp(W, 200, 148, G, 0, 1, { on: lampOn && !bad });
    for (const bx of [88, 108, 190]) B.bollard(W, bx, 150, G);
    W.stampLeaves(150, 150, 30, 0.35); W.stampLeaves(286, 100, 22, 0.3); W.stampLeaves(30, 150, 26, 0.4);
    W.stampLeaves(262, 60, 16, 0.25);

    // ------------------------------------------------ les gens
    const sp = (def, x, y, z, extra = {}) => W.sprite(Object.assign({ x, y, z }, def, extra));
    const VX = VT ? VT.x + 2 : 110;
    if (!night) {
      sp(GARDIEN, bad ? VX + 3 : 214, bad ? 75 : 72.5, G);
      sp(VEUVE, 44, 72, G);
      sp(SP.GEGE, 99.5, 66, G);
      sp(FLEURISTE, 268, 151, G);
      sp(DEUIL, 158, 75, G); sp(DEUIL2, 161.5, 74.5, G); sp(DEUIL3, 165, 75.5, G); sp(DEUIL2, 156.5, 84, G);
      if (!bad) { sp(DEUIL, 169, 75, G); sp(SP.COAT, 232, 152, G); }
      sp(SP.CAT, 6, 100, 17);
    } else {
      sp(SP.CAT, 280.5, 16, 14);
      if (bad && VT) {
        sp(GARDIEN, VX + 4, 75, G);
        const d = [-3, 9, -2.5]; const l = Math.hypot(...d);
        W.light({ x: VX + 4, y: 76, z: 6, r: 34, fall: 1.4, cr: 1.1, cg: 1.05, cb: 0.85, axis: [d[0] / l, d[1] / l, d[2] / l], c0: 0.82, c1: 0.95, spill: 0, skip: 1 });
      } else { sp(GARDIEN, 266, 57, G); sp(SP.FAN, 100.5, 66.5, G); }
    }

    return {
      places: [
        { key: 'cimetiere', label: "Le cimetière d'Aubérive", x: 282, y: 70, z: G + 26 },
        { key: 'caveau', label: 'Le caveau du Racing', x: CV.x + 14, y: CV.y + 17, z: G + 28 },
        { key: 'columbarium', label: 'Le mur des plaques', x: 214, y: 14, z: G + 18 },
        { key: 'loge', label: 'La loge du gardien', x: 267, y: 52, z: G + 16 },
        { key: 'fleuriste', label: 'Aux Immortelles, fleuriste', x: 269, y: 146, z: G + 18 },
      ],
    };
  },
};
