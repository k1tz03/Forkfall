'use strict';
// La rue des Lilas, le sud résidentiel d'Aubérive, en 1991.
// Au nord de la rue : les immeubles de rapport (quatre et cinq étages), ton appartement au deuxième,
// au-dessus de la boulangerie du coin, l'école publique et sa cour, le square des Lilas, l'épicerie,
// le café du Terminus et la gare routière, où le car du Racing attend Norbert.
// Au sud de la rue : les pavillons, leurs jardins, leurs haies et leur linge.
// Coordonnées locales : x ∈ [0, 1000), y ∈ [0, 188) ; 1 voxel = 20 cm ; chaussée à z = 1, trottoirs à z = 2.
// La caméra voit le dessus, les faces +y et +x : toutes les façades qui comptent donnent au sud ou à l'est.
const E = require('./engine');
const { M } = require('./mats');
const B = require('./build');
const SP = require('./sprites');
const { LEFT, RIGHT, TOP, hash, fbm, mod, clamp, material, overlay, textBitmap } = E;
const { Facade } = B;

const G = 2;
const ZMAX = 95; // rien au-dessus : les couches hautes du monde reviennent en fantômes dans le ciel (castRay, y < 0)
// Les destinations des quais : des villes du contenu (content/names/fr.yaml), jamais une commune réelle.
const DEST = { quai1: 'VALDORNE', quai2: 'VILLEBRANLE', quai3: 'LA CAPITALE' };

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const grain = (c, amt, s = 0) => mul(c, 1 + (hash(c.a, c.b, c.face * 7 + s, c.m) - 0.5) * 2 * amt);
const grime = (c, h = 4, k = 0.24) => { if (c.face !== TOP) { const t = clamp((c.hz - G) / h, 0, 1); mul(c, 1 - k * (1 - t)); } };

// ================================================================ matières (dix, toutes préfixées RES_)
M.RES_MEULIERE = material('meulière', c => {
  if (c.face === TOP) { rgb(c, 0.50, 0.45, 0.38); grain(c, 0.06); return; }
  const row = Math.floor(c.b / 3), off = Math.floor(hash(row, 0, 501, 0) * 4);
  const la = mod(c.a + off, 4), lb = mod(c.b, 3), col = Math.floor((c.a + off) / 4);
  if (lb === 0 || (la === 0 && hash(col, row, 503, 0) < 0.85)) { rgb(c, 0.27, 0.24, 0.21); grain(c, 0.1); return; }
  const tone = [[0.62, 0.47, 0.30], [0.54, 0.39, 0.26], [0.68, 0.55, 0.36], [0.47, 0.35, 0.24], [0.60, 0.51, 0.38]][Math.floor(hash(col, row, 502, c.face) * 5)];
  rgb(c, tone[0], tone[1], tone[2]); grain(c, 0.08);
  if (hash(c.a, c.b, 504, 0) < 0.14) mul(c, 0.78);
  grime(c, 4, 0.22);
});
M.RES_FRUITS = material('étal de primeurs', c => {
  if (c.face !== TOP) { rgb(c, 0.46, 0.32, 0.18); if (mod(c.b, 2) === 0) mul(c, 0.72); grain(c, 0.06); return; }
  const kind = Math.floor(hash(c.ix, c.iy, 511, 0) * 6);
  const P = [[0.88, 0.46, 0.08], [0.72, 0.12, 0.10], [0.46, 0.64, 0.18], [0.88, 0.76, 0.22], [0.28, 0.46, 0.18], [0.52, 0.16, 0.30]][kind];
  const d = hash(c.a, c.b, 512, 0);
  rgb(c, P[0], P[1], P[2]); if (d < 0.3) mul(c, 0.72); else if (d > 0.85) mul(c, 1.22);
});
M.RES_LILAS = material('lilas', c => {
  const v = hash(c.ix, c.iy, c.iz, 521);
  let r, g, b;
  if (v < 0.38) { r = 0.58; g = 0.40; b = 0.72; } else if (v < 0.58) { r = 0.74; g = 0.58; b = 0.86; } else if (v < 0.66) { r = 0.86; g = 0.80; b = 0.90; }
  else if (v < 0.88) { r = 0.27; g = 0.40; b = 0.18; } else { r = 0.36; g = 0.48; b = 0.22; }
  rgb(c, r, g, b);
  const h = hash(c.a, c.b, 522, c.face);
  if (c.face === TOP) mul(c, 1.2 + (h - 0.5) * 0.4); else mul(c, 0.9 + (h - 0.5) * 0.4);
}, { trans: 0.45, noAO: true, noAOrecv: true });
M.RES_FLEURS = material('géraniums', c => {
  const v = hash(c.a, c.b, 531, c.face);
  if (v < 0.30) rgb(c, 0.80, 0.16, 0.14); else if (v < 0.42) rgb(c, 0.88, 0.42, 0.52); else if (v < 0.47) rgb(c, 0.90, 0.86, 0.80); else rgb(c, 0.20, 0.36, 0.15);
  if (c.face === TOP) mul(c, 1.12); grain(c, 0.1);
}, { noAOrecv: true });
M.RES_SABLE = material('sable', c => { rgb(c, 0.74, 0.64, 0.45); grain(c, 0.1); if (c.face === TOP && hash(c.a, c.b, 541, 0) < 0.07) mul(c, 0.8); if (c.face !== TOP) mul(c, 0.85); });
M.RES_POTAGER = material('potager', c => {
  if (c.face !== TOP) { rgb(c, 0.30, 0.22, 0.15); grain(c, 0.1); return; }
  if (mod(c.a, 4) < 2) { rgb(c, 0.27, 0.19, 0.13); grain(c, 0.14); return; }
  const h = hash(c.a >> 2, c.b >> 1, 551, 0);
  rgb(c, 0.22 + h * 0.16, 0.40 + h * 0.16, 0.15); if (hash(c.a, c.b, 552, 0) < 0.22) mul(c, 0.7);
});
M.RES_TOLE = material('tôle ondulée', c => {
  rgb(c, 0.40, 0.42, 0.40);
  const k = mod(c.a, 3); if (k === 0) mul(c, 1.18); else if (k === 2) mul(c, 0.8);
  if (hash(c.a >> 2, c.b >> 2, 561, 0) < 0.08) rgb(c, 0.44, 0.28, 0.16);
  if (c.face !== TOP) mul(c, 0.85);
});
M.RES_LINGE = material('linge', c => {
  const v = hash(Math.floor((c.ix + c.iy) / 3), c.iz > 0 ? 1 : 0, 571, 0);
  const P = [[0.84, 0.82, 0.76], [0.44, 0.55, 0.74], [0.82, 0.58, 0.60], [0.84, 0.76, 0.40], [0.58, 0.72, 0.58], [0.86, 0.84, 0.80]][Math.floor(v * 6)];
  rgb(c, P[0], P[1], P[2]); if (mod(c.b, 3) === 0) mul(c, 0.9); grain(c, 0.04);
}, { trans: 0.6, noAOrecv: true });
const auvent = (c, lit) => {
  rgb(c, 0.50, 0.54, 0.55);
  if (mod(c.a, 8) === 0 || (c.face === TOP && mod(c.b, 12) === 0)) { rgb(c, 0.24, 0.26, 0.27); return; }
  grain(c, 0.04); if (c.face !== TOP) mul(c, 0.8);
  if (lit) { c.er = 0.13; c.eg = 0.15; c.eb = 0.13; }
};
M.RES_AUVENT = material('auvent translucide', c => auvent(c, false), { trans: 0.55 });
M.RES_AUVENT_NUIT = material('auvent éclairé', c => auvent(c, true), { trans: 0.55, noAOrecv: true });

// ================================================================ calques (aucun ne coûte de matière)
function loc(o, c) {
  const la = o.face === LEFT ? Math.floor(2 * c.hx) - 2 * o.a0 : 2 * o.a0 - 1 - Math.floor(2 * c.hy);
  return [la, Math.floor(2 * c.hz) - 2 * o.z0];
}
const PATISS = [[0.82, 0.56, 0.24], [0.74, 0.16, 0.14], [0.94, 0.90, 0.78], [0.48, 0.28, 0.15], [0.90, 0.72, 0.32]];
const VITRINES = {
  boulangerie(la, lb, W2, H2, c) {
    if (mod(la, 16) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.10, 0.08, 0.06); return null; }
    if (lb <= 6) {
      if (lb === 6) return [0.95, 0.90, 0.78, 0.7];
      if (lb >= 3 && mod(la, 4) !== 0) { const p = PATISS[Math.floor(hash(la >> 2, lb > 4 ? 1 : 0, 601, 0) * 5)]; return [p[0], p[1], p[2], 0.78]; }
      return [0.40, 0.27, 0.16, 0.35];
    }
    const r = lb - 7, sh = mod(r, 6), band = Math.floor(r / 6);
    if (sh === 5) return [0.38, 0.24, 0.13, 0.45];
    if (band % 2 === 0) { if (mod(la + sh, 3) === 0) return [0.88, 0.63, 0.27, 0.82]; }
    else { const cx = mod(la, 6) - 2.5, cy = sh - 2; if (cx * cx + cy * cy * 1.6 <= 5) return [0.76, 0.49, 0.20, 0.82]; }
    return [1.0, 0.82, 0.52, 0.62];
  },
  epicerie(la, lb, W2, H2, c) {
    if (mod(la, 18) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.10, 0.10, 0.09); return null; }
    if (lb <= 5) {
      const p = [[0.84, 0.46, 0.10], [0.36, 0.56, 0.20], [0.72, 0.15, 0.12], [0.82, 0.74, 0.25]][Math.floor(hash(la / 3 | 0, 0, 611, 0) * 4)];
      return lb >= 2 ? [p[0], p[1], p[2], 0.62] : [0.45, 0.32, 0.18, 0.4];
    }
    const sh = mod(lb - 6, 5);
    if (sh === 4) return [0.56, 0.56, 0.52, 0.45];
    const h = hash(la >> 1, Math.floor((lb - 6) / 5), 612, 0);
    if (h < 0.72) { const p = [[0.82, 0.20, 0.15], [0.20, 0.35, 0.66], [0.86, 0.76, 0.30], [0.90, 0.88, 0.80], [0.30, 0.56, 0.30], [0.62, 0.30, 0.15]][Math.floor(h / 0.72 * 6)]; return [p[0], p[1], p[2], 0.66]; }
    return [0.92, 0.95, 0.82, 0.6];
  },
  cafe(la, lb, W2, H2, c, o) {
    if (mod(la, 20) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.10, 0.06, 0.05); return null; }
    if (lb < 7) { if (lb === 6) return [0.80, 0.55, 0.30, 0.6]; return [0.32, 0.17, 0.09, 0.4]; }
    if (lb >= 13 && lb <= 16 && mod(la, 2) === 0) { const p = [[0.25, 0.45, 0.25], [0.62, 0.36, 0.15], [0.86, 0.80, 0.60], [0.56, 0.15, 0.15]][Math.floor(hash(la, 0, 621, 0) * 4)]; return [p[0], p[1], p[2], 0.62]; }
    if (lb === 12) return [0.45, 0.30, 0.18, 0.4];
    for (const hx of (o.clients || [])) { const dx = la - hx; if ((dx * dx + (lb - 10) * (lb - 10) * 1.2 < 4.5) || (lb <= 8 && Math.abs(dx) < 3.5)) { rgb(c, 0.05, 0.035, 0.03); return null; } }
    if (o.fanion != null && lb >= 14 && lb <= 18 && la >= o.fanion && la < o.fanion + 7 - (18 - lb)) return [0.62, 0.14, 0.20, 0.72];
    return [1.0, 0.62, 0.30, 0.66 + 0.1 * lb / H2];
  },
  coiffure(la, lb, W2, H2, c) {
    if (mod(la, 16) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.12, 0.10, 0.10); return null; }
    const cell = mod(la, 16), n = Math.floor(la / 16);
    if (n % 2 === 1 && lb >= 9 && lb <= 15) { const dx = cell - 8, dy = lb - 12; if (dx * dx * 0.6 + dy * dy < 9) return [0.62, 0.62, 0.68, 0.55]; }
    if (lb >= 3 && lb <= 9 && cell >= 5 && cell <= 11) { rgb(c, 0.10, 0.06, 0.07); return null; }
    if (lb >= 10 && lb <= 17 && cell >= 3 && cell <= 13) return [0.82, 0.88, 0.90, 0.75];
    return [1.0, 0.82, 0.78, 0.6];
  },
  presse(la, lb, W2, H2, c) {
    if (mod(la, 14) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.10, 0.09, 0.08); return null; }
    if (lb < 5) return [0.45, 0.33, 0.20, 0.4];
    if (mod(la, 3) === 2 || mod(lb - 5, 4) === 3) return [0.30, 0.25, 0.20, 0.35];
    const p = [[0.86, 0.82, 0.70], [0.80, 0.25, 0.20], [0.25, 0.40, 0.70], [0.86, 0.70, 0.25], [0.30, 0.60, 0.40], [0.90, 0.88, 0.85]][Math.floor(hash(la / 3 | 0, (lb - 5) >> 2, 631, 0) * 6)];
    return [p[0], p[1], p[2], 0.6];
  },
  guichet(la, lb, W2, H2, c, o) {
    if (mod(la, 12) === 0 || lb === 0 || lb === H2 - 1 || lb === 7) { rgb(c, 0.16, 0.17, 0.17); return null; }
    if (lb < 7) return [0.40, 0.42, 0.40, 0.35];
    const cell = mod(la, 12), dx = cell - 6;
    if (o.employe && Math.floor(la / 12) === 0 && (dx * dx + (lb - 12) * (lb - 12) * 1.2 < 4.5 || (lb <= 10 && Math.abs(dx) < 3.5))) { rgb(c, 0.05, 0.05, 0.05); return null; }
    if (lb >= 14 && cell >= 2 && cell <= 4) return [0.92, 0.92, 0.86, 0.55];
    return [0.85, 0.92, 0.88, 0.62];
  },
  attente(la, lb, W2, H2, c, o) {
    if (mod(la, 20) === 0 || lb === 0 || lb === H2 - 1) { rgb(c, 0.14, 0.15, 0.15); return null; }
    if (lb >= 2 && lb <= 4 && mod(la, 20) > 2 && mod(la, 20) < 17) { rgb(c, 0.12, 0.10, 0.08); return null; }
    for (const hx of (o.gens || [])) { const dx = la - hx; if (dx * dx + (lb - 8) * (lb - 8) * 1.2 < 4 || (lb <= 6 && lb >= 3 && Math.abs(dx) < 3)) { rgb(c, 0.05, 0.05, 0.05); return null; } }
    if (lb >= H2 - 5 && lb <= H2 - 3 && mod(la, 30) > 4 && mod(la, 30) < 12) return [0.95, 0.85, 0.40, 0.7];
    return [0.82, 0.90, 0.85, 0.6];
  },
  fournil(la, lb, W2, H2, c) {
    if (mod(la, 4) === 0) { rgb(c, 0.08, 0.06, 0.05); return null; }
    return [1.0, 0.50, 0.18, 0.8];
  },
  ecole(la, lb, W2, H2, c, o) {
    const mid = Math.floor(W2 / 2), tr = Math.round(H2 * 0.7);
    if (la === 0 || la === W2 - 1 || lb === 0 || lb === H2 - 1 || la === mid || lb === tr || (lb < tr && mod(lb, 5) === 0)) { rgb(c, 0.64, 0.62, 0.56); return null; }
    if (o.lit) return [1.0, 0.85, 0.6, 0.5];
    const h = hash(la / 5 | 0, lb / 5 | 0, 641, o.seed || 0);
    if (lb < tr && h < 0.38) { const p = [[0.86, 0.30, 0.20], [0.95, 0.80, 0.25], [0.30, 0.50, 0.82], [0.40, 0.70, 0.35], [0.92, 0.90, 0.82]][Math.floor(h / 0.38 * 5)]; rgb(c, p[0], p[1], p[2]); return null; }
    rgb(c, 0.06, 0.065, 0.08); if (mod(la - lb, 11) < 2) rgb(c, 0.14, 0.15, 0.18);
    return null;
  },
  cage(la, lb, W2, H2, c, o) {
    if (la === 0 || la === W2 - 1 || lb === 0 || lb === H2 - 1) { rgb(c, 0.55, 0.53, 0.48); return null; }
    if (!o.lit) { rgb(c, 0.06, 0.065, 0.08); return null; }
    if (Math.abs(la - lb * 0.6 - 1) < 0.8) { rgb(c, 0.10, 0.08, 0.06); return null; }
    return [1.0, 0.80, 0.45, 0.5];
  },
};
overlay('res_vitrine', (o, c) => {
  if (c.face !== o.face) return;
  const [la, lb] = loc(o, c);
  const W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  rgb(c, 0.05, 0.05, 0.05); c.er = c.eg = c.eb = 0;
  const r = VITRINES[o.kind](la, lb, W2, H2, c, o);
  if (r) { const k = r[3] * (o.k != null ? o.k : 1); rgb(c, r[0] * 0.3, r[1] * 0.3, r[2] * 0.3); c.er = r[0] * k; c.eg = r[1] * k; c.eb = r[2] * k; }
});
// peintures au sol : la marelle, les inscriptions
const DIGIT = []; for (let d = 0; d <= 9; d++) DIGIT[d] = textBitmap(String(d));
const MARELLE = [[7, 8], [6], [4, 5], [3], [2], [1]];
function marelle(la, lb) {
  if (lb < 0 || lb > 42 || la < 0 || la > 12) return false;
  if (lb <= 6) { const d = Math.hypot(la - 6, lb - 6.5); return Math.abs(d - 6) < 0.75 || lb === 6; }
  const r = Math.min(5, Math.floor((lb - 6) / 6)), lb0 = 6 + 6 * r, v = lb - lb0;
  const nums = MARELLE[r], dbl = nums.length === 2, u0 = dbl ? 0 : 3, u1 = dbl ? 12 : 9;
  if (la < u0 || la > u1) return false;
  if (v === 0 || v === 6) return true;
  if (la === u0 || la === u1 || (dbl && la === 6)) return true;
  const ci = dbl && la > 6 ? 1 : 0, cu = (dbl ? (ci ? 6 : 0) : 3) + 2;
  return DIGIT[nums[ci]].at(la - cu, v) === 1;
}
overlay('res_sol', (o, c) => {
  if (c.face !== TOP) return;
  const la = Math.floor(2 * (c.hx - o.x0)), lb = Math.floor(2 * (c.hy - o.y0));
  let on = false;
  if (o.kind === 'marelle') on = marelle(la, lb);
  else { if (!o.bmp) o.bmp = textBitmap(o.text); const sc = o.scale || 1; on = la >= 0 && lb >= 0 && o.bmp.at(Math.floor(la / sc), Math.floor(lb / sc)) === 1; }
  if (on && hash(c.a, c.b, 651, 0) > (o.worn || 0.08)) { const p = o.col || [0.84, 0.83, 0.78]; rgb(c, p[0], p[1], p[2]); c.wet *= 0.4; }
});
// l'horloge du fronton de l'école
overlay('res_horloge', (o, c) => {
  if (c.face !== o.face) return;
  const [la, lb] = loc(o, c);
  const r = o.w, dx = la + 0.5 - r, dy = lb + 0.5 - r, d = Math.hypot(dx, dy);
  if (d > r) return;
  if (d > r - 1.1) { rgb(c, 0.20, 0.17, 0.12); c.er = c.eg = c.eb = 0; return; }
  rgb(c, 0.86, 0.84, 0.76); grain(c, 0.03);
  if (o.lit) { c.er = 0.42; c.eg = 0.40; c.eb = 0.32; }
  const hand = (a, len) => { const t = dx * Math.sin(a) + dy * Math.cos(a), n = Math.abs(dx * Math.cos(a) - dy * Math.sin(a)); return t > -0.3 && t < len && n < 0.62; };
  if (hand(Math.PI, r - 1.6) || hand(4.45, r * 0.55)) { rgb(c, 0.08, 0.07, 0.06); c.er = c.eg = c.eb = 0; }
});
// les vitres latérales d'un autocar : montants, têtières, intérieur allumé la nuit
overlay('res_carvitre', (o, c) => {
  if (c.face !== o.face) return;
  const [la, lb] = loc(o, c);
  const W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  if (mod(la, 14) === 0 || lb === H2 - 1) { rgb(c, 0.07, 0.07, 0.08); c.er = c.eg = c.eb = 0; return; }
  const seat = mod(la, 7), head = lb >= 1 && lb <= 4 && seat >= 2 && seat <= 4;
  const pax = o.pax && hash(la / 7 | 0, 0, 661, o.seed || 0) < o.pax && lb >= 3 && lb <= 7 && seat >= 2 && seat <= 4;
  if (o.lit) {
    if (head || pax) { rgb(c, 0.05, 0.04, 0.04); c.er = 0.08; c.eg = 0.06; c.eb = 0.03; return; }
    if (o.rideau && mod(la, 14) < 3) { rgb(c, 0.3, 0.1, 0.1); c.er = 0.45; c.eg = 0.14; c.eb = 0.12; return; }
    rgb(c, 0.2, 0.15, 0.1); const e = 0.55 * (0.8 + 0.3 * lb / H2); c.er = e; c.eg = 0.78 * e; c.eb = 0.45 * e; return;
  }
  rgb(c, 0.07, 0.08, 0.10);
  if (head) rgb(c, 0.20, 0.10, 0.11);
  if (pax) rgb(c, 0.10, 0.08, 0.07);
  if (o.rideau && mod(la, 14) < 3) rgb(c, 0.40, 0.12, 0.15);
  if (mod(la - lb, 11) < 2) { c.cr += 0.09; c.cg += 0.09; c.cb += 0.10; }
});
// la fenêtre de l'appartement : rideaux, plantes sur l'appui, Camille et sa queue de cheval
overlay('res_fenetre', (o, c) => {
  if (c.face !== o.face) return;
  const [la, lb] = loc(o, c);
  const W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  const mid = Math.floor(W2 / 2), tr = Math.round(H2 * 0.68);
  if (la === 0 || la === W2 - 1 || lb === 0 || lb === H2 - 1 || la === mid || lb === tr) { rgb(c, 0.62, 0.60, 0.54); c.er = c.eg = c.eb = 0; return; }
  const plant = lb >= 1 && lb <= 3 && (mod(la, 5) === 1 || mod(la, 5) === 2) && la > 1 && la < W2 - 2;
  const cu = o.curtain || [0.62, 0.30, 0.22];
  if (o.state === 'dark') {
    rgb(c, 0.055, 0.06, 0.075); if (mod(la + (H2 - lb), 11) < 2) rgb(c, 0.13, 0.14, 0.17);
    if (la < 2 || la > W2 - 3) rgb(c, cu[0] * 0.35, cu[1] * 0.35, cu[2] * 0.35);
    if (plant) rgb(c, 0.12, 0.22, 0.10);
    return;
  }
  const col = [1.0, 0.70, 0.36]; let e = 0.66 * (0.78 + 0.32 * lb / H2); if (lb < 3) e *= 0.75;
  rgb(c, col[0] * 0.3, col[1] * 0.3, col[2] * 0.3);
  if (plant) { rgb(c, 0.04, 0.06, 0.03); c.er = 0.06; c.eg = 0.08; c.eb = 0.02; return; }
  if (la < 2 || la > W2 - 3) { const f = mod(la, 2) ? 0.85 : 1; c.er = cu[0] * e * 0.75 * f; c.eg = cu[1] * e * 0.75 * f; c.eb = cu[2] * e * 0.75 * f; return; }
  if (o.sil) {
    const sx = o.silX != null ? o.silX : mid - 3, hy = 10, dx = la - sx, dyh = lb - hy;
    const head = dx * dx + dyh * dyh * 1.2 <= 4.5;
    const tail = (dx === 2 || dx === 3) && lb >= hy - 4 && lb <= hy + 1;
    const shoulders = lb <= hy - 2 && lb >= 3 && Math.abs(dx) <= 4 - Math.max(0, lb - (hy - 4));
    if (head || tail || shoulders) { rgb(c, 0.05, 0.04, 0.04); c.er = col[0] * e * 0.07; c.eg = col[1] * e * 0.07; c.eb = col[2] * e * 0.07; return; }
  }
  c.er = col[0] * e; c.eg = col[1] * e; c.eb = col[2] * e;
});

