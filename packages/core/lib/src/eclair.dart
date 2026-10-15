/// **Le mode éclair** (« Le Fusible ») : une carrière courte, jouée à côté des
/// livres, où les quatre jauges sont visibles et mortelles comme dans *Reigns*.
///
/// Le mode histoire (calendar.yaml `jauges_fatales: false`) a retiré la tension
/// des jauges pour servir les livres : une jauge à 0 ou 100 n'arrête plus rien.
/// Ce mode-ci la rend, sans toucher aux livres : c'est le **postulat** qui le
/// porte (`mode: eclair` dans postulats.yaml), le moteur le copie dans l'état
/// (`GameState.mode`) au départ, et c'est l'état qui décide ensuite — une
/// sauvegarde reprend dans le mode où elle a été jouée.
///
/// Trois choses vivent ici, parce qu'elles ne sont ni du tirage ni de la
/// mécanique de carte :
///
///  1. **Qui est mortel** : [jaugesMortelles], lu partout où le moteur lisait
///     `content.director.jaugesFatales` (la fin par jauge, le bandeau « une fin
///     devient atteignable »). Le grand déballage, lui, n'a pas de scène dans ce
///     mode : la parole est un compteur que le joueur ne voit pas.
///  2. **Le score** : [semainesTenues], les journées de championnat vécues,
///     dérivées du monde simulé et de rien d'autre.
///  3. **Le défi du jour** : [defiDuJour], le rôle et la graine d'une date, par
///     hachage — les mêmes pour tout le monde, sans serveur.
///
/// Rien ici ne tire sur le `Rng` de la carrière, et rien ne bouge pour un
/// postulat de livre : une carrière en mode histoire se sérialise, se rejoue et
/// s'empreint exactement comme avant.
library;

import 'content.dart';
import 'rng.dart';
import 'standings.dart';
import 'state.dart';

/// Les jauges tuent-elles dans cette carrière ? Le contenu du jeu les rend
/// inoffensives (calendar.yaml) ; les contenus de test les gardent mortelles ;
/// une carrière éclair les rend mortelles quel que soit le réglage du contenu.
bool jaugesMortelles(Content content, GameState s) => content.director.jaugesFatales || s.mode == kModeEclair;

/// Une carte d'un livre ? Les livres nomment leurs cartes `<rôle>.h<N>.…` (`sl.h7.t1_minuit`,
/// `en.h1.re.gege_berline`) : une carrière éclair, qui ne joue que le contenu commun, n'en sert
/// aucune — même quand le livre a oublié de la garder derrière un drapeau (`pickPool`).
bool carteDeLivre(String id) => _livre.hasMatch(id);
final RegExp _livre = RegExp(r'(^|\.)h\d+[._]');

/// **Les semaines tenues** : le score d'une carrière éclair, en journées de
/// championnat vécues — trente-six par saison jouée, plus celles de la saison
/// en cours (`world.blocks` blocs de six journées). Une seule définition,
/// dérivée du monde simulé (la même que la journée `{journee}` des textes) :
/// jamais du calendrier des cartes, qui compte les vestiaires comme des matchs.
///
/// Monotone : la saison qui se ferme (`season + 1`) remet les blocs à zéro au
/// moment même où elle ajoute ses trente-six journées. Un changement de club
/// ou de rôle en cours de saison ne la fait pas reculer (le calendrier
/// appartient à l'exercice, pas au club : `Engine._changeClub`).
int semainesTenues(GameState s) => s.season * kSeasonGames + journeeDeSaison(s.world.blocks);

/// Le défi du jour : ce que la date fixe, pour tout le monde.
class DefiDuJour {
  /// La date, telle qu'on l'a reçue (« 2026-10-15 »).
  final String date;

  /// L'index du postulat éclair joué (celui du rôle tiré) : le code de carrière
  /// s'écrit avec lui.
  final int postulat;

  /// Le rôle tiré (`entraineur`, `joueur`, `president`, `ds`, `selectionneur`).
  final String role;

  /// La graine de la carrière. L'époque en découle : le moteur la tire de la
  /// graine au départ (`PostulatDef.annees`), jamais ailleurs.
  final int seed;

  const DefiDuJour({required this.date, required this.postulat, required this.role, required this.seed});

  Map<String, dynamic> toJson() => {'date': date, 'postulat': postulat, 'role': role, 'seed': seed};
}

/// Les postulats éclair du contenu, dans l'ordre de leurs index (celui du Code
/// de Carrière) : un par rôle.
List<PostulatDef> postulatsEclair(Content content) => [
      for (final p in content.postulatsByIndex)
        if (p.mode == kModeEclair) p,
    ];

/// Le défi de [date] (une chaîne comme « 2026-10-15 », que la coquille tire du
/// jour de Paris : la même pour tout le monde) : un rôle et une graine, par
/// hachage FNV-1a de la date — aucun serveur, aucune horloge ici. Deux appels
/// rendent la même chose, ici comme sur un téléphone.
///
/// Le rôle est pris dans l'ordre des postulats éclair ; la graine, 31 bits,
/// vient d'un second hachage (la date et un sel distincts) pour que le rôle et
/// la graine ne se suivent pas. L'époque n'est pas tirée ici : elle sort de la
/// graine, dans `Engine.start`.
///
/// Rend `null` si le contenu n'a aucun postulat éclair (un contenu de test).
DefiDuJour? defiDuJour(Content content, String date) {
  final posts = postulatsEclair(content);
  if (posts.isEmpty) return null;
  final d = date.trim();
  final p = posts[fnv1a32('fusible|eclair|role|$d') % posts.length];
  final seed = fnv1a32('fusible|eclair|graine|$d') & 0x7FFFFFFF;
  return DefiDuJour(date: d, postulat: p.index, role: p.role, seed: seed);
}
