'use strict';
// Les fonds des deux écrans de téléphone (Dialogue, Entraînement), au format portrait du jeu, agrandis × 2 par la planche.
//   node phone_frames.js [dialogue] [entrainement]
const path = require('path');
const E = require('./engine');
const { M } = require('./mats');
const SP = require('./sprites');
const { renderDiorama } = require('./diorama');
const { STORY_INT } = require('./interiors');
const OUT = path.join(__dirname, 'out');
const want = process.argv.slice(2);
const on = k => !want.length || want.includes(k);

if (on('dialogue')) {
  // le secrétariat, Josiane à son bureau : il sera flouté et voilé derrière la carte
  const r = renderDiorama(STORY_INT.secretariat, { S: 40, T: 4, Z: 30, FW: 195, FH: 422, dv: -40, ambient: [0.24, 0.21, 0.23], sun: [0, 0, 0], slab: M.CONCRETE });
  E.writePNG(path.join(OUT, 'phone_dialogue.png'), r.img, 195, 422, 1);
  console.log('dialogue');
}
if (on('entrainement')) {
  // le terrain annexe à 19 h : la séance des seniors sous les mâts ; Mbako, surclassé, s'est glissé dans le groupe
  const Z = require('./zone');
  const W = Z.buildZone({ time: 'night', mood: 'good' });
  const sx = 708, sy = 420, CY = 82, LX1 = 278;
  // la séance finit par des frappes : Mbako face à Vecchio, dans le but est
  const mb = { x: sx + LX1 - 30, y: sy + CY + 7, z: 2 };
  W.sprite(Object.assign({}, mb, SP.PLAYER));
  const cx = sx + LX1 - 18, cy = sy + CY + 2;
  const r = Z.screen(W, cx, cy, { time: 'night', width: 195, height: 102, row: 64, cut: false });
  E.writePNG(path.join(OUT, 'phone_terrain.png'), r.img, 195, 102, 1);
  const cu = Math.round(2 * (cx - cy) - 195 / 2), cv = Math.round(cx + cy - 2 * (2 + 10) - 64);
  const at = (x, y, z, h) => ({ x: 2 * (2 * (x - y) - cu), y: 2 * (x + y - 2 * (z + 10) - cv - h) });
  const marks = { mbako: at(mb.x, mb.y, 2, SP.PLAYER.rows.length), vecchio: at(sx + LX1 - 9, sy + CY + 2, 2, 20) };
  require('fs').writeFileSync(path.join(OUT, 'phone_terrain.json'), JSON.stringify(marks));
  console.log('entrainement', marks);
}
