'use strict';
// Aux Immortelles, fleuriste : des chrysanthèmes toute l'année, et des gerbes aux couleurs du club
// les jours de deuil. La chambre froide au fond, sa porte vitrée et sa lumière blanche et bleue ; les
// seaux de zinc sur leurs gradins, près de l'entrée ; les couronnes bordeaux et grises, l'une au mur,
// l'autre sur son chevalet, le ruban encore vierge ; le comptoir, les bobines de ruban, le papier
// kraft, le cahier des commandes ; l'ardoise des prix d'hiver ; les tomettes mouillées.
const E = require('../engine');
const { TOP, RIGHT, hash, mod, fbm } = E;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const grain = (c, amt, s = 0) => mul(c, 1 + (hash(c.a, c.b, c.face * 7 + s, c.m) - 0.5) * 2 * amt);
if (!E.OVERLAYS.fleuriste_pinceau) E.overlay('fleuriste_pinceau', (o, c) => o.f(c));
const peint = (K, x0, y0, z0, x1, y1, z1, m, f) => K.W.box(x0, y0, z0, x1, y1, z1, m, K.W.obj({ type: 'fleuriste_pinceau', f }));
const le = c => Math.floor(2 * (c.face === RIGHT ? c.hy : c.hx));
const haut = c => Math.floor(2 * c.hz);

