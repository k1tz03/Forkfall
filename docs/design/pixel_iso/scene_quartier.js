'use strict';
// Le quartier du stade de la Rive, à Aubérive : le carrefour, le club-house, la rangée de commerces, le square.
const E = require('./engine');
const { M } = require('./mats');
const B = require('./build');
const S = require('./sprites');
const { World, LEFT, RIGHT, rng, hash, fbm, clamp } = E;
const { Facade } = B;

const NEON_ON = { fg: [1.0, 0.45, 0.68], emit: [1.35, 0.36, 0.66] };
const NEON_OFF = { fg: [0.78, 0.42, 0.55] };
let NEON = NEON_ON;
const norm = (a, b, c) => { const l = Math.hypot(a, b, c); return [a / l, b / l, c / l]; };

function buildQuartier(o = {}) {
  const night = o.time !== 'day';
  const bad = o.mood === 'bad';
  const R = rng(o.seed || 1991);
  NEON = night ? NEON_ON : NEON_OFF;
  const W = new World(340, 340, 100);
  W.baseWet = o.wet != null ? o.wet : (night ? 0.16 : 0.06);
  const G = 2;

  // ------------------------------------------------ sol, trottoirs, bordures
  W.box(0, 0, 0, 340, 340, 1, M.ASPHALT);
  const raised = [[0, 0, 166, 164], [194, 0, 340, 164], [0, 200, 166, 340], [194, 200, 340, 340]];
  for (const [x0, y0, x1, y1] of raised) {
    W.box(x0, y0, 0, x1, y1, 2, M.SIDEWALK);
    if (y1 === 164) W.box(x0, 163, 0, x1, 164, 2, M.CURB);
    if (y0 === 200) W.box(x0, 200, 0, x1, 201, 2, M.CURB);
    if (x1 === 166) W.box(165, y0, 0, 166, y1, 2, M.CURB);
    if (x0 === 194) W.box(194, y0, 0, 195, y1, 2, M.CURB);
  }
  W.box(0, 164, 0, 340, 165, 1, M.GUTTER); W.box(0, 199, 0, 340, 200, 1, M.GUTTER);
  W.box(166, 0, 0, 167, 340, 1, M.GUTTER); W.box(193, 0, 0, 194, 340, 1, M.GUTTER);
  // marquages : axe de l'avenue, passages piétons, lignes d'arrêt
  for (let x = 0; x < 340; x += 16) if (x + 10 < 160 || x > 200) W.box(x, 181, 0, x + 10, 183, 1, M.ROADLINE);
  for (let y = 0; y < 340; y += 16) if (y + 10 < 158 || y > 206) W.box(179, y, 0, 181, y + 10, 1, M.ROADLINE);
  for (let y = 166; y < 198; y += 4) { W.box(204, y, 0, 216, y + 2, 1, M.ROADLINE); W.box(144, y, 0, 156, y + 2, 1, M.ROADLINE); }
  for (let x = 168; x < 193; x += 4) { W.box(x, 210, 0, x + 2, 222, 1, M.ROADLINE); W.box(x, 142, 0, x + 2, 154, 1, M.ROADLINE); }
  W.box(220, 172, 0, 222, 181, 1, M.ROADLINE); W.box(181, 226, 0, 192, 228, 1, M.ROADLINE);
  W.box(232, 186, 0, 235, 189, 1, M.METAL_DARK); W.box(173, 250, 0, 176, 253, 1, M.METAL_DARK);
  // pavés devant les grilles du stade, stabilisé du square
  W.box(84, 156, 1, 146, 163, 2, M.COBBLE);
  W.box(210, 216, 1, 340, 340, 2, M.GRAVEL);

  // ------------------------------------------------ le stade de la Rive
  W.box(0, 0, 1, 155, 153, 2, M.CONCRETE);
  W.box(16, 16, 1, 123, 132, 2, M.PITCH);
  const chalk = (x0, y0, x1, y1) => W.box(x0, y0, 1, x1, y1, 2, M.CHALK);
  chalk(16, 128, 121, 129); chalk(120, 16, 121, 129);
  for (let a = 0; a <= 16; a++) { const t = a / 16 * Math.PI / 2; W.set(Math.round(120 - Math.cos(t) * 5), Math.round(128 - Math.sin(t) * 5), 1, M.CHALK); }
  chalk(16, 74, 121, 75);
  W.box(120, 128, 2, 121, 129, 9, M.WHITE); W.box(120, 129, 7, 121, 131, 9, M.FLAG);
  // panneaux le long de la touche
  const boards = new Facade(W, LEFT, 60, 130, 62, 2);
  W.box(60, 130, 2, 122, 132, 5, M.METAL_DARK);
  boards.sign(2, 5, "L'ÉCHO", { fg: [0.85, 0.8, 0.62], depth: 0 }); boards.sign(22, 5, 'MAIRIE', { fg: [0.75, 0.75, 0.72], depth: 0 }); boards.sign(42, 5, 'GARAGE', { fg: [0.85, 0.66, 0.25], depth: 0 });
  // tribune populaire : gradins découverts le long du mur est
  for (let k = 0; k < 6; k++) {
    const x0 = 131 + 4 * k, top = G + 3 * (k + 1);
    W.box(x0, 36, 1, 155, 134, top, M.CONCRETE_STEP);
    for (let y = 37; y < 133; y += 2) {
      const h = hash(k, y, 5, 3);
      if (h < 0.08) continue;
      W.set(x0 + 1, y, top, h < 0.75 ? M.SEAT : M.SEAT_GREY);
    }
    if (k === 2 || k === 5) for (let y = 38; y < 133; y++) { W.set(x0, y, top + 3, M.METAL); if (y % 8 === 0) for (let z = top; z < top + 3; z++) W.set(x0, y, z, M.METAL); }
  }
  // escaliers d'accès dans l'angle
  for (let k = 0; k < 6; k++) W.box(134 + k * 3, 134, 1, 155, 140, G + 3 * (k + 1), M.CONCRETE);
  // murs d'enceinte
  W.box(0, 153, 2, 155, 156, 16, M.BRICK); W.box(0, 153, 16, 155, 156, 17, M.STONE);
  B.railing(W, 0, 154, 154, 154, 17, 4);
  W.box(155, 36, 2, 158, 156, 22, M.BRICK); W.box(155, 36, 22, 158, 156, 23, M.STONE);
  const wallX = new Facade(W, RIGHT, 155, 36, 3, 120);
  wallX.sign(14, 19, 'ALLEZ LES AUBES', { scale: 2, fg: [0.80, 0.76, 0.64], depth: 0, drip: true });
  wallX.poster(76, 4, 10, 8, { title: 'RACING', bg: [0.42, 0.11, 0.16], fg: [0.86, 0.80, 0.62], seed: 7, torn: 0.1 });
  wallX.poster(88, 4, 10, 8, { title: 'RACING', bg: [0.42, 0.11, 0.16], fg: [0.86, 0.80, 0.62], seed: 8, torn: 0.25 });
  if (night) { wallX.set(48, 16, -1, M.BULB); W.light(Object.assign(wallX.front(48, 15, 2), { r: 40, fall: 2, cr: 1.1, cg: 0.72, cb: 0.32, skip: 1.5 })); }
  const wallY = new Facade(W, LEFT, 0, 153, 155, 3);
  wallY.poster(132, 5, 20, 9, { title: 'SAMEDI 20H', bg: [0.80, 0.76, 0.66], fg: [0.42, 0.10, 0.16], band: [0.42, 0.10, 0.16], seed: 1, torn: bad ? 0.35 : 0.04 });
  wallY.poster(40, 5, 12, 8, { title: 'COUPE', bg: [0.75, 0.72, 0.62], fg: [0.12, 0.12, 0.12], seed: 2, torn: 0.15 });
  // pylône d'éclairage dans l'angle
  B.pylon(W, 146, 140, G, 66, { on: night && !bad, I: 1.1, r: 300, spill: 0.06 });
  if (bad) { const g2 = new Facade(W, LEFT, 95, 136, 34, 22); g2.sign(9, 15, 'FERMÉ PAR ARRÊTÉ', { plate: [0.82, 0.78, 0.68], plateMat: M.CANVAS, fg: [0.45, 0.08, 0.12], depth: -1, padX: 1, padY: 1 }); wallX.sign(14, 13, 'VAUBOURG DÉMISSION', { scale: 1, fg: [0.86, 0.84, 0.80], depth: 0 }); }
  // l'entrée : guichets et grilles
  W.box(95, 136, 2, 129, 158, 28, M.BRICK_OLD);
  B.flatRoof(W, 95, 136, 34, 22, 28, M.BRICK_OLD);
  const gate = new Facade(W, LEFT, 95, 136, 34, 22);
  gate.rect(0, 2, 34, 4, -1, M.STONE);
  gate.door(12, 2, 10, 14, { kind: 'gate', frame: true, frameMat: M.STONE });
  gate.door(3, 5, 5, 6, { kind: 'rideau', frame: true });
  gate.door(26, 5, 5, 6, { kind: 'rideau', frame: true });
  gate.sign(1, 26, 'STADE DE LA RIVE', { plate: [0.11, 0.10, 0.09], fg: [0.86, 0.80, 0.62], worn: 0.06 });
  W.box(111, 147, 31, 112, 148, 46, M.METAL); W.box(112, 147, 42, 113, 148, 46, M.FLAG); W.box(113, 147, 42, 115, 148, 46, M.METAL_BORD);
  if (night) { W.set(116, 158, 17, M.BULB); W.light({ x: 116.5, y: 160, z: 17, r: 34, cr: 0.8, cg: 0.55, cb: 0.28, skip: 1.5 }); }

  // ------------------------------------------------ le club-house du Racing et la buvette du kop
  const CX = 204, CY = 100, CW = 96, CD = 56, CH = 34;
  W.box(CX, CY, 2, CX + CW, CY + CD, CH, M.BRICK);
  const cf = new Facade(W, LEFT, CX, CY, CW, CD);
  cf.rect(0, 18, CW, 19, -1, M.STONE);
  cf.rect(0, CH, CW, CH + 1, -1, M.STONE);
  cf.rect(0, 2, 2, CH, 0, M.STONE);
  B.flatRoof(W, CX, CY, CW, CD, CH, M.BRICK);
  // buvette
  cf.shop(3, 2, 24, 11, bad ? 'rideau' : 'buvette', { light: bad ? null : { r: 46, c: [0.75, 0.42, 0.18] } });
  cf.door(28, 2, 5, 11, { kind: bad ? 'rideau' : 'door', frame: false });
  cf.awning(2, 32, 14, 6, M.AWNING);
  if (!bad) {
    cf.sign(4, 32, 'BUVETTE', Object.assign({ scale: 2, depth: 0, light: { r: 52, c: [0.85, 0.24, 0.46] } }, NEON));
    cf.sign(11, 25, 'DU KOP', Object.assign({ scale: 1, depth: 0 }, NEON));
  } else {
    cf.sign(4, 32, 'BUVETTE', { scale: 2, depth: 0, fg: [0.30, 0.26, 0.26] });
    cf.poster(8, 20, 14, 4, { title: 'FERMÉ', bg: [0.85, 0.82, 0.72], fg: [0.42, 0.10, 0.16], seed: 9 });
  }
  cf.pipe(34, 2, CH);
  // entrée du club et boutique
  cf.door(37, 2, 8, 12, { mat: M.WOOD_DARK, step: true });
  cf.sign(35, 18, 'RACING AUBÉRIVE', { plate: [0.40, 0.11, 0.16], plateMat: M.METAL_BORD, fg: [0.86, 0.80, 0.62], worn: 0.04 });
  if (night) { cf.set(41, 15, -1, M.BULB); W.light(Object.assign(cf.front(41, 15, 2), { r: 26, cr: 0.75, cg: 0.5, cb: 0.25, skip: 1.5 })); }
  cf.shop(48, 3, 16, 10, 'boutique', { k: night ? 0.85 : 0.6, light: { r: 30, c: [0.5, 0.36, 0.22] } });
  cf.rect(48, 2, 64, 3, -1, M.STONE);
  cf.window(68, 4, 6, 9, { state: night ? 'office' : 'dark', shutter: null });
  cf.window(80, 4, 6, 9, { state: 'dark' });
  // premier étage
  cf.window(38, 23, 6, 8, { state: night ? 'office' : 'dark', sil: night ? 'chignon' : null, silX: 5 });
  cf.window(49, 23, 6, 8, { state: night ? 'office' : 'dark' });
  cf.window(60, 23, 6, 8, { state: 'dark' });
  cf.crest(69, 24, 4, 6);
  cf.window(76, 23, 6, 8, { state: night ? 'lit' : 'dark', sil: night ? 'head' : null, silX: 7, curtain: [0.6, 0.25, 0.2] });
  cf.window(87, 23, 6, 8, { state: night ? 'tv' : 'dark', seed: 3 });
  B.antenna(W, 232, 120, CH + 1, 13); B.antenna(W, 284, 110, CH + 1, 11); B.chimney(W, 266, 118, CH + 1, 6);
  for (const [vx, vy] of [[214, 112], [246, 130], [276, 138]]) { W.box(vx, vy, CH + 1, vx + 8, vy + 6, CH + 2, M.METAL); W.box(vx + 1, vy + 1, CH + 2, vx + 7, vy + 5, CH + 3, night ? M.SKYLIGHT : M.GLASS); }
  for (const [vx, vy] of [[224, 104], [258, 106], [292, 140]]) W.box(vx, vy, CH + 1, vx + 3, vy + 3, CH + 4, M.METAL);
  W.box(206, 102, CH + 1, 212, 108, CH + 8, M.CONCRETE);
  // côté droit du club-house
  const cr = new Facade(W, RIGHT, CX, CY, CW, CD);
  for (let s = 6; s < CD - 6; s += 12) { cr.window(s, 6, 5, 8, { state: 'dark' }); cr.window(s, 23, 5, 8, { state: R() < 0.3 && night ? 'lit' : 'dark' }); }
  // terrasse de la buvette
  if (!bad) {
    for (const tx of [208, 217, 226]) { B.terraceTable(W, tx, 158, G); B.chair(W, tx - 2, 158, G, 'x'); B.chair(W, tx + 3, 161, G, 'y'); }
    B.parasol(W, 214, 158, G);
    B.keg(W, 240, 157, G); B.keg(W, 240, 159, G); B.crates(W, 243, 157, G, 3);
  }
  B.moped(W, 268, 159, G, 'x');
  B.bin(W, 262, 157, G);

  // ------------------------------------------------ derrière : immeubles du fond (dans la brume)
  const back = (x0, y0, w, d, h, wall, roof) => {
    W.box(x0, y0, 2, x0 + w, y0 + d, h, wall);
    const fl = new Facade(W, LEFT, x0, y0, w, d), fr = new Facade(W, RIGHT, x0, y0, w, d);
    for (let z = 6; z < h - 8; z += 15) {
      for (let s = 4; s < w - 6; s += 10) fl.window(s, z, 5, 8, { state: night && R() < 0.3 ? 'lit' : 'dark', spill: false });
      for (let s = 4; s < d - 6; s += 10) fr.window(s, z, 5, 8, { state: night && R() < 0.25 ? 'lit' : 'dark', spill: false });
    }
    if (roof === 'flat') B.flatRoof(W, x0, y0, w, d, h, wall); else B.gableRoof(W, x0, y0, w, d, h, roof, { oh: 1, gable: wall });
  };
  back(206, 40, 50, 50, 46, M.PLASTER_GREY, M.SLATE);
  back(262, 30, 60, 58, 58, M.PLASTER_CREAM, 'flat');
  back(60, 210, 50, 40, 52, M.PLASTER_ROSE, M.TERRACOTTA);
  back(70, 256, 44, 46, 40, M.BRICK, M.SLATE);
  back(20, 214, 34, 36, 62, M.PLASTER_GREY, 'flat');

  // ------------------------------------------------ la rangée : tabac, laverie, pharmacie
  const shutter = [M.SHUTTER_GREEN, M.SHUTTER_BLUE, M.SHUTTER_GREY, M.SHUTTER_BORD];
  const winState = () => !night ? 'dark' : (() => { const r = R(); return r < 0.34 ? 'lit' : r < 0.42 ? 'tv' : 'dark'; })();
  const curtains = [[0.62, 0.30, 0.22], [0.55, 0.50, 0.32], [0.35, 0.40, 0.55], [0.55, 0.25, 0.35]];
  // T1 tabac (angle)
  W.box(116, 208, 2, 158, 246, 48, M.PLASTER_CREAM);
  const t1 = new Facade(W, RIGHT, 116, 208, 42, 38);
  t1.rect(0, 18, 38, 19, -1, M.STONE); t1.rect(0, 33, 38, 34, -1, M.STONE);
  t1.shop(18, 2, 16, 10, bad ? 'rideau' : 'tabac', { light: bad ? null : { r: 38, c: [0.7, 0.48, 0.24] } });
  t1.door(11, 2, 5, 10, { kind: 'door' });
  t1.sign(9, 18, 'TABAC · PRESSE', { plate: [0.12, 0.23, 0.17], plateMat: M.METAL_GREEN, fg: [0.86, 0.80, 0.62] });
  t1.blade(36, 21, 8, 3, M.RED_SIGN);
  if (night) W.light({ x: 161.5, y: 210, z: 25, r: 26, cr: 0.6, cg: 0.08, cb: 0.06, skip: 3 });
  for (const z of [22, 37]) for (const s of [4, 15, 26]) {
    const sh = shutter[0]; const st = winState(); const closed = st === 'dark' && R() < 0.5;
    t1.window(s, z, 6, 9, { state: st, shutter: sh, closed, curtain: curtains[Math.floor(R() * 4)], balcony: z === 22 && s === 15 ? 'plants' : null });
  }
  const t1top = B.mansard(W, 116, 208, 42, 38, 48, 12);
  B.dormer(W, RIGHT, 116, 208, 42, 38, 230, 49, { state: night && R() < 0.5 ? 'lit' : 'dark' });
  B.dormer(W, RIGHT, 116, 208, 42, 38, 214, 49, { state: 'dark' });
  B.chimney(W, 128, 214, t1top, 6); B.chimney(W, 128, 236, t1top, 5); B.antenna(W, 140, 226, t1top, 12);
  // T2 laverie
  W.box(120, 246, 2, 158, 290, 48, M.PLASTER_OCHRE);
  const t2 = new Facade(W, RIGHT, 120, 246, 38, 44);
  t2.rect(0, 20, 44, 21, -1, M.STONE);
  t2.shop(4, 2, 32, 11, bad ? 'rideau' : 'laverie', { light: bad ? null : { r: 46, c: [0.42, 0.50, 0.52] } });
  t2.door(37, 2, 5, 11, { kind: bad ? 'rideau' : 'door' });
  if (!bad) t2.sign(6, 20, 'LAVERIE', Object.assign({ scale: 2, depth: 0, light: { r: 46, c: [0.85, 0.24, 0.46] } }, NEON));
  for (const z of [24, 38]) for (const s of [5, 16, 27, 37]) {
    const st = winState(); const closed = st === 'dark' && R() < 0.45;
    t2.window(s, z, 5, 8, { state: st, shutter: shutter[1], closed, curtain: curtains[Math.floor(R() * 4)] });
  }
  t2.pipe(43, 2, 48);
  B.gableRoof(W, 120, 246, 38, 44, 48, M.TERRACOTTA, { axis: 'y', oh: 1, gable: M.PLASTER_OCHRE });
  B.chimney(W, 136, 260, 56, 8); B.antenna(W, 132, 280, 60, 10);
  // T3 pharmacie
  W.box(124, 290, 2, 158, 340, 33, M.PLASTER_BLUE);
  const t3 = new Facade(W, RIGHT, 124, 290, 34, 50);
  t3.rect(0, 18, 50, 19, -1, M.STONE);
  t3.shop(24, 2, 20, 10, 'pharmacie', { light: { r: 34, c: [0.40, 0.50, 0.45] } });
  t3.sign(22, 17, 'PHARMACIE', { plate: [0.12, 0.23, 0.17], plateMat: M.METAL_GREEN, fg: [0.86, 0.88, 0.84] });
  for (let k = 1; k <= 6; k++) for (let z = 15; z < 22; z++) if (k === 3 || k === 4 || z === 18 || z === 19) t3.set(46, z, -k, M.NEON_TEAL);
  W.light({ x: 162, y: 293.5, z: 18.5, r: 30, cr: 0.12, cg: 0.42, cb: 0.38, skip: 3 });
  for (const s of [20, 31, 42]) t3.window(s, 22, 5, 8, { state: winState(), shutter: shutter[2], curtain: curtains[Math.floor(R() * 4)] });
  B.gableRoof(W, 124, 290, 34, 50, 33, M.SLATE, { axis: 'y', oh: 1, gable: M.PLASTER_BLUE });

  // ------------------------------------------------ le square : kiosque, cabine, abribus, arbres
  B.kiosk(W, 214, 220, G, { headline: 'DERBY' });
  B.phoneBooth(W, 203, 230, G);
  // abribus côté avenue (fond côté square)
  W.box(250, 206, G, 266, 207, G + 11, M.BOOTH);
  W.box(250, 202, G, 251, 207, G + 11, M.METAL_DARK); W.box(265, 202, G, 266, 207, G + 11, M.METAL_DARK);
  W.box(249, 201, G + 11, 267, 208, G + 12, M.METAL);
  W.box(266, 202, G + 1, 267, 206, G + 10, M.LIT_PANEL);
  { const f = new Facade(W, RIGHT, 266, 202, 1, 4); f.poster(0, G + 1, 4, 9, { title: 'SAMEDI', bg: [0.80, 0.76, 0.66], fg: [0.42, 0.10, 0.16], band: [0.42, 0.10, 0.16], lit: night ? 0.75 : 0, seed: 5, depth: 0 }); }
  W.box(252, 204, G + 2, 264, 206, G + 3, M.WOOD);
  if (night) W.light({ x: 268, y: 204, z: 8, r: 18, cr: 0.5, cg: 0.52, cb: 0.48, shadow: false });
  for (let y = 212; y < 232; y += 5) B.bollard(W, 203, y, G);
  B.bench(W, 236, 250, G, 'x'); B.bench(W, 280, 236, G, 'y'); B.bin(W, 247, 248, G);
  W.box(212, 217, 2, 340, 219, 4, M.HEDGE);
  B.planeTree(W, 262, 228, G, { seed: 11, trunk: 16, r: 9 });
  B.planeTree(W, 304, 226, G, { seed: 12, trunk: 18, r: 10 });
  B.planeTree(W, 197, 118, G, { seed: 13, trunk: 17, r: 9 });
  B.planeTree(W, 230, 286, G, { seed: 14, trunk: 16, r: 9 });

  // ------------------------------------------------ voitures et lampadaires
  B.car(W, 262, 192, 1, 'x', M.CAR_BEIGE);
  B.car(W, 224, 191, 1, 'x', M.CAR_BLUE);
  B.car(W, 186, 228, 1, 'y', M.CAR_BORD);
  B.car(W, 60, 166, 1, 'x', M.CAR_WHITE);
  // une voiture qui arrive vers le carrefour, phares allumés
  B.car(W, 108, 168, 1, 'x', M.CAR_WHITE);
  if (night) {
    for (const yy of [169, 174]) { W.set(126, yy, 4, M.HEADLIGHT); W.set(108, yy, 4, M.TAILLIGHT); }
    W.set(126, 170, 4, M.HEADLIGHT); W.set(126, 173, 4, M.HEADLIGHT);
    W.light({ x: 128.5, y: 172, z: 4.5, r: 95, fall: 1.5, cr: 1.15, cg: 1.08, cb: 0.85, axis: [0.985, 0, -0.17], c0: 0.82, c1: 0.97, spill: 0, skip: 1 });
    W.light({ x: 106.5, y: 172, z: 4, r: 16, cr: 0.6, cg: 0.05, cb: 0.04, shadow: false });
  }
  const lamp = (x, y, dx, dy) => B.streetLamp(W, x, y, G, dx, dy, { on: night && !(bad && x === 248) });
  lamp(150, 160, 0, 1); lamp(199, 146, -1, 0); lamp(248, 160, 0, 1); lamp(161, 228, 1, 0); lamp(222, 204, 0, -1); lamp(300, 204, 0, -1); lamp(161, 300, 1, 0); lamp(84, 160, 0, 1); lamp(246, 236, 0, 1);

  // ------------------------------------------------ les gens
  const sp = (def, x, y, z, extra = {}) => W.sprites.push(Object.assign({ x, y, z }, def, extra));
  if (!night) {
    sp(S.COACH, 228.5, 228, G);
    sp(S.GEGE, 234.5, 157.3, G);
    sp(S.FAN, 222, 162.5, G);
    sp(S.KID, 120, 161, G); sp(S.KID, 126, 162.5, G); sp(S.BALL, 123, 163, G);
    sp(S.COAT, 168.5, 236, G);
    sp(S.WALKER, 300, 204, G); sp(S.WALKER2, 302.5, 203, G); sp(S.WALKER2, 160, 270, G);
    sp(S.CAT, 190, 236, 10);
  } else if (bad) {
    sp(S.COACH, 181, 190, 1);
    sp(S.KID, 164, 205, G);
    sp(S.COAT, 120, 160, G);
    sp(S.CAT, 190, 236, 10);
  } else {
    if (o.coach) sp(S.COACH, o.coach[0], o.coach[1], o.coach[2]); else sp(S.COACH, 181, 190, 1);
    sp(S.GEGE, 234.5, 157.3, G);
    sp(S.FAN_SIT, 211.5, 160.5, G); sp(S.FAN, 222, 162.5, G);
    sp(S.KID, 106, 160.5, G); sp(S.BALL, 110, 162, G);
    sp(S.COAT, 227.5, 226, G);
    sp(S.CAT, 190, 236, 10);
    sp(S.WALKER, 292, 204, G); sp(S.WALKER2, 294.5, 203, G);
  }

  // ------------------------------------------------ la coupe : au-delà, la brume et la Capitale
  for (let y = 0; y < W.Y; y++) for (let x = 0; x < W.X; x++) if (x + y < 176) for (let z = 0; z < W.Z; z++) W.mat[W.idx(x, y, z)] = 0;
  return W;
}

