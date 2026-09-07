/// Runtime content model, loaded from the compiled `content/build/content.json`
/// (produced from the YAML source by tools/build_content.dart).
library;

import 'effects.dart';

class Choice {
  final String label;
  final EffectSet effects;
  final String? answer; // consequence line shown after the swipe
  const Choice({required this.label, required this.effects, this.answer});

  factory Choice.fromJson(Map<String, dynamic> j) => Choice(
        label: j['label'] as String,
        effects: EffectSet.fromJson((j['effects'] as Map?)?.cast<String, dynamic>() ?? const {}),
        answer: j['answer'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'label': label,
        'effects': effects.toJson(),
        if (answer != null) 'answer': answer,
      };
}

class Card {
  final String id;
  final List<String> roles;
  final String arc; // the theme (file name by default): vestiaire, presse, mercato, nouvelle…
  final List<String> tags;
  final String? speaker;
  final double weight;
  final bool once;
  final int cooldown; // in narrative cards
  final int priority; // pool band 0..2 (the highest eligible band wins)
  final bool sablier;
  final Object? when; // compiled AST (List/Map/scalar) or null
  final String text;
  final Choice left;
  final Choice right;
  final List<String>? previewOverride; // force which gauges show hints
  // Narrative layer (derived by the build unless written by hand).
  final String tone; // leger | strategique | drame
  final String kind; // routine | nouvelle | passe | etape | script | evenement | alarme | palier
  final bool pool; // present in the routine bag
  final String? arcId; // arc this card is a step of
  final String? stepId;
  final String? title; // short title for « Nouvelles du passé »
  /// Nouvelle datée (spec variété §1.5) : l'année où elle dit l'époque. Elle
  /// est servie en priorité tant que `s.year ∈ [year, year + 1]` ; passée
  /// cette fenêtre elle est perdue (`stats.nouvelle_datee_perdue`).
  final int? year;

  /// Statuts du locuteur qui autorisent quand même la carte (spec variété
  /// §1.10). Par défaut un locuteur `vendu | parti | retraite | rival | mort`
  /// ne parle plus : la carte est écartée du tirage et purgée de la file.
  final List<String> statutOk;

  const Card({
    required this.id,
    required this.roles,
    required this.arc,
    required this.tags,
    required this.speaker,
    required this.weight,
    required this.once,
    required this.cooldown,
    required this.priority,
    required this.sablier,
    required this.when,
    required this.text,
    required this.left,
    required this.right,
    this.previewOverride,
    this.tone = 'leger',
    this.kind = 'routine',
    this.pool = true,
    this.arcId,
    this.stepId,
    this.title,
    this.year,
    this.statutOk = const [],
  });

  factory Card.fromJson(Map<String, dynamic> j) => Card(
        id: j['id'] as String,
        roles: (j['roles'] as List).cast<String>(),
        arc: j['arc'] as String? ?? 'divers',
        tags: (j['tags'] as List?)?.cast<String>() ?? const [],
        speaker: j['speaker'] as String?,
        weight: (j['weight'] as num?)?.toDouble() ?? 1.0,
        once: j['once'] == true,
        cooldown: (j['cooldown'] as num?)?.toInt() ?? 12,
        priority: (j['priority'] as num?)?.toInt() ?? 0,
        sablier: j['sablier'] == true,
        when: j['when'],
        text: j['text'] as String,
        left: Choice.fromJson((j['left'] as Map).cast<String, dynamic>()),
        right: Choice.fromJson((j['right'] as Map).cast<String, dynamic>()),
        previewOverride: (j['preview'] as List?)?.cast<String>(),
        tone: j['tone'] as String? ?? 'leger',
        kind: j['kind'] as String? ?? 'routine',
        pool: j['pool'] == null ? true : j['pool'] == true,
        arcId: j['arcId'] as String?,
        stepId: j['stepId'] as String?,
        title: j['title'] as String?,
        year: (j['year'] as num?)?.toInt(),
        statutOk: (j['statut_ok'] as List?)?.cast<String>() ?? const [],
      );
}

/// Les statuts d'un personnage (charte de la bible § 2.4 et § 2.4 bis,
/// spec variété §1.10). `present` est le statut de départ des visages du club ;
/// `club` et `staff` sont ses variantes explicites.
const Set<String> kStatuts = {'present', 'club', 'vendu', 'staff', 'parti', 'retraite', 'rival', 'mort'};

/// Les statuts qui laissent encore parler un locuteur sans `statut_ok:`.
const Set<String> kStatutsParlants = {'present', 'club', 'staff'};

class GaugeDef {
  final String id;
  final String label; // contextual label for this role
  final String icon;
  final String emptyEnding; // ending id when gauge hits 0
  final String fullEnding; // ending id when gauge hits 100
  const GaugeDef({
    required this.id,
    required this.label,
    required this.icon,
    required this.emptyEnding,
    required this.fullEnding,
  });

  factory GaugeDef.fromJson(Map<String, dynamic> j) => GaugeDef(
        id: j['id'] as String,
        label: j['label'] as String,
        icon: j['icon'] as String? ?? j['id'] as String,
        emptyEnding: j['empty'] as String,
        fullEnding: j['full'] as String,
      );
}

class TransitionDef {
  final String to;
  final Object? when;
  final String label; // text of the Destin card offer
  final String? answer;
  const TransitionDef({required this.to, required this.when, required this.label, this.answer});

  factory TransitionDef.fromJson(Map<String, dynamic> j) => TransitionDef(
        to: j['to'] as String,
        when: j['when'],
        label: j['label'] as String,
        answer: j['answer'] as String?,
      );
}

class RoleDef {
  final String id;
  final String name;
  final List<GaugeDef> gauges; // exactly 4, in HUD order
  final String fragileGauge; // takes passive drift
  final int startAgeMin;
  final int startAgeMax;
  final List<TransitionDef> transitions;
  final String matchPostureLeft;
  final String matchPostureRight;
  final String? patron; // default speaker of the Objectif / Contrat cards

