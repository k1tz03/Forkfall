'use strict';
// Le port de la Rive (le Grand Aubérive) : le quartier de l'est, au-delà du boulevard de ceinture,
// devant à droite dans l'image. 364 × 1 072 voxels (1 voxel = 20 cm), en coordonnées locales :
// x = 0 touche le boulevard (la ville est derrière), x = 363 se fond dans le paysage ; y = 0 touche
// les Hauts, y = 1 071 la campagne. La Rive le traverse (l'eau de y 326 à 392 : le couloir est posé
// par le maître) et s'élargit au sud en bassin, de x 200 à 336 et jusqu'à y 556.
// La caméra voit le dessus et les faces +y (LEFT) et +x (RIGHT) : ce qui compte regarde le sud ou
// l'est. Près du boulevard (x < 150), rien ne passe 60 voxels ; au-delà, la grue des docks, le
// portique et le silo montent jusqu'à 125 (zmax : 140).
//
// Du nord au sud :
// - la route du Silo (y 8–32) ; le parc à remorques et son pont-bascule, le dépôt de cuves, la voie du silo ;
// - les Magasins généraux (entrepôts 5 et 6, brique), l'entrepôt 7 (tôle, voûte), le silo à grains ;
// - la route du quai nord (y 270–298), praticable de bout en bout ;
// - le quai nord : la guinguette et sa péniche-bar, la grue des docks, la tour de chargement du silo ;
// - la Rive, et le pont tournant de la voie ferrée au bord extérieur ;
// - le quai sud, la capitainerie à la pointe du bassin ; dans le bassin, une péniche, un pousseur et ses
//   deux barges, la barge à conteneurs sous le portique ;
// - la halle aux sables, le Relais des routiers ; le parc à conteneurs, sa grille et sa guérite ;
// - l'avenue du Port (y 730–758) ; le parking des poids lourds, les maisons du port, la casse ;
// - le faisceau de voies ; la route du Halage (y 1 040–1 064), puis les champs ;
// - le long du bord extérieur, la grande ligne sur son ballast.
// La nuit : des mâts d'éclairage, l'enseigne du relais, les guirlandes de la guinguette, la vigie de la
// capitainerie, des hublots. Ce qu'on décharge à l'entrepôt 7, la nuit, ne se déclare pas.
// Tout est inventé : les bateaux portent des mots (L'Espérance, L'Obstinée, Le Colosse…) ou une ville du
// contenu, les transporteurs des villes du contenu ; aucune commune, aucun armateur, aucune marque réels ;
// rien n'est d'une seule époque (1990–2050).
const E = require('./engine');
const { M } = require('./mats');
const B = require('./build');
const SP = require('./sprites');
// M.WEED, M.MUD, M.TARP, M.BARRIER (diorama), M.PAPER (intérieurs), M.FRI_TOLE, M.FRI_ROUILLE, M.FRI_FLAMME et
// les calques fri_* (la friche) : déjà chargés par la ville ; la Rive (M.RIVER2, M.QUAY_STONE, M.HULL,
// M.BRIDGE_STONE) vient de zone.js.
require('./diorama'); require('./interiors'); require('./district_friche');
const { LEFT, RIGHT, TOP, hash, vnoise, fbm, mod, clamp, material, overlay, OVERLAYS, textBitmap } = E;
const { Facade } = B;

const WD = 364, HT = 1072, G = 2;
const LIGNE = [343, 350]; // les deux files de rail de la grande ligne, le long du bord extérieur

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const grain = (c, amt, s = 0) => mul(c, 1 + (hash(c.a, c.b, c.face * 7 + s, c.m) - 0.5) * 2 * amt);
const along = c => c.face === LEFT ? c.hx : c.hy;
const grime = (c, h = 4, k = 0.24) => { if (c.face !== TOP) { const t = clamp((c.hz - G) / h, 0, 1); mul(c, 1 - k * (1 - t)); } };
const flaque = (c, scale, thr, s) => { if (c.face !== TOP) return; const p = fbm(c.hx / scale + 3.1, c.hy / scale - 1.7, s, 3); if (p > thr) c.wet = clamp((p - thr) * 12, 0, 1); };
const feuilles = (c, k = 1) => {
  if (c.face !== TOP) return;
  const W = c.W, ix = Math.floor(c.hx), iy = Math.floor(c.hy);
  if (ix < 0 || iy < 0 || ix >= W.X || iy >= W.Y) return;
  const d = W.leaf[iy * W.X + ix] * k; if (d <= 0) return;
  if (hash(c.a, c.b, 913, 5) < d * 0.42) { const v = hash(c.a, c.b, 914, 1); if (v < 0.4) rgb(c, 0.62, 0.42, 0.14); else if (v < 0.7) rgb(c, 0.52, 0.24, 0.10); else rgb(c, 0.40, 0.33, 0.13); c.wet *= 0.3; }
};
// les couleurs des ampoules de guinguette
const AMPOULES = [[1.55, 0.42, 0.26], [1.5, 1.12, 0.36], [0.42, 1.25, 0.52], [0.48, 0.68, 1.55], [1.55, 1.32, 0.95]];

// ================================================================ matières (huit, préfixe « port · »)
// Les pavés de quai : granit gris-bleu, rangs le long de x, joints sombres et mouillés, quelques pavés roses.
M.PORT_PAVE = M.PORT_PAVE || material('port · pavés de quai', c => {
  if (c.face !== TOP) { rgb(c, 0.36, 0.355, 0.36); grain(c, 0.08); return; }
  const row = Math.floor(c.b / 3), off = mod(row * 2, 5);
  const la = mod(c.a + off, 5), lb = mod(c.b, 3);
  const st = hash(Math.floor((c.a + off) / 5), row, 1301, 0);
  const k = 0.31 + st * 0.11;
  let r = k * 0.98, g = k * 0.97, b = k * 1.02;
  if (st > 0.87) { r *= 1.12; g *= 0.98; b *= 0.92; }
  if (la === 4 || lb === 2) { r *= 0.52; g *= 0.52; b *= 0.54; } else if (la === 0 || lb === 0) { r *= 1.1; g *= 1.1; b *= 1.1; }
  rgb(c, r, g, b);
  flaque(c, 9, 0.63, 1303);
  if (c.wet === 0 && (la === 4 || lb === 2)) c.wet = 0.22;
  if (c.W.baseWet) c.wet = Math.max(c.wet, c.W.baseWet * 0.7);
  feuilles(c, 0.7);
});
// Le béton des terre-pleins : dalles, joints de dilatation tous les 4 m, taches d'huile, flaques.
M.PORT_BETON = M.PORT_BETON || material('port · béton de quai', c => {
  if (c.face !== TOP) { const k = 0.47 + 0.07 * fbm(along(c) / 5, c.hz / 4, 1311); rgb(c, k, k * 0.97, k * 0.92); grain(c, 0.05); grime(c, 5, 0.3); return; }
  const k = 0.40 + 0.05 * hash(Math.floor(c.hx / 20), Math.floor(c.hy / 20), 1312, 0) + 0.10 * (fbm(c.hx / 9, c.hy / 9, 1313) - 0.5);
  rgb(c, k, k * 0.98, k * 0.94);
  if (mod(c.a, 40) === 0 || mod(c.b, 40) === 0) mul(c, 0.66);
  const o = fbm(c.hx / 5 + 11, c.hy / 5 - 7, 1314, 3);
  if (o > 0.67) { mul(c, 0.55 + 0.2 * (0.75 - o)); c.wet = 0.35; }
  if (hash(c.a, c.b, 1315, 0) < 0.05) mul(c, 0.85);
  grain(c, 0.04);
  flaque(c, 13, 0.66, 1316);
  if (c.W.baseWet) c.wet = Math.max(c.wet, c.W.baseWet);
  feuilles(c, 0.5);
});
// Le ballast : du concassé gris, des cailloux rouillés.
M.PORT_BALLAST = M.PORT_BALLAST || material('port · ballast', c => {
  const h = hash(c.a, c.b, 1321, c.face);
  const k = 0.27 + 0.17 * h;
  rgb(c, k * 1.03, k * 0.97, k * 0.90);
  if (hash(c.a >> 1, c.b >> 1, 1322, 0) < 0.22) { c.cr *= 1.28; c.cg *= 0.94; c.cb *= 0.72; }
  if (c.face !== TOP) mul(c, 0.78);
});
// Le rail : le champignon poli dessus, l'âme rouillée sur les flancs.
M.PORT_RAIL = M.PORT_RAIL || material('port · rail', c => {
  if (c.face === TOP) { rgb(c, 0.60, 0.61, 0.63); if (hash(c.a, c.b, 1331, 0) < 0.2) mul(c, 0.82); c.wet = 0.3; return; }
  rgb(c, 0.27, 0.17, 0.11); grain(c, 0.12);
});
// Les ampoules de la guinguette, allumées (cinq couleurs tirées par voxel) et éteintes (du verre teinté).
M.PORT_AMPOULES = M.PORT_AMPOULES || material('port · guirlande allumée', c => {
  const e = AMPOULES[Math.floor(hash(c.ix, c.iy, c.iz, 1341) * AMPOULES.length)];
  rgb(c, e[0] * 0.55, e[1] * 0.55, e[2] * 0.55); c.er = e[0]; c.eg = e[1]; c.eb = e[2];
}, { noShadow: true, noAO: true, noAOrecv: true });
M.PORT_AMPOULES_ETEINTES = M.PORT_AMPOULES_ETEINTES || material('port · guirlande éteinte', c => {
  const e = AMPOULES[Math.floor(hash(c.ix, c.iy, c.iz, 1341) * AMPOULES.length)];
  rgb(c, 0.22 + e[0] * 0.28, 0.22 + e[1] * 0.28, 0.22 + e[2] * 0.28); if (c.face === TOP) mul(c, 1.2);
}, { noAO: true });
// Le tube bleu du relais, et le feu vert (capitainerie, signaux).
M.PORT_NEON_BLEU = M.PORT_NEON_BLEU || material('port · néon bleu', c => { rgb(c, 0.45, 0.6, 1.0); c.er = 0.32; c.eg = 0.62; c.eb = 1.45; }, { noShadow: true, noAO: true, noAOrecv: true });
M.PORT_FEU_VERT = M.PORT_FEU_VERT || material('port · feu vert', c => { rgb(c, 0.15, 0.75, 0.35); c.er = 0.12; c.eg = 1.15; c.eb = 0.42; }, { noShadow: true, noAO: true, noAOrecv: true });

// ================================================================ calques (aucun ne coûte de matière)
// La peinture : teinte unie, tôle nervurée, planches, lames, chevrons, panneaux de cale, bandes ;
// rouille, coulures, salissure du bas, lumière propre.
overlay('port_peint', (o, c) => {
  const f = o.col; rgb(c, f[0], f[1], f[2]);
  const al = c.face === LEFT ? Math.floor(2 * c.hx) : c.face === RIGHT ? -Math.floor(2 * c.hy) : Math.floor(2 * (o.axe === 'y' ? c.hy : c.hx));
  const bl = c.face === TOP ? Math.floor(2 * (o.axe === 'y' ? c.hx : c.hy)) : Math.floor(2 * c.hz);
  if (c.face !== TOP) {
    if (o.pat === 'ribs') { const r = mod(al, 3); mul(c, r === 0 ? 1.13 : r === 1 ? 0.98 : 0.78); }
    else if (o.pat === 'planks' && mod(bl, 3) === 0) mul(c, 0.74);
    else if (o.pat === 'lames' && mod(al, 4) === 0) mul(c, 0.72);
  } else if (o.top) rgb(c, o.top[0], o.top[1], o.top[2]); else mul(c, 1.07);
  if (o.pat === 'panneaux' && c.face === TOP && mod(al, 22) === 0) mul(c, 0.55);
  if (o.pat === 'ondes') { const r = mod(al, 3); mul(c, r === 0 ? 1.12 : r === 1 ? 0.98 : 0.8); }
  if (o.pat === 'chevrons' && mod(Math.floor((al + bl) / 3), 2)) rgb(c, 0.09, 0.08, 0.07);
  if (o.pat === 'bandes' && mod(Math.floor(bl / (o.bw || 4)), 2)) { const g = o.col2; rgb(c, g[0], g[1], g[2]); }
  if (o.rust) {
    const n = fbm(c.hx * 0.45 + c.hz * 0.3, c.hy * 0.45 - c.hz * 0.2, 1401 + (o.seed | 0), 3);
    if (n > 1 - o.rust * 0.45) { const t = hash(c.a, c.b, 1402, 0); rgb(c, 0.34 + 0.12 * t, 0.18 + 0.05 * t, 0.10); }
  }
  if (o.streaks && c.face !== TOP && hash(al >> 1, 0, 1403, o.seed | 0) < o.streaks) mul(c, 0.84);
  grain(c, o.grain != null ? o.grain : 0.05);
  if (o.grime) grime(c, 5, o.grime);
  if (o.emit) { c.er = o.emit[0]; c.eg = o.emit[1]; c.eb = o.emit[2]; }
});
// Le conteneur : tôle ondulée sur les longs pans, portes à barres au bout, cadre et montants d'angle,
// toit à ondes ; rouille, coulures depuis le toit, crasse en bas.
overlay('port_cont', (o, c) => {
  const f = o.col, H = o.H, L = o.L, D = 12;
  const lx = c.hx - o.x0, ly = c.hy - o.y0, lz = c.hz - o.z0;
  let k = 1;
  if (c.face === TOP) {
    const tu = Math.floor(2 * (o.ax === 'x' ? lx : ly)), tv = Math.floor(2 * (o.ax === 'x' ? ly : lx));
    if (tu < 1 || tu >= 2 * L - 1 || tv < 1 || tv >= 2 * D - 1) k = 0.7; else if (mod(tu, 6) === 0) k = 0.86;
    k *= 1.06;
  } else {
    const tz = Math.floor(2 * lz), H2 = 2 * H;
    if ((o.ax === 'x') === (c.face === LEFT)) {
      const tu = Math.floor(2 * (o.ax === 'x' ? lx : L - ly));
      if (tu < 2 || tu >= 2 * L - 2) k = 0.62;
      else if (tz < 1 || tz >= H2 - 2) k = 0.68;
      else { const r = mod(tu, 4); k = r === 0 ? 1.12 : r === 1 ? 1.0 : r === 2 ? 0.86 : 0.76; }
    } else {
      const tv = Math.floor(2 * (o.ax === 'x' ? D - ly : lx));
      if (tv < 2 || tv >= 2 * D - 2) k = 0.62;
      else if (tz < 1 || tz >= H2 - 2) k = 0.68;
      else if (o.portes) {
        if (tv === 11 || tv === 12) k = 0.55;
        else if (tv === 5 || tv === 8 || tv === 15 || tv === 18) k = 1.25;
        else if (tz === 6 || tz === H2 - 7) k = 0.8;
        else k = mod(tz, 4) === 0 ? 0.9 : 1.0;
      } else k = mod(tz, 4) === 0 ? 0.82 : 1.0;
    }
  }
  rgb(c, f[0] * k, f[1] * k, f[2] * k);
  const n = fbm(c.hx * 0.7 + c.hz * 0.5, c.hy * 0.7 - c.hz * 0.35, 1411 + (o.seed | 0), 3);
  if (n > 0.77 - (o.rouille || 0) * 0.14) { const t = hash(c.a, c.b, 1412, 0); rgb(c, (0.34 + 0.1 * t) * k, (0.19 + 0.04 * t) * k, 0.11 * k); }
  if (c.face !== TOP) {
    const col = Math.floor(2 * (c.hx - c.hy));
    if (hash(col, 0, 1413, o.seed | 0) < 0.14 && o.z0 + H - c.hz < 2 + 6 * hash(col, 1, 1413, 0)) mul(c, 0.8);
    if (lz < 1) mul(c, 0.82);
  }
  grain(c, 0.035);
});
// La coque : la teinte, le liston sous le plat-bord, l'antifouling à fleur d'eau, les virures, la rouille ;
// dessus, le pont.
overlay('port_coque', (o, c) => {
  if (c.face === TOP) { const p = o.pont; rgb(c, p[0], p[1], p[2]); if (mod(Math.floor(2 * (c.hx + c.hy)), 5) === 0) mul(c, 0.85); grain(c, 0.08); return; }
  const z = c.hz;
  let f = o.col;
  if (z < -6.2) f = [0.34, 0.12, 0.08]; else if (z >= o.zg - 1) f = o.bande;
  rgb(c, f[0], f[1], f[2]);
  if (mod(Math.floor(z * 2), 5) === 0) mul(c, 0.86);
  const n = vnoise(along(c) * 0.9, z * 0.2, 1421 + (o.seed | 0));
  if (n > 0.74) { c.cr = c.cr * 0.6 + 0.16; c.cg = c.cg * 0.6 + 0.08; c.cb = c.cb * 0.6 + 0.04; }
  if (z < -5.5) { c.cr *= 0.8; c.cg *= 0.9; c.cb *= 0.85; }
  grain(c, 0.05);
});
// Un texte peint (ou en tubes) par-dessus une surface : la surface garde sa matière et son calque (dessous).
overlay('port_texte', (o, c) => {
  if (o.under) { const f = OVERLAYS[o.under.type]; if (f) f(o.under, c); }
  if (c.face !== o.face) return;
  const la = o.face === LEFT ? Math.floor(2 * c.hx) - 2 * o.a0 : 2 * o.a0 - 1 - Math.floor(2 * c.hy);
  const lt = 2 * o.zTop - 1 - Math.floor(2 * c.hz);
  if (la < 0 || lt < 0) return;
  const sc = o.scale || 1;
  if (!o.bmp.at(Math.floor(la / sc), Math.floor(lt / sc))) return;
  if (o.worn && hash(la, lt, 1431, o.seed | 0) < o.worn) return;
  const f = o.fg; rgb(c, f[0], f[1], f[2]);
  if (o.emit) { c.er = o.emit[0]; c.eg = o.emit[1]; c.eb = o.emit[2]; } else { c.er = c.eg = c.eb = 0; }
});
// Le vrac : sable, gravier, concassé, charbon, grain.
overlay('port_vrac', (o, c) => {
  const f = o.col, h = hash(c.a, c.b, 1441, c.face), n = fbm(c.hx / 3, c.hy / 3 + c.hz / 2, 1442, 2);
  let k = 0.82 + 0.3 * n; if (h < 0.15) k *= 0.78; else if (h > 0.9) k *= 1.18;
  rgb(c, f[0] * k, f[1] * k, f[2] * k);
  if (o.galets && hash(c.a >> 1, c.b >> 1, 1443, 0) < 0.25) mul(c, 0.72);
  if (c.face !== TOP) mul(c, 0.86);
});
// Les reflets des lumières du quartier sur l'eau : une traînée de tirets qui tremblent sous chaque lampe,
// là où le rayon réfléchi irait la chercher (comme les GLINTS de zone.js pour la Rive de la ville).
overlay('port_reflets', (o, c) => {
  if (c.face !== TOP) return;
  const d = c.hx - c.hy, sum = c.hx + c.hy;
  for (const g of o.glints) {
    const dd = d - g.d, ds = sum - g.s;
    if (dd > 6 || dd < -6 || ds > g.len || ds < -g.len) continue;
    const row = Math.floor(ds), fade = 1 - Math.abs(ds) / g.len;
    if ((row & 1) || hash(row, g.id, 7, 3) < 0.22) continue;
    const hw = 0.5 + fade * (0.6 + 2.4 * hash(row, g.id, 5, 3)), off = (hash(row, g.id, 6, 3) - 0.5) * 1.6;
    if (Math.abs(dd - off) > hw) continue;
    const e = g.k * (0.25 + 0.75 * fade) * (0.6 + 0.4 * hash(row, g.id, 8, 3));
    c.er += g.c[0] * e; c.eg += g.c[1] * e; c.eb += g.c[2] * e;
  }
});
// L'échelle de crue peinte sur le mur du quai : graduations tous les 10 cm, un trait rouge par mètre.
overlay('port_echelle', (o, c) => {
  if (c.face !== LEFT) return;
  const la = Math.floor(2 * c.hx) - 2 * o.a0, tz = Math.floor(2 * c.hz);
  if (la < 0 || la > 3) return;
  rgb(c, 0.82, 0.80, 0.74);
  if (la === 0 || la === 3 || (la === 1 && mod(tz, 2) === 0)) rgb(c, 0.12, 0.12, 0.13);
  if (mod(tz, 10) === 0) rgb(c, 0.62, 0.12, 0.10);
});

