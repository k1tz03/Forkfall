/// Headless Monte-Carlo balancing and narrative metrics. Runs the deterministic
/// engine thousands of times with several bot policies and reports run-length,
/// causes of death, unseen cards and — with `--narrative` — how well a story
/// unfolds (cadence, recurrence of faces, tones, alarms, arcs; spec §5.2).
///
/// Run:  dart run fusible_tools:simulate --runs 5000 [--assert]
///       dart run fusible_tools:simulate --narrative --postulat 0 [--runs 2000] [--assert]
///       dart run fusible_tools:simulate --trace <seed> [--postulat 0] [--seasons 2]
library;

import 'dart:io';
import 'dart:math' as math;

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

const Set<String> kStoryKinds = {'script', 'etape', 'evenement', 'palier', 'chaine'};

class RunStats {
  int turns = 0;
  String ending = '';
  int seasons = 0;
  int roles = 1;
}

// ---------------------------------------------------------------------------
// Narrative metrics (spec §5.2).
// ---------------------------------------------------------------------------

class SeasonMetrics {
  int cards = 0;
  int story = 0;
  int routine = 0;
  int steps = 0; // etape/chaine/palier served
  int stepsOverdue = 0; // … served in band 6
  int forced = 0;
  int nouvelles = 0;
  int consecutiveNouvelles = 0;
  int alarms = 0;
  int events = 0;
  int maxBacklog = 0;
  int samePairs = 0;
  int maxGap = 0;
  int lastStory = 0; // slot of the last story beat (0 = none yet)
  String? lastSpeaker;
  bool lastWasNouvelle = false;
  final Map<String, int> speakers = {};
  final Map<String, int> tones = {};
  final Map<String, int> alarmCards = {};
}

class Narrative {
  final Map<String, List<SeasonMetrics>> byBucket = {'S0': [], 'S1': [], 'S2+': []};
  final Map<String, int> misses = {};
  final Set<String> seenCards = {};
  final Set<String> s0Sequences = {};
  int famine = 0;
  int cadencePull = 0;
  int runs = 0;
  int runsWithDrame = 0;
  int runsWithVariant = 0;
  int runsWithPalier = 0;
  int arcsOpened = 0;
  int arcsClosed = 0;

  String bucket(int season) => season == 0 ? 'S0' : (season == 1 ? 'S1' : 'S2+');
}

