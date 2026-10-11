'use strict';
// Le caveau du Racing, au fond à gauche du cimetière : une chapelle de pierre. Au mur du fond,
// sur le granit, les plaques de marbre — les présidents en lettres d'or, les capitaines en
// lettres noires — et entre deux d'entre elles la plaque neuve, lisse, sans un mot. Devant, la
// tablette de granit : le cierge, le lumignon rouge, la gerbe bordeaux et grise, le brin de buis.
// Au mur de gauche, les écharpes délavées et le vitrail. Au sol, la dalle et son anneau.
const E = require('../engine');
const { M } = require('../mats');
const { LEFT, RIGHT, TOP, hash, mod, fbm, overlay } = E;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const grain = (c, amt, s = 0) => mul(c, 1 + (hash(c.a, c.b, c.face * 7 + s, c.m) - 0.5) * 2 * amt);

// le pinceau du caveau (aucune matière nouvelle) : le granit noir moucheté et luisant, le marbre
// veiné, les écharpes délavées (bandes bordeaux passé et gris)
function granit(c) {
  rgb(c, 0.13, 0.13, 0.14); if (c.face === TOP) mul(c, 1.15);
  const h = hash(c.a, c.b, 9401, 0); if (h < 0.10) mul(c, 1.9); else if (h > 0.94) mul(c, 0.7);
  if (c.face === TOP) c.wet = 0.18;
}
function marbre(c) {
  rgb(c, 0.80, 0.78, 0.72);
  const v = fbm(c.hx * 0.7 + c.hz * 0.3, c.hz * 0.5 + c.hy * 0.7, 9402);
  if (v > 0.62 && v < 0.66) mul(c, 0.82); grain(c, 0.02);
}
overlay('caveau_pinceau', (o, c) => {
  if (o.f === 'granit') granit(c);
  else if (o.f === 'echarpe') { if (mod(Math.floor(c.hz * 2), 6) < 3) rgb(c, 0.48, 0.30, 0.31); else rgb(c, 0.60, 0.59, 0.55); grain(c, 0.06); }
});

// les textes gravés : une ligne longue (le nom), une courte (les dates), un filet autour ;
// `or` : les lettres d'or des présidents ; `lisse` : la plaque neuve, sans un mot
function texel(o, c) {
  const la = o.face === LEFT ? Math.floor(2 * c.hx) - 2 * o.a0 : 2 * o.a0 - 1 - Math.floor(2 * c.hy);
  return [la, Math.floor(2 * c.hz) - 2 * o.z0, o.w * 2, o.h * 2];
}
overlay('caveau_plaque', (o, c) => {
  if (c.face !== o.face) return;
  const [la, lb, W2, H2] = texel(o, c);
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  const lt = H2 - 1 - lb;
  marbre(c);
  if (o.lisse) { if (la + lt === 3 || la + lt === 4) mul(c, 1.18); return; }       // un reflet, rien d'autre
  if (la === 0 || la === W2 - 1 || lt === 0 || lt === H2 - 1) { mul(c, 0.88); return; }
  const lettre = (ligne, x0, x1) => lt === ligne && la >= x0 && la <= x1 && hash(la, ligne, o.seed, 9403) < 0.78;
  if (lettre(2, 2, W2 - 3) || lettre(H2 - 2, 3, W2 - 4)) {
    if (o.or) { rgb(c, 0.78, 0.60, 0.22); c.er = 0.10; c.eg = 0.07; c.eb = 0.01; } else rgb(c, 0.10, 0.10, 0.11);
  }
});
// le vitrail : des losanges de couleur sertis de plomb, une ogive en haut
overlay('caveau_vitrail', (o, c) => {
  if (c.face !== o.face) return;
  const [la, lb, W2, H2] = texel(o, c);
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  const lt = H2 - 1 - lb, cx = (W2 - 1) / 2;
  if (lt < 2 && Math.abs(la - cx) > lt + 0.6) { rgb(c, 0.52, 0.49, 0.43); c.er = c.eg = c.eb = 0; return; }   // l'ogive
  if (la === 0 || la === W2 - 1 || lb === 0 || mod(la + lt, 3) === 0 && mod(la - lt, 3) === 0) { rgb(c, 0.06, 0.06, 0.06); c.er = c.eg = c.eb = 0; return; }
  const p = [[0.55, 0.10, 0.16], [0.80, 0.62, 0.18], [0.16, 0.24, 0.55], [0.20, 0.42, 0.24], [0.55, 0.10, 0.16]];
  const k = p[Math.floor(hash(Math.floor((la + lt) / 3), Math.floor((la - lt + 30) / 3), 9404, 0) * p.length)];
  const e = o.jour ? 0.75 : 0.10;
  rgb(c, k[0] * 0.4, k[1] * 0.4, k[2] * 0.4); c.er = k[0] * e; c.eg = k[1] * e; c.eb = k[2] * e;
});

