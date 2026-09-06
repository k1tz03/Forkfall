/// The narrative director ("metteur en scène"). It picks the next narrative
/// card so that a story actually unfolds: hard deadlines for arc steps,
/// absolute slots for the postulat script, a forced cadence (never more than
/// `gap_max` cards without a story beat), alarms when a gauge crosses 20/80,
/// rare events, and reserved breathing slots for the Cartes Nouvelles.
///
/// Everything hard (script, overdue, event, alarm) is decided without any
/// randomness by a total order; the state Rng is only consumed for weighted
/// choices, in a fixed order per card (spec §1.11), so "same seed + same
/// swipes" still reproduces the run exactly.
library;

import 'dart:math' as math;

import '../condition.dart';
import '../content.dart';
import '../effects.dart';
import '../rng.dart';
import '../state.dart';
import '../text.dart';

typedef PendingBuilder = Pending Function(GameState s, Card card, String phase, Rng rng, Map<String, dynamic> extra);
typedef FillerBuilder = Pending Function(GameState s);

/// A debug view of what competed for a slot.
class Candidate {
  final int band;
  final String id;
  final double weight;
  const Candidate(this.band, this.id, this.weight);
}

class _Hard {
  final int band;
  final Scheduled sc;
  final Card card;
  const _Hard(this.band, this.sc, this.card);
}

/// « Temps d'histoire » (spec variété §1.1) : ce que la cadence et la carte
/// fatale de la Une comptent.
const Set<String> kStoryKinds = {'script', 'etape', 'evenement', 'palier', 'chaine', 'reaction'};
const Set<String> _storyKinds = kStoryKinds;
const Set<String> _softKinds = {'etape', 'chaine', 'palier'};
const String kNouvellesDuPasse = 'tr.nouvelles_du_passe';
const String kGenericArc = 'co.script.generique';

class Director {
  final Content content;
  final PendingBuilder toPending;
  final FillerBuilder filler;

  /// What competed for the last slot (band, id, weight) — for authors/tools.
  List<Candidate> lastCandidates = [];

  /// How the last `forceStory` found its card: `window` (a step already in
  /// its window, served early), `open` (an arc opened), `pull` (a future
  /// step pulled to now). Only `open` and `pull` are reported as `forced`.
  String lastForceKind = '';

  Director(this.content, this.toPending, this.filler);

  DirectorConfig get q => content.director;

  EvalContext ctx(GameState s, String phase, {Card? card}) =>
      EvalContext(s, phase, card: card, slotsTotal: content.cardSlots(s.role), cast: _castOf(s));

  Set<String> _castOf(GameState s) => content.postulats[s.postulatId]?.cast.keys.toSet() ?? const {};

  // ---------------------------------------------------------------------------
  // Queue helpers.
  // ---------------------------------------------------------------------------

  static int _byDeadline(Scheduled a, Scheduled b) {
    final c = a.deadlineN.compareTo(b.deadlineN);
    if (c != 0) return c;
    final d = a.dueN.compareTo(b.dueN);
    return d != 0 ? d : a.seq.compareTo(b.seq);
  }

  List<Scheduled> _sortedQueue(GameState s) => List.of(s.scheduled)..sort(_byDeadline);

  /// Add an entry. One live entry per arc (a script's anchors are exempt: a
  /// postulat script queues several anchors of the same season by design) and
  /// one entry per card (re-scheduling a queued card replaces its window) —
  /// except « Nouvelles du passé », which is one entry per abandoned arc.
  void enqueue(GameState s, Scheduled sc) {
    s.seq += 1;
    sc.seq = s.seq;
    sc.clubSeq = s.clubSeq;
    if (sc.arc != null && sc.kind != 'script') {
      s.scheduled.removeWhere((e) => e.arc == sc.arc && e.kind != 'script');
    }
    if (sc.kind != 'passe') s.scheduled.removeWhere((e) => e.card == sc.card);
    s.scheduled.add(sc);
  }

  String kindOfArc(String? arcId) => arcId == null ? 'chaine' : (content.arcs[arcId]?.entryKind ?? 'chaine');

  /// First variant whose `if` holds at scheduling time, else the last one.
  String resolveVariant(StepDef st, EvalContext c) {
    for (final v in st.card) {
      if (v.ifWhen == null || evalWhen(v.ifWhen, c)) return v.id;
    }
    return st.card.last.id;
  }

  bool drameAllowed(GameState s) => s.season >= 1 && !s.lastWasDrame && s.drames < 1;

  int activeForeground(GameState s) {
    int n = 0;
    s.arcs.forEach((id, st) {
      if ((st.status == 'armed' || st.status == 'active') && (content.arcs[id]?.foreground ?? false)) n++;
    });
    return n;
  }

  void arcDone(GameState s, String id) {
    final st = s.arcs[id] ??= ArcState();
    st.status = 'done';
    st.doneSeason = s.season;
    st.plays += 1;
    final arc = content.arcs[id];
    if (arc != null && arc.kind == 'serie' && arc.carrierId.isNotEmpty) {
      s.carriersLastSeason[arc.carrierId] = s.season; // ×0,5 au tirage suivant
    }
    final line = arc?.epilogue['journal'];
    if (line is String && line.isNotEmpty) addJournal(s, line, kind: 'arc', poids: 2, tags: _arcTags(arc!), arc: id);
    s.scheduled.removeWhere((e) => e.arc == id && e.kind != 'script');
  }

  List<String> _arcTags(ArcDef arc) => [if (arc.themeId.isNotEmpty) arc.themeId, arc.id];

  // ---------------------------------------------------------------------------
  // Journal de carrière (spec variété §1.7) et réactions (§1.4).
  // ---------------------------------------------------------------------------

  /// Écrit une ligne d'Almanach, formatée à l'écriture (le nom, le club, le
  /// rang de l'instant), tronquée à 120 caractères. Aucun aléa.
  void addJournal(GameState s, String text, {required String kind, int poids = 1, List<String> tags = const [], String? arc, Map<String, String> extra = const {}}) {
    var t = formatText(text, s, extra: extra).trim();
    if (t.length > 120) t = '${t.substring(0, 119).trimRight()}…';
    if (t.isEmpty) return;
    s.journal.add(JournalEntry(
      season: s.season,
      year: s.year,
      slot: s.slot,
      kind: kind,
      text: t,
      poids: poids.clamp(1, 5),
      tags: List.of(tags),
      arc: arc,
    ));
  }

  /// Écrit un gabarit moteur de `content/journal.yaml` (`auto:`) ; rien si le
  /// gabarit est absent (contenu synthétique des tests).
  void addJournalAuto(GameState s, String key, {required String kind, int poids = 2, List<String> tags = const [], String? arc, Map<String, String> extra = const {}}) {
    final tpl = content.journalTemplates[key];
    if (tpl == null || tpl.isEmpty) return;
    addJournal(s, tpl, kind: kind, poids: poids, tags: tags, arc: arc, extra: extra);
  }