  const RoleDef({
    required this.id,
    required this.name,
    required this.gauges,
    required this.fragileGauge,
    required this.startAgeMin,
    required this.startAgeMax,
    required this.transitions,
    required this.matchPostureLeft,
    required this.matchPostureRight,
    this.patron,
  });

  factory RoleDef.fromJson(Map<String, dynamic> j) => RoleDef(
        id: j['id'] as String,
        name: j['name'] as String,
        gauges: (j['gauges'] as List).map((g) => GaugeDef.fromJson((g as Map).cast<String, dynamic>())).toList(),
        fragileGauge: j['fragile'] as String,
        startAgeMin: (j['age'] as List?)?.first as int? ?? 30,
        startAgeMax: (j['age'] as List?)?.last as int? ?? 40,
        transitions: (j['transitions'] as List?)?.map((t) => TransitionDef.fromJson((t as Map).cast<String, dynamic>())).toList() ?? const [],
        matchPostureLeft: (j['posture'] as List?)?.first as String? ?? 'Offensif',
        matchPostureRight: (j['posture'] as List?)?.last as String? ?? 'Prudent',
        patron: j['patron'] as String?,
      );

  GaugeDef gauge(String id) => gauges.firstWhere((g) => g.id == id);
}

class EndingDef {
  final String id;
  final String title;
  final String epitaph;
  final String? gauge; // which gauge caused it (barred icon), if any
  final String? side; // 'vide' or 'plein'
  final String rarity; // commune/rare/epique/legendaire
  final bool golden; // "good" endings shown gilded
  final bool share; // false = no share image (sober drama endings)
  /// Seconde phrase conditionnelle (spec variété §2.6) : la première vraie.
  final List<TextVariant> epitaphPlus;
  final Map<String, dynamic>? rebond; // parsé, non lu (lot ultérieur)
  const EndingDef({
    required this.id,
    required this.title,
    required this.epitaph,
    this.gauge,
    this.side,
    this.rarity = 'commune',
    this.golden = false,
    this.share = true,
    this.epitaphPlus = const [],
    this.rebond,
  });

  factory EndingDef.fromJson(Map<String, dynamic> j) => EndingDef(
        id: j['id'] as String,
        title: j['title'] as String,
        epitaph: j['epitaph'] as String,
        gauge: j['gauge'] as String?,
        side: j['side'] as String?,
        rarity: j['rarity'] as String? ?? 'commune',
        golden: j['golden'] == true,
        share: j['share'] != false,
        epitaphPlus: TextVariant.listFromJson(j['epitaph_plus']),
        rebond: (j['rebond'] as Map?)?.cast<String, dynamic>(),
      );
}

/// Un texte gardé par un `when` optionnel (epitaph_plus, set-pieces).
class TextVariant {
  final Object? when;
  final String text;
  const TextVariant(this.text, {this.when});

  static List<TextVariant> listFromJson(Object? j) {
    if (j == null) return const [];
    return (j as List).map((e) {
      if (e is String) return TextVariant(e);
      final m = (e as Map).cast<String, dynamic>();
      return TextVariant(m['text'] as String, when: m['when']);
    }).toList();
  }
}

/// Un journal fictif de la Une (spec variété §2.4).
class JournalDef {
  final String id;
  final String nom;
  final String ton;
  final String style;
  const JournalDef({required this.id, required this.nom, this.ton = 'sobre', this.style = 'bleu'});
  factory JournalDef.fromJson(Map<String, dynamic> j) => JournalDef(
        id: j['id'] as String,
        nom: j['nom'] as String,
        ton: j['ton'] as String? ?? 'sobre',
        style: j['style'] as String? ?? 'bleu',
      );
}

/// Une manchette candidate au Bilan (spec variété §1.6, §2.4).
class UneDef {
  final String id;
  final List<String> postulats; // vide = tous
  final List<String> roles; // vide = tous
  final String journal;
  final int priority; // 0 secours … 4 titre/descente
  final double poids;
  final Object? when;
  final String titre;
  final String sous;
  final String? sujet; // tag exclu des brèves
  final String? photo; // carte fatale préférée si servie cette saison
  final List<ReactVariant> react;
  const UneDef({
    required this.id,
    this.postulats = const [],
    this.roles = const [],
    required this.journal,
    this.priority = 0,
    this.poids = 1.0,
    this.when,
    required this.titre,
    this.sous = '',
    this.sujet,
    this.photo,
    this.react = const [],
  });

  factory UneDef.fromJson(Map<String, dynamic> j) => UneDef(
        id: j['id'] as String,
        postulats: (j['postulats'] as List?)?.cast<String>() ?? const [],
        roles: (j['roles'] as List?)?.cast<String>() ?? const [],
        journal: j['journal'] as String? ?? 'quotidien',
        priority: (j['priority'] as num?)?.toInt() ?? 0,
        poids: (j['poids'] as num?)?.toDouble() ?? 1.0,
        when: j['when'],
        titre: j['titre'] as String,
        sous: j['sous'] as String? ?? '',
        sujet: j['sujet'] as String?,
        photo: j['photo'] as String?,
        react: ReactVariant.listFromJson(j['react']),
      );
}

class FeatDef {
  final String id;
  final String title;
  final String desc;
  final bool secret;
  const FeatDef({required this.id, required this.title, required this.desc, this.secret = false});
  factory FeatDef.fromJson(Map<String, dynamic> j) => FeatDef(
        id: j['id'] as String,
        title: j['title'] as String,
        desc: j['desc'] as String? ?? '',
        secret: j['secret'] == true,
      );
}

class Beat {
  final String phase;
  final String kind;
  const Beat(this.phase, this.kind);
}

// ---------------------------------------------------------------------------
// Narrative layer: characters, arcs, postulats, alarms, director config.
// ---------------------------------------------------------------------------

/// A card id guarded by an optional `if` (first true variant wins; the last
/// one never has an `if`).
class StepVariant {
  final String id;
  final Object? ifWhen;
  const StepVariant(this.id, this.ifWhen);

