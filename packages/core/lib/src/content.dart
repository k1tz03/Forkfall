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
  final String arc;
  final List<String> tags;
  final String? speaker;
  final double weight;
  final bool once;
  final int cooldown;
  final int priority;
  final bool sablier;
  final Object? when; // compiled AST (List/Map/scalar) or null
  final String text;
  final Choice left;
  final Choice right;
  final List<String>? previewOverride; // force which gauges show hints

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
  const EndingDef({
    required this.id,
    required this.title,
    required this.epitaph,
    this.gauge,
    this.side,
    this.rarity = 'commune',
    this.golden = false,
  });

  factory EndingDef.fromJson(Map<String, dynamic> j) => EndingDef(
        id: j['id'] as String,
        title: j['title'] as String,
        epitaph: j['epitaph'] as String,
        gauge: j['gauge'] as String?,
        side: j['side'] as String?,
        rarity: j['rarity'] as String? ?? 'commune',
        golden: j['golden'] == true,
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

  // Derived indexes.
  final Map<String, List<Card>> _cardsByRole = {};

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
  }) {
    for (final card in cards.values) {
      for (final r in card.roles) {
        (_cardsByRole[r] ??= <Card>[]).add(card);
      }
    }
  }

  List<Card> cardsForRole(String role) => _cardsByRole[role] ?? const [];

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
    );
  }
}
