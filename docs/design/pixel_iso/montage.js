// Assemble plusieurs PNG en une planche (inspection).
const fs = require('fs'), zlib = require('zlib'), E = require('./engine');
function readPNG(file) {
  const b = fs.readFileSync(file); let p = 8, W, H, idat = [];
  while (p < b.length) { const len = b.readUInt32BE(p), type = b.toString('ascii', p + 4, p + 8), data = b.slice(p + 8, p + 8 + len); if (type === 'IHDR') { W = data.readUInt32BE(0); H = data.readUInt32BE(4); } if (type === 'IDAT') idat.push(data); p += 12 + len; }
  const raw = zlib.inflateSync(Buffer.concat(idat)); const img = Buffer.alloc(W * H * 3);
  for (let y = 0; y < H; y++) raw.copy(img, y * W * 3, y * (W * 3 + 1) + 1, (y + 1) * (W * 3 + 1));
  return { W, H, img };
}
const [, , out, cols, scale, ...files] = process.argv;
const ims = files.map(readPNG); const C = +cols, sc = +scale;
const cw = Math.max(...ims.map(i => i.W)), ch = Math.max(...ims.map(i => i.H)); const rows = Math.ceil(ims.length / C);
const TW = C * cw + (C - 1) * 4, TH = rows * ch + (rows - 1) * 4; const img = Buffer.alloc(TW * TH * 3, 30);
ims.forEach((im, i) => { const ox = (i % C) * (cw + 4), oy = Math.floor(i / C) * (ch + 4); for (let y = 0; y < im.H; y++) im.img.copy(img, ((oy + y) * TW + ox) * 3, y * im.W * 3, (y + 1) * im.W * 3); });
E.writePNG(out, img, TW, TH, sc);
module.exports = { readPNG };