// les tomettes, mouillées par l'arrosage devant les seaux et la chambre froide
const tomettes = c => {
  if (c.face !== TOP) { rgb(c, 0.40, 0.18, 0.12); return; }
  const a = mod(Math.floor(2 * c.hx), 4), b = mod(Math.floor(2 * c.hy), 4);
  if (a === 0 || b === 0) rgb(c, 0.30, 0.20, 0.16);
  else { rgb(c, 0.60, 0.30, 0.20); mul(c, 0.86 + 0.24 * hash(Math.floor(c.hx / 2), Math.floor(c.hy / 2), 921, 0)); }
  const p = fbm(c.hx / 4 + 1, c.hy / 4, 922, 3);
  const pres = Math.max(Math.max(0, 1 - Math.abs(c.hx - 8) / 6) * (c.hy > 12 ? 1 : 0), Math.max(0, 1 - Math.abs(c.hy - 9) / 4) * (c.hx > 18 ? 1 : 0));
  if (p > 0.58 - 0.12 * pres) { c.wet = 0.55; mul(c, 0.82); }
  grain(c, 0.04);
};
// les fleurs : chrysanthèmes jaunes, blancs, mordorés ; roses ; glaïeuls ; et le vert des tiges
const FLEURS = [[0.92, 0.80, 0.22], [0.90, 0.88, 0.80], [0.72, 0.42, 0.16], [0.78, 0.14, 0.18], [0.92, 0.58, 0.66], [0.58, 0.30, 0.62]];
const bouquet = k => c => {
  const h = hash(Math.floor(2 * c.hx * 1.5 + c.face), Math.floor(2 * (c.face === TOP ? c.hy : c.hz) * 1.5), 923, k);
  if (h < 0.34) { rgb(c, 0.18, 0.36, 0.16); return; }
  const p = FLEURS[k % FLEURS.length]; rgb(c, p[0], p[1], p[2]);
  if (h > 0.85) mul(c, 0.75); if (c.face === TOP) mul(c, 1.1);
};
// un seau de zinc
const zinc = c => { rgb(c, 0.56, 0.58, 0.60); if (c.face !== TOP && mod(haut(c), 3) === 0) mul(c, 0.8); grain(c, 0.05); };
// la chambre froide : des panneaux blancs isolés, des joints, une poignée chromée
const panneau = c => {
  if (c.face === TOP) { rgb(c, 0.74, 0.75, 0.76); return; }
  rgb(c, 0.80, 0.81, 0.82); if (mod(le(c), 8) === 0) rgb(c, 0.60, 0.62, 0.64);
  grain(c, 0.02);
};
// sa porte vitrée : dedans, des seaux sur des étagères, une lumière froide
const porteFroide = (x0, z1) => c => {
  if (c.face === TOP) { rgb(c, 0.7, 0.7, 0.72); return; }
  const u = Math.floor(2 * (c.hx - x0)), v = Math.floor(2 * (z1 - c.hz));
  if (u <= 0 || u >= 11 || v <= 0 || v >= 21) { rgb(c, 0.60, 0.62, 0.64); if (u === 10 && v >= 9 && v <= 12) rgb(c, 0.9, 0.9, 0.92); return; }
  rgb(c, 0.20, 0.30, 0.36); c.er = 0.30; c.eg = 0.44; c.eb = 0.55;
  if (mod(v, 7) === 6) { rgb(c, 0.6, 0.62, 0.64); c.er = 0.40; c.eg = 0.48; c.eb = 0.55; return; }
  const w = mod(v, 7);
  if (w >= 3 && mod(u, 3) !== 0) { const p = FLEURS[Math.floor(hash(Math.floor(u / 3), Math.floor(v / 7), 924, 0) * FLEURS.length)]; rgb(c, p[0] * 0.5, p[1] * 0.5, p[2] * 0.5); c.er = p[0] * 0.45 + 0.08; c.eg = p[1] * 0.45 + 0.12; c.eb = p[2] * 0.45 + 0.18; }
  if (w >= 1 && w <= 2 && mod(u, 3) !== 0) { rgb(c, 0.4, 0.42, 0.44); c.er = 0.22; c.eg = 0.26; c.eb = 0.30; }
};
// une couronne de deuil, aux couleurs du club, et son ruban
const couronne = (cx, cz, mur) => c => {
  const s = mur === 'x' ? c.hy : c.hx, d = Math.hypot(s - cx, c.hz - cz);
  if (mur && (d < 1.0 || d > 2.6)) { rgb(c, 0.66, 0.60, 0.48); grain(c, 0.03); return; }   // le mur, au travers et autour
  const a = Math.atan2(c.hz - cz, s - cx), q = mod(Math.floor((a + Math.PI) / (Math.PI / 4)), 2);
  if (q) rgb(c, 0.46, 0.10, 0.16); else rgb(c, 0.62, 0.62, 0.60);
  if (hash(Math.floor(2 * s), Math.floor(2 * c.hz), 925, 0) < 0.25) mul(c, 0.78);
  if (Math.abs((s - cx) + (c.hz - cz) + 0.5) < 0.45 && c.hz < cz) rgb(c, 0.44, 0.24, 0.52);        // le ruban violet
};
// les bobines de ruban sur leur dérouleur
const bobines = c => {
  const u = c.face === TOP ? Math.floor(2 * c.hx) : le(c);
  const p = [[0.46, 0.10, 0.16], [0.62, 0.62, 0.60], [0.44, 0.24, 0.52], [0.90, 0.88, 0.80], [0.20, 0.30, 0.20]][mod(Math.floor(u / 2), 5)];
  rgb(c, p[0], p[1], p[2]); if (mod(u, 2)) mul(c, 0.82);
};
// le papier kraft, en rouleau
const kraft = c => { rgb(c, 0.66, 0.50, 0.30); if (c.face !== TOP && mod(haut(c), 2)) mul(c, 0.9); grain(c, 0.04); };
// l'ardoise des prix d'hiver
const ardoise = c => {
  rgb(c, 0.10, 0.13, 0.12);
  if (c.face === TOP) { rgb(c, 0.3, 0.2, 0.1); return; }
  const u = le(c), v = haut(c);
  if (mod(v, 2) === 1 && hash(u >> 1, v, 926, 0) < 0.66 && mod(u, 10) !== 0) rgb(c, 0.80, 0.80, 0.74);
};
// un seau sur son gradin, ses fleurs par-dessus
function seau(K, x, y, z, k) {
  peint(K, x, y, z, x + 2, y + 2, z + 2, K.M.METAL, zinc);
  peint(K, x, y, z + 2, x + 2, y + 2, z + 3, K.M.HEDGE, bouquet(k));
  if (k % 2) peint(K, x, y, z + 3, x + 1, y + 1, z + 4, K.M.HEDGE, bouquet(k));
}

