/// Le rôle et le statut du locuteur sur **tous** les chemins de sélection
/// (spec variété §1.10, docs/bible/90_interconnexions.md § 1), plus le
/// correctif des échéances du metteur en scène.
///
/// Deux défauts relevés par les vérificateurs :
///   * une carte déclarée pour un seul rôle était servie dans l'autre — le
///     chemin des alarmes ne filtrait pas `s.role`, contrairement à `pickPool` ;
///   * un personnage parti, vendu, retraité ou mort parlait encore par les
///     paliers de relation, les retrouvailles et les réactions.
/// Les tests ci-dessous ferment les deux, chemin par chemin sur un contenu
/// synthétique à deux rôles, puis en propriété sur le contenu réel.
library;

import 'dart:io';

import 'package:fusible_core/fusible_core.dart';
import 'package:test/test.dart';

// ---------------------------------------------------------------------------
// Contenu synthétique à deux rôles.
// ---------------------------------------------------------------------------

Map<String, dynamic> _card(
  String id, {
  required List<String> roles,
  String? speaker,
  Object? when,
  String kind = 'routine',
  bool pool = true,
  String tone = 'leger',
  String arc = 'divers',
  int cooldown = 12,
  List<String> statutOk = const [],
  Map<String, dynamic>? right,
}) =>
    {
      'id': id,
      'roles': roles,
      'arc': arc,
      'tags': const <String>[],
      if (speaker != null) 'speaker': speaker,
      'weight': 1.0,
      'once': false,
      'cooldown': cooldown,
      'priority': 0,
      'sablier': false,
      if (when != null) 'when': when,
      'text': 'Texte de $id.',
      'left': {'label': 'Gauche', 'effects': const <String, dynamic>{}},
      'right': {'label': 'Droite', 'effects': right ?? const <String, dynamic>{}},
      'tone': tone,
      'kind': kind,
      'pool': pool,
      if (statutOk.isNotEmpty) 'statut_ok': statutOk,
    };

List<Map<String, dynamic>> _gauges(List<String> ends) => [
      {'id': 'vestiaire', 'label': 'Vestiaire', 'icon': 'x', 'empty': ends[0], 'full': ends[1]},
      {'id': 'tribunes', 'label': 'Tribunes', 'icon': 'x', 'empty': ends[2], 'full': ends[3]},
      {'id': 'direction', 'label': 'Direction', 'icon': 'x', 'empty': ends[4], 'full': ends[5]},
      {'id': 'caisse', 'label': 'Caisse', 'icon': 'x', 'empty': ends[6], 'full': ends[7]},
    ];

List<Map<String, dynamic>> _calendar() => [
      {
        'phase': 'presaison',
        'beats': ['objective', 'card', 'card', 'card']
      },
      {
        'phase': 'aller',
        'beats': ['card', 'card', 'match', 'card', 'card', 'match', 'card', 'card', 'match']
      },
      {
        'phase': 'hiver',
        'beats': ['card', 'card', 'card']
      },
      {
        'phase': 'retour',
        'beats': ['card', 'card', 'match', 'cup', 'card', 'card', 'match', 'card', 'match']
      },
      {
        'phase': 'sprint',
        'beats': ['gm_annonce', 'gm_te', 'gm_te', 'gm_te', 'aftermatch']
      },
      {
        'phase': 'bilan',
        'beats': ['bilan_une', 'bilan_verdict', 'bilan_contrat', 'bilan_carrefour']
      },
    ];

