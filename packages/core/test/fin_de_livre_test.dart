/// LE LIVRE FINI, L'OBJECTIF DU PREMIER JOUR ET L'ÉCHELLE DES RENTRÉES
/// (lot « moteur-correctifs »).
///
///   O · l'objectif de la première saison est celui que le postulat déclare
///       (`objective:`), sans tirage ; un postulat qui ne déclare rien tire,
///       comme toute saison suivante. Le test d'avant (`s.postulat >= 2`) jetait
///       la déclaration des livres 3 à 10 : le livre 10 déclare la montée et
///       s'ouvrait sur « le maintien » dans 59 % des carrières.
///   E · l'échelle de la rentrée et de la veille génériques compte les saisons
///       à partir de 0 : la marche « quatrième » est `season >= 3`, pas 4.
///   F · la fin du livre (`saisons:` + `fin_de_livre:`) : au verdict de la
///       dernière saison, la carrière encore en vie prend la fin du livre,
///       comme toute fin de verdict, avant le contrat et le Carrefour, sans
///       tirage ; aucune carrière d'un livre ne court plus après sa dernière
///       saison ; un postulat sans les deux champs se joue comme avant.
///   V · la validation : build_content refuse une longueur hors de 1..10, une
///       fin inconnue, un champ sans l'autre ; le lint accepte une fin qui n'a
///       pour porte que `fin_de_livre`.
library;

import 'dart:convert';
import 'dart:io';

import 'package:fusible_core/fusible_core.dart';
import 'package:test/test.dart';

String _racine() {
  var dir = Directory.current;
  for (var i = 0; i < 6; i++) {
    if (File('${dir.path}/content/build/content.json').existsSync()) return dir.path;
    final parent = dir.parent;
    if (parent.path == dir.path) break;
    dir = parent;
  }
  throw StateError('content/build/content.json introuvable — lance d\'abord build_content');
}

/// Le bundle du jeu, décodé à neuf (chaque test peut le modifier sans toucher les autres).
Map<String, dynamic> _bundle() => (jsonDecode(File('${_racine()}/content/build/content.json').readAsStringSync()) as Map).cast<String, dynamic>();

Content _contenu(Map<String, dynamic> raw) => loadContentFromJson(jsonEncode(raw));

Map<String, dynamic> _postulat(Map<String, dynamic> raw, int index) => ((raw['postulats'] as List)[index] as Map).cast<String, dynamic>();

// --- la politique « lecteur moyen » de simulate (mêmes graines, mêmes erreurs) ---------------------------

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

int _graine(int i) => i * 2654435761 & 0x7FFFFFFF;

/// Sert l'état où la carte Objectif de la première saison vient d'apparaître.
GameState _jusquALObjectif(Engine e, int seed, int postulat) {
  var s = e.start(seed, postulat: postulat);
  var n = 0;
  while (!s.over && s.pending!.kind != 'objective' && n < 60) {
    s = e.choose(s, n.isEven);
    n++;
  }
  expect(s.over, isFalse, reason: 'graine $seed : la carrière s\'arrête avant la carte Objectif');
  expect(s.pending!.kind, 'objective', reason: 'graine $seed');
  return s;
}

/// Ce qu'une carrière a laissé : la fin, la dernière carte répondue, la saison la plus haute servie.
class _Carriere {
  GameState fin;
  final List<String> kinds;
  final int saisonMax;
  final bool carrefourAccepte;
  _Carriere(this.fin, this.kinds, this.saisonMax, this.carrefourAccepte);
  String get derniereCarte => kinds.last;
}

_Carriere _jouer(Engine e, int seed, int postulat, {bool accepterTransition = false, int cap = 4000}) {
  var s = e.start(seed, postulat: postulat);
  final kinds = <String>[];
  var saisonMax = 0, step = 0;
  var accepte = false;
  while (!s.over && step < cap) {
    final p = s.pending!;
    if (s.season > saisonMax) saisonMax = s.season;
    kinds.add(p.kind);
    var droite = _humanLike(s, step);
    if (accepterTransition && p.kind == 'bilan_carrefour' && p.payload['transition'] != null) {
      droite = true;
      accepte = true;
    }
    s = e.choose(s, droite);
    step++;
  }
  return _Carriere(s, kinds, saisonMax, accepte);
}

