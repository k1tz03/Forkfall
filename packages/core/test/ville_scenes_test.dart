/// LA VILLE JOUÉE : les pièces où l'on entre, les scènes qu'on regarde (`cinematiques`),
/// les conversations qu'on surprend et les objets qu'on touche. Le moteur ne les lit pas —
/// la coquille de la ville les joue (ville_dedans.js, ville_cinema.js, ville_jeux.js) —
/// mais `build_content` les compile contre les pièces rendues
/// (`packages/tools/web/interieurs/interieurs.json`, sorties de
/// docs/design/pixel_iso/interieurs_jeu.js). Le contrat que ces tests gardent : une pièce
/// a une porte praticable et chacun de ses objets s'atteint depuis la porte ; ce qui
/// compile est jouable ; ce qui ne l'est pas casse le build en nommant la faute.
library;

import 'dart:convert';
import 'dart:io';

import 'package:test/test.dart';

String _repoRoot() {
  var dir = Directory.current;
  for (var i = 0; i < 6; i++) {
    if (File('${dir.path}/content/build/content.json').existsSync()) return dir.path;
    final parent = dir.parent;
    if (parent.path == dir.path) break;
    dir = parent;
  }
  throw StateError('dépôt introuvable (content/build/content.json)');
}

Future<void> _copyContent(String root, Directory to) async {
  Future<void> copy(Directory from, Directory dest) async {
    dest.createSync(recursive: true);
    for (final e in from.listSync()) {
      final name = e.path.split('/').last;
      if (e is Directory) {
        if (name == 'build') continue;
        await copy(e, Directory('${dest.path}/$name'));
      } else if (e is File) {
        e.copySync('${dest.path}/$name');
      }
    }
  }

  await copy(Directory('$root/content'), Directory('${to.path}/content'));
}

/// La grille d'une pièce, comme ville_dedans.js la lit (un bit par case, en base64).
List<bool> _grille(Map<String, dynamic> m) {
  final bytes = base64.decode(m['bits'] as String);
  final n = (m['size'] as int) * (m['size'] as int);
  return [for (var i = 0; i < n; i++) (bytes[i >> 3] >> (i & 7)) & 1 == 1];
}

