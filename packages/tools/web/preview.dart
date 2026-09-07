// Web preview entrypoint: compiles the real Dart engine to JS and exposes it to
// the « album de vignettes » HTML preview (preview_template.html + assemble.js).
// Build:  dart compile js -O2 packages/tools/web/preview.dart -o <out>/engine.js
//
// The whole GameState lives on the Dart side; JS only sends choices and renders
// the returned view-model JSON. This keeps the preview 100% faithful to the
// engine's determinism and content.
//
// ---------------------------------------------------------------------------
// LE SON — le vocabulaire fermé que la vue expose (retour client : « un jeu
// sans univers musical est un jeu vide »). Le moteur ne joue rien : il nomme.
// La définition fait autorité dans packages/core/lib/src/sfx.dart ; elle est
// recopiée ici parce que c'est ce fichier que la couche sonore lit.
//
// `ambiance` — UNE valeur, le lieu de la carte courante :
//     vestiaire | tribune | bureau | couloir | terrain | ville | maison |
//     presse | nuit
//
// `sfx` — une LISTE d'événements, toujours dans cet ordre (ordre stable :
//   deux lectures de la même carte donnent la même liste) :
//     carte_arrivee   la carte se pose
//     choix_gauche    swipe gauche disponible (toujours présent)
//     choix_droite    swipe droit disponible (absent des cartes à un bouton)
//     jauge_danger    une jauge est à ≤ 20 ou ≥ 80
//     alarme          carte d'alarme (une jauge vient de franchir un seuil)
//     reaction        quelqu'un rebondit sur ton dernier choix
//     nouvelle        Carte Nouvelle / Nouvelles du passé — le monde parle
//     une             la Une du Bilan
//     match_debut     bloc de six journées, tour de Coupe, coup d'envoi du Grand Match
//     match_but       le swipe précédent a marqué / gagné
//     match_encaisse  le swipe précédent a encaissé / perdu
//     sifflet_final   fin du Grand Match
//     tampon_fin      écran de fin de carrière
//     classement      la carte Classement
//     palier_haut     palier de relation franchi vers le haut
//     palier_bas      palier de relation franchi vers le bas
//     promesse        la carte Objectif (la promesse au patron)
//     argent          la carte parle d'argent, ou une sortie touche la Caisse
//
// Aucune de ces valeurs ne coûte un tirage : elles sont dérivées du beat, du
// `kind` de la carte, de ses tags, du camp du locuteur, des jauges et de la
// phrase que le dernier swipe a produite.
//
// LE CLASSEMENT — `standings` est exposé EN PERMANENCE (pas seulement sur la
// carte Classement), pour qu'un écran « classement » puisse s'ouvrir à tout
// moment : la table complète des 18 clubs, chaque ligne
// `{rang, club, pts, diff, toi}`. La carte Classement, elle, porte en plus la
// fenêtre de six lignes autour de la tienne dans `card.standings`.
//
// LA FRISE — `frise` est exposée EN PERMANENCE elle aussi (un bouton l'ouvre à
// la demande) :
//
//     frise: {
//       debut, fin,          les années couvertes par la ligne
//       annee,               l'année courante
//       saisons: [ {saison, annee, club, division, rang, objectif, tenu,
//                   evenements: [ {type, annee, label} ]} ],
//       jalons:  [ {annee, type, label} ],       nouvelle | club | role | intrigue
//       carrieres: [ {nom, debut, fin, fin_id} ] l'arrière-plan
//     }
//
// `frise_auto` (booléen) dit les moments où elle doit s'imposer SANS qu'on la
// demande : le passage d'une décennie, un changement de club ou de rôle, la
// fin d'une carrière. La coquille n'a rien à calculer.
//
// LE BANDEAU « NOUVELLES CARTES » — `annonce` porte
// `{type, titre, sous_titre}` ou `null`. Quatre types : `intrigue` (une
// intrigue s'ouvre pour la première fois de la carrière), `personnage` (un
// visage entre en scène), `fin` (une fin devient atteignable), `legende` (un
// objectif caché atteint, ou tout `unlock:` posé par un choix). Le moteur
// garantit qu'il est posé une seule fois, jamais sur deux cartes de suite, et
// au plus deux fois par saison : la coquille se contente de l'afficher tant
// qu'il est là.
//
// LA JOURNÉE — `journee` / `journees` (la journée de championnat et le total
// d'une saison) viennent du monde simulé, pas du calendrier des beats. C'est
// la MÊME définition que celle de l'application (`{journee}` de `text.dart`)
// et que celle de la carte Classement : `journeeDeSaison(world.blocks)`.
import 'dart:convert';
import 'dart:js_interop';
import 'dart:js_interop_unsafe';

