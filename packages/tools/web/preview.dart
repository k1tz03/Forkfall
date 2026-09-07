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
import 'dart:convert';
import 'dart:js_interop';
import 'dart:js_interop_unsafe';

import 'package:fusible_core/fusible_core.dart';

late Content _content;
late Engine _engine;
GameState? _state;

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

/// La journée courante : le rang du beat parmi les beats hors prologue.
int _journee(List<Beat> beats, int beatIndex) {
  var n = 0;
  for (var i = 0; i <= beatIndex && i < beats.length; i++) {
    if (beats[i].kind != 'prologue') n += 1;
  }
  return n == 0 ? 1 : n;
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
  // Le calendrier d'une saison porte un beat par « journée » ; les beats
  // `prologue` réservés en tête de présaison ne comptent pas (saison 0
  // seulement, et jamais tous servis).
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
    // La « journée » affichée compte les beats JOUÉS d'une saison : les beats
    // `prologue` réservés en tête de présaison n'en sont pas (ils ne sortent
    // qu'en saison 0, et jamais tous).
    'journee': _journee(beats, beatIndex),
    'journees': beats.where((b) => b.kind != 'prologue').length,
    'phase': beats.isEmpty ? '' : beats[beatIndex].phase,
    'division': s.world.division,
    'promiseTo': s.objectivePromised ? _engine.patronName(s) : null,
    // Le classement complet, à tout moment (voir l'en-tête).
    'standings': [for (final r in _engine.standingsOf(s)) r.toJson()],
    'standingsJournee': (s.world.blocks * kGamesPerBlock).clamp(0, kSeasonGames),
    'standingsJournees': kSeasonGames,
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
