'use strict';
// FUSIBLE · quartier « santé » (à l'est du club-house) : entre l'avenue du Stade (y = 0, au nord, vue de dos)
// et le boulevard (y = 132, au sud, la façade qui compte). Le bar du Corner, la banque, le cabinet du Doc,
// la salle de muscu dans l'ancien garage Mazurier, un immeuble et son vidéo-club. 1 voxel = 20 cm.
const E = require('./engine');
const { M } = require('./mats');
const B = require('./build');
const S = require('./sprites');
require('./diorama'); require('./interiors'); // M.TUBE, M.LEATHER, M.WEED… (déjà chargées par la ville)
const { LEFT, RIGHT, TOP, hash, fbm, mod, clamp, material, overlay, OVERLAYS, textBitmap } = E;
const { Facade } = B;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const grain = (c, amt, s = 0) => mul(c, 1 + (hash(c.a, c.b, c.face * 7 + s, c.m) - 0.5) * 2 * amt);
const grime = (c, h = 4, k = 0.24) => { if (c.face !== TOP) { const t = clamp((c.hz - 2) / h, 0, 1); mul(c, 1 - k * (1 - t)); } };
const along = c => c.face === LEFT ? c.hx : c.hy;

// ---------------------------------------------------------------- matière nouvelle (préfixe ESTQ, déclarée une seule fois)
// Pierre de taille de la banque : bossage à joints creux au rez-de-chaussée (sous z = 22), appareil fin au-dessus.
M.ESTQ_ASHLAR = M.ESTQ_ASHLAR || material('pierre de taille', c => {
  if (c.face === TOP) { rgb(c, 0.60, 0.57, 0.51); grain(c, 0.05); return; }
  const rust = c.hz < 22, ch = rust ? 8 : 6, cw = rust ? 16 : 12;
  const course = Math.floor(c.b / ch), off = (course & 1) * (cw / 2);
  const la = mod(c.a + off, cw), lb = mod(c.b, ch);
  let k = 0.9 + 0.12 * hash(Math.floor((c.a + off) / cw), course, c.face, 951);
  if (lb === 0) k *= rust ? 0.58 : 0.8; else if (la === 0) k *= rust ? 0.78 : 0.86; else if (rust && lb === ch - 1) k *= 1.08;
  rgb(c, 0.70 * k, 0.665 * k, 0.585 * k);
  grain(c, 0.035);
  mul(c, 0.93 + 0.12 * fbm(along(c) / 8, c.hz / 8, 952));
  grime(c, 6, 0.3);
});

// ---------------------------------------------------------------- calques (ne consomment pas de matière)
const localLA = (o, c) => o.face === LEFT ? Math.floor(2 * c.hx) - 2 * o.a0 : 2 * o.a0 - 1 - Math.floor(2 * c.hy);
// Peinture unie avec motif : portes de box, pompes, hortensias…
if (!OVERLAYS.esa_paint) overlay('esa_paint', (o, c) => {
  const f = o.col; rgb(c, f[0], f[1], f[2]);
  const al = c.face === LEFT ? Math.floor(2 * c.hx) : Math.floor(2 * c.hy), bl = Math.floor(2 * c.hz);
  if (o.pat === 'ribs' && c.face !== TOP && mod(al, 3) === 0) mul(c, 0.76);
  if (o.pat === 'hribs' && c.face !== TOP && mod(bl, 2) === 0) mul(c, 0.82);
  if (o.pat === 'rust' && fbm(c.hx * 0.6 + c.hy * 0.6, c.hz * 0.6, 961) > 0.6) rgb(c, 0.40, 0.23, 0.13);
  if (o.pat === 'flowers') {
    const v = hash(Math.floor(2 * c.hx), Math.floor(2 * c.hy), Math.floor(2 * c.hz), 962);
    if (v < 0.42) { const p = o.petals[Math.floor(v / 0.42 * o.petals.length)]; rgb(c, p[0], p[1], p[2]); } else mul(c, 0.8 + 0.4 * v);
  }
  if (c.face === TOP) { if (o.top) rgb(c, o.top[0], o.top[1], o.top[2]); else mul(c, 1.07); }
  grain(c, o.grain != null ? o.grain : 0.05);
  if (o.emit) { c.er = o.emit[0]; c.eg = o.emit[1]; c.eb = o.emit[2]; }
});
// Tags à la bombe.
if (!OVERLAYS.esa_graff) overlay('esa_graff', (o, c) => {
  if (c.face !== o.face) return;
  const la = localLA(o, c), lt = 2 * o.zTop - 1 - Math.floor(2 * c.hz);
  if (!o.bmp) o.bmp = textBitmap(o.text);
  if (o.stripes) { const v = mod(Math.floor(2 * c.hz), 2) ? 0.36 : 0.28; rgb(c, v, v, v * 0.97); }
  const sc = o.scale || 2;
  const at = (X, Y) => { const X2 = X + Math.floor(Y / 3) - 2, Y2 = Y - 1; return X2 >= 0 && Y2 >= 0 && o.bmp.at(Math.floor(X2 / sc), Math.floor(Y2 / sc)); };
  if (at(la, lt)) { const f = o.col; rgb(c, f[0], f[1], f[2]); if (hash(la, lt, 931, o.seed || 0) < 0.15) mul(c, 0.82); c.er = c.eg = c.eb = 0; return; }
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (at(la + dx, lt + dy)) { const e = o.edge || [0.07, 0.06, 0.07]; rgb(c, e[0], e[1], e[2]); c.er = c.eg = c.eb = 0; return; }
  for (let k = 2; k <= 5; k++) if (at(la, lt - k) && hash(la, 0, 932, o.seed || 0) < 0.22) { const f = o.col; rgb(c, f[0] * 0.85, f[1] * 0.85, f[2] * 0.85); return; }
});
// Le distributeur de billets : cadre inox, écran vert d'eau, clavier, fentes ; éteint, une barre rouge.
if (!OVERLAYS.esa_atm) overlay('esa_atm', (o, c) => {
  if (c.face !== o.face) return;
  const la = localLA(o, c), lb = Math.floor(2 * c.hz) - 2 * o.z0, W2 = o.w * 2, H2 = o.h * 2;
  if (la < 0 || la >= W2 || lb < 0 || lb >= H2) return;
  c.er = c.eg = c.eb = 0;
  rgb(c, 0.50, 0.51, 0.52); if (la === 0 || la === W2 - 1) mul(c, 0.75);
  if (lb >= H2 - 3) { rgb(c, 0.16, 0.30, 0.22); if (o.on) { c.er = 0.20; c.eg = 0.75; c.eb = 0.40; } if (mod(la, 3) === 1 && lb === H2 - 2) { rgb(c, 0.85, 0.9, 0.85); if (o.on) { c.er = 0.9; c.eg = 1.0; c.eb = 0.9; } } return; }
  if (lb >= H2 - 9 && lb < H2 - 4 && la >= 2 && la < W2 - 2) {
    if (o.on) { rgb(c, 0.10, 0.22, 0.22); const s = mod(lb, 2) ? 1 : 0.75; c.er = 0.14 * s; c.eg = 0.62 * s; c.eb = 0.58 * s; if (lb === H2 - 6 && la > 2 && la < W2 - 3) { c.er = 0.55; c.eg = 0.95; c.eb = 0.85; } }
    else { rgb(c, 0.04, 0.05, 0.05); if (lb === H2 - 7 && la > 2 && la < W2 - 3) rgb(c, 0.62, 0.10, 0.10); }
    return;
  }
  if (lb >= H2 - 14 && lb < H2 - 10 && la >= 2 && la < W2 - 2) { const key = mod(la, 2) === 0 && mod(lb, 2) === 0; rgb(c, key ? 0.72 : 0.25, key ? 0.72 : 0.25, key ? 0.70 : 0.26); return; }
  if (lb === H2 - 16 && la >= 2 && la < W2 - 2) { rgb(c, 0.05, 0.05, 0.05); return; }
});
// L'horloge de la banque.
if (!OVERLAYS.esa_clock) overlay('esa_clock', (o, c) => {
  if (c.face !== o.face) return;
  const la = localLA(o, c), lb = Math.floor(2 * c.hz) - 2 * o.z0, W2 = o.w * 2, H2 = o.h * 2;
  const cx = W2 / 2, cy = H2 / 2, r = Math.min(W2, H2) / 2 - 0.3;
  const dx = la + 0.5 - cx, dy = lb + 0.5 - cy, d = Math.hypot(dx, dy);
  if (d > r) return;
  c.er = c.eg = c.eb = 0;
  if (d > r - 1.3) { rgb(c, 0.22, 0.20, 0.16); return; }
  rgb(c, 0.88, 0.86, 0.78);
  if (o.lit) { c.er = 0.62; c.eg = 0.58; c.eb = 0.44; }
  const hand = (ang, len) => { const ux = Math.sin(ang), uy = Math.cos(ang), t = dx * ux + dy * uy; return t > -0.3 && t < len && Math.abs(dx * uy - dy * ux) < 0.55; };
  const hA = (o.hh % 12 + o.mm / 60) / 12 * Math.PI * 2, mA = o.mm / 60 * Math.PI * 2;
  if (hand(hA, r * 0.5) || hand(mA, r * 0.82)) { rgb(c, 0.08, 0.07, 0.06); c.er = c.eg = c.eb = 0; }
  else if (d > r - 2.4 && (Math.abs(dx) < 0.6 || Math.abs(dy) < 0.6)) { rgb(c, 0.25, 0.22, 0.18); c.er *= 0.3; c.eg *= 0.3; c.eb *= 0.3; }
});

