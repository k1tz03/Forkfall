'use strict';
// Banc d'essai d'un quartier, seul sur son socle :
//   node district_test.js district_xxx.js [night|day|dusk] [good|bad] [zoomX zoomY]
// Écrit out/test_<nom>_<heure>.png (tout le quartier, 1 pixel = 1 pixel)
// et out/test_<nom>_<heure>_zoom.png (un écran de jeu 656×370, agrandi ×2).
const path = require('path');
const E = require('./engine');
const { M } = require('./mats');
require('./diorama');
const { lighting } = require('./presets');

const [, , file, time = 'night', mood = 'good', zx, zy] = process.argv;
const D = require(path.resolve(file));
const pad = 34;
const W = new E.World(D.w + 2 * pad, D.h + 2 * pad, 110, 10);
W.baseWet = time === 'day' ? 0.06 : 0.16;
// socle : terre, trottoir partout, une rue tout autour (le contexte que le maître dessine)
W.box(0, 0, -10, W.X, W.Y, 0, M.SOIL);
W.box(0, 0, 0, W.X, W.Y, 2, M.SIDEWALK);
const road = (x0, y0, x1, y1) => W.box(x0, y0, 0, x1, y1, 2, 0) || W.box(x0, y0, 0, x1, y1, 1, M.ASPHALT);
road(0, 0, W.X, pad - 8); road(0, W.Y - pad + 8, W.X, W.Y); road(0, 0, pad - 8, W.Y); road(W.X - pad + 8, 0, W.X, W.Y);
W.at(pad, pad);
const t0 = Date.now();
const out = D.build(W, { w: D.w, h: D.h, night: time !== 'day', time, mood, R: E.rng(D.seed || 7), G: 2 }) || {};
W.at(0, 0);
// cadrage : tout le quartier
let u0 = 1e9, u1 = -1e9, v0 = 1e9, v1 = -1e9;
for (let z = 0; z < W.Z; z++) for (let y = pad - 6; y < pad + D.h + 6; y++) for (let x = pad - 6; x < pad + D.w + 6; x++) {
  if (!W.mat[(z * W.Y + y) * W.X + x]) continue;
  const u = 2 * (x - y), v = x + y - 2 * (z + 1);
  if (u < u0) u0 = u; if (u + 2 > u1) u1 = u + 2; if (v < v0) v0 = v; if (v + 4 > v1) v1 = v + 4;
}
const FW = Math.min(3000, u1 - u0 + 16), FH = Math.min(2000, v1 - v0 + 16);
const cu = u0 - 8, cv = v0 - 8;
const day = time === 'day';
const bg = day ? [0.66, 0.66, 0.66] : [0.06, 0.045, 0.04];
const b6 = [bg[0], bg[1], bg[2], 0, 0, 0];
const L = lighting(time);
const opt = Object.assign({ width: FW, height: FH, cu, cv, backdrop: () => b6, fogColor: () => bg, fogS0: -2000, fogS1: -1000, wetSky: bg }, L);
const res = E.render(W, opt);
const name = path.basename(file, '.js').replace(/^district_/, '');
E.writePNG(path.join(__dirname, 'out', `test_${name}_${time}.png`), res.img, res.FW, res.FH, 1);
// un écran de jeu, au centre du quartier (ou à zx, zy donnés en coordonnées locales du quartier)
const cx = zx != null ? +zx + pad : pad + D.w / 2, cy = zy != null ? +zy + pad : pad + D.h / 2;
const zu = Math.round(2 * (cx - cy) - 328), zv = Math.round(cx + cy - 4 - 185);
const res2 = E.render(W, Object.assign({}, opt, { width: 656, height: 370, cu: zu, cv: zv, log: false }));
E.writePNG(path.join(__dirname, 'out', `test_${name}_${time}_zoom.png`), res2.img, 656, 370, 2);
console.log(`quartier ${name} ${D.w}×${D.h} : construit et rendu en ${Date.now() - t0} ms, image ${FW}×${FH}`);
for (const p of out.places || []) console.log('  lieu', p.key, p.label, [p.x, p.y, p.z].join(','));
