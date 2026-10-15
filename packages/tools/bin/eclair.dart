/// Le banc d'essai du mode éclair (« Le Fusible »).
///
///   dart run packages/tools/bin/eclair.dart                     # un tableau par rôle
///   dart run packages/tools/bin/eclair.dart --runs 400 --postulat 10
///   dart run packages/tools/bin/eclair.dart --trace 123 --postulat 10 --policy novice
///   dart run packages/tools/bin/eclair.dart --jours 30          # le défi des trente prochains jours
///   dart run packages/tools/bin/eclair.dart --fuites --runs 150 # aucune carte de livre ne doit servir
///   dart run packages/tools/bin/eclair.dart --fins --runs 400   # quelles fins le mode atteint-il (--policy x : un seul joueur type)
///
/// Ce que ça mesure, par postulat éclair et par politique de joueur : la durée
/// d'une carrière en cartes (ce qu'on lit : une carte, un geste), en semaines
/// tenues (le score), en saisons, et ce qui l'arrête — la jauge qui a sauté,
/// côté vide ou côté plein, ou une autre fin. La cible du mode : une carrière
/// ordinaire d'une soixantaine à une centaine de cartes (une dizaine de minutes,
/// à six ou huit secondes la carte), une grande bien plus longue.
///
/// Les politiques sont celles de `simulate.dart`, recopiées ici (les siennes
/// sont privées) :
///   random     un pile ou face
///   novice     le « balancer » qui se trompe quatre fois sur dix — un joueur qui
///              ne voit que la taille des points d'effet, jamais leur signe
///   human_like le « balancer » qui se trompe dix-huit fois sur cent (simulate)
///   balancer   le joueur parfait : il lit les vrais effets signés
///
/// Le banc n'écrit rien : ni contenu, ni goldens.
library;

import 'dart:convert';
import 'dart:io';

import 'package:fusible_core/fusible_core.dart';

typedef Policy = bool Function(GameState s, int step);

bool _random(GameState s, int step) => (s.rngState ^ step) & 1 == 0;

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
      total += _danger(((s.gauges[g] ?? 50) + (deltas[g] ?? 0)).clamp(0, 100));
    }
    return total;
  }

  final l = score(p.leftEffects.gauges);
  final r = score(p.rightEffects.gauges);
  if ((l - r).abs() < 0.001) return step % 2 == 0;
  return r < l;
}

Policy _erreurs(int pour100) => (GameState s, int step) {
      final err = (((s.rngState >> 3) ^ mul32(step, 2654435761)) & 0x7FFFFFFF) % 100 < pour100;
      final base = _balancer(s, step);
      return err ? !base : base;
    };

final Map<String, Policy> _politiques = {
  'random': _random,
  'novice': _erreurs(40),
  'human_like': _erreurs(18),
  'balancer': _balancer,
};

int _graine(int i) => i * 2654435761 & 0x7FFFFFFF;

Content _charge() {
  var dir = Directory.current;
  for (var i = 0; i < 6; i++) {
    final f = File('${dir.path}/content/build/content.json');
    if (f.existsSync()) return loadContentFromJson(f.readAsStringSync());
    final p = dir.parent;
    if (p.path == dir.path) break;
    dir = p;
  }
  stderr.writeln('content/build/content.json introuvable. Lance d\'abord build_content.');
  exit(1);
}

class Carriere {
  final int cartes;
  final int semaines;
  final int saisons;
  final String fin;
  final String? jauge; // `vestiaire:vide`, `caisse:plein`… quand une jauge a sauté
  final int annee;
  final int famine;
  final bool fini;
  final String derniere; // la dernière carte répondue : celle qui a posé la fin
  const Carriere(this.cartes, this.semaines, this.saisons, this.fin, this.jauge, this.annee, this.famine, this.fini, this.derniere);
}