// ================================================================ personnages (1 pixel = 10 cm)
const KK = [0.06, 0.045, 0.04];
const BASE = {
  k: KK, s: [0.86, 0.69, 0.55], S: [0.66, 0.48, 0.37], h: [0.17, 0.11, 0.08], H: [0.30, 0.20, 0.13],
  o: [0.09, 0.09, 0.09], j: [0.24, 0.30, 0.42], J: [0.16, 0.20, 0.30], g: [0.46, 0.46, 0.45], G: [0.32, 0.32, 0.32],
  y: [0.80, 0.62, 0.20], b: [0.84, 0.82, 0.76], B: [0.58, 0.56, 0.50], w: [0.66, 0.66, 0.64],
};
function spr(rows, extra, ax, o = {}) {
  const w = rows[0].length;
  rows.forEach((r, i) => { if (r.length !== w) throw new Error(`sprite : ligne ${i} de ${r.length} au lieu de ${w} : « ${r} »`); });
  return Object.assign({ rows, pal: Object.assign({}, BASE, extra), ax }, o);
}
// Norbert, le chauffeur du car depuis 1988 : casquette, moustache, blouson du club.
const NORBERT = spr([
  '...kkkkk...',
  '..kvvvvvk..',
  '..kvvvvvvvk',
  '..ksssssk..',
  '..kskskSk..',
  '..khhhhhk..',
  '...kSSSk...',
  '..kMmmmMk..',
  '.kmmmMmmmk.',
  'kmmmmMmmmmk',
  'kmmmmMmmmmk',
  'kmmmmmmmmmk',
  'ksmmmmmmmsk',
  '.kjjjjjjjk.',
  '.kjjjkjjjk.',
  '.kjjjkjjjk.',
  '.kjjjkjjjk.',
  '.koookoook.',
  '..kk...kk..',
], { v: [0.14, 0.14, 0.17], m: [0.44, 0.12, 0.17], M: [0.62, 0.62, 0.60], j: [0.17, 0.17, 0.20], h: [0.32, 0.24, 0.17] }, 5);
// Camille : la queue de cheval, le pull orange, l'arrosoir.
const CAMILLE = spr([
  '...kkkk....',
  '..khhhhk...',
  '..khhhhhkk.',
  '..kshhhkhk.',
  '..kssskkhk.',
  '..ksSsk.hk.',
  '...kSSk..k.',
  '..kooook...',
  '.kooooook..',
  '.kooOoooaak',
  '.ksoOooaaak',
  '..kooookak.',
  '..kjjjjk...',
  '..kjjjjk...',
  '..kjjkjk...',
  '..kjjkjk...',
  '..kbbkbk...',
  '...kk.k....',
], { h: [0.38, 0.23, 0.12], o: [0.88, 0.47, 0.14], O: [0.68, 0.33, 0.10], a: [0.26, 0.46, 0.32], b: [0.80, 0.78, 0.72] }, 4);
const fille = (r, h) => spr([
  '..kkkk..',
  '.khhhhk.',
  'hkhsshkh',
  'h.kssk.h',
  '..kSSk..',
  '.krrrrk.',
  'krrrrrrk',
  'ksrrrrsk',
  '.krrrrk.',
  'krrrrrrk',
  'kkkkkkkk',
  '.ks..sk.',
  '.ko..ok.',
], { r, h: h || [0.40, 0.25, 0.12] }, 3);
const garcon = (t, h) => spr([
  '..kkkk...',
  '.khhhhk..',
  '.khsssk..',
  '.kssssk..',
  '..kSSk...',
  '.kttttkcc',
  'kttttttkc',
  'ksttttsck',
  '.kttttkck',
  '.kpppkkk.',
  '.kspsk...',
  '.ks.sk...',
  '.ko.ok...',
], { t, h: h || [0.17, 0.11, 0.08], c: [0.42, 0.26, 0.14], p: [0.30, 0.32, 0.40] }, 3);
const SAUTEUSE = spr([
  '...kkkk...',
  '..khhhhk..',
  '.hkhsshkh.',
  '.h.kssk.h.',
  'k..kSSk..k',
  'skkrrrrkks',
  '..krrrrk..',
  '.krrrrrrk.',
  '.krrrrrrk.',
  '..kkkkkk..',
  '...ks.ks..',
  '...ko.kk..',
  '.......k..',
], { r: [0.86, 0.72, 0.22], h: [0.62, 0.42, 0.18] }, 4);
const MAITRESSE = spr([
  '...kkkk...',
  '..khhhhk..',
  '.khhhhhhk.',
  '.khsssshk.',
  '..kgsgsk..',
  '..ksSSsk..',
  '...kssk...',
  '..kcccck..',
  '.kccwwcck.',
  '.kccwwcck.',
  '.kccwwcck.',
  '.ksccccsk.',
  '..kddddk..',
  '..kddddk..',
  '..kddddk..',
  '...kssk...',
  '...kssk...',
  '...kook...',
], { c: [0.30, 0.42, 0.33], w: [0.86, 0.84, 0.78], d: [0.34, 0.26, 0.38], g: [0.12, 0.12, 0.12], h: [0.46, 0.31, 0.18] }, 4);
const BOULANGER = spr([
  '...kkkkk...',
  '..kwwwwwk..',
  '..ksssssk..',
  '..kskskSk..',
  '..ksssssk..',
  '...kSSSk...',
  '..kwwwwwk..',
  '.kwwwwwwwky',
  '.kwwaaawwky',
  '.kwwaaawwky',
  '.kswaaawsky',
  '..kwaaawky.',
  '..kaaaaak..',
  '..kaaaaak..',
  '..kjjkjjk..',
  '..kjjkjjk..',
  '..kookook..',
  '...kk.kk...',
], { w: [0.88, 0.87, 0.82], a: [0.78, 0.78, 0.74], y: [0.82, 0.60, 0.25], j: [0.30, 0.30, 0.32] }, 5);
const EPICIER = spr([
  '...kkkk....',
  '..khhhhk...',
  '..khsssk...',
  '..kskskk...',
  '..khhhhk...',
  '...kSSk....',
  '..kqqqqk...',
  '.kqqqqqqk..',
  '.kqqqqqqk..',
  '.kqqbqqqk..',
  '.ksqqqqsk..',
  '..kqqqqk...',
  '..kqqqqk...',
  '..kjjjjk...',
  '..kjjkjk...',
  '..kjjkjk...',
  '..kookok...',
  '...kk.k....',
], { q: [0.56, 0.54, 0.46], h: [0.20, 0.14, 0.10], s: [0.74, 0.55, 0.40], S: [0.56, 0.40, 0.28], j: [0.22, 0.22, 0.26] }, 4);
const MAMIE = spr([
  '..kkkk......',
  '.kwwwwk.....',
  '.kwsssk.....',
  '.kssksk.....',
  '..ksSk......',
  '.kccccck....',
  'kcccccccck..',
  'kcccccccsk..',
  'kccccccckyk.',
  'kcccccccktk.',
  '.kcccccktTtk',
  '.kcccccktttk',
  '.kcccccktTtk',
  '..kssk.ktttk',
  '..kssk..kkk.',
  '..kook..kok.',
], { w: [0.80, 0.80, 0.78], c: [0.36, 0.40, 0.56], t: [0.56, 0.16, 0.18], T: [0.25, 0.40, 0.30], y: [0.82, 0.60, 0.25] }, 3);
const VOYAGEUR = spr([
  '...kkkk....',
  '..khhhhk...',
  '..khsssk...',
  '..kssksk...',
  '..kssssk...',
  '...kSSk....',
  '..kqqqqk...',
  '.kqqqqqqk..',
  '.kqqqqqqk..',
  '.kqQqqQqk..',
  '.ksqqqqskk.',
  '..kqqqqkvvk',
  '..kjjjjkvvk',
  '..kjjkjkvvk',
  '..kjjkjkvvk',
  '..kjjkjkkkk',
  '..kookok...',
  '...kk.k....',
], { q: [0.40, 0.36, 0.30], Q: [0.30, 0.26, 0.22], v: [0.46, 0.30, 0.18] }, 4);
const VOYAGEUSE = Object.assign({}, VOYAGEUR, { pal: Object.assign({}, BASE, { q: [0.55, 0.22, 0.24], Q: [0.40, 0.15, 0.18], h: [0.70, 0.55, 0.30], v: [0.22, 0.30, 0.45], j: [0.20, 0.20, 0.24] }) });
const CHIEN = spr([
  '.......kk',
  'k.....kbk',
  'kk...kbbk',
  '.kbbbbbk.',
  '.kbkkkbk.',
  '.kk...kk.',
], { b: [0.52, 0.35, 0.18] }, 4, { shadowR: 3 });
const PIGEON = spr(['.kk.', 'kggk'], { g: [0.45, 0.46, 0.50] }, 2, { shadow: false });
const BOULISTE = spr([
  '..kkkkk...',
  '.kvvvvvvk.',
  '..ksssk...',
  '..ksksk...',
  '..kssssk..',
  '...kSSk...',
  '..kbbbbk..',
  '.kbbbbbbk.',
  '.kbbbbbbsk',
  '.kbbbbbbkg',
  '..kbbbbk..',
  '..kjjjjk..',
  '..kjjkjk..',
  '..kjjkjk..',
  '..kookok..',
  '...kk.k...',
], { v: [0.18, 0.20, 0.28], b: [0.74, 0.68, 0.52], g: [0.60, 0.61, 0.63], j: [0.30, 0.28, 0.24] }, 4);
const BOULE = spr(['g'], { g: [0.62, 0.63, 0.66] }, 0, { shadow: false });
const LECTEUR = spr([
  '..kkkk...',
  '.khhhhk..',
  '.khhssk..',
  '.khsssk..',
  '..kssk...',
  '.kpppppk.',
  'kpppppppk',
  'kpPpPpPpk',
  'kpppppppk',
  'kjjjjjjk.',
  '.kkkkjjk.',
  '....kook.',
], { p: [0.84, 0.82, 0.74], P: [0.40, 0.40, 0.40], h: [0.55, 0.55, 0.52] }, 3);
const JARDINIER = spr([
  '..kkkkk....',
  '.kvvvvvvk..',
  '..ksssk....',
  '..ksksk....',
  '..khhhk....',
  '...kSk.....',
  '..kbbbbk...',
  '.kbbbbbbk..',
  '.kbbbbbbkaa',
  '.ksbbbbsaak',
  '..kbbbbkak.',
  '..kbbbbk...',
  '..kbbkbk...',
  '..kbbkbk...',
  '..kbbkbk...',
  '..kookok...',
  '...kk.k....',
], { v: [0.30, 0.28, 0.22], b: [0.28, 0.36, 0.52], h: [0.75, 0.75, 0.72], a: [0.30, 0.48, 0.32] }, 4);
const MERE = spr([
  '...kkkk.........',
  '..khhhhk........',
  '..khhhhk........',
  '..kShhSk........',
  '...kSSk.........',
  '..kqqqqk........',
  '.kqqqqqqk.......',
  '.kqqqqqqsk......',
  '.kqQqqQqkskkkkk.',
  '.ksqqqqk..kbbbbk',
  '..kqqqqk.kbbbbbk',
  '..kjjjjk.kbbbbbk',
  '..kjkkjk.kkkkkkk',
  '..kjk.jk..k...k.',
  '..kok.ok.kok.kok',
  '...k...k..k...k.',
], { q: [0.56, 0.36, 0.46], Q: [0.42, 0.26, 0.34], h: [0.60, 0.40, 0.20], b: [0.30, 0.38, 0.56] }, 4, { shadowR: 6 });
const VELO = spr([
  '....kk.kk.',
  '.....k.k..',
  '..krrrrk..',
  '.kk.kk.kk.',
  'k..kkk.k.k',
  'k..k.k.k.k',
  '.kk...kkk.',
], { r: [0.20, 0.40, 0.62] }, 5, { shadowR: 4 });
const FACTEUR = spr([
  '...kkkk....',
  '..kvvvvk...',
  '..kvvvvvk..',
  '..ksssk....',
  '..kskSk....',
  '...kSSk....',
  '..kqqqqk...',
  '.kqqqqqqk..',
  '.kqqyqqqkk.',
  '.kqqqqqkbbk',
  '.ksqqqqkbbk',
  '..kqqqqkkk.',
  '..kjjjjk...',
  '..kjjkjk...',
  '..kjjkjk...',
  '..kjjkjk...',
  '..kookok...',
  '...kk.k....',
], { q: [0.26, 0.33, 0.54], v: [0.16, 0.20, 0.34], y: [0.85, 0.72, 0.30], b: [0.44, 0.28, 0.15], j: [0.18, 0.20, 0.28] }, 4);
const NAIN = spr(['.r.', 'rrr', 'ksk', 'bbb', 'kjk'], { r: [0.75, 0.15, 0.12], b: [0.85, 0.85, 0.80], j: [0.25, 0.40, 0.25] }, 1, { shadowR: 2 });

// ================================================================ le hasard du quartier (graine tirée de ctx.R)
const RIDEAUX = [[0.62, 0.30, 0.22], [0.55, 0.50, 0.32], [0.35, 0.40, 0.55], [0.55, 0.25, 0.35], [0.70, 0.66, 0.55]];
function etat(k, x, y, z, volet) {
  const v = k.rh(x, y, z), v2 = k.rh(x, y, z + 501), v3 = k.rh(x, y, z + 77);
  const pClose = k.bad ? (k.night ? 0.62 : 0.48) : (k.night ? 0.30 : 0.10);
  const closed = !!volet && v < pClose;
  let state = 'dark';
  if (k.night && !closed) { const p = k.bad ? 0.20 : 0.42; state = v2 < p ? 'lit' : v2 < p + 0.08 ? 'tv' : 'dark'; }
  return { state, closed, curtain: RIDEAUX[Math.floor(v3 * RIDEAUX.length)] };
}

