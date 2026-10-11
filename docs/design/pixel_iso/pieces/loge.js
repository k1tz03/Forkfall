'use strict';
// La loge du gardien du cimetière : Monsieur Abel note qui vient, et quand. La table sous la
// fenêtre qui donne sur les allées (les cyprès, les croix, le gravier), le registre ouvert, le
// poêle en fonte dans le coin et sa cafetière, le tableau des clés et le gros trousseau, la
// chaise du visiteur, la casquette au portemanteau, les arrosoirs qu'on prête.
const E = require('../engine');
const { M } = require('../mats');
const { LEFT, TOP, hash, mod, overlay } = E;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };

// le pinceau de la loge (aucune matière nouvelle) : `feu`, les braises derrière la porte du poêle
overlay('loge_pinceau', (o, c) => {
  if (o.f === 'feu') { const k = 0.65 + 0.55 * hash(c.a, c.b, 9301, 0); rgb(c, 0.9, 0.42, 0.12); c.er = 1.3 * k; c.eg = 0.50 * k; c.eb = 0.10 * k; }
});

// la vue par la fenêtre : le ciel, le mur du fond, les cyprès, les croix, l'allée de gravier
// (2 texels par voxel : une fenêtre de 10 × 7 fait 20 × 14 texels)
overlay('loge_vue', (o, c) => {
  if (c.face !== o.face) return;
  const la = o.face === LEFT ? Math.floor(2 * c.hx) - 2 * o.a0 : 2 * o.a0 - 1 - Math.floor(2 * c.hy);
  const lb = Math.floor(2 * c.hz) - 2 * o.z0;
  const W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  const lt = H2 - 1 - lb, mid = Math.floor(W2 / 2), tr = 4;
  if (la === 0 || la === W2 - 1 || lb === 0 || lt === 0 || la === mid || lt === tr) {
    rgb(c, 0.46, 0.36, 0.24); c.er = c.eg = c.eb = 0; return;
  }
  const jour = o.jour;
  // de loin en près : le ciel, le mur, les cyprès, les tombes, l'allée
  let col = jour ? [0.70, 0.76, 0.86] : [0.07, 0.09, 0.20], k = jour ? 0.55 : 0.30;
  if (!jour && Math.hypot(la - 15, lt - 2.5) < 1.3) { col = [0.9, 0.9, 0.8]; k = 0.9; }      // la lune
  if (lt === 8) col = jour ? [0.55, 0.52, 0.46] : [0.10, 0.10, 0.14];                        // le mur du fond
  for (const [cx, haut] of [[3, 2], [7, 3], [13, 1], [17, 3]]) {                               // les cyprès
    const demi = Math.max(0, Math.floor((lt - haut) / 3));
    if (lt >= haut && lt <= 9 && Math.abs(la - cx) <= demi) col = jour ? [0.16, 0.26, 0.15] : [0.03, 0.05, 0.05];
  }
  if (lt >= 9) col = jour ? [0.36, 0.40, 0.28] : [0.05, 0.06, 0.07];                            // l'herbe entre les tombes
  for (const [cx, croix] of [[2, 1], [5, 0], [15, 1], [18, 0]]) {                             // les tombes et les croix
    if (croix ? (la === cx && lt >= 8 && lt <= 11) || (lt === 9 && Math.abs(la - cx) <= 1) : (Math.abs(la - cx) <= 1 && lt >= 9 && lt <= 11)) {
      col = jour ? [0.66, 0.64, 0.58] : [0.14, 0.15, 0.20];
    }
  }
  const allee = lt - 9;                                                                       // l'allée qui s'éloigne
  if (allee >= 0 && Math.abs(la + 0.5 - W2 / 2) <= 1 + allee) col = jour ? [0.74, 0.68, 0.54] : [0.16, 0.16, 0.20];
  rgb(c, col[0] * 0.3, col[1] * 0.3, col[2] * 0.3);
  c.er = col[0] * k; c.eg = col[1] * k; c.eb = col[2] * k;
});

