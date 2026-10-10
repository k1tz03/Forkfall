'use strict';
// Aubérive entière, en maquette : 1 voxel = 1 m. La carte de la ville, la nuit.
const E = require('./engine');
const { M } = require('./mats');
const B = require('./build');
const { World, LEFT, RIGHT, TOP, hash, fbm, mod, clamp, material, rng, textBitmap } = E;
const { Facade } = B;
const { nightSky } = require('./scene_quartier');
require('./diorama');

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const T = 4; // niveau du sol

// ---------------------------------------------------------------- façades à l'échelle 1 m : les fenêtres sont dans la matière
function facade(c, base, o = {}) {
  if (c.face === TOP) { rgb(c, base[0] * 0.8, base[1] * 0.8, base[2] * 0.8); return; }
  rgb(c, base[0], base[1], base[2]);
  const n = hash(Math.floor(c.a / 2), Math.floor(c.b / 2), 7, c.m); mul(c, 0.92 + n * 0.14);
  const z = c.hz - T;
  if (z < 0) return;
  const la = mod(c.a, 6), lb = mod(Math.floor(z * 2), 6), cell = Math.floor(c.a / 6), fl = Math.floor(z / 3);
  const W = c.W;
  if (fl === 0 && o.shop) {
    if (lb >= 1 && lb <= 3 && la >= 1) { const s = o.shop; rgb(c, s[0] * 0.3, s[1] * 0.3, s[2] * 0.3); c.er = s[0] * 0.75; c.eg = s[1] * 0.75; c.eb = s[2] * 0.75; }
    else if (lb === 4) { const b2 = o.band || [0.2, 0.2, 0.2]; rgb(c, b2[0], b2[1], b2[2]); if (o.bandEmit) { c.er = o.bandEmit[0]; c.eg = o.bandEmit[1]; c.eb = o.bandEmit[2]; } }
    return;
  }
  if (la >= 2 && la <= 3 && lb >= 2 && lb <= 4) {
    const h = hash(cell, fl, c.face * 31 + c.m, 77);
    const lit = !o.dead && h < (W.litP != null ? W.litP : 0.3);
    if (lit) { const tv = h < 0.04; rgb(c, 0.3, 0.2, 0.1); c.er = tv ? 0.35 : 0.95; c.eg = tv ? 0.45 : 0.66; c.eb = tv ? 0.75 : 0.32; if (lb === 4) { c.er *= 0.75; c.eg *= 0.75; c.eb *= 0.75; } }
    else rgb(c, 0.07, 0.075, 0.09);
  } else if (lb === 1 && la >= 1 && la <= 4) mul(c, 0.82);
}
M.F_CREAM = material('façade crème', c => facade(c, [0.66, 0.59, 0.47]));
M.F_OCHRE = material('façade ocre', c => facade(c, [0.64, 0.49, 0.31]));
M.F_GREY = material('façade grise', c => facade(c, [0.52, 0.50, 0.47]));
M.F_ROSE = material('façade rose', c => facade(c, [0.62, 0.46, 0.41]));
M.F_BRICK = material('façade brique', c => facade(c, [0.52, 0.27, 0.19]));
M.F_LOCK = material('façade verrouillée', c => { facade(c, [0.36, 0.35, 0.36], { dead: true }); });
M.F_DEAD = material('façade de friche', c => facade(c, [0.38, 0.33, 0.30], { dead: true }));
M.F_LAVERIE = material('laverie', c => facade(c, [0.64, 0.49, 0.31], { shop: [0.70, 0.84, 0.86], band: [0.6, 0.2, 0.35], bandEmit: [1.2, 0.32, 0.6] }));
M.F_TABAC = material('tabac', c => facade(c, [0.66, 0.59, 0.47], { shop: [1.0, 0.76, 0.46], band: [0.13, 0.24, 0.18] }));
M.F_PHARMA = material('pharmacie', c => facade(c, [0.50, 0.53, 0.54], { shop: [0.75, 0.9, 0.85], band: [0.13, 0.24, 0.18] }));
M.F_SHOP = material('commerce', c => facade(c, [0.62, 0.55, 0.45], { shop: [1.0, 0.70, 0.40], band: [0.30, 0.20, 0.14] }));
M.F_CAFE = material('café', c => facade(c, [0.58, 0.40, 0.30], { shop: [1.0, 0.62, 0.30], band: [0.42, 0.12, 0.18] }));
M.F_CLUB = material('club-house', c => facade(c, [0.52, 0.27, 0.19], { shop: [1.0, 0.60, 0.30], band: [0.42, 0.12, 0.18] }));
M.RIVER = material('rivière', c => { rgb(c, 0.06, 0.08, 0.09); if (c.face === TOP) { c.wet = 0.95; if (hash(Math.floor(c.hx), Math.floor(c.hy * 0.5), 501, 0) < 0.05) rgb(c, 0.12, 0.13, 0.13); } });
M.QUAY = material('quai', c => { rgb(c, 0.45, 0.42, 0.38); if (c.face !== TOP && mod(c.b, 2) === 0) mul(c, 0.85); if (c.face !== TOP && mod(c.a + (mod(c.b, 4) < 2 ? 0 : 2), 4) === 0) mul(c, 0.8); });
M.LOCK_ROOF = material('toit verrouillé', c => { rgb(c, 0.26, 0.26, 0.28); if (mod(c.a, 3) === 0) mul(c, 0.85); });
M.RAIL = material('voie ferrée', c => { rgb(c, 0.22, 0.20, 0.19); if (mod(c.b, 2) === 0) rgb(c, 0.32, 0.25, 0.18); if (mod(c.a, 4) === 1) rgb(c, 0.5, 0.5, 0.5); });
M.STALL = material('étal', c => { const k = mod(Math.floor(c.a / 2), 2); if (k) rgb(c, 0.46, 0.12, 0.18); else rgb(c, 0.76, 0.70, 0.58); });
M.SHED = material('shed', c => { rgb(c, 0.32, 0.30, 0.30); if (c.face !== TOP) { rgb(c, 0.30, 0.34, 0.38); if (mod(c.b, 2) === 0) mul(c, 0.8); } });
M.CINEMA = material('fronton', c => { rgb(c, 0.6, 0.2, 0.3); c.er = 1.1; c.eg = 0.3; c.eb = 0.55; if (mod(c.a + c.b, 3) === 0) { c.er = 1.3; c.eg = 1.0; c.eb = 0.6; } }, { noShadow: true });

