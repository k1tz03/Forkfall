'use strict';
// FUSIBLE — Les Hauts, le quartier d'affaires d'Aubérive, au nord de la ville (360 m × 73 m ; 1 voxel = 20 cm).
// L'argent de la télévision, les sponsors, les avocats, les agents : là où le football se vend. Des tours de
// verre et de béton sur une dalle ; le parvis venteux et son bassin ; l'Impérial, le palace d'avant les tours ;
// la galerie des Hauts et ses vitrines ; le cabinet Verdier ; la Table des Hauts, tout en haut de sa tour ; le
// parking ; la tour qu'on construit encore, et sa grue. L'autre visage d'Aubérive, celui qui regarde la vieille
// ville de haut.
// Coordonnées locales : x ∈ [0, 1800) vers l'est, y ∈ [0, 364) vers le sud. Le bord sud (y = 363) touche le
// boulevard de ceinture : tout le trottoir du boulevard est praticable, et huit accès y arrivent (les deux rues,
// la cour de l'Impérial, l'allée, le parvis, la galerie, l'avant-cour Verdier, la rue du Parking). Le bord nord
// (y = 0) se fond dans le paysage : la voie rapide en contrebas, le talus planté, aucun mur.
// La caméra voit le dessus, les faces +y (sud) et +x (est) : tout ce qui compte donne au sud ou à l'est.
// Le quartier sert de 1990 à 2050 : rien d'une seule époque (ni écran géant, ni téléphone), aucun nom réel.
const E = require('./engine');
const { M } = require('./mats');
const B = require('./build');
const SP = require('./sprites');
require('./diorama');            // M.TARP, M.BARRIER, M.MUD, M.WEED (matières déjà comptées par la ville)
require('./district_sante');     // M.ESTQ_ASHLAR, la pierre de taille (et M.TUBE, M.CARPET, M.GOLD des intérieurs)
require('./district_cimetiere'); // M.CIM_GRANITE, le granit poli
const { LEFT, RIGHT, TOP, hash, vnoise, fbm, mod, clamp, material, overlay, textBitmap } = E;
const { Facade } = B;

const WD = 1800, HT = 364, G = 2, ZMAX = 218;
const VZ = -9;                        // la voie rapide : le bitume à z = −9, son dessus à −8
const VR = { nord: 8, acc: 10, c1: [10, 30], sep: [30, 34], c2: [34, 54], bau: 56, sud: [56, 72] }; // la tranchée, en y
const RS = [76, 100];                 // la rue de service, derrière les tours (sa chaussée)
const NS = [[370, 394], [1406, 1430]]; // les deux rues nord-sud, dans l'axe des bandes ouest et est de la ceinture
const FR = 336;                       // le trottoir du boulevard : y ∈ [336, 364)
const DZ = 3;                         // le dessus de la dalle du parvis : une marche au-dessus du trottoir

// ================================================================ petites fonctions de teinte
const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const grain = (c, amt, s = 0) => mul(c, 1 + (hash(c.a, c.b, c.face * 7 + s, c.m) - 0.5) * 2 * amt);
const along = c => c.face === LEFT ? c.hx : c.hy;
const grime = (c, h = 4, k = 0.24) => { if (c.face !== TOP) { const t = clamp((c.hz - G) / h, 0, 1); mul(c, 1 - k * (1 - t)); } };
const puddle = (c, scale, thr, s) => { if (c.face !== TOP) return; const p = fbm(c.hx / scale + 3.1, c.hy / scale - 1.7, s, 3); if (p > thr) c.wet = clamp((p - thr) * 12, 0, 1); };
const fallen = (c, k = 1) => {
  if (c.face !== TOP) return;
  const W = c.W; const ix = Math.floor(c.hx), iy = Math.floor(c.hy);
  if (ix < 0 || iy < 0 || ix >= W.X || iy >= W.Y) return;
  const d = W.leaf[iy * W.X + ix] * k; if (d <= 0) return;
  if (hash(c.a, c.b, 913, 5) < d * 0.42) { const v = hash(c.a, c.b, 914, 1); if (v < 0.4) rgb(c, 0.62, 0.42, 0.14); else if (v < 0.7) rgb(c, 0.52, 0.24, 0.10); else rgb(c, 0.40, 0.33, 0.13); c.wet *= 0.3; }
};
const emit = (c, r, g, b) => { c.er = r; c.eg = g; c.eb = b; };

// ================================================================ matières (huit, toutes préfixées HT_)
// La dalle : de grandes dalles de granit clair, joints sombres, mouchetures ; le soir, un léger lustre mouillé.
M.HT_DALLE = M.HT_DALLE || material('Hauts · dalle de granit', c => {
  if (c.face !== TOP) { rgb(c, 0.50, 0.49, 0.47); grain(c, 0.05); if (mod(c.b, 6) === 0) mul(c, 0.84); grime(c, 3, 0.2); return; }
  const S = 12, ga = mod(c.a, S), gb = mod(c.b, S);
  const slab = hash(Math.floor(c.a / S), Math.floor(c.b / S), 1201, 0);
  let k = 0.47 + slab * 0.07;
  if (ga === 0 || gb === 0) k *= 0.70;
  const h = hash(c.a, c.b, 1202, 0); if (h < 0.10) k *= 0.84; else if (h > 0.95) k *= 1.12;
  rgb(c, k * 1.02, k * 1.0, k * 0.96);
  puddle(c, 12, 0.71, 1203);
  if (c.W.baseWet) c.wet = Math.max(c.wet, c.W.baseWet * 0.9);
  fallen(c, 0.9);
});
// Le verre des murs-rideaux : ce que le calque hauts_rideau ne peint pas (le dessus : la couvertine d'aluminium).
M.HT_VERRE = M.HT_VERRE || material('Hauts · mur-rideau', c => {
  if (c.face === TOP) { rgb(c, 0.46, 0.47, 0.48); grain(c, 0.04); return; }
  rgb(c, 0.10, 0.14, 0.18); if (mod(c.a - c.b, 11) < 2) rgb(c, 0.16, 0.20, 0.25);
});
// Le béton blanc des bandeaux et des résilles : lisse, joints de panneaux, coulures sous les appuis.
M.HT_BETON = M.HT_BETON || material('Hauts · béton blanc', c => {
  const k = 0.90 + 0.14 * fbm(along(c) / 6 + (c.face === TOP ? c.hy / 6 : 0), c.hz / 9 + (c.face === TOP ? c.hx / 6 : 0), 1211);
  rgb(c, 0.71 * k, 0.70 * k, 0.665 * k);
  if (c.face !== TOP) {
    if (mod(c.b, 32) === 0) mul(c, 0.84);
    if (mod(c.a, 40) === 0) mul(c, 0.88);
    if (vnoise(along(c) * 1.7, c.hz * 0.08, 1212) > 0.74) mul(c, 0.9);
  }
  grain(c, 0.03); grime(c, 6, 0.22);
});
// L'aluminium : bardages, meneaux saillants, couronnes ; brossé, un peu bleuté.
M.HT_ALU = M.HT_ALU || material('Hauts · aluminium', c => {
  rgb(c, 0.55, 0.57, 0.60);
  if (c.face === TOP) { mul(c, 1.05); grain(c, 0.04); return; }
  if (mod(c.a, 4) === 0) mul(c, 0.9);
  mul(c, 0.92 + 0.16 * vnoise(along(c) * 0.6, c.hz * 0.03, 1221));
  grain(c, 0.03);
});
// L'eau du bassin : sombre, mouillée (les lumières s'y reflètent), une ride de vent.
M.HT_EAU = M.HT_EAU || material("Hauts · eau du bassin", c => {
  if (c.face === TOP) {
    rgb(c, 0.045, 0.07, 0.08); c.wet = 0.96;
    const n = vnoise(c.hx * 0.7 + c.hy * 0.25, c.hy * 1.1, 1231); if (n > 0.72) rgb(c, 0.10, 0.14, 0.15);
    return;
  }
  rgb(c, 0.42, 0.50, 0.52); if (mod(c.b, 2) === 0) rgb(c, 0.62, 0.70, 0.72);
}, { noAO: true, noAOrecv: true, noShadow: true });
// L'acier jaune de la grue et des engins.
M.HT_GRUE = M.HT_GRUE || material('Hauts · acier jaune', c => {
  rgb(c, 0.80, 0.58, 0.10); if (c.face === TOP) mul(c, 1.1); grain(c, 0.06);
  if (hash(Math.floor(c.a / 3), Math.floor(c.b / 3), 1241, 0) < 0.05) rgb(c, 0.45, 0.30, 0.14);
});
// La laque noire des berlines et des taxis : un reflet, une ligne de caisse.
M.HT_LAQUE = M.HT_LAQUE || material('Hauts · laque noire', c => {
  rgb(c, 0.065, 0.065, 0.075);
  if (c.face === TOP) { if (mod(c.a + c.b, 9) < 2) rgb(c, 0.24, 0.25, 0.28); }
  else if (mod(c.b, 6) === 3) rgb(c, 0.18, 0.19, 0.21);
  grain(c, 0.04);
});
// Le cuivre vert-de-gris des toits de l'Impérial : joints debout, coulures de bronze.
M.HT_CUIVRE = M.HT_CUIVRE || material('Hauts · cuivre vert-de-gris', c => {
  const n = fbm(c.hx / 4 + c.hz / 3, c.hy / 4 - c.hz / 3, 1251);
  rgb(c, 0.27 + 0.08 * n, 0.47 + 0.08 * n, 0.40 + 0.06 * n);
  if (mod(c.a, 4) === 0) mul(c, 0.8);
  if (hash(Math.floor(c.a / 2), Math.floor(c.b / 5), 1252, 0) < 0.05) rgb(c, 0.36, 0.30, 0.18);
  if (c.face !== TOP) mul(c, 0.88);
  grain(c, 0.05);
});

// ================================================================ calques (aucun ne coûte de matière)
function loc(o, c) {
  const la = o.face === LEFT ? Math.floor(2 * c.hx) - 2 * o.a0 : 2 * o.a0 - 1 - Math.floor(2 * c.hy);
  return [la, Math.floor(2 * c.hz) - 2 * o.z0];
}
// Une teinte : multiplie (k) ou remplace (col) la couleur ; une émission (e) si on veut que ça luise.
overlay('hauts_tint', (o, c) => {
  if (o.col) rgb(c, o.col[0], o.col[1], o.col[2]);
  if (o.k) { c.cr *= o.k[0]; c.cg *= o.k[1]; c.cb *= o.k[2]; }
  if (o.e) { const f = o.eTop === false && c.face === TOP ? 0 : 1; c.er = o.e[0] * f; c.eg = o.e[1] * f; c.eb = o.e[2] * f; }
  if (o.g) grain(c, o.g, 7);
});

// Le mur-rideau. Un calque par volume (x0..x1 × y0..y1, à partir de z0) : la face sud (LEFT) et la face est
// (RIGHT) se déroulent sur une même coordonnée, du coin sud-ouest au coin nord-est, pour que les trames se
// suivent au coin. Trame : des baies de bw voxels, des étages de fh voxels ; meneaux (mw texels), allège (sp
// voxels en bas de l'étage), plénum (pl voxels en haut). Le jour, le verre teinté (tint) reflète le ciel ; la
// nuit, des plateaux s'allument par zones (tirées de la graine de la tour), jamais tous.
// Les teintes des plateaux : néon froid, blanc chaud, bleuté, lampe de bureau ; les plateaux de télévision.
const OFFICE = [[0.78, 0.86, 0.82], [0.95, 0.86, 0.68], [0.72, 0.80, 0.92], [1.0, 0.72, 0.42], [0.50, 0.52, 1.0], [0.82, 0.40, 0.90]];
function rideauLit(o, f, bay) {
  if (!o.night || f < 0 || f >= o.nf || (o.dark && o.dark.includes(f))) return null;
  const s = o.seed;
  const zw = o.zw || (2 + Math.floor(hash(f, 2, 3308, s) * 5));      // la largeur des zones change d'un étage à l'autre
  const full = hash(f, 0, 3301, s) < o.pFull;
  const zi = Math.floor((bay + Math.floor(hash(f, 1, 3305, s) * 7)) / zw);
  const zone = hash(f, zi, 3302, s) < o.pLit;
  const on = full ? hash(f, bay, 3303, s) < 0.9 : zone ? hash(f, bay, 3304, s) < 0.82 : hash(f, bay, 3306, s) < o.pScatter;
  if (!on) return null;
  const v = hash(f, zi, 3307, s);
  if (o.studio && v < 0.3) return OFFICE[v < 0.18 ? 4 : 5];
  if (o.warm != null) return OFFICE[v < o.warm ? (v < o.warm * 0.6 ? 3 : 1) : 0];
  return OFFICE[v < 0.5 ? 0 : v < 0.7 ? 2 : v < 0.88 ? 1 : 3];
}
overlay('hauts_rideau', (o, c) => {
  if (c.face === TOP) return;
  // une tour ronde se déroule sur l'angle (la couture est à l'ouest, du côté qu'on ne voit pas)
  const la = o.round ? Math.floor(2 * o.R * (Math.atan2(c.hy - o.cy, c.hx - o.cx) + Math.PI))
    : c.face === LEFT ? Math.floor(2 * (c.hx - o.x0)) : 2 * (o.x1 - o.x0) + Math.floor(2 * (o.y1 - c.hy) - 1e-6);
  const lz = Math.floor(2 * (c.hz - o.z0));
  if (lz < 0) return;
  const BW = o.bw * 2, FH = o.fh * 2, SP2 = o.sp * 2, PL2 = (o.pl || 0) * 2;
  const bay = Math.floor(la / BW), u = la - bay * BW;
  const f = Math.floor(lz / FH), v = lz - f * FH;
  const mw = o.mw != null ? o.mw : 1;
  c.er = c.eg = c.eb = 0;
  // meneaux et traverses
  if (u < mw || (o.mid && u === (BW >> 1))) { const m = o.mull || [0.42, 0.44, 0.46]; rgb(c, m[0], m[1], m[2]); if (c.face === RIGHT) mul(c, 0.92); return; }
  if (v < SP2 || v >= FH - PL2) {
    const s = o.spCol || [0.13, 0.16, 0.19]; rgb(c, s[0], s[1], s[2]);
    if (v === SP2 - 1 || v === FH - PL2) mul(c, 0.7);
    if (o.spStripe && mod(v, 2) === 0) mul(c, 0.86);
    return;
  }
  // le vitrage
  const t = clamp((c.hz - o.z0) / Math.max(1, o.z1 - o.z0), 0, 1);
  const n = vnoise(la / 30 + lz / 70, lz / 38, o.seed & 1023);
  const pane = 0.94 + 0.12 * hash(bay, f, 3311, o.seed);
  const T = o.tint;
  const lit = rideauLit(o, f, bay);
  if (!o.night) {
    const sky = (0.05 + 0.13 * t) + 0.14 * n;
    rgb(c, (T[0] + sky * 0.85) * pane, (T[1] + sky * 0.95) * pane, (T[2] + sky * 1.1) * pane);
    if (mod(u - v + bay * 3, 23) < 2) mul(c, 1.18);
    if (v === SP2) mul(c, 0.8);
    return;
  }
  rgb(c, (0.025 + 0.03 * n + 0.02 * t) * pane, (0.03 + 0.03 * n + 0.02 * t) * pane, (0.045 + 0.04 * n + 0.03 * t) * pane);
  if (!lit) { if (mod(u - v + bay * 3, 23) < 2) mul(c, 1.4); return; }
  const H = FH - SP2 - PL2, vv = v - SP2;
  let e = (o.k || 0.5) * (0.78 + 0.3 * vv / H) * (0.9 + 0.2 * hash(f, bay, 3312, o.seed));
  if (vv >= H - 2 && mod(u + bay, 6) < 3) e *= 1.35;                     // les plafonniers
  else if (vv < 3) { e *= 0.42; if (vv === 2 && mod(u, 7) === 3) e *= 1.8; } // bureaux, cloisons basses
  const blind = hash(f, bay, 3313, o.seed);
  if (blind < 0.28 && vv > H * 0.45 && mod(vv, 2) === 0) e *= 0.5;        // stores à demi baissés
  if (blind > 0.93) { const dx = u - BW * 0.55, dy = vv - 7; if (dx * dx + dy * dy * 1.3 < 5 || (vv < 6 && Math.abs(dx) < 3.5)) e *= 0.12; } // quelqu'un
  rgb(c, lit[0] * 0.25, lit[1] * 0.25, lit[2] * 0.25);
  emit(c, lit[0] * e, lit[1] * e, lit[2] * e);
});

// Le sol peint : lignes de stationnement, lettres au sol, le H de l'hélistation, damier de marbre.
overlay('hauts_sol', (o, c) => {
  if (c.face !== TOP) return;
  const lx = c.hx - o.x0, ly = c.hy - o.y0;
  if (o.kind === 'texte') {
    if (!o.bmp) o.bmp = textBitmap(o.text);
    const sc = o.scale || 2;
    // le texte se lit depuis le sud : colonnes le long de x, rangées vers le nord (y décroissant)
    const bx = Math.floor((2 * lx) / sc), by = Math.floor((2 * (o.h - ly)) / sc);
    if (o.bmp.at(bx, o.bmp.h - 1 - by)) { const f = o.col || [0.80, 0.78, 0.70]; rgb(c, f[0], f[1], f[2]); c.wet *= 0.5; }
  } else if (o.kind === 'damier') {
    const s = o.s || 6, q = (Math.floor(lx / s) + Math.floor(ly / s)) & 1;
    if (q) rgb(c, 0.66, 0.64, 0.60); else rgb(c, 0.16, 0.15, 0.15);
    if (mod(Math.floor(2 * lx), 2 * s) === 0 || mod(Math.floor(2 * ly), 2 * s) === 0) mul(c, 0.8);
    c.wet = Math.max(c.wet, 0.35);
  } else if (o.kind === 'helipad') {
    const dx = lx - o.r, dy = ly - o.r, d = Math.hypot(dx, dy);
    if (d > o.r) return;
    rgb(c, 0.30, 0.32, 0.30);
    if (d > o.r - 1.2) rgb(c, 0.85, 0.82, 0.70);
    const ax = Math.abs(dx), ay = Math.abs(dy), s = o.r * 0.42;
    if ((ax > s * 0.55 && ax < s * 0.85 && ay < s) || (ax < s * 0.85 && ay < s * 0.14)) rgb(c, 0.86, 0.84, 0.76);
    if (o.lit && d > o.r - 1.2 && mod(Math.floor(Math.atan2(dy, dx) * 6), 2) === 0) { rgb(c, 0.9, 0.8, 0.4); emit(c, 0.9, 0.7, 0.25); }
  } else if (o.kind === 'calepinage') {
    // des bandes de granit sombre quadrillent la dalle, alignées sur la trame des tours
    const bx = mod(c.hx - o.x0, o.p), by = mod(c.hy - o.y0, o.p);
    if (bx < 2 || by < 2) { const g = 0.15 + 0.03 * hash(c.a, c.b, 1205, 0); rgb(c, g, g, g * 1.08); if (hash(c.a, c.b, 1206, 0) < 0.08) mul(c, 2.0); c.wet = Math.max(c.wet, 0.3); }
  } else if (o.kind === 'medaillon') {
    // le médaillon du parvis : une rose des vents de granit noir et de laiton, là où l'on se tient
    const dx = c.hx - o.cx, dy = c.hy - o.cy, d = Math.hypot(dx, dy);
    if (d > o.r) return;
    const a = Math.atan2(dy, dx), main = Math.pow(Math.abs(Math.cos(2 * a)), 10), sec = 0.6 * Math.pow(Math.abs(Math.sin(2 * a)), 10);
    const lim = (o.r - 2.5) * (0.16 + 0.84 * Math.max(main, sec));
    if (d > o.r - 1.2) rgb(c, 0.16, 0.16, 0.17);
    else if (d > o.r - 2.2) rgb(c, 0.62, 0.50, 0.26);
    else if (d < lim) { const half = Math.sin(8 * a) > 0; rgb(c, half ? 0.70 : 0.20, half ? 0.56 : 0.20, half ? 0.30 : 0.21); }
    else if (d < 1.2) rgb(c, 0.62, 0.50, 0.26);
    else rgb(c, 0.52, 0.51, 0.48);
    c.wet = Math.max(c.wet, 0.25);
  } else if (o.kind === 'places') {
    // places de stationnement : lignes blanches perpendiculaires à la chaussée
    const p = o.pitch || 12;
    if (o.axis === 'x') { if (mod(Math.floor(lx), p) === 0 && ly > 0.3 && ly < o.h - 0.3) rgb(c, 0.74, 0.72, 0.66); }
    else if (mod(Math.floor(ly), p) === 0 && lx > 0.3 && lx < o.w - 0.3) rgb(c, 0.74, 0.72, 0.66);
  }
});

// Le hall d'une tour, vu à travers son vitrage : sol poli, banque d'accueil, mur du logo, plafonniers, plantes.
// Le jour, surtout des reflets ; la nuit, tout le hall luit. La porte (door, en voxels le long de la façade)
// est dessinée dans le vitrage : montants, barres de poussée.
const HALL = {
  bureau: { wall: [0.62, 0.60, 0.56], light: [0.90, 0.94, 0.90], desk: [0.20, 0.20, 0.22], accent: [0.80, 0.70, 0.45] },
  dalmene: { wall: [0.70, 0.66, 0.58], light: [1.0, 0.92, 0.76], desk: [0.10, 0.12, 0.18], accent: [0.86, 0.70, 0.30] },
  ecran: { wall: [0.22, 0.22, 0.26], light: [0.90, 0.90, 1.0], desk: [0.70, 0.10, 0.10], accent: [0.95, 0.20, 0.18] },
  hotel: { wall: [0.62, 0.42, 0.26], light: [1.0, 0.80, 0.52], desk: [0.30, 0.16, 0.10], accent: [0.95, 0.78, 0.40] },
  table: { wall: [0.26, 0.16, 0.10], light: [1.0, 0.74, 0.42], desk: [0.12, 0.08, 0.06], accent: [0.90, 0.72, 0.36] },
  verdier: { wall: [0.36, 0.22, 0.13], light: [1.0, 0.80, 0.50], desk: [0.16, 0.10, 0.07], accent: [0.30, 0.45, 0.30] },
};
overlay('hauts_hall', (o, c) => {
  if (c.face !== o.face) return;
  const [la, lb] = loc(o, c);
  const W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  c.er = c.eg = c.eb = 0;
  const P = HALL[o.kind] || HALL.bureau, ms = o.ms || 12;
  if (mod(la, ms) === 0 || lb === H2 - 1 || lb === 0) { rgb(c, 0.17, 0.18, 0.19); return; }
  const day = !o.lit, kk = day ? 0.16 : 1;
  let col = P.wall, e = 0.42;
  const lt = H2 - 1 - lb;
  const inDoor = o.door && la >= 2 * o.door[0] && la < 2 * o.door[1];
  if (inDoor) {
    const dl = la - 2 * o.door[0], dw = 2 * (o.door[1] - o.door[0]);
    if (lt < 2 || dl === 0 || dl === dw - 1 || dl === (dw >> 1)) { rgb(c, 0.09, 0.09, 0.10); return; }
    if ((dl === (dw >> 1) - 2 || dl === (dw >> 1) + 2) && lb > 8 && lb < 13) { rgb(c, 0.75, 0.66, 0.40); c.er = 0.2 * kk; c.eg = 0.17 * kk; c.eb = 0.08 * kk; return; }
  }
  if (lb < 3) { col = P.light; e = 0.30 + 0.1 * (lb & 1); }                                   // le sol poli
  else if (lt < 3) { col = P.light; e = mod(la, 8) < 3 && lt === 1 ? 1.25 : 0.28; }           // le plafond, les spots
  else {
    const dc = o.desk != null ? 2 * o.desk : W2 / 2, dx = Math.abs(la - dc);
    if (lb >= 3 && lb < 9 && dx < 9) { col = lb === 8 ? P.accent : P.desk; e = lb === 8 ? 0.8 : 0.12; }   // la banque d'accueil
    else if (o.logo && lt >= 5 && lt < 5 + 6) {
      if (!o.bmp) o.bmp = textBitmap(o.logo);
      const bx = la - Math.floor((dc - o.bmp.w / 2)), by = lt - 5;
      if (o.bmp.at(bx, by)) { col = P.accent; e = 1.0; }
    }
    if (col === P.wall) {
      const pl = (la < 7 || la > W2 - 8) && lb < 12;                                            // les plantes
      if (pl && hash(la, lb, 1401, o.seed || 0) < 0.7) { col = [0.16, 0.36, 0.14]; e = 0.2; }
      else if (o.sil && lb >= 3 && lb < 16) {                                                   // des silhouettes
        for (const sx of o.sil) { const ddx = la - sx; if (ddx * ddx + (lb - 13.5) * (lb - 13.5) * 1.2 < 4 || (lb < 12 && Math.abs(ddx) < 2.5)) { rgb(c, 0.04, 0.035, 0.03); return; } }
      }
      if (o.kind === 'hotel' && lt >= 4 && lt < 9 && mod(la - 10, 24) < 7) { const d = Math.hypot(mod(la - 10, 24) - 3, lt - 6); if (d < 3) { col = [1.0, 0.86, 0.55]; e = d < 1.5 ? 1.4 : 0.9; } } // les lustres
      if (o.kind === 'table' && lb >= 3 && lb < H2 - 4 && la > W2 - 12 && la < W2 - 4) { col = [0.70, 0.56, 0.30]; e = 0.55; if (la === W2 - 8) e = 0.2; } // la porte de l'ascenseur, en laiton
      if (o.kind === 'verdier' && lb >= 10 && lb < H2 - 5 && mod(la, 3) !== 0 && la > 6 && la < W2 - 7) { const h = hash(la, Math.floor(lb / 4), 1402, 0); col = h < 0.3 ? [0.40, 0.12, 0.10] : h < 0.6 ? [0.20, 0.25, 0.35] : [0.50, 0.40, 0.25]; e = 0.25; } // la bibliothèque
    }
  }
  rgb(c, col[0] * 0.3, col[1] * 0.3, col[2] * 0.3);
  if (day) { if (mod(la - lb, 17) < 3) mul(c, 1.6); }
  const L = P.light, ee = e * kk * (o.k || 1);
  c.er = col[0] * L[0] * ee; c.eg = col[1] * L[1] * ee; c.eb = col[2] * L[2] * ee;
});

