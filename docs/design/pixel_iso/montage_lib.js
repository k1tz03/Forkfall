const fs = require('fs'), zlib = require('zlib');
function readPNG(file) {
  const b = fs.readFileSync(file); let p = 8, W, H, idat = [];
  while (p < b.length) { const len = b.readUInt32BE(p), type = b.toString('ascii', p + 4, p + 8), data = b.slice(p + 8, p + 8 + len); if (type === 'IHDR') { W = data.readUInt32BE(0); H = data.readUInt32BE(4); } if (type === 'IDAT') idat.push(data); p += 12 + len; }
  const raw = zlib.inflateSync(Buffer.concat(idat)); const img = Buffer.alloc(W * H * 3); const bpp = 3, stride = W * 3;
  let prev = Buffer.alloc(stride);
  for (let y = 0; y < H; y++) { const f = raw[y * (stride + 1)]; const line = raw.slice(y * (stride + 1) + 1, (y + 1) * (stride + 1)); const out = Buffer.alloc(stride);
    for (let i = 0; i < stride; i++) { const a = i >= bpp ? out[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0; let v = line[i];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1; else if (f === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      out[i] = v & 255; }
    out.copy(img, y * stride); prev = out; }
  return { W, H, img };
}
module.exports = { readPNG };
