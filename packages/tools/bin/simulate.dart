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
///       dart run fusible_tools:simulate --une-check [--postulat 0] [--runs 200]
///       dart run fusible_tools:simulate --arc <id> [--postulat 0] [--runs 300] [--seasons 4]
///
/// The diversity volume budgets have no `--assert` yet (spec §6 étape 0) : the
/// spec thresholds are printed next to the values. Since step 2, `--assert`
/// enforces the invariants of §5.2-5.3 on every mode : zero unresolved
/// placeholder, reactions served at latency 1 and never twice in a row, and a
/// Une that never lies (`--une-check` runs that comparison alone).
library;

import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;

import 'package:fusible_core/fusible_core.dart';

/// Les issues déclarées rares par arc (`issues_rares`, spec § 5.1). Lues dans
/// le bundle compilé : c'est une donnée de rapport, pas une donnée de moteur,
/// et le modèle `Content` n'a pas à la porter.
Map<String, Set<String>> _issuesRares() {
  var dir = Directory.current;
  for (var i = 0; i < 6; i++) {
    final f = File('${dir.path}/content/build/content.json');
    if (f.existsSync()) {
      final j = jsonDecode(f.readAsStringSync()) as Map<String, dynamic>;
      final out = <String, Set<String>>{};
      for (final a in (j['arcs'] as List? ?? const [])) {
        final m = (a as Map).cast<String, dynamic>();
        final r = (m['issues_rares'] as List?)?.map((e) => e.toString()).toSet() ?? const <String>{};
        if (r.isNotEmpty) out[m['id'].toString()] = r;
      }
      return out;
    }
    final p = dir.parent;
    if (p.path == dir.path) break;
    dir = p;
  }
  return const {};
}

/// Le dossier `content/` du dépôt, trouvé en remontant depuis le dossier
/// courant (même stratégie que `_loadContent`).
String _contentDir() {
  var dir = Directory.current;
  for (var i = 0; i < 6; i++) {
    if (File('${dir.path}/content/build/content.json').existsSync()) return '${dir.path}/content';
    final p = dir.parent;
    if (p.path == dir.path) break;
    dir = p;
  }
  return '${Directory.current.path}/content';
}

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
/// « Temps d'histoire » (spec variété §1.1). `passe` — la carte « Nouvelles du
/// passé », qui dit ce qu'est devenue une intrigue laissée dans l'ancien club —
/// s'y ajoute à l'étape 8 : c'est une scène avec un locuteur qui conclut une
/// histoire, et la mesure de variété la comptait déjà comme carte d'histoire
/// (`kStoryCardKinds`). Servie en bande 6 au milieu d'un creux, elle laissait
/// un écart de 4 mesuré alors que le joueur, lui, venait de lire une histoire.
const Set<String> kStoryKinds = {'script', 'etape', 'evenement', 'palier', 'chaine', 'reaction', 'passe'};

/// « Carte d'histoire » for the Jaccard / noyau fixe sets : everything that is
/// neither routine nor Nouvelle (alarms and « passe » included : they are
/// story too, even if the gauges drive them).
const Set<String> kStoryCardKinds = {'script', 'etape', 'evenement', 'alarme', 'palier', 'chaine', 'passe', 'reaction'};

class RunStats {
  int turns = 0;
  String ending = '';
  int seasons = 0;
  int roles = 1;
  // Étape 2 (spec variété §5.2-5.3) : mesurés sur toute politique, asserts globaux.
  int unresolved = 0; // `{…}` restant dans un texte servi (cartes, Une, journal, fin)
  final List<String> unresolvedSamples = [];
  int reactions = 0; // réactions servies
  int reactionsLat1 = 0; // … servies au tirage qui suit le swipe qui les a posées
  int reactionsConsecutive = 0; // … servies juste après une autre réaction
  int reactionsMissed = 0; // stats.miss_reaction (plafond, `when` faux, carte disparue)
  final Map<String, int> reactionsMissedBy = {}; // cause → réactions perdues (stats.miss_reaction_<cause>)
  // Set-pieces (spec variété §1.12) et Nouvelles datées (§1.5).
  int setpieces = 0; // beats moteur servis (objective, match, cup, GM, bilan…)
  int setpiecesVariantes = 0; // … servis par une variante auteurisée, hors secours
  int nouvellesDatees = 0; // Nouvelles datées servies dans leur fenêtre [year, year + 1]
  int nouvellesDateesPerdues = 0; // … jamais servies, fenêtre fermée (stats.nouvelle_datee_perdue)
  /// Cartes servies hors du rôle courant, ou dont le locuteur ne parle plus
  /// (spec variété §1.10). Invariant : zéro. C'est le défaut « fuite entre
  /// rôles » / « statuts non respectés » : les alarmes, les réactions et les
  /// variantes d'étape ne filtraient pas comme `pickPool`.
  int horsRole = 0;
  int horsStatut = 0;
  final List<String> fuitesSamples = [];
  /// Cartes Classement servies, et celles dont le tableau ne dit pas ce que le
  /// moteur compte (ta ligne au mauvais rang, tes points faux, une colonne de
  /// points qui remonte). Invariant : zéro incohérence — le joueur lit le
  /// tableau comme la vérité du championnat.
  int classements = 0;
  int classementsIncoherents = 0;
  final List<String> classementSamples = [];
  int uneChecks = 0; // Bilans où la Une a été comparée au verdict appliqué
  int uneChecksOk = 0; // … et disait vrai (payload.tenu / payload.rang / payload.outcome et les mots du titre)
  final List<String> uneCheckFailures = [];
}

/// Les mots d'une manchette qui affirment une descente, une montée ou un
/// titre : ils doivent coïncider avec la ligne d'Almanach que `_resolveBilan`
/// écrit au swipe du Verdict (spec variété §1.6, §3.7 « la Une ne ment pas »).
final RegExp kUneDescenteRe = RegExp(r"descen(d|te|du)|étage du dessous|relégu|dernier wagon");
final RegExp kUneMonteeRe = RegExp(r"mont(ée|e en)|étage du dessus|\bmonte\b");
final RegExp kUneTitreRe = RegExp(r"\bchampion(s|ne|nes)?\b");

/// Nombre de placeholders non résolus dans un texte servi : tout `{` qui
/// subsiste (un `{x}` inconnu, un `select` mal formé). Zéro attendu (§5.3).
int _unresolvedIn(String? t) => t == null ? 0 : '{'.allMatches(t).length;

/// Comment la carte servie porte le nom du joueur (spec variété §5.3) :
/// `direct` = un placeholder de nom dans son texte ou ses `answer` ;
/// `toi` = seulement `{toi}` résolu par une adresse qui cite `{prenom}` /
/// `{nom}` (le locuteur et la relation de l'instant) ; `''` sinon. Les deux
/// comptent pour « ≥ 2 cartes par saison » ; « jamais deux de suite » ne
/// compte que les paires `direct` / `direct` : l'adresse d'un personnage
/// (« mon Ethan », « monsieur Vasseur ») est sa voix, pas le nom lâché par la
/// carte (mesure : 205 paires sur 208 venaient de `{toi}`, décision
/// docs/balance/step4_etape2_corrections.md).
String _nameLevel(Content content, GameState s, Pending p) {
  final card = content.cards[p.id];
  // Les beats (Objectif, Grand Match, Bilan…) ne sont pas des cartes : leur
  // gabarit vit dans setpieces.yaml et le Pending porte l'indice de la variante
  // servie (`setpiece` / `setpiece_variante`). Sans ce détour, sept écrans par
  // saison — dont la carte Objectif, premier exemple de la spec §1.8 —
  // sortaient du budget « nom » sans être comptés.
  final texts = <String?>[];
  String? sp;
  if (card != null) {
    texts.addAll([card.text, card.left.answer, card.right.answer]);
    sp = card.speaker;
  } else {
    final beat = p.payload['setpiece'] as String?;
    final idx = (p.payload['setpiece_variante'] as num?)?.toInt() ?? -1;
    final variants = beat == null ? null : content.setpieces[beat];
    if (variants == null || idx < 0 || idx >= variants.length) return '';
    final v = variants[idx];
    texts.addAll([v.text, v.answerLeft, v.answerRight]);
    sp = v.speaker ?? p.speaker;
  }
  String? adresse;
  if (sp != null) {
    final rel = s.relations[sp] ?? 0;
    final expr = rel >= 1 ? 'sourire' : (rel <= -1 ? 'noir' : 'neutre');
    adresse = content.characters[sp]?.adresseFor(s.role, expr) ?? (s.role == 'joueur' ? '{prenom}' : 'coach');
  }
  final adresseNamed = adresse != null && placeholdersOf(adresse).any(kNamePlaceholders.contains);
  var level = '';
  for (final t in texts) {
    if (t == null) continue;
    final ph = placeholdersOf(t);
    if (ph.any((x) => x != 'toi' && x != 'Toi' && kNamePlaceholders.contains(x))) return 'direct';
    if (adresseNamed && (ph.contains('toi') || ph.contains('Toi'))) level = 'toi';
  }
  return level;
}

// ---------------------------------------------------------------------------
// Narrative metrics (spec §5.2).
// ---------------------------------------------------------------------------

class SeasonMetrics {
  /// La saison est-elle **close** : jouée jusqu'à son Bilan, pas tronquée par
  /// la fin de carrière ni par la coupe `--seasons`. La cadence, le P5 du temps
  /// d'histoire et les Nouvelles ne se mesurent que là (défaut « artefact de
  /// mesure ») : une dernière saison arrêtée au slot 6 n'a pas de trou de
  /// cadence, elle a une fin de carrière — la compter faisait grimper l'écart
  /// max à 11 quand le P95 était à 3. Le reste (échéances, tons, voix, alarmes)
  /// est mesuré par carte servie et reste sur toutes les saisons.
  bool closed = false;

  /// La saison a-t-elle atteint son Bilan ? Une carrière qui meurt sur la
  /// dernière carte du Bilan a bien joué sa saison ; une carrière qui meurt au
  /// slot 6 ne l'a pas jouée.
  bool reachedBilan = false;
  int season = 0;
  int cards = 0;
  int story = 0;
  int routine = 0;
  int steps = 0; // etape/chaine/palier served
  int stepsOverdue = 0; // … served in band 6
  int forced = 0;
  int nouvelles = 0;
  int consecutiveNouvelles = 0;
  /// Cartes d'époque servies dans la saison : les Nouvelles qui portent un
  /// `year:` (content/cards/common/epoque_*.yaml et nouvelles_datees.yaml).
  /// Retour joueur : « les anecdotes liées au foot dans son histoire
  /// générale, je ne les ai jamais retrouvées » — d'où la mesure par saison,
  /// et le créneau de la première (une carrière doit en croiser une tôt).
  int datees = 0;
  int firstDateeSlot = 0; // 0 = aucune carte d'époque dans la saison
  int alarms = 0;
  int events = 0; // events armed this season (engine counter)
  int maxBacklog = 0;
  String maxBacklogKinds = '';
  int samePairs = 0;
  int maxGap = 0;
  int seed = 0; // graine de la carrière : de quoi rejouer la saison en `--trace`
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
  /// Arcs réellement entrés en jeu (armés, actifs, clos ou abandonnés) sur
  /// l'ensemble des runs : le dénominateur honnête de l'exposition.
  final Set<String> openedArcs = {};
  final Set<String> s0Sequences = {};
  int famine = 0;
  int cadencePull = 0;
  int runs = 0;
  int runsWithDrame = 0;
  int runsWithVariant = 0;
  int runsWithPalier = 0;
  int arcsOpened = 0;
  int arcsClosed = 0;
  int setpieces = 0;
  int setpiecesVariantes = 0;
  int nouvellesDatees = 0;
  int nouvellesDateesPerdues = 0;
  /// La dernière année vécue, tous runs confondus. Une Nouvelle datée dont la
  /// fenêtre [year, year + 1] commence après cette année n'a pas été manquée :
  /// aucune carrière n'a atteint son époque (spec variété §5.1, dénominateur
  /// d'exposition).
  int maxYear = 0;
  /// Fin servie → nombre de carrières (§5.3 : « chaque fin atteinte ≥ 1 fois »).
  final Map<String, int> endings = {};
  /// Objectif caché atteint → nombre de carrières ; [runsWithObjectif] compte
  /// les carrières qui en atteignent au moins un (§5.3 : bande 30-60 %).
  final Map<String, int> objectifs = {};
  int runsWithObjectif = 0;

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

