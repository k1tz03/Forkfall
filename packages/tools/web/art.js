/* FusibleArt — le moteur d'illustration de FUSIBLE.
 *
 * Vectoriel PLAT, géométrique, sans contour : des aplats pleins, une lumière
 * traitée comme une forme, des visages qui sont des assemblages de polygones
 * (yeux hexagonaux ou fentes), une composition centrée et frontale, un sujet
 * qui remplit le cadre. C'est la grammaire de *Reigns*, avec les matériaux du
 * football. Aucune dépendance, aucune ressource externe, aucun <image>.
 *
 * API (contrat stable, appelée par la coquille) :
 *   FusibleArt.init(content)       le bundle JSON (facultatif : enrichit les fiches)
 *   FusibleArt.scene(spec) → '<svg viewBox="0 0 400 400" …>…</svg>'
 *   FusibleArt.icon(name, opts) → '<svg viewBox="0 0 24 24" …>…</svg>'  (monochrome)
 *   FusibleArt.version
 * spec = { speaker, expression, camp, genre, lieu, kind, tone, saison, annee,
 *          club, seed }
 * Déterministe : même spec → même image (hachage de seed + identité).
 *
 * ─────────────────────────────────────────────────────────────────────────
 * LA PALETTE — sept familles nommées, et pas une de plus.
 *
 *  0. INTERFACE   le brun très sombre et chaud du fond (#1B1109), la crème du
 *                 texte (#F2E8CE), l'accent framboise (#E0164B). L'interface
 *                 n'est JAMAIS colorée autrement ; le vert de la pelouse existe
 *                 dans le monde du jeu, pas dans l'interface.
 *  1. PELOUSE     les verts du terrain et la craie des lignes blanches.
 *  2. PEAU        six teints, chacun avec son unique plan d'ombre.
 *  3. MAILLOT     les couleurs de tissu : maillots, costumes, doudounes.
 *  4. BOIS        bois, cuir, brique, terre — le vestiaire, le bureau, la buvette.
 *  5. METAL       alu, béton, grillage — le couloir, le virage, le car.
 *  6. LUMIERE     projecteur, ambre, jour, néon : la lumière est un aplat.
 *
 * LA DISCIPLINE DES COULEURS : une illustration n'utilise que SEPT aplats,
 * choisis dans un objet `pal` aux clés fixes —
 *   fond   le plan profond du décor
 *   plan   la masse moyenne du décor (l'arche derrière la tête)
 *   jour   le plan de lumière ; sert aussi de crème, de craie, de blanc de ligne
 *   peau   le teint
 *   ombre  L'UNIQUE ombre chaude de l'image (peau, et rien d'autre)
 *   poil   cheveux, yeux, sourcils, bouche, toutes les formes sombres
 *   tissu  la tenue
 * Une huitième clé, `tissu2`, n'apparaît que si la tenue a une seconde couleur
 * (rayures d'un maillot, cravate, pull sous la blouse). L'ombre d'un vêtement
 * n'est pas une couleur de plus : c'est `fond`, posé à plat.
 * ───────────────────────────────────────────────────────────────────────── */
