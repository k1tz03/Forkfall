'use strict';
// Les matières de la ville : chaque fonction peint un texel (2 texels par voxel et par axe).
const E = require('./engine');
const { TOP, LEFT, RIGHT, hash, vnoise, fbm, mod, clamp, material, overlay, textBitmap } = E;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const grain = (c, amt, s = 0) => mul(c, 1 + (hash(c.a, c.b, c.face * 7 + s, c.m) - 0.5) * 2 * amt);
const along = c => c.face === LEFT ? c.hx : c.hy;
const GROUND = 2; // niveau des trottoirs
const grime = (c, h = 4, k = 0.24) => { if (c.face !== TOP) { const t = clamp((c.hz - GROUND) / h, 0, 1); mul(c, 1 - k * (1 - t)); } };
const puddle = (c, scale, thr, s) => {
  if (c.face !== TOP) return;
  const p = fbm(c.hx / scale + 3.1, c.hy / scale - 1.7, s, 3);
  if (p > thr) c.wet = clamp((p - thr) * 12, 0, 1);
};
const fallen = (c, k = 1) => {
  if (c.face !== TOP) return;
  const W = c.W; const ix = Math.floor(c.hx), iy = Math.floor(c.hy);
  if (ix < 0 || iy < 0 || ix >= W.X || iy >= W.Y) return;
  const d = W.leaf[iy * W.X + ix] * k;
  if (d <= 0) return;
  const h = hash(c.a, c.b, 913, 5);
  if (h < d * 0.42) {
    const v = hash(c.a, c.b, 914, 1);
    if (v < 0.4) rgb(c, 0.62, 0.42, 0.14); else if (v < 0.7) rgb(c, 0.52, 0.24, 0.10); else if (v < 0.88) rgb(c, 0.40, 0.33, 0.13); else rgb(c, 0.70, 0.56, 0.22);
    c.wet *= 0.3;
  }
};

const M = {};

// ---------------------------------------------------------------- sols
M.ASPHALT = material('bitume', c => {
  const h = hash(c.a, c.b, 3, 0);
  let k = 0.205 * (0.86 + 0.28 * fbm(c.hx / 7, c.hy / 7, 5));
  if (h < 0.09) k *= 1.22; else if (h > 0.95) k *= 0.8;
  rgb(c, k * 1.04, k * 0.97, k * 0.95);
  if (c.face !== TOP) mul(c, 0.8);
  puddle(c, 19, 0.6, 9);
  if (c.face === TOP && c.W.baseWet) c.wet = Math.max(c.wet, c.W.baseWet);
  fallen(c, 0.6);
});
M.ROADLINE = material('marquage', c => {
  rgb(c, 0.74, 0.72, 0.66); grain(c, 0.06);
  if (hash(c.a, c.b, 31, 2) < 0.16) rgb(c, 0.25, 0.23, 0.22);
  puddle(c, 13, 0.6, 9);
});
M.CURB = material('bordure', c => { rgb(c, 0.47, 0.45, 0.43); grain(c, 0.08); if (c.face === TOP && mod(c.a + c.b, 9) === 0) mul(c, 0.85); });
M.GUTTER = material('caniveau', c => { rgb(c, 0.30, 0.29, 0.28); grain(c, 0.1); puddle(c, 5, 0.45, 19); });
M.SIDEWALK = material('trottoir', c => {
  if (c.face !== TOP) { rgb(c, 0.40, 0.37, 0.34); grain(c, 0.06); return; }
  const ga = mod(c.a, 5), gb = mod(c.b, 5);
  const slab = hash(Math.floor(c.a / 5), Math.floor(c.b / 5), 11, 0);
  let k = 0.38 + slab * 0.07;
  if (ga === 0 || gb === 0) k *= 0.74;
  rgb(c, k * 1.03, k * 0.98, k * 0.9); grain(c, 0.04);
  puddle(c, 9, 0.66, 21);
  fallen(c, 1);
});
M.COBBLE = material('pavés', c => {
  if (c.face !== TOP) { rgb(c, 0.33, 0.32, 0.31); return; }
  const row = Math.floor(c.b / 3), off = (row & 1) * 2;
  const la = mod(c.a + off, 4), lb = mod(c.b, 3);
  const st = hash(Math.floor((c.a + off) / 4), row, 13, 0);
  let k = 0.30 + st * 0.12;
  if (la === 3 || lb === 2) { k *= 0.52; } else if (la === 0 || lb === 0) k *= 1.12;
  rgb(c, k * 0.98, k * 0.96, k * 1.0);
  puddle(c, 8, 0.62, 23);
  if (c.wet === 0 && (la === 3 || lb === 2)) c.wet = 0.25;
  fallen(c, 1);
});
M.GRAVEL = material('stabilisé', c => {
  const h = hash(c.a, c.b, 41, 0);
  let k = 0.42 * (0.9 + 0.2 * fbm(c.hx / 5, c.hy / 5, 42));
  if (h < 0.12) k *= 0.78; else if (h > 0.9) k *= 1.18;
  rgb(c, k * 1.1, k * 0.95, k * 0.76);
  if (c.face !== TOP) mul(c, 0.75);
  puddle(c, 10, 0.64, 43);
  fallen(c, 1.3);
});
M.GRASS = material('herbe', c => {
  const n = fbm(c.hx / 4, c.hy / 4, 51);
  const h = hash(c.a, c.b, 52, 0);
  let k = 0.85 + 0.3 * n;
  rgb(c, 0.20 * k, 0.33 * k, 0.15 * k);
  if (h < 0.12) mul(c, 0.78); else if (h > 0.9) { c.cr *= 1.25; c.cg *= 1.2; }
  if (c.face !== TOP) mul(c, 0.7);
  fallen(c, 0.8);
});
M.PITCH = material('pelouse', c => {
  const stripe = mod(Math.floor((c.hx + c.hy) / 22), 2);
  let k = stripe ? 1.0 : 0.86;
  k *= 0.95 + 0.1 * fbm(c.hx / 6, c.hy / 6, 61);
  rgb(c, 0.20 * k, 0.37 * k, 0.17 * k);
  grain(c, 0.06);
});
M.CHALK = material('craie', c => { rgb(c, 0.80, 0.80, 0.74); grain(c, 0.06); });
M.SOIL = material('terre', c => {
  const n = fbm(c.hx / 3 + c.hy / 3, c.hz / 2, 71);
  rgb(c, 0.30 + 0.06 * n, 0.21 + 0.04 * n, 0.15); grain(c, 0.1);
  if (hash(Math.floor(c.a / 3), Math.floor(c.b / 2), 72, 0) < 0.06) rgb(c, 0.42, 0.40, 0.37);
});

