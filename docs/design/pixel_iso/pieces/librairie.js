'use strict';
// La librairie-papeterie d'Odette Marsal : des livres du sol au plafond sur les deux murs, l'échelle
// sur son rail ; le comptoir, la caisse, la lampe verte, Odette derrière ; dans son dos, le meuble
// aux tiroirs (les pellicules), son appareil photo, et la Nord pleine en 1974 sous un cadre doré ;
// au milieu, la table où s'empile, intact, le livre de l'ancien joueur ; le tourniquet des cartes
// postales au bout des rayons ; les cahiers et les crayons de la papeterie.
const E = require('../engine');
const { LEFT, RIGHT, hash } = E;

// ─── la peinture : des images posées sur une face, au texel près (2 par voxel)
const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const PEINTRES = {};
E.overlay('librairie_pinceau', (o, c) => {
  if (c.face !== o.face) { if (o.flancs) o.flancs(c); return; }
  const la = o.face === LEFT ? Math.floor(2 * (c.hx - o.s0)) : Math.floor(2 * (o.s0 + o.w - c.hy));
  const lt = Math.floor(2 * (o.z0 + o.h - c.hz));
  const W2 = 2 * o.w, H2 = 2 * o.h;
  if (la < 0 || lt < 0 || la >= W2 || lt >= H2) return;
  PEINTRES[o.kind](o, c, la, lt, W2, H2);
});
// une image sur une face tournée vers +y (LEFT, le long de x) ou vers +x (RIGHT, le long de y) ;
// `en` : la couche qui la porte (-1 : le mur du fond lui-même) ; `mat` : une matière pour la poser
function peint(K, kind, face, s0, z0, w, h, o = {}) {
  const W = K.W, en = o.en != null ? o.en : -1;
  const id = W.obj(Object.assign({ type: 'librairie_pinceau', kind, face, s0, z0, w, h }, o));
  for (let z = z0; z < z0 + h; z++) for (let s = s0; s < s0 + w; s++) {
    const [x, y] = face === LEFT ? [s, en] : [en, s];
    if (o.mat) W.set(x, y, z, o.mat, id); else if (W.inb(x, y, z)) W.tag[W.idx(x, y, z)] = id;
  }
  return id;
}

// la Nord pleine, en 1974 : une photo de tribune, des milliers de visages, les écharpes tendues
PEINTRES.photo = (o, c, la, lt, W2, H2) => {
  if (la === 0 || lt === 0 || la === W2 - 1 || lt === H2 - 1) { rgb(c, 0.70, 0.54, 0.20); if ((la + lt) % 3 === 0) rgb(c, 0.86, 0.70, 0.30); return; }
  const y = lt - 1, h = H2 - 2;
  if (y < 1) { rgb(c, 0.40, 0.38, 0.34); return; }                                                     // le toit de la tribune
  if (y >= h - 1) { rgb(c, 0.32, 0.36, 0.26); return; }                                                // la pelouse
  const k = hash(la, lt, 1011, 0);
  rgb(c, 0.22 + 0.34 * k, 0.20 + 0.26 * k, 0.17 + 0.20 * k);                                           // la foule, en sépia
  if ((y === 3 && la % 5 < 4) || (y === 6 && (la + 2) % 6 < 4)) rgb(c, 0.50, 0.24, 0.20);               // les écharpes tendues
};
// le meuble aux tiroirs : les pellicules, une étiquette par tiroir, un tiroir entrouvert
PEINTRES.tiroirs = (o, c, la, lt, W2, H2) => {
  if (la === 0 || lt === 0 || la === W2 - 1 || lt === H2 - 1) { rgb(c, 0.20, 0.12, 0.07); return; }
  const x = (la - 1) % 5, y = (lt - 1) % 3;
  rgb(c, 0.40, 0.26, 0.14);
  if (x === 4 || y === 2) { rgb(c, 0.20, 0.12, 0.07); return; }
  if (y === 0 && x >= 1 && x <= 2) rgb(c, 0.86, 0.84, 0.74);
  if (y === 1 && x === 2) rgb(c, 0.82, 0.66, 0.26);
};
// le tourniquet des cartes postales : le pont, le stade, la Rive, la place, le soleil
PEINTRES.cartes = (o, c, la, lt, W2, H2) => {
  const x = la % 4, y = lt % 5, i = Math.floor(la / 4), j = Math.floor(lt / 5);
  rgb(c, 0.30, 0.30, 0.32);
  if (x === 3 || y === 4) return;
  const k = Math.floor(hash(i, j, 1012, o.s0) * 4);
  rgb(c, 0.94, 0.92, 0.86);
  if (k === 0) { rgb(c, 0.50, 0.66, 0.84); if (y >= 2) rgb(c, 0.30, 0.46, 0.66); if (y === 1 && x < 3) rgb(c, 0.60, 0.56, 0.50); }   // le pont sur la Rive
  else if (k === 1) { rgb(c, 0.56, 0.72, 0.88); if (y >= 2) rgb(c, 0.30, 0.56, 0.28); if (y === 1) rgb(c, 0.62, 0.20, 0.22); }      // le stade
  else if (k === 2) { rgb(c, 0.92, 0.70, 0.40); if (y === 0 && x === 1) rgb(c, 0.98, 0.90, 0.50); if (y >= 2) rgb(c, 0.40, 0.30, 0.26); } // le soir sur la place
};
// la couverture du livre de l'ancien joueur, posé debout sur son chevalet
PEINTRES.couverture = (o, c, la, lt, W2, H2) => {
  rgb(c, 0.44, 0.10, 0.16);
  if (lt >= 1 && lt <= 2 && la >= 1 && la < W2 - 1) rgb(c, 0.86, 0.80, 0.64);                     // le titre
  const d = Math.hypot(la - (W2 - 1) / 2, lt - H2 * 0.62);
  if (d < 1.6) rgb(c, 0.84, 0.66, 0.52);                                                             // le visage
  if (lt >= H2 - 3 && Math.abs(la - (W2 - 1) / 2) < 2.2) rgb(c, 0.62, 0.62, 0.60);                    // le maillot
};
// les cahiers de la papeterie, en piles de couleurs
PEINTRES.cahiers = (o, c, la, lt, W2, H2) => {
  const y = lt % 6;
  if (y >= 4) { rgb(c, 0.36, 0.22, 0.12); return; }
  const P = [[0.20, 0.36, 0.66], [0.70, 0.18, 0.16], [0.22, 0.52, 0.30], [0.86, 0.72, 0.22], [0.52, 0.30, 0.56], [0.86, 0.84, 0.78]];
  const p = P[Math.floor(hash(Math.floor(la / 4), Math.floor(lt / 6), 1013, 0) * P.length)];
  rgb(c, p[0], p[1], p[2]);
  if (la % 4 === 3) rgb(c, p[0] * 0.6, p[1] * 0.6, p[2] * 0.6);
  if (y === 1 && la % 4 === 1) rgb(c, 0.92, 0.90, 0.84);                                              // l'étiquette
};

