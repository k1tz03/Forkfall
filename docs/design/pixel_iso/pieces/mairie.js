'use strict';
// La mairie : le parquet ciré, le lambris, au fond le bureau de Madame Aubert sous le portrait,
// le drapeau et le buste ; la table du conseil et son tapis vert sous le plan de la ville (le stade
// entouré au crayon rouge) ; l'accueil de l'huissier près de la porte ; les registres de l'état
// civil sur toute la hauteur du mur de gauche.
const E = require('../engine');
const { LEFT, RIGHT, hash } = E;

// ─── la peinture : des images posées sur une face, au texel près (2 par voxel)
const rgb = (c, r, g, b) => { c.cr = r; c.cg = g; c.cb = b; };
const PEINTRES = {};
E.overlay('mairie_pinceau', (o, c) => {
  if (c.face !== o.face) { if (o.flancs) o.flancs(c); return; }
  let la, lt;
  if (o.face === LEFT) la = Math.floor(2 * (c.hx - o.s0)); else la = Math.floor(2 * (o.s0 + o.w - c.hy));
  lt = Math.floor(2 * (o.z0 + o.h - c.hz));
  const W2 = 2 * o.w, H2 = 2 * o.h;
  if (la < 0 || lt < 0 || la >= W2 || lt >= H2) return;
  PEINTRES[o.kind](o, c, la, lt, W2, H2);
});
// une image sur une face tournée vers +y (le long de x) ou vers +x (le long de y) ; `en` : la
// couche qui la porte (y, ou x) — -1, c'est le mur du fond lui-même ; `mat` : une matière pour
// poser la couche (sinon on peint ce qui est déjà là)
function peint(K, kind, face, s0, z0, w, h, o = {}) {
  const W = K.W, en = o.en != null ? o.en : -1;
  const id = W.obj(Object.assign({ type: 'mairie_pinceau', kind, face, s0, z0, w, h }, o));
  for (let z = z0; z < z0 + h; z++) for (let s = s0; s < s0 + w; s++) {
    const [x, y] = face === LEFT ? [s, en] : [en, s];
    if (o.mat) W.set(x, y, z, o.mat, id); else if (W.inb(x, y, z)) W.tag[W.idx(x, y, z)] = id;
  }
  return id;
}

