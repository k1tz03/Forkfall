/// Tests du tirage de saison (spec variété §1.2-1.3, §3.9) : programme,
/// fenêtres tirées, réserve, fil rouge, rejouabilité, rituels, `once` interdit
/// sur une étape rejouable (tests P1-P5, R1-R3).
library;

import 'dart:convert';
import 'dart:io';

import 'package:fusible_core/fusible_core.dart';
import 'package:test/test.dart';

List<Object> _call(String name, Object arg) => ['call', name, [['lit', arg]]];
List<Object> _ge(Object left, num v) => ['cmp', '>=', left, ['lit', v]];

Map<String, dynamic> _card(String id, {String? speaker, String kind = 'etape', String arc = 'divers', Map<String, dynamic>? left, Map<String, dynamic>? right}) => {
      'id': id,
      'roles': ['entraineur'],
      'arc': arc,
      'tags': const <String>[],
      if (speaker != null) 'speaker': speaker,
      'weight': 1.0,
      'once': false,
      'cooldown': 12,
      'priority': 0,
      'sablier': false,
      'text': 'Texte de $id.',
      'left': {'label': 'Gauche', 'effects': left ?? {}},
      'right': {'label': 'Droite', 'effects': right ?? {}},
      'tone': 'leger',
      'kind': kind,
      'pool': kind == 'routine',
    };

/// Une série de 2 étapes : `<id>.s1` (variantes « encore » si `encore`) puis
/// `<id>.s2` dans [2, 4].
Map<String, dynamic> _serie(
  String id, {
  required String carrier,
  required String theme,
  Object? replay,
  bool everySeason = false,
  bool encore = false,
  List<String> issues = const [],
  String? outcome2,
  int minSeason = 0,
  Object? when,
}) =>
    {
      'id': id,
      'title': 'Intrigue $id',
      'kind': 'serie',
      'roles': ['entraineur'],
      'foreground': true,
      'weight': 1.0,
      'theme': theme,
      'carrier': carrier,
      'cast': [carrier],
      if (replay != null) 'replay': replay,
      'every_season': everySeason,
      'min_season': minSeason,
      if (when != null) 'when': when,
      'issues': issues,
      'start': [2, 5],
      'steps': [
        {
          'id': 's1',
          'card': encore
              ? [
                  {'id': '$id.s1_encore', 'if': _ge(_call('plays', id), 1)},
                  {'id': '$id.s1'},
                ]
              : '$id.s1',
          'season': '0',
          'next': [
            {'step': 's2', 'in': [2, 4]}
          ],
        },
        {
          'id': 's2',
          'card': '$id.s2',
          'season': '0',
          if (outcome2 != null) 'outcome': outcome2,
          'next': const [],
        },
      ],
    };

List<Map<String, dynamic>> _serieCards(String id, String carrier, {bool encore = false}) => [
      _card('$id.s1', speaker: carrier),
      _card('$id.s2', speaker: carrier),
      if (encore) _card('$id.s1_encore', speaker: carrier),
    ];

