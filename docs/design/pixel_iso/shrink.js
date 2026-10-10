// Réduit une image par moyenne (aperçu pour l'inspection, pas pour les planches).
const E = require('./engine'); const { readPNG } = require('./montage_lib');
const [, , file, k, out] = process.argv; const K = +k;
const { W, H, img } = readPNG(file); const w = Math.floor(W / K), h = Math.floor(H / K); const o = Buffer.alloc(w * h * 3);
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) for (let c = 0; c < 3; c++) { let s = 0; for (let j = 0; j < K; j++) for (let i = 0; i < K; i++) s += img[((y * K + j) * W + x * K + i) * 3 + c]; o[(y * w + x) * 3 + c] = Math.round(s / (K * K)); }
E.writePNG(out, o, w, h, 1);
