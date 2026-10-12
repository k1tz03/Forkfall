'use strict';
// Les Tilleuls, la cité de l'ouest d'Aubérive (le Grand Aubérive : x 0 – 364, y 364 – 1436 dans le monde).
// Des barres et des tours des années soixante, leurs halls, leurs loggias, leurs volets roulants ; des
// pelouses pelées, des parkings, des tilleuls dorés ; le city-stade grillagé où jouent les gamins, la maison
// de quartier, le centre commercial (le salon, la supérette, le snack), le club de boxe dans l'ancien gymnase,
// la tour C et son hall. La Rive passe au milieu, sous la passerelle taguée.
// Le bord ouest (x = 0) se fond dans le paysage : un talus et les jardins ouvriers au nord, la voie ferrée au
// sud. Le bord est (x = 363) touche le boulevard de ceinture : un trottoir continu, et les rues qui y arrivent.
// Coordonnées locales : x ∈ [0, 364), y ∈ [0, 1072) ; 1 voxel = 20 cm ; chaussée à z = 1, trottoirs à z = 2.
// La caméra voit le dessus, les faces +y (LEFT) et +x (RIGHT) : les façades qui comptent regardent le sud et l'est.
// Le maître pose d'abord le couloir de la Rive (y 270 – 448) ; le quartier bâtit autour et n'y pose que la
// passerelle (l'eau reste continue, les deux routes des quais restent libres).
// Les lieux : le club de boxe (au nord, sur le quai), la tour C, le salon, la supérette, le snack, la maison de
// quartier (autour de la place), le city-stade (le muret à l'est du grillage). Tous s'atteignent à pied depuis
// le trottoir du boulevard. Les fenêtres allumées sont des calques (aucune lumière) : le quartier pose environ
// 67 lumières la bonne nuit, 46 la mauvaise. Sept matières nouvelles (TIL_) ; le reste vient de mats.js et des
// autres quartiers.
const E = require('./engine');
const { M } = require('./mats');
const B = require('./build');
const SP = require('./sprites');
require('./diorama'); // M.WEED, M.MUD, M.TARP, M.BARRIER
require('./district_residentiel'); // M.RES_LINGE, M.RES_FLEURS, M.RES_SABLE, M.RES_POTAGER, M.RES_TOLE, M.RES_FRUITS ; le calque res_carvitre
require('./district_sport'); // M.ESTQ_CLAD (le bardage), M.ESTQ_NET (le filet de but)
const { LEFT, RIGHT, TOP, hash, vnoise, fbm, mod, clamp, material, overlay, OVERLAYS, textBitmap } = E;
const { Facade } = B;

