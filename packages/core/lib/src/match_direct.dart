/// LE SAMEDI EN DIRECT (docs/histoires/samedi_direct.md) — le script du samedi.
///
/// Le moteur joue un bloc de six journées d'un tirage ; la ville met en scène
/// la dernière, à la Rive. Deux ou trois décisions s'y prennent désormais au
/// bord du terrain, à leur minute. Ce fichier tient tout ce qui est pur :
///   · le catalogue (content/ville/match_direct.yaml, compilé sous
///     `ville.match_direct`) ;
///   · le script d'un samedi (`construireScenario`) : combien de décisions, à
///     quelles minutes, le score à chacune, l'adversaire, les textes — tiré
///     d'un générateur haché à part (graine, postulat, saison, blocs), jamais de
///     celui de la carrière ;
///   · ce que les décisions retenues pèsent sur la dernière journée
///     (`poidsDirect`, borné) ;
///   · la fin du match, cohérente avec la lettre jouée (`conclureDirect`).
/// `Engine` fait le reste : il résout le bloc avec ces bornes (les mêmes
/// tirages), applique les effets cachés et garde la trace (`GameState.direct`).
library;

import 'dart:convert';

import 'condition.dart';
import 'content.dart';
import 'rng.dart';
import 'state.dart';
import 'text.dart';
import 'world.dart';

/// Les trois moments où la ville peut s'arrêter, et leurs minutes (la
/// mi-temps et les dernières minutes restent au jeu : après la dernière
/// décision, il faut du temps pour que la lettre se joue).
const Map<String, List<int>> kMomentsDirect = {
  'premiere': [17, 40],
  'heure': [55, 70],
  'fin': [76, 85],
};
const List<String> kSituationsDirect = ['menes', 'nul', 'devant'];
const Set<String> kFoulesDirect = {'leve', 'siffle', 'rien'};
const Set<String> kCamerasDirect = {'banc', 'kop', 'loge', 'terrain'};

/// Un geste vaut au plus ±6 points de pourcentage ; la somme d'un match est
/// bornée à ±10 sur la victoire et ±8 sur le nul.
const int kDirectGesteMax = 6;
const int kDirectPlafondV = 10;
const int kDirectPlafondN = 8;

/// Les samedis joués en direct que l'état garde (la rotation des décisions les
/// relit : la moins vue passe d'abord).
const int kDirectTraces = 30;

/// Un des deux gestes d'une décision : son libellé, ce qui se passe (la
/// réponse), son poids sur la dernière journée (`v` victoire, `n` nul, en
/// points), la tribune qui se lève ou qui siffle, et ses effets cachés.
class CoteDirect {
  final String label;
  final String reponse;
  final int v;
  final int n;
  final String foule;
  final EffetVille effets;
  const CoteDirect({required this.label, this.reponse = '', this.v = 0, this.n = 0, this.foule = 'rien', this.effets = const EffetVille()});

  factory CoteDirect.fromJson(Object? raw) {
    final j = (raw as Map?)?.cast<String, dynamic>() ?? const <String, dynamic>{};
    return CoteDirect(
      label: j['label']?.toString() ?? '',
      reponse: j['reponse']?.toString() ?? '',
      v: (j['v'] as num?)?.toInt() ?? 0,
      n: (j['n'] as num?)?.toInt() ?? 0,
      foule: j['foule']?.toString() ?? 'rien',
      effets: EffetVille.fromJson(j['effets']),
    );
  }
}

/// Une décision du catalogue : pour quels rôles, dans quelles situations
/// (mené, à égalité, devant), à quels moments, sous quelle condition (`when`,
/// la langue des cartes, compilée), et ses deux gestes.
class DecisionDirect {
  final String id;
  final List<String> roles;
  final List<String> situations;
  final List<String> moments;
  final Object? when;
  final String? camera;
  final int poids;
  final String texte;
  final CoteDirect gauche;
  final CoteDirect droite;
  final bool defautDroite;
  const DecisionDirect({
    required this.id,
    required this.roles,
    required this.situations,
    required this.moments,
    this.when,
    this.camera,
    this.poids = 1,
    required this.texte,
    required this.gauche,
    required this.droite,
    this.defautDroite = true,
  });

