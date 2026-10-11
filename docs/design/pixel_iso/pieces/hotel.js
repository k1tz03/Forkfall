'use strict';
// L'hôtel de la Rive : le hall qui sent la cire. Derrière le comptoir de la réception, le
// tableau des clés et ses vingt-six crochets (il en manque un) ; le registre ouvert, la
// sonnette ; à côté, derrière sa vitre, le standard où Sandrine enfiche les appels dans son
// fauteuil ; l'escalier des chambres qui monte le long du mur ; le salon et ses fauteuils
// club ; la cabine téléphonique dans le coin ; des valises qui attendent.
const E = require('../engine');
const { LEFT, RIGHT, hash } = E;

// ─── la peinture : des images posées sur une face, au texel près (2 par voxel)
const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const lum = (c, r, g, b) => { c.er = r; c.eg = g; c.eb = b; };
const PEINTRES = {};
E.overlay('hotel_pinceau', (o, c) => {
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
  const id = W.obj(Object.assign({ type: 'hotel_pinceau', kind, face, s0, z0, w, h }, o));
  for (let z = z0; z < z0 + h; z++) for (let s = s0; s < s0 + w; s++) {
    const [x, y] = face === LEFT ? [s, en] : [en, s];
    if (o.mat) W.set(x, y, z, o.mat, id); else if (W.inb(x, y, z)) W.tag[W.idx(x, y, z)] = id;
  }
  return id;
}

// le tableau des clés : trois rangs de crochets de laiton (vingt-six), les clés et leurs plaques ; la 12 manque
PEINTRES.cles = (o, c, la, lt, W2, H2) => {
  if (la === 0 || lt === 0 || la === W2 - 1 || lt === H2 - 1) { rgb(c, 0.20, 0.12, 0.07); return; }
  rgb(c, 0.34, 0.21, 0.12);
  if ((la + lt * 3) % 7 === 0) rgb(c, 0.30, 0.18, 0.10);
  const col = Math.floor((la - 1) / 3), x = (la - 1) % 3, rang = Math.floor((lt - 1) / 4), y = (lt - 1) % 4;
  if (col >= 9 || rang >= 3 || x !== 1) return;
  const n = rang * 9 + col + 1;
  if (n > 26) return;
  if (y === 0) { rgb(c, 0.86, 0.70, 0.28); return; }                                   // le crochet
  if (n === 12) return;                                                               // la 12 : le crochet est vide
  if (y === 1) rgb(c, 0.66, 0.66, 0.62);                                              // la clé
  if (y === 2) rgb(c, 0.80, 0.62, 0.22);                                              // la plaque de laiton
};
// le standard : les jacks, les petites lampes, les cordons qui pendent
PEINTRES.standard = (o, c, la, lt, W2, H2) => {
  if (la === 0 || lt === 0 || la === W2 - 1 || lt === H2 - 1) { rgb(c, 0.24, 0.15, 0.09); return; }
  rgb(c, 0.16, 0.14, 0.12);
  const y = (lt - 1) % 4, i = Math.floor((lt - 1) / 4), x = la - 1;
  if (i < 3 && x % 2 === 0) {
    if (y === 0) { const h = hash(x, i, 961, 0); if (h < 0.18) { rgb(c, 0.9, 0.7, 0.3); lum(c, 0.9, 0.55, 0.12); } else if (h < 0.26) { rgb(c, 0.4, 0.9, 0.4); lum(c, 0.2, 0.7, 0.2); } else rgb(c, 0.30, 0.28, 0.24); return; }
    if (y === 1) { rgb(c, 0.05, 0.05, 0.05); return; }                                 // le jack
  }
  // les cordons
  for (const [cx, cl] of [[3, [0.62, 0.12, 0.10]], [8, [0.10, 0.10, 0.10]], [13, [0.62, 0.12, 0.10]]]) if (Math.abs(x - cx - (lt - 2) * 0.15) < 0.5 && lt > 2) { rgb(c, cl[0], cl[1], cl[2]); return; }
};
// la cabine téléphonique : la porte vitrée, l'écriteau, la lumière dedans
PEINTRES.cabine = (o, c, la, lt, W2, H2) => {
  if (la <= 1 || la >= W2 - 2 || lt <= 1 || lt === H2 - 1) { rgb(c, 0.22, 0.13, 0.08); return; }
  if (lt <= 4) { rgb(c, 0.86, 0.80, 0.62); if (lt >= 2 && lt <= 3 && la > 3 && la < W2 - 4 && la % 2) rgb(c, 0.20, 0.14, 0.10); lum(c, 0.25, 0.22, 0.14); return; }
  rgb(c, 0.30, 0.28, 0.20); lum(c, 0.36, 0.30, 0.16);
  if ((la + lt) % 6 === 0) { rgb(c, 0.52, 0.50, 0.42); lum(c, 0.48, 0.42, 0.26); }
  if (lt === Math.floor(H2 * 0.6) && la === W2 - 4) rgb(c, 0.76, 0.60, 0.22);         // la poignée
};
// une horloge de hall
PEINTRES.horloge = (o, c, la, lt, W2, H2) => {
  const cx = (W2 - 1) / 2, cy = (H2 - 1) / 2, d = Math.hypot(la - cx, lt - cy);
  if (d > W2 / 2) { rgb(c, 0.30, 0.20, 0.10); return; }
  if (d > W2 / 2 - 1.1) { rgb(c, 0.66, 0.50, 0.18); return; }
  rgb(c, 0.88, 0.85, 0.76);
  if ((la === Math.floor(cx) || la === Math.ceil(cx)) && lt <= cy && lt >= 1) rgb(c, 0.08, 0.08, 0.08);
  if (lt === Math.ceil(cy) && la <= cx && la >= cx - 2) rgb(c, 0.08, 0.08, 0.08);
};

// ─── quelques meubles
// un palmier en pot
function palmier(K, x, y) {
  const { M } = K;
  K.boite(x, y, 0, x + 3, y + 3, 3, M.TERRACOTTA); K.boite(x + 1, y + 1, 3, x + 2, y + 2, 9, M.BARK);
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) {
    for (let t = 1; t <= 3; t++) K.voxel(x + 1 + dx * t, y + 1 + dy * t, 9 - Math.floor(t * t / 3), M.HEDGE);
  }
  K.voxel(x + 1, y + 1, 9, M.HEDGE); K.voxel(x + 1, y + 1, 10, M.HEDGE);
}
// un fauteuil roulant : deux grandes roues, le siège, le dossier (on y est assis tourné vers -y)
function fauteuilRoulant(K, x, y) {
  const { M } = K;
  for (const wx of [x - 1, x + 2]) { K.boite(wx, y, 0, wx + 1, y + 3, 3, M.TIRE); K.voxel(wx, y, 0, 0); K.voxel(wx, y + 2, 0, 0); K.voxel(wx, y, 2, 0); K.voxel(wx, y + 2, 2, 0); K.voxel(wx, y + 1, 1, M.METAL); }
  K.boite(x, y, 1, x + 2, y + 2, 2, M.SEAT_GREY); K.boite(x, y + 2, 1, x + 2, y + 3, 5, M.SEAT_GREY);
  K.voxel(x, y - 1, 0, M.METAL); K.voxel(x + 1, y - 1, 0, M.METAL);
}
// une valise
function valise(K, x, y, w, d, h, m) { K.boite(x, y, 0, x + w, y + d, h, m); K.voxel(x + Math.floor(w / 2), y + Math.floor(d / 2), h, K.M.METAL_DARK); }
// une applique : un bras de laiton, une tulipe
function applique(K, s, z) { K.voxel(s, 0, z, K.M.GOLD); K.voxel(s, 0, z + 1, K.M.BULB); K.lampe(s + 0.5, 1.5, z + 1, { cache: true, r: 28, c: [1.2, 0.88, 0.5] }); }

