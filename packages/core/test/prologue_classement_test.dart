/// P · le prologue, C · le classement, S · les événements sonores.
///
/// Trois manques relevés par le client après trois minutes de jeu :
///
/// · « on commence directement avec les objectifs du président, il n'y a
///   aucune mise en situation » → le beat `prologue` (saison 0, avant la carte
///   Objectif, hors créneau narratif, zéro tirage) ;
/// · « parfois on parle de classement mais cela n'est indiqué nulle part » →
///   le beat `classement` (deux fois par saison) et la table dérivée de
///   `world.pts` / `world.standingRank` ;
/// · « un jeu sans univers musical est un jeu vide » → `ambiance` et `sfx`,
///   le vocabulaire fermé que le moteur donne à jouer à la couche sonore.
///
/// Le prologue se teste sur un contenu synthétique : le mécanisme est en
/// place, les quatre postulats du jeu n'ont pas encore leur arc `prologue:`
/// écrit (le lint le rappelle en avertissement). Les tests sur le contenu réel
/// vérifient que l'absence de prologue ne coûte rien.
library;

import 'dart:io';

import 'package:fusible_core/fusible_core.dart';
import 'package:test/test.dart';

// ---------------------------------------------------------------------------
// Contenu synthétique : le calendrier réel (prologue + classement), un arc de
// prologue de cinq scènes.
// ---------------------------------------------------------------------------

Map<String, dynamic> _card(
  String id, {
  String? speaker,
  String kind = 'routine',
  bool pool = true,
  String? arcId,
  String? stepId,
  Map<String, dynamic>? left,
  Map<String, dynamic>? right,
  List<String> tags = const [],
}) =>
    {
      'id': id,
      'roles': ['entraineur'],
      'arc': 'divers',
      'tags': tags,
      if (speaker != null) 'speaker': speaker,
      'weight': 1.0,
      'once': false,
      'cooldown': 12,
      'priority': 0,
      'sablier': false,
      'text': 'Texte de $id.',
      'left': {'label': 'Gauche', 'answer': 'À gauche.', 'effects': left ?? const {}},
      'right': {'label': 'Droite', 'answer': 'À droite.', 'effects': right ?? const {}},
      'tone': 'leger',
      'kind': kind,
      'pool': pool,
      if (arcId != null) 'arcId': arcId,
      if (stepId != null) 'stepId': stepId,
    };

/// Le calendrier du jeu, tel que `content/calendar.yaml` l'écrit.
List<Map<String, dynamic>> _calendar() => [
      {
        'phase': 'presaison',
        'beats': ['prologue', 'prologue', 'prologue', 'prologue', 'prologue', 'prologue', 'objective', 'card', 'card', 'card'],
      },
      {
        'phase': 'aller',
        'beats': ['card', 'card', 'match', 'card', 'card', 'match', 'card', 'card', 'match', 'classement'],
      },
      {'phase': 'hiver', 'beats': ['card', 'card', 'card']},
      {
        'phase': 'retour',
        'beats': ['card', 'card', 'match', 'cup', 'card', 'card', 'match', 'card', 'match'],
      },
      {'phase': 'sprint', 'beats': ['gm_annonce', 'gm_te', 'gm_te', 'gm_te', 'aftermatch']},
      {'phase': 'bilan', 'beats': ['classement', 'bilan_une', 'bilan_verdict', 'bilan_contrat', 'bilan_carrefour']},
    ];