  factory DecisionDirect.fromJson(Map<String, dynamic> j) => DecisionDirect(
        id: j['id'] as String,
        roles: (j['roles'] as List? ?? const []).map((e) => e.toString()).toList(),
        situations: (j['situations'] as List? ?? const []).map((e) => e.toString()).toList(),
        moments: (j['moments'] as List? ?? const []).map((e) => e.toString()).toList(),
        when: j['when'],
        camera: j['camera'] as String?,
        poids: (j['poids'] as num?)?.toInt() ?? 1,
        texte: j['texte']?.toString() ?? '',
        gauche: CoteDirect.fromJson(j['gauche']),
        droite: CoteDirect.fromJson(j['droite']),
        defautDroite: j['defaut'] != 'gauche',
      );

  CoteDirect cote(bool droiteChoisie) => droiteChoisie ? droite : gauche;

  bool convient(String role, String moment, String situation) =>
      (roles.isEmpty || roles.contains(role)) && moments.contains(moment) && situations.contains(situation);
}

/// Le catalogue, dans l'ordre du bundle (les lots de content/ville/, triés par
/// nom de fichier) : l'ordre est stable, le tirage aussi.
class CatalogueDirect {
  final List<DecisionDirect> decisions;
  final Map<String, DecisionDirect> parId;
  CatalogueDirect(this.decisions) : parId = {for (final d in decisions) d.id: d};

  bool get vide => decisions.isEmpty;

  factory CatalogueDirect.fromVille(Map<String, dynamic> ville) => CatalogueDirect([
        for (final e in (ville['match_direct'] as List? ?? const []))
          if (e is Map) DecisionDirect.fromJson(e.cast<String, dynamic>()),
      ]);
}

/// Ce que la ville renvoie avec le choix de posture : les décisions prises,
/// dans l'ordre (`{"d": [{"id": …, "c": "g"|"d", "t": 1}]}`).
class MatchDirect {
  final List<ChoixDirect> choix;
  const MatchDirect(this.choix);

  Map<String, dynamic> toJson() => {'d': [for (final c in choix) c.toJson()]};

  /// null pour une chaîne vide ou illisible : le choix part alors comme avant.
  static MatchDirect? lire(String? texte) {
    if (texte == null || texte.trim().isEmpty) return null;
    try {
      final j = jsonDecode(texte);
      if (j is! Map) return null;
      return MatchDirect([
        for (final c in (j['d'] as List? ?? const []))
          if (c is Map) ChoixDirect.fromJson(c.cast<String, dynamic>()),
      ]);
    } catch (_) {
      return null;
    }
  }
}

/// Une décision au script : la décision, sa minute, le score à ce moment (de
/// notre point de vue : nous sommes à la Rive) et ses textes rendus.
class DecisionPrevue {
  final DecisionDirect def;
  final int minute;
  final int pour;
  final int contre;
  final String situation;
  final String texte;
  final List<String> labels; // gauche, droite
  final List<String> reponses; // gauche, droite
  const DecisionPrevue({
    required this.def,
    required this.minute,
    required this.pour,
    required this.contre,
    required this.situation,
    required this.texte,
    required this.labels,
    required this.reponses,
  });

  /// Ce que la ville affiche : jamais les poids.
  Map<String, dynamic> toJson(String camera) => {
        'id': def.id,
        'minute': minute,
        'score': '$pour-$contre',
        'situation': situation,
        'camera': def.camera ?? camera,
        'texte': texte,
        'gauche': {'label': labels[0], 'reponse': reponses[0], 'foule': def.gauche.foule},
        'droite': {'label': labels[1], 'reponse': reponses[1], 'foule': def.droite.foule},
        'defaut': def.defautDroite ? 'droite' : 'gauche',
      };
}

