/// The complete, serializable run state. "Same seed + same choices" reproduces
/// it exactly (docs/brainstorm section 9). Kept as a mutable object cloned by
/// the reducer, so `apply` stays pure from the caller's point of view.
library;

import 'effects.dart';

class Entities {
  /// Prénom et nom du protagoniste (spec variété §1.8) ; `protagonist` reste
  /// « prénom nom ». Le nom est cosmétique : aucune carte servie n'en dépend.
  String prenom;
  String nom;
  String genre; // 'f' or 'm'
  Map<String, String> named; // club, clubShort, rival, president, capitaine, ville, coach, …

  Entities({String? protagonist, String? prenom, String? nom, required this.genre, required this.named})
      : prenom = prenom ?? _splitName(protagonist ?? '').first,
        nom = nom ?? _splitName(protagonist ?? '').last;

  String get protagonist => nom.isEmpty ? prenom : '$prenom $nom';

  static List<String> _splitName(String full) {
    final t = full.trim();
    final i = t.indexOf(' ');
    if (i < 0) return [t, ''];
    return [t.substring(0, i), t.substring(i + 1)];
  }

  Entities clone() => Entities(prenom: prenom, nom: nom, genre: genre, named: Map.of(named));

  Map<String, dynamic> toJson() => {'protagonist': protagonist, 'prenom': prenom, 'nom': nom, 'genre': genre, 'named': named};
  factory Entities.fromJson(Map<String, dynamic> j) => Entities(
        protagonist: j['protagonist'] as String?,
        prenom: j['prenom'] as String?,
        nom: j['nom'] as String?,
        genre: j['genre'] as String,
        named: (j['named'] as Map).cast<String, String>(),
      );
}

/// Une entrée de l'Almanach (spec variété §1.7) : datée, pondérée, taguée. Le
/// texte est formaté à l'écriture (le nom, le club, le rang de l'instant).
class JournalEntry {
  final int season;
  final int year;
  final int slot;
  final String kind; // carte | trace | arc | palier | bilan | une | objectif | transition | fin
  final String text;
  final int poids;
  final List<String> tags;
  final String? arc; // arc source (ou id de la manchette pour `une`)
  const JournalEntry({
    required this.season,
    required this.year,
    required this.slot,
    required this.kind,
    required this.text,
    this.poids = 1,
    this.tags = const [],
    this.arc,
  });

  Map<String, dynamic> toJson() => {
        'season': season,
        'year': year,
        'slot': slot,
        'kind': kind,
        'text': text,
        'poids': poids,
        if (tags.isNotEmpty) 'tags': tags,
        if (arc != null) 'arc': arc,
      };

  factory JournalEntry.fromJson(Map<String, dynamic> j) => JournalEntry(
        season: (j['season'] as num?)?.toInt() ?? 0,
        year: (j['year'] as num?)?.toInt() ?? 0,
        slot: (j['slot'] as num?)?.toInt() ?? 0,
        kind: j['kind'] as String? ?? 'carte',
        text: j['text'] as String? ?? '',
        poids: (j['poids'] as num?)?.toInt() ?? 1,
        tags: (j['tags'] as List?)?.cast<String>() ?? const [],
        arc: j['arc'] as String?,
      );
}

/// L'état d'un personnage (spec variété §1.10) : son âge (+1 à chaque
/// ouverture de saison) et son statut (`kStatuts`). Posé au départ depuis
/// `characters.yaml`, changé par l'effet `char:` d'un choix.
class CharState {
  int age;
  String statut;
  CharState({this.age = 0, this.statut = 'present'});

  CharState clone() => CharState(age: age, statut: statut);

  Map<String, dynamic> toJson() => {'age': age, 'statut': statut};

  factory CharState.fromJson(Map<String, dynamic> j) => CharState(
        age: (j['age'] as num?)?.toInt() ?? 0,
        statut: j['statut'] as String? ?? 'present',
      );
}

/// La réaction en attente (spec variété §1.4) : servie au tirage suivant, hors
/// créneau ; `arc`/`step` sont ceux de la carte déclencheuse.
class ReactionRef {
  final String card;
  final String? arc;
  final String? step;
  final String phase;
  const ReactionRef({required this.card, this.arc, this.step, this.phase = ''});

  Map<String, dynamic> toJson() => {
        'card': card,
        if (arc != null) 'arc': arc,
        if (step != null) 'step': step,
        'phase': phase,
      };

