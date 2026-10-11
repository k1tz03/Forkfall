'use strict';
// Le local du matériel, sous la tribune : la cage grillagée où dorment les ballons du club,
// fermée par le cadenas que tout le monde connaît (Lulu compte les ballons sur sa planchette),
// le rayonnage des chasubles fluo et des plots, le filet de but accroché au mur, la tondeuse
// autoportée en panne, capot ouvert sur sa tache d'huile, le chariot à tracer et sa traînée
// de blanc, les drapeaux de corner, une ampoule dans sa grille.
const E = require('../engine');
const { M } = require('../mats');
const { LEFT, RIGHT, TOP, hash, mod, fbm, overlay } = E;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };

// le pinceau du local (aucune matière nouvelle) : `fluo`, les chasubles — chaque pile a sa couleur
// (jaune, orange, vert fluo)
overlay('materiel_pinceau', (o, c) => {
  if (o.f !== 'fluo') return;
  const p = [[0.86, 0.86, 0.18], [0.92, 0.46, 0.12], [0.50, 0.84, 0.20]];
  const k = p[Math.floor(hash(c.ix, c.iy, 9501, 0) * p.length)];
  rgb(c, k[0], k[1], k[2]); if (c.face !== TOP && mod(c.b, 3) === 0) mul(c, 0.8);
  c.er = k[0] * 0.06; c.eg = k[1] * 0.06; c.eb = k[2] * 0.02;
});

// la tache d'huile sous la tondeuse, et la traînée de blanc derrière le chariot
overlay('materiel_sol', (o, c) => {
  if (c.face !== TOP) return;
  const x = c.hx, y = c.hy;
  const d = Math.hypot((x - o.hx) / o.rx, (y - o.hy) / o.ry) + 0.35 * (fbm(x / 2, y / 2, 9502) - 0.5);
  if (d < 1) { mul(c, 0.35); c.cb *= 1.15; c.wet = 0.6; }
});

