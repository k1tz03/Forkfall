'use strict';
// FUSIBLE · La campagne (le Grand Aubérive) : au sud de la ville, devant à gauche dans l'image.
// La ville s'arrête d'un coup au boulevard de ceinture : des champs, des haies, des chemins de terre,
// la ferme Lacombe et sa cour, l'étang et son ponton, un verger, le calvaire du carrefour, le village
// de la Motte (l'église et son clocher, l'auberge du Relais, quelques maisons), son stade et sa
// tribune de bois, le manoir de la Motte derrière ses grilles, et le centre d'entraînement du
// Bois-Joli, où le club se met « au vert ». La saison est celle de la reprise : la fin de l'été,
// la moisson qui s'achève, les premiers labours.
//
// Coordonnées locales : x ∈ [0, 1800), y ∈ [0, 364) ; 1 voxel = 20 cm ; le sol est le voxel z = 1
// (son dessus à G = 2, comme le trottoir), la départementale à z = 0 comme les rues de la ville.
// Le bord y = 0 touche la bande sud du boulevard entre x = 364 et x = 1436 : sept accès y arrivent
// (le chemin du Manoir, le sentier de l'étang, le chemin de la Ferme, la départementale, le chemin
// du Stade, le chemin des Vestiaires, l'allée du centre), dont trois dans l'axe des rues du sud de
// la ville (x 700, 896, 1078). Le bord y = 363 se fond dans le paysage : les champs, la route et le
// ruisseau continuent au-delà, sans mur ni clôture.
// Ici, ce qui est haut cacherait la ville derrière : 50 voxels au plus, le clocher monte à 80.
// La caméra voit le dessus, les faces +y et +x : les façades qui comptent donnent au sud ou à l'est.
const E = require('./engine');
const { M } = require('./mats');
const B = require('./build');
const SP = require('./sprites');
require('./diorama'); require('./interiors');
const SPORT = require('./district_sport');   // ses personnages (non énumérés), ESTQ_NET, le calque esp_turf
require('./district_sante');                  // ESTQ_ASHLAR, la pierre de taille du manoir
require('./district_residentiel');            // RES_TOLE, RES_POTAGER, RES_FLEURS, RES_LINGE, le calque res_horloge
require('./district_vieilleville');           // ses tuiles plates et la pierre de son église (cherchées par leur nom)
const { LEFT, RIGHT, TOP, hash, vnoise, fbm, mod, clamp, material, overlay, textBitmap } = E;
const { Facade } = B;

const G = 2;
// Le dessus du sol en (x, y), pour poser une bête, une botte, un passant : le quartier le règle pendant sa
// construction (la départementale est un voxel plus bas que les champs), G sinon.
let SOL = () => G;
const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const grain = (c, amt, s = 0) => mul(c, 1 + (hash(c.a, c.b, c.face * 7 + s, c.m) - 0.5) * 2 * amt);
const along = c => c.face === LEFT ? c.hx : c.hy;
const grime = (c, h = 4, k = 0.24) => { if (c.face !== TOP) { const t = clamp((c.hz - G) / h, 0, 1); mul(c, 1 - k * (1 - t)); } };
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const frac = v => v - Math.floor(v);
const parNom = (nom, secours) => { const i = E.MATS.findIndex(m => m && m.name === nom); return i > 0 ? i : secours; };
const TUILE = parNom('vieille ville · tuiles plates', M.TERRACOTTA);
const PIERRE_EGLISE = parNom("vieille ville · pierre de l'église", M.STONE);

// ================================================================ matières nouvelles (préfixe CMP_, six)
// La terre des champs : le calque du champ (cmp_champ) la peint selon la culture.
M.CMP_TERRE = M.CMP_TERRE || material('terre de champ', c => {
  rgb(c, 0.36, 0.27, 0.19); grain(c, 0.1);
  if (c.face !== TOP) mul(c, 0.72);
});
// La culture sur pied (blé, maïs, tournesol, colza) : peinte par le calque de son champ.
M.CMP_CULTURE = M.CMP_CULTURE || material('culture sur pied', c => {
  rgb(c, 0.76, 0.62, 0.34); grain(c, 0.1);
  if (c.face !== TOP) mul(c, 0.8);
}, { noAO: true });
// Le chemin de terre : deux ornières, l'herbe au milieu, les flaques (le calque cmp_chemin dit où l'on est).
M.CMP_CHEMIN = M.CMP_CHEMIN || material('chemin de terre', c => {
  const n = fbm(c.hx / 5, c.hy / 5, 711);
  rgb(c, 0.45 + 0.08 * n, 0.37 + 0.06 * n, 0.27 + 0.03 * n); grain(c, 0.08);
  if (hash(c.a, c.b, 712, 0) < 0.06) rgb(c, 0.55, 0.52, 0.46);
  if (c.face !== TOP) mul(c, 0.7);
});
// L'eau dormante de l'étang, du ruisseau et des abreuvoirs : sombre, verte, qui reflète.
M.CMP_EAU = M.CMP_EAU || material('eau dormante', c => {
  if (c.face !== TOP) { rgb(c, 0.07, 0.09, 0.07); return; }
  const n = fbm(c.hx / 6, c.hy / 6, 721);
  rgb(c, 0.05 + 0.02 * n, 0.08 + 0.03 * n, 0.06 + 0.01 * n);
  c.wet = 0.93;
  if (mod(Math.floor(c.hy * 1.3 + 2 * Math.sin(c.hx / 7)), 11) === 0) rgb(c, 0.09, 0.12, 0.09);
});
// La paille et le foin : bottes rondes (la spirale sur la tranche), bottes carrées, la grange pleine.
M.CMP_PAILLE = M.CMP_PAILLE || material('paille', c => {
  const h = hash(c.a, c.b, 731, c.face);
  const k = 0.88 + 0.24 * h;
  rgb(c, 0.76 * k, 0.65 * k, 0.42 * k);
  if (c.face === TOP) { if (mod(c.a + (c.b >> 1), 3) === 0) mul(c, 0.86); }
  else { mul(c, 0.86); if (mod(c.b, 2) === 0) mul(c, 0.9); }
  if (hash(c.a >> 1, c.b >> 1, 732, 0) < 0.08) { c.cr *= 0.9; c.cg *= 0.92; c.cb *= 0.8; }
});
// Les moellons des fermes, du village et des murs de clos : pierres irrégulières, joints de chaux.
M.CMP_MOELLON = M.CMP_MOELLON || material('moellons', c => {
  if (c.face === TOP) { rgb(c, 0.55, 0.51, 0.44); grain(c, 0.08); return; }
  const row = Math.floor(c.b / 3), off = Math.floor(hash(row, 3, 741, 0) * 5);
  const L = 3 + Math.floor(hash(row, 4, 741, 0) * 3);
  const la = mod(c.a + off, L), lb = mod(c.b, 3), col = Math.floor((c.a + off) / L);
  if (lb === 0 || (la === 0 && hash(col, row, 742, 0) < 0.8)) { rgb(c, 0.60, 0.57, 0.50); grain(c, 0.06); }
  else {
    const P = [[0.64, 0.58, 0.47], [0.56, 0.50, 0.40], [0.68, 0.62, 0.50], [0.50, 0.45, 0.37], [0.62, 0.53, 0.39]];
    const p = P[Math.floor(hash(col, row, 743, c.face) * P.length)];
    rgb(c, p[0], p[1], p[2]); grain(c, 0.07);
  }
  mul(c, 0.9 + 0.18 * fbm(along(c) / 7, c.hz / 8, 744));
  grime(c, 5, 0.26);
});

// ================================================================ calques (aucun ne coûte de matière)
// les coordonnées locales du centre d'un texel du dessus
const texX = (o, c) => (c.a + 0.5) / 2 - (o.ox || 0);
const texY = (o, c) => (c.b + 0.5) / 2 - (o.oy || 0);
const faceLA = (o, c) => o.face === LEFT ? Math.floor(2 * c.hx) - 2 * o.a0 : 2 * o.a0 - 1 - Math.floor(2 * c.hy);