// ================================================================ outils
function ligne(W, x0, y0, z0, x1, y1, z1, m, t = 0, ep = 0) {
  const n = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0)) * 1.3));
  for (let i = 0; i <= n; i++) {
    const x = Math.round(x0 + (x1 - x0) * i / n), y = Math.round(y0 + (y1 - y0) * i / n), z = Math.round(z0 + (z1 - z0) * i / n);
    if (ep) W.box(x, y, z, x + ep, y + ep, z + ep, m, t); else W.set(x, y, z, m, t);
  }
}
function cylindre(W, cx, cy, r, z0, z1, m, t = 0, ep = 0) {
  for (let y = Math.floor(cy - r) - 1; y <= Math.ceil(cy + r); y++) for (let x = Math.floor(cx - r) - 1; x <= Math.ceil(cx + r); x++) {
    const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
    if (d < r && (!ep || d >= r - ep)) W.box(x, y, z0, x + 1, y + 1, z1, m, t);
  }
}
// Un repère local pour ce qui se pose le long de x ou de y (bateaux, camions, wagons) :
// s le long (0 au bout « avant »), t en travers (0 côté −y ou −x, D − 1 côté visible).
function repere(W, ax, x0, y0, L, D, inv) {
  const P = (s, t) => { const ss = inv ? L - 1 - s : s; return ax === 'x' ? [x0 + ss, y0 + t] : [x0 + t, y0 + ss]; };
  return {
    P,
    set(s, t, z, m, tg = 0) { const [x, y] = P(s, t); W.set(x, y, z, m, tg); },
    box(s0, t0, z0, s1, t1, z1, m, tg = 0) {
      if (s1 <= s0 || t1 <= t0 || z1 <= z0) return;
      const [xa, ya] = P(s0, t0), [xb, yb] = P(s1 - 1, t1 - 1);
      W.box(Math.min(xa, xb), Math.min(ya, yb), z0, Math.max(xa, xb) + 1, Math.max(ya, yb) + 1, z1, m, tg);
    },
  };
}
const largeur = (texte, sc = 1) => Math.ceil(textBitmap(texte).w * sc / 2);
// Écrit un texte sur la face visible d'un volume. LEFT : le plan y = plan, de x = debut vers +x ;
// RIGHT : le plan x = plan, de y = debut vers −y. o.prof : chercher la surface jusqu'à prof voxels
// derrière le plan (une cuve, une cellule de silo).
function ecrire(W, face, plan, debut, zTop, texte, o = {}) {
  const bmp = textBitmap(texte), sc = o.scale || 1;
  const nw = Math.ceil(bmp.w * sc / 2), nh = Math.ceil(bmp.h * sc / 2), prof = o.prof || 1;
  const a0 = face === LEFT ? debut : debut + 1;
  const par = new Map();
  for (let i = 0; i < nw; i++) for (let z = zTop - nh; z < zTop; z++) {
    for (let d = 0; d < prof; d++) {
      const x = face === LEFT ? debut + i : plan - d, y = face === LEFT ? plan - d : debut - i;
      if (!W.get(x, y, z)) continue;
      const kk = W.idx(x, y, z), cur = W.tag[kk];
      let id = par.get(cur);
      if (id == null) {
        id = W.obj(Object.assign({ fg: [0.85, 0.82, 0.72] }, o, { type: 'port_texte', face, a0, zTop, bmp, scale: sc, under: cur ? W.objects[cur] : null }));
        par.set(cur, id);
      }
      W.tag[kk] = id;
      break;
    }
  }
  return nw;
}
// Des lettres en tubes, une par objet : allumée, faible ou morte (o.etats), la nuit seulement (o.on).
function neon(W, face, plan, debut, zTop, texte, o) {
  const sc = o.scale || 2;
  let off = 0;
  [...texte].forEach((ch, i) => {
    if (ch === ' ') { off += 2; return; }
    const st = (o.etats && o.etats[i]) || 'on';
    const lit = o.on && (st === 'on' || st === 'dim');
    const kk = st === 'dim' ? 0.4 : 1;
    const fg = lit ? o.col.map(v => Math.min(1, v * 0.55 + 0.3)) : st === 'gone' ? [0.10, 0.09, 0.10] : [0.52, 0.49, 0.50];
    const d = Math.round(off * sc / 2);
    ecrire(W, face, plan, face === LEFT ? debut + d : debut - d, zTop, ch, { scale: sc, fg, emit: lit ? o.col.map(v => v * kk) : null });
    off += textBitmap(ch).w + 1;
  });
}

// ================================================================ petits objets
function bitte(W, x, y, tag) { W.box(x, y, G, x + 2, y + 2, G + 2, M.METAL_DARK); W.box(x, y, G + 2, x + 2, y + 2, G + 3, M.METAL_DARK, tag); }
function palette(W, x, y, z, ax = 'x') {
  const [w, d] = ax === 'x' ? [6, 4] : [4, 6];
  W.box(x, y, z, x + w, y + d, z + 1, M.WOOD);
  for (let i = 1; i < (ax === 'x' ? d : w) - 1; i += 2) if (ax === 'x') W.box(x + 1, y + i, z, x + w - 1, y + i + 1, z + 1, 0); else W.box(x + i, y + 1, z, x + i + 1, y + d - 1, z + 1, 0);
  return [w, d];
}
function fut(W, x, y, z, m, tag = 0, h = 4) {
  W.box(x + 1, y, z, x + 2, y + 3, z + h, m, tag); W.box(x, y + 1, z, x + 3, y + 2, z + h, m, tag);
  W.box(x + 1, y + 1, z + h, x + 2, y + 2, z + h + 1, M.METAL_DARK);
}
function bigbag(W, x, y, z, tag) {
  W.box(x, y, z, x + 5, y + 5, z + 5, M.CANVAS, tag);
  for (const [a, b] of [[0, 0], [4, 0], [0, 4], [4, 4]]) W.set(x + a, y + b, z + 5, M.CANVAS, tag);
}
function caisse(W, x, y, z, w, d, h) { W.box(x, y, z, x + w, y + d, z + h, M.WOOD); W.box(x, y, z + h - 1, x + w, y + d, z + h, M.WOOD_DARK); }
function pneus(W, x, y, z, n) {
  for (let k = 0; k < n; k++) for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const d = Math.hypot(dx, dy); if (d > 1.2 && d < 2.6) W.set(x + dx, y + dy, z + k, M.TIRE); }
}
// Le grillage : poteaux tous les 10, maille en losange, fil du haut, barbelés ; o.trous : [début, fin) sans grillage.
function grillage(W, x0, y0, x1, y1, h = 11, o = {}) {
  const alongX = y1 - y0 <= 1, n = alongX ? x1 - x0 : y1 - y0;
  for (let i = 0; i < n; i++) {
    if (o.trous && o.trous.some(([a, b]) => i >= a && i < b)) continue;
    const x = alongX ? x0 + i : x0, y = alongX ? y0 : y0 + i;
    if (i % 10 === 0) { W.box(x, y, G, x + 1, y + 1, G + h + 2, M.METAL_DARK); continue; }
    for (let z = G + 1; z < G + h; z++) if (mod(i + z, 4) === 0 || mod(i - z, 4) === 0) W.set(x, y, z, M.METAL);
    W.set(x, y, G + h, M.METAL); W.set(x, y, G, M.METAL_DARK);
    if (o.barbele && i % 2 === 0) W.set(x, y, G + h + 1, M.METAL_DARK);
  }
}
// Le mât d'éclairage : massif, fût, échelons, plateforme et couronne de projecteurs tournés vers la cible.
function projecteur(k, x, y, h, cible, o = {}) {
  const { W } = k;
  const on = k.night && o.on !== false;
  W.box(x - 1, y - 1, G, x + 3, y + 3, G + 2, M.CONCRETE);
  W.box(x, y, G, x + 2, y + 2, G + h, M.METAL);
  for (let z = G + 5; z < G + h - 3; z += 3) W.set(x + 2, y + 1, z, M.METAL_DARK);
  const tz = G + h;
  W.box(x - 2, y - 2, tz, x + 4, y + 4, tz + 1, M.METAL_DARK);
  const dx = cible[0] - x - 1, dy = cible[1] - y - 1, dl = Math.hypot(dx, dy) || 1, ux = dx / dl, uy = dy / dl;
  for (let i = -1; i <= 1; i++) {
    const px = Math.round(x + 0.5 + ux * 2.5 - uy * i * 2.2), py = Math.round(y + 0.5 + uy * 2.5 + ux * i * 2.2);
    W.box(px, py, tz + 1, px + 2, py + 2, tz + 3, on ? M.FLOOD : M.FLOOD_OFF);
    W.box(px, py, tz + 3, px + 2, py + 2, tz + 4, M.METAL_DARK);
  }
  if (on) {
    const lx = x + 1 + ux * 3, ly = y + 1 + uy * 3, lz = tz + 2;
    const ax = cible[0] - lx, ay = cible[1] - ly, az = (cible[2] != null ? cible[2] : G) - lz, al = Math.hypot(ax, ay, az);
    const c = o.col || [1.0, 0.86, 0.62], I = o.I || 1.0;
    W.light({ x: lx, y: ly, z: lz, r: o.r || 150, fall: 1.4, cr: c[0] * I, cg: c[1] * I, cb: c[2] * I, skip: 4, axis: [ax / al, ay / al, az / al], c0: 0.30, c1: 0.78, spill: 0.06 });
  }
}

// ================================================================ les bateaux
// La péniche, le long de x (on voit le flanc +y) ou de y (le flanc +x). o : ax, x0, y0, L, D, proue
// ('debut' : vers −x/−y, 'fin'), zg (le plat-bord), coque, bande, nom, charge ('couvert', 'vrac',
// 'ferraille', 'conteneurs', 'vide', 'guinguette'), logement (la longueur de l'arrière habité).
function peniche(k, o) {
  const { W, night, bad } = k;
  const L = o.L, D = o.D || 20, zg = o.zg != null ? o.zg : -1, zb = -8, seed = o.seed || 1;
  const F = repere(W, o.ax, o.x0, o.y0, L, D, o.proue === 'fin');
  const coque = W.obj({ type: 'port_coque', col: o.coque, bande: o.bande, pont: o.pont || [0.30, 0.24, 0.17], zg, seed });
  const dedans = W.obj({ type: 'port_peint', col: [0.30, 0.21, 0.15], rust: 0.6, top: o.pont || [0.30, 0.24, 0.17], seed: seed + 1 });
  const ins = s => s < 12 ? Math.round(6.5 * Math.pow(1 - s / 12, 1.8)) : s > L - 5 ? Math.round(2.5 * Math.pow((s - (L - 5)) / 5, 2)) : 0;
  for (let s = 0; s < L; s++) { const i = ins(s); F.box(s, i, zb, s + 1, D - i, zg + (s < 10 ? 1 : 0), M.HULL, coque); }
  const LOG = o.logement || 36, h0 = 13, h1 = L - LOG;
  // la cale, son hiloire ; le dedans des bordés qu'on voit
  F.box(h0, 3, zg - 5, h1, D - 3, zg, 0);
  F.box(h0, 0, zg - 5, h1, 3, zg, M.HULL, dedans); F.box(h0 - 1, 3, zg - 5, h0, D - 3, zg, M.HULL, dedans); F.box(h1, 3, zg - 5, h1 + 1, D - 3, zg, M.HULL, dedans);
  const hil = W.obj({ type: 'port_peint', col: o.hiloire || [0.18, 0.18, 0.19], rust: 0.3, seed: seed + 2 });
  F.box(h0 - 1, 2, zg, h1 + 1, 3, zg + 2, M.METAL, hil); F.box(h0 - 1, D - 3, zg, h1 + 1, D - 2, zg + 2, M.METAL, hil);
  F.box(h0 - 1, 2, zg, h0, D - 2, zg + 2, M.METAL, hil); F.box(h1, 2, zg, h1 + 1, D - 2, zg + 2, M.METAL, hil);
  const ch = o.charge || 'couvert';
  if (ch === 'couvert') {
    const pan = W.obj({ type: 'port_peint', col: o.couvercle || [0.24, 0.34, 0.28], pat: 'panneaux', axe: o.ax, rust: 0.2, seed: seed + 3 });
    const mid = (D - 1) / 2, hw = (D - 6) / 2;
    for (let t = 3; t < D - 3; t++) F.box(h0, t, zg - 1, h1, t + 1, zg + 2 + Math.round(2.5 * (1 - Math.abs(t - mid) / hw)), M.METAL, pan);
  } else if (ch === 'vrac' || ch === 'grain') {
    const vr = W.obj({ type: 'port_vrac', col: o.vrac || [0.76, 0.62, 0.34], galets: ch === 'vrac' });
    for (let s = h0; s < h1; s++) for (let t = 3; t < D - 3; t++) {
      const ds = Math.min(s - h0, h1 - 1 - s), dt = Math.min(t - 3, D - 4 - t);
      const hh = Math.min(6, Math.floor(Math.min(ds * 0.5, dt * 0.8) + 2 * fbm(s / 5, t / 5, seed + 9)));
      F.box(s, t, zg - 5, s + 1, t + 1, zg - 3 + hh, M.GRAVEL, vr);
    }
  } else if (ch === 'ferraille') {
    for (let s = h0; s < h1; s++) for (let t = 3; t < D - 3; t++) {
      const hh = Math.floor(2 + 5 * fbm(s / 4, t / 4, seed + 7) + 2 * hash(s, t, seed, 5));
      for (let z = zg - 5; z < zg - 4 + hh; z++) { const v = hash(s, t, z, seed + 6); F.set(s, t, z, v < 0.55 ? M.FRI_ROUILLE : v < 0.8 ? M.METAL_DARK : v < 0.9 ? M.METAL : M.CAR_BLUE); }
    }
  } else if (ch === 'guinguette' || ch === 'conteneurs') {
    F.box(h0, 3, zg - 1, h1, D - 3, zg, ch === 'guinguette' ? M.WOOD : M.METAL_DARK);
  }
  // le logement, la timonerie, le mât, le pavillon
  const cab = W.obj({ type: 'port_peint', col: o.cabine || [0.80, 0.78, 0.70], pat: 'planks', grime: 0.2, seed: seed + 4 });
  const s0 = h1 + 2, s1 = L - 3;
  F.box(s0, 3, zg, s1, D - 3, zg + 6, M.WOOD, cab);
  F.box(s0 - 1, 2, zg + 6, s1 + 1, D - 2, zg + 7, M.WOOD_DARK);
  const tw0 = s0 + 1, tw1 = s0 + 11;
  F.box(tw0, 5, zg + 7, tw1, D - 5, zg + 14, M.WOOD, cab);
  F.box(tw0 - 1, 4, zg + 14, tw1 + 1, D - 4, zg + 15, M.WOOD_DARK);
  // les fenêtres sur le flanc visible et la timonerie
  const fac = (t) => o.ax === 'x' ? new Facade(W, LEFT, o.x0, o.y0, L, t + 1) : new Facade(W, RIGHT, o.x0, o.y0, t + 1, L);
  const fs = (s, w, t) => { const [xa, ya] = F.P(s, t), [xb, yb] = F.P(s + w - 1, t); return o.ax === 'x' ? Math.min(xa, xb) - o.x0 : o.y0 + L - 1 - Math.max(ya, yb); };
  const fl = fac(D - 4), ft = fac(D - 6);
  const lumiere = o.allume != null ? o.allume : night && !bad;
  for (let s = s0 + 13; s + 4 < s1; s += 7) fl.window(fs(s, 4, D - 4), zg + 2, 4, 3, { state: lumiere && hash(s, seed, 3, 1) < 0.7 ? 'lit' : 'dark', sill: false, lintel: false, frame: [0.25, 0.22, 0.18], curtain: [0.62, 0.30, 0.22], spill: false });
  ft.window(fs(tw0 + 1, 8, D - 6), zg + 9, 8, 4, { state: lumiere ? 'lit' : 'dark', sill: false, lintel: false, frame: [0.85, 0.84, 0.80], col: [0.95, 0.85, 0.6], spill: false });
  const [mx, my] = F.P(tw0 + 5, Math.floor(D / 2));
  W.box(mx, my, zg + 15, mx + 1, my + 1, zg + 23, M.METAL_DARK);
  W.set(mx, my, zg + 23, night ? M.BULB : M.WHITE);
  if (night) W.light({ x: mx + 0.5, y: my + 0.5, z: zg + 23, r: 12, cr: 0.9, cg: 0.75, cb: 0.5, shadow: false });
  const [px, py] = F.P(L - 2, Math.floor(D / 2));
  W.box(px, py, zg + 7, px + 1, py + 1, zg + 15, M.METAL_DARK);
  F.box(L - 2, Math.floor(D / 2) + 1, zg + 11, L - 1, Math.floor(D / 2) + 5, zg + 15, M.FLAG);
  // la voiture du marinier, sur le toit du logement, derrière la timonerie
  if (o.voiture && s1 - tw1 >= 20) {
    const [ca, cb] = F.P(tw1 + 1, 6), [cc, cd] = F.P(tw1 + 19, 13);
    B.car(W, Math.min(ca, cc), Math.min(cb, cd), zg + 7, o.ax, o.voiture);
  }
  // des pots de fleurs sur le toit, côté visible
  if (o.fleurs !== false) for (let s = s0; s < s1; s += 3) if (hash(s, seed, 11, 2) < 0.6) { F.set(s, D - 3, zg + 7, M.HEDGE); if (hash(s, seed, 12, 2) < 0.5) F.set(s, D - 3, zg + 8, hash(s, 1, 13, 2) < 0.5 ? M.PLASTIC_RED : M.WHITE); }
  // la proue : le guindeau, le mât de proue
  F.box(4, 7, zg + 1, 8, D - 7, zg + 3, M.METAL_DARK);
  const [bx, by] = F.P(2, Math.floor(D / 2));
  W.box(bx, by, zg + 1, bx + 1, by + 1, zg + 10, M.METAL_DARK); W.set(bx, by, zg + 10, night ? M.BULB : M.WHITE);
  if (night) W.light({ x: bx + 0.5, y: by + 0.5, z: zg + 10, r: 10, cr: 0.9, cg: 0.75, cb: 0.5, shadow: false });
  // les pneus le long du flanc visible
  for (let s = 16; s < L - 8; s += 14) F.set(s, D, zg - 2, M.TIRE), F.set(s, D, zg - 3, M.TIRE);
  // le nom, sur le flanc, vers la proue et à la poupe
  if (o.nom) {
    const nw = largeur(o.nom);
    for (const sc of [30, L - 14]) {
      if (sc === L - 14 && L < 90) continue;
      const [xc, yc] = F.P(sc, D - 1);
      if (o.ax === 'x') ecrire(W, LEFT, o.y0 + D - 1, xc - (nw >> 1), zg - 1, o.nom, { fg: [0.86, 0.84, 0.76] });
      else ecrire(W, RIGHT, o.x0 + D - 1, yc + (nw >> 1), zg - 1, o.nom, { fg: [0.86, 0.84, 0.76] });
    }
  }
  if (lumiere) { const [lx, ly] = F.P(s0 - 1, D - 2); W.light({ x: lx + 0.5, y: ly + 0.5, z: zg + 5, r: 24, cr: 0.75, cg: 0.52, cb: 0.26, shadow: false }); }
  return { F, h0, h1, s0, s1, zg, L, D };
}
// La barge de poussage : un caisson à bec relevé, une cale de vrac ou vide.
function barge(k, o) {
  const { W } = k;
  const L = o.L, D = o.D, zg = o.zg != null ? o.zg : -2;
  const F = repere(W, 'y', o.x0, o.y0, L, D, false);
  const coque = W.obj({ type: 'port_coque', col: [0.13, 0.13, 0.14], bande: [0.62, 0.46, 0.14], pont: [0.30, 0.22, 0.15], zg, seed: o.seed || 3 });
  for (let s = 0; s < L; s++) F.box(s, 0, -8 + Math.max(0, 5 - s), s + 1, D, zg, M.HULL, coque);
  F.box(5, 2, zg - 4, L - 3, D - 2, zg, 0);
  const hil = W.obj({ type: 'port_peint', col: [0.36, 0.22, 0.13], rust: 0.7, seed: (o.seed || 3) + 1 });
  F.box(5, 0, zg - 4, L - 3, 2, zg, M.HULL, hil); F.box(4, 2, zg - 4, 5, D - 2, zg, M.HULL, hil);
  F.box(4, 1, zg, L - 2, 2, zg + 1, M.METAL, hil); F.box(4, D - 2, zg, L - 2, D - 1, zg + 1, M.METAL, hil);
  F.box(4, 1, zg, 5, D - 1, zg + 1, M.METAL, hil); F.box(L - 3, 1, zg, L - 2, D - 1, zg + 1, M.METAL, hil);
  if (o.vrac) {
    const vr = W.obj({ type: 'port_vrac', col: o.vrac, galets: o.galets });
    for (let s = 5; s < L - 3; s++) for (let t = 2; t < D - 2; t++) {
      const d = Math.hypot((s - (L / 2)) / (L / 2 - 5), (t - D / 2 + 0.5) / (D / 2 - 2));
      const hh = Math.round(9 * Math.max(0, 1 - d * d) + 1.5 * fbm(s / 4, t / 4, 77));
      F.box(s, t, zg - 4, s + 1, t + 1, zg - 3 + hh, M.GRAVEL, vr);
    }
  }
  if (o.num) { const [xc, yc] = F.P(12, D - 1); ecrire(W, RIGHT, o.x0 + D - 1, yc + 3, zg - 1, o.num, { fg: [0.80, 0.70, 0.30], scale: 1 }); }
}
// Le pousseur : la face de poussée vers −y, la timonerie haute pour voir par-dessus les barges.
function pousseur(k, x0, y0) {
  const { W, night, bad } = k;
  const L = 32, D = 26, zg = 0;
  const F = repere(W, 'y', x0, y0, L, D, false);
  const coque = W.obj({ type: 'port_coque', col: [0.12, 0.18, 0.30], bande: [0.82, 0.80, 0.74], pont: [0.36, 0.13, 0.12], zg, seed: 61 });
  for (let s = 0; s < L; s++) { const i = s > L - 6 ? Math.round(3 * Math.pow((s - (L - 6)) / 6, 2)) : 0; F.box(s, i, -8, s + 1, D - i, zg, M.HULL, coque); }
  F.box(0, 3, zg, 2, 7, zg + 6, M.TIRE); F.box(0, D - 7, zg, 2, D - 3, zg + 6, M.TIRE);
  F.box(2, 3, zg, 4, 7, zg + 7, M.METAL_DARK); F.box(2, D - 7, zg, 4, D - 3, zg + 7, M.METAL_DARK);
  const blanc = W.obj({ type: 'port_peint', col: [0.82, 0.81, 0.76], grime: 0.25, seed: 62 });
  F.box(10, 3, zg, L - 3, D - 3, zg + 8, M.METAL, blanc);
  F.box(9, 2, zg + 8, L - 2, D - 2, zg + 9, M.METAL_DARK);
  for (const t of [9, D - 10]) F.box(12, t, zg + 9, 14, t + 2, zg + 22, M.METAL_DARK);
  F.box(8, 6, zg + 22, 20, D - 6, zg + 29, M.METAL, blanc);
  F.box(7, 5, zg + 29, 21, D - 5, zg + 30, M.METAL_DARK); F.box(8, 6, zg + 30, 20, D - 6, zg + 31, M.METAL, blanc);
  const fr = new Facade(W, RIGHT, x0, y0, D - 6, L);
  fr.window(L - 19, zg + 24, 4, 4, { state: night && !bad ? 'office' : 'dark', sill: false, lintel: false, frame: [0.85, 0.84, 0.80], spill: false });
  fr.window(L - 14, zg + 24, 4, 4, { state: night && !bad ? 'office' : 'dark', sill: false, lintel: false, frame: [0.85, 0.84, 0.80], spill: false });
  const fl = new Facade(W, LEFT, x0, y0, D, 20);
  for (const sx of [7, 12]) fl.window(sx, zg + 24, 4, 4, { state: night && !bad ? 'office' : 'dark', sill: false, lintel: false, frame: [0.85, 0.84, 0.80], spill: false });
  const rouge = k.peint([0.58, 0.14, 0.12]);
  for (const t of [5, D - 7]) { F.box(L - 8, t, zg + 9, L - 6, t + 2, zg + 21, M.METAL_DARK); F.box(L - 8, t, zg + 18, L - 6, t + 2, zg + 20, M.METAL, rouge); }
  F.box(14, 12, zg + 30, 15, 13, zg + 37, M.METAL_DARK); F.set(14, 12, zg + 37, night ? M.BULB : M.WHITE);
  if (night) W.light({ x: x0 + 12.5, y: y0 + 14.5, z: zg + 37, r: 12, cr: 0.9, cg: 0.75, cb: 0.5, shadow: false });
  ecrire(W, RIGHT, x0 + D - 1, y0 + 24, zg - 1, 'LE COLOSSE', { fg: [0.86, 0.84, 0.78] });
  if (night && !bad) W.light({ x: x0 + D / 2, y: y0 + 14, z: zg + 27, r: 30, cr: 0.5, cg: 0.55, cb: 0.5, shadow: false });
}

