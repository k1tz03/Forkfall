'use strict';
// Brunel, tailleur et chausseur depuis trois générations : lambris sombre et papier peint. Au
// fond, derrière le long comptoir (le coupon de drap, les ciseaux, la craie, le plateau des
// boutons de manchette et des montres, la vieille caisse de laiton), les tiroirs, les boîtes à
// chemises et l'enseigne BRUNEL en lettres d'or ; dans le coin, l'armoire aux patrons de papier
// de tous les présidents ; le rayon des chaussures et son tabouret d'essayage. À gauche, le miroir
// à trois faces sur son tapis vert, le mannequin de couture, la cabine et son rideau de velours ;
// devant, le portant des costumes ; près de la porte, la machine à coudre.
const E = require('../engine');
const { M } = require('../mats');
const B = require('../build');
const { LEFT, TOP, hash, mod, overlay } = E;

const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };

// le pinceau de Brunel (aucune matière nouvelle) : `laine`, une teinte par costume (marine,
// anthracite, brun, gris, olive, bordeaux) et un chevron discret ; `miroir`, la glace ancienne,
// argentée, ses reflets en biais, le tain piqué
overlay('tailleur_pinceau', (o, c) => {
  if (o.f === 'laine') {
    const p = [[0.16, 0.19, 0.30], [0.20, 0.20, 0.22], [0.30, 0.21, 0.14], [0.42, 0.41, 0.39], [0.28, 0.30, 0.18], [0.34, 0.10, 0.13]];
    const k = p[Math.floor(hash(c.ix, 0, 9951, 0) * p.length)];
    rgb(c, k[0], k[1], k[2]); if (c.face === TOP) mul(c, 1.12);
    if (mod(c.a + (mod(c.b, 4) < 2 ? c.b : -c.b), 4) === 0) mul(c, 0.86);
  } else if (o.f === 'miroir') {
    if (c.face === TOP) { rgb(c, 0.30, 0.22, 0.12); return; }
    rgb(c, 0.38, 0.40, 0.40);
    const d = mod(c.a + c.b, 11); if (d < 2) rgb(c, 0.72, 0.72, 0.66); else if (d < 3) rgb(c, 0.54, 0.55, 0.52);
    if (hash(c.a, c.b, 9952, 0) < 0.04) rgb(c, 0.26, 0.24, 0.20);
  }
});

