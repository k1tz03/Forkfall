/// LE SAMEDI EN DIRECT (docs/histoires/samedi_direct.md) : les décisions prises
/// au bord du terrain pendant le match que la ville met en scène.
///
/// Les quatre preuves demandées :
///   (a) une carrière sans décision ne change pas d'un bit (et les vingt
///       goldens, `goldens_test.dart`, restent tels quels) ;
///   (b) les mêmes décisions donnent le même résultat, ici comme après une
///       sauvegarde ;
///   (c) les décisions déplacent les chances dans le sens voulu ;
///   (d) elles ne consomment aucun tirage du générateur de la carrière.
library;

import 'dart:convert';
import 'dart:io';

import 'package:fusible_core/fusible_core.dart';
import 'package:test/test.dart';

Map<String, dynamic> _bundle() {
  var dir = Directory.current;
  for (var i = 0; i < 6; i++) {
    final f = File('${dir.path}/content/build/content.json');
    if (f.existsSync()) return (json.decode(f.readAsStringSync()) as Map).cast<String, dynamic>();
    final parent = dir.parent;
    if (parent.path == dir.path) break;
    dir = parent;
  }
  throw StateError('content/build/content.json introuvable — lance d\'abord build_content');
}

/// L'algorithme de `resolveBlock` tel qu'il était avant le direct, recopié mot
/// pour mot : la référence de la preuve (a).
BlockResult _resolveBlockAvant(Rng rng, int force, int division, Map<String, int> gauges, {double postureMod = 0}) {
  int w = 0, d = 0, l = 0, pts = 0;
  final letters = <String>[];
  for (int i = 0; i < 6; i++) {
    final opp = divisionBaseForce(division) + rng.range(-10, 10);
    final pw = pWin(force, opp, gauges, postureMod: postureMod);
    final pn = pNul(force, opp);
    final roll = rng.nextDouble();
    if (roll < pw) {
      w++;
      pts += 3;
      letters.add('V');
    } else if (roll < pw + pn) {
      d++;
      pts += 1;
      letters.add('N');
    } else {
      l++;
      letters.add('D');
    }
  }
  return BlockResult(letters.join(' '), w, d, l, pts, 0);
}

/// Joue jusqu'à la prochaine carte de match (un bot simple et déterministe).
GameState _jusquAuMatch(Engine e, GameState s, {int garde = 120}) {
  var g = 0;
  while (!s.over && s.pending!.kind != 'match' && g++ < garde) {
    final p = s.pending!;
    s = e.choose(s, p.single ? true : (s.turn % 3 != 0));
  }
  return s;
}

/// Les décisions du script, toutes du même côté (ou selon [cote]).
MatchDirect _choix(ScenarioDirect sc, bool Function(DecisionPrevue) cote) =>
    MatchDirect([for (final d in sc.decisions) ChoixDirect(d.def.id, droite: cote(d))]);

