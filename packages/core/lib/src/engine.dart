/// The engine: start a run, present a card, apply a choice. Everything flows
/// through a serializable [GameState]; "same seed + same choices" reproduces
/// the run exactly. See docs/brainstorm sections 2 and 9.
library;

import 'dart:convert';

import 'condition.dart';
import 'content.dart';
import 'draw/director.dart';
import 'effects.dart';
import 'naming.dart';
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

  /// Démarre une carrière. Le nom et le genre saisis (spec variété §1.8) sont
  /// cosmétiques : les trois tirages de `_makeEntities` (genre, prénom, nom)
  /// sont conservés puis écrasés, donc « même code, même carrière » tient
  /// (test N1). Un nom vide ou sur liste noire est remplacé par le nom tiré.
  GameState start(int seed, {int postulat = 0, String? prenom, String? nom, String? genre}) {
    final rng = Rng(seed);
    final posts = content.postulatsByIndex;
    if (posts.isEmpty) throw StateError('Aucun postulat dans le contenu (content/postulats.yaml).');
    final post = posts[postulat % posts.length];
    final role = content.roles[post.role]!;
    final entities = _makeEntities(rng, post.role);
    entities.named['president'] = content.characters[post.president ?? role.patron ?? '']?.name ?? 'Le président';
    // Le tirage est TOUJOURS consommé (déterminisme : même code, même carrière),
    // puis écrasé par le postulat quand il fixe un âge — comme le nom saisi en
    // §1.8. La pépite a dix-neuf ans (bible ch. 10 § 3) ; le rôle joueur, lui,
    // tire 19-31 pour les postulats qui ne disent rien.
    final ageTire = rng.range(role.startAgeMin, role.startAgeMax);
    final age = post.age ?? ageTire;
    final flags = <String>{...post.flags};
    if (post.camille) {
      const metiers = ['avocate', 'journaliste', 'agente', 'medecin', 'elue'];
      final m = metiers[rng.nextInt(metiers.length)];
      flags.add('camille_$m');
      entities.named['camille_metier'] = m;
    }
    // Dossard du joueur : un nouvel appel, après tous les tirages existants (spec §2.5).
    if (post.role == 'joueur') entities.named['numero'] = '${rng.nextInt(30) + 1}';
    if (genre == 'f' || genre == 'm') entities.genre = genre!;
    final p = normalizeName(prenom ?? '', max: 14);
    final n = normalizeName(nom ?? '', max: 16);
    if (p.isNotEmpty && !isBlacklisted(p, content.blacklist)) entities.prenom = p;
    if (n.isNotEmpty && !isBlacklisted(n, content.blacklist)) entities.nom = n;
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
    // Âge et statut des personnages (spec variété §1.10) : posés depuis
    // characters.yaml, sans aucun tirage.
    director.initChars(s);
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
        final kind = p.payload['kind'] as String? ?? '';
        final isReaction = kind == 'reaction';
        _applyEffects(s, choice, rng, arcId: p.payload['arc'] as String?, stepId: p.payload['step'] as String?, phase: p.payload['phase'] as String? ?? '');
        s.lastAnswer = right ? (p.payload['answerRight'] as String?) : (p.payload['answerLeft'] as String?);
        // La carte fatale de la saison : dernier temps d'histoire non-Nouvelle (spec variété §1.6).
        if (kStoryKinds.contains(kind)) s.lastStoryCard = LastStoryCard(p.id, s.lastAnswer);
        if (p.kind == 'objective') {
          s.objectivePromised = !right; // « Je m'engage » est le swipe gauche.
        } else if (!isReaction) {
          // Une réaction n'est l'étape d'aucun arc (son `arc`/`step` sont ceux
          // de la carte déclencheuse) : elle ne fait pas avancer la file.
          director.afterNarrative(s, p, right);
        }
        if (p.kind != 'objective') director.relationCrossings(s, relBefore, p.payload['phase'] as String? ?? '');
        if (!isReaction) _passiveDrift(s); // une réplique hors créneau ne coûte pas de dérive
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
        _resolveBilan(s);
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

  void _applyEffects(GameState s, EffectSet e, Rng rng, {String? arcId, String? stepId, String phase = ''}) {
    // Resolve a rand branch first (it may add nested effects).
    if (e.rand.isNotEmpty) {
      final branch = pickRand(e.rand, rng);
      if (branch != null) _applyEffects(s, branch.effects, rng, arcId: arcId, stepId: stepId, phase: phase);
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
      final fresh = s.flags.add(f);
      // Une trace posée écrit sa ligne d'Almanach (spec variété §1.3, §1.7) :
      // celle de l'arc courant d'abord, sinon la première déclaration (arcs triés).
      if (!fresh) continue;
      final owner = (arcId != null && (content.arcs[arcId]?.traces.containsKey(f) ?? false)) ? arcId : content.tracesIndex[f];
      final arc = owner == null ? null : content.arcs[owner];
      final line = arc?.traces[f];
      if (arc != null && line != null) {
        director.addJournal(s, line, kind: 'trace', poids: 2, tags: [if (arc.themeId.isNotEmpty) arc.themeId, arc.id, f], arc: arc.id);
      }
    }
    for (final f in e.clearFlags) {
      s.flags.remove(f);
    }
    if (e.journal != null) {
      director.addJournal(s, e.journal!.text, kind: 'carte', poids: e.journal!.poids, tags: e.journal!.tags, arc: arcId);
    }
    // L'issue de l'arc courant (spec variété §1.3) ; `arc_outcome()` la lit.
    if (e.outcome != null && arcId != null) {
      (s.arcs[arcId] ??= ArcState(status: 'active', startedSeason: s.season)).outcome = e.outcome;
    }
    // L'état des personnages (spec variété §1.10) : statut, âge posé (« 17 »)
    // ou déplacé (« +1 »). Un personnage sans entrée en reçoit une.
    e.char.forEach((id, op) {
      final st = s.chars[id] ??= CharState(age: content.characters[id]?.age ?? 0, statut: content.characters[id]?.statut ?? 'present');
      if (op.statut != null) st.statut = op.statut!;
      final a = op.age;
      if (a != null) st.age = a.startsWith('+') || a.startsWith('-') ? applyVarOp(st.age, a) : (int.tryParse(a) ?? st.age);
    });
    // La réaction (spec variété §1.4, règle 1) : la première variante dont le
    // `if` est vrai ; `chance` consomme 1 nextDouble seulement si déclarée,
    // après `rand`, avant `schedule`. La dernière posée écrase la précédente.
    if (e.react.isNotEmpty) {
      final c = EvalContext(s, phase, slotsTotal: content.cardSlots(s.role), cast: content.postulats[s.postulatId]?.cast.keys.toSet() ?? const {});
      for (final v in e.react) {
        if (v.ifWhen != null && !evalWhen(v.ifWhen, c)) continue;
        if (v.chance == null || rng.nextDouble() < v.chance!) {
          s.reaction = ReactionRef(card: v.card, arc: arcId, step: stepId, phase: phase);
        }
        break;
      }
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
    // Changement de club sans changement de rôle (spec variété §1.11, §1.13).
    // Il est DIFFÉRÉ au Carrefour : la vente tombe au créneau 17, mais la Une,
    // le verdict et l'Almanach de la saison qu'on vient de jouer doivent encore
    // nommer le club où elle a été jouée (et le classement de cette saison-là).
    // Le club change à l'ouverture de la saison suivante ; la réaction posée
    // par la même carte (« l'aller simple ») survit donc au départ.
    if (e.club != null && e.club!.change) {
      // Le jour où l'on signe, tout le monde te regarde autrement : les jauges
      // sont recalées tout de suite (c'est le coût du départ, il ne se reporte
      // pas). Le reste — le nom du club, la ville, la division, la ligne
      // d'Almanach — attend le Carrefour.
      _leaveClub(s);
      s.vars['_club_pending'] = 1;
      s.vars['_club_div'] = e.club!.division ?? 0;
      s.vars['_club_retour'] = e.club!.retour ? 1 : 0;
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

  void _resolveBilan(GameState s) {
    final verdict = seasonVerdict(s.world.division, s.world.pts, s.objectiveTarget);
    final extra = {'rang': '${verdict.rank}', 'objectif': objectiveLabelFr(s.objectiveTarget)};
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
    // L'Almanach (spec variété §1.7) : le Bilan, puis la montée / descente / le
    // titre. Chaque ligne porte sa clé en tag (`journal_has('descente')`, et la
    // vérification « la Une ne ment pas » de simulate / du test U2).
    final tenuKey = verdict.objectiveMet ? 'bilan_tenu' : 'bilan_manque';
    director.addJournalAuto(s, tenuKey, kind: 'bilan', poids: 3, tags: ['bilan', tenuKey], extra: extra);
    // Division movement for next season : `montee` n'existe qu'en Division 2,
    // `descente` qu'en Division 1 (seasonVerdict), donc les gardes ne servent
    // qu'à protéger un contenu de test.
    if (verdict.promoted && s.world.division > 1) {
      s.world.division -= 1;
      s.force = (s.force + 4).clamp(0, 100);
      director.addJournalAuto(s, 'montee', kind: 'bilan', poids: 3, tags: ['bilan', 'montee'], extra: extra);
    } else if (verdict.relegated && s.world.division < 2) {
      s.world.division += 1;
      s.flags.add('descente');
      director.addJournalAuto(s, 'descente', kind: 'bilan', poids: 3, tags: ['bilan', 'descente'], extra: extra);
    }
    if (verdict.outcome == 'titre') {
      s.stats['titres'] = (s.stats['titres'] ?? 0) + 1;
      s.vars['titre_saison'] = s.season;
      director.addJournalAuto(s, 'titre', kind: 'bilan', poids: 4, tags: ['bilan', 'titre'], extra: extra);
    }
    s.world.standingRank = verdict.rank;
    s.lastAnswer = 'Bilan : ${verdict.rank}e · objectif « ${objectiveLabelFr(s.objectiveTarget)} » '
        '${verdict.objectiveMet ? 'tenu' : 'manqué'}.';
    _checkObjectifs(s, 'bilan');
  }

  /// Objectifs cachés du postulat (spec variété §1.9) : évalués sans Rng au
  /// Bilan et à la fin ; atteint ⇒ `unlocked` reçoit `objectif:<id>`.
  void _checkObjectifs(GameState s, String phase) {
    final post = content.postulats[s.postulatId];
    if (post == null || post.objectifs.isEmpty) return;
    final c = EvalContext(s, phase, slotsTotal: content.cardSlots(s.role), cast: post.cast.keys.toSet());
    for (final o in post.objectifs) {
      final key = 'objectif:${o.id}';
      if (s.unlocked.contains(key)) continue;
      if (o.when != null && !evalWhen(o.when, c)) continue;
      s.unlocked.add(key);
      director.addJournalAuto(s, 'objectif', kind: 'objectif', poids: 3, tags: ['objectif', o.id], extra: {'objectif_titre': o.titre});
    }
  }

  /// Les objectifs du postulat pour l'écran de fin : atteints et indices.
  List<Map<String, dynamic>> _objectifsPayload(GameState s) {
    final post = content.postulats[s.postulatId];
    if (post == null) return const [];
    return [
      for (final o in post.objectifs)
        {
          'id': o.id,
          'titre': o.titre,
          'indice': o.indice,
          'atteint': s.unlocked.contains('objectif:${o.id}'),
        },
    ];
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
    s.reaction = null; // une réplique de l'ancien club ne suit pas (spec variété §1.4, règle 4)
    // Les entrées de file dont la carte ne joue pas le nouveau rôle tombent
    // (raison `role`, sur le modèle de la purge `statut`, spec variété §1.10) :
    // sans ça, l'adjoint continue de proposer le diplôme à quelqu'un qui
    // entraîne déjà la réserve.
    director.purgeRole(s);
    director.addJournalAuto(s, 'transition', kind: 'transition', poids: 3, tags: ['transition', newRole]);
    director.retrouvailles(s);
  }

  /// Changement de club **sans changement de rôle** (spec variété §1.11) :
  /// l'effet `club: {change: true, division: n}`. Nouveau club et nouvelle
  /// ville, `clubSeq += 1` (les arcs `same_club` en file dégradent en
  /// « Nouvelles du passé » au prochain purge), jauges recalées comme à une
  /// transition (la caisse suit le joueur, pas le club), alarmes réarmées,
  /// réaction jetée, ligne d'Almanach et retrouvailles programmées.
  /// Coût Rng, dans cet ordre : 1 `range(-6, 6)` (la force du nouvel effectif),
  /// 2 `nextInt` (le club), 1 `nextInt` (la ville). `retour: true` ne tire rien
  /// de tout ça après la force : il rend le club d'origine (celui de la
  /// première saison), mémorisé au premier départ.
  /// Le coût immédiat du départ (spec variété §1.11) : les jauges se recalent
  /// au moment où l'on signe, pas trois cartes plus tard. La caisse suit le
  /// joueur ; les alarmes et la tension repartent de zéro.
  void _leaveClub(GameState s) {
    final oldTribunes = s.gauges['tribunes'] ?? 50;
    final caisse = s.gauges['caisse'] ?? 50;
    s.gauges = {
      'vestiaire': 50,
      'tribunes': (40 + 0.3 * oldTribunes).round().clamp(0, 100),
      'direction': 55,
      'caisse': caisse,
    };
    s.alarmFired.clear();
    s.tension = 0;
  }

  void _changeClub(GameState s, Rng rng, {int? division, bool retour = false, bool gauges = true}) {
    if (gauges) _leaveClub(s);
    s.world = WorldState(division: (division ?? s.world.division).clamp(1, 2));
    s.force = divisionBaseForce(s.world.division) + rng.range(-6, 6);
    // Le club d'origine est mémorisé au premier départ : c'est lui que `retour`
    // rend, et lui seul (l'usine reprend ce qu'elle a vendu).
    s.entities.named.putIfAbsent('clubOrigine', () => s.entities.named['club'] ?? '');
    s.entities.named.putIfAbsent('villeOrigine', () => s.entities.named['ville'] ?? '');
    final origine = retour ? s.entities.named['clubOrigine'] : null;
    if (origine != null && origine.isNotEmpty) {
      s.entities.named['club'] = origine;
      s.entities.named['clubShort'] = origine.split(' ').last;
      final v = s.entities.named['villeOrigine'];
      if (v != null && v.isNotEmpty) s.entities.named['ville'] = v;
    } else {
      s.entities.named['club'] = _makeClub(rng);
      s.entities.named['clubShort'] = s.entities.named['club']!.split(' ').last;
      s.entities.named['ville'] = _pickVille(rng);
    }
    s.objectiveTarget = 'maintien';
    s.objectivePromised = false;
    s.clubSeq += 1;
    s.lastSpeaker = null;
    s.alarmFired.clear();
    s.tension = 0;
    s.reaction = null;
    s.stats['clubs'] = (s.stats['clubs'] ?? 1) + 1;
    director.addJournalAuto(s, 'club_change', kind: 'transition', poids: 3, tags: ['transition', 'club']);
    director.retrouvailles(s);
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

  /// L'écran de fin et « Ce qui s'est passé » (spec variété §1.7, §1.13) :
  /// épitaphe formatée, `epitaph_plus` (première variante vraie), les 6 lignes
  /// les plus lourdes de l'Almanach, les objectifs, les histoires, les Unes.
  void _buildEndingPending(GameState s) {
    final ending = content.endings[s.endingId] ?? content.endings['generique'];
    final title = ending?.title ?? 'Fin de carrière';
    final epitaph = ending == null ? '' : formatText(ending.epitaph, s);
    _checkObjectifs(s, 'fin');
    s.unlocked.add('fin:${s.endingId}');
    final c = EvalContext(s, 'fin', slotsTotal: content.cardSlots(s.role), cast: content.postulats[s.postulatId]?.cast.keys.toSet() ?? const {});
    String plus = '';
    for (final v in ending?.epitaphPlus ?? const <TextVariant>[]) {
      if (v.when == null || evalWhen(v.when, c)) {
        plus = formatText(v.text, s);
        break;
      }
    }
    if (s.journal.isEmpty || s.journal.last.kind != 'fin') {
      director.addJournalAuto(s, 'fin', kind: 'fin', poids: 5, tags: ['fin', s.endingId ?? ''], extra: {'fin_titre': title});
    }
    final ranked = List.of(s.journal)
      ..sort((a, b) {
        final c1 = b.poids.compareTo(a.poids);
        if (c1 != 0) return c1;
        final c2 = b.season.compareTo(a.season);
        return c2 != 0 ? c2 : a.slot.compareTo(b.slot);
      });
    // Rendues dans l'ordre chronologique, la fin en dernier.
    final six = ranked.take(6).toList()
      ..sort((a, b) {
        if ((a.kind == 'fin') != (b.kind == 'fin')) return a.kind == 'fin' ? 1 : -1;
        return a.season != b.season ? a.season.compareTo(b.season) : a.slot.compareTo(b.slot);
      });
    final histoires = <String>[];
    final debloquees = <String>[];
    for (final a in content.arcsSorted) {
      if (a.kind != 'serie') continue;
      final st = s.arcs[a.id];
      if (st != null) {
        final stepIdx = st.step == null ? -1 : a.steps.indexWhere((x) => x.id == st.step);
        if (st.status == 'done' || stepIdx >= 1) histoires.add(a.title ?? a.id);
      } else if (s.reserve.contains(a.id)) {
        debloquees.add(a.title ?? a.id);
      }
    }
    s.pending = Pending(
      id: 'ending:${s.endingId}',
      kind: 'ending',
      speaker: null,
      text: '$title\n\n$epitaph${plus.isEmpty ? '' : ' $plus'}',
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
        'epitaph': epitaph,
        'epitaph_plus': plus,
        'objectifs': _objectifsPayload(s),
        'journal': six.map((e) => e.toJson()).toList(),
        'histoires': histoires,
        'debloquees': debloquees,
        'unes': [for (final e in s.journal) if (e.kind == 'une' && e.arc != null) e.arc!],
        'nom': s.entities.protagonist,
      },
      single: true,
    );
  }

  // ---------------------------------------------------------------------------
  // Calendar advancement + draw.
  // ---------------------------------------------------------------------------

  void _advance(GameState s, Pending applied) {
    // Une réaction est hors créneau : le beat ne bouge pas (spec variété §1.4, règle 3).
    if (applied.payload['kind'] == 'reaction') {
      s.lastWasReaction = true;
      return;
    }
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
      // Retirement checks: the player's legs, the coach's licence.
      if (s.role == 'joueur' && s.age >= 38) {
        s.endingId = 'jubile';
        s.over = true;
      } else if (s.role == 'entraineur' && s.age >= 65) {
        s.endingId = 'en_retraite';
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
    // La réaction en attente passe avant le beat courant, y compris avant
    // l'ouverture de saison (spec variété §1.4, règles 2 et 5) ; zéro aléa.
    final rx = s.reaction;
    if (rx != null) {
      s.reaction = null;
      final p = director.serveReaction(s, rx, rng);
      if (p != null) {
        s.turn += 1;
        s.pending = p;
        if (rngIn == null) s.rngState = rng.state;
        return;
      }
    }
    s.lastWasReaction = false;
    if (s.beat == 0) {
      // Le changement de club différé (voir `_applyEffects`) tombe ici, entre
      // le Carrefour et l'ouverture : la saison close a gardé son club.
      if ((s.vars['_club_pending'] ?? 0) == 1) {
        final div = s.vars['_club_div'] ?? 0;
        final retour = (s.vars['_club_retour'] ?? 0) == 1;
        s.vars.remove('_club_pending');
        s.vars.remove('_club_div');
        s.vars.remove('_club_retour');
        _changeClub(s, rng, division: div == 0 ? null : div, retour: retour, gauges: false);
      }
      director.openSeason(s, rng);
    }
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
        s.pending = _bilanUne(s, rng);
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
    final rel = card.speaker == null ? 0 : (s.relations[card.speaker] ?? 0);
    final expression = rel >= 1 ? 'sourire' : (rel <= -1 ? 'noir' : 'neutre');
    // `{toi}` : l'adresse du locuteur selon le rôle et la relation (spec variété §1.8).
    final adresse = ch?.adresseFor(s.role, expression);
    String fmt(String t) => formatText(t, s, speakerGenre: speakerGenre, speakerId: card.speaker, adresse: adresse);
    final text = fmt(card.text);
    List<GaugeHint> hintsFor(EffectSet e) {
      if (card.previewOverride != null) {
        return card.previewOverride!.map((g) => GaugeHint(g, 2)).toList();
      }
      return e.previewHints();
    }

    final isPasse = card.kind == 'passe';
    final left = isPasse ? epilogueEffects(extra) : card.left.effects;
    final right = isPasse ? epilogueEffects(extra) : card.right.effects;

    return Pending(
      id: card.id,
      kind: 'narrative',
      speaker: card.speaker,
      text: text,
      leftLabel: fmt(card.left.label),
      rightLabel: fmt(card.right.label),
      leftEffects: left,
      rightEffects: right,
      previewLeft: hintsFor(left),
      previewRight: hintsFor(right),
      single: card.kind == 'nouvelle' || isPasse || _sameChoice(card),
      payload: {
        if (card.left.answer != null) 'answerLeft': fmt(card.left.answer!),
        if (card.right.answer != null) 'answerRight': fmt(card.right.answer!),
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

  /// A card whose two sides are the same (label, answer, effects) is a card
  /// without a choice: the drama, the fax, the banner. One button, no swipe.
  bool _sameChoice(Card card) =>
      card.left.label == card.right.label &&
      card.left.answer == card.right.answer &&
      jsonEncode(card.left.effects.toJson()) == jsonEncode(card.right.effects.toJson());

  String _patronOf(GameState s) {
    final post = content.postulats[s.postulatId];
    final role = content.roles[s.role];
    // `patron` d'abord : le champ `president` du postulat ne nomme que le
    // président (`{president}`). Chez un joueur, c'est l'agent qui tient le
    // contrat, pas le président.
    final fromPost = post != null && post.role == s.role ? (post.patron ?? post.president) : null;
    return fromPost ?? role?.patron ?? (s.role == 'entraineur' ? 'aulard' : 'fardelli');
  }

  /// Formate un gabarit moteur avec son locuteur : genre pour `{pg, select}`,
  /// adresse pour `{toi}` (spec variété §1.8).
  String _fmtFor(GameState s, String tpl, {String? speaker, Map<String, String> extra = const {}}) {
    final ch = speaker == null ? null : content.characters[speaker];
    final rel = speaker == null ? 0 : (s.relations[speaker] ?? 0);
    final expression = rel >= 1 ? 'sourire' : (rel <= -1 ? 'noir' : 'neutre');
    return formatText(tpl, s,
        speakerGenre: ch?.genre ?? 'm', speakerId: speaker, adresse: ch?.adresseFor(s.role, expression), extra: extra);
  }

  /// La variante de set-piece servie (spec variété §1.12, §2.7) : la première
  /// dont le rôle et le `when` sont vrais ; la dernière, sans `when` ni
  /// `roles`, est le secours (le texte historique en Dart). **Zéro Rng** : le
  /// choix est un parcours de liste, la carte servie ne dépend d'aucun tirage.
  /// `bilan.*` n'est fourni qu'au beat `bilan_verdict` (le verdict y est
  /// calculé sans être appliqué, comme pour la Une).
  _Setpiece? _setpiece(GameState s, String beat, String phase,
      {bool? bilanTenu, int? bilanRang, String? bilanOutcome, bool Function(SetpieceVariant)? keep}) {
    final variants = content.setpieces[beat];
    if (variants == null || variants.isEmpty) return null;
    final post = content.postulats[s.postulatId];
    final c = EvalContext(s, phase,
        slotsTotal: content.cardSlots(s.role),
        cast: post?.cast.keys.toSet() ?? const {},
        bilanTenu: bilanTenu,
        bilanRang: bilanRang,
        bilanOutcome: bilanOutcome);
    for (int i = 0; i < variants.length; i++) {
      final v = variants[i];
      if (keep != null && !keep(v)) continue;
      if (v.roles.isNotEmpty && !v.roles.contains(s.role)) continue;
      if (!evalWhen(v.when, c)) continue;
      return _Setpiece(v, i, beat);
    }
    return null;
  }

  /// Le texte du beat : celui de la variante, sinon le secours en dur.
  String _spText(GameState s, _Setpiece? sp, String fallback, {String? speaker, Map<String, String> extra = const {}}) =>
      _fmtFor(s, sp?.v.text.isNotEmpty == true ? sp!.v.text : fallback, speaker: speaker, extra: extra);

  /// Ce que la vignette et `simulate` lisent d'un set-piece servi.
  Map<String, dynamic> _spPayload(String beat, _Setpiece? sp) => {
        'setpiece': beat,
        'setpiece_variante': sp?.index ?? -1,
        'setpiece_secours': sp == null || sp.secours,
      };

  Pending _objectiveCard(GameState s, Rng rng) {
    final target = s.objectiveTarget.isEmpty || s.season > 0 || s.postulat >= 2
        ? pickObjective(s.world.division, s.pression, rng)
        : s.objectiveTarget;
    s.objectiveTarget = target;
    s.objectiveLabel = objectiveLabelFr(target);
    final patronId = _patronOf(s);
    final name = content.characters[patronId]?.name ?? (s.role == 'entraineur' ? 'Le président' : 'Ton agent');
    final sp = _setpiece(s, 'objective', 'presaison');
    final speaker = sp?.v.speaker ?? patronId;
    final ch = content.characters[speaker];
    final extra = {
      'patron': name,
      'objectif_min': objectiveLabelWithArticleFr(target),
      'objectif': objectiveLabelFr(target),
    };
    String f(String t) => _fmtFor(s, t, speaker: speaker, extra: extra);
    return Pending(
      id: 'objective:${s.season}',
      kind: 'objective',
      speaker: speaker,
      text: _spText(s, sp, '{patron} : « Cette saison, l\'objectif c\'est {objectif_min}. Tu t\'engages ? »',
          speaker: speaker, extra: extra),
      leftLabel: f(sp?.v.left ?? 'Je m\'engage'),
      rightLabel: f(sp?.v.right ?? 'Je ne promets rien'),
      leftEffects: const EffectSet(gauges: {'direction': 4}),
      rightEffects: const EffectSet(gauges: {'direction': -6}),
      previewLeft: const [GaugeHint('direction', 1)],
      previewRight: const [GaugeHint('direction', 2)],
      payload: {
        'answerLeft': f(sp?.v.answerLeft ?? 'Promesse publique : {objectif}.'),
        'answerRight': f(sp?.v.answerRight ?? 'Tu gardes les mains libres.'),
        if (ch != null) 'speakerName': ch.name,
        if (ch != null) 'speakerLabel': ch.label,
        ..._spPayload('objective', sp),
      },
    );
  }

  Pending _matchCard(GameState s, String phase) {
    final role = content.roles[s.role]!;
    final oppForce = divisionBaseForce(s.world.division);
    final stars = (oppForce / 20).round().clamp(1, 5);
    final extra = {
      'adversite': '${'★' * stars}${'☆' * (5 - stars)}',
      'vestiaire_mot': s.gauges['vestiaire']! >= 60 ? 'vestiaire serein' : (s.gauges['vestiaire']! <= 35 ? 'vestiaire tendu' : 'vestiaire neutre'),
    };
    final sp = _setpiece(s, 'match', phase);
    String f(String t) => _fmtFor(s, t, speaker: sp?.v.speaker, extra: extra);
    return Pending(
      id: 'match:$phase:${s.world.blocks}',
      kind: 'match',
      speaker: sp?.v.speaker,
      text: _spText(s, sp, 'Bloc de six journées. Adversité : {adversite} · {vestiaire_mot}.', speaker: sp?.v.speaker, extra: extra),
      leftLabel: f(sp?.v.left ?? role.matchPostureLeft),
      rightLabel: f(sp?.v.right ?? role.matchPostureRight),
      leftEffects: const EffectSet(),
      rightEffects: const EffectSet(),
      previewLeft: const [GaugeHint('tribunes', 2), GaugeHint('direction', 2)],
      previewRight: const [GaugeHint('tribunes', 2), GaugeHint('direction', 2)],
      payload: _spPayload('match', sp),
    );
  }

  Pending _cupCard(GameState s) {
    final sp = _setpiece(s, 'cup', 'retour');
    final extra = {'tour': '${s.world.cupRound + 1}'};
    String f(String t) => _fmtFor(s, t, speaker: sp?.v.speaker, extra: extra);
    final label = f(sp?.v.left ?? 'On joue le coup');
    return Pending(
      id: 'cup:${s.world.cupRound}',
      kind: 'cup',
      speaker: sp?.v.speaker,
      text: _spText(s, sp, 'Tour de Coupe. Le tirage t\'offre un adversaire surprise. On y va ?', speaker: sp?.v.speaker, extra: extra),
      leftLabel: label,
      rightLabel: label,
      leftEffects: const EffectSet(),
      rightEffects: const EffectSet(),
      single: true,
      payload: _spPayload('cup', sp),
    );
  }

  Pending _gmAnnonce(GameState s) {
    final sp = _setpiece(s, 'gm_annonce', 'sprint');
    final label = _fmtFor(s, sp?.v.left ?? 'Coup d\'envoi', speaker: sp?.v.speaker);
    return Pending(
      id: 'gm:annonce:${s.season}',
      kind: 'gm_annonce',
      speaker: sp?.v.speaker,
      text: _spText(s, sp, 'GRAND MATCH. Le stade est plein, tout se joue ici. Coup d\'envoi.', speaker: sp?.v.speaker),
      leftLabel: label,
      rightLabel: label,
      leftEffects: const EffectSet(),
      rightEffects: const EffectSet(),
      single: true,
      payload: _spPayload('gm_annonce', sp),
    );
  }

  Pending _gmTempsFort(GameState s) {
    final mt = s.matchTemp ?? MatchTemp();
    final extra = {'minute': '${mt.minute + 20}', 'score': '${mt.goalsFor}-${mt.goalsAgainst}'};
    final sp = _setpiece(s, 'gm_te', 'sprint');
    String f(String t) => _fmtFor(s, t, speaker: sp?.v.speaker, extra: extra);
    return Pending(
      id: 'gm:te:${mt.minute}',
      kind: 'gm_te',
      speaker: sp?.v.speaker,
      text: _spText(s, sp, '{minute}e minute · {score}. Un moment décisif se présente.', speaker: sp?.v.speaker, extra: extra),
      leftLabel: f(sp?.v.left ?? 'Le choix sûr'),
      rightLabel: f(sp?.v.right ?? 'Le choix risqué'),
      leftEffects: const EffectSet(),
      rightEffects: const EffectSet(),
      previewLeft: const [GaugeHint('tribunes', 1)],
      previewRight: const [GaugeHint('tribunes', 2), GaugeHint('vestiaire', 1)],
      payload: _spPayload('gm_te', sp),
    );
  }

  Pending _afterMatchCard(GameState s) {
    final mt = s.matchTemp;
    final won = mt != null && mt.goalsFor > mt.goalsAgainst;
    final extra = {'gm_score': mt == null ? '' : '${mt.goalsFor}-${mt.goalsAgainst}', 'score': mt == null ? '' : '${mt.goalsFor}-${mt.goalsAgainst}'};
    // Le résultat du Grand Match, lisible par les variantes (`vars.gm_won`).
    s.vars['gm_won'] = won ? 1 : 0;
    final sp = _setpiece(s, 'aftermatch', 'sprint');
    String f(String t) => _fmtFor(s, t, speaker: sp?.v.speaker, extra: extra);
    return Pending(
      id: 'aftermatch:${s.season}',
      kind: 'aftermatch',
      speaker: sp?.v.speaker,
      text: _spText(s, sp, won ? 'Score final {gm_score}. Le vestiaire exulte.' : 'Le match est terminé. Il faut parler au groupe.',
          speaker: sp?.v.speaker, extra: extra),
      leftLabel: f(sp?.v.left ?? 'Féliciter'),
      rightLabel: f(sp?.v.right ?? 'Recadrer'),
      leftEffects: won ? const EffectSet(gauges: {'vestiaire': 4}) : const EffectSet(gauges: {'vestiaire': 4, 'direction': -3}),
      rightEffects: won ? const EffectSet(gauges: {'vestiaire': -4, 'direction': 4}) : const EffectSet(gauges: {'vestiaire': -6, 'direction': 4}),
      previewLeft: const [GaugeHint('vestiaire', 1)],
      previewRight: const [GaugeHint('vestiaire', 1), GaugeHint('direction', 1)],
      payload: {
        if (sp?.v.answerLeft != null) 'answerLeft': f(sp!.v.answerLeft!),
        if (sp?.v.answerRight != null) 'answerRight': f(sp!.v.answerRight!),
        ..._spPayload('aftermatch', sp),
      },
    );
  }

  /// La Une composée (spec variété §1.6) : le verdict est calculé sans être
  /// appliqué (`bilan.tenu` / `bilan.rang` dans `when`), la manchette gagnante
  /// est la bande de priorité la plus haute puis 1 `weightedIndex` (le seul
  /// aléa du Bilan ; aucun appel quand aucune manchette n'est éligible), les
  /// brèves sont les entrées de journal les plus lourdes hors sujet, la photo
  /// est la carte fatale. La Une entre au journal et peut poser une réaction.
  Pending _bilanUne(GameState s, Rng rng) {
    final verdict = seasonVerdict(s.world.division, s.world.pts, s.objectiveTarget);
    final post = content.postulats[s.postulatId];
    final c = EvalContext(s, 'bilan',
        slotsTotal: content.cardSlots(s.role),
        cast: post?.cast.keys.toSet() ?? const {},
        bilanTenu: verdict.objectiveMet,
        bilanRang: verdict.rank,
        bilanOutcome: verdict.outcome);
    final objectif = objectiveLabelFr(s.objectiveTarget);
    final extra = <String, String>{
      'rang': '${verdict.rank}',
      'objectif': objectif,
      'tenu': verdict.objectiveMet ? 'tenu' : 'manqué',
      'TENU': verdict.objectiveMet ? 'TENU' : 'MANQUÉ',
    };
    // La manchette : bande la plus haute, puis pondération.
    final cands = <UneDef>[];
    int band = -1;
    for (final u in content.unes) {
      if (u.postulats.isNotEmpty && !u.postulats.contains(s.postulatId)) continue;
      if (u.roles.isNotEmpty && !u.roles.contains(s.role)) continue;
      if (u.id == s.lastUne) continue;
      if (!evalWhen(u.when, c)) continue;
      if (u.priority > band) {
        band = u.priority;
        cands.clear();
      }
      if (u.priority == band) cands.add(u);
    }
    final i = rng.weightedIndex([for (final u in cands) u.poids]);
    final une = i < 0 ? null : cands[i];
    final journal = une == null ? null : content.journaux[une.journal];
    final journalNom = journal == null ? 'Le journal' : formatText(journal.nom, s, extra: extra);
    final titre = une == null ? 'LA UNE — Le journal titre sur ta saison avec ${s.entities.named['club']}.' : formatText(une.titre, s, extra: extra);
    final sous = une == null ? '' : formatText(une.sous, s, extra: extra);
    // Les brèves : entrées de la saison, hors Bilan / Une, triées (-poids, slot), hors sujet.
    final sujet = une?.sujet;
    final pool = [
      for (final e in s.journal)
        if (e.season == s.season && e.kind != 'bilan' && e.kind != 'une' && (sujet == null || (!e.tags.contains(sujet) && e.arc != sujet))) e,
    ]..sort((a, b) => a.poids != b.poids ? b.poids.compareTo(a.poids) : a.slot.compareTo(b.slot));
    final breves = pool.take(content.director.unesBreves).map((e) => e.text).toList();
    // La photo : la carte préférée de la manchette si servie cette saison, sinon la carte fatale.
    Map<String, dynamic>? photo;
    final preferred = une?.photo;
    if (preferred != null && (s.cooldowns[preferred] ?? -1) >= s.seasonStartN && content.cards.containsKey(preferred)) {
      photo = {'card': preferred, if (s.lastStoryCard?.id == preferred && s.lastStoryCard?.answer != null) 'answer': s.lastStoryCard!.answer};
    } else if (s.lastStoryCard != null) {
      photo = {'card': s.lastStoryCard!.id, if (s.lastStoryCard!.answer != null) 'answer': s.lastStoryCard!.answer};
    }
    final annee = s.year;
    final prix = s.year >= 2002 ? '0,80 €' : '4,50 F';
    if (une != null) {
      director.addJournal(s, titre, kind: 'une', poids: 3, tags: ['une', if (sujet != null) sujet], arc: une.id);
      s.lastUne = une.id;
      // « Quelqu'un a lu le journal » (spec variété §1.4, déclencheur b) : sans `chance`, zéro aléa.
      for (final v in une.react) {
        if (v.ifWhen != null && !evalWhen(v.ifWhen, c)) continue;
        s.reaction = ReactionRef(card: v.card, phase: 'bilan');
        break;
      }
    }
    return Pending(
      id: 'bilan:une:${s.season}',
      kind: 'bilan_une',
      speaker: null,
      text: titre,
      leftLabel: 'Tourner la page',
      rightLabel: 'Tourner la page',
      leftEffects: const EffectSet(),
      rightEffects: const EffectSet(),
      payload: {
        if (une != null) 'une': une.id,
        'journal': une?.journal ?? '',
        'journal_nom': journalNom,
        'style': journal?.style ?? 'bleu',
        'titre': titre,
        'sous': sous,
        'breves': breves,
        if (photo != null) 'photo': photo,
        'annee': annee,
        'date': 'juin ${annee + 1}',
        'prix': prix,
        'rang': verdict.rank,
        'tenu': verdict.objectiveMet,
        'outcome': verdict.outcome,
        'objectif': objectif,
        'priority': une?.priority ?? -1,
      },
      single: true,
    );
  }

  Pending _bilanVerdict(GameState s) {
    // Le verdict est calculé sans être appliqué (comme la Une, spec §1.6) :
    // les variantes lisent `bilan.tenu`, `bilan.rang`, `bilan.outcome`.
    final verdict = seasonVerdict(s.world.division, s.world.pts, s.objectiveTarget);
    final extra = {
      'rang': '${verdict.rank}',
      'objectif': objectiveLabelFr(s.objectiveTarget),
      'tenu': verdict.objectiveMet ? 'tenu' : 'manqué',
      'TENU': verdict.objectiveMet ? 'TENU' : 'MANQUÉ',
    };
    final sp = _setpiece(s, 'bilan_verdict', 'bilan',
        bilanTenu: verdict.objectiveMet, bilanRang: verdict.rank, bilanOutcome: verdict.outcome);
    final label = _fmtFor(s, sp?.v.left ?? 'Voir le classement', speaker: sp?.v.speaker, extra: extra);
    return Pending(
      id: 'bilan:verdict:${s.season}',
      kind: 'bilan_verdict',
      speaker: sp?.v.speaker,
      text: _spText(s, sp, 'Le verdict de la saison tombe. Objectif : {objectif}.', speaker: sp?.v.speaker, extra: extra),
      leftLabel: label,
      rightLabel: label,
      leftEffects: const EffectSet(),
      rightEffects: const EffectSet(),
      single: true,
      payload: _spPayload('bilan_verdict', sp),
    );
  }

  Pending _bilanContrat(GameState s) {
    final patronId = _patronOf(s);
    final name = content.characters[patronId]?.name ?? 'Le président';
    final sp = _setpiece(s, 'bilan_contrat', 'bilan');
    final speaker = sp?.v.speaker ?? patronId;
    final ch = content.characters[speaker];
    final extra = {'patron': name, 'objectif': objectiveLabelFr(s.objectiveTarget)};
    String f(String t) => _fmtFor(s, t, speaker: speaker, extra: extra);
    return Pending(
      id: 'bilan:contrat:${s.season}',
      kind: 'bilan_contrat',
      speaker: speaker,
      text: _spText(s, sp, '{patron} : « On continue l\'aventure, ou tu tentes autre chose ? »', speaker: speaker, extra: extra),
      leftLabel: f(sp?.v.left ?? 'Je reste'),
      rightLabel: f(sp?.v.right ?? 'Je réclame plus de moyens'),
      leftEffects: const EffectSet(gauges: {'direction': 3}),
      rightEffects: const EffectSet(gauges: {'direction': -6, 'caisse': 6}),
      previewLeft: const [GaugeHint('direction', 1)],
      previewRight: const [GaugeHint('direction', 1), GaugeHint('caisse', 1)],
      payload: {
        if (sp?.v.answerLeft != null) 'answerLeft': f(sp!.v.answerLeft!),
        if (sp?.v.answerRight != null) 'answerRight': f(sp!.v.answerRight!),
        if (ch != null) 'speakerName': ch.name,
        if (ch != null) 'speakerLabel': ch.label,
        ..._spPayload('bilan_contrat', sp),
      },
    );
  }

  Pending _bilanCarrefour(GameState s, Rng rng) {
    // Offer a transition if any is eligible and no gauge is under 20.
    final anyLow = s.gauges.values.any((v) => v < 20) && s.parole < 3;
    final role = content.roles[s.role]!;
    final sp = _setpiece(s, 'bilan_carrefour', 'bilan', keep: (v) => v.transition != null);
    if (!anyLow) {
      for (final t in role.transitions) {
        if (evalWhen(t.when, EvalContext(s, 'bilan'))) {
          // Une variante `transition:` remplace le libellé de roles.yaml quand
          // elle vise la même transition (spec variété §2.7).
          final v = sp != null && sp.v.transition == t.to ? sp : null;
          return Pending(
            id: 'carrefour:${s.season}',
            kind: 'bilan_carrefour',
            speaker: v?.v.speaker,
            text: _spText(s, v, t.label, speaker: v?.v.speaker),
            leftLabel: _fmtFor(s, v?.v.left ?? 'Je refuse', speaker: v?.v.speaker),
            rightLabel: _fmtFor(s, v?.v.right ?? 'J\'accepte', speaker: v?.v.speaker),
            leftEffects: const EffectSet(),
            rightEffects: const EffectSet(),
            payload: {'transition': t.to, ..._spPayload('bilan_carrefour', v)},
          );
        }
      }
    }
    final noTransition = _setpiece(s, 'bilan_carrefour', 'bilan', keep: (v) => v.transition == null);
    final label = _fmtFor(s, noTransition?.v.left ?? 'Continuer', speaker: noTransition?.v.speaker);
    return Pending(
      id: 'carrefour:none:${s.season}',
      kind: 'bilan_carrefour',
      speaker: noTransition?.v.speaker,
      text: _spText(s, noTransition, 'Une nouvelle saison commence.', speaker: noTransition?.v.speaker),
      leftLabel: label,
      rightLabel: label,
      leftEffects: const EffectSet(),
      rightEffects: const EffectSet(),
      single: true,
      payload: _spPayload('bilan_carrefour', noTransition),
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
    // Un seul jeu de noms de famille par carrière : le protagoniste, le
    // capitaine et le coach adverse sont tirés dans cet ordre fixe et ne
    // peuvent pas se retrouver homonymes (défaut relevé : « Camille Bréhaut /
    // capitaine Noah Bréhaut »). La boucle de re-tirage est bornée, donc le
    // nombre d'appels au Rng reste borné et « même code, même carrière » tient.
    final pris = <String>{};
    final proto = _pickName(rng, genre, pris);
    final club = _makeClub(rng);
    final rival = _makeClub(rng);
    final sp = proto.indexOf(' ');
    return Entities(
      prenom: proto.substring(0, sp),
      nom: proto.substring(sp + 1),
      genre: genre,
      named: {
        'club': club,
        'clubShort': club.split(' ').last,
        'rival': rival,
        'capitaine': _pickName(rng, 'm', pris),
        'ville': _pickVille(rng),
        'coach': _pickName(rng, 'm', pris),
      },
    );
  }

  /// Mots (sans casse ni accents) portés par le nom d'un personnage du jeu :
  /// aucun nom tiré ne doit les reprendre, sous peine de faire parler dans la
  /// même saison « Bréhaut le capitaine » et un protagoniste homonyme.
  late final Set<String> _motsDuCasting = () {
    final out = <String>{};
    for (final c in content.charactersSorted) {
      for (final w in foldAccents(c.name).split(RegExp(r"[ \-']+"))) {
        if (w.isNotEmpty) out.add(w);
      }
    }
    return out;
  }();

  List<String> _pool(String cle) {
    final brut = (content.names[cle] as List).cast<String>();
    final net = brut.where((n) {
      for (final w in foldAccents(n).split(RegExp(r"[ \-']+"))) {
        if (w.isNotEmpty && _motsDuCasting.contains(w)) return false;
      }
      return true;
    }).toList();
    return net.isEmpty ? brut : net; // jamais de pool vide
  }

  late final Map<String, List<String>> _pools = {
    'prenoms_m': _pool('prenoms_m'),
    'prenoms_f': _pool('prenoms_f'),
    'noms': _pool('noms'),
  };

  String _pickName(Rng rng, String genre, [Set<String>? pris]) {
    final firsts = _pools[genre == 'f' ? 'prenoms_f' : 'prenoms_m']!;
    final lasts = _pools['noms']!;
    final prenom = firsts[rng.nextInt(firsts.length)];
    var nom = lasts[rng.nextInt(lasts.length)];
    if (pris != null) {
      for (var i = 0; i < 6 && pris.contains(nom); i++) {
        nom = lasts[rng.nextInt(lasts.length)];
      }
      pris.add(nom);
    }
    return '$prenom $nom';
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

/// La variante de set-piece retenue et son rang dans la liste du beat
/// (spec variété §1.12) : `simulate` mesure la part servie hors secours.
class _Setpiece {
  final SetpieceVariant v;
  final int index;
  final String beat;
  const _Setpiece(this.v, this.index, this.beat);
  bool get secours => v.isSecours;
}
