'use strict';
// Le club-house du Racing : le secrétariat de Josiane devant, la vitrine des trophées, la
// table du conseil, la machine à café, le bureau du président au fond, sous la photo de 1974.
module.exports = {
  cle: 'clubhouse', nom: 'Le club-house du Racing', ambiance: 'bureau',
  sx: 48, sy: 36, sol: 'TILE_FLOOR',
  murs: { bas: 'PANEL', haut: 'PAINT_CREAM', coupe: 7 },
  porte: { cote: 'x', de: 24, a: 31 },
  build(K) {
    const { M } = K;
    // le bureau du président, au fond à droite, derrière sa table de chêne
    K.tapis(28, 1, 44, 12);
    K.bureau(31, 3, 10, 5, { mat: M.WOOD_DARK, dessus: M.BLOTTER });
    K.lampeBureau(39, 4); K.telephone(32, 4, 4);
    K.fauteuil(34, 0, { sens: 'y-', mat: M.LEATHER });
    K.chaise(32, 10, { dos: 'y+', mat: M.LEATHER }); K.chaise(37, 10, { dos: 'y+', mat: M.LEATHER });
    K.afficheY(33, 9, 8, 5, { title: '1974', bg: [0.42, 0.11, 0.16], fg: [0.86, 0.80, 0.62] });
    K.objet('bureau_president', 'Le bureau du président', 36, 5, 4);
    K.place('president', 36, 2, { pose: 'assis', regarde: 'droite', pour: 'aulard' });
    K.place('visiteur_1', 33, 12, { pose: 'assis', regarde: 'gauche', pour: 'visiteur' });
    K.place('visiteur_2', 38, 12, { pose: 'assis', regarde: 'gauche', pour: 'visiteur' });
    K.coffre(45, 1);
    // la vitrine des trophées
    K.boite(14, 0, 0, 26, 3, 4, M.WOOD_DARK);
    K.boite(14, 0, 4, 26, 1, 12, M.WOOD_DARK); K.boite(14, 0, 4, 15, 3, 12, M.WOOD_DARK); K.boite(25, 0, 4, 26, 3, 12, M.WOOD_DARK);
    K.boite(14, 0, 8, 26, 3, 9, M.WOOD_DARK); K.boite(14, 0, 12, 26, 3, 13, M.WOOD_DARK);
    for (const x of [16, 19, 22]) { K.boite(x, 1, 4, x + 1, 2, 6 + (x % 2), M.GOLD); K.voxel(x, 1, 7, M.GOLD); }
    for (const x of [17, 21]) { K.boite(x, 1, 9, x + 1, 2, 11, M.GOLD); K.boite(x - 1, 1, 11, x + 2, 2, 12, M.GOLD); }
    K.lampe(20, 2, 11.5, { r: 18, c: [0.9, 0.75, 0.4], cache: true });
    K.objet('trophees', 'La vitrine des trophées', 20, 2, 7);
    K.place('vitrine', 20, 6, { regarde: 'gauche' });
    // le secrétariat de Josiane : le bureau, la machine à écrire, le minitel, les classeurs
    for (let i = 0; i < 4; i++) K.boite(0, 2 + i * 4, 0, 3, 6 + i * 4, 10, M.METAL);
    K.bureau(6, 18, 9, 4, { mat: M.WOOD_DARK });
    K.boite(8, 19, 4, 11, 21, 6, M.METAL_DARK); K.boite(12, 18, 4, 15, 21, 7, M.MINITEL);
    K.lampeBureau(6, 18);
    K.chaise(9, 15, { dos: 'y-' });
    K.objet('secretariat', 'Le secrétariat', 10, 20, 5);
    K.place('secretaire', 10, 16, { pose: 'assis', regarde: 'droite', pour: 'josiane' });
    K.place('guichet', 10, 25, { regarde: 'gauche', pour: 'visiteur' });
    // le tableau d'affichage, la machine à café, la table du conseil
    K.boite(0, 24, 7, 1, 32, 13, M.CANVAS); K.voxel(0, 26, 10, M.PAPER); K.voxel(0, 29, 9, M.PAPER);
    K.objet('affichage', 'Le tableau d\'affichage', 1, 28, 10);
    K.boite(44, 16, 0, 47, 19, 7, M.METAL_DARK); K.voxel(45, 18, 5, M.LIT_PANEL);
    K.objet('cafe', 'La machine à café', 45, 18, 6);
    K.place('cafe', 42, 18, { regarde: 'droite' });
    K.table(20, 16, 12, 6, { mat: M.WOOD });
    for (const x of [21, 25, 29]) { K.chaise(x, 13, { dos: 'y-' }); K.chaise(x, 22, { dos: 'y+' }); }
    K.objet('conseil', 'La table du conseil', 26, 19, 4);
    K.place('conseil_1', 22, 14, { pose: 'assis', regarde: 'droite' });
    K.place('conseil_2', 30, 23, { pose: 'assis', regarde: 'gauche' });
    K.plante(44, 31);
    K.plafonnier(14, 14, { c: [0.8, 0.9, 0.9] }); K.plafonnier(36, 20, { c: [0.8, 0.9, 0.9] });
    K.fenetreY(2, 8, 8, 6, {});
  },
};
