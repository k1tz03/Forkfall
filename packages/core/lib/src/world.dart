/// Match resolution. There is no simulation engine: a match is a card.
/// A Carte Match resolves a block of six games with a weighted draw; a Grand
/// Match is three live "temps forts"; the Bilan turns points into a rank via a
/// per-division table (docs/brainstorm section 0.6 and 2.4/2.5).
library;

import 'rng.dart';

int _clamp(int v, int lo, int hi) => v < lo ? lo : (v > hi ? hi : v);
double _clampD(double v, double lo, double hi) => v < lo ? lo : (v > hi ? hi : v);

int divisionBaseForce(int division) => division <= 1 ? 62 : 44;

/// Probability of winning a single game, per the bible formula.
double pWin(int force, int oppForce, Map<String, int> gauges, {double postureMod = 0}) {
  double p = 0.40 + (force - oppForce) / 150.0 + postureMod;
  if ((gauges['vestiaire'] ?? 50) >= 70) p += 0.06;
  if ((gauges['vestiaire'] ?? 50) <= 30) p -= 0.10;
  if ((gauges['tribunes'] ?? 50) <= 25) p -= 0.04;
  if ((gauges['direction'] ?? 50) <= 20) p -= 0.03;
  return _clampD(p, 0.10, 0.80);
}

double pNul(int force, int oppForce) => _clampD(0.25 - (force - oppForce).abs() / 400.0, 0.05, 0.30);

class BlockResult {
  final String results; // e.g. "V N V D V V"
  final int wins;
  final int draws;
  final int losses;
  final int points;
  final int derbyGainT;
  const BlockResult(this.results, this.wins, this.draws, this.losses, this.points, this.derbyGainT);
}

/// Resolve a block of six league games. [postureMod] comes from the chosen
/// posture (Offensif / Prudent).
BlockResult resolveBlock(Rng rng, int force, int division, Map<String, int> gauges, {double postureMod = 0}) {
  int w = 0, d = 0, l = 0, pts = 0;
  final letters = <String>[];
  for (int i = 0; i < 6; i++) {
    final opp = divisionBaseForce(division) + rng.range(-10, 10);
    final pw = pWin(force, opp, gauges, postureMod: postureMod);
    final pn = pNul(force, opp);
    final roll = rng.nextDouble();
    if (roll < pw) {
      w++;
      pts += 3;
      letters.add('V');
    } else if (roll < pw + pn) {
      d++;
      pts += 1;
      letters.add('N');
    } else {
      l++;
      letters.add('D');
    }
  }
  return BlockResult(letters.join(' '), w, d, l, pts, 0);
}

class CupResult {
  final bool won;
  final String scoreline;
  const CupResult(this.won, this.scoreline);
}

CupResult resolveCupTie(Rng rng, int force, Map<String, int> gauges) {
  // Opponent drawn from anywhere: 20% forced two-division gap.
  final gap = rng.nextDouble() < 0.20;
  final opp = (gap ? 70 : 52) + rng.range(-8, 8);
  final pw = pWin(force, opp, gauges);
  final won = rng.nextDouble() < pw;
  final gf = won ? rng.range(1, 3) : rng.range(0, 1);
  final ga = won ? rng.range(0, gf - 1 < 0 ? 0 : gf - 1) : rng.range(1, 3);
  return CupResult(won, '$gf-$ga');
}

/// Live temps-fort probability (Grand Match). [choiceMod] is -0.15/0/+0.15
/// for SÛR / ÉQUILIBRÉ / RISQUÉ.
double pTempsFort(int force, int oppForce, Map<String, int> gauges, int parole, {double choiceMod = 0}) {
  double p = 0.50 + choiceMod + (force - oppForce) / 150.0;
  if ((gauges['vestiaire'] ?? 50) >= 70) p += 0.05;
  if (parole >= 3) p += 0.05;
  return _clampD(p, 0.08, 0.92);
}

class SeasonVerdict {
  final int rank;

  /// titre / europe / montee / barrage / maintien / descente / lanterne.
  /// `descente` n'existe qu'en Division 1 (le jeu n'a pas d'étage sous la
  /// Division 2) ; `lanterne` est la dernière place de Division 2 : même
  /// facture qu'une descente, objectif « maintien » manqué, mais le club ne
  /// change pas de division et aucune manchette ne peut titrer « descend ».
  final String outcome;
  final Map<String, int> gaugeEffects;
  final int forceEffect;
  final bool objectiveMet;
  const SeasonVerdict(this.rank, this.outcome, this.gaugeEffects, this.forceEffect, this.objectiveMet);

  /// Le club descend d'une division à l'application du verdict.
  bool get relegated => outcome == 'descente';

  /// Le club monte d'une division à l'application du verdict.
  bool get promoted => outcome == 'montee';
}

/// Les issues qu'un verdict peut porter (lint des manchettes : `bilan.outcome == '…'`).
const Set<String> kVerdictOutcomes = {'titre', 'europe', 'montee', 'barrage', 'maintien', 'descente', 'lanterne'};

