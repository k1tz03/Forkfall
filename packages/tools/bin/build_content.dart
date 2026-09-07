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

/// Les documents d'une clef, lus dans le fichier unique `file` **et** dans le
/// dossier `dir/*.yaml` (chargeur par dossier, anti-conflit d'écriture) :
/// chaque salle écrit son fichier, le build les concatène dans l'ordre des
/// chemins. Retourne (origine lisible, liste d'entrées).
List<MapEntry<String, List<dynamic>>> _docsOf(String file, String dir, String key) {
  final out = <MapEntry<String, List<dynamic>>>[];
  final single = _loadYaml(file);
  if (single is Map && single[key] is List) out.add(MapEntry(file, single[key] as List));
  for (final f in _yamlFiles(dir)) {
    final rel = f.path.substring(contentDir.length + 1);
    final doc = _yamlToDart(loadYaml(f.readAsStringSync()));
    if (doc is Map && doc[key] is List) out.add(MapEntry(rel, doc[key] as List));
  }
  return out;
}

List<File> _yamlFiles(String rel) {
  final root = Directory('$contentDir/$rel');
  if (!root.existsSync()) return const [];
  final files = root.listSync(recursive: true).whereType<File>().where((f) => f.path.endsWith('.yaml')).toList();
  files.sort((a, b) => a.path.compareTo(b.path));
  return files;
}

late Map<String, int> balance;
late Set<String> roleIdsGlobal;

/// Les statuts d'un personnage (charte de la bible § 2.4 et § 2.4 bis,
/// spec variété §1.10) — la même énumération que `kStatuts` du moteur.
const Set<String> kStatuts = {'present', 'club', 'vendu', 'staff', 'parti', 'retraite', 'rival', 'mort'};

/// Les beats moteur dont le texte est auteurisable (content/setpieces.yaml).
const List<String> kSetpieceBeats = [
  'objective', 'match', 'cup', 'gm_annonce', 'gm_te', 'aftermatch',
  'bilan_verdict', 'bilan_contrat', 'bilan_carrefour',
];

/// « où|id » de chaque effet `char:` rencontré : le personnage est vérifié
/// une fois le casting chargé.
final List<String> charEffectIds = [];

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
            ..._longFuse(nm, errors, '$where/next'),
          };
        }
        break;
      case 'outcome':
        out[k] = v.toString();
        break;
      case 'react':
        out[k] = _compileReact(v, errors, '$where/react');
        break;
      case 'journal':
        out[k] = _compileJournalOp(v, errors, '$where/journal');
        break;
      case 'arc':
        out[k] = (v as List).map((e) {
          final am = (e as Map).cast<String, dynamic>();
          return {'id': am['id'].toString(), 'status': am['status']?.toString() ?? 'done'};
        }).toList();
        break;
      case 'char':
        // `char: {mbako: vendu}` ou `{mbako: {statut: vendu, age: "+1"}}`
        // (spec variété §1.10) : le statut appartient à `kStatuts`.
        out[k] = (v as Map).map((rk, rv) {
          final id = rk.toString();
          final om = rv is Map ? rv.cast<String, dynamic>() : <String, dynamic>{'statut': rv.toString()};
          final statut = om['statut']?.toString();
          if (statut != null && !kStatuts.contains(statut)) {
            errors.add('$where/char/$id: statut « $statut » inconnu (${kStatuts.join(' | ')})');
          }
          if (om['statut'] == null && om['age'] == null) errors.add('$where/char/$id: ni `statut` ni `age`');
          charEffectIds.add('$where|$id');
          return MapEntry(id, {
            if (statut != null) 'statut': statut,
            if (om['age'] != null) 'age': om['age'].toString(),
          });
        });
        break;
      case 'club':
        {
          // `club: {change: true, division: n}` (spec variété §1.11).
          final cm = v is Map ? v.cast<String, dynamic>() : <String, dynamic>{'change': v == true};
          final div = (cm['division'] as num?)?.toInt();
          if (div != null && (div < 1 || div > 2)) errors.add('$where/club: division $div hors 1..2');
          if (cm['change'] == false) errors.add('$where/club: `change: false` n\'a pas de sens (retirer l\'effet)');
          // `retour: true` : rendre le club d'origine au lieu d'en tirer un neuf.
          final retour = cm['retour'] == true;
          out[k] = {'change': true, if (div != null) 'division': div, if (retour) 'retour': true};
        }
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

/// `react: card | [{card, if?, chance?}]` (spec variété §1.4) : la dernière
/// variante est sans `if` ; `chance` ∈ (0, 1].
List<Map<String, dynamic>> _compileReact(Object? raw, List<String> errors, String where) {
  if (raw == null) return const [];
  final list = raw is List ? raw : [raw];
  final out = <Map<String, dynamic>>[];
  for (final v in list) {
    if (v is String) {
      out.add({'card': v});
      continue;
    }
    final vm = (v as Map).cast<String, dynamic>();
    if (vm['card'] == null) {
      errors.add('$where: variante de react sans `card`');
      continue;
    }
    final o = <String, dynamic>{'card': vm['card'].toString()};
    final ifAst = _parseWhen(vm['if'], errors, '$where/if');
    if (ifAst != null) o['if'] = ifAst;
    if (vm['chance'] != null) {
      final ch = (vm['chance'] as num).toDouble();
      if (ch <= 0 || ch > 1) errors.add('$where: chance $ch hors (0, 1]');
      o['chance'] = ch;
    }
    out.add(o);
  }
  if (out.isEmpty) errors.add('$where: react vide');
  // Une variante unique peut porter un `if` (pas de réaction s'il est faux) ; une liste finit sans `if`.
  if (out.length > 1 && out.last.containsKey('if')) errors.add('$where: la dernière variante de react doit être sans `if`');
  return out;
}

