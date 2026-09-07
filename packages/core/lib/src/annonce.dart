/// **Le bandeau « nouvelles cartes »** — la bande qui traverse la carte quand
/// du contenu vient de s'ouvrir.
///
/// Dans la référence, une bande colorée passe par-dessus la carte en cours
/// pour dire « il y a du neuf dans le paquet ». Ici, quatre choses méritent la
/// bande, et rien d'autre :
///
/// | type         | ce qui vient de se produire                              |
/// |--------------|----------------------------------------------------------|
/// | `intrigue`   | une intrigue s'ouvre pour la première fois de la carrière |
/// | `fin`        | une fin devient atteignable (une jauge entre en danger)   |
/// | `legende`    | une carte-légende se débloque : un objectif caché atteint, ou tout `unlock:` posé par un choix |
/// | `personnage` | un visage entre en scène pour la première fois            |
///
/// **C'est une généralisation, pas un mécanisme de plus.** Le moteur savait
/// déjà signaler l'ouverture d'une intrigue : il posait `unlocked_story` dans
/// le payload de la carte. Ce fichier reprend ce signal, lui en ajoute trois
/// de même nature, et les fait tous sortir par la même porte — un objet
/// `annonce` dans le payload de la carte servie. Rien d'autre n'a bougé :
/// `unlocked_story` reste posé où il était, pour qui le lisait déjà.
///
/// Trois règles, portées par la seule liste `GameState.annonces` :
///
/// 1. **Une fois.** Une clé déjà annoncée ne revient jamais.
/// 2. **Jamais deux cartes de suite.** La carte précédente porte la sienne
///    dans son payload : il n'y a rien à mémoriser pour le savoir.
/// 3. **Deux par saison au plus.** Les entrées portent leur saison en tête.
///
/// Zéro tirage, zéro effet de jeu : le bandeau ne déplace pas d'un pouce ce
/// que la graine raconte (il n'entre pas dans l'empreinte).
library;

import 'content.dart';
import 'state.dart';

/// Ce que la bande annonce.
class Annonce {
  /// `intrigue | fin | legende | personnage`.
  final String type;

  /// Le nom de ce qui vient de s'ouvrir (le titre de l'intrigue, celui de la
  /// fin, le nom du personnage).
  final String titre;

  /// La ligne qui dit pourquoi (« Une intrigue s'ouvre »).
  final String sousTitre;

  /// La clé de dédoublonnage (`intrigue:<arc>`, `fin:<id>`, …).
  final String cle;

  const Annonce({required this.type, required this.titre, required this.sousTitre, required this.cle});

  Map<String, dynamic> toJson() => {'type': type, 'titre': titre, 'sous_titre': sousTitre, 'cle': cle};
}

/// Le seuil de danger d'une jauge — le même que celui du pictogramme tête de
/// mort et de l'événement sonore `jauge_danger` (`sfx.dart`).
const int kSeuilDanger = 20;

/// Les annonces posées pendant la saison [season].
int annoncesDeLaSaison(GameState s, int season) {
  final p = '$season|';
  var n = 0;
  for (final a in s.annonces) {
    if (a.startsWith(p)) n += 1;
  }
  return n;
}

bool _dejaPosee(GameState s, String cle) {
  for (final a in s.annonces) {
    final i = a.indexOf('|');
    if (i >= 0 && a.substring(i + 1) == cle) return true;
  }
  return false;
}

