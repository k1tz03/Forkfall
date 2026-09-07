/// Declarative effects attached to a card choice. All magnitudes are already
/// resolved to integers by the content build (symbolic `+`/`++`/`+++` become
/// numbers via balance.yaml), so the engine only deals with numbers.
library;

import 'rng.dart';

/// One entry in a `schedule:` list (a delayed / "sablier" chained card).
/// Delays count narrative cards: the card is due at `inMin` and must be out by
/// `inMax` (a hard deadline the director enforces — no randomness here).
class ScheduleOp {
  final String card;
  final int inMin;
  final int inMax;
  final String fallback; // 'drop' | 'nouvelles'
  final Object? cancelIf; // compiled `when` AST, or null
  final bool sameClub;
  const ScheduleOp(this.card, this.inMin, this.inMax, {this.fallback = 'drop', this.cancelIf, this.sameClub = true});

  factory ScheduleOp.fromJson(Map<String, dynamic> j) => ScheduleOp(
        j['card'] as String,
        ((j['in'] as List).first as num).toInt(),
        ((j['in'] as List).last as num).toInt(),
        fallback: j['fallback'] as String? ?? 'drop',
        cancelIf: j['cancel_if'],
        sameClub: j['same_club'] != false,
      );

  Map<String, dynamic> toJson() => {
        'card': card,
        'in': [inMin, inMax],
        if (fallback != 'drop') 'fallback': fallback,
        if (cancelIf != null) 'cancel_if': cancelIf,
        if (!sameClub) 'same_club': false,
      };
}

/// An explicit arc branch taken from a choice:
/// `next: end | abort | {step, in: [a, b], this_season}`.
class NextOp {
  final String kind; // 'end' | 'abort' | 'step'
  final String? step;
  final int inMin;
  final int inMax;
  final bool thisSeason;
  final int? atSeason; // fusée longue (spec variété §1.3)
  final List<int>? at;
  const NextOp(this.kind, {this.step, this.inMin = 1, this.inMax = 3, this.thisSeason = false, this.atSeason, this.at});

  factory NextOp.fromJson(Object j) {
    if (j is String) return NextOp(j);
    final m = (j as Map).cast<String, dynamic>();
    final range = (m['in'] as List?) ?? const [1, 3];
    return NextOp(
      'step',
      step: m['step'] as String,
      inMin: (range.first as num).toInt(),
      inMax: (range.last as num).toInt(),
      thisSeason: m['this_season'] == true,
      atSeason: (m['at_season'] as num?)?.toInt(),
      at: (m['at'] as List?)?.map((e) => (e as num).toInt()).toList(),
    );
  }

  Object toJson() => kind == 'step'
      ? {
          'step': step,
          'in': [inMin, inMax],
          if (thisSeason) 'this_season': true,
          if (atSeason != null) 'at_season': atSeason,
          if (at != null) 'at': at,
        }
      : kind;
}

/// Close another arc from a choice (`arc: [{id, status}]`).
class ArcCloseOp {
  final String id;
  final String status; // 'done' | 'abandonne'
  const ArcCloseOp(this.id, this.status);
  factory ArcCloseOp.fromJson(Map<String, dynamic> j) => ArcCloseOp(j['id'] as String, j['status'] as String? ?? 'done');
  Map<String, dynamic> toJson() => {'id': id, 'status': status};
}

/// Une variante de `react:` (spec variété §1.4) : la carte-réaction servie au
/// tirage suivant, un `if` optionnel (la première vraie gagne, la dernière n'en
/// a pas) et une `chance` optionnelle (1 `nextDouble` seulement si présente).
class ReactVariant {
  final String card;
  final Object? ifWhen;
  final double? chance;
  const ReactVariant(this.card, {this.ifWhen, this.chance});

  static List<ReactVariant> listFromJson(Object? j) {
    if (j == null) return const [];
    if (j is String) return [ReactVariant(j)];
    if (j is Map) return [ReactVariant.fromJson(j.cast<String, dynamic>())];
    return (j as List).map((e) => e is String ? ReactVariant(e) : ReactVariant.fromJson((e as Map).cast<String, dynamic>())).toList();
  }

  factory ReactVariant.fromJson(Map<String, dynamic> j) =>
      ReactVariant(j['card'] as String, ifWhen: j['if'], chance: (j['chance'] as num?)?.toDouble());

  Map<String, dynamic> toJson() => {
        'card': card,
        if (ifWhen != null) 'if': ifWhen,
        if (chance != null) 'chance': chance,
      };
}

/// L'effet `journal:` d'un choix (spec variété §1.7) : une ligne d'Almanach,
/// poids 1..3, tags libres.
class JournalOp {
  final String text;
  final int poids;
  final List<String> tags;
  const JournalOp(this.text, {this.poids = 1, this.tags = const []});

