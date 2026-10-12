'use strict';
// La grande zone jouable d'Aubérive : 200 m × 200 m au niveau de détail de la vue de jeu.
// Le maître pose le sol, les rues, la rivière, les quais, les ponts et le quartier du stade ;
// chaque autre quartier vient de son fichier district_*.js, posé à sa place.
const fs = require('fs');
const path = require('path');
const E = require('./engine');
const { M } = require('./mats');
const B = require('./build');
const SP = require('./sprites');
require('./diorama');
const { buildQuartier, nightSky, daySky } = require('./scene_quartier');
const { lighting } = require('./presets');
const { World, LEFT, RIGHT, TOP, hash, fbm, mod, clamp, material, rng } = E;
const { Facade } = B;

const N = 1000, ZL = 10, ZMAX = 110;
const QX = 330, QY = 420; // le quartier du stade de la Rive
const RIVER = [290, 356]; // le lit de la Rive

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
M.QUAY_STONE = material('pierre de quai', c => {
  if (c.face === TOP) { rgb(c, 0.50, 0.48, 0.44); if (E.mod(c.a + c.b, 7) === 0) mul(c, 0.88); return; }
  const course = Math.floor(c.b / 4), off = (course & 1) * 5;
  const la = mod(c.a + off, 10), lb = mod(c.b, 4);
  if (la === 0 || lb === 0) rgb(c, 0.30, 0.29, 0.27);
  else { const h = hash(Math.floor((c.a + off) / 10), course, 3, 9); const k = 0.8 + h * 0.3; rgb(c, 0.47 * k, 0.45 * k, 0.41 * k); }
  if (c.hz < -5.5) { c.cr *= 0.55; c.cg *= 0.68; c.cb *= 0.55; }
  else if (c.hz < -3 && hash(Math.floor(c.a / 2), 0, 4, 9) < 0.35) { c.cr *= 0.75; c.cg *= 0.85; c.cb *= 0.72; }
});
// Les reflets des lumières de la rive d'en face : une traînée verticale de tirets qui tremblent,
// posée sur l'eau là où le rayon réfléchi irait chercher la lampe (calculée après la construction).
const GLINTS = [];
M.RIVER2 = material('la Rive', c => {
  rgb(c, 0.045, 0.06, 0.065);
  if (c.face !== TOP) return;
  c.wet = 0.97;
  if (mod(Math.floor(c.hy * 1.5 + 2 * Math.sin(c.hx / 9)), 9) === 0) rgb(c, 0.08, 0.10, 0.10);
  const d = c.hx - c.hy, sum = c.hx + c.hy;
  for (const g of GLINTS) {
    const dd = d - g.d, ds = sum - g.s;
    if (dd > 6 || dd < -6 || ds > g.len || ds < -g.len) continue;
    // des tirets d'un pixel, un rang sur deux, plus larges près de la lampe
    const row = Math.floor(ds), fade = 1 - Math.abs(ds) / g.len;
    if ((row & 1) || hash(row, g.id, 7, 3) < 0.22) continue;
    const hw = 0.5 + fade * (0.6 + 2.4 * hash(row, g.id, 5, 3)), off = (hash(row, g.id, 6, 3) - 0.5) * 1.6;
    if (Math.abs(dd - off) > hw) continue;
    const e = g.k * (0.25 + 0.75 * fade) * (0.6 + 0.4 * hash(row, g.id, 8, 3));
    c.er += g.c[0] * e; c.eg += g.c[1] * e; c.eb += g.c[2] * e;
  }
});
M.HULL = material('coque de péniche', c => {
  rgb(c, 0.08, 0.085, 0.09);
  if (c.face !== TOP && c.hz > -5.4 && c.hz < -4.6) rgb(c, 0.50, 0.12, 0.12);
  if (c.face === TOP) rgb(c, 0.30, 0.22, 0.15);
});
M.BRIDGE_STONE = material('pierre du pont', c => {
  if (c.face === TOP) { rgb(c, 0.52, 0.49, 0.44); return; }
  const course = Math.floor(c.b / 5), off = (course & 1) * 4;
  const la = mod(c.a + off, 8), lb = mod(c.b, 5);
  if (la === 0 || lb === 0) rgb(c, 0.34, 0.32, 0.29); else { const h = hash(Math.floor((c.a + off) / 8), course, 5, 9); const k = 0.82 + h * 0.28; rgb(c, 0.56 * k, 0.53 * k, 0.47 * k); }
  if (c.hz < -5) { c.cr *= 0.6; c.cg *= 0.7; c.cb *= 0.6; }
});

