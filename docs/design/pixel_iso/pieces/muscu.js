'use strict';
// La salle de muscu, dans l'ancien garage Mazurier : le rideau de fer condamné et, au-dessus,
// GARAGE MAZURIER à moitié effacé ; la fosse de vidange couverte de planches ; les taches d'huile
// qui ne sont jamais parties. Le grand miroir et le râtelier d'haltères, le banc de développé sur
// ses tapis de caoutchouc, la cage à squat, le tapis de course sous la fenêtre haute, le sac de
// frappe à sa potence, la radio qui crache sur son étagère, le banc où l'on souffle, les néons.
const E = require('../engine');
const { M } = require('../mats');
const { LEFT, TOP, hash, mod, fbm, overlay } = E;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };

// le pinceau de la salle (aucune matière nouvelle) : `miroir`, la glace, ses reflets en biais
overlay('muscu_pinceau', (o, c) => {
  if (o.f !== 'miroir') return;
  if (c.face === TOP) { rgb(c, 0.30, 0.30, 0.30); return; }
  rgb(c, 0.50, 0.56, 0.60);
  const d = mod(c.a - c.b, 13);
  if (d < 2) rgb(c, 0.80, 0.84, 0.86); else if (d < 3) rgb(c, 0.64, 0.70, 0.74);
  c.er = 0.04; c.eg = 0.05; c.eb = 0.06;
});

// les taches d'huile : des ellipses sombres et luisantes
overlay('muscu_huile', (o, c) => {
  if (c.face !== TOP) return;
  for (const [hx, hy, rx, ry] of o.taches) {
    const d = Math.hypot((c.hx - hx) / rx, (c.hy - hy) / ry) + 0.4 * (fbm(c.hx / 2, c.hy / 2, 9901) - 0.5);
    if (d < 1) { mul(c, d < 0.6 ? 0.35 : 0.55); c.wet = 0.55; return; }
  }
});

