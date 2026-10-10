'use strict';
// Les images de la planche « la zone jouable » :
//   - la zone entière de nuit, réduite pour tenir dans la planche (out/zone_pano.png) et la position de ses lieux ;
//   - un écran de jeu par quartier, au format des cases (328 × 184, affiché × 2) : out/zs_<clé>.png.
//   node zone_shots.js [pano] [écrans]
const fs = require('fs');
const path = require('path');
const E = require('./engine');
const Z = require('./zone');

const OUT = path.join(__dirname, 'out');
const args = process.argv.slice(2);
const doPano = !args.length || args.includes('pano');
const doShots = !args.length || args.includes('ecrans');

// Réduction par moyenne de surface (la vue d'ensemble n'est pas du pixel art à l'échelle : c'est une maquette).
function shrink(img, W, H, w, h) {
  const out = Buffer.alloc(w * h * 3), sx = W / w, sy = H / h;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const x0 = x * sx, x1 = x0 + sx, y0 = y * sy, y1 = y0 + sy;
    let r = 0, g = 0, b = 0, a = 0;
    for (let yy = Math.floor(y0); yy < Math.ceil(y1); yy++) {
      const wy = Math.min(yy + 1, y1) - Math.max(yy, y0);
      for (let xx = Math.floor(x0); xx < Math.ceil(x1); xx++) {
        const wx = Math.min(xx + 1, x1) - Math.max(xx, x0), k = (yy * W + xx) * 3, wt = wx * wy;
        r += img[k] * wt; g += img[k + 1] * wt; b += img[k + 2] * wt; a += wt;
      }
    }
    // une maquette vue de loin : un peu plus claire que l'écran de jeu, pour qu'on lise les quartiers
    const k = (y * w + x) * 3, ex = 1.3; out[k] = Math.min(255, Math.round(ex * r / a)); out[k + 1] = Math.min(255, Math.round(ex * g / a)); out[k + 2] = Math.min(255, Math.round(ex * b / a));
  }
  return out;
}

const SHOTS = [
  // clé, heure, ambiance, centre au sol (x, y), lieu à viser si le quartier l'a déclaré
  { key: 'stade', time: 'night', x: 510, y: 600 },
  { key: 'quais', time: 'dusk', x: 610, y: 336 },
  { key: 'vieilleville', time: 'day', place: 'mairie', x: 515, y: 150, cut: false },
  { key: 'sport', time: 'day', x: 846, y: 500, cut: false },
  { key: 'sante', time: 'night', x: 884, y: 740, front: 46 },
  { key: 'cimetiere', time: 'dawn', x: 130, y: 500, front: 40 },
  { key: 'friche', time: 'night', x: 200, y: 712, front: 46 },
  { key: 'residentiel', time: 'dusk', place: 'appartement', x: 400, y: 900 },
];

const meta = fs.existsSync(path.join(OUT, 'zone_meta.json')) ? JSON.parse(fs.readFileSync(path.join(OUT, 'zone_meta.json'))) : {};
const t0 = Date.now();

if (doPano) {
  const W = Z.buildZone({ time: 'night', mood: 'good' });
  const FW = 4 * Z.N + 40, FH = 2 * Z.N + 260, cu = -2 * Z.N - 20, cv = -240;
  const r = Z.view(W, { time: 'night', width: FW, height: FH, cu, cv, horizon: 900 });
  const w = 1360, h = Math.round(FH * w / FW);
  E.writePNG(path.join(OUT, 'zone_pano.png'), shrink(r.img, FW, FH, w, h), w, h, 1);
  const k = w / FW;
  meta.pano = { w, h, places: W.places.map(p => ({ key: p.key, label: p.label, district: p.district, x: Math.round((2 * (p.x - p.y) - cu) * k), y: Math.round((p.x + p.y - 2 * (p.z + 10) - cv) * k) })) };
  // l'empreinte d'un écran de jeu (656 × 370 en natif), pour la dessiner sur la vue d'ensemble
  meta.pano.screen = { w: Math.round(656 * k), h: Math.round(370 * k) };
  meta.pano.project = { cu, cv, k };
  // le lundi de la planche 1, à pied : chaque étape (numéro, x, y), et des points de passage (numéro vide) par les rues
  const ap = W.places.find(p => p.key === 'appartement') || { x: 447, y: 932 };
  meta.route = [['1', ap.x, ap.y], ['', 510, ap.y], ['', 510, 602], ['2–4', 571, 590], ['', 689, 602], ['', 689, 515], ['5', 850, 515],
    ['', 689, 515], ['', 689, 602], ['6', 545, 598]];
  console.log('vue d\'ensemble', w, h, W.places.length, 'lieux', Date.now() - t0, 'ms');
}

if (doShots) {
  const byTime = {};
  for (const s of SHOTS) (byTime[s.time] = byTime[s.time] || []).push(s);
  meta.shots = meta.shots || {};
  for (const [time, list] of Object.entries(byTime)) {
    const W = Z.buildZone({ time, mood: 'good' });
    for (const s of list) {
      let x = s.x, y = s.y;
      const p = s.place && W.places.find(q => q.key === s.place);
      if (p && s.usePlace !== false) { x = p.x; y = p.y + 10; }
      const r = Z.screen(W, x, y, { time, width: 328, height: 184, row: 112, front: s.front, cut: s.cut });
      E.writePNG(path.join(OUT, `zs_${s.key}.png`), r.img, 328, 184, 1);
      meta.shots[s.key] = { time, x, y };
      console.log('écran', s.key, time, x, y);
    }
  }
}
fs.writeFileSync(path.join(OUT, 'zone_meta.json'), JSON.stringify(meta, null, 1));
console.log('fini en', Date.now() - t0, 'ms');