// ---------------------------------------------------------------- personnages (1 pixel = 10 cm)
const K = [0.06, 0.045, 0.04];
const BASE = {
  k: K, s: [0.86, 0.69, 0.55], S: [0.66, 0.48, 0.37], h: [0.17, 0.11, 0.08], H: [0.30, 0.20, 0.13],
  o: [0.09, 0.09, 0.09], j: [0.24, 0.30, 0.42], J: [0.16, 0.20, 0.30], g: [0.46, 0.46, 0.45], G: [0.32, 0.32, 0.32],
  b: [0.84, 0.82, 0.76], w: [0.66, 0.66, 0.64],
};
const pal = (...extra) => Object.assign({}, BASE, ...extra);
const sp = (rows, p, ax, extra) => Object.assign({ rows, pal: p, ax }, extra || {});
const flip = rows => rows.map(r => [...r].reverse().join(''));

// Doc Sabatier : barbe courte poivre et sel, lunettes rondes remontées sur le front, blouse ouverte sur un pull bleu.
const SABATIER = sp([
  '...kkkkk...',
  '..khhhhhk..',
  '..kOkhOkk..',
  '..ksssssk..',
  '..kskskSk..',
  '..kgsssgk..',
  '...kgggk...',
  '..kbbuubbk.',
  '.kbbuuuubbk',
  '.kbbuuuubbk',
  '.kbbuuuubbk',
  '.ksbuuuubsk',
  '..kbbuubbk.',
  '..kbjjjjbk.',
  '..kbjkjjbk.',
  '...kjkjjk..',
  '...kjkjjk..',
  '...kokook..',
  '....k..kk..',
], pal({ h: [0.60, 0.60, 0.58], g: [0.70, 0.70, 0.67], O: [0.20, 0.18, 0.16], b: [0.88, 0.88, 0.84], u: [0.24, 0.32, 0.56], j: [0.22, 0.22, 0.24] }), 5);
// Un habitué de la salle : débardeur, gros bras, haltères.
const GYM = sp([
  '....kkkk....',
  '...khhhhk...',
  '...khsssk...',
  '...ksksSk...',
  '...kssssk...',
  '.k..kSSk..k.',
  'kdk.kwwk.kdk',
  'ksskwwwwkssk',
  '.kssswwsssk.',
  '..kkwwwwkk..',
  '...kwwwwk...',
  '...kjjjjk...',
  '...kjjjjk...',
  '...kjkkjk...',
  '...kjk.jk...',
  '...kjk.jk...',
  '...kok.ok...',
  '....k...k...',
], pal({ w: [0.82, 0.82, 0.78], d: [0.12, 0.12, 0.13], j: [0.14, 0.14, 0.16], h: [0.10, 0.08, 0.07] }), 6);
// Un autre au sac de frappe, de profil, gants rouges.
const BOXER = sp([
  '...kkkk....',
  '..khhhhk...',
  '..khhssk...',
  '..khsksk...',
  '...kssk....',
  '..kttttkkk.',
  '.ktttttkrrk',
  '.kttstkkrrk',
  '.ktttkrrkk.',
  '..kttkrrk..',
  '..kjjjjk...',
  '..kjjjjk...',
  '.kjjkkjjk..',
  '.kjk..kjk..',
  'kjk....kjk.',
  'kok....kok.',
  '.k......k..',
], pal({ t: [0.30, 0.34, 0.44], r: [0.70, 0.12, 0.12], j: [0.14, 0.14, 0.16], s: [0.70, 0.50, 0.36], S: [0.52, 0.36, 0.25], h: [0.06, 0.05, 0.05] }), 5);
// Le patron du Corner : chemise blanche, gilet noir, long tablier.
const BARMAN = sp([
  '...kkkk...',
  '..khhhhk..',
  '..khsssk..',
  '..kskskk..',
  '..kssssk..',
  '..kmmmk...',
  '..kbvvbk..',
  '.kbbvvbbk.',
  '.kbvvvvbk.',
  '.ksvvvvsk.',
  '..kaaaak..',
  '..kaaaak..',
  '..kaaaak..',
  '..kaaaak..',
  '..kjkkjk..',
  '..kok.ok..',
  '...k...k..',
], pal({ h: [0.10, 0.08, 0.07], m: [0.12, 0.09, 0.08], b: [0.88, 0.88, 0.84], v: [0.10, 0.10, 0.11], a: [0.86, 0.85, 0.80], j: [0.12, 0.12, 0.13] }), 4);
// Le retraité, casquette, veste marron, la baguette sous le bras.
const PAPY = sp([
  '..kkkkk...',
  '.kcccccck.',
  '..kssssk..',
  '..kskskk..',
  '..kssssk..',
  '...kSSk...',
  '..kqqqqk..',
  '.kqqqqqqkb',
  '.kqqqqqkb.',
  '.kqqqqkbk.',
  '.ksqqqbsk.',
  '..kqqbqk..',
  '..kjjjjk..',
  '..kjkkjk..',
  '..kjk.jk..',
  '..kok.ok..',
  '...k...k..',
], pal({ c: [0.30, 0.28, 0.26], q: [0.42, 0.30, 0.20], b: [0.82, 0.62, 0.30], j: [0.30, 0.30, 0.32] }), 4);
// La dame au cabas : manteau rouge, jupe, cabas en osier.
const DAME = sp([
  '...kkkk...',
  '..khhhhk..',
  '.khhssshk.',
  '..kskskk..',
  '..kssssk..',
  '...kSSk...',
  '..krrrrk..',
  '.krrrrrrk.',
  '.krrrrrrk.',
  '.ksrrrrrkk',
  '..krrrrkwk',
  '..krrrrkwk',
  '..kqqqqkkk',
  '...kqqk...',
  '...ksks...',
  '...koko...',
  '....k.k...',
], pal({ h: [0.55, 0.36, 0.20], r: [0.56, 0.16, 0.14], q: [0.22, 0.22, 0.28], w: [0.62, 0.48, 0.26] }), 4);
// Un gamin, cartable sur le dos.
const GAMIN = sp([
  '..kkkk..',
  '.khhhhk.',
  '.khsssk.',
  '.kssksk.',
  '..kSSk..',
  '.kggggk.',
  'kggggggk',
  'ksggggsk',
  '.kggggk.',
  '.kjjjjk.',
  '.kjkkjk.',
  '.kjk.jk.',
  '.kok.ok.',
  '..k..k..',
], pal({ g: [0.30, 0.45, 0.62], h: [0.55, 0.36, 0.18] }), 3);

