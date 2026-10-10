'use strict';
// FUSIBLE — les figurines du casting (la partie RPG façon Punch Club).
// Chaque personnage est sculpté en voxels de 4 cm (un adulte fait 42 à 46 voxels),
// posé de trois quarts face sur un socle de 1,2 m dans la matière de son lieu,
// puis rendu par le moteur maison : un soir doux, une lumière chaude du haut-gauche,
// une ambiance un peu froide, une petite lampe de face pour les yeux.
// Sortie : out/fig_<clé>.png, 150 × 230 en natif (affiché ×2).
//
//   node figurines.js                    les douze
//   node figurines.js gege josiane       une partie
//   node figurines.js --zoom 3 gege      plus une copie agrandie dans out/zoom/ (inspection)
const path = require('path');
const E = require('./engine');
const { World, TOP, LEFT, RIGHT, hash, vnoise, fbm, mod, clamp, material, overlay } = E;

// ---------------------------------------------------------------- la scène
const S = 30;                 // le socle : 30 × 30 voxels = 1,2 m
const MG = 2;                 // marge autour du socle
const T = 7;                  // épaisseur du socle (28 cm)
const WX = S + 2 * MG;
const WZ = 80;
const OX = MG + S / 2 - 0.5;  // l'axe de la figurine passe au centre d'un voxel
const OY = MG + S / 2 - 0.5;
const FW = 150, FH = 230;     // le cadre, identique pour les douze
const CU = -75, CV = -120;    // la caméra : le socle tombe au même endroit sur chaque image

// ---------------------------------------------------------------- petits outils
const set3 = (c, a) => { c.cr = a[0]; c.cg = a[1]; c.cb = a[2]; };
const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const tint = (c, a, t) => { c.cr += (a[0] - c.cr) * t; c.cg += (a[1] - c.cg) * t; c.cb += (a[2] - c.cb) * t; };
const grain = (c, amt, s = 0) => mul(c, 1 + (hash(c.a, c.b, c.face * 7 + s, c.m) - 0.5) * 2 * amt);
const lerp = (a, b, t) => a + (b - a) * t;
const norm = (a, b, c) => { const l = Math.hypot(a, b, c); return [a / l, b / l, c / l]; };
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const scl = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const lerp3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

// Coordonnées locales du texel touché (repère de la figurine : x vers la droite de l'image,
// y vers l'avant du personnage, z vers le haut, 0 au-dessus du socle). L'axe normal à la
// face est pris au centre du voxel : un motif défini dans le volume reste cohérent.
const P = { x: 0, y: 0, z: 0, tx: 0, ty: 0, tz: 0, u: 0 };
function loc(c) {
  const F = c.W.fig;
  let x = c.hx, y = c.hy, z = c.hz;
  if (c.face === TOP) z = c.iz + 0.5; else if (c.face === LEFT) y = c.iy + 0.5; else x = c.ix + 0.5;
  P.x = x - F.ox; P.y = y - F.oy; P.z = z - F.oz;
  P.tx = Math.floor(2 * P.x) + 0.5; P.ty = Math.floor(2 * P.y) + 0.5; P.tz = Math.floor(2 * P.z) + 0.5;
  P.u = c.face === RIGHT ? P.ty + 40 : P.tx;       // la coordonnée horizontale sur la face
  return P;
}
// plis : traînées verticales tirées par la matière, et fronces en zigzag aux articulations
function folds(c, p, seed, k = 1) {
  const f = vnoise(p.u * 0.42, p.z * 0.3, seed);
  if (f > 0.72) mul(c, 1 - 0.16 * k); else if (f > 0.64) mul(c, 1 - 0.07 * k); else if (f < 0.2) mul(c, 1 + 0.06 * k);
  const J = c.W.fig.joints;
  if (J && c.face !== TOP) for (const j of J) {
    const dz = p.z - j[2];
    if (Math.abs(dz) > 1.6 || Math.abs(p.x - j[0]) > j[3] || Math.abs(p.y - j[1]) > j[3]) continue;
    const zig = mod(p.u, 4) < 2 ? 0.5 : 0;
    if (Math.abs(dz - zig) < 0.26 || Math.abs(dz - zig + 1.0) < 0.26) mul(c, 0.8);
  }
}

// ---------------------------------------------------------------- palette
const BORD = [0.47, 0.11, 0.17], BORD_D = [0.31, 0.07, 0.11];   // le Racing Aubérive : bordeaux…
const GRIS = [0.63, 0.63, 0.61];                                 // … et gris
const OR = [0.86, 0.68, 0.22], JAUNE = [0.92, 0.76, 0.16];
const SKIN = {
  porcelaine: [0.92, 0.76, 0.64], clair: [0.88, 0.67, 0.52], dore: [0.80, 0.57, 0.38],
  olive: [0.70, 0.49, 0.32], brun: [0.55, 0.35, 0.22], ebene: [0.36, 0.23, 0.15],
};
const HAIR = {
  noir: [0.085, 0.075, 0.085], brun: [0.22, 0.14, 0.085], chatain: [0.40, 0.22, 0.12],
  blond: [0.86, 0.70, 0.36], gris: [0.60, 0.59, 0.57], blanc: [0.84, 0.83, 0.80],
};

// ---------------------------------------------------------------- matières des figurines
const FM = {};
const mat = (name, fn, flags) => material('figurine ' + name, fn, flags);

for (const k in SKIN) {
  const col = SKIN[k];
  FM['peau_' + k] = mat('peau ' + k, c => {
    set3(c, col);
    if (c.face === TOP) mul(c, 1.05); else if (c.face === RIGHT) mul(c, 1.06);
    grain(c, 0.02, 3);
  });
}
// Les cheveux : mèches au texel, reflets sur le dessus.
function hairMat(name, col, o = {}) {
  return mat('cheveux ' + name, c => {
    const p = loc(c);
    set3(c, o.side && (c.face === RIGHT || Math.abs(p.x) > 3.3) ? o.side : col);
    const h = hash(c.a, c.b, c.face + 811, 3);
    const lift = Math.max(...col) < 0.2 ? 0.07 : 0;            // les cheveux noirs ont des reflets bleutés
    if (c.face === TOP) {
      mul(c, 1.12);
      if (mod(c.a + c.b, 3) === 0) mul(c, 0.78);
      else if (h > 0.78) { mul(c, 1.25); c.cr += lift; c.cg += lift; c.cb += lift * 1.4; }
    } else {
      if (mod(c.a, 2) === 0) mul(c, 0.86);
      if (h > 0.88) { mul(c, 1.2); c.cr += lift * 0.6; c.cg += lift * 0.6; c.cb += lift; } else if (h < 0.12) mul(c, 0.78);
    }
  });
}
for (const k in HAIR) FM['cheveux_' + k] = hairMat(k, HAIR[k]);
FM.cheveux_poivre = hairMat('poivre et sel', [0.13, 0.10, 0.08], { side: [0.56, 0.55, 0.53] });

// Le tissu : une couleur, des plis, un grain ; fn ajoute le détail propre au vêtement.
function cloth(name, col, o = {}) {
  return mat(name, c => {
    const p = loc(c);
    set3(c, col);
    if (c.face === TOP) mul(c, o.top || 1.06);
    if (o.folds !== false) folds(c, p, o.seed || 7, o.fk || 1);
    if (o.fn) o.fn(c, p, c.W.fig);
    grain(c, o.grain != null ? o.grain : 0.03, 5);
  }, o.flags);
}
// Le devant d'une veste : l'encolure en V (chemise, cravate), le revers, la fermeture.
function front(c, p, F) {
  const fr = F.front; if (!fr) return false;
  if (c.face === RIGHT || p.y < fr.yMin) return false;
  const ax = Math.abs(p.tx), tz = p.tz, zt = 2 * fr.zTop, zv = 2 * fr.zV;
  if (tz <= zt && tz >= zv) {
    const half = 2 * fr.wTop * (tz - zv) / (zt - zv) + (fr.w0 || 0);
    if (ax <= half) {
      set3(c, fr.inner);
      if (fr.tie && ax <= 1 && tz < zt - 1.5) { set3(c, fr.tie); if (tz > zt - 3) mul(c, 0.8); }
      if (fr.collar && tz > zt - 2.5 && ax > half - 1.6) mul(c, 0.82);
      return true;
    }
    if (fr.edge && ax <= half + 1.2) { mul(c, fr.edge); return true; }
  }
  if (tz < zv && tz > 2 * (fr.zBot || 0)) {
    if (fr.line === 'zip' && ax <= 0.5) { set3(c, fr.lineCol); return true; }
    if (fr.line === 'buttons' && ax <= 0.5 && fr.buttons.some(b => Math.abs(tz - 2 * b) < 0.6)) { set3(c, fr.lineCol); return true; }
  }
  return false;
}

// -- le club : maillot bordeaux à bandes grises, short gris, chaussettes bordeaux
FM.maillot = mat('maillot du club', c => {
  const p = loc(c), F = c.W.fig;
  set3(c, BORD);
  const ax = Math.abs(c.face === RIGHT ? Math.floor(2 * p.x) + 0.5 : p.tx);
  const st = mod(ax + 0.5, 6);
  if (st >= 2.5 && st <= 4.5 && !(c.face === TOP && p.z > F.yoke)) set3(c, GRIS);
  if (c.face === TOP) mul(c, 1.06);
  folds(c, p, 17, 0.6);
  if (F.neck && p.z > F.neck.z0 && Math.hypot(p.x - F.neck.x, p.y - F.neck.y) < F.neck.r) set3(c, GRIS);
  if (F.neck && c.face === LEFT && p.y > 1 && p.z > F.neck.z0 - 1.6 && Math.abs(p.tx) <= 0.5 + (p.z - F.neck.z0 + 1.6) * 1.2) set3(c, GRIS);
  if (F.crest && c.face === LEFT && p.y > 1) {
    const dx = p.tx - F.crest[0], dz = p.tz - F.crest[1];
    const inShield = (Math.abs(dx) <= 1.5 && dz <= 1.5 && dz >= -0.5) || (Math.abs(dx) <= 0.5 && dz >= -1.5 && dz <= 1.5);
    if (inShield) { set3(c, OR); if (Math.abs(dx) <= 0.5 && dz <= 0.5 && dz >= -0.5) set3(c, BORD_D); }
  }
  grain(c, 0.025, 9);
});
FM.manche = cloth('manche du maillot', BORD, { seed: 19, fk: 0.7 });
FM.revers = cloth('revers gris', GRIS, { folds: false });
FM.short = cloth('short gris', [0.52, 0.52, 0.51], { seed: 21, fn: (c, p) => { if (c.face === RIGHT && Math.abs(p.x) > 3.4) set3(c, BORD); } });
FM.chaussette = mat('chaussette bordeaux', c => {
  const p = loc(c);
  set3(c, BORD);
  if (p.z > c.W.fig.sock - 1.2) set3(c, GRIS);
  if (mod(Math.floor(2 * p.z), 2) === 0) mul(c, 0.92);
  if (c.face === TOP) mul(c, 1.05);
  grain(c, 0.03, 11);
});
FM.crampon = mat('chaussure à crampons', c => {
  const p = loc(c);
  rgb(c, 0.075, 0.07, 0.07);
  if (c.face === TOP) rgb(c, 0.15, 0.14, 0.14);
  if (c.face !== TOP && Math.floor(2 * p.z) === 3) rgb(c, 0.62, 0.62, 0.58);   // le liseré
  grain(c, 0.06, 13);
});
FM.semelle = mat('semelle', c => { rgb(c, 0.17, 0.16, 0.15); grain(c, 0.08, 14); });
FM.semelle_claire = mat('semelle claire', c => { rgb(c, 0.80, 0.79, 0.74); grain(c, 0.05, 14); });
// Le ballon : blanc à pentagones noirs (les sommets d'un icosaèdre).
const ICO = (() => {
  const t = (1 + Math.sqrt(5)) / 2, v = [];
  for (const a of [-1, 1]) for (const b of [-t, t]) { v.push(norm(0, a, b)); v.push(norm(a, b, 0)); v.push(norm(b, 0, a)); }
  return v;
})();
FM.ballon = mat('ballon', c => {
  const B = c.W.fig.ball, F = c.W.fig;
  set3(c, [0.88, 0.87, 0.82]);
  if (B) {
    const d = norm(c.hx - F.ox - B[0], c.hy - F.oy - B[1], c.hz - F.oz - B[2]);
    let best = -1;
    for (const v of ICO) { const q = v[0] * d[0] + v[1] * d[1] + v[2] * d[2]; if (q > best) best = q; }
    if (best > 0.955) rgb(c, 0.10, 0.10, 0.11);
  }
  if (c.face === TOP) mul(c, 1.05);
  grain(c, 0.02, 15);
});

// -- le gardien
FM.gardien = mat('maillot de gardien', c => {
  const p = loc(c), F = c.W.fig;
  rgb(c, 0.17, 0.18, 0.19);
  // le motif des années 90 : des chevrons anthracite sur la poitrine
  const ax = Math.abs(p.tx);
  if (p.z > F.chev && mod(Math.floor((p.tz - ax * 0.5) / 3), 3) === 0) rgb(c, 0.31, 0.32, 0.34);
  if (c.face === TOP) mul(c, 1.08);
  folds(c, p, 41, 0.8);
  if (F.neck && p.z > F.neck.z0 && Math.hypot(p.x - F.neck.x, p.y - F.neck.y) < F.neck.r) set3(c, [0.85, 0.70, 0.18]);
  grain(c, 0.03, 42);
});
FM.gardien_manche = mat('manche de gardien', c => {
  const p = loc(c), F = c.W.fig;
  rgb(c, 0.17, 0.18, 0.19);
  if (c.face === TOP) mul(c, 1.08);
  if (F.pad && F.pad(p)) { rgb(c, 0.10, 0.10, 0.11); if (mod(p.tz, 2) === 0.5) mul(c, 1.3); }   // les coudières
  folds(c, p, 43, 0.8);
  grain(c, 0.03, 44);
});
FM.short_noir = cloth('short noir', [0.11, 0.11, 0.12], { seed: 45 });
FM.chaussette_noire = mat('chaussette noire', c => { const p = loc(c); rgb(c, 0.12, 0.12, 0.13); if (p.z > c.W.fig.sock - 1.2) set3(c, [0.80, 0.66, 0.17]); if (mod(Math.floor(2 * p.z), 2) === 0) mul(c, 0.9); grain(c, 0.03, 46); });
FM.gant = mat('gant de gardien', c => {
  const p = loc(c);
  set3(c, JAUNE);
  if (c.face === TOP) mul(c, 1.08); else if (c.face === RIGHT) mul(c, 0.92);
  if (c.face === LEFT && mod(p.tx, 2) === 0.5 && p.z > c.W.fig.glove) mul(c, 0.72);   // les doigts
  grain(c, 0.03, 47);
});
FM.gant_bande = mat('poignet de gant', c => { rgb(c, 0.10, 0.10, 0.11); const p = loc(c); if (mod(p.u, 4) < 1) rgb(c, 0.80, 0.80, 0.76); grain(c, 0.04, 48); });

