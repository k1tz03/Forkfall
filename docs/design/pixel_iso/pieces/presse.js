'use strict';
// La maison de la presse de la rue des Lilas : L'Écho, le quotidien sportif, et les gros titres que tu
// lis avant de les vivre. Des murs blancs couverts de rayonnages : les magazines du sol au plafond ;
// les quotidiens à plat et leurs Unes punaisées au-dessus, sous la plaque émaillée de L'ÉCHO ; le
// comptoir, la boîte des pochettes de vignettes et l'affiche de l'album ; la machine du loto ; au
// milieu, la table des piles du matin. Deux tubes au plafond, une lumière blanche.
const E = require('../engine');
const { TOP, RIGHT, hash, mod } = E;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const grain = (c, amt, s = 0) => mul(c, 1 + (hash(c.a, c.b, c.face * 7 + s, c.m) - 0.5) * 2 * amt);
if (!E.OVERLAYS.presse_pinceau) E.overlay('presse_pinceau', (o, c) => o.f(c));
const peint = (K, x0, y0, z0, x1, y1, z1, m, f) => K.W.box(x0, y0, z0, x1, y1, z1, m, K.W.obj({ type: 'presse_pinceau', f }));
const le = c => Math.floor(2 * (c.face === RIGHT ? c.hy : c.hx));
const haut = c => Math.floor(2 * c.hz);

