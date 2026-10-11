'use strict';
// LES INTÉRIEURS DE LA VERSION JOUABLE : des pièces où l'on entre, où l'on marche,
// où l'on touche un comptoir, un flipper, un lit.
//   node interieurs_jeu.js            toutes les pièces de pieces/*.js
//   node interieurs_jeu.js buvette    une seule (ou plusieurs, séparées par des espaces)
// Sorties dans out/ville/interieurs/ :
//   int_<cle>_jour.png, int_<cle>_nuit.png   l'image, 1 pixel = 1 pixel comme la ville
//   int_<cle>_prof.png                       la profondeur (x + y + z), même codage que la ville
//   apercu_<cle>.png                         la pièce avec sa grille, ses objets et ses places (contrôle)
//   interieurs.json                          par pièce : projection, grille, porte, objets, places
// puis, en WebP sans perte, dans packages/tools/web/interieurs/ (commité, copié par assemble.js).
//
// UNE PIÈCE (pieces/<cle>.js) exporte { cle, nom, sx, sy, h?, ambiance, porte, build(K) } :
//   - sx × sy : l'emprise du sol en voxels de 20 cm (x vers le bas-droite de l'écran, y vers le
//     bas-gauche) ; le sol est à z = 0, les deux murs du fond sont en x < 0 et en y < 0, le devant
//     (x = sx, y = sy) est ouvert, bordé d'un muret de 40 cm ;
//   - porte : { cote: 'x' | 'y', de, a } — le passage dans le muret de devant (cote 'x' : le
//     muret x = sx, de y = de à y = a ; cote 'y' : le muret y = sy, de x = de à x = a) ;
//   - build(K) pose le reste avec le kit (plus bas) et déclare les objets que l'on touche
//     (K.objet) et les places où se tiennent les gens (K.place).
// Le rendu est déterministe : même pièce, même image, au pixel près.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const E = require('./engine');
const { M } = require('./mats');
const B = require('./build');
require('./interiors');           // les matières des intérieurs (carrelage, faïence, lambris…)
const SP = require('./sprites');
const { LEFT, RIGHT, TOP, hash, mod, clamp, material } = E;
const { Facade } = B;

const OUT = path.join(__dirname, 'out', 'ville', 'interieurs');
const WEB = path.join(__dirname, '..', '..', '..', 'packages', 'tools', 'web', 'interieurs');
const PIECES = path.join(__dirname, 'pieces');
const MARGE = 3, ZL = 2, CELL = 2, HAUT = 18;

// ─────────────────────────────────────────────────────────────── des matières de plus
const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const mul = (c, k) => { c.cr *= k; c.cg *= k; c.cb *= k; };
const grain = (c, amt, s = 0) => mul(c, 1 + (hash(c.a, c.b, c.face * 7 + s, c.m) - 0.5) * 2 * amt);
const coupe = c => rgb(c, 0.13, 0.10, 0.09);
function peinture(nom, r, g, b, s) {
  return material(nom, c => { if (c.face === TOP) return coupe(c); rgb(c, r, g, b); mul(c, 0.92 + 0.16 * E.fbm(c.a / 10, c.b / 10, s)); grain(c, 0.03); });
}
M.I_PARQUET = material('parquet', c => {
  if (c.face !== TOP) { rgb(c, 0.30, 0.19, 0.11); return; }
  const lame = Math.floor(c.a / 3), joint = mod(c.a, 3) === 0 || mod(c.b + lame * 7, 14) === 0;
  rgb(c, 0.46, 0.30, 0.17); if (joint) mul(c, 0.72); mul(c, 0.9 + 0.2 * hash(lame, Math.floor((c.b + lame * 7) / 14), 701, 0)); grain(c, 0.05);
});
M.I_LINO = material('lino', c => {
  if (c.face !== TOP) { rgb(c, 0.28, 0.26, 0.24); return; }
  rgb(c, 0.42, 0.40, 0.33); if ((Math.floor(c.a / 4) + Math.floor(c.b / 4)) & 1) mul(c, 0.86); grain(c, 0.05);
});
M.I_TOMETTE = material('tomettes', c => {
  if (c.face !== TOP) { rgb(c, 0.40, 0.18, 0.12); return; }
  const a = mod(c.a, 4), b = mod(c.b, 4);
  if (a === 0 || b === 0) { rgb(c, 0.30, 0.20, 0.16); return; }
  rgb(c, 0.62, 0.30, 0.20); mul(c, 0.86 + 0.24 * hash(Math.floor(c.a / 4), Math.floor(c.b / 4), 702, 0)); grain(c, 0.04);
});
M.I_BETON = material('béton ciré', c => { rgb(c, 0.40, 0.40, 0.39); mul(c, 0.9 + 0.18 * E.fbm(c.a / 8, c.b / 8, 703)); grain(c, 0.04); });
M.I_MUR_BLANC = peinture('mur blanc cassé', 0.70, 0.67, 0.60, 704);
M.I_MUR_BORDEAUX = peinture('mur bordeaux', 0.40, 0.12, 0.16, 705);
M.I_MUR_BLEU = peinture('mur bleu de nuit', 0.20, 0.26, 0.40, 706);
M.I_MUR_OCRE = peinture('mur ocre', 0.62, 0.46, 0.26, 707);
M.I_MUR_GRIS = peinture('mur gris', 0.46, 0.46, 0.45, 708);
M.I_MUR_ROSE = peinture('mur rose fané', 0.62, 0.44, 0.42, 709);
M.I_MUR_VERT = peinture('mur vert d\'eau', 0.46, 0.58, 0.52, 710);
M.I_ZINC = material('zinc de comptoir', c => { rgb(c, 0.62, 0.64, 0.66); if (c.face === TOP) mul(c, 1.12); grain(c, 0.04); c.wet = c.face === TOP ? 0.25 : 0; });
M.I_FORMICA = material('formica', c => { rgb(c, 0.78, 0.72, 0.58); if (c.face === TOP) mul(c, 1.06); grain(c, 0.02); });
M.I_VELOURS = material('velours', c => { rgb(c, 0.42, 0.10, 0.14); if (c.face === TOP) mul(c, 1.12); grain(c, 0.07); });
M.I_SKAI = material('skaï', c => { rgb(c, 0.20, 0.17, 0.15); if (c.face === TOP) mul(c, 1.2); grain(c, 0.05); });
M.I_DRAP = material('drap de billard', c => { rgb(c, 0.10, 0.34, 0.18); grain(c, 0.05); });
M.I_LIVRES = material('livres', c => {
  if (c.face === TOP) { rgb(c, 0.30, 0.20, 0.12); return; }
  const p = [[0.46, 0.12, 0.14], [0.16, 0.26, 0.40], [0.62, 0.52, 0.30], [0.20, 0.34, 0.22], [0.70, 0.66, 0.58], [0.30, 0.18, 0.30]];
  const k = p[Math.floor(hash(Math.floor(c.a), Math.floor(c.b / 4), 711, 0) * p.length)]; rgb(c, k[0], k[1], k[2]);
  if (mod(c.b, 4) === 0) mul(c, 0.5); grain(c, 0.05);
});
M.I_BOUTEILLES = material('bouteilles', c => {
  const p = [[0.15, 0.32, 0.18], [0.45, 0.30, 0.10], [0.70, 0.66, 0.50], [0.30, 0.10, 0.10], [0.20, 0.20, 0.30]];
  const k = p[Math.floor(hash(Math.floor(c.a / 2), Math.floor(c.b / 3), 712, 0) * p.length)]; rgb(c, k[0], k[1], k[2]);
  if (c.face !== TOP && mod(c.b, 3) === 0) mul(c, 0.55); c.er = k[0] * 0.05; c.eg = k[1] * 0.05; c.eb = k[2] * 0.05;
});
M.I_ECRAN_BLEU = material('écran allumé', c => { rgb(c, 0.1, 0.1, 0.12); if (c.face !== TOP) { const g = mod(Math.floor(c.b), 2) ? 0.8 : 1; c.er = 0.20 * g; c.eg = 0.30 * g; c.eb = 0.62 * g; } }, { noAOrecv: true });
M.I_NEON_ROSE = material('néon rose', c => { rgb(c, 0.9, 0.5, 0.7); c.er = 1.3; c.eg = 0.35; c.eb = 0.75; }, { noShadow: true, noAO: true, noAOrecv: true });
M.I_NEON_BLEU = material('néon bleu', c => { rgb(c, 0.5, 0.7, 0.9); c.er = 0.3; c.eg = 0.75; c.eb = 1.3; }, { noShadow: true, noAO: true, noAOrecv: true });
M.I_CIBLE = material('cible de fléchettes', c => {
  rgb(c, 0.12, 0.12, 0.12);
  const da = (mod(c.a, 6) - 2.5), db = (mod(c.b, 6) - 2.5), d = Math.hypot(da, db);
  if (d < 1) rgb(c, 0.75, 0.12, 0.12); else if (d < 2) rgb(c, 0.85, 0.80, 0.62); else if (d < 3) rgb(c, 0.14, 0.40, 0.18);
});
M.I_TAPIS = material('tapis', c => { rgb(c, 0.40, 0.16, 0.12); if (mod(c.a, 6) < 1 || mod(c.b, 6) < 1) rgb(c, 0.62, 0.48, 0.26); grain(c, 0.08); });
M.I_CARTON = material('carton', c => { rgb(c, 0.56, 0.42, 0.26); if (c.face === TOP) mul(c, 1.1); grain(c, 0.06); });
M.I_FLIPPER = material('flipper', c => {
  if (c.face === TOP) { rgb(c, 0.10, 0.10, 0.14); c.er = 0.35 * hash(Math.floor(c.a), Math.floor(c.b), 713, 0); c.eg = 0.10; c.eb = 0.40 * hash(Math.floor(c.b), Math.floor(c.a), 714, 0); return; }
  rgb(c, 0.55, 0.12, 0.22); if (mod(c.b, 4) === 0) rgb(c, 0.85, 0.70, 0.20);
}, { noAOrecv: true });
M.I_JUKEBOX = material('juke-box', c => { rgb(c, 0.40, 0.20, 0.10); if (c.face !== TOP && mod(c.b, 3) === 0) { c.er = 1.0; c.eg = 0.45; c.eb = 0.15; } if (c.face !== TOP && mod(c.a, 4) === 0) { c.er = 0.9; c.eg = 0.2; c.eb = 0.5; } });
M.I_CARRELAGE_BLANC = material('carrelage blanc', c => {
  if (c.face !== TOP) { rgb(c, 0.62, 0.62, 0.60); return; }
  const a = mod(c.a, 4), b = mod(c.b, 4);
  if (a === 0 || b === 0) rgb(c, 0.52, 0.52, 0.50); else { rgb(c, 0.80, 0.80, 0.77); grain(c, 0.02); }
});

