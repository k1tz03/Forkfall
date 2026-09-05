/// The complete, serializable run state. "Same seed + same choices" reproduces
/// it exactly (docs/brainstorm section 9). Kept as a mutable object cloned by
/// the reducer, so `apply` stays pure from the caller's point of view.
library;

import 'effects.dart';

class Entities {
  String protagonist;
  String genre; // 'f' or 'm'
  Map<String, String> named; // club, clubShort, rival, president, capitaine, ville, coach

  Entities({required this.protagonist, required this.genre, required this.named});

  Entities clone() => Entities(protagonist: protagonist, genre: genre, named: Map.of(named));

  Map<String, dynamic> toJson() => {'protagonist': protagonist, 'genre': genre, 'named': named};
  factory Entities.fromJson(Map<String, dynamic> j) => Entities(
        protagonist: j['protagonist'] as String,
        genre: j['genre'] as String,
        named: (j['named'] as Map).cast<String, String>(),
      );
}

class WorldState {
  int division; // 1 or 2
  int pts;
  int blocks; // blocks/matches played this season
  int serieDefaites;
  int serieVictoires;
  int cupRound;
  int standingRank;
  String lastResults;
  Map<String, int> clubMemory;

  WorldState({
    this.division = 2,
    this.pts = 0,
    this.blocks = 0,
    this.serieDefaites = 0,
    this.serieVictoires = 0,
    this.cupRound = 0,
    this.standingRank = 10,
    this.lastResults = '',
    Map<String, int>? clubMemory,
  }) : clubMemory = clubMemory ?? {};

  WorldState clone() => WorldState(
        division: division,
        pts: pts,
        blocks: blocks,
        serieDefaites: serieDefaites,
        serieVictoires: serieVictoires,
        cupRound: cupRound,
        standingRank: standingRank,
        lastResults: lastResults,
        clubMemory: Map.of(clubMemory),
      );

  Map<String, dynamic> toJson() => {
        'division': division,
        'pts': pts,
        'blocks': blocks,
        'serieDefaites': serieDefaites,
        'serieVictoires': serieVictoires,
        'cupRound': cupRound,
        'standingRank': standingRank,
        'lastResults': lastResults,
        'clubMemory': clubMemory,
      };

  factory WorldState.fromJson(Map<String, dynamic> j) => WorldState(
        division: (j['division'] as num).toInt(),
        pts: (j['pts'] as num).toInt(),
        blocks: (j['blocks'] as num).toInt(),
        serieDefaites: (j['serieDefaites'] as num).toInt(),
        serieVictoires: (j['serieVictoires'] as num).toInt(),
        cupRound: (j['cupRound'] as num).toInt(),
        standingRank: (j['standingRank'] as num).toInt(),
        lastResults: j['lastResults'] as String? ?? '',
        clubMemory: (j['clubMemory'] as Map?)?.cast<String, int>() ?? {},
      );
}

/// The matchday sub-sequence state for a live Grand Match.
class MatchTemp {
  int oppForce;
  int goalsFor;
  int goalsAgainst;
  int minute;
  MatchTemp({this.oppForce = 50, this.goalsFor = 0, this.goalsAgainst = 0, this.minute = 0});
  MatchTemp clone() => MatchTemp(oppForce: oppForce, goalsFor: goalsFor, goalsAgainst: goalsAgainst, minute: minute);
  Map<String, dynamic> toJson() => {'oppForce': oppForce, 'gf': goalsFor, 'ga': goalsAgainst, 'minute': minute};
  factory MatchTemp.fromJson(Map<String, dynamic> j) => MatchTemp(
        oppForce: (j['oppForce'] as num).toInt(),
        goalsFor: (j['gf'] as num).toInt(),
        goalsAgainst: (j['ga'] as num).toInt(),
        minute: (j['minute'] as num).toInt(),
      );
}

class Scheduled {
  final String card;
  final int dueTurn;
  const Scheduled(this.card, this.dueTurn);
  Map<String, dynamic> toJson() => {'card': card, 'due': dueTurn};
  factory Scheduled.fromJson(Map<String, dynamic> j) => Scheduled(j['card'] as String, (j['due'] as num).toInt());
}

/// The card currently presented to the player, already fully resolved
/// (final text, labels, effects, preview) so the UI just renders it and
/// `apply` just executes it.
class Pending {
  final String id;
  final String kind;
  final String? speaker;
  final String text;
  final String leftLabel;
  final String rightLabel;
  final EffectSet leftEffects;
  final EffectSet rightEffects;
  final List<GaugeHint> previewLeft;
  final List<GaugeHint> previewRight;
  final Map<String, dynamic> payload;
  final bool single; // true if it is really a single "OK" (both sides identical)

