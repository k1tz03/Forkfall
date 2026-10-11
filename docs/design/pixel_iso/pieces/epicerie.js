'use strict';
// L'épicerie : des conserves, des bières, le cahier des ardoises sous le comptoir. Des rayons
// jusqu'au plafond, une gondole au milieu, le frigo des bières qui bourdonne et éclaire le fond ; le
// vieux comptoir près de l'entrée, la balance, le bocal de bonbons, le cahier ouvert à la page de la
// semaine ; les cagettes de fruits et de légumes, les packs d'eau, les colis du point relais.
const E = require('../engine');
const { TOP, RIGHT, hash, mod } = E;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const grain = (c, amt, s = 0) => mul(c, 1 + (hash(c.a, c.b, c.face * 7 + s, c.m) - 0.5) * 2 * amt);
if (!E.OVERLAYS.epicerie_pinceau) E.overlay('epicerie_pinceau', (o, c) => o.f(c));
const peint = (K, x0, y0, z0, x1, y1, z1, m, f) => K.W.box(x0, y0, z0, x1, y1, z1, m, K.W.obj({ type: 'epicerie_pinceau', f }));
const le = c => Math.floor(2 * (c.face === RIGHT ? c.hy : c.hx));
const haut = c => Math.floor(2 * c.hz);

