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

import 'state.dart';

class EvalContext {
  final GameState state;
  final String phase;
  const EvalContext(this.state, this.phase);
}

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
    case 'objective':
      return s.objectiveTarget;
    case 'objective.promised':
      return s.objectivePromised;
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
      final last = s.cooldowns[args[0] as String];
      return last == null ? 99999 : (s.turn - last);
    case 'count':
      return s.vars[args[0] as String] ?? 0;
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
    default:
      throw StateError('Unknown function: $name');
  }
}
