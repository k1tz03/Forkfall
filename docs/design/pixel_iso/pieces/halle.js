'use strict';
// La grande halle de la Tréfilerie, friche depuis 1984 : la brique, les poteaux d'acier, les
// fermes du toit, les verrières aux carreaux cassés. Sur le béton, un terrain tracé à la craie,
// le but du fond dessiné sur le mur, celui d'en face en briques empilées. Le toit est troué :
// la lune (ou le jour) tombe en cône sur une flaque et sur la tôle tombée. Des tags, des palettes,
// un bidon où brûle un feu autour duquel on se tait, un campement contre le mur, l'échelle de la
// tour de la sirène, des pigeons sur les poutres.
const E = require('../engine');
const { M } = require('../mats');
const { LEFT, RIGHT, TOP, hash, mod, fbm, vnoise, overlay } = E;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };

// le pinceau de la halle (aucune matière nouvelle) : `braise`, le feu au fond du bidon
overlay('halle_pinceau', (o, c) => {
  if (o.f === 'braise') { const k = 0.6 + 0.6 * hash(c.a, c.b, 9701, 0); rgb(c, 0.9, 0.4, 0.1); c.er = 1.4 * k; c.eg = 0.55 * k; c.eb = 0.12 * k; }
});

// le terrain à la craie : deux lignes de touche, la médiane, le rond central, les demi-lunes ;
// la flaque sous le trou du toit ; les fientes sous les poutres ; une fissure
const T = { x0: 2, x1: 50, y0: 12, y1: 36 };
overlay('halle_sol', (o, c) => {
  if (c.face !== TOP) return;
  const x = c.hx, y = c.hy, tx = Math.floor(2 * x), ty = Math.floor(2 * y);
  const fl = Math.hypot((x - o.flaque[0]) / 6.5, (y - o.flaque[1]) / 4) + 0.5 * (fbm(x / 3, y / 3, 9702) - 0.5);
  if (fl < 1) { mul(c, 0.7); c.cb *= 1.1; c.wet = 0.75; return; }
  const wob = (vnoise(x / 4, y / 4, 9703) - 0.5) * 0.9;
  const mx = (T.x0 + T.x1) / 2, my = (T.y0 + T.y1) / 2;
  const près = (v, cible) => Math.abs(v - cible + wob * 0.5) < 0.3;
  const dans = x > T.x0 - 0.3 && x < T.x1 + 0.3 && y > T.y0 - 0.3 && y < T.y1 + 0.3;
  let craie = false;
  if (dans && (près(y, T.y0) || près(y, T.y1) || près(x, T.x1) || près(x, mx))) craie = true;
  if (Math.abs(Math.hypot(x - mx, y - my) - 4) < 0.3) craie = true;
  for (const gx of [T.x0, T.x1]) { const d = Math.hypot(x - gx, y - my); if (Math.abs(d - 6) < 0.3 && dans) craie = true; }
  for (const px of [T.x0 + 4, mx, T.x1 - 4]) if (Math.hypot(x - px, y - my) < 0.45) craie = true;   // les points
  if (craie && hash(tx, ty, 9704, 0) > 0.14) { rgb(c, 0.82, 0.82, 0.76); return; }
  if (hash(tx, ty, 9705, 0) < 0.02) rgb(c, 0.70, 0.70, 0.64);                              // des fientes
  const f = Math.abs(fbm(x / 9 + 3, y / 9, 9706) - 0.5);                                  // une fissure
  if (f < 0.012) mul(c, 0.55);
});
// les verrières : de petits carreaux sertis de fer, certains cassés, d'autres encrassés, un ou
// deux bouchés par une planche
overlay('halle_verriere', (o, c) => {
  if (c.face !== o.face) return;
  const la = o.face === LEFT ? Math.floor(2 * c.hx) - 2 * o.a0 : 2 * o.a0 - 1 - Math.floor(2 * c.hy);
  const lb = Math.floor(2 * c.hz) - 2 * o.z0, W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  if (la === 0 || la === W2 - 1 || lb === 0 || lb === H2 - 1 || mod(la, 3) === 0 || mod(lb, 4) === 0) { rgb(c, 0.10, 0.10, 0.11); c.er = c.eg = c.eb = 0; return; }
  const h = hash(Math.floor(la / 3), Math.floor(lb / 4), o.seed, 9707);
  if (h < 0.06) { rgb(c, 0.36, 0.25, 0.15); c.er = c.eg = c.eb = 0; return; }             // une planche
  let col, k;
  if (h < 0.24) { col = o.jour ? [0.80, 0.84, 0.90] : [0.03, 0.04, 0.09]; k = o.jour ? 0.8 : 0.2; }   // cassé : le dehors
  else { col = o.jour ? [0.62, 0.62, 0.52] : [0.10, 0.12, 0.24]; k = (o.jour ? 0.45 : 0.32) * (0.75 + 0.5 * hash(la, lb, 9708, 0)); }
  rgb(c, col[0] * 0.3, col[1] * 0.3, col[2] * 0.3); c.er = col[0] * k; c.eg = col[1] * k; c.eb = col[2] * k;
});
// les tags : des lettres en bulles, remplies, cernées, avec un reflet ; et le but à la craie
overlay('halle_tags', (o, c) => {
  if (c.face !== o.face) return;
  const s = o.face === LEFT ? c.hx : -c.hy, z = c.hz;
  for (const p of o.pieces) {
    const u = (s - p.s0) / p.w, v = (z - p.z0) / p.h;
    if (u < 0 || u > 1 || v < 0 || v > 1) continue;
    if (p.traits) {                                                 // des bâtons à la craie, par cinq : on compte des jours
      const lu = Math.floor((s - p.s0) * 2), lv = Math.floor((z - p.z0) * 2), H2 = p.h * 2, g = mod(lu, 9);
      const n = Math.floor(lu / 9) < p.groupes ? 4 : p.reste;
      if ((g < 2 * n && g % 2 === 0) || (Math.floor(lu / 9) < p.groupes && g === Math.floor((lv + 0.5) * 8 / H2))) { if (hash(lu, lv, 9715, 0) > 0.1) rgb(c, 0.84, 0.84, 0.78); }
      continue;
    }
    if (p.but) {                                                    // le but : deux poteaux, une barre, une croix pour le coin
      const lu = (s - p.s0) * 2, lv = (z - p.z0) * 2, W2 = p.w * 2, H2 = p.h * 2;
      if ((Math.floor(lu) <= 1 || Math.floor(lu) >= W2 - 2 || Math.floor(lv) >= H2 - 2) && hash(Math.floor(lu), Math.floor(lv), 9709, 0) > 0.12) rgb(c, 0.82, 0.82, 0.76);
      continue;
    }
    const masque = 1 - Math.pow(Math.abs(2 * u - 1), 6) - Math.pow(Math.abs(2 * v - 1), 4);
    const lettres = 0.55 + 0.45 * Math.sin(u * p.n * Math.PI) * 0.5;
    const n = fbm(s / 1.6 + p.seed, z / 2.2, p.seed) * 0.6 + lettres * 0.4 + masque * 0.25;
    if (n > 0.62) { const f = p.fond; rgb(c, f[0], f[1], f[2]); if (n > 0.74) mul(c, 1.25); return; }
    if (n > 0.57) { const t = p.trait; rgb(c, t[0], t[1], t[2]); return; }
  }
});