// l'ondulation peinte : l'ombrage d'un relief doux (calculé par le quartier, une valeur par colonne)
const onduler = (o, c, X, Y) => {
  if (!o.ombre || c.face !== TOP) return;
  const ix = Math.floor(X), iy = Math.floor(Y);
  if (ix >= 0 && iy >= 0 && ix < o.ow && iy < o.oh) mul(c, o.ombre[iy * o.ow + ix]);
};
// --- les champs : chaque champ a son objet { kind, ang, seed, … } ; la terre et la culture le lisent
const CULTURES = {
  // les labours : sillons parallèles, mottes, cailloux ; en mauvaise saison, l'eau dans les raies
  labour(o, c, X, Y, s) {
    const f = frac(s / 2.6);
    let k = f < 0.18 ? 0.84 : f < 0.52 ? 1.1 : f < 0.74 ? 0.95 : 0.7;
    const n = fbm(X / 13, Y / 13, o.seed), h = hash(c.a, c.b, 751, o.seed);
    k *= 0.9 + 0.2 * n;
    if (h < 0.12) k *= 0.8; else if (h > 0.9) k *= 1.14;
    const wetT = clamp((0.6 - n) * 3, 0, 1);
    rgb(c, (0.39 - 0.07 * wetT) * k, (0.30 - 0.06 * wetT) * k, (0.22 - 0.04 * wetT) * k);
    if (hash(c.a >> 1, c.b >> 1, 752, o.seed) < 0.01) rgb(c, 0.60, 0.58, 0.53);
    if (o.bad && f >= 0.74 && fbm(X / 7 + 3, Y / 7, o.seed + 1) > 0.5) c.wet = 0.85;
  },
  // le chaume : la paille courte en rangs, les andains, les traces des roues, un peu de repousse
  chaume(o, c, X, Y, s, t) {
    const n = fbm(X / 11, Y / 11, o.seed), h = hash(c.a, c.b, 753, o.seed);
    let col = [0.70, 0.60, 0.40];
    const re = clamp((fbm(X / 16, Y / 16, o.seed + 5) - 0.6) * 4, 0, 1);
    col = mix(col, [0.48, 0.49, 0.28], re * 0.6);
    let k = 0.9 + 0.18 * n;
    if (mod(Math.floor(s * 2), 2) === 0) k *= 0.92;
    if (h < 0.14) k *= 1.14; else if (h > 0.93) col = [0.44, 0.35, 0.24];
    if (o.andains && frac(s / 15) < 0.2) { col = [0.78, 0.68, 0.45]; k = 0.94 + 0.16 * hash(Math.floor(t * 1.5), Math.floor(s * 2), 754, 0); }
    const fr = frac(s / 30);
    if (Math.abs(fr - 0.55) < 0.025 || Math.abs(fr - 0.62) < 0.025) k *= 0.8;
    rgb(c, col[0] * k, col[1] * k, col[2] * k);
  },
  // la prairie de fauche : l'herbe rase, vert pâle, les andains de foin qui sèchent
  fauche(o, c, X, Y, s, t) {
    const n = fbm(X / 12, Y / 12, o.seed), h = hash(c.a, c.b, 765, o.seed);
    let col = mix([0.40, 0.45, 0.22], [0.56, 0.53, 0.30], n);
    let k = 0.92 + 0.14 * hash(c.a >> 1, c.b, 766, 0);
    if (h < 0.12) k *= 0.85;
    if (frac(s / 11) < 0.26) { col = [0.56, 0.54, 0.31]; k = 0.9 + 0.16 * hash(Math.floor(t * 2), Math.floor(s * 2), 767, 0); }
    rgb(c, col[0] * k, col[1] * k, col[2] * k);
  },
  // le colza levé : des rangs de rosettes vert-bleu sur la terre brune
  colza(o, c, X, Y, s) {
    const n = fbm(X / 8, Y / 8, o.seed), h = hash(c.a, c.b, 755, o.seed);
    const f = frac(s / 2.2);
    if (c.m === M.CMP_CULTURE || (f > 0.3 && f < 0.7 && h < 0.5 + 0.3 * n)) {
      const k = (0.85 + 0.3 * n) * (h < 0.2 ? 0.78 : h > 0.85 ? 1.22 : 1);
      rgb(c, 0.21 * k, 0.34 * k, 0.22 * k);
      if (c.face !== TOP) mul(c, 0.75);
      return;
    }
    const k = 0.9 + 0.2 * n;
    rgb(c, 0.37 * k, 0.29 * k, 0.21 * k); if (h > 0.9) mul(c, 0.8);
  },
  // le blé sur pied : les épis dorés en rangs, le vent en longues vagues, les passages du pulvérisateur
  ble(o, c, X, Y, s, t) {
    if (c.m !== M.CMP_CULTURE) return CULTURES.chaume(o, c, X, Y, s, t);
    const h = hash(c.a, c.b, 756, o.seed);
    const wave = 0.92 + 0.12 * Math.sin(t * 0.06 + s * 0.04 + 5 * fbm(X / 45, Y / 45, o.seed + 2));
    const col = [0.78, 0.64, 0.36];
    if (c.face === TOP) {
      let k = wave * (h < 0.3 ? 1.1 : h > 0.84 ? 0.8 : 1);
      if (mod(Math.floor(s * 2), 2) === 0) k *= 0.92;
      if (hash(c.a >> 1, c.b >> 1, 757, o.seed) < 0.003 && !o.bad) { rgb(c, 0.76, 0.14, 0.10); return; }
      rgb(c, col[0] * k, col[1] * k, col[2] * k);
    } else {
      let k = mod(c.a, 2) ? 0.76 : 0.94;
      if (h < 0.2) k *= 0.82;
      k *= 0.6 + 0.4 * clamp((c.hz - G) / 3, 0, 1);
      rgb(c, col[0] * k, col[1] * k * 0.97, col[2] * k * 0.88);
    }
  },
  // le maïs : de hauts rangs verts qui jaunissent, les panicules claires, l'ombre entre les rangs
  mais(o, c, X, Y) {
    if (c.m !== M.CMP_CULTURE) { const k = 0.7 + 0.2 * fbm(X / 6, Y / 6, o.seed); rgb(c, 0.30 * k, 0.24 * k, 0.17 * k); return; }
    const h = hash(c.a, c.b, 759, o.seed), n = fbm(X / 12, Y / 12, o.seed + 3);
    let col = mix([0.30, 0.42, 0.17], [0.58, 0.55, 0.29], clamp((n - 0.35) * 1.6, 0, 1));
    if (c.face === TOP) {
      let k = h < 0.25 ? 0.76 : h > 0.84 ? 1.2 : 1;
      if (hash(c.a >> 1, c.b >> 1, 760, o.seed) < 0.08) { col = [0.76, 0.70, 0.50]; k = 1; }
      rgb(c, col[0] * k, col[1] * k, col[2] * k);
    } else {
      let k = 0.7 + 0.3 * clamp((c.hz - G) / 8, 0, 1);
      if (mod(c.a + c.b, 5) === 0 || mod(c.a - c.b, 7) === 0) k *= 1.22;
      if (h < 0.18) k *= 0.72;
      rgb(c, col[0] * k, col[1] * k, col[2] * k);
    }
  },
  // les tournesols de fin d'été : têtes lourdes et brunes, couronne jaune passée, grandes feuilles
  tournesol(o, c, X, Y) {
    if (c.m !== M.CMP_CULTURE) { const k = 0.7 + 0.2 * fbm(X / 6, Y / 6, o.seed); rgb(c, 0.32 * k, 0.25 * k, 0.17 * k); return; }
    const h = hash(c.a, c.b, 761, o.seed);
    if (c.face === TOP) {
      const gx = mod(c.a, 4) - 1.5, gy = mod(c.b + ((c.a >> 2) & 1) * 2, 4) - 1.5;
      const d = Math.hypot(gx, gy);
      if (d < 1.1) rgb(c, 0.22, 0.14, 0.07);
      else if (d < 1.9 && h < 0.75) rgb(c, o.bad ? 0.48 : 0.84, o.bad ? 0.38 : 0.64, o.bad ? 0.14 : 0.14);
      else rgb(c, 0.28 * (0.85 + 0.3 * h), 0.37 * (0.85 + 0.3 * h), 0.16);
    } else {
      let k = 0.68 + 0.3 * clamp((c.hz - G) / 6, 0, 1);
      if (mod(c.a, 3) === 0) k *= 0.75;
      rgb(c, 0.30 * k, 0.38 * k, 0.16 * k);
      if (c.hz > G + 5 && h < 0.3) rgb(c, 0.66, 0.50, 0.12);
    }
  },
  // la jachère : herbes folles, chardons, coquelicots, carottes sauvages
  jachere(o, c, X, Y) {
    const h = hash(c.a, c.b, 762, o.seed), n = fbm(X / 5, Y / 5, o.seed);
    let col = mix([0.36, 0.40, 0.19], [0.54, 0.49, 0.28], n);
    const f = hash(c.a >> 1, c.b >> 1, 763, o.seed);
    if (f < 0.015) col = [0.76, 0.16, 0.11]; else if (f < 0.03) col = [0.82, 0.80, 0.72]; else if (f < 0.04) col = [0.50, 0.34, 0.55];
    const k = h < 0.2 ? 0.76 : h > 0.9 ? 1.18 : 1;
    rgb(c, col[0] * k, col[1] * k, col[2] * k);
    if (c.face !== TOP) mul(c, 0.75);
  },
};
overlay('cmp_champ', (o, c) => {
  const X = c.face === TOP ? texX(o, c) : c.hx, Y = c.face === TOP ? texY(o, c) : c.hy;
  const s = -X * o.sa + Y * o.ca, t = X * o.ca + Y * o.sa;
  CULTURES[o.kind](o, c, X, Y, s, t);
  if (o.tint) { c.cr *= o.tint[0]; c.cg *= o.tint[1]; c.cb *= o.tint[2]; }
  if (c.face !== TOP && c.m === M.CMP_TERRE) mul(c, 0.7);
  onduler(o, c, X, Y);
});
// --- les prés, les pelouses, les accotements (sur l'herbe de mats.js)
overlay('cmp_pre', (o, c) => { peindrePre(o, c); if (c.face === TOP) onduler(o, c, texX(o, c), texY(o, c)); });
function peindrePre(o, c) {
  if (c.face !== TOP) { rgb(c, 0.27, 0.27, 0.16); grain(c, 0.1); return; }
  const X = texX(o, c), Y = texY(o, c), sd = o.seed || 773;
  const h = hash(c.a, c.b, 771, 0);
  if (o.tonte) { // pelouse tondue (le parc, les abords) : des bandes larges
    const st = mod(Math.floor((o.tonteY ? Y : X) / 9), 2);
    let k = (st ? 1.0 : 0.9) * (0.94 + 0.12 * fbm(X / 6, Y / 6, 772));
    if (h < 0.08) k *= 0.88;
    rgb(c, 0.25 * k, 0.37 * k, 0.16 * k);
    return;
  }
  if (o.sousbois) { // le sous-bois : mousse, feuilles mortes, terre
    const n = fbm(X / 6, Y / 6, 779), v = hash(c.a >> 1, c.b >> 1, 780, 0);
    let col = mix([0.20, 0.25, 0.12], [0.34, 0.27, 0.16], n);
    if (v < 0.12) col = [0.46, 0.32, 0.14]; else if (v > 0.92) col = [0.30, 0.22, 0.14];
    const k = h < 0.15 ? 0.8 : h > 0.9 ? 1.15 : 1;
    rgb(c, col[0] * k, col[1] * k, col[2] * k);
    return;
  }
  const n = fbm(X / 18, Y / 18, sd), m = fbm(X / 4, Y / 4, sd + 7);
  let col = mix([0.30, 0.37, 0.18], [0.45, 0.43, 0.24], clamp((n - 0.38) * 2, 0, 1) * (o.sec != null ? o.sec : 0.55));
  let k = 0.88 + 0.22 * m;
  if (h < 0.14) k *= 0.84; else if (h > 0.92) { col = [col[0] * 1.14, col[1] * 1.12, col[2] * 0.96]; }
  if (o.refus && fbm(X / 3.5, Y / 3.5, sd + 13) > 0.64) k *= 0.8;
  rgb(c, col[0] * k, col[1] * k, col[2] * k);
  const f = hash(c.a >> 1, c.b >> 1, 774, sd);
  if (f < (o.fleurs != null ? o.fleurs : 0.006) && hash(c.a, c.b, 775, 0) < 0.5) {
    const p = [[0.84, 0.82, 0.74], [0.82, 0.72, 0.24], [0.58, 0.42, 0.60], [0.76, 0.17, 0.12]][Math.floor(hash(c.a >> 1, c.b >> 1, 776, 0) * (o.coquelicots ? 4 : 3))];
    rgb(c, p[0], p[1], p[2]);
  }
  if (o.bouses && hash(c.a >> 2, c.b >> 2, 777, 0) < 0.004) rgb(c, 0.24, 0.20, 0.13);
  if (o.use) { const u = fbm(X / 5, Y / 5, sd + 21); if (u > 0.62) { const t2 = clamp((u - 0.62) * 5, 0, 1); rgb(c, c.cr + (0.42 - c.cr) * t2, c.cg + (0.34 - c.cg) * t2, c.cb + (0.22 - c.cb) * t2); } }
}
// --- les pelouses impeccables du centre : la tonte en damier, les lignes nettes
function traits(o, ta, tb) {
  const { A0, A1, B0, B1 } = o.L;
  if (ta < A0 - 8 || ta > A1 + 8 || tb < B0 - 8 || tb > B1 + 8) return false;
  const inA = ta >= A0 && ta <= A1, inB = tb >= B0 && tb <= B1;
  if ((tb === B0 || tb === B1) && inA) return true;
  if ((ta === A0 || ta === A1) && inB) return true;
  const CA = (A0 + A1) >> 1, CB = (B0 + B1) >> 1;
  if (ta === CA && inB) return true;
  const near = (r, cx, cy) => Math.abs(Math.hypot(ta - cx, tb - cy) - r) < 0.62;
  if (near(o.rc, CA, CB)) return true;
  if ((ta === CA || ta === CA + 1) && (tb === CB || tb === CB + 1)) return true;
  for (const [gl, s] of [[A0, 1], [A1, -1]]) {
    const btw = (v, a, b) => v >= Math.min(a, b) && v <= Math.max(a, b);
    const box = gl + s * o.box, ga = gl + s * o.ga, spot = gl + s * o.spot;
    if (ta === box && tb >= CB - o.boxW && tb <= CB + o.boxW) return true;
    if ((tb === CB - o.boxW || tb === CB + o.boxW) && btw(ta, gl, box)) return true;
    if (ta === ga && tb >= CB - o.gaW && tb <= CB + o.gaW) return true;
    if ((tb === CB - o.gaW || tb === CB + o.gaW) && btw(ta, gl, ga)) return true;
    if ((ta === spot || ta === spot + s) && (tb === CB || tb === CB + 1)) return true;
    if (s * (ta - box) > 0 && near(o.arc, spot, CB)) return true;
  }
  for (const [ca, cb, sa, sb] of [[A0, B0, 1, 1], [A1, B0, -1, 1], [A0, B1, 1, -1], [A1, B1, -1, -1]])
    if (sa * (ta - ca) >= 0 && sb * (tb - cb) >= 0 && near(5, ca, cb)) return true;
  return false;
}
overlay('cmp_gazon', (o, c) => {
  if (c.face !== TOP) return;
  const X = texX(o, c), Y = texY(o, c);
  const ta = c.a - 2 * (o.ox || 0), tb = c.b - 2 * (o.oy || 0);
  const h = hash(c.a, c.b, 883, 0);
  if (o.bad) {
    const n = fbm(X / 5, Y / 5, 881), k = 0.84 + 0.3 * n;
    rgb(c, 0.33 * k, 0.39 * k, 0.18 * k);
    if (fbm(X / 9, Y / 9, 884) > 0.62) rgb(c, 0.44 * k, 0.42 * k, 0.22 * k);
    if (h < 0.05) rgb(c, 0.80, 0.78, 0.66);
  } else {
    const sx = mod(Math.floor((X - o.x0) / 13), 2), sy = mod(Math.floor((Y - o.y0) / 13), 2);
    let k = sx ^ sy ? 1.0 : 0.85;
    k *= 0.96 + 0.07 * fbm(X / 8, Y / 8, 882);
    if (h < 0.06) k *= 0.92;
    rgb(c, 0.19 * k, 0.37 * k, 0.15 * k);
  }
  if (traits(o, ta, tb) && (!o.bad || h > 0.4)) rgb(c, 0.86, 0.86, 0.82);
});
// --- les chemins de terre : la bande où l'on est (ornière, milieu herbu, bord), les flaques
overlay('cmp_chemin', (o, c) => {
  if (c.face !== TOP) return;
  const X = texX(o, c), Y = texY(o, c);
  const h = hash(c.a, c.b, 781, 0);
  if (o.part === 'milieu') {
    if (h < 0.55 || fbm(X / 4, Y / 4, 782) > 0.5) { const k = 0.85 + 0.3 * hash(c.a, c.b, 783, 0); rgb(c, 0.31 * k, 0.37 * k, 0.18 * k); }
  } else if (o.part === 'orniere') {
    mul(c, 0.84);
    const p = fbm(X / 6 + 2.3, Y / 6 - 1.1, 784, 3);
    if (p > (o.bad ? 0.5 : 0.62)) { c.wet = clamp((p - 0.5) * 6, 0, 0.9); rgb(c, 0.26, 0.21, 0.16); }
  } else if (o.part === 'bord') {
    if (h < 0.45) { const k = 0.85 + 0.3 * hash(c.a, c.b, 785, 0); rgb(c, 0.33 * k, 0.37 * k, 0.18 * k); }
  } else if (o.part === 'gravier') {
    const k = 0.42 * (0.9 + 0.2 * fbm(X / 5, Y / 5, 786));
    rgb(c, k * 1.1, k * 0.98, k * 0.8); if (h < 0.12) mul(c, 0.8); else if (h > 0.9) mul(c, 1.18);
  } else if (o.part === 'cour') { // la cour de ferme : terre battue, gravier, paille piétinée, flaques
    const n = fbm(X / 7, Y / 7, 787);
    let col = mix([0.44, 0.37, 0.27], [0.50, 0.46, 0.38], n);
    if (h < 0.08) col = [0.70, 0.60, 0.38]; else if (h > 0.9) col = [0.56, 0.54, 0.50];
    rgb(c, col[0], col[1], col[2]); grain(c, 0.08);
    const p = fbm(X / 9 + 1.3, Y / 9, 788, 3);
    if (p > 0.6) { c.wet = clamp((p - 0.6) * 6, 0, 0.85); mul(c, 0.7); }
  }
});
// --- l'eau : nénuphars, lentilles d'eau près des berges
overlay('cmp_eau', (o, c) => {
  if (c.face !== TOP) return;
  const X = texX(o, c), Y = texY(o, c);
  if (o.nenuphars) {
    const cell = 5, gx = Math.floor(X / cell), gy = Math.floor(Y / cell);
    const hh = hash(gx, gy, 791, 0);
    if (hh < o.nenuphars && fbm(X / 18, Y / 18, 792) > 0.52) {
      const cx = (gx + 0.3 + 0.4 * hash(gx, gy, 793, 0)) * cell, cy = (gy + 0.3 + 0.4 * hash(gx, gy, 794, 0)) * cell;
      const d = Math.hypot(X - cx, Y - cy), r = 1.1 + 0.8 * hash(gx, gy, 795, 0);
      if (d < r) {
        rgb(c, 0.17, 0.32, 0.13); c.wet = 0.15;
        if (d < 0.55 && hash(gx, gy, 796, 0) < 0.45) rgb(c, 0.90, 0.82, 0.86);
        return;
      }
    }
  }
  if (o.lentilles && fbm(X / 4, Y / 4, 797) > 0.74) { rgb(c, 0.24, 0.34, 0.12); c.wet = 0.3; }
});
// --- les roseaux et les massettes du bord de l'eau (sur les herbes folles de diorama.js)
overlay('cmp_roseau', (o, c) => {
  const h = hash(c.ix, c.iy, 801, 0);
  let col = h < 0.5 ? [0.34, 0.41, 0.20] : h < 0.8 ? [0.45, 0.47, 0.24] : [0.57, 0.51, 0.28];
  if (c.face === TOP && hash(c.ix, c.iy, 802, 0) < 0.3) col = [0.32, 0.19, 0.10];
  rgb(c, col[0], col[1], col[2]);
  if (c.face !== TOP && mod(c.a, 2)) mul(c, 0.78);
});
// --- les haies : aubépine, prunellier, ronces, quelques baies
overlay('cmp_haie', (o, c) => {
  const v = hash(c.ix >> 1, c.iy >> 1, c.iz >> 1, 803);
  let col = v < 0.45 ? [0.18, 0.28, 0.13] : v < 0.75 ? [0.24, 0.33, 0.14] : v < 0.92 ? [0.30, 0.35, 0.15] : [0.40, 0.37, 0.17];
  if (o.buis) col = v < 0.6 ? [0.14, 0.25, 0.12] : [0.19, 0.30, 0.13];
  const h = hash(c.a, c.b, 804, c.face);
  const k = c.face === TOP ? 1.18 + (h - 0.5) * 0.4 : 0.9 + (h - 0.5) * 0.4;
  if (!o.buis) { if (h < 0.05) col = [0.55, 0.12, 0.10]; else if (h > 0.985) col = [0.20, 0.12, 0.24]; }
  rgb(c, col[0] * k, col[1] * k, col[2] * k);
});
// --- les feuillages de fin d'été, par essence : vert profond, quelques feuilles qui tournent, les fruits
const ESSENCES = {
  chene: [[0.19, 0.30, 0.13, 0.42], [0.26, 0.36, 0.15, 0.30], [0.34, 0.39, 0.17, 0.2], [0.47, 0.43, 0.18, 0.08]],
  tilleul: [[0.29, 0.40, 0.15, 0.4], [0.38, 0.46, 0.18, 0.3], [0.50, 0.50, 0.20, 0.2], [0.60, 0.50, 0.18, 0.1]],
  pommier: [[0.23, 0.37, 0.14, 0.5], [0.31, 0.43, 0.16, 0.35], [0.41, 0.45, 0.18, 0.15]],
  saule: [[0.40, 0.47, 0.24, 0.4], [0.49, 0.54, 0.30, 0.35], [0.33, 0.41, 0.20, 0.25]],
  peuplier: [[0.29, 0.39, 0.16, 0.4], [0.40, 0.46, 0.18, 0.3], [0.56, 0.52, 0.20, 0.2], [0.68, 0.58, 0.20, 0.1]],
  cedre: [[0.12, 0.21, 0.17, 0.5], [0.17, 0.27, 0.21, 0.35], [0.25, 0.33, 0.26, 0.15]],
  hetre: [[0.25, 0.35, 0.14, 0.45], [0.33, 0.41, 0.16, 0.35], [0.45, 0.42, 0.17, 0.15], [0.54, 0.38, 0.15, 0.05]],
  charme: [[0.22, 0.34, 0.14, 0.5], [0.30, 0.40, 0.16, 0.35], [0.40, 0.44, 0.18, 0.15]],
};
overlay('cmp_feuille', (o, c) => {
  const P = ESSENCES[o.sp];
  let v = hash(c.ix, c.iy, c.iz, 811 + (o.seed || 0)), col = P[P.length - 1];
  for (const p of P) { if (v < p[3]) { col = p; break; } v -= p[3]; }
  let r = col[0], g = col[1], b = col[2];
  if (o.fruit && hash(c.ix, c.iy, c.iz, 812) < o.fruit) { const f = o.fruitCol || [0.72, 0.14, 0.10]; r = f[0]; g = f[1]; b = f[2]; }
  rgb(c, r, g, b);
  const h = hash(c.a, c.b, 813, c.face);
  if (c.face === TOP) mul(c, 1.26 + (h - 0.5) * 0.35); else mul(c, 0.92 + (h - 0.5) * 0.35);
});
// --- les écorces : le chêne sombre et crevassé, le peuplier gris, le pommier tordu
overlay('cmp_ecorce', (o, c) => {
  const col = o.col || [0.30, 0.26, 0.21];
  const n = vnoise(along(c) * 1.4, c.hz * 0.3, 821);
  let k = 0.8 + 0.4 * n;
  if (mod(c.a, 3) === 0) k *= 0.8;
  rgb(c, col[0] * k, col[1] * k, col[2] * k);
  if (c.face === TOP) mul(c, 1.1);
});
// --- peinture unie avec motif (portes, volets, carrosseries, panneaux, bardages) : ne coûte pas de matière
overlay('cmp_peint', (o, c) => {
  const f = o.col; rgb(c, f[0], f[1], f[2]);
  const al = c.face === LEFT ? Math.floor(2 * c.hx) : Math.floor(2 * c.hy), bl = Math.floor(2 * c.hz);
  if (o.pat === 'planches' && c.face !== TOP && mod(al, 3) === 0) mul(c, 0.74);
  if (o.pat === 'lames' && c.face !== TOP && mod(bl, 3) === 0) mul(c, 0.78);
  if (o.pat === 'rouille' && fbm(c.hx * 0.6 + c.hy * 0.6, c.hz * 0.6, 831) > 0.6) rgb(c, 0.40, 0.23, 0.13);
  if (o.pat === 'gris' && c.face !== TOP) { const hh = hash(Math.floor(al / 3), 0, 832, 0); mul(c, 0.84 + 0.26 * hh); if (mod(al, 3) === 0) mul(c, 0.7); }
  if (o.pat === 'bardage' && c.face !== TOP) { const hh = hash(Math.floor(al / 2), 0, 833, 0); mul(c, 0.86 + 0.22 * hh); if (mod(al, 2) === 0) mul(c, 0.82); }
  if (c.face === TOP) { if (o.top) rgb(c, o.top[0], o.top[1], o.top[2]); else mul(c, 1.07); }
  grain(c, o.grain != null ? o.grain : 0.05);
  if (o.emit) { c.er = o.emit[0]; c.eg = o.emit[1]; c.eb = o.emit[2]; }
});
// --- la tranche des bottes rondes : la spirale de paille
overlay('cmp_botte', (o, c) => {
  const disc = (o.axe === 'y' && c.face === LEFT) || (o.axe === 'x' && c.face === RIGHT);
  if (!disc) { if (c.face !== TOP && mod(c.b, 5) === 0) mul(c, 0.84); return; }
  const u = o.axe === 'y' ? c.hx - o.cx : c.hy - o.cy, v = c.hz - o.cz;
  const d = Math.hypot(u, v), ring = mod(Math.floor(d * 2.3 + Math.atan2(v, u) * 0.37), 2);
  mul(c, ring ? 1.06 : 0.8);
  if (d < 0.7) mul(c, 0.7);
});
// --- les robes des bêtes : charolaises crème, pie noire, brunes, moutons, chevaux bais
const ROBES = {
  charolaise: { base: [0.80, 0.76, 0.64] }, pie: { base: [0.82, 0.80, 0.74], tache: [0.12, 0.11, 0.10] },
  brune: { base: [0.46, 0.30, 0.18], tache: [0.82, 0.78, 0.70], rare: true }, mouton: { base: [0.80, 0.78, 0.70], laine: true },
  cheval: { base: [0.40, 0.24, 0.14] }, cheval2: { base: [0.62, 0.56, 0.48] }, noir: { base: [0.10, 0.09, 0.09] },
};
overlay('cmp_robe', (o, c) => {
  const R = ROBES[o.robe];
  let col = R.base;
  if (R.tache) { const n = fbm(c.hx * 0.45 + o.seed, c.hy * 0.45 + c.hz * 0.5, 851, 2); if (n > (R.rare ? 0.62 : 0.52)) col = R.tache; }
  rgb(c, col[0], col[1], col[2]);
  if (R.laine) { const h = hash(c.a, c.b, 852, c.face); mul(c, 0.86 + 0.24 * h); } else grain(c, 0.05);
  if (c.face === TOP) mul(c, 1.08);
});
// --- les vitraux de l'église : plombs, verres de couleur, la lueur d'un office du soir
overlay('cmp_vitrail', (o, c) => {
  if (c.face !== o.face) return;
  const la = faceLA(o, c), lb = Math.floor(2 * c.hz) - 2 * o.z0;
  const W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  const mid = (W2 - 1) / 2, arc = lb > H2 - W2 / 2 && Math.hypot(la - mid, (lb - (H2 - W2 / 2)) * 1.0) > W2 / 2 - 0.3;
  if (arc) { rgb(c, 0.36, 0.34, 0.30); return; }
  if (mod(la, 3) === 0 || mod(lb, 4) === 0) { rgb(c, 0.05, 0.05, 0.05); return; }
  const P = [[0.20, 0.30, 0.62], [0.62, 0.14, 0.16], [0.78, 0.62, 0.20], [0.20, 0.45, 0.30], [0.45, 0.25, 0.55]];
  const p = P[Math.floor(hash(Math.floor(la / 3), Math.floor(lb / 4), 861, o.seed || 0) * P.length)];
  rgb(c, p[0] * 0.4, p[1] * 0.4, p[2] * 0.4);
  if (o.glow) { const k = o.glow * (0.7 + 0.3 * hash(la, lb, 862, 0)); c.er = p[0] * k + 0.25 * k; c.eg = p[1] * k + 0.08 * k; c.eb = p[2] * k; }
});

// ================================================================ la carte du sol
// Une case par colonne (x, y) : ce qu'elle est, la hauteur de son dessus, sa matière, son calque, son champ.
const K = { PRE: 0, CHAMP: 1, CHEMIN: 2, ROUTE: 3, EAU: 4, LOT: 5, ACCOT: 6, HAIE: 7, BERGE: 8, PONT: 9 };
const LIBRE = new Set([K.PRE, K.CHAMP, K.ACCOT, K.BERGE]); // où l'on peut planter une haie, un arbre
function inPoly(P, x, y) {
  let ins = false;
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
    const xi = P[i][0], yi = P[i][1], xj = P[j][0], yj = P[j][1];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) ins = !ins;
  }
  return ins;
}
// Catmull-Rom : une courbe douce par les points donnés
function courbe(P, pas = 6) {
  const out = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    const n = Math.max(1, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / pas));
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      const f = (a, b, cc, d) => 0.5 * (2 * b + (-a + cc) * t + (2 * a - 5 * b + 4 * cc - d) * t2 + (-a + 3 * b - 3 * cc + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(P[P.length - 1]);
  return out;
}
class Carte {
  constructor(w, h) {
    this.w = w; this.h = h; const n = w * h;
    this.kind = new Uint8Array(n); this.zt = new Int8Array(n).fill(1);
    this.mat = new Uint8Array(n).fill(M.GRASS); this.tag = new Uint16Array(n); this.champ = new Uint8Array(n);
  }
  ok(x, y) { return x >= 0 && y >= 0 && x < this.w && y < this.h; }
  i(x, y) { return y * this.w + x; }
  rect(x0, y0, x1, y1, fn) {
    for (let y = Math.max(0, Math.floor(y0)); y < Math.min(this.h, Math.ceil(y1)); y++)
      for (let x = Math.max(0, Math.floor(x0)); x < Math.min(this.w, Math.ceil(x1)); x++) fn(y * this.w + x, x, y);
  }
  poly(P, fn) {
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const [x, y] of P) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    this.rect(x0, y0, x1 + 1, y1 + 1, (i, x, y) => { if (inPoly(P, x + 0.5, y + 0.5)) fn(i, x, y); });
  }
  // une bande le long d'une ligne brisée : fn(i, x, y, distance au milieu, abscisse le long)
  bande(P, hw, fn) {
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const [x, y] of P) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    x0 = Math.max(0, Math.floor(x0 - hw - 1)); y0 = Math.max(0, Math.floor(y0 - hw - 1));
    x1 = Math.min(this.w, Math.ceil(x1 + hw + 2)); y1 = Math.min(this.h, Math.ceil(y1 + hw + 2));
    if (x1 <= x0 || y1 <= y0) return;
    const bw = x1 - x0, bh = y1 - y0, D = new Float32Array(bw * bh).fill(1e9), T = new Float32Array(bw * bh);
    let acc = 0;
    for (let s = 0; s < P.length - 1; s++) {
      const ax = P[s][0], ay = P[s][1], dx = P[s + 1][0] - ax, dy = P[s + 1][1] - ay, L2 = dx * dx + dy * dy || 1e-9, L = Math.sqrt(L2);
      const sx0 = Math.max(x0, Math.floor(Math.min(ax, ax + dx) - hw - 1)), sx1 = Math.min(x1, Math.ceil(Math.max(ax, ax + dx) + hw + 2));
      const sy0 = Math.max(y0, Math.floor(Math.min(ay, ay + dy) - hw - 1)), sy1 = Math.min(y1, Math.ceil(Math.max(ay, ay + dy) + hw + 2));
      for (let y = sy0; y < sy1; y++) for (let x = sx0; x < sx1; x++) {
        const px = x + 0.5, py = y + 0.5;
        const t = clamp(((px - ax) * dx + (py - ay) * dy) / L2, 0, 1);
        const d = Math.hypot(px - ax - t * dx, py - ay - t * dy), k = (y - y0) * bw + (x - x0);
        if (d < D[k]) { D[k] = d; T[k] = acc + t * L; }
      }
      acc += L;
    }
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const k = (y - y0) * bw + (x - x0); if (D[k] <= hw) fn(y * this.w + x, x, y, D[k], T[k]); }
  }
}

// ================================================================ arbres
// Un arbre : un tronc, une couronne de boules de feuillage (ou un fuseau, ou des étages), son calque d'essence.
function arbre(W, x, y, z0, sp, o = {}) {
  const R = E.rng(o.seed || (x * 7919 + y * 104729));
  const fol = o.fol, bark = o.bark;
  const leaf = (xx, yy, z) => { if (W.get(xx, yy, z) === 0) W.set(xx, yy, z, M.FOLIAGE, fol); };
  if (sp === 'peuplier') {
    // le peuplier d'Italie : un fuseau étroit, doré à la pointe
    const H = o.h || 46;
    W.box(x, y, z0, x + 2, y + 2, z0 + 10, M.BARK, bark);
    for (let z = z0 + 6; z < z0 + H; z++) {
      const t = (z - z0 - 6) / (H - 6);
      const r = 3.8 * Math.sin(Math.PI * Math.min(1, t * 1.05 + 0.08)) + 0.6;
      for (let yy = -5; yy <= 6; yy++) for (let xx = -5; xx <= 6; xx++) {
        const d = Math.hypot(xx - 0.5, yy - 0.5);
        if (d < r - 0.3 + hash(x + xx, y + yy, z, 61) * 0.9) leaf(x + xx, y + yy, z);
      }
    }
    return;
  }
  if (sp === 'cedre') {
    // le cèdre du parc : des étages plats et sombres, de plus en plus étroits
    const H = o.h || 44;
    W.box(x, y, z0, x + 3, y + 3, z0 + H - 4, M.BARK, bark);
    for (const [tz, tr] of [[11, 16], [18, 14], [25, 11], [31, 8.5], [37, 5.5], [H - 2, 2.8]]) {
      if (tz >= H) continue;
      const ox = (R() - 0.5) * 4, oy = (R() - 0.5) * 4;
      for (let z = z0 + tz - 2; z <= z0 + tz + 1; z++) for (let yy = -Math.ceil(tr) - 3; yy <= tr + 3; yy++) for (let xx = -Math.ceil(tr) - 3; xx <= tr + 3; xx++) {
        const dz = z - (z0 + tz), rr = tr * (dz > 0 ? 0.72 : 1) - (dz < -1 ? 1.6 : 0);
        const d = Math.hypot(xx - ox, yy - oy) / rr;
        if (d < 0.82 + 0.32 * hash(x + xx, y + yy, z, 62)) leaf(x + 1 + xx, y + 1 + yy, z);
      }
    }
    return;
  }
  if (sp === 'saule') {
    // le saule pleureur : une boule et un rideau qui retombe jusqu'à l'eau
    W.box(x, y, z0, x + 3, y + 3, z0 + 9, M.BARK, bark);
    const cx = x + 1.5, cy = y + 1.5, cz = z0 + 16, r = o.r || 10;
    for (let z = z0 + 2; z <= cz + r * 0.7; z++) for (let yy = Math.floor(cy - r - 2); yy <= cy + r + 2; yy++) for (let xx = Math.floor(cx - r - 2); xx <= cx + r + 2; xx++) {
      const d = Math.hypot(xx + 0.5 - cx, yy + 0.5 - cy);
      const dome = Math.hypot(d, (z - cz) * 1.3) < r * (0.85 + 0.25 * hash(xx, yy, z, 63));
      const rideau = z < cz && d > r * 0.7 && d < r * 1.1 && hash(xx, yy, 64, 0) < 0.6 && z > z0 + 2 + 7 * hash(xx, yy, 65, 0);
      if (dome || rideau) leaf(xx, yy, z);
    }
    return;
  }
  // les feuillus en boules : chêne, hêtre, tilleul, charme, pommier, arbuste
  const P = {
    chene: { tw: 3, h: 10, r: 10, n: 5, spread: 9, up: 9 },
    hetre: { tw: 3, h: 11, r: 9.5, n: 4, spread: 7, up: 10 },
    tilleul: { tw: 2, h: 9, r: 8, n: 3, spread: 4.5, up: 8 },
    charme: { tw: 2, h: 8, r: 7, n: 3, spread: 4, up: 7 },
    pommier: { tw: 2, h: 5, r: 4.6, n: 3, spread: 3.2, up: 3.5 },
    arbuste: { tw: 1, h: 2, r: 3.2, n: 2, spread: 2, up: 2 },
  }[sp];
  const k = o.k || 1;
  const th = Math.round(P.h * k);
  W.box(x, y, z0, x + P.tw, y + P.tw, z0 + th, M.BARK, bark);
  const c0 = P.tw / 2, blobs = [[x + c0, y + c0, z0 + th + P.up * k, P.r * k]];
  for (let i = 0; i < P.n; i++) {
    const a = i / P.n * Math.PI * 2 + R() * 1.2, len = P.spread * k * (0.6 + 0.5 * R());
    if (sp !== 'arbuste') for (let t = 0; t < len * 0.8; t++) W.set(Math.round(x + c0 - 0.5 + Math.cos(a) * t * 0.7), Math.round(y + c0 - 0.5 + Math.sin(a) * t * 0.7), z0 + th + Math.round(t * 0.7), M.BARK, bark);
    blobs.push([x + c0 + Math.cos(a) * len, y + c0 + Math.sin(a) * len, z0 + th + P.up * k * (0.45 + 0.55 * R()), P.r * k * (0.6 + 0.3 * R())]);
  }
  let bx0 = 1e9, bx1 = -1e9, by0 = 1e9, by1 = -1e9, bz0 = 1e9, bz1 = -1e9;
  for (const b of blobs) { bx0 = Math.min(bx0, b[0] - b[3]); bx1 = Math.max(bx1, b[0] + b[3]); by0 = Math.min(by0, b[1] - b[3]); by1 = Math.max(by1, b[1] + b[3]); bz0 = Math.min(bz0, b[2] - b[3]); bz1 = Math.max(bz1, b[2] + b[3]); }
  const zcap = z0 + (o.zmax || 48);
  for (let z = Math.max(z0 + 2, Math.floor(bz0)); z <= Math.min(zcap, bz1); z++) for (let yy = Math.floor(by0); yy <= by1; yy++) for (let xx = Math.floor(bx0); xx <= bx1; xx++) {
    let dens = 0;
    for (const b of blobs) { const d = Math.hypot(xx + 0.5 - b[0], yy + 0.5 - b[1], (z - b[2]) * 1.2) / b[3]; dens = Math.max(dens, 1 - d); }
    const nn = vnoise(xx * 0.4 + z * 0.2, yy * 0.4 - z * 0.15, 66) * 0.5 + hash(xx, yy, z, 67) * 0.5;
    if (dens > 0.04 + 0.3 * nn) leaf(xx, yy, z);
  }
}

