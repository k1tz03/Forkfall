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

const Set<String> _storyKinds = {'script', 'etape', 'evenement', 'palier', 'chaine'};
const Set<String> _softKinds = {'etape', 'chaine', 'palier'};
const String kNouvellesDuPasse = 'tr.nouvelles_du_passe';
const String kGenericArc = 'co.script.generique';

class Director {
  final Content content;
  final PendingBuilder toPending;
  final FillerBuilder filler;

  /// What competed for the last slot (band, id, weight) — for authors/tools.
  List<Candidate> lastCandidates = [];

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
    s.scheduled.removeWhere((e) => e.arc == id && e.kind != 'script');
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
      if (sc.dueN > n) continue;
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

    // 2. Breathing: a reserved Nouvelle that is due (or owed), or wanted by tension.
    final reserved = q.nouvelleSlotsFor(s.role);
    final owed = reserved.where((k) => k <= s.slot).length - s.nouvellesThisSeason;
    final wantBreath = s.tension >= 2 && s.nouvellesThisSeason < reserved.length + 1;
    // Never two Nouvelles in a row (budget): a debt is carried to the next slot.
    if ((owed > 0 || wantBreath) && s.lastTheme != 'nouvelle') {
      final nv = pickNouvelle(s, c, rng);
      if (nv != null) return serve(s, null, phase, rng, band: 1, card: nv);
    }

    // 3. Steps inside their window (band 2): weighted.
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

    // 4. Forced cadence.
    if (n - s.lastStoryN > q.gapMax) {
      final sc = forceStory(s, c, rng);
      if (sc != null) return serve(s, sc, phase, rng, band: 2, forced: true);
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

  List<ArcDef> eligibleArcs(GameState s, EvalContext c) {
    final out = <ArcDef>[];
    for (final a in content.arcsSorted) {
      if (a.kind != 'serie' || !a.roles.contains(s.role)) continue;
      if (a.postulats.isNotEmpty && !a.postulats.contains(s.postulatId)) continue;
      final st = s.arcs[a.id];
      if (st != null && !(a.everySeason && st.doneSeason != s.season)) continue;
      if (!evalWhen(a.when, c)) continue;
      out.add(a);
    }
    return out;
  }

  void maintainArcs(GameState s, EvalContext c, Rng rng) {
    if (activeForeground(s) >= q.minActive) return;
    if (s.softStepsThisSeason >= q.softStepsMax) return;
    final el = eligibleArcs(s, c).where((a) => a.foreground).toList();
    if (el.isEmpty) return;
    final i = rng.weightedIndex(el.map((a) => a.weight).toList());
    if (i < 0) return;
    final a = el[i];
    armArc(s, a, c, dueN: s.ncards + a.startMin, deadlineN: s.ncards + a.startMax);
  }

  void armArc(GameState s, ArcDef arc, EvalContext c, {required int dueN, required int deadlineN}) {
    if (arc.steps.isEmpty) return;
    s.arcs[arc.id] = ArcState(status: 'armed', lastN: s.ncards, startedSeason: s.season);
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
    // (a) a step suspended by tension or the quota: serve it anyway.
    for (final sc in _sortedQueue(s)) {
      if (!_softKinds.contains(sc.kind) || sc.dueN > n || n >= sc.deadlineN) continue;
      final card = content.cards[sc.card];
      if (card == null) continue;
      if (card.tone == 'drame' && !drameAllowed(s)) continue;
      if (!evalWhen(card.when, c.withCard(card))) continue;
      return sc;
    }
    // (b) room for another arc: open one, first step due now.
    if (activeForeground(s) < q.maxActive) {
      final el = eligibleArcs(s, c);
      if (el.isNotEmpty) {
        final i = rng.weightedIndex(el.map((a) => a.weight).toList());
        if (i >= 0) {
          final a = el[i];
          armArc(s, a, c, dueN: n, deadlineN: n + math.max(1, a.startMax - a.startMin));
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
    enqueue(
      s,
      Scheduled(
        card: resolveVariant(target, c),
        kind: arc.entryKind,
        arc: arc.id,
        step: target.id,
        dueN: s.ncards + nx.inMin,
        deadlineN: s.ncards + nx.inMax,
        expireSeason: nx.thisSeason || target.thisSeason ? s.season : null,
        fallback: arc.fallback,
        cancelIf: arc.cancelIf,
        sameClub: arc.sameClub,
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
    if (sc != null && sc.arc != null && const {'script', 'etape', 'evenement'}.contains(sc.kind)) {
      final st = s.arcs[sc.arc!] ??= ArcState(status: 'active', startedSeason: s.season);
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
        enqueueNext(s, arc, NextDef(step: explicit.step!, inMin: explicit.inMin, inMax: explicit.inMax, thisSeason: explicit.thisSeason), c);
      }
      return;
    }
    final step = arc.stepById(stepId ?? '');
    if (step == null) return;
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

  void openSeason(GameState s) {
    s.slot = 0;
    s.seasonStartN = s.ncards;
    s.storyThisSeason = 0;
    s.softStepsThisSeason = 0;
    s.eventsThisSeason = 0;
    s.alarmsThisSeason = 0;
    s.nouvellesThisSeason = 0;
    s.toneCounts = {};
    s.tension = 0;
    final c = ctx(s, 'presaison');
    for (final sc in List.of(s.scheduled)) {
      if (sc.expireSeason != null && sc.expireSeason! < s.season) miss(s, sc, 'perimee', c);
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
    for (final a in content.arcsSorted) {
      if (!a.everySeason || !a.roles.contains(s.role) || s.season < a.minSeason) continue;
      if (s.arcs[a.id]?.doneSeason == s.season) continue;
      if (!evalWhen(a.when, c)) continue;
      s.arcs.remove(a.id);
      armArc(s, a, c, dueN: s.seasonStartN + a.startMin, deadlineN: s.seasonStartN + a.startMax);
    }
  }
}

/// Effects of a « Nouvelles du passé » card come from the arc's `epilogue`.
EffectSet epilogueEffects(Map<String, dynamic> extra) {
  final ep = extra['epilogue'];
  if (ep is Map) return EffectSet.fromJson(ep.cast<String, dynamic>());
  return const EffectSet();
}
