'use strict';
// La gare routière, le hall : au mur du fond, le tableau noir des départs (DÉPARTS, les heures en
// jaune, les villes en blanc — les horaires que personne ne respecte) et la pendule ; le guichet,
// sa vitre ouverte, son hygiaphone, le guichetier assis dedans ; la consigne et ses casiers ; le
// téléphone mural ; les portes vitrées sur les quais, et derrière elles le car du club garé au bout ;
// le distributeur qui luit la nuit ; le grand banc double sous le tableau ; la poubelle, le chariot.
const E = require('../engine');
const { M } = require('../mats');
const B = require('../build');
const { LEFT, RIGHT, TOP, hash, mod, overlay } = E;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
function texel(o, c) {
  const la = o.face === LEFT ? Math.floor(2 * c.hx) - 2 * o.a0 : 2 * o.a0 - 1 - Math.floor(2 * c.hy);
  return [la, Math.floor(2 * c.hz) - 2 * o.z0, o.w * 2, o.h * 2];
}

// la consigne : une grille de portes de casier, la serrure, la petite plaque du numéro ;
// une porte entrouverte
overlay('gareRoutiere_consigne', (o, c) => {
  if (c.face !== o.face) return;
  const [la, lb, W2, H2] = texel(o, c);
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  const u = mod(la, 4), v = mod(lb, 4), col = Math.floor(la / 4), row = Math.floor(lb / 4);
  if (u === 0 || v === 0) { rgb(c, 0.22, 0.23, 0.24); return; }
  if (col === 1 && row === 2) { rgb(c, 0.08, 0.08, 0.09); if (u === 1) rgb(c, 0.48, 0.49, 0.50); return; }   // entrouvert
  rgb(c, 0.52, 0.55, 0.52);
  if (u === 3 && v === 2) rgb(c, 0.12, 0.12, 0.12);
  if (u === 2 && v === 3) rgb(c, 0.86, 0.84, 0.70);
});
// le distributeur : la vitrine des friandises en rangs, le bandeau lumineux, le monnayeur
overlay('gareRoutiere_distrib', (o, c) => {
  if (c.face !== o.face) return;
  const [la, lb, W2, H2] = texel(o, c);
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  const lt = H2 - 1 - lb, vitre = la >= 1 && la < W2 - 4 && lt >= 4 && lt < H2 - 5;
  let col = null, k = 0;
  if (lt < 3 && la > 0 && la < W2 - 1) { col = [0.95, 0.90, 0.75]; k = 0.8; }                 // le bandeau
  else if (vitre) {
    if (mod(lt - 4, 4) === 3) { col = [0.30, 0.30, 0.32]; k = 0.15; }                           // les spirales
    else { const p = [[0.85, 0.20, 0.15], [0.20, 0.50, 0.85], [0.95, 0.80, 0.20], [0.25, 0.70, 0.30], [0.90, 0.90, 0.85]]; col = p[Math.floor(hash(Math.floor(la / 2), Math.floor((lt - 4) / 4), 9971, 0) * p.length)]; k = 0.45; }
  } else if (la >= W2 - 3 && la < W2 - 1 && lt >= 5 && lt < 13) { col = mod(lt, 2) ? [0.15, 0.15, 0.15] : [0.80, 0.80, 0.78]; k = mod(lt, 2) ? 0 : 0.3; }
  else if (lt >= H2 - 4 && la > 1 && la < W2 - 5) { rgb(c, 0.05, 0.05, 0.05); return; }       // la trappe
  if (!col) return;
  rgb(c, col[0] * 0.4, col[1] * 0.4, col[2] * 0.4); c.er = col[0] * k; c.eg = col[1] * k; c.eb = col[2] * k;
});
// les portes vitrées sur les quais : deux battants, leurs barres ; dehors, le quai et le car du
// club, bordeaux à bande grise (ses vitres s'allument la nuit)
overlay('gareRoutiere_quai', (o, c) => {
  if (c.face !== o.face) return;
  const [la, lb, W2, H2] = texel(o, c);
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  const lt = H2 - 1 - lb;
  if (la === 0 || la === W2 - 1 || la === Math.floor(W2 / 2) || lb === 0 || lt === 0) { rgb(c, 0.30, 0.31, 0.32); c.er = c.eg = c.eb = 0; return; }
  if (lb === 9 && la > 1 && la < W2 - 2) { rgb(c, 0.62, 0.64, 0.66); c.er = c.eg = c.eb = 0; return; }   // les barres
  const jour = o.jour;
  let col = jour ? [0.70, 0.76, 0.84] : [0.06, 0.08, 0.17], k = jour ? 0.55 : 0.35;
  if (lb < 4) col = jour ? [0.50, 0.50, 0.48] : [0.10, 0.10, 0.12];                         // le quai
  const bx0 = 3, bx1 = W2 - 2, car = la >= bx0 && la < bx1 && lb >= 3 && lb < H2 - 5;
  if (car) {
    col = jour ? [0.46, 0.12, 0.16] : [0.18, 0.05, 0.07]; k = jour ? 0.4 : 0.3;
    if (lb >= 11 && lb < 15 && mod(la - bx0, 4) !== 0) { col = jour ? [0.12, 0.13, 0.16] : [1.0, 0.78, 0.40]; k = jour ? 0.3 : 0.55; }
    if (lb === 9 || lb === 10) col = jour ? [0.62, 0.62, 0.60] : [0.22, 0.22, 0.22];
    if (lb === 4 && (la === bx0 + 1 || la === bx1 - 2)) { col = [1.0, 0.95, 0.80]; k = 0.9; }
  }
  rgb(c, col[0] * 0.3, col[1] * 0.3, col[2] * 0.3); c.er = col[0] * k; c.eg = col[1] * k; c.eb = col[2] * k;
});
// la pendule de gare : un disque blanc cerclé de noir, les deux aiguilles (six heures quarante)
overlay('gareRoutiere_pendule', (o, c) => {
  if (c.face !== o.face) return;
  const [la, lb, W2, H2] = texel(o, c);
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  const dx = la + 0.5 - W2 / 2, dy = lb + 0.5 - H2 / 2, d = Math.hypot(dx, dy);
  if (d > W2 / 2) { rgb(c, 0.62, 0.58, 0.48); return; }
  if (d > W2 / 2 - 0.9) { rgb(c, 0.10, 0.10, 0.10); return; }
  rgb(c, 0.92, 0.90, 0.84); c.er = 0.10; c.eg = 0.10; c.eb = 0.09;
  // la grande aiguille vers le bas (quarante), la petite vers le six et demi : six heures quarante
  if ((Math.abs(dx + 0.5) < 0.6 && dy < 0 && dy > -3) || (Math.abs(dx) < 0.6 && dy < 0 && dy > -2)) { rgb(c, 0.06, 0.06, 0.06); c.er = c.eg = c.eb = 0; }
});

