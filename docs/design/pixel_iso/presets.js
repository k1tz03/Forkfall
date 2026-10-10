'use strict';
// Réglages d'éclairage communs : tous les quartiers, toutes les vues, la même lumière.
const norm = (a, b, c) => { const l = Math.hypot(a, b, c); return [a / l, b / l, c / l]; };
const SUN_DIR = norm(-0.35, 0.40, 0.85);

function lighting(time) {
  if (time === 'day') return {
    ambient: [0.50, 0.50, 0.55], faceAmb: [1.0, 0.80, 0.62],
    sun: [1.0, 0.92, 0.78], sunDir: SUN_DIR,
    wetRow: 30, reflAmb: [0.5, 0.48, 0.45], wetStrength: 0.55, emitScale: 0.35,
    bloom: null, levels: 48, lightQuant: 6, outlineDark: 0.62, lift: [0, 0, 0],
  };
  if (time === 'dawn') return {
    ambient: [0.20, 0.21, 0.29], faceAmb: [1.0, 0.78, 0.60],
    sun: [0.42, 0.30, 0.34], sunDir: norm(-0.62, 0.35, 0.45),
    wetRow: 30, reflAmb: [0.22, 0.22, 0.30], wetStrength: 0.75, emitScale: 0.9,
    bloom: [[2, 0.4], [7, 0.26]], levels: 46, lightQuant: 6,
  };
  if (time === 'dusk') return {
    ambient: [0.30, 0.25, 0.30], faceAmb: [1.0, 0.76, 0.56],
    sun: [0.85, 0.52, 0.32], sunDir: norm(-0.55, 0.30, 0.55),
    wetRow: 30, reflAmb: [0.3, 0.24, 0.24], wetStrength: 0.65, emitScale: 0.8,
    bloom: [[2, 0.35], [7, 0.22]], levels: 46, lightQuant: 6,
  };
  return {
    ambient: [0.095, 0.085, 0.115], faceAmb: [1.0, 0.74, 0.55],
    sun: [0.12, 0.125, 0.18], sunDir: SUN_DIR,
    wetRow: 36, reflAmb: [0.12, 0.10, 0.11], wetStrength: 0.8,
    bloom: [[2, 0.45], [8, 0.32]], levels: 44, lightQuant: 6,
  };
}
module.exports = { lighting, norm, SUN_DIR };
