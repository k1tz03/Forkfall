'use strict';
// Le wagon abandonné, au bout de la voie de l'usine : une vieille voiture de voyageurs, tôle
// verte et bois. Contre la porte du bout, condamnée, quelqu'un a mis un matelas : une couverture,
// un sac de sport du club en guise d'oreiller, une radio à piles ; à côté, la bougie sur une
// caisse retournée. Plus loin, le dernier compartiment : deux banquettes de bois face à face
// sous la vitre fêlée, rafistolée au carton. Les filets à bagages, des journaux par terre.
const E = require('../engine');
const { M } = require('../mats');
const { LEFT, hash, mod, overlay } = E;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };

// une fenêtre de voiture : un cadre de bois, la traverse de l'imposte, le ciel ou la nuit ;
// `casse` : un impact en étoile, et un carton scotché sur le coin du bas
overlay('wagon_vitre', (o, c) => {
  if (c.face !== o.face) return;
  const la = o.face === LEFT ? Math.floor(2 * c.hx) - 2 * o.a0 : 2 * o.a0 - 1 - Math.floor(2 * c.hy);
  const lb = Math.floor(2 * c.hz) - 2 * o.z0, W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  if (la === 0 || la === W2 - 1 || lb === 0 || lb === H2 - 1 || lb === H2 - 4) { rgb(c, 0.36, 0.24, 0.14); c.er = c.eg = c.eb = 0; return; }
  if (o.casse && la <= W2 * 0.42 && lb <= H2 * 0.45) {                       // le carton
    rgb(c, 0.52, 0.40, 0.25); if (la === 3 || lb === 3) rgb(c, 0.70, 0.66, 0.55); c.er = c.eg = c.eb = 0; return;
  }
  const jour = o.jour;
  let col = jour ? [0.66, 0.70, 0.74] : [0.10, 0.13, 0.28], k = jour ? 0.5 : 0.45;
  if (lb > H2 * 0.55) k *= 0.85;
  if ((la + lb * 2) % 9 < 2) { col = jour ? [0.85, 0.86, 0.86] : [0.16, 0.18, 0.30]; }       // les traînées sur la vitre
  if (o.casse) {
    const dx = la - W2 * 0.62, dy = lb - H2 * 0.55, d = Math.hypot(dx, dy), a = Math.atan2(dy, dx);
    const rayon = mod(a * 7 / (2 * Math.PI) + 0.5, 1) < 0.16 && d < W2 * 0.55;
    if (d < 1.3 || rayon || (Math.abs(d - 3.2) < 0.5 && hash(la, lb, 9601, 0) < 0.6)) { col = jour ? [0.95, 0.96, 0.96] : [0.40, 0.44, 0.60]; k = jour ? 0.7 : 0.4; }
  }
  rgb(c, col[0] * 0.3, col[1] * 0.3, col[2] * 0.3);
  c.er = col[0] * k; c.eg = col[1] * k; c.eb = col[2] * k;
});

