// Ce qu'une carrière fait lire, livre par livre : les cartes (par beat), leurs caractères
// (texte, deux boutons, la phrase de conséquence), les Unes, les saisons, et les scènes
// jouées du livre qu'elle déclenche (l'introduction, celles d'une carte, d'un drapeau, leurs
// suites). Politique `human_like` de simulate.dart (recopiée), graines `seedOfRun`.
// Voir docs/balance/duree_partie.md. Depuis la racine du dépôt :
//   dart run packages/tools/bin/duree.dart 300 > carrieres.json
import 'dart:convert';
import 'dart:io';

import 'package:fusible_core/fusible_core.dart';

double _danger(int v) {
  final d = (v - 50).abs();
  if (d <= 20) return d / 20.0;
  return 1 + (d - 20) * (d - 20) / 15.0;
}

bool _balancer(GameState s, int step) {
  final p = s.pending!;
  if (p.single) return true;
  double score(Map<String, int> deltas) {
    double total = 0;
    for (final g in ['vestiaire', 'tribunes', 'direction', 'caisse']) {
      final projected = ((s.gauges[g] ?? 50) + (deltas[g] ?? 0)).clamp(0, 100);
      total += _danger(projected);
    }
    return total;
  }

  final l = score(p.leftEffects.gauges);
  final r = score(p.rightEffects.gauges);
  if ((l - r).abs() < 0.001) return step % 2 == 0;
  return r < l;
}

bool _humanLike(GameState s, int step) {
  final err = (((s.rngState >> 3) ^ mul32(step, 2654435761)) & 0x7FFFFFFF) % 100 < 18;
  final base = _balancer(s, step);
  return err ? !base : base;
}

int seedOfRun(int i) => i * 2654435761 & 0x7FFFFFFF;

/// Le « si » des scènes de la ville (ET seulement), évalué sur l'état du moteur. Ce que le
/// moteur ne sait pas (le jour, l'heure, une mission de la ville) est compté vrai.
bool siVrai(String si, GameState s, Content content) {
  if (si.trim().isEmpty) return true;
  final beats = content.seasonBeats[s.role] ?? const <Beat>[];
  final phase = beats.isEmpty ? '' : beats[s.beat.clamp(0, beats.length - 1)].phase;
  for (final brut in si.split(RegExp(r'\s*&&\s*|\s+ET\s+'))) {
    var a = brut.trim();
    if (a.isEmpty) continue;
    final non = a.startsWith('!');
    if (non) a = a.substring(1).trim();
    bool v;
    final f = RegExp(r'^(flag|arc|mission)\((.*)\)$').firstMatch(a);
    final c = RegExp(r'^(saison|annee|phase|jour|tranche|serie_v|serie_d)\s*(==|!=|>=|<=|<|>)\s*(\S+)$').firstMatch(a);
    if (f != null) {
      final x = f.group(2)!.trim();
      v = f.group(1) == 'flag' ? s.flags.contains(x) : f.group(1) == 'arc' ? (s.arcs[x]?.status == 'active') : false;
    } else if (c != null) {
      final k = c.group(1)!, op = c.group(2)!, val = c.group(3)!;
      if (k == 'jour' || k == 'tranche') { v = true; }
      else if (k == 'phase') { v = op == '==' ? phase == val : phase != val; }
      else {
        final x = k == 'saison' ? s.season + 1 : k == 'annee' ? s.year : k == 'serie_v' ? s.world.serieVictoires : s.world.serieDefaites;
        final n = int.parse(val);
        v = switch (op) { '==' => x == n, '!=' => x != n, '>=' => x >= n, '<=' => x <= n, '<' => x < n, _ => x > n };
      }
    } else {
      v = true;
    }
    if (non) v = !v;
    if (!v) return false;
  }
  return true;
}

int lignesDe(Map<dynamic, dynamic> ci) => [for (final e in (ci['etapes'] as List? ?? const [])) if (e is Map && (e['dit'] != null || e['narration'] != null || e['fondu'] != null)) 1].length + (ci['titre'] != null ? 1 : 0);
int caracteresDe(Map<dynamic, dynamic> ci) {
  var n = '${ci['titre'] ?? ''}${ci['sous'] ?? ''}'.length;
  for (final e in (ci['etapes'] as List? ?? const [])) {
    if (e is Map) n += '${e['dit'] ?? ''}${e['narration'] ?? ''}${e['fondu'] ?? ''}'.length;
  }
  return n;
}