/// Les candidats du moment, dans l'ordre de priorité : une intrigue qui
/// s'ouvre passe avant une fin qui se rapproche, qui passe avant une légende,
/// qui passe avant un visage. Une seule sort.
List<Annonce> _candidats(Content content, GameState s, Pending p) {
  final out = <Annonce>[];

  // 1. L'intrigue qui s'ouvre — le signal que le moteur posait déjà.
  final story = p.payload['unlocked_story'];
  if (story is String && story.isNotEmpty) {
    final arc = p.payload['arc'];
    out.add(Annonce(
      type: 'intrigue',
      titre: story,
      sousTitre: 'Une intrigue s\'ouvre',
      cle: 'intrigue:${arc is String && arc.isNotEmpty ? arc : story}',
    ));
  }

  // 2. La fin qui devient atteignable : une jauge est entrée dans la zone où
  //    son écran de fin l'attend (le côté vide comme le côté plein).
  final role = content.roles[s.role];
  if (role != null) {
    for (final g in role.gauges) {
      final v = s.gauges[g.id] ?? 50;
      final id = v <= kSeuilDanger ? g.emptyEnding : (v >= 100 - kSeuilDanger ? g.fullEnding : null);
      if (id == null || id.isEmpty) continue;
      out.add(Annonce(
        type: 'fin',
        titre: content.endings[id]?.title ?? id,
        sousTitre: 'Une fin devient atteignable',
        cle: 'fin:$id',
      ));
    }
  }

  // 3. La carte-légende : ce que la carrière vient d'ouvrir et qui restera
  //    ouvert. `unlocked` porte les objectifs cachés atteints (`objectif:`) et
  //    tout ce qu'un choix y pose par `unlock:` ; `fin:<id>` n'est écrit qu'à
  //    l'écran de fin, il n'y a plus de carte pour l'annoncer.
  final post = content.postulats[s.postulatId];
  for (final u in s.unlocked.toList()..sort()) {
    if (u.startsWith('fin:')) continue;
    String titre = u;
    var sous = 'Une carte-légende se débloque';
    if (u.startsWith('objectif:')) {
      final oid = u.substring('objectif:'.length);
      for (final o in post?.objectifs ?? const <ObjectifDef>[]) {
        if (o.id == oid) titre = o.titre;
      }
      sous = 'Un objectif caché est atteint';
    } else {
      titre = content.feats[u]?.title ?? u;
    }
    out.add(Annonce(type: 'legende', titre: titre, sousTitre: sous, cle: 'legende:$u'));
  }

  // 4. Le visage qui entre en scène : sa toute première apparition.
  final sp = p.speaker;
  if (sp != null && (s.speakerSeen[sp] ?? 0) == 1) {
    final ch = content.characters[sp];
    out.add(Annonce(
      type: 'personnage',
      titre: ch?.name ?? sp,
      sousTitre: (ch?.label ?? '').isEmpty ? 'Entre en scène' : ch!.label,
      cle: 'personnage:$sp',
    ));
  }
  return out;
}

/// Pose le bandeau sur la carte courante si le moment le mérite.
///
/// [carteFraiche] dit que la carte précédente n'en portait pas : deux bandes
/// ne se suivent jamais. Modifie `s.annonces` (la clé posée) et `s.pending`
/// (son payload reçoit `annonce`). Aucun tirage, aucun effet de jeu.
void poserAnnonce(Content content, GameState s, {required bool carteFraiche}) {
  if (!carteFraiche || s.over) return;
  final p = s.pending;
  if (p == null) return;
  // Le prologue est la mise en situation : on n'y annonce rien, on y installe.
  if (p.kind == 'prologue' || p.kind == 'ending') return;
  if (p.payload.containsKey('annonce')) return;
  if (annoncesDeLaSaison(s, s.season) >= 2) return;
  Annonce? choisie;
  for (final a in _candidats(content, s, p)) {
    if (_dejaPosee(s, a.cle)) continue;
    choisie = a;
    break;
  }
  if (choisie == null) return;
  s.annonces.add('${s.season}|${choisie.cle}');
  s.pending = Pending(
    id: p.id,
    kind: p.kind,
    speaker: p.speaker,
    text: p.text,
    leftLabel: p.leftLabel,
    rightLabel: p.rightLabel,
    leftEffects: p.leftEffects,
    rightEffects: p.rightEffects,
    previewLeft: p.previewLeft,
    previewRight: p.previewRight,
    payload: {...p.payload, 'annonce': choisie.toJson()},
    single: p.single,
  );
}
