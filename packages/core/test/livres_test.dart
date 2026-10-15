/// L — LES LIVRES : une carrière jouée sur (commun + livre) est celle du bundle
/// entier.
///
/// L'aperçu web ne décompresse plus le bundle entier au démarrage : build_content
/// le découpe (packages/tools/bin/src/livres.dart) en `content/build/livres/
/// commun.json` et un fichier par livre, et la page fusionne le commun et le
/// livre d'une carrière quand elle commence (packages/tools/web/demarrage.js).
/// Ce test lit ces fichiers tels que build_content les a écrits et vérifie, pour
/// chacun des dix livres :
///   L1 — la fusion rend le bundle entier restreint à ce livre : tout ce qui
///        n'est pas découpé est identique ; une liste découpée est la liste
///        entière, dans son ordre, moins ce qui appartient aux autres livres
///        (un bouche-trou à sa place dans les listes stables) ;
///   L2 — les goldens du livre (content/tests/goldens.yaml) et des carrières
///        simulées donnent, carte après carte, le même état (empreinte, carte en
///        attente avec son texte, ses libellés, ses effets et son payload), et à
///        la fin le même état entier et la même frise, sur le bundle fusionné et
///        sur le bundle entier — y compris quand la ville s'en mêle (une activité,
///        une scène de la semaine ou une mission du livre, appliquées aux deux),
///        quand une carrière hérite des précédentes (`Engine.heritage` : les
///        fantômes et le dossier 1974, qui réveillent des cartes du livre) et
///        quand le samedi se joue en direct (`samediDirect`, des décisions rendues
///        avec la posture) ;
///   L0 — ce que l'accueil lit sans livre (l'épilogue du dossier 1974, joué
///        depuis l'accueil) est au commun.
///
/// **Quand ce test devient rouge** après un changement de contenu : un item a
/// été rangé dans un livre alors qu'un autre livre peut le servir ou le voir
/// (la règle est dans livres.dart). Le message dit le livre, la graine et la
/// carte où les deux carrières se séparent.
library;

import 'dart:convert';
import 'dart:io';

import 'package:fusible_core/fusible_core.dart';
import 'package:test/test.dart';

Directory _racine() {
  var dir = Directory.current;
  for (var i = 0; i < 6; i++) {
    if (File('${dir.path}/content/build/content.json').existsSync()) return dir;
    final parent = dir.parent;
    if (parent.path == dir.path) break;
    dir = parent;
  }
  throw StateError('content/build/content.json introuvable — lance d\'abord build_content');
}

// ── La fusion, telle que la page la fait (demarrage.js `fusionner`, livres.dart
// `fusionnerLivre`) : relue ici pour vérifier les fichiers, pas le code qui les écrit.
List<int> _dePlages(List<dynamic> p) => [
      for (var i = 0; i + 1 < p.length; i += 2)
        for (var k = 0; k < (p[i + 1] as num).toInt(); k++) (p[i] as num).toInt() + k,
    ];

List<dynamic>? _lire(Map<String, dynamic> b, String chemin) {
  Object? x = b;
  for (final k in chemin.split('.')) {
    x = x is Map ? x[k] : null;
  }
  return x is List ? x : null;
}

void _poser(Map<String, dynamic> b, String chemin, List<dynamic> l) {
  final ks = chemin.split('.');
  Map<dynamic, dynamic> x = b;
  for (var i = 0; i < ks.length - 1; i++) {
    x = x[ks[i]] as Map<dynamic, dynamic>;
  }
  x[ks.last] = l;
}