/// Le script d'un samedi : tout ce que la ville joue avant d'appeler le moteur.
class ScenarioDirect {
  final int saison;
  final int blocs;
  /// La lettre que la dernière journée aurait sans décision (un aperçu sur une
  /// copie du générateur : rien n'est tiré). La ville ne la voit pas.
  final String base;
  final String adversaire;
  final String adv;
  final bool derby;
  final bool finale;
  /// La minute de la dernière décision prévue : après elle, la lettre se joue.
  final int fin;
  /// Les buts jusqu'à `fin` : `[minute, 1]` pour nous, `[minute, 0]` pour eux.
  final List<List<int>> buts;
  final List<DecisionPrevue> decisions;
  final String camera;
  const ScenarioDirect({
    required this.saison,
    required this.blocs,
    required this.base,
    required this.adversaire,
    required this.adv,
    required this.derby,
    required this.finale,
    required this.fin,
    required this.buts,
    required this.decisions,
    required this.camera,
  });

  Map<String, dynamic> toJsonVille() => {
        'saison': saison,
        'blocs': blocs,
        'adversaire': adversaire,
        'adv': adv,
        'derby': derby,
        'finale': finale,
        'fin': fin,
        'buts': buts,
        'decisions': [for (final d in decisions) d.toJson(camera)],
      };
}

/// Où regarde la caméra quand le match s'arrête, selon le rôle : le banc pour
/// ceux qui y sont assis, la pelouse pour le joueur, la loge pour les autres.
String cameraDuRole(String role) => switch (role) {
      'entraineur' || 'selectionneur' => 'banc',
      'joueur' => 'terrain',
      _ => 'loge',
    };

/// « Olympique Valdorne » → « Valdorne » : on parle d'un club par sa ville.
String villeDuClub(String club, List<String> prefixes) {
  final t = club.trim();
  final sp = t.indexOf(' ');
  if (sp > 0 && prefixes.contains(t.substring(0, sp))) return t.substring(sp + 1);
  return t;
}

/// Le générateur du samedi : à part, haché sur la carrière et la journée
/// (`blocs` : les blocs joués avant ce samedi).
Rng _de(GameState s, int saison, int blocs, String quoi, [String plus = '']) =>
    Rng(fnv1a32('$quoi|${s.seed}|${s.postulatId}|$saison|$blocs|$plus'));

