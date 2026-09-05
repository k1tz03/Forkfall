/// The engine: start a run, present a card, apply a choice. Everything flows
/// through a serializable [GameState]; "same seed + same choices" reproduces
/// the run exactly. See docs/brainstorm sections 2 and 9.
library;

import 'condition.dart';
import 'content.dart';
import 'draw/director.dart';
import 'effects.dart';
import 'rng.dart';
import 'state.dart';
import 'text.dart';
import 'world.dart';

class Engine {
  final Content content;
  late final Director director = Director(content, _cardToPending, _filler);
  Engine(this.content);

  /// Default chronology start; each postulat carries its own `year`.
  static const int startYear = 1990;

  GameState start(int seed, {int postulat = 0}) {
    final rng = Rng(seed);
    final posts = content.postulatsByIndex;
    if (posts.isEmpty) throw StateError('Aucun postulat dans le contenu (content/postulats.yaml).');
    final post = posts[postulat % posts.length];
    final role = content.roles[post.role]!;
    final entities = _makeEntities(rng, post.role);
    entities.named['president'] = content.characters[post.president ?? role.patron ?? '']?.name ?? 'Le président';
    final age = rng.range(role.startAgeMin, role.startAgeMax);
    final flags = <String>{...post.flags};
    if (post.camille) {
      const metiers = ['avocate', 'journaliste', 'agente', 'medecin', 'elue'];
      final m = metiers[rng.nextInt(metiers.length)];
      flags.add('camille_$m');
      entities.named['camille_metier'] = m;
    }
    final s = GameState(
      contentVersion: content.version,
      contentHash: content.hash,
      seed: seed,
      postulat: postulat,
      postulatId: post.id,
      rngState: rng.state,
      turn: 0,
      season: 0,
      beat: 0,
      age: age,
      year: post.year,
      role: post.role,
      gauges: Map.of(post.gauges),
      force: post.force,
      parole: 0,
      pression: 0,
      vars: {},
      flags: flags,
      relations: {},
      entities: entities,
      world: WorldState(division: post.division),
      matchTemp: null,
      scheduled: [],
      cooldowns: {},
      swipes: [],
      stats: {'saisons': 0, 'titres': 0, 'roles': 1},
      unlocked: {},
      objectiveLabel: '',
      objectiveTarget: post.objective ?? 'maintien',
      objectivePromised: false,
      centeredStreak: 0,
      pending: null,
      endingId: null,
      lastAnswer: null,
      over: false,
    );
    _draw(s);
    return s;
  }

  /// Apply a choice (true = right / swipe droit) and present the next card.
  GameState choose(GameState prev, bool right) {
    final s = prev.clone();
    final pending = s.pending;
    if (pending == null || s.over) return s;
    final rng = Rng.fromState(s.rngState);

    s.swipes.add(right);
    s.lastAnswer = null;

    _applyPending(s, pending, right, rng);

    s.rngState = rng.state;

    if (!s.over) {
      _checkEndings(s);
    }
    if (s.over) {
      _buildEndingPending(s);
      return s;
    }

    // Advance the calendar and draw the next card.
    _advance(s, pending);
    final rng2 = Rng.fromState(s.rngState);
    _draw(s, rng2);
    s.rngState = rng2.state;
    if (s.over) _buildEndingPending(s);
    return s;
  }

  // ---------------------------------------------------------------------------
  // Applying the current card.
  // ---------------------------------------------------------------------------

  void _applyPending(GameState s, Pending p, bool right, Rng rng) {
    switch (p.kind) {
      case 'narrative':
      case 'objective':
        final choice = right ? p.rightEffects : p.leftEffects;
        final relBefore = Map<String, int>.of(s.relations);
        _applyEffects(s, choice, rng);
        s.lastAnswer = right ? (p.payload['answerRight'] as String?) : (p.payload['answerLeft'] as String?);
        if (p.kind == 'objective') {
          s.objectivePromised = right;
        } else {
          director.afterNarrative(s, p, right);
          director.relationCrossings(s, relBefore, p.payload['phase'] as String? ?? '');
        }
        _passiveDrift(s);
        _updateCentered(s);
        break;
      case 'match':
        _resolveMatch(s, right, rng);
        break;
      case 'cup':
        _resolveCup(s, rng);
        break;
      case 'gm_annonce':
        // No real choice: continue.
        break;
      case 'gm_te':
        _resolveTempsFort(s, right, rng);
        break;
      case 'aftermatch':
        _applyEffects(s, right ? p.rightEffects : p.leftEffects, rng);
        break;
      case 'bilan_une':
        break;
      case 'bilan_verdict':
        _resolveBilan(s, rng);
        break;
      case 'bilan_contrat':
        _applyEffects(s, right ? p.rightEffects : p.leftEffects, rng);
        break;
      case 'bilan_carrefour':
        if (p.payload['transition'] != null && right) {
          _transitionTo(s, p.payload['transition'] as String, rng);
        }
        break;
    }
  }

