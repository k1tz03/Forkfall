/// Le classement du championnat.
///
/// Retour joueur : « parfois on parle de classement mais cela n'est indiqué
/// nulle part, aucune carte avec le classement n'apparaît ». Les cartes citent
/// le rang depuis toujours (`{rang}`, les manchettes, le Verdict) sans que le
/// joueur ne voie jamais un tableau. Ce module fabrique ce tableau.
///
/// Trois règles, dans cet ordre :
///
/// 1. **Ta ligne fait foi, et elle vient du moteur.** Ton club est posé au rang
///    `world.standingRank` avec `world.pts` — les deux valeurs que
///    `world.dart` calcule déjà (`_updateProvisionalRank` après chaque bloc,
///    `seasonVerdict` au Bilan). Le classement ne rejoue pas le championnat :
///    il le met en page.
/// 2. **Les rivaux sont construits AUTOUR de toi.** Un championnat se lit en
///    écarts : deux à trois points par place au milieu, davantage en tête et
///    en queue. On part de ta ligne et on écarte, place par place. C'est ce
///    qui garantit que le tableau est cohérent quel que soit ton rang — un
///    tirage indépendant, lui, finissait par te mettre 16e avec plus de points
///    que le 13e.
/// 3. **Zéro tirage sur le flux de la partie.** Noms, forces et grain sont
///    dérivés par hachage de la graine, du postulat et de la saison : rien
///    n'est stocké dans `GameState`, rien n'est consommé sur le `Rng` de la
///    carrière. Deux ouvertures du même écran donnent le même tableau, et le
///    classement ne déplace pas d'un pouce ce que la graine raconte.
library;

import 'rng.dart';

/// Les clubs d'une division (ton club compris) : la table de `world.dart`
/// descend jusqu'au 18e, c'est donc dix-huit.
const int kStandingsClubs = 18;

/// Journées par bloc (`resolveBlock`) et blocs par saison (le calendrier en
/// sert six : trois à l'aller, trois au retour). 6 × 6 × 3 = 108 points.
const int kGamesPerBlock = 6;
const int kBlocksPerSeason = 6;

/// Journées d'une saison complète.
const int kSeasonGames = kGamesPerBlock * kBlocksPerSeason;

/// Une ligne du classement, telle que la dessinent l'aperçu et l'app.
class StandingRow {
  final int rang;
  final String club;
  final int pts;
  final int diff;

  /// Ta ligne (une seule par tableau).
  final bool toi;

  const StandingRow({
    required this.rang,
    required this.club,
    required this.pts,
    required this.diff,
    this.toi = false,
  });

  Map<String, dynamic> toJson() => {'rang': rang, 'club': club, 'pts': pts, 'diff': diff, 'toi': toi};

  @override
  String toString() => '$rang. $club $pts pts ($diff)${toi ? ' ←' : ''}';
}

/// Les dix-sept clubs rivaux, tirés **une fois par carrière** dans les listes
/// de `content/names` (préfixe + ville, le même moule que ton club). Le rival
/// de la carrière (`entities.named['rival']`) ouvre la liste : le club dont
/// les cartes parlent doit se trouver au classement.
///
/// Le tirage passe par un `Rng` local semé par hachage — il ne touche jamais
/// le `Rng` de la partie. Un préfixe et une ville ne servent qu'un nombre
/// borné de fois : sans ça, une division entière s'appelait « Union », avec
/// trois clubs de la même ville.
List<String> rivalClubNames({
  required int seed,
  required String postulatId,
  required int division,
  required List<String> prefixes,
  required List<String> villes,
  required String monClub,
  String rivalClub = '',
}) {
  final out = <String>[];
  final pris = <String>{monClub};
  if (rivalClub.isNotEmpty && rivalClub != monClub) {
    out.add(rivalClub);
    pris.add(rivalClub);
  }
  if (prefixes.isEmpty || villes.isEmpty) return out;
  final rng = Rng(fnv1a32('classement|$seed|$postulatId|d$division'));
  final parPrefixe = <String, int>{};
  final parVille = <String, int>{};
  final maxParPrefixe = (kStandingsClubs / prefixes.length).ceil().clamp(2, 4);
  final maxParVille = (kStandingsClubs / villes.length).ceil().clamp(1, 3);
  // Borné : au pire on complète sans les quotas plutôt que de boucler.
  for (var garde = 0; out.length < kStandingsClubs - 1 && garde < 800; garde++) {
    final pre = prefixes[rng.nextInt(prefixes.length)];
    final ville = villes[rng.nextInt(villes.length)];
    final libre = garde >= 500;
    if (!libre && (parPrefixe[pre] ?? 0) >= maxParPrefixe) continue;
    if (!libre && (parVille[ville] ?? 0) >= maxParVille) continue;
    final nom = '$pre $ville';
    if (!pris.add(nom)) continue;
    parPrefixe[pre] = (parPrefixe[pre] ?? 0) + 1;
    parVille[ville] = (parVille[ville] ?? 0) + 1;
    out.add(nom);
  }
  while (out.length < kStandingsClubs - 1) {
    out.add('Club ${out.length + 1}');
  }
  return out;
}

/// L'écart cumulé, en points d'une saison entière, entre la première place et
/// la place [rang]. Une courbe de championnat : ~2,4 points par place au
/// milieu, la tête qui se détache et la queue qui décroche.
double _ecartCumule(int rang) {
  final x = (rang - 1).toDouble();
  return 2.4 * x + 0.07 * x * x;
}