// une palette (120 × 100 cm, à plat) : trois traverses, les planches du dessus à claire-voie
function palette(K, x, y, z, sens) {
  const { M } = K;
  const [w, d] = sens === 'x' ? [6, 5] : [5, 6];
  for (let i = 0; i < 3; i++) { if (sens === 'x') K.boite(x, y + i * 2, z, x + w, y + i * 2 + 1, z + 1, M.WOOD_DARK); else K.boite(x + i * 2, y, z, x + i * 2 + 1, y + d, z + 1, M.WOOD_DARK); }
  for (let j = 0; j < (sens === 'x' ? w : d); j += 2) { if (sens === 'x') K.boite(x + j, y, z + 1, x + j + 1, y + d, z + 2, M.WOOD); else K.boite(x, y + j, z + 1, x + w, y + j + 1, z + 2, M.WOOD); }
}

module.exports = {
  cle: 'halle', nom: 'La grande halle', ambiance: 'nuit',
  sx: 56, sy: 44, h: 24, sol: 'I_BETON',
  murs: { bas: 'BRICK_OLD', haut: 'BRICK_OLD', coupe: 10 },
  porte: { cote: 'y', de: 24, a: 32 },
  build(K) {
    const { M } = K;
    const W = K.W, SX = K.SX, SY = K.SY, H = K.H;
    // ─── le sol : le terrain à la craie, la flaque sous le trou du toit
    const trou = [33, 19];
    { const id = W.obj({ type: 'halle_sol', flaque: [trou[0] + 1, trou[1] + 4] }); W.box(0, 0, -1, SX, SY, 0, M.I_BETON, id); }
    K.objet('craie', 'Le terrain à la craie', 26, 24, 0, { acces: [26, 27] });
    // ─── les tags et le but dessiné, sur la brique (avant les verrières, qui percent le mur)
    const tagsY = W.obj({ type: 'halle_tags', face: LEFT, pieces: [
      { s0: 21, z0: 1.5, w: 12, h: 6, n: 4, seed: 9711, fond: [0.80, 0.30, 0.52], trait: [0.10, 0.08, 0.12] },
    ] });
    W.box(20, -1, 0, 34, 0, 9, M.BRICK_OLD, tagsY);
    const tagsX = W.obj({ type: 'halle_tags', face: RIGHT, pieces: [
      { s0: -29, z0: 0, w: 8, h: 6, but: true },
      { s0: -16, z0: 1.5, w: 10, h: 6, n: 3, seed: 9713, fond: [0.86, 0.74, 0.22], trait: [0.12, 0.10, 0.10] },
      { s0: -43, z0: 9.5, w: 8, h: 5, n: 3, seed: 9714, fond: [0.30, 0.66, 0.70], trait: [0.92, 0.88, 0.80] },
      { s0: -34.5, z0: 5.5, w: 4.5, h: 2.5, traits: true, groupes: 1, reste: 0 },
      { s0: -34.5, z0: 2.5, w: 4.5, h: 2.5, traits: true, groupes: 0, reste: 3 },
    ] });
    W.box(-1, 0, 0, 0, 43, 9, M.BRICK_OLD, tagsX); W.box(-1, 35, 9, 0, 43, 15, M.BRICK_OLD, tagsX);
    K.murY.sign(37, 8, 'ZONE 84', { fg: [0.88, 0.88, 0.82], depth: 0, drip: true });
    K.objet('tags', 'Les tags', 27, 0, 5, { acces: [27, 5] });
    // ─── les verrières, les poteaux d'acier, les fermes du toit, la tôle qui reste le long des murs
    for (const [x, sd] of [[6, 1], [22, 2], [38, 3]]) K.fenetreY(x, 10, 9, 10, { type: 'halle_verriere', jour: K.jour, seed: 9720 + sd, sill: true, sillMat: M.CONCRETE, lintelMat: M.CONCRETE });
    for (const [y, sd] of [[8, 4], [24, 5]]) K.fenetreX(y, 10, 9, 10, { type: 'halle_verriere', jour: K.jour, seed: 9720 + sd, sillMat: M.CONCRETE, lintelMat: M.CONCRETE });
    for (const x of [2, 18, 34, 50]) { K.boite(x, 0, 0, x + 1, 1, H, M.METAL_DARK); K.boite(x - 1, 0, 19, x + 2, 2, 20, M.METAL_DARK); }
    for (const y of [4, 20, 36]) { K.boite(0, y, 0, 1, y + 1, H, M.METAL_DARK); K.boite(0, y - 1, 19, 2, y + 2, 20, M.METAL_DARK); }
    for (const x of [18, 34]) {
      K.boite(x, 0, 21, x + 1, SY, 22, M.METAL);
      for (let i = 0; i < 4; i++) K.voxel(x, 1 + i, 17 + i, M.METAL);                 // le gousset vers le poteau
    }
    K.boite(0, 0, 23, SX, 2, 24, M.ZINC); K.boite(0, 2, 23, 2, SY, 24, M.ZINC);
    // ─── le trou du toit : une tôle qui pend de la ferme, une autre tombée par terre, les gravats
    for (let i = 0; i < 4; i++) K.boite(33, trou[1] + i, 20 - 2 * i, 36, trou[1] + i + 1, 21 - 2 * i, M.ZINC);
    for (let i = 0; i < 6; i++) K.boite(trou[0] - 4 + i, trou[1] + 6, i < 3 ? 0 : 1, trou[0] - 3 + i, trou[1] + 10, i < 3 ? 1 : 2, M.ZINC);
    for (const [gx, gy] of [[30, 17], [31, 18], [36, 21], [37, 18], [29, 22], [35, 26]]) K.voxel(gx, gy, 0, M.BRICK_OLD);
    for (const [gx, gy, h] of [[38, 23, 2], [27, 18, 1], [36, 27, 1], [3, 40, 2], [52, 8, 1], [12, 42, 1]]) K.boite(gx, gy, 0, gx + 1, gy + 1, h, M.WEED);
    K.objet('toit', 'Le toit troué', trou[0], trou[1], 20, { acces: [trou[0] + 3, trou[1] + 1] });
    // ─── le but d'en face : deux piles de briques ; les drapeaux de coin : des bâtons
    for (const y of [20, 28]) K.boite(T.x1, y, 0, T.x1 + 2, y + 2, 4, M.BRICK);
    for (const [x, y] of [[T.x0 + 1, T.y0], [T.x0 + 1, T.y1 - 1], [T.x1, T.y0], [T.x1, T.y1 - 1]]) { K.boite(x, y, 0, x + 1, y + 1, 5, M.WOOD); K.voxel(x, y, 5, M.PLASTIC_RED); }
    // ─── les palettes : une pile dans le coin, deux contre le mur, un banc autour du bidon
    for (let i = 0; i < 4; i++) palette(K, 1, 37, i * 2, 'y');
    palette(K, 7, 38, 0, 'y'); palette(K, 7, 38, 2, 'y');
    K.objet('palettes', 'Les palettes', 4, 40, 6, { acces: [14, 40] });
    // ─── le bidon et ses braises, deux palettes pour s'asseoir, les ombres autour
    K.boite(46, 36, 0, 49, 39, 4, M.METAL); K.W.box(46, 36, 4, 49, 39, 5, M.METAL_DARK, K.W.obj({ type: 'halle_pinceau', f: 'braise' }));
    K.voxel(47, 39, 2, M.METAL_DARK); K.voxel(48, 35, 1, M.METAL_DARK);
    K.lampe(47.5, 37.5, 6.5, { r: 34, c: [1.4, 0.6, 0.18], cache: true });
    palette(K, 39, 33, 0, 'x');
    K.place('ombre_1', 44, 40, { regarde: 'droite', pour: 'client' });
    K.place('ombre_2', 51, 37, { regarde: 'gauche', pour: 'client' });
    K.place('ombre_3', 48, 42, { regarde: 'gauche', pour: 'client' });
    // ─── le campement contre le mur du fond : un lit de camp sous une bâche, une caisse, une gamelle
    for (const [lx, ly] of [[5, 2], [14, 2], [5, 4], [14, 4]]) K.boite(lx, ly, 0, lx + 1, ly + 1, 2, M.METAL_DARK);
    K.boite(5, 2, 2, 15, 5, 3, M.CANVAS); K.boite(5, 2, 3, 8, 5, 4, M.SEAT_GREY);
    for (let i = 0; i < 4; i++) K.boite(4, i, 9 - i, 16, i + 1, 10 - i, M.TARP);
    K.boite(16, 2, 0, 18, 4, 2, M.WOOD); K.voxel(16, 2, 2, M.METAL);
    K.place('vallin', 24, 21, { regarde: 'droite', pour: 'vallin' });
    // ─── l'échelle de la tour de la sirène : des barreaux, une passerelle, une porte là-haut
    for (let z = 0; z < 18; z++) { K.voxel(51, 1, z, M.METAL_DARK); K.voxel(54, 1, z, M.METAL_DARK); if (mod(z, 2) === 1) K.boite(52, 1, z, 54, 2, z + 1, M.METAL); }
    K.boite(48, 0, 18, 56, 4, 19, M.METAL_DARK); for (let x = 48; x < 56; x += 2) K.boite(x, 3, 19, x + 1, 4, 21, M.METAL);
    K.boite(51, -1, 19, 54, 0, 23, M.WOOD_DARK);
    // ─── des pigeons sur les poutres et les rebords
    for (const [px, py, pz] of [[18, 12, 22], [18, 30, 22], [34, 6, 22], [9, 0, 10], [25, 0, 10], [34, 36, 22]]) K.voxel(px, py, pz, M.PLASTER_GREY);
    K.place('visiteur', 28, 40, { regarde: 'droite', pour: 'visiteur' });
    // ─── la lumière : le cône du trou du toit, la lune ou le jour ; le feu du bidon
    const ax = [0.18, 0.12, -1], al = Math.hypot(ax[0], ax[1], ax[2]);
    const cone = { x: trou[0] - 4, y: trou[1] - 2, z: 40, r: 70, fall: 1.2, axis: [ax[0] / al, ax[1] / al, ax[2] / al], c0: 0.955, c1: 0.985, spill: 0, skip: 2 };
    if (K.nuit) {
      W.light(Object.assign(cone, { cr: 0.62, cg: 0.82, cb: 1.55 }));
      for (const [lx, ly] of [[10, 4], [26, 4], [42, 4], [4, 12], [4, 28]]) W.light({ x: lx, y: ly, z: 14, r: 18, cr: 0.06, cg: 0.08, cb: 0.18, shadow: false });
      W.light({ x: 24, y: 18, z: 22, r: 60, fall: 1.0, cr: 0.07, cg: 0.09, cb: 0.17, shadow: false });   // la lune par les carreaux cassés
    } else W.light(Object.assign(cone, { cr: 1.5, cg: 1.4, cb: 1.15 }));
  },
};
