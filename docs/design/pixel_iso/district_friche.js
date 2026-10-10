'use strict';
// La friche de l'ancienne tréfilerie, entre l'avenue du Stade (nord) et le boulevard (sud), la rue de l'Ouest à l'est.
// Halles à sheds, cheminée de brique, voie de desserte, wagon, quai de chargement ; grillage percé, tags, vitres cassées.
// La nuit, un feu de palettes et deux silhouettes : c'est là que se règlent les choses qui ne se règlent pas au club.
// Les façades qui comptent regardent le sud (+y, le boulevard) et l'est (+x, la rue de l'Ouest).
const E = require('./engine');
const { M } = require('./mats');
const B = require('./build');
const SP = require('./sprites');
require('./diorama'); // herbes folles, boue, bâche, barrière (matières déjà comptées)
const { LEFT, RIGHT, TOP, hash, vnoise, fbm, mod, clamp, material, overlay, textBitmap } = E;
const { Facade } = B;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const along = c => c.face === LEFT ? c.hx : c.hy;

// ---------------------------------------------------------------- quatre matières
M.FRI_ROUILLE = M.FRI_ROUILLE || material('rouille', c => {
  const n = fbm(c.hx * 0.35 + c.hz * 0.2, c.hy * 0.35 - c.hz * 0.25, 801, 3);
  const h = hash(c.a, c.b, 802, c.face);
  if (n < 0.44) rgb(c, 0.29, 0.15, 0.09); else if (n < 0.62) rgb(c, 0.47, 0.23, 0.11); else rgb(c, 0.34, 0.29, 0.26);
  if (h < 0.15) mul(c, 0.72); else if (h > 0.93) mul(c, 1.3);
  if (c.face !== TOP && vnoise(along(c) * 1.3, c.hz * 0.12, 803) > 0.68) mul(c, 0.78);
});
M.FRI_TOLE = M.FRI_TOLE || material('tôle ondulée', c => {
  const ph = mod(c.a, 3);
  const n = fbm(c.hx * 0.22, c.hy * 0.22 + c.hz * 0.3, 811, 3);
  let r = 0.40, g = 0.42, b = 0.43;
  if (n > 0.56) { const t = clamp((n - 0.56) * 4, 0, 1); r += (0.44 - r) * t; g += (0.22 - g) * t; b += (0.12 - b) * t; }
  rgb(c, r, g, b);
  mul(c, ph === 0 ? 1.16 : ph === 1 ? 0.97 : 0.76);
  if (c.face !== TOP) mul(c, 0.88);
  if (hash(c.a, c.b, 812, c.face) < 0.06) mul(c, 0.8);
});
M.FRI_FLAMME = M.FRI_FLAMME || material('flammes', c => {
  const z = c.hz, h = hash(c.a, c.b, 821, c.face);
  let e;
  if (z < 5.5) e = [1.75, 1.18, 0.48]; else if (z < 8.5) e = [1.6, 0.74, 0.20]; else if (z < 11) e = [1.25, 0.38, 0.08]; else e = [0.85, 0.18, 0.05];
  const k = 0.72 + 0.56 * h;
  rgb(c, 0.9, 0.5, 0.2); c.er = e[0] * k; c.eg = e[1] * k; c.eb = e[2] * k;
}, { noShadow: true, noAO: true, noAOrecv: true });
M.FRI_CENDRE = M.FRI_CENDRE || material('cendres', c => {
  const h = hash(c.a, c.b, 831, c.face);
  const k = 0.15 + 0.12 * fbm(c.hx * 0.8, c.hy * 0.8, 832, 2);
  rgb(c, k, k * 0.97, k * 0.95);
  if (h < 0.12) rgb(c, 0.44, 0.42, 0.39); else if (h > 0.9) rgb(c, 0.05, 0.045, 0.045);
});

// ---------------------------------------------------------------- calques
// patine : teinte, suie, mousse, braises, parpaings, écorce de bouleau
function fsurf(o, c) {
  if (o.col) rgb(c, o.col[0], o.col[1], o.col[2]);
  if (o.tint) { c.cr *= o.tint[0]; c.cg *= o.tint[1]; c.cb *= o.tint[2]; }
  if (o.blocks && c.face !== TOP) {
    const course = Math.floor(c.b / 2), off = (course & 1) * 2;
    const k = 0.46 + 0.06 * hash(Math.floor((c.a + off) / 4), course, 841, c.face);
    rgb(c, k, k * 0.99, k * 0.96);
    if (mod(c.b, 2) === 0 || mod(c.a + off, 4) === 0) mul(c, 0.7);
  }
  if (o.soot) {
    const n = fbm(c.hx * 0.3 + c.hz * 0.2, c.hy * 0.3 - c.hz * 0.1, 851 + (o.seed || 0), 3);
    const s = o.soot * (o.sootZ != null ? clamp((c.hz - o.sootZ) / 12, 0, 1) : 1);
    if (n < s) mul(c, 0.18 + 0.6 * (n / Math.max(0.01, s)) * (n / Math.max(0.01, s)));
  }
  if (o.moss) {
    const n = fbm(c.hx * 0.5 + c.hz * 0.3, c.hy * 0.5, 855 + (o.seed || 0), 3) + (c.face === TOP ? 0.12 : 0);
    if (n > 1 - o.moss * 0.42) { const g = hash(c.a, c.b, 856, c.face); if (g < 0.6) rgb(c, 0.22, 0.28, 0.13); else rgb(c, 0.33, 0.38, 0.18); }
  }
  if (o.embers) {
    const h = hash(c.a, c.b, 852, c.face);
    if (h < 0.22 * o.embers) { const k = 0.6 + 0.9 * hash(c.a, c.b, 853, 0); rgb(c, 0.5, 0.15, 0.05); c.er = 1.3 * k; c.eg = 0.36 * k; c.eb = 0.06 * k; }
  }
  if (o.birch && c.face !== TOP) { rgb(c, 0.80, 0.78, 0.72); if (hash(Math.floor(c.b / 2), 0, 854, c.ix) < 0.3) rgb(c, 0.12, 0.11, 0.10); }
}
overlay('fri_surf', fsurf);
// vitres d'usine : petits carreaux, cadres rouillés, carreaux crevés ou condamnés
overlay('fri_vitres', (o, c) => {
  if (c.face === TOP) { rgb(c, 0.16, 0.12, 0.09); return; }
  const la = c.face === LEFT ? Math.floor(2 * c.hx) : -Math.floor(2 * c.hy), lb = Math.floor(2 * c.hz);
  const P = o.pane || 3;
  if (mod(la, P + 1) === 0 || mod(lb, P + 1) === 0) { rgb(c, 0.22, 0.13, 0.08); return; }
  const pa = Math.floor(la / (P + 1)), pb = Math.floor(lb / (P + 1));
  const h = hash(pa, pb, 861, o.seed || 0);
  if (h < o.broken) { rgb(c, 0.015, 0.015, 0.018); if (hash(la, lb, 862, 0) < 0.22) rgb(c, 0.24, 0.26, 0.28); }
  else if (h < o.broken + (o.boarded || 0)) { rgb(c, 0.36, 0.26, 0.16); if (mod(lb, 2) === 0) mul(c, 0.78); }
  else { rgb(c, 0.11, 0.12, 0.12); if (mod(la - lb, 6) < 1) rgb(c, 0.24, 0.26, 0.27); const d = fbm(la / 5, lb / 5, 863, 2); if (d > 0.6) mul(c, 1.5); }
});
// graffitis : tag (trait), « throw-up » (lettres gonflées, contour, ombre), pochoir ; coulures
function tagGrid(o) {
  const bmp = textBitmap(o.text), s = o.scale || 1, pad = o.style === 'throw' ? 3 : 1;
  const GW = bmp.w * s + 2 * pad, GH = bmp.h * s + 2 * pad + 6;
  const g = new Uint8Array(GW * GH);
  const on = (x, y) => x >= 0 && y >= 0 && x < GW && y < GH && g[y * GW + x] === 1;
  for (let y = 0; y < bmp.h * s; y++) for (let x = 0; x < bmp.w * s; x++) {
    const wob = o.wob ? Math.round(Math.sin((x / s) * 0.9 + (o.seed || 0)) * o.wob) : 0;
    if (bmp.at(Math.floor(x / s), Math.floor(y / s))) { const yy = y + pad + wob; if (yy >= 0 && yy < GH) g[yy * GW + x + pad] = 1; }
  }
  if (o.style === 'throw') {
    const fill = new Uint8Array(g);
    for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) if (!fill[y * GW + x]) { // contour
      let near = false; for (let dy = -1; dy <= 1 && !near; dy++) for (let dx = -1; dx <= 1; dx++) if (fill[(y + dy) * GW + x + dx] === 1 && x + dx >= 0 && x + dx < GW) { near = true; break; }
      if (near) g[y * GW + x] = 2;
    }
    for (let y = GH - 1; y >= 1; y--) for (let x = GW - 1; x >= 1; x--) if (!g[y * GW + x] && g[(y - 1) * GW + x - 1] === 2) g[y * GW + x] = 3; // ombre portée
  }
  if (o.drip) for (let x = 0; x < GW; x++) { let low = -1; for (let y = 0; y < GH; y++) if (g[y * GW + x] === 1 || g[y * GW + x] === 2) low = y; if (low >= 0 && hash(x, 0, 871, o.seed || 0) < o.drip) { const len = 1 + Math.floor(hash(x, 1, 871, o.seed || 0) * 4); for (let y = low + 1; y <= Math.min(GH - 1, low + len); y++) if (!g[y * GW + x]) g[y * GW + x] = 4; } }
  return { g, GW, GH };
}
overlay('fri_tag', (o, c) => {
  if (c.face !== o.face) return;
  const la = o.face === LEFT ? Math.floor(2 * c.hx) - 2 * o.a0 : 2 * o.a0 - 1 - Math.floor(2 * c.hy);
  const lt = 2 * o.zTop - 1 - Math.floor(2 * c.hz);
  if (o.under) fsurf(o.under, c);
  if (!o.grid) o.grid = tagGrid(o);
  const { g, GW, GH } = o.grid;
  if (la < 0 || lt < 0 || la >= GW || lt >= GH) return;
  const v = g[lt * GW + la];
  if (!v) return;
  if (o.worn && hash(la, lt, 872, o.seed || 0) < o.worn) return;
  const col = v === 1 ? o.fill : v === 2 ? (o.line || o.fill) : v === 3 ? (o.shade || [0.08, 0.08, 0.09]) : (v === 4 ? (o.style === 'throw' ? (o.line || o.fill) : o.fill) : o.fill);
  rgb(c, col[0], col[1], col[2]);
  if (v === 1 && o.style === 'throw' && o.fill2 && (lt % 4 < 2)) rgb(c, o.fill2[0], o.fill2[1], o.fill2[2]);
});
// le néon de la tréfilerie : des lettres mortes, deux qui grésillent encore
overlay('fri_neon', (o, c) => {
  if (c.face !== o.face) return;
  const la = o.face === LEFT ? Math.floor(2 * c.hx) - 2 * o.a0 : 2 * o.a0 - 1 - Math.floor(2 * c.hy);
  const lt = 2 * o.zTop - 1 - Math.floor(2 * c.hz);
  if (!o.lay) {
    o.lay = []; let x = 0;
    [...o.text].forEach(ch => { if (ch === ' ') { x += 3; return; } const b = textBitmap(ch); o.lay.push({ x, b }); x += b.w + 1; });
  }
  if (lt < 0 || lt > 5) return;
  for (let i = 0; i < o.lay.length; i++) {
    const L = o.lay[i];
    if (la < L.x || la >= L.x + L.b.w) continue;
    if (!L.b.at(la - L.x, lt)) return;
    const st = o.states[i] || 'dead';
    if (st === 'gone' || (st === 'broken' && hash(la, lt, 881, i) < 0.5)) { rgb(c, 0.10, 0.10, 0.11); return; }
    if (st === 'lit' && o.on) { rgb(c, 1.0, 0.45, 0.68); c.er = 1.3; c.eg = 0.34; c.eb = 0.64; return; }
    if (st === 'dim' && o.on) { const k = 0.35 + 0.4 * hash(la, lt, 882, i); rgb(c, 0.8, 0.4, 0.55); c.er = 1.25 * k; c.eg = 0.32 * k; c.eb = 0.6 * k; return; }
    rgb(c, 0.46, 0.40, 0.42); if (hash(la, lt, 883, i) < 0.3) mul(c, 0.7);
    return;
  }
});

