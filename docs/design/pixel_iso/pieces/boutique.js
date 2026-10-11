'use strict';
// La boutique du club : le mur des écharpes bordeaux, grises et blanches sous l'enseigne RACING
// et l'écusson ; au mur de gauche, les fanions punaisés et le maillot de la finale de 1974 dans
// son cadre, la boue encore dessus, sous son spot ; au milieu, le portant des maillots de la
// saison dernière, SOLDES ; la table des maillots pliés ; le mannequin en veste du club ; le
// comptoir, la caisse, les étagères des tasses et des ballons.
const E = require('../engine');
const { M } = require('../mats');
const B = require('../build');
const { LEFT, RIGHT } = E;

// une écharpe pliée sur la tringle : deux pans côte à côte, rayés (bordeaux, gris, blanc), une frange
function echarpe(K, x, y, zHaut, long, decal) {
  const { M } = K;
  const bandes = [M.SEAT, M.SEAT, M.SEAT_GREY, M.WHITE];
  for (const dx of [0, 1]) for (let i = 0; i < long; i++) K.voxel(x + dx, y, zHaut - 1 - i, bandes[(i + decal) % bandes.length]);
  K.voxel(x, y, zHaut - 1 - long, M.CANVAS); K.voxel(x + 1, y, zHaut - 1 - long, M.CANVAS);
}
// un fanion d'échange sur sa baguette, contre le mur de gauche : trois rangs pleins et la pointe
function fanion(K, y, z, m) {
  const { M } = K;
  K.boite(0, y - 1, z, 1, y + 4, z + 1, M.WOOD);
  K.boite(0, y, z - 3, 1, y + 3, z, m); K.voxel(0, y + 1, z - 4, m);
}