/// Le script du samedi (pur). [base] est la lettre que la dernière journée
/// aurait sans décision ; [clubs] les adversaires possibles (le classement,
/// sans nous). null quand aucune décision ne convient (le catalogue est vide,
/// ou rien n'est écrit pour ce rôle à ces moments).
ScenarioDirect? construireScenario({
  required Content content,
  required CatalogueDirect cat,
  required GameState s,
  required String base,
  required List<String> clubs,
  required String phase,
}) {
  if (cat.vide) return null;
  final b = s.world.blocks;
  final h = _de(s, s.season, b, 'samedi');
  final finale = b >= 5, derby = b == 1 || b == 4;
  // L'adversaire : le rival au derby, sinon un club du classement. Les tirages
  // ont toujours lieu, dans le même ordre, quelle que soit la branche.
  final rival = s.entities.named['rival'] ?? '';
  final iAdv = h.nextInt(clubs.isEmpty ? 1 : clubs.length);
  final adversaire = (derby || clubs.isEmpty) && rival.isNotEmpty ? rival : (clubs.isEmpty ? 'les visiteurs' : clubs[iAdv]);
  final prefixes = ((content.names['club_prefixes'] as List?) ?? const []).map((e) => e.toString()).toList();
  final adv = villeDuClub(adversaire, prefixes);
  // Combien de décisions : une au premier samedi de la carrière, trois à la
  // dernière journée, deux ou trois au derby, une ou deux sinon.
  final x1 = h.nextDouble();
  final k = (s.season == 0 && b == 0) ? 1 : (finale ? 3 : (derby ? (x1 < 0.5 ? 2 : 3) : (x1 < 0.5 ? 1 : 2)));
  final x2 = h.nextDouble();
  final moments = k == 1
      ? [x2 < 0.65 ? 'heure' : 'fin']
      : (k == 2 ? (x2 < 0.35 ? ['premiere', 'heure'] : (x2 < 0.8 ? ['heure', 'fin'] : ['premiere', 'fin'])) : ['premiere', 'heure', 'fin']);
  final minutes = [for (final m in moments) h.range(kMomentsDirect[m]![0], kMomentsDirect[m]![1])];
  final fin = minutes.last;
  // Le score à la dernière décision suit la lettre que le bloc donnerait sans
  // décision (docs/histoires/samedi_direct.md, « un écart assumé ») : une
  // victoire passe devant une fois sur deux, une défaite derrière une fois sur
  // deux, un nul reste à égalité six fois sur dix.
  final x3 = h.nextDouble();
  final ecart = switch (base) {
    'V' => x3 < 0.55 ? 1 : (x3 < 0.90 ? 0 : -1),
    'D' => x3 < 0.55 ? -1 : (x3 < 0.90 ? 0 : 1),
    _ => x3 < 0.20 ? 1 : (x3 < 0.80 ? 0 : -1),
  };
  final paire = h.nextDouble() < 0.3 && fin >= 45;
  final sens = <int>[
    for (var i = 0; i < ecart; i++) 1,
    for (var i = 0; i < -ecart; i++) 0,
    if (paire) ...[1, 0],
  ];
  for (var i = sens.length - 1; i > 0; i--) {
    final j = h.nextInt(i + 1);
    final t = sens[i];
    sens[i] = sens[j];
    sens[j] = t;
  }
  // Les minutes des buts : avant la dernière décision, loin des autres
  // décisions (le match s'arrête sur une décision, pas sur un but), de la
  // mi-temps (la ville y siffle la pause) et entre eux.
  final mins = <int>[];
  for (var i = 0; i < sens.length; i++) {
    for (var essai = 0; essai < 40; essai++) {
      final m = h.range(3, fin - 3);
      if ((m - 45).abs() <= 1 || minutes.any((d) => (d - m).abs() <= 2) || mins.any((x) => (x - m).abs() <= 3)) continue;
      mins.add(m);
      break;
    }
  }
  mins.sort();
  final buts = [for (var i = 0; i < mins.length; i++) [mins[i], sens[i]]];
  // Les décisions : la moins vue de la carrière d'abord, puis le poids.
  final vus = <String, int>{};
  for (final t in s.direct) {
    for (final c in t.choix) {
      vus[c.id] = (vus[c.id] ?? 0) + 1;
    }
  }
  final ctx = EvalContext(s, phase, slotsTotal: content.cardSlots(s.role), cast: content.postulats[s.postulatId]?.cast.keys.toSet() ?? const {});
  final pris = <String>{};
  final prevues = <DecisionPrevue>[];
  for (var j = 0; j < moments.length; j++) {
    final m = minutes[j];
    final pour = buts.where((x) => x[0] < m && x[1] == 1).length;
    final contre = buts.where((x) => x[0] < m && x[1] == 0).length;
    final situation = pour < contre ? 'menes' : (pour > contre ? 'devant' : 'nul');
    final x = h.nextDouble();
    final cands = [
      for (final d in cat.decisions)
        if (!pris.contains(d.id) && d.convient(s.role, moments[j], situation) && _vrai(d.when, ctx)) d,
    ];
    if (cands.isEmpty) continue;
    var moins = 1 << 30;
    for (final d in cands) {
      final n = vus[d.id] ?? 0;
      if (n < moins) moins = n;
    }
    final pool = [for (final d in cands) if ((vus[d.id] ?? 0) == moins) d];
    final total = pool.fold<int>(0, (a, d) => a + (d.poids < 1 ? 1 : d.poids));
    var r = x * total;
    var choisie = pool.last;
    for (final d in pool) {
      r -= d.poids < 1 ? 1 : d.poids;
      if (r < 0) {
        choisie = d;
        break;
      }
    }
    pris.add(choisie.id);
    final extra = {'minute': '$m', 'score': '$pour-$contre', 'adv': adv, 'Adv': _maj(adv)};
    String f(String t) => formatText(t, s, extra: extra);
    prevues.add(DecisionPrevue(
      def: choisie,
      minute: m,
      pour: pour,
      contre: contre,
      situation: situation,
      texte: f(choisie.texte),
      labels: [f(choisie.gauche.label), f(choisie.droite.label)],
      reponses: [f(choisie.gauche.reponse), f(choisie.droite.reponse)],
    ));
  }
  if (prevues.isEmpty) return null;
  return ScenarioDirect(
    saison: s.season,
    blocs: b,
    base: base,
    adversaire: adversaire,
    adv: adv,
    derby: derby,
    finale: finale,
    fin: fin,
    buts: buts,
    decisions: prevues,
    camera: cameraDuRole(s.role),
  );
}