const DISTRICTS = [
  { file: 'district_vieilleville.js', x: 0, y: 0 },
  { file: 'district_sport.js', x: 708, y: 420 },
  { file: 'district_sante.js', x: 708, y: 628 },
  { file: 'district_cimetiere.js', x: 0, y: 420 },
  { file: 'district_friche.js', x: 0, y: 628 },
  { file: 'district_residentiel.js', x: 0, y: 812 },
];
// les rues du maître : [axe, début, fin (chaussée), étendue min, étendue max]
const ROADS = [
  ['x', 234, 262, 0, N],          // quai nord
  ['x', 384, 412, 0, N],          // quai sud
  ['x', 584, 620, 0, QX], ['x', 584, 620, QX + 340, N], // avenue du Stade (hors quartier)
  ['x', 768, 804, 0, N],          // boulevard
  ['y', 496, 524, 226, 286], ['y', 496, 524, 360, QY], ['y', 496, 524, 760, 812], // rue du Stade
  ['y', 300, 322, 412, 812],      // rue de l'Ouest
  ['y', 678, 700, 412, 812],      // rue de l'Est
];

function buildZone(o = {}) {
  const night = o.time !== 'day', bad = o.mood === 'bad';
  const R = rng(4404);
  const W = new World(N, N, ZMAX, ZL);
  W.baseWet = night ? 0.16 : 0.06;
  W.box(0, 0, -10, N, N, 0, M.SOIL);
  W.box(0, 0, 0, N, N, 2, M.SIDEWALK);
  // la chaussée
  for (const [ax, a, b, c0, c1] of ROADS) {
    if (ax === 'x') { W.box(c0, a, 0, c1, b, 2, 0); W.box(c0, a, 0, c1, b, 1, M.ASPHALT); }
    else { W.box(a, c0, 0, b, c1, 2, 0); W.box(a, c0, 0, b, c1, 1, M.ASPHALT); }
  }
  // bordures et caniveaux là où le trottoir touche la chaussée
  const top = (x, y) => W.get(x, y, 1) ? 2 : W.get(x, y, 0) === M.ASPHALT ? 1 : 0;
  for (let y = 1; y < N - 1; y++) for (let x = 1; x < N - 1; x++) {
    const t = top(x, y);
    if (t === 2 && W.get(x, y, 1) === M.SIDEWALK && (top(x + 1, y) === 1 || top(x - 1, y) === 1 || top(x, y + 1) === 1 || top(x, y - 1) === 1)) { W.set(x, y, 1, M.CURB); W.set(x, y, 0, M.CURB); }
  }
  for (let y = 1; y < N - 1; y++) for (let x = 1; x < N - 1; x++) {
    if (top(x, y) === 1 && W.get(x, y, 0) === M.ASPHALT && (W.get(x + 1, y, 1) === M.CURB || W.get(x - 1, y, 1) === M.CURB || W.get(x, y + 1, 1) === M.CURB || W.get(x, y - 1, 1) === M.CURB)) W.set(x, y, 0, M.GUTTER);
  }
  // les lignes : axe en tirets hors carrefours
  const inRoad = (x, y, skip) => ROADS.some(r => r !== skip && (r[0] === 'x' ? (y >= r[1] && y < r[2] && x >= r[3] && x < r[4]) : (x >= r[1] && x < r[2] && y >= r[3] && y < r[4])));
  for (const r of ROADS) {
    const [ax, a, b, c0, c1] = r; const mid = Math.floor((a + b) / 2);
    for (let t = c0; t < c1; t += 16) for (let k = 0; k < 10; k++) {
      const x = ax === 'x' ? t + k : mid, y = ax === 'x' ? mid : t + k;
      if (x >= c1 && ax === 'x' || y >= c1 && ax === 'y') break;
      if (inRoad(x, y, r)) continue;
      if (ax === 'x') { W.set(x, mid - 1, 0, M.ROADLINE); W.set(x, mid, 0, M.ROADLINE); } else { W.set(mid - 1, y, 0, M.ROADLINE); W.set(mid, y, 0, M.ROADLINE); }
    }
  }
  // passages piétons aux carrefours du maître
  const zebraX = (x0, x1, y0, y1) => { for (let y = y0; y < y1; y += 4) W.box(x0, y, 0, x1, y + 2, 1, M.ROADLINE); };
  const zebraY = (x0, x1, y0, y1) => { for (let x = x0; x < x1; x += 4) W.box(x, y0, 0, x + 2, y1, 1, M.ROADLINE); };
  zebraX(282, 292, 586, 618);
  zebraX(708, 718, 586, 618); zebraY(300, 322, 572, 582); zebraY(678, 700, 572, 582);
  zebraX(484, 494, 770, 802); zebraX(526, 536, 770, 802); zebraY(496, 524, 750, 760);
  zebraY(496, 524, 414, 420);

  // ------------------------------------------------ la Rive : lit, quais, bas-port, péniche, ponts, promenades
  W.box(0, RIVER[0], -7, N, RIVER[1], 2, 0);
  W.box(0, RIVER[0], -8, N, RIVER[1], -7, M.RIVER2);
  W.box(0, RIVER[0] - 4, -8, N, RIVER[0], 2, M.QUAY_STONE);
  W.box(0, RIVER[1], -8, N, RIVER[1] + 4, 2, M.QUAY_STONE);
  // promenades (gravier, platanes, bancs, lanternes)
  W.box(0, 270, 1, N, RIVER[0] - 4, 2, M.GRAVEL); W.box(0, RIVER[1] + 4, 1, N, 376, 2, M.GRAVEL);
  B.railing(W, 0, RIVER[0] - 2, N - 1, RIVER[0] - 2, 2, 4, M.METAL_DARK, 6);
  B.railing(W, 0, RIVER[1] + 1, N - 1, RIVER[1] + 1, 2, 4, M.METAL_DARK, 6);
  for (let x = 20; x < N - 10; x += 46) {
    if (x > 470 && x < 545) continue;
    B.planeTree(W, x, 276, 2, { seed: 100 + x, trunk: 15, r: 8.5, leafR: 16 });
    B.planeTree(W, x + 23, 366, 2, { seed: 200 + x, trunk: 15, r: 8.5, leafR: 16 });
  }
  for (let x = 44; x < N - 20; x += 92) { if (x > 460 && x < 550) continue; B.bench(W, x, 282, 2, 'x'); B.bench(W, x + 30, 362, 2, 'x'); }
  for (let x = 6; x < N; x += 60) { if (x > 470 && x < 545) continue; B.streetLamp(W, x, 284, 2, 0, -1, { on: night, I: 1.8, r: 56, h: 18 }); B.streetLamp(W, x + 30, 371, 2, 0, -1, { on: night, I: 1.8, r: 56, h: 18 }); }
  // des lanternes scellées dans le mur du quai nord, juste au-dessus de l'eau : leurs reflets tremblent
  for (let x = 40; x < N - 20; x += 52) {
    if ((x > 470 && x < 545) || (x > 556 && x < 924) || (x > 214 && x < 240)) continue;
    W.box(x, RIVER[0], -1, x + 1, RIVER[0] + 2, 0, M.METAL_DARK); W.set(x, RIVER[0] + 1, -2, M.BULB);
    if (night) W.light({ x: x + 0.5, y: RIVER[0] + 2.2, z: -1.6, r: 22, cr: 0.95, cg: 0.66, cb: 0.32, skip: 1.2 });
  }
  // le bas-port et ses escaliers, côté nord
  W.box(560, RIVER[0], -8, 920, RIVER[0] + 12, -5, M.QUAY_STONE);
  for (let k = 0; k < 7; k++) W.box(546 + 2 * k, RIVER[0], -8, 548 + 2 * k, RIVER[0] + 12, 2 - k, M.QUAY_STONE);
  for (let x = 600; x < 900; x += 40) W.box(x, RIVER[0] + 9, -5, x + 2, RIVER[0] + 11, -3, M.METAL_DARK);
  for (const x of [580, 700, 860]) B.streetLamp(W, x, RIVER[0] + 2, -5, 0, 1, { on: night, I: 1.4, r: 40, h: 14 });
  // la péniche amarrée
  {
    const x0 = 620, x1 = 800, y0 = RIVER[0] + 13, y1 = RIVER[0] + 31;
    for (let x = x0; x < x1; x++) { const taper = Math.max(0, Math.max(x0 + 8 - x, x - (x1 - 8))); W.box(x, y0 + Math.floor(taper / 2), -8, x + 1, y1 - Math.floor(taper / 2), -4, M.HULL); }
    W.box(640, y0 + 3, -4, 760, y1 - 3, 2, M.WOOD);
    W.box(638, y0 + 2, 2, 762, y1 - 2, 3, M.WOOD_DARK);
    const cab = new Facade(W, LEFT, 640, y0 + 3, 120, y1 - y0 - 6);
    for (let s = 6; s < 116; s += 14) cab.window(s, -3, 5, 4, { state: night && hash(s, 1, 2, 3) < 0.6 ? 'lit' : 'dark', sill: false, lintel: false, curtain: [0.6, 0.3, 0.2], spill: night });
    W.box(770, y0 + 2, -4, 792, y1 - 2, 6, M.WOOD_DARK); W.box(768, y0 + 1, 6, 794, y1 - 1, 7, M.METAL);
    const wh = new Facade(W, LEFT, 770, y0 + 2, 22, y1 - y0 - 4); wh.window(4, 0, 14, 4, { state: night ? 'lit' : 'dark', sill: false, lintel: false, spill: night });
    const hull = new Facade(W, LEFT, x0 + 8, y0, x1 - x0 - 16, y1 - y0); hull.sign(70, -4, 'LA BELLE AUBE', { fg: [0.85, 0.80, 0.62], depth: 0 });
    for (let x = 650; x < 750; x += 12) W.box(x, y1 - 4, 2, x + 2, y1 - 2, 4, M.HEDGE);
    B.moped(W, 700, y0 + 5, 2, 'x');
    if (night) W.light({ x: 781, y: y1 + 2, z: 2, r: 30, cr: 0.75, cg: 0.52, cb: 0.25, skip: 2 });
  }
  // le pont de la Rive, en pierre, à une arche
  {
    const x0 = 488, x1 = 532, ya = RIVER[0] - 4, yb = RIVER[1] + 4;
    W.box(x0, ya, -8, x1, yb, 2, M.BRIDGE_STONE);
    const mid = (RIVER[0] + RIVER[1]) / 2, half = (RIVER[1] - RIVER[0]) / 2 + 1;
    for (let y = RIVER[0]; y < RIVER[1]; y++) { const t = (y - mid) / half; const topz = -7 + Math.round(7.5 * Math.sqrt(Math.max(0, 1 - t * t))); W.box(x0, y, -7, x1, y + 1, topz, 0); }
    W.box(x0, RIVER[0], -8, x1, RIVER[1], -7, M.RIVER2);
    W.box(496, ya, 1, 524, yb, 2, 0); W.box(496, ya, 0, 524, yb, 1, M.ASPHALT);
    W.box(488, ya, 0, 496, yb, 2, M.SIDEWALK); W.box(524, ya, 0, 532, yb, 2, M.SIDEWALK);
    W.box(x0, ya, 2, x0 + 2, yb, 5, M.BRIDGE_STONE); W.box(x1 - 2, ya, 2, x1, yb, 5, M.BRIDGE_STONE);
    B.streetLamp(W, 489, 300, 5, 1, 0, { on: night, I: 1.6, r: 50, h: 16 }); B.streetLamp(W, 530, 344, 5, -1, 0, { on: night, I: 1.6, r: 50, h: 16 });
  }
  // la passerelle métallique
  {
    const x0 = 220, x1 = 234;
    W.box(x0, RIVER[0] - 4, 1, x1, RIVER[1] + 4, 2, M.METAL);
    for (let y = RIVER[0] - 4; y < RIVER[1] + 4; y++) { W.set(x0, y, 6, M.METAL_DARK); W.set(x1 - 1, y, 6, M.METAL_DARK); if (y % 3 === 0) for (let z = 2; z < 6; z++) { W.set(x0, y, z, M.METAL_DARK); W.set(x1 - 1, y, z, M.METAL_DARK); } }
    for (const y of [RIVER[0] + 20, RIVER[1] - 20]) W.box(x0 + 5, y, -8, x1 - 5, y + 3, 1, M.METAL_DARK);
  }
  // la rambarde des quais s'ouvre devant les deux ponts (elle les barrait : on ne passait plus la Rive)
  for (const y of [RIVER[0] - 2, RIVER[1] + 1]) { W.box(490, y, 2, 530, y + 1, 8, 0); W.box(221, y, 2, 233, y + 1, 6, 0); }

  // ------------------------------------------------ le quartier du stade, posé au centre
  W.box(QX, QY, 0, QX + 340, QY + 340, 2, 0);
  W.at(QX, QY); buildQuartier(o, W); W.at(0, 0);

  // ------------------------------------------------ les autres quartiers
  const places = [];
  for (const d of DISTRICTS) {
    const f = path.join(__dirname, d.file);
    if (!fs.existsSync(f)) { console.log('  (quartier absent :', d.file, ')'); continue; }
    const D = require(f);
    W.at(d.x, d.y);
    const out = D.build(W, { w: D.w, h: D.h, night, time: o.time || 'night', mood: o.mood || 'good', R: rng(D.seed || 7), G: 2 }) || {};
    W.at(0, 0);
    for (const p of out.places || []) places.push(Object.assign({}, p, { x: p.x + d.x, y: p.y + d.y, district: d.file }));
  }

  // ------------------------------------------------ réverbères et voitures le long des rues du maître
  for (const [ax, a, b, c0, c1] of ROADS) {
    for (let t = c0 + 30; t < c1 - 10; t += 70) {
      const friche = (x, y) => x < 300 && y > 620 && y < 768;
      if (ax === 'x') { if (inRoad(t, a - 4, null) || inRoad(t, b + 3, null) || friche(t, a - 5)) continue; B.streetLamp(W, t, a - 5, 2, 0, 1, { on: night }); }
      else { if (inRoad(a - 4, t, null) || inRoad(b + 3, t, null) || friche(a - 5, t)) continue; B.streetLamp(W, a - 5, t, 2, 1, 0, { on: night }); }
    }
    for (let t = c0 + 50; t < c1 - 40; t += 90) {
      if (R() < 0.45) continue;
      const m = [M.CAR_BORD, M.CAR_WHITE, M.CAR_BLUE, M.CAR_BEIGE][Math.floor(R() * 4)];
      if (ax === 'x') { if (!inRoad(t, b - 5, ROADS.find(r => r[1] === a && r[3] === c0)) && !inRoad(t + 19, b - 5, ROADS.find(r => r[1] === a && r[3] === c0))) B.car(W, t, b - 9, 1, 'x', m); }
      else { if (!inRoad(b - 5, t, ROADS.find(r => r[1] === a && r[3] === c0)) && !inRoad(b - 5, t + 19, ROADS.find(r => r[1] === a && r[3] === c0))) B.car(W, b - 9, t, 1, 'y', m); }
    }
  }
  // le car du club, sur le quai sud, contre le mur du stade (l'aube du départ, ou la nuit du retour)
  if (o.bus) B.clubBus(W, 380, 383, 1, { lit: o.bus === 'lit' });
  // des gens sur les quais et le pont
  if (o.people === false) {
    // posés par la scène appelante
  } else if (night) {
    W.sprite(Object.assign({ x: 372, y: 368, z: 2 }, SP.COAT));
    W.sprite(Object.assign({ x: 515, y: 330, z: 2 }, SP.WALKER)); W.sprite(Object.assign({ x: 517.5, y: 329, z: 2 }, SP.WALKER2));
  } else {
    W.sprite(Object.assign({ x: 380, y: 368, z: 2 }, SP.WALKER)); W.sprite(Object.assign({ x: 640, y: 279, z: 2 }, SP.WALKER2));
    W.sprite(Object.assign({ x: 512, y: 320, z: 2 }, SP.KID)); W.sprite(Object.assign({ x: 700, y: 366, z: 2 }, SP.COAT));
  }
  // les reflets sur la Rive : chaque lumière dont le reflet tombe sur l'eau y laisse sa traînée
  GLINTS.length = 0;
  const zw = -7 + ZL;
  W.lights.forEach((L, i) => {
    if (L.z <= zw + 1 || L.axis) return;
    const t = (L.z - zw) / 1.15, mx = L.x + t, my = L.y + t;
    if (my < RIVER[0] + 1 || my > RIVER[1] - 1 || mx < 0 || mx >= N) return;
    const m = Math.max(L.cr, L.cg, L.cb); if (m < 0.2) return;
    GLINTS.push({ id: i, d: L.x - L.y, s: mx + my, len: 7 + Math.min(14, t * 0.55), k: 0.85, c: [L.cr / m, L.cg / m, L.cb / m] });
  });
  W.places = places;
  return W;
}