// ---------------------------------------------------------------- personnages de la friche
const K = [0.06, 0.045, 0.04];
const BASE = {
  k: K, s: [0.86, 0.69, 0.55], S: [0.66, 0.48, 0.37], h: [0.17, 0.11, 0.08], H: [0.30, 0.20, 0.13],
  o: [0.09, 0.09, 0.09], j: [0.24, 0.30, 0.42], J: [0.16, 0.20, 0.30], g: [0.46, 0.46, 0.45], G: [0.32, 0.32, 0.32],
};
const pal = extra => Object.assign({}, BASE, extra);
// la capuche : sweat sombre, mains dans les poches, la cigarette qui rougeoie
const CAPUCHE = {
  rows: [
    '...kkkk...',
    '..kqqqqk..',
    '.kqqqqqqk.',
    '.kqSssqqk.',
    '.kqkSkqqk.',
    '.kqSSeqqk.',
    '..kqqqqk..',
    '.kqqqqqqk.',
    'kqqqqqqqqk',
    'kqqqQQqqqk',
    'kqqQqqQqqk',
    'kqqqqqqqqk',
    '.kqqqqqqk.',
    '.kjjjjjjk.',
    '.kjjkkjjk.',
    '.kjjk.jjk.',
    '.kjjk.jjk.',
    '.kook.ook.',
    '..kk...kk.',
  ],
  pal: pal({ q: [0.20, 0.21, 0.24], Q: [0.13, 0.14, 0.16], e: [1.0, 0.5, 0.2] }), emit: { e: [1.4, 0.45, 0.1] }, ax: 4,
};
// le blouson : bombers, l'écharpe bordeaux et grise, les mains tendues vers le feu
const BLOUSON = {
  rows: [
    '...kkkk....',
    '..khhhhk...',
    '..khhhhk...',
    '..ksssskk..',
    '..kskssk...',
    '..ksSSsk...',
    '..kmMmMk...',
    '.kbmMmMbk..',
    'kbbbmbbbbk.',
    'kbbbmbbbbsk',
    'kbbbbbbbbsk',
    'kbbbbbbbk..',
    '.kbbbbbbk..',
    '.kjjjjjjk..',
    '.kjjkkjjk..',
    '.kjjk.jjk..',
    '.kjjk.jjk..',
    '.kook.ook..',
    '..kk...kk..',
  ],
  pal: pal({ b: [0.18, 0.22, 0.17], m: [0.44, 0.12, 0.17], M: [0.60, 0.60, 0.58], h: [0.12, 0.09, 0.07] }), ax: 4,
};
// assis sur le bidon, la capuche relevée
const ASSIS = Object.assign({}, SP.FAN_SIT, { pal: pal({ c: [0.26, 0.24, 0.22], m: [0.44, 0.12, 0.17], M: [0.60, 0.60, 0.58], h: [0.20, 0.21, 0.24] }) });
const MEUTE = Object.assign({}, SP.FAN, { pal: Object.assign({}, SP.FAN.pal, { g: [0.17, 0.17, 0.19], G: [0.11, 0.11, 0.13], h: [0.10, 0.08, 0.06] }) });
// le chien du promeneur
const CHIEN = {
  rows: [
    '.......kk.',
    'k.....kddk',
    'kk....kdkd',
    '.kkkkkkddk',
    '.kdddddkk.',
    '.kdkkkdk..',
    '.kk...kk..',
  ],
  pal: pal({ d: [0.42, 0.30, 0.18] }), ax: 5, shadowR: 4,
};

