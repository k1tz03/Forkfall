import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../theme.dart';

/// Buste « paper doll » d'un personnage (aplats, contour encre 2 px).
///
/// Contrat stable utilisé par les écrans :
///   Portrait(characterId: 'aulard', expression: 'neutre')
/// `characterId` : id de characters.yaml, ou 'coach' / 'joueur' pour toi.
/// `expression`  : 'sourire' | 'neutre' | 'noir'.
/// `traits`      : fiche de content/portraits.yaml (facultatif ; sinon la
///                 table installée, sinon déduite de l'id). La clé `genre`
///                 ('m' | 'f') de la fiche module la mâchoire, les cils et la
///                 coiffure de remplacement (`coiffure_f`) de coach / joueur.
///
/// Le dessin reproduit exactement celui de packages/tools/web/portraits.js :
/// mêmes chemins SVG (absolus, parsés ici), mêmes palettes, même ordre de
/// couches (corps / tenue → cou → oreilles → cheveux arrière → tête → cheveux
/// avant → pilosité → yeux / sourcils / bouche → lunettes → accessoire).
/// Toute retouche ici se reporte là-bas, et réciproquement.
class Portrait extends StatelessWidget {
  const Portrait({
    super.key,
    required this.characterId,
    this.expression = 'neutre',
    this.traits,
    this.grayscale = false,
  });

  final String characterId;
  final String expression;
  final Map<String, dynamic>? traits;

  /// Photo de presse : chaque couleur passe par [FusibleColors.photoGray].
  final bool grayscale;

  /// Table des fiches (content.portraits, compilée depuis content/portraits.yaml),
  /// installée une fois au chargement du contenu. Vide → traits déduits de l'id.
  static Map<String, dynamic> registry = const {};
  static void install(Map<String, dynamic> table) => registry = table;
  static Map<String, dynamic>? traitsOf(String id) => (registry[id] as Map?)?.cast<String, dynamic>();

  /// L'accessoire effectivement dessiné pour ce personnage ('aucun' sinon),
  /// après résolution de la fiche (table installée ou traits déduits de l'id).
  static String accessoryOf(String characterId, [Map<String, dynamic>? traits]) =>
      _Traits.resolve(characterId, traits ?? traitsOf(characterId)).accessoire;

  /// Accessoires dessinés dans le coin inférieur droit du buste (carnet, micro,
  /// montre) : la vignette y déplace son n° de carte pour ne pas les couvrir.
  static bool accessoryAtBottomRight(String accessoire) => const {'carnet', 'micro', 'montre'}.contains(accessoire);

  @override
  Widget build(BuildContext context) {
    final resolved = _Traits.resolve(characterId, traits ?? traitsOf(characterId));
    final exp = expression == 'sourire' || expression == 'noir' ? expression : 'neutre';
    return AspectRatio(
      aspectRatio: 200 / 240,
      child: CustomPaint(painter: _BustPainter(resolved, exp, grayscale)),
    );
  }
}

// ── Palettes (identiques à portraits.js) ─────────────────────────────────────

const String _ink = '#1E1A14';
const String _ink2 = '#4A423A';
const String _creme = '#EFE4C6';
const String _blanc = '#FCFAF3';
const String _alu = '#C9CBC4';
const String _or = '#D9B85A';

const Map<String, List<String>> _skin = {
  'porcelaine': ['#F3DCC6', '#E2C0A4'],
  'clair': ['#E8B995', '#D19A73'],
  'dore': ['#D9A46E', '#BE874F'],
  'olive': ['#C4915E', '#A87540'],
  'brun': ['#9C6642', '#7E4E2F'],
  'ebene': ['#6B4228', '#50301B'],
};
const Map<String, String> _hair = {
  'noir': '#241C18',
  'brun': '#3A2A1E',
  'chatain': '#6B4A2E',
  'roux': '#A8502A',
  'blond': '#D8B36A',
  'gris': '#B9B4A8',
  'blanc': '#ECE7DC',
};
const Map<String, List<String>> _cloth = {
  'bordeaux': ['#93283A', '#6E1F2F'],
  'marine': ['#243A6B', '#182A50'],
  'anthracite': ['#3B3F47', '#2A2D33'],
  'noir': ['#26262A', '#141416'],
  'pelouse': ['#1F5A32', '#123D22'],
  'creme': ['#EFE4C6', '#D6C79E'],
  'blanc': ['#FCFAF3', '#DDD6C4'],
  'gris': ['#8E9096', '#6C6E74'],
  'bleu': ['#2E6DB4', '#20508A'],
  'ciel': ['#8DB8E0', '#6A98C4'],
  'orange': ['#E07A17', '#B65F0E'],
  'rouge': ['#C8262C', '#8C161B'],
  'camel': ['#B98A4E', '#946A36'],
  'violet': ['#7A4DAF', '#5B3689'],
  'beige': ['#D9C9A6', '#B8A67E'],
  'bouteille': ['#2F5C3E', '#1E4029'],
  'jaune': ['#E3C04A', '#C19E2E'],
  'rose': ['#E48BB0', '#C4658C'],
  'prune': ['#5E2A4E', '#421B37'],
};