const sprites = { SABATIER, GYM, BOXER, BARMAN, PAPY, DAME, GAMIN, FAN_SIT: S.FAN_SIT, FAN: S.FAN, COAT: S.COAT, WALKER: S.WALKER, WALKER2: S.WALKER2, CAT: S.CAT };


// ---------------------------------------------------------------- petits ouvrages
function leaves(W, cx, cy, r, amt, w, h) {
  for (let y = Math.max(0, Math.floor(cy - r)); y < Math.min(h, cy + r); y++)
    for (let x = Math.max(0, Math.floor(cx - r)); x < Math.min(w, cx + r); x++) {
      const d = Math.hypot(x - cx, y - cy) / r, gx = x + W.ox, gy = y + W.oy;
      if (d < 1 && gx >= 0 && gy >= 0 && gx < W.X && gy < W.Y) W.leaf[gy * W.X + gx] += amt * (1 - d) * (1 - d);
    }
}
// Arbre en boule (le magnolia persistant du Doc, le tilleul de la cour).
function roundTree(W, x, y, G, r, trunk, seed, m, tag = 0) {
  W.box(x, y, G, x + 2, y + 2, G + trunk, M.BARK);
  const cx = x + 1, cy = y + 1, cz = G + trunk + r - 1;
  for (let z = Math.floor(cz - r); z <= cz + r; z++) for (let yy = Math.floor(cy - r - 1); yy <= cy + r + 1; yy++) for (let xx = Math.floor(cx - r - 1); xx <= cx + r + 1; xx++) {
    const d = Math.hypot(xx + 0.5 - cx, yy + 0.5 - cy, (z + 0.5 - cz) * 1.15) / r;
    if (d < 0.8 + 0.3 * hash(xx, yy, z, seed) && W.get(xx, yy, z) === 0) W.set(xx, yy, z, m || M.HEDGE, tag);
  }
}
// Muret de pierre et grille à pointes.
function ironFence(W, x0, x1, y, G, wallH, h, wallMat = M.STONE) {
  if (x1 <= x0) return;
  W.box(x0, y, G, x1, y + 2, G + wallH, wallMat);
  W.box(x0, y, G + wallH, x1, y + 2, G + wallH + 1, M.CONCRETE);
  for (let x = x0; x < x1; x += 2) W.box(x, y + 1, G + wallH + 1, x + 1, y + 2, G + wallH + h, M.METAL_DARK);
  W.box(x0, y + 1, G + wallH + 2, x1, y + 2, G + wallH + 3, M.METAL_DARK);
  W.box(x0, y + 1, G + wallH + h - 2, x1, y + 2, G + wallH + h - 1, M.METAL_DARK);
}
// Mur de clôture plein, chaperon de pierre.
function wall(W, x0, y0, x1, y1, G, h, m = M.BRICK) { W.box(x0, y0, G, x1, y1, G + h, m); W.box(x0, y0, G + h, x1, y1, G + h + 1, M.STONE); }
// Le dessus d'un toit (pour poser une verrière sur une pente).
function topZ(W, x, y, z0, z1) { for (let z = z1; z >= z0; z--) if (W.get(x, y, z)) return z; return -1; }

