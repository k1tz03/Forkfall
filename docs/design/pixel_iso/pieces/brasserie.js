'use strict';
// La brasserie du Pont : du vieux bois et des miroirs. Une banquette de moleskine en équerre dans le
// fond, des miroirs à cadre doré au-dessus, des globes d'opaline ; des nappes en papier, la corbeille
// de pain ; le passe-plat de la cuisine qui rougeoie, l'ardoise du plat du jour au-dessus ; la caisse
// près de l'entrée, sous la photo de l'équipe de 1962 ; un sol de mosaïque blanche à cabochons noirs.
const E = require('../engine');
const { TOP, RIGHT, hash, mod, fbm } = E;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const grain = (c, amt, s = 0) => mul(c, 1 + (hash(c.a, c.b, c.face * 7 + s, c.m) - 0.5) * 2 * amt);
if (!E.OVERLAYS.brasserie_pinceau) E.overlay('brasserie_pinceau', (o, c) => o.f(c));
const peint = (K, x0, y0, z0, x1, y1, z1, m, f) => K.W.box(x0, y0, z0, x1, y1, z1, m, K.W.obj({ type: 'brasserie_pinceau', f }));
const le = c => Math.floor(2 * (c.face === RIGHT ? c.hy : c.hx));
const haut = c => Math.floor(2 * c.hz);

