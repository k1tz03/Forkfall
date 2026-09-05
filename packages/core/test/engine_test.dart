import 'dart:convert';
import 'dart:io';

import 'package:fusible_core/fusible_core.dart';
import 'package:test/test.dart';

Content loadContent() {
  var dir = Directory.current;
  for (var i = 0; i < 6; i++) {
    final f = File('${dir.path}/content/build/content.json');
    if (f.existsSync()) return loadContentFromJson(f.readAsStringSync());
    final parent = dir.parent;
    if (parent.path == dir.path) break;
    dir = parent;
  }
  throw StateError('content/build/content.json introuvable — lance d\'abord: dart run fusible_tools:build_content');
}

/// A deterministic "human-like" bot: nudge each gauge away from the edges by
/// choosing the side whose preview keeps things balanced, else alternate.
GameState playToEnd(Engine engine, int seed, {int postulat = 0, int maxTurns = 2000, List<String>? fingerprints}) {
  var s = engine.start(seed, postulat: postulat);
  int guard = 0;
  while (!s.over && guard < maxTurns) {
    fingerprints?.add(s.fingerprint());
    // Pick the side with fewer preview dots on already-extreme gauges; ties -> parity.
    final p = s.pending!;
    bool right;
    if (p.single) {
      right = true;
    } else {
      final leftRisk = _risk(s, p.previewLeft);
      final rightRisk = _risk(s, p.previewRight);
      right = rightRisk < leftRisk ? true : (leftRisk < rightRisk ? false : (guard % 2 == 0));
    }
    s = engine.choose(s, right);
    guard++;
  }
  return s;
}

int _risk(GameState s, List<GaugeHint> hints) {
  int r = 0;
  for (final h in hints) {
    final v = s.gauges[h.gauge] ?? 50;
    if (v < 30 || v > 70) r += h.magnitude;
  }
  return r;
}

void main() {
  final content = loadContent();
  final engine = Engine(content);

  test('a run reaches an ending', () {
    final s = playToEnd(engine, 12345);
    expect(s.over, isTrue);
    expect(s.endingId, isNotNull);
    expect(content.endings.containsKey(s.endingId) || s.endingId == 'jubile', isTrue);
    expect(s.pending!.kind, 'ending');
  });

  test('determinism: same seed + same choices => identical fingerprints', () {
    for (final seed in [1, 7, 42, 999, 2024]) {
      final fp1 = <String>[];
      final s1 = playToEnd(engine, seed, fingerprints: fp1);
      final fp2 = <String>[];
      final s2 = playToEnd(engine, seed, fingerprints: fp2);
      expect(fp1, equals(fp2), reason: 'seed $seed diverged');
      expect(s1.fingerprint(), equals(s2.fingerprint()));
      expect(s1.endingId, equals(s2.endingId));
    }
  });

  test('replaying the recorded swipes reproduces the run', () {
    final s1 = playToEnd(engine, 555);
    final swipes = s1.swipes;
    var s2 = engine.start(555);
    for (final right in swipes) {
      if (s2.over) break;
      s2 = engine.choose(s2, right);
    }
    expect(s2.fingerprint(), equals(s1.fingerprint()));
    expect(s2.endingId, equals(s1.endingId));
  });

  test('GameState JSON round-trips exactly', () {
    var s = engine.start(88);
    for (int i = 0; i < 20 && !s.over; i++) {
      s = engine.choose(s, i % 3 == 0);
    }
    final j = json.encode(s.toJson());
    final back = GameState.fromJson(json.decode(j) as Map<String, dynamic>);
    expect(json.encode(back.toJson()), equals(j));
    // And continuing from the reloaded state stays deterministic.
    final contA = engine.choose(s, true);
    final contB = engine.choose(back, true);
    expect(contA.fingerprint(), equals(contB.fingerprint()));
  });

  test('gauges always stay within [0,100]', () {
    for (final seed in [3, 33, 303, 3003]) {
      var s = engine.start(seed);
      int guard = 0;
      while (!s.over && guard < 3000) {
        for (final g in s.gauges.values) {
          expect(g, inInclusiveRange(0, 100));
        }
        s = engine.choose(s, guard % 2 == 0);
        guard++;
      }
    }
  });

  test('Code de Carrière round-trips', () {
    final s = playToEnd(engine, 77);
    final code = CareerCode(
      contentVersion: content.version,
      seed: s.seed,
      postulat: s.postulat,
      swipes: s.swipes,
    );
    final decoded = CareerCode.decode(code.fullCode)!;
    expect(decoded.seed, equals(s.seed));
    expect(decoded.postulat, equals(s.postulat));
    expect(decoded.swipes.length, equals(s.swipes.length));
    expect(decoded.swipes, equals(s.swipes));
  });
}