  /// Saut d'arc : l'intrigue est entrée en jeu par une étape qui n'est pas la
  /// première (le twist du script qui `schedule` une étape de l'arc, spec
  /// annexe A). Comptée pour la couverture, pas pour le rythme des ouvertures
  /// (« jamais deux ouvertures à moins de 3 slots » vise le tirage de saison).
  final bool jump;
  const Opening(this.arc, this.season, this.slot, this.forced, {this.jump = false});
}

class SeasonRecord {
  final int season;
  int cards = 0;
  int story = 0;
  int routine = 0;
  bool couture = false; // a served card read a trace posed in an earlier season
  int reactions = 0; // réactions servies (étape 2)
  int nameCards = 0; // cartes portant un placeholder de nom ({toi} résolu en nom compris)
  int nameConsecutive = 0; // … deux de suite, hors {toi} (paires direct / direct)
  int nameConsecutiveToi = 0; // paires deux de suite dont l'une au moins ne tient qu'à {toi} (mesuré, non budgété)
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
  final Map<String, String> arcStatus = {}; // arc -> status final (armed | active | done | abandonne)
  final Map<String, String> arcReason = {}; // arc abandonné -> raison (perimee, club, statut…)
  final List<String> filRouge = []; // per season (tolerant, absent today)
  final List<String> journal = []; // tolerant, absent today
  // Étape 2 (spec variété §5.3) : Une, brèves, journal, réactions.
  final List<int> unePriorities = []; // priorité de la manchette servie à chaque Bilan (-1 : aucune)
  int bilans = 0;
  int brevesFull = 0; // Bilans avec `unes_breves` brèves issues du journal
  final Map<int, int> journalHeavy = {}; // saison → entrées de poids ≥ 2
  final Map<int, int> journalPerSeason = {}; // saison → entrées (après compaction pour les saisons closes)
  int seasonClosed = 0; // saisons dont le journal a été compacté (season < s.season à la fin)
  RunStats stats = RunStats();
  String ending = '';
  int seasonsPlayed = 0;
  int maxYear = 0; // dernière année vécue par cette carrière
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
    if (curSeason < 0 || cur.closed) return;
    // A run that died mid-season leaves no "hole" behind it : la saison n'est
    // close que si elle a atteint son Bilan (ou si c'est la coupe `--seasons`
    // qui a arrêté la carrière, pas la mort).
    if (over && !cur.reachedBilan) return;
    cur.closed = true;
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
      // Sans première étape en file ni servie : l'arc est entré par une autre
      // étape (saut d'arc), servie maintenant.
      final jump = sc == null && p != null && p.kind == 'narrative' && p.payload['arc'] == id;
      rec.openings.add(Opening(id, st.startedSeason, slot, false, jump: jump));
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

  // Étape 2 : réactions (latence, consécutives), nom, placeholders, Une.
  bool prevPosed = false; // le swipe précédent a posé une réaction (react d'un choix ou d'une manchette)
  bool prevWasReaction = false;
  String prevName = '';
  bool? uneTenu; // payload.tenu / payload.rang / payload.outcome de la Une en attente du verdict
  int uneRang = 0;
  String uneOutcome = '';
  String uneText = '';
  int journalBefore = 0;
  void scanText(String? t, String where) {
    final n = _unresolvedIn(t);
    if (n == 0) return;
    stats.unresolved += n;
    if (stats.unresolvedSamples.length < 5) stats.unresolvedSamples.add('$where : ${t!.length > 80 ? '${t.substring(0, 80)}…' : t}');
  }

  void scanPending(Pending p) {
    scanText(p.text, p.id);
    scanText(p.leftLabel, '${p.id}/left');
    scanText(p.rightLabel, '${p.id}/right');
    for (final k in const ['answerLeft', 'answerRight', 'titre', 'sous', 'journal_nom', 'epitaph', 'epitaph_plus']) {
      final v = p.payload[k];
      if (v is String) scanText(v, '${p.id}/$k');
    }
    for (final k in const ['breves', 'histoires', 'debloquees']) {
      final v = p.payload[k];
      if (v is List) {
        for (final b in v) {
          scanText(b.toString(), '${p.id}/$k');
        }
      }
    }
  }