// ================================================================ les véhicules
// Le conteneur : 12 de large, 13 de haut (ou 14 pour un « high cube »), 30 ou 61 de long.
function conteneur(k, x, y, z, ax, len, col, o = {}) {
  const { W } = k;
  const H = o.H || 13;
  const id = W.obj({ type: 'port_cont', col, ax, x0: x, y0: y, z0: z, L: len, H, portes: o.portes !== false, seed: o.seed != null ? o.seed : (x * 7 + y * 13 + z) | 0, rouille: o.rouille || 0 });
  if (ax === 'x') W.box(x, y, z, x + len, y + 12, z + H, M.METAL, id); else W.box(x, y, z, x + 12, y + len, z + H, M.METAL, id);
  return id;
}
const CONT = [[0.52, 0.16, 0.12], [0.18, 0.30, 0.48], [0.22, 0.36, 0.26], [0.60, 0.60, 0.56], [0.70, 0.40, 0.14], [0.68, 0.58, 0.22], [0.36, 0.24, 0.18], [0.76, 0.74, 0.68], [0.30, 0.32, 0.36], [0.46, 0.12, 0.18], [0.20, 0.42, 0.44]];
// Le semi-remorque : tracteur à cabine avancée, remorque bâchée, frigorifique, porte-conteneur, citerne ;
// sens +1 : la calandre vers +x/+y (on la voit), −1 : l'arrière vers +x/+y.
function camion(k, x, y, ax, sens, o = {}) {
  const { W, night } = k;
  const L = o.L || 92, D = 12;
  const F = repere(W, ax, x, y, L, D, sens > 0);
  const tracteur = o.attelee !== false;
  if (tracteur) {
    const cab = k.peint(o.cab || [0.55, 0.12, 0.10], { grain: 0.03 });
    for (const s0 of [4, 20]) for (const t0 of [0, D - 1]) F.box(s0, t0, 0, s0 + 5, t0 + 1, 5, M.TIRE);
    F.box(0, 1, 2, 28, D - 1, 5, M.METAL_DARK);
    F.box(0, 0, 4, 12, D, 19, M.METAL, cab);
    F.box(0, 1, 11, 1, D - 1, 17, M.CAR_GLASS);
    F.box(2, 0, 12, 9, 1, 17, M.CAR_GLASS); F.box(2, D - 1, 12, 9, D, 17, M.CAR_GLASS);
    F.box(0, 2, 5, 1, D - 2, 9, M.METAL_DARK);
    const ph = o.phares && night;
    F.box(0, 1, 6, 1, 3, 7, ph ? M.HEADLIGHT : M.WHITE); F.box(0, D - 3, 6, 1, D - 1, 7, ph ? M.HEADLIGHT : M.WHITE);
    F.box(0, 0, 2, 1, D, 4, M.METAL_DARK);
    F.box(3, 0, 19, 12, D, 21, M.METAL, cab);
    F.box(12, 0, 5, 13, 1, 23, M.CHROME); F.box(13, 0, 3, 19, 1, 6, M.CHROME); F.box(13, D - 1, 3, 19, D, 6, M.CHROME);
    F.box(18, 2, 5, 26, D - 2, 6, M.METAL_DARK);
    if (o.cabineAllumee && night) F.box(2, D - 1, 12, 9, D, 17, M.SKYLIGHT);
    if (ph) { const [hx, hy] = F.P(-1, D >> 1); W.light({ x: hx + 0.5, y: hy + 0.5, z: 6, r: 70, fall: 1.5, cr: 1.0, cg: 0.95, cb: 0.8, axis: ax === 'x' ? [sens, 0, -0.15] : [0, sens, -0.15], c0: 0.8, c1: 0.96, spill: 0, skip: 1 }); }
  }
  const r = o.remorque === undefined ? 'bache' : o.remorque;
  if (r) {
    F.box(24, 1, 5, L, D - 1, 7, M.METAL_DARK);
    for (const s0 of [L - 22, L - 15, L - 8]) for (const t0 of [0, D - 1]) F.box(s0, t0, 0, s0 + 5, t0 + 1, 5, M.TIRE);
    if (!tracteur) { F.box(32, 2, 0, 34, 3, 5, M.METAL_DARK); F.box(32, D - 3, 0, 34, D - 2, 5, M.METAL_DARK); }
    if (r === 'bache') {
      F.box(24, 0, 7, L, D, 21, M.TARP, k.peint(o.bache || [0.30, 0.38, 0.50], { pat: 'lames', grime: 0.15 }));
      F.box(24, 0, 21, L, D, 22, M.METAL_DARK);
    } else if (r === 'frigo') {
      F.box(24, 0, 7, L, D, 21, M.PLASTIC_WHITE, k.peint([0.80, 0.80, 0.76], { grime: 0.3 }));
      F.box(24, 2, 10, 26, D - 2, 19, M.METAL_DARK);
    } else if (r === 'conteneur') {
      const [xa, ya] = F.P(26, 0), [xb, yb] = F.P(86, D - 1);
      conteneur(k, Math.min(xa, xb), Math.min(ya, yb), 7, ax, 61, o.cont || CONT[3], { portes: true });
    } else if (r === 'benne') {
      const bn = k.peint([0.62, 0.40, 0.14], { rust: 0.45, seed: x + y });
      F.box(24, 0, 7, L, D, 17, M.METAL, bn); F.box(25, 1, 9, L - 1, D - 1, 17, 0);
      const vr = W.obj({ type: 'port_vrac', col: [0.80, 0.66, 0.40] });
      for (let s = 25; s < L - 1; s++) for (let t = 1; t < D - 1; t++) { const hh = Math.round(5 + 4 * Math.sin(Math.PI * (s - 25) / (L - 26)) * Math.sin(Math.PI * t / (D - 1))); F.box(s, t, 9, s + 1, t + 1, 9 + hh, M.GRAVEL, vr); }
      for (let s = 28; s < L - 2; s += 8) F.box(s, D - 1, 7, s + 1, D, 17, M.METAL_DARK);
    } else if (r === 'citerne') {
      const cit = k.peint(o.citerne || [0.70, 0.70, 0.68], { rust: 0.1 });
      for (let s = 26; s < L - 1; s++) for (let t = 0; t < D; t++) for (let z = 7; z < 20; z++) if (Math.hypot(t - 5.5, z - 13) < 6.3) F.set(s, t, z, M.METAL, cit);
      for (let s = 40; s < L - 4; s += 16) F.box(s, 4, 19, s + 3, 8, 21, M.METAL_DARK);
    }
    F.box(L - 1, 1, 6, L, 3, 8, M.PLASTIC_RED); F.box(L - 1, D - 3, 6, L, D - 1, 8, M.PLASTIC_RED);
  }
  if (o.texte && r && r !== 'conteneur') {
    const nw = largeur(o.texte);
    const [xa, ya] = F.P(57, D - 1);
    if (ax === 'x') ecrire(W, LEFT, y + D - 1, xa - (nw >> 1), 17, o.texte, { fg: o.texteCol || [0.86, 0.84, 0.78] });
    else ecrire(W, RIGHT, x + D - 1, ya + (nw >> 1), 17, o.texte, { fg: o.texteCol || [0.86, 0.84, 0.78] });
  }
}
// Le wagon, sur une voie le long de x (axe yc, rails à yc − 3 et yc + 4, dessus des rails à zr).
function wagon(k, x, yc, type, o = {}) {
  const { W } = k;
  const L = o.L || 46, zr = o.zr != null ? o.zr : 3, y0 = yc - 6, D = 14;
  const F = repere(W, 'x', x, y0, L, D, false);
  for (const s0 of [5, L - 13]) { F.box(s0, 2, zr, s0 + 8, 4, zr + 3, M.METAL_DARK); F.box(s0, D - 4, zr, s0 + 8, D - 2, zr + 3, M.METAL_DARK); F.box(s0 + 1, 3, zr - 1, s0 + 3, 4, zr + 2, M.TIRE); F.box(s0 + 5, 3, zr - 1, s0 + 7, 4, zr + 2, M.TIRE); }
  F.box(0, 1, zr + 3, L, D - 1, zr + 5, M.METAL_DARK);
  F.box(-1, 2, zr + 3, 0, 4, zr + 5, M.METAL); F.box(-1, D - 4, zr + 3, 0, D - 2, zr + 5, M.METAL);
  F.box(L, 2, zr + 3, L + 1, 4, zr + 5, M.METAL); F.box(L, D - 4, zr + 3, L + 1, D - 2, zr + 5, M.METAL);
  const z0 = zr + 5;
  if (type === 'couvert') {
    const p = k.peint(o.col || [0.42, 0.20, 0.13], { pat: 'lames', rust: 0.3, seed: x });
    F.box(0, 0, z0, L, D, z0 + 15, M.WOOD, p);
    F.box(0, 1, z0 + 15, L, D - 1, z0 + 16, M.METAL_DARK); F.box(0, 3, z0 + 16, L, D - 3, z0 + 17, M.METAL_DARK);
    F.box((L >> 1) - 6, D - 1, z0 + 1, (L >> 1) + 6, D, z0 + 14, M.WOOD_DARK);
    F.box((L >> 1) - 7, D, z0 + 14, (L >> 1) + 7, D + 1, z0 + 15, M.METAL_DARK);
  } else if (type === 'citerne') {
    const p = k.peint(o.col || [0.16, 0.16, 0.17], { rust: 0.15, seed: x });
    for (let s = 1; s < L - 1; s++) for (let t = 0; t < D; t++) for (let z = z0; z < z0 + 14; z++) if (Math.hypot(t - 6.5, z - z0 - 6.5) < 7) F.set(s, t, z, M.METAL, p);
    F.box((L >> 1) - 2, 5, z0 + 13, (L >> 1) + 2, 9, z0 + 15, M.METAL_DARK);
    F.box(1, D - 1, z0 + 5, L - 1, D, z0 + 7, M.METAL, k.peint(o.bande || [0.72, 0.56, 0.16]));
  } else if (type === 'tombereau') {
    const p = k.peint(o.col || [0.30, 0.24, 0.18], { rust: 0.5, seed: x });
    F.box(0, 0, z0, L, D, z0 + 10, M.METAL, p); F.box(1, 1, z0 + 1, L - 1, D - 1, z0 + 10, 0);
    for (let s = 1; s < L - 1; s++) for (let t = 1; t < D - 1; t++) { const hh = Math.floor(6 + 5 * fbm(s / 4, t / 4, x)); for (let z = z0 + 1; z < z0 + hh; z++) F.set(s, t, z, hash(s, t, z, x) < 0.6 ? M.FRI_ROUILLE : M.METAL_DARK); }
    for (let s = 4; s < L; s += 8) F.box(s, D - 1, z0, s + 1, D, z0 + 10, M.METAL_DARK);
  } else if (type === 'plat') {
    if (o.cont) for (let i = 0; i < o.cont.length; i++) { const [xa, ya] = F.P(2 + i * 31, 1); conteneur(k, xa, ya, z0, 'x', 30, o.cont[i]); }
  } else if (type === 'tremie') {
    const p = k.peint(o.col || [0.62, 0.62, 0.58], { rust: 0.25, streaks: 0.3, seed: x });
    for (let s = 0; s < L; s++) { const e = Math.min(s, L - 1 - s); F.box(s, 0, z0 + Math.max(0, 6 - e), s + 1, D, z0 + 16, M.METAL, p); }
    for (let s = 6; s < L - 6; s += 8) F.box(s, D - 1, z0 + 2, s + 1, D, z0 + 16, M.METAL_DARK);
  } else if (type === 'loco') {
    const p = k.peint([0.80, 0.60, 0.14], { grime: 0.3 }), ch = k.peint([0.80, 0.62, 0.16], { pat: 'chevrons' });
    F.box(0, 1, z0, L, D - 1, z0 + 2, M.METAL, ch);
    F.box(2, 3, z0 + 2, L - 14, D - 3, z0 + 11, M.METAL, p);
    F.box(L - 14, 1, z0 + 2, L - 1, D - 1, z0 + 17, M.METAL, p);
    F.box(L - 15, 0, z0 + 17, L, D, z0 + 18, M.METAL_DARK);
    F.box(L - 12, D - 1, z0 + 9, L - 3, D, z0 + 15, M.CAR_GLASS); F.box(L - 1, 2, z0 + 9, L, D - 2, z0 + 15, M.CAR_GLASS);
    F.box(8, 5, z0 + 11, 10, 7, z0 + 15, M.METAL_DARK);
  }
}
// La voiture à la casse : sans roues, cabossée, rouillée, les vitres crevées ; ou compressée.
function epave(k, x, y, z, ax, col, o = {}) {
  const { W } = k;
  const p = W.obj({ type: 'port_peint', col: col.map(v => v * 0.72 + 0.06), rust: 0.6 + 0.35 * hash(x, y, z, 81), seed: (x * 3 + y + z) | 0, grain: 0.09, grime: 0.3 });
  const F = repere(W, ax, x, y, 19, 8, !!o.inv);
  if (o.cube) { F.box(1, 0, z, 18, 8, z + 4, M.METAL, p); for (let s = 1; s < 18; s += 3) F.set(s, 7, z + 1 + (s % 2), M.FRI_ROUILLE); return; }
  F.box(0, 0, z, 19, 8, z + 3, M.METAL, p);
  F.box(1, 0, z + 3, 6, 8, z + 4, M.METAL, p);
  F.box(6, 0, z + 3, 15, 8, z + 6, M.CAR_GLASS);
  F.box(6, 0, z + 3, 7, 8, z + 6, M.METAL, p); F.box(14, 0, z + 3, 15, 8, z + 6, M.METAL, p); F.box(10, 0, z + 3, 11, 8, z + 6, M.METAL, p);
  F.box(6, 0, z + 6, 15, 8, z + 7, M.METAL, p);
  if (hash(x, y, z, 82) < 0.5) F.box(7, 7, z + 3, 10, 8, z + 6, 0);
  if (hash(x, y, z, 83) < 0.4) F.box(1, 1, z + 3, 6, 7, z + 4, 0);
  if (o.brule) { F.box(0, 0, z, 19, 8, z + 7, 0); F.box(0, 0, z, 19, 8, z + 3, M.FRI_ROUILLE); F.box(6, 0, z + 3, 7, 8, z + 6, M.METAL_DARK); F.box(14, 0, z + 3, 15, 8, z + 6, M.METAL_DARK); F.box(6, 0, z + 6, 15, 8, z + 7, M.FRI_ROUILLE); }
}

// ================================================================ les personnages (1 pixel = 10 cm)
const KK = [0.06, 0.045, 0.04];
const BASE = {
  k: KK, s: [0.86, 0.69, 0.55], S: [0.66, 0.48, 0.37], h: [0.17, 0.11, 0.08], H: [0.30, 0.20, 0.13],
  o: [0.09, 0.09, 0.09], j: [0.24, 0.30, 0.42], J: [0.16, 0.20, 0.30],
};
const pal = extra => Object.assign({}, BASE, extra);
// le docker : bonnet, veste de travail bleue, les mains dans les poches
const DOCKER = { rows: [
  '...kkkk...',
  '..kbbbbk..',
  '..kbBbbk..',
  '..ksssskk.',
  '..kskskSk.',
  '..ksSSsk..',
  '...kSSk...',
  '.kqqqqqqk.',
  'kqqqQqqqqk',
  'kqqqQqqqqk',
  'kqqqQqqqqk',
  'ksqqqqqqsk',
  '.kqqqqqqk.',
  '.kjjjjjjk.',
  '.kjjkkjjk.',
  '.kjjk.jjk.',
  '.kjjk.jjk.',
  '.kook.ook.',
  '..kk...kk.',
], pal: pal({ b: [0.16, 0.18, 0.26], B: [0.24, 0.26, 0.36], q: [0.22, 0.32, 0.52], Q: [0.15, 0.22, 0.38] }), ax: 4 };
// le routier : casquette, chemise à carreaux rouges, ventre, jean ; la cigarette
const ROUTIER = { rows: [
  '...kkkk....',
  '..kccccck..',
  '..kssssk...',
  '..kskskk...',
  '..ksSSsk...',
  '...kSSk....',
  '.krrRrrrk..',
  'krrRrrRrrk.',
  'krRrrrRrrk.',
  'krrrrrrrrk.',
  'kskrrrrrkse',
  '.kjjjjjjk..',
  '.kjjjjjjk..',
  '.kjjkkjjk..',
  '.kjjk.jjk..',
  '.kjjk.jjk..',
  '.kook.ook..',
  '..kk...kk..',
], pal: pal({ c: [0.22, 0.30, 0.20], r: [0.58, 0.14, 0.12], R: [0.30, 0.08, 0.07], e: [1.0, 0.5, 0.2] }), emit: { e: [1.4, 0.45, 0.1] }, ax: 4 };
// le fumeur en ciré, sur le quai : la capuche, le bout rouge de la cigarette
const CIRE = { rows: [
  '...kkkk...',
  '..kyyyyk..',
  '.kyyyyyyk.',
  '.kySssyyk.',
  '.kykSkyyk.',
  '.kySSeyyk.',
  '..kyyyyk..',
  '.kyyyyyyk.',
  'kyyyyyyyyk',
  'kyyyYyyyyk',
  'kyyyYyyyyk',
  'kyyyyyyyyk',
  '.kyyyyyyk.',
  '.kjjjjjjk.',
  '.kjjk.jjk.',
  '.kjjk.jjk.',
  '.kook.ook.',
  '..kk...kk.',
], pal: pal({ y: [0.66, 0.54, 0.12], Y: [0.50, 0.40, 0.08], e: [1.0, 0.5, 0.2] }), emit: { e: [1.4, 0.45, 0.1] }, ax: 4 };
const CHIEN = { rows: [
  '.......kk.',
  'k.....kddk',
  'kk....kdkd',
  '.kkkkkkddk',
  '.kdddddkk.',
  '.kdkkkdk..',
  '.kk...kk..',
], pal: pal({ d: [0.20, 0.17, 0.14] }), ax: 5, shadowR: 4 };

// ================================================================ le quartier
module.exports = {
  w: WD, h: HT, seed: 1436,
  zmax: 140,   // la grue des docks, le portique et le silo montent jusqu'à 124
  riviere: 326, // l'eau de y 326 à 392, comme le couloir du maître
  build(W, ctx) {
    if (M.RIVER2 == null) require('./zone'); // la Rive, ses quais, la coque des péniches
    const night = !!ctx.night, bad = ctx.mood === 'bad';
    const cache = new Map();
    const k = {
      W, R: ctx.R, night, bad, day: !night, places: [],
      peint(col, extra) { const key = JSON.stringify([col, extra || null]); let id = cache.get(key); if (!id) { id = W.obj(Object.assign({ type: 'port_peint', col }, extra || {})); cache.set(key, id); } return id; },
    };
    reprendreCouloir(k);
    sol(k);
    eau(k);
    bordures(k);
    marquages(k);
    grandeLigne(k);
    pont(k);
    nord(k);
    magasins(k);
    entrepot7(k);
    silo(k);
    quaiNord(k);
    guinguette(k);
    grue(k, 172);
    quaiSud(k);
    capitainerie(k);
    bassin(k);
    portique(k);
    parcConteneurs(k);
    halleSables(k);
    relais(k);
    parkingPL(k);
    maisons(k);
    casse(k);
    faisceau(k);
    halage(k);
    lampadaires(k);
    gens(k);
    reflets(k);
    return { places: k.places };
  },
};

// ================================================================ le couloir de la Rive, repris
// Le maître pose le couloir (routes, promenades plantées, lanternes, rambardes) avant le quartier.
// Ici les promenades deviennent des quais : on reprend la bande (ses arbres, ses lampes et leurs
// lumières, ses feuilles mortes) ; l'eau, les murs des quais et les deux routes restent.
function reprendreCouloir(k) {
  const { W } = k;
  for (let i = W.lights.length - 1; i >= 0; i--) {
    const L = W.lights[i], x = L.x - W.ox, y = L.y - W.oy;
    if (x >= 0 && x < WD && y >= 262 && y < 456) W.lights.splice(i, 1);
  }
  W.box(0, 262, 2, WD, 456, 70, 0);
  for (let y = 0; y < HT; y++) for (let x = 0; x < WD; x++) {
    const gx = x + W.ox, gy = y + W.oy;
    if (gx >= 0 && gy >= 0 && gx < W.X && gy < W.Y) W.leaf[gy * W.X + gx] = 0;
  }
}