  /// Compaction de l'Almanach (spec variété §1.7) : la saison [season] garde
  /// ses `journal_par_saison` entrées les plus lourdes (tri `(-poids, slot)`),
  /// dans leur ordre d'écriture. Déterministe, sans aléa.
  void compactJournal(GameState s, int season) {
    final idx = <int>[];
    for (var i = 0; i < s.journal.length; i++) {
      if (s.journal[i].season == season) idx.add(i);
    }
    final max = q.journalParSaison;
    if (idx.length <= max) return;
    final ranked = List.of(idx)
      ..sort((a, b) {
        final c = s.journal[b].poids.compareTo(s.journal[a].poids);
        if (c != 0) return c;
        final d = s.journal[a].slot.compareTo(s.journal[b].slot);
        return d != 0 ? d : a.compareTo(b);
      });
    final keep = ranked.take(max).toSet();
    final drop = idx.where((i) => !keep.contains(i)).toSet();
    s.journal = [for (var i = 0; i < s.journal.length; i++) if (!drop.contains(i)) s.journal[i]];
  }

  /// Sert la réaction en attente (spec variété §1.4, règle 2) : hors créneau
  /// (bande 8), sans toucher `ncards`, `slot`, `lastStoryN`, `tension`,
  /// `toneCounts` ni `storyThisSeason` ; met à jour la voix et la dette de
  /// visage. Zéro aléa. Null (et `miss_reaction`) si la carte n'existe plus,
  /// si son `when` est faux, si elle est `once` et déjà vue, si le plafond
  /// est atteint ou si la carte précédente était déjà une réaction.
  Pending? serveReaction(GameState s, ReactionRef rx, Rng rng) {
    final card = content.cards[rx.card];
    final beats = content.seasonBeats[s.role] ?? const <Beat>[];
    final phase = s.beat < beats.length ? beats[s.beat].phase : 'bilan';
    bool ok = card != null && s.reactionsThisSeason < q.reactionsMax && !s.lastWasReaction;
    if (ok && card.once && (s.seenCount[card.id] ?? 0) > 0) ok = false;
    if (ok && !evalWhen(card!.when, ctx(s, phase, card: card))) ok = false;
    if (!ok || card == null) {
      s.stats['miss_reaction'] = (s.stats['miss_reaction'] ?? 0) + 1;
      return null;
    }
    final n = s.ncards;
    s.reactionsThisSeason += 1;
    s.cooldowns[card.id] = n;
    s.seenCount[card.id] = (s.seenCount[card.id] ?? 0) + 1;
    final sp = card.speaker;
    if (sp != null) {
      s.lastSeenChar[sp] = n;
      s.speakerSeen[sp] = (s.speakerSeen[sp] ?? 0) + 1;
      s.recentSpeakers.add(sp);
      while (s.recentSpeakers.length > 3) {
        s.recentSpeakers.removeAt(0);
      }
    }
    s.lastSpeaker = sp;
    final extra = <String, dynamic>{
      'phase': phase,
      'band': 8,
      'kind': 'reaction',
      if (rx.arc != null) 'arc': rx.arc,
      if (rx.step != null) 'step': rx.step,
      'tone': card.tone,
    };
    return toPending(s, card, phase, rng, extra);
  }

  /// Un arc peut-il être (r)ouvert ? (spec variété §1.3)
  bool replayable(GameState s, ArcDef a) {
    final st = s.arcs[a.id];
    if (st == null) return true;
    if (st.status == 'armed' || st.status == 'active') return false;
    if (a.isEverySeason) return st.doneSeason != s.season;
    final r = a.replay;
    if (r == null) return false; // défaut : jamais
    if (st.status == 'abandonne' && !r.afterAbort) return false;
    return st.plays < r.max && s.season - (st.doneSeason ?? -99) >= r.after;
  }

  void arcAbort(GameState s, String id, [String? reason]) {
    final st = s.arcs[id] ??= ArcState();
    st.status = 'abandonne';
    st.reason = reason;
    s.scheduled.removeWhere((e) => e.arc == id && e.kind != 'script');
  }

  // ---------------------------------------------------------------------------
  // The draw (spec §1.3).
  // ---------------------------------------------------------------------------