const G = 2;
const LX = 364, LY = 1072;
const RIV0 = 270, RIV1 = 448; // le couloir de la Rive, posé par le maître
const FH = 14; // la hauteur d'un niveau (2,80 m)

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const rgbA = (c, a, k = 1) => { c.cr = a[0] * k; c.cg = a[1] * k; c.cb = a[2] * k; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const emit = (c, a, k = 1) => { c.er = a[0] * k; c.eg = a[1] * k; c.eb = a[2] * k; };
const grain = (c, amt, s = 0) => mul(c, 1 + (hash(c.a, c.b, c.face * 7 + s, c.m) - 0.5) * 2 * amt);
// les feuilles de tilleul tombées (la densité est celle que les arbres ont semée, W.leaf)
const feuilles = (c, k = 1) => {
  if (c.face !== TOP) return;
  const W = c.W, ix = Math.floor(c.hx), iy = Math.floor(c.hy);
  if (ix < 0 || iy < 0 || ix >= W.X || iy >= W.Y) return;
  const d = W.leaf[iy * W.X + ix] * k;
  if (d <= 0 || hash(c.a, c.b, 1913, 5) >= d * 0.42) return;
  const v = hash(c.a, c.b, 1914, 1);
  if (v < 0.42) rgb(c, 0.78, 0.63, 0.18); else if (v < 0.72) rgb(c, 0.64, 0.46, 0.13); else if (v < 0.9) rgb(c, 0.52, 0.40, 0.15); else rgb(c, 0.86, 0.74, 0.30);
  c.wet *= 0.3;
};
const flaque = (c, scale, thr, s) => {
  if (c.face !== TOP) return;
  const p = fbm(c.hx / scale + 3.1, c.hy / scale - 1.7, s, 3);
  if (p > thr) c.wet = clamp((p - thr) * 12, 0, 1);
};

// ================================================================ matières (sept, préfixées TIL_)
// Le tilleul à l'automne : un vert tendre qui jaunit, de l'or, quelques feuilles rousses.
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
M.TIL_TILLEUL = M.TIL_TILLEUL || material('feuillage de tilleul', c => {
  const v = hash(c.ix, c.iy, c.iz, 1211);
  const t = clamp((fbm(c.ix / 30, c.iy / 30, 1213) - 0.38) * 2.2 + (c.iz - 30) * 0.004, 0, 1); // vert … doré
  let col;
  if (v < 0.30) col = mix([0.34, 0.42, 0.15], [0.70, 0.58, 0.17], t);
  else if (v < 0.55) col = mix([0.46, 0.52, 0.19], [0.82, 0.68, 0.22], t);
  else if (v < 0.74) col = mix([0.27, 0.35, 0.13], [0.58, 0.48, 0.15], t);
  else if (v < 0.90) col = mix([0.58, 0.60, 0.25], [0.90, 0.79, 0.36], t);
  else col = [0.60, 0.40, 0.14];
  rgbA(c, col);
  const h = hash(c.a, c.b, 1212, c.face);
  if (c.face === TOP) mul(c, 1.18 + (h - 0.5) * 0.35); else mul(c, 0.88 + (h - 0.5) * 0.35);
}, { trans: 0.45, noAO: true, noAOrecv: true });
// La pelouse pelée : de l'herbe rase, des plaques de terre, des touffes plus vertes.
M.TIL_PELOUSE = M.TIL_PELOUSE || material('pelouse pelée', c => {
  if (c.face !== TOP) { rgb(c, 0.27, 0.22, 0.15); grain(c, 0.1); return; }
  const n = fbm(c.hx / 11, c.hy / 11, 1201), m = fbm(c.hx / 3.2, c.hy / 3.2, 1202), h = hash(c.a, c.b, 1203, 0);
  const k = 0.84 + 0.28 * m;
  let r = 0.23 * k, g = 0.34 * k, b = 0.15 * k;
  const bare = clamp((n - 0.52) * 3.6 + (m - 0.5) * 1.1, 0, 1);
  if (bare > 0) { r += (0.37 - r) * bare; g += (0.30 - g) * bare; b += (0.20 - b) * bare; }
  if (h < 0.1) { r *= 0.8; g *= 0.82; b *= 0.8; } else if (h > 0.92 && bare < 0.3) { r *= 1.18; g *= 1.16; }
  rgb(c, r, g, b);
  if (bare > 0.55) { const p = fbm(c.hx / 5 + 2, c.hy / 5, 1204); if (p > 0.64) c.wet = clamp((p - 0.64) * 8, 0, 0.6); }
  feuilles(c, 0.9);
});
// Le béton des panneaux de façade (la teinte, les joints, les allèges et les loggias viennent du calque til_mur).
M.TIL_PANNEAU = M.TIL_PANNEAU || material('panneau de béton', c => {
  if (c.face === TOP) { rgb(c, 0.52, 0.50, 0.47); grain(c, 0.05); return; }
  rgb(c, 0.62, 0.60, 0.55); grain(c, 0.03);
});
// Le gazon synthétique du city-stade : vert franc, grain fin, des billes de caoutchouc.
M.TIL_SYNTHE = M.TIL_SYNTHE || material('gazon synthétique', c => {
  if (c.face !== TOP) { rgb(c, 0.15, 0.28, 0.15); return; }
  const h = hash(c.a, c.b, 1221, 0), n = fbm(c.hx / 5, c.hy / 5, 1222);
  const k = 0.9 + 0.18 * n;
  rgb(c, 0.17 * k, 0.40 * k, 0.20 * k);
  if (h < 0.018) rgb(c, 0.09, 0.10, 0.09); else if (h > 0.95) mul(c, 1.15);
  if (mod(Math.floor(c.hx / 2.5), 2)) mul(c, 0.94);
  feuilles(c, 0.5);
});
// Le sol souple de l'aire de jeux (la couleur des zones vient du calque til_peint).
M.TIL_SOUPLE = M.TIL_SOUPLE || material('sol souple', c => { rgb(c, 0.50, 0.20, 0.15); grain(c, 0.12); if (c.face !== TOP) mul(c, 0.8); feuilles(c, 0.6); });
// Le ballast de la voie ferrée.
M.TIL_BALLAST = M.TIL_BALLAST || material('ballast', c => {
  const h = hash(c.a, c.b, 1231, c.face);
  let k = 0.33 + 0.13 * h; if (h < 0.15) k *= 0.72;
  rgb(c, k * 0.97, k * 0.95, k * 0.93);
  if (c.face !== TOP) mul(c, 0.8);
});
// La dalle de la place : béton désactivé (les gravillons affleurent), grandes dalles d'un mètre.
M.TIL_DALLE = M.TIL_DALLE || material('dalle gravillonnée', c => {
  if (c.face !== TOP) { rgb(c, 0.42, 0.40, 0.37); grain(c, 0.06); return; }
  const ga = mod(c.a, 10), gb = mod(c.b, 10);
  const slab = hash(Math.floor(c.a / 10), Math.floor(c.b / 10), 1241, 0), h = hash(c.a, c.b, 1242, 0);
  let k = 0.45 + slab * 0.05;
  if (h < 0.2) k *= 0.82; else if (h > 0.86) k *= 1.15;
  if (ga === 0 || gb === 0) k *= 0.7;
  rgb(c, k * 1.02, k * 0.98, k * 0.92);
  flaque(c, 9, 0.68, 1243);
  feuilles(c, 1);
});

// ================================================================ calques (aucun ne coûte de matière)
// Une trame de façade : les travées (bw voxels) à partir d'une marge m, les niveaux (FH) à partir de z0 ;
// chaque case a un type (fen, fen2, pfen, log, bal, cage, hall, local, porche, rdc, plein).
function caseDe(g, la, lb) {
  const ls = la - 2 * g.m, b = Math.floor(ls / (2 * g.bw)), lsb = ls - b * 2 * g.bw;
  const e = Math.floor(lb / (2 * FH)), lz = lb - e * 2 * FH;
  return { b, e, lsb, lz, t: b >= 0 && b < g.nb && e >= 0 && e < g.ne ? g.type(b, e) : null };
}
const faceLA = (c, L, a0) => L ? Math.floor(2 * c.hx) - 2 * a0 : 2 * a0 - 1 - Math.floor(2 * c.hy);
// Le mur : la teinte du béton, ses panneaux, ses joints, les allèges de couleur, les coulures, le fond des loggias.
function murTeinte(o, c, col, la, lb, k0 = 1) {
  const n = fbm(la / 22 + (o.seed || 0) * 3.1, lb / 34, 1301);
  const k = k0 * (0.93 + 0.12 * n);
  rgbA(c, col, k); grain(c, 0.025);
}
overlay('til_mur', (o, c) => {
  if (c.face === TOP) return;
  const L = c.face === LEFT, g = L ? o.L : o.R;
  const lb = Math.floor(2 * c.hz) - 2 * o.z0;
  if (!g) { murTeinte(o, c, o.col, Math.floor(2 * (c.hx + c.hy)), lb, 0.9); return; }
  const depth = L ? g.y1 - c.hy : g.x1 - c.hx;
  const la = faceLA(c, L, g.a0);
  if (depth > 0.5) { // dans une loggia : le fond peint, ou les refends
    if (depth < g.lg + 0.6) murTeinte(o, c, o.fond || o.col, la, lb, 0.95); else murTeinte(o, c, o.col, la, lb, 0.86);
    return;
  }
  if (depth < -0.5) { murTeinte(o, c, o.col, la, lb, 0.97); return; }
  const q = caseDe(g, la, lb);
  let col = o.col;
  const geo = q.t && g.geo[q.t];
  // l'allège sous la fenêtre (et le trumeau au-dessus), de la couleur de la travée
  if (o.allege && geo && (q.t === 'fen' || q.t === 'fen2')) {
    const inX = q.lsb >= 2 * (geo.ws - 1) && q.lsb < 2 * (geo.ws + geo.ww + 1);
    if (inX && (q.lz < 2 * geo.wz - 1 || q.lz >= 2 * (geo.wz + geo.wh) + 1)) { const a = o.allege(q.b, q.e); if (a) col = a; }
  }
  // la brique de parement, coupée par les nez de dalle en béton
  if (o.brique && q.e >= 0 && q.lz >= 3) {
    const course = Math.floor(lb / 3), off = (course & 1) * 4, ba = mod(la + off, 8), bb = mod(lb, 3);
    if (bb === 0 || ba === 0) { rgb(c, 0.46, 0.43, 0.39); grain(c, 0.05); }
    else { const h = hash(Math.floor((la + off) / 8), course, 1311, o.seed || 0); const kk = 0.84 + h * 0.3; rgbA(c, o.brique, kk); grain(c, 0.03); }
    mul(c, 0.92 + 0.12 * fbm(la / 14, lb / 20, 1312));
  } else murTeinte(o, c, col, la, lb);
  // les joints des panneaux
  if (o.joints !== false && q.e >= 0 && q.e < g.ne + 1) {
    if (q.lz === 0) mul(c, 0.74);
    else if (q.b >= 0 && q.b <= g.nb && q.lsb === 0 && !o.brique) mul(c, 0.8);
  }
  // les coulures sous les appuis, et celles qui descendent de l'acrotère
  if (geo && q.lz < 2 * geo.wz && q.lsb >= 2 * geo.ws && q.lsb < 2 * (geo.ws + geo.ww)) {
    const s = hash(la, q.e, 1321, o.seed || 0);
    if (s < 0.3) mul(c, 0.86 + 0.1 * (q.lz / (2 * geo.wz)));
  }
  const st = vnoise(la * 0.45, lb * 0.025 + (o.seed || 0), 1322);
  if (st > 0.74) mul(c, 0.9);
  if (lb < 5) mul(c, 0.78 + 0.04 * lb);
});
// La vitre : volets roulants (relevés, à mi-hauteur, fermés), voilages, rideaux, la lumière du soir.
const RIDEAUX = [[0.62, 0.30, 0.22], [0.55, 0.50, 0.32], [0.35, 0.40, 0.55], [0.55, 0.25, 0.35], [0.70, 0.66, 0.55], [0.36, 0.48, 0.36]];
const LAMPES = [[1.0, 0.70, 0.36], [1.0, 0.70, 0.36], [1.0, 0.70, 0.36], [1.0, 0.80, 0.52], [1.0, 0.62, 0.30], [0.86, 0.88, 0.80]];
function fenetre(o, c, lx, ly, W2, H2, kb, e) {
  const fr = o.cadre;
  if (lx < 0 || ly < 0 || lx >= W2 || ly >= H2) { rgb(c, 0.06, 0.065, 0.08); return; }
  const v1 = hash(kb, e, o.seed, 1), v2 = hash(kb, e, o.seed, 2), v3 = hash(kb, e, o.seed, 3), v4 = hash(kb, e, o.seed, 4);
  const pClos = (o.bad ? 0.2 : 0.1) + (o.night ? 0.06 : 0);
  const sh = v1 < pClos ? 1 : v1 < pClos + 0.2 ? 0.5 + 0.25 * v3 : v1 < pClos + 0.45 ? 0.18 + 0.14 * v3 : 0;
  if (lx === 0 || lx === W2 - 1 || ly === 0) { rgbA(c, fr); return; }
  const top = H2 - 2;
  if (ly >= top) { rgbA(c, o.volet, 0.72); return; } // le coffre du volet roulant
  const lit = o.night && sh < 1 && v2 < (o.bad ? 0.30 : 0.56);
  const shH = Math.round(sh * (top - 1));
  if (ly >= top - shH) { // les lames du volet
    const lame = mod(top - ly, 2) === 0;
    rgbA(c, o.volet, lame ? 0.8 : 1);
    if (ly === top - shH) mul(c, 0.6);
    if (o.night && sh === 1 && v2 < 0.3 && lame) emit(c, LAMPES[Math.floor(v4 * 6)], 0.07);
    return;
  }
  if (W2 >= 12 && lx === (W2 >> 1)) { rgbA(c, fr); return; } // le meneau des deux vantaux
  const voile = v4 < 0.42, rideau = v3 < 0.5 && (lx < 3 || lx > W2 - 4);
  const cu = RIDEAUX[Math.floor(v3 * 2 * RIDEAUX.length) % RIDEAUX.length];
  if (lit) {
    const col = LAMPES[Math.floor(hash(kb, e, o.seed, 5) * 6)];
    const tv = hash(kb, e, o.seed, 6) < 0.1;
    let k = 0.56 * (0.8 + 0.3 * ly / H2);
    rgb(c, col[0] * 0.3, col[1] * 0.3, col[2] * 0.3);
    if (rideau) { emit(c, cu, k * 0.75 * (mod(lx, 2) ? 0.85 : 1)); return; }
    if (tv) { emit(c, [0.42, 0.52, 0.85], 0.5 + 0.12 * hash(ly >> 1, e, kb, 7)); return; }
    if (voile) { k *= mod(lx, 3) === 0 ? 0.82 : 1; emit(c, col, k * 0.9); return; }
    if (v4 > 0.94) { // quelqu'un à la fenêtre
      const dx = lx - (W2 >> 2) - 1, dy = ly - 9;
      if (dx * dx + dy * dy * 1.2 <= 4.5 || (ly <= 7 && Math.abs(dx) <= 4 - Math.max(0, ly - 5))) { rgb(c, 0.05, 0.04, 0.04); emit(c, col, 0.05); return; }
    }
    emit(c, col, k);
    return;
  }
  if (o.night) {
    rgb(c, 0.05, 0.055, 0.07); if (mod(lx + (H2 - ly), 11) < 2) rgb(c, 0.11, 0.12, 0.15);
    if (rideau) rgbA(c, cu, 0.3); else if (voile) rgb(c, 0.13, 0.13, 0.14);
    return;
  }
  // le jour : le voilage blanc, ou le reflet du ciel ; les rideaux tirés sur les côtés
  if (rideau) { rgbA(c, cu, mod(lx, 2) ? 0.8 : 0.92); return; }
  if (voile) { rgb(c, 0.60, 0.60, 0.56); if (mod(lx, 3) === 0) mul(c, 0.88); if (ly > top - 3) mul(c, 0.92); return; }
  rgb(c, 0.09, 0.10, 0.12); if (mod(lx - ly + kb, 11) < 2) rgb(c, 0.21, 0.23, 0.27); else if (ly > top - 4) rgb(c, 0.15, 0.17, 0.20);
  if (v3 > 0.86 && ly <= 2 && mod(lx, 4) < 3) rgb(c, 0.20, 0.36, 0.16); // un pot de géraniums sur l'appui
}
overlay('til_vitre', (o, c) => {
  if (c.face === TOP) { rgb(c, 0.16, 0.16, 0.17); return; }
  const L = c.face === LEFT, g = L ? o.L : o.R;
  if (!g) { rgb(c, 0.06, 0.065, 0.08); return; }
  const la = faceLA(c, L, g.a0), lb = Math.floor(2 * c.hz) - 2 * o.z0;
  const q = caseDe(g, la, lb), geo = q.t && g.geo[q.t];
  if (!geo) { rgb(c, 0.06, 0.065, 0.08); return; }
  fenetre(o, c, q.lsb - 2 * geo.ws, q.lz - 2 * geo.wz, 2 * geo.ww, 2 * geo.wh, q.b * 2 + (L ? 0 : 1) + 101, q.e);
});
// La cage d'escalier : une colonne de pavés de verre, un palier par niveau, la minuterie la nuit.
overlay('til_cage', (o, c) => {
  if (c.face === TOP) { rgb(c, 0.3, 0.3, 0.3); return; }
  const L = c.face === LEFT;
  const la = faceLA(c, L, o.a0), lb = Math.floor(2 * c.hz) - 2 * o.z0;
  const n = Math.floor(lb / (2 * FH)), ly = lb - n * 2 * FH, W2 = 2 * o.w;
  if (la <= 0 || la >= W2 - 1 || ly <= 0) { rgb(c, 0.55, 0.55, 0.52); return; }
  const joint = mod(la - 1, 3) === 2 || mod(ly - 1, 3) === 2;
  const lit = o.night && hash(n, o.seed, 5, 6) < (o.bad ? 0.38 : 0.62);
  if (lit) {
    const col = hash(n, o.seed, 7, 7) < 0.55 ? [0.78, 0.88, 0.82] : [1.0, 0.80, 0.50];
    rgbA(c, col, 0.3); emit(c, col, joint ? 0.2 : 0.62);
    return;
  }
  if (joint) rgb(c, 0.44, 0.45, 0.44); else rgb(c, o.night ? 0.12 : 0.40, o.night ? 0.13 : 0.44, o.night ? 0.14 : 0.45);
  if (!o.night && mod(la + ly, 5) === 0 && !joint) mul(c, 1.25);
});
// Le hall : le sas vitré, la porte à deux battants, les boîtes aux lettres au mur, la lumière du plafonnier.
overlay('til_hall', (o, c) => {
  if (c.face === TOP) { rgb(c, 0.4, 0.4, 0.4); return; }
  const L = c.face === LEFT;
  const la = faceLA(c, L, o.a0), lb = Math.floor(2 * c.hz) - 2 * o.z0, W2 = 2 * o.w, H2 = 2 * o.h;
  const alu = [0.56, 0.57, 0.58];
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) { rgb(c, 0.1, 0.1, 0.1); return; }
  const mid = W2 >> 1, dw = Math.min(8, mid - 2);
  if (la === 0 || la === W2 - 1 || lb >= H2 - 1 || lb === H2 - 5 || la === mid - dw || la === mid + dw - 1 || la === mid) { rgbA(c, alu); return; }
  if (lb >= 9 && lb <= 12 && (la === mid - 2 || la === mid + 1)) { rgb(c, 0.12, 0.12, 0.12); return; } // les poignées
  const lum = o.lum || [1.0, 0.86, 0.62];
  const on = o.night && !(o.bad && o.panne);
  // derrière la vitre : le sol carrelé, les boîtes aux lettres à gauche, une affiche à droite
  let col = null;
  if (lb < 3) col = mod(la, 4) < 2 ? [0.42, 0.40, 0.36] : [0.30, 0.28, 0.26];
  else if (la < mid - dw && lb >= 6 && lb < 20) {
    const bx = mod(la - 1, 4), by = mod(lb - 6, 3);
    col = bx === 3 || by === 2 ? [0.20, 0.20, 0.20] : (hash(Math.floor((la - 1) / 4), Math.floor((lb - 6) / 3), 1331, o.seed) < 0.3 ? [0.70, 0.60, 0.30] : [0.62, 0.62, 0.60]);
  } else if (la >= mid + dw && lb >= 8 && lb < 18 && la < W2 - 2) col = [0.80, 0.76, 0.62];
  if (lb >= H2 - 4) col = [0.86, 0.86, 0.80]; // l'imposte : le nom de l'entrée en lettres blanches
  if (on) {
    const c0 = col || lum, k = col ? 0.7 : 0.75 * (0.75 + 0.35 * lb / H2);
    rgbA(c, c0, 0.3); emit(c, col ? [c0[0] * lum[0], c0[1] * lum[1], c0[2] * lum[2]] : lum, k);
    return;
  }
  if (col) { rgbA(c, col, o.night ? 0.25 : 0.5); return; }
  rgb(c, 0.07, 0.075, 0.09); if (mod(la - lb, 9) < 2) rgb(c, 0.17, 0.18, 0.21);
});
// Les vitrines des commerces et des équipements.
const VITRINES = {
  superette(la, lb, W2, H2, c, o) {
    if (mod(la, 18) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.12, 0.13, 0.12); return null; }
    if (lb <= 5) { const p = [[0.84, 0.46, 0.10], [0.36, 0.56, 0.20], [0.72, 0.15, 0.12], [0.82, 0.74, 0.25]][Math.floor(hash(la / 3 | 0, 0, 1401, 0) * 4)]; return lb >= 2 ? [p[0], p[1], p[2], 0.62] : [0.45, 0.42, 0.38, 0.4]; }
    const sh = mod(lb - 6, 5);
    if (sh === 4) return [0.60, 0.60, 0.58, 0.5];
    if (lb >= H2 - 4) return [0.95, 0.95, 0.90, 0.85];
    const h = hash(la >> 1, Math.floor((lb - 6) / 5), 1402, 0);
    if (h < 0.75) { const p = [[0.82, 0.20, 0.15], [0.20, 0.35, 0.66], [0.86, 0.76, 0.30], [0.92, 0.90, 0.82], [0.30, 0.56, 0.30], [0.62, 0.30, 0.15], [0.86, 0.50, 0.20]][Math.floor(h / 0.75 * 7)]; return [p[0], p[1], p[2], 0.66]; }
    return [0.90, 0.95, 0.90, 0.68];
  },
  snack(la, lb, W2, H2, c, o) {
    if (mod(la, 16) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.10, 0.07, 0.05); return null; }
    if (lb >= H2 - 7 && lb < H2 - 1) { const cell = mod(la, 16); if (cell >= 2 && cell <= 13) { const h = hash(la >> 1, lb >> 1, 1411, 0); return h < 0.3 ? [0.95, 0.35, 0.12, 0.9] : h < 0.5 ? [0.95, 0.80, 0.30, 0.9] : [1.0, 0.95, 0.80, 0.85]; } }
    if (lb <= 6) { if (lb === 6) return [0.85, 0.60, 0.30, 0.6]; return [0.38, 0.16, 0.10, 0.45]; }
    for (const hx of (o.clients || [])) { const dx = la - hx; if ((dx * dx + (lb - 11) * (lb - 11) * 1.2 < 4.5) || (lb <= 9 && lb >= 6 && Math.abs(dx) < 3.5)) { rgb(c, 0.05, 0.035, 0.03); return null; } }
    return [1.0, 0.66, 0.32, 0.7 + 0.1 * lb / H2];
  },
  salon(la, lb, W2, H2, c, o) {
    if (mod(la, 14) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.14, 0.11, 0.12); return null; }
    const cell = mod(la, 14);
    if (lb >= 9 && lb <= 17 && cell >= 3 && cell <= 10) { const dx = cell - 6.5, dy = lb - 13; if (dx * dx * 0.5 + dy * dy * 0.5 < 8) return [0.70, 0.74, 0.78, 0.6]; }
    if (lb >= 3 && lb <= 8 && cell >= 4 && cell <= 9) { rgb(c, 0.12, 0.06, 0.08); return null; }
    if (o.client && Math.floor(la / 14) === 1) { const dx = cell - 6.5; if (dx * dx + (lb - 12) * (lb - 12) * 1.2 < 4.5 || (lb >= 6 && lb <= 9 && Math.abs(dx) < 4)) { rgb(c, 0.05, 0.04, 0.04); return null; } }
    return [1.0, 0.80, 0.78, 0.62];
  },
  mdq(la, lb, W2, H2, c, o) {
    if (mod(la, 12) === 0 || lb === 0 || lb === H2 - 1 || lb === Math.round(H2 * 0.62)) { rgb(c, 0.20, 0.36, 0.52); return null; }
    if (lb > Math.round(H2 * 0.62)) return [0.95, 0.88, 0.70, o.lit ? 0.55 : 0.3];
    // les dessins des enfants collés à la vitre
    const cell = mod(la, 12), row = Math.floor(lb / 5);
    if (cell >= 2 && cell <= 9 && mod(lb, 5) >= 1 && hash(Math.floor(la / 12), row, 1421, 0) < 0.55) {
      const p = [[0.92, 0.80, 0.30], [0.86, 0.38, 0.25], [0.36, 0.56, 0.80], [0.40, 0.70, 0.36], [0.92, 0.90, 0.85]][Math.floor(hash(Math.floor(la / 12), row, 1422, 0) * 5)];
      return [p[0], p[1], p[2], o.lit ? 0.62 : 0];
    }
    return o.lit ? [1.0, 0.84, 0.58, 0.62] : null;
  },
  boxe(la, lb, W2, H2, c, o) {
    if (mod(la, 6) === 0 || lb === 0 || lb === H2 - 1 || mod(lb, 6) === 0) { rgb(c, 0.16, 0.16, 0.17); return null; }
    if (!o.lit) return null;
    // les cordes du ring, rouge et bleu, et le sac de frappe
    if (lb >= 2 && lb <= 4 && mod(la, 2) === 0) return [0.85, 0.20, 0.18, 0.7];
    if (lb >= 7 && lb <= 9 && mod(la, 2) === 0) return [0.30, 0.40, 0.85, 0.7];
    if (mod(la, 18) >= 11 && mod(la, 18) <= 13 && lb >= 5 && lb <= 15) { rgb(c, 0.16, 0.05, 0.05); return null; }
    return [1.0, 0.78, 0.48, 0.68];
  },
  vide(la, lb, W2, H2, c) {
    if (mod(la, 16) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.12, 0.12, 0.12); return null; }
    if (lb > 6 && lb < H2 - 4 && mod(la, 16) > 3 && mod(la, 16) < 12) { rgb(c, 0.72, 0.70, 0.62); if (mod(lb, 3) === 0) mul(c, 0.86); return null; } // le papier blanc collé
    return null;
  },
};
overlay('til_vitrine', (o, c) => {
  if (c.face !== o.face) return;
  const L = c.face === LEFT;
  const la = faceLA(c, L, o.a0), lb = Math.floor(2 * c.hz) - 2 * o.z0, W2 = 2 * o.w, H2 = 2 * o.h;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  rgb(c, 0.05, 0.05, 0.05); c.er = c.eg = c.eb = 0;
  const r = VITRINES[o.kind](la, lb, W2, H2, c, o);
  if (r) { const k = r[3] * (o.k != null ? o.k : 1); rgb(c, r[0] * 0.3, r[1] * 0.3, r[2] * 0.3); if (o.lit !== false) { c.er = r[0] * k; c.eg = r[1] * k; c.eb = r[2] * k; } else rgb(c, r[0] * 0.45, r[1] * 0.45, r[2] * 0.45); }
  else if (!o.night && c.cr + c.cg + c.cb < 0.2) { if (mod(la - lb, 10) < 2) rgb(c, 0.20, 0.21, 0.24); }
});
// La peinture : une couleur unie (portes, garde-corps, jeux, plots), un motif, une lueur.
overlay('til_peint', (o, c) => {
  const f = o.col; rgb(c, f[0], f[1], f[2]);
  const al = c.face === LEFT ? Math.floor(2 * c.hx) : c.face === RIGHT ? Math.floor(2 * c.hy) : Math.floor(2 * c.hx), bl = Math.floor(2 * c.hz);
  if (o.pat === 'nervures' && c.face !== TOP && mod(al, 3) === 0) mul(c, 0.78);
  if (o.pat === 'lames' && c.face !== TOP && mod(bl, 2) === 0) mul(c, 0.8);
  if (o.pat === 'planches' && c.face !== TOP && mod(bl, 3) === 0) mul(c, 0.74);
  if (o.pat === 'rouille' && fbm(c.hx * 0.6 + c.hy * 0.6, c.hz * 0.6, 1441) > 0.6) rgb(c, 0.40, 0.23, 0.13);
  if (o.pat === 'carreaux' && c.face !== TOP) { if (mod(al, 3) === 0 || mod(bl, 3) === 0) mul(c, 0.78); else if (hash(al >> 1, bl >> 1, 1442, 0) < 0.12) mul(c, 1.12); }
  if (o.pat === 'barreaux' && c.face !== TOP && mod(al, 2) === 0) mul(c, 0.7);
  if (o.pat === 'rayures' && mod(Math.floor((c.hx + c.hy) * 2 + c.hz * 2), 4) < 2) rgbA(c, o.col2 || [0.86, 0.85, 0.80]);
  if (c.face === TOP) { if (o.top) rgbA(c, o.top); else mul(c, 1.07); }
  grain(c, o.grain != null ? o.grain : 0.05);
  if (o.emit) emit(c, o.emit);
});
// Les grandes lettres peintes des bâtiments : une police 5 × 7 (la 3 × 5 se lit mal agrandie).
const GRANDES = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'], B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  C: ['.####', '#....', '#....', '#....', '#....', '#....', '.####'], D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'], F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'], X: ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
};
function grandBitmap(text) {
  const cols = [];
  [...text].forEach((ch, i) => { const g = GRANDES[ch]; if (!g) { cols.push(new Array(7).fill(0), new Array(7).fill(0)); return; } for (let x = 0; x < 5; x++) cols.push(g.map(r => r[x] === '#' ? 1 : 0)); if (i < text.length - 1) cols.push(new Array(7).fill(0)); });
  return { w: cols.length, h: 7, at: (x, y) => (x >= 0 && x < cols.length && y >= 0 && y < 7) ? cols[x][y] : 0 };
}
// Le toit-terrasse : des gravillons (gris, beiges, rouille) ou le bitume nu ; les flaques restent celles du toit.
overlay('til_toit', (o, c) => {
  if (c.face !== TOP) return;
  const h = hash(c.a, c.b, 1491, 0), n = fbm(c.hx / 7, c.hy / 7, 1492);
  rgbA(c, o.col, (0.86 + 0.24 * n) * (h < 0.22 ? 0.78 : h > 0.86 ? 1.16 : 1));
  if (c.wet > 0) mul(c, 0.8);
});
// Un texte peint sur un mur (la grande lettre des tours, le nom du club de boxe) : le mur dessous reste le mur.
overlay('til_texte', (o, c) => {
  if (o.under) { const f = OVERLAYS[o.under.type]; if (f) f(o.under, c); }
  if (c.face !== o.face) return;
  const L = c.face === LEFT;
  const la = faceLA(c, L, o.a0), lt = 2 * o.zTop - 1 - Math.floor(2 * c.hz);
  if (!o.bmp) o.bmp = o.grand ? grandBitmap(o.text) : textBitmap(o.text);
  const sc = o.scale || 1;
  if (la < 0 || lt < 0) return;
  if (o.bmp.at(Math.floor(la / sc), Math.floor(lt / sc))) {
    if (o.worn && hash(la, lt, 1451, o.seed || 0) < o.worn) return;
    rgbA(c, o.col); grain(c, 0.04);
    if (o.emit) emit(c, o.emit);
  } else if (o.ombre && la >= 1 && lt >= 1 && o.bmp.at(Math.floor((la - 1) / sc), Math.floor((lt - 1) / sc))) mul(c, 0.55);
});
// Les tags : trait simple, ou « throw-up » (lettres gonflées, contour, ombre), avec des coulures.
function tagGrid(o) {
  const bmp = textBitmap(o.text), s = o.scale || 1, pad = o.style === 'throw' ? 3 : 1;
  const GW = bmp.w * s + 2 * pad + 2, GH = bmp.h * s + 2 * pad + 6;
  const g = new Uint8Array(GW * GH);
  for (let y = 0; y < bmp.h * s; y++) for (let x = 0; x < bmp.w * s; x++) {
    const wob = o.wob ? Math.round(Math.sin((x / s) * 0.9 + (o.seed || 0)) * o.wob) : 0;
    const slant = o.slant ? Math.floor((bmp.h * s - y) / 3) : 0;
    if (bmp.at(Math.floor(x / s), Math.floor(y / s))) { const yy = y + pad + wob, xx = x + pad + slant; if (yy >= 0 && yy < GH && xx < GW) g[yy * GW + xx] = 1; }
  }
  if (o.style === 'throw') {
    const fill = new Uint8Array(g);
    for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) if (!fill[y * GW + x]) {
      let near = false;
      for (let dy = -1; dy <= 1 && !near; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < GW && yy < GH && fill[yy * GW + xx] === 1) { near = true; break; } }
      if (near) g[y * GW + x] = 2;
    }
    for (let y = GH - 1; y >= 1; y--) for (let x = GW - 1; x >= 1; x--) if (!g[y * GW + x] && g[(y - 1) * GW + x - 1] === 2) g[y * GW + x] = 3;
  }
  if (o.drip) for (let x = 0; x < GW; x++) {
    let low = -1; for (let y = 0; y < GH; y++) if (g[y * GW + x] === 1 || g[y * GW + x] === 2) low = y;
    if (low >= 0 && hash(x, 0, 1461, o.seed || 0) < o.drip) { const len = 1 + Math.floor(hash(x, 1, 1461, o.seed || 0) * 4); for (let y = low + 1; y <= Math.min(GH - 1, low + len); y++) if (!g[y * GW + x]) g[y * GW + x] = 4; }
  }
  return { g, GW, GH };
}
overlay('til_tag', (o, c) => {
  if (o.under) { const f = OVERLAYS[o.under.type]; if (f) f(o.under, c); }
  if (c.face !== o.face) return;
  const L = c.face === LEFT;
  const la = faceLA(c, L, o.a0), lt = 2 * o.zTop - 1 - Math.floor(2 * c.hz);
  if (!o.grid) o.grid = tagGrid(o);
  const { g, GW, GH } = o.grid;
  if (la < 0 || lt < 0 || la >= GW || lt >= GH) return;
  const v = g[lt * GW + la];
  if (!v || (o.worn && hash(la, lt, 1462, o.seed || 0) < o.worn)) return;
  const col = v === 1 ? o.fill : v === 2 ? (o.line || o.fill) : v === 3 ? (o.shade || [0.08, 0.08, 0.09]) : (o.style === 'throw' ? (o.line || o.fill) : o.fill);
  rgbA(c, col);
  if (v === 1 && o.fill2 && (lt % 4 < 2)) rgbA(c, o.fill2);
  c.er = c.eg = c.eb = 0;
});
// Les lignes du city-stade, peintes sur le gazon synthétique (en texels de 10 cm).
overlay('til_lignes', (o, c) => {
  if (c.face !== TOP) return;
  const ta = Math.floor(2 * c.hx) - 2 * o.x0, tb = Math.floor(2 * c.hy) - 2 * o.y0, A = 2 * (o.x1 - o.x0) - 1, Bm = 2 * (o.y1 - o.y0) - 1;
  const ca = A / 2, cb = Bm / 2;
  let on = ta === 2 || ta === A - 2 || tb === 2 || tb === Bm - 2;
  if (Math.abs(ta - ca) < 0.6) on = true;
  if (Math.abs(Math.hypot(ta - ca, tb - cb) - 16) < 0.7) on = true;
  for (const ga of [2, A - 2]) if (Math.abs(Math.hypot(ta - ga, tb - cb) - 26) < 0.7 && Math.abs(ta - ga) < 27) on = true;
  if (on && ta >= 2 && ta <= A - 2 && tb >= 2 && tb <= Bm - 2 && hash(ta, tb, 1471, 0) > (o.use || 0.08)) { rgb(c, 0.82, 0.82, 0.76); c.wet *= 0.3; }
});
// La fresque du pignon de la barre A : un couchant, les tours en ombre chinoise, un gamin qui frappe le ballon.
const GAMIN = [
  '.......###..........',
  '......#####.........',
  '......#####.........',
  '.......###..........',
  '........#...........',
  '.....#######........',
  '....#########.......',
  '...##.#####.###.....',
  '..##..#####...##....',
  '.##...#####....##...',
  '......#####.........',
  '......######........',
  '......###.####......',
  '.....###....####....',
  '.....##.......####..',
  '....###.........###.',
  '....##..............',
  '...###..............',
  '...##...............',
  '..###...............',
];
overlay('til_fresque', (o, c) => {
  if (o.under) { const f = OVERLAYS[o.under.type]; if (f) f(o.under, c); }
  if (c.face !== o.face) return;
  const L = c.face === LEFT;
  const la = faceLA(c, L, o.a0), lb = Math.floor(2 * c.hz) - 2 * o.z0, W2 = 2 * o.w, H2 = 2 * o.h;
  if (la < 0 || lb < 0 || la >= W2 || lb >= H2) return;
  const lt = H2 - 1 - lb;
  if (la === 0 || la === W2 - 1 || lb === 0 || lt === 0) { rgb(c, 0.20, 0.18, 0.17); return; }
  // le ciel du couchant, en bandes
  const t = lb / H2, band = Math.floor(t * 9);
  const SKY = [[0.86, 0.42, 0.18], [0.90, 0.50, 0.20], [0.92, 0.58, 0.24], [0.90, 0.66, 0.30], [0.80, 0.56, 0.42], [0.62, 0.42, 0.50], [0.44, 0.32, 0.52], [0.30, 0.26, 0.48], [0.22, 0.20, 0.40]];
  let col = SKY[Math.min(8, band)];
  // le soleil
  const sx = W2 * 0.62, sy = H2 * 0.40, d = Math.hypot(la - sx, (lb - sy) * 1.0);
  if (d < 22) col = d < 20 ? [0.98, 0.84, 0.42] : [0.95, 0.70, 0.32];
  // les tours de la cité en ombre chinoise, à droite, d'un violet sombre ; leurs fenêtres allumées
  const towers = [[44, 54, 0.46], [54, 64, 0.30], [64, 74, 0.56], [72, 80, 0.38]];
  for (const [a0, a1, hh] of towers) if (la >= a0 && la < a1 && lb < H2 * hh) {
    col = [0.30, 0.20, 0.34];
    if (mod(la - a0, 3) === 1 && mod(lb, 5) === 2 && hash(la, lb, 1481, 0) < 0.55) col = [0.98, 0.80, 0.42];
  }
  // le sol : la pelouse du stade, ses bandes
  if (lb < 8) col = mod(Math.floor(la / 6), 2) ? [0.24, 0.46, 0.22] : [0.30, 0.52, 0.26];
  // le gamin qui frappe le ballon, presque noir sur le couchant
  const px = 3, ox = 2, gx = Math.floor((la - ox) / px), gy = Math.floor((lt - (H2 - 7 - GAMIN.length * px)) / px);
  if (gy >= 0 && gy < GAMIN.length && gx >= 0 && gx < GAMIN[0].length && GAMIN[gy][gx] === '#') col = [0.10, 0.08, 0.12];
  const bxx = ox + 20 * px + 3, byy = 7 + 6 * px;
  const db = Math.hypot(la - bxx, lb - byy);
  if (db < 5.2) col = db > 4.3 ? [0.10, 0.08, 0.12] : (mod(Math.floor((la - lb) / 2), 3) === 0 ? [0.18, 0.18, 0.20] : [0.95, 0.94, 0.90]);
  // la trace du ballon : trois traits
  if (lb === byy + 2 && la > bxx + 6 && la < bxx + 12 && mod(la, 2) === 0) col = [0.95, 0.94, 0.90];
  rgbA(c, col, 0.92); grain(c, 0.05);
});