// ================================================================ outils de façade
function vitrine(k, f, s0, z0, w, h, kind, o = {}) {
  f.rect(s0, z0, s0 + w, z0 + h, 0, 0);
  const id = k.W.obj(Object.assign({ type: 'res_vitrine', kind, face: f.face, a0: f.a0(s0), z0, w, h }, o));
  f.rect(s0, z0, s0 + w, z0 + h, 1, M.GLASS, id);
  if (o.lintel !== false) f.rect(s0, z0 + h, s0 + w, z0 + h + 1, 0, o.lintelMat || M.STONE);
  if (o.light) { const p = f.front(s0 + w / 2, z0 + h * 0.6, 3); k.W.light({ x: p.x, y: p.y, z: p.z, r: o.light.r || 34, cr: o.light.c[0], cg: o.light.c[1], cb: o.light.c[2], shadow: true, skip: 2.5 }); }
  return id;
}
function porteImmeuble(k, f, s, o = {}) {
  f.door(s, G, 6, 12, { mat: o.mat || M.WOOD_DARK, step: true, frameMat: M.STONE });
  f.window(s, G + 13, 6, 3, { state: k.night ? 'lit' : 'dark', sill: false, lintel: false, spill: false, col: [1.0, 0.78, 0.45], k: 0.45 });
}
function porteCochere(k, f, s, w = 10) {
  f.door(s, G, w, 15, { mat: M.WOOD_DARK, frameMat: M.STONE });
  for (let z = G + 2; z < G + 14; z += 4) f.set(s + (w >> 1), z, 2, M.METAL_DARK);
}
function fenetreRdc(k, f, s, x, y, o = {}) {
  const st = etat(k, x, y, 6, o.volet);
  const closed = !!o.volet && (st.closed || k.rh(x, y, 7) < (k.night ? 0.6 : 0.3));
  f.window(s, 6, 5, 8, { state: closed ? 'dark' : st.state, shutter: o.volet, closed, curtain: st.curtain, spillR: 18, spillI: 0.4 });
  if (o.barreaux && !closed) for (let i = 0; i < 5; i += 2) for (let z = 6; z < 14; z++) f.set(s + i, z, -1, M.METAL_DARK);
}
function devanture(f, s0, w, bois) {
  f.rect(s0 - 1, G, s0 + 1, 18, -1, bois);
  f.rect(s0 + w - 1, G, s0 + w + 1, 18, -1, bois);
  f.rect(s0 - 1, 14, s0 + w + 1, 18, -1, bois);
}
function lanterne(k, f, s, z, on) {
  for (let i = 1; i <= 3; i++) f.set(s, z, -i, M.METAL_DARK);
  f.set(s, z - 1, -1, M.METAL_DARK);
  f.set(s, z, -4, M.METAL_DARK); f.set(s, z - 1, -4, M.METAL_DARK); f.set(s, z - 2, -4, on ? M.BULB : M.GLASS); f.set(s, z - 3, -4, M.METAL_DARK);
  if (on) { const p = f.front(s, z - 2, 4); k.W.light({ x: p.x, y: p.y, z: p.z - 0.6, r: 60, fall: 2.2, cr: 2.0, cg: 1.28, cb: 0.56, spot: 0.5, skip: 1.6 }); }
}

// ---------------------------------------------------------------- l'immeuble de rapport (façade au sud)
function immeuble(k, o) {
  const W = k.W, { x0, x1, y0, y1, et } = o;
  const fh = et >= 5 ? 14 : 15, w = x1 - x0, d = y1 - y0, zt = 19 + fh * et, mur = o.mur;
  W.box(x0, y0, G, x1, y1, zt, mur);
  const fl = new Facade(W, LEFT, x0, y0, w, d), fr = new Facade(W, RIGHT, x0, y0, w, d);
  fl.rect(0, G, w, G + 2, 0, o.socle || M.STONE);
  fl.rect(0, 18, w, 19, -1, M.STONE);
  fl.rect(0, zt - 1, w, zt, -1, M.STONE);
  if (o.droite) { fr.rect(0, G, d, G + 2, 0, o.socle || M.STONE); fr.rect(0, 18, d, 19, -1, M.STONE); fr.rect(0, zt - 1, d, zt, -1, M.STONE); }
  if (o.chaine) for (let z = G + 2; z < zt - 1; z++) { const lg = Math.floor((z - G) / 3) % 2 === 0; fl.set(w - 1, z, 0, M.STONE); if (lg) fl.set(w - 2, z, 0, M.STONE); if (o.droite) { fr.set(0, z, 0, M.STONE); if (!lg) fr.set(1, z, 0, M.STONE); } }
  const fw = o.fw || 6;
  for (let e = 1; e <= et; e++) {
    const z0 = 22 + fh * (e - 1);
    for (const s of o.baies) {
      if (o.saute && o.saute(e, s)) continue;
      const st = etat(k, x0 + s, y1, z0, o.volet);
      const balcony = o.balcon ? o.balcon(e, s) : null;
      fl.window(s, z0, fw, 9, { state: st.state, shutter: o.volet, closed: st.closed, curtain: st.curtain, balcony, spill: z0 <= 37, spillR: 20, spillI: 0.45 });
      if (balcony === 'plants') { fl.set(s + 1, z0, -1, M.RES_FLEURS); fl.set(s + 2, z0, -1, M.RES_FLEURS); }
      else if (!balcony && k.rh(x0 + s, y1, z0 + 3) < (o.fleurs || 0.15)) for (let i = 0; i < fw; i++) fl.set(s + i, z0, -1, M.RES_FLEURS);
    }
    if (o.droite && o.baiesD) for (const s of o.baiesD) {
      const st = etat(k, x1, y1 - s, z0 + 3, o.volet);
      fr.window(s, z0, fw, 9, { state: st.state, shutter: o.volet, closed: st.closed, curtain: st.curtain, spill: false });
    }
  }
  let top = zt;
  if (o.toit === 'mansarde') {
    top = B.mansard(W, x0, y0, w, d, zt, zt > 70 ? 10 : 12);
    for (const s of (o.lucarnes || o.baies)) { const v = k.rh(x0 + s, y0, 911); B.dormer(W, LEFT, x0, y0, w, d, x0 + s + Math.floor((fw - 5) / 2), zt + 1, { state: k.night && v < (k.bad ? 0.25 : 0.45) ? 'lit' : 'dark', spill: false, curtain: RIDEAUX[Math.floor(v * 5) % 5] }); }
    if (o.droite) for (const s of (o.lucarnesD || [])) B.dormer(W, RIGHT, x0, y0, w, d, y1 - s - 5, zt + 1, { state: 'dark', spill: false });
    const hc = Math.min(18, ZMAX - 2 - (zt + 1)); B.chimney(W, x0 + 1, y0 + 8, zt + 1, hc); B.chimney(W, x1 - 3, y0 + 8, zt + 1, hc); B.chimney(W, x1 - 3, y0 + 12, zt + 1, hc);
    for (let i = 0; i < 2; i++) { const vx = x0 + 6 + Math.floor(k.rh(x0, i, 913) * (w - 16)), vy = y0 + 8 + i * 10; W.box(vx, vy, top, vx + 5, vy + 4, top + 1, M.METAL); W.box(vx + 1, vy + 1, top + 1, vx + 4, vy + 3, top + 2, k.night && k.rh(vx, vy, 914) < 0.5 ? M.SKYLIGHT : M.GLASS); }
  } else if (o.toit === 'tuiles' || o.toit === 'ardoise') {
    B.gableRoof(W, x0, y0, w, d, zt, o.toit === 'tuiles' ? M.TERRACOTTA : M.SLATE, { axis: 'x', oh: 1, slope: 2, gable: mur });
    const n = Math.ceil((d + 2) / 4); top = zt + n;
    const hc = Math.min(n + 4, ZMAX - 2 - zt); B.chimney(W, x0 + 2, y0 + (d >> 1) - 2, zt, hc - 1); B.chimney(W, x1 - 4, y0 + (d >> 1) - 2, zt, hc);
    if (o.lucarnes) for (const s of o.lucarnes) { const ly = y1 - 6; W.box(x0 + s, ly - 2, zt, x0 + s + 5, ly + 1, zt + 7, mur); const lf = new Facade(W, LEFT, x0 + s, ly - 2, 5, 3); lf.window(1, zt + 1, 3, 5, { state: k.night && k.rh(x0 + s, 0, 915) < 0.4 ? 'lit' : 'dark', sill: false, spill: false }); B.gableRoof(W, x0 + s, ly - 2, 5, 3, zt + 7, o.toit === 'tuiles' ? M.TERRACOTTA : M.SLATE, { axis: 'y', oh: 1 }); }
  } else {
    B.flatRoof(W, x0, y0, w, d, zt, mur, { parapet: 2 });
    top = zt + 1;
    toitTerrasse(k, x0, y0, x1, y1, top);
  }
  if (o.antenne) { const az = top + (o.toit === 'mansarde' ? 0 : 3); if (ZMAX - az >= 5) B.antenna(W, x0 + Math.floor(w * 0.6), y0 + Math.floor(d * 0.4), az, Math.min(11, ZMAX + 1 - az)); }
  return { fl, fr, zt, top, w, d, x0, x1, y0, y1 };
}
// ---------------------------------------------------------------- l'immeuble du boulevard, vu de dos
function arriere(k, o) {
  const W = k.W, { x0, x1, y0, y1, et } = o;
  const fh = et >= 5 ? 14 : 15, w = x1 - x0, d = y1 - y0, zt = 19 + fh * et;
  W.box(x0, y0, G, x1, y1, zt, o.mur);
  const fl = new Facade(W, LEFT, x0, y0, w, d), fr = new Facade(W, RIGHT, x0, y0, w, d);
  fl.rect(0, zt - 1, w, zt, -1, M.STONE);
  for (let e = 0; e <= et; e++) {
    const z0 = e === 0 ? 6 : 22 + fh * (e - 1);
    for (let s = 4; s < w - 7; s += (o.pas || 10)) {
      const v = k.rh(x0 + s, y1, z0 + 333);
      if (v < 0.1) continue;
      const petit = v > 0.78;
      const st = etat(k, x0 + s, y1 + 1, z0, o.volet);
      fl.window(s, z0 + (petit ? 3 : 0), petit ? 3 : 4, petit ? 4 : 7, { state: st.state, shutter: petit ? null : o.volet, closed: st.closed && !petit, curtain: st.curtain, spill: false, sill: !petit });
      if (o.soigne && !petit && e >= 1 && v > 0.5 && v < 0.62) {
        fl.rect(s - 1, z0 - 1, s + 5, z0, -1, M.CONCRETE); fl.rect(s - 1, z0 - 1, s + 5, z0, -2, M.CONCRETE);
        for (let i = -1; i < 5; i++) fl.set(s + i, z0 + 3, -2, M.METAL_DARK); fl.set(s - 1, z0, -2, M.METAL_DARK); fl.set(s + 4, z0, -2, M.METAL_DARK);
        for (let i = 0; i < 4; i++) { fl.set(s + i, z0 + 2, -2, M.RES_LINGE); if (i % 2 === 0) fl.set(s + i, z0 + 1, -2, M.RES_LINGE); }
      } else if (o.soigne && !petit && v > 0.85) for (let i = 0; i < 4; i++) fl.set(s + i, z0, -1, M.RES_FLEURS);
    }
  }
  for (let s = 9; s < w; s += 23) fl.pipe(s, G, zt, M.METAL);
  if (o.droite) {
    fr.rect(0, zt - 1, d, zt, -1, M.STONE);
    for (let e = 1; e <= et; e++) for (let s = 4; s < d - 7; s += 11) { const st = etat(k, x1, y1 - s, 22 + fh * (e - 1)); fr.window(s, 22 + fh * (e - 1), 5, 8, { state: st.state, shutter: o.volet, closed: st.closed, curtain: st.curtain, spill: false }); }
  }
  let top;
  if (o.toit === 'mansarde') { top = B.mansard(W, x0, y0, w, d, zt, zt > 70 ? 10 : 12); for (let s = 5; s < w - 6; s += 14) B.dormer(W, LEFT, x0, y0, w, d, x0 + s, zt + 1, { state: k.night && k.rh(x0 + s, y1, 919) < 0.35 ? 'lit' : 'dark', spill: false }); }
  else { B.flatRoof(W, x0, y0, w, d, zt, o.mur, { parapet: 2 }); top = zt + 1; toitTerrasse(k, x0, y0, x1, y1, top); }
  for (let x = x0 + 5; x < x1 - 6; x += 17) B.chimney(W, x, y0 + 5, top, Math.min(5, ZMAX - 2 - top));
  { const az = top + (o.toit === 'mansarde' ? 0 : 2); if (k.rh(x0, y0, 917) < 0.7 && ZMAX - az >= 5) B.antenna(W, x0 + (w >> 1), y0 + (d >> 1), az, Math.min(10, ZMAX + 1 - az)); }
  return { fl, fr, zt, top };
}
// ---------------------------------------------------------------- le toit-terrasse : souches, édicule, verrières, antennes, étendoir
function toitTerrasse(k, x0, y0, x1, y1, top) {
  const W = k.W, w = x1 - x0, d = y1 - y0;
  const hs = Math.min(5, ZMAX - 1 - top);
  for (let x = x0 + 2; x < x1 - 4; x += 13) { W.box(x, y0 + 2, top, x + 4, y0 + 4, top + hs - 1, M.BRICK); W.box(x, y0 + 2, top + hs - 1, x + 4, y0 + 4, top + hs, M.STONE); for (let i = 0; i < 4; i += 2) W.set(x + i, y0 + 3, top + hs, M.TERRACOTTA); }
  const ex = x0 + 4 + Math.floor(k.rh(x0, y0, 931) * (w - 16)), ey = y0 + 8, he = Math.min(7, ZMAX - top);
  W.box(ex, ey, top, ex + 8, ey + 7, top + he - 1, M.CONCRETE); W.box(ex - 1, ey - 1, top + he - 1, ex + 9, ey + 8, top + he, M.ROOF_FLAT);
  const fe = new Facade(W, LEFT, ex, ey, 8, 7); fe.door(2, top, 3, Math.min(6, he - 2), { mat: M.METAL_DARK, frame: false });
  for (let i = 0; i < 2; i++) { const vx = x0 + 6 + Math.floor(k.rh(x0, i, 932) * (w - 14)), vy = y0 + Math.floor(d * 0.55) + i * 3; if (vx + 6 < x1 - 1 && vy + 4 < y1 - 1) { W.box(vx, vy, top, vx + 6, vy + 4, top + 1, M.METAL); W.box(vx + 1, vy + 1, top + 1, vx + 5, vy + 3, top + 2, k.night && k.rh(vx, vy, 933) < 0.5 ? M.SKYLIGHT : M.GLASS); } }
  for (let i = 0; i < 2; i++) if (k.rh(x0, i, 934) < 0.7 && ZMAX - top >= 5) B.antenna(W, x0 + 8 + Math.floor(k.rh(x0, i, 935) * (w - 16)), y0 + 5 + i * 9, top, Math.min(9 + i * 2, ZMAX + 1 - top));
  if (k.rh(x0, y0, 936) < 0.5 && d > 24 && top + 10 <= ZMAX) { const lx = x0 + 5 + Math.floor(k.rh(x0, 3, 937) * (w - 25)); linge(W, lx, lx + 16, y1 - 6, top); }
}
// ---------------------------------------------------------------- les cours intérieures (on ne les voit que par les trouées)
function cour(k, x0, y0, x1, y1) {
  const W = k.W;
  W.box(x0, y0, 1, x1, y1, 2, M.COBBLE);
  for (let x = x0 + 4; x < x1 - 20; x += 46) {
    const v = k.rh(x, y0, 921);
    const sx = x + Math.floor(v * 10), sy = y0 + 3;
    W.box(sx, sy, G, sx + 16, sy + 12, G + 12, v < 0.5 ? M.BRICK_OLD : M.PLASTER_GREY);
    W.box(sx - 1, sy - 1, G + 12, sx + 17, sy + 13, G + 13, M.RES_TOLE);
    const f = new Facade(W, LEFT, sx, sy, 16, 12); f.door(3, G, 8, 9, { mat: v < 0.3 ? M.SHUTTER_GREEN : M.WOOD, frame: false });
    if (v > 0.6) B.planeTree(W, sx + 24, y0 + 20, G, { seed: sx, trunk: 12, r: 6.5, branches: 3, leafR: 8, leafAmt: 0.5 });
    B.bin(W, sx + 18, sy + 2, G);
  }
}

// ================================================================ le sol : chaussées, bordures, caniveaux, marquages
const NS = [[300, 322], [496, 524], [678, 700]];
function sol(k) {
  const W = k.W;
  const inNS = x => NS.some(([a, b]) => x >= a && x < b);
  W.box(0, 128, 0, 1000, 152, 2, 0); W.box(0, 128, 0, 1000, 152, 1, M.ASPHALT);
  for (const [a, b] of NS) { W.box(a, 0, 0, b, 188, 2, 0); W.box(a, 0, 0, b, 188, 1, M.ASPHALT); }
  for (let x = 0; x < 1000; x++) {
    if (inNS(x)) continue;
    W.box(x, 127, 0, x + 1, 128, 2, M.CURB); W.box(x, 152, 0, x + 1, 153, 2, M.CURB);
    W.box(x, 128, 0, x + 1, 129, 1, M.GUTTER); W.box(x, 151, 0, x + 1, 152, 1, M.GUTTER);
  }
  for (const [a, b] of NS) for (let y = 0; y < 188; y++) {
    if (y >= 128 && y < 152) continue;
    W.box(a - 1, y, 0, a, y + 1, 2, M.CURB); W.box(b, y, 0, b + 1, y + 1, 2, M.CURB);
    W.box(a, y, 0, a + 1, y + 1, 1, M.GUTTER); W.box(b - 1, y, 0, b, y + 1, 1, M.GUTTER);
  }
  // l'axe en tirets des rues nord-sud (en phase avec celles du maître), hors carrefour
  for (const [a, b] of NS) { const mid = Math.floor((a + b) / 2); for (let t = 0; t < 188; t += 16) for (let y = t; y < t + 10 && y < 188; y++) { if (y >= 112 && y < 168) continue; W.set(mid - 1, y, 0, M.ROADLINE); W.set(mid, y, 0, M.ROADLINE); } }
  // passages piétons : en travers de la rue des Lilas, de part et d'autre des carrefours, et devant l'école
  const zebraX = x0 => { for (let y = 130; y < 150; y += 4) W.box(x0, y, 0, x0 + 10, y + 2, 1, M.ROADLINE); };
  const zebraY = (a, b, y0) => { for (let x = a + 1; x < b - 1; x += 4) W.box(x, y0, 0, x + 2, y0 + 9, 1, M.ROADLINE); };
  for (const [a, b] of NS) { zebraX(a - 14); zebraX(b + 4); zebraY(a, b, 117); zebraY(a, b, 162); W.box(a, 112, 0, Math.floor((a + b) / 2) - 1, 114, 1, M.ROADLINE); W.box(Math.floor((a + b) / 2) + 1, 172, 0, b, 174, 1, M.ROADLINE); }
  zebraX(626);
  // l'inscription ÉCOLE sur la chaussée, le numéro des quais
  const solTxt = (x0, y0, x1, y1, z, text, o = {}) => { const id = W.obj(Object.assign({ type: 'res_sol', kind: 'texte', text, x0, y0 }, o)); for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) if (W.get(x, y, z)) W.tag[W.idx(x, y, z)] = id; };
  solTxt(600, 140, 622, 148, 0, 'ÉCOLE', { scale: 2 });
  k.solTxt = solTxt;
  // regards d'égout et bouches
  for (const [x, y] of [[120, 140], [380, 138], [588, 144], [770, 139], [940, 141], [306, 60], [510, 30], [690, 96], [512, 176]]) W.box(x, y, 0, x + 3, y + 3, 1, M.METAL_DARK);
}