  Pending drawNarrative(GameState s, String phase, Rng rng) {
    s.ncards += 1;
    s.slot += 1;
    final n = s.ncards;
    final c = ctx(s, phase);
    lastCandidates = [];

    // 0. Housekeeping (no randomness except maintainArcs / armEvents).
    refreshVariants(s, c);
    purge(s, c);
    raiseAlarms(s, c);
    armEvents(s, c, rng);
    maintainArcs(s, c, rng);

    // 1. Hard candidates (bands 3..7): served without randomness.
    final hard = <_Hard>[];
    for (final sc in _sortedQueue(s)) {
      if (sc.dueN < 0 || sc.dueN > n) continue; // dueN < 0 : fusée longue non planifiée
      final card = content.cards[sc.card];
      if (card == null) {
        miss(s, sc, 'inconnue', c);
        continue;
      }
      if (card.tone == 'drame' && !drameAllowed(s)) {
        if (n >= sc.deadlineN) {
          sc.deadlineN = n + 1;
          sc.reports += 1;
          if (sc.reports > 8) miss(s, sc, 'drame_bloque', c);
        }
        continue;
      }
      final ok = evalWhen(card.when, c.withCard(card));
      if (n >= sc.deadlineN) {
        if (!ok) {
          miss(s, sc, 'ineligible', c);
          continue;
        }
        hard.add(_Hard(sc.kind == 'script' ? 7 : 6, sc, card));
        continue;
      }
      if (!ok) continue; // not yet: wait until the deadline
      if (sc.kind == 'script') {
        hard.add(_Hard(5, sc, card));
      } else if (sc.kind == 'evenement') {
        hard.add(_Hard(4, sc, card));
      } else if (sc.kind == 'alarme') {
        hard.add(_Hard(3, sc, card));
      }
    }
    if (hard.isNotEmpty) {
      hard.sort((a, b) {
        if (a.band != b.band) return b.band.compareTo(a.band);
        if (a.sc.deadlineN != b.sc.deadlineN) return a.sc.deadlineN.compareTo(b.sc.deadlineN);
        final sa = a.card.speaker != null && a.card.speaker == s.lastSpeaker ? 1 : 0;
        final sb = b.card.speaker != null && b.card.speaker == s.lastSpeaker ? 1 : 0;
        if (sa != sb) return sa.compareTo(sb);
        if (a.sc.dueN != b.sc.dueN) return a.sc.dueN.compareTo(b.sc.dueN);
        return a.sc.seq.compareTo(b.sc.seq);
      });
      for (final h in hard) {
        lastCandidates.add(Candidate(h.band, h.card.id, 1));
      }
      return serve(s, hard.first.sc, phase, rng, band: hard.first.band);
    }

    // 2. Forced cadence comes before the breathing slot: when the story has
    // been silent for more than `gap_max` cards, a step (in window, opened
    // from the reserve, or pulled) passes first and the reserved Nouvelle
    // keeps its debt for the next slot — exactly as the hard bands do.
    if (n - s.lastStoryN > q.gapMax) {
      final sc = forceStory(s, c, rng);
      if (sc != null) return serve(s, sc, phase, rng, band: 2, forced: lastForceKind != 'window');
    }

    // 3. Breathing: a reserved Nouvelle that is due (or owed), or wanted by tension.
    final reserved = q.nouvelleSlotsFor(s.role);
    final owed = reserved.where((k) => k <= s.slot).length - s.nouvellesThisSeason;
    final wantBreath = s.tension >= 2 && s.nouvellesThisSeason < reserved.length + 1;
    // Never two Nouvelles in a row (budget): a debt is carried to the next slot.
    if ((owed > 0 || wantBreath) && s.lastTheme != 'nouvelle') {
      final nv = pickNouvelle(s, c, rng);
      if (nv != null) return serve(s, null, phase, rng, band: 1, card: nv);
    }

    // 4. Steps inside their window (band 2): weighted.
    final soft = <Scheduled>[];
    final softW = <double>[];
    for (final sc in _sortedQueue(s)) {
      if (!_softKinds.contains(sc.kind)) continue;
      if (sc.dueN > n || n >= sc.deadlineN) continue;
      final card = content.cards[sc.card];
      if (card == null) continue;
      if (card.tone == 'drame' && !drameAllowed(s)) continue;
      if (!evalWhen(card.when, c.withCard(card))) continue;
      if (s.tension >= 2 && card.tone != 'leger') continue;
      if (sc.kind == 'etape' && s.softStepsThisSeason >= q.softStepsMax) continue;
      final w = _arcWeight(sc) * _urgency(sc, n) * _continuity(s, sc, card) * faceFactor(s, card.speaker);
      soft.add(sc);
      softW.add(w);
      lastCandidates.add(Candidate(2, card.id, w));
    }
    if (soft.isNotEmpty) {
      final i = rng.weightedIndex(softW);
      if (i >= 0) return serve(s, soft[i], phase, rng, band: 2);
    }

    // 5. Routine (band 0), then anti-famine fallbacks.
    final card = pickPool(s, phase, c, rng);
    if (card != null) return serve(s, null, phase, rng, band: 0, card: card);
    final nv = pickNouvelle(s, c, rng);
    if (nv != null) return serve(s, null, phase, rng, band: 1, card: nv);
    s.stats['famine'] = (s.stats['famine'] ?? 0) + 1;
    return filler(s);
  }

  double _arcWeight(Scheduled sc) => sc.arc == null ? 1.0 : (content.arcs[sc.arc]?.weight ?? 1.0);

  double _urgency(Scheduled sc, int n) => 1 + (n - sc.dueN) / math.max(1, sc.deadlineN - sc.dueN);

  double _continuity(GameState s, Scheduled sc, Card card) {
    double f = 1;
    if (sc.arc != null && sc.arc == s.lastArcId) f *= 0.5;
    final sp = card.speaker;
    if (sp != null) {
      if (sp == s.lastSpeaker) f *= 0.3;
      if ((s.speakerSeen[sp] ?? 0) > 0 && !s.recentSpeakers.contains(sp)) f *= 1.3;
    }
    return f;
  }

  /// "Face debt": a cast character who has not been seen for longer than his
  /// expected interval gets more likely (bounded ×0.5..×2).
  double faceFactor(GameState s, String? ch) {
    if (ch == null) return 1.0;
    final post = content.postulats[s.postulatId];
    final target = post?.cast[ch]?.target ?? content.characters[ch]?.defaultTarget ?? 0.5;
    final expected = content.cardSlots(s.role) / (target <= 0 ? 0.5 : target);
    final last = s.lastSeenChar[ch];
    if (last == null) return 1.0;
    return ((s.ncards - last) / expected).clamp(0.5, 2.0).toDouble();
  }

  // ---------------------------------------------------------------------------
  // Housekeeping: purge, alarms, events, arcs (spec §1.4, §1.5, §1.7, §1.8).
  // ---------------------------------------------------------------------------

  /// A queued step with several variants is re-read at every draw: the card
  /// actually served is the first variant whose `if` holds NOW, not at the time
  /// the step was queued (Gigi's promise made after the season opened, the
  /// mid-season rank before the twist, the relation after the previous step).
  void refreshVariants(GameState s, EvalContext c) {
    for (final sc in s.scheduled) {
      if (sc.arc == null || sc.step == null) continue;
      final step = content.arcs[sc.arc]?.stepById(sc.step!);
      if (step == null || step.card.length < 2) continue;
      final id = resolveVariant(step, c);
      if (id == sc.card || s.scheduled.any((e) => e.card == id)) continue;
      sc.card = id;
    }
  }

  void purge(GameState s, EvalContext c) {
    final n = s.ncards;
    for (final sc in List.of(s.scheduled)) {
      final card = content.cards[sc.card];
      if (sc.isLongFuse) {
        // Une fusée longue attend sa saison : seules les raisons club / annulée la touchent.
        if (sc.clubSeq != s.clubSeq && sc.sameClub) {
          miss(s, sc, 'club', c);
        } else if (sc.cancelIf != null && evalWhen(sc.cancelIf, c)) {
          miss(s, sc, 'annulee', c);
        }
        continue;
      }
      if (card == null) {
        miss(s, sc, 'inconnue', c);
      } else if (card.once && (s.seenCount[card.id] ?? 0) > 0) {
        miss(s, sc, 'deja_vue', c);
      } else if (sc.clubSeq != s.clubSeq && sc.sameClub) {
        miss(s, sc, 'club', c);
      } else if (sc.cancelIf != null && evalWhen(sc.cancelIf, c)) {
        miss(s, sc, 'annulee', c);
      } else if (sc.expireSeason != null && s.season > sc.expireSeason!) {
        miss(s, sc, 'perimee', c);
      } else if (sc.kind == 'alarme' && (n - (s.cooldowns[card.id] ?? -999)) < card.cooldown) {
        s.scheduled.remove(sc);
      }
    }
  }