// le lino : des carreaux beiges, un peu usés devant le comptoir
const lino = c => {
  if (c.face !== TOP) { rgb(c, 0.30, 0.28, 0.25); return; }
  rgb(c, 0.52, 0.49, 0.42);
  if ((Math.floor(c.hx / 2) + Math.floor(c.hy / 2)) & 1) mul(c, 0.92);
  if (c.hx > 8 && c.hx < 12 && c.hy > 4 && c.hy < 18) mul(c, 1.06);
  grain(c, 0.04);
};
// un rayon de magazines : des couvertures en rangs, chacune son titre et sa photo
const PALETTE = [[0.62, 0.20, 0.17], [0.20, 0.32, 0.52], [0.70, 0.62, 0.30], [0.24, 0.42, 0.30], [0.80, 0.78, 0.72], [0.46, 0.26, 0.40], [0.16, 0.16, 0.18], [0.74, 0.46, 0.22]];
const magazines = graine => c => {
  if (c.face === TOP) { rgb(c, 0.40, 0.28, 0.16); return; }
  const u = le(c), v = haut(c);
  if (mod(v, 7) === 0) { rgb(c, 0.44, 0.30, 0.16); return; }                     // la tablette
  if (mod(u, 4) === 3) { rgb(c, 0.22, 0.15, 0.09); return; }
  const k = Math.floor(u / 4), r = Math.floor(v / 7), h = hash(k, r, 881, graine);
  const p = PALETTE[Math.floor(h * PALETTE.length)];
  rgb(c, p[0], p[1], p[2]);
  const w = mod(v, 7);
  if (w === 6) rgb(c, 0.94, 0.92, 0.86);                                         // le titre, en haut
  else if (w >= 2 && w <= 4 && mod(u, 4) >= 1 && hash(k, r, 882, graine) < 0.6) rgb(c, p[0] * 0.55 + 0.25, p[1] * 0.55 + 0.2, p[2] * 0.55 + 0.18);   // la photo
};
// les quotidiens à plat, sur leur pupitre incliné : la tranche, la Une
const quotidiens = c => {
  if (c.face === TOP) {
    const u = Math.floor(2 * c.hy), v = Math.floor(2 * c.hx);
    rgb(c, 0.84, 0.82, 0.76);
    if (mod(u, 5) === 4) { rgb(c, 0.30, 0.22, 0.14); return; }
    if (mod(v, 6) === 1) rgb(c, hash(Math.floor(u / 5), 0, 883, 0) < 0.5 ? 0.62 : 0.15, 0.12, hash(Math.floor(u / 5), 0, 883, 0) < 0.5 ? 0.12 : 0.30);
    else if (mod(v, 2) === 0 && mod(u, 5) > 0) rgb(c, 0.44, 0.44, 0.42);
    return;
  }
  rgb(c, 0.36, 0.26, 0.16); if (mod(haut(c), 3) === 0) mul(c, 0.8);
};
// les Unes punaisées : de grands titres noirs, une photo, une manchette rouge
const unes = c => {
  if (c.face === TOP) { rgb(c, 0.4, 0.3, 0.2); return; }
  const u = le(c), v = haut(c), k = Math.floor(u / 7), w = mod(u, 7);
  if (w === 6) { rgb(c, 0.62, 0.60, 0.56); return; }
  rgb(c, 0.86, 0.84, 0.78);
  const t = 29 - v;                                                               // du haut
  if (t >= 1 && t <= 2 && w >= 1 && w <= 4) rgb(c, 0.10, 0.10, 0.10);
  if (t === 3 && w <= 5 && hash(k, 0, 884, 0) < 0.5) rgb(c, 0.66, 0.12, 0.12);
  if (t >= 5 && t <= 8 && w >= 1 && w <= 3) { const h = hash(k, 1, 885, 0); rgb(c, 0.30 + 0.3 * h, 0.30 + 0.2 * h, 0.30); }
  if (t >= 5 && t <= 11 && w >= 4 && w <= 5 && mod(t, 2) === 0) rgb(c, 0.46, 0.46, 0.44);
  if (t >= 10 && t <= 11 && w >= 1 && w <= 3 && mod(t, 2) === 0) rgb(c, 0.46, 0.46, 0.44);
  if (t === 0) rgb(c, 0.78, 0.30, 0.20);                                         // la punaise
};
// la plaque émaillée de L'ÉCHO
const ECHO = E.textBitmap('L\'ÉCHO');
const plaque = (y0, y1, z0, z1) => c => {
  if (c.face === TOP) { rgb(c, 0.2, 0.2, 0.25); return; }
  const h = Math.floor(2 * (y1 - c.hy)), v = Math.floor(2 * (z1 - c.hz)), W2 = 2 * (y1 - y0), H2 = 2 * (z1 - z0);
  if (h === 0 || h === W2 - 1 || v === 0 || v === H2 - 1) { rgb(c, 0.86, 0.84, 0.78); return; }
  rgb(c, 0.16, 0.24, 0.46);
  if (ECHO.at(h - Math.floor((W2 - ECHO.w) / 2), v - 1)) rgb(c, 0.92, 0.88, 0.76);
};
// la boîte des pochettes de vignettes, posée sur le comptoir
const pochettes = c => {
  if (c.face !== TOP) { rgb(c, 0.86, 0.70, 0.22); if (haut(c) === 11) rgb(c, 0.20, 0.30, 0.60); return; }
  const u = Math.floor(2 * c.hx), v = Math.floor(2 * c.hy);
  const p = [[0.86, 0.24, 0.20], [0.24, 0.44, 0.80], [0.90, 0.80, 0.30], [0.30, 0.66, 0.40]][mod(u + 2 * v, 4)];
  rgb(c, p[0], p[1], p[2]); if (mod(u + v, 2)) mul(c, 0.85);
};
// l'affiche de l'album : une grille de vignettes, des visages et des maillots
const album = c => {
  if (c.face === TOP) { rgb(c, 0.4, 0.3, 0.2); return; }
  const u = le(c), v = haut(c), a = mod(u, 3), b = mod(v, 4);
  rgb(c, 0.20, 0.36, 0.62);
  if (v >= 30) { rgb(c, 0.92, 0.80, 0.26); return; }                             // le bandeau jaune
  if (a !== 0 && b !== 0) {
    if (b === 3) rgb(c, 0.86, 0.68, 0.52);                                       // le visage
    else { const h = hash(Math.floor(u / 3), Math.floor(v / 4), 886, 0); rgb(c, h < 0.5 ? 0.46 : 0.82, h < 0.5 ? 0.12 : 0.80, h < 0.5 ? 0.18 : 0.76); }
  }
};
// le tourniquet des cartes postales : la Rive, le pont, le stade, en petits rectangles clairs
const cartesPostales = c => {
  if (c.face === TOP) { rgb(c, 0.5, 0.5, 0.5); return; }
  const u = le(c), v = haut(c);
  rgb(c, 0.50, 0.52, 0.54);
  if (mod(v, 4) === 0 || mod(u, 3) === 2) return;
  const h = hash(Math.floor(u / 3), Math.floor(v / 4), 887, c.face);
  const p = h < 0.4 ? [0.56, 0.68, 0.80] : h < 0.7 ? [0.40, 0.58, 0.34] : [0.84, 0.78, 0.60];
  rgb(c, p[0], p[1], p[2]); if (mod(v, 4) === 1) rgb(c, 0.88, 0.86, 0.80);
};
// les paquets du matin, ficelés en croix
const ficele = c => {
  rgb(c, 0.80, 0.78, 0.70); if (c.face !== TOP && mod(haut(c), 2)) mul(c, 0.86);
  const u = c.face === TOP ? Math.floor(2 * c.hx) : le(c), v = c.face === TOP ? Math.floor(2 * c.hy) : 99;
  if (mod(u, 4) === 2 || mod(v, 4) === 2) rgb(c, 0.52, 0.38, 0.20);
};
// la machine du loto : beige, un petit écran vert, la fente des grilles
const machine = c => {
  rgb(c, 0.74, 0.70, 0.60);
  if (c.face === RIGHT && haut(c) >= 11 && haut(c) <= 12) { rgb(c, 0.05, 0.07, 0.05); c.er = 0.12; c.eg = 0.40; c.eb = 0.18; }
  if (c.face === TOP) { mul(c, 1.05); if (Math.floor(2 * c.hy) === 5) rgb(c, 0.15, 0.15, 0.15); }
};