// ================================================================ personnages (1 pixel = 10 cm)
const KK = [0.06, 0.045, 0.04];
const BASE = {
  k: KK, s: [0.86, 0.69, 0.55], S: [0.66, 0.48, 0.37], h: [0.17, 0.11, 0.08], H: [0.30, 0.20, 0.13],
  o: [0.09, 0.09, 0.09], j: [0.24, 0.30, 0.42], J: [0.16, 0.20, 0.30], g: [0.46, 0.46, 0.45], G: [0.32, 0.32, 0.32],
  b: [0.84, 0.82, 0.76], w: [0.66, 0.66, 0.64],
};
const PEAU = [
  { s: [0.86, 0.69, 0.55], S: [0.66, 0.48, 0.37] }, { s: [0.72, 0.52, 0.38], S: [0.54, 0.38, 0.27] },
  { s: [0.50, 0.33, 0.22], S: [0.36, 0.23, 0.15] }, { s: [0.38, 0.25, 0.17], S: [0.27, 0.17, 0.11] },
];
const CHEVEUX = [{ h: [0.06, 0.05, 0.05] }, { h: [0.17, 0.11, 0.08] }, { h: [0.36, 0.24, 0.14] }, { h: [0.62, 0.48, 0.24] }, { h: [0.55, 0.55, 0.53] }];
function spr(rows, extra, ax, o = {}) {
  const w = rows[0].length;
  rows.forEach((r, i) => { if (r.length !== w) throw new Error(`sprite : ligne ${i} de ${r.length} au lieu de ${w} : « ${r} »`); });
  return Object.assign({ rows, pal: Object.assign({}, BASE, extra), ax }, o);
}
const varie = (def, ...extra) => Object.assign({}, def, { pal: Object.assign({}, def.pal, ...extra) });
// l'ado : le sweat à capuche baissée, le jogging, les baskets blanches
const ADO = spr([
  '...kkkk...',
  '..khhhhk..',
  '..khsssk..',
  '..ksksskk.',
  '..kssssk..',
  '..kqSSqk..',
  '.kqqqqqqk.',
  'kqqqqqqqqk',
  'kqqqQqqqqk',
  'kqqqQqqqqk',
  'ksqQQQqqsk',
  '.kqqqqqqk.',
  '.kjjjjjjk.',
  '.kjjkkjjk.',
  '.kjjk.jjk.',
  '.kjjk.jjk.',
  '.kbbk.bbk.',
  '..kk...kk.',
], { q: [0.30, 0.32, 0.36], Q: [0.20, 0.21, 0.24], j: [0.16, 0.16, 0.18], b: [0.86, 0.85, 0.82] }, 4);
// l'ado assis sur un muret, les jambes pendantes
const ADO_ASSIS = spr([
  '..kkkk...',
  '.khhhhk..',
  '.khsssk..',
  '.kssksk..',
  '..kssk...',
  '.kqqqqk..',
  'kqqqqqqk.',
  'kqqqqqsk.',
  'kqqqqk...',
  'kjjjjjjk.',
  '.kkkkjjk.',
  '....kjjk.',
  '....kbbk.',
], { q: [0.55, 0.16, 0.16], j: [0.16, 0.16, 0.18], b: [0.86, 0.85, 0.82] }, 3);
// le gamin du city-stade : maillot de couleur, short, chaussettes hautes
const GAMIN_SP = spr([
  '..kkkk..',
  '.khhhhk.',
  '.khssskk',
  '.kssssk.',
  '..kSSk..',
  '.kttttk.',
  'kttwwttk',
  'ksttttsk',
  '.kttttk.',
  '.kpppk..',
  '.kspsk..',
  '.kt.tk..',
  '.ko.ok..',
  '..k.k...',
], { t: [0.20, 0.40, 0.70], w: [0.86, 0.85, 0.80], p: [0.12, 0.12, 0.14] }, 3);
const GAMIN_TIR = spr([
  '..kkkk....',
  '.khhhhk...',
  '.khssskk..',
  '.kssssk...',
  '..kSSk....',
  '.kttttk...',
  'kttwwttkk.',
  'ksttttk.sk',
  '.kttttk...',
  '.kpppppk..',
  '.ksk..kssk',
  '.kt....ktk',
  '.ko.....ok',
  '..k.......',
], { t: [0.78, 0.22, 0.20], w: [0.86, 0.85, 0.80], p: [0.12, 0.12, 0.14] }, 3);
// la mère et la poussette
const POUSSETTE = spr([
  '...kkkk.......',
  '..khhhhk......',
  '..khsssk......',
  '..kssksk......',
  '..kssssk......',
  '...kSSk.......',
  '..kvvvvk......',
  '.kvvvvvvk.....',
  '.kvvvvvvkkkkk.',
  '.kvVvvvvsk..k.',
  '.ksvvvvvk.kppk',
  '..kvvvvvk.kppk',
  '..kvvvvvk.kppk',
  '..kjjjjk..kkkk',
  '..kjjkjk..k..k',
  '..kjjkjk.kok.k',
  '..kookok..k.ok',
  '...kk.k.......',
], { v: [0.62, 0.30, 0.42], V: [0.48, 0.22, 0.32], j: [0.20, 0.20, 0.24], p: [0.28, 0.34, 0.50] }, 4);
// l'ancien : casquette, veste, la canne
const ANCIEN = spr([
  '..kkkkk...',
  '.kccccccc.',
  '..ksssk...',
  '..ksksk...',
  '..kssssk..',
  '...kSSk...',
  '..kvvvvk..',
  '.kvvvvvvk.',
  '.kvvvvvvk.',
  '.kvVvvvvk.',
  '.ksvvvvvsk',
  '..kvvvvk.w',
  '..kjjjjk.w',
  '..kjjkjk.w',
  '..kjjkjk.w',
  '..kjjkjk.w',
  '..kookok.w',
  '...kk.k..k',
], { c: [0.25, 0.25, 0.28], v: [0.44, 0.38, 0.30], V: [0.32, 0.27, 0.21], j: [0.30, 0.28, 0.26], w: [0.40, 0.28, 0.16] }, 4);
// la dame aux cabas, qui sort de la supérette
const CABAS = spr([
  '...kkkk....',
  '..khhhhk...',
  '..khsssk...',
  '..kssksk...',
  '..kssssk...',
  '...kSSk....',
  '..kffffk...',
  '.kffffffk..',
  '.kffffffk..',
  'kkfFfffffk.',
  'krksffffsk.',
  'krrkffffkrk',
  'krrkffffkrk',
  '.kkkddddkkk',
  '...kddddk..',
  '...kssksk..',
  '...kookok..',
  '....kk.k...',
], { f: [0.30, 0.46, 0.44], F: [0.22, 0.34, 0.33], d: [0.40, 0.20, 0.26], r: [0.80, 0.78, 0.70] }, 4);
// le promeneur et son chien
const CHIEN = spr([
  '.......kk',
  'k.....kbk',
  'kk...kbbk',
  '.kbbbbbk.',
  '.kbkkkbk.',
  '.kk...kk.',
], { b: [0.80, 0.74, 0.62] }, 4, { shadowR: 3 });
const CANARD = spr(['..kk.', '.kgek', 'kgggk', '.kkk.'], { g: [0.34, 0.30, 0.22], e: [0.80, 0.60, 0.20] }, 2, { shadow: false });

// ================================================================ outils
// Tout ce que le quartier écrit reste dans son rectangle (les houppiers et les feuilles mortes dépassent
// parfois) : on borne set, box, inb et stampLeaves le temps de la construction.
function enclos(W, w, h) {
  const P = Object.getPrototypeOf(W);
  W.inb = function (x, y, z) { return x >= 0 && y >= 0 && x < w && y < h && P.inb.call(this, x, y, z); };
  W.set = function (x, y, z, m, t) { if (x >= 0 && y >= 0 && x < w && y < h) P.set.call(this, x, y, z, m, t); };
  W.box = function (x0, y0, z0, x1, y1, z1, m, t) { P.box.call(this, Math.max(0, Math.round(x0)), Math.max(0, Math.round(y0)), z0, Math.min(w, Math.round(x1)), Math.min(h, Math.round(y1)), z1, m, t); };
  W.stampLeaves = function (cx, cy, r, amt) {
    for (let y = Math.max(0, Math.floor(cy - r)); y < Math.min(h, cy + r); y++) for (let x = Math.max(0, Math.floor(cx - r)); x < Math.min(w, cx + r); x++) {
      const d = Math.hypot(x - cx, y - cy) / r, gx = x + this.ox, gy = y + this.oy;
      if (d < 1 && gx >= 0 && gy >= 0 && gx < this.X && gy < this.Y) this.leaf[gy * this.X + gx] += amt * (1 - d) * (1 - d);
    }
  };
}

// Le sol : une surface (herbe, enrobé, dalle) posée à hauteur de trottoir, hors du couloir de la Rive.
function sol(k, x0, y0, x1, y1, m, t = 0) {
  const W = k.W;
  for (const [a, b] of [[y0, Math.min(y1, RIV0)], [Math.max(y0, RIV1), y1]]) if (b > a) {
    W.box(x0, a, 1, x1, b, 2, m, t); W.box(x0, a, 2, x1, b, 3, 0);
  }
}
// Une chaussée : l'enrobé à z = 0 (le dessus à 1), bordures et caniveaux le long des trottoirs.
function chaussee(k, x0, y0, x1, y1, o = {}) {
  const W = k.W;
  W.box(x0, y0, 0, x1, y1, 3, 0); W.box(x0, y0, 0, x1, y1, 1, M.ASPHALT);
  const along = o.axe || (x1 - x0 >= y1 - y0 ? 'x' : 'y');
  if (along === 'x') {
    if (!o.sansBordN) { W.box(x0, y0 - 1, 0, x1, y0, 2, M.CURB); W.box(x0, y0, 0, x1, y0 + 1, 1, M.GUTTER); }
    if (!o.sansBordS) { W.box(x0, y1, 0, x1, y1 + 1, 2, M.CURB); W.box(x0, y1 - 1, 0, x1, y1, 1, M.GUTTER); }
    if (o.axeLigne) { const mid = (y0 + y1) >> 1; for (let x = x0 + 4; x < x1 - 8; x += 16) W.box(x, mid - 1, 0, x + 9, mid + 1, 1, M.ROADLINE); }
  } else {
    if (!o.sansBordO) { W.box(x0 - 1, y0, 0, x0, y1, 2, M.CURB); W.box(x0, y0, 0, x0 + 1, y1, 1, M.GUTTER); }
    if (!o.sansBordE) { W.box(x1, y0, 0, x1 + 1, y1, 2, M.CURB); W.box(x1 - 1, y0, 0, x1, y1, 1, M.GUTTER); }
  }
}
// Un trottoir neuf (la dalle du maître, rendue à son niveau).
function trottoir(k, x0, y0, x1, y1) { const W = k.W; W.box(x0, y0, 0, x1, y1, 2, M.SIDEWALK); W.box(x0, y0, 2, x1, y1, 3, 0); }
// Le parking : des places en épi droit, leurs lignes blanches dans l'enrobé.
function stalles(k, x0, y0, x1, y1, pas, sens) {
  const W = k.W;
  if (sens === 'y') { for (let x = x0; x <= x1; x += pas) W.box(x, y0 + 1, 0, x + 1, y1 - 1, 1, M.ROADLINE); }
  else { for (let y = y0; y <= y1; y += pas) W.box(x0 + 1, y, 0, x1 - 1, y + 1, 1, M.ROADLINE); }
}

// Le tilleul : un fût droit, des branches maîtresses, un houppier ovale fait de lobes, doré à l'automne.
function tilleul(W, x, y, zg, o = {}) {
  const seed = o.seed || 1, R = o.r || 10, th = o.tronc || Math.round(6 + R * 0.7);
  const rnd = i => hash(seed, i, 1, 1771);
  const RZ = R * 1.22, zc = zg + th + RZ * 0.82;
  W.box(x, y, zg, x + 2, y + 2, Math.round(zc), M.WOOD_DARK);
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2 + rnd(i) * 1.3, len = R * (0.55 + 0.3 * rnd(i + 9));
    for (let t = 1; t <= len; t++) W.set(Math.round(x + 0.5 + Math.cos(a) * t * 0.8), Math.round(y + 0.5 + Math.sin(a) * t * 0.8), zg + th - 2 + Math.round(t * 0.95), M.WOOD_DARK);
  }
  const lobes = [[x + 1, y + 1, zc, R * 0.92, RZ]];
  const nb = 4 + Math.floor(rnd(20) * 3);
  for (let i = 0; i < nb; i++) {
    const a = i * 2 * Math.PI / nb + rnd(30 + i) * 0.9, d = R * (0.42 + 0.26 * rnd(40 + i));
    lobes.push([x + 1 + Math.cos(a) * d, y + 1 + Math.sin(a) * d, zc + (rnd(50 + i) - 0.45) * RZ * 0.7, R * (0.52 + 0.2 * rnd(60 + i)), RZ * (0.48 + 0.2 * rnd(70 + i))]);
  }
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, z0 = 1e9, z1 = -1e9;
  for (const l of lobes) { x0 = Math.min(x0, l[0] - l[3]); x1 = Math.max(x1, l[0] + l[3]); y0 = Math.min(y0, l[1] - l[3]); y1 = Math.max(y1, l[1] + l[3]); z0 = Math.min(z0, l[2] - l[4]); z1 = Math.max(z1, l[2] + l[4]); }
  for (let z = Math.floor(z0); z <= z1; z++) for (let yy = Math.floor(y0); yy <= y1; yy++) for (let xx = Math.floor(x0); xx <= x1; xx++) {
    let dens = 0;
    for (const l of lobes) { const d = 1 - Math.hypot((xx + 0.5 - l[0]) / l[3], (yy + 0.5 - l[1]) / l[3], (z - l[2]) / l[4]); if (d > dens) dens = d; }
    if (dens <= 0) continue;
    const n = E.vnoise(xx * 0.33 + z * 0.21, yy * 0.33 - z * 0.17, seed) * 0.6 + hash(xx, yy, z, seed) * 0.4;
    if (dens > 0.05 + 0.3 * n && W.get(xx, yy, z) === 0) W.set(xx, yy, z, M.TIL_TILLEUL);
  }
  W.stampLeaves(x + 1, y + 1, o.leafR || R * 1.8, o.leafAmt || 0.8);
}
// Le réverbère de la cité : un mât haut, une lanterne plate ; il éclaire les parkings et les allées.
function mat(k, x, y, o = {}) {
  const W = k.W, h = o.h || 26, on = k.night && !(k.bad && k.rh(x, y, 1501) < 0.18) && o.on !== false;
  W.box(x, y, G, x + 1, y + 1, G + h, M.METAL_DARK); W.box(x, y, G, x + 1, y + 1, G + 2, M.METAL);
  const dx = o.dx || 0, dy = o.dy || 0;
  for (let i = 1; i <= 3; i++) W.set(x + dx * i, y + dy * i, G + h - 1, M.METAL_DARK);
  const hx = x + dx * 4, hy = y + dy * 4;
  W.box(hx - (dy ? 1 : 0), hy - (dx ? 1 : 0), G + h - 1, hx + 1 + (dy ? 1 : 0), hy + 1 + (dx ? 1 : 0), G + h, M.METAL_DARK);
  W.set(hx, hy, G + h - 2, on ? M.BULB : M.GLASS);
  if (on) { const I = o.I || 2.4; W.light({ x: hx + 0.5, y: hy + 0.5, z: G + h - 2.6, r: o.r || 70, fall: 2.1, cr: 1.0 * I, cg: 0.64 * I, cb: 0.30 * I, spot: 0.55, skip: 2.2 }); }
}
// Une borne lumineuse le long des allées
function borne(k, x, y, on = true) {
  const W = k.W; W.box(x, y, G, x + 1, y + 1, G + 4, M.METAL_DARK); W.set(x, y, G + 4, k.night && on ? M.BULB : M.PLASTIC_WHITE); W.set(x, y, G + 5, M.METAL_DARK);
  if (k.night && on) { W.light({ x: x + 0.5, y: y + 0.5, z: G + 4.5, r: 18, cr: 0.8, cg: 0.6, cb: 0.32, shadow: false }); }
}
// Une voiture garée (21 voxels de long, 8 de large), l'avant vers dir ; modèles : berline, citadine, break, fourgon.
function voiture(W, x, y, zg, axis, dir, paint, o = {}) {
  const md = o.modele || 'berline', L = md === 'citadine' ? 16 : md === 'fourgon' ? 20 : 21;
  const put = (a, b, z, m) => { const aa = dir < 0 ? a : L - 1 - a; if (axis === 'x') W.set(x + aa, y + b, zg + z, m); else W.set(x + b, y + aa, zg + z, m); };
  const bx = (a0, b0, z0, a1, b1, z1, m) => { for (let a = a0; a < a1; a++) for (let b = b0; b < b1; b++) for (let z = z0; z < z1; z++) put(a, b, z, m); };
  for (const a0 of [3, L - 6]) for (const b of [0, 7]) bx(a0, b, 0, a0 + 3, b + 1, 3, M.TIRE);
  bx(0, 1, 1, L, 7, 4, paint);
  bx(0, 1, 1, 1, 7, 2, M.CHROME); bx(L - 1, 1, 1, L, 7, 2, M.CHROME);
  if (md === 'fourgon') { bx(1, 1, 4, 5, 7, 7, M.CAR_GLASS); bx(1, 1, 7, 5, 7, 8, paint); bx(5, 1, 4, L, 7, 9, paint); }
  else {
    const c0 = md === 'citadine' ? 4 : 6, c1 = md === 'citadine' ? 14 : md === 'break' ? L - 1 : 15;
    bx(c0, 1, 4, c1, 7, 6, M.CAR_GLASS);
    bx(c0, 1, 4, c0 + 1, 7, 6, paint); bx((c0 + c1) >> 1, 1, 4, ((c0 + c1) >> 1) + 1, 7, 6, paint); bx(c1 - 1, 1, 4, c1, 7, 6, paint);
    bx(c0 + 1, 1, 6, c1 - (md === 'break' ? 0 : 1), 7, 7, paint);
    if (md !== 'break') bx(c1, 1, 4, L - 1, 7, 5, paint);
  }
  put(0, 1, 2, o.phares ? M.HEADLIGHT : M.WHITE); put(0, 6, 2, o.phares ? M.HEADLIGHT : M.WHITE);
  put(L - 1, 1, 2, o.phares ? M.TAILLIGHT : M.PLASTIC_RED); put(L - 1, 6, 2, o.phares ? M.TAILLIGHT : M.PLASTIC_RED);
}
// Le scooter, sur sa béquille
function scooter(W, x, y, zg, axis, paint) {
  const B2 = (a0, b0, z0, a1, b1, z1, m) => axis === 'x' ? W.box(x + a0, y + b0, zg + z0, x + a1, y + b1, zg + z1, m) : W.box(x + b0, y + a0, zg + z0, x + b1, y + a1, zg + z1, m);
  B2(0, 0, 0, 2, 1, 2, M.TIRE); B2(6, 0, 0, 8, 1, 2, M.TIRE);
  B2(1, 0, 2, 7, 1, 3, paint); B2(4, 0, 3, 7, 1, 4, paint); B2(4, 0, 4, 7, 1, 5, M.METAL_DARK);
  B2(1, 0, 3, 2, 1, 7, paint); B2(1, -1, 7, 2, 2, 8, M.METAL_DARK);
}
function banc(W, x, y, zg, axis) { B.bench(W, x, y, zg, axis); }
function corbeille(W, x, y) { W.box(x, y, G, x + 1, y + 1, G + 3, M.METAL_DARK); W.box(x - 1, y - 1, G + 3, x + 2, y + 2, G + 6, M.METAL_GREEN); W.box(x, y, G + 5, x + 1, y + 1, G + 6, 0); }
// Les conteneurs à poubelles, couvercle vert ou jaune
function conteneur(W, x, y, couv) { W.box(x, y, G, x + 4, y + 4, G + 5, M.METAL_DARK); W.box(x, y, G + 5, x + 4, y + 4, G + 6, couv); W.set(x, y + 1, G + 1, M.TIRE); }
module.exports = {
  w: LX, h: LY, seed: 1962, zmax: 180, riviere: 326,
  build(W, ctx) {
    enclos(W, LX, LY);
    try { return construire(W, ctx); } finally { delete W.set; delete W.box; delete W.inb; delete W.stampLeaves; }
  },
};