void main(List<String> args) {
  final runs = args.isNotEmpty ? int.parse(args[0]) : 200;
  final root = Directory.current.path;
  final content = loadContentFromJson(File('$root/content/build/content.json').readAsStringSync());
  final engine = Engine(content);
  final brut = jsonDecode(File('$root/content/build/content.json').readAsStringSync()) as Map<String, dynamic>;
  final cines = ((brut['ville'] as Map)['cinematiques'] as List).cast<Map<dynamic, dynamic>>();
  final parId = {for (final c in cines) c['id'] as String: c};
  final out = <String, dynamic>{};
  for (int p = 0; p < content.postulatsByIndex.length; p++) {
    final careers = <Map<String, dynamic>>[];
    for (int i = 0; i < runs; i++) {
      var s = engine.start(seedOfRun(i), postulat: p);
      int step = 0, cards = 0, chars = 0, choix = 0, uneChars = 0;
      final vues = <String>{};
      final ciQuand = <String, int>{};
      int ciLignes = 0, ciChars = 0;
      void voir(Map<dynamic, dynamic>? ci) {
        for (var k = 0; ci != null && k < 9; k++) {
          final id = ci['id'] as String;
          if (vues.contains(id)) return;
          vues.add(id);
          ciQuand[ci['quand'] as String] = (ciQuand[ci['quand'] as String] ?? 0) + 1;
          ciLignes += lignesDe(ci); ciChars += caracteresDe(ci);
          ci = ci['suite'] == null ? null : parId[ci['suite']];
        }
      }
      bool pourMoi(Map<dynamic, dynamic> ci) => (ci['roles'] as List?)?.contains(s.role) ?? true;
      bool deCarte(Map<dynamic, dynamic> ci, String id) => ((ci['cartes'] as List?)?.contains(id) ?? false) || (ci['prefixe'] != null && id.startsWith('${ci['prefixe']}'));
      for (final ci in cines) {
        if (ci['quand'] == 'debut' && pourMoi(ci) && siVrai('${ci['si'] ?? ''}', s, content)) { voir(ci); break; }
      }
      final kinds = <String, int>{};
      final narr = <String, int>{};
      while (!s.over && cards < 2000) {
        final pe = s.pending!;
        kinds[pe.kind] = (kinds[pe.kind] ?? 0) + 1;
        final nk = pe.payload['kind']?.toString() ?? '-';
        if (pe.kind == 'narrative') narr[nk] = (narr[nk] ?? 0) + 1;
        chars += pe.text.length + pe.leftLabel.length + (pe.single ? 0 : pe.rightLabel.length);
        if (!pe.single) choix++;
        if (pe.kind == 'bilan_une') {
          final pl = pe.payload;
          uneChars += '${pl['titre'] ?? ''}${pl['sous'] ?? ''}'.length;
          for (final b in (pl['breves'] as List? ?? const [])) {
            uneChars += b is Map ? '${b['titre'] ?? ''}${b['texte'] ?? ''}'.length : b.toString().length;
          }
        }
        for (final ci in cines) {
          if (ci['quand'] == 'carte' && ci['moment'] == 'avant' && pourMoi(ci) && deCarte(ci, pe.id) && siVrai('${ci['si'] ?? ''}', s, content)) voir(ci);
        }
        final avantFlags = Set.of(s.flags);
        final right = _humanLike(s, step++);
        s = engine.choose(s, right);
        cards++;
        for (final ci in cines) {
          if (!pourMoi(ci)) continue;
          if (ci['quand'] == 'carte' && ci['moment'] != 'avant' && deCarte(ci, pe.id) && siVrai('${ci['si'] ?? ''}', s, content)) voir(ci);
          if (ci['quand'] == 'drapeau' && !avantFlags.contains(ci['drapeau']) && s.flags.contains(ci['drapeau']) && siVrai('${ci['si'] ?? ''}', s, content)) voir(ci);
        }
        chars += (s.lastAnswer ?? '').length;
      }
      careers.add({
        'cards': cards, 'chars': chars + uneChars, 'choix': choix, 'seasons': s.season + 1, 'years': s.year,
        'ending': s.endingId, 'kinds': kinds, 'narr': narr, 'ci': ciQuand, 'ciLignes': ciLignes, 'ciChars': ciChars,
      });
    }
    out['$p'] = careers;
    stderr.writeln('livre ${p + 1} : $runs carrières');
  }
  stdout.write(jsonEncode(out));
}