  static List<StepVariant> listFromJson(Object? j) {
    if (j == null) return const [];
    if (j is String) return [StepVariant(j, null)];
    return (j as List)
        .map((e) => e is String ? StepVariant(e, null) : StepVariant((e as Map)['id'] as String, e['if']))
        .toList();
  }
}

class NextDef {
  final String step;
  final Object? ifWhen;
  final int inMin;
  final int inMax;
  final bool thisSeason;
  /// « Fusée longue » (spec variété §1.3) : l'étape est enfilée pour la saison
  /// `season + atSeason`, aux slots absolus `at` de cette saison-là.
  final int? atSeason;
  final List<int>? at;
  const NextDef({required this.step, this.ifWhen, this.inMin = 1, this.inMax = 3, this.thisSeason = false, this.atSeason, this.at});

  factory NextDef.fromJson(Map<String, dynamic> j) {
    final range = (j['in'] as List?) ?? const [1, 3];
    return NextDef(
      step: j['step'] as String,
      ifWhen: j['if'],
      inMin: (range.first as num).toInt(),
      inMax: (range.last as num).toInt(),
      thisSeason: j['this_season'] == true,
      atSeason: (j['at_season'] as num?)?.toInt(),
      at: (j['at'] as List?)?.map((e) => (e as num).toInt()).toList(),
    );
  }

  bool get isLongFuse => atSeason != null;
}

class StepDef {
  final String id;
  final List<StepVariant> card;
  final List<int>? at; // absolute [slotMin, slotMax] (postulat scripts)
  final String season; // '0', '1', … or 'k+' (every season >= k)
  final List<NextDef> next;
  final String onExpire; // 'skip' | 'abort'
  final bool thisSeason;
  final String? outcome; // issue posée quand l'étape est jouée (spec variété §1.3)
  /// Statuts du locuteur qui autorisent l'étape (spec variété §1.10) : posé sur
  /// l'étape, il vaut pour toutes ses variantes (l'union avec le `statut_ok:`
  /// de la carte servie).
  final List<String> statutOk;
  const StepDef({
    required this.id,
    required this.card,
    this.at,
    this.season = '0',
    this.next = const [],
    this.onExpire = 'abort',
    this.thisSeason = false,
    this.outcome,
    this.statutOk = const [],
  });

  factory StepDef.fromJson(Map<String, dynamic> j) => StepDef(
        id: j['id'] as String,
        card: StepVariant.listFromJson(j['card']),
        at: (j['at'] as List?)?.map((e) => (e as num).toInt()).toList(),
        season: j['season']?.toString() ?? '0',
        next: (j['next'] as List?)?.map((e) => NextDef.fromJson((e as Map).cast<String, dynamic>())).toList() ?? const [],
        onExpire: j['on_expire'] as String? ?? 'abort',
        thisSeason: j['this_season'] == true,
        outcome: j['outcome'] as String?,
        statutOk: (j['statut_ok'] as List?)?.cast<String>() ?? const [],
      );

  bool get repeatable => season.endsWith('+');

  bool appliesTo(int s) {
    if (repeatable) return s >= (int.tryParse(season.substring(0, season.length - 1)) ?? 0);
    return int.tryParse(season) == s;
  }
}

/// Rejouabilité d'un arc (spec variété §1.3) : `never` (absent), `{after, max,
/// after_abort}` ou `ritual` (= every_season + variantes en escalier sur plays()).
class ReplayDef {
  final int after;
  final int max;
  final bool afterAbort;
  final bool ritual;
  const ReplayDef({this.after = 1, this.max = 2, this.afterAbort = false, this.ritual = false});

  factory ReplayDef.fromJson(Object j) {
    if (j is String) return const ReplayDef(ritual: true, after: 0, max: 9999);
    final m = (j as Map).cast<String, dynamic>();
    if (m['ritual'] == true) return const ReplayDef(ritual: true, after: 0, max: 9999);
    return ReplayDef(
      after: (m['after'] as num?)?.toInt() ?? 1,
      max: (m['max'] as num?)?.toInt() ?? 2,
      afterAbort: m['after_abort'] == true,
    );
  }
}

class ArcDef {
  final String id;
  final String? title;
  final String kind; // serie | postulat | evenement
  final List<String> roles;
  final List<String> postulats; // empty = all
  final bool foreground;
  final double weight;
  final bool once;
  final bool everySeason;
  final int minSeason;
  final Object? when;
  final double chance; // evenement only
  final List<String> cast;
  final int startMin;
  final int startMax;
  final bool sameClub;
  final Object? cancelIf;
  final String fallback; // nouvelles | drop
  final Map<String, dynamic> epilogue; // resolved effects json (+ clé `journal`)
  final List<StepDef> steps;
  // Réservoir et branches (spec variété §1.2-1.3, §2.2).
  final String? theme; // résolu par le build (défaut : `arc:` de la carte de l'étape 1)
  final String? carrier; // porteur ; défaut : cast.first
  final ReplayDef? replay;
  final List<String> requires;
  final List<String> excludes;
  final List<String> exclusiveWith; // symétrisé par le build
  final String? hint;
  final String? journal;
  final Map<String, String> traces; // drapeau → ligne d'Almanach
  final List<String> issues;