/// Un bundle à deux rôles (`entraineur`, `joueur`), avec de quoi remplir le sac
/// et un casting minimal. Tout le reste est passé par les paramètres.
Content _synth({
  List<Map<String, dynamic>> cards = const [],
  List<Map<String, dynamic>> arcs = const [],
  List<Map<String, dynamic>> characters = const [],
  Map<String, dynamic> alarms = const {},
  Map<String, dynamic>? director,
  int fillers = 40,
}) {
  const speakers = ['josiane', 'vukic', 'brehaut', 'meneche'];
  final allCards = <Map<String, dynamic>>[
    for (var i = 0; i < fillers; i++) _card('r.f$i', roles: const ['entraineur', 'joueur'], speaker: speakers[i % 4]),
    ...cards,
  ];
  const endingIds = [
    'en_bus', 'en_copain', 'en_banderole', 'en_otage', 'en_sms', 'en_placard', 'en_decoupe', 'en_coupable',
    'jp_a', 'jp_b', 'jp_c', 'jp_d', 'jp_e', 'jp_f', 'jp_g', 'jp_h',
    'generique', 'grand_deballage',
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
        'gauges': _gauges(const ['en_bus', 'en_copain', 'en_banderole', 'en_otage', 'en_sms', 'en_placard', 'en_decoupe', 'en_coupable']),
        'transitions': const [],
      },
      {
        'id': 'joueur',
        'name': 'Joueur',
        'fragile': 'direction',
        'age': [19, 19],
        'posture': ['Offensif', 'Prudent'],
        'patron': 'aulard',
        'gauges': _gauges(const ['jp_a', 'jp_b', 'jp_c', 'jp_d', 'jp_e', 'jp_f', 'jp_g', 'jp_h']),
        'transitions': const [],
      },
    ],
    'cards': allCards,
    'endings': [for (final id in endingIds) {'id': id, 'title': id, 'epitaph': ''}],
    'feats': const [],
    'calendar': {'entraineur': _calendar(), 'joueur': _calendar()},
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
      ...characters,
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
      },
    ],
    'alarms': alarms,
    'director': director ?? const {},
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

double _danger(int v) {
  final d = (v - 50).abs();
  return d <= 20 ? d / 20.0 : 1 + (d - 20) * (d - 20) / 15.0;
}

/// Le bot « équilibriste » de simulate, pour jouer des carrières réelles.
bool _bot(GameState s, int step) {
  final p = s.pending!;
  if (p.single) return true;
  double score(Map<String, int> deltas) {
    double total = 0;
    for (final g in const ['vestiaire', 'tribunes', 'direction', 'caisse']) {
      total += _danger(((s.gauges[g] ?? 50) + (deltas[g] ?? 0)).clamp(0, 100));
    }
    return total;
  }

  final l = score(p.leftEffects.gauges);
  final r = score(p.rightEffects.gauges);
  if ((l - r).abs() < 0.001) return step % 2 == 0;
  return r < l;
}

// ---------------------------------------------------------------------------