void main() {
  final root = _repoRoot();
  final bundle = json.decode(File('$root/content/build/content.json').readAsStringSync()) as Map<String, dynamic>;
  final ville = bundle['ville'] as Map<String, dynamic>;
  final pieces = ((json.decode(File('$root/packages/tools/web/interieurs/interieurs.json').readAsStringSync()) as Map)['pieces']
          as Map)
      .cast<String, dynamic>();

  group('P · les pièces où l\'on entre', () {
    test('P1 · chaque pièce est un lieu ; sa porte est praticable ; chaque objet s\'atteint depuis la porte', () {
      final cles = {for (final l in ville['lieux'] as List) (l as Map)['key'] as String};
      expect(pieces, isNotEmpty);
      for (final e in pieces.entries) {
        final m = e.value as Map<String, dynamic>;
        expect(cles, contains(e.key), reason: 'la pièce ${e.key} n\'est pas un lieu de ville.yaml');
        final g = _grille(m), n = m['size'] as int;
        bool libre(List<dynamic> c) {
          final x = c[0] as int, y = c[1] as int;
          return x >= 0 && y >= 0 && x < n && y < n && g[y * n + x];
        }

        final porte = m['porte'] as List;
        expect(libre(porte), isTrue, reason: '${e.key} : la porte $porte tombe hors de la grille');
        // tout ce qui est praticable se rejoint depuis la porte (la marche en huit directions)
        final vu = List<bool>.filled(n * n, false);
        final file = <int>[(porte[1] as int) * n + (porte[0] as int)];
        vu[file.first] = true;
        while (file.isNotEmpty) {
          final k = file.removeLast(), x = k % n, y = k ~/ n;
          for (var dy = -1; dy <= 1; dy++) {
            for (var dx = -1; dx <= 1; dx++) {
              final u = x + dx, v = y + dy;
              if (u < 0 || v < 0 || u >= n || v >= n || !g[v * n + u] || vu[v * n + u]) continue;
              vu[v * n + u] = true;
              file.add(v * n + u);
            }
          }
        }
        for (final o in m['objets'] as List) {
          final a = (o as Map)['acces'] as List;
          expect(libre(a), isTrue, reason: '${e.key} : l\'objet ${o['id']} a sa case d\'accès hors de la grille');
          expect(vu[(a[1] as int) * n + (a[0] as int)], isTrue, reason: '${e.key} : on n\'atteint pas l\'objet ${o['id']} depuis la porte');
        }
        final places = (m['places'] as Map).cast<String, dynamic>();
        for (final p in places.entries) {
          final q = p.value as Map;
          final cx = (q['x'] as num) ~/ (m['cell'] as int), cy = (q['y'] as num) ~/ (m['cell'] as int);
          expect(cx >= 0 && cy >= 0 && cx < n && cy < n, isTrue, reason: '${e.key} : la place ${p.key} est hors de la pièce');
        }
      }
    });

    test('P2 · les objets que nomment les activités sont dans leur pièce', () {
      for (final a in (ville['activites'] as List).cast<Map<String, dynamic>>()) {
        final objet = a['objet'];
        if (objet == null) continue;
        final m = pieces[a['lieu']] as Map<String, dynamic>?;
        expect(m, isNotNull, reason: '${a['id']} : le lieu ${a['lieu']} n\'a pas de pièce');
        expect([for (final o in m!['objets'] as List) (o as Map)['id']], contains(objet), reason: '${a['id']}');
      }
    });
  });

  group('S · les scènes jouées et les conversations', () {
    test('S1 · une scène compile dans l\'ordre ; ses fautes cassent le build en se nommant', () async {
      final tmp = Directory('${Directory.systemTemp.path}/fusible_scenes_${DateTime.now().microsecondsSinceEpoch}')
        ..createSync(recursive: true);
      try {
        await _copyContent(root, tmp);
        // une scène et une conversation bien formées
        File('${tmp.path}/content/ville/scenes_test.yaml').writeAsStringSync('''
cinematiques:
  - id: t.ci.bonne
    quand: lieu
    lieu: buvette
    tranche: soir
    titre: "Une scène d'essai"
    acteurs:
      - { qui: gege, place: fond }
      - { id: patron, qui: commercant2, place: barman, nom: "Le patron" }
    etapes:
      - narration: "La salle sent la bière tiède."
      - { qui: toi, va: table_1 }
      - { qui: gege, dit: "Assieds-toi.", geste: pointe }
      - { qui: patron, emote: "..." }
      - { pause: 400 }
      - { fondu: "Plus tard." }
  - id: t.ci.semaine
    quand: semaine
    lieu: buvette
    suite: t.ci.semaine_2
    etapes:
      - narration: "Personne ne vient."
  - id: t.ci.semaine_2
    quand: suite
    lieu: appartement
    etapes:
      - narration: "Chez toi, le frigo ronronne."
conversations:
  - id: t.cv.deux
    lieu: buvette
    qui:
      - { qui: gege, place: fond }
      - { qui: vecchio, place: zinc_1, pose: assis }
    repliques:
      - { qui: gege, dit: "Tu l'as vu ?" }
      - { qui: vecchio, dit: "Pas encore." }
''');
        final ok = await Process.run(Platform.resolvedExecutable, ['$root/packages/tools/bin/build_content.dart'],
            workingDirectory: tmp.path);
        expect(ok.exitCode, 0, reason: 'stdout: ${ok.stdout}\nstderr: ${ok.stderr}');
        final v = (json.decode(File('${tmp.path}/content/build/content.json').readAsStringSync()) as Map)['ville'] as Map;
        final ci = (v['cinematiques'] as List).cast<Map<String, dynamic>>().firstWhere((c) => c['id'] == 't.ci.bonne');
        expect(ci['lieu'], 'buvette');
        expect(ci['tranche'], 'soir');
        expect([for (final a in ci['acteurs'] as List) (a as Map)['id']], ['gege', 'patron']);
        expect((ci['etapes'] as List).length, 6);
        expect(((ci['etapes'] as List)[2] as Map)['dit'], 'Assieds-toi.', reason: 'les étapes gardent leur ordre');
        final se = (v['cinematiques'] as List).cast<Map<String, dynamic>>().firstWhere((c) => c['id'] == 't.ci.semaine');
        expect(se['tranches'], ['matin', 'midi', 'aprem', 'soir'], reason: 'une scène de semaine se joue le jour, par défaut');
        expect(se['poids'], 1);
        expect(se['suite'], 't.ci.semaine_2', reason: 'la suite, ailleurs');
        final cv = (v['conversations'] as List).cast<Map<String, dynamic>>().firstWhere((c) => c['id'] == 't.cv.deux');
        expect((cv['repliques'] as List).length, 2);

        // les fautes : chacune casse le build et se nomme
        File('${tmp.path}/content/ville/scenes_fautes.yaml').writeAsStringSync('''
cinematiques:
  - id: t.ci.fautes
    quand: lieu
    lieu: buvette
    acteurs:
      - { qui: gege, place: nulle_part }
      - { qui: inconnu_du_bataillon, place: porte }
    etapes:
      - { qui: gege, danse_le_tango: oui }
      - { qui: gege, geste: moonwalk }
      - { qui: personne, dit: "Qui parle ?" }
      - { qui: gege, va: au_plafond }
      - { qui: gege, dit: "${'trop long ' * 20}" }
  - id: t.ci.muette
    quand: lieu
    lieu: buvette
    suite: t.ci.nulle_part
    etapes:
      - { pause: 500 }
  - id: t.ci.orpheline
    quand: suite
    lieu: buvette
    etapes:
      - narration: "Personne ne m'appelle."
conversations:
  - id: t.cv.seul
    lieu: buvette
    qui: [gege]
    repliques:
      - { qui: gege, dit: "Je parle seul." }
      - { qui: gege, dit: "Toujours seul." }
activites:
  - id: t_objet_fantome
    lieu: buvette
    objet: piano_a_queue
    label: "Jouer du piano"
    texte: "Il n'y a pas de piano."
    tranches: 0
''');
        final ko = await Process.run(Platform.resolvedExecutable, ['$root/packages/tools/bin/build_content.dart'],
            workingDirectory: tmp.path);
        expect(ko.exitCode, isNot(0));
        final err = ko.stderr as String;
        for (final attendu in [
          't.ci.fautes/acteurs/gege: place « nulle_part » inconnue de la pièce buvette',
          't.ci.fautes/acteurs/inconnu_du_bataillon: qui « inconnu_du_bataillon »',
          't.ci.fautes/etapes/1: une étape fait une chose',
          't.ci.fautes/etapes/2: geste « moonwalk » inconnu',
          't.ci.fautes/etapes/3: qui « personne » n\'est pas dans les acteurs',
          't.ci.fautes/etapes/4: place « au_plafond » inconnue de la pièce buvette',
          't.ci.fautes/etapes/5: `dit` de 200 caractères (> 170)',
          't.ci.muette: personne ne parle',
          't.ci.muette: suite « t.ci.nulle_part » inconnue',
          't.ci.orpheline: `quand: suite` sans scène qui la précède',
          't.cv.seul: deux ou trois voix',
          't_objet_fantome: objet « piano_a_queue » absent de la pièce buvette',
        ]) {
          expect(err, contains(attendu));
        }
      } finally {
        tmp.deleteSync(recursive: true);
      }
    });
  });
}