  const ArcDef({
    required this.id,
    this.title,
    required this.kind,
    required this.roles,
    this.postulats = const [],
    this.foreground = true,
    this.weight = 1.0,
    this.once = true,
    this.everySeason = false,
    this.minSeason = 0,
    this.when,
    this.chance = 0,
    this.cast = const [],
    this.startMin = 2,
    this.startMax = 7,
    this.sameClub = true,
    this.cancelIf,
    this.fallback = 'nouvelles',
    this.epilogue = const {},
    required this.steps,
    this.theme,
    this.carrier,
    this.replay,
    this.requires = const [],
    this.excludes = const [],
    this.exclusiveWith = const [],
    this.hint,
    this.journal,
    this.traces = const {},
    this.issues = const [],
  });

  factory ArcDef.fromJson(Map<String, dynamic> j) {
    final kind = j['kind'] as String? ?? 'serie';
    final start = (j['start'] as List?) ?? const [2, 7];
    final tracesRaw = (j['traces'] as Map?) ?? const {};
    final traceKeys = tracesRaw.keys.map((k) => k.toString()).toList()..sort();
    return ArcDef(
      id: j['id'] as String,
      title: j['title'] as String?,
      kind: kind,
      roles: (j['roles'] as List?)?.cast<String>() ?? const [],
      postulats: (j['postulats'] as List?)?.cast<String>() ?? const [],
      foreground: j['foreground'] != false,
      weight: (j['weight'] as num?)?.toDouble() ?? 1.0,
      once: j['once'] != false,
      everySeason: j['every_season'] == true,
      minSeason: (j['min_season'] as num?)?.toInt() ?? 0,
      when: j['when'],
      chance: (j['chance'] as num?)?.toDouble() ?? 0,
      cast: (j['cast'] as List?)?.cast<String>() ?? const [],
      startMin: (start.first as num).toInt(),
      startMax: (start.last as num).toInt(),
      sameClub: j['same_club'] != false,
      cancelIf: j['cancel_if'],
      fallback: j['fallback'] as String? ?? (kind == 'serie' ? 'nouvelles' : 'drop'),
      epilogue: (j['epilogue'] as Map?)?.cast<String, dynamic>() ?? const {},
      steps: (j['steps'] as List?)?.map((e) => StepDef.fromJson((e as Map).cast<String, dynamic>())).toList() ?? const [],
      theme: j['theme'] as String?,
      carrier: j['carrier'] as String?,
      replay: j['replay'] == null ? null : ReplayDef.fromJson(j['replay'] as Object),
      requires: (j['requires'] as List?)?.cast<String>() ?? const [],
      excludes: (j['excludes'] as List?)?.cast<String>() ?? const [],
      exclusiveWith: (j['exclusive_with'] as List?)?.cast<String>() ?? const [],
      hint: j['hint'] as String?,
      journal: j['journal'] as String?,
      traces: {for (final k in traceKeys) k: tracesRaw[k].toString()},
      issues: (j['issues'] as List?)?.cast<String>() ?? const [],
    );
  }

  /// Le porteur de l'intrigue (jamais deux porteurs identiques la même saison).
  String get carrierId => carrier ?? (cast.isEmpty ? '' : cast.first);

  /// Le thème, tel que résolu par le build (`theme` écrit dans le json).
  String get themeId => theme ?? '';

  /// Ré-armé à chaque saison : `every_season` ou `replay: ritual`.
  bool get isEverySeason => everySeason || (replay?.ritual ?? false);

  /// The queue entry kind for this arc's steps.
  String get entryKind => kind == 'postulat' ? 'script' : (kind == 'evenement' ? 'evenement' : 'etape');

  StepDef? stepById(String id) {
    for (final s in steps) {
      if (s.id == id) return s;
    }
    return null;
  }
}

class CharacterDef {
  final String id;
  final String name;
  final String label; // white band under the sticker
  final String genre; // 'f' | 'm'
  final String role;
  final String tic;
  final String camp; // terrain | direction | instances | selection
  final double? defaultTarget; // appearances per season aimed for outside a cast
  final Map<int, List<StepVariant>> onRelation; // threshold -> cards queued when crossed
  /// Comment ce personnage s'adresse à toi (`{toi}`, spec variété §1.8) :
  /// rôle → expression (sourire | neutre | noir) → gabarit (« mon {prenom} »).
  final Map<String, Map<String, String>> adresse;
  /// Âge en 1990 (spec variété §1.10) : `GameState.chars` le reprend au départ
  /// et l'incrémente d'un an à chaque ouverture de saison. Null = le
  /// personnage n'a pas d'état (il ne figure pas dans `chars`).
  final int? age;
  /// Statut initial (`kStatuts`) : `present` par défaut.
  final String statut;
  /// Retrouvailles (spec variété §1.13) : la carte servie quand tu changes de
  /// club ou de rôle, selon le visage (`sourire` : relation ≥ 0, `noir` : < 0).
  final Map<String, String> retrouvailles;

  const CharacterDef({
    required this.id,
    required this.name,
    this.label = '',
    this.genre = 'm',
    this.role = '',
    this.tic = '',
    this.camp = 'terrain',
    this.defaultTarget,
    this.onRelation = const {},
    this.adresse = const {},
    this.age,
    this.statut = 'present',
    this.retrouvailles = const {},
  });

  /// Le gabarit d'adresse pour un rôle et une expression, ou null.
  String? adresseFor(String role, String expression) => adresse[role]?[expression];