// une pendule ronde (un disque blanc, son cerclage, deux aiguilles) et le calendrier des
// pompes funèbres (une photo de cyprès, la grille des jours, un jour entouré de rouge)
function texel(o, c) {
  const la = o.face === LEFT ? Math.floor(2 * c.hx) - 2 * o.a0 : 2 * o.a0 - 1 - Math.floor(2 * c.hy);
  return [la, Math.floor(2 * c.hz) - 2 * o.z0, o.w * 2, o.h * 2];
}
overlay('loge_pendule', (o, c) => {
  if (c.face !== o.face) return;
  const [la, lb, W2, H2] = texel(o, c);
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  const dx = la + 0.5 - W2 / 2, dy = lb + 0.5 - H2 / 2, d = Math.hypot(dx, dy);
  if (d > W2 / 2) rgb(c, 0.62, 0.56, 0.45);
  else if (d > W2 / 2 - 1) rgb(c, 0.20, 0.14, 0.09);
  else if ((la === Math.floor(W2 / 2) && lb >= H2 / 2 - 1) || (lb === Math.floor(H2 / 2) - 1 && la >= W2 / 2 - 1)) rgb(c, 0.08, 0.08, 0.08);
  else rgb(c, 0.86, 0.84, 0.78);
});
overlay('loge_calendrier', (o, c) => {
  if (c.face !== o.face) return;
  const [la, lb, W2, H2] = texel(o, c);
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  const lt = H2 - 1 - lb;
  if (lt < H2 * 0.45) {                                           // la photo : un ciel, deux cyprès
    if (lt === 0 || la === 0 || la === W2 - 1) { rgb(c, 0.80, 0.78, 0.70); return; }
    const cypres = (la === 2 || la === W2 - 3) && lt >= 1;
    rgb(c, cypres ? 0.15 : lt > H2 * 0.32 ? 0.42 : 0.55, cypres ? 0.26 : lt > H2 * 0.32 ? 0.48 : 0.66, cypres ? 0.14 : lt > H2 * 0.32 ? 0.30 : 0.80);
    return;
  }
  rgb(c, 0.86, 0.84, 0.78);                                       // la grille des jours
  if (mod(la, 2) === 1 && mod(lt, 2) === 0) rgb(c, 0.40, 0.38, 0.36);
  if (la === 3 && lt === Math.floor(H2 * 0.7)) rgb(c, 0.75, 0.12, 0.12);
});