  factory ReactionRef.fromJson(Map<String, dynamic> j) => ReactionRef(
        card: j['card'] as String,
        arc: j['arc'] as String?,
        step: j['step'] as String?,
        phase: j['phase'] as String? ?? '',
      );
}

/// La « carte fatale » de la saison : le dernier temps d'histoire non-Nouvelle
/// servi et la réponse choisie (photo et légende de la Une, spec variété §1.6).
class LastStoryCard {
  final String id;
  final String? answer;
  const LastStoryCard(this.id, this.answer);
  Map<String, dynamic> toJson() => {'id': id, if (answer != null) 'answer': answer};
  factory LastStoryCard.fromJson(Map<String, dynamic> j) => LastStoryCard(j['id'] as String, j['answer'] as String?);
}

class WorldState {
  int division; // 1 or 2
  int pts;
  int blocks; // blocks/matches played this season
  int serieDefaites;
  int serieVictoires;
  int cupRound;
  int standingRank;
  int rangFinal; // rank at the last Verdict (0 before the first)
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
    this.rangFinal = 0,
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
        rangFinal: rangFinal,
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
        'rangFinal': rangFinal,
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
        rangFinal: (j['rangFinal'] as num?)?.toInt() ?? 0,
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

/// A queued narrative card. `dueN` is when it becomes eligible and `deadlineN`
/// when the director must serve it (both counted in narrative cards).
class Scheduled {
  String card;
  String kind; // script | etape | evenement | alarme | palier | chaine | passe
  String? arc;
  String? step;
  int dueN;
  int deadlineN;
  int seq;
  int clubSeq;
  int? expireSeason;
  String fallback; // drop | nouvelles
  Object? cancelIf;
  bool sameClub;
  int reports;
  Map<String, dynamic> payload;
  /// Fusée longue (spec variété §1.3) : tant que `atSeason` est posé, l'entrée
  /// attend l'ouverture de cette saison (`dueN == -1`), puis reçoit sa fenêtre
  /// absolue `atSlot`.
  int? atSeason;
  List<int>? atSlot;

  Scheduled({
    required this.card,
    required this.kind,
    this.arc,
    this.step,
    required this.dueN,
    required this.deadlineN,
    this.seq = 0,
    this.clubSeq = 0,
    this.expireSeason,
    this.fallback = 'drop',
    this.cancelIf,
    this.sameClub = true,
    this.reports = 0,
    Map<String, dynamic>? payload,
    this.atSeason,
    this.atSlot,
  }) : payload = payload ?? {};

  bool get isLongFuse => atSeason != null;

  Scheduled clone() => Scheduled(
        card: card,
        kind: kind,
        arc: arc,
        step: step,
        dueN: dueN,
        deadlineN: deadlineN,
        seq: seq,
        clubSeq: clubSeq,
        expireSeason: expireSeason,
        fallback: fallback,
        cancelIf: cancelIf,
        sameClub: sameClub,
        reports: reports,
        payload: Map.of(payload),
        atSeason: atSeason,
        atSlot: atSlot == null ? null : List.of(atSlot!),
      );

  Map<String, dynamic> toJson() => {
        'card': card,
        'kind': kind,
        if (arc != null) 'arc': arc,
        if (step != null) 'step': step,
        'dueN': dueN,
        'deadlineN': deadlineN,
        'seq': seq,
        'clubSeq': clubSeq,
        if (expireSeason != null) 'expireSeason': expireSeason,
        'fallback': fallback,
        if (cancelIf != null) 'cancelIf': cancelIf,
        'sameClub': sameClub,
        if (reports != 0) 'reports': reports,
        if (payload.isNotEmpty) 'payload': payload,
        if (atSeason != null) 'atSeason': atSeason,
        if (atSlot != null) 'atSlot': atSlot,
      };