  factory CharacterDef.fromJson(Map<String, dynamic> j) {
    final onRel = <int, List<StepVariant>>{};
    final adresse = <String, Map<String, String>>{};
    ((j['adresse'] as Map?) ?? const {}).forEach((role, byExpr) {
      adresse[role.toString()] = ((byExpr as Map).cast<String, dynamic>()).map((k, v) => MapEntry(k, v.toString()));
    });
    ((j['on_relation'] as Map?) ?? const {}).forEach((k, v) {
      final t = int.tryParse(k.toString());
      if (t != null) onRel[t] = StepVariant.listFromJson(v);
    });
    return CharacterDef(
      id: j['id'] as String,
      name: j['name'] as String,
      label: j['label'] as String? ?? '',
      genre: j['genre'] as String? ?? 'm',
      role: j['role'] as String? ?? '',
      tic: j['tic'] as String? ?? '',
      camp: j['camp'] as String? ?? 'terrain',
      defaultTarget: (j['default_target'] as num?)?.toDouble(),
      onRelation: onRel,
      adresse: adresse,
      age: (j['age'] as num?)?.toInt(),
      statut: j['statut'] as String? ?? 'present',
      retrouvailles: ((j['retrouvailles'] as Map?) ?? const {}).map((k, v) => MapEntry(k.toString(), v.toString())),
    );
  }
}

class CastEntry {
  final String fonction;
  final double target;
  const CastEntry(this.fonction, this.target);
}

class SeedDef {
  final String arc;
  final int season;
  final int atMin;
  final int atMax;
  final Object? ifWhen;
  const SeedDef({required this.arc, required this.season, required this.atMin, required this.atMax, this.ifWhen});

  factory SeedDef.fromJson(Map<String, dynamic> j) {
    final at = (j['at'] as List?) ?? const [1, 17];
    return SeedDef(
      arc: j['arc'] as String,
      season: (j['season'] as num?)?.toInt() ?? 0,
      atMin: (at.first as num).toInt(),
      atMax: (at.last as num).toInt(),
      ifWhen: j['if'],
    );
  }
}

/// Une entrée du réservoir (spec variété §1.2) : un arc, son poids, la
/// signature (×3 en S0, au plus une par postulat) et un `if` d'entrée.
class ProgEntry {
  final String arc;
  final double poids;
  final bool signature;
  final Object? ifWhen;
  const ProgEntry({required this.arc, this.poids = 1.0, this.signature = false, this.ifWhen});

  factory ProgEntry.fromJson(Map<String, dynamic> j) => ProgEntry(
        arc: j['arc'] as String,
        poids: (j['poids'] as num?)?.toDouble() ?? 1.0,
        signature: j['signature'] == true,
        ifWhen: j['if'],
      );
}

/// Un bucket de saison du réservoir : "0", "1" ou "2+".
class BucketDef {
  final int prendre;
  final List<int> fenetre;
  final int reserve;
  final bool reprise;
  final List<ProgEntry> pool; // ordre du fichier
  const BucketDef({required this.prendre, required this.fenetre, this.reserve = 0, this.reprise = false, this.pool = const []});

  factory BucketDef.fromJson(Map<String, dynamic> j) => BucketDef(
        prendre: (j['prendre'] as num?)?.toInt() ?? 1,
        fenetre: (j['fenetre'] as List?)?.map((e) => (e as num).toInt()).toList() ?? const [2, 9],
        reserve: (j['reserve'] as num?)?.toInt() ?? 0,
        reprise: j['reprise'] == true,
        pool: (j['pool'] as List?)?.map((e) => ProgEntry.fromJson((e as Map).cast<String, dynamic>())).toList() ?? const [],
      );
}

class ProgrammeDef {
  static const List<String> bucketOrder = ['0', '1', '2+'];
  final Map<String, BucketDef> buckets;
  const ProgrammeDef(this.buckets);

  factory ProgrammeDef.fromJson(Map<String, dynamic> j) {
    final b = <String, BucketDef>{};
    for (final k in bucketOrder) {
      final raw = j[k];
      if (raw != null) b[k] = BucketDef.fromJson((raw as Map).cast<String, dynamic>());
    }
    return ProgrammeDef(b);
  }

  static String bucketKey(int season) => season <= 0 ? '0' : (season == 1 ? '1' : '2+');

  /// Le bucket de la saison (ou, à défaut, le dernier bucket déclaré avant).
  BucketDef? bucketFor(int season) {
    final key = bucketKey(season);
    final direct = buckets[key];
    if (direct != null) return direct;
    final i = bucketOrder.indexOf(key);
    for (var k = i - 1; k >= 0; k--) {
      final b = buckets[bucketOrder[k]];
      if (b != null) return b;
    }
    return null;
  }

  /// Entrées du bucket courant puis, si `reprise`, des buckets antérieurs
  /// dans l'ordre "1", "0" (ordre du fichier à l'intérieur de chaque bucket).
  List<ProgEntry> entriesWithReprise(int season) {
    final cur = bucketFor(season);
    if (cur == null) return const [];
    final out = <ProgEntry>[...cur.pool];
    if (cur.reprise) {
      final i = bucketOrder.indexOf(bucketKey(season));
      for (var k = i - 1; k >= 0; k--) {
        final b = buckets[bucketOrder[k]];
        if (b != null && b != cur) out.addAll(b.pool);
      }
    }
    return out;
  }