  void _applyEffects(GameState s, EffectSet e, Rng rng) {
    // Resolve a rand branch first (it may add nested effects).
    if (e.rand.isNotEmpty) {
      final branch = pickRand(e.rand, rng);
      if (branch != null) _applyEffects(s, branch.effects, rng);
    }
    final ampl = (s.pression >= 8) ? 1.25 : 1.0;
    e.gauges.forEach((g, v) {
      final delta = v < 0 ? (v * ampl).round() : v;
      s.gauges[g] = (s.gauges[g]! + delta).clamp(0, 100);
    });
    if (e.force != 0) s.force = (s.force + e.force).clamp(0, 100);
    if (e.parole != 0) s.parole = (s.parole + e.parole).clamp(-5, 5);
    if (e.pression != 0) s.pression = (s.pression + e.pression).clamp(0, 10);
    if (e.age != 0) s.age += e.age;
    e.relations.forEach((k, v) => s.relations[k] = ((s.relations[k] ?? 0) + v).clamp(-3, 3));
    e.vars.forEach((k, op) => s.vars[k] = applyVarOp(s.vars[k] ?? 0, op));
    for (final f in e.setFlags) {
      s.flags.add(f);
    }
    for (final f in e.clearFlags) {
      s.flags.remove(f);
    }
    for (final id in e.cancel) {
      s.scheduled.removeWhere((sc) => sc.card == id);
    }
    for (final op in e.schedule) {
      // Delays are in narrative cards: due at min, hard deadline at max. A
      // step card scheduled this way is an "arc jump": the arc goes straight
      // to that step.
      final target = content.cards[op.card];
      final arcId = target?.arcId;
      director.enqueue(
        s,
        Scheduled(
          card: op.card,
          kind: director.kindOfArc(arcId),
          arc: arcId,
          step: target?.stepId,
          dueN: s.ncards + op.inMin,
          deadlineN: s.ncards + op.inMax,
          fallback: op.fallback,
          cancelIf: op.cancelIf,
          sameClub: op.sameClub,
        ),
      );
    }
    for (final c in e.arcClose) {
      if (c.status == 'done') {
        director.arcDone(s, c.id);
      } else {
        director.arcAbort(s, c.id, 'ferme');
      }
    }
    for (final id in e.enemy) {
      s.relations[id] = -3;
      s.enemies.add(id);
    }
    for (final u in e.unlock) {
      s.unlocked.add(u);
    }
    if (e.role != null) _transitionTo(s, e.role!, rng);
    if (e.end != null) {
      s.endingId = e.end;
      s.over = true;
    }
  }

  void _passiveDrift(GameState s) {
    // The fragile gauge drifts down about once every three narrative cards
    // (faster under high Pression) — enough to punish immobilism, not a death
    // spiral (docs/brainstorm section 2.2).
    final period = s.pression >= 8 ? 2 : 3;
    final c = (s.vars['_drift'] ?? 0) + 1;
    if (c >= period) {
      s.vars['_drift'] = 0;
      final fragile = content.roles[s.role]!.fragileGauge;
      s.gauges[fragile] = (s.gauges[fragile]! - 1).clamp(0, 100);
    } else {
      s.vars['_drift'] = c;
    }
  }

  void _updateCentered(GameState s) {
    final centered = s.gauges.values.every((v) => v >= 40 && v <= 60);
    s.centeredStreak = centered ? s.centeredStreak + 1 : 0;
  }

