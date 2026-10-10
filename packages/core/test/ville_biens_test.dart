/// LA VILLE, deuxième lot : les missions secondaires (`Engine.mission`) et les
/// biens de la boutique (`Engine.biens`). Comme les activités, ils appliquent
/// leurs effets sans rien tirer — ni carte, ni aléa — et peuvent finir une
/// carrière (la garde à vue).
library;

import 'dart:convert';
import 'dart:io';

import 'package:fusible_core/fusible_core.dart';
import 'package:test/test.dart';

Content _content() {
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

void main() {
  final content = _content();
  final engine = Engine(content);
  String json(GameState s) => jsonEncode(s.toJson());

  test('le bundle porte la boutique et les missions', () {
    expect(content.objets, isNotEmpty);
    expect(content.missions, isNotEmpty);
  });

  test('un bien acquis pose ses drapeaux et bouge ses jauges ; perdu, ses drapeaux tombent', () {
    final o = content.objets.values.firstWhere((o) => o.effets.set.isNotEmpty && o.effets.jauges.isNotEmpty);
    final s0 = engine.start(4242, postulat: 0);
    final s1 = engine.biens(s0, o.id, true);
    for (final f in o.effets.set) {
      expect(s1.flags, contains(f), reason: o.id);
    }
    o.effets.jauges.forEach((g, d) {
      expect(s1.gauges[g], (s0.gauges[g]! + d).clamp(0, 100), reason: '${o.id} · $g');
    });
    expect(s1.rngState, s0.rngState, reason: 'aucun tirage');
    expect(s1.pending!.id, s0.pending!.id, reason: 'la carte en attente ne change pas');
    final s2 = engine.biens(s1, o.id, false);
    for (final f in o.effets.set) {
      expect(s2.flags, isNot(contains(f)), reason: o.id);
    }
    expect(s2.gauges, s1.gauges, reason: 'les jauges ne reviennent pas');
    expect(json(s0), json(engine.start(4242, postulat: 0)), reason: 'l\'état d\'origine n\'a pas bougé');
  });

  test('un objet inconnu laisse l\'état tel quel', () {
    final s0 = engine.start(7, postulat: 1);
    expect(json(engine.biens(s0, 'nimporte_quoi', true)), json(s0));
  });

  test('une mission : le choix applique ses effets, l\'échec les siens, et rien ne se tire', () {
    // une étape dont un choix pose un drapeau
    late MissionDef m;
    late String etape, choix;
    var trouve = false;
    for (final mm in content.missions.values) {
      for (final e in mm.choix.entries) {
        for (final c in e.value.entries) {
          if (!trouve && c.value.set.isNotEmpty && c.value.fin == null) {
            m = mm;
            etape = e.key;
            choix = c.key;
            trouve = true;
          }
        }
      }
    }
    expect(trouve, isTrue, reason: 'une mission qui pose un drapeau');
    final role = m.roles.isEmpty ? 'entraineur' : m.roles.first;
    final postulat = content.postulatsByIndex.indexWhere((p) => p.role == role);
    final s0 = engine.start(99, postulat: postulat);
    final s1 = engine.mission(s0, m.id, etape, choix);
    for (final f in m.choix[etape]![choix]!.set) {
      expect(s1.flags, contains(f), reason: '${m.id}/$etape/$choix');
    }
    expect(s1.rngState, s0.rngState);
    expect(s1.pending!.id, s0.pending!.id);
    // un choix inconnu, une étape inconnue, une mission inconnue : rien
    expect(json(engine.mission(s0, m.id, etape, 'nimporte_quoi')), json(s0));
    expect(json(engine.mission(s0, 'nimporte_quoi', etape, choix)), json(s0));
  });

  test('une mission d\'un autre rôle ne s\'applique pas', () {
    final m = content.missions.values.where((m) => m.roles.length == 1).toList();
    if (m.isEmpty) return;
    final autre = m.first.roles.first == 'joueur' ? 'entraineur' : 'joueur';
    final postulat = content.postulatsByIndex.indexWhere((p) => p.role == autre);
    final s0 = engine.start(5, postulat: postulat);
    final e = m.first.choix.entries.first;
    expect(json(engine.mission(s0, m.first.id, e.key, e.value.keys.first)), json(s0));
  });

  test('une fin portée par la ville (la garde à vue) finit la carrière', () {
    // une mission, ou un effet de la ville, qui mène à une fin
    String? mid, eid, cid;
    for (final mm in content.missions.values) {
      for (final e in mm.choix.entries) {
        for (final c in e.value.entries) {
          if (mid == null && c.value.fin != null) {
            mid = mm.id;
            eid = e.key;
            cid = c.key;
          }
        }
      }
    }
    if (mid == null) return; // aucune mission ne finit une carrière : rien à vérifier
    final m = content.missions[mid]!;
    final role = m.roles.isEmpty ? 'entraineur' : m.roles.first;
    final postulat = content.postulatsByIndex.indexWhere((p) => p.role == role);
    final s0 = engine.start(31, postulat: postulat);
    final s1 = engine.mission(s0, mid, eid!, cid!);
    expect(s1.over, isTrue);
    expect(s1.endingId, m.choix[eid]![cid]!.fin);
    expect(s1.pending, isNotNull, reason: 'l\'écran de fin a sa carte');
    expect(json(engine.mission(s1, mid, eid, cid)), json(s1), reason: 'une carrière finie ne bouge plus');
  });

  test('une carrière avec des biens se sauvegarde et se reprend à l\'identique', () {
    final o = content.objets.values.firstWhere((o) => o.effets.set.isNotEmpty);
    var s = engine.start(2024, postulat: 0);
    s = engine.biens(s, o.id, true);
    s = engine.choose(s, true);
    final repris = GameState.fromJson((jsonDecode(json(s)) as Map).cast<String, dynamic>());
    expect(json(engine.choose(repris, false)), json(engine.choose(s, false)));
  });
}
