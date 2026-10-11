'use strict';
// Immobilier Tessandier : le carrelage blanc, le nom en lettres d'or ; au fond, le bureau de
// Madame Tessandier et ses deux fauteuils pour les clients ; au milieu, sur son socle, la
// maquette des Terrasses de la Rive (le parc en mousse, le lac en résine, les immeubles dont on
// allume les fenêtres une à une) ; au mur, les annonces, des pavillons en photo ; dans le coin,
// la machine à café qu'on ne propose qu'une fois.
const E = require('../engine');
const { TOP, LEFT, RIGHT, hash } = E;

// ─── la peinture : des images posées sur une face, au texel près (2 par voxel)
const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const lum = (c, r, g, b) => { c.er = r; c.eg = g; c.eb = b; };
const PEINTRES = {};
E.overlay('agence_pinceau', (o, c) => {
  if (o.toutes) return PEINTRES[o.kind](o, c, 0, 0, 0, 0);
  if (c.face !== o.face) { if (o.flancs) o.flancs(c); return; }
  let la, lt;
  if (o.face === TOP) { la = Math.floor(2 * (c.hx - o.s0)); lt = Math.floor(2 * (c.hy - o.z0)); }
  else { la = o.face === LEFT ? Math.floor(2 * (c.hx - o.s0)) : Math.floor(2 * (o.s0 + o.w - c.hy)); lt = Math.floor(2 * (o.z0 + o.h - c.hz)); }
  const W2 = 2 * o.w, H2 = 2 * o.h;
  if (la < 0 || lt < 0 || la >= W2 || lt >= H2) return;
  PEINTRES[o.kind](o, c, la, lt, W2, H2);
});
// une image sur une face tournée vers +y (LEFT, le long de x), vers +x (RIGHT, le long de y), ou
// sur un dessus (TOP : s0, z0 sont alors x0, y0 ; w, h la largeur en x et la profondeur en y) ;
// `en` : la couche qui la porte (y, x, ou z pour un dessus) ; `mat` : une matière pour la poser
function peint(K, kind, face, s0, z0, w, h, o = {}) {
  const W = K.W, en = o.en != null ? o.en : -1;
  const id = W.obj(Object.assign({ type: 'agence_pinceau', kind, face, s0, z0, w, h }, o));
  for (let b = z0; b < z0 + h; b++) for (let s = s0; s < s0 + w; s++) {
    const [x, y, z] = face === LEFT ? [s, en, b] : face === RIGHT ? [en, s, b] : [s, b, en];
    if (o.mat) W.set(x, y, z, o.mat, id); else if (W.inb(x, y, z)) W.tag[W.idx(x, y, z)] = id;
  }
  return id;
}

