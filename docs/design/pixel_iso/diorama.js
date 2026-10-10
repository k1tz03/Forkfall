'use strict';
// Vignettes en diorama : un bloc de terrain flottant, le bâtiment posé dessus.
// Le logement à l'échelle du quartier (20 cm), le stade en maquette (1 m).
const E = require('./engine');
const { M } = require('./mats');
const B = require('./build');
const { World, LEFT, RIGHT, TOP, hash, fbm, mod, clamp, material, rng } = E;
const { Facade } = B;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
M.SLAB = material('tranche de terrain', c => {
  const top = c.W.slabTop || 6;
  if (c.face === TOP) { rgb(c, 0.22, 0.34, 0.16); return; }
  const col = Math.floor(c.face === LEFT ? c.hx * 2 : c.hy * 2);
  const drip = 1 + Math.floor(hash(col, 0, 3, 7) * 3);
  if (c.hz > top - drip * 0.5) { rgb(c, 0.22, 0.36, 0.17); if (hash(col, Math.floor(c.hz * 2), 4, 0) < 0.3) rgb(c, 0.30, 0.44, 0.20); return; }
  const band = Math.floor(c.hz / 1.6 + fbm(col / 9, 0, 11) * 1.5);
  const p = [[0.30, 0.21, 0.15], [0.36, 0.25, 0.17], [0.27, 0.19, 0.14], [0.40, 0.33, 0.25]][mod(band, 4)];
  rgb(c, p[0], p[1], p[2]);
  if (hash(Math.floor(col / 3), Math.floor(c.hz * 2 / 3), 5, 0) < 0.07) rgb(c, 0.46, 0.44, 0.40);
  if (c.hz < 1.2) { c.cr *= 0.7; c.cg *= 0.7; c.cb *= 0.7; }
});
M.MUD = material('boue', c => { const n = fbm(c.hx / 4, c.hy / 4, 33); rgb(c, 0.30 + 0.06 * n, 0.24 + 0.04 * n, 0.18); if (hash(c.a, c.b, 34, 0) < 0.1) rgb(c, 0.42, 0.40, 0.36); if (n > 0.62) c.wet = 0.8; });
M.WATER = material('piscine', c => { rgb(c, 0.10, 0.25, 0.30); c.er = 0.05; c.eg = 0.16; c.eb = 0.20; if (c.face === TOP) c.wet = 0.9; });
M.CARAVAN = material('caravane', c => { rgb(c, 0.74, 0.71, 0.62); if (c.face !== TOP && mod(c.b, 7) === 3) rgb(c, 0.45, 0.30, 0.20); if (hash(Math.floor(c.a / 3), Math.floor(c.b / 3), 61, 0) < 0.06) rgb(c, 0.52, 0.42, 0.30); });
M.PITCH_BIG = material('pelouse maquette', c => { const st = mod(Math.floor((c.hx + c.hy) / 4), 2); const k = st ? 1 : 0.86; rgb(c, 0.20 * k, 0.37 * k, 0.17 * k); if (c.W.worn && fbm(c.hx / 6, c.hy / 6, 81) > 0.58) rgb(c, 0.38, 0.30, 0.20); });
M.WEED = material('herbes folles', c => { rgb(c, 0.26, 0.34, 0.15); if (hash(c.a, c.b, 82, 0) < 0.4) rgb(c, 0.40, 0.40, 0.18); }, { trans: 0.6, noAO: true });
M.TARP = material('bâche', c => { rgb(c, 0.30, 0.36, 0.44); if (mod(c.a, 5) === 0) rgb(c, 0.24, 0.29, 0.36); });
M.BARRIER = material('barrière de chantier', c => { rgb(c, mod(Math.floor((c.a + c.b) / 2), 2) ? 0.80 : 0.60, mod(Math.floor((c.a + c.b) / 2), 2) ? 0.78 : 0.12, mod(Math.floor((c.a + c.b) / 2), 2) ? 0.72 : 0.12); });