import 'package:fusible_core/fusible_core.dart';

late Content _content;
late Engine _engine;
GameState? _state;

/// **L'arrière-plan de la frise** : les carrières déjà closes dans cette page.
/// Le moteur ne connaît qu'une carrière à la fois (`GameState` est UNE
/// carrière) ; c'est donc la coquille qui tient la liste des précédentes et la
/// passe à la frise, comme le fera l'application avec sa sauvegarde.
final List<FriseCarriere> _carrieres = <FriseCarriere>[];

void _archiverCarriere() {
  final s = _state;
  if (s == null || !s.over) return;
  _carrieres.add(FriseCarriere(
    nom: s.entities.protagonist,
    debut: _content.postulats[s.postulatId]?.year ?? Engine.startYear,
    fin: s.year,
    finId: s.endingId,
  ));
}

String _postulatsJson() {
  final list = <Map<String, dynamic>>[];
  final posts = _content.postulatsByIndex;
  for (var i = 0; i < posts.length; i++) {
    final p = posts[i];
    list.add({
      'index': i,
      'title': p.title,
      'question': p.question,
      'role': p.role,
      'roleName': _content.roles[p.role]?.name ?? p.role,
      'division': p.division,
      'year': p.year,
    });
  }
  return jsonEncode({'postulats': list, 'startYear': Engine.startYear});
}

