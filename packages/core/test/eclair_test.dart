/// LE FUSIBLE — le mode éclair (docs/histoires/mode_eclair.md).
///
/// Une carrière de dix minutes à côté des livres : un rôle et une époque tirés de la
/// graine, quatre jauges visibles et mortelles, pas de ville, un score en semaines tenues,
/// un défi du jour. Le mode est une propriété de la CARRIÈRE (`GameState.mode`, copiée du
/// postulat), et les livres n'en voient rien :
///
///   M · le mode : « histoire » par défaut et jamais écrit dans une sauvegarde ; « eclair »
///       s'écrit, se relit, et un mode inconnu retombe sur l'histoire ;
///   L · les livres ne bougent pas : les dix livres jouent, graine par graine, la même
///       carrière sur le contenu du jeu et sur le même contenu SANS ce que le mode ajoute
///       (ses postulats, ses cartes `ec.*`, ses fins) — et la page de partage, les sauvegardes
///       et les goldens (goldens_test.dart) en dépendent ;
///   P · les postulats éclair : cinq, un par rôle, cachés, ajoutés à la fin (l'index est le
///       Code de Carrière), du contenu commun seulement ; l'époque sort de la graine, pour eux
///       seuls ;
///   J · une jauge fait sauter le fusible : à 0 ou à 100, la carrière finit sur la fin que le
///       rôle déclare pour elle ; les mêmes jauges ne tuent rien en mode histoire ; la même
///       graine et les mêmes choix rejouent la même carrière, une sauvegarde reprend ;
///   S · le score : les semaines tenues ne reculent jamais ;
///   D · le défi du jour : la date fixe le rôle et la graine, les mêmes pour tout le monde
///       (la page en tient un miroir, preview_eclair.js `defiDe` : les valeurs épinglées ici
///       sont celles qu'elle doit rendre) ;
///   C · rien d'un livre : aucune carte, aucun événement, aucun rituel d'un livre ne sert dans
///       une carrière éclair ; le grand déballage n'a pas de scène ; aucune famine ;
///   T · la fin du fusible : une carrière qui tient dix saisons finit sur « Le fusible a tenu »,
///       à trois cent soixante semaines ;
///   B · le bandeau « une fin devient atteignable » parle en éclair et se tait en histoire ;
///   F · les portes des fins de longue carrière que le mode rouvre (en_dauphin, co_radiation) ;
///   V · la validation : build_content refuse un postulat éclair qui ouvre sur un livre ou sur
///       une époque hors du monde.
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

Map<String, dynamic> _bundle() =>
    (jsonDecode(File('${_racine().path}/content/build/content.json').readAsStringSync()) as Map).cast<String, dynamic>();

/// Le même contenu sans ce que le mode éclair y ajoute : ses postulats, ses cartes `ec.*`, ses fins.
Map<String, dynamic> _sansEclair(Map<String, dynamic> raw) {
  final r = (jsonDecode(jsonEncode(raw)) as Map).cast<String, dynamic>();
  (r['postulats'] as List).removeWhere((p) => (p as Map)['mode'] == 'eclair');
  (r['cards'] as List).removeWhere((c) => '${(c as Map)['id']}'.startsWith('ec.'));
  (r['endings'] as List).removeWhere((e) => '${(e as Map)['id']}'.startsWith('ec_tenu_'));
  return r;
}

// --- les politiques de simulate (mêmes erreurs, mêmes graines) -----------------------------------------

bool _hasard(GameState s, int step) => (s.rngState ^ step) & 1 == 0;

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

bool _humanLike(GameState s, int step) {
  final err = (((s.rngState >> 3) ^ mul32(step, 2654435761)) & 0x7FFFFFFF) % 100 < 18;
  final base = _balancer(s, step);
  return err ? !base : base;
}

/// Jamais une sortie qui pose une fin : la carrière ne s'arrête que par ce que le test regarde.
bool _sansFin(GameState s, int step) {
  final p = s.pending!;
  if (p.single) return true;
  final g = p.leftEffects.end != null, d = p.rightEffects.end != null;
  if (g && !d) return true;
  if (d && !g) return false;
  return _hasard(s, step);
}