  factory JournalOp.fromJson(Object j) {
    if (j is String) return JournalOp(j);
    final m = (j as Map).cast<String, dynamic>();
    return JournalOp(m['text'] as String, poids: (m['poids'] as num?)?.toInt() ?? 1, tags: (m['tags'] as List?)?.cast<String>() ?? const []);
  }

  Object toJson() => poids == 1 && tags.isEmpty ? text : {'text': text, 'poids': poids, if (tags.isNotEmpty) 'tags': tags};
}

/// L'effet `char:` d'un choix (spec variété §1.10) : le statut et/ou l'âge d'un
/// personnage. `statut` prend une valeur de `kStatuts` ; `age` est soit un
/// nombre (âge posé), soit une opération (« +1 », « -2 »).
class CharOp {
  final String? statut;
  final String? age; // opération de `applyVarOp` ; « 17 » pose l'âge
  const CharOp({this.statut, this.age});

  factory CharOp.fromJson(Object j) {
    if (j is String) return CharOp(statut: j);
    final m = (j as Map).cast<String, dynamic>();
    return CharOp(statut: m['statut']?.toString(), age: m['age']?.toString());
  }

  Map<String, dynamic> toJson() => {
        if (statut != null) 'statut': statut,
        if (age != null) 'age': age,
      };
}

/// L'effet `club: {change: true, division: n}` (spec variété §1.11, §1.13) :
/// un nouveau club sans changement de rôle. `retour: true` ne tire pas un club
/// neuf : il rend le club d'origine (celui de la première saison), pour les
/// intrigues de rachat — l'usine reprend ce qu'elle a vendu, pas autre chose.
class ClubChangeOp {
  final bool change;
  final int? division;
  final bool retour;
  const ClubChangeOp({this.change = true, this.division, this.retour = false});

  factory ClubChangeOp.fromJson(Map<String, dynamic> j) => ClubChangeOp(
        change: j['change'] != false,
        division: (j['division'] as num?)?.toInt(),
        retour: j['retour'] == true,
      );

  Map<String, dynamic> toJson() => {
        'change': change,
        if (division != null) 'division': division,
        if (retour) 'retour': true,
      };
}

class EffectSet {
  final Map<String, int> gauges; // vestiaire/tribunes/direction/caisse
  final int force;
  final int parole;
  final int pression;
  final int age;
  final Map<String, int> relations;
  final Map<String, String> vars; // name -> op string ("+1", "=0", "max:3")
  final List<String> setFlags;
  final List<String> clearFlags;
  final List<ScheduleOp> schedule;
  final List<String> cancel;
  final List<String> unlock;
  final String? role; // career transition
  final String? end; // explicit ending id
  final bool promisePublic; // objective card: swiping this makes a public promise
  final List<RandBranch> rand;
  final NextOp? arcNext; // explicit arc branch (step cards only)
  final List<ArcCloseOp> arcClose;
  final List<String> enemy; // characters forced to -3
  final String? outcome; // issue de l'arc courant (cartes d'étape seulement)
  final List<ReactVariant> react; // carte-réaction servie au tirage suivant
  final JournalOp? journal; // ligne d'Almanach
  final Map<String, CharOp> char; // âge et statut des personnages
  final ClubChangeOp? club; // changement de club sans changement de rôle

  const EffectSet({
    this.gauges = const {},
    this.force = 0,
    this.parole = 0,
    this.pression = 0,
    this.age = 0,
    this.relations = const {},
    this.vars = const {},
    this.setFlags = const [],
    this.clearFlags = const [],
    this.schedule = const [],
    this.cancel = const [],
    this.unlock = const [],
    this.role,
    this.end,
    this.promisePublic = false,
    this.rand = const [],
    this.arcNext,
    this.arcClose = const [],
    this.enemy = const [],
    this.outcome,
    this.react = const [],
    this.journal,
    this.char = const {},
    this.club,
  });

  factory EffectSet.fromJson(Map<String, dynamic> j) {
    final gauges = <String, int>{};
    for (final g in ['vestiaire', 'tribunes', 'direction', 'caisse']) {
      if (j[g] != null) gauges[g] = (j[g] as num).toInt();
    }
    return EffectSet(
      gauges: gauges,
      force: (j['force'] as num?)?.toInt() ?? 0,
      parole: (j['parole'] as num?)?.toInt() ?? 0,
      pression: (j['pression'] as num?)?.toInt() ?? 0,
      age: (j['age'] as num?)?.toInt() ?? 0,
      relations: (j['relation'] as Map?)?.map((k, v) => MapEntry(k as String, (v as num).toInt())) ?? const {},
      vars: (j['var'] as Map?)?.map((k, v) => MapEntry(k as String, v.toString())) ?? const {},
      setFlags: (j['set'] as List?)?.cast<String>() ?? const [],
      clearFlags: (j['clear'] as List?)?.cast<String>() ?? const [],
      schedule: (j['schedule'] as List?)?.map((e) => ScheduleOp.fromJson((e as Map).cast<String, dynamic>())).toList() ?? const [],
      cancel: (j['cancel'] as List?)?.cast<String>() ?? const [],
      unlock: (j['unlock'] as List?)?.cast<String>() ?? const [],
      role: j['role'] as String?,
      end: j['end'] as String?,
      promisePublic: j['promise'] == true,
      rand: (j['rand'] as List?)?.map((e) => RandBranch.fromJson((e as Map).cast<String, dynamic>())).toList() ?? const [],
      arcNext: j['next'] == null ? null : NextOp.fromJson(j['next'] as Object),
      arcClose: (j['arc'] as List?)?.map((e) => ArcCloseOp.fromJson((e as Map).cast<String, dynamic>())).toList() ?? const [],
      enemy: (j['enemy'] as List?)?.cast<String>() ?? const [],
      outcome: j['outcome'] as String?,
      react: ReactVariant.listFromJson(j['react']),
      journal: j['journal'] == null ? null : JournalOp.fromJson(j['journal'] as Object),
      char: ((j['char'] as Map?) ?? const {}).map((k, v) => MapEntry(k.toString(), CharOp.fromJson(v as Object))),
      club: j['club'] == null ? null : ClubChangeOp.fromJson((j['club'] as Map).cast<String, dynamic>()),
    );
  }

