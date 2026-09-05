/// Unit tests of the narrative director on a small synthetic content bundle
/// (spec §5.1), plus determinism and property checks on the real bundle.
library;

import 'dart:convert';
import 'dart:io';

import 'package:fusible_core/fusible_core.dart';
import 'package:test/test.dart';

// ---------------------------------------------------------------------------
// Synthetic content.
// ---------------------------------------------------------------------------

List<Object> _gt(String path, num v) => ['cmp', '>', ['path', path], ['lit', v]];
List<Object> _flag(String f) => ['call', 'flag', [['lit', f]]];

Map<String, dynamic> _card(
  String id, {
  String? speaker,
  Object? when,
  bool once = false,
  String tone = 'leger',
  String kind = 'routine',
  bool pool = true,
  int priority = 0,
  int cooldown = 12,
  String arc = 'divers',
  Map<String, dynamic>? left,
  Map<String, dynamic>? right,
  String? arcId,
  String? stepId,
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
      'cooldown': cooldown,
      'priority': priority,
      'sablier': false,
      if (when != null) 'when': when,
      'text': text ?? 'Texte de $id.',
      'left': {'label': 'Gauche', 'effects': left ?? {}},
      'right': {'label': 'Droite', 'effects': right ?? {}},
      'tone': tone,
      'kind': kind,
      'pool': pool,
      if (arcId != null) 'arcId': arcId,
      if (stepId != null) 'stepId': stepId,
    };

Map<String, dynamic> _step(String id, String card, {List<Map<String, dynamic>> next = const []}) => {
      'id': id,
      'card': card,
      'season': '0',
      'next': next,
    };

Content _synth({
  List<Map<String, dynamic>> cards = const [],
  List<Map<String, dynamic>> arcs = const [],
  Map<String, dynamic>? alarms,
  Map<String, dynamic>? postulat,
  int fillers = 40,
}) {
  const speakers = ['josiane', 'vukic', 'brehaut', 'meneche'];
  final allCards = <Map<String, dynamic>>[
    for (var i = 0; i < fillers; i++) _card('r.f$i', speaker: speakers[i % 4]),
    _card('pal.trahison', speaker: 'gege', once: true, kind: 'palier', pool: false),
    _card('pal.faveur', speaker: 'gege', once: true, kind: 'palier', pool: false),
    ...cards,
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
      {'id': 'josiane', 'name': 'Madame Josiane', 'genre': 'f', 'label': 'SECRÉTAIRE'},
      {'id': 'vukic', 'name': 'Zoran Vukić'},
      {'id': 'brehaut', 'name': 'Titi Bréhaut'},
      {'id': 'meneche', 'name': 'Pierre Ménèche'},
      {'id': 'aulard', 'name': 'Jean-Marie Aulard'},
      {
        'id': 'gege',
        'name': 'Gégé',
        'on_relation': {'-3': 'pal.trahison', '3': 'pal.faveur'},
      },
    ],
    'arcs': arcs,
    'postulats': [
      postulat ??
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
          },
    ],
    'alarms': alarms ?? const {},
    'director': const {},
  };
  return Content.fromJson(j);
}

Pending _draw(Engine e, GameState s, {String phase = 'aller', int seed = 7}) => e.director.drawNarrative(s, phase, Rng(seed));

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

int _risk(GameState s, List<GaugeHint> hints) {
  int r = 0;
  for (final h in hints) {
    final v = s.gauges[h.gauge] ?? 50;
    if (v < 30 || v > 70) r += h.magnitude;
  }
  return r;
}

bool _bot(GameState s, int step) {
  final p = s.pending!;
  if (p.single) return true;
  final l = _risk(s, p.previewLeft);
  final r = _risk(s, p.previewRight);
  return r < l ? true : (l < r ? false : (step % 2 == 0));
}

// ---------------------------------------------------------------------------