module.exports = {
  cle: 'materiel', nom: 'Le local du matériel', ambiance: 'vestiaire',
  sx: 30, sy: 24, h: 15, sol: 'I_BETON',
  murs: { bas: 'BRICK_OLD', haut: 'I_MUR_GRIS', coupe: 7 },
  porte: { cote: 'x', de: 10, a: 17 },
  build(K) {
    const { M } = K;
    // ─── la cage aux ballons, contre le mur du fond, et son cadenas
    const cx0 = 17, cx1 = 29, cy1 = 6, ch = 10;
    // les ballons en tas derrière le grillage (des barreaux un sur deux, trois lisses)
    K.boite(cx0 + 1, 0, 0, cx1 - 1, cy1 - 1, 4, M.BALLS); K.boite(cx0 + 2, 0, 4, cx1 - 2, cy1 - 2, 6, M.BALLS);
    K.boite(cx0 + 4, 0, 6, cx1 - 4, cy1 - 3, 7, M.BALLS);
    const grille = (x, y, z) => K.voxel(x, y, z, M.METAL);
    for (let x = cx0; x < cx1; x++) for (let z = 0; z < ch; z++) if (mod(x - cx0, 2) === 0 || z === 0 || z === 5 || z === ch - 1) grille(x, cy1 - 1, z);
    for (let y = 0; y < cy1; y++) for (let z = 0; z < ch; z++) if (mod(y, 2) === 1 || z === 0 || z === 5 || z === ch - 1) { grille(cx0, y, z); grille(cx1 - 1, y, z); }
    for (let x = cx0; x < cx1; x++) for (let y = 0; y < cy1; y++) if (mod(x - cx0, 2) === 0 || y === cy1 - 1) grille(x, y, ch);
    // la porte de la cage, sa chaîne, le cadenas
    K.boite(21, cy1 - 1, 0, 22, cy1, ch, M.METAL_DARK); K.boite(25, cy1 - 1, 0, 26, cy1, ch, M.METAL_DARK);
    for (let x = 21; x < 26; x++) K.voxel(x, cy1, 5, M.METAL_DARK);
    K.boite(23, cy1, 3, 24, cy1 + 1, 5, M.GOLD);
    K.objet('cadenas', 'Le cadenas', 23, cy1, 4, { acces: [23, 9] });
    K.objet('ballons', 'Les ballons', 26, 2, 6, { acces: [27, 9] });
    // la planchette de Lulu, accrochée au grillage
    K.boite(19, cy1, 5, 20, cy1 + 1, 8, M.WOOD); K.voxel(19, cy1 + 1, 6, M.PAPER); K.voxel(19, cy1 + 1, 7, M.PAPER);
    K.place('intendant', 19, 9, { regarde: 'droite', pour: 'personnel' });
    // ─── le rayonnage : les chasubles en piles, les plots, les pots de peinture, les cartons
    for (const x of [1, 8, 15]) K.boite(x, 0, 0, x + 1, 4, 13, M.METAL);
    for (const z of [3, 7, 11]) K.boite(1, 0, z, 16, 4, z + 1, M.METAL);
    { const fluo = K.W.obj({ type: 'materiel_pinceau', f: 'fluo' }); for (const x of [2, 4, 6]) K.W.box(x, 0, 4, x + 2, 3, 5 + mod(x, 3), M.CANVAS, fluo); }
    for (const x of [9, 11, 13]) { K.boite(x, 1, 4, x + 2, 3, 5, M.PLASTIC_RED); K.boite(x, 1, 5, x + 1, 2, 7, M.PLASTIC_RED); }
    for (const x of [2, 5, 9, 12]) K.boite(x, 0, 8, x + 2, 3, 10 + mod(x, 2), M.I_CARTON);
    for (const x of [2, 4, 9, 11, 13]) K.boite(x, 1, 0, x + 1, 3, 2, M.ENAMEL);
    K.boite(5, 0, 0, 8, 4, 2, M.CANVAS);
    K.boite(2, 0, 12, 14, 4, 13, M.NET);
    K.objet('chasubles', 'Les chasubles', 5, 1, 6, { acces: [6, 6] });
    // ─── le filet de but, pendu au mur de gauche et retombé en tas
    K.boite(0, 8, 13, 2, 18, 14, M.METAL_DARK);
    for (let y = 8; y < 18; y++) for (let z = 2; z < 13; z++) if (mod(y, 2) === 0 || mod(z, 2) === 0) K.voxel(0, y, z, M.NET);
    for (let y = 9; y < 17; y++) for (let x = 0; x < 4; x++) { const h = 4 - x - (y === 9 || y === 16 ? 1 : 0) + (hash(x, y, 9503, 0) < 0.3 ? 1 : 0); if (h > 0) K.boite(x, y, 0, x + 1, y + 1, h, M.NET); }
    K.objet('filets', 'Les filets', 1, 12, 7, { acces: [5, 13] });
    // les drapeaux de corner, appuyés dans le coin
    for (const [y, f] of [[20, M.FLAG], [21, M.PLASTIC_RED], [22, M.FLAG]]) { K.boite(1, y, 0, 2, y + 1, 9, M.PLASTIC_WHITE); K.boite(1, y, 9, 2, y + 1, 11, f); }
    // ─── la tondeuse autoportée en panne, capot levé, une bougie et une clé posées par terre
    const tx = 6, ty = 13;
    K.boite(tx + 1, ty, 0, tx + 9, ty + 6, 1, M.METAL_GREEN);                          // le plateau de coupe
    K.boite(tx, ty + 1, 1, tx + 10, ty + 5, 2, M.METAL_DARK);                           // le châssis
    K.boite(tx + 6, ty - 1, 0, tx + 9, ty, 3, M.TIRE); K.boite(tx + 6, ty + 6, 0, tx + 9, ty + 7, 3, M.TIRE);
    K.boite(tx, ty, 0, tx + 2, ty + 1, 2, M.TIRE); K.boite(tx, ty + 5, 0, tx + 2, ty + 6, 2, M.TIRE);
    K.boite(tx + 1, ty + 1, 2, tx + 4, ty + 5, 4, M.METAL_DARK);                        // le moteur à nu
    K.voxel(tx + 2, ty + 2, 4, M.METAL); K.voxel(tx + 3, ty + 3, 4, M.METAL);
    K.boite(tx, ty + 1, 4, tx + 1, ty + 5, 8, M.METAL_GREEN);                           // le capot relevé
    K.boite(tx + 4, ty + 1, 2, tx + 10, ty + 5, 4, M.METAL_GREEN);                      // la caisse
    K.boite(tx + 6, ty + 1, 4, tx + 9, ty + 5, 5, M.I_SKAI); K.boite(tx + 9, ty + 1, 4, tx + 10, ty + 5, 7, M.I_SKAI);
    K.boite(tx + 4, ty + 2, 4, tx + 5, ty + 3, 6, M.METAL_DARK); K.boite(tx + 4, ty + 1, 6, tx + 5, ty + 4, 7, M.METAL_DARK);
    K.objet('tondeuse', 'La tondeuse en panne', tx + 4, ty + 3, 4, { acces: [tx + 5, ty + 9] });
    {
      const id = K.W.obj({ type: 'materiel_sol', hx: tx + 3, hy: ty + 7, rx: 3.4, ry: 1.9 });
      K.W.box(tx - 1, ty + 4, -1, tx + 8, ty + 10, 0, M.I_BETON, id);
    }
    K.voxel(tx + 5, ty + 8, 0, M.METAL); K.boite(tx + 1, ty + 8, 0, tx + 3, ty + 9, 1, M.METAL);
    K.boite(tx + 11, ty, 0, tx + 13, ty + 1, 2, M.PLASTIC_RED);                         // le jerrican
    // ─── le chariot à tracer, sa traînée de blanc
    K.boite(22, 16, 1, 26, 19, 3, M.WHITE); K.boite(22, 16, 0, 23, 17, 1, M.TIRE); K.boite(22, 18, 0, 23, 19, 1, M.TIRE);
    K.boite(25, 16, 0, 26, 17, 1, M.TIRE); K.boite(25, 18, 0, 26, 19, 1, M.TIRE);
    K.boite(26, 17, 3, 27, 18, 6, M.METAL); K.boite(26, 16, 6, 27, 19, 7, M.METAL_DARK);
    K.boite(16, 17, -1, 22, 18, 0, M.CHALK);
    K.place('visiteur', 24, 13, { regarde: 'gauche', pour: 'visiteur' });
    // ─── le soupirail du côté de la pelouse ; le calendrier du club ; deux hublots grillagés
    K.fenetreY(22, 11, 5, 2, { rebord: false });
    K.afficheY(19, 11, 3, 3, { title: '', bg: [0.80, 0.78, 0.70], band: [0.42, 0.10, 0.16], seed: 9504 });
    for (const [hx, hy, mur] of [[16, 0, 'y'], [0, 5, 'x']]) {
      if (mur === 'y') { K.boite(hx, 0, 12, hx + 2, 1, 13, M.METAL_DARK); K.voxel(hx, 0, 11, M.BULB); K.voxel(hx + 1, 0, 11, M.METAL_DARK); }
      else { K.boite(0, hy, 12, 1, hy + 2, 13, M.METAL_DARK); K.voxel(0, hy, 11, M.BULB); K.voxel(0, hy + 1, 11, M.METAL_DARK); }
      K.lampe(mur === 'y' ? hx + 0.5 : 1.5, mur === 'y' ? 1.5 : hy + 0.5, 11, { r: 18, c: [1.2, 0.95, 0.62], cache: true });
    }
    // l'ampoule nue au bout de son fil, au milieu : c'est elle qui éclaire
    K.boite(14, 9, 13, 15, 10, 15, M.METAL_DARK); K.voxel(14, 9, 12, M.BULB);
    K.lampe(14.5, 9.5, 12.4, { r: 60, c: [1.25, 0.95, 0.6], cache: true });
    if (K.jour) K.W.light({ x: 24, y: 3, z: 11, r: 26, cr: 0.32, cg: 0.34, cb: 0.36, shadow: false });
  },
};