/// Run one game to its end, optionally collecting narrative metrics and a
/// trace of every narrative card.
RunStats runOne(Engine engine, int seed, int postulat, Policy policy, Set<String> seenCards, {Narrative? nar, StringSink? trace, int maxSeasons = 99}) {
  var s = engine.start(seed, postulat: postulat);
  final content = engine.content;
  int step = 0;
  final stats = RunStats();
  var cur = SeasonMetrics(); // replaced when the first narrative card of a season shows up
  int curSeason = -1;
  final s0Ids = <String>[];
  bool hadDrame = false, hadPalier = false;
  final seasonSlots = content.cardSlots(s.role);

  void closeSeason() {
    if (curSeason < 0) return;
    final trailing = seasonSlots - cur.lastStory;
    cur.maxGap = math.max(cur.maxGap, trailing);
  }

  while (!s.over && step < 5000) {
    final p = s.pending!;
    seenCards.add(p.id);
    if (p.kind == 'narrative') {
      if (s.season >= maxSeasons) break;
      final kind = p.payload['kind'] as String? ?? 'routine';
      final tone = p.payload['tone'] as String? ?? 'leger';
      final band = (p.payload['band'] as num?)?.toInt() ?? 0;
      final sp = p.speaker;
      if (nar != null) {
        if (s.season != curSeason) {
          closeSeason();
          curSeason = s.season;
          cur = SeasonMetrics();
          nar.byBucket[nar.bucket(s.season)]!.add(cur);
        }
        final m = cur;
        m.cards += 1;
        m.tones[tone] = (m.tones[tone] ?? 0) + 1;
        if (tone == 'drame') hadDrame = true;
        if (kStoryKinds.contains(kind)) {
          m.story += 1;
          m.maxGap = math.max(m.maxGap, s.slot - m.lastStory);
          m.lastStory = s.slot;
          if (kind == 'palier') hadPalier = true;
        }
        if (kind == 'routine' || kind == 'filler') m.routine += 1;
        if (kind == 'etape' || kind == 'chaine' || kind == 'palier') {
          m.steps += 1;
          if (band == 6) m.stepsOverdue += 1;
        }
        if (p.payload['forced'] == true) m.forced += 1;
        if (kind == 'nouvelle') {
          m.nouvelles += 1;
          if (m.lastWasNouvelle) m.consecutiveNouvelles += 1;
        }
        m.lastWasNouvelle = kind == 'nouvelle';
        if (kind == 'alarme') {
          m.alarms += 1;
          m.alarmCards[p.id] = (m.alarmCards[p.id] ?? 0) + 1;
        }
        if (kind == 'evenement') m.events += 1;
        if (sp != null) {
          m.speakers[sp] = (m.speakers[sp] ?? 0) + 1;
          if (sp == m.lastSpeaker) m.samePairs += 1;
        }
        m.lastSpeaker = sp;
        final backlog = s.scheduled.where((e) => e.deadlineN <= s.ncards).length;
        m.maxBacklog = math.max(m.maxBacklog, backlog);
        if (s.season == 0) s0Ids.add(p.id);
      }
      trace?.writeln('S${s.season} · slot ${s.slot.toString().padLeft(2)} · n ${s.ncards.toString().padLeft(3)} · bande $band · ${kind.padRight(9)} · '
          '${((p.payload['arc'] as String?) ?? '').padRight(24)} ${((p.payload['step'] as String?) ?? '').padRight(12)} · ${(sp ?? '—').padRight(9)} · ${tone.padRight(11)} · ${p.id}'
          '${p.payload['forced'] == true ? '  [forcé]' : ''}');
    } else if (trace != null) {
      trace.writeln('S${s.season} ·         · n ${s.ncards.toString().padLeft(3)} ·         · ${p.kind.padRight(9)} · ${p.id}');
    }
    s = engine.choose(s, policy(s, step));
    step++;
  }
  closeSeason();
  if (nar != null) {
    nar.runs += 1;
    nar.famine += s.stats['famine'] ?? 0;
    nar.cadencePull += s.stats['cadence_pull'] ?? 0;
    s.stats.forEach((k, v) {
      if (k.startsWith('miss_')) nar.misses[k] = (nar.misses[k] ?? 0) + v;
    });
    if (hadDrame) nar.runsWithDrame += 1;
    if (hadPalier) nar.runsWithPalier += 1;
    if (s0Ids.isNotEmpty) nar.s0Sequences.add(s0Ids.take(seasonSlots).join(','));
    s.arcs.forEach((id, st) {
      nar.arcsOpened += 1;
      if (st.status == 'done') nar.arcsClosed += 1;
    });
  }
  stats.turns = s.turn;
  stats.ending = s.endingId ?? 'inconnu';
  stats.seasons = s.stats['saisons'] ?? 0;
  stats.roles = s.stats['roles'] ?? 1;
  return stats;
}

// ---------------------------------------------------------------------------

double _pct(List<num> xs, double q) {
  if (xs.isEmpty) return 0;
  final sorted = List<num>.of(xs)..sort();
  return sorted[(q * (sorted.length - 1)).round()].toDouble();
}

double _mean(Iterable<num> xs) => xs.isEmpty ? 0 : xs.fold<double>(0, (a, b) => a + b) / xs.length;

String _f(double v, [int d = 1]) => v.toStringAsFixed(d);

