/// The engine: start a run, present a card, apply a choice. Everything flows
/// through a serializable [GameState]; "same seed + same choices" reproduces
/// the run exactly. See docs/brainstorm sections 2 and 9.
library;

import 'condition.dart';
import 'content.dart';
import 'effects.dart';
import 'rng.dart';
import 'state.dart';
import 'text.dart';
import 'world.dart';

class Postulat {
  final String role;
  final String title;
  final int division;
  final Map<String, int> gauges;
  final int force;
  final String? objective; // forced objective, else auto
  final List<String> flags;
  const Postulat(this.role, this.title, this.division, this.gauges, this.force, {this.objective, this.flags = const []});
}

/// The MVP postulats. The app shows three drawn cards; the engine takes an
/// index (0..). Chronology starts in the 1990s.
const List<Postulat> kPostulats = [
  Postulat('entraineur', 'Le promu sans un sou', 1, {'vestiaire': 50, 'tribunes': 80, 'direction': 52, 'caisse': 30}, 46,
      objective: 'maintien'),
  Postulat('entraineur', 'L\'intérimaire', 2, {'vestiaire': 45, 'tribunes': 50, 'direction': 40, 'caisse': 50}, 44,
      flags: ['interim']),
  Postulat('joueur', 'La pépite du club-usine', 2, {'vestiaire': 50, 'tribunes': 80, 'direction': 50, 'caisse': 45}, 58),
  Postulat('joueur', 'Fin de contrat à 31 ans', 1, {'vestiaire': 50, 'tribunes': 50, 'direction': 45, 'caisse': 60}, 52,
      flags: ['genou']),
];

class Engine {
  final Content content;
  Engine(this.content);

  static const int startYear = 1990;

