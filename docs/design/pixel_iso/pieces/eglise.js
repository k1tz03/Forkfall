'use strict';
// L'église Saint-Aubin : la nef froide, la pierre, le tapis rouge de l'allée ; au fond, l'autel
// sous la grande verrière (le bleu, le rouge, l'or, et le jour qui tombe en couleurs) ; les
// bancs en deux rangs ; à gauche, la statue du saint, ses cierges (il y en a toujours un
// d'allumé, et un bordeaux, celui du club) et le tronc ; le confessionnal et ses rideaux ; la
// lampe rouge du sanctuaire ; le bénitier près de la porte.
const E = require('../engine');
const { LEFT, RIGHT, hash } = E;

// ─── la peinture : des images posées sur une face, au texel près (2 par voxel)
const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const lum = (c, r, g, b) => { c.er = r; c.eg = g; c.eb = b; };
const PEINTRES = {};
E.overlay('eglise_pinceau', (o, c) => {
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
  const id = W.obj(Object.assign({ type: 'eglise_pinceau', kind, face, s0, z0, w, h }, o));
  for (let z = z0; z < z0 + h; z++) for (let s = s0; s < s0 + w; s++) {
    const [x, y] = face === LEFT ? [s, en] : [en, s];
    if (o.mat) W.set(x, y, z, o.mat, id); else if (W.inb(x, y, z)) W.tag[W.idx(x, y, z)] = id;
  }
  return id;
}

// le vitrail : une lancette en arc brisé, des plombs, des verres de couleur ; le jour les allume
const VERRES = [[0.16, 0.26, 0.70], [0.70, 0.12, 0.14], [0.86, 0.66, 0.18], [0.20, 0.50, 0.30], [0.50, 0.22, 0.56], [0.20, 0.34, 0.78]];
PEINTRES.vitrail = (o, c, la, lt, W2, H2) => {
  lum(c, 0, 0, 0);
  const cx = (W2 - 1) / 2, r = W2 / 2, dx = Math.abs(la - cx);
  // l'arc brisé, en haut : deux arcs de cercle qui se croisent
  const ya = r * 1.2;
  if (lt < ya) { const dy = ya - lt, d1 = Math.hypot(la - (cx - r * 0.45), dy), d2 = Math.hypot(la - (cx + r * 0.45), dy); if (Math.max(d1, d2) > r * 1.32) { rgb(c, 0.66, 0.60, 0.48); return; } }
  if (la === 0 || la === W2 - 1 || lt === H2 - 1) { rgb(c, 0.48, 0.46, 0.42); return; }
  const g = o.jour ? 1.0 : 0.22;
  // les plombs : une grille en losanges, les meneaux
  if ((la + lt) % 4 === 0 || (la - lt + 400) % 4 === 0) { rgb(c, 0.10, 0.10, 0.11); return; }
  if (o.meneaux && la % Math.floor(W2 / o.meneaux) === 0) { rgb(c, 0.40, 0.38, 0.34); return; }
  // le motif : un médaillon au centre (l'or et le rouge), le bleu autour
  const my = H2 * 0.45, dm = Math.hypot((la - cx) / (W2 * 0.32), (lt - my) / (H2 * 0.16));
  let k;
  if (dm < 0.55) k = VERRES[2]; else if (dm < 1) k = VERRES[1]; else k = VERRES[(hash(Math.floor(la / 2), Math.floor(lt / 2), 991, o.s0) * 6) | 0];
  if (dm >= 1 && hash(Math.floor(la / 2), Math.floor(lt / 2), 992, 0) < 0.55) k = VERRES[o.s0 % 2 ? 0 : 5];
  rgb(c, k[0] * 0.5, k[1] * 0.5, k[2] * 0.5); lum(c, k[0] * g, k[1] * g, k[2] * g);
};
// le confessionnal : le cadre de chêne, deux rideaux, la porte du milieu et sa grille, une croix
PEINTRES.confessionnal = (o, c, la, lt, W2, H2) => {
  const t = W2 / 3;
  rgb(c, 0.30, 0.18, 0.10);
  if (la % Math.round(t) === 0 || la === W2 - 1 || lt <= 2 || lt === H2 - 1) { rgb(c, 0.22, 0.12, 0.07); if (lt <= 1 && Math.abs(la - (W2 - 1) / 2) < 0.6) rgb(c, 0.80, 0.64, 0.24); return; }
  const bay = Math.floor(la / t);
  if (bay !== 1) {
    rgb(c, 0.34, 0.10, 0.24); if (la % 2) rgb(c, 0.28, 0.08, 0.20);                          // le rideau violet
    if (lt > H2 - 6) rgb(c, 0.30, 0.18, 0.10);                                                // le bas de bois
    return;
  }
  if (lt >= 5 && lt <= 9 && Math.abs(la - (W2 - 1) / 2) <= 2) { rgb(c, (la + lt) % 2 ? 0.06 : 0.40, (la + lt) % 2 ? 0.04 : 0.26, (la + lt) % 2 ? 0.03 : 0.14); return; } // la grille
  if (la === Math.floor(t) + 2 && lt === Math.floor(H2 * 0.55)) rgb(c, 0.80, 0.64, 0.24);   // la poignée
  if ((lt - 3) % 6 === 0) rgb(c, 0.24, 0.14, 0.08);
};

// ─── quelques meubles
// un banc d'église : l'agenouilloir devant, l'assise, le dossier derrière (on y est assis tourné vers -y)
function banc(K, x0, x1, y) {
  const { M } = K;
  K.boite(x0, y, 0, x1, y + 1, 1, M.WOOD);                                                   // l'agenouilloir
  K.boite(x0, y + 1, 1, x1, y + 3, 2, M.WOOD_DARK);                                          // l'assise
  K.boite(x0, y + 3, 1, x1, y + 4, 5, M.WOOD_DARK);                                          // le dossier
  for (const x of [x0, x1 - 1]) K.boite(x, y + 1, 0, x + 1, y + 4, 5, M.WOOD_DARK);          // les joues
}
// un pilastre de pierre, du sol au haut du mur
function pilastre(K, face, s) { if (face === LEFT) K.boite(s, 0, 0, s + 2, 1, K.H, K.M.STONE); else K.boite(0, s, 0, 1, s + 2, K.H, K.M.STONE); }
// une flamme : une ampoule, une petite lumière qui tremble
function flamme(K, x, y, z, r = 10) { K.voxel(x, y, z, K.M.BULB); K.lampe(x + 0.5, y + 0.5, z + 0.8, { cache: true, r, c: [1.3, 0.8, 0.32], toujours: true }); }

module.exports = {
  cle: 'eglise', nom: 'L\'église Saint-Aubin', ambiance: 'salle',
  sx: 40, sy: 46, h: 26, sol: 'STONE',
  murs: { bas: 'STONE', haut: 'PLASTER_CREAM', coupe: 6 },
  porte: { cote: 'y', de: 17, a: 24 },
  build(K) {
    const { M } = K;
    // ── la pierre : les pilastres, le bandeau
    for (const x of [7, 31]) pilastre(K, LEFT, x);
    for (const y of [6, 22, 35]) pilastre(K, RIGHT, y);
    K.boite(0, 0, 18, 13, 1, 19, M.STONE); K.boite(28, 0, 18, K.SX, 1, 19, M.STONE); K.boite(0, 0, 18, 1, K.SY, 19, M.STONE);

    // ── le chœur : le tapis rouge, l'autel, ses chandeliers, la croix ; la grande verrière au-dessus
    K.tapis(10, 1, 30, 11); K.tapis(18, 11, 23, 46);
    K.boite(15, 4, 0, 26, 8, 4, M.STONE); K.boite(14, 4, 4, 27, 8, 5, M.WHITE); K.boite(15, 8, 3, 26, 9, 4, M.WHITE);
    for (const x of [16, 24]) { K.boite(x, 5, 5, x + 1, 6, 7, M.GOLD); flamme(K, x, 5, 7, 16); }
    K.boite(20, 5, 5, 21, 6, 10, M.GOLD); K.boite(19, 5, 8, 22, 6, 9, M.GOLD);
    K.objet('autel', 'L\'autel', 20, 6, 5, { acces: [20, 12] });
    K.place('pretre', 20, 2, { regarde: 'gauche', pour: 'personnel' });
    peint(K, 'vitrail', LEFT, 14, 9, 13, 16, { en: -1, mat: M.GLASS, jour: K.jour, meneaux: 3 });
    if (K.jour) K.lampe(20, 6, 16, { cache: true, toujours: true, r: 44, c: [0.75, 0.62, 0.85], ombre: false });
    else K.lampe(20, 3, 16, { cache: true, r: 20, c: [0.2, 0.22, 0.45], ombre: false });
    // la lampe rouge du sanctuaire, au bout de sa potence
    K.boite(11, 0, 16, 12, 4, 17, M.METAL_DARK); K.boite(11, 3, 13, 12, 4, 16, M.METAL_DARK); K.voxel(11, 3, 12, M.RED_LIGHT);
    K.lampe(11.5, 3.5, 11.5, { cache: true, r: 18, c: [1.0, 0.15, 0.12], toujours: true });

    // ── les bancs, en deux rangs, de part et d'autre de l'allée
    for (const y of [13, 19, 25, 31, 37]) { banc(K, 7, 16, y); banc(K, 25, 34, y); }
    K.objet('bancs', 'Les bancs', 12, 21, 2, { acces: [20, 24] });
    K.place('cierges', 9, 10, { regarde: 'gauche' });                               // devant les cierges, à gauche
    K.place('banc_1', 10, 21, { pose: 'assis', regarde: 'droite' });
    K.place('banc_2', 29, 27, { pose: 'assis', regarde: 'droite' });
    K.place('banc_3', 12, 33, { pose: 'assis', regarde: 'droite', pour: 'visiteur' });

    // ── la statue du saint, ses cierges, le tronc
    K.boite(0, 9, 0, 3, 13, 5, M.STONE);
    K.boite(0, 10, 5, 2, 12, 11, M.PLASTER_CREAM); K.boite(1, 10, 7, 3, 12, 10, M.PLASTER_CREAM);
    K.boite(0, 10, 11, 2, 12, 13, M.PLASTER_CREAM); K.boite(0, 9, 12, 1, 13, 14, M.GOLD);   // la tête, l'auréole
    K.boite(4, 8, 0, 5, 14, 3, M.METAL_DARK); K.boite(3, 8, 3, 7, 14, 4, M.METAL_DARK); K.boite(3, 8, 4, 6, 14, 5, M.METAL_DARK);
    for (const [x, y, z] of [[6, 9, 4], [6, 11, 4], [6, 13, 4], [5, 10, 5], [5, 12, 5], [4, 9, 5], [4, 13, 5]]) {
      K.voxel(x, y, z, M.WHITE);
      if (hash(x, y, z, 993) < 0.55) flamme(K, x, y, z + 1, 9);
    }
    K.voxel(6, 12, 4, M.I_VELOURS); K.voxel(6, 12, 5, M.I_VELOURS); flamme(K, 6, 12, 6, 12);   // le cierge bordeaux, celui du club
    K.objet('cierges', 'Les cierges', 5, 11, 5, { acces: [9, 11] });
    K.boite(4, 16, 0, 5, 17, 4, M.METAL_DARK); K.boite(3, 15, 4, 6, 18, 6, M.WOOD_DARK); K.voxel(4, 16, 6, M.GOLD);
    K.objet('tronc', 'Le tronc', 4, 16, 6, { acces: [8, 16] });

    // ── les vitraux du mur de gauche ; le confessionnal entre eux
    peint(K, 'vitrail', RIGHT, 15, 9, 6, 9, { en: -1, mat: M.GLASS, jour: K.jour });
    peint(K, 'vitrail', RIGHT, 38, 9, 6, 9, { en: -1, mat: M.GLASS, jour: K.jour });
    if (K.jour) { K.lampe(3, 18, 13, { cache: true, toujours: true, r: 26, c: [0.45, 0.45, 0.70], ombre: false }); K.lampe(3, 41, 13, { cache: true, toujours: true, r: 26, c: [0.62, 0.40, 0.45], ombre: false }); }
    K.boite(0, 25, 0, 5, 34, 13, M.WOOD_DARK);
    peint(K, 'confessionnal', RIGHT, 25, 0, 9, 13, { en: 4, mat: M.WOOD_DARK });
    K.boite(0, 25, 13, 6, 34, 14, M.WOOD_DARK); K.boite(0, 28, 14, 4, 31, 15, M.WOOD_DARK); K.voxel(1, 29, 15, M.GOLD); K.voxel(1, 29, 16, M.GOLD);
    K.objet('confessionnal', 'Le confessionnal', 4, 29, 6, { acces: [8, 29] });

    // ── le bénitier, près de la porte
    K.boite(14, 41, 0, 15, 42, 4, M.STONE); K.boite(13, 40, 4, 16, 43, 5, M.STONE); K.voxel(14, 41, 5, M.CAR_BLUE);

    // ── la lumière de la nef : deux lanternes aux pilastres
    for (const [x, y] of [[1, 23], [1, 36]]) { K.voxel(x, y, 12, M.METAL_DARK); K.voxel(x, y, 13, M.BULB); K.lampe(x + 1, y + 0.5, 13, { cache: true, r: 30, c: [1.1, 0.8, 0.45] }); }
  },
};