// -- survêtements (la bande se pose à part, en peinture sur le flanc)
FM.survet_bord = cloth('survêtement bordeaux', BORD, { seed: 51, fn: (c, p, F) => front(c, p, F) });
FM.survet_marine = cloth('survêtement marine', [0.15, 0.20, 0.36], { seed: 52, fn: (c, p, F) => front(c, p, F) });
FM.bande_grise = cloth('bande grise', GRIS, { folds: false });
FM.bande_creme = cloth('bande crème', [0.84, 0.79, 0.64], { folds: false });
FM.basket = mat('basket', c => { const p = loc(c); rgb(c, 0.80, 0.79, 0.75); if (c.face !== TOP && Math.floor(2 * p.z) === 2) set3(c, c.W.fig.shoeLine || BORD); if (c.face === TOP) mul(c, 1.05); grain(c, 0.04, 53); });
FM.basket_sombre = mat('basket sombre', c => { const p = loc(c); rgb(c, 0.16, 0.16, 0.18); if (c.face !== TOP && Math.floor(2 * p.z) === 2) rgb(c, 0.70, 0.70, 0.66); if (c.face === TOP) mul(c, 1.1); grain(c, 0.05, 54); });

// -- costumes, tailleurs, chemises
FM.costume_bord = cloth('costume bordeaux', [0.43, 0.10, 0.15], {
  seed: 61, fn: (c, p, F) => {
    if (front(c, p, F)) return;
    if (F.pocket && c.face === LEFT && p.y > 1 && F.pocket(p)) mul(c, 0.72);
  },
});
FM.tailleur = cloth('tailleur anthracite', [0.17, 0.17, 0.20], {
  seed: 62, fn: (c, p, F) => {
    if (front(c, p, F)) return;
    if (c.face === LEFT && p.y > 1 && mod(p.tx, 6) === 0.5 && p.z > 20) mul(c, 1.14);   // la fine rayure
  },
});
FM.jupe = cloth('jupe anthracite', [0.16, 0.16, 0.19], { seed: 63 });
FM.chemise = cloth('chemise blanche', [0.86, 0.85, 0.80], { folds: false });
FM.cuir_noir = mat('cuir noir', c => { rgb(c, 0.075, 0.07, 0.07); if (c.face === TOP) rgb(c, 0.20, 0.19, 0.19); grain(c, 0.05, 64); });
FM.cuir_brun = mat('cuir brun', c => { rgb(c, 0.30, 0.17, 0.09); if (c.face === TOP) mul(c, 1.2); grain(c, 0.06, 65); });
FM.collant = mat('collant', c => { const F = c.W.fig; set3(c, F.tights || [0.30, 0.22, 0.20]); if (c.face === TOP) mul(c, 1.08); else if (c.face === LEFT) mul(c, 1.05); grain(c, 0.03, 66); });

// -- la doudoune, le jean, la parka, la casquette, l'écharpe
FM.doudoune = mat('doudoune', c => {
  const p = loc(c), F = c.W.fig;
  set3(c, [0.13, 0.30, 0.33]);
  // les boudins : une couture tous les 10 cm, le volume entre deux
  const q = mod(p.z - (F.quilt || 0), 2.5);
  if (c.face !== TOP) { if (q < 0.5) mul(c, 0.6); else mul(c, 0.9 + 0.22 * (1 - Math.abs(q - 1.5) / 1.0)); }
  else mul(c, 1.12);
  if (front(c, p, F)) return;
  grain(c, 0.03, 71);
});
FM.jean = cloth('jean', [0.20, 0.27, 0.42], { seed: 72, fn: c => { if (hash(c.a, c.b, 73, 0) < 0.18) mul(c, 1.12); } });
FM.jean_brut = cloth('jean brut', [0.12, 0.15, 0.25], { seed: 74 });
FM.parka = mat('parka rouge', c => {
  const p = loc(c), F = c.W.fig;
  rgb(c, 0.64, 0.15, 0.14);
  if (F.band && p.z >= F.band[0] && p.z < F.band[1]) { set3(c, OR); if (c.face === TOP) mul(c, 1.08); grain(c, 0.03, 75); return; }
  if (c.face === TOP) mul(c, 1.06);
  folds(c, p, 76, 1.1);
  if (front(c, p, F)) return;
  grain(c, 0.03, 77);
});
FM.visiere = mat('visière', c => { rgb(c, 0.13, 0.32, 0.19); if (c.face === TOP) rgb(c, 0.20, 0.44, 0.26); grain(c, 0.04, 108); }, { noShadow: true });
FM.casquette = mat('casquette verte', c => { const p = loc(c); rgb(c, 0.15, 0.36, 0.21); if (c.face === TOP) mul(c, 1.1); if (c.face !== TOP && mod(p.u, 6) === 0.5) mul(c, 0.8); grain(c, 0.04, 78); });
FM.echarpe = mat('écharpe rayée', c => {
  const p = loc(c);
  if (mod(Math.floor(p.z * 0.9), 2) === 0) set3(c, BORD); else set3(c, GRIS);
  if (c.face === TOP) mul(c, 1.06);
  if (mod(p.u, 2) === 0.5) mul(c, 0.92);                          // la maille
  grain(c, 0.04, 79);
});
FM.frange = mat('frange', c => { const p = loc(c); set3(c, mod(p.u, 2) === 0.5 ? BORD : GRIS); mul(c, 0.9); });

// -- le gilet et la jupe de Josiane
FM.gilet = mat('gilet violet', c => {
  const p = loc(c), F = c.W.fig;
  set3(c, [0.36, 0.22, 0.48]);
  if (c.face === TOP) mul(c, 1.08);
  if (mod(p.u, 2) === 0.5) mul(c, 0.9);                            // les côtes du tricot
  if (F.rib && p.z < F.rib && mod(p.u, 2) === 0.5) mul(c, 0.85);
  if (front(c, p, F)) return;
  grain(c, 0.035, 81);
});
FM.jupe_grise = cloth('jupe grise', [0.38, 0.34, 0.31], { seed: 82, fk: 1.2 });

// -- la blouse du médecin
FM.blouse = cloth('blouse blanche', [0.82, 0.83, 0.80], {
  seed: 85, fk: 0.9, fn: (c, p, F) => {
    if (front(c, p, F)) return;
    if (F.pocket && c.face === LEFT && p.y > 1 && F.pocket(p)) mul(c, 0.8);
  },
});
FM.pantalon = cloth('pantalon sombre', [0.20, 0.20, 0.22], { seed: 86 });

// -- les accessoires
FM.filet = mat('filet de maillots', c => {
  const p = loc(c);
  // dans le filet, les maillots en tas : des plaques bordeaux, grises, quelques revers blancs
  const h = hash(Math.floor(c.hx * 0.8), Math.floor(c.hy * 0.8), Math.floor(c.hz * 0.7), 110);
  set3(c, h < 0.5 ? BORD : h < 0.82 ? GRIS : [0.82, 0.81, 0.76]);
  if (hash(c.ix, c.iy, c.iz, 111) < 0.3) mul(c, 0.82);
  // la maille en losanges, de la cordelette blanche
  const a = c.face === TOP ? Math.floor(2 * c.hx) + Math.floor(2 * c.hy) : p.u + p.tz, b = c.face === TOP ? Math.floor(2 * c.hx) - Math.floor(2 * c.hy) : p.u - p.tz;
  if (mod(a, 4) === 0 || mod(b, 4) === 0) rgb(c, 0.86, 0.85, 0.80);
  if (c.face === TOP) mul(c, 1.06);
});
FM.maillot_sac = mat('maillots en vrac', c => { const h = hash(c.ix, c.iy, c.iz, 93); set3(c, h < 0.55 ? BORD : h < 0.85 ? GRIS : [0.86, 0.85, 0.80]); if (c.face === TOP) mul(c, 1.08); grain(c, 0.06, 94); });
FM.cordon = mat('cordon', c => { rgb(c, 0.10, 0.10, 0.12); grain(c, 0.05, 95); });
FM.chrome = mat('chrome', c => { rgb(c, 0.62, 0.64, 0.66); if (c.face === TOP) rgb(c, 0.92, 0.93, 0.94); else if (c.face === LEFT) rgb(c, 0.74, 0.76, 0.78); grain(c, 0.04, 96); });
const folderMat = (name, col) => mat('dossier ' + name, c => { const p = loc(c); set3(c, col); if (c.face === TOP) mul(c, 1.08); else if (mod(p.tz, 2) === 0.5) mul(c, 0.94); grain(c, 0.04, 98); });
FM.dos_beige = folderMat('beige', [0.82, 0.70, 0.46]);
FM.dos_bleu = folderMat('bleu', [0.28, 0.42, 0.62]);
FM.dos_rose = folderMat('rose', [0.82, 0.50, 0.52]);
FM.dos_vert = folderMat('vert', [0.38, 0.55, 0.36]);
FM.dos_bord = folderMat('bordeaux', [0.50, 0.14, 0.19]);
FM.papier = mat('papier', c => { rgb(c, 0.90, 0.89, 0.84); const p = loc(c); if (c.face !== TOP && mod(p.tz, 2) === 0.5) mul(c, 0.9); });
FM.elastique = mat('élastique', c => { rgb(c, 0.10, 0.10, 0.11); });
FM.etiquette = mat('étiquette', c => { const p = loc(c); rgb(c, 0.90, 0.88, 0.80); if (mod(p.tz, 2) === 0.5 && Math.abs(p.tx - c.W.fig.labelX) < 1.6) rgb(c, 0.25, 0.25, 0.28); });
FM.megaphone = mat('mégaphone', c => { rgb(c, 0.86, 0.84, 0.78); if (c.face === TOP) mul(c, 1.06); grain(c, 0.03, 99); });
FM.megaphone_rouge = mat('pavillon rouge', c => { rgb(c, 0.66, 0.14, 0.12); if (c.face === TOP) mul(c, 1.1); grain(c, 0.03, 100); });
FM.caoutchouc = mat('caoutchouc noir', c => { rgb(c, 0.09, 0.09, 0.10); if (c.face === TOP) rgb(c, 0.20, 0.20, 0.22); grain(c, 0.06, 101); });
FM.verre = mat('verre', c => { rgb(c, 0.20, 0.30, 0.36); c.er = 0.04; c.eg = 0.07; c.eb = 0.09; if (c.face === TOP) rgb(c, 0.55, 0.65, 0.7); });
FM.carnet = mat('carnet', c => { rgb(c, 0.10, 0.10, 0.12); if (c.face === TOP) rgb(c, 0.88, 0.87, 0.82); grain(c, 0.04, 102); });
FM.page = mat('page', c => { const p = loc(c); rgb(c, 0.90, 0.89, 0.84); if (mod(p.tz, 2) === 0.5 && c.face !== TOP) rgb(c, 0.55, 0.62, 0.72); });
FM.stylo = mat('stylo', c => { rgb(c, 0.15, 0.25, 0.55); if (c.face === TOP) mul(c, 1.2); });
FM.plot = mat('plot orange', c => {
  const p = loc(c), F = c.W.fig;
  rgb(c, 0.92, 0.42, 0.10);
  if (F.cone && mod(F.cone(p), 1.6) < 0.5) mul(c, 0.62);           // le bord de chaque plot emboîté
  if (c.face === TOP) mul(c, 1.08);
  grain(c, 0.04, 103);
});
FM.plot_bord = mat('bord de plot', c => { rgb(c, 0.98, 0.62, 0.26); if (c.face === TOP) mul(c, 1.08); grain(c, 0.04, 109); });
FM.crampon_dessous = mat('crampon', c => { rgb(c, 0.55, 0.56, 0.56); if (c.face === TOP) rgb(c, 0.8, 0.8, 0.8); });
FM.telephone = mat('téléphone', c => { const p = loc(c); rgb(c, 0.10, 0.10, 0.11); if (c.face === TOP) rgb(c, 0.22, 0.22, 0.24); if (c.face === LEFT && mod(p.tx, 2) === 0.5 && mod(p.tz, 2) === 0.5) rgb(c, 0.42, 0.44, 0.40); grain(c, 0.04, 104); });
FM.antenne = mat('antenne', c => { rgb(c, 0.06, 0.06, 0.07); });
FM.ecran = mat('écran du téléphone', c => { rgb(c, 0.40, 0.52, 0.30); if (c.face !== TOP) { c.er = 0.10; c.eg = 0.16; c.eb = 0.06; } }, { noAOrecv: true });
FM.tube = mat('tube de stéthoscope', c => { rgb(c, 0.09, 0.09, 0.10); if (c.face === TOP) rgb(c, 0.22, 0.22, 0.24); });
FM.sacoche = mat('sacoche', c => { const p = loc(c), F = c.W.fig; rgb(c, 0.34, 0.18, 0.09); if (c.face === TOP) mul(c, 1.18); if (F.bagSeam && F.bagSeam(p, c)) mul(c, 0.6); grain(c, 0.07, 105); });
FM.laiton = mat('laiton', c => { rgb(c, 0.80, 0.62, 0.24); if (c.face === TOP) mul(c, 1.2); c.er = 0.05; c.eg = 0.04; });
FM.brassard = mat('brassard', c => {
  const p = loc(c);
  set3(c, JAUNE);
  if (c.face === TOP) mul(c, 1.08);
  if (c.face !== TOP && mod(p.tz, 2) === 0.5) mul(c, 0.9);       // le tissage du brassard
  grain(c, 0.03, 106);
});
FM.crampon_blanc = mat('crampons neufs', c => { const p = loc(c), F = c.W.fig; rgb(c, 0.88, 0.87, 0.82); if (F.bootStripe && F.bootStripe(p, c)) set3(c, BORD); if (c.face === TOP) mul(c, 1.05); grain(c, 0.03, 107); });
FM.lacet = mat('lacet', c => { rgb(c, 0.86, 0.85, 0.80); });

