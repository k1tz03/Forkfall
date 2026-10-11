'use strict';
// Le centre de formation du Racing : un préfabriqué. Les douze lits — six lits superposés,
// couvertures bordeaux et grises — le long du mur du fond ; le tableau des résultats et des
// effectifs, avec ses étiquettes ; les casiers, la télé en hauteur et le magnétoscope qui
// clignote 12:00 ; le banc du couloir, les patères, les crampons alignés ; la grande table des
// devoirs, ses cahiers et sa lampe ; deux tubes au plafond, le convecteur sous la fenêtre.
const E = require('../engine');
const { M } = require('../mats');
const { LEFT, RIGHT, TOP, hash, mod, fbm, overlay } = E;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };

// le pinceau du centre (aucune matière nouvelle) : `prefa`, les panneaux du préfabriqué — crème,
// un joint couvert tous les 1,60 m, deux rivets (la tranche du mur garde sa couleur de coupe)
overlay('centre_pinceau', (o, c) => {
  if (o.f !== 'prefa' || c.face === TOP) return;
  rgb(c, 0.70, 0.66, 0.55); mul(c, 0.94 + 0.10 * fbm(c.a / 12, c.b / 12, 9801));
  const j = mod(c.a, 16);
  if (j === 0) mul(c, 0.72); else if (j === 1) mul(c, 1.06);
  if ((j === 2 || j === 15) && mod(c.b, 10) === 5) mul(c, 0.6);
});

// le tableau : à gauche le classement (des lignes, un rang surligné), à droite les étiquettes
// des effectifs, une par gamin, en colonnes ; un fanion punaisé en haut
overlay('centre_tableau', (o, c) => {
  if (c.face !== o.face) return;
  const la = o.face === LEFT ? Math.floor(2 * c.hx) - 2 * o.a0 : 2 * o.a0 - 1 - Math.floor(2 * c.hy);
  const lb = Math.floor(2 * c.hz) - 2 * o.z0, W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  const lt = H2 - 1 - lb;
  if (la === 0 || la === W2 - 1 || lt === 0 || lt === H2 - 1) { rgb(c, 0.55, 0.56, 0.58); return; }
  rgb(c, 0.86, 0.86, 0.84);
  const mid = Math.floor(W2 * 0.45);
  if (la === mid) { rgb(c, 0.55, 0.56, 0.58); return; }
  if (la < mid) {                                                     // le classement
    if (lt === 2 && la > 1 && la < mid - 1) rgb(c, 0.42, 0.10, 0.16);
    else if (lt > 3 && mod(lt, 2) === 0 && la > 1 && la < mid - 1 && hash(la, lt, 9802, 0) < 0.8) rgb(c, 0.25, 0.25, 0.28);
    if (lt === 8 && la > 1 && la < mid - 1) rgb(c, 0.85, 0.80, 0.30);                 // le Racing, surligné
    return;
  }
  const u = la - mid - 1, col = Math.floor(u / 4), du = mod(u, 4);  // les étiquettes, en colonnes
  if (lt > 2 && du < 3 && mod(lt, 2) === 1 && !(col === 1 && lt === 7)) rgb(c, hash(col, lt, 9803, 0) < 0.25 ? 0.80 : 0.95, 0.92, hash(col, lt, 9804, 0) < 0.2 ? 0.55 : 0.85);
  if (col === 1 && lt === 7 && du < 3) rgb(c, 0.93, 0.93, 0.91);                    // une étiquette arrachée
});