const Map<String, List<String>> _enums = {
  'teint': ['porcelaine', 'clair', 'dore', 'olive', 'brun', 'ebene'],
  'corpulence': ['fin', 'moyen', 'large'],
  'age': ['jeune', 'mur', 'age'],
  'coiffure': ['chauve', 'degarni', 'court', 'brosse', 'meche', 'mulet', 'boucle', 'carre', 'chignon', 'queue', 'long', 'casquette'],
  'cheveux': ['noir', 'brun', 'chatain', 'roux', 'blond', 'gris', 'blanc'],
  'pilosite': ['rase', 'moustache', 'barbe', 'bouc'],
  'lunettes': ['aucune', 'rondes', 'carrees', 'aviateur'],
  'tenue': ['costume', 'tailleur', 'chemise', 'survetement', 'maillot', 'gardien', 'blouse', 'pull', 'doudoune', 'veste'],
  'accessoire': ['aucun', 'echarpe', 'chewing_gum', 'stylo', 'carnet', 'brassard', 'sifflet', 'micro', 'stethoscope', 'badge', 'journal', 'telephone', 'montre'],
};

// ── Fiche résolue ────────────────────────────────────────────────────────────

class _Traits {
  _Traits(this.m);
  final Map<String, String> m;

  String get teint => m['teint']!;
  String get corpulence => m['corpulence']!;
  String get age => m['age']!;
  String get coiffure => m['coiffure']!;
  String get cheveux => m['cheveux']!;
  String get pilosite => m['pilosite']!;
  String get lunettes => m['lunettes']!;
  String get tenue => m['tenue']!;
  String get couleur => m['couleur']!;
  String get couleur2 => m['couleur2']!;
  String get coiffe => m['coiffe']!;
  String get accessoire => m['accessoire']!;
  String get couleurAccessoire => m['couleur_accessoire']!;
  String get genre => m['genre']!;

  @override
  bool operator ==(Object other) => other is _Traits && _sameMap(m, other.m);
  @override
  int get hashCode => Object.hashAll(m.entries.map((e) => Object.hash(e.key, e.value)));

  static bool _sameMap(Map<String, String> a, Map<String, String> b) {
    if (a.length != b.length) return false;
    for (final e in a.entries) {
      if (b[e.key] != e.value) return false;
    }
    return true;
  }

  static _Traits resolve(String id, Map<String, dynamic>? raw) {
    final genre = (raw?['genre']?.toString()) ?? 'm';
    final t = <String, String>{};
    if (raw == null) {
      t.addAll(_guess(id, genre));
    } else {
      raw.forEach((k, v) {
        if (v != null) t[k] = v.toString();
      });
    }
    t['genre'] = genre;
    if (genre == 'f' && t['coiffure_f'] != null) t['coiffure'] = t['coiffure_f']!;
    void ok(String key, String def) {
      if (!_enums[key]!.contains(t[key])) t[key] = def;
    }

    ok('teint', 'clair');
    ok('corpulence', 'moyen');
    ok('age', 'mur');
    ok('coiffure', 'court');
    ok('cheveux', 'brun');
    ok('pilosite', 'rase');
    ok('lunettes', 'aucune');
    ok('tenue', 'pull');
    ok('accessoire', 'aucun');
    if (!_cloth.containsKey(t['couleur'])) t['couleur'] = 'marine';
    if (!_cloth.containsKey(t['couleur2'])) t['couleur2'] = _defaultCouleur2(t['tenue']!);
    if (!_cloth.containsKey(t['coiffe'])) t['coiffe'] = t['couleur']!;
    if (!_cloth.containsKey(t['couleur_accessoire'])) t['couleur_accessoire'] = 'pelouse';
    return _Traits(t);
  }

  static String _defaultCouleur2(String tenue) {
    switch (tenue) {
      case 'costume':
        return 'rouge';
      case 'maillot':
      case 'gardien':
        return 'pelouse';
      case 'blouse':
        return 'bleu';
      default:
        return 'creme';
    }
  }

  // Sans fiche : hachage FNV-1a de l'id + mulberry32, comme portraits.js.
  static Map<String, String> _guess(String id, String genre) {
    const mask = 0xFFFFFFFF;
    var h = 2166136261;
    for (final c in id.codeUnits) {
      h = ((h ^ c) * 16777619) & mask;
    }
    var a = h;
    double rnd() {
      a = (a + 0x6D2B79F5) & mask;
      var t = a;
      t = ((t ^ (t >> 15)) * (t | 1)) & mask;
      t = (t ^ ((t + (((t ^ (t >> 7)) * (t | 61)) & mask)) & mask)) & mask;
      return ((t ^ (t >> 14)) & mask) / 4294967296;
    }

    String pick(List<String> list) => list[(rnd() * list.length).floor() % list.length];
    final cloth = _cloth.keys.toList();
    final t = <String, String>{
      'teint': pick(_enums['teint']!),
      'corpulence': pick(_enums['corpulence']!),
      'age': pick(_enums['age']!),
      'coiffure': pick(genre == 'f'
          ? const ['carre', 'chignon', 'queue', 'long', 'court', 'boucle']
          : const ['court', 'brosse', 'meche', 'degarni', 'chauve', 'mulet', 'boucle', 'casquette']),
      'cheveux': pick(_enums['cheveux']!),
      'pilosite': genre == 'f' ? 'rase' : pick(_enums['pilosite']!),
      'lunettes': pick(const ['aucune', 'aucune', 'rondes', 'carrees', 'aviateur']),
      'tenue': pick(_enums['tenue']!),
      'couleur': pick(cloth),
      'couleur2': pick(cloth),
      'coiffe': pick(cloth),
      'accessoire': pick(_enums['accessoire']!),
      'couleur_accessoire': pick(cloth),
    };
    if (t['age'] == 'age') t['cheveux'] = rnd() < 0.5 ? 'gris' : 'blanc';
    return t;
  }
}

// ── Opérations de dessin (miroir de P / E / C / R / G dans portraits.js) ─────

const String _defStroke = ' default';