Content _synth({bool withPrologue = true, int scenes = 5}) {
  final proCards = [
    for (var i = 1; i <= scenes; i++)
      _card('pro.$i', speaker: 'josiane', kind: 'prologue', pool: false, arcId: 'pro.arrivee', stepId: 'p$i'),
  ];
  const endingIds = [
    'en_bus', 'en_copain', 'en_banderole', 'en_otage', 'en_sms', 'en_placard', 'en_decoupe', 'en_coupable',
    'generique', 'grand_deballage', 'jubile',
  ];
  final j = <String, dynamic>{
    'version': 1,
    'hash': 'test',
    'roles': [
      {
        'id': 'entraineur',
        'name': 'Entraîneur',
        'fragile': 'direction',
        'age': [40, 40],
        'posture': ['Offensif', 'Prudent'],
        'patron': 'aulard',
        'gauges': [
          {'id': 'vestiaire', 'label': 'Vestiaire', 'icon': 'x', 'empty': 'en_bus', 'full': 'en_copain'},
          {'id': 'tribunes', 'label': 'Tribunes', 'icon': 'x', 'empty': 'en_banderole', 'full': 'en_otage'},
          {'id': 'direction', 'label': 'Direction', 'icon': 'x', 'empty': 'en_sms', 'full': 'en_placard'},
          {'id': 'caisse', 'label': 'Caisse', 'icon': 'x', 'empty': 'en_decoupe', 'full': 'en_coupable'},
        ],
        'transitions': const [],
      },
    ],
    'cards': [
      for (var i = 0; i < 40; i++) _card('r.f$i', speaker: i.isEven ? 'josiane' : 'vukic'),
      ...proCards,
    ],
    'endings': [for (final id in endingIds) {'id': id, 'title': id, 'epitaph': ''}],
    'feats': const [],
    'calendar': {'entraineur': _calendar()},
    'names': {
      'prenoms_f': ['Anne'],
      'prenoms_m': ['Jean'],
      'noms': ['Durand'],
      'club_prefixes': ['US', 'AS', 'FC', 'Olympique', 'Racing', 'Stade', 'Sporting', 'Union', 'Étoile'],
      'villes': ['Valmont', 'Bellac', 'Nerville', 'Portclair', 'Roquemont', 'Castérac', 'Aubérive', 'Valdorne'],
    },
    'divisions': const {},
    'characters': [
      {'id': 'josiane', 'name': 'Madame Josiane', 'genre': 'f', 'label': 'SECRÉTAIRE', 'camp': 'direction'},
      {'id': 'vukic', 'name': 'Zoran Vukić', 'camp': 'terrain'},
      {'id': 'aulard', 'name': 'Jean-Marie Aulard', 'camp': 'direction'},
    ],
    'arcs': [
      if (withPrologue)
        {
          'id': 'pro.arrivee',
          'kind': 'prologue',
          'roles': ['entraineur'],
          'steps': [
            for (var i = 1; i <= scenes; i++)
              {'id': 'p$i', 'card': [{'id': 'pro.$i'}], 'season': '0', 'next': const []},
          ],
        },
    ],
    'postulats': [
      {
        'id': 'test',
        'index': 0,
        'role': 'entraineur',
        'title': 'Test',
        'division': 1,
        'year': 1990,
        'gauges': {'vestiaire': 50, 'tribunes': 50, 'direction': 50, 'caisse': 50},
        'force': 50,
        'objective': 'maintien',
        'president': 'aulard',
        if (withPrologue) 'prologue': 'pro.arrivee',
      },
    ],
    'alarms': const {},
    'director': const {},
  };
  return Content.fromJson(j);
}

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

/// Joue jusqu'à la carte dont `kind` vaut [kind] (ou jusqu'à épuisement).
GameState _until(Engine e, GameState s, String kind, {int max = 400}) {
  var g = 0;
  while (!s.over && s.pending!.kind != kind && g < max) {
    s = e.choose(s, s.pending!.single ? true : g.isEven);
    g++;
  }
  return s;
}