  // ---------------------------------------------------------------------------
  // Match resolution.
  // ---------------------------------------------------------------------------

  void _resolveMatch(GameState s, bool right, Rng rng) {
    final role = content.roles[s.role]!;
    // Left = first posture (usually Offensif), Right = second (Prudent).
    final offensif = !right;
    final postureMod = offensif ? 0.05 : -0.08;
    final block = resolveBlock(rng, s.force, s.world.division, s.gauges, postureMod: postureMod);
    s.world.pts += block.points;
    s.world.blocks += 1;
    if (block.losses >= 4) {
      s.world.serieDefaites += 1;
      s.world.serieVictoires = 0;
    } else if (block.wins >= 4) {
      s.world.serieVictoires += 1;
      s.world.serieDefaites = 0;
    }
    s.world.lastResults = block.results;
    // Gauge effect centred on "par" (~9 pts for six games): a good block lifts
    // Tribunes and Direction, a bad one dents them, gently.
    final net = ((block.points - 9) / 2).round();
    s.gauges['tribunes'] = (s.gauges['tribunes']! + net).clamp(0, 100);
    s.gauges['direction'] = (s.gauges['direction']! + net).clamp(0, 100);
    if (offensif) {
      s.gauges['vestiaire'] = (s.gauges['vestiaire']! + 2).clamp(0, 100);
    } else {
      s.gauges['tribunes'] = (s.gauges['tribunes']! - 1).clamp(0, 100);
    }
    _updateProvisionalRank(s);
    final posture = offensif ? role.matchPostureLeft : role.matchPostureRight;
    s.lastAnswer = '$posture — ${block.results} · ${block.points} pts';
    _passiveDrift(s);
  }

  void _resolveCup(GameState s, Rng rng) {
    final r = resolveCupTie(rng, s.force, s.gauges);
    if (r.won) {
      s.world.cupRound += 1;
      s.gauges['tribunes'] = (s.gauges['tribunes']! + 6).clamp(0, 100);
      s.lastAnswer = 'Coupe : victoire ${r.scoreline}, tour suivant.';
    } else {
      s.gauges['tribunes'] = (s.gauges['tribunes']! - 3).clamp(0, 100);
      s.lastAnswer = 'Coupe : éliminé ${r.scoreline}.';
    }
  }

  void _resolveTempsFort(GameState s, bool right, Rng rng) {
    final mt = s.matchTemp ??= MatchTemp(oppForce: divisionBaseForce(s.world.division) + rng.range(-6, 6));
    // Left = SÛR (choiceMod -0.15 lower gain), Right = RISQUÉ (+0.15 higher stakes).
    final risky = right;
    final mod = risky ? 0.15 : -0.15;
    final p = pTempsFort(s.force, mt.oppForce, s.gauges, s.parole, choiceMod: mod);
    final success = rng.nextDouble() < p;
    if (success) {
      mt.goalsFor += 1;
      s.gauges['tribunes'] = (s.gauges['tribunes']! + (risky ? 4 : 2)).clamp(0, 100);
      s.lastAnswer = 'Réussi ! ${mt.goalsFor}-${mt.goalsAgainst}';
    } else {
      if (risky) mt.goalsAgainst += 1;
      s.gauges['vestiaire'] = (s.gauges['vestiaire']! - 3).clamp(0, 100);
      s.lastAnswer = 'Manqué. ${mt.goalsFor}-${mt.goalsAgainst}';
    }
    mt.minute += 25;
  }

  void _applyGrandMatchResult(GameState s) {
    final mt = s.matchTemp;
    if (mt == null) return;
    final won = mt.goalsFor > mt.goalsAgainst;
    final draw = mt.goalsFor == mt.goalsAgainst;
    // Effects doubled vs a Carte Match.
    if (won) {
      s.gauges['tribunes'] = (s.gauges['tribunes']! + 8).clamp(0, 100);
      s.gauges['direction'] = (s.gauges['direction']! + 5).clamp(0, 100);
      s.world.serieVictoires += 1;
    } else if (draw) {
      s.gauges['tribunes'] = (s.gauges['tribunes']! + 1).clamp(0, 100);
    } else {
      s.gauges['tribunes'] = (s.gauges['tribunes']! - 8).clamp(0, 100);
      s.gauges['direction'] = (s.gauges['direction']! - 5).clamp(0, 100);
      s.world.serieDefaites += 1;
    }
    s.stats['grandmatch_gagnes'] = (s.stats['grandmatch_gagnes'] ?? 0) + (won ? 1 : 0);
  }