module.exports = {
  cle: 'gareRoutiere', nom: 'La gare routière', ambiance: 'salle', personnel: 'commercant2',
  sx: 46, sy: 32, sol: 'I_BETON',
  murs: { bas: 'I_MUR_GRIS', haut: 'PAINT_CREAM', coupe: 7 },
  porte: { cote: 'y', de: 24, a: 31 },
  build(K) {
    const { M } = K;
    // ─── le tableau des départs : noir, l'en-tête, les heures en jaune, les villes en blanc
    const tx0 = 9, tx1 = 39;
    K.boite(tx0, 0, 4, tx1, 1, 18, M.METAL_DARK);
    const tab = K.murY;
    tab.sign(tx0 + 8, 17, 'DÉPARTS', { fg: [0.92, 0.92, 0.88], depth: -1, emit: [0.55, 0.55, 0.50] });
    const lignes = [['06:00', 'CAPITALE'], ['06:40', 'PORTCLAIR'], ['07:15', 'VALDORNE']];
    lignes.forEach(([h, ville], i) => {
      const z = 13 - i * 3;
      tab.sign(tx0 + 1, z, h, { fg: [1.0, 0.80, 0.25], depth: -1, emit: [0.75, 0.55, 0.12] });
      tab.sign(tx0 + 11, z, ville, { fg: [0.88, 0.88, 0.84], depth: -1, emit: [0.45, 0.45, 0.42] });
    });
    K.objet('horaires', 'Le tableau des horaires', 24, 0, 11, { acces: [24, 10] });
    // la pendule, au-dessus du distributeur
    K.surMurY(40, 13, 44, 17, M.WHITE); K.murY.poster(40, 13, 4, 4, { type: 'gareRoutiere_pendule', depth: -1 });
    // ─── le distributeur, au bout du mur : il luit
    K.boite(40, 0, 0, 45, 4, 12, M.PLASTIC_RED);
    { const id = K.W.obj({ type: 'gareRoutiere_distrib', face: LEFT, a0: 40, z0: 1, w: 5, h: 10 }); K.W.box(40, 3, 1, 45, 4, 11, M.PLASTIC_RED, id); }
    K.lampe(42.5, 6, 6, { r: 18, c: [0.55, 0.62, 0.70], cache: true, toujours: true });
    K.objet('distributeur', 'Le distributeur', 42, 4, 6, { acces: [42, 8] });
    // ─── le guichet : une cabine dans le coin, la vitre ouverte, l'hygiaphone, l'enseigne
    K.boite(0, 15, 0, 7, 16, 12, M.WOOD_DARK);
    K.boite(7, 0, 0, 8, 16, 4, M.WOOD_DARK); K.boite(6, 0, 4, 9, 16, 5, M.WOOD);
    for (const y of [0, 15]) K.boite(7, y, 5, 8, y + 1, 12, M.WOOD_DARK);
    K.boite(7, 0, 9, 8, 16, 12, M.WOOD_DARK); K.voxel(7, 7, 7, M.METAL); K.voxel(7, 8, 7, M.METAL);
    {
      const devanture = new B.Facade(K.W, RIGHT, 7, 0, 1, 16);
      devanture.sign(1, 12, 'GUICHET', { fg: [0.92, 0.88, 0.70], depth: 0, padX: 0, padY: 0 });
    }
    K.voxel(7, 11, 5, M.LIT_PANEL); K.boite(7, 3, 5, 8, 5, 6, M.PAPER);
    K.chaise(3, 6, { dos: 'x-', mat: M.I_SKAI });
    K.lampe(4.5, 8, 9, { r: 16, c: [1.1, 0.95, 0.7], cache: true });
    K.objet('guichet', 'Le guichet', 7, 8, 6, { acces: [10, 8] });
    K.place('guichetier', 4, 7, { pose: 'assis', regarde: 'droite', pour: 'personnel' });
    // ─── la consigne : les casiers, le casier entrouvert
    K.boite(0, 16, 0, 3, 22, 12, M.METAL);
    { const id = K.W.obj({ type: 'gareRoutiere_consigne', face: RIGHT, a0: 22, z0: 1, w: 6, h: 10 }); K.W.box(2, 16, 1, 3, 22, 11, M.METAL, id); }
    K.objet('consigne', 'La consigne', 3, 19, 6, { acces: [6, 19] });
    // ─── le téléphone mural, l'annuaire pendu
    K.boite(0, 22, 6, 1, 23, 9, M.METAL_DARK); K.voxel(1, 22, 8, M.METAL_DARK); K.boite(0, 22, 4, 1, 23, 5, M.PAPER);
    // ─── les portes vitrées sur les quais ; dehors, le car du club
    K.fenetreX(24, 0, 7, 11, { type: 'gareRoutiere_quai', jour: K.jour, sill: false, rebord: false, lintelMat: M.METAL_DARK });
    K.place('quai', 4, 27, { regarde: 'gauche', pour: 'client' });
    K.place('norbert', 9, 25, { regarde: 'gauche', pour: 'norbert' });
    // ─── le grand banc double sous le tableau : un dossier au milieu, des sièges des deux côtés
    for (const x of [14, 21, 28]) K.boite(x, 16, 0, x + 1, 19, 1, M.METAL_DARK);
    K.boite(13, 14, 1, 31, 21, 2, M.METAL); K.boite(13, 17, 2, 31, 18, 5, M.METAL);
    K.boite(13, 17, 5, 31, 18, 6, M.WOOD_DARK);
    K.objet('bancs', 'Les bancs', 22, 18, 3, { acces: [22, 23] });
    K.place('banc_1', 16, 15, { pose: 'assis', regarde: 'droite', pour: 'client' });
    K.place('banc_2', 26, 15, { pose: 'assis', regarde: 'gauche', pour: 'client' });
    K.place('banc_3', 20, 19, { pose: 'assis', regarde: 'droite', pour: 'visiteur' });
    K.boite(15, 19, 2, 17, 20, 4, M.SEAT);                                               // un sac oublié
    // ─── la poubelle, le chariot à bagages, un ticket par terre
    K.boite(36, 24, 0, 38, 26, 4, M.BIN);
    K.boite(32, 8, 1, 37, 11, 2, M.METAL); K.boite(36, 8, 0, 37, 11, 6, M.METAL); for (const [wx, wy] of [[32, 8], [32, 10]]) K.voxel(wx, wy, 0, M.TIRE);
    K.boite(33, 8, 2, 36, 11, 4, M.LEATHER);
    K.voxel(20, 27, -1, M.PAPER);
    // ─── la lumière : trois tubes ; la nuit, celui de l'entrée est éteint
    for (const [x0, y0] of [[10, 22], [28, 22], [18, 29]]) {
      if (K.nuit && y0 === 29) K.boite(x0, y0, 17, x0 + 10, y0 + 1, 18, M.PLASTIC_WHITE);
      else K.neon(x0, y0, x0 + 10, y0 + 1, 17, M.TUBE, { c: [0.75, 0.85, 0.85], r: 50 });
    }
  },
};
