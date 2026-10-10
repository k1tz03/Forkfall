'use strict';
// Trois intérieurs en coupe (sol + deux murs du fond), à l'échelle du quartier : 1 voxel = 20 cm.
const E = require('./engine');
const { M } = require('./mats');
const B = require('./build');
const SP = require('./sprites');
const { renderDiorama } = require('./diorama');
const { LEFT, RIGHT, TOP, hash, fbm, mod, clamp, material, overlay } = E;
const { Facade } = B;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const grain = (c, amt, s = 0) => mul(c, 1 + (hash(c.a, c.b, c.face * 7 + s, c.m) - 0.5) * 2 * amt);
const cutTop = c => { rgb(c, 0.13, 0.10, 0.09); };

M.TILE_FLOOR = material('carrelage', c => {
  if (c.face !== TOP) { rgb(c, 0.36, 0.34, 0.32); return; }
  const a = mod(c.a, 6), b = mod(c.b, 6);
  if (a === 0 || b === 0) { rgb(c, 0.30, 0.29, 0.28); return; }
  const chk = (Math.floor(c.a / 6) + Math.floor(c.b / 6)) & 1;
  rgb(c, chk ? 0.62 : 0.46, chk ? 0.60 : 0.45, chk ? 0.55 : 0.42); grain(c, 0.04);
  const p = fbm(c.hx / 6 + 2, c.hy / 6, 301, 3); if (p > 0.64) c.wet = clamp((p - 0.64) * 10, 0, 0.9);
});
M.FAIENCE = material('faïence', c => {
  if (c.face === TOP) return cutTop(c);
  const a = mod(c.a, 4), b = mod(c.b, 4);
  if (a === 0 || b === 0) rgb(c, 0.52, 0.52, 0.49); else { rgb(c, 0.76, 0.76, 0.72); grain(c, 0.03); }
  if (hash(Math.floor(c.a / 4), Math.floor(c.b / 4), 302, 0) < 0.04) rgb(c, 0.6, 0.62, 0.58);
});
M.PAINT_GREEN = material('peinture verte', c => { if (c.face === TOP) return cutTop(c); rgb(c, 0.36, 0.44, 0.38); mul(c, 0.9 + 0.2 * fbm(c.a / 10, c.b / 10, 303)); grain(c, 0.03); });
M.PAINT_CREAM = material('peinture crème', c => { if (c.face === TOP) return cutTop(c); rgb(c, 0.66, 0.60, 0.48); mul(c, 0.9 + 0.2 * fbm(c.a / 10, c.b / 10, 304)); grain(c, 0.03); });
M.WALLPAPER = material('papier peint', c => { if (c.face === TOP) return cutTop(c); if (mod(c.a, 6) < 3) rgb(c, 0.60, 0.50, 0.36); else rgb(c, 0.53, 0.43, 0.30); if (mod(c.a, 6) === 1 && mod(c.b, 4) === 0) rgb(c, 0.66, 0.56, 0.40); grain(c, 0.03); });
M.PANEL = material('lambris', c => { if (c.face === TOP) { rgb(c, 0.30, 0.20, 0.12); return; } rgb(c, 0.34, 0.22, 0.13); if (mod(c.a, 5) === 0) mul(c, 0.7); grain(c, 0.06); });
M.CARPET = material('moquette', c => { rgb(c, 0.30, 0.12, 0.11); if (mod(c.a + c.b, 8) === 0 || mod(c.a - c.b, 8) === 0) rgb(c, 0.38, 0.17, 0.13); grain(c, 0.08); });
M.LEATHER = material('cuir', c => { rgb(c, 0.25, 0.14, 0.09); if (c.face === TOP) mul(c, 1.15); grain(c, 0.08); });
M.PAPER = material('papier', c => { rgb(c, 0.84, 0.83, 0.78); if (mod(c.b, 2) && c.face === TOP && hash(c.a, c.b, 305, 0) < 0.4) rgb(c, 0.45, 0.45, 0.45); });
M.GOLD = material('trophée', c => { rgb(c, 0.80, 0.63, 0.22); if (c.face === TOP) mul(c, 1.2); c.er = 0.08; c.eg = 0.06; c.eb = 0.01; });
M.BLOTTER = material('sous-main', c => { rgb(c, 0.16, 0.30, 0.20); grain(c, 0.05); });
M.CRT = material('écran', c => {
  rgb(c, 0.1, 0.1, 0.1);
  if (c.face === TOP) { rgb(c, 0.12, 0.12, 0.12); return; }
  const g = mod(Math.floor(c.b), 3) === 0 ? 0.7 : 1;
  c.er = 0.18 * g; c.eg = 0.48 * g; c.eb = 0.30 * g;
  if (mod(c.a, 7) === 3) { c.er = 0.55; c.eg = 0.6; c.eb = 0.55; }
}, { noAOrecv: true });
M.JERSEY = material('maillot suspendu', c => { if (mod(c.a, 4) < 2) rgb(c, 0.46, 0.12, 0.18); else rgb(c, 0.60, 0.60, 0.58); grain(c, 0.06); });
M.TUBE = material('tube néon', c => { rgb(c, 0.9, 0.95, 0.95); c.er = 1.05; c.eg = 1.15; c.eb = 1.12; }, { noShadow: true, noAO: true, noAOrecv: true });
M.ENAMEL = material('émail', c => { rgb(c, 0.80, 0.80, 0.77); if (c.face === TOP) mul(c, 1.05); grain(c, 0.03); });
M.BOARD = material('tableau', c => { rgb(c, 0.10, 0.18, 0.14); });
M.TOWEL = material('serviette', c => { rgb(c, 0.82, 0.80, 0.74); if (mod(c.b, 3) === 0) rgb(c, 0.46, 0.12, 0.18); });
M.BALLS = material('ballons', c => { const h = hash(c.ix, c.iy, c.iz, 306); rgb(c, 0.86, 0.85, 0.80); if (mod(c.a + c.b, 3) === 0) rgb(c, 0.15, 0.15, 0.15); if (h < 0.2) mul(c, 0.8); });
M.BOTTLE = material('bouteille', c => { rgb(c, 0.15, 0.32, 0.18); c.er = 0.02; c.eg = 0.05; c.eb = 0.02; });