// ---------------------------------------------------------------- murs
function brick(c, base, mortar) {
  if (c.face === TOP) { rgb(c, 0.55, 0.51, 0.46); grain(c, 0.06); return; }
  const course = Math.floor(c.b / 3), off = (course & 1) * 4;
  const la = mod(c.a + off, 8), lb = mod(c.b, 3);
  if (lb === 0 || la === 0) { rgb(c, mortar[0], mortar[1], mortar[2]); grain(c, 0.05); }
  else {
    const h = hash(Math.floor((c.a + off) / 8), course, c.face, 21);
    let k = 0.84 + h * 0.32; if (h < 0.07) k *= 0.72;
    rgb(c, base[0] * k, base[1] * k, base[2] * k);
    if (lb === 2) mul(c, 1.07);
    grain(c, 0.035);
  }
  const n = fbm(along(c) / 6, c.hz / 9, 22);
  mul(c, 0.9 + 0.2 * n);
  grime(c);
}
M.BRICK = material('brique', c => brick(c, [0.55, 0.27, 0.19], [0.50, 0.46, 0.41]));
M.BRICK_OLD = material('brique sombre', c => brick(c, [0.43, 0.22, 0.17], [0.40, 0.37, 0.33]));
M.BRICK_PALE = material('brique claire', c => brick(c, [0.62, 0.42, 0.30], [0.58, 0.54, 0.48]));
function plaster(c, col) {
  if (c.face === TOP) { rgb(c, 0.52, 0.49, 0.45); grain(c, 0.05); return; }
  const n = fbm(along(c) * 0.12, c.hz * 0.12, 41);
  let k = 0.86 + 0.24 * n;
  rgb(c, col[0] * k, col[1] * k, col[2] * k);
  grain(c, 0.03);
  const st = vnoise(along(c) * 0.9, c.hz * 0.04, 44);
  if (st > 0.78) mul(c, 0.9);
  if (hash(Math.floor(c.a / 2), Math.floor(c.b / 3), 45, c.face) < 0.012) mul(c, 0.78);
  grime(c, 5, 0.3);
}
M.PLASTER_CREAM = material('enduit crème', c => plaster(c, [0.68, 0.61, 0.49]));
M.PLASTER_OCHRE = material('enduit ocre', c => plaster(c, [0.66, 0.50, 0.32]));
M.PLASTER_GREY = material('enduit gris', c => plaster(c, [0.54, 0.52, 0.48]));
M.PLASTER_ROSE = material('enduit rose', c => plaster(c, [0.64, 0.47, 0.42]));
M.PLASTER_BLUE = material('enduit bleuté', c => plaster(c, [0.50, 0.53, 0.54]));
M.STONE = material('pierre', c => { rgb(c, 0.66, 0.62, 0.54); grain(c, 0.06); if (c.face !== TOP && mod(c.b, 6) === 0) mul(c, 0.86); grime(c, 3, 0.2); });
M.CONCRETE = material('béton', c => {
  let k = 0.88 + 0.22 * fbm(along(c) / 5 + (c.face === TOP ? c.hx / 5 : 0), c.hz / 7 + (c.face === TOP ? c.hy / 5 : 0), 81);
  rgb(c, 0.50 * k, 0.48 * k, 0.45 * k);
  if (c.face !== TOP) { if (mod(c.b, 8) === 0) mul(c, 0.86); if (mod(c.a, 24) === 0) mul(c, 0.8); }
  grain(c, 0.05); grime(c, 6, 0.28);
});
M.CONCRETE_STEP = material('gradin', c => {
  rgb(c, 0.52, 0.50, 0.47); grain(c, 0.06);
  if (c.face !== TOP) mul(c, 0.8);
  if (c.face === TOP && hash(Math.floor(c.a / 3), Math.floor(c.b / 3), 84, 0) < 0.05) mul(c, 0.8);
});