// ================================================================ le sol
function sol(k) {
  const { W } = k;
  const S = (x0, y0, x1, y1, m, t = 0) => W.box(x0, y0, 1, x1, y1, 2, m, t);
  const C = (x0, y0, x1, y1) => { W.box(x0, y0, 1, x1, y1, 3, 0); W.box(x0, y0, 0, x1, y1, 1, M.ASPHALT); };
  // au nord de la Rive
  S(0, 0, WD, 262, M.PORT_BETON);
  S(0, 0, WD, 8, M.SIDEWALK); C(0, 8, WD, 32); S(0, 32, WD, 38, M.SIDEWALK);
  S(0, 38, 124, 162, M.ASPHALT);
  S(128, 40, 238, 150, M.GRAVEL);
  S(240, 38, 338, 186, M.GRAVEL);
  S(0, 262, WD, 270, M.SIDEWALK); C(0, 270, WD, 298);
  S(0, 298, 338, 322, M.PORT_PAVE);
  // au sud
  S(0, 396, 150, 412, M.GRAVEL); S(0, 412, 150, 420, M.SIDEWALK); C(0, 420, 122, 448);
  S(150, 396, 196, 722, M.PORT_BETON);
  S(116, 448, 122, 722, M.SIDEWALK);
  S(0, 448, 116, 656, M.PORT_BETON);
  S(0, 656, 116, 722, M.ASPHALT);
  C(122, 420, 150, 730);
  S(196, 560, 338, 722, M.PORT_BETON);
  S(0, 722, WD, 730, M.SIDEWALK); C(0, 730, WD, 758); S(0, 758, WD, 766, M.SIDEWALK);
  S(0, 766, 144, 862, M.ASPHALT);
  S(0, 862, 144, 952, M.GRASS);
  S(144, 766, 314, 952, M.MUD);
  S(314, 766, 338, 952, M.GRAVEL);
  S(0, 952, 338, 960, M.SIDEWALK);
  S(0, 960, 338, 1034, M.GRAVEL);
  S(0, 1034, WD, 1040, M.SIDEWALK); C(0, 1040, WD, 1064); S(0, 1064, WD, HT, M.GRASS);
  // l'allée de la casse et l'entrée du parc à conteneurs
  C(196, 766, 222, 804);
  // des herbes dans les marges (le bord extérieur, le faisceau, la voie du silo)
  for (let y = 0; y < HT; y++) for (let x = 0; x < WD; x++) {
    const m = W.get(x, y, 1);
    if (m !== M.GRAVEL && m !== M.GRASS) continue;
    const n = fbm(x / 9, y / 9, 1501);
    if (hash(x, y, 1502, 0) < (m === M.GRASS ? 0.10 : 0.05) + 0.25 * Math.max(0, n - 0.55) && !W.get(x, y, 2)) W.set(x, y, 2, M.WEED);
  }
}
// Le bassin : creusé au sud de la Rive, l'eau à son niveau ; ses murs de quai.
function eau(k) {
  const { W } = k;
  W.box(200, 392, -7, 336, 556, 3, 0);
  W.box(200, 392, -8, 336, 556, -7, M.RIVER2);
  W.box(196, 396, -8, 200, 560, 2, M.QUAY_STONE);
  W.box(196, 556, -8, 340, 560, 2, M.QUAY_STONE);
  W.box(336, 392, -8, 340, 560, 2, M.QUAY_STONE);
  // la margelle, en pierre claire, au bord des quais de travail
  W.box(0, 321, 1, 338, 322, 2, M.STONE);
  W.box(196, 396, 1, 197, 556, 2, M.STONE);
}
function bordures(k) {
  const { W } = k;
  const chaussee = (x, y) => x >= 0 && y >= 0 && x < WD && y < HT && !W.get(x, y, 1) && W.get(x, y, 0) === M.ASPHALT;
  const SOLS = new Set([M.SIDEWALK, M.PORT_PAVE, M.PORT_BETON, M.GRAVEL, M.GRASS, M.ASPHALT, M.MUD, M.WEED]);
  const cb = [];
  for (let y = 0; y < HT; y++) for (let x = 0; x < WD; x++) {
    if (!SOLS.has(W.get(x, y, 1))) continue;
    if (chaussee(x + 1, y) || chaussee(x - 1, y) || chaussee(x, y + 1) || chaussee(x, y - 1)) cb.push(x, y);
  }
  for (let i = 0; i < cb.length; i += 2) { W.set(cb[i], cb[i + 1], 1, M.CURB); W.set(cb[i], cb[i + 1], 0, M.CURB); W.set(cb[i], cb[i + 1], 2, 0); }
  for (let y = 0; y < HT; y++) for (let x = 0; x < WD; x++) {
    if (!chaussee(x, y)) continue;
    if (W.get(x + 1, y, 1) === M.CURB || W.get(x - 1, y, 1) === M.CURB || W.get(x, y + 1, 1) === M.CURB || W.get(x, y - 1, 1) === M.CURB) W.set(x, y, 0, M.GUTTER);
  }
}
function marquages(k) {
  const { W } = k;
  const axeX = (y, x0, x1) => { for (let x = x0; x < x1; x += 16) W.box(x, y - 1, 0, Math.min(x + 10, x1), y + 1, 1, M.ROADLINE); };
  axeX(20, 4, 330); axeX(284, 4, 330); axeX(744, 4, 116); axeX(744, 160, 330); axeX(1052, 4, 330);
  for (let y = 456; y < 722; y += 16) W.box(135, y, 0, 137, y + 10, 1, M.ROADLINE);
  for (let x = 124; x < 149; x += 4) W.box(x, 448, 0, x + 2, 458, 1, M.ROADLINE);
  for (let y = 732; y < 757; y += 4) W.box(152, y, 0, 162, y + 2, 1, M.ROADLINE);
  for (let y = 732; y < 757; y += 4) W.box(100, y, 0, 110, y + 2, 1, M.ROADLINE);
  // les lignes d'arrêt avant les passages à niveau
  for (const [a, b] of [[8, 20], [270, 284], [730, 744], [1040, 1052]]) { W.box(328, a + 1, 0, 330, b, 1, M.ROADLINE); W.box(362, b, 0, 364, b + 11, 1, M.ROADLINE); }
}

// ================================================================ la grande ligne, le long du bord extérieur
function grandeLigne(k) {
  const { W } = k;
  const PN = [[8, 32], [270, 298], [730, 758], [1040, 1064]];
  const surBallast = (y0, y1) => {
    W.box(337, y0, 1, 357, y1, 2, M.PORT_BALLAST);
    for (let y = y0; y < y1; y++) if (mod(y, 3) === 0) W.box(340, y, 1, 354, y + 1, 2, M.WOOD_DARK);
    for (const x of LIGNE) W.box(x, y0, 2, x + 1, y1, 3, M.PORT_RAIL);
  };
  for (const [a, b] of [[0, 2], [38, 264], [304, 318], [400, 724], [764, 1034], [1070, HT]]) surBallast(a, b);
  // les trottoirs traversés : les rails au ras du sol
  for (const [a, b] of [[2, 8], [32, 38], [264, 270], [298, 304], [724, 730], [758, 764], [1034, 1040], [1064, 1070]]) {
    W.box(337, a, 1, 357, b, 2, M.CONCRETE);
    for (const x of LIGNE) W.box(x, a, 1, x + 1, b, 2, M.PORT_RAIL);
  }
  // les passages à niveau : le platelage, les rails dans la chaussée, les demi-barrières, les croix
  for (const [a, b] of PN) {
    W.box(339, a, 0, 355, b, 1, M.CONCRETE);
    for (const x of LIGNE) W.box(x, a, 0, x + 1, b, 1, M.PORT_RAIL);
    for (const [px, py, dx] of [[334, b + 2, -1], [359, a - 3, 1]]) {
      W.box(px, py, G, px + 1, py + 1, G + 14, M.METAL_DARK);
      W.box(px, py, G + 9, px + 1, py + 1, G + 31, M.BARRIER);
      for (let i = -2; i <= 2; i++) { W.set(px + dx, py + i, G + 16 + i, M.PLASTIC_WHITE); W.set(px + dx, py + i, G + 16 - i, M.PLASTIC_WHITE); }
      W.set(px + dx, py - 1, G + 12, M.PLASTIC_RED); W.set(px + dx, py + 1, G + 12, M.PLASTIC_RED);
    }
  }
  // l'accotement : herbes hautes jusqu'au bord, roseaux au bord de l'eau
  for (let y = 0; y < HT; y++) for (let x = 357; x < WD; x++) {
    if (y >= 318 && y < 400) continue;
    if (PN.some(([a, b]) => y >= a - 6 && y < b + 6)) continue;
    W.set(x, y, 1, M.GRASS);
    const h = hash(x, y, 1511, 0);
    if (h < 0.35) W.set(x, y, 2, M.WEED);
    if (h < 0.08 && x > 359) W.set(x, y, 3, M.WEED);
  }
  // deux signaux
  for (const [y, vert] of [[236, true], [778, false]]) {
    W.box(359, y, G, 360, y + 1, G + 22, M.METAL_DARK);
    W.box(358, y - 1, G + 18, 361, y + 2, G + 25, M.METAL_DARK);
    W.set(360, y + 1, G + 23, vert ? M.PORT_FEU_VERT : M.METAL_DARK); W.set(360, y + 1, G + 20, vert ? M.METAL_DARK : M.RED_LIGHT);
  }
}
// Le pont tournant de la voie ferrée : deux poutres en treillis sur une pile ronde, au milieu de la Rive.
function pont(k) {
  const { W } = k;
  const y0 = 318, y1 = 400;
  const P = W.obj({ type: 'port_peint', col: [0.27, 0.33, 0.29], rust: 0.35, streaks: 0.2, seed: 91 });
  cylindre(W, 347, 359, 9, -8, -2, M.BRIDGE_STONE || M.STONE);
  W.box(339, y0, -3, 341, y1, 1, M.METAL, P); W.box(353, y0, -3, 355, y1, 1, M.METAL, P);
  for (let y = y0; y < y1; y += 4) W.box(339, y, -1, 355, y + 1, 1, M.METAL_DARK);
  for (let y = y0; y < y1; y++) if (mod(y, 3) === 0) W.box(340, y, 1, 354, y + 1, 2, M.WOOD_DARK);
  for (const x of LIGNE) W.box(x, y0, 2, x + 1, y1, 3, M.PORT_RAIL);
  const zt = 26;
  for (const x of [338, 356]) {
    W.box(x, y0, 0, x + 1, y1, 2, M.METAL, P);
    ligne(W, x, y0, 1, x, y0 + 6, zt, M.METAL, P); ligne(W, x, y1 - 1, 1, x, y1 - 7, zt, M.METAL, P);
    W.box(x, y0 + 6, zt, x + 1, y1 - 6, zt + 2, M.METAL, P);
    const n = 7, step = (y1 - 7 - (y0 + 6)) / n;
    for (let i = 0; i <= n; i++) { const y = Math.round(y0 + 6 + i * step); W.box(x, y, 1, x + 1, y + 1, zt, M.METAL, P); }
    for (let i = 0; i < n; i++) {
      const ya = Math.round(y0 + 6 + i * step), yb = Math.round(y0 + 6 + (i + 1) * step);
      if (i < n / 2) ligne(W, x, ya, zt, x, yb, 2, M.METAL, P); else ligne(W, x, ya, 2, x, yb, zt, M.METAL, P);
    }
  }
  for (let i = 0; i <= 7; i += 1) { const y = Math.round(y0 + 6 + i * (y1 - 13 - y0) / 7); W.box(338, y, zt + 1, 357, y + 1, zt + 2, M.METAL, P); }
  ligne(W, 338, y0 + 6, zt + 1, 356, y1 - 7, zt + 1, M.METAL_DARK); ligne(W, 356, y0 + 6, zt + 1, 338, y1 - 7, zt + 1, M.METAL_DARK);
  // la cabine du pontier, sur la culée sud
  W.box(358, 402, G, 364, 412, G + 12, M.PLASTER_CREAM); W.box(357, 401, G + 12, 364, 413, G + 13, M.METAL_DARK);
  new Facade(W, RIGHT, 358, 402, 6, 10).window(2, G + 6, 5, 4, { state: k.night ? 'lit' : 'dark', sill: false, lintel: false, spill: false });
}

// ================================================================ au nord : le parc à remorques, les cuves, la voie du silo
function nord(k) {
  const { W, night, bad, R } = k;
  // le parc à remorques et son pont-bascule
  for (const y of [44, 64, 84, 104]) W.box(4, y, 1, 118, y + 1, 2, M.ROADLINE);
  camion(k, 8, 49, 'x', -1, { attelee: false, remorque: 'bache', bache: [0.70, 0.66, 0.58], texte: 'TRANSPORTS VALDORNE', texteCol: [0.42, 0.12, 0.12] });
  camion(k, 14, 69, 'x', 1, { attelee: false, remorque: 'frigo' });
  camion(k, 20, 89, 'x', 1, { cab: [0.20, 0.32, 0.55], remorque: 'conteneur', cont: CONT[0] });
  W.box(20, 128, 0, 66, 146, 1, M.METAL_DARK); W.box(21, 129, 1, 65, 145, 2, 0);
  for (let x = 22; x < 64; x += 4) W.box(x, 129, 0, x + 2, 145, 1, M.METAL);
  W.box(70, 126, G, 84, 142, G + 13, M.PLASTER_GREY);
  B.flatRoof(W, 70, 126, 14, 16, G + 13, M.PLASTER_GREY, { parapet: 1 });
  new Facade(W, LEFT, 70, 126, 14, 16).window(3, G + 5, 8, 5, { state: night ? 'office' : 'dark', sill: false, lintel: false, spill: false });
  new Facade(W, LEFT, 70, 126, 14, 16).sign(1, G + 13, 'BASCULE', { fg: [0.85, 0.82, 0.72], depth: 0 });
  new Facade(W, RIGHT, 70, 126, 14, 16).door(4, G, 5, 10, { mat: M.METAL, frame: false });
  projecteur(k, 118, 150, 44, [60, 90], { r: 130, on: !bad });
  grillage(W, 0, 40, 1, 162, 11, { barbele: true, trous: [[60, 78]] });
  // le dépôt de cuves, dans sa cuvette
  const mur = (x0, y0, x1, y1) => W.box(x0, y0, G, x1, y1, G + 5, M.CONCRETE);
  mur(130, 42, 236, 44); mur(130, 146, 236, 148); mur(130, 42, 132, 148); mur(234, 42, 236, 148);
  for (let k2 = 0; k2 < 5; k2++) W.box(180 + k2, 146, G, 181 + k2, 149, G + 5 - k2, M.CONCRETE);
  const cuve = (cx, cy, r, h, col, num) => {
    const t = W.obj({ type: 'port_peint', col, rust: 0.25, streaks: 0.35, seed: cx });
    cylindre(W, cx, cy, r, G, G + h, M.METAL, t);
    for (let i = 0; i < 4; i++) cylindre(W, cx, cy, r - 1 - i * r / 5, G + h + i, G + h + i + 1, M.METAL, t);
    for (let z = G; z < G + h; z++) { const a = 0.15 + (z - G) / h * 1.3; const x = Math.round(cx + (r + 0.6) * Math.cos(a)), y = Math.round(cy + (r + 0.6) * Math.sin(a)); W.set(x, y, z, M.METAL_DARK); W.set(x, y, z + 3, M.METAL_DARK); }
    ecrire(W, LEFT, Math.floor(cy + r), Math.round(cx - 3), G + h - 6, num, { scale: 4, fg: [0.30, 0.30, 0.30], prof: r, worn: 0.1 });
  };
  cuve(166, 86, 22, 34, [0.74, 0.74, 0.70], '1');
  cuve(214, 70, 15, 28, [0.52, 0.56, 0.50], '2');
  cuve(208, 122, 13, 22, [0.76, 0.75, 0.70], '3');
  for (const [a, b] of [[[188, 86], [199, 76]], [[188, 96], [196, 118]]]) ligne(W, a[0], a[1], G + 3, b[0], b[1], G + 3, M.METAL_DARK, 0, 1);
  ligne(W, 144, 108, G + 3, 144, 146, G + 3, M.METAL_DARK, 0, 1);
  grillage(W, 128, 38, 238, 39, 11, { barbele: true, trous: [[50, 62]] });
  // la voie du silo : l'aiguille sur la grande ligne, la courbe, le tiroir, le heurtoir, un wagon-trémie
  voieArc(k, 346.5 - 40, 112, 40, 0, Math.PI / 2);
  voie(k, 244, 307, 152);
  W.box(240, 146, G, 244, 160, G + 5, M.CONCRETE); W.box(239, 147, G + 3, 240, 159, G + 5, M.BARRIER);
  wagon(k, 252, 152, 'tremie', { L: 46 });
  // la fosse de réception, sous son auvent de tôle
  for (const [x, y] of [[262, 142], [296, 142], [262, 164], [296, 164]]) W.box(x, y, G, x + 2, y + 2, G + 26, M.METAL_DARK);
  W.box(260, 140, G + 26, 300, 168, G + 27, M.FRI_TOLE);
  for (let x = 262; x < 298; x += 6) ligne(W, x, 141, G + 26, x + 6, 141, G + 20, M.METAL_DARK);
  // des traverses empilées, des rails de réemploi, la baraque des cheminots, un vieux wagon sur cales
  for (let i = 0; i < 4; i++) W.box(250, 50 + i * 3, G, 268, 52 + i * 3, G + 2 + (i % 2), M.WOOD_DARK);
  for (let i = 0; i < 5; i++) W.box(250, 66 + i * 2, G + (i % 2), 290, 67 + i * 2, G + 1 + (i % 2), M.PORT_RAIL);
  const bq = k.peint([0.46, 0.30, 0.20], { pat: 'planks', grime: 0.3, seed: 42 });
  W.box(276, 44, G, 300, 58, G + 11, M.WOOD, bq);
  B.gableRoof(W, 275, 43, 26, 16, G + 11, M.FRI_TOLE, { axis: 'x', oh: 0, slope: 3 });
  const fq = new Facade(W, LEFT, 276, 44, 24, 14);
  fq.door(3, G, 5, 9, { mat: M.WOOD_DARK, frame: false });
  fq.window(12, G + 4, 6, 4, { state: night && !bad ? 'lit' : 'dark', sill: false, lintel: false, frame: [0.3, 0.25, 0.2], spill: false });
  B.chimney(W, 296, 47, G + 14, 4, M.BRICK);
  for (const x of [308, 320]) W.box(x, 112, G, x + 10, 122, G + 3, M.CONCRETE);
  wagon(k, 304, 116, 'couvert', { L: 30, zr: G + 4, col: [0.34, 0.24, 0.18] });
  ecrire(W, LEFT, 123, 308, G + 18, 'KOP', { fg: [0.86, 0.85, 0.80] });
  B.planeTree(W, 238, 100, G, { seed: 41, trunk: 12, r: 7 });
}
// Une voie le long de x (axe yc : les rails à yc − 3 et yc + 4).
function voie(k, x0, x1, yc) {
  const { W } = k;
  W.box(x0, yc - 7, 1, x1, yc + 8, 2, M.PORT_BALLAST);
  for (let x = x0; x < x1; x++) if (mod(x, 3) === 0) W.box(x, yc - 5, 1, x + 1, yc + 6, 2, M.WOOD_DARK);
  W.box(x0, yc - 3, 2, x1, yc - 2, 3, M.PORT_RAIL); W.box(x0, yc + 4, 2, x1, yc + 5, 3, M.PORT_RAIL);
}
// Une voie en arc de cercle (centre cx, cy ; rayon r ; de l'angle a0 à a1).
function voieArc(k, cx, cy, r, a0, a1) {
  const { W } = k;
  const n = Math.ceil(Math.abs(a1 - a0) * (r + 9) * 2);
  for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n, ca = Math.cos(a), sa = Math.sin(a); for (let d = -7.5; d <= 7.5; d += 0.5) W.set(Math.round(cx + (r + d) * ca), Math.round(cy + (r + d) * sa), 1, M.PORT_BALLAST); }
  const len = Math.abs(a1 - a0) * r;
  for (let s = 0; s < len; s += 3) { const a = a0 + (a1 - a0) * s / len; for (let d = -5; d <= 5; d += 0.5) W.set(Math.round(cx + (r + d) * Math.cos(a)), Math.round(cy + (r + d) * Math.sin(a)), 1, M.WOOD_DARK); }
  for (let i = 0; i <= n * 2; i++) { const a = a0 + (a1 - a0) * i / (2 * n); for (const d of [-3.5, 3.5]) W.set(Math.round(cx + (r + d) * Math.cos(a)), Math.round(cy + (r + d) * Math.sin(a)), 2, M.PORT_RAIL); }
}

// ================================================================ les Magasins généraux (entrepôts 5 et 6)
function magasins(k) {
  const { W, night, bad, day } = k;
  const y0 = 168, y1 = 262, zw = 30;
  const T = W.obj({ type: 'fri_surf', moss: 0.22, seed: 11 });
  W.box(10, y0, G, 122, y1, zw, M.BRICK_OLD, T);
  W.box(10, y1 - 1, G, 122, y1, G + 3, M.STONE);
  W.box(9, y1 - 1, zw - 1, 123, y1 + 1, zw, M.STONE);
  const f = new Facade(W, LEFT, 10, y0, 112, y1 - y0);
  const vit = W.obj({ type: 'fri_vitres', broken: bad ? 0.4 : 0.12, boarded: bad ? 0.2 : 0.06, seed: 5, pane: 3 });
  [{ x0: 10, toit: M.SLATE, n: '5', mot: 'MAGASINS', porte: [0.18, 0.30, 0.22] }, { x0: 66, toit: M.FRI_TOLE, n: '6', mot: 'GÉNÉRAUX', porte: [0.42, 0.16, 0.12] }].forEach((nf, i) => {
    B.gableRoof(W, nf.x0, y0, 56, y1 - y0, zw, nf.toit, { axis: 'y', oh: 1, slope: 2, gable: M.BRICK_OLD });
    const cx = nf.x0 + 28;
    for (const s of [0, 54]) f.rect(nf.x0 - 10 + s, G, nf.x0 - 10 + s + 2, zw - 1, -1, M.BRICK_OLD, T);
    // la porte charretière en plein cintre
    const pt = W.obj({ type: 'port_peint', col: nf.porte, pat: 'lames', rust: 0.3, seed: 12 + i });
    const ouverte = day && i === 0 && !bad;
    for (let x = cx - 8; x < cx + 8; x++) {
      const top = 18 + Math.round(4 * Math.sqrt(Math.max(0, 1 - Math.pow((x + 0.5 - cx) / 8, 2))));
      W.box(x, y1 - 1, G, x + 1, y1, top, 0);
      if (ouverte) { W.box(x, y1 - 16, G, x + 1, y1 - 1, top, 0); W.box(x, y1 - 16, 1, x + 1, y1 - 1, 2, M.CONCRETE); }
      else W.box(x, y1 - 2, G, x + 1, y1 - 1, top, M.WOOD, pt);
      W.set(x, y1 - 1, top, M.STONE); W.set(x, y1 - 1, top + 1, M.STONE);
    }
    W.box(cx - 9, y1 - 1, G, cx - 8, y1, 19, M.STONE); W.box(cx + 8, y1 - 1, G, cx + 9, y1, 19, M.STONE);
    if (ouverte) { for (const [a, b] of [[cx - 6, y1 - 12], [cx + 1, y1 - 10]]) { palette(W, a, b, G); caisse(W, a, b, G + 1, 6, 4, 5); } }
    // les fenêtres d'usine de part et d'autre, l'oculus du pignon
    for (const sx of [cx - 22, cx + 14]) { W.box(sx, y1 - 1, G + 6, sx + 7, y1, G + 15, M.GLASS, vit); W.box(sx - 1, y1, G + 5, sx + 8, y1 + 1, G + 6, M.STONE); W.box(sx, y1 - 1, G + 15, sx + 7, y1, G + 16, M.STONE); }
    // le mot peint sur la façade, le numéro dans le pignon
    ecrire(W, LEFT, y1 - 1, cx - (largeur(nf.mot) >> 1), zw - 1, nf.mot, { fg: [0.84, 0.81, 0.72], worn: 0.22, seed: i });
    ecrire(W, LEFT, y1 - 1, cx - 2, 43, nf.n, { scale: 3, fg: [0.84, 0.81, 0.72], worn: 0.15 });
    // la potence de levage au faîte, la poulie, la chaîne
    W.box(cx, y1 - 3, 44, cx + 1, y1 + 5, 45, M.METAL_DARK);
    for (let z = 33; z < 44; z++) W.set(cx, y1 + 4, z, M.METAL_DARK);
    W.box(cx, y1 + 4, 32, cx + 1, y1 + 5, 33, M.METAL);
    if (night) { W.set(cx, y1, 25, M.BULB); W.light({ x: cx + 0.5, y: y1 + 2, z: 24, r: 34, cr: 0.85, cg: 0.58, cb: 0.28, skip: 1.5 }); }
  });
  W.box(65, y1, G, 67, y1 + 1, zw, M.ZINC);
  if (bad) ecrire(W, LEFT, y1 - 1, 26, G + 6, 'RIVE', { fg: [0.86, 0.85, 0.80], worn: 0.1 });
  ecrire(W, LEFT, y1 - 1, 50, G + 5, 'DÉFENSE DE FUMER', { fg: [0.62, 0.12, 0.10], worn: 0.3 });
}

