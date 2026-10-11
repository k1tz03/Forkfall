'use strict';
// Le Corner, le bar du quartier : bleu et un peu moderne. Le zinc le long du mur de gauche, les
// bouteilles sous un néon bleu et l'enseigne orange comme dehors ; en face, la télé des résultats
// sur sa potence, le juke-box, le flipper, la cible et son ardoise ; trois tables, un carrelage noir
// et blanc qui brille. Au bout du zinc, le Minitel du patron et la piste de 421.
const E = require('../engine');
const { TOP, RIGHT, hash, mod } = E;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const grain = (c, amt, s = 0) => mul(c, 1 + (hash(c.a, c.b, c.face * 7 + s, c.m) - 0.5) * 2 * amt);
// la peinture sans matière nouvelle : une boîte étiquetée, qu'un pinceau peint texel par texel
// (c.hx, c.hy, c.hz : le point touché, en coordonnées de la pièce)
if (!E.OVERLAYS.bar_pinceau) E.overlay('bar_pinceau', (o, c) => o.f(c));
const peint = (K, x0, y0, z0, x1, y1, z1, m, f) => K.W.box(x0, y0, z0, x1, y1, z1, m, K.W.obj({ type: 'bar_pinceau', f }));
const le = c => Math.floor(2 * (c.face === RIGHT ? c.hy : c.hx));   // le texel le long de la face
const haut = c => Math.floor(2 * c.hz);

// le carrelage noir et blanc, ciré
const damier = c => {
  if (c.face !== TOP) { rgb(c, 0.18, 0.18, 0.22); return; }
  const noir = (Math.floor(c.hx / 3) + Math.floor(c.hy / 3)) & 1;
  if (noir) rgb(c, 0.22, 0.24, 0.31); else rgb(c, 0.50, 0.50, 0.48);
  if (mod(Math.floor(2 * c.hx), 6) === 0 || mod(Math.floor(2 * c.hy), 6) === 0) mul(c, 0.86);
  grain(c, 0.03);
  c.wet = 0.14;
};
// le soubassement : un lambris bleu nuit à rainures
const lambris = c => {
  if (c.face === TOP) { rgb(c, 0.12, 0.13, 0.17); return; }
  rgb(c, 0.15, 0.21, 0.35);
  if (mod(le(c), 5) === 0) mul(c, 0.7);
  if (haut(c) === 13) rgb(c, 0.55, 0.57, 0.60);                      // la baguette chromée
  grain(c, 0.04);
};
// le devant du comptoir : formica bleu à côtes, un jonc chromé en haut, la plinthe d'inox
const devantZinc = c => {
  if (c.face === TOP) { rgb(c, 0.17, 0.20, 0.30); return; }
  const v = haut(c);
  if (v === 7) { rgb(c, 0.66, 0.68, 0.72); return; }
  if (v <= 1) { rgb(c, 0.42, 0.44, 0.47); grain(c, 0.05); return; }
  rgb(c, 0.20, 0.30, 0.52); if (mod(le(c), 4) === 0) mul(c, 0.72); grain(c, 0.03);
};
// l'écran de la télé : les résultats, des lignes blanches sur fond bleu
const ecranResultats = c => {
  rgb(c, 0.05, 0.06, 0.10);
  if (c.face === TOP) return;
  const u = le(c), v = haut(c);
  let r = 0.10, g = 0.18, b = 0.55;
  if (mod(v, 2) === 0 && mod(u, 6) !== 0 && hash(Math.floor(u / 2), v, 801, 0) < 0.8) { r = 0.75; g = 0.80; b = 0.85; }
  if (mod(v, 2) === 0 && mod(u, 6) === 3) { r = 0.95; g = 0.75; b = 0.25; }       // le score, en jaune
  c.er = r; c.eg = g; c.eb = b;
};
// l'ardoise de la cible : des bâtons à la craie
const ardoiseCraie = c => {
  rgb(c, 0.09, 0.14, 0.11);
  if (c.face === TOP) return;
  const u = le(c), v = haut(c);
  if (mod(v, 3) !== 0 && mod(u, 3) === 1 && hash(Math.floor(u / 3), Math.floor(v / 3), 802, 0) < 0.55) rgb(c, 0.72, 0.72, 0.66);
  if (mod(v, 3) === 0 && hash(Math.floor(u / 2), v, 803, 0) < 0.12) rgb(c, 0.6, 0.6, 0.55);
};
// l'horloge : un cadran blanc, deux aiguilles
const cadran = c => {
  rgb(c, 0.80, 0.78, 0.72);
  if (c.face === TOP) { rgb(c, 0.2, 0.2, 0.22); return; }
  const u = mod(le(c), 4), v = mod(haut(c), 4);
  if (u === 0 || v === 0 || u === 3 && v === 3) rgb(c, 0.15, 0.15, 0.17);
  if ((u === 1 && v === 2) || (u === 2 && v === 1)) rgb(c, 0.1, 0.1, 0.1);
};
// le Minitel du patron, l'écran tourné vers la salle
const minitel = c => {
  rgb(c, 0.60, 0.56, 0.47);
  if (c.face === RIGHT && haut(c) >= 1) { rgb(c, 0.04, 0.05, 0.04); c.er = 0.10; c.eg = 0.30; c.eb = 0.14; if (mod(haut(c), 2)) { c.er = 0.22; c.eg = 0.55; c.eb = 0.28; } }
};
// une chaise de bistrot et un tabouret de bar : le piètement chromé, le skaï bleu
const skaiBleu = c => { rgb(c, 0.16, 0.24, 0.46); if (c.face === TOP) mul(c, 1.15); grain(c, 0.06); };
function chaise(K, x, y, dos) {
  K.boite(x, y, 0, x + 2, y + 2, 1, K.M.CHROME);
  peint(K, x, y, 1, x + 2, y + 2, 2, K.M.I_SKAI, skaiBleu);
  const d = dos === 'x-' ? x : x + 1;
  peint(K, d, y, 2, d + 1, y + 2, 5, K.M.I_SKAI, skaiBleu);
}
function tabouret(K, x, y) { K.boite(x, y, 0, x + 1, y + 1, 3, K.M.CHROME); peint(K, x, y, 3, x + 2, y + 2, 4, K.M.I_SKAI, skaiBleu); }