module.exports = {
  cle: 'presse', nom: 'La maison de la presse', ambiance: 'boutique', personnel: 'commercant2',
  sx: 34, sy: 28, sol: 'I_LINO',
  murs: { bas: 'WOOD', haut: 'I_MUR_BLANC', coupe: 6 },
  porte: { cote: 'y', de: 20, a: 27 },
  build(K) {
    const { M, SX, SY } = K;
    peint(K, 0, 0, -1, SX, SY, 0, M.I_LINO, lino);

    // ── le comptoir, le long du mur de gauche
    K.comptoir(5, 3, 8, 15, { mat: M.WOOD, dessus: M.I_FORMICA });
    K.boite(0, 3, 0, 2, 15, 5, M.WOOD_DARK);
    peint(K, 0, 3, 5, 1, 15, 9, M.WOOD_DARK, magazines(3));
    K.caisse(5, 9);
    // la boîte des pochettes de vignettes, et l'affiche de l'album au-dessus du marchand
    peint(K, 5, 11, 5, 8, 14, 6, M.I_CARTON, pochettes);
    peint(K, -1, 9, 10, 0, 15, 16, M.POSTER, album);
    K.objet('vignettes', 'Les vignettes à coller', 6, 12, 6, { acces: [10, 13] });
    // la machine du loto, au bout du comptoir ; les grilles sur leur présentoir
    peint(K, 5, 5, 5, 8, 8, 7, M.WHITE, machine);
    K.boite(0, 3, 10, 1, 8, 15, M.WHITE);
    for (let y = 3; y < 8; y++) K.voxel(0, y, 13, y % 2 ? M.PLASTIC_RED : M.WHITE);
    K.objet('loto', 'Le loto', 6, 6, 7, { acces: [10, 6] });
    K.place('marchand', 3, 10, { regarde: 'droite', pour: 'personnel' });
    K.place('client_2', 10, 9, { regarde: 'gauche' });
    K.objet('comptoir', 'Le comptoir', 6, 9, 5, { acces: [10, 10] });

    // ── le mur des magazines, du sol au plafond, au fond
    K.boite(9, 0, 0, 34, 3, 1, M.WOOD_DARK);
    peint(K, 9, 0, 1, 34, 2, 16, M.WOOD_DARK, magazines(1));
    K.boite(9, 0, 16, 34, 2, 17, M.WOOD_DARK);
    K.objet('magazines', 'Les magazines', 21, 1, 9, { acces: [21, 6] });
    K.place('client_1', 17, 5, { regarde: 'droite' });
    K.place('client_3', 27, 5, { regarde: 'droite' });

    // ── les quotidiens, à plat sur leur pupitre ; les Unes punaisées ; la plaque de L'ÉCHO
    peint(K, 0, 17, 0, 4, 27, 4, M.PAPER, quotidiens);
    peint(K, -1, 17, 6, 0, 27, 14, M.PAPER, unes);
    peint(K, -1, 16, 14, 0, 28, 18, M.METAL, plaque(16, 28, 14, 18));
    K.objet('journaux', 'Les journaux', 2, 22, 4, { acces: [6, 22] });
    K.place('visiteur', 6, 25, { regarde: 'gauche', pour: 'visiteur' });

    // ── au milieu, la table des piles du matin, ficelées ou non
    K.boite(14, 13, 0, 22, 18, 3, M.WOOD_DARK);
    for (const [x, y, h] of [[14, 13, 2], [17, 13, 1], [20, 13, 2], [15, 15, 1], [18, 16, 2]]) peint(K, x, y, 3, x + 2, y + 2, 3 + h, M.PAPER, quotidiens);
    K.voxel(20, 16, 3, M.I_CARTON);
    K.place('client_4', 17, 20, { regarde: 'droite' });

    // ── près de la porte : le tourniquet des cartes postales, les paquets ficelés du matin
    K.boite(27, 21, 0, 29, 23, 1, M.METAL_DARK);
    peint(K, 27, 21, 1, 29, 23, 10, M.METAL, cartesPostales);
    K.boite(27, 21, 10, 29, 23, 11, M.METAL_DARK);
    peint(K, 13, 23, 0, 16, 26, 2, M.PAPER, ficele); peint(K, 14, 24, 2, 16, 26, 3, M.PAPER, ficele);
    // la lumière : un tube au plafond, blanc ; deux spots sur les rayons
    K.neon(14, 15, 26, 16, 16, M.TUBE, { c: [0.85, 0.92, 0.90], r: 56 });
    for (const [x, y] of [[15, 15], [25, 15]]) K.voxel(x, y, 17, M.METAL_DARK);
    K.plafonnier(21, 5, { c: [1.0, 0.95, 0.8], r: 40 }); K.plafonnier(5, 21, { c: [1.0, 0.95, 0.8], r: 40 });
  },
};
