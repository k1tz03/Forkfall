'use strict';
// La Banque Aubérivoise : le carrelage blanc et la lumière froide des tubes ; au fond, la porte
// ronde du coffre, ses boulons et son volant ; le guichet, son cordon et sa vitre, le tableau
// des taux ; le bureau du banquier contre le mur de gauche ; l'attente sous la fenêtre à
// barreaux, la plante verte ; les brochures près de la porte.
const E = require('../engine');
const { LEFT, RIGHT, hash } = E;

// ─── la peinture : des images posées sur une face, au texel près (2 par voxel)
const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const PEINTRES = {};
E.overlay('banque_pinceau', (o, c) => {
  if (c.face !== o.face) { if (o.flancs) o.flancs(c); return; }
  const la = o.face === LEFT ? Math.floor(2 * (c.hx - o.s0)) : Math.floor(2 * (o.s0 + o.w - c.hy));
  const lt = Math.floor(2 * (o.z0 + o.h - c.hz));
  const W2 = 2 * o.w, H2 = 2 * o.h;
  if (la < 0 || lt < 0 || la >= W2 || lt >= H2) return;
  PEINTRES[o.kind](o, c, la, lt, W2, H2);
});
// une image sur une face tournée vers +y (LEFT, le long de x) ou vers +x (RIGHT, le long de y) ;
// `en` : la couche qui la porte (-1 : le mur du fond lui-même) ; `mat` : une matière pour la poser ;
// `si(s, z)` : ne pose que les voxels qui le veulent (une forme ronde)
function peint(K, kind, face, s0, z0, w, h, o = {}) {
  const W = K.W, en = o.en != null ? o.en : -1;
  const id = W.obj(Object.assign({ type: 'banque_pinceau', kind, face, s0, z0, w, h }, o));
  for (let z = z0; z < z0 + h; z++) for (let s = s0; s < s0 + w; s++) {
    if (o.si && !o.si(s, z)) continue;
    const [x, y] = face === LEFT ? [s, en] : [en, s];
    if (o.mat) W.set(x, y, z, o.mat, id); else if (W.inb(x, y, z)) W.tag[W.idx(x, y, z)] = id;
  }
  return id;
}

// la porte du coffre : l'acier, les cercles, les boulons, les gonds
PEINTRES.coffre = (o, c, la, lt, W2, H2) => {
  const cx = (W2 - 1) / 2, cy = (H2 - 1) / 2, dx = la - cx, dy = lt - cy, d = Math.hypot(dx, dy);
  rgb(c, 0.62, 0.64, 0.66);
  if (d > W2 / 2 - 1.2) { rgb(c, 0.22, 0.23, 0.25); return; }                       // la tranche
  if (Math.abs(d - (W2 / 2 - 3.2)) < 0.7) { rgb(c, 0.32, 0.33, 0.35); return; }      // le cercle extérieur
  const a = Math.atan2(dy, dx), b = Math.round(a / (Math.PI / 6)) * (Math.PI / 6);
  if (Math.hypot(dx - Math.cos(b) * (W2 / 2 - 2.1), dy - Math.sin(b) * (W2 / 2 - 2.1)) < 0.75) { rgb(c, 0.86, 0.84, 0.76); return; } // les boulons
  if (Math.abs(d - 4.5) < 0.5) rgb(c, 0.40, 0.41, 0.43);
  if ((la + lt) % 5 === 0 && d < W2 / 2 - 4) { c.cr *= 1.06; c.cg *= 1.06; c.cb *= 1.06; }  // le brossé
};
// le tableau des taux : des chiffres blancs sur fond noir
const { textBitmap } = E;
const LIGNES = ['4.50', '6.25', '8.10'].map(t => textBitmap(t));
PEINTRES.taux = (o, c, la, lt, W2, H2) => {
  if (la === 0 || lt === 0 || la === W2 - 1 || lt === H2 - 1) { rgb(c, 0.40, 0.42, 0.44); return; }
  rgb(c, 0.06, 0.07, 0.08);
  if (lt >= 1 && lt <= 2 && la >= 2 && la < W2 - 2) { rgb(c, 0.55, 0.12, 0.14); return; }       // le bandeau rouge
  const i = Math.floor((lt - 3) / 6), y = (lt - 3) % 6;
  if (i >= 0 && i < 3) {
    if (la >= 2 && la < 8 && y >= 2 && y <= 3 && la % 2 === 0) { rgb(c, 0.60, 0.60, 0.56); return; } // le libellé
    const b = LIGNES[i];
    if (b.at(la - (W2 - 2 - b.w), y)) rgb(c, 0.92, 0.88, 0.62);
  }
};
// les brochures : livret, crédit, assurance, des couleurs franches
PEINTRES.brochures = (o, c, la, lt, W2, H2) => {
  const col = Math.floor(la / 3), x = la % 3, y = lt % 6;
  if (x === 2 || y >= 4) { rgb(c, 0.26, 0.17, 0.10); return; }
  const P = [[0.16, 0.30, 0.56], [0.62, 0.14, 0.14], [0.80, 0.68, 0.22], [0.20, 0.42, 0.28], [0.80, 0.78, 0.72]];
  const p = P[(col * 3 + Math.floor(lt / 6) * 2) % P.length];
  rgb(c, p[0], p[1], p[2]);
  if (y === 1) rgb(c, 0.88, 0.86, 0.80);
};
// l'affiche du livret : une pièce d'or, un bandeau bleu, trois lignes
PEINTRES.livret = (o, c, la, lt, W2, H2) => {
  if (la === 0 || lt === 0 || la === W2 - 1 || lt === H2 - 1) { rgb(c, 0.70, 0.70, 0.68); return; }
  rgb(c, 0.86, 0.84, 0.78);
  if (lt >= 1 && lt <= 2) { rgb(c, 0.14, 0.24, 0.48); return; }
  const d = Math.hypot(la - 3.5, lt - 5.5);
  if (d < 2.4) { rgb(c, 0.82, 0.64, 0.20); if (d < 1) rgb(c, 0.66, 0.50, 0.14); return; }
  if (la >= 7 && la < W2 - 1 && (lt === 4 || lt === 6) && hash(la, lt, 922, 0) < 0.8) rgb(c, 0.30, 0.30, 0.32);
};
// une horloge de bureau
PEINTRES.horloge = (o, c, la, lt, W2, H2) => {
  const cx = (W2 - 1) / 2, cy = (H2 - 1) / 2, d = Math.hypot(la - cx, lt - cy);
  if (d > W2 / 2 - 1.1) { rgb(c, 0.20, 0.20, 0.22); return; }
  rgb(c, 0.88, 0.88, 0.84);
  if ((la === Math.floor(cx) || la === Math.ceil(cx)) && lt <= cy && lt >= 1) rgb(c, 0.08, 0.08, 0.08);
  if (lt === Math.ceil(cy) && la >= cx && la <= cx + 2) rgb(c, 0.08, 0.08, 0.08);
};