module.exports = {
  cle: 'bar', nom: 'Le Corner', ambiance: 'bar', personnel: 'commercant2',
  sx: 40, sy: 32, sol: 'I_LINO',
  murs: { bas: 'I_MUR_BLEU', haut: 'I_MUR_BLEU', coupe: 7 },
  porte: { cote: 'y', de: 24, a: 31 },
  build(K) {
    const { M, SX, SY } = K;
    // le sol et le soubassement, repeints
    peint(K, 0, 0, -1, SX, SY, 0, M.I_LINO, damier);
    peint(K, -2, -2, -1, SX, 0, 7, M.PANEL, lambris);
    peint(K, -2, 0, -1, 0, SY, 7, M.PANEL, lambris);

    // ── le zinc, le long du mur de gauche (x = 0)
    // derrière : le meuble bas, deux rayons de bouteilles, le néon bleu, l'enseigne
    K.boite(0, 2, 0, 2, 22, 4, M.METAL_DARK); K.boite(0, 2, 4, 2, 22, 5, M.I_ZINC);
    K.etagere(0, 3, 2, 21, 7, 13, M.I_BOUTEILLES);
    K.neon(0, 3, 1, 21, 13, M.I_NEON_BLEU, { c: [0.25, 0.55, 1.1], r: 30 });
    K.enseigneX(5, 18, 'LE CORNER', { fg: [1.0, 0.42, 0.22], emit: [1.0, 0.30, 0.10], plate: [0.08, 0.08, 0.10], plateMat: M.METAL_DARK, padX: 2, padY: 1, light: { c: [0.8, 0.28, 0.12], r: 30 } });
    // le comptoir : formica bleu, dessus de zinc, ouvert au bout pour passer derrière
    peint(K, 5, 2, 0, 8, 21, 4, M.WOOD_DARK, devantZinc);
    K.boite(5, 2, 4, 9, 21, 5, M.I_ZINC);
    // la pompe à bière, les verres, la caisse
    K.boite(6, 8, 5, 7, 9, 8, M.CHROME); K.voxel(5, 8, 7, M.CHROME); K.voxel(7, 8, 7, M.KEG);
    for (const y of [11, 12]) K.voxel(8, y, 5, M.WHITE);
    K.caisse(5, 4);
    // au bout du zinc : la piste de 421, avec ses dés, et le Minitel
    K.boite(5, 14, 5, 8, 17, 6, M.WOOD_DARK); K.boite(6, 15, 5, 7, 16, 6, M.I_DRAP);
    K.voxel(6, 15, 6, M.WHITE);
    peint(K, 5, 18, 5, 7, 21, 8, M.WHITE, minitel);
    // trois tabourets chromés, à l'autre bout
    for (const y of [3, 7]) tabouret(K, 10, y);

    K.place('patron', 3, 10, { regarde: 'droite', pour: 'personnel' });
    K.place('comptoir_1', 11, 11, { regarde: 'gauche' });
    K.place('comptoir_2', 11, 14, { regarde: 'gauche' });
    K.place('lhoste', 12, 21, { regarde: 'gauche', pour: 'lhoste' });
    K.objet('comptoir', 'Le zinc', 7, 10, 5, { acces: [11, 9] });
    K.objet('des', 'La piste de 421', 6, 15, 6, { acces: [11, 16] });
    K.plafonnier(7, 6, { c: [1.3, 0.95, 0.55] }); K.plafonnier(7, 16, { c: [1.3, 0.95, 0.55] });

    // ── en face, le long du mur de droite (y = 0)
    // la télé des résultats, sur sa potence, au-dessus du bout du zinc
    K.boite(11, 0, 12, 12, 2, 13, M.METAL_DARK);
    K.boite(10, 0, 13, 14, 3, 16, M.METAL_DARK);
    peint(K, 10, 3, 13, 14, 4, 16, M.CRT, ecranResultats);
    K.W.light({ x: 12, y: 7, z: 14, r: 22, cr: 0.10, cg: 0.16, cb: 0.45, shadow: false });
    K.objet('tele', 'La télé des résultats', 12, 3, 14, { acces: [13, 7] });
    // le juke-box
    K.jukebox(16, 1);
    K.objet('jukebox', 'Le juke-box', 17, 3, 6, { acces: [17, 7] });
    // le flipper, la caisse contre le mur
    K.flipper(22, 1, 'y');
    K.objet('flipper', 'Le flipper', 23, 4, 5, { acces: [23, 9] });
    // la cible, l'ardoise des parties, la ligne de tir au sol
    K.boite(29, 0, 6, 35, 1, 13, M.WOOD_DARK);
    K.cibleY(30, 8);
    peint(K, 34, 0, 7, 39, 1, 13, M.BOARD, ardoiseCraie);
    K.boite(29, 10, -1, 35, 11, 0, M.WHITE);
    K.objet('flechettes', 'La cible', 31, 1, 9, { acces: [32, 12] });
    K.lampe(32, 3, 15, { r: 18, c: [1.1, 0.9, 0.6], cache: true });
    // l'horloge, le calendrier, l'écharpe du Racing, l'affiche du prochain match
    peint(K, 19, 0, 13, 21, 1, 15, M.WHITE, cadran);
    K.afficheY(25, 10, 4, 6, { title: 'RIVE', bg: [0.42, 0.11, 0.16], fg: [0.86, 0.80, 0.62], band: [0.6, 0.6, 0.58] });
    K.boite(36, 0, 14, 39, 1, 16, M.JERSEY);

    // ── le mur de gauche, après le zinc : la porte des toilettes, le portemanteau, la photo
    K.boite(0, 25, 0, 1, 30, 10, M.WOOD_DARK);
    K.enseigneX(26, 12, 'WC', { fg: [0.86, 0.82, 0.7], plate: [0.15, 0.2, 0.32], plateMat: M.METAL_DARK });
    K.porteManteau(21, 29);
    K.afficheX(22, 9, 3, 4, { bg: [0.30, 0.28, 0.26], fg: [0.86, 0.80, 0.62], title: '88' });

    // ── trois tables, deux chaises chacune
    // la table du fond (celle qu'on réserve à celui qui t'attend)
    K.table(17, 9, 4, 4, { pied: 'central', mat: M.I_ZINC });
    chaise(K, 15, 10, 'x-'); chaise(K, 21, 10, 'x+');
    K.place('table_3', 16, 11, { pose: 'assis', regarde: 'droite', pour: 'visiteur' });
    K.place('table_3b', 22, 11, { pose: 'assis', regarde: 'gauche' });
    // les deux autres
    K.table(29, 15, 4, 4, { pied: 'central', mat: M.I_ZINC });
    chaise(K, 27, 16, 'x-'); chaise(K, 33, 16, 'x+');
    K.place('table_1', 28, 17, { pose: 'assis', regarde: 'droite' });
    K.place('table_1b', 34, 17, { pose: 'assis', regarde: 'gauche' });
    K.table(17, 21, 4, 4, { pied: 'central', mat: M.I_ZINC });
    chaise(K, 15, 22, 'x-'); chaise(K, 21, 22, 'x+');
    K.place('table_2', 16, 23, { pose: 'assis', regarde: 'droite' });
    K.place('table_2b', 22, 23, { pose: 'assis', regarde: 'gauche' });
    for (const [x, y] of [[18, 10], [30, 16], [19, 22]]) K.voxel(x, y, 4, M.WHITE);
    K.place('cible', 32, 14, { regarde: 'droite' });

    // la lumière : deux suspensions sur la salle
    K.plafonnier(19, 17, { c: [1.2, 0.92, 0.62] }); K.plafonnier(31, 22, { c: [1.2, 0.92, 0.62] });
  },
};