// ------------------------------------------------ ciel de nuit et skyline de la Capitale
function nightSky(FW, FH, o) {
  const N = FW * FH;
  const col = new Float32Array(N * 3), emi = new Float32Array(N * 3), fog = new Float32Array(N * 3);
  const Hb = o.horizon, fl = o.flood;
  const top = [0.04, 0.03, 0.04], hor = [0.17, 0.13, 0.122];
  const R = rng(4242);
  const glow = (x, y) => { const dx = x - fl[0], dy = y - fl[1]; return Math.exp(-(dx * dx + dy * dy) / (2 * 78 * 78)); };
  for (let y = 0; y < FH; y++) for (let x = 0; x < FW; x++) {
    const k = (y * FW + x) * 3;
    const t = clamp(y / Hb, 0, 1), kk = Math.pow(t, 1.7);
    let r = top[0] + (hor[0] - top[0]) * kk, g = top[1] + (hor[1] - top[1]) * kk, b = top[2] + (hor[2] - top[2]) * kk;
    if (y < Hb - 4) {
      const cl = fbm(x / 64, y / 11, 501, 4);
      const d = clamp((cl - 0.52) * 3.2, 0, 1) * (0.35 + 0.65 * t);
      r += 0.05 * d; g += 0.032 * d; b += 0.026 * d;
    }
    const gl = glow(x, y);
    const hg = Math.exp(-((y - Hb) ** 2) / (2 * 20 * 20)) * (0.55 + 0.45 * (1 - x / FW));
    r += 0.20 * gl + 0.06 * hg; g += 0.19 * gl + 0.035 * hg; b += 0.17 * gl + 0.018 * hg;
    col[k] = r; col[k + 1] = g; col[k + 2] = b;
    fog[k] = hor[0] + 0.13 * gl + 0.03 * hg; fog[k + 1] = hor[1] + 0.125 * gl + 0.018 * hg; fog[k + 2] = hor[2] + 0.11 * gl + 0.01 * hg;
  }
  // quelques étoiles timides en haut
  for (let i = 0; i < 26; i++) { const x = Math.floor(R() * FW), y = Math.floor(R() * Hb * 0.45); const k = (y * FW + x) * 3; const v = 0.12 + R() * 0.12; col[k] += v; col[k + 1] += v * 0.95; col[k + 2] += v * 0.9; }
  const put = (x, y, c, e) => { if (x < 0 || y < 0 || x >= FW || y >= FH) return; const k = (y * FW + x) * 3; col[k] = c[0]; col[k + 1] = c[1]; col[k + 2] = c[2]; if (e) { col[k] += e[0]; col[k + 1] += e[1]; col[k + 2] += e[2]; emi[k] = e[0]; emi[k + 1] = e[1]; emi[k + 2] = e[2]; } };
  const rect = (x0, y0, w, h, c) => { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) put(x, y, c); };
  const WIN = [[0.55, 0.40, 0.20], [0.45, 0.45, 0.40], [0.50, 0.30, 0.16]];
  const tower = (x0, w, h, c, p) => {
    rect(x0, Hb - h, w, h + 3, c);
    for (let y = Hb - h + 2; y < Hb - 1; y += 2) for (let x = x0 + 1; x < x0 + w - 1; x += 2) if (R() < p) put(x, y, c, WIN[Math.floor(R() * 3)]);
  };
  const FAR = [0.135, 0.105, 0.108], MID = [0.10, 0.08, 0.084], NEAR = [0.075, 0.06, 0.064];
  // couche lointaine : la Capitale
  let x = -6;
  while (x < FW) { const w = 6 + Math.floor(R() * 16), h = 5 + Math.floor(R() * 16); tower(x, w, h, FAR, 0.10); x += w - 1; }
  tower(118, 12, 44, FAR, 0.22); tower(132, 9, 36, FAR, 0.2); tower(152, 14, 30, FAR, 0.18); tower(176, 8, 40, FAR, 0.25); tower(520, 10, 34, FAR, 0.18); tower(612, 13, 28, FAR, 0.15);
  // la Fédération : un fronton
  rect(232, Hb - 14, 40, 14, FAR);
  for (let i = 0; i < 9; i++) rect(232 + i * 4 + 1, Hb - 12, 2, 10, [0.16, 0.13, 0.13]);
  for (let i = 0; i <= 22; i++) rect(230 + i, Hb - 15 - Math.floor(Math.min(i, 44 - i) / 3), 1, 2, FAR);
  for (let i = 22; i <= 44; i++) rect(230 + i, Hb - 15 - Math.floor((44 - i) / 3), 1, 2, FAR);
  // le Grand Stade : une couronne éclairée
  for (let xx = 470; xx <= 600; xx++) { const t = (xx - 535) / 65; if (Math.abs(t) > 1) continue; const hh = Math.round(13 * Math.sqrt(1 - t * t)); rect(xx, Hb - 4 - hh, 1, hh + 6, MID); if (xx % 3 === 0) put(xx, Hb - 4 - hh, MID, [0.55, 0.53, 0.45]); }
  // la grue
  rect(440, Hb - 50, 2, 50, MID); rect(392, Hb - 51, 92, 2, MID); rect(392, Hb - 50, 12, 4, MID);
  put(483, Hb - 51, MID, [0.9, 0.08, 0.12]);
  // l'antenne de Télé-Stade
  for (let y = 6; y < Hb; y++) { const half = Math.floor((y - 6) / 18) + 1; put(64 - half, y, MID); put(64 + half, y, MID); if (y % 4 === 0) for (let xx = 64 - half; xx <= 64 + half; xx++) put(xx, y, MID); }
  rect(63, 2, 3, 4, MID); put(64, 1, MID, [1.1, 0.10, 0.16]); put(64, 2, MID, [1.0, 0.08, 0.14]);
  // couches proches : les faubourgs
  x = -4; while (x < FW) { const w = 8 + Math.floor(R() * 20), h = 2 + Math.floor(R() * 9); tower(x, w, h, MID, 0.06); x += w + Math.floor(R() * 4); }
  x = -4; while (x < FW) { const w = 10 + Math.floor(R() * 26), h = 1 + Math.floor(R() * 5); rect(x, Hb + 2 - h, w, h + 4, NEAR); x += w + Math.floor(R() * 6); }
  // brume au pied de l'horizon
  for (let y = Hb - 6; y < FH; y++) for (let xx = 0; xx < FW; xx++) {
    const t = clamp((y - (Hb - 6)) / 10, 0, 1), k = (y * FW + xx) * 3;
    col[k] = col[k] * (1 - t) + fog[k] * t; col[k + 1] = col[k + 1] * (1 - t) + fog[k + 1] * t; col[k + 2] = col[k + 2] * (1 - t) + fog[k + 2] * t;
    emi[k] *= 1 - t; emi[k + 1] *= 1 - t; emi[k + 2] *= 1 - t;
  }
  const out6 = [0, 0, 0, 0, 0, 0], out3 = [0, 0, 0];
  return {
    backdrop: (px, py) => { const k = (py * FW + px) * 3; out6[0] = col[k]; out6[1] = col[k + 1]; out6[2] = col[k + 2]; out6[3] = emi[k]; out6[4] = emi[k + 1]; out6[5] = emi[k + 2]; return out6; },
    fog: (px, py) => { const k = (py * FW + px) * 3; out3[0] = fog[k]; out3[1] = fog[k + 1]; out3[2] = fog[k + 2]; return out3; },
  };
}