// ================================================================ les voitures
// voiture le long de axis, l'avant vers dir (-1 : vers les petits x/y) ; 21 voxels de long, 8 de large.
function voiture(W, x, y, zg, axis, dir, paint, o = {}) {
  const md = o.modele || 'berline', L = o.long || (md === 'citadine' ? 16 : md === 'fourgon' ? 20 : 21);
  const put = (a, b, z, m) => { const aa = dir < 0 ? a : L - 1 - a; if (axis === 'x') W.set(x + aa, y + b, zg + z, m); else W.set(x + b, y + aa, zg + z, m); };
  const bx = (a0, b0, z0, a1, b1, z1, m) => { for (let a = a0; a < a1; a++) for (let b = b0; b < b1; b++) for (let z = z0; z < z1; z++) put(a, b, z, m); };
  // sur cales : plus de roues, la caisse sur des piles de parpaings, les moyeux à nu
  const zb = o.cales ? 4 : 1;
  for (const a0 of [3, L - 6]) {
    if (o.cales) { bx(a0, 1, 0, a0 + 3, 3, zb, M.CONCRETE); bx(a0, 5, 0, a0 + 3, 7, zb, M.CONCRETE); for (let z = 1; z < zb; z += 2) { put(a0 + 1, 2, z, M.CURB); put(a0 + 1, 5, z, M.CURB); } }
    else for (const b of [0, 7]) bx(a0, b, 0, a0 + 3, b + 1, 3, M.TIRE);
  }
  bx(0, 1, zb, L, 7, zb + 3, paint);
  bx(0, 1, zb, 1, 7, zb + 1, M.CHROME); bx(L - 1, 1, zb, L, 7, zb + 1, M.CHROME);
  const z4 = zb + 3;
  if (o.cales) for (const a0 of [3, L - 6]) for (const b of [1, 6]) { for (let a = a0; a < a0 + 3; a++) put(a, b, zb, 0); put(a0 + 1, b, zb, M.METAL_DARK); }
  if (md === 'fourgon') {
    bx(1, 1, z4, 5, 7, z4 + 3, M.CAR_GLASS); bx(1, 1, z4 + 3, 5, 7, z4 + 4, paint);
    bx(5, 1, z4, L, 7, z4 + 5, paint);
    for (let a = 6; a < L - 1; a += 5) put(a, 7 - 1, z4 + 2, paint);
  } else {
    const c0 = md === 'citadine' ? 4 : 6, c1 = md === 'citadine' ? 14 : md === 'break' ? L - 1 : 15;
    bx(c0, 1, z4, c1, 7, z4 + 2, M.CAR_GLASS);
    bx(c0, 1, z4, c0 + 1, 7, z4 + 2, paint); bx(Math.floor((c0 + c1) / 2), 1, z4, Math.floor((c0 + c1) / 2) + 1, 7, z4 + 2, paint); bx(c1 - 1, 1, z4, c1, 7, z4 + 2, paint);
    bx(c0 + 1, 1, z4 + 2, c1 - (md === 'break' ? 0 : 1), 7, z4 + 3, paint);
    if (md === 'berline') bx(c1, 1, z4, L - 1, 7, z4 + 1, paint);
    if (md === 'citadine') bx(c1, 1, z4, L - 1, 7, z4 + 1, paint);
  }
  const lit = o.phares;
  put(0, 1, zb + 1, lit ? M.HEADLIGHT : M.WHITE); put(0, 6, zb + 1, lit ? M.HEADLIGHT : M.WHITE);
  put(L - 1, 1, zb + 1, lit ? M.TAILLIGHT : M.PLASTIC_RED); put(L - 1, 6, zb + 1, lit ? M.TAILLIGHT : M.PLASTIC_RED);
  if (o.rouille) { put(L - 6, 7 - 1, zb, M.METAL); put(L - 5, 7 - 1, zb, M.METAL); put(2, 6, zb + 1, M.METAL); }
  if (o.antenne) { put(L - 3, 6, z4 + 1, M.METAL_DARK); put(L - 3, 6, z4 + 2, M.METAL_DARK); put(L - 3, 6, z4 + 3, M.METAL_DARK); }
  if (o.echarpe) { put(L - 4, 2, z4, M.METAL_BORD); put(L - 4, 3, z4, M.SEAT_GREY); put(L - 4, 4, z4, M.METAL_BORD); put(L - 4, 5, z4, M.SEAT_GREY); }
}
// l'autocar, le long de x ; dir = 1 : l'avant vers +x (la porte du côté visible), dir = -1 : l'avant vers -x
// (on voit alors son flanc gauche et l'arrière). 60 × 12 × 18 voxels : jupe, flanc bas, vitres, bandeau haut, toit.
function autocar(k, x, y, lv) {
  const W = k.W, L = 60, D = 12, zg = 1, dir = lv.dir || 1, bv = D - 1;
  const ax = d => dir > 0 ? L - 1 - d : d;
  const Bx = (a0, b0, z0, a1, b1, z1, m) => W.box(x + a0, y + b0, zg + z0, x + a1, y + b1, zg + z1, m);
  const Bd = (d0, b0, z0, d1, b1, z1, m) => { const p = ax(d0), q = ax(d1 - 1); Bx(Math.min(p, q), b0, z0, Math.max(p, q) + 1, b1, z1, m); };
  const Sd = (d, b, z, m) => W.set(x + ax(d), y + b, zg + z, m);
  Bx(0, 0, 2, L, D, 17, lv.caisse);
  Bx(0, 0, 2, L, D, 3, M.METAL_DARK);
  Bx(1, 0, 17, L - 1, D, 18, lv.toit || lv.caisse);
  Bx(0, 0, 7, L, D, 8, lv.bande);
  if (lv.bande2) Bx(0, 0, 3, L, D, 4, lv.bande2);
  // les roues et leurs passages
  for (const d0 of [9, 46]) for (const b of [0, bv]) { Bd(d0 - 1, b, 2, d0 + 6, b + 1, 6, M.METAL_DARK); Bd(d0, b, 0, d0 + 5, b + 1, 5, M.TIRE); Sd(d0 + 2, b, 2, M.CHROME); }
  // les vitres : poste de conduite, puis les voyageurs (calque : montants, têtières, intérieur)
  for (const b of [0, bv]) Bd(1, b, 8, 57, b + 1, 13, M.CAR_GLASS);
  const p0 = ax(8), p1 = ax(56), a0 = Math.min(p0, p1), a1 = Math.max(p0, p1);
  const vid = W.obj({ type: 'res_carvitre', face: LEFT, a0: x + a0, z0: zg + 8, w: a1 - a0, h: 5, lit: lv.allume, rideau: lv.rideau, pax: lv.pax || 0, seed: x });
  for (let a = a0; a < a1; a++) for (let z = 8; z < 13; z++) if (W.inb(x + a, y + bv, zg + z)) W.tag[W.idx(x + a, y + bv, zg + z)] = vid;
  Bd(7, bv, 8, 8, bv + 1, 13, lv.caisse); Bd(7, 0, 8, 8, 1, 13, lv.caisse);
  // la porte des voyageurs, côté droit
  const bp = dir > 0 ? bv : 0;
  Bd(2, bp, 3, 6, bp + 1, 13, M.CAR_GLASS);
  // les soutes à bagages, et la soute ouverte côté visible avec ses sacs
  for (let d = 16; d <= 44; d += 7) Bd(d, bv, 3, d + 1, bv + 1, 7, M.METAL_DARK);
  if (lv.soute) {
    Bd(24, bv, 3, 37, bv + 1, 7, 0); Bd(24, bv - 1, 3, 37, bv, 4, M.METAL_DARK);
    for (let d = 25; d < 36; d += 2) { Sd(d, bv - 1, 4, d % 4 === 1 ? M.CANVAS : M.METAL_BORD); Sd(d + 1, bv - 1, 4, M.SEAT_GREY); if (d % 6 === 1) Sd(d, bv - 1, 5, M.METAL_BORD); }
    Bd(24, bv + 1, 6, 37, bv + 3, 7, lv.caisse);
  }
  // l'avant : pare-brise, girouette, phares ; l'arrière : lunette, feux, grille du moteur
  const af = ax(0), ar = ax(L - 1);
  Bx(af, 1, 6, af + 1, bv, 13, M.CAR_GLASS); Bx(af, 1, 13, af + 1, bv, 16, M.METAL_DARK);
  Bx(af, 3, 3, af + 1, D - 3, 5, M.METAL_DARK); Bx(af, 0, 2, af + 1, D, 3, M.CHROME);
  for (const b of [1, D - 2]) { W.set(x + af, y + b, zg + 4, lv.phares ? M.HEADLIGHT : M.WHITE); W.set(x + af, y + b, zg + 3, M.PLASTIC_WHITE); }
  Bx(ar, 1, 8, ar + 1, bv, 13, M.CAR_GLASS);
  for (let z = 3; z < 7; z += 2) Bx(ar, 2, z, ar + 1, D - 2, z + 1, M.METAL_DARK);
  for (const b of [1, D - 2]) for (const z of [6, 7]) W.set(x + ar, y + b, zg + z, lv.allume ? M.TAILLIGHT : M.PLASTIC_RED);
  Bx(ar, 4, 2, ar + 1, D - 4, 3, M.WHITE);
  const fr = new Facade(W, RIGHT, x, y, L, D), fl = new Facade(W, LEFT, x, y, L, D);
  if (dir > 0) fr.sign(1, zg + 16, lv.girouette, { fg: [1.0, 0.72, 0.25], emit: lv.allume ? [1.1, 0.70, 0.20] : null, depth: 0, padX: 0, padY: 0 });
  else if (lv.arriere) { const nw = Math.ceil(textBitmap(lv.arriere).w / 2); fr.sign(Math.max(0, Math.floor((D - nw) / 2)), zg + 16, lv.arriere, { fg: lv.flancFg || [0.86, 0.80, 0.62], depth: 0, padX: 0, padY: 0 }); }
  // le bandeau haut : le nom ; la plaque de destination derrière les premières vitres ; l'écusson
  if (lv.flanc) { const nw = Math.ceil(textBitmap(lv.flanc).w / 2); fl.sign(Math.round((L - nw) / 2), zg + 17, lv.flanc, { fg: lv.flancFg || [0.86, 0.80, 0.62], depth: 0 }); }
  if (lv.dest) { const nw = Math.ceil((textBitmap(lv.dest).w + 2) / 2); fl.sign(dir > 0 ? L - 9 - nw : 9, zg + 13, lv.dest, { plate: [0.06, 0.06, 0.06], plateMat: M.METAL_DARK, fg: [1.0, 0.72, 0.25], emit: lv.allume ? [1.0, 0.62, 0.18] : null, depth: 0, padX: 1, padY: 0 }); }
  if (lv.ecusson) { const s = dir > 0 ? L - 21 : 17; fl.crest(s, zg + 3, 3, 4); }
  // le toit : trappes, climatisation
  Bx(14, 3, 18, 20, 9, 19, M.PLASTIC_WHITE); Bx(36, 4, 18, 40, 8, 19, M.METAL);
  if (lv.allume) W.light({ x: x + 30, y: y + D + 1.5, z: zg + 10, r: 26, cr: 0.55, cg: 0.40, cb: 0.22, shadow: false });
}

// ================================================================ les arbres et les petites choses
function arbuste(W, x, y, zg, o = {}) {
  const th = o.tronc || 6, r = o.r || 4, mat = o.mat || M.FOLIAGE, seed = o.seed || 1;
  W.box(x, y, zg, x + 1, y + 1, zg + th, M.BARK);
  const cz = zg + th + r * 0.55;
  for (let z = Math.floor(cz - r); z <= cz + r; z++) for (let yy = y - r - 1; yy <= y + r + 1; yy++) for (let xx = x - r - 1; xx <= x + r + 1; xx++) {
    const dd = Math.hypot(xx - x, yy - y, (z - cz) * 1.2) / r;
    if (dd < 1 - 0.32 * hash(xx, yy, z, seed) && W.get(xx, yy, z) === 0) W.set(xx, yy, z, mat);
  }
}
function lilas(W, x, y, zg, seed) { W.box(x, y, zg, x + 1, y + 1, zg + 3, M.BARK); arbuste(W, x, y, zg, { tronc: 3, r: 3.6, mat: M.RES_LILAS, seed }); }
function chaise(W, x, y, zg, m = M.PLASTIC_WHITE) { W.box(x, y, zg, x + 2, y + 2, zg + 2, m); W.box(x, y, zg + 2, x + 2, y + 1, zg + 5, m); }
function banc(W, x, y, zg, axis) { B.bench(W, x, y, zg, axis); }
function linge(W, x0, x1, y, zg) {
  W.box(x0, y, zg, x0 + 1, y + 1, zg + 10, M.METAL); W.box(x1, y, zg, x1 + 1, y + 1, zg + 10, M.METAL);
  for (let x = x0 + 1; x < x1; x++) W.set(x, y, zg + 9, M.METAL_DARK);
  for (let x = x0 + 2; x < x1 - 1; x += 4) { const len = 3 + (hash(x, y, 931, 0) * 3 | 0); for (let i = 0; i < 3 && x + i < x1; i++) for (let z = zg + 9 - len; z < zg + 9; z++) W.set(x + i, y, z, M.RES_LINGE); }
}
function balancoire(W, x, y, zg) {
  for (const xx of [x, x + 9]) { W.set(xx, y, zg, M.METAL_DARK); W.set(xx, y + 3, zg, M.METAL_DARK); for (let z = zg; z < zg + 11; z++) { W.set(xx, y + (z - zg < 6 ? 0 : 1), z, M.METAL_DARK); W.set(xx, y + (z - zg < 6 ? 3 : 2), z, M.METAL_DARK); } }
  for (let xx = x; xx <= x + 9; xx++) W.set(xx, y + 1, zg + 11, M.METAL_DARK);
  for (const xx of [x + 3, x + 6]) for (let z = zg + 4; z < zg + 11; z++) W.set(xx, y + 1, z, M.METAL);
  W.box(x + 3, y + 1, zg + 3, x + 7, y + 3, zg + 4, M.WOOD);
}
function cabane(W, x, y, zg, porte) {
  W.box(x, y, zg, x + 9, y + 7, zg + 9, M.WOOD);
  W.box(x - 1, y - 1, zg + 9, x + 10, y + 8, zg + 10, M.RES_TOLE);
  const f = new Facade(W, LEFT, x, y, 9, 7); f.door(2, zg, 4, 7, { mat: porte || M.SHUTTER_GREEN, frame: false });
  const fr = new Facade(W, RIGHT, x, y, 9, 7); fr.window(2, zg + 4, 3, 3, { sill: false, lintel: false, spill: false });
}
function potager(W, x0, y0, x1, y1, seed) {
  W.box(x0, y0, 1, x1, y1, 2, M.RES_POTAGER);
  for (let x = x0 + 1; x < x1; x += 4) if (hash(x, y0, seed, 941) < 0.5) for (let y = y0 + 1; y < y1 - 1; y += 3) { W.set(x, y, 2, M.WOOD); W.set(x, y, 3, M.WOOD); W.set(x, y, 4, M.HEDGE); }
}
function niche(W, x, y, zg) { W.box(x, y, zg, x + 4, y + 4, zg + 4, M.WOOD); W.box(x - 1, y, zg + 4, x + 5, y + 4, zg + 5, M.TERRACOTTA); const f = new Facade(W, LEFT, x, y, 4, 4); f.door(1, zg, 2, 3, { mat: M.METAL_DARK, frame: false }); }
function clapier(W, x, y, zg) { W.box(x, y, zg, x + 6, y + 3, zg + 2, M.WOOD); W.box(x, y, zg + 2, x + 6, y + 3, zg + 5, M.WOOD); W.box(x, y + 3, zg + 2, x + 6, y + 4, zg + 5, M.METAL_DARK); W.box(x - 1, y, zg + 5, x + 7, y + 4, zg + 6, M.RES_TOLE); }
function barbecue(W, x, y, zg) { W.box(x, y, zg, x + 3, y + 2, zg + 4, M.BRICK); W.box(x, y, zg + 4, x + 3, y + 2, zg + 5, M.METAL_DARK); }
function tonneau(W, x, y, zg) { W.box(x, y, zg, x + 2, y + 2, zg + 4, M.BIN); }
function bois(W, x, y, zg, len) { W.box(x, y, zg, x + len, y + 2, zg + 4, M.WOOD); for (let i = 0; i < len; i += 2) W.set(x + i, y + 1, zg + 1, M.WOOD_DARK); }
function brouette(W, x, y, zg) { W.box(x, y, zg + 1, x + 4, y + 3, zg + 3, M.METAL_GREEN); W.set(x + 4, y + 1, zg, M.TIRE); W.set(x - 1, y, zg + 2, M.WOOD); W.set(x - 1, y + 2, zg + 2, M.WOOD); }

// ================================================================ les îlots du nord
function nordOuest(k, P) {
  const W = k.W;
  arriere(k, { x0: 0, x1: 72, y0: 0, y1: 34, et: 5, mur: M.PLASTER_GREY, volet: M.SHUTTER_GREY, toit: 'terrasse', soigne: true });
  arriere(k, { x0: 72, x1: 150, y0: 0, y1: 36, et: 4, mur: M.PLASTER_CREAM, volet: M.SHUTTER_GREEN, toit: 'mansarde', soigne: true });
  arriere(k, { x0: 150, x1: 232, y0: 0, y1: 34, et: 5, mur: M.BRICK, volet: null, toit: 'terrasse', soigne: true });
  arriere(k, { x0: 232, x1: 292, y0: 0, y1: 38, et: 4, mur: M.PLASTER_OCHRE, volet: M.SHUTTER_BLUE, toit: 'mansarde', droite: true, soigne: true, pas: 9 });
  cour(k, 0, 36, 230, 72);
  // B1 : enduit rose, mansarde, porte cochère
  const b1 = immeuble(k, { x0: 0, x1: 46, y0: 72, y1: 120, et: 4, mur: M.PLASTER_ROSE, volet: M.SHUTTER_GREEN, toit: 'mansarde', baies: [4, 15, 26, 37], fw: 5, antenne: true });
  porteImmeuble(k, b1.fl, 4); fenetreRdc(k, b1.fl, 16, 16, 120, { volet: M.SHUTTER_GREEN }); fenetreRdc(k, b1.fl, 24, 24, 120, { volet: M.SHUTTER_GREEN }); porteCochere(k, b1.fl, 33, 10);
  lanterne(k, b1.fl, 22, 34, k.night && !(k.bad && k.rh(1, 1, 1) < 0.5));
  // B2 : brique, toit de tuiles, le salon de coiffure
  const b2 = immeuble(k, { x0: 46, x1: 98, y0: 74, y1: 120, et: 3, mur: M.BRICK, volet: null, toit: 'tuiles', baies: [4, 14, 24, 34, 44], fw: 5, lucarnes: [9, 29] });
  devanture(b2.fl, 5, 26, M.SHUTTER_BLUE);
  if (k.night || k.bad) b2.fl.shop(6, 3, 24, 11, 'rideau'); else vitrine(k, b2.fl, 6, 3, 24, 11, 'coiffure', { light: { r: 30, c: [0.6, 0.5, 0.48] } });
  b2.fl.door(32, G, 5, 12, { kind: k.night || k.bad ? 'rideau' : 'door', frame: false });
  b2.fl.sign(7, 17, 'COIFFURE', { plate: [0.16, 0.22, 0.36], plateMat: M.SHUTTER_BLUE, fg: [0.90, 0.82, 0.86], depth: -1, padX: 2, padY: 1 });
  porteImmeuble(k, b2.fl, 41, { mat: M.WOOD }); lanterne(k, b2.fl, 40, 34, k.night && !(k.bad && k.rh(3, 1, 1) < 0.5));
  // B3 : enduit crème, mansarde
  const b3 = immeuble(k, { x0: 98, x1: 148, y0: 72, y1: 120, et: 4, mur: M.PLASTER_CREAM, volet: M.SHUTTER_BLUE, toit: 'mansarde', baies: [4, 16, 28, 40], antenne: true, balcon: (e, s) => e === 2 && s === 16 ? 'plants' : null });
  fenetreRdc(k, b3.fl, 5, 103, 120, { barreaux: true }); porteImmeuble(k, b3.fl, 16); fenetreRdc(k, b3.fl, 29, 127, 120, { barreaux: true }); fenetreRdc(k, b3.fl, 40, 138, 120, { volet: M.SHUTTER_BLUE }); lanterne(k, b3.fl, 26, 34, k.night);
  // B4 : pierre de taille, cinq étages, balcons filants, toit-terrasse
  const b4 = immeuble(k, { x0: 148, x1: 196, y0: 70, y1: 120, et: 5, mur: M.STONE, volet: null, toit: 'terrasse', baies: [5, 16, 27, 38], antenne: true, fleurs: 0.25 });
  for (const e of [2, 5]) { const z = 22 + 14 * (e - 1) - 1; b4.fl.rect(1, z, 47, z + 1, -1, M.STONE); b4.fl.rect(1, z, 47, z + 1, -2, M.STONE); for (let s = 1; s < 47; s++) { b4.fl.set(s, z + 4, -2, M.METAL_DARK); if (s % 2) for (let zz = z + 1; zz < z + 4; zz++) b4.fl.set(s, zz, -2, M.METAL_DARK); } }
  fenetreRdc(k, b4.fl, 5, 153, 120, { barreaux: true }); fenetreRdc(k, b4.fl, 12, 160, 120, { barreaux: true });
  b4.fl.door(20, G, 8, 13, { mat: M.WOOD_DARK, step: true, frameMat: M.STONE });
  b4.fl.window(20, G + 14, 8, 2, { state: k.night ? 'lit' : 'dark', sill: false, lintel: false, spill: false, k: 0.5 });
  fenetreRdc(k, b4.fl, 33, 181, 120, { barreaux: true }); fenetreRdc(k, b4.fl, 40, 188, 120, { barreaux: true });
  lanterne(k, b4.fl, 31, 34, k.night && !(k.bad && k.rh(2, 1, 1) < 0.5));
  // B5 : enduit ocre, le pignon peint sur le square
  const b5 = immeuble(k, { x0: 196, x1: 230, y0: 74, y1: 120, et: 3, mur: M.PLASTER_OCHRE, volet: M.SHUTTER_GREEN, toit: 'tuiles', baies: [4, 14, 24], fw: 5, droite: false });
  porteImmeuble(k, b5.fl, 4); fenetreRdc(k, b5.fl, 15, 211, 120, { volet: M.SHUTTER_GREEN }); fenetreRdc(k, b5.fl, 25, 221, 120, { volet: M.SHUTTER_GREEN });
  b5.fr.sign(5, 58, 'BISCUITS', { scale: 2, fg: [0.84, 0.78, 0.60], plate: [0.40, 0.17, 0.13], plateMat: M.PLASTER_OCHRE, depth: 0, worn: 0.22, padX: 2, padY: 2 });
  b5.fr.sign(7, 48, 'DORNOIS', { scale: 2, fg: [0.82, 0.70, 0.40], plate: [0.40, 0.17, 0.13], plateMat: M.PLASTER_OCHRE, depth: 0, worn: 0.25, padX: 2, padY: 2 });
  b5.fr.sign(13, 39, 'DEPUIS 1921', { fg: [0.80, 0.74, 0.58], depth: 0, worn: 0.3 });
  square(k, P);
}

