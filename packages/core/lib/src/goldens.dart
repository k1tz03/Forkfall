/// Les goldens de reproductibilité (spec variété §3.9 « G1 », étape 8).
///
/// Un golden est un **Code de Carrière** — version du contenu, graine,
/// postulat, suite de swipes — rejoué du premier écran à la fin, réduit à
/// quatre valeurs stables : la fin atteinte, le nombre de cartes servies,
/// l'empreinte de l'état final (`GameState.fingerprint`) et l'empreinte de
/// l'histoire (le hachage des ids servis, dans l'ordre).
///
/// Ce qu'ils attrapent : un changement de contenu ou de moteur qui déplace ce
/// qu'une graine raconte. Ce n'est pas une régression en soi — le contenu vit —
/// mais ça doit se **voir** et être relu, pas passer en silence.
///
/// Régénération : `dart run packages/tools/bin/simulate.dart --goldens --write`
/// (relire le diff de `content/tests/goldens.yaml` avant de le garder).
library;

import 'engine.dart';
import 'rng.dart' show fnv1a32;
import 'seed_codec.dart';

/// Le résultat du rejeu d'un Code de Carrière.
class GoldenRun {
  /// Le code rejoué (forme complète : version, graine, postulat, swipes).
  final String code;

  /// Index du postulat, pour lire le fichier sans décoder le code.
  final int postulat;

  /// Nombre de swipes effectivement appliqués (la carrière peut finir avant).
  final int swipes;

  /// Id de la fin atteinte, ou `-` si la carrière n'est pas terminée.
  final String fin;

  /// Cartes servies (tous kinds, beats compris).
  final int cartes;

  /// Hachage des ids servis dans l'ordre : « ce que la graine raconte ».
  final String histoire;

  /// `GameState.fingerprint()` du dernier état.
  final String empreinte;

  const GoldenRun({
    required this.code,
    required this.postulat,
    required this.swipes,
    required this.fin,
    required this.cartes,
    required this.histoire,
    required this.empreinte,
  });

  /// La ligne comparée par le test et écrite dans le fichier : tout sauf le
  /// code lui-même.
  String get digest => 'fin=$fin cartes=$cartes histoire=$histoire empreinte=$empreinte';
}

/// Rejoue [code] sur [engine] et rend son golden. Aucun aléa hors graine :
/// deux appels rendent la même valeur, ici comme sur un téléphone.
GoldenRun replayCode(Engine engine, CareerCode code) {
  var s = engine.start(code.seed, postulat: code.postulat);
  final ids = <String>[];
  int applied = 0;
  if (s.pending != null) ids.add(s.pending!.id);
  for (final right in code.swipes) {
    if (s.over) break;
    s = engine.choose(s, right);
    applied += 1;
    final p = s.pending;
    if (p != null) ids.add(p.id);
  }
  return GoldenRun(
    code: code.fullCode,
    postulat: code.postulat,
    swipes: applied,
    fin: s.endingId ?? '-',
    cartes: ids.length,
    histoire: fnv1a32(ids.join('|')).toRadixString(16).padLeft(8, '0'),
    empreinte: s.fingerprint(),
  );
}

/// Une entrée lue dans `content/tests/goldens.yaml`.
class GoldenEntry {
  final String code;
  final String digest;
  const GoldenEntry(this.code, this.digest);
}

/// Lecteur du fichier de goldens. Volontairement minuscule : `packages/core`
/// n'a pas de dépendance YAML (et n'en veut pas pour un fichier que ce module
/// écrit lui-même). Le format est plat, une entrée par bloc `- code:`.
List<GoldenEntry> parseGoldens(String text) {
  final out = <GoldenEntry>[];
  String? code;
  final fields = <String, String>{};
  void flush() {
    if (code == null) return;
    final digest = 'fin=${fields['fin']} cartes=${fields['cartes']}'
        ' histoire=${fields['histoire']} empreinte=${fields['empreinte']}';
    out.add(GoldenEntry(code!, digest));
    code = null;
    fields.clear();
  }

  for (final raw in text.split('\n')) {
    final line = raw.trim();
    if (line.isEmpty || line.startsWith('#')) continue;
    if (line.startsWith('- code:')) {
      flush();
      code = _value(line.substring('- code:'.length));
      continue;
    }
    final i = line.indexOf(':');
    if (i <= 0 || code == null) continue;
    fields[line.substring(0, i).trim()] = _value(line.substring(i + 1));
  }
  flush();
  return out;
}

String _value(String v) {
  var t = v.trim();
  if (t.length >= 2 && t.startsWith('"') && t.endsWith('"')) {
    t = t.substring(1, t.length - 1);
  }
  return t;
}

/// Le fichier `content/tests/goldens.yaml` pour [runs].
String renderGoldens(List<GoldenRun> runs, {required String contentHash, required int contentVersion}) {
  final b = StringBuffer()
    ..writeln('# Goldens de reproductibilité (spec variété §3.9 « G1 », étape 8).')
    ..writeln('#')
    ..writeln('# Chaque entrée est un Code de Carrière rejoué du premier écran à la fin.')
    ..writeln('# `histoire` est le hachage FNV-1a des ids servis dans l\'ordre ;')
    ..writeln('# `empreinte` est `GameState.fingerprint()` du dernier état.')
    ..writeln('#')
    ..writeln('# CE FICHIER SE RÉGÉNÈRE, IL NE SE CORRIGE PAS À LA MAIN :')
    ..writeln('#   dart run packages/tools/bin/simulate.dart --goldens --write')
    ..writeln('# Un golden rouge veut dire qu\'un changement de contenu ou de moteur a')
    ..writeln('# déplacé ce qu\'une graine raconte. Relire le diff, puis regénérer.')
    ..writeln('#')
    ..writeln('# Les vingt codes : 5 graines × 4 postulats, swipes tirés par la politique')
    ..writeln('# `human_like` de `simulate` et figés dans le code lui-même — le rejeu ne')
    ..writeln('# dépend donc plus de la politique, seulement du moteur et du contenu.')
    ..writeln('contenu: "$contentHash"')
    ..writeln('version: $contentVersion')
    ..writeln('goldens:');
  for (final r in runs) {
    b
      ..writeln('  - code: "${r.code}"')
      ..writeln('    postulat: ${r.postulat}')
      ..writeln('    swipes: ${r.swipes}')
      ..writeln('    fin: ${r.fin}')
      ..writeln('    cartes: ${r.cartes}')
      ..writeln('    histoire: ${r.histoire}')
      ..writeln('    empreinte: "${r.empreinte}"');
  }
  return b.toString();
}

/// Le hash de contenu déclaré en tête du fichier de goldens (`-` s'il manque).
String goldensContentHash(String text) {
  for (final raw in text.split('\n')) {
    final line = raw.trim();
    if (line.startsWith('contenu:')) return _value(line.substring('contenu:'.length));
  }
  return '-';
}
