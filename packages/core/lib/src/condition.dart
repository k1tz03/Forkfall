/// Evaluator for the compiled condition AST. The parser lives in
/// tools/build_content.dart and emits nested lists; the runtime only walks
/// them, so there is no parser embedded in the shipped app.
///
/// AST node forms (all lists):
///   ['lit', value]
///   ['path', 'gauges.direction']
///   ['and', a, b, ...]  ['or', a, b, ...]  ['not', a]
///   ['cmp', '<', left, right]
///   ['in', value, [items...]]
///   ['call', 'flag', [args...]]
library;

import 'content.dart';
import 'state.dart';

class EvalContext {
  final GameState state;
  final String phase;
  final Card? card; // the card being evaluated (for `speaker`, `speaker.relation`)
  final int slotsTotal;
  final Set<String> cast; // characters in the postulat's cast
  /// Verdict de la saison calculé sans être appliqué (spec variété §1.6) :
  /// posé par `_bilanUne` pour la phase `bilan`, null ailleurs. `bilanOutcome`
  /// est l'issue que `_resolveBilan` appliquera au swipe suivant (titre /
  /// europe / montee / barrage / maintien / descente / lanterne) : c'est elle,
  /// et non le rang, qu'une manchette lit pour titrer une descente ou une montée.
  final bool? bilanTenu;
  final int? bilanRang;
  final String? bilanOutcome;
  const EvalContext(this.state, this.phase, {this.card, this.slotsTotal = 17, this.cast = const {}, this.bilanTenu, this.bilanRang, this.bilanOutcome});

  EvalContext withCard(Card? c) => EvalContext(state, phase,
      card: c, slotsTotal: slotsTotal, cast: cast, bilanTenu: bilanTenu, bilanRang: bilanRang, bilanOutcome: bilanOutcome);
}

/// Static paths the `when` language knows (consumed by the lint).
const Set<String> kKnownPaths = {
  'gauges.vestiaire', 'gauges.tribunes', 'gauges.direction', 'gauges.caisse',
  'parole', 'pression', 'force', 'age', 'player.age', 'year', 'turn',
  'season', 'season.index', 'season.phase', 'role',
  'world.rang', 'world.serie_defaites', 'world.serie_victoires', 'world.division', 'world.rang_final',
  'objective', 'objective.promised',
  'postulat', 'ncards', 'slot', 'slots_left', 'tension', 'drames',
  'speaker', 'speaker.relation', 'last_speaker',
  'fil_rouge',
  'bilan.tenu', 'bilan.rang', 'bilan.outcome', 'reactions',
};

/// Prefixes for dynamic paths (`vars.x`, `flags.x`, `relation.x`, `stats.x`).
const List<String> kKnownPathPrefixes = ['vars.', 'flags.', 'relation.', 'stats.'];

const Set<String> kKnownCalls = {
  'flag', 'seen', 'since', 'count', 'relation', 'between', 'role_was', 'phase',
  'seen_count', 'since_arc', 'arc', 'arc_step', 'since_char', 'appearances',
  'alarm', 'enemy', 'unlocked', 'in_cast', 'expression',
  'plays', 'arc_outcome', 'theme_played', 'objectif', 'journal_has',
};

/// Evaluate a compiled `when` node. A null node means "always true".
bool evalWhen(Object? node, EvalContext ctx) {
  if (node == null) return true;
  return _truthy(_eval(node, ctx));
}

bool _truthy(Object? v) {
  if (v is bool) return v;
  if (v is num) return v != 0;
  if (v is String) return v.isNotEmpty;
  return v != null;
}

Object? _eval(Object? node, EvalContext ctx) {
  if (node is! List) return node; // bare scalar
  final op = node[0] as String;
  switch (op) {
    case 'lit':
      return node[1];
    case 'path':
      return _resolvePath(node[1] as String, ctx);
    case 'and':
      for (int i = 1; i < node.length; i++) {
        if (!_truthy(_eval(node[i], ctx))) return false;
      }
      return true;
    case 'or':
      for (int i = 1; i < node.length; i++) {
        if (_truthy(_eval(node[i], ctx))) return true;
      }
      return false;
    case 'not':
      return !_truthy(_eval(node[1], ctx));
    case 'cmp':
      return _compare(node[1] as String, _eval(node[2], ctx), _eval(node[3], ctx));
    case 'in':
      final v = _eval(node[1], ctx);
      final items = (node[2] as List).map((e) => _eval(e, ctx)).toList();
      return items.contains(v);
    case 'call':
      return _call(node[1] as String, (node[2] as List).map((e) => _eval(e, ctx)).toList(), ctx);
    default:
      throw StateError('Unknown AST op: $op');
  }
}

bool _compare(String op, Object? a, Object? b) {
  if (a is num && b is num) {
    switch (op) {
      case '<':
        return a < b;
      case '<=':
        return a <= b;
      case '>':
        return a > b;
      case '>=':
        return a >= b;
      case '==':
        return a == b;
      case '!=':
        return a != b;
    }
  }
  switch (op) {
    case '==':
      return a == b;
    case '!=':
      return a != b;
  }
  // Non-numeric ordering is meaningless; treat as false.
  return false;
}