class _Op {
  const _Op.path(this.d, this.f, [this.s = _defStroke, this.w, this.o])
      : k = 'p',
        cx = 0,
        cy = 0,
        rx = 0,
        ry = 0,
        r = 0,
        x = 0,
        y = 0,
        width = 0,
        height = 0,
        clip = null,
        ops = null;
  const _Op.ellipse(this.cx, this.cy, this.rx, this.ry, this.f, [this.s = _defStroke, this.w])
      : k = 'e',
        d = null,
        o = null,
        r = 0,
        x = 0,
        y = 0,
        width = 0,
        height = 0,
        clip = null,
        ops = null;
  const _Op.circle(this.cx, this.cy, this.r, this.f, [this.s = _defStroke, this.w])
      : k = 'c',
        d = null,
        o = null,
        rx = 0,
        ry = 0,
        x = 0,
        y = 0,
        width = 0,
        height = 0,
        clip = null,
        ops = null;
  const _Op.rect(this.x, this.y, this.width, this.height, this.rx, this.f, [this.s = _defStroke, this.w])
      : k = 'r',
        d = null,
        o = null,
        cx = 0,
        cy = 0,
        ry = 0,
        r = 0,
        clip = null,
        ops = null;
  const _Op.group(this.clip, this.ops)
      : k = 'g',
        d = null,
        f = null,
        s = null,
        w = null,
        o = null,
        cx = 0,
        cy = 0,
        rx = 0,
        ry = 0,
        r = 0,
        x = 0,
        y = 0,
        width = 0,
        height = 0;

  final String k;
  final String? d;
  final String? f;
  final String? s;
  final double? w;
  final double? o;
  final double cx, cy, rx, ry, r, x, y, width, height;
  final String? clip;
  final List<_Op>? ops;
}

_Op _p(String d, String? f, [String? s = _defStroke, double? w, double? o]) => _Op.path(d, f, s, w, o);
_Op _e(double cx, double cy, double rx, double ry, String? f, [String? s = _defStroke, double? w]) => _Op.ellipse(cx, cy, rx, ry, f, s, w);
_Op _c(double cx, double cy, double r, String? f, [String? s = _defStroke, double? w]) => _Op.circle(cx, cy, r, f, s, w);
_Op _r(double x, double y, double w, double h, double rx, String? f, [String? s = _defStroke, double? sw]) => _Op.rect(x, y, w, h, rx, f, s, sw);
_Op _g(String clip, List<_Op> ops) => _Op.group(clip, ops);

// ── Géométrie ────────────────────────────────────────────────────────────────

class _Metrics {
  _Metrics(this.hw, this.sx, this.nw, this.jaw);
  final int hw, sx, nw, jaw;
  int get l => 100 - hw;
  int get r => 100 + hw;
}

_Metrics _metrics(_Traits t) {
  final c = t.corpulence;
  final hw = c == 'fin' ? 38 : (c == 'large' ? 47 : 42);
  final sx = c == 'fin' ? 10 : (c == 'large' ? -8 : 0);
  final nw = c == 'fin' ? 16 : (c == 'large' ? 21 : 18);
  final jaw = t.genre == 'f' ? 4 : 0;
  return _Metrics(hw, sx, nw, jaw);
}

String _bodyPath(_Metrics m) {
  final sx = m.sx, h = sx ~/ 2;
  return 'M${14 + sx} 240 C${18 + sx} 190 ${50 + h} 170 82 164 L118 164 C${150 - h} 170 ${182 - sx} 190 ${186 - sx} 240 Z';
}

String _headPath(_Metrics m) {
  final l = m.l, r = m.r, j = m.jaw;
  return 'M$l 70 C$l 38 ${l + 20} 22 100 22 C${r - 20} 22 $r 38 $r 70 L$r 100 C$r 128 ${r - 20 - j} 146 100 146 C${l + 20 + j} 146 $l 128 $l 100 Z';
}

_Op _lapel(_Metrics m, int side, String fill) {
  final x = 100 + side * m.nw;
  return _p('M$x 164 C${x + side * 12} 176 ${x + side * 16} 200 ${x + side * 14} 240 L100 240 L100 214 Z', fill);
}

List<_Op> _collarPoints(_Metrics m, String fill) {
  final l = 100 - m.nw, r = 100 + m.nw;
  return [_p('M$l 164 L${l + 4} 186 L100 178 Z', fill), _p('M$r 164 L${r - 4} 186 L100 178 Z', fill)];
}

class _Layers {
  _Layers(this.a, this.b);
  final List<_Op> a; // under / back
  final List<_Op> b; // over / front
}

