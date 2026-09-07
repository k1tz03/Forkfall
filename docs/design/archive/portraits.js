/* FusiblePortraits — bustes « paper doll » des personnages (aplats, contour encre 2 px).
 *
 * API (contrat stable, utilisée par preview_template.html et portraits_gallery.html) :
 *   FusiblePortraits.init(portraits)  // la table content.portraits (content/portraits.yaml compilée), peut être vide
 *   FusiblePortraits.svg(id, expression, opts) → string  // balise <svg viewBox="0 0 200 240" …> complète
 *     id         : identifiant du personnage (characters.yaml) ou 'coach' / 'joueur' pour toi
 *     expression : 'sourire' | 'neutre' | 'noir'
 *     opts       : { camp?: 'terrain'|'direction'|'instances'|'selection', genre?: 'm'|'f', className?: string }
 *   FusiblePortraits.traits(id, opts) → fiche résolue (utile pour la page de contrôle)
 *
 * Le dessin est une liste d'opérations (chemins SVG absolus, ellipses, cercles,
 * rectangles, groupes découpés) composée en couches dans un ordre fixe :
 *   corps / tenue → cou → oreilles → cheveux arrière → tête → cheveux avant
 *   → pilosité → yeux / sourcils / bouche (expression) → lunettes → accessoire.
 * app/lib/ui/widgets/portrait.dart reproduit exactement les mêmes chemins et
 * le même ordre : toute retouche ici se reporte là-bas (et réciproquement).
 *
 * Sans fiche, les traits sont déduits d'un hachage de l'id (fonction pure,
 * générateur mulberry32) ; le rendu est donc déterministe des deux côtés.
 * Aucune dépendance ; tout est généré ici et les attributs sont échappés. */