// ─── quelques meubles
// un rayonnage de livres : des planches, des livres (I_LIVRES), un fond
function rayonnage(K, face, s0, s1, z1 = 15) {
  const { M } = K;
  for (let z = 0; z < z1; z += 3) {
    if (face === LEFT) { K.boite(s0, 0, z, s1, 3, z + 1, M.WOOD_DARK); if (z + 3 <= z1) K.boite(s0, 0, z + 1, s1, 2, z + 3, M.I_LIVRES); }
    else { K.boite(0, s0, z, 3, s1, z + 1, M.WOOD_DARK); if (z + 3 <= z1) K.boite(0, s0, z + 1, 2, s1, z + 3, M.I_LIVRES); }
  }
  if (face === LEFT) { K.boite(s0 - 1, 0, 0, s0, 3, z1 + 1, M.WOOD_DARK); K.boite(s1, 0, 0, s1 + 1, 3, z1 + 1, M.WOOD_DARK); K.boite(s0, 0, z1, s1, 3, z1 + 1, M.WOOD_DARK); }
  else { K.boite(0, s0 - 1, 0, 3, s0, z1 + 1, M.WOOD_DARK); K.boite(0, s1, 0, 3, s1 + 1, z1 + 1, M.WOOD_DARK); K.boite(0, s0, z1, 3, s1, z1 + 1, M.WOOD_DARK); }
}