  void raiseAlarms(GameState s, EvalContext c) {
    final role = content.roles[s.role];
    if (role == null) return;
    final n = s.ncards;
    final post = content.postulats[s.postulatId];
    for (final g in role.gauges) {
      final v = s.gauges[g.id] ?? 50;
      for (final side in const ['low', 'high']) {
        final key = '${g.id}:$side';
        final hit = side == 'low' ? v < 20 : v > 80;
        if (!hit) {
          // Hysteresis: re-arm only once the gauge is back inside [30, 70].
          if (side == 'low' ? v >= 30 : v <= 70) s.alarmFired.remove(key);
          continue;
        }
        if (s.alarmFired.contains(key)) continue;
        s.alarmFired.add(key);
        if (s.alarmsThisSeason >= q.alarmsMax) continue;
        if (s.scheduled.any((sc) => sc.kind == 'alarme' && sc.payload['gauge'] == g.id)) continue;
        final fileKey = '${g.id}.$side';
        final cands = <AlarmEntry>[
          ...?(post?.alarmOverrides[fileKey]),
          ...?(content.alarms[s.role]?[fileKey]),
        ];
        Card? chosen;
        for (final e in cands) {
          final card = content.cards[e.card];
          if (card == null) continue;
          if (e.when != null && !evalWhen(e.when, c.withCard(card))) continue;
          if (!evalWhen(card.when, c.withCard(card))) continue;
          if (n - (s.cooldowns[card.id] ?? -999) < card.cooldown) continue;
          chosen = card;
          break;
        }
        if (chosen == null) continue;
        s.alarmsThisSeason += 1;
        enqueue(
          s,
          Scheduled(
            card: chosen.id,
            kind: 'alarme',
            dueN: n,
            deadlineN: n + 2,
            fallback: 'drop',
            sameClub: false,
            payload: {'gauge': g.id, 'side': side},
          ),
        );
      }
    }
  }

  void armEvents(GameState s, EvalContext c, Rng rng) {
    if (s.eventsThisSeason >= q.eventsMax) return;
    if (s.scheduled.any((sc) => sc.kind == 'evenement')) return;
    final total = content.cardSlots(s.role);
    if (s.slot < 4 || s.slot > total - 3) return; // never on the opening nor the finale
    if (s.season == 0 && s.slot < 8) return;
    final el = <ArcDef>[];
    for (final a in content.arcsSorted) {
      if (a.kind != 'evenement' || !a.roles.contains(s.role)) continue;
      if (s.arcs.containsKey(a.id)) continue;
      if (!evalWhen(a.when, c)) continue;
      el.add(a);
    }
    if (el.isEmpty) return;
    final roll = rng.nextDouble();
    double acc = 0;
    for (final a in el) {
      acc += a.chance;
      if (roll < acc) {
        s.eventsThisSeason += 1;
        armArc(s, a, c, dueN: s.ncards, deadlineN: s.ncards + 1);
        return;
      }
    }
  }

  /// Le programme du postulat courant, s'il en a un (sinon : comportement
  /// historique, séries ouvertes spontanément).
  ProgrammeDef? programmeOf(GameState s) {
    final post = content.postulats[s.postulatId];
    if (post == null || post.role != s.role) return null;
    return post.programme;
  }

  /// Porteurs des intrigues de premier plan encore armées ou actives.
  Set<String> _carriersInPlay(GameState s) {
    final out = <String>{};
    final ids = s.arcs.keys.toList()..sort();
    for (final id in ids) {
      final st = s.arcs[id]!;
      if (st.status != 'armed' && st.status != 'active') continue;
      final a = content.arcs[id];
      if (a == null || a.kind != 'serie' || !a.foreground || !a.roles.contains(s.role)) continue;
      if (a.carrierId.isNotEmpty) out.add(a.carrierId);
    }
    return out;
  }

  /// Filtre commun du réservoir (spec variété §1.2) : l'arc existe, joue le
  /// rôle, est une série, est rejouable, ses `when`/`if` sont vrais, sa saison
  /// minimale est atteinte, ses drapeaux exigés/interdits sont respectés, aucun
  /// arc `exclusive_with` n'est en cours, et son porteur est libre.
  bool _poolEligible(GameState s, ProgEntry e, EvalContext c, Set<String> carriers) {
    final a = content.arcs[e.arc];
    if (a == null || !a.roles.contains(s.role) || a.kind != 'serie') return false;
    if (!replayable(s, a)) return false;
    if (e.ifWhen != null && !evalWhen(e.ifWhen, c)) return false;
    if (!evalWhen(a.when, c) || s.season < a.minSeason) return false;
    if (a.requires.any((f) => !s.flags.contains(f))) return false;
    if (a.excludes.any((f) => s.flags.contains(f))) return false;
    for (final other in a.exclusiveWith) {
      final st = s.arcs[other];
      if (st != null && (st.status == 'armed' || st.status == 'active')) return false;
    }
    if (a.carrierId.isNotEmpty && carriers.contains(a.carrierId)) return false;
    return true;
  }

  List<ArcDef> eligibleArcs(GameState s, EvalContext c) {
    final out = <ArcDef>[];
    final prog = programmeOf(s);
    if (prog != null) {
      // Réservoir : les entrées de tous les buckets ≤ saison, mêmes filtres que
      // le tirage ; les séries non listées ne s'ouvrent plus spontanément.
      final carriers = _carriersInPlay(s);
      final seen = <String>{};
      for (final e in prog.entriesUpTo(s.season)) {
        if (!seen.add(e.arc)) continue;
        if (!_poolEligible(s, e, c, carriers)) continue;
        out.add(content.arcs[e.arc]!);
      }
      return out;
    }
    for (final a in content.arcsSorted) {
      if (a.kind != 'serie' || !a.roles.contains(s.role)) continue;
      if (a.postulats.isNotEmpty && !a.postulats.contains(s.postulatId)) continue;
      final st = s.arcs[a.id];
      if (st != null && !(a.isEverySeason && st.doneSeason != s.season)) continue;
      if (!evalWhen(a.when, c)) continue;
      out.add(a);
    }
    return out;
  }

  /// Le premier arc de la réserve encore éligible (sans aléa), retiré de la
  /// réserve ; null si la réserve est vide ou plus rien n'y est éligible.
  ArcDef? _takeFromReserve(GameState s, List<ArcDef> eligible, {bool foregroundOnly = false}) {
    if (s.reserve.isEmpty) return null;
    for (final id in List.of(s.reserve)) {
      ArcDef? a;
      for (final e in eligible) {
        if (e.id == id) {
          a = e;
          break;
        }
      }
      if (a == null || (foregroundOnly && !a.foreground)) continue;
      s.reserve.remove(id);
      return a;
    }
    return null;
  }

  void maintainArcs(GameState s, EvalContext c, Rng rng) {
    if (activeForeground(s) >= q.minActive) return;
    if (s.softStepsThisSeason >= q.softStepsMax) return;
    final eligible = eligibleArcs(s, c);
    final fromReserve = _takeFromReserve(s, eligible, foregroundOnly: true);
    if (fromReserve != null) {
      armArc(s, fromReserve, c, dueN: s.ncards + fromReserve.startMin, deadlineN: s.ncards + fromReserve.startMax);
      return;
    }
    final el = eligible.where((a) => a.foreground).toList();
    if (el.isEmpty) return;
    final i = rng.weightedIndex(el.map((a) => a.weight).toList());
    if (i < 0) return;
    final a = el[i];
    armArc(s, a, c, dueN: s.ncards + a.startMin, deadlineN: s.ncards + a.startMax);
  }

