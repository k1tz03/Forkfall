'use strict';
// Le garage du Pont, au fond de la cour : l'atelier sous les néons. Sur le pont élévateur, une
// citadine levée assez haut pour qu'on travaille dessous, la baladeuse accrochée au bas de caisse ;
// contre le mur du fond, la berline neuve sous sa bâche ; à gauche, l'établi, l'étau, la radio,
// le panneau à outils et la servante rouge ; les piles de pneus ; devant, le coin du vendeur :
// le bureau sur son lino, le tableau des clés, le calendrier, les prospectus. Les taches d'huile,
// le caniveau, le bidon, le cric ; l'enseigne émaillée GARAGE DU PONT.
const E = require('../engine');
const { M } = require('../mats');
const B = require('../build');
const { LEFT, RIGHT, TOP, hash, mod, fbm, overlay } = E;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };

// le panneau à outils : l'isorel perforé, les silhouettes peintes des outils, les outils dessus
overlay('garage_outils', (o, c) => {
  if (c.face !== o.face) return;
  const la = o.face === LEFT ? Math.floor(2 * c.hx) - 2 * o.a0 : 2 * o.a0 - 1 - Math.floor(2 * c.hy);
  const lb = Math.floor(2 * c.hz) - 2 * o.z0, W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  rgb(c, 0.58, 0.46, 0.30);
  if (mod(la, 2) === 1 && mod(lb, 2) === 1) rgb(c, 0.30, 0.22, 0.14);
  const lt = H2 - 1 - lb, outil = (u, t0, t1) => la === u && lt >= t0 && lt <= t1;
  for (let u = 2; u < W2 - 2; u += 3) {
    const k = hash(u, 0, 9961, 0);
    if (outil(u, 2, 2 + Math.floor(k * 5) + 3)) { rgb(c, 0.55, 0.57, 0.58); return; }       // clés plates, tournevis
    if (k > 0.7 && la === u + 1 && lt === 2) { rgb(c, 0.75, 0.12, 0.10); return; }          // un manche rouge
  }
  if (lt >= H2 - 4 && lt <= H2 - 3 && la > 2 && la < W2 - 3 && mod(la, 4) < 2) rgb(c, 0.18, 0.18, 0.19); // la rangée de pinces
});
// les taches d'huile, et le caniveau grillagé
overlay('garage_sol', (o, c) => {
  if (c.face !== TOP) return;
  if (c.hy >= o.caniveau[0] && c.hy < o.caniveau[1] && c.hx > 2 && c.hx < o.caniveau[2]) { rgb(c, 0.14, 0.14, 0.15); if (mod(Math.floor(c.hx * 2), 2) === 0) rgb(c, 0.05, 0.05, 0.05); return; }
  for (const [hx, hy, rx, ry] of o.taches) {
    const d = Math.hypot((c.hx - hx) / rx, (c.hy - hy) / ry) + 0.4 * (fbm(c.hx / 2, c.hy / 2, 9962) - 0.5);
    if (d < 1) { mul(c, d < 0.55 ? 0.32 : 0.55); c.wet = 0.6; return; }
  }
});

