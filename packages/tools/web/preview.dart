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
    'journee': beatIndex + 1,
    'journees': beats.length,
    'phase': beats.isEmpty ? '' : beats[beatIndex].phase,
    'division': s.world.division,
    'promiseTo': s.objectivePromised ? (s.entities.named['president'] ?? 'Le président') : null,
  };
  if (s.over) {
    final e = s.endingId == null ? null : _content.endings[s.endingId];
    final payload = s.pending?.payload ?? const {};
    m['ending'] = {
      'id': s.endingId,
      'title': e?.title ?? 'Fin de carrière',
      'epitaph': e?.epitaph ?? '',
      'golden': payload['golden'] == true || (e?.golden ?? false),
      'gauge': payload['gauge'],
      'side': payload['side'],
      // Run flags (e.g. 'genou') so the ending screen can pick its stamp.
      'flags': s.flags.toList()..sort(),
    };
  } else {
    final p = s.pending!;
    m['card'] = {
      'id': p.id,
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
    };
  }
  return jsonEncode(m);
}

void main() {
  globalContext.setProperty(
      'fusibleLoad'.toJS,
      ((JSString j) {
        _content = loadContentFromJson(j.toDart);
        _engine = Engine(_content);
        return _postulatsJson().toJS;
      }).toJS);
  globalContext.setProperty(
      'fusibleStart'.toJS,
      ((JSNumber seed, JSNumber postulat) {
        _state = _engine.start(seed.toDartInt, postulat: postulat.toDartInt);
        return _view().toJS;
      }).toJS);
  globalContext.setProperty(
      'fusibleChoose'.toJS,
      ((JSBoolean right) {
        _state = _engine.choose(_state!, right.toDart);
        return _view().toJS;
      }).toJS);
}