// ─────────────────────────────────────────────────────────────── le kit
// Toutes les coordonnées sont locales à la pièce (voir l'en-tête). Les tailles sont en voxels
// de 20 cm : une chaise fait 2 × 2, une table de café 4 × 4, un comptoir 5 de haut, une
// porte 10, un personnage 10.
function kit(W, def, passe) {
  const SX = def.sx, SY = def.sy, H = def.h || HAUT;
  const objets = [], places = {}, lampes = [];
  const K = {
    W, M, SX, SY, H, jour: passe === 'jour', nuit: passe === 'nuit', hash,
    boite(x0, y0, z0, x1, y1, z1, m) { W.box(x0, y0, z0, x1, y1, z1, m); },
    voxel(x, y, z, m) { W.set(x, y, z, m); },
    // le sol et les murs
    sol(m) { W.box(0, 0, -1, SX, SY, 0, m); },
    murs(o = {}) {
      const bas = o.bas || M.I_MUR_BLANC, haut = o.haut || bas, cz = o.coupe != null ? o.coupe : 6;
      W.box(-2, -2, -1, SX, 0, cz, bas); W.box(-2, -2, cz, SX, 0, H, haut);
      W.box(-2, 0, -1, 0, SY, cz, bas); W.box(-2, 0, cz, 0, SY, H, haut);
      if (o.plinthe) { W.box(0, 0, 0, SX, 1, 1, o.plinthe); W.box(0, 0, 0, 1, SY, 1, o.plinthe); }
      if (o.frise) { W.box(-1, -1, cz, SX, 0, cz + 1, o.frise); W.box(-1, 0, cz, 0, SY, cz + 1, o.frise); }
    },
    // le muret de devant et le passage de la porte
    devant(m) {
      const p = def.porte, mm = m || M.WOOD_DARK;
      for (let x = 0; x <= SX; x++) if (!(p.cote === 'y' && x >= p.de && x < p.a)) W.box(x, SY, -1, x + 1, SY + 1, 2, mm);
      for (let y = 0; y < SY; y++) if (!(p.cote === 'x' && y >= p.de && y < p.a)) W.box(SX, y, -1, SX + 1, y + 1, 2, mm);
      // le paillasson, et le seuil
      if (p.cote === 'x') { W.box(SX - 3, p.de, -1, SX, p.a, 0, M.I_TAPIS); W.box(SX, p.de, -1, SX + 1, p.a, 0, M.STONE); }
      else { W.box(p.de, SY - 3, -1, p.a, SY, 0, M.I_TAPIS); W.box(p.de, SY, -1, p.a, SY + 1, 0, M.STONE); }
    },
    // les deux murs du fond, comme façades (pour les fenêtres, affiches, enseignes de B.Facade) :
    // murY est le mur y < 0 (s = x) ; murX le mur x < 0 (s compte depuis le devant, y = sy)
    murY: new Facade(W, LEFT, 0, -2, SX, 2),
    murX: new Facade(W, RIGHT, -2, 0, 2, SY),
    sX(y0, w) { return SY - y0 - w; },      // la position s sur murX d'une chose qui couvre y0 … y0 + w
    fenetreY(x0, z0, w, h, o = {}) { return fenetre(K.murY, x0, z0, w, h, o); },
    fenetreX(y0, z0, w, h, o = {}) { return fenetre(K.murX, K.sX(y0, w), z0, w, h, o); },
    afficheY(x0, z0, w, h, o = {}) { return K.murY.poster(x0, z0, w, h, Object.assign({ bg: [0.7, 0.66, 0.56], fg: [0.3, 0.3, 0.3], seed: x0 * 7 + z0, depth: 0 }, o)); },
    afficheX(y0, z0, w, h, o = {}) { return K.murX.poster(K.sX(y0, w), z0, w, h, Object.assign({ bg: [0.7, 0.66, 0.56], fg: [0.3, 0.3, 0.3], seed: y0 * 11 + z0, depth: 0 }, o)); },
    enseigneY(x0, zHaut, texte, o = {}) { return K.murY.sign(x0, zHaut, texte, Object.assign({ fg: [0.86, 0.82, 0.70], plate: [0.2, 0.18, 0.18], depth: -1, padX: 1, padY: 1 }, o)); },
    enseigneX(y0, zHaut, texte, o = {}) { const b = E.textBitmap(texte), nw = Math.ceil((b.w + 2) / 2); return K.murX.sign(K.sX(y0, nw), zHaut, texte, Object.assign({ fg: [0.86, 0.82, 0.70], plate: [0.2, 0.18, 0.18], depth: -1, padX: 1, padY: 1 }, o)); },
    surMurY(x0, z0, x1, z1, m) { W.box(x0, 0, z0, x1, 1, z1, m); },
    surMurX(y0, z0, y1, z1, m) { W.box(0, y0, z0, 1, y1, z1, m); },
    // la lumière : une lampe a une ampoule (sauf `cache`) ; le jour, elle compte moitié
    lampe(x, y, z, o = {}) {
      const c = o.c || [1.3, 0.95, 0.55], k = passe === 'jour' && !o.toujours ? 0.5 : 1;
      if (!o.cache) W.set(Math.floor(x), Math.floor(y), Math.floor(z), o.ampoule || M.BULB);
      W.light({ x, y, z: z - 0.5, r: o.r || 40, fall: o.fall || 1.4, cr: c[0] * k, cg: c[1] * k, cb: c[2] * k, skip: 1.2, shadow: o.ombre !== false });
      lampes.push({ x, y, z });
    },
    plafonnier(x, y, o = {}) { W.box(Math.floor(x), Math.floor(y), H - 2, Math.floor(x) + 1, Math.floor(y) + 1, H, M.METAL_DARK); K.lampe(x + 0.5, y + 0.5, H - 3, Object.assign({ r: 70 }, o)); },
    neon(x0, y0, x1, y1, z, m, o = {}) {
      W.box(x0, y0, z, x1, y1, z + 1, m || M.TUBE);
      const c = o.c || [0.7, 0.85, 0.85];
      W.light({ x: (x0 + x1) / 2, y: (y0 + y1) / 2 + 1, z: z - 1, r: o.r || 44, fall: 1.3, cr: c[0], cg: c[1], cb: c[2], skip: 1.2, shadow: false });
    },
    // ce que l'on touche, et où l'on se tient
    // `acces` : où l'on se tient pour s'en servir (sinon la case libre la plus proche, devant)
    objet(id, label, x, y, z = 4, o = {}) { objets.push({ id, label, x, y, z, acces: o.acces || null }); },
    // `pour` : qui s'y tient — 'personnel' (le patron, la secrétaire), 'client' (les gens de
    // passage), 'visiteur' (celui qui t'attend), ou l'id d'un personnage (sa place à lui)
    place(nom, x, y, o = {}) { places[nom] = { x, y, pose: o.pose || 'debout', regarde: o.regarde || 'droite', pour: o.pour || 'client' }; },
    // ─── le mobilier
    table(x, y, w, d, o = {}) {
      const h = o.h || 4, m = o.mat || M.WOOD, pied = o.pied || M.WOOD_DARK;
      if (o.pied === 'central') { W.box(x + Math.floor(w / 2), y + Math.floor(d / 2), 0, x + Math.floor(w / 2) + 1, y + Math.floor(d / 2) + 1, h - 1, M.METAL_DARK); }
      else for (const [px, py] of [[x, y], [x + w - 1, y], [x, y + d - 1], [x + w - 1, y + d - 1]]) W.box(px, py, 0, px + 1, py + 1, h - 1, pied);
      W.box(x, y, h - 1, x + w, y + d, h, m);
      if (o.nappe) W.box(x, y, h, x + w, y + d, h, o.nappe);
    },
    // une chaise : `dos` dit où est le dossier ('x-' : côté x petit, 'y+' : côté y grand…)
    chaise(x, y, o = {}) {
      const m = o.mat || M.WOOD_DARK, dos = o.dos || 'y-';
      W.box(x, y, 0, x + 2, y + 2, 2, m);
      if (dos === 'x-') W.box(x, y, 2, x + 1, y + 2, 5, m);
      if (dos === 'x+') W.box(x + 1, y, 2, x + 2, y + 2, 5, m);
      if (dos === 'y-') W.box(x, y, 2, x + 2, y + 1, 5, m);
      if (dos === 'y+') W.box(x, y + 1, 2, x + 2, y + 2, 5, m);
    },
    tabouret(x, y, o = {}) { W.box(x, y, 0, x + 1, y + 1, 3, M.METAL_DARK); W.box(x, y, 3, x + 2, y + 2, 4, o.mat || M.I_SKAI); },
    banc(x0, y0, x1, y1, o = {}) { W.box(x0, y0, 0, x1, y1, 2, o.mat || M.WOOD); },
    // le comptoir : un bloc de bois et son dessus de zinc
    comptoir(x0, y0, x1, y1, o = {}) { W.box(x0, y0, 0, x1, y1, (o.h || 5) - 1, o.mat || M.WOOD_DARK); W.box(x0, y0, (o.h || 5) - 1, x1, y1, o.h || 5, o.dessus || M.I_ZINC); },
    etagere(x0, y0, x1, y1, z0, z1, m) { for (let z = z0; z < z1; z += 3) W.box(x0, y0, z, x1, y1, z + 1, M.WOOD_DARK); if (m) for (let z = z0 + 1; z < z1; z += 3) W.box(x0, y0, z, x1, y1, z + 2, m); },
    bouteilles(x0, y0, x1, y1, z) { W.box(x0, y0, z, x1, y1, z + 2, M.I_BOUTEILLES); },
    lit(x, y, o = {}) {
      const L = o.long || 10, l = o.large || 7, sens = o.sens || 'x';
      const [w, d] = sens === 'x' ? [L, l] : [l, L];
      W.box(x, y, 0, x + w, y + d, 2, M.WOOD_DARK); W.box(x, y, 2, x + w, y + d, 3, M.WHITE);
      if (sens === 'x') { W.box(x + 3, y, 3, x + w, y + d, 4, o.couverture || M.BLANKET); W.box(x, y + 1, 3, x + 2, y + d - 1, 4, M.WHITE); W.box(x, y, 0, x + 1, y + d, 5, M.WOOD_DARK); }
      else { W.box(x, y + 3, 3, x + w, y + d, 4, o.couverture || M.BLANKET); W.box(x + 1, y, 3, x + w - 1, y + 2, 4, M.WHITE); W.box(x, y, 0, x + w, y + 1, 5, M.WOOD_DARK); }
    },
    canape(x, y, w, o = {}) {
      const m = o.mat || M.I_VELOURS, sens = o.sens || 'y-';
      if (sens === 'y-' || sens === 'y+') { W.box(x, y, 0, x + w, y + 3, 2, m); W.box(x, sens === 'y-' ? y : y + 2, 2, x + w, sens === 'y-' ? y + 1 : y + 3, 5, m); W.box(x, y, 2, x + 1, y + 3, 3, m); W.box(x + w - 1, y, 2, x + w, y + 3, 3, m); }
      else { W.box(x, y, 0, x + 3, y + w, 2, m); W.box(sens === 'x-' ? x : x + 2, y, 2, sens === 'x-' ? x + 1 : x + 3, y + w, 5, m); W.box(x, y, 2, x + 3, y + 1, 3, m); W.box(x, y + w - 1, 2, x + 3, y + w, 3, m); }
    },
    fauteuil(x, y, o = {}) { K.canape(x, y, 3, o); },
    bureau(x, y, w, d, o = {}) {
      W.box(x, y, 0, x + w, y + d, 3, o.mat || M.WOOD_DARK); W.box(x, y, 3, x + w, y + d, 4, o.dessus || o.mat || M.WOOD_DARK);
      if (o.papiers !== false) { W.box(x + 1, y + 1, 4, x + 3, y + 3, 5, M.PAPER); }
    },
    lampeBureau(x, y, z = 4) { W.box(x, y, z, x + 1, y + 1, z + 3, M.GOLD); K.lampe(x + 0.5, y + 0.5, z + 3, { r: 30, c: [1.2, 0.85, 0.45] }); },
    telephone(x, y, z = 4) { W.box(x, y, z, x + 2, y + 1, z + 1, M.METAL_DARK); },
    tele(x, y, o = {}) {
      const z = o.z || 0, sens = o.sens || 'x';
      if (z === 0) W.box(x, y, 0, x + 3, y + 3, 3, M.WOOD_DARK);
      const zz = z || 3;
      W.box(x, y, zz, x + 3, y + 3, zz + 3, M.METAL_DARK);
      const ecran = (o.allumee !== false) ? M.CRT : M.GLASS;
      if (sens === 'x') W.box(x + 3, y, zz, x + 4, y + 3, zz + 3, ecran); else W.box(x, y + 3, zz, x + 3, y + 4, zz + 3, ecran);
      if (o.allumee !== false) W.light({ x: sens === 'x' ? x + 6 : x + 1.5, y: sens === 'x' ? y + 1.5 : y + 6, z: zz + 2, r: 22, cr: 0.12, cg: 0.30, cb: 0.22, shadow: false });
    },
    frigo(x, y) { W.box(x, y, 0, x + 3, y + 3, 9, M.ENAMEL); },
    plante(x, y) { W.box(x, y, 0, x + 2, y + 2, 2, M.PLASTIC_RED); W.box(x - 1, y - 1, 2, x + 3, y + 3, 6, M.HEDGE); },
    radiateur(x0, y0, x1, y1) { W.box(x0, y0, 1, x1, y1, 4, M.METAL); },
    horlogeY(x, z) { W.box(x, 0, z, x + 2, 1, z + 2, M.CLOCK); },
    horlogeX(y, z) { W.box(0, y, z, 1, y + 2, z + 2, M.CLOCK); },
    tapis(x0, y0, x1, y1) { W.box(x0, y0, -1, x1, y1, 0, M.I_TAPIS); },
    casiers(x0, y0, x1, y1, o = {}) { W.box(x0, y0, 0, x1, y1, o.h || 10, o.mat || M.METAL); },
    caisse(x, y, z = 5) { W.box(x, y, z, x + 2, y + 2, z + 2, M.METAL_DARK); W.set(x, y, z + 2, M.LIT_PANEL); },
    presentoir(x0, y0, x1, y1) { W.box(x0, y0, 0, x1, y1, 6, M.WOOD_DARK); W.box(x0, y0, 6, x1, y1, 7, M.PAPER); },
    flipper(x, y, sens = 'x') { const [w, d] = sens === 'x' ? [5, 3] : [3, 5]; W.box(x, y, 0, x + w, y + d, 4, M.METAL_DARK); W.box(x, y, 4, x + w, y + d, 5, M.I_FLIPPER); W.box(x, y, 5, sens === 'x' ? x + 1 : x + w, sens === 'x' ? y + d : y + 1, 9, M.I_FLIPPER); W.light({ x: x + w / 2, y: y + d / 2, z: 7, r: 16, cr: 0.5, cg: 0.2, cb: 0.6, shadow: false }); },
    babyfoot(x, y) { W.box(x, y, 0, x + 6, y + 4, 4, M.WOOD); W.box(x + 1, y + 1, 3, x + 5, y + 3, 4, M.I_DRAP); for (let i = 1; i < 6; i += 1) W.box(x + i, y - 1, 3, x + i + 1, y + 5, 3 + 0, M.CHROME); },
    billard(x, y) { W.box(x, y, 0, x + 10, y + 6, 4, M.WOOD_DARK); W.box(x + 1, y + 1, 4, x + 9, y + 5, 4, M.I_DRAP); W.box(x, y, 4, x + 10, y + 1, 5, M.WOOD_DARK); W.box(x, y + 5, 4, x + 10, y + 6, 5, M.WOOD_DARK); W.box(x, y, 4, x + 1, y + 6, 5, M.WOOD_DARK); W.box(x + 9, y, 4, x + 10, y + 6, 5, M.WOOD_DARK); },
    jukebox(x, y) { W.box(x, y, 0, x + 3, y + 3, 7, M.I_JUKEBOX); W.light({ x: x + 4, y: y + 4, z: 5, r: 18, cr: 0.6, cg: 0.25, cb: 0.2, shadow: false }); },
    cibleY(x, z) { W.box(x, 0, z, x + 3, 1, z + 3, M.I_CIBLE); },
    cibleX(y, z) { W.box(0, y, z, 1, y + 3, z + 3, M.I_CIBLE); },
    machineALaver(x, y) { W.box(x, y, 0, x + 3, y + 3, 5, M.ENAMEL); },
    miroirY(x, z, w = 4, h = 5) { W.box(x, 0, z, x + w, 1, z + h, M.GLASS); },
    cartons(x, y, n = 3) { for (let i = 0; i < n; i++) W.box(x + (i % 2) * 3, y + Math.floor(i / 2) * 3, 0, x + (i % 2) * 3 + 3, y + Math.floor(i / 2) * 3 + 3, 3 + (i % 3), M.I_CARTON); },
    coffre(x, y) { W.box(x, y, 0, x + 4, y + 4, 6, M.METAL_DARK); W.set(x + 3, y + 4, 3, M.GOLD); },
    porteManteau(x, y) { W.box(x, y, 0, x + 1, y + 1, 9, M.WOOD_DARK); W.box(x - 1, y - 1, 7, x + 2, y + 2, 8, M.JERSEY); },
    // un personnage figé dans l'image (rare : on préfère les places, que la page anime)
    figurant(nom, x, y) { if (SP[nom]) W.sprite(Object.assign({ x, y, z: 0 }, SP[nom])); },
  };
  K._fin = () => ({ objets, places, lampes });
  return K;
}