// ---------------------------------------------------------------- le square des Lilas
function square(k, P) {
  const W = k.W, x0 = 232, x1 = 292, y0 = 38, y1 = 120;
  W.box(x0, y0, 1, x1, y1, 2, M.GRAVEL);
  W.box(x0, y0, G, x0 + 1, 74, G + 11, M.BRICK); W.box(x0, y0, G + 11, x0 + 1, 74, G + 12, M.STONE);
  for (let y = 40; y < 74; y += 1) if (k.rh(x0, y, 951) < 0.6) for (let z = G + 2; z < G + 11 - (k.rh(x0, y, 952) * 6 | 0); z++) W.set(x0 + 1, y, z, M.HEDGE);
  const lawn = (a, b, c, d) => { W.box(a, b, 1, c, d, 2, M.GRASS); B.railing(W, a, d - 1, c - 1, d - 1, G, 1, M.METAL_DARK, 2); B.railing(W, c - 1, b, c - 1, d - 1, G, 1, M.METAL_DARK, 2); };
  // au nord, les pelouses et les grands arbres (le pied caché par l'immeuble d'en face, les couronnes visibles)
  lawn(234, 42, 262, 66); lawn(266, 42, 289, 70); lawn(234, 76, 248, 92);
  W.box(236, 86, G, 246, 88, G + 1, M.RES_FLEURS); W.box(268, 64, G, 287, 66, G + 1, M.RES_FLEURS);
  B.planeTree(W, 246, 52, G, { seed: 71, trunk: 17, r: 9, leafR: 18, leafAmt: 0.8 });
  B.planeTree(W, 278, 54, G, { seed: 74, trunk: 15, r: 8, branches: 3, leafR: 14, leafAmt: 0.7 });
  // au sud-est, la pétanque, bordée de madriers, ses bancs de spectateurs
  W.box(270, 80, 1, 289, 108, 2, M.SOIL);
  B.railing(W, 270, 107, 288, 107, G, 1, M.WOOD, 1); B.railing(W, 270, 80, 270, 107, G, 1, M.WOOD, 1); B.railing(W, 270, 80, 288, 80, G, 1, M.WOOD, 1);
  banc(W, 264, 86, G, 'y'); banc(W, 264, 97, G, 'y');
  // au centre, le bac à sable et le toboggan
  W.box(248, 96, 1, 262, 108, 2, M.RES_SABLE);
  B.railing(W, 248, 107, 261, 107, G, 1, M.WOOD, 1); B.railing(W, 261, 96, 261, 107, G, 1, M.WOOD, 1);
  W.box(252, 100, G, 254, 102, G + 2, M.PLASTIC_RED); W.box(256, 103, G, 257, 104, G + 1, M.CAR_BLUE);
  for (let i = 0; i < 6; i++) { W.set(240 + i, 98, G + 6 - i, M.PLASTIC_RED); W.set(240 + i, 99, G + 6 - i, M.PLASTIC_RED); }
  for (let z = G; z < G + 8; z++) { W.set(238, 97, z, M.METAL_DARK); W.set(238, 100, z, M.METAL_DARK); } for (let z = G; z < G + 7; z += 2) { W.set(238, 98, z, M.METAL); W.set(238, 99, z, M.METAL); }
  W.box(238, 97, G + 6, 240, 101, G + 7, M.METAL_DARK);
  // la fontaine
  W.box(258, 70, G, 260, 72, G + 7, M.METAL_GREEN); W.box(257, 69, G + 7, 261, 73, G + 8, M.METAL_GREEN); W.set(258, 73, G + 5, M.METAL_GREEN);
  // les lilas, le long de la grille et autour de la pétanque
  lilas(W, 238, 112, G, 81); lilas(W, 284, 112, G, 82); lilas(W, 266, 112, G, 83); lilas(W, 236, 80, G, 84);
  // les bancs, les corbeilles
  banc(W, 250, 79, G, 'x'); banc(W, 236, 70, G, 'x'); B.bin(W, 262, 80, G); B.bin(W, 287, 116, G);
  // la grille, ses portillons, l'enseigne
  B.railing(W, x0, 118, 266, 118, G, 4, M.METAL_GREEN, 2); B.railing(W, 276, 118, 290, 118, G, 4, M.METAL_GREEN, 2);
  B.railing(W, 290, 40, 290, 70, G, 4, M.METAL_GREEN, 2); B.railing(W, 290, 78, 290, 118, G, 4, M.METAL_GREEN, 2);
  for (const [px, py] of [[266, 118], [276, 118], [290, 70], [290, 78]]) { W.box(px, py, G, px + 1, py + 1, G + 7, M.METAL_GREEN); W.set(px, py, G + 7, M.STONE); }
  for (const px of [234, 264]) W.box(px, 116, G, px + 1, 117, G + 12, M.METAL_GREEN);
  { const f = new Facade(W, LEFT, 234, 116, 30, 1); f.sign(0, G + 13, 'SQUARE DES LILAS', { plate: [0.14, 0.26, 0.18], plateMat: M.METAL_GREEN, fg: [0.86, 0.82, 0.66], depth: 0, padX: 1, padY: 1 }); }
  // les lampadaires du square
  B.streetLamp(W, 264, 92, G, 1, 0, { on: k.night && !k.bad, h: 16, I: 1.5, r: 46 });
  B.streetLamp(W, 246, 72, G, 0, 1, { on: k.night, h: 16, I: 1.5, r: 46 });
  // la colonne d'affichage et la cabine, sur le trottoir
  W.box(282, 121, G, 287, 126, G + 15, M.METAL_GREEN); W.box(281, 120, G + 15, 288, 127, G + 16, M.METAL_GREEN); W.box(283, 122, G + 16, 286, 125, G + 18, M.METAL_GREEN);
  { const cl = new Facade(W, LEFT, 282, 121, 5, 5), cr = new Facade(W, RIGHT, 282, 121, 5, 5);
    cl.poster(0, G + 2, 5, 11, { title: 'BAL', bg: [0.80, 0.76, 0.62], fg: [0.20, 0.30, 0.55], band: [0.20, 0.30, 0.55], seed: 21, torn: k.bad ? 0.3 : 0.05 });
    cr.poster(0, G + 2, 5, 11, { title: 'AUBES', bg: [0.42, 0.11, 0.16], fg: [0.86, 0.80, 0.62], seed: 22, torn: k.bad ? 0.35 : 0.02 }); }
  B.phoneBooth(W, 238, 121, G);
  P.push({ key: 'square', label: 'Le square des Lilas', x: 271, y: 120, z: G + 10 });
}

function nord1(k, P) {
  const W = k.W;
  arriere(k, { x0: 330, x1: 410, y0: 0, y1: 34, et: 5, mur: M.PLASTER_ROSE, volet: M.SHUTTER_GREY, toit: 'terrasse', soigne: true });
  arriere(k, { x0: 410, x1: 488, y0: 0, y1: 36, et: 4, mur: M.PLASTER_CREAM, volet: M.SHUTTER_GREEN, toit: 'mansarde', droite: true, soigne: true });
  cour(k, 330, 36, 450, 72);
  // l'immeuble de la rue B, au nord de la boulangerie
  const nb = immeuble(k, { x0: 450, x1: 488, y0: 36, y1: 70, et: 3, mur: M.PLASTER_ROSE, volet: M.SHUTTER_GREY, toit: 'tuiles', baies: [], droite: true, baiesD: [4, 15, 25] });
  // N1a : enduit gris, tuiles
  const a = immeuble(k, { x0: 330, x1: 384, y0: 72, y1: 120, et: 4, mur: M.PLASTER_GREY, volet: M.SHUTTER_BLUE, toit: 'tuiles', baies: [4, 14, 24, 34, 44], fw: 5, antenne: true, lucarnes: [13, 33] });
  porteImmeuble(k, a.fl, 4); fenetreRdc(k, a.fl, 15, 345, 120, { volet: M.SHUTTER_BLUE }); fenetreRdc(k, a.fl, 24, 354, 120, { volet: M.SHUTTER_BLUE }); porteCochere(k, a.fl, 36, 10);
  lanterne(k, a.fl, 30, 34, k.night);
  // N1b : brique claire, mansarde, la maison de la presse
  const b = immeuble(k, { x0: 384, x1: 440, y0: 72, y1: 120, et: 3, mur: M.BRICK_PALE, volet: null, toit: 'mansarde', baies: [5, 18, 31, 44] });
  devanture(b.fl, 7, 28, M.SHUTTER_BORD);
  if (k.night) b.fl.shop(8, 3, 26, 11, 'rideau'); else vitrine(k, b.fl, 8, 3, 26, 11, 'presse', { light: { r: 28, c: [0.55, 0.45, 0.30] } });
  b.fl.door(36, G, 5, 12, { kind: k.night ? 'rideau' : 'door', frame: false });
  b.fl.sign(8, 17, 'PRESSE', { plate: [0.36, 0.10, 0.14], plateMat: M.SHUTTER_BORD, fg: [0.90, 0.80, 0.50], depth: -1, padX: 2, padY: 1 });
  b.fl.sign(23, 17, "L'ÉCHO", { plate: [0.86, 0.84, 0.76], plateMat: M.SHUTTER_BORD, fg: [0.10, 0.10, 0.10], depth: -1, padX: 2, padY: 1 });
  porteImmeuble(k, b.fl, 46); lanterne(k, b.fl, 43, 34, k.night && !(k.bad && k.rh(4, 1, 1) < 0.5));
  // le chevalet de la manchette
  W.box(419, 121, G, 420, 122, G + 7, M.METAL_DARK); W.box(428, 121, G, 429, 122, G + 7, M.METAL_DARK);
  { const f = new Facade(W, LEFT, 418, 121, 11, 1); W.box(418, 121, G + 3, 429, 122, G + 10, M.POSTER); f.poster(0, G + 3, 11, 7, { title: k.bad ? 'CRISE' : 'DERBY', bg: [0.86, 0.84, 0.76], fg: [0.10, 0.10, 0.10], band: k.bad ? [0.15, 0.15, 0.15] : [0.42, 0.10, 0.16], seed: 31 }); }
  P.push({ key: 'presse', label: 'La maison de la presse', x: 422, y: 121, z: G + 16 });
  boulangerie(k, P);
}

// ---------------------------------------------------------------- la boulangerie du coin, et ton appartement au-dessus
function boulangerie(k, P) {
  const W = k.W, x0 = 440, x1 = 488, y0 = 70, y1 = 120;
  const v = immeuble(k, { x0, x1, y0, y1, et: 4, mur: M.PLASTER_CREAM, volet: M.SHUTTER_GREY, toit: 'mansarde', baies: [4, 15, 26, 37], droite: true, baiesD: [4, 16, 28, 40], lucarnesD: [10, 34], chaine: true, antenne: true, saute: (e, s) => e === 2 && (s === 26 || s === 37) });
  const { fl, fr } = v;
  // la devanture d'angle, peinte en vert, lettres d'or
  const VERT = M.SHUTTER_GREEN, OR = [0.92, 0.78, 0.40];
  devanture(fl, 13, 34, VERT);
  vitrine(k, fl, 14, 3, 24, 11, 'boulangerie', { k: k.night ? 0.28 : 1, light: k.night ? { r: 22, c: [0.32, 0.22, 0.12] } : { r: 34, c: [0.8, 0.6, 0.35] } });
  fl.door(40, G, 5, 12, { kind: 'door', frame: false, k: k.night ? 0.2 : 0.6 });
  fl.sign(15, 17, 'BOULANGERIE', { plate: [0.13, 0.24, 0.17], plateMat: VERT, fg: OR, depth: -1, padX: 2, padY: 1 });
  fl.awning(14, 25, 12, 5, M.AWNING_GREEN);
  devanture(fr, 2, 24, VERT);
  vitrine(k, fr, 3, 3, 22, 11, 'boulangerie', { k: k.night ? 0.28 : 1, light: k.night ? null : { r: 30, c: [0.7, 0.52, 0.3] } });
  fr.sign(4, 17, 'PAIN CHAUD', { plate: [0.13, 0.24, 0.17], plateMat: VERT, fg: OR, depth: -1, padX: 2, padY: 1 });
  fr.blade(1, 22, 6, 3, VERT); fr.set(1, 24, -3, M.FLAG); fr.set(1, 25, -3, M.FLAG);
  // le soupirail du fournil : la nuit, le boulanger est déjà au pétrin
  for (const [f, s] of [[fr, 30], [fr, 36]]) vitrine(k, f, s, G, 4, 2, 'fournil', { k: k.night ? 1.1 : 0.15, lintel: false, light: k.night ? { r: 18, c: [0.7, 0.32, 0.10] } : null });
  // l'entrée de ton immeuble
  porteImmeuble(k, fl, 4, { mat: M.WOOD });
  // ton appartement : deuxième étage, deux fenêtres sur la rue, le balcon de Camille
  const z0 = 37, sA = 26, sB = 37;
  for (const [s, lit] of [[sA, true], [sB, k.night && !k.bad]]) {
    fl.rect(s, z0, s + 6, z0 + 9, 0, 0);
    const id = W.obj({ type: 'res_fenetre', face: LEFT, a0: fl.a0(s), z0, w: 6, h: 9, state: k.night && lit ? 'lit' : 'dark', curtain: [0.86, 0.50, 0.22], sil: s === sA && k.night, silX: 4 });
    fl.rect(s, z0, s + 6, z0 + 9, 1, M.GLASS, id);
    fl.rect(s, z0 + 9, s + 6, z0 + 10, 0, M.STONE);
    fl.rect(s - 3, z0, s, z0 + 9, -1, M.SHUTTER_GREY); fl.rect(s + 6, z0, s + 9, z0 + 9, -1, M.SHUTTER_GREY);
    if (k.night && lit) { const p = fl.front(s + 3, z0 + 4, 2); W.light({ x: p.x, y: p.y, z: p.z, r: 26, cr: 0.62, cg: 0.40, cb: 0.18, shadow: false }); }
  }
  // le balcon filant devant les deux fenêtres : dalle, garde-corps, jardinières, plantes
  fl.rect(sA - 3, z0 - 1, sB + 9, z0, -1, M.STONE); fl.rect(sA - 3, z0 - 1, sB + 9, z0, -2, M.STONE); fl.rect(sA - 3, z0 - 1, sB + 9, z0, -3, M.STONE);
  for (let s = sA - 3; s < sB + 9; s++) { fl.set(s, z0 + 3, -3, M.METAL_DARK); if ((s - sA) % 2 === 0) for (let z = z0; z < z0 + 3; z++) fl.set(s, z, -3, M.METAL_DARK); }
  for (const s of [sA - 3, sB + 8]) for (let z = z0; z < z0 + 4; z++) { fl.set(s, z, -1, M.METAL_DARK); fl.set(s, z, -2, M.METAL_DARK); }
  for (let s = sA - 2; s < sB + 8; s++) if (s < sA + 1 || s > sB + 5 || (s > sA + 7 && s < sB - 1)) fl.set(s, z0 + 3, -3, M.RES_FLEURS);
  for (const s of [sA - 2, sA + 7, sB + 7]) { fl.set(s, z0, -2, M.HEDGE); fl.set(s, z0 + 1, -2, M.HEDGE); fl.set(s, z0 + 2, -2, M.HEDGE); fl.set(s + 1, z0, -2, M.HEDGE); }
  fl.set(sA + 8, z0, -1, M.RES_FLEURS); fl.set(sA + 9, z0, -1, M.RES_FLEURS); fl.set(sB - 2, z0, -2, M.TERRACOTTA); fl.set(sB - 2, z0 + 1, -2, M.HEDGE);
  // une chaise sur le balcon
  fl.set(sA + 10, z0, -2, M.WOOD); fl.set(sA + 10, z0 + 1, -2, M.WOOD); fl.set(sA + 10, z0 + 1, -1, M.WOOD); fl.set(sA + 10, z0 + 2, -1, M.WOOD);
  lanterne(k, fl, 12, 34, k.night);
  lanterne(k, fr, 12, 34, k.night && !k.bad);
  k.balcon = { x: x0 + sA + 4.5, y: y1 + 1.6, z: z0 };
  P.push({ key: 'appartement', label: 'Ton appartement', x: x0 + 7, y: y1, z: G + 18 });
  P.push({ key: 'boulangerie', label: 'La boulangerie', x: x0 + 42, y: y1, z: G + 18 });
}

