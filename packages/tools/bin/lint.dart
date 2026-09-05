/// Content lint. Validates the compiled bundle against the closed taxonomies
/// (tags, flags, characters), checks references (scheduled cards, roles,
/// endings), the no-real-names rule, text/label lengths, and flag read/write
/// consistency (docs/brainstorm section 9.5).
/// Run: dart run fusible_tools:lint
library;

import 'dart:convert';
import 'dart:io';

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

  final flagsWritten = <String>{};
  final flagsRead = <String>{};

  void scanAstForFlags(Object? node) {
    if (node is List) {
      if (node.isNotEmpty && node[0] == 'call' && node[1] == 'flag' && node[2] is List) {
        final args = node[2] as List;
        if (args.isNotEmpty && args[0] is List && (args[0] as List)[0] == 'lit') {
          flagsRead.add((args[0] as List)[1].toString());
        }
      }
      for (final child in node) {
        scanAstForFlags(child);
      }
    }
  }

  void scanEffectsForFlags(Map<String, dynamic>? eff) {
    if (eff == null) return;
    for (final f in (eff['set'] as List?) ?? const []) {
      flagsWritten.add(f.toString());
    }
    for (final f in (eff['clear'] as List?) ?? const []) {
      flagsWritten.add(f.toString());
    }
    for (final b in (eff['rand'] as List?) ?? const []) {
      scanEffectsForFlags((b as Map).cast<String, dynamic>());
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
      final eff = (choice['effects'] as Map?)?.cast<String, dynamic>();
      scanEffectsForFlags(eff);
      // referenced flags/roles/endings/scheduled
      final set = (eff?['set'] as List?) ?? const [];
      final clear = (eff?['clear'] as List?) ?? const [];
      for (final f in [...set, ...clear]) {
        if (!flags.contains(f)) errors.add('$id/$side: drapeau non déclaré "$f"');
      }
      if (eff?['role'] != null && !roleIds.contains(eff!['role'])) {
        errors.add('$id/$side: rôle inconnu "${eff['role']}"');
      }
      if (eff?['end'] != null && !endingIds.contains(eff!['end'])) {
        errors.add('$id/$side: fin inconnue "${eff['end']}"');
      }
      for (final sc in (eff?['schedule'] as List?) ?? const []) {
        final target = (sc as Map)['card'].toString();
        if (!cardIds.contains(target)) errors.add('$id/$side: carte planifiée inexistante "$target"');
      }
      // rand branches can also carry end/role/schedule
      for (final b in (eff?['rand'] as List?) ?? const []) {
        final bm = (b as Map).cast<String, dynamic>();
        if (bm['end'] != null && !endingIds.contains(bm['end'])) {
          errors.add('$id/$side/rand: fin inconnue "${bm['end']}"');
        }
      }
    }
    final text = card['text'].toString();
    if (text.length > 200) warnings.add('$id: texte de ${text.length} caractères (> 200)');
    final lower = text.toLowerCase();
    for (final bad in kBlacklist) {
      if (lower.contains(bad)) errors.add('$id: nom/marque réel(le) interdit(e) "$bad"');
    }
    scanAstForFlags(card['when']);
  }

  // Flags declared but never referenced, and read-but-never-written.
  for (final f in flags) {
    if (!flagsWritten.contains(f) && !flagsRead.contains(f)) {
      warnings.add('drapeau déclaré mais jamais utilisé : "$f"');
    }
  }
  for (final f in flagsRead) {
    if (!flagsWritten.contains(f) && flags.contains(f)) {
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

  stdout.writeln('Lint : ${cards.length} cartes, ${errors.length} erreurs, ${warnings.length} avertissements.');
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