// le portrait d'un ancien maire, cadre doré
PEINTRES.portrait = (o, c, la, lt, W2, H2) => {
  if (la === 0 || lt === 0 || la === W2 - 1 || lt === H2 - 1) { rgb(c, 0.62, 0.46, 0.16); if ((la + lt) % 3 === 0) rgb(c, 0.80, 0.64, 0.26); return; }
  if (la === 1 || lt === 1 || la === W2 - 2 || lt === H2 - 2) { rgb(c, 0.40, 0.28, 0.10); return; }
  const cx = (W2 - 1) / 2, f = (lt - 2) / (H2 - 4);
  rgb(c, 0.16 + 0.06 * f, 0.17 + 0.04 * f, 0.13);                             // le fond, un vert d'atelier
  const dx = la - cx, tete = (dx * dx) / 4.2 + ((lt - 5.5) * (lt - 5.5)) / 6.5;
  if (tete < 1) { rgb(c, 0.70, 0.52, 0.40); if (lt <= 3) rgb(c, 0.55, 0.53, 0.50); if (lt === 5 && Math.abs(dx) > 0.4 && Math.abs(dx) < 1.6) rgb(c, 0.25, 0.18, 0.14); return; }
  if (lt >= 9) {
    const ep = 2.2 + (lt - 9) * 1.3;                                           // les épaules qui s'ouvrent
    if (Math.abs(dx) < ep) {
      rgb(c, 0.10, 0.10, 0.12);                                                // le costume sombre
      if (Math.abs(dx) < 1.2 && lt < 13) rgb(c, 0.78, 0.76, 0.70);             // la chemise
      if (Math.abs(dx) < 0.6 && lt >= 10 && lt < 13) rgb(c, 0.40, 0.10, 0.14); // la cravate
      if (lt >= 12 && dx > -ep + 1 && dx < -ep + 3 && (lt - dx) % 4 < 2) rgb(c, 0.16, 0.24, 0.52); // l'écharpe, en travers
    }
  }
};
// le plan de la ville : la Rive, les rues, le stade entouré au crayon rouge
PEINTRES.plan = (o, c, la, lt, W2, H2) => {
  if (la === 0 || lt === 0 || la === W2 - 1 || lt === H2 - 1) { rgb(c, 0.26, 0.17, 0.10); return; }
  rgb(c, 0.80, 0.74, 0.58);
  if (hash(la, lt, 911, 0) < 0.08) rgb(c, 0.74, 0.68, 0.52);
  const riv = 5 + 2.2 * Math.sin(la / 4.2) + la * 0.12;                       // la rivière, en travers
  if (Math.abs(lt - riv) < 1.3) { rgb(c, 0.30, 0.46, 0.62); return; }
  if (la === 9 && Math.abs(lt - riv) < 2.5) { rgb(c, 0.40, 0.38, 0.34); return; }   // le pont
  if (la % 6 === 3 || lt % 5 === 2) { rgb(c, 0.92, 0.88, 0.76); return; }        // les rues
  if ((Math.floor(la / 6) + Math.floor(lt / 5)) % 3 === 0) rgb(c, 0.66, 0.52, 0.40); // les îlots bâtis
  const sx = W2 - 8, sy = H2 - 6, ex = la - sx, ey = lt - sy;                   // le stade de la Rive
  if (ex >= 0 && ex < 5 && ey >= 0 && ey < 3) { rgb(c, 0.30, 0.52, 0.26); if (ex === 2) rgb(c, 0.85, 0.85, 0.8); return; }
  const d = Math.hypot((la - (sx + 2)) / 4.2, (lt - (sy + 1)) / 2.8);
  if (Math.abs(d - 1) < 0.16) rgb(c, 0.75, 0.12, 0.10);
};
// le drapeau : un pays qui n'existe pas, cobalt et crème, frange dorée
const COBALT = [0.12, 0.22, 0.56], CREME = [0.84, 0.80, 0.66];
PEINTRES.drapeau = (o, c, la, lt, W2, H2) => {
  if (lt === H2 - 1) { rgb(c, 0.80, 0.62, 0.20); return; }
  const k = la === 1 || la === 2 ? CREME : COBALT, pli = la % 2 ? 0.86 : 1.0;
  rgb(c, k[0] * pli, k[1] * pli, k[2] * pli);
};
// les registres de l'état civil : de gros dos reliés, une étiquette, un filet d'or, des trous
PEINTRES.registres = (o, c, la, lt, W2, H2) => {
  const n = Math.floor(la / 3), r = lt % 4, h = hash(n, o.z0, 913, 0);
  if (h > 0.93) { rgb(c, 0.05, 0.04, 0.03); return; }                            // un registre sorti
  const P = [[0.16, 0.24, 0.16], [0.16, 0.24, 0.16], [0.30, 0.10, 0.10], [0.12, 0.11, 0.10], [0.28, 0.18, 0.10]];
  const k = P[Math.floor(hash(n, o.z0, 914, 1) * P.length)];
  rgb(c, k[0], k[1], k[2]);
  if (la % 3 === 2) { rgb(c, k[0] * 0.55, k[1] * 0.55, k[2] * 0.55); return; }
  if (r === 1) rgb(c, 0.78, 0.72, 0.56);                                        // l'étiquette
  if (r === 3) rgb(c, 0.62, 0.48, 0.18);                                        // le filet d'or
};
// le tableau d'affichage : liège, avis, arrêtés, une affiche de séance
PEINTRES.avis = (o, c, la, lt, W2, H2) => {
  if (la === 0 || lt === 0 || la === W2 - 1 || lt === H2 - 1) { rgb(c, 0.30, 0.20, 0.12); return; }
  rgb(c, 0.56, 0.42, 0.28);
  for (const [x0, y0, w, h, t] of [[2, 2, 4, 6, 0], [7, 1, 5, 4, 1], [13, 2, 4, 5, 0], [7, 6, 4, 4, 0], [18, 1, 3, 4, 2]]) {
    if (la >= x0 && la < x0 + w && lt >= y0 && lt < y0 + h) {
      rgb(c, 0.86, 0.84, 0.78);
      if (t === 1 && lt === y0) rgb(c, 0.62, 0.14, 0.12);                        // SÉANCE PUBLIQUE, en rouge
      else if (t === 2) rgb(c, 0.84, 0.78, 0.44);
      else if ((lt - y0) % 2 === 1 && la > x0 && la < x0 + w - 1) rgb(c, 0.42, 0.42, 0.40);
      if (la === x0 + 1 && lt === y0) rgb(c, 0.70, 0.12, 0.10);                    // la punaise
      return;
    }
  }
};
// une horloge ronde
PEINTRES.horloge = (o, c, la, lt, W2, H2) => {
  const cx = (W2 - 1) / 2, cy = (H2 - 1) / 2, d = Math.hypot(la - cx, lt - cy);
  if (d > W2 / 2) { rgb(c, 0.25, 0.17, 0.11); return; }
  if (d > W2 / 2 - 1.1) { rgb(c, 0.26, 0.20, 0.10); return; }
  rgb(c, 0.86, 0.84, 0.76);
  if ((la === Math.floor(cx) || la === Math.ceil(cx)) && lt <= cy && lt >= 1) rgb(c, 0.08, 0.08, 0.08);
  if (lt === Math.ceil(cy) && la >= cx && la <= cx + 2) rgb(c, 0.08, 0.08, 0.08);
};