  /// Toutes les entrées des buckets ≤ saison (pour `eligibleArcs`).
  List<ProgEntry> entriesUpTo(int season) {
    final i = bucketOrder.indexOf(bucketKey(season));
    final out = <ProgEntry>[];
    for (var k = 0; k <= i; k++) {
      final b = buckets[bucketOrder[k]];
      if (b != null) out.addAll(b.pool);
    }
    return out;
  }
}

class QuestionDef {
  final String id;
  final double poids;
  const QuestionDef(this.id, this.poids);
  factory QuestionDef.fromJson(Map<String, dynamic> j) => QuestionDef(j['id'] as String, (j['poids'] as num?)?.toDouble() ?? 1.0);
}

class ObjectifDef {
  final String id;
  final String titre;
  final Object? when;
  final String indice;
  const ObjectifDef({required this.id, required this.titre, this.when, this.indice = ''});
  factory ObjectifDef.fromJson(Map<String, dynamic> j) => ObjectifDef(
        id: j['id'] as String,
        titre: j['titre'] as String? ?? j['id'] as String,
        when: j['when'],
        indice: j['indice'] as String? ?? '',
      );
}

class AlarmEntry {
  final String card;
  final Object? when;
  const AlarmEntry(this.card, this.when);
  factory AlarmEntry.fromJson(Object j) {
    if (j is String) return AlarmEntry(j, null);
    final m = (j as Map).cast<String, dynamic>();
    return AlarmEntry(m['card'] as String, m['when']);
  }
}

class PostulatDef {
  final String id;
  final int index;
  final String role;
  final String title;
  final String question;
  final int division;
  final int year;
  final Map<String, int> gauges;
  final int force;
  final String? objective;
  final List<String> flags;
  final String? president;
  final bool camille;
  final Map<String, CastEntry> cast;
  final String? openingArc;
  final List<SeedDef> seeds; // déprécié : gardé pour les tests synthétiques et les postulats en chantier
  final Map<String, List<AlarmEntry>> alarmOverrides;
  final String pitch;
  final bool chantier;
  final ProgrammeDef? programme;
  final List<QuestionDef> questions;
  final List<ObjectifDef> objectifs;

  const PostulatDef({
    required this.id,
    required this.index,
    required this.role,
    required this.title,
    this.question = '',
    required this.division,
    this.year = 1990,
    required this.gauges,
    required this.force,
    this.objective,
    this.flags = const [],
    this.president,
    this.camille = false,
    this.cast = const {},
    this.openingArc,
    this.seeds = const [],
    this.alarmOverrides = const {},
    this.pitch = '',
    this.chantier = false,
    this.programme,
    this.questions = const [],
    this.objectifs = const [],
  });

  factory PostulatDef.fromJson(Map<String, dynamic> j) {
    final cast = <String, CastEntry>{};
    ((j['cast'] as Map?) ?? const {}).forEach((k, v) {
      final m = (v as Map).cast<String, dynamic>();
      cast[k.toString()] = CastEntry(m['fonction']?.toString() ?? '', (m['target'] as num?)?.toDouble() ?? 1.0);
    });
    final overrides = <String, List<AlarmEntry>>{};
    ((j['alarm_overrides'] as Map?) ?? const {}).forEach((k, v) {
      overrides[k.toString()] = (v as List).map((e) => AlarmEntry.fromJson(e as Object)).toList();
    });
    return PostulatDef(
      id: j['id'] as String,
      index: (j['index'] as num?)?.toInt() ?? 0,
      role: j['role'] as String,
      title: j['title'] as String,
      question: j['question'] as String? ?? '',
      division: (j['division'] as num?)?.toInt() ?? 2,
      year: (j['year'] as num?)?.toInt() ?? 1990,
      gauges: ((j['gauges'] as Map?) ?? const {}).map((k, v) => MapEntry(k.toString(), (v as num).toInt())),
      force: (j['force'] as num?)?.toInt() ?? 50,
      objective: j['objective'] as String?,
      flags: (j['flags'] as List?)?.cast<String>() ?? const [],
      president: j['president'] as String?,
      camille: j['camille'] == true,
      cast: cast,
      openingArc: j['opening_arc'] as String?,
      seeds: (j['seeds'] as List?)?.map((e) => SeedDef.fromJson((e as Map).cast<String, dynamic>())).toList() ?? const [],
      alarmOverrides: overrides,
      pitch: j['pitch'] as String? ?? '',
      chantier: j['chantier'] == true,
      programme: j['programme'] == null ? null : ProgrammeDef.fromJson((j['programme'] as Map).cast<String, dynamic>()),
      questions: (j['questions'] as List?)?.map((e) => QuestionDef.fromJson((e as Map).cast<String, dynamic>())).toList() ?? const [],
      objectifs: (j['objectifs'] as List?)?.map((e) => ObjectifDef.fromJson((e as Map).cast<String, dynamic>())).toList() ?? const [],
    );
  }
}

class DirectorConfig {
  final Map<String, List<int>> nouvelleSlots;
  final int gapMax;
  final int softStepsMax;
  final int minActive;
  final int maxActive;
  final int eventsMax;
  final int alarmsMax;
  final int reactionsMax;
  final int unesBreves;
  final int journalParSaison;
  final int ouvertureEcart; // jamais deux ouvertures d'intrigue à moins de N slots
  final Map<String, Map<String, double>> phaseMult; // tag -> phase -> multiplier

  const DirectorConfig({
    this.nouvelleSlots = const {},
    this.gapMax = 3,
    this.softStepsMax = 8,
    this.minActive = 2,
    this.maxActive = 3,
    this.eventsMax = 1,
    this.alarmsMax = 3,
    this.reactionsMax = 4,
    this.unesBreves = 3,
    this.journalParSaison = 12,
    this.ouvertureEcart = 3,
    this.phaseMult = const {
      'mercato': {'presaison': 4, 'hiver': 4, 'aller': 0.2, 'retour': 0.2},
      'moment': {'retour': 2},
      'famille': {'hiver': 2},
    },
  });