Map<String, dynamic> _fusionner(String communJson, Map<String, dynamic>? livre) {
  final out = jsonDecode(communJson) as Map<String, dynamic>;
  final d = out.remove('__livres') as Map<String, dynamic>;
  final stables = (d['stables'] as List).cast<String>().toSet();
  final listes = ((livre?['listes'] as Map?) ?? const {}).cast<String, dynamic>();
  for (final e in listes.entries) {
    final base = _lire(out, e.key)!;
    final pos = _dePlages((e.value as Map)['pos'] as List);
    final its = (e.value as Map)['items'] as List;
    if (stables.contains(e.key)) {
      for (var k = 0; k < pos.length; k++) {
        base[pos[k]] = its[k];
      }
      continue;
    }
    final posC = _dePlages(((d['listes'] as Map)[e.key] as List?) ?? const []);
    final m = <dynamic>[];
    var i = 0, j = 0;
    while (i < base.length || j < its.length) {
      if (j >= its.length || (i < base.length && posC[i] < pos[j])) {
        m.add(base[i++]);
      } else {
        m.add(its[j++]);
      }
    }
    _poser(out, e.key, m);
  }
  return out;
}

bool _bouchon(Object? x) =>
    x is Map && (x['roles'] is List && (x['roles'] as List).length == 1 && (x['roles'] as List).first == '-' || x['qui'] == '-');

/// Le bundle comme JavaScript le réécrit : la page fusionne en JS et rend au
/// moteur `JSON.stringify(...)`, où le `1.0` du bundle devient `1` et où les clés
/// qui sont des entiers (`"3"` d'un `on_relation`) passent devant les autres. Le
/// moteur doit lire les deux de la même façon : les carrières se jouent sur cette forme.
final RegExp _indexJs = RegExp(r'^(0|[1-9][0-9]{0,8})$');
Object? _commeJs(Object? x) {
  if (x is double) return x.isFinite && x == x.truncateToDouble() ? x.toInt() : x;
  if (x is Map) {
    final ks = x.keys.cast<String>().toList();
    final entiers = ks.where(_indexJs.hasMatch).toList()..sort((a, b) => int.parse(a).compareTo(int.parse(b)));
    return <String, dynamic>{
      for (final k in [...entiers, ...ks.where((k) => !_indexJs.hasMatch(k))]) k: _commeJs(x[k])
    };
  }
  if (x is List) return [for (final y in x) _commeJs(y)];
  return x;
}

String _j(Object? x) => jsonEncode(_commeJs(x));

/// Deux JSON égaux ; sinon l'échec montre l'endroit où ils se séparent (pas
/// deux pavés de plusieurs mégaoctets).
void _pareil(String obtenu, String attendu, String raison) {
  if (obtenu == attendu) return;
  var i = 0;
  while (i < obtenu.length && i < attendu.length && obtenu.codeUnitAt(i) == attendu.codeUnitAt(i)) {
    i++;
  }
  String autour(String s) => s.substring((i - 120).clamp(0, s.length), (i + 160).clamp(0, s.length));
  fail('$raison\n  au caractère $i\n  attendu : …${autour(attendu)}…\n  obtenu  : …${autour(obtenu)}…');
}

/// Ce que la ville peut demander au moteur dans ce livre : les activités de
/// toutes (communes), les scènes et missions présentes dans le bundle fusionné.
class _Ville {
  final List<String> activites;
  final List<(String, String, String)> missions; // (id, étape, choix)
  _Ville(this.activites, this.missions);
  factory _Ville.de(Map<String, dynamic> b) {
    final v = (b['ville'] as Map?)?.cast<String, dynamic>() ?? const {};
    final acts = [for (final a in (v['activites'] as List? ?? const [])) (a as Map)['id'] as String]..sort();
    final ms = <(String, String, String)>[];
    for (final k in const ['missions', 'scenes']) {
      for (final m in (v[k] as List? ?? const [])) {
        final et = ((m as Map)['etapes'] as List? ?? const []);
        if (et.isEmpty) continue;
        final e0 = et.first as Map;
        final ch = (e0['choix'] as List? ?? const []);
        ms.add((m['id'] as String, e0['id'] as String, ch.isEmpty ? '' : (ch.first as Map)['id'] as String));
      }
    }
    ms.sort((a, b) => a.$1.compareTo(b.$1));
    return _Ville(acts, ms);
  }
}

