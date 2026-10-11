'use strict';
// Le cabinet du Doc : le lino, le vert d'hôpital jusqu'à mi-mur ; au fond, le bureau du Doc sous
// le store, sa lampe, son stéthoscope ; à côté, le négatoscope allumé sur deux radios ; la table
// d'examen derrière son paravent, la toise, l'échelle des lettres ; l'armoire vitrée fermée à
// clé ; devant, la salle d'attente : trois chaises, les revues, le coffre à jouets et l'ardoise.
const E = require('../engine');
const { LEFT, RIGHT, hash } = E;

// ─── la peinture : des images posées sur une face, au texel près (2 par voxel)
const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const lum = (c, r, g, b) => { c.er = r; c.eg = g; c.eb = b; };
const PEINTRES = {};
E.overlay('cabinet_pinceau', (o, c) => {
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
  const id = W.obj(Object.assign({ type: 'cabinet_pinceau', kind, face, s0, z0, w, h }, o));
  for (let z = z0; z < z0 + h; z++) for (let s = s0; s < s0 + w; s++) {
    const [x, y] = face === LEFT ? [s, en] : [en, s];
    if (o.mat) W.set(x, y, z, o.mat, id); else if (W.inb(x, y, z)) W.tag[W.idx(x, y, z)] = id;
  }
  return id;
}

// le négatoscope : deux radios sur la vitre éclairée, un genou et une cage thoracique
PEINTRES.radios = (o, c, la, lt, W2, H2) => {
  lum(c, 0, 0, 0);
  if (la === 0 || lt === 0 || la === W2 - 1 || lt === H2 - 1) { rgb(c, 0.56, 0.58, 0.60); return; }
  const g = o.jour ? 0.8 : 1;
  const film = (r, gg, b) => { rgb(c, r * 0.5, gg * 0.5, b * 0.5); lum(c, r * g, gg * g, b * g); };
  const half = W2 / 2;
  if (la === half - 1 || la === half || lt === 1 || lt === H2 - 2 || la === 1 || la === W2 - 2) { film(0.80, 0.86, 0.90); return; }  // la vitre, nue
  film(0.16, 0.21, 0.30);
  const x = la < half ? la - 2 : la - half - 1, w = half - 3, y = lt - 2, h = H2 - 4;
  if (la < half) {
    // le genou : le fémur qui descend, ses deux condyles, la rotule, le tibia, le péroné
    const cx = (w - 1) / 2;
    if (y < h * 0.42 && Math.abs(x - cx) < 1.1) film(0.78, 0.86, 0.96);
    if (y >= h * 0.36 && y < h * 0.50 && Math.abs(x - cx) < 2.2) film(0.80, 0.88, 0.98);
    if (y >= h * 0.56 && y < h * 0.64 && Math.abs(x - cx) < 2.0) film(0.74, 0.82, 0.92);
    if (y >= h * 0.62 && Math.abs(x - cx + 0.4) < 1.0) film(0.76, 0.84, 0.94);
    if (y >= h * 0.66 && Math.abs(x - cx - 2.0) < 0.5) film(0.52, 0.60, 0.72);
  } else {
    // la cage thoracique : la colonne, les côtes en arcs
    const cx = (w - 1) / 2, dx = Math.abs(x - cx);
    if (dx < 0.6) film(0.70, 0.78, 0.88);
    else if (y >= 1 && y < h - 1 && (y + Math.floor(dx / 2)) % 2 === 0 && dx < 3.6) film(0.60, 0.68, 0.80);
  }
};
// le store vénitien : des lames crème, et le jour (ou la nuit) entre les lames
PEINTRES.store = (o, c, la, lt, W2, H2) => {
  if (la === 0 || la === W2 - 1 || lt === 0) { rgb(c, 0.70, 0.70, 0.66); return; }
  if (lt % 3 === 2) {
    if (o.jour) { rgb(c, 0.30, 0.34, 0.40); lum(c, 0.50, 0.56, 0.66); } else { rgb(c, 0.05, 0.06, 0.10); lum(c, 0.03, 0.04, 0.08); }
    return;
  }
  rgb(c, 0.80, 0.78, 0.70); if (lt % 3 === 1) rgb(c, 0.70, 0.68, 0.60);
  if (la === Math.floor(W2 / 2)) rgb(c, 0.56, 0.54, 0.50);                          // le cordon
};
// l'armoire vitrée : le fond clair, les étagères, les flacons bruns, les boîtes blanches, la croix
PEINTRES.armoire = (o, c, la, lt, W2, H2) => {
  if (la === 0 || la === W2 - 1 || lt === 0 || lt === H2 - 1 || la === W2 / 2 - 1 || la === W2 / 2) { rgb(c, 0.82, 0.82, 0.78); return; }
  if (lt <= 3) { rgb(c, 0.82, 0.82, 0.78); const d = Math.abs(la - W2 / 2 + 0.5); if ((lt === 2 && d < 2.5) || (d < 1 && lt >= 1 && lt <= 3)) rgb(c, 0.72, 0.12, 0.12); return; }
  if (lt >= H2 - 6) { rgb(c, 0.78, 0.78, 0.74); if (lt === H2 - 4 && (la === 3 || la === W2 - 4)) rgb(c, 0.40, 0.40, 0.40); return; }
  if ((lt - 4) % 5 === 4) { rgb(c, 0.66, 0.66, 0.62); return; }                                      // les étagères
  rgb(c, 0.60, 0.66, 0.66);
  const k = hash(la, Math.floor((lt - 4) / 5), 941, 0), y = (lt - 4) % 5;
  if (y >= 1) {
    if (k < 0.30 && la % 2 === 1) rgb(c, 0.42, 0.20, 0.08);
    else if (k > 0.55 && k < 0.85 && y >= 2) rgb(c, 0.92, 0.92, 0.88);
    else if (k >= 0.85 && la % 2 === 0) rgb(c, 0.22, 0.36, 0.62);
  }
  if ((la - lt) % 9 === 0) { c.cr += 0.10; c.cg += 0.12; c.cb += 0.12; }                               // le reflet de la vitre
};
// le miroir du lavabo
PEINTRES.miroir = (o, c, la, lt, W2, H2) => {
  if (la === 0 || lt === 0 || la === W2 - 1 || lt === H2 - 1) { rgb(c, 0.70, 0.70, 0.68); return; }
  rgb(c, 0.42, 0.48, 0.52);
  if ((la + lt) % 6 === 0 || (la + lt) % 6 === 1) rgb(c, 0.62, 0.68, 0.72);
};
// l'échelle des lettres
PEINTRES.optotype = (o, c, la, lt, W2, H2) => {
  rgb(c, 0.90, 0.89, 0.84);
  if (la === 0 || la === W2 - 1 || lt === 0 || lt === H2 - 1) { rgb(c, 0.70, 0.70, 0.66); return; }
  const rangs = [[2, 3, 1], [6, 2, 2], [9, 1, 3], [11, 1, 4], [13, 1, 5]];
  for (const [y, hh, n] of rangs) {
    if (lt >= y && lt < y + hh) {
      const pas = (W2 - 2) / n, i = Math.floor((la - 1) / pas), x = la - 1 - i * pas;
      if (x >= pas * 0.2 && x < pas * 0.2 + Math.max(1, pas * 0.55) && hash(i, y, 942, 0) < 0.9) rgb(c, 0.08, 0.08, 0.08);
    }
  }
};
// les diplômes encadrés
PEINTRES.diplome = (o, c, la, lt, W2, H2) => {
  if (la === 0 || lt === 0 || la === W2 - 1 || lt === H2 - 1) { rgb(c, 0.20, 0.14, 0.08); return; }
  rgb(c, 0.86, 0.82, 0.70);
  if (lt === 1 && la > 1 && la < W2 - 2) rgb(c, 0.30, 0.28, 0.26);
  if ((lt === 3 || lt === 4) && la > 0 && la < W2 - 1 && la % 2) rgb(c, 0.52, 0.50, 0.46);
  if (lt >= H2 - 3 && lt < H2 - 1 && la >= W2 - 4 && la < W2 - 2) rgb(c, 0.66, 0.14, 0.12);         // le sceau
};

// ─── quelques meubles
// une chaise de salle d'attente : tube et coque
function chaiseAttente(K, x, y) {
  const { M } = K;
  K.voxel(x, y, 0, M.METAL); K.voxel(x + 1, y + 1, 0, M.METAL); K.voxel(x, y + 1, 0, M.METAL); K.voxel(x + 1, y, 0, M.METAL);
  K.boite(x, y, 1, x + 2, y + 2, 2, M.CAR_BLUE); K.boite(x, y, 2, x + 1, y + 2, 5, M.CAR_BLUE);
}
// une plante verte : un pot, des feuilles en touffe
function plante(K, x, y, h = 7) {
  const { M } = K;
  K.boite(x, y, 0, x + 2, y + 2, 2, M.PLASTIC_WHITE);
  for (let z = 2; z < h; z++) for (let j = -2; j < 4; j++) for (let i = -2; i < 4; i++) {
    if (x + i < 0 || y + j < 0 || x + i >= K.SX || y + j >= K.SY) continue;
    const d = Math.hypot(i - 0.5, j - 0.5, (z - h + 2.5) * 0.9);
    if (d < 2.4 && hash(x + i, y + j, z, 943) < 0.8 - d * 0.2) K.voxel(x + i, y + j, z, M.HEDGE);
  }
}

module.exports = {
  cle: 'cabinet', nom: 'Le cabinet du Doc', ambiance: 'soin',
  sx: 40, sy: 32, sol: 'I_LINO',
  murs: { bas: 'I_MUR_VERT', haut: 'I_MUR_BLANC', coupe: 6, plinthe: 'METAL' },
  porte: { cote: 'y', de: 24, a: 31 },
  build(K) {
    const { M } = K;
    // ── au fond, le bureau du Doc : la lampe, le stéthoscope, le tensiomètre, le carnet d'ordonnances
    K.bureau(5, 5, 9, 4, { mat: M.WOOD, papiers: false });
    K.boite(6, 6, 4, 8, 8, 5, M.PAPER); K.boite(10, 7, 4, 12, 8, 5, M.METAL_DARK); K.voxel(11, 6, 4, M.WHITE);
    for (const [x, y] of [[9, 6], [9, 7], [8, 8]]) K.voxel(x, y, 4, M.METAL_DARK);   // le stéthoscope
    K.voxel(12, 5, 4, M.GOLD); K.voxel(12, 5, 5, M.GOLD); K.voxel(12, 5, 6, M.BLOTTER); K.voxel(13, 5, 6, M.BLOTTER);
    K.lampe(13, 6, 5.6, { cache: true, r: 30, c: [1.25, 0.95, 0.55] });
    K.boite(8, 2, 0, 10, 4, 2, M.LEATHER); K.boite(8, 2, 2, 10, 3, 6, M.LEATHER);
    K.chaise(8, 11, { dos: 'y+', mat: M.WOOD });
    K.objet('bureau_doc', 'Le bureau du Doc', 9, 7, 4, { acces: [12, 13] });
    K.place('doc', 9, 3, { pose: 'assis', regarde: 'gauche', pour: 'sabatier' });
    // le store de la fenêtre, derrière le Doc ; les diplômes
    K.fenetreY(5, 8, 8, 6, {});
    peint(K, 'store', LEFT, 5, 8, 8, 6, { en: 0, mat: M.PLASTIC_WHITE, jour: K.jour });
    peint(K, 'diplome', RIGHT, 12, 12, 3, 2, { en: 0, mat: M.WOOD_DARK });
    peint(K, 'diplome', RIGHT, 16, 12, 3, 2, { en: 0, mat: M.WOOD_DARK });

    // ── le négatoscope, allumé sur deux radios
    peint(K, 'radios', LEFT, 14, 6, 10, 7, { en: 0, mat: M.WHITE, jour: K.jour });
    K.lampe(19, 2.5, 9.5, { cache: true, r: 24, c: [0.55, 0.62, 0.72], toujours: true, ombre: false });
    K.objet('radios', 'Les radios au négatoscope', 19, 1, 10, { acces: [19, 9] });
    K.place('medecin', 21, 9, { regarde: 'droite', pour: 'ober' });

    // ── la table d'examen, son drap de papier, son paravent ; la toise ; l'échelle des lettres
    K.boite(25, 1, 0, 26, 9, 9, M.METAL); for (let y = 1; y < 9; y += 3) K.boite(25, y, 1, 26, y + 2, 8, M.WHITE);   // le paravent
    for (const [x, y] of [[27, 1], [35, 1], [27, 4], [35, 4]]) K.boite(x, y, 0, x + 1, y + 1, 3, M.METAL);
    K.boite(27, 1, 3, 36, 5, 4, M.I_SKAI); K.boite(29, 1, 4, 36, 5, 5, M.PAPER); K.boite(27, 1, 4, 29, 5, 5, M.WHITE);
    K.boite(28, 1, 2, 35, 5, 3, M.METAL); K.voxel(31, 5, 2, M.GOLD);                   // le tiroir, sa poignée
    K.boite(30, 5, 0, 33, 7, 1, M.METAL_DARK);                                         // le marchepied
    K.objet('table_examen', 'La table d\'examen', 31, 3, 4, { acces: [30, 9] });
    K.boite(37, 5, 0, 38, 6, 9, M.METAL); K.voxel(36, 5, 9, M.METAL); K.voxel(36, 5, 8, M.METAL_DARK);   // la lampe d'examen
    K.lampe(36.5, 5.5, 8, { cache: true, r: 24, c: [1.15, 1.1, 1.0] });
    K.place('kine', 34, 9, { regarde: 'gauche', pour: 'rouvier' });
    peint(K, 'optotype', LEFT, 36, 6, 3, 7, { en: 0, mat: M.WHITE });
    K.boite(37, 9, 0, 39, 11, 1, M.METAL); K.boite(38, 9, 1, 39, 10, 11, M.METAL);    // la toise
    K.boite(37, 9, 10, 38, 10, 11, M.METAL); K.voxel(38, 9, 6, M.WHITE);

    // ── l'armoire vitrée, fermée à clé
    K.boite(0, 1, 0, 3, 9, 12, M.ENAMEL);
    peint(K, 'armoire', RIGHT, 1, 0, 8, 12, { en: 2, mat: M.ENAMEL });
    K.voxel(3, 5, 6, M.GOLD); K.voxel(3, 5, 5, M.METAL_DARK);                          // le cadenas
    K.objet('armoire', 'L\'armoire fermée à clé', 2, 5, 6, { acces: [4, 11] });

    // ── le lavabo, le miroir, la serviette
    K.boite(0, 12, 0, 1, 15, 4, M.ENAMEL); K.boite(0, 11, 4, 2, 16, 5, M.ENAMEL); K.voxel(0, 13, 5, M.METAL);
    peint(K, 'miroir', RIGHT, 12, 7, 3, 4, { en: 0, mat: M.GLASS }); K.boite(0, 16, 3, 1, 17, 6, M.TOWEL);

    // ── la salle d'attente : trois chaises, la table basse et ses revues, le coffre à jouets
    K.tapis(1, 18, 12, 30);
    for (const y of [19, 22, 25]) chaiseAttente(K, 1, y);
    K.boite(5, 20, 0, 8, 26, 2, M.WOOD); K.boite(5, 21, 2, 7, 23, 3, M.POSTER); K.voxel(6, 24, 2, M.PAPER);
    K.boite(1, 28, 0, 5, 31, 3, M.PLASTIC_RED); K.boite(1, 28, 3, 5, 31, 4, M.AWNING_GREEN);
    K.boite(5, 29, 0, 6, 31, 3, M.BOARD);                                             // l'ardoise, posée contre
    K.objet('attente', 'La salle d\'attente', 2, 23, 3, { acces: [10, 23] });
    K.place('attente_1', 2, 20, { pose: 'assis', regarde: 'droite' });
    K.place('attente_2', 2, 26, { pose: 'assis', regarde: 'droite', pour: 'visiteur' });
    K.place('patient', 9, 12, { pose: 'assis', regarde: 'droite' });                // la chaise devant le bureau du Doc
    plante(K, 9, 29, 7);
    K.afficheX(18, 8, 11, 5, { title: 'SANTÉ', bg: [0.84, 0.86, 0.80], fg: [0.16, 0.36, 0.30], band: [0.16, 0.36, 0.30], seed: 61 });

    // ── la lumière : le plafonnier blanc, la lampe du Doc, le jour par le store
    K.plafonnier(20, 15, { c: [1.0, 1.0, 0.92], r: 60 });
    if (K.jour) K.lampe(9, 2, 11, { cache: true, toujours: true, r: 30, c: [0.40, 0.45, 0.52], ombre: false });
  },
};
