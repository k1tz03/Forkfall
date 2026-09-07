/// Les événements sonores : ce que le moteur donne à jouer au son.
///
/// Retour joueur : « un jeu sans univers musical est un jeu vide ». Le moteur
/// ne joue aucun son — il n'a ni horloge ni sortie audio, et il ne doit pas en
/// avoir : il **nomme** ce qui vient d'arriver, dans un vocabulaire fermé, et
/// la couche de rendu (l'aperçu, l'app) décide quoi jouer.
///
/// Deux listes, fermées toutes les deux :
///
/// · [kAmbiances] — le lieu où l'on se trouve, une seule valeur par carte ;
/// · [kSfxEvents] — ce qui se passe sur cette carte, plusieurs valeurs, TOUJOURS
///   rendues dans l'ordre de [kSfxEvents] (ordre stable : deux lectures de la
///   même carte donnent la même liste, dans le même ordre).
///
/// Tout est dérivé de ce que le moteur sait déjà — le beat, le `kind` de la
/// carte, ses tags, le camp du locuteur, les jauges en danger, le résultat du
/// dernier swipe. **Aucun tirage** : le son ne déplace pas ce que la graine
/// raconte.
library;

import 'state.dart';

/// Les lieux. Un et un seul par carte.
const List<String> kAmbiances = [
  'vestiaire',
  'tribune',
  'bureau',
  'couloir',
  'terrain',
  'ville',
  'maison',
  'presse',
  'nuit',
];

/// Les événements. L'ordre de cette liste EST l'ordre de sortie de [sfxOf].
const List<String> kSfxEvents = [
  'carte_arrivee',
  'choix_gauche',
  'choix_droite',
  'jauge_danger',
  'alarme',
  'reaction',
  'nouvelle',
  'une',
  'match_debut',
  'match_but',
  'match_encaisse',
  'sifflet_final',
  'tampon_fin',
  'classement',
  'palier_haut',
  'palier_bas',
  'promesse',
  'argent',
];

/// Le lieu d'un beat moteur, quand le beat le décide à lui seul.
const Map<String, String> _ambianceByBeat = {
  'match': 'terrain',
  'cup': 'terrain',
  'gm_annonce': 'terrain',
  'gm_te': 'terrain',
  'aftermatch': 'vestiaire',
  'bilan_une': 'presse',
  'classement': 'tribune',
  'objective': 'bureau',
  'bilan_verdict': 'bureau',
  'bilan_contrat': 'bureau',
  'bilan_carrefour': 'couloir',
  'ending': 'nuit',
};

/// Le lieu qu'un tag impose, par ordre de priorité (le premier tag présent
/// gagne). Les tags sont ceux de `content/tags.yaml`.
const List<List<String>> _ambianceByTag = [
  ['famille', 'maison'],
  ['presse', 'presse'],
  ['ultras', 'tribune'],
  ['tribunes', 'tribune'],
  ['arbitrage', 'terrain'],
  ['formation', 'terrain'],
  ['vestiaire', 'vestiaire'],
  ['mercato', 'bureau'],
  ['agents', 'bureau'],
  ['sponsors', 'bureau'],
  ['direction', 'bureau'],
  ['caisse', 'bureau'],
  ['scandale', 'presse'],
  ['decor', 'couloir'],
  ['gag', 'couloir'],
  ['objet', 'couloir'],
];

/// Le lieu par camp du locuteur (`characters.yaml`).
const Map<String, String> _ambianceByCamp = {
  'terrain': 'vestiaire',
  'direction': 'bureau',
  'instances': 'couloir',
  'selection': 'couloir',
};

/// Les tags qui font sonner l'argent.
const Set<String> _tagsArgent = {'caisse', 'sponsors', 'agents', 'mercato'};