// hublot de machine sur la face visible
overlay('porthole', (o, c) => {
  if (c.face !== o.face) return;
  const la = o.face === LEFT ? Math.floor(2 * c.hx) - 2 * o.a0 : 2 * o.a0 - 1 - Math.floor(2 * c.hy);
  const lb = Math.floor(2 * c.hz) - 2 * o.z0;
  const W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  if (lb >= H2 - 2) { rgb(c, 0.55, 0.55, 0.53); if (la === 1 && lb === H2 - 2) { c.er = 0.2; c.eg = 0.9; c.eb = 0.3; } return; }
  const cx = (W2 - 1) / 2, cy = (H2 - 2) / 2, d = Math.hypot(la - cx, lb - cy);
  if (d < o.r - 0.2) {
    rgb(c, 0.20, 0.28, 0.32);
    if (o.run && lb < cy + 0.5) { const p = [[0.55, 0.15, 0.2], [0.25, 0.32, 0.55], [0.75, 0.68, 0.3], [0.85, 0.85, 0.8]][Math.floor(hash(la, lb, 307, o.seed) * 4)]; rgb(c, p[0], p[1], p[2]); }
    if (la < cx && lb > cy) { c.cr += 0.18; c.cg += 0.2; c.cb += 0.22; }
  } else if (d < o.r + 0.9) rgb(c, 0.25, 0.26, 0.27);
});
overlay('chalk', (o, c) => {
  if (c.face !== o.face) return;
  const la = o.face === LEFT ? Math.floor(2 * c.hx) - 2 * o.a0 : 2 * o.a0 - 1 - Math.floor(2 * c.hy);
  const lb = Math.floor(2 * c.hz) - 2 * o.z0;
  const W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  if (la === 0 || la === W2 - 1 || lb === 0 || lb === H2 - 1) { rgb(c, 0.42, 0.30, 0.18); return; }
  rgb(c, 0.10, 0.19, 0.14);
  const marks = [[5, 9, 'x'], [9, 5, 'o'], [13, 10, 'x'], [17, 6, 'o'], [21, 9, 'x'], [8, 11, 'o']];
  for (const [mx, my, t] of marks) {
    const dx = la - mx, dy = lb - my;
    if (t === 'x' && Math.abs(dx) === Math.abs(dy) && Math.abs(dx) <= 1) rgb(c, 0.85, 0.85, 0.8);
    if (t === 'o' && Math.abs(Math.hypot(dx, dy) - 1.3) < 0.5) rgb(c, 0.85, 0.85, 0.8);
  }
  if (lb === 3 && la > 3 && la < W2 - 4 && hash(la, 0, 308, 0) < 0.8) rgb(c, 0.75, 0.75, 0.7);
  if (la === Math.floor(W2 / 2) && lb > 2 && lb < H2 - 2) rgb(c, 0.7, 0.7, 0.65);
});
overlay('stadium', (o, c) => {
  if (c.face !== o.face) return;
  const la = o.face === LEFT ? Math.floor(2 * c.hx) - 2 * o.a0 : 2 * o.a0 - 1 - Math.floor(2 * c.hy);
  const lb = Math.floor(2 * c.hz) - 2 * o.z0;
  const W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  if (la === 0 || la === W2 - 1 || lb === 0 || lb === H2 - 1 || la === Math.floor(W2 / 2)) { rgb(c, 0.25, 0.17, 0.10); return; }
  rgb(c, 0.05, 0.05, 0.06);
  if (lb < H2 * 0.45) { c.er = 0.10; c.eg = 0.30; c.eb = 0.14; if (mod(la + lb, 7) === 0) { c.er = 0.5; c.eg = 0.5; c.eb = 0.45; } }
  else if (lb < H2 * 0.55) { c.er = 0.25; c.eg = 0.12; c.eb = 0.14; }
  else { c.er = 0.06; c.eg = 0.05; c.eb = 0.07; if (lb === H2 - 3 && mod(la, 5) === 2) { c.er = 1.2; c.eg = 1.15; c.eb = 1.0; } }
});

