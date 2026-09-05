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
      );
}

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
  const EndingDef({
    required this.id,
    required this.title,
    required this.epitaph,
    this.gauge,
    this.side,
    this.rarity = 'commune',
    this.golden = false,
    this.share = true,
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
  const NextDef({required this.step, this.ifWhen, this.inMin = 1, this.inMax = 3, this.thisSeason = false});

  factory NextDef.fromJson(Map<String, dynamic> j) {
    final range = (j['in'] as List?) ?? const [1, 3];
    return NextDef(
      step: j['step'] as String,
      ifWhen: j['if'],
      inMin: (range.first as num).toInt(),
      inMax: (range.last as num).toInt(),
      thisSeason: j['this_season'] == true,
    );
  }
}

class StepDef {
  final String id;
  final List<StepVariant> card;
  final List<int>? at; // absolute [slotMin, slotMax] (postulat scripts)
  final String season; // '0', '1', … or 'k+' (every season >= k)
  final List<NextDef> next;
  final String onExpire; // 'skip' | 'abort'
  final bool thisSeason;
  const StepDef({
    required this.id,
    required this.card,
    this.at,
    this.season = '0',
    this.next = const [],
    this.onExpire = 'abort',
    this.thisSeason = false,
  });

  factory StepDef.fromJson(Map<String, dynamic> j) => StepDef(
        id: j['id'] as String,
        card: StepVariant.listFromJson(j['card']),
        at: (j['at'] as List?)?.map((e) => (e as num).toInt()).toList(),
        season: j['season']?.toString() ?? '0',
        next: (j['next'] as List?)?.map((e) => NextDef.fromJson((e as Map).cast<String, dynamic>())).toList() ?? const [],
        onExpire: j['on_expire'] as String? ?? 'abort',
        thisSeason: j['this_season'] == true,
      );

  bool get repeatable => season.endsWith('+');

  bool appliesTo(int s) {
    if (repeatable) return s >= (int.tryParse(season.substring(0, season.length - 1)) ?? 0);
    return int.tryParse(season) == s;
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
  final Map<String, dynamic> epilogue; // resolved effects json
  final List<StepDef> steps;

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
  });

  factory ArcDef.fromJson(Map<String, dynamic> j) {
    final kind = j['kind'] as String? ?? 'serie';
    final start = (j['start'] as List?) ?? const [2, 7];
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
    );
  }

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
  });

  factory CharacterDef.fromJson(Map<String, dynamic> j) {
    final onRel = <int, List<StepVariant>>{};
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
  final List<SeedDef> seeds;
  final Map<String, List<AlarmEntry>> alarmOverrides;

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
  final Map<String, Map<String, double>> phaseMult; // tag -> phase -> multiplier

  const DirectorConfig({
    this.nouvelleSlots = const {},
    this.gapMax = 3,
    this.softStepsMax = 8,
    this.minActive = 2,
    this.maxActive = 3,
    this.eventsMax = 1,
    this.alarmsMax = 3,
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
      phaseMult: pm.isEmpty ? d.phaseMult : pm,
    );
  }

  List<int> nouvelleSlotsFor(String role) => nouvelleSlots[role] ?? const [7, 12, 14];
}

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

  // Derived indexes.
  final Map<String, List<Card>> _cardsByRole = {};
  final Map<String, List<Card>> _poolByRole = {};
  final Map<String, List<Card>> _nouvellesByRole = {};
  late final List<ArcDef> arcsSorted;
  late final List<PostulatDef> postulatsByIndex;
  late final List<CharacterDef> charactersSorted;
  final Map<String, int> _cardSlots = {};

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
    );
  }
}