// ================================================================ l'entrepôt 7
function entrepot7(k) {
  const { W, night, bad, day } = k;
  const x0 = 128, x1 = 232, y0 = 156, y1 = 262, zw = 30, cx = 180, hw = 52;
  const bardage = W.obj({ type: 'port_peint', col: [0.29, 0.40, 0.43], pat: 'ribs', rust: 0.22, streaks: 0.25, seed: 7, grime: 0.3 });
  W.box(x0, y0, G, x1, y1, zw, M.METAL, bardage);
  W.box(x0, y1 - 1, G, x1, y1, G + 3, M.CONCRETE); W.box(x1 - 1, y0, G, x1, y1, G + 3, M.CONCRETE);
  const zt = x => zw + Math.round(16 * (1 - Math.pow((x + 0.5 - cx) / hw, 2)));
  for (let x = x0; x < x1; x++) {
    const z1 = zt(x);
    W.box(x, y0, zw, x + 1, y1 - 1, z1 + 1, M.FRI_TOLE);
    W.box(x, y1 - 1, zw, x + 1, y1, z1, M.METAL, bardage);
    W.box(x, y1 - 1, z1, x + 1, y1 + 1, z1 + 1, M.FRI_TOLE);
    if ((x >= 148 && x < 152) || (x >= 208 && x < 212)) W.box(x, y0 + 6, z1, x + 1, y1 - 8, z1 + 1, bad ? M.GLASS : M.SKYLIGHT);
  }
  const f = new Facade(W, LEFT, x0, y0, x1 - x0, y1 - y0);
  // Vue de la caméra, la grue cache le bas de la façade à l'ouest de x 142 et la tour du silo tout ce qui
  // est à l'est de x 182 : la grande porte, le 7 et la porte du personnel tiennent entre les deux.
  // La grande porte coulissante : ouverte le jour, entrouverte la nuit (on décharge), scellée en mauvaise saison.
  const D0 = 18, DW = 24, DH = 22;
  const slide = bad ? 0 : night ? 12 : 18;
  f.rect(D0, G, D0 + DW, G + DH, 0, 0);
  W.box(x0 + D0, y1 - 26, G, x0 + D0 + DW, y1, G + DH, 0); W.box(x0 + D0, y1 - 26, 1, x0 + D0 + DW, y1, 2, M.CONCRETE);
  const porte = W.obj({ type: 'port_peint', col: [0.50, 0.18, 0.12], pat: 'ribs', rust: 0.35, seed: 8 });
  f.rect(D0 - slide, G, D0 + DW - slide, G + DH, -1, M.METAL, porte);
  f.rect(0, G + DH, D0 + DW + 2, G + DH + 1, -1, M.METAL_DARK);
  // dedans : des caisses, une voiture sous bâche
  const ix = x0 + D0;
  for (const [a, b, h] of [[ix + 2, y1 - 24, 9], [ix + 9, y1 - 22, 6], [ix + 15, y1 - 25, 12]]) caisse(W, a, b, G, 6, 5, h);
  W.box(ix + 4, y1 - 14, G, ix + 21, y1 - 6, G + 6, M.TARP);
  if (night && !bad) W.light({ x: ix + 18, y: y1 - 8, z: 14, r: 64, cr: 1.15, cg: 0.78, cb: 0.36, skip: 2 });
  // ENTREPOT au-dessus de la grande porte, le grand 7 au-dessus de la porte du personnel
  ecrire(W, LEFT, y1 - 1, x0 + D0 + 3, G + DH + 5, 'ENTREPOT', { fg: [0.86, 0.84, 0.78], worn: 0.2 });
  ecrire(W, LEFT, y1 - 1, x0 + 45, 46, '7', { scale: 6, fg: [0.88, 0.86, 0.80], worn: 0.12 });
  W.box(x0 + 49, y1, 46, x0 + 50, y1 + 4, 47, M.METAL_DARK); W.box(x0 + 48, y1 + 3, 44, x0 + 51, y1 + 5, 46, M.METAL_DARK);
  W.set(x0 + 49, y1 + 4, 44, night && !bad ? M.BULB : M.GLASS);
  if (night && !bad) W.light({ x: x0 + 49.5, y: y1 + 4, z: 43, r: 34, fall: 1.6, cr: 1.0, cg: 0.72, cb: 0.38, axis: [0, -0.45, -0.89], c0: 0.2, c1: 0.7, spill: 0.15, skip: 1.5 });
  // la porte du personnel, son auvent, sa lampe
  f.door(46, G, 6, 11, { mat: M.METAL, frameMat: M.CONCRETE });
  for (let d = 1; d <= 3; d++) f.rect(45, G + 12, 53, G + 13, -d, M.METAL_DARK);
  f.set(49, G + 14, -1, night && !bad ? M.BULB : M.GLASS);
  if (night) W.light({ x: x0 + 49.5, y: y1 + 2.5, z: G + 12, r: 36, cr: 0.95, cg: 0.66, cb: 0.32, skip: 1.5 });
  f.window(56, G + 4, 6, 5, { state: night && !bad ? 'office' : 'dark', sill: false, lintel: false, frame: [0.3, 0.3, 0.3], spill: false });
  f.rect(6, G, 9, G + 26, -1, M.ZINC); f.rect(98, G, 101, G + 26, -1, M.ZINC);
  // les scellés, en mauvaise saison
  if (bad) {
    const ruban = k.peint([0.86, 0.72, 0.12], { pat: 'chevrons' });
    ligne(W, x0 + D0, y1 + 1, G + 3, x0 + D0 + DW, y1 + 1, G + 19, M.PLASTIC_WHITE, ruban);
    ligne(W, x0 + D0, y1 + 1, G + 19, x0 + D0 + DW, y1 + 1, G + 3, M.PLASTIC_WHITE, ruban);
    f.sign(D0 + 4, G + 15, 'SCELLÉS', { plate: [0.86, 0.84, 0.78], plateMat: M.PAPER, fg: [0.12, 0.10, 0.10], depth: -2, padX: 1, padY: 1 });
    ecrire(W, LEFT, y1 - 1, x0 + 60, G + 9, 'DOCKS', { fg: [0.20, 0.55, 0.52], worn: 0.05 });
  }
  // devant : des fûts, une pile de palettes ; le jour, le chariot qui sort une palette
  for (let i = 0; i < 3; i++) palette(W, x0 + 2, y1 + 1, G + i);
  fut(W, x1 - 8, y1, G, M.BIN); fut(W, x1 - 4, y1 + 1, G, M.FRI_ROUILLE);
  if (!night && !bad) { chariot(k, x0 + 30, y1 + 1); palette(W, x0 + 9, y1 + 2, G); caisse(W, x0 + 9, y1 + 2, G + 1, 6, 4, 4); }
  k.places.push({ key: 'entrepot_7', label: "L'entrepôt 7", x: x0 + 49, y: 266, z: G + 12 });
}

// ================================================================ le silo à grains
function silo(k) {
  const { W, night, bad } = k;
  const suie = W.obj({ type: 'fri_surf', soot: 0.45, sootZ: 30, seed: 21 });
  const bard = W.obj({ type: 'port_peint', col: [0.64, 0.64, 0.60], pat: 'ribs', rust: 0.18, streaks: 0.2, seed: 22 });
  W.box(258, 186, G, 334, 240, 10, M.CONCRETE);
  const cells = [];
  for (const cy of [200.5, 225.5]) for (const cx of [271, 296, 321]) cells.push([cx, cy]);
  for (let y = 186; y < 240; y++) for (let x = 256; x < 336; x++) {
    let ins = cells.some(([cx, cy]) => Math.hypot(x + 0.5 - cx, y + 0.5 - cy) < 12.6);
    if (!ins && x + 0.5 > 271 && x + 0.5 < 321 && y + 0.5 > 200.5 && y + 0.5 < 225.5) ins = true;
    if (ins) W.box(x, y, 10, x + 1, y + 1, 94, M.CONCRETE, suie);
  }
  for (const [cx] of cells.slice(3)) { W.box(Math.round(cx) - 2, 238, G + 2, Math.round(cx) + 2, 240, G + 7, 0); W.box(Math.round(cx) - 2, 236, G + 2, Math.round(cx) + 2, 238, G + 7, M.METAL_DARK); }
  // la galerie du dessus
  W.box(258, 204, 94, 334, 222, 104, M.METAL, bard);
  B.flatRoof(W, 257, 203, 78, 20, 104, M.METAL, { parapet: 1 });
  const fg = new Facade(W, LEFT, 258, 204, 76, 18);
  for (let s = 4; s < 72; s += 9) fg.window(s, 98, 4, 3, { state: 'dark', sill: false, lintel: false, frame: [0.35, 0.35, 0.33] });
  // la tour de manutention
  W.box(240, 186, G, 258, 246, 116, M.CONCRETE, suie);
  W.box(240, 186, 116, 258, 246, 124, M.METAL, bard);
  W.box(239, 185, 124, 259, 247, 125, M.METAL_DARK);
  const ft = new Facade(W, LEFT, 240, 186, 18, 60);
  const vt = W.obj({ type: 'fri_vitres', broken: 0.15, seed: 23, pane: 2 });
  for (let z = 16; z < 108; z += 12) {
    if (night && (z === 40 || z === 88)) ft.window(7, z, 4, 6, { state: bad ? 'dark' : 'office', sill: false, lintel: false, frame: [0.3, 0.3, 0.3], spill: false });
    else W.box(247, 245, z, 251, 246, z + 6, M.GLASS, vt);
  }
  W.set(240, 186, 125, night ? M.RED_LIGHT : M.PLASTIC_RED); W.set(257, 245, 125, night ? M.RED_LIGHT : M.PLASTIC_RED);
  ecrire(W, LEFT, 245, 242, 122, 'SILO', { scale: 2, fg: [0.86, 0.84, 0.78], worn: 0.12 });
  ft.door(2, G, 6, 12, { mat: M.METAL, frameMat: M.CONCRETE });
  // le nom peint sur les cellules
  ecrire(W, LEFT, 238, 262, 84, 'GRAINS DE LA RIVE', { scale: 2, fg: [0.80, 0.78, 0.70], worn: 0.3, prof: 14 });
  // la passerelle au-dessus de la route du quai, la tour de chargement, la goulotte
  const gz = 60;
  W.box(244, 246, gz, 254, 300, gz + 1, M.METAL_DARK);
  W.box(244, 246, gz + 1, 254, 300, gz + 7, M.METAL, bard);
  W.box(243, 246, gz + 7, 255, 300, gz + 8, M.ZINC);
  const fp = new Facade(W, RIGHT, 244, 246, 10, 54);
  for (let s = 4; s < 50; s += 9) fp.window(s, gz + 3, 3, 2, { state: night && !bad && s === 22 ? 'lit' : 'dark', sill: false, lintel: false, spill: false });
  for (let y = 248; y < 298; y += 10) { ligne(W, 244, y, gz - 1, 244, y + 5, gz - 5, M.METAL_DARK); ligne(W, 253, y, gz - 1, 253, y + 5, gz - 5, M.METAL_DARK); }
  for (const [lx, ly] of [[242, 300], [254, 300], [242, 314], [254, 314]]) W.box(lx, ly, G, lx + 2, ly + 2, gz, M.METAL_DARK);
  for (let z = G + 4; z < gz - 8; z += 14) {
    ligne(W, 242, 315, z, 255, 315, z + 12, M.METAL_DARK); ligne(W, 255, 315, z, 242, 315, z + 12, M.METAL_DARK);
    ligne(W, 255, 301, z, 255, 315, z + 12, M.METAL_DARK); ligne(W, 255, 315, z, 255, 301, z + 12, M.METAL_DARK);
  }
  W.box(240, 298, gz, 258, 318, gz + 12, M.METAL, bard);
  W.box(239, 297, gz + 12, 259, 319, gz + 13, M.METAL_DARK);
  ligne(W, 249, 317, gz + 1, 252, 335, 8, M.METAL, k.peint([0.55, 0.55, 0.52]), 2);
  if (night && !bad) W.light({ x: 251, y: 330, z: 30, r: 46, fall: 1.6, cr: 1.0, cg: 0.80, cb: 0.48, axis: [0.05, 0.4, -0.9], c0: 0.4, c1: 0.85, spill: 0.1, skip: 3 });
}

// ================================================================ le quai nord
function quaiNord(k) {
  const { W, night, bad, R } = k;
  const bt = k.peint([0.12, 0.12, 0.13], { top: [0.80, 0.66, 0.16] });
  // les rails de la grue, la voie du quai, les heurtoirs
  W.box(132, 301, 1, 238, 302, 2, M.PORT_RAIL); W.box(132, 319, 1, 238, 320, 2, M.PORT_RAIL);
  W.box(132, 307, 1, 334, 308, 2, M.PORT_RAIL); W.box(132, 314, 1, 334, 315, 2, M.PORT_RAIL);
  W.box(132, 308, 1, 334, 309, 2, M.GUTTER); W.box(132, 313, 1, 334, 314, 2, M.GUTTER);
  for (const x of [130, 332]) { W.box(x, 305, G, x + 3, 317, G + 2, M.CONCRETE); W.box(x, 306, G + 2, x + 3, 316, G + 4, M.BARRIER); }
  // les bittes, le long de la margelle
  for (let x = 140; x < 334; x += 22) if (x < 160 || x > 186) bitte(W, x, 319, bt);
  // un tombereau de ferraille sur la voie du quai
  wagon(k, 192, 310, 'tombereau', { L: 40, zr: 2 });
  // des palettes de sacs, des big bags, du cordage
  const sac = k.peint([0.70, 0.66, 0.56], { grain: 0.08 });
  for (const x of [200, 207, 214]) { palette(W, x, 299, G); W.box(x, 299, G + 1, x + 6, 303, G + (x === 207 ? 6 : 4), M.CANVAS, sac); }
  bigbag(W, 300, 300, G, k.peint([0.84, 0.83, 0.78])); bigbag(W, 306, 300, G, k.peint([0.84, 0.83, 0.78])); bigbag(W, 303, 300, G + 5, k.peint([0.84, 0.83, 0.78]));
  for (const [x, y] of [[268, 302], [272, 303]]) fut(W, x, y, G, M.KEG, k.peint([0.22, 0.32, 0.55], { rust: 0.3 }));
  // une échelle de quai et l'échelle de crue, sur le mur, côté eau
  for (let z = -7; z < 2; z++) { W.set(118, 326, z, M.METAL_DARK); W.set(120, 326, z, M.METAL_DARK); if (z % 2 === 0) W.set(119, 326, z, M.METAL_DARK); }
  const ech = W.obj({ type: 'port_echelle', a0: 112 });
  W.box(112, 325, -7, 114, 326, 2, M.QUAY_STONE, ech);
  // les mâts d'éclairage du quai
  projecteur(k, 127, 300, 50, [182, 316], { r: 150, col: [1.0, 0.70, 0.36], I: 1.1 });
  projecteur(k, 262, 300, 56, [226, 318], { r: 140, col: [1.0, 0.70, 0.36], I: 1.0, on: !bad });
  // les péniches : sous la grue, de la ferraille ; sous la goulotte, du grain
  const p1 = peniche(k, { ax: 'x', x0: 132, y0: 328, L: 100, D: 20, proue: 'fin', zg: -1, coque: [0.10, 0.11, 0.12], bande: [0.55, 0.14, 0.12], nom: "L'ESPÉRANCE", charge: 'ferraille', voiture: M.CAR_WHITE, seed: 101 });
  const p2 = peniche(k, { ax: 'x', x0: 238, y0: 328, L: 96, D: 20, proue: 'debut', zg: -2, coque: [0.14, 0.20, 0.32], bande: [0.82, 0.80, 0.74], nom: 'MONTBÉLIAC', charge: 'grain', vrac: [0.80, 0.66, 0.30], seed: 102 });
  // les amarres
  for (const [bx, s, p] of [[140, 6, p1], [206, 90, p1], [250, 8, p2], [316, 86, p2]]) {
    const [x, y] = p.F.P(s, 1);
    ligne(W, bx + 1, 320, G + 2, x, y + 1, p.zg + 1, M.CANVAS);
  }
  k.places.push({ key: 'docks', label: 'Les docks', x: 214, y: 322, z: G + 12 });
}

// ================================================================ la guinguette
function guinguette(k) {
  const { W, night, bad, day } = k;
  const ouverte = !bad, lit = night && ouverte;
  W.box(4, 299, 1, 126, 321, 2, M.WOOD);
  // la rambarde du quai, ouverte à la passerelle
  B.railing(W, 0, 324, 57, 324, 2, 4, M.METAL_DARK, 6); B.railing(W, 70, 324, 127, 324, 2, 4, M.METAL_DARK, 6);
  // les mâts et les guirlandes
  const mats = [[6, 300], [36, 300], [66, 300], [96, 300], [122, 300], [6, 320], [36, 320], [96, 320], [122, 320]];
  for (const [x, y] of mats) W.box(x, y, G, x + 1, y + 1, G + 22, M.WOOD_DARK);
  const AMP = lit ? M.PORT_AMPOULES : M.PORT_AMPOULES_ETEINTES;
  const chaine = (a, b, z, sag) => {
    const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) * 1.2);
    for (let i = 0; i <= n; i++) { const t = i / n; W.set(Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t), Math.round(z - sag * 4 * t * (1 - t)), i % 3 === 1 ? AMP : M.METAL_DARK); }
  };
  for (const [a, b] of [[[6, 300], [36, 320]], [[36, 320], [66, 300]], [[66, 300], [96, 320]], [[96, 320], [122, 300]], [[6, 320], [36, 300]], [[36, 300], [66, 300]], [[96, 300], [122, 320]], [[6, 300], [6, 320]], [[122, 300], [122, 320]]]) chaine(a, b, G + 21, 4);
  // les tables, les chaises, les parasols ; fermée : les chaises sur les tables
  for (const [x, y] of [[14, 304], [26, 312], [46, 304], [80, 304], [84, 313], [108, 312]]) {
    B.terraceTable(W, x, y, G);
    if (ouverte) { B.chair(W, x - 3, y, G, 'x'); B.chair(W, x + 3, y + 1, G); if (day) B.parasol(W, x + 1, y + 1, G + 5); else if (lit) W.set(x + 1, y + 1, G + 5, M.BULB); }
    else { W.box(x, y, G + 5, x + 2, y + 2, G + 7, M.WOOD); W.box(x + 1, y, G + 7, x + 3, y + 1, G + 9, M.WOOD); }
  }
  // la friterie, une cabane de bois sur le quai
  const cb = k.peint([0.66, 0.30, 0.20], { pat: 'planks', grime: 0.25 });
  W.box(98, 300, G, 120, 309, G + 11, M.WOOD, cb);
  B.gableRoof(W, 97, 299, 24, 11, G + 11, M.ZINC, { axis: 'x', oh: 1, slope: 2 });
  const ff = new Facade(W, LEFT, 98, 300, 22, 9);
  if (ouverte) ff.shop(3, G + 4, 12, 5, 'buvette', { light: lit ? { r: 26, c: [0.9, 0.55, 0.25] } : null }); else ff.rect(3, G + 4, 15, G + 9, -1, M.WOOD_DARK);
  ff.awning(2, 14, G + 10, 3, M.AWNING);
  new Facade(W, LEFT, 100, 300, 18, 5).sign(1, G + 20, 'FRITURE', { plate: [0.80, 0.74, 0.60], plateMat: M.WOOD, fg: lit ? [0.95, 0.30, 0.12] : [0.52, 0.14, 0.10], emit: lit ? [1.3, 0.42, 0.16] : null, depth: 0 });
  // l'ardoise : le bal
  W.box(10, 300, G, 11, 301, G + 8, M.WOOD_DARK); W.box(16, 300, G, 17, 301, G + 8, M.WOOD_DARK);
  new Facade(W, LEFT, 10, 300, 8, 1).sign(0, G + 9, 'BAL', { plate: [0.10, 0.12, 0.11], plateMat: M.METAL_DARK, fg: [0.86, 0.85, 0.80], padX: 1, padY: 1 });
  // la péniche-bar et sa passerelle
  const p = peniche(k, { ax: 'x', x0: 6, y0: 328, L: 118, D: 20, proue: 'fin', zg: 0, coque: [0.16, 0.27, 0.21], bande: [0.80, 0.74, 0.58], pont: [0.40, 0.29, 0.18], nom: "AU FIL DE L'EAU", charge: 'guinguette', logement: 30, cabine: [0.82, 0.76, 0.62], allume: lit, fleurs: true, seed: 103 });
  const salon = k.peint([0.80, 0.74, 0.60], { pat: 'planks', grime: 0.2 });
  const { F } = p;
  F.box(36, 3, 0, 82, 17, 9, M.WOOD, salon);
  F.box(35, 2, 9, 83, 18, 10, M.WOOD_DARK);
  const fs = new Facade(W, LEFT, 6, 328, 118, 17);
  for (let s = 38; s < 80; s += 8) {
    const [xa] = F.P(s + 5, 16);
    fs.window(xa - 6, 2, 5, 6, { state: lit ? 'lit' : 'dark', sill: false, lintel: false, frame: [0.40, 0.26, 0.16], col: [1.0, 0.72, 0.40], sil: lit && s % 16 === 6 ? 'head' : null, spill: false });
  }
  const [rx0] = F.P(82, 16), [rx1] = F.P(36, 16);
  B.railing(W, Math.min(rx0, rx1), 345, Math.max(rx0, rx1), 345, 10, 3, M.METAL_DARK, 4);
  const ens = new Facade(W, LEFT, Math.min(rx0, rx1), 328, 50, 17).sign(10, 21, 'GUINGUETTE', { plate: [0.16, 0.27, 0.21], plateMat: M.METAL_DARK, fg: lit ? [1.0, 0.85, 0.55] : [0.86, 0.82, 0.68], emit: lit ? [1.3, 0.9, 0.45] : null, depth: 0 });
  for (const x of [Math.min(rx0, rx1) + 11, Math.min(rx0, rx1) + 8 + ens.nw]) W.box(x, 344, 10, x + 1, 345, 16, M.METAL_DARK);
  // les tables de la plage avant
  for (const s of [16, 26]) { const [x, y] = F.P(s, 9); B.terraceTable(W, x - 1, y - 1, 0); if (day && ouverte) B.parasol(W, x, y, 5); }
  // la guirlande du bateau, du mât de proue au salon, et du salon à la timonerie
  const [ax, ay] = F.P(2, 10), [bx, by] = F.P(36, 10), [cx, cy] = F.P(82, 10), [dx, dy] = F.P(94, 10);
  chaine([ax, ay], [bx, by], 11, 3); chaine([cx, cy], [dx, dy], 14, 2);
  // la passerelle
  W.box(60, 320, 1, 64, 331, 2, M.WOOD); B.railing(W, 59, 320, 59, 330, 1, 4, M.METAL_DARK, 3); B.railing(W, 64, 320, 64, 330, 1, 4, M.METAL_DARK, 3);
  if (lit) {
    for (const [x, y] of [[21, 310], [51, 310], [81, 310], [110, 310]]) W.light({ x, y, z: G + 17, r: 30, cr: 0.80, cg: 0.55, cb: 0.32, shadow: false });
    W.light({ x: rx0 + 4, y: 347, z: 6, r: 34, cr: 0.95, cg: 0.60, cb: 0.28, shadow: false });
  }
  if (bad) new Facade(W, LEFT, 30, 300, 30, 1).sign(0, G + 9, 'FERMÉ', { plate: [0.82, 0.80, 0.72], plateMat: M.PAPER, fg: [0.45, 0.08, 0.10], padX: 1, padY: 1 });
  k.places.push({ key: 'guinguette', label: 'La guinguette', x: 62, y: 321, z: G + 12 });
}

