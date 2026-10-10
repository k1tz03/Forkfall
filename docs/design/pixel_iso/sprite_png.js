'use strict';
// Les petits personnages de la rue en PNG (1 pixel = 1 pixel), sur le fond des panneaux des planches.
//   node sprite_png.js   → out/spr_<nom>.png
const E = require('./engine');
const S = require('./sprites');
const BG = [0x21 / 255, 0x16 / 255, 0x0F / 255];
const pick = { walker: S.WALKER, coat: S.COAT, kid: S.KID, coach: S.COACH, gege: S.GEGE, josiane: S.JOSIANE, vukic: S.VUKIC, brehaut: S.BREHAUT };
for (const [name, sp] of Object.entries(pick)) {
  const rows = sp.rows, h = rows.length, w = rows[0].length;
  const img = new Float32Array(w * h * 3);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const ch = rows[y][x], c = ch === '.' ? BG : (sp.pal[ch] || BG);
    img[(y * w + x) * 3] = c[0]; img[(y * w + x) * 3 + 1] = c[1]; img[(y * w + x) * 3 + 2] = c[2];
  }
  const buf = Buffer.alloc(w * h * 3);
  for (let i = 0; i < w * h * 3; i++) buf[i] = Math.round(Math.min(1, Math.max(0, img[i])) * 255);
  E.writePNG(__dirname + `/out/spr_${name}.png`, buf, w, h, 1);
}
console.log('ok');
