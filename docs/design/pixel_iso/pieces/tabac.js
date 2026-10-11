'use strict';
// Le tabac du Quai : les mariniers y prennent leur café, on y parie sur tout. Le zinc en équerre,
// derrière lui le mur des paquets de cigarettes ; au-dessus de la caisse, la licence encadrée et la
// photo d'une fille sur une mobylette bleue ; le fax public sous sa housse, la radio ; au mur de
// gauche, l'ardoise des cotes et sa craie, la table du 421 ; une bouée de sauvetage, les journaux
// près de l'entrée ; au fond, la porte vitrée de la cour, et dans la cour une mobylette bleue.
const E = require('../engine');
const { TOP, RIGHT, hash, mod } = E;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const grain = (c, amt, s = 0) => mul(c, 1 + (hash(c.a, c.b, c.face * 7 + s, c.m) - 0.5) * 2 * amt);
if (!E.OVERLAYS.tabac_pinceau) E.overlay('tabac_pinceau', (o, c) => o.f(c));
const peint = (K, x0, y0, z0, x1, y1, z1, m, f) => K.W.box(x0, y0, z0, x1, y1, z1, m, K.W.obj({ type: 'tabac_pinceau', f }));
const le = c => Math.floor(2 * (c.face === RIGHT ? c.hy : c.hx));
const haut = c => Math.floor(2 * c.hz);

