/// Content lint. Validates the compiled bundle against the closed taxonomies
/// (tags, flags, characters), the `when` vocabulary, references (scheduled
/// cards, roles, endings, arcs), the no-real-names rule, text/label lengths,
/// flag read/write consistency, and the narrative layer's shape
/// (docs/brainstorm section 9.5, narrative spec §2.11).
/// Run: dart run fusible_tools:lint
library;

import 'dart:convert';
import 'dart:io';

import 'package:fusible_core/fusible_core.dart' show kKnownCalls, kKnownPathPrefixes, kKnownPaths;
import 'package:yaml/yaml.dart';

late String contentDir;

dynamic _yaml(String rel) {
  final f = File('$contentDir/$rel');
  if (!f.existsSync()) return null;
  return loadYaml(f.readAsStringSync());
}

// A small blacklist of real brands/competitions that must never appear as
// in-world names. Extend as needed (docs/brainstorm section 8).
const List<String> kBlacklist = [
  'fifa', 'uefa', 'ballon d\'or', 'ligue 1', 'ligue des champions', 'champions league',
  'premier league', 'la liga', 'laliga', 'serie a', 'bundesliga', 'real madrid', 'barcelona',
  'manchester', 'liverpool', 'juventus', 'paris saint-germain', 'psg', 'mbappé', 'messi',
  'ronaldo', 'zidane', 'guardiola', 'mourinho', 'raiola', 'infantino', 'coupe du monde',
];

/// Flags the engine itself writes (Bilan, Camille's job, role history).
const List<String> kEngineFlags = ['bilan_tenu', 'bilan_manque', 'descente'];
const List<String> kEngineFlagPrefixes = ['camille_', 'role_was_'];