  noteOpenings();
  while (!s.over && step < 5000) {
    final p = s.pending!;
    seenCards.add(p.id);
    rec?.seen.add(p.id);
    scanPending(p);
    final isReaction = p.payload['kind'] == 'reaction';
    if (isReaction) {
      stats.reactions += 1;
      if (prevPosed) stats.reactionsLat1 += 1;
      if (prevWasReaction) stats.reactionsConsecutive += 1;
    }
    prevWasReaction = isReaction;
    // Set-pieces (spec variété §1.12) : le beat a-t-il été servi par une
    // variante auteurisée, ou par son secours ?
    if (p.payload['setpiece'] is String) {
      stats.setpieces += 1;
      if (p.payload['setpiece_secours'] != true) stats.setpiecesVariantes += 1;
    }
    // Le classement dit-il la vérité ? (retour client : « on parle de
    // classement mais cela n'est indiqué nulle part ») Ta ligne porte le rang
    // et les points du moteur, et la colonne des points décroît de haut en bas.
    if (p.kind == 'classement') {
      stats.classements += 1;
      final rows = (p.payload['standings_complet'] as List?)?.cast<Map<String, dynamic>>() ?? const [];
      final moi = rows.where((r) => r['toi'] == true).toList();
      String? faute;
      if (rows.length != 18) {
        faute = '${rows.length} lignes';
      } else if (moi.length != 1) {
        faute = '${moi.length} lignes « toi »';
      } else if (moi.first['rang'] != s.world.standingRank) {
        faute = 'rang ${moi.first['rang']} ≠ ${s.world.standingRank}';
      } else if (moi.first['pts'] != s.world.pts) {
        faute = 'pts ${moi.first['pts']} ≠ ${s.world.pts}';
      } else {
        for (var i = 1; i < rows.length; i++) {
          if ((rows[i]['pts'] as int) > (rows[i - 1]['pts'] as int)) {
            faute = 'ligne ${i + 1} au-dessus de la ${i}e en points';
            break;
          }
        }
      }
      if (faute != null) {
        stats.classementsIncoherents += 1;
        if (stats.classementSamples.length < 5) stats.classementSamples.add('${p.id} : $faute');
      }
    }
    if (p.kind == 'narrative') {
      // Invariant de sélection : la carte servie joue le rôle courant et son
      // locuteur parle encore. Vérifié sur toute politique, sur chaque carte.
      final servedCard = content.cards[p.id];
      if (servedCard != null) {
        final arcId = p.payload['arc'] as String?;
        final stepDef = arcId == null ? null : content.arcs[arcId]?.stepById(p.payload['step'] as String? ?? '');
        if (servedCard.roles.isNotEmpty && !servedCard.roles.contains(s.role)) {
          stats.horsRole += 1;
          if (stats.fuitesSamples.length < 5) stats.fuitesSamples.add('rôle ${s.role} ← ${p.payload['kind']}/${p.id}');
        }
        if (!engine.director.speakerOk(s, servedCard, step: stepDef)) {
          stats.horsStatut += 1;
          if (stats.fuitesSamples.length < 5) {
            stats.fuitesSamples.add('statut ${servedCard.speaker} « ${engine.director.statutOf(s, servedCard.speaker)} » ← ${p.payload['kind']}/${p.id}');
          }
        }
      }
      if (s.season >= maxSeasons) break;
      final kind = p.payload['kind'] as String? ?? 'routine';
      final tone = p.payload['tone'] as String? ?? 'leger';
      final band = (p.payload['band'] as num?)?.toInt() ?? 0;
      final sp = p.speaker;
      if (nar != null) {
        if (s.season != curSeason) {
          closeSeason();
          curSeason = s.season;
          cur = SeasonMetrics()
            ..season = s.season
            ..seed = seed;
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
        if (kind == 'nouvelle' && content.cards[p.id]?.year != null) {
          stats.nouvellesDatees += 1;
          m.datees += 1;
          if (m.firstDateeSlot == 0) m.firstDateeSlot = s.slot;
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
          // Une réaction « relance » est souvent le même visage qui revient à la
          // charge (spec variété §1.4) : elle ne compte pas comme une paire de voix.
          if (sp == m.lastSpeaker && !isReaction) m.samePairs += 1;
        }
        if (!isReaction) m.lastSpeaker = sp;
        // Backlog : les entrées **échues** de la file. Une fusée longue porte
        // `dueN = deadlineN = -1` en attendant sa saison : la compter comme
        // échue gonflait le backlog de deux ou trois entrées qui n'attendaient
        // rien (défaut de mesure, corrigé avec les échéances).
        final overdueQ = s.scheduled.where((e) => !e.isLongFuse && e.dueN >= 0 && e.deadlineN <= s.ncards).toList();
        final backlog = overdueQ.length;
        if (backlog > m.maxBacklog) {
          // Ce qui empile : sans la composition, « backlog P99 3 » ne dit pas
          // par où le desserrer (une étape d'intrigue, une alarme, un palier et
          // une ancre de script ne se règlent pas au même endroit).
          m.maxBacklogKinds = (overdueQ.map((e) => e.kind).toList()..sort()).join('+');
        }
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
        if (isReaction) r.reactions += 1;
        final named = _nameLevel(content, s, p);
        if (named.isNotEmpty) {
          r.nameCards += 1;
          if (prevName == 'direct' && named == 'direct') {
            r.nameConsecutive += 1;
          } else if (prevName.isNotEmpty) {
            r.nameConsecutiveToi += 1;
          }
        }
        prevName = named;
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
          '${((p.payload['arc'] as String?) ?? '').padRight(24)} ${((p.payload['step'] as String?) ?? '').padRight(12)} · ${_visage(content, sp).padRight(26)} · ${tone.padRight(11)} · ${p.id}'
          '${p.payload['forced'] == true ? '  [forcé]' : ''}');
    } else {
      // Les beats (Objectif, Carte Match, Grand Match, Bilan…) sont des écrans
      // que le joueur lit : ils comptent pour le budget « nom » (spec §5.3),
      // même si ce ne sont pas des cartes du sac. Sans ce bloc, sept écrans par
      // saison — dont l'Objectif, premier exemple de la spec §1.8 — étaient
      // invisibles pour la mesure, et y poser le nom ne changeait rien.
      if (rec != null && s.season < maxSeasons) {
        if (curRec == null || curRec.season != s.season) {
          curRec = SeasonRecord(s.season);
          rec.seasons.add(curRec);
          final fr = s.entities.named['fil_rouge'];
          if (fr != null) rec.filRouge.add(fr);
        }
        final r = curRec;
        final named = _nameLevel(content, s, p);
        if (named.isNotEmpty) {
          r.nameCards += 1;
          if (prevName == 'direct' && named == 'direct') {
            r.nameConsecutive += 1;
          } else if (prevName.isNotEmpty) {
            r.nameConsecutiveToi += 1;
          }
        }
        prevName = named;
      }
      if (p.kind == 'bilan_une') {
        if (nar != null && curSeason == s.season) cur.reachedBilan = true;
        if (rec != null && s.season >= maxSeasons) break;
        final une = p.payload['une'];
        if (rec != null) {
          rec.unes.add(une is String && une.isNotEmpty ? une : _normaliseUne(s, p.text));
          rec.unePriorities.add((p.payload['priority'] as num?)?.toInt() ?? -1);
          rec.bilans += 1;
          final breves = p.payload['breves'];
          if (breves is List && breves.length >= content.director.unesBreves) rec.brevesFull += 1;
        }
        // « La Une ne ment pas » (spec variété §1.6, §5.3) : le verdict lu par la
        // manchette est comparé à celui que `_resolveBilan` applique au swipe
        // du Verdict, deux cartes plus loin.
        uneTenu = p.payload['tenu'] == true;
        uneRang = (p.payload['rang'] as num?)?.toInt() ?? 0;
        uneOutcome = p.payload['outcome']?.toString() ?? '';
        // Les gabarits (non rendus) de la manchette : « {objectif} » peut
        // rendre « La montée » sans que la Une l'affirme.
        final def = une is String ? content.unes.where((u) => u.id == une).firstOrNull : null;
        uneText = def == null ? '' : '${def.titre} ${def.sous}'.toLowerCase();
        journalBefore = s.journal.length;
      }
      trace?.writeln('S${s.season} ·         · n ${s.ncards.toString().padLeft(3)} ·         · ${p.kind.padRight(9)} · ${p.id}');
      // La Une composée, en toutes lettres (protocole de relecture § 5.4,
      // question 6 : « la Une raconte-t-elle la saison ? »). Sans ces lignes,
      // le trace ne disait que `bilan:une:0` et il fallait croiser --une-check
      // et le YAML des manchettes pour juger. On imprime ce que le lecteur
      // voit : le journal, le titre, le sous-titre, la légende de la photo
      // (l'`answer` de la carte fatale) et les brèves retenues.
      if (trace != null && p.kind == 'bilan_une') {
        final pay = p.payload;
        final jn = pay['journal_nom']?.toString() ?? pay['journal']?.toString() ?? '—';
        final verdict = '${pay['tenu'] == true ? 'objectif tenu' : 'objectif manqué'}'
            ' · ${pay['objectif'] ?? '—'} · ${pay['rang'] ?? '—'}e'
            '${(pay['outcome']?.toString() ?? '').isEmpty ? '' : ' · ${pay['outcome']}'}';
        trace.writeln('       │ ${jn.toUpperCase()} — ${pay['date'] ?? ''} — ${pay['prix'] ?? ''}'
            '${(pay['une']?.toString() ?? '').isEmpty ? '' : '   [manchette ${pay['une']}]'}');
        trace.writeln('       │ « ${pay['titre'] ?? ''} »');
        final sous = pay['sous']?.toString() ?? '';
        if (sous.isNotEmpty) trace.writeln('       │   $sous');
        final photo = pay['photo'];
        if (photo is Map) {
          final leg = photo['answer']?.toString() ?? '';
          trace.writeln('       │ photo : ${photo['card']}'
              '${leg.isEmpty ? '   ⚠ pas de légende (la sortie n\'a pas d\'`answer`)' : ' — « $leg »'}');
        } else {
          trace.writeln('       │ photo : — (aucune carte fatale retenue)');
        }
        final breves = pay['breves'];
        if (breves is List && breves.isNotEmpty) {
          for (final b in breves) {
            trace.writeln('       │ brève : ${b is Map ? (b['text'] ?? b).toString() : b.toString()}');
          }
        } else {
          trace.writeln('       │ brève : — (le journal de la saison n\'a rien donné)');
        }
        trace.writeln('       │ verdict : $verdict');
      }
      // Le classement, en toutes lettres : le joueur le voit maintenant deux
      // fois par saison, la relecture doit le voir aussi.
      if (trace != null && p.kind == 'classement') {
        final rows = p.payload['standings'];
        if (rows is List) {
          for (final r in rows) {
            final m = (r as Map).cast<String, dynamic>();
            final diff = (m['diff'] as num).toInt();
            trace.writeln('       │ ${m['toi'] == true ? '▸' : ' '} ${m['rang'].toString().padLeft(2)}. '
                '${m['club'].toString().padRight(22)} ${m['pts'].toString().padLeft(3)} pts  '
                '${diff >= 0 ? '+' : ''}$diff');
          }
        }
      }
    }
    final seasonBefore = s.season;
    final right = policy(s, step);
    // Le swipe pose-t-il une réaction ? (latence mesurée au tirage suivant)
    if (p.kind == 'narrative') {
      prevPosed = (right ? p.rightEffects : p.leftEffects).react.isNotEmpty;
    } else if (p.kind == 'bilan_une') {
      final une = p.payload['une'];
      prevPosed = une is String && content.unes.any((u) => u.id == une && u.react.isNotEmpty);
    } else {
      prevPosed = false;
    }
    final wasVerdict = p.kind == 'bilan_verdict';
    s = engine.choose(s, right);
    step++;
    if (wasVerdict && uneTenu != null) {
      final tenu = s.flags.contains('bilan_tenu');
      // Ce que le Verdict a réellement écrit : les tags des lignes d'Almanach
      // `bilan` ajoutées par _resolveBilan (descente / montee / titre).
      final applied = <String>{};
      for (final e in s.journal.skip(journalBefore)) {
        if (e.kind == 'bilan') applied.addAll(e.tags);
      }
      final problems = <String>[];
      if (tenu != uneTenu) problems.add('tenu $uneTenu ≠ $tenu');
      if (s.world.rangFinal != uneRang) problems.add('rang $uneRang ≠ ${s.world.rangFinal}');
      for (final o in const ['descente', 'montee', 'titre']) {
        if ((uneOutcome == o) != applied.contains(o)) problems.add('outcome « $uneOutcome » ≠ journal $applied');
      }
      if (kUneDescenteRe.hasMatch(uneText) && !applied.contains('descente')) problems.add('titre une descente sans descente');
      if (kUneMonteeRe.hasMatch(uneText) && !applied.contains('montee')) problems.add('titre une montée sans montée');
      if (kUneTitreRe.hasMatch(uneText) && !applied.contains('titre')) problems.add('titre un sacre sans titre');
      stats.uneChecks += 1;
      if (problems.isEmpty) {
        stats.uneChecksOk += 1;
      } else if (stats.uneCheckFailures.length < 5) {
        stats.uneCheckFailures.add('graine $seed S$seasonBefore : ${problems.join(', ')} · « ${uneText.length > 60 ? '${uneText.substring(0, 60)}…' : uneText} »');
      }
      uneTenu = null;
    }
    if (rec != null) {
      noteTraces(seasonBefore);
      noteOpenings();
    }
  }
  if (s.over && s.pending != null) scanPending(s.pending!); // l'écran de fin (épitaphe, « Ce qui s'est passé »)
  for (final e in s.journal) {
    scanText(e.text, 'journal/${e.kind}');
  }
  stats.nouvellesDateesPerdues = s.stats['nouvelle_datee_perdue'] ?? 0;
  stats.reactionsMissed = s.stats['miss_reaction'] ?? 0;
  s.stats.forEach((k, v) {
    if (k.startsWith('miss_reaction_')) stats.reactionsMissedBy[k.substring(14)] = v;
  });
  closeSeason(over: s.over);
  if (nar != null) {
    nar.runs += 1;
    nar.famine += s.stats['famine'] ?? 0;
    nar.cadencePull += s.stats['cadence_pull'] ?? 0;
    s.stats.forEach((k, v) {
      if (k.startsWith('miss_')) nar.misses[k] = (nar.misses[k] ?? 0) + v;
    });
    nar.setpieces += stats.setpieces;
    nar.setpiecesVariantes += stats.setpiecesVariantes;
    nar.nouvellesDatees += stats.nouvellesDatees;
    nar.nouvellesDateesPerdues += stats.nouvellesDateesPerdues;
    if (hadDrame) nar.runsWithDrame += 1;
    if (hadPalier) nar.runsWithPalier += 1;
    if (s0Ids.isNotEmpty) nar.s0Sequences.add(s0Ids.take(seasonSlots).join(','));
    s.arcs.forEach((id, st) {
      nar.arcsOpened += 1;
      nar.openedArcs.add(id);
      if (st.status == 'done') nar.arcsClosed += 1;
    });
    if (s.year > nar.maxYear) nar.maxYear = s.year;
    final fin = s.endingId ?? (s.over ? 'inconnu' : 'en cours');
    nar.endings[fin] = (nar.endings[fin] ?? 0) + 1;
    var nObj = 0;
    for (final u in s.unlocked) {
      if (!u.startsWith('objectif:')) continue;
      nObj += 1;
      final oid = u.substring(9);
      nar.objectifs[oid] = (nar.objectifs[oid] ?? 0) + 1;
    }
    if (nObj > 0) nar.runsWithObjectif += 1;
  }
  if (rec != null) {
    rec.ending = s.endingId ?? (s.over ? 'inconnu' : 'en cours');
    rec.seasonsPlayed = rec.seasons.length;
    rec.maxYear = s.year;
    // An arc armed by `openSeason` of a season that was never played (the
    // `--seasons` cut, or a run that ends at the Bilan) is not an opening.
    final played = rec.seasons.map((x) => x.season).toSet();
    rec.openings.removeWhere((o) => !played.contains(o.season));
    noteTolerant();
    s.arcs.forEach((id, st) {
      rec.arcStatus[id] = st.status;
      final r = st.reason;
      if (r != null && r.isNotEmpty) rec.arcReason[id] = r;
    });
    rec.stats = stats;
    for (final e in s.journal) {
      rec.journalPerSeason[e.season] = (rec.journalPerSeason[e.season] ?? 0) + 1;
      if (e.poids >= 2) rec.journalHeavy[e.season] = (rec.journalHeavy[e.season] ?? 0) + 1;
    }
    rec.seasonClosed = s.season; // les saisons < s.season ont été compactées à leur ouverture suivante
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

// ---------------------------------------------------------------------------
// Exposition (spec variété §5.1) : ce que les auteurs lisent pour savoir quelle
// carte n'est jamais sortie, et pourquoi.
// ---------------------------------------------------------------------------

/// Les fins qu'une carrière de ce rôle peut atteindre, en lecture statique :
/// les quatre portes du moteur (`Engine._checkEndings`), les fins de jauge de
/// `roles.yaml`, et toute fin visée par un `end:` — d'un choix de carte du
/// rôle, d'une étape d'arc atteignable, ou d'une variante de set-piece. C'est
/// le dénominateur de la matrice des fins (spec variété §5.3 : « chaque fin
/// atteinte au moins une fois »), sans lequel le budget reste déclaratif.
Set<String> reachableEndings(Content content, PostulatDef post, Set<String> arcsOuverts) {
  // Les fins que le moteur pose lui-même, sans `end:` en contenu.
  // `generique` n'en fait PAS partie : le moteur ne la pose jamais, elle n'est
  // qu'un repli de rendu (`content.endings[s.endingId] ?? …['generique']`).
  // Comptée comme porte, elle rendait le budget § 5.3 (« chaque fin atteinte au
  // moins une fois ») impossible à passer pour tous les postulats, et masquait
  // les fins réellement pauvres.
  final out = <String>{'grand_deballage'};
  final role = content.roles[post.role];
  if (role != null) {
    out.add(post.role == 'joueur' ? 'jubile' : 'en_retraite');
    for (final g in role.gauges) {
      out.add(g.emptyEnding);
      out.add(g.fullEnding);
    }
  }
  final arcs = reachableArcs(content, post, arcsOuverts);
  final stepArc = <String, String>{};
  for (final a in content.arcsSorted) {
    for (final st in a.steps) {
      for (final v in st.card) {
        stepArc[v.id] = a.id;
      }
    }
  }
  for (final c in content.cards.values) {
    if (!c.roles.contains(post.role)) continue;
    final arcId = stepArc[c.id] ?? c.arcId;
    if (arcId != null && !arcs.contains(arcId)) continue;
    for (final e in [c.left.effects.end, c.right.effects.end]) {
      if (e != null) out.add(e);
    }
  }
  return out;
}

/// Le bilan d'exposition d'un **rôle et d'un postulat**. L'ancienne mesure
/// prenait pour dénominateur toutes les cartes du rôle : les cartes d'un arc
/// qu'un autre postulat seul peut ouvrir, et les alarmes surchargées par un
/// autre postulat, y comptaient comme « jamais vues » sans le dire — d'où les
/// 29-37 % annoncés contre un seuil de 70 %. Ici le dénominateur est réduit aux
/// cartes **atteignables** par cette carrière, et les manquantes sont classées
/// par cause probable.
class Exposition {
  final String role;
  final String postulat;
  int atteignables = 0;
  int vues = 0;
  int horsPostulat = 0; // cartes du rôle qu'aucune carrière de ce postulat ne peut atteindre
  int datees = 0; // Nouvelles datées atteignables (fenêtre [year, year + 1])
  int dateesVues = 0;
  /// Nouvelles datées dont l'année n'a été vécue par aucune carrière mesurée :
  /// hors du dénominateur, comme une carte d'un autre postulat. Elles ne sont
  /// pas « jamais servies », elles appartiennent aux carrières longues.
  int dateesHorsPortee = 0;
  /// Replis d'ancre : dernière variante **sans garde** d'une étape dont toutes
  /// les autres variantes en ont une. Un repli n'existe que pour le cas où
  /// aucune garde ne tient ; le compter comme « jamais vue » reproche à un
  /// filet de ne pas avoir servi. Hors dénominateur, mais nommé ci-dessous.
  final List<String> replis = [];
  /// cause → ids, triés. Causes : `arc jamais ouvert`, `alarme par visage`,
  /// `variante perdante`, `garde d'état`, `jamais tirée`.
  final Map<String, List<String>> jamaisVues = {};
  Exposition(this.role, this.postulat);

  double get part => atteignables == 0 ? 0 : vues / atteignables;
  int get manquantes => jamaisVues.values.fold(0, (a, b) => a + b.length);
}

/// Les arcs qu'une carrière de ce postulat peut ouvrir, en lecture statique du
/// contenu (même filtre que `Director.eligibleArcs`, sans l'état) : le
/// réservoir du programme quand il y en a un — les séries non listées ne
/// s'ouvrent plus spontanément —, sinon toutes les séries du rôle ; plus l'arc
/// d'ouverture, les scripts de postulat et les événements du rôle. [observes]
/// (les arcs réellement entrés en jeu pendant les runs) est ajouté : un arc
/// atteint par un `schedule:` ou un `arc_next` d'une autre intrigue ne se lit
/// pas dans les déclarations.
Set<String> reachableArcs(Content content, PostulatDef post, Set<String> observes) {
  final out = <String>{...observes};
  final prog = post.programme;
  if (prog != null) {
    for (final e in prog.entriesUpTo(9)) {
      out.add(e.arc);
    }
  }
  // Un seul script de postulat est joué (`openSeason`) : celui du postulat,
  // sinon le générique. Les scripts des autres postulats — l'intérimaire, la
  // pépite — ne sont pas atteignables ici.
  final script = post.openingArc ?? 'co.script.generique';
  out.add(script);
  for (final a in content.arcsSorted) {
    if (!a.roles.contains(post.role)) continue;
    if (a.postulats.isNotEmpty && !a.postulats.contains(post.id)) continue;
    if (a.kind == 'evenement') out.add(a.id); // armEvents tire dans tout le rôle
    if (prog == null && a.kind == 'serie') out.add(a.id);
  }
  if (prog == null) {
    for (final sd in post.seeds) {
      out.add(sd.arc);
    }
  }
  out.removeWhere((id) {
    final a = content.arcs[id];
    return a != null && !a.roles.contains(post.role);
  });
  return out;
}

/// Les cartes d'alarme déclarées pour ce rôle **et** ce postulat (fichier du
/// rôle + `alarm_overrides` du postulat) ; l'ordre est celui de la lecture du
/// moteur, donc l'index dit à quel rang la carte est essayée.
Map<String, int> alarmRanks(Content content, PostulatDef post) {
  final out = <String, int>{};
  void add(Map<String, List<AlarmEntry>>? m) {
    m?.forEach((key, list) {
      for (var i = 0; i < list.length; i++) {
        final r = out[list[i].card];
        if (r == null || i < r) out[list[i].card] = i;
      }
    });
  }

  add(post.alarmOverrides);
  add(content.alarms[post.role]);
  return out;
}

/// Le bilan d'exposition d'un jeu de carrières du même postulat.
/// [seen] : ids servis ; [arcsOuverts] : arcs entrés en jeu ; [maxYear] : la
/// dernière année vécue par ces carrières. Une Nouvelle datée dont la fenêtre
/// [year, year + 1] s'ouvre après [maxYear] sort du dénominateur : le jeu ne
/// pouvait pas la servir, faute d'époque. Sans cela les trois gisements du
/// défaut d'exposition — l'époque, la garde d'état, le tirage — se masquent.
Exposition exposition(Content content, PostulatDef post, Set<String> seen, Set<String> arcsOuverts, {int maxYear = 9999}) {
  final ex = Exposition(post.role, post.id);
  final arcs = reachableArcs(content, post, arcsOuverts);
  final alarmes = alarmRanks(content, post);
  // Carte d'étape → (arc, étape, nombre de variantes, la variante a-t-elle un `if`).
  final variantOf = <String, List<Object>>{};
  for (final a in content.arcsSorted) {
    for (final st in a.steps) {
      // Repli d'ancre : plusieurs variantes, la dernière sans `if`, toutes les
      // autres gardées — si les gardes couvrent tous les cas (les trois fils
      // rouges du script, par exemple), le repli ne sort jamais, et c'est son
      // rôle.
      final repli = st.card.length > 1 && st.card.last.ifWhen == null && st.card.take(st.card.length - 1).every((v) => v.ifWhen != null);
      for (final v in st.card) {
        variantOf[v.id] = [a.id, st.id, st.card.length, v.ifWhen != null, repli && v.id == st.card.last.id];
      }
    }
  }
  final ids = content.cards.keys.toList()..sort();

  // Une carte-réaction n'est PAS « atteignable par construction » : elle
  // n'existe que si un `react:` la nomme, et un `react:` vit sur une sortie de
  // carte ou sur une manchette. Sur le promu, treize réactions du rôle
  // entraîneur ne sont nommées QUE par le script de l'intérimaire (ou par des
  // arcs du joueur) : `en.re.aulard_cdd`, `en.re.fardelli_juin`,
  // `en.re.josiane_cafetiere`… Elles gonflaient le dénominateur d'exposition
  // du postulat promu et remplissaient sa liste « jamais tirée » d'un défaut
  // que l'écriture ne peut pas corriger — au même titre qu'une alarme d'un
  // autre postulat ou qu'une étape d'un arc jamais ouvert, déjà écartées
  // ci-dessous. Point fixe : une réaction atteinte peut à son tour en poser
  // une autre (§ 1.4).
  bool sourceServable(Card c) {
    if (!c.roles.contains(post.role)) return false;
    final v = variantOf[c.id];
    final arcId = v != null ? v[0] as String : c.arcId;
    if (arcId != null && !arcs.contains(arcId)) return false;
    if (arcId == null && c.kind == 'alarme' && !alarmes.containsKey(c.id)) return false;
    return true;
  }

  final reactionsNommees = <String>{};
  void nommer(Iterable<ReactVariant> rs) {
    for (final r in rs) {
      reactionsNommees.add(r.card);
    }
  }

  for (final u in content.unes) {
    if (u.roles.isNotEmpty && !u.roles.contains(post.role)) continue;
    if (u.postulats.isNotEmpty && !u.postulats.contains(post.id)) continue;
    nommer(u.react);
  }
  for (var pass = 0; pass < 4; pass++) {
    final avant = reactionsNommees.length;
    for (final id in ids) {
      final c = content.cards[id]!;
      if (!sourceServable(c)) continue;
      if (c.kind == 'reaction' && !reactionsNommees.contains(id)) continue;
      nommer(c.left.effects.react);
      nommer(c.right.effects.react);
    }
    if (reactionsNommees.length == avant) break;
  }

  for (final id in ids) {
    final card = content.cards[id]!;
    if (!card.roles.contains(post.role)) continue;
    if (card.kind == 'reaction' && !reactionsNommees.contains(id)) {
      ex.horsPostulat += 1; // réaction qu'aucun `react:` de ce postulat ne nomme
      continue;
    }
    // Atteignable ? Une carte d'étape suit son arc ; une alarme suit les
    // listes du rôle et du postulat ; tout le reste (sac, Nouvelles, paliers,
    // retrouvailles, « Nouvelles du passé ») est atteignable par construction.
    final v = variantOf[id];
    final arcId = v != null ? v[0] as String : card.arcId;
    if (arcId != null && !arcs.contains(arcId)) {
      ex.horsPostulat += 1;
      continue;
    }
    if (arcId == null && card.kind == 'alarme' && !alarmes.containsKey(id)) {
      ex.horsPostulat += 1; // alarme d'un autre postulat (alarm_overrides)
      continue;
    }
    if (v != null && v.length > 4 && v[4] == true && !seen.contains(id)) {
      ex.replis.add(id);
      ex.horsPostulat += 1;
      continue;
    }
    if (card.year != null && card.year! > maxYear) {
      ex.dateesHorsPortee += 1;
      ex.horsPostulat += 1;
      continue;
    }
    ex.atteignables += 1;
    if (card.year != null) ex.datees += 1;
    if (seen.contains(id)) {
      ex.vues += 1;
      if (card.year != null) ex.dateesVues += 1;
      continue;
    }
    String cause;
    if (alarmes.containsKey(id)) {
      cause = alarmes[id]! == 0 ? 'alarme par visage (1re de sa liste)' : 'alarme par visage';
    } else if (arcId != null && !arcsOuverts.contains(arcId)) {
      cause = 'arc jamais ouvert';
    } else if (v != null && ((v[2] as int) > 1 || v[3] == true)) {
      cause = 'variante perdante';
    } else if (card.year != null) {
      // L'année a été vécue (sinon la carte est sortie du dénominateur plus
      // haut) : la Nouvelle était servable et ne l'a pas été.
      cause = 'Nouvelle datée (année vécue, jamais servie)';
    } else if (card.when != null) {
      cause = "garde d'état";
    } else {
      cause = 'jamais tirée';
    }
    (ex.jamaisVues[cause] ??= []).add(id);
  }
  return ex;
}

/// Écrit le bilan d'exposition, cause par cause. C'est cette liste que les
/// auteurs lisent : chaque ligne dit quoi faire (ouvrir l'arc, desserrer la
/// garde, remonter la variante, ajouter un visage d'alarme).
void _printExposition(Exposition ex, {double seuil = 0.70, int parCause = 10}) {
  _line(ex.part >= seuil, 'exposition · rôle ${ex.role} · postulat ${ex.postulat}',
      '${_f(100 * ex.part, 0)} % (${ex.vues}/${ex.atteignables} atteignables ; ${ex.horsPostulat} cartes du rôle hors de ce postulat)', '≥ ${_f(100 * seuil, 0)} %');
  // Les Nouvelles datées couvrent 1990-2020 : dix carrières de cinq saisons
  // n'atteindront jamais les années tardives. La part hors datées dit ce que
  // l'écriture peut réellement viser.
  if (ex.replis.isNotEmpty) {
    final l = ex.replis.toList()..sort();
    stdout.writeln('    ${'· replis d\'ancre jamais nécessaires (hors dénom.)'.padRight(44)} ${l.length} : ${l.take(parCause).join(', ')}${l.length > parCause ? '…' : ''}');
  }
  if (ex.dateesHorsPortee > 0) {
    stdout.writeln('    ${'· Nouvelles datées hors époque (hors dénominateur)'.padRight(44)} ${ex.dateesHorsPortee} (années jamais vécues)');
  }
  if (ex.datees > 0) {
    final base = ex.atteignables - ex.datees;
    final part = base == 0 ? 0.0 : (ex.vues - ex.dateesVues) / base;
    stdout.writeln('    ${'· hors Nouvelles datées'.padRight(44)} ${_f(100 * part, 0)} % (${ex.vues - ex.dateesVues}/$base) · datées vues ${ex.dateesVues}/${ex.datees}');
  }
  final causes = ex.jamaisVues.keys.toList()..sort();
  for (final c in causes) {
    final l = ex.jamaisVues[c]!;
    stdout.writeln('    · ${'$c (${l.length})'.padRight(42)} ${l.take(parCause).join(', ')}${l.length > parCause ? '…' : ''}');
  }
}

/// Prints the diversity report ; returns the budgets that `--assert` enforces
/// at this stage (reactions consecutive / latency, « la Une ne ment pas »,
/// unresolved placeholders — spec variété §5.2-5.3 ; the volume budgets are
/// printed with their threshold only).
List<String> _reportDiversity(List<RunRecord> recs, Content content, int postulat, int maxSeasons) {
  final post = content.postulatsByIndex[postulat];
  final n = recs.length;
  final failures = <String>[];
  if (n == 0) return failures;
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
  int closePairs = 0, jumps = 0;
  for (final r in recs) {
    final o = r.openingsOf(0).where((e) => !e.jump).toList();
    jumps += r.openingsOf(0).length - o.length;
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
      firstSlots.isEmpty
          ? 'aucune ouverture d\'intrigue en S0'
          : 'écart-type ${_f(sd, 2)} · moy ${_f(_mean(firstSlots))} · S0 avec deux ouvertures à < 3 slots $closePairs'
              ' (${_f(100 * closePairs / math.max(1, n), 1)} %, hors $jumps sauts d\'arc)',
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
    // La bande propre à l'intrigue signature ([50 %, 65 %], spec § 5.1) : elle
    // n'était mesurée nulle part, seule la bande commune [10 %, 65 %] l'était,
    // si bien qu'une signature sous son plancher passait pour saine.
    final signatures = <String>{
      for (final b in (post.programme?.buckets.values ?? const <BucketDef>[]))
        for (final e in b.pool)
          if (e.signature) e.arc,
    }.where(cover.containsKey).toList()
      ..sort();
    for (final sig in signatures) {
      final v = cover[sig]!;
      _line(v >= 0.50 && v <= 0.65, '  couverture de la signature',
          '${sig.replaceFirst(RegExp(r'^(en|jp|co)\.'), '')} ${_f(100 * v, 0)} %', '∈ [50 %, 65 %]');
    }
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
    final rares = _issuesRares();
    for (final a in arcs) {
      final m = outcomes[a]!;
      final total = m.values.fold<int>(0, (x, y) => x + y);
      final ks = m.keys.toList()..sort();
      // Clause d'exception du § 5.1 : une issue déclarée `issues_rares` dans
      // l'arc (sortie fatale, ou issue qui demande un état rare) ne tient pas
      // le plancher de 10 %. Elle reste affichée, suivie d'un « (rare) ».
      final rare = rares[a] ?? const <String>{};
      final ok = ks.every((k) => rare.contains(k) || m[k]! / total >= 0.10);
      _line(ok, 'issues · $a',
          ks.map((k) => '$k ${_f(100 * m[k]! / total, 0)}%${rare.contains(k) ? ' (rare)' : ''}').join(' · '),
          'aucune < 10 %, hors issues_rares');
    }
  }

  final ds = pairs.map((p) => careerDistance(recs[p[0]], recs[p[1]])).toList();
  final dMed = _pct(ds, 0.5);
  final dP10 = _pct(ds, 0.10);
  final ji = _mean(pairs.map((p) => jaccard(recs[p[0]].intrigues, recs[p[1]].intrigues)));
  final ju = _mean(pairs.map((p) => jaccard(recs[p[0]].unes.toSet(), recs[p[1]].unes.toSet())));
  final jt = _mean(pairs.map((p) => jaccard(recs[p[0]].traces, recs[p[1]].traces)));
  _line(dMed >= 0.6 && dP10 >= 0.35, 'distance de carrière D', 'médiane ${_f(dMed, 2)} · P10 ${_f(dP10, 2)} · J intrigues ${_f(ji, 2)} · J Unes ${_f(ju, 2)} · J traces ${_f(jt, 2)}', 'médiane ≥ 0,6 ; P10 ≥ 0,35');

  // Exposition à 10 carrières, par rôle **et** par postulat, avec les cartes
  // jamais vues classées par cause probable (défaut « exposition »).
  final seen10 = <String>{};
  final arcs10 = <String>{};
  var maxYear10 = 0;
  for (final r in recs.take(10)) {
    seen10.addAll(r.seen);
    arcs10.addAll(r.arcStatus.keys);
    if (r.maxYear > maxYear10) maxYear10 = r.maxYear;
  }
  stdout.writeln('  — exposition à 10 carrières —');
  _printExposition(exposition(content, post, seen10, arcs10, maxYear: maxYear10));

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

  // --- 5.2 réactions (étape 2) ---------------------------------------------
  final allSeasons = recs.expand((r) => r.seasons).toList();
  final rxPerSeason = allSeasons.map((x) => x.reactions).toList();
  final rxMean = _mean(rxPerSeason);
  final rxMax = rxPerSeason.isEmpty ? 0 : rxPerSeason.reduce(math.max);
  int rxServed = 0, rxLat1 = 0, rxConsec = 0, rxMissed = 0;
  final rxMissedBy = <String, int>{};
  for (final r in recs) {
    rxServed += r.stats.reactions;
    rxLat1 += r.stats.reactionsLat1;
    rxConsec += r.stats.reactionsConsecutive;
    rxMissed += r.stats.reactionsMissed;
    r.stats.reactionsMissedBy.forEach((k, v) => rxMissedBy[k] = (rxMissedBy[k] ?? 0) + v);
  }
  final latShare = rxServed == 0 ? 1.0 : rxLat1 / rxServed;
  final rxMaxOk = rxMax <= content.director.reactionsMax;
  final missedKeys = rxMissedBy.keys.toList()..sort();
  _line(rxMean >= 1.5 && rxMean <= 3 && rxMaxOk && rxConsec == 0 && latShare >= 1.0, 'réactions par saison',
      'moy ${_f(rxMean, 2)} · max $rxMax · consécutives $rxConsec · latence 1 ${_f(100 * latShare, 0)} % ($rxLat1/$rxServed) · perdues $rxMissed'
      '${missedKeys.isEmpty ? '' : ' (${missedKeys.map((k) => '$k ${rxMissedBy[k]}').join(' · ')})'}',
      '1,5-3 · ≤ ${content.director.reactionsMax} · 0 · 100 %');
  if (rxConsec != 0) failures.add('réactions consécutives $rxConsec');
  if (latShare < 1.0) failures.add('latence des réactions ${_f(100 * latShare, 0)} %');
  if (!rxMaxOk) failures.add('réactions par saison max $rxMax > ${content.director.reactionsMax}');

  // --- 5.3 Unes, journal, nom, placeholders --------------------------------
  final uneFreq = <String, int>{};
  int bilans = 0, generic = 0, secours = 0, brevesFull = 0, checks = 0, checksOk = 0;
  final checkFailures = <String>[];
  for (final r in recs) {
    for (final u in r.unes) {
      bilans += 1;
      uneFreq[u] = (uneFreq[u] ?? 0) + 1;
    }
    for (final pr in r.unePriorities) {
      if (pr <= 1) generic += 1;
      if (pr <= 0) secours += 1;
    }
    brevesFull += r.brevesFull;
    checks += r.stats.uneChecks;
    checksOk += r.stats.uneChecksOk;
    if (checkFailures.length < 3) checkFailures.addAll(r.stats.uneCheckFailures.take(3 - checkFailures.length));
  }
  final topUne = uneFreq.entries.toList()..sort((a, b) => b.value != a.value ? b.value.compareTo(a.value) : a.key.compareTo(b.key));
  final topShare = bilans == 0 ? 0.0 : topUne.first.value / bilans;
  final genShare = bilans == 0 ? 0.0 : generic / bilans;
  final secShare = bilans == 0 ? 0.0 : secours / bilans;
  _line(uneFreq.length >= 12 && topShare <= 0.30 && genShare < 0.25 && secShare < 0.10, 'Unes distinctes / Bilans',
      '${uneFreq.length} / $bilans · la plus fréquente ${_f(100 * topShare, 0)} % · génériques (priorité ≤ 1) ${_f(100 * genShare, 0)} % · secours (0) ${_f(100 * secShare, 0)} %',
      '≥ 12 ; aucune > 30 % ; génériques < 25 % ; secours < 10 %');
  final checkShare = checks == 0 ? 1.0 : checksOk / checks;
  _line(checkShare >= 1.0, 'la Une ne ment pas (tenu, rang, issue == verdict appliqué)', '${_f(100 * checkShare, 0)} % ($checksOk/$checks)${checkFailures.isEmpty ? '' : ' · ${checkFailures.join(' ; ')}'}', '100 %');
  if (checkShare < 1.0) failures.add('la Une ment dans ${checks - checksOk} Bilan(s)');
  final brevesShare = bilans == 0 ? 0.0 : brevesFull / bilans;
  _line(brevesShare >= 0.90, 'brèves : Bilans avec ${content.director.unesBreves} brèves issues du journal', '${_f(100 * brevesShare, 0)} % ($brevesFull/$bilans)', '≥ 90 %');

  final heavy = <int>[];
  final perClosed = <int>[];
  for (final r in recs) {
    for (final sr in r.seasons) {
      heavy.add(r.journalHeavy[sr.season] ?? 0);
      if (sr.season < r.seasonClosed) perClosed.add(r.journalPerSeason[sr.season] ?? 0);
    }
  }
  final heavyMin = heavy.isEmpty ? 0 : heavy.reduce(math.min);
  final perMax = perClosed.isEmpty ? 0 : perClosed.reduce(math.max);
  _line(_pct(heavy, 0.5) >= 3 && perMax <= content.director.journalParSaison, 'journal : entrées de poids ≥ 2 par saison',
      'médiane ${_f(_pct(heavy, 0.5), 0)} · min $heavyMin · moy ${_f(_mean(heavy))} · max après compaction $perMax (${perClosed.length} saisons closes)',
      '≥ 3 ; ≤ ${content.director.journalParSaison} après compaction');

  final withName = allSeasons.where((x) => x.nameCards >= 2).length;
  final nameShare = allSeasons.isEmpty ? 0.0 : withName / allSeasons.length;
  final nameConsec = allSeasons.fold<int>(0, (a, x) => a + x.nameConsecutive);
  final nameConsecToi = allSeasons.fold<int>(0, (a, x) => a + x.nameConsecutiveToi);
  _line(nameShare >= 0.95 && nameConsec == 0, 'nom : saisons avec ≥ 2 cartes portant le nom',
      '${_f(100 * nameShare, 0)} % ($withName/${allSeasons.length}) · moy ${_f(_mean(allSeasons.map((x) => x.nameCards)))} cartes/saison · deux de suite $nameConsec (via {toi}, hors budget : $nameConsecToi)',
      '≥ 95 % ; jamais deux de suite (hors {toi})');

  int unresolved = 0;
  final samples = <String>[];
  for (final r in recs) {
    unresolved += r.stats.unresolved;
    if (samples.length < 4) samples.addAll(r.stats.unresolvedSamples.take(4 - samples.length));
  }
  _line(unresolved == 0, 'placeholders non résolus (textes servis)', '$unresolved${samples.isEmpty ? '' : ' · ${samples.join(' ; ')}'}', '0');
  if (unresolved != 0) failures.add('placeholders non résolus $unresolved');
  return failures;
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
  stdout.writeln('  ${'intrigue'.padRight(28)} ${'porteur'.padRight(26)} ${buckets.map((b) => '$b ouv. (forcées)'.padRight(20)).join('')} carrière  slot moy  forcées');
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
    final carrier = a.cast.isEmpty ? '—' : _visage(content, a.cast.first);
    final forcedRate = allOpen == 0 ? 0.0 : allForced / allOpen;
    stdout.writeln('  ${_mark(career >= 0.10 && career <= 0.65)} ${a.id.padRight(26)} ${carrier.padRight(26)} ${cells.join('')} ${_f(100 * career, 0).padLeft(4)} %   ${_f(_mean(slots)).padLeft(5)}   ${_mark(forcedRate <= 0.15)} ${_f(100 * forcedRate, 0)} %');
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
      parts.add('${_visage(content, ch)} ${_f(100 * share, 0)}%');
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

void _reportNarrative(Narrative nar, Content content, int postulat, bool assertBudgets, {List<String> extraFailures = const []}) {
  final post = content.postulatsByIndex[postulat];
  final failures = <String>[...extraFailures];

  stdout.writeln('── Métriques narratives · postulat $postulat « ${post.title} » · ${nar.runs} runs ──');
  for (final b in ['S0', 'S1', 'S2+']) {
    final ms = nar.byBucket[b]!;
    if (ms.isEmpty) continue;
    final n = ms.length;
    // Cadence, temps d'histoire et Nouvelles : **saisons closes seulement**
    // (SeasonMetrics.closed), comme la ligne « journal » le fait déjà. Une
    // saison tronquée par la fin de carrière n'a pas de trou de cadence ni un
    // déficit de Nouvelles : elle a une fin.
    final closed = ms.where((m) => m.closed).toList();
    final nc = math.max(1, closed.length);
    final gaps = closed.map((m) => m.maxGap).toList();
    final stories = closed.map((m) => m.story).toList();
    final nouv = closed.map((m) => m.nouvelles).toList();
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
    stdout.writeln('  [$b] $n saisons (${closed.length} closes) · ${_f(cards / n)} cartes/saison');
    final gapMax = gaps.isEmpty ? 0 : gaps.reduce(math.max);
    final gapLimit = b == 'S2+' ? 4 : 3; // spec variété §5.2 : ≤ 3 (S0-S1), ≤ 4 (S2+)
    final okGap = gapMax <= gapLimit;
    // D'où vient le maximum : la saison la plus tardive qui l'atteint. Un
    // écart de 10+ en S2+ n'est plus une saison tronquée (elles sont exclues) —
    // c'est une carrière très longue dont le réservoir d'intrigues est vidé :
    // `forceStory` n'a plus rien à ouvrir et la saison finit en routines.
    final over = closed.where((m) => m.maxGap > gapLimit).toList();
    final worstSeason = over.isEmpty ? -1 : over.map((m) => m.season).reduce(math.max);
    final gapWhere = over.isEmpty
        ? ''
        : ' · ${over.length}/${closed.length} saisons > $gapLimit, la plus tardive S$worstSeason'
            ' (graines ${over.take(4).map((m) => m.seed).join(', ')})';
    stdout.writeln('  ${okGap ? '✔' : '✗'} ${'cadence : écart max entre temps d\'histoire (≤ $gapLimit)'.padRight(44)} max $gapMax · moy ${_f(_mean(gaps))} · P95 ${_f(_pct(gaps, 0.95), 0)} · saisons closes$gapWhere'); 
    if (assertBudgets && !okGap) failures.add('[$b] écart max $gapMax > $gapLimit');
    final storyP5 = _pct(stories, 0.05);
    final storyOk = b == 'S0' ? storyP5 >= 10 : storyP5 >= 8;
    stdout.writeln('  ${storyOk ? '✔' : '✗'} ${'temps d\'histoire par saison'.padRight(44)} P5 ${_f(storyP5, 0)} · médiane ${_f(_pct(stories, 0.5), 0)} · moy ${_f(_mean(stories))} · saisons closes');
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
    final nouvOk = nouv.where((v) => v == 3 || v == 4).length / nc >= 0.95 && ms.every((m) => m.consecutiveNouvelles == 0);
    stdout.writeln('  ${nouvOk ? '✔' : '✗'} ${'Nouvelles par saison (3-4, jamais deux d\'affilée)'.padRight(44)} moy ${_f(_mean(nouv))} · 3-4 dans ${_f(100 * nouv.where((v) => v == 3 || v == 4).length / nc, 0)} % · consécutives ${ms.fold<int>(0, (a, m) => a + m.consecutiveNouvelles)} · saisons closes');
    if (assertBudgets && !nouvOk) failures.add('[$b] Nouvelles');
    // Cartes d'époque (spec variété §1.5 ; retour joueur « je ne les ai jamais
    // retrouvées ») : combien par saison, dans quelle part des saisons, et à
    // quel créneau la première tombe. Budget : ≥ 2 par saison servies, et une
    // carte d'époque dans ≥ 80 % des premières saisons (S0), au plus tard au
    // douzième créneau.
    final dat = ms.map((m) => m.datees).toList();
    final avecDatee = ms.where((m) => m.datees > 0).length;
    final tot = ms.isEmpty ? 1 : ms.length;
    final premiers = ms.where((m) => m.firstDateeSlot > 0).map((m) => m.firstDateeSlot).toList()..sort();
    final premierMed = premiers.isEmpty ? 0 : premiers[premiers.length ~/ 2];
    final tot12 = ms.where((m) => m.firstDateeSlot > 0 && m.firstDateeSlot <= 12).length;
    final datOk = _mean(dat) >= 2.0 && (b != 'S0' || (avecDatee / tot >= 0.80 && tot12 / tot >= 0.80));
    stdout.writeln('  ${datOk ? '✔' : '✗'} ${'cartes d\'époque par saison'.padRight(44)} moy ${_f(_mean(dat), 2)} · saison en servant ≥ 1 ${_f(100 * avecDatee / tot, 0)} % · dans les 12 premiers créneaux ${_f(100 * tot12 / tot, 0)} % · 1er créneau médian $premierMed · seuil ≥ 2 ; ≥ 80 % en S0');
    if (assertBudgets && !datOk) failures.add('[$b] cartes d\'époque');
    final alarmsOk = alarms.every((v) => v <= 3);
    stdout.writeln('  ${alarmsOk ? '✔' : '✗'} ${'alarmes par saison (≤ 3)'.padRight(44)} moy ${_f(_mean(alarms))} · max ${alarms.isEmpty ? 0 : alarms.reduce(math.max)}');
    final evMean = _mean(events);
    final evOk = events.every((v) => v <= 1) && (b == 'S0' || evMean >= 0.2);
    stdout.writeln('  ${evOk ? '✔' : '✗'} ${'événements par saison (≤ 1 ; ≥ 0,2 dès S1)'.padRight(44)} moy ${_f(evMean, 2)}');
    if (assertBudgets && !evOk) failures.add('[$b] événements moy ${_f(evMean, 2)}');
    final overdueRate = steps == 0 ? 0.0 : overdue / steps;
    final backlogMax = backlog.isEmpty ? 0 : backlog.reduce(math.max);
    // Le budget porte sur le P99 des saisons, pas sur le maximum : un maximum
    // pris sur des milliers de saisons est une valeur extrême (les quatre
    // derniers créneaux d'une saison ne peuvent pas servir cinq entrées), pas
    // un budget. Le maximum reste affiché.
    final backlogP99 = _pct(backlog, 0.99);
    final deadlineOk = (b == 'S0' ? overdueRate <= 0.60 : overdueRate <= 0.40) && backlogP99 <= 2;
    final kinds = <String, int>{};
    for (final m in ms) {
      if (m.maxBacklog >= 3 && m.maxBacklogKinds.isNotEmpty) kinds[m.maxBacklogKinds] = (kinds[m.maxBacklogKinds] ?? 0) + 1;
    }
    final topKinds = kinds.entries.toList()..sort((a, b2) => b2.value != a.value ? b2.value.compareTo(a.value) : a.key.compareTo(b2.key));
    stdout.writeln('  ${deadlineOk ? '✔' : '✗'} ${'échéances : étapes échues · backlog P99 · max'.padRight(44)} ${_f(100 * overdueRate, 0)} % · ${_f(backlogP99, 0)} · $backlogMax'
        '${topKinds.isEmpty ? '' : ' · empilements ≥ 3 : ${topKinds.take(4).map((e) => '${e.key} ×${e.value}').join(', ')}'}');
    if (assertBudgets && !deadlineOk) failures.add('[$b] échéances ${_f(100 * overdueRate, 0)} % / backlog P99 ${_f(backlogP99, 0)}');
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
  // `cadence_pull` est un forçage **de saison** (un trou de cadence dans une
  // saison le déclenche) : le rapporter par run mêlait le budget à la longueur
  // de carrière — 0,42 forçage par saison × 3,6 saisons ≈ 1,5 par run pour un
  // plafond de 0,3 écrit pour une saison. Le seuil est désormais lu par saison,
  // et la valeur par run reste affichée.
  final saisons = nar.byBucket.values.fold<int>(0, (a, l) => a + l.length);
  final pullParSaison = nar.cadencePull / math.max(1, saisons);
  stdout.writeln('  ${pullParSaison <= 0.3 ? '✔' : '✗'} ${'cadence_pull par saison (par run)'.padRight(44)} ${_f(pullParSaison, 2)} (${_f(nar.cadencePull / math.max(1, nar.runs), 2)})');
  final missTotal = nar.misses.entries.where((e) => e.key != 'miss_ineligible').fold<int>(0, (a, e) => a + e.value);
  stdout.writeln('  ${missTotal / math.max(1, nar.runs) <= 1 ? '✔' : '✗'} ${'annulations par run (hors ineligible)'.padRight(44)} ${_f(missTotal / math.max(1, nar.runs), 2)} · ${nar.misses.entries.map((e) => '${e.key.substring(5)} ${e.value}').join(' · ')}');
  stdout.writeln('    drames : ${_f(100 * nar.runsWithDrame / math.max(1, nar.runs), 0)} % des runs · paliers de relation : ${_f(100 * nar.runsWithPalier / math.max(1, nar.runs), 0)} % des runs');
  stdout.writeln('    arcs ouverts/fermés par run : ${_f(nar.arcsOpened / math.max(1, nar.runs))} / ${_f(nar.arcsClosed / math.max(1, nar.runs))}');
  // --- 5.3 : la matrice des fins et les objectifs cachés --------------------
  // Deux budgets du §5.3 restaient déclaratifs faute d'être mesurés : « chaque
  // fin atteinte ≥ 1 fois » (le rapport de politique n'affichait que les six
  // premières causes) et « 30-60 % des carrières atteignent ≥ 1 objectif ».
  final portes = reachableEndings(content, post, nar.openedArcs);
  final atteintes = nar.endings.keys.where((e) => e != 'en cours' && e != 'inconnu').toSet();
  final jamais = (portes.difference(atteintes).toList())..sort();
  final finsOk = jamais.isEmpty;
  stdout.writeln('  ${finsOk ? '✔' : '✗'} ${'fins atteintes / fins ouvertes au postulat'.padRight(44)} ${atteintes.length}/${portes.length} · seuil chaque fin ≥ 1 fois');
  final finsTri = nar.endings.entries.where((e) => e.key != 'en cours').toList()
    ..sort((a, b) => a.value != b.value ? b.value.compareTo(a.value) : a.key.compareTo(b.key));
  stdout.writeln('    · ${'toutes les fins servies'.padRight(42)} ${finsTri.map((e) => '${e.key} ${_f(100 * e.value / math.max(1, nar.runs), 1)}%').join(' · ')}');
  if (jamais.isNotEmpty) {
    stdout.writeln('    · ${'jamais atteintes (${jamais.length})'.padRight(42)} ${jamais.join(', ')}');
  }
  // Non asserté : la lecture statique des portes compte aussi les fins que ce
  // postulat ne peut pas atteindre en pratique (l'âge de la retraite, le repli
  // générique de fin de carrière). La liste est là pour être lue par l'auteur ;
  // c'est elle qui manquait au §5.3, pas un seuil de plus.

  if (post.objectifs.isNotEmpty) {
    final partObj = nar.runsWithObjectif / math.max(1, nar.runs);
    final objOk = partObj >= 0.30 && partObj <= 0.60;
    final detail = post.objectifs
        .map((o) => '${o.id} ${_f(100 * (nar.objectifs[o.id] ?? 0) / math.max(1, nar.runs), 0)}%')
        .join(' · ');
    stdout.writeln('  ${objOk ? '✔' : '✗'} ${'objectifs : carrières en atteignant ≥ 1'.padRight(44)} ${_f(100 * partObj, 0)} % · $detail · seuil 30-60 %');
    // Non asserté dans ce lot : la mesure n'existait pas, et la bande 30-60 %
    // demande de rejouer la difficulté des trois objectifs cachés du postulat
    // (« Garder le poste » est atteint par quatre carrières sur cinq) — c'est
    // un arbitrage de conception, pas un défaut de tirage.
  }
  // Exposition sur l'ensemble des runs, dénominateur honnête (rôle + postulat)
  // et cartes jamais vues classées par cause probable.
  final expo = exposition(content, post, nar.seenCards, nar.openedArcs, maxYear: nar.maxYear);
  _printExposition(expo, seuil: 0.90);
  stdout.writeln('  ${nar.s0Sequences.length >= 25 ? '✔' : '✗'} ${'entropie : séquences S0 distinctes (tous ids)'.padRight(44)} ${nar.s0Sequences.length}');
  // Set-pieces (spec variété §1.12) : tant que content/setpieces.yaml n'a que
  // ses secours, la part servie en variante reste basse — c'est la mesure du
  // « la S2+ ressemble à la S0 ».
  final spShare = nar.setpieces == 0 ? 0.0 : nar.setpiecesVariantes / nar.setpieces;
  stdout.writeln('  ${spShare >= 0.50 ? '✔' : '✗'} ${'set-pieces servis en variante (hors secours)'.padRight(44)} ${_f(100 * spShare, 0)} % (${nar.setpiecesVariantes}/${nar.setpieces}) · seuil 50 %');
  // Cartes d'époque / Nouvelles datées (spec variété §1.5). Le budget a changé
  // avec le lot « anecdotes d'époque » : le retour joueur était « les anecdotes
  // liées au foot dans son histoire générale, je ne les ai jamais retrouvées »,
  // donc ce qui se mesure d'abord est ce que la carrière VOIT — ≥ 2 par saison.
  // Les « perdues » ne sont plus un plafond : la banque d'époque est
  // volontairement plus profonde que les quatre créneaux réservés d'une saison
  // (deux à trois cartes par année vécue), pour que deux carrières de la même
  // décennie ne lisent pas la même chronologie. Une carte laissée de côté par
  // CETTE carrière n'est pas du contenu mort ; du contenu mort, ce serait une
  // carte que PERSONNE ne voit — et c'est ce que la seconde moitié du test
  // vérifie, sur l'ensemble des runs (`datées vues x/x` du bloc exposition).
  final dateesTotal = content.cards.values.where((c) => c.year != null && c.roles.contains(post.role)).length;
  final perduesParRun = nar.nouvellesDateesPerdues / math.max(1, nar.runs);
  final dateesParSaison = nar.nouvellesDatees / math.max(1, saisons);
  // « Vues au moins une fois » se lit sur l'ensemble des runs, pas par carrière :
  // une carte de 1999 n'est à portée que des carrières qui vivent jusque-là, et
  // il y en a peu. D'où 95 % et non 100 % — ce qui se surveille, c'est une
  // carte d'époque qu'AUCUNE carrière ne peut atteindre, pas la queue de
  // distribution des carrières longues.
  final partVues = expo.datees == 0 ? 1.0 : expo.dateesVues / expo.datees;
  final dateesOk = dateesParSaison >= 2.0 && partVues >= 0.95;
  stdout.writeln('  ${dateesOk ? '✔' : '✗'} ${'cartes d\'époque : par saison / par run / laissées'.padRight(44)} ${_f(dateesParSaison, 2)} / ${_f(nar.nouvellesDatees / math.max(1, nar.runs), 2)} / ${_f(perduesParRun, 2)} ($dateesTotal écrites · ${expo.dateesVues}/${expo.datees} vues au moins une fois) · seuil ≥ 2 par saison ; ≥ 95 % vues');
  if (assertBudgets && failures.isNotEmpty) {
    stderr.writeln('${failures.length} budget(s) narratif(s) violé(s) :');
    for (final f in failures) {
      stderr.writeln('  - $f');
    }
    exit(1);
  }
}

/// `--arc <id>` (spec variété §5.2) : la fiche d'une intrigue sur N carrières —
/// taux d'ouverture par saison, créneau d'ouverture, issues atteintes,
/// clôtures et expirations, cartes de l'arc jamais vues. C'est le rapport que
/// lit l'auteur d'une intrigue avant de la déclarer finie.
void _reportArc(List<RunRecord> recs, Content content, int postulat, String arcId) {
  final arc = content.arcs[arcId];
  final post = content.postulatsByIndex[postulat];
  if (arc == null) {
    stderr.writeln('Intrigue « $arcId » inconnue. Intrigues du rôle ${post.role} : '
        '${content.arcsSorted.where((a) => a.roles.contains(post.role)).map((a) => a.id).join(', ')}');
    exit(1);
  }
  final n = recs.length;
  stdout.writeln('── Intrigue $arcId « ${arc.title ?? '—'} » · postulat $postulat « ${post.title} » · $n runs ──');
  if (!arc.roles.contains(post.role)) {
    stdout.writeln('  ⚠ l\'intrigue ne joue pas le rôle ${post.role} de ce postulat : elle ne peut pas s\'ouvrir ici.');
  }
  // Ouvertures : part des carrières, part par saison, créneau, forçage.
  // Un arc `kind: postulat` (l'`opening_arc`) n'est pas « ouvert » par le
  // tirage de saison : il est semé d'office. Sans ça, son compteur reste à 0
  // et les issues sont divisées par zéro (voir §5.1 « issues »).
  final isOpeningArc = arc.kind == 'postulat' || post.openingArc == arcId;
  final withOpening = isOpeningArc
      ? recs.length
      : recs.where((r) => r.openings.any((o) => o.arc == arcId)).length;
  final bySeason = <int, int>{};
  final slots = <int>[];
  int forced = 0, jumps = 0, openings = 0;
  final seasonsPlayed = <int, int>{}; // saison → carrières qui l'ont jouée
  for (final r in recs) {
    for (int k = 0; k < r.seasonsPlayed; k++) {
      seasonsPlayed[k] = (seasonsPlayed[k] ?? 0) + 1;
    }
    for (final o in r.openings.where((o) => o.arc == arcId)) {
      openings += 1;
      bySeason[o.season] = (bySeason[o.season] ?? 0) + 1;
      slots.add(o.slot);
      if (o.forced) forced += 1;
      if (o.jump) jumps += 1;
    }
  }
  _line(withOpening / math.max(1, n) >= 0.20, 'carrières où l\'intrigue s\'ouvre',
      isOpeningArc
          ? '100 % ($n/$n) · semée d\'office (opening_arc)'
          : '${_f(100 * withOpening / n, 0)} % ($withOpening/$n) · ${_f(openings / math.max(1, n), 2)} ouverture(s) par carrière',
      '≥ 20 %');
  final seasonKeys = bySeason.keys.toList()..sort();
  stdout.writeln('    par saison : ${seasonKeys.isEmpty ? '—' : seasonKeys.map((k) => 'S$k ${_f(100 * bySeason[k]! / math.max(1, seasonsPlayed[k] ?? n), 0)} %').join(' · ')}'
      '  (part des saisons jouées)');
  if (slots.isNotEmpty) {
    stdout.writeln('    créneau d\'ouverture : médiane ${_f(_pct(slots, 0.5), 0)} · min ${slots.reduce(math.min)} · max ${slots.reduce(math.max)}'
        ' · forcée ${_f(100 * forced / openings, 0)} % · saut d\'arc ${_f(100 * jumps / openings, 0)} %');
  }
  // Issues (spec variété §1.3) : chaque issue déclarée doit être atteinte.
  final outcomes = <String, int>{};
  for (final r in recs) {
    final o = r.outcomes[arcId];
    if (o != null && o.isNotEmpty) outcomes[o] = (outcomes[o] ?? 0) + 1;
  }
  // Les issues déclarées rares ne sont pas des issues manquantes : à 300
  // tirages une issue à 4 % sort dans un échantillon sur deux, et le rapport
  // accusait alors une intrigue saine (`troque` d'en.dossier_meneche). Même
  // clause d'exception que le bloc « issues » du rapport de diversité, et
  // l'échantillon est nommé pour que « jamais atteinte » se lise « pas dans
  // ces $n tirages ».
  final rares = _issuesRares()[arcId] ?? const <String>{};
  final missing = arc.issues.where((i) => !outcomes.containsKey(i) && !rares.contains(i)).toList();
  final missingRare = arc.issues.where((i) => !outcomes.containsKey(i) && rares.contains(i)).toList();
  _line(arc.issues.isEmpty || missing.isEmpty, 'issues atteintes (sur $n tirages)',
      arc.issues.isEmpty
          ? 'l\'intrigue ne déclare pas d\'issues'
          : '${arc.issues.map((i) => '$i ${_f(100 * (outcomes[i] ?? 0) / math.max(1, withOpening), 0)} %${rares.contains(i) ? ' (rare)' : ''}').join(' · ')}'
              '${missing.isEmpty ? '' : ' · jamais atteinte(s) : ${missing.join(', ')}'}'
              '${missingRare.isEmpty ? '' : ' · hors échantillon, déclarée(s) rare(s) : ${missingRare.join(', ')}'}',
      'toutes, hors issues_rares');
  for (final e in outcomes.entries.where((e) => !arc.issues.contains(e.key))) {
    stdout.writeln('    ⚠ issue hors `issues` : ${e.key} (${e.value})');
  }
  // Clôtures et expirations.
  final status = <String, int>{};
  final reasons = <String, int>{};
  for (final r in recs) {
    final st = r.arcStatus[arcId];
    if (st == null) continue;
    status[st] = (status[st] ?? 0) + 1;
    final why = r.arcReason[arcId];
    if (st == 'abandonne' && why != null) reasons[why] = (reasons[why] ?? 0) + 1;
  }
  final done = status['done'] ?? 0;
  final abandon = status['abandonne'] ?? 0;
  _line(withOpening == 0 || done / math.max(1, withOpening) >= 0.50, 'clôtures',
      'done ${_f(100 * done / math.max(1, withOpening), 0)} % · abandonnée ${_f(100 * abandon / math.max(1, withOpening), 0)} %'
      ' · encore ouverte ${_f(100 * ((status['active'] ?? 0) + (status['armed'] ?? 0)) / math.max(1, withOpening), 0)} %',
      '≥ 50 % done');
  stdout.writeln('    expirations et abandons : ${reasons.isEmpty ? '—' : (reasons.entries.toList()..sort((a, b) => b.value.compareTo(a.value))).map((e) => '${e.key} ${e.value}').join(' · ')}');
  // Cartes de l'intrigue jamais vues (toutes les variantes de toutes les étapes).
  final cards = <String>[];
  final gardeOf = <String, Object?>{};
  for (final st in arc.steps) {
    for (final v in st.card) {
      if (!cards.contains(v.id)) cards.add(v.id);
      gardeOf.putIfAbsent(v.id, () => v.ifWhen);
    }
  }
  final seen = <String>{};
  for (final r in recs) {
    seen.addAll(r.seen);
  }
  // Une variante gardée par un drapeau de DÉPART d'un autre postulat (par
  // exemple `flag('interim')` pour `en.vieux.retraite_quatrieme`) ne peut pas
  // sortir ici, par construction : la compter parmi les « jamais vues » faisait
  // sortir le rapport en rouge sur un défaut qui n'en est pas un, et usait la
  // vigilance du lecteur. Elle est nommée à part, hors du dénominateur.
  final autresDeparts = <String>{};
  for (final other in content.postulatsByIndex) {
    if (other.id == post.id) continue;
    autresDeparts.addAll(other.flags);
  }
  autresDeparts.removeAll(post.flags);
  final reservees = <String>[];
  final never = <String>[];
  for (final c in cards) {
    if (seen.contains(c)) continue;
    final garde = gardeOf[c];
    final txt = garde == null ? '' : jsonEncode(garde);
    if (autresDeparts.any((f) => txt.contains('"$f"'))) {
      reservees.add(c);
    } else {
      never.add(c);
    }
  }
  final denom = cards.length - reservees.length;
  _line(never.isEmpty, 'cartes de l\'intrigue jamais vues',
      never.isEmpty ? '0/$denom' : '${never.length}/$denom : ${never.join(', ')}', '0');
  if (reservees.isNotEmpty) {
    stdout.writeln('    réservées à un autre postulat (hors dénom.) ${reservees.length} : ${reservees.join(', ')}');
  }
}

/// « id (Nom) » pour les colonnes « locuteur » et « porteur ». Les identifiants
/// sont désynchronisés de leurs noms depuis la reprise par la bible — `aulard`
/// s'appelle Jean-Marie Vaubourg, `meneche` Pierre Massenet, `nassir` Cheikh
/// Ilyas, `legruet` Noé Berthomier, `clow` Dan Corven — et une trace qui ne dit
/// que l'id se lit comme une erreur de casting. On imprime les deux ; renommer
/// les ids toucherait postulats.yaml, characters.yaml, toutes les cartes et les
/// sauvegardes.
String _visage(Content content, String? id) {
  if (id == null || id.isEmpty) return '—';
  final n = content.characters[id]?.name;
  return n == null || n.isEmpty ? id : '$id ($n)';
}

/// Les vingt Codes de Carrière de référence (spec variété §3.9 « G1 »).
///
/// Construction, sans aucun aléa hors graine : les cinq premières graines de
/// la liste de mesure (`seedOfRun`) × les quatre postulats. Les swipes sont
/// ceux que jouerait `human_like`, mais ils sont **figés dans le code** : le
/// rejeu ne dépend plus de la politique, seulement du moteur et du contenu.
List<CareerCode> _goldenCodes(Engine engine, Content content) {
  final out = <CareerCode>[];
  final nPost = content.postulatsByIndex.length;
  for (int p = 0; p < nPost; p++) {
    for (int i = 0; i < 5; i++) {
      final seed = seedOfRun(i);
      var s = engine.start(seed, postulat: p);
      final swipes = <bool>[];
      int step = 0;
      // Plafond : 400 swipes. Aucune carrière `human_like` n'y arrive (max
      // mesuré 502 beats, dont les écrans sans choix), et un code plafonné
      // reste un golden valide — il fige un début de carrière.
      while (!s.over && swipes.length < 400) {
        final right = _humanLike(s, step++);
        swipes.add(right);
        s = engine.choose(s, right);
      }
      out.add(CareerCode(
        contentVersion: content.version,
        seed: seed,
        postulat: p,
        swipes: swipes,
      ));
    }
  }
  return out;
}

/// `--goldens` : rejoue les vingt codes et les compare à
/// `content/tests/goldens.yaml` ; `--goldens --write` réécrit le fichier.
void _goldens(Engine engine, Content content, {required bool write, bool recode = false}) {
  final file = File('${_contentDir()}/tests/goldens.yaml');
  // Les codes déjà figés sont rejoués tels quels : c'est ce qui rend le
  // golden lisible. Le contenu change, le code ne bouge pas, et le diff dit
  // « cette carrière-là ne raconte plus la même chose ». `--recode` (ou un
  // fichier absent) retire de nouveaux codes de la politique `human_like` —
  // à ne faire que quand les swipes eux-mêmes n'ont plus de sens (un bump de
  // `meta.version` qui change le nombre de cartes d'une saison).
  final existing = file.existsSync() ? parseGoldens(file.readAsStringSync()) : const <GoldenEntry>[];
  final codes = (recode || existing.isEmpty)
      ? _goldenCodes(engine, content)
      : [for (final e in existing) CareerCode.decode(e.code)].whereType<CareerCode>().toList();
  final runs = codes.map((c) => replayCode(engine, c)).toList();
  if (write) {
    file.parent.createSync(recursive: true);
    file.writeAsStringSync(renderGoldens(runs, contentHash: content.hash, contentVersion: content.version));
    stdout.writeln('${runs.length} goldens écrits dans ${file.path} (contenu ${content.hash}).');
    for (final r in runs) {
      stdout.writeln('  postulat ${r.postulat} · ${r.swipes} swipes · ${r.digest}');
    }
    return;
  }
  if (!file.existsSync()) {
    stderr.writeln('${file.path} manquant : lance `--goldens --write`.');
    exit(1);
  }
  final text = file.readAsStringSync();
  final expected = parseGoldens(text);
  final declared = goldensContentHash(text);
  stdout.writeln('── Goldens · ${expected.length} codes · contenu figé $declared · contenu courant ${content.hash} ──');
  int bad = 0;
  if (expected.length != runs.length) {
    stderr.writeln('  ${expected.length} goldens dans le fichier pour ${runs.length} codes attendus.');
    bad += 1;
  }
  for (int i = 0; i < runs.length && i < expected.length; i++) {
    final got = runs[i];
    final want = expected[i];
    if (got.code != want.code) {
      stderr.writeln('  ✗ #$i le code a changé\n      figé : ${want.code}\n      lu   : ${got.code}');
      bad += 1;
      continue;
    }
    if (got.digest != want.digest) {
      stderr.writeln('  ✗ #$i (postulat ${got.postulat})\n      figé : ${want.digest}\n      lu   : ${got.digest}');
      bad += 1;
    }
  }
  if (bad == 0) {
    stdout.writeln('  ✔ les ${runs.length} codes racontent la même carrière qu\'au moment où ils ont été figés.');
    return;
  }
  stderr.writeln('$bad golden(s) déplacé(s). Si le changement est voulu :');
  stderr.writeln('  dart run packages/tools/bin/simulate.dart --goldens --write');
  exit(1);
}

void main(List<String> args) {
  final content = _loadContent();
  final engine = Engine(content);
  int runs = 5000;
  bool assertBudgets = false;
  bool narrative = false;
  bool reservoir = false;
  bool uneCheck = false;
  bool goldens = false;
  bool goldensWrite = false;
  bool goldensRecode = false;
  int? postulat;
  int? traceSeed;
  int? diffA, diffB;
  String? arcId;
  int maxSeasons = 99;
  for (int i = 0; i < args.length; i++) {
    if (args[i] == '--runs' && i + 1 < args.length) runs = int.parse(args[i + 1]);
    if (args[i] == '--assert') assertBudgets = true;
    if (args[i] == '--narrative') narrative = true;
    if (args[i] == '--reservoir') reservoir = true;
    if (args[i] == '--une-check') uneCheck = true;
    if (args[i] == '--goldens') goldens = true;
    if (args[i] == '--write') goldensWrite = true;
    if (args[i] == '--recode') goldensRecode = true;
    if (args[i] == '--postulat' && i + 1 < args.length) postulat = int.parse(args[i + 1]);
    if (args[i] == '--trace' && i + 1 < args.length) traceSeed = int.parse(args[i + 1]);
    if (args[i] == '--seasons' && i + 1 < args.length) maxSeasons = int.parse(args[i + 1]);
    if (args[i] == '--arc' && i + 1 < args.length) arcId = args[i + 1];
    if (args[i] == '--diff' && i + 2 < args.length) {
      diffA = int.parse(args[i + 1]);
      diffB = int.parse(args[i + 2]);
    }
  }
  final nPost = content.postulatsByIndex.length;

  if (goldens) {
    _goldens(engine, content, write: goldensWrite, recode: goldensRecode);
    return;
  }

  if (traceSeed != null) {
    final p = postulat ?? 0;
    stdout.writeln('── Trace · graine $traceSeed · postulat $p « ${content.postulatsByIndex[p].title} » · human_like ──');
    final r = runOne(engine, traceSeed, p, _humanLike, <String>{}, trace: stdout, maxSeasons: maxSeasons);
    stdout.writeln('fin : ${r.ending} · ${r.seasons} saison(s) · ${r.turns} beats');
    return;
  }

  if (arcId != null) {
    final p = postulat ?? 0;
    final n = runs == 5000 ? 300 : runs;
    final recs = <RunRecord>[];
    for (int i = 0; i < n; i++) {
      final seed = seedOfRun(i);
      final rec = RunRecord(seed);
      runOne(engine, seed, p, _humanLike, <String>{}, rec: rec, maxSeasons: maxSeasons);
      recs.add(rec);
    }
    _reportArc(recs, content, p, arcId);
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
    final extra = _reportDiversity(recs, content, p, maxSeasons);
    _reportNarrative(nar, content, p, assertBudgets, extraFailures: assertBudgets ? extra : const []);
    return;
  }

  if (uneCheck) {
    // « La Une ne ment pas » (spec variété §3.7, §5.3) : sur `--runs` carrières
    // (200 par défaut) de chaque postulat, `payload.tenu` et `payload.rang` de
    // la Une valent le verdict appliqué au swipe du Verdict.
    final n = runs == 5000 ? 200 : runs;
    final posts = postulat == null ? List.generate(nPost, (i) => i) : [postulat];
    int failed = 0;
    for (final p in posts) {
      int checks = 0, ok = 0, unresolved = 0;
      final samples = <String>[];
      for (int i = 0; i < n; i++) {
        final r = runOne(engine, seedOfRun(i), p, _humanLike, <String>{});
        checks += r.uneChecks;
        ok += r.uneChecksOk;
        unresolved += r.unresolved;
        if (samples.length < 5) samples.addAll(r.uneCheckFailures.take(5 - samples.length));
      }
      final share = checks == 0 ? 1.0 : ok / checks;
      stdout.writeln('── Une-check · postulat $p « ${content.postulatsByIndex[p].title} » · $n runs ──');
      _line(share >= 1.0, 'la Une ne ment pas (tenu et rang == verdict)', '${_f(100 * share, 0)} % ($ok/$checks Bilans)', '100 %');
      _line(unresolved == 0, 'placeholders non résolus', '$unresolved', '0');
      for (final s in samples) {
        stdout.writeln('    ✗ $s');
      }
      if (share < 1.0 || unresolved != 0) failed += 1;
    }
    if (failed > 0) {
      stderr.writeln('$failed postulat(s) dont la Une ment ou laisse un placeholder.');
      exit(1);
    }
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
    // Étape 8 (retune) : « la première saison n'est ni expédiée ni
    // interminable ». Une saison a 17 créneaux de carte ; « interminable » ne
    // peut donc venir que de l'empilement des carrières longues (p95, max).
    // « Expédiée » se mesure au contraire : part des carrières qui meurent
    // avant le Bilan de leur première saison.
    int s0Closed = 0;
    final saisonsHisto = <int, int>{};
    int roleTransitions = 0;
    int unresolved = 0, rxServed = 0, rxLat1 = 0, rxConsec = 0, rxMissed = 0, uneChecks = 0, uneOk = 0;
    int horsRole = 0, horsStatut = 0, classements = 0, classementsKo = 0;
    final classementSamples = <String>[];
    final fuites = <String>[];
    final samples = <String>[];
    for (int i = 0; i < runs; i++) {
      final seed = seedOfRun(i);
      final r = runOne(engine, seed, postulat ?? seed % nPost, entry.value, seen);
      lengths.add(r.turns);
      endings[r.ending] = (endings[r.ending] ?? 0) + 1;
      seasonSum += r.seasons;
      if (r.seasons >= 1) s0Closed += 1;
      saisonsHisto[r.seasons] = (saisonsHisto[r.seasons] ?? 0) + 1;
      roleTransitions += (r.roles - 1);
      unresolved += r.unresolved;
      rxServed += r.reactions;
      rxLat1 += r.reactionsLat1;
      rxConsec += r.reactionsConsecutive;
      rxMissed += r.reactionsMissed;
      uneChecks += r.uneChecks;
      uneOk += r.uneChecksOk;
      horsRole += r.horsRole;
      classements += r.classements;
      classementsKo += r.classementsIncoherents;
      if (classementSamples.length < 5) classementSamples.addAll(r.classementSamples);
      horsStatut += r.horsStatut;
      if (fuites.length < 5) fuites.addAll(r.fuitesSamples.take(5 - fuites.length));
      if (samples.length < 3) samples.addAll([...r.unresolvedSamples, ...r.uneCheckFailures].take(3 - samples.length));
    }
    lengths.sort();
    int pct(double q) => lengths[(q * (lengths.length - 1)).round()];
    final median = pct(0.5);
    final p95 = pct(0.95);
    final maxLen = lengths.last;
    final avgSeasons = seasonSum / runs;

    stdout.writeln('── Politique "${entry.key}" ($runs runs${postulat != null ? ', postulat $postulat' : ''}) ──');
    final s0Share = s0Closed / runs;
    final histoLine = (saisonsHisto.keys.toList()..sort())
        .take(9)
        .map((k) => '$k:${(100 * saisonsHisto[k]! / runs).toStringAsFixed(0)}%')
        .join(' ');
    stdout.writeln('  durée cartes : médiane $median · p95 $p95 · max $maxLen · saisons moy ${avgSeasons.toStringAsFixed(1)}');
    stdout.writeln('  première saison : close dans ${(100 * s0Share).toStringAsFixed(0)} % des carrières · saisons closes $histoLine');
    stdout.writeln('  transitions de rôle : $roleTransitions');
    final topEndings = endings.entries.toList()..sort((a, b) => b.value.compareTo(a.value));
    final causeLine = topEndings.take(6).map((e) => '${e.key} ${(100 * e.value / runs).toStringAsFixed(0)}%').join(' · ');
    stdout.writeln('  causes de fin : $causeLine');
    final latShare = rxServed == 0 ? 1.0 : rxLat1 / rxServed;
    final uneShare = uneChecks == 0 ? 1.0 : uneOk / uneChecks;
    stdout.writeln('  réactions : ${(rxServed / runs).toStringAsFixed(2)}/run · latence 1 ${(100 * latShare).toStringAsFixed(0)} % · consécutives $rxConsec · perdues $rxMissed'
        ' · la Une ne ment pas ${(100 * uneShare).toStringAsFixed(0)} % ($uneOk/$uneChecks) · placeholders non résolus $unresolved'
        '${samples.isEmpty ? '' : ' : ${samples.join(' ; ')}'}');

    // Budgets checked on the human_like policy ; the step-2 invariants
    // (placeholders, reaction latency, Une) hold for every policy.
    void check(bool ok, String msg) {
      if (!ok) {
        stderr.writeln('  BUDGET VIOLÉ : $msg');
        failures++;
      }
    }

    stdout.writeln('  sélection : cartes servies hors rôle $horsRole · locuteur muet $horsStatut'
        '${fuites.isEmpty ? '' : ' : ${fuites.join(' ; ')}'}');
    stdout.writeln('  classement : $classements tableaux servis · incohérents $classementsKo'
        '${classementSamples.isEmpty ? '' : ' : ${classementSamples.take(3).join(' ; ')}'}');
    if (assertBudgets) {
      check(horsRole == 0, '${entry.key} : $horsRole carte(s) servie(s) hors du rôle courant');
      check(classementsKo == 0, '${entry.key} : $classementsKo classement(s) incohérent(s) avec le moteur');
      check(horsStatut == 0, '${entry.key} : $horsStatut carte(s) servie(s) par un locuteur qui ne parle plus');
      check(unresolved == 0, '${entry.key} : $unresolved placeholder(s) non résolu(s)');
      check(rxConsec == 0, '${entry.key} : $rxConsec réaction(s) consécutive(s)');
      check(latShare >= 1.0, '${entry.key} : latence des réactions ${(100 * latShare).toStringAsFixed(0)} %');
      check(uneShare >= 1.0, '${entry.key} : la Une ment dans ${uneChecks - uneOk} Bilan(s)');
    }
    if (assertBudgets && entry.key == 'human_like') {
      // Étape 8 : les bandes de la commande de retune, resserrées sur celles
      // de l'étape 0 ([20,320], 1500, 55 %). Elles valent globalement ET par
      // postulat : `--postulat p --assert` mesure la même chose sur le seul
      // postulat p, c'est la forme qui tourne en CI (4 exécutions).
      check(median >= 60 && median <= 200, 'médiane hors [60,200] : $median');
      check(p95 <= 600, 'p95 trop haut : $p95 > 600');
      check(maxLen <= 1500, 'run trop long : $maxLen > 1500');
      // « La première saison n'est pas expédiée » : plus d'une carrière sur
      // deux doit atteindre son premier Bilan (la Une, le Verdict, le
      // carrefour — tout ce que l'étape 2 a écrit vit là).
      check(s0Share >= 0.55, 'première saison expédiée : close dans ${(100 * s0Share).toStringAsFixed(0)} % des carrières < 55 %');
      final maxCause = topEndings.isEmpty ? 0.0 : topEndings.first.value / runs;
      check(maxCause <= 0.40, 'une cause de mort dépasse 40 % (§5.3) : ${topEndings.first.key} ${(100 * maxCause).toStringAsFixed(0)} %');
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
