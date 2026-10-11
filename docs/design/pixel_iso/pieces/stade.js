'use strict';
// Le vestiaire du stade de la Rive : faïence et vert, les bancs et les maillots aux patères,
// le tableau noir, la table de massage du Doc, les douches au fond, le sac de ballons.
module.exports = {
  cle: 'stade', nom: 'Le vestiaire de la Rive', ambiance: 'vestiaire',
  sx: 46, sy: 36, sol: 'TILE_FLOOR',
  murs: { bas: 'FAIENCE', haut: 'PAINT_GREEN', coupe: 8 },
  porte: { cote: 'y', de: 30, a: 37 },
  build(K) {
    const { M } = K;
    // les bancs le long des deux murs, les maillots aux patères
    K.banc(2, 2, 30, 4); K.banc(2, 4, 4, 30);
    for (let x = 4; x < 30; x += 5) { K.voxel(x, 0, 12, M.METAL); K.boite(x - 1, 0, 7, x + 2, 1, 12, M.JERSEY); }
    for (let y = 6; y < 30; y += 5) { K.voxel(0, y, 12, M.METAL); K.boite(0, y - 1, 7, 1, y + 2, 12, M.JERSEY); }
    for (const [x, n] of [[6, 1], [12, 2], [18, 3], [24, 4]]) K.place('banc_' + n, x, 5, { pose: 'assis', regarde: 'droite' });
    for (const [y, n] of [[10, 5], [18, 6], [26, 7]]) K.place('banc_' + n, 5, y, { pose: 'assis', regarde: 'droite' });
    K.objet('casier', 'Ton casier', 3, 20, 6);
    // le tableau noir des consignes (devant, la place de celui qui parle au groupe : visible,
    // pas derrière la cloison des douches)
    K.boite(32, 0, 7, 40, 1, 14, M.BOARD); K.boite(32, 0, 6, 40, 1, 7, M.WOOD_DARK);
    K.objet('tableau', 'Le tableau noir', 36, 1, 10);
    K.place('tableau', 35, 7, { regarde: 'gauche', pour: 'visiteur' });
    // la table de massage, le Doc
    K.boite(20, 16, 0, 21, 17, 4, M.METAL); K.boite(29, 16, 0, 30, 17, 4, M.METAL);
    K.boite(19, 14, 4, 31, 18, 5, M.WHITE); K.boite(20, 14, 5, 24, 18, 6, M.TOWEL);
    K.objet('massage', 'La table du Doc', 25, 16, 5);
    K.place('doc', 25, 21, { regarde: 'gauche', pour: 'sabatier' });
    // les douches, carrelées, dans le coin du fond à droite (une cloison basse, qui ne cache rien)
    K.boite(41, 8, 0, 46, 9, 10, M.FAIENCE);
    for (const x of [42, 44]) { K.boite(x, 0, 13, x + 1, 3, 14, M.METAL); K.voxel(x, 2, 12, M.CHROME); }
    K.objet('douches', 'Les douches', 43, 4, 6);
    // le sac de ballons, les plots, la valise du Doc
    K.boite(36, 26, 0, 40, 30, 3, M.BALLS);
    K.objet('ballons', 'Le sac de ballons', 38, 28, 3);
    K.boite(30, 30, 0, 34, 32, 3, M.CANVAS);
    K.place('milieu', 22, 26, { regarde: 'droite' });
    K.place('coach', 30, 24, { regarde: 'gauche', pour: 'vukic' });
    K.neon(10, 18, 30, 19, 17, M.TUBE, { c: [0.7, 0.85, 0.85], r: 56 });
    K.neon(30, 10, 31, 30, 17, M.TUBE, { c: [0.7, 0.85, 0.85], r: 56 });
    K.fenetreX(12, 13, 8, 3, { rebord: false });
  },
};