module.exports = {
  cle: 'librairie', nom: 'La librairie-papeterie', ambiance: 'boutique',
  sx: 36, sy: 30, sol: 'I_PARQUET',
  murs: { bas: 'WOOD_DARK', haut: 'I_MUR_OCRE', coupe: 7 },
  porte: { cote: 'y', de: 22, a: 29 },
  build(K) {
    const { M } = K;
    // ── les rayons : des livres jusqu'au plafond, sur les deux murs ; l'échelle sur son rail
    rayonnage(K, LEFT, 2, 16);
    rayonnage(K, RIGHT, 2, 28);
    K.boite(3, 2, 16, 4, 28, 17, M.METAL);                                                      // le rail de l'échelle
    K.boite(3, 13, 0, 4, 14, 16, M.WOOD); K.boite(3, 16, 0, 4, 17, 16, M.WOOD);
    for (let z = 2; z < 16; z += 3) K.boite(3, 14, z, 4, 16, z + 1, M.WOOD);
    K.objet('rayons', 'Les rayons', 2, 20, 8, { acces: [6, 20] });
    K.place('libraire', 6, 9, { regarde: 'gauche', pour: 'personnel' });
    K.enseigneY(18, 17, 'LIBRAIRIE', { fg: [0.88, 0.80, 0.60], plate: [0.18, 0.12, 0.08], plateMat: M.WOOD_DARK, padX: 0, padY: 1 });

    // ── derrière le comptoir : le meuble aux tiroirs, l'appareil photo, la photo de 1974
    K.boite(22, 0, 0, 34, 3, 7, M.WOOD_DARK);
    peint(K, 'tiroirs', LEFT, 22, 0, 12, 7, { en: 2, mat: M.WOOD_DARK });
    K.boite(28, 3, 3, 30, 4, 4, M.WOOD);                                                        // le tiroir entrouvert
    K.boite(22, 0, 7, 34, 3, 8, M.WOOD);
    K.boite(31, 1, 8, 33, 3, 10, M.METAL_DARK); K.voxel(32, 3, 9, M.GLASS);                     // l'appareil photo
    K.boite(23, 2, 8, 24, 3, 9, M.PLASTIC_RED); K.boite(24, 2, 8, 25, 3, 9, M.AWNING_GREEN); K.boite(25, 2, 8, 26, 3, 9, M.PLASTIC_RED);   // des boîtes de pellicule
    K.objet('tiroir', 'Le tiroir des pellicules', 29, 3, 4, { acces: [29, 15] });
    peint(K, 'photo', LEFT, 22, 8, 12, 5, { en: 0, mat: M.WOOD_DARK });

    // ── le comptoir, la caisse, la lampe verte ; Odette derrière
    K.comptoir(22, 10, 34, 13, { mat: M.WOOD_DARK, dessus: M.WOOD });
    K.caisse(31, 10, 5); K.boite(24, 11, 5, 27, 13, 6, M.PAPER);
    K.voxel(23, 10, 5, M.GOLD); K.voxel(23, 10, 6, M.GOLD); K.voxel(23, 10, 7, M.BLOTTER); K.voxel(24, 10, 7, M.BLOTTER);
    K.lampe(24, 11, 6.6, { cache: true, r: 26, c: [1.25, 0.95, 0.5] });
    K.chaise(27, 6, { dos: 'y-', mat: M.WOOD });
    K.objet('comptoir', 'Le comptoir', 28, 11, 5, { acces: [28, 15] });
    K.place('odette', 28, 7, { pose: 'assis', regarde: 'gauche', pour: 'odette' });

    // ── la table du milieu : le livre de l'ancien joueur, la pile intacte, le chevalet
    K.table(9, 15, 9, 5, { mat: M.WOOD, h: 4 });
    for (const [x, y, h] of [[10, 16, 4], [12, 16, 4], [10, 18, 3]]) K.boite(x, y, 4, x + 2, y + 2, 4 + h, M.I_VELOURS);
    for (const [x, y, h] of [[14, 16, 2], [15, 18, 1]]) K.boite(x, y, 4, x + 2, y + 2, 4 + h, M.I_LIVRES);
    K.boite(13, 18, 4, 14, 19, 6, M.WOOD_DARK);
    peint(K, 'couverture', LEFT, 12, 6, 2, 3, { en: 18, mat: M.I_VELOURS });
    K.objet('livre_joueur', 'Le livre de l\'ancien joueur', 12, 17, 8, { acces: [13, 22] });
    K.place('client_1', 15, 22, { regarde: 'droite' });

    // ── le tourniquet des cartes postales, près de la porte
    K.boite(7, 24, 0, 8, 25, 2, M.METAL_DARK); K.boite(6, 23, 2, 9, 26, 3, M.METAL_DARK);
    peint(K, 'cartes', LEFT, 6, 3, 3, 8, { en: 25, mat: M.METAL_DARK });
    peint(K, 'cartes', RIGHT, 23, 3, 3, 8, { en: 8, mat: M.METAL_DARK });
    K.boite(6, 23, 3, 8, 25, 11, M.METAL_DARK);
    K.boite(6, 23, 11, 9, 26, 12, M.PLASTIC_RED);
    K.objet('cartes_postales', 'Les cartes postales', 7, 24, 7, { acces: [11, 25] });
    K.place('visiteur', 21, 24, { regarde: 'gauche', pour: 'visiteur' });

    // ── la papeterie : les cahiers en piles, les crayons dans leurs pots
    K.boite(25, 18, 0, 34, 21, 4, M.WOOD_DARK);
    peint(K, 'cahiers', LEFT, 25, 1, 9, 3, { en: 20, mat: M.WOOD_DARK });
    K.boite(25, 18, 4, 34, 21, 5, M.WOOD);
    for (const [x, m] of [[26, M.CAR_BLUE], [28, M.PLASTIC_RED], [30, M.AWNING_GREEN]]) { K.voxel(x, 19, 5, M.METAL_DARK); K.voxel(x, 19, 6, m); }
    K.boite(31, 19, 5, 33, 20, 7, M.PAPER);

    // ── la lumière : deux lampes de plafond, chaudes ; le jour par la porte
    K.lampe(12, 12, 15, { cache: true, r: 52, c: [1.2, 0.95, 0.6] });
    K.lampe(26, 20, 15, { cache: true, r: 44, c: [1.2, 0.95, 0.6] });
    if (K.jour) K.lampe(25, 28, 10, { cache: true, toujours: true, r: 26, c: [0.40, 0.45, 0.52], ombre: false });
  },
};
