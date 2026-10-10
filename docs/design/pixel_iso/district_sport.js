'use strict';
// FUSIBLE · quartier « sport » (à l'est du club-house) : le terrain annexe et le centre de formation
// du Racing Aubérive, entre le quai sud de la rivière (y = 0) et l'avenue du Stade (y = 156).
// 1 voxel = 20 cm. Faces vues : le dessus, +y (LEFT) et +x (RIGHT).
const E = require('./engine');
const { M } = require('./mats');
const B = require('./build');
const S = require('./sprites');
require('./diorama'); require('./interiors'); // M.WEED, M.MUD, M.TARP, M.BALLS, M.TUBE… (déjà chargées par la ville)
const { LEFT, RIGHT, TOP, hash, fbm, vnoise, mod, clamp, material, overlay, OVERLAYS, textBitmap } = E;
const { Facade } = B;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const grain = (c, amt, s = 0) => mul(c, 1 + (hash(c.a, c.b, c.face * 7 + s, c.m) - 0.5) * 2 * amt);
const grime = (c, h = 4, k = 0.24) => { if (c.face !== TOP) { const t = clamp((c.hz - 2) / h, 0, 1); mul(c, 1 - k * (1 - t)); } };

// ---------------------------------------------------------------- matières nouvelles (préfixe ESTQ, déclarées une seule fois)
// Bardage nervuré des préfabriqués : tôle laquée crème, nervures verticales, coulures.
M.ESTQ_CLAD = M.ESTQ_CLAD || material('bardage de préfabriqué', c => {
  if (c.face === TOP) { rgb(c, 0.40, 0.40, 0.39); grain(c, 0.05); if (mod(c.a, 6) === 0) mul(c, 0.86); return; }
  const r = mod(c.a, 3);
  const k = r === 0 ? 0.80 : r === 1 ? 1.05 : 0.97;
  rgb(c, 0.70 * k, 0.69 * k, 0.635 * k);
  grain(c, 0.025);
  if (vnoise(c.a * 0.35, c.hz * 0.1, 822) > 0.72) mul(c, 0.91);
  grime(c, 4, 0.22);
});
// Filet de but : un fil clair, laisse passer la lumière.
M.ESTQ_NET = M.ESTQ_NET || material('filet de but', c => { rgb(c, 0.80, 0.80, 0.76); grain(c, 0.06); }, { trans: 0.85, noAO: true, noAOrecv: true });

// ---------------------------------------------------------------- calques (ne consomment pas de matière)
// Les lignes du terrain, en texels (10 cm) : touches, buts, médiane, rond, surfaces, points, arcs, coins.
function chalkAt(o, ta, tb) {
  const { A0, A1, B0, B1 } = o.L;
  if (ta < A0 - 8 || ta > A1 + 8 || tb < B0 - 8 || tb > B1 + 8) return false;
  const inA = ta >= A0 && ta <= A1, inB = tb >= B0 && tb <= B1;
  if ((tb === B0 || tb === B1) && inA) return true;
  if ((ta === A0 || ta === A1) && inB) return true;
  const CA = (A0 + A1) / 2, CB = (B0 + B1) / 2;
  if (ta === CA && inB) return true;
  const near = (r, cx, cy) => Math.abs(Math.hypot(ta - cx, tb - cy) - r) < 0.62;
  if (near(o.rc, CA, CB)) return true;
  if ((ta === CA || ta === CA + 1) && (tb === CB || tb === CB + 1)) return true;
  for (const [gl, s] of [[A0, 1], [A1, -1]]) {
    const between = (v, a, b) => v >= Math.min(a, b) && v <= Math.max(a, b);
    const box = gl + s * o.box, ga = gl + s * o.ga, spot = gl + s * o.spot;
    if (ta === box && tb >= CB - o.boxW && tb <= CB + o.boxW) return true;
    if ((tb === CB - o.boxW || tb === CB + o.boxW) && between(ta, gl, box)) return true;
    if (ta === ga && tb >= CB - o.gaW && tb <= CB + o.gaW) return true;
    if ((tb === CB - o.gaW || tb === CB + o.gaW) && between(ta, gl, ga)) return true;
    if ((ta === spot || ta === spot + s) && (tb === CB || tb === CB + 1)) return true;
    if (s * (ta - box) > 0 && near(o.arc, spot, CB)) return true;
  }
  for (const [ca, cb, sa, sb] of [[A0, B0, 1, 1], [A1, B0, -1, 1], [A0, B1, 1, -1], [A1, B1, -1, -1]])
    if (sa * (ta - ca) >= 0 && sb * (tb - cb) >= 0 && near(5, ca, cb)) return true;
  return false;
}
// La pelouse usée : surfaces de but pelées, axe du jeu, couloir de l'adjoint ; en mauvaise saison, la friche.
if (!OVERLAYS.esp_turf) overlay('esp_turf', (o, c) => {
  if (c.face !== TOP) return;
  const x = c.hx, y = c.hy, ta = Math.floor(2 * x), tb = Math.floor(2 * y);
  const n = fbm(x / 6, y / 6, 811), m = fbm(x / 2.2, y / 2.2, 812), h = hash(ta, tb, 813, 0);
  let wear = 0;
  for (const g of o.goals) wear = Math.max(wear, 1.1 - Math.hypot((x - g[0]) / 17, (y - g[1]) / 13));
  wear = Math.max(wear, 0.78 - Math.hypot((x - o.cx) / 24, (y - o.cy) / 17));
  wear = Math.max(wear, 0.42 - Math.abs(y - o.cy) / 30);
  wear = Math.max(wear, 0.52 - Math.abs(y - o.coachY) / 3 - Math.abs(x - o.cx) / 70);
  wear += (m - 0.5) * 1.15 + (n - 0.5) * 0.4;
  let t = clamp((wear - 0.4) * 2.4, 0, 1);
  const k = 0.84 + 0.32 * n;
  let gr, gg, gb;
  if (o.bad) {
    const tuft = fbm(x / 1.3, y / 1.3, 817);
    gr = 0.27 * k; gg = 0.33 * k; gb = 0.15 * k;
    if (tuft > 0.55) { gr *= 1.25; gg *= 1.12; gb *= 0.9; } else if (tuft < 0.4) { gr *= 0.8; gg *= 0.85; }
    t *= 0.55;
  } else {
    gr = 0.20 * k; gg = 0.345 * k; gb = 0.155 * k;
    if (mod(Math.floor((x - o.x0) / 12), 2)) { gr *= 0.9; gg *= 0.91; gb *= 0.9; }
  }
  if (h < 0.08) { gr *= 1.22; gg *= 1.12; } else if (h > 0.93) { gr *= 0.8; gg *= 0.82; gb *= 0.8; }
  const sk = 0.9 + 0.2 * hash(ta >> 1, tb >> 1, 814, 0);
  let r = gr + (0.38 * sk - gr) * t, g = gg + (0.30 * sk - gg) * t, b = gb + (0.21 * sk - gb) * t;
  if (t > 0.45 && h < 0.18) { r = 0.50; g = 0.47; b = 0.42; }
  else if (t > 0.2 && t < 0.8 && h > 0.72) { r = gr; g = gg; b = gb; }
  rgb(c, r, g, b);
  const p = fbm(x / 7 + 4.1, y / 7 - 2.3, 815, 3), thr = o.bad ? 0.58 : 0.68;
  if (p > thr && t > 0.25) c.wet = clamp((p - thr) * 10, 0, 0.9) * (o.bad ? 1 : 0.8);
  if (chalkAt(o, ta, tb) && hash(ta, tb, 816, 1) > (o.bad ? 0.9 : 0.06) && !(t > 0.85 && h < 0.4)) { rgb(c, 0.82, 0.82, 0.76); c.wet *= 0.3; }
  const W = c.W, ix = Math.floor(x + o.ox), iy = Math.floor(y + o.oy);
  if (ix >= 0 && iy >= 0 && ix < W.X && iy < W.Y) {
    const d = W.leaf[iy * W.X + ix];
    if (d > 0 && hash(ta, tb, 913, 5) < d * 0.42) { const v = hash(ta, tb, 914, 1); if (v < 0.4) rgb(c, 0.62, 0.42, 0.14); else if (v < 0.7) rgb(c, 0.52, 0.24, 0.10); else rgb(c, 0.70, 0.56, 0.22); c.wet *= 0.3; }
  }
});
// Tags à la bombe : lettres penchées, contour sombre, coulures.
if (!OVERLAYS.esp_graff) overlay('esp_graff', (o, c) => {
  if (c.face !== o.face) return;
  const la = o.face === LEFT ? Math.floor(2 * c.hx) - 2 * o.a0 : 2 * o.a0 - 1 - Math.floor(2 * c.hy);
  const lt = 2 * o.zTop - 1 - Math.floor(2 * c.hz);
  if (!o.bmp) o.bmp = textBitmap(o.text);
  const sc = o.scale || 2;
  const at = (X, Y) => { const X2 = X + Math.floor(Y / 3) - 2, Y2 = Y - 1; return X2 >= 0 && Y2 >= 0 && o.bmp.at(Math.floor(X2 / sc), Math.floor(Y2 / sc)); };
  if (at(la, lt)) { const f = o.col; rgb(c, f[0], f[1], f[2]); if (hash(la, lt, 931, o.seed || 0) < 0.15) mul(c, 0.82); return; }
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (at(la + dx, lt + dy)) { const e = o.edge || [0.07, 0.06, 0.07]; rgb(c, e[0], e[1], e[2]); return; }
  for (let k = 2; k <= 5; k++) if (at(la, lt - k) && hash(la, 0, 932, o.seed || 0) < 0.22) { const f = o.col; rgb(c, f[0] * 0.85, f[1] * 0.85, f[2] * 0.85); return; }
});
// Peinture unie (avec motif) : portes, cadres, plots, panneaux ; ne coûte pas de matière.
if (!OVERLAYS.esp_paint) overlay('esp_paint', (o, c) => {
  const f = o.col; rgb(c, f[0], f[1], f[2]);
  const al = c.face === LEFT ? Math.floor(2 * c.hx) : Math.floor(2 * c.hy), bl = Math.floor(2 * c.hz);
  if (o.pat === 'ribs' && c.face !== TOP && mod(al, 3) === 0) mul(c, 0.78);
  if (o.pat === 'planks' && c.face !== TOP && mod(bl, 3) === 0) mul(c, 0.74);
  if (o.pat === 'rust' && fbm(c.hx * 0.6 + c.hy * 0.6, c.hz * 0.6, 941) > 0.58) rgb(c, 0.40, 0.23, 0.13);
  if (c.face === TOP) { if (o.top) rgb(c, o.top[0], o.top[1], o.top[2]); else mul(c, 1.07); }
  grain(c, o.grain != null ? o.grain : 0.05);
  if (o.emit) { c.er = o.emit[0]; c.eg = o.emit[1]; c.eb = o.emit[2]; }
});