// ─── quelques meubles
// un lustre bas au-dessus de la table : la tige jusqu'en haut, une couronne de laiton, des ampoules
function lustre(K, x, y, z, o = {}) {
  const { M } = K;
  K.boite(x, y, z + 1, x + 1, y + 1, K.H, M.METAL_DARK);
  K.boite(x - 1, y - 1, z, x + 2, y + 2, z + 1, M.GOLD); K.voxel(x, y, z, M.METAL_DARK);
  for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) K.voxel(x + dx, y + dy, z + 1, M.BULB);
  K.lampe(x + 0.5, y + 0.5, z, Object.assign({ cache: true, r: 60, c: [1.3, 0.98, 0.6] }, o));
}
// une plante verte : un pot, des feuilles en touffe
function plante(K, x, y, h = 7) {
  const { M } = K;
  K.boite(x, y, 0, x + 2, y + 2, 2, M.TERRACOTTA);
  for (let z = 2; z < h; z++) for (let j = -2; j < 4; j++) for (let i = -2; i < 4; i++) {
    const d = Math.hypot(i - 0.5, j - 0.5, (z - h + 2.5) * 0.9);
    if (x + i < 0 || y + j < 0 || x + i >= K.SX || y + j >= K.SY) continue;
    if (d < 2.6 && hash(x + i, y + j, z, 917) < 0.8 - d * 0.18) K.voxel(x + i, y + j, z, M.HEDGE);
  }
}
// une applique murale : un bras de laiton, une ampoule, une lumière douce
function applique(K, face, s, z, o = {}) {
  const { M } = K;
  if (face === LEFT) { K.voxel(s, 0, z, M.GOLD); K.voxel(s, 0, z + 1, M.BULB); K.lampe(s + 0.5, 1.5, z + 1, Object.assign({ cache: true, r: 30, c: [1.2, 0.9, 0.5] }, o)); }
  else { K.voxel(0, s, z, M.GOLD); K.voxel(0, s, z + 1, M.BULB); K.lampe(1.5, s + 0.5, z + 1, Object.assign({ cache: true, r: 30, c: [1.2, 0.9, 0.5] }, o)); }
}