// une fenêtre du fond : le ciel le jour, la nuit bleue ensuite
function fenetre(f, s0, z0, w, h, o) {
  const jour = f._passe === 'jour';
  return f.window(s0, z0, w, h, Object.assign({
    state: 'lit', col: jour ? [0.72, 0.80, 0.95] : [0.10, 0.12, 0.26], k: jour ? 0.7 : 0.25,
    curtain: o.rideau, spill: false, sill: o.rebord !== false,
  }, o));
}

// ─────────────────────────────────────────────────────────────── le rendu d'une pièce
function construire(def, passe) {
  const SX = def.sx, SY = def.sy, H = def.h || HAUT;
  const W = new E.World(SX + 2 * MARGE + 2, SY + 2 * MARGE + 2, H + 6, ZL);
  W.at(MARGE, MARGE);
  W.slabTop = ZL;
  const K = kit(W, def, passe);
  K.murY._passe = passe; K.murX._passe = passe;
  // la dalle sous la pièce, le sol, les murs, le muret (une pièce peut tout refaire)
  // les matières se nomment (« BRICK », « I_MUR_BORDEAUX ») ou se passent telles quelles
  const mat = v => (typeof v === 'string' ? M[v] : v);
  W.box(-2, -2, -2, SX + 1, SY + 1, -1, M.CONCRETE);
  K.sol(def.sol ? mat(def.sol) || def.sol : M.I_PARQUET);
  const murs = {};
  for (const [k, v] of Object.entries(def.murs || {})) murs[k] = typeof v === 'string' && M[v] ? M[v] : v;
  if (!def.sansMurs) K.murs(murs);
  def.build(K);
  if (!def.sansDevant) K.devant(def.muret ? mat(def.muret) : null);
  return { W, K };
}