module.exports = {
  cle: 'loge', nom: 'La loge du gardien', ambiance: 'maison',
  sx: 28, sy: 24, h: 16, sol: 'I_TOMETTE',
  murs: { bas: 'STONE', haut: 'PAINT_CREAM', coupe: 6, plinthe: 'WOOD_DARK' },
  porte: { cote: 'x', de: 12, a: 19 },
  build(K) {
    const { M } = K;
    // la fenêtre sur les allées, et la table du gardien dessous
    K.fenetreY(9, 6, 10, 7, { type: 'loge_vue', jour: K.jour, sillMat: M.WOOD, lintelMat: M.WOOD_DARK });
    K.objet('fenetre', 'La fenêtre sur les allées', 14, 1, 9, { acces: [19, 9] });
    K.table(8, 1, 12, 5, { mat: M.WOOD });
    // le registre ouvert, le porte-plume, la tasse, la lampe
    K.boite(11, 2, 4, 17, 5, 5, M.LEATHER);
    K.boite(12, 2, 4, 16, 4, 5, M.PAPER);
    K.voxel(16, 4, 4, M.METAL_DARK);
    K.voxel(10, 4, 4, M.WHITE);
    K.lampeBureau(18, 2);
    K.objet('registre', 'Le registre des visites', 14, 3, 5, { acces: [11, 9] });
    // la chaise du gardien, face à la fenêtre ; la chaise du visiteur, au bout de la table
    K.chaise(13, 6, { dos: 'y+' });
    K.place('gardien', 14, 7, { pose: 'assis', regarde: 'droite', pour: 'abel' });
    K.chaise(21, 3, { dos: 'x+' });
    K.place('chaise', 22, 4, { pose: 'assis', regarde: 'gauche', pour: 'visiteur' });
    // le poêle en fonte dans le coin, son tuyau, la cafetière émaillée, les braises
    K.boite(1, 1, 0, 2, 2, 1, M.METAL_DARK); K.boite(5, 1, 0, 6, 2, 1, M.METAL_DARK);
    K.boite(1, 5, 0, 2, 6, 1, M.METAL_DARK); K.boite(5, 5, 0, 6, 6, 1, M.METAL_DARK);
    K.boite(1, 1, 1, 6, 6, 6, M.METAL_DARK);
    K.boite(0, 0, 6, 7, 7, 7, M.METAL);
    K.W.box(6, 3, 2, 7, 5, 3, M.METAL_DARK, K.W.obj({ type: 'loge_pinceau', f: 'feu' }));
    K.boite(6, 2, 3, 7, 6, 4, M.METAL); K.boite(6, 2, 1, 7, 6, 2, M.METAL);
    K.boite(4, 4, 7, 6, 6, 9, M.ENAMEL); K.voxel(6, 5, 8, M.ENAMEL);
    K.boite(2, 2, 7, 3, 3, 14, M.METAL_DARK); K.boite(0, 2, 13, 2, 3, 14, M.METAL_DARK);
    K.boite(1, 8, 0, 4, 11, 2, M.I_CARTON); K.boite(1, 8, 2, 4, 10, 3, M.WOOD);   // le panier à bois
    K.lampe(7.5, 4, 2.5, { r: 18, c: [1.3, 0.5, 0.15], cache: true });
    K.objet('poele', 'Le poêle', 3, 3, 6, { acces: [8, 7] });
    // le tableau des clés et le trousseau
    K.surMurX(9, 7, 15, 12, M.WOOD);
    for (let y = 10; y < 15; y += 2) for (let z = 8; z < 12; z += 2) K.voxel(1, y, z, hash(y, z, 9302, 0) < 0.3 ? M.GOLD : M.METAL);
    K.boite(1, 9, 7, 2, 10, 9, M.GOLD); K.voxel(1, 9, 9, M.METAL_DARK);
    K.objet('cles', 'Le trousseau', 1, 11, 9, { acces: [4, 12] });
    // le portemanteau : la veste bleue et la casquette du gardien ; le parapluie ; les arrosoirs
    K.surMurX(17, 11, 22, 12, M.WOOD_DARK);
    K.boite(1, 18, 5, 2, 21, 11, M.SHUTTER_BLUE); K.boite(1, 18, 11, 2, 20, 12, M.METAL_DARK);
    K.boite(1, 22, 0, 2, 23, 7, M.METAL_DARK);
    K.boite(2, 15, 0, 4, 17, 2, M.METAL_GREEN); K.voxel(4, 16, 1, M.METAL_GREEN);
    K.boite(5, 15, 0, 7, 17, 2, M.METAL); K.voxel(7, 16, 1, M.METAL);
    // l'étagère du fond : la radio, la boîte à sucre ; dessous, le calendrier ; la pendule
    K.boite(21, 0, 10, 27, 2, 11, M.WOOD_DARK);
    K.boite(21, 0, 11, 24, 1, 13, M.WOOD_DARK); K.voxel(22, 1, 11, M.METAL);
    K.boite(25, 0, 11, 26, 1, 13, M.ENAMEL);
    K.surMurY(23, 4, 26, 9, M.WHITE);
    K.murY.poster(23, 4, 3, 5, { type: 'loge_calendrier', depth: -1 });
    K.surMurY(4, 10, 6, 12, M.WHITE);
    K.murY.poster(4, 10, 2, 2, { type: 'loge_pendule', depth: -1 });
    K.place('porte', 24, 15, { regarde: 'gauche', pour: 'client' });
    // les chrysanthèmes de la Toussaint qui attendent preneur, le balai dans le coin
    for (const [px, py] of [[2, 20], [5, 21], [2, 17]]) { K.boite(px, py, 0, px + 2, py + 2, 2, M.PLASTIC_RED); K.boite(px, py, 2, px + 2, py + 2, 4, M.FOLIAGE); }
    K.boite(26, 1, 0, 27, 2, 10, M.WOOD); K.boite(25, 1, 0, 27, 3, 2, M.I_CARTON);
    // l'ampoule sous son abat-jour : la nuit seulement ; le jour vient de la fenêtre
    K.boite(14, 11, 14, 15, 12, 16, M.METAL_DARK); K.boite(13, 10, 13, 16, 13, 14, M.ENAMEL);
    if (K.nuit) {
      K.lampe(14.5, 11.5, 12.5, { r: 34, c: [1.0, 0.82, 0.55] });
      K.W.light({ x: 14, y: 3, z: 10, r: 20, cr: 0.10, cg: 0.13, cb: 0.30, shadow: false });
    } else {
      K.voxel(14, 11, 12, M.WHITE);
      K.W.light({ x: 14, y: 4, z: 9, r: 34, cr: 0.34, cg: 0.36, cb: 0.40, shadow: false });
    }
  },
};