int _graine(int i) => i * 2654435761 & 0x7FFFFFFF;

const _jauges = ['vestiaire', 'tribunes', 'direction', 'caisse'];

class _Carriere {
  final GameState fin;
  final List<String> cartes;

  /// La fin qu'une CARTE a posée (`end:` du côté choisi), s'il y en a une : une fin de jauge a aussi
  /// des portes dans le contenu (le message de 23 h 47 se pose par une carte, jauge à 3 ou non).
  final String? finParCarte;
  const _Carriere(this.fin, this.cartes, this.finParCarte);
}

_Carriere _jouer(Engine e, int seed, int postulat, bool Function(GameState, int) politique,
    {int max = 4000, void Function(GameState s, int step)? avant}) {
  var s = e.start(seed, postulat: postulat);
  final cartes = <String>[];
  String? finParCarte;
  var step = 0;
  while (!s.over && step < max) {
    cartes.add(s.pending!.id);
    avant?.call(s, step);
    final p = s.pending!;
    final droite = p.single ? true : politique(s, step);
    finParCarte = (droite ? p.rightEffects : p.leftEffects).end;
    s = e.choose(s, droite);
    step++;
  }
  return _Carriere(s, cartes, finParCarte);
}

/// L'état sans ce qui change d'un contenu à l'autre (l'empreinte du contenu).
String _etat(GameState s) {
  final j = s.toJson()
    ..remove('contentHash')
    ..remove('contentVersion');
  return jsonEncode(j);
}

/// Une carte liée à un livre par son `when` (un drapeau d'histoire lu en positif) : la garde « pas le
/// livre 4 » (`!flag('histoire_h4')`, une carte commune) n'en est pas une.
bool _lieAUnLivre(Card c) {
  final enc = jsonEncode(c.when).replaceAll(RegExp(r'\["not",\["call","flag",\[\["lit","histoire_h\d+"\]\]\]\]'), '');
  return enc.contains('histoire_h');
}