const PASSES = {
  jour: { ambient: [0.80, 0.76, 0.70] },
  nuit: { ambient: [0.24, 0.21, 0.25] },
};
const FOND = [0.055, 0.035, 0.024];

function rendre(def) {
  const res = {};
  let cadre = null;
  for (const passe of ['nuit', 'jour']) {
    const { W, K } = construire(def, passe);
    if (!cadre) {
      // le cadrage : la boîte englobante de tous les voxels, et une marge
      let u0 = 1e9, u1 = -1e9, v0 = 1e9, v1 = -1e9;
      for (let z = 0; z < W.Z; z++) for (let y = 0; y < W.Y; y++) for (let x = 0; x < W.X; x++) {
        if (!W.mat[(z * W.Y + y) * W.X + x]) continue;
        for (const [dx, dy, dz] of [[0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 0], [1, 0, 0], [0, 1, 0]]) {
          const u = 2 * ((x + dx) - (y + dy)), v = (x + dx) + (y + dy) - 2 * (z + dz);
          if (u < u0) u0 = u; if (u > u1) u1 = u; if (v < v0) v0 = v; if (v > v1) v1 = v;
        }
      }
      const pad = 6, FW = u1 - u0 + 2 * pad, FH = v1 - v0 + 2 * pad + 4;
      cadre = { FW, FH, cu: u0 - pad, cv: v0 - pad - 4 };
    }
    const opt = {
      width: cadre.FW, height: cadre.FH, cu: cadre.cu, cv: cadre.cv,
      ambient: PASSES[passe].ambient, faceAmb: [1.0, 0.80, 0.62], sun: [0, 0, 0], sunDir: [0, 0, 1],
      backdrop: () => [FOND[0], FOND[1], FOND[2], 0, 0, 0], fogColor: () => FOND, fogS0: -2000, fogS1: -1000,
      wetRow: 4, reflAmb: [0.3, 0.27, 0.25], wetStrength: 0.5,
      bloom: [[2, 0.30], [6, 0.18]], levels: 48, lightQuant: 6, log: false, outlineDark: 0.55,
    };
    const r = E.render(W, opt);
    res[passe] = r;
    if (passe === 'nuit') { res.W = W; res.K = K; }
  }
  return Object.assign(res, cadre);
}