function room(W, x, y, S, T, wallLow, wallHigh, split, H = 18) {
  W.box(x, y, T, x + S, y + 2, T + split, wallLow); W.box(x, y, T + split, x + S, y + 2, T + H, wallHigh);
  W.box(x, y, T, x + 2, y + S, T + split, wallLow); W.box(x, y, T + split, x + 2, y + S, T + H, wallHigh);
  return { wy: new Facade(W, LEFT, x, y, S, 2), wx: new Facade(W, RIGHT, x, y, 2, S) };
}

function vestiaire(W, x, y, S, T) {
  W.box(x, y, T - 1, x + S, y + S, T, M.TILE_FLOOR);
  const { wy, wx } = room(W, x, y, S, T, M.FAIENCE, M.PAINT_GREEN, 8);
  // bancs et patères avec maillots
  W.box(x + 2, y + 2, T + 2, x + S, y + 4, T + 3, M.WOOD); W.box(x + 2, y + 2, T + 2, x + 4, y + S, T + 3, M.WOOD);
  for (let i = 4; i < S; i += 6) { W.box(x + i, y + 2, T, x + i + 1, y + 4, T + 2, M.METAL_DARK); W.box(x + 2, y + i, T, x + 4, y + i + 1, T + 2, M.METAL_DARK); }
  for (let s = 5; s < S - 3; s += 4) {
    wy.set(s, T + 12, -1, M.METAL);
    if (hash(s, 1, 40, 0) > 0.25) wy.rect(s - 1, T + 7, s + 2, T + 12, -1, M.JERSEY);
  }
  for (let s = 3; s < 18; s += 4) {
    wx.set(s, T + 12, -1, M.METAL);
    if (hash(s, 2, 40, 0) > 0.3) wx.rect(s - 1, T + 7, s + 2, T + 12, -1, M.JERSEY);
  }
  // tableau tactique
  { const id = W.obj({ type: 'chalk', face: RIGHT, a0: wx.a0(22), z0: T + 8, w: 13, h: 7 }); wx.rect(22, T + 8, 35, T + 15, -1, M.BOARD, id); }
  // le tas de maillots sales
  for (let i = 0; i < 70; i++) { const px = x + 26 + Math.floor(hash(i, 0, 41, 0) * 9), py = y + 26 + Math.floor(hash(i, 1, 41, 0) * 9); let z = T; while (W.get(px, py, z)) z++; if (z < T + 4) W.set(px, py, z, hash(i, 2, 41, 0) < 0.6 ? M.JERSEY : M.TOWEL); }
  // table de massage du Doc, sac de ballons
  W.box(x + 12, y + 20, T, x + 13, y + 21, T + 4, M.METAL); W.box(x + 21, y + 20, T, x + 22, y + 21, T + 4, M.METAL);
  W.box(x + 12, y + 18, T + 4, x + 22, y + 22, T + 5, M.WHITE); W.box(x + 13, y + 18, T + 5, x + 16, y + 22, T + 6, M.TOWEL);
  W.box(x + 6, y + 30, T, x + 10, y + 34, T + 3, M.BALLS);
  // fenêtre haute, applique
  wy.window(20, T + 12, 8, 4, { state: 'lit', col: [1.0, 0.68, 0.32], k: 0.4, sill: false, spill: false });
  wy.set(8, T + 15, -1, M.METAL_DARK); wy.set(8, T + 14, -1, M.BULB);
  W.light({ x: x + 8.5, y: y + 4, z: T + 14, r: 60, fall: 1.3, cr: 1.5, cg: 1.15, cb: 0.7, skip: 1.2 });
  wx.set(24, T + 16, -1, M.METAL_DARK); wx.set(24, T + 15, -1, M.BULB);
  W.light({ x: x + 4, y: y + 15.5, z: T + 15, r: 60, fall: 1.3, cr: 1.3, cg: 1.0, cb: 0.6, skip: 1.2 });
  W.light({ x: x + 24, y: y + 5, z: T + 12, r: 22, cr: 0.5, cg: 0.32, cb: 0.14, shadow: false });
  W.sprite(Object.assign({ x: x + 16.5, y: y + 9, z: T }, SP.BREHAUT));
  W.sprite(Object.assign({ x: x + 7, y: y + 14, z: T }, SP.PLAYER));
  W.sprite(Object.assign({ x: x + 26, y: y + 17, z: T }, SP.COACH));
}