_Layers _garment(_Traits t, _Metrics m) {
  final col = _cloth[t.couleur]!, col2 = _cloth[t.couleur2]!, skin = _skin[t.teint]!;
  final nw = m.nw, sx = m.sx, l = 100 - nw, r = 100 + nw;
  final body = _bodyPath(m);
  final under = <_Op>[];
  var over = <_Op>[];
  switch (t.tenue) {
    case 'costume':
      under.add(_p(body, col[0]));
      under.add(_p('M$l 164 L100 214 L$r 164 Z', _blanc));
      under.addAll([_lapel(m, -1, col[1]), _lapel(m, 1, col[1])]);
      under.add(_p('M96 178 L104 178 L110 220 L100 232 L90 220 Z', col2[0]));
      under.add(_p('M94 172 L106 172 L104 180 L96 180 Z', col2[0]));
      over = _collarPoints(m, _blanc);
      break;
    case 'tailleur':
      under.add(_p(body, col[0]));
      under.add(_p('M$l 164 L100 214 L$r 164 Z', col2[0]));
      under.addAll([_lapel(m, -1, col[1]), _lapel(m, 1, col[1])]);
      under.add(_c((100 - nw - 18).toDouble(), 196, 5, _or, null));
      break;
    case 'veste':
      under.add(_p(body, col[0]));
      under.add(_p('M$l 164 L100 214 L$r 164 Z', col2[0]));
      under.addAll([_lapel(m, -1, col[1]), _lapel(m, 1, col[1])]);
      break;
    case 'chemise':
      under.add(_p(body, col[0]));
      under.add(_p('M$l 164 L100 196 L$r 164 Z', skin[0]));
      under.add(_p('M100 196 L100 240', null, _ink, 1.5));
      under.add(_p('M$l 164 L${l - 6} 192 L98 186 Z', col[0]));
      under.add(_p('M$r 164 L${r + 6} 192 L102 186 Z', col[0]));
      break;
    case 'survetement':
      under.add(_p(body, col[0]));
      under.add(_p('M${46 + sx} 184 L74 167 M${54 + sx} 194 L80 174 M${154 - sx} 184 L126 167 M${146 - sx} 194 L120 174', null, _creme, 4));
      under.add(_p('M${l - 4} 162 L100 202 L${r + 4} 162 Z', _creme));
      under.add(_p('M100 202 L100 240', null, _ink, 2.5));
      break;
    case 'maillot':
      under.add(_p(body, col[0]));
      under.add(_g(body, [_r((40 + sx).toDouble(), 150, 16, 90, 0, col2[0], null), _r((144 - sx).toDouble(), 150, 16, 90, 0, col2[0], null)]));
      under.add(_p(body, null));
      under.add(_p('M${l - 6} 162 L100 196 L${r + 6} 162 L$r 164 L100 184 L$l 164 Z', col2[0]));
      break;
    case 'gardien':
      under.add(_p(body, col[0]));
      under.add(_p('M${l - 8} 164 C${l - 8} 190 ${r + 8} 190 ${r + 8} 164 Z', col2[0]));
      under.add(_p('M100 182 L100 240', null, _ink, 1.5));
      for (final side in const [-1, 1]) {
        final x0 = (side < 0 ? 18 + sx : 134 - sx).toDouble();
        for (var i = 0; i < 4; i++) {
          under.add(_r(x0 + 2 + i * 12, 182, 10, 26, 5, col2[0]));
        }
        under.add(_r(x0, 200, 48, 40, 8, col2[0]));
        under.add(_r(side < 0 ? x0 + 44 : x0 - 6, 206, 12, 22, 6, col2[0]));
        under.add(_p('M${x0 + 6} 222 L${x0 + 42} 222', null, _ink, 1.5));
      }
      break;
    case 'blouse':
      under.add(_p(body, col2[0]));
      under.addAll([_lapel(m, -1, col[0]), _lapel(m, 1, col[0])]);
      under.add(_p('M$l 164 L100 214 L$r 164 Z', col2[0]));
      under.add(_p('M${14 + sx} 240 C${18 + sx} 190 ${50 + sx ~/ 2} 170 82 164 L$l 164 C${l - 12} 176 ${l - 16} 200 ${l - 14} 240 Z', col[0]));
      under.add(_p('M${186 - sx} 240 C${182 - sx} 190 ${150 - sx ~/ 2} 170 118 164 L$r 164 C${r + 12} 176 ${r + 16} 200 ${r + 14} 240 Z', col[0]));
      under.add(_r((28 + sx).toDouble(), 206, 26, 22, 2, null, _ink, 1.5));
      over = _collarPoints(m, col[0]);
      break;
    case 'pull':
      under.add(_p(body, col[0]));
      under.add(_e(100, 170, (nw + 8).toDouble(), 12, col[1]));
      over.add(_p('M${l - 8} 170 C${l - 8} 186 ${r + 8} 186 ${r + 8} 170 L${r + 4} 170 C${r + 4} 180 ${l - 4} 180 ${l - 4} 170 Z', col[1]));
      break;
    case 'doudoune':
      under.add(_p(body, col[0]));
      under.add(_g(body, [_p('M0 192 L200 192 M0 210 L200 210 M0 228 L200 228', null, _ink, 1.5)]));
      under.add(_p(body, null));
      under.add(_p('M100 176 L100 240', null, _ink, 2.5));
      over.add(_r((l - 12).toDouble(), 152, (2 * nw + 24).toDouble(), 26, 6, col[0]));
      break;
  }
  return _Layers(under, over);
}