Content _synth({
  required List<Map<String, dynamic>> arcs,
  required List<Map<String, dynamic>> cards,
  Map<String, dynamic>? programme,
  List<Map<String, dynamic>> questions = const [],
  List<Map<String, dynamic>> objectifs = const [],
  Map<String, dynamic>? director,
}) {
  const speakers = ['josiane', 'vukic', 'brehaut', 'meneche'];
  final allCards = <Map<String, dynamic>>[
    for (var i = 0; i < 40; i++) _card('r.f$i', speaker: speakers[i % 4], kind: 'routine'),
    ...cards,
  ];
  const endingIds = ['en_bus', 'en_copain', 'en_banderole', 'en_otage', 'en_sms', 'en_placard', 'en_decoupe', 'en_coupable', 'generique', 'grand_deballage'];
  final j = <String, dynamic>{
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
      'club_prefixes': ['FC'],
      'villes': ['Valmont'],
    },
    'divisions': const {},
    'characters': [
      {'id': 'josiane', 'name': 'Madame Josiane', 'genre': 'f'},
      {'id': 'vukic', 'name': 'Zoran Vukić'},
      {'id': 'brehaut', 'name': 'Titi Bréhaut'},
      {'id': 'meneche', 'name': 'Pierre Ménèche'},
      {'id': 'aulard', 'name': 'Jean-Marie Aulard'},
      {'id': 'gege', 'name': 'Gégé'},
      {'id': 'vecchio', 'name': 'Gigi Vecchio'},
      {'id': 'nassir', 'name': 'Cheikh Nassir'},
      {'id': 'mbako', 'name': 'Lian Mbako'},
    ],
    'arcs': arcs,
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
        if (programme != null) 'programme': programme,
        'questions': questions,
        'objectifs': objectifs,
      },
    ],
    'alarms': const {},
    'director': director ?? const {},
  };
  return Content.fromJson(j);
}

/// Cinq intrigues à porteurs et thèmes distincts + une sixième qui partage le
/// porteur de la première (jamais ensemble).
List<Map<String, dynamic>> _fiveArcs() => [
      _serie('a.kop', carrier: 'gege', theme: 'tribune', replay: {'after': 2, 'max': 2}, encore: true, issues: ['pacte', 'bache'], outcome2: 'pacte'),
      _serie('a.prodige', carrier: 'mbako', theme: 'mercato'),
      _serie('a.gardien', carrier: 'vecchio', theme: 'vestiaire', replay: 'ritual', encore: true),
      _serie('a.nassir', carrier: 'nassir', theme: 'argent'),
      _serie('a.cote', carrier: 'meneche', theme: 'presse'),
      _serie('a.derby', carrier: 'gege', theme: 'absurde'),
    ];

List<Map<String, dynamic>> _fiveCards() => [
      ..._serieCards('a.kop', 'gege', encore: true),
      ..._serieCards('a.prodige', 'mbako'),
      ..._serieCards('a.gardien', 'vecchio', encore: true),
      ..._serieCards('a.nassir', 'nassir'),
      ..._serieCards('a.cote', 'meneche'),
      ..._serieCards('a.derby', 'gege'),
    ];

Map<String, dynamic> _programme({int prendre = 3, List<int> fenetre = const [2, 9], int reserve = 1, bool signature = true}) => {
      '0': {
        'prendre': prendre,
        'fenetre': fenetre,
        'reserve': reserve,
        'pool': [
          {'arc': 'a.kop', 'poids': 1.2, 'signature': signature},
          {'arc': 'a.prodige', 'poids': 1.3},
          {'arc': 'a.gardien', 'poids': 1.2},
          {'arc': 'a.nassir', 'poids': 1.2},
          {'arc': 'a.cote', 'poids': 1.0},
          {'arc': 'a.derby', 'poids': 1.0},
        ],
      },
      '1': {
        'prendre': 3,
        'fenetre': [2, 10],
        'reserve': 1,
        'reprise': true,
        'pool': [
          {'arc': 'a.cote', 'poids': 1.0},
        ],
      },
      '2+': {
        'prendre': 3,
        'fenetre': [1, 11],
        'reserve': 1,
        'reprise': true,
        'pool': [
          {'arc': 'a.gardien', 'poids': 0.8},
          {'arc': 'a.kop', 'poids': 0.6},
        ],
      },
    };

const _questions = [
  {'id': 'tribune', 'poids': 1.0},
  {'id': 'president', 'poids': 1.0},
  {'id': 'argent', 'poids': 1.0},
];

/// Ouvre la saison sur un état neuf : `start` fait déjà `openSeason(s, rng)`
/// au premier tirage (beat 0 = Objectif).
GameState _opened(Engine e, int seed) => e.start(seed);

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