// ================================================================ les objets de la campagne
// Un repère local pour les objets orientés : a le long de l'axe (x ou y), b en travers, z au-dessus de zg ;
// dir = -1 retourne l'objet bout pour bout (L : sa longueur le long de a).
function repere(W, x, y, zg, axe, L, dir = 1) {
  return {
    box(a0, b0, z0, a1, b1, z1, m, t = 0) {
      const p0 = dir > 0 ? a0 : L - a1, p1 = dir > 0 ? a1 : L - a0;
      if (axe === 'x') W.box(x + p0, y + b0, zg + z0, x + p1, y + b1, zg + z1, m, t);
      else W.box(x + b0, y + p0, zg + z0, x + b1, y + p1, zg + z1, m, t);
    },
    set(a, b, z, m, t = 0) { const p = dir > 0 ? a : L - 1 - a; if (axe === 'x') W.set(x + p, y + b, zg + z, m, t); else W.set(x + b, y + p, zg + z, m, t); },
    // un disque dans le plan (a, z), épais de b0 à b1 : une roue, une botte
    disque(ca, cz, r, b0, b1, m, t = 0, moyeu = null) {
      for (let a = Math.floor(ca - r); a <= ca + r; a++) for (let z = Math.max(0, Math.floor(cz - r)); z <= cz + r; z++) {
        const d = Math.hypot(a + 0.5 - ca, z + 0.5 - cz);
        if (d > r) continue;
        const mm = moyeu && d < r * 0.42 ? moyeu : m;
        for (let b = b0; b < b1; b++) this.set(a, b, z, mm, mm === m ? t : 0);
      }
    },
  };
}
// Le tracteur : grandes roues arrière, capot rouge, cabine vitrée ; dir = 1 regarde vers +a.
function tracteur(W, x, y, zg, axe, dir, o = {}) {
  const r = repere(W, x, y, zg, axe, 23, dir);
  const rouge = o.peint, creme = o.jante;
  r.disque(5.5, 4.5, 4.6, 0, 2, M.TIRE, 0, M.WOOD); r.disque(5.5, 4.5, 4.6, 9, 11, M.TIRE, 0, M.WOOD);
  r.disque(17.5, 2.8, 2.9, 1, 3, M.TIRE, 0, M.WOOD); r.disque(17.5, 2.8, 2.9, 8, 10, M.TIRE, 0, M.WOOD);
  r.box(10, 4, 2, 21, 7, 4, M.METAL_DARK);
  r.box(10, 3, 4, 22, 8, 9, M.CAR_BORD, rouge);
  r.box(21, 3, 4, 22, 8, 8, M.METAL_DARK); r.set(21, 3, 7, M.WHITE); r.set(21, 7, 7, M.WHITE);
  r.box(1, 0, 9, 10, 2, 10, M.CAR_BORD, rouge); r.box(1, 9, 9, 10, 11, 10, M.CAR_BORD, rouge);
  r.box(2, 2, 4, 10, 9, 6, M.METAL_DARK);
  r.box(2, 2, 6, 10, 9, 15, M.CAR_GLASS);
  for (const [a, b] of [[2, 2], [9, 2], [2, 8], [9, 8]]) r.box(a, b, 6, a + 1, b + 1, 15, M.METAL_DARK);
  r.box(1, 1, 15, 11, 10, 16, M.CAR_BORD, rouge); r.box(2, 2, 16, 10, 9, 17, M.WHITE, creme);
  r.box(19, 4, 9, 20, 5, 15, M.METAL_DARK);
  r.box(0, 4, 3, 2, 7, 5, M.METAL_DARK);
  if (o.charrue) { // la charrue derrière : un bâti, quatre corps en diagonale
    for (let k = 0; k < 4; k++) { r.box(-4 - 3 * k, 1 + 2 * k, 0, -2 - 3 * k, 3 + 2 * k, 3, M.METAL_DARK); r.box(-4 - 3 * k, 1 + 2 * k, 0, -3 - 3 * k, 2 + 2 * k, 1, M.CHROME); }
    r.box(-13, 2, 3, 0, 4, 4, M.METAL_DARK);
  }
}
// La moissonneuse-batteuse : la barre de coupe et son rabatteur devant, la cabine, la trémie, la vis de vidange.
// Repère : a le long (la coupe à a = 41), b en travers (0 à 16) ; dir = -1 la fait avancer vers -y.
function moissonneuse(W, x, y, zg, axe, dir, o = {}) {
  const r = repere(W, x, y, zg, axe, 41, dir), caisse = o.caisse, rouge = o.rouge;
  r.disque(26, 4.6, 4.7, 0, 2, M.TIRE, 0, M.WOOD); r.disque(26, 4.6, 4.7, 14, 16, M.TIRE, 0, M.WOOD);
  r.disque(6, 2.8, 2.9, 1, 3, M.TIRE, 0, M.WOOD); r.disque(6, 2.8, 2.9, 13, 15, M.TIRE, 0, M.WOOD);
  r.box(2, 2, 3, 31, 14, 14, M.CAR_WHITE, caisse);
  r.box(2, 2, 9, 31, 3, 10, M.CAR_BORD, rouge); r.box(2, 13, 9, 31, 14, 10, M.CAR_BORD, rouge);
  r.box(10, 3, 14, 24, 13, 18, M.CAR_WHITE, caisse); r.box(11, 4, 17, 23, 12, 18, M.METAL_DARK); r.box(12, 5, 17, 22, 11, 18, M.CMP_PAILLE);
  r.box(26, 4, 9, 33, 12, 17, M.CAR_GLASS);
  for (const [a, b] of [[26, 4], [32, 4], [26, 11], [32, 11]]) r.box(a, b, 9, a + 1, b + 1, 17, M.METAL_DARK);
  r.box(25, 3, 17, 34, 13, 18, M.CAR_WHITE, caisse);
  r.box(31, 5, 2, 37, 11, 8, M.METAL_DARK);
  r.box(36, -6, 1, 41, 18, 4, M.CAR_BORD, rouge); r.box(40, -6, 1, 41, 18, 2, M.CHROME);
  for (let b = -6; b < 18; b += 2) r.box(38, b, 5, 40, b + 1, 7, M.METAL_DARK);
  r.box(38, -6, 4, 39, -5, 7, M.METAL_DARK); r.box(38, 17, 4, 39, 18, 7, M.METAL_DARK);
  r.box(4, 14, 15, 24, 16, 17, M.METAL_DARK); r.box(22, 13, 14, 24, 15, 17, M.METAL_DARK);
  r.box(0, 5, 4, 2, 11, 8, M.METAL_DARK);
}
// La remorque plateau, chargée de bottes carrées.
function remorque(W, x, y, zg, axe, dir, o = {}) {
  const r = repere(W, x, y, zg, axe, 34, dir);
  r.disque(12, 2.6, 2.6, 0, 2, M.TIRE, 0, M.METAL); r.disque(12, 2.6, 2.6, 9, 11, M.TIRE, 0, M.METAL);
  r.disque(18, 2.6, 2.6, 0, 2, M.TIRE, 0, M.METAL); r.disque(18, 2.6, 2.6, 9, 11, M.TIRE, 0, M.METAL);
  r.box(0, 0, 4, 28, 11, 5, M.WOOD, o.plateau);
  r.box(28, 4, 3, 34, 7, 4, M.METAL_DARK);
  r.box(0, 0, 5, 1, 11, 9, M.WOOD_DARK); r.box(27, 0, 5, 28, 11, 9, M.WOOD_DARK);
  if (o.charge) for (let l = 0; l < o.charge; l++) for (let a = 1; a < 27; a += 5) for (let b = 0; b < 11; b += 3) {
    if (l === o.charge - 1 && (a > 20 || b > 7)) continue;
    r.box(a, b, 5 + 2 * l, a + 5, Math.min(11, b + 3), 7 + 2 * l, M.CMP_PAILLE);
  }
}
// Une botte ronde couchée (diamètre 7, largeur 6), l'axe le long de y ou de x.
function botte(W, x, y, zg, axe) {
  const id = W.obj({ type: 'cmp_botte', axe, cx: x + 3.5, cy: y + 3.5, cz: zg + 3.5 });
  for (let a = 0; a < 7; a++) for (let z = 0; z < 7; z++) {
    if (Math.hypot(a + 0.5 - 3.5, z + 0.5 - 3.5) > 3.6) continue;
    for (let b = 0; b < 6; b++) { if (axe === 'y') W.set(x + a, y + b, zg + z, M.CMP_PAILLE, id); else W.set(x + b, y + a, zg + z, M.CMP_PAILLE, id); }
  }
}
// Une meule de bottes carrées, en gradins.
function meule(W, x, y, zg, n, m) {
  for (let l = 0; l < n; l++) for (let a = l * 2; a < m * 4 - l * 2; a += 4) for (let b = 0; b < 8; b += 2) W.box(x + a, y + b, zg + l * 2, x + a + 4, y + b + 2, zg + l * 2 + 2, M.CMP_PAILLE);
}
// Le puits de la cour : margelle ronde, deux montants, le toit de tuiles, le seau.
function puits(W, x, y, zg) {
  for (let yy = -4; yy <= 4; yy++) for (let xx = -4; xx <= 4; xx++) {
    const d = Math.hypot(xx, yy);
    if (d < 4.4 && d > 2.4) W.box(x + xx, y + yy, zg, x + xx + 1, y + yy + 1, zg + 4, M.CMP_MOELLON);
    else if (d <= 2.4) W.box(x + xx, y + yy, zg - 4, x + xx + 1, y + yy + 1, zg, M.CMP_EAU);
  }
  W.box(x - 4, y, zg + 4, x - 3, y + 1, zg + 13, M.WOOD_DARK); W.box(x + 4, y, zg + 4, x + 5, y + 1, zg + 13, M.WOOD_DARK);
  W.box(x - 4, y, zg + 11, x + 5, y + 1, zg + 12, M.WOOD_DARK);
  for (let k = 0; k < 4; k++) W.box(x - 5, y - 4 + k, zg + 13 + k, x + 6, y + 5 - k, zg + 14 + k, TUILE);
  W.box(x, y, zg + 7, x + 1, y + 1, zg + 11, M.METAL_DARK); W.box(x, y, zg + 6, x + 2, y + 2, zg + 8, M.METAL);
}
// Le calvaire du carrefour : trois marches, le fût de pierre, la croix de fer forgé.
function calvaire(W, x, y, zg) {
  W.box(x, y, zg, x + 12, y + 12, zg + 1, M.STONE);
  W.box(x + 1, y + 1, zg + 1, x + 11, y + 11, zg + 2, M.STONE);
  W.box(x + 3, y + 3, zg + 2, x + 9, y + 9, zg + 4, PIERRE_EGLISE);
  W.box(x + 4, y + 4, zg + 4, x + 8, y + 8, zg + 6, M.STONE);
  W.box(x + 5, y + 5, zg + 6, x + 7, y + 7, zg + 20, PIERRE_EGLISE);
  W.box(x + 5, y + 5, zg + 20, x + 7, y + 7, zg + 21, M.STONE);
  W.box(x + 6, y + 6, zg + 21, x + 7, y + 7, zg + 31, M.METAL_DARK);
  W.box(x + 3, y + 6, zg + 27, x + 10, y + 7, zg + 28, M.METAL_DARK);
  W.set(x + 6, y + 7, zg + 26, M.METAL_DARK); W.set(x + 6, y + 7, zg + 27, M.METAL_DARK);
  for (const [dx, dy] of [[1, 10], [10, 10], [10, 1]]) W.box(x + dx, y + dy, zg + 2, x + dx + 1, y + dy + 1, zg + 3, M.RES_FLEURS);
}
// Un panneau à texte sur poteau(x), sa face vers +y (LEFT) ou vers +x (RIGHT).
function panneau(W, face, x, y, zTop, txt, o = {}) {
  const bmp = textBitmap(txt), pad = o.pad != null ? o.pad : 1;
  const nw = Math.ceil((bmp.w + 2 * pad) / 2), nh = Math.ceil((bmp.h + 2 * pad) / 2);
  const f = face === LEFT ? new Facade(W, LEFT, x, y, nw, 1) : new Facade(W, RIGHT, x, y - nw + 1, 1, nw);
  if (o.bord) f.rect(-1, zTop - nh - 1, nw + 1, zTop + 1, 0, M.WHITE, o.bord);
  f.sign(0, zTop, txt, { plate: o.fond || [0.86, 0.85, 0.80], plateMat: M.PAPER, fg: o.encre || [0.08, 0.08, 0.08], depth: o.bord ? -1 : 0, padX: pad, padY: pad, emit: o.emit, worn: o.worn });
  if (o.poteaux !== false) for (const s of (o.poteaux || [Math.floor(nw / 2)])) {
    const [px, py] = f.xy(s, o.bord ? 0 : 1);
    W.box(px, py, G, px + 1, py + 1, zTop - nh - (o.bord ? 1 : 0), M.METAL);
  }
  return nw;
}
// La borne kilométrique : blanche, la tête rouge.
function borne(W, x, y, rouge) { W.box(x, y, G, x + 3, y + 2, G + 4, M.WHITE); W.box(x, y, G + 4, x + 3, y + 2, G + 6, M.PLASTIC_RED, rouge); }
// Les clôtures : piquets et deux fils de fer barbelé ; ou la barrière blanche du paddock.
function barbele(W, P, o = {}) {
  const step = o.step || 8;
  for (let s = 0; s < P.length - 1; s++) {
    const [x0, y0] = P[s], [x1, y1] = P[s + 1], n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let i = 0; i <= n; i++) {
      const x = Math.round(x0 + (x1 - x0) * i / n), y = Math.round(y0 + (y1 - y0) * i / n), z0 = SOL(x, y);
      if (o.skip && o.skip(x, y)) continue;
      if (i % step === 0) W.box(x, y, z0, x + 1, y + 1, z0 + 6, o.blanc ? M.WHITE : M.WOOD_DARK);
      if (o.blanc) { W.set(x, y, z0 + 3, M.WHITE); W.set(x, y, z0 + 5, M.WHITE); }
      else if (i % 2 === 0) { W.set(x, y, z0 + 3, M.METAL_DARK); W.set(x, y, z0 + 5, M.METAL_DARK); }
    }
  }
}
// L'abreuvoir : une baignoire de fonte pleine d'eau verte.
function abreuvoir(W, x, y, axe) {
  const r = repere(W, x, y, solSous(x, y, axe, 12, 5), axe, 12);
  r.box(0, 0, 0, 12, 5, 4, M.METAL_DARK); r.box(1, 1, 3, 11, 4, 4, M.CMP_EAU);
}
// Les bêtes en voxels : la vache (qui broute, la tête basse, ou qui regarde), le mouton, le cheval.
// le sol sous une bête : le plus haut de ses quatre coins (elle ne s'enfonce pas dans une ondulation)
const solSous = (x, y, axe, L, l) => { const a = axe === 'x' ? L : l, b = axe === 'x' ? l : L; return Math.max(SOL(x, y), SOL(x + a - 1, y), SOL(x, y + b - 1), SOL(x + a - 1, y + b - 1)); };
function vache(W, x, y, axe, dir, robe, broute) {
  const t = W.obj({ type: 'cmp_robe', robe, seed: (x * 0.37 + y * 0.11) % 10 });
  const r = repere(W, x, y, solSous(x, y, axe, 16, 4), axe, 16, dir);
  for (const a of [2, 10]) for (const b of [0, 3]) r.box(a, b, 0, a + 1, b + 1, 4, M.WHITE, t);
  r.box(1, 0, 4, 12, 4, 9, M.WHITE, t);
  r.box(0, 1, 5, 1, 3, 8, M.WHITE, t);
  if (broute) { r.box(12, 1, 3, 14, 3, 7, M.WHITE, t); r.box(13, 1, 0, 16, 3, 4, M.WHITE, t); r.box(15, 1, 0, 16, 3, 2, M.METAL_DARK); }
  else { r.box(12, 1, 6, 14, 3, 9, M.WHITE, t); r.box(13, 1, 6, 16, 3, 10, M.WHITE, t); r.box(15, 1, 6, 16, 3, 7, M.METAL_DARK); r.set(13, 0, 9, M.WHITE); r.set(13, 3, 9, M.WHITE); }
}
function mouton(W, x, y, axe, dir) {
  const t = W.obj({ type: 'cmp_robe', robe: 'mouton', seed: 1 }), tn = W.obj({ type: 'cmp_robe', robe: 'noir', seed: 1 });
  const r = repere(W, x, y, solSous(x, y, axe, 9, 4), axe, 9, dir);
  for (const a of [1, 5]) for (const b of [0, 3]) r.box(a, b, 0, a + 1, b + 1, 2, M.WHITE, tn);
  r.box(0, 0, 2, 7, 4, 6, M.WHITE, t);
  r.box(7, 1, 3, 9, 3, 6, M.WHITE, tn);
}
function cheval(W, x, y, axe, dir, robe) {
  const t = W.obj({ type: 'cmp_robe', robe, seed: 2 }), tn = W.obj({ type: 'cmp_robe', robe: 'noir', seed: 2 });
  const r = repere(W, x, y, solSous(x, y, axe, 18, 4), axe, 18, dir);
  for (const a of [3, 11]) for (const b of [0, 3]) r.box(a, b, 0, a + 1, b + 1, 6, M.WHITE, t);
  r.box(2, 0, 6, 13, 4, 11, M.WHITE, t);
  r.box(12, 1, 9, 14, 3, 14, M.WHITE, t); r.box(14, 1, 12, 17, 3, 15, M.WHITE, t);
  r.box(12, 1, 14, 14, 2, 15, M.WHITE, tn); r.box(0, 1, 5, 2, 3, 10, M.WHITE, tn);
}
// Les ruches du verger : caisses blanches sous leur toit, sur un tréteau.
function ruche(W, x, y) {
  const z = Math.max(SOL(x, y), SOL(x + 4, y + 4));
  W.box(x, y, z, x + 5, y + 5, z + 2, M.WOOD_DARK);
  W.box(x, y, z + 2, x + 5, y + 5, z + 7, M.WHITE);
  W.box(x - 1, y - 1, z + 7, x + 6, y + 6, z + 8, M.ZINC);
  W.box(x + 1, y + 4, z + 2, x + 4, y + 5, z + 3, M.METAL_DARK);
}
// La barque : une coque effilée, deux bancs.
function barque(W, x, y, zg, axe) {
  const r = repere(W, x, y, zg, axe, 16);
  for (let a = 0; a < 16; a++) { const t = Math.min(a, 15 - a), b0 = Math.max(0, 2 - t), b1 = Math.min(6, 4 + t); if (b1 <= b0) continue; r.box(a, b0, 0, a + 1, b1, 2, M.WOOD_DARK); if (b1 - b0 > 2) r.box(a, b0 + 1, 1, a + 1, b1 - 1, 2, 0); }
  r.box(5, 1, 1, 6, 5, 2, M.WOOD); r.box(10, 1, 1, 11, 5, 2, M.WOOD);
}
// Un but : montants et barre blancs, cadre arrière, filet à larges mailles.
function but(W, gx, ya, yb, dir, net, H = 10) {
  const D = 6, xb = gx + dir * D;
  W.box(gx, ya, G, gx + 1, ya + 1, G + H + 1, M.WHITE); W.box(gx, yb, G, gx + 1, yb + 1, G + H + 1, M.WHITE);
  W.box(gx, ya, G + H, gx + 1, yb + 1, G + H + 1, M.WHITE);
  W.box(Math.min(gx, xb), ya, G, Math.max(gx, xb) + 1, ya + 1, G + 1, M.METAL);
  W.box(Math.min(gx, xb), yb, G, Math.max(gx, xb) + 1, yb + 1, G + 1, M.METAL);
  W.box(xb, ya, G, xb + 1, yb + 1, G + 1, M.METAL);
  if (!net) return;
  for (let k = 1; k <= D; k++) {
    const x = gx + dir * k, top = G + H - Math.round(k * 4 / D);
    for (let y = ya; y <= yb; y++) for (let z = G + 1; z <= top; z++) {
      const back = k === D, side = y === ya || y === yb, roof = z === top;
      if (!(back || side || roof)) continue;
      const on = back ? (y % 3 === 0 || z % 3 === 0) : side ? (k % 3 === 0 || z % 3 === 0) : (y % 3 === 0 || k % 3 === 0);
      if (on && !W.get(x, y, z)) W.set(x, y, z, M.ESTQ_NET);
    }
  }
}
// La cage mobile : petit but d'entraînement sur roulettes, posé le long de x (ouverture vers +y).
function cageMobile(W, x, y, peint) {
  W.box(x, y, G, x + 1, y + 1, G + 7, M.METAL, peint); W.box(x + 13, y, G, x + 14, y + 1, G + 7, M.METAL, peint);
  W.box(x, y, G + 6, x + 14, y + 1, G + 7, M.METAL, peint);
  W.box(x, y - 4, G, x + 14, y - 3, G + 1, M.METAL, peint); W.box(x, y - 4, G, x + 1, y, G + 1, M.METAL, peint); W.box(x + 13, y - 4, G, x + 14, y, G + 1, M.METAL, peint);
  for (let xx = x + 1; xx < x + 13; xx++) for (let z = G + 1; z < G + 6; z++) if ((xx + z) % 2 === 0) W.set(xx, y - 3, z, M.ESTQ_NET);
  for (let k = 1; k < 3; k++) for (let xx = x + 1; xx < x + 13; xx += 2) W.set(xx, y - k, G + 6 - k, M.ESTQ_NET);
}
// Le pare-ballons : poteaux et grand filet derrière les buts.
function pareBallons(W, x, y0, y1, h) {
  for (let y = y0; y <= y1; y++) {
    if ((y - y0) % 12 === 0 || y === y1) W.box(x, y, G, x + 1, y + 1, G + h, M.METAL);
    else for (let z = G + 1; z < G + h; z++) if ((y % 4 === 0 && z % 2 === 0) || (z % 4 === 0 && y % 2 === 0)) W.set(x, y, z, M.ESTQ_NET);
    W.set(x, y, G + h - 1, M.METAL);
  }
}
// Le mât d'éclairage du stade de village : fût, crosse, deux projecteurs tournés vers la pelouse.
function mat(W, x, y, h, on, cible, I) {
  W.box(x - 1, y - 1, G, x + 3, y + 3, G + 1, M.CONCRETE);
  W.box(x, y, G, x + 2, y + 2, G + h, M.METAL);
  for (let z = G + 5; z < G + h - 2; z += 3) W.set(x + 2, y, z, M.METAL_DARK);
  const dx = Math.sign(cible[0] - x), dy = Math.sign(cible[1] - y), tz = G + h;
  W.box(x - 3, y - 3, tz, x + 5, y + 5, tz + 1, M.METAL_DARK);
  for (const [ox, oy] of [[dx * 2 - 2 * dy, dy * 2 + 2 * dx], [dx * 2 + 2 * dy, dy * 2 - 2 * dx]]) {
    const px = x + ox, py = y + oy;
    W.box(px, py, tz + 1, px + 2, py + 2, tz + 4, on ? M.FLOOD : M.FLOOD_OFF);
    W.box(px, py, tz + 4, px + 2, py + 2, tz + 5, M.METAL_DARK);
  }
  if (on) {
    const lx = x + 1 + dx * 2.5, ly = y + 1 + dy * 2.5, lz = tz + 2;
    const ax = cible[0] - lx, ay = cible[1] - ly, az = cible[2] - lz, al = Math.hypot(ax, ay, az);
    W.light({ x: lx, y: ly, z: lz, r: 200, fall: 1.4, cr: 0.95 * I, cg: 0.92 * I, cb: 0.80 * I, skip: 3, axis: [ax / al, ay / al, az / al], c0: 0.3, c1: 0.75, spill: 0.06 });
  }
}
// La lanterne murale (une potence, une cage, l'ampoule) : allumée, elle éclaire la porte.
function lanterne(W, f, s, z, on, I = 1) {
  for (let i = 1; i <= 2; i++) f.set(s, z, -i, M.METAL_DARK);
  f.set(s, z, -3, M.METAL_DARK); f.set(s, z - 1, -3, on ? M.BULB : M.GLASS); f.set(s, z - 2, -3, M.METAL_DARK);
  if (on) { const p = f.front(s, z - 1, 4); W.light({ x: p.x, y: p.y, z: p.z, r: 46, fall: 2.2, cr: 1.5 * I, cg: 1.0 * I, cb: 0.48 * I, spot: 0.4, skip: 1.6 }); }
}
// Le réverbère de village : fût de fonte, lanterne à quatre pans.
function reverbere(W, x, y, on) {
  W.box(x, y, G, x + 2, y + 2, G + 2, M.METAL_DARK);
  W.box(x, y, G + 2, x + 1, y + 1, G + 17, M.METAL_DARK);
  W.box(x - 1, y - 1, G + 17, x + 2, y + 2, G + 18, M.METAL_DARK);
  W.box(x - 1, y - 1, G + 18, x + 2, y + 2, G + 21, on ? M.BULB : M.GLASS);
  W.box(x - 1, y - 1, G + 21, x + 2, y + 2, G + 22, M.METAL_DARK); W.set(x, y, G + 22, M.METAL_DARK);
  if (on) W.light({ x: x + 0.5, y: y + 0.5, z: G + 19.5, r: 58, fall: 2.2, cr: 1.6, cg: 1.06, cb: 0.50, spot: 0.5, skip: 2.2 });
}