// la grille où l'on marche : une case de 2 × 2 voxels est praticable si ses quatre colonnes ont
// un sol et 1,80 m libre au-dessus ; le passage de la porte en est
function grille(W, def) {
  const G = Math.ceil(Math.max(W.X, W.Y) / CELL), g = new Uint8Array(G * G);
  const libre = (x, y) => {
    if (!W.get(x, y, -1)) return false;
    for (let z = 0; z < 9; z++) if (W.get(x, y, z)) return false;
    return true;
  };
  for (let cy = 0; cy < G; cy++) for (let cx = 0; cx < G; cx++) {
    let n = 0;
    for (let j = 0; j < CELL; j++) for (let i = 0; i < CELL; i++) {
      const x = cx * CELL + i - MARGE, y = cy * CELL + j - MARGE;      // world → local
      if (x >= 0 && y >= 0 && x < def.sx && y < def.sy && libre(x, y)) n++;
    }
    if (n === CELL * CELL) g[cy * G + cx] = 1;
  }
  return { G, g };
}
function caseDe(xw, yw) { return [Math.floor(xw / CELL), Math.floor(yw / CELL)]; }
function plusProche(G, g, cx, cy, pref) {
  let best = null, bd = 1e9;
  for (let y = 0; y < G; y++) for (let x = 0; x < G; x++) {
    if (!g[y * G + x]) continue;
    // `pref` : devant l'objet (vers la caméra) plutôt que derrière lui
    const dx = x - cx, dy = y - cy, d = dx * dx + dy * dy - (pref ? 0.25 * (dx + dy) : 0) + (pref && dx + dy < 0 ? 30 : 0);
    if (d < bd) { bd = d; best = [x, y]; }
  }
  return best;
}
// une seule pièce d'un tenant, reliée à la porte
function relier(G, g, porte) {
  const comp = new Uint8Array(G * G), q = [porte[1] * G + porte[0]];
  comp[q[0]] = 1;
  while (q.length) {
    const k = q.pop(), x = k % G, y = (k - x) / G;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy, nk = ny * G + nx;
      if (nx >= 0 && ny >= 0 && nx < G && ny < G && g[nk] && !comp[nk]) { comp[nk] = 1; q.push(nk); }
    }
  }
  let n = 0;
  for (let k = 0; k < G * G; k++) { if (g[k] && !comp[k]) g[k] = 0; n += g[k]; }
  return n;
}