String _view() {
  final s = _state!;
  final role = _content.roles[s.role]!;
  final gauges = role.gauges
      .map((g) => {
            'id': g.id,
            'label': g.label,
            'icon': g.icon,
            'value': s.gauges[g.id] ?? 50,
          })
      .toList();
  // Le calendrier de la saison : il ne sert plus qu'à nommer la PHASE en cours
  // (présaison, aller, hiver, retour, sprint, bilan). La journée de
  // championnat, elle, vient du monde simulé (voir plus bas).
  final beats = _content.seasonBeats[s.role] ?? const <Beat>[];
  final beatIndex = beats.isEmpty ? 0 : s.beat.clamp(0, beats.length - 1);
  final m = <String, dynamic>{
    'over': s.over,
    'role': s.role,
    'roleName': role.name,
    'gauges': gauges,
    'season': s.season + 1,
    'year': s.year,
    'age': s.age,
    'rank': s.world.standingRank,
    'objective': s.objectiveLabel,
    'lastAnswer': s.lastAnswer ?? '',
    'stats': s.stats,
    'turn': s.turn,
    // Album-specific extras: the sticker number, the promise ribbon, the
    // club on the status line and the protagonist's genre (for the portrait).
    'cardNumber': s.turn,
    // Celui à qui la promesse a été faite est le PATRON du rôle courant (le
    // président sur un banc, l'agent chez un joueur) : c'est lui qui tient la
    // carte Objectif. `entities.named['president']` ne nomme que le président.
    'promise': s.objectivePromised ? 'Promis à ${_engine.patronName(s)} : ${s.objectiveLabel}' : null,
    'club': s.entities.named['club'] ?? '',
    'genre': s.entities.genre,
    // The protagonist (names.yaml) for the NOM · FONCTION band of « toi » cards.
    'name': s.entities.protagonist,
    // Le nom saisi (spec variété §1.8) : cosmétique, jamais dans le Code.
    'entities': {
      'prenom': s.entities.prenom,
      'nom': s.entities.nom,
      'protagonist': s.entities.protagonist,
      'genre': s.entities.genre,
      'club': s.entities.named['club'] ?? '',
      'ville': s.entities.named['ville'] ?? '',
    },
    // LA JOURNÉE DE CHAMPIONNAT, et il n'y en a qu'une. Elle vient du monde
    // simulé (`world.blocks` × six), pas du calendrier des beats : le « J » du
    // bandeau comptait ici les cartes de vestiaire comme des matchs et montait
    // à 42, quand l'application affichait le `{journee}` de `text.dart`. Même
    // définition partout, désormais : `journeeDeSaison`.
    'journee': _engine.journeeOf(s),
    'journees': _engine.journeesParSaison,
    'phase': beats.isEmpty ? '' : beats[beatIndex].phase,
    'division': s.world.division,
    'promiseTo': s.objectivePromised ? _engine.patronName(s) : null,
    // Le classement complet, à tout moment (voir l'en-tête).
    'standings': [for (final r in _engine.standingsOf(s)) r.toJson()],
    // Les mêmes nombres, sous les noms que la page du classement lisait déjà.
    'standingsJournee': _engine.journeeOf(s),
    'standingsJournees': _engine.journeesParSaison,
    // LA FRISE (voir `frise.dart`) : la carrière posée sur le siècle. Exposée
    // en permanence — un bouton l'ouvre à la demande — et `frise_auto` dit les
    // moments où elle doit s'imposer sans qu'on la demande : le passage d'une
    // décennie, un changement de club ou de rôle, la fin d'une carrière.
    'frise': _engine.friseOf(s, carrieres: _carrieres).toJson(),
    'frise_auto': _engine.friseSImpose(s),
    // LE BANDEAU « nouvelles cartes » (voir `annonce.dart`) : posé une seule
    // fois, au moment où le contenu s'ouvre, jamais sur deux cartes de suite,
    // deux par saison au plus. `null` le reste du temps.
    'annonce': s.pending?.payload['annonce'],
  };
  if (s.over) {
    // L'écran de fin porte lui aussi son ambiance et son tampon sonore.
    final pend = s.pending;
    if (pend != null) {
      m['ambiance'] = ambianceOf(s, pend);
      m['sfx'] = sfxOf(s, pend);
    }
    final e = s.endingId == null ? null : _content.endings[s.endingId];
    final payload = s.pending?.payload ?? const {};
    // « Ce qui s'est passé » (spec variété §1.7, §3.8) : l'épitaphe rendue
    // (nom, accord), `epitaph_plus`, les 6 lignes de l'Almanach, les objectifs
    // cachés avec leurs indices, les histoires vécues et débloquées.
    m['ending'] = {
      'id': s.endingId,
      'title': payload['title'] ?? e?.title ?? 'Fin de carrière',
      'epitaph': payload['epitaph'] ?? e?.epitaph ?? '',
      'epitaphPlus': payload['epitaph_plus'] ?? '',
      'golden': payload['golden'] == true || (e?.golden ?? false),
      'gauge': payload['gauge'],
      'side': payload['side'],
      // Run flags (e.g. 'genou') so the ending screen can pick its stamp.
      'flags': s.flags.toList()..sort(),
      'journal': payload['journal'] ?? const [],
      'objectifs': payload['objectifs'] ?? const [],
      'histoires': payload['histoires'] ?? const [],
      'debloquees': payload['debloquees'] ?? const [],
      'unes': payload['unes'] ?? const [],
      'nom': payload['nom'] ?? s.entities.protagonist,
      'startYear': _content.postulats[s.postulatId]?.year ?? Engine.startYear,
    };
  } else {
    final p = s.pending!;
    m['card'] = {
      'id': p.id,
      // Le kind du beat (narrative | bilan_une | objective | match…) ; `kind`
      // reste celui de la carte (routine | etape | reaction…).
      'beatKind': p.kind,
      'speaker': p.speaker,
      'speakerName': p.payload['speakerName'],
      'speakerLabel': p.payload['speakerLabel'],
      'expression': p.payload['expression'],
      'kind': p.payload['kind'],
      'tone': p.payload['tone'],
      'arc': p.payload['arc'],
      'band': p.payload['band'],
      'sablier': p.payload['sablier'] == true,
      'text': p.text,
      'leftLabel': p.leftLabel,
      'rightLabel': p.rightLabel,
      'single': p.single,
      'previewLeft': p.previewLeft.map((h) => {'g': h.gauge, 'm': h.magnitude}).toList(),
      'previewRight': p.previewRight.map((h) => {'g': h.gauge, 'm': h.magnitude}).toList(),
      // Bandeau « Nouvelle histoire : {titre} » (spec variété §3.8).
      if (p.payload['unlocked_story'] != null) 'unlockedStory': p.payload['unlocked_story'],
      // Le son (voir l'en-tête) : le lieu, puis les événements de la carte.
      'ambiance': ambianceOf(s, p),
      'sfx': sfxOf(s, p),
      // Le prologue (saison 0) : « 2 / 5 », de quoi afficher une progression.
      if (p.payload['prologue'] != null) 'prologue': p.payload['prologue'],
      if (p.payload['prologue_total'] != null) 'prologueTotal': p.payload['prologue_total'],
      // La carte Classement : la fenêtre de six lignes autour de la tienne.
      if (p.payload['standings'] != null) 'standings': p.payload['standings'],
      if (p.payload['journee'] != null) 'journeeClassement': p.payload['journee'],
      if (p.payload['finale'] != null) 'classementFinal': p.payload['finale'],
    };
    if (p.kind == 'bilan_une') m['card']['une'] = _unePayload(s, p);
  }
  return jsonEncode(m);
}