// ================================================================ les bâtiments
// Les chaînes d'angle : de la pierre de taille, une longue, une courte, aux trois arêtes que l'on voit.
function chaines(W, x, y, w, d, z0, z1, m) {
  for (let z = z0; z < z1; z++) {
    const big = Math.floor((z - z0) / 3) % 2 === 0;
    for (let k = 0; k < (big ? 3 : 2); k++) { W.set(x + w - 1 - k, y + d - 1, z, m); W.set(x + k, y + d - 1, z, m); }
    for (let k = 0; k < (big ? 2 : 3); k++) { W.set(x + w - 1, y + d - 1 - k, z, m); W.set(x + w - 1, y + k, z, m); }
  }
}
// La hauteur d'un toit à deux pans (pente 1, débord 1) sur une profondeur d.
const hToit = d => Math.ceil((d + 2) / 2);
// Une fenêtre de campagne : appui et linteau de pierre, volets (ouverts, ou clos).
function fenetre(f, s, z, o) {
  return f.window(s, z, o.w || 5, o.h || 7, { state: o.lit ? 'lit' : 'dark', shutter: o.volet, closed: !!o.clos, spill: o.spill || false, spillR: 18, spillI: 0.35, curtain: o.rideau, sil: o.sil, frame: o.cadre, sillMat: M.STONE, lintelMat: o.linteau || M.STONE });
}
// Une maison de village : moellons ou enduit, volets, porte, toit de tuiles à deux pans, cheminée.
// o.fen : [[façade 'f'|'g', s, étage], …] ; o.porte : s sur la façade sud ; o.lits : les fenêtres allumées.
function maison(W, o) {
  const { x, y, w, d } = o, hz = o.hz || 27, mur = o.mur || M.CMP_MOELLON;
  W.box(x, y, G, x + w, y + d, G + hz, mur);
  if (o.chaines !== false) chaines(W, x, y, w, d, G, G + hz, M.STONE);
  const f = new Facade(W, LEFT, x, y, w, d), g = new Facade(W, RIGHT, x, y, w, d);
  f.rect(0, G, w, G + 2, 0, M.STONE); g.rect(0, G, d, G + 2, 0, M.STONE);
  (o.fen || []).forEach(([fa, s, et], i) => fenetre(fa === 'f' ? f : g, s, et ? G + 17 : G + 4, { w: 5, h: et ? 7 : 8, volet: o.volet, clos: o.clos && (o.clos === true || o.clos(i)), lit: o.lits && o.lits.includes(i), rideau: o.rideau }));
  if (o.porte != null) { f.door(o.porte, G, 5, 11, { mat: M.WOOD, frameMat: M.STONE }); f.rect(o.porte, G, o.porte + 5, G + 11, 2, M.WOOD, o.portePeint); }
  B.gableRoof(W, x, y, w, d, G + hz, o.toit || TUILE, { oh: 1, axis: o.axe || 'x', gable: mur });
  if (o.chem) B.chimney(W, x + o.chem[0], y + o.chem[1], G + hz, hToit(o.axe === 'y' ? w : d) + 3, M.BRICK_OLD);
  return { f, g };
}
// Le logis de la ferme Lacombe : deux niveaux, cinq travées, la porte et son auvent, le banc, la lampe de la cour.
function logis(W, o) {
  const { x, y } = o, w = 80, d = 34, hz = 26;
  const r = maison(W, {
    x, y, w, d, hz, volet: M.SHUTTER_GREY, chem: [10, 15], porte: 38, portePeint: o.porte,
    fen: [['f', 8, 0], ['f', 22, 0], ['f', 52, 0], ['f', 66, 0], ['f', 8, 1], ['f', 22, 1], ['f', 38, 1], ['f', 52, 1], ['f', 66, 1], ['g', 8, 1], ['g', 22, 0]],
    lits: o.night ? (o.bad ? [6] : [1, 6, 10]) : [], clos: o.bad ? (i => i >= 4 && i !== 6) : (i => i === 5 || i === 8),
  });
  B.chimney(W, x + 66, y + 15, G + hz, hToit(d) + 3, M.BRICK_OLD);
  const { f } = r;
  // l'auvent de tuiles au-dessus de la porte, sur deux consoles
  for (let k = 0; k < 4; k++) f.rect(35, G + 13 + k, 46, G + 14 + k, -4 + k, TUILE);
  f.rect(35, G + 11, 36, G + 13, -1, M.WOOD_DARK); f.rect(45, G + 11, 46, G + 13, -1, M.WOOD_DARK);
  // le banc contre le mur, les pots de géraniums, la jardinière sous les fenêtres
  f.rect(26, G, 34, G + 2, -2, M.WOOD); f.rect(26, G, 27, G + 2, -1, M.WOOD_DARK); f.rect(33, G, 34, G + 2, -1, M.WOOD_DARK);
  for (const s of [8, 22, 52, 66]) f.rect(s, G + 3, s + 5, G + 4, -2, M.RES_FLEURS);
  for (const s of [47, 49]) f.rect(s, G, s + 1, G + 2, -1, M.RES_FLEURS);
  lanterne(W, f, 43, G + 15, o.night, 1.25);
  // la lampe de la cour, sous l'avant-toit à l'angle : la flaque de lumière sur la cour la nuit
  f.rect(72, G + 21, 75, G + 22, -1, M.METAL_DARK); f.set(73, G + 20, -2, o.night && !o.bad ? M.BULB : M.GLASS);
  if (o.night && !o.bad) { const p = f.front(73, G + 19, 3); W.light({ x: p.x, y: p.y, z: p.z, r: 78, fall: 1.9, cr: 1.45, cg: 1.0, cb: 0.52, spot: 0.55, skip: 1.6 }); }
  return r;
}
// La grange : moellons, la grande porte charretière sur la cour (face +x), ouverte sur le foin.
function grange(W, o) {
  const { x, y, w, d } = o, hz = 22;
  W.box(x, y, G, x + w, y + d, G + hz, M.CMP_MOELLON);
  chaines(W, x, y, w, d, G, G + hz, M.STONE);
  const g = new Facade(W, RIGHT, x, y, w, d), f = new Facade(W, LEFT, x, y, w, d);
  const s0 = Math.floor(d / 2) - 10, dw = 20, dh = 19;
  if (o.ouverte) {
    W.box(x + 2, y + 2, G, x + w - 2, y + d - 2, G + hz - 1, 0);
    g.rect(s0, G, s0 + dw, G + dh, 0, 0); g.rect(s0, G, s0 + dw, G + dh, 1, 0);
    // le foin entassé au fond, une charrette à bras, la lumière qui tombe de la lucarne
    W.box(x + 2, y + 2, G, x + 14, y + d - 2, G + 14, M.CMP_PAILLE);
    W.box(x + 2, y + 2, G + 14, x + 9, y + d - 2, G + 19, M.CMP_PAILLE);
    for (let k = 0; k < 6; k++) W.box(x + 14 + k, y + 4 + k * 3, G, x + 15 + k, y + 7 + k * 3, G + 8 - k, M.CMP_PAILLE);
    // les vantaux, rabattus contre le mur
    g.rect(s0 - 10, G, s0, G + dh, -1, M.WOOD, o.bois); g.rect(s0 + dw, G, s0 + dw + 10, G + dh, -1, M.WOOD, o.bois);
  } else g.rect(s0, G, s0 + dw, G + dh, 0, M.WOOD, o.bois);
  g.rect(s0 - 1, G + dh, s0 + dw + 1, G + dh + 2, 0, M.WOOD_DARK);
  // la porte du fenil, au pignon sud
  f.rect(Math.floor(w / 2) - 4, G + 12, Math.floor(w / 2) + 4, G + 20, 0, M.WOOD, o.bois);
  // les jours d'aération, en fente
  for (let s = 6; s < d - 4; s += 9) if (s < s0 - 11 || s > s0 + dw + 10) g.rect(s, G + 9, s + 1, G + 15, 0, M.METAL_DARK);
  B.gableRoof(W, x, y, w, d, G + hz, TUILE, { oh: 1, axis: 'y', gable: M.CMP_MOELLON });
  return g;
}
// Le hangar ouvert : poteaux de bois, toit de tôle à une pente, ouvert à l'est (face +x).
function hangar(W, o) {
  const { x, y, w, d } = o, hBas = 17, hHaut = 23;
  W.box(x, y, G, x + 2, y + d, G + hHaut, M.CMP_MOELLON);
  W.box(x, y, G, x + w, y + 2, G + hHaut, M.CMP_MOELLON);
  W.box(x, y + d - 2, G, x + w, y + d, G + hBas, M.WOOD, o.bois);
  for (let yy = y + 2; yy < y + d; yy += 12) W.box(x + w - 2, yy, G, x + w, yy + 2, G + hBas, M.WOOD_DARK);
  W.box(x + w - 2, y + d - 2, G, x + w, y + d, G + hBas, M.WOOD_DARK);
  for (let xx = x - 1; xx < x + w + 2; xx++) {
    const z = Math.round(G + hHaut - (xx - x + 1) * (hHaut - hBas) / (w + 2));
    W.box(xx, y - 1, z, xx + 1, y + d + 1, z + 1, M.RES_TOLE);
  }
}
// Le pigeonnier : une tour ronde de moellons, une randière, le toit en poivrière, l'épi.
function pigeonnier(W, cx, cy, o = {}) {
  const r = 7.5, hz = 26;
  for (let z = G; z < G + hz; z++) for (let yy = -8; yy <= 8; yy++) for (let xx = -8; xx <= 8; xx++) {
    const dd = Math.hypot(xx + 0.5, yy + 0.5);
    if (dd > r) continue;
    W.set(cx + xx, cy + yy, z, (z === G + 18 && dd > r - 1.2) ? M.STONE : M.CMP_MOELLON);
  }
  for (let z = G + 20; z < G + 23; z++) for (const a of [0.6, 1.2]) W.set(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r), z, M.METAL_DARK);
  for (let k = 0; k < 17; k++) {
    const rr = 9 - k * 0.55;
    for (let yy = -10; yy <= 10; yy++) for (let xx = -10; xx <= 10; xx++) if (Math.hypot(xx + 0.5, yy + 0.5) <= rr) W.set(cx + xx, cy + yy, G + hz + k, TUILE);
  }
  W.box(cx, cy, G + hz + 17, cx + 1, cy + 1, G + hz + 21, M.METAL_DARK);
  W.set(cx - 1, cy, G + hz + 20, M.METAL_DARK); W.set(cx + 1, cy, G + hz + 20, M.METAL_DARK);
  const f = new Facade(W, LEFT, cx - 2, cy, 4, Math.ceil(r));
  f.door(0, G, 4, 9, { mat: M.WOOD_DARK, frame: false });
}
// L'église du village : la nef de pierre et d'ardoise, ses contreforts et ses vitraux, le clocher-porche
// au sud (le portail, l'horloge, les abat-sons), la flèche d'ardoise, la croix et le coq à 80.
function eglise(W, o) {
  const { x, y, night, bad } = o, nw = 34, nd = 62, nh = 20;
  W.box(x, y, G, x + nw, y + nd, G + nh, PIERRE_EGLISE);
  for (let yy = y + 5; yy < y + nd - 6; yy += 14) for (let z = G; z < G + 16; z++) { const dp = 3 - Math.floor((z - G) / 6); W.box(x + nw, yy, z, x + nw + dp, yy + 3, z + 1, PIERRE_EGLISE); }
  const g = new Facade(W, RIGHT, x, y, nw, nd);
  for (let s = 4; s < nd - 12; s += 14) {
    g.rect(s, G + 5, s + 4, G + 16, 0, 0);
    const id = W.obj({ type: 'cmp_vitrail', face: RIGHT, a0: g.a0(s), z0: G + 5, w: 4, h: 11, seed: s, glow: night && !bad ? 0.5 : 0 });
    g.rect(s, G + 5, s + 4, G + 16, 1, M.GLASS, id);
    g.rect(s - 1, G + 4, s + 5, G + 5, -1, M.STONE);
  }
  B.gableRoof(W, x, y, nw, nd, G + nh, M.SLATE, { oh: 1, axis: 'y', gable: PIERRE_EGLISE });
  // le clocher-porche, devant la nef
  const tw = 22, th = 42, tx = x + Math.floor((nw - tw) / 2), ty = y + nd - 4;
  W.box(tx, ty, G, tx + tw, ty + tw, G + th, PIERRE_EGLISE);
  chaines(W, tx, ty, tw, tw, G, G + th, M.STONE);
  for (const zz of [G + 18, G + th - 2]) W.box(tx - 1, ty - 1, zz, tx + tw + 1, ty + tw + 1, zz + 1, M.STONE);
  const tf = new Facade(W, LEFT, tx, ty, tw, tw), tg = new Facade(W, RIGHT, tx, ty, tw, tw);
  // le portail : deux battants sous un arc, trois marches
  tf.rect(6, G, 16, G + 15, 0, 0); tf.rect(6, G, 16, G + 15, 1, 0);
  tf.rect(6, G, 16, G + 13, 2, M.WOOD_DARK); tf.rect(10, G, 12, G + 13, 2, M.METAL_DARK);
  for (let k = 0; k < 4; k++) tf.rect(6 + k, G + 13 + k, 16 - k, G + 14 + k, 1, 0);
  for (let k = 0; k < 5; k++) { tf.rect(5 + k, G + 13 + k, 6 + k, G + 14 + k, 0, M.STONE); tf.rect(16 - k, G + 13 + k, 17 - k, G + 14 + k, 0, M.STONE); }
  tf.rect(1, G - 1, 21, G, -1, M.STONE); tf.rect(1, G - 1, 21, G, -2, M.STONE); tf.rect(3, G - 1, 19, G, -3, M.STONE);
  // l'horloge
  { const s0 = 8, z0 = G + 20, id = W.obj({ type: 'res_horloge', face: LEFT, a0: tf.a0(s0), z0, w: 6, lit: night && !bad }); for (let s = s0; s < s0 + 6; s++) for (let z = z0; z < z0 + 6; z++) tf.tag(s, z, 0, id); }
  // les abat-sons, sur les deux faces que l'on voit
  for (const F of [tf, tg]) for (const s0 of [3, 13]) {
    F.rect(s0, G + 29, s0 + 6, G + 39, 0, 0); F.rect(s0, G + 29, s0 + 6, G + 39, 1, M.METAL_DARK);
    for (let z = G + 29; z < G + 39; z += 2) F.rect(s0, z, s0 + 6, z + 1, 0, M.WOOD_DARK);
    F.rect(s0 - 1, G + 28, s0 + 7, G + 29, -1, M.STONE);
  }
  // la flèche d'ardoise, octogonale et effilée, ses quatre clochetons ; la croix et le coq à 80
  const cx = tx + tw / 2, cy = ty + tw / 2;
  for (const [px, py] of [[tx, ty], [tx + tw - 3, ty], [tx, ty + tw - 3], [tx + tw - 3, ty + tw - 3]]) { W.box(px, py, G + th, px + 3, py + 3, G + th + 4, PIERRE_EGLISE); W.box(px + 1, py + 1, G + th + 4, px + 2, py + 2, G + th + 7, M.SLATE); }
  const hs = 31;
  for (let k = 0; k < hs; k++) {
    const hw = 7.8 * (1 - k / (hs + 0.5)) + 0.3;
    for (let yy = Math.floor(cy - hw - 1); yy <= cy + hw; yy++) for (let xx = Math.floor(cx - hw - 1); xx <= cx + hw; xx++) {
      const dx = Math.abs(xx + 0.5 - cx), dy = Math.abs(yy + 0.5 - cy);
      if (dx <= hw && dy <= hw && dx + dy <= hw * 1.38) W.set(xx, yy, G + th + k, M.SLATE);
    }
  }
  const ct = G + th + hs, x0 = Math.floor(cx) - 1, y0 = Math.floor(cy) - 1;
  W.box(x0 + 1, y0 + 1, ct, x0 + 2, y0 + 2, Math.min(81, ct + 7), M.METAL_DARK);
  W.box(x0 - 1, y0 + 1, ct + 3, x0 + 4, y0 + 2, ct + 4, M.METAL_DARK);
  W.set(x0 + 1, y0 + 1, Math.min(80, ct + 6), M.GOLD); W.set(x0 + 2, y0 + 1, Math.min(80, ct + 6), M.GOLD);
  if (night) { W.set(x0 + 1, ty + tw, G + 17, M.BULB); W.light({ x: x0 + 1.5, y: ty + tw + 2.5, z: G + 16, r: 36, cr: 1.1, cg: 0.76, cb: 0.36, skip: 1.5, spot: 0.4 }); }
  return { porte: [tx + 11, ty + tw + 4] };
}
// L'auberge du Relais : l'enduit ocre, la salle au rez-de-chaussée, l'enseigne peinte, la potence,
// la terrasse sous les tilleuls ; la nuit, la salle allumée, la lanterne, une guirlande d'ampoules.
function auberge(W, o) {
  const { x, y, night, bad } = o, w = 64, d = 36, hz = 27;
  const ouverte = !bad;
  W.box(x, y, G, x + w, y + d, G + hz, M.PLASTER_OCHRE);
  chaines(W, x, y, w, d, G, G + hz, M.STONE);
  const f = new Facade(W, LEFT, x, y, w, d), g = new Facade(W, RIGHT, x, y, w, d);
  f.rect(0, G, w, G + 2, 0, M.STONE); g.rect(0, G, d, G + 2, 0, M.STONE);
  // la salle : deux grandes baies à petits bois, la porte vitrée, une fenêtre
  for (const s0 of [4, 21]) {
    if (ouverte) {
      f.rect(s0, G + 3, s0 + 13, G + 12, 0, 0);
      const id = W.obj({ type: 'res_vitrine', kind: 'cafe', face: LEFT, a0: f.a0(s0), z0: G + 3, w: 13, h: 9, clients: night ? [6 + (s0 % 7), 18] : [], k: night ? 0.95 : 0.22 });
      f.rect(s0, G + 3, s0 + 13, G + 12, 1, M.GLASS, id);
    } else f.window(s0, G + 3, 13, 9, { state: 'dark', shutter: M.SHUTTER_BORD, closed: true });
    f.rect(s0 - 1, G + 2, s0 + 14, G + 3, -1, M.STONE); f.rect(s0, G + 12, s0 + 13, G + 13, 0, M.WOOD_DARK);
  }
  f.door(38, G, 6, 12, ouverte ? { kind: 'door', frameMat: M.WOOD_DARK, k: night ? 0.9 : 0.25 } : { mat: M.WOOD_DARK, frameMat: M.WOOD_DARK });
  fenetre(f, 50, G + 4, { w: 6, h: 8, volet: M.SHUTTER_BORD, clos: bad, lit: night && ouverte });
  // l'enseigne peinte entre les deux niveaux, dans son cadre
  f.rect(3, G + 13, 61, G + 18, 0, M.WOOD_DARK);
  f.sign(4, G + 17, 'AUBERGE DU RELAIS', { plate: [0.16, 0.24, 0.17], plateMat: M.METAL_GREEN, fg: [0.86, 0.78, 0.52], depth: 0, padX: 4, padY: 1, scale: 1, worn: bad ? 0.3 : 0.02, emit: night && ouverte ? [0.30, 0.26, 0.14] : null });
  // l'étage : cinq fenêtres aux volets bordeaux
  [5, 17, 29, 41, 53].forEach((s, i) => fenetre(f, s, G + 19, { w: 5, h: 7, volet: M.SHUTTER_BORD, clos: bad ? i !== 2 : i === 4, lit: night && (bad ? false : i === 1 || i === 3), rideau: [0.66, 0.52, 0.30] }));
  fenetre(g, 8, G + 19, { w: 5, h: 7, volet: M.SHUTTER_BORD, clos: bad }); fenetre(g, 22, G + 19, { w: 5, h: 7, volet: M.SHUTTER_BORD, clos: true });
  fenetre(g, 12, G + 4, { w: 6, h: 8, volet: M.SHUTTER_BORD, clos: bad, lit: night && ouverte });
  B.gableRoof(W, x, y, w, d, G + hz, TUILE, { oh: 1, gable: M.PLASTER_OCHRE });
  for (const at of [x + 14, x + 44]) B.dormer(W, LEFT, x, y + 1, w, d - 3, at, G + hz + 1, { state: night && ouverte && at < x + 20 ? 'lit' : 'dark', spill: false });
  B.chimney(W, x + 6, y + 16, G + hz, hToit(d) + 1, M.BRICK_OLD); B.chimney(W, x + 56, y + 16, G + hz, hToit(d) + 1, M.BRICK_OLD);
  // la potence et son enseigne, à l'angle de la route
  for (let k = 1; k <= 8; k++) f.set(1, G + 20, -k, M.METAL_DARK);
  f.set(1, G + 21, -2, M.METAL_DARK); f.set(1, G + 22, -1, M.METAL_DARK);
  panneau(W, RIGHT, x + 1, y + d + 7, G + 19, 'RELAIS', { fond: [0.16, 0.24, 0.17], encre: [0.86, 0.78, 0.52], poteaux: false, worn: bad ? 0.25 : 0 });
  if (ouverte) lanterne(W, f, 46, G + 13, night, 1.2);
  if (night && ouverte) {
    const p = f.front(30, G + 8, 6); W.light({ x: p.x, y: p.y, z: p.z, r: 34, cr: 0.55, cg: 0.36, cb: 0.16, shadow: false });
    const p2 = f.front(32, G + 15, 3); W.light({ x: p2.x, y: p2.y, z: p2.z, r: 22, cr: 0.6, cg: 0.5, cb: 0.3, shadow: false });
  }
  return f;
}
// Le manoir de la Motte : pierre de taille (bossages au rez-de-chaussée), l'avant-corps, son fronton
// et son perron, le grand comble d'ardoise et ses lucarnes, les hautes cheminées.
function manoir(W, o) {
  const { x, y, night, bad } = o, w = 110, d = 48, hz = 28;
  const P = M.ESTQ_ASHLAR;
  W.box(x, y, G, x + w, y + d, G + hz, P);
  W.box(x + 44, y + d, G, x + 66, y + d + 3, G + hz, P);
  W.box(x - 1, y - 1, G + 15, x + w + 1, y + d + 1, G + 16, M.STONE);
  W.box(x + 43, y + d, G + 15, x + 67, y + d + 4, G + 16, M.STONE);
  const f = new Facade(W, LEFT, x, y, w, d), g = new Facade(W, RIGHT, x, y, w, d), ac = new Facade(W, LEFT, x + 44, y + d, 22, 3);
  const lit = night ? (bad ? [3] : [1, 3, 7, 9, 12]) : [];
  let n = 0;
  const win = (F, s, et) => { const k = n++; F.window(s, et ? G + 18 : G + 3, 6, et ? 9 : 10, { state: lit.includes(k) ? 'lit' : 'dark', shutter: M.SHUTTER_GREY, closed: bad ? !lit.includes(k) : k === 5, spill: lit.includes(k) && k === 3, spillR: 24, spillI: 0.4, curtain: [0.72, 0.56, 0.34], sillMat: M.STONE, lintelMat: M.STONE }); };
  for (const s of [6, 19, 32, 72, 85, 98]) { win(f, s, 0); win(f, s, 1); }
  win(ac, 8, 1); win(g, 10, 0); win(g, 10, 1); win(g, 32, 0); win(g, 32, 1);
  // la porte d'entrée, haute, vitrée en imposte ; les lanternes ; le perron de deux marches
  ac.door(7, G + 2, 8, 13, { mat: M.WOOD_DARK, frameMat: M.STONE });
  ac.rect(7, G + 12, 15, G + 15, 2, M.GLASS);
  W.box(x + 46, y + d + 3, G, x + 64, y + d + 10, G + 1, M.STONE);
  W.box(x + 48, y + d + 3, G + 1, x + 62, y + d + 6, G + 2, M.STONE);
  for (const s of [3, 18]) lanterne(W, ac, s, G + 13, night && !bad, 1.1);
  // le comble à la Mansart : le brisis presque droit, puis le terrasson en pente douce, le faîtage de zinc ;
  // ses lucarnes, le fronton de l'avant-corps
  W.box(x - 1, y - 1, G + hz, x + w + 1, y + d + 1, G + hz + 1, M.STONE);
  let zt = G + hz + 1;
  for (let k = 0; k < 9; k++, zt++) { const i = Math.floor(k / 3); W.box(x + i, y + i, zt, x + w - i, y + d - i, zt + 1, M.SLATE); }
  for (let i = 5; y + i < y + d - i - 1; i += 2, zt++) W.box(x + i, y + i, zt, x + w - i, y + d - i, zt + 1, M.SLATE);
  { const i = Math.floor(d / 2) - 1; W.box(x + i, y + i, zt, x + w - i, y + d - i, zt + 1, M.ZINC); }
  zt++;
  for (const at of [x + 7, x + 20, x + 33, x + 73, x + 86, x + 99]) B.dormer(W, LEFT, x, y, w, d, at, G + hz + 2, { state: night && !bad && at === x + 86 ? 'lit' : 'dark', spill: false });
  for (let k = 0; k < 10; k++) W.box(x + 44 + k, y + d, G + hz + k, x + 66 - k, y + d + 3, G + hz + k + 1, P);
  for (let k = 0; k < 11; k++) { W.box(x + 43 + k, y + d + 3, G + hz + k, x + 44 + k, y + d + 4, G + hz + k + 1, M.STONE); W.box(x + 66 - k, y + d + 3, G + hz + k, x + 67 - k, y + d + 4, G + hz + k + 1, M.STONE); }
  { const oc = new Facade(W, LEFT, x + 44, y + d, 22, 3); oc.rect(9, G + hz + 2, 13, G + hz + 6, 0, M.GLASS); oc.rect(10, G + hz + 1, 12, G + hz + 7, 0, M.GLASS); }
  for (const cx of [x + 12, x + 40, x + 68, x + 96]) { W.box(cx, y + 20, zt - 8, cx + 4, y + 26, zt, P); W.box(cx - 1, y + 19, zt, cx + 5, y + 27, zt + 1, M.STONE); W.box(cx + 1, y + 21, zt + 1, cx + 2, y + 22, zt + 2, M.TERRACOTTA); W.box(cx + 2, y + 23, zt + 1, cx + 3, y + 24, zt + 2, M.TERRACOTTA); }
  return { porte: [x + 55, y + d + 12] };
}
// Les communs du manoir : l'écurie, ses portes basses, son lanterneau.
function communs(W, o) {
  const { x, y, night } = o;
  const r = maison(W, { x, y, w: 70, d: 26, hz: 16, mur: M.CMP_MOELLON, volet: M.SHUTTER_GREY, fen: [['f', 26, 0], ['f', 40, 0], ['g', 10, 0]], lits: night && !o.bad ? [1] : [] });
  for (const s of [6, 52]) { r.f.door(s, G, 8, 12, { mat: M.WOOD, frameMat: M.STONE }); r.f.rect(s, G + 6, s + 8, G + 7, 2, M.WOOD_DARK); r.f.rect(s, G, s + 8, G + 12, 2, M.WOOD, o.bois); }
  W.box(x + 32, y + 10, G + 16 + 8, x + 38, y + 16, G + 16 + 15, M.WOOD_DARK);
  W.box(x + 31, y + 9, G + 16 + 15, x + 39, y + 17, G + 16 + 16, M.SLATE);
  return r;
}
// Une grille de parc : mur bahut, barreaux à pointes, piliers de pierre ; le long de x (axe 'x') ou de y.
function grille(W, axe, c, a0, a1, o = {}) {
  const set = (a, z, m) => axe === 'x' ? W.set(a, c, z, m) : W.set(c, a, z, m);
  for (let a = a0; a < a1; a++) {
    if (o.trous && o.trous.some(([p, q]) => a >= p && a < q)) continue;
    const pil = (a - a0) % 26 < 3;
    for (let z = G; z < G + 3; z++) set(a, z, M.CMP_MOELLON);
    set(a, G + 3, M.STONE);
    if (pil) { for (let z = G + 4; z < G + 15; z++) set(a, z, M.STONE); set(a, G + 15, M.STONE); continue; }
    if (a % 2 === 0) for (let z = G + 4; z < G + 13; z++) set(a, z, M.METAL_DARK);
    set(a, G + 6, M.METAL_DARK); set(a, G + 12, M.METAL_DARK);
    if (a % 2 === 0) set(a, G + 13, M.METAL_DARK);
  }
}
// La tribune de bois du stade : quatre gradins de planches, le mur du fond, le toit sur poteaux, le fronton.
function tribune(W, x, y, len, o) {
  const bois = o.bois, peint = o.peint;
  W.box(x, y, G, x + len, y + 22, G + 1, M.CONCRETE);
  W.box(x, y, G, x + len, y + 2, G + 20, M.WOOD, bois);
  for (let i = 0; i < 4; i++) {
    const yy = y + 2 + 4 * (3 - i), zz = G + 1 + 3 * i;
    W.box(x + 1, y + 2, G + 1, x + len - 1, yy + 4, zz + 1, M.WOOD_DARK);
    for (let xx = x + 2; xx < x + len - 2; xx++) if (!o.casse || hash(xx, i, 871, 0) > 0.15) { W.set(xx, yy + 1, zz + 2, M.WOOD, bois); W.set(xx, yy + 2, zz + 2, M.WOOD, bois); }
  }
  for (const xx of [x, x + len - 1]) for (let z = G + 1; z < G + 20; z++) for (let yy = y; yy < y + 22 - Math.floor((z - G) / 2); yy++) W.set(xx, yy, z, M.WOOD, bois);
  for (let xx = x; xx < x + len; xx += 15) W.box(xx, y + 21, G + 1, xx + 1, y + 22, G + 18, M.WOOD_DARK, peint);
  W.box(x + len - 1, y + 21, G + 1, x + len, y + 22, G + 18, M.WOOD_DARK, peint);
  for (let yy = y - 1; yy < y + 24; yy++) { const z = G + 21 - Math.floor((yy - y + 1) / 8); W.box(x - 1, yy, z, x + len + 1, yy + 1, z + 1, M.RES_TOLE); }
  W.box(x - 1, y + 23, G + 15, x + len + 1, y + 24, G + 18, M.WOOD_DARK, peint);
  for (let i = 0; i < 4; i++) for (let xx = x + 3; xx < x + len - 2; xx += 8) W.set(xx, y + 2 + 4 * (3 - i) + 1, G + 2 + 3 * i, M.WOOD_DARK);
  const fr = new Facade(W, LEFT, x, y + 23, len, 1), nwT = Math.ceil(textBitmap(o.nom).w / 2);
  fr.sign(Math.floor((len - nwT) / 2), G + 18, o.nom, { fg: [0.88, 0.86, 0.78], depth: 0 });
}

