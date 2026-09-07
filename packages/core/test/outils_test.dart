/// Les outils de transcription de la bible (spec variété §1.5, §1.10, §1.12,
/// §1.13, §2.5, §2.7) : Nouvelles datées, personnages à état (âge, statut,
/// `statut_ok`), changement de club sans changement de rôle, set-pieces
/// auteurisables, chargeurs par dossier.
library;

import 'dart:io';

import 'package:fusible_core/fusible_core.dart';
import 'package:test/test.dart';

List<Object> _flag(String f) => ['call', 'flag', [['lit', f]]];
List<Object> _cmp(String op, Object left, Object v) => ['cmp', op, left, ['lit', v]];

Map<String, dynamic> _card(
  String id, {
  String? speaker,
  String kind = 'routine',
  String arc = 'divers',
  bool once = false,
  int? year,
  List<String> statutOk = const [],
  Map<String, dynamic>? left,
  Map<String, dynamic>? right,
  String? text,
}) =>
    {
      'id': id,
      'roles': ['entraineur'],
      'arc': arc,
      'tags': const <String>[],
      if (speaker != null) 'speaker': speaker,
      'weight': 1.0,
      'once': once,
      'cooldown': 12,
      'priority': 0,
      'sablier': false,
      'text': text ?? 'Texte de $id.',
      'left': {'label': 'Gauche', 'effects': left ?? {}},
      'right': {'label': 'Droite', 'effects': right ?? {}},
      'tone': 'leger',
      'kind': kind,
      'pool': kind == 'routine',
      if (year != null) 'year': year,
      if (statutOk.isNotEmpty) 'statut_ok': statutOk,
    };

