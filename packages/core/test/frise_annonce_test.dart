/// F · la frise de carrière, A · le bandeau « nouvelles cartes », J · la
/// journée de championnat, C9 · le classement après une signature en janvier.
///
/// Les quatre manques que la référence (*Reigns*) rendait criants :
///
/// · une frise qui montre où l'on en est dans le siècle — la carrière posée
///   sur une ligne, les années, un pictogramme par événement traversé, les
///   carrières précédentes en arrière-plan (`frise.dart`) ;
/// · un bandeau qui traverse la carte quand du contenu se débloque
///   (`annonce.dart`) ;
/// · un « J » qui dise la vraie journée de championnat, la même dans l'aperçu
///   et dans l'application (`journeeDeSaison`) ;
/// · une table de fin de saison qui couvre la saison entière du club, même
///   quand on a signé ailleurs en cours d'exercice (`buildStandings`).
library;

import 'dart:convert';
import 'dart:io';

import 'package:fusible_core/fusible_core.dart';
import 'package:test/test.dart';

Content _real() {
  var dir = Directory.current;
  for (var i = 0; i < 6; i++) {
    final f = File('${dir.path}/content/build/content.json');
    if (f.existsSync()) return loadContentFromJson(f.readAsStringSync());
    final parent = dir.parent;
    if (parent.path == dir.path) break;
    dir = parent;
  }
  throw StateError('content/build/content.json introuvable — lance d\'abord build_content');
}

/// Une carrière jouée jusqu'au bout, avec un observateur appelé sur chaque
/// carte servie (avant le swipe).
GameState _joue(Engine e, int seed, int postulat, void Function(GameState s, int g) voir, {int max = 400}) {
  var s = e.start(seed, postulat: postulat);
  var g = 0;
  while (!s.over && g < max) {
    voir(s, g);
    s = e.choose(s, s.pending!.single ? true : g % 3 == 0);
    g++;
  }
  voir(s, g);
  return s;
}