// ================================================================ les gens et les bêtes de la campagne (1 pixel = 10 cm)
const KK = [0.06, 0.045, 0.04];
const varie = (def, pal) => Object.assign({}, def, { pal: Object.assign({}, def.pal, pal) });
const POULE = { rows: ['.r..', 'kwk.', 'kwwk', '.kk.'], pal: { k: KK, w: [0.86, 0.84, 0.78], r: [0.75, 0.12, 0.10] }, ax: 2, shadowR: 1.5 };
const POULE_ROUSSE = varie(POULE, { w: [0.62, 0.34, 0.16] });
const CORBEAU = { rows: ['.kk..', 'kkkkk', '..k..'], pal: { k: [0.07, 0.07, 0.08] }, ax: 2, shadowR: 1.5 };
const MOUETTE = { rows: ['w...w', 'gwkwg', '.www.'], pal: { w: [0.88, 0.88, 0.86], g: [0.55, 0.56, 0.58], k: KK }, ax: 2, shadow: false };
const PAYSAN = varie(SP.COAT, { c: [0.26, 0.34, 0.50], C: [0.18, 0.24, 0.36], h: [0.40, 0.38, 0.34], j: [0.22, 0.28, 0.42] });
const PECHEUR = varie(SP.WALKER, { q: [0.32, 0.36, 0.22], Q: [0.24, 0.27, 0.16], h: [0.55, 0.52, 0.46] });
const PROMENEUSE = varie(SP.WALKER2, { q: [0.62, 0.26, 0.24], Q: [0.46, 0.18, 0.17] });
const ANCIEN = varie(SP.COAT, { c: [0.36, 0.33, 0.28], C: [0.26, 0.24, 0.20], h: [0.70, 0.70, 0.68] });