// ---------------------------------------------------------------- les socles
// Le dessus dans la matière du lieu, la tranche en coupe, le bas assombri.
const SOCLE = {};
const sideDark = (c, k = 0.55) => { const t = clamp(c.hz / T, 0, 1); mul(c, k + (1 - k) * t); };
function soilCut(c, tz) {
  const col = Math.floor(c.face === LEFT ? c.hx * 2 : c.hy * 2);
  const band = Math.floor((tz + fbm(col / 7, 0, 541) * 3) / 3);
  const pal = [[0.32, 0.22, 0.15], [0.38, 0.27, 0.18], [0.29, 0.20, 0.14], [0.36, 0.29, 0.21]];
  set3(c, pal[mod(band, 4)]);
  if (hash(Math.floor(col / 2), Math.floor(tz / 2), 542, 0) < 0.08) rgb(c, 0.47, 0.45, 0.41);
  grain(c, 0.06, 17);
}
function slabCut(c, tz, topCol, topH) {
  if (tz < topH) { set3(c, topCol); mul(c, 0.85); grain(c, 0.04, 18); return; }
  if (tz < topH + 1) { rgb(c, 0.42, 0.41, 0.39); return; }
  const n = fbm(c.hx * 0.7 + c.hy * 0.7, c.hz * 0.9, 551);
  const k = 0.44 + 0.08 * n;
  rgb(c, k, k * 0.98, k * 0.95);
  const h = hash(c.a, c.b, 552, c.face);
  if (h < 0.1) mul(c, 0.8); else if (h > 0.93) mul(c, 1.18);
}
SOCLE.pelouse = mat('socle pelouse', c => {
  if (c.face === TOP) {
    const lx = c.hx - MG, ly = c.hy - MG;
    const band = (lx - ly * 0.02) < 12.5 ? 1.0 : 0.87;                // la tonte
    const F = c.W.fig;
    const k = band * (0.9 + 0.2 * fbm(c.hx / 3, c.hy / 3, 501));
    rgb(c, 0.20 * k, 0.36 * k, 0.155 * k);
    const h = hash(c.a, c.b, 502, 0);
    if (h < 0.12) mul(c, 0.76); else if (h > 0.88) { c.cr *= 1.3; c.cg *= 1.2; c.cb *= 1.05; }
    if (F.chalk && F.chalk(lx, ly)) { rgb(c, 0.80, 0.80, 0.74); if (h < 0.16) rgb(c, 0.42, 0.52, 0.36); }
    return;
  }
  const tz = Math.floor((T - c.hz) * 2);
  const col = Math.floor(c.face === LEFT ? c.hx * 2 : c.hy * 2);
  const drip = 2 + Math.floor(hash(col, 0, 503, 0) * 2.6);
  if (tz < drip) { rgb(c, 0.19, 0.34, 0.15); if (hash(col, tz, 504, 0) < 0.3) rgb(c, 0.27, 0.42, 0.19); if (tz === drip - 1) mul(c, 0.8); return; }
  soilCut(c, tz); sideDark(c);
});
SOCLE.pave = mat('socle pavé', c => {
  if (c.face === TOP) {
    const row = Math.floor(c.b / 5), off = (row & 1) * 3;
    const la = mod(c.a + off, 6), lb = mod(c.b, 5);
    const st = hash(Math.floor((c.a + off) / 6), row, 511, 0);
    let k = 0.33 + st * 0.13;
    if (la === 5 || lb === 4) { rgb(c, 0.13, 0.13, 0.12); if (hash(c.a, c.b, 512, 0) < 0.25) rgb(c, 0.18, 0.24, 0.12); return; }
    if (la === 0 || lb === 0) k *= 1.12; else if (la === 4 || lb === 3) k *= 0.9;
    const warm = hash(Math.floor((c.a + off) / 6), row, 513, 0);
    rgb(c, k * (0.98 + 0.08 * warm), k * 0.97, k * (1.04 - 0.08 * warm));
    grain(c, 0.04, 19);
    const p = fbm(c.hx / 5 + 1.3, c.hy / 5, 514, 3);
    if (p > 0.62) c.wet = clamp((p - 0.62) * 9, 0, 0.8);
    return;
  }
  const tz = Math.floor((T - c.hz) * 2);
  const col = Math.floor(c.face === LEFT ? c.hx * 2 : c.hy * 2);
  if (tz < 4) {
    const la = mod(col + (tz < 2 ? 0 : 3), 6);
    const st = hash(Math.floor(col / 6), tz < 2 ? 0 : 1, 515, 0);
    const k = 0.30 + 0.1 * st;
    rgb(c, k, k * 0.98, k);
    if (la === 5 || tz === 3) rgb(c, 0.14, 0.13, 0.12);
    return;
  }
  if (tz < 6) { rgb(c, 0.52, 0.44, 0.30); grain(c, 0.08, 20); return; }
  soilCut(c, tz); sideDark(c);
});
SOCLE.carrelage = mat('socle carrelage', c => {
  if (c.face === TOP) {
    const a = mod(c.a - 2 * MG, 10), b = mod(c.b - 2 * MG, 10);
    if (a === 0 || b === 0) { rgb(c, 0.36, 0.36, 0.34); return; }
    const chk = (Math.floor((c.a - 2 * MG) / 10) + Math.floor((c.b - 2 * MG) / 10)) & 1;
    if (chk) rgb(c, 0.70, 0.69, 0.64); else rgb(c, 0.50, 0.53, 0.50);
    if (a === 1 || b === 1) mul(c, 1.05);
    grain(c, 0.03, 21);
    const p = fbm(c.hx / 6 + 2, c.hy / 6, 522, 3);
    if (p > 0.6) c.wet = clamp((p - 0.6) * 8, 0, 0.85);
    return;
  }
  const tz = Math.floor((T - c.hz) * 2);
  slabCut(c, tz, [0.74, 0.73, 0.68], 1); sideDark(c);
});
SOCLE.parquet = mat('socle parquet', c => {
  if (c.face === TOP) {
    const row = Math.floor(c.b / 4), lb = mod(c.b, 4);
    const off = Math.floor(hash(row, 0, 531, 0) * 40);
    const seg = Math.floor((c.a + off) / 34), la = mod(c.a + off, 34);
    const h = hash(seg, row, 532, 0);
    set3(c, [0.55 + 0.1 * h, 0.36 + 0.06 * h, 0.20 + 0.03 * h]);
    const g = vnoise(c.a * 0.18 + seg * 9, c.b * 1.1, 533);
    if (g > 0.66) mul(c, 0.86); else if (g < 0.25) mul(c, 1.07);
    if (lb === 3 || la === 0) mul(c, 0.55);
    grain(c, 0.04, 22);
    return;
  }
  const tz = Math.floor((T - c.hz) * 2);
  if (tz < 2) { rgb(c, 0.46, 0.30, 0.17); if (mod(Math.floor(c.face === LEFT ? c.hx * 2 : c.hy * 2), 9) === 0) mul(c, 0.6); return; }
  if (tz < 5) { rgb(c, 0.27, 0.18, 0.11); grain(c, 0.08, 23); sideDark(c); return; }
  slabCut(c, tz, [0.5, 0.5, 0.5], 0); sideDark(c);
});
SOCLE.moquette = mat('socle moquette', c => {
  if (c.face === TOP) {
    const a = mod(c.a - 2 * MG, 12) - 5.5, b = mod(c.b - 2 * MG, 12) - 5.5;
    const d = Math.abs(a) + Math.abs(b);
    rgb(c, 0.37, 0.11, 0.115);
    if (d >= 9.5 && d <= 10.5) rgb(c, 0.50, 0.33, 0.15);
    else if (d <= 1) rgb(c, 0.47, 0.30, 0.14);
    else if (d >= 4 && d <= 5) mul(c, 0.82);
    grain(c, 0.1, 24);
    return;
  }
  const tz = Math.floor((T - c.hz) * 2);
  slabCut(c, tz, [0.36, 0.10, 0.11], 2); sideDark(c);
});

// ---------------------------------------------------------------- les visages
// Le visage est peint au texel (2 cm) sur la face avant de la tête (+y, la face gauche
// de l'image). (c, tx, tz) : tx compté depuis l'axe du visage, tz depuis la ligne des yeux,
// en texels centrés (±0.5, ±1.5…). Le profil (face droite) reçoit (c, ty, tz).
overlay('figface', (o, c) => {
  const F = c.W.fig;
  if (c.face === LEFT) {
    const tx = Math.floor(2 * (c.hx - F.ox)) + 0.5 - 2 * o.cx;
    const tz = Math.floor(2 * (c.hz - F.oz)) + 0.5 - 2 * o.eyeZ;
    o.front(c, tx, tz);
  } else if (c.face === RIGHT && o.side) {
    const ty = Math.floor(2 * (c.hy - F.oy)) + 0.5 - 2 * o.cy;
    const tz = Math.floor(2 * (c.hz - F.oz)) + 0.5 - 2 * o.eyeZ;
    o.side(c, ty, tz);
  }
});
const EYE = [0.06, 0.045, 0.045];
function stdFace(o = {}) {
  const brow = o.brow || [0.13, 0.09, 0.06];
  const lip = o.lip || [0.48, 0.18, 0.15];
  const eyeX = o.eyeX || 3.5;          // demi-écart des yeux (texels, bord extérieur de l'œil)
  const mw = o.mouthW != null ? o.mouthW : 1.5;
  const mz = o.mouthZ || -4.5;
  return (c, tx, tz) => {
    const ax = Math.abs(tx);
    if (tz <= -6.5) mul(c, 0.93);
    if (ax >= 6) mul(c, 0.95);
    if (o.blush && tz >= -3.5 && tz <= -1.5 && ax >= 3.5 && ax <= 5.5) tint(c, [0.82, 0.38, 0.32], o.blush);
    if (o.stubble && (tz <= -4.5 || (tz <= -1.5 && ax >= 4.5) || (tz === -3.5 && ax >= 1.5)) && hash(Math.floor(tx), Math.floor(tz), 701, 0) < 0.6) tint(c, o.stubble, 0.45);
    if (o.beard && (tz <= mz + 0.5 || (tz <= -1.5 && ax >= 4.5) || (tz <= mz + 1.5 && ax >= mw + 0.5))) {
      set3(c, o.beard); if (hash(Math.floor(tx), Math.floor(tz), 702, 0) < 0.35) mul(c, 0.84);
      if (tz === mz && ax <= mw - 0.5) set3(c, lip);
      return;
    }
    if (o.wrinkles && ((ax === 2.5 && (tz === -3.5 || tz === -4.5)) || (ax === 5.5 && tz === 0.5))) mul(c, 0.86);
    if (o.bags && ax >= 2.5 && ax <= 4.5 && tz === -1.5) mul(c, 0.9);
    // la bouche
    if (tz === mz && ax <= mw) set3(c, lip);
    if (o.smile && tz === mz + 1 && ax === mw + 1) set3(c, lip);
    if (o.frown && tz === mz - 1 && ax === mw + 1) set3(c, lip);
    if (o.open && tz === mz - 1 && ax <= mw - 1) set3(c, [0.24, 0.07, 0.07]);
    // la moustache
    if (o.mustache && ((tz === mz + 1 && ax <= mw + 1) || (tz === mz && ax === mw + 1) || (o.mustacheH > 1 && tz === mz + 2 && ax <= mw + 0.5 && ax >= 1.5))) set3(c, o.mustache);
    // les yeux : deux texels de large, le reflet de la petite lampe en haut, côté nez
    if ((tz === -0.5 || tz === 0.5 || (o.bigEyes && tz === -1.5)) && (ax === eyeX || ax === eyeX - 1)) {
      set3(c, EYE);
      if (tz === 0.5 && ax === eyeX - 1 && !o.squint) { rgb(c, 0.80, 0.80, 0.78); c.er = 0.10; c.eg = 0.10; c.eb = 0.10; }
      if (o.squint && tz === 0.5) tint(c, o.skinCol || [0.8, 0.6, 0.5], 0.6);
    }
    if (o.lash && tz === 1.5 && ax === eyeX + 1) set3(c, EYE);
    // les sourcils
    const bz = 2.5 + (o.browUp || 0);
    if (ax >= eyeX - 1.5 && ax <= eyeX + 0.5) {
      const lift = o.browTilt ? (ax <= eyeX - 1 ? o.browTilt : 0) : 0;
      if (tz === bz + lift) set3(c, brow);
      if (o.browThick && tz === bz + lift + 1 && ax <= eyeX) set3(c, brow);
    }
    if (o.glasses) o.glasses(c, tx, tz, ax);
  };
}
function stdSide(o = {}) {
  return (c, ty, tz) => {
    if (o.glasses && (tz === 0.5 || tz === 1.5) && ty > -3) set3(c, o.glasses);
    if (o.stubble && tz <= -1.5 && ty > -2 && hash(Math.floor(ty), Math.floor(tz), 703, 0) < 0.55) tint(c, o.stubble, 0.45);
    if (o.beard && tz <= -0.5 && ty > -3.5) { set3(c, o.beard); if (hash(Math.floor(ty), Math.floor(tz), 704, 0) < 0.35) mul(c, 0.84); }
  };
}
// les lunettes, peintes autour des yeux (l'œil est en ax = eyeX, tz = ±0.5)
const roundGlasses = (col, eyeX = 3.5) => (c, tx, tz, ax) => {
  const dx = ax - eyeX, adx = Math.abs(dx), adz = Math.abs(tz);
  if ((adx === 2 && adz <= 1) || (adz === 1.5 && adx <= 1)) set3(c, col);
  else if (ax <= eyeX - 3 && tz === 0.5) set3(c, col);
  else if (dx === -1 && tz === 0.5) tint(c, [0.95, 0.95, 1.0], 0.45);
};
const squareGlasses = (col, eyeX = 3.5) => (c, tx, tz, ax) => {
  const dx = ax - eyeX, adx = Math.abs(dx), adz = Math.abs(tz);
  if ((adx <= 2 && adz === 1.5) || (adx === 2 && adz <= 1.5)) set3(c, col);
  else if (ax <= eyeX - 2 && tz === 0.5) set3(c, col);
  else if (dx === -1 && tz === 0.5) tint(c, [0.95, 0.95, 1.0], 0.45);
};