function nord2(k, P) {
  const W = k.W;
  arriere(k, { x0: 532, x1: 600, y0: 0, y1: 34, et: 5, mur: M.PLASTER_OCHRE, volet: M.SHUTTER_GREEN, toit: 'terrasse', soigne: true });
  arriere(k, { x0: 600, x1: 670, y0: 0, y1: 22, et: 4, mur: M.BRICK_OLD, volet: null, toit: 'mansarde', droite: true });
  cour(k, 532, 36, 590, 72);
  // l'épicerie : enduit bleuté, toit de tuiles, le pignon peint sur la cour de l'école
  const ep = immeuble(k, { x0: 532, x1: 590, y0: 72, y1: 120, et: 4, mur: M.PLASTER_BLUE, volet: M.SHUTTER_GREEN, toit: 'tuiles', baies: [4, 16, 28, 40, 49], antenne: true, lucarnes: [21, 43] });
  porteImmeuble(k, ep.fl, 4);
  devanture(ep.fl, 13, 34, M.SHUTTER_BLUE);
  const open = !k.night || !k.bad;
  if (open) vitrine(k, ep.fl, 14, 3, 25, 11, 'epicerie', { k: k.night ? 0.9 : 1, light: { r: 34, c: [0.55, 0.58, 0.48] } }); else ep.fl.shop(14, 3, 25, 11, 'rideau');
  ep.fl.door(40, G, 6, 12, { kind: open ? 'door' : 'rideau', frame: false });
  ep.fl.sign(15, 17, 'ÉPICERIE', { scale: 1, plate: [0.16, 0.22, 0.36], plateMat: M.SHUTTER_BLUE, fg: [0.92, 0.88, 0.70], depth: -1, padX: 3, padY: 1 });
  ep.fl.sign(34, 17, 'PRIMEURS', { plate: [0.16, 0.22, 0.36], plateMat: M.SHUTTER_BLUE, fg: [0.70, 0.86, 0.50], depth: -1, padX: 1, padY: 1 });
  ep.fl.awning(14, 26, 12, 5, M.AWNING_GREEN);
  if (open) {
    // l'étal sur le trottoir : tréteaux, cageots, fruits
    W.box(547, 121, G, 548, 125, G + 4, M.WOOD); W.box(568, 121, G, 569, 125, G + 4, M.WOOD);
    W.box(546, 120, G + 4, 570, 126, G + 5, M.WOOD);
    W.box(546, 120, G + 5, 570, 126, G + 6, M.RES_FRUITS);
    for (let x = 547; x < 569; x += 4) W.box(x, 121, G + 6, x + 3, 123, G + 7, M.RES_FRUITS);
    B.crates(W, 571, 121, G, 2, M.CRATE_GREEN);
  }
  // le pignon peint, au-dessus du préau de l'école
  ep.fr.sign(4, 70, 'CHICORÉE', { scale: 2, fg: [0.86, 0.80, 0.62], plate: [0.22, 0.30, 0.36], plateMat: M.PLASTER_BLUE, depth: 0, worn: 0.2, padX: 2, padY: 2 });
  ep.fr.sign(4, 60, 'LA RIVOISE', { scale: 2, fg: [0.86, 0.66, 0.30], plate: [0.22, 0.30, 0.36], plateMat: M.PLASTER_BLUE, depth: 0, worn: 0.24, padX: 2, padY: 2 });
  ep.fr.sign(9, 50, 'LA TASSE DU MATIN', { fg: [0.80, 0.78, 0.66], depth: 0, worn: 0.3 });
  lanterne(k, ep.fl, 10, 34, k.night);
  P.push({ key: 'epicerie', label: "L'épicerie", x: 575, y: 120, z: G + 16 });
  ecole(k, P);
}

// ---------------------------------------------------------------- l'école publique
function ecole(k, P) {
  const W = k.W, x0 = 590, x1 = 670, yb0 = 24, yb1 = 70;
  const BR = M.BRICK_PALE, ST = M.STONE;
  // la cour : bitume, marelle, arbre, préau, grille
  W.box(x0, 70, 1, x1, 118, 2, M.ASPHALT);
  const mid = W.obj({ type: 'res_sol', kind: 'marelle', x0: 636, y0: 86, col: [0.90, 0.84, 0.52], worn: 0.1 });
  for (let y = 86; y < 108; y++) for (let x = 636; x < 643; x++) W.tag[W.idx(x, y, 1)] = mid;
  { const id = W.obj({ type: 'res_sol', kind: 'texte', text: 'BUT', x0: 652, y0: 78, col: [0.92, 0.80, 0.30], worn: 0.15 }); for (let y = 78; y < 82; y++) for (let x = 652; x < 660; x++) W.tag[W.idx(x, y, 1)] = id; }
  for (let i = 0; i < 30; i++) { const t = i / 30 * Math.PI * 2; W.set(Math.round(650 + Math.cos(t) * 6), Math.round(102 + Math.sin(t) * 6), 1, M.ROADLINE); }
  // les deux ailes et le pavillon central
  W.box(x0 + 2, yb0, G, x1, yb1, 49, BR);
  W.box(618, yb0, G, 648, 72, 58, BR);
  const fa = new Facade(W, LEFT, x0 + 2, yb0, x1 - x0 - 2, yb1 - yb0), fp = new Facade(W, LEFT, 618, yb0, 30, 72 - yb0), fr = new Facade(W, RIGHT, x0 + 2, yb0, x1 - x0 - 2, yb1 - yb0);
  for (const f of [fa, fp]) { f.rect(0, G, f.len, G + 3, 0, ST); f.rect(0, 18, f.len, 19, -1, ST); f.rect(0, 33, f.len, 34, -1, ST); }
  fa.rect(0, 48, fa.len, 49, -1, ST); fp.rect(0, 49, 30, 58, 0, ST); fp.rect(0, 57, 30, 58, -1, ST);
  fr.rect(0, G, fr.len, G + 3, 0, ST); fr.rect(0, 18, fr.len, 19, -1, ST); fr.rect(0, 48, fr.len, 49, -1, ST);
  for (let z = G; z < 58; z++) { fp.set(0, z, 0, ST); fp.set(29, z, 0, ST); }
  const winE = (f, s, z0, h, seed) => { f.rect(s, z0, s + 6, z0 + h, 0, 0); const id = W.obj({ type: 'res_vitrine', kind: 'ecole', face: f.face, a0: f.a0(s), z0, w: 6, h, seed, lit: false }); f.rect(s, z0, s + 6, z0 + h, 1, M.GLASS, id); f.rect(s - 1, z0 - 1, s + 7, z0, -1, ST); f.rect(s, z0 + h, s + 6, z0 + h + 1, 0, ST); };
  // aile ouest (FILLES) : s 0..26 ; aile est (GARÇONS) : s 58..78
  for (const s of [3, 12]) { winE(fa, s, 5, 11, s); winE(fa, s, 22, 10, s + 1); }
  for (const s of [60, 69]) { winE(fa, s, 5, 11, s); winE(fa, s, 22, 10, s + 1); }
  for (const s of [3, 12, 60, 69]) { const st = etat(k, x0 + s, yb1, 37); fa.window(s, 37, 6, 8, { state: st.state, shutter: M.SHUTTER_GREY, closed: st.closed, curtain: st.curtain, spill: false }); }
  fa.door(20, G, 4, 13, { mat: M.SHUTTER_GREEN, step: true, frameMat: ST }); fa.sign(18, 21, 'FILLES', { fg: [0.25, 0.20, 0.16], depth: 0 });
  fa.door(54, G, 4, 13, { mat: M.SHUTTER_GREEN, step: true, frameMat: ST }); fa.sign(51, 21, 'GARÇONS', { fg: [0.25, 0.20, 0.16], depth: 0 });
  // le pavillon central : la grande porte, les hautes fenêtres, l'enseigne, le fronton et son horloge
  fp.door(12, G, 6, 15, { mat: M.WOOD_DARK, step: true, frameMat: ST });
  winE(fp, 4, 5, 11, 7); winE(fp, 20, 5, 11, 8); winE(fp, 4, 22, 10, 9); winE(fp, 12, 22, 10, 10); winE(fp, 20, 22, 10, 11);
  for (const s of [4, 12, 20]) { const lit = k.night && s === 12 && !k.bad; fp.window(s, 37, 6, 9, { state: lit ? 'lit' : 'dark', shutter: M.SHUTTER_GREY, closed: !lit && k.night, curtain: [0.55, 0.50, 0.32], spill: lit }); }
  fp.sign(1, 56, 'ÉCOLE PUBLIQUE', { fg: [0.22, 0.18, 0.14], depth: 0 });
  B.gableRoof(W, 618, yb0, 30, 72 - yb0, 58, M.SLATE, { axis: 'y', oh: 1, slope: 2, gable: ST });
  { const id = W.obj({ type: 'res_horloge', face: LEFT, a0: 630, z0: 58, w: 6, lit: k.night }); for (let x = 630; x < 636; x++) for (let z = 58; z < 64; z++) if (W.get(x, 71, z)) W.tag[W.idx(x, 71, z)] = id; }
  W.box(632, 40, 64, 634, 42, 72, M.METAL); W.box(631, 39, 72, 635, 43, 74, M.ZINC);
  B.gableRoof(W, x0 + 2, yb0, 28, yb1 - yb0, 49, M.SLATE, { axis: 'x', oh: 1, slope: 2 });
  B.gableRoof(W, 648, yb0, 22, yb1 - yb0, 49, M.SLATE, { axis: 'x', oh: 1, slope: 2, gable: BR });
  B.chimney(W, 600, 40, 49, 13); B.chimney(W, 660, 44, 49, 13);
  // la façade sur la rue C
  for (const s of [5, 16, 27]) { winE(fr, s, 5, 11, 40 + s); winE(fr, s, 22, 10, 41 + s); const st = etat(k, x1, yb1 - s, 37); fr.window(s, 37, 6, 8, { state: st.state, shutter: M.SHUTTER_GREY, closed: st.closed, spill: false }); }
  // le préau, adossé au pignon de l'épicerie
  W.box(x0, 72, 1, 609, 112, 2, M.CONCRETE);
  for (let y = 74; y < 112; y += 9) W.box(606, y, G, 607, y + 1, G + 20, M.METAL_GREEN);
  W.box(x0, 71, G + 20, 609, 113, G + 21, M.WOOD_DARK); W.box(x0, 71, G + 21, 609, 113, G + 22, M.RES_TOLE);
  for (let y = 72; y < 112; y += 2) W.set(608, y, G + 19, M.WOOD_DARK);
  banc(W, 592, 80, G, 'y'); banc(W, 592, 96, G, 'y');
  for (let y = 76; y < 110; y += 3) W.set(590, y, G + 9, M.METAL);
  // l'arbre de la cour et son banc circulaire
  B.planeTree(W, 600, 113, G, { seed: 91, trunk: 15, r: 7.5, branches: 3, leafR: 7, leafAmt: 0.6 });
  for (let i = 0; i < 16; i++) { const t = i / 16 * Math.PI * 2; W.set(Math.round(600.5 + Math.cos(t) * 2.6), Math.round(113.5 + Math.sin(t) * 2.6), G, M.WOOD); }
  // la petite cage de foot
  for (let z = G; z < G + 5; z++) { W.set(664, 76, z, M.WHITE); W.set(664, 84, z, M.WHITE); }
  for (let y = 76; y <= 84; y++) { W.set(664, y, G + 5, M.WHITE); W.set(666, y, G + 4, M.METAL); }
  // la grille sur la rue, le portail, l'arche ÉCOLE
  W.box(x0, 118, G, x1, 120, G + 3, ST);
  for (let x = x0; x < x1; x += 2) if (x < 626 || x >= 640) for (let z = G + 3; z < G + 12; z++) W.set(x, 119, z, M.METAL_GREEN);
  for (let x = x0; x < x1; x++) if (x < 626 || x >= 640) W.set(x, 119, G + 12, M.METAL_GREEN);
  W.box(626, 118, G, 640, 120, G + 3, 0); W.box(626, 118, 1, 640, 120, 2, M.ASPHALT);
  for (const px of [624, 640]) { W.box(px, 118, G, px + 2, 120, G + 16, ST); W.box(px - 1, 117, G + 16, px + 3, 121, G + 17, ST); }
  W.box(626, 119, G + 14, 640, 120, G + 18, M.METAL_DARK);
  { const f = new Facade(W, LEFT, 626, 119, 14, 1); f.sign(1, G + 18, 'ÉCOLE', { fg: [0.88, 0.84, 0.66], depth: 0, padX: 0, padY: 0 }); }
  if (k.night) for (let x = 627; x < 640; x += 2) for (let z = G; z < G + 12; z++) W.set(x, 119, z, M.METAL_GREEN);
  for (const px of [624, 640]) { W.set(px, 119, G + 17, M.METAL_DARK); W.set(px + 1, 119, G + 17, M.METAL_DARK); W.box(px, 118, G + 18, px + 2, 120, G + 19, k.night ? M.BULB : M.GLASS); W.box(px, 118, G + 19, px + 2, 120, G + 20, M.METAL_DARK); if (k.night) W.light({ x: px + 1, y: 120.5, z: G + 18, r: 30, cr: 0.9, cg: 0.62, cb: 0.28, skip: 1.5 }); }
  { const lf = new Facade(W, LEFT, 618, yb0, 30, 72 - yb0); lanterne(k, lf, 15, 20, k.night); }
  for (let y = 72; y < 118; y += 2) for (let z = G + 3; z < G + 12; z++) W.set(668, y, z, M.METAL_GREEN);
  W.box(668, 70, G, 670, 118, G + 3, ST); for (let y = 70; y < 118; y++) W.set(668, y, G + 12, M.METAL_GREEN);
  // devant l'école : barrières, panneau « attention école »
  for (let x = 596; x < 668; x++) if (x < 620 || x > 646) { W.set(x, 126, G + 4, M.METAL_GREEN); if (x % 6 === 0) for (let z = G; z < G + 4; z++) W.set(x, 126, z, M.METAL_GREEN); }
  W.box(650, 125, G, 651, 126, G + 14, M.METAL_DARK);
  for (let i = 0; i < 5; i++) for (let j = 0; j <= i; j++) { W.set(648 + 2 - Math.floor(i / 2) + j, 126, G + 18 - i, i === 4 || j === 0 || j === i ? M.PLASTIC_RED : M.WHITE); }
  P.push({ key: 'ecole', label: "L'école publique", x: 633, y: 120, z: G + 20 });
}

function nordEst(k, P) {
  const W = k.W;
  arriere(k, { x0: 708, x1: 790, y0: 0, y1: 34, et: 5, mur: M.BRICK_PALE, volet: null, toit: 'terrasse', soigne: true });
  arriere(k, { x0: 790, x1: 862, y0: 0, y1: 36, et: 4, mur: M.PLASTER_ROSE, volet: M.SHUTTER_GREEN, toit: 'mansarde', soigne: true });
  cour(k, 708, 36, 862, 72);
  // E1 : enduit gris, volets bordeaux, mansarde
  const e1 = immeuble(k, { x0: 708, x1: 760, y0: 72, y1: 120, et: 4, mur: M.PLASTER_CREAM, volet: M.SHUTTER_BORD, toit: 'mansarde', baies: [5, 17, 29, 41], antenne: true, balcon: (e, s) => e === 1 && s === 17 ? 'plants' : null });
  porteImmeuble(k, e1.fl, 5); fenetreRdc(k, e1.fl, 17, 725, 120, { volet: M.SHUTTER_BORD }); porteCochere(k, e1.fl, 28, 10); fenetreRdc(k, e1.fl, 42, 750, 120, { volet: M.SHUTTER_BORD });
  lanterne(k, e1.fl, 26, 34, k.night && !k.bad);
  // E2 : brique des années trente, bow-windows, toit-terrasse
  const e2 = immeuble(k, { x0: 760, x1: 812, y0: 74, y1: 120, et: 4, mur: M.BRICK, volet: null, toit: 'terrasse', baies: [4, 23, 42], antenne: true });
  for (const s0 of [11, 30]) {
    for (let e = 1; e <= 4; e++) {
      const z0 = 19 + 15 * (e - 1);
      e2.fl.rect(s0, z0, s0 + 10, z0 + 14, -1, M.BRICK); e2.fl.rect(s0, z0, s0 + 10, z0 + 14, -2, M.BRICK);
      e2.fl.rect(s0 - 1, z0 + 13, s0 + 11, z0 + 14, -3, M.CONCRETE); e2.fl.rect(s0 - 1, z0 + 13, s0 + 11, z0 + 14, -2, M.CONCRETE);
      const bw = new Facade(W, LEFT, 760 + s0, 120, 10, 2);
      const st = etat(k, 760 + s0, 122, z0 + 3);
      bw.window(2, z0 + 3, 6, 9, { state: st.state, curtain: st.curtain, spill: false, sill: false });
    }
  }
  porteImmeuble(k, e2.fl, 22); fenetreRdc(k, e2.fl, 4, 764, 120, { barreaux: true }); fenetreRdc(k, e2.fl, 43, 803, 120, { barreaux: true }); lanterne(k, e2.fl, 28, 34, k.night && !k.bad);
  // E3 : le Terminus, café du coin de la gare
  const e3 = immeuble(k, { x0: 812, x1: 862, y0: 72, y1: 120, et: 3, mur: M.PLASTER_OCHRE, volet: M.SHUTTER_GREEN, toit: 'tuiles', baies: [4, 15, 26, 37], fw: 5, droite: true, baiesD: [] });
  for (const s of [28, 38]) { const st = etat(k, 862, 120 - s, 22); e3.fr.window(s, 22, 5, 9, { state: st.state, shutter: M.SHUTTER_GREEN, closed: st.closed, curtain: st.curtain, spill: false }); }
  const BX = M.SHUTTER_BORD;
  devanture(e3.fl, 3, 44, BX); devanture(e3.fr, 3, 20, BX);
  vitrine(k, e3.fl, 4, 3, 30, 11, 'cafe', { clients: k.night ? (k.bad ? [20] : [14, 32, 44]) : [22], fanion: 50, light: { r: 44, c: k.night ? [0.85, 0.48, 0.20] : [0.5, 0.35, 0.2] } });
  e3.fl.door(36, G, 6, 12, { kind: 'door', frame: false });
  vitrine(k, e3.fr, 4, 3, 18, 11, 'cafe', { clients: k.night && !k.bad ? [12] : [], light: k.night ? { r: 30, c: [0.7, 0.4, 0.18] } : null });
  const NE = k.night ? { fg: [1.0, 0.45, 0.40], emit: [1.3, 0.30, 0.24] } : { fg: [0.92, 0.78, 0.40] };
  e3.fl.sign(6, 17, 'LE TERMINUS', Object.assign({ plate: [0.32, 0.09, 0.12], plateMat: BX, depth: -1, padX: 2, padY: 1 }, NE));
  e3.fr.sign(3, 17, 'BAR · TABAC', Object.assign({ plate: [0.32, 0.09, 0.12], plateMat: BX, depth: -1, padX: 2, padY: 1 }, NE));
  e3.fr.blade(0, 21, 8, 3, M.RED_SIGN);
  if (k.night) { W.light({ x: 865.5, y: 121, z: 25, r: 26, cr: 0.6, cg: 0.08, cb: 0.06, skip: 3 }); W.light({ x: 836, y: 125, z: 19, r: 40, cr: 0.9, cg: 0.22, cb: 0.18, skip: 2 }); }
  e3.fl.awning(4, 30, 12, 5, M.AWNING);
  // le panneau publicitaire sur le flanc, côté gare
  e3.fr.rect(4, 40, 40, 58, -1, M.METAL_DARK);
  e3.fr.poster(5, 41, 34, 16, { title: 'LA CAPITALE EN 2 H', bg: [0.86, 0.82, 0.70], fg: [0.20, 0.30, 0.55], band: [0.20, 0.30, 0.55], depth: -1, seed: 41, torn: k.bad ? 0.2 : 0, lit: k.night && !k.bad ? 0.5 : 0 });
  if (k.night && !k.bad) W.light({ x: 864, y: 98, z: 62, r: 30, cr: 0.5, cg: 0.5, cb: 0.45, skip: 2, spot: 0.6 });
  // la terrasse
  if (!k.bad || !k.night) for (const tx of [818, 828, 838]) { B.terraceTable(W, tx, 121, G); chaise(W, tx - 2, 121, G, M.WOOD); chaise(W, tx + 3, 124, G, M.WOOD); }
  else for (const tx of [818, 826]) { W.box(tx, 121, G, tx + 3, 123, G + 9, M.WOOD); }
  P.push({ key: 'terminus', label: 'Le Terminus', x: 851, y: 120, z: G + 16 });
  gare(k, P);
}