// La gaine de l'ascenseur panoramique : verre sombre, les deux rails, le câble, la cabine (chaude la nuit, avec
// quelqu'un dedans), peinte sur le verre puisqu'on ne voit pas à travers.
overlay('hauts_gaine', (o, c) => {
  if (c.face === TOP) { rgb(c, 0.42, 0.44, 0.46); return; }
  const a = c.face === LEFT ? c.hx - o.x0 : c.hy - o.y0, n = c.face === LEFT ? o.w : o.d;
  c.er = c.eg = c.eb = 0;
  const inCab = c.hz >= o.cz && c.hz < o.cz + 12;
  if (inCab) {
    if (c.hz < o.cz + 1 || c.hz >= o.cz + 11) { rgb(c, 0.28, 0.28, 0.30); return; }
    if (o.lit) {
      rgb(c, 0.30, 0.22, 0.14); emit(c, 0.95, 0.72, 0.42);
      const dx = a - n * 0.55, dz = c.hz - o.cz;
      if ((dx * dx + (dz - 8) * (dz - 8) * 1.4 < 1.6) || (dz < 7.5 && Math.abs(dx) < 1.3)) { rgb(c, 0.04, 0.03, 0.03); emit(c, 0.06, 0.04, 0.02); }
    } else { rgb(c, 0.52, 0.54, 0.57); if (Math.floor(2 * c.hz) % 4 === 0) mul(c, 0.85); }
    return;
  }
  const t = vnoise(a * 0.4 + c.hz * 0.05, c.hz * 0.03, 3401);
  if (o.night) rgb(c, 0.03 + 0.03 * t, 0.035 + 0.03 * t, 0.05 + 0.04 * t); else rgb(c, 0.16 + 0.14 * t, 0.21 + 0.14 * t, 0.26 + 0.15 * t);
  if (Math.abs(a - n * 0.25) < 0.5 || Math.abs(a - n * 0.75) < 0.5) rgb(c, o.night ? 0.06 : 0.30, o.night ? 0.06 : 0.31, o.night ? 0.07 : 0.33);
  if (c.hz > o.cz + 12 && Math.abs(a - n * 0.5) < 0.3) rgb(c, 0.08, 0.08, 0.09);
});

// Le plan du quartier, sur son totem : les îlots, la voie rapide, le boulevard, « vous êtes ici ».
overlay('hauts_plan', (o, c) => {
  if (c.face !== o.face) return;
  const [la, lb] = loc(o, c), W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  const lt = H2 - 1 - lb;
  let col = [0.86, 0.86, 0.80];
  if (la === 0 || la === W2 - 1 || lt === 0 || lt === H2 - 1) col = [0.12, 0.12, 0.13];
  else if (lt < 4) { col = [0.16, 0.24, 0.40]; if (lt >= 1 && lt <= 2 && mod(la, 3) !== 0 && la > 2 && la < W2 - 3) col = [0.92, 0.92, 0.88]; }
  else if (lt === 5) col = [0.40, 0.40, 0.42];
  else if (lt === H2 - 3) col = [0.62, 0.58, 0.52];
  else { const bx = mod(la - 1, 5), by = mod(lt - 6, 4); if (bx < 3 && by < 2) col = hash(Math.floor((la - 1) / 5), Math.floor((lt - 6) / 4), 3501, 0) < 0.3 ? [0.35, 0.55, 0.38] : [0.70, 0.66, 0.60]; }
  if (Math.abs(la - W2 * 0.55) < 1.1 && Math.abs(lt - H2 * 0.62) < 1.1) col = [0.80, 0.12, 0.10];
  rgb(c, col[0], col[1], col[2]);
  if (o.lit) emit(c, col[0] * 0.55, col[1] * 0.55, col[2] * 0.55); else c.er = c.eg = c.eb = 0;
});

// ================================================================ le sol : la voie rapide, le talus, les rues, la dalle
function sol(k) {
  const W = k.W;
  // ---- la voie rapide, en tranchée (y 0–72) : le talus nord qui descend du niveau des champs, l'accotement,
  // deux chaussées de deux voies, le séparateur de béton, la bande d'arrêt et sa glissière, le talus sud
  W.box(0, 0, VZ + 1, WD, VR.sud[1], G + 1, 0);
  W.box(0, 0, -10, WD, VR.sud[1], VZ, M.SOIL);
  W.box(0, 0, VZ, WD, VR.acc, VZ + 1, M.GRASS);
  W.box(0, VR.acc, VZ, WD, VR.bau, VZ + 1, M.ASPHALT);
  for (const y of [VR.c1[0] + 1, VR.c1[1] - 2, VR.c2[0] + 1, VR.c2[1] - 2]) W.box(0, y, VZ, WD, y + 1, VZ + 1, M.ROADLINE);
  for (const y of [(VR.c1[0] + VR.c1[1]) >> 1, (VR.c2[0] + VR.c2[1]) >> 1]) for (let x = 0; x < WD; x += 46) W.box(x, y, VZ, x + 18, y + 1, VZ + 1, M.ROADLINE);
  W.box(0, VR.sep[0], VZ + 1, WD, VR.sep[1], VZ + 3, M.CONCRETE);
  W.box(0, VR.sep[0] + 1, VZ + 3, WD, VR.sep[1] - 1, VZ + 6, M.CONCRETE);
  for (let x = 0; x < WD; x++) {
    W.set(x, VR.bau - 1, VZ + 3, M.METAL); W.set(x, VR.bau - 1, VZ + 4, M.METAL);
    if (x % 6 === 0) for (let z = VZ + 1; z < VZ + 3; z++) W.set(x, VR.bau - 1, z, M.METAL_DARK);
  }
  // ---- les deux talus plantés : au nord, du niveau des champs (y = 0) à l'accotement ; au sud, de la bande
  // d'arrêt au trottoir de la rue de service
  const talus = (ya, yb, za, zb) => {
    for (let y = ya; y < yb; y++) for (let x = 0; x < WD; x++) {
      const t = (y - ya + 0.5) / (yb - ya);
      const top = Math.round(za + t * (zb - za) + (fbm(x / 11, y / 6, 1301) - 0.5) * 2 * Math.sin(t * Math.PI));
      W.box(x, y, -10, x + 1, y + 1, G + 1, 0);
      W.box(x, y, -10, x + 1, y + 1, top - 1, M.SOIL);
      W.set(x, y, top - 1, hash(x, y, 1302, 0) < 0.12 ? M.WEED : M.GRASS);
    }
  };
  talus(0, VR.nord, G, VZ + 1);
  talus(VR.sud[0], VR.sud[1], VZ + 1, G);
  for (const [ya, yb] of [[1, VR.nord - 1], [VR.sud[0] + 2, VR.sud[1] - 2]]) for (let x = 4; x < WD; x += 5 + Math.floor(k.rh(x, ya, 1303) * 7)) {
    const y = ya + Math.floor(k.rh(x, 1 + ya, 1303) * (yb - ya)), zt = topZ(W, x, y, -10, G) + 1;
    const v = k.rh(x, 2 + ya, 1303);
    if (v < 0.14) arbre(W, x, y, zt, { tronc: 7 + Math.floor(v * 30), r: 4 + v * 14, seed: x + ya, leafAmt: 0.25 });
    else buisson(W, x, y, zt - 1, 2 + v * 2.5, v < 0.7 ? M.HEDGE : M.WEED, x + ya);
  }
  // ---- la rue de service (y 76–100), ses trottoirs ; la clôture en haut du talus
  W.box(0, 72, 0, WD, 106, G, M.SIDEWALK);
  road(W, 0, RS[0], WD, RS[1]);
  for (let x = 0; x < WD; x++) { W.set(x, 72, G, M.METAL_DARK); if (x % 4 === 0) for (let z = G; z < G + 6; z++) W.set(x, 72, z, M.METAL_DARK); W.set(x, 72, G + 6, M.METAL_DARK); W.set(x, 72, G + 3, M.METAL_DARK); }
  // ---- les deux rues nord-sud, du trottoir du boulevard à la rue de service
  for (const [a, b] of NS) road(W, a, RS[1], b, HT);
  // ---- le trottoir du boulevard
  W.box(0, FR, 0, WD, HT, G, M.SIDEWALK);
  for (const [a, b] of NS) road(W, a, FR, b, HT);
}
// La dalle du parvis : une marche au-dessus du trottoir, en grandes dalles de granit.
function dalle(k) {
  const W = k.W;
  W.box(700, 106, 0, 1150, FR, DZ, M.HT_DALLE);
  W.box(700, 106, DZ - 1, 1150, FR, DZ, M.HT_DALLE, W.obj({ type: 'hauts_sol', kind: 'calepinage', x0: 708, y0: 112, p: 48 }));
  W.box(980, 284, DZ - 1, 1006, 310, DZ, M.HT_DALLE, W.obj({ type: 'hauts_sol', kind: 'medaillon', cx: 993, cy: 297, r: 12 }));
  // le nez de marche en granit noir, sur le trottoir du boulevard et sur l'allée
  W.box(700, FR - 1, DZ - 1, 1150, FR, DZ, M.CIM_GRANITE || M.STONE);
  W.box(700, 106, DZ - 1, 701, FR, DZ, M.CIM_GRANITE || M.STONE);
  W.box(1149, 106, DZ - 1, 1150, FR, DZ, M.CIM_GRANITE || M.STONE);
}
function road(W, x0, y0, x1, y1) { W.box(x0, y0, 0, x1, y1, G, 0); W.box(x0, y0, 0, x1, y1, 1, M.ASPHALT); }
function topZ(W, x, y, z0, z1) { for (let z = z1; z >= z0; z--) if (W.get(x, y, z)) return z; return z0 - 1; }
// Bordures et caniveaux là où un trottoir touche une chaussée, comme le fait le maître (zone.js).
function bordures(k) {
  const W = k.W;
  const isRoad = (x, y) => x >= 0 && y >= 0 && x < WD && y < HT && W.get(x, y, 1) === 0 && W.get(x, y, 0) === M.ASPHALT;
  const isWalk = (x, y) => W.get(x, y, 1) === M.SIDEWALK;
  for (let y = 72; y < HT; y++) for (let x = 0; x < WD; x++) {
    if (!isWalk(x, y)) continue;
    if (isRoad(x + 1, y) || isRoad(x - 1, y) || isRoad(x, y + 1) || isRoad(x, y - 1)) { W.set(x, y, 1, M.CURB); W.set(x, y, 0, M.CURB); }
  }
  for (let y = 72; y < HT; y++) for (let x = 0; x < WD; x++) {
    if (!isRoad(x, y)) continue;
    const c = (xx, yy) => W.get(xx, yy, 1) === M.CURB;
    if (c(x + 1, y) || c(x - 1, y) || c(x, y + 1) || c(x, y - 1)) W.set(x, y, 0, M.GUTTER);
  }
}

// ================================================================ les arbres et les petites choses
// Un arbre en boule (tilleul taillé, érable) : tronc, houppier tramé ; m : la matière du feuillage.
function arbre(W, x, y, zg, o = {}) {
  const th = o.tronc || 9, r = o.r || 5, m = o.m || M.FOLIAGE, seed = o.seed || 1;
  W.box(x, y, zg, x + 1, y + 1, zg + th, M.BARK);
  const cz = zg + th + r * 0.6;
  for (let z = Math.floor(cz - r); z <= cz + r; z++) for (let yy = Math.floor(y - r - 1); yy <= y + r + 1; yy++) for (let xx = Math.floor(x - r - 1); xx <= x + r + 1; xx++) {
    const d = Math.hypot(xx - x, yy - y, (z - cz) * 1.2) / r;
    if (d < 1 - 0.3 * hash(xx, yy, z, seed) && W.get(xx, yy, z) === 0) W.set(xx, yy, z, m);
  }
  if (o.leaves !== false) W.stampLeaves(x + 0.5, y + 0.5, r * 2.2, o.leafAmt || 0.5);
}
// Un buisson posé sur le sol (talus, jardinières).
function buisson(W, x, y, zg, r, m = M.HEDGE, seed = 1) {
  for (let z = zg; z <= zg + r; z++) for (let yy = Math.floor(y - r); yy <= y + r; yy++) for (let xx = Math.floor(x - r); xx <= x + r; xx++) {
    const d = Math.hypot(xx - x, yy - y, (z - zg) * 1.3) / r;
    if (d < 1 - 0.35 * hash(xx, yy, z, seed) && W.get(xx, yy, z) === 0) W.set(xx, yy, z, m);
  }
}

// ================================================================ les voitures
// Le long de axis, l'avant vers dir (−1 : vers les petits x ou y). berline 21 × 8 ; limousine 30 ; taxi : berline
// noire et son lumineux ; fourgon ; regie : le car-régie de la télévision et sa parabole.
function voiture(k, x, y, zg, axis, dir, paint, o = {}) {
  const W = k.W, md = o.modele || 'berline';
  const L = md === 'limousine' ? 30 : md === 'fourgon' ? 22 : md === 'regie' ? 40 : 21;
  const put = (a, b, z, m) => { const aa = dir < 0 ? a : L - 1 - a; if (axis === 'x') W.set(x + aa, y + b, zg + z, m); else W.set(x + b, y + aa, zg + z, m); };
  const bx = (a0, b0, z0, a1, b1, z1, m) => { for (let a = a0; a < a1; a++) for (let b = b0; b < b1; b++) for (let z = z0; z < z1; z++) put(a, b, z, m); };
  const D = md === 'regie' ? 10 : 8;
  for (const a0 of md === 'regie' ? [4, 15, L - 9] : [3, L - 6]) for (const b of [0, D - 1]) bx(a0, b, 0, a0 + 3, b + 1, 3, M.TIRE);
  bx(0, 1, 1, L, D - 1, 4, paint);
  bx(0, 1, 1, 1, D - 1, 2, M.CHROME); bx(L - 1, 1, 1, L, D - 1, 2, M.CHROME);
  if (md === 'fourgon' || md === 'regie') {
    bx(1, 1, 4, 5, D - 1, 7, M.CAR_GLASS); bx(1, 1, 7, 5, D - 1, 8, paint);
    bx(5, 1, 4, L, D - 1, md === 'regie' ? 12 : 9, paint);
    if (md === 'regie') { bx(10, 2, 12, 14, D - 2, 13, M.METAL); for (let dz = 0; dz < 6; dz++) for (let dd = -3; dd <= 3; dd++) if (Math.abs(dd) + Math.abs(dz - 3) <= 4) put(12, Math.floor(D / 2) + dd, 14 + dz, M.PLASTIC_WHITE); bx(8, D - 2, 10, L, D - 1, 11, M.PLASTIC_RED); }
  } else {
    const c0 = md === 'limousine' ? 8 : 6, c1 = md === 'limousine' ? 24 : 15;
    bx(c0, 1, 4, c1, D - 1, 6, M.CAR_GLASS);
    bx(c0, 1, 4, c0 + 1, D - 1, 6, paint); bx(c1 - 1, 1, 4, c1, D - 1, 6, paint);
    if (md === 'limousine') { bx(14, 1, 4, 15, D - 1, 6, paint); bx(19, 1, 4, 20, D - 1, 6, paint); } else bx(Math.floor((c0 + c1) / 2), 1, 4, Math.floor((c0 + c1) / 2) + 1, D - 1, 6, paint);
    bx(c0 + 1, 1, 6, c1 - 1, D - 1, 7, paint);
    bx(c1, 1, 4, L - 1, D - 1, 5, paint);
    if (md === 'taxi') { bx(9, 3, 7, 12, 5, 8, k.night && o.libre !== false ? M.LIT_PANEL : M.PLASTIC_WHITE); }
    if (md === 'limousine') { put(1, 2, 5, M.CHROME); put(1, 5, 5, M.CHROME); }
  }
  if (o.flanc && axis === 'x') {
    const fw = largeur(o.flanc, 1), s = Math.max(5, Math.floor((L + 5 - fw) / 2));
    new Facade(W, LEFT, x, y, L, D - 1).sign(s, zg + 10, o.flanc, { scale: 2, depth: 0, padX: 0, padY: 0, fg: [0.66, 0.10, 0.10] });
  }
  const lit = o.phares;
  put(0, 1, 2, lit ? M.HEADLIGHT : M.WHITE); put(0, D - 2, 2, lit ? M.HEADLIGHT : M.WHITE);
  put(L - 1, 1, 2, lit || k.night ? M.TAILLIGHT : M.PLASTIC_RED); put(L - 1, D - 2, 2, lit || k.night ? M.TAILLIGHT : M.PLASTIC_RED);
  if (lit) {
    // le faisceau des phares, vers l'avant
    const fx = axis === 'x' ? (dir < 0 ? x - 1 : x + L + 1) : x + D / 2, fy = axis === 'y' ? (dir < 0 ? y - 1 : y + L + 1) : y + D / 2;
    const ax = axis === 'x' ? [dir, 0, -0.17] : [0, dir, -0.17], al = Math.hypot(ax[0], ax[1], ax[2]);
    if (o.faisceau !== false) k.light({ x: fx, y: fy, z: zg + 3, r: 80, fall: 1.5, cr: 1.1, cg: 1.04, cb: 0.85, axis: [ax[0] / al, ax[1] / al, ax[2] / al], c0: 0.82, c1: 0.97, spill: 0, skip: 1 });
  }
}

// ================================================================ des lettres debout (enseignes de toit)
// Chaque point allumé de la police devient un petit cube : des lettres découpées, posées sur un cadre, qu'on
// voit en relief et qui laissent voir le ciel entre elles. sv : voxels par point ; le texte se lit vers +x.
function lettres(W, x, y, zTop, text, sv, m, t = 0) {
  const bmp = textBitmap(text);
  for (let bx = 0; bx < bmp.w; bx++) for (let by = 0; by < bmp.h; by++) if (bmp.at(bx, by))
    W.box(x + bx * sv, y, zTop - (by + 1) * sv, x + (bx + 1) * sv, y + 1, zTop - by * sv, m, t);
  return Math.ceil(bmp.w * sv);
}
function largeur(text, sv) { return Math.ceil(textBitmap(text).w * sv); }
// Une toiture à la Mansart en cuivre (les pavillons de l'Impérial) : brisis raide, terrasson, épi.
function mansardeCuivre(W, x0, y0, w, d, z0, h) {
  for (let i = 0; i < h; i++) { const r = Math.floor(i / 3); W.box(x0 + r, y0 + r, z0 + i, x0 + w - r, y0 + d - r, z0 + i + 1, M.HT_CUIVRE); }
  const r = Math.floor(h / 3);
  W.box(x0 + r + 1, y0 + r + 1, z0 + h, x0 + w - r - 1, y0 + d - r - 1, z0 + h + 1, M.ZINC);
  return z0 + h + 1;
}
// Les fenêtres d'un hôtel : allumées par chambres, rideaux tirés, tirées de la graine.
function chambre(k, x, y, z) {
  const v = k.rh(x, y, z + 2101), v2 = k.rh(x, y, z + 2102);
  const p = k.bad ? 0.16 : 0.46;
  const st = k.night && v < p ? (v2 < 0.12 ? 'tv' : 'lit') : 'dark';
  return { state: st, curtain: [[0.72, 0.56, 0.36], [0.62, 0.22, 0.20], [0.80, 0.74, 0.60]][Math.floor(v2 * 3)], spill: false };
}
// Un lampadaire de style, à trois globes (les cours d'honneur, la galerie).
function candelabre(k, x, y, zg, on) {
  const W = k.W;
  W.box(x, y, zg, x + 2, y + 2, zg + 2, M.METAL_DARK);
  W.box(x, y, zg + 2, x + 1, y + 1, zg + 15, M.METAL_DARK);
  for (const [dx, dy] of [[-2, 0], [2, 0], [0, 0]]) { W.set(x + dx, y + dy, zg + 13, M.METAL_DARK); W.set(x + dx, y + dy, zg + (dx || dy ? 14 : 16), on ? M.BULB : M.PLASTIC_WHITE); }
  W.set(x - 1, y, zg + 13, M.METAL_DARK); W.set(x + 1, y, zg + 13, M.METAL_DARK);
  if (on) k.light({ x: x + 0.5, y: y + 0.5, z: zg + 14, r: 40, fall: 2.2, cr: 1.3, cg: 0.92, cb: 0.48, spot: 0.4, skip: 2.2 });
}