  /// Returns null for a v1 entry (`{card, due}`), which is dropped on load.
  static Scheduled? fromJson(Map<String, dynamic> j) {
    if (j['kind'] == null) return null;
    return Scheduled(
      card: j['card'] as String,
      kind: j['kind'] as String,
      arc: j['arc'] as String?,
      step: j['step'] as String?,
      dueN: (j['dueN'] as num).toInt(),
      deadlineN: (j['deadlineN'] as num).toInt(),
      seq: (j['seq'] as num?)?.toInt() ?? 0,
      clubSeq: (j['clubSeq'] as num?)?.toInt() ?? 0,
      expireSeason: (j['expireSeason'] as num?)?.toInt(),
      fallback: j['fallback'] as String? ?? 'drop',
      cancelIf: j['cancelIf'],
      sameClub: j['sameClub'] != false,
      reports: (j['reports'] as num?)?.toInt() ?? 0,
      payload: (j['payload'] as Map?)?.cast<String, dynamic>(),
      atSeason: (j['atSeason'] as num?)?.toInt(),
      atSlot: (j['atSlot'] as List?)?.map((e) => (e as num).toInt()).toList(),
    );
  }
}

/// Progress of one arc in this run.
class ArcState {
  String status; // armed | active | done | abandonne
  String? step; // last step served
  int lastN;
  int startedSeason;
  int? doneSeason;
  String? reason;
  int plays; // clôtures `done` dans la carrière (spec variété §1.3)
  String? outcome; // dernière issue posée

  ArcState({this.status = 'armed', this.step, this.lastN = 0, this.startedSeason = 0, this.doneSeason, this.reason, this.plays = 0, this.outcome});

  ArcState clone() => ArcState(
      status: status, step: step, lastN: lastN, startedSeason: startedSeason, doneSeason: doneSeason, reason: reason, plays: plays, outcome: outcome);

  Map<String, dynamic> toJson() => {
        'status': status,
        if (step != null) 'step': step,
        'lastN': lastN,
        'startedSeason': startedSeason,
        if (doneSeason != null) 'doneSeason': doneSeason,
        if (reason != null) 'reason': reason,
        if (plays != 0) 'plays': plays,
        if (outcome != null) 'outcome': outcome,
      };

  factory ArcState.fromJson(Map<String, dynamic> j) => ArcState(
        status: j['status'] as String? ?? 'armed',
        step: j['step'] as String?,
        lastN: (j['lastN'] as num?)?.toInt() ?? 0,
        startedSeason: (j['startedSeason'] as num?)?.toInt() ?? 0,
        doneSeason: (j['doneSeason'] as num?)?.toInt(),
        reason: j['reason'] as String?,
        plays: (j['plays'] as num?)?.toInt() ?? 0,
        outcome: j['outcome'] as String?,
      );
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
  static const int schemaVersion = 2;

  int contentVersion;
  String contentHash;
  int seed;
  int postulat; // index (CareerCode)
  String postulatId;
  int rngState;

  int turn; // global beat counter (UI)
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
  Map<String, int> cooldowns; // cardId -> ncards when last served
  List<bool> swipes; // true = right
  Map<String, int> stats;
  Set<String> unlocked; // feats/destins unlocked this run

  // Objective / promise (Parole system).
  String objectiveLabel;
  String objectiveTarget; // e.g. 'maintien', 'top5', 'montee', 'titre'
  bool objectivePromised;
  int centeredStreak; // turns with all gauges in [40,60] (piège du centre)

  // Narrative director (all counted in narrative cards, `ncards`).
  int ncards;
  int slot; // 1..17 within the season
  int seasonStartN;
  int seq;
  int clubSeq;
  Map<String, ArcState> arcs;
  Set<String> playedSteps; // 'arc/step' of one-shot script steps already played
  Map<String, int> seenCount;
  Map<String, int> lastSeenChar;
  Map<String, int> speakerSeen;
  List<String> recentSpeakers;
  String? lastSpeaker;
  String? lastTheme;
  String? lastArcId;
  int lastStoryN;
  int storyThisSeason;
  int softStepsThisSeason;
  int eventsThisSeason;
  int alarmsThisSeason;
  int nouvellesThisSeason;
  int tension;
  bool lastWasDrame;
  int drames;
  Map<String, int> toneCounts;
  Set<String> alarmFired;
  Map<String, int> alarmsServed;
  Set<String> enemies;
  // Tirage de saison (spec variété §1.2) : toutes les listes sont à ordre stable.
  List<String> reserve; // ids d'arcs en réserve, triés
  List<String> themesPlayed; // thèmes déjà ouverts dans la carrière, triés
  List<int> openingSlots; // slots d'ouverture d'intrigue tirés cette saison
  Map<String, int> carriersLastSeason; // porteur → saison de la dernière clôture
  // Réactions, journal, Une (spec variété §1.4, §1.6, §1.7).
  List<JournalEntry> journal;
  ReactionRef? reaction;
  int reactionsThisSeason;
  bool lastWasReaction;
  String? lastUne; // id de la manchette servie au dernier Bilan
  LastStoryCard? lastStoryCard;
  /// Âge et statut des personnages (spec variété §1.10) : clés triées à la
  /// sérialisation ; reconstruit au premier `openSeason` si une sauvegarde
  /// ancienne ne le porte pas.
  Map<String, CharState> chars;