// un lit superposé : 1 m × 1,80 m, les montants, deux matelas, deux couvertures, deux oreillers,
// l'échelle au pied ; tête contre le mur du fond
function superpose(K, x, y, haut, bas) {
  const { M } = K;
  for (const [px, py] of [[x, y], [x + 4, y], [x, y + 8], [x + 4, y + 8]]) K.boite(px, py, 0, px + 1, py + 1, 9, M.METAL);
  for (const z of [1, 5]) K.boite(x, y, z, x + 5, y + 9, z + 1, M.METAL);
  K.boite(x + 1, y, 2, x + 4, y + 9, 3, M.WHITE); K.boite(x + 1, y, 6, x + 4, y + 9, 7, M.WHITE);
  K.boite(x + 1, y + 2, 3, x + 4, y + 9, 4, bas); K.boite(x + 1, y + 2, 7, x + 4, y + 9, 8, haut);
  K.boite(x + 1, y, 3, x + 4, y + 2, 4, M.ENAMEL); K.boite(x + 1, y, 7, x + 4, y + 2, 8, M.ENAMEL);
  K.boite(x, y + 1, 8, x + 1, y + 7, 9, M.METAL); K.boite(x + 4, y + 1, 8, x + 5, y + 7, 9, M.METAL);
  for (const z of [3, 5]) K.boite(x + 4, y + 9, z, x + 5, y + 10, z + 1, M.METAL);
}