function bureau(W, x, y, S, T) {
  W.box(x, y, T - 1, x + S, y + S, T, M.CARPET);
  const { wy, wx } = room(W, x, y, S, T, M.PANEL, M.WALLPAPER, 7);
  // la fenêtre sur le stade
  { wy.rect(18, T + 7, 32, T + 16, 0, 0); const id = W.obj({ type: 'stadium', face: LEFT, a0: wy.a0(18), z0: T + 7, w: 14, h: 9 }); wy.rect(18, T + 7, 32, T + 16, 1, M.GLASS, id); }
  W.light({ x: x + 25, y: y + 4, z: T + 11, r: 40, cr: 0.55, cg: 0.62, cb: 0.62, shadow: false });
  // le bureau, le sous-main, la lampe, le téléphone
  W.box(x + 12, y + 14, T, x + 28, y + 21, T + 4, M.WOOD_DARK);
  W.box(x + 15, y + 16, T + 4, x + 24, y + 20, T + 5, M.BLOTTER);
  W.box(x + 17, y + 17, T + 5, x + 20, y + 19, T + 6, M.PAPER);
  W.box(x + 25, y + 15, T + 4, x + 26, y + 16, T + 8, M.GOLD); W.box(x + 24, y + 15, T + 8, x + 27, y + 17, T + 9, M.GOLD); W.set(x + 25, y + 16, T + 7, M.BULB);
  W.light({ x: x + 25.5, y: y + 17, z: T + 7, r: 40, fall: 1.4, cr: 1.5, cg: 1.05, cb: 0.55, skip: 1.2 });
  W.box(x + 33, y + 22, T, x + 34, y + 23, T + 12, M.GOLD); W.box(x + 32, y + 21, T + 12, x + 35, y + 24, T + 14, M.CANVAS); W.set(x + 33, y + 22, T + 11, M.BULB);
  W.light({ x: x + 33.5, y: y + 22.5, z: T + 11, r: 46, fall: 1.4, cr: 1.2, cg: 0.85, cb: 0.45, skip: 1.5 });
  W.box(x + 13, y + 15, T + 4, x + 15, y + 17, T + 5, M.METAL_DARK);
  // le fauteuil et le président
  W.box(x + 17, y + 9, T, x + 23, y + 13, T + 3, M.LEATHER); W.box(x + 17, y + 8, T, x + 23, y + 10, T + 9, M.LEATHER);
  W.sprite(Object.assign({ x: x + 20, y: y + 12.5, z: T }, SP.VAUBOURG));
  // chaises visiteurs
  for (const cx of [x + 14, x + 23]) { W.box(cx, y + 25, T, cx + 3, y + 28, T + 3, M.LEATHER); W.box(cx, y + 27, T, cx + 3, y + 28, T + 7, M.LEATHER); }
  // le coffre, la télé, les trophées, les photos
  W.box(x + 3, y + 3, T, x + 8, y + 8, T + 7, M.METAL_DARK); W.set(x + 7, y + 8, T + 4, M.GOLD);
  W.box(x + 3, y + 28, T, x + 8, y + 34, T + 4, M.WOOD_DARK);
  W.box(x + 3, y + 29, T + 4, x + 7, y + 33, T + 8, M.METAL_DARK); W.box(x + 7, y + 29, T + 4, x + 8, y + 33, T + 8, M.CRT);
  W.light({ x: x + 10, y: y + 31, z: T + 6, r: 22, cr: 0.12, cg: 0.30, cb: 0.22, shadow: false });
  W.box(x + 2, y + 12, T + 9, x + 4, y + 24, T + 10, M.WOOD_DARK);
  for (const ty of [y + 13, y + 16, y + 19, y + 22]) { W.box(x + 2, ty, T + 10, x + 3, ty + 1, T + 12 + (ty % 2), M.GOLD); W.set(x + 2, ty, T + 13 + (ty % 2), M.GOLD); }
  wy.poster(6, T + 9, 5, 4, { bg: [0.70, 0.66, 0.56], fg: [0.3, 0.3, 0.3], seed: 21, depth: -1 }); wy.rect(6, T + 9, 11, T + 13, -1, M.WOOD_DARK);
  { const id = W.obj({ type: 'poster', face: LEFT, a0: wy.a0(6), z0: T + 9, w: 5, h: 4, bg: [0.68, 0.64, 0.54], seed: 21 }); for (let s = 6; s < 11; s++) for (let z = T + 9; z < T + 13; z++) wy.set(s, z, -1, M.WOOD_DARK, id); }
  { const id = W.obj({ type: 'poster', face: RIGHT, a0: wx.a0(26), z0: T + 9, w: 8, h: 5, title: '1993', bg: [0.42, 0.11, 0.16], fg: [0.86, 0.80, 0.62], seed: 22 }); for (let s = 26; s < 34; s++) for (let z = T + 9; z < T + 14; z++) wx.set(s, z, -1, M.WOOD_DARK, id); }
  // la bouteille et deux verres
  W.box(x + 33, y + 4, T, x + 37, y + 8, T + 5, M.WOOD_DARK); W.box(x + 34, y + 5, T + 5, x + 35, y + 6, T + 8, M.BOTTLE); W.set(x + 36, y + 6, T + 5, M.GLASS); W.set(x + 35, y + 7, T + 5, M.GLASS);
  W.box(x + 34, y + 33, T, x + 37, y + 36, T + 3, M.PLASTIC_RED); W.box(x + 33, y + 32, T + 3, x + 38, y + 37, T + 9, M.HEDGE);
}