  const Pending({
    required this.id,
    required this.kind,
    required this.speaker,
    required this.text,
    required this.leftLabel,
    required this.rightLabel,
    required this.leftEffects,
    required this.rightEffects,
    this.previewLeft = const [],
    this.previewRight = const [],
    this.payload = const {},
    this.single = false,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'kind': kind,
        if (speaker != null) 'speaker': speaker,
        'text': text,
        'leftLabel': leftLabel,
        'rightLabel': rightLabel,
        'leftEffects': leftEffects.toJson(),
        'rightEffects': rightEffects.toJson(),
        'previewLeft': previewLeft.map((h) => h.toJson()).toList(),
        'previewRight': previewRight.map((h) => h.toJson()).toList(),
        'payload': payload,
        'single': single,
      };

  factory Pending.fromJson(Map<String, dynamic> j) => Pending(
        id: j['id'] as String,
        kind: j['kind'] as String,
        speaker: j['speaker'] as String?,
        text: j['text'] as String,
        leftLabel: j['leftLabel'] as String,
        rightLabel: j['rightLabel'] as String,
        leftEffects: EffectSet.fromJson((j['leftEffects'] as Map).cast<String, dynamic>()),
        rightEffects: EffectSet.fromJson((j['rightEffects'] as Map).cast<String, dynamic>()),
        previewLeft: (j['previewLeft'] as List?)?.map((e) => GaugeHint((e as Map)['g'] as String, (e)['m'] as int)).toList() ?? const [],
        previewRight: (j['previewRight'] as List?)?.map((e) => GaugeHint((e as Map)['g'] as String, (e)['m'] as int)).toList() ?? const [],
        payload: (j['payload'] as Map?)?.cast<String, dynamic>() ?? const {},
        single: j['single'] == true,
      );
}

class GameState {
  static const int schemaVersion = 1;

  int contentVersion;
  String contentHash;
  int seed;
  int postulat;
  int rngState;

  int turn; // global card counter
  int season; // 0-based
  int beat; // index into the role's season beat list
  int age;
  int year;

  String role;
  Map<String, int> gauges; // vestiaire/tribunes/direction/caisse (0..100)
  int force; // hidden team/personal strength
  int parole; // -5..5
  int pression; // 0..10

  Map<String, int> vars;
  Set<String> flags;
  Map<String, int> relations;

  Entities entities;
  WorldState world;
  MatchTemp? matchTemp;

  List<Scheduled> scheduled;
  Map<String, int> cooldowns; // cardId -> last seen turn
  List<bool> swipes; // true = right
  Map<String, int> stats;
  Set<String> unlocked; // feats/destins unlocked this run

  // Objective / promise (Parole system).
  String objectiveLabel;
  String objectiveTarget; // e.g. 'maintien', 'top5', 'montee', 'titre'
  bool objectivePromised;
  int centeredStreak; // turns with all gauges in [40,60] (piège du centre)

  Pending? pending;
  String? endingId;
  String? lastAnswer;
  bool over;

  GameState({
    required this.contentVersion,
    required this.contentHash,
    required this.seed,
    required this.postulat,
    required this.rngState,
    required this.turn,
    required this.season,
    required this.beat,
    required this.age,
    required this.year,
    required this.role,
    required this.gauges,
    required this.force,
    required this.parole,
    required this.pression,
    required this.vars,
    required this.flags,
    required this.relations,
    required this.entities,
    required this.world,
    required this.matchTemp,
    required this.scheduled,
    required this.cooldowns,
    required this.swipes,
    required this.stats,
    required this.unlocked,
    required this.objectiveLabel,
    required this.objectiveTarget,
    required this.objectivePromised,
    required this.centeredStreak,
    required this.pending,
    required this.endingId,
    required this.lastAnswer,
    required this.over,
  });

  GameState clone() => GameState(
        contentVersion: contentVersion,
        contentHash: contentHash,
        seed: seed,
        postulat: postulat,
        rngState: rngState,
        turn: turn,
        season: season,
        beat: beat,
        age: age,
        year: year,
        role: role,
        gauges: Map.of(gauges),
        force: force,
        parole: parole,
        pression: pression,
        vars: Map.of(vars),
        flags: Set.of(flags),
        relations: Map.of(relations),
        entities: entities.clone(),
        world: world.clone(),
        matchTemp: matchTemp?.clone(),
        scheduled: List.of(scheduled),
        cooldowns: Map.of(cooldowns),
        swipes: List.of(swipes),
        stats: Map.of(stats),
        unlocked: Set.of(unlocked),
        objectiveLabel: objectiveLabel,
        objectiveTarget: objectiveTarget,
        objectivePromised: objectivePromised,
        centeredStreak: centeredStreak,
        pending: pending,
        endingId: endingId,
        lastAnswer: lastAnswer,
        over: over,
      );