void main() {
  final content = _real();
  final engine = Engine(content);

  // -------------------------------------------------------------------------
  group('F · la frise de carrière', () {
    test('F1 · la frise dit les saisons, les jalons et les carrières d\'avant', () {
      const avant = [
        FriseCarriere(nom: 'Ancien Nom', debut: 1990, fin: 1996, finId: 'en_sms'),
      ];
      const typesJalon = {'nouvelle', 'club', 'role', 'intrigue'};
      var saisonsVerifiees = 0;
      var jalonsVus = 0;
      for (final postulat in [0, 1, 2, 3]) {
        for (final seed in [3, 909, 12345, 4242, 31337]) {
          final s = _joue(engine, seed, postulat, (_, __) {});
          final f = engine.friseOf(s, carrieres: avant);

          // Une ligne par saison jouée, la saison en cours comprise.
          expect(f.saisons.length, s.season + 1, reason: 'graine $seed : une ligne par saison');
          expect(f.annee, s.year);
          // Les bornes couvrent tout ce que le profil a vécu.
          expect(f.debut, lessThanOrEqualTo(f.annee));
          expect(f.fin, greaterThanOrEqualTo(f.annee));
          expect(f.debut, lessThanOrEqualTo(1990), reason: 'la carrière précédente entre dans les bornes');
          expect(f.carrieres.single.nom, 'Ancien Nom');

          for (var i = 0; i < f.saisons.length; i++) {
            final ligne = f.saisons[i];
            expect(ligne.saison, i + 1);
            expect(ligne.annee, greaterThanOrEqualTo(f.debut));
            expect(ligne.annee, lessThanOrEqualTo(f.fin));
            if (i < s.season) {
              // Une saison CLOSE porte son verdict : le club, la division, le
              // rang, l'objectif et s'il a été tenu — relus de l'Almanach.
              expect(ligne.club, isNotEmpty, reason: 'graine $seed saison $i : le club');
              expect(ligne.division, inInclusiveRange(1, 2));
              expect(ligne.rang, inInclusiveRange(1, 18), reason: 'graine $seed saison $i : le rang');
              expect(ligne.objectif, isNotEmpty);
              expect(ligne.tenu, isNotNull);
              saisonsVerifiees += 1;
            }
          }

          // Les jalons : datés, typés, dans l'ordre du siècle.
          var precedent = 0;
          for (final j in f.jalons) {
            expect(typesJalon, contains(j.type));
            expect(j.label, isNotEmpty);
            expect(j.annee, greaterThanOrEqualTo(precedent), reason: 'les jalons sont triés par année');
            precedent = j.annee;
          }
          jalonsVus += f.jalons.length;

          // Pure : deux lectures du même état donnent le même objet.
          expect(jsonEncode(engine.friseOf(s, carrieres: avant).toJson()),
              jsonEncode(engine.friseOf(s, carrieres: avant).toJson()));
        }
      }
      expect(saisonsVerifiees, greaterThan(0), reason: 'aucune saison close : le test ne prouve rien');
      expect(jalonsVus, greaterThan(0), reason: 'aucun jalon posé : le test ne prouve rien');
    });

    test('F2 · la frise ne coûte rien : l\'ouvrir ne déplace pas la partie', () {
      var s = engine.start(909, postulat: 0);
      for (var i = 0; i < 40 && !s.over; i++) {
        s = engine.choose(s, i.isEven);
      }
      final avant = s.fingerprint();
      final json1 = jsonEncode(s.toJson());
      engine.friseOf(s);
      engine.friseSImpose(s);
      engine.friseOf(s, carrieres: const [FriseCarriere(nom: 'X', debut: 1990, fin: 1991)]);
      expect(s.fingerprint(), avant);
      expect(jsonEncode(s.toJson()), json1);
    });

    test('F3 · elle s\'impose d\'elle-même : décennie, changement de club ou de rôle, fin', () {
      var finsVues = 0;
      var transitionsVues = 0;
      var decenniesVues = 0;
      var ordinaires = 0;
      for (final postulat in [0, 1, 2, 3]) {
        for (final seed in [3, 7, 909, 12345, 4242, 31337, 5150, 8080, 226010632]) {
          var club = '';
          var role = '';
          var annee = 0;
          _joue(engine, seed, postulat, (s, g) {
            final auto = engine.friseSImpose(s);
            if (s.over) {
              expect(auto, isTrue, reason: 'graine $seed : la frise s\'impose à la fin d\'une carrière');
              finsVues += 1;
              return;
            }
            final changement = (club.isNotEmpty && s.entities.named['club'] != club) || (role.isNotEmpty && s.role != role);
            final decennie = annee != 0 && s.year != annee && s.year % 10 == 0;
            club = s.entities.named['club'] ?? '';
            role = s.role;
            annee = s.year;
            if (changement) {
              expect(auto, isTrue,
                  reason: 'graine $seed (postulat $postulat) : la frise s\'impose après un changement de club ou de rôle');
              transitionsVues += 1;
            } else if (auto && s.pending!.kind == 'objective' && decennie) {
              decenniesVues += 1;
            } else if (!auto) {
              ordinaires += 1;
            }
          });
        }
      }
      expect(finsVues, greaterThan(0));
      expect(transitionsVues, greaterThan(0), reason: 'aucun changement de club ou de rôle : le test ne prouve rien');
      expect(ordinaires, greaterThan(100), reason: 'la frise ne doit PAS s\'imposer sur une carte ordinaire');
      // La décennie : elle ne se croise que sur une carrière longue ; on la
      // vérifie à la source plutôt que d'exiger qu'une graine y arrive.
      var s = engine.start(909, postulat: 0);
      while (!s.over && s.pending!.kind != 'objective') {
        s = engine.choose(s, true);
      }
      expect(s.over, isFalse);
      final annee2000 = s.clone()
        ..season = 10
        ..year = 2000;
      expect(friseAuto(annee2000), isTrue, reason: 'une saison qui ouvre une décennie impose la frise');
      final annee2001 = s.clone()
        ..season = 11
        ..year = 2001
        ..journal.clear();
      expect(friseAuto(annee2001), isFalse, reason: 'une saison ordinaire ne l\'impose pas');
      expect(decenniesVues, greaterThanOrEqualTo(0));
    });
  });

  // -------------------------------------------------------------------------
  group('A · le bandeau « nouvelles cartes »', () {
    test('A1 · posé une fois, jamais deux cartes de suite, deux par saison au plus', () {
      const types = {'intrigue', 'personnage', 'fin', 'legende'};
      final vus = <String>{};
      var total = 0;
      for (final postulat in [0, 1, 2, 3]) {
        for (final seed in [3, 7, 909, 12345, 4242, 31337, 5150, 8080]) {
          final cles = <String>{};
          final parSaison = <int, int>{};
          var precedenteAvait = false;
          _joue(engine, seed, postulat, (s, _) {
            final a = s.pending?.payload['annonce'];
            if (a == null) {
              precedenteAvait = false;
              return;
            }
            final m = (a as Map).cast<String, dynamic>();
            expect(types, contains(m['type']), reason: 'type d\'annonce inconnu : ${m['type']}');
            expect(m['titre'] as String, isNotEmpty);
            expect(m['sous_titre'] as String, isNotEmpty);
            final cle = m['cle'] as String;
            expect(cles.add(cle), isTrue, reason: 'graine $seed : « $cle » annoncé deux fois');
            expect(precedenteAvait, isFalse, reason: 'graine $seed : deux bandeaux sur deux cartes de suite');
            parSaison[s.season] = (parSaison[s.season] ?? 0) + 1;
            expect(parSaison[s.season], lessThanOrEqualTo(2),
                reason: 'graine $seed : plus de deux bandeaux dans la saison ${s.season}');
            precedenteAvait = true;
            vus.add(m['type'] as String);
            total += 1;
          });
        }
      }
      expect(total, greaterThan(20), reason: 'le bandeau ne sort jamais : le test ne prouve rien');
      // Les trois sources que le contenu actuel sait produire.
      expect(vus, containsAll(<String>['personnage', 'fin', 'intrigue']));
    });

    test('A2 · le bandeau ne coûte ni tirage ni jauge : il annonce, il n\'agit pas', () {
      // Deux exécutions identiques de la même graine : le bandeau se pose aux
      // mêmes cartes et l'empreinte ne bouge pas d'un iota.
      final a = <String>[], b = <String>[];
      final fa = <String>[], fb = <String>[];
      for (final out in [
        [a, fa],
        [b, fb]
      ]) {
        _joue(engine, 12345, 0, (s, _) {
          (out[1]).add(s.fingerprint());
          final an = s.pending?.payload['annonce'];
          if (an != null) (out[0]).add('${s.turn}:${(an as Map)['cle']}');
        });
      }
      expect(a, b);
      expect(fa, fb);
      expect(a, isNotEmpty);
      // L'empreinte ne connaît pas le bandeau : le registre est hors graine.
      final s = engine.start(12345, postulat: 0);
      final sansBandeau = s.clone()..annonces.clear();
      expect(sansBandeau.fingerprint(), s.fingerprint());
    });
  });

  // -------------------------------------------------------------------------
  group('J · la journée de championnat', () {
    test('J1 · une seule définition : le monde simulé, et elle vaut partout', () {
      var finales = 0;
      var journeesVues = 0;
      for (final postulat in [0, 1, 2, 3]) {
        for (final seed in [3, 909, 12345, 4242, 31337]) {
          _joue(engine, seed, postulat, (s, _) {
            final attendu = journeeDeSaison(s.world.blocks);
            // La journée ne dépasse jamais la saison, et suit les blocs.
            expect(attendu, inInclusiveRange(0, kSeasonGames));
            expect(attendu, s.world.blocks * kGamesPerBlock);
            // Le texte des cartes ({journee}) dit le même nombre.
            expect(formatText('{journee}', s), '$attendu');
            journeesVues += 1;
            final p = s.pending;
            if (p == null || p.kind != 'classement') return;
            // La carte Classement aussi.
            expect(p.payload['journee'], attendu, reason: 'graine $seed : la carte Classement');
            expect(p.payload['journees'], kSeasonGames);
            if (p.payload['finale'] == true) {
              // Le classement du Bilan clôt les trente-six journées, qu'on ait
              // changé de club en cours de route ou non.
              expect(attendu, kSeasonGames, reason: 'graine $seed : le Bilan clôt la saison entière');
              finales += 1;
            }
          });
        }
      }
      expect(journeesVues, greaterThan(100));
      expect(finales, greaterThan(0), reason: 'aucun Bilan atteint : le test ne prouve rien');
    });
  });

  // -------------------------------------------------------------------------
  group('C · le classement', () {
    test('C9 · après une signature en cours de saison, la table couvre la saison entière', () {
      // Le défaut : les points repartent de zéro quand on signe ailleurs, mais
      // le calendrier, lui, continue. La colonne entière était alors construite
      // autour d'un total de demi-saison, et la division rétrécissait — un
      // champion à 83 points là où il en prend 100 une saison ordinaire.
      var tablesApresSignature = 0;
      for (final postulat in [0, 1, 2, 3]) {
        for (final seed in List<int>.generate(60, (i) => i + 1)) {
          _joue(engine, seed, postulat, (s, _) {
            final p = s.pending;
            if (p == null || p.kind != 'classement' || p.payload['finale'] != true) return;
            if (s.world.blocksDepart <= 0) return;
            final table = engine.standingsOf(s);
            final moi = table.singleWhere((r) => r.toi);
            // Ta ligne reste EXACTEMENT ce que le moteur compte (la Une, le
            // Verdict et le contrat lisent le même nombre).
            expect(moi.pts, s.world.pts);
            expect(moi.rang, s.world.standingRank);
            // La division, elle, a joué sa saison entière : le champion prend
            // un total de champion, pas un total de demi-saison.
            expect(table.first.pts, greaterThanOrEqualTo(70),
                reason: 'graine $seed : le champion à ${table.first.pts} points sur $kSeasonGames journées');
            // Et la colonne décroît toujours de haut en bas.
            for (var i = 1; i < table.length; i++) {
              expect(table[i].pts, lessThanOrEqualTo(table[i - 1].pts));
            }
            tablesApresSignature += 1;
          });
        }
      }
      expect(tablesApresSignature, greaterThan(0),
          reason: 'aucune saison avec changement de club ou de rôle en cours de route : le test ne prouve rien');
    });

    test('C10 · sans signature en cours de saison, la table est inchangée au point près', () {
      // Le garde-fou du correctif : `blocksClub` ne touche à RIEN quand la
      // saison entière a été jouée sous les mêmes couleurs.
      final s = engine.start(909, postulat: 0);
      final avec = buildStandings(
        seed: s.seed,
        postulatId: s.postulatId,
        season: 1,
        division: 1,
        blocks: 6,
        rank: 12,
        pts: 44,
        monClub: 'US Test',
        rivalClub: 'AS Rival',
        prefixes: const ['US', 'AS', 'FC'],
        villes: const ['Vaubelle', 'Portclair', 'Nerville', 'Castérac'],
        blocksClub: 6,
      );
      final sans = buildStandings(
        seed: s.seed,
        postulatId: s.postulatId,
        season: 1,
        division: 1,
        blocks: 6,
        rank: 12,
        pts: 44,
        monClub: 'US Test',
        rivalClub: 'AS Rival',
        prefixes: const ['US', 'AS', 'FC'],
        villes: const ['Vaubelle', 'Portclair', 'Nerville', 'Castérac'],
      );
      expect(jsonEncode([for (final r in avec) r.toJson()]), jsonEncode([for (final r in sans) r.toJson()]));
    });
  });
}