Content _synth({
  List<Map<String, dynamic>> cards = const [],
  Map<String, dynamic>? setpieces,
  List<String> postulatFlags = const [],
  List<Map<String, dynamic>>? characters,
}) {
  const speakers = ['josiane', 'vukic', 'brehaut', 'meneche'];
  final allCards = <Map<String, dynamic>>[
    for (var i = 0; i < 40; i++) _card('r.f$i', speaker: speakers[i % 4]),
    _card('tr.nouvelles_du_passe', kind: 'passe', text: 'Des nouvelles de {passe_titre}.'),
    ...cards,
  ];
  const endingIds = ['en_bus', 'en_copain', 'en_banderole', 'en_otage', 'en_sms', 'en_placard', 'en_decoupe', 'en_coupable', 'generique', 'grand_deballage'];
  return Content.fromJson(<String, dynamic>{
    'version': 2,
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
    'cards': allCards,
    'endings': [for (final id in endingIds) {'id': id, 'title': id, 'epitaph': ''}],
    'feats': const [],
    'calendar': {
      'entraineur': [
        {'phase': 'presaison', 'beats': ['objective', 'card', 'card', 'card']},
        {'phase': 'aller', 'beats': ['card', 'card', 'match', 'card', 'card', 'match', 'card', 'card', 'match']},
        {'phase': 'hiver', 'beats': ['card', 'card', 'card']},
        {'phase': 'retour', 'beats': ['card', 'card', 'match', 'cup', 'card', 'card', 'match', 'card', 'match']},
        {'phase': 'sprint', 'beats': ['gm_annonce', 'gm_te', 'gm_te', 'gm_te', 'aftermatch']},
        {'phase': 'bilan', 'beats': ['bilan_une', 'bilan_verdict', 'bilan_contrat', 'bilan_carrefour']},
      ],
    },
    'names': {
      'prenoms_f': ['Anne'],
      'prenoms_m': ['Jean'],
      'noms': ['Durand'],
      'club_prefixes': ['FC', 'AS'],
      'villes': ['Valmont', 'Portclair', 'Néville'],
    },
    'divisions': const {},
    'characters': characters ??
        [
          {'id': 'josiane', 'name': 'Madame Josiane', 'genre': 'f', 'age': 52, 'statut': 'present'},
          {'id': 'vukic', 'name': 'Zoran Vukić', 'age': 37, 'statut': 'present'},
          {'id': 'brehaut', 'name': 'Titi Bréhaut', 'age': 33, 'statut': 'present'},
          {'id': 'meneche', 'name': 'Pierre Ménèche', 'age': 42, 'statut': 'present'},
          {'id': 'aulard', 'name': 'Jean-Marie Aulard', 'age': 58, 'statut': 'present'},
          {
            'id': 'gege',
            'name': 'Gégé',
            'age': 47,
            'statut': 'present',
            'retrouvailles': {'sourire': 'ret.gege_sourire', 'noir': 'ret.gege_noir'},
          },
          {
            'id': 'vecchio',
            'name': 'Gigi Vecchio',
            'age': 41,
            'statut': 'present',
            'retrouvailles': {'sourire': 'ret.vecchio_sourire', 'noir': 'ret.vecchio_noir'},
          },
          {'id': 'mbako', 'name': 'Lian Mbako', 'age': 16, 'statut': 'present'},
          {'id': 'sansage', 'name': 'La voix'},
        ],
    'arcs': [
      {
        'id': 'a.same',
        'title': 'L\'intrigue du club',
        'kind': 'serie',
        'roles': ['entraineur'],
        'foreground': true,
        'same_club': true,
        'epilogue': {'journal': 'On a laissé l\'histoire derrière nous.'},
        'steps': [
          {'id': 's1', 'card': 'et.same', 'season': '0', 'next': const []},
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
        'gauges': {'vestiaire': 50, 'tribunes': 60, 'direction': 50, 'caisse': 70},
        'force': 50,
        'objective': 'maintien',
        'president': 'aulard',
        'flags': postulatFlags,
      },
    ],
    'alarms': const {},
    'director': const {},
    'journal_templates': const {
      'club_change': '{annee} · {prenom} {nom} signe à {club}.',
      'transition': '{annee} · {prenom} {nom} change de côté.',
    },
    if (setpieces != null) 'setpieces': setpieces,
  });
}

/// Sert `card` au tirage courant (comme `_atScript` des autres suites).
GameState _at(Engine e, int seed, String card, {String kind = 'script', String? arc, String? step}) {
  var s = e.start(seed);
  s = e.choose(s, true); // la Carte Objectif, puis la première carte narrative
  e.director.enqueue(s, Scheduled(card: card, kind: kind, arc: arc, step: step, dueN: s.ncards + 1, deadlineN: s.ncards + 1));
  s.pending = e.director.drawNarrative(s, 'presaison', Rng(1));
  expect(s.pending!.id, card);
  return s;
}

String _repoRoot() {
  var dir = Directory.current;
  for (var i = 0; i < 6; i++) {
    if (File('${dir.path}/content/build/content.json').existsSync()) return dir.path;
    final parent = dir.parent;
    if (parent.path == dir.path) break;
    dir = parent;
  }
  throw StateError('dépôt introuvable (content/build/content.json)');
}

Future<void> _copyContent(String root, Directory to) async {
  Future<void> copy(Directory from, Directory dest) async {
    dest.createSync(recursive: true);
    for (final e in from.listSync()) {
      final name = e.path.split('/').last;
      if (e is Directory) {
        if (name == 'build') continue;
        await copy(e, Directory('${dest.path}/$name'));
      } else if (e is File) {
        e.copySync('${dest.path}/$name');
      }
    }
  }

  await copy(Directory('$root/content'), Directory('${to.path}/content'));
}

void main() {
  group('C · personnages à état', () {
    test('C1 · âge posé au départ, +1 par saison, lisible en `when` et en texte', () {
      final e = Engine(_synth(cards: [_card('r.age', speaker: 'vecchio', text: 'Gigi : « J\'ai {age_vecchio} ans. »')]));
      final s = e.start(3);
      expect(s.chars['vecchio']!.age, 41);
      expect(s.chars['mbako']!.age, 16);
      expect(s.chars['mbako']!.statut, 'present');
      expect(s.chars.containsKey('sansage'), isFalse, reason: 'un personnage sans `age` n\'a pas d\'état');
      final c = EvalContext(s, 'presaison');
      expect(evalWhen(_cmp('>=', ['path', 'chars.vecchio.age'], 41), c), isTrue);
      expect(evalWhen(_cmp('==', ['path', 'chars.mbako.statut'], 'present'), c), isTrue);
      expect(evalWhen(_cmp('==', ['path', 'chars.inconnu.statut'], 'present'), c), isTrue, reason: 'défaut pour un inconnu');
      expect(formatText('J\'ai {age_vecchio} ans.', s), 'J\'ai 41 ans.');
      // Trois ouvertures de saison : Gigi a 44 ans en 1993 (spec variété §1.10).
      for (var k = 1; k <= 3; k++) {
        s.season = k;
        s.year = 1990 + k;
        e.director.openSeason(s, Rng(k));
      }
      expect(s.chars['vecchio']!.age, 44);
      expect(s.chars['mbako']!.age, 19);
      expect(formatText('J\'ai {age_vecchio} ans.', s), 'J\'ai 44 ans.');
    });

    test('C2 · un locuteur parti ne parle plus, sauf `statut_ok` ; la file est purgée', () {
      final e = Engine(_synth(cards: [
        _card('r.vecchio', speaker: 'vecchio'),
        _card('r.vecchio_tel', speaker: 'vecchio', statutOk: ['parti']),
        _card('et.vendre', kind: 'etape', left: {'char': {'vecchio': {'statut': 'parti'}}}, right: {'char': {'vecchio': {'statut': 'parti', 'age': '+1'}}}),
      ]));
      var s = _at(e, 5, 'et.vendre');
      expect(e.director.speakerOk(s, e.content.cards['r.vecchio']), isTrue);
      // Une entrée déjà armée pour Gigi, qu'un swipe va rendre muette.
      e.director.enqueue(s, Scheduled(card: 'r.vecchio', kind: 'chaine', dueN: s.ncards + 2, deadlineN: s.ncards + 4));
      s = e.choose(s, false); // gauche : Gigi part
      expect(s.chars['vecchio']!.statut, 'parti');
      expect(s.chars['vecchio']!.age, 41, reason: 'le côté gauche ne touche pas l\'âge');
      expect(e.director.speakerOk(s, e.content.cards['r.vecchio']), isFalse);
      expect(e.director.speakerOk(s, e.content.cards['r.vecchio_tel']), isTrue, reason: 'statut_ok: [parti]');
      // Le tirage suivant purge l'entrée devenue muette.
      expect(s.stats['miss_statut'], 1);
      expect(s.scheduled.any((sc) => sc.card == 'r.vecchio'), isFalse);
      // Et le sac ne sert plus jamais sa carte.
      final ctx = EvalContext(s, 'aller');
      for (var i = 0; i < 40; i++) {
        final card = e.director.pickPool(s, 'aller', ctx, Rng(i));
        expect(card?.id, isNot('r.vecchio'));
      }
      // `age: "+1"` déplace l'âge (l'autre côté de la même carte).
      var s2 = _at(e, 5, 'et.vendre');
      s2 = e.choose(s2, true);
      expect(s2.chars['vecchio']!.age, 42);
    });
  });

  group('B · changement de club sans changement de rôle', () {
    test('C3 · club: {change: true, division: 2} : club, ville, jauges, réaction, journal, retrouvailles', () {
      final e = Engine(_synth(cards: [
        _card('et.transfert', kind: 'etape', left: {'club': {'change': true, 'division': 2}}),
        _card('et.same', kind: 'etape', arc: 'a.same'),
        _card('ret.gege_sourire', kind: 'chaine', speaker: 'gege', once: true),
        _card('ret.gege_noir', kind: 'chaine', speaker: 'gege', once: true),
        _card('ret.vecchio_sourire', kind: 'chaine', speaker: 'vecchio', once: true),
        _card('ret.vecchio_noir', kind: 'chaine', speaker: 'vecchio', once: true),
        _card('re.quelquun', kind: 'reaction', speaker: 'josiane'),
      ]));
      var s = _at(e, 11, 'et.transfert');
      s.relations['gege'] = 2;
      s.relations['vecchio'] = -3;
      s.relations['brehaut'] = 1;
      s.reaction = const ReactionRef(card: 're.quelquun');
      s.alarmFired.add('tribunes:low');
      s.gauges['tribunes'] = 80;
      s.gauges['caisse'] = 64;
      final rngBefore = s.rngState;
      final clubSeq = s.clubSeq;
      // Une étape du club en cours : elle deviendra une « Nouvelle du passé ».
      final clubAvant = s.entities.named['club'];
      s = e.choose(s, false);
      // Le changement est DIFFÉRÉ au Carrefour : la saison en cours garde son
      // club, son classement et sa réaction (la Une de mai nomme le club de mai).
      expect(s.clubSeq, clubSeq, reason: 'le club ne change pas au créneau de la vente');
      expect(s.entities.named['club'], clubAvant);
      expect(s.pending!.id, 're.quelquun', reason: 'la réaction suit le joueur qui part : elle est servie, pas jetée');
      expect(s.vars['_club_pending'], 1);
      // Le coût du départ, lui, tombe tout de suite (spec variété §1.11).
      expect(s.gauges['vestiaire'], 50);
      expect(s.gauges['direction'], 55);
      expect(s.gauges['tribunes'], 64, reason: '40 + 0,3 × 80');
      expect(s.gauges['caisse'], 64, reason: 'la caisse suit le joueur');
      expect(s.alarmFired, isEmpty);
      // On joue la saison jusqu'au Carrefour, où l'on arme une étape du club
      // qu'on quitte : c'est le changement différé qui la dégradera.
      final saison = s.season;
      for (var k = 0; k < 120 && s.pending!.kind != 'bilan_carrefour' && !s.over; k++) {
        s = e.choose(s, false);
      }
      expect(s.pending!.kind, 'bilan_carrefour');
      e.director.enqueue(s, Scheduled(card: 'et.same', kind: 'etape', arc: 'a.same', step: 's1', dueN: s.ncards + 6, deadlineN: s.ncards + 9, fallback: 'nouvelles'));
      for (var k = 0; k < 120 && (s.season == saison || (s.vars['_club_pending'] ?? 0) == 1) && !s.over; k++) {
        s = e.choose(s, false);
      }
      expect(s.season, saison + 1);
      expect(s.clubSeq, clubSeq + 1);
      expect(s.entities.named['club'], isNotEmpty);
      expect(s.entities.named['clubShort'], s.entities.named['club']!.split(' ').last);
      expect(s.entities.named['ville'], isNotEmpty);
      expect(s.rngState, isNot(rngBefore), reason: 'force, club ×2 et ville sont retirés');
      expect(s.world.division, 2);
      expect(s.vars.containsKey('_club_pending'), isFalse);
      final ligne = s.journal.firstWhere((j) => j.kind == 'transition');
      expect(ligne.text, contains('signe à'));
      expect(ligne.tags, contains('club'));
      // Retrouvailles : les deux visages à |relation| maximale, en [2, 6].
      final retro = s.scheduled.where((sc) => sc.payload['retrouvailles'] == true).toList();
      expect(retro.map((sc) => sc.card).toSet(), {'ret.vecchio_noir', 'ret.gege_sourire'});
      for (final sc in retro) {
        expect(sc.deadlineN - sc.dueN, 4);
        expect(sc.sameClub, isFalse);
      }
      // L'étape de l'ancien club dégrade en « Nouvelles du passé » au premier
      // tirage narratif de la nouvelle saison (c'est là que la file est purgée).
      for (var k = 0; k < 4 && (s.stats['miss_club'] ?? 0) == 0 && !s.over; k++) {
        s = e.choose(s, false);
      }
      expect(s.stats['miss_club'], 1);
      expect(s.journal.any((j) => j.text.contains('laissé l\'histoire')), isTrue);
    });
  });

  group('S · set-pieces auteurisables', () {
    Map<String, dynamic> spDef() => {
          'objective': [
            {
              'when': _flag('descente'),
              'text': 'Après la descente, {patron} : « {objectif_min} ? »',
              'left': 'Je signe quand même',
              'right': 'Je ne signe rien',
              'answer_left': 'Tu signes.',
            },
            {'roles': ['joueur'], 'text': 'Jamais servi ici.'},
            {'text': 'Secours : {objectif_min}.'},
          ],
          'cup': [
            {'text': 'Tour de Coupe, {tour}e tour.', 'left': 'On y va'},
          ],
        };

    test('S1 · la première variante vraie gagne, le secours sinon ; zéro Rng', () {
      final e = Engine(_synth(setpieces: spDef()));
      final s = e.start(9);
      expect(s.pending!.kind, 'objective');
      expect(s.pending!.text, 'Secours : le maintien.');
      expect(s.pending!.payload['setpiece'], 'objective');
      expect(s.pending!.payload['setpiece_secours'], isTrue);
      expect(s.pending!.payload['setpiece_variante'], 2);
      expect(s.pending!.leftLabel, 'Je m\'engage', reason: 'le secours ne redéfinit pas les libellés');

      final e2 = Engine(_synth(setpieces: spDef(), postulatFlags: ['descente']));
      final s2 = e2.start(9);
      expect(s2.pending!.text, startsWith('Après la descente'));
      expect(s2.pending!.payload['setpiece_secours'], isFalse);
      expect(s2.pending!.payload['setpiece_variante'], 0);
      expect(s2.pending!.leftLabel, 'Je signe quand même');
      expect(s2.pending!.rightLabel, 'Je ne signe rien');
      expect(s2.pending!.payload['answerLeft'], 'Tu signes.');
      // Le choix d'une variante ne consomme aucun aléa (spec variété §1.12).
      expect(s2.rngState, s.rngState);
    });

    test('S2 · sans set-pieces, le texte historique en dur est servi', () {
      final e = Engine(_synth());
      final s = e.start(9);
      expect(s.pending!.text, contains('Cette saison, l\'objectif c\'est le maintien'));
      expect(s.pending!.payload['setpiece_secours'], isTrue);
      expect(s.pending!.payload['setpiece_variante'], -1);
    });
  });

  group('N · Nouvelles datées', () {
    Content nvContent() => _synth(cards: [
          _card('nv.1990', arc: 'nouvelle', kind: 'nouvelle', once: true, year: 1990),
          _card('nv.1995', arc: 'nouvelle', kind: 'nouvelle', once: true, year: 1995),
          _card('nv.toujours', arc: 'nouvelle', kind: 'nouvelle'),
        ]);

    test('N1 · une datée de l\'année passe avant l\'intemporelle, puis sort du tirage', () {
      final e = Engine(nvContent());
      final s = e.start(4);
      final ctx = EvalContext(s, 'aller');
      expect(e.director.pickNouvelle(s, ctx, Rng(1))?.id, 'nv.1990');
      // Servie : la liste datée est vide, l'intemporelle reprend la main.
      s.seenCount['nv.1990'] = 1;
      s.cooldowns['nv.1990'] = s.ncards;
      expect(e.director.pickNouvelle(s, ctx, Rng(1))?.id, 'nv.toujours');
      // Deux ans plus tard, 1995 n'est toujours pas ouverte.
      s.year = 1992;
      expect(e.director.pickNouvelle(s, EvalContext(s, 'aller'), Rng(1))?.id, 'nv.toujours');
      // La saison 1994 (août 1994 → juin 1995) ouvre la fenêtre de nv.1995.
      s.year = 1994;
      expect(e.director.pickNouvelle(s, EvalContext(s, 'aller'), Rng(1))?.id, 'nv.1995');
      s.year = 1995;
      expect(e.director.pickNouvelle(s, EvalContext(s, 'aller'), Rng(1))?.id, 'nv.1995');
    });

    test('N2 · une datée jamais servie dans ses deux ans est comptée perdue, une seule fois', () {
      final e = Engine(nvContent());
      final s = e.start(4);
      s.season = 1;
      s.year = 1991; // la fenêtre de nv.1990 (saisons 1989 et 1990) vient de se fermer
      e.director.openSeason(s, Rng(1));
      expect(s.stats['nouvelle_datee_perdue'], 1);
      s.season = 2;
      e.director.openSeason(s, Rng(1));
      expect(s.stats['nouvelle_datee_perdue'], 1, reason: 'comptée l\'année de la fermeture, pas ensuite');
      s.season = 3;
      s.year = 1996;
      e.director.openSeason(s, Rng(1));
      expect(s.stats['nouvelle_datee_perdue'], 2, reason: 'nv.1995 à son tour');
    });
  });

  group('D · chargeurs par dossier', () {
    test('D1 · content/unes/*.yaml et content/endings/*.yaml sont chargés ; un id en double casse le build', () async {
      final root = _repoRoot();
      final tmp = Directory('${Directory.systemTemp.path}/fusible_dossiers_${DateTime.now().microsecondsSinceEpoch}')..createSync(recursive: true);
      try {
        await _copyContent(root, tmp);
        File('${tmp.path}/content/unes/lot_test.yaml').writeAsStringSync('''
unes:
  - id: une.test.dossier
    journal: quotidien
    priority: 2
    when: "season >= 99"
    titre: "UNE MANCHETTE DE DOSSIER"
    sous: "Écrite dans content/unes/lot_test.yaml."
''');
        File('${tmp.path}/content/endings/lot_test.yaml').writeAsStringSync('''
endings:
  - id: fin_test_dossier
    title: "La fin de dossier"
    epitaph: "Écrite dans content/endings/lot_test.yaml."
''');
        final ok = await Process.run('dart', ['$root/packages/tools/bin/build_content.dart'], workingDirectory: tmp.path);
        expect(ok.exitCode, 0, reason: 'stdout: ${ok.stdout}\nstderr: ${ok.stderr}');
        final bundle = File('${tmp.path}/content/build/content.json').readAsStringSync();
        expect(bundle, contains('une.test.dossier'));
        expect(bundle, contains('fin_test_dossier'));

        // Le même id dans deux fichiers : erreur nommée.
        File('${tmp.path}/content/unes/doublon.yaml').writeAsStringSync('''
unes:
  - id: une.test.dossier
    journal: quotidien
    priority: 2
    when: "season >= 99"
    titre: "LA MÊME, AILLEURS"
    sous: "Deux salles, un id."
''');
        final ko = await Process.run('dart', ['$root/packages/tools/bin/build_content.dart'], workingDirectory: tmp.path);
        expect(ko.exitCode, 1);
        expect(ko.stderr.toString(), contains('déjà déclarée'));
      } finally {
        tmp.deleteSync(recursive: true);
      }
    }, timeout: const Timeout(Duration(minutes: 3)));

    test('D2 · content/arcs/** et content/cards/** sont lus récursivement', () {
      final root = _repoRoot();
      final bundle = File('$root/content/build/content.json').readAsStringSync();
      final content = loadContentFromJson(bundle);
      // Les arcs et les cartes du dépôt vivent dans des sous-dossiers par rôle.
      expect(content.arcs.containsKey('en.kop_qui_aime_trop'), isTrue, reason: 'content/arcs/entraineur/kop.yaml');
      expect(content.cards.containsKey('en.kop.local'), isTrue, reason: 'content/cards/entraineur/arc_kop.yaml');
      expect(Directory('$root/content/arcs/joueur').existsSync(), isTrue);
      expect(Directory('$root/content/cards/joueur').existsSync(), isTrue);
      expect(File('$root/content/unes/README.md').existsSync(), isTrue);
      expect(File('$root/content/endings/README.md').existsSync(), isTrue);
    });
  });
}