// ---------------------------------------------------------------- sculpture
// Un repère local par figurine ; chaque primitive remplit les voxels dont le centre tombe dedans.
const pick = (m, x, y, z, cur, t) => typeof m === 'function' ? m(x, y, z, cur, t) : m;
class Fig {
  constructor(W, ox, oy, oz) { this.W = W; this.ox = ox; this.oy = oy; this.oz = oz; }
  fill(x0, y0, z0, x1, y1, z1, f, o = {}) {
    const W = this.W, X = W.X, Y = W.Y, Z = W.Z;
    const ax = Math.max(0, Math.floor(this.ox + x0 - 1)), bx = Math.min(X - 1, Math.ceil(this.ox + x1));
    const ay = Math.max(0, Math.floor(this.oy + y0 - 1)), by = Math.min(Y - 1, Math.ceil(this.oy + y1));
    const az = Math.max(0, Math.floor(this.oz + z0 - 1)), bz = Math.min(Z - 1, Math.ceil(this.oz + z1));
    for (let iz = az; iz <= bz; iz++) for (let iy = ay; iy <= by; iy++) for (let ix = ax; ix <= bx; ix++) {
      const lx = ix + 0.5 - this.ox, ly = iy + 0.5 - this.oy, lz = iz + 0.5 - this.oz;
      if (lz < 0 && !o.below) continue;
      const k = (iz * Y + iy) * X + ix, cur = W.mat[k];
      if (o.mode === 'under' && cur) continue;
      if (o.mode === 'paint' && !cur) continue;
      if (o.only && o.only.indexOf(cur) < 0) continue;
      if (o.not && o.not.indexOf(cur) >= 0) continue;
      const m = f(lx, ly, lz, cur);
      if (m == null || m === false) continue;
      if (m < 0) { W.mat[k] = 0; W.tag[k] = 0; continue; }
      W.mat[k] = m; W.tag[k] = o.keepTag ? W.tag[k] : (o.tag || 0);
    }
  }
  get(lx, ly, lz) { return this.W.get(Math.floor(this.ox + lx), Math.floor(this.oy + ly), Math.floor(this.oz + lz)); }
  put(lx, ly, lz, m, tag = 0) { this.W.set(Math.floor(this.ox + lx), Math.floor(this.oy + ly), Math.floor(this.oz + lz), m, tag); }
  ell(c, r, m, o = {}) {
    const n = o.n || 2;
    this.fill(c[0] - r[0], c[1] - r[1], c[2] - r[2], c[0] + r[0], c[1] + r[1], c[2] + r[2], (x, y, z, cur) => {
      const v = Math.pow(Math.abs(x - c[0]) / r[0], n) + Math.pow(Math.abs(y - c[1]) / r[1], n) + Math.pow(Math.abs(z - c[2]) / r[2], n);
      return v <= 1 ? pick(m, x, y, z, cur) : null;
    }, o);
  }
  // capsule effilée de a à b ; o.t0/o.t1 coupent net le segment
  cap(a, b, ra, rb, m, o = {}) {
    const r = Math.max(ra, rb), dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2], L2 = dx * dx + dy * dy + dz * dz || 1e-9;
    const t0 = o.t0 != null ? o.t0 : -1, t1 = o.t1 != null ? o.t1 : 2;
    this.fill(Math.min(a[0], b[0]) - r, Math.min(a[1], b[1]) - r, Math.min(a[2], b[2]) - r, Math.max(a[0], b[0]) + r, Math.max(a[1], b[1]) + r, Math.max(a[2], b[2]) + r, (x, y, z, cur) => {
      const tr = ((x - a[0]) * dx + (y - a[1]) * dy + (z - a[2]) * dz) / L2;
      if (tr < t0 || tr > t1) return null;
      const t = clamp(tr, 0, 1);
      const px = a[0] + dx * t - x, py = a[1] + dy * t - y, pz = a[2] + dz * t - z, rr = ra + (rb - ra) * t;
      return px * px + py * py + pz * pz <= rr * rr ? pick(m, x, y, z, cur, tr) : null;
    }, o);
  }
  cyl(a, b, ra, rb, m, o = {}) { this.cap(a, b, ra, rb, m, Object.assign({ t0: 0, t1: 1 }, o)); }
  // Boîte arrondie orientée, de a à b (grand axe), demi-largeur hw (axe « side »), demi-épaisseur hd.
  // m peut dépendre de s ∈ [0,1], la position le long de l'axe. o.r : rayon des arêtes ; o.taper : rétrécit vers b.
  seg(a, b, hw, hd, m, o = {}) {
    const ax = sub(b, a), L = Math.hypot(ax[0], ax[1], ax[2]) || 1e-6, e1 = scl(ax, 1 / L);
    let side = o.side || [1, 0, 0];
    let e2 = sub(side, scl(e1, dot(side, e1)));
    if (Math.hypot(e2[0], e2[1], e2[2]) < 1e-3) { side = [0, 1, 0]; e2 = sub(side, scl(e1, dot(side, e1))); }
    e2 = unit(e2); const e3 = cross(e1, e2);
    const r = o.r != null ? o.r : 0.6, ext = o.ext || 0, tp = o.taper || 0;
    const R = Math.max(hw, hd) + 1.5;
    this.fill(Math.min(a[0], b[0]) - R - ext, Math.min(a[1], b[1]) - R - ext, Math.min(a[2], b[2]) - R - ext,
      Math.max(a[0], b[0]) + R + ext, Math.max(a[1], b[1]) + R + ext, Math.max(a[2], b[2]) + R + ext, (x, y, z, cur) => {
        const p = [x - a[0], y - a[1], z - a[2]];
        const s = dot(p, e1), q2 = dot(p, e2), q3 = dot(p, e3);
        const sn = clamp(s / L, 0, 1), k = 1 - tp * sn;
        const qa = Math.abs(s - L / 2) - (L / 2 + ext - r), qb = Math.abs(q2) - (hw * k - r), qc = Math.abs(q3) - (hd * k - r);
        const d = Math.hypot(Math.max(qa, 0), Math.max(qb, 0), Math.max(qc, 0)) + Math.min(Math.max(qa, qb, qc), 0) - r;
        return d <= 0 ? pick(m, x, y, z, cur, s / L) : null;
      }, o);
  }
  rbox(c, h, m, o = {}) { this.seg([c[0], c[1], c[2] - h[2]], [c[0], c[1], c[2] + h[2]], h[0], h[1], m, o); }
  // un volume par tranches horizontales : prof(z) → { rx, ry, cx, cy, rc } (rectangle arrondi)
  loft(z0, z1, prof, m, o = {}) {
    for (let lz = Math.floor(z0) + 0.5; lz < z1; lz += 1) {
      const p = prof(lz); if (!p) continue;
      const cx = p.cx || 0, cy = p.cy || 0, rc = Math.min(p.rc != null ? p.rc : 1.2, p.rx, p.ry);
      this.fill(cx - p.rx, cy - p.ry, lz, cx + p.rx, cy + p.ry, lz, (x, y, z, cur) => {
        if (Math.abs(z - lz) > 0.01) return null;
        const ax = Math.abs(x - cx) - (p.rx - rc), ay = Math.abs(y - cy) - (p.ry - rc);
        const inside = Math.hypot(Math.max(ax, 0), Math.max(ay, 0)) + Math.min(Math.max(ax, ay), 0) - rc <= 0;
        return inside ? pick(m, x, y, z, cur, p) : null;
      }, o);
    }
  }
}
// interpolation de profils : [[z, {..}], …]
function keys(list) {
  return z => {
    if (z < list[0][0] || z > list[list.length - 1][0]) return null;
    for (let i = 0; i < list.length - 1; i++) {
      const [za, A] = list[i], [zb, B] = list[i + 1];
      if (z >= za && z <= zb) {
        const t = zb > za ? (z - za) / (zb - za) : 0, r = {};
        for (const k in A) r[k] = A[k] + ((B[k] != null ? B[k] : A[k]) - A[k]) * t;
        return r;
      }
    }
    return null;
  };
}

// ---------------------------------------------------------------- le corps
// Repère : x vers la droite de l'image, y vers l'avant du personnage, z vers le haut.
// « F » : le côté lointain (−x, à gauche de l'image) ; « N » : le côté proche (+x).
// Le personnage regarde vers +y : on voit sa face avant éclairée et son flanc proche.

// Le squelette par défaut (adulte, 45 voxels, tête de 10).
function skeleton(o = {}) {
  const h = o.h || 1, z = v => v * h;
  const hb = Math.round(z(34.6));
  return Object.assign({
    h, hb, eyeZ: hb + 4,
    hipF: [-2.15, 0, z(18.6)], hipN: [2.15, 0, z(18.6)],
    kneeF: [-2.2, 0.25, z(10.4)], kneeN: [2.2, 0.25, z(10.4)],
    ankF: [-2.3, -0.1, z(2.9)], ankN: [2.3, -0.1, z(2.9)],
    footF: [-2.35, -0.2], footN: [2.35, -0.2], rotF: -0.1, rotN: 0.1,
    waist: z(23), chest: z(28), shoulder: z(31.8),
    shF: [-5.6, 0, z(30.8)], shN: [5.6, 0, z(30.8)],
    elF: [-6.1, -0.3, z(24.6)], elN: [6.1, -0.3, z(24.6)],
    wrF: [-6.3, 0.3, z(19.2)], wrN: [6.3, 0.3, z(19.2)],
  }, o);
}
// Le tronc : w élargit, d épaissit, belly pousse le ventre, chest bombe le torse, fem dessine la taille.
function torsoKeys(sk, o = {}) {
  const w = o.w || 1, d = o.d || 1, b = o.belly || 0, ch = o.chest || 0, z0 = o.z0 != null ? o.z0 : 18.0 * sk.h;
  const fem = o.fem || 0;
  return [
    [z0, { rx: (4.15 + fem * 0.2) * w + b * 0.3, ry: 2.65 * d + b * 0.3, cy: -0.1 + b * 0.3, rc: 1.3 }],
    [sk.waist - 1, { rx: (3.95 - fem * 0.45) * w + b * 0.8, ry: (2.6 - fem * 0.15) * d + b, cy: 0.05 + b * 0.8, rc: 1.3 + b * 0.3 }],
    [sk.chest - 1, { rx: (4.5 - fem * 0.35) * w + b * 0.4, ry: 2.95 * d + b * 0.5 + ch * 0.35, cy: 0.25 + b * 0.4 + ch * 0.25, rc: 1.4 }],
    [sk.shoulder - 1.2, { rx: (4.75 - fem * 0.45) * w, ry: 2.85 * d + ch * 0.25, cy: 0.15 + ch * 0.15, rc: 1.4 }],
    [sk.shoulder, { rx: (4.5 - fem * 0.5) * w, ry: 2.45 * d, cy: 0.1, rc: 1.3 }],
    [sk.shoulder + 1.2, { rx: 2.7 - fem * 0.3, ry: 2.0, cy: 0.1, rc: 1.0 }],
  ];
}
function torso(F, list, m, o = {}) { F.loft(list[0][0], list[list.length - 1][0], keys(list), m, o); }
// La jambe : cuisse puis tibia ; m(z) donne la matière selon la hauteur.
function leg(F, hip, knee, ank, m, o = {}) {
  const tw = o.tw || 1.8, td = o.td || 1.9, sw = o.sw || 1.55, sd = o.sd || 1.6;
  F.seg(hip, knee, tw, td, (x, y, z) => m(z), { r: 0.7, ext: 0.4, taper: o.tt != null ? o.tt : 0.08 });
  F.seg(knee, ank, sw, sd, (x, y, z) => m(z), { r: 0.6, ext: 0.3, taper: o.st != null ? o.st : 0.12 });
}
// La chaussure : talon en arrière, pointe vers l'avant (+y), tournée de rot autour de z.
function shoe(F, at, rot, upper, sole, o = {}) {
  const len = o.len || 6.6, wd = o.wd || 1.75, hh = o.hh || 2.9, heel = o.heel || 1.9, z0 = o.z0 || 0;
  const cs = Math.cos(rot), sn = Math.sin(rot);
  F.fill(at[0] - 7, at[1] - 7, z0, at[0] + 7, at[1] + 8, z0 + hh + 1, (x, y, zz) => {
    const z = zz - z0; if (z < 0) return null;
    const dx = x - at[0], dy = y - at[1];
    const xf = dx * cs - dy * sn, yf = dx * sn + dy * cs;
    if (yf < -heel || yf > len - heel) return null;
    let half = wd;
    if (yf > len - heel - 1.6) half -= (yf - (len - heel - 1.6)) * 0.5;
    if (yf < -heel + 0.8) half -= 0.35;
    if (Math.abs(xf) > half) return null;
    const top = yf > 0.9 ? hh - (yf - 0.9) * (o.slope || 0.36) : hh;
    if (z > top) return null;
    if (o.pump && z > 1 && yf < 0.4 && yf > -heel + 0.9) return null;      // l'escarpin : le talon dégagé
    return z < 0.75 ? sole : pick(upper, xf, yf, z);
  });
}
// La main : un bloc arrondi au bout du poignet, dans la direction dir.
function hand(F, wr, dir, skin, o = {}) {
  const d = unit(dir), L = o.len || 2.3;
  const tip = add(wr, scl(d, L));
  F.seg(add(wr, scl(d, -0.2)), tip, o.hw || 1.2, o.hd || 1.0, skin, { r: 0.55, side: o.side || [1, 0, 0], mode: o.mode });
  if (o.thumb) F.seg(add(wr, scl(d, 0.4)), add(wr, o.thumb), 0.55, 0.55, skin, { r: 0.4 });
  return tip;
}
// Le bras : épaule → coude → poignet ; la manche couvre jusqu'à « end » (0..2, 1 = le coude).
function arm(F, sh, el, wr, o) {
  const uw = o.uw || 1.45, fw = o.fw || 1.3, sl = o.sleeve, skin = o.skin, end = o.end != null ? o.end : 2, lo = o.loose != null ? o.loose : 0.3;
  F.seg(sh, el, uw, uw, skin, { r: 0.6, ext: 0.5 });
  F.seg(el, wr, fw, fw, skin, { r: 0.6, ext: 0.4, taper: 0.1 });
  if (end > 0 && sl) {
    F.seg(sh, el, uw + lo, uw + lo, (x, y, z, cur, s) => (s <= end ? (o.cuff && s > end - 0.18 && end < 1 ? o.cuff : sl) : null), { r: 0.7, ext: 0.6 });
    if (end > 1) F.seg(el, wr, fw + lo * 0.8, fw + lo * 0.8, (x, y, z, cur, s) => (s <= end - 1 ? (o.cuff && s > end - 1.16 ? o.cuff : sl) : null), { r: 0.6, ext: 0.4, taper: 0.06 });
  }
}
// La tête : un cube arrondi (9 de large, 7 de profondeur, 10 de haut), le visage peint
// sur la face avant, le nez et les oreilles en relief.
const HEAD = { rx: 3.6, ry: 3.1, rc: 1.4, rcTop: 2.0, top: 2.2, cy: 0.6 };
function head(F, sk, skin, faceObj, o = {}) {
  const hb = sk.hb, w = o.w || 1, d = o.d || 1, hy = o.hy || 0, Hh = o.hh || 10, G = HEAD;
  const prof = keys([
    [hb + 0.0, { rx: (o.chin || 2.5) * w, ry: (G.ry - 1.05) * d, cy: G.cy + 0.5 + hy, rc: 1.3 }],
    [hb + 1.0, { rx: (o.jaw || 3.5) * w, ry: (G.ry - 0.45) * d, cy: G.cy + 0.25 + hy, rc: Math.min(1.6, G.rc) }],
    [hb + 2.4, { rx: G.rx * w, ry: G.ry * d, cy: G.cy + hy, rc: G.rc }],
    [hb + Hh - 2.4, { rx: G.rx * w, ry: G.ry * d, cy: G.cy - 0.1 + hy, rc: G.rc }],
    [hb + Hh - 1.0, { rx: (G.rx - 0.5) * w, ry: (G.ry - 0.45) * d, cy: G.cy - 0.2 + hy, rc: G.rcTop }],
    [hb + Hh, { rx: G.top * w, ry: (G.top - 0.3) * d, cy: G.cy - 0.25 + hy, rc: Math.min(1.8, G.rcTop) }],
  ]);
  const pe = prof(sk.eyeZ + 0.5);
  const fy = Math.floor(pe.cy + pe.ry + 1e-6) + 0.5;               // le plan du visage
  const id = F.W.obj(Object.assign({ type: 'figface', cx: 0, cy: fy, eyeZ: sk.eyeZ }, faceObj));
  F.loft(hb, hb + Hh, prof, skin, { tag: id });
  if (o.nose !== false) F.put(0, fy + 0.5, sk.eyeZ - 1.5, skin, id);
  const ex = Math.floor(pe.rx) + 1;
  if (o.ears !== false) for (const s of [-1, 1]) for (let z = sk.eyeZ - 1; z <= sk.eyeZ; z++) F.put(s * ex, Math.round(hy) - 0.5, z + 0.5, skin);
  return { prof, id, fy, hb, Hh, eyeZ: sk.eyeZ, w, d, hy, ex, skin, cy: G.cy + hy };
}
// Les cheveux : on peint le crâne au-dessus de la ligne, puis on gonfle d'un voxel là où
// la coiffure a du volume (dessus, derrière, sur les côtés). line(y, x) : la hauteur
// (depuis le menton) où commencent les cheveux ; vol(x, y, zh, sens) : où gonfler.
function hair(F, H, m, line, o = {}) {
  const hb = H.hb, top = hb + H.Hh, front = H.fy, maxZ = o.maxZ != null ? o.maxZ : 99;
  const vol = o.vol || ((x, y, zh, dir) => dir === 'up' || (dir === 'back' && zh > 2));
  const inHead = (x, y) => Math.abs(x) <= H.ex + 0.5 && Math.abs(y - H.cy) <= 5.5;
  F.fill(-7, -7, hb, 7, 7, top, (x, y, z) => { const zh = z - hb; return inHead(x, y) && zh >= line(y, x) && zh < maxZ ? m : null; }, { mode: 'paint', only: [H.skin], keepTag: true });
  const isH = (x, y, z) => F.get(x, y, z) === m;
  const grow = [];
  for (let pass = 0; pass < (o.passes || 1); pass++) {
    grow.length = 0;
    F.fill(-8, -8, hb - 2, 8, 8, top + 2, (x, y, z) => {
      const zh = z - hb;
      if (!inHead(x, y) && !o.free) return null;
      if (y > front - 0.5 && zh < (o.fringe != null ? o.fringe : H.Hh)) return null;   // pas de visière
      if (isH(x, y, z - 1) && vol(x, y, zh, 'up')) grow.push([x, y, z]);
      else if (isH(x, y + 1, z) && vol(x, y, zh, 'back')) grow.push([x, y, z]);
      else if ((isH(x - 1, y, z) || isH(x + 1, y, z)) && vol(x, y, zh, 'side')) grow.push([x, y, z]);
      return null;
    }, { mode: 'under' });
    for (const [x, y, z] of grow) F.put(x, y, z, m);
  }
}
function neck(F, sk, skin, o = {}) { F.rbox([0, o.y || 0.4, (sk.shoulder + sk.hb) / 2 + 0.3], [o.w || 1.45, 1.45, (sk.hb - sk.shoulder) / 2 + 0.9], skin, { r: 0.5 }); }

