'use strict';
// L'arrière-salle du Terminus : la table ronde au tapis vert taché sous sa lampe à abat-jour vert,
// basse, qui laisse le reste dans le noir ; les jetons, les cartes, les billets sous le cendrier ;
// le donneur dos au mur, sa caisse derrière lui ; le bar de fortune, une planche sur deux tonneaux ;
// au mur, les ardoises des habitués, chacune à son clou ; des casiers de bouteilles, la fumée qui
// a jauni le plâtre, une petite fenêtre grillagée sur la cour.
const E = require('../engine');
const { TOP, RIGHT, hash, mod, fbm } = E;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const grain = (c, amt, s = 0) => mul(c, 1 + (hash(c.a, c.b, c.face * 7 + s, c.m) - 0.5) * 2 * amt);
if (!E.OVERLAYS.tripot_pinceau) E.overlay('tripot_pinceau', (o, c) => o.f(c));
const peint = (K, x0, y0, z0, x1, y1, z1, m, f) => K.W.box(x0, y0, z0, x1, y1, z1, m, K.W.obj({ type: 'tripot_pinceau', f }));
const le = c => Math.floor(2 * (c.face === RIGHT ? c.hy : c.hx));
const haut = c => Math.floor(2 * c.hz);

// LA TABLE : centre, rayon ; ce qui est posé sur le tapis (peint à plat : cartes, jetons, billets)
const TX = 13, TY = 14, TR = 4.3;
const JETONS = [[10.2, 13.6, 0.75, 0.15, 0.15], [10.6, 14.6, 0.85, 0.82, 0.75], [15.6, 14.2, 0.20, 0.30, 0.65], [15.2, 13.2, 0.75, 0.15, 0.15], [15.9, 15.1, 0.12, 0.12, 0.12], [12.8, 11.0, 0.85, 0.82, 0.75]];
const CARTES = [[11.2, 15.4], [11.8, 15.6], [14.3, 12.0], [14.8, 11.9], [13.2, 13.4]];
const tapis = c => {
  if (c.face !== TOP) { rgb(c, 0.20, 0.12, 0.07); grain(c, 0.05); return; }
  const dx = c.hx - TX, dy = c.hy - TY, d = Math.hypot(dx, dy);
  if (d > TR - 0.9) { rgb(c, 0.26, 0.15, 0.08); if (mod(Math.floor(2 * (Math.atan2(dy, dx) * 3)), 2)) mul(c, 0.88); grain(c, 0.05); return; }
  rgb(c, 0.11, 0.33, 0.17); grain(c, 0.06);
  // les taches : un verre renversé, la cendre
  const t = fbm(c.hx / 1.6 + 7, c.hy / 1.6, 811, 2); if (t > 0.66) mul(c, 0.72);
  // les billets sous le cendrier, en éventail
  if (c.hx > 13.6 && c.hx < 15.4 && c.hy > 16.0 && c.hy < 17.4) { rgb(c, 0.62, 0.48, 0.52); if (mod(Math.floor(2 * c.hx + c.hy), 3) === 0) rgb(c, 0.52, 0.56, 0.42); }
  for (const [x, y] of CARTES) if (Math.abs(c.hx - x) < 0.5 && Math.abs(c.hy - y) < 0.7) { rgb(c, 0.86, 0.84, 0.78); if (Math.abs(c.hx - x) < 0.15) rgb(c, 0.7, 0.15, 0.15); }
  for (const [x, y, r, g, b] of JETONS) if (Math.hypot(c.hx - x, c.hy - y) < 0.55) { rgb(c, r, g, b); if (Math.hypot(c.hx - x, c.hy - y) < 0.22) mul(c, 1.3); }
};
// le cendrier de verre épais, plein de mégots, une cigarette qui se consume
const cendrier = c => {
  rgb(c, 0.62, 0.66, 0.64);
  if (c.face !== TOP) { if (Math.floor(2 * c.hz) === 8) rgb(c, 0.46, 0.50, 0.48); return; }
  const u = Math.floor(4 * (c.hx - 14)), v = Math.floor(4 * (c.hy - 16));
  if (u >= 1 && u <= 2 && v >= 1 && v <= 2) rgb(c, 0.22, 0.20, 0.18);
  if (u === 2 && v === 1) rgb(c, 0.84, 0.80, 0.70);
  if (u === 3 && v === 2) { rgb(c, 1.0, 0.5, 0.2); c.er = 0.9; c.eg = 0.35; c.eb = 0.1; }
};
// l'abat-jour d'émail vert, son bord qui luit
const abatJour = c => {
  rgb(c, 0.12, 0.30, 0.18); grain(c, 0.05);
  if (c.face === TOP) { mul(c, 1.2); return; }
  c.er = 0.05; c.eg = 0.16; c.eb = 0.08;
  if (Math.floor(2 * c.hz) === 16) { rgb(c, 0.8, 0.75, 0.5); c.er = 0.55; c.eg = 0.50; c.eb = 0.28; }
};
// les murs que la fumée a jaunis, plus foncés vers le haut ; une coulure d'humidité
const platreJauni = c => {
  if (c.face === TOP) { rgb(c, 0.13, 0.10, 0.09); return; }
  const z = c.hz, n = fbm(le(c) / 9, z / 4, 812, 3);
  rgb(c, 0.47, 0.44, 0.36);
  mul(c, 1.02 - 0.30 * Math.max(0, (z - 9) / 9) - 0.18 * Math.max(0, n - 0.5));
  c.cg *= 0.97; c.cb *= 0.86;
  grain(c, 0.04);
};
// le béton : des auréoles de bière, des mégots
const betonSale = c => {
  if (c.face !== TOP) { rgb(c, 0.30, 0.29, 0.28); return; }
  rgb(c, 0.36, 0.35, 0.33); mul(c, 0.9 + 0.18 * fbm(c.hx / 6, c.hy / 6, 813));
  if (fbm(c.hx / 2.5 + 3, c.hy / 2.5, 814, 2) > 0.68) mul(c, 0.78);
  const h = hash(Math.floor(2 * c.hx), Math.floor(2 * c.hy), 815, 0);
  if (h < 0.004) rgb(c, 0.78, 0.74, 0.62); else if (h < 0.006) rgb(c, 0.55, 0.32, 0.12);
  grain(c, 0.05);
};
// une ardoise d'habitué : des noms et des chiffres à la craie
const ardoise = seed => c => {
  rgb(c, 0.13, 0.14, 0.14);
  if (c.face === TOP) { rgb(c, 0.30, 0.20, 0.12); return; }
  const u = le(c), v = haut(c);
  if (mod(v, 2) === 1 && hash(u, v, 816, seed) < 0.55) rgb(c, 0.70, 0.70, 0.64);
};
// la caisse du donneur : tôle verte, une serrure de laiton
const caisse = c => {
  rgb(c, 0.16, 0.27, 0.20); grain(c, 0.05);
  if (c.face === TOP) { mul(c, 1.15); if (Math.abs(c.hx - 13.5) < 0.6 && Math.abs(c.hy - 2) < 0.3) rgb(c, 0.4, 0.4, 0.4); return; }
  if (c.face !== RIGHT && Math.floor(2 * c.hx) === 27 && haut(c) === 9) rgb(c, 0.85, 0.66, 0.24);
};
// un tonneau : des douelles et deux cercles de fer
const tonneau = c => {
  if (c.face === TOP) { rgb(c, 0.30, 0.19, 0.11); grain(c, 0.06); return; }
  rgb(c, 0.36, 0.22, 0.12); if (mod(le(c), 3) === 0) mul(c, 0.75);
  const v = haut(c); if (v === 2 || v === 7) rgb(c, 0.18, 0.18, 0.19);
  grain(c, 0.05);
};
// la fenêtre de la cour : verre dépoli derrière une grille
const vitreCour = jour => c => {
  if (c.face === TOP) { rgb(c, 0.2, 0.2, 0.2); return; }
  const u = le(c), v = haut(c);
  if (mod(u, 3) === 0 || mod(v, 3) === 0) { rgb(c, 0.10, 0.10, 0.11); return; }
  if (jour) { rgb(c, 0.55, 0.58, 0.55); c.er = 0.30; c.eg = 0.33; c.eb = 0.32; }
  else { rgb(c, 0.06, 0.07, 0.10); c.er = 0.02; c.eg = 0.03; c.eb = 0.06; }
};