/// La page de journal du Bilan (spec variété §1.6) : le payload complet de
/// `_bilanUne`, plus la vignette de la photo résolue (locuteur de la carte
/// fatale, camp, expression du moment) pour que la page se rende sans relire
/// le contenu côté JS.
Map<String, dynamic> _unePayload(GameState s, Pending p) {
  final pl = p.payload;
  Map<String, dynamic>? photo;
  final ph = pl['photo'];
  if (ph is Map) {
    final cardId = ph['card'] as String?;
    final card = cardId == null ? null : _content.cards[cardId];
    final ch = card?.speaker == null ? null : _content.characters[card!.speaker];
    final rel = card?.speaker == null ? 0 : (s.relations[card!.speaker] ?? 0);
    photo = {
      'card': cardId,
      'answer': ph['answer'],
      'speaker': card?.speaker,
      'speakerName': ch?.name,
      'speakerLabel': ch?.label,
      'camp': ch?.camp,
      'genre': ch?.genre,
      'expression': rel >= 1 ? 'sourire' : (rel <= -1 ? 'noir' : 'neutre'),
    };
  }
  return {
    'id': pl['une'],
    'journal': pl['journal'] ?? '',
    'journalNom': pl['journal_nom'] ?? 'Le journal',
    'style': pl['style'] ?? 'bleu',
    'titre': pl['titre'] ?? p.text,
    'sous': pl['sous'] ?? '',
    'breves': pl['breves'] ?? const [],
    if (photo != null) 'photo': photo,
    'annee': pl['annee'] ?? s.year,
    'date': pl['date'] ?? 'juin ${s.year + 1}',
    'prix': pl['prix'] ?? '',
    'rang': pl['rang'],
    'tenu': pl['tenu'] == true,
    'objectif': pl['objectif'] ?? s.objectiveLabel,
    'priority': pl['priority'] ?? -1,
  };
}

void main() {
  globalContext.setProperty(
      'fusibleLoad'.toJS,
      ((JSString j) {
        _content = loadContentFromJson(j.toDart);
        _engine = Engine(_content);
        return _postulatsJson().toJS;
      }).toJS);
  // fusibleStart(seed, postulat, prenom?, nom?, genre?) : les trois derniers
  // sont facultatifs ; une chaîne vide (ou absente) laisse le moteur tirer.
  // Le nom n'entre pas dans la graine (spec variété §1.8, test N1).
  globalContext.setProperty(
      'fusibleStart'.toJS,
      ((JSNumber seed, JSNumber postulat, [JSString? prenom, JSString? nom, JSString? genre]) {
        String? opt(JSString? v) {
          final d = v?.toDart.trim();
          return d == null || d.isEmpty ? null : d;
        }

        // La carrière qui s'achève entre à l'arrière-plan de la frise.
        _archiverCarriere();
        _state = _engine.start(seed.toDartInt,
            postulat: postulat.toDartInt, prenom: opt(prenom), nom: opt(nom), genre: opt(genre));
        return _view().toJS;
      }).toJS);
  globalContext.setProperty(
      'fusibleChoose'.toJS,
      ((JSBoolean right) {
        _state = _engine.choose(_state!, right.toDart);
        return _view().toJS;
      }).toJS);
}