void main() {
  final racine = _racine();
  final entierJson = File('${racine.path}/content/build/content.json').readAsStringSync();
  final entier = jsonDecode(entierJson) as Map<String, dynamic>;
  final dossier = Directory('${racine.path}/content/build/livres');
  final communFichier = File('${dossier.path}/commun.json');

  group('L · les livres de l\'aperçu web', () {
    test('L0 · build_content a écrit le commun et ses livres, pour ce contenu', () {
      expect(communFichier.existsSync(), isTrue, reason: 'content/build/livres/commun.json absent — relance build_content');
      final c = jsonDecode(communFichier.readAsStringSync()) as Map<String, dynamic>;
      expect(c['hash'], entier['hash'], reason: 'le commun ne vient pas de ce content.json — relance build_content');
      for (final id in ((c['__livres'] as Map)['livres'] as List).cast<String>()) {
        final l = jsonDecode(File('${dossier.path}/$id.json').readAsStringSync()) as Map<String, dynamic>;
        expect(l['hash'], entier['hash'], reason: 'le livre $id ne vient pas de ce content.json');
      }
    });
    if (!communFichier.existsSync()) return;
    final communJson = communFichier.readAsStringSync();
    final descr = (jsonDecode(communJson) as Map<String, dynamic>)['__livres'] as Map<String, dynamic>;
    final stables = (descr['stables'] as List).cast<String>().toSet();
    final decoupees = {...((descr['listes'] as Map).keys.cast<String>()), ...stables};
    final engineEntier = Engine(Content.fromJson(jsonDecode(entierJson) as Map<String, dynamic>));
    final goldensTexte = File('${racine.path}/content/tests/goldens.yaml').readAsStringSync();
    final goldens = parseGoldens(goldensTexte);
    final posts = (entier['postulats'] as List).cast<Map<String, dynamic>>().toList()
      ..sort((a, b) => (a['index'] as num).compareTo(b['index'] as num));

    final livres = <String, Map<String, dynamic>>{};
    for (final post in posts) {
      final f = File('${dossier.path}/${post['id']}.json');
      if (f.existsSync()) livres[post['id'] as String] = jsonDecode(f.readAsStringSync()) as Map<String, dynamic>;
    }

    test('L0 · aucun item ne se perd : chaque position est au commun ou dans un livre', () {
      final c = jsonDecode(communJson) as Map<String, dynamic>;
      for (final l in decoupees) {
        final n = _lire(entier, l)!.length;
        final vues = <int>{};
        if (stables.contains(l)) {
          final cl = _lire(c, l)!;
          for (var i = 0; i < cl.length; i++) {
            if (!_bouchon(cl[i])) vues.add(i);
          }
        } else {
          vues.addAll(_dePlages(((descr['listes'] as Map)[l] as List?) ?? const []));
        }
        for (final lv in livres.values) {
          final e = (lv['listes'] as Map)[l];
          if (e != null) vues.addAll(_dePlages((e as Map)['pos'] as List));
        }
        final perdus = [
          for (var i = 0; i < n; i++)
            if (!vues.contains(i)) i
        ];
        expect(perdus, isEmpty, reason: '$l : ${perdus.length} item(s) ni au commun ni dans un livre (positions ${perdus.take(8).toList()})');
      }
    });

    test('L0 · ce que l\'accueil lit sans livre est au commun (l\'épilogue du dossier 1974)', () {
      final c = jsonDecode(communJson) as Map<String, dynamic>;
      final epi = (((entier['ville'] as Map?)?['dossier'] as Map?)?['epilogue'] as Map?)?['cinematique'];
      if (epi == null) return;
      final ids = ((c['ville'] as Map)['cinematiques'] as List).map((x) => (x as Map)['id']).toSet();
      expect(ids, contains(epi), reason: 'la scène $epi se joue depuis l\'accueil, avant tout livre : elle doit être au commun');
    });

    // Les rôles qu'une carrière de chaque livre peut tenir (roles.yaml `transitions`,
    // et les `role:` des items qui jouent un rôle atteint) : la ville tire par rôle.
    final roleDef = {for (final r in (entier['roles'] as List).cast<Map<String, dynamic>>()) r['id'] as String: r};
    final effetsRole = <(Set<String>, String)>[];
    void chercher(Object? x, Set<String> rs) {
      if (x is Map) {
        if (x['role'] is String && roleDef.containsKey(x['role'])) effetsRole.add((rs, x['role'] as String));
        for (final v in x.values) {
          chercher(v, rs);
        }
      } else if (x is List) {
        for (final v in x) {
          chercher(v, rs);
        }
      }
    }

    for (final k in const ['cards', 'arcs', 'unes', 'setpieces', 'ville']) {
      void items(Object? x) {
        if (x is List) {
          for (final o in x.whereType<Map<dynamic, dynamic>>()) {
            final rs = (o['roles'] as List? ?? const []).map((e) => '$e').toSet();
            for (final e in o.entries) {
              if (e.key != 'roles') chercher(e.value, rs);
            }
          }
        } else if (x is Map) {
          x.values.forEach(items);
        }
      }

      items(entier[k]);
    }
    Set<String> rolesDe(Map<String, dynamic> post) {
      final r = <String>{post['role'] as String};
      for (var change = true; change;) {
        change = false;
        for (final x in List.of(r)) {
          for (final t in ((roleDef[x]?['transitions'] as List?) ?? const []).cast<Map<dynamic, dynamic>>()) {
            if (r.add(t['to'] as String)) change = true;
          }
        }
        for (final (rs, vers) in effetsRole) {
          if ((rs.isEmpty || rs.any(r.contains)) && r.add(vers)) change = true;
        }
      }
      return r;
    }

    final drapeauDe = <String, String>{
      for (final post in posts)
        for (final f in (post['flags'] as List? ?? const []))
          if (RegExp(r'^histoire_h\d+$').hasMatch('$f')) '$f': post['id'] as String,
    };

    for (var p = 0; p < posts.length; p++) {
      final id = posts[p]['id'] as String;
      test('L3 · $id : ce que la ville du livre n\'a pas, elle ne peut pas le tirer', () {
        // un lot de la ville absent de (commun + livre) exige l'histoire d'un autre
        // livre (`flag(histoire_hN)` dans son `si`, la grammaire de ville.js), ou
        // un rôle que ce livre ne tient jamais
        final roles = rolesDe(posts[p]);
        final c = jsonDecode(communJson) as Map<String, dynamic>;
        final lv = livres[id];
        for (final l in decoupees.where((l) => l.startsWith('ville.'))) {
          final tout = _lire(entier, l)!;
          final la = <int>{};
          if (stables.contains(l)) {
            final cl = _lire(c, l)!;
            for (var i = 0; i < cl.length; i++) {
              if (!_bouchon(cl[i])) la.add(i);
            }
          } else {
            la.addAll(_dePlages(((descr['listes'] as Map)[l] as List?) ?? const []));
          }
          final e = (lv?['listes'] as Map?)?[l];
          if (e != null) la.addAll(_dePlages((e as Map)['pos'] as List));
          for (var i = 0; i < tout.length; i++) {
            if (la.contains(i)) continue;
            final o = tout[i] as Map;
            final termes = '${o['si'] ?? ''}'.split('&&').map((t) => t.trim().replaceAll(RegExp('[\'"]'), ''));
            final autreLivre = termes.any((t) {
              final m = RegExp(r'^flag\(\s*(histoire_h\d+)\s*\)$').firstMatch(t);
              return m != null && drapeauDe[m.group(1)] != null && drapeauDe[m.group(1)] != id;
            });
            final rs = (o['roles'] as List? ?? const []).map((e) => '$e').toSet();
            final horsRole = rs.isNotEmpty && !rs.any(roles.contains);
            expect(autreLivre || horsRole, isTrue, reason: '$id : $l[$i] (${o['id'] ?? o['qui']}) manque au livre alors qu\'il peut y servir');
          }
        }
      });
    }

    // L'héritage des carrières d'avant (`Engine.heritage`), comme la page le passe
    // (preview_dossier.js `fantomeHeritage`) : un fantôme par livre (`fantome_<livre>`, son nom,
    // ses années), tous les faits qu'il a pu laisser (`fantome_<fait>`), toutes les pièces du
    // dossier 1974 (`dossier_<pièce>`) — de quoi réveiller ce qu'un livre garde pour ses fantômes.
    final villeEntiere = (entier['ville'] as Map?) ?? const {};
    final heritageDrapeaux = <String>[];
    final heritageNoms = <String, String>{};
    (((villeEntiere['fantomes'] as Map?)?['livres'] as Map?) ?? const {}).forEach((livre, def) {
      heritageDrapeaux.add('fantome_$livre');
      heritageNoms['fantome_$livre'] = 'Chastain';
      heritageNoms['fantome_${livre}_annees'] = '1990-1993';
      for (final f in ((def as Map)['faits'] as List? ?? const [])) {
        heritageDrapeaux.add('fantome_${(f as Map)['id']}');
      }
    });
    for (final piece in (((villeEntiere['dossier'] as Map?)?['pieces'] as List?) ?? const [])) {
      heritageDrapeaux.add('dossier_${(piece as Map)['id']}');
    }
    heritageDrapeaux.sort();

    for (var p = 0; p < posts.length; p++) {
      final id = posts[p]['id'] as String;
      final livre = livres[id];
      final fusion = _fusionner(communJson, livre);

      test('L1 · $id : la fusion rend le bundle entier restreint au livre', () {
        // tout ce qui n'est pas découpé est le bundle entier
        Map<String, dynamic> sansDecoupe(Map<String, dynamic> b) {
          final c = jsonDecode(jsonEncode(b)) as Map<String, dynamic>;
          for (final l in decoupees) {
            if (_lire(c, l) != null) _poser(c, l, const []);
          }
          return c;
        }

        _pareil(_j(sansDecoupe(fusion)), _j(sansDecoupe(entier)), 'hors des listes découpées, le commun diffère du bundle entier');
        final posLivre = <String, Set<int>>{
          for (final e in ((livre?['listes'] as Map?) ?? const {}).entries) e.key as String: _dePlages((e.value as Map)['pos'] as List).toSet(),
        };
        for (final l in decoupees) {
          final tout = _lire(entier, l)!;
          final m = _lire(fusion, l)!;
          if (stables.contains(l)) {
            final c = _lire(jsonDecode(communJson) as Map<String, dynamic>, l)!;
            expect(m.length, tout.length, reason: '$l : une liste stable garde sa longueur');
            for (var i = 0; i < tout.length; i++) {
              final attendu = (!_bouchon(c[i]) || (posLivre[l]?.contains(i) ?? false)) ? tout[i] : c[i];
              if (!_bouchon(c[i])) _pareil(_j(c[i]), _j(tout[i]), '$l[$i] : l\'item commun n\'est pas celui du bundle entier');
              _pareil(_j(m[i]), _j(attendu), '$l[$i]');
            }
          } else {
            final garde = {..._dePlages(((descr['listes'] as Map)[l] as List?) ?? const []), ...?posLivre[l]};
            final attendu = [
              for (var i = 0; i < tout.length; i++)
                if (garde.contains(i)) tout[i]
            ];
            _pareil(_j(m), _j(attendu), '$l : la fusion ne rend pas la liste entière restreinte au livre');
          }
        }
      });

      test('L2 · $id : goldens et carrières identiques sur (commun + livre) et sur le bundle entier', () {
        final engineLivre = Engine(Content.fromJson(_commeJs(fusion) as Map<String, dynamic>));
        final ville = _Ville.de(fusion);
        // les goldens du livre
        var nGoldens = 0;
        for (final g in goldens) {
          final code = CareerCode.decode(g.code)!;
          if (code.postulat != p) continue;
          nGoldens++;
          expect(replayCode(engineLivre, code).digest, replayCode(engineEntier, code).digest, reason: '$id : golden ${g.code}');
        }
        // des carrières simulées : des choix tirés d'une graine, la ville qui s'en mêle
        const carrieres = 30;
        var cartes = 0, heritees = 0, directs = 0, fantomes = 0;
        final fins = <String>{};
        for (var k = 0; k < carrieres; k++) {
          final seed = (k + 1) * 2654435761 & 0x7FFFFFFF;
          final choix = Rng(seed ^ 0x5bd1e995);
          var a = engineEntier.start(seed, postulat: p);
          var b = engineLivre.start(seed, postulat: p);
          // une carrière sur trois hérite des précédentes (les fantômes, le dossier 1974)
          if (k % 3 == 2) {
            a = engineEntier.heritage(a, drapeaux: heritageDrapeaux, noms: heritageNoms);
            b = engineLivre.heritage(b, drapeaux: heritageDrapeaux, noms: heritageNoms);
            heritees++;
          }
          for (var step = 0; step < 1400 && !a.over; step++) {
            final ou = '$id · graine $seed · pas $step · carte ${a.pending?.id}';
            expect(b.pending?.id, a.pending?.id, reason: '$ou : la carte servie diffère');
            _pareil(_j(b.pending?.toJson()), _j(a.pending?.toJson()), '$ou : la carte en attente diffère');
            expect(b.fingerprint(), a.fingerprint(), reason: '$ou : l\'état diffère');
            // la vue lit la carte par son id (ses tags) : elle doit y être
            final pid = a.pending?.id;
            if (pid != null && engineEntier.content.cards.containsKey(pid)) {
              expect(engineLivre.content.cards.containsKey(pid), isTrue, reason: '$ou : la carte manque au livre');
            }
            // la ville : une activité de temps en temps, une scène ou une mission du livre parfois
            if (step % 5 == 3 && ville.activites.isNotEmpty) {
              final act = ville.activites[(step ~/ 5 + k) % ville.activites.length];
              a = engineEntier.activite(a, act, jauges: step % 2 == 1);
              b = engineLivre.activite(b, act, jauges: step % 2 == 1);
            }
            if (step % 13 == 7 && ville.missions.isNotEmpty) {
              final m = ville.missions[(step ~/ 13 + 3 * k) % ville.missions.length];
              a = engineEntier.mission(a, m.$1, m.$2, m.$3);
              b = engineLivre.mission(b, m.$1, m.$2, m.$3);
            }
            if (a.over) break;
            if (a.pending?.id.startsWith('co.fantome.') ?? false) fantomes++;
            final droite = k == 0 ? true : (k == 1 ? false : choix.nextDouble() < 0.5);
            // le samedi en direct, une carrière sur deux : le même script, et des décisions rendues avec la posture
            MatchDirect? direct;
            if (k.isOdd && a.pending?.kind == 'match') {
              final sa = engineEntier.samediDirect(a, droite), sb = engineLivre.samediDirect(b, droite);
              _pareil(_j(sb?.toJsonVille()), _j(sa?.toJsonVille()), '$ou : le script du samedi en direct diffère');
              if (sa != null) {
                direct = MatchDirect([for (final d in sa.decisions) ChoixDirect(d.def.id, droite: choix.nextDouble() < 0.5)]);
                directs++;
              }
            }
            a = engineEntier.choose(a, droite, direct: direct);
            b = engineLivre.choose(b, droite, direct: direct);
            cartes++;
          }
          _pareil(_j(b.toJson()), _j(a.toJson()), '$id · graine $seed : l\'état final diffère');
          _pareil(_j(engineLivre.friseOf(b).toJson()), _j(engineEntier.friseOf(a).toJson()), '$id · graine $seed : la frise diffère');
          if (a.endingId != null) fins.add(a.endingId!);
        }
        // ce que le test a vraiment couvert (relu quand on touche à la règle)
        print('L2 · $id : $nGoldens goldens, $carrieres carrières ($heritees avec héritage), $cartes cartes, '
            '$directs samedis en direct, $fantomes cartes de fantôme, fins ${fins.toList()..sort()}');
        expect(cartes, greaterThan(carrieres * 40), reason: '$id : les carrières simulées sont trop courtes pour prouver quoi que ce soit');
      }, timeout: const Timeout(Duration(minutes: 10)));
    }
  });
}
