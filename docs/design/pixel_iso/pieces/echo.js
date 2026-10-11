'use strict';
// La rédaction de L'Écho d'Aubérive : le titre en haut du mur, les épreuves du lendemain
// punaisées au liège au-dessus du marbre, le téléscripteur qui crache son papier jusqu'au sol ;
// au milieu, la machine à écrire de Léa et l'écran du pigiste sous leurs lampes vertes ; au fond,
// le bureau de Massenet et son tiroir fermé à clé ; à gauche, les archives reliées, année par
// année, avec un trou.
const E = require('../engine');
const { LEFT, RIGHT, hash } = E;

// ─── la peinture : des images posées sur une face, au texel près (2 par voxel)
const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const PEINTRES = {};
E.overlay('echo_pinceau', (o, c) => {
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
  const id = W.obj(Object.assign({ type: 'echo_pinceau', kind, face, s0, z0, w, h }, o));
  for (let z = z0; z < z0 + h; z++) for (let s = s0; s < s0 + w; s++) {
    const [x, y] = face === LEFT ? [s, en] : [en, s];
    if (o.mat) W.set(x, y, z, o.mat, id); else if (W.inb(x, y, z)) W.tag[W.idx(x, y, z)] = id;
  }
  return id;
}

// une page de journal : le titre, la manchette, la photo, les colonnes, parfois le crayon rouge
function page(c, la, lt, w, h, seed, rouge) {
  rgb(c, 0.86, 0.84, 0.76);
  if (lt === 1 && la > 0 && la < w - 1) { rgb(c, 0.12, 0.12, 0.12); return; }                 // le titre du journal
  if (lt === 2) { rgb(c, 0.55, 0.12, 0.14); return; }                                          // le filet
  if (lt === 4 && la > 0 && la < w - 1 - (seed % 3)) { rgb(c, 0.10, 0.10, 0.10); return; }    // la manchette
  const px = seed % 2 ? 1 : w - 5, py = 6;
  if (la >= px && la < px + 4 && lt >= py && lt < py + 3) { rgb(c, 0.36, 0.36, 0.34); if ((la + lt) % 2) rgb(c, 0.46, 0.46, 0.44); return; } // la photo
  if (lt >= 6 && lt < h - 1 && la > 0 && la < w - 1 && lt % 2 === 0 && hash(la, lt, seed, 931) < 0.85) rgb(c, 0.48, 0.48, 0.46);
  if (rouge && Math.abs(la - (w - 3)) + Math.abs(lt - 9) === 2) rgb(c, 0.80, 0.12, 0.10);       // la correction, entourée
}
// les épreuves du lendemain, punaisées au liège
PEINTRES.epreuves = (o, c, la, lt, W2, H2) => {
  if (la === 0 || lt === 0 || la === W2 - 1 || lt === H2 - 1) { rgb(c, 0.30, 0.20, 0.12); return; }
  rgb(c, 0.58, 0.44, 0.28);
  if (hash(la, lt, 932, 0) < 0.12) rgb(c, 0.50, 0.37, 0.22);
  const pw = 9, ph = 12, gap = 2, i = Math.floor((la - 2) / (pw + gap)), x = (la - 2) % (pw + gap), y = lt - 1 - (i % 2);
  if (i >= 0 && x >= 0 && x < pw && y >= 0 && y < ph && 2 + i * (pw + gap) + pw <= W2 - 1) {
    if (x === 1 && y === 0) { rgb(c, 0.75, 0.15, 0.12); return; }                              // la punaise
    page(c, x, y, pw, ph, i * 7 + 3, i === 2 || i === 4);
  }
};
// une Une encadrée : le premier numéro, au-dessus du bureau du rédacteur
PEINTRES.une = (o, c, la, lt, W2, H2) => {
  if (la === 0 || lt === 0 || la === W2 - 1 || lt === H2 - 1) { rgb(c, 0.12, 0.09, 0.06); return; }
  page(c, la - 1, lt - 1, W2 - 2, H2 - 2, 4, false);
};
// les archives : un volume relié par an, le dos sombre et l'année en clair, et un trou
PEINTRES.volumes = (o, c, la, lt, W2, H2) => {
  const n = Math.floor(la / 3), y = lt % 4, k = hash(n, o.z0, 933, 0);
  if (o.trou != null && n === o.trou) { rgb(c, 0.04, 0.03, 0.03); return; }                    // celui qu'on a pris
  const P = [[0.30, 0.24, 0.18], [0.38, 0.20, 0.13], [0.22, 0.27, 0.34], [0.42, 0.15, 0.15], [0.24, 0.30, 0.22]];
  const p = P[Math.floor(k * P.length)];
  rgb(c, p[0], p[1], p[2]);
  if (la % 3 === 2) { rgb(c, p[0] * 0.5, p[1] * 0.5, p[2] * 0.5); return; }
  if (y === 1) rgb(c, 0.86, 0.76, 0.50);                                                        // l'année, dorée au fer
  if (y === 3 && la % 3 === 0) rgb(c, 0.52, 0.42, 0.22);
};
// une horloge de bureau
PEINTRES.horloge = (o, c, la, lt, W2, H2) => {
  const cx = (W2 - 1) / 2, cy = (H2 - 1) / 2, d = Math.hypot(la - cx, lt - cy);
  if (d > W2 / 2 - 1.1) { rgb(c, 0.14, 0.14, 0.15); return; }
  rgb(c, 0.86, 0.84, 0.76);
  if ((la === Math.floor(cx) || la === Math.ceil(cx)) && lt <= cy && lt >= 1) rgb(c, 0.08, 0.08, 0.08);
  if (lt === Math.ceil(cy) && la <= cx && la >= cx - 2) rgb(c, 0.08, 0.08, 0.08);
};

// ─── quelques meubles
// une lampe de bureau à abat-jour vert (la lampe de banquier)
function lampeVerte(K, x, y, z = 4) {
  const { M } = K;
  K.voxel(x, y, z, M.GOLD); K.voxel(x, y, z + 1, M.GOLD); K.voxel(x, y, z + 2, M.BLOTTER); K.voxel(x + 1, y, z + 2, M.BLOTTER);
  K.lampe(x + 1, y + 1, z + 1.6, { cache: true, r: 26, c: [1.25, 0.95, 0.5] });
}
// une machine à écrire, une feuille engagée
function machine(K, x, y, z = 4) {
  const { M } = K;
  K.boite(x, y, z, x + 3, y + 2, z + 1, M.METAL_DARK); K.boite(x, y + 1, z + 1, x + 3, y + 2, z + 2, M.METAL_DARK);
  K.voxel(x + 1, y + 1, z + 2, M.PAPER);
}
// un portemanteau, un imperméable, un chapeau
function portemanteau(K, x, y) {
  const { M } = K;
  K.boite(x, y, 0, x + 1, y + 1, 9, M.WOOD_DARK); K.boite(x - 1, y, 4, x, y + 1, 8, M.CANVAS); K.voxel(x, y, 9, M.METAL_DARK);
}
// une pile de journaux ficelés
function liasse(K, x, y, h) { const { M } = K; K.boite(x, y, 0, x + 3, y + 2, h, M.PAPER); for (let z = 1; z < h; z += 2) K.boite(x, y, z, x + 3, y + 2, z + 1, M.CANVAS); }
// une chaise de bureau à roulettes
function chaiseBureau(K, x, y, dos) {
  const { M } = K;
  K.voxel(x, y, 0, M.METAL_DARK); K.voxel(x + 1, y + 1, 0, M.METAL_DARK);
  K.boite(x, y, 1, x + 2, y + 2, 2, M.I_SKAI);
  if (dos === 'y-') K.boite(x, y, 2, x + 2, y + 1, 5, M.I_SKAI); else K.boite(x, y + 1, 2, x + 2, y + 2, 5, M.I_SKAI);
}

module.exports = {
  cle: 'echo', nom: 'La rédaction de L\'Écho', ambiance: 'presse',
  sx: 44, sy: 34, sol: 'I_PARQUET',
  murs: { bas: 'PANEL', haut: 'I_MUR_OCRE', coupe: 7 },
  porte: { cote: 'y', de: 26, a: 33 },
  build(K) {
    const { M } = K;
    // ── le titre du journal, en haut du mur
    K.enseigneY(7, 17, 'L\'ÉCHO D\'AUBÉRIVE', { fg: [0.88, 0.84, 0.72], plate: [0.38, 0.09, 0.12], plateMat: M.WOOD_DARK, padX: 1, padY: 1 });

    // ── au fond, le bureau de Massenet : la lampe verte, le cendrier, le tiroir fermé à clé
    K.bureau(3, 5, 9, 4, { mat: M.WOOD_DARK, papiers: false });
    K.boite(4, 6, 4, 6, 8, 6, M.PAPER); K.boite(9, 6, 4, 11, 7, 5, M.PAPER); K.voxel(7, 8, 4, M.METAL);
    K.telephone(8, 5, 4); lampeVerte(K, 4, 5, 4);
    K.voxel(8, 8, 2, M.GOLD);                                                   // la serrure du tiroir
    chaiseBureau(K, 6, 2, 'y-'); K.chaise(6, 11, { dos: 'y+' });
    K.objet('bureau_redacteur', 'Le bureau du rédacteur', 7, 7, 4, { acces: [10, 14] });
    K.place('redacteur', 7, 3, { pose: 'assis', regarde: 'gauche', pour: 'meneche' });
    K.place('visiteur', 7, 12, { pose: 'assis', regarde: 'droite', pour: 'visiteur' });
    peint(K, 'une', LEFT, 3, 7, 5, 6, { en: 0, mat: M.WOOD_DARK });
    peint(K, 'horloge', LEFT, 9, 10, 2, 2, { en: 0, mat: M.METAL_DARK });
    K.fenetreX(3, 7, 7, 7, { rideau: [0.55, 0.50, 0.38] });
    K.boite(0, 12, 0, 3, 15, 8, M.METAL);                                         // le classeur à tiroirs
    for (let z = 2; z < 8; z += 2) K.boite(2, 13, z, 3, 14, z + 1, M.METAL_DARK);

    // ── le marbre et les épreuves du lendemain, punaisées au liège
    K.table(15, 1, 20, 4, { mat: M.WOOD, pied: M.WOOD_DARK });
    for (const [x, w] of [[16, 3], [20, 4], [26, 3], [31, 3]]) K.boite(x, 2, 4, x + w, 4, 5, M.PAPER);
    K.voxel(24, 3, 4, M.PLASTIC_RED);                                             // le crayon rouge
    peint(K, 'epreuves', LEFT, 14, 6, 23, 7, { en: 0, mat: M.WOOD_DARK });
    K.objet('epreuves', 'Les épreuves du lendemain', 25, 1, 9, { acces: [25, 8] });
    lampeVerte(K, 15, 1, 4);

    // ── le téléscripteur : le papier qui coule jusqu'au sol
    K.boite(38, 1, 0, 42, 4, 5, M.PLASTIC_WHITE); K.boite(38, 1, 5, 42, 3, 6, M.METAL);
    K.boite(39, 3, 5, 41, 4, 7, M.PAPER); K.boite(39, 4, 1, 41, 5, 6, M.PAPER); K.boite(39, 4, -1, 41, 9, 0, M.PAPER); K.boite(38, 8, -1, 40, 11, 0, M.PAPER);
    K.voxel(41, 2, 5, M.LIT_PANEL);

    // ── au milieu : le bureau de Léa (la machine à écrire), celui du pigiste (l'écran)
    K.bureau(16, 13, 8, 4, { mat: M.WOOD, papiers: false });
    machine(K, 19, 14); K.boite(17, 15, 4, 19, 17, 5, M.PAPER); lampeVerte(K, 22, 13);
    K.voxel(17, 13, 4, M.WHITE);                                                  // la tasse
    chaiseBureau(K, 19, 10, 'y-');
    K.objet('machine', 'La machine à écrire', 20, 15, 5, { acces: [20, 19] });
    K.place('journaliste', 20, 11, { pose: 'assis', regarde: 'gauche', pour: 'lea' });
    K.bureau(27, 13, 8, 4, { mat: M.WOOD, papiers: false });
    K.boite(29, 14, 4, 32, 16, 7, M.PLASTIC_WHITE); K.boite(29, 16, 4, 32, 17, 6, M.PLASTIC_WHITE);
    K.boite(29, 13, 4, 32, 14, 5, M.PLASTIC_WHITE); K.boite(33, 14, 4, 35, 16, 5, M.PAPER);
    lampeVerte(K, 33, 13);
    chaiseBureau(K, 30, 10, 'y-');
    K.place('pigiste', 31, 11, { pose: 'assis', regarde: 'gauche', pour: 'client' });

    // ── le téléphone de la rédaction, sur sa console, avec le carnet
    K.boite(37, 13, 0, 42, 16, 5, M.WOOD_DARK); K.boite(37, 13, 5, 42, 16, 6, M.WOOD);
    K.telephone(38, 14, 6); K.boite(40, 14, 6, 42, 16, 7, M.PAPER);
    K.objet('telephone', 'Le téléphone de la rédaction', 39, 14, 7, { acces: [40, 19] });
    K.place('rossard', 36, 19, { regarde: 'gauche', pour: 'rossard' });

    // ── les archives, année après année : il en manque une
    for (let z = 0; z < 13; z += 3) K.boite(0, 17, z, 3, 33, z + 1, M.WOOD_DARK);
    K.boite(0, 17, 0, 3, 18, 13, M.WOOD_DARK); K.boite(0, 32, 0, 3, 33, 13, M.WOOD_DARK);
    for (let z = 1; z < 12; z += 3) peint(K, 'volumes', RIGHT, 18, z, 14, 2, { en: 1, mat: M.WOOD_DARK, trou: z === 7 ? 4 : null });
    for (let z = 1; z < 12; z += 3) K.boite(0, 18, z, 1, 32, z + 2, M.WOOD_DARK);
    K.enseigneX(17, 17, 'ARCHIVES', { fg: [0.86, 0.80, 0.64], plate: [0.20, 0.14, 0.10], plateMat: M.WOOD_DARK, padX: 1, padY: 0 });
    K.objet('archives', 'Les archives', 2, 25, 6, { acces: [5, 25] });
    K.voxel(2, 24, 13, K.M.METAL_DARK); K.lampe(2.5, 24.5, 14.2, { r: 30, c: [1.2, 0.9, 0.55] });   // la lampe des archives
    K.place('archives', 5, 23, { regarde: 'droite' });

    // ── près de la porte : les liasses du jour, le portemanteau, la corbeille
    liasse(K, 38, 26, 4); liasse(K, 38, 23, 3); liasse(K, 34, 29, 2);
    portemanteau(K, 23, 31);
    K.boite(12, 18, 0, 14, 20, 3, M.METAL_DARK); K.voxel(12, 18, 3, M.PAPER); K.voxel(13, 19, 3, M.PAPER);

    // ── la lumière : le néon du marbre, les lampes vertes, une ampoule nue au-dessus de la porte
    K.plafonnier(28, 25, { c: [1.1, 0.9, 0.6], r: 50 });
    if (K.jour) K.lampe(4, 6, 12, { cache: true, toujours: true, r: 32, c: [0.45, 0.50, 0.60], ombre: false });
  },
};