function daySky(FW, FH, o) {
  const N = FW * FH;
  const col = new Float32Array(N * 3), fog = new Float32Array(N * 3);
  const Hb = o.horizon;
  const top = [0.50, 0.58, 0.66], hor = [0.80, 0.77, 0.70], haze = [0.74, 0.72, 0.67];
  const R = rng(4243);
  for (let y = 0; y < FH; y++) for (let x = 0; x < FW; x++) {
    const k = (y * FW + x) * 3, t = clamp(y / Hb, 0, 1), kk = Math.pow(t, 1.3);
    let r = top[0] + (hor[0] - top[0]) * kk, g = top[1] + (hor[1] - top[1]) * kk, b = top[2] + (hor[2] - top[2]) * kk;
    const cl = fbm(x / 80, y / 12, 601, 4); const d = clamp((cl - 0.5) * 3, 0, 1);
    r += (0.92 - r) * d * 0.6; g += (0.90 - g) * d * 0.6; b += (0.86 - b) * d * 0.6;
    col[k] = r; col[k + 1] = g; col[k + 2] = b; fog[k] = haze[0]; fog[k + 1] = haze[1]; fog[k + 2] = haze[2];
  }
  const put = (x, y, c) => { if (x < 0 || y < 0 || x >= FW || y >= FH) return; const k = (y * FW + x) * 3; col[k] = c[0]; col[k + 1] = c[1]; col[k + 2] = c[2]; };
  const rect = (x0, y0, w, h, c) => { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) put(x, y, c); };
  const FAR = [0.62, 0.64, 0.66], MID = [0.55, 0.56, 0.58];
  let x = -6; while (x < FW) { const w = 6 + Math.floor(R() * 16), h = 5 + Math.floor(R() * 16); rect(x, Hb - h, w, h + 3, FAR); x += w - 1; }
  rect(118, Hb - 44, 12, 44, FAR); rect(132, Hb - 36, 9, 36, FAR); rect(152, Hb - 30, 14, 30, FAR); rect(176, Hb - 40, 8, 40, FAR); rect(520, Hb - 34, 10, 34, FAR); rect(612, Hb - 28, 13, 28, FAR);
  rect(232, Hb - 14, 40, 14, FAR); for (let i = 0; i <= 44; i++) rect(230 + i, Hb - 15 - Math.floor(Math.min(i, 44 - i) / 3), 1, 2, FAR);
  for (let xx = 470; xx <= 600; xx++) { const t = (xx - 535) / 65; if (Math.abs(t) > 1) continue; const hh = Math.round(13 * Math.sqrt(1 - t * t)); rect(xx, Hb - 4 - hh, 1, hh + 6, MID); }
  rect(440, Hb - 50, 2, 50, MID); rect(392, Hb - 51, 92, 2, MID); rect(392, Hb - 50, 12, 4, MID);
  for (let y = 6; y < Hb; y++) { const half = Math.floor((y - 6) / 18) + 1; put(64 - half, y, MID); put(64 + half, y, MID); if (y % 4 === 0) for (let xx = 64 - half; xx <= 64 + half; xx++) put(xx, y, MID); }
  x = -4; while (x < FW) { const w = 8 + Math.floor(R() * 20), h = 2 + Math.floor(R() * 9); rect(x, Hb - h, w, h + 3, MID); x += w + Math.floor(R() * 4); }
  for (let y = Hb - 6; y < FH; y++) for (let xx = 0; xx < FW; xx++) { const t = clamp((y - (Hb - 6)) / 10, 0, 1), k = (y * FW + xx) * 3; for (let c = 0; c < 3; c++) col[k + c] = col[k + c] * (1 - t) + fog[k + c] * t; }
  const out6 = [0, 0, 0, 0, 0, 0], out3 = [0, 0, 0];
  return {
    backdrop: (px, py) => { const k = (py * FW + px) * 3; out6[0] = col[k]; out6[1] = col[k + 1]; out6[2] = col[k + 2]; return out6; },
    fog: (px, py) => { const k = (py * FW + px) * 3; out3[0] = fog[k]; out3[1] = fog[k + 1]; out3[2] = fog[k + 2]; return out3; },
  };
}