// ─── quelques meubles
// une plante verte : un pot, des feuilles en touffe
function plante(K, x, y, h = 9) {
  const { M } = K;
  K.boite(x, y, 0, x + 2, y + 2, 3, M.WHITE);
  for (let z = 3; z < h; z++) for (let j = -2; j < 4; j++) for (let i = -2; i < 4; i++) {
    const d = Math.hypot(i - 0.5, j - 0.5, (z - h + 3) * 0.8);
    if (x + i < 0 || y + j < 0 || x + i >= K.SX || y + j >= K.SY) continue;
    if (d < 2.7 && hash(x + i, y + j, z, 921) < 0.82 - d * 0.18) K.voxel(x + i, y + j, z, M.HEDGE);
  }
}
// un poteau de laiton, pour le cordon de la file
function poteau(K, x, y) { K.boite(x, y, 0, x + 1, y + 1, 4, K.M.GOLD); }

module.exports = {
  cle: 'banque', nom: 'La Banque Aubérivoise', ambiance: 'bureau', personnel: 'commercant2',
  sx: 44, sy: 34, sol: 'I_CARRELAGE_BLANC',
  murs: { bas: 'PANEL', haut: 'I_MUR_GRIS', coupe: 7 },
  porte: { cote: 'x', de: 22, a: 29 },
  build(K) {
    const { M } = K;
    K.enseigneY(5, 17, 'BANQUE AUBÉRIVOISE', { fg: [0.84, 0.70, 0.30], plate: [0.12, 0.16, 0.22], plateMat: M.METAL_DARK, padX: 1, padY: 1 });

    // ── la porte du coffre, ronde, dans son cadre d'acier
    const rond = (r, cx, cz) => (s, z) => Math.hypot(s + 0.5 - cx, z + 0.5 - cz) < r;
    K.boite(2, 0, 0, 15, 1, 13, M.METAL_DARK);
    peint(K, 'coffre', LEFT, 3, 0, 11, 11, { en: 1, mat: M.METAL, si: rond(5.6, 8.5, 5.5), flancs: c => rgb(c, 0.30, 0.31, 0.33) });
    // le volant : quatre rayons et un moyeu
    for (let i = -2; i <= 2; i++) { K.voxel(8 + i, 2, 5, M.METAL_DARK); K.voxel(8, 2, 5 + i, M.METAL_DARK); }
    K.voxel(8, 2, 5, M.GOLD);
    K.boite(2, 1, 3, 3, 2, 4, M.METAL); K.boite(2, 1, 7, 3, 2, 8, M.METAL);         // les gonds
    K.voxel(14, 1, 12, M.RED_LIGHT);                                                  // le voyant de l'alarme
    K.objet('coffre', 'La porte du coffre', 8, 2, 6, { acces: [8, 7] });

    // ── le guichet : le comptoir, le dessus de marbre, la vitre et ses montants
    K.comptoir(18, 6, 38, 9, { mat: M.WOOD_DARK, dessus: M.STONE });
    for (const x of [18, 25, 31, 37]) K.boite(x, 7, 5, x + 1, 8, 11, M.METAL);
    K.boite(18, 7, 11, 38, 8, 12, M.METAL);
    K.boite(21, 7, 5, 23, 8, 6, M.METAL_DARK); K.boite(33, 7, 5, 35, 8, 6, M.METAL_DARK);  // les passe-billets
    K.boite(26, 6, 5, 29, 7, 6, M.PAPER); K.voxel(30, 8, 5, M.METAL_DARK);
    K.objet('guichet', 'Le guichet', 28, 8, 5, { acces: [28, 12] });
    K.place('guichetier', 28, 3, { regarde: 'gauche', pour: 'personnel' });
    // derrière : le tableau des taux, l'horloge, le meuble des espèces
    peint(K, 'taux', LEFT, 19, 6, 9, 7, { en: 0, mat: M.METAL });
    peint(K, 'horloge', LEFT, 31, 9, 3, 3, { en: 0, mat: M.METAL });
    K.boite(32, 1, 0, 37, 3, 4, M.METAL); K.boite(32, 1, 4, 37, 3, 5, M.METAL_DARK);
    // le cordon de la file
    for (const x of [19, 26, 33]) poteau(K, x, 13);
    K.boite(20, 13, 3, 26, 14, 4, M.I_VELOURS); K.boite(27, 13, 3, 33, 14, 4, M.I_VELOURS);
    K.place('client_1', 24, 11, { regarde: 'droite' });
    // le pupitre où l'on remplit les bordereaux, son stylo à la chaînette
    K.boite(30, 22, 0, 31, 23, 5, M.METAL_DARK); K.boite(28, 21, 5, 33, 24, 6, M.WOOD_DARK);
    K.boite(29, 22, 6, 31, 23, 7, M.PAPER); K.voxel(32, 22, 6, M.GOLD);

    // ── les brochures, près de la porte
    K.boite(39, 0, 0, 43, 2, 2, M.WOOD_DARK);
    for (let z = 2; z < 10; z += 3) { K.boite(39, 0, z, 43, 2, z + 1, M.WOOD_DARK); }
    peint(K, 'brochures', LEFT, 39, 3, 4, 6, { en: 1, mat: M.PAPER });
    K.boite(39, 0, 0, 40, 2, 10, M.WOOD_DARK); K.boite(42, 0, 0, 43, 2, 10, M.WOOD_DARK);
    K.objet('brochures', 'Les brochures', 41, 2, 6, { acces: [41, 6] });

    // ── l'attente : deux chaises sous la fenêtre à barreaux, la plante verte
    K.fenetreX(4, 9, 9, 5, { rideau: null });
    for (let y = 4; y < 13; y += 2) K.boite(0, y, 9, 1, y + 1, 14, M.METAL_DARK);
    K.chaise(1, 5, { dos: 'x-', mat: M.I_SKAI }); K.chaise(1, 9, { dos: 'x-', mat: M.I_SKAI });
    K.boite(1, 7, 0, 3, 9, 2, M.METAL_DARK); K.voxel(1, 7, 2, M.PAPER); K.voxel(2, 8, 2, M.PAPER);
    K.place('visiteur', 2, 10, { pose: 'assis', regarde: 'droite', pour: 'visiteur' });
    plante(K, 1, 14, 10);
    K.objet('plante', 'La plante verte', 2, 15, 6, { acces: [6, 15] });

    // ── le bureau du banquier : le relevé sous le coude, la lampe chromée, deux chaises
    K.tapis(1, 19, 15, 31);
    K.bureau(4, 20, 4, 9, { mat: M.WOOD_DARK, dessus: M.BLOTTER, papiers: false });
    K.boite(5, 22, 4, 7, 24, 5, M.PAPER); K.voxel(6, 26, 4, M.METAL_DARK); K.telephone(5, 27, 4);
    K.voxel(7, 21, 4, M.METAL); K.voxel(7, 21, 5, M.METAL); K.lampe(7.5, 21.5, 6.2, { r: 28, c: [1.15, 1.0, 0.75] });
    K.fauteuil(1, 22, { sens: 'x-', mat: M.LEATHER });
    K.chaise(10, 21, { dos: 'x+', mat: M.LEATHER }); K.chaise(10, 26, { dos: 'x+', mat: M.LEATHER });
    K.objet('bureau_banquier', 'Le bureau du banquier', 6, 24, 4, { acces: [13, 24] });
    K.place('banquier', 3, 23, { pose: 'assis', regarde: 'droite', pour: 'dorian' });
    K.place('client_2', 11, 27, { pose: 'assis', regarde: 'gauche' });
    K.place('achard', 13, 19, { regarde: 'gauche', pour: 'achard' });
    peint(K, 'livret', RIGHT, 21, 8, 6, 4, { en: 0, mat: M.METAL });

    // ── la lumière froide des tubes
    K.neon(0, 15, 1, 33, 15, M.TUBE, { c: [0.62, 0.76, 0.82], r: 46 });
    K.lampe(28, 5, 10, { cache: true, r: 34, c: [0.60, 0.74, 0.80] });
    K.lampe(26, 20, 14, { cache: true, r: 50, c: [0.55, 0.66, 0.72], ombre: false });
    if (K.jour) K.lampe(4, 8, 13, { cache: true, toujours: true, r: 28, c: [0.45, 0.50, 0.60], ombre: false });
  },
};