/// `journal: "texte" | {text, poids 1..3, tags}` (spec variété §1.7) ; ≤ 120 caractères.
Object _compileJournalOp(Object? raw, List<String> errors, String where) {
  if (raw is String) {
    if (raw.length > 120) errors.add('$where: ligne de journal de ${raw.length} caractères (> 120)');
    return raw;
  }
  final m = (raw as Map).cast<String, dynamic>();
  final text = m['text']?.toString() ?? '';
  if (text.isEmpty) errors.add('$where: journal sans `text`');
  if (text.length > 120) errors.add('$where: ligne de journal de ${text.length} caractères (> 120)');
  final poids = (m['poids'] as num?)?.toInt() ?? 1;
  if (poids < 1 || poids > 3) errors.add('$where: journal.poids $poids hors 1..3');
  return {'text': text, 'poids': poids, if (m['tags'] != null) 'tags': _strList(m['tags'])};
}

/// Vrai si un `when` compilé lit `bilan.tenu` / `bilan.rang` (valides
/// seulement dans une manchette, un set-piece de bilan ou un epitaph_plus).
bool _readsBilan(Object? node) {
  if (node is! List || node.isEmpty) return false;
  if (node[0] == 'path' && node.length > 1 && node[1].toString().startsWith('bilan.')) return true;
  return node.any(_readsBilan);
}

/// `at_season: +k` + `at: [a, b]` sur un `next` (fusée longue, spec variété §1.3).
Map<String, dynamic> _longFuse(Map<String, dynamic> nm, List<String> errors, String where) {
  if (nm['at_season'] == null) {
    if (nm['at'] != null) errors.add('$where: `at` sans `at_season`');
    return const {};
  }
  final raw = nm['at_season'];
  final k = raw is num ? raw.toInt() : int.tryParse(raw.toString().replaceAll('+', '').trim());
  if (k == null || k < 1) {
    errors.add('$where: at_season « $raw » invalide (attendu +1, +2, …)');
    return const {};
  }
  final at = _intPair(nm['at'], [1, 3]);
  if (at[0] < 1 || at[1] < at[0] || at[1] > 17) errors.add('$where: fenêtre `at` [${at[0]}, ${at[1]}] hors 1..17');
  return {'at_season': k, 'at': at};
}

/// L'épilogue est un jeu d'effets qui garde en plus sa clé `journal` (ligne
/// d'Almanach écrite à la clôture, spec variété §1.3).
Map<String, dynamic> _compileEpilogue(dynamic raw, List<String> errors, String where) {
  if (raw == null) return {};
  final m = Map<String, dynamic>.of((raw as Map).cast<String, dynamic>());
  final journal = m.remove('journal');
  final out = _resolveEffects(m, errors, where);
  if (journal != null) out['journal'] = journal.toString();
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
      ..._longFuse(nm, errors, '$where/$id/next'),
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
    if (m['outcome'] != null) 'outcome': m['outcome'].toString(),
    if (m['statut_ok'] != null) 'statut_ok': _statutOk(m['statut_ok'], errors, '$where/$id'),
  };
}

/// `statut_ok: [parti, retraite]` (spec variété §1.10) : les statuts qui
/// laissent quand même parler le locuteur.
List<String> _statutOk(Object? raw, List<String> errors, String where) {
  final out = _strList(raw);
  for (final st in out) {
    if (!kStatuts.contains(st)) errors.add('$where/statut_ok: statut « $st » inconnu (${kStatuts.join(' | ')})');
    if (kStatutsParlants.contains(st)) errors.add('$where/statut_ok: « $st » parle déjà par défaut (à retirer)');
  }
  return out;
}

/// Les statuts qui parlent sans `statut_ok:` (même table que le moteur).
const Set<String> kStatutsParlants = {'present', 'club', 'staff'};

List<String> _strList(Object? raw) => (raw as List?)?.map((e) => e.toString()).toList() ?? const [];