  factory DirectorConfig.fromJson(Map<String, dynamic>? j) {
    if (j == null) return const DirectorConfig();
    final slots = <String, List<int>>{};
    ((j['nouvelle_slots'] as Map?) ?? const {}).forEach((k, v) {
      slots[k.toString()] = (v as List).map((e) => (e as num).toInt()).toList();
    });
    final pm = <String, Map<String, double>>{};
    ((j['phase_mult'] as Map?) ?? const {}).forEach((tag, phases) {
      pm[tag.toString()] = ((phases as Map).cast<String, dynamic>()).map((p, m) => MapEntry(p, (m as num).toDouble()));
    });
    final d = const DirectorConfig();
    return DirectorConfig(
      nouvelleSlots: slots,
      gapMax: (j['gap_max'] as num?)?.toInt() ?? d.gapMax,
      softStepsMax: (j['soft_steps_max'] as num?)?.toInt() ?? d.softStepsMax,
      minActive: (j['min_active'] as num?)?.toInt() ?? d.minActive,
      maxActive: (j['max_active'] as num?)?.toInt() ?? d.maxActive,
      eventsMax: (j['events_max'] as num?)?.toInt() ?? d.eventsMax,
      alarmsMax: (j['alarms_max'] as num?)?.toInt() ?? d.alarmsMax,
      reactionsMax: (j['reactions_max'] as num?)?.toInt() ?? d.reactionsMax,
      unesBreves: (j['unes_breves'] as num?)?.toInt() ?? d.unesBreves,
      journalParSaison: (j['journal_par_saison'] as num?)?.toInt() ?? d.journalParSaison,
      ouvertureEcart: (j['ouverture_ecart'] as num?)?.toInt() ?? d.ouvertureEcart,
      phaseMult: pm.isEmpty ? d.phaseMult : pm,
    );
  }

  List<int> nouvelleSlotsFor(String role) => nouvelleSlots[role] ?? const [7, 12, 14];
}

/// Une variante de set-piece (spec variété §1.12, §2.7) : le texte d'un beat
/// moteur, choisi sans aucun aléa (la première variante vraie gagne, la
/// dernière — sans `when` ni `roles` — est le secours).
class SetpieceVariant {
  final Object? when;
  final List<String> roles; // vide = tous les rôles
  final String? speaker;
  final String text;
  final String? left; // libellé de gauche (défaut : celui du Dart)
  final String? right;
  final String? answerLeft;
  final String? answerRight;
  final String? transition; // bilan_carrefour : la transition visée
  const SetpieceVariant({
    this.when,
    this.roles = const [],
    this.speaker,
    required this.text,
    this.left,
    this.right,
    this.answerLeft,
    this.answerRight,
    this.transition,
  });

  /// Le secours : la variante sans condition qui reprend le texte historique.
  /// Une variante `transition:` n'en est jamais une (elle ne sert qu'au
  /// Carrefour qui propose cette transition).
  bool get isSecours => when == null && roles.isEmpty && transition == null;

  factory SetpieceVariant.fromJson(Map<String, dynamic> j) => SetpieceVariant(
        when: j['when'],
        roles: (j['roles'] as List?)?.cast<String>() ?? const [],
        speaker: j['speaker'] as String?,
        text: j['text'] as String? ?? '',
        left: j['left'] as String?,
        right: j['right'] as String?,
        answerLeft: j['answer_left'] as String?,
        answerRight: j['answer_right'] as String?,
        transition: j['transition'] as String?,
      );
}

/// Les beats moteur dont le texte est auteurisable (spec variété §1.12).
const List<String> kSetpieceBeats = [
  'objective', 'match', 'cup', 'gm_annonce', 'gm_te', 'aftermatch',
  'bilan_verdict', 'bilan_contrat', 'bilan_carrefour',
];

class Content {
  final int version;
  final String hash;
  final Map<String, RoleDef> roles;
  final Map<String, Card> cards;
  final Map<String, EndingDef> endings;
  final Map<String, FeatDef> feats;
  final Map<String, List<Beat>> seasonBeats; // per role
  final Map<String, dynamic> names; // fr names
  final Map<String, dynamic> divisionTables;
  final Map<String, CharacterDef> characters;
  final Map<String, ArcDef> arcs;
  final Map<String, PostulatDef> postulats;
  final Map<String, Map<String, List<AlarmEntry>>> alarms; // role -> 'gauge.side' -> candidates
  final DirectorConfig director;
  final Map<String, dynamic> portraits; // id -> fiche de portrait (content/portraits.yaml), {} si absente
  final List<String> themes; // thèmes fermés (content/tags.yaml → themes)
  final List<UneDef> unes; // manchettes, ordre du fichier (content/unes.yaml)
  final Map<String, JournalDef> journaux; // journaux fictifs de la Une
  final Map<String, String> journalTemplates; // gabarits moteur (content/journal.yaml → auto)
  final List<String> blacklist; // liste noire des noms (content/names/blacklist.yaml)
  final Map<String, String> themeLabels; // thème → libellé (content/tags.yaml → theme_labels)
  /// Beat moteur → variantes de texte, dans l'ordre du fichier
  /// (content/setpieces.yaml, spec variété §2.7).
  final Map<String, List<SetpieceVariant>> setpieces;

  // Derived indexes.
  final Map<String, List<Card>> _cardsByRole = {};
  final Map<String, List<Card>> _poolByRole = {};
  final Map<String, List<Card>> _nouvellesByRole = {};
  late final List<ArcDef> arcsSorted;
  late final List<PostulatDef> postulatsByIndex;
  late final List<CharacterDef> charactersSorted;
  final Map<String, int> _cardSlots = {};
  /// Drapeau → arc qui le déclare en `traces:` (première déclaration dans
  /// l'ordre des arcs triés).
  final Map<String, String> tracesIndex = {};