(function (root) {
  "use strict";

  var INK = '#1E1A14';
  var INK2 = '#4A423A';
  var CREME = '#EFE4C6';
  var BLANC = '#FCFAF3';
  var ALU = '#C9CBC4';
  var OR = '#D9B85A';

  // Palettes nommées (base, ombre plate).
  var SKIN = {
    porcelaine: ['#F3DCC6', '#E2C0A4'],
    clair: ['#E8B995', '#D19A73'],
    dore: ['#D9A46E', '#BE874F'],
    olive: ['#C4915E', '#A87540'],
    brun: ['#9C6642', '#7E4E2F'],
    ebene: ['#6B4228', '#50301B']
  };
  var HAIR = {
    noir: '#241C18', brun: '#3A2A1E', chatain: '#6B4A2E', roux: '#A8502A',
    blond: '#D8B36A', gris: '#B9B4A8', blanc: '#ECE7DC'
  };
  var CLOTH = {
    bordeaux: ['#93283A', '#6E1F2F'], marine: ['#243A6B', '#182A50'], anthracite: ['#3B3F47', '#2A2D33'],
    noir: ['#26262A', '#141416'], pelouse: ['#1F5A32', '#123D22'], creme: ['#EFE4C6', '#D6C79E'],
    blanc: ['#FCFAF3', '#DDD6C4'], gris: ['#8E9096', '#6C6E74'], bleu: ['#2E6DB4', '#20508A'],
    ciel: ['#8DB8E0', '#6A98C4'], orange: ['#E07A17', '#B65F0E'], rouge: ['#C8262C', '#8C161B'],
    camel: ['#B98A4E', '#946A36'], violet: ['#7A4DAF', '#5B3689'], beige: ['#D9C9A6', '#B8A67E'],
    bouteille: ['#2F5C3E', '#1E4029'], jaune: ['#E3C04A', '#C19E2E'], rose: ['#E48BB0', '#C4658C'],
    prune: ['#5E2A4E', '#421B37']
  };

  var ENUM = {
    teint: ['porcelaine', 'clair', 'dore', 'olive', 'brun', 'ebene'],
    corpulence: ['fin', 'moyen', 'large'],
    age: ['jeune', 'mur', 'age'],
    coiffure: ['chauve', 'degarni', 'court', 'brosse', 'meche', 'mulet', 'boucle', 'carre', 'chignon', 'queue', 'long', 'casquette'],
    cheveux: ['noir', 'brun', 'chatain', 'roux', 'blond', 'gris', 'blanc'],
    pilosite: ['rase', 'moustache', 'barbe', 'bouc'],
    lunettes: ['aucune', 'rondes', 'carrees', 'aviateur'],
    tenue: ['costume', 'tailleur', 'chemise', 'survetement', 'maillot', 'gardien', 'blouse', 'pull', 'doudoune', 'veste'],
    couleur: Object.keys(CLOTH),
    accessoire: ['aucun', 'echarpe', 'chewing_gum', 'stylo', 'carnet', 'brassard', 'sifflet', 'micro', 'stethoscope', 'badge', 'journal', 'telephone', 'montre']
  };

  var table = {};
  var uid = 0;

  function init(p) { table = p || {}; }

  // ── Hachage déterministe (sans fiche) ──────────────────────────────────────
  function hash32(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h >>> 0;
  }
  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function pick(rnd, list) { return list[Math.floor(rnd() * list.length) % list.length]; }

  function guess(id, genre) {
    var rnd = mulberry32(hash32(id));
    var t = {
      teint: pick(rnd, ENUM.teint),
      corpulence: pick(rnd, ENUM.corpulence),
      age: pick(rnd, ENUM.age),
      coiffure: pick(rnd, genre === 'f' ? ['carre', 'chignon', 'queue', 'long', 'court', 'boucle'] : ['court', 'brosse', 'meche', 'degarni', 'chauve', 'mulet', 'boucle', 'casquette']),
      cheveux: pick(rnd, ENUM.cheveux),
      pilosite: genre === 'f' ? 'rase' : pick(rnd, ENUM.pilosite),
      lunettes: pick(rnd, ['aucune', 'aucune', 'rondes', 'carrees', 'aviateur']),
      tenue: pick(rnd, ENUM.tenue),
      couleur: pick(rnd, ENUM.couleur),
      couleur2: pick(rnd, ENUM.couleur),
      coiffe: pick(rnd, ENUM.couleur),
      accessoire: pick(rnd, ENUM.accessoire),
      couleur_accessoire: pick(rnd, ENUM.couleur)
    };
    if (t.age === 'age') t.cheveux = rnd() < 0.5 ? 'gris' : 'blanc';
    return t;
  }

  // Fiche résolue : la table, les valeurs par défaut, le genre de l'appelant.
  function traits(id, opts) {
    opts = opts || {};
    var raw = table && table[id] ? table[id] : null;
    var genre = opts.genre || (raw && raw.genre) || 'm';
    var t = raw ? {} : guess(id, genre);
    if (raw) for (var k in raw) if (Object.prototype.hasOwnProperty.call(raw, k)) t[k] = raw[k];
    t.genre = genre;
    if (genre === 'f' && t.coiffure_f) t.coiffure = t.coiffure_f;
    function ok(key, def) { if (ENUM[key].indexOf(t[key]) < 0) t[key] = def; }
    ok('teint', 'clair'); ok('corpulence', 'moyen'); ok('age', 'mur'); ok('coiffure', 'court');
    ok('cheveux', 'brun'); ok('pilosite', 'rase'); ok('lunettes', 'aucune'); ok('tenue', 'pull');
    ok('couleur', 'marine'); ok('accessoire', 'aucun');
    if (!CLOTH[t.couleur2]) t.couleur2 = defaultCouleur2(t);
    if (!CLOTH[t.coiffe]) t.coiffe = t.couleur;
    if (!CLOTH[t.couleur_accessoire]) t.couleur_accessoire = 'pelouse';
    return t;
  }
  function defaultCouleur2(t) {
    switch (t.tenue) {
      case 'costume': return 'rouge';
      case 'maillot': case 'gardien': return 'pelouse';
      case 'blouse': return 'bleu';
      case 'tailleur': case 'veste': return 'creme';
      default: return 'creme';
    }
  }

  // ── Opérations de dessin ───────────────────────────────────────────────────
  // p : chemin ; e : ellipse ; c : cercle ; r : rectangle ; g : groupe découpé par un chemin.
  // f = remplissage (null → aucun), s = trait (undefined → encre 2 px ; null → aucun), w = épaisseur, o = opacité.
  function P(d, f, s, w, o) { return { k: 'p', d: d, f: f, s: s, w: w, o: o }; }
  function E(cx, cy, rx, ry, f, s, w) { return { k: 'e', cx: cx, cy: cy, rx: rx, ry: ry, f: f, s: s, w: w }; }
  function C(cx, cy, r, f, s, w) { return { k: 'c', cx: cx, cy: cy, r: r, f: f, s: s, w: w }; }
  function RECT(x, y, w, h, rx, f, s, sw) { return { k: 'r', x: x, y: y, w: w, h: h, rx: rx, f: f, s: s, sw: sw }; }
  function G(clip, ops) { return { k: 'g', clip: clip, ops: ops }; }

  // ── Géométrie ──────────────────────────────────────────────────────────────
  function metrics(t) {
    var c = t.corpulence;
    var hw = c === 'fin' ? 38 : (c === 'large' ? 47 : 42);   // demi-largeur de la tête
    var sx = c === 'fin' ? 10 : (c === 'large' ? -8 : 0);    // retrait des épaules
    var nw = c === 'fin' ? 16 : (c === 'large' ? 21 : 18);   // demi-largeur du cou
    var jaw = t.genre === 'f' ? 4 : 0;                       // mâchoire plus fine
    return { hw: hw, sx: sx, nw: nw, jaw: jaw, L: 100 - hw, R: 100 + hw };
  }

  function bodyPath(m) {
    var sx = m.sx, h = sx / 2;
    return 'M' + (14 + sx) + ' 240 C' + (18 + sx) + ' 190 ' + (50 + h) + ' 170 82 164 L118 164 C' + (150 - h) + ' 170 ' + (182 - sx) + ' 190 ' + (186 - sx) + ' 240 Z';
  }
  function headPath(m) {
    var L = m.L, R = m.R, j = m.jaw;
    return 'M' + L + ' 70 C' + L + ' 38 ' + (L + 20) + ' 22 100 22 C' + (R - 20) + ' 22 ' + R + ' 38 ' + R + ' 70 L' + R + ' 100 C' + R + ' 128 ' + (R - 20 - j) + ' 146 100 146 C' + (L + 20 + j) + ' 146 ' + L + ' 128 ' + L + ' 100 Z';
  }
  function lapel(m, side, fill) { // side = -1 gauche, +1 droite ; pan de veste replié
    var nw = m.nw, x = 100 + side * nw;
    return P('M' + x + ' 164 C' + (x + side * 12) + ' 176 ' + (x + side * 16) + ' 200 ' + (x + side * 14) + ' 240 L100 240 L100 214 Z', fill);
  }
  function collarPoints(m, fill) { // pointes de col de chemise
    var nw = m.nw, L = 100 - nw, R = 100 + nw;
    return [P('M' + L + ' 164 L' + (L + 4) + ' 186 L100 178 Z', fill), P('M' + R + ' 164 L' + (R - 4) + ' 186 L100 178 Z', fill)];
  }

  // Tenue : { under: avant le cou, over: après le cou }.
  function garment(t, m) {
    var col = CLOTH[t.couleur], col2 = CLOTH[t.couleur2], skin = SKIN[t.teint];
    var nw = m.nw, sx = m.sx, L = 100 - nw, R = 100 + nw;
    var body = bodyPath(m);
    var under = [], over = [];
    switch (t.tenue) {
      case 'costume':
        under.push(P(body, col[0]));
        under.push(P('M' + L + ' 164 L100 214 L' + R + ' 164 Z', BLANC));
        under.push(lapel(m, -1, col[1]), lapel(m, 1, col[1]));
        under.push(P('M96 178 L104 178 L110 220 L100 232 L90 220 Z', col2[0]));
        under.push(P('M94 172 L106 172 L104 180 L96 180 Z', col2[0]));
        over = collarPoints(m, BLANC);
        break;
      case 'tailleur':
        under.push(P(body, col[0]));
        under.push(P('M' + L + ' 164 L100 214 L' + R + ' 164 Z', col2[0]));
        under.push(lapel(m, -1, col[1]), lapel(m, 1, col[1]));
        under.push(C(100 - nw - 18, 196, 5, OR, null));
        break;
      case 'veste':
        under.push(P(body, col[0]));
        under.push(P('M' + L + ' 164 L100 214 L' + R + ' 164 Z', col2[0]));
        under.push(lapel(m, -1, col[1]), lapel(m, 1, col[1]));
        break;
      case 'chemise':
        under.push(P(body, col[0]));
        under.push(P('M' + L + ' 164 L100 196 L' + R + ' 164 Z', skin[0]));
        under.push(P('M100 196 L100 240', null, INK, 1.5));
        under.push(P('M' + L + ' 164 L' + (L - 6) + ' 192 L98 186 Z', col[0]), P('M' + R + ' 164 L' + (R + 6) + ' 192 L102 186 Z', col[0]));
        break;
      case 'survetement':
        under.push(P(body, col[0]));
        under.push(P('M' + (46 + sx) + ' 184 L74 167 M' + (54 + sx) + ' 194 L80 174 M' + (154 - sx) + ' 184 L126 167 M' + (146 - sx) + ' 194 L120 174', null, CREME, 4));
        under.push(P('M' + (L - 4) + ' 162 L100 202 L' + (R + 4) + ' 162 Z', CREME));
        under.push(P('M100 202 L100 240', null, INK, 2.5));
        break;
      case 'maillot':
        under.push(P(body, col[0]));
        under.push(G(body, [RECT(40 + sx, 150, 16, 90, 0, col2[0], null), RECT(144 - sx, 150, 16, 90, 0, col2[0], null)]));
        under.push(P(body, null));
        under.push(P('M' + (L - 6) + ' 162 L100 196 L' + (R + 6) + ' 162 L' + R + ' 164 L100 184 L' + L + ' 164 Z', col2[0]));
        break;
      case 'gardien':
        under.push(P(body, col[0]));
        under.push(P('M' + (L - 8) + ' 164 C' + (L - 8) + ' 190 ' + (R + 8) + ' 190 ' + (R + 8) + ' 164 Z', col2[0]));
        under.push(P('M100 182 L100 240', null, INK, 1.5));
        [-1, 1].forEach(function (side) {
          var x0 = side < 0 ? 18 + sx : 134 - sx;
          for (var i = 0; i < 4; i++) under.push(RECT(x0 + 2 + i * 12, 182, 10, 26, 5, col2[0]));
          under.push(RECT(x0, 200, 48, 40, 8, col2[0]));
          under.push(RECT(side < 0 ? x0 + 44 : x0 - 6, 206, 12, 22, 6, col2[0]));
          under.push(P('M' + (x0 + 6) + ' 222 L' + (x0 + 42) + ' 222', null, INK, 1.5));
        });
        break;
      case 'blouse':
        under.push(P(body, col2[0]));
        under.push(lapel(m, -1, col[0]), lapel(m, 1, col[0]));
        under.push(P('M' + L + ' 164 L100 214 L' + R + ' 164 Z', col2[0]));
        under.push(P('M' + (14 + sx) + ' 240 C' + (18 + sx) + ' 190 ' + (50 + sx / 2) + ' 170 82 164 L' + L + ' 164 C' + (L - 12) + ' 176 ' + (L - 16) + ' 200 ' + (L - 14) + ' 240 Z', col[0]));
        under.push(P('M' + (186 - sx) + ' 240 C' + (182 - sx) + ' 190 ' + (150 - sx / 2) + ' 170 118 164 L' + R + ' 164 C' + (R + 12) + ' 176 ' + (R + 16) + ' 200 ' + (R + 14) + ' 240 Z', col[0]));
        under.push(RECT(28 + sx, 206, 26, 22, 2, null, INK, 1.5));
        over = collarPoints(m, col[0]);
        break;
      case 'pull':
        under.push(P(body, col[0]));
        under.push(E(100, 170, nw + 8, 12, col[1]));
        over.push(P('M' + (L - 8) + ' 170 C' + (L - 8) + ' 186 ' + (R + 8) + ' 186 ' + (R + 8) + ' 170 L' + (R + 4) + ' 170 C' + (R + 4) + ' 180 ' + (L - 4) + ' 180 ' + (L - 4) + ' 170 Z', col[1]));
        break;
      case 'doudoune':
        under.push(P(body, col[0]));
        under.push(G(body, [P('M0 192 L200 192 M0 210 L200 210 M0 228 L200 228', null, INK, 1.5)]));
        under.push(P(body, null));
        under.push(P('M100 176 L100 240', null, INK, 2.5));
        over.push(RECT(L - 12, 152, 2 * nw + 24, 26, 6, col[0]));
        break;
    }
    return { under: under, over: over };
  }

  // Cheveux : { back: avant la tête, front: après la tête }.
  function hair(t, m) {
    var L = m.L, R = m.R, hc = HAIR[t.cheveux];
    var back = [], front = [];
    var court = 'M' + L + ' 74 C' + L + ' 40 ' + (L + 18) + ' 20 100 20 C' + (R - 18) + ' 20 ' + R + ' 40 ' + R + ' 74 C' + (R - 10) + ' 60 ' + (R - 22) + ' 54 100 54 C' + (L + 22) + ' 54 ' + (L + 10) + ' 60 ' + L + ' 74 Z';
    var tire = 'M' + L + ' 74 C' + L + ' 40 ' + (L + 18) + ' 20 100 20 C' + (R - 18) + ' 20 ' + R + ' 40 ' + R + ' 74 C' + (R - 10) + ' 62 ' + (R - 22) + ' 56 100 56 C' + (L + 22) + ' 56 ' + (L + 10) + ' 62 ' + L + ' 74 Z';
    var frange = 'M' + L + ' 76 C' + L + ' 40 ' + (L + 18) + ' 22 100 22 C' + (R - 18) + ' 22 ' + R + ' 40 ' + R + ' 76 C' + (R - 12) + ' 64 ' + (R - 24) + ' 58 100 58 C' + (L + 24) + ' 58 ' + (L + 12) + ' 64 ' + L + ' 76 Z';
    switch (t.coiffure) {
      case 'chauve':
        break;
      case 'degarni':
        front.push(P('M' + L + ' 78 C' + (L - 2) + ' 62 ' + (L + 4) + ' 48 ' + (L + 14) + ' 40 C' + (L + 10) + ' 54 ' + (L + 10) + ' 66 ' + (L + 10) + ' 84 Z', hc));
        front.push(P('M' + R + ' 78 C' + (R + 2) + ' 62 ' + (R - 4) + ' 48 ' + (R - 14) + ' 40 C' + (R - 10) + ' 54 ' + (R - 10) + ' 66 ' + (R - 10) + ' 84 Z', hc));
        break;
      case 'court':
        front.push(P(court, hc));
        break;
      case 'brosse':
        front.push(P('M' + (L + 2) + ' 68 L' + (L + 2) + ' 32 L' + (R - 2) + ' 32 L' + (R - 2) + ' 68 C' + (R - 10) + ' 58 ' + (R - 22) + ' 54 100 54 C' + (L + 22) + ' 54 ' + (L + 10) + ' 58 ' + (L + 2) + ' 68 Z', hc));
        break;
      case 'meche':
        front.push(P(court, hc));
        front.push(P('M' + L + ' 76 C' + (L + 4) + ' 58 ' + (L + 30) + ' 48 ' + (R - 6) + ' 70 C' + (R - 12) + ' 56 ' + (R - 30) + ' 44 ' + (L + 20) + ' 48 C' + (L + 6) + ' 54 ' + L + ' 64 ' + L + ' 76 Z', hc));
        break;
      case 'mulet':
        back.push(P('M' + (L - 4) + ' 80 C' + (L - 10) + ' 110 ' + (L - 6) + ' 140 ' + (L + 4) + ' 176 L' + (R - 4) + ' 176 C' + (R + 6) + ' 140 ' + (R + 10) + ' 110 ' + (R + 4) + ' 80 Z', hc));
        front.push(P(court, hc));
        break;
      case 'boucle':
        for (var i = 0; i <= 6; i++) {
          var a = Math.PI + i * Math.PI / 6;
          front.push(C(Math.round(100 + (m.hw + 2) * Math.cos(a)), Math.round(76 + 52 * Math.sin(a)), 13, hc));
        }
        front.push(C(L - 4, 92, 12, hc), C(R + 4, 92, 12, hc));
        front.push(P('M' + (L - 2) + ' 80 C' + (L - 2) + ' 30 ' + (L + 16) + ' 18 100 18 C' + (R - 16) + ' 18 ' + (R + 2) + ' 30 ' + (R + 2) + ' 80 C' + (R - 8) + ' 66 ' + (R - 22) + ' 60 100 60 C' + (L + 22) + ' 60 ' + (L + 8) + ' 66 ' + (L - 2) + ' 80 Z', hc, null));
        front.push(P('M' + (L - 2) + ' 80 C' + (L + 8) + ' 66 ' + (L + 22) + ' 60 100 60 C' + (R - 22) + ' 60 ' + (R - 8) + ' 66 ' + (R + 2) + ' 80', null));
        break;
      case 'carre':
        back.push(P('M' + (L - 6) + ' 60 C' + (L - 6) + ' 30 ' + (L + 14) + ' 18 100 18 C' + (R - 14) + ' 18 ' + (R + 6) + ' 30 ' + (R + 6) + ' 60 L' + (R + 8) + ' 150 C' + (R + 8) + ' 156 ' + R + ' 158 ' + (R - 4) + ' 158 L' + (L + 4) + ' 158 C' + L + ' 158 ' + (L - 8) + ' 156 ' + (L - 8) + ' 150 Z', hc));
        front.push(P(frange, hc));
        front.push(P('M' + L + ' 70 C' + (L - 8) + ' 100 ' + (L - 8) + ' 130 ' + (L - 8) + ' 150 L' + (L + 10) + ' 150 C' + (L + 8) + ' 120 ' + (L + 6) + ' 96 ' + L + ' 70 Z', hc));
        front.push(P('M' + R + ' 70 C' + (R + 8) + ' 100 ' + (R + 8) + ' 130 ' + (R + 8) + ' 150 L' + (R - 10) + ' 150 C' + (R - 8) + ' 120 ' + (R - 6) + ' 96 ' + R + ' 70 Z', hc));
        break;
      case 'chignon':
        back.push(C(100, 26, 17, hc));
        front.push(P(tire, hc));
        break;
      case 'queue':
        back.push(P('M' + (R - 10) + ' 60 C' + (R + 16) + ' 84 ' + (R + 18) + ' 130 ' + (R + 6) + ' 176 L' + (R - 10) + ' 176 C' + (R - 2) + ' 130 ' + (R - 2) + ' 96 ' + (R - 16) + ' 68 Z', hc));
        front.push(P(tire, hc));
        break;
      case 'long':
        back.push(P('M' + (L - 6) + ' 64 C' + (L - 14) + ' 110 ' + (L - 14) + ' 170 ' + (L - 6) + ' 220 L' + (R + 6) + ' 220 C' + (R + 14) + ' 170 ' + (R + 14) + ' 110 ' + (R + 6) + ' 64 C' + (R + 6) + ' 30 ' + (R - 14) + ' 18 100 18 C' + (L + 14) + ' 18 ' + (L - 6) + ' 30 ' + (L - 6) + ' 64 Z', hc));
        front.push(P(frange, hc));
        front.push(P('M' + L + ' 70 C' + (L - 10) + ' 110 ' + (L - 12) + ' 160 ' + (L - 8) + ' 200 L' + (L + 8) + ' 200 C' + (L + 8) + ' 150 ' + (L + 6) + ' 100 ' + L + ' 70 Z', hc));
        front.push(P('M' + R + ' 70 C' + (R + 10) + ' 110 ' + (R + 12) + ' 160 ' + (R + 8) + ' 200 L' + (R - 8) + ' 200 C' + (R - 8) + ' 150 ' + (R - 6) + ' 100 ' + R + ' 70 Z', hc));
        break;
      case 'casquette':
        var cap = CLOTH[t.coiffe];
        front.push(P('M' + L + ' 78 C' + (L - 2) + ' 66 ' + (L + 2) + ' 56 ' + (L + 10) + ' 50 C' + (L + 10) + ' 62 ' + (L + 10) + ' 72 ' + (L + 10) + ' 84 Z', hc));
        front.push(P('M' + R + ' 78 C' + (R + 2) + ' 66 ' + (R - 2) + ' 56 ' + (R - 10) + ' 50 C' + (R - 10) + ' 62 ' + (R - 10) + ' 72 ' + (R - 10) + ' 84 Z', hc));
        front.push(P('M' + (L - 4) + ' 58 C' + (L - 4) + ' 24 ' + (L + 16) + ' 6 100 6 C' + (R - 16) + ' 6 ' + (R + 4) + ' 24 ' + (R + 4) + ' 58 Z', cap[0]));
        front.push(P('M' + (L - 8) + ' 56 L' + (R + 8) + ' 56 C' + (R + 12) + ' 64 ' + (R - 10) + ' 70 100 70 C' + (L + 10) + ' 70 ' + (L - 12) + ' 64 ' + (L - 8) + ' 56 Z', cap[1]));
        front.push(C(100, 7, 3, cap[1]));
        break;
    }
    return { back: back, front: front };
  }

  function pilosite(t, m) {
    var L = m.L, R = m.R, hc = HAIR[t.cheveux], ops = [];
    var moustache = 'M84 112 C90 106 96 108 100 112 C104 108 110 106 116 112 C110 117 104 117 100 114 C96 117 90 117 84 112 Z';
    switch (t.pilosite) {
      case 'moustache':
        ops.push(P(moustache, hc));
        break;
      case 'barbe':
        ops.push(P('M' + (L + 2) + ' 96 C' + (L + 2) + ' 132 ' + (L + 20) + ' 154 100 154 C' + (R - 20) + ' 154 ' + (R - 2) + ' 132 ' + (R - 2) + ' 96 C' + (R - 6) + ' 118 ' + (R - 18) + ' 132 100 132 C' + (L + 18) + ' 132 ' + (L + 6) + ' 118 ' + (L + 2) + ' 96 Z', hc));
        ops.push(P(moustache, hc));
        break;
      case 'bouc':
        ops.push(P('M90 128 C92 138 108 138 110 128 C112 148 88 148 90 128 Z', hc));
        ops.push(P(moustache, hc));
        break;
    }
    return ops;
  }

  function face(t, m, expression) {
    var skin = SKIN[t.teint], ops = [];
    var xs = [82, 118];
    // Yeux.
    xs.forEach(function (x) { ops.push(E(x, 84, 5.5, 4.5, '#FFFFFF')); });
    xs.forEach(function (x) { ops.push(C(x + (x < 100 ? 1 : -1), 85, 2.6, INK, null)); });
    if (expression === 'noir') {
      xs.forEach(function (x) { ops.push(P('M' + (x - 7) + ' 78 L' + (x + 7) + ' 78 L' + (x + 7) + ' 83 L' + (x - 7) + ' 83 Z', skin[0], null)); ops.push(P('M' + (x - 6) + ' 83 L' + (x + 6) + ' 83', null, INK, 2)); });
    }
    if (t.genre === 'f') ops.push(P('M75 79 L72 75 M125 79 L128 75', null, INK, 2));
    // Sourcils.
    if (expression === 'sourire') ops.push(P('M70 68 C78 62 88 63 94 67 M106 67 C112 63 122 62 130 68', null, INK, 3));
    else if (expression === 'noir') ops.push(P('M70 63 L94 71 M106 71 L130 63', null, INK, 3.5));
    else ops.push(P('M70 69 L94 67 M106 67 L130 69', null, INK, 3));
    // Nez (ombre plate n° 2).
    ops.push(P('M100 82 C96 94 92 100 90 106 C94 110 106 110 110 106 C108 100 104 94 100 82', skin[1]));
    // Âge.
    if (t.age === 'mur') ops.push(P('M88 106 C86 112 86 118 88 124 M112 106 C114 112 114 118 112 124', null, INK, 1.5, 0.45));
    if (t.age === 'age') {
      ops.push(P('M84 50 C92 47 108 47 116 50 M86 58 C94 56 106 56 114 58', null, INK, 1.5, 0.45));
      ops.push(P('M70 86 L64 84 M70 90 L64 92 M130 86 L136 84 M130 90 L136 92', null, INK, 1.5, 0.45));
      ops.push(P('M88 106 C86 112 86 118 88 124 M112 106 C114 112 114 118 112 124', null, INK, 1.5, 0.45));
    }
    return ops;
  }

  function mouth(expression) {
    if (expression === 'sourire') return [P('M84 120 C92 128 108 128 116 120', null, INK, 2.5)];
    if (expression === 'noir') return [P('M84 126 C92 118 108 118 116 126', null, INK, 2.5), P('M78 108 L84 112 M122 108 L116 112', null, INK, 2)];
    return [P('M86 122 L114 122', null, INK, 2.5)];
  }

  function glasses(t) {
    var ops = [];
    switch (t.lunettes) {
      case 'rondes':
        ops.push(C(82, 84, 12, null, INK, 2.5), C(118, 84, 12, null, INK, 2.5));
        ops.push(P('M94 84 L106 84 M70 84 L60 80 M130 84 L140 80', null, INK, 2.5));
        break;
      case 'carrees':
        ops.push(RECT(70, 75, 24, 18, 4, null, INK, 2.5), RECT(106, 75, 24, 18, 4, null, INK, 2.5));
        ops.push(P('M94 84 L106 84 M70 84 L60 80 M130 84 L140 80', null, INK, 2.5));
        break;
      case 'aviateur':
        ops.push(P('M68 77 L96 77 C98 96 86 103 78 100 C71 97 68 89 68 77 Z', '#6B5A3A66', INK, 2.5));
        ops.push(P('M132 77 L104 77 C102 96 114 103 122 100 C129 97 132 89 132 77 Z', '#6B5A3A66', INK, 2.5));
        ops.push(P('M96 79 L104 79 M68 79 L60 77 M132 79 L140 77', null, INK, 2.5));
        break;
    }
    return ops;
  }

  function accessory(t, m) {
    var ops = [], sx = m.sx, nw = m.nw, skin = SKIN[t.teint];
    var ac = CLOTH[t.couleur_accessoire];
    switch (t.accessoire) {
      case 'echarpe': {
        var band = 'M' + (100 - nw - 22) + ' 178 C' + (100 - nw) + ' 164 ' + (100 + nw) + ' 164 ' + (100 + nw + 22) + ' 178 L' + (100 + nw + 26) + ' 198 C' + (100 + nw) + ' 184 ' + (100 - nw) + ' 184 ' + (100 - nw - 26) + ' 198 Z';
        var tail = 'M' + (100 - nw - 26) + ' 198 L' + (100 - nw - 30) + ' 240 L' + (100 - nw - 2) + ' 240 L' + (100 - nw) + ' 196 Z';
        ops.push(P(band, ac[0]));
        ops.push(G(band, [P('M56 160 L64 210 M74 158 L82 208 M92 156 L100 206 M110 156 L118 206 M128 158 L136 208', null, CREME, 7)]));
        ops.push(P(band, null));
        ops.push(P(tail, ac[0]));
        ops.push(G(tail, [P('M40 206 L90 208 M40 222 L90 224 M40 238 L90 240', null, CREME, 6)]));
        ops.push(P(tail, null));
        break;
      }
      case 'chewing_gum':
        ops.push(C(116, 127, 7, '#F2A7C3'));
        ops.push(C(113, 124, 1.5, '#FFFFFF', null));
        break;
      case 'stylo':
        ops.push(P('M' + (50 + sx) + ' 200 L' + (58 + sx) + ' 198 L' + (66 + sx) + ' 236 L' + (58 + sx) + ' 238 Z', '#2E6DB4'));
        ops.push(P('M' + (52 + sx) + ' 210 L' + (60 + sx) + ' 208', null, INK, 2));
        break;
      case 'carnet':
        ops.push(RECT(126, 194, 46, 46, 3, CREME));
        ops.push(P('M134 208 L164 208 M134 218 L164 218 M134 228 L158 228', null, INK2, 1.5));
        ops.push(P('M132 194 L132 188 M142 194 L142 188 M152 194 L152 188 M162 194 L162 188', null, INK, 2));
        break;
      case 'brassard':
        ops.push(P('M' + (30 + sx) + ' 214 C' + (40 + sx) + ' 206 ' + (52 + sx) + ' 200 ' + (62 + sx) + ' 198 L' + (66 + sx) + ' 214 C' + (54 + sx) + ' 216 ' + (44 + sx) + ' 220 ' + (34 + sx) + ' 228 Z', ac[0]));
        break;
      case 'sifflet':
        ops.push(P('M' + (100 - nw + 2) + ' 168 C' + (100 - nw + 6) + ' 190 96 206 100 214 M' + (100 + nw - 2) + ' 168 C' + (100 + nw - 6) + ' 190 104 206 100 214', null, INK, 2));
        ops.push(RECT(92, 212, 20, 11, 5, ALU));
        ops.push(C(97, 217, 2.5, INK, null));
        break;
      case 'micro':
        ops.push(P('M154 240 L162 208', null, INK2, 12));
        ops.push(P('M154 240 L162 208', null, INK, 1.5));
        ops.push(C(165, 196, 15, '#55524C'));
        ops.push(P('M154 190 L176 190 M152 196 L178 196 M154 202 L176 202', null, INK, 1.5));
        ops.push(P('M150 240 C146 228 142 222 136 218', null, INK, 2.5));
        break;
      case 'stethoscope':
        ops.push(P('M' + (100 - nw + 2) + ' 168 C' + (100 - nw - 6) + ' 200 84 222 100 228 C116 222 ' + (100 + nw + 6) + ' 200 ' + (100 + nw - 2) + ' 168', null, INK2, 4));
        ops.push(P('M' + (100 - nw + 2) + ' 168 C' + (100 - nw - 6) + ' 200 84 222 100 228 C116 222 ' + (100 + nw + 6) + ' 200 ' + (100 + nw - 2) + ' 168', null, INK, 1.5));
        ops.push(C(100, 230, 8, ALU));
        ops.push(C(100, 230, 3, INK2, null));
        break;
      case 'badge':
        ops.push(RECT(124, 184, 30, 20, 2, BLANC));
        ops.push(RECT(124, 184, 30, 6, 0, '#C8262C', null));
        ops.push(P('M128 194 L150 194 M128 199 L144 199', null, INK2, 1.5));
        break;
      case 'journal':
        ops.push(P('M' + (24 + sx) + ' 240 L' + (32 + sx) + ' 206 L' + (86 + sx) + ' 210 L' + (80 + sx) + ' 240 Z', '#FBFAF4'));
        ops.push(P('M' + (34 + sx) + ' 213 L' + (80 + sx) + ' 216', null, '#1C4C9A', 4));
        ops.push(P('M' + (33 + sx) + ' 222 L' + (76 + sx) + ' 225 M' + (31 + sx) + ' 230 L' + (74 + sx) + ' 233', null, INK2, 1.5));
        break;
      case 'telephone':
        ops.push(P('M' + (m.R + 20) + ' 96 L' + (m.R + 24) + ' 56', null, INK, 3));
        ops.push(E(m.R + 18, 150, 18, 13, skin[0]));
        ops.push(RECT(m.R + 6, 92, 24, 62, 4, '#2A2E2A'));
        ops.push(RECT(m.R + 10, 98, 16, 10, 1, '#9DBE2A', null));
        ops.push(P('M' + (m.R + 12) + ' 116 L' + (m.R + 24) + ' 116 M' + (m.R + 12) + ' 124 L' + (m.R + 24) + ' 124 M' + (m.R + 12) + ' 132 L' + (m.R + 24) + ' 132', null, ALU, 2));
        break;
      case 'montre':
        ops.push(RECT(136, 224, 28, 16, 3, BLANC));
        ops.push(E(150, 214, 15, 13, skin[0]));
        ops.push(RECT(136, 226, 28, 7, 0, INK2, null));
        ops.push(C(150, 229, 6, OR));
        break;
    }
    return ops;
  }

  // ── Composition ────────────────────────────────────────────────────────────
  function compose(t, expression) {
    var m = metrics(t), skin = SKIN[t.teint];
    var g = garment(t, m), h = hair(t, m);
    var nw = m.nw;
    var ops = [];
    ops = ops.concat(g.under);
    ops.push(P('M' + (100 - nw) + ' 128 L' + (100 - nw) + ' 168 L100 180 L' + (100 + nw) + ' 168 L' + (100 + nw) + ' 128 Z', skin[0]));
    ops.push(P('M' + (100 - nw) + ' 128 L' + (100 - nw) + ' 150 C' + (100 - nw + 8) + ' 156 ' + (100 + nw - 8) + ' 156 ' + (100 + nw) + ' 150 L' + (100 + nw) + ' 128 Z', skin[1], null));
    ops = ops.concat(g.over);
    ops.push(E(m.L - 6, 92, 9, 13, skin[0]), E(m.R + 6, 92, 9, 13, skin[0]));
    ops = ops.concat(h.back);
    ops.push(P(headPath(m), skin[0]));
    ops = ops.concat(h.front);
    ops = ops.concat(pilosite(t, m));
    ops = ops.concat(face(t, m, expression));
    ops = ops.concat(mouth(expression));
    ops = ops.concat(glasses(t));
    ops = ops.concat(accessory(t, m));
    return ops;
  }

  // ── Sérialisation SVG ──────────────────────────────────────────────────────
  function esc(v) {
    return String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function paintAttrs(o) {
    var a = ' fill="' + (o.f == null ? 'none' : esc(o.f)) + '"';
    var s = o.s === undefined ? INK : o.s;
    if (s != null) {
      var w = o.k === 'r' ? o.sw : o.w;
      a += ' stroke="' + esc(s) + '" stroke-width="' + (w == null ? 2 : w) + '"';
    }
    if (o.o != null) a += ' opacity="' + o.o + '"';
    return a;
  }
  function render(ops, out) {
    for (var i = 0; i < ops.length; i++) {
      var o = ops[i];
      switch (o.k) {
        case 'p': out.push('<path d="' + esc(o.d) + '"' + paintAttrs(o) + '/>'); break;
        case 'e': out.push('<ellipse cx="' + o.cx + '" cy="' + o.cy + '" rx="' + o.rx + '" ry="' + o.ry + '"' + paintAttrs(o) + '/>'); break;
        case 'c': out.push('<circle cx="' + o.cx + '" cy="' + o.cy + '" r="' + o.r + '"' + paintAttrs(o) + '/>'); break;
        case 'r': out.push('<rect x="' + o.x + '" y="' + o.y + '" width="' + o.w + '" height="' + o.h + '" rx="' + o.rx + '"' + paintAttrs(o) + '/>'); break;
        case 'g': {
          var id = 'fp-clip-' + (++uid);
          out.push('<clipPath id="' + id + '"><path d="' + esc(o.clip) + '"/></clipPath><g clip-path="url(#' + id + ')">');
          render(o.ops, out);
          out.push('</g>');
          break;
        }
      }
    }
  }

  function svg(id, expression, opts) {
    opts = opts || {};
    var exp = expression === 'sourire' || expression === 'noir' ? expression : 'neutre';
    var t = traits(String(id == null ? '' : id), opts);
    var out = [];
    render(compose(t, exp), out);
    var cls = opts.className ? ' class="' + esc(opts.className) + '"' : '';
    return '<svg' + cls + ' viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-portrait="' + esc(id) + '" data-expression="' + exp + '">' +
      '<g stroke-linejoin="round" stroke-linecap="round">' + out.join('') + '</g></svg>';
  }

  root.FusiblePortraits = { init: init, svg: svg, traits: traits, palettes: { skin: SKIN, hair: HAIR, cloth: CLOTH }, enums: ENUM, version: '1' };
})(typeof window !== 'undefined' ? window : this);