void main() {
  // -------------------------------------------------------------------------
  group('P · le prologue', () {
    test('P1 · la toute première carte d\'une carrière est une carte de prologue', () {
      final engine = Engine(_synth());
      final s = engine.start(4242);
      expect(s.pending!.kind, 'prologue');
      expect(s.pending!.id, 'pro.1');
      expect(s.pending!.payload['kind'], 'prologue');
      expect(s.pending!.payload['prologue'], 1);
      expect(s.pending!.payload['prologue_total'], 5);
    });

    test('P2 · les cinq scènes sortent dans l\'ordre du fichier, puis vient l\'Objectif', () {
      final engine = Engine(_synth());
      var s = engine.start(4242);
      final vus = <String>[];
      for (var i = 0; i < 6; i++) {
        vus.add('${s.pending!.kind}:${s.pending!.id}');
        s = engine.choose(s, true);
      }
      expect(vus, [
        'prologue:pro.1',
        'prologue:pro.2',
        'prologue:pro.3',
        'prologue:pro.4',
        'prologue:pro.5',
        'objective:objective:0',
      ]);
    });

    test('P3 · le prologue ne consomme AUCUN tirage : le rngState est intact', () {
      final engine = Engine(_synth());
      var s = engine.start(4242);
      // Le prologue est servi juste après l'ouverture de saison, qui, elle,
      // tire. Ce qu'on vérifie ici : de la première carte du prologue à la
      // dernière, l'état du générateur ne bouge pas d'un cran.
      final avant = s.rngState;
      for (var i = 0; i < 5; i++) {
        expect(s.pending!.kind, 'prologue', reason: 'carte ${i + 1} du prologue');
        s = engine.choose(s, true);
        expect(s.rngState, avant, reason: 'le prologue a tiré au dé (carte ${i + 1})');
      }
      expect(s.pending!.kind, 'objective');
    });

    test('P4 · un prologue ne coûte pas un tirage à la carrière qui suit', () {
      // Deux contenus identiques, l'un avec prologue, l'autre sans : au moment
      // où la carte Objectif est servie, le générateur est au même endroit.
      final avec = Engine(_synth());
      final sans = Engine(_synth(withPrologue: false));
      var a = avec.start(777);
      for (var i = 0; i < 5; i++) {
        a = avec.choose(a, true);
      }
      final b = sans.start(777);
      expect(a.pending!.kind, 'objective');
      expect(b.pending!.kind, 'objective');
      expect(a.rngState, b.rngState);
    });

    test('P5 · le prologue est hors créneau : ni slot, ni ncards, ni Nouvelle', () {
      final engine = Engine(_synth());
      var s = engine.start(4242);
      for (var i = 0; i < 5; i++) {
        expect(s.slot, 0);
        expect(s.ncards, 0);
        expect(s.nouvellesThisSeason, 0);
        expect(s.storyThisSeason, 0);
        s = engine.choose(s, true);
      }
      expect(s.slot, 0, reason: 'la carte Objectif ne consomme pas de créneau non plus');
      // La saison garde ses dix-sept créneaux narratifs.
      expect(engine.content.cardSlots('entraineur'), 17);
    });

    test('P6 · le prologue ne sort qu\'en saison 0', () {
      final content = _synth();
      final engine = Engine(content);
      var s = engine.start(4242);
      var prologuesS0 = 0;
      var prologuesApres = 0;
      var g = 0;
      while (!s.over && s.season < 2 && g < 400) {
        if (s.pending!.kind == 'prologue') {
          if (s.season == 0) {
            prologuesS0++;
          } else {
            prologuesApres++;
          }
        }
        s = engine.choose(s, s.pending!.single ? true : g.isEven);
        g++;
      }
      expect(prologuesS0, 5);
      expect(prologuesApres, 0);
    });

    test('P7 · sans arc de prologue, la carrière commence sur l\'Objectif (contenu réel)', () {
      final content = _real();
      final engine = Engine(content);
      for (var p = 0; p < content.postulatsByIndex.length; p++) {
        final post = content.postulatsByIndex[p];
        final s = engine.start(31, postulat: p);
        if (post.prologueArc == null) {
          expect(s.pending!.kind, 'objective',
              reason: 'postulat ${post.id} : sans `prologue:`, les beats sont sautés sans rien coûter');
        } else {
          expect(s.pending!.kind, 'prologue', reason: 'postulat ${post.id} : le prologue déclaré doit sortir en premier');
        }
      }
    });
  });

  // -------------------------------------------------------------------------
  group('C · le classement', () {
    test('C1 · la carte Classement sort deux fois par saison, après l\'aller et au Bilan', () {
      final engine = Engine(_synth());
      var s = engine.start(2024);
      final phases = <String>[];
      var g = 0;
      while (!s.over && s.season == 0 && g < 400) {
        if (s.pending!.kind == 'classement') phases.add(s.pending!.payload['finale'] == true ? 'bilan' : 'aller');
        s = engine.choose(s, s.pending!.single ? true : g.isEven);
        g++;
      }
      expect(phases, ['aller', 'bilan']);
    });

    test('C2 · la table est cohérente avec world.pts et world.standingRank', () {
      final engine = Engine(_synth());
      var s = engine.start(2024);
      s = _until(engine, s, 'classement');
      expect(s.over, isFalse);
      final rows = (s.pending!.payload['standings_complet'] as List).cast<Map<String, dynamic>>();
      expect(rows.length, kStandingsClubs);
      final moi = rows.firstWhere((r) => r['toi'] == true);
      expect(moi['rang'], s.world.standingRank, reason: 'ta ligne est au rang que le moteur calcule');
      expect(moi['pts'], s.world.pts, reason: 'ta ligne porte les points que le moteur compte');
      expect(moi['club'], s.entities.named['club']);
      // Une seule ligne « toi », des rangs 1..18 dans l'ordre, des points qui
      // décroissent : un tableau se lit de haut en bas.
      expect(rows.where((r) => r['toi'] == true).length, 1);
      for (var i = 0; i < rows.length; i++) {
        expect(rows[i]['rang'], i + 1);
        if (i > 0) {
          expect(rows[i]['pts'] as int, lessThanOrEqualTo(rows[i - 1]['pts'] as int),
              reason: 'ligne ${i + 1} : plus de points que la ligne au-dessus');
        }
      }
      // Personne ne peut avoir plus de points que de journées jouées × 3.
      final maxPts = 3 * s.world.blocks * kGamesPerBlock;
      for (final r in rows) {
        expect(r['pts'] as int, inInclusiveRange(0, maxPts));
      }
      // La fenêtre servie à la carte : six lignes, la tienne dedans.
      final fenetre = (s.pending!.payload['standings'] as List).cast<Map<String, dynamic>>();
      expect(fenetre.length, 6);
      expect(fenetre.any((r) => r['toi'] == true), isTrue);
    });

    test('C3 · la table est stable : deux lectures du même état donnent le même tableau', () {
      final engine = Engine(_synth());
      var s = engine.start(2024);
      s = _until(engine, s, 'classement');
      final a = engine.standingsOf(s).map((r) => r.toString()).toList();
      final b = engine.standingsOf(s).map((r) => r.toString()).toList();
      expect(a, b);
      // Et les clubs rivaux ne changent pas de nom d'un bout à l'autre de la
      // saison : ce sont les mêmes adversaires en décembre qu'en août.
      final aoutClubs = engine.standingsOf(s).where((r) => !r.toi).map((r) => r.club).toSet();
      final s2 = _until(engine, engine.choose(s, true), 'classement');
      final juinClubs = engine.standingsOf(s2).where((r) => !r.toi).map((r) => r.club).toSet();
      expect(juinClubs, aoutClubs);
      expect(s2.world.blocks, greaterThan(s.world.blocks), reason: 'le classement du Bilan est postérieur');
    });

    test('C4 · les rivaux progressent d\'un bloc à l\'autre (le championnat avance)', () {
      final engine = Engine(_synth());
      var s = engine.start(2024);
      s = _until(engine, s, 'classement');
      final tot1 = engine.standingsOf(s).fold<int>(0, (a, r) => a + r.pts);
      final s2 = _until(engine, engine.choose(s, true), 'classement');
      final tot2 = engine.standingsOf(s2).fold<int>(0, (a, r) => a + r.pts);
      expect(tot2, greaterThan(tot1));
    });

    test('C5 · la fenêtre montre le haut quand tu es premier, le bas quand tu es dernier', () {
      List<StandingRow> table(int rank) => buildStandings(
            seed: 5, postulatId: 'test', season: 0, division: 1, blocks: 6, rank: rank, pts: 60,
            monClub: 'FC Valmont', rivalClub: 'AS Bellac',
            prefixes: const ['US', 'AS', 'FC'], villes: const ['Valmont', 'Bellac', 'Nerville', 'Portclair', 'Roquemont', 'Castérac'],
          );
      expect(standingsWindow(table(1)).map((r) => r.rang), [1, 2, 3, 4, 5, 6]);
      expect(standingsWindow(table(18)).map((r) => r.rang), [13, 14, 15, 16, 17, 18]);
      expect(standingsWindow(table(10)).map((r) => r.rang), [8, 9, 10, 11, 12, 13]);
    });

    test('C6 · le classement ne coûte rien : ni jauge, ni créneau, ni point', () {
      final engine = Engine(_synth());
      var s = engine.start(2024);
      s = _until(engine, s, 'classement');
      final p = s.pending!;
      expect(p.single, isTrue, reason: 'un tableau, un bouton');
      expect(p.leftEffects.gauges, isEmpty);
      expect(p.rightEffects.gauges, isEmpty);
      final jauges = Map.of(s.gauges);
      final pts = s.world.pts;
      final apres = engine.choose(s, true);
      expect(apres.gauges, jauges);
      expect(apres.world.pts, pts);
      // Hors créneau : la saison garde ses dix-sept créneaux narratifs, malgré
      // le prologue en tête et les deux classements.
      final fin = _until(engine, apres, 'bilan_carrefour');
      expect(fin.over, isFalse);
      expect(fin.slot, 17);
    });

    test('C7 · sur le contenu réel, le classement du Bilan dit le même rang que la Une', () {
      final content = _real();
      final engine = Engine(content);
      var compares = 0;
      // Les quatre postulats et une graine qui change de club en cours de
      // saison (226010632, postulat 0 : l'aller sous un maillot, le retour
      // sous un autre).
      for (final postulat in [0, 1, 2, 3]) {
        for (final seed in [909, 12345, 77, 4242, 31337, 226010632]) {
          var s = engine.start(seed, postulat: postulat);
          var g = 0;
          int? rangClassement;
          while (!s.over && g < 400) {
            final p = s.pending!;
            if (p.kind == 'classement' && p.payload['finale'] == true) {
              rangClassement = p.payload['rang'] as int;
              // Le Bilan clôt SIX blocs de six journées, changement de club ou
              // non : le championnat ne rétrécit pas de moitié parce que tu as
              // signé ailleurs en janvier. C'est la saison qui porte le
              // calendrier, pas le club.
              expect(p.payload['journee'], kSeasonGames,
                  reason: 'graine $seed (postulat $postulat) : le classement final compte '
                      '${p.payload['journee']} journées au lieu de $kSeasonGames');
              expect(p.id, 'classement:${s.season}:$kBlocksPerSeason',
                  reason: 'graine $seed (postulat $postulat) : identifiant ${p.id} — les blocs de la saison');
              // L'ordre de grandeur : 108 points au plus pour six blocs, et la
              // table entière tient sous ce plafond.
              final pts = p.payload['pts'] as int;
              expect(pts, inInclusiveRange(0, 3 * kSeasonGames));
              for (final r in (p.payload['standings_complet'] as List).cast<Map<String, dynamic>>()) {
                expect(r['pts'] as int, inInclusiveRange(0, 3 * kSeasonGames));
              }
            }
            if (p.kind == 'bilan_une' && rangClassement != null) {
              // Le classement final tombe deux cartes avant la Une : les deux
              // lisent le même championnat, ils doivent dire le même rang.
              expect(p.payload['rang'], rangClassement,
                  reason: 'graine $seed : le classement final et la Une ne disent pas le même rang');
              compares += 1;
              rangClassement = null;
            }
            s = engine.choose(s, p.single ? true : g.isEven);
            g++;
          }
        }
      }
      expect(compares, greaterThan(0), reason: 'aucun Bilan atteint sur les graines');
    });

    test('C8 · le calendrier de la saison ne recule jamais (club ou rôle qui change)', () {
      // Le défaut, tel que le joueur le voyait : après une signature ou une
      // reconversion en cours d'exercice, le moteur repartait à zéro bloc au
      // milieu de la saison. Le classement du Bilan sortait alors sous
      // l'identifiant `classement:n:3`, annonçait « 18e journée » et une
      // colonne de points de demi-saison — juste avant une Une qui titrait sur
      // le championnat complet. On vérifie ici l'invariant à la source : dans
      // une même saison, le compteur de blocs ne recule pas.
      final content = _real();
      final engine = Engine(content);
      var saisonsVues = 0;
      var changementsEnCours = 0;
      for (final postulat in [0, 1, 2, 3]) {
        for (final seed in [909, 12345, 77, 4242, 31337, 226010632, 5150, 8080]) {
          var s = engine.start(seed, postulat: postulat);
          var g = 0;
          var saison = s.season;
          var blocs = s.world.blocks;
          var club = s.entities.named['club'];
          var role = s.role;
          while (!s.over && g < 400) {
            final p = s.pending!;
            s = engine.choose(s, p.single ? true : g.isEven);
            g++;
            if (s.season != saison) {
              saison = s.season;
              blocs = s.world.blocks;
              club = s.entities.named['club'];
              role = s.role;
              saisonsVues += 1;
              continue;
            }
            if (s.entities.named['club'] != club || s.role != role) {
              changementsEnCours += 1;
              club = s.entities.named['club'];
              role = s.role;
            }
            expect(s.world.blocks, greaterThanOrEqualTo(blocs),
                reason: 'graine $seed (postulat $postulat) : le calendrier de la saison $saison '
                    'est reparti de ${s.world.blocks} bloc(s) après $blocs');
            blocs = s.world.blocks;
          }
        }
      }
      expect(saisonsVues, greaterThan(0));
      expect(changementsEnCours, greaterThan(0),
          reason: 'aucun changement de club ou de rôle en cours de saison sur ces graines : '
              'le test ne prouve rien');
    });
  });

  // -------------------------------------------------------------------------
  group('S · les événements sonores', () {
    test('S1 · toute carte porte une ambiance connue et des sfx du vocabulaire fermé', () {
      final content = _real();
      final engine = Engine(content);
      for (final postulat in [0, 1, 2, 3]) {
        var s = engine.start(1234 + postulat, postulat: postulat);
        var g = 0;
        while (g < 200) {
          final p = s.pending!;
          final amb = ambianceOf(s, p);
          final sfx = sfxOf(s, p);
          expect(kAmbiances, contains(amb), reason: 'ambiance inconnue « $amb » sur ${p.id}');
          for (final e in sfx) {
            expect(kSfxEvents, contains(e), reason: 'événement inconnu « $e » sur ${p.id}');
          }
          expect(sfx.first, 'carte_arrivee');
          // Ordre stable : la liste suit toujours l'ordre de kSfxEvents.
          final rangs = [for (final e in sfx) kSfxEvents.indexOf(e)];
          expect(rangs, orderedEquals(List.of(rangs)..sort()));
          expect(sfx.toSet().length, sfx.length, reason: 'doublon dans les sfx de ${p.id}');
          if (s.over) break;
          s = engine.choose(s, p.single ? true : g.isEven);
          g++;
        }
      }
    });

    test('S2 · les beats structurants sonnent ce qu\'ils sont', () {
      final engine = Engine(_synth());
      var s = engine.start(2024);
      expect(ambianceOf(s, s.pending!), 'bureau', reason: 'Josiane est du camp direction');
      expect(sfxOf(s, s.pending!), contains('carte_arrivee'));

      s = _until(engine, s, 'objective');
      expect(sfxOf(s, s.pending!), contains('promesse'));
      expect(ambianceOf(s, s.pending!), 'bureau');

      s = _until(engine, s, 'match');
      expect(sfxOf(s, s.pending!), contains('match_debut'));
      expect(ambianceOf(s, s.pending!), 'terrain');

      s = _until(engine, s, 'classement');
      expect(sfxOf(s, s.pending!), contains('classement'));
      expect(ambianceOf(s, s.pending!), 'tribune');

      s = _until(engine, s, 'bilan_une');
      expect(sfxOf(s, s.pending!), contains('une'));
      expect(ambianceOf(s, s.pending!), 'presse');
    });

    test('S3 · une carte à un seul bouton n\'annonce pas de swipe droit', () {
      final engine = Engine(_synth());
      var s = engine.start(2024);
      s = _until(engine, s, 'classement');
      expect(s.pending!.single, isTrue);
      expect(sfxOf(s, s.pending!), contains('choix_gauche'));
      expect(sfxOf(s, s.pending!), isNot(contains('choix_droite')));
    });

    test('S4 · une jauge au bord du gouffre allume `jauge_danger`', () {
      final engine = Engine(_synth());
      final s = engine.start(2024);
      expect(sfxOf(s, s.pending!), isNot(contains('jauge_danger')));
      final t = s.clone()..gauges['direction'] = 12;
      expect(sfxOf(t, t.pending!), contains('jauge_danger'));
      final u = s.clone()..gauges['tribunes'] = 92;
      expect(sfxOf(u, u.pending!), contains('jauge_danger'));
    });
  });
}