// la mosaïque : des octogones blancs, un cabochon noir à chaque coin, une frise rouge le long des murs
const mosaique = c => {
  if (c.face !== TOP) { rgb(c, 0.40, 0.38, 0.34); return; }
  const x = c.hx, y = c.hy;
  if (x < 2 || y < 2) { rgb(c, 0.46, 0.16, 0.14); if (mod(Math.floor(2 * (x + y)), 4) === 0) rgb(c, 0.70, 0.66, 0.56); grain(c, 0.04); return; }
  const a = mod(Math.floor(2 * x), 6), b = mod(Math.floor(2 * y), 6);
  const coin = (a === 0 || a === 5) && (b === 0 || b === 5);
  if (coin) rgb(c, 0.10, 0.10, 0.11);
  else { rgb(c, 0.74, 0.72, 0.66); if (a === 0 || b === 0) mul(c, 0.84); mul(c, 0.94 + 0.1 * hash(Math.floor(2 * x), Math.floor(2 * y), 831, 0)); }
  grain(c, 0.02);
  const p = fbm(x / 7, y / 7, 832, 2); if (p > 0.7) c.wet = 0.25;
};
// la moleskine : rouge sang de bœuf, capitonnée
const moleskine = c => {
  rgb(c, 0.38, 0.10, 0.09);
  if (c.face === TOP) { mul(c, 1.15); grain(c, 0.05); return; }
  const u = le(c), v = haut(c);
  if (mod(u + (mod(Math.floor(v / 3), 2) ? 2 : 0), 4) === 0 && mod(v, 3) === 1) rgb(c, 0.20, 0.05, 0.05);
  grain(c, 0.05);
};
// un miroir au cadre doré : le reflet chaud de la salle, des traits de lumière en biais
const miroir = (s0, s1, z0, z1) => c => {
  const s = c.face === RIGHT ? c.hy : c.hx, z = c.hz;
  if (c.face === TOP) { rgb(c, 0.4, 0.3, 0.15); return; }
  if (s - s0 < 0.5 || s1 - s < 0.5 || z - z0 < 0.5 || z1 - z < 0.5) { rgb(c, 0.70, 0.54, 0.24); if (mod(Math.floor(2 * (s + z)), 3) === 0) mul(c, 0.8); return; }
  const n = fbm(s / 5, z / 3, 833, 2);
  rgb(c, 0.30 + 0.10 * n, 0.25 + 0.07 * n, 0.21 + 0.05 * n);
  if (mod(Math.floor(2 * (s + z * 0.8)), 13) === 0) rgb(c, 0.46, 0.42, 0.37);
  if (z > z1 - 2.5) mul(c, 1.15);
  c.er = c.cr * 0.18; c.eg = c.cg * 0.16; c.eb = c.cb * 0.14;
};
// un globe d'opaline
const opaline = c => { rgb(c, 0.95, 0.90, 0.78); c.er = 1.0; c.eg = 0.86; c.eb = 0.62; };
// la photo de 1962 : deux rangs de joueurs en maillot rayé, un ballon ; le cadre noir, la date dessous
const ANNEE = E.textBitmap('1962');
const photo = (y0, y1, z0, z1) => c => {
  if (c.face === TOP) { rgb(c, 0.15, 0.12, 0.10); return; }
  const hi = Math.floor(2 * (y1 - c.hy)), vi = Math.floor(2 * (z1 - c.hz)), W2 = 2 * (y1 - y0), H2 = 2 * (z1 - z0);
  if (hi < 1 || hi >= W2 - 1 || vi < 1 || vi >= H2 - 1) { rgb(c, 0.12, 0.10, 0.08); return; }
  const cap = H2 - 8;                                     // la légende, sur le passe-partout
  if (vi >= cap) { rgb(c, 0.80, 0.74, 0.58); if (ANNEE.at(hi - Math.floor((W2 - ANNEE.w) / 2), vi - cap)) rgb(c, 0.22, 0.15, 0.10); return; }
  rgb(c, 0.66, 0.56, 0.40);
  // deux rangs : derrière debout, devant accroupis ; des maillots rayés
  const col = (k, vh) => vi === vh ? (k === 1 ? 'tete' : null) : (vi > vh && vi <= vh + 2 && k !== 2 ? (mod(vi, 2) ? 'raye' : 'clair') : null);
  const p = col(mod(hi - 1, 3), 1) || col(mod(hi, 3), 4);
  if (p === 'tete') rgb(c, 0.28, 0.20, 0.14);
  if (p === 'raye') rgb(c, 0.32, 0.20, 0.15);
  if (p === 'clair') rgb(c, 0.80, 0.72, 0.56);
  if (vi === cap - 1 && Math.abs(hi + 0.5 - W2 / 2) < 1) rgb(c, 0.92, 0.88, 0.78);   // le ballon
  grain(c, 0.05);
};
// l'ardoise du plat du jour, au-dessus du passe-plat
const PLAT = E.textBitmap('PLAT');
const ardoise = (x0, x1, z0, z1) => c => {
  if (c.face === TOP) { rgb(c, 0.25, 0.16, 0.10); return; }
  const h = Math.floor(2 * (c.hx - x0)), v = Math.floor(2 * (z1 - c.hz)), W2 = 2 * (x1 - x0), H2 = 2 * (z1 - z0);
  if (h < 1 || h >= W2 - 1 || v < 1 || v >= H2 - 1) { rgb(c, 0.32, 0.20, 0.11); return; }
  rgb(c, 0.10, 0.13, 0.12);
  if (PLAT.at(h - Math.floor((W2 - PLAT.w) / 2), v - 1)) rgb(c, 0.88, 0.86, 0.78);
  else if (v >= 8 && mod(v, 2) === 0 && h > 2 && h < W2 - 3 && hash(h >> 1, v, 834, 0) < 0.72) rgb(c, 0.70, 0.70, 0.64);
};
// le passe-plat : l'inox, la cuisine qui rougeoit derrière, une casserole, la hotte
const cuisine = c => {
  if (c.face === TOP) { rgb(c, 0.2, 0.2, 0.2); return; }
  const u = Math.floor(2 * c.hx), v = Math.floor(2 * c.hz);           // v : 12 (bas) … 21 (haut)
  rgb(c, 0.10, 0.07, 0.05);
  const g = Math.max(0, 1 - (v - 12) / 9);                             // la lueur des fourneaux, d'en bas
  c.er = 0.55 * g + 0.06; c.eg = 0.26 * g + 0.04; c.eb = 0.08 * g + 0.02;
  if (v >= 19) { rgb(c, 0.26, 0.26, 0.27); c.er = c.eg = c.eb = 0.02; }                      // la hotte
  if (v === 15 || v === 16) { const k = mod(u, 9); if (k >= 2 && k <= 5) { rgb(c, 0.18, 0.18, 0.19); c.er *= 0.25; c.eg *= 0.25; c.eb *= 0.25; } }   // les casseroles
  if (v === 17 && mod(u, 9) === 3) { rgb(c, 0.18, 0.18, 0.19); c.er = c.eg = c.eb = 0.02; }
};
// la caisse, en acajou, à filets dorés
const acajou = c => {
  rgb(c, 0.30, 0.13, 0.08); if (c.face === TOP) { mul(c, 1.15); grain(c, 0.04); return; }
  const v = haut(c); if (v === 1 || v === 8) rgb(c, 0.66, 0.50, 0.22);
  if (mod(le(c), 8) === 0) mul(c, 0.8);
  grain(c, 0.04);
};
// une banquette de moleskine, le dossier contre le mur
function banquette(K, x0, y0, x1, y1, dos) {
  peint(K, x0, y0, 0, x1, y1, 2, K.M.I_SKAI, moleskine);
  if (dos === 'x') peint(K, x0, y0, 2, x0 + 1, y1, 5, K.M.I_SKAI, moleskine);
  else peint(K, x0, y0, 2, x1, y0 + 1, 5, K.M.I_SKAI, moleskine);
}
// une table de bistrot, nappe en papier, pied de fonte
function table(K, x, y, w, d) {
  K.boite(x + Math.floor(w / 2) - 1, y + Math.floor(d / 2) - 1, 0, x + Math.floor(w / 2) + 1, y + Math.floor(d / 2) + 1, 3, K.M.METAL_DARK);
  K.boite(x, y, 3, x + w, y + d, 4, K.M.PAPER);
}
function globe(K, x, y, z, mur) {
  if (mur === 'x') K.boite(0, y, z, 1, y + 1, z + 1, K.M.GOLD); else if (mur === 'y') K.boite(x, 0, z, x + 1, 1, z + 1, K.M.GOLD);
  peint(K, x, y, z + 1, x + 1, y + 1, z + 2, K.M.TUBE, opaline);
  K.lampe(x + 0.5, y + 0.5, z + 1.5, { cache: true, r: 26, c: [1.1, 0.85, 0.55], ombre: false });
}

