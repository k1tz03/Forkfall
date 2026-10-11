'use strict';
// L'école publique : une classe. Le tableau noir et la craie (le jour, la dictée, le terrain du
// Racing dessiné pour l'exposé), l'alphabet en frise au-dessus ; l'estrade et le bureau du
// maître, le globe ; les pupitres doubles en rangs ; les grandes fenêtres, les portemanteaux et
// les cartables sous elles ; les dessins punaisés, la carte du pays ; dans un coin, le ballon
// dégonflé.
const E = require('../engine');
const { LEFT, RIGHT, hash, textBitmap } = E;

// ─── la peinture : des images posées sur une face, au texel près (2 par voxel)
const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const PEINTRES = {};
E.overlay('ecole_pinceau', (o, c) => {
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
  const id = W.obj(Object.assign({ type: 'ecole_pinceau', kind, face, s0, z0, w, h }, o));
  for (let z = z0; z < z0 + h; z++) for (let s = s0; s < s0 + w; s++) {
    const [x, y] = face === LEFT ? [s, en] : [en, s];
    if (o.mat) W.set(x, y, z, o.mat, id); else if (W.inb(x, y, z)) W.tag[W.idx(x, y, z)] = id;
  }
  return id;
}

// le tableau noir : le jour de la semaine, la dictée à la craie, et le terrain dessiné pour l'exposé
const DATE = textBitmap('LUNDI');
const CRAIE = [0.86, 0.86, 0.80];
PEINTRES.tableau = (o, c, la, lt, W2, H2) => {
  if (la === 0 || lt === 0 || la === W2 - 1 || lt === H2 - 1) { rgb(c, 0.40, 0.27, 0.14); return; }
  rgb(c, 0.10, 0.18, 0.14);
  if (hash(Math.floor(la / 3), Math.floor(lt / 2), 981, 0) < 0.12) rgb(c, 0.13, 0.21, 0.17);       // l'éponge passée
  if (DATE.at(la - 2, lt - 1)) { rgb(c, CRAIE[0], CRAIE[1], CRAIE[2]); return; }
  // la dictée : des lignes d'écriture
  if (la >= 2 && la < 21 && lt >= 8 && lt < H2 - 1 && (lt - 8) % 2 === 0 && hash(la, lt, 982, 0) < 0.72) { rgb(c, 0.74, 0.74, 0.70); return; }
  // le terrain du Racing, à droite, et les joueurs en croix rouges
  const fx = la - 24, fy = lt - 3, fw = 17, fh = 8;
  if (fx >= 0 && fx <= fw && fy >= 0 && fy <= fh) {
    if (fx === 0 || fx === fw || fy === 0 || fy === fh || fx === Math.floor(fw / 2)) rgb(c, CRAIE[0], CRAIE[1], CRAIE[2]);
    if (Math.abs(Math.hypot(fx - fw / 2, fy - fh / 2) - 2) < 0.5) rgb(c, CRAIE[0], CRAIE[1], CRAIE[2]);
    if ((fx === 1 || fx === fw - 1) && fy >= 3 && fy <= 5) rgb(c, CRAIE[0], CRAIE[1], CRAIE[2]);    // les buts
    for (const [px, py] of [[3, 2], [4, 6], [6, 4], [12, 2], [13, 5], [11, 7]]) if (fx === px && fy === py) rgb(c, 0.90, 0.40, 0.36);
  }
};
// la frise de l'alphabet : une lettre par carton
const LETTRES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
PEINTRES.alphabet = (o, c, la, lt, W2, H2) => {
  rgb(c, 0.84, 0.80, 0.66);
  const i = Math.floor(la / 4), x = la % 4;
  if (lt === 0 || lt === H2 - 1) { rgb(c, 0.62, 0.20, 0.16); return; }
  if (x === 3 && lt > 0 && lt < H2 - 1) rgb(c, 0.76, 0.72, 0.58);                                // le bord du carton
  const P = [[0.20, 0.30, 0.62], [0.66, 0.16, 0.14], [0.16, 0.44, 0.24]];
  const b = textBitmap(LETTRES[i % 26]);
  if (x < 3 && b.at(x, lt)) { const p = P[i % 3]; rgb(c, p[0], p[1], p[2]); }
};
// la carte du pays : un pays qui n'existe pas, la mer, un fleuve, la capitale
PEINTRES.carte = (o, c, la, lt, W2, H2) => {
  if (la === 0 || la === W2 - 1 || lt === H2 - 1) { rgb(c, 0.40, 0.27, 0.14); return; }
  if (lt === 0) { rgb(c, 0.20, 0.20, 0.20); return; }
  rgb(c, 0.52, 0.70, 0.82);                                                                     // la mer
  const cx = W2 * 0.48, cy = H2 * 0.52, a = Math.atan2(lt - cy, la - cx);
  const r = 0.42 * W2 * (0.85 + 0.15 * Math.sin(a * 3) + 0.08 * Math.cos(a * 5));
  if (Math.hypot((la - cx), (lt - cy) * 1.25) < r) {
    rgb(c, 0.66, 0.74, 0.46);
    if (lt < cy - 2) rgb(c, 0.70, 0.62, 0.42);                                                  // les montagnes, au nord
    if (Math.abs(lt - cy - (la - cx) * 0.3) < 0.6) rgb(c, 0.30, 0.46, 0.70);                   // le fleuve
    if (Math.abs(la - cx - 1) < 1 && Math.abs(lt - cy + 1) < 1) rgb(c, 0.70, 0.12, 0.10);       // la capitale
  }
};
// les dessins des élèves, punaisés
PEINTRES.dessins = (o, c, la, lt, W2, H2) => {
  rgb(c, 0.62, 0.48, 0.30);
  const i = Math.floor(la / 5), j = Math.floor(lt / 5), x = la % 5, y = lt % 5;
  if (x === 4 || y === 4) return;
  rgb(c, 0.92, 0.90, 0.84);
  const h = hash(i, j, 983, 0);
  const P = [[0.80, 0.20, 0.16], [0.22, 0.40, 0.76], [0.92, 0.76, 0.20], [0.24, 0.56, 0.28]];
  if (y === 3) { const p = P[Math.floor(h * 4)]; rgb(c, p[0] * 0.8, p[1] * 0.8, p[2] * 0.8); }   // l'herbe, la route
  else if ((x + y + Math.floor(h * 3)) % 3 === 0) { const p = P[Math.floor(hash(i, j, 984, x) * 4)]; rgb(c, p[0], p[1], p[2]); }
  if (y === 0 && x === 3 && h < 0.5) rgb(c, 0.95, 0.80, 0.20);                                     // un soleil
};

// ─── quelques meubles
// un pupitre double, son banc attaché (on s'y assoit tourné vers -y, vers le tableau)
function pupitre(K, x, y) {
  const { M } = K;
  K.boite(x, y, 0, x + 1, y + 4, 1, M.METAL_DARK); K.boite(x + 5, y, 0, x + 6, y + 4, 1, M.METAL_DARK);   // les patins
  K.boite(x, y, 1, x + 1, y + 2, 4, M.WOOD_DARK); K.boite(x + 5, y, 1, x + 6, y + 2, 4, M.WOOD_DARK);     // les flancs
  K.boite(x, y, 3, x + 6, y + 2, 4, M.WOOD); K.boite(x, y, 2, x + 6, y + 1, 3, M.WOOD_DARK);              // le plateau, le casier
  K.voxel(x + 2, y, 4, M.METAL_DARK);                                                                      // l'encrier
  K.boite(x, y + 3, 1, x + 6, y + 4, 2, M.WOOD); K.boite(x, y + 3, 0, x + 1, y + 4, 1, M.METAL_DARK);      // le banc
}
// une boule d'opaline au bout de sa tige
function suspension(K, x, y, z) {
  const { M } = K;
  K.boite(x, y, z + 1, x + 1, y + 1, K.H, M.METAL_DARK); K.voxel(x, y, z, M.LIT_PANEL);
  K.lampe(x + 0.5, y + 0.5, z, { cache: true, r: 56, c: [1.05, 1.0, 0.85] });
}

module.exports = {
  cle: 'ecole', nom: 'L\'école publique', ambiance: 'salle',
  sx: 44, sy: 34, sol: 'I_PARQUET',
  murs: { bas: 'I_MUR_VERT', haut: 'PAINT_CREAM', coupe: 7, frise: 'WOOD_DARK' },
  porte: { cote: 'x', de: 22, a: 29 },
  build(K) {
    const { M } = K;
    // ── le tableau noir, son auget, la craie ; l'alphabet en frise
    peint(K, 'tableau', LEFT, 9, 7, 22, 7, { en: 0, mat: M.BOARD });
    K.boite(9, 0, 6, 31, 2, 7, M.WOOD); K.voxel(14, 1, 7, M.WHITE); K.voxel(22, 1, 7, M.WHITE); K.voxel(26, 1, 7, M.CANVAS);
    K.objet('tableau', 'Le tableau noir', 20, 1, 10, { acces: [20, 7] });
    K.place('maitre', 22, 5, { regarde: 'gauche', pour: 'personnel' });
    peint(K, 'alphabet', LEFT, 1, 14, 42, 4, { en: 0, mat: M.WHITE });
    // la carte du pays, à gauche ; les dessins, à droite
    peint(K, 'carte', LEFT, 1, 6, 7, 8, { en: 0, mat: M.CANVAS });
    peint(K, 'dessins', LEFT, 33, 8, 10, 5, { en: 0, mat: M.I_CARTON });

    // ── l'estrade, le bureau du maître, le globe, la chaise
    K.boite(32, 1, 0, 43, 12, 1, M.WOOD_DARK);
    K.bureau(34, 5, 7, 4, { mat: M.WOOD, papiers: false });
    K.boite(35, 6, 4, 37, 8, 5, M.PAPER); K.boite(38, 6, 4, 39, 7, 6, M.PLASTIC_RED); K.voxel(39, 8, 4, M.PLASTIC_RED);   // le cahier d'appel, les livres, la pomme
    K.voxel(40, 6, 4, M.WOOD_DARK); K.voxel(40, 6, 5, M.CAR_BLUE); K.voxel(40, 6, 6, M.GRASS);                          // le globe
    K.chaise(36, 2, { dos: 'y-' });
    K.objet('bureau_maitre', 'Le bureau du maître', 37, 7, 5, { acces: [37, 14] });

    // ── les pupitres, trois rangs de deux
    for (const y of [12, 19, 26]) for (const x of [7, 17]) pupitre(K, x, y);
    K.objet('pupitres', 'Les pupitres', 14, 20, 4, { acces: [15, 24] });
    K.place('eleve_1', 9, 15, { pose: 'assis', regarde: 'droite' });
    K.place('eleve_2', 21, 22, { pose: 'assis', regarde: 'droite' });
    K.place('eleve_3', 11, 29, { pose: 'assis', regarde: 'droite' });
    K.voxel(10, 13, 4, M.PAPER); K.voxel(19, 20, 4, M.PAPER); K.voxel(20, 27, 4, M.PAPER); K.voxel(8, 27, 4, M.CAR_BLUE);

    // ── les grandes fenêtres, les portemanteaux et les cartables dessous
    for (const y of [3, 13, 23]) K.fenetreX(y, 9, 8, 6, {});
    for (let y = 4; y < 32; y += 3) {
      K.voxel(0, y, 7, M.METAL);
      const k = hash(y, 0, 985, 0);
      if (k < 0.75) K.boite(0, y - 1, 3, 1, y + 1, 7, [M.CAR_BORD, M.CAR_BLUE, M.I_MUR_OCRE, M.PLASTIC_RED, M.SEAT_GREY][Math.floor(k * 6.6) % 5]);
      if (k > 0.35) K.boite(1, y - 1, 0, 2, y + 1, 2, [M.LEATHER, M.PLASTIC_RED, M.CAR_BLUE][Math.floor(k * 7) % 3]);
    }
    K.objet('portemanteaux', 'Les portemanteaux', 1, 18, 6, { acces: [4, 18] });
    // le ballon dégonflé, dans le coin
    K.boite(3, 31, 0, 5, 33, 1, M.BALLS); K.voxel(4, 32, 1, M.BALLS);
    K.objet('ballon', 'Le ballon dégonflé', 4, 32, 1, { acces: [7, 31] });
    K.place('visiteur', 33, 18, { regarde: 'gauche', pour: 'visiteur' });

    // ── la lumière : les boules d'opaline, le jour par les fenêtres
    suspension(K, 13, 18, 14); suspension(K, 27, 18, 14);
    if (K.jour) { K.lampe(3, 8, 12, { cache: true, toujours: true, r: 30, c: [0.45, 0.50, 0.60], ombre: false }); K.lampe(3, 22, 12, { cache: true, toujours: true, r: 30, c: [0.45, 0.50, 0.60], ombre: false }); }
  },
};