function renderDiorama(build, o = {}) {
  const S = o.S, T = o.T || 6, m = 2;
  const W = new World(S + 2 * m, S + 2 * m, o.Z || 80);
  W.slabTop = T;
  W.box(m, m, 0, m + S, m + S, T, o.slab || M.SLAB);
  if (o.top) W.box(m, m, T - 1, m + S, m + S, T, o.top);
  build(W, m, m, S, T);
  // cadrage : la boîte englobante des voxels
  let u0 = 1e9, u1 = -1e9, v0 = 1e9, v1 = -1e9;
  for (let z = 0; z < W.Z; z++) for (let y = 0; y < W.Y; y++) for (let x = 0; x < W.X; x++) {
    if (!W.mat[W.idx(x, y, z)]) continue;
    for (const [dx, dy, dz] of [[0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 0], [1, 0, 0], [0, 1, 0]]) {
      const u = 2 * ((x + dx) - (y + dy)), v = (x + dx) + (y + dy) - 2 * (z + dz);
      if (u < u0) u0 = u; if (u > u1) u1 = u; if (v < v0) v0 = v; if (v > v1) v1 = v;
    }
  }
  const pad = o.pad || 8;
  const FW = o.FW || (u1 - u0 + 2 * pad), FH = o.FH || (v1 - v0 + 2 * pad);
  const cu = Math.round((u0 + u1) / 2 - FW / 2 + (o.du || 0)), cv = Math.round((v0 + v1) / 2 - FH / 2 + (o.dv || 0));
  const bg = (px, py) => {
    const t = py / FH, dx = (px - FW / 2) / FW, dy = (py - FH * 0.45) / FH;
    const v = Math.exp(-(dx * dx + dy * dy) * 3.2);
    const r = 0.05 + 0.03 * (1 - t) + 0.07 * v, g = 0.036 + 0.02 * (1 - t) + 0.05 * v, b = 0.03 + 0.016 * (1 - t) + 0.04 * v;
    return [r, g, b];
  };
  const out6 = [0, 0, 0, 0, 0, 0];
  const opt = {
    width: FW, height: FH, cu, cv,
    ambient: o.ambient || [0.30, 0.27, 0.31], faceAmb: [1.0, 0.76, 0.56],
    sun: o.sun || [0.78, 0.60, 0.42], sunDir: (() => { const l = Math.hypot(-0.35, 0.40, 0.85); return [-0.35 / l, 0.40 / l, 0.85 / l]; })(),
    backdrop: (px, py) => { const c = bg(px, py); out6[0] = c[0]; out6[1] = c[1]; out6[2] = c[2]; return out6; },
    fogColor: bg, fogS0: -2000, fogS1: -1000,
    wetRow: 4, reflAmb: [0.3, 0.27, 0.25], wetStrength: 0.6,
    bloom: [[2, 0.35], [6, 0.22]], levels: 48, lightQuant: 6, log: false, outlineDark: 0.55,
  };
  const res = E.render(W, opt);
  return res;
}

