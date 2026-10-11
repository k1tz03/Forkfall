'use strict';
// Le café de la Mairie : le formica et la grande vitre sur la place. Les conseillers au comptoir,
// devant le miroir et ses bouteilles ; la mairie en face, son horloge, le platane, la toile du store
// en haut de la vitre ; les tables jaunes et leurs chaises de skaï rouge ; au fond, contre la vitre,
// la table du ministère, deux tasses, toujours deux ; les journaux du jour sur leurs baguettes ; le
// flipper, la télé du fond.
const E = require('../engine');
const { TOP, RIGHT, hash, mod, fbm } = E;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const grain = (c, amt, s = 0) => mul(c, 1 + (hash(c.a, c.b, c.face * 7 + s, c.m) - 0.5) * 2 * amt);
if (!E.OVERLAYS.cafe_mairie_pinceau) E.overlay('cafe_mairie_pinceau', (o, c) => o.f(c));
const peint = (K, x0, y0, z0, x1, y1, z1, m, f) => K.W.box(x0, y0, z0, x1, y1, z1, m, K.W.obj({ type: 'cafe_mairie_pinceau', f }));
const le = c => Math.floor(2 * (c.face === RIGHT ? c.hy : c.hx));
const haut = c => Math.floor(2 * c.hz);

// la vitre sur la place : la mairie en face, son horloge, le platane, le store du café en haut
const V = { y0: 5, y1: 27, z0: 5, z1: 15 };
const vue = jour => c => {
  if (c.face === TOP) { rgb(c, 0.2, 0.2, 0.2); return; }
  const hi = Math.floor(2 * (V.y1 - c.hy)), vi = Math.floor(2 * (c.hz - V.z0)), W2 = 2 * (V.y1 - V.y0), H2 = 2 * (V.z1 - V.z0);
  if (hi <= 0 || hi >= W2 - 1 || vi <= 0 || mod(hi, 15) === 0) { rgb(c, 0.30, 0.20, 0.12); c.er = c.eg = c.eb = 0; return; }   // le châssis de bois
  let r, g, b, e;
  const store = vi >= H2 - 3;                                                    // la toile du store, rayée vert et crème
  const mairie = hi >= 12 && hi <= 34 && vi >= 4 && vi <= 15;
  const fronton = hi >= 19 && hi <= 27 && vi >= 16 - Math.abs(hi - 23) * 0 && vi <= 16;
  const horloge = Math.hypot(hi - 23, vi - 13.5) < 1.6;
  const fenetre = mairie && vi >= 5 && vi <= 12 && mod(hi - 13, 4) < 2 && mod(vi - 5, 5) < 3;
  const platane = Math.hypot(hi - 6, (vi - 11) * 1.2) < 5.2 && vi >= 7;
  const tronc = hi >= 5 && hi <= 6 && vi < 8;
  if (jour) {
    e = 0.6; r = 0.62; g = 0.72; b = 0.86;                                       // le ciel
    if (vi < 4) { r = 0.52; g = 0.50; b = 0.46; if (mod(hi + vi, 4) === 0) mul(c, 1); }              // les pavés de la place
    if (mairie || fronton) { r = 0.80; g = 0.74; b = 0.60; if (vi === 4 || vi === 9) { r = 0.70; g = 0.64; b = 0.50; } }
    if (fenetre) { r = 0.30; g = 0.36; b = 0.44; }
    if (horloge) { r = 0.95; g = 0.93; b = 0.86; if (hi === 23 || vi === 13) { r = 0.1; g = 0.1; b = 0.1; } }
    if (tronc) { r = 0.40; g = 0.36; b = 0.28; }
    if (platane) { r = 0.30; g = 0.44; b = 0.20; if (hash(hi, vi, 841, 0) < 0.3) { r = 0.42; g = 0.54; b = 0.26; } }
  } else {
    e = 0.55; r = 0.04; g = 0.05; b = 0.12;
    if (vi < 4) { r = 0.12; g = 0.09; b = 0.07; }
    if (mairie || fronton) { r = 0.42; g = 0.30; b = 0.16; if (vi === 4 || vi === 9) { r = 0.34; g = 0.24; b = 0.13; } }   // éclairée d'en bas
    if (fenetre) { r = 0.05; g = 0.06; b = 0.10; if (hi >= 25 && hi <= 26 && vi >= 10) { r = 0.95; g = 0.78; b = 0.42; } }
    if (horloge) { r = 1.0; g = 0.92; b = 0.70; if (hi === 23 || vi === 13) { r = 0.2; g = 0.15; b = 0.1; } }
    if (tronc) { r = 0.06; g = 0.06; b = 0.05; }
    if (platane) { r = 0.04; g = 0.07; b = 0.04; }
    if (Math.hypot(hi - 38, vi - 9) < 1.2) { r = 1.0; g = 0.66; b = 0.28; }      // le réverbère
  }
  if (store) { const k = mod(Math.floor(hi / 3), 2); r = k ? 0.20 : 0.78; g = k ? 0.36 : 0.74; b = k ? 0.26 : 0.62; e = jour ? 0.35 : 0.08; }
  rgb(c, r * 0.3, g * 0.3, b * 0.3); c.er = r * e; c.eg = g * e; c.eb = b * e;
};
// le miroir du comptoir : un reflet sombre et doré, des traits de lumière
const miroir = c => {
  if (c.face === TOP) { rgb(c, 0.4, 0.3, 0.15); return; }
  const s = c.hx, z = c.hz;
  rgb(c, 0.26, 0.24, 0.21); mul(c, 0.9 + 0.2 * fbm(s / 4, z / 3, 842, 2));
  if (mod(Math.floor(2 * (s - z * 0.9)), 13) === 0) rgb(c, 0.48, 0.45, 0.40);
  c.er = c.cr * 0.2; c.eg = c.cg * 0.18; c.eb = c.cb * 0.15;
};
// le formica jaune des tables, le jonc d'alu
const formica = c => {
  if (c.face !== TOP) { rgb(c, 0.62, 0.63, 0.64); grain(c, 0.04); return; }
  rgb(c, 0.82, 0.70, 0.32); if (hash(Math.floor(2 * c.hx), Math.floor(2 * c.hy), 843, 0) < 0.08) mul(c, 0.9);
};
// le devant du comptoir : formica crème à filets bordeaux
const devantComptoir = c => {
  if (c.face === TOP) { rgb(c, 0.5, 0.45, 0.35); return; }
  rgb(c, 0.76, 0.70, 0.56); const v = haut(c);
  if (v === 1 || v === 7) rgb(c, 0.46, 0.12, 0.16);
  if (v === 0) rgb(c, 0.35, 0.30, 0.25);
  grain(c, 0.03);
};
// le skaï rouge des chaises
const skaiRouge = c => { rgb(c, 0.56, 0.14, 0.12); if (c.face === TOP) mul(c, 1.15); grain(c, 0.06); };
// les journaux du jour, pliés sur leurs baguettes : des colonnes, un gros titre
const journal = (seed) => c => {
  rgb(c, 0.80, 0.78, 0.70);
  if (c.face === TOP) return;
  const u = le(c), v = haut(c);
  if (mod(v, 2) === 0 && mod(u, 3) !== 0 && hash(u, v, 844, seed) < 0.75) rgb(c, 0.42, 0.42, 0.40);
  if (v >= 21 && v <= 22) rgb(c, seed % 2 ? 0.20 : 0.46, 0.14, seed % 2 ? 0.16 : 0.12);
};
// une chaise de café : le tube chromé, l'assise et le dossier de skaï rouge
function chaise(K, x, y, dos) {
  K.boite(x, y, 0, x + 2, y + 2, 1, K.M.CHROME);
  peint(K, x, y, 1, x + 2, y + 2, 2, K.M.I_SKAI, skaiRouge);
  const [a, b, c, d] = dos === 'x-' ? [x, y, x + 1, y + 2] : dos === 'x+' ? [x + 1, y, x + 2, y + 2] : dos === 'y-' ? [x, y, x + 2, y + 1] : [x, y + 1, x + 2, y + 2];
  K.boite(a, b, 2, c, d, 3, K.M.CHROME);
  peint(K, a, b, 3, c, d, 5, K.M.I_SKAI, skaiRouge);
}
// une plante verte en pot : un caoutchouc
function plante(K, x, y) {
  K.boite(x, y, 0, x + 2, y + 2, 2, K.M.TERRACOTTA); K.boite(x, y, 2, x + 1, y + 1, 5, K.M.WOOD_DARK);
  for (const [dx, dy, dz] of [[0, 0, 5], [1, 0, 6], [-1, 0, 5], [0, 1, 7], [0, -1, 6], [1, 1, 5], [-1, 1, 6], [1, -1, 7], [0, 0, 7], [-1, -1, 7], [0, 0, 8]]) K.voxel(x + dx, y + dy, dz, K.M.HEDGE);
}
function table(K, x, y, w, d) {
  K.boite(x + Math.floor(w / 2), y + Math.floor(d / 2), 0, x + Math.floor(w / 2) + 1, y + Math.floor(d / 2) + 1, 3, K.M.CHROME);
  peint(K, x, y, 3, x + w, y + d, 4, K.M.I_FORMICA, formica);
}