// ---------------------------------------------------------------- personnages (1 pixel = 10 cm)
const K = [0.06, 0.045, 0.04];
const BASE = {
  k: K, s: [0.86, 0.69, 0.55], S: [0.66, 0.48, 0.37], h: [0.17, 0.11, 0.08], H: [0.30, 0.20, 0.13],
  o: [0.09, 0.09, 0.09], j: [0.24, 0.30, 0.42], J: [0.16, 0.20, 0.30], g: [0.46, 0.46, 0.45], G: [0.32, 0.32, 0.32],
  b: [0.84, 0.82, 0.76], w: [0.66, 0.66, 0.64],
};
const pal = (...extra) => Object.assign({}, BASE, ...extra);
const SKIN = {
  clair: { s: [0.86, 0.69, 0.55], S: [0.66, 0.48, 0.37] },
  mat: { s: [0.70, 0.50, 0.36], S: [0.52, 0.36, 0.25] },
  fonce: { s: [0.44, 0.29, 0.20], S: [0.31, 0.20, 0.13] },
};
const HAIR = {
  brun: { h: [0.17, 0.11, 0.08], H: [0.30, 0.20, 0.13] }, noir: { h: [0.06, 0.05, 0.05], H: [0.15, 0.13, 0.12] },
  blond: { h: [0.76, 0.60, 0.30], H: [0.90, 0.78, 0.46] }, roux: { h: [0.55, 0.25, 0.11], H: [0.70, 0.38, 0.18] },
  chatain: { h: [0.36, 0.24, 0.14], H: [0.48, 0.34, 0.20] }, gris: { h: [0.55, 0.55, 0.53], H: [0.70, 0.70, 0.68] },
};
// le maillot du Racing : bordeaux à fines bandes grises, short gris, bas bordeaux
const KIT = { t: [0.46, 0.12, 0.18], w: [0.60, 0.60, 0.58], p: [0.45, 0.45, 0.45], q: [0.46, 0.12, 0.18] };
const BIB = { t: [0.46, 0.12, 0.18], w: [0.92, 0.60, 0.10], v: [0.92, 0.60, 0.10], p: [0.45, 0.45, 0.45], q: [0.46, 0.12, 0.18] };
const flip = rows => rows.map(r => [...r].reverse().join(''));

const P_STAND = [
  '...kkkkk...',
  '..khhhhhk..',
  '..khHhhhk..',
  '..ksssssk..',
  '..kskskSk..',
  '..ksssssk..',
  '...kSSSk...',
  '..kttttttk.',
  '.kttwttwttk',
  '.kttwttwttk',
  '.kttwttwttk',
  '.kstwttwtsk',
  '..kppppppk.',
  '..kppkpppk.',
  '..kssk.ssk.',
  '..kqqk.qqk.',
  '..kook.ook.',
  '...kk...kk.',
];
const P_RUN = [
  '....kkkkk...',
  '...khhhhhk..',
  '...khHhhhk..',
  '...ksssssk..',
  '...kskskSk..',
  '...ksssssk..',
  '....kSSSk...',
  '...kttttttk.',
  '..ksttwttwtk',
  '.ks.ktwttwkk',
  '.k..ktwttwtsk',
  '....ktwttwtk.',
  '....kpppppk..',
  '...kppkkpppk.',
  '..kssk..kssk.',
  '.kqqk....kqk.',
  'kook.....kook',
  '.kk.......kk.',
].map(r => r.padEnd(13, '.'));
const KEEPER_ROWS = [
  '...kkkkk...',
  '..khhhhhk..',
  '..khHhhhk..',
  '..ksssssk..',
  '..kskskSk..',
  '..ksssssk..',
  '...kSSSk...',
  '.kkttttttkk',
  'kbkttttttkb',
  'kbktttttkkb',
  '.kkttttttk.',
  '..kttttttk.',
  '..kppppppk.',
  '..kppkpppk.',
  '..kppk.ppk.',
  '..kqqk.qqk.',
  '..kook.ook.',
  '...kk...kk.',
];
const sp = (rows, p, ax, extra) => Object.assign({ rows, pal: p, ax }, extra || {});
const u17 = (skin, hair, kit = KIT, run = false, mirror = false) => sp(mirror ? flip(run ? P_RUN : P_STAND) : (run ? P_RUN : P_STAND), pal(SKIN[skin], HAIR[hair], kit), run ? 6 : 5);
const BIB_ROWS = P_STAND.map((r, i) => ({ 7: '..kvvvvvvk.', 8: '.ktvvvvvvtk', 9: '.ktvvvvvvtk', 10: '.ktvvvvvvtk', 11: '.ksvvvvvvsk' })[i] || r);
const U17_BIB = (skin, hair) => sp(BIB_ROWS, pal(SKIN[skin], HAIR[hair], BIB), 5);