// ---------------------------------------------------------------- logement (1 voxel = 20 cm)
function logementCaravane(W, x, y, S, T) {
  W.box(x, y, T - 1, x + S, y + S, T, M.MUD);
  W.box(x + 4, y + 8, T, x + 26, y + 18, T + 2, M.METAL_DARK);
  W.box(x + 4, y + 8, T + 2, x + 26, y + 18, T + 12, M.CARAVAN);
  W.box(x + 5, y + 9, T + 12, x + 25, y + 17, T + 13, M.CARAVAN);
  W.box(x + 26, y + 12, T + 1, x + 31, y + 14, T + 2, M.METAL_DARK);
  const f = new Facade(W, LEFT, x + 4, y + 8, 22, 10);
  f.window(3, T + 5, 5, 4, { state: 'lit', sill: false, lintel: false, curtain: [0.62, 0.30, 0.22] });
  f.window(15, T + 5, 4, 4, { state: 'dark', sill: false, lintel: false });
  f.door(10, T + 2, 3, 9, { mat: M.CARAVAN, frame: false });
  W.box(x + 13, y + 18, T, x + 17, y + 20, T + 1, M.WOOD);
  W.box(x + 7, y + 26, T, x + 9, y + 28, T + 2, M.PLASTIC_WHITE); W.box(x + 7, y + 26, T + 2, x + 9, y + 27, T + 5, M.PLASTIC_WHITE);
  W.box(x + 30, y + 24, T, x + 32, y + 26, T + 4, M.PLASTIC_RED);
  for (let i = 0; i < S; i += 4) { W.box(x + i, y, T, x + i + 1, y + 1, T + 9, M.METAL); W.box(x, y + i, T, x + 1, y + i + 1, T + 9, M.METAL); }
  for (let i = 0; i < S; i++) { W.set(x + i, y, T + 8, M.METAL); W.set(x, y + i, T + 8, M.METAL); }
  W.box(x + 32, y + 30, T, x + 33, y + 31, T + 16, M.WOOD);
  W.set(x + 31, y + 30, T + 14, M.BULB);
  W.light({ x: x + 31, y: y + 31.5, z: T + 13, r: 30, cr: 0.9, cg: 0.62, cb: 0.3, skip: 1.5 });
  B.crates(W, x + 28, y + 4, T, 2);
  W.stampLeaves(x + 18, y + 26, 10, 0.6);
}
function logementAppartement(W, x, y, S, T) {
  W.box(x, y, T - 1, x + S, y + S, T, M.SIDEWALK);
  W.box(x, y + 26, T - 1, x + S, y + S, T, M.ASPHALT);
  W.box(x, y + 25, T - 1, x + S, y + 26, T, M.CURB);
  const H = T + 45;
  W.box(x + 1, y + 1, T, x + S - 1, y + 20, H, M.PLASTER_CREAM);
  const f = new Facade(W, LEFT, x + 1, y + 1, S - 2, 19);
  f.rect(0, T + 15, S - 2, T + 16, -1, M.STONE); f.rect(0, T + 30, S - 2, T + 31, -1, M.STONE);
  f.door(14, T, 5, 11, { kind: 'door', step: true });
  f.window(4, T + 3, 5, 8, { state: 'dark', shutter: M.SHUTTER_GREY, closed: true });
  f.window(25, T + 3, 5, 8, { state: 'dark', shutter: M.SHUTTER_GREY });
  f.window(4, T + 19, 5, 8, { state: 'tv', shutter: M.SHUTTER_GREEN });
  f.window(15, T + 19, 5, 8, { state: 'lit', shutter: M.SHUTTER_GREEN, curtain: [0.55, 0.50, 0.32], balcony: 'plants' });
  f.window(25, T + 19, 5, 8, { state: 'dark', shutter: M.SHUTTER_GREEN, closed: true });
  f.window(4, T + 34, 5, 8, { state: 'dark', shutter: M.SHUTTER_GREEN });
  f.window(15, T + 34, 5, 8, { state: 'lit', shutter: M.SHUTTER_GREEN, curtain: [0.62, 0.30, 0.22] });
  f.window(25, T + 34, 5, 8, { state: 'dark', shutter: M.SHUTTER_GREEN });
  const fr = new Facade(W, RIGHT, x + 1, y + 1, S - 2, 19);
  fr.window(4, T + 19, 4, 8, { state: 'dark' }); fr.window(11, T + 34, 4, 8, { state: 'lit' });
  const top = B.mansard(W, x + 1, y + 1, S - 2, 19, H, 9);
  B.dormer(W, LEFT, x + 1, y + 1, S - 2, 19, x + 15, H + 1, { state: 'lit', curtain: [0.6, 0.5, 0.3] });
  B.chimney(W, x + 6, y + 6, top, 5); B.antenna(W, x + 26, y + 8, top, 10);
  B.streetLamp(W, x + 30, y + 23, T, 0, 1, { h: 22, I: 1.5, r: 50 });
  B.car(W, x + 4, y + 27, T - 1, 'x', M.CAR_BEIGE);
  B.bin(W, x + 26, y + 21, T);
}
function logementPavillon(W, x, y, S, T) {
  W.box(x, y, T - 1, x + S, y + S, T, M.GRASS);
  W.box(x + 16, y + 20, T - 1, x + 21, y + S, T, M.GRAVEL);
  W.box(x + 4, y + 4, T, x + 30, y + 20, T + 16, M.PLASTER_CREAM);
  const f = new Facade(W, LEFT, x + 4, y + 4, 26, 16);
  f.door(12, T, 5, 11, { mat: M.WOOD_DARK, step: true });
  f.window(3, T + 4, 6, 7, { state: 'lit', shutter: M.SHUTTER_BLUE, curtain: [0.62, 0.30, 0.22] });
  f.window(20, T + 4, 5, 7, { state: 'dark', shutter: M.SHUTTER_BLUE });
  const fr = new Facade(W, RIGHT, x + 4, y + 4, 26, 16);
  fr.window(4, T + 4, 5, 7, { state: 'lit', shutter: M.SHUTTER_BLUE });
  B.gableRoof(W, x + 4, y + 4, 26, 16, T + 16, M.TERRACOTTA, { axis: 'x', oh: 2, gable: M.PLASTER_CREAM });
  { const fg = new Facade(W, RIGHT, x + 4, y + 4, 26, 16); fg.window(6, T + 18, 4, 4, { state: 'lit', sill: false }); }
  B.chimney(W, x + 22, y + 10, T + 22, 6);
  for (let i = 0; i < S; i++) { if (i < 15 || i > 21) W.box(x + i, y + S - 2, T, x + i + 1, y + S, T + 4, M.HEDGE); W.box(x + S - 2, y + i, T, x + S, y + i + 1, T + 4, M.HEDGE); }
  B.car(W, x + 22, y + 22, T, 'y', M.CAR_BLUE);
  B.planeTree(W, x + 6, y + 26, T, { seed: 31, trunk: 10, r: 6, branches: 3, leafR: 10 });
  W.box(x + 30, y + 6, T, x + 31, y + 7, T + 4, M.WOOD); W.set(x + 30, y + 6, T + 4, M.BULB);
  W.light({ x: x + 30.5, y: y + 7.5, z: T + 4, r: 22, cr: 0.8, cg: 0.55, cb: 0.25, skip: 1 });
}
function logementVilla(W, x, y, S, T) {
  W.box(x, y, T - 1, x + S, y + S, T, M.GRASS);
  W.box(x + 2, y + 2, T, x + 24, y + 14, T + 14, M.PLASTER_CREAM);
  W.box(x + 16, y + 2, T + 14, x + 32, y + 14, T + 26, M.PLASTER_CREAM);
  B.flatRoof(W, x + 2, y + 2, 22, 12, T + 14, M.PLASTER_CREAM, { parapet: 1 });
  B.flatRoof(W, x + 16, y + 2, 16, 12, T + 26, M.PLASTER_CREAM, { parapet: 1 });
  W.box(x + 24, y + 2, T, x + 32, y + 14, T + 14, M.STONE);
  const f1 = new Facade(W, LEFT, x + 2, y + 2, 22, 12);
  f1.shop(2, T, 12, 10, 'door', { k: 1.1 });
  f1.window(16, T + 3, 5, 7, { state: 'lit', sill: false });
  const f2 = new Facade(W, LEFT, x + 16, y + 2, 16, 12);
  f2.shop(2, T + 15, 12, 9, 'door', { k: 1.0 });
  const f3 = new Facade(W, RIGHT, x + 24, y + 2, 8, 12);
  f3.window(3, T + 3, 6, 8, { state: 'office', sill: false });
  W.box(x + 4, y + 18, T - 2, x + 22, y + 27, T, M.WATER);
  W.box(x + 3, y + 17, T - 1, x + 23, y + 18, T, M.STONE); W.box(x + 3, y + 27, T - 1, x + 23, y + 28, T, M.STONE);
  W.box(x + 3, y + 17, T - 1, x + 4, y + 28, T, M.STONE); W.box(x + 22, y + 17, T - 1, x + 23, y + 28, T, M.STONE);
  W.light({ x: x + 13, y: y + 22, z: T - 1, r: 18, cr: 0.12, cg: 0.35, cb: 0.45, shadow: false });
  B.car(W, x + 26, y + 16, T, 'y', M.CAR_BORD);
  for (let i = 0; i < S; i += 2) W.box(x + i, y + S - 1, T, x + i + 1, y + S, T + 5, M.METAL_DARK);
  W.box(x, y + S - 1, T + 5, x + S, y + S, T + 6, M.METAL_DARK);
  W.box(x + 24, y + S - 3, T, x + 26, y + S, T + 8, M.STONE); W.box(x + 32, y + S - 3, T, x + 34, y + S, T + 8, M.STONE);
  W.set(x + 24, y + S - 2, T + 8, M.BULB); W.set(x + 33, y + S - 2, T + 8, M.BULB);
  W.light({ x: x + 29, y: y + S, z: T + 8, r: 24, cr: 0.8, cg: 0.55, cb: 0.25, skip: 1 });
  for (const [cx, cy] of [[x + 2, y + 30], [x + 10, y + 32]]) { W.box(cx, cy, T, cx + 1, cy + 1, T + 8, M.BARK); W.box(cx - 2, cy - 2, T + 8, cx + 3, cy + 3, T + 12, M.FOLIAGE); }
}

