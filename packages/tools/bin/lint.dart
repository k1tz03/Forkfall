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

  final tagsDoc = _yaml('tags.yaml') as YamlMap;
  final tags = (tagsDoc['tags'] as YamlList).map((e) => e.toString()).toSet();
  final themes = ((tagsDoc['themes'] as YamlList?) ?? YamlList()).map((e) => e.toString()).toSet();
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
    for (final f in [...(a['requires'] as List? ?? const []), ...(a['excludes'] as List? ?? const [])]) {
      flagsRead.add(f.toString());
      if (!flags.contains(f)) errors.add('arc $id: requires/excludes cite un drapeau non déclaré "$f"');
    }
    for (final f in (a['traces'] as Map? ?? const {}).keys) {
      if (!flags.contains(f)) errors.add('arc $id: traces cite un drapeau non déclaré "$f"');
    }
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
    final seeds = (p['seeds'] as List?) ?? const [];
    if (seeds.isNotEmpty) warnings.add('postulat ${p['id']}: `seeds` est déprécié (remplacé par `programme`, spec variété §1.2)');
    for (final sd in seeds) {
      scanAst((sd as Map)['if'], 'postulat ${p['id']}/seeds');
    }
    ((p['programme'] as Map?) ?? const {}).forEach((bucket, bm) {
      for (final e in ((bm as Map)['pool'] as List?) ?? const []) {
        scanAst((e as Map)['if'], 'postulat ${p['id']}/programme/$bucket/${e['arc']}');
      }
    });
    for (final o in (p['objectifs'] as List?) ?? const []) {
      scanAst((o as Map)['when'], 'postulat ${p['id']}/objectifs/${o['id']}');
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

  // --- Réservoir et couture (spec variété §2.2, §3.7). Les contrôles de
  // structure sont bloquants pour un postulat livré (`chantier: false`) et de
  // simples avertissements tant qu'il est en chantier ; les budgets de volume
  // (≥ 12 intrigues, ≥ 6 thèmes…) restent des avertissements jusqu'à la
  // livraison du lot de contenu (étape 3).
  final arcById = {for (final a in arcs) a['id'].toString(): a};
  bool readsPlays(Object? node) {
    if (node is! List || node.isEmpty) return false;
    if (node[0] == 'call' && node.length >= 2 && node[1] == 'plays') return true;
    return node.any(readsPlays);
  }

  final outcomesPosed = <String, Set<String>>{};
  for (final a in arcs) {
    final id = a['id'].toString();
    for (final st in (a['steps'] as List).cast<Map<String, dynamic>>()) {
      if (st['outcome'] != null) (outcomesPosed[id] ??= {}).add(st['outcome'].toString());
    }
  }
  for (final c in cards) {
    final arcId = c['arcId']?.toString();
    if (arcId == null) continue;
    for (final side in ['left', 'right']) {
      final o = ((c[side] as Map)['effects'] as Map)['outcome'];
      if (o != null) (outcomesPosed[arcId] ??= {}).add(o.toString());
    }
  }
  for (final a in arcs) {
    final id = a['id'].toString();
    if (a['replay'] != null) {
      final first = ((a['steps'] as List).isEmpty ? const [] : ((a['steps'] as List).first as Map)['card'] as List);
      if (!first.any((v) => readsPlays((v as Map)['if']))) {
        warnings.add('arc $id: rejouable sans variante « encore » (aucune variante de l\'étape 1 ne lit plays())');
      }
    }
    for (final issue in (a['issues'] as List? ?? const [])) {
      if (!(outcomesPosed[id] ?? const {}).contains(issue)) warnings.add('arc $id: issue « $issue » jamais posée par une sortie');
    }
  }
  for (final p in postulats) {
    final pid = p['id'].toString();
    final prog = p['programme'] as Map?;
    if (prog == null) continue;
    final chantier = p['chantier'] == true;
    final strict = chantier ? warnings : errors;
    final suffix = chantier ? ' (en chantier)' : '';
    final poolArcs = <String>[];
    bool signature = false;
    prog.forEach((bucket, bm) {
      for (final e in ((bm as Map)['pool'] as List?) ?? const []) {
        final arcId = (e as Map)['arc'].toString();
        if (!poolArcs.contains(arcId)) poolArcs.add(arcId);
        if (e['signature'] == true) signature = true;
      }
    });
    final objectifs = (p['objectifs'] as List?) ?? const [];
    if (objectifs.length != 3) strict.add('postulat $pid: ${objectifs.length} objectifs (attendu 3)$suffix');
    final cast = (p['cast'] as Map? ?? const {}).keys.map((k) => k.toString()).toSet();
    final themesSeen = <String>{};
    final carriers = <String>{};
    int tardives = 0;
    for (final arcId in poolArcs) {
      final a = arcById[arcId];
      if (a == null) continue;
      final theme = a['theme']?.toString() ?? '';
      final carrier = a['carrier']?.toString() ?? ((a['cast'] as List).isEmpty ? '' : (a['cast'] as List).first.toString());
      themesSeen.add(theme);
      carriers.add(carrier);
      if (((a['min_season'] as num?)?.toInt() ?? 0) >= 2) tardives += 1;
      if (!themes.contains(theme)) strict.add('postulat $pid: intrigue $arcId : thème « $theme » hors de tags.yaml → themes$suffix');
      if (carrier.isEmpty) {
        strict.add('postulat $pid: intrigue $arcId sans porteur (carrier ou cast)$suffix');
      } else if (cast.isNotEmpty && !cast.contains(carrier)) {
        warnings.add('postulat $pid: le porteur « $carrier » de $arcId n\'est pas au casting du postulat');
      }
      if (((a['issues'] as List?) ?? const []).length < 2) strict.add('postulat $pid: intrigue $arcId : moins de 2 issues$suffix');
      final traces = (a['traces'] as Map?) ?? const {};
      if (traces.isEmpty) warnings.add('postulat $pid: intrigue $arcId sans `traces` (rien ne rappellera cette histoire)');
      for (final f in traces.keys) {
        if (!flagsRead.contains(f)) strict.add('postulat $pid: la trace « $f » de $arcId n\'est lue nulle part$suffix');
      }
      if (a['replay'] != null) {
        final first = ((a['steps'] as List).isEmpty ? const [] : ((a['steps'] as List).first as Map)['card'] as List);
        if (!first.any((v) => readsPlays((v as Map)['if']))) strict.add('postulat $pid: intrigue rejouable $arcId sans variante lisant plays()$suffix');
      }
    }
    // Budgets de volume (livraison du lot, étape 3) : avertissements.
    void budget(bool ok, String msg) {
      if (!ok) warnings.add('postulat $pid: budget de réservoir — $msg (bloquant à la livraison du lot)');
    }

    budget(poolArcs.length >= 12, 'réservoir de ${poolArcs.length} intrigues (attendu ≥ 12)');
    budget(signature, 'aucune intrigue `signature`');
    budget(themesSeen.length >= 6, '${themesSeen.length} thèmes (attendu ≥ 6)');
    budget(carriers.length >= 6, '${carriers.length} porteurs (attendu ≥ 6)');
    budget(tardives >= 3, '$tardives intrigues tardives min_season ≥ 2 (attendu ≥ 3)');
    for (final ch in cast) {
      final n = poolArcs.where((id) => (arcById[id]?['cast'] as List? ?? const []).contains(ch)).length;
      budget(n >= 2, '« $ch » est au casting mais porteur ou cast de $n intrigue(s) (attendu ≥ 2)');
    }
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
