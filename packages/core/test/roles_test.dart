/// LES RÔLES DE BUREAU ET DE BANC NATIONAL : le directeur sportif, le président
/// et le sélectionneur se jouent avec le moteur commun. Tant qu'aucune histoire
/// ne leur a donné de postulat, le test en fabrique un, nu (sans prologue, sans
/// script, sans réservoir), et joue trois saisons : les jauges du rôle existent,
/// les set-pieces trouvent leur texte, une fin de jauge mène à une fin déclarée,
/// et la même graine rejoue la même carrière.
library;

import 'dart:convert';
import 'dart:io';

import 'package:fusible_core/fusible_core.dart';
import 'package:test/test.dart';

Map<String, dynamic> _bundle() {
  var dir = Directory.current;
  for (var i = 0; i < 6; i++) {
    final f = File('${dir.path}/content/build/content.json');
    if (f.existsSync()) return (jsonDecode(f.readAsStringSync()) as Map).cast<String, dynamic>();
    final parent = dir.parent;
    if (parent.path == dir.path) break;
    dir = parent;
  }
  throw StateError('content/build/content.json introuvable — lance d\'abord: dart run fusible_tools:build_content');
}

const _roles = ['ds', 'president', 'selectionneur'];

void main() {
  final raw = _bundle();
  final posts = (raw['postulats'] as List).cast<Map<String, dynamic>>();
  // un postulat nu pour chaque rôle qui n'en a pas encore
  for (final role in _roles) {
    if (posts.any((p) => p['role'] == role)) continue;
    final p = (jsonDecode(jsonEncode(posts.first)) as Map).cast<String, dynamic>();
    p
      ..['id'] = 'essai_$role'
      ..['index'] = posts.length
      ..['role'] = role
      ..['title'] = 'Essai'
      ..['flags'] = <String>[]
      ..['president'] = null
      ..['cast'] = <String, dynamic>{}
      ..['opening_arc'] = null
      ..['prologue'] = null
      ..['programme'] = <String, dynamic>{}
      ..['objectifs'] = <dynamic>[]
      ..['alarm_overrides'] = <String, dynamic>{}
      ..['seeds'] = <dynamic>[];
    // le sélectionneur : une sélection imposée par l'histoire (postulats.yaml `club`, `rival`)
    if (role == 'selectionneur') {
      p
        ..['club'] = 'Cobalts'
        ..['rival'] = 'Sylvanie';
    }
    posts.add(p);
  }
  raw['postulats'] = posts;
  final content = loadContentFromJson(jsonEncode(raw));
  final engine = Engine(content);

  for (final role in _roles) {
    final index = content.postulatsByIndex.indexWhere((p) => p.role == role);
    group(role, () {
      test('le rôle est déclaré, ses quatre jauges et leurs fins existent', () {
        final r = content.roles[role]!;
        expect(r.gauges.map((g) => g.id), ['vestiaire', 'tribunes', 'direction', 'caisse']);
        for (final g in r.gauges) {
          expect(content.endings.containsKey(g.emptyEnding), isTrue, reason: '${g.id} vide : ${g.emptyEnding}');
          expect(content.endings.containsKey(g.fullEnding), isTrue, reason: '${g.id} pleine : ${g.fullEnding}');
        }
        expect(content.seasonBeats[role], isNotEmpty);
      });

      test('trois saisons se jouent, et la même graine rejoue la même carrière', () {
        for (final seed in [1, 7, 42, 2024]) {
          GameState jouer() {
            var s = engine.start(seed, postulat: index);
            expect(s.role, role);
            var n = 0;
            while (!s.over && s.season < 3 && n < 400) {
              expect(s.pending, isNotNull, reason: 'graine $seed, carte $n');
              expect(s.pending!.text.contains('{'), isFalse, reason: 'accolade : ${s.pending!.id} « ${s.pending!.text} »');
              s = engine.choose(s, (seed + n) % 3 != 0);
              n++;
            }
            if (s.over) {
              expect(content.endings.containsKey(s.endingId), isTrue, reason: 'fin inconnue : ${s.endingId}');
            }
            return s;
          }
          expect(jsonEncode(jouer().toJson()), jsonEncode(jouer().toJson()), reason: 'graine $seed');
        }
      });

      if (role == 'selectionneur') {
        test('une sélection imposée, et un classement de nations', () {
          // la coquille propose le Racing de la ville dessinée ; l'histoire impose sa sélection
          final post = content.postulatsByIndex[index];
          final s = engine.start(9, postulat: index, ville: 'Aubérive', club: 'Racing Aubérive');
          final nations = (raw['names'] as Map)['nations'] as List;
          expect(s.entities.named['club'], post.club ?? isNot('Racing Aubérive'));
          if (post.rival != null) {
            expect(s.entities.named['rival'], post.rival);
          } else {
            expect(nations, contains(s.entities.named['rival']), reason: 'le rival d\'un sélectionneur est une nation');
          }
          expect(s.entities.named['ville'], post.ville ?? 'Aubérive');
          final table = engine.standingsOf(s);
          expect(table.where((r) => r.toi).single.club, 'Cobalts');
          for (final r in table.where((r) => !r.toi)) {
            expect(nations, contains(r.club), reason: r.club);
          }
          expect(table.map((r) => r.club).toSet().length, table.length, reason: 'pas deux fois la même nation');
        });
      }

      test('en mode histoire, une jauge vide n\'arrête pas la carrière (la fin du rôle reste écrite)', () {
        // une activité du rôle qui ne touche pas la jauge fragile, appliquée
        // quand cette jauge est à zéro : le contenu du jeu a les jauges non
        // fatales (calendar.yaml `jauges_fatales: false`), la carrière continue
        final r = content.roles[role]!;
        final fragile = r.fragileGauge;
        expect(content.director.jaugesFatales, isFalse);
        final a = content.activites.values.firstWhere((a) => a.roles.contains(role) && !a.jauges.containsKey(fragile));
        var s = engine.start(5, postulat: index);
        s.gauges[fragile] = 0;
        s = engine.activite(s, a.id);
        expect(s.over, isFalse);
        expect(s.gauges[fragile], 0, reason: 'la jauge reste un climat : elle garde sa valeur');
        expect(content.endings.containsKey(r.gauge(fragile).emptyEnding), isTrue, reason: r.gauge(fragile).emptyEnding);
      });
    });
  }
}