// ================================================================ les tours : outils
const LIT_GOOD = { pLit: 0.32, pFull: 0.05, pScatter: 0.08, zw: 0 };
const LIT_BAD = { pLit: 0.11, pFull: 0.015, pScatter: 0.04, zw: 0 };
// Un volume de mur-rideau (x0..x1 × y0..y1 × z0..z1) ; p : la trame et le verre.
function vitres(k, x0, y0, x1, y1, z0, z1, p = {}) {
  const o = Object.assign({ type: 'hauts_rideau', x0, y0, x1, y1, z0, z1, night: k.night, bw: 8, fh: 16, sp: 3, mw: 1, tint: [0.10, 0.18, 0.22] }, k.bad ? LIT_BAD : LIT_GOOD, p);
  o.nf = Math.ceil((z1 - z0) / o.fh);
  o.seed = Math.floor(k.rh(x0, y0, z0 + 77) * 1e6);
  const id = k.W.obj(o);
  k.W.box(x0, y0, z0, x1, y1, z1, M.HT_VERRE, id);
  return id;
}
// Une teinte posée sur une boîte (une seule fois par réglage : on garde l'objet).
function tint(k, o) { return k.W.obj(Object.assign({ type: 'hauts_tint' }, o)); }
// Le toit d'une tour : étanchéité, acrotère, puis ce qu'on y pose.
function toit(k, x0, y0, x1, y1, z, o = {}) {
  const W = k.W, am = o.am || M.HT_ALU, ac = o.acrotere != null ? o.acrotere : 2;
  W.box(x0 + 1, y0 + 1, z - 1, x1 - 1, y1 - 1, z, M.ROOF_FLAT);
  if (ac) { W.box(x0, y0, z, x1, y0 + 1, z + ac, am); W.box(x0, y1 - 1, z, x1, y1, z + ac, am); W.box(x0, y0, z, x0 + 1, y1, z + ac, am); W.box(x1 - 1, y0, z, x1, y1, z + ac, am); }
  return z;
}
// Les édicules et machines d'un toit-terrasse, tirés de la graine.
function machines(k, x0, y0, x1, y1, z, n = 4) {
  const W = k.W;
  for (let i = 0; i < n; i++) {
    const w = 5 + Math.floor(k.rh(x0, i, 1501) * 6), d = 4 + Math.floor(k.rh(y0, i, 1502) * 4);
    const x = x0 + 3 + Math.floor(k.rh(x0 + i, y0, 1503) * Math.max(1, x1 - x0 - w - 6)), y = y0 + 3 + Math.floor(k.rh(x0, y0 + i, 1504) * Math.max(1, y1 - y0 - d - 6));
    if (W.get(x, y, z) || W.get(x + w - 1, y + d - 1, z)) continue;
    W.box(x, y, z, x + w, y + d, z + 3, M.METAL);
    W.box(x + 1, y + 1, z + 3, x + w - 1, y + d - 1, z + 4, M.METAL_DARK);
  }
}
// Une balise rouge d'obstacle (allumée la nuit, sans lumière ponctuelle : elle ne coûte rien).
function balise(k, x, y, z) { k.W.set(x, y, z, k.night ? M.RED_LIGHT : M.PLASTIC_RED); }
// Un mât sur un toit, sa balise au sommet.
function mat(k, x, y, z0, h) { k.W.box(x, y, z0, x + 1, y + 1, z0 + h, M.METAL); balise(k, x, y, z0 + h); }
// Le hall vitré au pied d'une tour (faces sud et est en retrait de rec) ; renvoie ses deux façades.
function hall(k, x0, y0, x1, y1, z0, h, o = {}) {
  const W = k.W, rs = o.recS != null ? o.recS : 6, re = o.recE != null ? o.recE : 6;
  const hx1 = x1 - re, hy1 = y1 - rs;
  W.box(x0, y0, z0, hx1, hy1, z0 + h, M.CIM_GRANITE || M.METAL_DARK);
  const fs = new Facade(W, LEFT, x0, y0, hx1 - x0, hy1 - y0), fe = new Facade(W, RIGHT, x0, y0, hx1 - x0, hy1 - y0);
  const lit = k.night && !o.off;
  const mk = (f, s0, w, extra) => {
    const id = W.obj(Object.assign({ type: 'hauts_hall', face: f.face, a0: f.a0(s0), z0, w, h, kind: o.kind || 'bureau', lit, seed: x0 + y0 }, extra));
    f.rect(s0, z0, s0 + w, z0 + h, 0, M.GLASS, id);
    return id;
  };
  const sW = o.sudDe || 0, sW1 = o.sudA || (hx1 - x0);
  if (o.sud !== false) mk(fs, sW, sW1 - sW, o.sudHall || {});
  if (o.est !== false) mk(fe, o.estDe || 0, (o.estA || (hy1 - y0)) - (o.estDe || 0), o.estHall || {});
  // la nuit, le hall déborde sur le parvis
  if (lit && o.spill !== false) {
    const L = (HALL[o.kind] || HALL.bureau).light, I = (o.spillI || 0.5) * (k.bad ? 0.6 : 1);
    if (o.sud !== false) { const p = fs.front((sW + sW1) / 2, z0 + h * 0.4, 3); k.light({ x: p.x, y: p.y, z: p.z, r: 40, cr: L[0] * I, cg: L[1] * I, cb: L[2] * I, shadow: false }); }
    if (o.est !== false) { const p = fe.front(((o.estDe || 0) + (o.estA || (hy1 - y0))) / 2, z0 + h * 0.4, 3); k.light({ x: p.x, y: p.y, z: p.z, r: 40, cr: L[0] * I, cg: L[1] * I, cb: L[2] * I, shadow: false }); }
  }
  // les piliers, sur l'alignement de la façade au-dessus
  const pm = o.pilier || M.HT_ALU, ps = o.pas || 24;
  if (rs > 2) for (let x = x0 + ps - 2; x < x1 - 4; x += ps) W.box(x, y1 - 3, z0, x + 2, y1 - 1, z0 + h, pm);
  if (re > 2) for (let y = y1 - 3; y > y0 + 4; y -= ps) W.box(x1 - 3, y - 2, z0, x1 - 1, y, z0 + h, pm);
  if (rs > 2 && re > 2) W.box(x1 - 3, y1 - 3, z0, x1 - 1, y1 - 1, z0 + h, pm);
  return { fs, fe, hx1, hy1 };
}
// Un auvent plat au-dessus d'une porte : une dalle mince qui avance de out voxels, son bandeau (où l'on écrit).
function auvent(k, f, s0, w, z, out, m = M.HT_ALU, t = 0) {
  for (let d = 1; d <= out; d++) f.rect(s0, z, s0 + w, z + 1, -d, m, t);
  f.rect(s0, z - 1, s0 + w, z + 2, -out - 1, m, t);
}
// Lumière sous un auvent, devant une porte.
function lumierePorte(k, f, s, z, out, c = [1.0, 0.82, 0.55], r = 30, I = 1) {
  const p = f.front(s, z, out);
  k.light({ x: p.x, y: p.y, z: p.z, r, cr: c[0] * I, cg: c[1] * I, cb: c[2] * I, skip: 1.5 });
}

// ================================================================ la tour Dalmène, l'assureur qui habille le club
// Au fond du parvis : verre bleu-vert, ailettes d'aluminium, un angle en redans, deux gradins, une couronne
// de lames où son nom s'allume la nuit, l'hélistation sur le toit.
function tourDalmene(k, P) {
  const W = k.W, x0 = 900, y0 = 112, x1 = 1012, y1 = 200, z0 = DZ, zl = DZ + 32, zf = 179;
  const verre = { tint: [0.08, 0.17, 0.20], bw: 8, fh: 16, sp: 3, mull: [0.50, 0.53, 0.56] };
  vitres(k, x0, y0, x1, y1, zl, zf, verre);
  // l'angle sud-est en redans, sur toute la hauteur
  W.box(x1 - 12, y1 - 12, zl, x1, y1, zf, 0);
  vitres(k, x1 - 12, y1 - 12, x1 - 6, y1 - 6, zl, zf, Object.assign({}, verre, { tint: [0.06, 0.14, 0.17] }));
  // les ailettes, une travée sur deux
  for (let x = x0 + 15; x < x1 - 12; x += 16) W.box(x, y1, zl, x + 1, y1 + 1, zf, M.HT_ALU);
  for (let y = y1 - 13 - 16; y > y0 + 2; y -= 16) W.box(x1, y, zl, x1 + 1, y + 1, zf, M.HT_ALU);
  // les gradins
  W.box(x0, y0, zf - 1, x1, y1, zf, M.HT_ALU);
  vitres(k, x0 + 6, y0 + 4, x1 - 6, y1 - 4, zf, 195, Object.assign({}, verre, { tint: [0.07, 0.15, 0.18] }));
  W.box(x0 + 6, y0 + 4, 194, x1 - 6, y1 - 4, 195, M.HT_ALU);
  // la couronne : des lames d'aluminium autour d'un toit-terrasse, le nom sur la face sud, éclairée la nuit
  const cx0 = x0 + 12, cy0 = y0 + 8, cx1 = x1 - 12, cy1 = y1 - 8, cz = 195, ct = 211;
  W.box(cx0 + 2, cy0 + 2, cz, cx1 - 2, cy1 - 2, cz + 4, M.HT_ALU);
  const glow = tint(k, { col: [0.62, 0.66, 0.70], e: k.night && !k.bad ? [0.14, 0.28, 0.40] : null, eTop: false });
  for (let x = cx0; x < cx1; x += 2) { W.box(x, cy1 - 1, cz, x + 1, cy1, ct, M.HT_ALU, glow); W.box(x, cy0, cz, x + 1, cy0 + 1, ct, M.HT_ALU); }
  for (let y = cy0; y < cy1; y += 2) { W.box(cx1 - 1, y, cz, cx1, y + 1, ct, M.HT_ALU, glow); W.box(cx0, y, cz, cx0 + 1, y + 1, ct, M.HT_ALU); }
  W.box(cx0 + 2, cy0 + 2, cz + 4, cx1 - 2, cy1 - 2, cz + 5, M.ROOF_FLAT);
  const fc = new Facade(W, LEFT, cx0, cy0, cx1 - cx0, cy1 - cy0);
  fc.rect(3, cz + 2, cx1 - cx0 - 3, cz + 15, 0, M.HT_ALU); fc.rect(3, cz + 2, cx1 - cx0 - 3, cz + 15, 1, M.HT_ALU);
  const NAME = 'DALMÈNE', nw = Math.ceil(textBitmap(NAME).w * 4 / 2);
  fc.sign(Math.floor((cx1 - cx0 - nw) / 2), cz + 14, NAME, Object.assign({ scale: 4, depth: 0, padX: 0, padY: 0 },
    k.night && !k.bad ? { fg: [0.80, 0.92, 1.0], emit: [0.70, 0.98, 1.35] } : k.night ? { fg: [0.30, 0.34, 0.38], worn: 0.35 } : { fg: [0.10, 0.28, 0.40] }));
  // l'hélistation
  const hp = W.obj({ type: 'hauts_sol', kind: 'helipad', x0: cx0 + 14, y0: cy0 + 8, r: 23, lit: k.night });
  W.box(cx0 + 14, cy0 + 8, cz + 4, cx0 + 61, cy0 + 55, cz + 5, M.ROOF_FLAT, hp);
  for (const [bx, by] of [[cx0, cy0], [cx1 - 1, cy0], [cx0, cy1 - 1], [cx1 - 1, cy1 - 1]]) balise(k, bx, by, ct);
  mat(k, cx1 - 6, cy0 + 5, cz + 5, 11);
  // le hall
  const H = hall(k, x0, y0, x1, y1, z0, 32, { kind: 'dalmene', recS: 8, recE: 8, pas: 16, pilier: M.HT_ALU,
    sudHall: { logo: 'DALMÈNE', desk: 56, door: [48, 64], sil: k.night ? [30, 170] : [30, 90, 160] }, estHall: { sil: k.night ? [] : [60] } });
  W.box(x0, y0, zl - 1, x1, y1, zl, M.HT_ALU);
  auvent(k, H.fs, 44, 24, z0 + 13, 9, M.HT_ALU);
  if (k.night) lumierePorte(k, H.fs, 56, z0 + 10, 6, [0.95, 0.92, 0.80], 34, 1.1);
  // le muret de granit noir au nom de l'assureur, devant le hall
  const mx0 = x0 + 6, my = H.hy1 + 14, mw = 36;
  W.box(mx0, my, z0, mx0 + mw, my + 3, z0 + 10, M.CIM_GRANITE || M.METAL_DARK);
  const fmu = new Facade(W, LEFT, mx0, my, mw, 3), or = k.night && !k.bad ? { fg: [1.0, 0.86, 0.52], emit: [1.0, 0.78, 0.38] } : { fg: [0.84, 0.68, 0.32] };
  fmu.sign(Math.floor((mw - largeur('DALMÈNE', 1)) / 2), z0 + 10, 'DALMÈNE', Object.assign({ scale: 2, depth: 0, padX: 0, padY: 0 }, or));
  fmu.sign(Math.floor((mw - largeur('ASSURANCES', 0.5)) / 2), z0 + 3, 'ASSURANCES', Object.assign({ scale: 1, depth: 0, padX: 0, padY: 0 }, or));
  if (k.night && !k.bad) k.light({ x: mx0 + mw / 2, y: my + 6, z: z0 + 1, r: 22, cr: 0.8, cg: 0.66, cb: 0.4, shadow: false });
  P.push({ key: 'tour_dalmene', label: 'La tour Dalmène', x: x0 + 56, y: H.hy1 + 4, z: G + 12 });
}

// ================================================================ la tour Écran, la chaîne de télévision
// À l'ouest du parvis : des bandeaux d'aluminium blanc, des fenêtres en longueur, la lame rouge où le nom
// descend lettre à lettre, des plateaux qui luisent bleu la nuit, le pylône d'émission et les paraboles.
function tourEcran(k, P) {
  const W = k.W, x0 = 716, y0 = 166, x1 = 812, y1 = 262, z0 = DZ, zl = DZ + 32, zt = zl + 8 * 16;
  vitres(k, x0, y0, x1, y1, zl, zt, { tint: [0.10, 0.13, 0.17], bw: 6, fh: 16, sp: 6, mw: 1, mull: [0.30, 0.32, 0.34], k: 0.66,
    warm: 0.05, pLit: k.bad ? 0.12 : 0.42, studio: true });
  for (let z = zl; z < zt; z += 16) { W.box(x0, y1, z, x1 + 1, y1 + 1, z + 6, M.HT_ALU); W.box(x1, y0, z, x1 + 1, y1 + 1, z + 6, M.HT_ALU); }
  // la lame rouge et le nom
  const red = tint(k, { col: [0.66, 0.10, 0.10], g: 0.04 });
  W.box(x1 - 22, y1 + 1, zl + 6, x1 - 12, y1 + 4, zt - 2, M.HT_ALU, red);
  const blade = new Facade(W, LEFT, x1 - 22, y1 + 1, 10, 3);
  ['É', 'C', 'R', 'A', 'N'].forEach((ch, i) => blade.sign(2, zt - 10 - i * 15, ch, Object.assign({ scale: 4, depth: 0, padX: 0, padY: 0 },
    k.night && !k.bad ? { fg: [1.0, 0.95, 0.90], emit: [1.3, 1.2, 1.1] } : k.night ? { fg: [0.55, 0.50, 0.48], worn: 0.3 } : { fg: [0.92, 0.90, 0.86] })));
  // l'étage technique, le toit, le pylône d'émission et les paraboles
  W.box(x0 + 6, y0 + 6, zt, x1 - 6, y1 - 6, zt + 10, M.HT_ALU, tint(k, { k: [0.92, 0.92, 0.94] }));
  toit(k, x0, y0, x1, y1, zt, { acrotere: 2 });
  toit(k, x0 + 6, y0 + 6, x1 - 6, y1 - 6, zt + 10, { acrotere: 1 });
  machines(k, x0 + 8, y0 + 30, x1 - 30, y1 - 8, zt + 10, 3);
  pylone(k, x1 - 20, y0 + 16, zt + 11, ZMAX - zt - 11);
  for (const [px, py] of [[x0 + 14, y0 + 12], [x0 + 26, y0 + 12], [x0 + 38, y0 + 12]]) parabole(k, px, py, zt + 11);
  // le hall sur pilotis, l'entrée à l'est, face au parvis
  const H = hall(k, x0, y0, x1, y1, z0, 32, { kind: 'ecran', recS: 10, recE: 10, pas: 16, pilier: M.HT_BETON,
    sudHall: { logo: 'ÉCRAN', desk: 40, sil: [30, 120] }, estHall: { logo: 'ÉCRAN', desk: 30, door: [24, 38], sil: k.night ? [] : [12, 110] } });
  W.box(x0, y0, zl - 1, x1, y1, zl, M.HT_ALU);
  // l'entrée, côté parvis : un auvent blanc qui sort d'entre les piliers, son bandeau rouge, le nom ; les drapeaux
  const ay0 = H.hy1 - 40, ay1 = H.hy1 - 22, ax1 = x1 + 12, az = z0 + 14;
  W.box(H.hx1, ay0, az, ax1, ay1, az + 1, M.HT_ALU);
  W.box(ax1 - 1, ay0, az - 2, ax1, ay1, az + 2, M.HT_ALU, red);
  for (const yy of [ay0, ay1 - 1]) W.box(ax1 - 2, yy, z0, ax1 - 1, yy + 1, az, M.HT_ALU);
  new Facade(W, RIGHT, ax1 - 1, ay0, 1, ay1 - ay0).sign(Math.floor((ay1 - ay0 - largeur('ÉCRAN', 0.5)) / 2), az + 2, 'ÉCRAN', Object.assign({ scale: 1, depth: 0, padX: 0, padY: 0 },
    k.night && !k.bad ? { fg: [1.0, 0.96, 0.92], emit: [1.2, 1.1, 1.0] } : { fg: [0.94, 0.92, 0.88] }));
  for (let i = 0; i < 3; i++) { const fx = ax1 + 8, fy = ay0 - 10 + i * 14; W.box(fx, fy, z0, fx + 1, fy + 1, z0 + 34, M.HT_ALU); drapeau(k, fx + 1, fy, z0 + 33, 'x', 'ecran', 10, 6); }
  if (k.night) lumierePorte(k, H.fe, 31, z0 + 12, 12, [0.95, 0.95, 1.0], 38, 1.1);
  // le car-régie, garé devant la tour
  voiture(k, 726, 268, z0, 'x', -1, M.CAR_WHITE, { modele: 'regie', flanc: 'ÉCRAN' });
  P.push({ key: 'tour_ecran', label: 'La tour Écran', x: H.hx1 + 6, y: H.hy1 - 31, z: G + 12 });
}
// Un pylône d'émission en treillis, qui s'affine ; balises rouges à chaque palier.
function pylone(k, x, y, z0, h) {
  const W = k.W;
  for (let z = z0; z < z0 + h; z++) {
    const t = (z - z0) / h, e = Math.max(1, Math.round(4 * (1 - t)));
    const a = x - e, b = x + e, c = y - e, d = y + e;
    for (const [px, py] of [[a, c], [b, c], [a, d], [b, d]]) W.set(px, py, z, M.METAL);
    if ((z - z0) % 6 === 0) { for (let i = a; i <= b; i++) { W.set(i, c, z, M.METAL); W.set(i, d, z, M.METAL); } for (let j = c; j <= d; j++) { W.set(a, j, z, M.METAL); W.set(b, j, z, M.METAL); } }
    else if ((z - z0) % 6 === 3) { W.set(x, d, z, M.METAL); W.set(b, y, z, M.METAL); }
    if ((z - z0) % 16 === 15) balise(k, b, d, z);
  }
  balise(k, x, y, z0 + h - 1);
}
// Une parabole tournée vers le sud.
function parabole(k, x, y, z) {
  const W = k.W;
  W.box(x, y, z, x + 1, y + 1, z + 3, M.METAL_DARK);
  for (let dz = 0; dz < 5; dz++) for (let dx = -2; dx <= 2; dx++) { if (Math.abs(dx) + Math.abs(dz - 2) > 3) continue; W.set(x + dx, y + 1, z + 3 + dz, M.PLASTIC_WHITE); }
  W.set(x, y + 2, z + 5, M.METAL_DARK);
}

// ================================================================ la tour de la Table des Hauts
// Au fond du parvis, à l'est de Dalmène : verre bronze, meneaux dorés ; tout en haut, en retrait, les deux
// étages vitrés du restaurant, qui luisent chaud la nuit, sa terrasse et sa pergola. L'ascenseur panoramique
// monte le long de la façade sud depuis le pavillon d'entrée, posé sur le parvis.
function tourTable(k, P) {
  const W = k.W, x0 = 1052, y0 = 120, x1 = 1132, y1 = 200, z0 = DZ, zl = DZ + 32, zr = zl + 8 * 16, zc = zr + 30;
  vitres(k, x0, y0, x1, y1, zl, zr, { tint: [0.20, 0.15, 0.10], bw: 8, fh: 16, sp: 4, mw: 1, mid: true, mull: [0.62, 0.52, 0.30], spCol: [0.16, 0.12, 0.08], warm: 0.3 });
  W.box(x0, y0, zr - 1, x1, y1, zr, M.HT_ALU);
  // le restaurant : deux niveaux entièrement vitrés, en retrait de 4 ; chaud la nuit (sauf en mauvaise saison, à moitié)
  const rest = { tint: [0.16, 0.12, 0.09], bw: 6, fh: 30, sp: 2, pl: 3, mw: 1, mull: [0.20, 0.16, 0.12], spCol: [0.10, 0.08, 0.06],
    pLit: k.bad ? 0.5 : 1, pFull: 0, pScatter: 0, zw: 3, warm: 1, k: 0.85 };
  vitres(k, x0 + 4, y0 + 4, x1 - 4, y1 - 4, zr, zc, rest);
  // la terrasse : garde-corps de verre, bacs plantés
  for (let x = x0; x < x1; x++) { W.set(x, y1 - 1, zr, M.BOOTH); W.set(x, y1 - 1, zr + 1, M.BOOTH); }
  for (let y = y0; y < y1; y++) { W.set(x1 - 1, y, zr, M.BOOTH); W.set(x1 - 1, y, zr + 1, M.BOOTH); }
  for (let x = x0 + 6; x < x1 - 6; x += 14) W.box(x, y1 - 3, zr, x + 4, y1 - 1, zr + 2, M.HEDGE);
  // le toit, la pergola, la balise
  toit(k, x0 + 4, y0 + 4, x1 - 4, y1 - 4, zc, { acrotere: 1 });
  for (let x = x0 + 4; x < x1 - 4; x += 6) W.box(x, y0 + 4, zc + 6, x + 1, y1 - 4, zc + 7, M.HT_ALU);
  for (const [px, py] of [[x0 + 4, y0 + 4], [x1 - 5, y0 + 4], [x0 + 4, y1 - 5], [x1 - 5, y1 - 5]]) W.box(px, py, zc, px + 1, py + 1, zc + 7, M.HT_ALU);
  W.box(x0 + 4, y1 - 5, zc + 6, x1 - 4, y1 - 4, zc + 7, M.HT_ALU); W.box(x1 - 5, y0 + 4, zc + 6, x1 - 4, y1 - 4, zc + 7, M.HT_ALU);
  if (k.night && !k.bad) for (let x = x0 + 6; x < x1 - 6; x += 4) W.set(x, y1 - 5, zc + 5, M.BULB);
  balise(k, x1 - 5, y0 + 4, zc + 7);
  // le hall des bureaux, à l'est de l'ascenseur
  const H = hall(k, x0, y0, x1, y1, z0, 32, { kind: 'bureau', recS: 0, recE: 6, pas: 16, sudDe: 52, estHall: { sil: [] }, sudHall: { door: [8, 18], desk: 18 } });
  W.box(x0, y0, zl - 1, x1, y1, zl, M.HT_ALU);
  // l'ascenseur panoramique : une gaine de verre et ses montants, la cabine éclairée
  const ax0 = x0 + 30, ax1 = ax0 + 12, ay0 = y1, ay1 = y1 + 7;
  for (const [px, py] of [[ax0, ay0], [ax1 - 1, ay0], [ax0, ay1 - 1], [ax1 - 1, ay1 - 1]]) W.box(px, py, z0, px + 1, py + 1, zc, M.HT_ALU);
  const cabZ = k.night ? zr - 22 : zl + 46;
  const gaine = W.obj({ type: 'hauts_gaine', x0: ax0, y0: ay0, w: ax1 - ax0, d: ay1 - ay0, cz: cabZ, night: k.night, lit: k.night && !k.bad });
  W.box(ax0 + 1, ay0, z0 + 18, ax1 - 1, ay1, zc, M.GLASS, gaine);
  for (let z = z0 + 18; z < zc; z += 16) { W.box(ax0, ay1 - 1, z, ax1, ay1, z + 1, M.HT_ALU); W.box(ax1 - 1, ay0, z, ax1, ay1, z + 1, M.HT_ALU); }
  W.box(ax0, ay0, zc, ax1, ay1, zc + 3, M.HT_ALU);
  // le pavillon d'entrée de la Table, posé sur le parvis : granit noir, auvent, enseigne dorée, lanternes
  const px0 = ax0 - 10, px1 = ax1 + 10, py0 = y1, py1 = y1 + 14, pz = z0 + 18;
  W.box(px0, py0, z0, px1, py1, pz, M.CIM_GRANITE);
  W.box(px0 - 1, py0, pz, px1 + 1, py1 + 1, pz + 2, M.METAL_DARK);
  const fp = new Facade(W, LEFT, px0, py0, px1 - px0, py1 - py0);
  const lit = k.night && !k.bad;
  const id = W.obj({ type: 'hauts_hall', face: LEFT, a0: fp.a0(6), z0, w: px1 - px0 - 12, h: 13, kind: 'table', lit: k.night, k: k.bad ? 0.5 : 1, door: [2, 10], desk: 3, seed: 7 });
  fp.rect(6, z0, px1 - px0 - 6, z0 + 13, 0, M.GLASS, id);
  const noir = tint(k, { col: [0.08, 0.075, 0.07], g: 0.05 });
  auvent(k, fp, 4, px1 - px0 - 8, z0 + 14, 6, M.CANVAS, noir);
  const T = 'LA TABLE DES HAUTS', tw = Math.ceil(textBitmap(T).w / 2);
  fp.sign(Math.max(0, Math.floor((px1 - px0 - tw) / 2)), pz - 0, T, Object.assign({ scale: 1, depth: 0, padX: 0, padY: 0 },
    lit ? { fg: [1.0, 0.82, 0.45], emit: [1.2, 0.86, 0.38] } : { fg: [0.80, 0.64, 0.30] }));
  for (const s of [2, px1 - px0 - 3]) { fp.set(s, z0 + 12, -1, M.METAL_DARK); fp.set(s, z0 + 11, -1, lit ? M.BULB : M.GLASS); fp.set(s, z0 + 10, -1, M.METAL_DARK); }
  for (const s of [0, px1 - px0 - 3]) { const [bx, by] = fp.xy(s, -4); W.box(bx, by, z0, bx + 3, by + 3, z0 + 3, M.CIM_GRANITE); buisson(W, bx + 1, by + 1, z0 + 3, 2.2, M.HEDGE, bx); }
  if (k.night) { lumierePorte(k, fp, 10, z0 + 11, 5, [1.0, 0.76, 0.45], 30, lit ? 1.1 : 0.5); }
  P.push({ key: 'table_hauts', label: 'La Table des Hauts', x: px0 + 13, y: py1 + 4, z: G + 12 });
}