// ---------------------------------------------------------------- toits
M.SLATE = material('ardoise', c => {
  const h = hash(Math.floor(c.a / 3) + (mod(Math.floor(c.b / 2), 2) ? 7 : 0), Math.floor(c.b / 2), 91, c.face);
  let k = 0.85 + h * 0.3; if (h > 0.96) k *= 1.25;
  rgb(c, 0.21 * k, 0.22 * k, 0.26 * k);
  if (c.face === TOP) { if (mod(c.a, 3) === 0) mul(c, 0.82); }
  else { mul(c, 0.72); if (mod(c.b, 2) === 0) mul(c, 0.85); }
});
M.TERRACOTTA = material('tuiles', c => {
  const h = hash(c.a, Math.floor(c.b / 2), 92, c.face);
  let k = 0.88 + h * 0.22;
  rgb(c, 0.55 * k, 0.29 * k, 0.19 * k);
  if (c.face === TOP) { const lane = mod(c.a + c.b, 3); if (lane === 0) mul(c, 1.14); else if (lane === 2) mul(c, 0.8); }
  else { mul(c, 0.68); if (mod(c.a, 2)) mul(c, 0.86); }
  if (hash(Math.floor(c.a / 4), Math.floor(c.b / 4), 93, 0) < 0.08) { c.cg *= 1.12; c.cr *= 0.92; }
});
M.ZINC = material('zinc', c => { rgb(c, 0.44, 0.46, 0.48); if (mod(c.a, 4) === 0) mul(c, 1.15); grain(c, 0.04); if (c.face !== TOP) mul(c, 0.85); });
M.ROOF_FLAT = material('toit plat', c => { const h = hash(c.a, c.b, 95, 0); rgb(c, 0.24, 0.23, 0.22); if (h < 0.15) mul(c, 1.3); else if (h > 0.9) mul(c, 0.75); if (c.face === TOP) puddle(c, 6, 0.7, 96); });