  // ---------------------------------------------------------------------------
  // Bilan.
  // ---------------------------------------------------------------------------

  void _resolveBilan(GameState s, Rng rng) {
    final verdict = seasonVerdict(s.world.division, s.world.pts, s.objectiveTarget);
    verdict.gaugeEffects.forEach((g, v) {
      s.gauges[g] = (s.gauges[g]! + v).clamp(0, 100);
    });
    if (verdict.forceEffect != 0) s.force = (s.force + verdict.forceEffect).clamp(0, 100);
    if (s.objectivePromised) {
      s.parole = (s.parole + (verdict.objectiveMet ? 1 : -2)).clamp(-5, 5);
    }
    // What the next season's script reads.
    s.world.rangFinal = verdict.rank;
    if (verdict.objectiveMet) {
      s.flags.add('bilan_tenu');
      s.flags.remove('bilan_manque');
      s.vars['saisons_tenues'] = (s.vars['saisons_tenues'] ?? 0) + 1;
    } else {
      s.flags.add('bilan_manque');
      s.flags.remove('bilan_tenu');
    }
    // Division movement for next season.
    if (verdict.outcome == 'montee' && s.world.division > 1) {
      s.world.division -= 1;
      s.force = (s.force + 4).clamp(0, 100);
    } else if (verdict.outcome == 'descente' && s.world.division < 2) {
      s.world.division += 1;
      s.flags.add('descente');
    }
    if (verdict.outcome == 'titre') s.stats['titres'] = (s.stats['titres'] ?? 0) + 1;
    s.world.standingRank = verdict.rank;
    s.lastAnswer = 'Bilan : ${verdict.rank}e · ${objectiveLabelFr(s.objectiveTarget)} '
        '${verdict.objectiveMet ? 'tenu' : 'manqué'}.';
  }

  void _updateProvisionalRank(GameState s) {
    // Interpolate current points onto the division table (no live standings).
    final pts = s.world.pts;
    final projected = s.world.blocks == 0 ? 0 : (pts * 6 ~/ s.world.blocks);
    if (s.world.division <= 1) {
      s.world.standingRank = projected >= 82 ? 1 : (projected >= 70 ? 4 : (projected <= 38 ? 18 : (18 - (projected - 38) ~/ 4).clamp(5, 17)));
    } else {
      s.world.standingRank = projected >= 72 ? 1 : (projected >= 64 ? 4 : (projected <= 36 ? 18 : (18 - (projected - 36) ~/ 4).clamp(5, 17)));
    }
  }

  // ---------------------------------------------------------------------------
  // Transitions.
  // ---------------------------------------------------------------------------

  void _transitionTo(GameState s, String newRole, Rng rng) {
    if (!content.roles.containsKey(newRole)) return;
    s.flags.add('role_was_${s.role}');
    final oldTribunes = s.gauges['tribunes']!;
    s.role = newRole;
    s.gauges = {
      'vestiaire': 50,
      'tribunes': (40 + 0.3 * oldTribunes).round().clamp(0, 100),
      'direction': 55,
      'caisse': 50,
    };
    // New club force from the target division.
    s.world = WorldState(division: s.world.division);
    s.force = divisionBaseForce(s.world.division) + rng.range(-6, 6);
    s.stats['roles'] = (s.stats['roles'] ?? 1) + 1;
    s.entities.named['club'] = _makeClub(rng);
    s.entities.named['clubShort'] = s.entities.named['club']!.split(' ').last;
    s.objectiveTarget = 'maintien';
    s.objectivePromised = false;
    // A new club: pending same-club arcs degrade into « Nouvelles du passé »
    // at the next purge; alarms and the tension counter start fresh.
    s.clubSeq += 1;
    s.lastSpeaker = null;
    s.alarmFired.clear();
    s.tension = 0;
  }

  // ---------------------------------------------------------------------------
  // Endings.
  // ---------------------------------------------------------------------------