// ================================================================ la grue des docks : portique sur rails, flèche en treillis
function grue(k, cx) {
  const { W, night, bad } = k;
  const J = k.peint([0.74, 0.56, 0.16], { rust: 0.22, seed: 31 });
  const N = k.peint([0.80, 0.62, 0.16], { pat: 'chevrons' });
  const H = k.peint([0.70, 0.68, 0.62], { pat: 'ribs', rust: 0.15, seed: 33 });
  for (const ly of [300, 318]) for (const lx of [cx - 9, cx + 7]) W.box(lx - 3, ly, G, lx + 5, ly + 2, G + 3, M.METAL_DARK, N);
  for (const ly of [300, 318]) for (const [lx, d] of [[cx - 9, 1], [cx + 7, -1]]) for (let z = G + 3; z < 27; z++) { const xx = Math.round(lx + d * (z - G - 3) / (27 - G - 3) * 3); W.box(xx, ly, z, xx + 2, ly + 2, z + 1, M.METAL, J); }
  W.box(cx - 7, 300, 27, cx + 9, 320, 30, M.METAL, J);
  W.box(cx - 6, 301, 22, cx + 8, 303, 27, M.METAL, J); W.box(cx - 6, 317, 22, cx + 8, 319, 27, M.METAL, J);
  cylindre(W, cx + 1, 310, 7, 30, 32, M.METAL_DARK);
  W.box(cx - 6, 300, 32, cx + 8, 320, 43, M.METAL, H);
  W.box(cx - 7, 299, 43, cx + 9, 321, 44, M.METAL_DARK);
  W.box(cx - 5, 293, 32, cx + 7, 300, 40, M.CONCRETE);
  W.box(cx + 2, 320, 34, cx + 8, 325, 43, M.METAL, J);
  const fc = new Facade(W, LEFT, cx + 2, 320, 6, 5), fr = new Facade(W, RIGHT, cx + 2, 320, 6, 5);
  fc.window(1, 37, 4, 5, { state: night && !bad ? 'office' : 'dark', sill: false, lintel: false, frame: [0.3, 0.3, 0.3], spill: false });
  fr.window(1, 37, 3, 5, { state: night && !bad ? 'office' : 'dark', sill: false, lintel: false, frame: [0.3, 0.3, 0.3], spill: false });
  ecrire(W, LEFT, 319, cx - 4, 42, '3', { scale: 2, fg: [0.16, 0.16, 0.16], worn: 0.1 });
  // le chevalet
  const ap = [cx + 1, 306, 64];
  for (const [x, y] of [[cx - 4, 301], [cx + 6, 301], [cx - 4, 318], [cx + 6, 318]]) ligne(W, x, y, 44, ap[0], ap[1], ap[2], M.METAL, J, 1);
  // la flèche : quatre membrures et leur treillis
  const piv = [cx + 1, 314, 38];
  const dpl = [0.34, 0.94], el = 64 * Math.PI / 180, Lj = 70;
  const u = [Math.cos(el) * dpl[0], Math.cos(el) * dpl[1], Math.sin(el)];
  const a = [dpl[1], -dpl[0], 0];
  const b = [u[1] * a[2] - u[2] * a[1], u[2] * a[0] - u[0] * a[2], u[0] * a[1] - u[1] * a[0]];
  const pt = (t, sa, sb) => { const w = 3 - 2 * t, h = 4 - 3 * t; return [0, 1, 2].map(i => piv[i] + u[i] * Lj * t + a[i] * sa * w + b[i] * sb * h); };
  const corners = [[-1, 0], [1, 0], [-1, 1], [1, 1]];
  for (const [sa, sb] of corners) { const p0 = pt(0, sa, sb), p1 = pt(1, sa, sb); ligne(W, ...p0, ...p1, M.METAL, J); }
  const n = 12;
  for (let i = 0; i < n; i++) {
    const t0 = i / n, t1 = (i + 1) / n;
    for (const [c0, c1] of [[[-1, 0], [1, 0]], [[-1, 1], [1, 1]], [[-1, 0], [-1, 1]], [[1, 0], [1, 1]]]) {
      const p0 = pt(i % 2 ? t0 : t1, ...c0), p1 = pt(i % 2 ? t1 : t0, ...c1);
      ligne(W, ...p0, ...p1, M.METAL, J);
    }
  }
  const tip = pt(1, 0, 0.5);
  W.box(Math.round(tip[0]) - 1, Math.round(tip[1]) - 1, Math.round(tip[2]), Math.round(tip[0]) + 2, Math.round(tip[1]) + 2, Math.round(tip[2]) + 2, M.METAL, k.peint([0.70, 0.14, 0.12]));
  W.set(Math.round(tip[0]), Math.round(tip[1]), Math.round(tip[2]) + 2, night ? M.RED_LIGHT : M.PLASTIC_RED);
  ligne(W, ap[0], ap[1], ap[2], tip[0], tip[1], tip[2] + 1, M.METAL_DARK);
  // le câble, la benne preneuse au-dessus de la cale, à moitié refermée sur la ferraille
  const hx = Math.round(tip[0]), hy = Math.round(tip[1]);
  for (let z = 14; z < Math.round(tip[2]); z++) W.set(hx, hy, z, M.METAL_DARK);
  W.box(hx - 1, hy - 1, 12, hx + 2, hy + 2, 14, M.METAL, N);
  for (let z = 4; z < 12; z++) { const r = z < 7 ? 2 + (z - 4) * 0.5 : 3.5; for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) if (Math.abs(dx) <= r && Math.abs(dy) <= 3 && (Math.abs(dx) >= r - 1 || z < 5 || z === 11)) W.set(hx + dx, hy + dy, z, z < 6 ? M.FRI_ROUILLE : M.METAL_DARK); }
  if (night && !bad) {
    W.light({ x: cx + 1, y: 326, z: 40, r: 60, fall: 1.5, cr: 1.0, cg: 0.95, cb: 0.85, axis: [0.1, 0.45, -0.89], c0: 0.45, c1: 0.85, spill: 0.08, skip: 3 });
  }
}

// ================================================================ le quai sud (rive gauche, côté ville)
function quaiSud(k) {
  const { W, night, bad, day } = k;
  B.railing(W, 0, 393, 149, 393, 2, 4, M.METAL_DARK, 6);
  for (const [x, s] of [[34, 301], [96, 302]]) { B.planeTree(W, x, 402, G, { seed: s, trunk: 15, r: 8.5, leafR: 16 }); W.box(x - 2, 400, 1, x + 4, 406, 2, M.METAL_DARK); }
  for (const x of [56, 118]) B.bench(W, x, 397, G, 'x');
  if (day && !bad) { W.sprite(Object.assign({ x: 72, y: 396.5, z: G }, SP.COAT)); W.box(73, 395, G + 6, 74, 396, G + 7, M.WOOD_DARK); ligne(W, 73, 395, G + 7, 75, 381, G + 14, M.WOOD_DARK); }
  if (bad) { for (const [x, y] of [[44, 410], [86, 408], [130, 404]]) W.box(x, y, G, x + 2, y + 1, G + 1, M.PLASTIC_WHITE); }
}

// ================================================================ la capitainerie, à la pointe du bassin
function capitainerie(k) {
  const { W, night, bad, day } = k;
  const x0 = 154, x1 = 190, y0 = 398, y1 = 438, zt = 31;
  W.box(x0, y0, G, x1, y1, zt, M.PLASTER_CREAM);
  W.box(x0, y1 - 1, G, x1, y1, G + 3, M.STONE); W.box(x1 - 1, y0, G, x1, y1, G + 3, M.STONE);
  W.box(x0, y1 - 1, 15, x1, y1, 16, M.STONE); W.box(x1 - 1, y0, 15, x1, y1, 16, M.STONE); W.box(x0, y1 - 1, 20, x1, y1, 21, M.STONE); W.box(x1 - 1, y0, 20, x1, y1, 21, M.STONE);
  B.flatRoof(W, x0, y0, x1 - x0, y1 - y0, zt, M.PLASTER_CREAM, { parapet: 2 });
  const f = new Facade(W, LEFT, x0, y0, x1 - x0, y1 - y0), fe = new Facade(W, RIGHT, x0, y0, x1 - x0, y1 - y0);
  const w = (fa, s, z, st) => fa.window(s, z, 5, 6, { state: st, shutter: M.SHUTTER_BLUE, closed: bad && st === 'dark' && s < 10, spillR: 18, spillI: 0.4 });
  w(f, 4, G + 5, 'dark'); w(f, 27, G + 5, night && !bad ? 'lit' : 'dark'); w(f, 4, 23, night ? 'lit' : 'dark'); w(f, 27, 23, 'dark');
  w(fe, 4, G + 5, 'dark'); w(fe, 16, G + 5, night && !bad ? 'office' : 'dark'); w(fe, 28, G + 5, 'dark'); w(fe, 4, 23, 'dark'); w(fe, 16, 23, night ? 'office' : 'dark'); w(fe, 28, 23, 'dark');
  f.door(15, G, 6, 11, { mat: M.WOOD_DARK, step: true, frameMat: M.STONE });
  for (let d = 1; d <= 3; d++) f.rect(14, G + 12, 22, G + 13, -d, M.METAL_DARK);
  f.sign(5, G + 19, 'CAPITAINERIE', { plate: [0.16, 0.22, 0.36], plateMat: M.METAL_DARK, fg: [0.90, 0.88, 0.80] });
  f.set(23, G + 9, -1, night ? M.BULB : M.GLASS); f.set(23, G + 9, -2, M.METAL_DARK);
  if (night) W.light({ x: x0 + 23.5, y: y1 + 2.5, z: G + 9, r: 34, cr: 0.90, cg: 0.62, cb: 0.30, skip: 1.5 });
  // la bouée sur le mur côté bassin
  for (let a = 0; a < 16; a++) { const t = a / 16 * Math.PI * 2; fe.set(Math.round(11 + Math.cos(t) * 2.2), Math.round(17 + Math.sin(t) * 2.2), -1, a % 4 < 2 ? M.PLASTIC_RED : M.PLASTIC_WHITE); }
  // la vigie vitrée, sur le toit
  const vx0 = 172, vy0 = 398;
  W.box(vx0, vy0, zt + 1, x1, vy0 + 18, zt + 2, M.CONCRETE);
  W.box(vx0, vy0, zt + 2, x1, vy0 + 18, zt + 13, M.PLASTER_CREAM);
  const vl = new Facade(W, LEFT, vx0, vy0, 18, 18), vr = new Facade(W, RIGHT, vx0, vy0, 18, 18);
  const vst = night ? 'office' : 'dark';
  vl.window(1, zt + 3, 16, 9, { state: vst, sill: false, lintel: false, frame: [0.86, 0.85, 0.80], spill: false, sil: night && !bad ? 'head' : null, silX: 20 });
  vr.window(1, zt + 3, 16, 9, { state: vst, sill: false, lintel: false, frame: [0.86, 0.85, 0.80], spill: false });
  W.box(vx0 - 1, vy0 - 1, zt + 13, x1 + 1, vy0 + 19, zt + 14, M.METAL_DARK); W.box(vx0 - 2, vy0 - 2, zt + 14, x1 + 2, vy0 + 20, zt + 15, M.WHITE);
  B.railing(W, vx0 - 3, vy0 + 20, x1 + 1, vy0 + 20, zt + 1, 3, M.WHITE, 3); B.railing(W, x1 + 1, vy0, x1 + 1, vy0 + 20, zt + 1, 3, M.WHITE, 3);
  if (night) W.light({ x: x1 + 3, y: vy0 + 21, z: zt + 8, r: 40, cr: 0.48, cg: 0.55, cb: 0.52, shadow: false });
  // le mât radio, la vergue et ses feux ; le mât de pavillon
  W.box(186, 402, zt + 15, 187, 403, zt + 34, M.METAL);
  W.box(181, 402, zt + 29, 192, 403, zt + 30, M.METAL);
  W.set(181, 402, zt + 28, M.RED_LIGHT); W.set(191, 402, zt + 28, M.PORT_FEU_VERT); W.set(186, 402, zt + 34, M.RED_LIGHT);
  W.box(158, 402, zt + 2, 159, 403, zt + 22, M.WHITE);
  for (let i = 0; i < 8; i++) W.box(159 + i, 402, zt + 17 + Math.floor(i / 3), 160 + i, 403, zt + 21 - Math.floor(i / 3), M.FLAG);
  // le tableau d'avis à la batellerie
  W.box(146, 441, G, 147, 442, G + 9, M.WOOD_DARK); W.box(152, 441, G, 153, 442, G + 9, M.WOOD_DARK);
  W.box(146, 441, G + 5, 153, 442, G + 11, M.WOOD_DARK);
  new Facade(W, LEFT, 146, 441, 7, 1).sign(0, G + 11, 'AVIS', { fg: [0.86, 0.84, 0.76], depth: 0 });
  W.box(147, 442, G + 6, 152, 443, G + 8, M.PAPER);
  k.places.push({ key: 'capitainerie', label: 'La capitainerie', x: x0 + 18, y: 441, z: G + 12 });
}

// ================================================================ le bassin
function bassin(k) {
  const { W, night, bad } = k;
  const bt = k.peint([0.12, 0.12, 0.13], { top: [0.80, 0.66, 0.16] });
  for (let y = 406; y < 552; y += 18) bitte(W, 193, y, bt);
  for (let x = 206; x < 334; x += 24) bitte(W, x, 557, bt);
  // la péniche du quai ouest, cale bâchée de panneaux verts
  const pd = peniche(k, { ax: 'y', x0: 201, y0: 400, L: 102, D: 20, proue: 'debut', zg: -1, coque: [0.38, 0.13, 0.10], bande: [0.10, 0.10, 0.11], nom: "L'OBSTINÉE", charge: 'couvert', couvercle: [0.22, 0.36, 0.26], voiture: M.CAR_BLUE, seed: 104 });
  for (const s of [6, 94]) { const [x, y] = pd.F.P(s, 0); ligne(W, 194, y, G + 2, x, y, pd.zg + 1, M.CANVAS); }
  // le pousseur et ses deux barges, le long du môle
  barge(k, { x0: 300, y0: 404, L: 94, D: 16, vrac: [0.80, 0.66, 0.38], num: 'R 1', seed: 5 });
  barge(k, { x0: 318, y0: 404, L: 94, D: 16, vrac: [0.50, 0.49, 0.46], galets: true, num: 'R 2', seed: 6 });
  pousseur(k, 304, 500);
  // la barge à conteneurs, sous le portique
  peniche(k, { ax: 'x', x0: 226, y0: 532, L: 100, D: 22, proue: 'fin', zg: -1, coque: [0.20, 0.22, 0.26], bande: [0.70, 0.40, 0.12], nom: 'LE PATIENT', charge: 'conteneurs', logement: 26, seed: 105 });
  conteneur(k, 282, 537, -1, 'x', 30, CONT[4], { portes: true });
  conteneur(k, 282, 537, 12, 'x', 30, CONT[1]);
  conteneur(k, 252, 537, -1, 'x', 30, CONT[6], { portes: false });
  // des big bags, des palettes, un chariot élévateur sur le quai ouest
  const blanc = k.peint([0.84, 0.83, 0.78]);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) bigbag(W, 156 + i * 6, 470 + j * 6, G, blanc);
  bigbag(W, 159, 473, G + 5, blanc);
  for (let i = 0; i < 4; i++) palette(W, 176, 500, G + i, 'y');
  chariot(k, 162, 512);
  projecteur(k, 152, 448, 52, [215, 500], { r: 140, col: [0.92, 0.96, 1.0], I: 0.9, on: !bad });
  // le bureau de manutention : deux conteneurs empilés, percés de fenêtres, un escalier
  conteneur(k, 152, 564, G, 'y', 61, [0.76, 0.74, 0.68], { portes: false });
  conteneur(k, 152, 564, G + 13, 'y', 61, [0.22, 0.36, 0.26], { portes: false });
  const fb = new Facade(W, RIGHT, 152, 564, 12, 61);
  for (const s of [8, 22, 40]) fb.window(s, G + 4, 6, 5, { state: night && !bad && s !== 40 ? 'office' : 'dark', sill: false, lintel: false, frame: [0.3, 0.3, 0.3], spill: false });
  for (const s of [12, 30]) fb.window(s, G + 17, 6, 5, { state: night && s === 12 ? 'office' : 'dark', sill: false, lintel: false, frame: [0.3, 0.3, 0.3], spill: false });
  fb.door(48, G, 5, 10, { mat: M.METAL_DARK, frame: false });
  for (let i = 0; i < 13; i++) W.box(164, 600 - i * 2, G + i, 167, 602 - i * 2, G + i + 1, M.METAL_DARK);
  B.railing(W, 167, 576, 167, 601, G, 14, M.METAL_DARK, 4);
  ecrire(W, RIGHT, 163, 600, G + 27, 'MANUTENTION', { fg: [0.86, 0.84, 0.76] });
  // sur le terre-plein, deux châssis porte-conteneurs dételés, en attente
  camion(k, 172, 630, 'y', 1, { attelee: false, remorque: 'conteneur', cont: CONT[2] });
  camion(k, 184, 630, 'y', 1, { attelee: false, remorque: 'conteneur', cont: CONT[9] });
}
function chariot(k, x, y) {
  const { W } = k;
  const j = k.peint([0.80, 0.60, 0.14], { grime: 0.3 });
  W.box(x, y + 1, G + 1, x + 7, y + 6, G + 5, M.METAL, j);
  W.box(x, y, G, x + 2, y + 1, G + 3, M.TIRE); W.box(x + 5, y, G, x + 7, y + 1, G + 3, M.TIRE); W.box(x, y + 6, G, x + 2, y + 7, G + 3, M.TIRE); W.box(x + 5, y + 6, G, x + 7, y + 7, G + 3, M.TIRE);
  W.box(x + 1, y + 2, G + 5, x + 5, y + 5, G + 11, M.METAL_DARK); W.box(x + 1, y + 2, G + 11, x + 5, y + 5, G + 12, M.METAL_DARK);
  W.box(x + 7, y + 1, G, x + 8, y + 6, G + 13, M.METAL_DARK);
  W.box(x + 8, y + 1, G, x + 13, y + 2, G + 1, M.METAL_DARK); W.box(x + 8, y + 5, G, x + 13, y + 6, G + 1, M.METAL_DARK);
}