// ================================================================ la tour ronde (le groupe Roquemont), à l'est de la rue
// Un cylindre de verre sombre cerclé d'anneaux de béton blanc, sur un rez-de-chaussée en retrait.
function cylindre(W, cx, cy, R, z0, z1, m, t) {
  for (let y = Math.floor(cy - R); y <= Math.ceil(cy + R); y++) {
    const dy = y + 0.5 - cy; if (Math.abs(dy) > R) continue;
    const hw = Math.sqrt(R * R - dy * dy);
    W.box(Math.round(cx - hw), y, z0, Math.round(cx + hw), y + 1, z1, m, t);
  }
}
function tourRonde(k, P) {
  const W = k.W, cx = 1508, cy = 192, R = 38, z0 = G, zl = G + 32, zt = zl + 6 * 16;
  const o = Object.assign({ type: 'hauts_rideau', round: true, cx, cy, R, x0: cx - R, y0: cy - R, x1: cx + R, y1: cy + R, z0: zl, z1: zt, night: k.night,
    bw: 7, fh: 16, sp: 5, mw: 1, tint: [0.07, 0.12, 0.12], mull: [0.32, 0.34, 0.34], spCol: [0.10, 0.12, 0.12] }, k.bad ? LIT_BAD : LIT_GOOD);
  o.nf = 6; o.seed = Math.floor(k.rh(cx, cy, 5) * 1e6);
  cylindre(W, cx, cy, R, zl, zt, M.HT_VERRE, W.obj(o));
  for (let z = zl; z < zt; z += 16) cylindre(W, cx, cy, R + 1, z, z + 5, M.HT_BETON);
  // le couronnement : un anneau ajouré, le toit, le nom
  cylindre(W, cx, cy, R + 1, zt, zt + 4, M.HT_BETON);
  cylindre(W, cx, cy, R - 1, zt + 4, zt + 5, M.ROOF_FLAT);
  for (let a = 0; a < 72; a++) { const t = a / 72 * Math.PI * 2, x = Math.round(cx + Math.cos(t) * R), y = Math.round(cy + Math.sin(t) * R); W.box(x, y, zt + 4, x + 1, y + 1, zt + 14, M.HT_BETON); }
  cylindre(W, cx, cy, R + 1, zt + 14, zt + 16, M.HT_BETON);
  cylindre(W, cx, cy, R - 1, zt + 14, zt + 16, 0);
  machines(k, cx - 20, cy - 20, cx + 20, cy + 20, zt + 5, 4);
  mat(k, cx - 6, cy - 10, zt + 5, 24);
  // le rez-de-chaussée vitré, en retrait, et ses piliers
  const hid = W.obj({ type: 'hauts_rideau', round: true, cx, cy, R: R - 5, x0: cx - R, y0: cy - R, x1: cx + R, y1: cy + R, z0, z1: zl, night: k.night, bw: 10, fh: 32, sp: 0, pl: 3, mw: 1,
    tint: [0.08, 0.10, 0.11], pLit: k.bad ? 0.3 : 1, pFull: 0, pScatter: 0, zw: 99, nf: 1, seed: 11, k: 0.55 });
  cylindre(W, cx, cy, R - 5, z0, zl, M.HT_VERRE, hid);
  cylindre(W, cx, cy, R + 1, zl - 1, zl, M.HT_BETON);
  for (let a = 0; a < 16; a++) { const t = a / 16 * Math.PI * 2, x = Math.round(cx + Math.cos(t) * (R - 1)), y = Math.round(cy + Math.sin(t) * (R - 1)); W.box(x - 1, y - 1, z0, x + 1, y + 1, zl, M.HT_BETON); }
  // l'enseigne, sur la face sud du couronnement
  const f = new Facade(W, LEFT, cx - 26, cy + R - 2, 52, 3);
  const N = 'ROQUEMONT', nw = Math.ceil(textBitmap(N).w * 2 / 2);
  f.sign(Math.floor((52 - nw) / 2), zt + 13, N, Object.assign({ scale: 2, depth: -1, padX: 0, padY: 0 }, k.night && !k.bad ? { fg: [1.0, 0.92, 0.80], emit: [1.1, 0.95, 0.75] } : { fg: [0.30, 0.30, 0.32] }));
  // l'entrée au sud : un auvent de béton blanc sur deux poteaux, deux bacs plantés
  const ey0 = cy + R - 8, ey1 = cy + R + 12, ex0 = cx - 11, ex1 = cx + 11, ez = G + 15;
  W.box(ex0, ey0, ez, ex1, ey1, ez + 2, M.HT_BETON);
  for (const xx of [ex0 + 1, ex1 - 2]) W.box(xx, ey1 - 2, G, xx + 1, ey1 - 1, ez, M.HT_BETON);
  for (const xx of [ex0 - 6, ex1 + 2]) { W.box(xx, ey1 - 4, G, xx + 4, ey1, G + 3, M.HT_BETON); buisson(W, xx + 2, ey1 - 2, G + 3, 2, M.HEDGE, xx); }
  if (k.night) k.light({ x: cx, y: ey1 - 4, z: ez - 2, r: 32, cr: 0.85, cg: 0.85, cb: 0.80, skip: 1.5 });
}

// ================================================================ la tour Valdorne, derrière l'Impérial
// Les années soixante-dix : une résille de béton blanc préfabriqué, fenêtres carrées en creux, verre bronze.
function tourValdorne(k, P) {
  const W = k.W, x0 = 466, y0 = 108, x1 = 562, y1 = 168, z0 = G, zl = G + 22, fh = 14, nf = 10, zt = zl + nf * fh;
  vitres(k, x0, y0, x1, y1, zl, zt, { tint: [0.16, 0.13, 0.10], bw: 8, fh, sp: 0, mw: 0, mid: true, mull: [0.20, 0.18, 0.16], warm: 0.35 });
  for (let x = x0; x <= x1; x += 8) W.box(x, y1, zl, x + 2, y1 + 1, zt, M.HT_BETON);
  for (let y = y1; y >= y0; y -= 8) W.box(x1, y - 2, zl, x1 + 1, y, zt, M.HT_BETON);
  for (let z = zl; z <= zt; z += fh) { W.box(x0, y1, z, x1 + 1, y1 + 1, z + 3, M.HT_BETON); W.box(x1, y0, z, x1 + 1, y1 + 1, z + 3, M.HT_BETON); }
  W.box(x0, y0, zt, x1 + 1, y1 + 1, zt + 8, M.HT_BETON);
  toit(k, x0, y0, x1 + 1, y1 + 1, zt + 8, { acrotere: 0 });
  W.box(x0 + 30, y0 + 10, zt + 8, x0 + 56, y0 + 30, zt + 18, M.HT_BETON);
  machines(k, x0 + 4, y0 + 4, x1 - 4, y1 - 4, zt + 8, 3);
  mat(k, x0 + 44, y0 + 18, zt + 18, 10);
  hall(k, x0, y0, x1, y1, z0, 22, { kind: 'bureau', recS: 4, recE: 4, pas: 16, pilier: M.HT_BETON });
  W.box(x0, y0, zl - 1, x1, y1, zl, M.HT_BETON);
}

// ================================================================ la tour postmoderne, derrière le cabinet Verdier
// Les années quatre-vingt : piles d'angle en granit rose, bandeaux tous les quatre étages, verre vert,
// trois gradins et un chapeau pyramidal de cuivre, sa lanterne allumée la nuit.
function tourRose(k, P) {
  const W = k.W, x0 = 1268, y0 = 112, x1 = 1364, y1 = 200, z0 = G, zl = G + 24;
  const rose = tint(k, { col: [0.62, 0.44, 0.40], g: 0.06 });
  const verre = { tint: [0.08, 0.16, 0.12], bw: 6, fh: 16, sp: 4, mw: 1, mull: [0.30, 0.34, 0.30], spCol: [0.10, 0.14, 0.11] };
  const pile = (a0, b0, a1, b1, z1) => W.box(a0, b0, z0, a1, b1, z1, M.HT_BETON, rose);
  // trois gradins
  const T = [[0, zl, 160], [6, 160, 174], [12, 174, 186]];
  for (const [i, za, zb] of T) {
    vitres(k, x0 + i, y0 + i, x1 - i, y1 - i, za, zb, verre);
    W.box(x0 + i, y0 + i, zb - 1, x1 - i, y1 - i, zb, M.HT_BETON, rose);
    const p = 8;
    for (const [a, b] of [[x0 + i, y1 - i - p], [x1 - i - p, y1 - i - p], [x1 - i - p, y0 + i], [x0 + i, y0 + i]]) W.box(a, b, za, a + p, b + p, zb, M.HT_BETON, rose);
  }
  for (let z = zl + 64; z < 164; z += 64) { W.box(x0, y1, z, x1 + 1, y1 + 1, z + 6, M.HT_BETON, rose); W.box(x1, y0, z, x1 + 1, y1 + 1, z + 6, M.HT_BETON, rose); }
  // le chapeau
  let z = 186;
  for (let i = 0; i < 16; i++, z++) W.box(x0 + 12 + i * 2, y0 + 12 + i * 2, z, x1 - 12 - i * 2, y1 - 12 - i * 2, z + 1, M.HT_CUIVRE);
  const lant = tint(k, { col: [0.95, 0.85, 0.60], e: k.night ? [1.0, 0.80, 0.45] : null });
  W.box(Math.floor((x0 + x1) / 2) - 2, Math.floor((y0 + y1) / 2) - 2, z, Math.floor((x0 + x1) / 2) + 2, Math.floor((y0 + y1) / 2) + 2, z + 4, M.HT_ALU, lant);
  mat(k, Math.floor((x0 + x1) / 2), Math.floor((y0 + y1) / 2), z + 4, 6);
  hall(k, x0, y0, x1, y1, z0, 24, { kind: 'bureau', recS: 4, recE: 4, pas: 32, pilier: M.HT_BETON });
  W.box(x0, y0, zl - 1, x1, y1, zl, M.HT_BETON, rose);
}

// ================================================================ l'Impérial, le palace
// Le palace d'avant les tours : pierre de taille, deux pavillons coiffés de cuivre, l'avant-corps et son
// fronton, les balcons de fer, la marquise de verre au-dessus du perron, le tapis rouge, le portier, le nom en
// lettres debout sur le toit. Devant, la cour d'honneur, sa boucle, son îlot et sa fontaine.
function imperial(k, P) {
  const W = k.W, x0 = 414, y0 = 176, x1 = 646, y1 = 276, S = M.ESTQ_ASHLAR || M.STONE;
  const Zc = 99, PAV = [[414, 462], [598, 646]], AC = [506, 554];
  // les volumes : le corps, les pavillons (un étage de plus), l'avant-corps (saillie de 4)
  W.box(x0, y0, G, x1, y1, Zc, S);
  for (const [a, b] of PAV) { W.box(a, y0, G, b, y1 + 4, Zc + 15, S); }
  W.box(AC[0], y1, G, AC[1], y1 + 4, Zc, S);
  // les façades : corps (deux travées), pavillons, avant-corps ; la face est
  const parts = [[462, 506, y1], [554, 598, y1], [414, 462, y1 + 4], [598, 646, y1 + 4], [506, 554, y1 + 4]];
  for (const [a, b, yf] of parts) {
    const f = new Facade(W, LEFT, a, y0, b - a, yf - y0), n = b - a;
    const pav = n === 48 && a !== AC[0], ac = a === AC[0];
    f.rect(0, 24, n, 25, -1, M.STONE); f.rect(0, Zc, n, Zc + 1, -1, M.STONE); f.rect(0, Zc + 1, n, Zc + 3, -2, M.STONE); f.rect(0, Zc + 1, n, Zc + 3, -1, M.STONE);
    if (pav) { f.rect(0, Zc + 15, n, Zc + 16, -1, M.STONE); for (let z = G; z < Zc + 15; z += 4) { f.rect(0, z, 3, z + 2, -1, M.STONE); f.rect(n - 3, z, n, z + 2, -1, M.STONE); } }
    const bays = n >= 48 ? [7, 21, 35] : [5, 19, 33];
    for (const s of bays) {
      const wx = f.xy(s, 0)[0];
      // le rez-de-chaussée : de hautes baies (le bar, le salon) ; l'entrée au milieu de l'avant-corps
      if (!(ac && s === 21)) { const c = chambre(k, wx, yf, 5); f.window(s - 1, 5, 7, 15, { state: k.night && !k.bad ? (k.rh(wx, 1, 2103) < 0.8 ? 'lit' : 'dark') : c.state === 'tv' ? 'dark' : c.state, curtain: [0.62, 0.22, 0.20], spill: false, col: [1.0, 0.72, 0.40], k: 0.7, sil: k.night && k.rh(wx, 2, 2104) < 0.4 ? 'head' : null }); f.set(s + 2, 21, -1, M.STONE); }
      for (let e = 1; e <= 5; e++) {
        const z0 = 24 + (e - 1) * 15 + 3, h = e === 5 ? 8 : e === 1 ? 11 : 10;
        const c = chambre(k, wx, yf, z0);
        f.window(s, z0, 5, h, Object.assign(c, { balcony: e === 1 || (e === 4 && !pav) ? 'rail' : null, sillMat: M.STONE }));
        if (e === 1 || e === 2) f.rect(s - 1, z0 + h + 1, s + 6, z0 + h + 2, -1, M.STONE);
      }
      if (pav) { const c = chambre(k, wx, yf, Zc + 4); f.window(s, Zc + 4, 5, 8, Object.assign(c, { sillMat: M.STONE })); }
    }
  }
  // la face est (sur l'allée) : les fenêtres du pavillon et du corps
  const fe = new Facade(W, RIGHT, 598, y0, 48, y1 + 4 - y0);
  fe.rect(0, 24, y1 + 4 - y0, 25, -1, M.STONE); fe.rect(0, Zc, y1 + 4 - y0, Zc + 1, -1, M.STONE); fe.rect(0, Zc + 15, y1 + 4 - y0, Zc + 16, -1, M.STONE);
  for (let s = 8; s < y1 + 4 - y0 - 6; s += 13) {
    const wy = fe.xy(s, 0)[1];
    fe.window(s, 6, 5, 13, { state: 'dark', spill: false });
    for (let e = 1; e <= 6; e++) { const z0 = e <= 5 ? 24 + (e - 1) * 15 + 3 : Zc + 4; const c = chambre(k, 646, wy, z0); fe.window(s, z0, 5, e === 5 || e === 6 ? 8 : 10, Object.assign(c, { sillMat: M.STONE })); }
  }
  // les toits : la mansarde d'ardoise du corps et ses lucarnes, les pavillons de cuivre et leurs épis
  const zr = B.mansard(W, 462, y0 + 2, 136, y1 - y0 - 2, Zc + 2, 14);
  W.box(466, y0 + 6, zr - 1, 594, y1 - 4, zr, M.SLATE);
  // la verrière du jardin d'hiver, au milieu du toit : elle luit la nuit
  for (let i = 0; i < 5; i++) W.box(486 + i * 2, 232 + i, zr + i, 574 - i * 2, 264 - i, zr + i + 1, k.night && !k.bad ? M.SKYLIGHT : M.BOOTH);
  for (let x = 488; x < 574; x += 8) for (let i = 0; i < 5; i++) { W.set(x, 232 + i, zr + i, M.METAL_DARK); W.set(x, 263 - i, zr + i, M.METAL_DARK); }
  for (const at of [468, 482, 572, 586]) B.dormer(W, LEFT, 462, y0 + 2, 136, y1 - y0 - 2, at, Zc + 3, { state: k.night && k.rh(at, 0, 2105) < 0.5 ? 'lit' : 'dark', spill: false });
  for (const [a, b] of PAV) {
    const zt = mansardeCuivre(W, a - 1, y0 - 1, b - a + 2, y1 + 6 - y0, Zc + 16, 15);
    const cx = Math.floor((a + b) / 2), cy = Math.floor((y0 + y1) / 2);
    W.box(cx - 2, cy - 2, zt, cx + 2, cy + 2, zt + 4, M.HT_CUIVRE); W.box(cx - 1, cy - 1, zt + 4, cx + 1, cy + 1, zt + 9, M.GOLD || M.METAL);
    B.dormer(W, LEFT, a - 1, y0 - 1, b - a + 2, y1 + 6 - y0, cx - 3, Zc + 18, { state: k.night && k.rh(a, 3, 2106) < 0.5 ? 'lit' : 'dark', spill: false });
    B.chimney(W, a + 4, y0 + 10, zt - 2, 6, S);
  }
  for (const x of [470, 520, 580]) B.chimney(W, x, y0 + 30, zr - 1, 5, S);
  // l'avant-corps : le fronton, son écusson ; les mâts et leurs drapeaux
  const fa = new Facade(W, LEFT, AC[0], y0, 48, y1 + 4 - y0);
  for (let i = 0; i < 12; i++) fa.rect(4 + i * 2, Zc + 3 + i, 44 - i * 2, Zc + 4 + i, 0, S);
  for (let i = 0; i < 12; i++) { fa.rect(3 + i * 2, Zc + 3 + i, 5 + i * 2, Zc + 4 + i, -1, M.STONE); fa.rect(43 - i * 2, Zc + 3 + i, 45 - i * 2, Zc + 4 + i, -1, M.STONE); }
  fa.crest(21, Zc + 4, 6, 7);
  // le nom, en lettres debout sur le toit, au-dessus de l'avant-corps
  const N = "L'IMPÉRIAL", sv = 2, nw = largeur(N, sv), lx = Math.round((AC[0] + AC[1]) / 2 - nw / 2), ly = y0 + 40, lz = zr + 14;
  const gilt = tint(k, k.night && !k.bad ? { col: [1.0, 0.86, 0.55], e: [1.25, 0.95, 0.50] } : k.night ? { col: [0.40, 0.34, 0.22] } : { col: [0.86, 0.68, 0.28], g: 0.08 });
  lettres(W, lx, ly, lz, N, sv, M.HT_ALU, gilt);
  for (let x = lx - 2; x < lx + nw + 2; x += 10) W.box(x, ly - 1, zr - 2, x + 1, ly, lz - 2, M.METAL_DARK);
  W.box(lx - 2, ly - 1, lz - 13, lx + nw + 2, ly, lz - 12, M.METAL_DARK);
  if (k.night && !k.bad) k.light({ x: lx + nw / 2, y: ly + 6, z: lz - 6, r: 48, cr: 0.9, cg: 0.66, cb: 0.30, shadow: false });
  // l'entrée : le portail, la porte à tambour, les portes latérales, le perron, la marquise, le tapis
  const yf = y1 + 4, ex = 530;
  fa.rect(14, G, 34, G + 20, 0, 0); fa.rect(14, G, 34, G + 20, 1, 0);
  const hid = W.obj({ type: 'hauts_hall', face: LEFT, a0: fa.a0(14), z0: G + 1, w: 20, h: 18, kind: 'hotel', lit: k.night, k: k.bad ? 0.5 : 1, desk: 10, seed: 3, sil: k.night ? [6] : [] });
  fa.rect(14, G + 1, 34, G + 19, 2, M.GLASS, hid);
  fa.rect(13, G, 14, G + 21, 0, M.STONE); fa.rect(34, G, 35, G + 21, 0, M.STONE); fa.rect(13, G + 20, 35, G + 22, 0, M.STONE);
  fa.rect(22, G + 22, 26, G + 24, -1, M.STONE);
  cylindre(W, ex, yf - 1, 5, G + 1, G + 13, M.BOOTH);
  cylindre(W, ex, yf - 1, 5.6, G + 13, G + 15, M.METAL_DARK);
  W.box(ex, yf - 1, G + 1, ex + 1, yf, G + 13, M.METAL_DARK);
  W.box(AC[0] + 6, yf, 0, AC[1] - 6, yf + 5, G + 1, M.STONE);
  W.box(AC[0] + 4, yf + 5, 0, AC[1] - 4, yf + 8, G, M.STONE);
  W.box(ex - 6, yf, G, ex + 6, yf + 5, G + 1, M.CARPET); W.box(ex - 6, yf + 5, G - 1, ex + 6, yf + 22, G, M.CARPET);
  // la marquise : verre et fer, sur deux colonnes, des ampoules le long du bandeau
  const mz = G + 24, my1 = yf + 22;
  W.box(AC[0] + 2, yf, mz, AC[1] - 2, my1, mz + 1, M.BOOTH);
  for (let x = AC[0] + 2; x < AC[1] - 2; x += 6) W.box(x, yf, mz + 1, x + 1, my1, mz + 2, M.METAL_DARK);
  W.box(AC[0] + 2, my1 - 1, mz - 2, AC[1] - 2, my1, mz + 2, M.METAL_DARK);
  for (const x of [AC[0] + 3, AC[1] - 4]) { W.box(x, my1 - 2, 1, x + 1, my1 - 1, mz, M.METAL_DARK); for (let i = 0; i < 9; i++) W.set(x, yf + 1 + i * 2, mz + 9 - i, M.METAL_DARK); }
  const fm = new Facade(W, LEFT, AC[0] + 2, yf, AC[1] - AC[0] - 4, my1 - yf);
  const MN = 'IMPÉRIAL', mw = largeur(MN, 0.5);
  fm.sign(Math.floor((AC[1] - AC[0] - 4 - mw) / 2), mz + 2, MN, Object.assign({ scale: 1, depth: 0, padX: 0, padY: 0 }, k.night && !k.bad ? { fg: [1.0, 0.86, 0.5], emit: [1.0, 0.75, 0.35] } : { fg: [0.86, 0.70, 0.32] }));
  if (k.night) for (let x = AC[0] + 3; x < AC[1] - 3; x += 3) W.set(x, my1 - 1, mz - 3, k.bad && x % 2 ? M.GLASS : M.BULB);
  if (k.night) { k.light({ x: ex + 0.5, y: yf + 12, z: mz - 3, r: 46, cr: 1.25, cg: 0.92, cb: 0.52, skip: 2.5 }); k.light({ x: ex + 0.5, y: yf + 2, z: G + 10, r: 22, cr: 0.8, cg: 0.6, cb: 0.3, skip: 1.5, shadow: false }); }
  // les mâts à drapeaux, penchés au-dessus de la marquise
  for (const [i, s] of [[0, 8], [1, 24], [2, 40]]) {
    const [bx] = fa.xy(s, 0);
    for (let j = 0; j < 9; j++) W.set(bx, yf + j, mz + 14 + Math.floor(j * 0.7), M.METAL);
    drapeau(k, bx, yf + 3, mz + 13, 'y', i === 1 ? 'imperial' : 'aube');
  }
  // les lauriers en caisse, de part et d'autre du perron
  for (const x of [AC[0] + 1, AC[1] - 4]) { W.box(x, yf + 1, G, x + 3, yf + 4, G + 3, M.WOOD_DARK); buisson(W, x + 1, yf + 2, G + 6, 2.6, M.HEDGE, x); W.box(x + 1, yf + 2, G + 3, x + 2, yf + 3, G + 5, M.BARK); }
  P.push({ key: 'hotel_imperial', label: "L'Impérial", x: ex + 0.5, y: yf + 10, z: G + 12 });

  // ---- la cour d'honneur : la boucle des voitures, l'îlot, sa fontaine, ses candélabres, la grille sur le boulevard
  road(W, 400, y1 + 4 + 8, 650, FR - 2);
  road(W, NS[0][1], y1 + 14, 400, FR - 4);
  const ix0 = 474, ix1 = 590, iy0 = 304, iy1 = 320;
  W.box(ix0, iy0, 0, ix1, iy1, G, M.CURB); W.box(ix0 + 1, iy0 + 1, 1, ix1 - 1, iy1 - 1, G, M.GRASS);
  const fl = W.obj({ type: 'hauts_fleurs', pal: k.bad ? [[0.42, 0.36, 0.26], [0.36, 0.30, 0.22]] : [[0.72, 0.14, 0.16], [0.86, 0.80, 0.70], [0.82, 0.62, 0.20]] });
  for (let x = ix0 + 3; x < ix1 - 3; x++) { if (Math.abs(x - 532) < 12) continue; W.box(x, iy0 + 3, G, x + 1, iy0 + 5, G + 1, M.HEDGE, fl); W.box(x, iy1 - 5, G, x + 1, iy1 - 3, G + 1, M.HEDGE, fl); }
  cylindre(W, 532, 312, 9, 0, G + 2, M.STONE); cylindre(W, 532, 312, 7.5, 1, G + 2, 0);
  cylindre(W, 532, 312, 7.5, 0, 1, k.bad ? M.MUD : M.HT_EAU);
  W.box(531, 311, 1, 534, 314, G + 6, M.STONE); W.box(530, 310, G + 6, 535, 315, G + 7, M.STONE); W.box(531, 311, G + 7, 534, 314, G + 9, M.STONE);
  if (!k.bad) for (let z = G + 9; z < G + 13; z++) W.set(532, 312, z, M.NET);
  for (const [x, y] of [[ix0 + 2, 311], [ix1 - 3, 311]]) candelabre(k, x, y, G, k.night && !k.bad);
  // la grille sur le boulevard : un muret, des grilles à pointes, des piliers et leurs lanternes, deux passages
  const grille = (a, b) => { W.box(a, FR - 2, 0, b, FR, G + 3, M.STONE); for (let x = a; x < b; x += 2) W.box(x, FR - 1, G + 3, x + 1, FR, G + 9, M.METAL_DARK); W.box(a, FR - 1, G + 7, b, FR, G + 8, M.METAL_DARK); };
  grille(400, 460); grille(476, 588); grille(604, 650);
  for (const x of [460, 474, 588, 602]) { W.box(x, FR - 3, 0, x + 2, FR, G + 12, M.STONE); W.box(x - 1, FR - 4, G + 12, x + 3, FR + 1, G + 13, M.STONE); W.set(x, FR - 2, G + 14, k.night ? M.BULB : M.PLASTIC_WHITE); }
  W.box(462, FR - 2, 0, 474, FR, G, M.SIDEWALK); W.box(590, FR - 2, 0, 602, FR, G, M.SIDEWALK);
  // les voitures : la berline noire sous la marquise, les taxis qui attendent
  voiture(k, 516, yf + 12, 1, 'x', -1, M.HT_LAQUE, { modele: 'limousine', phares: false });
  voiture(k, 600, 322, 1, 'x', -1, M.HT_LAQUE, { modele: 'taxi', phares: k.night });
  voiture(k, 624, 322, 1, 'x', -1, M.HT_LAQUE, { modele: 'taxi' });
  if (!k.bad) voiture(k, 430, 322, 1, 'x', -1, M.CAR_WHITE, { modele: 'berline' });
}
// Un drapeau tendu par le vent ; motif : imperial (bordeaux et or), aube (bandes), dalmene, ecran, ville.
const DRAPEAUX = {
  imperial: [[0.40, 0.10, 0.14], [0.80, 0.64, 0.26], [0.40, 0.10, 0.14]],
  aube: [[0.86, 0.84, 0.78], [0.42, 0.10, 0.16], [0.86, 0.84, 0.78]],
  dalmene: [[0.14, 0.32, 0.46], [0.86, 0.88, 0.88], [0.14, 0.32, 0.46]],
  ecran: [[0.70, 0.10, 0.10], [0.92, 0.92, 0.90], [0.70, 0.10, 0.10]],
  ville: [[0.20, 0.36, 0.26], [0.86, 0.80, 0.50], [0.20, 0.36, 0.26]],
};
overlay('hauts_drapeau', (o, c) => {
  const t = o.axis === 'y' ? c.hy - o.a : c.hx - o.a;
  const zb = c.hz - o.z0;
  const p = o.pal, band = clamp(Math.floor(zb / o.h * 3), 0, 2);
  const col = p[band]; rgb(c, col[0], col[1], col[2]);
  if (mod(Math.floor(2 * t), 4) === 0) mul(c, 0.88);
  if (c.face === TOP) mul(c, 0.9);
});
function drapeau(k, x, y, ztop, axis, motif, len = 9, h = 6) {
  const W = k.W, id = W.obj({ type: 'hauts_drapeau', axis, a: axis === 'y' ? y : x, z0: ztop - h, h, pal: DRAPEAUX[motif] || DRAPEAUX.ville });
  for (let i = 0; i < len; i++) {
    const wave = Math.round(Math.sin(i * 0.9) * 0.6);
    if (axis === 'y') W.box(x + wave, y + i, ztop - h - (i > len - 3 ? 1 : 0), x + wave + 1, y + i + 1, ztop, M.CANVAS, id);
    else W.box(x + i, y + wave, ztop - h - (i > len - 3 ? 1 : 0), x + i + 1, y + wave + 1, ztop, M.CANVAS, id);
  }
}
// Massifs de fleurs : feuillage piqué de couleurs.
overlay('hauts_fleurs', (o, c) => {
  const h = hash(c.a, c.b, 2201, c.face);
  if (h < 0.5) { const p = o.pal[Math.floor(hash(c.a >> 1, c.b >> 1, 2202, c.face) * o.pal.length)]; rgb(c, p[0], p[1], p[2]); if (c.face === TOP) mul(c, 1.1); }
});