// ------------------------------------------------ le couloir de la Rive, hors de la ville
// La Rive continue au-delà de la vieille ville, à travers les quartiers de l'ouest et de l'est
// (le Grand Aubérive) : son lit, ses quais, ses promenades et les deux routes des quais, entre
// x0 et x1, l'eau à partir de y0 (y0 = 290 dans la ville : la même coupe, au voxel près).
//   y0 − 56 … y0 − 28   la route du quai nord        y0 − 20 … y0 − 4   la promenade nord
//   y0 − 4 … y0         le mur du quai               y0 … y0 + 66        l'eau
//   y0 + 66 … y0 + 70   le mur du quai               y0 + 70 … y0 + 86   la promenade sud
//   y0 + 94 … y0 + 122  la route du quai sud
// Un quartier qui la reçoit (district_*.js, `riviere: y0` en coordonnées locales) bâtit autour :
// il peut y poser un pont, des pontons, un bassin, mais l'eau reste continue d'un bord à l'autre et
// l'une des deux routes des quais au moins reste praticable.
function couloirRive(W, x0, x1, y0, night) {
  const road = (a, b) => { W.box(x0, a, 0, x1, b, 2, 0); W.box(x0, a, 0, x1, b, 1, M.ASPHALT); };
  road(y0 - 56, y0 - 28); road(y0 + 94, y0 + 122);
  W.box(x0, y0, -7, x1, y0 + 66, 2, 0);
  W.box(x0, y0, -8, x1, y0 + 66, -7, M.RIVER2);
  W.box(x0, y0 - 4, -8, x1, y0, 2, M.QUAY_STONE);
  W.box(x0, y0 + 66, -8, x1, y0 + 70, 2, M.QUAY_STONE);
  W.box(x0, y0 - 20, 1, x1, y0 - 4, 2, M.GRAVEL); W.box(x0, y0 + 70, 1, x1, y0 + 86, 2, M.GRAVEL);
  B.railing(W, x0, y0 - 2, x1 - 1, y0 - 2, 2, 4, M.METAL_DARK, 6);
  B.railing(W, x0, y0 + 67, x1 - 1, y0 + 67, 2, 4, M.METAL_DARK, 6);
  for (let x = x0 + 20; x < x1 - 10; x += 46) {
    B.planeTree(W, x, y0 - 14, 2, { seed: 100 + x, trunk: 15, r: 8.5, leafR: 16 });
    B.planeTree(W, x + 23, y0 + 76, 2, { seed: 200 + x, trunk: 15, r: 8.5, leafR: 16 });
  }
  for (let x = x0 + 6; x < x1; x += 60) {
    B.streetLamp(W, x, y0 - 6, 2, 0, -1, { on: night, I: 1.8, r: 56, h: 18 });
    B.streetLamp(W, x + 30, y0 + 81, 2, 0, -1, { on: night, I: 1.8, r: 56, h: 18 });
  }
}