// ================================================================ le portique à conteneurs
function portique(k) {
  const { W, night, bad } = k;
  const BL = k.peint([0.20, 0.33, 0.50], { rust: 0.2, seed: 51 });
  const CH = k.peint([0.80, 0.62, 0.16], { pat: 'chevrons' });
  const GR = k.peint([0.52, 0.56, 0.60], { pat: 'ribs', rust: 0.15, grime: 0.2, seed: 53 });
  const xs = [246, 290], zT = 70;
  for (const y of [564, 606]) W.box(198, y, 1, 336, y + 1, 2, M.PORT_RAIL);
  for (const x of xs) for (const y of [562, 604]) {
    W.box(x - 3, y, G, x + 7, y + 4, G + 4, M.METAL_DARK, CH);
    W.box(x, y, G + 4, x + 4, y + 4, zT, M.METAL, BL);
  }
  // les traverses basses, les deux poutres (de 30 m sur l'eau à l'arrière des pieds), les entretoises
  for (const x of xs) { W.box(x, 566, 42, x + 4, 604, 45, M.METAL, BL); W.box(x, 506, zT, x + 4, 618, zT + 5, M.METAL, BL); }
  for (const y of [506, 562, 604, 614]) W.box(xs[0], y, zT, xs[1] + 4, y + 4, zT + 5, M.METAL, BL);
  for (const x of xs) W.box(x + 1, 563, zT + 5, x + 3, 565, zT + 20, M.METAL, BL);
  W.box(xs[0] + 1, 563, zT + 18, xs[1] + 3, 565, zT + 20, M.METAL, BL);
  for (const x of xs) { ligne(W, x + 2, 564, zT + 19, x + 2, 507, zT + 5, M.METAL_DARK); ligne(W, x + 2, 564, zT + 19, x + 2, 617, zT + 5, M.METAL_DARK); }
  // la salle des machines, posée sur l'arrière, et le nom du port sur l'entretoise
  W.box(xs[0] + 6, 600, zT + 5, xs[1] - 2, 616, zT + 13, M.METAL, GR);
  W.box(xs[0] + 5, 599, zT + 13, xs[1] - 1, 617, zT + 14, M.METAL_DARK);
  ecrire(W, LEFT, 617, xs[0] + 10, zT + 4, 'PORT DE LA RIVE', { fg: [0.88, 0.86, 0.80] });
  // le chariot, la cabine du grutier, les câbles, le palonnier, le conteneur soulevé
  const ty = 534;
  W.box(xs[0] + 3, ty, zT + 5, xs[1] + 1, ty + 14, zT + 9, M.METAL, BL);
  W.box(262, ty + 6, zT - 10, 272, ty + 14, zT, M.METAL, GR);
  new Facade(W, LEFT, 262, ty + 6, 10, 8).window(1, zT - 8, 8, 6, { state: night && !bad ? 'office' : 'dark', sill: false, lintel: false, frame: [0.3, 0.3, 0.3], spill: false });
  const cz = 32;
  for (const [x, y] of [[257, ty + 1], [284, ty + 1], [257, ty + 10], [284, ty + 10]]) ligne(W, x, y, zT + 4, x, y, cz + 15, M.METAL_DARK);
  W.box(254, ty, cz + 13, 288, ty + 12, cz + 15, M.METAL, CH);
  conteneur(k, 256, ty, cz, 'x', 30, CONT[0]);
  for (const x of [xs[0] + 1, xs[1] + 2]) W.set(x, 506, zT + 5, night ? M.RED_LIGHT : M.PLASTIC_RED);
  W.set(xs[0] + 22, 564, zT + 20, night ? M.RED_LIGHT : M.PLASTIC_RED);
  if (night && !bad) {
    W.light({ x: 268, y: 548, z: zT - 2, r: 110, fall: 1.4, cr: 0.95, cg: 1.0, cb: 1.05, axis: [0, 0.15, -0.99], c0: 0.35, c1: 0.8, spill: 0.05, skip: 4 });
    W.light({ x: 268, y: 590, z: zT - 2, r: 100, fall: 1.4, cr: 0.95, cg: 1.0, cb: 1.05, axis: [0, 0.2, -0.98], c0: 0.35, c1: 0.8, spill: 0.05, skip: 4 });
  }
  // le camion qui attend son conteneur, sous le portique
  camion(k, 214, 568, 'x', 1, { cab: [0.18, 0.30, 0.52], remorque: 'conteneur', cont: CONT[8], phares: !bad });
}

// ================================================================ le parc à conteneurs
function parcConteneurs(k) {
  const { W, R, night, bad } = k;
  const rows = [612, 626, 640, 672, 686, 700];
  for (const y of rows) {
    let x = 200;
    while (x < 330) {
      if (y >= 672 && x >= 226 && x < 266) { x = 266; continue; }
      if (y === 700 && x >= 266 && x < 284) { x = 284; continue; }
      let len = R() < 0.55 ? 61 : 30;
      if (y >= 672 && x < 226 && x + len > 226) len = 30;
      if (x + len > 334) { if (x + 30 <= 334) len = 30; else break; }
      const tiers = 1 + Math.floor(R() * (y < 650 ? 4 : 3));
      for (let t = 0; t < tiers; t++) {
        const col = CONT[Math.floor(R() * CONT.length)];
        conteneur(k, x, y, G + t * 13, 'x', len, col, { portes: R() < 0.5, rouille: R() * 0.7 });
      }
      x += len + 2;
    }
  }
  // les tags, en mauvaise saison
  if (bad) {
    ecrire(W, LEFT, 711, 268, G + 9, 'KRAZ', { fg: [0.86, 0.85, 0.80] });
    ecrire(W, LEFT, 711, 300, G + 8, 'RIVE 91', { fg: [0.72, 0.12, 0.12] });
  }
  // la grille sur l'avenue, la guérite, la barrière
  grillage(W, 196, 716, 336, 717, 11, { barbele: true, trous: [[32, 68]] });
  grillage(W, 335, 560, 336, 716, 11, { barbele: true });
  W.box(268, 702, G, 280, 714, G + 12, M.PLASTER_GREY);
  B.flatRoof(W, 267, 701, 14, 14, G + 12, M.PLASTER_GREY, { parapet: 1 });
  const fg = new Facade(W, LEFT, 268, 702, 12, 12), fgr = new Facade(W, RIGHT, 268, 702, 12, 12);
  fg.window(2, G + 5, 8, 5, { state: night ? 'office' : 'dark', sill: false, lintel: false, frame: [0.3, 0.3, 0.3], spill: false, sil: night ? 'head' : null, silX: 6 });
  fgr.door(3, G, 5, 10, { mat: M.METAL, frame: false });
  W.box(266, 712, G, 267, 713, G + 7, M.METAL_DARK); W.box(229, 712, G + 6, 266, 713, G + 7, M.BARRIER);
  new Facade(W, LEFT, 228, 716, 36, 1).sign(2, G + 18, 'PARC À CONTENEURS', { plate: [0.18, 0.30, 0.48], plateMat: M.METAL_DARK, fg: [0.90, 0.88, 0.80] });
  W.box(228, 716, G, 229, 717, G + 19, M.METAL_DARK); W.box(263, 716, G, 264, 717, G + 19, M.METAL_DARK);
  if (night) W.light({ x: 274, y: 717, z: G + 9, r: 26, cr: 0.5, cg: 0.55, cb: 0.5, shadow: false });
  // le cavalier (chariot porte-conteneur), dans l'allée
  cavalier(k, 280, 655, CONT[2]);
  projecteur(k, 198, 664, 60, [262, 640], { r: 170, col: [0.92, 0.96, 1.0] });
  projecteur(k, 333, 666, 60, [272, 690], { r: 170, col: [0.92, 0.96, 1.0], on: !bad });
  projecteur(k, 333, 590, 60, [280, 560], { r: 150, col: [0.92, 0.96, 1.0] });
}
function cavalier(k, x, y, col) {
  const { W } = k;
  const j = k.peint([0.78, 0.56, 0.12], { grime: 0.3 });
  for (const xx of [x + 2, x + 26]) { W.box(xx, y, G, xx + 6, y + 2, G + 6, M.TIRE); W.box(xx, y + 12, G, xx + 6, y + 14, G + 6, M.TIRE); }
  W.box(x, y + 1, G + 3, x + 36, y + 13, G + 9, M.METAL, j);
  W.box(x + 4, y + 2, G + 9, x + 14, y + 12, G + 18, M.METAL, j);
  W.box(x + 5, y + 12, G + 11, x + 13, y + 13, G + 17, M.CAR_GLASS);
  ligne(W, x + 16, y + 7, G + 10, x + 38, y + 7, G + 30, M.METAL, j, 2);
  W.box(x + 30, y - 1, G + 30, x + 44, y + 15, G + 32, M.METAL, k.peint([0.80, 0.62, 0.16], { pat: 'chevrons' }));
  conteneur(k, x + 22, y + 1, G + 17, 'x', 30, col);
}

// ================================================================ la halle aux sables
function halleSables(k) {
  const { W, night, bad } = k;
  const tas = (cx, cy, rx, ry, h, col, galets) => {
    const t = W.obj({ type: 'port_vrac', col, galets });
    for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
      const d = Math.hypot((x + 0.5 - cx) / rx, (y + 0.5 - cy) / ry); if (d >= 1) continue;
      const hh = Math.round(h * Math.pow(1 - d, 0.8) + 1.2 * (hash(x, y, 1601, 0) - 0.5));
      if (hh > 0) W.box(x, y, G, x + 1, y + 1, G + hh, M.GRAVEL, t);
    }
  };
  // dehors, au fond : les tas à ciel ouvert, entre des blocs de béton empilés
  const bloc = (x, y, z) => { W.box(x, y, z, x + 6, y + 3, z + 3, M.CONCRETE); W.set(x + 1, y + 1, z + 3, M.CONCRETE); W.set(x + 4, y + 1, z + 3, M.CONCRETE); };
  for (let x = 4; x < 112; x += 6) { bloc(x, 452, G); if (x % 12 === 4) bloc(x, 452, G + 3); }
  for (const x of [38, 76]) for (let y = 455; y < 500; y += 3) { W.box(x, y, G, x + 3, y + 3, G + 3, M.CONCRETE); if (y % 6 === 2) W.box(x, y, G + 3, x + 3, y + 3, G + 6, M.CONCRETE); }
  tas(21, 478, 16, 22, 18, [0.52, 0.50, 0.47], true);
  tas(58, 480, 16, 22, 16, [0.80, 0.66, 0.40], false);
  tas(96, 478, 16, 20, 12, [0.13, 0.12, 0.12], true);
  // la halle : trois nefs de 36, faîtage le long de y, pignons au sud ; tôle sombre, plaques translucides
  const y0 = 516, y1 = 600, ze = 26;
  const toit = k.peint([0.31, 0.32, 0.32], { pat: 'ondes', axe: 'y', rust: 0.15, seed: 81 });
  const clair = k.peint([0.46, 0.48, 0.44], { pat: 'ondes', axe: 'y', seed: 82 });
  const bard = k.peint([0.40, 0.42, 0.40], { pat: 'ribs', rust: 0.25, streaks: 0.3, seed: 83 });
  W.box(6, y0, G, 114, y0 + 3, G + 12, M.CONCRETE); W.box(6, y0, G + 12, 114, y0 + 2, ze, M.METAL, bard);
  for (const x of [6, 42, 78, 112]) { W.box(x, y0 + 3, G, x + 2, y1 - 30, G + 10, M.CONCRETE); for (const y of [y0 + 30, y1 - 2]) W.box(x, y, G, x + 2, y + 2, ze, M.METAL_DARK); }
  [['SABLE', [0.80, 0.66, 0.40], false], ['GRAVIER', [0.52, 0.50, 0.47], true], ['CONCASSÉ', [0.56, 0.32, 0.26], true]].forEach(([mot, col, gal], i) => {
    const x0 = 6 + i * 36;
    for (let kk = 0; ; kk++) {
      const xa = x0 - 1 + 2 * kk, xb = x0 + 37 - 2 * kk; if (xb - xa <= 0) break;
      for (let y = y0; y < y1; y++) W.box(xa, y, ze + kk, xb, y + 1, ze + kk + 1, M.METAL, mod(y - y0, 21) < 3 && kk > 1 ? clair : toit);
      if (xb - xa > 4) W.box(xa + 2, y1 - 1, ze + kk, xb - 2, y1, ze + kk + 1, M.METAL, bard);
    }
    W.box(x0, y1 - 2, ze - 2, x0 + 36, y1, ze, M.METAL_DARK);
    ecrire(W, LEFT, y1 - 1, x0 + 18 - (largeur(mot) >> 1), ze + 5, mot, { fg: [0.88, 0.86, 0.80], worn: 0.15, seed: i });
    tas(x0 + 18, 572, 15, 24, 15 - 2 * i, col, gal);
    if (night && !bad) { W.set(x0 + 18, 560, ze - 1, M.BULB); W.light({ x: x0 + 18.5, y: 562, z: ze - 2, r: 48, fall: 1.8, cr: 1.0, cg: 0.66, cb: 0.32, spot: 0.6, skip: 2 }); }
  });
  grillage(W, 0, 448, 1, 652, 11, { trous: [[156, 176]] });
  // devant : la chargeuse, le camion-benne qu'elle remplit
  chargeuse(k, 70, 608);
  camion(k, 4, 622, 'x', 1, { cab: [0.62, 0.62, 0.60], remorque: 'benne', L: 70 });
}
function chargeuse(k, x, y) {
  const { W } = k;
  const j = k.peint([0.80, 0.60, 0.14], { grime: 0.3 });
  for (const xx of [x + 2, x + 18]) { W.box(xx, y, G, xx + 7, y + 2, G + 7, M.TIRE); W.box(xx, y + 12, G, xx + 7, y + 14, G + 7, M.TIRE); }
  W.box(x, y + 2, G + 3, x + 28, y + 12, G + 9, M.METAL, j);
  W.box(x + 2, y + 3, G + 9, x + 10, y + 11, G + 18, M.METAL, j);
  W.box(x + 2, y + 11, G + 11, x + 10, y + 12, G + 17, M.CAR_GLASS); W.box(x + 10, y + 4, G + 11, x + 11, y + 10, G + 17, M.CAR_GLASS);
  W.box(x + 1, y + 2, G + 18, x + 11, y + 12, G + 19, M.METAL, j);
  ligne(W, x + 24, y + 3, G + 8, x + 32, y + 3, G + 14, M.METAL_DARK, 0, 1); ligne(W, x + 24, y + 10, G + 8, x + 32, y + 10, G + 14, M.METAL_DARK, 0, 1);
  W.box(x + 31, y, G + 9, x + 36, y + 14, G + 15, M.METAL_DARK);
  W.box(x + 32, y + 1, G + 12, x + 36, y + 13, G + 15, 0);
  W.box(x + 32, y + 1, G + 10, x + 35, y + 13, G + 12, M.GRAVEL, W.obj({ type: 'port_vrac', col: [0.80, 0.66, 0.40] }));
}

// ================================================================ le Relais des routiers
function relais(k) {
  const { W, night, bad, day } = k;
  const x0 = 12, x1 = 104, y0 = 664, y1 = 722, zt = 20;
  W.box(x0, y0, G, x1, y1, zt, M.PLASTER_CREAM);
  W.box(x0, y1 - 1, G, x1, y1, G + 4, M.BRICK); W.box(x1 - 1, y0, G, x1, y1, G + 4, M.BRICK);
  const rouge = k.peint([0.58, 0.12, 0.10]);
  W.box(x0, y1 - 1, zt - 4, x1, y1 + 1, zt, M.METAL, rouge); W.box(x1 - 1, y0, zt - 4, x1 + 1, y1 + 1, zt, M.METAL, rouge);
  B.flatRoof(W, x0, y0, x1 - x0, y1 - y0, zt, M.PLASTER_CREAM, { parapet: 1 });
  const f = new Facade(W, LEFT, x0, y0, x1 - x0, y1 - y0), fe = new Facade(W, RIGHT, x0, y0, x1 - x0, y1 - y0);
  const ouvert = night; // le relais ne ferme pas : la nuit, tout est allumé
  [4, 13, 22, 31, 54, 63, 72, 81].forEach((s, i) => {
    const st = !ouvert ? 'dark' : i === 6 ? 'tv' : 'lit';
    f.window(s, G + 5, 8, 9, { state: st, sill: true, lintel: false, frame: [0.55, 0.12, 0.10], curtain: [0.72, 0.60, 0.40], col: [1.0, 0.78, 0.48], sil: ouvert && (i === 2 || i === 4) ? 'head' : null, silX: 6, spill: false, seed: i });
  });
  f.door(42, G, 8, 12, { kind: ouvert ? 'door' : null, mat: M.METAL_DARK, frameMat: M.METAL_DARK });
  f.awning(41, 10, G + 15, 4, M.AWNING);
  if (ouvert) W.light({ x: x0 + 46, y: y1 + 3, z: G + 9, r: 40, cr: 1.0, cg: 0.70, cb: 0.36, skip: 2 });
  // l'enseigne sur le toit : RELAIS en tubes rouges, ROUTIERS en tubes bleus ; en mauvaise saison, des lettres mortes
  W.box(22, 717, zt + 1, 94, 719, zt + 22, M.METAL_DARK);
  for (const x of [26, 56, 88]) { W.box(x, 712, zt + 1, x + 2, 717, zt + 3, M.METAL_DARK); ligne(W, x, 712, zt + 2, x, 717, zt + 18, M.METAL_DARK); }
  neon(W, LEFT, 718, 35, zt + 21, 'RELAIS', { scale: 4, col: [1.45, 0.24, 0.16], on: night, etats: bad ? ['on', 'on', 'gone', 'on', 'dim', 'on'] : null });
  neon(W, LEFT, 718, 42, zt + 8, 'ROUTIERS', { scale: 2, col: [0.36, 0.62, 1.45], on: night, etats: bad ? ['on', 'dim', 'on', 'on', 'gone', 'on', 'on', 'on'] : null });
  if (night) {
    W.box(22, 719, zt + 21, 94, 720, zt + 22, M.PORT_NEON_BLEU); W.box(22, 719, zt + 1, 94, 720, zt + 2, M.PORT_NEON_BLEU);
    W.light({ x: 58, y: 724, z: zt + 15, r: 56, cr: 1.1, cg: 0.20, cb: 0.14, shadow: false });
    W.light({ x: 58, y: 724, z: zt + 5, r: 40, cr: 0.20, cg: 0.36, cb: 0.95, shadow: false });
  }
  // le totem au bord de l'avenue
  W.box(110, 724, G, 112, 726, G + 40, M.METAL_DARK);
  W.box(104, 723, G + 28, 118, 727, G + 40, M.METAL, rouge);
  new Facade(W, LEFT, 104, 723, 14, 4).sign(1, G + 38, 'BAR', { fg: [1.0, 0.92, 0.80], emit: night ? [1.4, 1.2, 0.9] : null, depth: 0, scale: 2 });
  new Facade(W, LEFT, 104, 723, 14, 4).sign(1, G + 32, 'NUIT', { fg: [1.0, 0.92, 0.80], emit: night ? [1.2, 1.0, 0.75] : null, depth: 0 });
  if (night) W.light({ x: 111, y: 729, z: G + 34, r: 30, cr: 0.9, cg: 0.3, cb: 0.2, shadow: false });
  // le côté : la cuisine, sa porte, les poubelles, les casiers, les bouteilles de gaz
  fe.window(10, G + 7, 6, 6, { state: night ? 'lit' : 'dark', col: [0.9, 0.95, 0.85], sill: false, spill: false });
  fe.window(20, G + 7, 6, 6, { state: night ? 'lit' : 'dark', col: [0.9, 0.95, 0.85], sill: false, spill: false });
  fe.door(32, G, 6, 11, { mat: M.METAL, frame: false });
  fe.sign(40, G + 12, 'DOUCHES', { plate: [0.18, 0.30, 0.48], plateMat: M.METAL_DARK, fg: [0.90, 0.88, 0.80] });
  B.bin(W, 105, 700, G); B.bin(W, 105, 703, G); B.crates(W, 105, 690, G, 3, M.CRATE_GREEN);
  for (const y of [680, 683]) { W.box(105, y, G, 107, y + 2, G + 6, M.PLASTIC_RED); W.set(105, y, G + 6, M.METAL); }
  // deux voitures garées le long du relais
  B.car(W, 106, 640, G, 'y', M.CAR_BEIGE); B.car(W, 8, 640, G, 'y', M.CAR_BORD);
  k.places.push({ key: 'relais_routiers', label: 'Le Relais des routiers', x: x0 + 46, y: 726, z: G + 12 });
}

// ================================================================ le parking des poids lourds
function parkingPL(k) {
  const { W, night, bad } = k;
  for (const x of [4, 26, 48, 70, 92, 114]) W.box(x, 768, 1, x + 1, 856, 2, M.ROADLINE);
  camion(k, 8, 768, 'y', 1, { cab: [0.62, 0.62, 0.60], remorque: 'bache', bache: [0.22, 0.34, 0.54], texte: 'PORTCLAIR FRET', cabineAllumee: true });
  camion(k, 30, 768, 'y', 1, { cab: [0.55, 0.12, 0.10], remorque: 'citerne', citerne: [0.74, 0.74, 0.72] });
  if (!bad) camion(k, 52, 768, 'y', 1, { cab: [0.20, 0.40, 0.30], remorque: 'frigo', cabineAllumee: true });
  camion(k, 96, 768, 'y', 1, { cab: [0.80, 0.78, 0.72], remorque: 'conteneur', cont: CONT[4] });
  projecteur(k, 140, 860, 48, [60, 812], { r: 140, col: [1.0, 0.70, 0.36], I: 0.9 });
}

