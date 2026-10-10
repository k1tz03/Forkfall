'use strict';
// Après ville_assets.js : la grille finale et les lieux de la version jouable.
//   node ville_post.js
// - la grille : praticable de jour ET de nuit, et seulement la partie reliée à la porte de
//   l'appartement (les cours fermées et le dedans des pelouses n'attirent plus le doigt) ;
// - les lieux : une clé unique par lieu, et leur porte ramenée dans la partie reliée ;
// - les sprites : les personnages au pixel, en données (rangées + palette), pour que la page les
//   dessine elle-même, à la lumière de l'heure.
const fs = require('fs');
const path = require('path');
const SP = require('./sprites');
const OUT = path.join(__dirname, 'out', 'ville');

const a = JSON.parse(fs.readFileSync(path.join(OUT, 'grille_day.json')));
const b = JSON.parse(fs.readFileSync(path.join(OUT, 'grille_night.json')));
const G = a.size, C = a.cell;
const ba = Buffer.from(a.bits, 'base64'), bb = Buffer.from(b.bits, 'base64');
const walk = new Uint8Array(G * G);
for (let k = 0; k < G * G; k++) walk[k] = (ba[k >> 3] >> (k & 7) & 1) & (bb[k >> 3] >> (k & 7) & 1);

const L = JSON.parse(fs.readFileSync(path.join(OUT, 'lieux.json')));
const seen = {};
for (const p of L.places) {
  if (seen[p.key]) p.key = p.key + '_' + p.district;
  seen[p.key] = 1;
}
const app = L.places.find(p => p.key === 'appartement');
// la composante reliée à l'appartement
const comp = new Uint8Array(G * G);
const q = [app.door[1] * G + app.door[0]];
comp[q[0]] = 1;
while (q.length) {
  const k = q.pop(), x = k % G, y = (k - x) / G;
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const nx = x + dx, ny = y + dy;
    if (nx < 0 || ny < 0 || nx >= G || ny >= G) continue;
    const nk = ny * G + nx;
    if (walk[nk] && !comp[nk]) { comp[nk] = 1; q.push(nk); }
  }
}
let n = 0;
for (let k = 0; k < G * G; k++) n += comp[k];
for (const p of L.places) {
  const cx = Math.floor(p.x / C), cy = Math.floor(p.y / C);
  let best = null, bd = 1e9;
  for (let dy = -20; dy <= 20; dy++) for (let dx = -20; dx <= 20; dx++) {
    const x = cx + dx, y = cy + dy;
    if (x < 0 || y < 0 || x >= G || y >= G || !comp[y * G + x]) continue;
    const d = dx * dx + dy * dy - 0.3 * (dx + dy);
    if (d < bd) { bd = d; best = [x, y]; }
  }
  if (!best) console.log('  sans porte reliée :', p.key);
  p.door = best;
}
const bits = new Uint8Array(Math.ceil(G * G / 8));
for (let k = 0; k < G * G; k++) if (comp[k]) bits[k >> 3] |= 1 << (k & 7);
fs.writeFileSync(path.join(OUT, 'grille.json'), JSON.stringify({ cell: C, size: G, bits: Buffer.from(bits).toString('base64') }));
fs.writeFileSync(path.join(OUT, 'lieux.json'), JSON.stringify(L, null, 1));
console.log('grille reliée :', n, 'cases ;', L.places.length, 'lieux');

// Les personnages : rangées et palettes en 0-255. Les variantes de palette donnent un corps aux
// gens qui n'ont pas encore de sprite à eux (le médecin, la maire, l'agent…).
const to255 = c => c.map(v => Math.round(Math.max(0, Math.min(1, v)) * 255));
const pack = (sp, extra) => {
  const pal = {};
  for (const [k, v] of Object.entries(Object.assign({}, sp.pal, extra || {}))) pal[k] = to255(v);
  const o = { rows: sp.rows, pal, ax: sp.ax != null ? sp.ax : Math.floor(sp.rows[0].length / 2) };
  if (sp.emit) { o.emit = {}; for (const [k, v] of Object.entries(sp.emit)) o.emit[k] = to255(v); }
  return o;
};
const out = {
  coach: pack(SP.COACH), joueur: pack(SP.PLAYER), gege: pack(SP.GEGE), josiane: pack(SP.JOSIANE),
  vukic: pack(SP.VUKIC), aulard: pack(SP.VAUBOURG), brehaut: pack(SP.BREHAUT), mbako: pack(SP.KID),
  meneche: pack(SP.COAT), fan: pack(SP.FAN), passant: pack(SP.WALKER), passante: pack(SP.WALKER2),
  // les variantes (mêmes silhouettes, autres étoffes)
  inconnu: pack(SP.COAT, { c: [0.36, 0.36, 0.38], C: [0.26, 0.26, 0.28], h: [0.20, 0.18, 0.16] }),
  sabatier: pack(SP.WALKER, { q: [0.86, 0.85, 0.80], Q: [0.66, 0.65, 0.60] }),
  camille: pack(SP.WALKER2, { q: [0.55, 0.20, 0.25], Q: [0.40, 0.14, 0.18] }),
  aubert: pack(SP.WALKER2, { q: [0.22, 0.24, 0.36], Q: [0.15, 0.17, 0.26], h: [0.45, 0.42, 0.40] }),
  fardelli: pack(SP.COAT, { c: [0.70, 0.64, 0.52], C: [0.52, 0.47, 0.38] }),
  lea: pack(SP.COAT, { c: [0.55, 0.22, 0.20], C: [0.40, 0.15, 0.14], h: [0.30, 0.18, 0.10] }),
  vecchio: pack(SP.PLAYER, { y: [0.50, 0.48, 0.45], Y: [0.62, 0.60, 0.56] }),
  nassir: pack(SP.WALKER, { q: [0.14, 0.14, 0.16], Q: [0.09, 0.09, 0.10] }),
  clow: pack(SP.COAT, { c: [0.30, 0.24, 0.18], C: [0.22, 0.17, 0.12], h: [0.75, 0.74, 0.70] }),
  legruet: pack(SP.WALKER, { q: [0.40, 0.40, 0.42], Q: [0.28, 0.28, 0.30], h: [0.70, 0.70, 0.68] }),
  mere_mbako: pack(SP.WALKER2, { q: [0.80, 0.55, 0.15], Q: [0.60, 0.40, 0.10] }),
  enfant: pack(SP.KID),
};
fs.writeFileSync(path.join(OUT, 'sprites.json'), JSON.stringify(out));
console.log('sprites :', Object.keys(out).length);
