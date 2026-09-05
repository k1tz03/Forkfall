/// Headless Monte-Carlo balancing. Runs the deterministic engine thousands of
/// times with several bot policies and reports run-length, causes of death and
/// unseen cards. Optionally asserts budgets (docs/brainstorm section 9.5).
/// Run: dart run fusible_tools:simulate --runs 5000
library;

import 'dart:io';

import 'package:fusible_core/fusible_core.dart';

Content _loadContent() {
  var dir = Directory.current;
  for (var i = 0; i < 6; i++) {
    final f = File('${dir.path}/content/build/content.json');
    if (f.existsSync()) return loadContentFromJson(f.readAsStringSync());
    final p = dir.parent;
    if (p.path == dir.path) break;
    dir = p;
  }
  stderr.writeln('content/build/content.json introuvable. Lance d\'abord build_content.');
  exit(1);
}

typedef Policy = bool Function(GameState s, int step);

bool _random(GameState s, int step) => (s.rngState ^ step) & 1 == 0;
bool _leftOnly(GameState s, int step) => false;

/// Danger cost of a gauge value: cheap in the middle, very expensive near the
/// edges (a competent player keeps clear of 0/100).
double _danger(int v) {
  final d = (v - 50).abs();
  if (d <= 20) return d / 20.0; // 0..1 in the safe band
  return 1 + (d - 20) * (d - 20) / 15.0; // steep near the edges
}

/// A competent player who has learned the cards: peeks at the real signed
/// gauge effects (the preview dots hide the sign in-game, but this is a
/// balancing tool, not a player) and picks the side that keeps gauges centred.
bool _balancer(GameState s, int step) {
  final p = s.pending!;
  if (p.single) return true;
  double score(Map<String, int> deltas) {
    double total = 0;
    for (final g in ['vestiaire', 'tribunes', 'direction', 'caisse']) {
      final projected = ((s.gauges[g] ?? 50) + (deltas[g] ?? 0)).clamp(0, 100);
      total += _danger(projected);
    }
    return total;
  }

  final l = score(p.leftEffects.gauges);
  final r = score(p.rightEffects.gauges);
  if ((l - r).abs() < 0.001) return step % 2 == 0;
  return r < l;
}

bool _humanLike(GameState s, int step) {
  // Balancer with ~18% mistakes; deterministic via rngState + step.
  final err = (((s.rngState >> 3) ^ mul32(step, 2654435761)) & 0x7FFFFFFF) % 100 < 18;
  final base = _balancer(s, step);
  return err ? !base : base;
}

class RunStats {
  int turns = 0;
  String ending = '';
  int seasons = 0;
  int roles = 1;
}

RunStats runOne(Engine engine, int seed, Policy policy, Set<String> seenCards) {
  var s = engine.start(seed, postulat: seed % engine.content.postulatsByIndex.length);
  int step = 0;
  final stats = RunStats();
  while (!s.over && step < 5000) {
    if (s.pending != null) seenCards.add(s.pending!.id);
    s = engine.choose(s, policy(s, step));
    step++;
  }
  stats.turns = s.turn;
  stats.ending = s.endingId ?? 'inconnu';
  stats.seasons = s.stats['saisons'] ?? 0;
  stats.roles = s.stats['roles'] ?? 1;
  return stats;
}

void main(List<String> args) {
  final content = _loadContent();
  final engine = Engine(content);
  int runs = 5000;
  bool assertBudgets = false;
  for (int i = 0; i < args.length; i++) {
    if (args[i] == '--runs' && i + 1 < args.length) runs = int.parse(args[i + 1]);
    if (args[i] == '--assert') assertBudgets = true;
  }

  final policies = <String, Policy>{
    'human_like': _humanLike,
    'balancer': _balancer,
    'random': _random,
    'left_only': _leftOnly,
  };

  int failures = 0;
  for (final entry in policies.entries) {
    final lengths = <int>[];
    final endings = <String, int>{};
    final seen = <String>{};
    int seasonSum = 0;
    int roleTransitions = 0;
    for (int i = 0; i < runs; i++) {
      final r = runOne(engine, i * 2654435761 & 0x7FFFFFFF, entry.value, seen);
      lengths.add(r.turns);
      endings[r.ending] = (endings[r.ending] ?? 0) + 1;
      seasonSum += r.seasons;
      roleTransitions += (r.roles - 1);
    }
    lengths.sort();
    int pct(double q) => lengths[(q * (lengths.length - 1)).round()];
    final median = pct(0.5);
    final p95 = pct(0.95);
    final maxLen = lengths.last;
    final avgSeasons = seasonSum / runs;

    stdout.writeln('── Politique "${entry.key}" ($runs runs) ──');
    stdout.writeln('  durée cartes : médiane $median · p95 $p95 · max $maxLen · saisons moy ${avgSeasons.toStringAsFixed(1)}');
    stdout.writeln('  transitions de rôle : $roleTransitions');
    final topEndings = endings.entries.toList()..sort((a, b) => b.value.compareTo(a.value));
    final causeLine = topEndings.take(6).map((e) => '${e.key} ${(100 * e.value / runs).toStringAsFixed(0)}%').join(' · ');
    stdout.writeln('  causes de fin : $causeLine');

    // Budgets checked on the human_like policy.
    if (assertBudgets && entry.key == 'human_like') {
      void check(bool ok, String msg) {
        if (!ok) {
          stderr.writeln('  BUDGET VIOLÉ : $msg');
          failures++;
        }
      }

      check(median >= 20 && median <= 320, 'médiane hors [20,320] : $median');
      check(maxLen <= 1500, 'run trop long : $maxLen > 1500');
      final maxCause = topEndings.isEmpty ? 0.0 : topEndings.first.value / runs;
      check(maxCause <= 0.55, 'une cause de mort dépasse 55% : ${topEndings.first.key} ${(100 * maxCause).toStringAsFixed(0)}%');
    }

    // Coverage report (only meaningful on the exploratory policies).
    if (entry.key == 'human_like') {
      final never = content.cards.keys.where((id) => !seen.contains(id)).toList();
      if (never.isNotEmpty) {
        stdout.writeln('  cartes jamais vues (${never.length}) : ${never.take(12).join(', ')}${never.length > 12 ? '…' : ''}');
      }
    }
  }

  if (assertBudgets && failures > 0) {
    stderr.writeln('$failures budget(s) violé(s).');
    exit(1);
  }
}