// le mur des cigarettes : des rangées de paquets derrière des baguettes de laiton
const PAQUETS = [[0.78, 0.12, 0.10], [0.86, 0.84, 0.78], [0.82, 0.66, 0.22], [0.18, 0.28, 0.55], [0.20, 0.42, 0.26], [0.10, 0.10, 0.12], [0.62, 0.40, 0.18]];
const cigarettes = c => {
  if (c.face === TOP) { rgb(c, 0.25, 0.16, 0.10); return; }
  const u = le(c), v = haut(c);
  if (mod(v, 4) === 0) { rgb(c, 0.62, 0.48, 0.20); return; }                   // la baguette
  if (mod(u, 3) === 2) { rgb(c, 0.16, 0.10, 0.06); return; }
  const p = PAQUETS[Math.floor(hash(Math.floor(u / 3), Math.floor(v / 4), 861, 0) * PAQUETS.length)];
  rgb(c, p[0], p[1], p[2]); if (mod(v, 4) === 3) mul(c, 0.8);
};
// l'ardoise des cotes : COTES, des noms à la craie, des chiffres
const COTES = E.textBitmap('COTES');
const LIGNES = [E.textBitmap('2-1'), E.textBitmap('9-1')];
const ardoise = (y0, y1, z0, z1) => c => {
  if (c.face === TOP) { rgb(c, 0.30, 0.20, 0.12); return; }
  const h = Math.floor(2 * (y1 - c.hy)), v = Math.floor(2 * (z1 - c.hz)), W2 = 2 * (y1 - y0), H2 = 2 * (z1 - z0);
  if (h < 1 || h >= W2 - 1 || v < 1 || v >= H2 - 1) { rgb(c, 0.34, 0.22, 0.12); return; }
  rgb(c, 0.10, 0.13, 0.12);
  const craie = () => rgb(c, 0.86, 0.85, 0.78);
  if (COTES.at(h - 3, v - 1)) return craie();
  if (v === 8 && h > 2 && h < W2 - 3) return rgb(c, 0.5, 0.5, 0.46);
  for (let i = 0; i < 2; i++) {
    const r0 = 9 + i * 6;
    if (LIGNES[i].at(h - (W2 - 14), v - r0)) return craie();
    if (v >= r0 + 2 && v <= r0 + 4 && h > 2 && h < W2 - 16 && mod(v, 2) === 0 && hash(h >> 1, v, 862 + i, 0) < 0.75) return rgb(c, 0.72, 0.72, 0.66);
  }
};
// la licence encadrée, et la photo de la fille à la mobylette
const licence = c => {
  if (c.face === TOP) { rgb(c, 0.3, 0.2, 0.1); return; }
  const u = le(c) - 2 * 21, v = haut(c) - 22;
  if (u <= 0 || u >= 5 || v <= 0 || v >= 5) { rgb(c, 0.62, 0.48, 0.20); return; }
  rgb(c, 0.86, 0.82, 0.70); if (mod(v, 2) === 0 && u > 1 && u < 4) rgb(c, 0.4, 0.38, 0.34);
};
const photo = c => {
  if (c.face === TOP) { rgb(c, 0.3, 0.2, 0.1); return; }
  const u = le(c) - 2 * 24, v = haut(c) - 22;
  if (u <= 0 || u >= 5 || v <= 0 || v >= 5) { rgb(c, 0.20, 0.14, 0.10); return; }
  rgb(c, 0.66, 0.62, 0.50);
  if (v <= 2 && u >= 1 && u <= 3) rgb(c, 0.22, 0.36, 0.66);                    // la mobylette bleue
  if (v === 3 && u === 2) rgb(c, 0.40, 0.26, 0.18);                            // elle
};
// la bouée de sauvetage, rouge et blanche
const bouee = (y, z) => c => {
  const d = Math.hypot(c.hy - y, c.hz - z);
  if (d < 0.9 || d > 2.5) { rgb(c, 0.44, 0.56, 0.50); grain(c, 0.03); return; }   // le mur vert, au travers et autour
  const a = Math.atan2(c.hz - z, c.hy - y);
  if (mod(Math.floor((a + Math.PI) / (Math.PI / 2)), 2)) rgb(c, 0.80, 0.16, 0.12); else rgb(c, 0.86, 0.84, 0.78);
  grain(c, 0.04);
};
// la porte de la cour : vitrée, et dans la cour, une mobylette bleue
const porteCour = jour => c => {
  if (c.face === TOP) { rgb(c, 0.3, 0.2, 0.1); return; }
  const u = Math.floor(2 * (c.hx - 31)), v = haut(c);
  if (u <= 0 || u >= 9 || v <= 0 || v >= 21 || v === 9) { rgb(c, 0.30, 0.20, 0.12); return; }
  if (v < 9) { rgb(c, 0.32, 0.22, 0.13); if (u === 7 && v === 6) rgb(c, 0.75, 0.62, 0.30); return; }
  let r = jour ? 0.62 : 0.06, g = jour ? 0.66 : 0.07, b = jour ? 0.62 : 0.12;
  if (v <= 13 && u >= 2 && u <= 6) { r = 0.22; g = 0.36; b = 0.70; if (v <= 11 && (u === 2 || u === 6)) { r = 0.06; g = 0.06; b = 0.06; } }
  if (v <= 10 && (u < 2 || u > 6)) { r = jour ? 0.42 : 0.04; g = jour ? 0.40 : 0.04; b = jour ? 0.36 : 0.05; }
  const e = jour ? 0.5 : 0.25;
  rgb(c, r * 0.3, g * 0.3, b * 0.3); c.er = r * e; c.eg = g * e; c.eb = b * e;
};
// une pile de journaux : la tranche blanche, un gros titre de couleur sur le dessus
const pile = (seed) => c => {
  if (c.face === TOP) { rgb(c, 0.84, 0.82, 0.74); const v = Math.floor(2 * c.hy), u = Math.floor(2 * c.hx); if (mod(v, 4) === 1) rgb(c, seed % 2 ? 0.55 : 0.18, 0.14, seed % 2 ? 0.14 : 0.42); else if (mod(v + u, 3) === 0) rgb(c, 0.5, 0.5, 0.48); return; }
  rgb(c, 0.80, 0.78, 0.70); if (mod(haut(c), 2)) mul(c, 0.85);
};
// la housse grise du fax public
const housse = c => { rgb(c, 0.46, 0.47, 0.48); if (c.face !== TOP && mod(le(c) + haut(c), 3) === 0) mul(c, 0.85); grain(c, 0.05); };

