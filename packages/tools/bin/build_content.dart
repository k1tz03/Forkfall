/// Compiles the YAML content under content/ into content/build/content.json:
/// parses each `when` string into an AST, resolves symbolic magnitudes
/// (+/++/+++) to numbers via balance.yaml, loads the narrative layer
/// (characters, arcs, postulats, alarms, director config), derives each
/// card's `kind`/`pool`/`sablier`, and validates references.
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

List<File> _yamlFiles(String rel) {
  final root = Directory('$contentDir/$rel');
  if (!root.existsSync()) return const [];
  final files = root.listSync(recursive: true).whereType<File>().where((f) => f.path.endsWith('.yaml')).toList();
  files.sort((a, b) => a.path.compareTo(b.path));
  return files;
}

late Map<String, int> balance;

/// Resolve a symbolic magnitude. The number of sign characters picks the band
/// ("+" small, "++" medium, "+++" large) and the leading sign the direction.
/// Relations move by 1..3 directly, never by a gauge band.
int _sym(String s, {bool relation = false}) {
  final t = s.trim();
  if (t.isEmpty) return 0;
  final sign = t[0] == '-' ? -1 : 1;
  final mag = t.split('').where((c) => c == '+' || c == '-').length;
  if (relation) return sign * mag.clamp(1, 3);
  final base = mag >= 3 ? balance['large']! : (mag >= 2 ? balance['medium']! : balance['small']!);
  return sign * base;
}

Object? _parseWhen(Object? raw, List<String> errors, String where) {
  if (raw == null) return null;
  try {
    return parseCondition(raw.toString());
  } catch (e) {
    errors.add('$where: condition invalide « $raw » : $e');
    return null;
  }
}