// Le mannequin complet ; chaque personnage le règle, puis ajoute ce qui le signe.
//   P.skin, P.sk (squelette), P.legs(z, s) → matière, P.legDims, P.shoes { upper, sole, … },
//   P.torso (matière), P.build (options du tronc), P.face / P.side (visage), P.head (options),
//   P.hair(F, H), P.arms { F: {…}, N: {…} } (manche, fin de manche, main…).
function person(F, W, P) {
  const sk = P.sk, skin = FM['peau_' + P.skin];
  W.fig.joints = [sk.kneeF, sk.kneeN, sk.elF, sk.elN].map(j => [j[0], j[1], j[2], 2.6])
    .concat([[sk.ankF[0], sk.ankF[1], sk.ankF[2] + 1.6, 2.4], [sk.ankN[0], sk.ankN[1], sk.ankN[2] + 1.6, 2.4]]);
  for (const s of ['F', 'N']) leg(F, sk['hip' + s], sk['knee' + s], sk['ank' + s], z => P.legs(z, s), P.legDims || {});
  const Sh = P.shoes;
  shoe(F, sk.footF, sk.rotF, Sh.upper, Sh.sole, Sh);
  shoe(F, sk.footN, sk.rotN, Sh.upper, Sh.sole, Sh);
  if (P.hips) P.hips(F, sk, skin);
  torso(F, P.torsoKeys || torsoKeys(sk, P.build || {}), P.torso);
  neck(F, sk, P.neckMat || skin, P.neck || {});
  const H = head(F, sk, skin, { front: stdFace(P.face || {}), side: stdSide(P.side || {}) }, P.head || {});
  if (P.hair) P.hair(F, H, skin);
  for (const s of ['F', 'N']) {
    const A = Object.assign({ skin }, P.armAll || {}, (P.arms || {})[s] || {});
    if (A.skip) continue;
    arm(F, sk['sh' + s], sk['el' + s], sk['wr' + s], A);
    if (A.hand !== false) hand(F, sk['wr' + s], A.dir || [0, 0.08, -1], A.handMat || skin, Object.assign({ side: A.dirSide || [1, 0, 0] }, A.handOpt || {}));
  }
  return { sk, skin, H };
}
// La bande d'un survêtement : on repeint le voxel le plus extérieur (+x) d'un membre, le long de a → b.
function sideBand(F, a, b, mats, m, o = {}) {
  const W = F.W, n = Math.max(2, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) * 2));
  const done = new Set();
  for (let i = 0; i <= n; i++) {
    const p = lerp3(a, b, i / n), iz = Math.floor(F.oz + p[2]);
    for (const dy of o.dys || [-0.5, 0.5]) {
      const iy = Math.floor(F.oy + p[1] + dy);
      for (let ix = Math.floor(F.ox + p[0] + 5); ix >= Math.floor(F.ox + p[0] - 3); ix--) {
        const k = (iz * W.Y + iy) * W.X + ix, cur = W.mat[k];
        if (!cur) continue;
        if (mats.indexOf(cur) >= 0 && !done.has(k)) { W.mat[k] = m; W.tag[k] = 0; done.add(k); }
        break;
      }
    }
  }
}
// L'écharpe : un tour de cou, deux pans qui tombent sur le devant.
function scarf(F, sk, o = {}) {
  const z0 = sk.shoulder - 0.6, y = o.y || 0.3;
  F.loft(z0, z0 + 2.2, () => ({ rx: o.rx || 2.9, ry: o.ry || 2.7, cy: y, rc: 1.6 }), FM.echarpe, { mode: 'under' });
  for (const s of o.ends || [-1, 1]) {
    const top = [s * (o.ex || 1.5), (o.fy || 3.1), z0 + 1.4], bot = [s * (o.ex || 1.5) + (o.drift || 0) * s, (o.fy || 3.1) + (o.lean || 0.4), z0 + 1.4 - (o.len || 9)];
    F.seg(top, bot, o.hw || 1.05, 0.5, (x, yy, z, cur, t) => (t > 0.94 ? FM.frange : FM.echarpe), { r: 0.3, side: [1, 0, 0] });
  }
}
// Un cordon : une suite de capsules qui suit la surface du vêtement.
function cord(F, pts, r, m, o = {}) { for (let i = 0; i + 1 < pts.length; i++) F.cap(pts[i], pts[i + 1], r, r, m, o); }
// Le sifflet sur sa cordelette, posée sur le devant du haut.
function whistle(F, sk, zw, fy = 4.0) {
  for (const s of [-1, 1]) cord(F, [[s * 1.7, 1.6, sk.shoulder + 0.7], [s * 1.6, fy, sk.shoulder - 1.0], [s * 0.6, fy, zw + 0.6]], 0.36, FM.cordon);
  F.rbox([0, fy, zw], [0.9, 0.6, 0.6], FM.chrome, { r: 0.2 });
  F.put(0.6, fy + 0.6, zw - 0.2, FM.chrome);
}

// ================================================================ LE CASTING
// ---------------------------------------------------------------- 1. le joueur
function joueur(F, W) {
  const sk = skeleton({
    kneeN: [2.35, 0.8, 10.4], ankN: [2.45, 0.6, 2.9], footN: [2.5, 0.5], rotN: 0.25,
    elN: [8.0, -1.0, 25.0], wrN: [8.6, 2.2, 21.0],
    elF: [-6.3, -0.2, 24.6], wrF: [-6.6, 0.4, 19.2],
  });
  W.fig.sock = 9.6; W.fig.yoke = sk.shoulder - 0.8;
  W.fig.neck = { x: 0, y: 0.4, z0: sk.shoulder - 0.2, r: 2.3 };
  W.fig.crest = [4.5, 2 * (sk.chest + 0.5) + 0.5];
  W.fig.ball = [6.9, 1.7, 22.0];
  const R = person(F, W, {
    sk, skin: 'olive',
    legs: z => (z > 14.2 ? FM.short : z > 9.6 ? FM.peau_olive : FM.chaussette),
    shoes: { upper: FM.crampon, sole: FM.semelle },
    hips: (F, sk) => {
      F.rbox([0, -0.1, 17.8], [4.3, 2.6, 2.3], FM.short, { r: 0.9 });
      for (const s of ['F', 'N']) F.seg(sk['hip' + s], lerp3(sk['hip' + s], sk['knee' + s], 0.55), 2.15, 2.25, FM.short, { r: 0.7, ext: 0.3 });
    },
    torso: FM.maillot, build: { chest: 0.4 },
    face: { smile: true, brow: HAIR.noir },
    hair: (F, H) => hair(F, H, FM.cheveux_noir, (y, x) => (y > H.fy - 1.5 ? 7.4 : y > 0.5 ? (Math.abs(x) > 3.5 ? 5.6 : 7.4) : y > -1.5 ? 5.6 : 2.2)),
    armAll: { sleeve: FM.manche, end: 0.62, cuff: FM.revers },
    arms: { N: { hand: false }, F: { dir: [-0.05, 0.1, -1], dirSide: [0, 1, 0] } },
  });
  F.ell(W.fig.ball, [2.8, 2.8, 2.8], FM.ballon);
  hand(F, sk.wrN, [-0.55, 0.75, 0.25], R.skin, { len: 2.0 });
}

// ---------------------------------------------------------------- 2. l'entraîneur
function entraineur(F, W) {
  const sk = skeleton({
    shN: [5.6, 0, 30.4], elN: [6.5, -0.2, 24.2], wrN: [6.9, 0.2, 18.6],
    elF: [-6.4, 0.4, 24.6], wrF: [-6.2, 1.6, 19.6],
    kneeF: [-2.3, 0.2, 10.4], ankF: [-2.5, -0.2, 2.9], footF: [-2.6, -0.2],
  });
  W.fig.front = { yMin: 1.2, zTop: sk.shoulder + 0.8, zV: sk.shoulder - 1.6, wTop: 1.6, inner: GRIS, line: 'zip', lineCol: GRIS, zBot: 18 };
  W.fig.shoeLine = BORD;
  const R = person(F, W, {
    sk, skin: 'clair',
    legs: () => FM.survet_bord, legDims: { tw: 1.95, td: 2.05, sw: 1.75, sd: 1.85, st: 0.05 },
    shoes: { upper: FM.basket_sombre, sole: FM.semelle_claire },
    hips: (F, sk) => F.rbox([0, -0.1, 18.0], [4.3, 2.6, 2.4], FM.survet_bord, { r: 0.9 }),
    torso: FM.survet_bord, build: { w: 1.04, d: 1.05 },
    face: { brow: HAIR.brun, browThick: true, mouthW: 1.5 },
    hair: (F, H) => hair(F, H, FM.cheveux_brun, (y, x) => (y > H.fy - 1.5 ? 7.2 : y > 0.5 ? (Math.abs(x) > 3.5 ? 5.4 : 7.2) : y > -1.5 ? 5.4 : 2.0)),
    armAll: { sleeve: FM.survet_bord, end: 2, loose: 0.35 },
    arms: { N: { hand: false }, F: { dir: [0.1, 0.35, -1] } },
  });
  // les bandes grises le long du bras et de la jambe proches
  sideBand(F, sk.shN, sk.elN, [FM.survet_bord], FM.bande_grise);
  sideBand(F, sk.elN, sk.wrN, [FM.survet_bord], FM.bande_grise);
  sideBand(F, [2.2, 0, 19.5], [2.3, -0.1, 3.4], [FM.survet_bord], FM.bande_grise);
  // le col montant, le sifflet sur sa cordelette
  F.loft(sk.shoulder - 0.4, sk.shoulder + 1.6, () => ({ rx: 2.6, ry: 2.3, cy: 0.35, rc: 1.2 }), FM.survet_bord, { mode: 'under' });
  whistle(F, sk, 26.6);
  // le sac de maillots, tenu par le col
  F.ell([7.5, 0.6, 12.2], [3.7, 3.1, 5.3], FM.filet, { n: 2.2 });
  F.cyl([7.2, 0.5, 16.2], [7.0, 0.4, 18.8], 1.4, 0.8, FM.lacet);
  F.cap([6.4, 2.8, 15.8], [5.6, 3.6, 12.6], 0.65, 0.6, FM.maillot_sac);          // une manche qui dépasse
  hand(F, sk.wrN, [0.05, 0.05, -1], R.skin, { len: 2.0, hw: 1.25 });
}