// ================================================================ la galerie des Hauts
// Un passage couvert de boutiques de luxe : façade de pierre claire, l'arche d'entrée et le nom doré, les
// vitrines du rez-de-chaussée (sur le boulevard et sur l'avant-cour Verdier), la verrière en berceau qui court
// du nord au sud et luit la nuit.
const VITRINES = {
  joaillier(la, lb, W2, H2) {
    if (lb < 4) return [0.30, 0.10, 0.12, 0.35];
    const cx = mod(la, 10), cy = mod(lb - 4, 8), d = Math.hypot(cx - 5, cy - 4);
    if (d < 2.5) { const h = hash(Math.floor(la / 10), Math.floor((lb - 4) / 8), 2301, 0); if (d < 1.2) return h < 0.5 ? [1.4, 1.2, 0.7, 1.2] : [1.3, 1.3, 1.4, 1.2]; return [0.85, 0.66, 0.30, 0.8]; }
    return [0.24, 0.06, 0.10, 0.45];
  },
  horloger(la, lb, W2, H2) {
    if (lb < 4) return [0.12, 0.10, 0.10, 0.3];
    const cx = mod(la, 8) - 4, cy = mod(lb - 4, 8) - 4, d = Math.hypot(cx, cy);
    if (d < 3) { if (d > 2.2) return [0.85, 0.66, 0.28, 0.8]; if ((cx === 0 && cy >= 0) || (cy === 0 && cx > 0)) return [0.1, 0.1, 0.1, 0.2]; return [0.95, 0.92, 0.85, 0.75]; }
    return [0.30, 0.26, 0.22, 0.4];
  },
  mode(la, lb, W2, H2) {
    const cx = mod(la, 14) - 7;
    const body = lb >= 3 && lb <= 18 && Math.abs(cx) <= (lb > 14 ? 1 : lb > 11 ? 3 : 2);
    if (body) { const h = hash(Math.floor(la / 14), 0, 2302, 0); const p = [[0.70, 0.12, 0.14], [0.10, 0.10, 0.12], [0.86, 0.82, 0.72], [0.20, 0.28, 0.45]][Math.floor(h * 4)]; if (lb > 16) return [0.82, 0.70, 0.60, 0.7]; return [p[0], p[1], p[2], 0.75]; }
    return [0.96, 0.92, 0.84, 0.62];
  },
  maroquinier(la, lb, W2, H2) {
    const row = Math.floor(lb / 7), rl = lb - row * 7;
    if (rl === 0) return [0.55, 0.44, 0.30, 0.5];
    const h = hash(Math.floor(la / 6), row, 2303, 0);
    if (rl >= 1 && rl <= 4 && mod(la, 6) >= 1 && mod(la, 6) <= 4 && h < 0.75) { const p = [[0.50, 0.26, 0.12], [0.12, 0.10, 0.09], [0.70, 0.60, 0.42], [0.45, 0.08, 0.10]][Math.floor(h / 0.75 * 4)]; return [p[0], p[1], p[2], 0.75]; }
    if (rl === 5 && mod(la, 6) === 2) return [0.80, 0.66, 0.30, 0.8];
    return [0.92, 0.82, 0.62, 0.55];
  },
  parfums(la, lb, W2, H2) {
    if (lb < 3) return [0.85, 0.80, 0.70, 0.5];
    const row = Math.floor((lb - 3) / 6), rl = (lb - 3) - row * 6, h = hash(Math.floor(la / 3), row, 2304, 0);
    if (rl < 4 && mod(la, 3) < 2 && h < 0.8) { const p = [[0.95, 0.75, 0.30], [0.70, 0.30, 0.55], [0.40, 0.70, 0.80], [0.95, 0.92, 0.85]][Math.floor(h / 0.8 * 4)]; return [p[0], p[1], p[2], rl === 3 ? 0.5 : 0.85]; }
    return [1.0, 0.94, 0.86, 0.6];
  },
  art(la, lb, W2, H2) {
    if (lb >= 6 && lb < H2 - 4) { const slot = Math.floor(la / 16), sl = mod(la, 16); if (sl >= 3 && sl < 13) { if (sl === 3 || sl === 12 || lb === 6 || lb === H2 - 5) return [0.70, 0.56, 0.28, 0.7]; const h = hash(slot, Math.floor(lb / 3) + Math.floor(sl / 4), 2305, 0); const p = [[0.70, 0.30, 0.15], [0.20, 0.30, 0.60], [0.90, 0.80, 0.40], [0.20, 0.45, 0.30]][Math.floor(h * 4)]; return [p[0], p[1], p[2], 0.7]; } }
    return [0.92, 0.90, 0.86, 0.58];
  },
};
overlay('hauts_vitrine', (o, c) => {
  if (c.face !== o.face) return;
  const [la, lb] = loc(o, c), W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  c.er = c.eg = c.eb = 0;
  if (o.ferme) { rgb(c, mod(lb, 2) ? 0.34 : 0.27, mod(lb, 2) ? 0.34 : 0.27, mod(lb, 2) ? 0.33 : 0.26); if (o.tag && fbm(la / 7, lb / 5, 2306) > 0.62) rgb(c, 0.20, 0.45, 0.62); return; }
  if (la === 0 || la === W2 - 1 || lb === 0 || lb === H2 - 1 || mod(la, 20) === 0) { rgb(c, 0.62, 0.52, 0.28); return; }
  const r = VITRINES[o.kind](la, lb, W2, H2);
  const k = (o.lit ? 1 : 0.28) * r[3];
  rgb(c, r[0] * 0.3, r[1] * 0.3, r[2] * 0.3);
  if (!o.lit && mod(la - lb, 15) < 2) mul(c, 1.5);
  c.er = r[0] * k; c.eg = r[1] * k; c.eb = r[2] * k;
});
function vitrine(k, f, s0, z0, w, h, kind, o = {}) {
  f.rect(s0, z0, s0 + w, z0 + h, 0, 0);
  const id = k.W.obj(Object.assign({ type: 'hauts_vitrine', kind, face: f.face, a0: f.a0(s0), z0, w, h, lit: k.night || o.jour }, o));
  f.rect(s0, z0, s0 + w, z0 + h, 1, M.GLASS, id);
  f.rect(s0 - 1, z0 - 1, s0 + w + 1, z0, -1, M.CIM_GRANITE || M.STONE);
  f.rect(s0 - 1, z0 + h, s0 + w + 1, z0 + h + 1, -1, M.GOLD || M.METAL);
  if (o.nom) f.sign(s0 + Math.max(0, Math.floor((w - largeur(o.nom, 0.5)) / 2)), z0 + h + 4, o.nom, Object.assign({ scale: 1, depth: 0, padX: 0, padY: 0 }, k.night && !o.ferme ? { fg: [1.0, 0.86, 0.55], emit: [0.9, 0.7, 0.35] } : { fg: [0.80, 0.64, 0.30] }));
  return id;
}
function galerie(k, P) {
  const W = k.W, x0 = 1152, y0 = 150, x1 = 1234, y1 = 330, zt = G + 46, S = M.ESTQ_ASHLAR || M.STONE;
  const px0 = 1182, px1 = 1204;  // le passage
  W.box(x0, y0, G, x1, y1, zt, S);
  W.box(px0, y0, G, px1, y1, zt, 0);
  W.box(px0, y0, 0, px1, y1, G, M.HT_DALLE, W.obj({ type: 'hauts_sol', kind: 'damier', x0: px0, y0, s: 4 }));
  // la verrière en berceau, ses arcs de fer ; elle luit la nuit
  const R = (px1 - px0) / 2 + 1, cx = (px0 + px1) / 2;
  const verr = k.night && !k.bad ? M.SKYLIGHT : M.BOOTH;
  for (let x = px0 - 1; x <= px1; x++) {
    const dx = x + 0.5 - cx, h = Math.sqrt(Math.max(0, R * R - dx * dx));
    const z = zt - 2 + Math.round(h * 0.75);
    W.box(x, y0, z, x + 1, y1, z + 1, verr);
    for (let y = y0; y < y1; y += 8) W.box(x, y, z + 1, x + 1, y + 1, z + 2, M.METAL_DARK);
  }
  W.box(px0 - 2, y0, zt - 2, px0, y1, zt + 1, M.METAL_DARK); W.box(px1, y0, zt - 2, px1 + 2, y1, zt + 1, M.METAL_DARK);
  // les façades : sud (le boulevard), est (l'avant-cour Verdier)
  const fs = new Facade(W, LEFT, x0, y0, x1 - x0, y1 - y0), fe = new Facade(W, RIGHT, x0, y0, x1 - x0, y1 - y0);
  for (const f of [fs, fe]) { f.rect(0, 24, f.len, 25, -1, M.STONE); f.rect(0, zt - 2, f.len, zt, -1, M.STONE); f.rect(0, zt - 1, f.len, zt, -2, M.STONE); }
  // l'arche d'entrée et le nom
  const ar0 = px0 - x0, ar1 = px1 - x0, ach = 30;
  for (let s = ar0 - 3; s < ar1 + 3; s++) {
    const dx = s + 0.5 - (ar0 + ar1) / 2, rr = (ar1 - ar0) / 2 + 3;
    const top = G + 22 + Math.round(Math.sqrt(Math.max(0, rr * rr - dx * dx)) * 0.7);
    for (let z = G + 18; z < top + 2; z++) if (s < ar0 || s >= ar1 || z >= top - 1) fs.set(s, z, -1, M.STONE);
    if (s >= ar0 && s < ar1) { for (let z = G; z < top - 1; z++) fs.set(s, z, 0, 0); for (let z = top - 1; z < zt; z++) fs.set(s, z, 0, S); }
  }
  const gold = k.night && !k.bad ? { fg: [1.0, 0.86, 0.50], emit: [1.15, 0.88, 0.42] } : { fg: [0.86, 0.68, 0.30] };
  fs.rect(ar0 - 10, G + 32, ar1 + 10, G + 44, -1, M.CIM_GRANITE || M.METAL_DARK);
  const mid = (ar0 + ar1) / 2;
  fs.sign(Math.floor(mid - largeur('GALERIE', 1) / 2), G + 43, 'GALERIE', Object.assign({ scale: 2, depth: -1, padX: 0, padY: 0 }, gold));
  fs.sign(Math.floor(mid - largeur('DES HAUTS', 0.5) / 2), G + 36, 'DES HAUTS', Object.assign({ scale: 1, depth: -1, padX: 0, padY: 0 }, gold));
  if (k.night) k.light({ x: (px0 + px1) / 2, y: y1 + 4, z: G + 20, r: 44, cr: 1.1, cg: 0.85, cb: 0.5, skip: 2 });
  // les vitrines
  const ferme = k.bad && k.night;
  vitrine(k, fs, 3, G + 3, 24, 15, 'joaillier', { ferme, tag: k.bad, nom: 'JOAILLIER' });
  vitrine(k, fs, ar1 + 3, G + 3, 24, 15, 'mode', { ferme, nom: 'COUTURE' });
  const east = ['maroquinier', 'art', 'mode', 'joaillier', 'parfums', 'horloger', 'art', 'maroquinier'];
  const noms = ['CUIRS', 'DESSINS', 'MODE', 'BIJOUX', 'PARFUMS', 'MONTRES', 'TABLEAUX', 'VOYAGE'];
  for (let i = 0; i < 8; i++) vitrine(k, fe, 6 + i * 21, G + 3, 15, 15, east[i], { ferme: k.bad && i % 3 !== 1, tag: k.bad && i === 4, nom: noms[i] });
  // les étages : des bureaux derrière des fenêtres hautes
  for (let s = 4; s < x1 - x0 - 4; s += 9) { if (s > ar0 - 6 && s < ar1 + 4) continue; for (const z of [G + 27, G + 37]) fs.window(s, z, 5, 7, { state: k.night && k.rh(s, z, 2401) < (k.bad ? 0.1 : 0.3) ? 'office' : 'dark', spill: false }); }
  for (let s = 4; s < y1 - y0 - 6; s += 10) for (const z of [G + 27, G + 37]) fe.window(s, z, 6, 7, { state: k.night && k.rh(s, z, 2402) < (k.bad ? 0.1 : 0.3) ? 'office' : 'dark', spill: false });
  toit(k, x0, y0, px0, y1, zt, { acrotere: 0 }); toit(k, px1, y0, x1, y1, zt, { acrotere: 0 });
  machines(k, px1 + 2, y0 + 4, x1 - 2, y1 - 40, zt, 3);
  // les lanternes de l'arche
  for (const s of [ar0 - 4, ar1 + 3]) { fs.set(s, G + 26, -2, k.night && !k.bad ? M.BULB : M.GLASS); fs.set(s, G + 27, -2, M.METAL_DARK); fs.set(s, G + 25, -2, M.METAL_DARK); }
  P.push({ key: 'galerie_hauts', label: 'La galerie des Hauts', x: (px0 + px1) / 2, y: y1 + 4, z: G + 12 });
}

// ================================================================ le cabinet Verdier, avocats
// Sobre et cher : lames verticales de pierre, verre bronze, socle de granit noir ; la porte de bronze en
// retrait, la plaque, la lanterne, deux lauriers en caisse. Quelques bureaux allumés tard.
function verdier(k, P) {
  const W = k.W, x0 = 1250, y0 = 222, x1 = 1390, y1 = 318, z0 = G, zb = G + 24, zt = zb + 6 * 16;
  vitres(k, x0, y0, x1, y1, zb, zt, { tint: [0.17, 0.14, 0.11], bw: 8, fh: 16, sp: 4, mw: 0, warm: 0.85, pLit: k.bad ? 0.08 : 0.2, pScatter: 0.06, pFull: 0, k: 0.55 });
  for (let x = x0; x <= x1 - 2; x += 8) W.box(x, y1, zb, x + 2, y1 + 2, zt + 2, M.STONE);
  for (let y = y1 - 2; y >= y0; y -= 8) W.box(x1, y, zb, x1 + 2, y + 2, zt + 2, M.STONE);
  W.box(x0, y0, zt, x1 + 2, y1 + 2, zt + 4, M.STONE);
  W.box(x0, y0, z0, x1, y1, zb, M.CIM_GRANITE || M.METAL_DARK);
  toit(k, x0, y0, x1 + 2, y1 + 2, zt + 4, { acrotere: 0 });
  machines(k, x0 + 4, y0 + 4, x1 - 4, y1 - 46, zt + 4, 4);
  // la terrasse des associés, au sud du toit : un platelage, des bacs d'arbustes, une toile tendue
  W.box(x0 + 8, y1 - 36, zt + 3, x1 - 8, y1 - 4, zt + 4, M.WOOD);
  for (let x = x0 + 10; x < x1 - 12; x += 12) { W.box(x, y1 - 7, zt + 4, x + 5, y1 - 4, zt + 6, M.HT_BETON); buisson(W, x + 2, y1 - 6, zt + 6, 2.2, M.HEDGE, x); }
  for (const x of [x0 + 30, x0 + 58]) { for (const [dx, dy] of [[0, 0], [24, 0], [0, 16], [24, 16]]) W.box(x + dx, y1 - 30 + dy, zt + 4, x + dx + 1, y1 - 29 + dy, zt + 12, M.METAL_DARK); W.box(x, y1 - 30, zt + 12, x + 25, y1 - 13, zt + 13, M.CANVAS); }
  for (let i = 0; i < 4; i++) { const tx = x0 + 34 + i * 12, ty = y1 - 22; W.box(tx, ty, zt + 4, tx + 3, ty + 3, zt + 6, M.METAL_DARK); }
  // le socle : des baies sombres, l'entrée en retrait au milieu
  const fs = new Facade(W, LEFT, x0, y0, x1 - x0, y1 - y0), fe = new Facade(W, RIGHT, x0, y0, x1 - x0, y1 - y0);
  for (let s = 6; s < x1 - x0 - 8; s += 16) { if (s > 46 && s < 96) continue; fs.window(s, G + 5, 8, 14, { state: k.night && k.rh(s, 0, 2501) < 0.3 ? 'lit' : 'dark', col: [1.0, 0.78, 0.48], k: 0.5, sill: false, lintel: false, frame: [0.30, 0.26, 0.18], spill: false }); }
  for (let s = 6; s < y1 - y0 - 8; s += 16) fe.window(s, G + 5, 8, 14, { state: 'dark', sill: false, lintel: false, frame: [0.30, 0.26, 0.18], spill: false });
  const d0 = 62, d1 = 78;
  for (let d = 0; d < 4; d++) fs.rect(d0, G, d1, G + 18, d, 0);
  const id = W.obj({ type: 'hauts_hall', face: LEFT, a0: fs.a0(d0), z0: G, w: d1 - d0, h: 18, kind: 'verdier', lit: k.night, k: k.bad ? 0.4 : 0.9, door: [4, 12], desk: 2, seed: 5 });
  fs.rect(d0, G, d1, G + 18, 4, M.GLASS, id);
  const bronze = tint(k, { col: [0.36, 0.26, 0.15], g: 0.05 });
  fs.rect(d0 - 1, G, d0, G + 19, -1, M.HT_ALU, bronze); fs.rect(d1, G, d1 + 1, G + 19, -1, M.HT_ALU, bronze); fs.rect(d0 - 1, G + 18, d1 + 1, G + 20, -1, M.HT_ALU, bronze);
  auvent(k, fs, d0 - 9, d1 - d0 + 18, G + 21, 5, M.HT_ALU, bronze);
  const CV = 'CABINET VERDIER';
  fs.sign(Math.floor((d0 + d1) / 2 - largeur(CV, 0.5) / 2), G + 23, CV, Object.assign({ scale: 1, depth: -6, padX: 0, padY: 0, plate: [0.26, 0.19, 0.11], plateMat: M.HT_ALU }, k.night && !k.bad ? { fg: [0.98, 0.84, 0.52], emit: [0.80, 0.60, 0.28] } : { fg: [0.90, 0.74, 0.40] }));
  fs.sign(d1 + 2, G + 16, 'AVOCATS', { scale: 1, depth: 0, padX: 0, padY: 0, fg: [0.74, 0.62, 0.36] });
  // la plaque de laiton, la lanterne, les lauriers
  fs.rect(d1 + 2, G + 8, d1 + 5, G + 12, -1, M.GOLD || M.METAL);
  fs.set(d0 - 3, G + 14, -1, M.METAL_DARK); fs.set(d0 - 3, G + 13, -1, k.night ? M.BULB : M.GLASS); fs.set(d0 - 3, G + 12, -1, M.METAL_DARK);
  for (const s of [d0 - 6, d1 + 3]) { const [bx, by] = fs.xy(s, -4); W.box(bx, by, G, bx + 3, by + 3, G + 3, M.WOOD_DARK); W.box(bx + 1, by + 1, G + 3, bx + 2, by + 2, G + 6, M.BARK); buisson(W, bx + 1, by + 1, G + 6, 2.6, M.HEDGE, bx); }
  if (k.night) lumierePorte(k, fs, (d0 + d1) / 2, G + 14, 4, [1.0, 0.80, 0.50], 28, k.bad ? 0.5 : 0.9);
  // l'avant-cour : granit, une haie basse
  W.box(x0 - 14, y1 + 2, 0, x1 + 4, FR, G, M.HT_DALLE);
  for (let x = x0 + 4; x < x1 - 2; x += 7) if (x < x0 + d0 - 12 || x > x0 + d1 + 10) { W.box(x - 2, FR - 6, 0, x + 3, FR - 1, G + 1, M.CIM_GRANITE || M.STONE); buisson(W, x, FR - 4, G + 1, 2.4, M.HEDGE, x); }
  P.push({ key: 'cabinet_verdier', label: 'Le cabinet Verdier', x: x0 + (d0 + d1) / 2, y: y1 + 4, z: G + 12 });
}

