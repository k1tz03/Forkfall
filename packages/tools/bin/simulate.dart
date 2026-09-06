/// Headless Monte-Carlo balancing and narrative metrics. Runs the deterministic
/// engine thousands of times with several bot policies and reports run-length,
/// causes of death, unseen cards and — with `--narrative` — how well a story
/// unfolds (cadence, recurrence of faces, tones, alarms, arcs; spec §5.2) and
/// how much two careers of the same postulat differ (diversity, spec variété
/// §5.1-5.3 : Jaccard, noyau fixe, ouverture, entropie d'histoire, couverture
/// du réservoir, distance de carrière D, coutures, Unes).
///
/// Run:  dart run fusible_tools:simulate --runs 5000 [--assert]
///       dart run fusible_tools:simulate --narrative --postulat 0 [--runs 2000] [--seasons 3] [--assert]
///       dart run fusible_tools:simulate --reservoir --postulat 0 [--runs 200] [--seasons 3]
///       dart run fusible_tools:simulate --diff <seedA> <seedB> [--postulat 0] [--seasons 3]
///       dart run fusible_tools:simulate --trace <seed> [--postulat 0] [--seasons 2]
///
/// The diversity metrics have no `--assert` yet (spec §6 étape 0) : the spec
/// thresholds are printed next to the values, nothing more.
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

/// Seed of the i-th run of a metrics loop (same list for every metric).
int seedOfRun(int i) => i * 2654435761 & 0x7FFFFFFF;

/// « Temps d'histoire » (spec variété §1.1) : `reaction` is counted as soon as
/// the engine serves it.
const Set<String> kStoryKinds = {'script', 'etape', 'evenement', 'palier', 'chaine', 'reaction'};

/// « Carte d'histoire » for the Jaccard / noyau fixe sets : everything that is
/// neither routine nor Nouvelle (alarms and « passe » included : they are
/// story too, even if the gauges drive them).
const Set<String> kStoryCardKinds = {'script', 'etape', 'evenement', 'alarme', 'palier', 'chaine', 'passe', 'reaction'};

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
  int events = 0; // events armed this season (engine counter)
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

// ---------------------------------------------------------------------------
// Diversity records (spec variété §5.1-5.3). One record per run, aggregated
// afterwards ; everything is derived from the served `Pending`s and from the
// public state, with tolerant reads of the fields the engine will gain later
// (journal, reserve, themesPlayed, openingSlots, outcome, fil_rouge).
// ---------------------------------------------------------------------------

class Opening {
  final String arc;
  final int season;
  final int slot; // slot of the first step (due slot, or the serving slot when forced)
  final bool forced;
  const Opening(this.arc, this.season, this.slot, this.forced);
}

class SeasonRecord {
  final int season;
  int cards = 0;
  int story = 0;
  int routine = 0;
  bool couture = false; // a served card read a trace posed in an earlier season
  final List<String> storyCards = [];
  final List<String> firstStory = []; // ids of the first five story beats
  final List<String> arcSteps = []; // 'arc/step' in serving order
  final List<String> coutures = []; // 'card ← trace' (for --diff)
  SeasonRecord(this.season);
}

class RunRecord {
  final int seed;
  final Set<String> s0Story = {};
  final Set<String> careerStory = {};
  final List<Opening> openings = [];
  final List<String> unes = []; // one per Bilan, id when exposed, normalised text otherwise
  final Set<String> traces = {}; // flags posed during the run (initial flags excluded)
  final Set<String> seen = {};
  final List<SeasonRecord> seasons = [];
  final Map<String, String> outcomes = {}; // arc -> outcome (tolerant, absent today)
  final List<String> filRouge = []; // per season (tolerant, absent today)
  final List<String> journal = []; // tolerant, absent today
  String ending = '';
  int seasonsPlayed = 0;
  RunRecord(this.seed);

  Set<String> get intrigues => openings.map((o) => o.arc).toSet();
  Set<String> intriguesOf(int season) => openings.where((o) => o.season == season).map((o) => o.arc).toSet();
  List<Opening> openingsOf(int season) => openings.where((o) => o.season == season).toList();

  /// Sorted set of the intrigues opened in S0 — « ensemble S0 ».
  String get s0Set => (intriguesOf(0).toList()..sort()).join(',');

  /// Same, ordered by opening slot — « programme S0 ».
  String get s0Programme {
    final o = openingsOf(0)..sort((a, b) => a.slot != b.slot ? a.slot.compareTo(b.slot) : a.arc.compareTo(b.arc));
    return o.map((e) => '${e.arc}@${e.slot}').join(',');
  }
}

/// Flags the engine flips at every Bilan : they carry last season's verdict,
/// not a story trace (spec variété §1.6), so neither J(traces) nor the
/// coutures count them.
const Set<String> kVerdictFlags = {'bilan_tenu', 'bilan_manque'};