// le muret de devant sans paillasson : une marche de pierre et deux piliers
const PORTE = { cote: 'y', de: 9, a: 16 };
function muret(K) {
  const { M } = K;
  for (let x = 0; x <= K.SX; x++) if (!(x >= PORTE.de && x < PORTE.a)) K.boite(x, K.SY, -1, x + 1, K.SY + 1, 2, M.STONE);
  for (let y = 0; y < K.SY; y++) K.boite(K.SX, y, -1, K.SX + 1, y + 1, 2, M.STONE);
  K.boite(PORTE.de, K.SY, -1, PORTE.a, K.SY + 1, 0, M.STONE);
  const pinceau = K.W.obj({ type: 'caveau_pinceau', f: 'granit' });
  for (const x of [PORTE.de - 2, PORTE.a]) { K.boite(x, K.SY, -1, x + 2, K.SY + 1, 6, M.STONE); K.W.box(x, K.SY, 6, x + 2, K.SY + 1, 7, M.METAL_DARK, pinceau); }
}

module.exports = {
  cle: 'caveau', nom: 'Le caveau du Racing', ambiance: 'soin',
  sx: 26, sy: 22, h: 16, sol: 'STONE',
  murs: { bas: 'STONE', haut: 'STONE', coupe: 4 },
  porte: PORTE, sansDevant: true,
  build(K) {
    const { M } = K;
    const granitP = K.W.obj({ type: 'caveau_pinceau', f: 'granit' }), echarpeP = K.W.obj({ type: 'caveau_pinceau', f: 'echarpe' });
    // le mur des plaques : un panneau de granit, l'écusson du club, deux rangs de plaques
    K.W.box(3, -1, 2, 24, 0, 16, M.METAL_DARK, granitP);
    K.murY.crest(11, 11, 5, 4);
    const plaques = [
      // x, z, or, lisse : le rang du haut (les présidents, et la plaque neuve), le rang du bas (les capitaines, le soigneur)
      [4, 8, true], [9, 8, false, true], [14, 8, true], [19, 8, true],
      [4, 4, false], [9, 4, false], [14, 4, false], [19, 4, false],
    ];
    plaques.forEach(([x, z, or, lisse], i) => {
      const id = K.W.obj({ type: 'caveau_plaque', face: LEFT, a0: x, z0: z, w: 4, h: 3, or, lisse, seed: 9410 + i });
      K.W.box(x, -1, z, x + 4, 0, z + 3, M.WHITE, id);
    });
    K.objet('plaque', 'La plaque neuve', 11, 0, 9, { acces: [10, 6] });
    K.objet('noms', 'Les noms gravés', 18, 0, 7, { acces: [17, 6] });
    // les pilastres et la corniche
    for (const x of [1, 24]) K.boite(x, 0, 0, x + 1, 1, 16, M.STONE);
    K.boite(0, 0, 15, 26, 1, 16, M.STONE); K.boite(0, 0, 15, 1, 22, 16, M.STONE);
    // la tablette de granit, le cierge, le lumignon, la gerbe, le buis
    K.boite(4, 0, 0, 23, 3, 3, M.STONE); K.W.box(3, 0, 3, 24, 4, 4, M.METAL_DARK, granitP);
    K.boite(12, 1, 4, 14, 3, 5, M.GOLD); K.boite(12, 1, 5, 13, 2, 9, M.WHITE); K.voxel(12, 1, 9, M.BULB);
    K.lampe(12.5, 1.5, 10.2, { r: 26, c: [1.3, 0.85, 0.4], cache: true });
    K.objet('cierge', 'Le cierge', 12, 1, 7, { acces: [13, 6] });
    K.voxel(8, 2, 4, M.RED_LIGHT);
    K.W.light({ x: 8.5, y: 3, z: 5, r: 10, cr: 0.5, cg: 0.06, cb: 0.06, shadow: false });
    for (let x = 16; x < 21; x++) for (let y = 1; y < 4; y++) K.voxel(x, y, 4, (x + y) % 2 ? M.SEAT : M.WHITE);
    K.boite(17, 1, 5, 20, 3, 6, M.SEAT); K.voxel(18, 2, 6, M.WHITE);
    K.boite(5, 1, 4, 6, 2, 6, M.WHITE); K.voxel(5, 1, 6, M.HEDGE);
    // les écharpes délavées, à la tringle du mur de gauche ; le vitrail au-dessus de l'entrée
    K.boite(0, 2, 12, 1, 15, 13, M.METAL_DARK);
    // pliées sur la tringle : les deux bouts pendent côte à côte, la frange en bas
    for (const [y, z0, z1] of [[3, 5, 6], [6, 6, 7], [9, 5, 5], [12, 7, 6]]) {
      K.W.box(0, y, z0, 1, y + 1, 13, M.CANVAS, echarpeP); K.voxel(0, y, z0 - 1, M.CANVAS);
      K.W.box(0, y + 1, z1, 1, y + 2, 13, M.CANVAS, echarpeP); K.voxel(0, y + 1, z1 - 1, M.CANVAS);
    }
    K.objet('echarpes', 'Les écharpes délavées', 1, 8, 9, { acces: [4, 9] });
    K.fenetreX(16, 6, 2, 7, { type: 'caveau_vitrail', jour: K.jour, rebord: false, lintelMat: M.STONE });
    // la dalle du caveau, son anneau de fer
    K.W.box(8, 9, -1, 18, 17, 0, M.METAL_DARK, granitP);
    K.boite(12, 12, -1, 14, 14, 0, M.METAL_DARK);
    // le banc de pierre, contre le mur de gauche ; la couronne posée contre la tablette ; les pots
    K.boite(1, 17, 0, 4, 21, 2, M.STONE);
    for (let x = 18; x < 22; x++) for (let z = 0; z < 4; z++) if (x === 18 || x === 21 || z === 0 || z === 3) K.voxel(x, 4, z, (x + z) % 3 ? M.HEDGE : M.SEAT);
    K.boite(19, 4, 1, 21, 5, 2, M.SEAT_GREY);
    for (const [px, py] of [[22, 5], [1, 4]]) { K.boite(px, py, 0, px + 2, py + 2, 2, M.PLASTIC_RED); K.boite(px, py, 2, px + 2, py + 2, 3, M.FOLIAGE); }
    // les places : la mère devant la plaque, celui qui se recueille, le visiteur
    K.place('rance_mere', 11, 7, { regarde: 'droite', pour: 'rance_mere' });
    K.place('recueil', 19, 9, { regarde: 'gauche', pour: 'client' });
    K.place('visiteur', 15, 18, { regarde: 'droite', pour: 'visiteur' });
    // le jour : la lumière de la grille et les couleurs du vitrail ; la nuit : le cierge
    if (K.jour) {
      K.W.light({ x: 12, y: 24, z: 8, r: 30, cr: 0.30, cg: 0.30, cb: 0.30, shadow: false });
      K.W.light({ x: 3, y: 17, z: 8, r: 12, cr: 0.30, cg: 0.12, cb: 0.18, shadow: false });
    } else K.W.light({ x: 12, y: 25, z: 9, r: 22, cr: 0.08, cg: 0.10, cb: 0.22, shadow: false });
    muret(K);
  },
};
