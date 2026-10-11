'use strict';
// Le tabac-presse du carrefour, à deux pas du stade : les journaux du matin, la grille du loto, et
// le patron qui sait le score avant tout le monde (la radio, sur l'étagère). Un sol de granito, le
// comptoir et le mur des cigarettes ; la vitrine-présentoir et ses montres, éclairée ; le grand mur
// des journaux et des magazines, l'affiche du match de samedi, les écharpes au-dessus ; le pupitre
// où l'on remplit les grilles, sous la pendule ; le flipper près de l'entrée.
const E = require('../engine');
const { TOP, RIGHT, hash, mod } = E;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const grain = (c, amt, s = 0) => mul(c, 1 + (hash(c.a, c.b, c.face * 7 + s, c.m) - 0.5) * 2 * amt);
if (!E.OVERLAYS.tabac_stade_pinceau) E.overlay('tabac_stade_pinceau', (o, c) => o.f(c));
const peint = (K, x0, y0, z0, x1, y1, z1, m, f) => K.W.box(x0, y0, z0, x1, y1, z1, m, K.W.obj({ type: 'tabac_stade_pinceau', f }));
const le = c => Math.floor(2 * (c.face === RIGHT ? c.hy : c.hx));
const haut = c => Math.floor(2 * c.hz);