module.exports = {
  cle: 'brasserie', nom: 'La brasserie du Pont', ambiance: 'bar', personnel: 'commercant2',
  sx: 48, sy: 36, sol: 'TILE_FLOOR',
  murs: { bas: 'PANEL', haut: 'I_MUR_ROSE', coupe: 7, frise: 'WOOD_DARK' },
  porte: { cote: 'y', de: 28, a: 35 },
  build(K) {
    const { M, SX, SY } = K;
    peint(K, 0, 0, -1, SX, SY, 0, M.TILE_FLOOR, mosaique);
    K.boite(-1, -1, 15, SX, 0, 16, M.WOOD_DARK); K.boite(-1, 0, 15, 0, SY, 16, M.WOOD_DARK);      // la corniche

    // ── la banquette en équerre, dans le fond ; les miroirs au-dessus
    banquette(K, 0, 0, 3, 25, 'x');
    banquette(K, 3, 0, 31, 3, 'y');
    peint(K, -1, 1, 7, 0, 9, 14, M.GLASS, miroir(1, 9, 7, 14));
    peint(K, -1, 10, 7, 0, 18, 14, M.GLASS, miroir(10, 18, 7, 14));
    peint(K, -1, 19, 7, 0, 25, 14, M.GLASS, miroir(19, 25, 7, 14));
    peint(K, 3, -1, 7, 12, 0, 14, M.GLASS, miroir(3, 12, 7, 14));
    peint(K, 13, -1, 7, 22, 0, 14, M.GLASS, miroir(13, 22, 7, 14));
    peint(K, 23, -1, 7, 31, 0, 14, M.GLASS, miroir(23, 31, 7, 14));
    globe(K, 1, 9, 11, 'x'); globe(K, 1, 18, 11, 'x'); globe(K, 12, 1, 11, 'y'); globe(K, 22, 1, 11, 'y');
    // les tables le long de la banquette, une chaise en face (posées sur la grille de 40 cm)
    for (const y of [9, 17]) { table(K, 3, y, 4, 4); K.chaise(7, y + 1, { dos: 'x+', mat: M.WOOD_DARK }); }
    for (const x of [11, 19, 27]) { table(K, x, 3, 4, 4); K.chaise(x + 1, 7, { dos: 'y+', mat: M.WOOD_DARK }); }
    // le dîner de Dan Corven : un terrain au stylo sur la nappe, des miettes
    K.voxel(4, 10, 4, M.WHITE); K.voxel(5, 11, 4, M.BOTTLE);
    K.place('clow', 2, 11, { pose: 'assis', regarde: 'droite', pour: 'clow' });
    K.place('table_4', 8, 11, { pose: 'assis', regarde: 'gauche', pour: 'visiteur' });
    K.place('table_3', 2, 19, { pose: 'assis', regarde: 'droite' });
    K.place('table_5', 8, 19, { pose: 'assis', regarde: 'gauche' });
    K.place('table_1', 13, 2, { pose: 'assis', regarde: 'gauche' });
    K.place('table_6', 21, 2, { pose: 'assis', regarde: 'gauche' });
    K.place('table_7', 29, 8, { pose: 'assis', regarde: 'droite' });
    for (const [x, y] of [[12, 4], [21, 5], [28, 4]]) K.voxel(x, y, 4, M.WHITE);
    K.voxel(20, 4, 4, M.I_CARTON);
    K.objet('banquettes', 'Les banquettes', 2, 15, 2, { acces: [5, 15] });

    // ── le passe-plat de la cuisine, et l'ardoise au-dessus
    peint(K, 35, -2, 6, 44, 0, 11, M.METAL, cuisine);
    K.boite(34, 0, 5, 45, 2, 6, M.I_ZINC);
    K.boite(34, 0, 0, 45, 1, 5, M.WOOD_DARK);
    for (const x of [36, 38, 41]) K.voxel(x, 1, 6, M.WHITE);
    peint(K, 36, 0, 10, 43, 1, 11, M.TUBE, c => { rgb(c, 0.9, 0.4, 0.2); c.er = 1.1; c.eg = 0.40; c.eb = 0.14; });   // la lampe chauffante
    K.lampe(39.5, 1.5, 9.5, { cache: true, r: 16, c: [1.2, 0.5, 0.2] });
    peint(K, 35, -1, 11, 44, 0, 17, M.BOARD, ardoise(35, 44, 11, 17));
    K.objet('passe', 'Le passe-plat', 39, 1, 7, { acces: [39, 5] });
    K.objet('ardoise', 'Le plat du jour', 40, 0, 14, { acces: [42, 5] });
    K.place('serveur', 37, 4, { regarde: 'gauche', pour: 'personnel' });
    // la desserte du garçon : les piles d'assiettes, la corbeille de pain
    K.boite(45, 0, 0, 48, 3, 5, M.WOOD_DARK); K.boite(45, 0, 5, 47, 2, 7, M.WHITE); K.voxel(47, 2, 5, M.I_CARTON);

    // ── la caisse près de l'entrée, en acajou ; la photo de 1962 au-dessus
    peint(K, 0, 27, 0, 5, 35, 5, M.WOOD_DARK, acajou);
    K.boite(0, 27, 5, 5, 35, 6, M.WOOD_DARK);
    K.boite(1, 30, 6, 3, 33, 9, M.GOLD);
    K.voxel(3, 28, 6, M.PAPER);
    peint(K, -1, 25, 7, 0, 35, 15, M.WOOD_DARK, photo(25, 35, 7, 15));
    K.lampe(0.5, 30, 15.5, { cache: true, r: 14, c: [1.0, 0.8, 0.5] }); K.voxel(0, 30, 15, M.GOLD);
    K.objet('caisse', 'La caisse', 3, 31, 7, { acces: [7, 32] });
    K.objet('photo_1962', 'L\'équipe de 1962', 0, 30, 12, { acces: [7, 28] });

    // ── deux grandes tables au milieu, nappes en papier, quatre chaises chacune
    for (const [x, y] of [[17, 17], [29, 17]]) {
      table(K, x, y, 6, 4);
      for (const dx of [0, 4]) { K.chaise(x + dx, y - 2, { dos: 'y-', mat: M.WOOD_DARK }); K.chaise(x + dx, y + 4, { dos: 'y+', mat: M.WOOD_DARK }); }
      K.voxel(x + 1, y + 1, 4, M.WHITE); K.voxel(x + 4, y + 2, 4, M.WHITE); K.voxel(x + 2, y + 2, 4, M.I_CARTON);
    }
    K.place('table_2', 18, 16, { pose: 'assis', regarde: 'gauche' });
    K.place('table_8', 22, 22, { pose: 'assis', regarde: 'droite' });
    K.place('table_9', 30, 16, { pose: 'assis', regarde: 'gauche' });
    // le palmier en pot, le portemanteau aux chapeaux
    K.boite(43, 27, 0, 45, 29, 3, M.TERRACOTTA); K.boite(43, 27, 3, 44, 28, 7, M.WOOD_DARK);
    for (const [dx, dy, dz] of [[0, 0, 7], [1, 0, 7], [-1, 0, 7], [0, 1, 7], [0, -1, 7], [2, 0, 6], [-2, 0, 6], [0, 2, 6], [0, -2, 6], [2, 2, 5], [-2, -2, 5], [2, -2, 6], [-2, 2, 6], [0, 0, 8]]) K.voxel(43 + dx, 27 + dy, dz, M.HEDGE);
    K.porteManteau(24, 32);

    // les suspensions au-dessus de la salle
    for (const [x, y] of [[20, 19], [32, 19]]) { K.boite(x, y, 13, x + 1, y + 1, K.H, M.METAL_DARK); peint(K, x, y, 12, x + 1, y + 1, 13, M.TUBE, opaline); K.lampe(x + 0.5, y + 0.5, 12, { cache: true, r: 40, c: [1.15, 0.88, 0.58] }); }
  },
};
