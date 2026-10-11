'use strict';
// Deux pièces au troisième, rue des Lilas : le lit, la table et ses papiers, le coin cuisine,
// la télé devant le fauteuil, le téléphone sur sa tablette, la fenêtre sur la boulangerie.
module.exports = {
  cle: 'appartement', nom: 'Ton appartement', ambiance: 'maison',
  sx: 42, sy: 36, sol: 'I_PARQUET',
  murs: { bas: 'WALLPAPER', haut: 'WALLPAPER', coupe: 6, plinthe: 'WOOD_DARK' },
  porte: { cote: 'y', de: 30, a: 37 },
  build(K) {
    const { M } = K;
    // le coin cuisine, contre le mur de droite
    K.frigo(1, 1);
    K.boite(5, 0, 0, 14, 3, 4, M.ENAMEL); K.boite(5, 0, 4, 14, 3, 5, M.I_FORMICA);
    K.boite(9, 0, 5, 11, 2, 6, M.METAL);
    K.boite(5, 0, 10, 14, 2, 13, M.WOOD);
    K.objet('cuisine', 'Le coin cuisine', 9, 2, 5);
    K.place('cuisine', 9, 6, { regarde: 'gauche' });
    // la fenêtre sur la rue des Lilas
    K.fenetreY(17, 6, 10, 8, { rideau: [0.6, 0.5, 0.35] });
    K.objet('fenetre', 'La fenêtre', 22, 1, 9);
    K.place('fenetre', 22, 5, { regarde: 'gauche' });
    K.radiateur(17, 0, 27, 1);
    // la table et ses papiers, deux chaises
    K.table(15, 13, 8, 6, { mat: M.WOOD });
    K.voxel(16, 14, 4, M.PAPER); K.voxel(17, 14, 4, M.PAPER); K.voxel(17, 15, 4, M.PAPER); K.voxel(21, 16, 4, M.WHITE);
    K.chaise(12, 15, { dos: 'x-' }); K.chaise(24, 15, { dos: 'x+' });
    K.objet('table', 'La table et ses papiers', 19, 15, 4);
    K.place('table_1', 13, 16, { pose: 'assis', regarde: 'droite' });
    K.place('table_2', 25, 16, { pose: 'assis', regarde: 'gauche', pour: 'visiteur' });
    // le lit, contre le mur de gauche ; la table de nuit, le réveil
    K.lit(1, 18, { sens: 'x', long: 10, large: 8 });
    K.boite(1, 27, 0, 4, 30, 3, M.WOOD_DARK); K.voxel(2, 28, 3, M.CLOCK);
    K.lampe(2.5, 28.5, 5, { r: 26, c: [1.2, 0.85, 0.45] });
    K.objet('lit', 'Le lit', 6, 22, 3);
    // le téléphone sur sa tablette, près de la porte
    K.boite(1, 9, 0, 3, 12, 4, M.WOOD_DARK); K.telephone(1, 10, 4);
    K.objet('telephone', 'Le téléphone', 2, 10, 5);
    K.place('telephone', 4, 10, { regarde: 'gauche' });
    // la télé et le fauteuil
    K.tele(33, 1, { sens: 'y' });
    K.fauteuil(32, 10, { sens: 'y+', mat: M.I_VELOURS });
    K.objet('tele', 'La télé', 34, 3, 5);
    K.place('fauteuil', 33, 11, { pose: 'assis', regarde: 'gauche', pour: 'camille' });
    // l'armoire, le miroir, l'écharpe du club, le portemanteau
    K.boite(38, 14, 0, 42, 22, 13, M.WOOD_DARK);
    K.objet('armoire', 'L\'armoire', 39, 18, 7);
    K.surMurX(5, 9, 9, 10, M.JERSEY);
    K.afficheX(10, 8, 4, 5, { title: 'RIVE', bg: [0.42, 0.11, 0.16], fg: [0.86, 0.80, 0.62] });
    K.porteManteau(29, 33);
    K.tapis(12, 22, 26, 30);
    K.place('milieu', 20, 26, { regarde: 'droite', pour: 'visiteur' });
    K.plafonnier(19, 16, { c: [1.2, 0.95, 0.65] });
  },
};