// ---------------------------------------------------------------- 3. la présidente
function presidente(F, W) {
  const sk = skeleton({
    h: 0.97,
    hipF: [-2.0, 0, 18.0], hipN: [2.0, 0, 18.0], kneeF: [-1.8, 0.4, 10.0], kneeN: [1.9, 0.6, 10.0],
    ankF: [-1.8, 0, 2.8], ankN: [1.7, 0.5, 2.8], footF: [-1.8, -0.2], footN: [1.6, 0.6], rotF: -0.12, rotN: 0.18,
    shF: [-5.0, 0, 29.8], shN: [5.0, 0, 29.8],
    elN: [6.1, 0.2, 23.8], wrN: [6.6, 1.6, 19.4],
    elF: [-5.5, -0.3, 23.8], wrF: [-5.7, 0.3, 18.8],
  });
  W.fig.front = { yMin: 1.0, zTop: sk.shoulder + 0.4, zV: 24.0, wTop: 1.9, inner: [0.88, 0.86, 0.82], edge: 0.7, collar: true, line: 'buttons', lineCol: [0.62, 0.52, 0.30], buttons: [22.6, 20.6], zBot: 17 };
  W.fig.tights = [0.30, 0.20, 0.15];
  const R = person(F, W, {
    sk, skin: 'brun',
    legs: z => (z > 10.5 ? FM.jupe : FM.collant), legDims: { tw: 1.6, td: 1.7, sw: 1.3, sd: 1.4 },
    shoes: { upper: FM.cuir_noir, sole: FM.cuir_noir, len: 5.6, wd: 1.35, hh: 2.0, heel: 1.6, pump: true },
    hips: (F) => F.loft(9.6, 19.6, keys([[9.6, { rx: 4.4, ry: 3.1, cy: 0.1, rc: 1.6 }], [16, { rx: 4.5, ry: 2.9, cy: 0, rc: 1.6 }], [19.6, { rx: 4.1, ry: 2.6, cy: 0, rc: 1.4 }]]), FM.jupe),
    torso: FM.tailleur, build: { fem: 1, z0: 16.8 },
    face: { brow: HAIR.noir, lip: [0.58, 0.16, 0.20], mouthW: 1.5, lash: true, smile: true },
    head: { ears: false },
    hair: (F, H) => {
      // le carré noir, la raie sur le côté lointain
      hair(F, H, FM.cheveux_noir, (y, x) => (y > H.fy - 1.5 ? (x < -0.5 ? 6.6 : 7.4) : 1.6),
        { vol: (x, y, zh, dir) => dir === 'up' || (zh > 1.5 && (dir === 'side' || dir === 'back')), fringe: 7.0 });
      for (const s of [-1, 1]) F.put(s * (H.ex + 0.2), H.cy + 1, H.eyeZ - 1.5, FM.laiton);      // les boucles d'oreilles
    },
    armAll: { sleeve: FM.tailleur, end: 2, loose: 0.3, uw: 1.3, fw: 1.15 },
    arms: { N: { hand: false }, F: { dir: [0, 0.1, -1] } },
  });
  // l'écharpe du club, les pans bien visibles sur le revers sombre
  scarf(F, sk, { rx: 2.8, ry: 2.7, ex: 2.2, hw: 0.9, fy: 3.0, len: 10.5, lean: 0.5 });
  // le dossier, tenu par le bord, contre la hanche
  F.rbox([6.6, 3.2, 16.8], [0.55, 3.0, 3.9], FM.dos_bord, { r: 0.3 });
  F.rbox([6.3, 3.4, 16.6], [0.3, 2.7, 3.6], FM.papier, { r: 0.1 });
  F.rbox([6.6, 3.2, 16.8], [0.6, 3.1, 0.4], FM.elastique, { r: 0.1, mode: 'paint' });
  W.fig.labelX = 0;
  F.rbox([7.1, 3.4, 18.4], [0.2, 1.6, 0.9], FM.etiquette, { r: 0.05 });
  hand(F, sk.wrN, [0.05, 0.25, -1], R.skin, { len: 1.9, hw: 1.05 });
}

// ---------------------------------------------------------------- 4. la directrice sportive
function ds(F, W) {
  const sk = skeleton({
    h: 0.98,
    shF: [-5.1, 0, 30.0], shN: [5.1, 0, 30.0],
    elN: [6.6, 0.4, 23.6], wrN: [4.6, 4.4, 21.6],
    elF: [-6.4, 0.2, 23.6], wrF: [-3.0, 4.6, 22.4],
    footN: [2.4, 0.2], rotN: 0.2,
  });
  W.fig.front = { yMin: 1.0, zTop: sk.shoulder + 1.0, zV: sk.shoulder - 0.4, wTop: 1.2, inner: [0.12, 0.27, 0.30], line: 'zip', lineCol: [0.62, 0.63, 0.62], zBot: 15.5 };
  W.fig.quilt = 0.4;
  const R = person(F, W, {
    sk, skin: 'dore',
    legs: z => (z > 6.2 ? FM.jean_brut : FM.cuir_brun), legDims: { tw: 1.65, td: 1.75, sw: 1.4, sd: 1.5 },
    shoes: { upper: FM.cuir_brun, sole: FM.semelle, len: 6.2, wd: 1.55, hh: 3.2 },
    hips: (F) => F.rbox([0, -0.1, 17.4], [4.0, 2.5, 2.2], FM.jean_brut, { r: 0.9 }),
    torso: FM.doudoune, torsoKeys: torsoKeys(sk, { fem: 1, w: 1.12, d: 1.22, z0: 15.2 }),
    face: { brow: HAIR.chatain, lip: [0.50, 0.20, 0.17], mouthW: 1.5, lash: true },
    hair: (F, H) => {
      hair(F, H, FM.cheveux_chatain, (y, x) => (y > H.fy - 1.5 ? 7.2 : y > 0.5 ? (Math.abs(x) > 3.0 ? 5.0 : 7.2) : 3.0));
      // la queue de cheval, ramenée sur l'épaule proche
      cord(F, [[2.2, H.cy - 3.2, H.hb + 6.6], [3.9, H.cy - 2.6, H.hb + 3.4], [4.4, H.cy - 0.6, H.hb - 0.6], [4.2, H.cy + 1.2, H.hb - 4.2]], 1.0, FM.cheveux_chatain, { mode: 'under' });
      F.rbox([2.3, H.cy - 3.2, H.hb + 6.4], [0.8, 0.8, 0.6], FM.elastique, { r: 0.3, mode: 'under' });
    },
    armAll: { sleeve: FM.doudoune, end: 2, loose: 0.55, uw: 1.4, fw: 1.25 },
    arms: { N: { hand: false }, F: { hand: false } },
  });
  F.loft(sk.shoulder - 0.5, sk.shoulder + 1.8, () => ({ rx: 2.9, ry: 2.6, cy: 0.35, rc: 1.3 }), FM.doudoune, { mode: 'under' });
  // les jumelles pendues à la sangle : deux fûts bien séparés, l'oculaire en haut
  F.cap([-2.0, 2.6, sk.shoulder + 0.6], [-1.8, 4.0, 29.0], 0.35, 0.35, FM.cordon);
  F.cap([2.0, 2.6, sk.shoulder + 0.6], [1.8, 4.0, 29.0], 0.35, 0.35, FM.cordon);
  for (const s of [-1, 1]) {
    F.cyl([s * 1.6, 4.4, 28.6], [s * 1.6, 4.7, 24.8], 0.95, 1.0, FM.caoutchouc);
    F.cyl([s * 1.6, 4.4, 29.2], [s * 1.6, 4.4, 28.6], 0.6, 0.6, FM.chrome);
    F.cyl([s * 1.6, 4.7, 24.8], [s * 1.6, 4.75, 24.2], 0.85, 0.85, FM.verre);
  }
  F.rbox([0, 4.5, 27.6], [0.7, 0.5, 0.9], FM.chrome, { r: 0.2 });
  // le carnet ouvert tenu bas, le stylo qui note
  F.seg([-1.8, 6.4, 21.0], [3.4, 6.4, 21.0], 2.0, 0.3, FM.carnet, { side: [0, 1, 0], r: 0.1 });
  F.seg([-1.6, 6.4, 21.5], [3.2, 6.4, 21.5], 1.8, 0.2, FM.page, { side: [0, 1, 0], r: 0.05 });
  F.put(0.8, 6.4, 21.7, FM.cordon);
  F.cyl([-1.2, 5.6, 21.8], [-0.2, 7.2, 23.6], 0.3, 0.3, FM.stylo);
  hand(F, sk.wrN, [-0.3, 0.6, -0.1], R.skin, { len: 1.6, hw: 1.0 });
  hand(F, sk.wrF, [0.4, 0.5, 0.1], R.skin, { len: 1.5, hw: 0.95 });
}

// ---------------------------------------------------------------- 5. Gégé
function gege(F, W) {
  const sk = skeleton({
    shF: [-5.9, 0, 30.8], shN: [5.9, 0, 30.8],
    elF: [-8.4, 1.6, 35.0], wrF: [-8.8, 2.6, 39.4],
    elN: [7.2, 0.2, 24.6], wrN: [6.8, 1.4, 19.6],
    footF: [-2.6, -0.4], footN: [2.7, 0.4], rotN: 0.22,
    kneeF: [-2.4, 0.2, 10.4], kneeN: [2.5, 0.6, 10.4],
  });
  W.fig.front = { yMin: 1.4, zTop: sk.shoulder + 1, zV: sk.shoulder + 0.5, wTop: 0.6, inner: [0.5, 0.1, 0.1], line: 'zip', lineCol: [0.30, 0.06, 0.06], zBot: 13 };
  W.fig.band = [25.6, 27.6];
  W.fig.shoeLine = [0.15, 0.36, 0.21];
  const R = person(F, W, {
    sk, skin: 'clair',
    legs: () => FM.jean, legDims: { tw: 1.95, td: 2.05, sw: 1.75, sd: 1.85, st: 0.04 },
    shoes: { upper: FM.basket, sole: FM.semelle_claire, len: 6.9, wd: 1.85 },
    hips: (F) => F.rbox([0, -0.1, 17.6], [4.6, 2.8, 2.4], FM.jean, { r: 0.9 }),
    torso: FM.parka, torsoKeys: torsoKeys(sk, { w: 1.15, d: 1.25, belly: 0.5, z0: 12.6 }),
    face: { brow: HAIR.brun, browThick: true, browTilt: -1, stubble: [0.30, 0.22, 0.17], open: true, mouthW: 1.5 },
    side: { stubble: [0.30, 0.22, 0.17] },
    head: { jaw: 3.4, chin: 2.6 },
    hair: (F, H) => {
      // les cheveux sous la casquette
      hair(F, H, FM.cheveux_brun, (y, x) => (y > H.fy - 1.5 ? 99 : y > 0.5 ? (Math.abs(x) > 3.0 ? 4.8 : 99) : 2.4), { vol: () => false });
      // la casquette : la calotte (le haut du crâne repeint, une coque par-dessus), la visière
      F.fill(-6, -6, H.hb + 7.2, 6, 6, H.hb + 11, (x, y, z) => (Math.abs(x) <= H.ex && z - H.hb > 7.2 ? FM.casquette : null), { mode: 'paint', only: [H.skin, FM.cheveux_brun], keepTag: true });
      const Hc = Object.assign({}, H, { skin: FM.casquette });
      hair(F, Hc, FM.casquette, () => 7.2, { vol: (x, y, zh, dir) => dir === 'up' || (dir === 'back' && zh > 7.2), fringe: 7.2 });
      // la visière, légèrement cintrée vers le bas sur le bord
      const zv = H.hb + 7.5;
      F.fill(-5, H.fy, zv - 1, 5, H.fy + 4.8, zv, (x, y, z) => {
        const r = Math.hypot(x / 3.4, (y - H.fy) / 4.2);
        if (y <= H.fy || r > 1) return null;
        const zz = (y - H.fy > 3.0 || Math.abs(x) > 2.6) ? zv - 1 : zv;
        return Math.abs(z - zz) < 0.1 ? FM.visiere : null;
      });
      F.put(0, H.cy, H.hb + H.Hh + 1.5, FM.casquette);                         // le bouton
    },
    armAll: { sleeve: FM.parka, end: 2, loose: 0.5, uw: 1.55, fw: 1.4 },
    arms: { F: { hand: false }, N: { dir: [0.0, 0.15, -1], handOpt: { len: 2.1, hw: 1.3, hd: 1.2 } } },
  });
  // la capuche, roulée dans le dos
  F.rbox([0, -3.6, sk.shoulder - 0.2], [3.2, 1.2, 1.6], FM.parka, { r: 0.8, mode: 'under' });
  // l'écharpe rayée
  scarf(F, sk, { rx: 3.2, ry: 3.0, ex: 1.8, fy: 3.6, len: 8.5, lean: 0.9 });
  // le mégaphone brandi à bout de bras, pavillon vers la tribune
  const mA = [-7.4, 3.4, 42.2], mB = [-13.0, 5.2, 46.8];
  F.cyl(mA, mB, 0.95, 2.7, FM.megaphone);
  F.cyl(lerp3(mA, mB, 0.84), mB, 2.45, 2.8, FM.megaphone_rouge);
  F.cyl(lerp3(mA, mB, -0.16), mA, 0.65, 0.8, FM.caoutchouc);
  F.seg([-8.8, 3.2, 42.2], [-8.9, 3.0, 39.8], 0.6, 0.6, FM.caoutchouc, { r: 0.2 });
  hand(F, sk.wrF, [0.0, 0.1, 1], R.skin, { len: 1.6, hw: 1.25 });
}