module.exports = {
  cle: 'garage', nom: 'Le garage du Pont', ambiance: 'salle', personnel: 'garagiste',
  sx: 48, sy: 36, h: 20, sol: 'I_BETON',
  murs: { bas: 'BRICK_OLD', haut: 'I_MUR_GRIS', coupe: 8 },
  porte: { cote: 'x', de: 24, a: 33 },
  build(K) {
    const { M } = K;
    // ─── le sol : l'huile sous le pont, le caniveau devant
    { const id = K.W.obj({ type: 'garage_sol', caniveau: [15, 16, 26], taches: [[12, 8, 3.5, 2.2], [20, 6, 1.8, 1.2], [36, 15, 2.2, 1.3]] }); K.W.box(0, 0, -1, K.SX, K.SY, 0, M.I_BETON, id); }
    // ─── le pont élévateur à deux colonnes, la citadine levée, la baladeuse
    for (const y of [1, 12]) { K.boite(12, y, 0, 15, y + 2, 17, M.CAR_BLUE); K.boite(11, y - (y > 6 ? 0 : 1), 0, 16, y + (y > 6 ? 3 : 2), 1, M.METAL_DARK); }
    K.boite(12, 3, 16, 15, 12, 17, M.CAR_BLUE);
    for (const [ax, ay0, ay1] of [[9, 3, 5], [17, 3, 5], [9, 9, 11], [17, 9, 11]]) K.boite(ax, ay0, 8, ax + 1, ay1 + 1, 9, M.METAL_DARK);
    K.boite(9, 2, 8, 18, 3, 9, M.METAL_DARK); K.boite(9, 11, 8, 18, 12, 9, M.METAL_DARK);
    B.car(K.W, 4, 3, 9, 'x', M.CAR_BEIGE);
    K.boite(15, 6, 6, 16, 7, 9, M.METAL_DARK); K.boite(15, 6, 5, 16, 7, 6, M.BULB);
    K.lampe(15.5, 6.5, 5, { r: 24, c: [1.3, 1.0, 0.6], cache: true, toujours: true });
    K.objet('pont', 'Le pont élévateur', 13, 12, 8, { acces: [16, 15] });
    K.place('garagiste', 10, 7, { regarde: 'droite', pour: 'personnel' });
    // ─── la berline neuve sous la bâche, contre le mur du fond ; les roues qui dépassent
    K.boite(27, 2, 0, 47, 11, 1, M.TARP);
    K.boite(26, 2, 1, 47, 11, 6, M.TARP); K.boite(31, 3, 6, 44, 10, 9, M.TARP); K.boite(33, 4, 9, 42, 9, 10, M.TARP);
    for (const [x, y] of [[29, 11], [42, 11]]) K.boite(x, y, 0, x + 3, y + 1, 2, M.TIRE);
    K.objet('bache', 'La voiture sous la bâche', 36, 6, 7, { acces: [36, 14] });
    K.place('client_1', 31, 14, { regarde: 'droite', pour: 'client' });
    // ─── l'enseigne émaillée, le calendrier, le tableau des clés
    K.murY.sign(17, 19, 'GARAGE DU PONT', { fg: [0.92, 0.92, 0.88], plate: [0.16, 0.24, 0.50], plateMat: M.METAL, depth: -1, padX: 2, padY: 1 });
    K.afficheY(43, 11, 3, 4, { bg: [0.86, 0.84, 0.78], fg: [0.25, 0.25, 0.30], band: [0.16, 0.24, 0.50], seed: 9963 });
    // ─── les piles de pneus, dans le coin
    for (const [px, py, n] of [[1, 1, 5], [1, 5, 4], [1, 9, 3], [5, 0, 3]]) for (let i = 0; i < n; i++) { K.boite(px, py, i, px + 3, py + 3, i + 1, M.TIRE); K.voxel(px + 1, py + 1, i, i === n - 1 ? M.METAL_DARK : M.TIRE); }
    K.objet('pneus', 'Les pneus', 2, 6, 4, { acces: [6, 9] });
    // ─── l'établi : le plateau, l'étau, la radio, le panneau à outils ; la servante rouge
    K.boite(0, 16, 0, 4, 29, 4, M.METAL_DARK); K.boite(0, 16, 4, 5, 29, 5, M.WOOD);
    K.boite(3, 18, 5, 5, 20, 7, M.METAL_DARK); K.voxel(4, 19, 7, M.METAL);
    K.boite(1, 24, 5, 3, 27, 7, M.PLASTIC_RED); K.voxel(2, 24, 6, M.CHROME); K.voxel(2, 26, 6, M.CHROME);
    K.boite(1, 21, 5, 2, 22, 6, M.ENAMEL); K.voxel(3, 22, 5, M.METAL);
    { const id = K.W.obj({ type: 'garage_outils', face: RIGHT, a0: 29, z0: 7, w: 13, h: 7 }); K.W.box(0, 16, 7, 1, 29, 14, M.WOOD, id); }
    K.boite(0, 30, 0, 4, 34, 7, M.PLASTIC_RED); for (const z of [2, 4, 6]) K.boite(4, 30, z, 5, 34, z + 1, M.METAL_DARK);
    K.boite(0, 16, 15, 4, 29, 16, M.METAL_DARK); K.lampe(3, 22.5, 14.5, { r: 30, c: [1.1, 0.95, 0.7], cache: true });
    K.objet('etabli', 'L\'établi', 2, 22, 5, { acces: [7, 22] });
    // ─── le coin du vendeur : un lino, le bureau, sa lampe, les prospectus, deux chaises ; la plante
    K.boite(30, 18, -1, 44, 29, 0, M.I_LINO);
    K.bureau(33, 20, 8, 4, { mat: M.I_FORMICA });
    K.lampeBureau(39, 20); K.telephone(34, 21, 4); K.boite(36, 22, 4, 38, 23, 5, M.PAPER);
    K.chaise(36, 17, { dos: 'y-', mat: M.I_SKAI });
    K.chaise(34, 25, { dos: 'y+', mat: M.I_SKAI }); K.chaise(38, 25, { dos: 'y+', mat: M.I_SKAI });
    K.boite(42, 19, 0, 44, 21, 9, M.METAL); K.boite(42, 19, 9, 44, 21, 10, M.PAPER);
    K.plante(31, 27);
    K.objet('bureau', 'Le bureau du vendeur', 37, 22, 4, { acces: [32, 23] });
    K.place('vendeur', 43, 24, { regarde: 'gauche', pour: 'client' });
    // ─── le bidon d'huile, le cric rouleur, le compresseur
    K.boite(22, 14, 0, 25, 17, 5, M.CAR_BLUE); K.boite(22, 14, 5, 25, 17, 6, M.METAL_DARK);
    K.boite(18, 18, 0, 23, 20, 1, M.PLASTIC_RED); K.boite(17, 18, 1, 19, 20, 2, M.PLASTIC_RED); K.boite(22, 19, 1, 26, 20, 2, M.METAL);
    K.boite(44, 13, 0, 47, 16, 4, M.PLASTIC_RED); K.boite(45, 14, 4, 46, 15, 6, M.METAL_DARK);
    K.place('visiteur', 41, 30, { regarde: 'gauche', pour: 'visiteur' });
    // ─── la lumière : les néons de l'atelier (le jour, et la nuit à moitié éteints)
    K.neon(22, 6, 23, 18, 19, M.TUBE, { c: [0.75, 0.85, 0.85], r: 48 });
    K.neon(36, 13, 37, 25, 19, M.TUBE, { c: [0.75, 0.85, 0.85], r: K.jour ? 48 : 30 });
  },
};
