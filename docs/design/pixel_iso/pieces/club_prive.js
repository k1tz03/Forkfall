'use strict';
// Le Rideau Rouge : du velours, une musique lente, personne n'a de nom. Au fond, l'estrade et son
// grand rideau rouge à franges d'or, fermé ; devant, une petite piste de danse qui s'allume par
// carreaux sous la boule à facettes ; dans l'angle, l'alcôve (le carré) et sa banquette en rond, le
// seau à champagne ; le bar capitonné, ses bouteilles éclairées par-dessous, la lampe d'Irène et le
// cahier des ardoises au bout du comptoir ; près de la porte, le vestiaire et ses manteaux.
const E = require('../engine');
const { TOP, RIGHT, hash, mod } = E;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const grain = (c, amt, s = 0) => mul(c, 1 + (hash(c.a, c.b, c.face * 7 + s, c.m) - 0.5) * 2 * amt);
if (!E.OVERLAYS.club_prive_pinceau) E.overlay('club_prive_pinceau', (o, c) => o.f(c));
const peint = (K, x0, y0, z0, x1, y1, z1, m, f) => K.W.box(x0, y0, z0, x1, y1, z1, m, K.W.obj({ type: 'club_prive_pinceau', f }));
const le = c => Math.floor(2 * (c.face === RIGHT ? c.hy : c.hx));
const haut = c => Math.floor(2 * c.hz);