void main() {
  final raw = _bundle();
  final content = loadContentFromJson(jsonEncode(raw));
  final engine = Engine(content);
  final eclair = postulatsEclair(content);

  group('M · le mode de la carrière', () {
    test('histoire par défaut, jamais écrit dans une sauvegarde', () {
      final s = engine.start(5, postulat: 0);
      expect(s.mode, kModeHistoire);
      expect(s.toJson().containsKey('mode'), isFalse);
      var t = s;
      for (var i = 0; i < 40 && !t.over; i++) {
        t = engine.choose(t, _humanLike(t, i));
        expect(t.toJson().containsKey('mode'), isFalse, reason: 'la sauvegarde d\'un livre n\'a pas à changer d\'un octet (pas de « mode »)');
      }
    });

    test('éclair : écrit, relu à l\'identique ; un mode inconnu retombe sur l\'histoire', () {
      final s = engine.start(5, postulat: eclair.first.index);
      expect(s.mode, kModeEclair);
      expect(s.toJson()['mode'], 'eclair');
      final j = jsonDecode(jsonEncode(s.toJson())) as Map<String, dynamic>;
      expect(GameState.fromJson(j).mode, kModeEclair);
      expect(jsonEncode(GameState.fromJson(j).toJson()), jsonEncode(s.toJson()));
      expect(GameState.fromJson({...j, 'mode': 'inconnu'}).mode, kModeHistoire);
    });

    test('jaugesMortelles : le réglage du contenu OU le mode éclair', () {
      expect(content.director.jaugesFatales, isFalse, reason: 'le contenu du jeu est en mode histoire');
      expect(jaugesMortelles(content, engine.start(5, postulat: 0)), isFalse);
      expect(jaugesMortelles(content, engine.start(5, postulat: eclair.first.index)), isTrue);
    });
  });

  group('L · les livres ne bougent pas', () {
    final nu = loadContentFromJson(jsonEncode(_sansEclair(raw)));
    final engineNu = Engine(nu);
    final livres = [for (final p in content.postulatsByIndex) if (p.mode != kModeEclair) p.index];

    test('les dix livres, deux graines chacun : la même carrière avec et sans le mode éclair', () {
      expect(livres.length, greaterThanOrEqualTo(10));
      for (final i in livres) {
        for (final seed in [3, 77]) {
          final a = _jouer(engine, seed, i, _humanLike, max: 150);
          final b = _jouer(engineNu, seed, i, _humanLike, max: 150);
          expect(a.cartes, b.cartes, reason: 'postulat $i, graine $seed : les cartes servies ne sont plus les mêmes');
          expect(_etat(a.fin), _etat(b.fin), reason: 'postulat $i, graine $seed : l\'état final a bougé');
        }
      }
    });
  });

  group('P · les postulats éclair', () {
    test('cinq, un par rôle, ajoutés à la fin, cachés', () {
      expect(eclair.map((p) => p.role).toSet(), {'entraineur', 'joueur', 'president', 'ds', 'selectionneur'});
      expect(eclair.length, 5);
      final tous = content.postulatsByIndex;
      expect(tous.skip(tous.length - 5).map((p) => p.index), eclair.map((p) => p.index), reason: 'ajoutés à la fin : l\'index est celui du Code de Carrière');
      for (final p in eclair) {
        expect(p.chantier, isTrue, reason: '${p.id} : aucune liste de livres ne le montre (build_content le range en chantier)');
        expect(p.flags, contains('eclair'));
        expect(p.prologueArc, isNull);
        expect(p.openingArc, isNull);
        expect(p.annees, isNotNull);
        expect(p.saisons, 10);
        expect(content.endings[p.finDeLivre], isNotNull, reason: '${p.id} : sa fin « Le fusible a tenu » existe');
        expect(p.finDeLivre, startsWith('ec_tenu_'));
        for (final g in _jauges) {
          expect(p.gauges[g], inInclusiveRange(10, 90), reason: '${p.id} : une jauge de départ ne tue pas');
        }
        final prog = p.programme;
        if (prog != null) {
          for (final b in prog.buckets.values) {
            for (final e in b.pool) {
              expect(carteDeLivre(e.arc), isFalse, reason: '${p.id} : « ${e.arc} » est un arc de livre');
            }
          }
        }
      }
    });

    test('l\'époque sort de la graine, dans `annees` : stable, large, sans toucher au flux d\'un livre', () {
      for (final p in eclair) {
        final lo = p.annees!.first, hi = p.annees!.last;
        final vues = <int>{};
        for (var i = 1; i <= 160; i++) {
          final a = engine.start(_graine(i), postulat: p.index);
          expect(a.year, inInclusiveRange(lo, hi), reason: '${p.id}, graine ${_graine(i)}');
          expect(engine.start(_graine(i), postulat: p.index).year, a.year, reason: 'la même graine, la même époque');
          vues.add(a.year);
        }
        expect(vues.length, greaterThanOrEqualTo(((hi - lo + 1) * 0.55).floor()), reason: '${p.id} : l\'époque couvre l\'intervalle');
      }
      for (final p in content.postulatsByIndex.where((p) => p.mode != kModeEclair)) {
        expect(engine.start(11, postulat: p.index).year, p.year, reason: '${p.id} : un livre garde son année de départ');
      }
    });
  });

  group('J · une jauge fait sauter le fusible', () {
    test('chaque rôle, 40 graines au hasard : la carrière finit, et une jauge à 0 ou 100 pose sa fin', () {
      var parJauge = 0, total = 0;
      for (final p in eclair) {
        final role = content.roles[p.role]!;
        for (var i = 0; i < 40; i++) {
          final c = _jouer(engine, _graine(i), p.index, _hasard);
          total++;
          final s = c.fin;
          expect(s.over, isTrue, reason: '${p.id}, graine ${_graine(i)} : une carrière éclair finit');
          for (final g in role.gauges) {
            final vide = g.emptyEnding == s.endingId, plein = g.fullEnding == s.endingId;
            if (!vide && !plein) continue;
            parJauge++;
            final v = s.gauges[g.id]!;
            // la jauge au bord, ou une carte qui pose cette fin (un choix qu'on lit : « Le message de 23 h 47 »)
            final auBord = vide ? v <= 0 : v >= 100;
            expect(auBord || c.finParCarte == s.endingId, isTrue,
                reason: '${p.id} : la fin ${s.endingId} dit « ${g.id} ${vide ? 'à zéro' : 'au plafond'} », la jauge est à $v et aucune carte ne l\'a posée');
          }
        }
      }
      expect(parJauge / total, greaterThan(0.7), reason: 'à pile ou face, la grande majorité des carrières éclair finit par une jauge');
    });

    test('les mêmes jauges, en mode histoire : rien ne s\'arrête', () {
      var s = engine.start(5, postulat: 0);
      s.gauges['vestiaire'] = 0;
      s.gauges['tribunes'] = 100;
      s = engine.choose(s, true);
      final role = content.roles[s.role]!;
      expect(role.gauges.map((g) => g.emptyEnding), isNot(contains(s.endingId)));
      expect(role.gauges.map((g) => g.fullEnding), isNot(contains(s.endingId)));
    });

    test('la même graine, les mêmes choix : la même carrière — et une sauvegarde reprend', () {
      for (final p in eclair) {
        final a = _jouer(engine, 4242, p.index, _humanLike, max: 90);
        final b = _jouer(engine, 4242, p.index, _humanLike, max: 90);
        expect(a.cartes, b.cartes, reason: '${p.id} : même graine, mêmes cartes');
        expect(_etat(a.fin), _etat(b.fin));
        expect(_jouer(engine, 4243, p.index, _humanLike, max: 90).cartes, isNot(a.cartes), reason: '${p.id} : une autre graine, une autre carrière');
        // une sauvegarde au milieu, reprise et poursuivie, rejoint l'original
        var s = engine.start(4242, postulat: p.index);
        for (var i = 0; i < 45 && !s.over; i++) {
          s = engine.choose(s, _humanLike(s, i));
        }
        var reprise = GameState.fromJson((jsonDecode(jsonEncode(s.toJson())) as Map).cast<String, dynamic>());
        expect(reprise.mode, kModeEclair, reason: 'une sauvegarde reprend dans le mode où elle a été jouée');
        for (var i = 45; i < 90 && !s.over; i++) {
          s = engine.choose(s, _humanLike(s, i));
          reprise = engine.choose(reprise, _humanLike(reprise, i));
        }
        expect(_etat(reprise), _etat(s), reason: '${p.id} : la reprise ne rejoint pas l\'original');
      }
    });
  });

  group('S · le score', () {
    test('les semaines tenues ne reculent jamais, et valent trente-six par saison jouée', () {
      for (final p in eclair) {
        var s = engine.start(_graine(9), postulat: p.index);
        var dernier = semainesTenues(s);
        expect(dernier, 0);
        for (var i = 0; i < 160 && !s.over; i++) {
          s = engine.choose(s, _humanLike(s, i));
          final w = semainesTenues(s);
          expect(w, greaterThanOrEqualTo(dernier), reason: '${p.id}, carte $i : le score recule ($dernier → $w)');
          expect(w, s.season * kSeasonGames + journeeDeSaison(s.world.blocks));
          dernier = w;
        }
        expect(dernier, greaterThan(30), reason: '${p.id} : en 160 cartes, plus d\'une saison tenue');
      }
    });
  });

  group('D · le défi du jour', () {
    test('la date fixe le rôle et la graine ; deux appels rendent la même chose', () {
      final a = defiDuJour(content, '2026-10-15')!;
      final b = defiDuJour(content, ' 2026-10-15 ')!;
      expect(a.toJson(), b.toJson());
      expect(eclair.map((p) => p.index), contains(a.postulat));
      expect(content.postulatsByIndex[a.postulat].role, a.role);
      expect(a.seed, inInclusiveRange(0, 0x7FFFFFFF));
      expect(defiDuJour(content, '2026-10-16')!.seed, isNot(a.seed));
    });

    test('les valeurs que le miroir de la page (preview_eclair.js `defiDe`) doit rendre', () {
      // à refaire avec la page si le hachage, le sel ou le nombre de postulats éclair change
      const attendu = {
        '2026-10-15': ('entraineur', 1924176856),
        '2026-10-16': ('joueur', 1974509713),
        '2026-10-17': ('president', 1957732094),
        '2026-10-19': ('ds', 1857066380),
        '2026-10-20': ('selectionneur', 1705626524),
      };
      attendu.forEach((date, v) {
        final d = defiDuJour(content, date)!;
        expect((d.role, d.seed), v, reason: '$date : le défi du jour a changé — le miroir de la page doit suivre');
      });
    });

    test('sur une année, les cinq rôles reviennent, à peu près à égalité', () {
      final n = <String, int>{};
      final base = DateTime.utc(2026, 1, 1);
      for (var j = 0; j < 365; j++) {
        final d = base.add(Duration(days: j));
        final date = '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';
        final r = defiDuJour(content, date)!.role;
        n[r] = (n[r] ?? 0) + 1;
      }
      expect(n.keys.toSet(), {'entraineur', 'joueur', 'president', 'ds', 'selectionneur'});
      for (final v in n.values) {
        expect(v, greaterThan(40));
      }
    });

    test('un contenu sans postulat éclair n\'a pas de défi', () {
      expect(defiDuJour(loadContentFromJson(jsonEncode(_sansEclair(raw))), '2026-10-15'), isNull);
    });
  });

  group('C · rien d\'un livre', () {
    test('aucune carte d\'un livre, aucune famine : 5 rôles × 14 graines', () {
      var famine = 0;
      for (final p in eclair) {
        for (var i = 0; i < 14; i++) {
          var s = engine.start(_graine(i), postulat: p.index);
          for (var step = 0; step < 150 && !s.over; step++) {
            final id = s.pending!.id;
            final card = content.cards[id];
            expect(carteDeLivre(id), isFalse, reason: '${p.id}, graine ${_graine(i)} : la carte $id est d\'un livre');
            if (card != null) {
              expect(_lieAUnLivre(card), isFalse, reason: '${p.id}, graine ${_graine(i)} : la carte $id lit un drapeau de livre');
              expect(card.roles, contains(s.role), reason: '$id servie hors de son rôle');
            }
            s = engine.choose(s, i.isEven ? _humanLike(s, step) : _hasard(s, step));
          }
          famine += s.stats['famine'] ?? 0;
        }
      }
      expect(famine, 0, reason: 'un rôle sans assez de cartes sert des bouche-trous : les cartes du mode (content/cards/*/eclair.yaml) doivent suffire');
    });

    test('une carte de livre oubliée sans drapeau ne sert pas non plus (la réaction du livre 1)', () {
      expect(carteDeLivre('en.h1.re.gege_berline'), isTrue);
      expect(carteDeLivre('sl.h7.t1_minuit'), isTrue);
      expect(carteDeLivre('co.destin.porte_de_sortie'), isFalse);
      expect(carteDeLivre('ec.pr.fonds_capital'), isFalse);
      expect(carteDeLivre('co.deballage.h1'), isFalse, reason: 'la variante d\'un livre se choisit DANS l\'arc, qui n\'arme pas en éclair');
    });

    test('le grand déballage n\'a pas de scène : la parole à −5 ne tue pas, n\'arme rien', () {
      for (final p in eclair) {
        var s = engine.start(_graine(3), postulat: p.index);
        s.parole = -5;
        for (var i = 0; i < 40 && !s.over; i++) {
          s = engine.choose(s, _sansFin(s, i));
          s.parole = -5;
          expect(s.endingId, isNot('grand_deballage'), reason: '${p.id}, carte $i');
          expect(s.arcs.containsKey('co.deballage'), isFalse, reason: '${p.id}, carte $i : les douze pages n\'arment pas en éclair');
        }
      }
      // en mode histoire, au contraire, elle arme la scène
      var h = engine.start(_graine(3), postulat: 0);
      h.parole = -5;
      h = engine.choose(h, true);
      expect(h.arcs.containsKey('co.deballage') || h.endingId == 'grand_deballage', isTrue);
    });
  });

  group('T · le fusible a tenu', () {
    test('dix saisons sans qu\'une jauge saute : la fin du rôle, à trois cent soixante semaines', () {
      for (final p in eclair) {
        final plafond = p.role == 'joueur' ? 27 : 45; // l'âge n'est pas la fin que ce test cherche (jubilé, retraite)
        var fait = false;
        for (var i = 0; i < 30 && !fait; i++) {
          var s = engine.start(_graine(i), postulat: p.index);
          if (s.age > plafond) continue;
          var step = 0;
          while (!s.over && step < 3000) {
            for (final g in _jauges) {
              s.gauges[g] = 50; // l'immortel : aucune jauge ne touche le bord
            }
            s = engine.choose(s, _sansFin(s, step));
            step++;
          }
          if (s.endingId != p.finDeLivre) continue; // une fin d'un autre ordre (un verdict sans issue) : une autre graine
          fait = true;
          expect(semainesTenues(s), 360, reason: '${p.id} : dix saisons de trente-six semaines');
          expect(content.endings[s.endingId]!.title, 'Le fusible a tenu');
        }
        expect(fait, isTrue, reason: '${p.id} : aucune des 30 graines n\'a tenu dix saisons — la fin du livre n\'arrive plus');
      }
    });
  });

  group('B · le bandeau « une fin devient atteignable »', () {
    test('il parle en éclair et se tait en histoire', () {
      Map<String, dynamic>? annonce(int postulat) {
        var s = engine.start(_graine(1), postulat: postulat);
        // une carte de routine servie, une jauge entrée dans la zone de danger
        for (var i = 0; i < 12 && !s.over; i++) {
          s = engine.choose(s, _humanLike(s, i));
        }
        s.gauges['vestiaire'] = 10;
        s.annonces.clear();
        s.pending = Pending(
          id: 'essai',
          kind: 'narrative',
          speaker: null,
          text: 'Une carte.',
          leftLabel: 'Oui',
          rightLabel: 'Non',
          leftEffects: const EffectSet(),
          rightEffects: const EffectSet(),
          previewLeft: const [],
          previewRight: const [],
          payload: const {},
        );
        poserAnnonce(content, s, carteFraiche: true);
        return s.pending!.payload['annonce'] as Map<String, dynamic>?;
      }

      expect(annonce(eclair.first.index)?['type'], 'fin', reason: 'en éclair, une jauge à 10 annonce sa fin');
      expect(annonce(0)?['type'], isNot('fin'), reason: 'en histoire, une jauge au bord ne mène à aucune fin');
    });
  });

  group('F · les portes des fins de longue carrière', () {
    // Ces fins ne se posent qu'au bout d'une longue carrière ; la clôture des livres (une carrière de
    // livre s'arrête avant) les laissait sans porte. Le mode éclair, qui joue jusqu'à dix saisons, en
    // rouvre deux que ses rôles n'atteignaient pas (docs/histoires/mode_eclair.md § les fins de longue
    // carrière) : les autres, il les atteint par les intrigues communes que ses programmes tirent.
    test('en_dauphin : novembre se lit autrement quand le drapeau éclair est levé — et jamais dans un livre', () {
      final novembre = content.arcs['en.adjoint_dine']!.steps.firstWhere((st) => st.id == 'novembre');
      expect(novembre.card.map((v) => v.id).toList(), ['en.adjoint.novembre_banc', 'en.adjoint.novembre']);
      expect(novembre.card.first.ifWhen, isNotNull, reason: 'la variante n\'est lue que sous le drapeau `eclair`');
      expect(jsonEncode(novembre.card.first.ifWhen), contains('eclair'));
      expect(novembre.card.last.ifWhen, isNull, reason: 'la carte de toujours reste le repli : les livres ne voient rien');
      expect(content.cards['en.adjoint.novembre_banc']!.left.effects.end, 'en_dauphin');
      expect(content.cards['en.adjoint.novembre_banc']!.right.effects.end, isNull, reason: 'rester numéro deux ne ferme rien');
      expect(content.cards['en.adjoint.novembre']!.left.effects.end, isNull, reason: 'la scène des livres ne pose pas la fin');
      expect(content.endings.containsKey('en_dauphin'), isTrue);
    });

    test('co_radiation : la commission arme chez le joueur éclair (qui tire le tripot)', () {
      expect(content.arcs['co.sp.commission']!.postulats, contains('eclair_joueur'));
      final joueur = eclair.firstWhere((p) => p.role == 'joueur');
      final pool = [for (final b in joueur.programme!.buckets.values) ...b.pool.map((x) => x.arc)];
      expect(pool, contains('jp.sp.tripot'), reason: 'la commission lit `sp_tripot_service`, que ce sponsor pose');
      expect(content.endings.containsKey('co_radiation'), isTrue);
    });
  });

  group('V · la validation du contenu', () {
    Future<void> copier(Directory de, Directory vers) async {
      vers.createSync(recursive: true);
      for (final x in de.listSync()) {
        final nom = x.path.split('/').last;
        if (x is Directory) {
          if (nom == 'build') continue;
          await copier(x, Directory('${vers.path}/$nom'));
        } else if (x is File) {
          x.copySync('${vers.path}/$nom');
        }
      }
    }

    Future<ProcessResult> construire(String Function(String) modifier) async {
      final racine = _racine().path;
      final tmp = Directory('${Directory.systemTemp.path}/fusible_eclair_${DateTime.now().microsecondsSinceEpoch}')..createSync(recursive: true);
      try {
        await copier(Directory('$racine/content'), Directory('${tmp.path}/content'));
        final f = File('${tmp.path}/content/postulats.yaml');
        f.writeAsStringSync(modifier(f.readAsStringSync()));
        return await Process.run(Platform.resolvedExecutable, ['$racine/packages/tools/bin/build_content.dart'], workingDirectory: tmp.path);
      } finally {
        tmp.deleteSync(recursive: true);
      }
    }

    test('V1 · build_content refuse un postulat éclair qui ouvre sur un livre ou une époque hors du monde', () async {
      final prologue = await construire((t) => t.replaceFirst('  - id: eclair_ds\n', '  - id: eclair_ds\n    prologue: ds.h6.prologue\n'));
      expect(prologue.exitCode, isNot(0));
      expect('${prologue.stdout}${prologue.stderr}', contains('un postulat éclair n\'a ni prologue ni script d\'ouverture'));
      final epoque = await construire((t) => t.replaceFirst('annees: [1999, 2044]', 'annees: [1999, 2099]'));
      expect(epoque.exitCode, isNot(0));
      expect('${epoque.stdout}${epoque.stderr}', contains('hors de 1990..2050'));
    }, timeout: const Timeout(Duration(minutes: 4)));

    test('V2 · build_content refuse `annees` et un mode inconnu chez un livre', () async {
      final livre = await construire((t) => t.replaceFirst('  - id: promu\n', '  - id: promu\n    annees: [1990, 2000]\n'));
      expect(livre.exitCode, isNot(0));
      expect('${livre.stdout}${livre.stderr}', contains('`annees` n\'existe que pour un postulat éclair'));
      final mode = await construire((t) => t.replaceFirst('  - id: eclair_ds\n    index: 13\n    role: ds\n    mode: eclair', '  - id: eclair_ds\n    index: 13\n    role: ds\n    mode: rapide'));
      expect(mode.exitCode, isNot(0));
      expect('${mode.stdout}${mode.stderr}', contains('mode « rapide » inconnu'));
    }, timeout: const Timeout(Duration(minutes: 4)));
  });
}