// ---------------------------------------------------------------- 6. Madame Josiane
function josiane(F, W) {
  const sk = skeleton({
    h: 0.93,
    hipF: [-2.1, 0, 17.4], hipN: [2.1, 0, 17.4], kneeF: [-2.0, 0.3, 9.6], kneeN: [2.0, 0.3, 9.6],
    ankF: [-2.0, 0, 2.7], ankN: [2.0, 0.1, 2.7], footF: [-2.0, -0.2], footN: [2.0, 0.0],
    shF: [-5.2, 0, 28.6], shN: [5.2, 0, 28.6],
    elF: [-6.0, 0.4, 22.4], wrF: [-3.6, 3.8, 21.4],
    elN: [6.0, 0.4, 22.4], wrN: [3.8, 3.8, 21.4],
  });
  W.fig.front = { yMin: 1.0, zTop: sk.shoulder + 0.5, zV: 24.2, wTop: 2.1, inner: [0.86, 0.80, 0.66], edge: 0.72, line: 'buttons', lineCol: [0.86, 0.80, 0.66], buttons: [22.8, 21.0, 19.2], zBot: 17.5 };
  W.fig.rib = 18.2;
  W.fig.tights = [0.62, 0.48, 0.40];
  const R = person(F, W, {
    sk, skin: 'porcelaine',
    legs: z => (z > 8.6 ? FM.jupe_grise : FM.collant), legDims: { tw: 1.65, td: 1.75, sw: 1.35, sd: 1.45 },
    shoes: { upper: FM.cuir_noir, sole: FM.cuir_noir, len: 5.8, wd: 1.45, hh: 2.2, heel: 1.6 },
    hips: (F) => F.loft(8.2, 18.8, keys([[8.2, { rx: 4.3, ry: 3.0, cy: 0.1, rc: 1.6 }], [15, { rx: 4.6, ry: 3.0, cy: 0, rc: 1.6 }], [18.8, { rx: 4.3, ry: 2.8, cy: 0, rc: 1.4 }]]), FM.jupe_grise),
    torso: FM.gilet, torsoKeys: torsoKeys(sk, { fem: 1, w: 1.08, d: 1.06, z0: 16.4, belly: 0.3 }),
    face: { brow: [0.42, 0.40, 0.38], lip: [0.62, 0.24, 0.27], mouthW: 1.5, smile: true, wrinkles: true, blush: 0.18,
      glasses: roundGlasses([0.62, 0.50, 0.22]) },
    side: { glasses: [0.62, 0.50, 0.22] },
    head: { w: 0.96 },
    hair: (F, H) => {
      hair(F, H, FM.cheveux_gris, (y, x) => (y > H.fy - 1.5 ? 7.4 : y > 0.5 ? (Math.abs(x) > 3.5 ? 5.6 : 7.4) : 3.6));
      F.ell([0, -3.8, H.hb + 9.2], [2.2, 2.0, 1.9], FM.cheveux_gris);          // le chignon
      F.put(1.6, -3.2, H.hb + 10.4, FM.chrome);                            // l'épingle
    },
    armAll: { sleeve: FM.gilet, end: 2, loose: 0.35, uw: 1.35, fw: 1.2 },
    arms: { N: { hand: false }, F: { hand: false } },
  });
  // la pile de dossiers, portée à deux bras
  const pile = [[FM.dos_beige, 0, 0], [FM.dos_bleu, 0.4, 0.3], [FM.dos_rose, -0.3, -0.2], [FM.dos_vert, 0.3, 0.2], [FM.dos_beige, -0.2, 0.4], [FM.dos_bord, 0.2, -0.1]];
  let z = 21.6;
  pile.forEach(([m, dx, dy], i) => {
    F.rbox([0.2 + dx, 5.4 + dy, z + 0.5], [3.6, 2.7, 0.5], m, { r: 0.15 });
    if (i % 2 === 1) F.rbox([0.6 + dx, 6.4 + dy, z + 0.5], [2.8, 2.6, 0.3], FM.papier, { r: 0.1, mode: 'under' });
    z += 1;
  });
  hand(F, sk.wrN, [-0.4, 0.8, 0.1], R.skin, { len: 1.9, hw: 1.05 });
  hand(F, sk.wrF, [0.4, 0.8, 0.1], R.skin, { len: 1.9, hw: 1.05 });
}

// ---------------------------------------------------------------- 7. Zoran Vukić
function vukic(F, W) {
  const sk = skeleton({
    elN: [6.9, -1.4, 24.6], wrN: [7.6, 2.8, 22.4],
    elF: [-8.2, -0.8, 24.6], wrF: [-5.4, 1.0, 20.8],
    footF: [-2.6, -0.4], footN: [2.6, 0.3], rotN: 0.18,
  });
  W.fig.front = { yMin: 1.2, zTop: sk.shoulder + 0.8, zV: sk.shoulder - 1.4, wTop: 1.5, inner: [0.84, 0.79, 0.64], line: 'zip', lineCol: [0.84, 0.79, 0.64], zBot: 18 };
  W.fig.shoeLine = [0.15, 0.20, 0.36];
  const R = person(F, W, {
    sk, skin: 'clair',
    legs: () => FM.survet_marine, legDims: { tw: 1.95, td: 2.05, sw: 1.75, sd: 1.85, st: 0.05 },
    shoes: { upper: FM.basket, sole: FM.semelle_claire },
    hips: (F) => F.rbox([0, -0.1, 18.0], [4.3, 2.6, 2.4], FM.survet_marine, { r: 0.9 }),
    torso: FM.survet_marine, build: { w: 1.02 },
    face: { brow: HAIR.brun, browThick: true, mustache: [0.20, 0.13, 0.08], mustacheH: 2, mouthW: 1.5 },
    hair: (F, H) => hair(F, H, FM.cheveux_brun, (y, x) => (y > H.fy - 1.5 ? 7.6 : y > 0.5 ? (Math.abs(x) > 3.0 ? 5.4 : 7.6) : y > -1.5 ? 5.4 : 2.0)),
    armAll: { sleeve: FM.survet_marine, end: 2, loose: 0.35 },
    arms: { N: { hand: false }, F: { dir: [0.6, 0.5, -0.4] } },
  });
  sideBand(F, sk.shN, sk.elN, [FM.survet_marine], FM.bande_creme);
  sideBand(F, [2.2, 0, 19.5], [2.3, -0.1, 3.4], [FM.survet_marine], FM.bande_creme);
  F.loft(sk.shoulder - 0.4, sk.shoulder + 1.6, () => ({ rx: 2.6, ry: 2.3, cy: 0.35, rc: 1.2 }), FM.survet_marine, { mode: 'under' });
  whistle(F, sk, 26.6);
  // la pile de plots emboîtés, pointes en haut, serrée contre la hanche par l'avant-bras
  const cx = 7.3, cy = 2.6, n = 6, z0 = 15.4, step = 1.25;
  for (let i = 0; i < n; i++) {
    const b = z0 + i * step;
    F.cyl([cx, cy, b], [cx, cy, b + 3.4], 2.4, 0.7, (x, y, z) => (z < b + 0.55 ? FM.plot_bord : FM.plot), { mode: i ? 'under' : undefined });
  }
  hand(F, sk.wrN, [-0.4, 0.5, -0.5], R.skin, { len: 2.0 });
}

// ---------------------------------------------------------------- 8. Jean-Marie Vaubourg
function vaubourg(F, W) {
  const sk = skeleton({
    h: 0.98,
    shN: [5.9, 0, 30.4], elN: [8.2, 0.6, 27.6], wrN: [6.3, 0.9, 33.2],
    elF: [-6.9, -0.6, 24.2], wrF: [-5.6, 0.6, 20.4],
    footF: [-2.6, -0.4], footN: [2.6, 0.2], rotF: -0.2, rotN: 0.25,
  });
  W.fig.front = { yMin: 2.2, zTop: sk.shoulder + 0.5, zV: 24.6, wTop: 2.0, inner: [0.88, 0.87, 0.82], tie: [0.15, 0.16, 0.26], edge: 0.68, collar: true, line: 'buttons', lineCol: [0.20, 0.05, 0.08], buttons: [23.2, 21.0], zBot: 17.5 };
  W.fig.pocket = p => p.z > 19.4 && p.z < 20.0 && Math.abs(p.x) > 1.6 && Math.abs(p.x) < 3.9;
  const R = person(F, W, {
    sk, skin: 'clair',
    legs: () => FM.costume_bord, legDims: { tw: 2.05, td: 2.15, sw: 1.8, sd: 1.9, st: 0.04 },
    shoes: { upper: FM.cuir_noir, sole: FM.cuir_noir, len: 6.8, wd: 1.8, hh: 2.6 },
    hips: (F) => F.rbox([0, 0.1, 17.8], [4.7, 3.2, 2.4], FM.costume_bord, { r: 1.0 }),
    torso: FM.costume_bord, torsoKeys: torsoKeys(sk, { w: 1.14, d: 1.12, belly: 1.5, z0: 15.6 }),
    face: { brow: [0.50, 0.49, 0.47], browThick: true, mouthW: 2, smile: true, wrinkles: true, bags: true,
      glasses: squareGlasses([0.30, 0.27, 0.25]) },
    side: { glasses: [0.30, 0.27, 0.25] },
    head: { jaw: 3.6, chin: 2.8 },
    hair: (F, H) => hair(F, H, FM.cheveux_gris, (y, x) => (y < -1.2 ? 2.6 : Math.abs(x) > 2.8 ? 4.6 : 99),
      { maxZ: 7.6, vol: (x, y, zh, dir) => dir !== 'up' && zh < 7.4 && zh > 2.4 }),
    armAll: { sleeve: FM.costume_bord, end: 2, loose: 0.4 },
    arms: { N: { hand: false }, F: { hand: false } },
  });
  // la main dans la poche : on ne voit que le poignet de chemise
  F.rbox([-5.4, 1.0, 20.6], [1.1, 1.0, 0.5], FM.chemise, { r: 0.3 });
  // le téléphone à antenne collé à l'oreille, son petit écran vert
  const ex = R.H.ex;
  F.rbox([ex + 0.6, 0.9, sk.eyeZ - 0.6], [0.65, 0.8, 2.9], FM.telephone, { r: 0.25 });
  F.put(ex + 0.6, 0.6, sk.eyeZ + 1.5, FM.ecran);
  F.cyl([ex + 0.6, 0.4, sk.eyeZ + 2.2], [ex + 0.7, 0.2, sk.eyeZ + 7.2], 0.4, 0.35, FM.antenne);
  F.put(ex + 0.7, 0.2, sk.eyeZ + 7.4, FM.antenne);
  hand(F, sk.wrN, [-0.25, 0.1, 1], R.skin, { len: 2.4, hw: 1.15, side: [0, 1, 0] });
  // l'insigne doré au revers
  F.put(2.6, 3.9, 28.6, FM.laiton);
}

// ---------------------------------------------------------------- 9. Doc Sabatier
function sabatier(F, W) {
  const sk = skeleton({
    shN: [5.6, 0, 30.6], elN: [6.6, -0.3, 24.4], wrN: [7.0, 0.2, 18.8],
    elF: [-6.6, -0.4, 24.4], wrF: [-5.8, 0.8, 20.2],
  });
  W.fig.front = { yMin: 1.4, zTop: sk.shoulder + 0.6, zV: 23.2, wTop: 2.1, inner: [0.17, 0.33, 0.62], edge: 0.84, collar: true, line: 'buttons', lineCol: [0.55, 0.56, 0.56], buttons: [21.6, 18.6, 15.6], zBot: 10.6 };
  W.fig.pocket = p => (p.z > 17.0 && p.z < 17.5 && Math.abs(p.x) > 1.4 && Math.abs(p.x) < 3.9) || (p.z > 27.0 && p.z < 27.5 && p.x > 1.2 && p.x < 3.4);
  W.fig.bagSeam = (p, c) => c.face !== TOP && mod(p.tz, 7) === 0.5;
  const glassesUp = (c, tx, tz, ax) => {
    if (tz < 4.5 || tz > 6.5 || ax > 5.5) return;
    const dx = Math.abs(ax - 3.5), dz = Math.abs(tz - 5.5);
    if ((dx === 2 && dz <= 0.5) || (dz === 1 && dx <= 1)) set3(c, [0.12, 0.11, 0.11]);
    else if (ax <= 0.5 && tz === 5.5) set3(c, [0.12, 0.11, 0.11]);
    else if (dx <= 1 && dz === 0) tint(c, [0.9, 0.95, 1], 0.35);
  };
  const R = person(F, W, {
    sk, skin: 'porcelaine',
    legs: () => FM.pantalon, legDims: { tw: 1.9, td: 2.0, sw: 1.7, sd: 1.8, st: 0.04 },
    shoes: { upper: FM.cuir_brun, sole: FM.semelle, len: 6.8, wd: 1.75, hh: 2.6 },
    torso: FM.blouse, torsoKeys: [
      [10.4, { rx: 4.9, ry: 3.3, cy: 0.1, rc: 1.6 }], [17, { rx: 4.6, ry: 3.0, cy: 0.1, rc: 1.5 }],
      ...torsoKeys(sk, { w: 1.05, d: 1.06, belly: 0.4 }).slice(1)],
    face: { beard: [0.66, 0.65, 0.62], brow: [0.55, 0.54, 0.52], mouthW: 1.5, glasses: glassesUp },
    side: { beard: [0.66, 0.65, 0.62] },
    hair: (F, H) => hair(F, H, FM.cheveux_gris, (y, x) => (y < -1.2 ? 2.6 : Math.abs(x) > 3.3 ? 4.8 : 99),
      { maxZ: 7.6, vol: (x, y, zh, dir) => dir !== 'up' && zh < 7.4 && zh > 2.4 }),
    armAll: { sleeve: FM.blouse, end: 2, loose: 0.45 },
    arms: { N: { hand: false }, F: { hand: false } },
  });
  // le stéthoscope : le tour du cou, les deux tubes, le pavillon
  cord(F, [[-2.5, 0.6, sk.shoulder + 0.7], [2.5, 0.6, sk.shoulder + 0.7]], 0.45, FM.tube, { mode: 'under' });
  cord(F, [[-2.5, 0.8, sk.shoulder + 0.7], [-2.7, 4.0, sk.shoulder - 1.4], [-3.0, 4.0, 23.6]], 0.48, FM.tube);
  cord(F, [[2.5, 0.8, sk.shoulder + 0.7], [2.7, 4.0, sk.shoulder - 1.4], [3.0, 4.0, 25.6]], 0.48, FM.tube);
  F.cyl([-3.0, 3.8, 23.0], [-3.0, 4.9, 23.0], 1.05, 1.05, FM.chrome);
  F.rbox([3.0, 4.2, 25.0], [0.5, 0.5, 0.6], FM.chrome, { r: 0.2 });
  // la main lointaine dans la poche de la blouse
  F.rbox([-4.9, 1.6, 20.0], [1.0, 1.0, 0.6], FM.blouse, { r: 0.3 });
  // la sacoche de cuir, tenue à bout de bras
  F.rbox([8.2, 0.6, 13.6], [3.6, 1.7, 2.9], FM.sacoche, { r: 0.7 });
  F.rbox([8.2, 0.6, 16.4], [3.4, 1.5, 0.4], FM.cuir_brun, { r: 0.2 });
  F.put(8.2, 2.3, 15.6, FM.laiton);
  F.cap([6.8, 0.6, 16.8], [7.2, 0.6, 18.6], 0.45, 0.45, FM.cuir_brun);
  F.cap([9.6, 0.6, 16.8], [9.2, 0.6, 18.6], 0.45, 0.45, FM.cuir_brun);
  F.cap([7.2, 0.6, 18.6], [9.2, 0.6, 18.6], 0.45, 0.45, FM.cuir_brun);
  hand(F, sk.wrN, [0.4, 0.1, -1], R.skin, { len: 1.8, hw: 1.2 });
}