// ================================================================ l'immeuble à trame
// o : { x0, y0, x1, y1, niv (niveaux de FH), col (le béton), fond (le fond des loggias), allege(b, e) (la couleur
//       des allèges), brique (un parement), volet, cadre, cageCol, toit (des gravillons), edicules, nomHall(b), seed,
//       faces: [{ face (LEFT +y | RIGHT +x), bw (la travée), m (la marge), type(b, e), lg (la profondeur des loggias),
//                 garde(b, e) (le garde-corps : { col } ou { barreaux }), saillie (les balcons), grilles (au rez-de-chaussée) }] }
const GEO = bw => ({
  fen: { ws: (bw - 8) >> 1, ww: 8, wz: 4, wh: 8 },
  fen2: { ws: (bw - 10) >> 1, ww: 10, wz: 3, wh: 9 },
  pfen: { ws: (bw - 4) >> 1, ww: 4, wz: 5, wh: 6 },
  log: { ws: 2, ww: bw - 4, wz: 1, wh: 11 },
  bal: { ws: (bw - 8) >> 1, ww: 8, wz: 1, wh: 11 },
  rdc: { ws: (bw - 8) >> 1, ww: 8, wz: 5, wh: 7 },
});
function immeuble(k, o) {
  const W = k.W, { x0, y0, x1, y1, niv } = o;
  const w = x1 - x0, d = y1 - y0, zt = G + niv * FH, seed = o.seed || 1;
  const mur = W.obj({ type: 'til_mur', z0: G, col: o.col, fond: o.fond, allege: o.allege || null, brique: o.brique || null, seed, L: null, R: null });
  const om = W.objects[mur];
  W.box(x0, y0, G, x1, y1, zt, M.TIL_PANNEAU, mur);
  const vit = W.obj({ type: 'til_vitre', z0: G, seed: seed * 7 + 3, night: k.night, bad: k.bad, volet: o.volet || [0.74, 0.71, 0.64], cadre: o.cadre || [0.80, 0.79, 0.74], L: null, R: null });
  const ov = W.objects[vit];
  const res = { x0, y0, x1, y1, zt, mur, vit, om, fac: {} };
  for (const fs of o.faces) {
    const face = fs.face, len = face === LEFT ? w : d, bw = fs.bw || 16;
    const m = fs.m != null ? fs.m : Math.floor((len - Math.floor(len / bw) * bw) / 2);
    const nb = Math.floor((len - m) / bw);
    const g = { a0: face === LEFT ? x0 : y1, m, bw, nb, ne: niv, x1, y1, lg: fs.lg || 7, type: fs.type, geo: GEO(bw) };
    if (face === LEFT) { om.L = g; ov.L = g; } else { om.R = g; ov.R = g; }
    const f = new Facade(W, face, x0, y0, w, d);
    res.fac[face === LEFT ? 'L' : 'R'] = { f, g };
    for (let e = 0; e < niv; e++) for (let b = 0; b < nb; b++) caseImmeuble(k, f, g, b, e, fs, vit, mur, o, res);
    // les cages d'escalier : une colonne de pavés de verre en saillie, peinte
    for (let b = 0; b < nb; b++) if (fs.type(b, 1) === 'cage') {
      const s0 = m + b * bw, cw = bw - 6;
      const tc = k.peint(o.cageCol || o.col);
      for (let dp = -2; dp < 0; dp++) f.rect(s0 + 2, G + FH, s0 + bw - 2, zt + 2, dp, M.TIL_PANNEAU, tc);
      const cid = W.obj({ type: 'til_cage', face, a0: f.a0(s0 + 3), z0: G + FH + 6, w: cw, night: k.night, bad: k.bad, seed: seed * 31 + b });
      for (let e = 1; e < niv; e++) {
        const za = G + e * FH + 6, zb = Math.min(za + 9, zt);
        f.rect(s0 + 3, za, s0 + 3 + cw, zb, -2, 0); f.rect(s0 + 3, za, s0 + 3 + cw, zb, -1, M.GLASS, cid);
      }
    }
  }
  // le toit : la dalle, l'acrotère, les édicules d'ascenseur au-dessus des cages, les ventilations
  W.box(x0, y0, zt, x1, y1, zt + 1, M.ROOF_FLAT, o.toit ? k.peint(o.toit, null, { type: 'til_toit' }) : 0);
  for (const [a, b, c2, d2] of [[x0, y0, x1, y0 + 1], [x0, y1 - 1, x1, y1], [x0, y0, x0 + 1, y1], [x1 - 1, y0, x1, y1]]) { W.box(a, b, zt + 1, c2, d2, zt + 3, M.TIL_PANNEAU, mur); W.box(a, b, zt + 3, c2, d2, zt + 4, M.CONCRETE); }
  const roofs = o.edicules || [];
  for (const [ex, ey, ew, ed] of roofs) {
    W.box(ex, ey, zt + 1, ex + ew, ey + ed, zt + 9, M.TIL_PANNEAU, mur); W.box(ex - 1, ey - 1, zt + 9, ex + ew + 1, ey + ed + 1, zt + 10, M.CONCRETE);
    const fe = new Facade(W, LEFT, ex, ey, ew, ed); fe.door(2, zt + 1, 3, 6, { mat: M.METAL_DARK, frame: false });
    W.box(ex + ew - 4, ey + 2, zt + 10, ex + ew - 1, ey + 5, zt + 12, M.METAL);
  }
  for (let i = 0; i < Math.floor(w * d / 900); i++) {
    const vx = x0 + 4 + Math.floor(k.rh(x0 + i, y0, 1601) * (w - 10)), vy = y0 + 4 + Math.floor(k.rh(x0, y0 + i, 1602) * (d - 10));
    if (W.get(vx, vy, zt + 1) || W.get(vx + 2, vy + 2, zt + 1)) continue;
    const t = k.rh(vx, vy, 1603);
    if (t < 0.5) { W.box(vx, vy, zt + 1, vx + 2, vy + 2, zt + 4, M.METAL); W.box(vx - 1, vy - 1, zt + 4, vx + 3, vy + 3, zt + 5, M.METAL_DARK); }
    else if (t < 0.8) W.box(vx, vy, zt + 1, vx + 4, vy + 3, zt + 3, M.CONCRETE);
    else { W.box(vx, vy, zt + 1, vx + 5, vy + 4, zt + 2, M.METAL); W.box(vx + 1, vy + 1, zt + 2, vx + 4, vy + 3, zt + 3, k.night && t > 0.9 ? M.SKYLIGHT : M.GLASS); }
  }
  return res;
}
// Une case de la trame : fenêtre, loggia, balcon, hall, local, porche…
function caseImmeuble(k, f, g, b, e, fs, vit, mur, o, res) {
  const W = k.W, t = fs.type(b, e), s0 = g.m + b * g.bw, zf = G + e * FH, bw = g.bw, q = g.geo[t];
  const depthMax = f.face === LEFT ? res.y1 - res.y0 : res.x1 - res.x0;
  switch (t) {
    case 'fen': case 'fen2': case 'pfen': case 'rdc': {
      f.rect(s0 + q.ws, zf + q.wz, s0 + q.ws + q.ww, zf + q.wz + q.wh, 0, 0);
      f.rect(s0 + q.ws, zf + q.wz, s0 + q.ws + q.ww, zf + q.wz + q.wh, 1, M.GLASS, vit);
      if (o.appui !== false) f.rect(s0 + q.ws - 1, zf + q.wz - 1, s0 + q.ws + q.ww + 1, zf + q.wz, -1, M.CONCRETE);
      if (t === 'rdc' && fs.grilles) for (let i = 0; i < q.ww; i += 2) f.rect(s0 + q.ws + i, zf + q.wz, s0 + q.ws + i + 1, zf + q.wz + q.wh, 0, M.METAL_DARK);
      break;
    }
    case 'log': {
      const lg = g.lg;
      for (let dp = 0; dp < lg; dp++) f.rect(s0 + 1, zf + 1, s0 + bw - 1, zf + FH, dp, 0);
      f.rect(s0 + q.ws, zf + q.wz, s0 + q.ws + q.ww, zf + q.wz + q.wh, lg, M.GLASS, vit);
      // le garde-corps : un panneau plein (de couleur) ou des barreaux
      const gc = fs.garde ? fs.garde(b, e) : null;
      if (gc && gc.barreaux) {
        f.rect(s0 + 1, zf + 5, s0 + bw - 1, zf + 6, 0, M.METAL_DARK);
        for (let s = s0 + 1; s < s0 + bw - 1; s += 2) f.rect(s, zf + 1, s + 1, zf + 5, 0, M.METAL_DARK);
      } else {
        const pid = gc && gc.col ? k.peint(gc.col, gc.pat) : 0;
        f.rect(s0 + 1, zf + 1, s0 + bw - 1, zf + 6, 0, pid ? M.PLASTIC_WHITE : M.TIL_PANNEAU, pid || mur);
        f.rect(s0 + 1, zf + 6, s0 + bw - 1, zf + 7, 0, M.METAL);
      }
      // la vie de la loggia : le linge, les plantes, un vélo, une chaise
      const v = k.rh(f.a0(s0), e, 1611 + f.face);
      if (v < (k.night ? 0.16 : 0.32)) {
        for (let s = s0 + 2; s < s0 + bw - 2; s++) f.set(s, zf + 11, 3, M.METAL_DARK);
        for (let s = s0 + 3; s < s0 + bw - 3; s += 3) { const len = 2 + Math.floor(k.rh(s, e, 1612) * 3); for (let i = 0; i < 2; i++) for (let z = zf + 11 - len; z < zf + 11; z++) f.set(s + i, z, 3, M.RES_LINGE); }
      } else if (v < 0.5) { f.set(s0 + 2, zf + 7, 1, M.RES_FLEURS); f.set(s0 + 3, zf + 7, 1, M.HEDGE); f.set(s0 + bw - 3, zf + 7, 1, M.RES_FLEURS); }
      else if (v < 0.58) { f.rect(s0 + 3, zf + 1, s0 + 9, zf + 4, 4, M.METAL); }
      else if (v < 0.64) { f.rect(s0 + bw - 5, zf + 1, s0 + bw - 3, zf + 3, 3, M.PLASTIC_WHITE); f.rect(s0 + bw - 5, zf + 3, s0 + bw - 3, zf + 6, 4, M.PLASTIC_WHITE); }
      break;
    }
    case 'bal': {
      f.rect(s0 + q.ws, zf + q.wz, s0 + q.ws + q.ww, zf + q.wz + q.wh, 0, 0);
      f.rect(s0 + q.ws, zf + q.wz, s0 + q.ws + q.ww, zf + q.wz + q.wh, 1, M.GLASS, vit);
      const prevB = b > 0 && fs.type(b - 1, e) === 'bal', nextB = b < g.nb - 1 && fs.type(b + 1, e) === 'bal';
      const sa = prevB ? s0 : s0 + 1, sb = nextB ? s0 + bw : s0 + bw - 1, out = fs.saillie || 4;
      for (let dp = -out; dp < 0; dp++) f.rect(sa, zf, sb, zf + 1, dp, M.CONCRETE);
      const gc = fs.garde ? fs.garde(b, e) : null;
      if (gc && gc.col) {
        const pid = k.peint(gc.col, gc.pat);
        f.rect(sa, zf + 1, sb, zf + 5, -out, M.PLASTIC_WHITE, pid);
        if (!prevB) for (let dp = -out; dp < 0; dp++) f.rect(sa, zf + 1, sa + 1, zf + 5, dp, M.PLASTIC_WHITE, pid);
        if (!nextB) for (let dp = -out; dp < 0; dp++) f.rect(sb - 1, zf + 1, sb, zf + 5, dp, M.PLASTIC_WHITE, pid);
      } else {
        f.rect(sa, zf + 5, sb, zf + 6, -out, M.METAL_DARK);
        for (let s = sa; s < sb; s += 2) f.rect(s, zf + 1, s + 1, zf + 5, -out, M.METAL_DARK);
        if (!prevB) for (let dp = -out; dp < 0; dp++) f.rect(sa, zf + 1, sa + 1, zf + 6, dp, M.METAL_DARK);
        if (!nextB) for (let dp = -out; dp < 0; dp++) f.rect(sb - 1, zf + 1, sb, zf + 6, dp, M.METAL_DARK);
      }
      const v = k.rh(f.a0(s0), e, 1621 + f.face);
      if (v < 0.2) { for (let s = sa + 1; s < sb - 1; s++) if (mod(s, 3)) for (let z = zf + 3; z < zf + 5; z++) f.set(s, z, -out + 1, M.RES_LINGE); }
      else if (v < 0.4) { f.set(s0 + 3, zf + 1, -2, M.RES_FLEURS); f.set(s0 + 4, zf + 1, -2, M.HEDGE); f.set(s0 + 4, zf + 2, -2, M.HEDGE); }
      else if (v < 0.46) { f.rect(s0 + 2, zf + 1, s0 + 4, zf + 3, -2, M.PLASTIC_WHITE); }
      break;
    }
    case 'hall': {
      for (let dp = 0; dp < 2; dp++) f.rect(s0 + 1, G, s0 + bw - 1, G + 12, dp, 0);
      const hid = W.obj({ type: 'til_hall', face: f.face, a0: f.a0(s0 + 1), z0: G, w: bw - 2, h: 12, night: k.night, bad: k.bad, panne: k.rh(s0, b, 1631) < 0.4, seed: b + 7 * (o.seed || 1), lum: o.hallLum });
      f.rect(s0 + 1, G, s0 + bw - 1, G + 12, 2, M.GLASS, hid);
      for (let dp = -4; dp < 0; dp++) f.rect(s0, G + 15, s0 + bw, G + 16, dp, M.CONCRETE);
      for (let dp = -4; dp < 0; dp++) { f.set(s0, G + 14, dp, M.METAL_DARK); f.set(s0 + bw - 1, G + 14, dp, M.METAL_DARK); }
      if (k.night && !(k.bad && W.objects[hid].panne)) { const p = f.front(s0 + bw / 2, G + 13, 2); W.light({ x: p.x, y: p.y, z: p.z, r: 32, cr: 0.95, cg: 0.80, cb: 0.52, skip: 1.5 }); }
      if (o.nomHall) { const txt = o.nomHall(b); const nw = Math.ceil((textBitmap(txt).w + 2) / 2); f.sign(s0 + ((bw - nw) >> 1), G + 20, txt, { plate: [0.86, 0.85, 0.80], plateMat: M.PLASTIC_WHITE, fg: [0.14, 0.18, 0.32], depth: -3, padX: 1, padY: 1, plateEmit: k.night ? [0.34, 0.34, 0.30] : null }); }
      break;
    }
    case 'local': {
      f.rect(s0 + 4, G, s0 + bw - 4, G + 10, 0, 0);
      const pid = k.peint([[0.30, 0.36, 0.40], [0.44, 0.20, 0.18], [0.36, 0.40, 0.30]][Math.floor(k.rh(s0, b, 1641) * 3)], 'nervures');
      f.rect(s0 + 4, G, s0 + bw - 4, G + 10, 1, M.METAL, pid);
      f.rect(s0 + 3, G + 10, s0 + bw - 3, G + 11, -1, M.CONCRETE);
      if (k.rh(f.a0(s0), b, 1642) < (k.bad ? 0.85 : 0.55)) tag(k, f, s0 + 4, G + 9, ['TLS', 'NOX', 'ZEB', 'KRAZ', 'SKEO'][Math.floor(k.rh(s0, b, 1643) * 5)], { style: 'tag', fill: [SPRAY.blanc, SPRAY.noir, SPRAY.rouge, SPRAY.jaune][Math.floor(k.rh(s0, b, 1644) * 4)], wob: 1, depth: 1, drip: 0.3 });
      break;
    }
    case 'porche': {
      for (let dp = 0; dp < depthMax; dp++) f.rect(s0, G, s0 + bw, G + 12, dp, 0);
      if (k.night) { const p = f.front(s0 + bw / 2, G + 11, -Math.floor(depthMax / 2)); W.light({ x: p.x, y: p.y, z: p.z, r: 30, cr: 0.62, cg: 0.66, cb: 0.62, skip: 1.2 }); }
      break;
    }
    default: break;
  }
}
// La grande lettre peinte au sommet d'une tour (ou sur un pignon)
function lettre(k, f, s0, zTop, txt, under, o = {}) {
  const W = k.W, sc = o.scale || 4, grand = o.grand !== false, bmp = grand ? grandBitmap(txt) : textBitmap(txt);
  const id = W.obj({ type: 'til_texte', face: f.face, a0: f.a0(s0), zTop, text: txt, scale: sc, grand, col: o.col || [0.86, 0.85, 0.80], under, ombre: true });
  const me = W.objects[id];
  const nw = Math.ceil(bmp.w * sc / 2) + 1, nh = Math.ceil(bmp.h * sc / 2) + 1;
  for (let s = s0; s < s0 + nw; s++) for (let z = zTop - nh; z < zTop; z++) {
    const [x, y] = f.xy(s, o.depth || 0), m = W.get(x, y, z);
    if (!m || m === M.GLASS) continue;
    const kk = W.idx(x, y, z), cur = W.tag[kk];
    if (cur && !me.under) me.under = W.objects[cur];
    W.tag[kk] = id;
  }
}
// Un tag sur une surface : on garde son calque dessous (mur, peinture), on ne touche pas aux vitres
function tag(k, f, s0, zTop, text, o) {
  const W = k.W;
  const id = W.obj(Object.assign({ type: 'til_tag', face: f.face, a0: f.a0(s0), zTop, text, seed: s0 + zTop }, o));
  const gr = tagGrid(Object.assign({ text }, o)), me = W.objects[id];
  const nw = Math.ceil(gr.GW / 2) + 1, nh = Math.ceil(gr.GH / 2) + 1;
  for (let s = s0; s < s0 + nw; s++) for (let z = zTop - nh; z < zTop; z++) {
    const [x, y] = f.xy(s, o.depth || 0); const m = W.get(x, y, z);
    if (!m || m === M.GLASS) continue;
    const kk = W.idx(x, y, z), cur = W.tag[kk];
    if (cur && W.objects[cur].type !== 'til_mur' && W.objects[cur].type !== 'til_peint') continue;
    if (cur && !me.under) me.under = W.objects[cur];
    W.tag[kk] = id;
  }
  return id;
}
const SPRAY = { rouge: [0.74, 0.14, 0.12], blanc: [0.88, 0.87, 0.82], noir: [0.07, 0.07, 0.08], bleu: [0.20, 0.34, 0.66], jaune: [0.88, 0.74, 0.18], vert: [0.20, 0.58, 0.42], rose: [0.86, 0.36, 0.60], violet: [0.46, 0.26, 0.60], gris: [0.62, 0.62, 0.60], orange: [0.90, 0.48, 0.14] };

// ================================================================ le quartier
function construire(W, ctx) {
  const k = { W, night: !!ctx.night, day: !ctx.night, bad: ctx.mood === 'bad' };
  const l0 = W.lights.length;
  const cache = {};
  k.peint = (col, pat, extra) => { const key = col.join(',') + (pat || '') + (extra ? JSON.stringify(extra) : ''); return cache[key] || (cache[key] = W.obj(Object.assign({ type: 'til_peint', col, pat, grain: 0.04 }, extra))); };
  k.SEED = Math.floor(ctx.R() * 2147483647);
  k.rh = (a, b, c = 0) => hash(a | 0, b | 0, c | 0, k.SEED);
  const P = [];
  solGeneral(k);
  bordEst(k);
  nord(k, P);
  passerelle(k);
  sud(k, P);
  ouest(k);
  verdure(k);
  gens(k);
  return { places: P, lumieres: W.lights.length - l0 };
}