module.exports = {
  cle: 'tailleur', nom: 'Brunel, tailleur et chausseur', ambiance: 'boutique', personnel: 'commercant2',
  sx: 34, sy: 28, sol: 'I_PARQUET',
  murs: { bas: 'WOOD_DARK', haut: 'WALLPAPER', coupe: 7, frise: 'WOOD' },
  porte: { cote: 'x', de: 16, a: 23 },
  build(K) {
    const { M } = K;
    const laine = K.W.obj({ type: 'tailleur_pinceau', f: 'laine' }), miroir = K.W.obj({ type: 'tailleur_pinceau', f: 'miroir' });
    // ─── l'armoire aux patrons, dans le coin ; des rouleaux de papier dessus
    K.boite(0, 0, 0, 5, 4, 14, M.WOOD_DARK); K.boite(2, 4, 1, 3, 5, 13, M.WOOD);
    K.voxel(2, 4, 7, M.GOLD); K.voxel(3, 4, 7, M.GOLD);
    for (const x of [0, 2]) K.boite(x, 1, 14, x + 2, 3, 15, M.PAPER);
    // ─── le rayon des chaussures : quatre planches, des paires ; le tabouret d'essayage, la chausse-pied
    for (const z of [1, 4, 7, 10]) K.boite(6, 0, z, 16, 3, z + 1, M.WOOD);
    for (const x of [6, 15]) K.boite(x, 0, 0, x + 1, 3, 13, M.WOOD_DARK);
    for (const z of [2, 5, 8, 11]) for (let x = 7; x < 15; x += 3) {
      const m = [M.CAR_BORD, M.METAL_DARK, M.PLASTER_OCHRE, M.LEATHER, M.WHITE][Math.floor(hash(x, z, 9953, 0) * 5)];
      K.voxel(x, 1, z, m); K.voxel(x + 1, 1, z, m); K.voxel(x, 2, z, m); K.voxel(x + 1, 2, z, M.WOOD_DARK);
    }
    K.tabouret(9, 6, { mat: M.LEATHER }); K.boite(12, 6, 0, 14, 8, 1, M.WOOD);
    K.objet('chaussures', 'Les chaussures', 11, 1, 7, { acces: [11, 9] });
    // ─── le long comptoir : le coupon, les ciseaux, la craie, le mètre, le plateau, la caisse
    K.comptoir(17, 6, 31, 10, { mat: M.WOOD_DARK, dessus: M.WOOD });
    K.boite(18, 7, 5, 24, 9, 6, M.CAR_BLUE);
    K.voxel(25, 8, 5, M.CHROME); K.voxel(26, 7, 5, M.WHITE); K.voxel(19, 9, 5, M.FLAG);
    K.boite(26, 8, 5, 28, 10, 6, M.I_VELOURS); K.voxel(26, 9, 6, M.GOLD); K.voxel(27, 8, 6, M.CHROME);
    K.boite(29, 7, 5, 31, 9, 7, M.GOLD); K.boite(29, 7, 7, 31, 8, 8, M.GOLD); K.boite(29, 8, 6, 31, 9, 7, M.METAL_DARK);
    K.lampeBureau(17, 9, 5);
    K.objet('comptoir', 'Le comptoir', 24, 8, 5, { acces: [24, 12] });
    K.place('tailleur', 23, 4, { regarde: 'gauche', pour: 'personnel' });
    // ─── derrière : les tiroirs aux boutons de laiton, les boîtes à chemises, l'enseigne
    K.boite(17, 0, 0, 33, 3, 7, M.WOOD_DARK);
    for (let x = 18; x < 33; x += 3) for (const z of [2, 5]) K.voxel(x, 2, z, M.GOLD);
    K.boite(17, 0, 7, 33, 3, 8, M.WOOD);
    for (let x = 18; x < 32; x += 3) K.boite(x, 0, 8, x + 2, 2, 10 + (x % 2), M.PAPER);
    K.murY.sign(19, 17, 'BRUNEL', { fg: [0.86, 0.68, 0.26], plate: [0.16, 0.10, 0.06], plateMat: M.WOOD_DARK, depth: -1, padX: 2, padY: 1, emit: [0.10, 0.07, 0.01] });
    // ─── le miroir à trois faces, son cadre doré, le tapis vert ; l'applique au-dessus
    // la glace du milieu contre le mur, les deux volets en biais, le cadre doré en haut et en bas
    K.W.box(0, 8, 1, 1, 15, 13, M.CHROME, miroir);
    for (let i = 0; i < 2; i++) { K.W.box(1 + i, 7 - i, 1, 2 + i, 8 - i, 13, M.CHROME, miroir); K.W.box(1 + i, 15 + i, 1, 2 + i, 16 + i, 13, M.CHROME, miroir); }
    for (const z of [0, 13]) { K.boite(0, 8, z, 1, 15, z + 1, M.GOLD); K.voxel(1, 7, z, M.GOLD); K.voxel(2, 6, z, M.GOLD); K.voxel(1, 15, z, M.GOLD); K.voxel(2, 16, z, M.GOLD); }
    K.boite(3, 6, -1, 9, 17, 0, M.I_DRAP);
    K.boite(0, 10, 15, 2, 13, 16, M.GOLD); K.lampe(1.5, 11.5, 14.5, { r: 14, c: [1.1, 0.9, 0.55] });
    K.objet('miroir', 'Le miroir à trois faces', 1, 11, 7, { acces: [6, 9] });
    K.place('client_1', 6, 12, { regarde: 'gauche', pour: 'client' });
    // ─── le mannequin de couture, une veste épinglée dessus, la pelote à épingles
    K.boite(13, 12, 0, 16, 15, 1, M.WOOD_DARK); K.boite(14, 13, 1, 15, 14, 5, M.WOOD_DARK);
    K.boite(13, 12, 5, 16, 15, 10, M.CANVAS); K.boite(13, 12, 6, 16, 14, 9, M.CAR_BLUE); K.voxel(14, 13, 10, M.WOOD_DARK);
    K.voxel(15, 14, 8, M.PLASTIC_RED);
    // ─── la cabine d'essayage : la cloison, la tringle, le rideau de velours tiré aux deux tiers
    K.boite(0, 20, 0, 8, 21, 13, M.WOOD_DARK);
    K.boite(7, 20, 13, 8, 28, 14, M.GOLD);
    K.boite(7, 21, 1, 8, 25, 13, M.I_VELOURS);
    K.boite(2, 23, 0, 4, 25, 2, M.WOOD); K.W.box(0, 22, 7, 1, 25, 11, M.METAL_DARK, laine); K.voxel(0, 23, 11, M.GOLD);
    K.objet('cabine', 'La cabine d\'essayage', 4, 24, 7, { acces: [10, 25] });
    // ─── le portant des costumes
    for (const x of [11, 22]) { K.boite(x, 19, 0, x + 1, 20, 11, M.GOLD); K.boite(x - 1, 18, 0, x + 2, 21, 1, M.WOOD_DARK); }
    K.boite(11, 19, 11, 23, 20, 12, M.GOLD);
    for (let x = 12; x < 22; x++) { K.W.box(x, 18, 3, x + 1, 21, 10, M.METAL_DARK, laine); K.voxel(x, 19, 10, M.WHITE); }
    K.objet('costumes', 'Les costumes', 16, 19, 8, { acces: [16, 23] });
    // ─── la machine à coudre sur sa table, près de la porte ; le visiteur
    K.table(27, 24, 6, 3, { mat: M.WOOD });
    K.boite(28, 24, 4, 31, 26, 5, M.METAL_DARK); K.boite(28, 24, 5, 29, 26, 7, M.METAL_DARK); K.boite(28, 24, 7, 31, 25, 8, M.METAL_DARK); K.voxel(30, 25, 5, M.GOLD);
    K.place('visiteur', 27, 15, { regarde: 'gauche', pour: 'visiteur' });
    // ─── la lumière : deux suspensions de laiton ; le jour, la vitrine (côté rue) éclaire
    K.plafonnier(12, 14, { c: [1.25, 0.95, 0.6], r: 48 });
    K.plafonnier(25, 15, { c: [1.25, 0.95, 0.6], r: 48 });
    if (K.jour) K.W.light({ x: 30, y: 30, z: 9, r: 40, cr: 0.36, cg: 0.36, cb: 0.34, shadow: false });
  },
};