// les carreaux de ciment : une rosace ocre et rouge sur fond crème, tous les 80 cm
const ciment = c => {
  if (c.face !== TOP) { rgb(c, 0.36, 0.32, 0.26); return; }
  const a = mod(Math.floor(2 * c.hx), 8), b = mod(Math.floor(2 * c.hy), 8);
  const da = Math.abs(a - 3.5), db = Math.abs(b - 3.5);
  rgb(c, 0.58, 0.54, 0.45);
  if (da + db < 2) rgb(c, 0.52, 0.30, 0.22); else if (da + db < 3) rgb(c, 0.60, 0.48, 0.30);
  if (a === 0 || b === 0) mul(c, 0.84);
  if ((a === 0 || a === 7) && (b === 0 || b === 7)) rgb(c, 0.30, 0.34, 0.30);
  grain(c, 0.04);
};
// un rayonnage en volume : le fond, des planches qui avancent (leur chant porte les étiquettes de
// prix), et sur chaque planche des rangées de produits, par familles, avec des trous
const fondRayon = c => { rgb(c, 0.30, 0.22, 0.14); if (c.face !== TOP && mod(le(c), 8) === 0) mul(c, 0.8); };
const planche = c => {
  if (c.face === TOP) { rgb(c, 0.52, 0.36, 0.20); return; }
  rgb(c, 0.86, 0.84, 0.78);                                                        // la bande des étiquettes
  if (mod(le(c), 7) === 2) rgb(c, 0.70, 0.16, 0.14);
};
const produit = (sorte, p) => c => {
  const u = le(c), v = haut(c);
  if (c.face === TOP) { rgb(c, p[0] * 1.1, p[1] * 1.1, p[2] * 1.1); if (sorte === 0) rgb(c, 0.72, 0.72, 0.70); if (sorte === 2 && mod(Math.floor(2 * c.hx), 2)) rgb(c, 0.75, 0.62, 0.30); return; }
  rgb(c, p[0], p[1], p[2]);
  if (sorte === 0) { if (mod(u, 2) === 1) mul(c, 0.7); if (mod(v, 2) === 1) rgb(c, 0.88, 0.86, 0.80); }                 // les conserves : l'étiquette blanche
  else if (sorte === 1) { if (mod(u, 4) === 0) mul(c, 0.75); if (mod(v, 4) === 2) rgb(c, 0.92, 0.90, 0.84); }          // les paquets : la marque
  else { if (mod(u, 2) === 1) rgb(c, 0.16, 0.11, 0.07); else if (mod(v, 4) === 3) rgb(c, 0.84, 0.80, 0.66); }           // les bouteilles
};
const FAMILLES = [
  [0, [[0.70, 0.18, 0.15], [0.24, 0.46, 0.26], [0.86, 0.72, 0.26], [0.24, 0.34, 0.60]]],
  [1, [[0.88, 0.80, 0.52], [0.80, 0.38, 0.20], [0.32, 0.50, 0.72], [0.62, 0.22, 0.30], [0.90, 0.88, 0.82]]],
  [2, [[0.18, 0.36, 0.20], [0.44, 0.26, 0.10], [0.46, 0.12, 0.14]]],
];
function rayonnage(K, x0, x1, y0, prof, niveaux, graine) {
  const { M } = K;
  peint(K, x0, y0, 0, x1, y0 + 1, niveaux * 3 + 1, M.WOOD_DARK, fondRayon);
  for (let n = 0; n <= niveaux; n++) {
    const z = n * 3;
    peint(K, x0, y0, z, x1, y0 + prof, z + 1, M.WOOD, planche);
    if (n === niveaux) break;
    let x = x0;
    while (x < x1) {
      const h = hash(x, n, 911, graine), w = 2 + Math.floor(h * 3);
      const [sorte, pal] = FAMILLES[Math.floor(hash(n, Math.floor(x / 6), 912, graine) * 3)];
      const p = pal[Math.floor(hash(x, n, 913, graine) * pal.length)];
      const haut = sorte === 2 ? 2 : 1 + (h > 0.5 ? 1 : 0);
      if (hash(x, n, 914, graine) > 0.12) peint(K, x, y0 + 1, z + 1, Math.min(x + w, x1), y0 + prof, z + 1 + haut, M.WOOD, produit(sorte, p));
      x += w + (hash(x, n, 915, graine) < 0.3 ? 1 : 0);
    }
  }
}
// le frigo des bières : deux portes vitrées, éclairé du dedans, un bandeau rouge
const frigo = c => {
  if (c.face === TOP) { rgb(c, 0.70, 0.70, 0.68); return; }
  const u = le(c) - 2 * 27, v = haut(c);
  if (v >= 21) { rgb(c, 0.66, 0.14, 0.14); if (v === 22 && u > 1 && u < 12) rgb(c, 0.86, 0.84, 0.78); c.er = c.cr * 0.35; c.eg = c.cg * 0.35; c.eb = c.cb * 0.35; return; }
  if (u <= 0 || u >= 13 || mod(u, 7) === 0 || v <= 1 || v === 20) { rgb(c, 0.72, 0.72, 0.70); return; }
  rgb(c, 0.10, 0.14, 0.18); c.er = 0.22; c.eg = 0.30; c.eb = 0.34;
  if (mod(v, 5) === 1) { rgb(c, 0.6, 0.6, 0.6); c.er = 0.35; c.eg = 0.40; c.eb = 0.42; return; }
  if (mod(u, 2) === 1 && mod(v, 5) >= 2) { const h = hash(u >> 1, Math.floor(v / 5), 903, 0); const p = h < 0.5 ? [0.40, 0.24, 0.08] : h < 0.8 ? [0.18, 0.40, 0.18] : [0.80, 0.78, 0.66]; rgb(c, p[0], p[1], p[2]); c.er = p[0] * 0.55; c.eg = p[1] * 0.55; c.eb = p[2] * 0.55; }
};
// les cagettes : des pommes, des oranges, des citrons, des salades, des pommes de terre
const FRUITS = [[0.74, 0.14, 0.12], [0.90, 0.52, 0.12], [0.92, 0.82, 0.26], [0.36, 0.60, 0.22], [0.56, 0.42, 0.24]];
const cagette = (k) => c => {
  if (c.face !== TOP) { rgb(c, 0.60, 0.46, 0.28); if (mod(haut(c), 2)) mul(c, 0.75); return; }
  const u = Math.floor(2 * c.hx), v = Math.floor(2 * c.hy), p = FRUITS[k];
  rgb(c, p[0], p[1], p[2]); if (hash(u, v, 904, k) < 0.3) mul(c, 0.72); else if (hash(u, v, 905, k) > 0.85) mul(c, 1.2);
};
// le comptoir de bois, à moulures
const comptoir = c => {
  rgb(c, 0.40, 0.26, 0.14); if (c.face === TOP) { mul(c, 1.1); return; }
  const v = haut(c); if (v === 1 || v === 7) mul(c, 0.7); if (mod(le(c), 6) === 0) mul(c, 0.82);
  grain(c, 0.04);
};
// le cahier des ardoises, ouvert : des lignes bleues, des noms, des chiffres
const cahier = c => {
  if (c.face !== TOP) { rgb(c, 0.20, 0.30, 0.55); return; }
  rgb(c, 0.88, 0.86, 0.80);
  const u = Math.floor(4 * c.hx), v = Math.floor(4 * c.hy);
  if (mod(v, 2) === 0) rgb(c, 0.52, 0.62, 0.80);
  if (mod(v, 2) === 1 && hash(u, v, 906, 0) < 0.5) rgb(c, 0.20, 0.20, 0.30);
  if (Math.abs(c.hy - 21) < 0.12) rgb(c, 0.4, 0.4, 0.4);
};
// le bocal de bonbons
const bocal = c => { rgb(c, 0.6, 0.62, 0.64); const h = hash(Math.floor(2 * c.hx + 3 * c.hz), Math.floor(2 * c.hy), 907, 0); if (c.face !== TOP || h < 0.7) { const p = [[0.9, 0.3, 0.4], [0.3, 0.7, 0.9], [0.95, 0.85, 0.3], [0.4, 0.8, 0.4]][Math.floor(h * 4)]; rgb(c, p[0], p[1], p[2]); } };
// un pack d'eau sous son plastique
const packEau = c => { rgb(c, 0.62, 0.72, 0.80); if (c.face !== TOP && mod(le(c), 2) === 0) mul(c, 0.8); if (c.face === TOP && mod(Math.floor(2 * c.hx) + Math.floor(2 * c.hy), 2)) mul(c, 0.86); };