// ================================================================ le parking des Hauts (à l'est de la rue)
// Cinq niveaux de béton ouverts sur les côtés, les voitures garées derrière les allèges, les tubes du plafond
// la nuit, la rampe hélicoïdale dans sa tour ronde, le grand P bleu. Devant, la rue du Parking et ses taxis.
function parking(k, P) {
  const W = k.W, x0 = 1596, y0 = 150, x1 = 1726, y1 = 300, H = 12, n = 5, zt = G + n * H;
  W.box(x0, y0, 0, x1, y1, G, M.CONCRETE);
  for (let i = 1; i <= n; i++) {
    const z = G + i * H;
    W.box(x0, y0, z - 2, x1, y1, z, M.CONCRETE);
    W.box(x0, y1 - 1, z, x1, y1, z + 4, M.HT_BETON); W.box(x1 - 1, y0, z, x1, y1, z + 4, M.HT_BETON);
    W.box(x0, y0, z, x1, y0 + 1, z + 4, M.HT_BETON); W.box(x0, y0, z, x0 + 1, y1, z + 4, M.HT_BETON);
  }
  W.box(x0, y1 - 1, G, x1, y1, G + 4, M.HT_BETON); W.box(x1 - 1, y0, G, x1, y1, G + 4, M.HT_BETON);
  for (let x = x0; x < x1; x += 16) for (const y of [y0, y1 - 2]) W.box(x, y, G, x + 2, y + 2, zt, M.HT_BETON);
  for (let y = y0; y < y1; y += 16) W.box(x1 - 2, y, G, x1, y + 2, zt, M.HT_BETON);
  W.box(x1 - 2, y1 - 2, G, x1, y1, zt, M.HT_BETON);
  // les voitures garées, les tubes du plafond, les numéros des niveaux
  const PEINT = [M.CAR_WHITE, M.HT_LAQUE, M.CAR_BLUE, M.CAR_BORD, M.CAR_BEIGE, M.SEAT_GREY];
  for (let i = 0; i < n; i++) {
    const z = G + i * H, full = k.bad ? 0.25 : k.night ? 0.4 : 0.85;
    for (let x = x0 + 4; x < x1 - 14; x += 11) if (k.rh(x, i, 2601) < full) voiture(k, x, y1 - 24, z, 'y', 1, PEINT[Math.floor(k.rh(x, i, 2602) * PEINT.length)], { modele: 'berline' });
    for (let y = y0 + 4; y < y1 - 30; y += 11) if (k.rh(i, y, 2603) < full) voiture(k, x1 - 24, y, z, 'x', 1, PEINT[Math.floor(k.rh(i, y, 2604) * PEINT.length)], { modele: 'berline' });
    // les tubes du plafond, près des façades (on les voit par les ouvertures) ; la nuit, chaque niveau luit
    const tube = k.night && !(k.bad && i % 2) ? M.TUBE : M.METAL;
    for (let x = x0 + 6; x < x1 - 6; x += 12) W.box(x, y1 - 6, z + H - 3, x + 6, y1 - 5, z + H - 2, tube);
    for (let y = y0 + 6; y < y1 - 6; y += 12) W.box(x1 - 6, y, z + H - 3, x1 - 5, y + 6, z + H - 2, tube);
    if (k.night && !(k.bad && i % 2)) for (const [lx, ly] of [[x0 + 36, y1 - 6], [x0 + 96, y1 - 6], [x1 - 6, y0 + 44], [x1 - 6, y0 + 104]]) k.light({ x: lx, y: ly, z: z + H - 4, r: 46, cr: 0.62, cg: 0.74, cb: 0.74, skip: 2, shadow: false });
  }
  // le toit : marquages, lampadaires, quelques voitures au soleil
  W.box(x0 + 1, y0 + 1, zt - 1, x1 - 1, y1 - 1, zt, M.ASPHALT, W.obj({ type: 'hauts_sol', kind: 'places', axis: 'x', x0, y0: y0 + 10, w: x1 - x0, h: 20, pitch: 11 }));
  for (let x = x0 + 6; x < x1 - 20; x += 11) if (k.rh(x, 9, 2605) < (k.night ? 0.15 : 0.5)) voiture(k, x, y0 + 10, zt - 1, 'y', -1, PEINT[Math.floor(k.rh(x, 9, 2606) * PEINT.length)], { modele: 'berline' });
  for (const [lx, ly] of [[x0 + 30, y1 - 40], [x0 + 90, y1 - 40]]) { W.box(lx, ly, zt, lx + 1, ly + 1, zt + 16, M.METAL_DARK); W.box(lx - 1, ly, zt + 16, lx + 3, ly + 1, zt + 17, M.METAL_DARK); W.set(lx + 2, ly, zt + 15, k.night ? M.TUBE : M.PLASTIC_WHITE); }
  // la rampe hélicoïdale : un cylindre de béton ajouré d'une fente qui tourne
  const cx = 1744, cy = 262, R = 16;
  for (let z = G; z < zt + 4; z++) for (let a = 0; a < 120; a++) {
    const t = a / 120 * Math.PI * 2, x = Math.round(cx + Math.cos(t) * R), y = Math.round(cy + Math.sin(t) * R);
    const ph = mod(z - G - t / (Math.PI * 2) * H, H);
    W.set(x, y, z, ph > 4 && ph < 9 && z < zt ? 0 : M.HT_BETON);
  }
  for (let z = G + 3; z < zt; z += 1) { const t = (z - G) / H * Math.PI * 2; for (let r = 4; r < R; r++) W.set(Math.round(cx + Math.cos(t) * r), Math.round(cy + Math.sin(t) * r), z, M.CONCRETE); }
  cylindre(W, cx, cy, 4, G, zt + 4, M.HT_BETON);
  cylindre(W, cx, cy, R + 1, zt + 4, zt + 6, M.HT_BETON); cylindre(W, cx, cy, R - 1, zt + 4, zt + 6, 0);
  cylindre(W, cx, cy, R - 1, zt - 1, zt, M.ASPHALT);
  for (let a = 0; a < 6; a++) { const t = a / 6 * Math.PI * 2; W.set(Math.round(cx + Math.cos(t) * (R - 4)), Math.round(cy + Math.sin(t) * (R - 4)), zt, M.ROADLINE); }
  // le grand P, sur son mât, et le nom
  const pz = zt + 6;
  W.box(x0 - 10, y1 + 2, G, x0 - 8, y1 + 4, pz, M.METAL_DARK);
  const pf = new Facade(W, LEFT, x0 - 14, y1 + 3, 10, 1);
  pf.sign(0, pz + 10, 'P', { scale: 4, depth: 0, padX: 2, padY: 1, plate: [0.14, 0.30, 0.62], plateMat: M.CAR_BLUE, fg: [0.95, 0.95, 0.92], emit: k.night ? [1.0, 1.0, 0.95] : null, plateEmit: k.night && !k.bad ? [0.10, 0.22, 0.55] : null });
  const fpk = new Facade(W, LEFT, x0, y0, x1 - x0, y1 - y0);
  fpk.rect(20, zt + 4, 108, zt + 11, 0, M.METAL_DARK); fpk.rect(20, zt + 4, 108, zt + 11, 1, M.METAL_DARK);
  const PN = 'PARKING DES HAUTS';
  fpk.sign(Math.floor(64 - largeur(PN, 1) / 2), zt + 10, PN, Object.assign({ scale: 2, depth: 0, padX: 0, padY: 0 }, k.night && !k.bad ? { fg: [0.85, 0.92, 1.0], emit: [0.60, 0.80, 1.25] } : { fg: [0.86, 0.88, 0.90] }));
  // l'entrée : l'ouverture, la barrière, la borne
  fpk.rect(8, G, 26, G + 9, 0, 0);
  W.box(x0 + 8, y1 - 1, G + 3, x0 + 22, y1, G + 4, M.BARRIER);
  W.box(x0 + 23, y1 + 1, G, x0 + 25, y1 + 3, G + 5, M.METAL); W.set(x0 + 23, y1 + 2, G + 4, k.night ? M.LIT_PANEL : M.METAL_DARK);
  if (k.night) k.light({ x: x0 + 17, y: y1 + 3, z: G + 8, r: 30, cr: 0.6, cg: 0.7, cb: 0.75, skip: 1.5 });
}
// La rue du Parking : de la rue Est au parking, ses taxis en station.
function rueParking(k) {
  const W = k.W;
  road(W, NS[1][1], 304, 1760, 330);
  for (let x = 1450; x < 1750; x += 16) W.box(x, 316, 0, x + 9, 318, 1, M.ROADLINE);
  const st = W.obj({ type: 'hauts_sol', kind: 'texte', text: 'TAXIS', x0: 1452, y0: 306, h: 8, scale: 3, col: [0.82, 0.74, 0.30] });
  for (let y = 306; y < 314; y++) for (let x = 1452; x < 1482; x++) if (W.get(x, y, 0) === M.ASPHALT) W.tag[W.idx(x, y, 0)] = st;
  for (let i = 0; i < (k.bad ? 1 : 3); i++) voiture(k, 1490 + i * 24, 305, 1, 'x', -1, M.HT_LAQUE, { modele: 'taxi', phares: k.night && i === 0, faisceau: false });
  // le panneau de la station
  W.box(1484, 300, G, 1485, 301, G + 14, M.METAL_DARK);
  new Facade(W, LEFT, 1478, 300, 12, 1).sign(0, G + 18, 'TAXIS', { scale: 1, depth: 0, padX: 1, padY: 1, plate: [0.14, 0.30, 0.62], plateMat: M.CAR_BLUE, fg: [0.95, 0.95, 0.92] });
}

// ================================================================ le chantier de la phase 3, et sa grue
// La tour qu'on monte encore : le noyau de béton, huit planchers, les poteaux, les premiers étages vitrés,
// les filets et les garde-corps en haut ; la grue à tour, sa flèche au-dessus du vide ; la palissade et ses
// affiches, les baraques de chantier, la toupie. En mauvaise saison, le chantier est arrêté.
overlay('hauts_palissade', (o, c) => {
  if (c.face === TOP) { rgb(c, 0.30, 0.30, 0.28); return; }
  const la = Math.floor(2 * along(c)), lb = Math.floor(2 * (c.hz - G));
  const pan = Math.floor(la / 12), u = mod(la, 12);
  rgb(c, 0.20, 0.30, 0.26); if (u === 0) mul(c, 0.7);
  if (lb >= 18 && lb < 21) rgb(c, 0.80, 0.78, 0.70);
  const q = hash(pan, 0, 2701, o.seed);
  if (o.tag && fbm(la / 9, lb / 6, 2702) > 0.6 && lb < 16) { const t = hash(Math.floor(la / 20), 0, 2703, 0); rgb(c, t < 0.5 ? 0.80 : 0.25, t < 0.5 ? 0.30 : 0.55, t < 0.5 ? 0.50 : 0.75); }
  if (q < 0.18 && lb > 3 && lb < 16 && u > 1 && u < 11) { rgb(c, 0.82, 0.80, 0.72); if (mod(lb, 3) === 0 && u > 2 && u < 10) rgb(c, 0.30, 0.28, 0.26); if (o.dechire && hash(la, lb, 2704, 0) < 0.25) rgb(c, 0.50, 0.48, 0.42); }
});
overlay('hauts_affiche', (o, c) => {
  if (c.face !== o.face) return;
  const [la, lb] = loc(o, c), W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  const lt = H2 - 1 - lb;
  // le ciel, la tour dessinée, le titre ; une bande en bas
  let col = lt < H2 * 0.75 ? [0.42 + 0.3 * lt / H2, 0.56 + 0.2 * lt / H2, 0.70] : [0.86, 0.84, 0.78];
  const tx = la - W2 * 0.7, top = H2 * 0.12;
  if (Math.abs(tx) < W2 * 0.09 && lt > top && lt < H2 * 0.75) col = mod(lt, 3) === 0 ? [0.20, 0.30, 0.36] : mod(la, 3) === 0 ? [0.55, 0.62, 0.66] : [0.30, 0.48, 0.58];
  if (Math.abs(tx + W2 * 0.18) < W2 * 0.06 && lt > H2 * 0.35 && lt < H2 * 0.75) col = mod(lt, 3) === 0 ? [0.22, 0.28, 0.30] : [0.42, 0.50, 0.52];
  if (!o.bm) { o.bm = textBitmap(o.l1 || ''); o.bm2 = textBitmap(o.l2 || ''); }
  if (o.bm.at(la - 3, lt - 3)) col = [0.96, 0.95, 0.90];
  if (o.bm2.at(la - 3, lt - Math.round(H2 * 0.75) - 2)) col = [0.20, 0.28, 0.40];
  if (la === 0 || la === W2 - 1 || lt === 0 || lt === H2 - 1) col = [0.12, 0.12, 0.12];
  rgb(c, col[0], col[1], col[2]);
  if (o.lit) { c.er = col[0] * o.lit; c.eg = col[1] * o.lit; c.eb = col[2] * o.lit; } else c.er = c.eg = c.eb = 0;
  if (o.torn && hash(Math.floor(la / 3), Math.floor(lt / 3), 2705, 0) < o.torn) rgb(c, 0.45, 0.42, 0.36);
});
function chantier(k, P) {
  const W = k.W, X0 = 74, X1 = 352, Y0 = 106, Y1 = 330, arret = k.bad;
  // le sol : terre battue, graviers, flaques
  W.box(X0, Y0, 1, X1, Y1, G, M.MUD);
  for (let i = 0; i < 40; i++) { const x = X0 + Math.floor(k.rh(i, 1, 2711) * (X1 - X0 - 12)), y = Y0 + Math.floor(k.rh(i, 2, 2711) * (Y1 - Y0 - 12)); W.box(x, y, 1, x + 6 + Math.floor(k.rh(i, 3, 2711) * 10), y + 4 + Math.floor(k.rh(i, 4, 2711) * 8), G, M.GRAVEL); }
  // la palissade
  const pal = W.obj({ type: 'hauts_palissade', seed: 3, tag: k.bad, dechire: k.bad });
  W.box(X0, Y1 - 2, G, X1, Y1, G + 12, M.WOOD, pal); W.box(X1 - 2, Y0, G, X1, Y1, G + 12, M.WOOD, pal);
  W.box(X0, Y0, G, X0 + 2, Y1, G + 12, M.WOOD, pal); W.box(X0, Y0, G, X1, Y0 + 2, G + 12, M.WOOD, pal);
  // le portail, sur la rue Ouest (ouvert le jour)
  W.box(X1 - 2, 280, G, X1, 304, G + 12, 0);
  if (!k.day || arret) W.box(X1 - 1, 280, G, X1, 304, G + 11, M.METAL, W.obj({ type: 'hauts_tint', k: [0.6, 0.62, 0.6], g: 0.05 }));
  else { W.box(X1 - 14, 278, G, X1 - 2, 279, G + 11, M.METAL); W.box(X1 - 14, 305, G, X1 - 2, 306, G + 11, M.METAL); }
  road(W, NS[0][0] - 6, 282, NS[0][0], 302);
  // les affiches sur la palissade (face sud, sur le boulevard, et face est, sur la rue)
  const fs = new Facade(W, LEFT, X0, Y1 - 2, X1 - X0, 2), fe = new Facade(W, RIGHT, X1 - 2, Y0, 2, Y1 - Y0);
  const aff = (f, s, l1, l2) => { const id = W.obj({ type: 'hauts_affiche', face: f.face, a0: f.a0(s), z0: G + 1, w: 28, h: 10, l1, l2, torn: k.bad ? 0.35 : 0, lit: 0 }); f.rect(s, G + 1, s + 28, G + 11, 0, M.WOOD, id); };
  aff(fs, 30, 'LES HAUTS', 'PHASE 3'); aff(fs, 150, 'BUREAUX', 'À LOUER'); aff(fe, 40, 'LES HAUTS', 'PHASE 3');
  fs.sign(96, G + 9, arret ? 'CHANTIER ARRÊTÉ' : 'CHANTIER INTERDIT AU PUBLIC', { scale: 1, depth: 0, padX: 1, padY: 1, plate: arret ? [0.80, 0.78, 0.70] : [0.82, 0.80, 0.70], plateMat: M.WOOD, fg: arret ? [0.70, 0.08, 0.08] : [0.12, 0.12, 0.12] });
  fe.sign(4, G + 9, 'ENTRÉE CHANTIER', { scale: 1, depth: 0, padX: 1, padY: 1, plate: [0.82, 0.80, 0.70], plateMat: M.WOOD, fg: [0.12, 0.12, 0.12] });
  // la tour en construction
  const x0 = 136, y0 = 150, x1 = 232, y1 = 246, fh = 16, nfl = 8;
  W.box(x0 - 4, y0 - 4, 0, x1 + 4, y1 + 4, G, M.CONCRETE);
  W.box(168, 182, G, 200, 214, G + 8 + nfl * fh, M.CONCRETE);
  for (let i = 1; i <= nfl; i++) {
    const z = G + i * fh;
    W.box(x0, y0, z - 1, x1, y1, z + 1, M.CONCRETE);
    for (let x = x0; x < x1; x += 16) for (let y = y0; y < y1; y += 16) W.box(x, y, z - fh, x + 2, y + 2, z - 1, M.CONCRETE);
    for (let x = x0; x < x1; x += 16) W.box(x, y1 - 2, z - fh, x + 2, y1, z - 1, M.CONCRETE);
    for (let y = y0; y < y1; y += 16) W.box(x1 - 2, y, z - fh, x1, y + 2, z - 1, M.CONCRETE);
    W.box(x1 - 2, y1 - 2, z - fh, x1, y1, z - 1, M.CONCRETE);
    if (i >= nfl - 2) {
      // garde-corps rouge et blanc au bord des planchers, filets
      for (let x = x0; x < x1; x++) { W.set(x, y1 - 1, z + 4, M.BARRIER); if (x % 4 === 0) for (let zz = z + 1; zz < z + 4; zz++) W.set(x, y1 - 1, zz, M.METAL); }
      for (let y = y0; y < y1; y++) { W.set(x1 - 1, y, z + 4, M.BARRIER); if (y % 4 === 0) for (let zz = z + 1; zz < z + 4; zz++) W.set(x1 - 1, y, zz, M.METAL); }
    }
  }
  // les étages du bas sont déjà vitrés (tout est éteint : personne n'y travaille encore)
  const gl = { tint: [0.10, 0.17, 0.20], bw: 8, fh, sp: 3, pLit: 0, pFull: 0, pScatter: 0 };
  vitres(k, x0, y0, x1 - 2, y1 - 2, G, G + 3 * fh - 1, gl);
  vitres(k, x0, y0, x1 - 2, y1 - 2, G + 3 * fh + 1, G + 4 * fh - 1, Object.assign({}, gl, { tint: [0.14, 0.20, 0.22] }));
  W.box(x0 + 40, y1 - 3, G + 3 * fh + 1, x1, y1 - 2, G + 4 * fh - 1, 0); W.box(x1 - 3, y0, G + 3 * fh + 1, x1 - 2, y0 + 50, G + 4 * fh - 1, 0);
  // les bâches du cinquième, les filets, les rouleaux de ferraille
  W.box(x0, y1 - 1, G + 4 * fh + 1, x0 + 60, y1, G + 5 * fh - 1, M.TARP);
  if (arret) W.box(x0 + 66, y1 - 1, G + 5 * fh + 4, x0 + 80, y1, G + 6 * fh - 3, M.TARP);
  W.box(x1 - 1, y0 + 20, G + 5 * fh + 1, x1, y0 + 70, G + 6 * fh - 1, M.NET);
  const zt = G + nfl * fh + 1;
  for (let i = 0; i < 6; i++) { const bx = x0 + 10 + i * 12, by = y0 + 12 + (i % 2) * 40; W.box(bx, by, zt, bx + 8, by + 3, zt + 1, M.METAL); }
  // les attentes d'armatures au sommet des poteaux, les banches des poteaux du neuvième
  for (let x = x0; x < x1; x += 16) for (let y = y0; y < y1; y += 16) {
    if (k.rh(x, y, 2721) < 0.55) { W.set(x, y, zt, M.METAL); W.set(x + 1, y + 1, zt, M.METAL); W.set(x, y, zt + 1, M.METAL); W.set(x + 1, y + 1, zt + 1, M.METAL); W.set(x, y, zt + 2, M.METAL); }
    else W.box(x - 1, y - 1, zt, x + 3, y + 3, zt + 7, M.WOOD);
  }
  W.box(x0 + 60, y0 + 60, zt, x0 + 72, y0 + 72, zt + 3, M.WOOD);
  // la grue à tour : le mât en treillis, la flèche vers l'ouest au-dessus de la tour, la contre-flèche et ses lests
  const gx = 268, gy = 198, gz = 196;
  for (let z = G; z < gz; z++) {
    for (const [a, b] of [[0, 0], [5, 0], [0, 5], [5, 5]]) W.set(gx + a, gy + b, z, M.HT_GRUE);
    const ph = (z - G) % 6;
    if (ph === 0) for (let i = 0; i < 6; i++) { W.set(gx + i, gy, z, M.HT_GRUE); W.set(gx + i, gy + 5, z, M.HT_GRUE); W.set(gx, gy + i, z, M.HT_GRUE); W.set(gx + 5, gy + i, z, M.HT_GRUE); }
    else { W.set(gx + ph, gy + 5, z, M.HT_GRUE); W.set(gx + 5, gy + 5 - ph, z, M.HT_GRUE); W.set(gx + ph, gy, z, M.HT_GRUE); W.set(gx, gy + 5 - ph, z, M.HT_GRUE); }
  }
  W.box(gx - 3, gy - 3, 0, gx + 9, gy + 9, G + 3, M.CONCRETE);
  W.box(gx - 1, gy - 1, gz, gx + 7, gy + 7, gz + 3, M.HT_GRUE);
  W.box(gx + 6, gy - 2, gz + 3, gx + 12, gy + 4, gz + 9, M.PLASTIC_WHITE);
  new Facade(W, LEFT, gx + 6, gy - 2, 6, 6).window(1, gz + 5, 4, 3, { state: k.night && !arret ? 'lit' : 'dark', col: [0.9, 0.95, 0.85], k: 0.5, sill: false, lintel: false, spill: false });
  // la flèche : treillis triangulaire, de x = 92 à x = 266
  const jz = gz + 3;
  for (let x = 92; x < gx + 6; x++) {
    W.set(x, gy + 1, jz, M.HT_GRUE); W.set(x, gy + 4, jz, M.HT_GRUE);
    if (x % 5 === 0) for (let b = 1; b <= 4; b++) W.set(x, gy + b, jz, M.HT_GRUE);
    const ph = mod(x, 10), zz = jz + 1 + Math.min(ph, 10 - ph) * 0.8 | 0;
    if (zz <= jz + 4) { W.set(x, gy + 2, zz, M.HT_GRUE); }
    W.set(x, gy + 2, jz + 5, M.HT_GRUE); W.set(x, gy + 3, jz + 5, M.HT_GRUE);
  }
  // la contre-flèche et ses lests de béton
  for (let x = gx + 6; x < gx + 48; x++) { W.set(x, gy + 1, jz, M.HT_GRUE); W.set(x, gy + 4, jz, M.HT_GRUE); W.set(x, gy + 1, jz + 2, M.HT_GRUE); W.set(x, gy + 4, jz + 2, M.HT_GRUE); if (x % 4 === 0) for (let b = 1; b <= 4; b++) W.set(x, gy + b, jz, M.HT_GRUE); }
  W.box(gx + 34, gy, jz - 6, gx + 46, gy + 6, jz, M.CONCRETE);
  new Facade(W, LEFT, gx + 12, gy + 1, 22, 4).sign(0, jz + 3, 'LEVAGE', { scale: 1, depth: 0, padX: 0, padY: 0, fg: [0.10, 0.10, 0.10] });
  W.box(gx + 12, gy + 4, jz, gx + 34, gy + 5, jz + 3, M.HT_GRUE);
  // le porte-flèche (le mât de tête) et les tirants
  for (let z = jz; z < jz + 16; z++) { W.set(gx + 2, gy + 2, z, M.HT_GRUE); W.set(gx + 3, gy + 3, z, M.HT_GRUE); }
  const tir = (xa, za, xb, zb) => { const n = Math.abs(xb - xa); for (let i = 0; i <= n; i++) W.set(Math.round(xa + (xb - xa) * i / n), gy + 2, Math.round(za + (zb - za) * i / n), M.METAL_DARK); };
  tir(gx + 2, jz + 15, 150, jz + 5); tir(gx + 3, jz + 15, gx + 44, jz + 2);
  balise(k, gx + 2, gy + 2, jz + 16); balise(k, 92, gy + 2, jz + 5); balise(k, gx + 47, gy + 2, jz + 2);
  // le chariot, le câble, le crochet et sa charge (des poutrelles), au-dessus de la tour
  const tx = 176;
  W.box(tx, gy + 1, jz - 1, tx + 4, gy + 5, jz, M.METAL_DARK);
  for (let z = zt + 14; z < jz - 1; z++) W.set(tx + 2, gy + 2, z, M.METAL_DARK);
  W.box(tx + 1, gy + 1, zt + 12, tx + 4, gy + 4, zt + 14, M.HT_GRUE);
  if (!arret) { W.box(tx - 6, gy + 1, zt + 8, tx + 10, gy + 2, zt + 9, M.METAL_DARK); W.box(tx - 6, gy + 3, zt + 8, tx + 10, gy + 4, zt + 9, M.METAL_DARK); for (let z = zt + 9; z < zt + 12; z++) { W.set(tx - 4, gy + 2, z, M.METAL); W.set(tx + 8, gy + 2, z, M.METAL); } }
  // les baraques de chantier, empilées, leur escalier ; la toupie, la benne, les palettes
  for (const [bx, by, bz] of [[86, 268, G], [86, 292, G], [86, 268, G + 11]]) {
    W.box(bx, by, bz, bx + 40, by + 22, bz + 10, M.PLASTIC_WHITE);
    W.box(bx, by, bz + 10, bx + 40, by + 22, bz + 11, M.METAL);
    const f = new Facade(W, LEFT, bx, by, 40, 22);
    f.rect(0, bz + 2, 40, bz + 3, 0, M.CAR_BLUE);
    for (const s of [6, 18, 30]) f.window(s, bz + 4, 5, 4, { state: k.night && !arret && s === 18 && bz === G ? 'lit' : 'dark', sill: false, lintel: false, spill: false, frame: [0.4, 0.4, 0.42] });
    f.door(2, bz, 3, 8, { mat: M.CAR_BLUE, frame: false });
  }
  for (let i = 0; i < 6; i++) W.box(127 + i, 268, G + i * 2, 128 + i, 274, G + i * 2 + 1, M.METAL);
  voiture(k, 290, 270, 1, 'y', 1, M.PLASTIC_WHITE, { modele: 'fourgon' });
  toupie(k, 300, 236);
  W.box(110, 220, G, 126, 232, G + 6, M.HT_GRUE); W.box(111, 221, G + 1, 125, 231, G + 6, 0); W.box(111, 221, G + 1, 125, 231, G + 4, M.CONCRETE);
  for (let i = 0; i < 4; i++) { W.box(250 + i * 8, 140, G, 256 + i * 8, 146, G + 2, M.WOOD); W.box(250 + i * 8, 140, G + 2, 256 + i * 8, 146, G + 5, M.CONCRETE); }
  W.box(96, 250, G, 99, 253, G + 9, M.CAR_BLUE);
  // le projecteur du chantier, la nuit (sauf s'il est arrêté)
  if (k.night && !arret) {
    W.box(240, 300, G, 241, 301, G + 24, M.METAL_DARK); W.box(238, 300, G + 24, 243, 302, G + 27, M.FLOOD);
    k.light({ x: 240, y: 296, z: G + 26, r: 120, fall: 1.6, cr: 0.95, cg: 0.92, cb: 0.80, axis: [-0.45, -0.62, -0.64], c0: 0.5, c1: 0.85, spill: 0.15, skip: 4 });
  }
}
// La toupie : camion malaxeur, la cuve qui tourne (rayée en spirale), le long de y.
function toupie(k, x, y) {
  const W = k.W;
  for (const a of [3, 18, 24]) for (const b of [0, 9]) W.box(x + b, y + a, 0, x + b + 1, y + a + 3, 4, M.TIRE);
  W.box(x + 1, y, 3, x + 9, y + 30, 5, M.METAL_DARK);
  W.box(x + 1, y, 5, x + 9, y + 7, 13, M.CAR_WHITE); W.box(x + 1, y, 9, x + 9, y + 1, 12, M.CAR_GLASS);
  for (let a = 9; a < 28; a++) {
    const r = 4 - Math.abs(a - 18) / 4;
    for (let b = -4; b <= 4; b++) for (let z = -4; z <= 4; z++) if (b * b + z * z <= r * r) W.set(x + 5 + b, y + a, 11 + z, mod(a + b + z, 4) < 2 ? M.HT_GRUE : M.PLASTIC_WHITE);
  }
}