// ---------------------------------------------------------------- 10. Lian Mbako
function mbako(F, W) {
  const sk = skeleton({
    h: 0.95,
    shF: [-5.2, 0, 29.3], shN: [5.2, 0, 29.3],
    elN: [7.6, 0.6, 24.2], wrN: [7.4, 2.4, 28.4],
    elF: [-5.8, -0.4, 23.4], wrF: [-6.0, 0.4, 18.4],
    hipF: [-1.9, 0, 17.6], hipN: [1.9, 0, 17.6], kneeF: [-1.9, 0.2, 9.8], kneeN: [2.0, 0.5, 9.8],
    ankF: [-2.0, -0.1, 2.8], ankN: [2.1, 0.4, 2.8], footF: [-2.1, -0.2], footN: [2.2, 0.3], rotN: 0.2,
  });
  W.fig.sock = 9.0; W.fig.yoke = sk.shoulder - 0.8;
  W.fig.neck = { x: 0, y: 0.4, z0: sk.shoulder - 0.2, r: 2.1 };
  W.fig.crest = [4.5, 2 * (sk.chest + 0.5) + 0.5];
  W.fig.bootStripe = (p, c) => { const dz = p.z - (p.y > 1.6 ? 22.8 : 23.6); return c.face === LEFT && dz > 0.9 && dz < 1.5 && p.x > 8.0 && p.x < 11.8; };
  const R = person(F, W, {
    sk, skin: 'ebene',
    legs: z => (z > 13.4 ? FM.short : z > 9.0 ? FM.peau_ebene : FM.chaussette), legDims: { tw: 1.55, td: 1.65, sw: 1.3, sd: 1.4 },
    shoes: { upper: FM.basket_sombre, sole: FM.semelle_claire, len: 6.2, wd: 1.55 },
    hips: (F, sk) => {
      F.rbox([0, -0.1, 16.8], [3.9, 2.4, 2.2], FM.short, { r: 0.9 });
      for (const s of ['F', 'N']) F.seg(sk['hip' + s], lerp3(sk['hip' + s], sk['knee' + s], 0.52), 1.95, 2.05, FM.short, { r: 0.7, ext: 0.3 });
    },
    torso: FM.maillot, torsoKeys: torsoKeys(sk, { w: 0.9, d: 0.92 }),
    face: { brow: HAIR.noir, mouthW: 0.5, smile: true, lip: [0.30, 0.13, 0.11], bigEyes: true, mouthZ: -5.5 },
    head: { jaw: 3.1, chin: 2.2 },
    hair: (F, H) => hair(F, H, FM.cheveux_noir, (y, x) => (y > H.fy - 1.5 ? 7.6 : y > 0.5 ? (Math.abs(x) > 3.0 ? 5.8 : 7.6) : 3.0),
      { vol: (x, y, zh, dir) => dir === 'up' }),
    armAll: { sleeve: FM.manche, end: 0.6, cuff: FM.revers, uw: 1.25, fw: 1.1 },
    arms: { N: { hand: false }, F: { dir: [0, 0.1, -1] } },
  });
  // la paire de crampons neufs, tenue par les talons, de profil : la pointe vers la droite
  for (const [by, bz] of [[0.4, 23.6], [2.9, 22.8]]) {
    shoe(F, [6.6, by], Math.PI / 2, FM.crampon_blanc, FM.caoutchouc, { z0: bz, len: 6.8, wd: 1.25, hh: 2.6, heel: 0.6 });
    for (const dx of [1.2, 3.4, 5.0]) F.put(6.6 + dx, by, bz - 0.5, FM.crampon_dessous);
    F.put(6.9, by, bz + 2.8, FM.lacet);
  }
  hand(F, sk.wrN, [-0.25, 0.3, -0.6], R.skin, { len: 1.8, hw: 1.1 });
}

// ---------------------------------------------------------------- 11. Gigi Vecchio
function vecchio(F, W) {
  const sk = skeleton({
    hipF: [-2.4, 0, 18.0], hipN: [2.4, 0, 18.0],
    kneeF: [-3.0, 1.6, 10.2], kneeN: [3.0, 1.8, 10.2],
    ankF: [-3.3, 0.2, 2.9], ankN: [3.4, 0.4, 2.9], footF: [-3.4, 0.0], footN: [3.5, 0.2], rotF: -0.25, rotN: 0.25,
    shF: [-6.0, 0.2, 30.6], shN: [6.0, 0.2, 30.6],
    elF: [-7.6, 2.0, 25.2], wrF: [-5.0, 5.6, 26.6],
    elN: [7.6, 2.0, 25.2], wrN: [5.0, 5.6, 26.6],
  });
  W.fig.sock = 9.4; W.fig.chev = 25;
  W.fig.neck = { x: 0, y: 0.5, z0: sk.shoulder - 0.2, r: 2.4 };
  W.fig.pad = p => p.z > 22.8 && p.z < 26.6 && Math.abs(p.x) > 6.4;
  W.fig.glove = 27.2;
  W.fig.chalk = (lx, ly) => ly > 4.6 && ly < 7.4;
  person(F, W, {
    sk, skin: 'dore',
    legs: z => (z > 13.8 ? FM.short_noir : z > 9.4 ? FM.peau_dore : FM.chaussette_noire), legDims: { tw: 2.0, td: 2.1, sw: 1.7, sd: 1.75 },
    shoes: { upper: FM.crampon, sole: FM.semelle, len: 6.9, wd: 1.85 },
    hips: (F, sk) => {
      F.rbox([0, -0.1, 17.4], [4.7, 2.8, 2.4], FM.short_noir, { r: 0.9 });
      for (const s of ['F', 'N']) F.seg(sk['hip' + s], lerp3(sk['hip' + s], sk['knee' + s], 0.5), 2.3, 2.4, FM.short_noir, { r: 0.7, ext: 0.3 });
    },
    torso: FM.gardien, torsoKeys: torsoKeys(sk, { w: 1.12, d: 1.15, chest: 0.6, belly: 0.3 }),
    face: { brow: [0.20, 0.15, 0.12], browThick: true, mustache: [0.30, 0.27, 0.25], mustacheH: 2, mouthW: 1.5, wrinkles: true },
    head: { w: 1.02, jaw: 3.8 },
    hair: (F, H) => hair(F, H, FM.cheveux_poivre, (y, x) => (y > H.fy - 1.5 ? 7.4 : y > 0.5 ? (Math.abs(x) > 3.5 ? 5.4 : 7.4) : y > -1.5 ? 5.4 : 2.2)),
    armAll: { sleeve: FM.gardien_manche, end: 2, loose: 0.4, uw: 1.55, fw: 1.4 },
    arms: { N: { hand: false }, F: { hand: false } },
  });
  // les gants : grands, jaunes, paumes vers l'avant
  for (const s of [-1, 1]) {
    const wr = s < 0 ? sk.wrF : sk.wrN;
    F.seg(add(wr, [0, -0.6, -0.6]), add(wr, [0, 0.6, 0.3]), 1.6, 1.4, FM.gant_bande, { r: 0.5, side: [1, 0, 0] });
    F.rbox([wr[0] + s * 0.1, wr[1] + 1.0, wr[2] + 2.3], [1.75, 0.95, 2.0], FM.gant, { r: 0.6 });
    F.rbox([wr[0] - s * 1.6, wr[1] + 0.8, wr[2] + 1.4], [0.6, 0.7, 1.0], FM.gant, { r: 0.4 });
  }
}

// ---------------------------------------------------------------- 12. Titi Bréhaut
function brehaut(F, W) {
  const sk = skeleton({
    shF: [-5.9, 0, 30.8], shN: [5.9, 0, 30.8],
    elN: [7.6, 1.6, 25.0], wrN: [4.2, 4.4, 26.8],
    elF: [-6.6, -0.4, 24.4], wrF: [-6.8, 0.4, 19.0],
    footF: [-2.6, -0.4], footN: [2.6, 0.2], rotN: 0.2,
    hipF: [-2.3, 0, 18.6], hipN: [2.3, 0, 18.6], kneeF: [-2.4, 0.2, 10.4], kneeN: [2.5, 0.4, 10.4],
  });
  W.fig.sock = 9.6; W.fig.yoke = sk.shoulder - 0.8;
  W.fig.neck = { x: 0, y: 0.45, z0: sk.shoulder - 0.2, r: 2.4 };
  W.fig.crest = [4.5, 2 * (sk.chest + 0.5) + 0.5];
  const R = person(F, W, {
    sk, skin: 'clair',
    legs: z => (z > 14.2 ? FM.short : z > 9.6 ? FM.peau_clair : FM.chaussette), legDims: { tw: 2.0, td: 2.1, sw: 1.75, sd: 1.85 },
    shoes: { upper: FM.crampon, sole: FM.semelle, len: 6.9, wd: 1.85 },
    hips: (F, sk) => {
      F.rbox([0, -0.1, 17.8], [4.6, 2.7, 2.3], FM.short, { r: 0.9 });
      for (const s of ['F', 'N']) F.seg(sk['hip' + s], lerp3(sk['hip' + s], sk['knee' + s], 0.55), 2.35, 2.45, FM.short, { r: 0.7, ext: 0.3 });
    },
    torso: FM.maillot, torsoKeys: torsoKeys(sk, { w: 1.12, d: 1.1, chest: 0.9 }),
    face: { brow: [0.62, 0.48, 0.22], browThick: true, mouthW: 1.5 },
    head: { w: 1.02, jaw: 3.8, chin: 2.8 },
    hair: (F, H) => {
      hair(F, H, FM.cheveux_blond, (y, x) => (y > H.fy - 1.5 ? 7.2 : y > 0.5 ? (Math.abs(x) > 3.5 ? 5.0 : 7.2) : 1.0),
        { vol: (x, y, zh, dir) => dir === 'up' || (dir === 'back' && zh > 1) || (dir === 'side' && zh > 6.4) });
      // le mulet : court devant, long derrière jusqu'aux épaules
      F.loft(H.hb - 3.2, H.hb + 5, z => ({ rx: 3.4 - Math.max(0, H.hb - z) * 0.25, ry: 1.3, cy: -4.0 - Math.max(0, H.hb - z) * 0.15, rc: 1.0 }), FM.cheveux_blond, { mode: 'under' });
    },
    armAll: { sleeve: FM.manche, end: 0.62, cuff: FM.revers },
    arms: { N: { hand: false }, F: { dir: [-0.05, 0.1, -1], dirSide: [0, 1, 0] } },
  });
  // le brassard jaune sur le bras proche
  F.seg(lerp3(sk.shN, sk.elN, 0.14), lerp3(sk.shN, sk.elN, 0.46), 2.2, 2.2, FM.brassard, { mode: 'paint', r: 0.3, only: [FM.manche, FM.revers] });
  // la main sur le cœur
  hand(F, sk.wrN, [-0.8, -0.1, 0.45], R.skin, { len: 2.4, hw: 1.3, hd: 0.9, side: [0, 0, 1] });
}

// ---------------------------------------------------------------- le rendu
const BG = (px, py) => {
  const t = py / FH, dx = (px - FW / 2) / FW, dy = (py - FH * 0.44) / FH;
  const v = Math.exp(-(dx * dx * 1.6 + dy * dy * 2.4) * 3.0);
  return [0.05 + 0.03 * (1 - t) + 0.075 * v, 0.036 + 0.02 * (1 - t) + 0.052 * v, 0.03 + 0.016 * (1 - t) + 0.04 * v];
};
const SUN_DIR = norm(-0.32, 0.62, 0.72);
function renderFigure(def) {
  const W = new World(WX, WX, WZ);
  W.fig = { ox: OX, oy: OY, oz: T };
  W.box(MG, MG, 0, MG + S, MG + S, T, SOCLE[def.socle]);
  const F = new Fig(W, OX, OY, T);
  def.build(F, W);
  // la petite lampe de face, pour les yeux
  W.light({ x: OX + 14, y: OY + 17, z: T + 42, r: 60, fall: 1.3, cr: 0.62, cg: 0.56, cb: 0.50, skip: 1.5 });
  const out6 = [0, 0, 0, 0, 0, 0];
  const opt = {
    width: FW, height: FH, cu: CU, cv: CV,
    ambient: [0.29, 0.30, 0.39], faceAmb: [1.0, 0.84, 0.76],
    sun: [0.84, 0.66, 0.47], sunDir: SUN_DIR,
    backdrop: (px, py) => { const c = BG(px, py); out6[0] = c[0]; out6[1] = c[1]; out6[2] = c[2]; return out6; },
    fogColor: BG, fogS0: -2000, fogS1: -1000,
    wetRow: 40, reflAmb: [0.3, 0.28, 0.28], wetStrength: 0.5,
    bloom: [[2, 0.3], [6, 0.18]], levels: 48, lightQuant: 18, log: false, outlineDark: 0.5, rim: 1.14,
  };
  return E.render(W, opt);
}

const CAST = [
  { key: 'joueur', socle: 'pelouse', build: joueur },
  { key: 'entraineur', socle: 'pelouse', build: entraineur },
  { key: 'presidente', socle: 'parquet', build: presidente },
  { key: 'ds', socle: 'pave', build: ds },
  { key: 'gege', socle: 'pave', build: gege },
  { key: 'josiane', socle: 'parquet', build: josiane },
  { key: 'vukic', socle: 'pelouse', build: vukic },
  { key: 'vaubourg', socle: 'moquette', build: vaubourg },
  { key: 'sabatier', socle: 'carrelage', build: sabatier },
  { key: 'mbako', socle: 'pelouse', build: mbako },
  { key: 'vecchio', socle: 'pelouse', build: vecchio },
  { key: 'brehaut', socle: 'carrelage', build: brehaut },
];

module.exports = { CAST, renderFigure, Fig, FM, SOCLE, HEAD };

if (require.main === module) {
  const args = process.argv.slice(2);
  let zoom = 0;
  const zi = args.indexOf('--zoom');
  if (zi >= 0) { zoom = +args[zi + 1]; args.splice(zi, 2); }
  const todo = args.length ? CAST.filter(d => args.includes(d.key)) : CAST;
  for (const def of todo) {
    const t0 = Date.now();
    const r = renderFigure(def);
    E.writePNG(path.join(__dirname, 'out', `fig_${def.key}.png`), r.img, r.FW, r.FH, 1);
    if (zoom) E.writePNG(path.join(__dirname, 'out', 'zoom', `fig_${def.key}_x${zoom}.png`), r.img, r.FW, r.FH, zoom);
    console.log(`fig_${def.key}.png ${r.FW}×${r.FH} (${Date.now() - t0} ms)`);
  }
}