/// Convert season points (max 108 over six blocks) into a rank + outcome via a
/// per-division table, and derive the effects and whether the objective held.
/// Pure : the caller applies (or not) the effects — the Une reads it without
/// applying it (spec variété §1.6).
SeasonVerdict seasonVerdict(int division, int pts, String objectiveTarget) {
  String outcome;
  int rank;
  if (division <= 1) {
    if (pts >= 82) {
      outcome = 'titre';
      rank = 1;
    } else if (pts >= 70) {
      outcome = 'europe';
      rank = 4;
    } else if (pts <= 38) {
      outcome = 'descente';
      rank = 18;
    } else {
      outcome = 'maintien';
      rank = _clamp(18 - ((pts - 38) ~/ 4), 5, 17);
    }
  } else {
    if (pts >= 72) {
      outcome = 'montee';
      rank = 1;
    } else if (pts >= 64) {
      outcome = 'barrage';
      rank = 4;
    } else if (pts <= 36) {
      // Dernier de Division 2 : il n'y a pas d'étage en dessous. La facture
      // est celle d'une descente, sans changement de division.
      outcome = 'lanterne';
      rank = 18;
    } else {
      outcome = 'maintien';
      rank = _clamp(18 - ((pts - 36) ~/ 4), 5, 17);
    }
  }

  final effects = <String, int>{};
  int forceEffect = 0;
  switch (outcome) {
    case 'titre':
      effects['tribunes'] = 20;
      effects['direction'] = 15;
      effects['caisse'] = 10;
      break;
    case 'montee':
      effects['tribunes'] = 12;
      effects['direction'] = 12;
      effects['caisse'] = 8;
      forceEffect = 0; // opponents get stronger next season, handled elsewhere
      break;
    case 'europe':
      effects['caisse'] = 10;
      effects['vestiaire'] = -4;
      break;
    case 'descente':
    case 'lanterne':
      effects['tribunes'] = -15;
      effects['direction'] = -25;
      effects['caisse'] = -15;
      forceEffect = -8;
      break;
    case 'barrage':
      effects['direction'] = -2;
      break;
    case 'maintien':
      // A quiet mid-table is a trap: nothing at all.
      break;
  }

  final met = _objectiveMet(objectiveTarget, outcome, rank);
  if (met) {
    effects['direction'] = (effects['direction'] ?? 0) + 15;
  } else if (outcome != 'descente' && outcome != 'lanterne') {
    // A relegation (or the last place of Division 2) already IS the missed
    // objective: its own bill (−25 direction, −15 tribunes) is not stacked with
    // the −20/−10 of a missed target, which used to take a 40-direction
    // president straight to the SMS.
    effects['direction'] = (effects['direction'] ?? 0) - 20;
    effects['tribunes'] = (effects['tribunes'] ?? 0) - 10;
  }
  return SeasonVerdict(rank, outcome, effects, forceEffect, met);
}

bool _objectiveMet(String target, String outcome, int rank) {
  switch (target) {
    case 'maintien':
      return outcome != 'descente' && outcome != 'lanterne';
    case 'top10':
      return rank <= 10;
    case 'top5':
      return rank <= 5 || outcome == 'europe' || outcome == 'titre';
    case 'europe':
      return outcome == 'europe' || outcome == 'titre';
    case 'montee':
      return outcome == 'montee' || outcome == 'titre';
    case 'titre':
      return outcome == 'titre';
    default:
      return outcome != 'descente' && outcome != 'lanterne';
  }
}

/// Le libellé de l'objectif avec son article, pour une phrase (« l'objectif,
/// c'est le maintien »).
String objectiveLabelWithArticleFr(String target) {
  switch (target) {
    case 'maintien':
      return 'le maintien';
    case 'top10':
      return 'le Top 10';
    case 'top5':
      return 'le Top 5';
    case 'europe':
      return 'la qualification continentale';
    case 'montee':
      return 'la montée';
    case 'titre':
      return 'le titre';
    default:
      return 'le maintien';
  }
}

String objectiveLabelFr(String target) {
  switch (target) {
    case 'maintien':
      return 'Maintien';
    case 'top10':
      return 'Top 10';
    case 'top5':
      return 'Top 5';
    case 'europe':
      return 'Qualification continentale';
    case 'montee':
      return 'La montée';
    case 'titre':
      return 'Le titre';
    default:
      return 'Maintien';
  }
}

/// Pick a season objective one notch above the club's strength (source of
/// difficulty), scaled by Pression.
String pickObjective(int division, int pression, Rng rng) {
  if (division <= 1) {
    if (pression >= 6) return rng.nextDouble() < 0.5 ? 'europe' : 'titre';
    return rng.nextDouble() < 0.5 ? 'top10' : 'top5';
  } else {
    if (pression >= 6) return 'montee';
    return rng.nextDouble() < 0.6 ? 'maintien' : 'montee';
  }
}