  Content({
    required this.version,
    required this.hash,
    required this.roles,
    required this.cards,
    required this.endings,
    required this.feats,
    required this.seasonBeats,
    required this.names,
    required this.divisionTables,
    this.characters = const {},
    this.arcs = const {},
    this.postulats = const {},
    this.alarms = const {},
    this.director = const DirectorConfig(),
    this.portraits = const {},
    this.themes = const [],
    this.unes = const [],
    this.journaux = const {},
    this.journalTemplates = const {},
    this.blacklist = const [],
    this.themeLabels = const {},
    this.setpieces = const {},
  }) {
    final ids = cards.keys.toList()..sort();
    for (final id in ids) {
      final card = cards[id]!;
      for (final r in card.roles) {
        (_cardsByRole[r] ??= <Card>[]).add(card);
        if (card.pool && card.kind == 'routine') (_poolByRole[r] ??= <Card>[]).add(card);
        if (card.kind == 'nouvelle') (_nouvellesByRole[r] ??= <Card>[]).add(card);
      }
    }
    arcsSorted = arcs.values.toList()..sort((a, b) => a.id.compareTo(b.id));
    for (final a in arcsSorted) {
      for (final f in a.traces.keys) {
        tracesIndex.putIfAbsent(f, () => a.id);
      }
    }
    postulatsByIndex = postulats.values.toList()..sort((a, b) => a.index.compareTo(b.index));
    charactersSorted = characters.values.toList()..sort((a, b) => a.id.compareTo(b.id));
    seasonBeats.forEach((role, beats) {
      _cardSlots[role] = beats.where((b) => b.kind == 'card').length;
    });
  }

  List<Card> cardsForRole(String role) => _cardsByRole[role] ?? const [];
  List<Card> poolCards(String role) => _poolByRole[role] ?? const [];
  List<Card> nouvelles(String role) => _nouvellesByRole[role] ?? const [];
  int cardSlots(String role) => _cardSlots[role] ?? 17;

  Card? stepCard(String arcId, String stepId) {
    final st = arcs[arcId]?.stepById(stepId);
    if (st == null || st.card.isEmpty) return null;
    return cards[st.card.last.id];
  }

  factory Content.fromJson(Map<String, dynamic> j) {
    final roles = <String, RoleDef>{};
    for (final r in (j['roles'] as List)) {
      final rd = RoleDef.fromJson((r as Map).cast<String, dynamic>());
      roles[rd.id] = rd;
    }
    final cards = <String, Card>{};
    for (final c in (j['cards'] as List)) {
      final cd = Card.fromJson((c as Map).cast<String, dynamic>());
      cards[cd.id] = cd;
    }
    final endings = <String, EndingDef>{};
    for (final e in (j['endings'] as List)) {
      final ed = EndingDef.fromJson((e as Map).cast<String, dynamic>());
      endings[ed.id] = ed;
    }
    final feats = <String, FeatDef>{};
    for (final f in (j['feats'] as List? ?? const [])) {
      final fd = FeatDef.fromJson((f as Map).cast<String, dynamic>());
      feats[fd.id] = fd;
    }
    final seasonBeats = <String, List<Beat>>{};
    (j['calendar'] as Map).forEach((role, phases) {
      final beats = <Beat>[];
      for (final ph in (phases as List)) {
        final phase = (ph as Map)['phase'] as String;
        for (final b in (ph['beats'] as List)) {
          beats.add(Beat(phase, b as String));
        }
      }
      seasonBeats[role as String] = beats;
    });
    final characters = <String, CharacterDef>{};
    for (final c in (j['characters'] as List? ?? const [])) {
      final cd = CharacterDef.fromJson((c as Map).cast<String, dynamic>());
      characters[cd.id] = cd;
    }
    final arcs = <String, ArcDef>{};
    for (final a in (j['arcs'] as List? ?? const [])) {
      final ad = ArcDef.fromJson((a as Map).cast<String, dynamic>());
      arcs[ad.id] = ad;
    }
    final postulats = <String, PostulatDef>{};
    for (final p in (j['postulats'] as List? ?? const [])) {
      final pd = PostulatDef.fromJson((p as Map).cast<String, dynamic>());
      postulats[pd.id] = pd;
    }
    final alarms = <String, Map<String, List<AlarmEntry>>>{};
    ((j['alarms'] as Map?) ?? const {}).forEach((role, byKey) {
      final m = <String, List<AlarmEntry>>{};
      ((byKey as Map).cast<String, dynamic>()).forEach((key, list) {
        m[key] = (list as List).map((e) => AlarmEntry.fromJson(e as Object)).toList();
      });
      alarms[role.toString()] = m;
    });
    return Content(
      version: (j['version'] as num).toInt(),
      hash: j['hash'] as String,
      roles: roles,
      cards: cards,
      endings: endings,
      feats: feats,
      seasonBeats: seasonBeats,
      names: (j['names'] as Map).cast<String, dynamic>(),
      divisionTables: (j['divisions'] as Map).cast<String, dynamic>(),
      characters: characters,
      arcs: arcs,
      postulats: postulats,
      alarms: alarms,
      director: DirectorConfig.fromJson((j['director'] as Map?)?.cast<String, dynamic>()),
      portraits: (j['portraits'] as Map?)?.cast<String, dynamic>() ?? const {},
      themes: (j['themes'] as List?)?.cast<String>() ?? const [],
      unes: (j['unes'] as List? ?? const []).map((e) => UneDef.fromJson((e as Map).cast<String, dynamic>())).toList(),
      journaux: {
        for (final e in (j['journaux'] as List? ?? const []))
          (e as Map)['id'].toString(): JournalDef.fromJson(e.cast<String, dynamic>()),
      },
      journalTemplates: ((j['journal_templates'] as Map?) ?? const {}).map((k, v) => MapEntry(k.toString(), v.toString())),
      blacklist: (j['blacklist'] as List?)?.map((e) => e.toString()).toList() ?? const [],
      themeLabels: ((j['theme_labels'] as Map?) ?? const {}).map((k, v) => MapEntry(k.toString(), v.toString())),
      setpieces: ((j['setpieces'] as Map?) ?? const {}).map((k, v) => MapEntry(
            k.toString(),
            (v as List).map((e) => SetpieceVariant.fromJson((e as Map).cast<String, dynamic>())).toList(),
          )),
    );
  }
}