module.exports = {
  cle: 'boutique', nom: 'La boutique du club', ambiance: 'boutique', personnel: 'commercant',
  sx: 40, sy: 32, sol: 'I_PARQUET',
  murs: { bas: 'I_MUR_BORDEAUX', haut: 'I_MUR_BLANC', coupe: 6, plinthe: 'WOOD_DARK' },
  porte: { cote: 'x', de: 18, a: 25 },
  build(K) {
    const { M } = K;
    // ─── le mur des écharpes : deux tringles, l'enseigne, l'écusson
    K.murY.sign(4, 18, 'RACING', { fg: [0.88, 0.84, 0.72], plate: [0.42, 0.10, 0.16], plateMat: M.WOOD_DARK, depth: -1, padX: 2, padY: 1 });
    K.murY.crest(20, 14, 4, 4);
    for (const zr of [13, 7]) {
      K.boite(3, 0, zr, 30, 2, zr + 1, M.METAL_DARK);
      for (let x = 4, i = 0; x < 29; x += 3, i++) echarpe(K, x, 1, zr, 4 + ((i + zr) % 2), i % 4);
    }
    K.objet('echarpes', 'Le mur des écharpes', 16, 1, 9, { acces: [16, 7] });
    K.place('client_1', 12, 7, { regarde: 'droite', pour: 'client' });
    // ─── les fanions punaisés, en quinconce, au mur de gauche
    for (const [y, z, m] of [[14, 15, M.FLAG], [19, 15, M.SEAT], [24, 15, M.FLAG], [16, 11, M.SEAT], [21, 11, M.FLAG], [26, 11, M.SEAT]]) fanion(K, y, z, m);
    K.objet('fanions', 'Les fanions', 1, 20, 12, { acces: [5, 20] });
    // ─── le maillot de 1974 dans son cadre, la boue sur le dos, la plaque, le spot
    K.boite(0, 3, 5, 1, 12, 15, M.WOOD_DARK);
    K.boite(0, 4, 6, 1, 11, 14, M.I_MUR_BLANC);
    K.boite(0, 5, 7, 1, 10, 13, M.JERSEY); K.boite(0, 4, 11, 1, 5, 13, M.JERSEY); K.boite(0, 10, 11, 1, 11, 13, M.JERSEY);
    K.voxel(0, 7, 9, M.SOIL); K.voxel(0, 8, 10, M.SOIL); K.voxel(0, 6, 8, M.SOIL);
    K.boite(0, 6, 4, 1, 9, 5, M.GOLD);
    K.boite(1, 7, 15, 3, 8, 16, M.METAL_DARK);
    K.lampe(2.5, 7.5, 14.5, { r: 14, c: [1.3, 1.0, 0.6], cache: true, toujours: true });
    K.objet('vitrine_1974', 'Le maillot de 1974', 0, 7, 10, { acces: [4, 8] });
    // ─── le portant des maillots soldés, et sa pancarte
    for (const x of [13, 27]) { K.boite(x, 20, 0, x + 1, 21, 9, M.METAL); K.boite(x - 1, 19, 0, x + 2, 22, 1, M.METAL); }
    K.boite(13, 20, 9, 28, 21, 10, M.METAL);
    for (let x = 14; x < 27; x++) K.boite(x, 19, 4, x + 1, 22, 9, x % 3 ? M.JERSEY : M.WHITE);
    {
      const pancarte = new B.Facade(K.W, LEFT, 15, 20, 13, 1);
      K.boite(15, 20, 10, 28, 21, 14, M.WHITE);
      pancarte.sign(0, 14, 'SOLDES', { fg: [0.86, 0.12, 0.12], depth: 0, padX: 1, padY: 1 });
    }
    K.objet('maillots', 'Les maillots soldés', 20, 21, 6, { acces: [20, 24] });
    K.place('client_2', 24, 26, { regarde: 'gauche', pour: 'client' });
    // ─── la table des maillots pliés, les piles
    K.table(4, 23, 8, 5, { mat: M.WOOD });
    for (const [px, py, h] of [[5, 24, 3], [8, 24, 2], [5, 26, 2], [8, 26, 4]]) for (let z = 0; z < h; z++) K.boite(px, py, 4 + z, px + 2, py + 2, 5 + z, z % 2 ? M.WHITE : M.SEAT);
    // ─── le mannequin en veste du club
    K.boite(30, 26, 0, 32, 28, 1, M.METAL_DARK); K.boite(30, 26, 1, 31, 27, 5, M.METAL_DARK);
    K.boite(29, 25, 5, 32, 28, 10, M.SEAT); K.boite(29, 25, 7, 32, 28, 8, M.SEAT_GREY); K.boite(30, 26, 10, 31, 27, 11, M.METAL_DARK);
    // ─── le comptoir, la caisse, le panier de ballons ; derrière, les étagères
    K.comptoir(30, 8, 38, 11, { mat: M.WOOD_DARK, dessus: M.WOOD });
    K.caisse(32, 9);
    K.boite(35, 9, 5, 37, 10, 6, M.PAPER);
    K.boite(25, 11, 0, 29, 14, 3, M.METAL); K.boite(26, 11, 2, 28, 13, 4, M.BALLS);
    K.etagere(30, 0, 39, 2, 2, 14, M.I_LIVRES);
    for (const x of [31, 34, 37]) K.boite(x, 0, 8, x + 2, 2, 10, M.BALLS);
    K.objet('caisse', 'La caisse', 33, 10, 6, { acces: [33, 13] });
    K.place('vendeur', 34, 5, { regarde: 'gauche', pour: 'personnel' });
    K.place('visiteur', 34, 21, { regarde: 'gauche', pour: 'visiteur' });
    // ─── le tapis bordeaux, les spots encastrés sur les écharpes, deux plafonniers
    K.boite(14, 10, -1, 26, 17, 0, M.CARPET);
    for (const x of [8, 16, 24]) K.lampe(x + 0.5, 5, 15.5, { r: 22, c: [1.2, 0.95, 0.6], cache: true });
    K.plafonnier(12, 18, { c: [1.2, 0.95, 0.65], r: 52 });
    K.plafonnier(28, 16, { c: [1.2, 0.95, 0.65], r: 52 });
  },
};