function laverie(W, x, y, S, T) {
  W.box(x, y, T - 1, x + S, y + S, T, M.TILE_FLOOR);
  const { wy, wx } = room(W, x, y, S, T, M.FAIENCE, M.PAINT_CREAM, 6);
  // lave-linge le long du mur x (face visible : droite)
  let n = 0;
  for (let yy = y + 4; yy + 3 <= y + S - 2; yy += 4) {
    W.box(x + 2, yy, T, x + 5, yy + 3, T + 5, M.ENAMEL);
    const id = W.obj({ type: 'porthole', face: RIGHT, a0: yy + 3, z0: T, w: 3, h: 5, r: 2.2, run: n % 3 === 1, seed: n });
    for (let k = yy; k < yy + 3; k++) for (let z = T; z < T + 5; z++) W.tag[W.idx(x + 4, k, z)] = id;
    n++;
  }
  // séchoirs empilés le long du mur y (face visible : gauche)
  for (let xx = x + 8; xx + 4 <= x + S - 2; xx += 4) for (const z0 of [T, T + 5]) {
    W.box(xx, y + 2, z0, xx + 4, y + 5, z0 + 5, M.ENAMEL);
    const id = W.obj({ type: 'porthole', face: LEFT, a0: xx, z0, w: 4, h: 5, r: 2.6, run: (xx + z0) % 3 === 0, seed: xx + z0 });
    for (let k = xx; k < xx + 4; k++) for (let z = z0; z < z0 + 5; z++) W.tag[W.idx(k, y + 4, z)] = id;
  }
  // tubes au mur, monnayeur, horloge
  wy.rect(8, T + 15, 30, T + 16, -1, M.TUBE); wx.rect(6, T + 15, 30, T + 16, -1, M.TUBE);
  W.light({ x: x + 20, y: y + 6, z: T + 14, r: 46, fall: 1.4, cr: 0.72, cg: 0.84, cb: 0.84, skip: 1.2 });
  W.light({ x: x + 6, y: y + 20, z: T + 14, r: 46, fall: 1.4, cr: 0.72, cg: 0.84, cb: 0.84, skip: 1.2 });
  wy.rect(31, T + 8, 34, T + 12, -1, M.METAL); wy.set(32, T + 11, -2, M.LIT_PANEL);
  wy.poster(18, T + 11, 7, 3, { title: '10 F', bg: [0.82, 0.78, 0.66], fg: [0.42, 0.10, 0.16], seed: 31 });
  // chaises, table, panier, toi qui attends
  for (const cx of [x + 16, x + 20, x + 24]) { W.box(cx, y + 20, T, cx + 3, y + 23, T + 2, M.PLASTIC_RED); W.box(cx, y + 22, T + 2, cx + 3, y + 23, T + 5, M.PLASTIC_RED); }
  W.box(x + 14, y + 28, T, x + 15, y + 29, T + 4, M.METAL_DARK); W.box(x + 12, y + 27, T + 4, x + 22, y + 31, T + 5, M.WHITE);
  W.box(x + 15, y + 28, T + 5, x + 19, y + 30, T + 6, M.JERSEY);
  W.box(x + 28, y + 26, T, x + 32, y + 29, T + 3, M.CANVAS); W.box(x + 29, y + 27, T + 3, x + 31, y + 28, T + 4, M.JERSEY);
  W.sprite(Object.assign({ x: x + 21.5, y: y + 22, z: T }, SP.COACH_SIT));
}