// ---------------------------------------------------------------- le sol de tout le rectangle
function solGeneral(k) {
  // la pelouse partout (hors couloir), puis les rues, les trottoirs, les dalles
  sol(k, 0, 0, LX, LY, M.TIL_PELOUSE);
}
// ---------------------------------------------------------------- le bord du boulevard : un trottoir continu, une bande plantée
function bordEst(k) {
  const W = k.W;
  for (const [a, b] of [[0, RIV0], [RIV1, LY]]) {
    trottoir(k, 352, a, LX, b);
    W.box(351, a, 0, 352, b, 2, M.CURB);
  }
}

// ================================================================ le nord : la barre A, la tour B, le parc, le club de boxe
function nord(k, P) {
  const W = k.W;
  // la rue du Nord
  trottoir(k, 40, 0, 352, 10);
  chaussee(k, 40, 10, LX, 34, { axe: 'x', axeLigne: true });
  trottoir(k, 40, 34, 352, 44);
  // l'allée du parking, qui rejoint le boulevard
  trottoir(k, 40, 98, 352, 108);
  chaussee(k, 76, 108, 330, 132, { axe: 'x', sansBordS: true });
  stalles(k, 76, 108, 330, 132, 12, 'y');
  chaussee(k, 70, 132, LX, 156, { axe: 'x', sansBordN: true });
  W.box(330, 107, 0, 352, 108, 2, M.CURB);
  trottoir(k, 66, 108, 76, 132); trottoir(k, 66, 132, 70, 168);
  trottoir(k, 70, 156, 352, 164);
  // le trottoir du quai, devant le club de boxe
  trottoir(k, 44, 254, 352, RIV0);
  W.box(44, RIV0 - 1, 0, 352, RIV0, 2, M.CURB);
  // la barre A : huit niveaux, trois entrées, des loggias aux garde-corps de couleur
  const COL_A = [[0.82, 0.46, 0.16], [0.86, 0.68, 0.22], [0.24, 0.50, 0.56]];
  const patA = ['fen', 'log', 'cage', 'log', 'fen'];
  const A = immeuble(k, {
    x0: 60, y0: 50, x1: 304, y1: 98, niv: 8, seed: 11, toit: [0.50, 0.48, 0.44],
    col: [0.70, 0.66, 0.58], fond: [0.60, 0.46, 0.34], volet: [0.76, 0.72, 0.62], cadre: [0.82, 0.80, 0.74],
    allege: (b, e) => [0.40, 0.33, 0.28], cageCol: [0.64, 0.60, 0.53],
    nomHall: b => ['A1', 'A2', 'A3'][Math.floor(b / 5)],
    edicules: [[97, 76, 10, 8], [177, 76, 10, 8], [257, 76, 10, 8]],
    faces: [
      { face: LEFT, bw: 16, m: 2, lg: 7, type: (b, e) => e === 0 ? (patA[b % 5] === 'cage' ? 'hall' : b === 5 ? 'porche' : (b === 4 || b === 10) ? 'local' : 'rdc') : patA[b % 5],
        garde: (b, e) => ({ col: COL_A[Math.floor(b / 5)] }), grilles: true },
      { face: RIGHT, bw: 16, m: 0, type: () => 'plein' },
    ],
  });
  // la fresque du pignon est, face au boulevard
  {
    const f = A.fac.R.f;
    const fid = W.obj({ type: 'til_fresque', face: RIGHT, a0: f.a0(4), z0: 30, w: 40, h: 70, under: A.om });
    for (let s = 4; s < 44; s++) for (let z = 30; z < 100; z++) { const [x, y] = f.xy(s, 0); W.tag[W.idx(x, y, z)] = fid; }
    const tf = W.obj({ type: 'til_texte', face: RIGHT, a0: f.a0(6), zTop: 108, text: 'TILLEULS', scale: 2, col: [0.90, 0.86, 0.74], under: A.om, ombre: true });
    for (let s = 6; s < 42; s++) for (let z = 100; z < 108; z++) { const [x, y] = f.xy(s, 0); W.tag[W.idx(x, y, z)] = tf; }
    lettre(k, f, 19, 27, 'A', A.om, { scale: 3, col: [0.90, 0.86, 0.74] });
    for (const y of [60, 88]) {
      W.box(308, y, G, 310, y + 2, G + 2, M.METAL_DARK); W.set(308, y, G + 2, k.night ? M.FLOOD : M.FLOOD_OFF);
      if (k.night) { const ax = [-0.42, y < 70 ? 0.12 : -0.12, 0.9], al = Math.hypot(...ax); W.light({ x: 307.5, y: y + 1, z: G + 3, r: 92, fall: 1.3, cr: 1.05, cg: 0.92, cb: 0.72, axis: ax.map(v => v / al), c0: 0.55, c1: 0.85, spill: 0.04, skip: 2 }); }
    }
  }
  // la tour B : dix niveaux, parement de brique, loggias d'angle
  const TB = immeuble(k, {
    x0: 10, y0: 108, x1: 66, y1: 164, niv: 10, seed: 23,
    col: [0.66, 0.62, 0.55], brique: [0.56, 0.30, 0.21], fond: [0.70, 0.66, 0.58], volet: [0.66, 0.60, 0.50], cadre: [0.84, 0.82, 0.76],
    edicules: [[30, 124, 10, 8]], nomHall: () => 'B',
    faces: [
      { face: LEFT, bw: 14, m: 0, lg: 6, type: (b, e) => e === 0 ? 'rdc' : (e >= 8 && b === 0 ? 'plein' : b === 3 ? 'log' : b === 0 ? 'fen' : 'fen2'), garde: () => ({ barreaux: true }), grilles: true },
      { face: RIGHT, bw: 14, m: 0, lg: 6, type: (b, e) => e === 0 ? (b === 1 ? 'hall' : 'rdc') : (b === 0 ? 'log' : b === 2 ? 'cage' : 'fen'), garde: () => ({ barreaux: true }), grilles: true },
    ],
  });
  lettre(k, TB.fac.L.f, 2, TB.zt - 3, 'B', TB.om, { scale: 4, col: [0.90, 0.86, 0.76] });
  // le parc : les allées, l'aire de jeux, le ping-pong, les bancs (les tilleuls viennent avec la verdure)
  parcNord(k);
  // le club de boxe, dans l'ancien gymnase
  clubBoxe(k, P);
  // l'éclairage de la rue et du parking
  for (const x of [70, 140, 210, 280]) mat(k, x, 6, { dy: 1 });
  for (const x of [80, 170, 260]) mat(k, x, 158, { dy: -1 });
  // les voitures du parking
  const paints = [M.CAR_BLUE, M.CAR_WHITE, M.CAR_BORD, M.CAR_BEIGE, M.PLASTIC_RED, M.SEAT_GREY, M.METAL_GREEN];
  for (let i = 0; i < 22; i++) {
    const x = 77 + i * 12; if (x + 10 > 330) break;
    const v = k.rh(x, 108, 1701); if (v < (k.night ? 0.25 : 0.45)) continue;
    voiture(W, x + 2, 109, 1, 'y', -1, paints[Math.floor(k.rh(x, 1, 1702) * paints.length)], { modele: v > 0.85 ? 'break' : v > 0.7 ? 'citadine' : 'berline' });
  }
  for (const [x, p] of [[100, M.CAR_WHITE], [200, M.CAR_BLUE], [262, M.CAR_BORD]]) if (k.rh(x, 2, 1703) < 0.7) voiture(W, x, 25, 1, 'x', -1, p, { modele: 'citadine' });
}

function parcNord(k) {
  const W = k.W;
  // les allées (stabilisé) : du parking au quai, en diagonale (le chemin des habitués)
  const allee = (xa, ya, xb, yb, w = 3) => { const n = Math.ceil(Math.hypot(xb - xa, yb - ya)); for (let i = 0; i <= n; i++) { const x = Math.round(xa + (xb - xa) * i / n), y = Math.round(ya + (yb - ya) * i / n); W.box(x - w, y - w, 1, x + w, y + w, 2, M.GRAVEL); } };
  allee(124, 166, 124, 252); allee(124, 210, 230, 210); allee(160, 166, 200, 252, 2);
  // l'aire de jeux
  aireJeux(k, 134, 172, 196, 204);
  // la table de ping-pong en béton
  { const x = 150, y = 222; W.box(x + 2, y + 2, G, x + 4, y + 8, G + 4, M.CONCRETE); W.box(x + 10, y + 2, G, x + 12, y + 8, G + 4, M.CONCRETE); W.box(x, y, G + 4, x + 14, y + 10, G + 5, M.CONCRETE); W.box(x + 7, y, G + 5, x + 8, y + 10, G + 6, M.METAL_DARK); }
  banc(W, 128, 196, G, 'x'); banc(W, 206, 206, G, 'y'); banc(W, 140, 244, G, 'x');
  corbeille(W, 137, 200); corbeille(W, 210, 216);
  mat(k, 120, 214, { dx: 1, h: 20 }); mat(k, 226, 252, { dx: 1, h: 20 });
}

// L'aire de jeux : sol souple, toboggan, balançoires, jeu à ressort, bac à sable, clôture basse
function aireJeux(k, x0, y0, x1, y1) {
  const W = k.W;
  W.box(x0, y0, 1, x1, y1, 2, M.TIL_SOUPLE);
  const vert = k.peint([0.24, 0.44, 0.30], null, { grain: 0.12 });
  W.box(x0 + 2, y0 + 2, 1, x0 + 22, y1 - 2, 2, M.TIL_SOUPLE, vert);
  B.railing(W, x0, y0, x1 - 1, y0, G, 3, M.METAL_GREEN, 2); B.railing(W, x0, y1 - 1, x0 + 20, y1 - 1, G, 3, M.METAL_GREEN, 2); B.railing(W, x0 + 30, y1 - 1, x1 - 1, y1 - 1, G, 3, M.METAL_GREEN, 2);
  B.railing(W, x0, y0, x0, y1 - 1, G, 3, M.METAL_GREEN, 2); B.railing(W, x1 - 1, y0, x1 - 1, y1 - 1, G, 3, M.METAL_GREEN, 2);
  // le toboggan : la tour, l'échelle, la glissière rouge
  const jaune = k.peint([0.86, 0.70, 0.20]), rouge = k.peint([0.74, 0.18, 0.14]), bleu = k.peint([0.22, 0.40, 0.70]);
  const tx = x0 + 6, ty = y0 + 8;
  for (const [a, b] of [[0, 0], [5, 0], [0, 5], [5, 5]]) W.box(tx + a, ty + b, G, tx + a + 1, ty + b + 1, G + 14, M.PLASTIC_WHITE, jaune);
  W.box(tx, ty, G + 7, tx + 6, ty + 6, G + 8, M.WOOD);
  W.box(tx - 1, ty - 1, G + 14, tx + 7, ty + 7, G + 15, M.PLASTIC_WHITE, bleu); W.box(tx, ty, G + 15, tx + 6, ty + 6, G + 16, M.PLASTIC_WHITE, bleu); W.box(tx + 1, ty + 1, G + 16, tx + 5, ty + 5, G + 17, M.PLASTIC_WHITE, bleu);
  for (let i = 0; i < 9; i++) W.box(tx + 6 + i, ty + 1, G + 7 - Math.floor(i * 0.75), tx + 7 + i, ty + 5, G + 8 - Math.floor(i * 0.75), M.PLASTIC_WHITE, rouge);
  for (let i = 0; i < 9; i++) { W.set(tx + 6 + i, ty + 1, G + 9 - Math.floor(i * 0.75), M.PLASTIC_WHITE, rouge); W.set(tx + 6 + i, ty + 4, G + 9 - Math.floor(i * 0.75), M.PLASTIC_WHITE, rouge); }
  for (let z = G; z < G + 7; z += 2) W.box(tx + 1, ty + 6, z, tx + 5, ty + 7, z + 1, M.METAL);
  // les balançoires
  const bx = x0 + 32, by = y0 + 6;
  for (const xx of [bx, bx + 16]) { W.box(xx, by, G, xx + 1, by + 1, G + 13, M.METAL_DARK); W.box(xx, by + 8, G, xx + 1, by + 9, G + 13, M.METAL_DARK); }
  W.box(bx, by, G + 13, bx + 17, by + 9, G + 14, 0); for (let x = bx; x <= bx + 16; x++) W.set(x, by + 4, G + 13, M.METAL_DARK);
  for (const sx of [bx + 4, bx + 11]) { for (let z = G + 4; z < G + 13; z++) { W.set(sx, by + 4, z, M.METAL); W.set(sx + 2, by + 4, z, M.METAL); } W.box(sx, by + 3, G + 3, sx + 3, by + 6, G + 4, M.PLASTIC_WHITE, rouge); }
  // le jeu à ressort (un petit cheval jaune)
  { const x = x0 + 40, y = y0 + 24; W.box(x, y, G, x + 1, y + 1, G + 3, M.METAL_DARK); W.box(x - 2, y - 1, G + 3, x + 3, y + 2, G + 6, M.PLASTIC_WHITE, jaune); W.box(x + 2, y - 1, G + 6, x + 4, y + 2, G + 9, M.PLASTIC_WHITE, jaune); }
  // le bac à sable
  W.box(x0 + 26, y0 + 22, 1, x0 + 36, y0 + 30, 2, M.RES_SABLE);
  B.railing(W, x0 + 26, y0 + 29, x0 + 35, y0 + 29, G, 1, M.WOOD, 1); B.railing(W, x0 + 35, y0 + 22, x0 + 35, y0 + 29, G, 1, M.WOOD, 1);
  banc(W, x1 - 10, y1 - 4, G, 'x');
}

// Le club de boxe : l'ancien gymnase municipal, brique et toit de tôle, les hautes fenêtres, l'enseigne peinte.
function clubBoxe(k, P) {
  const W = k.W;
  const x0 = 232, y0 = 186, x1 = 332, y1 = 246, zw = 28;
  W.box(x0, y0, G, x1, y1, zw, M.BRICK);
  W.box(x0, y1 - 1, G, x1, y1, G + 2, M.CONCRETE);
  B.gableRoof(W, x0, y0, x1 - x0, y1 - y0, zw, M.RES_TOLE, { axis: 'x', oh: 1, slope: 2, gable: M.BRICK });
  const f = new Facade(W, LEFT, x0, y0, x1 - x0, y1 - y0), fe = new Facade(W, RIGHT, x0, y0, x1 - x0, y1 - y0);
  f.rect(0, zw - 2, x1 - x0, zw, -1, M.CONCRETE);
  const lit = k.night && !k.bad;
  for (let s = 6; s < 96; s += 15) {
    if (s > 40 && s < 60) continue;
    const id = W.obj({ type: 'til_vitrine', kind: 'boxe', face: LEFT, a0: f.a0(s), z0: 14, w: 9, h: 10, lit, night: k.night });
    f.rect(s, 14, s + 9, 24, 0, 0); f.rect(s, 14, s + 9, 24, 1, M.GLASS, id);
    f.rect(s - 1, 13, s + 10, 14, -1, M.CONCRETE); f.rect(s, 24, s + 9, 25, 0, M.CONCRETE);
  }
  // la porte : deux battants, l'auvent de tôle, la lampe
  f.door(44, G, 12, 12, { mat: M.METAL_DARK, frameMat: M.CONCRETE });
  const pid = k.peint([0.62, 0.14, 0.14], 'lames');
  f.rect(44, G, 56, G + 12, 2, M.PLASTIC_WHITE, pid);
  f.rect(50, G, 51, G + 12, 2, M.METAL_DARK);
  f.awning(42, 16, G + 15, 6, M.RES_TOLE);
  f.rect(43, G + 15, 57, G + 16, -1, M.METAL_DARK);
  f.sign(39, G + 24, 'CLUB DE BOXE', { fg: [0.92, 0.88, 0.76], plate: [0.12, 0.12, 0.13], plateMat: M.METAL_DARK, depth: -1, padX: 2, padY: 1, emit: k.night && !k.bad ? [0.95, 0.88, 0.70] : null });
  if (k.night) { const p = f.front(50, G + 13, 4); W.light({ x: p.x, y: p.y, z: p.z, r: 34, cr: 1.1, cg: 0.80, cb: 0.45, skip: 2 }); }
  if (lit) { const p = f.front(25, 18, 6); W.light({ x: p.x, y: p.y, z: p.z, r: 30, cr: 0.6, cg: 0.42, cb: 0.22, shadow: false }); W.light({ x: p.x + 50, y: p.y, z: p.z, r: 30, cr: 0.6, cg: 0.42, cb: 0.22, shadow: false }); }
  // le nom du club peint sur le pignon est, et le gant rouge
  lettre(k, fe, 6, 25, 'BOXE', null, { scale: 2, col: [0.90, 0.86, 0.74] });
  const GANT = ['..####..', '.######.', '########', '########', '#######.', '.######.', '..####..', '..wwww..', '..wwww..'];
  const rougeG = k.peint([0.72, 0.14, 0.12]), blancG = k.peint([0.88, 0.86, 0.80]);
  GANT.forEach((row, i) => [...row].forEach((ch, j) => { if (ch === '.') return; const [x, y] = fe.xy(36 + j, 0); W.set(x, y, 18 - i, M.PLASTIC_WHITE, ch === '#' ? rougeG : blancG); }));
  f.poster(60, G + 3, 5, 8, { title: 'GALA', bg: [0.86, 0.82, 0.68], fg: [0.60, 0.12, 0.12], band: [0.12, 0.12, 0.12], seed: 4, torn: k.bad ? 0.3 : 0.05 });
  f.poster(67, G + 3, 5, 8, { title: 'BOXE', bg: [0.80, 0.20, 0.18], fg: [0.95, 0.92, 0.84], seed: 5, torn: k.bad ? 0.3 : 0.05 });
  tag(k, f, 4, G + 9, 'TLS', { style: 'tag', fill: SPRAY.noir, wob: 1 });
  P.push({ key: 'club_boxe', label: 'Le club de boxe', x: x0 + 50, y: y1 + 4, z: G + 12 });
}

// ================================================================ la passerelle taguée, au-dessus de la Rive
function passerelle(k) {
  const W = k.W, x0 = 168, x1 = 182, ya = 314, yb = 402;
  // le tablier de béton, à hauteur des promenades : une poutre épaisse au-dessus de l'eau, deux piles
  W.box(x0, ya, 0, x1, yb, 2, M.CONCRETE);
  W.box(x0, 326, -3, x1, 392, 0, M.CONCRETE);
  W.box(x0 + 1, ya, 2, x1 - 1, yb, 3, 0);
  for (const y of [346, 372]) W.box(x0 + 3, y, -8, x1 - 3, y + 3, -3, M.CONCRETE);
  // les parapets pleins, couverts de tags, la main courante
  W.box(x0, ya, 2, x0 + 1, yb, 9, M.CONCRETE); W.box(x1 - 1, ya, 2, x1, yb, 9, M.CONCRETE);
  W.box(x0, ya, 9, x0 + 1, yb, 10, M.METAL); W.box(x1 - 1, ya, 9, x1, yb, 10, M.METAL);
  // deux lampadaires sur le parapet
  for (const y of [338, 380]) { W.box(x1 - 1, y, 10, x1, y + 1, 22, M.METAL_DARK); W.box(x1 - 3, y, 21, x1, y + 1, 22, M.METAL_DARK); W.set(x1 - 3, y, 20, k.night && !(k.bad && y > 350) ? M.BULB : M.GLASS); if (k.night && !(k.bad && y > 350)) { W.light({ x: x1 - 2.5, y: y + 0.5, z: 19.5, r: 40, fall: 2, cr: 1.3, cg: 0.86, cb: 0.42, spot: 0.5, skip: 1.5 }); } }
  // la rambarde des quais s'ouvre devant la passerelle
  for (const y of [324, 393]) W.box(x0 + 1, y, 2, x1 - 1, y + 1, 8, 0);
  const fe = new Facade(W, RIGHT, x0, ya, x1 - x0, yb - ya);
  tag(k, fe, 14, 9, 'TILLEULS', { style: 'throw', scale: 1, fill: SPRAY.jaune, fill2: SPRAY.orange, line: SPRAY.noir, wob: 1, seed: 3 });
  tag(k, fe, 38, 9, 'NOX', { style: 'throw', scale: 1, fill: SPRAY.blanc, line: SPRAY.noir, wob: 1, drip: 0.4, seed: 4 });
  tag(k, fe, 51, 9, 'RIVE', { style: 'throw', scale: 1, fill: SPRAY.bleu, fill2: [0.30, 0.46, 0.80], line: SPRAY.blanc, wob: 1, seed: 6 });
  tag(k, fe, 64, 8, k.bad ? 'LA HONTE' : 'ZEB', { style: k.bad ? 'tag' : 'throw', scale: 1, fill: k.bad ? SPRAY.rouge : SPRAY.rose, line: SPRAY.noir, wob: 1, drip: 0.5, seed: 8 });
  tag(k, fe, 2, 8, 'TLS', { style: 'tag', fill: SPRAY.vert, wob: 1, drip: 0.3 });
  // le tag sous la passerelle, sur le mur du quai
  const fq = new Facade(W, LEFT, 140, 322, 70, 4);
  tag(k, fq, 4, 1, 'TLS', { style: 'throw', scale: 1, fill: SPRAY.vert, line: SPRAY.blanc, wob: 1, seed: 9 });
  tag(k, fq, 46, 0, 'OUEST', { style: 'tag', fill: SPRAY.blanc, wob: 1, drip: 0.5 });
}