// ---------------------------------------------------------------- la gare routière
function gare(k, P) {
  const W = k.W, x0 = 862, x1 = 1000;
  const full = !k.bad;
  // le sol : la plate-forme des cars, un quai central couvert
  W.box(x0, 42, 0, x1, 120, 2, 0); W.box(x0, 42, 0, x1, 120, 1, M.ASPHALT);
  W.box(x0, 42, 0, x1, 48, 2, M.SIDEWALK); W.box(x0, 47, 0, x1, 48, 2, M.CURB);
  const qy0 = 72, qy1 = 80;
  W.box(884, qy0, 0, 994, qy1, 2, M.CONCRETE); W.box(884, qy0, 0, 994, qy0 + 1, 2, M.CURB); W.box(884, qy1 - 1, 0, 994, qy1, 2, M.CURB); W.box(884, qy0, 0, 885, qy1, 2, M.CURB); W.box(993, qy0, 0, 994, qy1, 2, M.CURB);
  for (let x = 870; x < 996; x += 4) { W.box(x, 95, 0, x + 2, 96, 1, M.ROADLINE); W.box(x, 49, 0, x + 2, 50, 1, M.ROADLINE); }
  for (const x of [870, 934, 996]) W.box(x, 82, 0, x + 1, 95, 1, M.ROADLINE);
  k.solTxt(899, 98, 905, 104, 0, '3', { scale: 2 }); k.solTxt(963, 98, 969, 104, 0, '2', { scale: 2 }); k.solTxt(960, 64, 966, 70, 0, '1', { scale: 2 });
  // la clôture sur la rue des Lilas, entre l'entrée et la sortie des cars
  B.railing(W, 892, 118, 966, 118, G, 4, M.METAL_DARK, 3); W.box(892, 118, 0, 966, 120, 2, M.SIDEWALK);
  for (const [a, b] of [[866, 892], [966, 994]]) { W.box(a, 120, 0, b, 128, 2, 0); W.box(a, 120, 0, b, 128, 1, M.ASPHALT); }
  W.box(862, 48, 0, 868, 120, 2, M.SIDEWALK); W.box(867, 48, 0, 868, 118, 2, M.CURB);
  W.box(994, 118, 0, 1000, 128, 2, M.SIDEWALK);
  // le bâtiment des voyageurs, années soixante : béton, grandes vitres, bureaux à l'étage
  const bx0 = 866, bx1 = 998, by0 = 4, by1 = 42, zt = 34;
  W.box(bx0, by0, G, bx1, by1, zt, M.CONCRETE);
  const f = new Facade(W, LEFT, bx0, by0, bx1 - bx0, by1 - by0), fr = new Facade(W, RIGHT, bx0, by0, bx1 - bx0, by1 - by0);
  f.rect(0, 22, f.len, 23, -1, M.CONCRETE);
  B.flatRoof(W, bx0, by0, bx1 - bx0, by1 - by0, zt, M.CONCRETE, { parapet: 2 });
  vitrine(k, f, 4, 3, 26, 12, 'cafe', { clients: full ? [16, 36] : [], k: full && !k.night ? 1 : full ? 0.7 : 0.15, light: full ? { r: 36, c: [0.6, 0.42, 0.22] } : null });
  f.sign(6, 22, 'BUFFET', { plate: [0.10, 0.10, 0.11], plateMat: M.METAL_DARK, fg: [0.90, 0.84, 0.66], depth: -1, padX: 2, padY: 1 });
  f.door(32, G, 6, 13, { kind: full ? 'door' : 'rideau', frame: false });
  vitrine(k, f, 40, 3, 30, 12, 'attente', { gens: full ? [12, 22, 40] : [], k: full ? 1 : 0.3, light: { r: 40, c: [0.45, 0.50, 0.46] } });
  f.door(72, G, 6, 13, { kind: full ? 'door' : 'rideau', frame: false });
  if (full) vitrine(k, f, 80, 3, 18, 12, 'guichet', { employe: true, light: { r: 30, c: [0.45, 0.50, 0.46] } }); else f.shop(80, 3, 18, 12, 'rideau');
  f.sign(80, 22, 'GUICHETS', { plate: [0.10, 0.10, 0.11], plateMat: M.METAL_DARK, fg: [0.90, 0.84, 0.66], depth: -1, padX: 2, padY: 1 });
  // le tableau des départs, sur pieds, devant la façade
  const tb = new Facade(W, LEFT, 966, 47, 32, 1);
  W.box(967, 47, G, 968, 48, G + 4, M.METAL_DARK); W.box(995, 47, G, 996, 48, G + 4, M.METAL_DARK);
  W.box(966, 47, G + 4, 998, 48, G + 17, M.METAL_DARK); W.box(965, 46, G + 17, 999, 49, G + 18, M.METAL);
  const lignes = [[full ? 'DÉPARTS' : 'GRÈVE', null], [DEST.quai1, full ? '8:15' : '--:--'], [DEST.quai2, full ? '9:40' : '--:--'], [DEST.quai3, full ? '7:05' : '--:--']];
  lignes.forEach(([d, h], i) => {
    const zTop = G + 16 - i * 3, head = i === 0, red = head && !full;
    tb.sign(1, zTop, d, { fg: red ? [0.95, 0.30, 0.22] : head ? [0.95, 0.80, 0.30] : [0.90, 0.88, 0.80], emit: k.night ? (red ? [0.9, 0.2, 0.12] : full ? (head ? [0.9, 0.7, 0.2] : [0.6, 0.6, 0.55]) : null) : null, depth: 0, padX: 0, padY: 0 });
    if (h) tb.sign(25, zTop, h, { fg: full ? [0.95, 0.80, 0.30] : [0.60, 0.58, 0.52], emit: k.night && full ? [0.9, 0.7, 0.2] : null, depth: 0, padX: 0, padY: 0 });
  });
  if (k.night && full) W.light({ x: 982, y: 50, z: G + 10, r: 18, cr: 0.5, cg: 0.42, cb: 0.2, shadow: false });
  // les bureaux de la compagnie, à l'étage : fenêtres en bandeau
  for (let s = 4; s < 128; s += 14) { const st = k.night && full && k.rh(s, 4, 961) < 0.35; f.window(s, 22, 11, 7, { state: st ? 'office' : 'dark', spill: false, sill: true }); }
  for (let s = 4; s < 34; s += 10) { const st = k.night && full && k.rh(s, 5, 962) < 0.3; fr.window(s, 22, 6, 7, { state: st ? 'office' : 'dark', spill: false }); fr.window(s, 6, 6, 9, { state: 'dark', spill: false }); }
  // l'enseigne sur le toit
  const neon = k.night ? (full ? { fg: [1.0, 0.86, 0.50], emit: [1.25, 0.95, 0.42] } : { fg: [0.70, 0.60, 0.42], emit: [0.55, 0.40, 0.16], worn: 0.35 }) : { fg: [0.92, 0.88, 0.76] };
  for (const x of [904, 960]) W.box(x, 37, zt + 1, x + 1, 39, zt + 6, M.METAL_DARK);
  f.sign(36, zt + 13, 'GARE ROUTIÈRE', Object.assign({ scale: 2, plate: [0.10, 0.10, 0.11], plateMat: M.METAL_DARK, depth: -1, padX: 3, padY: 2 }, neon));
  if (k.night && full) W.light({ x: 932, y: 46, z: zt + 8, r: 46, cr: 0.7, cg: 0.55, cb: 0.25, skip: 3 });
  // la marquise devant le bâtiment : le quai 1 (basse et peu profonde, pour laisser voir les enseignes)
  for (let x = 870; x < 962; x += 16) W.box(x, 45, G, x + 1, 46, G + 15, M.METAL_DARK);
  W.box(bx0, 42, G + 15, 962, 46, G + 16, M.METAL_DARK); W.box(bx0, 45, G + 13, 962, 46, G + 15, M.METAL_DARK);
  { const fm = new Facade(W, LEFT, bx0, 42, 96, 4); fm.sign(10, G + 16, 'QUAI 1 · ' + DEST.quai1, { fg: [0.90, 0.88, 0.80], depth: 0, padX: 0, padY: 0, emit: k.night && full ? [0.55, 0.55, 0.5] : null }); }
  banc(W, 880, 42, G, 'x'); banc(W, 940, 42, G, 'x'); B.bin(W, 902, 43, G);
  // le quai central et son auvent : quai 2 à l'est, quai 3 à l'ouest
  const lit = k.night && full, zc = G + 24;
  for (let x = 890; x < 994; x += 16) W.box(x, qy0 + 4, G, x + 1, qy0 + 5, zc, M.METAL_DARK);
  W.box(884, qy0 - 1, zc, 994, qy1 + 1, zc + 1, lit ? M.RES_AUVENT_NUIT : M.RES_AUVENT);
  W.box(884, qy1 + 1, zc - 1, 994, qy1 + 2, zc + 2, M.METAL);
  { const fq = new Facade(W, LEFT, 884, qy0, 110, qy1 + 2 - qy0);
    fq.sign(56, zc + 2, 'QUAI 2 · ' + DEST.quai2, { plate: [0.12, 0.16, 0.30], plateMat: M.METAL, fg: [0.92, 0.92, 0.88], depth: 0, padX: 2, padY: 0, emit: lit ? [0.6, 0.6, 0.55] : null });
    fq.sign(4, zc + 2, 'QUAI 3 · ' + DEST.quai3, { plate: [0.12, 0.16, 0.30], plateMat: M.METAL, fg: [0.92, 0.92, 0.88], depth: 0, padX: 2, padY: 0, emit: lit ? [0.6, 0.6, 0.55] : null }); }
  for (let x = 892; x < 990; x += 16) W.box(x, qy0 + 4, zc - 1, x + 6, qy0 + 5, zc, lit ? M.LIT_PANEL : M.PLASTIC_WHITE);
  if (lit) for (let x = 900; x < 990; x += 32) W.light({ x, y: qy0 + 4.5, z: zc - 2, r: 34, cr: 0.55, cg: 0.6, cb: 0.55, shadow: false });
  banc(W, 906, qy0 + 1, G, 'x'); banc(W, 950, qy0 + 1, G, 'x'); B.bin(W, 930, qy0 + 5, G);
  for (const [px, t] of [[978, 'HORAIRES'], [888, 'HORAIRES']]) { W.box(px + 3, qy1 - 2, G, px + 4, qy1 - 1, G + 12, M.METAL_DARK); W.box(px, qy1 - 2, G + 8, px + 8, qy1 - 1, G + 13, M.POSTER); const fh = new Facade(W, LEFT, px, qy1 - 2, 8, 1); fh.poster(0, G + 8, 8, 5, { title: t, bg: [0.88, 0.86, 0.78], fg: [0.15, 0.20, 0.40], seed: px, lit: lit ? 0.4 : 0 }); }
  // les cars : derrière, le régional de Valdorne au quai 1 ; devant, le car de la Capitale et le car du Racing
  if (full) {
    autocar(k, 900, 50, { dir: -1, caisse: M.CAR_WHITE, bande: M.CAR_BLUE, bande2: M.CAR_BLUE, flanc: 'CARS DE LA DORNE', flancFg: [0.20, 0.30, 0.55], dest: DEST.quai1, allume: k.night, pax: 0.4 });
    autocar(k, 872, 83, { dir: -1, caisse: M.CAR_WHITE, bande: M.PLASTIC_RED, bande2: M.SEAT_GREY, flanc: 'CARS DE LA DORNE', flancFg: [0.55, 0.13, 0.12], dest: DEST.quai3, pax: 0.25, arriere: '12' });
    autocar(k, 936, 83, { dir: -1, caisse: M.CAR_BORD, bande: M.SEAT_GREY, bande2: M.SEAT_GREY, flanc: 'RACING AUBÉRIVE', ecusson: true, dest: DEST.quai2, allume: k.night, rideau: true, pax: k.night ? 0.25 : 0.45, soute: true, arriere: 'AUBES' });
  } else {
    // la gare vide : les affiches de grève, des papiers
    f.poster(46, 15, 8, 6, { title: 'GRÈVE', bg: [0.88, 0.86, 0.78], fg: [0.70, 0.10, 0.10], seed: 61, depth: 1 });
    f.poster(56, 15, 8, 6, { title: 'GRÈVE', bg: [0.88, 0.86, 0.78], fg: [0.70, 0.10, 0.10], seed: 62, depth: 1 });
    for (const [x, y] of [[930, 100], [902, 58], [960, 106], [915, 101], [944, 88], [975, 112]]) W.set(x, y, 0, M.WHITE);
  }
  // les lampadaires de la gare
  B.streetLamp(W, 864, 76, G, 1, 0, { on: k.night && full, h: 24 }); B.streetLamp(W, 864, 102, G, 1, 0, { on: k.night, h: 24 });
  for (const lx of [918, 978]) B.streetLamp(W, lx, 114, 1, 0, -1, { on: k.night && (full || lx === 918), h: 24, I: 2.0 });
  B.planeTree(W, 870, 112, G, { seed: 93, trunk: 15, r: 7, branches: 3, leafR: 8, leafAmt: 0.5 });
  W.box(868, 106, 1, 878, 117, 2, M.GRASS);
  P.push({ key: 'gareRoutiere', label: 'La gare routière', x: 951, y: 42, z: G + 18 });
}

// ================================================================ les pavillons du sud
const PAV = [
  // x0, x1, maison : dx, largeur, mur, toit ('x' faîtage est-ouest, 'y' pignon au sud), tuile, étage, volets, jardin
  [0, 50, 4, 24, M.RES_MEULIERE, 'y', M.TERRACOTTA, 0, M.SHUTTER_GREEN, ['potager', 'fruitier', 'cabane']],
  [50, 104, 3, 30, M.PLASTER_CREAM, 'x', M.TERRACOTTA, 0, M.SHUTTER_BLUE, ['voiture', 'linge', 'balancoire']],
  [104, 154, 3, 26, M.PLASTER_ROSE, 'x', M.TERRACOTTA, 1, M.SHUTTER_GREY, ['table', 'chien', 'fruitier']],
  [154, 206, 4, 28, M.RES_MEULIERE, 'x', M.SLATE, 0, M.SHUTTER_BORD, ['fleurs', 'nain', 'bois', 'voiture']],
  [206, 250, 3, 22, M.PLASTER_GREY, 'y', M.TERRACOTTA, 0, M.SHUTTER_GREEN, ['potager', 'clapier', 'velo']],
  [250, 292, 3, 26, M.PLASTER_OCHRE, 'x', M.TERRACOTTA, 0, M.SHUTTER_BLUE, ['linge', 'fruitier']],
  [330, 384, 4, 28, M.RES_MEULIERE, 'y', M.SLATE, 1, M.SHUTTER_GREY, ['table', 'fruitier', 'fleurs']],
  [384, 436, 3, 30, M.PLASTER_CREAM, 'x', M.TERRACOTTA, 0, M.SHUTTER_GREEN, ['potager', 'linge', 'brouette']],
  [436, 488, 3, 24, M.PLASTER_BLUE, 'y', M.TERRACOTTA, 0, M.SHUTTER_GREY, ['voiture', 'balancoire']],
  [532, 580, 3, 28, M.PLASTER_ROSE, 'x', M.TERRACOTTA, 0, M.SHUTTER_GREEN, ['table', 'chien']],
  [580, 626, 3, 22, M.RES_MEULIERE, 'y', M.TERRACOTTA, 0, M.SHUTTER_BORD, ['potager', 'cabane']],
  [626, 670, 3, 26, M.PLASTER_OCHRE, 'x', M.SLATE, 1, M.SHUTTER_BLUE, ['voiture', 'fleurs']],
  [708, 760, 3, 30, M.PLASTER_GREY, 'x', M.TERRACOTTA, 0, M.SHUTTER_GREEN, ['balancoire', 'linge']],
  [760, 812, 4, 24, M.RES_MEULIERE, 'y', M.TERRACOTTA, 0, M.SHUTTER_GREEN, ['fruitier', 'chien', 'potager']],
  [812, 862, 3, 28, M.PLASTER_CREAM, 'x', M.SLATE, 1, M.SHUTTER_GREY, ['voiture', 'table']],
  [862, 912, 3, 30, M.PLASTER_ROSE, 'x', M.TERRACOTTA, 0, M.SHUTTER_BLUE, ['potager', 'linge']],
  [912, 958, 3, 22, M.RES_MEULIERE, 'y', M.TERRACOTTA, 0, M.SHUTTER_BORD, ['cabane', 'table', 'nain']],
  [958, 1000, 3, 26, M.PLASTER_OCHRE, 'x', M.TERRACOTTA, 0, M.SHUTTER_GREEN, ['voiture', 'fruitier']],
];
const PAINTS = () => [M.CAR_BLUE, M.CAR_WHITE, M.CAR_BORD, M.PLASTIC_RED, M.SEAT_GREY, M.METAL_GREEN];
function pavillons(k, P) {
  const W = k.W;
  PAV.forEach((p, i) => pavillon(k, i, p));
}
function pavillon(k, i, [px0, px1, dx, hw, mur, toit, tuile, etage, volet, jardin]) {
  const W = k.W, hy = 164, hd = 16, hx = px0 + dx, mh = etage ? 27 : 14, zt = G + mh;
  const has = f => jardin.includes(f);
  const v = k.rh(px0, 7, 971);
  // le terrain : pelouse ; l'allée (ou le chemin) ; la haie ou le muret à grille sur la rue
  W.box(px0, 160, 0, px1, 188, 1, M.SOIL); W.box(px0, 160, 1, px1, 188, 2, M.GRASS);
  const gx = px1 - 12;
  const allee = has('voiture') ? [gx - 1, gx + 9] : [hx + hw + 2, hx + hw + 5];
  W.box(allee[0], 160, 1, allee[1], has('voiture') ? 186 : 170, 2, has('voiture') ? M.CONCRETE : M.GRAVEL);
  const haie = v < 0.6;
  for (let x = px0; x < px1; x++) {
    if (x >= allee[0] && x < allee[1]) continue;
    if (haie) W.box(x, 160, G, x + 1, 162, G + 5 + (k.rh(x, 160, 972) < 0.3 ? 1 : 0), M.HEDGE);
    else { W.box(x, 160, G, x + 1, 161, G + 3, mur === M.RES_MEULIERE ? M.RES_MEULIERE : M.STONE); W.set(x, 160, G + 3, M.STONE); if (x % 2 === 0) for (let z = G + 4; z < G + 8; z++) W.set(x, 160, z, M.METAL_DARK); W.set(x, 160, G + 8, M.METAL_DARK); }
  }
  for (const xx of [allee[0] - 1, allee[1]]) W.box(xx, 160, G, xx + 1, 161, G + 8, M.STONE);
  // au sud, la haie basse de la limite ; entre les parcelles, une haie ou un grillage
  W.box(px0, 186, G, px1, 188, G + 3, M.HEDGE);
  if (px1 !== 292 && px1 !== 488 && px1 !== 670 && px1 !== 1000) { if (k.rh(px1, 0, 973) < 0.5) W.box(px1 - 1, 162, G, px1, 186, G + 5, M.HEDGE); else B.railing(W, px1 - 1, 162, px1 - 1, 185, G, 4, M.METAL, 4); }
  // la maison : soubassement, murs, fenêtres à volets, porte-fenêtre sur le jardin
  W.box(hx, hy, G, hx + hw, hy + hd, zt, mur);
  const fl = new Facade(W, LEFT, hx, hy, hw, hd), fr = new Facade(W, RIGHT, hx, hy, hw, hd);
  const soc = mur === M.RES_MEULIERE ? M.BRICK : M.STONE;
  fl.rect(0, G, hw, G + 3, 0, soc); fr.rect(0, G, hd, G + 3, 0, soc);
  if (mur === M.RES_MEULIERE) { fl.rect(0, zt - 2, hw, zt - 1, 0, M.BRICK); fr.rect(0, zt - 2, hd, zt - 1, 0, M.BRICK); for (let z = G + 3; z < zt; z++) { fl.set(hw - 1, z, 0, (z >> 1) % 2 ? M.BRICK : M.RES_MEULIERE); fr.set(0, z, 0, (z >> 1) % 2 ? M.RES_MEULIERE : M.BRICK); } }
  const fen = (f, s, z0, w, h, x, y) => { const st = etat(k, x, y, z0, volet); f.window(s, z0, w, h, { state: st.state, shutter: volet, closed: st.closed, curtain: st.curtain, spillR: 18, spillI: 0.4, spill: z0 < 10 }); };
  const n = Math.max(2, Math.floor((hw - 8) / 9));
  const pos = j => 4 + Math.round(j * (hw - 13) / Math.max(1, n - 1));
  for (let j = 0; j < n; j++) { const s = pos(j); if (j === 1 && n >= 3) { fl.door(s, G + 3, 4, 10, { kind: k.night && k.rh(px0, 1, 974) < 0.5 ? 'door' : null, mat: M.WOOD, frame: false }); fl.rect(s - 1, G + 2, s + 5, G + 3, -1, M.STONE); } else fen(fl, s, G + 5, 5, 7, hx + s, hy + hd); }
  if (etage) for (let j = 0; j < n; j++) fen(fl, pos(j), G + 18, 5, 7, hx + pos(j), hy + hd + 1);
  // l'entrée, à l'est : perron de trois marches, porte, marquise de verre, applique
  fr.door(5, G + 3, 4, 10, { mat: volet, frameMat: M.STONE });
  for (let st = 1; st <= 3; st++) fr.rect(4, G, 10, G + 4 - st, -st, M.STONE);
  for (let st = 1; st <= 3; st++) fr.rect(4, G + 13, 10, G + 14, -st, st === 3 ? M.METAL_DARK : M.GLASS);
  fr.set(4, G + 12, -3, M.METAL_DARK); fr.set(9, G + 12, -3, M.METAL_DARK);
  if (hd >= 16) fen(fr, 11, G + 5, 3, 7, hx + hw, hy + 4);
  if (k.night) { fr.set(10, G + 11, -1, M.BULB); const pp = fr.front(10, G + 10, 2); W.light({ x: pp.x, y: pp.y, z: pp.z, r: 20, cr: 0.75, cg: 0.5, cb: 0.22, skip: 1.2 }); }
  // le toit, sa lucarne, sa cheminée, son râteau d'antenne
  if (toit === 'x') {
    B.gableRoof(W, hx, hy, hw, hd, zt, tuile, { axis: 'x', oh: 1, gable: mur });
    fr.window(6, zt + 2, 3, 3, { state: k.night && v < 0.4 ? 'lit' : 'dark', sill: false, spill: false });
    B.chimney(W, hx + 4, hy + 7, zt, 12);
    if (v > 0.25) B.antenna(W, hx + hw - 7, hy + 8, zt + 9, 9);
  } else {
    B.gableRoof(W, hx, hy, hw, hd, zt, tuile, { axis: 'y', oh: 1, gable: mur });
    fl.window((hw >> 1) - 2, zt + 2, 4, 4, { state: k.night && v < 0.5 ? 'lit' : 'dark', shutter: volet, sill: false, spill: false });
    const cx = hx + (hw >> 1) - 3; B.chimney(W, cx, hy + 9, zt, (hw >> 1) + 2);
    if (v > 0.25) B.antenna(W, hx + (hw >> 1), hy + 4, zt + ((hw + 2) >> 1), 9);
  }
  // devant la façade sud : plate-bande fleurie
  W.box(hx, hy + hd, 1, hx + hw, hy + hd + 2, 2, M.SOIL);
  for (let x = hx; x < hx + hw; x++) if (k.rh(x, hy, 975) < 0.55) W.set(x, hy + hd, G, M.RES_FLEURS);
  tonneau(W, hx + hw, hy + hd - 2, G);
  // la voiture dans l'allée
  if (has('voiture')) {
    const paint = PAINTS()[Math.floor(k.rh(px0, 2, 976) * 6)];
    const md = ['berline', 'citadine', 'break'][Math.floor(k.rh(px0, 3, 977) * 3)];
    voiture(W, gx, 163, 1, 'y', -1, paint, { modele: md, echarpe: paint === M.CAR_BORD });
  }
  // le jardin : sur le côté (de jx0 à jx1) puis devant la maison (de fx à hx + hw)
  const jx0 = hx + hw + (has('voiture') ? 2 : 6), jx1 = has('voiture') ? gx - 2 : px1 - 2;
  let cx = jx0, fx = hx + 1;
  const front = need => { if (fx + need > hx + hw - 1) return null; const x = fx; fx += need + 1; return x; };
  const side = need => { if (cx + need > jx1) return null; const x = cx; cx += need + 1; return x; };
  for (const f of jardin) {
    let x;
    if (f === 'potager') { if ((x = side(12)) != null) potager(W, x, 165, x + 12, 183, px0); }
    else if (f === 'fruitier') { if ((x = side(9)) != null) arbuste(W, x + 4, 174, G, { tronc: 7, r: 4.5, seed: px0 + 3 }); else if ((x = front(9)) != null) arbuste(W, x + 4, 182, G, { tronc: 6, r: 3.6, seed: px0 + 5 }); }
    else if (f === 'cabane') { if ((x = side(10)) != null) cabane(W, x, 167, G, volet); }
    else if (f === 'linge') { if ((x = front(14)) != null) linge(W, x, x + 13, 183, G); else if ((x = side(12)) != null) linge(W, x, x + 11, 176, G); }
    else if (f === 'balancoire') { if ((x = side(10)) != null) balancoire(W, x, 172, G); else if ((x = front(10)) != null) balancoire(W, x, 181, G); }
    else if (f === 'table') { if ((x = front(11)) != null) { B.parasol(W, x + 5, 183, G); chaise(W, x + 1, 183, G); chaise(W, x + 8, 183, G); } if ((x = side(4)) != null) barbecue(W, x, 181, G); }
    else if (f === 'chien') { if ((x = side(5)) != null) { niche(W, x, 168, G); k.people.push([CHIEN, x + 2, 176, G]); } else if ((x = front(5)) != null) { niche(W, x, 181, G); k.people.push([CHIEN, x + 6, 184, G]); } }
    else if (f === 'clapier') { if ((x = side(7)) != null) clapier(W, x, 166, G); else if ((x = front(7)) != null) clapier(W, x, 181, G); }
    else if (f === 'bois') { if ((x = front(8)) != null) bois(W, x, 183, G, 8); }
    else if (f === 'nain') { if ((x = front(3)) != null) k.people.push([NAIN, x + 1, 183, G]); }
    else if (f === 'velo') k.people.push([VELO, hx + hw + 4, 172, G]);
    else if (f === 'brouette') { if ((x = side(6)) != null) brouette(W, x + 1, 176, G); else if ((x = front(6)) != null) brouette(W, x + 1, 182, G); }
    else if (f === 'fleurs') W.box(hx + 1, hy + hd + 3, G, hx + hw - 1, hy + hd + 4, G + 1, M.RES_FLEURS);
  }
  // ce qui reste du jardin : un buisson, un massif, un petit arbre d'ornement
  for (let x = cx + 1; x + 3 < jx1; x += 6) {
    const r = k.rh(x, px0, 978);
    if (r < 0.35) arbuste(W, x + 2, 168 + Math.floor(r * 30), G, { tronc: 3, r: 2.6, mat: M.HEDGE, seed: x });
    else if (r < 0.6) W.box(x, 178, G, x + 4, 181, G + 1, M.RES_FLEURS);
    else if (r < 0.75) arbuste(W, x + 2, 176, G, { tronc: 5, r: 3.2, seed: x + 1 });
  }
  if (fx + 4 < hx + hw - 1 && k.rh(px0, 9, 979) < 0.5) arbuste(W, fx + 2, 183, G, { tronc: 2, r: 2.2, mat: M.HEDGE, seed: px0 });
}