(function (root) {
  "use strict";

  var VERSION = '1.0.0';

  /* ══ 1. LA PALETTE ══════════════════════════════════════════════════════ */

  var PALETTE = {
    interface: {
      fond: '#1B1109', fond2: '#241608', cadre: '#120B05',
      creme: '#F2E8CE', creme2: '#CBBB92', framboise: '#E0164B'
    },
    pelouse: {
      nuit: '#0F2A18', sombre: '#143A22', profond: '#1B4A29', vif: '#2F7038',
      clair: '#4E9448', sec: '#6E8A3C', craie: '#EDE7D3', craie2: '#B9B49C'
    },
    peau: {
      porcelaine: ['#F0D2B4', '#CDA484'], clair: ['#E4B48F', '#BE8A63'],
      dore: ['#D09A63', '#A97140'], olive: ['#B8814D', '#8F5C2C'],
      brun: ['#8E5A36', '#693C21'], ebene: ['#5E3A22', '#3F2313']
    },
    maillot: {
      bordeaux: '#93283A', marine: '#26386B', cobalt: '#2A5FB4', ciel: '#8FB9DE',
      vert: '#2F7A44', bouteille: '#265B3B', jaune: '#E3BE3E', or: '#C9A032',
      orange: '#DE7A21', rouge: '#C8302C', blanc: '#F0EADA', creme: '#E5D6B0',
      gris: '#8E8C86', anthracite: '#3A3B40', noir: '#22201E', violet: '#6E4A9E',
      prune: '#5B2A4A', camel: '#B98A4E', rose: '#DE85A8', turquoise: '#2AA192',
      magenta: '#C13B7E', beige: '#D6C29A'
    },
    bois: {
      clair: '#B98A4E', moyen: '#8A5C2E', sombre: '#57351A', tres: '#3A2411',
      cuir: '#7B3B26', brique: '#8C4130', carton: '#C6A472'
    },
    metal: {
      clair: '#C6C3B6', moyen: '#8E8C82', sombre: '#54534C', beton: '#6E6A5E',
      grillage: '#3C3A34', nuit: '#221A12', bleu: '#5A6A72'
    },
    lumiere: {
      projecteur: '#F6E08A', ambre: '#E8B54A', jour: '#EBD9A8',
      neon: '#CFE3D8', pale: '#D8CBA6', ombre: '#2A1B0F', nuit: '#140D07'
    }
  };

  var IF = PALETTE.interface;

  /* ══ 2. HACHAGE ET ALÉA DÉTERMINISTE ════════════════════════════════════ */

  function hash32(s) {
    s = String(s);
    var h = 2166136261 >>> 0;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function rngFrom(seed) {
    var a = (seed >>> 0) || 1;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pick(r, arr) { return arr[Math.floor(r() * arr.length) % arr.length]; }
  function between(r, a, b) { return a + r() * (b - a); }
  function chance(r, p) { return r() < p; }

  /* ══ 3. COULEUR ═════════════════════════════════════════════════════════ */

  function hex2rgb(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgb2hex(c) {
    var f = function (v) { v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? '0' : '') + v.toString(16); };
    return '#' + f(c[0]) + f(c[1]) + f(c[2]);
  }
  function mix(a, b, t) {
    var A = hex2rgb(a), B = hex2rgb(b);
    return rgb2hex([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]);
  }
  function rgb2hsl(c) {
    var r = c[0] / 255, g = c[1] / 255, b = c[2] / 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), h = 0, s = 0, l = (mx + mn) / 2, d = mx - mn;
    if (d) {
      s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0));
      else if (mx === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
    }
    return [h, s, l];
  }
  function hsl2rgb(h, s, l) {
    if (!s) { var v = l * 255; return [v, v, v]; }
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    var f = function (t) {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
  }
  /// Décale une couleur du monde vers l'époque : saturation, clarté, chaleur.
  function teinte(hex, sat, lum, chaud) {
    var c = rgb2hsl(hex2rgb(hex));
    var h = c[0], s = Math.max(0, Math.min(1, c[1] * (sat == null ? 1 : sat)));
    var l = Math.max(0.03, Math.min(0.97, c[2] + (lum || 0)));
    if (chaud) { var t = (0.09 - h + 1) % 1; if (t > 0.5) t -= 1; h = (h + t * chaud + 1) % 1; }
    return rgb2hex(hsl2rgb(h, s, l));
  }

  /* ══ 4. FABRIQUE SVG ════════════════════════════════════════════════════ */

  var UID = 0;

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function n(v) { return Math.round(v * 100) / 100; }
  function pts(list) {
    var out = [], i;
    for (i = 0; i < list.length; i++) out.push(n(list[i][0]) + ',' + n(list[i][1]));
    return out.join(' ');
  }
  function poly(list, fill) { return '<polygon points="' + pts(list) + '" fill="' + fill + '"/>'; }
  function rect(x, y, w, h, fill, rx) {
    return '<rect x="' + n(x) + '" y="' + n(y) + '" width="' + n(w) + '" height="' + n(h) + '"' +
      (rx ? ' rx="' + n(rx) + '"' : '') + ' fill="' + fill + '"/>';
  }
  function circ(cx, cy, r, fill) { return '<circle cx="' + n(cx) + '" cy="' + n(cy) + '" r="' + n(r) + '" fill="' + fill + '"/>'; }
  function ell(cx, cy, rx, ry, fill, rot) {
    return '<ellipse cx="' + n(cx) + '" cy="' + n(cy) + '" rx="' + n(rx) + '" ry="' + n(ry) + '" fill="' + fill + '"' +
      (rot ? ' transform="rotate(' + n(rot) + ' ' + n(cx) + ' ' + n(cy) + ')"' : '') + '/>';
  }
  function path(d, fill, rule) { return '<path d="' + d + '" fill="' + fill + '"' + (rule ? ' fill-rule="' + rule + '"' : '') + '/>'; }
  function grp(body, transform, extra) {
    return '<g' + (transform ? ' transform="' + transform + '"' : '') + (extra || '') + '>' + body + '</g>';
  }
  /// Un anneau plat (lunette, cadre, cerceau) : deux contours, pas de trait.
  function anneau(dOut, dIn, fill) { return path(dOut + ' ' + dIn, fill, 'evenodd'); }
  function rectPath(x, y, w, h, sens) {
    if (sens === -1) return 'M' + n(x) + ',' + n(y) + 'v' + n(h) + 'h' + n(w) + 'v' + n(-h) + 'Z';
    return 'M' + n(x) + ',' + n(y) + 'h' + n(w) + 'v' + n(h) + 'h' + n(-w) + 'Z';
  }
  function circPath(cx, cy, r, sens) {
    var s = sens === -1 ? 0 : 1;
    return 'M' + n(cx - r) + ',' + n(cy) + 'a' + n(r) + ',' + n(r) + ' 0 1,' + s + ' ' + n(2 * r) + ',0' +
      'a' + n(r) + ',' + n(r) + ' 0 1,' + s + ' ' + n(-2 * r) + ',0Z';
  }

  /* ══ 5. LES CHIFFRES ════════════════════════════════════════════════════
   * Sept segments chanfreinés : le tableau d'affichage. Le 4 est ouvert, le 7
   * a une barre, le 9 garde sa jambe — ils se remarquent, comme demandé. */

  var SEG = {
    '0': 'abcdef', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc',
    '5': 'afgcd', '6': 'afgedc', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg'
  };

  function segH(x, y, w, t) {
    return [[x + t * 0.5, y], [x + t, y - t * 0.5], [x + w - t, y - t * 0.5],
      [x + w - t * 0.5, y], [x + w - t, y + t * 0.5], [x + t, y + t * 0.5]];
  }
  function segV(x, y, h, t) {
    return [[x, y + t * 0.5], [x + t * 0.5, y], [x + t, y + t * 0.5],
      [x + t, y + h - t * 0.5], [x + t * 0.5, y + h], [x, y + h - t * 0.5]];
  }
  /// Un chiffre dans une boîte (x, y, w, h). Sept segments, aplats pleins.
  function chiffre(d, x, y, w, h, fill) {
    var s = SEG[d]; if (!s) return '';
    var t = Math.max(2, h * 0.17), out = '', half = h / 2;
    if (s.indexOf('a') >= 0) out += poly(segH(x, y + t * 0.5, w, t), fill);
    if (s.indexOf('g') >= 0) out += poly(segH(x, y + half, w, t), fill);
    if (s.indexOf('d') >= 0) out += poly(segH(x, y + h - t * 0.5, w, t), fill);
    if (s.indexOf('f') >= 0) out += poly(segV(x, y + t * 0.5, half - t * 0.5, t), fill);
    if (s.indexOf('b') >= 0) out += poly(segV(x + w - t, y + t * 0.5, half - t * 0.5, t), fill);
    if (s.indexOf('e') >= 0) out += poly(segV(x, y + half, half - t * 0.5, t), fill);
    if (s.indexOf('c') >= 0) out += poly(segV(x + w - t, y + half, half - t * 0.5, t), fill);
    return out;
  }
  /// Une suite de chiffres centrée sur cx.
  function chiffres(txt, cx, y, h, fill) {
    txt = String(txt);
    var w = h * 0.58, gap = h * 0.18, total = txt.length * w + (txt.length - 1) * gap;
    var x = cx - total / 2, out = '';
    for (var i = 0; i < txt.length; i++) {
      out += chiffre(txt[i], x, y, w, h, fill);
      x += w + gap;
    }
    return out;
  }

  /* ══ 6. LE TEMPS QUI PASSE ══════════════════════════════════════════════
   * La décennie module les couleurs du monde et les accessoires. Elle ne
   * touche jamais l'interface : le brun et la crème ne bougent pas. */

  var DECENNIES = [
    { cle: '1990', de: 1990, sat: 1.20, lum: 0.020, chaud: 0.10,
      ballon: 'panneaux', cheveux: 'longs', coupe: 'ample', matiere: 'coton',
      vifs: ['turquoise', 'magenta', 'orange', 'jaune', 'violet'],
      objets: ['fax', 'cassette', 'antenne'] },
    { cle: '2000', de: 2000, sat: 1.06, lum: 0.005, chaud: 0.04,
      ballon: 'lisse', cheveux: 'court', coupe: 'moulante', matiere: 'synthetique',
      vifs: ['cobalt', 'rouge', 'argent', 'blanc'], objets: ['portable', 'cd'] },
    { cle: '2010', de: 2010, sat: 0.94, lum: -0.010, chaud: 0.00,
      ballon: 'thermo', cheveux: 'degrade', coupe: 'ajustee', matiere: 'maille',
      vifs: ['fluo', 'cobalt', 'noir'], objets: ['ecran', 'tablette'] },
    { cle: '2020', de: 2020, sat: 0.84, lum: -0.028, chaud: -0.04,
      ballon: 'thermo', cheveux: 'net', coupe: 'ajustee', matiere: 'recycle',
      vifs: ['turquoise', 'anthracite'], objets: ['casque', 'ecran', 'capteur'] },
    { cle: '2030', de: 2030, sat: 0.74, lum: -0.045, chaud: -0.06,
      ballon: 'mat', cheveux: 'net', coupe: 'sobre', matiere: 'technique',
      vifs: ['anthracite', 'prune'], objets: ['visiere', 'capteur'] },
    { cle: '2040', de: 2040, sat: 0.62, lum: -0.060, chaud: -0.08,
      ballon: 'mat', cheveux: 'net', coupe: 'sobre', matiere: 'sombre',
      vifs: ['noir', 'anthracite'], objets: ['visiere', 'drone'] }
  ];

  function decade(annee) {
    var a = parseInt(annee, 10);
    if (!a || a < 1990) a = 1990;
    if (a > 2050) a = 2050;
    var i = Math.min(DECENNIES.length - 1, Math.floor((a - 1990) / 10));
    var d = DECENNIES[i];
    return {
      cle: d.cle, annee: a, index: i, sat: d.sat, lum: d.lum, chaud: d.chaud,
      ballon: d.ballon, cheveux: d.cheveux, coupe: d.coupe, matiere: d.matiere,
      vifs: d.vifs.slice(), objets: d.objets.slice(),
      /// Vieillit une couleur du monde. L'interface n'y passe jamais.
      c: function (hex) { return teinte(hex, d.sat, d.lum, d.chaud); }
    };
  }

  root.__FA_BASE__ = {
    VERSION: VERSION, PALETTE: PALETTE, IF: IF, hash32: hash32, rngFrom: rngFrom,
    pick: pick, between: between, chance: chance, mix: mix, teinte: teinte,
    esc: esc, n: n, pts: pts, poly: poly, rect: rect, circ: circ, ell: ell,
    path: path, grp: grp, anneau: anneau, rectPath: rectPath, circPath: circPath,
    chiffre: chiffre, chiffres: chiffres, decade: decade,
    uid: function () { return 'fa' + (++UID); }
  };
})(typeof window !== 'undefined' ? window : this);

/* ══ 7. LES FICHES — 42 personnages ═══════════════════════════════════════
 * Chaque fiche tient en une ligne : c'est une SILHOUETTE plus UN attribut.
 * Sources : content/characters.yaml (17), docs/bible/01 (19 fiches terrain et
 * famille), docs/bible/02 (23 fiches direction et instances) — 42 en tout.
 * Champs : g genre · camp · lieu d'élection · an âge en 1990 · te teint ·
 * co corpulence · ch coiffure · cv couleur de cheveux · po pilosité ·
 * lu lunettes · tn tenue · c1 couleur principale · c2 couleur seconde ·
 * ac accessoire · cc couleur de l'accessoire · yx forme des yeux.        */
(function (root) {
  "use strict";
  var B = root.__FA_BASE__;

  var FICHES = {
    /* ── Terrain et famille (bible 01) ─────────────────────────────────── */
    vukic:      { nom: 'Zoran Vukić', g: 'm', camp: 'terrain', lieu: 'terrain', an: 37, te: 'clair', co: 'moyen', ch: 'court', cv: 'brun', po: 'moustache', lu: 'aucune', tn: 'survetement', c1: 'marine', c2: 'creme', ac: 'sifflet', yx: 'fente' },
    brehaut:    { nom: 'Titi Bréhaut', g: 'm', camp: 'terrain', lieu: 'vestiaire', an: 33, te: 'clair', co: 'large', ch: 'mulet', cv: 'blond', po: 'rase', lu: 'aucune', tn: 'maillot', c1: 'vert', c2: 'blanc', ac: 'brassard', cc: 'jaune', yx: 'hex' },
    sabatier:   { nom: 'Doc Sabatier', g: 'm', camp: 'terrain', lieu: 'vestiaire', an: 51, te: 'porcelaine', co: 'moyen', ch: 'degarni', cv: 'gris', po: 'barbe', lu: 'front', tn: 'blouse', c1: 'blanc', c2: 'cobalt', ac: 'stethoscope', yx: 'hex' },
    camille:    { nom: 'Camille', g: 'f', camp: 'terrain', lieu: 'maison', an: 32, te: 'clair', co: 'fin', ch: 'queue', cv: 'chatain', po: 'rase', lu: 'aucune', tn: 'pull', c1: 'orange', ac: 'journal', yx: 'hex' },
    clow:       { nom: 'Dan Corven', g: 'm', camp: 'terrain', lieu: 'buvette', an: 61, te: 'porcelaine', co: 'large', ch: 'plaque', cv: 'blanc', po: 'rase', lu: 'aucune', tn: 'doudoune', c1: 'bouteille', c2: 'creme', ac: 'verre', yx: 'fente' },
    mbako:      { nom: 'Lian Mbako', g: 'm', camp: 'terrain', lieu: 'terrain', an: 16, te: 'ebene', co: 'fin', ch: 'brosse', cv: 'noir', po: 'rase', lu: 'aucune', tn: 'maillot', c1: 'blanc', c2: 'vert', ac: 'manches', yx: 'hex' },
    vecchio:    { nom: 'Gigi Vecchio', g: 'm', camp: 'terrain', lieu: 'terrain', an: 41, te: 'dore', co: 'large', ch: 'court', cv: 'gris', po: 'moustache', lu: 'aucune', tn: 'gardien', c1: 'gris', c2: 'jaune', ac: 'gants', cc: 'jaune', yx: 'fente', ep: -6 },
    mere_mbako: { nom: 'La mère de Mbako', g: 'f', camp: 'terrain', lieu: 'bureau', an: 39, te: 'ebene', co: 'moyen', ch: 'chignon', cv: 'noir', po: 'rase', lu: 'aucune', tn: 'tailleur', c1: 'prune', c2: 'creme', ac: 'carnet', yx: 'fente' },
    gege:       { nom: 'Gégé', g: 'm', camp: 'terrain', lieu: 'virage', an: 47, te: 'clair', co: 'large', ch: 'casquette', cv: 'brun', po: 'barbe3j', lu: 'aucune', tn: 'doudoune', c1: 'noir', c2: 'bordeaux', ac: 'echarpe', cc: 'bordeaux', ck: 'vert', yx: 'fente' },
    loco:       { nom: 'Anselmo Vaz', g: 'm', camp: 'terrain', lieu: 'terrain', an: 45, te: 'olive', co: 'fin', ch: 'catogan', cv: 'gris', po: 'rase', lu: 'rondes', tn: 'survetement', c1: 'ciel', c2: 'blanc', ac: 'seau', yx: 'fente' },
    klopf:      { nom: 'Vogler', g: 'm', camp: 'terrain', lieu: 'terrain', an: 38, te: 'clair', co: 'moyen', ch: 'casquette', cv: 'blond', po: 'barbe', lu: 'aucune', tn: 'coupevent', c1: 'rouge', c2: 'blanc', ac: 'aucun', ck: 'rouge', yx: 'hex' },
    rouvier:    { nom: 'Nadia Rouvier', g: 'f', camp: 'terrain', lieu: 'vestiaire', an: 30, te: 'brun', co: 'moyen', ch: 'court', cv: 'noir', po: 'rase', lu: 'aucune', tn: 'blouse', c1: 'blanc', c2: 'marine', ac: 'sifflet', yx: 'hex' },
    dembo:      { nom: 'Dembo', g: 'm', camp: 'terrain', lieu: 'vestiaire', an: 24, te: 'ebene', co: 'moyen', ch: 'dread', cv: 'noir', po: 'rase', lu: 'aucune', tn: 'maillot', c1: 'cobalt', c2: 'jaune', ac: 'montre', yx: 'hex' },
    fauvel:     { nom: 'Karim Fauvel', g: 'm', camp: 'selection', lieu: 'car', an: 27, te: 'dore', co: 'large', ch: 'rase', cv: 'noir', po: 'rase', lu: 'aucune', tn: 'maillot', c1: 'cobalt', c2: 'blanc', ac: 'brassard', cc: 'blanc', cic: true, yx: 'fente' },
    brissac:    { nom: 'Solange Brissac', g: 'f', camp: 'selection', lieu: 'bureau', an: 49, te: 'porcelaine', co: 'moyen', ch: 'chignon', cv: 'gris', po: 'rase', lu: 'chainette', tn: 'tailleur', c1: 'gris', c2: 'blanc', ac: 'carnet', yx: 'fente' },
    gerard:     { nom: 'Gérard', g: 'm', camp: 'terrain', lieu: 'buvette', an: 61, te: 'clair', co: 'large', ch: 'casquette', cv: 'gris', po: 'moustache', lu: 'aucune', tn: 'tablier', c1: 'marine', c2: 'creme', ac: 'boite', ck: 'beige', yx: 'fente' },
    dede:       { nom: 'Dédé', g: 'm', camp: 'terrain', lieu: 'terrain', an: 52, te: 'clair', co: 'moyen', ch: 'beret', cv: 'gris', po: 'moustache', lu: 'aucune', tn: 'coupevent', c1: 'cobalt', c2: 'creme', ac: 'sifflet', cc: 'orange', ck: 'anthracite', yx: 'hex' },
    paulette:   { nom: 'Mamie Paulette', g: 'f', camp: 'terrain', lieu: 'virage', an: 71, te: 'porcelaine', co: 'moyen', ch: 'permanente', cv: 'blanc', po: 'rase', lu: 'aucune', tn: 'manteau', c1: 'marine', c2: 'or', ac: 'canne', yx: 'hex' },
    sacha:      { nom: 'Sacha', g: 'f', camp: 'famille', lieu: 'maison', an: -6, te: 'clair', co: 'fin', ch: 'queue', cv: 'chatain', po: 'rase', lu: 'aucune', tn: 'pull', c1: 'rouge', c2: 'creme', ac: 'echarpe', cc: 'vert', enf: true, yx: 'hex' },

    /* ── Direction (bible 02) ──────────────────────────────────────────── */
    fardelli:   { nom: 'Rocco Fardelli', g: 'm', camp: 'direction', lieu: 'couloir', an: 44, te: 'dore', co: 'moyen', ch: 'meche', cv: 'noir', po: 'rase', lu: 'aucune', tn: 'costume', c1: 'anthracite', c2: 'rose', ac: 'telephone', yx: 'fente' },
    meneche:    { nom: 'Pierre Massenet', g: 'm', camp: 'direction', lieu: 'presse', an: 42, te: 'clair', co: 'fin', ch: 'court', cv: 'chatain', po: 'moustache', lu: 'aviateur', tn: 'veste', c1: 'camel', c2: 'creme', ac: 'micro', yx: 'fente' },
    aulard:     { nom: 'Jean-Marie Vaubourg', g: 'm', camp: 'direction', lieu: 'bureau', an: 58, te: 'clair', co: 'large', ch: 'degarni', cv: 'gris', po: 'rase', lu: 'carrees', tn: 'costume', c1: 'bordeaux', c2: 'jaune', ac: 'telephone', yx: 'fente' },
    josiane:    { nom: 'Madame Josiane', g: 'f', camp: 'direction', lieu: 'bureau', an: 52, te: 'porcelaine', co: 'moyen', ch: 'chignon', cv: 'gris', po: 'rase', lu: 'rondes', tn: 'pull', c1: 'violet', c2: 'creme', ac: 'stylo', yx: 'hex' },
    lea:        { nom: 'Léa', g: 'f', camp: 'direction', lieu: 'presse', an: 25, te: 'clair', co: 'fin', ch: 'carre', cv: 'chatain', po: 'rase', lu: 'aucune', tn: 'chemise', c1: 'blanc', c2: 'cobalt', ac: 'micro', yx: 'hex' },
    nassir:     { nom: 'Cheikh Ilyas', g: 'm', camp: 'direction', lieu: 'bureau', an: 34, te: 'olive', co: 'moyen', ch: 'court', cv: 'noir', po: 'bouc', lu: 'aucune', tn: 'costume', c1: 'creme', c2: 'marine', ac: 'montre', yx: 'fente' },
    solvang:    { nom: 'Ingrid Solvang', g: 'f', camp: 'direction', lieu: 'couloir', an: 33, te: 'porcelaine', co: 'fin', ch: 'carre', cv: 'blond', po: 'rase', lu: 'carrees', tn: 'tailleur', c1: 'anthracite', c2: 'blanc', ac: 'carnet', yx: 'fente' },
    vence:      { nom: 'Nathalie Vence', g: 'f', camp: 'direction', lieu: 'presse', an: 32, te: 'clair', co: 'moyen', ch: 'boucle', cv: 'brun', po: 'rase', lu: 'aucune', tn: 'veste', c1: 'rouge', c2: 'blanc', ac: 'micro', yx: 'hex' },
    la_plume:   { nom: 'La Plume', g: 'f', camp: 'direction', lieu: 'presse', an: 36, te: 'clair', co: 'fin', ch: 'carre', cv: 'noir', po: 'rase', lu: 'aucune', tn: 'manteau', c1: 'noir', c2: 'rose', ac: 'journal', masque: true, yx: 'fente' },
    barbier:    { nom: 'Lucien Barbier', g: 'm', camp: 'direction', lieu: 'terrain', an: 58, te: 'clair', co: 'large', ch: 'bonnet', cv: 'gris', po: 'barbe', lu: 'aucune', tn: 'doudoune', c1: 'anthracite', c2: 'orange', ac: 'carnet', ck: 'orange', yx: 'fente' },
    malbec:     { nom: 'Hubert Malbec', g: 'm', camp: 'direction', lieu: 'bureau', an: 54, te: 'clair', co: 'large', ch: 'court', cv: 'chatain', po: 'rase', lu: 'aucune', tn: 'costume', c1: 'marine', c2: 'rouge', ac: 'verre', yx: 'fente' },
    montoya:    { nom: 'Don Alvaro Montoya', g: 'm', camp: 'direction', lieu: 'bureau', an: 60, te: 'olive', co: 'moyen', ch: 'plaque', cv: 'blanc', po: 'moustache', lu: 'aviateur', tn: 'costume', c1: 'noir', c2: 'or', ac: 'montre', yx: 'fente' },
    dupuis:     { nom: 'Dupuis', g: 'm', camp: 'direction', lieu: 'buvette', an: 50, te: 'clair', co: 'large', ch: 'court', cv: 'roux', po: 'moustache', lu: 'aucune', tn: 'tablier', c1: 'blanc', c2: 'rouge', ac: 'sac', yx: 'hex' },
    pichon:     { nom: 'Roger Pichon', g: 'm', camp: 'direction', lieu: 'buvette', an: 56, te: 'clair', co: 'large', ch: 'court', cv: 'blanc', po: 'moustache', lu: 'aucune', tn: 'pull', c1: 'camel', c2: 'creme', ac: 'fanion', cc: 'bordeaux', yx: 'hex' },

    /* ── Instances et sélection (bible 02) ─────────────────────────────── */
    aubert:     { nom: 'Madame Aubert', g: 'f', camp: 'instances', lieu: 'bureau', an: 46, te: 'clair', co: 'moyen', ch: 'carre', cv: 'chatain', po: 'rase', lu: 'aucune', tn: 'tailleur', c1: 'bordeaux', c2: 'creme', ac: 'sautoir', cc: 'cobalt', yx: 'hex' },
    legruet:    { nom: 'Noé Berthomier', g: 'm', camp: 'instances', lieu: 'bureau', an: 63, te: 'porcelaine', co: 'large', ch: 'degarni', cv: 'blanc', po: 'rase', lu: 'carrees', tn: 'costume', c1: 'marine', c2: 'jaune', ac: 'badge', yx: 'fente' },
    bambini:    { nom: 'Giancarlo Bambini', g: 'm', camp: 'instances', lieu: 'bureau', an: 58, te: 'olive', co: 'large', ch: 'chauve', cv: 'gris', po: 'rase', lu: 'aucune', tn: 'costume', c1: 'anthracite', c2: 'or', ac: 'medaille', cc: 'or', yx: 'fente' },
    dauzat:     { nom: 'Aurélien Dauzat', g: 'm', camp: 'instances', lieu: 'couloir', an: 44, te: 'clair', co: 'fin', ch: 'court', cv: 'chatain', po: 'rase', lu: 'rondes', tn: 'costume', c1: 'gris', c2: 'ciel', ac: 'dossier', yx: 'fente' },
    vialat:     { nom: 'Madame Vialat', g: 'f', camp: 'instances', lieu: 'bureau', an: 45, te: 'clair', co: 'fin', ch: 'chignon', cv: 'brun', po: 'rase', lu: 'carrees', tn: 'tailleur', c1: 'anthracite', c2: 'blanc', ac: 'tampon', yx: 'fente' },
    amsel:      { nom: 'Judith Amsel', g: 'f', camp: 'instances', lieu: 'couloir', an: 47, te: 'porcelaine', co: 'moyen', ch: 'carre', cv: 'noir', po: 'rase', lu: 'aucune', tn: 'robe', c1: 'noir', c2: 'blanc', ac: 'dossier', yx: 'fente' },
    colline:    { nom: 'Colline', g: 'm', camp: 'instances', lieu: 'terrain', an: 34, te: 'dore', co: 'moyen', ch: 'brosse', cv: 'noir', po: 'rase', lu: 'aucune', tn: 'maillot', c1: 'noir', c2: 'jaune', ac: 'sifflet', cc: 'jaune', yx: 'hex' },
    roux:       { nom: 'Firmin Roux', g: 'm', camp: 'instances', lieu: 'buvette', an: 66, te: 'clair', co: 'moyen', ch: 'degarni', cv: 'blanc', po: 'moustache', lu: 'rondes', tn: 'veste', c1: 'camel', c2: 'creme', ac: 'cle', yx: 'fente' },
    rossard:    { nom: 'Aimé Rossard', g: 'm', camp: 'selection', lieu: 'presse', an: 52, te: 'clair', co: 'moyen', ch: 'court', cv: 'gris', po: 'rase', lu: 'carrees', tn: 'veste', c1: 'bordeaux', c2: 'creme', ac: 'casque', yx: 'hex' }
  };

  /* Le personnage incarné : toi. Jamais de face. Deux rôles, deux genres,
   * quatre tranches d'âge, quatre cadrages (dos, trois-quarts perdu, main,
   * ombre) tirés au sort de façon déterministe. */
  var INCARNE = {
    coach:  { nom: 'Toi, l\'entraîneur', role: 'coach', tn: 'survetement', c1: 'pelouse', c2: 'creme', ac: 'sifflet', lieu: 'terrain', camp: 'terrain' },
    joueur: { nom: 'Toi, le joueur', role: 'joueur', tn: 'maillot', c1: 'cobalt', c2: 'blanc', ac: 'numero', lieu: 'vestiaire', camp: 'terrain' }
  };
  var AGES = ['jeune', 'adulte', 'mur', 'age'];

  /// L'âge à l'écran : la fiche donne l'âge en 1990, l'année fait le reste.
  function trancheAge(fiche, annee) {
    var a = (fiche.an == null ? 35 : fiche.an) + ((annee || 1990) - 1990);
    if (a < 22) return 'jeune';
    if (a < 45) return 'adulte';
    if (a < 62) return 'mur';
    return 'age';
  }

  /// Les cheveux blanchissent : gris à 45, blanc à 62. Le poil suit.
  function cheveuxDatee(fiche, tranche) {
    var cv = fiche.cv || 'brun';
    if (cv === 'blanc' || cv === 'gris' || cv === 'chauve') return cv;
    if (tranche === 'age') return 'blanc';
    if (tranche === 'mur') return 'gris';
    return cv;
  }

  /// Fiche déduite d'un id inconnu : le moteur ne doit jamais rendre du vide.
  function ficheDeduite(id, spec) {
    var r = B.rngFrom(B.hash32('fiche|' + id));
    var g = (spec && spec.genre) || (B.chance(r, 0.35) ? 'f' : 'm');
    var femme = g === 'f';
    return {
      nom: String(id), g: g,
      camp: (spec && spec.camp) || B.pick(r, ['terrain', 'direction', 'instances']),
      lieu: (spec && spec.lieu) || B.pick(r, ['vestiaire', 'couloir', 'bureau', 'terrain']),
      an: Math.round(B.between(r, 22, 62)),
      te: B.pick(r, ['porcelaine', 'clair', 'dore', 'olive', 'brun', 'ebene']),
      co: B.pick(r, ['fin', 'moyen', 'large']),
      ch: femme ? B.pick(r, ['carre', 'chignon', 'queue', 'boucle', 'court'])
        : B.pick(r, ['court', 'brosse', 'degarni', 'chauve', 'meche', 'casquette']),
      cv: B.pick(r, ['noir', 'brun', 'chatain', 'roux', 'blond', 'gris']),
      po: femme ? 'rase' : B.pick(r, ['rase', 'rase', 'moustache', 'barbe', 'barbe3j', 'bouc']),
      lu: B.pick(r, ['aucune', 'aucune', 'rondes', 'carrees']),
      tn: B.pick(r, ['survetement', 'maillot', 'costume', 'pull', 'chemise', 'veste']),
      c1: B.pick(r, ['marine', 'bordeaux', 'vert', 'anthracite', 'camel', 'gris', 'cobalt']),
      c2: 'creme', ac: 'aucun', ck: 'anthracite',
      yx: B.chance(r, 0.5) ? 'hex' : 'fente', deduite: true
    };
  }

  root.__FA_FICHES__ = {
    FICHES: FICHES, INCARNE: INCARNE, AGES: AGES,
    trancheAge: trancheAge, cheveuxDatee: cheveuxDatee, ficheDeduite: ficheDeduite
  };
})(typeof window !== 'undefined' ? window : this);

/* ══ 8. LE PORTRAIT — sept aplats, une lumière qui est une forme ═════════ */
(function (root) {
  "use strict";
  var B = root.__FA_BASE__, F = root.__FA_FICHES__;
  var P = B.PALETTE, poly = B.poly, rect = B.rect, circ = B.circ, ell = B.ell;
  var path = B.path, grp = B.grp, anneau = B.anneau, mix = B.mix;

  /* ── 8.1 La palette de l'image ─────────────────────────────────────────
   * Sept clés, jamais huit (tissu2 en fait une huitième, et seulement quand
   * la tenue l'exige). Le décor vient du camp et du lieu ; l'ombre est
   * unique et chaude ; le sombre est unique et brun, jamais noir pur. */

  var DECOR = {
    terrain:   { fond: P.pelouse.nuit,   plan: P.pelouse.profond, jour: P.pelouse.craie },
    vestiaire: { fond: '#241608',        plan: P.bois.sombre,     jour: P.lumiere.jour },
    couloir:   { fond: '#1A130C',        plan: P.metal.sombre,    jour: P.lumiere.pale },
    virage:    { fond: '#150E08',        plan: P.metal.grillage,  jour: P.lumiere.ambre },
    bureau:    { fond: '#22160B',        plan: P.bois.moyen,      jour: P.lumiere.jour },
    car:       { fond: '#101018',        plan: P.metal.bleu,      jour: P.lumiere.projecteur },
    buvette:   { fond: '#1E1409',        plan: P.bois.cuir,       jour: P.lumiere.ambre },
    presse:    { fond: '#171009',        plan: P.maillot.bordeaux, jour: P.lumiere.projecteur },
    maison:    { fond: '#20150C',        plan: P.bois.clair,      jour: P.lumiere.ambre }
  };
  var LIEU_DE_CAMP = {
    terrain: 'vestiaire', direction: 'bureau', instances: 'couloir',
    selection: 'car', famille: 'maison'
  };
  var LIEUX = ['vestiaire', 'couloir', 'virage', 'bureau', 'terrain', 'car', 'buvette', 'presse', 'maison'];

  function lieuValide(l) { return LIEUX.indexOf(l) >= 0 ? l : null; }

  /// Le temps blanchit les cheveux sans les effacer : on mélange, on ne remplace pas.
  function grisonne(hex, t) { return t <= 0 ? hex : mix(hex, t > 0.6 ? '#E6DFCE' : '#A9A399', t); }

  function paletteDe(fiche, lieu, d) {
    var dec = DECOR[lieu] || DECOR.vestiaire;
    var te = P.peau[fiche.te] || P.peau.clair;
    var cvKey = fiche.cv || 'brun';
    var POIL = {
      noir: '#241C18', brun: '#3A2A1E', chatain: '#6B4A2E', roux: '#A8502A',
      blond: '#D8B36A', gris: '#A9A399', blanc: '#E6DFCE', chauve: '#3A2A1E'
    };
    var t1 = P.maillot[fiche.c1] || (fiche.c1 === 'pelouse' ? P.pelouse.vif : P.maillot.marine);
    var t2 = fiche.c2 ? (P.maillot[fiche.c2] || P.pelouse.craie) : null;
    var pal = {
      fond: dec.fond,
      plan: mix(dec.fond, d.c(dec.plan), 0.80),
      demi: mix(dec.fond, d.c(dec.plan), 0.62),
      jour: d.c(dec.jour),
      peau: d.c(te[0]),
      ombre: d.c(te[1]),
      poil: d.c(grisonne(POIL[cvKey] || POIL.brun, fiche.__gris || 0)),
      tissu: d.c(t1)
    };
    // Les yeux, les sourcils et la bouche ne prennent jamais la couleur des
    // cheveux : ils prennent le sombre du fond. Un blond garde un regard.
    pal.trait = dec.fond;
    if (t2) pal.tissu2 = d.c(t2);
    pal.accent = fiche.cc ? d.c(P.maillot[fiche.cc] || P.maillot.rouge) : pal.tissu2 || pal.jour;
    return pal;
  }

  /* ── 8.2 Le décor : trois plans, et la lumière posée comme un plan ───── */

  function decorPortrait(pal, lieu, r) {
    var s = rect(0, 0, 400, 400, pal.fond);
    // Trois plans, et rien de plus. Mais la COMPOSITION change d'une carte à
    // l'autre — arche, bande, disque, diagonale — sans quoi deux voisines se
    // ressemblent. Le faisceau et l'objet de lieu ne sont jamais du même côté,
    // et jamais dans la zone du visage (x 140-260).
    var gauche = r() < 0.5;
    var forme = Math.floor(r() * 4);
    var v = r();
    var faisceau = r();
    var bx = gauche ? 328 : 4, bw = 68;

    // 1. L'objet de lieu, dans la bande libre.
    if (lieu === 'vestiaire') {
      s += rect(bx, 62, bw, 300, pal.plan);
      if (v < 0.5) { s += rect(bx + 12, 100, bw - 24, 10, pal.jour); s += rect(bx + 8, 84, bw - 16, 44, pal.fond); }
      else { s += poly([[bx + 10, 132], [bx + 58, 132], [bx + 50, 320], [bx + 18, 320]], pal.jour); }
    } else if (lieu === 'bureau') {
      if (v < 0.34) { s += rect(bx, 48, bw, 150, pal.jour); s += rect(bx, 96, bw, 9, pal.fond); s += rect(bx, 140, bw, 9, pal.fond); }
      else if (v < 0.67) { s += rect(bx + 4, 92, bw - 8, 26, pal.jour); s += rect(bx + 4, 138, bw - 8, 26, pal.jour); s += rect(bx + 4, 184, bw - 8, 26, pal.jour); }
      else { s += rect(bx, 60, bw, 140, pal.plan); s += poly([[bx + 12, 96], [bx + 56, 96], [bx + 34, 130]], pal.jour); s += rect(bx + 28, 130, 12, 52, pal.jour); }
    } else if (lieu === 'terrain') {
      if (v < 0.5) { s += rect(bx + 26, 30, 14, 150, pal.plan); s += rect(bx + 8, 8, 50, 26, pal.jour); }
      else { s += rect(bx, 96, bw, 9, pal.jour); s += rect(bx + (gauche ? 0 : bw - 9), 96, 9, 90, pal.jour); }
    } else if (lieu === 'virage') {
      s += rect(bx, 0, bw, 400, pal.plan);
      for (var i = 0; i < 5; i++) s += rect(bx + 2, i * 84 + 10 + Math.round(v * 20), bw - 4, 8, pal.fond);
    } else if (lieu === 'couloir') {
      if (v < 0.5) { s += rect(bx, 84, bw, 250, pal.plan); s += rect(bx + 10, 110, bw - 20, 190, pal.jour); }
      else { s += rect(bx, 40, bw, 320, pal.plan); s += rect(bx + 6, 150, bw - 12, 60, pal.jour); }
    } else if (lieu === 'presse') {
      var nb = v < 0.5 ? 3 : 2, dy = v < 0.5 ? 0 : 52;
      for (var j = 0; j < nb; j++) {
        s += poly([[bx + 34, 40 + dy + j * 106], [bx + 62, 56 + dy + j * 106], [bx + 62, 88 + dy + j * 106],
          [bx + 34, 104 + dy + j * 106], [bx + 6, 88 + dy + j * 106], [bx + 6, 56 + dy + j * 106]], pal.jour);
      }
    } else if (lieu === 'buvette') {
      s += rect(bx, 176, bw, 96, pal.plan);
      s += rect(bx + 10, 196, bw - 20, 12, pal.jour);
      s += rect(bx + 10, 222, bw - 34, 12, pal.jour);
    } else if (lieu === 'car') {
      s += rect(bx, 56, bw, 150, pal.plan);
      s += poly([[bx + 6, 196], [bx + 62, 130], [bx + 62, 198]], pal.jour);
    } else if (lieu === 'maison') {
      s += rect(bx, 44, bw, 132, pal.jour);
      s += rect(bx + 30, 44, 9, 132, pal.fond);
      s += rect(bx, 102, bw, 9, pal.fond);
    }

    // 2. La masse qui détache la silhouette : quatre compositions.
    var ax = 200;
    if (forme === 0) {                       // l'arche
      var ar = 116 + Math.round(v * 10), ay = 168;
      s += path('M' + (ax - ar) + ',400 V' + ay + ' A' + ar + ',' + ar + ' 0 0 1 ' + (ax + ar) + ',' + ay + ' V400 Z', pal.plan);
    } else if (forme === 1) {                // la bande : le mur derrière la tête
      s += rect(0, 96 + Math.round(v * 30), 400, 400, pal.plan);
    } else if (forme === 2) {                // le disque : le halo du projecteur
      s += circ(ax, 176, 128 + Math.round(v * 14), pal.plan);
      s += rect(0, 330, 400, 70, pal.plan);
    } else {                                 // la diagonale : le sol qui monte
      s += poly(gauche ? [[0, 400], [0, 208], [400, 118], [400, 400]] : [[400, 400], [400, 208], [0, 118], [0, 400]], pal.plan);
    }

    // 3. Le faisceau : un coin franc au bord du cadre. Une carte sur trois s'en passe.
    if (faisceau < 0.66) {
      s += poly(gauche ? [[0, 0], [74, 0], [22, 400], [0, 400]] : [[400, 0], [326, 0], [378, 400], [400, 400]], pal.jour);
    } else if (faisceau < 0.86) {
      s += poly(gauche ? [[0, 0], [34, 0], [10, 400], [0, 400]] : [[400, 0], [366, 0], [390, 400], [400, 400]], pal.jour);
      s += poly(gauche ? [[52, 0], [72, 0], [34, 400], [20, 400]] : [[348, 0], [328, 0], [366, 400], [380, 400]], pal.jour);
    }

    // 4. Le sol : une arête franche, en travers de la masse.
    if (lieu === 'terrain') s += rect(0, 352, 400, 9, pal.jour);
    else if (lieu === 'buvette') s += rect(0, 338, 400, 13, pal.jour);
    else s += rect(0, 366, 400, 34, pal.fond);
    return s;
  }

  /* ── 8.3 La tête : un polygone à douze sommets, jamais un ovale ──────── */

  var CORP = { fin: 0.90, moyen: 1.0, large: 1.12 };

  function teteForme(w, ch) {
    var cx = 200, top = 104, brow = 148, jaw = 216, chin = 250, mw = w * ch;
    return [
      [cx, top - 2], [cx + w * 0.72, top + 12], [cx + w, brow - 22], [cx + w, brow + 34],
      [cx + w * 0.93, jaw], [cx + mw, chin - 10], [cx, chin],
      [cx - mw, chin - 10], [cx - w * 0.93, jaw], [cx - w, brow + 34],
      [cx - w, brow - 22], [cx - w * 0.72, top + 12]
    ];
  }
  /// La lumière sur le visage : la moitié droite, arête franche, un seul plan.
  function ombreVisage(pt) {
    var out = [[212, 102]];
    for (var i = 1; i <= 6; i++) out.push(pt[i]);
    out.push([190, 248]);
    return out;
  }

  /* ── 8.4 Les cheveux : des masses, avant et arrière ──────────────────── */

  function cheveuxArriere(ch, w, pal, ck) {
    var cx = 200, c = pal.poil;
    switch (ch) {
      case 'mulet':
        return poly([[cx - w - 4, 150], [cx + w + 4, 150], [cx + w + 12, 300], [cx + w - 8, 306], [cx + w - 14, 214], [cx - w + 14, 214], [cx - w + 8, 306], [cx - w - 12, 300]], c);
      case 'long': case 'catogan':
        return poly([[cx - w - 8, 140], [cx + w + 8, 140], [cx + w + 14, 320], [cx + w - 10, 320], [cx + w - 16, 208], [cx - w + 16, 208], [cx - w + 10, 320], [cx - w - 14, 320]], c) +
          (ch === 'catogan' ? poly([[cx - 12, 296], [cx + 12, 296], [cx + 16, 348], [cx - 16, 348]], c) : '');
      case 'queue':
        return poly([[cx - w - 4, 128], [cx + w + 4, 128], [cx + w + 6, 186], [cx - w - 6, 186]], c) +
          poly([[cx + w - 2, 156], [cx + w + 26, 178], [cx + w + 30, 262], [cx + w + 8, 268], [cx + w + 6, 188]], c);
      case 'chignon':
        return poly([[cx - w - 4, 126], [cx + w + 4, 126], [cx + w + 6, 184], [cx - w - 6, 184]], c) +
          poly([[cx - 26, 92], [cx + 26, 92], [cx + 32, 122], [cx - 32, 122]], c);
      case 'carre':
        return poly([[cx - w - 10, 132], [cx + w + 10, 132], [cx + w + 14, 268], [cx + w - 6, 274], [cx + w - 10, 200], [cx - w + 10, 200], [cx - w + 6, 274], [cx - w - 14, 268]], c);
      case 'permanente':
        var s = '';
        for (var i = 0; i < 11; i++) {
          var a = Math.PI * (0.06 + 0.88 * (i / 10));
          s += circ(cx - Math.cos(a) * (w + 12), 156 - Math.sin(a) * (w + 6), 22, c);
        }
        return s;
      case 'boucle':
        var b = '';
        for (var k = 0; k < 8; k++) {
          var t = Math.PI * (0.08 + 0.84 * (k / 7));
          b += circ(cx - Math.cos(t) * (w + 4), 150 - Math.sin(t) * (w - 2), 19, c);
        }
        return b;
      case 'dread':
        var dd = '';
        for (var j = 0; j < 7; j++) dd += rect(cx - w + 4 + j * ((2 * w - 12) / 6), 104, 9, 74, c, 4);
        return dd;
      case 'casquette': case 'beret': case 'bonnet':
        return poly([[cx - w - 2, 150], [cx + w + 2, 150], [cx + w + 2, 196], [cx - w - 2, 196]], c);
      default:
        return '';
    }
  }

  function cheveuxAvant(ch, w, pal, ck) {
    var cx = 200, c = pal.poil, top = 104, coiffe = ck || pal.tissu;
    switch (ch) {
      case 'chauve': return '';
      case 'rase':
        return poly([[cx - w, 146], [cx - w * 0.72, top + 8], [cx, top - 4], [cx + w * 0.72, top + 8], [cx + w, 146], [cx + w, 134], [cx, 120], [cx - w, 134]], c);
      case 'degarni':
        return poly([[cx - w - 2, 158], [cx - w - 2, 124], [cx - w * 0.44, 112], [cx - w * 0.3, 124],
          [cx - w * 0.56, 134], [cx - w * 0.66, 158]], c) +
          poly([[cx + w + 2, 158], [cx + w + 2, 124], [cx + w * 0.44, 112], [cx + w * 0.3, 124],
            [cx + w * 0.56, 134], [cx + w * 0.66, 158]], c) +
          poly([[cx - w, 122], [cx - w * 0.4, 108], [cx + w * 0.4, 108], [cx + w, 122],
            [cx + w * 0.66, 116], [cx - w * 0.66, 116]], c);
      case 'brosse':
        return poly([[cx - w - 2, 128], [cx - w - 2, 96], [cx + w + 2, 96], [cx + w + 2, 128], [cx + w * 0.8, 122], [cx - w * 0.8, 122]], c);
      case 'meche':
        return poly([[cx - w - 2, 142], [cx - w - 2, 116], [cx - w * 0.5, top - 6], [cx + w * 0.8, top + 6], [cx + w + 2, 128], [cx + w + 2, 146], [cx + w * 0.4, 124], [cx - w * 0.2, 138]], c);
      case 'plaque':
        return poly([[cx - w - 4, 138], [cx - w * 0.6, top - 4], [cx + w * 0.7, top + 4], [cx + w + 6, 116], [cx + w + 2, 134], [cx, 122], [cx - w * 0.6, 130]], c);
      case 'casquette':
        return poly([[cx - w - 6, 132], [cx - w * 0.6, 92], [cx + w * 0.6, 92], [cx + w + 6, 132]], coiffe) +
          poly([[cx - w - 10, 132], [cx + w + 12, 132], [cx + w + 34, 146], [cx - w - 8, 146]], pal.fond);
      case 'beret':
        return poly([[cx - w - 8, 122], [cx + w + 2, 108], [cx + w + 14, 122], [cx + w - 6, 134], [cx - w - 2, 134]], coiffe) +
          circ(cx + w + 6, 106, 6, coiffe);
      case 'bonnet':
        return poly([[cx - w - 4, 136], [cx - w - 4, 104], [cx, 88], [cx + w + 4, 104], [cx + w + 4, 136]], coiffe) +
          rect(cx - w - 6, 130, 2 * w + 12, 16, pal.fond);
      case 'permanente': case 'boucle':
        return poly([[cx - w, 138], [cx - w * 0.7, top + 2], [cx, top - 8], [cx + w * 0.7, top + 2], [cx + w, 138], [cx + w * 0.5, 122], [cx - w * 0.5, 122]], c);
      case 'chignon': case 'queue': case 'catogan':
        return poly([[cx - w - 2, 138], [cx - w * 0.7, top + 4], [cx, top - 6], [cx + w * 0.7, top + 4], [cx + w + 2, 138], [cx + w * 0.3, 118], [cx - w * 0.3, 118]], c);
      case 'carre':
        return poly([[cx - w - 8, 148], [cx - w - 4, 112], [cx, top - 8], [cx + w + 4, 112], [cx + w + 8, 148], [cx + w * 0.34, 126], [cx - w * 0.5, 132]], c);
      case 'dread':
        return poly([[cx - w, 130], [cx - w * 0.7, top + 2], [cx, top - 6], [cx + w * 0.7, top + 2], [cx + w, 130]], c);
      case 'mulet': case 'long':
        return poly([[cx - w - 4, 146], [cx - w - 2, 112], [cx, top - 8], [cx + w + 2, 112], [cx + w + 4, 146], [cx + w * 0.2, 120], [cx - w * 0.6, 128]], c);
      default: // court
        return poly([[cx - w - 2, 144], [cx - w * 0.72, top + 2], [cx, top - 6], [cx + w * 0.72, top + 2], [cx + w + 2, 144], [cx + w * 0.62, 122], [cx - w * 0.62, 122]], c);
    }
  }

  root.__FA_PORTRAIT_A__ = {
    DECOR: DECOR, LIEUX: LIEUX, LIEU_DE_CAMP: LIEU_DE_CAMP, CORP: CORP,
    lieuValide: lieuValide, paletteDe: paletteDe, decorPortrait: decorPortrait,
    teteForme: teteForme, ombreVisage: ombreVisage,
    cheveuxArriere: cheveuxArriere, cheveuxAvant: cheveuxAvant
  };
})(typeof window !== 'undefined' ? window : this);

/* ══ 9. LA TENUE, LE VISAGE, L'ATTRIBUT ═════════════════════════════════ */
(function (root) {
  "use strict";
  var B = root.__FA_BASE__, A = root.__FA_PORTRAIT_A__;
  var poly = B.poly, rect = B.rect, circ = B.circ, ell = B.ell, path = B.path;
  var grp = B.grp, anneau = B.anneau, mix = B.mix, rectPath = B.rectPath, circPath = B.circPath;

  /* ── 9.1 Le buste : la silhouette d'abord, le détail ensuite ─────────── */

  function bustePoints(k, ep) {
    // k élargit les épaules (corpulence × tenue) ; ep affaisse l'épaule droite.
    var cx = 200, d = function (x) { return cx + (x - cx) * k; };
    return [
      [d(64), 400], [d(78), 322], [d(114), 284], [d(166), 266],
      [d(234), 266 + (ep || 0)], [d(286), 284 + (ep || 0)], [d(322), 322], [d(336), 400]
    ];
  }

  function tenue(f, pal, k, r) {
    var t = f.tn || 'chemise', cx = 200, s = '';
    var K = k * (t === 'doudoune' ? 1.16 : t === 'manteau' ? 1.10 : t === 'maillot' ? 0.95 : t === 'gardien' ? 1.04 : 1);
    var pt = bustePoints(K, f.ep || 0);
    var col = pal.tissu, col2 = pal.tissu2 || pal.jour;
    s += poly(pt, col);
    // L'ombre du vêtement n'est pas une couleur de plus : c'est le fond.
    s += poly([[cx + 14, 266], pt[4], pt[5], pt[6], pt[7], [cx + 52, 400]], pal.fond);

    switch (t) {
      case 'costume':
        s += poly([[cx - 34, 268], [cx, 322], [cx + 34, 268], [cx + 22, 266], [cx, 292], [cx - 22, 266]], pal.jour);
        s += poly([[cx - 40, 266], [cx - 8, 300], [cx - 30, 400], [cx - 78, 400]], pal.fond);
        s += poly([[cx + 40, 266], [cx + 8, 300], [cx + 30, 400], [cx + 78, 400]], pal.fond);
        s += poly([[cx - 9, 300], [cx + 9, 300], [cx + 13, 400], [cx - 13, 400]], col2); // la cravate
        break;
      case 'tailleur':
        s += poly([[cx - 36, 266], [cx, 330], [cx + 36, 266], [cx + 20, 266], [cx, 300], [cx - 20, 266]], col2);
        s += poly([[cx - 42, 268], [cx - 6, 316], [cx - 26, 400], [cx - 80, 400]], pal.fond);
        s += poly([[cx + 42, 268], [cx + 6, 316], [cx + 26, 400], [cx + 80, 400]], pal.fond);
        break;
      case 'robe': // la robe de procureure : le rabat blanc, deux plis
        s += poly([[cx - 30, 266], [cx + 30, 266], [cx + 16, 330], [cx - 16, 330]], col2);
        s += rect(cx - 4, 268, 8, 62, pal.fond);
        break;
      case 'blouse':
        s += poly([[cx - 30, 266], [cx, 318], [cx + 30, 266], [cx + 16, 266], [cx, 288], [cx - 16, 266]], col2);
        s += rect(cx - 62, 330, 26, 30, pal.fond, 4); // la poche
        break;
      case 'survetement':
        s += rect(cx - 7, 266, 14, 134, pal.fond); // la fermeture
        s += poly([[cx - 84 * k, 300], [cx - 66 * k, 296], [cx - 52 * k, 400], [cx - 74 * k, 400]], col2);
        s += poly([[cx + 84 * k, 300], [cx + 66 * k, 296], [cx + 52 * k, 400], [cx + 74 * k, 400]], col2);
        s += poly([[cx - 26, 266], [cx + 26, 266], [cx + 20, 284], [cx - 20, 284]], pal.fond);
        break;
      case 'coupevent':
        s += poly([[cx - 40, 264], [cx + 40, 264], [cx + 34, 300], [cx - 34, 300]], col2); // le col monté
        s += rect(cx - 6, 292, 12, 108, pal.fond);
        break;
      case 'maillot':
        s += poly([[cx - 24, 264], [cx + 24, 264], [cx + 18, 288], [cx - 18, 288]], col2); // l'encolure
        s += rect(cx - 118 * k, 308, 22, 92, col2); s += rect(cx + 96 * k, 308, 22, 92, col2);
        break;
      case 'gardien':
        s += poly([[cx - 28, 262], [cx + 28, 262], [cx + 20, 290], [cx - 20, 290]], col2);
        s += rect(cx - 132 * k, 322, 26, 78, col2); s += rect(cx + 106 * k, 322, 26, 78, col2);
        break;
      case 'doudoune':
        s += rect(cx - 120 * k, 300, 240 * k, 7, pal.fond);
        s += rect(cx - 120 * k, 348, 240 * k, 7, pal.fond);
        s += rect(cx - 7, 266, 14, 134, pal.jour);
        if (f.c2) s += poly([[cx - 46, 262], [cx + 46, 262], [cx + 36, 296], [cx - 36, 296]], col2);
        break;
      case 'manteau':
        s += poly([[cx - 48, 264], [cx, 336], [cx + 48, 264], [cx + 26, 264], [cx, 306], [cx - 26, 264]], col2);
        s += circ(cx - 20, 350, 8, col2); s += circ(cx - 20, 382, 8, col2);
        break;
      case 'tablier':
        s += poly([[cx - 46, 282], [cx + 46, 282], [cx + 58, 400], [cx - 58, 400]], col2);
        s += poly([[cx - 46, 282], [cx - 30, 266], [cx - 22, 272], [cx - 38, 288]], col2);
        s += poly([[cx + 46, 282], [cx + 30, 266], [cx + 22, 272], [cx + 38, 288]], col2);
        break;
      case 'veste':
        s += poly([[cx - 34, 266], [cx, 316], [cx + 34, 266], [cx + 18, 266], [cx, 288], [cx - 18, 266]], col2);
        s += poly([[cx - 40, 266], [cx - 6, 302], [cx - 28, 400], [cx - 76, 400]], pal.fond);
        s += poly([[cx + 40, 266], [cx + 6, 302], [cx + 28, 400], [cx + 76, 400]], pal.fond);
        break;
      case 'pull':
        s += poly([[cx - 28, 262], [cx + 28, 262], [cx + 22, 292], [cx - 22, 292]], pal.fond);
        break;
      default: // chemise
        s += poly([[cx - 30, 264], [cx - 6, 300], [cx - 4, 264]], pal.jour);
        s += poly([[cx + 30, 264], [cx + 6, 300], [cx + 4, 264]], pal.jour);
        s += rect(cx - 3, 268, 6, 132, pal.fond);
    }
    return s;
  }

  /* ── 9.2 Le visage : trois expressions, rien d'autre ne bouge ────────── */

  var YEUX_Y = 180, SOURCIL_Y = 158, BOUCHE_Y = 218;

  function oeil(x, y, forme, expr, pal) {
    if (expr === 'noir') { // les yeux se ferment en fentes
      return poly([[x - 12, y - 1], [x + 12, y - 3], [x + 12, y + 3], [x - 12, y + 4]], pal.trait || pal.poil);
    }
    if (forme === 'fente') {
      var h = expr === 'sourire' ? 3.5 : 5;
      return poly([[x - 13, y - h], [x + 13, y - h + 1], [x + 13, y + h], [x - 13, y + h - 1]], pal.trait || pal.poil);
    }
    var hy = expr === 'sourire' ? 5.5 : 7.5;
    var hx = 12.5;
    return poly([[x - hx, y], [x - hx * 0.55, y - hy], [x + hx * 0.55, y - hy],
      [x + hx, y], [x + hx * 0.55, y + hy], [x - hx * 0.55, y + hy]], pal.trait || pal.poil) +
      rect(x + 2, y - hy + 1, 4, 3, pal.jour);
  }

  function sourcil(x, y, sens, expr, pal, epais) {
    var a = expr === 'sourire' ? -sens * 8 : expr === 'noir' ? sens * 13 : sens * 2;
    var dy = expr === 'sourire' ? -4 : 0;
    var w = 30, h = epais || 7;
    return grp(poly([[x - w / 2, y + dy], [x + w / 2, y + dy - 2], [x + w / 2, y + dy + h - 2], [x - w / 2, y + dy + h]], pal.trait || pal.poil),
      'rotate(' + B.n(a) + ' ' + x + ' ' + (y + dy) + ')');
  }

  function bouche(expr, pal, large) {
    var cx = 200, w = large ? 22 : 18, y = BOUCHE_Y, tr = pal.trait || pal.poil;
    if (expr === 'sourire') {
      return poly([[cx - w, y - 4], [cx + w, y - 4], [cx + w - 6, y + 9], [cx - w + 6, y + 9]], tr) +
        poly([[cx - w + 3, y - 3], [cx + w - 3, y - 3], [cx + w - 7, y + 1], [cx - w + 7, y + 1]], pal.jour);
    }
    if (expr === 'noir') {
      return poly([[cx - w, y + 6], [cx, y + 1], [cx + w, y + 6], [cx + w, y + 11], [cx, y + 6], [cx - w, y + 11]], tr);
    }
    return poly([[cx - w, y + 1], [cx + w, y], [cx + w, y + 5], [cx - w, y + 6]], tr);
  }

  function pilosite(po, pal, w) {
    var cx = 200;
    switch (po) {
      case 'moustache':
        return poly([[cx - 24, 202], [cx + 24, 202], [cx + 20, 213], [cx, 209], [cx - 20, 213]], pal.poil);
      case 'barbe':
        return poly([[cx - w * 0.94, 196], [cx - w * 0.8, 232], [cx, 258], [cx + w * 0.8, 232], [cx + w * 0.94, 196],
          [cx + w * 0.7, 214], [cx + 26, 206], [cx - 26, 206], [cx - w * 0.7, 214]], pal.poil) +
          poly([[cx - 24, 200], [cx + 24, 200], [cx + 20, 211], [cx, 207], [cx - 20, 211]], pal.poil);
      case 'barbe3j':
        return poly([[cx - w * 0.9, 200], [cx - w * 0.76, 230], [cx, 254], [cx + w * 0.76, 230], [cx + w * 0.9, 200],
          [cx + w * 0.66, 216], [cx - w * 0.66, 216]], pal.ombre);
      case 'bouc':
        return poly([[cx - 20, 226], [cx + 20, 226], [cx + 15, 250], [cx - 15, 250]], pal.poil) +
          poly([[cx - 21, 203], [cx + 21, 203], [cx + 17, 212], [cx - 17, 212]], pal.poil);
      default: return '';
    }
  }

  function lunettes(lu, pal, w) {
    var cx = 200, y = YEUX_Y;
    if (!lu || lu === 'aucune') return '';
    var c = pal.jour;
    if (lu === 'front') { // remontées sur le front, comme le Doc
      return anneau(circPath(cx - 24, 132, 15, 1), circPath(cx - 24, 132, 11, -1), c) +
        anneau(circPath(cx + 24, 132, 15, 1), circPath(cx + 24, 132, 11, -1), c) +
        rect(cx - 10, 130, 20, 4, c);
    }
    var s = '';
    if (lu === 'rondes' || lu === 'chainette') {
      s += anneau(circPath(cx - 23, y, 17, 1), circPath(cx - 23, y, 13, -1), c);
      s += anneau(circPath(cx + 23, y, 17, 1), circPath(cx + 23, y, 13, -1), c);
      s += rect(cx - 7, y - 2, 14, 4, c);
    } else if (lu === 'carrees') {
      s += anneau(rectPath(cx - 42, y - 14, 34, 27, 1), rectPath(cx - 38, y - 10, 26, 19, -1), c);
      s += anneau(rectPath(cx + 8, y - 14, 34, 27, 1), rectPath(cx + 12, y - 10, 26, 19, -1), c);
      s += rect(cx - 9, y - 3, 18, 4, c);
    } else { // aviateur : verres teintés, plans pleins
      s += poly([[cx - 44, y - 12], [cx - 6, y - 12], [cx - 10, y + 12], [cx - 34, y + 12]], pal.poil);
      s += poly([[cx + 44, y - 12], [cx + 6, y - 12], [cx + 10, y + 12], [cx + 34, y + 12]], pal.poil);
      s += rect(cx - 8, y - 12, 16, 4, c);
      s += rect(cx - 46, y - 14, 96, 4, c);
    }
    if (lu === 'chainette') {
      s += poly([[cx - 46, y + 4], [cx - 42, y + 4], [cx - 56, y + 52], [cx - 60, y + 50]], c);
      s += poly([[cx + 46, y + 4], [cx + 42, y + 4], [cx + 56, y + 52], [cx + 60, y + 50]], c);
    }
    return s;
  }

  /* ── 9.3 L'attribut : ce qui fait reconnaître en une seconde ─────────── */

  function attribut(f, pal, k, r, d) {
    var ac = f.ac || 'aucun', cx = 200, acc = pal.accent, s = '';
    switch (ac) {
      case 'echarpe':
        s += poly([[cx - 84 * k, 292], [cx - 40, 276], [cx - 30, 306], [cx - 76 * k, 322]], acc);
        s += poly([[cx + 84 * k, 292], [cx + 40, 276], [cx + 30, 306], [cx + 76 * k, 322]], acc);
        s += poly([[cx - 76 * k, 322], [cx - 30, 306], [cx - 22, 400], [cx - 74 * k, 400]], acc);
        s += rect(cx - 74 * k, 340, 52 * k, 12, pal.jour);
        s += rect(cx - 74 * k, 372, 52 * k, 12, pal.jour);
        break;
      case 'sautoir': // l'écharpe d'élue, portée en bandoulière
        s += poly([[cx - 62 * k, 282], [cx - 34, 268], [cx + 56 * k, 400], [cx + 12 * k, 400]], acc);
        s += poly([[cx - 48 * k, 314], [cx - 20, 300], [cx + 34 * k, 400], [cx + 4 * k, 400]], pal.jour);
        break;
      case 'sifflet':
        s += poly([[cx - 28, 268], [cx - 22, 268], [cx + 6, 344], [cx, 346]], pal.jour);
        s += poly([[cx + 28, 268], [cx + 22, 268], [cx + 6, 344], [cx + 12, 346]], pal.jour);
        s += rect(cx - 12, 342, 30, 15, acc, 4);
        s += circ(cx + 20, 350, 8, acc);
        break;
      case 'stethoscope':
        s += poly([[cx - 32, 266], [cx - 26, 266], [cx - 44, 356], [cx - 52, 352]], pal.poil);
        s += poly([[cx + 32, 266], [cx + 26, 266], [cx + 22, 340], [cx + 14, 340]], pal.poil);
        s += circ(cx + 18, 350, 13, pal.jour);
        s += circ(cx + 18, 350, 7, pal.poil);
        break;
      case 'brassard':
        s += poly([[cx - 106 * k, 322], [cx - 74 * k, 314], [cx - 68 * k, 350], [cx - 100 * k, 358]], acc);
        break;
      case 'gants':
        s += rect(cx + 66 * k, 316, 52, 68, acc, 10);
        s += rect(cx + 74 * k, 296, 11, 30, acc, 5);
        s += rect(cx + 90 * k, 292, 11, 34, acc, 5);
        s += rect(cx + 106 * k, 296, 11, 30, acc, 5);
        s += rect(cx + 54 * k, 326, 16, 28, acc, 8);
        s += rect(cx + 66 * k, 356, 52, 9, pal.fond);
        break;
      case 'carnet':
        s += rect(cx + 34, 322, 74, 60, pal.jour, 3);
        s += rect(cx + 34, 322, 12, 60, pal.poil, 3);
        s += rect(cx + 56, 340, 44, 5, pal.poil); s += rect(cx + 56, 356, 34, 5, pal.poil);
        break;
      case 'dossier':
        s += poly([[cx + 26, 336], [cx + 116, 320], [cx + 126, 396], [cx + 36, 400]], pal.jour);
        s += rect(cx + 44, 348, 60, 6, pal.poil); s += rect(cx + 44, 364, 46, 6, pal.poil);
        break;
      case 'journal':
        s += poly([[cx - 118, 322], [cx + 4, 306], [cx + 12, 400], [cx - 112, 400]], pal.jour);
        s += rect(cx - 106, 326, 88, 12, pal.poil);
        s += rect(cx - 106, 348, 40, 5, pal.poil);
        s += rect(cx - 106, 360, 40, 5, pal.poil);
        s += rect(cx - 58, 348, 40, 34, pal.poil);
        break;
      case 'micro':
        s += rect(cx + 56, 234, 17, 118, pal.poil, 6);
        s += circ(cx + 64, 226, 22, pal.jour);
        s += rect(cx + 52, 262, 25, 20, pal.accent, 3);
        break;
      case 'telephone':
        s += rect(cx + 52, 246, 30, 96, pal.poil, 6);
        s += rect(cx + 58, 258, 18, 26, pal.jour, 2);
        s += rect(cx + 76, 168, 6, 84, pal.poil, 3);
        break;
      case 'montre':
        s += rect(cx + 74 * k, 350, 40, 22, pal.jour, 4);
        s += circ(cx + 94 * k, 361, 13, pal.jour);
        s += circ(cx + 94 * k, 361, 8, pal.poil);
        break;
      case 'medaille':
        s += poly([[cx - 26, 268], [cx - 20, 268], [cx - 2, 330], [cx - 10, 332]], pal.jour);
        s += poly([[cx + 26, 268], [cx + 20, 268], [cx + 6, 330], [cx + 14, 332]], pal.jour);
        s += circ(cx + 2, 346, 18, pal.jour);
        s += circ(cx + 2, 346, 9, pal.poil);
        break;
      case 'badge':
        s += rect(cx + 40, 306, 46, 32, pal.jour, 3);
        s += rect(cx + 46, 314, 34, 5, pal.poil); s += rect(cx + 46, 324, 24, 5, pal.poil);
        break;
      case 'stylo':
        s += poly([[cx + 58, 254], [cx + 70, 254], [cx + 82, 348], [cx + 70, 350]], pal.accent);
        s += poly([[cx + 58, 254], [cx + 70, 254], [cx + 66, 238], [cx + 62, 238]], pal.jour);
        break;
      case 'chewing_gum':
        s += circ(cx + 40, 214, 9, pal.jour);
        break;
      case 'verre':
        s += poly([[cx + 60, 300], [cx + 106, 300], [cx + 100, 380], [cx + 66, 380]], pal.jour);
        s += poly([[cx + 63, 322], [cx + 103, 322], [cx + 100, 378], [cx + 66, 378]], pal.accent);
        break;
      case 'boite':
        s += rect(cx + 34, 316, 96, 66, pal.accent, 4);
        s += rect(cx + 34, 336, 96, 8, pal.fond);
        s += rect(cx + 68, 306, 28, 12, pal.jour, 3);
        break;
      case 'seau':
        s += poly([[cx + 46, 320], [cx + 130, 320], [cx + 120, 396], [cx + 56, 396]], pal.jour);
        s += rect(cx + 46, 314, 84, 10, pal.poil, 3);
        break;
      case 'canne':
        s += rect(cx + 96 * k, 240, 12, 160, pal.poil, 5);
        s += poly([[cx + 96 * k, 246], [cx + 96 * k - 34, 226], [cx + 96 * k - 30, 244], [cx + 96 * k + 8, 258]], pal.poil);
        break;
      case 'sac':
        s += rect(cx + 42, 320, 92, 78, pal.jour, 4);
        s += rect(cx + 74, 302, 28, 22, pal.poil, 4);
        break;
      case 'fanion':
        s += poly([[cx + 40, 288], [cx + 132, 306], [cx + 46, 380]], pal.accent);
        s += rect(cx + 34, 282, 8, 116, pal.poil, 4);
        s += rect(cx + 58, 316, 44, 8, pal.jour);
        break;
      case 'tampon':
        s += rect(cx + 54, 342, 62, 22, pal.poil, 3);
        s += rect(cx + 70, 300, 30, 44, pal.jour, 5);
        s += circ(cx + 85, 292, 15, pal.jour);
        break;
      case 'cle':
        s += anneau(circPath(cx + 62, 314, 22, 1), circPath(cx + 62, 314, 12, -1), pal.jour);
        s += rect(cx + 57, 332, 10, 62, pal.jour);
        s += rect(cx + 57, 372, 26, 9, pal.jour);
        break;
      case 'casque':
        s += rect(cx - 92, 146, 22, 66, pal.poil, 8);
        s += rect(cx + 70, 146, 22, 66, pal.poil, 8);
        s += path('M' + (cx - 88) + ',152 A' + 88 + ',' + 88 + ' 0 0 1 ' + (cx + 88) + ',152 v18 A70,70 0 0 0 ' + (cx - 88) + ',170 Z', pal.poil);
        break;
      case 'manches': // les mains dans les manches : le prodige qui attend
        s += rect(cx - 96 * k, 344, 40, 56, pal.fond, 6);
        s += rect(cx + 56 * k, 344, 40, 56, pal.fond, 6);
        break;
      default: break;
    }
    return s;
  }

  root.__FA_PORTRAIT_B__ = {
    bustePoints: bustePoints, tenue: tenue, oeil: oeil, sourcil: sourcil,
    bouche: bouche, pilosite: pilosite, lunettes: lunettes, attribut: attribut,
    YEUX_Y: YEUX_Y, SOURCIL_Y: SOURCIL_Y, BOUCHE_Y: BOUCHE_Y
  };
})(typeof window !== 'undefined' ? window : this);

/* ══ 10. L'ASSEMBLAGE DU PORTRAIT ═══════════════════════════════════════ */
(function (root) {
  "use strict";
  var B = root.__FA_BASE__, F = root.__FA_FICHES__;
  var A = root.__FA_PORTRAIT_A__, C = root.__FA_PORTRAIT_B__;
  var poly = B.poly, rect = B.rect, circ = B.circ, path = B.path, grp = B.grp, mix = B.mix;

  /* ── 10.1 LES CADRAGES ──────────────────────────────────────────────────
   * Un seul plan pour toutes les cartes à personnage, et soixante cartes
   * donnent soixante fois la même image : la tête au même endroit, à la même
   * échelle, les épaules qui remplissent le bas. Quatre familles, tirées de
   * la graine de la carte (donc différentes d'une apparition à l'autre du
   * MÊME visage) :
   *
   *   buste — le plan de référence, épaules au bord du cadre ;
   *   serre — la tête remplit le cadre, coupée au front ;
   *   large — la figure occupe un tiers, le décor respire autour ;
   *   dos   — de dos : la nuque et la masse des cheveux, aucun trait de
   *           visage. C'est le décor et l'épaule qui portent la carte.
   *
   * (La cinquième famille — l'objet en premier plan, sans figure — est
   * assemblée par l'API : elle emprunte au module des lieux et à celui des
   * objets, que ce module-ci ne voit pas.)
   *
   * Chaque famille pose une ÉCHELLE, et l'ancrage vertical se calcule pour
   * que le sujet tombe juste : le regard à ~175 px en gros plan, la figure
   * posée sur le bord bas en plan large. `dx` est le débattement horizontal :
   * le sujet n'est plus jamais centré au pixel près.
   */
  var CADRAGES_PORTRAIT = ['buste', 'serre', 'large', 'dos'];

  function reglageCadre(cad, S) {
    // L'oeil du sujet, sans décalage, tombe à `286 - 106 * S`.
    switch (cad) {
      case 'serre': return { dy: 106 * S - 111, dx: 34 };
      case 'large': return { dy: 114 * (1 - S), dx: 92 };
      case 'dos': return { dy: 106 * S - 121, dx: 66 };
      default: return { dy: 0, dx: 48 };
    }
  }
  function echelleCadre(cad, r, enfant) {
    var base = cad === 'serre' ? 2.30 : cad === 'large' ? 0.74 : cad === 'dos' ? 1.44 : (enfant ? 0.94 : 1.16);
    return base * (0.93 + 0.14 * r());
  }

  /// La nuque : la même tête, vue de derrière. Une masse de cheveux, une
  /// oreille, et la peau du cou — pas un trait de visage.
  function nuque(w, pal, ch, gauche) {
    var cx = 200, c = pal.poil, s = '';
    if (ch === 'chauve' || ch === 'degarni') {
      s += poly([[cx - w - 3, 204], [cx - w - 3, 156], [cx - w * 0.66, 148], [cx - w * 0.56, 172], [cx - w * 0.56, 204]], c);
      s += poly([[cx + w + 3, 204], [cx + w + 3, 156], [cx + w * 0.66, 148], [cx + w * 0.56, 172], [cx + w * 0.56, 204]], c);
      s += poly([[cx - w * 0.6, 190], [cx + w * 0.6, 190], [cx + w * 0.56, 204], [cx - w * 0.56, 204]], c);
    } else {
      s += poly([[cx - w - 4, 208], [cx - w - 4, 140], [cx - w * 0.72, 104], [cx, 96],
        [cx + w * 0.72, 104], [cx + w + 4, 140], [cx + w + 4, 208],
        [cx + w * 0.58, 196], [cx, 192], [cx - w * 0.58, 196]], c);
    }
    // L'oreille, d'un seul côté : c'est elle qui dit que la tête est tournée.
    var e = gauche ? -1 : 1;
    s += poly([[cx + e * (w - 2), 166], [cx + e * (w + 17), 172], [cx + e * (w + 13), 200], [cx + e * (w - 4), 196]], pal.ombre);
    return s;
  }

  /// Un portrait : le personnage dans son cadrage, son décor réduit à trois
  /// plans. L'expression ne touche que la bouche, les sourcils et
  /// l'inclinaison de la tête — jamais le reste du visage.
  function portrait(f, expr, lieu, d, r, spec, cad) {
    expr = (expr === 'ferme' ? 'noir' : expr) || 'neutre';
    if (['sourire', 'neutre', 'noir'].indexOf(expr) < 0) expr = 'neutre';
    if (CADRAGES_PORTRAIT.indexOf(cad) < 0) cad = 'buste';
    var tranche = F.trancheAge(f, d.annee);
    var fiche = {};
    for (var key in f) if (Object.prototype.hasOwnProperty.call(f, key)) fiche[key] = f[key];
    fiche.__gris = (f.cv === 'gris' || f.cv === 'blanc') ? 0 : tranche === 'age' ? 0.72 : tranche === 'mur' ? 0.42 : 0;
    // Le temps passe aussi sur les lunettes : on en met à 55 ans, on garde.
    if ((fiche.lu === 'aucune' || !fiche.lu) && tranche === 'age' && !fiche.enf) fiche.lu = 'rondes';

    var pal = A.paletteDe(fiche, lieu, d);
    var k = A.CORP[fiche.co] || 1;
    var enfant = !!fiche.enf && d.annee - (1990 + (fiche.an || 0)) < 14;
    var w = 52 * k * (enfant ? 0.82 : 1) * (tranche === 'jeune' ? 0.96 : 1);
    var chMen = fiche.co === 'large' ? 0.80 : fiche.co === 'fin' ? 0.60 : 0.70;

    var s = A.decorPortrait(pal, lieu, r);

    // La figure, agrandie autour du buste : le sujet remplit le cadre.
    var fig = '';
    // Le buste, puis le cou : la silhouette avant le visage.
    fig += C.tenue(fiche, pal, k, r);
    var couY = enfant ? 250 : 244;
    fig += poly([[182, 224], [218, 224], [226, couY + 24], [174, couY + 24]], pal.peau);
    fig += poly([[200, 224], [218, 224], [226, couY + 24], [200, couY + 24]], pal.ombre);
    fig += poly([[172, 258], [228, 258], [236, 272], [164, 272]], pal.ombre); // l'ombre portée du menton

    // La tête, dans un groupe incliné : c'est l'inclinaison qui joue.
    var tilt = expr === 'sourire' ? 3.2 : expr === 'noir' ? -3.4 : 0;
    var tete = '';
    var pt = A.teteForme(w, chMen);
    if (cad === 'dos') {
      // De dos : la même silhouette, retournée. Aucun oeil, aucune bouche —
      // et donc aucune expression : l'inclinaison suffit.
      tilt = expr === 'noir' ? 4.2 : -2.4;
      tete += A.cheveuxArriere(fiche.ch, w, pal, fiche.ck ? couleurCoiffe(fiche, d) : null);
      tete += poly(pt, pal.peau);
      tete += poly(A.ombreVisage(pt), pal.ombre);
      tete += nuque(w, pal, fiche.ch, r() < 0.5);
      fig += grp(tete, 'rotate(' + B.n(tilt) + ' 200 250)');
      fig += C.attribut(fiche, pal, k, r, d);
      fig += epoque(fiche, pal, d, r);
      var Sd = echelleCadre('dos', r, enfant), gd = reglageCadre('dos', Sd);
      var dxd = (r() - 0.5) * gd.dx;
      s += grp(fig, 'translate(' + B.n(dxd) + ',' + B.n(gd.dy) + ') translate(200,286) scale(' +
        B.n(Sd) + ') translate(-200,-286)');
      return { svg: s, pal: pal, cadrage: 'dos' };
    }
    tete += A.cheveuxArriere(fiche.ch, w, pal, fiche.ck ? couleurCoiffe(fiche, d) : null);
    tete += poly([[200 - w - 8, 176], [200 - w + 2, 168], [200 - w + 2, 196], [200 - w - 8, 190]], pal.ombre);
    tete += poly([[200 + w + 8, 176], [200 + w - 2, 168], [200 + w - 2, 196], [200 + w + 8, 190]], pal.peau);
    tete += poly(pt, pal.peau);
    tete += poly(A.ombreVisage(pt), pal.ombre);
    if (fiche.masque) {
      // La Plume n'a pas de visage : elle n'existe que par écrit.
      tete += poly(pt, pal.poil);
      tete += poly([[200 - w * 0.5, 176], [200 + w * 0.5, 176], [200 + w * 0.5, 184], [200 - w * 0.5, 184]], pal.jour);
    } else {
      tete += poly([[200, 186], [211, 208], [190, 208]], pal.ombre); // le nez, un plan
      tete += C.oeil(200 - w * 0.42, C.YEUX_Y, fiche.yx, expr, pal);
      tete += C.oeil(200 + w * 0.42, C.YEUX_Y, fiche.yx, expr, pal);
      tete += C.sourcil(200 - w * 0.42, C.SOURCIL_Y, 1, expr, pal, tranche === 'age' ? 8 : 7);
      tete += C.sourcil(200 + w * 0.42, C.SOURCIL_Y, -1, expr, pal, tranche === 'age' ? 8 : 7);
      tete += C.pilosite(fiche.po, pal, w);
      tete += C.bouche(expr, pal, fiche.co === 'large');
      if (fiche.cic) tete += poly([[200 - w * 0.62, 150], [200 - w * 0.34, 142], [200 - w * 0.32, 147], [200 - w * 0.6, 155]], pal.ombre);
      if (tranche === 'age') { // le front qui se ride : deux plans, pas des traits
        tete += rect(200 - w * 0.52, 132, w * 1.04, 4, pal.ombre);
        tete += rect(200 - w * 0.4, 142, w * 0.8, 4, pal.ombre);
      }
    }
    tete += A.cheveuxAvant(fiche.ch, w, pal, fiche.ck ? couleurCoiffe(fiche, d) : null);
    if (!fiche.masque) tete += C.lunettes(fiche.lu, pal, w);
    fig += grp(tete, 'rotate(' + B.n(tilt) + ' 200 250)');
    fig += C.attribut(fiche, pal, k, r, d);
    // Un accessoire d'époque, discret, quand la décennie le demande.
    fig += epoque(fiche, pal, d, r);
    var S = echelleCadre(cad, r, enfant), g = reglageCadre(cad, S);
    var dx = (r() - 0.5) * g.dx;
    s += grp(fig, 'translate(' + B.n(dx) + ',' + B.n(g.dy) + ') translate(200,286) scale(' +
      B.n(S) + ') translate(-200,-286)');
    return { svg: s, pal: pal, cadrage: cad };
  }

  function couleurCoiffe(f, d) {
    var M = B.PALETTE.maillot;
    return d.c(M[f.ck] || M.anthracite);
  }

  /// Le temps qui passe sur le portrait : un objet, jamais deux.
  function epoque(f, pal, d, r) {
    if (f.enf || f.masque) return '';
    if (d.cle === '1990' && f.tn === 'survetement') {
      return poly([[200 - 96, 366], [200 - 40, 358], [200 - 38, 372], [200 - 94, 380]], pal.jour); // la bande criarde
    }
    if ((d.cle === '2020' || d.cle === '2030') && (f.tn === 'costume' || f.tn === 'veste')) {
      return rect(200 + 60, 348, 54, 34, pal.jour, 4); // l'écran
    }
    if (d.cle === '2040' && f.tn !== 'maillot') {
      return rect(200 - 118, 300, 10, 100, pal.jour); // la matière sombre, un liseré
    }
    return '';
  }

  /* ══ 11. LE PERSONNAGE INCARNÉ — jamais de face ═══════════════════════ */

  function incarne(role, genre, d, r, spec) {
    var base = F.INCARNE[role] || F.INCARNE.coach;
    var M = B.PALETTE.maillot, P = B.PALETTE;
    var femme = genre === 'f';
    var tranche = spec && spec.tranche ? spec.tranche : B.pick(r, F.AGES);
    var lieu = A.lieuValide(spec && spec.lieu) || base.lieu;
    var dec = A.DECOR[lieu] || A.DECOR.vestiaire;
    var t1 = role === 'coach' ? M.anthracite : M[(spec && spec.club && M[spec.club]) ? spec.club : 'cobalt'];
    var pal = {
      fond: dec.fond, plan: d.c(dec.plan), jour: d.c(dec.jour),
      demi: mix(dec.fond, d.c(dec.plan), 0.62),
      peau: d.c(P.peau.dore[0]), ombre: d.c(P.peau.dore[1]),
      poil: d.c(tranche === 'age' ? '#B0A99C' : tranche === 'mur' ? '#7E766A' : tranche === 'adulte' ? '#3A2A1E' : '#241C18'),
      tissu: d.c(t1), tissu2: d.c(M.creme),
      sombre: mix(dec.fond, '#000000', 0.4)
    };
    pal.trait = pal.fond;
    var cadrage = (spec && spec.cadrage) || B.pick(r, ['dos', 'dos', 'troisquarts', 'main', 'ombre']);
    var s = A.decorPortrait(pal, lieu, r);
    var cx = 200;

    if (cadrage === 'main') {
      // Une main, et l'objet du rôle. Le visage n'entre pas dans le cadre.
      s += poly([[120, 400], [150, 250], [250, 246], [286, 400]], pal.ombre);
      s += poly([[132, 400], [160, 262], [242, 258], [272, 400]], pal.peau);
      for (var i = 0; i < 4; i++) s += rect(158 + i * 22, 230 + i * 5, 18, 60, pal.peau, 9);
      if (role === 'coach') {
        s += rect(150, 210, 100, 22, pal.jour, 10);
        s += circ(258, 221, 17, pal.jour);
      } else {
        s += circ(200, 168, 54, pal.jour);
        s += poly([[200, 128], [222, 148], [214, 176], [186, 176], [178, 148]], pal.poil);
      }
      return { svg: s, pal: pal };
    }
    if (cadrage === 'ombre') {
      // Une ombre sur le mur : la silhouette porte tout.
      s += poly([[52, 400], [70, 300], [110, 258], [150, 244], [148, 200], [162, 158],
        [200, 142], [238, 158], [252, 200], [250, 244], [290, 258], [330, 300], [348, 400]],
        pal.sombre);
      s += poly([[200, 142], [238, 158], [252, 200], [250, 244], [290, 258], [330, 300], [348, 400], [200, 400]],
        mix(pal.sombre, pal.plan, 0.3));
      return { svg: s, pal: pal };
    }

    // De dos ou de trois quarts perdu : la nuque, les épaules, le dossard.
    var k = 1.08, fig = '';
    var pt = C.bustePoints(k, 0);
    fig += poly(pt, pal.tissu);
    fig += poly([[cx + 14, 266], pt[4], pt[5], pt[6], pt[7], [cx + 52, 400]], pal.fond);
    fig += poly([[176, 222], [224, 222], [232, 276], [168, 276]], pal.peau);
    fig += poly([[200, 222], [224, 222], [232, 276], [200, 276]], pal.ombre);

    var w = 54;
    var forme = A.teteForme(w, 0.74);
    // La tête vue de dos EST une tête : on garde sa silhouette, on la remplit
    // de cheveux, et on laisse la nuque en peau sous la coupe.
    var tete = poly(forme, pal.peau);
    if (cadrage === 'dos') {
      tete += poly([[cx - w - 2, 214], [cx - w - 2, 132], [cx - w * 0.7, 106], [cx, 100],
        [cx + w * 0.7, 106], [cx + w + 2, 132], [cx + w + 2, 214],
        [cx + w * 0.6, 226], [cx - w * 0.6, 226]], pal.poil);
      tete += poly([[cx - w * 0.34, 226], [cx + w * 0.34, 226], [cx + w * 0.28, 244], [cx - w * 0.28, 244]], pal.ombre);
      tete += poly([[cx - w - 8, 168], [cx - w - 1, 162], [cx - w - 1, 194], [cx - w - 8, 188]], pal.peau);
      tete += poly([[cx + w + 8, 168], [cx + w + 1, 162], [cx + w + 1, 194], [cx + w + 8, 188]], pal.peau);
    } else {
      // Trois quarts perdu : l'oreille, la mâchoire, et rien du regard.
      tete += poly([[cx + 24, 100], forme[1], forme[2], forme[3], forme[4], forme[5], forme[6], [cx + 8, 250]], pal.ombre);
      tete += poly([[cx - w - 2, 196], [cx - w - 2, 134], [cx - w * 0.66, 106], [cx - w * 0.06, 100],
        [cx + w * 0.2, 116], [cx + w * 0.12, 150], [cx - w * 0.16, 200], [cx - w * 0.6, 208]], pal.poil);
      tete += poly([[cx + w * 0.14, 164], [cx + w * 0.46, 170], [cx + w * 0.44, 198], [cx + w * 0.12, 196]], pal.ombre);
      tete += poly([[cx + w * 0.62, 214], [cx + w * 0.9, 200], [cx + w * 0.86, 230], [cx + w * 0.4, 244]], pal.ombre);
    }
    if (femme) {
      tete += poly([[cx - w - 8, 152], [cx + w * (cadrage === 'dos' ? 1 : 0.42) + 4, 152],
        [cx + w * (cadrage === 'dos' ? 1 : 0.42) + 8, 312], [cx + w * 0.4, 320],
        [cx - w * 0.4, 320], [cx - w - 14, 312]], pal.poil);
    }
    fig += grp(tete, 'rotate(' + (cadrage === 'troisquarts' ? -8 : 0) + ' 200 250)');

    if (role === 'joueur') {
      var num = spec && spec.numero ? String(spec.numero) : String(4 + Math.floor(r() * 6) * 2 + 1);
      fig += B.chiffres(num, 200, 302, 78, pal.tissu2);
    } else {
      // Le cordon du sifflet, et le sifflet : l'attribut du banc.
      fig += poly([[172, 268], [179, 268], [200, 348], [192, 350]], pal.tissu2);
      fig += poly([[228, 268], [221, 268], [206, 348], [214, 350]], pal.tissu2);
      fig += rect(186, 344, 30, 15, pal.tissu2, 5);
      fig += circ(220, 352, 9, pal.tissu2);
    }
    s += grp(fig, 'translate(200,286) scale(1.14) translate(-200,-286)');
    return { svg: s, pal: pal };
  }

  root.__FA_PORTRAIT__ = {
    portrait: portrait, incarne: incarne,
    CADRAGES_PORTRAIT: CADRAGES_PORTRAIT
  };
})(typeof window !== 'undefined' ? window : this);

/* ══ 12. LES LIEUX — neuf décors, trois cadrages chacun ═════════════════ */
(function (root) {
  "use strict";
  var B = root.__FA_BASE__, A = root.__FA_PORTRAIT_A__;
  var P = B.PALETTE, poly = B.poly, rect = B.rect, circ = B.circ, ell = B.ell;
  var path = B.path, grp = B.grp, mix = B.mix, anneau = B.anneau, circPath = B.circPath;

  var CADRAGES = ['large', 'moyen', 'serre'];

  /// La palette d'un lieu : sept aplats, comme un portrait.
  function paletteLieu(lieu, d) {
    var base = {
      vestiaire: { fond: '#1B1109', plan: P.bois.sombre, jour: P.lumiere.jour, tissu: P.metal.bleu, poil: '#0E0904', accent: P.maillot.vert },
      couloir:   { fond: '#150E07', plan: P.metal.sombre, jour: P.lumiere.pale, tissu: P.metal.beton, poil: '#0C0803', accent: P.maillot.bordeaux },
      virage:    { fond: '#140D07', plan: P.metal.grillage, jour: P.lumiere.ambre, tissu: P.maillot.bordeaux, poil: '#0A0704', accent: P.maillot.jaune },
      bureau:    { fond: '#1D1207', plan: P.bois.moyen, jour: P.lumiere.jour, tissu: P.bois.sombre, poil: '#0F0904', accent: P.maillot.bordeaux },
      terrain:   { fond: '#0D1F14', plan: P.pelouse.profond, jour: P.pelouse.craie, tissu: P.pelouse.vif, poil: '#08150D', accent: P.lumiere.projecteur },
      car:       { fond: '#0D0E14', plan: P.metal.bleu, jour: P.lumiere.projecteur, tissu: P.metal.sombre, poil: '#07080C', accent: P.maillot.cobalt },
      buvette:   { fond: '#1C1208', plan: P.bois.cuir, jour: P.lumiere.ambre, tissu: P.bois.clair, poil: '#0E0904', accent: P.maillot.rouge },
      presse:    { fond: '#150F08', plan: P.maillot.bordeaux, jour: P.lumiere.pale, tissu: P.metal.sombre, poil: '#0B0804', accent: P.maillot.creme },
      maison:    { fond: '#1E1409', plan: P.bois.moyen, jour: P.lumiere.jour, tissu: P.maillot.orange, poil: '#0F0A05', accent: P.maillot.rouge }
    }[lieu] || null;
    if (!base) return null;
    return {
      fond: base.fond, plan: d.c(base.plan), jour: d.c(base.jour),
      demi: mix(base.fond, d.c(base.plan), 0.66),
      clair: mix(d.c(base.plan), d.c(base.jour), 0.15),
      tissu: d.c(base.tissu), poil: base.poil, accent: d.c(base.accent),
      ombre: mix(base.fond, d.c(base.plan), 0.45)
    };
  }

  /// Le ballon d'époque : panneaux en 1990, lisse en 2000, mat après 2030.
  function ballon(cx, cy, r0, pal, d) {
    var s = circ(cx, cy, r0, pal.jour), i, a;
    if (d.ballon === 'panneaux') {
      // 1990 : les panneaux cousus, un pentagone au centre et cinq au bord.
      s += poly([[cx, cy - r0 * 0.60], [cx + r0 * 0.57, cy - r0 * 0.19], [cx + r0 * 0.35, cy + r0 * 0.49],
        [cx - r0 * 0.35, cy + r0 * 0.49], [cx - r0 * 0.57, cy - r0 * 0.19]], pal.poil);
      for (i = 0; i < 5; i++) {
        a = -Math.PI / 2 + i * (2 * Math.PI / 5);
        var bx = cx + Math.cos(a) * r0 * 0.92, by = cy + Math.sin(a) * r0 * 0.92;
        s += poly([[bx + Math.cos(a - 1.1) * r0 * 0.3, by + Math.sin(a - 1.1) * r0 * 0.3],
          [bx + Math.cos(a + 1.1) * r0 * 0.3, by + Math.sin(a + 1.1) * r0 * 0.3],
          [bx + Math.cos(a) * r0 * 0.34, by + Math.sin(a) * r0 * 0.34]], pal.poil);
      }
    } else if (d.ballon === 'lisse') {
      // 2000 : la bande imprimée, plus de couture visible.
      s += path('M' + n2(cx - r0) + ',' + n2(cy) + ' q' + n2(r0) + ',' + n2(-r0 * 0.95) + ' ' + n2(2 * r0) + ',0' +
        ' q' + n2(-r0) + ',' + n2(r0 * 0.42) + ' ' + n2(-2 * r0) + ',0 Z', pal.accent);
      s += poly([[cx - r0 * 0.5, cy + r0 * 0.42], [cx, cy + r0 * 0.2], [cx + r0 * 0.5, cy + r0 * 0.42],
        [cx, cy + r0 * 0.86]], pal.poil);
    } else if (d.ballon === 'thermo') {
      // 2010-2020 : trois panneaux thermocollés, aucune couture.
      s += poly([[cx, cy - r0], [cx + r0 * 0.78, cy - r0 * 0.2], [cx, cy + r0 * 0.28], [cx - r0 * 0.78, cy - r0 * 0.2]], pal.accent);
      s += poly([[cx - r0 * 0.68, cy + r0 * 0.3], [cx, cy + r0 * 0.08], [cx + r0 * 0.68, cy + r0 * 0.3], [cx, cy + r0]], pal.accent);
    } else {
      // 2030-2050 : mat, sombre, une seule ligne de repère.
      s += poly([[cx - r0 * 0.86, cy - r0 * 0.1], [cx, cy - r0 * 0.46], [cx + r0 * 0.86, cy - r0 * 0.1],
        [cx + r0 * 0.86, cy + r0 * 0.12], [cx, cy - r0 * 0.24], [cx - r0 * 0.86, cy + r0 * 0.12]], pal.demi);
      s += circ(cx, cy + r0 * 0.46, r0 * 0.22, pal.demi);
    }
    return s;
  }
  function n2(v) { return Math.round(v * 100) / 100; }

  var LIEU = {};

  LIEU.vestiaire = function (pal, cad, d, r) {
    var s = rect(0, 0, 400, 400, pal.fond);
    if (cad === 'large') {
      s += rect(0, 0, 400, 300, pal.plan);
      s += poly([[0, 0], [140, 0], [64, 400], [0, 400]], pal.clair);
      for (var i = 0; i < 5; i++) {
        var x = 12 + i * 78;
        s += rect(x, 54, 66, 232, pal.tissu, 3);
        s += rect(x + 6, 62, 54, 44, pal.fond, 2);
        s += circ(x + 52, 190, 5, pal.jour);
        if (i % 2 === 0) s += poly([[x + 14, 118], [x + 52, 118], [x + 46, 232], [x + 20, 232]], i === 0 ? pal.accent : pal.jour);
      }
      s += rect(0, 300, 400, 22, pal.demi); // le banc
      s += rect(0, 322, 400, 78, pal.demi);
      s += rect(28, 322, 16, 78, pal.demi);
      s += rect(340, 322, 16, 78, pal.demi);
    } else if (cad === 'moyen') {
      s += rect(0, 0, 400, 330, pal.plan);
      s += poly([[240, 0], [400, 0], [400, 400], [312, 400]], pal.clair);
      s += rect(56, 30, 128, 300, pal.tissu, 4);
      s += rect(196, 30, 128, 300, pal.fond, 4);
      s += rect(70, 44, 100, 66, pal.fond, 3);
      s += circ(170, 200, 8, pal.jour);
      s += poly([[96, 118], [176, 118], [162, 322], [110, 322]], pal.jour); // le maillot pendu
      s += poly([[96, 118], [136, 132], [176, 118], [168, 148], [136, 158], [104, 148]], pal.accent);
      s += rect(0, 330, 400, 24, pal.demi);
    } else {
      s += rect(0, 0, 400, 400, pal.plan);
      s += poly([[0, 0], [190, 0], [120, 400], [0, 400]], pal.clair);
      s += rect(40, -20, 320, 380, pal.tissu, 6);
      s += rect(66, 10, 268, 120, pal.fond, 4);
      s += circ(312, 220, 14, pal.jour);
      s += rect(96, 210, 208, 12, pal.fond, 4);
      s += poly([[130, 222], [270, 222], [248, 400], [152, 400]], pal.accent); // l'écharpe au crochet
      s += rect(152, 300, 96, 20, pal.jour);
      s += rect(158, 348, 84, 20, pal.jour);
    }
    return s;
  };

  LIEU.couloir = function (pal, cad, d, r) {
    var s = rect(0, 0, 400, 400, pal.fond);
    if (cad === 'large') {
      s += poly([[0, 0], [400, 0], [400, 400], [0, 400]], pal.plan);
      s += poly([[0, 0], [0, 400], [128, 322], [128, 78]], pal.demi);
      s += poly([[400, 0], [400, 400], [272, 322], [272, 78]], pal.demi);
      s += poly([[0, 400], [128, 322], [272, 322], [400, 400]], pal.demi);
      s += rect(128, 78, 144, 244, pal.jour); // la lumière au bout, un aplat
      s += poly([[152, 96], [248, 96], [244, 322], [156, 322]], pal.accent);
      s += rect(30, 130, 26, 150, pal.demi);
      s += rect(344, 130, 26, 150, pal.demi);
    } else if (cad === 'moyen') {
      s += rect(0, 0, 400, 400, pal.plan);
      s += poly([[0, 0], [188, 0], [126, 400], [0, 400]], pal.clair);
      s += rect(214, 40, 158, 340, pal.tissu, 4); // la porte
      s += rect(232, 62, 122, 130, pal.fond, 3);
      s += circ(238, 250, 12, pal.jour);
      s += rect(228, 246, 26, 9, pal.jour, 4);
      s += poly([[0, 0], [96, 0], [46, 400], [0, 400]], pal.jour); // le rai de lumière
      s += rect(266, 76, 56, 8, pal.accent);
    } else {
      s += rect(0, 0, 400, 400, pal.plan);
      s += poly([[70, 0], [260, 0], [190, 400], [10, 400]], pal.clair);
      s += poly([[110, 0], [220, 0], [160, 400], [64, 400]], pal.jour);
      s += poly([[152, 0], [186, 0], [130, 400], [98, 400]], pal.accent);
      s += rect(272, 150, 96, 30, pal.tissu, 12);
      s += circ(292, 165, 11, pal.demi);
      s += rect(0, 340, 400, 60, pal.demi);
    }
    return s;
  };

  LIEU.virage = function (pal, cad, d, r) {
    var s = rect(0, 0, 400, 400, pal.fond);
    var foule = function (y0, h, col, nb, dec) {
      var o = '', i;
      for (i = 0; i < nb; i++) {
        var x = dec + i * (400 / nb);
        o += circ(x, y0, h * 0.34, col);
        o += poly([[x - h * 0.5, y0 + h * 1.2], [x - h * 0.42, y0 + h * 0.34], [x + h * 0.42, y0 + h * 0.34], [x + h * 0.5, y0 + h * 1.2]], col);
        if (i % 3 === 0) o += rect(x - h * 0.62, y0 - h * 0.5, h * 0.2, h * 0.7, col); // un bras levé
      }
      return o;
    };
    if (cad === 'large') {
      s += rect(0, 0, 400, 400, pal.plan);
      s += poly([[0, 0], [180, 0], [104, 400], [0, 400]], pal.clair);
      s += foule(180, 56, pal.demi, 6, 12);
      s += foule(286, 60, pal.tissu, 6, 12);
      s += rect(0, 336, 400, 44, pal.jour); // la banderole
      s += rect(24, 350, 76, 14, pal.fond); s += rect(120, 350, 128, 14, pal.fond); s += rect(268, 350, 92, 14, pal.fond);
      for (var i = 0; i < 10; i++) s += rect(i * 41 + 4, 0, 6, 336, pal.demi);
      s += rect(0, 92, 400, 6, pal.demi);
      s += rect(0, 214, 400, 6, pal.demi);
    } else if (cad === 'moyen') {
      s += rect(0, 0, 400, 400, pal.plan);
      s += poly([[220, 0], [400, 0], [400, 400], [300, 400]], pal.clair);
      s += foule(150, 66, pal.demi, 5, 18);
      s += foule(258, 82, pal.tissu, 4, 6);
      s += poly([[24, 60], [376, 44], [376, 96], [24, 112]], pal.accent); // l'écharpe tendue
      s += rect(24, 74, 352, 12, pal.jour);
      s += poly([[300, 130], [340, 90], [400, 120], [400, 260], [352, 240]], pal.accent); // le fumigène
    } else {
      s += rect(0, 0, 400, 400, pal.plan);
      s += poly([[0, 0], [400, 0], [400, 130], [0, 168]], pal.demi);
      for (var j = 0; j < 6; j++) s += rect(j * 70 + 10, 0, 12, 400, pal.demi);
      s += rect(0, 176, 400, 12, pal.demi);
      s += rect(0, 312, 400, 12, pal.demi);
      // deux mains sur le grillage
      s += rect(58, 196, 66, 90, pal.tissu, 14);
      s += rect(276, 214, 66, 90, pal.tissu, 14);
      s += rect(64, 176, 12, 44, pal.tissu, 6); s += rect(84, 170, 12, 50, pal.tissu, 6); s += rect(104, 176, 12, 44, pal.tissu, 6);
      s += rect(282, 194, 12, 44, pal.tissu, 6); s += rect(302, 188, 12, 50, pal.tissu, 6); s += rect(322, 194, 12, 44, pal.tissu, 6);
      s += poly([[130, 300], [276, 288], [280, 340], [134, 352]], pal.accent);
      s += rect(132, 310, 146, 10, pal.jour);
    }
    return s;
  };

  LIEU.bureau = function (pal, cad, d, r) {
    var s = rect(0, 0, 400, 400, pal.fond);
    if (cad === 'large') {
      s += rect(0, 0, 400, 268, pal.plan);
      s += rect(232, 34, 146, 186, pal.jour); // la fenêtre, un aplat de jour
      for (var i = 0; i < 5; i++) s += rect(232, 46 + i * 38, 146, 8, pal.demi);
      s += rect(0, 268, 400, 26, pal.clair); // le plateau
      s += rect(0, 294, 400, 106, pal.tissu);
      s += rect(46, 306, 96, 82, pal.fond, 3);
      s += poly([[30, 268], [126, 268], [138, 140], [18, 140]], pal.demi); // le fauteuil
      s += rect(20, 120, 118, 32, pal.demi, 8);
      s += rect(168, 240, 62, 28, pal.jour, 2); // l'enveloppe
      s += poly([[168, 240], [199, 258], [230, 240]], pal.demi);
      s += rect(298, 234, 12, 34, pal.accent); // le trophée
      s += rect(286, 262, 36, 8, pal.accent);
      s += poly([[292, 200], [316, 200], [312, 236], [296, 236]], pal.accent);
    } else if (cad === 'moyen') {
      s += rect(0, 0, 400, 232, pal.plan);
      s += poly([[240, 0], [400, 0], [400, 232], [286, 232]], pal.clair);
      s += rect(0, 232, 400, 30, pal.clair);
      s += rect(0, 262, 400, 138, pal.tissu);
      s += rect(52, 176, 128, 62, pal.jour, 3); // l'enveloppe fermée
      s += poly([[52, 176], [116, 216], [180, 176]], pal.demi);
      s += poly([[236, 150], [252, 150], [268, 240], [252, 242]], pal.accent); // le stylo
      s += rect(276, 190, 92, 48, pal.fond, 3);
      s += rect(0, 366, 400, 34, pal.demi);
    } else {
      s += rect(0, 0, 400, 400, pal.tissu);
      s += poly([[0, 0], [214, 0], [138, 400], [0, 400]], pal.clair);
      s += rect(56, 118, 290, 168, pal.jour, 4);
      s += poly([[56, 118], [201, 216], [346, 118]], pal.demi);
      s += rect(96, 300, 210, 16, pal.accent, 8); // le stylo posé
      s += poly([[306, 300], [340, 306], [306, 316]], pal.fond);
    }
    return s;
  };

  LIEU.terrain = function (pal, cad, d, r) {
    var s = rect(0, 0, 400, 400, pal.fond);
    if (cad === 'large') {
      s += rect(0, 0, 400, 132, pal.fond);
      s += poly([[0, 132], [400, 132], [400, 400], [0, 400]], pal.plan);
      s += poly([[0, 132], [400, 132], [400, 232], [0, 262]], pal.clair); // la bande tondue
      s += poly([[0, 300], [400, 276], [400, 336], [0, 364]], pal.clair);
      s += rect(60, 40, 12, 100, pal.demi); // le mât
      s += rect(36, 18, 60, 26, pal.jour, 3);
      s += poly([[36, 44], [96, 44], [190, 400], [-40, 400]], pal.clair); // le cône de lumière
      s += rect(140, 88, 190, 8, pal.jour); // la barre transversale
      s += rect(140, 88, 8, 62, pal.jour); s += rect(322, 88, 8, 62, pal.jour);
      s += poly([[0, 258], [400, 234], [400, 244], [0, 268]], pal.jour); // la ligne
      s += ballon(300, 336, 26, pal, d);
    } else if (cad === 'moyen') {
      s += rect(0, 0, 400, 88, pal.fond);
      s += rect(0, 88, 400, 312, pal.plan);
      s += poly([[0, 88], [400, 88], [400, 190], [0, 214]], pal.clair);
      s += poly([[0, 300], [400, 276], [400, 400], [0, 400]], pal.clair);
      s += poly([[0, 160], [400, 142], [400, 156], [0, 174]], pal.jour);
      s += path('M60,300 A150,72 0 0 1 340,300 L340,314 A150,72 0 0 0 60,314 Z', pal.jour); // l'arc du rond central
      s += ballon(200, 250, 42, pal, d);
      s += circ(110, 344, 9, pal.jour); // le point de penalty
    } else {
      s += rect(0, 0, 400, 400, pal.plan);
      s += poly([[0, 0], [400, 0], [400, 150], [0, 186]], pal.clair);
      s += poly([[0, 244], [400, 214], [400, 400], [0, 400]], pal.demi);
      s += poly([[0, 232], [400, 202], [400, 226], [0, 256]], pal.jour); // la craie, épaisse
      s += ballon(200, 190, 92, pal, d);
      s += poly([[92, 292], [308, 276], [316, 306], [100, 322]], pal.demi); // l'ombre portée
    }
    return s;
  };

  LIEU.car = function (pal, cad, d, r) {
    var s = rect(0, 0, 400, 400, pal.fond);
    if (cad === 'large') {
      s += rect(0, 236, 400, 60, pal.demi);
      s += rect(0, 296, 400, 104, pal.demi);
      s += rect(14, 118, 372, 150, pal.plan, 12); // la carrosserie
      s += rect(14, 118, 372, 26, pal.clair, 12);
      for (var i = 0; i < 5; i++) s += rect(34 + i * 70, 152, 54, 52, pal.demi, 4);
      s += rect(34, 152, 54, 52, pal.jour, 4);
      s += circ(88, 272, 30, pal.poil); s += circ(310, 272, 30, pal.poil);
      s += circ(88, 272, 13, pal.jour); s += circ(310, 272, 13, pal.jour);
      s += rect(0, 60, 400, 6, pal.demi);
      s += circ(340, 44, 20, pal.jour);
    } else if (cad === 'moyen') {
      s += rect(0, 0, 400, 400, pal.tissu);
      s += rect(226, 34, 154, 216, pal.fond, 10); // la vitre
      s += poly([[234, 232], [372, 120], [372, 244]], pal.jour);
      s += circ(268, 84, 13, pal.jour);
      s += poly([[0, 96], [176, 74], [186, 400], [0, 400]], pal.plan); // le dossier
      s += poly([[0, 96], [176, 74], [178, 132], [0, 152]], pal.clair);
      s += rect(30, 40, 116, 62, pal.demi, 10); // l'appuie-tête
      s += rect(226, 250, 154, 18, pal.fond);
    } else {
      s += rect(0, 0, 400, 400, pal.tissu);
      s += rect(40, 30, 320, 300, pal.fond, 16);
      s += poly([[56, 316], [344, 108], [344, 322]], pal.demi);
      s += poly([[56, 250], [344, 60], [344, 108], [56, 300]], pal.accent);
      for (var j = 0; j < 7; j++) s += poly([[80 + j * 40, 60], [92 + j * 40, 60], [72 + j * 40, 300], [60 + j * 40, 300]], pal.demi);
      s += rect(40, 330, 320, 26, pal.fond, 6);
    }
    return s;
  };

  LIEU.buvette = function (pal, cad, d, r) {
    var s = rect(0, 0, 400, 400, pal.fond);
    if (cad === 'large') {
      s += rect(0, 0, 400, 74, pal.plan);
      s += poly([[0, 74], [400, 74], [382, 116], [18, 116]], pal.clair); // l'auvent
      s += rect(0, 116, 400, 158, pal.demi);
      s += rect(0, 274, 400, 30, pal.tissu); // le comptoir
      s += rect(0, 304, 400, 96, pal.fond);
      s += rect(38, 148, 128, 106, pal.poil, 3); // l'ardoise
      s += rect(52, 166, 92, 8, pal.jour); s += rect(52, 190, 64, 8, pal.jour); s += rect(52, 214, 78, 8, pal.jour);
      for (var i = 0; i < 4; i++) {
        s += poly([[218 + i * 40, 232], [246 + i * 40, 232], [242 + i * 40, 274], [222 + i * 40, 274]], pal.demi);
        s += poly([[220 + i * 40, 244], [244 + i * 40, 244], [241 + i * 40, 272], [223 + i * 40, 272]], pal.jour);
      }
      s += rect(292, 226, 76, 48, pal.accent, 4); // la boîte en fer
      s += rect(292, 244, 76, 8, pal.fond);
    } else if (cad === 'moyen') {
      s += rect(0, 0, 400, 236, pal.demi);
      s += poly([[250, 0], [400, 0], [400, 236], [312, 236]], pal.clair);
      s += rect(0, 236, 400, 34, pal.tissu);
      s += rect(0, 270, 400, 130, pal.fond);
      s += rect(30, 130, 148, 106, pal.accent, 5);
      s += rect(30, 164, 148, 12, pal.fond);
      s += rect(80, 112, 48, 20, pal.jour, 4);
      s += poly([[224, 122], [280, 122], [272, 236], [232, 236]], pal.demi);
      s += poly([[226, 150], [278, 150], [271, 234], [233, 234]], pal.jour);
      s += rect(300, 120, 78, 116, pal.poil, 3);
      s += rect(312, 140, 54, 8, pal.jour); s += rect(312, 164, 40, 8, pal.jour);
    } else {
      s += rect(0, 0, 400, 400, pal.fond);
      s += poly([[0, 0], [200, 0], [130, 400], [0, 400]], pal.clair);
      s += rect(46, 108, 308, 200, pal.accent, 8);
      s += rect(46, 108, 308, 48, pal.clair, 8);
      s += rect(46, 190, 308, 14, pal.fond);
      s += rect(96, 218, 128, 56, pal.jour, 3); // les billets
      s += rect(112, 232, 96, 8, pal.demi);
      s += circ(276, 246, 26, pal.accent);
      s += circ(276, 246, 14, pal.demi);
    }
    return s;
  };

  LIEU.presse = function (pal, cad, d, r) {
    var s = rect(0, 0, 400, 400, pal.fond);
    if (cad === 'large') {
      s += rect(0, 0, 400, 288, pal.plan);
      for (var i = 0; i < 4; i++) for (var j = 0; j < 3; j++) {
        s += poly([[36 + i * 106, 40 + j * 84], [60 + i * 106, 52 + j * 84], [60 + i * 106, 80 + j * 84],
          [36 + i * 106, 92 + j * 84], [12 + i * 106, 80 + j * 84], [12 + i * 106, 52 + j * 84]],
          pal.jour);
      }
      s += poly([[0, 0], [130, 0], [70, 288], [0, 288]], pal.clair);
      s += rect(0, 288, 400, 22, pal.clair); // la table
      s += rect(0, 310, 400, 90, pal.tissu);
      for (var k = 0; k < 3; k++) {
        s += rect(96 + k * 104, 216, 10, 74, pal.demi, 5);
        s += circ(101 + k * 104, 208, 17, pal.demi);
        s += rect(88 + k * 104, 240, 26, 18, pal.accent, 3);
      }
      s += rect(30, 322, 118, 34, pal.jour, 2);
    } else if (cad === 'moyen') {
      s += rect(0, 0, 400, 300, pal.plan);
      s += poly([[260, 0], [400, 0], [400, 300], [326, 300]], pal.clair);
      s += rect(0, 300, 400, 26, pal.clair);
      s += rect(0, 326, 400, 74, pal.tissu);
      s += rect(112, 140, 16, 162, pal.demi, 8);
      s += circ(120, 126, 30, pal.demi);
      s += rect(100, 176, 40, 28, pal.accent, 4);
      s += rect(252, 176, 14, 126, pal.demi, 7);
      s += circ(259, 164, 24, pal.demi);
      s += rect(184, 330, 150, 40, pal.jour, 2); // le carton du nom
      s += rect(198, 344, 108, 10, pal.poil);
    } else {
      s += rect(0, 0, 400, 400, pal.plan);
      s += poly([[0, 0], [190, 0], [124, 400], [0, 400]], pal.clair);
      s += circ(200, 168, 110, pal.demi);
      for (var m = 0; m < 7; m++) s += rect(104, 92 + m * 24, 192, 10, pal.demi);
      s += rect(170, 272, 60, 128, pal.demi, 12);
      s += rect(146, 300, 108, 42, pal.accent, 5);
    }
    return s;
  };

  LIEU.maison = function (pal, cad, d, r) {
    var s = rect(0, 0, 400, 400, pal.fond);
    if (cad === 'large') {
      s += rect(0, 0, 400, 276, pal.demi);
      s += rect(240, 30, 132, 168, pal.demi); // la fenêtre, il fait nuit
      s += rect(300, 30, 10, 168, pal.demi);
      s += rect(240, 108, 132, 10, pal.demi);
      s += poly([[52, 60], [126, 60], [154, 126], [24, 126]], pal.jour); // l'abat-jour
      s += rect(86, 126, 6, 60, pal.demi);
      s += poly([[24, 126], [154, 126], [232, 400], [-54, 400]], pal.clair); // le cône
      s += rect(0, 276, 400, 24, pal.plan); // la table
      s += rect(0, 300, 400, 100, pal.demi);
      s += rect(54, 236, 116, 40, pal.jour, 2); // le journal
      s += circ(112, 256, 13, pal.accent);
      s += rect(214, 232, 46, 44, pal.demi, 4); // la tasse
      s += rect(258, 242, 20, 22, pal.demi, 8);
    } else if (cad === 'moyen') {
      s += rect(0, 0, 400, 250, pal.demi);
      s += poly([[0, 0], [180, 0], [268, 250], [0, 250]], pal.clair);
      s += rect(0, 250, 400, 30, pal.plan);
      s += rect(0, 280, 400, 120, pal.demi);
      s += poly([[26, 156], [162, 140], [174, 250], [30, 250]], pal.jour); // le journal ouvert
      s += rect(44, 172, 100, 12, pal.poil);
      s += rect(44, 198, 58, 7, pal.demi);
      s += anneau(circPath(112, 216, 26, 1), circPath(112, 216, 20, -1), pal.accent); // ton nom entouré
      s += rect(252, 178, 76, 72, pal.demi, 5);
      s += rect(328, 196, 26, 34, pal.demi, 10);
      s += rect(266, 194, 48, 10, pal.accent);
    } else {
      s += rect(0, 0, 400, 400, pal.demi);
      s += poly([[0, 0], [206, 0], [140, 400], [0, 400]], pal.jour);
      s += poly([[36, 66], [352, 40], [368, 366], [50, 392]], pal.jour); // la page, plein cadre
      s += rect(66, 96, 246, 24, pal.poil);
      s += rect(66, 146, 150, 12, pal.demi);
      s += rect(66, 176, 180, 12, pal.demi);
      s += rect(66, 206, 120, 12, pal.demi);
      s += anneau(circPath(200, 292, 66, 1), circPath(200, 292, 56, -1), pal.accent);
      s += rect(160, 284, 80, 14, pal.poil);
    }
    return s;
  };

  root.__FA_LIEUX__ = { LIEU: LIEU, CADRAGES: CADRAGES, paletteLieu: paletteLieu, ballon: ballon };
})(typeof window !== 'undefined' ? window : this);

/* ══ 13. LES OBJETS QUI REVIENNENT ══════════════════════════════════════
 * Dessinés dans une boîte 0-100 : les compositions les posent où elles
 * veulent (translate/scale), la galerie les montre seuls. */
(function (root) {
  "use strict";
  var B = root.__FA_BASE__, L = root.__FA_LIEUX__;
  var P = B.PALETTE, poly = B.poly, rect = B.rect, circ = B.circ, path = B.path;
  var grp = B.grp, mix = B.mix, anneau = B.anneau, circPath = B.circPath, rectPath = B.rectPath;

  var OBJET = {
    cahier: function (p) {
      return rect(14, 10, 72, 82, p.jour, 3) + rect(14, 10, 14, 82, p.demi, 3) +
        rect(36, 28, 40, 6, p.poil) + rect(36, 44, 44, 6, p.demi) +
        rect(36, 60, 30, 6, p.demi) + rect(20, 4, 6, 18, p.accent, 3);
    },
    valise: function (p) {
      return rect(10, 30, 80, 58, p.tissu, 5) + rect(10, 52, 80, 8, p.fond) +
        rect(38, 18, 24, 14, p.fond, 4) + rect(42, 22, 16, 6, p.fond, 2) +
        rect(24, 56, 14, 10, p.accent, 2) + rect(62, 56, 14, 10, p.accent, 2);
    },
    sifflet: function (p) {
      return rect(18, 44, 50, 24, p.accent, 8) + circ(72, 56, 15, p.accent) +
        circ(72, 56, 6, p.fond) +
        poly([[18, 46], [10, 22], [16, 20], [26, 44]], p.demi);
    },
    brassard: function (p) {
      return path('M18,34 h64 a6,6 0 0 1 6,6 v20 a6,6 0 0 1 -6,6 h-64 a6,6 0 0 1 -6,-6 v-20 a6,6 0 0 1 6,-6 Z', p.accent) +
        rect(28, 42, 44, 8, p.jour) + rect(28, 56, 26, 6, p.jour);
    },
    echarpe: function (p) {
      return poly([[30, 6], [70, 6], [70, 78], [50, 92], [30, 78]], p.accent) +
        rect(30, 22, 40, 10, p.jour) + rect(30, 44, 40, 10, p.jour) +
        rect(32, 90, 6, 8, p.accent) + rect(46, 92, 6, 8, p.accent) + rect(60, 90, 6, 8, p.accent);
    },
    enveloppe: function (p) {
      return rect(8, 26, 84, 52, p.jour, 2) + poly([[8, 26], [50, 56], [92, 26]], p.demi) +
        poly([[8, 78], [36, 52], [42, 57], [16, 78]], p.demi) +
        poly([[92, 78], [64, 52], [58, 57], [84, 78]], p.demi) +
        rect(60, 62, 26, 10, p.accent);
    },
    craie: function (p) {
      return poly([[22, 78], [58, 18], [72, 26], [36, 86]], p.jour) +
        poly([[22, 78], [36, 86], [16, 92]], p.demi) +
        rect(56, 60, 30, 7, p.demi);
    },
    crampon: function (p) {
      return poly([[6, 56], [40, 50], [62, 34], [80, 32], [92, 46], [92, 66], [6, 72]], p.tissu) +
        poly([[62, 34], [80, 32], [82, 46], [64, 48]], p.demi) +          // la languette
        poly([[26, 54], [56, 44], [58, 52], [28, 62]], p.accent) +        // le laçage
        poly([[4, 68], [94, 62], [94, 78], [4, 84]], p.jour) +            // la semelle
        rect(14, 80, 9, 11, p.poil, 2) + rect(36, 78, 9, 11, p.poil, 2) +
        rect(58, 76, 9, 11, p.poil, 2) + rect(78, 74, 9, 11, p.poil, 2);  // les crampons
    },
    ballon: function (p, d) { return L.ballon(50, 50, 38, p, d); }
  };

  function paletteObjet(d) {
    return {
      fond: '#1B1109', jour: d.c(P.lumiere.jour), poil: '#2A1B0F',
      demi: mix('#1B1109', d.c(P.bois.moyen), 0.7),
      tissu: d.c(P.bois.moyen), accent: d.c(P.maillot.bordeaux)
    };
  }

  /* ══ 14. LES PICTOGRAMMES D'INTERFACE — 24 × 24, monochromes ══════════
   * Le pictogramme EST la jauge : à plat, en crème, sans cadre ni barre.
   * Quatre formes aussi lisibles que la croix, le bonhomme, l'épée et le
   * dollar : le maillot (vestiaire), l'écharpe (tribunes), le fauteuil
   * (président), le billet (caisse). Plus la tête de mort, les triangles
   * de sens, le sablier, le tampon, la flèche, et le nécessaire de menu. */

  var ICONE = {
    vestiaire: 'M8.6 2.2 12 4.4l3.4-2.2 5.4 2.8-1.9 5.3-2.4-1.1V21.8H7.5V9.2l-2.4 1.1L3.2 5Z',
    tribunes: 'M8.4 1.8h7.2l.6 3.4H7.8Zm-.5 4.6h3.4l.5 11.4H7.4Zm5 0h3.4l-.5 11.4h-3.4Zm-4.6 12.6h1.2v3.2H8.3Zm2 0h1.2v3.2h-1.2Zm3.1 0h1.2v3.2h-1.2Zm2.1 0h1.2v3.2h-1.2Z',
    president: 'M5.4 2.4h13.2c1 0 1.8.8 1.8 1.8V11h-1.4a2.6 2.6 0 0 0-2.6 2.6V14H7.6v-.4A2.6 2.6 0 0 0 5 11H3.6V4.2c0-1 .8-1.8 1.8-1.8ZM1.8 11.4h3.4v5.2H1.8Zm17 0h3.4v5.2h-3.4ZM5.2 14.4h13.6v3.2H5.2Zm.8 3.9h2.4v3.3H6Zm10 0h2.4v3.3H16Z',
    caisse: 'M1.8 5.4h20.4v13.2H1.8Zm3.1 3.1v7h14.2v-7Zm7.1.6a2.9 2.9 0 1 1 0 5.8 2.9 2.9 0 0 1 0-5.8Z',
    crane: 'M12 1.8c4.9 0 8.4 3.4 8.4 8.1 0 2.7-1 4.6-2.6 5.9v2.6l-2.2 1.3v2.5h-7.2v-2.5l-2.2-1.3v-2.6c-1.6-1.3-2.6-3.2-2.6-5.9 0-4.7 3.5-8.1 8.4-8.1Zm-3.6 6.6a2.4 2.4 0 0 0 0 4.8 2.4 2.4 0 0 0 0-4.8Zm7.2 0a2.4 2.4 0 0 0 0 4.8 2.4 2.4 0 0 0 0-4.8ZM12 14.2l-1.4 3h2.8Z',
    hausse: 'M12 4.2 21 18.4H3Z',
    baisse: 'M12 19.8 3 5.6h18Z',
    sablier: 'M5 2h14v3.4L13.4 12 19 18.6V22H5v-3.4L10.6 12 5 5.4Zm2.4 2.2v1l4.6 5.4 4.6-5.4v-1Zm0 15.6h9.2v-1L12 13.4 7.4 18.8Z',
    tampon: 'M8.6 2.2h6.8c1.2 0 2.1 1 1.9 2.2l-.8 5.2h1.9c1.4 0 2.5 1.1 2.5 2.5v3.3H3.1v-3.3c0-1.4 1.1-2.5 2.5-2.5h1.9L6.7 4.4c-.2-1.2.7-2.2 1.9-2.2ZM2.6 17.6h18.8v4.2H2.6Z',
    fleche: 'M13 2.6 22.4 12 13 21.4v-5.6H1.6V8.2H13Z',
    menu: 'M3 4.6h18v3H3Zm0 5.9h18v3H3Zm0 5.9h18v3H3Z',
    croix: 'M5.4 3.2 12 9.8l6.6-6.6 2.8 2.8L14.8 12.6l6.6 6.6-2.8 2.8-6.6-6.6-6.6 6.6-2.8-2.8 6.6-6.6L2.6 6Z',
    frise: 'M1.4 14.2h21.2v2.8H1.4ZM3.6 5.4h2.8v8H3.6Zm5.4-3h2.8v11H9Zm5.4 4.4h2.8v6.6h-2.8Zm5.2-2.2h2.6v8.8h-2.6Z',
    ballon: 'M12 1.9a10.1 10.1 0 1 0 0 20.2 10.1 10.1 0 0 0 0-20.2Zm0 3.2 4.4 3.2-1.7 5.2H9.3L7.6 8.3Z',
    sifflet: 'M2.4 8.4h9.4a6 6 0 1 1 0 7.2H2.4Zm12.9 1.2a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8ZM3.6 5.2l1.2-2.6 3.4 1.6-1 2.2Z',
    carte: 'M4.4 2.6h15.2c.9 0 1.6.7 1.6 1.6v15.6c0 .9-.7 1.6-1.6 1.6H4.4c-.9 0-1.6-.7-1.6-1.6V4.2c0-.9.7-1.6 1.6-1.6Zm2 3.2v12.4h11.2V5.8Z',
    horloge: 'M12 1.9a10.1 10.1 0 1 0 0 20.2 10.1 10.1 0 0 0 0-20.2Zm0 3.1c.8 0 1.4.6 1.4 1.4v5.1l3.4 2a1.4 1.4 0 0 1-1.4 2.4l-4.1-2.4c-.4-.3-.7-.7-.7-1.2V6.4c0-.8.6-1.4 1.4-1.4Z',
    tampon_ok: 'M9.6 16.2 4.8 11.4l-2.6 2.6 7.4 7.4L21.8 8 19.2 5.4Z'
  };
  var ALIAS = { direction: 'president', president: 'president', argent: 'caisse', mort: 'crane', up: 'hausse', down: 'baisse' };

  root.__FA_OBJETS__ = { OBJET: OBJET, ICONE: ICONE, ALIAS: ALIAS, paletteObjet: paletteObjet };
})(typeof window !== 'undefined' ? window : this);

/* ══ 15. L'API ══════════════════════════════════════════════════════════ */
(function (root) {
  "use strict";
  var B = root.__FA_BASE__, F = root.__FA_FICHES__, A = root.__FA_PORTRAIT_A__;
  var PR = root.__FA_PORTRAIT__, LX = root.__FA_LIEUX__, OB = root.__FA_OBJETS__;

  var CONTENU = null;

  /// Le bundle compilé enrichit les fiches : genre et camp font foi.
  function init(content) {
    CONTENU = content || null;
    if (!content) return;
    var list = content.characters || [];
    for (var i = 0; i < list.length; i++) {
      var c = list[i], f = F.FICHES[c.id];
      if (!f) continue;
      if (c.genre) f.g = c.genre;
      if (c.camp) f.camp = c.camp;
      if (typeof c.age === 'number') f.an = c.age;
      f.nom = c.name || f.nom;
    }
  }

  function ficheDe(id, spec) {
    if (F.FICHES[id]) return F.FICHES[id];
    return F.ficheDeduite(id, spec);
  }

  function estIncarne(id) {
    return id === 'coach' || id === 'joueur' || id === 'moi' || id === 'toi';
  }

  /// `cad` est écrit dans le SVG (`data-cadrage`) : c'est ce qui permet au
  /// test de rendu de vérifier que soixante cartes ne se ressemblent pas.
  function cadre(corps, uid, opts, cad) {
    var cls = opts && opts.className ? ' class="' + B.esc(opts.className) + '"' : '';
    var titre = opts && opts.alt ? '<title>' + B.esc(opts.alt) + '</title>' : '';
    var a11y = opts && opts.alt ? ' role="img"' : ' aria-hidden="true"';
    return '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet"' +
      cls + a11y + (cad ? ' data-cadrage="' + B.esc(cad) + '"' : '') + '>' + titre +
      '<defs><clipPath id="' + uid + '"><rect x="0" y="0" width="400" height="400" rx="14"/></clipPath></defs>' +
      '<g clip-path="url(#' + uid + ')">' + corps + '</g></svg>';
  }

  /* ── 15.1 LE TIRAGE DU CADRAGE ──────────────────────────────────────────
   * La référence alterne le personnage et l'objet, le gros plan et le plan
   * large. Ici le cadrage est TIRÉ de la graine de la carte — qui porte l'id
   * de la carte et le tour —, donc deux apparitions du même visage à trois
   * cartes d'écart ne donnent pas deux fois la même image.
   *
   * Deux exceptions, et deux seulement : un face à face (`palier`) et une
   * alarme demandent un visage lisible — pas une nuque, pas un ballon.
   */
  var CADRAGES_CARTE = [
    { c: 'buste', p: 0.32 }, { c: 'serre', p: 0.21 }, { c: 'large', p: 0.19 },
    { c: 'dos', p: 0.13 }, { c: 'objet', p: 0.15 }
  ];
  function tirerCadrage(r, spec) {
    var k = spec.kind || '';
    if (k === 'palier' || k === 'alarme') return r() < 0.42 ? 'serre' : 'buste';
    var x = r(), acc = 0;
    for (var i = 0; i < CADRAGES_CARTE.length; i++) {
      acc += CADRAGES_CARTE[i].p;
      if (x < acc) return CADRAGES_CARTE[i].c;
    }
    return 'buste';
  }

  /* ── 15.2 L'OBJET EN PREMIER PLAN ───────────────────────────────────────
   * La carte sans visage : le lieu au fond, un seul objet du football en
   * grand devant, posé sur une arête franche. Le matériau porte la scène —
   * le ballon, l'écharpe, le crampon, la craie, l'enveloppe.
   */
  var OBJET_DE_CAMP = {
    terrain: ['ballon', 'crampon', 'sifflet', 'brassard', 'craie'],
    direction: ['enveloppe', 'valise', 'cahier', 'tampon'],
    instances: ['enveloppe', 'cahier', 'sifflet'],
    selection: ['ballon', 'brassard', 'valise'],
    famille: ['echarpe', 'cahier', 'ballon', 'crampon']
  };
  function premierPlan(lieu, camp, d, r) {
    var pal = LX.paletteLieu(lieu, d) || LX.paletteLieu('vestiaire', d);
    var s = LX.LIEU[lieu](pal, B.pick(r, LX.CADRAGES), d, r);
    // L'arête sur laquelle l'objet est posé : un plan plein, en travers.
    var yg = 252 + Math.round(r() * 26), yd = yg + Math.round((r() - 0.5) * 48);
    s += B.poly([[0, yg], [400, yd], [400, 400], [0, 400]], pal.demi);
    s += B.poly([[0, yg], [400, yd], [400, yd + 7], [0, yg + 7]], pal.jour);

    var noms = OBJET_DE_CAMP[camp] || OBJET_DE_CAMP.terrain;
    var fn = OB.OBJET[B.pick(r, noms)] || OB.OBJET.ballon;
    var p = {
      fond: pal.fond, jour: pal.jour, poil: pal.poil,
      demi: pal.ombre, tissu: pal.tissu, accent: pal.accent
    };
    // L'objet occupe environ la moitié du cadre : au-delà, il cesse d'être un
    // objet et redevient une forme abstraite.
    var sc = 1.85 + r() * 0.55;
    var cx = 200 + (r() - 0.5) * 130;
    var ty = (yg + yd) / 2 - 78 * sc;
    // L'ombre portée : un seul plan, jamais un dégradé.
    s += B.poly([[cx - 52 * sc, (yg + yd) / 2 + 6], [cx + 46 * sc, (yg + yd) / 2 + 6],
      [cx + 78 * sc, (yg + yd) / 2 + 40], [cx - 24 * sc, (yg + yd) / 2 + 40]], pal.poil);
    s += B.grp(fn(p, d), 'translate(' + B.n(cx - 50 * sc) + ',' + B.n(ty) + ') scale(' + B.n(sc) + ')');
    return s;
  }

  /// L'illustration carrée d'une carte. Portrait s'il y a un locuteur, scène
  /// de lieu sinon. Déterministe pour une même spec.
  function scene(spec) {
    spec = spec || {};
    var graine = [spec.seed == null ? '' : spec.seed, spec.speaker || '', spec.expression || '',
      spec.camp || '', spec.genre || '', spec.lieu || '', spec.kind || '', spec.tone || '',
      spec.saison == null ? '' : spec.saison, spec.annee == null ? '' : spec.annee,
      spec.club || ''].join('|');
    var r = B.rngFrom(B.hash32('scene|' + graine));
    var d = B.decade(spec.annee);
    var uid = B.uid();
    var out;

    if (spec.speaker && estIncarne(spec.speaker)) {
      var role = spec.speaker === 'joueur' ? 'joueur' : (spec.role === 'joueur' ? 'joueur' : 'coach');
      out = PR.incarne(role, spec.genre || 'm', d, r, spec);
      return cadre(out.svg, uid, spec, 'incarne');
    }
    if (spec.speaker) {
      var f = ficheDe(spec.speaker, spec);
      var lieu = A.lieuValide(spec.lieu) || A.lieuValide(f.lieu) ||
        A.LIEU_DE_CAMP[spec.camp || f.camp] || 'vestiaire';
      var cad = spec.cadrage && (spec.cadrage === 'objet' || PR.CADRAGES_PORTRAIT.indexOf(spec.cadrage) >= 0)
        ? spec.cadrage : tirerCadrage(r, spec);
      if (cad === 'objet') return cadre(premierPlan(lieu, spec.camp || f.camp || 'terrain', d, r), uid, spec, 'objet');
      out = PR.portrait(f, spec.expression, lieu, d, r, spec, cad);
      return cadre(out.svg, uid, spec, out.cadrage || cad);
    }
    // Pas de locuteur : une scène de lieu.
    var l = A.lieuValide(spec.lieu) || A.LIEU_DE_CAMP[spec.camp] || B.pick(r, A.LIEUX);
    var cad = spec.cadrage && LX.CADRAGES.indexOf(spec.cadrage) >= 0 ? spec.cadrage : B.pick(r, LX.CADRAGES);
    var pal = LX.paletteLieu(l, d);
    return cadre(LX.LIEU[l](pal, cad, d, r), uid, spec, 'lieu-' + cad);
  }

  /// Un objet du monde, seul dans le cadre (le cahier, la valise, le sifflet…).
  function objet(nom, opts) {
    opts = opts || {};
    var d = B.decade(opts.annee);
    var p = OB.paletteObjet(d);
    var fn = OB.OBJET[nom];
    if (!fn) return '';
    var uid = B.uid();
    var corps = B.rect(0, 0, 400, 400, p.fond) +
      B.poly([[0, 0], [150, 0], [82, 400], [0, 400]], p.demi) +
      B.grp(fn(p, d), 'translate(60,60) scale(2.8)');
    return cadre(corps, uid, opts);
  }

  /// Un pictogramme d'interface : 24 × 24, monochrome, sans cadre ni barre.
  /// Le picto EST la jauge ; la couleur vient de `currentColor`.
  function icon(name, opts) {
    opts = opts || {};
    var key = OB.ALIAS[name] || name;
    var d = OB.ICONE[key];
    if (!d) return '';
    var size = opts.size || 24;
    var cls = opts.className ? ' class="' + B.esc(opts.className) + '"' : '';
    var titre = opts.alt ? '<title>' + B.esc(opts.alt) + '</title>' : '';
    var a11y = opts.alt ? ' role="img"' : ' aria-hidden="true"';
    return '<svg viewBox="0 0 24 24" width="' + B.n(size) + '" height="' + B.n(size) +
      '" xmlns="http://www.w3.org/2000/svg"' + cls + a11y + '>' + titre +
      '<path d="' + d + '" fill="' + (opts.fill || 'currentColor') + '"/></svg>';
  }

  /// **Le pictogramme EST la jauge.** La MÊME silhouette deux fois : éteinte
  /// en fond (crème à 25 %), pleine par-dessus, rognée par le bas à la hauteur
  /// de la valeur. On lit un NIVEAU — un maillot rempli aux deux tiers, une
  /// écharpe remplie au ras — et non une luminosité, qui ne distinguait pas
  /// 50 de 52 et rendait les quatre pictos décoratifs. Rien n'est ajouté :
  /// pas de cadre, pas de barre, pas de contour. Juste une arête franche.
  ///
  /// Le remplissage se cale sur l'ENCRE de chaque pictogramme, pas sur la
  /// boîte de 24 : le billet ne vit qu'entre y = 5,4 et 18,6, et sans cette
  /// table une caisse à 30 n'aurait montré qu'un liseré. v = 0 ne remplit
  /// rien, v = 1 remplit tout, et le milieu tombe au milieu de la forme.
  var BANDE = {
    vestiaire: [2.2, 21.8], tribunes: [1.8, 22.2], president: [2.4, 21.6],
    caisse: [5.4, 18.6], ballon: [1.9, 22.1], crane: [1.8, 21.9]
  };
  function jauge(name, opts) {
    opts = opts || {};
    var key = OB.ALIAS[name] || name;
    var dd = OB.ICONE[key];
    if (!dd) return '';
    var size = opts.size || 34;
    var v = opts.value == null ? 1 : opts.value;
    v = v < 0 ? 0 : v > 1 ? 1 : v;
    var bande = BANDE[key] || [1.8, 22.2];
    var y = bande[1] - (bande[1] - bande[0]) * v;
    var uid = B.uid();
    var titre = opts.alt ? '<title>' + B.esc(opts.alt) + '</title>' : '';
    var a11y = opts.alt ? ' role="img"' : ' aria-hidden="true"';
    return '<svg viewBox="0 0 24 24" width="' + B.n(size) + '" height="' + B.n(size) +
      '" xmlns="http://www.w3.org/2000/svg"' + a11y + '>' + titre +
      '<defs><clipPath id="' + uid + '"><rect x="0" y="' + B.n(y) + '" width="24" height="' + B.n(24 - y) + '"/></clipPath></defs>' +
      '<path d="' + dd + '" fill="currentColor" opacity="0.25"/>' +
      '<g clip-path="url(#' + uid + ')"><path d="' + dd + '" fill="currentColor"/></g></svg>';
  }

  /// **L'enseigne du titre** : la seule image de l'écran d'accueil. Le rond
  /// central, la ligne médiane, le ballon posé au point d'engagement — de la
  /// craie sur de la terre battue. Palette d'interface stricte : brun, crème,
  /// un unique trait framboise. Le vert de la pelouse vit dans les cartes ;
  /// il n'éclaire jamais l'interface.
  function enseigne(opts) {
    opts = opts || {};
    var P = B.PALETTE.interface;
    var W = 400, H = 144, cx = 200, cy = 74, cr = P.creme;
    var s = B.rect(0, 0, W, H, opts.fond || P.fond);
    // La terre, d'un ton au-dessus du fond : le terrain existe sans s'éclairer.
    s += B.rect(0, 12, W, H - 12, P.fond2);
    // Les lignes : la médiane, le rond central, le point d'engagement.
    s += B.rect(0, cy - 3, W, 6, cr);
    s += B.anneau(B.circPath(cx, cy, 52, 1), B.circPath(cx, cy, 46, -1), cr);
    // Les deux surfaces, coupées par les bords : deux angles francs.
    s += B.poly([[0, 12], [104, 12], [104, 18], [6, 18], [6, H], [0, H]], cr);
    s += B.poly([[W, 12], [W - 104, 12], [W - 104, 18], [W - 6, 18], [W - 6, H], [W, H]], cr);
    // Le ballon à panneaux, posé sur le point : l'objet-signature.
    var r0 = 28;
    s += B.circ(cx, cy, r0, cr);
    s += B.poly([[cx, cy - r0 * 0.60], [cx + r0 * 0.57, cy - r0 * 0.19], [cx + r0 * 0.35, cy + r0 * 0.49],
      [cx - r0 * 0.35, cy + r0 * 0.49], [cx - r0 * 0.57, cy - r0 * 0.19]], P.fond);
    for (var i = 0; i < 5; i++) {
      var a = -Math.PI / 2 + i * (2 * Math.PI / 5);
      var bx = cx + Math.cos(a) * r0 * 0.92, by = cy + Math.sin(a) * r0 * 0.92;
      s += B.poly([
        [bx + Math.cos(a - 1.1) * r0 * 0.3, by + Math.sin(a - 1.1) * r0 * 0.3],
        [bx + Math.cos(a + 1.1) * r0 * 0.3, by + Math.sin(a + 1.1) * r0 * 0.3],
        [bx + Math.cos(a) * r0 * 0.34, by + Math.sin(a) * r0 * 0.34]], P.fond);
    }
    // L'unique accent : le fanion de corner.
    s += B.rect(26, H - 56, 6, 50, cr);
    s += B.poly([[32, H - 56], [60, H - 48], [32, H - 40]], P.framboise);
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" xmlns="http://www.w3.org/2000/svg" ' +
      'preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + s + '</svg>';
  }

  /// Les chiffres du bandeau : sept segments, l'esprit du tableau d'affichage.
  function nombre(txt, opts) {
    opts = opts || {};
    var h = opts.height || 40, w = String(txt).length * (h * 0.76);
    return '<svg viewBox="0 0 ' + B.n(w) + ' ' + B.n(h) + '" width="' + B.n(w) + '" height="' + B.n(h) +
      '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      B.chiffres(txt, w / 2, 0, h, opts.fill || 'currentColor') + '</svg>';
  }

  var API = {
    init: init,
    scene: scene,
    icon: icon,
    jauge: jauge,
    enseigne: enseigne,
    objet: objet,
    nombre: nombre,
    decade: B.decade,
    palette: B.PALETTE,
    // Pour la page de contrôle uniquement : la liste de ce qui est dessinable.
    fiches: function () { return F.FICHES; },
    lieux: function () { return A.LIEUX.slice(); },
    cadrages: function () { return LX.CADRAGES.slice(); },
    // Les cinq familles de cadrage d'une carte à personnage.
    cadragesCarte: function () { return ['buste', 'serre', 'large', 'dos', 'objet']; },
    objets: function () { return Object.keys(OB.OBJET); },
    icones: function () { return Object.keys(OB.ICONE); },
    expressions: ['sourire', 'neutre', 'noir'],
    version: B.VERSION
  };

  root.FusibleArt = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  try {
    delete root.__FA_BASE__; delete root.__FA_FICHES__; delete root.__FA_PORTRAIT_A__;
    delete root.__FA_PORTRAIT_B__; delete root.__FA_PORTRAIT__; delete root.__FA_LIEUX__;
    delete root.__FA_OBJETS__;
  } catch (e) { /* environnements sans delete sur le global : sans conséquence */ }
})(typeof window !== 'undefined' ? window : this);
