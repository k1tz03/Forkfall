// Web preview entrypoint: compiles the real Dart engine to JS and exposes it to
// the « album de vignettes » HTML preview (preview_template.html + assemble.js).
// Build:  dart compile js -O2 packages/tools/web/preview.dart -o <out>/engine.js
//
// The whole GameState lives on the Dart side; JS only sends choices and renders
// the returned view-model JSON. This keeps the preview 100% faithful to the
// engine's determinism and content.
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
  // The season calendar has one beat per « journée » (34 for both roles);
  // the current beat therefore doubles as the matchday shown on the status bar.
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
    'promise': s.objectivePromised
        ? 'Promis à ${s.entities.named['president'] ?? 'Le président'} : ${s.objectiveLabel}'
        : null,
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
    'journee': beatIndex + 1,
    'journees': beats.length,
    'phase': beats.isEmpty ? '' : beats[beatIndex].phase,
    'division': s.world.division,
    'promiseTo': s.objectivePromised ? (s.entities.named['president'] ?? 'Le président') : null,
  };
  if (s.over) {
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
