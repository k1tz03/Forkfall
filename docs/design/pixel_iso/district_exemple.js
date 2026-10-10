'use strict';
// Exemple minimal de quartier : un immeuble, un réverbère, un platane, un passant.
const { M } = require('./mats');
const B = require('./build');
const SP = require('./sprites');
const { LEFT, RIGHT } = require('./engine');
module.exports = {
  w: 120, h: 100, seed: 3,
  build(W, ctx) {
    const { G, night } = ctx;
    W.box(10, 10, G, 70, 50, 40, M.PLASTER_CREAM);
    const f = new B.Facade(W, LEFT, 10, 10, 60, 40);
    f.shop(4, G, 20, 10, 'tabac', { light: night ? { r: 30, c: [0.7, 0.5, 0.25] } : null });
    for (const s of [6, 20, 34, 48]) f.window(s, 22, 6, 9, { state: night && s === 20 ? 'lit' : 'dark', shutter: M.SHUTTER_GREEN });
    B.gableRoof(W, 10, 10, 60, 40, 40, M.SLATE, { oh: 1, gable: M.PLASTER_CREAM });
    B.streetLamp(W, 80, 60, G, 0, 1, { on: night });
    B.planeTree(W, 95, 75, G, { seed: 5 });
    W.sprite(Object.assign({ x: 60, y: 60, z: G }, SP.COACH));
    return { places: [{ key: 'tabac', label: 'Le bar-tabac', x: 24, y: 50, z: G + 12 }] };
  },
};