module.exports = {
  cle: 'epicerie', nom: 'L\'épicerie', ambiance: 'boutique', personnel: 'commercant2',
  sx: 36, sy: 30, sol: 'I_LINO',
  murs: { bas: 'WOOD', haut: 'I_MUR_VERT', coupe: 6 },
  porte: { cote: 'y', de: 22, a: 29 },
  build(K) {
    const { M, SX, SY } = K;
    peint(K, 0, 0, -1, SX, SY, 0, M.I_LINO, ciment);

    // ── les rayons, le long du mur du fond, jusqu'au plafond
    rayonnage(K, 1, 26, 0, 3, 5, 1);
    K.objet('rayons', 'Les rayons', 14, 2, 8, { acces: [14, 6] });
    // le frigo des bières, au bout, qui éclaire le fond
    peint(K, 27, 0, 0, 34, 3, 12, M.ENAMEL, frigo);
    K.W.light({ x: 30.5, y: 6, z: 6, r: 18, cr: 0.30, cg: 0.40, cb: 0.46, shadow: false });
    K.objet('frigo', 'Le frigo des bières', 30, 2, 7, { acces: [31, 6] });
    K.place('visiteur', 27, 7, { regarde: 'droite', pour: 'visiteur' });

    // ── la gondole, au milieu : des paquets des deux côtés, des pâtes, du café
    K.boite(11, 11, 0, 25, 12, 7, M.WOOD_DARK);
    rayonnage(K, 11, 25, 11, 3, 2, 2);
    K.place('client_1', 18, 9, { regarde: 'droite' });
    K.place('client_2', 22, 17, { regarde: 'droite' });

    // ── le comptoir, près de l'entrée, le long du mur de gauche
    peint(K, 5, 13, 0, 8, 25, 4, M.WOOD, comptoir);
    K.boite(5, 13, 4, 8, 25, 5, M.WOOD_DARK);
    K.caisse(5, 14);
    K.boite(6, 17, 5, 7, 18, 6, M.CHROME); K.boite(5, 17, 6, 8, 18, 7, M.METAL);    // la balance
    peint(K, 6, 22, 5, 7, 23, 7, M.GLASS, bocal);
    peint(K, 5, 19, 5, 7, 21, 6, M.PAPER, cahier);
    K.objet('comptoir', 'Le comptoir', 6, 16, 5, { acces: [10, 16] });
    K.objet('cahier', 'Le cahier des ardoises', 6, 20, 6, { acces: [10, 20] });
    K.place('epicier', 3, 19, { regarde: 'droite', pour: 'personnel' });
    K.place('odile', 10, 22, { regarde: 'gauche', pour: 'odile' });
    // derrière l'épicier : les colis du point relais, les packs d'eau, le calendrier, la radio
    K.boite(0, 10, 0, 2, 13, 3, M.I_CARTON); K.boite(0, 10, 3, 2, 12, 5, M.I_CARTON);
    for (const [y, z] of [[25, 0], [25, 2], [27, 0]]) peint(K, 0, y, z, 3, y + 2, z + 2, M.PLASTIC_WHITE, packEau);
    K.afficheX(15, 8, 4, 5, { bg: [0.86, 0.84, 0.76], fg: [0.42, 0.11, 0.16], band: [0.30, 0.50, 0.32] });
    K.boite(0, 20, 12, 2, 24, 13, M.WOOD_DARK); K.boite(0, 21, 13, 2, 23, 15, M.METAL_DARK); K.voxel(1, 22, 14, M.LIT_PANEL);

    // ── les cagettes de fruits et de légumes, sur leur étal en gradins, près de la porte
    K.boite(27, 18, 0, 35, 27, 2, M.WOOD_DARK); K.boite(31, 18, 2, 35, 27, 4, M.WOOD_DARK);
    let k = 0;
    for (const [x, y, z] of [[27, 18, 2], [27, 21, 2], [27, 24, 2], [31, 18, 4], [31, 21, 4], [31, 24, 4]]) peint(K, x, y, z, x + 4, y + 3, z + 1, M.WOOD, cagette(k++ % FRUITS.length));
    K.place('client_3', 24, 23, { regarde: 'droite' });

    K.plafonnier(18, 7, { c: [1.15, 1.0, 0.75] }); K.plafonnier(17, 20, { c: [1.15, 1.0, 0.75] });
  },
};