// une annonce : la photo d'un pavillon (le ciel, le toit, la façade, la porte), le prix, parfois VENDU
function annonce(c, x, y, w, h, n) {
  rgb(c, 0.92, 0.91, 0.86);
  const ph = h - 3;
  if (y >= 1 && y < ph && x >= 1 && x < w - 1) {
    const cx = (w - 1) / 2, toit = 1 + Math.abs(x - cx) * 0.9;
    rgb(c, 0.52, 0.66, 0.80);                                                   // le ciel
    if (y >= ph - 1) rgb(c, 0.30, 0.46, 0.24);                                   // la pelouse
    else if (y >= toit + 1) { const m = [[0.84, 0.78, 0.62], [0.80, 0.70, 0.60], [0.86, 0.84, 0.80]][n % 3]; rgb(c, m[0], m[1], m[2]); if (Math.abs(x - cx) < 0.6 && y >= ph - 3) rgb(c, 0.32, 0.20, 0.12); if (y === ph - 4 && Math.abs(x - cx) > 1) rgb(c, 0.28, 0.36, 0.48); }
    else if (y >= toit - 0.5) rgb(c, 0.56, 0.22, 0.16);                          // le toit de tuiles
  }
  if (y === h - 2 && x >= 1 && x < w - 2) rgb(c, 0.20, 0.20, 0.22);              // le prix
  if (n % 5 === 3 && Math.abs(x - y + 1) <= 0) rgb(c, 0.78, 0.12, 0.10);         // VENDU, en travers
}
PEINTRES.annonces = (o, c, la, lt, W2, H2) => {
  if (la === 0 || lt === 0 || la === W2 - 1 || lt === H2 - 1) { rgb(c, 0.72, 0.72, 0.70); return; }
  rgb(c, 0.30, 0.34, 0.38);
  const cw = 7, ch = 9, gx = 1, i = Math.floor((la - 1) / cw), j = Math.floor((lt - 1) / ch), x = (la - 1) % cw, y = (lt - 1) % ch;
  if (x < cw - gx && y < ch - 1 && 1 + (i + 1) * cw <= W2 && 1 + (j + 1) * ch <= H2) annonce(c, x, y, cw - gx, ch - 1, i * 3 + j * 7 + 1);
};
// la maquette : la Rive, le parc, le lac, les allées
PEINTRES.terrain = (o, c, la, lt, W2, H2) => {
  rgb(c, 0.40, 0.56, 0.30);                                                      // la mousse du parc
  if (hash(la, lt, 951, 0) < 0.15) rgb(c, 0.34, 0.50, 0.26);
  if (lt >= H2 - 3) { rgb(c, 0.30, 0.44, 0.58); lum(c, 0.02, 0.03, 0.05); return; }            // la Rive
  const d = Math.hypot((la - W2 * 0.30) / 3.2, (lt - H2 * 0.55) / 2.2);
  if (d < 1) { rgb(c, 0.36, 0.56, 0.70); if (d < 0.5) rgb(c, 0.44, 0.64, 0.78); return; }       // le lac en résine
  if (lt === H2 - 4 || (la === Math.floor(W2 * 0.55) && lt < H2 - 3) || (lt === 3 && la > W2 * 0.55)) rgb(c, 0.80, 0.76, 0.64);   // les allées
};
// un immeuble de la maquette : des façades blanches, des fenêtres, quelques-unes allumées
PEINTRES.immeuble = (o, c) => {
  rgb(c, 0.88, 0.87, 0.82);
  if (c.face === TOP) { rgb(c, 0.70, 0.70, 0.68); return; }
  const a = c.face === LEFT ? Math.floor(2 * c.hx) : Math.floor(2 * c.hy), b = Math.floor(2 * c.hz);
  if (a % 2 === 0 && b % 2 === 1) {
    rgb(c, 0.26, 0.30, 0.36);
    if (hash(a, b, 952, c.face) < 0.45) { rgb(c, 0.95, 0.80, 0.40); lum(c, 0.55, 0.40, 0.12); }
  }
};
// le plan cadastral de la commune, sous verre
PEINTRES.cadastre = (o, c, la, lt, W2, H2) => {
  if (la === 0 || lt === 0 || la === W2 - 1 || lt === H2 - 1) { rgb(c, 0.18, 0.18, 0.20); return; }
  rgb(c, 0.88, 0.86, 0.78);
  const h = hash(Math.floor(la / 3), Math.floor(lt / 2), 953, 0);
  if (la % 3 === 0 || lt % 2 === 0) rgb(c, 0.56, 0.52, 0.46);
  else if (h < 0.18) rgb(c, 0.84, 0.66, 0.60);
  if (Math.abs(lt - (H2 * 0.6 + Math.sin(la / 3) * 1.5)) < 1) rgb(c, 0.42, 0.58, 0.72);
};

// ─── quelques meubles
// une plante verte : un pot, des feuilles en touffe
function plante(K, x, y, h = 9) {
  const { M } = K;
  K.boite(x, y, 0, x + 2, y + 2, 3, M.PLASTIC_WHITE);
  for (let z = 3; z < h; z++) for (let j = -2; j < 4; j++) for (let i = -2; i < 4; i++) {
    if (x + i < 0 || y + j < 0 || x + i >= K.SX || y + j >= K.SY) continue;
    const d = Math.hypot(i - 0.5, j - 0.5, (z - h + 3) * 0.8);
    if (d < 2.6 && hash(x + i, y + j, z, 954) < 0.82 - d * 0.18) K.voxel(x + i, y + j, z, M.HEDGE);
  }
}
// un fauteuil de bureau, cuir clair
function fauteuilClient(K, x, y) {
  const { M } = K;
  K.boite(x, y, 0, x + 2, y + 2, 2, M.CANVAS); K.boite(x, y + 1, 2, x + 2, y + 2, 5, M.CANVAS);
}