function renderQuartier(o = {}) {
  if (o.time === 'day') {
    const W = buildQuartier(o);
    const FW = o.width || 656, FH = o.height || 370, cu = -328, cv = 130;
    const sky = daySky(FW, FH, { horizon: 48 });
    const opt = {
      width: FW, height: FH, cu, cv,
      ambient: [0.50, 0.50, 0.55], faceAmb: [1.0, 0.80, 0.62],
      sun: [1.0, 0.92, 0.78], sunDir: norm(-0.35, 0.40, 0.85),
      backdrop: sky.backdrop, fogColor: sky.fog, fogS0: 180, fogS1: 262,
      wetRow: 30, reflAmb: [0.5, 0.48, 0.45], wetStrength: 0.55, emitScale: 0.35,
      bloom: null, levels: 48, lightQuant: 6, outlineDark: 0.62, lift: [0.0, 0.0, 0.0],
    };
    return { W, res: E.render(W, opt) };
  }
  const W = buildQuartier(o);
  const FW = o.width || 656, FH = o.height || 370, cu = o.cu != null ? o.cu : -328, cv = o.cv != null ? o.cv : 130;
  const sky = nightSky(FW, FH, { horizon: 48, flood: [2 * (148 - 142) - cu, 148 + 142 - 2 * 72 - cv] });
  const opt = {
    width: FW, height: FH, cu, cv,
    ambient: o.ambient || [0.095, 0.085, 0.115], faceAmb: [1.0, 0.74, 0.55],
    sun: o.moon || [0.12, 0.125, 0.18], sunDir: norm(-0.35, 0.40, 0.85),
    backdrop: sky.backdrop, fogColor: sky.fog, fogS0: 180, fogS1: 262,
    wetSky: [0.10, 0.085, 0.085], wetRow: 36, reflAmb: [0.12, 0.10, 0.11], wetStrength: 0.8,
    bloom: [[2, 0.45], [8, 0.32]], levels: 44, lightQuant: 6,
  };
  return { W, res: E.render(W, opt) };
}

module.exports = { buildQuartier, renderQuartier, nightSky };

if (require.main === module) {
  const t = Date.now();
  const mood = process.argv[2] || 'good', time = process.argv[3] || 'night';
  const { res } = renderQuartier({ mood, time });
  const out = process.argv[4] || __dirname + `/out/quartier_${time}_${mood}.png`;
  E.writePNG(out, res.img, res.FW, res.FH, 1);
  E.writePNG(out.replace('.png', '_x2.png'), res.img, res.FW, res.FH, 2);
  console.log('écrit', out, Date.now() - t, 'ms');
}