// ---------------------------------------------------------------- la ville
function buildTown(o = {}) {
  const N = 300, W = new World(N, N, 52);
  W.litP = 0.4;
  const R = rng(1990);
  const used = new Uint8Array(N * N);
  const mark = (x0, y0, x1, y1) => { for (let y = Math.max(0, y0); y < Math.min(N, y1); y++) for (let x = Math.max(0, x0); x < Math.min(N, x1); x++) used[y * N + x] = 1; };
  // le socle
  W.box(0, 0, 0, N, N, T, M.SOIL);
  W.box(0, 0, T - 1, N, N, T, M.GRASS);
  // rues
  const ROADS = [62, 106, 150, 194, 238, 282];
  const road = (axis, c, w) => { if (axis === 'x') { W.box(0, c - w, T - 1, N, c + w, T, M.ASPHALT); W.box(0, c - w - 2, T - 1, N, c - w, T, M.SIDEWALK); W.box(0, c + w, T - 1, N, c + w + 2, T, M.SIDEWALK); for (let x = 0; x < N; x += 5) W.box(x, c, T - 1, x + 2, c + 1, T, M.ROADLINE); mark(0, c - w - 2, N, c + w + 2); } else { W.box(c - w, 0, T - 1, c + w, N, T, M.ASPHALT); W.box(c - w - 2, 0, T - 1, c - w, N, T, M.SIDEWALK); W.box(c + w, 0, T - 1, c + w + 2, N, T, M.SIDEWALK); for (let y = 0; y < N; y += 5) W.box(c, y, T - 1, c + 1, y + 2, T, M.ROADLINE); mark(c - w - 2, 0, c + w + 2, N); } };
  for (const c of ROADS) { road('x', c, c === 150 || c === 238 ? 4 : 3); road('y', c, c === 150 || c === 194 ? 4 : 3); }
  // la rivière (la Rive), ses quais, ses ponts
  const RY = x => 128 + 7 * Math.sin(x / 31) + 3 * Math.sin(x / 11);
  const inRiver = (x, y, w) => Math.abs(y - RY(x)) < w;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (inRiver(x, y, 9)) { for (let z = 1; z < T; z++) W.set(x, y, z, 0); W.set(x, y, 1, M.RIVER); used[y * N + x] = 2; }
    else if (inRiver(x, y, 12)) { for (let z = 1; z < T; z++) W.set(x, y, z, M.QUAY); W.set(x, y, T - 1, M.SIDEWALK); used[y * N + x] = 2; }
  }
  const bridge = (axis, c, w) => {
    for (let t = 0; t < N; t++) { const x = axis === 'x' ? t : c, y = axis === 'x' ? c : t; if (!inRiver(x, y, 13)) continue;
      for (let k = -w - 1; k <= w + 1; k++) { const bx = axis === 'x' ? x : c + k, by = axis === 'x' ? c + k : y; W.set(bx, by, T - 1, Math.abs(k) <= w ? M.ASPHALT : M.STONE); W.set(bx, by, T - 2, M.STONE); if (Math.abs(k) === w + 1) W.set(bx, by, T, M.STONE); } }
  };
  bridge('y', 62, 3); bridge('y', 150, 4); bridge('y', 238, 3);
  // ---------------------------------------------------------------- les lieux du jeu (marqués « used »)
  const places = {};
  const P = (key, x, y, z) => { places[key] = [x, y, z]; };
  // le stade de la Rive
  {
    const x0 = 108, y0 = 154, x1 = 190, y1 = 234; mark(x0, y0, x1, y1);
    W.box(x0, y0, T - 1, x1, y1, T, M.CONCRETE);
    W.box(x0 + 12, y0 + 18, T - 1, x1 - 10, y1 - 12, T, M.PITCH_BIG);
    const ch = (a, b, c, d) => W.box(a, b, T - 1, c, d, T, M.CHALK);
    ch(x0 + 13, y0 + 19, x1 - 11, y0 + 20); ch(x0 + 13, y1 - 14, x1 - 11, y1 - 13); ch(x0 + 13, y0 + 19, x0 + 14, y1 - 13); ch(x1 - 12, y0 + 19, x1 - 11, y1 - 13); ch(x0 + 40, y0 + 19, x0 + 41, y1 - 13);
    for (let k = 0; k < 8; k++) { W.box(x0 + 12, y0 + 16 - k, T, x1 - 10, y0 + 17 - k, T + 1 + k, M.CONCRETE_STEP); for (let i = 1; i < x1 - x0 - 23; i++) if (hash(i, k, 3, 1) > 0.12) W.set(x0 + 12 + i, y0 + 16 - k, T + 1 + k, hash(i, k, 4, 1) < 0.85 ? M.SEAT : M.SEAT_GREY); }
    for (let k = 0; k < 4; k++) W.box(x0 + 10 - k, y0 + 20, T, x0 + 11 - k, y1 - 14, T + 1 + k, M.WOOD);
    W.box(x0, y0, T, x1, y0 + 1, T + 3, M.BRICK); W.box(x0, y1 - 1, T, x1, y1, T + 3, M.BRICK); W.box(x0, y0, T, x0 + 1, y1, T + 3, M.BRICK); W.box(x1 - 1, y0, T, x1, y1, T + 3, M.BRICK);
    W.box(x1 - 14, y1 - 6, T, x1 - 1, y1 - 1, T + 5, M.BRICK_OLD);
    for (const [px, py] of [[x0 + 6, y0 + 6], [x1 - 7, y0 + 6], [x0 + 6, y1 - 8], [x1 - 7, y1 - 8]]) {
      W.box(px, py, T, px + 1, py + 1, T + 16, M.METAL_DARK); W.box(px - 1, py - 1, T + 16, px + 2, py + 2, T + 18, M.FLOOD);
      const ax = (x0 + x1) / 2 - px, ay = (y0 + y1) / 2 - py, al = Math.hypot(ax, ay, 16);
      W.light({ x: px + 0.5, y: py + 0.5, z: T + 15, r: 70, fall: 1.4, cr: 0.5, cg: 0.49, cb: 0.45, axis: [ax / al, ay / al, -16 / al], c0: 0.55, c1: 0.85, spill: 0.05, skip: 2.5 });
    }
    P('stade', (x0 + x1) / 2, y0 + 8, T + 10);
  }
  // le club-house et la buvette du kop (au nord-est du carrefour)
  {
    const x0 = 198, y0 = 200, x1 = 234, y1 = 234; mark(x0, y0 - 4, x1, y1);
    W.box(x0, y0 + 10, T, x1, y1, T + 8, M.F_CLUB);
    B.flatRoof(W, x0, y0 + 10, x1 - x0, y1 - y0 - 10, T + 8, M.BRICK, { parapet: 1 });
    const f = new Facade(W, LEFT, x0, y0 + 10, x1 - x0, y1 - y0 - 10);
    f.sign(2, T + 8, 'BUVETTE', { depth: 0, fg: [1.0, 0.45, 0.68], emit: [1.4, 0.38, 0.7] });
    W.light({ x: x0 + 8, y: y1 + 2, z: T + 5, r: 18, cr: 0.8, cg: 0.22, cb: 0.42, skip: 2 });
    for (let i = 0; i < 4; i++) W.box(x0 + 2 + i * 3, y1, T, x0 + 3 + i * 3, y1 + 1, T + 1, M.METAL);
    W.box(x0, y0, T - 1, x1, y0 + 10, T, M.ASPHALT);
    for (let i = 0; i < 4; i++) { const m = [M.CAR_BORD, M.CAR_WHITE, M.CAR_BLUE, M.CAR_BEIGE][i]; W.box(x0 + 3 + i * 5, y0 + 2, T, x0 + 5 + i * 5, y0 + 6, T + 1, m); W.box(x0 + 3 + i * 5, y0 + 3, T + 1, x0 + 5 + i * 5, y0 + 5, T + 2, M.CAR_GLASS); }
    P('clubhouse', x0 + 22, y1 - 2, T + 9); P('buvette', x0 + 7, y1, T + 7);
  }
  // la rangée : tabac, laverie, pharmacie (au sud-ouest du carrefour)
  {
    const x1 = 190, y0 = 242;
    const rows = [[M.F_TABAC, 12, 15, 'tabac'], [M.F_LAVERIE, 14, 15, 'laverie'], [M.F_PHARMA, 12, 9, 'pharmacie'], [M.F_CREAM, 10, 12, null]];
    let y = y0;
    for (const [m, len, h, key] of rows) {
      W.box(x1 - 14, y, T, x1, y + len, T + h, m);
      B.gableRoof(W, x1 - 14, y, 14, len, T + h, key === 'pharmacie' ? M.SLATE : M.TERRACOTTA, { axis: 'y', oh: 0 });
      if (key === 'tabac') { W.set(x1, y + 1, T + 5, M.RED_SIGN); W.set(x1, y + 1, T + 6, M.RED_SIGN); }
      if (key === 'pharmacie') { W.set(x1, y + len - 2, T + 5, M.NEON_TEAL); W.set(x1, y + len - 2, T + 6, M.NEON_TEAL); W.set(x1, y + len - 3, T + 6, M.NEON_TEAL); W.set(x1, y + len - 1, T + 6, M.NEON_TEAL); W.set(x1, y + len - 2, T + 7, M.NEON_TEAL); }
      if (key) { W.light({ x: x1 + 2, y: y + len / 2, z: T + 2, r: 14, cr: 0.7, cg: 0.55, cb: 0.4, skip: 2 }); P(key, x1, y + len / 2, T + h); }
      y += len;
    }
    mark(x1 - 14, y0, x1, y);
  }
  // le square et le kiosque (au sud-est du carrefour)
  {
    const x0 = 198, y0 = 242, x1 = 234, y1 = 280; mark(x0, y0, x1, y1);
    W.box(x0, y0, T - 1, x1, y1, T, M.GRAVEL);
    W.box(x0 + 3, y0 + 3, T, x0 + 7, y0 + 7, T + 3, M.METAL_GREEN); W.box(x0 + 2, y0 + 2, T + 3, x0 + 8, y0 + 8, T + 4, M.METAL_GREEN);
    P('kiosque', x0 + 5, y0 + 5, T + 4);
    for (const [tx, ty] of [[x0 + 16, y0 + 8], [x0 + 26, y0 + 14], [x0 + 12, y0 + 24], [x0 + 28, y0 + 30]]) tree(W, tx, ty, 3);
  }
  // ton appartement
  {
    const x0 = 112, y0 = 244; mark(x0, y0, x0 + 26, y0 + 34);
    W.box(x0, y0, T, x0 + 24, y0 + 14, T + 16, M.F_CREAM);
    B.mansard(W, x0, y0, 24, 14, T + 16, 5);
    P('appartement', x0 + 12, y0 + 14, T + 22);
  }
  // terrain annexe et centre de formation
  {
    const x0 = 242, y0 = 154, x1 = 280, y1 = 234; mark(x0, y0, x1, y1);
    W.box(x0 + 2, y0 + 4, T - 1, x1 - 2, y0 + 40, T, M.SOIL);
    W.box(x0 + 3, y0 + 5, T - 1, x1 - 3, y0 + 6, T, M.CHALK); W.box(x0 + 3, y0 + 38, T - 1, x1 - 3, y0 + 39, T, M.CHALK);
    for (let i = 0; i < 3; i++) W.box(x0 + 4 + i * 11, y0 + 46, T, x0 + 13 + i * 11, y0 + 52, T + 3, M.PLASTER_GREY);
    W.box(x0 + 4, y0 + 58, T, x0 + 34, y0 + 72, T + 6, M.F_GREY); B.flatRoof(W, x0 + 4, y0 + 58, 30, 14, T + 6, M.CONCRETE, { parapet: 1 });
    P('annexe', x0 + 18, y0 + 22, T); P('formation', x0 + 18, y0 + 52, T + 4);
  }
  // salle de muscu (garage), cabinet du Doc, banque
  {
    const x0 = 242, y0 = 242; mark(x0, y0, 280, 280);
    W.box(x0 + 2, y0 + 2, T, x0 + 18, y0 + 14, T + 6, M.SHED); B.gableRoof(W, x0 + 2, y0 + 2, 16, 12, T + 6, M.ZINC, { oh: 0, slope: 2 });
    W.box(x0 + 22, y0 + 2, T, x0 + 34, y0 + 14, T + 9, M.F_ROSE); B.gableRoof(W, x0 + 22, y0 + 2, 12, 12, T + 9, M.SLATE, { oh: 0 });
    W.box(x0 + 4, y0 + 20, T, x0 + 34, y0 + 34, T + 12, M.F_GREY); B.flatRoof(W, x0 + 4, y0 + 20, 30, 14, T + 12, M.STONE, { parapet: 1 });
    P('muscu', x0 + 10, y0 + 14, T + 7); P('doc', x0 + 28, y0 + 14, T + 10); P('banque', x0 + 19, y0 + 34, T + 13);
  }
  // la vieille ville : mairie et marché, église et cimetière, l'Écho, le cinéma, l'école
  {
    const x0 = 66, y0 = 66; mark(x0, y0, 102, 102);
    W.box(x0, y0, T - 1, x0 + 36, y0 + 36, T, M.COBBLE);
    W.box(x0 + 2, y0 + 2, T, x0 + 34, y0 + 12, T + 10, M.STONE); B.gableRoof(W, x0 + 2, y0 + 2, 32, 10, T + 10, M.SLATE, { oh: 0, gable: M.STONE });
    W.box(x0 + 15, y0 + 4, T, x0 + 21, y0 + 10, T + 20, M.STONE); W.box(x0 + 15, y0 + 4, T + 20, x0 + 21, y0 + 10, T + 22, M.SLATE); W.box(x0 + 17, y0 + 6, T + 22, x0 + 19, y0 + 8, T + 26, M.METAL);
    W.box(x0 + 18, y0 + 7, T + 26, x0 + 19, y0 + 8, T + 30, M.METAL); W.box(x0 + 19, y0 + 7, T + 28, x0 + 21, y0 + 8, T + 30, M.METAL_BORD);
    W.box(x0 + 15, y0 + 10, T + 14, x0 + 21, y0 + 11, T + 17, M.LIT_PANEL);
    for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) { const sx = x0 + 4 + i * 6, sy = y0 + 18 + j * 8; W.box(sx, sy, T, sx + 4, sy + 3, T + 1, M.WOOD); W.box(sx, sy, T + 2, sx + 4, sy + 3, T + 3, M.STALL); }
    P('mairie', x0 + 18, y0 + 11, T + 21); P('marche', x0 + 18, y0 + 26, T + 3);
  }
  {
    const x0 = 20, y0 = 66; mark(x0, y0, 58, 102);
    W.box(x0 + 4, y0 + 4, T, x0 + 30, y0 + 14, T + 10, M.STONE); B.gableRoof(W, x0 + 4, y0 + 4, 26, 10, T + 10, M.SLATE, { oh: 0, gable: M.STONE });
    W.box(x0 + 26, y0 + 5, T, x0 + 32, y0 + 13, T + 22, M.STONE);
    for (let k = 0; k < 6; k++) W.box(x0 + 26 + Math.floor(k / 2), y0 + 5 + Math.floor(k / 2), T + 22 + k * 2, x0 + 32 - Math.floor(k / 2), y0 + 13 - Math.floor(k / 2), T + 24 + k * 2, M.SLATE);
    W.box(x0, y0 + 18, T - 1, x0 + 34, y0 + 34, T, M.GRASS);
    for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) W.set(x0 + 3 + i * 5, y0 + 20 + j * 4, T, M.STONE);
    tree(W, x0 + 32, y0 + 30, 3); tree(W, x0 + 4, y0 + 32, 2);
    P('eglise', x0 + 29, y0 + 9, T + 30);
  }
  {
    const x0 = 110, y0 = 66; mark(x0, y0, 146, 102);
    W.box(x0 + 2, y0 + 2, T, x0 + 34, y0 + 16, T + 14, M.F_BRICK); B.flatRoof(W, x0 + 2, y0 + 2, 32, 14, T + 14, M.BRICK, { parapet: 1 });
    const f = new Facade(W, LEFT, x0 + 2, y0 + 2, 32, 14); f.sign(8, T + 13, "L'ÉCHO", { depth: 0, fg: [0.92, 0.88, 0.70], emit: [0.9, 0.85, 0.62] });
    W.box(x0 + 4, y0 + 22, T, x0 + 32, y0 + 34, T + 10, M.F_GREY); B.flatRoof(W, x0 + 4, y0 + 22, 28, 12, T + 10, M.STONE, { parapet: 1 });
    const fc = new Facade(W, LEFT, x0 + 4, y0 + 22, 28, 12); fc.rect(4, T + 3, 24, T + 6, -1, M.CINEMA);
    W.light({ x: x0 + 18, y: y0 + 37, z: T + 4, r: 22, cr: 0.9, cg: 0.3, cb: 0.5, skip: 2 });
    P('echo', x0 + 18, y0 + 16, T + 15); P('cinema', x0 + 18, y0 + 34, T + 11);
  }
  {
    const x0 = 66, y0 = 154; mark(x0, y0, 102, 190);
    W.box(x0 + 2, y0 + 2, T, x0 + 34, y0 + 12, T + 9, M.F_BRICK); W.box(x0 + 2, y0 + 12, T, x0 + 12, y0 + 34, T + 9, M.F_BRICK);
    B.gableRoof(W, x0 + 2, y0 + 2, 32, 10, T + 9, M.TERRACOTTA, { oh: 0, gable: M.BRICK });
    W.box(x0 + 14, y0 + 14, T - 1, x0 + 34, y0 + 34, T, M.ASPHALT);
    P('ecole', x0 + 18, y0 + 12, T + 12);
  }
  // les lieux verrouillés : la gare, le district
  {
    const x0 = 6, y0 = 6; mark(x0, y0, 58, 58);
    W.box(x0, y0 + 24, T - 1, N, y0 + 34, T, M.RAIL);
    W.box(x0 + 4, y0 + 4, T, x0 + 44, y0 + 18, T + 12, M.F_LOCK); B.gableRoof(W, x0 + 4, y0 + 4, 40, 14, T + 12, M.LOCK_ROOF, { oh: 0 });
    W.box(x0 + 20, y0 + 6, T, x0 + 28, y0 + 14, T + 22, M.F_LOCK); W.box(x0 + 20, y0 + 6, T + 22, x0 + 28, y0 + 14, T + 24, M.LOCK_ROOF);
    W.box(x0 + 4, y0 + 20, T + 5, x0 + 50, y0 + 23, T + 6, M.LOCK_ROOF);
    P('gare', x0 + 24, y0 + 10, T + 25);
  }
  {
    const x0 = 66, y0 = 20; mark(x0, y0, 102, 58);
    W.box(x0 + 4, y0 + 4, T, x0 + 32, y0 + 30, T + 12, M.F_LOCK); B.flatRoof(W, x0 + 4, y0 + 4, 28, 26, T + 12, M.F_LOCK, { parapet: 1 });
    W.box(x0 + 12, y0 + 30, T, x0 + 24, y0 + 32, T + 12, M.STONE);
    P('district', x0 + 18, y0 + 30, T + 13);
  }
  // la friche industrielle
  {
    const x0 = 6, y0 = 244; mark(x0, y0, 58, 296);
    for (let i = 0; i < 4; i++) { W.box(x0 + 4, y0 + 4 + i * 10, T, x0 + 40, y0 + 14 + i * 10, T + 7, M.F_DEAD); for (let k = 0; k < 4; k++) W.box(x0 + 4, y0 + 4 + i * 10 + k * 2, T + 7 + Math.min(k, 3 - k) , x0 + 40, y0 + 6 + i * 10 + k * 2, T + 8 + Math.min(k, 3 - k), M.SHED); }
    W.box(x0 + 44, y0 + 10, T, x0 + 47, y0 + 13, T + 34, M.BRICK_OLD);
    P('friche', x0 + 45, y0 + 11, T + 34);
  }
  // ---------------------------------------------------------------- le reste : la ville ordinaire
  const MATS = [M.F_CREAM, M.F_OCHRE, M.F_GREY, M.F_ROSE, M.F_BRICK, M.F_CREAM, M.F_SHOP, M.F_CAFE];
  const ivals = ws => { const out = []; let a = 0; for (const c of ROADS) { const w = ws(c); out.push([a, c - w - 2]); a = c + w + 2; } out.push([a, N]); return out.filter(([u, v]) => v - u > 6); };
  const blocksX = ivals(c => c === 150 || c === 194 ? 4 : 3), blocksY = ivals(c => c === 150 || c === 238 ? 4 : 3);
  for (const [bx0, bx1] of blocksX) for (const [by0, by1] of blocksY) {
    const free = (x0, y0, x1, y1) => { for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) if (x < 0 || y < 0 || x >= N || y >= N || used[y * N + x]) return false; return true; };
    const D = 10;
    const segs = [];
    for (let x = bx0; x < bx1;) { const L = 6 + Math.floor(R() * 9); segs.push([x, by0, Math.min(x + L, bx1), by0 + D, 'x']); segs.push([x, by1 - D, Math.min(x + L, bx1), by1, 'x']); x += L; }
    for (let y = by0 + D; y < by1 - D;) { const L = 6 + Math.floor(R() * 9); segs.push([bx0, y, bx0 + D, Math.min(y + L, by1 - D), 'y']); segs.push([bx1 - D, y, bx1, Math.min(y + L, by1 - D), 'y']); y += L; }
    for (const [x0, y0, x1, y1, ax] of segs) {
      if (x1 - x0 < 3 || y1 - y0 < 3 || !free(x0, y0, x1, y1)) continue;
      const h = 6 + Math.floor(R() * 4) * 3;
      const m = MATS[Math.floor(R() * MATS.length)];
      W.box(x0, y0, T, x1, y1, T + h, m);
      const rt = R();
      if (rt < 0.45) B.gableRoof(W, x0, y0, x1 - x0, y1 - y0, T + h, M.TERRACOTTA, { oh: 0, axis: ax, gable: m });
      else if (rt < 0.8) B.gableRoof(W, x0, y0, x1 - x0, y1 - y0, T + h, M.SLATE, { oh: 0, axis: ax, gable: m });
      else B.flatRoof(W, x0, y0, x1 - x0, y1 - y0, T + h, m, { parapet: 1 });
      if (R() < 0.35) W.box(x0 + 1, y0 + 1, T + h, x0 + 2, y0 + 2, T + h + 4, M.BRICK);
      mark(x0, y0, x1, y1);
    }
    // les cœurs d'îlot : jardins et arbres
    for (let k = 0; k < 3; k++) { const tx = bx0 + D + 2 + Math.floor(R() * Math.max(1, bx1 - bx0 - 2 * D - 4)), ty = by0 + D + 2 + Math.floor(R() * Math.max(1, by1 - by0 - 2 * D - 4)); if (free(tx - 2, ty - 2, tx + 3, ty + 3)) tree(W, tx, ty, 2 + Math.floor(R() * 2)); }
  }
  // arbres des quais
  for (let x = 3; x < N - 3; x += 8) for (const side of [-1, 1]) { const y = Math.round(RY(x) + side * 14); if (y > 2 && y < N - 3 && !used[y * N + x] && !W.get(x, y, T)) { tree(W, x, y, 2); used[y * N + x] = 1; } }
  // réverbères et voitures le long des rues
  for (const c of ROADS) for (let t = 4; t < N - 4; t += 14) {
    for (const [x, y] of [[t, c - 5], [c - 5, t], [t + 7, c + 5], [c + 5, t + 7]]) { if (x < 1 || y < 1 || x >= N - 1 || y >= N - 1) continue; if (W.get(x, y, T) || inRiver(x, y, 13) || W.get(x, y, T - 1) !== M.SIDEWALK) continue; W.box(x, y, T, x + 1, y + 1, T + 5, M.METAL_DARK); W.set(x, y, T + 5, M.BULB); W.light({ x: x + 0.5, y: y + 0.5, z: T + 4.6, r: 16, fall: 1.8, cr: 1.15, cg: 0.74, cb: 0.32, spot: 0.5, skip: 1 }); }
    if (R() < 0.35) { const x = t + 4, y = c + 2; if (!inRiver(x, y, 13) && !W.get(x, y, T)) { const m = [M.CAR_BORD, M.CAR_WHITE, M.CAR_BLUE, M.CAR_BEIGE][Math.floor(R() * 4)]; W.box(x, y, T, x + 4, y + 2, T + 1, m); W.box(x + 1, y, T + 1, x + 3, y + 2, T + 2, M.CAR_GLASS); } }
  }
  P('parking', 216, 205, T); P('boutique', 228, 234, T + 4); P('gareRoutiere', 98, 236, T + 2); P('cabine', 196, 244, T + 2);
  P('arret', 238, 236, T + 2); P('cimetiere', 36, 92, T); P('parc', 205, 143, T + 2); P('friche2', 22, 262, T + 8);
  // l'arrêt de bus et la gare routière
  W.box(236, 235, T, 241, 236, T + 3, M.METAL); W.box(235, 234, T + 3, 242, 237, T + 4, M.METAL);
  W.box(90, 236, T, 106, 237, T + 3, M.METAL); W.box(89, 235, T + 3, 107, 238, T + 4, M.METAL);
  W.box(92, 238, T, 104, 241, T + 3, M.CAR_WHITE); W.box(92, 238, T + 3, 104, 241, T + 4, M.CAR_GLASS);
  W.places = places;
  return W;
}
function tree(W, x, y, r) {
  W.box(x, y, T, x + 1, y + 1, T + 2 + r, M.BARK);
  for (let z = T + 1 + r; z <= T + 2 + 3 * r; z++) for (let yy = y - r - 1; yy <= y + r + 1; yy++) for (let xx = x - r - 1; xx <= x + r + 1; xx++) {
    const d = Math.hypot(xx - x, yy - y, (z - (T + 2 + 2 * r)) * 1.2);
    if (d < r + 0.6 - hash(xx, yy, z, 9) * 0.8 && !W.get(xx, yy, z)) W.set(xx, yy, z, M.FOLIAGE);
  }
}