// ---------------------------------------------------------------- le quartier
function build(W, ctx) {
  const { G, R } = ctx;
  const night = !!ctx.night, bad = ctx.mood === 'bad', day = !night;
  const w = 292, h = 132;
  const paint = (col, pat, extra) => W.obj(Object.assign({ type: 'esa_paint', col, pat }, extra || {}));
  const put = (def, x, y, z = G, extra) => W.sprite(Object.assign({ x, y, z }, def, extra || {}));
  const ground = (x0, y0, x1, y1, m, t = 0) => W.box(x0, y0, 1, x1, y1, 2, m, t);
  const places = [];
  const CURT = [[0.62, 0.30, 0.22], [0.55, 0.50, 0.32], [0.35, 0.40, 0.55], [0.55, 0.25, 0.35]];
  const winState = () => { if (!night) return 'dark'; const r = R(); return r < (bad ? 0.16 : 0.3) ? 'lit' : r < (bad ? 0.2 : 0.38) ? 'tv' : 'dark'; };
  const lamp = (f, s, z, I = 0.75) => { f.set(s, z, -1, M.BULB); W.light(Object.assign(f.front(s, z - 1, 3), { r: 24, cr: 0.8 * I, cg: 0.55 * I, cb: 0.28 * I, skip: 1.5 })); };

  // ================================================================ sols de l'îlot
  ground(0, 2, w, 120, M.CONCRETE);
  ground(0, 20, 124, 74, M.ASPHALT);                 // le parking de la banque
  ground(58, 4, 124, 20, M.ASPHALT);
  ground(124, 4, 194, 118, M.GRASS);                 // les jardins du Doc
  ground(256, 4, w, 72, M.COBBLE);                   // la cour de l'immeuble
  ground(54, 74, 58, 120, M.COBBLE);                 // passage
  for (let x = 62; x < 120; x += 11) { W.box(x, 36, 1, x + 1, 56, 2, M.ROADLINE); if (x > 84) W.box(x, 4, 1, x + 1, 22, 2, M.ROADLINE); }

  // ================================================================ A · l'immeuble d'angle et le bar du Corner
  const A = { x: 1, y: 74, w: 53, d: 46 };
  const ZA = [G, 22, 37, 52, 67];
  W.box(A.x, A.y, G, A.x + A.w, A.y + A.d, ZA[4], M.PLASTER_OCHRE);
  const fa = new Facade(W, LEFT, A.x, A.y, A.w, A.d), fae = new Facade(W, RIGHT, A.x, A.y, A.w, A.d);
  fa.rect(0, G, A.w, 22, 0, M.STONE);
  fa.rect(0, 22, A.w, 23, -1, M.STONE);
  fa.rect(0, ZA[4] - 1, A.w, ZA[4], -1, M.STONE); fa.rect(0, ZA[4] - 1, A.w, ZA[4], -2, M.STONE);
  const barOpen = !bad;
  fa.shop(2, G, 28, 12, barOpen ? 'buvette' : 'rideau', { light: barOpen ? { r: 46, c: night ? [0.85, 0.48, 0.22] : [0.4, 0.25, 0.12] } : null });
  fa.door(31, G, 5, 12, { kind: barOpen ? 'door' : 'rideau', frame: false });
  fa.awning(1, 36, 14, 5, M.AWNING_GREEN);
  const NEON = night && !bad ? { fg: [1.0, 0.50, 0.36], emit: [1.35, 0.42, 0.26] } : bad ? { fg: [0.42, 0.30, 0.28], worn: 0.25 } : { fg: [0.80, 0.40, 0.32] };
  fa.sign(1, 22, 'LE CORNER', Object.assign({ scale: 2, depth: 0, plate: [0.10, 0.09, 0.09], plateMat: M.METAL_DARK, padX: 2, padY: 1, light: night && !bad ? { r: 50, c: [0.85, 0.30, 0.18] } : null }, NEON));
  // l'enseigne en drapeau « BAR »
  const blade = new Facade(W, RIGHT, 40, 120, 1, 8);
  blade.sign(0, 21, 'BAR', { plate: [0.40, 0.10, 0.12], plateMat: M.METAL_BORD, fg: night && !bad ? [1.0, 0.85, 0.6] : [0.86, 0.80, 0.62], emit: night && !bad ? [1.1, 0.8, 0.45] : null, depth: 0 });
  W.box(40, 120, 21, 41, 122, 22, M.METAL_DARK);
  // la porte de l'immeuble
  fa.door(44, G, 6, 13, { mat: M.WOOD_DARK, step: true });
  if (night) lamp(fa, 47, G + 16, 0.6);
  for (let f = 1; f <= 3; f++) for (const s of [5, 17, 29, 41]) {
    const st = winState(), closed = st === 'dark' && (bad ? R() < 0.7 : R() < 0.35);
    fa.window(s, ZA[f] + 4, 6, 9, { state: st, shutter: M.SHUTTER_GREEN, closed, curtain: CURT[Math.floor(R() * 4)], balcony: f === 1 && (s === 17 || s === 29) ? (s === 17 ? 'plants' : 'rail') : null });
  }
  const topA = B.mansard(W, A.x, A.y, A.w, A.d, ZA[4], 12);
  for (const at of [8, 24, 40]) B.dormer(W, LEFT, A.x, A.y, A.w, A.d, at, ZA[4] + 1, { state: night && R() < 0.4 ? 'lit' : 'dark' });
  B.chimney(W, 12, 90, topA, 6); B.chimney(W, 40, 86, topA, 5); B.antenna(W, 28, 96, topA, 11);
  // le pignon est, au-dessus de la banque : une vieille réclame peinte
  fae.sign(5, 63, 'QUINQUINA', { scale: 2, plate: [0.42, 0.19, 0.16], plateMat: M.PLASTER_OCHRE, fg: [0.86, 0.80, 0.62], depth: 0, worn: 0.22, padX: 3, padY: 2 });
  fae.sign(5, 55, "DE L'AUBE", { scale: 2, plate: [0.42, 0.19, 0.16], plateMat: M.PLASTER_OCHRE, fg: [0.86, 0.80, 0.62], depth: 0, worn: 0.22, padX: 3, padY: 2 });
  places.push({ key: 'bar', label: 'Le Corner, le bar du quartier', x: 34.5, y: 120, z: G + 15 });
  // la terrasse
  if (!bad) {
    for (const tx of [6, 16]) { B.terraceTable(W, tx, 123, G); B.chair(W, tx - 2, 123, G, 'x'); B.chair(W, tx + 3, 126, G, 'y'); }
    B.terraceTable(W, 26, 124, G); B.chair(W, 29, 125, G, 'y');
  } else {
    fa.poster(8, G + 4, 10, 7, { title: 'À VENDRE', bg: [0.86, 0.84, 0.76], fg: [0.42, 0.10, 0.16], seed: 41 });
  }

  // ================================================================ B · la banque
  const BK = { x: 58, y: 80, w: 58, d: 40 };
  W.box(BK.x, BK.y, G, BK.x + BK.w, BK.y + BK.d, G + 38, M.ESTQ_ASHLAR);
  const fb = new Facade(W, LEFT, BK.x, BK.y, BK.w, BK.d), fbe = new Facade(W, RIGHT, BK.x, BK.y, BK.w, BK.d);
  fb.rect(0, G, BK.w, G + 2, -1, M.CONCRETE);
  for (const s of [4, 12, 40]) {
    fb.window(s, G + 5, 6, 12, { state: night && !bad && s === 12 ? 'lit' : 'dark', col: [0.45, 0.55, 0.85], k: 0.3, spill: false });
    for (let k = 1; k < 6; k += 2) fb.rect(s + k, G + 5, s + k + 1, G + 17, 0, M.METAL_DARK);
    fb.rect(s - 1, G + 17, s + 7, G + 18, -1, M.STONE);
  }
  // le porche : deux colonnes, entablement, perron, double porte au fond
  for (let d = 0; d < 5; d++) fb.rect(21, G + 3, 37, G + 19, d, 0);
  for (const s of [22, 34]) { fb.rect(s, G + 3, s + 2, G + 17, 0, M.STONE); fb.rect(s, G + 3, s + 2, G + 17, 1, M.STONE); fb.rect(s - 1, G + 16, s + 3, G + 17, -1, M.STONE); fb.rect(s - 1, G + 3, s + 3, G + 4, -1, M.STONE); }
  fb.rect(20, G + 17, 38, G + 20, -1, M.STONE); fb.rect(20, G + 17, 38, G + 20, 0, M.STONE);
  for (let k = 1; k <= 3; k++) fb.rect(19, G, 39, G + 4 - k, -k, M.STONE);
  const porch = new Facade(W, LEFT, BK.x + 21, BK.y, 16, BK.d - 5);
  porch.door(5, G + 3, 6, 11, { mat: M.WOOD_DARK, frame: false });
  porch.window(5, G + 14, 6, 3, { state: night && !bad ? 'lit' : 'dark', sill: false, lintel: false, frame: [0.25, 0.2, 0.12], spill: false });
  if (night && !bad) W.light({ x: BK.x + 29, y: BK.y + BK.d + 1, z: G + 12, r: 22, cr: 0.6, cg: 0.45, cb: 0.25, skip: 1.5 });
  places.push({ key: 'banque', label: 'La Banque Aubérivoise', x: BK.x + 29, y: BK.y + BK.d, z: G + 23 });
  // le nom en lettres d'or sur un bandeau noir, deux appliques
  fb.rect(0, G + 20, BK.w, G + 21, -1, M.STONE);
  fb.sign(10, G + 26, 'BANQUE AUBÉRIVOISE', { plate: [0.09, 0.09, 0.10], plateMat: M.METAL_DARK, fg: [0.86, 0.70, 0.30], depth: -1, emit: night && !bad ? [0.42, 0.32, 0.10] : null });
  if (night && !bad) for (const s of [12, 45]) { fb.set(s, G + 28, -2, M.BULB); fb.set(s, G + 28, -1, M.METAL_DARK); W.light(Object.assign(fb.front(s, G + 25, 3), { r: 20, cr: 0.7, cg: 0.5, cb: 0.25, skip: 1.5 })); }
  // l'étage noble, la corniche, la balustrade, l'horloge
  for (const s of [3, 12, 21, 32, 41, 50]) {
    fb.window(s, G + 27, 5, 9, { state: night && !bad && (s === 41) ? 'office' : 'dark', shutter: null });
    for (let k = -1; k <= 5; k++) { fb.set(s + k, G + 29, -1, M.METAL_DARK); if (k % 2 === 0) fb.set(s + k, G + 28, -1, M.METAL_DARK); }
    fb.rect(s - 1, G + 36, s + 6, G + 37, -1, M.STONE);
  }
  fb.rect(0, G + 37, BK.w, G + 38, -1, M.STONE); fb.rect(0, G + 37, BK.w, G + 38, -2, M.STONE);
  W.box(BK.x + 1, BK.y + 1, G + 38, BK.x + BK.w - 1, BK.y + BK.d - 1, G + 39, M.ROOF_FLAT);
  for (let x = BK.x; x < BK.x + BK.w; x++) {
    W.set(x, BK.y + BK.d - 1, G + 38, M.STONE); W.set(x, BK.y + BK.d - 1, G + 42, M.STONE);
    if (x % 2 === 0) for (let z = G + 39; z < G + 42; z++) W.set(x, BK.y + BK.d - 1, z, M.STONE);
  }
  for (let y = BK.y; y < BK.y + BK.d; y++) { W.set(BK.x + BK.w - 1, y, G + 38, M.STONE); W.set(BK.x + BK.w - 1, y, G + 42, M.STONE); if (y % 2 === 0) for (let z = G + 39; z < G + 42; z++) W.set(BK.x + BK.w - 1, y, z, M.STONE); }
  W.box(BK.x + 23, BK.y + BK.d - 3, G + 38, BK.x + 35, BK.y + BK.d, G + 48, M.ESTQ_ASHLAR);
  for (let k = 0; k < 4; k++) W.box(BK.x + 23 + k * 1.5, BK.y + BK.d - 3, G + 48 + k, BK.x + 35 - k * 1.5, BK.y + BK.d, G + 49 + k, M.STONE);
  const clk = W.obj({ type: 'esa_clock', face: LEFT, a0: BK.x + 25, z0: G + 39, w: 8, h: 8, hh: night ? 10 : 10, mm: night ? 50 : 10, lit: night && !bad });
  for (let x = BK.x + 25; x < BK.x + 33; x++) for (let z = G + 39; z < G + 47; z++) W.tag[W.idx(x, BK.y + BK.d - 1, z)] = clk;
  W.box(BK.x + 8, BK.y + 8, G + 39, BK.x + 16, BK.y + 14, G + 43, M.METAL);
  // le distributeur, éclairé
  const atmOn = !bad;
  for (let z = G; z < G + 12; z++) for (let s = 48; s < 55; s++) fb.set(s, z, 0, 0);
  const atm = W.obj({ type: 'esa_atm', face: LEFT, a0: fb.a0(49), z0: G + 1, w: 5, h: 10, on: atmOn });
  fb.rect(49, G + 1, 54, G + 11, 1, M.LIT_PANEL, atm);
  fb.rect(48, G, 49, G + 12, 1, M.METAL); fb.rect(54, G, 55, G + 12, 1, M.METAL); fb.rect(49, G, 54, G + 1, 1, M.METAL); fb.rect(49, G + 11, 54, G + 12, 1, M.METAL);
  fb.rect(47, G + 12, 56, G + 13, -1, M.METAL); fb.rect(47, G + 12, 56, G + 13, -2, M.METAL_DARK);
  if (atmOn) W.light(Object.assign(fb.front(51.5, G + 8, 3), { r: night ? 30 : 16, cr: 0.35, cg: 0.62, cb: 0.58, skip: 2 }));
  if (bad) W.box(BK.x + 2, BK.y + BK.d - 1, G + 2, BK.x + 20, BK.y + BK.d, G + 4, M.ESTQ_ASHLAR, W.obj({ type: 'esa_graff', face: LEFT, a0: BK.x + 2, zTop: G + 5, text: 'RACKET', scale: 1, col: [0.20, 0.30, 0.65], seed: 5 }));
  // la face est de la banque
  for (const s of [6, 18, 30]) { fbe.window(s, G + 5, 5, 12, { state: 'dark', spill: false }); fbe.window(s, G + 27, 5, 9, { state: night && !bad && s === 18 ? 'office' : 'dark' }); }
  // le passage entre la banque et le jardin du Doc
  wall(W, 116, 118, 124, 120, G, 9);
  W.box(118, 118, G, 122, 120, G + 9, M.WOOD_DARK);

  // ================================================================ C · la maison du Doc
  const HS = { x: 134, y: 64, w: 46, d: 32 };
  const RZ = G + 5, ET = G + 20, CO = G + 34;
  W.box(HS.x, HS.y, G, HS.x + HS.w, HS.y + HS.d, CO, M.BRICK);
  const fh = new Facade(W, LEFT, HS.x, HS.y, HS.w, HS.d), fhe = new Facade(W, RIGHT, HS.x, HS.y, HS.w, HS.d);
  for (const f of [fh, fhe]) {
    f.rect(0, G, f.len, RZ, 0, M.STONE); f.rect(0, RZ - 1, f.len, RZ, -1, M.STONE);
    f.rect(0, ET - 1, f.len, ET, -1, M.STONE); f.rect(0, CO - 1, f.len, CO, -1, M.STONE); f.rect(0, CO - 1, f.len, CO, -2, M.STONE);
    for (let z = RZ; z < CO - 1; z += 3) { const q = Math.floor((z - RZ) / 3) % 2 ? 3 : 2; f.rect(0, z, q, z + 3, 0, M.STONE); f.rect(f.len - q, z, f.len, z + 3, 0, M.STONE); }
  }
  const shutD = bad ? M.SHUTTER_GREY : M.SHUTTER_GREY;
  for (const s of [5, 12, 29, 36]) {
    const study = s === 36;
    const st = study && night ? 'lit' : 'dark';
    fh.window(s, RZ + 3, 5, 10, { state: st, col: [0.80, 0.95, 0.55], k: 0.7, sil: study && night ? 'head' : null, silX: 6, shutter: bad && !study ? shutD : null, closed: true, curtain: [0.55, 0.45, 0.30], spillR: 30, spillI: 0.7 });
    fh.window(s, ET + 3, 5, 9, { state: 'dark', shutter: bad || (night && s < 20) ? shutD : null, closed: true, curtain: [0.55, 0.45, 0.30] });
    fh.window(s + 1, G + 1, 3, 2, { state: 'dark', sill: false, lintel: false, frame: [0.2, 0.2, 0.2] });
  }
  fh.window(21, ET + 3, 4, 9, { state: 'dark', shutter: null, balcony: 'rail' });
  fh.door(20, RZ, 6, 12, { mat: M.WOOD_DARK, frameMat: M.STONE });
  for (let k = 1; k <= 5; k++) fh.rect(18, G, 28, G + 6 - k, -k, M.STONE);
  for (let k = 1; k <= 5; k++) { fh.set(18, G + 7 - k, -k, M.METAL_DARK); fh.set(27, G + 7 - k, -k, M.METAL_DARK); }
  // la marquise de verre et de fer
  for (let d = 1; d <= 4; d++) fh.rect(18, RZ + 13, 28, RZ + 14, -d, d === 4 ? M.METAL_DARK : M.BOOTH);
  fh.rect(18, RZ + 12, 19, RZ + 13, -4, M.METAL_DARK); fh.rect(27, RZ + 12, 28, RZ + 13, -4, M.METAL_DARK);
  for (const s of [6, 20]) { fhe.window(s, RZ + 3, 5, 10, { state: 'dark', shutter: bad ? shutD : null, closed: true, curtain: [0.55, 0.45, 0.30] }); fhe.window(s, ET + 3, 5, 9, { state: 'dark', shutter: bad || night ? shutD : null, closed: true }); }
  const topH = B.mansard(W, HS.x, HS.y, HS.w, HS.d, CO, 12);
  for (const at of [139, 155, 170]) B.dormer(W, LEFT, HS.x, HS.y, HS.w, HS.d, at, CO + 1, { state: 'dark' });
  B.dormer(W, RIGHT, HS.x, HS.y, HS.w, HS.d, 76, CO + 1, { state: 'dark' });
  B.chimney(W, 140, 76, topH, 7); B.chimney(W, 172, 78, topH, 7);
  places.push({ key: 'cabinet', label: 'Le cabinet du Doc Sabatier', x: HS.x + 23, y: HS.y + HS.d, z: RZ + 15 });
  // le jardin de devant : allée, hortensias, magnolia, banc
  ground(154, 101, 160, 118, M.GRAVEL);
  const hyd = paint([0.17, 0.27, 0.13], 'flowers', { petals: bad ? [[0.45, 0.38, 0.30], [0.38, 0.30, 0.24]] : [[0.72, 0.42, 0.58], [0.45, 0.50, 0.78], [0.80, 0.62, 0.72]], grain: 0.15 });
  for (const [x0, x1] of [[136, 150], [164, 178]]) for (let x = x0; x < x1; x++) { const hh = 3 + Math.floor(hash(x, 0, 971, 0) * 3); W.box(x, 96, G, x + 1, 99, G + hh, M.HEDGE, hyd); }
  roundTree(W, 127, 104, G, 6.5, 6, 977, M.HEDGE);
  W.box(166, 108, G, 167, 110, G + 2, M.METAL_DARK); W.box(172, 108, G, 173, 110, G + 2, M.METAL_DARK); W.box(166, 108, G + 2, 173, 110, G + 3, M.WOOD); W.box(166, 108, G + 3, 173, 109, G + 5, M.WOOD);
  W.box(144, 110, G, 146, 112, G + 3, M.STONE); W.box(143, 109, G + 3, 147, 113, G + 5, M.STONE);
  // le muret, la grille, le portail, la plaque
  ironFence(W, 124, 150, 118, G, 7, 7); ironFence(W, 164, 182, 118, G, 7, 7);
  for (const px of [150, 161]) { W.box(px, 117, G, px + 3, 120, G + 16, M.STONE); W.box(px - 1, 116, G + 16, px + 4, 121, G + 17, M.STONE); W.box(px + 1, 118, G + 17, px + 2, 119, G + 19, M.METAL_DARK); W.set(px + 1, 118, G + 19, night && !bad ? M.BULB : M.GLASS); if (night && !bad) W.light({ x: px + 1.5, y: 121, z: G + 18, r: 22, cr: 0.75, cg: 0.52, cb: 0.26, skip: 1.5 }); }
  for (let x = 153; x < 161; x += 2) W.box(x, 119, G, x + 1, 120, G + 13, M.METAL_DARK);
  W.box(153, 119, G + 1, 161, 120, G + 2, M.METAL_DARK); W.box(153, 119, G + 12, 161, 120, G + 13, M.METAL_DARK);
  new Facade(W, LEFT, 125, 118, 25, 2).sign(1, G + 6, 'DR SABATIER', { plate: [0.64, 0.52, 0.24], plateMat: M.METAL, fg: [0.12, 0.09, 0.05], depth: 0, padX: 2, padY: 1 });
  // l'allée de la voiture du Doc
  ground(182, 70, 194, 120, M.GRAVEL);
  B.car(W, 183, 97, G, 'y', M.CAR_WHITE);
  wall(W, 194, 66, 198, 120, G, 8);

  // ================================================================ D · l'ancien garage Mazurier, devenu salle de muscu
  const GA = { x: 198, y: 66, w: 56, d: 40 };
  const fr = GA.y + GA.d - 1;
  W.box(GA.x, GA.y, G, GA.x + GA.w, GA.y + GA.d, G + 22, M.BRICK_OLD);
  W.box(GA.x + 1, GA.y + 1, G, GA.x + GA.w - 1, fr, G + 21, 0);
  W.box(GA.x + 1, GA.y + 1, 1, GA.x + GA.w - 1, fr, 2, M.CONCRETE);
  B.gableRoof(W, GA.x, GA.y, GA.w, GA.d - 3, G + 22, M.ZINC, { axis: 'x', slope: 2, oh: 0 });
  const skyM = (night && !bad) ? M.SKYLIGHT : M.GLASS;
  for (const [sx0, sx1] of [[204, 212], [222, 230], [240, 248]]) for (let x = sx0; x < sx1; x++) for (let y = GA.y + 22; y < GA.y + 34; y++) { const z = topZ(W, x, y, G + 22, G + 34); if (z > 0) W.set(x, y, z, skyM); }
  W.box(GA.x, fr - 2, G + 22, GA.x + GA.w, fr + 1, G + 26, M.BRICK_OLD);
  W.box(GA.x + 6, fr - 2, G + 26, GA.x + 50, fr + 1, G + 31, M.BRICK_OLD);
  W.box(GA.x + 16, fr - 2, G + 31, GA.x + 40, fr + 1, G + 35, M.BRICK_OLD);
  W.box(GA.x, fr - 2, G + 26, GA.x + 6, fr + 1, G + 27, M.CONCRETE); W.box(GA.x + 50, fr - 2, G + 26, GA.x + GA.w, fr + 1, G + 27, M.CONCRETE);
  W.box(GA.x + 6, fr - 2, G + 31, GA.x + 16, fr + 1, G + 32, M.CONCRETE); W.box(GA.x + 40, fr - 2, G + 31, GA.x + 50, fr + 1, G + 32, M.CONCRETE);
  W.box(GA.x + 16, fr - 2, G + 35, GA.x + 40, fr + 1, G + 36, M.CONCRETE);
  const fgar = new Facade(W, LEFT, GA.x, GA.y, GA.w, GA.d);
  fgar.sign(13, G + 30, 'GARAGE MAZURIER', { fg: [0.80, 0.76, 0.62], depth: 0, worn: 0.3, drip: true });
  fgar.sign(24, G + 35, '1952', { fg: [0.78, 0.74, 0.60], depth: 0, worn: 0.35 });
  const gymOpen = !bad;
  fgar.sign(15, G + 26, 'MUSCULATION', { plate: [0.86, 0.84, 0.76], plateMat: M.METAL, fg: [0.42, 0.10, 0.16], depth: -1, worn: bad ? 0.3 : 0, plateEmit: night && gymOpen ? [0.32, 0.31, 0.27] : null });
  // le grand portail : rideau métallique à moitié levé, la salle derrière
  for (let s = 8; s < 38; s++) for (let z = G; z < G + 18; z++) fgar.set(s, z, 0, 0);
  fgar.shop(8, gymOpen ? G + 11 : G, 30, gymOpen ? 7 : 18, 'rideau', { lintelMat: M.CONCRETE });
  if (gymOpen) for (let s = 8; s < 38; s++) fgar.set(s, G + 11, 1, M.METAL_DARK);
  fgar.rect(7, G + 18, 39, G + 20, -1, M.METAL);
  fgar.door(41, G, 5, 11, { kind: gymOpen ? 'door' : 'rideau', frame: true, frameMat: M.CONCRETE });
  fgar.poster(47, G + 4, 7, 7, { title: '22H', bg: [0.86, 0.84, 0.76], fg: [0.42, 0.10, 0.16], seed: 44, torn: bad ? 0.5 : 0 });
  if (bad) {
    W.box(GA.x + 9, fr - 1, G + 1, GA.x + 37, fr, G + 9, M.METAL, W.obj({ type: 'esa_graff', face: LEFT, a0: GA.x + 9, zTop: G + 9, text: 'ZONE 91', scale: 2, col: [0.85, 0.30, 0.55], seed: 7, stripes: true }));
    fgar.sign(14, G + 16, 'À LOUER', { plate: [0.86, 0.84, 0.76], plateMat: M.PAPER, fg: [0.42, 0.10, 0.16], depth: -1 });
  }
  places.push({ key: 'muscu', label: 'La salle de muscu (ex-garage Mazurier)', x: GA.x + 23, y: GA.y + GA.d, z: G + 22 });
  // dedans, ce qu'on voit sous le rideau : barre chargée, banc, râtelier, sac de frappe ; néons au plafond
  const ix = GA.x, iy = fr;
  W.box(ix + 9, iy - 5, 1, ix + 18, iy - 1, 2, M.TIRE); W.box(ix + 19, iy - 5, 1, ix + 34, iy - 1, 2, M.TIRE);
  W.box(ix + 20, iy - 3, G + 2, ix + 33, iy - 2, G + 3, M.CHROME);
  for (const bx of [ix + 21, ix + 31]) W.box(bx, iy - 4, G, bx + 1, iy - 1, G + 5, M.METAL_DARK);
  W.box(ix + 10, iy - 4, G, ix + 11, iy - 2, G + 2, M.METAL_DARK); W.box(ix + 16, iy - 4, G, ix + 17, iy - 2, G + 2, M.METAL_DARK);
  W.box(ix + 10, iy - 4, G + 2, ix + 17, iy - 2, G + 3, M.LEATHER);
  for (const bx of [ix + 12, ix + 15]) W.box(bx, iy - 1, G, bx + 2, iy, G + 1, M.METAL_DARK);
  W.box(ix + 3, iy - 6, G, ix + 9, iy - 4, G + 3, M.METAL_DARK);
  for (let k = 0; k < 3; k++) W.box(ix + 4 + 2 * k, iy - 6, G + 3, ix + 5 + 2 * k, iy - 4, G + 4, M.CHROME);
  W.box(ix + 36, iy - 4, G + 4, ix + 38, iy - 2, G + 13, M.SEAT); W.box(ix + 36, iy - 4, G + 13, ix + 37, iy - 3, G + 21, M.METAL_DARK);
  for (const [bx, by] of [[ix + 26, iy - 14], [ix + 26, iy - 9]]) W.box(bx, by, G, bx + 1, by + 1, G + 14, M.METAL_DARK);
  W.box(ix + 26, iy - 14, G + 10, ix + 27, iy - 8, G + 11, M.CHROME);
  W.box(ix, iy - 16, G + 3, ix + 1, iy - 2, G + 12, M.GLASS);
  for (const ty of [iy - 6, iy - 16]) W.box(ix + 4, ty, G + 20, ix + 46, ty + 1, G + 21, gymOpen ? M.TUBE : M.METAL);
  if (gymOpen) {
    W.light({ x: ix + 23, y: iy - 5, z: G + 16, r: 44, cr: 0.75, cg: 0.86, cb: 0.86, skip: 1.5 });
    W.light({ x: ix + 23, y: iy - 1, z: G + 9, r: 24, cr: 0.55, cg: 0.62, cb: 0.62, skip: 1.5 });
    W.light({ x: ix + 23, y: iy + 3, z: G + 6, r: 34, cr: 0.35, cg: 0.42, cb: 0.42, skip: 1.5, shadow: false });
  }
  // la piste : les vieilles pompes, la mobylette
  ground(GA.x, GA.y + GA.d, GA.x + GA.w, 120, M.CONCRETE);
  W.box(GA.x + 1, GA.y + GA.d + 3, G, GA.x + 7, GA.y + GA.d + 7, G + 1, M.CONCRETE);
  const pumpRed = paint([0.58, 0.13, 0.11], 'rust');
  for (const px of [GA.x + 1, GA.x + 4]) {
    W.box(px + 0.5, GA.y + GA.d + 4, G + 1, px + 2.5, GA.y + GA.d + 6, G + 9, M.PLASTIC_RED, pumpRed);
    W.box(px + 0.5, GA.y + GA.d + 4, G + 9, px + 2.5, GA.y + GA.d + 6, G + 11, M.WHITE);
    W.set(px + 1, GA.y + GA.d + 5, G + 6, M.PAPER);
  }
  B.moped(W, GA.x + 42, GA.y + GA.d + 6, G, 'x');
  for (const bx of [214, 226, 238]) B.bollard(W, bx, 118, G, M.METAL_DARK);

  // ================================================================ E · l'immeuble de l'angle est, son vidéo-club
  const EB = { x: 258, y: 72, w: 33, d: 48 };
  const ZE = [G, 20, 34, 48, 62];
  W.box(EB.x, EB.y, G, EB.x + EB.w, EB.y + EB.d, ZE[4], M.PLASTER_ROSE);
  const fe = new Facade(W, LEFT, EB.x, EB.y, EB.w, EB.d), fee = new Facade(W, RIGHT, EB.x, EB.y, EB.w, EB.d);
  fe.rect(0, G, EB.w, 20, 0, M.PLASTER_GREY); fe.rect(0, 19, EB.w, 20, -1, M.STONE);
  const vidOpen = !bad;
  fe.shop(2, G, 19, 11, vidOpen ? 'tabac' : 'rideau', { light: vidOpen ? { r: 36, c: [0.40, 0.42, 0.75] } : null, k: night ? 1 : 0.7 });
  fe.door(23, G, 5, 12, { mat: M.WOOD_DARK, step: true });
  const VNEON = night && vidOpen ? { fg: [0.62, 0.70, 1.0], emit: [0.55, 0.65, 1.35] } : { fg: [0.45, 0.50, 0.72], worn: bad ? 0.3 : 0 };
  fe.sign(2, 18, 'VIDÉO CLUB', Object.assign({ depth: 0, light: night && vidOpen ? { r: 34, c: [0.30, 0.38, 0.85] } : null }, VNEON));
  fe.poster(29, G + 3, 3, 8, { bg: [0.14, 0.16, 0.34], band: [0.80, 0.62, 0.20], seed: 51, lit: night && vidOpen ? 0.5 : 0, torn: bad ? 0.4 : 0 });
  for (let f = 1; f <= 3; f++) for (const s of [3, 14, 25]) {
    const st = winState(), closed = st === 'dark' && R() < (bad ? 0.7 : 0.4);
    fe.window(s, ZE[f] + 4, 5, 8, { state: st, shutter: M.SHUTTER_BLUE, closed, curtain: CURT[Math.floor(R() * 4)], balcony: f === 1 && s === 14 ? 'plants' : null });
  }
  for (let f = 0; f <= 3; f++) for (const s of [8, 20, 32]) { if (f === 0 && s !== 32) continue; fee.window(s, ZE[f] + 4, 5, 8, { state: winState(), curtain: CURT[(s + f) % 4] }); }
  fe.pipe(32, G, ZE[4]);
  B.gableRoof(W, EB.x, EB.y, EB.w, EB.d, ZE[4], M.SLATE, { axis: 'y', oh: 1, gable: M.PLASTER_ROSE });
  B.chimney(W, 266, 92, ZE[4] + 12, 5); B.antenna(W, 274, 104, ZE[4] + 15, 10);
  ground(254, 72, 258, 120, M.COBBLE);
  wall(W, 254, 70, 258, 72, G, 8);

  // ================================================================ côté avenue : les box, le parking, les jardins, la cour
  // les box de garage, portes basculantes tournées vers le parking
  const BX = { x: 4, y: 4, w: 54, d: 16 };
  W.box(BX.x, BX.y, G, BX.x + BX.w, BX.y + BX.d, G + 11, M.CONCRETE);
  W.box(BX.x - 1, BX.y, G + 11, BX.x + BX.w + 1, BX.y + BX.d + 1, G + 12, M.ROOF_FLAT);
  const fbx = new Facade(W, LEFT, BX.x, BX.y, BX.w, BX.d);
  const doorCols = [[0.66, 0.60, 0.46], [0.40, 0.28, 0.18], [0.25, 0.38, 0.28], [0.52, 0.52, 0.50], [0.42, 0.12, 0.16]];
  for (let i = 0; i < 5; i++) {
    const s0 = i * 11 + 1;
    for (let s = s0; s < s0 + 9; s++) for (let z = G; z < G + 9; z++) fbx.set(s, z, 0, 0);
    const tg = bad && (i === 1 || i === 3) ? W.obj({ type: 'esa_graff', face: LEFT, a0: fbx.a0(s0), zTop: G + 8, text: i === 1 ? 'KRS' : 'TBK', scale: 2, col: i === 1 ? [0.75, 0.25, 0.20] : [0.25, 0.55, 0.70], seed: i }) : paint(doorCols[i], 'hribs');
    fbx.rect(s0, G, s0 + 9, G + 9, 1, M.METAL, tg);
  }
  wall(W, 58, 2, 124, 4, G, 7); wall(W, 0, 2, 4, 20, G, 7);
  W.box(70, 2, G, 84, 4, G + 8, 0);
  B.car(W, 62.5, 36, G, 'y', M.CAR_BEIGE); B.car(W, 84.5, 36, G, 'y', M.CAR_BLUE);
  if (!bad) B.car(W, 106.5, 36, G, 'y', M.CAR_BORD);
  B.car(W, 95.5, 3.5, G, 'y', M.CAR_WHITE); if (!night) B.car(W, 106.5, 3.5, G, 'y', M.CAR_BEIGE);
  // le jardin de derrière du Doc : potager, serre, grand arbre, cabane, mur sur l'avenue
  wall(W, 124, 2, 198, 4, G, 9, M.STONE); wall(W, 124, 4, 126, 64, G, 7, M.STONE);
  W.box(128, 2, G, 132, 4, G + 8, M.WOOD_DARK);
  for (let r = 0; r < 6; r++) { ground(170, 10 + r * 4, 190, 12 + r * 4, M.SOIL); if (!bad) for (let x = 170; x < 190; x += 2) W.set(x, 10 + r * 4, G, M.HEDGE); }
  W.box(132, 10, G, 146, 22, G + 8, M.BOOTH); W.box(133, 11, G + 8, 145, 21, G + 10, M.BOOTH);
  for (const [gx, gy] of [[132, 10], [145, 10], [132, 21], [145, 21]]) W.box(gx, gy, G, gx + 1, gy + 1, G + 8, M.METAL);
  W.box(184, 40, G, 192, 50, G + 9, M.WOOD); B.gableRoof(W, 184, 40, 8, 10, G + 9, M.TERRACOTTA, { oh: 1 });
  B.planeTree(W, 150, 34, G, { seed: 41, trunk: 15, r: 9, leafR: 0.01 }); leaves(W, 151, 35, 20, 0.9, w, h);
  // la cour du garage : pneus, épave, fûts
  wall(W, 198, 2, 256, 4, G, 9); W.box(212, 2, G, 228, 4, G + 9, M.METAL, paint([0.32, 0.36, 0.40], 'ribs'));
  for (const [tx, ty, n] of [[204, 10, 4], [204, 16, 3], [210, 12, 5], [240, 52, 3]]) for (let k = 0; k < n; k++) W.box(tx, ty, G + k, tx + 4, ty + 4, G + k + 1, M.TIRE);
  B.car(W, 222, 30, G + 1, 'x', M.CAR_BLUE);
  for (const a0 of [2, 14]) for (const b0 of [0, 7]) W.box(222 + a0, 30 + b0, G + 1, 225 + a0, 31 + b0, G + 4, 0);
  for (const a0 of [3, 15]) W.box(222 + a0, 31, G, 224 + a0, 37, G + 1, M.CONCRETE);
  const drum = paint([0.20, 0.34, 0.50], 'rust');
  for (const [dx, dy] of [[246, 12], [249, 12], [246, 15]]) W.box(dx, dy, G, dx + 2, dy + 2, G + 4, M.KEG, drum);
  // la cour de l'immeuble : poubelles, tilleul, vélo
  wall(W, 256, 2, w, 4, G, 9);
  roundTree(W, 272, 30, G, 7, 9, 979, M.FOLIAGE); leaves(W, 273, 31, 14, 0.8, w, h);
  B.bin(W, 260, 64, G); B.bin(W, 263, 64, G); B.bin(W, 266, 64, G);
  B.car(W, 279.5, 8, G, 'y', M.CAR_BLUE);
  // l'étendoir : on y fait sécher les maillots du club
  for (const px of [258, 276]) W.box(px, 50, G, px + 1, 51, G + 10, M.METAL);
  for (let x = 259; x < 276; x++) W.set(x, 50, G + 9, M.METAL_DARK);
  if (!bad || day) for (const [lx, m] of [[260, M.JERSEY], [264, M.TOWEL], [268, M.JERSEY], [272, M.JERSEY]]) W.box(lx, 50, G + 5, lx + 3, 51, G + 9, m);

  // ================================================================ le trottoir du boulevard
  const lampOn = i => night && !(bad && i === 1);
  [[46, 0], [122, 1], [200, 2], [256, 3]].forEach(([lx, i]) => B.streetLamp(W, lx, 124, G, 0, 1, { on: lampOn(i) }));
  for (const bx of [62, 70, 106, 112]) B.bollard(W, bx, 129, G);
  B.bin(W, 186, 128, G); B.bin(W, 52, 128, G);
  for (const bx of [136, 236]) { W.box(bx, 127, G, bx + 1, 129, G + 2, M.METAL_DARK); W.box(bx + 7, 127, G, bx + 8, 129, G + 2, M.METAL_DARK); W.box(bx, 127, G + 2, bx + 8, 129, G + 3, M.WOOD); W.box(bx, 128, G + 3, bx + 8, 129, G + 5, M.WOOD); }
  W.box(126, 128, G, 128, 130, G + 3, M.PLASTIC_RED); W.box(126, 128, G + 3, 128, 130, G + 4, M.METAL_DARK);

  // ================================================================ les gens
  if (day && !bad) {
    put(sprites.SABATIER, 158, 96.6, RZ);
    put(sprites.BARMAN, 33.5, 121.5);
    put(sprites.FAN_SIT, 5, 124.5); put(sprites.FAN_SIT, 15, 124.5); put(sprites.FAN, 23, 127);
    put(sprites.COAT, 108.5, 122);
    put(sprites.PAPY, 176, 127.5); put(sprites.DAME, 196, 126); put(sprites.GAMIN, 242, 127.5);
    put(sprites.WALKER, 268, 125); put(sprites.WALKER2, 270.5, 124);
    put(sprites.GYM, ix + 24, iy + 2); put(sprites.BOXER, ix + 34, iy - 0.5);
    put(sprites.CAT, 125, 112, G + 14);
  } else if (night && !bad) {
    put(sprites.FAN, 38, 122); put(sprites.FAN_SIT, 15, 124.5); put(sprites.FAN_SIT, 5, 124.5);
    put(sprites.WALKER2, 108.5, 122.5);
    put(sprites.GYM, ix + 24, iy + 2); put(sprites.BOXER, ix + 34, iy - 0.5);
    put(sprites.WALKER, 238, 127); put(sprites.WALKER2, 232.5, 125);
    put(sprites.CAT, 151.5, 118, G + 17);
  } else if (day) {
    put(sprites.COAT, 26, 123); put(sprites.PAPY, 176, 127.5); put(sprites.DAME, 240, 126);
    put(sprites.CAT, 125, 112, G + 14);
  } else {
    put(sprites.WALKER, 90, 126);
    put(sprites.CAT, 151.5, 118, G + 17);
  }
  return { places };
}

module.exports = { w: 292, h: 132, seed: 1992, build };
Object.defineProperty(module.exports, 'sprites', { value: sprites, enumerable: false }); // pour la planche de contrôle