  void _checkEndings(GameState s) {
    if (s.over) return;
    if (s.parole <= -5) {
      s.endingId = 'grand_deballage';
      s.over = true;
      return;
    }
    final role = content.roles[s.role]!;
    for (final g in role.gauges) {
      final v = s.gauges[g.id] ?? 50;
      if (v <= 0) {
        s.endingId = g.emptyEnding;
        s.over = true;
        return;
      }
      if (v >= 100) {
        s.endingId = g.fullEnding;
        s.over = true;
        return;
      }
    }
  }

  void _buildEndingPending(GameState s) {
    final ending = content.endings[s.endingId] ?? content.endings['generique'];
    final title = ending?.title ?? 'Fin de carrière';
    final epitaph = ending == null ? '' : formatText(ending.epitaph, s);
    s.unlocked.add('fin:${s.endingId}');
    s.pending = Pending(
      id: 'ending:${s.endingId}',
      kind: 'ending',
      speaker: null,
      text: '$title\n\n$epitaph',
      leftLabel: 'Successeur',
      rightLabel: 'Successeur',
      leftEffects: const EffectSet(),
      rightEffects: const EffectSet(),
      payload: {
        'ending': s.endingId,
        'gauge': ending?.gauge,
        'side': ending?.side,
        'golden': ending?.golden ?? false,
        'share': ending?.share ?? true,
        'title': title,
      },
      single: true,
    );
  }

  // ---------------------------------------------------------------------------
  // Calendar advancement + draw.
  // ---------------------------------------------------------------------------

  void _advance(GameState s, Pending applied) {
    final beats = content.seasonBeats[s.role]!;
    final kind = s.beat < beats.length ? beats[s.beat].kind : 'bilan_carrefour';
    if (kind == 'bilan_carrefour') {
      // End of season → roll over.
      s.season += 1;
      s.age += 1;
      s.year += 1;
      s.pression = (s.pression + 1 + (s.objectivePromised && s.parole > 0 ? 1 : 0)).clamp(0, 10);
      s.stats['saisons'] = (s.stats['saisons'] ?? 0) + 1;
      s.world.pts = 0;
      s.world.blocks = 0;
      s.matchTemp = null;
      s.beat = 0;
      // Joueur retirement check.
      if (s.role == 'joueur' && s.age >= 38) {
        s.endingId = 'jubile';
        s.over = true;
      }
    } else {
      s.beat += 1;
      if (kind == 'aftermatch') {
        _applyGrandMatchResult(s);
        s.matchTemp = null;
      }
    }
  }

  void _draw(GameState s, [Rng? rngIn]) {
    final rng = rngIn ?? Rng.fromState(s.rngState);
    final beats = content.seasonBeats[s.role]!;
    if (s.beat >= beats.length) s.beat = 0;
    if (s.beat == 0) director.openSeason(s);
    final beat = beats[s.beat];
    s.turn += 1;
    switch (beat.kind) {
      case 'card':
        s.pending = director.drawNarrative(s, beat.phase, rng);
        break;
      case 'objective':
        s.pending = _objectiveCard(s, rng);
        break;
      case 'match':
        s.pending = _matchCard(s, beat.phase);
        break;
      case 'cup':
        s.pending = _cupCard(s);
        break;
      case 'gm_annonce':
        s.matchTemp = MatchTemp(oppForce: divisionBaseForce(s.world.division) + rng.range(-6, 6));
        s.pending = _gmAnnonce(s);
        break;
      case 'gm_te':
        s.pending = _gmTempsFort(s);
        break;
      case 'aftermatch':
        s.pending = _afterMatchCard(s);
        break;
      case 'bilan_une':
        s.pending = _bilanUne(s);
        break;
      case 'bilan_verdict':
        s.pending = _bilanVerdict(s);
        break;
      case 'bilan_contrat':
        s.pending = _bilanContrat(s);
        break;
      case 'bilan_carrefour':
        s.pending = _bilanCarrefour(s, rng);
        break;
      default:
        s.pending = _filler(s);
    }
    if (rngIn == null) s.rngState = rng.state;
  }

