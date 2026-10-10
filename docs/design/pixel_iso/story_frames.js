'use strict';
// Les douze vignettes du storyboard, au format des cases : 328 × 184 pixels, agrandies × 2.
//   node story_frames.js            → toutes
//   node story_frames.js 02 07      → seulement celles-là
// Écrit out/sb_<n>.png (1 pixel = 1 pixel ; la planche l'agrandit × 2) et out/sb_anchors.json (où sont les têtes, pour les calques de l'interface).
const fs = require('fs');
const path = require('path');
const E = require('./engine');
const { M } = require('./mats');
const SP = require('./sprites');
const { renderDiorama, STADE } = require('./diorama');
const { STORY_INT, vestiaire } = require('./interiors');
const Z = require('./zone');

const FW = 328, FH = 184;
M.KIT_VIOLET = M.KIT_VIOLET || E.material('maillot violet de Villebranle', c => { c.cr = 0.42; c.cg = 0.22; c.cb = 0.52; });
const OUT = path.join(__dirname, 'out');
const want = process.argv.slice(2);
const anchors = fs.existsSync(path.join(OUT, 'sb_anchors.json')) ? JSON.parse(fs.readFileSync(path.join(OUT, 'sb_anchors.json'))) : {};
const on = k => !want.length || want.includes(k);
const save = (k, r, marks = {}) => { E.writePNG(path.join(OUT, `sb_${k}.png`), r.img, r.FW, r.FH, 1); anchors[k] = marks; console.log('vignette', k); };

// ------------------------------------------------ intérieurs en coupe
const INT = { '01': STORY_INT.appartementAube, '03': vestiaire, '04': STORY_INT.secretariat, '08': STORY_INT.couloir, '11': STORY_INT.appartementDimanche };
const AMB = { '01': [0.14, 0.14, 0.20], '11': [0.36, 0.34, 0.34] };
// la place laissée à l'interface : la carte à droite, ou le menu en bas
const SHIFT = { '01': [44, 4], '03': [0, 22], '04': [50, 6], '08': [50, 6], '11': [50, 6] };
for (const k of Object.keys(INT)) {
  if (!on(k)) continue;
  const r = renderDiorama(INT[k], { S: 40, T: 4, Z: 30, FW, FH, du: SHIFT[k][0], dv: SHIFT[k][1], ambient: AMB[k] || [0.24, 0.21, 0.23], sun: [0, 0, 0], slab: M.CONCRETE });
  save(k, r);
}

// ------------------------------------------------ le match : un grand stade de nuit, vingt-deux joueurs
if (on('09')) {
  const grand = STADE.find(s => s[0] === 'grand')[1];
  const R = E.rng(909);
  const r = renderDiorama((W, x, y, S, T) => {
    grand(W, x, y, S, T);
    // les joueurs : 1 voxel = 1 m, une colonne de deux voxels chacun
    const teamKit = (W, shirt, shorts, side) => {
      const spots = [[2, 15], [9, 6], [9, 12], [9, 18], [9, 24], [17, 8], [17, 15], [17, 22], [23, 5], [23, 25], [27, 15]];
      for (const [a, b] of spots) {
        const px = side ? x + 62 - a - Math.floor(R() * 3) : x + 14 + a + Math.floor(R() * 3), py = y + 16 + b + Math.floor(R() * 2);
        W.set(px, py, T, shorts); W.set(px, py, T + 1, shirt);
      }
    };
    // Villebranle : violet et blanc ; Aubérive : bordeaux et gris
    teamKit(W, M.KIT_VIOLET, M.CAR_WHITE, 0); teamKit(W, M.CAR_BORD, M.SEAT_GREY, 1);
    W.set(x + 40, y + 31, T, M.CAR_WHITE);
  }, { S: 76, T: 3, Z: 40, FW, FH, dv: 4, ambient: [0.10, 0.09, 0.12], sun: [0.10, 0.10, 0.15] });
  save('09', r);
}

// ------------------------------------------------ la ville : quatre éclairages, une seule zone
const shot = (W, k, x, y, o, marks) => {
  const row = o.row != null ? o.row : 118;
  const r = Z.screen(W, x, y, Object.assign({ width: FW, height: FH, row }, o));
  const cu = Math.round(2 * (x - y) - FW / 2), cv = Math.round(x + y - 2 * (2 + 10) - row);
  const m = {};
  for (const [name, s] of Object.entries(marks)) m[name] = { x: Math.round(2 * (s.x - s.y) - cu), y: Math.round(s.x + s.y - 2 * (s.z + 10) - cv - s.h) };
  save(k, r, m);
};
const put = (W, def, x, y, z) => { W.sprite(Object.assign({ x, y, z }, def)); return { x, y, z, h: def.rows.length }; };
const QX = Z.QX, QY = Z.QY;