Object? _resolvePath(String path, EvalContext ctx) {
  final s = ctx.state;
  switch (path) {
    case 'gauges.vestiaire':
      return s.gauges['vestiaire'] ?? 50;
    case 'gauges.tribunes':
      return s.gauges['tribunes'] ?? 50;
    case 'gauges.direction':
      return s.gauges['direction'] ?? 50;
    case 'gauges.caisse':
      return s.gauges['caisse'] ?? 50;
    case 'parole':
      return s.parole;
    case 'pression':
      return s.pression;
    case 'force':
      return s.force;
    case 'age':
    case 'player.age':
      return s.age;
    case 'year':
      return s.year;
    case 'turn':
      return s.turn;
    case 'season':
    case 'season.index':
      return s.season;
    case 'season.phase':
      return ctx.phase;
    case 'role':
      return s.role;
    case 'world.rang':
      return s.world.standingRank;
    case 'world.serie_defaites':
      return s.world.serieDefaites;
    case 'world.serie_victoires':
      return s.world.serieVictoires;
    case 'world.division':
      return s.world.division;
    case 'world.rang_final':
      return s.world.rangFinal;
    case 'objective':
      return s.objectiveTarget;
    case 'objective.promised':
      return s.objectivePromised;
    case 'postulat':
      return s.postulatId;
    case 'ncards':
      return s.ncards;
    case 'slot':
      return s.slot;
    case 'slots_left':
      return ctx.slotsTotal - s.slot;
    case 'tension':
      return s.tension;
    case 'drames':
      return s.drames;
    case 'speaker':
      return ctx.card?.speaker ?? '';
    case 'speaker.relation':
      final sp = ctx.card?.speaker;
      return sp == null ? 0 : (s.relations[sp] ?? 0);
    case 'last_speaker':
      return s.lastSpeaker ?? '';
    case 'fil_rouge':
      // La question tirée à l'ouverture de saison (spec variété §1.2) ; '' sans `questions`.
      return s.entities.named['fil_rouge'] ?? '';
    case 'bilan.tenu':
      // Verdict calculé sans être appliqué (spec variété §1.6) ; false hors phase bilan.
      return ctx.bilanTenu ?? false;
    case 'bilan.rang':
      return ctx.bilanRang ?? 0;
    case 'bilan.outcome':
      return ctx.bilanOutcome ?? '';
    case 'reactions':
      return s.reactionsThisSeason;
  }
  if (path.startsWith('vars.')) {
    return s.vars[path.substring(5)] ?? 0;
  }
  if (path.startsWith('flags.')) {
    return s.flags.contains(path.substring(6));
  }
  if (path.startsWith('relation.')) {
    return s.relations[path.substring(9)] ?? 0;
  }
  if (path.startsWith('stats.')) {
    return s.stats[path.substring(6)] ?? 0;
  }
  throw StateError('Unknown path: $path');
}

Object? _call(String name, List<Object?> args, EvalContext ctx) {
  final s = ctx.state;
  switch (name) {
    case 'flag':
      return s.flags.contains(args[0] as String);
    case 'seen':
      return s.cooldowns.containsKey(args[0] as String);
    case 'since':
      // In narrative cards (the cooldown clock).
      final last = s.cooldowns[args[0] as String];
      return last == null ? 99999 : (s.ncards - last);
    case 'count':
      return s.vars[args[0] as String] ?? 0;
    case 'seen_count':
      return s.seenCount[args[0] as String] ?? 0;
    case 'relation':
      return s.relations[args[0] as String] ?? 0;
    case 'between':
      final v = args[0];
      if (v is num && args[1] is num && args[2] is num) {
        return v >= (args[1] as num) && v <= (args[2] as num);
      }
      return false;
    case 'role_was':
      return s.flags.contains('role_was_${args[0]}');
    case 'phase':
      return ctx.phase == args[0];
    case 'since_arc':
      final st = s.arcs[args[0] as String];
      return st == null ? 99999 : (s.ncards - st.lastN);
    case 'arc':
      return s.arcs[args[0] as String]?.status ?? 'none';
    case 'arc_step':
      return s.arcs[args[0] as String]?.step ?? '';
    case 'since_char':
      final last = s.lastSeenChar[args[0] as String];
      return last == null ? 99999 : (s.ncards - last);
    case 'appearances':
      return s.speakerSeen[args[0] as String] ?? 0;
    case 'alarm':
      return s.alarmFired.contains('${args[0]}:${args[1]}');
    case 'enemy':
      return s.enemies.contains(args[0] as String);
    case 'unlocked':
      return s.unlocked.contains(args[0] as String);
    case 'in_cast':
      return ctx.cast.contains(args[0] as String);
    case 'expression':
      final r = s.relations[args[0] as String] ?? 0;
      return r >= 1 ? 'sourire' : (r <= -1 ? 'noir' : 'neutre');
    case 'plays':
      return s.arcs[args[0] as String]?.plays ?? 0;
    case 'arc_outcome':
      return s.arcs[args[0] as String]?.outcome ?? '';
    case 'theme_played':
      return s.themesPlayed.contains(args[0] as String);
    case 'objectif':
      return s.unlocked.contains('objectif:${args[0]}');
    case 'journal_has':
      // Une entrée de journal de la saison en cours porte ce tag (spec variété §2.11).
      final tag = args[0] as String;
      return s.journal.any((e) => e.season == s.season && e.tags.contains(tag));
    default:
      throw StateError('Unknown function: $name');
  }
}
