'use strict';
// La pharmacie : le carrelage blanc et la lumière crue ; le comptoir parallèle au mur de gauche,
// le pharmacien derrière, et derrière lui les rayons de boîtes jusqu'au plafond ; au fond, le
// meuble aux cent tiroirs (celui des ordonnances) et la photocopieuse ; la croix verte allumée
// sous l'enseigne, les étagères de la parapharmacie, la gondole ; la balance près de la porte.
const E = require('../engine');
const { LEFT, RIGHT, hash } = E;

// ─── la peinture : des images posées sur une face, au texel près (2 par voxel)
const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const lum = (c, r, g, b) => { c.er = r; c.eg = g; c.eb = b; };
const PEINTRES = {};
E.overlay('pharmacie_pinceau', (o, c) => {
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
  const id = W.obj(Object.assign({ type: 'pharmacie_pinceau', kind, face, s0, z0, w, h }, o));
  for (let z = z0; z < z0 + h; z++) for (let s = s0; s < s0 + w; s++) {
    const [x, y] = face === LEFT ? [s, en] : [en, s];
    if (o.mat) W.set(x, y, z, o.mat, id); else if (W.inb(x, y, z)) W.tag[W.idx(x, y, z)] = id;
  }
  return id;
}

// les boîtes de médicaments : blanches, un bandeau de couleur, rangées par étagère
PEINTRES.boites = (o, c, la, lt, W2, H2) => {
  const y = lt % 6;
  if (y >= 4) { rgb(c, 0.86, 0.86, 0.82); if (y === 5) rgb(c, 0.70, 0.70, 0.66); return; }     // l'étagère
  const rang = Math.floor(lt / 6), w = 2 + (hash(Math.floor(la / 3), rang, 971, o.s0) < 0.4 ? 1 : 0);
  const n = Math.floor(la / 3), x = la % 3, h = hash(n, rang, 972, o.s0);
  if (x === 2 && w === 2) { rgb(c, 0.30, 0.32, 0.30); return; }
  const P = [[0.20, 0.52, 0.34], [0.22, 0.36, 0.64], [0.74, 0.20, 0.16], [0.86, 0.56, 0.16], [0.52, 0.30, 0.58]];
  const p = P[Math.floor(h * P.length)];
  if (h < 0.18) { rgb(c, p[0], p[1], p[2]); return; }                                          // une boîte toute de couleur
  rgb(c, 0.90, 0.90, 0.86);
  if (y === 1) rgb(c, p[0], p[1], p[2]);
  if (y === 0 && h > 0.85) rgb(c, 0.10, 0.10, 0.10);
};
// la parapharmacie : des flacons et des pots, des tons pâles
PEINTRES.produits = (o, c, la, lt, W2, H2) => {
  const y = lt % 6;
  if (y >= 4) { rgb(c, 0.84, 0.84, 0.80); if (y === 5) rgb(c, 0.66, 0.66, 0.62); return; }
  const n = Math.floor(la / 2), h = hash(n, Math.floor(lt / 6), 973, o.s0), x = la % 2;
  const P = [[0.92, 0.78, 0.80], [0.70, 0.84, 0.92], [0.94, 0.92, 0.84], [0.62, 0.82, 0.70], [0.96, 0.86, 0.60]];
  const p = P[Math.floor(h * P.length)];
  if (h > 0.9 || (x === 1 && h > 0.6)) { rgb(c, 0.40, 0.42, 0.40); return; }
  rgb(c, p[0], p[1], p[2]);
  if (y === 0 && h < 0.5) rgb(c, p[0] * 0.6, p[1] * 0.6, p[2] * 0.6);                           // le bouchon
};
// le meuble aux cent tiroirs : les étiquettes, les boutons de laiton
PEINTRES.tiroirs = (o, c, la, lt, W2, H2) => {
  if (la === 0 || lt === 0 || la === W2 - 1 || lt === H2 - 1) { rgb(c, 0.22, 0.13, 0.07); return; }
  const x = (la - 1) % 4, y = (lt - 1) % 3;
  rgb(c, 0.42, 0.27, 0.15);
  if (x === 3 || y === 2) { rgb(c, 0.20, 0.12, 0.07); return; }
  if (y === 0 && (x === 1 || x === 2)) rgb(c, 0.86, 0.84, 0.76);                               // l'étiquette
  if (y === 1 && x === 1) rgb(c, 0.82, 0.66, 0.26);                                              // le bouton
};
// la croix verte, allumée
PEINTRES.croix = (o, c, la, lt, W2, H2) => {
  const cx = (W2 - 1) / 2, cy = (H2 - 1) / 2;
  const dans = (Math.abs(la - cx) < 2 && Math.abs(lt - cy) < 5) || (Math.abs(lt - cy) < 2 && Math.abs(la - cx) < 5);
  if (!dans) { rgb(c, 0.10, 0.12, 0.11); lum(c, 0, 0, 0); return; }
  const bord = !((Math.abs(la - cx) < 1 && Math.abs(lt - cy) < 4) || (Math.abs(lt - cy) < 1 && Math.abs(la - cx) < 4));
  rgb(c, 0.30, 0.90, 0.40); lum(c, bord ? 0.10 : 0.30, bord ? 0.75 : 1.25, bord ? 0.22 : 0.40);
};
// le cadran de la balance
PEINTRES.cadran = (o, c, la, lt, W2, H2) => {
  const cx = (W2 - 1) / 2, cy = (H2 - 1) / 2, d = Math.hypot(la - cx, lt - cy);
  if (d > W2 / 2 - 0.6) { rgb(c, 0.70, 0.70, 0.66); return; }
  rgb(c, 0.92, 0.90, 0.84);
  if (Math.abs(d - (W2 / 2 - 1.4)) < 0.5 && (la + lt) % 2 === 0) rgb(c, 0.20, 0.20, 0.20);
  if (la === Math.floor(cx) && lt < cy && lt > 0) rgb(c, 0.75, 0.10, 0.10);                       // l'aiguille
};

module.exports = {
  cle: 'pharmacie', nom: 'La pharmacie', ambiance: 'soin', personnel: 'commercant',
  sx: 34, sy: 28, sol: 'I_CARRELAGE_BLANC',
  murs: { bas: 'I_MUR_VERT', haut: 'I_MUR_BLANC', coupe: 6 },
  porte: { cote: 'x', de: 16, a: 23 },
  build(K) {
    const { M } = K;
    // ── derrière le comptoir : les rayons de boîtes, du sol au plafond
    for (let z = 0; z < 16; z += 3) K.boite(0, 2, z, 3, 26, z + 1, M.WHITE);
    for (let z = 1; z < 15; z += 3) peint(K, 'boites', RIGHT, 3, z, 22, 2, { en: 1, mat: M.WHITE });
    for (let z = 1; z < 15; z += 3) K.boite(0, 3, z, 1, 25, z + 2, M.WHITE);
    K.boite(0, 2, 0, 3, 3, 16, M.WHITE); K.boite(0, 25, 0, 3, 26, 16, M.WHITE);
    K.objet('rayons', 'Les rayons', 2, 14, 8, { acces: [14, 18] });

    // ── le comptoir, le pharmacien, la caisse, le présentoir
    K.comptoir(9, 4, 12, 22, { mat: M.WOOD, dessus: M.I_FORMICA });
    K.boite(12, 4, 0, 13, 22, 1, M.I_MUR_VERT);                                         // la plinthe verte
    K.caisse(10, 18, 5); K.boite(10, 8, 5, 12, 10, 7, M.WHITE); K.voxel(10, 9, 7, M.PLASTIC_RED);   // le présentoir
    K.boite(10, 13, 5, 12, 15, 6, M.PAPER);                                              // l'ordonnance posée
    K.objet('comptoir', 'Le comptoir', 11, 13, 5, { acces: [14, 13] });
    K.place('pharmacien', 6, 13, { regarde: 'droite', pour: 'personnel' });
    K.place('client_1', 14, 11, { regarde: 'gauche' });
    K.place('client_2', 15, 16, { regarde: 'gauche' });

    // ── au fond : le meuble aux cent tiroirs, la photocopieuse
    K.boite(2, 0, 0, 9, 3, 10, M.WOOD_DARK);
    peint(K, 'tiroirs', LEFT, 2, 0, 7, 10, { en: 2, mat: M.WOOD_DARK });
    K.boite(2, 0, 10, 9, 3, 11, M.WOOD);
    K.objet('ordonnances', 'Le tiroir des ordonnances', 5, 2, 5, { acces: [14, 5] });
    K.boite(13, 1, 0, 17, 4, 5, M.PLASTIC_WHITE); K.boite(13, 1, 5, 17, 4, 6, M.METAL_DARK);
    K.boite(13, 1, 2, 17, 2, 3, M.METAL); K.voxel(16, 3, 5, M.LIT_PANEL);

    // ── l'enseigne, la croix verte ; la parapharmacie au mur ; la gondole
    K.enseigneY(14, 17, 'PHARMACIE', { fg: [0.30, 0.78, 0.40], plate: [0.92, 0.92, 0.88], plateMat: M.WHITE, padX: 1, padY: 1 });
    peint(K, 'croix', LEFT, 22, 7, 5, 5, { en: 0, mat: M.TUBE });
    K.lampe(24.5, 2.5, 9.5, { cache: true, r: 24, c: [0.2, 0.8, 0.3], toujours: true, ombre: false });
    for (const [x0, x1] of [[18, 22], [27, 33]]) {
      for (let z = 0; z < 9; z += 3) K.boite(x0, 0, z, x1, 2, z + 1, M.WHITE);
      for (let z = 1; z < 9; z += 3) peint(K, 'produits', LEFT, x0, z, x1 - x0, 2, { en: 1, mat: M.WHITE });
    }
    K.boite(18, 9, 0, 29, 12, 1, M.WHITE);
    for (let z = 1; z < 6; z += 3) { peint(K, 'produits', LEFT, 18, z, 11, 2, { en: 11, mat: M.WHITE }); K.boite(18, 9, z, 29, 11, z + 2, M.WHITE); }
    K.boite(18, 9, 3, 29, 12, 4, M.WHITE); K.boite(18, 9, 6, 29, 12, 7, M.WHITE);
    K.boite(23, 10, 7, 24, 11, 9, M.METAL); K.boite(21, 10, 9, 26, 11, 11, M.I_MUR_VERT);   // le panonceau de la gondole

    // ── la balance, près de la porte, son cadran
    K.boite(27, 23, 0, 31, 27, 1, M.WHITE); K.boite(28, 25, 1, 30, 26, 8, M.ENAMEL);
    peint(K, 'cadran', LEFT, 27, 8, 4, 4, { en: 25, mat: M.ENAMEL });
    K.boite(27, 25, 12, 31, 26, 13, M.I_MUR_VERT);
    K.objet('balance', 'La balance', 29, 26, 8, { acces: [29, 21] });
    K.place('visiteur', 25, 19, { regarde: 'gauche', pour: 'visiteur' });
    // la chaise pour attendre, la corbeille
    K.chaise(15, 22, { dos: 'x+', mat: M.PLASTIC_WHITE });

    // ── la lumière crue des tubes, la nuit comme le jour
    K.lampe(14, 12, 16, { cache: true, r: 60, c: [0.95, 1.0, 0.98] });
    K.lampe(26, 18, 16, { cache: true, r: 50, c: [0.95, 1.0, 0.98] });
    K.neon(4, 6, 5, 22, 16, M.TUBE, { c: [0.7, 0.8, 0.8], r: 36 });
  },
};