module.exports = {
  cle: 'centre', nom: 'Le centre de formation', ambiance: 'salle',
  sx: 46, sy: 34, h: 14, sol: 'I_LINO',
  murs: { bas: 'PAINT_CREAM', haut: 'PAINT_CREAM', coupe: 7 },
  porte: { cote: 'x', de: 20, a: 27 },
  build(K) {
    const { M } = K;
    // ─── les panneaux du préfabriqué, peints sur la face visible des deux murs (avant les fenêtres)
    { const prefa = K.W.obj({ type: 'centre_pinceau', f: 'prefa' }); K.W.box(-1, -1, -1, K.SX, 0, K.H, M.PAINT_CREAM, prefa); K.W.box(-1, 0, -1, 0, K.SY, K.H, M.PAINT_CREAM, prefa); }
    // ─── les douze lits : six superposés contre le mur du fond, sous les fenêtres hautes
    for (let i = 0; i < 6; i++) superpose(K, 10 + i * 6, 0, i % 2 ? M.BLANKET : M.SEAT_GREY, i % 2 ? M.SEAT_GREY : M.BLANKET);
    for (const x of [13, 25, 37]) K.fenetreY(x, 10, 6, 3, { rideau: [0.42, 0.10, 0.16], sillMat: M.METAL, lintelMat: M.METAL });
    K.boite(29, 3, 8, 32, 6, 9, M.SEAT); K.voxel(30, 4, 9, M.SEAT_GREY);              // un sac sur un lit
    K.boite(12, 7, 4, 14, 8, 5, M.METAL_DARK);                                         // des crampons sur un autre
    K.boite(22, 9, 0, 24, 11, 2, M.BALLS);                                             // un ballon sous un lit
    K.objet('lits', 'Les douze lits', 27, 4, 8, { acces: [27, 12] });
    // ─── le tableau des résultats et des effectifs, au mur du fond, dans le coin
    {
      const id = K.W.obj({ type: 'centre_tableau', face: LEFT, a0: 3, z0: 5, w: 6, h: 7 });
      K.W.box(3, 0, 5, 9, 1, 12, M.WHITE, id);
      K.boite(4, 1, 5, 8, 2, 6, M.METAL);
    }
    K.objet('resultats', 'Le tableau des résultats', 6, 0, 9, { acces: [7, 8] });
    K.place('educateur', 7, 10, { regarde: 'droite', pour: 'barbier' });
    // ─── les casiers ; au-dessus, la télé sur sa console et le magnétoscope qui clignote
    for (let i = 0; i < 5; i++) {
      const y0 = 1 + i * 2;
      K.boite(0, y0, 0, 3, y0 + 2, 9, M.METAL); K.voxel(3, y0, 6, M.METAL_DARK); K.voxel(3, y0 + 1, 8, M.METAL_DARK);
    }
    K.boite(0, 2, 9, 3, 7, 10, M.METAL_DARK); K.voxel(3, 3, 9, M.RED_LIGHT); K.voxel(3, 4, 9, M.RED_LIGHT);
    K.tele(0, 3, { z: 10, sens: 'x' });
    for (let i = 0; i < 3; i++) { K.boite(0, 8, 9 + i, 2, 10, 10 + i, M.METAL_DARK); K.voxel(2, 8, 9 + i, M.WHITE); }
    K.objet('video', 'Le magnétoscope', 2, 4, 10, { acces: [5, 4] });
    K.place('brac', 7, 6, { regarde: 'gauche', pour: 'brac' });
    // ─── le couloir : le banc, les patères, les sacs, les crampons alignés dessous
    K.banc(0, 14, 3, 32, { mat: M.WOOD });
    K.boite(0, 14, 9, 1, 32, 10, M.WOOD_DARK);
    for (let y = 15; y < 32; y += 3) {
      const m = hash(y, 0, 9805, 0) < 0.5 ? M.JERSEY : M.SEAT;
      K.boite(0, y, 5, 1, y + 2, 9, m);
    }
    for (let y = 14; y < 31; y += 3) {                                                // une paire par gamin
      const m = hash(y, 1, 9806, 0) < 0.25 ? M.PLASTIC_RED : M.METAL_DARK;
      for (const dy of [0, 1]) { K.boite(3, y + dy, 0, 5, y + dy + 1, 1, m); K.voxel(4, y + dy, 0, M.WHITE); }
    }
    K.objet('crampons', 'Les crampons du couloir', 4, 22, 1, { acces: [7, 22] });
    K.place('gamin_1', 1, 27, { pose: 'assis', regarde: 'droite', pour: 'client' });
    K.place('gamin_2', 8, 18, { regarde: 'gauche', pour: 'client' });
    K.fenetreX(16, 10, 8, 3, { rideau: [0.42, 0.10, 0.16], sillMat: M.METAL, lintelMat: M.METAL });
    // ─── la table des devoirs : les cahiers, les livres, la trousse, la lampe ; six chaises
    K.table(14, 17, 16, 5, { mat: M.I_FORMICA, pied: M.METAL });
    for (const [bx, by, m] of [[15, 18, M.PAPER], [19, 19, M.I_LIVRES], [23, 18, M.PAPER], [26, 20, M.PAPER], [21, 20, M.PLASTIC_RED]]) K.boite(bx, by, 4, bx + 2, by + 1, 5, m);
    K.lampeBureau(28, 18);
    for (const x of [15, 20, 25]) { K.chaise(x, 15, { dos: 'y-', mat: M.WOOD }); K.chaise(x, 22, { dos: 'y+', mat: M.WOOD }); }
    K.objet('devoirs', 'La table des devoirs', 22, 19, 4, { acces: [12, 19] });
    K.place('tibo', 21, 23, { pose: 'assis', regarde: 'gauche', pour: 'tibo_rance' });
    K.place('mbako', 31, 12, { regarde: 'gauche', pour: 'mbako' });
    // ─── le règlement au mur, le bloc de secours vert ; la mère et le visiteur, côté porte
    K.afficheX(26, 9, 3, 4, { bg: [0.86, 0.85, 0.80], fg: [0.3, 0.3, 0.3], seed: 9807 });
    K.boite(0, 30, 11, 1, 32, 12, M.NEON_TEAL);
    K.W.light({ x: 2, y: 31, z: 11, r: 10, cr: 0.10, cg: 0.40, cb: 0.30, shadow: false });
    K.boite(34, 29, 0, 38, 32, 3, M.CANVAS); K.boite(35, 30, 3, 37, 32, 4, M.JERSEY);   // le linge à laver
    K.boite(12, 28, 0, 14, 30, 2, M.BALLS);
    K.place('mere', 40, 27, { regarde: 'gauche', pour: 'mere_mbako' });
    K.place('visiteur', 39, 20, { regarde: 'gauche', pour: 'visiteur' });
    // ─── la lumière : deux tubes au plafond (la télé éclaire son coin)
    K.neon(16, 13, 26, 14, 13, M.TUBE, { c: [0.75, 0.85, 0.85], r: 42 });
    K.neon(30, 13, 40, 14, 13, M.TUBE, { c: [0.75, 0.85, 0.85], r: 42 });
  },
};