M.BLANKET = material('couverture', c => { rgb(c, 0.42, 0.12, 0.17); if (mod(c.a + c.b, 6) === 0) rgb(c, 0.52, 0.18, 0.22); grain(c, 0.05); });
M.CLOCK = material('réveil', c => { rgb(c, 0.1, 0.1, 0.1); if (c.face !== TOP) { c.er = 0.9; c.eg = 0.08; c.eb = 0.06; } }, { noAOrecv: true });
M.MINITEL = material('minitel', c => { rgb(c, 0.62, 0.58, 0.48); if (c.face === LEFT) { rgb(c, 0.05, 0.06, 0.05); c.er = 0.12; c.eg = 0.32; c.eb = 0.16; } });

// l'appartement : 6 h 40 le lundi, ou dimanche 10 h avec L'Écho sur la table
function appartement(o) { return (W, x, y, S, T) => {
  W.box(x, y, T - 1, x + S, y + S, T, M.WOOD);
  const { wy, wx } = room(W, x, y, S, T, M.WALLPAPER, M.WALLPAPER, 6);
  const dawn = o.when === 'aube';
  { wy.rect(16, T + 6, 28, T + 15, 0, 0); const id = W.obj({ type: 'window', face: LEFT, a0: wy.a0(16), z0: T + 6, w: 12, h: 9, state: 'lit', col: dawn ? [0.45, 0.55, 0.85] : [1.0, 0.95, 0.85], k: dawn ? 0.45 : 0.75, curtain: [0.6, 0.5, 0.35] }); wy.rect(16, T + 6, 28, T + 15, 1, M.GLASS, id); }
  W.light({ x: x + 22, y: y + 5, z: T + 10, r: 40, cr: dawn ? 0.35 : 0.9, cg: dawn ? 0.42 : 0.85, cb: dawn ? 0.65 : 0.7, shadow: false });
  // le lit, Camille endormie
  W.box(x + 3, y + 16, T, x + 16, y + 31, T + 3, M.WOOD_DARK); W.box(x + 3, y + 16, T + 3, x + 16, y + 31, T + 4, M.WHITE);
  W.box(x + 3, y + 21, T + 4, x + 16, y + 31, T + 5, M.BLANKET); W.box(x + 4, y + 17, T + 4, x + 8, y + 21, T + 5, M.WHITE); W.box(x + 10, y + 17, T + 4, x + 14, y + 21, T + 5, M.WHITE);
  if (dawn) { W.box(x + 10, y + 22, T + 5, x + 15, y + 29, T + 6, M.BLANKET); W.box(x + 11, y + 18, T + 5, x + 14, y + 20, T + 6, M.WOOD_DARK); }
  W.box(x + 3, y + 32, T, x + 7, y + 36, T + 4, M.WOOD_DARK); W.box(x + 4, y + 33, T + 4, x + 6, y + 34, T + 5, M.CLOCK);
  W.box(x + 4, y + 34, T + 4, x + 5, y + 35, T + 7, M.GOLD); W.set(x + 4, y + 34, T + 7, M.BULB);
  if (dawn) W.light({ x: x + 5, y: y + 36, z: T + 7, r: 30, fall: 1.4, cr: 1.2, cg: 0.85, cb: 0.45, skip: 1.2 });
  // la table, le planning, le café, le journal du dimanche
  W.box(x + 21, y + 21, T, x + 22, y + 22, T + 4, M.WOOD_DARK); W.box(x + 29, y + 27, T, x + 30, y + 28, T + 4, M.WOOD_DARK);
  W.box(x + 20, y + 20, T + 4, x + 31, y + 29, T + 5, M.WOOD);
  W.box(x + 22, y + 22, T + 5, x + 27, y + 26, T + 6, M.PAPER); W.set(x + 28, y + 23, T + 5, M.WHITE);
  if (!dawn) W.box(x + 25, y + 24, T + 5, x + 30, y + 28, T + 6, M.PAPER);
  for (const [cx, cy] of [[x + 18, y + 23], [x + 31, y + 23]]) { W.box(cx, cy, T, cx + 2, cy + 2, T + 2, M.WOOD_DARK); W.box(cx, cy, T + 2, cx + 2, cy + 1, T + 6, M.WOOD_DARK); }
  // le coin cuisine
  W.box(x + 2, y + 2, T, x + 7, y + 6, T + 9, M.ENAMEL); W.box(x + 8, y + 2, T, x + 14, y + 5, T + 4, M.METAL); W.box(x + 8, y + 2, T + 4, x + 14, y + 5, T + 5, M.METAL_DARK);
  W.box(x + 30, y + 2, T, x + 38, y + 5, T + 4, M.WOOD); W.box(x + 30, y + 2, T + 9, x + 38, y + 4, T + 13, M.WOOD);
  // l'écharpe du club au mur, le sac de maillots près de la porte, la télé
  wy.rect(31, T + 13, 37, T + 14, -1, M.JERSEY);
  wx.rect(5, T + 7, 9, T + 11, -1, M.JERSEY);
  W.box(x + 34, y + 33, T, x + 38, y + 37, T + 3, M.TOWEL);
  W.box(x + 2, y + 9, T, x + 6, y + 14, T + 3, M.WOOD_DARK); W.box(x + 2, y + 10, T + 3, x + 5, y + 13, T + 7, M.METAL_DARK); W.box(x + 5, y + 10, T + 3, x + 6, y + 13, T + 7, dawn ? M.GLASS : M.CRT);
  if (dawn) W.sprite(Object.assign({ x: x + 13, y: y + 33, z: T }, SP.COACH_SIT));
  else W.sprite(Object.assign({ x: x + 25, y: y + 31, z: T }, SP.COACH_SIT));
}; }