Carriere jouer(Engine e, int seed, int postulat, Policy politique, {int plafond = 4000, StringSink? trace, Map<String, int>? vues}) {
  var s = e.start(seed, postulat: postulat);
  var step = 0;
  var derniere = '-';
  trace?.writeln('graine $seed · ${s.role} · ${s.year} · ${s.age} ans · mode ${s.mode} · ${s.entities.named['club']} · D${s.world.division} force ${s.force}');
  while (!s.over && step < plafond) {
    final p = s.pending!;
    derniere = p.id;
    if (vues != null) vues[p.id] = (vues[p.id] ?? 0) + 1;
    final droite = p.single ? true : politique(s, step);
    if (trace != null) {
      final g = s.gauges;
      final kind = p.payload['kind'] ?? p.kind;
      trace.writeln('${(step + 1).toString().padLeft(3)} S${s.season} w${semainesTenues(s).toString().padLeft(3)} '
          'V${g['vestiaire']} T${g['tribunes']} D${g['direction']} C${g['caisse']} · ${p.kind}/$kind · ${p.id} · '
          '${droite ? '→' : '←'} ${droite ? p.rightLabel : p.leftLabel}');
    }
    s = e.choose(s, droite);
    step++;
  }
  String? jauge;
  final role = e.content.roles[s.role];
  if (role != null && s.endingId != null) {
    for (final g in role.gauges) {
      if (g.emptyEnding == s.endingId) jauge = '${g.id}:vide';
      if (g.fullEnding == s.endingId) jauge = '${g.id}:plein';
    }
  }
  trace?.writeln('fin : ${s.endingId} · $step cartes · ${semainesTenues(s)} semaines · ${s.season} saison(s) · gauges ${s.gauges}');
  return Carriere(step, semainesTenues(s), s.season, s.endingId ?? '-', jauge, s.year, s.stats['famine'] ?? 0, s.over, derniere);
}

double _pct(List<int> xs, double q) {
  if (xs.isEmpty) return 0;
  final l = [...xs]..sort();
  return l[(q * (l.length - 1)).round()].toDouble();
}

String _f(double v, [int d = 0]) => v.toStringAsFixed(d);