void _reportNarrative(Narrative nar, Content content, int postulat, bool assertBudgets) {
  final post = content.postulatsByIndex[postulat];
  final failures = <String>[];

  stdout.writeln('── Métriques narratives · postulat $postulat « ${post.title} » · ${nar.runs} runs ──');
  for (final b in ['S0', 'S1', 'S2+']) {
    final ms = nar.byBucket[b]!;
    if (ms.isEmpty) continue;
    final n = ms.length;
    final gaps = ms.map((m) => m.maxGap).toList();
    final stories = ms.map((m) => m.story).toList();
    final nouv = ms.map((m) => m.nouvelles).toList();
    final alarms = ms.map((m) => m.alarms).toList();
    final events = ms.map((m) => m.events).toList();
    final backlog = ms.map((m) => m.maxBacklog).toList();
    final forced = ms.map((m) => m.forced).toList();
    final cards = ms.fold<int>(0, (a, m) => a + m.cards);
    final pairs = ms.fold<int>(0, (a, m) => a + m.samePairs);
    final routine = ms.fold<int>(0, (a, m) => a + m.routine);
    final steps = ms.fold<int>(0, (a, m) => a + m.steps);
    final overdue = ms.fold<int>(0, (a, m) => a + m.stepsOverdue);
    final tones = <String, int>{};
    for (final m in ms) {
      m.tones.forEach((k, v) => tones[k] = (tones[k] ?? 0) + v);
    }
    final speakerTotals = <String, int>{};
    for (final m in ms) {
      m.speakers.forEach((k, v) => speakerTotals[k] = (speakerTotals[k] ?? 0) + v);
    }
    final distinct = ms.map((m) => m.speakers.length).toList();
    stdout.writeln('  [$b] $n saisons · ${_f(cards / n)} cartes/saison');
    final gapMax = gaps.isEmpty ? 0 : gaps.reduce(math.max);
    final okGap = gapMax <= 4;
    stdout.writeln('  ${okGap ? '✔' : '✗'} ${'cadence : écart max entre temps d\'histoire'.padRight(44)} max $gapMax · moy ${_f(_mean(gaps))} · P95 ${_f(_pct(gaps, 0.95), 0)}');
    if (assertBudgets && !okGap) failures.add('[$b] écart max $gapMax > 4');
    final storyP5 = _pct(stories, 0.05);
    final storyOk = b == 'S0' ? storyP5 >= 10 : storyP5 >= 8;
    stdout.writeln('  ${storyOk ? '✔' : '✗'} ${'temps d\'histoire par saison'.padRight(44)} P5 ${_f(storyP5, 0)} · médiane ${_f(_pct(stories, 0.5), 0)} · moy ${_f(_mean(stories))}');
    if (assertBudgets && !storyOk) failures.add('[$b] temps d\'histoire P5 ${_f(storyP5, 0)}');
    final pairRate = cards <= n ? 0.0 : pairs / (cards - n);
    stdout.writeln('  ${pairRate <= 0.06 ? '✔' : '✗'} ${'voix : paires consécutives même locuteur'.padRight(44)} ${_f(100 * pairRate)} %');
    if (assertBudgets && pairRate > 0.06) failures.add('[$b] paires même locuteur ${_f(100 * pairRate)} %');
    final total = tones.values.fold<int>(0, (a, v) => a + v);
    String share(String t) => total == 0 ? '0' : _f(100 * (tones[t] ?? 0) / total, 0);
    final leger = total == 0 ? 0.0 : (tones['leger'] ?? 0) / total;
    final drame = total == 0 ? 0.0 : (tones['drame'] ?? 0) / total;
    final tonesOk = leger >= 0.50 && leger <= 0.65 && drame <= 0.10 && (b != 'S0' || drame == 0);
    stdout.writeln('  ${tonesOk ? '✔' : '✗'} ${'tons léger / stratégique / drame'.padRight(44)} ${share('leger')} / ${share('strategique')} / ${share('drame')} %');
    if (assertBudgets && !tonesOk) failures.add('[$b] tons ${share('leger')}/${share('strategique')}/${share('drame')}');
    final nouvOk = nouv.where((v) => v == 3 || v == 4).length / n >= 0.95 && ms.every((m) => m.consecutiveNouvelles == 0);
    stdout.writeln('  ${nouvOk ? '✔' : '✗'} ${'Nouvelles par saison (3-4, jamais deux d\'affilée)'.padRight(44)} moy ${_f(_mean(nouv))} · 3-4 dans ${_f(100 * nouv.where((v) => v == 3 || v == 4).length / n, 0)} % · consécutives ${ms.fold<int>(0, (a, m) => a + m.consecutiveNouvelles)}');
    if (assertBudgets && !nouvOk) failures.add('[$b] Nouvelles');
    final alarmsOk = alarms.every((v) => v <= 3);
    stdout.writeln('  ${alarmsOk ? '✔' : '✗'} ${'alarmes par saison (≤ 3)'.padRight(44)} moy ${_f(_mean(alarms))} · max ${alarms.isEmpty ? 0 : alarms.reduce(math.max)}');
    final evMean = _mean(events);
    final evOk = events.every((v) => v <= 1) && (b == 'S0' || evMean >= 0.2);
    stdout.writeln('  ${evOk ? '✔' : '✗'} ${'événements par saison (≤ 1 ; ≥ 0,2 dès S1)'.padRight(44)} moy ${_f(evMean, 2)}');
    if (assertBudgets && !evOk) failures.add('[$b] événements moy ${_f(evMean, 2)}');
    final overdueRate = steps == 0 ? 0.0 : overdue / steps;
    final backlogMax = backlog.isEmpty ? 0 : backlog.reduce(math.max);
    final deadlineOk = (b == 'S0' ? overdueRate <= 0.60 : overdueRate <= 0.40) && backlogMax <= 2;
    stdout.writeln('  ${deadlineOk ? '✔' : '✗'} ${'échéances : étapes servies échues · backlog max'.padRight(44)} ${_f(100 * overdueRate, 0)} % · $backlogMax');
    if (assertBudgets && !deadlineOk) failures.add('[$b] échéances ${_f(100 * overdueRate, 0)} % / backlog $backlogMax');
    final forcedMean = _mean(forced);
    stdout.writeln('  ${forcedMean <= 0.5 ? '✔' : '✗'} ${'cadence forcée (ouvertures/tirages) par saison'.padRight(44)} moy ${_f(forcedMean, 2)}');
    final isolation = cards == 0 ? 0.0 : routine / cards;
    stdout.writeln('  ${isolation < 0.40 ? '✔' : '✗'} ${'isolement : cartes de routine sans lien'.padRight(44)} ${_f(100 * isolation, 0)} %');
    if (assertBudgets && isolation >= 0.40) failures.add('[$b] isolement ${_f(100 * isolation, 0)} %');
    stdout.writeln('    visages distincts/saison : moy ${_f(_mean(distinct))} · min ${distinct.isEmpty ? 0 : distinct.reduce(math.min)}');
    final top = speakerTotals.entries.toList()..sort((a, b2) => b2.value.compareTo(a.value));
    stdout.writeln('    apparitions/saison : ${top.take(10).map((e) => '${e.key} ${_f(e.value / n)}').join(' · ')}');
    // Cast recurrence budgets (postulat cast targets).
    if (post.cast.isNotEmpty) {
      final lines = <String>[];
      bool castOk = true;
      post.cast.forEach((ch, entry) {
        final want = entry.target >= 3 ? 3 : (entry.target >= 2 ? 2 : 1);
        final okShare = ms.where((m) => (m.speakers[ch] ?? 0) >= want).length / n;
        final need = entry.target >= 2 ? 0.90 : 0.80;
        final ok = b != 'S0' || okShare >= need || entry.target < 1;
        if (!ok) castOk = false;
        lines.add('$ch≥$want ${_f(100 * okShare, 0)}%');
      });
      stdout.writeln('  ${castOk ? '✔' : '✗'} ${'récurrence du casting (part des saisons)'.padRight(44)} ${lines.join(' · ')}');
      if (assertBudgets && !castOk && b == 'S0') failures.add('[$b] récurrence du casting');
    }
  }
  stdout.writeln('  ${nar.famine == 0 ? '✔' : '✗'} ${'famine (total)'.padRight(44)} ${nar.famine}');
  if (assertBudgets && nar.famine != 0) failures.add('famine ${nar.famine}');
  stdout.writeln('  ${nar.cadencePull / math.max(1, nar.runs) <= 0.3 ? '✔' : '✗'} ${'cadence_pull par run'.padRight(44)} ${_f(nar.cadencePull / math.max(1, nar.runs), 2)}');
  final missTotal = nar.misses.entries.where((e) => e.key != 'miss_ineligible').fold<int>(0, (a, e) => a + e.value);
  stdout.writeln('  ${missTotal / math.max(1, nar.runs) <= 1 ? '✔' : '✗'} ${'annulations par run (hors ineligible)'.padRight(44)} ${_f(missTotal / math.max(1, nar.runs), 2)} · ${nar.misses.entries.map((e) => '${e.key.substring(5)} ${e.value}').join(' · ')}');
  stdout.writeln('    drames : ${_f(100 * nar.runsWithDrame / math.max(1, nar.runs), 0)} % des runs · paliers de relation : ${_f(100 * nar.runsWithPalier / math.max(1, nar.runs), 0)} % des runs');
  stdout.writeln('    arcs ouverts/fermés par run : ${_f(nar.arcsOpened / math.max(1, nar.runs))} / ${_f(nar.arcsClosed / math.max(1, nar.runs))}');
  final never = content.cards.values.where((c) => c.roles.contains(post.role) && !nar.seenCards.contains(c.id)).toList();
  final exposure = content.cards.values.where((c) => c.roles.contains(post.role)).length;
  stdout.writeln('  ${never.length / math.max(1, exposure) < 0.10 ? '✔' : '✗'} ${'exposition : cartes du rôle jamais vues'.padRight(44)} ${never.length}/$exposure${never.isEmpty ? '' : ' : ${never.take(8).map((c) => c.id).join(', ')}${never.length > 8 ? '…' : ''}'}');
  stdout.writeln('  ${nar.s0Sequences.length >= 25 ? '✔' : '✗'} ${'entropie : séquences S0 distinctes'.padRight(44)} ${nar.s0Sequences.length}');
  if (assertBudgets && failures.isNotEmpty) {
    stderr.writeln('${failures.length} budget(s) narratif(s) violé(s) :');
    for (final f in failures) {
      stderr.writeln('  - $f');
    }
    exit(1);
  }
}

void main(List<String> args) {
  final content = _loadContent();
  final engine = Engine(content);
  int runs = 5000;
  bool assertBudgets = false;
  bool narrative = false;
  int? postulat;
  int? traceSeed;
  int maxSeasons = 99;
  for (int i = 0; i < args.length; i++) {
    if (args[i] == '--runs' && i + 1 < args.length) runs = int.parse(args[i + 1]);
    if (args[i] == '--assert') assertBudgets = true;
    if (args[i] == '--narrative') narrative = true;
    if (args[i] == '--postulat' && i + 1 < args.length) postulat = int.parse(args[i + 1]);
    if (args[i] == '--trace' && i + 1 < args.length) traceSeed = int.parse(args[i + 1]);
    if (args[i] == '--seasons' && i + 1 < args.length) maxSeasons = int.parse(args[i + 1]);
  }
  final nPost = content.postulatsByIndex.length;

  if (traceSeed != null) {
    final p = postulat ?? 0;
    stdout.writeln('── Trace · graine $traceSeed · postulat $p « ${content.postulatsByIndex[p].title} » · human_like ──');
    final r = runOne(engine, traceSeed, p, _humanLike, <String>{}, trace: stdout, maxSeasons: maxSeasons);
    stdout.writeln('fin : ${r.ending} · ${r.seasons} saison(s) · ${r.turns} beats');
    return;
  }

  if (narrative) {
    final p = postulat ?? 0;
    final n = runs == 5000 ? 2000 : runs;
    final nar = Narrative();
    for (int i = 0; i < n; i++) {
      runOne(engine, i * 2654435761 & 0x7FFFFFFF, p, _humanLike, nar.seenCards, nar: nar);
    }
    _reportNarrative(nar, content, p, assertBudgets);
    return;
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
      final seed = i * 2654435761 & 0x7FFFFFFF;
      final r = runOne(engine, seed, postulat ?? seed % nPost, entry.value, seen);
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

    stdout.writeln('── Politique "${entry.key}" ($runs runs${postulat != null ? ', postulat $postulat' : ''}) ──');
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