module.exports = {
  cle: 'hotel', nom: 'L\'hôtel de la Rive', ambiance: 'salle',
  sx: 48, sy: 38, sol: 'I_PARQUET',
  murs: { bas: 'PANEL', haut: 'WALLPAPER', coupe: 7, frise: 'WOOD_DARK' },
  porte: { cote: 'x', de: 26, a: 33 },
  build(K) {
    const { M } = K;
    // ── la réception : le comptoir de chêne, la sonnette, le registre ouvert
    K.comptoir(26, 7, 45, 10, { mat: M.WOOD_DARK, dessus: M.WOOD });
    K.boite(26, 10, 0, 45, 11, 1, M.WOOD_DARK);                                      // le socle
    K.voxel(29, 8, 5, M.GOLD);                                                       // la sonnette
    K.boite(38, 8, 5, 41, 10, 6, M.PAPER); K.voxel(41, 9, 5, M.METAL_DARK);          // le registre, le stylo
    K.lampe(33, 8.5, 7, { r: 30, c: [1.2, 0.9, 0.5] }); K.voxel(33, 8, 5, M.GOLD); K.voxel(33, 8, 6, M.GOLD);
    K.objet('reception', 'La réception', 31, 9, 5, { acces: [31, 13] });
    K.objet('registre', 'Le registre', 39, 9, 6, { acces: [39, 13] });
    K.place('reception', 35, 4, { regarde: 'gauche', pour: 'escande' });
    // derrière : le tableau des clés, RÉCEPTION, l'horloge
    peint(K, 'cles', LEFT, 29, 6, 14, 7, { en: 0, mat: M.WOOD_DARK });
    K.objet('tableau_cles', 'Le tableau des clés', 36, 1, 9, { acces: [36, 13] });
    K.enseigneY(28, 17, 'RÉCEPTION', { fg: [0.86, 0.70, 0.30], plate: [0.16, 0.10, 0.06], plateMat: M.WOOD_DARK, padX: 1, padY: 1 });
    peint(K, 'horloge', LEFT, 44, 10, 3, 3, { en: 0, mat: M.WOOD_DARK });
    applique(K, 25, 10);

    // ── le standard, derrière sa vitre : le panneau des jacks, Sandrine dans son fauteuil
    K.boite(9, 8, 0, 14, 9, 4, M.PANEL); K.boite(18, 8, 0, 21, 9, 4, M.PANEL); K.boite(20, 0, 0, 21, 8, 4, M.PANEL);   // le muret, sa porte
    for (const x of [9, 13, 18]) K.boite(x, 8, 4, x + 1, 9, 11, M.WOOD_DARK);
    K.boite(20, 0, 4, 21, 1, 11, M.WOOD_DARK); K.boite(20, 4, 4, 21, 5, 11, M.WOOD_DARK);
    K.boite(9, 8, 11, 21, 9, 12, M.WOOD_DARK); K.boite(20, 0, 11, 21, 9, 12, M.WOOD_DARK);
    peint(K, 'standard', LEFT, 10, 4, 9, 7, { en: 0, mat: M.WOOD_DARK });
    K.boite(10, 1, 4, 19, 3, 5, M.WOOD);                                             // la tablette
    fauteuilRoulant(K, 14, 4);
    K.lampe(14, 3, 9, { cache: true, r: 20, c: [1.0, 0.75, 0.4] });
    K.place('standard', 15, 5, { pose: 'assis', regarde: 'droite', pour: 'sandrine' });

    // ── l'escalier des chambres, le long du mur de gauche ; la porte du premier en haut
    for (let k = 0; k < 10; k++) {
      const y1 = 24 - 2 * k, y0 = y1 - 2;
      K.boite(0, y0, 0, 5, y1, k + 1, M.WOOD_DARK);
      K.boite(1, y0, k, 4, y1, k + 1, M.I_VELOURS);                                   // le tapis d'escalier
      K.boite(5, y0 + 1, k + 1, 6, y0 + 2, k + 5, M.WOOD_DARK);                         // les balustres
    }
    K.boite(0, 0, 0, 5, 4, 10, M.WOOD_DARK); K.boite(1, 0, 9, 4, 4, 10, M.I_VELOURS);  // le palier
    for (let k = 0; k < 10; k++) K.boite(5, 22 - 2 * k, k + 5, 6, 24 - 2 * k, k + 6, M.WOOD);   // la main courante
    K.boite(5, 22, 0, 6, 24, 6, M.WOOD); K.voxel(5, 22, 6, M.GOLD);                   // le pilastre du bas, sa pomme
    K.W.box(0, -1, 10, 5, 0, 17, 0); K.boite(0, -2, 10, 5, -1, 17, M.METAL_DARK);       // la porte du couloir, en haut
    K.boite(-1, 0, 10, 0, 1, 17, M.WOOD_DARK); K.boite(5, 0, 10, 6, 1, 17, M.WOOD_DARK); K.boite(0, 0, 17, 6, 1, 18, M.WOOD_DARK);
    K.objet('escalier', 'L\'escalier des chambres', 3, 21, 2, { acces: [7, 22] });
    K.fenetreX(9, 11, 8, 6, { rideau: [0.46, 0.12, 0.16] });

    // ── les bagages qui attendent devant la réception, le chariot
    valise(K, 26, 13, 3, 2, 3, M.LEATHER); valise(K, 26, 15, 2, 2, 2, M.CANVAS);
    K.place('bagages', 23, 14, { regarde: 'droite', pour: 'client' });
    K.boite(43, 20, 0, 47, 24, 1, M.METAL_DARK);
    for (const [x, y] of [[43, 20], [43, 23], [46, 20], [46, 23]]) K.boite(x, y, 1, x + 1, y + 1, 9, M.GOLD);
    K.boite(43, 20, 9, 44, 24, 10, M.GOLD); K.boite(46, 20, 9, 47, 24, 10, M.GOLD); K.boite(43, 21, 9, 47, 22, 10, M.GOLD);
    valise(K, 44, 20, 2, 4, 2, M.CAR_BORD); valise(K, 44, 21, 2, 2, 4, M.SEAT_GREY);

    // ── le salon : les fauteuils club autour de la table basse, la lampe, le palmier
    K.tapis(8, 21, 25, 36);
    K.canape(10, 22, 6, { sens: 'y-', mat: M.LEATHER });
    K.fauteuil(19, 26, { sens: 'x+', mat: M.LEATHER });
    K.fauteuil(19, 31, { sens: 'x+', mat: M.LEATHER });
    K.fauteuil(9, 32, { sens: 'y+', mat: M.LEATHER });
    K.fauteuil(13, 32, { sens: 'y+', mat: M.LEATHER });
    K.table(11, 27, 6, 3, { h: 2, mat: M.WOOD_DARK });
    K.boite(12, 28, 2, 14, 29, 3, M.PAPER); K.voxel(15, 28, 2, M.GLASS);              // les journaux, un cendrier
    K.boite(15, 27, 2, 16, 28, 4, M.GOLD); K.boite(14, 26, 4, 17, 29, 5, M.CANVAS);    // la lampe de table
    K.lampe(15.5, 27.5, 3.6, { cache: true, r: 30, c: [1.25, 0.9, 0.5] });
    K.objet('salon', 'Le salon', 14, 28, 2, { acces: [17, 23] });
    K.place('salon_1', 12, 24, { pose: 'assis', regarde: 'gauche', pour: 'visiteur' });
    K.place('salon_2', 14, 24, { pose: 'assis', regarde: 'gauche', pour: 'visiteur' });
    K.place('nassir', 20, 27, { pose: 'assis', regarde: 'gauche', pour: 'nassir' });
    K.place('legruet', 20, 32, { pose: 'assis', regarde: 'gauche', pour: 'legruet' });
    K.place('salon_3', 10, 33, { pose: 'assis', regarde: 'droite', pour: 'client' });
    palmier(K, 22, 19);

    // ── la cabine téléphonique, dans le coin
    K.boite(0, 31, 0, 6, 37, 13, M.WOOD_DARK); K.W.box(1, 32, 0, 5, 36, 12, 0);
    peint(K, 'cabine', RIGHT, 31, 0, 6, 12, { en: 5, mat: M.BOOTH });
    K.boite(0, 31, 13, 6, 37, 14, M.WOOD_DARK);
    K.voxel(1, 34, 7, M.METAL_DARK); K.lampe(3, 34, 11, { cache: true, r: 14, c: [0.9, 0.75, 0.45] });
    K.objet('cabine', 'La cabine téléphonique', 5, 34, 6, { acces: [8, 34] });

    // ── la lumière : deux appliques, la lampe du comptoir, celle du salon, le plafond du hall
    applique(K, 7, 10);
    K.lampe(30, 22, 15, { cache: true, r: 60, c: [1.1, 0.85, 0.5] });
    if (K.jour) K.lampe(4, 13, 14, { cache: true, toujours: true, r: 30, c: [0.45, 0.50, 0.60], ombre: false });
  },
};