// ================================================================ le sud : la barre E, la tour C, la place, le centre commercial, le city-stade
function sud(k, P) {
  const W = k.W;
  trottoir(k, 56, RIV1, 352, 458);
  W.box(56, RIV1, 0, 352, RIV1 + 1, 2, M.CURB);
  // l'avenue des Tilleuls, ses trottoirs, le parking en épi au sud
  trottoir(k, 108, 520, 352, 528);
  chaussee(k, 108, 528, LX, 552, { axe: 'x', axeLigne: true });
  chaussee(k, 196, 552, 344, 576, { axe: 'x', sansBordN: true });
  stalles(k, 196, 552, 344, 576, 12, 'y');
  trottoir(k, 108, 576, 352, 584);
  trottoir(k, 108, 552, 196, 576);
  // le trottoir au pied de la barre E1, jusqu'à l'avenue
  trottoir(k, 108, 458, 118, 520);
  // le muret-enseigne de la cité, face au boulevard, à l'entrée de l'avenue
  {
    const x0 = 334, y0 = 486, y1 = 516;
    W.box(x0, y0, 1, x0 + 3, y1, G + 8, M.CONCRETE); W.box(x0 - 1, y0 - 1, G + 8, x0 + 4, y1 + 1, G + 9, M.CURB);
    const fm = new Facade(W, RIGHT, x0, y0, 3, y1 - y0);
    fm.sign(1, G + 8, 'LES TILLEULS', { fg: [0.96, 0.94, 0.86], plate: [0.16, 0.34, 0.26], plateMat: M.METAL_GREEN, depth: 0, padX: 1, padY: 1, emit: k.night ? [0.75, 0.72, 0.6] : null });
    for (let y = y0 + 1; y < y1 - 1; y += 3) W.box(x0 + 3, y, 1, x0 + 6, y + 2, G + 2, M.SOIL), W.box(x0 + 3, y, G + 2, x0 + 6, y + 2, G + 4, hash(y, 0, 2011, 0) < 0.4 ? M.RES_FLEURS : M.HEDGE);
    if (k.night) { W.light({ x: x0 + 8, y: (y0 + y1) / 2, z: G + 1, r: 26, cr: 0.8, cg: 0.66, cb: 0.4, axis: [-0.8, 0, 0.6], c0: 0.3, c1: 0.7, spill: 0.2, skip: 1.5 }); }
  }
  // les boxes (garages), portes sur l'avenue ; entre les deux rangées, le mail qui descend de la passerelle
  garages(k, 120, 494, 168, 520);
  garages(k, 194, 494, 306, 520);
  sol(k, 168, 458, 194, 520, M.TIL_DALLE);
  for (let y = 462; y < 516; y += 12) W.box(169, y, 1, 193, y + 1, 2, M.CURB);
  // la barre E1 (nord) : dix niveaux, balcons filants aux garde-corps bleus et verts
  const E1 = immeuble(k, {
    x0: 60, y0: 466, x1: 108, y1: 618, niv: 10, seed: 31, toit: [0.46, 0.45, 0.43],
    col: [0.74, 0.73, 0.68], volet: [0.80, 0.80, 0.76], cadre: [0.86, 0.86, 0.82], cageCol: [0.66, 0.64, 0.58],
    edicules: [[66, 486, 8, 10], [66, 552, 8, 10]], nomHall: b => b < 4 ? 'E1' : 'E2',
    faces: [
      { face: RIGHT, bw: 16, m: 4, saillie: 4, type: (b, e) => e === 0 ? (b === 2 || b === 6 ? 'hall' : b === 4 ? 'porche' : 'rdc') : (b === 2 || b === 6 ? 'cage' : 'bal'),
        garde: (b, e) => ({ col: e % 2 ? [0.26, 0.40, 0.60] : [0.30, 0.52, 0.42] }), grilles: true },
      { face: LEFT, bw: 16, m: 0, type: (b, e) => e > 0 && b === 1 ? 'pfen' : 'plein' },
    ],
  });
  lettre(k, E1.fac.L.f, 3, E1.zt - 4, 'E', E1.om, { scale: 4, col: [0.30, 0.46, 0.64] });
  // la place (son sol d'abord), la tour C et son hall, le centre commercial
  place(k);
  tourC(k, P);
  centreCommercial(k, P);
  // la maison de quartier
  maisonQuartier(k, P);
  // la barre E3 (sud) : huit niveaux, enduit rose, en deux redans
  immeuble(k, {
    x0: 60, y0: 770, x1: 108, y1: 866, niv: 8, seed: 41,
    col: [0.68, 0.52, 0.45], fond: [0.76, 0.70, 0.60], volet: [0.42, 0.30, 0.22], cadre: [0.84, 0.82, 0.76],
    allege: (b, e) => (b + e) % 2 ? [0.56, 0.38, 0.32] : null, cageCol: [0.62, 0.48, 0.42],
    nomHall: () => 'E3', edicules: [[66, 810, 8, 10]],
    faces: [{ face: RIGHT, bw: 16, m: 0, lg: 6, type: (b, e) => e === 0 ? (b === 3 ? 'hall' : b === 1 ? 'local' : 'rdc') : (b === 3 ? 'cage' : b % 2 ? 'log' : 'fen2'), garde: () => ({ col: [0.86, 0.84, 0.78] }), grilles: true }],
  });
  immeuble(k, {
    x0: 66, y0: 866, x1: 114, y1: 962, niv: 7, seed: 43, toit: [0.40, 0.38, 0.36],
    col: [0.68, 0.52, 0.45], fond: [0.76, 0.70, 0.60], volet: [0.42, 0.30, 0.22], cadre: [0.84, 0.82, 0.76],
    allege: (b, e) => (b + e) % 2 ? [0.56, 0.38, 0.32] : null, cageCol: [0.62, 0.48, 0.42],
    nomHall: () => 'E4', edicules: [[72, 906, 8, 10]],
    faces: [
      { face: RIGHT, bw: 16, m: 0, lg: 6, type: (b, e) => e === 0 ? (b === 3 ? 'hall' : 'rdc') : (b === 3 ? 'cage' : b % 2 ? 'log' : 'fen2'), garde: () => ({ col: [0.86, 0.84, 0.78] }), grilles: true },
      { face: LEFT, bw: 16, m: 0, type: (b, e) => e > 0 && b === 1 ? 'pfen' : 'plein' },
    ],
  });
  // le city-stade
  cityStade(k, P);
  // la tour D
  const TD = immeuble(k, {
    x0: 140, y0: 880, x1: 192, y1: 932, niv: 9, seed: 53, toit: [0.52, 0.50, 0.46],
    col: [0.80, 0.79, 0.74], volet: [0.84, 0.84, 0.80], cadre: [0.88, 0.88, 0.84],
    allege: (b, e) => (b + e) % 2 ? [0.26, 0.42, 0.62] : [0.80, 0.79, 0.74], cageCol: [0.26, 0.42, 0.62],
    nomHall: () => 'D', edicules: [[160, 900, 10, 8]],
    faces: [
      { face: LEFT, bw: 13, m: 0, type: (b, e) => e === 0 ? (b === 1 ? 'hall' : 'rdc') : (b === 2 ? 'cage' : 'fen'), grilles: true },
      { face: RIGHT, bw: 13, m: 0, type: (b, e) => e === 0 ? (b === 1 ? 'local' : 'rdc') : (e >= 7 && b === 3 ? 'plein' : 'fen'), grilles: true },
    ],
  });
  lettre(k, TD.fac.R.f, 41, TD.zt - 3, 'D', TD.om, { scale: 4, col: [0.26, 0.42, 0.62] });
  // l'aire de jeux du sud
  aireJeux(k, 214, 872, 290, 920);
  // le plot F
  immeuble(k, {
    x0: 232, y0: 952, x1: 336, y1: 1000, niv: 5, seed: 61, toit: [0.42, 0.32, 0.26],
    col: [0.70, 0.56, 0.38], volet: [0.36, 0.42, 0.34], cadre: [0.86, 0.84, 0.78], cageCol: [0.62, 0.50, 0.34],
    nomHall: b => b < 3 ? 'F1' : 'F2', edicules: [],
    faces: [
      { face: LEFT, bw: 16, m: 4, saillie: 3, type: (b, e) => e === 0 ? (b === 1 || b === 4 ? 'hall' : 'rdc') : (b === 1 || b === 4 ? 'cage' : 'bal'), grilles: true },
      { face: RIGHT, bw: 16, m: 0, type: (b, e) => e > 0 && b === 1 ? 'pfen' : 'plein' },
    ],
  });
  // la rue du Sud
  trottoir(k, 40, 1026, 352, 1036);
  chaussee(k, 40, 1036, LX, 1060, { axe: 'x', axeLigne: true });
  trottoir(k, 40, 1060, 352, LY);
  for (const x of [70, 150, 230, 310]) mat(k, x, 1064, { dy: -1 });
  for (const x of [130, 230, 330]) mat(k, x, 580, { dy: -1 });
  for (const x of [150, 220, 290]) mat(k, x, 522, { dy: 1 });
  for (const x of [110, 250, 340]) mat(k, x, 454, { dy: -1, h: 22 });
  borne(k, 170, 470); borne(k, 192, 500); borne(k, 170, 512);
  for (const y of [600, 700, 860, 980]) mat(k, 346, y, { dx: -1 });
}

// Les boxes : une rangée de garages, portes basculantes de toutes les couleurs, des tags.
function garages(k, x0, y0, x1, y1) {
  const W = k.W;
  W.box(x0, y0, G, x1, y1, G + 13, M.CONCRETE);
  W.box(x0 - 1, y0 - 1, G + 13, x1 + 1, y1 + 1, G + 14, M.RES_TOLE);
  const f = new Facade(W, LEFT, x0, y0, x1 - x0, y1 - y0);
  const cols = [[0.30, 0.42, 0.58], [0.36, 0.46, 0.32], [0.62, 0.60, 0.56], [0.58, 0.22, 0.18], [0.70, 0.62, 0.36]];
  for (let i = 0, s = 1; s + 14 <= x1 - x0; i++, s += 16) {
    const open = k.day && x0 > 180 && i === 2;
    f.rect(s, G, s + 13, G + 10, 0, 0);
    if (open) {
      for (let dp = 0; dp < y1 - y0 - 2; dp++) f.rect(s, G, s + 13, G + 10, dp, 0);
      f.rect(s, G + 9, s + 13, G + 10, -1, M.METAL);
      scooter(W, x0 + s + 3, y1 - 8, G, 'y', M.CAR_BORD);
      continue;
    }
    const pid = k.peint(cols[Math.floor(k.rh(x0 + i, 0, 1801) * cols.length)], k.rh(x0 + i, 1, 1802) < 0.3 ? 'rouille' : 'nervures');
    f.rect(s, G, s + 13, G + 10, 1, M.METAL, pid);
    if (k.rh(x0 + i, 2, 1803) < 0.55) tag(k, f, s + 1, G + 9, ['KRAZ', 'TLS', 'NOX', 'ZEB', 'SKEO', 'C 4'][(i + x0) % 6], { style: 'tag', fill: [SPRAY.noir, SPRAY.blanc, SPRAY.rouge, SPRAY.bleu][(i + x0) % 4], wob: 1, depth: 1, drip: 0.3 });
  }
  // le panier de basket fixé au mur, au-dessus des portes
  if (x0 > 180) { const s = x1 - x0 - 6; f.rect(s, G + 14, s + 4, G + 19, -1, M.PLASTIC_WHITE); f.rect(s + 1, G + 14, s + 3, G + 15, -2, M.PLASTIC_RED); f.rect(s + 1, G + 14, s + 3, G + 15, -4, M.PLASTIC_RED); f.set(s + 1, G + 14, -3, M.PLASTIC_RED); f.set(s + 2, G + 14, -3, M.PLASTIC_RED); }
}

// La tour C : onze niveaux, béton clair, allèges jaunes et vertes, la cage vitrée, le grand C, le hall sur la place.
function tourC(k, P) {
  const W = k.W;
  const x0 = 62, y0 = 628, x1 = 122, y1 = 688;
  const T = immeuble(k, {
    x0, y0, x1, y1, niv: 11, seed: 71,
    col: [0.76, 0.72, 0.62], fond: [0.62, 0.56, 0.44], volet: [0.82, 0.80, 0.74], cadre: [0.86, 0.85, 0.80], cageCol: [0.86, 0.70, 0.24],
    allege: (b, e) => [[0.86, 0.70, 0.24], [0.40, 0.58, 0.36]][(b + (e >> 1)) % 2],
    edicules: [[84, 640, 12, 10]],
    faces: [
      { face: RIGHT, bw: 15, m: 0, lg: 6, type: (b, e) => e === 0 ? (b === 0 ? 'rdc' : b === 3 ? 'local' : 'hallC') : (e >= 9 && b <= 1 ? 'plein' : b === 2 ? 'log' : 'fen'), garde: () => ({ col: [0.86, 0.70, 0.24] }), grilles: true },
      { face: LEFT, bw: 15, m: 0, lg: 6, type: (b, e) => e === 0 ? (b === 1 ? 'local' : 'rdc') : (b === 1 ? 'cage' : b === 3 ? 'log' : 'fen'), garde: () => ({ col: [0.40, 0.58, 0.36] }), grilles: true },
    ],
  });
  lettre(k, T.fac.R.f, 5, T.zt - 3, 'C', T.om, { scale: 6, col: [0.86, 0.70, 0.24] });
  // le hall de la tour C : un grand sas vitré sur deux travées, la marquise haute, le nom en lettres lumineuses
  const f = T.fac.R.f, s0 = 15, hw = 30;
  for (let dp = 0; dp < 3; dp++) f.rect(s0 + 1, G, s0 + hw - 1, G + 13, dp, 0);
  const hid = W.obj({ type: 'til_hall', face: RIGHT, a0: f.a0(s0 + 1), z0: G, w: hw - 2, h: 13, night: k.night, bad: k.bad, panne: false, seed: 77, lum: [1.0, 0.88, 0.66] });
  f.rect(s0 + 1, G, s0 + hw - 1, G + 13, 3, M.GLASS, hid);
  for (let dp = -6; dp < 0; dp++) f.rect(s0 - 1, G + 17, s0 + hw + 1, G + 18, dp, M.CONCRETE);
  for (const s of [s0, s0 + hw - 1]) f.rect(s, G, s + 1, G + 17, -5, M.METAL_DARK);
  f.sign(s0 + 6, G + 23, 'TOUR C', { plate: [0.12, 0.12, 0.14], plateMat: M.METAL_DARK, fg: [0.95, 0.85, 0.40], depth: -5, padX: 2, padY: 1, scale: 1, emit: k.night ? [1.2, 0.95, 0.35] : null });
  if (k.night) { const p = f.front(s0 + hw / 2, G + 15, 3); W.light({ x: p.x, y: p.y, z: p.z, r: 44, cr: 1.3, cg: 1.0, cb: 0.62, skip: 2 }); }
  // le perron d'une marche
  for (let dp = -5; dp < 0; dp++) f.rect(s0 + 2, G, s0 + hw - 2, G + 1, dp, M.CONCRETE);
  P.push({ key: 'tour_c', label: 'La tour C', x: x1 + 4, y: y1 - 1 - (s0 + hw / 2), z: G + 12 });
}

// Le centre commercial : un plain-pied de béton et de carrelage, un auvent mince ; le salon, la supérette,
// le snack, une cellule vide. Les enseignes sont posées sur l'auvent (un auvent profond cacherait les vitrines).
function centreCommercial(k, P) {
  const W = k.W;
  const x0 = 188, y0 = 584, x1 = 344, y1 = 628, zr = G + 21;
  W.box(x0, y0, G, x1, y1, zr, M.CONCRETE);
  B.flatRoof(W, x0, y0, x1 - x0, y1 - y0, zr, M.CONCRETE, { parapet: 1 });
  const f = new Facade(W, LEFT, x0, y0, x1 - x0, y1 - y0), fe = new Facade(W, RIGHT, x0, y0, x1 - x0, y1 - y0);
  const night = k.night, bad = k.bad;
  // le soubassement et les trumeaux carrelés (petits carreaux bruns)
  const carreaux = k.peint([0.46, 0.30, 0.22], 'carreaux');
  f.rect(0, G, x1 - x0, G + 15, 0, M.CONCRETE, carreaux);
  // l'auvent : une dalle mince, et son nez
  W.box(x0 - 1, y1, G + 15, x1 + 1, y1 + 3, G + 16, M.CONCRETE);
  W.box(x0 - 1, y1 + 3, G + 14, x1 + 1, y1 + 4, G + 16, M.CONCRETE);
  const fa = new Facade(W, LEFT, x0 - 1, y1, x1 - x0 + 2, 4);
  const enseigne = (s, txt, o) => { fa.sign(s, G + 20, txt, Object.assign({ depth: 0, padX: 1, padY: 1 }, o)); };
  const vitrine = (s, w, kind, extra) => { const id = W.obj(Object.assign({ type: 'til_vitrine', kind, face: LEFT, a0: f.a0(s), z0: G + 1, w, h: 12, lit: true, night }, extra)); f.rect(s, G + 1, s + w, G + 13, 0, 0); f.rect(s, G + 1, s + w, G + 13, 1, M.GLASS, id); f.rect(s - 1, G, s + w + 1, G + 1, -1, M.CONCRETE); return id; };
  const lampe = (xl, c) => { W.light({ x: xl, y: y1 + 2, z: G + 12, r: 34, cr: c[0], cg: c[1], cb: c[2], skip: 2 }); };
  // le salon des Tilleuls
  {
    const s = 3, open = !night || !bad;
    if (open) vitrine(s, 22, 'salon', { client: k.day });
    else f.shop(s, G + 1, 22, 12, 'rideau');
    f.door(s + 24, G, 6, 12, { kind: open ? 'door' : 'rideau', frame: false });
    enseigne(s - 1, 'SALON DES TILLEULS', { fg: [0.94, 0.82, 0.86], plate: [0.32, 0.14, 0.22], plateMat: M.METAL_BORD, emit: night && !bad ? [1.1, 0.64, 0.82] : null });
    // le cylindre du coiffeur, à rayures
    const rid = k.peint([0.78, 0.14, 0.16], 'rayures', { col2: [0.90, 0.90, 0.86], emit: night ? [0.30, 0.12, 0.12] : null });
    for (let z = G + 5; z < G + 12; z++) f.set(s + 31, z, -1, M.PLASTIC_WHITE, rid);
    f.set(s + 31, G + 12, -1, M.METAL); f.set(s + 31, G + 4, -1, M.METAL);
    if (night && !bad) lampe(x0 + s + 14, [0.95, 0.62, 0.66]);
    P.push({ key: 'salon_tilleuls', label: 'Le salon des Tilleuls', x: x0 + s + 27, y: y1 + 4, z: G + 12 });
  }
  // la supérette
  {
    const s = 38, open = !(night && bad);
    if (open) vitrine(s, 34, 'superette'); else f.shop(s, G + 1, 34, 12, 'rideau');
    f.door(s + 36, G, 10, 12, { kind: open ? 'door' : 'rideau', frame: false });
    enseigne(s + 10, 'SUPÉRETTE', { fg: [0.96, 0.96, 0.90], plate: [0.14, 0.40, 0.26], plateMat: M.METAL_GREEN, padX: 2, emit: night && open ? [1.0, 1.05, 0.95] : null });
    // l'étal de fruits et légumes sous l'auvent, les cagettes
    if (k.day || !bad) { W.box(x0 + s + 2, y1 + 1, G, x0 + s + 26, y1 + 3, G + 3, M.WOOD); W.box(x0 + s + 2, y1 + 1, G + 3, x0 + s + 26, y1 + 3, G + 4, M.RES_FRUITS); B.crates(W, x0 + s + 28, y1 + 1, G, 2, M.CRATE_GREEN); }
    if (night && open) lampe(x0 + s + 20, [0.80, 0.94, 0.86]);
    P.push({ key: 'superette', label: 'La supérette', x: x0 + s + 41, y: y1 + 4, z: G + 12 });
  }
  // le Snack des Tilleuls
  {
    const s = 88;
    vitrine(s, 24, 'snack', { clients: night ? [10, 30] : [14] });
    f.door(s + 26, G, 6, 12, { kind: 'door', frame: false });
    enseigne(s - 2, 'SNACK DES TILLEULS', { fg: [1.0, 0.82, 0.30], plate: [0.30, 0.08, 0.06], plateMat: M.METAL_BORD, emit: night ? (bad ? [0.7, 0.5, 0.16] : [1.35, 1.0, 0.32]) : null });
    if (night) lampe(x0 + s + 14, [1.25, 0.82, 0.38]);
    // les tables hautes et les tabourets, devant
    for (const dx of [6, 18]) { W.box(x0 + s + dx, y1 + 6, G, x0 + s + dx + 1, y1 + 7, G + 5, M.METAL_DARK); W.box(x0 + s + dx - 2, y1 + 5, G + 5, x0 + s + dx + 3, y1 + 8, G + 6, M.WOOD); for (const ex of [-3, 3]) W.box(x0 + s + dx + ex, y1 + 6, G, x0 + s + dx + ex + 1, y1 + 7, G + 3, M.METAL_DARK); }
    P.push({ key: 'snack_tilleuls', label: 'Le Snack des Tilleuls', x: x0 + s + 29, y: y1 + 4, z: G + 12 });
  }
  // la cellule vide : le rideau baissé, tagué ; une affiche « à louer »
  {
    const s = 124;
    f.shop(s, G, 26, 13, 'rideau');
    tag(k, f, s + 2, G + 11, k.bad ? 'NOX' : 'KRAZ', { style: 'throw', fill: SPRAY.violet, line: SPRAY.blanc, wob: 1, depth: 1, seed: 12 });
    f.poster(s + 20, G + 13, 4, 3, { title: 'LOUER', bg: [0.90, 0.88, 0.80], fg: [0.70, 0.12, 0.10], seed: 2 });
  }
  // les climatiseurs et les lanterneaux du toit
  for (let x = x0 + 10; x < x1 - 10; x += 34) { W.box(x, y0 + 8, zr + 1, x + 6, y0 + 13, zr + 4, M.METAL); W.box(x + 1, y0 + 9, zr + 4, x + 5, y0 + 12, zr + 5, M.METAL_DARK); W.box(x + 12, y0 + 22, zr + 1, x + 18, y0 + 30, zr + 2, M.METAL); W.box(x + 13, y0 + 23, zr + 2, x + 17, y0 + 29, zr + 3, night && k.rh(x, 1, 1951) < 0.6 ? M.SKYLIGHT : M.GLASS); }
  // le pignon est : un tag, les conteneurs
  tag(k, fe, 10, G + 12, 'TLS', { style: 'throw', fill: SPRAY.rouge, fill2: [0.6, 0.1, 0.1], line: SPRAY.noir, wob: 1, seed: 5 });
  conteneur(W, x1 + 2, y0 + 4, M.METAL_GREEN); conteneur(W, x1 + 2, y0 + 10, M.CAR_BEIGE); conteneur(W, x1 + 2, y0 + 16, M.METAL_GREEN);
}