void main() {
  group('R · fuite entre rôles', () {
    test('R1 · une alarme écrite pour l\'autre rôle ne sonne jamais ; celle du rôle sonne', () {
      final content = _synth(
        cards: [
          _card('jp.alarme.vestiaire', roles: const ['joueur'], speaker: 'vukic', kind: 'alarme', pool: false),
          _card('en.alarme.vestiaire', roles: const ['entraineur'], speaker: 'brehaut', kind: 'alarme', pool: false),
        ],
        alarms: {
          // La carte du joueur est en tête de liste : sans filtre de rôle,
          // c'est elle que le chemin des alarmes choisissait (défaut mesuré).
          'entraineur': {
            'vestiaire.low': ['jp.alarme.vestiaire', 'en.alarme.vestiaire'],
          },
        },
      );
      final engine = Engine(content);
      final s = engine.start(1);
      expect(s.role, 'entraineur');
      s.gauges['vestiaire'] = 10;
      final p = _draw(engine, s);
      expect(p.id, 'en.alarme.vestiaire');
      expect(s.scheduled.any((sc) => sc.card == 'jp.alarme.vestiaire'), isFalse);
    });

    test('R2 · palier, retrouvailles et réaction refusent une carte de l\'autre rôle', () {
      final content = _synth(
        cards: [
          _card('jp.palier', roles: const ['joueur'], speaker: 'gege', kind: 'palier', pool: false),
          _card('jp.retro', roles: const ['joueur'], speaker: 'gege', kind: 'chaine', pool: false),
          _card('jp.reaction', roles: const ['joueur'], speaker: 'gege', kind: 'routine', pool: false),
        ],
        characters: [
          {
            'id': 'gege',
            'name': 'Gégé',
            'on_relation': {'3': 'jp.palier'},
            'retrouvailles': {'sourire': 'jp.retro'},
          },
        ],
      );
      final engine = Engine(content);
      final s = engine.start(1);

      // Palier : la relation franchit +3, la carte du joueur n'entre pas en file.
      engine.director.relationCrossings(s, {'gege': 0}..['gege'] = 0, 'aller');
      s.relations['gege'] = 3;
      engine.director.relationCrossings(s, {'gege': 0}, 'aller');
      expect(s.scheduled.any((sc) => sc.card == 'jp.palier'), isFalse);

      // Retrouvailles : même refus.
      engine.director.retrouvailles(s);
      expect(s.scheduled.any((sc) => sc.card == 'jp.retro'), isFalse);

      // Réaction : la réplique n'est pas servie et la perte est comptée.
      final r = engine.director.serveReaction(s, const ReactionRef(card: 'jp.reaction'), Rng(3));
      expect(r, isNull);
      expect(s.stats['miss_reaction_role'], 1);
    });

    test('R3 · variante d\'étape : le secours ne peut pas être une carte de l\'autre rôle', () {
      final content = _synth(
        cards: [
          _card('en.etape.a', roles: const ['entraineur'], speaker: 'vukic', kind: 'etape', pool: false),
          _card('jp.etape.a', roles: const ['joueur'], speaker: 'vukic', kind: 'etape', pool: false),
        ],
        arcs: [
          {
            'id': 'en.arc',
            'kind': 'serie',
            'roles': ['entraineur'],
            'steps': [
              {
                'id': 's1',
                // La variante du rôle d'abord, puis le « secours » de l'autre
                // rôle : `resolveVariant` doit s'arrêter sur la première.
                'card': [
                  {'id': 'en.etape.a', 'if': null},
                  {'id': 'jp.etape.a'},
                ],
                'season': '0',
                'next': const [],
              },
            ],
          },
        ],
      );
      final engine = Engine(content);
      final s = engine.start(1);
      final step = content.arcs['en.arc']!.steps.first;
      final c = engine.director.ctx(s, 'aller');
      expect(engine.director.resolveVariant(step, c), 'en.etape.a');

      // Et quand la variante du rôle est éteinte, le secours de l'autre rôle
      // n'est pas retenu non plus : `servable` reste faux, la carte n'est
      // jamais servie (la purge écrit `miss_role` au tirage suivant).
      expect(engine.director.servable(s, content.cards['jp.etape.a']), isFalse);
    });
  });

  group('S · statuts respectés sur tous les chemins', () {
    /// Un contenu où Gégé porte un palier, des retrouvailles, une alarme, une
    /// réaction, une étape, une carte de sac et une Nouvelle.
    Content statutContent() => _synth(
          cards: [
            _card('g.palier', roles: const ['entraineur'], speaker: 'gege', kind: 'palier', pool: false),
            _card('g.retro', roles: const ['entraineur'], speaker: 'gege', kind: 'chaine', pool: false),
            _card('g.alarme', roles: const ['entraineur'], speaker: 'gege', kind: 'alarme', pool: false),
            _card('g.reaction', roles: const ['entraineur'], speaker: 'gege', pool: false),
            _card('g.etape', roles: const ['entraineur'], speaker: 'gege', kind: 'etape', pool: false),
            _card('g.sac', roles: const ['entraineur'], speaker: 'gege'),
            _card('g.nouvelle', roles: const ['entraineur'], speaker: 'gege', kind: 'nouvelle', pool: false, arc: 'nouvelle'),
            _card('x.alarme', roles: const ['entraineur'], speaker: 'josiane', kind: 'alarme', pool: false),
          ],
          characters: [
            {
              'id': 'gege',
              'name': 'Gégé',
              'age': 60,
              'on_relation': {'3': 'g.palier'},
              'retrouvailles': {'sourire': 'g.retro'},
            },
          ],
          alarms: {
            'entraineur': {
              'vestiaire.low': ['g.alarme', 'x.alarme'],
            },
          },
        );

    test('S1 · un personnage vendu ne parle plus par aucun chemin', () {
      final content = statutContent();
      final engine = Engine(content);
      final s = engine.start(1);
      engine.director.initChars(s);
      s.relations['gege'] = 3;

      // Il parle encore tant qu'il est présent : témoin.
      expect(engine.director.servable(s, content.cards['g.sac']), isTrue);

      // Vendu (spec variété §1.10).
      s.chars['gege']!.statut = 'vendu';
      expect(engine.director.statutOf(s, 'gege'), 'vendu');

      // 1. Sac et Nouvelles.
      final c = engine.director.ctx(s, 'aller');
      for (var i = 0; i < 8; i++) {
        expect(engine.director.pickPool(s, 'aller', c, Rng(i))?.id, isNot('g.sac'));
        expect(engine.director.pickNouvelle(s, c, Rng(i))?.id, isNot('g.nouvelle'));
      }

      // 2. Alarme : la liste passe au visage suivant.
      s.gauges['vestiaire'] = 10;
      engine.director.raiseAlarms(s, engine.director.ctx(s, 'aller'));
      expect(s.scheduled.any((sc) => sc.card == 'g.alarme'), isFalse);
      expect(s.scheduled.any((sc) => sc.card == 'x.alarme'), isTrue);
      s.scheduled.clear();

      // 3. Palier de relation.
      engine.director.relationCrossings(s, {'gege': 0}, 'aller');
      expect(s.scheduled.any((sc) => sc.card == 'g.palier'), isFalse);

      // 4. Retrouvailles.
      engine.director.retrouvailles(s);
      expect(s.scheduled.any((sc) => sc.card == 'g.retro'), isFalse);

      // 5. Réaction.
      expect(engine.director.serveReaction(s, const ReactionRef(card: 'g.reaction'), Rng(3)), isNull);
      expect(s.stats['miss_reaction_statut'], 1);

      // 6. Étape déjà en file : la purge la fait tomber, elle n'est pas servie.
      engine.director.enqueue(s, Scheduled(card: 'g.etape', kind: 'etape', dueN: s.ncards, deadlineN: s.ncards + 3));
      final p = _draw(engine, s);
      expect(p.id, isNot('g.etape'));
      expect(s.stats['miss_statut'], 1);
    });

    test('S2 · `statut_ok` rouvre le chemin, pour ce chemin-là seulement', () {
      final content = _synth(
        cards: [
          _card('g.appel', roles: const ['entraineur'], speaker: 'gege', pool: false, statutOk: const ['vendu']),
          _card('g.muet', roles: const ['entraineur'], speaker: 'gege', pool: false),
        ],
        characters: [
          {'id': 'gege', 'name': 'Gégé', 'age': 60},
        ],
      );
      final engine = Engine(content);
      final s = engine.start(1);
      engine.director.initChars(s);
      s.chars['gege']!.statut = 'vendu';
      expect(engine.director.servable(s, content.cards['g.appel']), isTrue);
      expect(engine.director.servable(s, content.cards['g.muet']), isFalse);
      // La réaction suit la même règle.
      expect(engine.director.serveReaction(s, const ReactionRef(card: 'g.appel'), Rng(3)), isNotNull);
      expect(engine.director.serveReaction(s, const ReactionRef(card: 'g.muet'), Rng(3)), isNull);
    });

    test('S3 · contenu réel : aucune carte servie hors rôle, aucun locuteur muet (4 postulats × 30 graines)', () {
      final content = _real();
      final engine = Engine(content);
      final fuitesRole = <String>[];
      final fuitesStatut = <String>[];
      var servies = 0;
      for (var post = 0; post < content.postulatsByIndex.length; post++) {
        for (var i = 0; i < 30; i++) {
          var s = engine.start(i * 2654435761 & 0x7FFFFFFF, postulat: post);
          var step = 0;
          while (!s.over && step < 3000) {
            final p = s.pending!;
            if (p.kind == 'narrative') {
              servies += 1;
              final card = content.cards[p.id];
              if (card != null) {
                if (card.roles.isNotEmpty && !card.roles.contains(s.role) && fuitesRole.length < 5) {
                  fuitesRole.add('${p.payload['kind']}/${card.id} en ${s.role}');
                }
                final arcId = p.payload['arc'] as String?;
                final st = arcId == null ? null : content.arcs[arcId]?.stepById(p.payload['step'] as String? ?? '');
                if (!engine.director.speakerOk(s, card, step: st) && fuitesStatut.length < 5) {
                  fuitesStatut.add('${p.payload['kind']}/${card.id} · ${card.speaker} ${engine.director.statutOf(s, card.speaker)}');
                }
              }
            }
            s = engine.choose(s, _bot(s, step));
            step++;
          }
        }
      }
      expect(servies, greaterThan(5000));
      expect(fuitesRole, isEmpty);
      expect(fuitesStatut, isEmpty);
    }, timeout: const Timeout(Duration(minutes: 2)));
  });

  group('E · échéances', () {
    test('E1 · une étape à une carte de son échéance passe devant la Nouvelle réservée', () {
      final content = _synth(
        cards: [
          _card('nv.1', roles: const ['entraineur'], speaker: 'meneche', kind: 'nouvelle', pool: false, arc: 'nouvelle'),
          _card('nv.2', roles: const ['entraineur'], speaker: 'josiane', kind: 'nouvelle', pool: false, arc: 'nouvelle'),
          _card('et.urgente', roles: const ['entraineur'], speaker: 'vukic', kind: 'etape', pool: false),
        ],
        director: const {
          'nouvelle_slots': {'entraineur': [7, 12, 14]},
        },
      );
      final engine = Engine(content);
      final s = engine.start(1);
      // Slot 7 : la Nouvelle est due (réservée) et aucune n'a encore été servie.
      s.ncards = 6;
      s.slot = 6;
      // Fenêtre [6, 8] : au tirage n = 7 l'étape est échue au suivant.
      engine.director.enqueue(s, Scheduled(card: 'et.urgente', kind: 'etape', dueN: 6, deadlineN: 8));
      final p = _draw(engine, s);
      expect(p.id, 'et.urgente');
      expect(p.payload['band'], 2, reason: 'servie en fenêtre, pas en bande 6');
      // La Nouvelle garde sa dette : elle sort au créneau suivant.
      expect(_draw(engine, s).payload['kind'], 'nouvelle');
    });

    test('E2 · le quota `soft_steps_max` ne retient plus une étape sans créneau devant elle', () {
      final content = _synth(
        cards: [
          _card('et.a', roles: const ['entraineur'], speaker: 'vukic', kind: 'etape', pool: false),
          _card('et.b', roles: const ['entraineur'], speaker: 'brehaut', kind: 'etape', pool: false),
        ],
        director: const {'soft_steps_max': 0},
      );
      final engine = Engine(content);
      final s = engine.start(1);
      s.ncards = 5;
      s.slot = 5;
      s.softStepsThisSeason = 0; // le quota est à 0 : tout est suspendu…
      // … sauf l'étape qui n'a plus qu'un créneau (fenêtre [5, 7], n = 6).
      engine.director.enqueue(s, Scheduled(card: 'et.a', kind: 'etape', dueN: 5, deadlineN: 7));
      // Une étape encore au large : elle reste suspendue.
      engine.director.enqueue(s, Scheduled(card: 'et.b', kind: 'etape', dueN: 5, deadlineN: 12));
      final p = _draw(engine, s);
      expect(p.id, 'et.a');
      expect(p.payload['band'], 2);
      expect(s.scheduled.any((sc) => sc.card == 'et.b'), isTrue);
    });

    test('E3 · les entrées laissées échues par la fin de saison sont réétalées à l\'ouverture', () {
      final content = _synth(cards: [
        _card('et.x', roles: const ['entraineur'], speaker: 'vukic', kind: 'etape', pool: false),
        _card('et.y', roles: const ['entraineur'], speaker: 'brehaut', kind: 'etape', pool: false),
        _card('et.z', roles: const ['entraineur'], speaker: 'josiane', kind: 'etape', pool: false),
      ]);
      final engine = Engine(content);
      final s = engine.start(1);
      s.ncards = 17;
      // Trois entrées dont la fenêtre s'est fermée sur les derniers beats.
      for (final id in const ['et.x', 'et.y', 'et.z']) {
        engine.director.enqueue(s, Scheduled(card: id, kind: 'etape', dueN: 15, deadlineN: 17));
      }
      s.season = 1;
      engine.director.openSeason(s, Rng(5));
      final dues = s.scheduled.where((sc) => sc.kind == 'etape').map((sc) => sc.dueN).toList()..sort();
      expect(dues, [s.seasonStartN + 1, s.seasonStartN + 2, s.seasonStartN + 3],
          reason: 'une par créneau, pas trois échues au même tirage');
      for (final sc in s.scheduled.where((sc) => sc.kind == 'etape')) {
        expect(sc.deadlineN, greaterThan(sc.dueN));
      }
    });
  });

  group('F · fins et portes', () {
    test('F1 · une fin sans porte est une ERREUR de lint (fixture)', () async {
      final root = _repoRoot();
      final tmp = Directory('${Directory.systemTemp.path}/fusible_f1_${DateTime.now().microsecondsSinceEpoch}')..createSync(recursive: true);
      try {
        Future<void> copy(Directory from, Directory to) async {
          to.createSync(recursive: true);
          for (final x in from.listSync()) {
            final name = x.path.split('/').last;
            if (x is Directory) {
              if (name == 'build') continue;
              await copy(x, Directory('${to.path}/$name'));
            } else if (x is File) {
              x.copySync('${to.path}/$name');
            }
          }
        }

        await copy(Directory('$root/content'), Directory('${tmp.path}/content'));
        // Deux fins fabriquées : l'une sans aucune porte du tout, l'autre
        // posée par une jauge mais qui se déclare « cause: choix » — le champ
        // `cause:` est lu, il doit désigner la porte qui existe.
        final f = File('${tmp.path}/content/endings/fixture_portes.yaml');
        f.writeAsStringSync('''
endings:
  - id: fixture_orpheline
    cause: choix
    title: "L'orpheline"
    epitaph: "Personne ne pose cette fin."
  - id: fixture_par_jauge
    cause: choix
    title: "La mal déclarée"
    epitaph: "Une jauge la pose, elle dit venir d'un choix."
''');
        final roles = File('${tmp.path}/content/roles.yaml');
        var rtxt = roles.readAsStringSync();
        expect(rtxt, contains('empty: en_decoupe'));
        rtxt = rtxt.replaceFirst('empty: en_decoupe', 'empty: fixture_par_jauge');
        roles.writeAsStringSync(rtxt);
        final b = await Process.run(Platform.resolvedExecutable, ['$root/packages/tools/bin/build_content.dart'], workingDirectory: tmp.path);
        expect(b.exitCode, 0, reason: 'le build accepte : c\'est un contrôle de lint. ${b.stderr}');
        final r = await Process.run(Platform.resolvedExecutable, ['$root/packages/tools/bin/lint.dart'], workingDirectory: tmp.path);
        expect(r.exitCode, 1, reason: 'stdout: ${r.stdout}');
        final err = r.stderr.toString();
        expect(err, contains('fin « fixture_orpheline » sans porte'));
        expect(err, contains('fin « fixture_par_jauge » : « cause: choix » demande un `end: fixture_par_jauge`'));
      } finally {
        tmp.deleteSync(recursive: true);
      }
    }, timeout: const Timeout(Duration(minutes: 3)));
  });
}

String _repoRoot() {
  var dir = Directory.current;
  for (var i = 0; i < 6; i++) {
    if (File('${dir.path}/packages/tools/bin/lint.dart').existsSync()) return dir.path;
    final p = dir.parent;
    if (p.path == dir.path) break;
    dir = p;
  }
  throw StateError('racine du dépôt introuvable');
}