  /// Resolve a card into what the UI renders. `extra` comes from the director
  /// (band, kind, arc/step, alarm gauge, epilogue of a « Nouvelles du passé »).
  Pending _cardToPending(GameState s, Card card, String phase, Rng rng, Map<String, dynamic> extra) {
    final ch = card.speaker == null ? null : content.characters[card.speaker];
    final speakerGenre = ch?.genre ?? 'm';
    final text = formatText(card.text, s, speakerGenre: speakerGenre);
    List<GaugeHint> hintsFor(EffectSet e) {
      if (card.previewOverride != null) {
        return card.previewOverride!.map((g) => GaugeHint(g, 2)).toList();
      }
      return e.previewHints();
    }

    final isPasse = card.kind == 'passe';
    final left = isPasse ? epilogueEffects(extra) : card.left.effects;
    final right = isPasse ? epilogueEffects(extra) : card.right.effects;
    final rel = card.speaker == null ? 0 : (s.relations[card.speaker] ?? 0);
    final expression = rel >= 1 ? 'sourire' : (rel <= -1 ? 'noir' : 'neutre');

    return Pending(
      id: card.id,
      kind: 'narrative',
      speaker: card.speaker,
      text: text,
      leftLabel: formatText(card.left.label, s, speakerGenre: speakerGenre),
      rightLabel: formatText(card.right.label, s, speakerGenre: speakerGenre),
      leftEffects: left,
      rightEffects: right,
      previewLeft: hintsFor(left),
      previewRight: hintsFor(right),
      single: card.kind == 'nouvelle' || isPasse,
      payload: {
        if (card.left.answer != null) 'answerLeft': formatText(card.left.answer!, s, speakerGenre: speakerGenre),
        if (card.right.answer != null) 'answerRight': formatText(card.right.answer!, s, speakerGenre: speakerGenre),
        'sablier': card.sablier,
        'tags': card.tags,
        if (ch != null) 'speakerName': ch.name,
        if (ch != null) 'speakerLabel': ch.label,
        if (ch != null && ch.tic.isNotEmpty) 'tic': ch.tic,
        if (ch != null) 'camp': ch.camp,
        'expression': expression,
        'kind': card.kind,
        'tone': card.tone,
        ...extra,
      },
    );
  }

  String _patronOf(GameState s) {
    final post = content.postulats[s.postulatId];
    final role = content.roles[s.role];
    final fromPost = post != null && post.role == s.role ? post.president : null;
    return fromPost ?? role?.patron ?? (s.role == 'entraineur' ? 'aulard' : 'fardelli');
  }

  Pending _objectiveCard(GameState s, Rng rng) {
    final target = s.objectiveTarget.isEmpty || s.season > 0 || s.postulat >= 2
        ? pickObjective(s.world.division, s.pression, rng)
        : s.objectiveTarget;
    s.objectiveTarget = target;
    s.objectiveLabel = objectiveLabelFr(target);
    final patron = _patronOf(s);
    final name = content.characters[patron]?.name ?? (s.role == 'entraineur' ? 'Le président' : 'Ton agent');
    return Pending(
      id: 'objective:${s.season}',
      kind: 'objective',
      speaker: patron,
      text: '$name : « Cette saison, l\'objectif c\'est ${objectiveLabelFr(target).toLowerCase()}. Tu t\'engages ? »',
      leftLabel: 'Je m\'engage',
      rightLabel: 'Je ne promets rien',
      leftEffects: const EffectSet(gauges: {'direction': 4}),
      rightEffects: const EffectSet(gauges: {'direction': -6}),
      previewLeft: const [GaugeHint('direction', 1)],
      previewRight: const [GaugeHint('direction', 2)],
      payload: {
        'answerLeft': 'Promesse publique : ${objectiveLabelFr(target)}.',
        'answerRight': 'Tu gardes les mains libres.',
        if (content.characters[patron] != null) 'speakerName': content.characters[patron]!.name,
        if (content.characters[patron] != null) 'speakerLabel': content.characters[patron]!.label,
      },
    );
  }