// le bureau de Josiane, le secrétariat du club, 9 h 30
function secretariat(W, x, y, S, T) {
  W.box(x, y, T - 1, x + S, y + S, T, M.TILE_FLOOR);
  const { wy, wx } = room(W, x, y, S, T, M.PANEL, M.PAINT_CREAM, 7);
  { wy.rect(22, T + 7, 34, T + 15, 0, 0); const id = W.obj({ type: 'stadium', face: LEFT, a0: wy.a0(22), z0: T + 7, w: 12, h: 8 }); wy.rect(22, T + 7, 34, T + 15, 1, M.GLASS, id); }
  W.light({ x: x + 28, y: y + 5, z: T + 11, r: 40, cr: 0.6, cg: 0.65, cb: 0.7, shadow: false });
  for (let i = 0; i < 4; i++) { W.box(x + 2, y + 6 + i * 5, T, x + 6, y + 10 + i * 5, T + 10, M.METAL); }
  // le bureau, la machine à écrire, les piles de licences, le minitel, la lampe
  W.box(x + 14, y + 16, T, x + 30, y + 23, T + 4, M.WOOD_DARK);
  W.box(x + 16, y + 18, T + 4, x + 20, y + 21, T + 6, M.METAL_DARK); W.box(x + 17, y + 18, T + 6, x + 19, y + 19, T + 7, M.PAPER);
  for (const [px, py, h] of [[x + 22, y + 17, 3], [x + 24, y + 17, 2], [x + 22, y + 20, 4], [x + 26, y + 19, 2]]) W.box(px, py, T + 4, px + 2, py + 2, T + 4 + h, M.PAPER);
  W.box(x + 27, y + 16, T + 4, x + 30, y + 19, T + 7, M.MINITEL);
  W.box(x + 14, y + 16, T + 4, x + 15, y + 17, T + 8, M.GOLD); W.set(x + 14, y + 16, T + 8, M.BULB);
  W.light({ x: x + 14.5, y: y + 17.5, z: T + 8, r: 34, fall: 1.4, cr: 1.2, cg: 0.85, cb: 0.45, skip: 1.2 });
  W.box(x + 20, y + 11, T, x + 24, y + 15, T + 3, M.WOOD_DARK); W.box(x + 20, y + 11, T, x + 24, y + 12, T + 7, M.WOOD_DARK);
  W.sprite(Object.assign({ x: x + 22, y: y + 14.5, z: T }, SP.JOSIANE));
  W.sprite(Object.assign({ x: x + 23, y: y + 29, z: T }, SP.COACH));
  // le calendrier, le fanion, la photo d'équipe, le portemanteau, la plante
  { const id = W.obj({ type: 'poster', face: LEFT, a0: wy.a0(6), z0: T + 9, w: 6, h: 5, title: '1990', bg: [0.82, 0.78, 0.66], fg: [0.42, 0.10, 0.16], seed: 41 }); for (let s = 6; s < 12; s++) for (let z = T + 9; z < T + 14; z++) wy.tag(s, z, 0, id); }
  wx.crest(26, T + 10, 4, 5);
  { const id = W.obj({ type: 'poster', face: RIGHT, a0: wx.a0(31), z0: T + 9, w: 7, h: 4, bg: [0.55, 0.52, 0.46], seed: 42 }); for (let s = 31; s < 38; s++) for (let z = T + 9; z < T + 13; z++) wx.set(s, z, -1, M.WOOD_DARK, id); }
  W.box(x + 34, y + 34, T, x + 37, y + 37, T + 3, M.PLASTIC_RED); W.box(x + 33, y + 33, T + 3, x + 38, y + 38, T + 8, M.HEDGE);
}