module.exports = {
  cle: 'mairie', nom: 'La mairie', ambiance: 'bureau', personnel: 'commercant2',
  sx: 46, sy: 36, sol: 'I_PARQUET',
  murs: { bas: 'PANEL', haut: 'I_MUR_BLANC', coupe: 8, frise: 'WOOD_DARK' },
  porte: { cote: 'x', de: 24, a: 31 },
  build(K) {
    const { M } = K;
    // la corniche, en haut des deux murs
    K.boite(0, 0, 16, K.SX, 1, 17, M.PLASTER_CREAM); K.boite(0, 0, 16, 1, K.SY, 17, M.PLASTER_CREAM);

    // ── au fond, le bureau de la maire : le tapis, le bureau de chêne, le fauteuil de cuir
    K.tapis(4, 2, 19, 16);
    K.bureau(6, 6, 10, 4, { mat: M.WOOD_DARK, dessus: M.BLOTTER, papiers: false });
    K.boite(9, 7, 4, 12, 9, 5, M.PAPER); K.voxel(10, 7, 5, M.PAPER);               // le dossier du stade
    K.telephone(6, 6, 4); K.lampeBureau(14, 7);
    K.voxel(12, 9, 4, M.GOLD);                                                       // le tampon, l'encrier
    K.fauteuil(9, 2, { sens: 'y-', mat: M.LEATHER });
    K.chaise(7, 12, { dos: 'y+', mat: M.LEATHER }); K.chaise(12, 12, { dos: 'y+', mat: M.LEATHER });
    K.objet('bureau_maire', 'Le bureau de la maire', 11, 8, 4, { acces: [11, 16] });
    K.place('maire', 10, 4, { pose: 'assis', regarde: 'gauche', pour: 'aubert' });
    K.place('visiteur', 8, 13, { pose: 'assis', regarde: 'droite', pour: 'visiteur' });
    // le portrait au-dessus du fauteuil
    peint(K, 'portrait', LEFT, 9, 8, 5, 7, { en: 0, mat: M.WOOD_DARK });
    // le drapeau dans le coin, le buste sur sa colonne
    K.boite(1, 1, 0, 3, 3, 1, M.WOOD_DARK); K.boite(1, 1, 1, 2, 2, 16, M.METAL_DARK); K.voxel(1, 1, 16, M.GOLD);
    peint(K, 'drapeau', LEFT, 2, 9, 3, 7, { en: 1, mat: M.WHITE, flancs: c => rgb(c, COBALT[0], COBALT[1], COBALT[2]) });
    K.boite(1, 5, 0, 3, 7, 6, M.STONE); K.boite(1, 4, 6, 3, 8, 7, M.WHITE);
    K.boite(1, 5, 7, 3, 7, 8, M.WHITE); K.boite(1, 5, 8, 3, 7, 10, M.WHITE);
    K.objet('drapeau', 'Le buste et le drapeau', 2, 4, 9, { acces: [5, 9] });
    // la fenêtre de la maire, et ses rideaux
    K.fenetreX(9, 8, 6, 8, { rideau: [0.46, 0.12, 0.16] });

    // ── la table du conseil, son tapis vert, le plan de la ville au-dessus
    K.table(20, 14, 14, 6, { mat: M.I_DRAP, pied: M.WOOD_DARK });
    for (const x of [21, 26, 31]) { K.chaise(x, 11, { dos: 'y-' }); K.chaise(x, 21, { dos: 'y+' }); }
    K.voxel(27, 16, 4, M.GLASS); K.voxel(27, 16, 5, M.GLASS); K.voxel(25, 17, 4, M.GLASS); K.voxel(29, 16, 4, M.GLASS);
    K.boite(21, 15, 4, 23, 17, 5, M.PAPER); K.boite(31, 17, 4, 33, 19, 5, M.PAPER); K.voxel(26, 18, 4, M.PAPER);
    K.objet('conseil', 'La table du conseil', 27, 17, 4, { acces: [27, 25] });
    peint(K, 'plan', LEFT, 20, 8, 13, 7, { en: 0, mat: M.WOOD_DARK });
    lustre(K, 27, 17, 11);

    // ── l'accueil : le comptoir de l'huissier, la sonnette, le grand livre ; MAIRIE au mur
    K.comptoir(35, 6, 45, 9, { mat: M.WOOD_DARK, dessus: M.WOOD });
    K.voxel(38, 7, 5, M.GOLD); K.boite(40, 7, 5, 43, 9, 6, M.PAPER); K.lampeBureau(36, 7, 5);
    K.objet('accueil', 'L\'accueil', 40, 8, 5, { acces: [40, 12] });
    K.place('huissier', 40, 3, { regarde: 'gauche', pour: 'personnel' });
    K.enseigneY(33, 16, 'MAIRIE', { fg: [0.86, 0.68, 0.26], plate: [0.17, 0.11, 0.07], plateMat: M.WOOD_DARK, padX: 0, padY: 0 });
    peint(K, 'avis', LEFT, 35, 8, 11, 5, { en: 0, mat: M.WOOD_DARK });
    peint(K, 'horloge', LEFT, 16, 11, 3, 3, { en: 0, mat: M.WOOD_DARK });
    applique(K, LEFT, 34, 10);
    K.place('couloir', 38, 14, { regarde: 'droite' });

    // ── les registres de l'état civil, du sol au plafond
    for (let z = 0; z < 15; z += 3) K.boite(0, 17, z, 3, 33, z + 1, M.WOOD_DARK);
    K.boite(0, 17, 15, 3, 33, 16, M.WOOD_DARK);
    K.boite(0, 17, 0, 3, 18, 15, M.WOOD_DARK); K.boite(0, 32, 0, 3, 33, 15, M.WOOD_DARK);
    for (let z = 1; z < 15; z += 3) peint(K, 'registres', RIGHT, 18, z, 14, 2, { en: 1, mat: M.WOOD_DARK });
    for (let z = 1; z < 15; z += 3) K.boite(0, 18, z, 1, 32, z + 2, M.WOOD_DARK);
    K.objet('registres', 'Les registres', 2, 25, 6, { acces: [6, 25] });
    // l'échelle de bibliothèque
    K.boite(4, 23, 0, 5, 24, 13, M.WOOD); K.boite(4, 26, 0, 5, 27, 13, M.WOOD);
    for (let z = 2; z < 13; z += 3) K.boite(4, 24, z, 5, 26, z + 1, M.WOOD);
    K.lampe(2.5, 25.5, 16.5, { r: 30, c: [1.2, 0.9, 0.5] });                            // la lampe du rayonnage

    // ── les conseillers
    K.place('conseiller_1', 22, 12, { pose: 'assis', regarde: 'gauche' });
    K.place('conseiller_2', 32, 22, { pose: 'assis', regarde: 'droite' });

    // ── le long tapis de l'entrée, la plante verte, le radiateur sous la fenêtre ; le jour par la fenêtre
    K.tapis(19, 25, 46, 31);
    plante(K, 6, 32, 8);
    K.radiateur(0, 9, 1, 15);
    if (K.jour) K.lampe(4, 12, 12, { cache: true, toujours: true, r: 34, c: [0.45, 0.50, 0.60], ombre: false });
  },
};
