'use strict';
// La boulangerie de la rue des Lilas : la boulangère te garde une baguette et te demande le score,
// dans cet ordre. Le comptoir vitré des gâteaux ; derrière, les claies de baguettes debout et les
// pains de campagne ; la caisse, et au-dessus, dans son cadre, la photo d'un garçon en casque de
// chantier, de travers ; au fond, la porte du fournil ouverte sur la gueule du four qui rougeoie ;
// l'ardoise des prix, les sacs de farine, la farine au sol.
const E = require('../engine');
const { TOP, RIGHT, hash, mod, fbm } = E;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const grain = (c, amt, s = 0) => mul(c, 1 + (hash(c.a, c.b, c.face * 7 + s, c.m) - 0.5) * 2 * amt);
if (!E.OVERLAYS.boulangerie_pinceau) E.overlay('boulangerie_pinceau', (o, c) => o.f(c));
const peint = (K, x0, y0, z0, x1, y1, z1, m, f) => K.W.box(x0, y0, z0, x1, y1, z1, m, K.W.obj({ type: 'boulangerie_pinceau', f }));
const le = c => Math.floor(2 * (c.face === RIGHT ? c.hy : c.hx));
const haut = c => Math.floor(2 * c.hz);

// le carrelage blanc, poudré de farine devant le comptoir
const carrelage = c => {
  if (c.face !== TOP) { rgb(c, 0.60, 0.60, 0.58); return; }
  const a = mod(Math.floor(2 * c.hx), 4), b = mod(Math.floor(2 * c.hy), 4);
  if (a === 0 || b === 0) rgb(c, 0.50, 0.50, 0.48); else { rgb(c, 0.74, 0.73, 0.70); grain(c, 0.02); }
  const f = fbm(c.hx / 3, c.hy / 3, 891, 2) * Math.max(0, 1 - Math.abs(c.hy - 13.5) / 4);
  if (f > 0.35 && hash(Math.floor(2 * c.hx), Math.floor(2 * c.hy), 892, 0) < f) rgb(c, 0.86, 0.84, 0.80);
};
// la vitrine des gâteaux : un socle de bois, la vitre, deux rangs de pâtisseries éclairées
const vitrine = c => {
  if (c.face === TOP) { rgb(c, 0.20, 0.22, 0.24); c.er = 0.05; c.eg = 0.05; c.eb = 0.05; return; }
  const u = le(c), v = haut(c);
  if (v <= 2) { rgb(c, 0.52, 0.36, 0.20); if (v === 2) rgb(c, 0.66, 0.62, 0.56); return; }
  rgb(c, 0.12, 0.13, 0.14); c.er = 0.10; c.eg = 0.10; c.eb = 0.09;
  if (v === 4 || v === 7) { const k = mod(Math.floor(u / 3), 5), w = mod(u, 3);
    if (w < 2) { const p = [[0.55, 0.32, 0.16], [0.82, 0.62, 0.24], [0.78, 0.24, 0.22], [0.90, 0.86, 0.74], [0.42, 0.26, 0.18]][k]; rgb(c, p[0], p[1], p[2]); c.er = p[0] * 0.35; c.eg = p[1] * 0.35; c.eb = p[2] * 0.35; } }
  if (v === 5 || v === 8) { rgb(c, 0.58, 0.60, 0.62); c.er = 0.16; c.eg = 0.16; c.eb = 0.16; }   // les tablettes de verre
};
// les claies à pain : des baguettes debout, des miches rondes, le bois des claies
const claies = c => {
  if (c.face === TOP) { rgb(c, 0.40, 0.28, 0.16); return; }
  const u = le(c), v = haut(c);
  rgb(c, 0.36, 0.24, 0.13);
  if (mod(v, 8) === 0) { rgb(c, 0.30, 0.19, 0.10); return; }                      // la planche
  const rang = Math.floor((v - 8) / 8);
  if (rang === 1) {                                                              // les miches
    if (mod(u, 4) !== 3 && mod(v, 8) <= 4) { rgb(c, 0.62, 0.40, 0.18); if (mod(v, 8) === 4 || mod(u, 4) === 1 && mod(v, 8) === 3) rgb(c, 0.74, 0.54, 0.28); }
  } else {                                                                       // les baguettes debout
    if (mod(u, 2) === 0) { rgb(c, 0.78, 0.58, 0.26); if (mod(v, 3) === 0) rgb(c, 0.66, 0.46, 0.20); }
  }
  grain(c, 0.04);
};
// le cadre au-dessus de la caisse : la photo d'un garçon en casque de chantier, de travers
const cadre = (x0, z0) => c => {
  if (c.face === TOP) { rgb(c, 0.3, 0.2, 0.1); return; }
  const u = Math.floor(2 * (c.hx - x0)), v = Math.floor(2 * (c.hz - z0));
  if (u <= 0 || u >= 7 || v <= 0 || v >= 7) { rgb(c, 0.42, 0.28, 0.14); return; }
  rgb(c, 0.72, 0.68, 0.58);
  const ut = u - Math.floor((v - 1) / 3);                                        // la photo glissée de travers
  if (ut >= 1 && ut <= 5 && v >= 1 && v <= 6) {
    rgb(c, 0.52, 0.56, 0.62);
    if (v <= 2) rgb(c, 0.30, 0.34, 0.40);                                        // les épaules
    if (v >= 3 && v <= 4 && ut >= 2 && ut <= 4) rgb(c, 0.80, 0.62, 0.48);        // le visage
    if (v === 5 && ut >= 2 && ut <= 4) rgb(c, 0.92, 0.78, 0.18);                 // le casque jaune
  }
};
// le fournil, par la porte ouverte : la gueule du four qui rougeoie, la pelle, la farine
const fournil = jour => c => {
  if (c.face === TOP) { rgb(c, 0.2, 0.15, 0.1); return; }
  const u = Math.floor(2 * (c.hx - 25)), v = haut(c);
  rgb(c, 0.14, 0.10, 0.08); c.er = 0.06; c.eg = 0.04; c.eb = 0.02;
  if (u >= 2 && u <= 9 && v >= 4 && v <= 15) { rgb(c, 0.40, 0.22, 0.14); if (mod(v, 2) === 0 && mod(u + (v % 4 === 0 ? 1 : 0), 3) === 0) mul(c, 0.7); }   // la maçonnerie du four
  if (u >= 4 && u <= 7 && v >= 6 && v <= 9) { const k = 1 - Math.abs(v - 7.5) / 3; rgb(c, 0.9, 0.4, 0.1); c.er = 1.3 * k + 0.3; c.eg = 0.48 * k + 0.08; c.eb = 0.10; }    // la gueule
  if (u >= 3 && u <= 8 && v === 10) rgb(c, 0.20, 0.20, 0.21);
  if (u === 11 && v >= 1 && v <= 16) rgb(c, 0.50, 0.36, 0.20);                    // la pelle à enfourner
  if (u >= 0 && u <= 1 && v <= 3) { rgb(c, 0.84, 0.82, 0.76); c.er = c.eg = c.eb = 0.05; }   // un sac de farine
};
// les corbeilles d'osier des viennoiseries : des croissants dorés
const croissants = c => {
  if (c.face !== TOP) { rgb(c, 0.56, 0.40, 0.22); if (mod(le(c) + haut(c), 2)) mul(c, 0.82); return; }
  const u = Math.floor(2 * c.hx), v = Math.floor(2 * c.hy);
  rgb(c, 0.56, 0.40, 0.22);
  if (mod(u, 4) !== 0 && mod(v, 3) !== 0) { rgb(c, 0.82, 0.58, 0.24); if (mod(u + v, 3) === 0) rgb(c, 0.66, 0.42, 0.16); }
};
// la gerbe de blé séché, nouée d'un ruban
const gerbe = c => {
  const u = le(c), v = haut(c);
  rgb(c, 0.76, 0.62, 0.30); if (mod(u + v, 3) === 0) mul(c, 0.8);
  if (v >= 22) { if (mod(u, 2)) rgb(c, 0.62, 0.46, 0.20); }                       // les épis
  if (v === 20 || v === 21) rgb(c, 0.55, 0.14, 0.16);                            // le ruban
};
// l'ardoise des prix
const ardoise = c => {
  rgb(c, 0.10, 0.13, 0.12);
  if (c.face === TOP) { rgb(c, 0.3, 0.2, 0.12); return; }
  const u = le(c), v = haut(c);
  if (mod(v, 2) === 1 && hash(u >> 1, v, 893, 0) < 0.7 && mod(u, 9) !== 0) rgb(c, 0.78, 0.78, 0.72);
};