  /// Which gauges this side touches, with a magnitude bucket for the preview
  /// dots (Reigns-style: size hints amplitude, never the sign).
  List<GaugeHint> previewHints() {
    final hints = <GaugeHint>[];
    for (final e in gauges.entries) {
      final a = e.value.abs();
      hints.add(GaugeHint(e.key, a >= 13 ? 3 : (a >= 6 ? 2 : 1)));
    }
    return hints;
  }

  Map<String, dynamic> toJson() => {
        ...gauges,
        if (force != 0) 'force': force,
        if (parole != 0) 'parole': parole,
        if (pression != 0) 'pression': pression,
        if (age != 0) 'age': age,
        if (relations.isNotEmpty) 'relation': relations,
        if (vars.isNotEmpty) 'var': vars,
        if (setFlags.isNotEmpty) 'set': setFlags,
        if (clearFlags.isNotEmpty) 'clear': clearFlags,
        if (schedule.isNotEmpty) 'schedule': schedule.map((s) => s.toJson()).toList(),
        if (cancel.isNotEmpty) 'cancel': cancel,
        if (unlock.isNotEmpty) 'unlock': unlock,
        if (role != null) 'role': role,
        if (end != null) 'end': end,
        if (promisePublic) 'promise': true,
        if (rand.isNotEmpty) 'rand': rand.map((r) => r.toJson()).toList(),
        if (arcNext != null) 'next': arcNext!.toJson(),
        if (arcClose.isNotEmpty) 'arc': arcClose.map((a) => a.toJson()).toList(),
        if (enemy.isNotEmpty) 'enemy': enemy,
        if (outcome != null) 'outcome': outcome,
        if (react.isNotEmpty) 'react': react.map((r) => r.toJson()).toList(),
        if (journal != null) 'journal': journal!.toJson(),
        if (char.isNotEmpty) 'char': char.map((k, v) => MapEntry(k, v.toJson())),
        if (club != null) 'club': club!.toJson(),
      };
}

class RandBranch {
  final double p; // 0 means "the rest"
  final EffectSet effects;
  const RandBranch(this.p, this.effects);

  factory RandBranch.fromJson(Map<String, dynamic> j) => RandBranch(
        (j['p'] as num?)?.toDouble() ?? 0,
        EffectSet.fromJson(j.cast<String, dynamic>()..remove('p')),
      );

  Map<String, dynamic> toJson() => {'p': p, ...effects.toJson()};
}

class GaugeHint {
  final String gauge;
  final int magnitude; // 1 small, 2 medium, 3 large
  const GaugeHint(this.gauge, this.magnitude);
  Map<String, dynamic> toJson() => {'g': gauge, 'm': magnitude};
}

/// Apply a variable operation ("+1", "-2", "=0", "max:3", "min:5") to a value.
int applyVarOp(int current, String op) {
  op = op.trim();
  if (op.startsWith('max:')) return current > int.parse(op.substring(4)) ? current : int.parse(op.substring(4));
  if (op.startsWith('min:')) return current < int.parse(op.substring(4)) ? current : int.parse(op.substring(4));
  if (op.startsWith('=')) return int.parse(op.substring(1));
  if (op.startsWith('+')) return current + int.parse(op.substring(1));
  if (op.startsWith('-')) return current - int.parse(op.substring(1));
  return int.tryParse(op) ?? current;
}

/// Pick a rand branch deterministically from [rng].
RandBranch? pickRand(List<RandBranch> branches, Rng rng) {
  if (branches.isEmpty) return null;
  final roll = rng.nextDouble();
  double acc = 0;
  RandBranch? fallback;
  for (final b in branches) {
    if (b.p <= 0) {
      fallback = b;
      continue;
    }
    acc += b.p;
    if (roll < acc) return b;
  }
  return fallback ?? branches.last;
}