// ================================================================ le parvis : bassin, bancs, jardinières, mâts, sculpture
function parvis(k, P) {
  const W = k.W, z = DZ, bad = k.bad;
  // le bassin, en creux : un miroir d'eau devant Dalmène et la Table ; à sec en mauvaise saison
  const bx0 = 904, bx1 = 1100, by0 = 236, by1 = 258;
  W.box(bx0 - 2, by0 - 2, z - 1, bx1 + 2, by1 + 2, z + 1, M.CIM_GRANITE || M.STONE);
  W.box(bx0, by0, -1, bx1, by1, z + 1, 0);
  W.box(bx0, by0, -2, bx1, by1, -1, bad ? M.CONCRETE : M.HT_EAU);
  if (bad) { for (let i = 0; i < 30; i++) W.stampLeaves(bx0 + k.rh(i, 1, 2801) * (bx1 - bx0), by0 + k.rh(i, 2, 2801) * (by1 - by0), 3, 1.5); W.box(bx0, by0, -2, bx1, by1, -1, M.GRAVEL); }
  // les jets, en ligne ; la nuit, éclairés par-dessous
  const jet = tint(k, k.night ? { col: [0.70, 0.86, 0.92], e: [0.42, 0.62, 0.72] } : { col: [0.82, 0.88, 0.90] });
  const ym = Math.floor((by0 + by1) / 2);
  for (let x = bx0 + 8; x < bx1 - 4; x += 14) {
    W.box(x, ym - 1, -1, x + 2, ym + 1, 0, M.METAL_DARK);
    if (!bad) {
      // un bouillon : une colonne d'eau et sa gerbe qui retombe
      const h = 5 + (x % 28 === 0 ? 4 : 0);
      for (let zz = -1; zz < h; zz++) W.set(x, ym, zz, M.NET, jet);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { W.set(x + dx, ym + dy, h - 1, M.NET, jet); W.set(x + 2 * dx, ym + 2 * dy, h - 3, M.NET, jet); W.set(x + 2 * dx, ym + 2 * dy, -1, M.NET, jet); }
    }
  }
  if (k.night && !bad) for (let x = bx0 + 24; x < bx1; x += 50) k.light({ x, y: ym + 0.5, z: 2, r: 34, cr: 0.55, cg: 0.80, cb: 0.95, shadow: false });
  if (bad) { const f = new Facade(W, LEFT, bx0 + 80, by1 + 2, 30, 2); W.box(bx0 + 90, by1 + 3, z, bx0 + 91, by1 + 4, z + 8, M.METAL_DARK); f.sign(6, z + 12, 'HORS SERVICE', { scale: 1, depth: -2, padX: 1, padY: 1, plate: [0.85, 0.82, 0.72], plateMat: M.PLASTIC_WHITE, fg: [0.70, 0.08, 0.08] }); }
  // les bancs de granit, le long du bassin
  for (let x = bx0 + 6; x < bx1 - 20; x += 36) { W.box(x, by1 + 6, z, x + 20, by1 + 9, z + 2, M.CIM_GRANITE || M.CONCRETE); W.box(x + 2, by1 + 6, z, x + 4, by1 + 9, z + 1, 0); W.box(x + 16, by1 + 6, z, x + 18, by1 + 9, z + 1, 0); }
  // les jardinières et leurs arbres, sur le bord du boulevard et à l'ouest
  const jard = (x, y, r = 5) => { W.box(x - 5, y - 5, z, x + 6, y + 6, z + 4, M.HT_BETON); W.box(x - 4, y - 4, z + 3, x + 5, y + 5, z + 4, M.SOIL); buisson(W, x - 3, y + 3, z + 4, 1.6, M.HEDGE, x + y); arbre(W, x, y, z + 4, { tronc: 8, r, seed: x * 7 + y, leafAmt: 0.6 }); };
  for (let x = 724; x < 1140; x += 44) { if (x > 1040 && x < 1080) continue; jard(x, 318); }
  for (const y of [200, 236, 272]) jard(870, y, 4.5);
  // les bancs entre les jardinières
  for (let x = 744; x < 1120; x += 88) { W.box(x, 314, z, x + 12, 317, z + 2, M.HT_BETON); W.box(x, 317, z, x + 12, 318, z + 5, M.WOOD); }
  // les mâts à drapeaux, devant Dalmène : le vent du plateau les tend vers l'est
  const motifs = ['dalmene', 'ville', 'dalmene', 'aube', 'dalmene'];
  for (let i = 0; i < 5; i++) {
    const x = 924 + i * 16, y = 222;
    W.box(x, y, z, x + 1, y + 1, z + 40, M.HT_ALU); W.set(x, y, z + 40, M.GOLD || M.METAL);
    drapeau(k, x + 1, y, z + 39, 'x', motifs[i], 11, 7);
  }
  // la sculpture : un ruban d'acier rouge qui se plie en arche (le seul rouge vif du parvis)
  const rouge = tint(k, { col: [0.62, 0.11, 0.09], g: 0.05 });
  for (let i = 0; i <= 40; i++) {
    const t = i / 40, x = Math.round(760 + t * 44), zz = Math.round(z + Math.sin(t * Math.PI) * 30), y = Math.round(286 + Math.sin(t * Math.PI * 2) * 6);
    W.box(x, y, zz, x + 2, y + 6, zz + 2, M.METAL, rouge);
  }
  W.box(758, 284, z, 764, 294, z + 2, M.METAL, rouge); W.box(802, 284, z, 808, 294, z + 2, M.METAL, rouge);
  if (k.night && !bad) { k.light({ x: 783, y: 300, z: z + 2, r: 44, cr: 1.0, cg: 0.80, cb: 0.62, skip: 1.5 }); W.box(782, 299, z, 784, 301, z + 1, M.LIT_PANEL); }
  // les lampadaires du parvis : mâts fins, lanterne blanche
  for (const [x, y] of [[742, 300], [826, 236], [852, 300], [930, 300], [1010, 300], [1088, 300], [1136, 230], [878, 214], [1040, 214], [744, 150]]) lampadaire(k, x, y, z, !(bad && (x + y) % 3 === 0));
  // les bornes lumineuses au bord de la dalle
  for (let x = 708; x < 1146; x += 22) { if (x > 1040 && x < 1080) continue; W.box(x, FR - 3, z, x + 1, FR - 2, z + 3, M.METAL_DARK); W.set(x, FR - 3, z + 3, k.night && !bad ? M.LIT_PANEL : M.METAL); }
  // des papiers que le vent emporte
  for (let i = 0; i < 6; i++) { const x = 860 + Math.floor(k.rh(i, 5, 2802) * 260), y = 262 + Math.floor(k.rh(i, 6, 2802) * 60); W.box(x, y, z, x + 1 + (i & 1), y + 1, z + 1, M.PAPER); }
  // l'horloge sur son mât, à deux cadrans ; le plan du quartier, éclairé la nuit
  W.box(1018, 286, z, 1020, 288, z + 22, M.METAL_DARK);
  W.box(1015, 284, z + 22, 1023, 290, z + 30, M.METAL_DARK);
  const hh = k.night ? 11 : 4, mm = k.night ? 20 : 40;
  const cs = W.obj({ type: 'esa_clock', face: LEFT, a0: 1015, z0: z + 22, w: 8, h: 8, hh, mm, lit: k.night && !bad });
  const ce = W.obj({ type: 'esa_clock', face: RIGHT, a0: 290, z0: z + 22, w: 6, h: 8, hh, mm, lit: k.night && !bad });
  for (let x = 1015; x < 1023; x++) for (let zz = z + 22; zz < z + 30; zz++) W.tag[W.idx(x, 289, zz)] = cs;
  for (let y = 284; y < 290; y++) for (let zz = z + 22; zz < z + 30; zz++) W.tag[W.idx(1022, y, zz)] = ce;
  W.box(1018, 286, z + 30, 1020, 288, z + 31, M.GOLD || M.METAL);
  W.box(840, 326, z, 852, 328, z + 12, M.METAL_DARK);
  const pl = W.obj({ type: 'hauts_plan', face: LEFT, a0: 841, z0: z + 2, w: 10, h: 9, lit: k.night && !bad });
  for (let x = 841; x < 851; x++) for (let zz = z + 2; zz < z + 11; zz++) W.tag[W.idx(x, 327, zz)] = pl;
  P.push({ key: 'parvis', label: 'Le parvis', x: 993, y: 297, z: G + 12 });
}
// Un lampadaire de parvis : mât fin, crosse, lanterne blanche.
function lampadaire(k, x, y, z, on = true) {
  const W = k.W, lit = k.night && on;
  W.box(x, y, z, x + 1, y + 1, z + 26, M.METAL_DARK);
  W.box(x - 1, y, z + 26, x + 3, y + 1, z + 27, M.METAL_DARK);
  W.set(x + 2, y, z + 25, lit ? M.TUBE : M.PLASTIC_WHITE); W.set(x - 1, y, z + 25, lit ? M.TUBE : M.PLASTIC_WHITE);
  if (lit) k.light({ x: x + 0.5, y: y + 0.5, z: z + 24.5, r: 64, fall: 2.0, cr: 1.75, cg: 1.80, cb: 1.70, spot: 0.5, skip: 2.2 });
}

// ================================================================ l'allée, le square, le trottoir du boulevard
function allee(k, P) {
  const W = k.W;
  W.box(650, 106, 1, 700, FR, G, M.HT_DALLE);
  for (let y = 124; y < 330; y += 34) { arbre(W, 664, y, G, { tronc: 10, r: 5.5, seed: y * 3, leafAmt: 0.7 }); W.box(661, y - 3, 1, 668, y + 4, G, M.SOIL); }
  for (let y = 140; y < 320; y += 68) { W.box(684, y, G, 687, y + 12, G + 2, M.WOOD); W.box(687, y, G, 688, y + 12, G + 5, M.WOOD); }
  // la sortie piétonne du parking souterrain : un édicule de verre, son P
  W.box(674, 200, G, 692, 212, G + 12, M.BOOTH);
  for (const [a, b] of [[674, 200], [691, 200], [674, 211], [691, 211]]) W.box(a, b, G, a + 1, b + 1, G + 12, M.METAL_DARK);
  W.box(673, 199, G + 12, 693, 213, G + 13, M.METAL_DARK);
  new Facade(W, LEFT, 680, 211, 6, 2).sign(0, G + 18, 'P', { scale: 2, depth: 0, padX: 1, padY: 1, plate: [0.14, 0.30, 0.62], plateMat: M.CAR_BLUE, fg: [0.95, 0.95, 0.92], emit: k.night ? [0.9, 0.9, 0.9] : null });
  W.box(682, 212, G + 13, 683, 213, G + 18, M.METAL_DARK);
  if (k.night) k.light({ x: 683, y: 214, z: G + 8, r: 26, cr: 0.6, cg: 0.66, cb: 0.66, skip: 1.5, shadow: false });
  for (const y of [170, 290]) candelabre(k, 696, y, G, k.night && !(k.bad && y === 290));
}
function square(k) {
  const W = k.W;
  W.box(0, 106, 1, 72, FR, G, M.GRASS);
  for (let y = 110; y < FR; y++) for (let x = 30; x < 38; x++) W.set(x + Math.round(Math.sin(y / 30) * 8), y, 1, M.GRAVEL);
  for (const [x, y, r] of [[14, 130, 6], [52, 156, 7], [16, 200, 6.5], [56, 236, 6], [18, 282, 7], [54, 306, 5.5]]) arbre(W, x, y, G, { tronc: 10, r, seed: x * 13 + y, leafAmt: 0.9 });
  for (const y of [180, 260]) B.bench(W, 44, y, G, 'y');
  candelabre(k, 40, 220, G, k.night);
}
// Le trottoir du boulevard : platanes, réverbères, bancs, l'abribus, le kiosque.
function trottoir(k) {
  const W = k.W;
  const libre = x => !NS.some(([a, b]) => x > a - 14 && x < b + 12) && !(x > 462 && x < 476) && !(x > 588 && x < 604) && !(x > 1170 && x < 1214) && !(x > 1300 && x < 1340) && !(x > 1436 && x < 1470);
  let i = 0;
  for (let x = 20; x < WD - 10; x += 52, i++) {
    if (!libre(x) || !libre(x + 4)) continue;
    W.box(x - 3, 347, 1, x + 5, 355, G, M.SOIL);
    for (let a = -3; a < 5; a += 2) { W.set(x + a, 347, 1, M.METAL_DARK); W.set(x + a, 354, 1, M.METAL_DARK); }
    B.planeTree(W, x, 350, G, { seed: 300 + x, trunk: 15, r: 8, leafR: 15, leafAmt: 0.7 });
  }
  for (let x = 46; x < WD - 10; x += 78) {
    if (!libre(x)) continue;
    B.streetLamp(W, x, 343, G, 0, 1, { on: k.night && !(k.bad && k.rh(x, 1, 2901) < 0.3) });
  }
  for (const x of [160, 860, 1004, 1268, 1560, 1700]) B.bench(W, x, 358, G, 'x');
  for (const x of [120, 640, 980, 1150, 1460, 1650]) B.bin(W, x, 340, G);
  B.busShelter(W, 1030, 342, G, 22, { poster: { title: 'LES HAUTS', bg: [0.20, 0.30, 0.42], fg: [0.95, 0.92, 0.85], seed: 9 } });
  B.kiosk(W, 1252, 342, G, { headline: 'TRANSFERT' });
  for (const [a, b] of NS) for (let y = 338; y < 362; y += 4) { W.box(a - 3, y, G, a - 2, y + 1, G + 4, M.METAL_BORD); W.box(b + 1, y, G, b + 2, y + 1, G + 4, M.METAL_BORD); }
}
// Les rues : axes, passages piétons, réverbères, voitures garées ; la rue de service ; la voie rapide.
function rues(k) {
  const W = k.W;
  // l'axe des rues nord-sud, les passages piétons au débouché sur le boulevard et sur la rue de service
  for (const [a, b] of NS) {
    const mid = Math.floor((a + b) / 2);
    for (let y = RS[1] + 14; y < FR - 10; y += 16) for (let t = 0; t < 9; t++) { W.set(mid - 1, y + t, 0, M.ROADLINE); W.set(mid, y + t, 0, M.ROADLINE); }
    for (let x = a + 1; x < b - 1; x += 4) { W.box(x, FR + 6, 0, x + 2, FR + 16, 1, M.ROADLINE); W.box(x, RS[1] + 2, 0, x + 2, RS[1] + 11, 1, M.ROADLINE); }
    const trot = (x, y) => W.get(x, y, 1) === M.SIDEWALK && W.get(x, y, 2) === 0;
    for (let y = 130; y < FR - 20; y += 76) {
      if (trot(a - 5, y)) B.streetLamp(W, a - 5, y, G, 1, 0, { on: k.night });
      if (trot(b + 4, y + 38)) B.streetLamp(W, b + 4, y + 38, G, -1, 0, { on: k.night && !(k.bad && y > 200) });
    }
  }
  // quelques voitures garées le long des rues nord-sud, nez vers le nord
  const PEINT = [M.CAR_WHITE, M.HT_LAQUE, M.CAR_BLUE, M.CAR_BORD, M.CAR_BEIGE];
  for (const [a, b] of NS) for (let y = 120; y < 270; y += 26) if (k.rh(a, y, 2902) < 0.55) voiture(k, b - 9, y, 1, 'y', -1, PEINT[Math.floor(k.rh(a, y, 2903) * 5)], { modele: 'berline' });
  // la circulation : le jour, une camionnette ; la nuit, une voiture qui sort, phares allumés
  if (k.night && !k.bad) voiture(k, NS[1][0] + 2, 250, 1, 'y', 1, M.CAR_WHITE, { modele: 'berline', phares: true });
  else if (k.day) voiture(k, NS[0][0] + 2, 160, 1, 'y', 1, M.CAR_WHITE, { modele: 'fourgon' });
  // la rue de service : l'axe, les réverbères, une camionnette de livraison
  for (let x = 0; x < WD; x += 16) { if (NS.some(([a, b]) => x + 9 > a - 2 && x < b + 2)) continue; W.box(x, 87, 0, x + 9, 89, 1, M.ROADLINE); }
  for (let x = 60; x < WD; x += 150) B.streetLamp(W, x, 102, G, 0, -1, { on: k.night, I: 1.8, r: 56 });
  voiture(k, 860, 90, 1, 'x', 1, M.CAR_WHITE, { modele: 'fourgon' });
  if (!k.bad) voiture(k, 1180, 78, 1, 'x', -1, M.CAR_BLUE, { modele: 'berline' });
  // la voie rapide : candélabres doubles sur le séparateur, les voitures qui filent, un portique
  const ym = (VR.sep[0] + VR.sep[1]) / 2;
  for (let x = 40; x < WD; x += 150) {
    W.box(x, Math.floor(ym), VZ + 6, x + 1, Math.floor(ym) + 1, G + 30, M.METAL);
    for (const s of [-1, 1]) { for (let i = 1; i <= 7; i++) W.set(x, Math.floor(ym) + s * i, G + 30, M.METAL); W.set(x, Math.floor(ym) + s * 8, G + 29, k.night ? M.BULB : M.PLASTIC_WHITE); }
    if (k.night) k.light({ x: x + 0.5, y: ym, z: G + 28, r: 64, fall: 2, cr: 1.5, cg: 1.0, cb: 0.48, spot: 0.5, skip: 2 });
  }
  const v1 = VR.c1[0] + 1, v2 = VR.c1[0] + 11, v3 = VR.c2[0] + 1, v4 = VR.c2[0] + 11;
  const flot = [[120, v1, -1, M.CAR_WHITE], [430, v2, -1, M.CAR_BORD], [880, v1, -1, M.HT_LAQUE], [1340, v2, -1, M.CAR_BLUE], [300, v4, 1, M.CAR_BEIGE], [760, v3, 1, M.CAR_WHITE], [1120, v4, 1, M.SEAT_GREY], [1600, v3, 1, M.CAR_BORD]];
  for (const [x, y, d, m] of flot) voiture(k, x, y, VZ + 1, 'x', d, m, { modele: x === 880 ? 'fourgon' : 'berline', phares: k.night, faisceau: d > 0 && (x === 760 || x === 1600) });
  // le portique : les panneaux verts au-dessus des deux chaussées
  const px = 1250;
  for (const y of [VR.acc - 2, VR.bau]) W.box(px, y, VZ + 1, px + 2, y + 2, G + 22, M.METAL);
  W.box(px, VR.acc - 2, G + 22, px + 2, VR.bau + 2, G + 24, M.METAL);
  for (const [y0, t] of [[VR.c1[0], 'LA CAPITALE'], [VR.c2[0], 'VALDORNE']]) {
    W.box(px + 2, y0, G + 14, px + 3, y0 + 21, G + 24, M.METAL_GREEN);
    new Facade(W, RIGHT, px + 2, y0, 1, 21).sign(Math.max(0, Math.floor((21 - largeur(t, 0.5)) / 2)), G + 21, t, { scale: 1, depth: 0, padX: 0, padY: 0, fg: [0.92, 0.92, 0.88] });
  }
}
// L'extrémité est : un talus planté, des arbres, la rue de service et la voie rapide qui filent vers les champs.
function bordEst(k) {
  const W = k.W;
  W.box(1764, 106, 1, WD, FR, G, M.GRASS);
  for (const [x, y, r] of [[1778, 130, 6], [1786, 176, 7], [1776, 230, 5.5], [1788, 290, 6.5], [1770, 316, 5]]) arbre(W, x, y, G, { tronc: 9, r, seed: x + y, leafAmt: 0.6 });
  for (let i = 0; i < 14; i++) buisson(W, 1764 + Math.floor(k.rh(i, 1, 2911) * 34), 112 + Math.floor(k.rh(i, 2, 2911) * 200), G, 2 + k.rh(i, 3, 2911) * 2, M.HEDGE, i);
}