_Layers _hairLayers(_Traits t, _Metrics m) {
  final l = m.l, r = m.r, hc = _hair[t.cheveux]!;
  final back = <_Op>[], front = <_Op>[];
  final court = 'M$l 74 C$l 40 ${l + 18} 20 100 20 C${r - 18} 20 $r 40 $r 74 C${r - 10} 60 ${r - 22} 54 100 54 C${l + 22} 54 ${l + 10} 60 $l 74 Z';
  final tire = 'M$l 74 C$l 40 ${l + 18} 20 100 20 C${r - 18} 20 $r 40 $r 74 C${r - 10} 62 ${r - 22} 56 100 56 C${l + 22} 56 ${l + 10} 62 $l 74 Z';
  final frange = 'M$l 76 C$l 40 ${l + 18} 22 100 22 C${r - 18} 22 $r 40 $r 76 C${r - 12} 64 ${r - 24} 58 100 58 C${l + 24} 58 ${l + 12} 64 $l 76 Z';
  switch (t.coiffure) {
    case 'chauve':
      break;
    case 'degarni':
      front.add(_p('M$l 78 C${l - 2} 62 ${l + 4} 48 ${l + 14} 40 C${l + 10} 54 ${l + 10} 66 ${l + 10} 84 Z', hc));
      front.add(_p('M$r 78 C${r + 2} 62 ${r - 4} 48 ${r - 14} 40 C${r - 10} 54 ${r - 10} 66 ${r - 10} 84 Z', hc));
      break;
    case 'court':
      front.add(_p(court, hc));
      break;
    case 'brosse':
      front.add(_p('M${l + 2} 68 L${l + 2} 32 L${r - 2} 32 L${r - 2} 68 C${r - 10} 58 ${r - 22} 54 100 54 C${l + 22} 54 ${l + 10} 58 ${l + 2} 68 Z', hc));
      break;
    case 'meche':
      front.add(_p(court, hc));
      front.add(_p('M$l 76 C${l + 4} 58 ${l + 30} 48 ${r - 6} 70 C${r - 12} 56 ${r - 30} 44 ${l + 20} 48 C${l + 6} 54 $l 64 $l 76 Z', hc));
      break;
    case 'mulet':
      back.add(_p('M${l - 4} 80 C${l - 10} 110 ${l - 6} 140 ${l + 4} 176 L${r - 4} 176 C${r + 6} 140 ${r + 10} 110 ${r + 4} 80 Z', hc));
      front.add(_p(court, hc));
      break;
    case 'boucle':
      for (var i = 0; i <= 6; i++) {
        final a = math.pi + i * math.pi / 6;
        front.add(_c((100 + (m.hw + 2) * math.cos(a)).round().toDouble(), (76 + 52 * math.sin(a)).round().toDouble(), 13, hc));
      }
      front.add(_c((l - 4).toDouble(), 92, 12, hc));
      front.add(_c((r + 4).toDouble(), 92, 12, hc));
      front.add(_p('M${l - 2} 80 C${l - 2} 30 ${l + 16} 18 100 18 C${r - 16} 18 ${r + 2} 30 ${r + 2} 80 C${r - 8} 66 ${r - 22} 60 100 60 C${l + 22} 60 ${l + 8} 66 ${l - 2} 80 Z', hc, null));
      front.add(_p('M${l - 2} 80 C${l + 8} 66 ${l + 22} 60 100 60 C${r - 22} 60 ${r - 8} 66 ${r + 2} 80', null));
      break;
    case 'carre':
      back.add(_p('M${l - 6} 60 C${l - 6} 30 ${l + 14} 18 100 18 C${r - 14} 18 ${r + 6} 30 ${r + 6} 60 L${r + 8} 150 C${r + 8} 156 $r 158 ${r - 4} 158 L${l + 4} 158 C$l 158 ${l - 8} 156 ${l - 8} 150 Z', hc));
      front.add(_p(frange, hc));
      front.add(_p('M$l 70 C${l - 8} 100 ${l - 8} 130 ${l - 8} 150 L${l + 10} 150 C${l + 8} 120 ${l + 6} 96 $l 70 Z', hc));
      front.add(_p('M$r 70 C${r + 8} 100 ${r + 8} 130 ${r + 8} 150 L${r - 10} 150 C${r - 8} 120 ${r - 6} 96 $r 70 Z', hc));
      break;
    case 'chignon':
      back.add(_c(100, 26, 17, hc));
      front.add(_p(tire, hc));
      break;
    case 'queue':
      back.add(_p('M${r - 10} 60 C${r + 16} 84 ${r + 18} 130 ${r + 6} 176 L${r - 10} 176 C${r - 2} 130 ${r - 2} 96 ${r - 16} 68 Z', hc));
      front.add(_p(tire, hc));
      break;
    case 'long':
      back.add(_p('M${l - 6} 64 C${l - 14} 110 ${l - 14} 170 ${l - 6} 220 L${r + 6} 220 C${r + 14} 170 ${r + 14} 110 ${r + 6} 64 C${r + 6} 30 ${r - 14} 18 100 18 C${l + 14} 18 ${l - 6} 30 ${l - 6} 64 Z', hc));
      front.add(_p(frange, hc));
      front.add(_p('M$l 70 C${l - 10} 110 ${l - 12} 160 ${l - 8} 200 L${l + 8} 200 C${l + 8} 150 ${l + 6} 100 $l 70 Z', hc));
      front.add(_p('M$r 70 C${r + 10} 110 ${r + 12} 160 ${r + 8} 200 L${r - 8} 200 C${r - 8} 150 ${r - 6} 100 $r 70 Z', hc));
      break;
    case 'casquette':
      final cap = _cloth[t.coiffe]!;
      front.add(_p('M$l 78 C${l - 2} 66 ${l + 2} 56 ${l + 10} 50 C${l + 10} 62 ${l + 10} 72 ${l + 10} 84 Z', hc));
      front.add(_p('M$r 78 C${r + 2} 66 ${r - 2} 56 ${r - 10} 50 C${r - 10} 62 ${r - 10} 72 ${r - 10} 84 Z', hc));
      front.add(_p('M${l - 4} 58 C${l - 4} 24 ${l + 16} 6 100 6 C${r - 16} 6 ${r + 4} 24 ${r + 4} 58 Z', cap[0]));
      front.add(_p('M${l - 8} 56 L${r + 8} 56 C${r + 12} 64 ${r - 10} 70 100 70 C${l + 10} 70 ${l - 12} 64 ${l - 8} 56 Z', cap[1]));
      front.add(_c(100, 7, 3, cap[1]));
      break;
  }
  return _Layers(back, front);
}

