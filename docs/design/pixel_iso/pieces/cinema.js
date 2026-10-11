'use strict';
// Le cinéma L'Aurore : le hall rouge et or, la moquette ; la caisse vitrée et son enseigne à
// ampoules, la caissière sur sa chaise ; au milieu du mur du fond, les portes capitonnées de
// la salle et leurs hublots, le cordon de velours ; la confiserie et le bac à glaces ; au mur
// de gauche, les affiches de la semaine (des films qui n'existent pas), encadrées d'ampoules.
const E = require('../engine');
const { Facade } = require('../build');
const { LEFT, RIGHT, hash, textBitmap } = E;

// ─── la peinture : des images posées sur une face, au texel près (2 par voxel)
const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const lum = (c, r, g, b) => { c.er = r; c.eg = g; c.eb = b; };
const PEINTRES = {};
E.overlay('cinema_pinceau', (o, c) => {
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
  const id = W.obj(Object.assign({ type: 'cinema_pinceau', kind, face, s0, z0, w, h }, o));
  for (let z = z0; z < z0 + h; z++) for (let s = s0; s < s0 + w; s++) {
    const [x, y] = face === LEFT ? [s, en] : [en, s];
    if (o.mat) W.set(x, y, z, o.mat, id); else if (W.inb(x, y, z)) W.tag[W.idx(x, y, z)] = id;
  }
  return id;
}

// les affiches : quatre films inventés, une image, un bandeau de titre illisible, le générique
PEINTRES.affiche = (o, c, la, lt, W2, H2) => {
  if (la === 0 || lt === 0 || la === W2 - 1 || lt === H2 - 1) { rgb(c, 0.64, 0.50, 0.18); return; }   // le cadre doré
  const x = la - 1, y = lt - 1, w = W2 - 2, h = H2 - 2, f = o.film, pale = o.pale ? 0.55 : 1;
  const P = (r, g, b) => rgb(c, (r * pale + 0.7 * (1 - pale)), (g * pale + 0.66 * (1 - pale)), (b * pale + 0.58 * (1 - pale)));
  // le générique, en bas ; le titre, au-dessus
  if (y >= h - 3) { P(0.10, 0.09, 0.10); if (y === h - 2 && x % 2 === 1 && x > 0 && x < w - 1) P(0.62, 0.60, 0.56); return; }
  if (y >= h - 6) { P(0.12, 0.10, 0.10); if (y >= h - 5 && y <= h - 4 && x > 1 && x < w - 2 && hash(x, f, 1001, 0) < 0.8) P(f === 1 ? 0.92 : 0.94, f === 1 ? 0.30 : 0.82, f === 1 ? 0.40 : 0.36); return; }
  const cx = (w - 1) / 2;
  if (f === 0) {          // le polar : un homme au chapeau sous un réverbère
    P(0.10, 0.14, 0.26);
    if (Math.hypot(x - cx - 2.5, y - 2) < 2.5) P(0.92, 0.80, 0.40);
    if (Math.abs(x - cx + 0.5) < 2.2 && y >= 6 && y < h - 6) P(0.04, 0.04, 0.05);
    if (Math.abs(x - cx + 0.5) < 3 && y === 5) P(0.04, 0.04, 0.05);
    if (Math.abs(x - cx + 0.5) < 1.3 && y >= 3 && y < 5) P(0.04, 0.04, 0.05);
  } else if (f === 1) {   // le mélodrame : deux visages qui se touchent, sur du rouge
    P(0.62, 0.12, 0.18);
    for (const dx of [-2.2, 2.2]) if (Math.hypot((x - cx - dx) / 2.0, (y - h * 0.38) / 2.8) < 1) P(0.90, 0.72, 0.62);
    if (y > h * 0.6 && Math.abs(x - cx) < 4) P(0.40, 0.06, 0.10);
  } else if (f === 2) {   // l'aventure : un cavalier au couchant
    P(0.90, 0.48, 0.18); if (y < 4) P(0.94, 0.72, 0.32);
    if (Math.hypot(x - cx, y - 6) < 3) P(0.98, 0.86, 0.50);
    if (y >= h - 9) P(0.30, 0.16, 0.08);
    if (y >= h - 11 && y < h - 8 && Math.abs(x - cx) < 2.5) P(0.10, 0.06, 0.04);
  } else {                // le film d'étoiles : une planète, des points blancs
    P(0.04, 0.05, 0.12);
    if (hash(x, y, 1002, f) < 0.10) P(0.92, 0.92, 0.86);
    if (Math.hypot(x - cx + 1, y - h * 0.4) < 3.4) P(0.30, 0.52, 0.80);
    if (Math.abs(y - h * 0.4 - (x - cx) * 0.3) < 0.6 && Math.abs(x - cx) < 5.5) P(0.86, 0.76, 0.52);
  }
};
// les portes de la salle : le cuir capitonné, les boutons en losanges, les hublots, la barre
PEINTRES.portes = (o, c, la, lt, W2, H2) => {
  const mid = W2 / 2;
  if (la === 0 || la === W2 - 1 || lt === 0 || la === mid - 1 || la === mid) { rgb(c, 0.66, 0.50, 0.18); return; }
  rgb(c, 0.46, 0.08, 0.12);
  if ((la + lt) % 4 === 0 || (la - lt + 400) % 4 === 0) rgb(c, 0.36, 0.06, 0.09);                 // le capiton
  if ((la + lt) % 4 === 0 && (la - lt + 400) % 4 === 0) rgb(c, 0.78, 0.62, 0.24);                  // les boutons
  for (const hx of [mid / 2, mid + mid / 2 - 1]) {
    const d = Math.hypot(la - hx, lt - 6);
    if (d < 2.6) { rgb(c, d < 1.7 ? 0.20 : 0.70, d < 1.7 ? 0.16 : 0.54, d < 1.7 ? 0.22 : 0.20); if (d < 1.7) lum(c, 0.20, 0.10, 0.25); }   // le hublot, la salle obscure derrière
  }
  if (lt === Math.floor(H2 * 0.55) && Math.abs(la - mid + 0.5) < 4) rgb(c, 0.80, 0.64, 0.26);      // les barres de poussée
};
// la confiserie : la vitrine, les bonbons en vrac, les boîtes
PEINTRES.bonbons = (o, c, la, lt, W2, H2) => {
  if (la === 0 || la === W2 - 1 || lt === 0 || lt === H2 - 1) { rgb(c, 0.66, 0.50, 0.18); return; }
  rgb(c, 0.20, 0.16, 0.18);
  const h = hash(la, lt, 1003, 0);
  const P = [[0.92, 0.30, 0.42], [0.96, 0.82, 0.24], [0.30, 0.72, 0.40], [0.94, 0.56, 0.20], [0.86, 0.86, 0.90], [0.42, 0.30, 0.20]];
  if (lt % 4 === 3) { rgb(c, 0.70, 0.70, 0.66); return; }                                        // les étagères de verre
  if (h < 0.8) { const p = P[Math.floor(h / 0.8 * P.length)]; rgb(c, p[0], p[1], p[2]); }
  if ((la + lt) % 7 === 0) { c.cr += 0.12; c.cg += 0.12; c.cb += 0.12; }
};
// le tableau des tarifs
const TARIFS = ['35', '28', '20'].map(t => textBitmap(t));
PEINTRES.tarifs = (o, c, la, lt, W2, H2) => {
  if (la === 0 || lt === 0 || la === W2 - 1 || lt === H2 - 1) { rgb(c, 0.66, 0.50, 0.18); return; }
  rgb(c, 0.08, 0.06, 0.06);
  const i = Math.floor((lt - 1) / 6), y = (lt - 1) % 6;
  if (i < 3) {
    if (la >= 2 && la < W2 - 9 && y >= 2 && y <= 3) { rgb(c, 0.62, 0.58, 0.52); return; }
    if (TARIFS[i].at(la - (W2 - 8), y)) { rgb(c, 0.96, 0.84, 0.50); lum(c, 0.30, 0.22, 0.08); }
  }
};

// ─── quelques meubles
// un cadre d'ampoules autour d'un rectangle (sur le mur y = 0 ou x = 0, en avant d'une couche)
function ampoules(K, face, s0, z0, w, h, pas = 2) {
  const { M } = K;
  const pose = (s, z) => (face === LEFT ? K.voxel(s, 0, z, M.BULB) : K.voxel(0, s, z, M.BULB));
  for (let s = s0; s < s0 + w; s += pas) { pose(s, z0 - 1); pose(s, z0 + h); }
  for (let z = z0 + 1; z < z0 + h; z += pas) { pose(s0 - 1, z); pose(s0 + w, z); }
}
// un poteau de laiton, pour le cordon
function poteau(K, x, y) { K.boite(x, y, 0, x + 1, y + 1, 4, K.M.GOLD); }

module.exports = {
  cle: 'cinema', nom: 'Le cinéma L\'Aurore', ambiance: 'salle', personnel: 'commercant',
  sx: 40, sy: 30, sol: 'I_TAPIS',
  murs: { bas: 'I_VELOURS', haut: 'I_MUR_BORDEAUX', coupe: 7, frise: 'GOLD' },
  porte: { cote: 'x', de: 18, a: 25 },
  build(K) {
    const { M } = K;
    // ── les portes de la salle, capitonnées, et leur enseigne à ampoules ; le cordon de velours
    K.boite(15, 0, 0, 26, 1, 12, M.WOOD_DARK);
    peint(K, 'portes', LEFT, 16, 0, 9, 11, { en: 0, mat: M.I_VELOURS });
    K.enseigneY(15, 16, 'SALLE', { fg: [1.0, 0.86, 0.50], emit: [1.0, 0.70, 0.30], plate: [0.12, 0.06, 0.06], plateMat: M.METAL_DARK, padX: 2, padY: 1 });
    for (let x = 15; x < 27; x += 2) K.voxel(x, 0, 16, M.BULB);
    for (const z of [12, 14]) { K.voxel(14, 0, z, M.BULB); K.voxel(27, 0, z, M.BULB); }
    for (const x of [16, 24]) poteau(K, x, 6);
    K.boite(17, 6, 3, 24, 7, 4, M.I_VELOURS);
    K.objet('salle', 'La porte de la salle', 20, 1, 6, { acces: [20, 9] });
    K.place('visiteur', 22, 10, { regarde: 'gauche', pour: 'visiteur' });

    // ── la caisse vitrée : le comptoir, l'hygiaphone, la caissière sur son tabouret ; les tarifs
    K.boite(28, 6, 0, 37, 7, 5, M.WOOD_DARK); K.boite(28, 0, 0, 29, 7, 5, M.WOOD_DARK);
    K.boite(27, 6, 5, 37, 8, 6, M.GOLD);                                                       // la tablette de laiton
    for (const x of [28, 32, 36]) K.boite(x, 6, 6, x + 1, 7, 11, M.GOLD);
    K.boite(28, 6, 11, 37, 7, 12, M.GOLD); K.boite(28, 0, 11, 29, 7, 12, M.GOLD);
    K.boite(27, 0, 12, 38, 8, 13, M.WOOD_DARK);                                                // le toit de la caisse
    K.voxel(31, 6, 7, M.METAL); K.boite(29, 4, 5, 31, 6, 6, M.METAL_DARK); K.voxel(34, 5, 5, M.PAPER);
    K.chaise(31, 2, { dos: 'y-', mat: M.I_VELOURS });                                          // la chaise de la caissière
    // l'enseigne CAISSE, debout sur le toit de la caisse
    new Facade(K.W, LEFT, 0, 7, K.SX, 1).sign(27, 17, 'CAISSE', { fg: [1.0, 0.86, 0.50], emit: [1.0, 0.70, 0.30], plate: [0.12, 0.06, 0.06], plateMat: M.METAL_DARK, padX: 1, padY: 1, depth: 0 });
    for (let x = 27; x < 40; x += 2) K.voxel(x, 7, 17, M.BULB);
    peint(K, 'tarifs', LEFT, 29, 7, 7, 4, { en: 0, mat: M.WOOD_DARK });
    K.lampe(32, 3, 10, { cache: true, r: 24, c: [1.2, 0.95, 0.6] });
    K.objet('caisse', 'La caisse', 31, 7, 6, { acces: [31, 10] });
    K.place('caissiere', 32, 3, { pose: 'assis', regarde: 'gauche', pour: 'personnel' });
    K.place('client_1', 31, 10, { regarde: 'droite' });

    // ── la confiserie : la vitrine de bonbons, le bac à glaces, les cornets
    K.boite(3, 4, 0, 13, 7, 4, M.WOOD_DARK);
    peint(K, 'bonbons', LEFT, 3, 1, 10, 3, { en: 6, mat: M.WOOD_DARK });
    K.boite(3, 4, 4, 13, 7, 5, M.GLASS);
    K.boite(5, 5, 5, 6, 6, 7, M.GLASS); K.voxel(5, 5, 7, M.PLASTIC_RED); K.boite(9, 5, 5, 11, 6, 6, M.PAPER);   // le bocal, les cornets
    K.boite(4, 0, 0, 12, 2, 8, M.WOOD_DARK); for (let z = 2; z < 8; z += 3) peint(K, 'bonbons', LEFT, 4, z, 8, 2, { en: 1, mat: M.WOOD_DARK });
    K.boite(13, 1, 0, 15, 5, 4, M.ENAMEL); K.boite(13, 1, 4, 15, 5, 5, M.CAR_BLUE);           // le bac à glaces
    K.objet('confiserie', 'La confiserie', 8, 6, 5, { acces: [8, 10] });
    K.place('client_2', 9, 10, { regarde: 'droite' });

    // ── les affiches de la semaine, au mur de gauche, encadrées d'ampoules ; une a pâli
    for (const [y, f, pale] of [[9, 0, false], [16, 1, false], [23, 2, true]]) {
      peint(K, 'affiche', RIGHT, y, 4, 5, 9, { en: 0, mat: M.WOOD_DARK, film: f, pale });
      ampoules(K, RIGHT, y, 4, 5, 9, 2);
      K.lampe(2, y + 2.5, 9, { cache: true, r: 14, c: [1.1, 0.8, 0.45] });
    }
    peint(K, 'affiche', RIGHT, 2, 7, 4, 7, { en: 0, mat: M.WOOD_DARK, film: 3 });
    K.objet('affiches', 'Les affiches', 1, 18, 9, { acces: [5, 18] });

    // ── la banquette de velours ; le chevalet du film de la semaine prochaine, près de l'entrée
    K.canape(11, 25, 8, { sens: 'y+', mat: M.I_VELOURS });
    K.boite(31, 27, 0, 32, 28, 4, M.WOOD_DARK); K.boite(35, 27, 0, 36, 28, 4, M.WOOD_DARK); K.boite(33, 26, 0, 34, 27, 9, M.WOOD_DARK);
    peint(K, 'affiche', LEFT, 31, 4, 5, 7, { en: 27, mat: M.WOOD_DARK, film: 3 });

    // ── la lumière : les ampoules, deux appliques dorées, la chaleur du hall
    K.lampe(20, 15, 15, { cache: true, r: 50, c: [1.2, 0.85, 0.5] });
    K.lampe(9, 12, 13, { cache: true, r: 30, c: [1.1, 0.8, 0.45] });
  },
};
