'use strict';
// Le Terminus, le bar des chauffeurs de car : on y boit debout, on y parle peu. Un long comptoir
// usé, un percolateur, deux tubes au plafond dont un mort ; la tablette des chauffeurs sous la
// grande vitre de la gare routière (le car du club garé le jour, le dernier car qui attend la
// nuit) ; le tableau des horaires que personne ne respecte, la petite télé en hauteur, le
// tabouret du bout ; au fond, la porte de l'arrière-salle, marquée PRIVÉ.
const E = require('../engine');
const { TOP, RIGHT, hash, mod, fbm } = E;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const grain = (c, amt, s = 0) => mul(c, 1 + (hash(c.a, c.b, c.face * 7 + s, c.m) - 0.5) * 2 * amt);
if (!E.OVERLAYS.terminus_pinceau) E.overlay('terminus_pinceau', (o, c) => o.f(c));
const peint = (K, x0, y0, z0, x1, y1, z1, m, f) => K.W.box(x0, y0, z0, x1, y1, z1, m, K.W.obj({ type: 'terminus_pinceau', f }));
const le = c => Math.floor(2 * (c.face === RIGHT ? c.hy : c.hx));
const haut = c => Math.floor(2 * c.hz);

// les tomettes délavées, un chemin plus clair de la porte au comptoir, des mégots au pied du zinc
const tomettes = c => {
  if (c.face !== TOP) { rgb(c, 0.36, 0.20, 0.15); return; }
  const a = mod(Math.floor(2 * c.hx), 4), b = mod(Math.floor(2 * c.hy), 4);
  if (a === 0 || b === 0) { rgb(c, 0.27, 0.21, 0.18); return; }
  rgb(c, 0.52, 0.31, 0.23); mul(c, 0.86 + 0.22 * hash(Math.floor(c.hx / 2), Math.floor(c.hy / 2), 821, 0));
  // l'usure : le chemin des chauffeurs
  const use = Math.max(0, 1 - Math.abs(c.hy - 13) / 7) * Math.max(0, 1 - Math.abs(c.hx - 24) / 18);
  if (use > 0) { const k = 1 + 0.25 * use; c.cr *= k; c.cg *= k * 1.06; c.cb *= k * 1.12; }
  if (c.hy > 9.5 && c.hy < 11 && hash(Math.floor(2 * c.hx), Math.floor(2 * c.hy), 822, 0) < 0.05) rgb(c, 0.80, 0.76, 0.62);
  grain(c, 0.05);
};
// l'enduit gris que la fumée a pris : plus jaune en haut, des auréoles au-dessus des tubes
const enduit = c => {
  if (c.face === TOP) { rgb(c, 0.13, 0.10, 0.09); return; }
  const z = c.hz;
  rgb(c, 0.55, 0.53, 0.46); mul(c, 0.92 + 0.12 * fbm(le(c) / 8, z / 5, 823, 3));
  const j = Math.max(0, (z - 8) / 10); c.cr *= 1 - 0.10 * j; c.cg *= 1 - 0.16 * j; c.cb *= 1 - 0.34 * j;
  grain(c, 0.03);
};
// la vitre sur la gare routière : l'abri, le car, les réverbères — de jour, puis de nuit
const VUE = { y0: 12, y1: 28, z0: 6, z1: 14 };
const vue = jour => c => {
  if (c.face === TOP) { rgb(c, 0.2, 0.2, 0.2); return; }
  const h = 2 * (VUE.y1 - c.hy), v = 2 * (c.hz - VUE.z0), W2 = 2 * (VUE.y1 - VUE.y0), H2 = 2 * (VUE.z1 - VUE.z0);
  const hi = Math.floor(h), vi = Math.floor(v);
  // le châssis : un cadre, trois vantaux
  if (hi <= 0 || hi >= W2 - 1 || vi <= 0 || vi >= H2 - 1 || mod(hi, 11) === 0) { rgb(c, 0.40, 0.38, 0.32); return; }
  const car = hi >= 3 && hi <= 27 && vi >= 2 && vi <= 11;
  const roue = vi <= 3 && (Math.hypot(hi - 7.5, vi - 2.5) < 1.6 || Math.hypot(hi - 22.5, vi - 2.5) < 1.6);
  let r, g, b, e;
  if (jour) {
    e = 0.62; r = 0.66; g = 0.74; b = 0.86;                                                    // le ciel
    if (vi < 3) { r = 0.36; g = 0.36; b = 0.36; }                                              // le quai
    if (car) {                                                                                 // le car du club
      r = 0.84; g = 0.80; b = 0.68;
      if (vi === 5 || vi === 6) { r = 0.50; g = 0.12; b = 0.18; }
      if (vi >= 8 && vi <= 10 && mod(hi - 3, 4) !== 0) { r = 0.16; g = 0.20; b = 0.26; }
      if (hi === 27 && vi >= 4) { r = 0.16; g = 0.20; b = 0.26; }
    }
    if (roue) { r = 0.06; g = 0.06; b = 0.06; }
  } else {
    e = 0.5; r = 0.04; g = 0.05; b = 0.11;
    if (vi < 3) { r = 0.07; g = 0.07; b = 0.08; }
    if (car) {                                                                                 // le dernier car, moteur coupé
      r = 0.09; g = 0.09; b = 0.10;
      if (vi >= 8 && vi <= 10 && mod(hi - 3, 4) !== 0) { r = 0.55; g = 0.62; b = 0.42; }
      if (vi === 11 && hi >= 5 && hi <= 12) { r = 1.0; g = 0.60; b = 0.18; }
    }
    if (roue) { r = 0.02; g = 0.02; b = 0.02; }
    if (!car && vi >= 11 && Math.hypot(hi - 29, vi - 13) < 1.3) { r = 1.0; g = 0.66; b = 0.28; }   // un réverbère au sodium
  }
  rgb(c, r * 0.3, g * 0.3, b * 0.3); c.er = r * e; c.eg = g * e; c.eb = b * e;
};
// l'horloge des chauffeurs : un cadran blanc, deux aiguilles
const cadran = c => {
  rgb(c, 0.82, 0.80, 0.74);
  if (c.face === TOP) { rgb(c, 0.2, 0.2, 0.22); return; }
  const u = le(c) - 42, v = haut(c) - 28, d = Math.hypot(u - 2.5, v - 2.5);
  if (d > 3.1) { rgb(c, 0.55, 0.50, 0.40); return; }
  if (d > 2.6) rgb(c, 0.15, 0.15, 0.16);
  if ((u === 2 && v >= 2 && v <= 4) || (v === 2 && u >= 2 && u <= 3)) rgb(c, 0.08, 0.08, 0.08);
};
// le tableau des horaires : DÉPARTS, des lignes, des heures
const horaires = c => {
  rgb(c, 0.80, 0.78, 0.70);
  if (c.face === TOP) { rgb(c, 0.3, 0.3, 0.3); return; }
  const u = le(c) - 66, v = 27 - haut(c);
  if (u <= 0 || u >= 13 || v <= 0 || v >= 15) { rgb(c, 0.20, 0.30, 0.44); return; }            // le cadre bleu de la compagnie
  if (v >= 1 && v <= 3) { rgb(c, 0.20, 0.30, 0.44); return; }                                   // le bandeau
  if (mod(v, 2) === 1 && (mod(u, 6) !== 0) && hash(u >> 1, v, 824, 0) < 0.8) rgb(c, 0.18, 0.18, 0.20);
  if (mod(v, 2) === 1 && u >= 9 && u <= 11) rgb(c, 0.55, 0.12, 0.12);
};
// le percolateur : chrome, un manomètre, deux becs
const perco = c => {
  rgb(c, 0.62, 0.63, 0.64); if (c.face === TOP) mul(c, 1.1);
  if (c.face !== TOP && haut(c) === 5 && mod(le(c), 6) === 2) rgb(c, 0.86, 0.84, 0.76);
  grain(c, 0.06);
};
// la porte de l'arrière-salle : bois brun, une plaque, une poignée
const portePrivee = c => {
  rgb(c, 0.27, 0.18, 0.11); if (mod(le(c), 6) === 0) mul(c, 0.8);
  if (c.face === TOP) return;
  const v = haut(c), u = le(c);
  if (v === 9 && (u === 10 || u === 9)) rgb(c, 0.72, 0.62, 0.30);
  grain(c, 0.05);
};