List<_Op> _pilosite(_Traits t, _Metrics m) {
  final l = m.l, r = m.r, hc = _hair[t.cheveux]!;
  final ops = <_Op>[];
  const moustache = 'M84 112 C90 106 96 108 100 112 C104 108 110 106 116 112 C110 117 104 117 100 114 C96 117 90 117 84 112 Z';
  switch (t.pilosite) {
    case 'moustache':
      ops.add(_p(moustache, hc));
      break;
    case 'barbe':
      ops.add(_p('M${l + 2} 96 C${l + 2} 132 ${l + 20} 154 100 154 C${r - 20} 154 ${r - 2} 132 ${r - 2} 96 C${r - 6} 118 ${r - 18} 132 100 132 C${l + 18} 132 ${l + 6} 118 ${l + 2} 96 Z', hc));
      ops.add(_p(moustache, hc));
      break;
    case 'bouc':
      ops.add(_p('M90 128 C92 138 108 138 110 128 C112 148 88 148 90 128 Z', hc));
      ops.add(_p(moustache, hc));
      break;
  }
  return ops;
}

List<_Op> _face(_Traits t, _Metrics m, String expression) {
  final skin = _skin[t.teint]!;
  final ops = <_Op>[];
  const xs = [82, 118];
  for (final x in xs) {
    ops.add(_e(x.toDouble(), 84, 5.5, 4.5, '#FFFFFF'));
  }
  for (final x in xs) {
    ops.add(_c((x + (x < 100 ? 1 : -1)).toDouble(), 85, 2.6, _ink, null));
  }
  if (expression == 'noir') {
    for (final x in xs) {
      ops.add(_p('M${x - 7} 78 L${x + 7} 78 L${x + 7} 83 L${x - 7} 83 Z', skin[0], null));
      ops.add(_p('M${x - 6} 83 L${x + 6} 83', null, _ink, 2));
    }
  }
  if (t.genre == 'f') ops.add(_p('M75 79 L72 75 M125 79 L128 75', null, _ink, 2));
  if (expression == 'sourire') {
    ops.add(_p('M70 68 C78 62 88 63 94 67 M106 67 C112 63 122 62 130 68', null, _ink, 3));
  } else if (expression == 'noir') {
    ops.add(_p('M70 63 L94 71 M106 71 L130 63', null, _ink, 3.5));
  } else {
    ops.add(_p('M70 69 L94 67 M106 67 L130 69', null, _ink, 3));
  }
  ops.add(_p('M100 82 C96 94 92 100 90 106 C94 110 106 110 110 106 C108 100 104 94 100 82', skin[1]));
  if (t.age == 'mur') ops.add(_p('M88 106 C86 112 86 118 88 124 M112 106 C114 112 114 118 112 124', null, _ink, 1.5, 0.45));
  if (t.age == 'age') {
    ops.add(_p('M84 50 C92 47 108 47 116 50 M86 58 C94 56 106 56 114 58', null, _ink, 1.5, 0.45));
    ops.add(_p('M70 86 L64 84 M70 90 L64 92 M130 86 L136 84 M130 90 L136 92', null, _ink, 1.5, 0.45));
    ops.add(_p('M88 106 C86 112 86 118 88 124 M112 106 C114 112 114 118 112 124', null, _ink, 1.5, 0.45));
  }
  return ops;
}

List<_Op> _mouth(String expression) {
  if (expression == 'sourire') return [_p('M84 120 C92 128 108 128 116 120', null, _ink, 2.5)];
  if (expression == 'noir') {
    return [_p('M84 126 C92 118 108 118 116 126', null, _ink, 2.5), _p('M78 108 L84 112 M122 108 L116 112', null, _ink, 2)];
  }
  return [_p('M86 122 L114 122', null, _ink, 2.5)];
}

List<_Op> _glasses(_Traits t) {
  final ops = <_Op>[];
  switch (t.lunettes) {
    case 'rondes':
      ops.add(_c(82, 84, 12, null, _ink, 2.5));
      ops.add(_c(118, 84, 12, null, _ink, 2.5));
      ops.add(_p('M94 84 L106 84 M70 84 L60 80 M130 84 L140 80', null, _ink, 2.5));
      break;
    case 'carrees':
      ops.add(_r(70, 75, 24, 18, 4, null, _ink, 2.5));
      ops.add(_r(106, 75, 24, 18, 4, null, _ink, 2.5));
      ops.add(_p('M94 84 L106 84 M70 84 L60 80 M130 84 L140 80', null, _ink, 2.5));
      break;
    case 'aviateur':
      ops.add(_p('M68 77 L96 77 C98 96 86 103 78 100 C71 97 68 89 68 77 Z', '#6B5A3A66', _ink, 2.5));
      ops.add(_p('M132 77 L104 77 C102 96 114 103 122 100 C129 97 132 89 132 77 Z', '#6B5A3A66', _ink, 2.5));
      ops.add(_p('M96 79 L104 79 M68 79 L60 77 M132 79 L140 77', null, _ink, 2.5));
      break;
  }
  return ops;
}