module.exports = {
  cle: 'agence', nom: 'Immobilier Tessandier', ambiance: 'bureau',
  sx: 38, sy: 30, sol: 'I_CARRELAGE_BLANC',
  murs: { bas: 'I_MUR_GRIS', haut: 'I_MUR_BLANC', coupe: 7, frise: 'METAL_DARK' },
  porte: { cote: 'y', de: 22, a: 29 },
  build(K) {
    const { M } = K;
    K.enseigneY(8, 17, 'TESSANDIER', { fg: [0.86, 0.70, 0.30], plate: [0.12, 0.22, 0.18], plateMat: M.METAL_DARK, padX: 2, padY: 1 });

    // ── au fond, devant la fenêtre sur le quai, le bureau de Madame Tessandier et les deux fauteuils
    K.fenetreY(21, 7, 10, 6, { rideau: null });
    K.tapis(19, 1, 34, 15);
    K.bureau(21, 5, 10, 4, { mat: M.WOOD_DARK, dessus: M.I_FORMICA, papiers: false });
    K.boite(22, 6, 4, 24, 8, 5, M.PAPER); K.boite(25, 6, 4, 27, 7, 6, M.PAPER);       // les dossiers, le compromis
    K.telephone(28, 6, 4); K.voxel(29, 8, 4, M.METAL_DARK);                          // le téléphone, le fichier rotatif
    K.voxel(22, 8, 4, M.WHITE); K.voxel(22, 8, 5, M.WHITE); K.voxel(22, 8, 6, M.PLASTIC_WHITE);
    K.lampe(22.5, 8.5, 6, { cache: true, r: 26, c: [1.2, 1.0, 0.7] });
    K.fauteuil(23, 1, { sens: 'y-', mat: M.LEATHER });
    fauteuilClient(K, 22, 11); fauteuilClient(K, 27, 11);
    K.objet('bureau', 'Le bureau de l\'agent', 26, 7, 4, { acces: [26, 15] });
    K.place('tessandier', 24, 3, { pose: 'assis', regarde: 'gauche', pour: 'tessandier' });
    K.place('client_1', 23, 12, { pose: 'assis', regarde: 'droite' });
    K.place('visiteur', 28, 12, { pose: 'assis', regarde: 'droite', pour: 'visiteur' });
    peint(K, 'cadastre', LEFT, 4, 7, 10, 6, { en: 0, mat: M.METAL_DARK });

    // ── la machine à café, dans le coin
    K.boite(32, 1, 0, 38, 4, 4, M.WOOD_DARK); K.boite(32, 1, 4, 38, 4, 5, M.I_FORMICA);
    K.boite(34, 1, 5, 37, 3, 9, M.METAL_DARK); K.boite(35, 3, 5, 36, 4, 6, M.METAL); K.voxel(35, 3, 7, M.RED_LIGHT);
    K.voxel(33, 2, 5, M.WHITE); K.voxel(33, 3, 5, M.WHITE); K.voxel(37, 3, 5, M.PAPER);
    K.objet('cafe', 'La machine à café', 35, 3, 7, { acces: [35, 8] });
    plante(K, 35, 22, 10);

    // ── au milieu, sur son socle, la maquette des Terrasses de la Rive
    K.boite(9, 14, 0, 23, 23, 3, M.WOOD_DARK); K.boite(8, 13, 3, 24, 24, 4, M.WOOD_DARK);
    K.boite(15, 24, 1, 18, 25, 2, M.GOLD);                                            // la plaque de laiton
    peint(K, 'terrain', TOP, 9, 14, 14, 9, { en: 4, mat: M.HEDGE });
    for (const [x, y, w, d, h] of [[11, 15, 3, 2, 4], [11, 15, 2, 2, 5], [15, 15, 3, 2, 3], [19, 15, 3, 3, 5], [19, 15, 2, 2, 6],
      [18, 19, 3, 2, 3], [13, 19, 2, 1, 2], [21, 19, 1, 2, 2]]) {
      const id = K.W.obj({ type: 'agence_pinceau', kind: 'immeuble', toutes: true });
      K.W.box(x, y, 5, x + w, y + d, 5 + h, M.WHITE, id);
    }
    for (const [x, y] of [[10, 18], [14, 21], [16, 18], [22, 14], [9, 15], [17, 21]]) K.voxel(x, y, 5, M.HEDGE);
    K.objet('maquette', 'La maquette de la résidence', 16, 18, 6, { acces: [16, 26] });
    K.place('clemence', 25, 19, { regarde: 'gauche', pour: 'clemence' });
    K.lampe(16, 18.5, 13, { cache: true, r: 22, c: [1.1, 0.95, 0.7] });

    // ── les annonces, au mur de gauche ; À VENDRE au-dessus ; le classeur
    peint(K, 'annonces', RIGHT, 13, 4, 15, 10, { en: 0, mat: M.METAL });
    K.enseigneX(13, 18, 'À VENDRE', { fg: [0.86, 0.18, 0.14], plate: [0.92, 0.90, 0.84], plateMat: M.WHITE, padX: 1, padY: 1 });
    K.objet('annonces', 'Les annonces', 1, 20, 10, { acces: [5, 20] });
    K.boite(0, 2, 0, 3, 7, 6, M.METAL); for (let z = 2; z < 6; z += 2) K.boite(2, 3, z, 3, 6, z + 1, M.METAL_DARK);

    // ── la lumière : deux plafonniers blancs, la lampe du bureau, le spot de la maquette
    K.lampe(14, 24, 15, { cache: true, c: [1.1, 1.0, 0.85], r: 56 });
    K.lampe(30, 17, 15, { cache: true, c: [1.1, 1.0, 0.85], r: 50 });
    if (K.jour) K.lampe(26, 4, 11, { cache: true, toujours: true, r: 34, c: [0.45, 0.50, 0.60], ombre: false });
  },
};