function png(fichier, img, w, h) { E.writePNG(fichier, img, w, h, 1); }
function webp(src, dst) { execFileSync('convert', [src, '-define', 'webp:lossless=true', '-define', 'webp:method=6', dst]); }

function exporter(def) {
  const t0 = Date.now();
  const r = rendre(def), W = r.W, { objets, places } = r.K._fin();
  const FW = r.FW, FH = r.FH;
  png(path.join(OUT, `int_${def.cle}_jour.png`), r.jour.img, FW, FH);
  png(path.join(OUT, `int_${def.cle}_nuit.png`), r.nuit.img, FW, FH);
  const dimg = Buffer.alloc(FW * FH * 3);
  for (let k = 0; k < FW * FH; k++) {
    const d = r.nuit.dv[k];
    if (d < -1e8) continue;
    const q = Math.max(1, Math.min(65535, Math.round(d * 8) + 1));
    dimg[k * 3] = q >> 8; dimg[k * 3 + 1] = q & 255;
  }
  png(path.join(OUT, `int_${def.cle}_prof.png`), dimg, FW, FH);
  // la grille, la porte (la case du passage, la plus près du seuil)
  const { G, g } = grille(W, def);
  const p = def.porte, mid = (p.de + p.a) / 2;
  const seuil = p.cote === 'x' ? [def.sx - 1 + MARGE, mid + MARGE] : [mid + MARGE, def.sy - 1 + MARGE];
  const sc = caseDe(seuil[0], seuil[1]);
  const porte = plusProche(G, g, sc[0], sc[1], false);
  if (!porte) throw new Error(def.cle + ' : la porte ne donne sur aucune case praticable');
  const n = relier(G, g, porte);
  // les objets : leur case d'accès, la plus proche (de préférence devant, vers la caméra)
  const obj = objets.map(o => {
    const xw = o.x + MARGE, yw = o.y + MARGE, c = o.acces ? caseDe(o.acces[0] + MARGE, o.acces[1] + MARGE) : caseDe(xw, yw), a = plusProche(G, g, c[0], c[1], !o.acces);
    if (!a) throw new Error(def.cle + ' : l\'objet ' + o.id + ' n\'a pas de case d\'accès');
    return { id: o.id, label: o.label, x: xw, y: yw, z: o.z + ZL, acces: a };
  });
  if (def.plan) {
    const ids = new Set(obj.map(o => o.id)), noms = new Set(Object.keys(places));
    const manque = [...def.plan.objets.map(o => o[0]).filter(i => !ids.has(i)).map(i => 'objet ' + i), ...def.plan.places.map(q => q[0]).filter(n => !noms.has(n)).map(n => 'place ' + n)];
    if (manque.length) throw new Error(def.cle + ' : la pièce modelée oublie ce que le plan promet : ' + manque.join(', '));
  }
  const pl = {};
  for (const [nom, q] of Object.entries(places)) {
    const xw = q.x + MARGE, yw = q.y + MARGE;
    pl[nom] = { x: xw, y: yw, pose: q.pose, miroir: q.regarde === 'gauche', pour: q.pour };
  }
  const bits = Buffer.alloc(Math.ceil(G * G / 8));
  for (let k = 0; k < G * G; k++) if (g[k]) bits[k >> 3] |= 1 << (k & 7);
  // l'aperçu de contrôle : la grille en vert, la porte en rouge, les objets en jaune, les places en bleu
  const ap = Buffer.from(r.nuit.img);
  const point = (u, v, c, rr = 1) => { for (let j = -rr; j <= rr; j++) for (let i = -rr; i <= rr; i++) { const px = Math.round(u) + i, py = Math.round(v) + j; if (px < 0 || py < 0 || px >= FW || py >= FH) continue; const k = (py * FW + px) * 3; ap[k] = c[0]; ap[k + 1] = c[1]; ap[k + 2] = c[2]; } };
  const proj = (x, y, z) => [2 * (x - y) - r.cu, x + y - 2 * z - r.cv];
  for (let cy = 0; cy < G; cy++) for (let cx = 0; cx < G; cx++) if (g[cy * G + cx]) { const q = proj(cx * CELL + 1, cy * CELL + 1, ZL); point(q[0], q[1], [40, 200, 90], 0); }
  { const q = proj(porte[0] * CELL + 1, porte[1] * CELL + 1, ZL); point(q[0], q[1], [230, 30, 60], 2); }
  for (const o of obj) { const q = proj(o.x, o.y, o.z); point(q[0], q[1], [250, 210, 40], 1); const a = proj(o.acces[0] * CELL + 1, o.acces[1] * CELL + 1, ZL); point(a[0], a[1], [250, 150, 40], 0); }
  for (const q of Object.values(pl)) { const s = proj(q.x, q.y, ZL); point(s[0], s[1], [60, 140, 250], 1); }
  E.writePNG(path.join(OUT, `apercu_${def.cle}.png`), ap, FW, FH, 3);
  console.log(`${def.cle} : ${FW} × ${FH}, ${n} cases, ${obj.length} objets, ${Object.keys(pl).length} places (${Date.now() - t0} ms)`);
  return {
    cle: def.cle, nom: def.nom, ambiance: def.ambiance || 'maison', personnel: def.personnel || null, w: FW, h: FH, cu: r.cu, cv: r.cv, zsol: ZL,
    cell: CELL, size: G, bits: bits.toString('base64'), porte, objets: obj, places: pl,
  };
}