void main(List<String> args) {
  final content = _charge();
  final engine = Engine(content);
  var runs = 300;
  int? postulat;
  int? traceSeed;
  var politique = 'novice';
  String? seule; // `--policy x` sans `--trace` : une seule politique dans le tableau
  int? jours;
  String? depuis;
  var fuites = false;
  var fins = false;
  for (var i = 0; i < args.length; i++) {
    if (args[i] == '--runs' && i + 1 < args.length) runs = int.parse(args[i + 1]);
    if (args[i] == '--postulat' && i + 1 < args.length) postulat = int.parse(args[i + 1]);
    if (args[i] == '--trace' && i + 1 < args.length) traceSeed = int.parse(args[i + 1]);
    if (args[i] == '--policy' && i + 1 < args.length) {
      politique = args[i + 1];
      seule = args[i + 1];
    }
    if (args[i] == '--jours' && i + 1 < args.length) jours = int.parse(args[i + 1]);
    if (args[i] == '--fuites') fuites = true;
    if (args[i] == '--fins') fins = true;
    if (args[i] == '--depuis' && i + 1 < args.length) depuis = args[i + 1];
  }
  final eclair = postulatsEclair(content);
  if (eclair.isEmpty) {
    stderr.writeln('aucun postulat éclair dans le contenu.');
    exit(1);
  }

  if (jours != null) {
    // le défi des prochains jours : rôle, graine, et la première carte de chacun
    final base = DateTime.parse(depuis ?? '2026-10-15');
    for (var k = 0; k < jours; k++) {
      final d = base.add(Duration(days: k));
      final date = '${d.year.toString().padLeft(4, '0')}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';
      final defi = defiDuJour(content, date)!;
      final s = engine.start(defi.seed, postulat: defi.postulat);
      stdout.writeln('$date · ${defi.role.padRight(13)} · ${s.year} · ${s.age} ans · graine ${defi.seed} · ${s.entities.named['club']}');
    }
    return;
  }

  if (fins) {
    // Quelles fins une carrière éclair atteint-elle ? `runs` carrières par rôle ET par politique de
    // joueur, toutes les fins posées comptées, celles de jauge comme les autres — et, pour chacune,
    // la carte qui l'a posée. Les fins que les livres ne peuvent plus atteindre depuis la fin du livre
    // (une carrière de livre s'arrête avant) sont celles qu'on regarde ici : elles dorment au
    // Cimetière tant qu'un mode ne les rend pas atteignables.
    const voulues = [
      'co_retraite', 'statue_de_bronze', 'en_retraite', 'en_chaussure', 'co_fuyard', 'co_pacte_tenu',
      'co_photo_famille', 'co_radiation', 'en_dauphin', 'en_placard', 'en_valise', 'jp_consultant', 'ta_loge',
    ];
    final total = <String, int>{};
    final parRole = <String, Map<String, int>>{};
    final cartes = <String, Map<String, int>>{};
    final exemple = <String, String>{};
    final parPolitique = <String, Map<String, int>>{};
    var n = 0;
    final jouees = _politiques.entries.where((e) => seule == null || e.key == seule).toList();
    for (final post in eclair) {
      for (final entry in jouees) {
        for (var i = 0; i < runs; i++) {
          final c = jouer(engine, _graine(i), post.index, entry.value);
          n++;
          total[c.fin] = (total[c.fin] ?? 0) + 1;
          final pp = parPolitique.putIfAbsent(c.fin, () => {});
          pp[entry.key] = (pp[entry.key] ?? 0) + 1;
          final r = parRole.putIfAbsent(c.fin, () => {});
          r[post.role] = (r[post.role] ?? 0) + 1;
          final cc = cartes.putIfAbsent(c.fin, () => {});
          cc[c.derniere] = (cc[c.derniere] ?? 0) + 1;
          exemple.putIfAbsent(c.fin, () => '${post.id} graine ${_graine(i)} ${entry.key} (${c.cartes} cartes)');
        }
      }
    }
    stdout.writeln('$n carrières éclair ($runs par rôle et par politique : ${jouees.map((e) => e.key).join(', ')})');
    stdout.writeln('');
    stdout.writeln('── les fins que le mode atteint, de la plus fréquente à la plus rare');
    final ordre = total.entries.toList()..sort((a, b) => b.value.compareTo(a.value));
    for (final e in ordre) {
      final titre = content.endings[e.key]?.title ?? '?';
      final roles = (parRole[e.key]!.entries.toList()..sort((a, b) => b.value.compareTo(a.value))).map((x) => '${x.key} ${x.value}').join(', ');
      stdout.writeln('  ${e.key.padRight(22)} ${e.value.toString().padLeft(5)} · ${_f(100 * e.value / n, 2)} % · $titre · $roles${_causes(cartes[e.key]!)}');
    }
    stdout.writeln('');
    stdout.writeln('── les fins de longue carrière demandées');
    for (final id in voulues) {
      final def = content.endings[id];
      if (def == null) {
        stdout.writeln('  $id : cette fin n\'existe pas dans le contenu');
      } else if ((total[id] ?? 0) == 0) {
        stdout.writeln('  $id : « ${def.title} » — JAMAIS atteinte en $n carrières');
      } else {
        final qui = jouees.map((e) => '${e.key} ${parPolitique[id]?[e.key] ?? 0}').join(', ');
        stdout.writeln('  $id : « ${def.title} » — ${total[id]} fois (${_f(100 * total[id]! / n, 2)} %) · $qui · ex. ${exemple[id]}');
      }
    }
    stdout.writeln('');
    stdout.writeln('── les fins du contenu que le mode n\'a jamais posées (hors fins de jauge et fins dormantes)');
    final jaugeIds = <String>{
      for (final r in content.roles.values)
        for (final g in r.gauges) ...[g.emptyEnding, g.fullEnding],
    };
    final jamais = [
      for (final e in content.endings.values)
        if (!(total.containsKey(e.id)) && !jaugeIds.contains(e.id)) e.id,
    ]..sort();
    stdout.writeln('  ${jamais.length} : ${jamais.join(', ')}');
    return;
  }

  if (fuites) {
    // Le contenu des livres ne doit jamais servir dans une carrière éclair : tout identifiant de
    // carte d'un livre (`…h7…`) ou toute carte dont le `when` lit un drapeau de livre est une fuite.
    final livre = RegExp(r'(^|\.)h\d+[._]');
    var fautes = 0;
    final cibles0 = postulat == null ? eclair : [content.postulatsByIndex[postulat]];
    for (final post in cibles0) {
      final vues = <String, int>{};
      for (var i = 0; i < runs; i++) {
        jouer(engine, _graine(i), post.index, i.isEven ? _politiques['random']! : _politiques['human_like']!, vues: vues);
      }
      final fautifs = <String>[];
      for (final id in vues.keys) {
        final card = content.cards[id];
        // un drapeau de livre lu en NÉGATIF (« pas le livre 4 ») n'est pas une dépendance au livre
        final enc = card == null
            ? ''
            : jsonEncode(card.when).replaceAll(RegExp(r'\["not",\["call","flag",\[\["lit","histoire_h\d+"\]\]\]\]'), '');
        if (livre.hasMatch(id) || enc.contains('histoire_h')) fautifs.add('$id ×${vues[id]}');
      }
      fautifs.sort();
      stdout.writeln('${post.id} : ${vues.length} cartes distinctes servies sur $runs carrières, ${fautifs.length} fuite(s)'
          '${fautifs.isEmpty ? '' : ' : ${fautifs.join(', ')}'}');
      fautes += fautifs.length;
    }
    if (fautes > 0) exit(2);
    return;
  }

  if (traceSeed != null) {
    final p = postulat ?? eclair.first.index;
    final out = StringBuffer();
    jouer(engine, traceSeed, p, _politiques[politique]!, trace: out);
    stdout.write(out);
    return;
  }

  final cibles = postulat == null ? eclair : [content.postulatsByIndex[postulat]];
  for (final post in cibles) {
    stdout.writeln('══ ${post.id} (postulat ${post.index}, ${post.role}) · $runs carrières par politique ══');
    for (final entry in _politiques.entries.where((e) => seule == null || e.key == seule)) {
      final cartes = <int>[], semaines = <int>[], saisons = <int>[];
      final fins = <String, int>{};
      final causes = <String, Map<String, int>>{};
      final jauges = <String, int>{};
      var famine = 0, nonFinies = 0;
      final annees = <int>[];
      for (var i = 0; i < runs; i++) {
        final c = jouer(engine, _graine(i), post.index, entry.value);
        cartes.add(c.cartes);
        semaines.add(c.semaines);
        saisons.add(c.saisons);
        annees.add(c.annee);
        fins[c.fin] = (fins[c.fin] ?? 0) + 1;
        final cc = causes.putIfAbsent(c.fin, () => {});
        cc[c.derniere] = (cc[c.derniere] ?? 0) + 1;
        if (c.jauge != null) jauges[c.jauge!] = (jauges[c.jauge!] ?? 0) + 1;
        famine += c.famine;
        if (!c.fini) nonFinies++;
      }
      final moy = cartes.fold<int>(0, (a, b) => a + b) / runs;
      final parJauge = jauges.values.fold<int>(0, (a, b) => a + b);
      final top = fins.entries.toList()..sort((a, b) => b.value.compareTo(a.value));
      stdout.writeln('  ${entry.key.padRight(10)} cartes p10 ${_f(_pct(cartes, .1))} · méd ${_f(_pct(cartes, .5))} · p90 ${_f(_pct(cartes, .9))} · max ${cartes.reduce((a, b) => a > b ? a : b)}'
          ' · moy ${_f(moy)} · semaines méd ${_f(_pct(semaines, .5))} · p90 ${_f(_pct(semaines, .9))} · saisons méd ${_f(_pct(saisons, .5))}'
          '${nonFinies > 0 ? ' · NON FINIES $nonFinies' : ''}');
      final j = (jauges.entries.toList()..sort((a, b) => b.value.compareTo(a.value))).map((e) => '${e.key} ${_f(100 * e.value / runs)}%').join(' · ');
      stdout.writeln('             fin par jauge ${_f(100 * parJauge / runs)} % : $j');
      stdout.writeln('             autres fins : ${top.where((e) => !_estJauge(content, post.role, e.key)).take(16).map((e) => '${e.key} ${_f(100 * e.value / runs, 1)}%${_causes(causes[e.key]!)}').join(' · ')}'
          ' · famine $famine · années ${annees.reduce((a, b) => a < b ? a : b)}–${annees.reduce((a, b) => a > b ? a : b)}');
    }
  }
}

String _causes(Map<String, int> m) {
  final l = m.entries.toList()..sort((a, b) => b.value.compareTo(a.value));
  return ' [${l.take(3).map((e) => '${e.key}:${e.value}').join(', ')}]';
}

bool _estJauge(Content content, String role, String id) {
  final r = content.roles[role];
  if (r == null) return false;
  for (final g in r.gauges) {
    if (g.emptyEnding == id || g.fullEnding == id) return true;
  }
  return false;
}