// ------------------------------------------------ les vues
function view(W, o) {
  const FW = o.width || 656, FH = o.height || 370;
  const L = lighting(o.time || 'night');
  // la lueur des projecteurs du stade, là où ils sont vraiment
  const fx = QX + 148, fy = QY + 142, fz = 72 + ZL;
  const flood = o.floodOn === false || o.mood === 'bad' ? null : o.flood || [2 * (fx - fy) - o.cu, fx + fy - 2 * fz - o.cv];
  const skyOpt = { horizon: o.horizon != null ? o.horizon : 48, flood };
  if (o.time === 'dawn') Object.assign(skyOpt, { top: [0.16, 0.17, 0.26], hor: [0.42, 0.32, 0.34], stars: 0 });
  if (o.time === 'dusk') Object.assign(skyOpt, { top: [0.12, 0.10, 0.16], hor: [0.48, 0.28, 0.20], stars: 4 });
  const sky = (o.time === 'day' ? daySky : nightSky)(FW, FH, skyOpt);
  const opt = Object.assign({ width: FW, height: FH, cu: o.cu, cv: o.cv, backdrop: sky.backdrop, fogColor: sky.fog, wetSky: [0.1, 0.085, 0.085] }, L);
  if (o.cutS != null) { opt.cutS = o.cutS; opt.fogS0 = o.cutS + 4; opt.fogS1 = o.cutS + (o.fogLen || 86); } else { opt.fogS0 = -2000; opt.fogS1 = -1000; }
  if (o.cutF != null) { opt.cutF = o.cutF; opt.cutZ = ZL + 3; }
  return E.render(W, opt);
}
// un écran de jeu centré sur un point du monde (x, y au sol), avec son horizon
function screen(W, x, y, o = {}) {
  const FW = o.width || 656, FH = o.height || 370;
  const cu = Math.round(2 * (x - y) - FW / 2), cv = Math.round(x + y - 2 * (2 + ZL) - (o.row != null ? o.row : FH * 0.62));
  const cutS = o.cut === false ? null : cv + (o.cutOff != null ? o.cutOff : 70);
  // la coupe avant : les immeubles plus proches de la caméra que `front` (en x + y) s'effacent au-dessus du trottoir
  const cutF = o.front != null ? x + y + o.front : null;
  return view(W, Object.assign({}, o, { width: FW, height: FH, cu, cv, cutS, cutF }));
}