module.exports = {
  cle: 'tabac', nom: 'Le tabac du Quai', ambiance: 'bar', personnel: 'commercant2',
  sx: 38, sy: 30, sol: 'I_TOMETTE',
  murs: { bas: 'PANEL', haut: 'I_MUR_VERT', coupe: 7, frise: 'WOOD_DARK' },
  porte: { cote: 'y', de: 22, a: 29 },
  build(K) {
    const { M } = K;

    // ── le zinc en équerre ; derrière, le mur des cigarettes, la caisse, la licence et la photo
    K.comptoir(7, 7, 27, 10);
    K.comptoir(25, 10, 28, 15);
    K.boite(7, 10, 0, 25, 11, 1, M.METAL);
    K.boite(7, 0, 0, 27, 2, 4, M.WOOD_DARK); K.boite(7, 0, 4, 27, 2, 5, M.WOOD);
    peint(K, 8, 0, 5, 21, 1, 14, M.WOOD_DARK, cigarettes);
    K.boite(7, 0, 14, 22, 2, 15, M.WOOD_DARK);
    K.caisse(21, 0, 5);
    peint(K, 21, 0, 11, 24, 1, 14, M.PAPER, licence); peint(K, 24, 0, 11, 27, 1, 14, M.PAPER, photo);
    // le fax public sous sa housse, la radio sur son étagère
    peint(K, 24, 0, 5, 27, 2, 7, M.PLASTIC_WHITE, housse);
    K.boite(24, 0, 15, 28, 2, 16, M.WOOD_DARK); K.boite(25, 0, 16, 27, 2, 18, M.WOOD); K.voxel(26, 1, 17, M.LIT_PANEL);
    for (const x of [12, 17]) K.voxel(x, 8, 5, M.WHITE);
    K.voxel(26, 12, 5, M.WHITE);
    K.place('patron', 16, 4, { regarde: 'gauche', pour: 'lavergne' });
    K.place('marinier_1', 12, 13, { regarde: 'droite' });
    K.place('marinier_2', 18, 13, { regarde: 'droite' });
    K.place('marinier_3', 30, 13, { regarde: 'gauche' });
    K.objet('comptoir', 'Le comptoir', 16, 9, 5, { acces: [16, 13] });
    K.objet('cigarettes', 'Les cigarettes', 12, 0, 10, { acces: [10, 13] });
    K.plafonnier(12, 9, { c: [1.25, 0.95, 0.6] }); K.plafonnier(22, 9, { c: [1.25, 0.95, 0.6] });

    // ── au mur de gauche : l'ardoise des cotes, la table du 421
    peint(K, -1, 3, 5, 0, 17, 16, M.BOARD, ardoise(3, 17, 5, 16));
    K.boite(0, 3, 4, 1, 17, 5, M.WOOD_DARK); K.voxel(0, 6, 5, M.WHITE);
    K.objet('paris', 'Le tableau des paris', 0, 10, 11, { acces: [4, 12] });
    K.table(3, 19, 4, 4, { mat: M.WOOD });
    K.boite(4, 20, 4, 6, 22, 5, M.I_DRAP); K.voxel(5, 21, 5, M.WHITE);
    K.chaise(1, 19, { dos: 'x-' }); K.chaise(7, 21, { dos: 'x+' });
    K.place('table_1', 2, 20, { pose: 'assis', regarde: 'droite' });
    K.place('table_2', 8, 22, { pose: 'assis', regarde: 'gauche' });
    K.objet('des', 'La piste de 421', 5, 21, 5, { acces: [9, 19] });
    K.lampe(5, 21, 13, { r: 22, c: [1.2, 0.9, 0.55] }); K.boite(5, 21, 14, 6, 22, K.H, M.METAL_DARK);
    // la bouée, les casquettes des mariniers au portemanteau
    peint(K, 0, 21, 9, 1, 26, 14, M.PLASTIC_RED, bouee(23.5, 11.5));
    K.boite(0, 27, 10, 1, 29, 11, M.WOOD); K.voxel(1, 27, 10, M.CAR_BLUE); K.voxel(1, 28, 10, M.METAL_DARK);

    // ── les journaux, sur leur présentoir près de l'entrée
    K.boite(13, 25, 0, 21, 28, 3, M.WOOD_DARK);
    for (const [x, s] of [[13, 1], [15, 2], [17, 3], [19, 4]]) peint(K, x, 25, 3, x + 2, 28, 4 + (s % 2), M.PAPER, pile(s));
    K.objet('journaux', 'Les journaux', 17, 26, 4, { acces: [17, 23] });
    K.place('visiteur', 11, 24, { regarde: 'droite', pour: 'visiteur' });

    // ── au fond, la porte vitrée de la cour
    peint(K, 31, -1, 0, 36, 0, 11, M.WOOD_DARK, porteCour(K.jour));
    K.boite(30, 0, 0, 31, 1, 12, M.WOOD_DARK); K.boite(36, 0, 0, 37, 1, 12, M.WOOD_DARK); K.boite(30, 0, 11, 37, 1, 12, M.WOOD_DARK);
    if (K.jour) K.W.light({ x: 33.5, y: 3, z: 7, r: 18, cr: 0.30, cg: 0.32, cb: 0.32, shadow: false });
    // le calendrier des marées, le baromètre
    K.afficheY(31, 13, 3, 4, { bg: [0.80, 0.78, 0.70], fg: [0.18, 0.28, 0.48], title: 'M' });
    K.boite(29, 0, 8, 30, 1, 10, M.GOLD);
    K.plafonnier(26, 21, { c: [1.2, 0.92, 0.6] });
  },
};