  Pending? pending;
  String? endingId;
  String? lastAnswer;
  bool over;

  GameState({
    required this.contentVersion,
    required this.contentHash,
    required this.seed,
    required this.postulat,
    this.postulatId = '',
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
    this.ncards = 0,
    this.slot = 0,
    this.seasonStartN = 0,
    this.seq = 0,
    this.clubSeq = 0,
    Map<String, ArcState>? arcs,
    Set<String>? playedSteps,
    Map<String, int>? seenCount,
    Map<String, int>? lastSeenChar,
    Map<String, int>? speakerSeen,
    List<String>? recentSpeakers,
    this.lastSpeaker,
    this.lastTheme,
    this.lastArcId,
    this.lastStoryN = 0,
    this.storyThisSeason = 0,
    this.softStepsThisSeason = 0,
    this.eventsThisSeason = 0,
    this.alarmsThisSeason = 0,
    this.nouvellesThisSeason = 0,
    this.tension = 0,
    this.lastWasDrame = false,
    this.drames = 0,
    Map<String, int>? toneCounts,
    Set<String>? alarmFired,
    Map<String, int>? alarmsServed,
    Set<String>? enemies,
    List<String>? reserve,
    List<String>? themesPlayed,
    List<int>? openingSlots,
    Map<String, int>? carriersLastSeason,
    List<JournalEntry>? journal,
    this.reaction,
    this.reactionsThisSeason = 0,
    this.lastWasReaction = false,
    this.lastUne,
    this.lastStoryCard,
    Map<String, CharState>? chars,
    required this.pending,
    required this.endingId,
    required this.lastAnswer,
    required this.over,
  })  : arcs = arcs ?? {},
        playedSteps = playedSteps ?? {},
        seenCount = seenCount ?? {},
        lastSeenChar = lastSeenChar ?? {},
        speakerSeen = speakerSeen ?? {},
        recentSpeakers = recentSpeakers ?? [],
        toneCounts = toneCounts ?? {},
        alarmFired = alarmFired ?? {},
        alarmsServed = alarmsServed ?? {},
        enemies = enemies ?? {},
        reserve = reserve ?? [],
        themesPlayed = themesPlayed ?? [],
        openingSlots = openingSlots ?? [],
        carriersLastSeason = carriersLastSeason ?? {},
        journal = journal ?? [],
        chars = chars ?? {};