module.exports = { buildZone, view, screen, couloirRive, N, QX, QY };

if (require.main === module) {
  const time = process.argv[2] || 'night', mood = process.argv[3] || 'good';
  const t0 = Date.now();
  const W = buildZone({ time, mood });
  console.log('zone construite en', Date.now() - t0, 'ms ;', W.lights.length, 'lumières ;', W.places.length, 'lieux des quartiers');
  // vue d'ensemble réduite pour contrôle : toute la zone, 1 pixel = 1 pixel
  const FW = 4 * N + 40, FH = 2 * N + 260;
  if (process.argv[4] === 'full') {
    const r = view(W, { time, width: FW, height: FH, cu: -2 * N - 20, cv: -240, horizon: 900 });
    E.writePNG(path.join(__dirname, 'out', `zone_${time}_${mood}_full.png`), r.img, r.FW, r.FH, 1);
  }
  const shots = [['stade', 510, 600], ['riviere', 520, 330], ['vieilleville', 500, 150], ['sport', 840, 520], ['residentiel', 420, 900], ['friche', 150, 700]];
  for (const [k, x, y] of shots) {
    const r = screen(W, x, y, { time });
    E.writePNG(path.join(__dirname, 'out', `zone_${time}_${mood}_${k}.png`), r.img, 656, 370, 2);
  }
  console.log('fini en', Date.now() - t0, 'ms');
}