// la moquette : un rouge profond, un losange d'or éteint
const moquette = c => {
  if (c.face !== TOP) { rgb(c, 0.22, 0.05, 0.06); return; }
  rgb(c, 0.30, 0.06, 0.08);
  const a = mod(Math.floor(2 * c.hx), 8), b = mod(Math.floor(2 * c.hy), 8);
  if ((a === 3 || a === 4) && (b === 3 || b === 4)) rgb(c, 0.40, 0.20, 0.09);           // un fleuron d'or éteint
  else if ((a === 3 || a === 4) && (b === 2 || b === 5) || (b === 3 || b === 4) && (a === 2 || a === 5)) rgb(c, 0.34, 0.12, 0.08);
  grain(c, 0.08);
};
// la banquette du carré : un velours plus sombre, passepoilé d'or
const veloursCarre = c => {
  rgb(c, 0.22, 0.04, 0.07); if (c.face === TOP) { mul(c, 1.25); grain(c, 0.05); return; }
  if (haut(c) === 3) rgb(c, 0.70, 0.52, 0.20);
  if (mod(le(c), 4) === 0) mul(c, 0.8);
  grain(c, 0.05);
};
// le velours des murs : des côtes verticales
const veloursMur = c => {
  if (c.face === TOP) { rgb(c, 0.14, 0.04, 0.05); return; }
  rgb(c, 0.40, 0.08, 0.11); if (mod(le(c), 3) === 0) mul(c, 0.78); grain(c, 0.06);
};
// le grand rideau : des plis, la frange d'or en bas
const rideau = c => {
  if (c.face === TOP) { rgb(c, 0.30, 0.06, 0.08); return; }
  const u = le(c), v = haut(c);
  const pli = 0.62 + 0.38 * Math.abs(Math.sin(u * 0.75));
  rgb(c, 0.62 * pli, 0.08 * pli, 0.10 * pli);
  if (v <= 3) { rgb(c, 0.82, 0.62, 0.22); if (mod(u, 2) && v <= 1) rgb(c, 0.5, 0.36, 0.12); }
  grain(c, 0.04);
};
// la piste : des carreaux qui s'allument, chacun sa couleur
const COULEURS = [[1.0, 0.28, 0.42], [1.0, 0.58, 0.22], [0.95, 0.80, 0.62], [0.80, 0.16, 0.18], [0.70, 0.30, 0.75]];
const piste = c => {
  if (c.face !== TOP) { rgb(c, 0.1, 0.05, 0.06); return; }
  const a = mod(Math.floor(2 * c.hx), 4), b = mod(Math.floor(2 * c.hy), 4);
  if (a === 0 || b === 0) { rgb(c, 0.05, 0.04, 0.05); c.er = c.eg = c.eb = 0; return; }
  const tx = Math.floor(c.hx / 2), ty = Math.floor(c.hy / 2), h = hash(tx, ty, 851, 0);
  const k = COULEURS[Math.floor(h * COULEURS.length)], on = hash(tx, ty, 852, 0) < 0.5 ? 0.62 : 0.12;
  rgb(c, k[0] * 0.3, k[1] * 0.3, k[2] * 0.3); c.er = k[0] * on; c.eg = k[1] * on; c.eb = k[2] * on;
  c.wet = 0.2;
};
// la boule à facettes
const facettes = c => {
  rgb(c, 0.55, 0.56, 0.60);
  const h = hash(Math.floor(2 * c.hx * 3), Math.floor(2 * (c.face === TOP ? c.hy : c.hz) * 3), 853 + c.face, 0);
  if (h < 0.3) { rgb(c, 0.9, 0.9, 0.95); c.er = 0.9; c.eg = 0.85; c.eb = 1.0; } else if (h > 0.8) mul(c, 0.5);
};
// le cuir capitonné du bar, la barre de laiton
const capitonne = c => {
  if (c.face === TOP) { rgb(c, 0.12, 0.05, 0.05); return; }
  const u = le(c), v = haut(c);
  rgb(c, 0.34, 0.07, 0.08);
  if (v === 8 || v === 9) { rgb(c, 0.80, 0.62, 0.26); return; }
  if (mod(u + (mod(Math.floor(v / 2), 2) ? 2 : 0), 4) === 0 && mod(v, 2) === 1) rgb(c, 0.16, 0.03, 0.04);
  grain(c, 0.05);
};
// les bouteilles du bar, éclairées par-dessous
const bouteillesLuisantes = c => {
  const u = le(c), v = haut(c), h = hash(u >> 1, Math.floor(v / 3), 854, 0);
  const p = [[0.85, 0.55, 0.20], [0.30, 0.55, 0.25], [0.80, 0.78, 0.65], [0.65, 0.15, 0.20], [0.40, 0.35, 0.70]][Math.floor(h * 5)];
  rgb(c, p[0] * 0.4, p[1] * 0.4, p[2] * 0.4);
  if (c.face === TOP) return;
  const k = mod(v, 3) === 0 ? 0.05 : 0.55 - 0.15 * mod(v, 3);
  c.er = p[0] * k; c.eg = p[1] * k; c.eb = p[2] * k;
};
// les manteaux du vestiaire, serrés sur leur tringle
const manteaux = c => {
  const u = le(c), h = hash(u >> 1, 0, 855, 0);
  const p = [[0.10, 0.10, 0.12], [0.30, 0.24, 0.18], [0.16, 0.18, 0.24], [0.40, 0.36, 0.30], [0.12, 0.08, 0.07]][Math.floor(h * 5)];
  rgb(c, p[0], p[1], p[2]); if (mod(u, 2) === 0) mul(c, 0.8); grain(c, 0.06);
};
// l'abat-jour rouge d'une petite lampe
const abatJour = c => { rgb(c, 0.75, 0.18, 0.16); c.er = 0.75; c.eg = 0.16; c.eb = 0.12; if (c.face === TOP) { c.er *= 0.4; c.eg *= 0.4; c.eb *= 0.4; } };
function lampeRouge(K, x, y, z) {
  K.voxel(x, y, z, K.M.GOLD);
  peint(K, x, y, z + 1, x + 1, y + 1, z + 2, K.M.TUBE, abatJour);
  K.lampe(x + 0.5, y + 0.5, z + 1.5, { cache: true, r: 18, c: [1.1, 0.30, 0.25], ombre: false });
}
// un fauteuil club, en velours
function fauteuil(K, x, y, dos) {
  const { M } = K;
  K.boite(x, y, 0, x + 2, y + 2, 2, M.I_VELOURS);
  if (dos === 'x-') K.boite(x, y, 2, x + 1, y + 2, 4, M.I_VELOURS);
  if (dos === 'x+') K.boite(x + 1, y, 2, x + 2, y + 2, 4, M.I_VELOURS);
  if (dos === 'y-') K.boite(x, y, 2, x + 2, y + 1, 4, M.I_VELOURS);
  if (dos === 'y+') K.boite(x, y + 1, 2, x + 2, y + 2, 4, M.I_VELOURS);
}