/// Which traces a compiled `when` reads : `flag('x')` / `flags.x` → `flag:x`,
/// `relation.x` / `relation('x')` → `rel:x`, `vars.x` → `var:x`, `enemy('x')` → `enemy:x`.
void _collectReads(Object? node, Set<String> out) {
  if (node is! List || node.isEmpty) return;
  final op = node[0];
  if (op == 'path' && node.length > 1) {
    final p = node[1].toString();
    if (p.startsWith('flags.')) out.add('flag:${p.substring(6)}');
    if (p.startsWith('relation.')) out.add('rel:${p.substring(9)}');
    if (p.startsWith('vars.')) out.add('var:${p.substring(5)}');
    return;
  }
  if (op == 'call' && node.length > 2) {
    final name = node[1].toString();
    final args = node[2];
    String? lit0;
    if (args is List && args.isNotEmpty) {
      final a = args[0];
      if (a is List && a.length > 1 && a[0] == 'lit') lit0 = a[1].toString();
    }
    if (lit0 != null) {
      if (name == 'flag') out.add('flag:$lit0');
      if (name == 'relation') out.add('rel:$lit0');
      if (name == 'enemy') out.add('enemy:$lit0');
    }
    if (args is List) {
      for (final a in args) {
        _collectReads(a, out);
      }
    }
    return;
  }
  for (int i = 1; i < node.length; i++) {
    _collectReads(node[i], out);
  }
}

/// The conditions attached to a served card : its own `when`, the `if` of the
/// step variant that selected it, the `when` of the alarm entry that names it.
Set<String> _readsOf(Content content, GameState s, Pending p) {
  final out = <String>{};
  final card = content.cards[p.id];
  if (card == null) return out;
  _collectReads(card.when, out);
  final arcId = p.payload['arc'] as String?;
  final stepId = p.payload['step'] as String?;
  if (arcId != null && stepId != null) {
    final st = content.arcs[arcId]?.stepById(stepId);
    if (st != null) {
      for (final v in st.card) {
        if (v.id == p.id) _collectReads(v.ifWhen, out);
      }
    }
  }
  if (p.payload['kind'] == 'alarme') {
    void scan(Map<String, List<AlarmEntry>>? m) {
      if (m == null) return;
      final keys = m.keys.toList()..sort();
      for (final k in keys) {
        for (final e in m[k]!) {
          if (e.card == p.id) _collectReads(e.when, out);
        }
      }
    }

    scan(content.alarms[s.role]);
    scan(content.postulats[s.postulatId]?.alarmOverrides);
  }
  return out;
}

String _normaliseUne(GameState s, String text) {
  // The entity names (club, ville, …) would make two identical headlines look
  // different ; swap them for their placeholder before comparing.
  final entries = s.entities.named.entries.where((e) => e.value.length >= 3).toList()
    ..sort((a, b) => b.value.length != a.value.length ? b.value.length.compareTo(a.value.length) : a.key.compareTo(b.key));
  var t = text;
  for (final e in entries) {
    t = t.replaceAll(e.value, '{${e.key}}');
  }
  return t.replaceAll(s.entities.protagonist, '{protagonist}');
}