  void armArc(GameState s, ArcDef arc, EvalContext c, {required int dueN, required int deadlineN}) {
    if (arc.steps.isEmpty) return;
    final prev = s.arcs[arc.id];
    // La ligne d'ouverture n'est écrite qu'à la première ouverture (spec variété §1.7).
    if (prev == null && arc.journal != null && arc.journal!.isNotEmpty) {
      addJournal(s, arc.journal!, kind: 'arc', poids: 2, tags: _arcTags(arc), arc: arc.id);
    }
    // Une relance conserve `plays` et `outcome` (spec variété §1.3).
    s.arcs[arc.id] = ArcState(
      status: 'armed',
      lastN: s.ncards,
      startedSeason: s.season,
      plays: prev?.plays ?? 0,
      outcome: prev?.outcome,
    );
    if (arc.kind == 'serie' && arc.themeId.isNotEmpty && !s.themesPlayed.contains(arc.themeId)) {
      s.themesPlayed.add(arc.themeId);
      s.themesPlayed.sort();
    }
    final st = arc.steps.first;
    enqueue(
      s,
      Scheduled(
        card: resolveVariant(st, c),
        kind: arc.entryKind,
        arc: arc.id,
        step: st.id,
        dueN: dueN,
        deadlineN: deadlineN,
        fallback: arc.fallback,
        cancelIf: arc.cancelIf,
        sameClub: arc.sameClub,
      ),
    );
  }