// le granito : un gris clair moucheté de noir, de rouge et de blanc, des joints de laiton
const granito = c => {
  if (c.face !== TOP) { rgb(c, 0.40, 0.39, 0.37); return; }
  rgb(c, 0.44, 0.43, 0.41);
  const u = Math.floor(2 * c.hx), v = Math.floor(2 * c.hy), h = hash(u, v, 871, 0);
  if (h < 0.06) rgb(c, 0.28, 0.28, 0.28); else if (h < 0.09) rgb(c, 0.52, 0.34, 0.28); else if (h < 0.14) rgb(c, 0.54, 0.53, 0.50);
  if (mod(u, 12) === 0 || mod(v, 12) === 0) rgb(c, 0.48, 0.42, 0.28);
  grain(c, 0.03);
};
// le mur des cigarettes, derrière le comptoir
const PAQUETS = [[0.70, 0.14, 0.12], [0.80, 0.78, 0.72], [0.72, 0.60, 0.24], [0.16, 0.24, 0.46], [0.10, 0.10, 0.12], [0.24, 0.40, 0.28]];
const cigarettes = c => {
  if (c.face === TOP) { rgb(c, 0.25, 0.16, 0.10); return; }
  const u = le(c), v = haut(c);
  if (mod(v, 5) === 0) { rgb(c, 0.20, 0.13, 0.08); return; }
  if (mod(u, 2) === 1 && mod(Math.floor(u / 2), 3) === 2) { rgb(c, 0.16, 0.10, 0.06); return; }
  const p = PAQUETS[Math.floor(hash(Math.floor(u / 2), Math.floor(v / 5), 872, 0) * PAQUETS.length)];
  rgb(c, p[0], p[1], p[2]); if (mod(v, 5) === 4) mul(c, 1.12);
};
// le mur des journaux et des magazines : des couvertures, leur titre en haut
const magazines = c => {
  if (c.face === TOP) { rgb(c, 0.30, 0.20, 0.12); return; }
  const u = le(c), v = haut(c);
  if (mod(v, 6) === 0) { rgb(c, 0.34, 0.22, 0.12); return; }                    // la tablette
  const k = Math.floor(u / 4), r = Math.floor(v / 6), h = hash(k, r, 873, 0);
  if (mod(u, 4) === 3) { rgb(c, 0.18, 0.12, 0.08); return; }
  if (r < 1) {                                                                  // en bas : les quotidiens, gris
    rgb(c, 0.78, 0.77, 0.72); if (mod(v, 6) === 4) rgb(c, h < 0.5 ? 0.62 : 0.18, 0.14, h < 0.5 ? 0.14 : 0.40); else if (mod(v, 2) === 0 && mod(u, 4) !== 0) rgb(c, 0.45, 0.45, 0.43);
    return;
  }
  const p = [[0.68, 0.20, 0.18], [0.20, 0.36, 0.58], [0.74, 0.64, 0.26], [0.24, 0.46, 0.32], [0.80, 0.78, 0.72], [0.50, 0.26, 0.44], [0.16, 0.16, 0.18]][Math.floor(h * 7)];
  rgb(c, p[0], p[1], p[2]);
  if (mod(v, 6) === 5) rgb(c, 0.92, 0.90, 0.84);                                // le titre
  else if (hash(u, v, 874, 0) < 0.2) mul(c, 0.7);
};
// la vitrine-présentoir : des montres sur du velours, éclairées par-dessus
const vitrine = c => {
  if (c.face === TOP) { rgb(c, 0.10, 0.12, 0.14); c.er = 0.06; c.eg = 0.07; c.eb = 0.08; return; }
  const u = le(c), v = haut(c);
  rgb(c, 0.10, 0.06, 0.08); c.er = 0.10; c.eg = 0.06; c.eb = 0.07;
  if (mod(v, 3) === 0) { rgb(c, 0.5, 0.5, 0.5); c.er = 0.20; c.eg = 0.20; c.eb = 0.19; return; }
  if (mod(u, 3) === 1 && mod(v, 3) === 1) { const or = hash(u, v, 875, 0) < 0.5; rgb(c, or ? 0.9 : 0.8, or ? 0.72 : 0.8, or ? 0.3 : 0.82); c.er = or ? 0.7 : 0.6; c.eg = or ? 0.55 : 0.62; c.eb = or ? 0.2 : 0.65; }
};
// le tourniquet : des briquets, des porte-clés, des cartes postales du stade, accrochés en rangs
const tourniquet = c => {
  if (c.face === TOP) { rgb(c, 0.5, 0.5, 0.5); return; }
  const u = le(c), v = haut(c);
  rgb(c, 0.55, 0.56, 0.58);
  if (mod(v, 4) === 0) return;
  const p = [[0.80, 0.20, 0.18], [0.22, 0.42, 0.72], [0.88, 0.78, 0.30], [0.86, 0.84, 0.78], [0.46, 0.12, 0.18], [0.30, 0.56, 0.32]][Math.floor(hash(u, Math.floor(v / 4), 877, c.face) * 6)];
  if (mod(u, 2) === 0 || v >= 12) rgb(c, p[0], p[1], p[2]);
};
// le bac à glaces : émail blanc, le couvercle de verre, les glaces dessous, éclairées
const bacAGlaces = c => {
  if (c.face !== TOP) { rgb(c, 0.80, 0.80, 0.78); if (haut(c) === 6) rgb(c, 0.20, 0.36, 0.62); grain(c, 0.02); return; }
  const u = Math.floor(2 * c.hx), v = Math.floor(2 * c.hy);
  if (u === 56 || u === 67 || v === 44 || v === 51) { rgb(c, 0.70, 0.70, 0.70); return; }
  const p = [[0.92, 0.88, 0.80], [0.86, 0.50, 0.58], [0.50, 0.30, 0.18], [0.90, 0.80, 0.30], [0.50, 0.78, 0.60]][mod(Math.floor(u / 2) + Math.floor(v / 2) * 3, 5)];
  rgb(c, p[0] * 0.6, p[1] * 0.6, p[2] * 0.6); c.er = p[0] * 0.4; c.eg = p[1] * 0.4; c.eb = p[2] * 0.42;
};
// les grilles du loto sur le pupitre
const grilles = c => {
  if (c.face !== TOP) { rgb(c, 0.30, 0.20, 0.12); grain(c, 0.05); return; }
  const u = Math.floor(2 * c.hx), v = Math.floor(2 * c.hy);
  rgb(c, 0.86, 0.84, 0.78);
  if (mod(u, 2) === 0 || mod(v, 3) === 0) rgb(c, 0.78, 0.36, 0.34);
  if (hash(u, v, 876, 0) < 0.08) rgb(c, 0.15, 0.15, 0.2);
};
// les boules, au-dessus du pupitre : un panneau sombre, cinq boules de couleur
const boules = c => {
  rgb(c, 0.12, 0.14, 0.24);
  if (c.face === TOP) return;
  const u = le(c) - 12, v = haut(c) - 24;
  for (let i = 0; i < 5; i++) {
    if (Math.hypot(u - (0.5 + i * 1.75), v - 2.5) < 0.9) { const p = [[0.9, 0.2, 0.2], [0.95, 0.8, 0.2], [0.2, 0.6, 0.9], [0.3, 0.8, 0.4], [0.9, 0.9, 0.9]][i]; rgb(c, p[0], p[1], p[2]); c.er = p[0] * 0.5; c.eg = p[1] * 0.5; c.eb = p[2] * 0.5; }
  }
};
// la pendule : un cadran, deux aiguilles
const pendule = (x0, z0) => c => {
  rgb(c, 0.84, 0.82, 0.76);
  if (c.face === TOP) { rgb(c, 0.2, 0.2, 0.22); return; }
  const u = le(c) - 2 * x0, v = haut(c) - 2 * z0, d = Math.hypot(u - 2.5, v - 2.5);
  if (d > 3.1) { rgb(c, 0.62, 0.48, 0.28); return; }
  if (d > 2.5) rgb(c, 0.15, 0.15, 0.16);
  if ((u === 2 && v >= 2 && v <= 4) || (v === 2 && u >= 2 && u <= 4)) rgb(c, 0.08, 0.08, 0.08);
};