// l'aube : lundi 7 h 05 rue du Stade, samedi 6 h 40 à la gare routière
if (on('02') || on('07')) {
  const W = Z.buildZone({ time: 'dawn', mood: 'good', people: false, floodOn: false });
  if (on('02')) {
    const base = W.sprites.length;
    const coach = put(W, SP.COACH, QX + 238, QY + 161, 2);
    put(W, SP.CAT, QX + 190, QY + 236, 10);
    put(W, SP.COAT, QX + 300, QY + 204, 2);
    shot(W, '02', QX + 232, QY + 170, { time: 'dawn', floodOn: false, row: 112 }, { toi: coach });
    W.sprites.length = base;
  }
  if (on('07')) {
    const base = W.sprites.length;
    // la gare routière du quartier des Lilas (posé en 0, 812) : le car du Racing au quai 2, Norbert à la soute
    const gy = 812;
    const brehaut = put(W, SP.BREHAUT, 936, gy + 99.5, 2);
    put(W, SP.PLAYER, 941, gy + 101, 2); put(W, SP.PLAYER, 945.5, gy + 98.8, 2);
    const vukic = put(W, SP.VUKIC, 950, gy + 100.5, 2);
    const coach = put(W, SP.COACH, 956, gy + 102.5, 2);
    shot(W, '07', 945, gy + 93, { time: 'dawn', floodOn: false, front: 40 }, { brehaut, vukic, toi: coach });
    W.sprites.length = base;
  }
}
// lundi 14 h : le terrain annexe, les U17 de Vukić (le quartier « sport » est posé en 708, 420)
if (on('05')) {
  const W = Z.buildZone({ time: 'day', mood: 'good' });
  const sx = 708, sy = 420, at = (x, y, z = 2, h = 0) => ({ x: sx + x, y: sy + y, z, h });
  shot(W, '05', sx + 190, sy + 95, { time: 'day', cut: false }, {
    z1: at(212, 119), z2: at(140, 68), z3: at(248, 88),
    vukic: at(182, 127, 2, 18), mbako: at(135.6, 60.2, 2, 17),
  });
}
// le crépuscule : lundi 19 h 10, la buvette des anciens
if (on('06')) {
  const W = Z.buildZone({ time: 'dusk', mood: 'good', people: false, floodOn: false });
  const gege = put(W, SP.GEGE, QX + 234.5, QY + 157.3, 2);
  put(W, SP.FAN_SIT, QX + 211.5, QY + 160.5, 2); put(W, SP.FAN, QX + 222, QY + 162.5, 2);
  const coach = put(W, SP.COACH, QX + 246, QY + 166, 2);
  put(W, SP.WALKER, QX + 292, QY + 204, 2);
  shot(W, '06', QX + 214, QY + 168, { time: 'dusk', floodOn: false, cutOff: 34, fogLen: 120 }, { gege, toi: coach });
}
// la nuit du retour : 1 h 40, le car éteint, le bip
if (on('10')) {
  const W = Z.buildZone({ time: 'night', mood: 'good', people: false, floodOn: false, bus: 'dark' });
  const coach = put(W, SP.COACH, 447, 399, 1);
  shot(W, '10', 416, 394, { time: 'night', floodOn: false, cutOff: 40, fogLen: 110 }, { toi: coach });
}
// dimanche 23 h : la ville a changé
if (on('12')) {
  const W = Z.buildZone({ time: 'night', mood: 'bad', people: false });
  const coach = put(W, SP.COACH, QX + 172, QY + 170, 1);
  put(W, SP.CAT, QX + 190, QY + 236, 10);
  shot(W, '12', QX + 166, QY + 160, { time: 'night', mood: 'bad', cutOff: 16, fogLen: 150, row: 126 }, { toi: coach, gate: { x: QX + 112, y: QY + 158, z: 15, h: 0 }, buvette: { x: QX + 219, y: QY + 156, z: 13, h: 0 } });
}

fs.writeFileSync(path.join(OUT, 'sb_anchors.json'), JSON.stringify(anchors, null, 1));
