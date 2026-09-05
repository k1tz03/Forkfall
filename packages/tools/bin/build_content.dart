/// Compiles the YAML content under content/ into content/build/content.json:
/// parses each `when` string into an AST, resolves symbolic magnitudes
/// (+/++/+++) to numbers via balance.yaml, and validates references.
/// Run: dart run fusible_tools:build_content
library;

import 'dart:convert';
import 'dart:io';

import 'package:fusible_core/fusible_core.dart' show fnv1a32;
import 'package:yaml/yaml.dart';

import 'src/condition_parser.dart';

final String contentDir = _findContentDir();

String _findContentDir() {
  var dir = Directory.current;
  for (var i = 0; i < 6; i++) {
    final c = Directory('${dir.path}/content');
    if (c.existsSync()) return c.path;
    final parent = dir.parent;
    if (parent.path == dir.path) break;
    dir = parent;
  }
  return '${Directory.current.path}/content';
}

dynamic _loadYaml(String rel) {
  final f = File('$contentDir/$rel');
  if (!f.existsSync()) return null;
  return _yamlToDart(loadYaml(f.readAsStringSync()));
}

dynamic _yamlToDart(dynamic node) {
  if (node is YamlMap) {
    return node.map((k, v) => MapEntry(k.toString(), _yamlToDart(v)));
  }
  if (node is YamlList) {
    return node.map(_yamlToDart).toList();
  }
  return node;
}

late Map<String, int> balance;

int _sym(String s) {
  final t = s.trim();
  if (t.isEmpty) return 0;
  final sign = t[0] == '-' ? -1 : 1;
  final mag = t.replaceAll('+', '').replaceAll('-', '').length;
  final base = mag >= 3 ? balance['large']! : (mag >= 2 ? balance['medium']! : balance['small']!);
  return sign * base;
}

Map<String, dynamic> _resolveEffects(dynamic raw, List<String> errors, String where) {
  if (raw == null) return {};
  final m = (raw as Map).cast<String, dynamic>();
  final out = <String, dynamic>{};
  for (final entry in m.entries) {
    final k = entry.key;
    final v = entry.value;
    switch (k) {
      case 'vestiaire':
      case 'tribunes':
      case 'direction':
      case 'caisse':
      case 'force':
      case 'parole':
      case 'pression':
      case 'age':
        if (v is int) {
          out[k] = v;
        } else if (v is String) {
          out[k] = _sym(v);
        } else {
          errors.add('$where: effet $k invalide ($v)');
        }
        break;
      case 'set':
      case 'clear':
      case 'cancel':
      case 'unlock':
        out[k] = (v as List).map((e) => e.toString()).toList();
        break;
      case 'relation':
        out[k] = (v as Map).map((rk, rv) => MapEntry(rk.toString(), rv is int ? rv : _sym(rv.toString())));
        break;
      case 'var':
        out[k] = (v as Map).map((rk, rv) => MapEntry(rk.toString(), rv.toString()));
        break;
      case 'schedule':
        out[k] = (v as List).map((e) {
          final s = (e as Map).cast<String, dynamic>();
          return {'card': s['card'], 'in': (s['in'] as List).map((x) => x as int).toList()};
        }).toList();
        break;
      case 'role':
      case 'end':
        out[k] = v.toString();
        break;
      case 'promise':
        out[k] = v == true;
        break;
      case 'rand':
        out[k] = (v as List).map((e) {
          final b = (e as Map).cast<String, dynamic>();
          final p = b['p'];
          final nested = _resolveEffects(Map.of(b)..remove('p'), errors, '$where/rand');
          return {'p': p ?? 0, ...nested};
        }).toList();
        break;
      default:
        errors.add('$where: clef d\'effet inconnue "$k"');
    }
  }
  return out;
}

Map<String, dynamic> _resolveChoice(dynamic raw, List<String> errors, String where) {
  final m = (raw as Map).cast<String, dynamic>();
  return {
    'label': m['label']?.toString() ?? '',
    'effects': _resolveEffects(m['effects'], errors, '$where/effects'),
    if (m['answer'] != null) 'answer': m['answer'].toString(),
  };
}