  Map<String, dynamic> toJson() => {
        'schema': schemaVersion,
        'contentVersion': contentVersion,
        'contentHash': contentHash,
        'seed': seed,
        'postulat': postulat,
        'rngState': rngState,
        'turn': turn,
        'season': season,
        'beat': beat,
        'age': age,
        'year': year,
        'role': role,
        'gauges': gauges,
        'force': force,
        'parole': parole,
        'pression': pression,
        'vars': vars,
        'flags': flags.toList()..sort(),
        'relations': relations,
        'entities': entities.toJson(),
        'world': world.toJson(),
        'matchTemp': matchTemp?.toJson(),
        'scheduled': scheduled.map((s) => s.toJson()).toList(),
        'cooldowns': cooldowns,
        'swipes': swipes,
        'stats': stats,
        'unlocked': unlocked.toList()..sort(),
        'objectiveLabel': objectiveLabel,
        'objectiveTarget': objectiveTarget,
        'objectivePromised': objectivePromised,
        'centeredStreak': centeredStreak,
        'pending': pending?.toJson(),
        'endingId': endingId,
        'lastAnswer': lastAnswer,
        'over': over,
      };

  factory GameState.fromJson(Map<String, dynamic> j) => GameState(
        contentVersion: (j['contentVersion'] as num).toInt(),
        contentHash: j['contentHash'] as String,
        seed: (j['seed'] as num).toInt(),
        postulat: (j['postulat'] as num).toInt(),
        rngState: (j['rngState'] as num).toInt(),
        turn: (j['turn'] as num).toInt(),
        season: (j['season'] as num).toInt(),
        beat: (j['beat'] as num).toInt(),
        age: (j['age'] as num).toInt(),
        year: (j['year'] as num).toInt(),
        role: j['role'] as String,
        gauges: (j['gauges'] as Map).cast<String, int>(),
        force: (j['force'] as num).toInt(),
        parole: (j['parole'] as num).toInt(),
        pression: (j['pression'] as num).toInt(),
        vars: (j['vars'] as Map).cast<String, int>(),
        flags: (j['flags'] as List).cast<String>().toSet(),
        relations: (j['relations'] as Map).cast<String, int>(),
        entities: Entities.fromJson((j['entities'] as Map).cast<String, dynamic>()),
        world: WorldState.fromJson((j['world'] as Map).cast<String, dynamic>()),
        matchTemp: j['matchTemp'] == null ? null : MatchTemp.fromJson((j['matchTemp'] as Map).cast<String, dynamic>()),
        scheduled: (j['scheduled'] as List).map((e) => Scheduled.fromJson((e as Map).cast<String, dynamic>())).toList(),
        cooldowns: (j['cooldowns'] as Map).cast<String, int>(),
        swipes: (j['swipes'] as List).cast<bool>(),
        stats: (j['stats'] as Map).cast<String, int>(),
        unlocked: (j['unlocked'] as List).cast<String>().toSet(),
        objectiveLabel: j['objectiveLabel'] as String,
        objectiveTarget: j['objectiveTarget'] as String,
        objectivePromised: j['objectivePromised'] == true,
        centeredStreak: (j['centeredStreak'] as num).toInt(),
        pending: j['pending'] == null ? null : Pending.fromJson((j['pending'] as Map).cast<String, dynamic>()),
        endingId: j['endingId'] as String?,
        lastAnswer: j['lastAnswer'] as String?,
        over: j['over'] == true,
      );

  /// A short stable fingerprint of the whole state, used by golden tests to
  /// assert determinism.
  String fingerprint() {
    final b = StringBuffer()
      ..write(turn)
      ..write('|')
      ..write(rngState)
      ..write('|')
      ..write(role)
      ..write('|')
      ..write(gauges['vestiaire'])
      ..write(',')
      ..write(gauges['tribunes'])
      ..write(',')
      ..write(gauges['direction'])
      ..write(',')
      ..write(gauges['caisse'])
      ..write('|f')
      ..write(force)
      ..write('|p')
      ..write(parole)
      ..write('|')
      ..write(endingId ?? '-')
      ..write('|')
      ..write((flags.toList()..sort()).join(','));
    return b.toString();
  }
}