/// Run one game to its end, optionally collecting narrative metrics, a
/// diversity record and a trace of every narrative card.
RunStats runOne(Engine engine, int seed, int postulat, Policy policy, Set<String> seenCards,
    {Narrative? nar, RunRecord? rec, StringSink? trace, int maxSeasons = 99}) {
  var s = engine.start(seed, postulat: postulat);
  final content = engine.content;
  int step = 0;
  final stats = RunStats();
  var cur = SeasonMetrics(); // replaced when the first narrative card of a season shows up
  int curSeason = -1;
  final s0Ids = <String>[];
  bool hadDrame = false, hadPalier = false;
  final seasonSlots = content.cardSlots(s.role);

  // Diversity bookkeeping.
  SeasonRecord? curRec;
  final arcStatus = <String, String>{}; // arc -> last known status
  final initialFlags = Set.of(s.flags);
  final tracePosed = <String, int>{}; // 'flag:x' | 'rel:x' | 'var:x' | 'enemy:x' -> season posed
  final relBase = Map.of(s.relations);
  final varBase = Map.of(s.vars);

  void closeSeason({bool over = false}) {
    if (curSeason < 0) return;
    if (over) return; // a run that died mid-season leaves no "hole" behind it
    final trailing = seasonSlots - cur.lastStory;
    cur.maxGap = math.max(cur.maxGap, trailing);
  }

  void noteTraces(int season) {
    for (final f in s.flags) {
      if (initialFlags.contains(f) || kVerdictFlags.contains(f)) continue;
      tracePosed.putIfAbsent('flag:$f', () => season);
      rec?.traces.add(f);
    }
    s.relations.forEach((k, v) {
      if (relBase[k] != v) tracePosed.putIfAbsent('rel:$k', () => season);
    });
    s.vars.forEach((k, v) {
      if (varBase[k] != v) tracePosed.putIfAbsent('var:$k', () => season);
    });
    for (final e in s.enemies) {
      tracePosed.putIfAbsent('enemy:$e', () => season);
    }
  }

  void noteOpenings() {
    if (rec == null) return;
    final ids = s.arcs.keys.toList()..sort();
    for (final id in ids) {
      final st = s.arcs[id]!;
      final prev = arcStatus[id];
      arcStatus[id] = st.status;
      final a = content.arcs[id];
      if (a == null || a.kind != 'serie') continue;
      final live = st.status == 'armed' || st.status == 'active';
      final wasLive = prev == 'armed' || prev == 'active';
      if (!live || wasLive) continue;
      // An opening : find its slot (first step due) and whether it was forced.
      final p = s.pending;
      final firstStep = a.steps.isEmpty ? null : a.steps.first.id;
      if (p != null && p.kind == 'narrative' && p.payload['arc'] == id && p.payload['step'] == firstStep) {
        rec.openings.add(Opening(id, s.season, s.slot, p.payload['forced'] == true));
        continue;
      }
      Scheduled? sc;
      for (final e in s.scheduled) {
        if (e.arc == id && e.step == firstStep && (sc == null || e.seq < sc.seq)) sc = e;
      }
      final slot = sc == null || sc.dueN < 0 ? s.slot : sc.dueN - s.seasonStartN;
      rec.openings.add(Opening(id, st.startedSeason, slot, false));
    }
  }

  void noteTolerant() {
    if (rec == null) return;
    final j = s.toJson();
    final arcs = j['arcs'];
    if (arcs is Map) {
      final keys = arcs.keys.map((k) => k.toString()).toList()..sort();
      for (final k in keys) {
        final v = arcs[k];
        if (v is Map && v['outcome'] is String) rec.outcomes[k] = v['outcome'] as String;
      }
    }
    final journal = j['journal'];
    if (journal is List) {
      rec.journal
        ..clear()
        ..addAll(journal.map((e) => e is Map ? '${e['season'] ?? ''}·${e['text'] ?? e}' : e.toString()));
    }
  }

  noteOpenings();
  while (!s.over && step < 5000) {
    final p = s.pending!;
    seenCards.add(p.id);
    rec?.seen.add(p.id);
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
        // Events are counted at arming (the engine's per-season counter), not
        // per served card: a multi-step event or a verdict carried over from
        // the previous season is not a new intrusion.
        m.events = math.max(m.events, s.eventsThisSeason);
        if (sp != null) {
          m.speakers[sp] = (m.speakers[sp] ?? 0) + 1;
          if (sp == m.lastSpeaker) m.samePairs += 1;
        }
        m.lastSpeaker = sp;
        final backlog = s.scheduled.where((e) => e.deadlineN <= s.ncards).length;
        m.maxBacklog = math.max(m.maxBacklog, backlog);
        if (s.season == 0) s0Ids.add(p.id);
      }
      if (rec != null) {
        if (curRec == null || curRec.season != s.season) {
          curRec = SeasonRecord(s.season);
          rec.seasons.add(curRec);
          final fr = s.entities.named['fil_rouge'];
          if (fr != null) rec.filRouge.add(fr);
        }
        final r = curRec;
        r.cards += 1;
        if (kind == 'routine' || kind == 'filler') r.routine += 1;
        if (kStoryKinds.contains(kind)) {
          r.story += 1;
          if (r.firstStory.length < 5) r.firstStory.add(p.id);
          final arcId = p.payload['arc'] as String?;
          final stepId = p.payload['step'] as String?;
          r.arcSteps.add(arcId == null ? p.id : '$arcId/${stepId ?? ''}');
        }
        if (kStoryCardKinds.contains(kind)) {
          r.storyCards.add(p.id);
          rec.careerStory.add(p.id);
          if (s.season == 0) rec.s0Story.add(p.id);
        }
        if (s.season >= 1) {
          for (final t in _readsOf(content, s, p)) {
            final posed = tracePosed[t];
            if (posed != null && posed < s.season) {
              r.couture = true;
              r.coutures.add('${p.id} ← $t (S$posed)');
            }
          }
        }
      }
      trace?.writeln('S${s.season} · slot ${s.slot.toString().padLeft(2)} · n ${s.ncards.toString().padLeft(3)} · bande $band · ${kind.padRight(9)} · '
          '${((p.payload['arc'] as String?) ?? '').padRight(24)} ${((p.payload['step'] as String?) ?? '').padRight(12)} · ${(sp ?? '—').padRight(9)} · ${tone.padRight(11)} · ${p.id}'
          '${p.payload['forced'] == true ? '  [forcé]' : ''}');
    } else {
      if (rec != null && p.kind == 'bilan_une') {
        if (s.season >= maxSeasons) break;
        final une = p.payload['une'];
        rec.unes.add(une is String && une.isNotEmpty ? une : _normaliseUne(s, p.text));
      }
      trace?.writeln('S${s.season} ·         · n ${s.ncards.toString().padLeft(3)} ·         · ${p.kind.padRight(9)} · ${p.id}');
    }
    final seasonBefore = s.season;
    s = engine.choose(s, policy(s, step));
    step++;
    if (rec != null) {
      noteTraces(seasonBefore);
      noteOpenings();
    }
  }
  closeSeason(over: s.over);
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
  if (rec != null) {
    rec.ending = s.endingId ?? (s.over ? 'inconnu' : 'en cours');
    rec.seasonsPlayed = rec.seasons.length;
    // An arc armed by `openSeason` of a season that was never played (the
    // `--seasons` cut, or a run that ends at the Bilan) is not an opening.
    final played = rec.seasons.map((x) => x.season).toSet();
    rec.openings.removeWhere((o) => !played.contains(o.season));
    noteTolerant();
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

double _stdDev(Iterable<num> xs) {
  if (xs.isEmpty) return 0;
  final m = _mean(xs);
  return math.sqrt(_mean(xs.map((x) => (x - m) * (x - m))));
}

String _f(double v, [int d = 1]) => v.toStringAsFixed(d);

double jaccard(Set<String> a, Set<String> b) {
  if (a.isEmpty && b.isEmpty) return 1;
  final inter = a.intersection(b).length;
  final union = a.union(b).length;
  return union == 0 ? 1 : inter / union;
}

/// Deterministic pairs (a, b), a != b, over n runs.
List<List<int>> _pairs(int n, int count) {
  final out = <List<int>>[];
  if (n < 2) return out;
  for (int k = 0; k < count; k++) {
    final a = (mul32(k + 1, 2654435761) >> 4) % n;
    var b = (mul32(k + 1, 0x9E3779B1 ^ 0x5bd1e995) >> 4) % n;
    if (b == a) b = (b + 1) % n;
    out.add([a, b]);
  }
  return out;
}

/// Career distance D (spec variété §5.1).
double careerDistance(RunRecord a, RunRecord b) {
  final ji = jaccard(a.intrigues, b.intrigues);
  final ju = jaccard(a.unes.toSet(), b.unes.toSet());
  final jt = jaccard(a.traces, b.traces);
  return 0.5 * (1 - ji) + 0.3 * (1 - ju) + 0.2 * (1 - jt);
}

String _mark(bool ok) => ok ? '✔' : '✗';

void _line(bool ok, String label, String value, String seuil) {
  stdout.writeln('  ${_mark(ok)} ${label.padRight(44)} $value · seuil $seuil');
}

/// Serie arcs the postulat can open today (same filter as `eligibleArcs`,
/// without the state-dependent `when`).
List<ArcDef> reservoirArcs(Content content, PostulatDef post) => content.arcsSorted
    .where((a) => a.kind == 'serie' && a.roles.contains(post.role) && (a.postulats.isEmpty || a.postulats.contains(post.id)))
    .toList();

void _reportDiversity(List<RunRecord> recs, Content content, int postulat, int maxSeasons) {
  final post = content.postulatsByIndex[postulat];
  final n = recs.length;
  if (n == 0) return;
  stdout.writeln('── Diversité (spec variété §5.1-5.3) · postulat $postulat « ${post.title} » · $n runs · ${maxSeasons >= 99 ? 'carrières entières' : '$maxSeasons saison(s)'} ──');

  // --- 5.1 variété perçue -------------------------------------------------
  final first100 = recs.take(100).toList();
  final sets = first100.map((r) => r.s0Set).toSet();
  final programmes = first100.map((r) => r.s0Programme).toSet();
  _line(sets.length >= 25, 'ensembles S0 distincts (100 graines)', '${sets.length}', '≥ 25');
  _line(programmes.length >= 60, 'programmes S0 distincts (100 graines)', '${programmes.length}', '≥ 60');

  final pairs = _pairs(n, 500);
  final j0 = pairs.map((p) => jaccard(recs[p[0]].s0Story, recs[p[1]].s0Story)).toList();
  final jc = pairs.map((p) => jaccard(recs[p[0]].careerStory, recs[p[1]].careerStory)).toList();
  _line(_mean(j0) <= 0.35, 'Jaccard S0 (cartes d\'histoire, ${pairs.length} paires)', 'moy ${_f(_mean(j0), 2)} · médiane ${_f(_pct(j0, 0.5), 2)}', '≤ 0,35');
  _line(_mean(jc) <= 0.30, 'Jaccard carrière', 'moy ${_f(_mean(jc), 2)} · médiane ${_f(_pct(jc, 0.5), 2)}', '≤ 0,30');

  final s0Runs = recs.where((r) => r.seasons.isNotEmpty).toList();
  final freq = <String, int>{};
  for (final r in s0Runs) {
    for (final id in r.s0Story) {
      freq[id] = (freq[id] ?? 0) + 1;
    }
  }
  final core = freq.entries.where((e) => e.value >= 0.9 * s0Runs.length).map((e) => e.key).toList()..sort();
  _line(core.length <= 4, 'noyau fixe (cartes dans ≥ 90 % des S0)', '${core.length}${core.isEmpty ? '' : ' : ${core.take(12).join(', ')}${core.length > 12 ? '…' : ''}'}', '≤ 4');

  final openings = <String, int>{};
  for (final r in s0Runs) {
    final k = r.seasons.first.firstStory.join(',');
    openings[k] = (openings[k] ?? 0) + 1;
  }
  final topOpening = openings.entries.toList()..sort((a, b) => b.value != a.value ? b.value.compareTo(a.value) : a.key.compareTo(b.key));
  final openShare = s0Runs.isEmpty ? 0.0 : topOpening.first.value / s0Runs.length;
  _line(openShare <= 0.10, 'ouverture : 5 premiers temps d\'histoire identiques', '${_f(100 * openShare, 0)} % (${openings.length} séquences)', '≤ 10 %');

  final arcSeqs = s0Runs.map((r) => r.seasons.first.arcSteps.join(',')).toSet();
  final entropy = s0Runs.isEmpty ? 0.0 : arcSeqs.length / s0Runs.length;
  _line(entropy >= 0.9, 'entropie d\'histoire : séquences (arc, étape) S0 / runs', '${_f(entropy, 2)} (${arcSeqs.length}/${s0Runs.length})', '≥ 0,9');

  final firstSlots = <int>[];
  int closePairs = 0;
  for (final r in recs) {
    final o = r.openingsOf(0);
    if (o.isEmpty) continue;
    firstSlots.add(o.map((e) => e.slot).reduce(math.min));
    final slots = o.map((e) => e.slot).toList()..sort();
    for (int i = 1; i < slots.length; i++) {
      if (slots[i] - slots[i - 1] < 3) {
        closePairs += 1;
        break;
      }
    }
  }
  final sd = _stdDev(firstSlots);
  _line(sd >= 1.8 && closePairs == 0, 'rythme : slot de première ouverture (S0)',
      firstSlots.isEmpty ? 'aucune ouverture d\'intrigue en S0' : 'écart-type ${_f(sd, 2)} · moy ${_f(_mean(firstSlots))} · S0 avec deux ouvertures à < 3 slots ${_f(100 * closePairs / math.max(1, n), 0)} %',
      'σ ≥ 1,8 ; 0 %');

  final reservoir = reservoirArcs(content, post);
  final cover = <String, double>{};
  for (final a in reservoir) {
    cover[a.id] = recs.where((r) => r.intrigues.contains(a.id)).length / n;
  }
  final coverOk = reservoir.isNotEmpty && reservoir.every((a) => cover[a.id]! >= 0.10 && cover[a.id]! <= 0.65);
  final zero = reservoir.where((a) => cover[a.id] == 0).map((a) => a.id).toList();
  final seen20 = <String>{};
  for (final r in recs.take(20)) {
    seen20.addAll(r.intrigues.where((id) => cover.containsKey(id)));
  }
  final seen20Share = reservoir.isEmpty ? 0.0 : seen20.length / reservoir.length;
  if (reservoir.isEmpty) {
    stdout.writeln('  – ${'couverture du réservoir'.padRight(44)} non mesuré (aucune intrigue serie pour le rôle ${post.role}) · seuil chaque ∈ [10 %, 65 %]');
  } else {
    _line(coverOk, 'couverture du réservoir (${reservoir.length} intrigues)', reservoir.map((a) => '${a.id.replaceFirst(RegExp(r'^(en|jp|co)\.'), '')} ${_f(100 * cover[a.id]!, 0)}%').join(' · '), 'chaque ∈ [10 %, 65 %]');
    _line(zero.isEmpty, '  intrigues jamais ouvertes', zero.isEmpty ? 'aucune' : zero.join(', '), 'aucune');
    _line(seen20Share >= 0.70, '  intrigues vues sur 20 carrières', '${_f(100 * seen20Share, 0)} % (${seen20.length}/${reservoir.length})', '≥ 70 %');
  }
  int forcedOpen = 0, totalOpen = 0;
  for (final r in recs) {
    for (final o in r.openings) {
      totalOpen += 1;
      if (o.forced) forcedOpen += 1;
    }
  }
  final forcedRate = totalOpen == 0 ? 0.0 : forcedOpen / totalOpen;
  _line(forcedRate <= 0.15, '  ouvertures forcées (forceStory) / ouvertures', '${_f(100 * forcedRate, 0)} % ($forcedOpen/$totalOpen, tous rôles joués)', '≤ 15 %');

  final fr = <String, int>{};
  for (final r in recs) {
    for (final q in r.filRouge) {
      fr[q] = (fr[q] ?? 0) + 1;
    }
  }
  if (fr.isEmpty) {
    stdout.writeln('  – ${'fil rouge : distribution des questions'.padRight(44)} non mesuré (aucun fil rouge dans l\'état) · seuil aucune < 25 %');
  } else {
    final total = fr.values.fold<int>(0, (a, b) => a + b);
    final keys = fr.keys.toList()..sort();
    _line(fr.values.every((v) => v / total >= 0.25), 'fil rouge : distribution des questions', keys.map((k) => '$k ${_f(100 * fr[k]! / total, 0)}%').join(' · '), 'aucune < 25 %');
  }
  final outcomes = <String, Map<String, int>>{};
  for (final r in recs) {
    r.outcomes.forEach((arc, o) => (outcomes[arc] ??= {})[o] = ((outcomes[arc] ??= {})[o] ?? 0) + 1);
  }
  if (outcomes.isEmpty) {
    stdout.writeln('  – ${'issues : distribution des outcome par intrigue'.padRight(44)} non mesuré (aucune issue dans l\'état) · seuil aucune < 10 %');
  } else {
    final arcs = outcomes.keys.toList()..sort();
    for (final a in arcs) {
      final m = outcomes[a]!;
      final total = m.values.fold<int>(0, (x, y) => x + y);
      final ks = m.keys.toList()..sort();
      _line(m.values.every((v) => v / total >= 0.10), 'issues · $a', ks.map((k) => '$k ${_f(100 * m[k]! / total, 0)}%').join(' · '), 'aucune < 10 %');
    }
  }

  final ds = pairs.map((p) => careerDistance(recs[p[0]], recs[p[1]])).toList();
  final dMed = _pct(ds, 0.5);
  final dP10 = _pct(ds, 0.10);
  final ji = _mean(pairs.map((p) => jaccard(recs[p[0]].intrigues, recs[p[1]].intrigues)));
  final ju = _mean(pairs.map((p) => jaccard(recs[p[0]].unes.toSet(), recs[p[1]].unes.toSet())));
  final jt = _mean(pairs.map((p) => jaccard(recs[p[0]].traces, recs[p[1]].traces)));
  _line(dMed >= 0.6 && dP10 >= 0.35, 'distance de carrière D', 'médiane ${_f(dMed, 2)} · P10 ${_f(dP10, 2)} · J intrigues ${_f(ji, 2)} · J Unes ${_f(ju, 2)} · J traces ${_f(jt, 2)}', 'médiane ≥ 0,6 ; P10 ≥ 0,35');

  final roleCards = content.cards.values.where((c) => c.roles.contains(post.role)).map((c) => c.id).toSet();
  final seen10 = <String>{};
  for (final r in recs.take(10)) {
    seen10.addAll(r.seen.where(roleCards.contains));
  }
  final expo = roleCards.isEmpty ? 0.0 : seen10.length / roleCards.length;
  _line(expo >= 0.70, 'exposition à 10 carrières (cartes du rôle vues)', '${_f(100 * expo, 0)} % (${seen10.length}/${roleCards.length})', '≥ 70 %');

  // --- 5.2 sentiment d'histoire -------------------------------------------
  final tranches = <String, List<SeasonRecord>>{'S0': [], 'S1': [], 'S2-S4': [], 'S5-S8': []};
  for (final r in recs) {
    for (final sr in r.seasons) {
      final k = sr.season == 0 ? 'S0' : (sr.season == 1 ? 'S1' : (sr.season <= 4 ? 'S2-S4' : (sr.season <= 8 ? 'S5-S8' : null)));
      if (k != null) tranches[k]!.add(sr);
    }
  }
  const storyMin = {'S0': 12, 'S1': 10, 'S2-S4': 8, 'S5-S8': 6};
  const isoMax = {'S0': 0.10, 'S1': 0.20, 'S2-S4': 0.30, 'S5-S8': 0.40};
  final storyParts = <String>[];
  final isoParts = <String>[];
  bool storyOk = true, isoOk = true;
  for (final k in tranches.keys) {
    final xs = tranches[k]!;
    if (xs.isEmpty) {
      storyParts.add('$k —');
      isoParts.add('$k —');
      continue;
    }
    final med = _pct(xs.map((x) => x.story).toList(), 0.5);
    final cards = xs.fold<int>(0, (a, x) => a + x.cards);
    final routine = xs.fold<int>(0, (a, x) => a + x.routine);
    final iso = cards == 0 ? 0.0 : routine / cards;
    if (med < storyMin[k]!) storyOk = false;
    if (iso >= isoMax[k]!) isoOk = false;
    storyParts.add('$k ${_f(med, 0)} (${xs.length} sais.)');
    isoParts.add('$k ${_f(100 * iso, 0)} %');
  }
  _line(storyOk, 'temps d\'histoire par saison (médiane)', storyParts.join(' · '), '≥ 12 / ≥ 10 / ≥ 8 / ≥ 6');
  _line(isoOk, 'isolement : routines sans lien / cartes', isoParts.join(' · '), '< 10 / < 20 / < 30 / < 40 %');

  final later = recs.expand((r) => r.seasons.where((sr) => sr.season >= 1)).toList();
  final coutures = later.where((sr) => sr.couture).length;
  final coutureShare = later.isEmpty ? 0.0 : coutures / later.length;
  _line(coutureShare >= 0.70, 'coutures : saisons S1+ lisant une trace antérieure', later.isEmpty ? 'aucune saison S1+' : '${_f(100 * coutureShare, 0)} % ($coutures/${later.length})', '≥ 70 %');

  // --- 5.3 Unes -----------------------------------------------------------
  final uneFreq = <String, int>{};
  int bilans = 0;
  for (final r in recs) {
    for (final u in r.unes) {
      bilans += 1;
      uneFreq[u] = (uneFreq[u] ?? 0) + 1;
    }
  }
  final topUne = uneFreq.entries.toList()..sort((a, b) => b.value != a.value ? b.value.compareTo(a.value) : a.key.compareTo(b.key));
  final topShare = bilans == 0 ? 0.0 : topUne.first.value / bilans;
  _line(uneFreq.length >= 12 && topShare <= 0.30, 'Unes distinctes / Bilans', '${uneFreq.length} / $bilans · la plus fréquente ${_f(100 * topShare, 0)} %', '≥ 12 ; aucune > 30 %');
}

void _reportReservoir(List<RunRecord> recs, Content content, int postulat) {
  final post = content.postulatsByIndex[postulat];
  final n = recs.length;
  final reservoir = reservoirArcs(content, post);
  stdout.writeln('── Réservoir · postulat $postulat « ${post.title} » · $n runs ──');
  if (reservoir.isEmpty) {
    stdout.writeln('  aucune intrigue (arc serie) disponible pour ce postulat');
    return;
  }
  const buckets = ['S0', 'S1', 'S2+'];
  String bucketOf(int season) => season == 0 ? 'S0' : (season == 1 ? 'S1' : 'S2+');
  final seasonsPlayed = <String, int>{for (final b in buckets) b: 0};
  for (final r in recs) {
    for (final sr in r.seasons) {
      seasonsPlayed[bucketOf(sr.season)] = seasonsPlayed[bucketOf(sr.season)]! + 1;
    }
  }
  stdout.writeln('  ${'intrigue'.padRight(28)} ${'porteur'.padRight(10)} ${buckets.map((b) => '$b ouv. (forcées)'.padRight(20)).join('')} carrière  slot moy  forcées');
  for (final a in reservoir) {
    final cells = <String>[];
    int allOpen = 0, allForced = 0;
    final slots = <int>[];
    for (final b in buckets) {
      int open = 0, forced = 0;
      for (final r in recs) {
        for (final o in r.openings) {
          if (o.arc != a.id || bucketOf(o.season) != b) continue;
          open += 1;
          if (o.forced) forced += 1;
          slots.add(o.slot);
        }
      }
      allOpen += open;
      allForced += forced;
      final played = seasonsPlayed[b]!;
      cells.add(played == 0 ? '—'.padRight(20) : '${_f(100 * open / played, 0)} % (${_f(100 * forced / math.max(1, open), 0)} %)'.padRight(20));
    }
    final career = recs.where((r) => r.intrigues.contains(a.id)).length / math.max(1, n);
    final carrier = a.cast.isEmpty ? '—' : a.cast.first;
    final forcedRate = allOpen == 0 ? 0.0 : allForced / allOpen;
    stdout.writeln('  ${_mark(career >= 0.10 && career <= 0.65)} ${a.id.padRight(26)} ${carrier.padRight(10)} ${cells.join('')} ${_f(100 * career, 0).padLeft(4)} %   ${_f(_mean(slots)).padLeft(5)}   ${_mark(forcedRate <= 0.15)} ${_f(100 * forcedRate, 0)} %');
  }
  stdout.writeln('  seuils : carrière ∈ [10 %, 65 %] ; forcées ≤ 15 %');
  // Carrier × season : how many careers each cast face carries at least one intrigue.
  final cast = post.cast.keys.toList()..sort();
  if (cast.isNotEmpty) {
    stdout.writeln('  porteurs (cast) : part des carrières où le visage porte ≥ 1 intrigue');
    final parts = <String>[];
    int carriers = 0;
    for (final ch in cast) {
      final share = recs.where((r) => r.intrigues.any((id) => (content.arcs[id]?.cast.isNotEmpty ?? false) && content.arcs[id]!.cast.first == ch)).length / math.max(1, n);
      if (share > 0) carriers += 1;
      parts.add('$ch ${_f(100 * share, 0)}%');
    }
    stdout.writeln('    ${parts.join(' · ')}');
    _line(carriers / cast.length >= 0.80, '  visages du cast porteurs d\'≥ 1 intrigue', '${_f(100 * carriers / cast.length, 0)} % ($carriers/${cast.length})', '≥ 80 %');
  }
}

void _reportDiff(RunRecord a, RunRecord b, Content content, int postulat) {
  final post = content.postulatsByIndex[postulat];
  stdout.writeln('── Diff · postulat $postulat « ${post.title} » · graines ${a.seed} / ${b.seed} · human_like ──');
  final seasons = math.max(a.seasons.length, b.seasons.length);
  void row(String label, String va, String vb) {
    stdout.writeln('  ${label.padRight(11)} A  $va');
    stdout.writeln('  ${''.padRight(11)} B  $vb');
  }

  for (int i = 0; i < seasons; i++) {
    final sa = i < a.seasons.length ? a.seasons[i] : null;
    final sb = i < b.seasons.length ? b.seasons[i] : null;
    String prog(RunRecord r) {
      final o = r.openingsOf(i)..sort((x, y) => x.slot != y.slot ? x.slot.compareTo(y.slot) : x.arc.compareTo(y.arc));
      return o.isEmpty ? '—' : o.map((e) => '${e.arc}@${e.slot}${e.forced ? '!' : ''}').join(', ');
    }

    stdout.writeln('  S$i');
    row('intrigues', prog(a), prog(b));
    row('histoire', sa == null ? '—' : '${sa.story} temps / ${sa.cards} cartes', sb == null ? '—' : '${sb.story} temps / ${sb.cards} cartes');
    row('5 premiers', sa == null ? '—' : sa.firstStory.join(', '), sb == null ? '—' : sb.firstStory.join(', '));
    if (i < a.filRouge.length || i < b.filRouge.length) {
      row('fil rouge', i < a.filRouge.length ? a.filRouge[i] : '—', i < b.filRouge.length ? b.filRouge[i] : '—');
    }
    row('Une', i < a.unes.length ? a.unes[i] : '—', i < b.unes.length ? b.unes[i] : '—');
    if (i >= 1) {
      row('coutures', sa == null || sa.coutures.isEmpty ? '—' : sa.coutures.join(' ; '), sb == null || sb.coutures.isEmpty ? '—' : sb.coutures.join(' ; '));
    }
  }
  final ta = a.traces.toList()..sort();
  final tb = b.traces.toList()..sort();
  final common = a.traces.intersection(b.traces).toList()..sort();
  stdout.writeln('  traces');
  row('', '(${ta.length}) ${ta.join(', ')}', '(${tb.length}) ${tb.join(', ')}');
  stdout.writeln('  ${'communes'.padRight(11)}    (${common.length}) ${common.join(', ')}');
  if (a.journal.isNotEmpty || b.journal.isNotEmpty) {
    row('journal', a.journal.take(6).join(' | '), b.journal.take(6).join(' | '));
  }
  row('fin', '${a.ending} · ${a.seasonsPlayed} saison(s)', '${b.ending} · ${b.seasonsPlayed} saison(s)');
  final ji = jaccard(a.intrigues, b.intrigues);
  final ju = jaccard(a.unes.toSet(), b.unes.toSet());
  final jt = jaccard(a.traces, b.traces);
  final j0 = jaccard(a.s0Story, b.s0Story);
  final jc = jaccard(a.careerStory, b.careerStory);
  final d = careerDistance(a, b);
  stdout.writeln('  Jaccard S0 ${_f(j0, 2)} · Jaccard carrière ${_f(jc, 2)} · J intrigues ${_f(ji, 2)} · J Unes ${_f(ju, 2)} · J traces ${_f(jt, 2)}');
  _line(d >= 0.6, 'distance de carrière D', _f(d, 2), 'médiane ≥ 0,6');
}

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
  stdout.writeln('  ${nar.s0Sequences.length >= 25 ? '✔' : '✗'} ${'entropie : séquences S0 distinctes (tous ids)'.padRight(44)} ${nar.s0Sequences.length}');
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
  bool reservoir = false;
  int? postulat;
  int? traceSeed;
  int? diffA, diffB;
  int maxSeasons = 99;
  for (int i = 0; i < args.length; i++) {
    if (args[i] == '--runs' && i + 1 < args.length) runs = int.parse(args[i + 1]);
    if (args[i] == '--assert') assertBudgets = true;
    if (args[i] == '--narrative') narrative = true;
    if (args[i] == '--reservoir') reservoir = true;
    if (args[i] == '--postulat' && i + 1 < args.length) postulat = int.parse(args[i + 1]);
    if (args[i] == '--trace' && i + 1 < args.length) traceSeed = int.parse(args[i + 1]);
    if (args[i] == '--seasons' && i + 1 < args.length) maxSeasons = int.parse(args[i + 1]);
    if (args[i] == '--diff' && i + 2 < args.length) {
      diffA = int.parse(args[i + 1]);
      diffB = int.parse(args[i + 2]);
    }
  }
  final nPost = content.postulatsByIndex.length;

  if (traceSeed != null) {
    final p = postulat ?? 0;
    stdout.writeln('── Trace · graine $traceSeed · postulat $p « ${content.postulatsByIndex[p].title} » · human_like ──');
    final r = runOne(engine, traceSeed, p, _humanLike, <String>{}, trace: stdout, maxSeasons: maxSeasons);
    stdout.writeln('fin : ${r.ending} · ${r.seasons} saison(s) · ${r.turns} beats');
    return;
  }

  if (diffA != null && diffB != null) {
    final p = postulat ?? 0;
    final a = RunRecord(diffA);
    final b = RunRecord(diffB);
    runOne(engine, diffA, p, _humanLike, <String>{}, rec: a, maxSeasons: maxSeasons);
    runOne(engine, diffB, p, _humanLike, <String>{}, rec: b, maxSeasons: maxSeasons);
    _reportDiff(a, b, content, p);
    return;
  }

  if (narrative || reservoir) {
    final p = postulat ?? 0;
    final n = runs == 5000 ? 2000 : runs;
    final nar = Narrative();
    final recs = <RunRecord>[];
    for (int i = 0; i < n; i++) {
      final seed = seedOfRun(i);
      final rec = RunRecord(seed);
      runOne(engine, seed, p, _humanLike, nar.seenCards, nar: nar, rec: rec, maxSeasons: maxSeasons);
      recs.add(rec);
    }
    if (reservoir) {
      _reportReservoir(recs, content, p);
      if (!narrative) return;
    }
    _reportDiversity(recs, content, p, maxSeasons);
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
      final seed = seedOfRun(i);
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