// ---------------------------------------------------------------- stade (1 voxel = 1 m, maquette)
function pitchBase(W, x, y, S, T) {
  W.box(x, y, T - 1, x + S, y + S, T, M.CONCRETE);
  W.box(x + 14, y + 16, T - 1, x + 62, y + 46, T, M.PITCH_BIG);
  const ch = (a, b, c, d) => W.box(a, b, T - 1, c, d, T, M.CHALK);
  ch(x + 15, y + 17, x + 61, y + 18); ch(x + 15, y + 44, x + 61, y + 45); ch(x + 15, y + 17, x + 16, y + 45); ch(x + 60, y + 17, x + 61, y + 45); ch(x + 38, y + 17, x + 39, y + 45);
  for (const gx of [x + 15, x + 59]) { W.box(gx, y + 29, T, gx + 2, y + 30, T + 2, M.WHITE); W.box(gx, y + 33, T, gx + 2, y + 34, T + 2, M.WHITE); W.box(gx, y + 29, T + 2, gx + 2, y + 34, T + 3, M.WHITE); }
}
function stand(W, x0, y0, len, rows, T, axis, o = {}) {
  // gradins qui montent vers l'extérieur ; axis 'x' : tribune le long de x, face au terrain côté +y
  for (let k = 0; k < rows; k++) {
    if (axis === 'x') { W.box(x0, y0 - k - 1, T, x0 + len, y0 - k, T + 1 + k, o.mat || M.CONCRETE_STEP); for (let i = 1; i < len - 1; i++) if (hash(i, k, 9, o.seed || 0) > (o.empty || 0.1)) W.set(x0 + i, y0 - k - 1, T + 1 + k, o.seat || M.SEAT); }
    else { W.box(x0 - k - 1, y0, T, x0 - k, y0 + len, T + 1 + k, o.mat || M.CONCRETE_STEP); for (let i = 1; i < len - 1; i++) if (hash(i, k, 10, o.seed || 0) > (o.empty || 0.1)) W.set(x0 - k - 1, y0 + i, T + 1 + k, o.seat || M.SEAT); }
  }
  if (o.roof) { if (axis === 'x') { W.box(x0, y0 - rows - 1, T + rows + 4, x0 + len, y0 - 1, T + rows + 5, M.METAL); for (let i = 0; i < len; i += 6) W.box(x0 + i, y0 - rows - 1, T, x0 + i + 1, y0 - rows, T + rows + 4, M.METAL_DARK); } else { W.box(x0 - rows - 1, y0, T + rows + 4, x0 - 1, y0 + len, T + rows + 5, M.METAL); for (let i = 0; i < len; i += 6) W.box(x0 - rows - 1, y0 + i, T, x0 - rows, y0 + i + 1, T + rows + 4, M.METAL_DARK); } }
}
function mast(W, x, y, T, h, on) {
  W.box(x, y, T, x + 1, y + 1, T + h, M.METAL_DARK);
  W.box(x - 1, y - 1, T + h, x + 2, y + 2, T + h + 2, on ? M.FLOOD : M.FLOOD_OFF);
  if (on) W.light({ x: x + 0.5, y: y + 0.5, z: T + h - 1, r: 70, fall: 1.6, cr: 0.5, cg: 0.49, cb: 0.45, skip: 2 });
}
function stadeMunicipal(W, x, y, S, T) {
  W.box(x, y, T - 1, x + S, y + S, T, M.GRASS);
  pitchBase(W, x, y, S, T); W.box(x, y, T - 1, x + S, y + 14, T, M.GRASS); W.box(x, y + 48, T - 1, x + S, y + S, T, M.GRASS);
  stand(W, x + 28, y + 15, 20, 3, T, 'x', { mat: M.WOOD, seat: M.WOOD_DARK });
  for (let i = 0; i < 52; i++) { W.set(x + 12 + i, y + 47, T, M.METAL); W.set(x + 12 + i, y + 47, T + 1, M.METAL); }
  W.box(x + 4, y + 50, T, x + 14, y + 58, T + 4, M.WOOD); B.gableRoof(W, x + 4, y + 50, 10, 8, T + 4, M.SLATE, { oh: 1, gable: M.WOOD });
  mast(W, x + 12, y + 14, T, 10, true); mast(W, x + 63, y + 47, T, 10, true);
  for (const [tx, ty] of [[x + 70, y + 8], [x + 68, y + 60], [x + 4, y + 66]]) { W.box(tx, ty, T, tx + 1, ty + 1, T + 5, M.BARK); W.box(tx - 2, ty - 2, T + 5, tx + 3, ty + 3, T + 9, M.FOLIAGE); }
}
function stadeRive(W, x, y, S, T) {
  W.box(x, y, T - 1, x + S, y + S, T, M.SIDEWALK);
  pitchBase(W, x, y, S, T);
  stand(W, x + 16, y + 15, 44, 6, T, 'x', { seed: 2 });
  stand(W, x + 13, y + 18, 26, 2, T, 'y', { mat: M.WOOD, seat: M.WOOD_DARK, seed: 3 });
  for (let i = 0; i < 54; i++) { W.set(x + 12 + i, y + 47, T, M.METAL); W.set(x + 12 + i, y + 47, T + 1, M.METAL); }
  W.box(x + 4, y + 50, T, x + 20, y + 60, T + 6, M.BRICK); B.flatRoof(W, x + 4, y + 50, 16, 10, T + 6, M.BRICK);
  mast(W, x + 12, y + 8, T, 16, true); mast(W, x + 64, y + 8, T, 16, true); mast(W, x + 12, y + 50, T, 16, true); mast(W, x + 64, y + 50, T, 16, true);
}
function stadeGrand(W, x, y, S, T) {
  W.box(x, y, T - 1, x + S, y + S, T, M.SIDEWALK);
  pitchBase(W, x, y, S, T);
  stand(W, x + 14, y + 15, 48, 9, T, 'x', { roof: true, seed: 4, empty: 0.03 });
  stand(W, x + 13, y + 16, 30, 6, T, 'y', { seed: 5, empty: 0.05 });
  for (let k = 0; k < 6; k++) W.box(x + 62 + k, y + 16, T, x + 63 + k, y + 46, T + 1 + k, M.CONCRETE_STEP);
  for (let k = 0; k < 6; k++) for (let i = 1; i < 29; i++) if (hash(i, k, 11, 6) > 0.05) W.set(x + 62 + k, y + 16 + i, T + 1 + k, M.SEAT_GREY);
  for (let k = 0; k < 7; k++) W.box(x + 14, y + 47 + k, T, x + 62, y + 48 + k, T + 1 + k, M.CONCRETE_STEP);
  for (let k = 0; k < 7; k++) for (let i = 1; i < 47; i++) if (hash(i, k, 12, 7) > 0.05) W.set(x + 14 + i, y + 47 + k, T + 1 + k, M.SEAT);
  W.box(x + 30, y + 3, T + 10, x + 46, y + 6, T + 15, M.GLASS);
  { const f = new Facade(W, LEFT, x + 30, y + 3, 16, 3); f.shop(1, T + 10, 14, 5, 'door', { k: 1.2 }); }
  for (const [mx, my] of [[x + 8, y + 6], [x + 68, y + 6], [x + 8, y + 58], [x + 68, y + 58]]) mast(W, mx, my, T, 22, true);
  W.box(x + 66, y + 60, T, x + 76, y + 76, T + 1, M.ASPHALT);
  const mini = (cx, cy, m) => { W.box(cx, cy, T, cx + 2, cy + 4, T + 1, m); W.box(cx, cy + 1, T + 1, cx + 2, cy + 3, T + 2, M.CAR_GLASS); };
  [[67, 62, M.CAR_BORD], [70, 62, M.CAR_WHITE], [73, 62, M.CAR_BLUE], [67, 68, M.CAR_BEIGE], [70, 68, M.CAR_BORD], [73, 69, M.CAR_WHITE]].forEach(([a, b, m]) => mini(x + a, y + b, m));
}
function stadeChute(W, x, y, S, T) {
  W.worn = true;
  W.box(x, y, T - 1, x + S, y + S, T, M.SIDEWALK);
  pitchBase(W, x, y, S, T);
  stand(W, x + 16, y + 15, 44, 6, T, 'x', { seed: 2, empty: 0.45 });
  for (let k = 0; k < 6; k++) for (let i = 0; i < 44; i += 3) if (hash(i, k, 13, 0) < 0.35) W.set(x + 16 + i, y + 15 - k - 1, T + 2 + k, M.WEED);
  W.box(x + 30, y + 8, T + 7, x + 46, y + 15, T + 8, M.TARP);
  for (let i = 0; i < 46; i += 2) W.box(x + 15 + i, y + 15, T, x + 16 + i, y + 16, T + 2, M.BARRIER);
  for (let i = 0; i < 54; i++) { if (i % 9 < 6) { W.set(x + 12 + i, y + 47, T, M.METAL); W.set(x + 12 + i, y + 47, T + 1, M.METAL); } }
  W.box(x + 4, y + 50, T, x + 20, y + 60, T + 6, M.BRICK); B.flatRoof(W, x + 4, y + 50, 16, 10, T + 6, M.BRICK);
  mast(W, x + 12, y + 8, T, 16, false); mast(W, x + 64, y + 8, T, 16, false); mast(W, x + 12, y + 50, T, 16, true);
  W.box(x + 64, y + 50, T, x + 65, y + 51, T + 7, M.METAL_DARK);
  for (let i = 0; i < 40; i++) { const gx = x + Math.floor(hash(i, 0, 14, 0) * S), gy = y + Math.floor(hash(i, 1, 14, 0) * S); if (W.get(gx, gy, T) === 0) W.set(gx, gy, T, M.WEED); }
}

const LOGEMENT = [
  ['caravane', logementCaravane], ['appartement', logementAppartement], ['pavillon', logementPavillon], ['villa', logementVilla],
];
const STADE = [['municipal', stadeMunicipal], ['rive', stadeRive], ['grand', stadeGrand], ['chute', stadeChute]];

module.exports = { renderDiorama, LOGEMENT, STADE };

if (require.main === module) {
  const out = __dirname + '/out/';
  for (const [name, fn] of LOGEMENT) {
    const r = renderDiorama(fn, { S: 36, T: 6, Z: 70, FW: 160, FH: 214 });
    E.writePNG(out + `logement_${name}.png`, r.img, r.FW, r.FH, 1); E.writePNG(out + `logement_${name}_x2.png`, r.img, r.FW, r.FH, 2);
    console.log('logement', name, r.FW, r.FH);
  }
  for (const [name, fn] of STADE) {
    const r = renderDiorama(fn, { S: 76, T: 3, Z: 40, FW: 320, FH: 200, sun: name === 'chute' ? [0.5, 0.42, 0.34] : undefined });
    E.writePNG(out + `stade_${name}.png`, r.img, r.FW, r.FH, 1);
    console.log('stade', name, r.FW, r.FH);
  }
}