// Zoran Vukić, l'adjoint : survêtement marine (jamais celui du coach), moustache, sifflet, le cahier.
const VUKIC = sp([
  '...kkkkk...',
  '..khhhhhk..',
  '..khHhhhk..',
  '..ksssssk..',
  '..kskskSk..',
  '..ksmmmsk..',
  '...ksssk...',
  '..knnnnnk..',
  '.knnnwnnnk.',
  '.knnnnwnnk.',
  '.knnnnnnnkk',
  '.ksnnnnnkbk',
  '..knnnnnkbk',
  '..knnknnkk.',
  '..knnknnk..',
  '..knnknnk..',
  '..kNNkNNk..',
  '..kookook..',
  '...kk.kk...',
], pal(HAIR.brun, { n: [0.13, 0.16, 0.30], N: [0.08, 0.10, 0.20], m: [0.34, 0.20, 0.10], w: [0.78, 0.78, 0.74], b: [0.84, 0.80, 0.64] }), 5);
// Les gardiens : le petit des U17 en vert, Vecchio (41 ans, cheveux gris) en noir et pantalon long.
const KEEPER = sp(KEEPER_ROWS, pal(SKIN.clair, HAIR.chatain, { t: [0.20, 0.44, 0.25], p: [0.10, 0.10, 0.11], q: [0.20, 0.44, 0.25], b: [0.86, 0.84, 0.70] }), 5);
const VECCHIO = sp(KEEPER_ROWS.map((r, i) => i === 14 ? '..kppk.ppk.' : i === 15 ? '..kppk.ppk.' : r),
  pal(SKIN.clair, HAIR.gris, { t: [0.16, 0.16, 0.18], p: [0.12, 0.12, 0.13], q: [0.12, 0.12, 0.13], b: [0.80, 0.78, 0.66] }), 5);
// Marinette, la cantine : chignon gris, blouse bleue, tablier blanc.
const MARINETTE = sp([
  '...kkk....',
  '..kHHHk...',
  '..khhhhk..',
  '.khsssshk.',
  '..kskskk..',
  '..kssssk..',
  '...kSSk...',
  '..kddddk..',
  '.kddbbddk.',
  '.kddbbddk.',
  '.ksdbbdsk.',
  '..kdbbdk..',
  '..kbbbbk..',
  '..kbbbbk..',
  '..kddddk..',
  '...ksks...',
  '...koko...',
  '....k.k...',
], pal(SKIN.clair, { h: [0.60, 0.58, 0.55], H: [0.72, 0.70, 0.66], d: [0.30, 0.40, 0.60], b: [0.88, 0.87, 0.82] }), 4);
// Corner, le chien de Lulu, le gardien du stade.
const DOG = sp([
  '........kk.',
  '.k.....kaak',
  'kak...kaaaa',
  '.kaaaaaaaak',
  '..kawwwaak.',
  '..kak..kak.',
  '..kk...kk..',
], pal({ a: [0.48, 0.30, 0.16], w: [0.80, 0.76, 0.66] }), 5, { shadowR: 3 });
const CONE = sp(['.c.', '.c.', 'cwc', 'ccc'], { c: [0.92, 0.40, 0.08], w: [0.90, 0.88, 0.82] }, 1, { shadowR: 1.5 });
const SAUCER = sp(['.y.', 'yyy'], { y: [0.95, 0.80, 0.12] }, 1, { shadowR: 1.2 });
const BIKE = (col) => sp([
  '............kkk..',
  '....kkk.....k....',
  '.....rrrrrrrr....',
  '.....r.....rr....',
  '.kkkr.r...r.krkk.',
  'k..r.kr..r.k.r..k',
  'k.kr.k.rr..k.k..k',
  'k..rrrrk...k....k',
  'k....k..k..k....k',
  '.kkkk.......kkkk.',
], { k: [0.08, 0.08, 0.09], r: col }, 8, { shadowR: 5 });
const BALL = S.BALL;

// survêtement du club (un U17 qui attend sa séance)
const TRACK = sp(P_STAND.map((r, i) => ({ 7: '..knnnnnnk.', 8: '.knnwnnwnnk', 9: '.knnwnnwnnk', 10: '.knnnnnnnnk', 11: '.ksnnnnnnsk', 12: '..knnnnnnk.', 13: '..knnknnnk.', 14: '..knnk.nnk.', 15: '..knnk.nnk.' })[i] || r),
  pal(SKIN.mat, HAIR.noir, { n: [0.44, 0.13, 0.18], w: [0.62, 0.62, 0.60] }), 5);
const sprites = {
  VUKIC, MARINETTE, DOG, CONE, SAUCER, BALL: S.BALL, KEEPER, VECCHIO,
  U17_A: u17('clair', 'brun'), U17_A2: u17('mat', 'chatain'), U17_A3: u17('clair', 'noir'),
  U17_RUN: u17('mat', 'noir', KIT, true), U17_RUN_M: u17('clair', 'blond', KIT, true, true), MBAKO: u17('fonce', 'noir', KIT, true),
  U17_BIB: U17_BIB('clair', 'roux'), U17_BIB2: U17_BIB('fonce', 'noir'), U17_BIB3: U17_BIB('mat', 'brun'),
  U17_TRACK: TRACK,
  BIKE_R: BIKE([0.55, 0.12, 0.12]), BIKE_B: BIKE([0.20, 0.35, 0.60]), BIKE_G: BIKE([0.25, 0.45, 0.25]),
  KEEPER_SR: sp(KEEPER_ROWS, pal(SKIN.clair, HAIR.brun, { t: [0.78, 0.66, 0.16], p: [0.12, 0.12, 0.13], q: [0.12, 0.12, 0.13], b: [0.86, 0.84, 0.70] }), 5),
  SR_B: u17('fonce', 'noir', KIT, true, true), SR_C: u17('clair', 'chatain', KIT, true), SR_D: u17('mat', 'brun'),
  SR_BIB: U17_BIB('clair', 'brun'), SR_BIB2: U17_BIB('mat', 'noir'), SR_BIB3: sp(flip(P_RUN), pal(SKIN.clair, HAIR.roux, BIB, { t: [0.92, 0.60, 0.10], w: [0.92, 0.60, 0.10] }), 6),
};