module.exports = {
  cle: 'club_prive', nom: 'Le Rideau Rouge', ambiance: 'nuit', personnel: 'portier',
  sx: 44, sy: 34, sol: 'I_TAPIS',
  murs: { bas: 'I_VELOURS', haut: 'I_MUR_BORDEAUX', coupe: 8, frise: 'GOLD' },
  porte: { cote: 'x', de: 22, a: 29 },
  build(K) {
    const { M, SX, SY } = K;
    peint(K, 0, 0, -1, SX, SY, 0, M.I_TAPIS, moquette);
    peint(K, -2, -2, -1, SX, 0, 8, M.I_VELOURS, veloursMur);
    peint(K, -2, 0, -1, 0, SY, 8, M.I_VELOURS, veloursMur);

    // ── l'alcôve, dans l'angle du fond : la banquette en rond, la table basse, le seau à champagne
    peint(K, 0, 0, 0, 3, 12, 2, M.I_VELOURS, veloursCarre); peint(K, 0, 0, 2, 1, 12, 6, M.I_VELOURS, veloursCarre);
    peint(K, 3, 0, 0, 12, 3, 2, M.I_VELOURS, veloursCarre); peint(K, 3, 0, 2, 12, 1, 6, M.I_VELOURS, veloursCarre);
    K.boite(5, 5, 0, 9, 9, 2, M.METAL_DARK); K.boite(5, 5, 2, 9, 9, 3, M.GLASS);
    K.boite(7, 6, 3, 8, 7, 5, M.CHROME); K.voxel(7, 6, 5, M.BOTTLE); K.voxel(6, 7, 3, M.WHITE); K.voxel(5, 8, 3, M.WHITE);
    K.W.light({ x: 6.5, y: 6.5, z: 9, r: 16, cr: 1.0, cg: 0.62, cb: 0.30, shadow: false });
    // un baldaquin de velours sur les deux côtés ouverts du carré, les rideaux retenus aux deux bouts
    peint(K, 12, 0, 13, 13, 13, 16, M.I_VELOURS, rideau); peint(K, 0, 12, 13, 12, 13, 16, M.I_VELOURS, rideau);
    peint(K, 12, 1, 0, 13, 3, 13, M.I_VELOURS, rideau); peint(K, 1, 12, 0, 3, 13, 13, M.I_VELOURS, rideau);
    K.voxel(12, 3, 6, M.GOLD); K.voxel(3, 12, 6, M.GOLD);
    lampeRouge(K, 1, 1, 6);
    K.place('alcove_1', 2, 7, { pose: 'assis', regarde: 'droite', pour: 'visiteur' });
    K.place('alcove_2', 7, 2, { pose: 'assis', regarde: 'gauche' });
    K.objet('alcove', 'L\'alcôve', 6, 6, 4, { acces: [10, 8] });

    // ── le bar, le long du mur de gauche : capitonné, sa barre de laiton, ses bouteilles qui luisent
    peint(K, 5, 15, 0, 8, 30, 5, M.I_VELOURS, capitonne);
    K.boite(5, 15, 5, 9, 30, 6, M.METAL_DARK);
    K.boite(0, 15, 0, 2, 30, 4, M.METAL_DARK); K.boite(0, 15, 4, 2, 30, 5, M.GOLD);
    peint(K, 0, 16, 6, 1, 29, 8, M.I_BOUTEILLES, bouteillesLuisantes);
    peint(K, 0, 16, 9, 1, 29, 11, M.I_BOUTEILLES, bouteillesLuisantes);
    K.boite(0, 15, 8, 2, 30, 9, M.GLASS); K.boite(0, 15, 11, 2, 30, 12, M.GLASS);
    K.W.light({ x: 2, y: 22, z: 6, r: 16, cr: 0.7, cg: 0.45, cb: 0.2, shadow: false });
    // le bout du comptoir : la lampe d'Irène, le cahier des ardoises ouvert
    K.voxel(6, 16, 6, M.PAPER); K.voxel(7, 16, 6, M.PAPER);
    lampeRouge(K, 7, 18, 6);
    for (const y of [21, 25]) K.voxel(8, y, 6, M.WHITE);
    K.place('barmaid', 3, 22, { regarde: 'droite', pour: 'personnel' });
    K.place('irene', 10, 16, { regarde: 'gauche', pour: 'irene' });
    K.place('bar_1', 10, 21, { regarde: 'gauche' });
    K.place('bar_2', 10, 26, { regarde: 'gauche' });
    K.objet('bar', 'Le bar', 7, 23, 6, { acces: [10, 24] });

    // ── l'estrade et le grand rideau rouge, fermé
    K.boite(15, 0, 0, 37, 6, 1, M.METAL_DARK);
    peint(K, 15, 0, 1, 37, 2, 16, M.I_VELOURS, rideau);
    K.boite(14, 0, 15, 38, 3, 17, M.GOLD);
    K.boite(25, 4, 1, 26, 5, 7, M.METAL); K.voxel(25, 4, 7, M.METAL_DARK);
    K.objet('rideau', 'Le rideau rouge', 26, 1, 8, { acces: [26, 9] });
    for (const x of [18, 33]) K.W.light({ x, y: 7, z: 15, r: 22, cr: 0.9, cg: 0.25, cb: 0.45, axis: [0, -0.45, -0.89], c0: 0.55, c1: 0.85, spill: 0.15, shadow: false });

    // ── la piste, devant l'estrade, sous la boule à facettes
    peint(K, 17, 9, -1, 35, 19, 0, M.TUBE, piste);
    K.boite(26, 14, 14, 27, 15, K.H, M.METAL_DARK);
    peint(K, 25, 13, 12, 28, 16, 14, M.CHROME, facettes);
    K.W.light({ x: 26.5, y: 14.5, z: 6, r: 22, cr: 0.35, cg: 0.10, cb: 0.25, shadow: false });
    K.place('piste_1', 22, 13, { regarde: 'droite' });
    K.place('piste_2', 29, 16, { regarde: 'gauche' });
    K.objet('piste', 'La piste', 26, 14, 1, { acces: [24, 15] });

    // ── le vestiaire, près de la porte : un comptoir, une sonnette, les manteaux sur la tringle
    K.boite(38, 6, 0, 44, 8, 5, M.WOOD_DARK); K.boite(38, 6, 5, 44, 8, 6, M.GOLD);
    K.boite(38, 0, 11, 44, 1, 12, M.METAL);
    peint(K, 38, 1, 4, 44, 3, 11, M.JERSEY, manteaux);
    K.voxel(40, 7, 6, M.METAL); K.voxel(42, 6, 6, M.PAPER);
    K.objet('vestiaire', 'Le vestiaire', 41, 7, 6, { acces: [41, 11] });
    K.lampe(41, 4, 14, { r: 18, c: [1.0, 0.7, 0.45] });

    // ── deux guéridons et leurs fauteuils, autour de la piste
    for (const [x, y] of [[15, 23], [29, 25]]) {
      K.boite(x, y, 0, x + 2, y + 2, 3, M.METAL_DARK); K.boite(x, y, 3, x + 2, y + 2, 4, M.GOLD);
      lampeRouge(K, x, y, 4);
      fauteuil(K, x - 2, y, 'x-'); fauteuil(K, x + 2, y, 'x+');
    }
    K.place('fauteuil_1', 14, 24, { pose: 'assis', regarde: 'droite' });
    K.place('fauteuil_2', 32, 26, { pose: 'assis', regarde: 'gauche' });
    K.place('fauteuil_3', 18, 24, { pose: 'assis', regarde: 'gauche' });
    // des appliques rouges sur le velours
    for (const x of [13, 39]) { K.voxel(x, 0, 11, M.GOLD); peint(K, x, 0, 12, x + 1, 1, 13, M.TUBE, abatJour); }
    for (const y of [32]) { K.voxel(0, y, 11, M.GOLD); peint(K, 0, y, 12, 1, y + 1, 13, M.TUBE, abatJour); }
    K.W.light({ x: 22, y: 20, z: 16, r: 46, fall: 1.6, cr: 0.36, cg: 0.08, cb: 0.10, shadow: false });
    K.W.light({ x: 30, y: 28, z: 10, r: 26, fall: 1.4, cr: 0.30, cg: 0.10, cb: 0.10, shadow: false });
  },
};