// L'ÉBAUCHE : une pièce du plan (pieces/_plan.js) qui n'a pas encore son fichier. Des meubles
// génériques, choisis d'après le nom de chaque objet, le long des deux murs du fond ; les places
// au milieu, en rangs. De quoi entrer, marcher, toucher, et jouer une scène, en attendant mieux.
function meubleGenerique(K, id, x, y, mur) {
  const { M } = K, a = id;
  const surMur = (z0, z1, m, w = 6) => { if (mur === 'y') K.boite(x - w / 2, 0, z0, x + w / 2, 1, z1, m); else K.boite(0, y - w / 2, z0, 1, y + w / 2, z1, m); };
  const bloc = (w, d, h, m, top) => {
    const [x0, y0] = mur === 'y' ? [x - w / 2, 1] : [1, y - w / 2], [x1, y1] = mur === 'y' ? [x + w / 2, 1 + d] : [1 + d, y + w / 2];
    K.boite(x0, y0, 0, x1, y1, h, m); if (top) K.boite(x0, y0, h, x1, y1, h + 1, top);
  };
  if (/comptoir|guichet|reception|accueil|caisse|^bar$|confiserie/.test(a)) { bloc(9, 3, 4, M.WOOD_DARK, M.I_ZINC); if (/caisse/.test(a)) K.caisse(mur === 'y' ? x : 2, mur === 'y' ? 2 : y); return 5; }
  if (/tele|video/.test(a)) { K.tele(mur === 'y' ? x - 1 : 1, mur === 'y' ? 1 : y - 1, { sens: mur === 'y' ? 'y' : 'x' }); return 5; }
  if (/lit|matelas/.test(a)) { K.lit(mur === 'y' ? x - 4 : 1, mur === 'y' ? 1 : y - 3, { sens: mur === 'y' ? 'y' : 'x', long: 9, large: 6 }); return 3; }
  if (/flipper/.test(a)) { K.flipper(mur === 'y' ? x - 1 : 1, mur === 'y' ? 1 : y - 2, mur === 'y' ? 'y' : 'x'); return 5; }
  if (/flechettes|cible/.test(a)) { if (mur === 'y') K.cibleY(x - 1, 7); else K.cibleX(y - 1, 7); return 8; }
  if (/jukebox/.test(a)) { K.jukebox(mur === 'y' ? x - 1 : 1, mur === 'y' ? 1 : y - 1); return 6; }
  if (/machines|sechoirs|chambre_froide/.test(a)) { for (let i = -1; i <= 1; i++) K.machineALaver(mur === 'y' ? x + i * 4 - 1 : 1, mur === 'y' ? 1 : y + i * 4 - 1); return 5; }
  if (/coffre/.test(a)) { K.coffre(mur === 'y' ? x - 2 : 1, mur === 'y' ? 1 : y - 2); return 4; }
  if (/frigo/.test(a)) { K.frigo(mur === 'y' ? x - 1 : 1, mur === 'y' ? 1 : y - 1); return 7; }
  if (/plante|gerbes|fleurs/.test(a)) { K.plante(mur === 'y' ? x - 1 : 2, mur === 'y' ? 2 : y - 1); if (/fleurs|gerbes/.test(a)) K.plante(mur === 'y' ? x + 2 : 2, mur === 'y' ? 2 : y + 2); return 4; }
  if (/miroir/.test(a)) { if (mur === 'y') K.miroirY(x - 2, 4, 4, 7); else K.boite(0, y - 2, 4, 1, y + 2, 11, M.GLASS); return 7; }
  if (/salon|banquettes|alcove|attente/.test(a)) { K.canape(mur === 'y' ? x - 4 : 1, mur === 'y' ? 1 : y - 4, 8, { sens: mur === 'y' ? 'y-' : 'x-', mat: /alcove/.test(a) ? M.I_VELOURS : M.I_SKAI }); return 3; }
  if (/table|bureau|conseil|devoirs|pliage|pupitres|etabli|des$|maquette|registre/.test(a)) {
    const [tx, ty] = mur === 'y' ? [x - 4, 3] : [3, y - 3];
    if (/bureau/.test(a)) K.bureau(tx, ty, 8, 4); else K.table(tx, ty, 8, 5, { mat: /des$/.test(a) ? M.I_DRAP : M.WOOD });
    if (/des$/.test(a)) K.boite(tx + 2, ty + 1, 4, tx + 6, ty + 4, 4, M.I_DRAP);
    if (/maquette/.test(a)) { K.boite(tx + 2, ty + 1, 4, tx + 4, ty + 3, 6, M.WHITE); K.boite(tx + 5, ty + 2, 4, tx + 7, ty + 4, 5, M.WHITE); }
    return 5;
  }
  if (/four|poele/.test(a)) { bloc(5, 4, /four/.test(a) ? 8 : 5, /four/.test(a) ? M.BRICK : M.METAL_DARK); K.lampe(mur === 'y' ? x : 3, mur === 'y' ? 3 : y, 2, { r: 18, c: [1.2, 0.5, 0.2], cache: true }); return 6; }
  if (/pont/.test(a)) { for (const d of [-4, 4]) bloc(1, 1, 12, M.METAL); bloc(10, 6, 1, M.METAL_DARK); return 3; }
  if (/bache/.test(a)) { const [bx, by] = mur === 'y' ? [x - 6, 2] : [2, y - 3]; K.boite(bx, by, 0, bx + (mur === 'y' ? 12 : 6), by + (mur === 'y' ? 6 : 12), 4, M.TARP); return 4; }
  if (/pneus|ballons|cartons|palettes|sac|chasubles|filets|tondeuse|halteres|crampons/.test(a)) {
    const m = /pneus/.test(a) ? M.TIRE : /ballons/.test(a) ? M.BALLS : /chasubles/.test(a) ? M.JERSEY : /filets/.test(a) ? M.NET : /palettes/.test(a) ? M.WOOD : /halteres/.test(a) ? M.METAL_DARK : M.I_CARTON;
    bloc(6, 3, 3, m); return 4;
  }
  if (/autel/.test(a)) { bloc(8, 4, 5, M.STONE, M.WHITE); K.lampe(mur === 'y' ? x : 3, mur === 'y' ? 3 : y, 7, { r: 20, c: [1.2, 0.85, 0.45] }); return 6; }
  if (/cierge|bougie/.test(a)) { bloc(3, 2, 4, M.WOOD_DARK); K.lampe(mur === 'y' ? x : 2, mur === 'y' ? 2 : y, 5, { r: 16, c: [1.3, 0.8, 0.3] }); return 5; }
  if (/bancs/.test(a)) { K.banc(mur === 'y' ? x - 6 : 2, mur === 'y' ? 2 : y - 6, mur === 'y' ? x + 6 : 4, mur === 'y' ? 4 : y + 6); return 3; }
  if (/confessionnal|cabine|vestiaire|consigne|cadenas|casier|distributeur|escalier/.test(a)) { bloc(5, 4, 12, /distributeur/.test(a) ? M.METAL : M.WOOD_DARK); if (/distributeur/.test(a)) K.voxel(mur === 'y' ? x : 4, mur === 'y' ? 4 : y, 6, M.LIT_PANEL); return 6; }
  if (/banc$|sac$|tapis/.test(a)) { bloc(6, 2, 3, M.METAL_DARK, M.I_SKAI); return 4; }
  if (/fenetre|vitre/.test(a)) { if (mur === 'y') K.fenetreY(x - 3, 7, 6, 5, {}); else K.fenetreX(y - 3, 7, 6, 5, {}); return 9; }
  if (/rideau/.test(a)) { surMur(0, 14, M.I_VELOURS, 8); return 7; }
  if (/drapeau/.test(a)) { surMur(8, 14, M.FLAG, 4); bloc(2, 2, 6, M.STONE); return 8; }
  if (/piste|craie/.test(a)) { K.boite(mur === 'y' ? x - 5 : 4, mur === 'y' ? 6 : y - 5, -1, mur === 'y' ? x + 5 : 14, mur === 'y' ? 16 : y + 5, 0, /craie/.test(a) ? M.CHALK : M.I_DRAP); return 1; }
  if (/plaque|noms|tags/.test(a)) { surMur(5, 12, /tags/.test(a) ? M.POSTER : M.CIM_GRANITE || M.STONE, 7); return 8; }
  if (/radio|telephone|balance/.test(a)) { bloc(3, 2, 4, M.WOOD_DARK); K.voxel(mur === 'y' ? x : 2, mur === 'y' ? 2 : y, 4, M.METAL_DARK); return 5; }
  // les murs qui parlent : rayons, affiches, tableaux, ardoises, horaires, photos
  if (/rayons|archives|registres|livres|magazines|journaux|cartes|echarpes|maillots|costumes|chaussures|pains|cigarettes|fanions|brochures|vignettes|livre_joueur|tiroir|ordonnances|cles|loto|paris/.test(a)) {
    const m = /pains/.test(a) ? M.I_CARTON : /echarpes|maillots|fanions|costumes/.test(a) ? M.JERSEY : /cigarettes/.test(a) ? M.PLASTIC_RED : M.I_LIVRES;
    if (mur === 'y') K.etagere(x - 4, 0, x + 4, 2, 1, 12, m); else K.etagere(0, y - 4, 2, y + 4, 1, 12, m);
    return 7;
  }
  if (/annonces|affiches|horaires|resultats|tableau|ardoise|photo|cadre|vitrine|salle|passe|toit/.test(a)) {
    surMur(6, 13, /tableau|ardoise|resultats|horaires/.test(a) ? M.BOARD : M.POSTER, 7); return 9;
  }
  bloc(5, 3, 6, M.WOOD_DARK, M.WOOD); return 6;
}
function ebauche(p) {
  return Object.assign({}, p, {
    ebauche: true,
    build(K) {
      const n = p.objets.length, surY = Math.ceil(n / 2);
      p.objets.forEach(([id, label], i) => {
        const mur = i < surY ? 'y' : 'x', k = mur === 'y' ? i : i - surY, cnt = mur === 'y' ? surY : n - surY;
        const L = mur === 'y' ? p.sx : p.sy, pas = (L - 8) / cnt, pos = Math.round(5 + pas * (k + 0.5));
        const [x, y] = mur === 'y' ? [pos, 1] : [1, pos];
        const z = meubleGenerique(K, id, x, y, mur);
        K.objet(id, label, x, y, z, { acces: mur === 'y' ? [x, 8] : [8, y] });
      });
      // les places : au milieu, en rangs de 7 voxels
      const libres = [];
      for (let y = 12; y < p.sy - 5; y += 7) for (let x = 12; x < p.sx - 5; x += 7) libres.push([x, y]);
      p.places.forEach(([nom, pour, pose], i) => {
        const [x, y] = libres[i % libres.length] || [p.sx / 2, p.sy / 2];
        if (pose === 'assis') K.chaise(x - 1, y - 2, { dos: 'y-' });
        K.place(nom, x, y, { pose, pour, regarde: i % 2 ? 'gauche' : 'droite' });
      });
      K.plafonnier(Math.round(p.sx / 3), Math.round(p.sy / 2), { c: [1.2, 0.95, 0.65] });
      K.plafonnier(Math.round(p.sx * 2 / 3), Math.round(p.sy / 2), { c: [1.2, 0.95, 0.65] });
    },
  });
}
function charger(cles) {
  const defs = [], vus = new Set();
  for (const f of fs.readdirSync(PIECES).sort()) {
    if (!f.endsWith('.js') || f.startsWith('_')) continue;
    const m = require(path.join(PIECES, f));
    for (const d of Array.isArray(m) ? m : [m]) { vus.add(d.cle); if (!cles.length || cles.includes(d.cle)) defs.push(d); }
  }
  // les pièces du plan qui n'ont pas encore leur fichier : en ébauche
  for (const p of require(path.join(PIECES, '_plan.js'))) {
    if (vus.has(p.cle)) {
      // une pièce modelée reprend tous les objets et toutes les places du plan (vérifié à l'export)
      const d = defs.find(x => x.cle === p.cle); if (d) d.plan = p;
      continue;
    }
    vus.add(p.cle);
    if (!cles.length || cles.includes(p.cle)) defs.push(ebauche(p));
  }
  return defs;
}

