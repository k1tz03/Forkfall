/// G1 — les goldens de reproductibilité (spec variété §3.9, étape 8).
///
/// Vingt Codes de Carrière figés dans `content/tests/goldens.yaml` : chaque
/// code est rejoué du premier écran à la fin et comparé à ce qu'il racontait
/// le jour où il a été figé (fin atteinte, cartes servies, hachage des ids
/// servis dans l'ordre, empreinte de l'état final).
///
/// **Quand ce test devient rouge**, ce n'est pas forcément un bug : un
/// changement de contenu ou de moteur a déplacé ce qu'une graine raconte. La
/// marche à suivre :
///
///   1. lire le diff que le test imprime (postulat, code, ce qui a bougé) ;
///   2. vérifier à la trace que la carrière déplacée se lit toujours :
///      `dart run packages/tools/bin/simulate.dart --trace <graine> --postulat <p>` ;
///   3. régénérer et relire le diff du fichier :
///      `dart run packages/tools/bin/simulate.dart --goldens --write`
///      (`--recode` en plus pour retirer de nouveaux codes, quand les swipes
///      eux-mêmes n'ont plus de sens : une saison qui change de longueur).
///
/// Le fichier garde les MÊMES codes d'une régénération à l'autre : c'est ce
/// qui rend le diff lisible.
library;

import 'dart:io';

import 'package:fusible_core/fusible_core.dart';
import 'package:test/test.dart';

File _goldensFile() {
  var dir = Directory.current;
  for (var i = 0; i < 6; i++) {
    final f = File('${dir.path}/content/tests/goldens.yaml');
    if (f.existsSync()) return f;
    final parent = dir.parent;
    if (parent.path == dir.path) break;
    dir = parent;
  }
  throw StateError('content/tests/goldens.yaml introuvable — lance '
      '`dart run packages/tools/bin/simulate.dart --goldens --write`');
}

Content _real() {
  var dir = Directory.current;
  for (var i = 0; i < 6; i++) {
    final f = File('${dir.path}/content/build/content.json');
    if (f.existsSync()) return loadContentFromJson(f.readAsStringSync());
    final parent = dir.parent;
    if (parent.path == dir.path) break;
    dir = parent;
  }
  throw StateError('content/build/content.json introuvable — lance d\'abord build_content');
}

void main() {
  group('G · goldens de reproductibilité', () {
    final text = _goldensFile().readAsStringSync();
    final entries = parseGoldens(text);
    final content = _real();
    final engine = Engine(content);

    test('G1 · vingt Codes de Carrière racontent la même carrière qu\'au jour où ils ont été figés', () {
      expect(entries.length, 20, reason: 'le fichier de goldens doit tenir 20 codes (5 graines × 4 postulats)');
      final derives = <String>[];
      for (int i = 0; i < entries.length; i++) {
        final code = CareerCode.decode(entries[i].code);
        expect(code, isNotNull, reason: 'golden #$i : code illisible « ${entries[i].code} »');
        final got = replayCode(engine, code!);
        if (got.digest != entries[i].digest) {
          derives.add('  #$i · postulat ${code.postulat} · ${entries[i].code}\n'
              '      figé : ${entries[i].digest}\n'
              '      lu   : ${got.digest}');
        }
      }
      expect(
        derives,
        isEmpty,
        reason: '${derives.length} golden(s) déplacé(s) — le contenu figé était '
            '« ${goldensContentHash(text)} », le contenu courant est « ${content.hash} ».\n'
            '${derives.join('\n')}\n'
            'Si le déplacement est voulu : dart run packages/tools/bin/simulate.dart --goldens --write',
      );
    });

    test('G1b · un golden est reproductible : deux rejeux du même code donnent le même digest', () {
      for (final e in entries.take(4)) {
        final code = CareerCode.decode(e.code)!;
        expect(replayCode(engine, code).digest, replayCode(engine, code).digest);
      }
    });

    test('G1c · les vingt codes couvrent les quatre postulats, et au moins quinze portent une fin', () {
      final parPostulat = <int, int>{};
      for (final e in entries) {
        final code = CareerCode.decode(e.code)!;
        parPostulat[code.postulat] = (parPostulat[code.postulat] ?? 0) + 1;
      }
      expect(parPostulat.keys.toList()..sort(), [0, 1, 2, 3]);
      expect(parPostulat.values.every((v) => v == 5), isTrue);
      // Un code plafonné (400 swipes sans mourir) reste un golden valide : il
      // fige un début de carrière. Mais un fichier où la moitié des codes ne
      // meurent plus veut dire que les swipes figés ne racontent plus une
      // carrière entière — il est temps de les retirer (`--goldens --write
      // --recode`). Seuil : au moins 15 des 20 codes portent une fin.
      final avecFin = entries.where((e) => !e.digest.contains('fin=-')).length;
      expect(avecFin, greaterThanOrEqualTo(15),
          reason: 'seulement $avecFin codes sur ${entries.length} atteignent une fin : '
              'les swipes figés ne racontent plus une carrière entière. '
              'Retire de nouveaux codes : simulate --goldens --write --recode');
    });
  });
}