// ---------------------------------------------------------------- bois, métal, verre
M.WOOD = material('bois', c => {
  const ln = c.face === TOP ? c.a : c.b;
  rgb(c, 0.42, 0.29, 0.18);
  if (mod(ln, 3) === 0) mul(c, 0.7);
  grain(c, 0.08);
});
M.WOOD_DARK = material('bois sombre', c => { rgb(c, 0.25, 0.17, 0.11); if (mod(c.face === TOP ? c.a : c.b, 3) === 0) mul(c, 0.75); grain(c, 0.06); });
function shutter(c, col) {
  rgb(c, col[0], col[1], col[2]);
  if (c.face !== TOP && mod(c.b, 2) === 0) mul(c, 0.78);
  grain(c, 0.05);
  if (hash(Math.floor(c.a / 2), Math.floor(c.b / 4), 101, 0) < 0.15) mul(c, 0.88);
}
M.SHUTTER_GREEN = material('volet vert', c => shutter(c, [0.30, 0.39, 0.31]));
M.SHUTTER_BLUE = material('volet bleu', c => shutter(c, [0.30, 0.37, 0.45]));
M.SHUTTER_GREY = material('volet gris', c => shutter(c, [0.52, 0.52, 0.49]));
M.SHUTTER_BORD = material('volet bordeaux', c => shutter(c, [0.44, 0.17, 0.20]));
M.METAL_DARK = material('métal sombre', c => { rgb(c, 0.15, 0.155, 0.16); grain(c, 0.08); });
M.METAL = material('métal', c => { rgb(c, 0.44, 0.45, 0.45); grain(c, 0.06); if (hash(Math.floor(c.a / 3), Math.floor(c.b / 3), 111, 0) < 0.05) rgb(c, 0.42, 0.26, 0.16); });
M.METAL_GREEN = material('fonte verte', c => { rgb(c, 0.16, 0.29, 0.22); grain(c, 0.06); if (c.face !== TOP && mod(c.b, 6) === 0) mul(c, 1.2); });
M.METAL_BORD = material('métal bordeaux', c => { rgb(c, 0.40, 0.12, 0.16); grain(c, 0.06); });
M.GLASS = material('vitre', c => { rgb(c, 0.06, 0.065, 0.08); if (mod(c.a - c.b, 9) < 2) rgb(c, 0.13, 0.14, 0.17); });
M.CAR_GLASS = material('pare-brise', c => { rgb(c, 0.07, 0.08, 0.10); if (mod(c.a + c.b, 7) < 2) rgb(c, 0.17, 0.18, 0.21); });
M.TIRE = material('pneu', c => { rgb(c, 0.06, 0.06, 0.06); grain(c, 0.1); });
M.CHROME = material('pare-chocs', c => { rgb(c, 0.32, 0.33, 0.34); grain(c, 0.08); });
function paint(c, col) { rgb(c, col[0], col[1], col[2]); if (c.face === TOP) mul(c, 1.08); grain(c, 0.035); }
M.CAR_BORD = material('voiture bordeaux', c => paint(c, [0.40, 0.11, 0.14]));
M.CAR_BEIGE = material('voiture beige', c => paint(c, [0.64, 0.58, 0.46]));
M.CAR_BLUE = material('voiture bleue', c => paint(c, [0.27, 0.35, 0.45]));
M.CAR_WHITE = material('voiture blanche', c => paint(c, [0.72, 0.71, 0.66]));

// ---------------------------------------------------------------- lumières
const emit = (c, r, g, b) => { c.er = r; c.eg = g; c.eb = b; };
M.NEON_PINK = material('néon rose', c => { rgb(c, 0.9, 0.3, 0.5); emit(c, 1.25, 0.34, 0.62); }, { noShadow: true, noAO: true, noAOrecv: true });
M.NEON_TEAL = material('néon turquoise', c => { rgb(c, 0.25, 0.8, 0.75); emit(c, 0.30, 1.05, 0.95); }, { noShadow: true, noAO: true, noAOrecv: true });
M.BULB = material('ampoule sodium', c => { rgb(c, 1, 0.8, 0.5); emit(c, 1.45, 1.05, 0.55); }, { noShadow: true, noAO: true, noAOrecv: true });
M.FLOOD = material('projecteur', c => { rgb(c, 1, 1, 0.9); emit(c, 1.5, 1.45, 1.3); if (mod(c.a, 3) === 0 || mod(c.b, 3) === 0) { emit(c, 0.25, 0.25, 0.22); rgb(c, 0.2, 0.2, 0.2); } }, { noShadow: true, noAO: true, noAOrecv: true });
M.FLOOD_OFF = material('projecteur éteint', c => { rgb(c, 0.42, 0.44, 0.44); if (mod(c.a, 3) === 0 || mod(c.b, 3) === 0) rgb(c, 0.16, 0.16, 0.16); });
M.RED_SIGN = material('carotte', c => { rgb(c, 0.7, 0.12, 0.1); emit(c, 0.85, 0.12, 0.10); if (mod(c.b, 4) === 0) emit(c, 0.55, 0.08, 0.06); }, { noShadow: true, noAOrecv: true });
M.RED_LIGHT = material('feu', c => { rgb(c, 0.8, 0.1, 0.1); emit(c, 1.1, 0.12, 0.18); }, { noShadow: true, noAO: true, noAOrecv: true });
M.SKYLIGHT = material('verrière', c => { rgb(c, 0.5, 0.45, 0.35); c.er = 0.42; c.eg = 0.30; c.eb = 0.15; if (mod(c.a, 4) === 0 || mod(c.b, 4) === 0) { c.er = c.eg = c.eb = 0; rgb(c, 0.2, 0.2, 0.2); } }, { noAOrecv: true });
M.HEADLIGHT = material('phare', c => { rgb(c, 1, 1, 0.9); emit(c, 1.5, 1.45, 1.2); }, { noShadow: true, noAOrecv: true });
M.TAILLIGHT = material('feu arrière', c => { rgb(c, 0.8, 0.1, 0.1); emit(c, 1.0, 0.1, 0.08); }, { noShadow: true, noAOrecv: true });
M.LIT_PANEL = material('caisson lumineux', c => { rgb(c, 0.9, 0.9, 0.85); emit(c, 0.75, 0.76, 0.70); }, { noAOrecv: true });