// le couloir des Remparts, chez l'adversaire, 19 h 40
function couloir(W, x, y, S, T) {
  W.box(x, y, T - 1, x + S, y + S, T, M.CONCRETE);
  const { wy, wx } = room(W, x, y, S, T, M.FAIENCE, M.PAINT_GREEN, 6);
  wy.rect(8, T + 15, 34, T + 16, -1, M.TUBE); wx.rect(8, T + 15, 34, T + 16, -1, M.TUBE);
  W.light({ x: x + 20, y: y + 5, z: T + 14, r: 48, fall: 1.3, cr: 0.78, cg: 0.88, cb: 0.86, skip: 1.2 });
  W.light({ x: x + 5, y: y + 20, z: T + 14, r: 48, fall: 1.3, cr: 0.78, cg: 0.88, cb: 0.86, skip: 1.2 });
  // la porte vers la pelouse, aveuglante
  { wy.rect(28, T, 36, T + 12, 0, 0); wy.rect(28, T, 36, T + 12, 1, 0); const id = W.obj({ type: 'shop', kind: 'door', face: LEFT, a0: wy.a0(28), z0: T, w: 8, h: 12, k: 1.6 }); wy.rect(28, T, 36, T + 12, 2, M.GLASS, id); }
  wy.sign(27, T + 15, 'VISITEURS', { fg: [0.86, 0.86, 0.82], plate: [0.2, 0.2, 0.22], depth: -1, padX: 1, padY: 1 });
  W.light({ x: x + 32, y: y + 5, z: T + 6, r: 34, cr: 1.0, cg: 1.0, cb: 0.9, skip: 2 });
  // les bancs, les joueurs, les sacs, les crampons
  W.box(x + 2, y + 2, T + 2, x + 26, y + 4, T + 3, M.WOOD); W.box(x + 2, y + 2, T + 2, x + 4, y + 36, T + 3, M.WOOD);
  for (let i = 4; i < 26; i += 7) W.box(x + i, y + 2, T, x + i + 1, y + 4, T + 2, M.METAL_DARK);
  for (let i = 6; i < 36; i += 7) W.box(x + 2, y + i, T, x + 4, y + i + 1, T + 2, M.METAL_DARK);
  W.sprite(Object.assign({ x: x + 9, y: y + 5, z: T }, SP.PLAYER_SIT)); W.sprite(Object.assign({ x: x + 18, y: y + 5, z: T }, SP.PLAYER_SIT));
  W.sprite(Object.assign({ x: x + 5, y: y + 14, z: T }, SP.PLAYER_SIT)); W.sprite(Object.assign({ x: x + 5, y: y + 26, z: T }, SP.PLAYER_SIT));
  W.sprite(Object.assign({ x: x + 14, y: y + 16, z: T }, SP.BREHAUT)); W.sprite(Object.assign({ x: x + 22, y: y + 20, z: T }, SP.VUKIC)); W.sprite(Object.assign({ x: x + 25, y: y + 23, z: T }, SP.COACH));
  for (const [bx, by] of [[x + 10, y + 30], [x + 14, y + 33], [x + 30, y + 14]]) W.box(bx, by, T, bx + 4, by + 2, T + 2, M.CANVAS);
  for (let i = 0; i < 6; i++) W.box(x + 7 + i * 3, y + 9, T, x + 8 + i * 3, y + 10, T + 1, M.TIRE);
  W.box(x + 30, y + 28, T, x + 34, y + 32, T + 3, M.BALLS);
}

const STORY_INT = { appartementAube: appartement({ when: 'aube' }), appartementDimanche: appartement({ when: 'dimanche' }), secretariat, couloir };

const INTERIEURS = [['vestiaire', vestiaire], ['bureau', bureau], ['laverie', laverie]];
module.exports = { INTERIEURS, STORY_INT, vestiaire, bureau, laverie };

if (require.main === module) {
  for (const [name, fn] of INTERIEURS) {
    const r = renderDiorama(fn, { S: 40, T: 4, Z: 30, FW: 224, FH: 190, ambient: [0.24, 0.21, 0.23], sun: [0, 0, 0], slab: M.CONCRETE });
    E.writePNG(__dirname + `/out/interieur_${name}.png`, r.img, r.FW, r.FH, 1);
    E.writePNG(__dirname + `/out/interieur_${name}_x2.png`, r.img, r.FW, r.FH, 2);
    console.log('intérieur', name, r.FW, r.FH);
  }
}