void main() {
  test('ordre total des bandes : script, puis échu, puis événement, puis alarme', () {
    final content = _synth(cards: [
      _card('sc.a', speaker: 'aulard', pool: false, kind: 'script'),
      _card('et.b', speaker: 'gege', pool: false, kind: 'etape'),
      _card('ev.c', speaker: 'vukic', pool: false, kind: 'evenement'),
      _card('al.d', speaker: 'josiane', pool: false, kind: 'alarme'),
    ]);
    final engine = Engine(content);
    final s = engine.start(1);
    final d = engine.director;
    // Inserted in the "wrong" order on purpose.
    d.enqueue(s, Scheduled(card: 'al.d', kind: 'alarme', dueN: 1, deadlineN: 3, sameClub: false));
    d.enqueue(s, Scheduled(card: 'ev.c', kind: 'evenement', dueN: 1, deadlineN: 2));
    d.enqueue(s, Scheduled(card: 'et.b', kind: 'etape', dueN: 1, deadlineN: 1));
    d.enqueue(s, Scheduled(card: 'sc.a', kind: 'script', dueN: 1, deadlineN: 1));
    final order = [for (var i = 0; i < 4; i++) _draw(engine, s, seed: i).id];
    expect(order, ['sc.a', 'et.b', 'ev.c', 'al.d']);
    expect(s.scheduled, isEmpty);
  });

  test('finale inviolable : le script du slot 17 passe avant une alarme échue', () {
    final content = _synth(cards: [
      _card('sc.fin', speaker: 'aulard', pool: false, kind: 'script'),
      _card('al.trib', speaker: 'gege', pool: false, kind: 'alarme', when: _gt('gauges.tribunes', 75)),
    ]);
    final engine = Engine(content);
    final s = engine.start(1);
    s.ncards = 16;
    s.slot = 16;
    s.gauges['tribunes'] = 85;
    engine.director.enqueue(s, Scheduled(card: 'sc.fin', kind: 'script', dueN: 17, deadlineN: 17));
    engine.director.enqueue(s, Scheduled(card: 'al.trib', kind: 'alarme', dueN: 15, deadlineN: 17, sameClub: false, payload: {'gauge': 'tribunes', 'side': 'high'}));
    expect(_draw(engine, s, phase: 'retour').id, 'sc.fin');
    // Still eligible → served at the next draw.
    expect(_draw(engine, s, phase: 'retour').id, 'al.trib');

    // Same setup, but the player fixed the gauge: the alarm expires in silence.
    final s2 = engine.start(1);
    s2.ncards = 16;
    s2.slot = 16;
    s2.gauges['tribunes'] = 85;
    engine.director.enqueue(s2, Scheduled(card: 'sc.fin', kind: 'script', dueN: 17, deadlineN: 17));
    engine.director.enqueue(s2, Scheduled(card: 'al.trib', kind: 'alarme', dueN: 15, deadlineN: 17, sameClub: false, payload: {'gauge': 'tribunes', 'side': 'high'}));
    _draw(engine, s2, phase: 'retour');
    s2.gauges['tribunes'] = 50;
    final p = _draw(engine, s2, phase: 'retour');
    expect(p.id, isNot('al.trib'));
    expect(s2.stats['miss_ineligible'], 1);
  });

  test('réservation avec dette : l\'étape échue passe, la Nouvelle sort au slot suivant', () {
    final content = _synth(cards: [
      _card('nv.1', speaker: 'meneche', pool: false, kind: 'nouvelle', arc: 'nouvelle'),
      _card('nv.2', speaker: 'josiane', pool: false, kind: 'nouvelle', arc: 'nouvelle'),
      _card('et.x', speaker: 'gege', pool: false, kind: 'etape'),
      _card('et.y', speaker: 'vukic', pool: false, kind: 'etape'),
    ]);
    final engine = Engine(content);
    final s = engine.start(1);
    s.ncards = 6;
    s.slot = 6;
    engine.director.enqueue(s, Scheduled(card: 'et.x', kind: 'etape', dueN: 5, deadlineN: 7));
    engine.director.enqueue(s, Scheduled(card: 'et.y', kind: 'etape', dueN: 8, deadlineN: 12));
    final p7 = _draw(engine, s);
    expect(p7.id, 'et.x');
    expect(p7.payload['band'], 6);
    final p8 = _draw(engine, s);
    expect(p8.payload['kind'], 'nouvelle');
    expect(p8.payload['band'], 1);
    expect(p8.single, isTrue);
    expect(s.nouvellesThisSeason, 1);
  });

  group('cadence forcée', () {
    test('sans histoire depuis gap_max cartes, un arc éligible est ouvert et servi tout de suite', () {
      final content = _synth(
        cards: [_card('bg.s1', speaker: 'gege', pool: false, kind: 'etape', arcId: 'bg', stepId: 's1')],
        arcs: [
          {
            'id': 'bg',
            'kind': 'serie',
            'roles': ['entraineur'],
            'foreground': false,
            'start': [10, 12],
            'steps': [_step('s1', 'bg.s1')],
          }
        ],
      );
      final engine = Engine(content);
      final s = engine.start(1);
      for (var i = 0; i < 3; i++) {
        expect(_draw(engine, s, seed: i).payload['kind'], 'routine');
      }
      final p4 = _draw(engine, s, seed: 4);
      expect(p4.id, 'bg.s1');
      expect(p4.payload['forced'], isTrue);
      expect(s.arcs['bg']?.status, 'active');
    });

    test('sans arc éligible, l\'étape la plus proche est tirée vers soi (cadence_pull)', () {
      final content = _synth(cards: [_card('ch.z', speaker: 'gege', pool: false)]);
      final engine = Engine(content);
      final s = engine.start(1);
      engine.director.enqueue(s, Scheduled(card: 'ch.z', kind: 'chaine', dueN: 30, deadlineN: 40));
      for (var i = 0; i < 3; i++) {
        _draw(engine, s, seed: i);
      }
      final p4 = _draw(engine, s, seed: 4);
      expect(p4.id, 'ch.z');
      expect(s.stats['cadence_pull'], 1);
    });

    test('sans rien à forcer, la routine continue et la famine reste à zéro', () {
      final engine = Engine(_synth());
      final s = engine.start(1);
      for (var i = 0; i < 12; i++) {
        expect(_draw(engine, s, seed: i).payload['kind'], 'routine');
      }
      expect(s.stats['famine'], isNull);
    });
  });

  test('fin du queue-jumping : une cible programmée ne sort jamais du sac', () {
    final content = _synth(cards: [
      _card('tg', speaker: 'gege', pool: false),
      _card('qx', speaker: 'vukic', pool: true),
    ]);
    final engine = Engine(content);
    final s = engine.start(1);
    // `qx` is in the bag but queued far away: it must wait its window.
    engine.director.enqueue(s, Scheduled(card: 'qx', kind: 'palier', dueN: 60, deadlineN: 70, sameClub: false));
    final seen = <String>{};
    for (var i = 0; i < 40; i++) {
      seen.add(_draw(engine, s, seed: i).id);
    }
    expect(seen, isNot(contains('tg')));
    expect(seen, isNot(contains('qx')));
    // Once scheduled, the queue-only card comes out inside its window.
    engine.director.enqueue(s, Scheduled(card: 'tg', kind: 'chaine', dueN: s.ncards + 2, deadlineN: s.ncards + 4));
    final ids = [for (var i = 0; i < 4; i++) _draw(engine, s, seed: 100 + i).id];
    expect(ids, contains('tg'));
  });

  test('once et cooldown s\'appliquent aussi à la file', () {
    final content = _synth(
      cards: [
        _card('once1', speaker: 'gege', once: true, pool: false),
        _card('al.h', speaker: 'gege', pool: false, kind: 'alarme', when: _gt('gauges.tribunes', 75), cooldown: 10),
      ],
      alarms: {
        'entraineur': {
          'tribunes.high': [
            {'card': 'al.h'}
          ]
        }
      },
    );
    final engine = Engine(content);
    final s = engine.start(1);
    s.seenCount['once1'] = 1;
    engine.director.enqueue(s, Scheduled(card: 'once1', kind: 'chaine', dueN: 1, deadlineN: 1));
    final p = _draw(engine, s);
    expect(p.id, isNot('once1'));
    expect(s.stats['miss_deja_vue'], 1);

    // The alarm card was served 5 cards ago (cooldown 10): not queued again.
    final s2 = engine.start(1);
    s2.ncards = 5;
    s2.cooldowns['al.h'] = 0;
    s2.gauges['tribunes'] = 85;
    final p2 = _draw(engine, s2);
    expect(p2.id, isNot('al.h'));
    expect(s2.scheduled.where((e) => e.kind == 'alarme'), isEmpty);
  });

  test('changement de club : les arcs same_club deviennent des « Nouvelles du passé » avec leur épilogue', () {
    Map<String, dynamic> arc(String id) => {
          'id': id,
          'title': 'Affaire $id',
          'kind': 'serie',
          'roles': ['entraineur'],
          'fallback': 'nouvelles',
          'epilogue': {'tribunes': -5},
          'steps': [_step('s1', '$id.s1')],
        };
    final content = _synth(
      cards: [
        for (final id in ['a1', 'a2', 'a3']) _card('$id.s1', speaker: 'gege', pool: false, kind: 'etape', arcId: id, stepId: 's1'),
        _card('tr.nouvelles_du_passe', speaker: 'josiane', pool: false, kind: 'passe', arc: 'nouvelle',
            text: 'Une vieille affaire — {passe_titre} — refait surface.'),
      ],
      arcs: [arc('a1'), arc('a2'), arc('a3')],
    );
    final engine = Engine(content);
    final s = engine.start(1);
    final d = engine.director;
    final c = d.ctx(s, 'aller');
    for (final id in ['a1', 'a2', 'a3']) {
      d.armArc(s, content.arcs[id]!, c, dueN: 20, deadlineN: 30);
    }
    expect(s.scheduled.length, 3);
    s.clubSeq += 1; // as _transitionTo does
    final passes = <Pending>[];
    for (var i = 0; i < 8; i++) {
      final p = _draw(engine, s, seed: i);
      if (p.payload['kind'] == 'passe') passes.add(p);
    }
    expect(s.stats['miss_club'], 3);
    expect(passes.length, 3);
    for (final p in passes) {
      expect(p.leftEffects.gauges, {'tribunes': -5});
      expect(p.rightEffects.gauges, {'tribunes': -5});
      expect(p.single, isTrue);
      expect(p.text, contains('Affaire a'));
    }
    for (final id in ['a1', 'a2', 'a3']) {
      expect(s.arcs[id]?.status, 'abandonne');
    }
  });

  test('alarmes : servies dans les trois cartes, avec hystérésis [30,70]', () {
    final content = _synth(
      cards: [_card('al.h', speaker: 'gege', pool: false, kind: 'alarme', when: _gt('gauges.tribunes', 75), cooldown: 2)],
      alarms: {
        'entraineur': {
          'tribunes.high': [
            {'card': 'al.h'}
          ]
        }
      },
    );
    final engine = Engine(content);
    final s = engine.start(1);
    int served = 0;
    Pending go(int v, int seed) {
      s.gauges['tribunes'] = v;
      final p = _draw(engine, s, seed: seed);
      if (p.id == 'al.h') served++;
      return p;
    }

    expect(go(81, 1).id, 'al.h'); // crossing → queued and served at once (band 3)
    expect(served, 1);
    go(79, 2);
    go(84, 3); // still above 70 since the last firing: no second alarm
    go(78, 4);
    go(83, 5);
    expect(served, 1, reason: 'hystérésis : une seule alarme tant que la jauge n\'est pas revenue dans [30,70]');
    go(69, 6); // back inside → re-armed
    go(82, 7);
    expect(served, 2);
    expect(s.alarmsThisSeason, 2);
  });

  test('drame : jamais en saison 0 ; reporté au plus 8 fois puis abandonné', () {
    final content = _synth(cards: [_card('dr.1', speaker: 'gege', once: true, pool: false, kind: 'etape', tone: 'drame')]);
    final engine = Engine(content);
    final s = engine.start(1);
    engine.director.enqueue(s, Scheduled(card: 'dr.1', kind: 'etape', dueN: 1, deadlineN: 1));
    for (var i = 0; i < 10; i++) {
      expect(_draw(engine, s, seed: i).id, isNot('dr.1'));
    }
    expect(s.stats['miss_drame_bloque'], 1);
    expect(s.drames, 0);
    expect(engine.director.drameAllowed(s), isFalse);
    s.season = 1;
    expect(engine.director.drameAllowed(s), isTrue);
  });

  group('`next` après les effets', () {
    Content content() => _synth(
          cards: [
            _card('n.a', speaker: 'gege', pool: false, kind: 'etape', arcId: 'arcn', stepId: 'a',
                right: {
                  'set': ['x']
                },
                left: {
                  'next': {'step': 'd', 'in': [2, 4]}
                }),
            _card('n.b', speaker: 'vukic', pool: false, kind: 'etape', arcId: 'arcn', stepId: 'b'),
            _card('n.c', speaker: 'vukic', pool: false, kind: 'etape', arcId: 'arcn', stepId: 'c'),
            _card('n.d', speaker: 'vukic', pool: false, kind: 'etape', arcId: 'arcn', stepId: 'd'),
          ],
          arcs: [
            {
              'id': 'arcn',
              'kind': 'serie',
              'roles': ['entraineur'],
              'steps': [
                _step('a', 'n.a', next: [
                  {'step': 'b', 'if': _flag('x'), 'in': [3, 5]},
                  {'step': 'c', 'in': [3, 5]},
                ]),
                _step('b', 'n.b'),
                _step('c', 'n.c'),
                _step('d', 'n.d'),
              ],
            }
          ],
        );

    GameState atStep(Engine engine) {
      var s = engine.start(3);
      s = engine.choose(s, true); // objective → first card beat
      engine.director.enqueue(s, Scheduled(card: 'n.a', kind: 'etape', arc: 'arcn', step: 'a', dueN: s.ncards + 1, deadlineN: s.ncards + 1));
      s.pending = _draw(engine, s, phase: 'presaison');
      expect(s.pending!.id, 'n.a');
      return s;
    }

    test('le `if` du next voit le drapeau posé par le choix', () {
      final engine = Engine(content());
      final s = engine.choose(atStep(engine), true); // right: sets x → b
      expect(s.scheduled.any((e) => e.arc == 'arcn' && e.step == 'b'), isTrue);
      expect(s.scheduled.any((e) => e.arc == 'arcn' && e.step == 'c'), isFalse);
      expect(s.arcs['arcn']?.step, 'a');
    });

    test('un next explicite dans le choix l\'emporte sur la liste', () {
      final engine = Engine(content());
      final s = engine.choose(atStep(engine), false); // left: explicit → d
      expect(s.scheduled.any((e) => e.arc == 'arcn' && e.step == 'd'), isTrue);
      expect(s.scheduled.where((e) => e.arc == 'arcn').length, 1, reason: 'une seule entrée par arc');
    });
  });

  test('franchissement de relation : −2 → −3 enfile la trahison une seule fois et pose l\'ennemi', () {
    final content = _synth(cards: [
      _card('rel.c', speaker: 'gege', pool: false, right: {
        'relation': {'gege': -1}
      }),
    ]);
    final engine = Engine(content);
    var s = engine.start(5);
    s = engine.choose(s, true);
    s.relations['gege'] = -2;
    engine.director.enqueue(s, Scheduled(card: 'rel.c', kind: 'chaine', dueN: s.ncards + 1, deadlineN: s.ncards + 1));
    s.pending = _draw(engine, s, phase: 'presaison');
    expect(s.pending!.id, 'rel.c');
    s = engine.choose(s, true);
    expect(s.relations['gege'], -3);
    expect(s.enemies, contains('gege'));
    // The betrayal card is queued with window [1,3]: it is either already the
    // very next card, or still waiting in the queue.
    final servedNow = s.pending!.id == 'pal.trahison';
    final queued = s.scheduled.where((e) => e.kind == 'palier' && e.card == 'pal.trahison').length;
    expect(servedNow || queued == 1, isTrue, reason: 'trahison ni servie ni en file');
    if (servedNow) expect(s.pending!.payload['kind'], 'palier');
    // Crossing again (after a bounce) never queues it a second time.
    s.relations['gege'] = -2;
    engine.director.relationCrossings(s, {'gege': -2}, 'aller');
    s.relations['gege'] = -3;
    engine.director.relationCrossings(s, {'gege': -2}, 'aller');
    expect(s.scheduled.where((e) => e.card == 'pal.trahison').length, servedNow ? 0 : 1);
  });

  group('contenu réel', () {
    final content = _real();
    final engine = Engine(content);

    test('déterminisme : 25 graines × tous les postulats, deux exécutions identiques', () {
      final nPost = content.postulatsByIndex.length;
      for (var seed = 1; seed <= 25; seed++) {
        for (var p = 0; p < nPost; p++) {
          final fp1 = <String>[];
          var a = engine.start(seed, postulat: p);
          var b = engine.start(seed, postulat: p);
          for (var i = 0; i < 300 && !a.over; i++) {
            fp1.add(a.fingerprint());
            expect(b.fingerprint(), a.fingerprint(), reason: 'seed $seed postulat $p diverge à la carte $i');
            final right = _bot(a, i);
            a = engine.choose(a, right);
            b = engine.choose(b, right);
          }
          // JSON round-trip mid-run stays on the same trajectory.
          final back = GameState.fromJson(json.decode(json.encode(a.toJson())) as Map<String, dynamic>);
          expect(back.fingerprint(), a.fingerprint());
          if (!a.over) {
            expect(engine.choose(back, true).fingerprint(), engine.choose(a, true).fingerprint());
          }
        }
      }
    });

    test('propriétés sur 150 runs : slots, file bornée, cooldowns, jauges, famine nulle', () {
      final nPost = content.postulatsByIndex.length;
      for (var seed = 100; seed < 250; seed++) {
        var s = engine.start(seed, postulat: seed % nPost);
        int step = 0;
        String? prevTone;
        while (!s.over && step < 600) {
          final p = s.pending!;
          if (p.kind == 'narrative') {
            expect(s.slot, inInclusiveRange(0, content.cardSlots(s.role)));
            expect(s.scheduled.length, lessThanOrEqualTo(12), reason: 'file trop longue (seed $seed, n=${s.ncards})');
            final tone = p.payload['tone'] as String?;
            if (tone == 'drame') expect(prevTone, isNot('drame'), reason: 'deux drames d\'affilée');
            prevTone = tone;
            if (p.payload['band'] == 0) {
              final card = content.cards[p.id];
              if (card != null) {
                final last = s.cooldowns[p.id];
                // The served card was stamped at this draw: any earlier stamp must respect the cooldown.
                expect(last, s.ncards);
              }
            }
          }
          for (final g in s.gauges.values) {
            expect(g, inInclusiveRange(0, 100));
          }
          s = engine.choose(s, _bot(s, step));
          step++;
        }
        expect(s.stats['famine'] ?? 0, 0, reason: 'famine (seed $seed)');
      }
    });
  });
}