// ---------------------------------------------------------------- végétal
M.FOLIAGE = material('feuillage', c => {
  const v = hash(c.ix, c.iy, c.iz, 121);
  let r, g, b;
  if (v < 0.40) { r = 0.30; g = 0.42; b = 0.17; } else if (v < 0.64) { r = 0.50; g = 0.50; b = 0.18; }
  else if (v < 0.86) { r = 0.64; g = 0.44; b = 0.14; } else { r = 0.56; g = 0.26; b = 0.10; }
  rgb(c, r, g, b);
  const h = hash(c.a, c.b, 122, c.face);
  if (c.face === TOP) mul(c, 1.3 + (h - 0.5) * 0.35); else mul(c, 0.95 + (h - 0.5) * 0.35);
}, { trans: 0.45, noAO: true, noAOrecv: true });
M.HEDGE = material('haie', c => { rgb(c, 0.17, 0.27, 0.13); grain(c, 0.2); if (c.face === TOP) mul(c, 1.15); }, { trans: 0.3 });
M.BARK = material('écorce de platane', c => {
  const n = fbm(along(c) * 0.8 + (c.face === TOP ? c.hy : 0), c.hz * 0.35, 131, 2);
  if (n < 0.4) rgb(c, 0.40, 0.38, 0.30); else if (n < 0.62) rgb(c, 0.56, 0.54, 0.44); else rgb(c, 0.68, 0.66, 0.54);
  grain(c, 0.05);
});

// ---------------------------------------------------------------- tissus et objets
M.AWNING = material('store bordeaux', c => { const st = mod(Math.floor((c.face === TOP ? c.a : c.a) / 3), 2); if (st) rgb(c, 0.46, 0.12, 0.18); else rgb(c, 0.76, 0.70, 0.58); if (c.face !== TOP) mul(c, 0.85); grain(c, 0.04); });
M.AWNING_GREEN = material('store vert', c => { const st = mod(Math.floor(c.a / 3), 2); if (st) rgb(c, 0.17, 0.32, 0.24); else rgb(c, 0.72, 0.68, 0.56); if (c.face !== TOP) mul(c, 0.85); grain(c, 0.04); });
M.CANVAS = material('toile', c => { rgb(c, 0.62, 0.56, 0.44); grain(c, 0.06); });
M.SEAT = material('siège', c => { rgb(c, 0.42, 0.12, 0.16); grain(c, 0.08); });
M.SEAT_GREY = material('siège gris', c => { rgb(c, 0.48, 0.49, 0.50); grain(c, 0.08); });
M.FLAG = material('fanion', c => { rgb(c, 0.72, 0.62, 0.15); if (mod(c.b, 2)) rgb(c, 0.45, 0.12, 0.18); });
M.WHITE = material('blanc', c => { rgb(c, 0.78, 0.77, 0.72); grain(c, 0.05); });
M.KEG = material('fût', c => { rgb(c, 0.48, 0.49, 0.50); if (c.face !== TOP && mod(c.b, 4) === 0) mul(c, 0.7); grain(c, 0.05); });
M.CRATE_RED = material('casier rouge', c => { rgb(c, 0.50, 0.15, 0.13); if (mod(c.a, 2) && c.face !== TOP) mul(c, 0.7); });
M.CRATE_GREEN = material('casier vert', c => { rgb(c, 0.20, 0.36, 0.22); if (mod(c.a, 2) && c.face !== TOP) mul(c, 0.7); });
M.BIN = material('poubelle', c => { rgb(c, 0.20, 0.30, 0.22); grain(c, 0.06); if (c.face !== TOP && mod(c.b, 5) === 0) mul(c, 0.8); });
M.POSTER = material('affiche', c => { rgb(c, 0.6, 0.58, 0.5); });
M.PLASTIC_RED = material('plastique rouge', c => { rgb(c, 0.55, 0.13, 0.12); grain(c, 0.05); });
M.PLASTIC_WHITE = material('plastique blanc', c => { rgb(c, 0.72, 0.71, 0.68); grain(c, 0.05); });