module.exports = {
  cle: 'cafe_mairie', nom: 'Le café de la Mairie', ambiance: 'bar', personnel: 'commercant',
  sx: 42, sy: 32, sol: 'I_TOMETTE',
  murs: { bas: 'WOOD_DARK', haut: 'I_MUR_OCRE', coupe: 7, frise: 'WOOD' },
  porte: { cote: 'x', de: 20, a: 27 },
  build(K) {
    const { M } = K;

    // ── la grande vitre sur la place, le long du mur de gauche
    peint(K, -2, V.y0, V.z0, 0, V.y1, V.z1, M.GLASS, vue(K.jour));
    K.boite(0, V.y0 - 1, V.z0 - 1, 1, V.y1 + 1, V.z0, M.WOOD);
    if (K.jour) K.W.light({ x: 6, y: 16, z: 10, r: 40, cr: 0.40, cg: 0.42, cb: 0.45, shadow: false });
    K.objet('vitre', 'La vitre sur la place', 0, 16, 10, { acces: [3, 14] });
    // la table du ministère, au fond contre la vitre : deux tasses, toujours deux
    table(K, 3, 7, 4, 4);
    chaise(K, 1, 7, 'x-'); chaise(K, 7, 9, 'x+');
    K.voxel(4, 8, 4, M.WHITE); K.voxel(5, 9, 4, M.WHITE);
    K.place('fardelli', 2, 8, { pose: 'assis', regarde: 'droite', pour: 'fardelli' });
    K.place('sauvan', 8, 10, { pose: 'assis', regarde: 'gauche', pour: 'sauvan' });
    // deux autres tables le long de la vitre
    for (const y of [15, 21]) { table(K, 3, y, 4, 4); chaise(K, 1, y, 'x-'); chaise(K, 7, y + 2, 'x+'); }
    K.voxel(4, 16, 4, M.WHITE); K.voxel(5, 22, 4, M.PAPER);
    K.place('table_3', 2, 16, { pose: 'assis', regarde: 'droite' });
    K.place('table_1', 8, 18, { pose: 'assis', regarde: 'gauche' });
    K.place('table_4', 2, 22, { pose: 'assis', regarde: 'droite' });
    K.place('table_2', 8, 24, { pose: 'assis', regarde: 'gauche', pour: 'visiteur' });

    // ── le comptoir, le long du mur du fond : le miroir, les bouteilles, la machine à café
    peint(K, 13, 6, 0, 33, 9, 4, M.WOOD_DARK, devantComptoir);
    K.boite(13, 6, 4, 33, 9, 5, M.I_ZINC);
    K.boite(13, 0, 0, 33, 2, 4, M.WOOD_DARK); K.boite(13, 0, 4, 33, 2, 5, M.I_FORMICA);
    peint(K, 14, -1, 6, 32, 0, 14, M.GLASS, miroir);
    K.boite(13, 0, 6, 33, 1, 14, M.WOOD_DARK); K.boite(14, 0, 6, 32, 1, 14, 0);
    K.boite(14, 0, 8, 32, 2, 9, M.GLASS); K.boite(14, 0, 11, 32, 2, 12, M.GLASS);
    K.bouteilles(15, 0, 21, 1, 9); K.bouteilles(24, 0, 31, 1, 9); K.bouteilles(16, 0, 30, 1, 12);
    K.boite(21, 0, 5, 24, 2, 8, M.CHROME); K.voxel(22, 2, 6, M.METAL_DARK);
    K.caisse(30, 6);
    for (const x of [17, 19, 26]) K.voxel(x, 7, 5, M.WHITE);
    K.place('patron', 22, 3, { regarde: 'gauche', pour: 'personnel' });
    K.place('comptoir_1', 17, 11, { regarde: 'droite' });
    K.place('comptoir_2', 25, 11, { regarde: 'droite' });
    K.place('comptoir_3', 29, 11, { regarde: 'droite' });
    K.objet('comptoir', 'Le comptoir', 21, 8, 5, { acces: [21, 11] });
    K.plafonnier(18, 8, { c: [1.25, 0.95, 0.6] }); K.plafonnier(28, 8, { c: [1.25, 0.95, 0.6] });

    // ── la télé du fond, en hauteur, dans l'angle
    K.boite(1, 0, 11, 7, 3, 12, M.WOOD_DARK);
    K.tele(3, 0, { z: 12, sens: 'y' });
    K.objet('tele', 'La télé', 4, 2, 14, { acces: [5, 4] });

    // ── le flipper, contre le mur du fond, près de la porte
    K.flipper(35, 1, 'y');
    K.objet('flipper', 'Le flipper', 36, 4, 5, { acces: [36, 9] });
    // l'affiche du bal, l'horloge
    K.afficheY(38, 8, 3, 5, { title: 'BAL', bg: [0.82, 0.72, 0.36], fg: [0.42, 0.12, 0.16], torn: 0.05 });

    // ── les journaux du jour, sur leurs baguettes de bois, au mur de gauche près de l'entrée
    K.boite(0, 27, 12, 1, 32, 13, M.WOOD_DARK);
    for (const [y, s] of [[27, 1], [29, 2]]) { peint(K, 0, y, 7, 1, y + 2, 12, M.PAPER, journal(s)); K.boite(1, y, 11, 2, y + 2, 12, M.WOOD); }
    K.objet('journaux', 'Les journaux du jour', 1, 28, 9, { acces: [4, 29] });

    // ── au milieu, une table de quatre
    table(K, 19, 17, 4, 4);
    chaise(K, 17, 17, 'x-'); chaise(K, 23, 19, 'x+'); chaise(K, 19, 15, 'y-'); chaise(K, 21, 21, 'y+');
    K.voxel(20, 18, 4, M.WHITE); K.voxel(21, 19, 4, M.WHITE);
    K.place('table_5', 18, 18, { pose: 'assis', regarde: 'droite' });
    K.place('table_6', 24, 20, { pose: 'assis', regarde: 'gauche' });
    // le portemanteau, la plante près de la porte
    K.porteManteau(39, 29);
    plante(K, 39, 15);
    K.afficheY(30, 15, 3, 2, { bg: [0.86, 0.84, 0.78], fg: [0.2, 0.2, 0.2] });
    K.plafonnier(21, 19, { c: [1.2, 0.92, 0.6] });
  },
};