void main() {
  final brut = _bundle();
  final contenu = _contenu(brut);
  final moteur = Engine(contenu);

  group('O · l\'objectif de la première saison', () {
    test('O1 · un postulat qui déclare son objectif l\'obtient, quel que soit son rang (le livre 10 : la montée)', () {
      var vus = 0;
      for (var i = 0; i < contenu.postulatsByIndex.length; i++) {
        final declare = contenu.postulatsByIndex[i].objective;
        if (declare == null) continue;
        final cibles = <String>{};
        for (var k = 0; k < 24; k++) {
          final s = _jusquALObjectif(moteur, _graine(k), i);
          cibles.add(s.objectiveTarget);
          expect(s.objectiveLabel, objectiveLabelFr(declare), reason: 'livre ${i + 1}, graine ${_graine(k)}');
        }
        expect(cibles, {declare}, reason: 'livre ${i + 1} (${contenu.postulatsByIndex[i].id}) déclare « $declare »');
        vus++;
      }
      expect(vus, greaterThanOrEqualTo(8), reason: 'huit livres au moins déclarent leur objectif : le test ne doit pas être creux');
      // le cas du rapport : « Les Deux Téléphones » (montée) ne s'ouvre plus sur le maintien
      final dix = contenu.postulatsByIndex.indexWhere((p) => p.id == 'escalier_ferme');
      expect(dix, greaterThanOrEqualTo(0));
      expect(contenu.postulatsByIndex[dix].objective, 'montee');
      for (var k = 0; k < 60; k++) {
        expect(_jusquALObjectif(moteur, _graine(k), dix).objectiveTarget, 'montee', reason: 'graine ${_graine(k)}');
      }
    });

    test('O2 · un postulat qui ne déclare rien tire son objectif, comme avant', () {
      var vus = 0;
      for (var i = 0; i < contenu.postulatsByIndex.length; i++) {
        if (contenu.postulatsByIndex[i].objective != null) continue;
        final cibles = <String>{};
        for (var k = 0; k < 60; k++) {
          cibles.add(_jusquALObjectif(moteur, _graine(k), i).objectiveTarget);
        }
        expect(cibles.length, greaterThan(1), reason: 'livre ${i + 1} (${contenu.postulatsByIndex[i].id}) : l\'objectif se tire, il n\'est pas figé sur ${cibles.first}');
        vus++;
      }
      expect(vus, greaterThanOrEqualTo(1), reason: 'au moins un livre (la pépite, le joueur en fin de contrat) ne déclare rien');
      // et un livre qui déclarait, une fois sa déclaration retirée du bundle, retombe sur le tirage
      final raw = _bundle();
      _postulat(raw, 9).remove('objective');
      final sans = Engine(_contenu(raw));
      final cibles = <String>{for (var k = 0; k < 60; k++) _jusquALObjectif(sans, _graine(k), 9).objectiveTarget};
      expect(cibles.length, greaterThan(1), reason: 'sans déclaration, le livre 10 (Division 2) tire maintien ou montée : $cibles');
      expect(cibles.difference({'maintien', 'montee'}), isEmpty);
    });

    test('O3 · la déclaration ne vaut que pour la première saison : les suivantes tirent comme avant', () {
      final raw = _bundle();
      _postulat(raw, 9)['objective'] = 'titre';
      final e = Engine(_contenu(raw));
      var atteintes = 0, differentes = 0;
      for (var k = 0; k < 14; k++) {
        var s = e.start(_graine(k), postulat: 9);
        var step = 0, vues = 0;
        while (!s.over && step < 400 && s.season < 2) {
          if (s.pending!.kind == 'objective') {
            vues++;
            if (s.season == 0) {
              expect(s.objectiveTarget, 'titre', reason: 'saison 0, graine ${_graine(k)}');
            } else {
              atteintes++;
              if (s.objectiveTarget != 'titre') differentes++;
              expect(<String>{'maintien', 'montee', 'top10', 'top5', 'europe', 'titre'}, contains(s.objectiveTarget));
            }
          }
          s = e.choose(s, _humanLike(s, step));
          step++;
        }
        expect(vues, greaterThanOrEqualTo(1));
      }
      expect(atteintes, greaterThanOrEqualTo(8), reason: 'au moins huit carrières atteignent la deuxième carte Objectif');
      expect(differentes, greaterThanOrEqualTo(atteintes * 0.6),
          reason: 'en saison 1 l\'objectif est tiré (Division 2 : maintien ou montée), il ne reste pas « titre » ($differentes/$atteintes)');
    });

    test('O4 · coût du Rng : zéro quand le postulat déclare, un seul nextDouble quand l\'objectif se tire', () {
      final raw = _bundle();
      _postulat(raw, 9).remove('objective');
      final sans = Engine(_contenu(raw));
      for (var k = 0; k < 8; k++) {
        final avec = _jusquALObjectif(moteur, _graine(k), 9); // déclare « montee »
        final tire = _jusquALObjectif(sans, _graine(k), 9);
        expect(avec.objectiveTarget, 'montee');
        // même graine, mêmes réponses : la seule différence est le tirage de l'objectif
        // (Division 2, pression 0 : `pickObjective` lit exactement un `nextDouble`)
        final r = Rng.fromState(avec.rngState)..nextDouble();
        expect(r.state, tire.rngState, reason: 'graine ${_graine(k)} : le livre qui déclare ne touche pas le Rng, celui qui tire en lit un');
      }
    });
  });

  group('E · l\'échelle de la rentrée et de la veille génériques', () {
    // La première variante dont le `if` tient, les marches de contexte (`vers_entraineur`, `banc_regarde`…)
    // étant fausses : une carrière neuve de promu.
    String marche(String etape, int season) {
      final s = moteur.start(1, postulat: 0);
      s.season = season;
      final st = contenu.arcs['co.script.generique']!.stepById(etape)!;
      final c = EvalContext(s, 'presaison');
      for (final v in st.card) {
        if (v.ifWhen == null || evalWhen(v.ifWhen, c)) return v.id;
      }
      return st.card.last.id;
    }

    test('E1 · season compte à partir de 0 : la quatrième saison voit la marche « quatrième », pas la troisième', () {
      const rentree = ['co.script.rentree', 'co.script.rentree_encore', 'co.script.rentree_troisieme', 'co.script.rentree_quatrieme'];
      const veille = ['co.script.veille', 'co.script.veille_encore', 'co.script.veille_troisieme', 'co.script.veille_quatrieme'];
      for (var season = 0; season <= 7; season++) {
        final rang = season.clamp(0, 3);
        expect(marche('rentree', season), rentree[rang], reason: 'rentrée de la saison d\'index $season (la ${season + 1}e)');
        expect(marche('veille', season), veille[rang], reason: 'veille de la saison d\'index $season (la ${season + 1}e)');
      }
    });

    test('E2 · le texte des marches dit le rang de la saison où elles sont servies', () {
      String texte(String id) => contenu.cards[id]!.text;
      expect(texte(marche('rentree', 1)), contains('Deuxième saison'));
      expect(texte(marche('rentree', 2)), contains('Troisième rentrée'));
      expect(texte(marche('veille', 2)), contains('Trois ans que je note la veille'));
      // la quatrième saison ne ressert ni « Troisième rentrée » ni « Trois ans »
      expect(texte(marche('rentree', 3)), isNot(contains('Troisième')));
      expect(texte(marche('veille', 3)), isNot(contains('Trois ans')));
    });
  });

  group('F · la fin du livre', () {
    /// Un contenu où le postulat 0 (le promu) déclare [saisons] saisons et la fin [fin].
    Engine livre({int? saisons, String? fin}) {
      final raw = _bundle();
      final p = _postulat(raw, 0);
      p.remove('saisons');
      p.remove('fin_de_livre');
      if (saisons != null) p['saisons'] = saisons;
      if (fin != null) p['fin_de_livre'] = fin;
      return Engine(_contenu(raw));
    }

    // `generique` (« Fin de carrière ») n'est la porte d'aucune carte : si la carrière la prend, c'est la fermeture.
    const fin = 'generique';

    /// Joue jusqu'à la carte du verdict de la saison d'index [season] et rend l'état juste avant la réponse.
    GameState? auVerdict(Engine e, int seed, int season) {
      var s = e.start(seed, postulat: 0);
      var step = 0;
      while (!s.over && step < 800) {
        if (s.pending!.kind == 'bilan_verdict' && s.season == season) return s;
        s = e.choose(s, _humanLike(s, step));
        step++;
      }
      return null;
    }

    test('F1 · le postulat du jeu déclare sa longueur et sa fin ; chaque fin existe', () {
      var declarent = 0;
      for (final p in contenu.postulatsByIndex) {
        if (p.saisons == null && p.finDeLivre == null) continue;
        declarent++;
        expect(p.saisons, isNotNull, reason: '${p.id} : saisons et fin_de_livre vont ensemble');
        expect(p.finDeLivre, isNotNull, reason: p.id);
        expect(p.saisons, inInclusiveRange(1, 10), reason: p.id);
        expect(contenu.endings.containsKey(p.finDeLivre), isTrue, reason: '${p.id} : fin « ${p.finDeLivre} » inconnue');
      }
      expect(declarent, contenu.postulatsByIndex.length, reason: 'les dix livres déclarent leur fin');
      // la longueur de chaque livre : trois saisons, sauf les trois dont la dernière porte est au-delà
      final longueurs = {for (final p in contenu.postulatsByIndex) p.id: p.saisons};
      expect(longueurs['promu'], 3);
      expect(longueurs['interimaire'], 3);
      expect(longueurs['pepite'], 3);
      expect(longueurs['fin_de_contrat'], 3);
      expect(longueurs['geant_dechu'], 3);
      expect(longueurs['vendre_trente'], 3);
      expect(longueurs['apres_fiasco'], 4, reason: 'la coda de 2014 (sl.h7.e1_gerbe) porte « Malaise cardiaque » et « L\'homme du président »');
      expect(longueurs['le_modele'], 3);
      expect(longueurs['mondial_hiver'], 4, reason: 'l\'épilogue de 2032 porte « Le tiroir »');
      expect(longueurs['escalier_ferme'], 4, reason: 'l\'assemblée est le créneau 1 de la saison d\'index 3');
    });

    test('F2 · au verdict de la dernière saison, la carrière prend la fin du livre — avant le contrat et le Carrefour, sans tirage', () {
      final e = livre(saisons: 1, fin: fin);
      var fermees = 0;
      for (var k = 0; k < 12; k++) {
        final avant = auVerdict(e, _graine(k), 0);
        if (avant == null) continue; // la carrière s'est arrêtée plus tôt, sur une autre fin
        final apres = e.choose(avant, true);
        fermees++;
        expect(apres.over, isTrue, reason: 'graine ${_graine(k)}');
        expect(apres.endingId, fin);
        expect(apres.pending!.kind, 'ending', reason: 'l\'écran de fin est servi tout de suite : pas de carte de contrat, pas de Carrefour');
        expect(apres.pending!.payload['ending'], fin);
        expect(apres.rngState, avant.rngState, reason: 'la fermeture ne lit pas le Rng');
        expect(apres.season, 0, reason: 'pas de passage de saison');
        expect(apres.stats['saisons'], (avant.stats['saisons'] ?? 0) + 1, reason: 'la dernière saison est comptée jouée');
        expect(apres.journal.any((j) => j.kind == 'bilan' && j.season == 0), isTrue, reason: 'la ligne de Bilan est écrite avant la fin : l\'écran de fin la lit');
        expect(apres.flags.contains('bilan_tenu') || apres.flags.contains('bilan_manque'), isTrue, reason: 'le verdict est appliqué avant la fermeture');
        expect(apres.unlocked, contains('fin:$fin'), reason: 'le Cimetière la compte comme toute fin');
      }
      expect(fermees, greaterThanOrEqualTo(6), reason: 'la plupart des carrières du promu atteignent le verdict de leur première saison');
    });

    test('F3 · deux saisons : le premier verdict continue (contrat, Carrefour), le second ferme', () {
      final e = livre(saisons: 2, fin: fin);
      var ferme = 0;
      for (var k = 0; k < 12; k++) {
        final v0 = auVerdict(e, _graine(k), 0);
        if (v0 == null) continue;
        final s1 = e.choose(v0, true);
        expect(s1.over, isFalse, reason: 'graine ${_graine(k)} : le verdict de la saison 0 ne ferme pas un livre de deux saisons');
        expect(s1.pending!.kind, 'bilan_contrat', reason: 'la carte du contrat suit le verdict');
        final v1 = auVerdict(e, _graine(k), 1);
        if (v1 == null) continue;
        final s2 = e.choose(v1, true);
        expect(s2.over, isTrue);
        expect(s2.endingId, fin);
        expect(s2.season, 1);
        ferme++;
      }
      expect(ferme, greaterThanOrEqualTo(3));
    });

    test('F4 · sans `saisons` ni `fin_de_livre`, rien ne change : la carrière continue jusqu\'à une fin commune', () {
      final e = livre();
      expect(e.content.postulatsByIndex[0].saisons, isNull);
      expect(e.content.postulatsByIndex[0].livreFiniAuBilan(5), isFalse);
      var vus = 0;
      for (var k = 0; k < 6; k++) {
        final v = auVerdict(e, _graine(k), 0);
        if (v == null) continue;
        final s = e.choose(v, true);
        expect(s.over, isFalse, reason: 'graine ${_graine(k)}');
        expect(s.pending!.kind, 'bilan_contrat');
        vus++;
      }
      expect(vus, greaterThanOrEqualTo(3));
    });

    test('F5 · une fin que le contenu ne déclare pas ne ferme rien (bundle assemblé à la main : le build, lui, la refuse)', () {
      final e = livre(saisons: 1, fin: 'cette_fin_nexiste_pas');
      var vus = 0;
      for (var k = 0; k < 6; k++) {
        final v = auVerdict(e, _graine(k), 0);
        if (v == null) continue;
        final s = e.choose(v, true);
        expect(s.over, isFalse);
        expect(s.pending!.kind, 'bilan_contrat');
        vus++;
      }
      expect(vus, greaterThanOrEqualTo(3));
    });

    test('F6 · aucune carrière d\'aucun livre ne court après sa dernière saison', () {
      var fermees = 0, carrieres = 0, sansFin = 0;
      for (var i = 0; i < contenu.postulatsByIndex.length; i++) {
        final p = contenu.postulatsByIndex[i];
        // plus de graines pour les livres où 20 à 30 % des carrières allaient au-delà (2, 3 et 4)
        final graines = (i >= 1 && i <= 3) ? 16 : 8;
        for (var k = 0; k < graines; k++) {
          final c = _jouer(moteur, _graine(k), i);
          carrieres++;
          if (!c.fin.over) sansFin++;
          expect(c.saisonMax, lessThan(p.saisons!), reason: '${p.id}, graine ${_graine(k)} : une carte servie en saison d\'index ${c.saisonMax} pour un livre de ${p.saisons} saisons');
          expect(c.fin.over, isTrue, reason: '${p.id}, graine ${_graine(k)} : la carrière s\'arrête');
          if (c.fin.endingId == p.finDeLivre && c.derniereCarte == 'bilan_verdict') {
            fermees++;
            expect(c.fin.season, p.saisons! - 1, reason: '${p.id} : la fermeture tombe au verdict de la dernière saison');
          }
        }
      }
      expect(sansFin, 0);
      expect(fermees, greaterThanOrEqualTo(3), reason: 'sur $carrieres carrières, les livres 2, 3, 4 et 8 en ferment un quart : le test ne doit pas être creux');
    });

    test('F7 · un changement de rôle ne fait pas échapper au livre (le livre 4 laisse la porte du banc ouverte)', () {
      final i = contenu.postulatsByIndex.indexWhere((p) => p.id == 'fin_de_contrat');
      final p = contenu.postulatsByIndex[i];
      var changes = 0;
      for (var k = 0; k < 24; k++) {
        final c = _jouer(moteur, _graine(k), i, accepterTransition: true);
        expect(c.saisonMax, lessThan(p.saisons!), reason: 'graine ${_graine(k)}');
        expect(c.fin.over, isTrue);
        if (c.carrefourAccepte && c.fin.role != p.role && c.fin.endingId == p.finDeLivre) {
          changes++;
          expect(c.fin.flags.contains('role_was_${p.role}'), isTrue);
          expect(c.fin.season, p.saisons! - 1, reason: 'le banc de la réserve se ferme avec le livre, au verdict de la dernière saison');
          expect(c.derniereCarte, 'bilan_verdict');
        }
      }
      expect(changes, greaterThanOrEqualTo(3), reason: 'des joueurs passés au banc de la réserve finissent sur la fin du livre');
    });
  });

  group('V · la validation du contenu', () {
    /// Réécrit (ou retire, si [valeur] est nulle) le champ [champ] du postulat [id] dans le texte de
    /// postulats.yaml — sans dépendre des valeurs que les livres déclarent aujourd'hui.
    String champDuPostulat(String yaml, String id, String champ, String? valeur) {
      final debut = yaml.indexOf('\n  - id: $id\n');
      expect(debut, greaterThanOrEqualTo(0), reason: 'postulat « $id » introuvable dans postulats.yaml');
      final suite = yaml.indexOf('\n  - id: ', debut + 1);
      final fin = suite < 0 ? yaml.length : suite;
      final bloc = yaml.substring(debut, fin);
      final re = RegExp('\\n    $champ:[^\\n]*(?=\\n)');
      expect(re.hasMatch(bloc), isTrue, reason: 'postulat « $id » : champ `$champ` introuvable');
      final neuf = bloc.replaceFirst(re, valeur == null ? '' : '\n    $champ: $valeur');
      return yaml.substring(0, debut) + neuf + yaml.substring(fin);
    }

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

    test('V1 · build_content refuse une longueur hors de 1..10, une fin inconnue, un champ sans l\'autre', () async {
      final racine = _racine();
      final tmp = Directory('${Directory.systemTemp.path}/fusible_fin_livre_${DateTime.now().microsecondsSinceEpoch}')..createSync(recursive: true);
      try {
        await copier(Directory('$racine/content'), Directory('${tmp.path}/content'));
        final f = File('${tmp.path}/content/postulats.yaml');
        var t = f.readAsStringSync();
        // promu : onze saisons ; interimaire : une fin inconnue ; pepite : `saisons` sans `fin_de_livre`
        t = champDuPostulat(t, 'promu', 'saisons', '11');
        t = champDuPostulat(t, 'interimaire', 'fin_de_livre', 'cette_fin_nexiste_pas');
        t = champDuPostulat(t, 'pepite', 'fin_de_livre', null);
        f.writeAsStringSync(t);
        final b = await Process.run(Platform.resolvedExecutable, ['$racine/packages/tools/bin/build_content.dart'], workingDirectory: tmp.path);
        expect(b.exitCode, 1, reason: 'stdout: ${b.stdout}\nstderr: ${b.stderr}');
        final err = b.stderr.toString();
        expect(err, contains('postulats: promu: saisons « 11 » : un entier de 1 à 10'));
        expect(err, contains('postulats: interimaire: fin_de_livre « cette_fin_nexiste_pas » : aucune fin de ce nom'));
        expect(err, contains('postulats: pepite: `saisons` et `fin_de_livre` vont ensemble'));
      } finally {
        tmp.deleteSync(recursive: true);
      }
    }, timeout: const Timeout(Duration(minutes: 6)));

    test('V2 · le lint accepte comme porte la `fin_de_livre` d\'un postulat — et refuse la même fin sans porte', () async {
      final racine = _racine();
      final tmp = Directory('${Directory.systemTemp.path}/fusible_fin_livre_lint_${DateTime.now().microsecondsSinceEpoch}')..createSync(recursive: true);
      try {
        await copier(Directory('$racine/content'), Directory('${tmp.path}/content'));
        File('${tmp.path}/content/endings/lot_fin_de_livre_test.yaml').writeAsStringSync('''
endings:
  - id: fin_de_livre_test
    cause: livre
    title: "La fin d'essai"
    epitaph: "Écrite pour le test : personne ne la pose par une carte."
''');
        // 1. la fin n'est la porte de rien : erreur de lint nommée
        final b0 = await Process.run(Platform.resolvedExecutable, ['$racine/packages/tools/bin/build_content.dart'], workingDirectory: tmp.path);
        expect(b0.exitCode, 0, reason: 'stdout: ${b0.stdout}\nstderr: ${b0.stderr}');
        final l0 = await Process.run(Platform.resolvedExecutable, ['$racine/packages/tools/bin/lint.dart'], workingDirectory: tmp.path);
        expect(l0.exitCode, 1, reason: 'stdout: ${l0.stdout}\nstderr: ${l0.stderr}');
        expect(l0.stderr.toString(), contains('fin « fin_de_livre_test » sans porte'));
        // 2. un postulat la déclare en `fin_de_livre` : c'est sa porte, le lint se tait
        final f = File('${tmp.path}/content/postulats.yaml');
        f.writeAsStringSync(champDuPostulat(f.readAsStringSync(), 'promu', 'fin_de_livre', 'fin_de_livre_test'));
        final b1 = await Process.run(Platform.resolvedExecutable, ['$racine/packages/tools/bin/build_content.dart'], workingDirectory: tmp.path);
        expect(b1.exitCode, 0, reason: 'stdout: ${b1.stdout}\nstderr: ${b1.stderr}');
        final l1 = await Process.run(Platform.resolvedExecutable, ['$racine/packages/tools/bin/lint.dart'], workingDirectory: tmp.path);
        expect(l1.exitCode, 0, reason: 'stdout: ${l1.stdout}\nstderr: ${l1.stderr}');
      } finally {
        tmp.deleteSync(recursive: true);
      }
    }, timeout: const Timeout(Duration(minutes: 8)));
  });
}