  Pending _matchCard(GameState s, String phase) {
    final role = content.roles[s.role]!;
    final oppForce = divisionBaseForce(s.world.division);
    final stars = (oppForce / 20).round().clamp(1, 5);
    return Pending(
      id: 'match:$phase:${s.world.blocks}',
      kind: 'match',
      speaker: null,
      text: 'Bloc de six journées. Adversité : ${'★' * stars}${'☆' * (5 - stars)} · '
          '${s.gauges['vestiaire']! >= 60 ? 'vestiaire serein' : (s.gauges['vestiaire']! <= 35 ? 'vestiaire tendu' : 'vestiaire neutre')}.',
      leftLabel: role.matchPostureLeft,
      rightLabel: role.matchPostureRight,
      leftEffects: const EffectSet(),
      rightEffects: const EffectSet(),
      previewLeft: const [GaugeHint('tribunes', 2), GaugeHint('direction', 2)],
      previewRight: const [GaugeHint('tribunes', 2), GaugeHint('direction', 2)],
    );
  }

  Pending _cupCard(GameState s) => Pending(
        id: 'cup:${s.world.cupRound}',
        kind: 'cup',
        speaker: null,
        text: 'Tour de Coupe. Le tirage t\'offre un adversaire surprise. On y va ?',
        leftLabel: 'On joue le coup',
        rightLabel: 'On joue le coup',
        leftEffects: const EffectSet(),
        rightEffects: const EffectSet(),
        single: true,
      );

  Pending _gmAnnonce(GameState s) => Pending(
        id: 'gm:annonce:${s.season}',
        kind: 'gm_annonce',
        speaker: null,
        text: 'GRAND MATCH. Le stade est plein, tout se joue ici. Coup d\'envoi.',
        leftLabel: 'Coup d\'envoi',
        rightLabel: 'Coup d\'envoi',
        leftEffects: const EffectSet(),
        rightEffects: const EffectSet(),
        single: true,
      );

  Pending _gmTempsFort(GameState s) {
    final mt = s.matchTemp ?? MatchTemp();
    return Pending(
      id: 'gm:te:${mt.minute}',
      kind: 'gm_te',
      speaker: null,
      text: '${mt.minute + 20}e minute · ${mt.goalsFor}-${mt.goalsAgainst}. Un moment décisif se présente.',
      leftLabel: 'Le choix sûr',
      rightLabel: 'Le choix risqué',
      leftEffects: const EffectSet(),
      rightEffects: const EffectSet(),
      previewLeft: const [GaugeHint('tribunes', 1)],
      previewRight: const [GaugeHint('tribunes', 2), GaugeHint('vestiaire', 1)],
    );
  }

  Pending _afterMatchCard(GameState s) {
    final mt = s.matchTemp;
    final won = mt != null && mt.goalsFor > mt.goalsAgainst;
    return Pending(
      id: 'aftermatch:${s.season}',
      kind: 'aftermatch',
      speaker: null,
      text: won ? 'Score final ${mt.goalsFor}-${mt.goalsAgainst}. Le vestiaire exulte.' : 'Le match est terminé. Il faut parler au groupe.',
      leftLabel: 'Féliciter',
      rightLabel: 'Recadrer',
      leftEffects: won ? const EffectSet(gauges: {'vestiaire': 4}) : const EffectSet(gauges: {'vestiaire': 4, 'direction': -3}),
      rightEffects: won ? const EffectSet(gauges: {'vestiaire': -4, 'direction': 4}) : const EffectSet(gauges: {'vestiaire': -6, 'direction': 4}),
      previewLeft: const [GaugeHint('vestiaire', 1)],
      previewRight: const [GaugeHint('vestiaire', 1), GaugeHint('direction', 1)],
    );
  }

  Pending _bilanUne(GameState s) => Pending(
        id: 'bilan:une:${s.season}',
        kind: 'bilan_une',
        speaker: null,
        text: 'LA UNE — Le journal titre sur ta saison au ${s.entities.named['club']}.',
        leftLabel: 'Tourner la page',
        rightLabel: 'Tourner la page',
        leftEffects: const EffectSet(),
        rightEffects: const EffectSet(),
        single: true,
      );

  Pending _bilanVerdict(GameState s) => Pending(
        id: 'bilan:verdict:${s.season}',
        kind: 'bilan_verdict',
        speaker: null,
        text: 'Le verdict de la saison tombe. Objectif : ${objectiveLabelFr(s.objectiveTarget)}.',
        leftLabel: 'Voir le classement',
        rightLabel: 'Voir le classement',
        leftEffects: const EffectSet(),
        rightEffects: const EffectSet(),
        single: true,
      );