void main() {
  contentDir = _findContentDir();
  final errors = <String>[];
  final warnings = <String>[];

  final tags = ((_yaml('tags.yaml') as YamlMap)['tags'] as YamlList).map((e) => e.toString()).toSet();
  final flags = ((_yaml('flags.yaml') as YamlMap)['flags'] as YamlList).map((e) => e.toString()).toSet();
  final characters = ((_yaml('characters.yaml') as YamlMap)['characters'] as YamlList)
      .map((e) => (e as YamlMap)['id'].toString())
      .toSet();

  final bundleFile = File('$contentDir/build/content.json');
  if (!bundleFile.existsSync()) {
    stderr.writeln('content/build/content.json introuvable. Lance build_content d\'abord.');
    exit(1);
  }
  final bundle = json.decode(bundleFile.readAsStringSync()) as Map<String, dynamic>;
  final roleIds = (bundle['roles'] as List).map((r) => (r as Map)['id'].toString()).toSet();
  final endingIds = (bundle['endings'] as List).map((e) => (e as Map)['id'].toString()).toSet();
  final cards = (bundle['cards'] as List).cast<Map<String, dynamic>>();
  final cardIds = cards.map((c) => c['id'].toString()).toSet();
  final arcs = (bundle['arcs'] as List? ?? const []).cast<Map<String, dynamic>>();
  final postulats = (bundle['postulats'] as List? ?? const []).cast<Map<String, dynamic>>();
  final alarms = (bundle['alarms'] as Map? ?? const {}).cast<String, dynamic>();
  final chars = (bundle['characters'] as List? ?? const []).cast<Map<String, dynamic>>();

  final flagsWritten = <String>{...kEngineFlags};
  final flagsRead = <String>{};

  // --- AST scanning: flags read, and the `when` vocabulary (L20).
  void scanAst(Object? node, String where) {
    if (node is! List || node.isEmpty) return;
    final op = node[0];
    if (op == 'call' && node.length >= 3) {
      final name = node[1].toString();
      if (!kKnownCalls.contains(name)) errors.add('$where: appel inconnu dans `when` : $name()');
      if (name == 'flag' && node[2] is List) {
        final args = node[2] as List;
        if (args.isNotEmpty && args[0] is List && (args[0] as List)[0] == 'lit') {
          flagsRead.add((args[0] as List)[1].toString());
        }
      }
    } else if (op == 'path' && node.length >= 2) {
      final p = node[1].toString();
      final known = kKnownPaths.contains(p) || kKnownPathPrefixes.any((pre) => p.startsWith(pre));
      if (!known) errors.add('$where: chemin inconnu dans `when` : $p');
      if (p.startsWith('flags.')) flagsRead.add(p.substring(6));
    }
    for (final child in node) {
      scanAst(child, where);
    }
  }

  void scanEffects(Map<String, dynamic>? eff, String where) {
    if (eff == null) return;
    for (final f in (eff['set'] as List?) ?? const []) {
      flagsWritten.add(f.toString());
      if (!flags.contains(f)) errors.add('$where: drapeau non déclaré "$f"');
    }
    for (final f in (eff['clear'] as List?) ?? const []) {
      flagsWritten.add(f.toString());
      if (!flags.contains(f)) errors.add('$where: drapeau non déclaré "$f"');
    }
    if (eff['role'] != null && !roleIds.contains(eff['role'])) errors.add('$where: rôle inconnu "${eff['role']}"');
    if (eff['end'] != null && !endingIds.contains(eff['end'])) errors.add('$where: fin inconnue "${eff['end']}"');
    for (final sc in (eff['schedule'] as List?) ?? const []) {
      final target = (sc as Map)['card'].toString();
      if (!cardIds.contains(target)) errors.add('$where: carte planifiée inexistante "$target"');
      scanAst(sc['cancel_if'], '$where/schedule');
    }
    for (final e in (eff['enemy'] as List?) ?? const []) {
      if (!characters.contains(e)) errors.add('$where: ennemi inconnu "$e"');
    }
    for (final a in (eff['arc'] as List?) ?? const []) {
      if (!arcs.any((x) => x['id'] == (a as Map)['id'])) errors.add('$where: arc inconnu "${(a as Map)['id']}"');
    }
    for (final b in (eff['rand'] as List?) ?? const []) {
      scanEffects((b as Map).cast<String, dynamic>(), '$where/rand');
    }
  }

  for (final card in cards) {
    final id = card['id'];
    for (final t in (card['tags'] as List)) {
      if (!tags.contains(t)) errors.add('$id: tag inconnu "$t"');
    }
    final speaker = card['speaker'];
    if (speaker != null && !characters.contains(speaker)) {
      errors.add('$id: personnage inconnu "$speaker"');
    }
    for (final side in ['left', 'right']) {
      final choice = card[side] as Map<String, dynamic>;
      final label = choice['label'].toString();
      if (label.length > 28) warnings.add('$id/$side: libellé de ${label.length} caractères (> 28)');
      scanEffects((choice['effects'] as Map?)?.cast<String, dynamic>(), '$id/$side');
    }
    final text = card['text'].toString();
    if (text.length > 200) warnings.add('$id: texte de ${text.length} caractères (> 200)');
    final lower = text.toLowerCase();
    for (final bad in kBlacklist) {
      if (lower.contains(bad)) errors.add('$id: nom/marque réel(le) interdit(e) "$bad"');
    }
    scanAst(card['when'], '$id/when');
    // Narrative shape.
    if ((card['tags'] as List).contains('nouvelle') && card['arc'] != 'nouvelle' && card['kind'] != 'passe') {
      warnings.add('$id: tag « nouvelle » sur une carte dont l\'arc n\'est pas « nouvelle » (ne sera pas une respiration)');
    }
    if (card['kind'] == 'nouvelle') {
      final l = json.encode((card['left'] as Map)['effects']);
      final r = json.encode((card['right'] as Map)['effects']);
      if (l != r) warnings.add('$id: Nouvelle aux effets différents des deux côtés (servie comme une carte à un seul bouton)');
    }
  }

  // --- Arcs.
  for (final a in arcs) {
    final id = a['id'];
    scanAst(a['when'], 'arc $id/when');
    scanAst(a['cancel_if'], 'arc $id/cancel_if');
    final steps = (a['steps'] as List).cast<Map<String, dynamic>>();
    if (a['kind'] == 'serie' && steps.length < 3) warnings.add('arc $id: série de moins de 3 étapes');
    for (final f in (a['epilogue'] as Map? ?? const {}).keys) {
      if (f == 'set' || f == 'clear') scanEffects((a['epilogue'] as Map).cast<String, dynamic>(), 'arc $id/epilogue');
    }
    for (final s in steps) {
      for (final v in s['card'] as List) {
        scanAst((v as Map)['if'], 'arc $id/${s['id']}/if');
      }
      for (final nx in s['next'] as List) {
        scanAst((nx as Map)['if'], 'arc $id/${s['id']}/next');
      }
    }
  }

  // --- Postulats.
  for (final p in postulats) {
    for (final f in (p['flags'] as List?) ?? const []) {
      flagsWritten.add(f.toString());
      if (!flags.contains(f)) errors.add('postulat ${p['id']}: drapeau non déclaré "$f"');
    }
    for (final sd in (p['seeds'] as List?) ?? const []) {
      scanAst((sd as Map)['if'], 'postulat ${p['id']}/seeds');
    }
    (p['alarm_overrides'] as Map? ?? const {}).forEach((key, list) {
      for (final e in list as List) {
        scanAst((e as Map)['when'], 'postulat ${p['id']}/alarm_overrides/$key');
      }
    });
    (p['cast'] as Map? ?? const {}).forEach((ch, _) {
      if (!characters.contains(ch)) errors.add('postulat ${p['id']}: personnage du casting inconnu "$ch"');
      final hasRoutine = cards.any((c) => c['speaker'] == ch && (c['roles'] as List).contains(p['role']) && c['pool'] == true);
      if (!hasRoutine) warnings.add('postulat ${p['id']}: « $ch » est au casting mais n\'a aucune carte de routine pour le rôle ${p['role']}');
    });
  }

  // --- Alarms (L26): 8 (gauge, side) entries per role; the last candidate has no `when`.
  alarms.forEach((role, byKey) {
    final keys = (byKey as Map).keys.map((k) => k.toString()).toSet();
    for (final g in ['vestiaire', 'tribunes', 'direction', 'caisse']) {
      for (final side in ['low', 'high']) {
        if (!keys.contains('$g.$side')) errors.add('alarms/$role: entrée manquante « $g.$side »');
      }
    }
    byKey.forEach((key, list) {
      final l = list as List;
      if (l.isEmpty || (l.last as Map)['when'] != null) {
        errors.add('alarms/$role/$key: le dernier candidat doit être sans `when` (sinon l\'alarme peut ne jamais sortir)');
      }
      for (final e in l) {
        scanAst((e as Map)['when'], 'alarms/$role/$key');
      }
    });
  });
  for (final r in roleIds) {
    if (!alarms.containsKey(r)) warnings.add('alarms: aucune alarme pour le rôle « $r »');
  }

  // --- Characters: on_relation ifs.
  for (final ch in chars) {
    (ch['on_relation'] as Map? ?? const {}).forEach((t, variants) {
      for (final v in variants as List) {
        scanAst((v as Map)['if'], 'characters/${ch['id']}/on_relation/$t');
      }
    });
  }

  // Flags declared but never referenced, and read-but-never-written.
  bool engineWrites(String f) => kEngineFlagPrefixes.any((p) => f.startsWith(p));
  for (final f in flags) {
    if (!flagsWritten.contains(f) && !flagsRead.contains(f) && !engineWrites(f)) {
      warnings.add('drapeau déclaré mais jamais utilisé : "$f"');
    }
  }
  for (final f in flagsRead) {
    if (!flagsWritten.contains(f) && flags.contains(f) && !engineWrites(f)) {
      warnings.add('drapeau lu mais jamais posé : "$f"');
    }
  }

  // Endings referenced by roles must exist.
  for (final role in bundle['roles'] as List) {
    for (final g in (role as Map)['gauges'] as List) {
      for (final key in ['empty', 'full']) {
        final e = (g as Map)[key];
        if (e != null && !endingIds.contains(e)) errors.add('rôle ${role['id']}: fin inconnue "$e"');
      }
    }
  }

  stdout.writeln('Lint : ${cards.length} cartes, ${arcs.length} arcs, ${errors.length} erreurs, ${warnings.length} avertissements.');
  for (final w in warnings.take(60)) {
    stdout.writeln('  ! $w');
  }
  if (warnings.length > 60) stdout.writeln('  … (+${warnings.length - 60})');
  for (final e in errors) {
    stderr.writeln('  ✗ $e');
  }
  if (errors.isNotEmpty) exit(1);
}

String _findContentDir() {
  var dir = Directory.current;
  for (var i = 0; i < 6; i++) {
    final c = Directory('${dir.path}/content');
    if (c.existsSync()) return c.path;
    final p = dir.parent;
    if (p.path == dir.path) break;
    dir = p;
  }
  return '${Directory.current.path}/content';
}