// ---------------------------------------------------------------- calques : fenêtres, vitrines, enseignes
function local(o, c) {
  const la = o.face === LEFT ? Math.floor(2 * c.hx) - 2 * o.a0 : 2 * o.a0 - 1 - Math.floor(2 * c.hy);
  const lb = Math.floor(2 * c.hz) - 2 * o.z0;
  return [la, lb];
}
overlay('window', (o, c) => {
  if (c.face !== o.face) return;
  const [la, lb] = local(o, c);
  const W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  const frame = o.frame || [0.60, 0.58, 0.52];
  const mid = Math.floor(W2 / 2), tr = Math.round(H2 * 0.68);
  if (la === 0 || la === W2 - 1 || lb === 0 || lb === H2 - 1 || la === mid || lb === tr) {
    rgb(c, frame[0], frame[1], frame[2]); c.er = c.eg = c.eb = 0; return;
  }
  const st = o.state;
  if (st === 'dark') {
    rgb(c, 0.055, 0.06, 0.075);
    if (mod(la + (H2 - lb), 11) < 2) rgb(c, 0.13, 0.14, 0.17);
    if (o.curtain && (la < 2 || la > W2 - 3)) rgb(c, o.curtain[0] * 0.35, o.curtain[1] * 0.35, o.curtain[2] * 0.35);
    return;
  }
  let col = o.col || [1.0, 0.70, 0.36], k = o.k || 0.62;
  if (st === 'tv') { col = [0.42, 0.52, 0.85]; k = 0.42 + 0.12 * hash(Math.floor(lb / 2), 0, 141, o.seed || 0); }
  if (st === 'office') { col = [0.86, 0.92, 0.82]; k = 0.62; }
  let e = k * (0.78 + 0.32 * lb / H2);
  if (st === 'office' && mod(lb, 3) === 0) e *= 0.35;
  if (lb < 3) e *= 0.75;
  rgb(c, col[0] * 0.3, col[1] * 0.3, col[2] * 0.3);
  if (o.curtain && (la < 2 || la > W2 - 3)) {
    const cu = o.curtain; const f = mod(la, 2) ? 0.85 : 1;
    c.er = cu[0] * e * 0.75 * f; c.eg = cu[1] * e * 0.75 * f; c.eb = cu[2] * e * 0.75 * f; return;
  }
  // silhouette (tête, chignon, épaules)
  if (o.sil) {
    const sx = (o.silX != null ? o.silX : mid + 2), hy = 9;
    const dx = la - sx, dyh = lb - hy;
    const head = dx * dx + dyh * dyh * 1.2 <= 4.5;
    const bun = o.sil === 'chignon' && (dx - 0) * (dx - 0) + (lb - (hy + 3)) * (lb - (hy + 3)) <= 1.6;
    const shoulders = lb <= hy - 2 && Math.abs(dx) <= 4 - Math.max(0, (lb - (hy - 4)));
    if (head || bun || shoulders) { rgb(c, 0.05, 0.04, 0.04); c.er = col[0] * e * 0.08; c.eg = col[1] * e * 0.08; c.eb = col[2] * e * 0.08; return; }
  }
  c.er = col[0] * e; c.eg = col[1] * e; c.eb = col[2] * e;
});