// ---------------------------------------------------------------- le quartier
module.exports = {
  w: 292, h: 132, seed: 1983,
  build(W, ctx) {
    const { G, night, R } = ctx;
    const bad = ctx.mood === 'bad';
    const WW = 292, HH = 132;
    const obj = o => W.obj(o);
    const S = o => obj(Object.assign({ type: 'fri_surf' }, o));
    const T_BRICK = S({ moss: 0.25, seed: 1 });
    const T_MOSS = S({ moss: 0.7, seed: 3 });
    const T_WAGON = S({ tint: [1.25, 0.62, 0.50] });
    const T_PALE = S({ tint: [1.25, 1.22, 1.15] });
    const T_BALLAST = S({ tint: [0.86, 0.95, 1.18] });
    const T_BURNT = S({ soot: 0.85, seed: 4 });
    const T_BLOCKS = S({ blocks: 1 });
    const T_GROUND_SOOT = S({ soot: 0.95, seed: 5 });
    const tag = (f, s0, zTop, text, o) => {
      const id = obj(Object.assign({ type: 'fri_tag', face: f.face, a0: f.a0(s0), zTop, text, seed: s0 }, o));
      const g = tagGrid(Object.assign({ text }, o));
      const nw = Math.ceil(g.GW / 2) + 1, nh = Math.ceil(g.GH / 2) + 1;
      const me = W.objects[id];
      for (let s = s0; s < s0 + nw; s++) for (let z = zTop - nh; z < zTop; z++) {
        const [x, y] = f.xy(s, o.depth || 0); if (!W.get(x, y, z)) continue;
        const k = W.idx(x, y, z), cur = W.tag[k];
        if (!cur || W.objects[cur].type === 'fri_surf') { if (cur && !me.under) me.under = W.objects[cur]; W.tag[k] = id; }
      }
      return id;
    };
    const SPRAY = { red: [0.72, 0.12, 0.12], white: [0.86, 0.85, 0.80], black: [0.07, 0.07, 0.08], teal: [0.18, 0.55, 0.52], yellow: [0.86, 0.72, 0.18], bord: [0.46, 0.12, 0.18], grey: [0.62, 0.62, 0.60], blue: [0.22, 0.32, 0.62] };

    // ------------------------------------------------ le sol : béton fendu, enrobé, boue, herbes folles
    for (let y = 11; y < 120; y++) for (let x = 0; x < 279; x++) {
      const n = fbm(x / 13, y / 11, 901), m = fbm(x / 7 + 40, y / 7, 902);
      let mat = M.CONCRETE;
      if (x > 196 && y > 62 && y < 96) mat = M.ASPHALT;
      if (m > 0.66) mat = M.MUD; else if (n > 0.7) mat = M.SOIL;
      W.set(x, y, 1, mat);
      if ((n > 0.6 || m > 0.6) && hash(x, y, 903, 0) < (mat === M.ASPHALT ? 0.18 : 0.32)) W.set(x, y, 2, M.WEED);
    }
    // fissures du béton
    for (let i = 0; i < 26; i++) { let x = Math.floor(R() * 270), y = 12 + Math.floor(R() * 104); const dx = R() < 0.5 ? 1 : -1; for (let k = 0; k < 18; k++) { W.set(x, y, 1, M.GUTTER); if (R() < 0.5) W.set(x, y, 2, M.WEED); x += R() < 0.6 ? dx : 0; y += R() < 0.7 ? 1 : 0; if (x < 0 || x >= 279 || y >= 119) break; } }

    // ------------------------------------------------ les murs d'enceinte : brique au nord et à l'est, grillage au sud
    W.box(0, 8, 2, 282, 11, 15, M.BRICK_OLD, T_BRICK); W.box(0, 8, 15, 282, 11, 16, M.STONE);
    for (let x = 6; x < 282; x += 16) W.box(x, 8, 2, x + 2, 12, 17, M.BRICK_OLD);
    // l'ancien portail sur l'avenue, condamné
    W.box(120, 8, 2, 140, 11, 15, 0);
    W.box(117, 7, 2, 121, 12, 20, M.BRICK_OLD); W.box(139, 7, 2, 143, 12, 20, M.BRICK_OLD);
    W.box(116, 6, 20, 122, 13, 21, M.STONE); W.box(138, 6, 20, 144, 13, 21, M.STONE);
    for (let x = 121; x < 139; x++) { W.set(x, 9, 3, M.FRI_ROUILLE); W.set(x, 9, 13, M.FRI_ROUILLE); if (x % 2) W.box(x, 9, 3, x + 1, 10, 15, M.FRI_ROUILLE); }
    // le mur est, sur la rue de l'Ouest (une brèche, un portail roulant)
    W.box(279, 11, 2, 282, 120, 14, M.BRICK_OLD, T_BRICK); W.box(279, 11, 14, 282, 120, 15, M.STONE);
    for (let y = 11; y < 120; y += 14) W.box(278, y, 2, 282, y + 2, 16, M.BRICK_OLD);
    // la brèche : le mur effondré, des briques jusque sur le trottoir
    W.box(279, 34, 2, 282, 46, 16, 0); W.box(278, 34, 2, 282, 46, 16, 0);
    for (let y = 34; y < 46; y++) { const hgt = 2 + Math.floor(3 * Math.sin((y - 34) / 12 * Math.PI) + R() * 2); W.box(279, y, 2, 282, y + 1, hgt, M.BRICK_OLD, T_BRICK); }
    for (let i = 0; i < 40; i++) { const x = 272 + Math.floor(R() * 17), y = 31 + Math.floor(R() * 18), z = 2 + Math.floor(R() * 2), r1 = R(), r2 = R(); if (x !== 281 || r1 < 0.5) W.set(x, y, z, r2 < 0.7 ? M.BRICK_OLD : M.CONCRETE); }
    // le portail roulant, fermé à la chaîne
    W.box(279, 70, 2, 282, 92, 15, 0);
    for (let y = 70; y < 92; y++) { W.set(280, y, 3, M.FRI_ROUILLE); W.set(280, y, 8, M.FRI_ROUILLE); W.set(280, y, 13, M.FRI_ROUILLE); if (y % 2 === 0) W.box(280, y, 3, 281, y + 1, 14, M.FRI_ROUILLE); W.set(280, y, 2, M.METAL_DARK); }
    W.box(278, 68, 2, 282, 70, 18, M.CONCRETE); W.box(278, 92, 2, 282, 94, 18, M.CONCRETE);
    W.box(281, 78, 5, 282, 84, 6, M.METAL); W.set(281, 80, 4, M.METAL); W.set(281, 81, 4, M.METAL_DARK);
    { // DÉFENSE D'ENTRER, peint sur une plaque vissée à la grille
      const f = new Facade(W, RIGHT, 281, 72, 1, 18);
      f.sign(1, 15, 'DÉFENSE', { plate: [0.82, 0.80, 0.74], plateMat: M.PLASTIC_WHITE, fg: [0.62, 0.10, 0.10], depth: 0, padX: 1, padY: 1, worn: 0.08 });
      f.sign(1, 11, "D'ENTRER", { plate: [0.82, 0.80, 0.74], plateMat: M.PLASTIC_WHITE, fg: [0.62, 0.10, 0.10], depth: 0, padX: 1, padY: 1, worn: 0.08 });
    }
    // le grillage du boulevard : poteaux, maille, barbelés, et le trou
    const HOLE0 = 222, HOLE1 = 236;
    W.box(0, 119, 1, 279, 121, 3, M.CONCRETE);
    for (let x = 0; x < 279; x++) {
      const post = x % 12 === 0;
      if (post) { W.box(x, 119, 3, x + 1, 120, 14, M.METAL_DARK); W.set(x, 120, 14, M.METAL_DARK); W.set(x, 121, 15, M.METAL_DARK); continue; }
      for (let z = 3; z < 13; z++) {
        const inHole = x >= HOLE0 && x < HOLE1 && z < 3 + 10 - Math.abs(x - (HOLE0 + HOLE1) / 2) * 0.55;
        if (inHole) continue;
        if (mod(x + z, 6) === 0 || mod(x - z, 6) === 0) W.set(x, 119, z, M.METAL);
      }
      W.set(x, 119, 13, M.METAL); W.set(x, 120, 14, (x % 3) ? M.METAL_DARK : 0); W.set(x, 121, 15, (x % 3 !== 1) ? M.METAL_DARK : 0);
    }
    // la maille arrachée, rabattue vers le trottoir
    for (let z = 3; z < 11; z++) for (let k = 0; k < 4; k++) { // la maille découpée, roulée vers le trottoir
      if ((z + k) % 2) { W.set(HOLE0 + k, 120 + (k >> 1), z + (k > 1 ? 0 : 1), M.METAL); W.set(HOLE1 - 1 - k, 120 + (k >> 1), z, M.METAL); }
    }
    W.box(HOLE0, 119, 1, HOLE1, 123, 2, M.MUD); W.box(HOLE0 + 1, 119, 2, HOLE1 - 1, 121, 3, 0);
    { const f = new Facade(W, LEFT, 196, 119, 14, 1); f.sign(0, 14, 'DANGER', { plate: [0.80, 0.66, 0.16], plateMat: M.FLAG, fg: [0.08, 0.08, 0.08], depth: 0, padX: 1, padY: 1, worn: 0.1 }); }

    // ------------------------------------------------ la grande halle à sheds
    const A = { x0: 8, x1: 150, y0: 16, y1: 72, zw: 26, teeth: 4, rise: 10 };
    {
      const { x0, x1, y0, y1, zw } = A, td = (y1 - y0) / A.teeth;
      W.box(x0, y0, 2, x1, y1, zw, M.BRICK_OLD, T_BRICK);
      W.box(x0 + 2, y0 + 2, 2, x1 - 2, y1 - 2, zw, 0);                 // l'intérieur, vide
      W.box(x0 + 2, y0 + 2, 1, x1 - 2, y1 - 2, 2, M.CONCRETE);
      const zt = y => { const k = Math.floor((y - y0) / td), j = (y - y0) - k * td; return zw + Math.round(A.rise * (j + 1) / td); };
      const vit = obj({ type: 'fri_vitres', broken: 0.42, boarded: 0.05, seed: 1, pane: 3 });
      for (let y = y0; y < y1; y++) {
        const top = zt(y), k = Math.floor((y - y0) / td), j = (y - y0) - k * td;
        const lastRow = j >= td - 1;
        for (let x = x0; x < x1; x++) {
          const hole = fbm(x / 9, y / 7, 911) > 0.66;
          if (!hole || x === x0 || x === x1 - 1) W.set(x, y, top - 1, M.FRI_TOLE, fbm(x / 11 + 7, y / 6, 912) > 0.64 ? T_MOSS : 0);
          else if (x % 4 === 0) W.set(x, y, top - 2, M.METAL_DARK);
        }
        // les pignons suivent les dents de scie
        W.box(x0, y, zw, x0 + 2, y + 1, top - 1, M.BRICK_OLD, T_BRICK); W.box(x1 - 2, y, zw, x1, y + 1, top - 1, M.BRICK_OLD, T_BRICK);
        if (lastRow) { // le vitrage des sheds, plein sud
          for (let x = x0 + 2; x < x1 - 2; x++) for (let z = zw; z < top - 1; z++) W.set(x, y, z, x % 12 === 0 ? M.METAL_DARK : M.GLASS, x % 12 === 0 ? 0 : vit);
        }
      }
      // fermes métalliques sous le toit, visibles par les trous
      for (let k = 0; k < A.teeth; k++) { const yy = Math.round(y0 + (k + 1) * td) - 2; for (let x = x0 + 2; x < x1 - 2; x++) W.set(x, yy, zw, M.METAL_DARK); }
      const fs = new Facade(W, LEFT, x0, y0, x1 - x0, y1 - y0), fe = new Facade(W, RIGHT, x0, y0, x1 - x0, y1 - y0);
      // façade sud : pilastres, hautes fenêtres cintrées, portes de quai
      for (let s = 0; s <= x1 - x0 - 2; s += 12) fs.rect(s, 2, s + 2, zw, -1, M.BRICK_OLD, T_BRICK);
      fs.rect(0, zw - 2, x1 - x0, zw, -1, M.BRICK_OLD, T_BRICK);
      const doors = [[26, 'shut'], [62, 'half'], [98, 'open']];
      const winOf = obj({ type: 'fri_vitres', broken: 0.5, boarded: 0.12, seed: 2, pane: 3 });
      for (let s = 4, i = 0; s + 6 < x1 - x0; s += 12, i++) {
        if (doors.some(([ds]) => s >= ds - 2 && s < ds + 10)) continue;
        const walled = i % 5 === 3;
        const z0 = 11, hgt = 12;
        for (let ss = s; ss < s + 6; ss++) for (let z = z0; z < z0 + hgt; z++) {
          const arch = z >= z0 + hgt - 1 && (ss === s || ss === s + 5);
          if (arch) continue;
          fs.set(ss, z, 0, walled ? M.CONCRETE : M.GLASS, walled ? T_BLOCKS : winOf);
        }
        fs.rect(s - 1, z0 - 1, s + 7, z0, -1, M.STONE);
        for (let ss = s; ss < s + 6; ss++) fs.set(ss, z0 + hgt, -1, (ss === s || ss === s + 5) ? M.BRICK_OLD : M.STONE);
      }
      // portes de quai : rideaux métalliques (un ouvert, un à moitié, un crevé)
      for (const [s, st] of doors) {
        for (let ss = s; ss < s + 10; ss++) for (let z = 7; z < 20; z++) for (let dp = 0; dp < 3; dp++) fs.set(ss, z, dp, 0);
        for (let ss = s; ss < s + 10; ss++) for (let z = 7; z < 20; z++) {
          if (st === 'open') continue;
          if (st === 'half' && z < 14) continue;
          if (st === 'shut' && ss > s + 5 && z < 12 && z > 8 - (ss - s - 6)) continue; // un coin du rideau arraché
          fs.set(ss, z, 1, M.SHUTTER_GREY);
        }
        fs.rect(s - 1, 7, s, 21, 0, M.CONCRETE); fs.rect(s + 10, 7, s + 11, 21, 0, M.CONCRETE); fs.rect(s - 1, 20, s + 11, 21, 0, M.CONCRETE);
      }
      // le pignon est : grande porte coulissante, le numéro peint de l'atelier
      fe.rect(14, 2, 30, 20, 0, 0); fe.rect(14, 2, 30, 20, 1, 0);
      fe.rect(22, 2, 38, 20, -1, M.FRI_ROUILLE);
      fe.rect(13, 20, 39, 21, -1, M.METAL_DARK);
      fe.sign(4, 26, 'ATELIER 3', { scale: 2, fg: [0.78, 0.76, 0.70], depth: 0, worn: 0.3 });
      fe.window(41, 8, 6, 9, { state: 'dark', sill: true });
      tag(fe, 2, 9, 'ZONE', { style: 'tag', fill: SPRAY.black, scale: 1, wob: 1 });
      // le quai de chargement, le long de la façade sud
      const DQ = { x0: 24, x1: 140, y0: 72, y1: 81 };
      W.box(DQ.x0, DQ.y0, 2, DQ.x1, DQ.y1, 7, M.CONCRETE, T_MOSS);
      W.box(DQ.x0, DQ.y1 - 1, 6, DQ.x1, DQ.y1, 7, M.METAL);
      for (let x = DQ.x0 + 4; x < DQ.x1; x += 10) W.box(x, DQ.y1, 3, x + 2, DQ.y1 + 1, 6, M.TIRE);
      for (let k = 0; k < 5; k++) W.box(DQ.x1 + k, DQ.y0, 2, DQ.x1 + k + 1, DQ.y1, 6 - k, M.CONCRETE);
      for (let k = 0; k < 4; k++) W.box(DQ.x0 - 4 + k, DQ.y0 + 2, 2, DQ.x0 - 3 + k, DQ.y0 + 7, 3 + k, M.CONCRETE);
      // le vieux chariot élévateur, les palettes, les fûts
      { const fx = 44, fy = 74; W.box(fx, fy, 7, fx + 7, fy + 5, 11, M.FRI_ROUILLE); W.box(fx + 1, fy + 1, 11, fx + 5, fy + 4, 12, M.METAL_DARK); W.box(fx + 7, fy, 7, fx + 8, fy + 1, 20, M.METAL_DARK); W.box(fx + 7, fy + 4, 7, fx + 8, fy + 5, 20, M.METAL_DARK); W.box(fx + 8, fy + 1, 7, fx + 12, fy + 2, 8, M.METAL_DARK); W.box(fx + 8, fy + 3, 7, fx + 12, fy + 4, 8, M.METAL_DARK); W.box(fx + 1, fy, 12, fx + 2, fy + 5, 17, M.METAL_DARK); W.box(fx + 1, fy, 17, fx + 7, fy + 5, 18, M.METAL_DARK); W.box(fx - 1, fy + 1, 7, fx, fy + 4, 10, M.METAL_DARK); }
      for (let k = 0; k < 3; k++) for (let i = 0; i < 5; i++) if ((i + k) % 2 === 0 || i === 0 || i === 4) W.box(118 + i, 74, 7 + k, 119 + i, 79, 8 + k, M.WOOD);
      for (const [bx, by] of [[128, 74], [131, 75], [128, 77]]) W.box(bx, by, 7, bx + 2, by + 2, 11, M.FRI_ROUILLE);
    }

    // ------------------------------------------------ la cheminée de brique et la chaufferie
    const CH = { x: 166, y: 30 };
    {
      const { x: cx, y: cy } = CH;
      W.box(cx - 7, cy - 7, 2, cx + 7, cy + 7, 16, M.BRICK_OLD, T_BRICK);
      W.box(cx - 8, cy - 8, 16, cx + 8, cy + 8, 17, M.STONE); W.box(cx - 7, cy - 7, 17, cx + 7, cy + 7, 18, M.BRICK_OLD);
      const TOP_Z = 95;
      const SOOT = S({ soot: 0.9, sootZ: 74, seed: 6 });
      for (let z = 18; z < TOP_Z; z++) {
        const t = (z - 18) / (TOP_Z - 18);
        let r = 5.6 - 2.1 * t;
        const band = (z - 18) % 16 === 12;
        const crown = z >= TOP_Z - 6 && z < TOP_Z - 2;
        if (crown) r += z === TOP_Z - 5 ? 0.6 : 1.0;
        for (let y = cy - 8; y <= cy + 8; y++) for (let x = cx - 8; x <= cx + 8; x++) {
          const d = Math.hypot(x - cx + 0.5, y - cy + 0.5);
          if (d < r && d > r - 1.8) W.set(x, y, z, band ? M.METAL_DARK : M.BRICK_OLD, band ? 0 : SOOT);
          else if (band && d < r + 0.7 && d >= r) W.set(x, y, z, M.METAL_DARK);
        }
      }
      for (let y = cy - 4; y <= cy + 4; y++) for (let x = cx - 4; x <= cx + 4; x++) if (Math.hypot(x - cx + 0.5, y - cy + 0.5) < 3.4) W.set(x, y, TOP_Z - 1, 0);
      W.box(cx + 4, cy - 1, TOP_Z - 2, cx + 5, cy, 99, M.METAL_DARK);         // le paratonnerre
      for (let z = 20; z < TOP_Z - 6; z += 2) W.set(cx + Math.round(5.6 - 2.1 * (z - 18) / (TOP_Z - 18)), cy, z, M.METAL_DARK); // les échelons
      // le lierre qui monte au pied
      for (let z = 2; z < 30; z++) for (let y = cy - 8; y <= cy + 8; y++) for (let x = cx - 8; x <= cx + 8; x++) {
        if (W.get(x, y, z) || fbm(x / 3 + z / 9, y / 3, 921) < 0.62 - z * 0.004) continue;
        if (W.get(x - 1, y, z) || W.get(x, y - 1, z) || W.get(x + 1, y, z) || W.get(x, y + 1, z)) W.set(x, y, z, M.HEDGE);
      }
      // la chaufferie, son toit plat, sa porte
      const bx0 = 152, by0 = 40, bx1 = 182, by1 = 66;
      W.box(bx0, by0, 2, bx1, by1, 22, M.BRICK, T_BRICK);
      B.flatRoof(W, bx0, by0, bx1 - bx0, by1 - by0, 22, M.BRICK);
      const cf = new Facade(W, LEFT, bx0, by0, bx1 - bx0, by1 - by0), cr = new Facade(W, RIGHT, bx0, by0, bx1 - bx0, by1 - by0);
      const vb = obj({ type: 'fri_vitres', broken: 0.6, boarded: 0.1, seed: 3, pane: 2 });
      for (const s of [3, 21]) { cf.rect(s, 8, s + 6, 17, 0, M.GLASS, vb); cf.rect(s - 1, 7, s + 7, 8, -1, M.STONE); cf.rect(s, 17, s + 6, 18, 0, M.STONE); }
      cf.door(12, 2, 6, 12, { mat: M.FRI_ROUILLE, frameMat: M.CONCRETE });
      for (const s of [4, 16]) { cr.rect(s, 8, s + 6, 17, 0, M.GLASS, vb); cr.rect(s, 17, s + 6, 18, 0, M.STONE); }
      tag(cf, 2, 7, 'KRAZ', { style: 'tag', fill: SPRAY.teal, scale: 1, wob: 1 });
      // le carneau qui relie la chaufferie à la cheminée
      W.box(cx - 2, cy + 7, 10, cx + 2, by0, 15, M.BRICK_OLD, T_BRICK);
      // la conduite rouillée le long du mur
      for (let x = bx0; x < bx1 + 6; x++) W.set(x, by1, 19, M.FRI_ROUILLE);
      for (let z = 2; z < 19; z++) W.set(bx1 + 5, by1, z, M.FRI_ROUILLE);
    }

    // ------------------------------------------------ l'atelier de mécanique : toit à deux pans, effondré par endroits ; le néon
    const BH = { x0: 186, x1: 266, y0: 14, y1: 60, zw: 30 };
    {
      const { x0, x1, y0, y1, zw } = BH;
      W.box(x0, y0, 2, x1, y1, zw, M.BRICK, T_BRICK);
      W.box(x0 + 2, y0 + 2, 2, x1 - 2, y1 - 2, zw, 0);
      W.box(x0 + 2, y0 + 2, 1, x1 - 2, y1 - 2, 2, M.CONCRETE);
      const fs = new Facade(W, LEFT, x0, y0, x1 - x0, y1 - y0), fe = new Facade(W, RIGHT, x0, y0, x1 - x0, y1 - y0);
      // ossature de béton
      for (let s = 0; s <= x1 - x0 - 2; s += 10) fs.rect(s, 2, s + 2, zw, -1, M.CONCRETE, T_PALE);
      fs.rect(0, zw - 3, x1 - x0, zw, -1, M.CONCRETE, T_PALE); fs.rect(0, 14, x1 - x0, 15, -1, M.CONCRETE, T_PALE);
      for (let s = 0; s <= y1 - y0 - 2; s += 11) fe.rect(s, 2, s + 2, zw, -1, M.CONCRETE, T_PALE);
      fe.rect(0, zw - 3, y1 - y0, zw, -1, M.CONCRETE, T_PALE);
      const vbh = obj({ type: 'fri_vitres', broken: 0.55, boarded: 0.08, seed: 4, pane: 3 });
      for (let s = 3; s + 6 < x1 - x0; s += 10) { fs.rect(s, 17, s + 6, 26, 0, M.GLASS, vbh); }
      for (let s = 3; s + 6 < x1 - x0; s += 10) if (s < 30 || s > 52) fs.rect(s, 5, s + 6, 13, 0, M.GLASS, vbh);
      // la porte coulissante, entrouverte sur le noir
      fs.rect(33, 2, 53, 14, 0, 0); fs.rect(33, 2, 53, 14, 1, 0);
      fs.rect(41, 2, 59, 14, -1, M.FRI_ROUILLE); fs.rect(30, 14, 62, 15, -2, M.METAL_DARK);
      tag(fs, 42, 12, 'OUEST', { style: 'throw', scale: 1, fill: SPRAY.white, fill2: SPRAY.grey, line: SPRAY.black, depth: -1 });
      // le toit : deux pans de tôle, le lanterneau, le trou
      B.gableRoof(W, x0, y0, x1 - x0, y1 - y0, zw, M.FRI_TOLE, { axis: 'x', oh: 1, slope: 2, gable: M.BRICK });
      const mid = (y0 + y1) / 2;
      W.box(x0 + 10, mid - 3, zw + 11, x1 - 10, mid + 3, zw + 15, M.GLASS, vbh);
      W.box(x0 + 9, mid - 4, zw + 15, x1 - 9, mid + 4, zw + 16, M.FRI_TOLE);
      const hx0 = 218, hx1 = 240;
      for (let z = zw; z < zw + 17; z++) for (let y = y0 - 1; y <= y1; y++) for (let x = hx0; x < hx1; x++) {
        const ragged = hx0 + 2 * Math.sin(y * 0.7) + (z - zw) * 0.3, ragged2 = hx1 - 2 * Math.cos(y * 0.5);
        if (x > ragged && x < ragged2 && y > y0 + 4) W.set(x, y, z, 0);
      }
      for (const tx of [222, 230, 238]) { // les fermes à nu
        for (let y = y0 + 2; y < y1 - 2; y++) { const zz = zw + Math.floor(Math.min(y - y0, y1 - y) / 2); W.set(tx, y, zz, M.METAL_DARK); if (y % 4 === 0) W.box(tx, y, zw, tx + 1, y + 1, zz, M.METAL_DARK); }
        for (let y = y0 + 2; y < y1 - 2; y++) W.set(tx, y, zw, M.METAL_DARK);
      }
      for (let i = 0; i < 70; i++) { const x = hx0 + Math.floor(R() * (hx1 - hx0)), y = y0 + 4 + Math.floor(R() * (y1 - y0 - 8)); const z = 2 + Math.floor(R() * 3); W.set(x, y, z, R() < 0.5 ? M.FRI_TOLE : (R() < 0.5 ? M.BRICK : M.METAL_DARK)); }
      // le pignon est, sur la rue : oculus et néon
      const gl = obj({ type: 'fri_vitres', broken: 0.5, seed: 5, pane: 2 });
      for (let y = y0; y < y1; y++) for (let z = zw + 3; z < zw + 10; z++) if (Math.hypot(y - mid + 0.5, (z - (zw + 6.5)) * 1.0) < 3.2) W.set(x1 - 1, y, z, M.GLASS, gl);
      for (let s = 3; s + 6 < y1 - y0; s += 11) fe.rect(s + 1, 5, s + 7, 13, 0, M.GLASS, vbh);
      const neonStates = ['dead', 'gone', 'lit', 'dead', 'dead', 'broken', 'dead', 'dim', 'dead', 'gone', 'dead', 'dead', 'dead', 'dead', 'broken', 'dead', 'dead', 'dead', 'lit', 'dead'];
      const neon = obj({ type: 'fri_neon', face: RIGHT, a0: y1 - 1, zTop: 25, text: "TRÉFILERIE D'AUBÉRIVE", states: neonStates, on: night });
      fe.rect(0, 21, y1 - y0, 25, -1, M.METAL_DARK);
      for (let s = 1; s < y1 - y0 - 1; s++) for (let z = 22; z < 25; z++) fe.tag(s, z, -1, neon);
      for (let s = 2; s < y1 - y0; s += 9) fe.set(s, 20, -1, M.METAL_DARK);
      if (night) { W.light({ x: x1 + 3, y: y1 - 1 - 5, z: 23, r: 26, cr: 0.55, cg: 0.14, cb: 0.30, shadow: false }); W.light({ x: x1 + 3, y: y1 - 1 - 39, z: 23, r: 20, cr: 0.45, cg: 0.11, cb: 0.25, shadow: false }); }
    }

    // ------------------------------------------------ la voie de desserte, le heurtoir, le wagon
    const RY0 = 82, RY1 = 98, RAIL = [86, 93];
    W.box(0, RY0, 1, 196, RY1, 3, M.GRAVEL, T_BALLAST);
    for (let x = 0; x < 196; x += 3) W.box(x, RY0 + 1, 2, x + 1, RY1 - 1, 3, M.WOOD_DARK);
    for (const ry of RAIL) W.box(0, ry, 3, 194, ry + 1, 4, M.FRI_ROUILLE);
    for (let x = 0; x < 196; x++) for (let y = RY0; y < RY1; y++) if (W.get(x, y, 3) === 0 && hash(x, y, 931, 0) < 0.07 + 0.08 * fbm(x / 9, y / 5, 932)) W.set(x, y, 3, M.WEED);
    // heurtoir
    W.box(190, RY0 + 2, 3, 193, RY1 - 2, 9, M.FRI_ROUILLE); W.box(189, RY0 + 2, 7, 190, RY1 - 2, 9, M.BARRIER);
    W.box(193, RY0 + 3, 3, 196, RY0 + 5, 6, M.FRI_ROUILLE); W.box(193, RY1 - 5, 3, 196, RY1 - 3, 6, M.FRI_ROUILLE);
    // le wagon couvert, abandonné le long du quai
    const WG = { x0: 64, x1: 116 };
    {
      const { x0, x1 } = WG, yA = 83, yB = 96;
      W.box(x0, 85, 5, x1, 95, 7, M.METAL_DARK);
      for (const ax of [x0 + 9, x1 - 10]) {
        for (const wy of [85, 94]) for (let dz = -3; dz <= 3; dz++) for (let dx = -3; dx <= 3; dx++) if (Math.hypot(dx, dz) < 2.7) W.set(ax + dx, wy, 6 + dz, Math.hypot(dx, dz) < 1 ? M.METAL : M.METAL_DARK);
        W.box(ax - 2, 95, 5, ax + 3, 96, 8, M.FRI_ROUILLE); W.box(ax - 4, 95, 7, ax + 5, 96, 8, M.METAL_DARK);
      }
      W.box(x0, yA, 7, x1, yB, 25, M.WOOD, T_WAGON); W.box(x0 + 1, yA + 1, 8, x1 - 1, yB - 1, 25, 0);
      W.box(x0 + 1, yA + 1, 25, x1 - 1, yB - 1, 26, M.FRI_TOLE); W.box(x0 + 2, yA + 3, 26, x1 - 2, yB - 3, 27, M.FRI_TOLE);
      const fw = new Facade(W, LEFT, x0, yA, x1 - x0, yB - yA), fwe = new Facade(W, RIGHT, x0, yA, x1 - x0, yB - yA);
      for (const s of [0, x1 - x0 - 1]) fw.rect(s, 7, s + 1, 25, -1, M.FRI_ROUILLE);
      fw.rect(0, 7, x1 - x0, 8, -1, M.FRI_ROUILLE); fw.rect(0, 24, x1 - x0, 25, -1, M.FRI_ROUILLE);
      // la porte coulissante, entrouverte
      const ds = 27;
      for (let s = ds; s < ds + 10; s++) for (let z = 8; z < 24; z++) { fw.set(s, z, -1, 0); fw.set(s, z, 0, 0); fw.set(s, z, 1, 0); fw.set(s, z, 2, 0); }
      for (let s = ds; s < ds + 10; s++) { fw.set(s, 8, 3, M.WOOD_DARK); fw.set(s, 8, 2, M.WOOD_DARK); }
      for (let s = ds + 5; s < ds + 21; s++) for (let z = 8; z < 24; z++) fw.set(s, z, -2, M.WOOD, T_WAGON);
      fw.rect(ds - 1, 24, ds + 22, 25, -2, M.METAL_DARK);
      fw.rect(ds - 1, 7, ds, 25, -1, M.FRI_ROUILLE); fw.rect(ds + 5, 8, ds + 6, 24, -3, M.FRI_ROUILLE); fw.rect(ds + 20, 8, ds + 21, 24, -3, M.FRI_ROUILLE);
      for (let s = ds; s < ds + 5; s++) for (let dp = 3; dp < 8; dp++) if (hash(s, dp, 941, 0) < 0.6) fw.set(s, 8, dp, M.CANVAS); // de la paille, dedans
      // tampons, attelage, échelle
      for (const by of [yA + 2, yB - 3]) { W.box(x1, by, 9, x1 + 3, by + 2, 11, M.METAL_DARK); W.box(x1 + 3, by - 1, 8, x1 + 4, by + 3, 12, M.METAL); W.box(x0 - 3, by, 9, x0, by + 2, 11, M.METAL_DARK); }
      W.box(x1, 89, 9, x1 + 3, 90, 10, M.FRI_ROUILLE);
      for (let z = 9; z < 25; z += 3) W.box(x1, yA + 4, z, x1 + 1, yA + 8, z + 1, M.METAL_DARK);
      fwe.rect(1, 9, 3, 24, -1, M.METAL_DARK);
      // les graffitis du wagon
      tag(fw, 2, 22, 'AUBES', { style: 'throw', scale: 2, fill: SPRAY.bord, fill2: [0.56, 0.16, 0.22], line: SPRAY.white, shade: SPRAY.black, wob: 1, seed: 3 });
      tag(fw, ds + 9, 23, 'RIVE', { style: 'tag', scale: 1, fill: SPRAY.white, wob: 1, drip: 0.3, depth: -2 });
      if (bad) tag(fw, ds + 5, 18, 'LA HONTE', { style: 'tag', scale: 1, fill: SPRAY.red, wob: 1, drip: 0.7, depth: -2, seed: 9 });
      else tag(fw, ds + 7, 16, 'KOP 91', { style: 'tag', scale: 1, fill: SPRAY.yellow, wob: 1, depth: -2 });
    }

    // ------------------------------------------------ la cour : ferraille, fûts, palettes, pneus, benne, matelas
    const drum = (x, y, h = 4, m = M.FRI_ROUILLE, t = 0) => { for (let z = 2; z < 2 + h; z++) for (let dy = 0; dy < 3; dy++) for (let dx = 0; dx < 3; dx++) if (!((dx === 0 || dx === 2) && (dy === 0 || dy === 2)) || z % 3 === 0) W.set(x + dx, y + dy, z, m, t); };
    const pallets = (x, y, n) => { for (let k = 0; k < n; k++) { const z = 2 + k; for (let i = 0; i < 6; i++) if (i % 2 === 0 || k % 2 === 1) W.box(x + (k % 2 ? 0 : i), y + (k % 2 ? i : 0), z, x + (k % 2 ? 6 : i + 1), y + (k % 2 ? i + 1 : 6), z + 1, M.WOOD); } };
    // la benne
    { const x = 152, y = 100; W.box(x, y, 2, x + 16, y + 8, 9, M.FRI_ROUILLE); W.box(x + 1, y + 1, 4, x + 15, y + 7, 9, 0); for (let i = 0; i < 50; i++) W.set(x + 1 + Math.floor(R() * 14), y + 1 + Math.floor(R() * 6), 4 + Math.floor(R() * 4), [M.BRICK_OLD, M.WOOD, M.CONCRETE, M.FRI_ROUILLE, M.PLASTIC_WHITE][Math.floor(R() * 5)]); W.box(x - 1, y, 2, x, y + 8, 5, M.FRI_ROUILLE); }
    // le tas de ferraille contre la chaufferie
    for (let i = 0; i < 160; i++) { const a = R() * Math.PI * 2, d = Math.sqrt(R()) * 9; const x = Math.round(185 + Math.cos(a) * d * 1.4), y = Math.round(74 + Math.sin(a) * d * 0.8); const hgt = Math.floor((1 - d / 9) * 7 * R()); for (let z = 2; z <= 2 + hgt; z++) W.set(x, y, z, R() < 0.8 ? M.FRI_ROUILLE : M.METAL_DARK); }
    // pneus, fûts, palettes
    for (const [tx, ty, n] of [[226, 104, 3], [231, 108, 2], [236, 102, 1]]) for (let k = 0; k < n; k++) for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const d = Math.hypot(dx, dy); if (d > 1.2 && d < 2.6) W.set(tx + dx, ty + dy, 2 + k, M.TIRE); }
    drum(140, 100); drum(144, 102, 3, M.KEG); drum(141, 105, 4); drum(258, 72, 4); drum(262, 74, 4, M.KEG);
    pallets(132, 108, 4); pallets(170, 112, 2); pallets(254, 80, 5);
    // les tourets de câble de la tréfilerie, et des couronnes de fil rouillé
    const touret = (x, y, r, w) => {
      for (let dz = -r; dz <= r; dz++) for (let da = -r; da <= r; da++) {
        const d = Math.hypot(da, dz); if (d > r + 0.35) continue;
        for (let k = 0; k < w; k++) {
          const flange = k === 0 || k === w - 1;
          const m = flange ? (d > r - 0.8 ? M.WOOD_DARK : M.WOOD) : d < r * 0.4 ? M.WOOD_DARK : d < r * 0.78 ? M.FRI_ROUILLE : 0;
          if (m) W.set(x + da, y + k, 2 + r + dz, m);
        }
      }
    };
    touret(34, 104, 4, 5); touret(46, 106, 3, 4); touret(132, 100, 4, 5);
    for (const [cx, cy, n] of [[60, 104, 3], [70, 108, 2], [86, 104, 1]]) for (let k = 0; k < n; k++) for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) { const d = Math.hypot(dx, dy); if (d > 1.6 && d < 3.2) W.set(cx + dx, cy + dy, 2 + k, M.FRI_ROUILLE); }
    // le matelas contre le grillage, le caddie
    W.box(100, 115, 2, 112, 118, 3, M.CANVAS, S({ soot: 0.4, seed: 7 })); W.box(100, 117, 3, 112, 118, 8, M.CANVAS, S({ soot: 0.4, seed: 8 }));
    { const x = 236, y = 125; for (let i = 0; i < 6; i++) { W.set(x + i, y, 4, M.METAL); W.set(x + i, y + 3, 4, M.METAL); W.set(x + i, y, 7, M.METAL); W.set(x + i, y + 3, 7, M.METAL); } for (let j = 0; j < 4; j++) { W.set(x, y + j, 4, M.METAL); W.set(x + 5, y + j, 7, M.METAL); W.set(x, y + j, 7, M.METAL); } for (const [a, b] of [[0, 0], [0, 3], [5, 0], [5, 3]]) { W.set(x + a, y + b, 3, M.METAL); W.set(x + a, y + b, 2, M.TIRE); } W.box(x + 6, y, 7, x + 7, y + 4, 8, M.PLASTIC_RED); }
    // la bâche des squatteurs, contre la halle
    W.box(9, 73, 2, 18, 80, 3, M.WOOD); W.box(9, 73, 3, 18, 74, 9, M.TARP); for (let k = 0; k < 6; k++) W.box(9, 74 + k, 8 - k, 18, 75 + k, 9 - k, M.TARP);

    // ------------------------------------------------ la voiture brûlée
    const VB = { x: 170, y: 101 };
    {
      const { x, y } = VB;
      for (let yy = y - 3; yy < y + 11; yy++) for (let xx = x - 3; xx < x + 23; xx++) if (Math.hypot((xx - x - 9.5) / 1.4, yy - y - 4) < 8 + 2 * vnoise(xx * 0.4, yy * 0.4, 941)) W.set(xx, yy, 1, M.ASPHALT, T_GROUND_SOOT);
      const Bx = (a0, b0, z0, a1, b1, z1, m, t = T_BURNT) => W.box(x + a0, y + b0, z0, x + a1, y + b1, z1, m, t);
      for (const [a, b] of [[3, 0], [14, 0], [3, 7], [14, 7]]) Bx(a, b, 2, a + 2, b + 1, 4, M.METAL_DARK, 0);
      Bx(0, 1, 3, 19, 7, 6, M.FRI_ROUILLE);
      Bx(1, 1, 6, 6, 7, 7, M.FRI_ROUILLE); Bx(6, 1, 6, 17, 7, 9, M.FRI_ROUILLE); Bx(17, 1, 6, 18, 7, 7, M.FRI_ROUILLE);
      Bx(7, 1, 6, 11, 7, 9, 0, 0); Bx(12, 1, 6, 16, 7, 9, 0, 0); Bx(7, 2, 6, 16, 6, 9, 0, 0);
      Bx(7, 2, 5, 16, 6, 6, M.METAL_DARK, T_BURNT); Bx(9, 2, 6, 10, 6, 8, M.METAL_DARK, 0); Bx(13, 2, 6, 14, 6, 8, M.METAL_DARK, 0);
      Bx(6, 1, 9, 17, 7, 10, M.FRI_ROUILLE); Bx(6, 1, 9, 17, 2, 10, 0, 0);
      Bx(0, 1, 4, 1, 7, 5, M.METAL_DARK, 0);
      for (let i = 0; i < 14; i++) W.set(x - 2 + Math.floor(R() * 24), y - 2 + Math.floor(R() * 12), 2, M.GLASS);
    }

    // ------------------------------------------------ le feu de palettes (la nuit) ou ses cendres (le jour)
    const FX = 210, FY = 80;
    {
      for (let a = 0; a < 20; a++) { const t = a / 20 * Math.PI * 2; W.set(Math.round(FX + Math.cos(t) * 4.2), Math.round(FY + Math.sin(t) * 4.2), 2, a % 3 ? M.BRICK_OLD : M.CONCRETE); }
      for (let yy = FY - 3; yy <= FY + 3; yy++) for (let xx = FX - 3; xx <= FX + 3; xx++) if (Math.hypot(xx - FX, yy - FY) < 3.6) W.set(xx, yy, 1, M.FRI_CENDRE, night ? S({ embers: 1 }) : 0);
      const EMB = night ? S({ embers: 1.4 }) : T_BURNT;
      for (let k = 0; k < 2; k++) for (let i = -3; i <= 3; i++) if (i % 2 === 0) W.box(k ? FX - 3 : FX + i, k ? FY + i : FY - 3, 2 + k, k ? FX + 4 : FX + i + 1, k ? FY + i + 1 : FY + 4, 3 + k, M.WOOD_DARK, EMB);
      W.box(FX - 1, FY - 1, 2, FX + 2, FY + 2, 3, M.FRI_CENDRE, night ? S({ embers: 2 }) : 0);
      if (night) {
        const big = bad ? 1.3 : 1;
        for (let z = 3; z < 3 + Math.round(11 * big); z++) {
          const t = (z - 3) / (11 * big), r = (3.2 * big) * (1 - t) + 0.4;
          for (let yy = FY - 4; yy <= FY + 4; yy++) for (let xx = FX - 4; xx <= FX + 4; xx++) {
            const d = Math.hypot(xx - FX, yy - FY) + (vnoise(xx * 0.9 + z * 0.4, yy * 0.9, 951) - 0.5) * 2.2;
            if (d < r && hash(xx, yy, z, 952) < 0.85 - t * 0.35 && W.get(xx, yy, z) === 0) W.set(xx, yy, z, M.FRI_FLAMME);
          }
        }
        W.light({ x: FX + 0.5, y: FY + 0.5, z: 7, r: 110 * big, fall: 1.6, cr: 2.0 * big, cg: 1.02 * big, cb: 0.40 * big, skip: 4.5 });
        W.light({ x: FX + 0.5, y: FY + 0.5, z: 3.5, r: 22, fall: 1.4, cr: 0.9, cg: 0.25, cb: 0.06, shadow: false });
      }
      // le bidon, la caisse, la banquette arrachée d'une voiture
      drum(FX - 9, FY + 3, 4);
      W.box(FX + 5, FY - 8, 2, FX + 8, FY - 6, 4, M.CRATE_RED);
      W.box(FX - 7, FY - 9, 2, FX - 1, FY - 6, 4, M.METAL_DARK); W.box(FX - 7, FY - 9, 4, FX - 1, FY - 8, 7, M.SEAT_GREY); W.box(FX - 7, FY - 8, 4, FX - 1, FY - 6, 5, M.SEAT_GREY);
      for (const [bx, by] of [[FX + 6, FY + 4], [FX + 7, FY + 5], [FX - 5, FY + 6]]) W.set(bx, by, 2, M.GLASS);
      // le sentier battu, du trou du grillage jusqu'au feu
      for (let t = 0; t <= 1; t += 0.02) { const px = Math.round(229 + (FX - 229) * t + Math.sin(t * 6) * 2), py = Math.round(119 + (FY + 4 - 119) * t); for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { W.set(px + dx, py + dy, 1, M.MUD); if (W.get(px + dx, py + dy, 2) === M.WEED) W.set(px + dx, py + dy, 2, 0); } }
    }

    // ------------------------------------------------ le poste de garde, à l'entrée de la rue de l'Ouest
    {
      const x0 = 250, y0 = 94, x1 = 270, y1 = 114;
      W.box(x0, y0, 2, x1, y1, 15, M.PLASTER_GREY, S({ soot: 0.3, seed: 9 }));
      B.flatRoof(W, x0, y0, x1 - x0, y1 - y0, 15, M.PLASTER_GREY, { parapet: 1 });
      const f = new Facade(W, LEFT, x0, y0, x1 - x0, y1 - y0), fr = new Facade(W, RIGHT, x0, y0, x1 - x0, y1 - y0);
      const vg = obj({ type: 'fri_vitres', broken: 0.7, seed: 6, pane: 2 });
      f.rect(3, 6, 12, 12, 0, M.GLASS, vg); f.rect(2, 5, 13, 6, -1, M.STONE);
      f.door(14, 2, 4, 10, { mat: M.FRI_ROUILLE, frame: false });
      fr.rect(3, 6, 16, 12, 0, M.GLASS, vg); fr.rect(2, 5, 17, 6, -1, M.STONE);
      tag(f, 1, 9, 'ZEB', { style: 'tag', fill: SPRAY.red, wob: 1 });
      tag(fr, 1, 15, 'OUEST 91', { style: 'tag', fill: SPRAY.black, wob: 1, depth: 0 });
      // la barrière levante, cassée : la moitié du bras par terre
      W.box(262, 88, 2, 264, 90, 8, M.METAL_DARK); W.box(264, 88, 7, 272, 89, 8, M.BARRIER); W.box(266, 80, 2, 275, 81, 3, M.BARRIER);
    }

    // ------------------------------------------------ la végétation : buddléias, bouleaux, lierre
    const buddleia = (cx, cy, r, seed) => {
      for (let z = 2; z < 2 + r * 2; z++) for (let y = cy - r - 1; y <= cy + r + 1; y++) for (let x = cx - r - 1; x <= cx + r + 1; x++) {
        const d = Math.hypot(x - cx, y - cy, (z - 2 - r * 0.8) * 1.2);
        if (d < r + (hash(x, y, z, seed) - 0.5) * 1.4 && W.get(x, y, z) === 0) W.set(x, y, z, M.FOLIAGE, (z > 2 + r && hash(x, y, z, seed + 1) < 0.3) ? BUD : 0);
      }
    };
    const BUD = S({ col: [0.50, 0.32, 0.58] });
    const birch = (x, y, h, seed) => {
      W.box(x, y, 2, x + 1, y + 1, 2 + h, M.WHITE, BIRCH);
      for (let z = 2 + Math.floor(h * 0.5); z < 2 + h + 4; z++) for (let yy = y - 3; yy <= y + 3; yy++) for (let xx = x - 3; xx <= x + 3; xx++) {
        const d = Math.hypot(xx - x, yy - y, (z - (2 + h)) * 0.8);
        if (d < 3.2 && hash(xx, yy, z, seed) < 0.6 && W.get(xx, yy, z) === 0) W.set(xx, yy, z, M.FOLIAGE);
      }
      W.stampLeaves(x, y, 7, 0.6);
    };
    const BIRCH = S({ birch: 1 });
    buddleia(158, 70, 3, 961); buddleia(4, 104, 3, 962); buddleia(270, 116, 2, 963); buddleia(184, 64, 2, 964); buddleia(124, 114, 3, 965); buddleia(60, 114, 2, 966);
    birch(150, 76, 16, 971); birch(176, 92, 12, 972); birch(272, 58, 14, 973); birch(30, 110, 13, 974);
    // de l'herbe sur le quai et la toiture basse
    for (let i = 0; i < 120; i++) { const x = 24 + Math.floor(R() * 116), y = 72 + Math.floor(R() * 9); if (W.get(x, y, 7) === 0 && W.get(x, y, 6) === M.CONCRETE) W.set(x, y, 7, M.WEED); }
    W.stampLeaves(210, 100, 30, 0.25); W.stampLeaves(240, 126, 18, 0.4);

    // ------------------------------------------------ les tags sur ce qu'on voit de la rue
    {
      const fe = new Facade(W, RIGHT, 279, 11, 3, 109);
      tag(fe, 0, 14, 'VIRAGE', { style: 'throw', scale: 2, fill: SPRAY.teal, fill2: [0.14, 0.46, 0.44], line: SPRAY.white, wob: 1, seed: 5 });
      tag(fe, 87, 11, 'ZONE', { style: 'tag', fill: SPRAY.white, wob: 1, drip: 0.3 });
      tag(fe, 99, 12, 'KRAZ', { style: 'tag', fill: SPRAY.red, wob: 1 });
      if (bad) tag(fe, 54, 12, 'LA HONTE', { style: 'tag', scale: 1, fill: SPRAY.red, wob: 1, drip: 0.7, seed: 8 });
      else tag(fe, 56, 11, 'OUEST', { style: 'tag', fill: SPRAY.black, wob: 1, seed: 8 });
      const fA = new Facade(W, LEFT, A.x0, A.y0, A.x1 - A.x0, A.y1 - A.y0);
      tag(fA, 40, 21, 'KOP', { style: 'tag', scale: 1, fill: SPRAY.yellow, wob: 1, drip: 0.4 });
      tag(fA, 112, 11, 'RIVE', { style: 'tag', fill: SPRAY.white, wob: 1, depth: 0, drip: 0.4 });
    }
    // affiches sauvages sur le grillage : non, sur le pilier de béton du portail

    // ------------------------------------------------ le seul réverbère, sur le boulevard
    B.streetLamp(W, 242, 123, G, 0, 1, { on: night, I: 2.0 });
    B.bin(W, 210, 124, G);
    W.box(196, 128, 2, 199, 130, 3, M.CANVAS); // un carton

    // ------------------------------------------------ les gens
    const sp = (def, x, y, z, extra = {}) => W.sprite(Object.assign({ x, y, z }, def, extra));
    if (night) {
      sp(BLOUSON, FX - 8, FY + 0.5, G);               // à gauche du feu : le visage dans la lumière
      sp(CAPUCHE, FX + 10, FY + 3, G);                // à droite, devant : une silhouette à contre-jour
      if (bad) { sp(ASSIS, FX - 7.5, FY + 4, G + 4); sp(MEUTE, FX - 4, FY - 7, G); sp(MEUTE, FX + 4, FY - 9, G); }
      sp(SP.CAT, 120, 77, 7);
    } else {
      sp(SP.KID, 96, 101, G); sp(SP.KID, 104.5, 103, G); sp(SP.BALL, 100, 102, G);
      sp(SP.WALKER, 186, 126, G); sp(CHIEN, 192, 127, G);
      sp(SP.COAT, 231, 124.5, G);
      if (bad) sp(CAPUCHE, 226, 116.5, G);
    }

    return {
      places: [
        { key: 'friche', label: "La friche de l'usine", x: 229, y: 119, z: G + 16 },
        { key: 'feu', label: 'Le feu de palettes', x: FX, y: FY, z: G + 18 },
        { key: 'wagon', label: 'Le wagon', x: 90, y: 97, z: G + 28 },
        { key: 'halle', label: 'La grande halle', x: A.x0 + 103, y: A.y1, z: G + 22 },
      ],
    };
  },
};