List<_Op> _accessory(_Traits t, _Metrics m) {
  final ops = <_Op>[];
  final sx = m.sx, nw = m.nw, skin = _skin[t.teint]!;
  final ac = _cloth[t.couleurAccessoire]!;
  switch (t.accessoire) {
    case 'echarpe':
      final band = 'M${100 - nw - 22} 178 C${100 - nw} 164 ${100 + nw} 164 ${100 + nw + 22} 178 L${100 + nw + 26} 198 C${100 + nw} 184 ${100 - nw} 184 ${100 - nw - 26} 198 Z';
      final tail = 'M${100 - nw - 26} 198 L${100 - nw - 30} 240 L${100 - nw - 2} 240 L${100 - nw} 196 Z';
      ops.add(_p(band, ac[0]));
      ops.add(_g(band, [_p('M56 160 L64 210 M74 158 L82 208 M92 156 L100 206 M110 156 L118 206 M128 158 L136 208', null, _creme, 7)]));
      ops.add(_p(band, null));
      ops.add(_p(tail, ac[0]));
      ops.add(_g(tail, [_p('M40 206 L90 208 M40 222 L90 224 M40 238 L90 240', null, _creme, 6)]));
      ops.add(_p(tail, null));
      break;
    case 'chewing_gum':
      ops.add(_c(116, 127, 7, '#F2A7C3'));
      ops.add(_c(113, 124, 1.5, '#FFFFFF', null));
      break;
    case 'stylo':
      ops.add(_p('M${50 + sx} 200 L${58 + sx} 198 L${66 + sx} 236 L${58 + sx} 238 Z', '#2E6DB4'));
      ops.add(_p('M${52 + sx} 210 L${60 + sx} 208', null, _ink, 2));
      break;
    case 'carnet':
      ops.add(_r(126, 194, 46, 46, 3, _creme));
      ops.add(_p('M134 208 L164 208 M134 218 L164 218 M134 228 L158 228', null, _ink2, 1.5));
      ops.add(_p('M132 194 L132 188 M142 194 L142 188 M152 194 L152 188 M162 194 L162 188', null, _ink, 2));
      break;
    case 'brassard':
      ops.add(_p('M${30 + sx} 214 C${40 + sx} 206 ${52 + sx} 200 ${62 + sx} 198 L${66 + sx} 214 C${54 + sx} 216 ${44 + sx} 220 ${34 + sx} 228 Z', ac[0]));
      break;
    case 'sifflet':
      ops.add(_p('M${100 - nw + 2} 168 C${100 - nw + 6} 190 96 206 100 214 M${100 + nw - 2} 168 C${100 + nw - 6} 190 104 206 100 214', null, _ink, 2));
      ops.add(_r(92, 212, 20, 11, 5, _alu));
      ops.add(_c(97, 217, 2.5, _ink, null));
      break;
    case 'micro':
      ops.add(_p('M154 240 L162 208', null, _ink2, 12));
      ops.add(_p('M154 240 L162 208', null, _ink, 1.5));
      ops.add(_c(165, 196, 15, '#55524C'));
      ops.add(_p('M154 190 L176 190 M152 196 L178 196 M154 202 L176 202', null, _ink, 1.5));
      ops.add(_p('M150 240 C146 228 142 222 136 218', null, _ink, 2.5));
      break;
    case 'stethoscope':
      final tube = 'M${100 - nw + 2} 168 C${100 - nw - 6} 200 84 222 100 228 C116 222 ${100 + nw + 6} 200 ${100 + nw - 2} 168';
      ops.add(_p(tube, null, _ink2, 4));
      ops.add(_p(tube, null, _ink, 1.5));
      ops.add(_c(100, 230, 8, _alu));
      ops.add(_c(100, 230, 3, _ink2, null));
      break;
    case 'badge':
      ops.add(_r(124, 184, 30, 20, 2, _blanc));
      ops.add(_r(124, 184, 30, 6, 0, '#C8262C', null));
      ops.add(_p('M128 194 L150 194 M128 199 L144 199', null, _ink2, 1.5));
      break;
    case 'journal':
      ops.add(_p('M${24 + sx} 240 L${32 + sx} 206 L${86 + sx} 210 L${80 + sx} 240 Z', '#FBFAF4'));
      ops.add(_p('M${34 + sx} 213 L${80 + sx} 216', null, '#1C4C9A', 4));
      ops.add(_p('M${33 + sx} 222 L${76 + sx} 225 M${31 + sx} 230 L${74 + sx} 233', null, _ink2, 1.5));
      break;
    case 'telephone':
      final r = m.r;
      ops.add(_p('M${r + 20} 96 L${r + 24} 56', null, _ink, 3));
      ops.add(_e((r + 18).toDouble(), 150, 18, 13, skin[0]));
      ops.add(_r((r + 6).toDouble(), 92, 24, 62, 4, '#2A2E2A'));
      ops.add(_r((r + 10).toDouble(), 98, 16, 10, 1, '#9DBE2A', null));
      ops.add(_p('M${r + 12} 116 L${r + 24} 116 M${r + 12} 124 L${r + 24} 124 M${r + 12} 132 L${r + 24} 132', null, _alu, 2));
      break;
    case 'montre':
      ops.add(_r(136, 224, 28, 16, 3, _blanc));
      ops.add(_e(150, 214, 15, 13, skin[0]));
      ops.add(_r(136, 226, 28, 7, 0, _ink2, null));
      ops.add(_c(150, 229, 6, _or));
      break;
  }
  return ops;
}

List<_Op> _compose(_Traits t, String expression) {
  final m = _metrics(t), skin = _skin[t.teint]!;
  final g = _garment(t, m), h = _hairLayers(t, m);
  final nw = m.nw;
  final ops = <_Op>[];
  ops.addAll(g.a);
  ops.add(_p('M${100 - nw} 128 L${100 - nw} 168 L100 180 L${100 + nw} 168 L${100 + nw} 128 Z', skin[0]));
  ops.add(_p('M${100 - nw} 128 L${100 - nw} 150 C${100 - nw + 8} 156 ${100 + nw - 8} 156 ${100 + nw} 150 L${100 + nw} 128 Z', skin[1], null));
  ops.addAll(g.b);
  ops.add(_e((m.l - 6).toDouble(), 92, 9, 13, skin[0]));
  ops.add(_e((m.r + 6).toDouble(), 92, 9, 13, skin[0]));
  ops.addAll(h.a);
  ops.add(_p(_headPath(m), skin[0]));
  ops.addAll(h.b);
  ops.addAll(_pilosite(t, m));
  ops.addAll(_face(t, m, expression));
  ops.addAll(_mouth(expression));
  ops.addAll(_glasses(t));
  ops.addAll(_accessory(t, m));
  return ops;
}