  GameState clone() => GameState(
        contentVersion: contentVersion,
        contentHash: contentHash,
        seed: seed,
        postulat: postulat,
        postulatId: postulatId,
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
        scheduled: scheduled.map((s) => s.clone()).toList(),
        cooldowns: Map.of(cooldowns),
        swipes: List.of(swipes),
        stats: Map.of(stats),
        unlocked: Set.of(unlocked),
        objectiveLabel: objectiveLabel,
        objectiveTarget: objectiveTarget,
        objectivePromised: objectivePromised,
        centeredStreak: centeredStreak,
        ncards: ncards,
        slot: slot,
        seasonStartN: seasonStartN,
        seq: seq,
        clubSeq: clubSeq,
        arcs: arcs.map((k, v) => MapEntry(k, v.clone())),
        playedSteps: Set.of(playedSteps),
        seenCount: Map.of(seenCount),
        lastSeenChar: Map.of(lastSeenChar),
        speakerSeen: Map.of(speakerSeen),
        recentSpeakers: List.of(recentSpeakers),
        lastSpeaker: lastSpeaker,
        lastTheme: lastTheme,
        lastArcId: lastArcId,
        lastStoryN: lastStoryN,
        storyThisSeason: storyThisSeason,
        softStepsThisSeason: softStepsThisSeason,
        eventsThisSeason: eventsThisSeason,
        alarmsThisSeason: alarmsThisSeason,
        nouvellesThisSeason: nouvellesThisSeason,
        tension: tension,
        lastWasDrame: lastWasDrame,
        drames: drames,
        toneCounts: Map.of(toneCounts),
        alarmFired: Set.of(alarmFired),
        alarmsServed: Map.of(alarmsServed),
        enemies: Set.of(enemies),
        reserve: List.of(reserve),
        themesPlayed: List.of(themesPlayed),
        openingSlots: List.of(openingSlots),
        carriersLastSeason: Map.of(carriersLastSeason),
        journal: List.of(journal), // entrées immuables : copie superficielle
        reaction: reaction,
        reactionsThisSeason: reactionsThisSeason,
        lastWasReaction: lastWasReaction,
        lastUne: lastUne,
        lastStoryCard: lastStoryCard,
        chars: chars.map((k, v) => MapEntry(k, v.clone())),
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
        'postulatId': postulatId,
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
        'ncards': ncards,
        'slot': slot,
        'seasonStartN': seasonStartN,
        'seq': seq,
        'clubSeq': clubSeq,
        'arcs': arcs.map((k, v) => MapEntry(k, v.toJson())),
        'playedSteps': playedSteps.toList()..sort(),
        'seenCount': seenCount,
        'lastSeenChar': lastSeenChar,
        'speakerSeen': speakerSeen,
        'recentSpeakers': recentSpeakers,
        'lastSpeaker': lastSpeaker,
        'lastTheme': lastTheme,
        'lastArcId': lastArcId,
        'lastStoryN': lastStoryN,
        'storyThisSeason': storyThisSeason,
        'softStepsThisSeason': softStepsThisSeason,
        'eventsThisSeason': eventsThisSeason,
        'alarmsThisSeason': alarmsThisSeason,
        'nouvellesThisSeason': nouvellesThisSeason,
        'tension': tension,
        'lastWasDrame': lastWasDrame,
        'drames': drames,
        'toneCounts': toneCounts,
        'alarmFired': alarmFired.toList()..sort(),
        'alarmsServed': alarmsServed,
        'enemies': enemies.toList()..sort(),
        'reserve': reserve,
        'themesPlayed': themesPlayed,
        'openingSlots': openingSlots,
        'carriersLastSeason': {for (final k in carriersLastSeason.keys.toList()..sort()) k: carriersLastSeason[k]},
        'journal': journal.map((e) => e.toJson()).toList(),
        'reaction': reaction?.toJson(),
        'reactionsThisSeason': reactionsThisSeason,
        'lastWasReaction': lastWasReaction,
        'lastUne': lastUne,
        'lastStoryCard': lastStoryCard?.toJson(),
        'chars': {for (final k in chars.keys.toList()..sort()) k: chars[k]!.toJson()},
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
        postulatId: j['postulatId'] as String? ?? '',
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
        scheduled: (j['scheduled'] as List? ?? const [])
            .map((e) => Scheduled.fromJson((e as Map).cast<String, dynamic>()))
            .whereType<Scheduled>()
            .toList(),
        cooldowns: (j['cooldowns'] as Map).cast<String, int>(),
        swipes: (j['swipes'] as List).cast<bool>(),
        stats: (j['stats'] as Map).cast<String, int>(),
        unlocked: (j['unlocked'] as List).cast<String>().toSet(),
        objectiveLabel: j['objectiveLabel'] as String,
        objectiveTarget: j['objectiveTarget'] as String,
        objectivePromised: j['objectivePromised'] == true,
        centeredStreak: (j['centeredStreak'] as num).toInt(),
        ncards: (j['ncards'] as num?)?.toInt() ?? 0,
        slot: (j['slot'] as num?)?.toInt() ?? 0,
        seasonStartN: (j['seasonStartN'] as num?)?.toInt() ?? 0,
        seq: (j['seq'] as num?)?.toInt() ?? 0,
        clubSeq: (j['clubSeq'] as num?)?.toInt() ?? 0,
        arcs: ((j['arcs'] as Map?) ?? const {}).map((k, v) => MapEntry(k.toString(), ArcState.fromJson((v as Map).cast<String, dynamic>()))),
        playedSteps: (j['playedSteps'] as List?)?.cast<String>().toSet(),
        seenCount: (j['seenCount'] as Map?)?.cast<String, int>(),
        lastSeenChar: (j['lastSeenChar'] as Map?)?.cast<String, int>(),
        speakerSeen: (j['speakerSeen'] as Map?)?.cast<String, int>(),
        recentSpeakers: (j['recentSpeakers'] as List?)?.cast<String>(),
        lastSpeaker: j['lastSpeaker'] as String?,
        lastTheme: j['lastTheme'] as String?,
        lastArcId: j['lastArcId'] as String?,
        lastStoryN: (j['lastStoryN'] as num?)?.toInt() ?? 0,
        storyThisSeason: (j['storyThisSeason'] as num?)?.toInt() ?? 0,
        softStepsThisSeason: (j['softStepsThisSeason'] as num?)?.toInt() ?? 0,
        eventsThisSeason: (j['eventsThisSeason'] as num?)?.toInt() ?? 0,
        alarmsThisSeason: (j['alarmsThisSeason'] as num?)?.toInt() ?? 0,
        nouvellesThisSeason: (j['nouvellesThisSeason'] as num?)?.toInt() ?? 0,
        tension: (j['tension'] as num?)?.toInt() ?? 0,
        lastWasDrame: j['lastWasDrame'] == true,
        drames: (j['drames'] as num?)?.toInt() ?? 0,
        toneCounts: (j['toneCounts'] as Map?)?.cast<String, int>(),
        alarmFired: (j['alarmFired'] as List?)?.cast<String>().toSet(),
        alarmsServed: (j['alarmsServed'] as Map?)?.cast<String, int>(),
        enemies: (j['enemies'] as List?)?.cast<String>().toSet(),
        reserve: (j['reserve'] as List?)?.cast<String>(),
        themesPlayed: (j['themesPlayed'] as List?)?.cast<String>(),
        openingSlots: (j['openingSlots'] as List?)?.map((e) => (e as num).toInt()).toList(),
        carriersLastSeason: (j['carriersLastSeason'] as Map?)?.cast<String, int>(),
        journal: (j['journal'] as List?)?.map((e) => JournalEntry.fromJson((e as Map).cast<String, dynamic>())).toList(),
        reaction: j['reaction'] == null ? null : ReactionRef.fromJson((j['reaction'] as Map).cast<String, dynamic>()),
        reactionsThisSeason: (j['reactionsThisSeason'] as num?)?.toInt() ?? 0,
        lastWasReaction: j['lastWasReaction'] == true,
        lastUne: j['lastUne'] as String?,
        lastStoryCard: j['lastStoryCard'] == null ? null : LastStoryCard.fromJson((j['lastStoryCard'] as Map).cast<String, dynamic>()),
        chars: ((j['chars'] as Map?) ?? const {}).map((k, v) => MapEntry(k.toString(), CharState.fromJson((v as Map).cast<String, dynamic>()))),
        pending: j['pending'] == null ? null : Pending.fromJson((j['pending'] as Map).cast<String, dynamic>()),
        endingId: j['endingId'] as String?,
        lastAnswer: j['lastAnswer'] as String?,
        over: j['over'] == true,
      );