  Pending _bilanContrat(GameState s) {
    final patron = _patronOf(s);
    final name = content.characters[patron]?.name ?? 'Le président';
    return Pending(
      id: 'bilan:contrat:${s.season}',
      kind: 'bilan_contrat',
      speaker: patron,
      text: '$name : « On continue l\'aventure, ou tu tentes autre chose ? »',
      leftLabel: 'Je reste',
      rightLabel: 'Je réclame plus de moyens',
      leftEffects: const EffectSet(gauges: {'direction': 3}),
      rightEffects: const EffectSet(gauges: {'direction': -6, 'caisse': 6}),
      previewLeft: const [GaugeHint('direction', 1)],
      previewRight: const [GaugeHint('direction', 1), GaugeHint('caisse', 1)],
      payload: {
        if (content.characters[patron] != null) 'speakerName': content.characters[patron]!.name,
        if (content.characters[patron] != null) 'speakerLabel': content.characters[patron]!.label,
      },
    );
  }

  Pending _bilanCarrefour(GameState s, Rng rng) {
    // Offer a transition if any is eligible and no gauge is under 20.
    final anyLow = s.gauges.values.any((v) => v < 20) && s.parole < 3;
    final role = content.roles[s.role]!;
    if (!anyLow) {
      for (final t in role.transitions) {
        if (evalWhen(t.when, EvalContext(s, 'bilan'))) {
          return Pending(
            id: 'carrefour:${s.season}',
            kind: 'bilan_carrefour',
            speaker: null,
            text: formatText(t.label, s),
            leftLabel: 'Je refuse',
            rightLabel: 'J\'accepte',
            leftEffects: const EffectSet(),
            rightEffects: const EffectSet(),
            payload: {'transition': t.to},
          );
        }
      }
    }
    return Pending(
      id: 'carrefour:none:${s.season}',
      kind: 'bilan_carrefour',
      speaker: null,
      text: 'Une nouvelle saison commence.',
      leftLabel: 'Continuer',
      rightLabel: 'Continuer',
      leftEffects: const EffectSet(),
      rightEffects: const EffectSet(),
      single: true,
    );
  }

  Pending _filler(GameState s) => Pending(
        id: 'filler:${s.turn}',
        kind: 'narrative',
        speaker: 'josiane',
        text: 'Madame Josiane passe une tête : « Rien à signaler aujourd\'hui. Un café ? »',
        leftLabel: 'Volontiers',
        rightLabel: 'Plus tard',
        leftEffects: const EffectSet(),
        rightEffects: const EffectSet(),
        payload: const {'kind': 'filler', 'tone': 'leger'},
      );

  // ---------------------------------------------------------------------------
  // Entities / names.
  // ---------------------------------------------------------------------------

  Entities _makeEntities(Rng rng, String role) {
    final genre = rng.nextDouble() < 0.5 ? 'f' : 'm';
    final proto = _pickName(rng, genre);
    final club = _makeClub(rng);
    final rival = _makeClub(rng);
    return Entities(
      protagonist: proto,
      genre: genre,
      named: {
        'club': club,
        'clubShort': club.split(' ').last,
        'rival': rival,
        'capitaine': _pickName(rng, 'm'),
        'ville': _pickVille(rng),
        'coach': _pickName(rng, 'm'),
      },
    );
  }

  String _pickName(Rng rng, String genre) {
    final firsts = (content.names[genre == 'f' ? 'prenoms_f' : 'prenoms_m'] as List).cast<String>();
    final lasts = (content.names['noms'] as List).cast<String>();
    return '${firsts[rng.nextInt(firsts.length)]} ${lasts[rng.nextInt(lasts.length)]}';
  }

  String _makeClub(Rng rng) {
    final prefixes = (content.names['club_prefixes'] as List).cast<String>();
    final villes = (content.names['villes'] as List).cast<String>();
    return '${prefixes[rng.nextInt(prefixes.length)]} ${villes[rng.nextInt(villes.length)]}';
  }

  String _pickVille(Rng rng) {
    final villes = (content.names['villes'] as List).cast<String>();
    return villes[rng.nextInt(villes.length)];
  }
}
