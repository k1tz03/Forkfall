'use strict';
// Les images de la version jouable : la zone entière à une heure donnée, sa profondeur, la grille
// où l'on peut marcher et la position des lieux.
//   node ville_assets.js day|dusk|night [grille]
// Sorties dans out/ville/ :
//   <heure>.png        l'image de la zone (4040 × 2260, 1 pixel = 1 pixel)
//   <heure>_prof.png   la profondeur de chaque pixel (x + y + z du voxel touché), codée sur deux
//                      octets (rouge = poids fort, vert = poids faible), × 8 ; 0 = le ciel
//   grille_<heure>.json  (avec « grille ») où l'on peut marcher, par cases de 4 × 4 voxels
//   lieux.json         les lieux, leur entrée sur la grille et leur position à l'écran
const fs = require('fs');
const path = require('path');
const E = require('./engine');
const Z = require('./zone');
const { M } = require('./mats');

const time = process.argv[2] || 'day';
const doGrid = process.argv.includes('grille');
const OUT = path.join(__dirname, 'out', 'ville');
fs.mkdirSync(OUT, { recursive: true });

const N = Z.N, ZL = 10, QX = Z.QX, QY = Z.QY;
const FW = 4 * N + 40, FH = 2 * N + 260, CU = -2 * N - 20, CV = -240;
const t0 = Date.now();
const W = Z.buildZone({ time, mood: 'good', people: false });
console.log(time, 'zone construite', Date.now() - t0, 'ms');

const r = Z.view(W, { time, width: FW, height: FH, cu: CU, cv: CV, horizon: 900 });
E.writePNG(path.join(OUT, `${time}.png`), r.img, FW, FH, 1);
const dimg = Buffer.alloc(FW * FH * 3);
for (let k = 0; k < FW * FH; k++) {
  const d = r.dv[k];
  if (d < -1e8) continue;
  const q = Math.max(1, Math.min(65535, Math.round(d * 8) + 1));
  dimg[k * 3] = q >> 8; dimg[k * 3 + 1] = q & 255;
}
E.writePNG(path.join(OUT, `${time}_prof.png`), dimg, FW, FH, 1);
console.log(time, 'image et profondeur', Date.now() - t0, 'ms');

if (doGrid) {
  // Une colonne est praticable si son sol est à hauteur de rue (le dessus de la dalle, un trottoir,
  // une marche) et si deux mètres au-dessus sont libres. L'eau ne l'est pas.
  const water = new Set([M.RIVER2].filter(x => x != null));
  const C = 4, G = N / C;
  const col = new Uint8Array(N * N);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    let top = -99;
    for (let z = 4; z >= -9; z--) { if (W.get(x, y, z)) { top = z; break; } }
    if (top < 0 || top > 3) continue;
    if (water.has(W.get(x, y, top))) continue;
    let free = true;
    for (let z = top + 1; z <= top + 10; z++) if (W.get(x, y, z)) { free = false; break; }
    if (free) col[y * N + x] = 1;
  }
  const bits = new Uint8Array(Math.ceil(G * G / 8));
  let nwalk = 0;
  for (let gy = 0; gy < G; gy++) for (let gx = 0; gx < G; gx++) {
    let n = 0;
    for (let j = 0; j < C; j++) for (let i = 0; i < C; i++) n += col[(gy * C + j) * N + gx * C + i];
    if (n >= 14) { const k = gy * G + gx; bits[k >> 3] |= 1 << (k & 7); nwalk++; }
  }
  fs.writeFileSync(path.join(OUT, `grille_${time}.json`), JSON.stringify({ cell: C, size: G, bits: Buffer.from(bits).toString('base64') }));
  console.log(time, 'grille', G, '×', G, ':', nwalk, 'cases praticables');

  // Les lieux : ceux que les quartiers ont déclarés, et ceux du quartier du stade, posés à la main
  // devant leur porte (scene_quartier.js : coordonnées locales + QX, QY).
  const places = W.places.map(p => ({ key: p.key, label: p.label, x: p.x, y: p.y, z: p.z, district: p.district.replace(/^district_|\.js$/g, '') }));
  const Gq = 2;
  const add = (key, label, x, y, z) => places.push({ key, label, x: QX + x, y: QY + y, z: Gq + z, district: 'stade' });
  add('stade', 'Le stade de la Rive', 112, 159, 30);
  add('clubhouse', 'Le club-house du Racing', 245, 157, 36);
  add('buvette', 'La buvette du kop', 216, 157, 30);
  add('boutique', 'La boutique du club', 260, 157, 22);
  add('tabac_stade', 'Le tabac-presse', 159, 221, 34);
  add('laverie', 'La laverie', 159, 266, 30);
  const walk = (gx, gy) => gx >= 0 && gy >= 0 && gx < G && gy < G && (bits[(gy * G + gx) >> 3] >> ((gy * G + gx) & 7) & 1);
  for (const p of places) {
    // l'entrée : la case praticable la plus proche du pied de la façade
    const cx = Math.floor(p.x / C), cy = Math.floor(p.y / C);
    let best = null, bd = 1e9;
    for (let dy = -12; dy <= 12; dy++) for (let dx = -12; dx <= 12; dx++) {
      if (!walk(cx + dx, cy + dy)) continue;
      const d = dx * dx + dy * dy - 0.3 * (dx + dy); // de préférence devant (vers la caméra)
      if (d < bd) { bd = d; best = [cx + dx, cy + dy]; }
    }
    p.door = best;
    p.u = Math.round(2 * (p.x - p.y) - CU);
    p.v = Math.round(p.x + p.y - 2 * (p.z + ZL) - CV);
    if (!best) console.log('  sans entrée :', p.key);
  }
  fs.writeFileSync(path.join(OUT, 'lieux.json'), JSON.stringify({ projection: { cu: CU, cv: CV, zl: ZL, w: FW, h: FH }, places }, null, 1));
  console.log(places.length, 'lieux');
}
console.log(time, 'fini en', Date.now() - t0, 'ms');