module.exports = {
  cle: 'muscu', nom: 'La salle de muscu', ambiance: 'vestiaire',
  sx: 46, sy: 34, sol: 'I_BETON',
  murs: { bas: 'BRICK_OLD', haut: 'I_MUR_GRIS', coupe: 8 },
  porte: { cote: 'x', de: 22, a: 29 },
  build(K) {
    const { M } = K;
    // ─── le sol : les taches d'huile, la fosse sous ses planches, les tapis de caoutchouc
    { const id = K.W.obj({ type: 'muscu_huile', taches: [[10, 15, 3, 2], [36, 30, 2.5, 1.6], [16, 28, 1.6, 1.2]] }); K.W.box(0, 0, -1, K.SX, K.SY, 0, M.I_BETON, id); }
    K.boite(13, 12, -1, 31, 17, 0, M.METAL_DARK); K.boite(14, 13, -1, 30, 16, 0, M.WOOD);
    for (let x = 16; x < 30; x += 3) K.boite(x, 13, -1, x + 1, 16, 0, M.WOOD_DARK);
    K.boite(19, 18, -1, 33, 27, 0, M.I_SKAI); K.boite(23, 3, -1, 41, 10, 0, M.I_SKAI);
    // ─── le rideau de fer de l'ancien garage, condamné, et l'enseigne peinte au-dessus
    K.murY.door(3, 0, 16, 12, { kind: 'rideau', frameMat: M.METAL_DARK });
    K.murY.sign(3, 17, 'GARAGE MAZURIER', { fg: [0.78, 0.76, 0.66], depth: 0, worn: 0.35 });
    // ─── le grand miroir, le râtelier d'haltères devant, l'arbre à disques
    K.W.box(23, 0, 2, 40, 1, 12, M.CHROME, K.W.obj({ type: 'muscu_pinceau', f: 'miroir' })); K.boite(22, 0, 1, 41, 1, 2, M.METAL_DARK); K.boite(22, 0, 12, 41, 1, 13, M.METAL_DARK);
    K.objet('miroir', 'Le miroir', 26, 0, 8, { acces: [24, 8] });
    K.boite(27, 1, 0, 38, 4, 1, M.METAL_DARK); K.boite(27, 1, 2, 38, 3, 3, M.METAL_DARK);
    for (const x of [27, 37]) K.boite(x, 1, 0, x + 1, 4, 4, M.METAL_DARK);
    for (let x = 28; x < 37; x += 2) { K.voxel(x, 2, 3, M.METAL_DARK); K.voxel(x, 3, 1, M.METAL_DARK); K.voxel(x + 1, 3, 1, M.CHROME); K.voxel(x + 1, 2, 3, M.CHROME); }
    K.objet('halteres', 'Les haltères', 32, 2, 3, { acces: [32, 7] });
    K.boite(39, 6, 0, 40, 7, 6, M.METAL);
    for (let z = 0; z < 5; z += 1) K.boite(38, 5, z, 41, 8, z + 1, z % 2 ? M.METAL_DARK : M.TIRE);
    K.place('client_1', 33, 7, { regarde: 'droite', pour: 'client' });
    // ─── la cage à squat dans le coin, sa barre posée
    for (const [px, py] of [[41, 1], [45, 1], [41, 7], [45, 7]]) K.boite(px, py, 0, px + 1, py + 1, 14, M.METAL_DARK);
    K.boite(41, 1, 13, 46, 8, 14, M.METAL_DARK); K.boite(41, 0, 9, 42, 9, 10, M.CHROME);
    K.boite(40, 0, 9, 41, 2, 11, M.METAL_DARK); K.boite(40, 7, 9, 41, 9, 11, M.METAL_DARK);
    // ─── le banc de développé, ses montants, la barre et ses disques
    K.boite(21, 21, 0, 22, 23, 2, M.METAL); K.boite(26, 21, 0, 27, 23, 2, M.METAL);
    K.boite(20, 21, 2, 28, 23, 3, M.I_SKAI);
    for (const y of [19, 24]) K.boite(27, y, 0, 28, y + 1, 7, M.METAL_DARK);
    K.boite(27, 15, 6, 28, 29, 7, M.CHROME);
    for (const y of [16, 26]) K.boite(26, y, 5, 29, y + 2, 8, M.METAL_DARK);
    K.objet('banc', 'Le banc de développé', 24, 22, 3, { acces: [23, 26] });
    K.place('steph', 30, 22, { regarde: 'gauche', pour: 'steph' });
    // ─── le tapis de course, sous la fenêtre haute
    K.boite(3, 3, 0, 12, 7, 1, M.METAL_DARK); K.boite(4, 4, 1, 12, 6, 2, M.I_SKAI);
    for (const y of [3, 6]) K.boite(3, y, 1, 4, y + 1, 7, M.METAL);
    K.boite(2, 3, 7, 4, 7, 8, M.METAL_DARK); K.voxel(3, 4, 8, M.LIT_PANEL);
    for (const y of [3, 6]) K.boite(4, y, 5, 8, y + 1, 6, M.METAL);
    K.objet('tapis', 'Le tapis de course', 8, 5, 2, { acces: [9, 9] });
    K.fenetreX(2, 12, 9, 4, { rebord: false });
    // ─── l'étagère : la radio qui crache, une bouteille, une serviette
    K.boite(0, 11, 8, 2, 17, 9, M.WOOD);
    K.boite(0, 12, 9, 2, 15, 11, M.METAL_DARK); K.voxel(1, 12, 10, M.CHROME); K.voxel(1, 14, 10, M.CHROME); K.voxel(1, 13, 11, M.METAL);
    K.voxel(1, 16, 9, M.PLASTIC_WHITE); K.boite(0, 11, 5, 1, 13, 8, M.TOWEL);
    K.lampe(2.5, 13.5, 10, { r: 8, c: [0.6, 0.5, 0.25], cache: true });
    K.objet('radio', 'La radio', 1, 13, 10, { acces: [4, 14] });
    // ─── le sac de frappe à sa potence, la corde à sauter au clou
    K.boite(0, 20, 15, 6, 21, 16, M.METAL_DARK); K.boite(0, 20, 12, 1, 21, 15, M.METAL_DARK);
    K.boite(4, 20, 10, 5, 21, 15, M.METAL);
    K.boite(3, 19, 3, 6, 22, 10, M.PLASTIC_RED); K.boite(3, 19, 9, 6, 22, 10, M.METAL_DARK);
    K.objet('sac', 'Le sac de frappe', 4, 20, 6, { acces: [8, 21] });
    K.place('client_3', 8, 24, { regarde: 'gauche', pour: 'client' });
    K.boite(0, 17, 4, 1, 18, 9, M.PLASTIC_RED);
    // ─── le banc où l'on souffle, le tableau du programme, la fontaine à eau
    K.banc(0, 26, 3, 33, { mat: M.WOOD });
    K.boite(0, 26, 8, 1, 33, 13, M.WHITE); K.afficheX(27, 9, 5, 3, { bg: [0.88, 0.88, 0.86], fg: [0.15, 0.25, 0.55], seed: 9902, depth: -1 });
    K.place('client_2', 1, 30, { pose: 'assis', regarde: 'droite', pour: 'client' });
    K.boite(42, 30, 0, 44, 32, 5, M.PLASTIC_WHITE); K.boite(42, 30, 5, 44, 32, 7, M.I_ECRAN_BLEU);
    K.place('visiteur', 40, 25, { regarde: 'gauche', pour: 'visiteur' });
    // ─── la lumière : trois tubes au plafond, en travers ; le jour, la fenêtre haute
    for (const [x, y0] of [[12, 10], [26, 14], [38, 12]]) K.neon(x, y0, x + 1, y0 + 12, 17, M.TUBE, { c: [0.75, 0.85, 0.85], r: 44 });
    if (K.jour) K.W.light({ x: 4, y: 6, z: 12, r: 28, cr: 0.30, cg: 0.32, cb: 0.34, shadow: false });
  },
};