// ================================================================ les maisons du port
function maisons(k) {
  const { W, night, bad } = k;
  const rh = (x, y, z) => hash(x, y, z, 1901);
  const etat = (x, y) => { const v = rh(x, y, 1); if (!night) return 'dark'; const p = bad ? 0.25 : 0.5; return v < p ? 'lit' : v < p + 0.1 ? 'tv' : 'dark'; };
  const H = [
    { x0: 8, x1: 40, y0: 904, mur: M.BRICK, toit: M.TERRACOTTA, zt: 28, axis: 'x' },
    { x0: 48, x1: 84, y0: 914, mur: M.PLASTER_OCHRE, toit: M.SLATE, zt: 17, axis: 'y' },
    { x0: 92, x1: 136, y0: 898, mur: M.PLASTER_GREY, toit: null, zt: 26, axis: null },
  ];
  const y1 = 950;
  for (const h of H) {
    W.box(h.x0, h.y0, G, h.x1, y1, h.zt, h.mur);
    if (h.toit) B.gableRoof(W, h.x0, h.y0, h.x1 - h.x0, y1 - h.y0, h.zt, h.toit, { axis: h.axis, oh: 1, slope: 2, gable: h.mur });
    else B.flatRoof(W, h.x0, h.y0, h.x1 - h.x0, y1 - h.y0, h.zt, h.mur, { parapet: 2 });
    const f = new Facade(W, LEFT, h.x0, h.y0, h.x1 - h.x0, y1 - h.y0);
    const w = h.x1 - h.x0;
    f.door(3, G, 5, 11, { mat: M.WOOD_DARK, step: true });
    for (let s = 11; s + 5 < (h.toit ? w : 28); s += 10) f.window(s, G + 5, 5, 7, { state: etat(h.x0 + s, 1), shutter: M.SHUTTER_GREEN, closed: bad && rh(h.x0, s, 3) < 0.4, spillR: 16, spillI: 0.35 });
    if (h.zt > 20) for (let s = 3; s + 5 < w; s += 10) f.window(s, G + 17, 5, 6, { state: etat(h.x0 + s, 2), shutter: M.SHUTTER_GREEN, spill: false });
  }
  // le garage de la maison grise, la lanterne de la maison de brique
  new Facade(W, LEFT, 92, 898, 44, 52).door(28, G, 12, 11, { mat: M.SHUTTER_GREY, frame: false });
  if (night) { W.set(14, 951, G + 13, M.BULB); W.light({ x: 14.5, y: 953, z: G + 12, r: 30, cr: 0.9, cg: 0.6, cb: 0.3, skip: 1.5 }); }
  B.chimney(W, 30, 920, 37, 6); B.antenna(W, 120, 910, 27, 10);
  // les jardins : potagers, cabane, linge, clôtures basses
  for (let y = 866; y < 900; y += 4) W.box(10, y, 1, 38, y + 2, 2, M.SOIL);
  for (let y = 868; y < 900; y += 4) for (let x = 11; x < 38; x += 2) if (rh(x, y, 4) < 0.7) W.set(x, y, 2, M.HEDGE);
  W.box(52, 870, G, 64, 880, G + 8, M.WOOD); W.box(51, 869, G + 8, 65, 881, G + 9, M.FRI_TOLE);
  for (let x = 96; x < 132; x++) { W.set(x, 880, G + 9, M.METAL_DARK); if (x % 3 === 0 && rh(x, 0, 5) < 0.7) { const m = [M.WHITE, M.CAR_BLUE, M.PLASTIC_RED, M.CANVAS][Math.floor(rh(x, 0, 6) * 4)]; W.box(x, 880, G + 5, x + 2, 881, G + 9, m); } }
  W.box(95, 880, G, 96, 881, G + 10, M.WOOD_DARK); W.box(132, 880, G, 133, 881, G + 10, M.WOOD_DARK);
  for (const x of [44, 88]) for (let y = 864; y < 950; y++) if (y % 2 === 0) W.box(x, y, G, x + 1, y + 1, G + 4, M.WOOD);
  B.planeTree(W, 74, 884, G, { seed: 77, trunk: 10, r: 7 });
  for (let y = 862; y < 950; y++) if (hash(0, y, 1903, 0) < 0.85) W.box(0, y, G, 3, y + 1, G + 4 + Math.floor(hash(1, y, 1903, 0) * 3), M.HEDGE);
}

// ================================================================ la casse
function casse(k) {
  const { W, R, night, bad, day } = k;
  // le mur de vieux conteneurs sur l'avenue, la palissade de tôle, le grillage
  for (let x = 224; x + 30 <= 314; x += 30) { conteneur(k, x, 768, G, 'x', 30, CONT[Math.floor(R() * CONT.length)], { portes: false, rouille: 0.8 }); if (R() < 0.6) conteneur(k, x, 768, G + 13, 'x', 30, CONT[Math.floor(R() * CONT.length)], { portes: false, rouille: 0.8 }); }
  W.box(144, 802, G, 146, 952, G + 13, M.FRI_TOLE);
  grillage(W, 146, 950, 315, 951, 11, { barbele: true });
  grillage(W, 314, 780, 315, 950, 11, { barbele: true });
  ecrire(W, LEFT, 779, 232, G + 11, 'CASSE AUTO', { scale: 2, fg: [0.86, 0.84, 0.76], worn: 0.15 });
  // le bureau : une baraque de tôle, son enseigne, sa porte sur l'allée
  const tole = k.peint([0.36, 0.40, 0.34], { pat: 'ribs', rust: 0.4, seed: 71 });
  W.box(150, 768, G, 194, 800, G + 14, M.METAL, tole);
  B.gableRoof(W, 149, 767, 46, 34, G + 14, M.FRI_TOLE, { axis: 'x', oh: 0, slope: 4 });
  const fb = new Facade(W, LEFT, 150, 768, 44, 32), fr = new Facade(W, RIGHT, 150, 768, 44, 32);
  fr.door(12, G, 6, 11, { mat: M.WOOD_DARK, frameMat: M.METAL_DARK, step: true });
  fr.window(22, G + 5, 6, 5, { state: night ? (bad ? 'dark' : 'tv') : 'dark', sill: false, lintel: false, frame: [0.3, 0.3, 0.3], seed: 3, spillR: 16, spillI: 0.3 });
  fb.window(8, G + 5, 8, 5, { state: night && !bad ? 'lit' : 'dark', sill: false, lintel: false, frame: [0.3, 0.3, 0.3], spill: false });
  fb.sign(20, G + 12, 'FERRAILLE', { plate: [0.82, 0.78, 0.66], plateMat: M.WOOD, fg: [0.45, 0.10, 0.10], padX: 1, padY: 1, worn: 0.1 });
  W.box(154, 799, G + 15, 190, 801, G + 26, M.WOOD);
  new Facade(W, LEFT, 154, 799, 36, 2).sign(2, G + 25, 'CASSE', { scale: 2, fg: [0.62, 0.12, 0.10], depth: 0 });
  new Facade(W, LEFT, 154, 799, 36, 2).sign(4, G + 19, 'PIÈCES AUTO', { fg: [0.12, 0.12, 0.12], depth: 0 });
  W.box(171, 801, G + 26, 172, 805, G + 27, M.METAL_DARK); W.set(171, 804, G + 25, night ? M.BULB : M.GLASS);
  if (night) W.light({ x: 171.5, y: 805, z: G + 24, r: 30, fall: 1.6, cr: 1.0, cg: 0.72, cb: 0.38, axis: [0, -0.5, -0.87], c0: 0.2, c1: 0.7, spill: 0.15, skip: 1.5 });
  if (night) { fr.set(15, G + 13, -1, M.BULB); W.light({ x: 197.5, y: 783, z: G + 12, r: bad ? 22 : 30, cr: 0.95, cg: 0.66, cb: 0.32, skip: 1.5 }); }
  // le portail ouvert sur l'allée
  for (const x of [196, 221]) W.box(x, 800, G, x + 1, 802, G + 14, M.METAL_DARK);
  for (let y = 802; y < 816; y += 2) W.box(196, y, G, 197, y + 1, G + 12, M.METAL);
  // les rangées de voitures empilées
  const PEINT = [[0.40, 0.11, 0.14], [0.64, 0.58, 0.46], [0.27, 0.35, 0.45], [0.72, 0.71, 0.66], [0.20, 0.30, 0.22], [0.55, 0.40, 0.14], [0.50, 0.12, 0.10], [0.25, 0.25, 0.27]];
  for (const y of [816, 834, 852, 870]) {
    for (let x = 228; x + 19 <= 308; x += 20) {
      const n = 1 + Math.floor(R() * 3);
      for (let t = 0; t < n; t++) epave(k, x, y + (t % 2), G + t * 7, 'x', PEINT[Math.floor(R() * PEINT.length)], { inv: R() < 0.5 });
    }
  }
  for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) epave(k, 156 + j * 20, 812, G + i * 4, 'x', PEINT[Math.floor(R() * PEINT.length)], { cube: true });
  // la pelle à grappin, une voiture dans les mâchoires
  pelle(k, 236, 900);
  // la presse, les pneus, les moteurs
  const presse = k.peint([0.26, 0.40, 0.30], { rust: 0.4, seed: 72 });
  W.box(272, 896, G, 306, 912, G + 8, M.METAL, presse); W.box(274, 898, G + 3, 304, 910, G + 8, 0);
  W.box(296, 896, G + 8, 306, 912, G + 18, M.METAL, presse); W.box(296, 912, G, 306, 918, G + 6, M.METAL_DARK);
  epave(k, 278, 900, G + 3, 'x', PEINT[2], { cube: true });
  for (const [x, y, n] of [[168, 920, 4], [176, 926, 3], [164, 930, 2], [182, 918, 2]]) pneus(W, x, y, G, n);
  for (let i = 0; i < 26; i++) { const x = 200 + Math.floor(R() * 24), y = 924 + Math.floor(R() * 20), h = 1 + Math.floor(R() * 3); W.box(x, y, G, x + 2, y + 2, G + h, R() < 0.6 ? M.METAL_DARK : M.FRI_ROUILLE); }
  // l'appentis aux pièces
  W.box(150, 880, G, 152, 916, G + 16, M.METAL_DARK);
  for (const y of [880, 914]) W.box(186, y, G, 188, y + 2, G + 14, M.METAL_DARK);
  for (let k2 = 0; k2 <= 38; k2++) W.box(150, 880 + k2 - 1, G + 16 - Math.floor(k2 / 13), 190, 880 + k2, G + 17 - Math.floor(k2 / 13), M.FRI_TOLE);
  for (let y = 884; y < 912; y += 6) { W.box(153, y, G, 160, y + 4, G + 12, M.WOOD_DARK); for (let z = G + 2; z < G + 12; z += 3) W.box(154, y, z, 160, y + 4, z + 1, hash(y, z, 1, 1) < 0.5 ? M.METAL : M.FRI_ROUILLE); }
  // la niche, le chien
  W.box(300, 786, G, 305, 791, G + 5, M.WOOD); W.box(299, 785, G + 5, 306, 792, G + 6, M.FRI_TOLE);
  projecteur(k, 232, 806, 44, [262, 852], { r: 130, col: [1.0, 0.72, 0.40], I: 0.9, on: !bad });
  if (bad) { epave(k, 200, 860, G, 'x', [0.2, 0.2, 0.2], { brule: true }); if (night) W.light({ x: 210, y: 864, z: G + 4, r: 26, cr: 0.9, cg: 0.3, cb: 0.06, shadow: false }); }
  k.places.push({ key: 'casse', label: 'La casse', x: 197, y: 783, z: G + 12 });
}
// La pelle à grappin : chenilles, tourelle, cabine, bras, le grappin qui tient une épave.
function pelle(k, x, y) {
  const { W } = k;
  const j = k.peint([0.70, 0.54, 0.14], { rust: 0.3, grime: 0.3, seed: 73 });
  for (const yy of [y, y + 12]) { W.box(x, yy, G, x + 26, yy + 4, G + 5, M.TIRE); W.box(x + 1, yy, G + 5, x + 25, yy + 4, G + 6, M.METAL_DARK); }
  W.box(x + 6, y + 4, G + 3, x + 20, y + 12, G + 6, M.METAL_DARK);
  W.box(x + 1, y + 1, G + 6, x + 23, y + 15, G + 13, M.METAL, j);
  W.box(x + 14, y + 8, G + 13, x + 22, y + 15, G + 24, M.METAL, j);
  W.box(x + 15, y + 15, G + 16, x + 21, y + 16, G + 22, M.CAR_GLASS); W.box(x + 22, y + 9, G + 16, x + 23, y + 14, G + 22, M.CAR_GLASS);
  ligne(W, x + 18, y + 6, G + 13, x + 36, y + 6, G + 44, M.METAL, j, 2);
  ligne(W, x + 37, y + 7, G + 44, x + 44, y + 7, G + 24, M.METAL, j, 2);
  for (const [dx, dy] of [[-3, -3], [3, -3], [-3, 3], [3, 3]]) ligne(W, x + 45, y + 8, G + 23, x + 45 + dx, y + 8 + dy, G + 15, M.METAL_DARK, 0, 1);
  epave(k, x + 36, y + 4, G + 8, 'x', [0.27, 0.35, 0.45]);
}

// ================================================================ le faisceau de voies
function faisceau(k) {
  const { W, night, bad } = k;
  for (const yc of [972, 992, 1012]) voie(k, 12, 296, yc);
  for (const cy of [920, 940, 960]) voieArc(k, 346.5 - 52, cy, 52, 0, Math.PI / 2);
  for (const yc of [972, 992, 1012]) { W.box(6, yc - 6, G, 12, yc + 7, G + 4, M.CONCRETE); W.box(10, yc - 4, G + 4, 12, yc + 5, G + 6, M.BARRIER); }
  grillage(W, 0, 959, 144, 960, 9, { trous: [[60, 72]] });
  grillage(W, 0, 961, 1, 1034, 9);
  wagon(k, 20, 972, 'couvert', { L: 46 }); wagon(k, 70, 972, 'couvert', { L: 46, col: [0.30, 0.26, 0.22] }); wagon(k, 120, 972, 'couvert', { L: 46 });
  wagon(k, 30, 992, 'citerne', { L: 44 }); wagon(k, 78, 992, 'citerne', { L: 44, col: [0.70, 0.70, 0.68], bande: [0.22, 0.36, 0.26] }); wagon(k, 160, 992, 'tombereau', { L: 40 });
  wagon(k, 24, 1012, 'plat', { L: 64, cont: [CONT[1], CONT[5]] }); wagon(k, 94, 1012, 'plat', { L: 64, cont: [CONT[0]] }); wagon(k, 210, 1012, 'loco', { L: 32 });
  if (bad) { ecrire(W, LEFT, 979, 24, 18, 'KOP', { fg: [0.86, 0.72, 0.18] }); ecrire(W, LEFT, 979, 124, 19, 'ZONE', { fg: [0.86, 0.85, 0.80] }); }
  // le poste d'aiguillage
  W.box(250, 1020, G, 270, 1032, G + 14, M.BRICK);
  W.box(249, 1019, G + 14, 271, 1033, G + 22, M.WOOD, k.peint([0.72, 0.68, 0.56], { pat: 'planks' }));
  B.gableRoof(W, 248, 1018, 24, 16, G + 22, M.SLATE, { axis: 'x', oh: 1, slope: 2 });
  new Facade(W, LEFT, 249, 1019, 22, 14).window(2, G + 15, 18, 5, { state: night ? 'office' : 'dark', sill: false, lintel: false, frame: [0.86, 0.84, 0.78], spill: false, sil: night && !bad ? 'head' : null });
  new Facade(W, RIGHT, 250, 1020, 20, 12).door(3, G, 5, 10, { mat: M.WOOD_DARK, frame: false });
  projecteur(k, 300, 1026, 50, [150, 992], { r: 170, col: [1.0, 0.70, 0.36], I: 1.0, on: !bad });
}

// ================================================================ la route du Halage, la lisière des champs
function halage(k) {
  const { W } = k;
  for (let x = 2; x < WD - 4; x += 3) if (hash(x, 1068, 1701, 0) < 0.7) { const h = 3 + Math.floor(hash(x, 0, 1702, 0) * 4); W.box(x, 1066, G, x + 3, 1070, G + h, M.HEDGE); }
  [[40, 40], [118, 36], [196, 42], [276, 38]].forEach(([x, hgt], i) => peuplier(W, x, 1066, hgt, 1703 + i));
}
// Le peuplier d'Italie : un fuseau de feuillage sur un fût court.
function peuplier(W, x, y, hgt, seed) {
  W.box(x, y, G, x + 2, y + 2, G + 9, M.BARK);
  for (let z = G + 6; z < G + hgt; z++) {
    const t = (z - G - 6) / (hgt - 6), r = 3.6 * Math.sin(Math.PI * Math.min(1, t * 1.08 + 0.1)) + 0.7;
    for (let yy = -5; yy <= 6; yy++) for (let xx = -5; xx <= 6; xx++) {
      if (y + yy >= HT) continue;
      if (Math.hypot(xx - 0.5, yy - 0.5) < r - 0.4 + hash(x + xx, y + yy, z, seed) * 0.9 && !W.get(x + xx, y + yy, z)) W.set(x + xx, y + yy, z, M.FOLIAGE);
    }
  }
}

// ================================================================ les réverbères des rues
function lampadaires(k) {
  const { W, night, bad } = k;
  const on = i => night && !(bad && i % 3 === 1);
  [20, 80, 140, 200, 260, 320].forEach((x, i) => B.streetLamp(W, x, 34, G, 0, -1, { on: on(i) }));
  [40, 100, 160].forEach((x, i) => B.streetLamp(W, x, 265, G, 0, 1, { on: on(i) }));
  B.streetLamp(W, 300, 265, G, 0, 1, { on: on(4) });
  [30, 150, 270].forEach((x, i) => B.streetLamp(W, x, 726, G, 0, 1, { on: on(i) }));
  [90, 210, 330].forEach((x, i) => B.streetLamp(W, x, 761, G, 0, -1, { on: on(i + 1) }));
  [30, 100, 170, 240, 310].forEach((x, i) => B.streetLamp(W, x, 1037, G, 0, 1, { on: on(i) }));
  [470, 560, 650].forEach((y, i) => B.streetLamp(W, 118, y, G, 1, 0, { on: on(i) }));
  [30, 90].forEach((x, i) => B.streetLamp(W, x, 415, G, 0, 1, { on: on(i), h: 18, I: 1.8, r: 56 }));
}

// ================================================================ les reflets sur l'eau
// Chaque lumière ponctuelle du quartier dont le reflet tombe sur l'eau (la Rive ou le bassin) y laisse sa
// traînée ; l'eau du rectangle porte le calque qui les dessine (la matière reste celle de la Rive).
function reflets(k) {
  const { W } = k;
  if (!k.night) return;
  const glints = [];
  const eau = (x, y) => x >= 0 && y >= 0 && x < WD && y < HT && W.get(x, y, -8) === M.RIVER2;
  W.lights.forEach((L, i) => {
    const lx = L.x - W.ox, ly = L.y - W.oy, lz = L.z - W.zl;
    if (L.axis || lx < 0 || ly < 0 || lx >= WD || ly >= HT || lz <= -6) return;
    const t = (lz + 7) / 1.15, mx = lx + t, my = ly + t;
    if (!eau(Math.floor(mx), Math.floor(my))) return;
    const m = Math.max(L.cr, L.cg, L.cb); if (m < 0.2) return;
    glints.push({ id: i, d: lx - ly, s: mx + my, len: 7 + Math.min(14, t * 0.55), k: 0.85, c: [L.cr / m, L.cg / m, L.cb / m] });
  });
  if (!glints.length) return;
  const id = W.obj({ type: 'port_reflets', glints });
  for (let y = 0; y < HT; y++) for (let x = 0; x < WD; x++) if (eau(x, y)) { const kk = W.idx(x, y, -8); if (!W.tag[kk]) W.tag[kk] = id; }
}

// ================================================================ les gens
function gens(k) {
  const { W, night, bad, day } = k;
  const sp = (def, x, y, z = G) => W.sprite(Object.assign({ x, y, z }, def));
  if (night) {
    if (!bad) {
      sp(SP.WALKER, 30, 309); sp(SP.WALKER2, 33, 310.5); sp(SP.COAT, 86, 318);
      sp(CIRE, 196, 317);                              // sur le quai, la cigarette
      sp(ROUTIER, 172, 267);                           // devant l'entrepôt 7, à côté de la camionnette
      fourgon(k, 159, 263);
    } else {
      sp(CIRE, 214, 318); sp(DOCKER, 239, 306); sp(ROUTIER, 232, 304);
      const { W } = k;
      fut(W, 234, 301, G, M.FRI_ROUILLE);
      for (let z = G + 5; z < G + 10; z++) for (let dy = 0; dy < 3; dy++) for (let dx = 0; dx < 3; dx++) if (hash(dx, dy, z, 1951) < 0.75 - (z - G - 5) * 0.12) W.set(234 + dx, 301 + dy, z, M.FRI_FLAMME);
      W.light({ x: 235.5, y: 302.5, z: G + 7, r: 46, fall: 1.6, cr: 1.5, cg: 0.72, cb: 0.28, skip: 2.5 });
    }
    sp(ROUTIER, 64, 726);                              // à la porte du relais
    sp(DOCKER, 276, 719);                              // la guérite
    sp(SP.CAT, 210, 812, G + 6);
  } else {
    sp(DOCKER, 214, 317); sp(DOCKER, 160, 520);
    sp(ROUTIER, 60, 760); sp(SP.WALKER, 172, 444);
    if (!bad) { sp(SP.WALKER2, 22, 310); sp(SP.COAT, 50, 304); sp(SP.KID, 90, 320); }
    sp(CHIEN, 214, 812); sp(DOCKER, 196, 790);
  }
}
// La camionnette garée en marche arrière contre la grande porte de l'entrepôt 7, les portes ouvertes.
function fourgon(k, x, y) {
  const { W } = k;
  const F = repere(W, 'y', x, y, 26, 10, true);
  const p = k.peint([0.76, 0.75, 0.70], { grime: 0.3 });
  for (const s0 of [3, 18]) for (const t0 of [0, 9]) F.box(s0, t0, 1, s0 + 4, t0 + 1, 4, M.TIRE);
  F.box(0, 0, 3, 26, 10, 7, M.METAL, p);
  F.box(0, 1, 7, 5, 9, 11, M.CAR_GLASS); F.box(0, 0, 7, 1, 10, 8, M.METAL, p);
  F.box(5, 0, 7, 26, 10, 14, M.METAL, p);
  F.box(0, 1, 4, 1, 3, 5, M.HEADLIGHT); F.box(0, 7, 4, 1, 9, 5, M.HEADLIGHT);
  F.box(25, 0, 3, 26, 10, 14, 0);
  F.box(20, -1, 4, 26, 0, 13, M.METAL, p); F.box(20, 10, 4, 26, 11, 13, M.METAL, p);
  F.box(25, 0, 5, 26, 1, 7, M.TAILLIGHT); F.box(25, 9, 5, 26, 10, 7, M.TAILLIGHT);
}