/// Le lieu de la carte courante. Toujours une valeur de [kAmbiances].
String ambianceOf(GameState s, Pending p) {
  final beat = _ambianceByBeat[p.kind];
  // Une Carte Nouvelle, c'est le monde qui parle : la ville, la radio, le café.
  final kind = p.payload['kind'] as String? ?? '';
  if (kind == 'nouvelle' || kind == 'passe') return 'ville';
  if (beat != null) return beat;
  final tags = <String>{
    for (final t in (p.payload['tags'] as List?) ?? const []) t.toString(),
  };
  for (final pair in _ambianceByTag) {
    if (tags.contains(pair[0])) return pair[1];
  }
  if (kind == 'alarme') return 'couloir';
  final camp = p.payload['camp'] as String?;
  final byCamp = camp == null ? null : _ambianceByCamp[camp];
  if (byCamp != null) return byCamp;
  // Le prologue sans tag ni camp : on te fait entrer par le vestiaire.
  if (kind == 'prologue') return 'vestiaire';
  return 'couloir';
}

/// Ce que le dernier swipe a produit, lu dans `lastAnswer` — la seule phrase
/// que le moteur écrit après un swipe, et qu'il réécrit à chaque swipe. Les
/// préfixes sont ceux de `engine.dart` (`_resolveTempsFort`, `_resolveCup`) et
/// de `world.dart` (la ligne de résultats d'un bloc).
String? _resultatDuSwipe(String? lastAnswer) {
  final a = lastAnswer;
  if (a == null || a.isEmpty) return null;
  if (a.startsWith('Réussi')) return 'match_but';
  if (a.startsWith('Manqué')) return 'match_encaisse';
  if (a.startsWith('Coupe : victoire')) return 'match_but';
  if (a.startsWith('Coupe : éliminé')) return 'match_encaisse';
  // « Offensif — V N V D V V · 10 pts » : le bloc de six journées.
  if (a.contains(' pts') && a.contains('—')) {
    final v = ' V '.allMatches(' ${a.split('·').first} ').length;
    final d = ' D '.allMatches(' ${a.split('·').first} ').length;
    if (v > d) return 'match_but';
    if (d > v) return 'match_encaisse';
  }
  return null;
}

/// Les événements de la carte courante, dans l'ordre de [kSfxEvents].
List<String> sfxOf(GameState s, Pending p) {
  final on = <String>{'carte_arrivee'};
  final kind = p.payload['kind'] as String? ?? '';
  final tags = <String>{
    for (final t in (p.payload['tags'] as List?) ?? const []) t.toString(),
  };

  // Les deux sorties : une carte à un seul bouton n'a qu'un son de swipe.
  on.add('choix_gauche');
  if (!p.single) on.add('choix_droite');

  // Une jauge au bord du gouffre (ou du trop-plein) : le fond change de ton.
  if (s.gauges.values.any((v) => v <= 20 || v >= 80)) on.add('jauge_danger');

  switch (kind) {
    case 'alarme':
      on.add('alarme');
      break;
    case 'reaction':
      on.add('reaction');
      break;
    case 'nouvelle':
    case 'passe':
      on.add('nouvelle');
      break;
    case 'palier':
      final t = (p.payload['threshold'] as num?)?.toInt() ?? 0;
      on.add(t >= 0 ? 'palier_haut' : 'palier_bas');
      break;
  }

  switch (p.kind) {
    case 'objective':
      on.add('promesse');
      break;
    case 'match':
    case 'cup':
    case 'gm_annonce':
      on.add('match_debut');
      break;
    case 'aftermatch':
      on.add('sifflet_final');
      break;
    case 'bilan_une':
      on.add('une');
      break;
    case 'classement':
      on.add('classement');
      break;
    case 'ending':
      on.add('tampon_fin');
      break;
  }

  // Le résultat de ce que tu viens de faire, joué à l'arrivée de la carte
  // suivante — c'est là que la bannière de réponse s'affiche.
  final res = _resultatDuSwipe(s.lastAnswer);
  if (res != null) on.add(res);

  // L'argent : les tags qui en parlent, ou une sortie qui touche la caisse.
  final touchesCaisse = (p.leftEffects.gauges['caisse'] ?? 0) != 0 || (p.rightEffects.gauges['caisse'] ?? 0) != 0;
  if (tags.any(_tagsArgent.contains) || touchesCaisse) on.add('argent');

  return [for (final e in kSfxEvents) if (on.contains(e)) e];
}