  /// L'état des personnages, compacté pour le `fingerprint` : le nombre de
  /// visages, la somme des âges, et les statuts qui ont bougé (triés).
  String charsDigest() {
    if (chars.isEmpty) return '0';
    final keys = chars.keys.toList()..sort();
    int ages = 0;
    final moved = <String>[];
    for (final k in keys) {
      ages += chars[k]!.age;
      if (chars[k]!.statut != 'present') moved.add('$k=${chars[k]!.statut}');
    }
    return '${keys.length}:$ages:${moved.join('.')}';
  }

  /// A short stable fingerprint of the whole state, used by golden tests to
  /// assert determinism.
  String fingerprint() {
    final arcKeys = arcs.keys.toList()..sort();
    final arcStr = arcKeys.map((k) => '$k:${arcs[k]!.status}:${arcs[k]!.step ?? ''}:${arcs[k]!.plays}:${arcs[k]!.outcome ?? ''}').join(',');
    final sched = List.of(scheduled)
      ..sort((a, b) {
        final c = a.deadlineN.compareTo(b.deadlineN);
        if (c != 0) return c;
        final d = a.dueN.compareTo(b.dueN);
        return d != 0 ? d : a.seq.compareTo(b.seq);
      });
    final schedStr = sched.map((e) => '${e.card}:${e.dueN}:${e.deadlineN}').join(',');
    final b = StringBuffer()
      ..write(turn)
      ..write('|n')
      ..write(ncards)
      ..write('|s')
      ..write(slot)
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
      ..write((flags.toList()..sort()).join(','))
      ..write('|a')
      ..write(arcStr)
      ..write('|q')
      ..write(schedStr)
      ..write('|v')
      ..write(vars['fil_rouge_i'] ?? '')
      ..write('|o')
      ..write(openingSlots.join('.'))
      ..write('|z')
      ..write(reserve.join(','))
      ..write('|j')
      ..write(journal.length)
      ..write('|r')
      ..write(reaction?.card ?? '-')
      ..write('|c')
      ..write(charsDigest());
    return b.toString();
  }
}