// La place des Tilleuls : la dalle gravillonnée, les tilleuls en grille, la fontaine et sa sculpture de béton,
// les jardinières, les bancs, l'abribus du boulevard.
function place(k) {
  const W = k.W;
  sol(k, 126, 636, 352, 768, M.TIL_DALLE);
  for (const [x, y, s] of [[214, 660, 1], [262, 662, 2], [312, 660, 3], [234, 744, 4], [326, 742, 5], [208, 674, 6]]) {
    W.box(x - 2, y - 2, 1, x + 4, y + 4, 2, M.METAL_DARK);
    W.box(x - 1, y - 1, 1, x + 3, y + 3, 2, M.SOIL);
    tilleul(W, x, y, G, { seed: 500 + s, r: 9 + (s % 2) });
  }
  // la fontaine : un bassin rond à margelle, l'eau (à sec en mauvaise saison), la sculpture
  const fx = 272, fy = 708, rf = 11;
  for (let y = fy - rf - 1; y <= fy + rf + 1; y++) for (let x = fx - rf - 1; x <= fx + rf + 1; x++) {
    const d = Math.hypot(x + 0.5 - fx, y + 0.5 - fy);
    if (d < rf - 1.2) { W.box(x, y, 0, x + 1, y + 1, 2, 0); W.set(x, y, 0, k.bad ? M.TIL_DALLE : M.WATER); }
    else if (d < rf + 0.4) { W.box(x, y, 1, x + 1, y + 1, G + 2, M.CONCRETE); }
  }
  // la sculpture : trois stèles de béton désaxées, une mosaïque bleue et ocre
  const mos = k.peint([0.22, 0.42, 0.62], 'carreaux'), ocre = k.peint([0.80, 0.56, 0.20], 'carreaux');
  W.box(fx - 4, fy - 1, 0, fx - 1, fy + 2, G + 26, M.CONCRETE);
  W.box(fx, fy - 3, 0, fx + 2, fy + 1, G + 20, M.CONCRETE); W.box(fx, fy - 3, G + 8, fx + 2, fy + 1, G + 14, M.PLASTIC_WHITE, mos);
  W.box(fx + 2, fy + 2, 0, fx + 5, fy + 4, G + 15, M.CONCRETE); W.box(fx + 2, fy + 2, G + 4, fx + 5, fy + 4, G + 9, M.PLASTIC_WHITE, ocre);
  W.box(fx - 4, fy - 1, G + 18, fx - 1, fy + 2, G + 22, M.PLASTIC_WHITE, ocre);
  if (!k.bad) for (const [dx, dy] of [[-3, 3], [3, -4], [-5, -3]]) W.set(fx + dx, fy + dy, 1, M.WHITE);
  if (k.night) { W.light({ x: fx + 6, y: fy + 6, z: 4, r: 30, cr: 0.5, cg: 0.6, cb: 0.62, skip: 1.5, shadow: false }); }
  // les jardinières de béton, leurs arbustes et leurs fleurs
  for (const [x, y, w, d] of [[222, 690, 12, 4], [300, 690, 4, 12], [228, 726, 4, 10], [316, 724, 12, 4]]) {
    W.box(x, y, 1, x + w, y + d, G + 3, M.CONCRETE); W.box(x + 1, y + 1, G + 2, x + w - 1, y + d - 1, G + 3, M.SOIL);
    for (let yy = y + 1; yy < y + d - 1; yy++) for (let xx = x + 1; xx < x + w - 1; xx++) { const h = hash(xx, yy, 1961, 0); if (h < 0.7) W.box(xx, yy, G + 3, xx + 1, yy + 1, G + 4 + Math.floor(h * 4), h < 0.2 ? M.RES_FLEURS : M.HEDGE); }
  }
  for (const [x, y, a] of [[226, 668, 'x'], [274, 670, 'x'], [244, 698, 'y'], [292, 726, 'x'], [252, 752, 'x'], [322, 706, 'y'], [190, 680, 'y']]) banc(W, x, y, G, a);
  corbeille(W, 236, 668); corbeille(W, 286, 734); corbeille(W, 196, 690);
  for (const [x, y] of [[198, 650], [246, 682], [298, 682], [330, 650], [216, 760], [300, 760]]) mat(k, x, y, { h: 22, dx: 1 });
  // l'abribus, sur le trottoir du boulevard
  {
    const x = 355, y0 = 684, y1 = 708;
    W.box(x, y0, G, x + 1, y1, G + 11, M.BOOTH);
    W.box(x, y0, G, x + 5, y0 + 1, G + 11, M.METAL_DARK); W.box(x, y1 - 1, G, x + 5, y1, G + 11, M.METAL_DARK);
    W.box(x - 1, y0 - 1, G + 11, x + 6, y1 + 1, G + 12, M.METAL);
    W.box(x + 1, y0 + 3, G + 2, x + 3, y1 - 3, G + 3, M.WOOD);
    W.box(x, y1, G + 1, x + 4, y1 + 1, G + 10, M.LIT_PANEL);
    const fp = new Facade(W, LEFT, x, y1, 4, 1); fp.poster(0, G + 2, 4, 7, { title: 'FÊTE', bg: [0.92, 0.82, 0.40], fg: [0.20, 0.30, 0.55], band: [0.70, 0.20, 0.18], seed: 31, lit: k.night ? 0.6 : 0 });
    const fs = new Facade(W, RIGHT, x - 1, y0 - 1, 7, y1 - y0 + 2); fs.sign(3, G + 15, 'LES TILLEULS', { plate: [0.16, 0.28, 0.48], plateMat: M.CAR_BLUE, fg: [0.92, 0.92, 0.88], depth: 0, padX: 1, padY: 1 });
    W.box(x + 5, y0 - 1, G + 12, x + 6, y1 + 1, G + 16, M.CAR_BLUE);
    if (k.night) { W.light({ x: x + 2.5, y: y0 + 12, z: G + 9, r: 20, cr: 0.5, cg: 0.55, cb: 0.52, shadow: false }); }
  }
}

// La maison de quartier : un pavillon de brique et de bardage, la grande vitre aux dessins d'enfants.
function maisonQuartier(k, P) {
  const W = k.W;
  const x0 = 126, y0 = 700, x1 = 196, y1 = 760;
  W.box(x0, y0, G, x1, y1, G + 16, M.BRICK_PALE);
  W.box(x0, y0, G + 16, x1, y1, G + 30, M.ESTQ_CLAD);
  B.flatRoof(W, x0, y0, x1 - x0, y1 - y0, G + 30, M.ESTQ_CLAD, { parapet: 1 });
  const f = new Facade(W, RIGHT, x0, y0, x1 - x0, y1 - y0), fl = new Facade(W, LEFT, x0, y0, x1 - x0, y1 - y0);
  const lit = k.night && !k.bad;
  const vid = W.obj({ type: 'til_vitrine', kind: 'mdq', face: RIGHT, a0: f.a0(4), z0: G + 2, w: 24, h: 11, lit: k.night ? lit : true, night: k.night });
  f.rect(4, G + 2, 28, G + 13, 0, 0); f.rect(4, G + 2, 28, G + 13, 1, M.GLASS, vid);
  f.door(32, G, 10, 12, { kind: 'door', frameMat: M.CONCRETE });
  const bleu = k.peint([0.24, 0.42, 0.64]);
  for (let dp = -4; dp < 0; dp++) f.rect(30, G + 15, 44, G + 16, dp, M.PLASTIC_WHITE, bleu);
  f.sign(2, G + 22, 'MAISON DE QUARTIER', { fg: [0.20, 0.30, 0.50], plate: [0.90, 0.88, 0.80], plateMat: M.PLASTIC_WHITE, depth: -1, padX: 2, padY: 1, plateEmit: k.night ? [0.3, 0.3, 0.28] : null });
  for (let s = 6; s < 56; s += 12) { const id = W.obj({ type: 'til_vitrine', kind: 'mdq', face: RIGHT, a0: f.a0(s), z0: G + 19, w: 8, h: 8, lit: k.night ? lit : true, night: k.night }); f.rect(s, G + 19, s + 8, G + 27, 0, 0); f.rect(s, G + 19, s + 8, G + 27, 1, M.GLASS, id); }
  for (let s = 6; s < 66; s += 14) { const id = W.obj({ type: 'til_vitrine', kind: 'mdq', face: LEFT, a0: fl.a0(s), z0: G + 4, w: 8, h: 9, lit: k.night ? lit : true, night: k.night }); fl.rect(s, G + 4, s + 8, G + 13, 0, 0); fl.rect(s, G + 4, s + 8, G + 13, 1, M.GLASS, id); }
  if (k.night) { const p = f.front(37, G + 12, 4); W.light({ x: p.x, y: p.y, z: p.z, r: 36, cr: 1.0, cg: 0.84, cb: 0.55, skip: 2 }); }
  // le panneau d'affichage, les vélos
  f.poster(46, G + 3, 8, 8, { title: 'FÊTE', bg: [0.92, 0.88, 0.70], fg: [0.20, 0.36, 0.60], band: [0.86, 0.50, 0.20], seed: 7, torn: k.bad ? 0.25 : 0 });
  P.push({ key: 'maison_quartier', label: 'La maison de quartier', x: x1 + 4, y: y1 - 1 - 37, z: G + 12 });
}

// Le city-stade : gazon synthétique, bandes de bois peintes, barreaux galvanisés sur un cadre vert, deux buts
// multisports (la cage en bas, le panneau de basket au-dessus), les deux mâts d'éclairage.
function cityStade(k, P) {
  const W = k.W, x0 = 204, y0 = 782, x1 = 324, y1 = 842;
  W.box(x0 - 4, y0 - 4, 1, x1 + 4, y1 + 4, 2, M.CONCRETE);
  const lid = W.obj({ type: 'til_lignes', x0, y0, x1, y1, use: k.bad ? 0.3 : 0.08 });
  W.box(x0, y0, 1, x1, y1, 2, M.TIL_SYNTHE, lid);
  W.box(x0, y0, 2, x1, y1, 3, 0);
  const bande = k.peint([0.22, 0.42, 0.32], 'planches'), cadre = k.peint([0.20, 0.38, 0.28]);
  const cx = (x0 + x1) >> 1;
  const grille = (x, y, along, a0, hmax) => {
    W.box(x, y, G, x + 1, y + 1, G + 5, M.WOOD, bande);
    if ((along - a0) % 12 === 0) { W.box(x, y, G + 5, x + 1, y + 1, hmax + 1, M.METAL, cadre); return; }
    for (let z = G + 5; z < hmax; z++) if (mod(along, 2) === 0 || (z - G) % 6 === 5) W.set(x, y, z, M.METAL);
    W.set(x, y, hmax, M.METAL, cadre);
  };
  for (let x = x0; x < x1; x++) for (const y of [y0, y1 - 1]) { if (Math.abs(x - cx) < 5) continue; grille(x, y, x, x0, G + 16); }
  for (let y = y0; y < y1; y++) for (const x of [x0, x1 - 1]) grille(x, y, y, y0, G + 22);
  // les buts multisports
  for (const [gx, dir] of [[x0 + 3, 1], [x1 - 4, -1]]) {
    const cy = (y0 + y1) >> 1;
    for (const yy of [cy - 7, cy + 7]) W.box(gx, yy, G, gx + 1, yy + 1, G + 10, M.WHITE);
    W.box(gx, cy - 7, G + 10, gx + 1, cy + 8, G + 11, M.WHITE);
    for (let yy = cy - 6; yy < cy + 7; yy++) for (let z = G; z < G + 10; z++) if (mod(yy + z, 2) === 0) W.set(gx - dir, yy, z, M.ESTQ_NET);
    W.box(gx - dir, cy - 1, G + 11, gx - dir + 1, cy + 1, G + 22, M.METAL, cadre);
    W.box(gx, cy - 4, G + 19, gx + 1, cy + 4, G + 26, M.PLASTIC_WHITE);
    for (const [a, b] of [[1, -2], [1, 1], [2, -2], [2, 1], [3, -1], [3, 0]]) W.set(gx + dir * a, cy + b, G + 20, M.PLASTIC_RED);
  }
  // les mâts d'éclairage
  const on = k.night && !k.bad;
  for (const [mx, my] of [[x0 - 3, y0 - 3], [x1 + 2, y1 + 2]]) {
    W.box(mx, my, G, mx + 1, my + 1, G + 36, M.METAL_DARK);
    W.box(mx - 1, my - 1, G + 36, mx + 2, my + 2, G + 38, M.METAL_DARK);
    W.box(mx - 1, my - 1, G + 35, mx + 2, my + 2, G + 36, on ? M.FLOOD : M.FLOOD_OFF);
    if (on) { const ax = (x0 + x1) / 2 - mx, ay = (y0 + y1) / 2 - my, az = -34, al = Math.hypot(ax, ay, az); W.light({ x: mx + 0.5, y: my + 0.5, z: G + 34, r: 140, fall: 1.3, cr: 1.5, cg: 1.48, cb: 1.38, skip: 3, axis: [ax / al, ay / al, az / al], c0: 0.5, c1: 0.82, spill: 0.12 }); }
  }
  P.push({ key: 'city_stade', label: 'Le city-stade', x: x1 + 6, y: (y0 + y1) >> 1, z: G + 12 });
}