module.exports = {
  cle: 'boulangerie_residentiel', nom: 'La boulangerie de la rue des Lilas', ambiance: 'boutique', personnel: 'commercant',
  sx: 34, sy: 28, sol: 'I_CARRELAGE_BLANC',
  murs: { bas: 'FAIENCE', haut: 'I_MUR_OCRE', coupe: 6, frise: 'WOOD' },
  porte: { cote: 'x', de: 16, a: 23 },
  build(K) {
    const { M, SX, SY } = K;
    peint(K, 0, 0, -1, SX, SY, 0, M.I_CARRELAGE_BLANC, carrelage);

    // ── le comptoir vitré des gâteaux, la caisse au bout
    peint(K, 3, 9, 0, 23, 12, 5, M.GLASS, vitrine);
    K.boite(3, 9, 5, 23, 12, 6, M.I_FORMICA);
    K.caisse(18, 10, 6);
    K.boite(4, 10, 6, 7, 12, 7, M.I_CARTON); K.voxel(5, 10, 7, M.WOOD);           // la corbeille de baguettes du jour
    K.W.light({ x: 13, y: 13, z: 3, r: 10, cr: 0.35, cg: 0.30, cb: 0.22, shadow: false });
    K.objet('comptoir', 'Le comptoir', 11, 10, 6, { acces: [11, 14] });
    K.objet('caisse', 'La caisse', 19, 11, 7, { acces: [17, 14] });
    K.place('client_1', 9, 14, { regarde: 'droite' });
    K.place('client_2', 15, 15, { regarde: 'droite' });

    // ── derrière : les claies à pain, contre le mur du fond
    K.boite(2, 0, 0, 16, 3, 4, M.WOOD_DARK);
    peint(K, 2, 0, 4, 16, 2, 13, M.WOOD, claies);
    K.boite(2, 0, 13, 16, 3, 14, M.WOOD_DARK);
    K.objet('pains', 'Les pains', 9, 1, 9, { acces: [9, 6] });
    K.place('vendeuse', 8, 5, { regarde: 'gauche', pour: 'personnel' });
    K.place('boulangere', 19, 6, { regarde: 'gauche', pour: 'mariejo' });
    // le cadre au-dessus de la caisse
    peint(K, 18, 0, 10, 22, 1, 14, M.WOOD, cadre(18, 10));
    K.objet('cadre', 'Le cadre derrière la caisse', 20, 1, 12, { acces: [21, 14] });
    // la trancheuse sur sa desserte
    K.boite(18, 0, 0, 23, 3, 4, M.WOOD_DARK); K.boite(19, 0, 4, 22, 2, 7, M.METAL);

    // ── au fond, la porte du fournil, ouverte sur le four
    peint(K, 25, -2, 0, 31, 0, 9, M.BRICK, fournil(K.jour));
    K.boite(24, 0, 0, 25, 1, 10, M.WOOD); K.boite(31, 0, 0, 32, 1, 10, M.WOOD); K.boite(24, 0, 9, 32, 1, 10, M.WOOD);
    K.W.light({ x: 28, y: 2, z: 4, r: 18, cr: 1.0, cg: 0.45, cb: 0.12, shadow: false });
    K.objet('four', 'Le four, au fond', 28, 0, 4, { acces: [28, 4] });
    // les sacs de farine, contre le mur, à côté du fournil
    for (const [x, z] of [[32, 0], [32, 2]]) K.boite(x, 1, z, 34, 4, z + 2, M.CANVAS);

    // ── au mur de gauche : l'ardoise des prix, la gerbe de blé, le calendrier du moulin
    peint(K, -1, 4, 8, 0, 12, 14, M.BOARD, ardoise);
    K.boite(0, 4, 7, 1, 12, 8, M.WOOD);
    peint(K, 0, 15, 8, 1, 17, 14, M.WOOD, gerbe);
    K.afficheX(19, 8, 4, 5, { bg: [0.86, 0.82, 0.68], fg: [0.42, 0.24, 0.10], band: [0.62, 0.50, 0.24] });
    K.place('visiteur', 4, 18, { regarde: 'gauche', pour: 'visiteur' });
    // le présentoir des viennoiseries, près de la porte
    K.boite(25, 25, 0, 31, 28, 4, M.WOOD_DARK);
    peint(K, 25, 25, 4, 31, 28, 5, M.I_CARTON, croissants);
    K.place('client_3', 23, 21, { regarde: 'droite' });

    K.plafonnier(10, 12, { c: [1.3, 1.0, 0.65] }); K.plafonnier(24, 15, { c: [1.3, 1.0, 0.65] });
  },
};
