'use strict';
// La buvette du kop : sous la tribune Nord, béton et bordeaux, le zinc, la télé
// au-dessus des bouteilles, le baby-foot et la cible. Gégé y a son tabouret.
module.exports = {
  cle: 'buvette', nom: 'La buvette du kop', ambiance: 'bar', personnel: 'commercant2',
  sx: 46, sy: 34, sol: 'I_BETON',
  murs: { bas: 'BRICK', haut: 'I_MUR_BORDEAUX', coupe: 7, frise: 'WOOD_DARK' },
  porte: { cote: 'x', de: 22, a: 29 },
  build(K) {
    const { M } = K;
    // le zinc le long du mur du fond, les bouteilles derrière
    K.etagere(4, 0, 26, 2, 6, 13, M.I_BOUTEILLES);
    K.comptoir(4, 6, 26, 9);
    K.boite(25, 0, 0, 26, 9, 4, M.WOOD_DARK);
    K.voxel(8, 7, 5, M.KEG); K.voxel(9, 7, 5, M.METAL); K.voxel(12, 7, 5, M.METAL);
    K.caisse(21, 6);
    for (const x of [6, 10, 14, 18, 22]) K.tabouret(x, 10);
    K.place('barman', 14, 3, { regarde: 'droite', pour: 'personnel' });
    K.place('zinc_1', 7, 13, { regarde: 'gauche' });
    K.place('zinc_2', 15, 13, { regarde: 'gauche' });
    K.place('zinc_3', 21, 13, { regarde: 'gauche' });
    K.objet('comptoir', 'Le zinc', 15, 8, 5, { acces: [16, 13] });
    // la télé, en hauteur, au coin du comptoir
    K.boite(28, 0, 10, 30, 2, 11, M.METAL_DARK);
    K.tele(27, 1, { z: 11, sens: 'y' });
    K.objet('tele', 'La télé', 28, 3, 12);
    // l'ardoise des matchs et les écharpes
    K.boite(32, 0, 8, 42, 1, 14, M.BOARD);
    K.boite(32, 0, 7, 42, 1, 8, M.WOOD_DARK); K.boite(32, 0, 14, 42, 1, 15, M.WOOD_DARK);
    K.objet('ardoise', 'L\'ardoise des matchs', 37, 1, 11);
    for (const x of [2, 28, 44]) K.boite(x, 0, 15, x + 2, 1, 17, M.JERSEY);
    K.enseigneY(30, 18, 'KOP NORD', { fg: [1.0, 0.45, 0.6], plate: null, plateMat: null, depth: -1, light: { c: [0.8, 0.2, 0.4], r: 26 } });
    // la cible, le baby-foot, le flipper, côté gauche
    K.cibleX(6, 7);
    K.objet('flechettes', 'La cible', 1, 7, 8);
    K.babyfoot(6, 17);
    K.objet('babyfoot', 'Le baby-foot', 9, 19, 4);
    K.flipper(1, 27, 'y');
    K.objet('flipper', 'Le flipper', 2, 29, 5);
    // deux tables hautes et leurs tabourets
    for (const [tx, ty] of [[32, 13], [34, 24]]) {
      K.table(tx, ty, 4, 4, { h: 5, pied: 'central', mat: M.WOOD_DARK });
      K.tabouret(tx - 2, ty + 1); K.tabouret(tx + 4, ty + 1);
    }
    K.place('table_1', 31, 18, { regarde: 'droite', pour: 'visiteur' });
    K.place('table_2', 37, 18, { regarde: 'gauche' });
    K.place('table_3', 33, 29, { regarde: 'droite' });
    K.place('fond', 19, 24, { regarde: 'droite', pour: 'gege' });
    // le frigo des sodas, le panneau du club
    K.frigo(42, 1);
    K.lampe(43.5, 4.5, 6, { r: 14, c: [0.4, 0.55, 0.7], cache: true });
    // la lumière : deux plafonniers jaunes, le néon de l'enseigne
    K.plafonnier(14, 13, { c: [1.4, 1.0, 0.55] });
    K.plafonnier(35, 19, { c: [1.3, 0.95, 0.5] });
    K.fenetreX(14, 9, 6, 4, { rideau: [0.5, 0.12, 0.16] });
  },
};