const SHOPS = {
  laverie(la, lb, W2, H2, c, o) {
    let e = [0.70, 0.83, 0.86], k = 0.78;
    if (mod(la, 16) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.14, 0.15, 0.16); return null; }
    const bw = 9, slot = Math.floor((la - 1) / (bw + 1)), sl = mod(la - 1, bw + 1);
    const rowB = lb >= 2 && lb <= 11, rowT = lb >= 14 && lb <= 21;
    if ((rowB || rowT) && sl < bw) {
      const cy = rowB ? 6.5 : 17.5, cx = 4;
      const d = Math.hypot(sl - cx, lb - cy);
      if (d < 2.4) {
        const h = hash(slot, rowB ? 1 : 2, Math.floor(lb + la / 3), 151);
        const running = (slot + (rowB ? 0 : 1)) % 3 === 1;
        if (running && lb < cy + 0.5) { const p = [[0.55, 0.15, 0.2], [0.25, 0.32, 0.55], [0.75, 0.68, 0.3], [0.85, 0.85, 0.8]][Math.floor(h * 4)]; return [p[0], p[1], p[2], 0.55]; }
        return [0.36, 0.48, 0.52, 0.7];
      }
      if (d < 3.4) return [0.22, 0.24, 0.25, 0.6];
      return [0.82, 0.84, 0.82, 0.62 - (lb === 2 || lb === 14 ? 0.15 : 0)];
    }
    if (lb === 12 || lb === 13) return [0.5, 0.52, 0.5, 0.35];
    return [e[0], e[1], e[2], k * (0.8 + 0.25 * lb / H2)];
  },
  tabac(la, lb, W2, H2, c) {
    if (mod(la, 20) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.12, 0.10, 0.08); return null; }
    if (lb < 8) { if (lb === 7) return [0.7, 0.5, 0.3, 0.5]; return [0.35, 0.22, 0.12, 0.35]; }
    if (lb >= 10 && mod(lb, 4) === 1) return [0.35, 0.25, 0.15, 0.4];
    if (lb >= 10) { const h = hash(la, Math.floor(lb / 4), 161, 0); const p = [[0.8, 0.75, 0.6], [0.7, 0.25, 0.2], [0.3, 0.45, 0.6], [0.85, 0.7, 0.3], [0.5, 0.6, 0.4]][Math.floor(h * 5)]; return [p[0], p[1], p[2], 0.55]; }
    const dx = la - W2 * 0.35; if (lb >= 8 && lb <= 11 && dx * dx + (lb - 10) * (lb - 10) < 4) { rgb(c, 0.05, 0.04, 0.04); return null; }
    return [1.0, 0.78, 0.5, 0.6];
  },
  pharmacie(la, lb, W2, H2, c) {
    if (mod(la, 14) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.12, 0.13, 0.12); return null; }
    if (lb < 6) return [0.85, 0.88, 0.85, 0.45];
    if (mod(lb, 5) === 0) return [0.9, 0.92, 0.9, 0.7];
    const h = hash(la, Math.floor(lb / 5), 171, 0);
    if (h < 0.45) { const p = [[0.85, 0.85, 0.82], [0.45, 0.70, 0.62], [0.75, 0.55, 0.55], [0.6, 0.65, 0.8]][Math.floor(h / 0.45 * 4)]; return [p[0], p[1], p[2], 0.6]; }
    return [0.78, 0.9, 0.85, 0.72];
  },
  buvette(la, lb, W2, H2, c) {
    if (mod(la, 18) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.10, 0.07, 0.05); return null; }
    if (lb < 7) { if (lb === 6) return [0.75, 0.5, 0.3, 0.55]; return [0.30, 0.17, 0.09, 0.35]; }
    if (la > W2 - 11 && la < W2 - 2 && lb >= 15 && lb <= 20) { const h = hash(Math.floor(lb / 2), 0, 181, 0); return [0.4, 0.5, 0.9, 0.5 + 0.2 * h]; }
    if (lb >= 12 && lb <= 15) { const h = hash(la, 0, 182, 0); if (h < 0.5) { const p = [[0.25, 0.45, 0.25], [0.55, 0.35, 0.15], [0.8, 0.75, 0.6]][Math.floor(h * 6)]; return [p[0], p[1], p[2], 0.6]; } }
    for (const hx of [W2 * 0.25, W2 * 0.55]) { const dx = la - hx; if ((dx * dx + (lb - 9.5) * (lb - 9.5) * 1.2 < 4.5) || (lb <= 7 && Math.abs(dx) < 3.5)) { rgb(c, 0.05, 0.035, 0.03); return null; } }
    return [1.0, 0.60, 0.28, 0.66 + 0.12 * lb / H2];
  },
  boutique(la, lb, W2, H2, c) {
    if (mod(la, 16) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.10, 0.08, 0.07); return null; }
    if (lb < 4) return [0.5, 0.4, 0.3, 0.4];
    const cx = W2 / 2;
    const jersey = (lb >= 8 && lb <= 18 && Math.abs(la - cx) <= 3) || (lb >= 15 && lb <= 18 && Math.abs(la - cx) <= 6);
    if (jersey) return mod(la - cx + 20, 4) < 2 ? [0.62, 0.15, 0.22, 0.75] : [0.55, 0.55, 0.55, 0.65];
    if (lb >= 9 && lb <= 20 && Math.abs(la - cx) > 8 && mod(la, 3) < 2) return mod(Math.floor(la / 3), 2) ? [0.62, 0.15, 0.22, 0.7] : [0.65, 0.65, 0.62, 0.6];
    return [0.98, 0.82, 0.6, 0.6];
  },
  door(la, lb, W2, H2, c) {
    if (la === 0 || la === W2 - 1 || lb === H2 - 1 || lb === Math.round(H2 * 0.75)) { rgb(c, 0.12, 0.09, 0.07); return null; }
    return [1.0, 0.72, 0.4, 0.55];
  },
  gate(la, lb, W2, H2, c) {
    if (mod(la, 3) === 0 || lb === H2 - 2 || lb === 4) { rgb(c, 0.13, 0.13, 0.14); if (lb === H2 - 2 && mod(la, 6) === 0) rgb(c, 0.5, 0.42, 0.2); return null; }
    rgb(c, 0.03, 0.025, 0.025); return null;
  },
  rideau(la, lb, W2, H2, c) {
    rgb(c, mod(lb, 2) ? 0.36 : 0.28, mod(lb, 2) ? 0.36 : 0.28, mod(lb, 2) ? 0.35 : 0.27);
    const n = fbm(la / 6, lb / 4, 191);
    if (n > 0.62 && lb > 4 && lb < H2 - 6) { if (n > 0.7) rgb(c, 0.42, 0.12, 0.2); else rgb(c, 0.15, 0.15, 0.17); }
    return null;
  },
};
overlay('shop', (o, c) => {
  if (c.face !== o.face) return;
  const [la, lb] = local(o, c);
  const W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  rgb(c, 0.05, 0.05, 0.05);
  const r = SHOPS[o.kind](la, lb, W2, H2, c, o);
  if (r) { const k = r[3] * (o.k || 1); rgb(c, r[0] * 0.3, r[1] * 0.3, r[2] * 0.3); c.er = r[0] * k; c.eg = r[1] * k; c.eb = r[2] * k; }
});
overlay('sign', (o, c) => {
  if (c.face !== o.face) return;
  const la = o.face === LEFT ? Math.floor(2 * c.hx) - 2 * o.a0 : 2 * o.a0 - 1 - Math.floor(2 * c.hy);
  const lt = 2 * o.zTop - 1 - Math.floor(2 * c.hz);
  if (!o.bmp) o.bmp = textBitmap(o.text);
  const sc = o.scale || 1;
  const bx = Math.floor((la - (o.padX || 0)) / sc), by = Math.floor((lt - (o.padY || 0)) / sc);
  const on = (la - (o.padX || 0)) >= 0 && (lt - (o.padY || 0)) >= 0 && o.bmp.at(bx, by);
  if (on) {
    const fg = o.fg || [0.85, 0.8, 0.66];
    rgb(c, fg[0], fg[1], fg[2]);
    if (o.emit) { c.er = o.emit[0]; c.eg = o.emit[1]; c.eb = o.emit[2]; }
    if (o.worn && hash(la, lt, 201, 0) < o.worn) { if (o.plate) rgb(c, o.plate[0], o.plate[1], o.plate[2]); c.er = c.eg = c.eb = 0; }
  } else if (o.plate) { rgb(c, o.plate[0], o.plate[1], o.plate[2]); grain(c, 0.04); c.er = c.eg = c.eb = 0; if (o.plateEmit) { c.er = o.plateEmit[0]; c.eg = o.plateEmit[1]; c.eb = o.plateEmit[2]; } }
  else if (o.drip && lt > 0) {
    // coulures sous les lettres peintes
    const above = o.bmp.at(bx, Math.floor((o.bmp.h * sc - 1) / sc));
    if (by >= o.bmp.h && by < o.bmp.h + 3 && above && hash(la, 0, 202, 0) < 0.3) { const fg = o.fg; rgb(c, fg[0] * 0.9, fg[1] * 0.9, fg[2] * 0.9); }
  }
});
overlay('poster', (o, c) => {
  if (c.face !== o.face) return;
  const [la, lb] = local(o, c);
  const W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  const lt = H2 - 1 - lb;
  const bg = o.bg || [0.80, 0.76, 0.66];
  rgb(c, bg[0], bg[1], bg[2]);
  if (la === 0 || la === W2 - 1 || lt === 0 || lt === H2 - 1) mul(c, 0.85);
  if (!o.bmp && o.title) o.bmp = textBitmap(o.title);
  if (o.bmp) { const x = la - 2, y = lt - 2; if (x >= 0 && y >= 0 && o.bmp.at(x, y)) { const f = o.fg || [0.42, 0.10, 0.16]; rgb(c, f[0], f[1], f[2]); } }
  if (lt > 9 && lt < H2 - 2 && la > 1 && la < W2 - 2 && mod(lt, 3) === 1 && hash(Math.floor(la / 4), lt, 211, o.seed || 0) < 0.65) rgb(c, 0.32, 0.30, 0.28);
  if (o.band && lt >= H2 - 5 && lt < H2 - 2) { rgb(c, o.band[0], o.band[1], o.band[2]); }
  if (o.lit) { c.er = c.cr * o.lit; c.eg = c.cg * o.lit; c.eb = c.cb * o.lit; }
  if (o.torn && hash(Math.floor(la / 2), Math.floor(lt / 2), 212, o.seed || 0) < o.torn) rgb(c, 0.5, 0.48, 0.44);
});
overlay('crest', (o, c) => {
  if (c.face !== o.face) return;
  const [la, lb] = local(o, c);
  const W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  const lt = H2 - 1 - lb;
  const half = W2 / 2;
  const inside = lt < H2 * 0.55 ? true : Math.abs(la + 0.5 - half) < half * (1 - (lt - H2 * 0.55) / (H2 * 0.45));
  if (!inside) return;
  if (la === 0 || la === W2 - 1 || lt === 0) { rgb(c, 0.75, 0.68, 0.45); return; }
  if (Math.abs(la + 0.5 - half) < 1.2) { rgb(c, 0.55, 0.55, 0.53); return; }
  rgb(c, 0.42, 0.11, 0.16);
});

module.exports = { M, GROUND };
