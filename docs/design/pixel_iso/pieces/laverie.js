'use strict';
// La laverie de la rue du Stade : la faïence, le carrelage, LAVERIE en néon bleu ; cinq machines
// numérotées le long du mur du fond (trois qui tournent ; sur la 4, un papier scotché), les
// sèche-linge empilés à gauche sous un tube qui clignote, le monnayeur et le distributeur de
// lessive, les petites annonces ; la table de pliage et des maillots du Racing ; trois chaises en
// plastique tournées vers les hublots.
const E = require('../engine');
const { LEFT, RIGHT } = E;

// ─── la peinture : des images posées sur une face, au texel près (2 par voxel)
const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const PEINTRES = {};
E.overlay('laverie_pinceau', (o, c) => {
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
  const id = W.obj(Object.assign({ type: 'laverie_pinceau', kind, face, s0, z0, w, h }, o));
  for (let z = z0; z < z0 + h; z++) for (let s = s0; s < s0 + w; s++) {
    const [x, y] = face === LEFT ? [s, en] : [en, s];
    if (o.mat) W.set(x, y, z, o.mat, id); else if (W.inb(x, y, z)) W.tag[W.idx(x, y, z)] = id;
  }
  return id;
}

// les petites annonces : des feuilles punaisées, leurs languettes à arracher
PEINTRES.annonces = (o, c, la, lt, W2, H2) => {
  if (la === 0 || lt === 0 || la === W2 - 1 || lt === H2 - 1) { rgb(c, 0.32, 0.22, 0.14); return; }
  rgb(c, 0.58, 0.44, 0.28);
  for (const [x0, y0, w, h, k] of [[1, 1, 4, 6, 0], [6, 2, 3, 4, 1], [10, 1, 4, 5, 2], [2, 8, 3, 3, 1], [7, 7, 4, 4, 0]]) {
    if (la >= x0 && la < x0 + w && lt >= y0 && lt < y0 + h) {
      rgb(c, k === 1 ? 0.92 : 0.88, k === 1 ? 0.86 : 0.88, k === 1 ? 0.56 : 0.84);
      if (lt === y0 + h - 1 && la % 2) rgb(c, 0.50, 0.40, 0.28);                     // les languettes
      else if ((lt - y0) % 2 === 1 && lt < y0 + h - 1 && la > x0 && la < x0 + w - 1) rgb(c, 0.40, 0.40, 0.42);
      if (k === 2 && lt === y0 + 1 && la === x0 + 1) rgb(c, 0.70, 0.14, 0.12);
      return;
    }
  }
};
// le distributeur de lessive : derrière la vitre, des barils de couleur
PEINTRES.lessive = (o, c, la, lt, W2, H2) => {
  if (la === 0 || la === W2 - 1 || lt === 0 || lt === H2 - 1) { rgb(c, 0.40, 0.42, 0.44); return; }
  if (lt >= H2 - 3) { rgb(c, 0.30, 0.32, 0.34); if (lt === H2 - 2 && la % 3 === 1) rgb(c, 0.10, 0.10, 0.10); return; }   // les tiroirs à pièces
  const k = Math.floor(la / 3) % 3;
  rgb(c, [0.86, 0.30, 0.20][k], [0.40, 0.56, 0.24][k], [0.18, 0.80, 0.80][k]);
  if (lt % 4 === 0) rgb(c, 0.92, 0.92, 0.88);
  if ((la + lt) % 6 === 0) { c.cr += 0.15; c.cg += 0.15; c.cb += 0.15; }
};

// ─── quelques meubles
// une machine à hublot (la matière d'émail, le hublot peint par le calque « porthole »)
function machine(K, face, s0, z0, w, h, depth, o = {}) {
  const { M } = K, W = K.W;
  if (face === LEFT) {
    K.boite(s0, 0, z0, s0 + w, depth, z0 + h, M.ENAMEL);
    const id = W.obj({ type: 'porthole', face: LEFT, a0: s0, z0, w, h, r: o.r || 2.4, run: !!o.run, seed: o.seed || 0 });
    for (let x = s0; x < s0 + w; x++) for (let z = z0; z < z0 + h; z++) W.tag[W.idx(x, depth - 1, z)] = id;
  } else {
    K.boite(0, s0, z0, depth, s0 + w, z0 + h, M.ENAMEL);
    const id = W.obj({ type: 'porthole', face: RIGHT, a0: s0 + w, z0, w, h, r: o.r || 2.4, run: !!o.run, seed: o.seed || 0 });
    for (let y = s0; y < s0 + w; y++) for (let z = z0; z < z0 + h; z++) W.tag[W.idx(depth - 1, y, z)] = id;
  }
}
// une chaise en plastique moulé, dossier du côté +y
function chaisePlastique(K, x, y, m) {
  const { M } = K;
  K.voxel(x, y, 0, M.METAL); K.voxel(x + 1, y, 0, M.METAL); K.voxel(x, y + 1, 0, M.METAL); K.voxel(x + 1, y + 1, 0, M.METAL);
  K.boite(x, y, 1, x + 2, y + 2, 2, m); K.boite(x, y + 1, 2, x + 2, y + 2, 5, m);
}

module.exports = {
  cle: 'laverie', nom: 'La laverie', ambiance: 'salle',
  sx: 40, sy: 34, sol: 'TILE_FLOOR',
  murs: { bas: 'FAIENCE', haut: 'PAINT_CREAM', coupe: 6 },
  porte: { cote: 'y', de: 26, a: 33 },
  build(K) {
    const { M } = K;
    K.enseigneY(9, 17, 'LAVERIE', { fg: [0.55, 0.85, 1.0], emit: [0.35, 0.80, 1.20], plate: [0.06, 0.07, 0.10], plateMat: M.METAL_DARK, padX: 1, padY: 1 });
    K.lampe(16, 2.5, 14.5, { cache: true, r: 22, c: [0.25, 0.55, 0.85], toujours: true, ombre: false });

    // ── les cinq machines, numérotées ; trois qui tournent ; un papier scotché sur la 4
    for (let i = 0; i < 5; i++) {
      const x = 6 + i * 4;
      machine(K, LEFT, x, 0, 4, 5, 4, { run: i === 1 || i === 3 || i === 4, seed: i + 3, r: 2.6 });
      K.enseigneY(x + 1, 9, String(i + 1), { fg: [0.12, 0.12, 0.14], plate: [0.88, 0.86, 0.80], plateMat: M.WHITE, padX: 1, padY: 1 });
    }
    K.boite(19, 3, 3, 21, 4, 5, M.PAPER);                                                      // PAS APRÈS MINUIT
    K.objet('machines', 'Les machines', 16, 4, 3, { acces: [16, 7] });

    // ── les sèche-linge empilés, et le tube qui clignote au-dessus
    for (let j = 0; j < 3; j++) for (const z0 of [0, 5]) machine(K, RIGHT, 4 + j * 4, z0, 4, 5, 4, { run: (j + z0) % 3 === 1, seed: 10 + j * 2 + z0, r: 2.8 });
    K.boite(0, 4, 10, 4, 16, 11, M.METAL_DARK);
    K.boite(1, 4, 13, 2, 9, 14, M.TUBE); K.boite(1, 9, 13, 2, 11, 14, M.METAL); K.boite(1, 11, 13, 2, 16, 14, M.TUBE);
    K.lampe(3, 10, 12.5, { cache: true, r: 40, c: [0.62, 0.80, 0.86], ombre: false });
    K.objet('sechoirs', 'Les sèche-linge', 2, 10, 5, { acces: [7, 10] });

    // ── le monnayeur, le distributeur de lessive, les petites annonces
    K.boite(28, 0, 4, 31, 2, 10, M.METAL); K.voxel(29, 2, 8, M.LIT_PANEL); K.voxel(30, 2, 8, M.LIT_PANEL); K.voxel(29, 2, 6, M.METAL_DARK); K.boite(28, 1, 4, 31, 3, 5, M.METAL_DARK);
    K.lampe(29.5, 3.5, 8, { cache: true, r: 10, c: [0.6, 0.9, 0.7], toujours: true, ombre: false });
    K.objet('monnayeur', 'Le monnayeur', 29, 2, 7, { acces: [29, 6] });
    K.boite(32, 0, 0, 36, 3, 9, M.METAL);
    peint(K, 'lessive', LEFT, 32, 1, 4, 7, { en: 2, mat: M.METAL });
    peint(K, 'annonces', LEFT, 32, 10, 7, 5, { en: 0, mat: M.WOOD_DARK });
    K.objet('annonces', 'Les petites annonces', 35, 1, 12, { acces: [35, 6] });

    // ── la table de pliage : des maillots du Racing pliés, des serviettes, un panier
    K.table(14, 15, 11, 4, { h: 4, mat: M.WHITE, pied: M.METAL });
    K.boite(15, 16, 4, 18, 18, 5, M.JERSEY); K.boite(15, 16, 5, 18, 18, 6, M.JERSEY); K.boite(19, 16, 4, 22, 18, 5, M.TOWEL);
    K.boite(23, 15, 4, 24, 19, 5, M.JERSEY);
    K.boite(26, 15, 0, 29, 18, 3, M.PLASTIC_WHITE); K.voxel(27, 16, 3, M.JERSEY);
    K.objet('pliage', 'La table de pliage', 19, 17, 4, { acces: [19, 21] });

    // ── trois chaises en plastique, tournées vers les hublots
    chaisePlastique(K, 9, 9, M.PLASTIC_RED); chaisePlastique(K, 13, 9, M.CAR_BLUE); chaisePlastique(K, 17, 9, M.PLASTIC_RED);
    K.place('attente_1', 10, 10, { pose: 'assis', regarde: 'droite' });
    K.place('machines', 21, 6, { regarde: 'gauche' });                                     // devant la 4
    K.place('pliage', 21, 21, { regarde: 'droite' });                                      // à la table de pliage
    K.place('attente_2', 14, 10, { pose: 'assis', regarde: 'droite' });
    K.place('attente_3', 18, 10, { pose: 'assis', regarde: 'droite', pour: 'visiteur' });
    K.voxel(5, 25, 0, M.JERSEY);                                                                // une chaussette perdue
    // le chariot à linge, la poubelle
    for (const [x, y] of [[30, 23], [33, 23], [30, 26], [33, 26]]) K.voxel(x, y, 0, M.METAL_DARK);
    K.boite(30, 23, 1, 34, 27, 4, M.METAL); K.boite(31, 24, 2, 33, 26, 4, M.TOWEL); K.voxel(32, 25, 4, M.JERSEY);
    K.boite(37, 6, 0, 39, 8, 4, M.BIN);

    // ── la lumière froide des néons
    K.neon(6, 1, 26, 2, 11, M.TUBE, { c: [0.66, 0.82, 0.86], r: 50 });
    K.lampe(20, 20, 15, { cache: true, r: 50, c: [0.62, 0.78, 0.84] });
  },
};