module.exports = {
  cle: 'tripot', nom: 'L\'arrière-salle du Terminus', ambiance: 'nuit',
  sx: 32, sy: 28, sol: 'I_BETON',
  murs: { bas: 'BRICK_OLD', haut: 'I_MUR_GRIS', coupe: 8 },
  porte: { cote: 'y', de: 20, a: 27 },
  build(K) {
    const { M, SX, SY } = K;
    peint(K, 0, 0, -1, SX, SY, 0, M.I_BETON, betonSale);
    peint(K, -2, -2, 8, SX, 0, K.H, M.I_MUR_GRIS, platreJauni);
    peint(K, -2, 0, 8, 0, SY, K.H, M.I_MUR_GRIS, platreJauni);

    // ── la table ronde, son pied, le tapis ; quatre chaises autour
    K.boite(TX - 1, TY - 1, 0, TX + 1, TY + 1, 3, M.WOOD_DARK);
    for (let y = Math.floor(TY - TR); y <= TY + TR; y++) for (let x = Math.floor(TX - TR); x <= TX + TR; x++) {
      if (Math.hypot(x + 0.5 - TX, y + 0.5 - TY) < TR) peint(K, x, y, 3, x + 1, y + 1, 4, M.I_DRAP, tapis);
    }
    // les piles de jetons, et le cendrier sur ses billets
    K.boite(15, 13, 4, 16, 14, 5, M.PLASTIC_RED); K.voxel(10, 14, 4, M.WHITE);
    peint(K, 14, 16, 4, 15, 17, 5, M.GLASS, cendrier);
    K.chaise(12, 6, { dos: 'y-' });
    K.chaise(5, 13, { dos: 'x-' });
    K.chaise(20, 13, { dos: 'x+' });
    K.chaise(12, 21, { dos: 'y+' });
    K.place('donneur', 13, 7, { pose: 'assis', regarde: 'gauche', pour: 'personnel' });
    K.place('joueur_1', 6, 14, { pose: 'assis', regarde: 'droite' });
    K.place('joueur_2', 21, 14, { pose: 'assis', regarde: 'gauche' });
    K.place('joueur_3', 13, 22, { pose: 'assis', regarde: 'droite', pour: 'visiteur' });
    K.objet('table_jeu', 'La table ronde', 12, 13, 4, { acces: [18, 19] });
    K.objet('cendrier', 'Le cendrier aux billets', 14, 16, 5, { acces: [8, 20] });
    // la lampe, basse, son abat-jour vert ; un cône de lumière, le reste dans l'ombre
    K.boite(TX, TY, 9, TX + 1, TY + 1, K.H, M.METAL_DARK);
    peint(K, TX - 1, TY - 1, 8, TX + 2, TY + 2, 9, M.METAL_GREEN, abatJour);
    K.W.light({ x: TX + 0.5, y: TY + 0.5, z: 7.6, r: 26, fall: 1.2, cr: 1.3, cg: 1.18, cb: 0.62, axis: [0, 0, -1], c0: 0.30, c1: 0.72, spill: 0.16, skip: 1.2, shadow: true });
    // ce que la lampe renvoie sur les murs, et la fumée qui la diffuse
    K.W.light({ x: TX + 0.5, y: TY + 0.5, z: 14, r: 34, fall: 1.6, cr: 0.20, cg: 0.19, cb: 0.12, shadow: false });

    // ── derrière le donneur : sa caisse, sur un petit meuble
    K.boite(11, 0, 0, 16, 3, 4, M.WOOD_DARK);
    peint(K, 12, 1, 4, 15, 3, 6, M.METAL_GREEN, caisse);
    K.objet('caisse', 'La caisse du donneur', 13, 2, 6, { acces: [17, 4] });

    // ── le bar de fortune : une planche sur deux tonneaux, contre le mur du fond
    peint(K, 20, 3, 0, 23, 6, 4, M.WOOD_DARK, tonneau);
    peint(K, 27, 3, 0, 30, 6, 4, M.WOOD_DARK, tonneau);
    K.boite(19, 3, 4, 31, 6, 5, M.WOOD);
    K.voxel(21, 4, 5, M.BOTTLE); K.voxel(22, 4, 5, M.BOTTLE); K.voxel(25, 5, 5, M.WHITE); K.voxel(26, 5, 5, M.WHITE);
    K.etagere(20, 0, 31, 1, 9, 13, M.I_BOUTEILLES);
    K.boite(28, 0, 0, 31, 2, 3, M.CRATE_RED); K.boite(28, 0, 3, 31, 2, 5, M.CRATE_GREEN);
    K.lampe(25, 2, 14, { r: 26, c: [1.2, 0.85, 0.45] });
    K.boite(25, 2, 15, 26, 3, K.H, M.METAL_DARK);
    K.objet('bar', 'Le bar de fortune', 25, 5, 5, { acces: [25, 9] });
    K.place('bar_1', 23, 9, { regarde: 'droite' });

    // ── le mur de gauche : les ardoises des habitués, chacune à son clou
    let y = 3;
    for (const [w, s] of [[3, 1], [2, 2], [4, 3], [2, 4], [3, 5], [2, 6]]) {
      peint(K, 0, y, 9 + (s % 2), 1, y + w, 12 + (s % 2), M.BOARD, ardoise(s));
      K.voxel(0, y + Math.floor(w / 2), 13 + (s % 2), M.METAL);
      y += w + 1;
    }
    K.place('mur', 2, 10, { regarde: 'droite' });
    // le calendrier d'une autre année, des casiers vides, le portemanteau, les chaises empilées
    K.afficheX(25, 9, 3, 4, { bg: [0.70, 0.64, 0.50], fg: [0.42, 0.10, 0.16], title: '86', torn: 0.12 });
    K.boite(1, 24, 0, 4, 27, 2, M.CRATE_GREEN); K.boite(1, 24, 2, 4, 27, 4, M.CRATE_RED);
    K.porteManteau(2, 20);
    for (let k = 0; k < 3; k++) K.boite(27, 21 + k % 2, k * 2, 30, 23 + k % 2, k * 2 + 1, M.WOOD_DARK);
    K.boite(27, 21, 0, 28, 23, 6, M.WOOD_DARK);
    // la petite fenêtre grillagée sur la cour
    peint(K, 4, -2, 12, 9, 0, 15, M.GLASS, vitreCour(K.jour));
    K.place('spectateur', 23, 17, { regarde: 'gauche' });
    // l'ampoule nue près de la porte
    K.lampe(23, 25, 14, { r: 24, c: [1.0, 0.75, 0.42] }); K.boite(23, 25, 15, 24, 26, K.H, M.METAL_DARK);
  },
};