void main() {
  group('P · programme', () {
    final content = _synth(arcs: _fiveArcs(), cards: _fiveCards(), programme: _programme(), questions: _questions);
    final engine = Engine(content);

    test('P1 · trois intrigues prises, porteurs et thèmes distincts, ouvertures à ≥ 3 slots, réserve triée, fil rouge posé', () {
      for (var seed = 1; seed <= 30; seed++) {
        final s = _opened(engine, seed);
        final armed = s.arcs.keys.where((id) => content.arcs[id]!.kind == 'serie').toList()..sort();
        expect(armed.length, 3, reason: 'seed $seed');
        final carriers = armed.map((id) => content.arcs[id]!.carrierId).toSet();
        final themes = armed.map((id) => content.arcs[id]!.themeId).toSet();
        expect(carriers.length, 3, reason: 'porteurs distincts (seed $seed)');
        expect(themes.length, 3, reason: 'thèmes distincts (seed $seed)');
        expect(s.openingSlots.length, 3);
        final slots = List.of(s.openingSlots)..sort();
        for (var i = 1; i < slots.length; i++) {
          expect(slots[i] - slots[i - 1], greaterThanOrEqualTo(3), reason: 'ouvertures trop proches (seed $seed) $slots');
        }
        for (final u in slots) {
          expect(u, inInclusiveRange(2, 12));
        }
        // Chaque intrigue est en file à son slot, échéance +2.
        for (final id in armed) {
          final sc = s.scheduled.firstWhere((e) => e.arc == id);
          expect(s.openingSlots, contains(sc.dueN - s.seasonStartN));
          expect(sc.deadlineN - sc.dueN, 2);
        }
        // Réserve : un id, éligible, hors des prises ; triée.
        expect(s.reserve.length, 1);
        expect(armed, isNot(contains(s.reserve.first)));
        expect(List.of(s.reserve)..sort(), s.reserve);
        // Fil rouge.
        expect(s.entities.named['fil_rouge'], isIn(['tribune', 'president', 'argent']));
        expect(s.vars['fil_rouge_i'], inInclusiveRange(0, 2));
        expect(EvalContext(s, 'presaison'), isNotNull);
        expect(evalWhen(['cmp', '==', ['path', 'fil_rouge'], ['lit', s.entities.named['fil_rouge']]], EvalContext(s, 'presaison')), isTrue);
        // Les thèmes ouverts sont notés, triés.
        expect(s.themesPlayed, List.of(themes)..sort());
      }
    });

    test('P2 · même graine ⇒ même programme ; 10 graines ⇒ ≥ 4 programmes distincts', () {
      final seen = <String>{};
      for (var seed = 1; seed <= 10; seed++) {
        final a = _opened(engine, seed);
        final b = _opened(engine, seed);
        expect(a.fingerprint(), b.fingerprint());
        expect(a.openingSlots, b.openingSlots);
        expect(a.reserve, b.reserve);
        final prog = [
          for (final sc in List.of(a.scheduled)..sort((x, y) => x.dueN.compareTo(y.dueN)))
            if (sc.arc != null && content.arcs[sc.arc]!.kind == 'serie') '${sc.arc}@${sc.dueN}'
        ].join(',');
        seen.add('$prog|${a.entities.named['fil_rouge']}');
      }
      expect(seen.length, greaterThanOrEqualTo(4));
    });

    test('P2 bis · inventaire Rng : ≤ prendre weightedIndex + ≤ prendre nextInt + 1 weightedIndex (fil rouge)', () {
      // Même contenu sans programme : `start` consomme la même chose jusqu'à
      // l'ouverture de saison ; avec le programme, l'ouverture consomme
      // exactement 3 + 3 + 1 appels quand trois intrigues sont prises.
      final old = Engine(_synth(arcs: _fiveArcs(), cards: _fiveCards()));
      for (final seed in [5, 6, 7]) {
        final base = old.start(seed).rngState;
        final s = _opened(engine, seed);
        expect(s.arcs.length, 3);
        final rng = Rng.fromState(base);
        for (var i = 0; i < 7; i++) {
          rng.next();
        }
        expect(s.rngState, rng.state, reason: 'le tirage de saison consomme 7 appels (3 + 3 + 1), seed $seed');
      }
    });

    test('P3 · freeSlot : collisions avec les ancres à slot unique et entre ouvertures', () {
      // Slot 2 tiré, ancre au slot 1 : on avance jusqu'à 4.
      expect(freeSlot(2, [1], [2, 9]), 4);
      // Libre : inchangé.
      expect(freeSlot(6, [1], [2, 9]), 6);
      // Deux ouvertures : 5 pris → 6, 7 collent → 8.
      expect(freeSlot(6, [1, 5], [2, 9]), 8);
      // Plafond : 16 et 17 sont des ancres, la fenêtre [2,9] plafonne à 12 ; 11 collide avec rien.
      expect(freeSlot(9, [1, 4, 7, 16, 17], [2, 9]), 10);
      // Tout est pris jusqu'au plafond : on repart du plafond et on recule.
      expect(freeSlot(9, [1, 4, 7, 10, 13, 16, 17], [2, 9]), 9, reason: 'aucun slot libre : u tel quel');
      // Une fenêtre haute reste bornée à 15 : 14 et 15 collent à l'ancre 16, on recule à 13.
      expect(freeSlot(14, [16, 17], [1, 14]), 13);
      expect(freeSlot(15, [14, 16, 17], [1, 14]), 11);
    });

    test('P4 · reprise : une entrée de "0" non tirée est candidate en "1"', () {
      // Bucket "1" ne liste que a.cote, mais `reprise` reprend "0".
      final s = _opened(engine, 3);
      final takenS0 = s.arcs.keys.toSet();
      // Ferme toutes les intrigues de S0 et passe en saison 1.
      for (final id in takenS0) {
        engine.director.arcDone(s, id);
      }
      s.scheduled.removeWhere((e) => e.arc != null);
      s.season = 1;
      s.beat = 0;
      s.reserve = [];
      engine.director.openSeason(s, Rng(11));
      final armed = s.arcs.entries.where((e) => e.value.status == 'armed').map((e) => e.key).toList()..sort();
      // Le bucket "1" ne liste qu'une intrigue (parfois déjà jouée) : les
      // autres prises viennent de la reprise de "0" (au moins deux candidates
      // libres, sauf conflit de porteur kop/derby).
      expect(armed.length, greaterThanOrEqualTo(2));
      final fromZero = armed.where((id) => id != 'a.cote').toList();
      expect(fromZero, isNotEmpty, reason: 'des entrées de "0" reprises en "1"');
      for (final id in fromZero) {
        expect(takenS0, isNot(contains(id)), reason: 'jouée en S0 sans replay : pas rejouable');
      }
    });

    test('P5 · signature : ×3 en S0 seulement, au plus une par tirage', () {
      // En S0 le kop (signature ×3) est pris bien plus souvent qu'un poids 1,2 ne le voudrait.
      int kopS0 = 0, kopS1 = 0;
      for (var seed = 1; seed <= 60; seed++) {
        final s = _opened(engine, seed);
        if (s.arcs.containsKey('a.kop')) kopS0++;
        // Même tirage en saison 1 (état vierge, saison forcée) : sans le ×3.
        final t = engine.start(seed);
        t.arcs.clear();
        t.scheduled.clear();
        t.openingSlots = [];
        t.reserve = [];
        t.themesPlayed = [];
        t.season = 1;
        engine.director.openSeason(t, Rng(seed));
        if (t.arcs.containsKey('a.kop')) kopS1++;
      }
      expect(kopS0, greaterThan(kopS1));
      expect(kopS0 / 60, greaterThanOrEqualTo(0.7));
    });

    test('P6 · sans programme, 0 appel Rng à l\'ouverture et l\'ancien chemin est conservé', () {
      final old = _synth(arcs: _fiveArcs(), cards: _fiveCards());
      final e2 = Engine(old);
      final s = e2.start(9);
      expect(s.openingSlots, isEmpty);
      expect(s.reserve, isEmpty);
      expect(s.entities.named['fil_rouge'], isNull);
      // Une ouverture de saison sans programme ne touche pas au Rng.
      final rng = Rng(9);
      s.scheduled.clear();
      s.arcs.clear();
      e2.director.openSeason(s, rng);
      expect(rng.state, Rng(9).state);
      // Avec un programme, elle le consomme.
      final t = _opened(engine, 9);
      t.scheduled.clear();
      t.arcs.clear();
      final rng2 = Rng(9);
      engine.director.openSeason(t, rng2);
      expect(rng2.state, isNot(Rng(9).state));
    });
  });

  group('R · rejouabilité', () {
    final content = _synth(arcs: _fiveArcs(), cards: _fiveCards(), programme: _programme(), questions: _questions);
    final engine = Engine(content);

    test('R1 · replay {after: 2, max: 2} : done en S0, de nouveau éligible en S2, variante « encore », plays == 2, outcome conservé', () {
      final s = _opened(engine, 2);
      final d = engine.director;
      final c = d.ctx(s, 'aller');
      // Force l'ouverture du kop si le tirage ne l'a pas pris.
      if (!s.arcs.containsKey('a.kop')) d.armArc(s, content.arcs['a.kop']!, c, dueN: s.ncards + 1, deadlineN: s.ncards + 3);
      s.arcs['a.kop']!.outcome = 'pacte';
      d.arcDone(s, 'a.kop');
      expect(s.arcs['a.kop']!.plays, 1);
      expect(s.carriersLastSeason['gege'], 0);
      expect(d.replayable(s, content.arcs['a.kop']!), isFalse, reason: 'after 2 : pas en S0');
      s.season = 1;
      expect(d.replayable(s, content.arcs['a.kop']!), isFalse, reason: 'after 2 : pas en S1');
      s.season = 2;
      expect(d.replayable(s, content.arcs['a.kop']!), isTrue);
      // Re-armé : plays et outcome conservés, la variante « encore » est enfilée.
      d.armArc(s, content.arcs['a.kop']!, d.ctx(s, 'aller'), dueN: s.ncards + 1, deadlineN: s.ncards + 3);
      expect(s.arcs['a.kop']!.status, 'armed');
      expect(s.arcs['a.kop']!.plays, 1);
      expect(s.arcs['a.kop']!.outcome, 'pacte');
      expect(s.scheduled.firstWhere((e) => e.arc == 'a.kop').card, 'a.kop.s1_encore');
      expect(evalWhen(['cmp', '==', _call('arc_outcome', 'a.kop'), ['lit', 'pacte']], d.ctx(s, 'aller')), isTrue);
      expect(evalWhen(_ge(_call('plays', 'a.kop'), 1), d.ctx(s, 'aller')), isTrue);
      d.arcDone(s, 'a.kop');
      expect(s.arcs['a.kop']!.plays, 2);
      expect(d.replayable(s, content.arcs['a.kop']!), isFalse, reason: 'max 2 atteint');
      // Un arc sans replay n'est jamais rejouable ; un abandon non plus (after_abort absent).
      d.arcDone(s, 'a.prodige');
      s.season = 9;
      expect(d.replayable(s, content.arcs['a.prodige']!), isFalse);
      d.arcAbort(s, 'a.nassir', 'club');
      expect(d.replayable(s, content.arcs['a.nassir']!), isFalse);
    });

    test('R2 · rituel : tiré chaque saison sans doublon avec la boucle every_season', () {
      final s = _opened(engine, 4);
      final d = engine.director;
      // Ferme tout et passe en S1 : le gardien (rituel) est de nouveau candidat via la reprise.
      for (final id in s.arcs.keys.toList()) {
        d.arcDone(s, id);
      }
      s.scheduled.removeWhere((e) => e.arc != null);
      s.season = 1;
      s.reserve = [];
      d.openSeason(s, Rng(21));
      final gardienEntries = s.scheduled.where((e) => e.arc == 'a.gardien').length;
      expect(gardienEntries, lessThanOrEqualTo(1), reason: 'jamais deux entrées pour le rituel');
      expect(d.replayable(s, content.arcs['a.gardien']!), s.arcs['a.gardien']!.status == 'done' && s.arcs['a.gardien']!.doneSeason != 1);
      // Sur 40 graines, le rituel revient en S2 dans une bonne part des cas et
      // jamais deux fois la même saison.
      int seen = 0;
      for (var seed = 1; seed <= 40; seed++) {
        final t = _opened(engine, seed);
        for (final id in t.arcs.keys.toList()) {
          d.arcDone(t, id);
        }
        t.scheduled.removeWhere((e) => e.arc != null);
        t.season = 2;
        t.reserve = [];
        d.openSeason(t, Rng(seed));
        final n = t.scheduled.where((e) => e.arc == 'a.gardien').length;
        expect(n, lessThanOrEqualTo(1));
        if (n == 1) {
          seen++;
          final plays = t.arcs['a.gardien']!.plays;
          expect(t.scheduled.firstWhere((e) => e.arc == 'a.gardien').card, plays >= 1 ? 'a.gardien.s1_encore' : 'a.gardien.s1');
        }
      }
      expect(seen, greaterThan(10));
    });

    test('R3 · once: true sur une étape d\'un arc rejouable = erreur de build (fixture)', () async {
      final root = _repoRoot();
      final tmp = Directory('${Directory.systemTemp.path}/fusible_r3_${DateTime.now().microsecondsSinceEpoch}')..createSync(recursive: true);
      try {
        // Copie du contenu réel (sans build/) puis `once: true` sur l'étape 1 du kop.
        Future<void> copy(Directory from, Directory to) async {
          to.createSync(recursive: true);
          for (final e in from.listSync()) {
            final name = e.path.split('/').last;
            if (e is Directory) {
              if (name == 'build') continue;
              await copy(e, Directory('${to.path}/$name'));
            } else if (e is File) {
              e.copySync('${to.path}/$name');
            }
          }
        }

        await copy(Directory('$root/content'), Directory('${tmp.path}/content'));
        final kop = File('${tmp.path}/content/cards/entraineur/arc_kop.yaml');
        final txt = kop.readAsStringSync();
        expect(txt, contains('  - id: en.kop.local\n'));
        kop.writeAsStringSync(txt.replaceFirst('  - id: en.kop.local\n', '  - id: en.kop.local\n    once: true\n'));
        final r = await Process.run(Platform.resolvedExecutable, ['$root/packages/tools/bin/build_content.dart'], workingDirectory: tmp.path);
        expect(r.exitCode, 1, reason: 'stdout: ${r.stdout}\nstderr: ${r.stderr}');
        expect(r.stderr.toString(), contains('once: true sur une étape de l\'arc rejouable en.kop_qui_aime_trop'));
      } finally {
        tmp.deleteSync(recursive: true);
      }
    }, timeout: const Timeout(Duration(minutes: 3)));
  });

  group('O · objectifs et sérialisation', () {
    test('un objectif atteint au Bilan entre dans unlocked et dans le payload de fin', () {
      final content = _synth(
        arcs: _fiveArcs(),
        cards: _fiveCards(),
        programme: _programme(),
        objectifs: [
          {'id': 'pacte', 'titre': 'Le pacte', 'when': ['cmp', '==', _call('arc_outcome', 'a.kop'), ['lit', 'pacte']], 'indice': 'Serrer la main.'},
          {'id': 'jamais', 'titre': 'Jamais', 'when': ['lit', false], 'indice': 'Introuvable.'},
        ],
      );
      final engine = Engine(content);
      var s = engine.start(6);
      final d = engine.director;
      if (!s.arcs.containsKey('a.kop')) d.armArc(s, content.arcs['a.kop']!, d.ctx(s, 'aller'), dueN: 1, deadlineN: 3);
      s.arcs['a.kop']!.outcome = 'pacte';
      // Va jusqu'au Bilan : le verdict évalue les objectifs.
      int guard = 0;
      while (!s.over && guard < 200 && !(s.pending!.kind == 'bilan_verdict')) {
        s = engine.choose(s, true);
        guard++;
      }
      expect(s.pending!.kind, 'bilan_verdict');
      s = engine.choose(s, true);
      expect(s.unlocked, contains('objectif:pacte'));
      expect(s.unlocked, isNot(contains('objectif:jamais')));
      expect(evalWhen(_call('objectif', 'pacte'), EvalContext(s, 'bilan')), isTrue);
      // Fin : le payload liste les trois états.
      s.gauges['direction'] = 0;
      s = engine.choose(s, true);
      expect(s.over, isTrue);
      final objs = (s.pending!.payload['objectifs'] as List).cast<Map<String, dynamic>>();
      expect(objs.map((o) => o['id']), ['pacte', 'jamais']);
      expect(objs.first['atteint'], isTrue);
      expect(objs.last['atteint'], isFalse);
      expect(objs.last['indice'], 'Introuvable.');
    });

    test('JSON : reserve, themesPlayed, openingSlots, plays/outcome et fusées longues survivent au round-trip', () {
      final arcs = _fiveArcs();
      // Une fusée longue sur la deuxième intrigue : s2 en saison +1, slots [2,4].
      arcs[1]['steps'][0]['next'] = [
        {'step': 's2', 'in': [2, 4], 'at_season': 1, 'at': [2, 4]}
      ];
      final content = _synth(arcs: arcs, cards: _fiveCards(), programme: _programme(), questions: _questions);
      final engine = Engine(content);
      final s = engine.start(8);
      final d = engine.director;
      final c = d.ctx(s, 'aller');
      d.enqueueNext(s, content.arcs['a.prodige']!, content.arcs['a.prodige']!.steps.first.next.first, c);
      final fuse = s.scheduled.firstWhere((e) => e.arc == 'a.prodige');
      expect(fuse.dueN, -1);
      expect(fuse.atSeason, 1);
      expect(fuse.atSlot, [2, 4]);
      // Elle n'est ni servie ni purgée avant sa saison.
      for (var i = 0; i < 6; i++) {
        final p = d.drawNarrative(s, 'aller', Rng(i));
        expect(p.id, isNot('a.prodige.s2'));
      }
      expect(s.scheduled.any((e) => e.arc == 'a.prodige' && e.dueN == -1), isTrue);
      final back = GameState.fromJson(json.decode(json.encode(s.toJson())) as Map<String, dynamic>);
      expect(back.fingerprint(), s.fingerprint());
      expect(json.encode(back.toJson()), json.encode(s.toJson()));
      expect(back.reserve, s.reserve);
      expect(back.themesPlayed, s.themesPlayed);
      expect(back.openingSlots, s.openingSlots);
      final f2 = back.scheduled.firstWhere((e) => e.arc == 'a.prodige');
      expect(f2.atSeason, 1);
      expect(f2.atSlot, [2, 4]);
      // À l'ouverture de la saison 1, la fusée reçoit sa fenêtre absolue.
      back.season = 1;
      back.scheduled.removeWhere((e) => e.arc != 'a.prodige');
      d.openSeason(back, Rng(1));
      final planned = back.scheduled.firstWhere((e) => e.arc == 'a.prodige');
      expect(planned.dueN, back.seasonStartN + 2);
      expect(planned.deadlineN, back.seasonStartN + 4);
      expect(planned.atSeason, isNull);
    });
  });
}