  GameState start(int seed, {int postulat = 0}) {
    final rng = Rng(seed);
    final post = kPostulats[postulat % kPostulats.length];
    final entities = _makeEntities(rng, post.role);
    final s = GameState(
      contentVersion: content.version,
      contentHash: content.hash,
      seed: seed,
      postulat: postulat,
      rngState: rng.state,
      turn: 0,
      season: 0,
      beat: 0,
      age: rng.range(content.roles[post.role]!.startAgeMin, content.roles[post.role]!.startAgeMax),
      year: startYear,
      role: post.role,
      gauges: Map.of(post.gauges),
      force: post.force,
      parole: 0,
      pression: 0,
      vars: {},
      flags: {...post.flags},
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
        _applyEffects(s, choice, rng);
        s.lastAnswer = right ? (p.payload['answerRight'] as String?) : (p.payload['answerLeft'] as String?);
        if (p.kind == 'objective') {
          s.objectivePromised = right;
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
    for (final sc in e.schedule) {
      final due = s.turn + rng.range(sc.inMin, sc.inMax);
      s.scheduled.add(Scheduled(sc.card, due));
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
    // Division movement for next season.
    if (verdict.outcome == 'montee' && s.world.division > 1) {
      s.world.division -= 1;
      s.force = (s.force + 4).clamp(0, 100);
    } else if (verdict.outcome == 'descente' && s.world.division < 2) {
      s.world.division += 1;
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
    final beat = beats[s.beat];
    s.turn += 1;
    switch (beat.kind) {
      case 'card':
        s.pending = _drawNarrative(s, beat.phase, rng);
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

  Pending _drawNarrative(GameState s, String phase, Rng rng) {
    // 1) A scheduled (chained / sablier) card that is due and still eligible.
    s.scheduled.sort((a, b) => a.dueTurn.compareTo(b.dueTurn));
    for (final sc in List.of(s.scheduled)) {
      if (sc.dueTurn > s.turn) continue;
      final card = content.cards[sc.card];
      if (card == null) {
        s.scheduled.remove(sc);
        continue;
      }
      if (evalWhen(card.when, EvalContext(s, phase))) {
        s.scheduled.remove(sc);
        return _cardToPending(s, card, phase, rng);
      }
    }
    // 2) Weighted pick from the eligible pool.
    final pool = <Card>[];
    final weights = <double>[];
    for (final card in content.cardsForRole(s.role)) {
      final last = s.cooldowns[card.id];
      if (last != null) {
        if (card.once) continue;
        if (s.turn - last < card.cooldown) continue;
      }
      if (!evalWhen(card.when, EvalContext(s, phase))) continue;
      double w = card.weight;
      for (final tag in card.tags) {
        if (tag.startsWith('rescue:')) {
          final g = tag.substring(7);
          final v = s.gauges[g] ?? 50;
          if (v < 20 || v > 80) w *= 3;
        }
        if (tag.startsWith('risk:')) {
          final g = tag.substring(5);
          final v = s.gauges[g] ?? 50;
          if (v < 20 || v > 80) w *= 0.5;
        }
        if (tag == 'piege') w *= (s.centeredStreak >= 12) ? 4 : 0.25;
      }
      pool.add(card);
      weights.add(w);
    }
    if (pool.isEmpty) return _filler(s);
    final idx = rng.weightedIndex(weights);
    if (idx < 0) return _filler(s);
    return _cardToPending(s, pool[idx], phase, rng);
  }

  Pending _cardToPending(GameState s, Card card, String phase, Rng rng) {
    s.cooldowns[card.id] = s.turn;
    final speakerGenre = _speakerGenre(card.speaker);
    final text = formatText(card.text, s, speakerGenre: speakerGenre);
    List<GaugeHint> hintsFor(EffectSet e) {
      if (card.previewOverride != null) {
        return card.previewOverride!.map((g) => GaugeHint(g, 2)).toList();
      }
      return e.previewHints();
    }

    return Pending(
      id: card.id,
      kind: 'narrative',
      speaker: card.speaker,
      text: text,
      leftLabel: formatText(card.left.label, s, speakerGenre: speakerGenre),
      rightLabel: formatText(card.right.label, s, speakerGenre: speakerGenre),
      leftEffects: card.left.effects,
      rightEffects: card.right.effects,
      previewLeft: hintsFor(card.left.effects),
      previewRight: hintsFor(card.right.effects),
      payload: {
        if (card.left.answer != null) 'answerLeft': formatText(card.left.answer!, s, speakerGenre: speakerGenre),
        if (card.right.answer != null) 'answerRight': formatText(card.right.answer!, s, speakerGenre: speakerGenre),
        'sablier': card.sablier,
        'tags': card.tags,
      },
    );
  }

  Pending _objectiveCard(GameState s, Rng rng) {
    final target = s.objectiveTarget.isEmpty || s.season > 0 || s.postulat >= 2
        ? pickObjective(s.world.division, s.pression, rng)
        : s.objectiveTarget;
    s.objectiveTarget = target;
    s.objectiveLabel = objectiveLabelFr(target);
    final patron = s.role == 'entraineur' ? 'Jean-Marie Aulard' : 'Ton agent, Fardelli';
    return Pending(
      id: 'objective:${s.season}',
      kind: 'objective',
      speaker: s.role == 'entraineur' ? 'aulard' : 'fardelli',
      text: '$patron : « Cette saison, l\'objectif c\'est ${objectiveLabelFr(target).toLowerCase()}. Tu t\'engages ? »',
      leftLabel: 'Je m\'engage',
      rightLabel: 'Je ne promets rien',
      leftEffects: const EffectSet(gauges: {'direction': 4}),
      rightEffects: const EffectSet(gauges: {'direction': -6}),
      previewLeft: const [GaugeHint('direction', 1)],
      previewRight: const [GaugeHint('direction', 2)],
      payload: {
        'answerLeft': 'Promesse publique : ${objectiveLabelFr(target)}.',
        'answerRight': 'Tu gardes les mains libres.',
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

  Pending _bilanContrat(GameState s) => Pending(
        id: 'bilan:contrat:${s.season}',
        kind: 'bilan_contrat',
        speaker: 'aulard',
        text: 'Le président : « On continue l\'aventure, ou tu tentes autre chose ? »',
        leftLabel: 'Je reste',
        rightLabel: 'Je réclame plus de moyens',
        leftEffects: const EffectSet(gauges: {'direction': 3}),
        rightEffects: const EffectSet(gauges: {'direction': -6, 'caisse': 6}),
        previewLeft: const [GaugeHint('direction', 1)],
        previewRight: const [GaugeHint('direction', 1), GaugeHint('caisse', 1)],
      );

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
        'president': 'Jean-Marie Aulard',
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

  String _speakerGenre(String? speaker) {
    if (speaker == null) return 'm';
    const feminine = {'josiane', 'aubert', 'camille', 'lea'};
    return feminine.contains(speaker) ? 'f' : 'm';
  }
}
