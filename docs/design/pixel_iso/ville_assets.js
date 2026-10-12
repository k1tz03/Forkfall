'use strict';
// Les images de la version jouable : la zone entière à une heure donnée, sa profondeur, la grille
// où l'on peut marcher et la position des lieux.
//   node ville_assets.js day|dusk|night [grille] [petit]
// LE GRAND AUBÉRIVE (docs/histoires/grand_auberive.md) : le monde de 1 800 voxels, la ville au
// centre, le boulevard de ceinture, les quatre quartiers, et le paysage qui continue au-delà
// (fond.js) ; `petit` refait l'ancienne zone de 1 000 voxels, sous son ciel.
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
const F = require('./fond');
const { M } = require('./mats');

const time = process.argv[2] || 'day';
const doGrid = process.argv.includes('grille');
const GRAND = !process.argv.includes('petit');
const OUT = path.join(__dirname, 'out', 'ville');
fs.mkdirSync(OUT, { recursive: true });

const N = GRAND ? Z.NG : Z.N, ZL = 10, QX = Z.QX, QY = Z.QY, O = GRAND ? Z.OG : 0;
// au-dessus du coin du fond, la place du ciel et des tours des Hauts
const FW = 4 * N + 40, FH = 2 * N + (GRAND ? 340 : 260), CU = -2 * N - 20, CV = GRAND ? -300 : -240;
const HORIZON = 220;
const t0 = Date.now();
const W = Z.buildZone({ time, mood: 'good', people: false, grand: GRAND });
console.log(time, 'zone construite', Date.now() - t0, 'ms', W.lights.length, 'lumières');

const r = GRAND
  ? Z.view(W, { time, width: FW, height: FH, cu: CU, cv: CV, fond: F.fond({ time, cu: CU, cv: CV, width: FW, height: FH, N, ZL, bords: W.bords, horizon: HORIZON, W }) })
  : Z.view(W, { time, width: FW, height: FH, cu: CU, cv: CV, horizon: 900 });
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

// La brume des quartiers fermés : pour chaque quartier, au quart de la résolution, les pixels où l'on
// voit l'un de ses voxels (la tour entière, pas seulement son pied) ; la page la pose par-dessus la
// ville tant que le quartier n'est pas ouvert. Écrite une fois (de jour : la géométrie la plus pleine).
if (GRAND && time === 'day') {
  const Q = 4, MW = Math.ceil(FW / Q), MH = Math.ceil(FH / Q);
  for (const q of W.grand.quartiers) {
    const m = Buffer.alloc(MW * MH * 4);
    for (let py = 0; py < FH; py++) for (let px = 0; px < FW; px++) {
      const k = py * FW + px;
      if (r.face[k] < 0) continue;
      const s = r.sB[k], d = (px + CU + 0.5) / 2, x = (s + d) / 2, y = (s - d) / 2;
      if (x < q.x || y < q.y || x >= q.x + q.w || y >= q.y + q.h) continue;
      const j = (Math.floor(py / Q) * MW + Math.floor(px / Q)) * 4;
      m[j + 3] = Math.min(255, m[j + 3] + Math.ceil(255 / (Q * Q)));
    }
    // la couleur de la brume ; un bord adouci (un flou de deux pixels du masque)
    const a = new Float32Array(MW * MH);
    for (let i = 0; i < MW * MH; i++) a[i] = m[i * 4 + 3] / 255;
    for (let pass = 0; pass < 2; pass++) {
      const b = new Float32Array(a);
      for (let y = 1; y < MH - 1; y++) for (let x = 1; x < MW - 1; x++) {
        const i = y * MW + x;
        a[i] = (b[i] * 4 + b[i - 1] + b[i + 1] + b[i - MW] + b[i + MW]) / 8;
      }
    }
    for (let i = 0; i < MW * MH; i++) { m[i * 4] = 214; m[i * 4 + 1] = 210; m[i * 4 + 2] = 204; m[i * 4 + 3] = Math.round(Math.min(1, a[i] * 1.25) * 255); }
    writePNGA(path.join(OUT, `brume_${q.cle}.png`), m, MW, MH);
  }
  console.log(time, 'brumes', W.grand.quartiers.map(q => q.cle).join(' '), Date.now() - t0, 'ms');
}

function writePNGA(file, rgba, w, h) {
  const zlib = require('zlib');
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4); }
  const crc = (() => { const t = new Int32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c; } return b => { let c = -1; for (let i = 0; i < b.length; i++) c = t[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; }; })();
  const chunk = (type, data) => { const l = Buffer.alloc(4); l.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  fs.writeFileSync(file, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]));
}

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
  const add = (key, label, x, y, z) => places.push({ key, label, x: O + QX + x, y: O + QY + y, z: Gq + z, district: 'stade' });
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
  const monde = GRAND ? { N, O, quartiers: W.grand.quartiers, brume: 4 } : { N, O: 0, quartiers: [] };
  fs.writeFileSync(path.join(OUT, 'lieux.json'), JSON.stringify({ projection: { cu: CU, cv: CV, zl: ZL, w: FW, h: FH }, monde, places }, null, 1));
  console.log(places.length, 'lieux');
}
console.log(time, 'fini en', Date.now() - t0, 'ms');