  /// Called when too many cards went by without a story beat.
  Scheduled? forceStory(GameState s, EvalContext c, Rng rng) {
    final n = s.ncards;
    lastForceKind = '';
    // (a) a step suspended by tension or the quota: serve it anyway.
    for (final sc in _sortedQueue(s)) {
      if (!_softKinds.contains(sc.kind) || sc.dueN < 0 || sc.dueN > n || n >= sc.deadlineN) continue;
      final card = content.cards[sc.card];
      if (card == null) continue;
      if (card.tone == 'drame' && !drameAllowed(s)) continue;
      if (!evalWhen(card.when, c.withCard(card))) continue;
      lastForceKind = 'window';
      return sc;
    }
    // (b) room for another arc: open one, first step due now (the reserve first).
    if (activeForeground(s) < q.maxActive) {
      final el = eligibleArcs(s, c);
      final fromReserve = _takeFromReserve(s, el);
      if (fromReserve != null) {
        s.stats['reserve_forcee'] = (s.stats['reserve_forcee'] ?? 0) + 1;
        armArc(s, fromReserve, c, dueN: n, deadlineN: n + math.max(1, fromReserve.startMax - fromReserve.startMin));
        lastForceKind = 'open';
        return s.scheduled.isEmpty ? null : s.scheduled.last;
      }
      if (el.isNotEmpty) {
        final i = rng.weightedIndex(el.map((a) => a.weight).toList());
        if (i >= 0) {
          final a = el[i];
          armArc(s, a, c, dueN: n, deadlineN: n + math.max(1, a.startMax - a.startMin));
          lastForceKind = 'open';
          return s.scheduled.isEmpty ? null : s.scheduled.last;
        }
      }
    }
    // (c) last resort: pull the nearest future step to now (counted).
    Scheduled? best;
    for (final sc in _sortedQueue(s)) {
      if (sc.kind != 'etape' && sc.kind != 'chaine') continue;
      if (sc.dueN <= n) continue;
      final card = content.cards[sc.card];
      if (card == null || !evalWhen(card.when, c.withCard(card))) continue;
      if (best == null || sc.dueN < best.dueN || (sc.dueN == best.dueN && sc.seq < best.seq)) best = sc;
    }
    if (best != null) {
      best.dueN = n;
      s.stats['cadence_pull'] = (s.stats['cadence_pull'] ?? 0) + 1;
      lastForceKind = 'pull';
      return best;
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // Routine bag and Nouvelles (spec §1.9).
  // ---------------------------------------------------------------------------

  double phaseMult(String phase, List<String> tags) {
    double m = 1;
    for (final t in tags) {
      final byPhase = q.phaseMult[t];
      if (byPhase != null) m *= byPhase[phase] ?? 1.0;
    }
    return m;
  }

  bool _out2080(GameState s, String g) {
    final v = s.gauges[g] ?? 50;
    return v < 20 || v > 80;
  }

  bool _alarmPending(GameState s, String g) => s.scheduled.any((sc) => sc.kind == 'alarme' && sc.payload['gauge'] == g);

  Card? pickPool(GameState s, String phase, EvalContext c, Rng rng) {
    final n = s.ncards;
    final bands = <int, List<Card>>{};
    final bandW = <int, List<double>>{};
    for (final card in content.poolCards(s.role)) {
      if (s.scheduled.any((sc) => sc.card == card.id)) continue; // no queue-jumping
      final last = s.cooldowns[card.id];
      if (last != null && card.once) continue;
      if (last != null && n - last < card.cooldown) continue;
      final retorse = card.tags.contains('retorse');
      if (retorse && s.pression < 4) continue;
      if (!evalWhen(card.when, c.withCard(card))) continue;
      double w = card.weight;
      w *= phaseMult(phase, card.tags);
      if (retorse && s.pression >= 8) w *= 1.25;
      if (last != null && n - last < 15) w *= 0.1;
      if (card.arc == s.lastTheme) w *= 0.5;
      final sp = card.speaker;
      if (sp != null) {
        if (sp == s.lastSpeaker) w *= 0.5;
        w *= faceFactor(s, sp);
      }
      for (final tag in card.tags) {
        if (tag.startsWith('rescue:')) {
          final g = tag.substring(7);
          if (_out2080(s, g) && !_alarmPending(s, g)) w *= 3;
        } else if (tag.startsWith('risk:')) {
          final g = tag.substring(5);
          if (_out2080(s, g)) w *= 0.5;
        } else if (tag == 'piege') {
          w *= s.centeredStreak >= 12 ? 4 : 0.25;
        }
      }
      if (s.tension >= 2 && card.tone != 'leger') w *= 0.25;
      if (w <= 0) continue;
      (bands[card.priority] ??= []).add(card);
      (bandW[card.priority] ??= []).add(w);
      lastCandidates.add(Candidate(0, card.id, w));
    }
    if (bands.isEmpty) return null;
    final top = bands.keys.reduce(math.max); // `priority` read at last: highest eligible band wins
    final i = rng.weightedIndex(bandW[top]!);
    return i < 0 ? null : bands[top]![i];
  }

  Card? pickNouvelle(GameState s, EvalContext c, Rng rng) {
    final n = s.ncards;
    final cands = <Card>[];
    final w = <double>[];
    for (final card in content.nouvelles(s.role)) {
      if (s.scheduled.any((sc) => sc.card == card.id)) continue;
      final last = s.cooldowns[card.id];
      if (last != null && card.once) continue;
      if (last != null && n - last < card.cooldown) continue;
      if (!evalWhen(card.when, c.withCard(card))) continue;
      cands.add(card);
      w.add(card.weight * faceFactor(s, card.speaker));
    }
    if (cands.isEmpty) return null;
    final i = rng.weightedIndex(w);
    return i < 0 ? null : cands[i];
  }

  // ---------------------------------------------------------------------------
  // Missing an entry → « Nouvelles du passé » (spec §1.10).
  // ---------------------------------------------------------------------------

  void miss(GameState s, Scheduled sc, String reason, EvalContext c) {
    s.scheduled.remove(sc);
    s.stats['miss_$reason'] = (s.stats['miss_$reason'] ?? 0) + 1;
    ArcDef? arc;
    if (sc.arc != null) {
      arc = content.arcs[sc.arc];
      final step = arc?.stepById(sc.step ?? '');
      if (reason == 'perimee' && arc != null && step != null && step.onExpire == 'skip') {
        final nx = _firstNext(step, c);
        if (nx == null) {
          arcDone(s, arc.id);
        } else {
          enqueueNext(s, arc, nx, c);
        }
        return;
      }
      if (sc.kind != 'script') {
        final st = s.arcs[sc.arc!] ??= ArcState();
        st.status = 'abandonne';
        st.reason = reason;
      }
    }
    if (sc.fallback == 'nouvelles' &&
        const {'club', 'annulee', 'perimee'}.contains(reason) &&
        content.cards.containsKey(kNouvellesDuPasse)) {
      final title = arc?.title ?? content.cards[sc.card]?.title ?? 'une vieille histoire';
      s.entities.named['passe_titre'] = title;
      final line = arc?.epilogue['journal'];
      if (line is String && line.isNotEmpty) addJournal(s, line, kind: 'arc', poids: 2, tags: _arcTags(arc!), arc: arc.id);
      enqueue(
        s,
        Scheduled(
          card: kNouvellesDuPasse,
          kind: 'passe',
          dueN: s.ncards,
          deadlineN: s.ncards + 3,
          fallback: 'drop',
          sameClub: false,
          payload: {'epilogue': arc?.epilogue ?? const <String, dynamic>{}, 'passe_titre': title},
        ),
      );
    }
  }

  NextDef? _firstNext(StepDef step, EvalContext c) {
    for (final nx in step.next) {
      if (nx.ifWhen == null || evalWhen(nx.ifWhen, c)) return nx;
    }
    return null;
  }

  void enqueueNext(GameState s, ArcDef arc, NextDef nx, EvalContext c) {
    final target = arc.stepById(nx.step);
    if (target == null || target.card.isEmpty) {
      arcDone(s, arc.id);
      return;
    }
    final fuse = nx.isLongFuse;
    enqueue(
      s,
      Scheduled(
        card: resolveVariant(target, c),
        kind: arc.entryKind,
        arc: arc.id,
        step: target.id,
        // Fusée longue : en attente jusqu'à l'ouverture de la saison visée.
        dueN: fuse ? -1 : s.ncards + nx.inMin,
        deadlineN: fuse ? -1 : s.ncards + nx.inMax,
        expireSeason: !fuse && (nx.thisSeason || target.thisSeason) ? s.season : null,
        fallback: arc.fallback,
        cancelIf: arc.cancelIf,
        sameClub: arc.sameClub,
        atSeason: fuse ? s.season + nx.atSeason! : null,
        atSlot: fuse ? List.of(nx.at ?? const [1, 3]) : null,
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Serving (spec §1.11).
  // ---------------------------------------------------------------------------

  Pending serve(GameState s, Scheduled? sc, String phase, Rng rng, {required int band, Card? card, bool forced = false}) {
    card ??= content.cards[sc!.card]!;
    final n = s.ncards;
    if (sc != null) s.scheduled.remove(sc);
    final kind = sc?.kind ?? card.kind;
    if (_storyKinds.contains(kind)) {
      s.lastStoryN = n;
      s.storyThisSeason += 1;
    }
    if (band == 2 && sc?.kind == 'etape') s.softStepsThisSeason += 1;
    String? unlockedStory;
    if (sc != null && sc.arc != null && const {'script', 'etape', 'evenement'}.contains(sc.kind)) {
      final st = s.arcs[sc.arc!] ??= ArcState(status: 'active', startedSeason: s.season);
      // Bandeau « Nouvelle histoire » (spec variété §3.8) : première étape d'une
      // intrigue jamais jouée jusqu'au bout.
      final arcDef = content.arcs[sc.arc!];
      if (sc.kind == 'etape' && arcDef != null && arcDef.kind == 'serie' && st.plays == 0 && arcDef.steps.isNotEmpty && arcDef.steps.first.id == sc.step) {
        unlockedStory = arcDef.title ?? arcDef.id;
      }
      st.status = 'active';
      s.lastArcId = sc.arc;
      if (sc.kind == 'script') {
        final step = content.arcs[sc.arc!]?.stepById(sc.step ?? '');
        if (step != null && !step.repeatable) s.playedSteps.add('${sc.arc}/${sc.step}');
      }
    }
    if (sc?.kind == 'alarme') s.alarmsServed[sc!.payload['gauge'] as String? ?? ''] = n;
    if (card.kind == 'nouvelle') s.nouvellesThisSeason += 1;
    if (card.tone == 'drame') {
      s.drames += 1;
      s.lastWasDrame = true;
    } else {
      s.lastWasDrame = false;
    }
    s.tension = card.tone == 'leger' ? 0 : s.tension + 1;
    s.toneCounts[card.tone] = (s.toneCounts[card.tone] ?? 0) + 1;
    s.cooldowns[card.id] = n;
    s.seenCount[card.id] = (s.seenCount[card.id] ?? 0) + 1;
    final sp = card.speaker;
    if (sp != null) {
      s.lastSeenChar[sp] = n;
      s.speakerSeen[sp] = (s.speakerSeen[sp] ?? 0) + 1;
      s.recentSpeakers.add(sp);
      while (s.recentSpeakers.length > 3) {
        s.recentSpeakers.removeAt(0);
      }
    }
    s.lastSpeaker = sp;
    s.lastTheme = card.arc;
    // Each « Nouvelles du passé » names its own affair, even when several are queued.
    final passeTitre = sc?.payload['passe_titre'];
    if (passeTitre is String) s.entities.named['passe_titre'] = passeTitre;
    final extra = <String, dynamic>{
      ...?(sc?.payload),
      'phase': phase,
      'band': band,
      'kind': kind,
      if (sc?.arc != null) 'arc': sc!.arc,
      if (sc?.step != null) 'step': sc!.step,
      'tone': card.tone,
      if (forced) 'forced': true,
      if (unlockedStory != null) 'unlocked_story': unlockedStory,
    };
    return toPending(s, card, phase, rng, extra);
  }

  // ---------------------------------------------------------------------------
  // After the swipe: arc progression and relation thresholds (spec §1.6).
  // ---------------------------------------------------------------------------

  void afterNarrative(GameState s, Pending p, bool right) {
    final card = content.cards[p.id];
    if (card == null) return;
    final arcId = p.payload['arc'] as String?;
    final stepId = p.payload['step'] as String?;
    if (arcId == null) return;
    final arc = content.arcs[arcId];
    if (arc == null) return;
    final st = s.arcs[arcId] ??= ArcState(status: 'active', startedSeason: s.season);
    st.status = 'active';
    st.step = stepId;
    st.lastN = s.ncards;
    final c = ctx(s, p.payload['phase'] as String? ?? '', card: card);
    final ch = right ? card.right : card.left;
    final explicit = ch.effects.arcNext;
    if (explicit != null) {
      if (explicit.kind == 'end') {
        arcDone(s, arcId);
      } else if (explicit.kind == 'abort') {
        arcAbort(s, arcId);
      } else {
        enqueueNext(
          s,
          arc,
          NextDef(
            step: explicit.step!,
            inMin: explicit.inMin,
            inMax: explicit.inMax,
            thisSeason: explicit.thisSeason,
            atSeason: explicit.atSeason,
            at: explicit.at,
          ),
          c,
        );
      }
      return;
    }
    final step = arc.stepById(stepId ?? '');
    if (step == null) return;
    // L'issue de l'étape (celle des effets du choix a déjà été posée par _applyEffects).
    if (step.outcome != null) st.outcome = step.outcome;
    if (step.at != null) return; // script anchors are queued by openSeason, not by `next`
    final nx = _firstNext(step, c);
    if (nx == null) {
      arcDone(s, arcId);
    } else {
      enqueueNext(s, arc, nx, c);
    }
  }

  /// Queue betrayal / favour / Camille tier cards when a relation crosses a
  /// character's `on_relation` threshold.
  void relationCrossings(GameState s, Map<String, int> before, String phase) {
    final c = ctx(s, phase);
    for (final ch in content.charactersSorted) {
      final b = before[ch.id] ?? 0;
      final a = s.relations[ch.id] ?? 0;
      if (a == b) continue;
      if (a <= -3) s.enemies.add(ch.id);
      final thresholds = ch.onRelation.keys.toList()..sort();
      for (final t in thresholds) {
        final crossed = t < 0 ? (b > t && a <= t) : (t > 0 && b < t && a >= t);
        if (!crossed) continue;
        if (t == -3 || t == 3) {
          addJournalAuto(s, t < 0 ? 'palier_moins3' : 'palier_plus3',
              kind: 'palier', poids: 2, tags: [ch.id], extra: {'perso': ch.name, 'perso_tic': ch.tic});
        }
        final variants = ch.onRelation[t]!;
        String? cardId;
        for (final v in variants) {
          if (v.ifWhen == null || evalWhen(v.ifWhen, c)) {
            cardId = v.id;
            break;
          }
        }
        cardId ??= variants.last.id;
        if (!content.cards.containsKey(cardId)) continue;
        if ((s.seenCount[cardId] ?? 0) > 0) continue;
        if (s.scheduled.any((sc) => sc.card == cardId)) continue;
        enqueue(
          s,
          Scheduled(
            card: cardId,
            kind: 'palier',
            dueN: s.ncards + 1,
            deadlineN: s.ncards + 3,
            fallback: 'drop',
            sameClub: false,
            payload: {'character': ch.id, 'threshold': t},
          ),
        );
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Season opening (spec §1.12).
  // ---------------------------------------------------------------------------

  void openSeason(GameState s, Rng rng) {
    s.slot = 0;
    s.seasonStartN = s.ncards;
    s.storyThisSeason = 0;
    s.softStepsThisSeason = 0;
    s.eventsThisSeason = 0;
    s.alarmsThisSeason = 0;
    s.nouvellesThisSeason = 0;
    s.toneCounts = {};
    s.tension = 0;
    s.openingSlots = [];
    // Réactions (spec variété §1.4) : le compteur repart ; une réaction en
    // attente a déjà été servie avant l'ouverture (règle 5), jamais perdue.
    s.reactionsThisSeason = 0;
    s.reaction = null;
    // Compaction de l'Almanach de la saison précédente (spec variété §1.7).
    if (s.season > 0) compactJournal(s, s.season - 1);
    final c = ctx(s, 'presaison');
    for (final sc in List.of(s.scheduled)) {
      if (sc.expireSeason != null && sc.expireSeason! < s.season) miss(s, sc, 'perimee', c);
    }
    // Fusées longues arrivées à leur saison : elles reçoivent leur fenêtre absolue.
    for (final sc in s.scheduled) {
      if (sc.atSeason == null || sc.atSeason! > s.season) continue;
      final at = sc.atSlot ?? const [1, 3];
      sc.dueN = s.seasonStartN + at.first;
      sc.deadlineN = s.seasonStartN + at.last;
      sc.atSeason = null;
      sc.atSlot = null;
    }
    final post = content.postulats[s.postulatId];
    final openingId = (post != null && post.role == s.role) ? (post.openingArc ?? kGenericArc) : kGenericArc;
    final arc = content.arcs[openingId];
    if (arc != null && arc.roles.contains(s.role)) {
      final st = s.arcs[arc.id] ??= ArcState(status: 'active', startedSeason: s.season);
      if (st.status != 'done' && st.status != 'abandonne') {
        for (final step in arc.steps) {
          if (step.at == null || !step.appliesTo(s.season) || step.card.isEmpty) continue;
          if (!step.repeatable && s.playedSteps.contains('${arc.id}/${step.id}')) continue;
          enqueue(
            s,
            Scheduled(
              card: resolveVariant(step, c),
              kind: 'script',
              arc: arc.id,
              step: step.id,
              dueN: s.seasonStartN + step.at![0],
              deadlineN: s.seasonStartN + step.at![1],
              expireSeason: s.season,
              fallback: 'drop',
              sameClub: arc.sameClub,
            ),
          );
        }
      }
    }
    final prog = programmeOf(s);
    if (prog != null) {
      // Le tirage de saison (spec variété §1.2) : réservoir, fenêtres tirées,
      // réserve, fil rouge. Consommation Rng : ≤ prendre weightedIndex,
      // ≤ prendre nextInt, puis 1 weightedIndex si `questions`.
      _drawProgramme(s, c, rng, post!, prog);
      return;
    }
    if (post != null && post.role == s.role) {
      for (final seed in post.seeds) {
        if (seed.season != s.season) continue;
        if (seed.ifWhen != null && !evalWhen(seed.ifWhen, c)) continue;
        if (s.arcs.containsKey(seed.arc)) continue;
        final a = content.arcs[seed.arc];
        if (a == null || !a.roles.contains(s.role)) continue;
        armArc(s, a, c, dueN: s.seasonStartN + seed.atMin, deadlineN: s.seasonStartN + seed.atMax);
      }
    }
    // Sans programme, les rituels sont armés d'office ; avec, ils sont tirés
    // comme les autres intrigues (sinon ils doubleraient le tirage).
    for (final a in content.arcsSorted) {
      if (!a.isEverySeason || !a.roles.contains(s.role) || s.season < a.minSeason) continue;
      if (s.arcs[a.id]?.doneSeason == s.season) continue;
      if (!evalWhen(a.when, c)) continue;
      final prev = s.arcs.remove(a.id);
      if (prev != null) s.arcs[a.id] = prev; // armArc conserve plays/outcome
      armArc(s, a, c, dueN: s.seasonStartN + a.startMin, deadlineN: s.seasonStartN + a.startMax);
    }
  }

  /// Poids d'un candidat à un tour du tirage (spec variété §1.2).
  double _poolWeight(GameState s, ProgEntry e, ArcDef a, Set<String> carriers, Set<String> themes, bool signatureTaken) {
    if (a.carrierId.isNotEmpty && carriers.contains(a.carrierId)) return 0;
    if (a.themeId.isNotEmpty && themes.contains(a.themeId)) return 0;
    double x = e.poids;
    if (e.signature && s.season == 0 && !signatureTaken) x *= 3.0;
    if (a.themeId.isNotEmpty && !s.themesPlayed.contains(a.themeId)) x *= 1.5;
    if ((s.arcs[a.id]?.plays ?? 0) > 0) x *= 0.6;
    if (a.carrierId.isNotEmpty && s.carriersLastSeason[a.carrierId] == s.season - 1) x *= 0.5;
    return x;
  }

  void _drawProgramme(GameState s, EvalContext c, Rng rng, PostulatDef post, ProgrammeDef programme) {
    final prog = programme.bucketFor(s.season);
    if (prog != null) {
      // Ce qui continue de la saison précédente (porteurs et thèmes réservés).
      final carriers = _carriersInPlay(s);
      final themes = <String>{};
      int carry = 0;
      final ids = s.arcs.keys.toList()..sort();
      for (final id in ids) {
        final st = s.arcs[id]!;
        if (st.status != 'armed' && st.status != 'active') continue;
        final a = content.arcs[id];
        if (a == null || a.kind != 'serie' || !a.foreground || !a.roles.contains(s.role)) continue;
        carry += 1;
        if (a.themeId.isNotEmpty) themes.add(a.themeId);
      }
      final k = math.max(0, prog.prendre - carry);
      // Candidats : ordre du fichier, bucket courant puis reprise.
      final cands = <ProgEntry>[];
      final seen = <String>{};
      for (final e in programme.entriesWithReprise(s.season)) {
        if (!seen.add(e.arc)) continue;
        if (!_poolEligible(s, e, c, carriers)) continue;
        cands.add(e);
      }
      // Tirage sans remise, pondéré : k weightedIndex au plus.
      final taken = <ProgEntry>[];
      bool signatureTaken = false;
      for (var i = 0; i < k; i++) {
        if (cands.isEmpty) break;
        final w = [for (final e in cands) _poolWeight(s, e, content.arcs[e.arc]!, carriers, themes, signatureTaken)];
        final j = rng.weightedIndex(w);
        if (j < 0) break;
        final e = cands.removeAt(j);
        taken.add(e);
        final a = content.arcs[e.arc]!;
        if (a.carrierId.isNotEmpty) carriers.add(a.carrierId);
        if (a.themeId.isNotEmpty) themes.add(a.themeId);
        if (e.signature) signatureTaken = true;
      }
      // Fenêtre d'ouverture tirée, dans l'ordre du tirage : k nextInt au plus.
      final anchors = _singleSlotAnchors(s);
      final lo = prog.fenetre.first;
      final hi = prog.fenetre.last;
      for (final e in taken) {
        final u0 = lo + rng.nextInt(hi - lo + 1);
        final u = freeSlot(u0, [...s.openingSlots, ...anchors], prog.fenetre, ecart: q.ouvertureEcart);
        s.openingSlots.add(u);
        armArc(s, content.arcs[e.arc]!, c, dueN: s.seasonStartN + u, deadlineN: s.seasonStartN + u + 2);
      }
      // Réserve : les premiers candidats restants, dans l'ordre du fichier, triés.
      s.reserve = [for (final e in cands.take(prog.reserve)) e.arc]..sort();
    }
    // Fil rouge : 1 weightedIndex si le postulat pose des questions.
    if (post.questions.isNotEmpty) {
      final qi = rng.weightedIndex([for (final x in post.questions) x.poids]);
      if (qi >= 0) {
        s.vars['fil_rouge_i'] = qi;
        s.entities.named['fil_rouge'] = post.questions[qi].id;
      }
    }
  }

  /// Slots des ancres de script à créneau unique déjà en file pour cette
  /// saison, hors l'ancre d'ouverture (slot 1) : c'est l'ouverture de la
  /// saison, pas une ouverture d'intrigue, et une intrigue peut commencer
  /// juste après elle (annexe A de la spec : le kop au slot 3 à côté de A1) ;
  /// les ancres pivots (16, 17) restent protégées.
  List<int> _singleSlotAnchors(GameState s) {
    final out = <int>[];
    for (final sc in s.scheduled) {
      if (sc.kind != 'script' || sc.dueN < 0) continue;
      final slot = sc.dueN - s.seasonStartN;
      if (sc.dueN == sc.deadlineN && slot > 1) out.add(slot);
    }
    out.sort();
    return out;
  }
}

/// Le slot d'ouverture retenu à partir du slot tiré `u` (spec variété §1.2),
/// sans aléa : tant qu'un slot de `taken` est à moins de `ecart`, on avance
/// d'un slot ; au-delà de `maxSlot` (ou de `fenetre[1] + ecart`) on repart du
/// plafond et on recule jusqu'à un slot libre ; à défaut, `u` tel quel.
int freeSlot(int u, List<int> taken, List<int> fenetre, {int ecart = 3, int maxSlot = 15}) {
  bool busy(int x) => taken.any((t) => (x - t).abs() < ecart);
  final cap = math.min(maxSlot, fenetre.last + ecart);
  var x = u;
  while (x <= cap && busy(x)) {
    x += 1;
  }
  if (x <= cap) return x;
  x = cap;
  while (x >= 1 && busy(x)) {
    x -= 1;
  }
  return x >= 1 ? x : u;
}

/// Effects of a « Nouvelles du passé » card come from the arc's `epilogue`.
EffectSet epilogueEffects(Map<String, dynamic> extra) {
  final ep = extra['epilogue'];
  if (ep is Map) return EffectSet.fromJson(ep.cast<String, dynamic>());
  return const EffectSet();
}