module.exports = {
  cle: 'terminus', nom: 'Le Terminus', ambiance: 'bar', personnel: 'commercant2',
  sx: 40, sy: 30, sol: 'I_TOMETTE',
  murs: { bas: 'BRICK', haut: 'I_MUR_GRIS', coupe: 7, frise: 'WOOD_DARK' },
  porte: { cote: 'x', de: 18, a: 25 },
  build(K) {
    const { M, SX, SY } = K;
    peint(K, 0, 0, -1, SX, SY, 0, M.I_TOMETTE, tomettes);
    peint(K, -2, -2, 8, SX, 0, K.H, M.I_MUR_GRIS, enduit);
    peint(K, -2, 0, 8, 0, SY, K.H, M.I_MUR_GRIS, enduit);

    // ── le comptoir, le long du mur du fond ; on passe derrière par les deux bouts
    K.comptoir(10, 6, 33, 9, { mat: M.WOOD_DARK });
    K.boite(10, 9, 0, 33, 10, 1, M.METAL_DARK);                                  // le repose-pieds
    K.boite(10, 0, 0, 30, 1, 4, M.WOOD_DARK); K.boite(10, 0, 4, 30, 1, 5, M.I_ZINC);
    K.etagere(12, 0, 29, 1, 7, 13, M.I_BOUTEILLES);
    peint(K, 14, 0, 5, 18, 2, 9, M.METAL, perco);
    K.voxel(20, 7, 5, M.WHITE); K.voxel(26, 8, 5, M.WHITE); K.voxel(27, 7, 5, M.PAPER);
    K.caisse(30, 6);
    K.place('patron', 21, 3, { regarde: 'gauche', pour: 'personnel' });
    K.place('comptoir_1', 19, 12, { regarde: 'droite' });
    K.place('comptoir_2', 24, 12, { regarde: 'droite' });
    K.place('comptoir_3', 28, 12, { regarde: 'droite' });
    K.objet('comptoir', 'Le comptoir', 22, 8, 5, { acces: [22, 12] });
    // le tabouret du bout, où l'on s'assoit seul
    K.boite(12, 11, 0, 13, 12, 2, M.WOOD_DARK); K.boite(11, 10, 2, 13, 12, 3, M.WOOD);
    K.objet('tabouret', 'Le tabouret du bout', 12, 11, 3, { acces: [15, 13] });
    K.place('bertrand', 12, 11, { pose: 'assis', regarde: 'droite', pour: 'bertrand_rance' });
    // l'horloge des chauffeurs, au-dessus du zinc
    peint(K, 21, 0, 14, 24, 1, 17, M.WHITE, cadran);

    // ── la petite télé, en hauteur, au bout du comptoir
    K.boite(4, 0, 10, 9, 3, 11, M.WOOD_DARK);
    K.tele(5, 0, { z: 11, sens: 'y' });
    K.objet('tele', 'La petite télé', 6, 2, 13, { acces: [7, 9] });

    // ── la porte de l'arrière-salle, au fond à gauche, PRIVÉ
    peint(K, 0, 2, 0, 1, 7, 10, M.WOOD_DARK, portePrivee);
    K.boite(0, 1, 0, 1, 2, 11, M.WOOD); K.boite(0, 7, 0, 1, 8, 11, M.WOOD); K.boite(0, 2, 10, 1, 7, 11, M.WOOD);
    K.enseigneX(1, 15, 'PRIVÉ', { fg: [0.62, 0.14, 0.12], plate: null, depth: 0, padX: 0, padY: 0 });
    K.objet('porte_service', 'La porte de l\'arrière-salle', 1, 4, 5, { acces: [4, 5] });
    K.place('norbert', 4, 9, { regarde: 'droite', pour: 'norbert' });

    // ── la grande vitre sur la gare routière, et la tablette où l'on boit debout
    peint(K, -2, VUE.y0, VUE.z0, 0, VUE.y1, VUE.z1, M.GLASS, vue(K.jour));
    K.boite(0, VUE.y0, 5, 2, VUE.y1, 6, M.WOOD);
    for (const y of [14, 25]) K.boite(0, y, 3, 1, y + 1, 5, M.METAL_DARK);
    K.voxel(1, 16, 6, M.WHITE); K.voxel(1, 22, 6, M.WHITE);
    if (K.jour) K.W.light({ x: 4, y: 20, z: 10, r: 30, cr: 0.35, cg: 0.38, cb: 0.42, shadow: false });
    else K.W.light({ x: 3, y: 22, z: 9, r: 18, cr: 0.35, cg: 0.22, cb: 0.10, shadow: false });
    K.place('tablette_1', 3, 16, { regarde: 'gauche' });
    K.place('tablette_2', 3, 22, { regarde: 'gauche' });
    K.place('visiteur', 4, 19, { regarde: 'droite', pour: 'visiteur' });

    // ── le tableau des horaires, près de la porte
    peint(K, 33, 0, 6, 40, 1, 14, M.WHITE, horaires);
    K.objet('horaires', 'Les horaires des cars', 36, 1, 10, { acces: [36, 7] });
    // le calendrier de la compagnie, le portemanteau avec une veste de chauffeur
    K.afficheY(34, 15, 3, 2, { bg: [0.20, 0.30, 0.44], fg: [0.86, 0.82, 0.70] });
    K.boite(38, 26, 0, 39, 27, 9, M.WOOD_DARK); K.boite(37, 25, 6, 39, 28, 8, M.CAR_BLUE);
    // le cendrier sur pied, à côté de la porte
    K.boite(36, 15, 0, 37, 16, 4, M.METAL_DARK); K.boite(35, 14, 4, 38, 17, 5, M.METAL);

    // deux mange-debout : on boit debout, on parle peu
    for (const [x, y] of [[18, 18], [27, 22]]) { K.table(x, y, 3, 3, { h: 5, pied: 'central', mat: M.WOOD }); K.voxel(x + 1, y + 1, 5, M.WHITE); }
    K.place('debout_1', 17, 22, { regarde: 'droite' });
    K.place('debout_2', 31, 24, { regarde: 'gauche' });
    // la lumière : deux tubes au plafond, l'un mort ; une ampoule au-dessus de la caisse
    K.neon(14, 13, 24, 14, 16, M.TUBE, { c: [0.85, 0.98, 0.85], r: 58 });
    K.boite(28, 13, 16, 36, 14, 17, M.PLASTIC_WHITE);
    for (const x of [15, 23, 29, 35]) K.voxel(x, 13, 17, M.METAL_DARK);
    K.lampe(30, 3, 14, { r: 22, c: [1.2, 0.85, 0.45] });
  },
};