module.exports = {
  cle: 'tabac_stade', nom: 'Le tabac-presse du carrefour', ambiance: 'boutique', personnel: 'commercant',
  sx: 36, sy: 30, sol: 'I_TOMETTE',
  murs: { bas: 'PANEL', haut: 'I_MUR_OCRE', coupe: 6 },
  porte: { cote: 'y', de: 22, a: 29 },
  build(K) {
    const { M, SX, SY } = K;
    peint(K, 0, 0, -1, SX, SY, 0, M.I_TOMETTE, granito);

    // ── le comptoir, le long du mur de gauche ; derrière, le mur des cigarettes et la radio
    K.comptoir(5, 7, 8, 19, { dessus: M.I_FORMICA });
    K.boite(0, 7, 0, 2, 19, 4, M.WOOD_DARK);
    peint(K, 0, 7, 4, 1, 19, 13, M.WOOD_DARK, cigarettes);
    K.boite(0, 7, 13, 2, 19, 14, M.WOOD_DARK);
    K.boite(0, 9, 14, 2, 12, 16, M.METAL_DARK); K.voxel(1, 10, 15, M.LIT_PANEL);           // la radio
    K.caisse(5, 15);
    for (const y of [9, 11]) K.voxel(7, y, 5, M.PAPER);
    K.place('patron', 3, 12, { regarde: 'droite', pour: 'personnel' });
    K.place('comptoir_1', 10, 10, { regarde: 'gauche' });
    K.place('comptoir_2', 10, 14, { regarde: 'gauche' });
    K.objet('comptoir', 'Le comptoir', 7, 12, 5, { acces: [10, 12] });

    // ── la vitrine-présentoir, au bout du comptoir : les montres, les briquets, éclairée
    K.boite(5, 19, 0, 8, 23, 3, M.WOOD_DARK);
    peint(K, 5, 19, 3, 8, 23, 7, M.GLASS, vitrine);
    K.boite(5, 19, 7, 8, 23, 8, M.WOOD_DARK);
    K.W.light({ x: 9, y: 21, z: 6, r: 12, cr: 0.5, cg: 0.45, cb: 0.35, shadow: false });
    K.objet('cigarettes', 'Le présentoir', 7, 21, 6, { acces: [10, 21] });

    // ── au fond : le pupitre des grilles, sous la pendule et les boules
    K.boite(5, 1, 0, 11, 4, 4, M.WOOD_DARK);
    peint(K, 5, 1, 4, 11, 4, 5, M.WOOD, grilles);
    K.voxel(6, 2, 5, M.METAL_DARK); K.voxel(9, 3, 5, M.METAL_DARK);
    peint(K, 6, 0, 12, 10, 1, 15, M.METAL_DARK, boules);
    peint(K, 7, 0, 15, 10, 1, 18, M.WHITE, pendule(7, 15));
    K.objet('loto', 'La grille du loto', 8, 2, 5, { acces: [8, 6] });
    K.place('loto_1', 11, 6, { regarde: 'droite' });

    // ── le grand mur des journaux et des magazines ; l'affiche du match, les écharpes
    peint(K, 13, 0, 1, 35, 2, 14, M.WOOD_DARK, magazines);
    K.boite(13, 0, 0, 35, 3, 1, M.WOOD_DARK);
    K.afficheY(13, 14, 15, 4, { title: 'SAM 15H', bg: [0.42, 0.11, 0.16], fg: [0.90, 0.84, 0.66] });
    for (const x of [29, 32]) K.boite(x, 0, 14, x + 3, 1, 17, M.JERSEY);
    // les quotidiens du matin, en piles, au pied du mur
    for (const x of [15, 19, 23]) { K.boite(x, 3, 0, x + 3, 6, 2, M.PAPER); K.boite(x, 3, 2, x + 3, 6, 3, M.WHITE); }
    K.objet('journaux', 'Les journaux', 24, 1, 8, { acces: [24, 8] });
    K.place('presse_1', 18, 8, { regarde: 'droite' });
    K.place('visiteur', 29, 8, { regarde: 'droite', pour: 'visiteur' });

    // ── le flipper, près de l'entrée, contre le mur de gauche
    K.flipper(0, 25, 'x');
    K.objet('flipper', 'Le flipper', 2, 26, 5, { acces: [7, 26] });
    K.afficheX(25, 9, 3, 4, { title: 'RIVE', bg: [0.86, 0.82, 0.70], fg: [0.42, 0.11, 0.16] });

    // ── au milieu, le tourniquet des briquets et des cartes postales ; près de la porte, le bac à glaces
    K.boite(16, 17, 0, 18, 19, 1, M.METAL_DARK);
    peint(K, 16, 17, 1, 18, 19, 9, M.METAL, tourniquet);
    K.boite(16, 17, 9, 18, 19, 10, M.PLASTIC_RED);
    peint(K, 28, 22, 0, 34, 26, 3, M.ENAMEL, bacAGlaces);
    K.W.light({ x: 31, y: 24, z: 5, r: 10, cr: 0.25, cg: 0.30, cb: 0.36, shadow: false });
    K.place('client_3', 26, 20, { regarde: 'droite' });
    // la lumière : deux tubes au plafond, une ampoule au-dessus du pupitre
    K.neon(10, 12, 20, 13, 16, M.TUBE, { c: [0.85, 0.92, 0.85], r: 52 });
    K.neon(20, 18, 30, 19, 16, M.TUBE, { c: [0.85, 0.92, 0.85], r: 52 });
    for (const [x, y] of [[11, 12], [19, 12], [21, 18], [29, 18]]) K.voxel(x, y, 17, M.METAL_DARK);
    K.lampe(8, 3, 11, { r: 16, c: [1.2, 0.9, 0.6], cache: true });
  },
};