module.exports = {
  cle: 'fleuriste', nom: 'Aux Immortelles', ambiance: 'boutique',
  sx: 32, sy: 26, sol: 'I_TOMETTE',
  murs: { bas: 'I_MUR_VERT', haut: 'PAINT_CREAM', coupe: 6, frise: 'WOOD' },
  porte: { cote: 'y', de: 18, a: 25 },
  build(K) {
    const { M, SX, SY } = K;
    peint(K, 0, 0, -1, SX, SY, 0, M.I_TOMETTE, tomettes);

    // ── la chambre froide, au fond à droite : sa porte vitrée, sa lumière froide
    peint(K, 19, 0, 0, 32, 7, 14, M.ENAMEL, panneau);
    peint(K, 22, 6, 0, 28, 7, 11, M.GLASS, porteFroide(22, 11));
    K.boite(25, 1, 14, 30, 5, 16, M.METAL); K.boite(26, 2, 16, 29, 4, 17, M.METAL_DARK);
    K.W.light({ x: 25, y: 9, z: 5, r: 18, cr: 0.32, cg: 0.46, cb: 0.62, shadow: false });
    K.objet('chambre_froide', 'La chambre froide', 25, 7, 6, { acces: [25, 10] });

    // ── le comptoir, au milieu à gauche ; derrière, les bobines, le kraft, les vases
    K.comptoir(3, 9, 13, 12, { mat: M.WOOD, dessus: M.WOOD_DARK });
    peint(K, 9, 9, 5, 12, 11, 6, M.PAPER, kraft);
    K.caisse(4, 10);
    K.voxel(7, 10, 5, M.PAPER); K.voxel(8, 10, 5, M.PAPER);                              // le cahier des commandes
    K.boite(1, 0, 0, 13, 2, 4, M.WOOD_DARK); K.boite(1, 0, 4, 13, 2, 5, M.WOOD);
    peint(K, 2, 0, 7, 9, 1, 9, M.METAL, bobines); K.boite(2, 0, 9, 9, 1, 10, M.METAL_DARK);
    for (const x of [3, 6, 10]) K.boite(x, 0, 5, x + 1, 1, 7, M.GLASS);                // les vases
    peint(K, 10, 0, 6, 12, 2, 7, M.HEDGE, bouquet(1));
    K.objet('comptoir', 'Le comptoir', 8, 10, 5, { acces: [8, 14] });
    K.place('huguette', 7, 6, { regarde: 'gauche', pour: 'huguette' });
    K.place('client_1', 10, 14, { regarde: 'droite' });

    // ── les couronnes : l'une au mur, l'autre sur son chevalet, le ruban encore vierge
    peint(K, 0, 13, 9, 1, 19, 15, M.HEDGE, couronne(16, 12, 'x'));
    K.voxel(0, 16, 15, M.METAL);
    // la grande, sur son chevalet, près de l'entrée : un mètre quarante de fleurs bordeaux et grises
    for (let z = 1; z < 9; z++) for (let x = 17; x < 25; x++) {
      const d = Math.hypot(x + 0.5 - 21, z + 0.5 - 5);
      if (d > 2.1 && d < 3.7) peint(K, x, 17, z, x + 1, 18, z + 1, M.HEDGE, couronne(21, 5, false));
    }
    K.boite(18, 18, 0, 19, 19, 3, M.WOOD_DARK); K.boite(23, 18, 0, 24, 19, 3, M.WOOD_DARK); K.boite(20, 16, 0, 22, 17, 8, M.WOOD_DARK);
    peint(K, 20, 18, 2, 22, 19, 4, M.PAPER, c => { rgb(c, 0.44, 0.24, 0.52); if (c.face !== TOP && haut(c) === 5) rgb(c, 0.86, 0.84, 0.78); });   // le ruban, encore vierge
    K.objet('gerbes', 'Les gerbes du club', 21, 17, 6, { acces: [21, 21] });

    // ── les seaux de fleurs, sur leurs gradins, près de l'entrée
    K.boite(0, 14, 0, 6, 26, 2, M.WOOD_DARK); K.boite(0, 14, 2, 3, 26, 4, M.WOOD_DARK);
    let k = 0;
    for (const y of [14, 16, 18, 20, 22, 24]) { seau(K, 3, y, 2, k++); seau(K, 0, y, 4, k++ + 2); }
    for (const [x, y] of [[7, 16], [7, 20], [9, 23]]) seau(K, x, y, 0, k++);
    K.objet('fleurs', 'Les seaux de fleurs', 4, 19, 4, { acces: [11, 19] });
    K.place('visiteur', 13, 20, { regarde: 'gauche', pour: 'visiteur' });

    // l'ardoise des prix d'hiver, le calendrier des fêtes
    peint(K, -1, 4, 8, 0, 11, 13, M.BOARD, ardoise);
    K.boite(0, 4, 7, 1, 11, 8, M.WOOD);
    K.afficheY(2, 12, 4, 4, { bg: [0.86, 0.84, 0.76], fg: [0.42, 0.11, 0.16], band: [0.44, 0.24, 0.52] });
    // des pots de chrysanthèmes, à même le sol, devant la chambre froide
    for (const [x, y, kk] of [[21, 10, 0], [24, 11, 2], [27, 10, 1]]) { K.boite(x, y, 0, x + 2, y + 2, 2, M.TERRACOTTA); peint(K, x, y, 2, x + 2, y + 2, 4, M.HEDGE, bouquet(kk)); }

    K.plafonnier(9, 14, { c: [1.15, 1.0, 0.8] }); K.plafonnier(22, 16, { c: [1.15, 1.0, 0.8] });
  },
};