// ---------------------------------------------------------------- petits ouvrages
// Feuilles mortes, mais seulement dans le rectangle du quartier.
function leaves(W, cx, cy, r, amt, w, h) {
  for (let y = Math.max(0, Math.floor(cy - r)); y < Math.min(h, cy + r); y++)
    for (let x = Math.max(0, Math.floor(cx - r)); x < Math.min(w, cx + r); x++) {
      const d = Math.hypot(x - cx, y - cy) / r;
      const gx = x + W.ox, gy = y + W.oy;
      if (d < 1 && gx >= 0 && gy >= 0 && gx < W.X && gy < W.Y) W.leaf[gy * W.X + gx] += amt * (1 - d) * (1 - d);
    }
}
// Peuplier d'Italie : un fuseau de feuillage doré.
function poplar(W, x, y, G, seed, hgt = 38) {
  W.box(x, y, G, x + 2, y + 2, G + 9, M.BARK);
  for (let z = G + 6; z < G + hgt; z++) {
    const t = (z - G - 6) / (hgt - 6);
    const r = 3.4 * Math.sin(Math.PI * Math.min(1, t * 1.08 + 0.1)) + 0.7;
    for (let yy = -5; yy <= 6; yy++) for (let xx = -5; xx <= 6; xx++) {
      const d = Math.hypot(xx - 0.5, yy - 0.5);
      if (d < r - 0.4 + hash(x + xx, y + yy, z, seed) * 0.9 && W.get(x + xx, y + yy, z) === 0) W.set(x + xx, y + yy, z, M.FOLIAGE);
    }
  }
}
// Arbre en boule (tilleul de la cour).
function roundTree(W, x, y, G, r, trunk, seed, m) {
  W.box(x, y, G, x + 2, y + 2, G + trunk, M.BARK);
  const cx = x + 1, cy = y + 1, cz = G + trunk + r - 1;
  for (let z = Math.floor(cz - r); z <= cz + r; z++) for (let yy = Math.floor(cy - r - 1); yy <= cy + r + 1; yy++) for (let xx = Math.floor(cx - r - 1); xx <= cx + r + 1; xx++) {
    const d = Math.hypot(xx + 0.5 - cx, yy + 0.5 - cy, (z + 0.5 - cz) * 1.15) / r;
    if (d < 0.8 + 0.3 * hash(xx, yy, z, seed) && W.get(xx, yy, z) === 0) W.set(xx, yy, z, m || M.FOLIAGE);
  }
}
// Un module préfabriqué : caisson à cadre acier, bardage nervuré.
function prefabModule(W, x0, y0, w, d, z0, h, frameTag) {
  W.box(x0, y0, z0, x0 + w, y0 + d, z0 + h, M.ESTQ_CLAD);
  W.box(x0, y0, z0, x0 + w, y0 + d, z0 + 1, M.METAL, frameTag);
  W.box(x0, y0, z0 + h - 1, x0 + w, y0 + d, z0 + h, M.METAL, frameTag);
  for (const [cx, cy] of [[x0, y0], [x0 + w - 1, y0], [x0, y0 + d - 1], [x0 + w - 1, y0 + d - 1]]) W.box(cx, cy, z0, cx + 1, cy + 1, z0 + h, M.METAL, frameTag);
}
// Un but : montants et barre blancs, cadre arrière, filet à larges mailles.
function goal(W, gx, ya, yb, G, dir, net) {
  const H = 10, D = 6, xb = gx + dir * D;
  W.box(gx, ya, G, gx + 1, ya + 1, G + H + 1, M.WHITE);
  W.box(gx, yb, G, gx + 1, yb + 1, G + H + 1, M.WHITE);
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
// Mât d'éclairage : massif, fût galvanisé, échelons, rampe de six projecteurs tournée vers le terrain.
function mast(W, x, y, G, h, on, target, I) {
  W.box(x - 1, y - 1, G, x + 3, y + 3, G + 2, M.CONCRETE);
  W.box(x, y, G, x + 2, y + 2, G + h, M.METAL);
  for (let z = G + 6; z < G + h - 2; z += 3) W.set(x + 2, y, z, M.METAL_DARK);
  const tz = G + h;
  W.box(x - 5, y, tz - 1, x + 7, y + 2, tz, M.METAL_DARK);
  W.box(x - 5, y, tz + 6, x + 7, y + 2, tz + 7, M.METAL_DARK);
  W.box(x - 5, y, tz - 1, x - 4, y + 2, tz + 7, M.METAL_DARK);
  W.box(x + 6, y, tz - 1, x + 7, y + 2, tz + 7, M.METAL_DARK);
  const FL = on ? M.FLOOD : M.FLOOD_OFF;
  for (const dx of [-4, 0, 4]) for (const dz of [0, 3]) { W.box(x + dx, y + 2, tz + dz, x + dx + 3, y + 3, tz + dz + 2, FL); W.box(x + dx, y + 1, tz + dz, x + dx + 3, y + 2, tz + dz + 2, M.METAL_DARK); }
  if (on) {
    const lx = x + 1, ly = y + 3.5, lz = tz + 3;
    const ax = target[0] - lx, ay = target[1] - ly, az = target[2] - lz, al = Math.hypot(ax, ay, az);
    W.light({ x: lx, y: ly, z: lz, r: 250, fall: 1.35, cr: 0.95 * I, cg: 0.93 * I, cb: 0.86 * I, skip: 4, axis: [ax / al, ay / al, az / al], c0: 0.35, c1: 0.78, spill: 0.05 });
  }
}
// L'abri de touche en bois, ouvert au sud : bardage, poteaux, toit de tôle, sièges baquets bordeaux.
function abri(W, x0, y0, len, dep, G) {
  W.box(x0 - 1, y0 - 1, 1, x0 + len + 1, y0 + dep + 1, 2, M.CONCRETE);
  W.box(x0, y0, G, x0 + len, y0 + 1, G + 11, M.WOOD);
  W.box(x0, y0, G, x0 + 1, y0 + dep, G + 11, M.WOOD);
  W.box(x0 + len - 1, y0, G, x0 + len, y0 + dep, G + 11, M.WOOD);
  for (let x = x0; x < x0 + len; x += 9) W.box(x, y0 + dep - 1, G, x + 1, y0 + dep, G + 12, M.WOOD_DARK);
  W.box(x0 + len - 1, y0 + dep - 1, G, x0 + len, y0 + dep, G + 12, M.WOOD_DARK);
  for (let k = 0; k <= dep + 1; k++) { const z = G + 12 - Math.floor(k * 2 / (dep + 1)); W.box(x0 - 1, y0 + dep - k, z, x0 + len + 1, y0 + dep - k + 1, z + 1, M.ZINC); }
  W.box(x0 + 1, y0 + 1, G, x0 + len - 1, y0 + 3, G + 2, M.WOOD_DARK);
  for (let x = x0 + 2; x < x0 + len - 3; x += 3) { W.box(x, y0 + 1, G + 2, x + 2, y0 + 3, G + 3, M.SEAT); W.box(x, y0 + 1, G + 3, x + 2, y0 + 2, G + 5, M.SEAT); }
}
// Le minibus du club, garé le long de x, capot vers +x.
function minibus(W, x, y, zg, o = {}) {
  const P = M.CAR_BORD;
  const b = (a0, b0, z0, a1, b1, z1, m, t = 0) => W.box(x + a0, y + b0, zg + z0, x + a1, y + b1, zg + z1, m, t);
  for (const a of [4, 19]) {
    if (o.blocks) { b(a, 1, 0, a + 3, 3, 2, M.CONCRETE); b(a, 7, 0, a + 3, 9, 2, M.CONCRETE); }
    else { b(a, 0, 0, a + 4, 1, 4, M.TIRE); b(a, 9, 0, a + 4, 10, 4, M.TIRE); }
  }
  b(0, 1, 2, 26, 9, 6, P);
  b(0, 1, 6, 26, 9, 7, M.SEAT_GREY);
  b(0, 1, 7, 22, 9, 11, M.CAR_GLASS);
  for (const a of [0, 6, 11, 16, 21]) b(a, 1, 7, a + 1, 9, 11, P);
  b(0, 1, 11, 22, 9, 12, P);
  b(22, 1, 7, 24, 9, 10, M.CAR_GLASS); b(22, 1, 10, 23, 9, 11, P); b(23, 1, 10, 24, 9, 11, M.CAR_GLASS);
  b(24, 1, 6, 26, 9, 7, P);
  b(26, 1, 2, 27, 9, 4, M.CHROME); b(-1, 1, 2, 0, 9, 4, M.CHROME);
  b(26, 2, 4, 27, 3, 5, M.WHITE); b(26, 7, 4, 27, 8, 5, M.WHITE);
  b(-1, 2, 4, 0, 3, 6, M.PLASTIC_RED); b(-1, 7, 4, 0, 8, 6, M.PLASTIC_RED);
  if (o.blocks) { b(4, 1, 2, 8, 2, 4, M.METAL_DARK); b(19, 1, 2, 23, 2, 4, M.METAL_DARK); b(4, 8, 2, 8, 9, 4, M.METAL_DARK); b(19, 8, 2, 23, 9, 4, M.METAL_DARK); }
  const f = new Facade(W, LEFT, x, y + 1, 26, 8);
  f.crest(2, zg + 2, 3, 4);
  f.sign(7, zg + 6, 'LES AUBES', { fg: [0.86, 0.80, 0.62], depth: 0 });
  if (o.forSale) f.sign(1, zg + 11, 'À VENDRE', { plate: [0.86, 0.84, 0.76], plateMat: M.PAPER, fg: [0.12, 0.10, 0.10], depth: 0, padX: 1, padY: 1 });
}
// Arceau à vélos.
function rack(W, x, y, G) { W.box(x, y, G, x + 1, y + 1, G + 4, M.METAL_DARK); W.box(x + 3, y, G, x + 4, y + 1, G + 4, M.METAL_DARK); W.box(x, y, G + 4, x + 4, y + 1, G + 5, M.METAL_DARK); }
// Muret, couvertine et grille le long de l'avenue.
function grille(W, x0, x1, y, G) {
  if (x1 <= x0) return;
  W.box(x0, y, G, x1, y + 2, G + 3, M.CONCRETE);
  W.box(x0, y, G + 3, x1, y + 2, G + 4, M.STONE);
  for (let x = x0; x < x1; x += 2) W.box(x, y + 1, G + 4, x + 1, y + 2, G + 11, M.METAL_GREEN);
  W.box(x0, y + 1, G + 10, x1, y + 2, G + 11, M.METAL_GREEN);
}

// ---------------------------------------------------------------- le quartier
function build(W, ctx) {
  const { G, R } = ctx;
  const night = !!ctx.night, bad = ctx.mood === 'bad', day = !night;
  const w = 292, h = 156;
  const paint = (col, pat, extra) => W.obj(Object.assign({ type: 'esp_paint', col, pat }, extra || {}));
  const put = (def, x, y, z = G, extra) => W.sprite(Object.assign({ x, y, z }, def, extra || {}));
  const ground = (x0, y0, x1, y1, m, t = 0) => W.box(x0, y0, 1, x1, y1, 2, m, t);
  const places = [];

  // ================================================================ sol
  ground(0, 2, w, 146, M.GRAVEL);
  ground(0, 2, w, 12, M.GRASS);
  // le terrain : 204 × 112 voxels d'herbe usée, lignes à la craie (calque)
  const PX0 = 86, PY0 = 26, PX1 = 288, PY1 = 138;
  const LX0 = 98, LX1 = 278, LY0 = 33, LY1 = 131, CX = (LX0 + LX1) / 2, CY = (LY0 + LY1) / 2;
  const turf = W.obj({
    type: 'esp_turf', bad, x0: PX0, cx: CX, cy: CY, coachY: LY0 - 1,
    goals: [[LX0 + 5, CY], [LX1 - 5, CY]],
    L: { A0: 2 * LX0, A1: 2 * LX1, B0: 2 * LY0, B1: 2 * LY1 }, rc: 40, box: 52, boxW: 62, ga: 20, gaW: 36, spot: 36, arc: 32,
  });
  ground(PX0, PY0, PX1, PY1, M.GRASS, turf);
  // la haie de la limite est, la grille du quai au nord
  W.box(289, 2, G, 292, 146, G + 7, M.HEDGE);
  for (let x = 0; x < w; x += 3) W.box(x, 2, G, x + 1, 3, G + 8, M.METAL_GREEN);
  W.box(0, 2, G + 7, w, 3, G + 8, M.METAL_GREEN);
  W.box(0, 2, G + 3, w, 3, G + 4, M.METAL_GREEN);

  // ================================================================ le terrain annexe
  // main courante
  const MCX0 = 88, MCX1 = 286, MCY0 = 29, MCY1 = 135;
  const rail = (x0, y0, x1, y1) => B.railing(W, x0, y0, x1, y1, G, 5, M.METAL, 6);
  rail(MCX0, MCY0, 174, MCY0); rail(200, MCY0, MCX1, MCY0);
  rail(MCX0, MCY1, 182, MCY1); rail(192, MCY1, MCX1, MCY1);
  rail(MCX0, MCY0, MCX0, 44); rail(MCX0, 52, MCX0, MCY1); rail(MCX1, MCY0, MCX1, MCY1);
  // buts
  goal(W, LX0, Math.round(CY) - 15, Math.round(CY) + 14, G, -1, !bad);
  goal(W, LX1, Math.round(CY) - 15, Math.round(CY) + 14, G, 1, !bad);
  // deux mâts d'éclairage au nord, tournés vers le rond central
  const mastsOn = night && !bad;
  mast(W, 126, 17, G, 58, mastsOn, [CX - 18, CY + 6, G], 0.95);
  mast(W, 246, 17, G, 58, mastsOn, [CX + 18, CY + 6, G], 0.95);
  // l'abri de touche, à hauteur de la médiane
  abri(W, CX - 18, 15, 36, 9, G);
  if (night && !bad) { W.box(CX - 12, 19, G + 11, CX + 12, 20, G + 12, M.TUBE); W.light({ x: CX, y: 21.5, z: G + 9, r: 30, cr: 0.95, cg: 1.05, cb: 1.05, skip: 1.5 }); }
  places.push({ key: 'terrain', label: 'Le terrain annexe', x: CX, y: 25, z: G + 16 });
  // le sac de ballons, les mini-buts, les plots rangés près de l'abri
  if (!bad) {
    W.box(CX + 22, 21, G, CX + 25, 24, G + 3, M.BALLS); W.box(CX + 22, 21, G + 3, CX + 25, 24, G + 4, M.METAL_DARK);
    const mg = paint([0.80, 0.80, 0.76]);
    for (const mx of [CX - 34, CX - 26]) { W.box(mx, 20, G, mx + 6, 21, G + 4, M.WHITE); W.box(mx + 1, 20, G, mx + 5, 21, G + 3, 0); W.box(mx, 21, G, mx + 6, 23, G + 1, M.METAL, mg); }
  }

  // les panneaux des commerçants sur la main courante nord, tournés vers le terrain (et vers nous)
  const ads = [[94, 'GARAGE MAZURIER', [0.14, 0.24, 0.17], [0.86, 0.80, 0.62]], [132, "L'ÉCHO", [0.84, 0.80, 0.68], [0.12, 0.10, 0.10]],
    [208, 'LE CORNER', [0.16, 0.10, 0.12], [0.92, 0.48, 0.62]], [234, 'BANQUE AUBÉRIVOISE', [0.14, 0.17, 0.30], [0.86, 0.74, 0.40]]];
  for (const [ax, txt, plate, fg] of ads) {
    const nw = Math.ceil((textBitmap(txt).w + 4) / 2);
    new Facade(W, LEFT, ax, MCY0, nw, 1).sign(0, G + 6, txt, { plate, plateMat: M.METAL_DARK, fg, worn: bad ? 0.45 : 0.03 });
    for (const px of [ax, ax + nw - 1]) W.box(px, MCY0 + 1, G, px + 1, MCY0 + 2, G + 1, M.METAL_DARK);
  }
  // gourdes, caisse, plots empilés au bord de la touche (jour) ; bancs des parents au sud
  if (!bad) { B.crates(W, CX + 14, 25, G, 1, M.CRATE_GREEN); }
  for (const bx of [120, 236]) { W.box(bx, 139, G, bx + 1, 141, G + 2, M.METAL_DARK); W.box(bx + 7, 139, G, bx + 8, 141, G + 2, M.METAL_DARK); W.box(bx, 139, G + 2, bx + 8, 141, G + 3, M.WOOD); W.box(bx, 140, G + 3, bx + 8, 141, G + 5, M.WOOD); }

  // ================================================================ la friche (mauvaise saison)
  if (bad) {
    for (let y = PY0; y < PY1; y++) for (let x = PX0; x < PX1; x++) {
      const d = fbm(x / 13, y / 13, 851), e = Math.min(x - PX0, PX1 - 1 - x, y - PY0, PY1 - 1 - y), hh = hash(x, y, 852, 0);
      const p = d > 0.56 ? 0.55 * clamp((d - 0.56) * 8, 0, 1) : e < 4 ? 0.35 : 0.025;
      if (hh < p) { W.set(x, y, G, M.WEED); if (hh < p * 0.35) W.set(x, y, G + 1, M.WEED); if (hh < p * 0.08) W.set(x, y, G + 2, M.WEED); }
    }
    // taupinières
    for (let i = 0; i < 26; i++) { const x = PX0 + 6 + Math.floor(R() * (PX1 - PX0 - 12)), y = PY0 + 6 + Math.floor(R() * (PY1 - PY0 - 12)); W.box(x, y, G, x + 2, y + 2, G + 1, M.SOIL); W.set(x, y, G + 1, M.SOIL); }
    for (let x = 0; x < w; x += 1) { if (hash(x, 3, 853, 0) < 0.5) W.set(x, 3, G, M.WEED); if (hash(x, 145, 853, 0) < 0.6) W.set(x, 145, G, M.WEED); }
  }

  // ================================================================ le centre de formation
  const frameTag = paint([0.25, 0.31, 0.40], null, { top: [0.38, 0.38, 0.37] });
  const z1 = G + 1, mh = 13, z2 = z1 + mh;
  // --- le bâtiment à étage (dortoirs, salles de cours) au fond
  const MB = { x: 4, y: 20, w: 56, d: 28 };
  W.box(MB.x - 1, MB.y - 1, 1, MB.x + MB.w + 1, MB.y + MB.d + 1, 2, M.CONCRETE);
  W.box(MB.x, MB.y, G, MB.x + MB.w, MB.y + MB.d, z1, M.METAL_DARK);
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) for (let lv = 0; lv < 2; lv++) prefabModule(W, MB.x + i * 28, MB.y + j * 14, 28, 14, lv ? z2 : z1, mh, frameTag);
  const fS = new Facade(W, LEFT, MB.x, MB.y, MB.w, MB.d), fE = new Facade(W, RIGHT, MB.x, MB.y, MB.w, MB.d);
  const winO = (st, extra) => Object.assign({ state: st, sill: false, lintel: false, frame: [0.74, 0.74, 0.70] }, extra || {});
  const dorm = s => !night || bad ? 'dark' : (hash(s, 7, 861, 0) < 0.55 ? 'lit' : hash(s, 8, 861, 0) < 0.4 ? 'tv' : 'dark');
  for (const s of [12, 20, 31, 48]) fS.window(s, z1 + 5, 6, 5, winO(night && !bad && (s === 12 || s === 31) ? 'office' : 'dark'));
  for (const s of [3, 12, 20, 31, 48]) fS.window(s, z2 + 4, 6, 6, winO(dorm(s), { curtain: [[0.55, 0.25, 0.22], [0.30, 0.38, 0.55], [0.55, 0.50, 0.32]][s % 3] }));
  fS.door(4, z1, 5, 10, { frame: false, mat: M.METAL });
  fS.door(41, z1, 5, 10, { frame: false, mat: M.METAL });
  fS.door(41, z2, 5, 10, { frame: false, mat: M.METAL });
  for (const s of [4, 16]) { fE.window(s, z1 + 5, 6, 5, winO(night && !bad && s === 16 ? 'office' : 'dark')); fE.window(s, z2 + 4, 6, 6, winO(dorm(s + 100))); }
  if (!bad) fE.crest(10, z2 + 3, 4, 7);
  // la coursive de l'étage et son escalier
  W.box(MB.x, 48, z2 - 1, 64, 52, z2, M.METAL_DARK);
  B.railing(W, MB.x, 51, 63, 51, z2, 5, M.METAL, 3);
  for (const x of [MB.x, 18, 32, 46]) W.box(x, 51, G, x + 1, 52, z2 - 1, M.METAL);
  for (let k = 0; k < mh; k++) W.box(60, 52 + k, z2 - 2 - k, 64, 53 + k, z2 - 1 - k, M.METAL_DARK);
  W.box(63, 52, G, 64, 53, z2 - 1, M.METAL);
  for (let k = 0; k <= mh; k += 2) W.box(63, 52 + k, z2 - 1 - k, 64, 53 + k, z2 + 4 - k, M.METAL);
  for (let k = 0; k < mh; k++) W.set(63, 52 + k, z2 + 4 - k, M.METAL);
  W.box(MB.x - 1, 50, G, 1 + MB.x, 52, G + 1, M.CONCRETE);
  if (night) { fS.set(43, z2 + 11, -1, M.BULB); W.light(Object.assign(fS.front(43, z2 + 10, 3), { r: 26, cr: 0.8, cg: 0.55, cb: 0.28, skip: 1.5 })); }
  // --- le préfabriqué de plain-pied devant : la cantine de Marinette et l'accueil
  const P2 = { x: 6, y: 72, w: 60, d: 14 };
  W.box(P2.x - 1, P2.y - 1, 1, P2.x + P2.w + 1, P2.y + P2.d + 1, 2, M.CONCRETE);
  W.box(P2.x, P2.y, G, P2.x + P2.w, P2.y + P2.d, z1, M.METAL_DARK);
  prefabModule(W, P2.x, P2.y, 30, 14, z1, mh, frameTag); prefabModule(W, P2.x + 30, P2.y, 30, 14, z1, mh, frameTag);
  const f2 = new Facade(W, LEFT, P2.x, P2.y, P2.w, P2.d), f2e = new Facade(W, RIGHT, P2.x, P2.y, P2.w, P2.d);
  if (bad) W.box(P2.x + 1, P2.y + P2.d - 1, z1 + 1, P2.x + P2.w - 1, P2.y + P2.d, z2 - 1, M.ESTQ_CLAD, W.obj({ type: 'esp_graff', face: LEFT, a0: P2.x + 2, zTop: z2 - 1, text: 'AUBES 91', scale: 3, col: [0.30, 0.62, 0.38], seed: 3 }));
  const lit2 = night && !bad;
  f2.door(5, z1, 5, 10, { frame: false, mat: bad ? M.METAL_DARK : M.METAL });
  f2.window(13, z1 + 5, 6, 5, winO(lit2 ? 'lit' : 'dark', { col: [1.0, 0.82, 0.55] }));
  f2.window(21, z1 + 5, 6, 5, winO(lit2 ? 'lit' : 'dark', { col: [1.0, 0.82, 0.55] }));
  f2.window(34, z1 + 5, 6, 5, winO(lit2 ? 'office' : 'dark', { sil: lit2 ? 'head' : null, silX: 4 }));
  f2.door(44, z1, 5, 10, { frame: false, kind: bad ? null : 'door', mat: M.METAL_DARK });
  f2.window(52, z1 + 5, 6, 5, winO(lit2 ? 'office' : 'dark'));
  f2e.window(4, z1 + 5, 6, 5, winO('dark'));
  if (bad) { f2.rect(21, z1 + 5, 27, z1 + 10, 0, M.WOOD); f2.rect(52, z1 + 5, 58, z1 + 10, 0, M.WOOD); }
  f2.sign(2, z2 + 6, 'CANTINE', { plate: [0.42, 0.11, 0.16], plateMat: M.METAL_BORD, fg: [0.86, 0.80, 0.62], depth: 0 });
  f2.sign(38, z2 + 6, 'ACCUEIL', { plate: [0.42, 0.11, 0.16], plateMat: M.METAL_BORD, fg: [0.86, 0.80, 0.62], depth: 0 });
  for (const s of [3, 42]) { f2.rect(s, z1 + 11, s + 9, z1 + 12, -1, M.METAL); f2.rect(s, z1 + 11, s + 9, z1 + 12, -2, M.METAL); }
  for (const s of [4, 43]) { f2.rect(s, G, s + 7, z1, -1, M.METAL_DARK); f2.rect(s, G, s + 7, z1 - 1, -2, M.METAL_DARK); }
  if (night) for (const s of [7, 46]) { if (bad && s === 7) continue; f2.set(s, z1 + 13, -1, M.BULB); W.light(Object.assign(f2.front(s, z1 + 12, 3), { r: 24, cr: 0.8, cg: 0.55, cb: 0.28, skip: 1.5 })); }
  places.push({ key: 'centre', label: 'Le centre de formation', x: P2.x + 46.5, y: P2.y + P2.d, z: z1 + 15 });
  // --- le local du matériel : parpaings, tôle, double porte bordeaux
  const LM = { x: 64, y: 6, w: 18, d: 22 };
  W.box(LM.x, LM.y, G, LM.x + LM.w, LM.y + LM.d, G + 15, M.CONCRETE);
  for (let k = 0; k <= LM.d + 1; k++) W.box(LM.x - 1, LM.y + LM.d - k, G + 15 + Math.floor(k / 6), LM.x + LM.w + 1, LM.y + LM.d - k + 1, G + 16 + Math.floor(k / 6), M.ZINC);
  const fl = new Facade(W, LEFT, LM.x, LM.y, LM.w, LM.d), fle = new Facade(W, RIGHT, LM.x, LM.y, LM.w, LM.d);
  fl.door(5, G, 8, 10, { frame: false, mat: M.METAL_BORD });
  fl.rect(9, G, 10, G + 10, 2, M.METAL_DARK);
  fl.sign(1, G + 14, 'MATÉRIEL', { fg: [0.86, 0.82, 0.70], depth: 0, worn: 0.08 });
  fle.window(8, G + 6, 4, 3, { state: night && !bad ? 'lit' : 'dark', sill: false, lintel: false, frame: [0.2, 0.2, 0.2], spill: false });
  if (night && !bad) { fl.set(9, G + 15, -1, M.BULB); W.light(Object.assign(fl.front(9, G + 11, 3), { r: 22, cr: 0.8, cg: 0.55, cb: 0.28, skip: 1.5 })); }
  places.push({ key: 'materiel', label: 'Le local du matériel', x: LM.x + 9, y: LM.y + LM.d, z: G + 17 });
  // devant le local : traceuse, râteaux, plots empilés, filet de ballons
  W.box(LM.x + 14, LM.y + LM.d + 1, G, LM.x + 17, LM.y + LM.d + 4, G + 3, M.METAL); W.box(LM.x + 15, LM.y + LM.d + 1, G + 3, LM.x + 16, LM.y + LM.d + 6, G + 4, M.METAL_DARK);
  W.box(LM.x + 14, LM.y + LM.d + 1, G, LM.x + 15, LM.y + LM.d + 2, G + 1, M.TIRE); W.box(LM.x + 16, LM.y + LM.d + 3, G, LM.x + 17, LM.y + LM.d + 4, G + 1, M.TIRE);
  for (const dx of [1, 2]) W.box(LM.x + dx, LM.y + LM.d, G, LM.x + dx + 1, LM.y + LM.d + 1, G + 9, M.WOOD);
  if (!bad) { W.box(LM.x + 1, LM.y + LM.d + 2, G, LM.x + 4, LM.y + LM.d + 5, G + 3, M.BALLS); }

  // le vieux rouleau du terrain et le mât du drapeau
  for (let k = 0; k < 7; k++) { W.box(72, 40 + k, G, 76, 41 + k, G + 4, M.METAL_DARK); }
  W.box(73, 40, G + 1, 75, 47, G + 3, M.METAL); W.box(73, 37, G + 3, 75, 40, G + 4, M.METAL_DARK); W.box(73, 34, G + 4, 75, 37, G + 5, M.METAL_DARK);
  W.box(70, 56, G, 71, 57, G + 44, M.METAL);
  if (!bad) { W.box(71, 56, G + 37, 79, 57, G + 40, M.METAL_BORD); W.box(71, 56, G + 40, 79, 57, G + 43, M.SEAT_GREY); }
  else { W.box(71, 56, G + 39, 74, 57, G + 43, M.SEAT_GREY); }

  // ================================================================ cour, parking, minibus, vélos
  ground(0, 48, 82, 72, M.GRAVEL);
  ground(0, 88, 82, 146, M.ASPHALT);
  ground(0, 86, 82, 88, M.CURB);
  for (let x = 2; x < 72; x += 10) W.box(x, 90, 1, x + 1, 110, 2, M.ROADLINE);
  const cars = bad ? [[23, M.CAR_BEIGE]] : night ? [[3, M.CAR_BLUE], [13, M.CAR_WHITE], [33, M.CAR_BEIGE], [53, M.CAR_BORD]] : [[3, M.CAR_BLUE], [33, M.CAR_BEIGE]];
  for (const [cx, m] of cars) B.car(W, cx + 0.5, 90, G, 'y', m);
  minibus(W, 2, 128, G, { blocks: bad, forSale: bad });
  // le portail sur l'avenue : piliers, portique « CENTRE DE FORMATION »
  grille(W, 0, 38, 146, G); grille(W, 78, 184, 146, G); grille(W, 190, w, 146, G);
  for (const px of [38, 74]) { W.box(px, 145, G, px + 4, 148, G + 20, M.BRICK); W.box(px - 1, 144, G + 19, px + 5, 149, G + 20, M.STONE); }
  W.box(35, 146, G + 20, 81, 148, G + 31, M.WHITE);
  W.box(34, 145, G + 31, 82, 149, G + 32, M.METAL_BORD);
  W.box(35, 147, G + 20, 81, 148, G + 21, M.METAL_BORD);
  const gate = new Facade(W, LEFT, 35, 146, 46, 2);
  gate.sign(8, G + 30, 'RACING AUBÉRIVE', { fg: [0.42, 0.10, 0.16], depth: 0 });
  gate.sign(4, G + 26, 'CENTRE DE FORMATION', { fg: [0.20, 0.18, 0.17], depth: 0 });
  gate.crest(3, G + 26, 3, 5); gate.crest(40, G + 26, 3, 5);
  if (night) for (const px of bad ? [71] : [44, 71]) { W.box(px, 149, G + 31, px + 2, 150, G + 32, M.BULB); W.light({ x: px + 1, y: 152, z: G + 30, r: 30, cr: 0.85, cg: 0.6, cb: 0.3, skip: 1.5 }); }
  // vantaux : ouverts sauf en mauvaise saison (fermés, chaîne et banderole)
  if (bad) {
    for (let x = 42; x < 74; x += 2) W.box(x, 146, G, x + 1, 147, G + 12, M.METAL_GREEN);
    W.box(42, 146, G + 1, 74, 147, G + 2, M.METAL_GREEN); W.box(42, 146, G + 11, 74, 147, G + 12, M.METAL_GREEN);
    W.box(46, 147, G + 4, 70, 148, G + 9, M.CANVAS);
    new Facade(W, LEFT, 46, 147, 24, 1).sign(0, G + 9, 'CENTRE FERMÉ', { fg: [0.45, 0.08, 0.12], depth: 0 });
  } else {
    for (let x = 80; x < 110; x += 2) W.box(x, 144, G, x + 1, 145, G + 12, M.METAL_GREEN);
    W.box(80, 144, G + 1, 110, 145, G + 2, M.METAL_GREEN); W.box(80, 144, G + 11, 110, 145, G + 12, M.METAL_GREEN);
  }
  // le panneau d'affichage du club, côté trottoir
  W.box(84, 148, G, 85, 149, G + 12, M.WOOD_DARK); W.box(105, 148, G, 106, 149, G + 12, M.WOOD_DARK);
  W.box(84, 148, G + 4, 106, 149, G + 13, M.WOOD_DARK);
  const pb = new Facade(W, LEFT, 85, 148, 20, 1);
  pb.poster(1, G + 5, 9, 7, { title: 'U17', bg: [0.86, 0.84, 0.76], fg: [0.42, 0.10, 0.16], band: [0.42, 0.10, 0.16], seed: 21, torn: bad ? 0.4 : 0.02 });
  pb.poster(11, G + 5, 8, 7, { title: '19H', bg: [0.80, 0.78, 0.70], fg: [0.12, 0.10, 0.10], seed: 22, torn: bad ? 0.5 : 0.05 });
  // portillon du terrain
  for (const px of [184, 189]) W.box(px, 145, G, px + 1, 148, G + 13, M.CONCRETE);
  W.box(184, 146, G + 13, 190, 147, G + 14, M.METAL_GREEN);
  // vélos des gamins, au râtelier devant l'accueil
  for (let x = 40; x < 66; x += 6) rack(W, x, 88, G);
  // bancs du parking et poubelle
  B.bin(W, 2, 112, G);

  // la table de ping-pong en béton de la cour, un banc
  const ppg = paint([0.20, 0.38, 0.30], null, { top: [0.22, 0.42, 0.33] });
  W.box(22, 58, G, 24, 64, G + 3, M.CONCRETE); W.box(31, 58, G, 33, 64, G + 3, M.CONCRETE);
  W.box(19, 57, G + 3, 36, 65, G + 4, M.CONCRETE, ppg);
  W.box(27, 57, G + 4, 28, 65, G + 5, M.METAL_DARK);
  W.box(19, 61, G + 3, 36, 61, G + 4, M.WHITE);
  for (const bx of [8]) { W.box(bx, 54, G, bx + 1, 56, G + 2, M.METAL_DARK); W.box(bx + 7, 54, G, bx + 8, 56, G + 2, M.METAL_DARK); W.box(bx, 54, G + 2, bx + 8, 56, G + 3, M.WOOD); W.box(bx, 54, G + 3, bx + 8, 55, G + 5, M.WOOD); }
  // sur le toit du bâtiment à étage : aérateurs, antenne
  for (const [vx, vy] of [[12, 26], [40, 36]]) W.box(vx, vy, z2 + mh, vx + 4, vy + 3, z2 + mh + 2, M.METAL);
  B.antenna(W, 30, 30, z2 + mh, 9);
  // le trottoir de l'avenue : abribus, jeunes arbres, banc, corbeilles, bornes
  if (!bad || day) B.busShelter(W, 252, 149, G, 16, { poster: { title: 'DERBY', bg: [0.80, 0.76, 0.66], fg: [0.42, 0.10, 0.16], band: [0.42, 0.10, 0.16], seed: 61, lit: night ? 0.7 : 0 } });
  else B.busShelter(W, 252, 149, G, 16, { poster: { title: 'DERBY', bg: [0.80, 0.76, 0.66], fg: [0.42, 0.10, 0.16], seed: 61, torn: 0.5 } });
  for (const tx of [100, 168, 206]) { roundTree(W, tx, 150, G, 3.4, 9, 40 + tx, M.FOLIAGE); W.box(tx - 1, 149, 1, tx + 3, 153, 2, M.METAL_DARK); leaves(W, tx + 1, 151, 8, 0.6, w, h); }
  W.box(140, 150, G, 141, 152, G + 2, M.METAL_DARK); W.box(147, 150, G, 148, 152, G + 2, M.METAL_DARK); W.box(140, 150, G + 2, 148, 152, G + 3, M.WOOD); W.box(140, 150, G + 3, 148, 151, G + 5, M.WOOD);
  B.bin(W, 150, 150, G); B.bin(W, 34, 150, G);
  for (const bx of [80, 86, 92]) B.bollard(W, bx, 153, G);

  // ================================================================ arbres, lampadaires
  for (const [px, sd] of [[100, 3], [118, 5], [148, 7], [214, 9], [232, 11], [262, 13], [280, 15]]) { poplar(W, px, 5, G, sd, 34 + (sd % 3) * 4); leaves(W, px + 1, 6, 12, 0.5, w, h); }
  roundTree(W, 14, 9, G, 6.5, 9, 31); leaves(W, 15, 10, 14, 0.9, w, h);
  roundTree(W, 44, 10, G, 5.5, 8, 33); leaves(W, 45, 11, 12, 0.7, w, h);
  B.streetLamp(W, 12, 149, G, 0, 1, { on: night });
  B.streetLamp(W, 120, 149, G, 0, 1, { on: night && !bad });
  B.streetLamp(W, 230, 149, G, 0, 1, { on: night });
  B.streetLamp(W, 80, 104, G, -1, 0, { on: night && !bad, h: 20, r: 50, I: 1.6 });

  // ================================================================ les gens
  if (day && !bad) {
    // l'entraînement des U17 avec Vukić
    put(sprites.VUKIC, CX - 6, LY1 - 4);
    // le toro dans la moitié ouest : un cercle de coupelles, cinq autour, deux chasubles au milieu
    const tx = 140, ty = 68;
    for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; put(sprites.SAUCER, tx + Math.cos(a) * 11, ty + Math.sin(a) * 11); }
    [[sprites.U17_A, 0.3], [sprites.U17_RUN, 1.6], [sprites.U17_RUN_M, 2.9], [sprites.MBAKO, 4.2], [sprites.U17_A2, 5.4]].forEach(([d, a]) => put(d, tx + Math.cos(a) * 9, ty + Math.sin(a) * 9));
    put(sprites.U17_BIB, tx - 1, ty + 1); put(sprites.U17_BIB2, tx + 3, ty - 2); put(sprites.BALL, tx + 4, ty + 3);
    // le slalom le long de la touche sud
    for (let i = 0; i < 9; i++) put(sprites.CONE, 206 + i * 6, LY1 - 9);
    put(sprites.U17_RUN, 219, LY1 - 8); put(sprites.BALL, 221, LY1 - 7);
    put(sprites.U17_A3, 200, LY1 - 12); put(sprites.U17_BIB3, 197, LY1 - 9);
    // les frappes au but est
    put(sprites.KEEPER, LX1 - 8, CY + 1);
    put(sprites.U17_RUN_M, LX1 - 30, CY + 6); put(sprites.BALL, LX1 - 27, CY + 7);
    for (const [bx, by] of [[LX1 - 2, CY - 9], [LX1 + 3, CY + 4], [LX1 - 40, CY + 16], [LX1 - 44, CY + 18], [LX0 + 2, CY + 9], [CX - 4, LY0 + 6]]) put(sprites.BALL, bx, by);
    // les parents derrière la main courante, Marinette, le chien de Lulu
    put(S.FAN, 150, 139); put(S.WALKER2, 160, 140); put(S.COAT, 242, 139.5);
    put(S.WALKER, 259, 152); put(sprites.U17_TRACK, 262.5, 153);
    put(sprites.MARINETTE, P2.x + 8, P2.y + P2.d + 3);
    put(sprites.DOG, LM.x + 9, LM.y + LM.d + 8);
    put(sprites.U17_TRACK, 30, 51, z2);
    for (const [bx, d] of [[41.5, sprites.BIKE_R], [47.5, sprites.BIKE_B], [53.5, sprites.BIKE_G], [59.5, sprites.BIKE_R]]) put(d, bx, 88.5);
  } else if (night && !bad) {
    // la séance des seniors sous les mâts : un jeu réduit, Vecchio dans les buts, Bréhaut au milieu
    put(sprites.VECCHIO, LX1 - 9, CY + 2);
    put(sprites.KEEPER_SR, LX0 + 7, CY - 1);
    put(S.BREHAUT, CX + 6, CY + 2);
    put(S.PLAYER, CX + 22, CY - 10); put(sprites.SR_B, CX + 34, CY + 14); put(sprites.SR_C, CX - 14, CY - 18);
    put(sprites.SR_BIB, CX + 12, CY + 9); put(sprites.SR_BIB2, CX - 20, CY + 12); put(sprites.SR_BIB3, CX + 40, CY - 4); put(sprites.SR_D, CX - 36, CY - 4);
    put(sprites.BALL, CX + 9, CY + 4);
    put(sprites.VUKIC, CX - 2, LY0 - 2);
    put(S.COACH_SIT, CX - 10, 18.5); put(S.COACH_SIT, CX + 4, 18.5);
    for (const [bx, d] of [[47.5, sprites.BIKE_B]]) put(d, bx, 88.5);
  } else if (bad && day) {
    put(sprites.U17_TRACK, 120, 141); put(sprites.BALL, 123, 142);
    put(S.COAT, 20, 136);
    put(sprites.DOG, 170, 142);
  } else {
    put(S.CAT, 22, 129, G + 12);
  }
  return { places };
}

module.exports = { w: 292, h: 156, seed: 1991, build };
Object.defineProperty(module.exports, 'sprites', { value: sprites, enumerable: false }); // pour la planche de contrôle