function renderTown() {
  const W = buildTown();
  const N = W.X;
  const pad = 40, FW = 4 * N + 2 * pad, FH = 760;
  const cu = -2 * N - pad, cv = -150;
  const sky = nightSky(FW, FH, { horizon: 300, flood: [2 * (149 - 194) - cu, 149 + 194 - 2 * 20 - cv] });
  const opt = {
    width: FW, height: FH, cu, cv,
    ambient: [0.12, 0.11, 0.14], faceAmb: [1.0, 0.74, 0.55],
    sun: [0.13, 0.135, 0.19], sunDir: (() => { const l = Math.hypot(-0.35, 0.40, 0.85); return [-0.35 / l, 0.40 / l, 0.85 / l]; })(),
    backdrop: sky.backdrop, fogColor: sky.fog, fogS0: -2000, fogS1: -1000,
    wetRow: 200, reflAmb: [0.12, 0.10, 0.11], wetStrength: 0.85,
    bloom: [[2, 0.4], [6, 0.25]], levels: 48, lightQuant: 6, outlineDark: 0.6,
  };
  const res = E.render(W, opt);
  // positions écran des lieux, pour les pastilles HTML
  const pos = {};
  for (const [k, [x, y, z]] of Object.entries(W.places)) pos[k] = [Math.round(2 * (x - y) - cu), Math.round(x + y - 2 * z - cv)];
  return { res, pos };
}

module.exports = { buildTown, renderTown };
if (require.main === module) {
  const t = Date.now();
  const { res, pos } = renderTown();
  E.writePNG(__dirname + '/out/ville.png', res.img, res.FW, res.FH, 1);
  require('fs').writeFileSync(__dirname + '/out/ville_pos.json', JSON.stringify(pos));
  console.log('ville', res.FW, res.FH, Date.now() - t, 'ms', JSON.stringify(pos));
}