/// `replay: never | ritual | {after, max, after_abort}` → json ou null.
Object? _compileReplay(Object? raw, List<String> errors, String where) {
  if (raw == null) return null;
  if (raw is String) {
    if (raw == 'never') return null;
    if (raw == 'ritual') return {'ritual': true};
    errors.add('$where: replay « $raw » inconnu (never | ritual | {after, max, after_abort})');
    return null;
  }
  final m = (raw as Map).cast<String, dynamic>();
  if (m['ritual'] == true) return {'ritual': true};
  final after = (m['after'] as num?)?.toInt() ?? 1;
  final max = (m['max'] as num?)?.toInt() ?? 2;
  if (after < 1) errors.add('$where: replay.after doit être ≥ 1');
  if (max < 2) errors.add('$where: replay.max doit être ≥ 2 (la première ouverture compte)');
  return {'after': after, 'max': max, if (m['after_abort'] == true) 'after_abort': true};
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
  final roleById = {for (final r in roles) r['id'].toString(): r};
  roleIdsGlobal = roleIds;

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

  // Endings, feats. Les fins se lisent dans content/endings.yaml **et** dans
  // content/endings/*.yaml (un fichier par lot d'écriture : deux salles ne se
  // marchent pas dessus). Les ids sont uniques d'un fichier à l'autre.
  final endings = <Map<String, dynamic>>[];
  final endingIdsSeen = <String, String>{};
  for (final entry in _docsOf('endings.yaml', 'endings', 'endings')) {
    final from = entry.key;
    for (final e in entry.value) {
    final em = Map<String, dynamic>.of((e as Map).cast<String, dynamic>());
    final eid = em['id'].toString();
    final prev = endingIdsSeen[eid];
    if (prev != null) errors.add('$from: fin « $eid » déjà déclarée dans $prev');
    endingIdsSeen[eid] = from;
    // `epitaph_plus` (spec variété §2.6) : ≤ 2 variantes {when, text}, `when` compilé.
    final plus = <Map<String, dynamic>>[];
    for (final v in (em['epitaph_plus'] as List?) ?? const []) {
      final vm = (v as Map).cast<String, dynamic>();
      final w = _parseWhen(vm['when'], errors, 'endings/$eid/epitaph_plus');
      if (vm['text'] == null) errors.add('endings/$eid/epitaph_plus: variante sans `text`');
      plus.add({if (w != null) 'when': w, 'text': vm['text']?.toString() ?? ''});
    }
    if (plus.length > 2) errors.add('endings/$eid: ${plus.length} epitaph_plus (au plus 2)');
    em['epitaph_plus'] = plus;
    if (em['rebond'] != null) {
      final rm = (em['rebond'] as Map).cast<String, dynamic>();
      final w = _parseWhen(rm['when'], errors, 'endings/$eid/rebond');
      em['rebond'] = {if (w != null) 'when': w, if (rm['postulat'] != null) 'postulat': rm['postulat'].toString()};
    }
    endings.add(em);
    }
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
  // Liste noire des noms saisis (spec variété §1.8) : mots, sans casse.
  final blacklist = _strList((_loadYaml('names/blacklist.yaml') as Map?)?['blacklist']).map((w) => w.toLowerCase().trim()).where((w) => w.isNotEmpty).toList();
  // Gabarits moteur de l'Almanach (spec variété §2.8).
  final journalTemplates = <String, String>{};
  ((_loadYaml('journal.yaml') as Map?)?['auto'] as Map?)?.forEach((k, v) {
    final t = v.toString();
    if (t.length > 120) errors.add('journal.yaml/auto/$k: gabarit de ${t.length} caractères (> 120)');
    journalTemplates[k.toString()] = t;
  });

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
    // `adresse` (spec variété §2.5) : rôle → {sourire, neutre, noir}, complète quand présente.
    final adresse = <String, dynamic>{};
    ((cm['adresse'] as Map?) ?? const {}).forEach((role, byExpr) {
      final r = role.toString();
      if (!roleIdsGlobal.contains(r)) errors.add('characters/$id/adresse: rôle inconnu « $r »');
      final m = <String, String>{};
      ((byExpr as Map?) ?? const {}).forEach((k, v) => m[k.toString()] = v.toString());
      for (final e in const ['sourire', 'neutre', 'noir']) {
        if (!m.containsKey(e)) errors.add('characters/$id/adresse/$r: expression « $e » manquante');
      }
      for (final k in m.keys) {
        if (!const {'sourire', 'neutre', 'noir'}.contains(k)) errors.add('characters/$id/adresse/$r: expression inconnue « $k »');
        if (m[k]!.contains('{toi}') || m[k]!.contains('{Toi}')) errors.add('characters/$id/adresse/$r/$k: une adresse ne peut pas citer {toi}');
      }
      adresse[r] = m;
    });
    if (adresse.isNotEmpty) {
      for (final r in roleIdsGlobal) {
        if (!adresse.containsKey(r)) errors.add('characters/$id/adresse: rôle « $r » manquant (l\'adresse couvre les deux rôles quand elle est présente)');
      }
    }
    cm['adresse'] = adresse;
    // Âge (en 1990) et statut (spec variété §1.10, charte de la bible § 2.4).
    if (cm['age'] != null) {
      final a = (cm['age'] as num).toInt();
      if (a < 0 || a > 110) errors.add('characters/$id: age $a hors 0..110');
      cm['age'] = a;
    }
    final statut = cm['statut']?.toString() ?? 'present';
    if (!kStatuts.contains(statut)) errors.add('characters/$id: statut « $statut » inconnu (${kStatuts.join(' | ')})');
    cm['statut'] = statut;
    if (cm['age'] == null && cm['statut'] != 'present') {
      errors.add('characters/$id: un statut sans `age` : le personnage n\'a pas d\'état de partie');
    }
    // Retrouvailles (spec variété §1.13) : {sourire, noir}, deux cartes qui existent.
    final retro = <String, String>{};
    ((cm['retrouvailles'] as Map?) ?? const {}).forEach((k, v) {
      final key = k.toString();
      if (!const {'sourire', 'noir'}.contains(key)) {
        errors.add('characters/$id/retrouvailles: clef « $key » inconnue (sourire | noir)');
      }
      retro[key] = v.toString();
    });
    if (retro.isNotEmpty) {
      for (final k in const ['sourire', 'noir']) {
        if (!retro.containsKey(k)) errors.add('characters/$id/retrouvailles: « $k » manquant (les deux visages sont requis)');
      }
    }
    cm['retrouvailles'] = retro;
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
        'epilogue': _compileEpilogue(m['epilogue'], errors, '$rel/$id/epilogue'),
        'steps': ((m['steps'] as List?) ?? const []).map((s) => _compileStep(s, errors, '$rel/$id')).toList(),
        // Réservoir et branches (spec variété §2.2). `theme` est résolu plus bas.
        if (m['theme'] != null) 'theme': m['theme'].toString(),
        if (m['carrier'] != null) 'carrier': m['carrier'].toString(),
        'requires': _strList(m['requires']),
        'excludes': _strList(m['excludes']),
        'exclusive_with': _strList(m['exclusive_with']),
        if (m['hint'] != null) 'hint': m['hint'].toString(),
        if (m['journal'] != null) 'journal': m['journal'].toString(),
        'traces': ((m['traces'] as Map?) ?? const {}).map((k, v) => MapEntry(k.toString(), v.toString())),
        // Rétractation d'une trace (spec § 1.3, § 1.7) : la ligne d'Almanach
        // écrite quand un `clear:` retire le drapeau. Sans elle, la trace est
        // simplement effacée du journal ; avec elle, l'Almanach dit qu'on est
        // revenu dessus, ce qui est plus juste qu'un trou.
        'traces_retract': ((m['traces_retract'] as Map?) ?? const {}).map((k, v) => MapEntry(k.toString(), v.toString())),
        'issues': _strList(m['issues']),
        // Issues rares (spec § 5.1, clause d'exception) : une issue qui demande
        // un état rare ou qui est une sortie fatale n'a pas à tenir le plancher
        // de 10 %. Elle doit être DÉCLARÉE : sans ça, `simulate` sortait en
        // rouge sur une intention, et le rouge des vrais ratés ne se voyait
        // plus. Chaque entrée doit figurer dans `issues`.
        'issues_rares': _strList(m['issues_rares']),
      };
      final replay = _compileReplay(m['replay'], errors, '$rel/$id/replay');
      if (replay != null) compiled['replay'] = replay;
      if (m['carrier'] != null && !(compiled['cast'] as List).contains(m['carrier'].toString())) {
        errors.add('$rel: arc $id: carrier « ${m['carrier']} » n\'est pas dans le cast');
      }
      for (final r in compiled['issues_rares'] as List) {
        if (!(compiled['issues'] as List).contains(r)) {
          errors.add('$rel: arc $id: issues_rares « $r » ∉ issues (${compiled['issues']})');
        }
      }
      final issues = compiled['issues'] as List;
      for (final st in compiled['steps'] as List) {
        final o = (st as Map)['outcome'];
        if (o != null && !issues.contains(o)) errors.add('$rel: arc $id: étape ${st['id']} : outcome « $o » ∉ issues $issues');
      }
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
    // `age:` optionnel : le postulat écrase le tirage du rôle (engine §1.8). On
    // le veut dans la fenêtre du rôle, sinon les portes de transition et les
    // objectifs d'âge du rôle ne veulent plus rien dire.
    if (m['age'] != null) {
      final a = (m['age'] as num).toInt();
      final rr = (roleById[m['role']]?['age'] as List?)?.map((e) => (e as num).toInt()).toList();
      if (rr != null && (a < rr.first || a > rr.last)) {
        errors.add('postulats: $id: age $a hors de la fenêtre du rôle ${m['role']} [${rr.first}, ${rr.last}]');
      }
      m['age'] = a;
    }
    if (m['president'] != null && !characterIds.contains(m['president'])) errors.add('postulats: $id: président inconnu « ${m['president']} »');
    if (m['patron'] != null && !characterIds.contains(m['patron'])) errors.add('postulats: $id: patron inconnu « ${m['patron']} »');
    if (m['opening_arc'] != null) {
      final oa = arcById[m['opening_arc'].toString()];
      if (oa == null) {
        errors.add('postulats: $id: opening_arc « ${m['opening_arc']} » inexistant');
      } else if (oa['kind'] != 'postulat') {
        errors.add('postulats: $id: opening_arc « ${m['opening_arc']} » n\'est pas de kind postulat');
      }
    }
    m['pitch'] = m['pitch']?.toString() ?? '';
    m['chantier'] = m['chantier'] == true;
    if (m['seeds'] != null && m['programme'] != null) errors.add('postulats: $id: `seeds` et `programme` sont exclusifs');
    // Fil rouge.
    final questions = <Map<String, dynamic>>[];
    final qids = <String>{};
    for (final qraw in (m['questions'] as List?) ?? const []) {
      final qm = (qraw as Map).cast<String, dynamic>();
      final qid = qm['id'].toString();
      if (!qids.add(qid)) errors.add('postulats: $id: question « $qid » en double');
      final poids = (qm['poids'] as num?)?.toDouble() ?? 1.0;
      if (poids <= 0) errors.add('postulats: $id: question « $qid » : poids ≤ 0');
      questions.add({'id': qid, 'poids': poids});
    }
    m['questions'] = questions;
    // Objectifs cachés.
    final objectifs = <Map<String, dynamic>>[];
    final oids = <String>{};
    for (final oraw in (m['objectifs'] as List?) ?? const []) {
      final om = (oraw as Map).cast<String, dynamic>();
      final oid = om['id'].toString();
      if (!oids.add(oid)) errors.add('postulats: $id: objectif « $oid » en double');
      final w = _parseWhen(om['when'], errors, 'postulats/$id/objectifs/$oid');
      if (om['when'] == null) errors.add('postulats: $id: objectif « $oid » sans `when`');
      objectifs.add({
        'id': oid,
        'titre': om['titre']?.toString() ?? oid,
        if (w != null) 'when': w,
        'indice': om['indice']?.toString() ?? '',
      });
    }
    m['objectifs'] = objectifs;
    // Réservoir (spec variété §2.1).
    if (m['programme'] != null) {
      final prog = <String, dynamic>{};
      int signatures = 0;
      final praw = (m['programme'] as Map).cast<String, dynamic>();
      for (final key in praw.keys) {
        if (!const ['0', '1', '2+'].contains(key)) errors.add('postulats: $id: bucket « $key » inconnu (attendu "0", "1", "2+")');
      }
      for (final key in const ['0', '1', '2+']) {
        final braw = praw[key];
        if (braw == null) continue;
        final bm = (braw as Map).cast<String, dynamic>();
        final prendre = (bm['prendre'] as num?)?.toInt() ?? 0;
        if (prendre < 1) errors.add('postulats: $id: programme["$key"].prendre doit être ≥ 1');
        final fen = _intPair(bm['fenetre'], [2, 9]);
        if (fen[0] < 1 || fen[1] > 15 || fen[1] < fen[0]) errors.add('postulats: $id: programme["$key"].fenetre [${fen[0]}, ${fen[1]}] hors 1..15 ou décroissante');
        final reserve = (bm['reserve'] as num?)?.toInt() ?? 0;
        if (reserve < 0) errors.add('postulats: $id: programme["$key"].reserve doit être ≥ 0');
        final pool = <Map<String, dynamic>>[];
        for (final eraw in (bm['pool'] as List?) ?? const []) {
          final em = (eraw as Map).cast<String, dynamic>();
          final arcId = em['arc'].toString();
          final arc = arcById[arcId];
          if (arc == null) {
            errors.add('postulats: $id: programme["$key"] : arc inexistant « $arcId »');
          } else {
            if (!(arc['roles'] as List).contains(m['role'])) errors.add('postulats: $id: programme["$key"] : « $arcId » est d\'un autre rôle');
            if (arc['kind'] != 'serie') errors.add('postulats: $id: programme["$key"] : « $arcId » n\'est pas de kind serie');
            final posts = arc['postulats'] as List;
            if (posts.isNotEmpty && !posts.contains(id)) posts.add(id);
          }
          final poids = (em['poids'] as num?)?.toDouble() ?? 1.0;
          if (poids <= 0) errors.add('postulats: $id: programme["$key"] : « $arcId » poids ≤ 0');
          if (em['signature'] == true) signatures += 1;
          final ifAst = _parseWhen(em['if'], errors, 'postulats/$id/programme/$key/$arcId');
          pool.add({'arc': arcId, 'poids': poids, if (em['signature'] == true) 'signature': true, if (ifAst != null) 'if': ifAst});
        }
        if (pool.isEmpty) errors.add('postulats: $id: programme["$key"] : pool vide');
        prog[key] = {'prendre': prendre, 'fenetre': fen, 'reserve': reserve, 'reprise': bm['reprise'] == true, 'pool': pool};
      }
      if (signatures > 1) errors.add('postulats: $id: $signatures entrées `signature` (au plus une par postulat)');
      m['programme'] = prog;
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

  // Unes (spec variété §2.4) : journaux fictifs et manchettes, ordre du fichier.
  final postulatIds = postulats.map((p) => p['id'].toString()).toSet();
  // Les manchettes se lisent dans content/unes.yaml **et** dans
  // content/unes/*.yaml (un fichier par salle d'écriture) ; les ids sont
  // uniques d'un fichier à l'autre.
  final journaux = <Map<String, dynamic>>[];
  final journauxIds = <String>{};
  for (final entry in _docsOf('unes.yaml', 'unes', 'journaux')) {
    for (final j in entry.value) {
      final jm = (j as Map).cast<String, dynamic>();
      final jid = jm['id'].toString();
      if (!journauxIds.add(jid)) errors.add('${entry.key}: journal « $jid » en double');
      if (jm['nom'] == null) errors.add('${entry.key}: journal « $jid » sans `nom`');
      journaux.add({'id': jid, 'nom': jm['nom']?.toString() ?? jid, 'ton': jm['ton']?.toString() ?? 'sobre', 'style': jm['style']?.toString() ?? 'bleu'});
    }
  }
  final unes = <Map<String, dynamic>>[];
  final uneIdsFrom = <String, String>{};
  int secours = 0;
  for (final entry in _docsOf('unes.yaml', 'unes', 'unes')) {
    for (final u in entry.value) {
    final where = entry.key;
    final um = (u as Map).cast<String, dynamic>();
    final uid = um['id'].toString();
    final prevUne = uneIdsFrom[uid];
    if (prevUne != null) errors.add('$where: manchette « $uid » déjà déclarée dans $prevUne');
    uneIdsFrom[uid] = where;
    final journal = um['journal']?.toString() ?? 'quotidien';
    if (!journauxIds.contains(journal)) errors.add('$where/$uid: journal inconnu « $journal »');
    final priority = (um['priority'] as num?)?.toInt() ?? 0;
    if (priority < 0 || priority > 4) errors.add('$where/$uid: priority $priority hors 0..4');
    final poids = (um['poids'] as num?)?.toDouble() ?? 1.0;
    if (poids <= 0) errors.add('$where/$uid: poids ≤ 0');
    final w = _parseWhen(um['when'], errors, '$where/$uid/when');
    if (priority == 0 && um['when'] == null) secours += 1;
    if (um['titre'] == null) errors.add('$where/$uid: manchette sans `titre`');
    for (final p in _strList(um['postulats'])) {
      if (!postulatIds.contains(p)) errors.add('$where/$uid: postulat inconnu « $p »');
    }
    for (final r in _strList(um['roles'])) {
      if (!roleIds.contains(r)) errors.add('$where/$uid: rôle inconnu « $r »');
    }
    final react = _compileReact(um['react'], errors, '$where/$uid/react');
    for (final v in react) {
      if (v['chance'] != null) errors.add('$where/$uid/react: `chance` interdit sur la réaction d\'une manchette (le Bilan ne tire qu\'une fois)');
    }
    unes.add({
      'id': uid,
      'postulats': _strList(um['postulats']),
      'roles': _strList(um['roles']),
      'journal': journal,
      'priority': priority,
      'poids': poids,
      if (w != null) 'when': w,
      'titre': um['titre']?.toString() ?? '',
      'sous': um['sous']?.toString() ?? '',
      if (um['sujet'] != null) 'sujet': um['sujet'].toString(),
      if (um['photo'] != null) 'photo': um['photo'].toString(),
      if (react.isNotEmpty) 'react': react,
    });
    }
  }
  if (unes.isNotEmpty && secours < 2) errors.add('unes.yaml: $secours manchette(s) de secours (priority 0 sans `when`), attendu ≥ 2');

  // Set-pieces (spec variété §1.12, §2.7) : le texte des beats moteur, par
  // rôle et par condition ; la première variante vraie gagne, la dernière est
  // le secours (sans `when` ni `roles`). Aucun aléa n'entre ici.
  const twoButtons = {'objective', 'match', 'gm_te', 'aftermatch', 'bilan_contrat', 'bilan_carrefour'};
  const withAnswers = {'objective', 'aftermatch', 'bilan_contrat'};
  final setpieces = <String, List<Map<String, dynamic>>>{};
  ((_loadYaml('setpieces.yaml') as Map?)?['setpieces'] as Map?)?.forEach((beatRaw, list) {
    final beat = beatRaw.toString();
    if (!kSetpieceBeats.contains(beat)) {
      errors.add('setpieces.yaml: beat « $beat » inconnu (${kSetpieceBeats.join(' | ')})');
      return;
    }
    final variants = <Map<String, dynamic>>[];
    final raw = (list as List?) ?? const [];
    for (int i = 0; i < raw.length; i++) {
      final vm = (raw[i] as Map).cast<String, dynamic>();
      final where = 'setpieces.yaml/$beat[$i]';
      final w = _parseWhen(vm['when'], errors, '$where/when');
      final roles = _strList(vm['roles']);
      for (final r in roles) {
        if (!roleIds.contains(r)) errors.add('$where: rôle inconnu « $r »');
      }
      final text = vm['text']?.toString() ?? '';
      if (text.isEmpty) errors.add('$where: variante sans `text`');
      if (text.length > 240) errors.add('$where: texte de ${text.length} caractères (> 240)');
      final speaker = vm['speaker']?.toString();
      if (speaker != null && !characterIds.contains(speaker)) errors.add('$where: locuteur inconnu « $speaker »');
      if (vm['right'] != null && !twoButtons.contains(beat)) {
        errors.add('$where: le beat $beat n\'a qu\'un bouton (`left` seul)');
      }
      if ((vm['answer_left'] != null || vm['answer_right'] != null) && !withAnswers.contains(beat)) {
        errors.add('$where: le beat $beat n\'affiche pas de conséquence (`answer_*` ignoré)');
      }
      final transition = vm['transition']?.toString();
      if (transition != null) {
        if (beat != 'bilan_carrefour') errors.add('$where: `transition` n\'existe qu\'au beat bilan_carrefour');
        if (!roleIds.contains(transition)) errors.add('$where: transition vers un rôle inconnu « $transition »');
      }
      if (_readsBilan(w) && beat != 'bilan_verdict') {
        errors.add('$where: `bilan.*` hors du beat bilan_verdict (le verdict n\'y est calculé qu\'une fois)');
      }
      final secours = w == null && roles.isEmpty && transition == null;
      if (secours && i != raw.length - 1) errors.add('$where: variante inaccessible après le secours (le secours est le dernier)');
      if (!secours && i == raw.length - 1) errors.add('$where: le beat $beat n\'a pas de secours (une dernière variante sans `when` ni `roles`)');
      variants.add({
        if (w != null) 'when': w,
        if (roles.isNotEmpty) 'roles': roles,
        if (speaker != null) 'speaker': speaker,
        'text': text,
        if (vm['left'] != null) 'left': vm['left'].toString(),
        if (vm['right'] != null) 'right': vm['right'].toString(),
        if (vm['answer_left'] != null) 'answer_left': vm['answer_left'].toString(),
        if (vm['answer_right'] != null) 'answer_right': vm['answer_right'].toString(),
        if (transition != null) 'transition': transition,
      });
    }
    if (variants.isNotEmpty) setpieces[beat] = variants;
  });

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
        // Nouvelle datée (spec variété §1.5) : l'année de sa fenêtre [year, year + 1].
        if (m['year'] != null) 'year': (m['year'] as num).toInt(),
        if (m['statut_ok'] != null) 'statut_ok': _statutOk(m['statut_ok'], errors, '$rel/$id'),
      };
      final yr = m['year'];
      if (yr != null) {
        final y = (yr as num).toInt();
        if (y < 1990 || y > 2050) errors.add('$rel: $id: year $y hors 1990..2050');
        if (m['arc']?.toString() != 'nouvelle' && explicitKind != 'nouvelle') {
          errors.add('$rel: $id: `year` est réservé aux Nouvelles (arc: nouvelle ou kind: nouvelle)');
        }
        if (m['once'] != true) errors.add('$rel: $id: une Nouvelle datée doit être once: true (elle ne dit son année qu\'une fois)');
      }
      if (m['statut_ok'] != null && m['speaker'] == null) {
        errors.add('$rel: $id: `statut_ok` sans `speaker` (le statut est celui du locuteur)');
      }
      if (m['pool'] == true) card['pool'] = true;
      cards.add(card);
      rawById[id] = m;
    }
  }
  final cardById = {for (final c in cards) c['id'].toString(): c};

  // Thèmes fermés et leur libellé (content/tags.yaml → themes / theme_labels).
  final tagsDoc = (_loadYaml('tags.yaml') as Map?)?.cast<String, dynamic>();
  final themes = _strList(tagsDoc?['themes']);
  final themeLabels = <String, String>{};
  ((tagsDoc?['theme_labels'] as Map?) ?? const {}).forEach((k, v) {
    final id = k.toString();
    if (!themes.contains(id)) errors.add('tags.yaml/theme_labels: thème « $id » absent de `themes`');
    themeLabels[id] = v.toString();
  });
  for (final t in themes) {
    if (!themeLabels.containsKey(t)) errors.add('tags.yaml: le thème « $t » n\'a pas de libellé (theme_labels)');
  }

  // --- Arcs : thème résolu, exclusive_with symétrisé (spec variété §2.2, §3.7).
  for (final a in arcs) {
    final id = a['id'].toString();
    if (a['theme'] == null) {
      final steps = a['steps'] as List;
      if (steps.isNotEmpty) {
        final variants = (steps.first as Map)['card'] as List;
        if (variants.isNotEmpty) {
          final first = cardById[(variants.last as Map)['id'].toString()];
          if (first != null) a['theme'] = first['arc'].toString();
        }
      }
    }
    for (final other in a['exclusive_with'] as List) {
      final o = arcById[other.toString()];
      if (o == null) {
        errors.add('arc $id: exclusive_with « $other » inexistant');
      } else if (!(o['exclusive_with'] as List).contains(id)) {
        (o['exclusive_with'] as List).add(id);
      }
    }
  }

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
    // Retrouvailles (spec variété §1.13) : cartes propres, hors du sac, servies
    // depuis la file au changement de club ou de rôle.
    ((ch['retrouvailles'] as Map?) ?? const {}).forEach((visage, cid) {
      claim(cid.toString(), 'chaine', 'characters/${ch['id']}/retrouvailles/$visage');
      final c = cardById[cid.toString()];
      if (c != null && c['once'] != true) errors.add('$cid: une carte de retrouvailles doit être once: true');
    });
  }
  // Les personnages cités par un effet `char:` existent.
  for (final entry in charEffectIds) {
    final parts = entry.split('|');
    if (!characterIds.contains(parts.last)) errors.add('${parts.first}/char: personnage inconnu « ${parts.last} »');
  }
  // Le locuteur d'une carte à `statut_ok` doit être un personnage connu.
  for (final c in cards) {
    final sp = c['speaker']?.toString();
    if ((c['statut_ok'] as List?)?.isNotEmpty == true && sp != null && !characterIds.contains(sp)) {
      errors.add('${c['id']}: `statut_ok` sur une carte dont le locuteur « $sp » n\'est pas un personnage');
    }
  }
  // Étapes d'un arc rejouable : jamais `once: true` (le purge « déjà vue »
  // tuerait la relance) ; `outcome` d'un choix ∈ issues de l'arc.
  for (final c in cards) {
    final arcId = c['arcId'];
    if (arcId == null) continue;
    final arc = arcById[arcId]!;
    if (arc['replay'] != null && c['once'] == true) {
      errors.add('${c['id']}: once: true sur une étape de l\'arc rejouable $arcId (spec variété §1.3)');
    }
    for (final side in ['left', 'right']) {
      final eff = (c[side] as Map)['effects'] as Map<String, dynamic>;
      final o = eff['outcome'];
      if (o != null && !(arc['issues'] as List).contains(o)) {
        errors.add('${c['id']}/$side: outcome « $o » ∉ issues de $arcId (${arc['issues']})');
      }
    }
  }
  for (final c in cards) {
    for (final side in ['left', 'right']) {
      final eff = (c[side] as Map)['effects'] as Map<String, dynamic>;
      if (eff['outcome'] != null && c['arcId'] == null) errors.add('${c['id']}/$side: `outcome` sur une carte qui n\'est pas une étape d\'arc');
    }
  }
  for (final c in cards) {
    // A hand-written kind (passe/nouvelle) is kept; otherwise `arc: nouvelle` makes a Nouvelle.
    if (mechanism[c['id']] == null && c['kind'] == 'routine' && c['arc'] == 'nouvelle') c['kind'] = 'nouvelle';
  }
  // Cartes-réactions (spec variété §1.4, §2.3) : toute carte citée par un
  // `react` (d'un choix ou d'une manchette) reçoit kind: reaction, hors sac.
  // Une même réaction peut être citée par plusieurs déclencheurs.
  final reactSources = <String, List<String>>{};
  void scanReacts(Map<String, dynamic>? eff, String by) {
    if (eff == null) return;
    for (final v in (eff['react'] as List?) ?? const []) {
      (reactSources[(v as Map)['card'].toString()] ??= []).add(by);
    }
    for (final b in (eff['rand'] as List?) ?? const []) {
      scanReacts((b as Map).cast<String, dynamic>(), by);
    }
  }

  for (final c in cards) {
    for (final side in ['left', 'right']) {
      scanReacts((c[side] as Map)['effects'] as Map<String, dynamic>?, '${c['id']}/$side');
    }
  }
  for (final u in unes) {
    for (final v in (u['react'] as List?) ?? const []) {
      (reactSources[(v as Map)['card'].toString()] ??= []).add('unes.yaml/${u['id']}');
    }
  }
  for (final entry in reactSources.entries) {
    final cid = entry.key;
    final by = entry.value.join(', ');
    final c = cardById[cid];
    if (c == null) {
      errors.add('$by: react vers une carte inexistante « $cid »');
      continue;
    }
    final prev = mechanism[cid];
    if (prev != null && !prev.startsWith('react')) {
      errors.add('$cid: référencée par deux mécanismes ($prev et react par $by)');
      continue;
    }
    mechanism[cid] = 'react';
    c['kind'] = 'reaction';
    if (c['speaker'] == null) errors.add('$cid: une carte-réaction doit avoir un `speaker` (react par $by)');
    if (c['tone'] == 'drame') errors.add('$cid: une carte-réaction ne peut pas être tone: drame');
    for (final side in ['left', 'right']) {
      final eff = (c[side] as Map)['effects'] as Map<String, dynamic>;
      if (eff['end'] != null) errors.add('$cid/$side: une carte-réaction ne peut pas poser `end`');
      if (eff['react'] != null) errors.add('$cid/$side: une carte-réaction ne peut pas poser `react` (jamais deux d\'affilée)');
      if (eff['next'] != null) errors.add('$cid/$side: `next` sur une carte-réaction');
    }
  }
  // `react` et `journal` sont réservés aux cartes d'histoire (script, étape,
  // palier, alarme, événement) : jamais sur une routine, une Nouvelle, une réaction.
  for (final c in cards) {
    final kind = c['kind'].toString();
    for (final side in ['left', 'right']) {
      final eff = (c[side] as Map)['effects'] as Map<String, dynamic>;
      if (eff['react'] != null && const {'routine', 'nouvelle', 'passe', 'reaction'}.contains(kind)) {
        errors.add('${c['id']}/$side: `react` sur une carte de kind $kind (réservé aux cartes de script/étape/palier/alarme/événement)');
      }
      if (eff['journal'] != null && const {'routine', 'nouvelle', 'passe'}.contains(kind)) {
        errors.add('${c['id']}/$side: `journal` sur une carte de kind $kind (le journal ne doit pas devenir du bruit)');
      }
      // `bilan.tenu` / `bilan.rang` ne valent que dans une manchette (le verdict n'est calculé qu'au Bilan).
      for (final v in (eff['react'] as List?) ?? const []) {
        if (_readsBilan((v as Map)['if'])) errors.add('${c['id']}/$side/react: `bilan.*` hors d\'une manchette');
      }
    }
    if (_readsBilan(c['when'])) errors.add('${c['id']}/when: `bilan.*` hors d\'une manchette / set-piece de bilan / epitaph_plus');
  }
  for (final a in arcs) {
    final aid = a['id'];
    if (_readsBilan(a['when']) || _readsBilan(a['cancel_if'])) errors.add('arc $aid: `bilan.*` hors d\'une manchette');
    for (final st in a['steps'] as List) {
      for (final v in (st as Map)['card'] as List) {
        if (_readsBilan((v as Map)['if'])) errors.add('arc $aid/${st['id']}: `bilan.*` hors d\'une manchette');
      }
      for (final nx in st['next'] as List) {
        if (_readsBilan((nx as Map)['if'])) errors.add('arc $aid/${st['id']}/next: `bilan.*` hors d\'une manchette');
      }
    }
  }
  for (final p in postulats) {
    ((p['programme'] as Map?) ?? const {}).forEach((bucket, bm) {
      for (final e in ((bm as Map)['pool'] as List?) ?? const []) {
        if (_readsBilan((e as Map)['if'])) errors.add('postulats: ${p['id']}: programme["$bucket"]/${e['arc']}: `bilan.*` hors d\'une manchette');
      }
    });
    for (final o in (p['objectifs'] as List?) ?? const []) {
      if (_readsBilan((o as Map)['when'])) errors.add('postulats: ${p['id']}: objectif ${o['id']}: `bilan.*` hors d\'une manchette (les objectifs sont évalués après le verdict)');
    }
    (p['alarm_overrides'] as Map).forEach((key, list) {
      for (final e in list as List) {
        if (_readsBilan((e as Map)['when'])) errors.add('postulats: ${p['id']}: alarm_overrides/$key: `bilan.*` hors d\'une manchette');
      }
    });
  }
  alarms.forEach((role, byKey) {
    (byKey as Map).forEach((key, list) {
      for (final e in list as List) {
        if (_readsBilan((e as Map)['when'])) errors.add('alarms/$role/$key: `bilan.*` hors d\'une manchette');
      }
    });
  });
  for (final ch in characters) {
    (ch['on_relation'] as Map).forEach((t, variants) {
      for (final v in variants as List) {
        if (_readsBilan((v as Map)['if'])) errors.add('characters/${ch['id']}/on_relation/$t: `bilan.*` hors d\'une manchette');
      }
    });
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
    'themes': themes,
    'journaux': journaux,
    'unes': unes,
    'journal_templates': journalTemplates,
    'blacklist': blacklist,
    'theme_labels': themeLabels,
    'setpieces': setpieces,
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
  final nReact = cards.where((c) => c['kind'] == 'reaction').length;
  final nSetpieces = setpieces.values.fold<int>(0, (a, v) => a + v.length);
  final nDatees = cards.where((c) => c['year'] != null).length;
  stdout.writeln('OK: ${cards.length} cartes ($nPool dans le sac, $nReact réactions, $nDatees Nouvelles datées), ${unes.length} manchettes, '
      '$nSetpieces variantes de set-piece (${setpieces.length} beats), ${arcs.length} arcs, ${postulats.length} postulats, '
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