bool _vrai(Object? when, EvalContext c) {
  try {
    return evalWhen(when, c);
  } catch (_) {
    return false;
  }
}

String _maj(String s) => s.isEmpty ? s : s[0].toUpperCase() + s.substring(1);

/// Les décisions du script que la ville a renvoyées, dans l'ordre du script.
/// Une décision qui n'y figure pas ne compte pas : le moteur ne pèse que ce
/// qu'il a lui-même proposé.
List<(DecisionPrevue, ChoixDirect)> retenuesDirect(ScenarioDirect sc, MatchDirect m) => [
      for (final p in sc.decisions)
        if (m.choix.where((c) => c.id == p.def.id).firstOrNull case final c?) (p, c),
    ];

/// Ce que les décisions retenues font à la dernière journée, borné.
DernierMatch poidsDirect(List<(DecisionPrevue, ChoixDirect)> retenues) {
  var v = 0, n = 0;
  for (final (p, c) in retenues) {
    final cote = p.def.cote(c.droite);
    v += cote.v.clamp(-kDirectGesteMax, kDirectGesteMax);
    n += cote.n.clamp(-kDirectGesteMax, kDirectGesteMax);
  }
  return DernierMatch(v.clamp(-kDirectPlafondV, kDirectPlafondV), n.clamp(-kDirectPlafondN, kDirectPlafondN));
}

/// La fin du match, après la dernière décision prévue : les buts qu'il faut
/// pour que le tableau dise la lettre jouée (et, parfois, un de plus), tirés
/// d'un générateur haché sur la lettre. Rend la trace complète du samedi.
TraceDirect conclureDirect(ScenarioDirect sc, List<ChoixDirect> choix, String lettre, GameState s) {
  final h = _de(s, sc.saison, sc.blocs, 'samedi-fin', lettre);
  final pour0 = sc.buts.where((b) => b[1] == 1).length;
  final d = pour0 - (sc.buts.length - pour0);
  final x = h.nextDouble();
  final sens = <int>[];
  switch (lettre) {
    case 'V':
      for (var i = d; i < 1; i++) {
        sens.add(1);
      }
      if (x < 0.25) sens.add(1);
      break;
    case 'D':
      for (var i = d; i > -1; i--) {
        sens.add(0);
      }
      if (x < 0.25) sens.add(0);
      break;
    default:
      if (d > 0) {
        for (var i = 0; i < d; i++) {
          sens.add(0);
        }
      } else if (d < 0) {
        for (var i = 0; i < -d; i++) {
          sens.add(1);
        }
      } else if (x < 0.15) {
        sens.addAll([1, 0]);
      }
  }
  for (var i = sens.length - 1; i > 0; i--) {
    final j = h.nextInt(i + 1);
    final t = sens[i];
    sens[i] = sens[j];
    sens[j] = t;
  }
  final mins = <int>[];
  for (var i = 0; i < sens.length; i++) {
    var m = h.range(sc.fin + 2, 89);
    for (var essai = 0; essai < 30 && mins.contains(m); essai++) {
      m = h.range(sc.fin + 2, 89);
    }
    mins.add(m);
  }
  mins.sort();
  return TraceDirect(
    saison: sc.saison,
    blocs: sc.blocs,
    base: sc.base,
    lettre: lettre,
    adversaire: sc.adversaire,
    fin: sc.fin,
    buts: [...sc.buts, for (var i = 0; i < mins.length; i++) [mins[i], sens[i]]],
    choix: choix,
  );
}