// ================================================================ la rue : réverbères, voitures, mobilier
function rue(k, P) {
  const W = k.W;
  // réverbères sur le trottoir sud de la rue des Lilas, et dans les rues nord-sud
  const lampOn = (x, y) => k.night && !(k.bad && k.rh(x, y, 981) < 0.35);
  for (const x of [22, 92, 166, 240, 356, 430, 566, 640, 744, 816, 900, 976]) B.streetLamp(W, x, 157, G, 0, -1, { on: lampOn(x, 157) });
  for (const [a, b] of NS) { B.streetLamp(W, a - 5, 58, G, 1, 0, { on: lampOn(a, 58) }); B.streetLamp(W, b + 4, 178, G, -1, 0, { on: lampOn(b, 178) }); }
  // les voitures garées le long du trottoir nord (l'avant vers l'ouest)
  const nord = [[6, M.CAR_BLUE, 'berline'], [32, M.CAR_WHITE, 'citadine'], [76, M.SEAT_GREY, 'break'], [126, M.CAR_BORD, 'citadine'], [150, M.CAR_WHITE, 'berline'], [204, M.PLASTIC_RED, 'citadine'], [344, M.CAR_BLUE, 'citadine'], [364, M.METAL_GREEN, 'berline'], [398, M.CAR_WHITE, 'break'], [546, M.SEAT_GREY, 'citadine'], [574, M.CAR_BLUE, 'berline'], [720, M.CAR_WHITE, 'berline'], [744, M.PLASTIC_RED, 'citadine'], [790, M.CAR_BORD, 'berline'], [812, M.CAR_BLUE, 'break'], [836, M.SEAT_GREY, 'citadine']];
  for (const [x, paint, md] of nord) voiture(W, x, 129, 1, 'x', -1, paint, { modele: md });
  // ta voiture : la berline beige d'occasion, garée devant chez toi — sur cales en mauvaise saison
  voiture(W, 444, 129, 1, 'x', -1, M.CAR_BEIGE, { modele: 'berline', rouille: true, antenne: true, cales: k.bad });
  if (k.bad) W.box(440, 131, 1, 442, 133, 2, M.METAL_DARK);
  P.push({ key: 'voiture', label: 'Ta voiture', x: 455, y: 133, z: 12 });
  // dans les rues nord-sud, côté ouest
  for (const [a, y, paint, md] of [[300, 20, M.CAR_WHITE, 'berline'], [300, 76, M.CAR_BLUE, 'citadine'], [496, 14, M.SEAT_GREY, 'break'], [496, 70, M.PLASTIC_RED, 'citadine'], [678, 30, M.CAR_BORD, 'berline']]) voiture(W, a + 1, y, 1, 'y', 1, paint, { modele: md });
  voiture(W, 515, 164, 1, 'y', -1, M.CAR_WHITE, { modele: 'citadine' });
  // la circulation : le jour, la camionnette de livraison de l'épicerie ; la nuit, une voiture qui rentre, phares allumés
  if (k.day) voiture(W, 548, 138, 1, 'x', -1, M.CAR_WHITE, { modele: 'fourgon' });
  else if (!k.bad) {
    voiture(W, 700, 141, 1, 'x', 1, M.CAR_BLUE, { modele: 'berline', phares: true });
    W.light({ x: 723, y: 145, z: 3.5, r: 90, fall: 1.5, cr: 1.15, cg: 1.08, cb: 0.85, axis: [0.985, 0, -0.17], c0: 0.82, c1: 0.97, spill: 0, skip: 1 });
    W.light({ x: 698.5, y: 145, z: 3, r: 16, cr: 0.6, cg: 0.05, cb: 0.04, shadow: false });
  }
  // les panneaux : stop au débouché sud des rues nord-sud, sens interdit à la sortie des cars, P à l'entrée
  const panneau = (x, y, h, dessin) => { W.box(x, y, G, x + 1, y + 1, G + h, M.METAL_DARK); dessin(x, y, G + h); };
  const disque = (x, y, z, fond, barre) => { for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) { if (Math.abs(i) + Math.abs(j) > 3) continue; W.set(x + i, y, z + j, barre && j === 0 && Math.abs(i) < 2 ? M.WHITE : fond); } };
  for (const [a, b] of NS) panneau(b + 2, 163, 11, (x, y, z) => disque(x, y, z + 1, M.PLASTIC_RED, false));
  panneau(996, 121, 11, (x, y, z) => disque(x, y, z + 1, M.PLASTIC_RED, true));
  panneau(863, 121, 11, (x, y, z) => { W.box(x - 1, y, z, x + 3, y + 1, z + 4, M.CAR_BLUE); const f = new Facade(W, LEFT, x - 1, y, 4, 1); f.sign(1, z + 4, 'P', { fg: [0.92, 0.92, 0.90], depth: 0, padX: 0, padY: 0 }); });
  // mobilier : poubelles, bornes, bancs, arbres d'alignement côté pavillons
  for (const x of [60, 180, 420, 600, 760, 880]) B.bin(W, x, 125, G);
  for (const x of [292, 330, 488, 532, 670, 708]) for (const y of [121, 158]) B.bollard(W, x + (x === 292 || x === 488 || x === 670 ? 4 : 3), y, G);
}

// ================================================================ les gens
function gens(k) {
  const W = k.W;
  const sp = (def, x, y, z, extra = {}) => W.sprite(Object.assign({ x, y, z }, def, extra));
  const pal = (def, extra) => ({ pal: Object.assign({}, def.pal, extra) });
  for (const [def, x, y, z] of k.people) if (def !== CHIEN || !k.night) sp(def, x, y, z);
  const balc = k.balcon;
  if (k.day) {
    // la récréation
    const kids = [[fille([0.70, 0.18, 0.18]), 620, 104], [SAUTEUSE, 639, 96], [fille([0.30, 0.42, 0.70]), 633, 104], [garcon([0.86, 0.80, 0.30]), 646, 90], [SP.KID, 652, 86], [garcon([0.30, 0.55, 0.36]), 658, 80], [SP.BALL, 655, 84], [fille([0.85, 0.55, 0.20], [0.80, 0.62, 0.30]), 612, 92], [garcon([0.70, 0.20, 0.25]), 604, 86], [SP.KID, 640, 94], [garcon([0.32, 0.36, 0.62]), 616, 112], [fille([0.62, 0.30, 0.56]), 624, 113], [garcon([0.55, 0.55, 0.58]), 600, 100]];
    for (const [d, x, y] of kids) sp(d, x, y, G);
    sp(MAITRESSE, 626, 82, G);
    // la rue : la boulangerie, l'épicerie, la presse, les passants
    sp(BOULANGER, 478, 122.5, G); sp(MAMIE, 468, 123, G); sp(SP.WALKER2, 473, 125, G);
    sp(EPICIER, 562, 127, G); sp(SP.WALKER, 552, 127.5, G, pal(SP.WALKER, { q: [0.55, 0.45, 0.30] }));
    sp(SP.COAT, 423, 125, G);
    sp(MERE, 262, 124, G); sp(SP.WALKER, 340, 124, G); sp(FACTEUR, 700, 124, G); sp(SP.WALKER2, 156, 125, G, pal(SP.WALKER2, { q: [0.30, 0.42, 0.36] }));
    sp(CAMILLE, balc.x, balc.y, balc.z);
    // le square
    sp(BOULISTE, 276, 90, G); sp(BOULISTE, 283, 87, G, pal(BOULISTE, { v: [0.36, 0.20, 0.16], b: [0.60, 0.64, 0.70] })); sp(BOULE, 279, 98, G); sp(BOULE, 280, 99.5, G); sp(BOULE, 284, 100, G); sp(LECTEUR, 266.4, 89, G, pal(LECTEUR, { p: [0.30, 0.30, 0.34], P: [0.20, 0.20, 0.22] }));
    sp(fille([0.85, 0.75, 0.25]), 252, 104, G); sp(garcon([0.86, 0.40, 0.20]), 258, 101, G); sp(SP.WALKER2, 246, 104, G);
    sp(LECTEUR, 253, 81.4, G);
    sp(PIGEON, 248, 92, G); sp(PIGEON, 251, 94, G); sp(PIGEON, 268, 86, G); sp(PIGEON, 470, 126, G);
    // les jardins
    sp(JARDINIER, 404, 178, G); sp(JARDINIER, 26, 178, G, pal(JARDINIER, { b: [0.50, 0.42, 0.30] }));
    sp(SP.CAT, 186, 160, G + 6);
    // le Terminus
    sp(SP.FAN_SIT, 816.5, 123.5, G); sp(SP.FAN, 840, 126, G);
    if (!k.bad) {
      // la gare : Norbert charge la soute, toi et ton sac de maillots, deux joueurs, des voyageurs
      sp(NORBERT, 966, 97.5, G); sp(SP.COACH, 957, 98, G); sp(SP.PLAYER, 945, 99, G); sp(SP.BREHAUT, 950, 100.5, G);
      sp(VOYAGEUR, 920, 45, G); sp(VOYAGEUSE, 926, 46, G); sp(VOYAGEUSE, 888, 100, G, pal(VOYAGEUSE, { q: [0.30, 0.40, 0.52] })); sp(VOYAGEUR, 905, 104, G, pal(VOYAGEUR, { q: [0.30, 0.36, 0.30] }));
    } else {
      sp(SP.COACH, 452, 125, G);
    }
  } else if (!k.bad) {
    sp(SP.COACH, 470, 126, G);
    sp(SP.WALKER, 380, 124, G); sp(SP.WALKER2, 382.5, 123, G);
    sp(SP.FAN, 822, 126, G); sp(SP.FAN_SIT, 829.5, 123.5, G); sp(SP.GEGE, 846, 126, G);
    sp(NORBERT, 966, 97.5, G); sp(VOYAGEUR, 936, 45, G);
    sp(SP.CAT, 452, 133, 8);
    sp(CHIEN, 268, 125, G); sp(SP.COAT, 262, 124, G);
    sp(SP.WALKER, 245, 124, G, pal(SP.WALKER, { q: [0.45, 0.30, 0.22] }));
    sp(MAMIE, 560, 126, G, pal(MAMIE, { c: [0.40, 0.28, 0.30] })); sp(EPICIER, 571, 125.5, G);
  } else {
    sp(SP.COACH, 462, 126, G);
    sp(SP.CAT, 456, 133, 11);
    sp(SP.COAT, 820, 124, G);
  }
}

// ================================================================ le quartier
module.exports = {
  w: 1000, h: 188, seed: 1991,
  build(W, ctx) {
    enclos(W, 1000, 188);
    try { return construire(W, ctx); } finally { delete W.set; delete W.box; delete W.inb; delete W.stampLeaves; }
  },
};
// Tout ce que le quartier écrit reste dans son rectangle : les briques partagées (bandeau des mansardes,
// débords de toit, feuilles mortes) dépassent parfois d'un voxel ; on borne set, box, inb et stampLeaves.
function enclos(W, w, h) {
  const P = Object.getPrototypeOf(W);
  W.inb = function (x, y, z) { return x >= 0 && y >= 0 && x < w && y < h && P.inb.call(this, x, y, z); };
  W.set = function (x, y, z, m, t) { if (x >= 0 && y >= 0 && x < w && y < h) P.set.call(this, x, y, z, m, t); };
  W.box = function (x0, y0, z0, x1, y1, z1, m, t) { P.box.call(this, Math.max(0, Math.round(x0)), Math.max(0, Math.round(y0)), z0, Math.min(w, Math.round(x1)), Math.min(h, Math.round(y1)), z1, m, t); };
  W.stampLeaves = function (cx, cy, r, amt) {
    for (let y = Math.max(0, Math.floor(cy - r)); y < Math.min(h, cy + r); y++) for (let x = Math.max(0, Math.floor(cx - r)); x < Math.min(w, cx + r); x++) {
      const d = Math.hypot(x - cx, y - cy) / r, gx = x + this.ox, gy = y + this.oy;
      if (d < 1 && gx >= 0 && gy >= 0 && gx < this.X && gy < this.Y) this.leaf[gy * this.X + gx] += amt * (1 - d) * (1 - d);
    }
  };
}
function construire(W, ctx) {
  {
    const k = { W, night: !!ctx.night, day: !ctx.night, bad: ctx.mood === 'bad', people: [] };
    k.SEED = Math.floor(ctx.R() * 2147483647);
    k.rh = (a, b, c = 0) => hash(a | 0, b | 0, c | 0, k.SEED);
    const P = [];
    sol(k);
    nordOuest(k, P);
    nord1(k, P);
    nord2(k, P);
    nordEst(k, P);
    pavillons(k, P);
    rue(k, P);
    gens(k);
    W.box(0, 0, ZMAX + 1, 1000, 188, 100, 0);
    return { places: P };
  }
}