// ── Rendu ────────────────────────────────────────────────────────────────────

Color _color(String hex) {
  final h = hex.substring(1);
  final rgb = int.parse(h.substring(0, 6), radix: 16);
  final a = h.length >= 8 ? int.parse(h.substring(6, 8), radix: 16) : 0xFF;
  return Color((a << 24) | rgb);
}

/// Parse un chemin SVG absolu (M, L, C, Q, H, V, Z) tel qu'écrit dans portraits.js.
Path _svgPath(String d) {
  final path = Path();
  final nums = <double>[];
  var cmd = '';
  var i = 0;
  final n = d.length;
  var cx = 0.0, cy = 0.0;
  void flush() {
    var k = 0;
    switch (cmd) {
      case 'M':
        while (k + 1 < nums.length) {
          if (k == 0) {
            path.moveTo(nums[k], nums[k + 1]);
          } else {
            path.lineTo(nums[k], nums[k + 1]);
          }
          cx = nums[k];
          cy = nums[k + 1];
          k += 2;
        }
        break;
      case 'L':
        while (k + 1 < nums.length) {
          path.lineTo(nums[k], nums[k + 1]);
          cx = nums[k];
          cy = nums[k + 1];
          k += 2;
        }
        break;
      case 'H':
        while (k < nums.length) {
          cx = nums[k];
          path.lineTo(cx, cy);
          k += 1;
        }
        break;
      case 'V':
        while (k < nums.length) {
          cy = nums[k];
          path.lineTo(cx, cy);
          k += 1;
        }
        break;
      case 'C':
        while (k + 5 < nums.length) {
          path.cubicTo(nums[k], nums[k + 1], nums[k + 2], nums[k + 3], nums[k + 4], nums[k + 5]);
          cx = nums[k + 4];
          cy = nums[k + 5];
          k += 6;
        }
        break;
      case 'Q':
        while (k + 3 < nums.length) {
          path.quadraticBezierTo(nums[k], nums[k + 1], nums[k + 2], nums[k + 3]);
          cx = nums[k + 2];
          cy = nums[k + 3];
          k += 4;
        }
        break;
      case 'Z':
        path.close();
        break;
    }
    nums.clear();
  }

  while (i < n) {
    final ch = d[i];
    if (ch == ' ' || ch == ',') {
      i++;
      continue;
    }
    if ('MLHVCQZ'.contains(ch)) {
      flush();
      cmd = ch;
      i++;
      if (cmd == 'Z') flush();
      continue;
    }
    var j = i;
    while (j < n && '0123456789.-'.contains(d[j])) {
      if (d[j] == '-' && j > i) break;
      j++;
    }
    nums.add(double.parse(d.substring(i, j)));
    i = j;
  }
  flush();
  return path;
}

class _BustPainter extends CustomPainter {
  _BustPainter(this.traits, this.expression, this.grayscale);
  final _Traits traits;
  final String expression;
  final bool grayscale;

  Color _tone(Color c) => grayscale ? FusibleColors.photoGray(c) : c;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.save();
    canvas.scale(size.width / 200, size.height / 240);
    _render(canvas, _compose(traits, expression));
    canvas.restore();
  }

  void _render(Canvas canvas, List<_Op> ops) {
    for (final o in ops) {
      if (o.k == 'g') {
        canvas.save();
        canvas.clipPath(_svgPath(o.clip!));
        _render(canvas, o.ops!);
        canvas.restore();
        continue;
      }
      final fill = o.f == null ? null : (Paint()..color = _withOpacity(_tone(_color(o.f!)), o.o));
      final strokeColor = o.s == _defStroke ? _ink : o.s;
      final stroke = strokeColor == null
          ? null
          : (Paint()
            ..color = _withOpacity(_tone(_color(strokeColor)), o.o)
            ..style = PaintingStyle.stroke
            ..strokeWidth = o.w ?? 2
            ..strokeJoin = StrokeJoin.round
            ..strokeCap = StrokeCap.round);
      switch (o.k) {
        case 'p':
          final path = _svgPath(o.d!);
          if (fill != null) canvas.drawPath(path, fill);
          if (stroke != null) canvas.drawPath(path, stroke);
          break;
        case 'e':
          final rect = Rect.fromCenter(center: Offset(o.cx, o.cy), width: o.rx * 2, height: o.ry * 2);
          if (fill != null) canvas.drawOval(rect, fill);
          if (stroke != null) canvas.drawOval(rect, stroke);
          break;
        case 'c':
          if (fill != null) canvas.drawCircle(Offset(o.cx, o.cy), o.r, fill);
          if (stroke != null) canvas.drawCircle(Offset(o.cx, o.cy), o.r, stroke);
          break;
        case 'r':
          final rr = RRect.fromRectAndRadius(Rect.fromLTWH(o.x, o.y, o.width, o.height), Radius.circular(o.rx));
          if (fill != null) canvas.drawRRect(rr, fill);
          if (stroke != null) canvas.drawRRect(rr, stroke);
          break;
      }
    }
  }

  static Color _withOpacity(Color c, double? o) => o == null ? c : c.withValues(alpha: c.a * o);

  @override
  bool shouldRepaint(_BustPainter old) => old.expression != expression || old.traits != traits || old.grayscale != grayscale;
}