/// La force d'un rival : elle ne sert qu'à ORDONNER les rivaux entre eux (leur
/// rang relatif), jamais à recalculer un championnat. Stable toute la
/// carrière ; le grain de la saison redistribue les places d'une année sur
/// l'autre, comme la vraie vie.
double _rangDeSaison(int seed, String postulatId, int season, int idx) {
  final base = Rng(fnv1a32('force|$seed|$postulatId|$idx')).nextDouble();
  final annee = Rng(fnv1a32('saison|$seed|$postulatId|$season|$idx')).nextDouble();
  return base * 0.75 + annee * 0.25;
}

/// La différence de buts, dérivée des points et des journées jouées : un club
/// à 82 points sur 36 journées est à peu près +24, un club à 20 points à peu
/// près −23. Le grain (±4) est déterministe.
int _diffOf(int pts, int played, String salt) {
  if (played <= 0) return 0;
  final base = ((pts - 1.4 * played) * 0.75).round();
  return base + Rng(fnv1a32('diff|$salt')).range(-4, 4);
}

/// Fabrique le classement complet, ton club à sa place.
///
/// [rank] et [pts] sont ceux du moteur (`world.standingRank`, `world.pts`) :
/// c'est la ligne qui fait foi, les autres sont construites autour d'elle.
List<StandingRow> buildStandings({
  required int seed,
  required String postulatId,
  required int season,
  required int division,
  required int blocks,
  required int rank,
  required int pts,
  required String monClub,
  required String rivalClub,
  required List<String> prefixes,
  required List<String> villes,
}) {
  final b = blocks.clamp(0, kBlocksPerSeason);
  final played = b * kGamesPerBlock;
  final noms = rivalClubNames(
    seed: seed,
    postulatId: postulatId,
    division: division,
    prefixes: prefixes,
    villes: villes,
    monClub: monClub,
    rivalClub: rivalClub,
  );
  // Ordre des rivaux entre eux : stable toute la saison, redistribué à la
  // saison suivante.
  final ordre = [for (var i = 0; i < noms.length; i++) i]
    ..sort((x, y) {
      final c = _rangDeSaison(seed, postulatId, season, y).compareTo(_rangDeSaison(seed, postulatId, season, x));
      return c != 0 ? c : noms[x].compareTo(noms[y]);
    });

  final n = noms.length + 1;
  final k = (rank - 1).clamp(0, n - 1); // index de TA ligne
  final monPts = pts.clamp(0, 3 * played);
  // Le facteur d'échelle : les écarts se creusent au fil des journées.
  final echelle = played / kSeasonGames;
  final ancre = _ecartCumule(k + 1);

  final clubCol = <String>[];
  final ptsCol = <int>[];
  var iRival = 0;
  for (var i = 0; i < n; i++) {
    if (i == k) {
      clubCol.add(monClub);
      ptsCol.add(monPts);
      continue;
    }
    final club = noms[ordre[iRival++]];
    // Ta ligne, plus l'écart de place à place : le 15e a moins de points que
    // le 14e, exactement comme dans un vrai tableau.
    final grain = Rng(fnv1a32('grain|$seed|$season|$club')).range(-2, 2) * echelle;
    final brut = monPts + (ancre - _ecartCumule(i + 1)) * echelle + grain;
    clubCol.add(club);
    ptsCol.add(brut.round().clamp(0, 3 * played));
  }
  // Recalage : la colonne des points décroît de haut en bas, ta ligne ne bouge
  // pas. Le grain ne peut donc jamais retourner deux places.
  for (var i = k - 1; i >= 0; i--) {
    if (ptsCol[i] < ptsCol[i + 1]) ptsCol[i] = ptsCol[i + 1];
  }
  for (var i = k + 1; i < n; i++) {
    if (ptsCol[i] > ptsCol[i - 1]) ptsCol[i] = ptsCol[i - 1];
  }
  final diffCol = [
    for (var i = 0; i < n; i++) _diffOf(ptsCol[i], played, i == k ? '$seed|$season|moi' : '$seed|$season|${clubCol[i]}'),
  ];
  // À points égaux, la différence de buts départage : elle décroît elle aussi.
  for (var i = k - 1; i >= 0; i--) {
    if (ptsCol[i] == ptsCol[i + 1] && diffCol[i] < diffCol[i + 1]) diffCol[i] = diffCol[i + 1];
  }
  for (var i = k + 1; i < n; i++) {
    if (ptsCol[i] == ptsCol[i - 1] && diffCol[i] > diffCol[i - 1]) diffCol[i] = diffCol[i - 1];
  }
  return [
    for (var i = 0; i < n; i++)
      StandingRow(rang: i + 1, club: clubCol[i], pts: ptsCol[i], diff: diffCol[i], toi: i == k),
  ];
}

/// Les six lignes autour de la tienne — le haut du tableau si tu es dans les
/// premiers, le bas si tu es dans les derniers.
List<StandingRow> standingsWindow(List<StandingRow> table, {int size = 6}) {
  if (table.length <= size) return List.of(table);
  final k = table.indexWhere((r) => r.toi);
  var start = (k < 0 ? 0 : k - 2);
  if (start < 0) start = 0;
  if (start + size > table.length) start = table.length - size;
  return table.sublist(start, start + size);
}