List<int> _intPair(Object? raw, List<int> fallback) {
  if (raw is List && raw.length >= 2) return [(raw.first as num).toInt(), (raw.last as num).toInt()];
  if (raw is List && raw.length == 1) return [(raw.first as num).toInt(), (raw.first as num).toInt()];
  if (raw is num) return [raw.toInt(), raw.toInt()];
  return fallback;
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
      case 'enemy':
        out[k] = (v as List).map((e) => e.toString()).toList();
        break;
      case 'relation':
        out[k] = (v as Map).map((rk, rv) => MapEntry(rk.toString(), rv is int ? rv : _sym(rv.toString(), relation: true)));
        break;
      case 'var':
        out[k] = (v as Map).map((rk, rv) => MapEntry(rk.toString(), rv.toString()));
        break;
      case 'schedule':
        out[k] = (v as List).map((e) {
          final sm = (e as Map).cast<String, dynamic>();
          final o = <String, dynamic>{'card': sm['card'], 'in': _intPair(sm['in'], [1, 3])};
          if (sm['fallback'] != null) o['fallback'] = sm['fallback'].toString();
          if (sm['same_club'] == false) o['same_club'] = false;
          final ci = _parseWhen(sm['cancel_if'], errors, '$where/schedule');
          if (ci != null) o['cancel_if'] = ci;
          return o;
        }).toList();
        break;
      case 'next':
        if (v is String) {
          if (v != 'end' && v != 'abort') errors.add('$where: next « $v » inconnu (end | abort | {step, in})');
          out[k] = v;
        } else {
          final nm = (v as Map).cast<String, dynamic>();
          out[k] = {
            'step': nm['step'].toString(),
            'in': _intPair(nm['in'], [1, 3]),
            if (nm['this_season'] == true) 'this_season': true,
          };
        }
        break;
      case 'arc':
        out[k] = (v as List).map((e) {
          final am = (e as Map).cast<String, dynamic>();
          return {'id': am['id'].toString(), 'status': am['status']?.toString() ?? 'done'};
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

/// `card: id` or `card: [{id, if}, …]` → list of variants (compiled `if`).
List<Map<String, dynamic>> _variants(Object? raw, List<String> errors, String where) {
  if (raw == null) {
    errors.add('$where: carte manquante');
    return const [];
  }
  if (raw is String) return [{'id': raw}];
  final out = <Map<String, dynamic>>[];
  for (final v in (raw as List)) {
    if (v is String) {
      out.add({'id': v});
    } else {
      final vm = (v as Map).cast<String, dynamic>();
      final ifAst = _parseWhen(vm['if'], errors, '$where/if');
      out.add({'id': vm['id'].toString(), if (ifAst != null) 'if': ifAst});
    }
  }
  if (out.isNotEmpty && out.last.containsKey('if')) {
    errors.add('$where: la dernière variante doit être sans `if`');
  }
  return out;
}

Map<String, dynamic> _compileStep(dynamic raw, List<String> errors, String where) {
  final m = (raw as Map).cast<String, dynamic>();
  final id = m['id'].toString();
  final at = m['at'] == null ? null : _intPair(m['at'], [1, 1]);
  final next = <Map<String, dynamic>>[];
  for (final e in (m['next'] as List?) ?? const []) {
    final nm = (e as Map).cast<String, dynamic>();
    final ifAst = _parseWhen(nm['if'], errors, '$where/$id/next');
    next.add({
      'step': nm['step'].toString(),
      if (ifAst != null) 'if': ifAst,
      'in': _intPair(nm['in'], [1, 3]),
      if (nm['this_season'] == true) 'this_season': true,
    });
  }
  if (at != null && (next.isNotEmpty || m['in'] != null)) {
    errors.add('$where/$id: une étape à `at` ne peut pas avoir `in` ni `next`');
  }
  if (at != null && (at[0] < 1 || at[1] < at[0] || at[1] > 17)) {
    errors.add('$where/$id: fenêtre `at` [${at[0]}, ${at[1]}] hors 1..17');
  }
  return {
    'id': id,
    'card': _variants(m['card'], errors, '$where/$id'),
    if (at != null) 'at': at,
    'season': m['season']?.toString() ?? '0',
    'next': next,
    if (m['on_expire'] != null) 'on_expire': m['on_expire'].toString(),
    if (m['this_season'] == true) 'this_season': true,
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
  final roleIds = roles.map((r) => r['id'].toString()).toSet();

  // Calendar (+ director config).
  final calendarDoc = (_loadYaml('calendar.yaml') as Map).cast<String, dynamic>();
  final calendarRaw = calendarDoc['roles'] as Map;
  final calendar = <String, dynamic>{};
  calendarRaw.forEach((role, phases) {
    calendar[role.toString()] = (phases as List)
        .map((p) => {'phase': (p as Map)['phase'], 'beats': (p['beats'] as List).map((b) => b.toString()).toList()})
        .toList();
  });
  final director = (calendarDoc['director'] as Map?)?.cast<String, dynamic>() ?? <String, dynamic>{};

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

  // Characters.
  final characters = <Map<String, dynamic>>[];
  final characterIds = <String>{};
  for (final c in ((_loadYaml('characters.yaml') as Map?)?['characters'] as List?) ?? const []) {
    final cm = Map<String, dynamic>.of((c as Map).cast<String, dynamic>());
    final id = cm['id'].toString();
    characterIds.add(id);
    final onRel = <String, dynamic>{};
    ((cm['on_relation'] as Map?) ?? const {}).forEach((k, v) {
      onRel[k.toString()] = _variants(v, errors, 'characters/$id/on_relation/$k');
    });
    cm['on_relation'] = onRel;
    characters.add(cm);
  }

  // Portraits (paper dolls) : une fiche par personnage + coach / joueur.
  final portraits = _loadPortraits(characters, characterIds, errors);

  // Alarms.
  final alarms = <String, dynamic>{};
  ((_loadYaml('alarms.yaml') as Map?)?['alarms'] as Map?)?.forEach((role, byKey) {
    final m = <String, dynamic>{};
    (byKey as Map).forEach((key, list) {
      m[key.toString()] = (list as List).map((e) {
        if (e is String) return {'card': e};
        final em = (e as Map).cast<String, dynamic>();
        final w = _parseWhen(em['when'], errors, 'alarms/$role/$key');
        return {'card': em['card'].toString(), if (w != null) 'when': w};
      }).toList();
    });
    alarms[role.toString()] = m;
  });

  // Arcs.
  final arcs = <Map<String, dynamic>>[];
  for (final f in _yamlFiles('arcs')) {
    final rel = f.path.substring(contentDir.length + 1);
    final doc = _yamlToDart(loadYaml(f.readAsStringSync()));
    final list = doc is Map ? (doc['arcs'] as List? ?? const []) : (doc as List);
    for (final raw in list) {
      final m = Map<String, dynamic>.of((raw as Map).cast<String, dynamic>());
      final id = m['id'].toString();
      final kind = m['kind']?.toString() ?? 'serie';
      if (!const {'serie', 'postulat', 'evenement'}.contains(kind)) errors.add('$rel: arc $id: kind « $kind » inconnu');
      final compiled = <String, dynamic>{
        'id': id,
        if (m['title'] != null) 'title': m['title'].toString(),
        'kind': kind,
        'roles': (m['roles'] as List?)?.map((e) => e.toString()).toList() ?? const [],
        'postulats': (m['postulats'] as List?)?.map((e) => e.toString()).toList() ?? const [],
        'foreground': m['foreground'] != false,
        'weight': (m['weight'] as num?)?.toDouble() ?? 1.0,
        'once': m['once'] != false,
        'every_season': m['every_season'] == true,
        'min_season': (m['min_season'] as num?)?.toInt() ?? 0,
        'chance': (m['chance'] as num?)?.toDouble() ?? 0,
        'cast': (m['cast'] as List?)?.map((e) => e.toString()).toList() ?? const [],
        'start': _intPair(m['start'], [2, 7]),
        'same_club': m['same_club'] != false,
        'fallback': m['fallback']?.toString() ?? (kind == 'serie' ? 'nouvelles' : 'drop'),
        'epilogue': _resolveEffects(m['epilogue'], errors, '$rel/$id/epilogue'),
        'steps': ((m['steps'] as List?) ?? const []).map((s) => _compileStep(s, errors, '$rel/$id')).toList(),
      };
      final w = _parseWhen(m['when'], errors, '$rel/$id/when');
      if (w != null) compiled['when'] = w;
      final ci = _parseWhen(m['cancel_if'], errors, '$rel/$id/cancel_if');
      if (ci != null) compiled['cancel_if'] = ci;
      for (final r in compiled['roles'] as List) {
        if (!roleIds.contains(r)) errors.add('$rel: arc $id: rôle inconnu « $r »');
      }
      // `next` targets must exist; `at` windows of a season must be disjoint and increasing.
      final stepIds = (compiled['steps'] as List).map((s) => (s as Map)['id'].toString()).toSet();
      final atBySeason = <String, List<List<int>>>{};
      for (final s in compiled['steps'] as List) {
        final sm = s as Map<String, dynamic>;
        for (final nx in sm['next'] as List) {
          if (!stepIds.contains((nx as Map)['step'])) errors.add('$rel: arc $id: étape ${sm['id']} → next « ${nx['step']} » inconnue');
        }
        if (sm['at'] != null) (atBySeason[sm['season'].toString()] ??= []).add((sm['at'] as List).cast<int>());
      }
      atBySeason.forEach((season, wins) {
        for (var i = 1; i < wins.length; i++) {
          if (wins[i][0] <= wins[i - 1][1]) errors.add('$rel: arc $id: fenêtres `at` non disjointes/croissantes en saison $season');
        }
      });
      if (kind == 'postulat' && (compiled['steps'] as List).any((s) => (s as Map)['at'] == null)) {
        errors.add('$rel: arc $id: toutes les étapes d\'un arc postulat doivent avoir `at`');
      }
      arcs.add(compiled);
    }
  }
  final arcById = {for (final a in arcs) a['id'].toString(): a};

  // Postulats.
  final postulats = <Map<String, dynamic>>[];
  final postulatList = ((_loadYaml('postulats.yaml') as Map?)?['postulats'] as List?) ?? const [];
  for (var i = 0; i < postulatList.length; i++) {
    final m = Map<String, dynamic>.of((postulatList[i] as Map).cast<String, dynamic>());
    final id = m['id'].toString();
    final idx = (m['index'] as num?)?.toInt() ?? i;
    if (idx != i) errors.add('postulats: $id: index $idx ≠ position $i');
    m['index'] = idx;
    if (!roleIds.contains(m['role'])) errors.add('postulats: $id: rôle inconnu « ${m['role']} »');
    if (m['president'] != null && !characterIds.contains(m['president'])) errors.add('postulats: $id: président inconnu « ${m['president']} »');
    if (m['opening_arc'] != null) {
      final oa = arcById[m['opening_arc'].toString()];
      if (oa == null) {
        errors.add('postulats: $id: opening_arc « ${m['opening_arc']} » inexistant');
      } else if (oa['kind'] != 'postulat') {
        errors.add('postulats: $id: opening_arc « ${m['opening_arc']} » n\'est pas de kind postulat');
      }
    }
    final seeds = <Map<String, dynamic>>[];
    for (final sd in (m['seeds'] as List?) ?? const []) {
      final sm = Map<String, dynamic>.of((sd as Map).cast<String, dynamic>());
      final arc = arcById[sm['arc'].toString()];
      if (arc == null) {
        errors.add('postulats: $id: seed d\'arc inexistant « ${sm['arc']} »');
      } else if (!(arc['roles'] as List).contains(m['role'])) {
        errors.add('postulats: $id: seed « ${sm['arc']} » est d\'un autre rôle');
      }
      final ifAst = _parseWhen(sm['if'], errors, 'postulats/$id/seeds');
      seeds.add({
        'arc': sm['arc'].toString(),
        'season': (sm['season'] as num?)?.toInt() ?? 0,
        'at': _intPair(sm['at'], [1, 17]),
        if (ifAst != null) 'if': ifAst,
      });
    }
    m['seeds'] = seeds;
    final overrides = <String, dynamic>{};
    ((m['alarm_overrides'] as Map?) ?? const {}).forEach((key, list) {
      overrides[key.toString()] = (list as List).map((e) {
        if (e is String) return {'card': e};
        final em = (e as Map).cast<String, dynamic>();
        final w = _parseWhen(em['when'], errors, 'postulats/$id/alarm_overrides/$key');
        return {'card': em['card'].toString(), if (w != null) 'when': w};
      }).toList();
    });
    m['alarm_overrides'] = overrides;
    postulats.add(m);
  }

  // Cards: every yaml under cards/.
  final cards = <Map<String, dynamic>>[];
  final rawById = <String, Map<String, dynamic>>{};
  final seenIds = <String>{};
  for (final f in _yamlFiles('cards')) {
    final rel = f.path.substring(contentDir.length + 1);
    final doc = _yamlToDart(loadYaml(f.readAsStringSync()));
    final list = doc is Map ? doc['cards'] as List : doc as List;
    for (final raw in list) {
      final m = (raw as Map).cast<String, dynamic>();
      final id = m['id'] as String;
      if (!seenIds.add(id)) errors.add('$rel: id en double "$id"');
      final whenAst = _parseWhen(m['when'], errors, '$rel/$id/when');
      final explicitKind = m['kind']?.toString();
      if (explicitKind != null && explicitKind != 'passe' && explicitKind != 'nouvelle') {
        errors.add('$rel: $id: kind « $explicitKind » ne peut pas être écrit à la main (seuls passe/nouvelle)');
      }
      final tone = m['tone']?.toString() ?? 'leger';
      if (!const {'leger', 'strategique', 'drame'}.contains(tone)) errors.add('$rel: $id: tone « $tone » inconnu');
      final card = <String, dynamic>{
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
        'tone': tone,
        'kind': explicitKind ?? 'routine',
        if (m['title'] != null) 'title': m['title'].toString(),
      };
      if (m['pool'] == true) card['pool'] = true;
      cards.add(card);
      rawById[id] = m;
    }
  }
  final cardById = {for (final c in cards) c['id'].toString(): c};

  // --- Derivations (spec §2.9): kind / arcId / stepId, pool, sablier, defaults.
  final mechanism = <String, String>{}; // card id -> which mechanism claimed it
  void claim(String cardId, String kind, String by, {String? arcId, String? stepId}) {
    final c = cardById[cardId];
    if (c == null) {
      errors.add('$by: carte inexistante « $cardId »');
      return;
    }
    final prev = mechanism[cardId];
    // An alarm card may be listed both in the role's alarms and in a postulat's
    // alarm_overrides: that is still one mechanism (alarme), not two.
    final sameAlarm = kind == 'alarme' && prev != null && prev.startsWith('alarms/');
    if (prev != null && prev != by && !sameAlarm) {
      errors.add('$cardId: référencée par deux mécanismes ($prev et $by)');
      return;
    }
    mechanism[cardId] = by;
    c['kind'] = kind;
    if (arcId != null) c['arcId'] = arcId;
    if (stepId != null) c['stepId'] = stepId;
  }

  for (final a in arcs) {
    final arcId = a['id'].toString();
    final kind = a['kind'] == 'postulat' ? 'script' : (a['kind'] == 'evenement' ? 'evenement' : 'etape');
    for (final s in a['steps'] as List) {
      final sm = s as Map<String, dynamic>;
      for (final v in sm['card'] as List) {
        final cid = (v as Map)['id'].toString();
        claim(cid, kind, 'arc $arcId', arcId: arcId, stepId: sm['id'].toString());
        final c = cardById[cid];
        if (c != null) {
          for (final r in a['roles'] as List) {
            if (!(c['roles'] as List).contains(r)) errors.add('$cid: étape de l\'arc $arcId mais ne joue pas le rôle « $r »');
          }
        }
      }
    }
  }
  alarms.forEach((role, byKey) {
    (byKey as Map).forEach((key, list) {
      for (final e in list as List) {
        final cid = (e as Map)['card'].toString();
        claim(cid, 'alarme', 'alarms/$role/$key');
        final c = cardById[cid];
        final raw = rawById[cid];
        if (c != null && raw != null) {
          if (raw['tone'] == null) c['tone'] = 'strategique';
          if (raw['cooldown'] == null) c['cooldown'] = 10;
        }
      }
    });
  });
  for (final p in postulats) {
    (p['alarm_overrides'] as Map).forEach((key, list) {
      for (final e in list as List) {
        final cid = (e as Map)['card'].toString();
        claim(cid, 'alarme', 'alarms/${p['id']}/$key');
      }
    });
  }
  for (final ch in characters) {
    (ch['on_relation'] as Map).forEach((t, variants) {
      for (final v in variants as List) {
        final cid = (v as Map)['id'].toString();
        claim(cid, 'palier', 'characters/${ch['id']}/on_relation/$t');
        final c = cardById[cid];
        if (c != null && c['once'] != true) errors.add('$cid: une carte de palier (on_relation) doit être once: true');
      }
    });
  }
  for (final c in cards) {
    // A hand-written kind (passe/nouvelle) is kept; otherwise `arc: nouvelle` makes a Nouvelle.
    if (mechanism[c['id']] == null && c['kind'] == 'routine' && c['arc'] == 'nouvelle') c['kind'] = 'nouvelle';
  }
  // Schedule targets are queue-only unless `pool: true` is written.
  final scheduleTargets = <String>{};
  void scanSchedules(Map<String, dynamic>? eff) {
    if (eff == null) return;
    for (final sc in (eff['schedule'] as List?) ?? const []) {
      scheduleTargets.add((sc as Map)['card'].toString());
    }
    for (final b in (eff['rand'] as List?) ?? const []) {
      scanSchedules((b as Map).cast<String, dynamic>());
    }
  }

  for (final c in cards) {
    for (final side in ['left', 'right']) {
      scanSchedules((c[side] as Map)['effects'] as Map<String, dynamic>?);
    }
  }
  for (final c in cards) {
    final id = c['id'].toString();
    final routine = c['kind'] == 'routine';
    c['pool'] = c['pool'] == true || (routine && !scheduleTargets.contains(id));
    if (!routine) c['pool'] = c['pool'] == true && routine;
    // sablier: a choice schedules/branches far enough, or the step's default next does.
    bool far = false;
    for (final side in ['left', 'right']) {
      final eff = (c[side] as Map)['effects'] as Map<String, dynamic>;
      for (final sc in (eff['schedule'] as List?) ?? const []) {
        if (((sc as Map)['in'] as List).last as int >= 6) far = true;
      }
      final nx = eff['next'];
      if (nx is Map && (nx['in'] as List).last as int >= 6) far = true;
    }
    if (c['arcId'] != null) {
      final arc = arcById[c['arcId']];
      final step = (arc?['steps'] as List?)?.cast<Map<String, dynamic>>().firstWhere((s) => s['id'] == c['stepId'], orElse: () => {});
      for (final nx in (step?['next'] as List?) ?? const []) {
        if (((nx as Map)['in'] as List).last as int >= 6) far = true;
      }
    }
    final raw = rawById[id]!;
    if (raw['sablier'] == false) {
      c['sablier'] = false;
    } else if (raw['sablier'] == true || far) {
      c['sablier'] = true;
    }
    // Validations on the derived shape.
    if ((c['priority'] as int) > 0 && c['pool'] != true) errors.add('$id: priority > 0 sur une carte hors du sac');
    if (c['tone'] == 'drame' && (c['once'] != true || c['pool'] == true)) errors.add('$id: une carte drame doit être once: true et hors du sac');
    for (final side in ['left', 'right']) {
      final eff = (c[side] as Map)['effects'] as Map<String, dynamic>;
      if (eff['next'] != null) {
        if (c['arcId'] == null) {
          errors.add('$id/$side: `next` sur une carte qui n\'est pas une étape d\'arc');
        } else if (eff['next'] is Map) {
          final arc = arcById[c['arcId']]!;
          final ids = (arc['steps'] as List).map((s) => (s as Map)['id']).toSet();
          if (!ids.contains((eff['next'] as Map)['step'])) errors.add('$id/$side: next → étape « ${(eff['next'] as Map)['step']} » inconnue dans ${c['arcId']}');
        }
      }
      for (final sc in (eff['schedule'] as List?) ?? const []) {
        final target = cardById[(sc as Map)['card'].toString()];
        if (target != null && target['arcId'] != null) {
          final arc = arcById[target['arcId']]!;
          if (!(arc['roles'] as List).any((r) => (c['roles'] as List).contains(r))) {
            errors.add('$id/$side: schedule vers une étape d\'un arc d\'un autre rôle (${target['id']})');
          }
        }
      }
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
    'characters': characters,
    'arcs': arcs,
    'postulats': postulats,
    'alarms': alarms,
    'director': director,
    'portraits': portraits,
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

  final nPool = cards.where((c) => c['pool'] == true).length;
  stdout.writeln('OK: ${cards.length} cartes ($nPool dans le sac), ${arcs.length} arcs, ${postulats.length} postulats, '
      '${characters.length} personnages (${portraits.length} portraits), ${roles.length} rôles, ${endings.length} fins, ${feats.length} destins '
      '→ content/build/content.json (hash $hash)');
}

/// Valeurs autorisées des fiches de portraits (content/portraits.yaml) ; les
/// deux générateurs (portraits.js, portrait.dart) connaissent les mêmes.
const Map<String, List<String>> _portraitEnums = {
  'teint': ['porcelaine', 'clair', 'dore', 'olive', 'brun', 'ebene'],
  'corpulence': ['fin', 'moyen', 'large'],
  'age': ['jeune', 'mur', 'age'],
  'coiffure': ['chauve', 'degarni', 'court', 'brosse', 'meche', 'mulet', 'boucle', 'carre', 'chignon', 'queue', 'long', 'casquette'],
  'coiffure_f': ['chauve', 'degarni', 'court', 'brosse', 'meche', 'mulet', 'boucle', 'carre', 'chignon', 'queue', 'long', 'casquette'],
  'cheveux': ['noir', 'brun', 'chatain', 'roux', 'blond', 'gris', 'blanc'],
  'pilosite': ['rase', 'moustache', 'barbe', 'bouc'],
  'lunettes': ['aucune', 'rondes', 'carrees', 'aviateur'],
  'tenue': ['costume', 'tailleur', 'chemise', 'survetement', 'maillot', 'gardien', 'blouse', 'pull', 'doudoune', 'veste'],
  'accessoire': ['aucun', 'echarpe', 'chewing_gum', 'stylo', 'carnet', 'brassard', 'sifflet', 'micro', 'stethoscope', 'badge', 'journal', 'telephone', 'montre'],
};
const List<String> _portraitColours = [
  'bordeaux', 'marine', 'anthracite', 'noir', 'pelouse', 'creme', 'blanc', 'gris', 'bleu', 'ciel', 'orange', 'rouge', 'camel',
  'violet', 'beige', 'bouteille', 'jaune', 'rose', 'prune',
];
const List<String> _portraitColourKeys = ['couleur', 'couleur2', 'coiffe', 'couleur_accessoire'];
const List<String> _portraitRequired = ['teint', 'corpulence', 'age', 'coiffure', 'cheveux', 'pilosite', 'lunettes', 'tenue', 'couleur', 'accessoire'];

/// Charge content/portraits.yaml → table { id: fiche } pour le bundle. Chaque
/// personnage de characters.yaml doit avoir une fiche ; chaque fiche doit viser
/// un personnage connu ou « coach » / « joueur » ; les valeurs d'énumération
/// sont contrôlées. Le genre de characters.yaml est recopié dans la fiche.
Map<String, dynamic> _loadPortraits(List<Map<String, dynamic>> characters, Set<String> characterIds, List<String> errors) {
  final out = <String, dynamic>{};
  final raw = (_loadYaml('portraits.yaml') as Map?)?['portraits'];
  if (raw == null) {
    if (characterIds.isNotEmpty) errors.add('portraits: content/portraits.yaml manquant ou vide');
    return out;
  }
  final genres = {for (final c in characters) c['id'].toString(): c['genre']?.toString()};
  (raw as Map).forEach((idRaw, fiche) {
    final id = idRaw.toString();
    if (!characterIds.contains(id) && id != 'coach' && id != 'joueur') {
      errors.add('portraits: $id: ni personnage de characters.yaml ni coach / joueur');
      return;
    }
    if (fiche is! Map) {
      errors.add('portraits: $id: fiche invalide (attendu une table de traits)');
      return;
    }
    final m = <String, dynamic>{};
    fiche.forEach((k, v) => m[k.toString()] = v is String ? v : v?.toString());
    for (final key in _portraitRequired) {
      if (m[key] == null) errors.add('portraits: $id: trait « $key » manquant');
    }
    for (final e in _portraitEnums.entries) {
      final v = m[e.key];
      if (v != null && !e.value.contains(v)) errors.add('portraits: $id: ${e.key} « $v » inconnu (attendu ${e.value.join(' | ')})');
    }
    for (final key in _portraitColourKeys) {
      final v = m[key];
      if (v != null && !_portraitColours.contains(v)) errors.add('portraits: $id: $key « $v » hors palette (${_portraitColours.join(' | ')})');
    }
    if (m['coiffure_f'] != null && id != 'coach' && id != 'joueur') errors.add('portraits: $id: coiffure_f est réservé à coach / joueur');
    if (genres[id] != null) m['genre'] = genres[id];
    out[id] = m;
  });
  for (final id in characterIds) {
    if (!out.containsKey(id)) errors.add('portraits: $id (characters.yaml) n\'a pas de fiche dans portraits.yaml');
  }
  for (final id in const ['coach', 'joueur']) {
    if (!out.containsKey(id)) errors.add('portraits: la fiche « $id » (joueur incarné) est obligatoire');
  }
  return out;
}