// ================================================================ le quartier
function build(W, ctx) {
  const { R } = ctx;
  const night = !!ctx.night, bad = ctx.mood === 'bad', day = !night;
  const w = 1800, h = 364;
  const places = [];
  const obj = o => W.obj(o);
  const paint = (col, pat, extra) => obj(Object.assign({ type: 'cmp_peint', col, pat }, extra || {}));
  const put = (def, x, y, z, extra) => W.sprite(Object.assign({ x, y, z: z != null ? z : SOL(x, y) }, def, extra || {}));
  const S = SPORT.sprites;
  const C = new Carte(w, h);

  // ------------------------------------------------------------ les calques communs
  const FEUILLE = {};
  for (const sp of Object.keys(ESSENCES)) FEUILLE[sp] = obj({ type: 'cmp_feuille', sp });
  const POMMES = obj({ type: 'cmp_feuille', sp: 'pommier', fruit: 0.1, fruitCol: [0.72, 0.15, 0.10] });
  const POIRES = obj({ type: 'cmp_feuille', sp: 'pommier', fruit: 0.07, fruitCol: [0.72, 0.64, 0.26], seed: 3 });
  const ECORCE = {
    chene: obj({ type: 'cmp_ecorce', col: [0.30, 0.26, 0.21] }), hetre: obj({ type: 'cmp_ecorce', col: [0.46, 0.45, 0.42] }),
    peuplier: obj({ type: 'cmp_ecorce', col: [0.50, 0.49, 0.44] }), pommier: obj({ type: 'cmp_ecorce', col: [0.32, 0.25, 0.18] }),
    cedre: obj({ type: 'cmp_ecorce', col: [0.30, 0.22, 0.17] }), tilleul: obj({ type: 'cmp_ecorce', col: [0.36, 0.32, 0.27] }),
    saule: obj({ type: 'cmp_ecorce', col: [0.38, 0.34, 0.27] }), charme: obj({ type: 'cmp_ecorce', col: [0.48, 0.47, 0.44] }),
  };
  const HAIE = obj({ type: 'cmp_haie' }), BUIS = obj({ type: 'cmp_haie', buis: true });
  const PRE = obj({ type: 'cmp_pre', coquelicots: false });
  const PATURE = obj({ type: 'cmp_pre', refus: true, bouses: true, use: true, sec: 0.7, seed: 731 });
  const PRE_FLEURI = obj({ type: 'cmp_pre', fleurs: 0.03, coquelicots: true, seed: 737 });
  const ACCOT = obj({ type: 'cmp_pre', fleurs: 0.02, sec: 0.85, coquelicots: true, seed: 779 });
  const PELOUSE = obj({ type: 'cmp_pre', tonte: true }), PELOUSE_Y = obj({ type: 'cmp_pre', tonte: true, tonteY: true });
  const CH = {
    milieu: obj({ type: 'cmp_chemin', part: 'milieu' }), orniere: obj({ type: 'cmp_chemin', part: 'orniere', bad }),
    bord: obj({ type: 'cmp_chemin', part: 'bord' }), gravier: obj({ type: 'cmp_chemin', part: 'gravier' }), cour: obj({ type: 'cmp_chemin', part: 'cour' }),
  };
  const EAU = obj({ type: 'cmp_eau', nenuphars: 0.3, lentilles: true }), EAU_R = obj({ type: 'cmp_eau', lentilles: true });
  const ROUGE = paint([0.62, 0.15, 0.10]), CREME = paint([0.80, 0.72, 0.42]);
  const GRIS_BOIS = paint([0.50, 0.46, 0.40], 'gris'), BOIS_TRIB = paint([0.52, 0.38, 0.24], 'lames');
  const VERT_SOMBRE = paint([0.16, 0.26, 0.19]);
  for (let i = 0; i < C.mat.length; i++) C.tag[i] = PRE;
  const tree = (x, y, sp, o = {}) => arbre(W, x, y, (o.z0 != null ? o.z0 : SOL(x + 1, y + 1)), sp, Object.assign({ fol: o.fol || FEUILLE[sp === 'arbuste' ? 'charme' : sp] || FEUILLE.chene, bark: ECORCE[sp] || ECORCE.chene }, o));
  const freeAt = (x, y) => C.ok(x, y) && LIBRE.has(C.kind[C.i(x, y)]);
  const lot = (x0, y0, x1, y1, mat, tag = 0, zt = 1, kind = K.LOT) => C.rect(x0, y0, x1, y1, i => { C.kind[i] = kind; C.zt[i] = zt; C.mat[i] = mat; C.tag[i] = tag; C.champ[i] = 0; });
  const disque = (cx, cy, r, fn) => C.rect(cx - r - 1, cy - r - 1, cx + r + 1, cy + r + 1, (i, x, y) => { if (Math.hypot(x + 0.5 - cx, y + 0.5 - cy) <= r) fn(i, x, y); });

  // ============================================================ le plan : les champs
  // Chaque champ : un polygone, une culture, la direction de ses rangs (en degrés), ses options.
  const CHAMPS = [];
  const champ = (P, kind, deg, extra = {}) => {
    const a = deg * Math.PI / 180;
    const o = Object.assign({ type: 'cmp_champ', kind, ang: a, ca: Math.cos(a), sa: Math.sin(a), seed: 900 + CHAMPS.length * 17, bad }, extra);
    if (bad && extra.badKind) o.kind = extra.badKind;
    const id = obj(o), n = CHAMPS.length + 1;
    CHAMPS.push({ P, o, id, n, cut: extra.cut });
    C.poly(P, i => { C.kind[i] = K.CHAMP; C.mat[i] = M.CMP_TERRE; C.tag[i] = id; C.champ[i] = n; });
    return o;
  };
  // au nord, contre la ville
  champ([[384, 6], [470, 6], [432, 122], [384, 122]], 'labour', 0);
  champ([[470, 6], [556, 6], [556, 104], [520, 118], [432, 122]], 'colza', 90);
  champ([[566, 6], [700, 6], [700, 80], [566, 80]], 'chaume', 74, { andains: true });
  champ([[722, 6], [812, 6], [812, 246], [722, 246]], 'ble', 90, { badKind: 'jachere', cut: (x, y) => x >= 796 && y < 132 });
  champ([[812, 6], [886, 6], [886, 222], [858, 246], [812, 246]], 'chaume', 90, { andains: true });
  champ([[1100, 6], [1206, 6], [1206, 98], [1100, 98]], 'mais', 0);
  champ([[1216, 6], [1340, 6], [1340, 70], [1290, 98], [1216, 98]], 'fauche', 30);
  // au sud, jusqu'au bord du monde
  champ([[0, 324], [180, 320], [180, 364], [0, 364]], 'chaume', 0, { andains: true, tint: [1.02, 1.0, 0.96] });
  champ([[180, 320], [372, 310], [372, 364], [180, 364]], 'labour', 72);
  champ([[722, 268], [792, 266], [792, 364], [722, 364]], 'labour', 90, { tint: [0.96, 0.98, 1] });
  champ([[792, 266], [884, 262], [884, 278], [840, 278], [840, 364], [792, 364]], 'chaume', 90);
  champ([[1110, 312], [1236, 312], [1200, 364], [1110, 364]], 'tournesol', 90, { badKind: 'jachere' });
  champ([[1236, 312], [1340, 312], [1340, 364], [1200, 364]], 'ble', 0, { badKind: 'chaume' });
  champ([[1350, 304], [1470, 300], [1420, 364], [1350, 364]], 'chaume', 0, { andains: true });
  champ([[1470, 300], [1560, 298], [1560, 364], [1420, 364]], 'labour', 120, { tint: [1.0, 0.98, 0.97] });
  champ([[1560, 298], [1800, 294], [1800, 364], [1560, 364]], 'mais', 90);

  // ============================================================ les chemins, la route
  // un chemin de terre le long d'une ligne adoucie ; là où il passe l'eau, un pont de planches
  const chemin = (P, hw) => {
    const Q = courbe(P, 5);
    C.bande(Q, hw, (i, x, y, d) => {
      const k = C.kind[i];
      if (k === K.ROUTE || k === K.LOT || k === K.PONT) return;
      C.kind[i] = k === K.EAU ? K.PONT : K.CHEMIN; C.zt[i] = 1; C.champ[i] = 0;
      if (C.kind[i] === K.PONT) { C.mat[i] = M.WOOD; C.tag[i] = 0; return; }
      C.mat[i] = M.CMP_CHEMIN;
      const r = Math.abs(d - hw * 0.55);
      C.tag[i] = d < hw * 0.22 ? CH.milieu : r < hw * 0.22 ? CH.orniere : d > hw * 0.86 ? CH.bord : 0;
    });
    return Q;
  };
  // la départementale : chaussée à z = 0 dans l'axe de la rue du Stade, accotements herbus, fossés peu profonds
  const RX0 = 896, RX1 = 924;
  C.rect(RX0 - 8, 0, RX1 + 8, h, (i, x) => {
    C.champ[i] = 0;
    if (x >= RX0 && x < RX1) { C.kind[i] = K.ROUTE; C.zt[i] = 0; C.mat[i] = M.ASPHALT; C.tag[i] = 0; }
    else if (x < RX0 - 4 || x >= RX1 + 4) { C.kind[i] = K.ACCOT; C.zt[i] = 0; C.mat[i] = M.GRASS; C.tag[i] = PATURE; }
    else { C.kind[i] = K.ACCOT; C.zt[i] = 1; C.mat[i] = M.GRASS; C.tag[i] = ACCOT; }
  });
  // l'étang : une forme d'œuf déformée, la vase, l'eau à z = -1
  const PX = 468, PY = 176;
  C.rect(380, 104, 560, 252, (i, x, y) => {
    const dx = (x + 0.5 - PX) / 72, dy = (y + 0.5 - PY) / 52;
    const r = Math.hypot(dx, dy) + (fbm(x / 22, y / 22, 731) - 0.5) * 0.34;
    if (r < 0.93) { C.kind[i] = K.EAU; C.zt[i] = r < 0.83 ? -1 : 0; C.mat[i] = r < 0.83 ? M.CMP_EAU : M.MUD; C.tag[i] = r < 0.83 ? EAU : 0; C.champ[i] = 0; }
    else if (r < 1.06) { C.kind[i] = K.BERGE; C.zt[i] = 1; C.mat[i] = M.GRASS; C.tag[i] = PRE_FLEURI; C.champ[i] = 0; }
  });
  // le ruisseau qui sort de l'étang et file vers le sud, jusqu'au bord
  const RUISSEAU = courbe([[512, 198], [532, 222], [544, 246], [548, 274], [536, 306], [546, 336], [556, 368]], 4);
  C.bande(RUISSEAU, 7, (i, x, y, d) => {
    if (C.kind[i] === K.EAU) return;
    C.champ[i] = 0;
    if (d < 4.6) { C.kind[i] = K.EAU; C.zt[i] = d < 3.4 ? -1 : 0; C.mat[i] = d < 3.4 ? M.CMP_EAU : M.MUD; C.tag[i] = d < 3.4 ? EAU_R : 0; }
    else { C.kind[i] = K.BERGE; C.mat[i] = M.GRASS; C.tag[i] = PRE_FLEURI; }
  });
  // le chemin rural, d'ouest en est, qui relie tout ; les accès depuis le boulevard
  chemin([[-12, 318], [120, 315], [250, 309], [378, 302], [470, 289], [548, 275], [640, 264], [711, 260], [800, 257], [RX0 - 8, 256]], 6);
  chemin([[RX1 + 8, 256], [1000, 256], [1082, 262], [1122, 296], [1200, 303], [1300, 303], [1360, 297], [1460, 291], [1600, 286], [1812, 288]], 6);
  chemin([[378, -4], [378, 120], [378, 302]], 5);                      // le chemin du Manoir
  chemin([[561, -4], [561, 100], [550, 150], [540, 188]], 4);            // le sentier de l'étang
  chemin([[468, 288], [468, 262], [468, 236]], 3);                      // vers le ponton
  chemin([[1211, -4], [1211, 100]], 4);                                  // le chemin des Vestiaires
  const voie = (x0, x1, y1, terre) => C.rect(x0, 0, x1, y1, (i, x, y) => { // dans l'axe d'une rue : l'enrobé de la ville, puis la terre
    C.kind[i] = K.CHEMIN; C.zt[i] = 1; C.champ[i] = 0;
    if (y < 24) { C.mat[i] = M.ASPHALT; C.tag[i] = 0; C.zt[i] = 0; return; }
    const m = (x0 + x1) / 2, d = Math.abs(x + 0.5 - m);
    if (y < terre) { C.mat[i] = M.GRAVEL; C.tag[i] = CH.gravier; return; }
    C.mat[i] = M.CMP_CHEMIN; C.tag[i] = d < 2.4 ? CH.milieu : Math.abs(d - 6) < 2.4 ? CH.orniere : d > 9.5 ? CH.bord : 0;
  });
  voie(700, 722, 262, 196);                                               // le chemin de la Ferme
  voie(1078, 1100, 262, 0);                                               // le chemin du Stade

  // ============================================================ les lots : parc, cour, place, stade, centre
  // le parc du manoir : prés, pelouses tondues, la cour d'honneur, l'allée, le paddock
  C.rect(12, 16, 358, 300, i => { C.kind[i] = K.PRE; C.mat[i] = M.GRASS; C.tag[i] = PRE; C.champ[i] = 0; });
  lot(104, 150, 268, 298, M.GRASS, PELOUSE_Y);
  lot(118, 150, 252, 232, M.GRAVEL, 0);
  disque(185, 194, 22, i => { C.mat[i] = M.GRASS; C.tag[i] = PELOUSE; });
  lot(175, 232, 195, 302, M.GRAVEL, 0);
  lot(24, 186, 110, 192, M.GRAVEL, 0);
  // la cour de la ferme
  lot(608, 120, 700, 240, M.CMP_CHEMIN, CH.cour);
  lot(698, 156, 702, 194, M.CMP_CHEMIN, CH.cour);
  // le verger : un pré fleuri
  C.rect(566, 270, 700, 364, i => { if (C.kind[i] !== K.EAU && C.kind[i] !== K.BERGE) { C.kind[i] = K.PRE; C.mat[i] = M.GRASS; C.tag[i] = PRE_FLEURI; C.champ[i] = 0; } });
  // la pâture des vaches, au nord du village
  C.rect(936, 6, 1076, 132, i => { C.kind[i] = K.PRE; C.mat[i] = M.GRASS; C.tag[i] = PATURE; C.champ[i] = 0; });
  // la place du village, la terrasse de l'auberge, le parvis pavé
  lot(934, 172, 1012, 250, M.GRAVEL, 0);
  lot(1012, 184, 1078, 250, M.COBBLE, 0);
  // les jardins des maisons du village
  lot(944, 312, 978, 344, M.RES_POTAGER, 0);
  lot(994, 306, 1040, 364, M.GRASS, PELOUSE);
  lot(1054, 316, 1094, 346, M.RES_POTAGER, 0);
  lot(846, 318, 878, 346, M.RES_POTAGER, 0);
  // le stade du village : la pelouse usée, ses lignes (le calque du terrain annexe)
  const SLX0 = 1138, SLX1 = 1310, SLY0 = 146, SLY1 = 258, SCX = (SLX0 + SLX1) / 2, SCY = (SLY0 + SLY1) / 2;
  lot(1110, 104, 1336, 292, M.GRASS, PELOUSE);
  const turf = obj({ type: 'esp_turf', bad, x0: 1124, cx: SCX, cy: SCY, coachY: SLY0 - 1, goals: [[SLX0 + 5, SCY], [SLX1 - 5, SCY]], L: { A0: 2 * SLX0, A1: 2 * SLX1, B0: 2 * SLY0, B1: 2 * SLY1 }, rc: 36, box: 50, boxW: 64, ga: 20, gaW: 36, spot: 36, arc: 32 });
  lot(1124, 132, 1324, 272, M.GRASS, turf);
  // le centre du Bois-Joli : l'allée et le parking, le trottoir, les deux pelouses impeccables
  lot(1340, 0, 1358, 40, M.ASPHALT, 0, 0);
  lot(1340, 40, 1446, 114, M.ASPHALT, 0, 0);
  lot(1356, 96, 1800, 276, M.GRASS, PELOUSE);
  lot(1360, 100, 1796, 116, M.CONCRETE, 0);
  const PITCHES = [];
  for (const px0 of [1360, 1584]) {
    const px1 = px0 + 212, py0 = 122, py1 = 254, LX0 = px0 + 12, LX1 = px1 - 12, LY0 = py0 + 10, LY1 = py1 - 10;
    const o = obj({ type: 'cmp_gazon', bad, x0: px0, y0: py0, L: { A0: 2 * LX0, A1: 2 * LX1, B0: 2 * LY0, B1: 2 * LY1 }, rc: 36, box: 50, boxW: 64, ga: 18, gaW: 34, spot: 34, arc: 30 });
    lot(px0, py0, px1, py1, M.GRASS, o);
    PITCHES.push({ px0, px1, py0, py1, LX0, LX1, LY0, LY1, CY: Math.round((LY0 + LY1) / 2), CX: Math.round((LX0 + LX1) / 2) });
  }
  // le sous-bois du Bois-Joli, la pâture humide au sud de l'étang
  const SOUSBOIS = obj({ type: 'cmp_pre', sousbois: true });
  C.rect(1660, 0, 1800, 98, i => { C.kind[i] = K.PRE; C.mat[i] = M.GRASS; C.tag[i] = SOUSBOIS; C.champ[i] = 0; });
  C.rect(388, 296, 532, 364, i => { if (C.kind[i] === K.PRE || C.kind[i] === K.CHAMP) { C.kind[i] = K.PRE; C.mat[i] = M.GRASS; C.tag[i] = PATURE; C.champ[i] = 0; } });
  // l'accotement du boulevard : une bande d'herbe entre le trottoir de la ville et les champs
  C.rect(364, 0, 1436, 5, i => { if (C.kind[i] === K.PRE || C.kind[i] === K.CHAMP) { C.kind[i] = K.ACCOT; C.mat[i] = M.GRASS; C.tag[i] = ACCOT; C.champ[i] = 0; } });

  // ============================================================ les bandes enherbées au bord des champs
  const bord = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = C.i(x, y), n = C.champ[i];
    if (!n) continue;
    for (let dy = -2; dy <= 2 && !bord[i]; dy++) for (let dx = -2; dx <= 2; dx++) {
      const xx = x + dx, yy = y + dy;
      if (C.ok(xx, yy) && C.champ[C.i(xx, yy)] !== n) { bord[i] = 1; break; }
    }
  }
  for (let i = 0; i < w * h; i++) if (bord[i]) { C.kind[i] = K.PRE; C.mat[i] = M.GRASS; C.tag[i] = ACCOT; C.champ[i] = 0; }

  // ============================================================ les haies (le bocage)
  const HAIES = [], HAIES_ARBRES = [];
  const haie = (P, o = {}) => {
    const Q = courbe(P, 4), hw = o.hw || 2.2, hmin = o.h || 5;
    C.bande(Q, hw, (i, x, y, d, t) => {
      if (!LIBRE.has(C.kind[i])) return;
      C.kind[i] = K.HAIE; C.champ[i] = 0; C.mat[i] = M.GRASS; C.tag[i] = ACCOT;
      HAIES.push([x, y, Math.round(hmin + 3 * fbm(t / 9, 0.5, 841) - (d > hw - 0.8 ? 1.5 : 0)), o.buis ? BUIS : HAIE]);
    });
    if (o.arbres) {
      let acc = o.arbres * 0.5;
      for (let k = 1; k < Q.length; k++) {
        acc += Math.hypot(Q[k][0] - Q[k - 1][0], Q[k][1] - Q[k - 1][1]);
        if (acc > o.arbres) { acc = -R() * o.arbres * 0.4; const [tx, ty] = Q[k]; HAIES_ARBRES.push([Math.round(tx), Math.round(ty), o.essence || (R() < 0.7 ? 'chene' : 'hetre')]); }
      }
    }
  };
  haie([[470, 10], [432, 120]], { arbres: 44 });
  haie([[384, 126], [520, 124], [556, 110]], { h: 4 });
  haie([[566, 84], [700, 84]], { h: 4, arbres: 48 });
  haie([[0, 328], [84, 326]], { arbres: 40 }); haie([[100, 326], [176, 324]], { arbres: 40 });
  haie([[180, 326], [180, 364]], { h: 6, arbres: 30 });
  haie([[386, 296], [386, 364]], { h: 5 });
  haie([[1110, 102], [1206, 102]], { h: 4 });
  haie([[1220, 102], [1290, 102], [1340, 74]], { h: 4, arbres: 40 });
  haie([[1236, 314], [1200, 364]], { h: 6, arbres: 30 });
  haie([[1560, 300], [1560, 364]], { h: 5, arbres: 34 });
  haie([[1468, 304], [1420, 364]], { h: 5, arbres: 30 });
  haie([[1446, 30], [1660, 30]], { h: 5, essence: 'charme', arbres: 36 });
  haie([[838, 284], [838, 362]], { h: 4 });
  // les haies du village : entre les jardins, et la charmille du stade
  haie([[986, 304], [986, 364]], { h: 5 }); haie([[1046, 304], [1046, 364]], { h: 5 });
  haie([[1106, 104], [1106, 194]], { h: 6, hw: 2 }); haie([[1106, 212], [1106, 292]], { h: 6, hw: 2 });

  // ============================================================ l'ondulation des champs et des prés
  // Le sol reste plat (un relief en marches dessinait des fissures : les contours du moteur), et l'ondulation est
  // peinte, comme l'ombrage d'une colline très douce, par les calques des champs et des prés (OMBRE). Elle
  // s'efface près des chemins, des haies, de l'eau, des bâtiments (leurs emprises ci-dessous) et des bords.
  const EMPRISES = [[20, 154, 98, 196], [594, 82, 682, 126], [678, 88, 702, 112], [568, 118, 610, 244], [936, 132, 1008, 176], [1014, 100, 1058, 190],
    [936, 268, 984, 304], [986, 266, 1044, 306], [1046, 270, 1100, 306], [838, 278, 884, 316], [1446, 26, 1664, 100], [1358, 18, 1376, 36], [860, 222, 880, 242],
    [1012, 332, 1034, 352], [1074, 346, 1096, 364], [6, 12, 362, 18], [6, 12, 16, 302], [354, 12, 362, 306], [6, 294, 362, 306], [22, 194, 112, 292], [936, 300, 1100, 364]];
  for (const [x0, y0, x1, y1] of EMPRISES) C.rect(x0, y0, x1, y1, i => { if (C.kind[i] === K.PRE) C.kind[i] = K.LOT; });
  const OMBRE = new Float32Array(w * h).fill(1);
  {
    const n = w * h, ok = new Uint8Array(n), D = new Float32Array(n);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x;
      ok[i] = (C.kind[i] === K.CHAMP || C.kind[i] === K.PRE) && x > 0 && y > 0 && x < w - 1 && y < h - 1 ? 1 : 0;
      D[i] = ok[i] ? 1e6 : 0;
    }
    for (let y = 1; y < h; y++) for (let x = 1; x < w - 1; x++) { const i = y * w + x; if (D[i]) D[i] = Math.min(D[i], D[i - 1] + 1, D[i - w] + 1, D[i - w - 1] + 1.414, D[i - w + 1] + 1.414); }
    for (let y = h - 2; y >= 0; y--) for (let x = w - 2; x >= 1; x--) { const i = y * w + x; if (D[i]) D[i] = Math.min(D[i], D[i + 1] + 1, D[i + w] + 1, D[i + w + 1] + 1.414, D[i + w - 1] + 1.414); }
    // la colline imaginaire (24 voxels de haut au plus, sur une centaine de long), puis son ombrage
    const Hm = new Float32Array(n);
    for (let i = 0; i < n; i++) { const x = i % w, y = (i - x) / w; Hm[i] = 24 * fbm(x / 120, y / 85, 951); }
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x, xa = Math.max(0, x - 2), xb = Math.min(w - 1, x + 2), ya = Math.max(0, y - 2), yb = Math.min(h - 1, y + 2);
      const hx = (Hm[y * w + xb] - Hm[y * w + xa]) / (xb - xa), hy = (Hm[yb * w + x] - Hm[ya * w + x]) / (yb - ya);
      // le soleil vient de −x, +y : les pentes tournées vers lui s'éclairent ; près des chemins et des bords, le sol redevient plat
      const k = clamp((D[i] - 2) / 14, 0, 1);
      OMBRE[i] = clamp(1 + 2.4 * (0.35 * hx - 0.40 * hy) * k, 0.82, 1.18);
    }
  }
  for (const id of [...CHAMPS.map(F => F.id), PRE, PATURE, PRE_FLEURI, ACCOT, SOUSBOIS]) { W.objects[id].ombre = OMBRE; W.objects[id].ow = w; W.objects[id].oh = h; }
  const sol = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y); return C.ok(xi, yi) ? Math.max(1, C.zt[C.i(xi, yi)] + 1) : G; };
  SOL = sol;
  // ============================================================ le sol, posé colonne par colonne
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = C.i(x, y), z = C.zt[i];
    if (C.kind[i] === K.PONT) {
      W.set(x, y, 1, M.WOOD, BOIS_TRIB); W.set(x, y, 0, 0); W.set(x, y, -1, M.CMP_EAU, EAU_R); W.set(x, y, -2, M.SOIL);
      continue;
    }
    for (let zz = z + 1; zz <= 1; zz++) W.set(x, y, zz, 0);
    for (let zz = -3; zz < Math.min(z, 1); zz++) W.set(x, y, zz, M.SOIL);
    for (let zz = 1; zz < z; zz++) W.set(x, y, zz, C.mat[i], C.tag[i]);
    W.set(x, y, z, C.mat[i], C.tag[i]);
  }
  // le pont de planches du chemin rural sur le ruisseau : ses garde-corps
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    if (C.kind[C.i(x, y)] !== K.PONT) continue;
    const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => C.kind[C.i(x + dx, y + dy)] === K.CHEMIN);
    if (nb) { W.box(x, y, -1, x + 1, y + 1, 1, M.WOOD_DARK); continue; }
    const side = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => C.kind[C.i(x + dx, y + dy)] === K.BERGE || C.kind[C.i(x + dx, y + dy)] === K.PRE);
    if (side) { W.set(x, y, 2, M.WOOD_DARK); if ((x + y) % 4 === 0) W.box(x, y, 2, x + 1, y + 1, 5, M.WOOD_DARK); W.set(x, y, 4, M.WOOD_DARK); }
  }
  // les cultures sur pied
  for (const F of CHAMPS) {
    const o = F.o, kind = o.kind, hgt = { ble: 3, mais: 8, tournesol: 6, colza: 1 }[kind];
    if (!hgt) continue;
    C.poly(F.P, (i, x, y) => {
      if (C.champ[i] !== F.n) return;
      const X = x + 0.5, Y = y + 0.5, s = -X * o.sa + Y * o.ca;
      let top = hgt;
      if (kind === 'ble') { const f = frac(s / 24); if ((f > 0.46 && f < 0.5) || (f > 0.54 && f < 0.58)) return; if (F.cut && F.cut(x, y)) return; }
      else if (kind === 'mais') { if (frac(s / 2) < 0.5) return; top = hgt + (hash(x, y, 851, 0) < 0.3 ? 1 : 0); }
      else if (kind === 'tournesol') { if (frac(s / 2.5) < 0.3) return; top = hgt + (hash(x, y, 852, 0) < 0.4 ? 1 : 0); }
      else if (kind === 'colza') { const f = frac(s / 2.2); if (f < 0.3 || f > 0.7 || hash(x, y, 853, 0) < 0.45) return; }
      const z0 = C.zt[i] + 1;
      W.box(x, y, z0, x + 1, y + 1, z0 + top, M.CMP_CULTURE, F.id);
    });
  }
  // les haies, leurs arbres
  for (const [x, y, hh, t] of HAIES) W.box(x, y, G, x + 1, y + 1, G + Math.max(2, hh), M.HEDGE, t);
  for (const [x, y, sp] of HAIES_ARBRES) tree(x - 1, y - 1, sp, { seed: x * 31 + y, k: 0.85 + 0.3 * hash(x, y, 861, 0) });

  // ============================================================ le manoir de la Motte, derrière ses grilles et ses arbres
  {
    // le mur du parc au nord (contre la cité), la grille au sud et à l'est, le portail et son portillon
    W.box(10, 14, G, 360, 16, G + 9, M.CMP_MOELLON); W.box(10, 14, G + 9, 360, 16, G + 10, M.STONE);
    // à l'ouest, au bord du monde : pas de mur, une lisière (la haie épaisse et ses arbres)
    for (let yy = 16; yy < 300; yy++) for (let xx = 8; xx < 14; xx++) { const hh = Math.round(5 + 3 * fbm(yy / 9, xx / 3, 842) - (xx < 9 || xx > 12 ? 2 : 0)); W.box(xx, yy, G, xx + 1, yy + 1, G + hh, M.HEDGE, HAIE); }
    for (let yy = 30; yy < 300; yy += 34) tree(6 + Math.round(hash(yy, 1, 843, 0) * 4), yy + Math.round(hash(yy, 2, 843, 0) * 10), hash(yy, 3, 843, 0) < 0.6 ? 'chene' : 'charme', { k: 0.9 + 0.3 * hash(yy, 4, 843, 0) });
    grille(W, 'x', 300, 12, 360, { trous: [[171, 199], [205, 211]] });
    grille(W, 'y', 358, 16, 300);
    for (const px of [171, 195]) {
      W.box(px, 297, G, px + 4, 303, G + 18, M.STONE); W.box(px - 1, 296, G + 18, px + 5, 304, G + 19, M.STONE);
      W.box(px + 1, 298, G + 19, px + 3, 302, G + 20, M.STONE); W.box(px, 297, G + 20, px + 4, 303, G + 22, M.STONE); W.box(px + 1, 298, G + 22, px + 3, 302, G + 23, M.STONE);
      W.box(px + 1, 303, G + 14, px + 3, 304, G + 17, M.METAL_DARK); W.box(px + 1, 304, G + 15, px + 3, 305, G + 16, night && !bad ? M.BULB : M.GLASS);
      if (night && !bad) W.light({ x: px + 2, y: 306.5, z: G + 15, r: 44, cr: 1.3, cg: 0.88, cb: 0.42, skip: 1.5, spot: 0.3 });
    }
    const vantail = (x0, y0, axe, n) => {
      for (let k = 0; k < n; k++) {
        const xx = axe === 'x' ? x0 + k : x0, yy = axe === 'x' ? y0 : y0 - k, top = G + 13 + Math.round(2 * Math.sin(Math.PI * (k + 0.5) / n));
        for (let z = G; z < top; z++) if (k % 2 === 0 || z === G + 1 || z === G + 6) W.set(xx, yy, z, M.METAL_DARK);
        W.set(xx, yy, top, M.METAL_DARK); if (k % 2 === 0) W.set(xx, yy, top + 1, M.METAL_DARK);
      }
    };
    if (bad) {
      vantail(175, 300, 'x', 10); vantail(185, 300, 'x', 10);
      W.box(184, 301, G + 6, 186, 302, G + 9, M.CHROME);
      panneau(W, LEFT, 212, 303, G + 14, 'À VENDRE', { fond: [0.86, 0.85, 0.80], encre: [0.62, 0.10, 0.10] });
    } else { vantail(175, 299, 'y', 10); vantail(194, 299, 'y', 10); }
    vantail(205, 299, 'y', 6);
    // la maison, les communs, le paddock
    const mo = manoir(W, { x: 130, y: 100, night, bad });
    places.push({ key: 'manoir', label: 'Le manoir de la Motte', x: mo.porte[0], y: mo.porte[1] - 1, z: G + 12 });
    communs(W, { x: 24, y: 158, night, bad, bois: GRIS_BOIS });
    barbele(W, [[24, 196], [110, 196], [110, 290], [24, 290], [24, 196]], { blanc: true, step: 6 });
    // la cour d'honneur : le bassin rond, les parterres de buis, les vases de l'allée
    for (let yy = -7; yy <= 7; yy++) for (let xx = -7; xx <= 7; xx++) {
      const d = Math.hypot(xx + 0.5, yy + 0.5);
      if (d < 6.6 && d > 5.2) W.box(185 + xx, 194 + yy, G, 186 + xx, 195 + yy, G + 2, M.STONE);
      else if (d <= 5.2) W.box(185 + xx, 194 + yy, G, 186 + xx, 195 + yy, G + 1, M.CMP_EAU, EAU_R);
    }
    W.box(184, 193, G, 187, 196, G + 4, M.STONE); W.box(185, 194, G + 4, 186, 195, G + 6, M.STONE);
    for (const [x0, x1] of [[126, 160], [210, 244]]) {
      for (let x = x0; x < x1; x++) for (const y of [176, 213]) W.box(x, y, G, x + 1, y + 1, G + 2, M.HEDGE, BUIS);
      for (let y = 176; y < 214; y++) for (const x of [x0, x1 - 1]) W.box(x, y, G, x + 1, y + 1, G + 2, M.HEDGE, BUIS);
      for (let x = x0 + 2; x < x1 - 2; x++) W.box(x, 194, G, x + 1, 195, G + 2, M.HEDGE, BUIS);
      for (let y = 178; y < 212; y++) W.box(Math.floor((x0 + x1) / 2), y, G, Math.floor((x0 + x1) / 2) + 1, y + 1, G + 2, M.HEDGE, BUIS);
      for (let y = 178; y < 212; y++) for (let x = x0 + 1; x < x1 - 1; x++) if (W.get(x, y, G) === 0 && hash(x, y, 881, 0) < 0.5) W.set(x, y, G, M.RES_FLEURS);
    }
    for (const vx of [170, 199]) { W.box(vx, 230, G, vx + 3, 233, G + 4, M.STONE); W.box(vx - 1, 229, G + 4, vx + 4, 234, G + 6, M.STONE); W.box(vx, 230, G + 6, vx + 3, 233, G + 7, M.HEDGE, BUIS); }
    // les arbres du parc : le cèdre, les grands chênes et hêtres du fond, les tilleuls de l'allée
    tree(56, 112, 'cedre', { h: 44 });
    for (const [tx, ty, sp] of [[34, 42, 'hetre'], [88, 30, 'chene'], [146, 40, 'hetre'], [206, 34, 'chene'], [262, 44, 'hetre'], [318, 34, 'chene'], [300, 104, 'chene'], [332, 172, 'hetre'], [286, 238, 'chene'], [328, 270, 'tilleul'], [42, 70, 'chene'], [104, 70, 'tilleul']])
      tree(tx, ty, sp, { k: 0.95 + 0.25 * hash(tx, ty, 882, 0) });
    for (const ty of [240, 258, 276]) { tree(164, ty, 'tilleul', { k: 0.85 }); tree(204, ty, 'tilleul', { k: 0.85 }); }
    if (day && !bad) B.car(W, 218, 162, G, 'x', M.CAR_BLUE);
  }

  // ============================================================ l'étang, son ponton, sa barque ; le ruisseau et ses peupliers
  {
    const ROSEAU = obj({ type: 'cmp_roseau' });
    // les roseaux en massifs, surtout sur la rive du fond (devant, ils cacheraient l'eau)
    C.rect(380, 104, 560, 252, (i, x, y) => {
      const dx = (x + 0.5 - PX) / 72, dy = (y + 0.5 - PY) / 52;
      const r = Math.hypot(dx, dy) + (fbm(x / 22, y / 22, 731) - 0.5) * 0.34;
      if (r < 0.76 || r > 0.96) return;
      if (x >= 452 && x < 486 && y > 190) return;              // le ponton et la barque
      const front = clamp((y - PY - 6) / 30, 0, 1) * 0.35;      // la rive sud, plus clairsemée
      const massif = fbm(x / 9, y / 9, 891);
      if (massif < 0.5 + front) return;
      const z = C.zt[i], hgt = Math.round(1 + 5 * clamp((massif - 0.5) * 3, 0, 1) * (0.4 + 0.6 * hash(x, y, 894, 0)) + hash(x, y, 892, 0) * 3);
      if (hash(x, y, 893, 0) < 0.55) W.box(x, y, z + 1, x + 1, y + 1, z + 1 + hgt, M.WEED, ROSEAU);
    });
    // le ponton de planches grises, ses pieux, la barque amarrée
    W.box(462, 204, 1, 474, 236, 2, M.WOOD, GRIS_BOIS);
    for (const [xx, yy] of [[462, 204], [473, 204], [462, 216], [473, 216], [462, 228], [473, 228]]) W.box(xx, yy, -1, xx + 1, yy + 1, 4, M.WOOD_DARK);
    W.box(473, 205, 4, 474, 206, 5, M.WOOD_DARK);
    barque(W, 475, 206, 0, 'y');
    W.box(464, 205, 2, 472, 207, 3, M.WOOD_DARK); W.box(464, 205, 3, 465, 207, 4, M.WOOD_DARK); W.box(471, 205, 3, 472, 207, 4, M.WOOD_DARK);
    // la lanterne du pêcheur, au pied du ponton : le seul point de lumière de l'étang la nuit
    W.box(472, 230, 2, 473, 231, 8, M.WOOD_DARK); W.set(472, 231, 7, M.METAL_DARK); W.set(472, 232, 7, M.METAL_DARK); W.set(472, 232, 6, night && !bad ? M.BULB : M.GLASS);
    if (night && !bad) W.light({ x: 472.5, y: 233.5, z: 6, r: 30, cr: 1.0, cg: 0.66, cb: 0.30, skip: 1.2, spot: 0.3 });
    places.push({ key: 'etang', label: "L'étang", x: 468, y: 226, z: G + 12 });
    tree(394, 186, 'saule', { r: 10 }); tree(532, 136, 'saule', { r: 8 });
    for (let k = 7; k < RUISSEAU.length - 1; k += 4) { const [px, py] = RUISSEAU[k]; if (Math.abs(py - 275) < 9) continue; tree(Math.round(px - 11), Math.round(py), 'peuplier', { h: 40 + Math.round(hash(k, 3, 871, 0) * 8) }); }
  }

  // ============================================================ la ferme Lacombe : le logis, la grange, le hangar, le pigeonnier, la cour
  {
    logis(W, { x: 598, y: 86, night, bad, porte: paint([0.28, 0.36, 0.30], 'planches') });
    places.push({ key: 'ferme', label: 'La ferme Lacombe', x: 638.5, y: 124, z: G + 12 });
    pigeonnier(W, 690, 100);
    grange(W, { x: 572, y: 122, w: 36, d: 74, ouverte: !bad, bois: GRIS_BOIS });
    if (night && !bad) { W.set(607, 158, G + 18, M.BULB); W.light({ x: 610, y: 158.5, z: G + 17, r: 34, cr: 0.9, cg: 0.6, cb: 0.28, skip: 1.5, spot: 0.4 }); }
    hangar(W, { x: 572, y: 196, w: 36, d: 44, bois: GRIS_BOIS });
    for (let k = 0; k < 4; k++) { botte(W, 576, 200 + 9 * k, G, 'x'); if (k < 3) botte(W, 576, 204 + 9 * k, G + 7, 'x'); }
    maison(W, { x: 680, y: 122, w: 20, d: 26, hz: 12, mur: M.CMP_MOELLON, fen: [['g', 14, 0]], volet: M.SHUTTER_GREY, porte: 7, portePeint: GRIS_BOIS, chaines: false });
    // le portail sur le chemin : deux piliers, la poutre, l'enseigne de bois
    for (const py of [152, 194]) { W.box(698, py, G, 702, py + 4, G + 15, M.CMP_MOELLON); W.box(697, py - 1, G + 15, 703, py + 5, G + 16, M.STONE); }
    W.box(699, 152, G + 16, 701, 198, G + 17, M.WOOD_DARK);
    panneau(W, RIGHT, 700, 187, G + 22, 'FERME LACOMBE', { fond: [0.36, 0.24, 0.15], encre: [0.88, 0.80, 0.58], poteaux: false, worn: bad ? 0.3 : 0.03 });
    for (const [a, b] of [[608, 700]]) for (let x = a; x < b; x++) { if (x >= 640 && x < 656) continue; W.box(x, 240, G, x + 1, 242, G + 4, M.CMP_MOELLON); W.set(x, 240, G + 4, M.STONE); W.set(x, 241, G + 4, M.STONE); }
    for (const [y0, y1] of [[148, 152], [198, 240]]) W.box(698, y0, G, 700, y1, G + 4, M.CMP_MOELLON);
    if (!bad) { W.box(696, 156, G, 698, 168, G + 12, M.WOOD, GRIS_BOIS); W.box(696, 182, G, 698, 194, G + 12, M.WOOD, GRIS_BOIS); }
    else { W.box(699, 156, G, 700, 194, G + 10, M.WOOD, GRIS_BOIS); panneau(W, RIGHT, 703, 186, G + 12, 'À VENDRE', { fond: [0.86, 0.85, 0.80], encre: [0.62, 0.10, 0.10] }); }
    if (!bad) panneau(W, RIGHT, 703, 214, G + 10, 'OEUFS FRAIS', { fond: [0.84, 0.80, 0.68], encre: [0.36, 0.20, 0.10] });
    // la cour : le puits, le tilleul, le tas de fumier, la remorque de bottes, le bois de chauffage
    puits(W, 652, 168, G);
    tree(682, 214, 'tilleul', { k: 1.1 });
    for (let yy = 204; yy < 228; yy++) for (let xx = 612; xx < 636; xx++) {
      const d = Math.hypot((xx - 624) / 12, (yy - 216) / 12); if (d >= 1) continue;
      const hh = Math.round(5 * (1 - d * d) + hash(xx, yy, 894, 0)); if (hh > 0) W.box(xx, yy, G, xx + 1, yy + 1, G + hh, hash(xx, yy, 895, 0) < 0.18 ? M.CMP_PAILLE : M.MUD);
    }
    remorque(W, 640, 224, G, 'x', -1, { charge: 2, plateau: GRIS_BOIS });
    for (let k = 0; k < 3; k++) W.box(598, 120, G + k * 2, 605, 123, G + k * 2 + 2, k % 2 ? M.WOOD_DARK : M.WOOD);
    if (night || bad) tracteur(W, 650, 192, G, 'x', 1, { peint: ROUGE, jante: CREME });
  }

  // ============================================================ le verger : pommiers et poiriers en quinconce, les ruches
  {
    for (let r = 0; r < 4; r++) for (let k = 0; k < 7; k++) {
      const tx = 576 + 17 * k + (r % 2 ? 8 : 0), ty = 282 + 21 * r;
      if (tx > 694) continue;
      tree(tx, ty, 'pommier', { fol: hash(tx, ty, 896, 0) < 0.25 ? POIRES : POMMES, k: 1.1 + 0.3 * hash(tx, ty, 897, 0), seed: tx * 13 + ty });
    }
    for (const [rx, ry] of [[676, 272], [684, 272], [692, 272]]) ruche(W, rx, ry);
    const zc = Math.max(SOL(604, 296), SOL(616, 299)), ze = SOL(599, 292);
    W.box(604, 296, zc, 610, 300, zc + 3, M.CRATE_RED); W.box(604, 296, zc + 3, 610, 300, zc + 4, M.RES_FRUITS);
    W.box(611, 296, zc, 617, 300, zc + 3, M.CRATE_GREEN); W.box(611, 296, zc + 3, 617, 300, zc + 4, M.RES_FRUITS);
    for (let k = 0; k < 12; k++) { W.set(598, 290 + Math.floor(k / 2), ze + k, M.WOOD); W.set(601, 290 + Math.floor(k / 2), ze + k, M.WOOD); if (k % 2 === 0) { W.set(599, 290 + Math.floor(k / 2), ze + k, M.WOOD); W.set(600, 290 + Math.floor(k / 2), ze + k, M.WOOD); } }
  }

  // ============================================================ la moisson, les labours ; le tracteur, ses bottes, ses oiseaux
  {
    const bottes = [[820, 24], [846, 30], [872, 22], [828, 62], [858, 70], [824, 104], [868, 112], [842, 146], [878, 150], [820, 196], [834, 226]];
    for (const [bx, by] of bottes) { const i = C.i(bx, by); if (C.kind[i] === K.CHAMP || C.kind[i] === K.PRE) botte(W, bx, by, Math.max(SOL(bx, by), SOL(bx + 6, by + 6)), hash(bx, by, 898, 0) < 0.5 ? 'x' : 'y'); }
    for (const [bx, by] of [[16, 340], [60, 344], [104, 336], [140, 350], [600, 30], [640, 46], [676, 26], [1380, 330], [1430, 340], [1480, 326], [1520, 344]]) botte(W, bx, by, Math.max(SOL(bx, by), SOL(bx + 6, by + 6)), hash(bx, by, 899, 0) < 0.5 ? 'x' : 'y');
    meule(W, 586, 50, Math.max(SOL(586, 50), SOL(605, 57)), 3, 5);
    if (day && !bad) {
      tracteur(W, 760, 290, solSous(760, 290, 'y', 23, 11), 'y', 1, { peint: ROUGE, jante: CREME, charrue: true });
      for (let k = 0; k < 7; k++) put(k < 4 ? MOUETTE : CORBEAU, 754 + hash(k, 1, 901, 0) * 24, 268 + hash(k, 2, 901, 0) * 20, G + (k < 4 ? 8 + k * 2 : 0));
      tracteur(W, 856, 174, solSous(856, 174, 'y', 23, 11), 'y', -1, { peint: paint([0.20, 0.36, 0.24]), jante: CREME });
      remorque(W, 856, 196, solSous(856, 196, 'y', 34, 11), 'y', -1, { charge: 2, plateau: GRIS_BOIS });
      put(PAYSAN, 872, 206);
      moissonneuse(W, 804, 96, solSous(800, 96, 'y', 41, 30), 'y', 1, { caisse: paint([0.80, 0.74, 0.56]), rouge: ROUGE });
    }
    for (let k = 0; k < 9; k++) put(CORBEAU, 230 + hash(k, 3, 902, 0) * 120, 322 + hash(k, 4, 902, 0) * 34);
  }

  // ============================================================ la départementale : les panneaux, la borne, le calvaire, la voiture
  {
    const rougeBord = paint([0.70, 0.12, 0.10]);
    panneau(W, LEFT, 932, 10, G + 16, 'AUBÉRIVE', { bord: rougeBord, fond: [0.88, 0.87, 0.82], encre: [0.06, 0.06, 0.06], poteaux: [1, 16] });
    panneau(W, LEFT, 932, 352, G + 16, 'LA MOTTE', { bord: rougeBord, fond: [0.88, 0.87, 0.82], encre: [0.06, 0.06, 0.06], poteaux: [1, 15] });
    panneau(W, LEFT, 930, 270, G + 18, 'BOIS-JOLI', { fond: [0.88, 0.87, 0.82], encre: [0.06, 0.06, 0.06], poteaux: [2] });
    panneau(W, LEFT, 930, 270, G + 13, 'VALDORNE 14', { fond: [0.88, 0.87, 0.82], encre: [0.06, 0.06, 0.06], poteaux: false });
    borne(W, 889, 120, ROUGE); borne(W, 927, 300, ROUGE);
    calvaire(W, 864, 226, G);
    tree(866, 204, 'tilleul', { k: 1.05 });
    if (night) {
      B.car(W, 899, 300, 1, 'y', M.CAR_BORD);
      W.set(900, 300, 4, M.HEADLIGHT); W.set(905, 300, 4, M.HEADLIGHT); W.set(900, 318, 4, M.TAILLIGHT); W.set(905, 318, 4, M.TAILLIGHT);
      W.light({ x: 902.5, y: 297, z: 4.5, r: 110, fall: 1.4, cr: 1.2, cg: 1.12, cb: 0.9, axis: [0, -0.99, -0.13], c0: 0.84, c1: 0.97, spill: 0, skip: 1 });
      W.light({ x: 902.5, y: 296, z: 3, r: 16, cr: 0.6, cg: 0.58, cb: 0.48, shadow: false });
    } else if (!bad) put(S.BIKE_B, 916, 168);
  }

  // ============================================================ le village de la Motte : l'auberge, l'église, la place, les maisons
  {
    auberge(W, { x: 940, y: 136, night, bad });
    places.push({ key: 'auberge', label: "L'auberge du Relais", x: 981, y: 176, z: G + 12 });
    if (!bad) {
      if (day) for (const [tx, ty] of [[948, 178], [964, 184], [994, 180]]) { B.terraceTable(W, tx, ty, G); B.chair(W, tx - 3, ty, G, 'x'); B.chair(W, tx + 4, ty + 1, G, 'x'); }
      if (day) { B.parasol(W, 950, 180, G); B.parasol(W, 996, 182, G); }
      // la guirlande d'ampoules au-dessus de la terrasse
      for (const px of [938, 1008]) W.box(px, 192, G, px + 1, 193, G + 16, M.WOOD_DARK);
      for (let x = 938; x <= 1008; x++) { const t = (x - 938) / 70, z = Math.round(G + 15 - 3 * Math.sin(Math.PI * t)); W.set(x, 192, z, M.METAL_DARK); if ((x - 938) % 6 === 3) W.set(x, 192, z - 1, night ? M.BULB : M.GLASS); }
      if (night) { W.light({ x: 958, y: 194, z: G + 11, r: 26, cr: 0.7, cg: 0.5, cb: 0.25, shadow: false }); W.light({ x: 988, y: 194, z: G + 11, r: 26, cr: 0.7, cg: 0.5, cb: 0.25, shadow: false }); }
    }
    tree(936, 200, 'tilleul', { k: 1.0 }); tree(1006, 202, 'tilleul', { k: 0.95 });
    eglise(W, { x: 1018, y: 104, night, bad });
    // la place : le monument, les bancs, la pompe, les réverbères
    W.box(976, 220, G, 986, 230, G + 2, M.STONE); W.box(978, 222, G + 2, 984, 228, G + 4, PIERRE_EGLISE); W.box(979, 223, G + 4, 983, 227, G + 20, PIERRE_EGLISE);
    for (let k = 0; k < 3; k++) W.box(980 + (k > 1 ? 1 : 0), 224 + (k > 1 ? 1 : 0), G + 20 + k, 982 - (k > 1 ? 0 : 0), 226, G + 21 + k, PIERRE_EGLISE);
    for (let a = 0; a < 40; a++) { const t = a / 40 * Math.PI * 2, xx = Math.round(981 + Math.cos(t) * 8), yy = Math.round(225 + Math.sin(t) * 8); W.box(xx, yy, G, xx + 1, yy + 1, G + 2, M.METAL_DARK); }
    for (const [dx, dy] of [[-4, 5], [4, 5], [5, -1]]) W.box(981 + dx, 225 + dy, G, 982 + dx, 226 + dy, G + 1, M.RES_FLEURS);
    B.bench(W, 1022, 240, G, 'x'); B.bench(W, 1046, 240, G, 'x'); B.bench(W, 950, 238, G, 'x');
    W.box(1066, 212, G, 1068, 214, G + 7, M.METAL_GREEN); W.box(1067, 211, G + 6, 1068, 212, G + 7, M.METAL_GREEN); W.box(1066, 208, G + 6, 1067, 212, G + 7, M.METAL_GREEN); W.box(1065, 214, G, 1069, 218, G + 1, M.STONE);
    reverbere(W, 1010, 198, night); reverbere(W, 940, 246, night); reverbere(W, 1072, 246, night && !bad);
    if (day && !bad) B.car(W, 1040, 202, G, 'x', M.CAR_BEIGE);
    // les maisons, le dos tourné à la rue, leurs jardins jusqu'aux champs
    maison(W, { x: 940, y: 272, w: 40, d: 28, hz: 24, volet: M.SHUTTER_BLUE, chem: [6, 13], porte: 17, portePeint: paint([0.26, 0.34, 0.46], 'planches'),
      fen: [['f', 5, 0], ['f', 29, 0], ['f', 5, 1], ['f', 17, 1], ['f', 29, 1], ['g', 11, 1]], lits: night ? (bad ? [] : [0, 4]) : [], clos: bad ? (i => i > 1) : (i => i === 3) });
    const h2 = maison(W, { x: 990, y: 270, w: 50, d: 32, hz: 27, mur: M.PLASTER_CREAM, volet: M.SHUTTER_GREEN, chem: [42, 15], porte: 22, portePeint: paint([0.44, 0.16, 0.18], 'planches'),
      fen: [['f', 6, 0], ['f', 36, 0], ['f', 6, 1], ['f', 22, 1], ['f', 38, 1], ['g', 8, 0], ['g', 20, 1]], lits: night ? (bad ? [3] : [1, 3, 6]) : [], clos: bad ? (i => i !== 3) : (i => i === 4) });
    lanterne(W, h2.f, 29, G + 14, night && !bad, 0.9);
    maison(W, { x: 1050, y: 274, w: 46, d: 28, hz: 22, volet: M.SHUTTER_BORD, chem: [8, 13], porte: 30, portePeint: GRIS_BOIS,
      fen: [['f', 6, 0], ['f', 16, 0], ['f', 6, 1], ['f', 22, 1], ['f', 36, 1], ['g', 12, 0]], lits: night && !bad ? [5] : [], clos: i => i === 2 || (bad && i < 4) });
    const h4 = maison(W, { x: 842, y: 282, w: 38, d: 30, hz: 24, volet: M.SHUTTER_GREEN, chem: [8, 14], fen: [['g', 5, 0], ['g', 21, 0], ['g', 5, 1], ['g', 14, 1], ['g', 23, 1], ['f', 14, 0]], lits: night && !bad ? [3] : [], clos: bad ? (i => i > 0) : null });
    h4.g.door(13, G, 5, 11, { mat: M.WOOD, frameMat: M.STONE }); h4.g.rect(13, G, 18, G + 11, 2, M.WOOD, paint([0.26, 0.40, 0.30], 'planches'));
    // les jardins : la cabane, le linge, le poulailler, les fruitiers
    W.box(1016, 336, G, 1030, 348, G + 11, M.WOOD, GRIS_BOIS);
    for (let k = 0; k < 4; k++) W.box(1015, 335 + k * 3, G + 11 + k, 1031, 338 + k * 3, G + 12 + k, M.RES_TOLE);
    for (const lx of [948, 972]) W.box(lx, 348, G, lx + 1, 349, G + 12, M.WOOD_DARK);
    W.box(948, 348, G + 11, 973, 349, G + 12, M.METAL_DARK);
    if (day && !bad) for (let x = 951; x < 970; x += 4) W.box(x, 348, G + 6, x + 3, 349, G + 11, M.RES_LINGE);
    W.box(1078, 350, G, 1092, 360, G + 7, M.WOOD, GRIS_BOIS); W.box(1077, 349, G + 7, 1093, 361, G + 8, M.RES_TOLE);
    tree(1002, 318, 'pommier', { fol: POMMES, seed: 31 }); tree(1028, 352, 'pommier', { fol: POIRES, seed: 37 }); tree(864, 352, 'pommier', { fol: POMMES, seed: 41 });
    if (day && !bad) for (let k = 0; k < 5; k++) put(k % 2 ? POULE_ROUSSE : POULE, 1060 + hash(k, 5, 903, 0) * 30, 306 + hash(k, 6, 903, 0) * 40);
    if (day && !bad) { put(ANCIEN, 1026, 239); put(varie(ANCIEN, { c: [0.30, 0.30, 0.36] }), 1030, 239.5); }
  }

  // ============================================================ le stade du village : la pelouse, la main courante, la tribune de bois, les mâts
  {
    but(W, SLX0, Math.round(SCY) - 12, Math.round(SCY) + 12, -1, !bad);
    but(W, SLX1, Math.round(SCY) - 12, Math.round(SCY) + 12, 1, !bad);
    const verte = paint([0.20, 0.34, 0.24]);
    const rail = (x0, y0, x1, y1) => { B.railing(W, x0, y0, x1, y1, G, 4, M.METAL_GREEN, 4); };
    rail(1130, 138, 1318, 138); rail(1130, 266, 1318, 266); rail(1130, 138, 1130, 150); rail(1130, 162, 1130, 266); rail(1318, 138, 1318, 266);
    tribune(W, 1186, 112, 76, { bois: BOIS_TRIB, peint: VERT_SOMBRE, nom: 'U.S. LA MOTTE', casse: bad });
    const v = maison(W, { x: 1136, y: 106, w: 40, d: 24, hz: 15, mur: M.PLASTER_CREAM, chaines: false, fen: [['g', 6, 0], ['g', 14, 0]] });
    v.f.door(3, G, 5, 11, { mat: M.WOOD_DARK, frameMat: M.STONE }); v.f.rect(3, G, 8, G + 11, 2, M.WOOD, verte);
    v.f.door(11, G, 5, 11, { mat: M.WOOD_DARK, frameMat: M.STONE }); v.f.rect(11, G, 16, G + 11, 2, M.WOOD, verte);
    if (!bad) { v.f.shop(22, G + 5, 14, 5, 'buvette', { light: night ? { r: 30, c: [0.7, 0.42, 0.18] } : null, k: night ? 1 : 0.3 }); v.f.awning(22, 14, G + 12, 4, M.AWNING_GREEN); }
    else v.f.window(22, G + 5, 14, 5, { state: 'dark', shutter: M.SHUTTER_GREY, closed: true, sill: false, lintel: false });
    v.f.sign(2, G + 14, 'STADE', { fg: [0.30, 0.22, 0.14], depth: 0 });
    for (const [mx, my, tx, ty] of [[1121, 133, SCX - 40, SCY - 14], [1317, 133, SCX + 40, SCY - 14], [1121, 267, SCX - 40, SCY + 14], [1317, 267, SCX + 40, SCY + 14]]) mat(W, mx, my, 42, night && !bad, [tx, ty, G], 1.0);
    if (night && !bad) { W.light({ x: 1224, y: 134, z: G + 15, r: 30, cr: 0.8, cg: 0.6, cb: 0.32, shadow: false }); }
    // le tableau d'affichage, peint à la main
    W.box(1114, 222, G, 1116, 224, G + 10, M.WOOD_DARK); W.box(1114, 246, G, 1116, 248, G + 10, M.WOOD_DARK);
    W.box(1114, 220, G + 10, 1116, 250, G + 22, M.WOOD_DARK);
    panneau(W, RIGHT, 1116, 248, G + 21, bad ? 'LOCAUX' : 'LOCAUX 2', { fond: [0.10, 0.12, 0.11], encre: [0.86, 0.84, 0.76], poteaux: false });
    panneau(W, RIGHT, 1116, 248, G + 16, bad ? 'VISITEURS' : 'VISITEURS 1', { fond: [0.10, 0.12, 0.11], encre: [0.86, 0.84, 0.76], poteaux: false });
    for (let x = 1150; x < 1300; x += 30) { W.box(x, 270, G, x + 1, 272, G + 2, M.WOOD_DARK); W.box(x + 9, 270, G, x + 10, 272, G + 2, M.WOOD_DARK); W.box(x, 270, G + 2, x + 10, 272, G + 3, M.WOOD, BOIS_TRIB); }
    places.push({ key: 'stade_village', label: 'Le stade du village', x: 1125, y: 202, z: G + 12 });
    if (day && !bad) { put(SP.KID, 1180, 216); put(S.BALL, 1186, 220); put(varie(SP.KID, { t: [0.70, 0.62, 0.18], w: [0.20, 0.30, 0.50] }), 1196, 226); put(S.U17_TRACK, 1238, 132, G + 11); }
  }

  // ============================================================ le centre du Bois-Joli : le bâtiment bas, les deux terrains, le parking, le bois
  {
    // le bois qui lui donne son nom
    for (let r = 0; r < 4; r++) for (let k = 0; k < 7; k++) {
      const tx = 1670 + 18 * k + (r % 2 ? 9 : 0) + Math.round((hash(k, r, 911, 0) - 0.5) * 8), ty = 10 + 22 * r + Math.round((hash(k, r, 912, 0) - 0.5) * 8);
      if (tx > 1790) continue;
      tree(tx, ty, ['chene', 'hetre', 'charme', 'chene', 'hetre'][Math.floor(hash(k, r, 913, 0) * 5)], { k: 0.9 + 0.3 * hash(k, r, 914, 0) });
    }
    for (let k = 0; k < 4; k++) tree(1366, 4 + 9 * k, 'charme', { k: 0.7 });
    // le bâtiment : socle de béton, bardage de bois, grandes baies, la marquise, l'enseigne, l'écusson
    const bx0 = 1456, by0 = 36, bw = 200, bd = 60, bh = 18;
    W.box(bx0, by0, G, bx0 + bw, by0 + bd, G + bh, M.CONCRETE);
    const bf = new Facade(W, LEFT, bx0, by0, bw, bd), bg = new Facade(W, RIGHT, bx0, by0, bw, bd);
    const BARDAGE = paint([0.58, 0.45, 0.31], 'bardage');
    bf.rect(0, G + 1, bw, G + bh, 0, M.WOOD, BARDAGE); bg.rect(0, G + 1, bd, G + bh, 0, M.WOOD, BARDAGE);
    const baie = (F, s, n, k) => F.window(s, G + 3, n, 10, { state: night && !bad && hash(s, k, 915, 0) < 0.55 ? 'office' : 'dark', sill: false, lintel: false, frame: [0.22, 0.23, 0.24], spill: false });
    for (const s of [6, 24, 42, 60, 134, 152, 170]) baie(bf, s, 14, 1);
    for (const s of [8, 30]) baie(bg, s, 14, 2);
    W.box(bx0 + 86, by0 + bd, G + 13, bx0 + 114, by0 + bd + 10, G + 14, M.CONCRETE);
    for (const px of [bx0 + 86, bx0 + 113]) W.box(px, by0 + bd + 9, G, px + 1, by0 + bd + 10, G + 13, M.METAL_DARK);
    bf.door(92, G, 16, 12, { kind: 'door', frame: false, k: night ? (bad ? 0.1 : 0.85) : 0.15 });
    bf.sign(80, G + bh + 1, 'CENTRE DU BOIS-JOLI', { fg: [0.92, 0.90, 0.84], plate: [0.15, 0.16, 0.17], plateMat: M.METAL_DARK, depth: -1, padX: 3, padY: 1, emit: night && !bad ? [0.42, 0.42, 0.38] : null });
    bf.crest(118, G + 4, 4, 7);
    B.flatRoof(W, bx0, by0, bw, bd, G + bh, M.CONCRETE);
    for (const [sx, sy] of [[bx0 + 20, by0 + 16], [bx0 + 60, by0 + 16], [bx0 + 130, by0 + 16], [bx0 + 170, by0 + 16]]) W.box(sx, sy + 4, G + bh + 1, sx + 12, sy + 18, G + bh + 2, night && !bad && (sx - bx0 === 20 || sx - bx0 === 130) ? M.RES_AUVENT_NUIT : M.RES_AUVENT);
    for (const [vx, vy] of [[bx0 + 96, by0 + 10], [bx0 + 104, by0 + 10]]) W.box(vx, vy, G + bh + 1, vx + 5, vy + 6, G + bh + 4, M.METAL);
    if (night && !bad) { const p = bf.front(100, G + 10, 6); W.light({ x: p.x, y: p.y, z: p.z, r: 40, cr: 0.75, cg: 0.78, cb: 0.72, skip: 1.5 }); }
    places.push({ key: 'centre_vert', label: 'Le centre du Bois-Joli', x: bx0 + 100, y: by0 + bd + 3, z: G + 12 });
    // les mâts des drapeaux
    for (const [k, fx] of [[0, 1588], [1, 1596], [2, 1604]]) {
      W.box(fx, 98, G, fx + 1, 99, G + 34, M.METAL);
      if (!bad) W.box(fx + 1, 98, G + 27, fx + 8, 99, G + 33, k === 1 ? M.FLAG : k === 0 ? M.METAL_BORD : M.WHITE);
    }
    // l'allée, la barrière, la guérite, l'enseigne de l'entrée
    panneau(W, LEFT, 1362, 10, G + 16, 'BOIS-JOLI', { fond: [0.40, 0.11, 0.16], encre: [0.88, 0.82, 0.62], poteaux: [1, 13] });
    W.box(1362, 22, G, 1372, 32, G + 12, M.PLASTER_CREAM); W.box(1361, 21, G + 12, 1373, 33, G + 13, M.CONCRETE);
    new Facade(W, LEFT, 1362, 22, 10, 10).window(2, G + 5, 6, 5, { state: night && !bad ? 'office' : 'dark', sill: false, lintel: false, spill: false });
    W.box(1359, 29, 1, 1361, 31, G + 6, M.METAL_DARK);
    const rayures = (a0, a1, z, axe) => { for (let a = a0; a < a1; a++) { const m = Math.floor((a - a0) / 3) % 2 ? M.PLASTIC_WHITE : M.PLASTIC_RED; if (axe === 'x') W.set(a, 30, z, m); else W.set(1360, 30, a, m); } };
    if (bad) { rayures(1340, 1359, G + 5, 'x'); panneau(W, LEFT, 1342, 31, G + 10, 'FERMÉ', { fond: [0.86, 0.85, 0.80], encre: [0.62, 0.10, 0.10], poteaux: false }); }
    else rayures(G + 6, G + 24, 0, 'z');
    // le parking : ses lignes, les voitures, le car du club, les lampadaires
    for (let x = 1346; x < 1446; x += 12) { W.box(x, 42, 0, x + 1, 60, 1, M.ROADLINE); W.box(x, 94, 0, x + 1, 112, 1, M.ROADLINE); }
    const voitures = bad ? [[1360, 42]] : night ? [[1348, 42], [1384, 94]] : [[1348, 42], [1360, 42], [1396, 42], [1420, 94], [1372, 94], [1348, 94]];
    voitures.forEach(([vx, vy], k) => B.car(W, vx + 2, vy, 1, 'y', [M.CAR_WHITE, M.CAR_BLUE, M.CAR_BEIGE, M.CAR_BORD][k % 4]));
    if (!bad) B.clubBus(W, 1366, 66, 1, { lit: false });
    B.streetLamp(W, 1342, 76, 1, 1, 0, { on: night && !bad, h: 22, r: 60, I: 1.8 });
    B.streetLamp(W, 1444, 50, 1, -1, 0, { on: night, h: 22, r: 60, I: 1.8 });
    // les deux terrains : buts, pare-ballons, cages mobiles, les abris de touche translucides
    const jaune = paint([0.86, 0.70, 0.16]);
    for (const P of PITCHES) {
      but(W, P.LX0, P.CY - 12, P.CY + 12, -1, !bad); but(W, P.LX1, P.CY - 12, P.CY + 12, 1, !bad);
      pareBallons(W, P.LX0 - 9, P.CY - 34, P.CY + 34, 22); pareBallons(W, P.LX1 + 9, P.CY - 34, P.CY + 34, 22);
      if (!bad) { cageMobile(W, P.CX - 50, P.py0 + 6, jaune); cageMobile(W, P.CX + 36, P.py0 + 6, jaune); }
      const ax = P.CX - 9;
      W.box(ax, 116, G, ax + 18, 122, G + 1, M.CONCRETE);
      for (let k = 0; k < 9; k++) { const z = G + Math.round(8 * Math.sin(Math.PI * k / 8)) + 1; W.box(ax, 116 + Math.min(k, 6), z - 1, ax + 18, 117 + Math.min(k, 6), z, M.RES_AUVENT); }
      W.box(ax + 1, 116, G, ax + 17, 118, G + 2, M.SEAT);
    }
    // les bornes lumineuses du trottoir
    for (const bx of [1420, 1500, 1620, 1700]) { W.box(bx, 112, G, bx + 1, 113, G + 3, M.METAL_DARK); W.set(bx, 112, G + 3, night && !bad ? M.BULB : M.METAL); if (night && !bad) W.light({ x: bx + 0.5, y: 113.5, z: G + 3, r: 18, cr: 0.6, cg: 0.5, cb: 0.3, shadow: false }); }
    if (day && !bad) {
      // la séance : un toro sur le premier terrain, les frappes au but sur le second
      const P1 = PITCHES[0], P2 = PITCHES[1];
      put(S.VUKIC, P1.CX - 30, P1.CY + 26);
      const tx = P1.CX - 20, ty = P1.CY;
      for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; put(S.SAUCER, tx + Math.cos(a) * 11, ty + Math.sin(a) * 11); }
      [[S.SR_B, 0.3], [S.SR_C, 1.6], [S.SR_D, 2.9], [S.U17_RUN, 4.2], [SP.PLAYER, 5.4]].forEach(([d, a]) => put(d, tx + Math.cos(a) * 9, ty + Math.sin(a) * 9));
      put(S.SR_BIB, tx - 1, ty + 1); put(S.SR_BIB2, tx + 3, ty - 2); put(S.BALL, tx + 4, ty + 3);
      for (let i = 0; i < 7; i++) put(S.CONE, P1.CX + 30 + i * 7, P1.LY1 - 10);
      put(S.SR_C, P1.CX + 44, P1.LY1 - 8); put(S.BALL, P1.CX + 47, P1.LY1 - 7);
      put(S.KEEPER_SR, P2.LX1 - 7, P2.CY + 1); put(SP.BREHAUT, P2.LX1 - 32, P2.CY + 6); put(S.BALL, P2.LX1 - 29, P2.CY + 7);
      put(S.SR_BIB3, P2.LX1 - 40, P2.CY - 14); put(S.SR_B, P2.LX1 - 44, P2.CY + 18);
      for (const [bx, by] of [[P2.LX1 - 2, P2.CY - 8], [P2.LX1 + 3, P2.CY + 5], [P2.LX1 - 36, P2.CY + 20]]) put(S.BALL, bx, by);
      put(S.VECCHIO, P2.LX1 - 18, P2.CY - 22);
    }
  }

  // ============================================================ les arbres des chemins et des prés ; la rangée de peupliers du centre
  for (const [tx, ty, sp, k] of [[392, 22, 'chene', 1.0], [392, 74, 'charme', 0.9], [392, 262, 'chene', 1.05], [520, 334, 'chene', 1.15], [402, 326, 'hetre', 0.95],
    [414, 344, 'charme', 0.8], [396, 346, 'chene', 0.85], [302, 296, 'tilleul', 0.9], [1468, 318, 'chene', 1.0], [1096, 300, 'tilleul', 0.9], [742, 262, 'charme', 0.8]]) {
    if (freeAt(tx, ty)) tree(tx, ty, sp, { k });
  }
  for (let k = 0; k < 8; k++) tree(1345, 124 + 21 * k, 'peuplier', { h: 42 + Math.round(hash(k, 1, 921, 0) * 6) });

  // ============================================================ le bord du boulevard ; les gens et les bêtes
  if (bad) { // le dépôt sauvage au bout du chemin du Manoir
    W.box(386, 1, G, 392, 5, G + 2, M.TIRE); W.box(387, 1, G + 2, 391, 4, G + 3, M.TIRE);
    W.box(394, 0, G, 408, 6, G + 2, M.WHITE); W.box(398, 2, G + 2, 404, 6, G + 9, M.PLASTIC_WHITE);
    for (const [sx, sy] of [[410, 2], [413, 4], [409, 5]]) W.box(sx, sy, G, sx + 3, sy + 3, G + 3, M.BIN);
  }
  // la pâture du village : sa clôture, son abreuvoir, son chêne ; ses bêtes selon l'heure et l'humeur
  barbele(W, [[934, 6], [934, 100], [1076, 100], [1076, 6]], { step: 8 });
  abreuvoir(W, 1050, 30, 'x');
  tree(996, 70, 'chene', { k: 1.1 });
  if (day && !bad) {
    vache(W, 950, 24, 'x', 1, 'charolaise', true); vache(W, 976, 50, 'x', -1, 'charolaise', false); vache(W, 1014, 22, 'y', 1, 'pie', true);
    vache(W, 1038, 64, 'x', 1, 'charolaise', true); vache(W, 958, 80, 'y', -1, 'pie', false); vache(W, 1056, 84, 'x', -1, 'brune', true);
    vache(W, 420, 320, 'x', 1, 'charolaise', true); vache(W, 470, 340, 'y', 1, 'charolaise', false); vache(W, 500, 312, 'x', -1, 'pie', true);
    for (let k = 0; k < 7; k++) mouton(W, 24 + Math.round(hash(k, 7, 904, 0) * 130), 330 + Math.round(hash(k, 8, 904, 0) * 26), hash(k, 9, 904, 0) < 0.5 ? 'x' : 'y', hash(k, 10, 904, 0) < 0.5 ? 1 : -1);
    cheval(W, 46, 226, 'x', 1, 'cheval'); cheval(W, 80, 258, 'x', -1, 'cheval2');
    for (let k = 0; k < 7; k++) put(k % 3 ? POULE : POULE_ROUSSE, 616 + hash(k, 11, 905, 0) * 70, 124 + hash(k, 12, 905, 0) * 30);
    put(S.DOG, 660, 132); put(PAYSAN, 646, 126);
    put(PECHEUR, 467, 214, 2);
    put(PROMENEUSE, 300, 307); put(SP.WALKER, 304, 309.5);
    put(SP.WALKER2, 1150, 299); put(varie(SP.COAT, { c: [0.40, 0.44, 0.30], C: [0.30, 0.33, 0.22] }), 712, 60);
  } else if (day) {
    vache(W, 976, 50, 'x', -1, 'charolaise', false); vache(W, 1038, 64, 'x', 1, 'pie', true);
    put(S.DOG, 660, 132);
  } else {
    vache(W, 976, 50, 'x', -1, 'charolaise', false); vache(W, 1014, 22, 'y', 1, 'pie', false);
    put(SP.CAT, 650, 241, G + 4);
  }
  SOL = () => G;
  return { places };
}

module.exports = { w: 1800, h: 364, seed: 1990, build };