// ================================================================ les gens des Hauts (1 pixel = 10 cm)
const KG = [0.06, 0.045, 0.04];
const BASEG = {
  k: KG, s: [0.86, 0.69, 0.55], S: [0.66, 0.48, 0.37], h: [0.17, 0.11, 0.08], H: [0.30, 0.20, 0.13],
  o: [0.09, 0.09, 0.09], j: [0.14, 0.15, 0.19], g: [0.46, 0.46, 0.45], w: [0.86, 0.86, 0.82], b: [0.84, 0.82, 0.76],
};
const spr = (rows, extra, ax, o = {}) => Object.assign({ rows, pal: Object.assign({}, BASEG, extra), ax }, o);
const variante = (sp, extra) => Object.assign({}, sp, { pal: Object.assign({}, sp.pal, extra) });
// Le cadre : costume sombre, chemise blanche, cravate, la mallette.
const CADRE = spr([
  '...kkkk...',
  '..khhhhk..',
  '..khsssk..',
  '..kskskk..',
  '..kssssk..',
  '...kSSk...',
  '..kcwrck..',
  '.kccwrcck.',
  '.kcccrcck.',
  '.kcccccck.',
  '.ksccccsk.',
  '..kcccckmk',
  '..kjjjjkmk',
  '..kjjkjjk.',
  '..kjk.kjk.',
  '..kjk.kjk.',
  '..kok.kok.',
  '...k...k..',
], { c: [0.16, 0.17, 0.22], r: [0.55, 0.10, 0.14], m: [0.32, 0.20, 0.11] }, 4);
// La femme d'affaires : manteau croisé, foulard, le sac à main.
const TAILLEUR = spr([
  '...kkkk...',
  '..khhhhk..',
  '.khhssshk.',
  '.khkskskh.',
  '..kssssk..',
  '...kSSk...',
  '..kffffk..',
  '.kccfcccks',
  '.kcccccckm',
  '.kcccccckm',
  '.ksccccsk.',
  '..kcccck..',
  '..kcccck..',
  '...kssk...',
  '...kssk...',
  '...koko...',
  '....k.k...',
], { c: [0.62, 0.50, 0.34], f: [0.70, 0.18, 0.20], h: [0.30, 0.18, 0.10], m: [0.12, 0.10, 0.10] }, 4);
// Le portier de l'Impérial : redingote bordeaux à boutons dorés, casquette galonnée, gants blancs.
const PORTIER = spr([
  '...kkkk...',
  '..kbbbbk..',
  '..kyyyyk..',
  '.kkssssk..',
  '..kskskk..',
  '..kssssk..',
  '...kSSk...',
  '..kbbbbk..',
  '.kbbybybk.',
  '.kbbbbbbk.',
  '.kbbybybk.',
  '.kwbbbbwk.',
  '.kbbybybk.',
  '.kbbbbbbk.',
  '..kbbbbk..',
  '..kjjkjjk.',
  '..kok.kok.',
  '...k...k..',
], { b: [0.42, 0.09, 0.13], y: [0.86, 0.68, 0.24], w: [0.92, 0.92, 0.88] }, 4);
// Le chauffeur : costume noir, casquette.
const CHAUFFEUR = spr([
  '..kkkkk...',
  '.kccccck..',
  '..kssssk..',
  '..kskskk..',
  '..kssssk..',
  '...kSSk...',
  '..kcwwck..',
  '.kccwwcck.',
  '.kcccccck.',
  '.kcccccck.',
  '.ksccccsk.',
  '..kcccck..',
  '..kcckcck.',
  '..kcck.ck.',
  '..kcck.ck.',
  '..kook.ok.',
  '...kk..k..',
], { c: [0.08, 0.08, 0.09] }, 4);
// L'ouvrier : casque jaune, gilet orange à bande claire, pantalon de travail.
const OUVRIER = spr([
  '...yyyy...',
  '..yyyyyy..',
  '..khsssk..',
  '..kskskk..',
  '..kssssk..',
  '...kSSk...',
  '..koooook.',
  '.koowwook.',
  '.koooooook',
  '.ksooooosk',
  '..kooook..',
  '..kjjjjk..',
  '..kjjkjjk.',
  '..kjk.kjk.',
  '..kjk.kjk.',
  '..kok.kok.',
  '...k...k..',
], { y: [0.88, 0.70, 0.12], o: [0.88, 0.40, 0.10], w: [0.82, 0.82, 0.76], j: [0.22, 0.28, 0.40] }, 4);
// Le vigile : uniforme marine, casquette, le talkie à la ceinture.
const VIGILE = spr([
  '..kkkkk...',
  '.knnnnnk..',
  '..kssssk..',
  '..kskskk..',
  '..kssssk..',
  '...kSSk...',
  '..knnnnk..',
  '.knnynnnk.',
  '.knnnnnnk.',
  '.knnnnnnk.',
  '.ksnnnnskg',
  '..kgggkkg.',
  '..knnnnk..',
  '..knnknnk.',
  '..knk.knk.',
  '..kok.kok.',
  '...k...k..',
], { n: [0.12, 0.15, 0.28], y: [0.80, 0.68, 0.30], g: [0.10, 0.10, 0.10] }, 4);
// Le fumeur en bras de chemise ; la nuit, la cigarette rougeoie.
const FUMEUR = spr([
  '...kkkk...',
  '..khhhhk..',
  '..khsssk..',
  '..kskskk..',
  '..ksssskE.',
  '...kSSk...',
  '..kwwwwk..',
  '.kwwrwwwk.',
  '.kwwrwwsk.',
  '.kwwwwwk..',
  '.kswwwwk..',
  '..kjjjjk..',
  '..kjjkjjk.',
  '..kjk.kjk.',
  '..kjk.kjk.',
  '..kok.kok.',
  '...k...k..',
], { w: [0.80, 0.84, 0.90], r: [0.20, 0.24, 0.42], j: [0.18, 0.18, 0.22], E: [0.86, 0.84, 0.80] }, 4);
const FUMEUR_NUIT = Object.assign({}, FUMEUR, { pal: Object.assign({}, FUMEUR.pal, { E: [1.0, 0.45, 0.15] }), emit: { E: [1.4, 0.55, 0.12] } });
// Le laveur de vitres, en combinaison bleue, harnais jaune.
const LAVEUR = variante(OUVRIER, { y: [0.92, 0.92, 0.88], o: [0.24, 0.36, 0.56], w: [0.88, 0.70, 0.12], j: [0.24, 0.36, 0.56] });
const SANTE = require('./district_sante').sprites || {};

function gens(k) {
  const W = k.W, put = (d, x, y, z, extra) => { if (d) W.sprite(Object.assign({ x, y, z }, d, extra || {})); };
  const COSTUMES = [{ c: [0.16, 0.17, 0.22] }, { c: [0.30, 0.31, 0.34] }, { c: [0.20, 0.16, 0.13] }, { c: [0.12, 0.14, 0.20], r: [0.20, 0.30, 0.55] }];
  const cadre = i => variante(CADRE, COSTUMES[i % COSTUMES.length]);
  const MANTEAUX = [{ c: [0.62, 0.50, 0.34] }, { c: [0.18, 0.18, 0.22], f: [0.86, 0.80, 0.62] }, { c: [0.50, 0.12, 0.16], h: [0.12, 0.08, 0.06] }, { c: [0.70, 0.70, 0.66], f: [0.20, 0.30, 0.55] }];
  const dame = i => variante(TAILLEUR, MANTEAUX[i % MANTEAUX.length]);
  const passant = i => variante(SP.WALKER, { q: COSTUMES[i % 4].c, Q: COSTUMES[i % 4].c.map(v => v * 0.75) });
  const bad = k.bad;
  // ---- toujours : le portier de l'Impérial (sauf la nuit de mauvaise saison), un vigile au parking
  if (!(bad && k.night)) put(PORTIER, 545, 282, G + 1);
  put(VIGILE, 1626, 303, 1);
  if (k.day && !bad) {
    // l'Impérial : le chauffeur près de sa berline, des clients qui entrent
    put(CHAUFFEUR, 512, 303, 1); put(cadre(1), 524, 290, 1); put(dame(1), 528, 289, 1);
    put(dame(2), 470, 340, G); put(passant(2), 600, 344, G);
    // le parvis : des gens qui le traversent, qui parlent, qui attendent
    put(cadre(0), 942, 290, DZ); put(cadre(2), 1022, 278, DZ); put(dame(0), 902, 304, DZ); put(cadre(3), 862, 252, DZ); put(dame(3), 866, 254, DZ);
    put(passant(1), 980, 232, DZ); put(passant(0), 1060, 296, DZ); put(cadre(1), 820, 312, DZ); put(dame(1), 1100, 322, DZ);
    // l'Écran : la pause cigarette devant l'entrée, un technicien près du car-régie
    put(FUMEUR, 828, 204, DZ); put(variante(FUMEUR, { w: [0.30, 0.32, 0.36] }), 831, 207, DZ); put(variante(OUVRIER, { y: [0.20, 0.20, 0.22], o: [0.20, 0.20, 0.22], w: [0.70, 0.12, 0.12] }), 772, 282, DZ);
    // la galerie, le cabinet, la Table
    put(dame(2), 1196, 339, G); put(cadre(3), 1212, 343, G); put(cadre(0), 1318, 326, G); put(dame(0), 1086, 222, DZ);
    // le chantier : sur la dalle du haut, au pied de la grue, à la toupie, au portail
    const zt = G + 8 * 16 + 1;
    put(OUVRIER, 160, 182, zt); put(OUVRIER, 204, 238, zt); put(OUVRIER, 296, 266, G); put(OUVRIER, 334, 292, G); put(OUVRIER, 120, 262, G);
    // les taxis : un chauffeur adossé à sa voiture
    put(variante(CHAUFFEUR, { c: [0.25, 0.25, 0.28] }), 1494, 315, 1);
    // le trottoir du boulevard
    for (const [i, x] of [[0, 210], [1, 700], [2, 1140], [3, 1380], [4, 1540], [5, 1690]]) put(i % 2 ? dame(i) : passant(i), x, 344 + (i % 3) * 5, G);
    // les laveurs de vitres, dans leur nacelle, sur la face sud de Dalmène
    put(LAVEUR, 928, 203, 122); put(LAVEUR, 936, 203, 122);
  } else if (k.day) {
    put(passant(0), 960, 300, DZ); put(dame(3), 1150, 342, G); put(cadre(2), 520, 344, G);
    put(variante(OUVRIER, {}), 340, 300, G);
  } else if (!bad) {
    // la nuit : on sort de la Table, on fume devant l'Écran, un vigile fait sa ronde
    put(cadre(0), 1080, 222, DZ); put(dame(2), 1084, 221, DZ); put(variante(SANTE.BARMAN || CADRE, {}), 1092, 218, DZ);
    put(FUMEUR_NUIT, 828, 204, DZ); put(VIGILE, 960, 200, DZ);
    put(cadre(1), 530, 291, 1); put(dame(1), 534, 290, 1); put(CHAUFFEUR, 512, 303, 1);
    put(passant(3), 1010, 300, DZ); put(dame(0), 1240, 344, G); put(passant(1), 430, 346, G);
  } else {
    put(passant(2), 1000, 304, DZ); put(variante(FUMEUR_NUIT, { w: [0.30, 0.32, 0.36] }), 1324, 326, G);
  }
}
// ================================================================ les détails : la nacelle, la banderole, les arrière-cours
// La nacelle des laveurs de vitres, accrochée au toit de Dalmène (le jour seulement).
function nacelle(k) {
  if (!k.day || k.bad) return;
  const W = k.W, x0 = 922, x1 = 942, y = 201, z = 122;
  W.box(x0, y, z - 1, x1, y + 3, z, M.HT_ALU);
  for (let x = x0; x < x1; x++) W.set(x, y + 2, z + 3, M.HT_GRUE);
  for (const x of [x0, x1 - 1]) { W.box(x, y + 2, z, x + 1, y + 3, z + 3, M.HT_GRUE); for (let zz = z + 3; zz < 195; zz++) W.set(x, y, zz, M.METAL_DARK); }
  W.box(x0 - 2, y - 6, 195, x1 + 2, y + 1, 197, M.HT_GRUE);
}
// La banderole des mauvais jours, sur la face est de la tour rose.
function banderole(k) {
  if (!k.bad) return;
  const W = k.W, x = 1365, y0 = 132, y1 = 190, z1 = 150;
  W.box(x, y0, z1 - 16, x + 1, y1, z1, M.CANVAS);
  const T = 'BUREAUX À LOUER', f = new Facade(W, RIGHT, x, y0, 1, y1 - y0);
  f.sign(Math.max(0, Math.floor((y1 - y0 - largeur(T, 1)) / 2)), z1 - 4, T, { scale: 2, depth: 0, padX: 0, padY: 0, plate: [0.88, 0.86, 0.80], plateMat: M.CANVAS, fg: [0.66, 0.10, 0.10] });
}
// Les arrière-cours : le bosquet derrière l'Écran, la cour de service et le jardin de l'Impérial, le parking
// derrière la galerie, les pelouses au nord de la tour ronde et du parking, l'esplanade de la tour ronde.
function jardiniere(W, x, y, z, r = 5, seed = 1) {
  W.box(x - 5, y - 5, z, x + 6, y + 6, z + 4, M.HT_BETON); W.box(x - 4, y - 4, z + 3, x + 5, y + 5, z + 4, M.SOIL);
  buisson(W, x - 3, y + 3, z + 4, 1.6, M.HEDGE, x + y + seed); arbre(W, x, y, z + 4, { tronc: 8, r, seed: x * 7 + y + seed, leafAmt: 0.6 });
}
function arrieres(k) {
  const W = k.W;
  // le bosquet sur la dalle, derrière l'Écran
  for (const [x, y] of [[724, 124], [768, 120], [810, 128], [790, 152]]) jardiniere(W, x, y, DZ, 4.5, 3);
  B.bench(W, 740, 140, DZ, 'x'); B.bench(W, 790, 136, DZ, 'y');
  // la cour de service de l'Impérial : bitume, la camionnette de la blanchisserie, les conteneurs
  road(W, 400, 106, 466, 176);
  voiture(k, 420, 120, 1, 'y', 1, M.CAR_WHITE, { modele: 'fourgon' });
  for (let i = 0; i < 4; i++) B.bin(W, 448 + (i % 2) * 3, 150 + Math.floor(i / 2) * 3, 1);
  B.crates(W, 440, 132, 1, 3); B.crates(W, 444, 132, 1, 2, M.CRATE_GREEN);
  // le jardin de l'Impérial, côté est : pelouse, buis, trois tilleuls
  W.box(562, 106, 1, 650, 172, G, M.GRASS);
  for (const [x, y] of [[580, 124], [622, 132], [598, 156]]) arbre(W, x, y, G, { tronc: 10, r: 6, seed: x + y, leafAmt: 0.8 });
  for (let x = 566; x < 646; x += 5) buisson(W, x, 169, G, 1.8, M.HEDGE, x);
  // le parking derrière la galerie
  road(W, 1152, 106, 1248, 148);
  const pl = W.obj({ type: 'hauts_sol', kind: 'places', axis: 'x', x0: 1152, y0: 108, w: 96, h: 18, pitch: 11 });
  for (let y = 108; y < 126; y++) for (let x = 1152; x < 1248; x++) if (W.get(x, y, 0) === M.ASPHALT) W.tag[W.idx(x, y, 0)] = pl;
  const PEINT = [M.CAR_WHITE, M.HT_LAQUE, M.CAR_BLUE, M.CAR_BORD, M.CAR_BEIGE, M.SEAT_GREY];
  for (let x = 1154; x < 1240; x += 11) if (k.rh(x, 1, 3101) < (k.night ? 0.3 : 0.75)) voiture(k, x + 1, 108, 1, 'y', -1, PEINT[Math.floor(k.rh(x, 2, 3101) * 6)], { modele: 'berline' });
  B.streetLamp(W, 1200, 144, G, 0, -1, { on: k.night, I: 1.6, r: 50, h: 18 });
  // les pelouses au nord de la tour ronde et du parking
  W.box(1440, 106, 1, 1590, 150, G, M.GRASS); W.box(1596, 106, 1, 1764, 146, G, M.GRASS);
  for (let x = 1450; x < 1760; x += 34) arbre(W, x + Math.floor(k.rh(x, 3, 3102) * 10), 116 + Math.floor(k.rh(x, 4, 3102) * 20), G, { tronc: 9, r: 5 + k.rh(x, 5, 3102) * 2, seed: x, leafAmt: 0.6 });
  // l'esplanade de la tour ronde : dalle de granit, jardinières, bancs
  W.box(1440, 232, 1, 1590, 304, G, M.HT_DALLE);
  for (const [x, y] of [[1452, 252], [1452, 290], [1570, 252], [1570, 290]]) jardiniere(W, x, y, G, 4.5, 5);
  B.bench(W, 1466, 296, G, 'x'); B.bench(W, 1540, 296, G, 'x');
}
// Le fouillis du chantier : le silo à ciment, les toilettes de chantier, les banches, les ferrailles, le tas de sable.
function fouillis(k) {
  const W = k.W;
  cylindre(W, 112, 196, 4, G + 10, G + 36, M.PLASTIC_WHITE);
  for (let i = 0; i < 4; i++) W.set(112, 196, G + 36 + i, M.PLASTIC_WHITE);
  for (const [dx, dy] of [[-3, -3], [3, -3], [-3, 3], [3, 3]]) W.box(112 + dx, 196 + dy, G, 113 + dx, 197 + dy, G + 10, M.HT_GRUE);
  W.box(108, 192, G + 10, 117, 201, G + 11, M.HT_GRUE);
  new Facade(W, LEFT, 108, 192, 8, 8).sign(0, G + 28, 'CIMENT', { scale: 1, depth: 0, padX: 0, padY: 0, fg: [0.20, 0.30, 0.50] });
  for (let i = 0; i < 3; i++) { W.box(100 + i * 5, 236, G, 104 + i * 5, 240, G + 9, M.CAR_BLUE); W.box(100 + i * 5, 236, G + 9, 104 + i * 5, 240, G + 10, M.PLASTIC_WHITE); }
  for (let i = 0; i < 5; i++) W.box(244, 160 + i * 3, G, 262, 162 + i * 3, G + 1 + (i % 3), M.WOOD);
  for (let i = 0; i < 4; i++) W.box(248, 180 + i * 2, G + (i & 1), 290, 181 + i * 2, G + 1 + (i & 1), M.METAL);
  for (let r = 6; r > 0; r--) W.box(312 - r, 150 - r, G + 6 - r, 312 + r, 150 + r, G + 7 - r, M.GRAVEL);
  B.crates(W, 140, 270, G, 2, M.CRATE_GREEN);
}

// ================================================================ le quartier
function enclos(W, w, h) {
  const P = Object.getPrototypeOf(W);
  W.inb = function (x, y, z) { return x >= 0 && y >= 0 && x < w && y < h && P.inb.call(this, x, y, z); };
  W.set = function (x, y, z, m, t) { if (x >= 0 && y >= 0 && x < w && y < h) P.set.call(this, x, y, z, m, t); };
  W.box = function (x0, y0, z0, x1, y1, z1, m, t) { P.box.call(this, Math.max(0, Math.round(x0)), Math.max(0, Math.round(y0)), z0, Math.min(w, Math.round(x1)), Math.min(h, Math.round(y1)), Math.min(ZMAX + 1, z1), m, t); };
  W.stampLeaves = function (cx, cy, r, amt) {
    for (let y = Math.max(0, Math.floor(cy - r)); y < Math.min(h, cy + r); y++) for (let x = Math.max(0, Math.floor(cx - r)); x < Math.min(w, cx + r); x++) {
      const d = Math.hypot(x - cx, y - cy) / r, gx = x + this.ox, gy = y + this.oy;
      if (d < 1 && gx >= 0 && gy >= 0 && gx < this.X && gy < this.Y) this.leaf[gy * this.X + gx] += amt * (1 - d) * (1 - d);
    }
  };
}
function construire(W, ctx) {
  const k = { W, night: !!ctx.night, day: !ctx.night, bad: ctx.mood === 'bad', time: ctx.time };
  k.SEED = Math.floor(ctx.R() * 2147483647);
  k.rh = (a, b, c = 0) => hash(a | 0, b | 0, c | 0, k.SEED);
  const P = [];
  // les lumières ponctuelles coûtent cher au rendu : 250 au plus pour tout le quartier (réverbères compris)
  const n0 = W.lights.length;
  k.light = l => W.light(l);
  sol(k);
  dalle(k);
  square(k);
  chantier(k, P);
  fouillis(k);
  allee(k, P);
  tourDalmene(k, P);
  nacelle(k);
  tourEcran(k, P);
  tourTable(k, P);
  tourRonde(k, P);
  tourValdorne(k, P);
  tourRose(k, P);
  banderole(k);
  imperial(k, P);
  galerie(k, P);
  verdier(k, P);
  parking(k, P);
  rueParking(k);
  arrieres(k);
  bordures(k);
  parvis(k, P);
  trottoir(k);
  rues(k);
  bordEst(k);
  gens(k);
  if (W.lights.length - n0 > 250) throw new Error(`les Hauts : ${W.lights.length - n0} lumières, 250 au plus`);
  return { places: P };
}
module.exports = {
  w: WD, h: HT, zmax: 230, seed: 2026,
  build(W, ctx) {
    enclos(W, WD, HT);
    try { return construire(W, ctx); } finally { delete W.set; delete W.box; delete W.inb; delete W.stampLeaves; }
  },
};