// ================================================================ le bord ouest : le talus, les jardins ouvriers, la voie ferrée
function ouest(k) {
  const W = k.W;
  // le talus du nord : l'herbe qui monte doucement vers le bord, les buissons (là où rien n'est bâti)
  for (let y = 0; y < RIV0; y++) for (let x = 0; x < 10; x++) {
    if (W.get(x, y, 2) || W.get(x, y, 1) === M.ASPHALT) continue;
    const h = Math.round((10 - x) / 2.5);
    if (h > 0) { W.box(x, y, 2, x + 1, y + 1, 2 + h, M.SOIL); W.set(x, y, 1 + h, M.TIL_PELOUSE); if (hash(x, y, 1901, 0) < 0.3) W.set(x, y, 2 + h, hash(x, y, 1903, 0) < 0.3 ? M.HEDGE : M.WEED); }
  }
  // les jardins ouvriers, au sud de la tour B : quatre parcelles, leurs cabanes, leurs tuteurs
  const R = (a, b) => k.rh(a, b, 1902);
  for (let j = 0, y = 172; y + 18 <= 260; j++, y += 23) {
    const x0 = 14, x1 = 62, hy = 19;
    W.box(x0, y, 1, x1, y + hy, 2, M.RES_POTAGER);
    W.box(x0, y + hy, 1, x1, y + 23, 2, M.GRAVEL);
    for (let x = x0; x < x1; x += 2) { W.set(x, y, G, M.METAL_DARK); if (x % 6 === 0) W.box(x, y, G, x + 1, y + 1, G + 5, M.WOOD); }
    for (let yy = y; yy < y + hy; yy += 2) W.set(x1 - 1, yy, G, M.METAL_DARK);
    // la cabane de chaque jardin, de sa couleur
    const col = [[0.36, 0.44, 0.30], [0.30, 0.40, 0.52], [0.52, 0.34, 0.24], [0.62, 0.58, 0.48]][j % 4];
    const pid = k.peint(col, 'planches');
    const cx = x0 + 1 + Math.floor(R(j, 1) * 6), cy = y + 3;
    W.box(cx, cy, G, cx + 10, cy + 8, G + 9, M.WOOD, pid);
    W.box(cx - 1, cy - 1, G + 9, cx + 11, cy + 9, G + 10, M.RES_TOLE);
    const fc = new Facade(W, LEFT, cx, cy, 10, 8); fc.door(2, G, 3, 7, { mat: M.WOOD_DARK, frame: false });
    const fr = new Facade(W, RIGHT, cx, cy, 10, 8); fr.window(2, G + 4, 3, 3, { state: k.night && j === 1 ? 'lit' : 'dark', sill: false, lintel: false, spill: false });
    // les rangs de légumes, les tuteurs des tomates, le bidon, la serre
    for (let i = 0; i < 5; i++) { const tx = x0 + 18 + i * 5, ty = y + 3 + Math.floor(R(j, i) * 8); W.box(tx, ty, G, tx + 1, ty + 1, G + 7, M.WOOD); W.set(tx, ty, G + 4, M.HEDGE); W.set(tx, ty, G + 5, M.HEDGE); W.set(tx, ty + 1, G + 3, M.HEDGE); }
    for (let x = x0 + 16; x < x1 - 4; x += 3) if (R(j, x) < 0.7) W.box(x, y + 13, G, x + 2, y + 16, G + 1 + Math.floor(R(x, j) * 2), M.HEDGE);
    W.box(cx + 11, cy + 2, G, cx + 13, cy + 4, G + 4, M.BIN);
    if (R(j, 9) < 0.5) { W.box(x1 - 10, y + 2, G, x1 - 3, y + 8, G + 4, M.GLASS); W.box(x1 - 10, y + 2, G + 4, x1 - 3, y + 8, G + 5, M.METAL); }
  }
  // la voie ferrée du sud : le ballast, les traverses, les rails, les poteaux caténaires ; elle sort à l'ouest avant la Rive
  const xc = y => y >= 600 ? 20 : 20 - (600 - y) * 0.24;
  for (let y = RIV1; y < LY; y++) {
    const c = xc(y);
    for (let x = Math.floor(c - 14); x <= c + 14; x++) {
      if (x < 0 || x >= 56) continue;
      const dd = Math.abs(x - c);
      const top = dd < 9 ? 5 : dd < 13 ? 4 - Math.floor(dd - 9) / 2 : 2;
      if (top > 2) { W.box(x, y, 1, x + 1, y + 1, Math.round(top), M.TIL_BALLAST); }
    }
    if (y % 3 === 0) for (let x = Math.round(c - 6); x <= c + 6; x++) if (x >= 0) W.set(x, y, 5, M.WOOD_DARK);
    for (const r of [-3.5, 3.5]) { const x = Math.round(c + r); if (x >= 0) { W.set(x, y, 5, M.METAL); W.set(x, y, 6, M.METAL); } }
    if (y % 64 === 0 && y > 480) {
      const mx = Math.round(c + 11); if (mx >= 0) {
        W.box(mx, y, 2, mx + 1, y + 1, 36, M.METAL_DARK);
        for (let x = Math.round(c) - 1; x <= mx; x++) if (x >= 0) W.set(x, y, 34, M.METAL_DARK);
      }
    }
    const cx2 = Math.round(c); if (cx2 >= 0) W.set(cx2, y, 30, M.METAL_DARK);
  }
  // le signal : un mât, une cible noire, deux feux
  { const sx = 33, sy = 700; W.box(sx, sy, 4, sx + 1, sy + 1, 20, M.METAL_DARK); W.box(sx - 1, sy, 20, sx + 2, sy + 1, 26, M.METAL_DARK); W.set(sx, sy + 1, 24, k.night ? M.RED_LIGHT : M.PLASTIC_RED); W.set(sx, sy + 1, 22, M.CAR_GLASS); }
  // la clôture de la voie, le chemin
  for (let y = 600; y < 1026; y++) { W.set(38, y, G + 4, M.METAL); if (y % 4 === 0) W.box(38, y, G, 39, y + 1, G + 4, M.METAL_DARK); }
  sol(k, 40, 470, 56, 1026, M.GRAVEL);
  for (const [x, y, s] of [[46, 640, 11], [48, 760, 12], [44, 880, 13], [46, 990, 14], [48, 520, 15]]) tilleul(W, x, y, G, { seed: 700 + s, tronc: 11, r: 6 });
  // le train du soir
  if (k.night && !k.bad) train(k, 800);
}
function train(k, ya) {
  const W = k.W, x = 14, zg = 6;
  for (let i = 0; i < 3; i++) {
    const y0 = ya + i * 64, y1 = y0 + 62;
    W.box(x, y0, zg, x + 12, y1, zg + 2, M.METAL_DARK);
    W.box(x, y0, zg + 2, x + 12, y1, zg + 16, M.WHITE);
    W.box(x, y0, zg + 6, x + 12, y1, zg + 7, M.METAL_BORD);
    W.box(x + 1, y0 + 1, zg + 16, x + 11, y1 - 1, zg + 17, M.METAL);
    const vid = W.obj({ type: 'res_carvitre', face: RIGHT, a0: y1 - 1, z0: zg + 8, w: 60, h: 5, lit: true, pax: 0.4, seed: i * 7 });
    for (let y = y0 + 1; y < y1 - 1; y++) for (let z = zg + 8; z < zg + 13; z++) { W.set(x + 11, y, z, M.CAR_GLASS, vid); }
  }
  W.set(x + 3, ya, zg + 4, M.HEADLIGHT); W.set(x + 8, ya, zg + 4, M.HEADLIGHT);
  W.light({ x: x + 6, y: ya + 90, z: zg + 12, r: 60, cr: 0.6, cg: 0.5, cb: 0.32, shadow: false });
}

// ================================================================ la verdure : les tilleuls, les haies, les murets, les chemins
function verdure(k) {
  const W = k.W;
  // un arbre ne pousse que sur un sol libre (pas dans un mur, pas sur une chaussée)
  const libre = (x, y) => { for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) { const t = W.get(x + dx, y + dy, 1); if (t === M.ASPHALT || t === M.GUTTER || t === M.ROADLINE || t === 0) return false; for (let z = 2; z < 16; z++) if (W.get(x + dx, y + dy, z)) return false; } return true; };
  let n = 0;
  const arbre = (x, y, r, s) => { if (!libre(x, y)) return; tilleul(W, x, y, G, { seed: 900 + (s != null ? s : n), r }); n++; };
  // les chemins de traverse, que les pas ont creusés dans les pelouses
  const traverse = (pts, w = 1.6) => {
    for (let i = 0; i + 1 < pts.length; i++) {
      const [xa, ya] = pts[i], [xb, yb] = pts[i + 1], L = Math.ceil(Math.hypot(xb - xa, yb - ya));
      for (let t = 0; t <= L; t++) {
        const x = xa + (xb - xa) * t / L + Math.sin(t * 0.21 + i) * 1.2, y = ya + (yb - ya) * t / L;
        for (let dy = -w; dy <= w; dy++) for (let dx = -w; dx <= w; dx++) { const xx = Math.round(x + dx), yy = Math.round(y + dy); if (W.get(xx, yy, 1) === M.TIL_PELOUSE && !W.get(xx, yy, 2) && (Math.abs(dx) + Math.abs(dy) < w * 1.3 || hash(xx, yy, 1971, 0) < 0.4)) W.set(xx, yy, 1, hash(xx, yy, 1972, 0) < 0.6 ? M.SOIL : M.MUD); }
      }
    }
  };
  traverse([[300, 164], [318, 180], [338, 246], [340, 254]]);
  traverse([[264, 846], [258, 870]]); traverse([[290, 846], [318, 900], [322, 950]]);
  traverse([[110, 806], [118, 790], [126, 770]]); traverse([[116, 904], [140, 906]]);
  traverse([[198, 760], [204, 776]]); traverse([[118, 470], [140, 462], [168, 460]]);
  // les allées de stabilisé du sud
  const allee = (xa, ya, xb, yb, w = 3) => { const L = Math.ceil(Math.hypot(xb - xa, yb - ya)); for (let i = 0; i <= L; i++) { const x = Math.round(xa + (xb - xa) * i / L), y = Math.round(ya + (yb - ya) * i / L); W.box(x - w, y - w, 1, x + w, y + w, 2, M.GRAVEL); } };
  allee(160, 936, 160, 1024); allee(116, 806, 196, 806); allee(196, 806, 204, 780);
  // les haies taillées : le long du parking du nord, autour de l'aire de jeux du sud, devant le plot F
  const haie = (x0, y0, x1, y1, h = 4) => { for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) if (W.get(x, y, 1) === M.TIL_PELOUSE && !W.get(x, y, 2)) W.box(x, y, 2, x + 1, y + 1, 2 + h - (hash(x, y, 1973, 0) < 0.25 ? 1 : 0), M.HEDGE); };
  haie(200, 165, 232, 168); haie(204, 862, 214, 930); haie(292, 862, 300, 930, 3);
  haie(236, 1002, 250, 1005, 3); haie(270, 1002, 298, 1005, 3); haie(320, 1002, 334, 1005, 3);
  haie(118, 458, 168, 461, 3); haie(196, 458, 352, 461, 3);
  // les murets de béton où l'on s'assoit
  const muret = (x0, y0, x1, y1) => { W.box(x0, y0, 1, x1, y1, G + 3, M.CONCRETE); W.box(x0, y0, G + 3, x1, y1, G + 4, M.CURB); };
  muret(196, 252, 226, 254); muret(120, 760, 124, 790); muret(300, 890, 302, 920);
  // les tilleuls
  // — le nord : le parc, le bord du parking, l'est de la barre A (la fresque reste dégagée)
  for (const [x, y, r] of [[116, 186, 11], [116, 232, 12], [140, 246, 10], [190, 238, 11], [214, 176, 10], [212, 232, 9], [342, 182, 10], [346, 262, 9], [128, 168, 8], [80, 186, 11], [84, 240, 10], [338, 46, 8], [66, 92, 7]]) arbre(x, y, r);
  // — le sud : la pelouse du quai, l'est des boxes, le parking, le bord du boulevard
  for (const [x, y, r] of [[128, 474, 10], [154, 476, 9], [214, 474, 11], [250, 478, 10], [286, 474, 11], [324, 476, 10], [330, 506, 9], [344, 596, 8], [346, 790, 10], [346, 860, 11], [346, 930, 10], [346, 990, 9]]) arbre(x, y, r);
  // — les pelouses autour de la barre E, de la tour D, du plot F
  for (const [x, y, r] of [[136, 784, 11], [176, 840, 10], [128, 856, 12], [206, 870, 9], [128, 962, 11], [208, 950, 12], [176, 1006, 10], [100, 1010, 11], [60, 1012, 9], [236, 1014, 8], [286, 1014, 9], [332, 1014, 8], [316, 870, 10], [306, 940, 9], [128, 590, 10], [130, 700, 9]]) arbre(x, y, r);
  // — les arbres d'alignement du parking de l'avenue, dans leurs fosses
  for (const x of [245, 305]) { W.box(x - 3, 556, 0, x + 5, 572, 2, M.CURB); W.box(x - 2, 557, 1, x + 4, 571, 2, M.SOIL); W.box(x - 2, 557, 2, x + 4, 571, 3, 0); tilleul(W, x, 563, G, { seed: 950 + x, r: 8 }); }
  W.stampLeaves(270, 700, 70, 0.25); W.stampLeaves(200, 470, 60, 0.3);
}

// ================================================================ les gens, leurs scooters, leurs voitures, leurs vélos
// Un vélo debout (sur sa béquille ou à l'arceau)
function velo(W, x, y, axis, cadre) {
  const B2 = (a0, b0, z0, a1, b1, z1, m) => axis === 'x' ? W.box(x + a0, y + b0, G + z0, x + a1, y + b1, G + z1, m) : W.box(x + b0, y + a0, G + z0, x + b1, y + a1, G + z1, m);
  for (const a of [0, 5]) { B2(a, 0, 0, a + 2, 1, 1, M.TIRE); B2(a, 0, 2, a + 2, 1, 3, M.TIRE); B2(a - 0, 0, 1, a + 1, 1, 2, M.TIRE); B2(a + 1, 0, 1, a + 2, 1, 2, M.TIRE); }
  B2(1, 0, 2, 7, 1, 3, cadre); B2(3, 0, 3, 4, 1, 4, M.METAL_DARK); B2(6, 0, 3, 7, 1, 5, cadre); B2(5, -1, 5, 6, 2, 6, M.METAL_DARK);
}
function gens(k) {
  const W = k.W;
  const sp = (def, x, y, z = G) => W.sprite(Object.assign({ x, y, z }, def));
  const peau = i => PEAU[i % 4], chev = i => CHEVEUX[i % 5];
  const maillots = [[0.20, 0.40, 0.70], [0.78, 0.22, 0.20], [0.92, 0.80, 0.30], [0.20, 0.40, 0.70], [0.30, 0.56, 0.36], [0.90, 0.90, 0.86]];
  // le muret au bord du city-stade, où l'on regarde le match
  W.box(337, 796, 1, 339, 828, G + 3, M.CONCRETE); W.box(337, 796, G + 3, 339, 828, G + 4, M.CURB);
  if (k.day) {
    // le city-stade : une partie, ceux qui attendent leur tour
    const nk = k.bad ? 4 : 9;
    [[220, 800], [240, 820], [262, 806], [282, 826], [300, 798], [252, 830], [230, 830], [292, 812], [312, 822]].slice(0, nk).forEach(([x, y], i) => sp(varie(i % 3 === 0 ? GAMIN_TIR : GAMIN_SP, peau(i), chev(i), { t: maillots[i % 6] }), x, y));
    sp(SP.BALL, 266, 812);
    sp(varie(ADO_ASSIS, peau(2)), 338, 806, G + 4); sp(varie(ADO_ASSIS, peau(0), { q: [0.20, 0.36, 0.56] }), 338, 816, G + 4);
    // la place : les courses, la poussette, les anciens sur les bancs, la bande devant le snack
    sp(varie(CABAS, peau(1)), 268, 640); sp(varie(ANCIEN, peau(0)), 230, 672); sp(varie(POUSSETTE, peau(3)), 250, 700);
    sp(varie(ADO, peau(2), { q: [0.55, 0.16, 0.16] }), 300, 640); sp(varie(ADO, peau(1)), 304, 642);
    sp(varie(CABAS, peau(3), { f: [0.62, 0.30, 0.40], d: [0.22, 0.24, 0.40] }), 286, 692); sp(varie(ANCIEN, peau(2), { v: [0.30, 0.30, 0.34] }), 282, 694);
    sp(varie(GAMIN_SP, peau(1), { t: [0.86, 0.50, 0.20] }), 262, 722); sp(varie(GAMIN_SP, peau(2), { t: [0.50, 0.30, 0.60] }), 258, 716);
    // l'arrêt de bus, la sortie de la maison de quartier
    sp(varie(CABAS, peau(0), { f: [0.36, 0.36, 0.40] }), 352, 692); sp(varie(ANCIEN, peau(3)), 351, 700);
    sp(varie(GAMIN_SP, peau(3), { t: [0.30, 0.56, 0.36] }), 202, 734); sp(varie(GAMIN_SP, peau(0), { t: [0.92, 0.80, 0.30] }), 206, 740); sp(varie(POUSSETTE, peau(1), { v: [0.24, 0.42, 0.64] }), 210, 726);
    // les aires de jeux
    sp(varie(GAMIN_SP, peau(1), { t: [0.86, 0.50, 0.20] }), 150, 190); sp(varie(GAMIN_SP, peau(3), { t: [0.50, 0.30, 0.60] }), 166, 182);
    sp(varie(POUSSETTE, peau(0), { v: [0.30, 0.44, 0.50] }), 184, 196);
    sp(varie(GAMIN_SP, peau(2), { t: [0.92, 0.80, 0.30] }), 240, 890); sp(varie(ANCIEN, peau(2)), 256, 918); sp(varie(GAMIN_SP, peau(0), { t: [0.78, 0.22, 0.20] }), 262, 896);
    // les boxes : celui qui répare son scooter
    sp(varie(ADO, peau(3), { q: [0.24, 0.26, 0.30] }), 236, 523);
    // le parc, les jardins, la passerelle, les canards
    sp(varie(ANCIEN, peau(1), { v: [0.30, 0.34, 0.30] }), 40, 190); sp(varie(ANCIEN, peau(0), { c: [0.70, 0.66, 0.50], v: [0.36, 0.40, 0.30] }), 30, 236);
    sp(CHIEN, 112, 206); sp(varie(ANCIEN, peau(3), { v: [0.40, 0.30, 0.24] }), 106, 204);
    sp(varie(ADO, peau(0), { q: [0.20, 0.36, 0.56] }), 174, 360); sp(varie(ADO, peau(3)), 176, 366);
    sp(CANARD, 220, 352, -7); sp(CANARD, 226, 356, -7); sp(CANARD, 140, 372, -7);
    sp(varie(POUSSETTE, peau(2), { v: [0.70, 0.56, 0.30] }), 196, 102); sp(varie(CABAS, peau(2)), 274, 160);
  } else if (!k.bad) {
    // le soir : les grands sous les projecteurs du city-stade, la bande devant le hall, le snack, les boxes
    [[230, 806], [256, 820], [282, 802], [300, 828], [244, 796]].forEach(([x, y], i) => sp(varie(i % 2 ? GAMIN_TIR : ADO, peau(i + 1), chev(i), i % 2 ? { t: maillots[i] } : {}), x, y));
    sp(SP.BALL, 262, 812); sp(varie(ADO_ASSIS, peau(1)), 338, 812, G + 4);
    sp(varie(ADO, peau(2)), 130, 652); sp(varie(ADO, peau(0), { q: [0.20, 0.36, 0.56] }), 134, 670); sp(varie(ADO, peau(3), { q: [0.62, 0.60, 0.56] }), 128, 662);
    sp(varie(ADO, peau(1), { q: [0.55, 0.16, 0.16] }), 296, 640); sp(varie(ANCIEN, peau(2)), 306, 642); sp(varie(ADO, peau(3)), 300, 638);
    sp(varie(ADO, peau(0), { q: [0.24, 0.26, 0.30] }), 224, 524); sp(varie(ADO, peau(2), { q: [0.60, 0.50, 0.30] }), 230, 526);
    sp(varie(ADO, peau(3), { q: [0.12, 0.12, 0.14] }), 280, 252); sp(varie(ADO, peau(1), { q: [0.86, 0.85, 0.80] }), 286, 254);
    sp(varie(ANCIEN, peau(0)), 262, 254); sp(CHIEN, 268, 256);
    sp(varie(CABAS, peau(2), { f: [0.30, 0.30, 0.36] }), 352, 696);
    sp(varie(ADO, peau(2), { q: [0.55, 0.16, 0.16] }), 175, 350); sp(varie(CABAS, peau(1), { f: [0.70, 0.62, 0.40] }), 177, 354);
  } else {
    sp(varie(ADO, peau(2)), 296, 638); sp(varie(ADO, peau(3)), 132, 660);
    sp(varie(ADO, peau(1), { q: [0.12, 0.12, 0.14] }), 228, 524);
  }
  // les scooters : devant les halls, les boxes, le snack
  scooter(W, 132, 676, G, 'x', M.CAR_BLUE); scooter(W, 140, 680, G, 'x', M.METAL_DARK);
  scooter(W, 112, 102, G, 'x', M.PLASTIC_RED); scooter(W, 320, 634, G, 'x', M.CAR_WHITE);
  if (k.night) { scooter(W, 214, 524, G, 'x', M.METAL_DARK); scooter(W, 238, 525, G, 'x', M.PLASTIC_RED); }
  // les vélos à l'arceau de la maison de quartier
  for (const [y, c] of [[704, M.CAR_BLUE], [708, M.PLASTIC_RED], [712, M.METAL_GREEN]]) { W.box(198, y - 1, G, 199, y, G + 4, M.METAL); velo(W, 197, y, 'x', c); }
  // la boîte aux lettres de la place
  { const x = 250, y = 640; W.box(x, y, G, x + 1, y + 1, G + 6, M.METAL_DARK); W.box(x - 1, y - 1, G + 6, x + 2, y + 2, G + 10, M.PLASTIC_WHITE, k.peint([0.86, 0.70, 0.16])); W.set(x, y + 1, G + 9, M.METAL_DARK); }
  // les voitures du parking de l'avenue, et le long de la rue du Sud
  const paints = [M.CAR_BLUE, M.CAR_WHITE, M.CAR_BORD, M.CAR_BEIGE, M.PLASTIC_RED, M.SEAT_GREY, M.METAL_GREEN];
  for (let x = 197; x + 10 < 344; x += 12) {
    if ((x > 236 && x < 254) || (x > 296 && x < 314)) continue;
    const v = k.rh(x, 552, 2001); if (v < (k.night ? 0.3 : 0.5)) continue;
    if (k.day && x > 320) { voiture(W, x + 1, 554, 1, 'y', 1, M.CAR_WHITE, { modele: 'fourgon' }); continue; }
    voiture(W, x + 2, 555, 1, 'y', 1, paints[Math.floor(k.rh(x, 3, 2002) * paints.length)], { modele: v > 0.85 ? 'break' : v > 0.7 ? 'citadine' : 'berline' });
  }
  for (const x of [56, 96, 150, 196, 262, 300]) { const v = k.rh(x, 1037, 2003); if (v < 0.4) continue; voiture(W, x, 1037, 1, 'x', -1, paints[Math.floor(v * 7) % 7], { modele: v > 0.8 ? 'citadine' : 'berline' }); }
  // la circulation : une voiture qui rentre, phares allumés, sur l'avenue
  if (k.night && !k.bad) {
    voiture(W, 300, 541, 1, 'x', -1, M.CAR_BLUE, { modele: 'berline', phares: true });
    W.light({ x: 296, y: 545, z: 3.5, r: 80, fall: 1.5, cr: 1.1, cg: 1.04, cb: 0.84, axis: [-0.985, 0, -0.17], c0: 0.82, c1: 0.97, spill: 0, skip: 1 });
  }
  // les sacs-poubelle de la mauvaise saison, au pied des conteneurs
  if (k.bad) for (const [x, y] of [[346, 606], [347, 610], [345, 612], [120, 640], [122, 644], [300, 166], [302, 163]]) { W.box(x, y, G, x + 2, y + 2, G + 2, M.TIRE); W.set(x, y, G + 2, M.TIRE); }
}