module.exports = {
  cle: 'wagon', nom: 'Le wagon abandonné', ambiance: 'nuit',
  sx: 40, sy: 14, h: 15, sol: 'WOOD',
  murs: { bas: 'METAL_GREEN', haut: 'METAL_GREEN', coupe: 4 },
  porte: { cote: 'y', de: 30, a: 36 },
  build(K) {
    const { M } = K;
    // la voûte : le mur du bout s'arrondit, le plafond crème amorce sa courbe le long du mur
    for (let y = 0; y < K.SY; y++) {
      const haut = 12 + Math.round(3 * Math.sin(Math.PI * (y + 0.5) / K.SY));
      K.boite(-2, y, haut, 0, y + 1, K.H, 0);
      K.boite(-1, y, haut - 1, 0, y + 1, haut, M.PAINT_CREAM);
    }
    K.boite(-2, -2, 13, K.SX, 0, K.H, 0);
    K.boite(0, 0, 13, K.SX, 1, 14, M.PAINT_CREAM);
    K.boite(-1, -1, 12, K.SX, 0, 13, M.WOOD);
    // les fenêtres (la deuxième fêlée), les filets à bagages au-dessus
    const fenetres = [[3, false], [19, false], [29, true]];
    for (const [x, casse] of fenetres) K.fenetreY(x, 4, 6, 5, { type: 'wagon_vitre', casse, jour: K.jour, sillMat: M.WOOD, lintelMat: M.WOOD });
    K.objet('vitre', 'La vitre cassée', 32, 0, 7, { acces: [32, 6] });
    for (let x = 1; x < K.SX - 1; x++) { K.voxel(x, 1, 11, M.METAL); K.voxel(x, 0, 11, mod(x, 2) ? M.NET : M.METAL); if (mod(x, 6) === 1) K.voxel(x, 0, 10, M.METAL); }
    K.boite(30, 0, 12, 35, 2, 14, M.LEATHER);                                         // une valise oubliée
    // la porte du bout, condamnée derrière le matelas
    K.boite(0, 4, 0, 1, 10, 10, M.WOOD_DARK); K.boite(0, 5, 6, 1, 9, 9, M.GLASS);
    K.boite(0, 3, 0, 1, 4, 11, M.WOOD); K.boite(0, 10, 0, 1, 11, 11, M.WOOD); K.boite(0, 3, 10, 1, 11, 11, M.WOOD);
    // le matelas, la couverture, le sac du club en oreiller, la radio à piles
    K.boite(1, 1, 0, 12, 9, 1, M.TOWEL);
    for (let x = 5; x < 12; x++) for (let y = 1; y < 9; y++) K.voxel(x, y, 1, hash(x, y, 9602, 0) < 0.3 && x > 5 ? M.SEAT_GREY : M.CANVAS);
    for (const [x, y] of [[7, 3], [8, 6], [10, 4]]) K.voxel(x, y, 2, M.CANVAS);
    K.boite(1, 2, 1, 4, 8, 3, M.SEAT); K.boite(1, 4, 1, 4, 6, 3, M.SEAT_GREY); K.boite(2, 2, 3, 3, 3, 4, M.SEAT_GREY);
    K.objet('matelas', 'Le matelas', 7, 5, 2, { acces: [7, 11] });
    K.objet('sac', 'Le sac de quelqu\'un', 2, 5, 3, { acces: [3, 11] });
    K.boite(8, 7, 1, 10, 8, 2, M.METAL_DARK); K.voxel(9, 7, 2, M.CHROME);
    K.place('mercadier', 9, 9, { pose: 'assis', regarde: 'droite', pour: 'mercadier' });
    // la caisse retournée, la bougie dans son pot, les bouteilles vides
    K.boite(12, 1, 0, 15, 4, 3, M.WOOD);
    K.voxel(13, 2, 3, M.GLASS); K.voxel(13, 2, 4, M.WHITE);
    K.lampe(13.5, 2.5, 5.2, { r: 32, c: [1.4, 0.82, 0.35], toujours: true });
    K.objet('bougie', 'La bougie', 13, 2, 4, { acces: [14, 7] });
    K.voxel(15, 5, 0, M.BOTTLE); K.voxel(16, 6, 0, M.BOTTLE); K.boite(14, 6, 0, 16, 7, 1, M.BOTTLE);
    // le dernier compartiment : deux banquettes face à face, la tablette sous la vitre
    for (const [x0, dos] of [[16, 16], [25, 27]]) {
      K.boite(x0, 0, 0, x0 + 3, 5, 1, M.WOOD); K.boite(x0, 0, 1, x0 + 3, 5, 2, M.WOOD_DARK);
      K.boite(dos, 0, 2, dos + 1, 5, 6, M.WOOD);
    }
    K.boite(21, 0, 3, 23, 2, 4, M.WOOD); K.voxel(21, 0, 2, M.METAL);
    K.boite(25, 2, 2, 27, 5, 3, M.PAPER);                                              // des journaux sur la banquette
    K.place('occupant', 26, 3, { pose: 'assis', regarde: 'gauche', pour: 'client' });
    // le fond : des journaux par terre, un seau, la poussière
    for (const [x, y] of [[20, 8], [21, 9], [33, 4], [37, 7], [24, 10]]) K.boite(x, y, -1, x + 2, y + 1, 0, M.PAPER);
    K.boite(37, 1, 0, 39, 3, 2, M.METAL); K.boite(31, 1, 0, 35, 4, 1, M.WOOD_DARK);
    K.place('visiteur', 32, 10, { regarde: 'gauche', pour: 'visiteur' });
    // la nuit : la lune par les vitres ; le jour : une lumière grise de dépôt
    for (const [x] of fenetres) {
      if (K.nuit) K.W.light({ x: x + 3, y: 4, z: 6, r: 22, cr: 0.12, cg: 0.16, cb: 0.38, shadow: false });
      else K.W.light({ x: x + 3, y: 4, z: 6, r: 24, cr: 0.26, cg: 0.27, cb: 0.28, shadow: false });
    }
  },
};