void main() {
  balance = ((_loadYaml('balance.yaml') as Map).cast<String, dynamic>()).map((k, v) => MapEntry(k, v as int));
  final errors = <String>[];

  // Roles.
  final roles = <Map<String, dynamic>>[];
  for (final r in (_loadYaml('roles.yaml') as Map)['roles'] as List) {
    roles.add((r as Map).cast<String, dynamic>());
  }

  // Calendar.
  final calendarRaw = (_loadYaml('calendar.yaml') as Map)['roles'] as Map;
  final calendar = <String, dynamic>{};
  calendarRaw.forEach((role, phases) {
    calendar[role.toString()] = (phases as List)
        .map((p) => {'phase': (p as Map)['phase'], 'beats': (p['beats'] as List).map((b) => b.toString()).toList()})
        .toList();
  });

  // Endings, feats.
  final endings = <Map<String, dynamic>>[];
  for (final e in (_loadYaml('endings.yaml') as Map)['endings'] as List) {
    endings.add((e as Map).cast<String, dynamic>());
  }
  final feats = <Map<String, dynamic>>[];
  final featsFile = _loadYaml('feats.yaml');
  if (featsFile != null) {
    for (final f in (featsFile as Map)['feats'] as List) {
      feats.add((f as Map).cast<String, dynamic>());
    }
  }

  // Names, divisions.
  final names = (_loadYaml('names/fr.yaml') as Map).cast<String, dynamic>();
  final divisions = (_loadYaml('divisions.yaml') as Map).cast<String, dynamic>();

  // Cards: every yaml under cards/.
  final cards = <Map<String, dynamic>>[];
  final seenIds = <String>{};
  final cardsRoot = Directory('$contentDir/cards');
  final files = cardsRoot.existsSync()
      ? cardsRoot.listSync(recursive: true).whereType<File>().where((f) => f.path.endsWith('.yaml')).toList()
      : <File>[];
  files.sort((a, b) => a.path.compareTo(b.path));
  for (final f in files) {
    final rel = f.path.substring(contentDir.length + 1);
    final doc = _yamlToDart(loadYaml(f.readAsStringSync()));
    final list = doc is Map ? doc['cards'] as List : doc as List;
    for (final raw in list) {
      final m = (raw as Map).cast<String, dynamic>();
      final id = m['id'] as String;
      if (!seenIds.add(id)) errors.add('$rel: id en double "$id"');
      final whenStr = m['when'];
      Object? whenAst;
      if (whenStr != null) {
        try {
          whenAst = parseCondition(whenStr.toString());
        } catch (e) {
          errors.add('$rel: when invalide pour "$id" : $e');
        }
      }
      cards.add({
        'id': id,
        'roles': (m['roles'] as List).map((e) => e.toString()).toList(),
        'arc': m['arc']?.toString() ?? rel.split('/').last.replaceAll('.yaml', ''),
        'tags': (m['tags'] as List?)?.map((e) => e.toString()).toList() ?? const [],
        if (m['speaker'] != null) 'speaker': m['speaker'].toString(),
        'weight': (m['weight'] as num?)?.toDouble() ?? 1.0,
        'once': m['once'] == true,
        'cooldown': (m['cooldown'] as num?)?.toInt() ?? 12,
        'priority': (m['priority'] as num?)?.toInt() ?? 0,
        'sablier': m['sablier'] == true,
        if (whenAst != null) 'when': whenAst,
        'text': m['text'].toString(),
        'left': _resolveChoice(m['left'], errors, '$id/left'),
        'right': _resolveChoice(m['right'], errors, '$id/right'),
        if (m['preview'] != null) 'preview': (m['preview'] as List).map((e) => e.toString()).toList(),
      });
    }
  }

  // Compile roles: parse transitions' when.
  for (final role in roles) {
    final trans = role['transitions'] as List?;
    if (trans != null) {
      for (final t in trans) {
        final tm = (t as Map);
        if (tm['when'] != null) {
          tm['when'] = parseCondition(tm['when'].toString());
        }
      }
    }
  }

  final bundle = <String, dynamic>{
    'version': (_loadYaml('meta.yaml') as Map?)?['version'] ?? 1,
    'roles': roles,
    'cards': cards,
    'endings': endings,
    'feats': feats,
    'calendar': calendar,
    'names': names,
    'divisions': divisions,
  };
  final hash = fnv1a32(json.encode(bundle)).toRadixString(16);
  bundle['hash'] = hash;

  if (errors.isNotEmpty) {
    stderr.writeln('Erreurs de compilation du contenu :');
    for (final e in errors) {
      stderr.writeln('  - $e');
    }
    exit(1);
  }

  final outDir = Directory('$contentDir/build')..createSync(recursive: true);
  final pretty = const JsonEncoder.withIndent('  ').convert(bundle);
  File('${outDir.path}/content.json').writeAsStringSync(pretty);

  // Also drop a copy into the Flutter app's assets so `flutter run` works
  // without an extra copy step (the app bundles content/build via this file).
  final appAssets = Directory('${Directory(contentDir).parent.path}/app/assets');
  if (appAssets.parent.existsSync()) {
    appAssets.createSync(recursive: true);
    File('${appAssets.path}/content.json').writeAsStringSync(pretty);
  }

  stdout.writeln('OK: ${cards.length} cartes, ${roles.length} rôles, ${endings.length} fins, '
      '${feats.length} destins → content/build/content.json (hash $hash)');
}