if (require.main === module) {
  const cles = process.argv.slice(2);
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(WEB, { recursive: true });
  const defs = charger(cles);
  if (!defs.length) { console.error('aucune pièce'); process.exit(1); }
  const fichierMeta = path.join(WEB, 'interieurs.json');
  const meta = fs.existsSync(fichierMeta) ? JSON.parse(fs.readFileSync(fichierMeta, 'utf8')) : { pieces: {} };
  for (const def of defs) {
    meta.pieces[def.cle] = exporter(def);
    for (const s of ['jour', 'nuit', 'prof']) webp(path.join(OUT, `int_${def.cle}_${s}.png`), path.join(WEB, `int_${def.cle}_${s}.webp`));
  }
  // les pièces dont le fichier a disparu s'en vont aussi
  const toutes = new Set(charger([]).map(d => d.cle));
  for (const k of Object.keys(meta.pieces)) if (!toutes.has(k)) delete meta.pieces[k];
  const tri = {}; for (const k of Object.keys(meta.pieces).sort()) tri[k] = meta.pieces[k];
  fs.writeFileSync(fichierMeta, JSON.stringify({ pieces: tri }));
  console.log(Object.keys(tri).length, 'pièces →', path.relative(process.cwd(), WEB));
}

module.exports = { kit, construire, rendre, exporter, MARGE, ZL, CELL };