void main() {
  final bundle = _bundle();
  final content = Content.fromJson(bundle);
  final engine = Engine(content);

  group('(a) sans décision, rien ne change', () {
    test('resolveBlock sans `dernier` est l\'algorithme d\'avant, au bit près (et au même tirage près)', () {
      final r = Rng(20261015);
      for (var i = 0; i < 5000; i++) {
        final seed = r.next();
        final force = r.range(20, 90), div = r.range(1, 2);
        final gauges = {'vestiaire': r.range(0, 100), 'tribunes': r.range(0, 100), 'direction': r.range(0, 100), 'caisse': 50};
        final mod = r.nextDouble() < 0.5 ? postureModDe(true) : postureModDe(false);
        final a = Rng(seed), b = Rng(seed);
        final avant = _resolveBlockAvant(a, force, div, gauges, postureMod: mod);
        final apres = resolveBlock(b, force, div, gauges, postureMod: mod);
        expect(apres.results, avant.results);
        expect(apres.points, avant.points);
        expect(b.state, a.state);
        expect(apres.sansDirect, isNull);
      }
    });

    test('une carrière sans décision ne porte pas de trace, et se sérialise comme avant', () {
      for (final p in [0, 2, 4, 5, 6]) {
        var s = engine.start(31337 + p, postulat: p);
        for (var i = 0; i < 60 && !s.over; i++) {
          s = engine.choose(s, i % 3 != 0);
        }
        expect(s.direct, isEmpty);
        final j = s.toJson();
        expect(j.containsKey('direct'), isFalse, reason: 'postulat $p : la sauvegarde n\'a pas de clé `direct`');
        expect(jsonEncode(GameState.fromJson(jsonDecode(jsonEncode(j)) as Map<String, dynamic>).toJson()), jsonEncode(j));
      }
    });

    test('choose(…, direct: null) est choose(…), et le script du samedi est pur', () {
      for (final p in [0, 3, 6, 9]) {
        var s1 = engine.start(4242, postulat: p), s2 = engine.start(4242, postulat: p);
        for (var i = 0; i < 80 && !s1.over; i++) {
          final r = i % 4 != 1;
          if (s1.pending!.kind == 'match') {
            final avant = jsonEncode(s1.toJson());
            engine.samediDirect(s1, r);
            engine.samediDirect(s1, !r);
            expect(jsonEncode(s1.toJson()), avant, reason: 'le script ne touche pas l\'état');
          }
          s1 = engine.choose(s1, r);
          s2 = engine.choose(s2, r, direct: null);
          expect(s2.fingerprint(), s1.fingerprint());
        }
        expect(jsonEncode(s2.toJson()), jsonEncode(s1.toJson()));
      }
    });
  });

  group('(b) les mêmes décisions, le même samedi', () {
    test('deux fois le même choix : le même état, au caractère près', () {
      var vus = 0;
      for (final p in [0, 1, 2, 4, 5, 6, 7, 9]) {
        final s = _jusquAuMatch(engine, engine.start(99 + p, postulat: p));
        if (s.over || s.pending!.kind != 'match') continue;
        final sc = engine.samediDirect(s, false)!;
        final d = _choix(sc, (x) => x.minute.isEven);
        final a = engine.choose(s, false, direct: d), b = engine.choose(s, false, direct: d);
        expect(jsonEncode(a.toJson()), jsonEncode(b.toJson()));
        expect(a.direct, hasLength(1));
        expect(a.direct.single.choix.map((c) => c.id).toList(), sc.decisions.map((x) => x.def.id).toList());
        // le script se refait à l'identique, ici comme après une sauvegarde
        final repris = GameState.fromJson(jsonDecode(jsonEncode(s.toJson())) as Map<String, dynamic>);
        expect(jsonEncode(engine.samediDirect(repris, false)!.toJsonVille()), jsonEncode(sc.toJsonVille()));
        expect(jsonEncode(engine.choose(repris, false, direct: d).toJson()), jsonEncode(a.toJson()));
        vus++;
      }
      expect(vus, greaterThanOrEqualTo(6));
    });

    test('le tableau final dit la lettre jouée, et suit le score du script', () {
      var n = 0;
      for (final p in [0, 2, 4, 6, 8]) {
        for (final seed in [1, 2, 3, 4, 5]) {
          var s = engine.start(seed, postulat: p);
          for (var m = 0; m < 6; m++) {
            s = _jusquAuMatch(engine, s);
            if (s.over || s.pending!.kind != 'match') break;
            final sc = engine.samediDirect(s, true);
            if (sc == null) {
              s = engine.choose(s, true);
              continue;
            }
            // à chaque décision, le score du script est celui des buts d'avant
            for (final d in sc.decisions) {
              expect(d.pour, sc.buts.where((b) => b[0] < d.minute && b[1] == 1).length);
              expect(d.contre, sc.buts.where((b) => b[0] < d.minute && b[1] == 0).length);
              expect(d.def.convient(s.role, _momentDe(d.minute), d.situation), isTrue);
            }
            s = engine.choose(s, true, direct: _choix(sc, (x) => x.def.defautDroite));
            final t = s.direct.last;
            final lettre = s.world.lastResults.split(' ').last;
            expect(t.lettre, lettre);
            expect(lettre == 'V' ? t.pour > t.contre : (lettre == 'N' ? t.pour == t.contre : t.pour < t.contre), isTrue,
                reason: '$lettre ${t.pour}-${t.contre}');
            expect(t.buts.take(sc.buts.length).toList(), sc.buts, reason: 'la fin du match prolonge le script');
            expect(t.buts.skip(sc.buts.length).every((b) => b[0] > sc.fin && b[0] <= 89), isTrue);
            n++;
          }
        }
      }
      expect(n, greaterThan(60));
    });

    test('une décision qui n\'était pas au script ne compte pas', () {
      final s = _jusquAuMatch(engine, engine.start(777, postulat: 0));
      final sc = engine.samediDirect(s, true)!;
      final faux = MatchDirect([const ChoixDirect('pas_au_script', droite: false), for (final d in sc.decisions) ChoixDirect('${d.def.id}_x', droite: false)]);
      final a = engine.choose(s, true, direct: faux);
      final b = engine.choose(s, true);
      expect(a.direct.single.choix, isEmpty);
      expect(a.world.lastResults, b.world.lastResults);
      expect(a.rngState, b.rngState);
    });
  });

  group('(c) les décisions pèsent dans le sens voulu', () {
    test('sur la dernière journée, +6 sur la victoire en donne ~6 de plus ; +6 sur le nul retire des défaites', () {
      final r = Rng(7);
      var v0 = 0, v1 = 0, d0 = 0, d2 = 0, autres = 0, aRebours = 0;
      const n = 20000;
      for (var i = 0; i < n; i++) {
        final seed = r.next();
        final force = r.range(30, 80), div = r.range(1, 2);
        final g = {'vestiaire': r.range(20, 80), 'tribunes': r.range(20, 80), 'direction': r.range(20, 80), 'caisse': 50};
        final sans = resolveBlock(Rng(seed), force, div, g);
        final plusV = resolveBlock(Rng(seed), force, div, g, dernier: const DernierMatch(6, 0));
        final plusN = resolveBlock(Rng(seed), force, div, g, dernier: const DernierMatch(0, 6));
        final l0 = sans.results.split(' ').last, l1 = plusV.results.split(' ').last, l2 = plusN.results.split(' ').last;
        if (l0 == 'V') v0++;
        if (l1 == 'V') v1++;
        if (l0 == 'D') d0++;
        if (l2 == 'D') d2++;
        // les cinq premières journées ne bougent jamais
        if (sans.results.substring(0, 9) != plusV.results.substring(0, 9) || sans.results.substring(0, 9) != plusN.results.substring(0, 9)) autres++;
        // jamais à rebours : un geste « victoire » ne fait perdre aucune victoire,
        // un geste « nul » n'ajoute aucune défaite
        if ((l0 == 'V' && l1 != 'V') || (l0 != 'D' && l2 == 'D')) aRebours++;
        expect(plusV.sansDirect, l0);
      }
      expect(autres, 0);
      expect(aRebours, 0);
      expect((v1 - v0) / n, closeTo(0.06, 0.012));
      expect((d0 - d2) / n, closeTo(0.06, 0.012));
    });

    test('dans de vraies carrières, les gestes audacieux gagnent plus que les gestes prudents', () {
      var vAudace = 0, vPrudence = 0, n = 0, bascules = 0;
      for (var p = 0; p < content.postulatsByIndex.length; p++) {
        for (final seed in [11, 12, 13, 14, 15, 16]) {
          var s = engine.start(seed, postulat: p);
          for (var m = 0; m < 6; m++) {
            s = _jusquAuMatch(engine, s);
            if (s.over || s.pending!.kind != 'match') break;
            final sc = engine.samediDirect(s, false);
            if (sc == null) break;
            bool audace(DecisionPrevue d) => d.def.droite.v > d.def.gauche.v;
            final a = engine.choose(s, false, direct: _choix(sc, audace));
            final b = engine.choose(s, false, direct: _choix(sc, (d) => !audace(d)));
            if (a.direct.last.lettre == 'V') vAudace++;
            if (b.direct.last.lettre == 'V') vPrudence++;
            if (a.direct.last.lettre != b.direct.last.lettre) bascules++;
            n++;
            s = engine.choose(s, false);
          }
        }
      }
      expect(n, greaterThan(200));
      expect(vAudace, greaterThan(vPrudence), reason: 'audace $vAudace, prudence $vPrudence sur $n samedis');
      expect(bascules, greaterThan(0));
    });

    test('la somme d\'un match est bornée, et un geste aussi', () {
      DecisionPrevue prevue(int v, int n) => DecisionPrevue(
          def: DecisionDirect(id: 'x', roles: const [], situations: const ['nul'], moments: const ['fin'], texte: '',
              gauche: CoteDirect(label: 'a', v: v, n: n), droite: const CoteDirect(label: 'b')),
          minute: 80, pour: 0, contre: 0, situation: 'nul', texte: '', labels: const ['', ''], reponses: const ['', '']);
      const gauche = ChoixDirect('x', droite: false);
      final trois = poidsDirect([for (var i = 0; i < 3; i++) (prevue(6, -6), gauche)]);
      expect(trois.v, kDirectPlafondV);
      expect(trois.n, -kDirectPlafondN);
      final un = poidsDirect([(prevue(40, 0), gauche)]);
      expect(un.v, kDirectGesteMax);
      expect(poidsDirect([(prevue(6, 6), const ChoixDirect('x', droite: true))]).v, 0, reason: 'le côté droit ne pèse rien ici');
    });
  });

  group('(d) aucun tirage de plus', () {
    test('resolveBlock consomme les mêmes tirages, quelles que soient les décisions', () {
      final r = Rng(99);
      for (var i = 0; i < 3000; i++) {
        final seed = r.next();
        final gauges = {'vestiaire': 50, 'tribunes': 50, 'direction': 50, 'caisse': 50};
        final a = Rng(seed), b = Rng(seed);
        resolveBlock(a, 55, 1, gauges);
        resolveBlock(b, 55, 1, gauges, dernier: DernierMatch(r.range(-10, 10), r.range(-8, 8)));
        expect(b.state, a.state);
      }
    });

    test('dans le moteur : même lettre, mêmes effets nuls → même générateur, même empreinte', () {
      // le même contenu, sans effets cachés : seule la trace du samedi distingue les deux carrières
      final b2 = (jsonDecode(jsonEncode(bundle)) as Map).cast<String, dynamic>();
      for (final d in ((b2['ville'] as Map)['match_direct'] as List)) {
        ((d as Map)['gauche'] as Map).remove('effets');
        (d['droite'] as Map).remove('effets');
      }
      final e2 = Engine(Content.fromJson(b2));
      var compares = 0;
      for (var p = 0; p < content.postulatsByIndex.length; p++) {
        var s = e2.start(2026 + p, postulat: p);
        for (var m = 0; m < 6; m++) {
          s = _jusquAuMatch(e2, s);
          if (s.over || s.pending!.kind != 'match') break;
          final sc = e2.samediDirect(s, true);
          if (sc == null) break;
          final avec = e2.choose(s, true, direct: _choix(sc, (d) => !d.def.defautDroite));
          final sans = e2.choose(s, true);
          if (avec.direct.last.lettre == avec.direct.last.base) {
            expect(avec.rngState, sans.rngState);
            expect(avec.fingerprint(), sans.fingerprint());
            expect(avec.pending!.id, sans.pending!.id);
            compares++;
          }
          s = sans;
        }
      }
      expect(compares, greaterThan(20));
    });

    test('la trace est bornée à trente samedis', () {
      var s = engine.start(1, postulat: 0);
      var g = 0;
      while (!s.over && g++ < 600) {
        final p = s.pending!;
        if (p.kind == 'match') {
          final sc = engine.samediDirect(s, true);
          s = engine.choose(s, true, direct: sc == null ? null : _choix(sc, (d) => d.def.defautDroite));
        } else {
          s = engine.choose(s, p.single ? true : g.isEven);
        }
      }
      expect(s.direct.length, lessThanOrEqualTo(kDirectTraces));
      expect(s.direct, isNotEmpty);
    });
  });
}

String _momentDe(int minute) {
  for (final e in kMomentsDirect.entries) {
    if (minute >= e.value[0] && minute <= e.value[1]) return e.key;
  }
  return '';
}
