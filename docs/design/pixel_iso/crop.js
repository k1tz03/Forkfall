// Découpe et agrandit une zone d'un rendu (pour l'inspection).
const fs = require('fs'), zlib = require('zlib');
const E = require('./engine');
function readPNG(file) {
  const b = fs.readFileSync(file); let p = 8, W, H, idat = [];
  while (p < b.length) { const len = b.readUInt32BE(p), type = b.toString('ascii', p + 4, p + 8), data = b.slice(p + 8, p + 8 + len); if (type === 'IHDR') { W = data.readUInt32BE(0); H = data.readUInt32BE(4); } if (type === 'IDAT') idat.push(data); p += 12 + len; }
  const raw = zlib.inflateSync(Buffer.concat(idat)); const img = Buffer.alloc(W * H * 3);
  for (let y = 0; y < H; y++) raw.copy(img, y * W * 3, y * (W * 3 + 1) + 1, (y + 1) * (W * 3 + 1));
  return { W, H, img };
}
const [, , file, x, y, w, h, sc, out] = process.argv;
const { W, img } = readPNG(file); const X = +x, Y = +y, CW = +w, CH = +h;
const c = Buffer.alloc(CW * CH * 3);
for (let j = 0; j < CH; j++) img.copy(c, j * CW * 3, ((Y + j) * W + X) * 3, ((Y + j) * W + X + CW) * 3);
E.writePNG(out, c, CW, CH, +sc);
