/// Tests de l'étape 2 (spec variété §1.4, §1.6-1.9, §3.6) : cartes-réactions
/// (X1-X6), Une composée (U1-U3), nom du joueur (N1-N5), journal de carrière
/// et « Ce qui s'est passé » (J1-J3).
library;

import 'dart:convert';
import 'dart:io';

import 'package:fusible_core/fusible_core.dart';
import 'package:test/test.dart';

List<Object> _call(String name, Object arg) => ['call', name, [['lit', arg]]];
List<Object> _cmp(String op, Object left, num v) => ['cmp', op, left, ['lit', v]];
List<Object> _path(String p) => ['path', p];

Map<String, dynamic> _card(
  String id, {
  String? speaker,
  String kind = 'routine',
  String arc = 'divers',
  Map<String, dynamic>? left,
  Map<String, dynamic>? right,
  String? text,
  String? arcId,
  String? stepId,
  bool once = false,
  String tone = 'leger',
  List<String> roles = const ['entraineur'],
}) =>
    {
      'id': id,
      'roles': roles,
      'arc': arc,
      'tags': const <String>[],
      if (speaker != null) 'speaker': speaker,
      'weight': 1.0,
      'once': once,
      'cooldown': 12,
      'priority': 0,
      'sablier': false,
      'text': text ?? 'Texte de $id.',
      'left': {'label': 'Gauche', 'effects': left ?? {}, 'answer': 'Réponse gauche de $id.'},
      'right': {'label': 'Droite', 'effects': right ?? {}, 'answer': 'Réponse droite de $id.'},
      'tone': tone,
      'kind': kind,
      'pool': kind == 'routine',
      if (arcId != null) 'arcId': arcId,
      if (stepId != null) 'stepId': stepId,
    };

Map<String, dynamic> _role(String id) => {
      'id': id,
      'name': id,
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
    };

const _calendar = [
  {'phase': 'presaison', 'beats': ['objective', 'card', 'card', 'card']},
  {'phase': 'aller', 'beats': ['card', 'card', 'match', 'card', 'card', 'match', 'card', 'card', 'match']},
  {'phase': 'hiver', 'beats': ['card', 'card', 'card']},
  {'phase': 'retour', 'beats': ['card', 'card', 'match', 'cup', 'card', 'card', 'match', 'card', 'match']},
  {'phase': 'sprint', 'beats': ['gm_annonce', 'gm_te', 'gm_te', 'gm_te', 'aftermatch']},
  {'phase': 'bilan', 'beats': ['bilan_une', 'bilan_verdict', 'bilan_contrat', 'bilan_carrefour']},
];

/// Contenu synthétique : un script à réactions, un arc à traces, des
/// manchettes, des gabarits de journal, des adresses, une liste noire.
Content _synth({List<Map<String, dynamic>> extraCards = const [], List<Map<String, dynamic>> objectifs = const [], List<Map<String, dynamic>>? unes, Map<String, dynamic>? director}) {
  const speakers = ['josiane', 'vukic', 'brehaut', 'meneche'];
  final cards = <Map<String, dynamic>>[
    for (var i = 0; i < 40; i++) _card('r.f$i', speaker: speakers[i % 4]),
    // Le script : gauche pose re.josiane, droite pose re.gege si Gégé ne boude pas, sinon re.josiane.
    _card('sc.a1', speaker: 'josiane', kind: 'script', text: 'Josiane : « {Toi}, les comptes de l\'été. »', left: {
      'react': [
        {'card': 're.josiane'}
      ]
    }, right: {
      'react': [
        {'card': 're.gege', 'if': _cmp('>=', _path('relation.gege'), 0)},
        {'card': 're.josiane'},
      ]
    }),
    _card('sc.chance', speaker: 'josiane', kind: 'script', left: {
      'react': [
        {'card': 're.josiane', 'chance': 0.5}
      ]
    }),
    _card('sc.rien', speaker: 'josiane', kind: 'script'),
    _card('sc.role', speaker: 'aulard', kind: 'script', right: {
      'react': [
        {'card': 're.josiane'}
      ],
      'role': 'joueur',
    }, roles: const ['entraineur', 'joueur']),
    _card('re.josiane', speaker: 'josiane', kind: 'reaction', text: 'Josiane : « {Toi}, le chauffage. J\'en ai vu passer. »', left: {
      'relation': {'josiane': 1}
    }, right: {
      'relation': {'josiane': 1}
    }, roles: const ['entraineur', 'joueur']),
    _card('re.gege', speaker: 'gege', kind: 'reaction', text: '{Toi}, la tribune n\'oublie rien.', left: {'tribunes': 2}, right: {'tribunes': -2}),
    _card('re.lu', speaker: 'josiane', kind: 'reaction', text: 'Josiane a lu le journal, {toi}.', once: true, roles: const ['entraineur', 'joueur']),
    // L'arc à traces.
    _card('ar.t.s1', speaker: 'gege', kind: 'etape', arcId: 'ar.t', stepId: 's1', left: {
      'set': ['tr_x'],
      'journal': {'text': '{prenom} a choisi la gauche.', 'poids': 3, 'tags': ['tribune']},
    }, right: {
      'set': ['tr_x']
    }),
    _card('ar.t.s2', speaker: 'gege', kind: 'etape', arcId: 'ar.t', stepId: 's2'),
    ...extraCards,
  ];
  const endingIds = ['en_bus', 'en_copain', 'en_banderole', 'en_otage', 'en_placard', 'en_decoupe', 'en_coupable', 'generique', 'grand_deballage', 'jubile'];
  final j = <String, dynamic>{
    'version': 2,
    'hash': 'test',
    'roles': [_role('entraineur'), _role('joueur')],
    'cards': cards,
    'endings': [
      for (final id in endingIds) {'id': id, 'title': id, 'epitaph': 'Épitaphe de $id.'},
      {
        'id': 'en_sms',
        'title': 'Le SMS de 23h47',
        'epitaph': 'Viré{pg, select, f{e} other{}} par SMS. {prenom} {nom} a corrigé la faute.',
        'epitaph_plus': [
          {'when': _cmp('>=', _path('relation.gege'), 1), 'text': 'Gégé a découpé la Une. Il la garde.'},
          {'text': 'Personne n\'a découpé la Une.'},
        ],
      },
    ],
    'feats': const [],
    'calendar': {'entraineur': _calendar, 'joueur': _calendar},
    'names': {
      'prenoms_f': ['Anne'],
      'prenoms_m': ['Jean'],
      'noms': ['Durand'],
      'club_prefixes': ['FC'],
      'villes': ['Valmont'],
    },
    'divisions': const {},
    'characters': [
      {
        'id': 'josiane',
        'name': 'Madame Josiane',
        'genre': 'f',
        'tic': 'J\'en ai vu passer, vous savez.',
        'adresse': {
          'entraineur': {'sourire': '{prenom}', 'neutre': '{pg, select, f{madame} other{monsieur}} {nom}', 'noir': '{pg, select, f{madame} other{monsieur}} {nom}'},
          'joueur': {'sourire': '{prenom}', 'neutre': '{prenom}', 'noir': '{nom}'},
        },
      },
      {'id': 'vukic', 'name': 'Zoran Vukić'},
      {'id': 'brehaut', 'name': 'Titi Bréhaut'},
      {'id': 'meneche', 'name': 'Pierre Ménèche'},
      {'id': 'aulard', 'name': 'Jean-Marie Aulard'},
      {
        'id': 'gege',
        'name': 'Gégé',
        'tic': 'La tribune n\'oublie rien.',
        'adresse': {
          'entraineur': {'sourire': '{prenom}', 'neutre': 'coach', 'noir': '{nom}'},
          'joueur': {'sourire': 'petit', 'neutre': '{prenom}', 'noir': 'le {numero}'},
        },
      },
    ],
    'arcs': [
      {
        'id': 'ar.t',
        'title': 'L\'arc à traces',
        'kind': 'serie',
        'roles': ['entraineur'],
        'theme': 'tribune',
        'carrier': 'gege',
        'cast': ['gege'],
        'journal': 'Ouverture : {prenom} {nom} rencontre Gégé.',
        'traces': {'tr_x': '{annee} : {prenom} {nom} a posé tr_x.'},
        'epilogue': {'journal': 'L\'arc à traces s\'est refermé sur {nom}.'},
        'steps': [
          {
            'id': 's1',
            'card': 'ar.t.s1',
            'season': '0',
            'next': [
              {'step': 's2', 'in': [2, 4]}
            ],
          },
          {'id': 's2', 'card': 'ar.t.s2', 'season': '0', 'next': const []},
        ],
      }
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
        'objectifs': objectifs,
      },
      {
        'id': 'test_joueur',
        'index': 1,
        'role': 'joueur',
        'title': 'Test joueur',
        'division': 1,
        'year': 1990,
        'gauges': {'vestiaire': 50, 'tribunes': 50, 'direction': 50, 'caisse': 50},
        'force': 50,
        'objective': 'maintien',
        'president': 'aulard',
      },
    ],
    'alarms': const {},
    'director': director ?? const {},
    'journaux': [
      {'id': 'quotidien', 'nom': 'Le Quotidien du Ballon', 'ton': 'sobre', 'style': 'bleu'},
      {'id': 'gazette', 'nom': 'La Gazette Rose', 'ton': 'mechant', 'style': 'rose'},
      {'id': 'echo', 'nom': 'L\'Écho de {ville}', 'ton': 'tendre', 'style': 'local'},
    ],
    'unes': unes ??
        [
          {'id': 'une.secours1', 'journal': 'quotidien', 'priority': 0, 'poids': 1.0, 'titre': '{CLUB} : OBJECTIF {TENU}', 'sous': '{rang}e.'},
          {'id': 'une.secours2', 'journal': 'gazette', 'priority': 0, 'poids': 1.0, 'titre': 'JUIN À {VILLE}', 'sous': '{objectif} {tenu}.'},
          {'id': 'une.tenu', 'journal': 'quotidien', 'priority': 2, 'poids': 1.0, 'when': _path('bilan.tenu'), 'titre': '{NOM} TIENT', 'sous': '{rang}e place.', 'sujet': 'tribune'},
          {'id': 'une.tenu2', 'journal': 'echo', 'priority': 2, 'poids': 3.0, 'when': _path('bilan.tenu'), 'titre': '{VILLE} RESPIRE', 'sous': '{prenom} {nom}, {rang}e.', 'sujet': 'tribune'},
          {
            'id': 'une.top',
            'journal': 'gazette',
            'priority': 4,
            'poids': 1.0,
            'when': _cmp('<=', _path('bilan.rang'), 5),
            'titre': '{NOM} AU SOMMET',
            'sous': '{club}, {rang}e.',
            'sujet': 'tribune',
            'react': [
              {'card': 're.lu'}
            ],
          },
        ],
    'journal_templates': {
      'bilan_tenu': '{annee} · {club} termine {rang}e : objectif « {objectif} » tenu.',
      'bilan_manque': '{annee} · {club} termine {rang}e : objectif « {objectif} » manqué.',
      'titre': '{annee} · {club} champion.',
      'palier_moins3': '{annee} · {perso} ne parle plus à {prenom} {nom}.',
      'palier_plus3': '{annee} · {perso} doit quelque chose à {prenom} {nom}. {perso_tic}',
      'transition': '{annee} · {prenom} {nom} prend le banc de {club}.',
      'objectif': '{annee} · {objectif_titre}.',
      'fin': '{annee} · {fin_titre}.',
    },
    'blacklist': ['merde', 'connard'],
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

/// Joue jusqu'à ce que [stop] soit vrai sur l'état courant (au plus [max] swipes).
GameState _playUntil(Engine e, GameState s, bool Function(GameState) stop, {int max = 400}) {
  int i = 0;
  while (!s.over && i < max && !stop(s)) {
    s = e.choose(s, _bot(s, i));
    i++;
  }
  return s;
}

/// Après l'Objectif : enfile [card] comme script due maintenant et la tire.
GameState _atScript(Engine e, int seed, String card, {String? prenom, String? nom, String? genre, int postulat = 0}) {
  var s = e.start(seed, postulat: postulat, prenom: prenom, nom: nom, genre: genre);
  s = e.choose(s, true); // objective → première carte
  e.director.enqueue(s, Scheduled(card: card, kind: 'script', dueN: s.ncards + 1, deadlineN: s.ncards + 1));
  s.pending = e.director.drawNarrative(s, 'presaison', Rng(1));
  expect(s.pending!.id, card);
  return s;
}

void main() {
  group('X · cartes-réactions', () {
    test('X1 · servie au tirage suivant, bande 8, sans avancer beat, slot ni ncards', () {
      final e = Engine(_synth());
      final s = _atScript(e, 1, 'sc.a1');
      final beat = s.beat, slot = s.slot, n = s.ncards, story = s.storyThisSeason, lastStory = s.lastStoryN;
      final s2 = e.choose(s, false); // gauche → re.josiane
      expect(s2.pending!.id, 're.josiane');
      expect(s2.pending!.payload['kind'], 'reaction');
      expect(s2.pending!.payload['band'], 8);
      expect(s2.pending!.payload['phase'], 'presaison');
      // Le swipe de sc.a1 avance le beat comme d'habitude ; la réplique, elle, ne tire aucun créneau.
      expect(s2.beat, beat + 1);
      expect(s2.slot, slot);
      expect(s2.ncards, n);
      expect(s2.storyThisSeason, story);
      expect(s2.lastStoryN, lastStory);
      expect(s2.reaction, isNull);
      expect(s2.reactionsThisSeason, 1);
      expect(s2.lastSpeaker, 'josiane');
      expect(s2.seenCount['re.josiane'], 1);
      // Inventaire Rng (spec §3.9) : un react sans `chance` et une réaction servie = 0 appel.
      expect(s2.rngState, s.rngState, reason: 'réaction servie = 0 appel au Rng');
      // La réplique ne touche pas la file ni l'arc ; le beat reprend ensuite.
      final s3 = e.choose(s2, true);
      expect(s3.beat, s2.beat, reason: 'le swipe d\'une réaction ne ré-avance pas le beat');
      expect(s3.ncards, n + 1);
      expect(s3.slot, slot + 1);
      expect(s3.relations['josiane'], 1);
      expect(s3.lastWasReaction, isFalse);
      expect(s3.pending!.payload['kind'], isNot('reaction'));
    });

    test('X1 bis · variantes : la première dont le `if` est vrai gagne', () {
      final e = Engine(_synth());
      final s = _atScript(e, 1, 'sc.a1');
      expect(e.choose(s, true).pending!.id, 're.gege');
      final boude = _atScript(e, 1, 'sc.a1');
      boude.relations['gege'] = -1;
      expect(e.choose(boude, true).pending!.id, 're.josiane');
    });

    test('X2 · plafond reactions_max et jamais deux d\'affilée (miss_reaction)', () {
      final e = Engine(_synth(director: {'reactions_max': 1}));
      final s = _atScript(e, 2, 'sc.a1');
      final s2 = e.choose(s, false);
      expect(s2.pending!.id, 're.josiane');
      expect(s2.reactionsThisSeason, 1);
      // Une seconde réaction posée pendant la réplique (impossible par le build : testé à la main).
      s2.reaction = const ReactionRef(card: 're.gege');
      final s3 = e.choose(s2, true);
      expect(s3.pending!.payload['kind'], isNot('reaction'));
      expect(s3.stats['miss_reaction'], 1);
      expect(s3.reaction, isNull);
      // Plafond : une réaction posée au-delà de reactions_max retombe sur le beat.
      final s4 = _atScript(e, 3, 'sc.a1');
      s4.reactionsThisSeason = 1;
      final s5 = e.choose(s4, false);
      expect(s5.pending!.payload['kind'], isNot('reaction'));
      expect(s5.stats['miss_reaction'], 1);
      // Le compteur repart à l'ouverture de saison.
      expect(e.start(4).reactionsThisSeason, 0);
    });

    test('X3 · servie entre le slot 17 et le Grand Match (phase sprint)', () {
      final e = Engine(_synth());
      // Le dernier bloc de matchs suit le slot 17 ; une réaction encore en attente
      // à ce moment-là est servie juste avant le Grand Match, en phase sprint.
      var s = _playUntil(e, e.start(5), (x) => x.pending!.kind == 'match' && x.slot == 17);
      expect(s.slot, 17);
      s.reaction = const ReactionRef(card: 're.josiane');
      s = e.choose(s, true);
      expect(s.pending!.id, 're.josiane');
      expect(s.pending!.payload['phase'], 'sprint');
      expect(s.slot, 17);
      s = e.choose(s, true);
      expect(s.pending!.kind, 'gm_annonce');
      // Et une réaction posée par le dernier créneau passe avant le bloc de matchs.
      var t = _playUntil(e, e.start(5), (x) => x.pending!.kind == 'narrative' && x.slot == 17);
      t.reaction = const ReactionRef(card: 're.josiane');
      t = e.choose(t, true);
      expect(t.pending!.id, 're.josiane');
      expect(e.choose(t, true).pending!.kind, 'match');
    });

    test('X4 · posée au Carrefour : rollover, réaction avant openSeason, saison suivante intacte', () {
      final e = Engine(_synth());
      final at = _playUntil(e, e.start(6), (x) => x.pending!.kind == 'bilan_carrefour');
      expect(at.pending!.kind, 'bilan_carrefour');
      // Témoin : sans réaction.
      final control = e.choose(at, true);
      expect(control.season, 1);
      expect(control.pending!.kind, 'objective');
      // Avec une réaction en attente : le rollover a lieu, la réplique passe avant l'ouverture.
      final withRx = at.clone()..reaction = const ReactionRef(card: 're.josiane');
      final a = e.choose(withRx, true);
      expect(a.season, 1);
      expect(a.beat, 0);
      expect(a.pending!.id, 're.josiane');
      // openSeason ne s'exécute qu'au tirage suivant : les slots d'ouverture de
      // la saison close (une ouverture spontanée de maintainArcs y est inscrite)
      // n'ont pas encore été remis à zéro.
      expect(a.openingSlots, at.openingSlots, reason: 'openSeason ne s\'exécute qu\'au tirage suivant');
      expect(at.openingSlots, isNotEmpty);
      final b = e.choose(a, true);
      expect(b.pending!.kind, 'objective');
      expect(b.season, 1);
      String anchors(GameState x) => (x.scheduled.map((sc) => '${sc.card}:${sc.dueN}:${sc.deadlineN}').toList()..sort()).join(',');
      expect(anchors(b), anchors(control));
      expect(b.rngState, control.rngState);
      expect(b.openingSlots, control.openingSlots);
      expect(b.reserve, control.reserve);
    });

    test('X5 · jetée à _transitionTo (changement de rôle dans le même choix)', () {
      final e = Engine(_synth());
      final s = _atScript(e, 7, 'sc.role');
      final s2 = e.choose(s, true);
      expect(s2.role, 'joueur');
      expect(s2.reaction, isNull);
      expect(s2.pending!.payload['kind'], isNot('reaction'));
      expect(s2.journal.where((x) => x.kind == 'transition').length, 1);
    });

    test('X6 · `chance` consomme 1 tirage seulement si déclarée', () {
      final e = Engine(_synth());
      // On compare les états une fois la réplique éventuelle passée : le tirage
      // du créneau suivant est le même dans les trois cas, seule la `chance`
      // ajoute un nextDouble.
      int after(String card) {
        var s = e.choose(_atScript(e, 9, card), false);
        if (s.pending!.payload['kind'] == 'reaction') s = e.choose(s, true);
        return s.rngState;
      }

      final none = after('sc.rien');
      final plain = after('sc.a1');
      final chance = after('sc.chance');
      expect(plain, none, reason: 'un react sans chance ne touche pas le Rng');
      expect(chance, isNot(none), reason: 'un react avec chance consomme un nextDouble');
      final rng = Rng.fromState(_atScript(e, 9, 'sc.chance').rngState)..nextDouble();
      // Sans réaction servie (le tirage rate) ou avec : l'état d'après = none + 1 appel avant le tirage du créneau.
      final t = e.choose(_atScript(e, 9, 'sc.rien'), false);
      expect(t.rngState, none);
      expect(rng.state, isNot(_atScript(e, 9, 'sc.chance').rngState));
    });

    test('réactions réelles : latence 1 et jamais deux d\'affilée sur 60 carrières du promu', () {
      final content = _real();
      final e = Engine(content);
      int served = 0, lat1 = 0, consecutive = 0;
      for (var seed = 1; seed <= 60; seed++) {
        var s = e.start(seed, postulat: 0);
        int step = 0;
        bool prevPosed = false; // le swipe précédent a posé une réaction
        bool prevWasReaction = false;
        while (!s.over && step < 300) {
          final p = s.pending!;
          final isRx = p.payload['kind'] == 'reaction';
          if (isRx) {
            served++;
            if (prevPosed) lat1++;
            if (prevWasReaction) consecutive++;
            expect(p.payload['band'], 8);
            expect(content.cards[p.id]!.kind, 'reaction');
          }
          prevWasReaction = isRx;
          final right = _bot(s, step);
          if (p.kind == 'narrative') {
            prevPosed = (right ? p.rightEffects : p.leftEffects).react.isNotEmpty;
          } else if (p.kind == 'bilan_une') {
            final une = p.payload['une'] as String?;
            prevPosed = une != null && content.unes.any((u) => u.id == une && u.react.isNotEmpty);
          } else {
            prevPosed = false;
          }
          s = e.choose(s, right);
          step++;
          expect(s.reactionsThisSeason, lessThanOrEqualTo(content.director.reactionsMax));
        }
      }
      expect(served, greaterThan(0));
      expect(lat1, served, reason: 'latence 1 dans 100 % des cas');
      expect(consecutive, 0);
    });
  });

  group('U · la Une', () {
    test('U1 · bande de priorité puis pondération, {NOM} rendu, brèves hors sujet, réaction de la manchette', () {
      final e = Engine(_synth());
      // Bilan tenu, rang 1 : la bande 4 (une.top) gagne, sa réaction est posée.
      var s = _playUntil(e, e.start(11, prenom: 'Lina', nom: 'Nkolo', genre: 'f'), (x) => x.pending!.kind == 'aftermatch');
      s.world.pts = 90;
      s.journal.addAll([
        JournalEntry(season: 0, year: 1990, slot: 3, kind: 'trace', text: 'B3 tribune', poids: 2, tags: const ['tribune']),
        JournalEntry(season: 0, year: 1990, slot: 5, kind: 'carte', text: 'B5 léger', poids: 1),
        JournalEntry(season: 0, year: 1990, slot: 7, kind: 'carte', text: 'B7 lourd', poids: 3),
        JournalEntry(season: 0, year: 1990, slot: 9, kind: 'arc', text: 'B9 moyen', poids: 2),
        JournalEntry(season: 0, year: 1990, slot: 11, kind: 'trace', text: 'B11 moyen', poids: 2),
      ]);
      s = e.choose(s, true);
      expect(s.pending!.kind, 'bilan_une');
      final pl = s.pending!.payload;
      expect(pl['une'], 'une.top');
      expect(pl['titre'], 'NKOLO AU SOMMET');
      expect(pl['rang'], 1);
      expect(pl['tenu'], isTrue);
      expect(pl['journal_nom'], 'La Gazette Rose');
      expect(pl['prix'], '4,50 F');
      expect(pl['date'], 'juin 1991');
      expect(pl['breves'], ['B7 lourd', 'B9 moyen', 'B11 moyen'], reason: 'les plus lourdes, hors sujet « tribune », par slot');
      expect(pl['photo'], isNotNull);
      expect(s.lastUne, 'une.top');
      expect(s.journal.last.kind, 'une');
      expect(s.journal.last.text, 'NKOLO AU SOMMET');
      expect(s.reaction?.card, 're.lu');
      // La réaction passe avant le Verdict, puis le Verdict tombe.
      s = e.choose(s, true);
      expect(s.pending!.id, 're.lu');
      expect(s.pending!.text, 'Josiane a lu le journal, madame Nkolo.');
      s = e.choose(s, true);
      expect(s.pending!.kind, 'bilan_verdict');
      // Bilan tenu à un rang ordinaire : bande 2, pondération 1 vs 3 ; jamais le secours.
      final picks = <String>{};
      for (var seed = 20; seed < 40; seed++) {
        var t = _playUntil(e, e.start(seed), (x) => x.pending!.kind == 'aftermatch');
        t.world.pts = 50; // maintien tenu, 15e
        t = e.choose(t, true);
        picks.add(t.pending!.payload['une'] as String);
        expect(t.pending!.payload['tenu'], isTrue);
      }
      expect(picks, {'une.tenu', 'une.tenu2'});
      // Bilan manqué : seuls les secours restent ; la Une ne ment pas.
      var m = _playUntil(e, e.start(41), (x) => x.pending!.kind == 'aftermatch');
      m.world.pts = 10;
      m = e.choose(m, true);
      expect(m.pending!.payload['une'], anyOf('une.secours1', 'une.secours2'));
      expect(m.pending!.payload['tenu'], isFalse);
      expect(m.pending!.text, isNot(contains('{')));
    });

    test('U1 bis · la Une ne sert pas deux fois la même manchette d\'affilée et consomme 1 tirage', () {
      final e = Engine(_synth());
      final before = _playUntil(e, e.start(12), (x) => x.pending!.kind == 'aftermatch');
      before.world.pts = 50;
      before.lastUne = 'une.tenu2';
      final s = e.choose(before, true);
      expect(s.pending!.payload['une'], 'une.tenu');
      // Un seul weightedIndex : le Rng d'après vaut celui d'un tirage à un appel.
      final rng = Rng.fromState(before.rngState);
      rng.weightedIndex([1.0]);
      expect(s.rngState, rng.state);
    });

    test('U2 · « la Une ne ment pas » sur 200 carrières réelles', () {
      final content = _real();
      final e = Engine(content);
      int bilans = 0, descentes = 0;
      for (var seed = 1; seed <= 200; seed++) {
        var s = e.start(seed, postulat: seed % content.postulatsByIndex.length);
        int step = 0;
        while (!s.over && step < 400) {
          if (s.pending!.kind == 'bilan_une') {
            final pl = s.pending!.payload;
            expect(s.pending!.text, isNot(contains('{')));
            final next = _playUntil(e, s, (x) => x.pending!.kind != 'bilan_une' && x.pending!.kind != 'narrative', max: 3);
            if (next.over) break; // la réaction de la Une a vidé une jauge : pas de Verdict
            expect(next.pending!.kind, 'bilan_verdict', reason: 'seed $seed');
            final after = e.choose(next, true);
            expect(after.flags.contains('bilan_tenu'), pl['tenu'], reason: 'seed $seed saison ${s.season}');
            expect(after.world.rangFinal, pl['rang'], reason: 'seed $seed saison ${s.season}');
            // L'issue lue par la manchette (`bilan.outcome`) est celle que le
            // Verdict applique : la ligne d'Almanach descente / montee / titre,
            // et la division qui bouge (ou non : 18e de Division 2 = lanterne).
            final outcome = pl['outcome'] as String;
            final applied = after.journal.where((x) => x.season == s.season && x.kind == 'bilan').expand((x) => x.tags).toSet();
            for (final o in const ['descente', 'montee', 'titre']) {
              expect(applied.contains(o), outcome == o, reason: 'seed $seed saison ${s.season} : issue $outcome, journal $applied');
            }
            expect(after.world.division, s.world.division + (outcome == 'descente' ? 1 : (outcome == 'montee' ? -1 : 0)), reason: 'seed $seed saison ${s.season}');
            if (outcome == 'lanterne') expect(s.world.division, 2, reason: 'seed $seed : lanterne = dernier de Division 2');
            // Les mots de la manchette (gabarits : « {objectif} » peut rendre
            // « La montée ») ne promettent rien que le Verdict n'écrive.
            final def = content.unes.where((u) => u.id == pl['une']).firstOrNull;
            final words = def == null ? '' : '${def.titre} ${def.sous}'.toLowerCase();
            if (RegExp(r"descen(d|te|du)|étage du dessous|relégu|dernier wagon").hasMatch(words)) expect(outcome, 'descente', reason: 'seed $seed : « $words »');
            if (RegExp(r"mont(ée|e en)|étage du dessus|\bmonte\b").hasMatch(words)) expect(outcome, 'montee', reason: 'seed $seed : « $words »');
            if (RegExp(r"\bchampion(s|ne|nes)?\b").hasMatch(words)) expect(outcome, 'titre', reason: 'seed $seed : « $words »');
            if (outcome == 'descente') descentes++;
            bilans++;
            s = after;
            continue;
          }
          s = e.choose(s, _bot(s, step));
          step++;
        }
      }
      expect(bilans, greaterThan(100));
      expect(descentes, greaterThan(0), reason: 'au moins une vraie descente vérifiée');
    });

    test('U3 · `bilan.tenu` hors d\'une manchette = erreur de build (fixture)', () async {
      final root = _repoRoot();
      final tmp = Directory('${Directory.systemTemp.path}/fusible_u3_${DateTime.now().microsecondsSinceEpoch}')..createSync(recursive: true);
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
        final f = File('${tmp.path}/content/cards/entraineur/arc_kop.yaml');
        final txt = f.readAsStringSync();
        expect(txt, contains('  - id: en.kop.local\n'));
        f.writeAsStringSync(txt.replaceFirst('  - id: en.kop.local\n', '  - id: en.kop.local\n    when: "bilan.tenu"\n'));
        final r = await Process.run(Platform.resolvedExecutable, ['$root/packages/tools/bin/build_content.dart'], workingDirectory: tmp.path);
        expect(r.exitCode, 1, reason: 'stdout: ${r.stdout}\nstderr: ${r.stderr}');
        expect(r.stderr.toString(), contains('`bilan.*` hors d\'une manchette'));
      } finally {
        tmp.deleteSync(recursive: true);
      }
    }, timeout: const Timeout(Duration(minutes: 3)));
  });

  group('N · le nom', () {
    test('N1 · start(prenom, nom, genre) : même rngState, même fingerprint, mêmes cartes', () {
      final e = Engine(_synth());
      var a = e.start(21);
      var b = e.start(21, prenom: 'Lina', nom: 'Nkolo', genre: 'f');
      expect(b.entities.prenom, 'Lina');
      expect(b.entities.nom, 'Nkolo');
      expect(b.entities.genre, 'f');
      expect(b.entities.protagonist, 'Lina Nkolo');
      expect(a.entities.protagonist, anyOf('Jean Durand', 'Anne Durand'));
      expect(b.rngState, a.rngState);
      expect(b.fingerprint(), a.fingerprint());
      for (var i = 0; i < 40 && !a.over; i++) {
        expect(b.pending!.id, a.pending!.id);
        final right = _bot(a, i);
        a = e.choose(a, right);
        b = e.choose(b, right);
        expect(b.fingerprint(), a.fingerprint(), reason: 'carte $i');
      }
      // Le joueur reçoit un dossard, après tous les tirages existants.
      final j = e.start(21, postulat: 1);
      expect(int.parse(j.entities.named['numero']!), inInclusiveRange(1, 30));
    });

    test('N2 · normalisation : casse, particules, coupure, caractères retirés', () {
      expect(normalizeName('da silva'), 'Da Silva');
      expect(normalizeName('lina  da silva'), 'Lina da Silva');
      expect(normalizeName('jean-luc'), 'Jean-Luc');
      expect(normalizeName("d'angelo"), "D'Angelo");
      expect(normalizeName('  bréhaut  '), 'Bréhaut');
      expect(normalizeName('Van Der Berg'), 'Van der Berg');
      expect(normalizeName('Nk{o}lo 42 <>'), 'Nkolo');
      expect(normalizeName('abcdefghijklmnopqrstuvwxyz', max: 16), 'Abcdefghijklmnop');
      expect(normalizeName('{{}}'), '');
      expect(normalizeName('McDonald'), 'McDonald');
    });

    test('N3 · {NOM} garde les accents, {initiales}', () {
      expect(upperName('Bréhaut'), 'BRÉHAUT');
      expect(initials('Lina', 'Nkolo'), 'LN');
      expect(initials('élodie', 'da Silva'), 'ÉD');
      final e = Engine(_synth());
      final s = e.start(3, prenom: 'Élodie', nom: 'Bréhaut', genre: 'f');
      expect(formatText('{NOM} · {initiales} · {prenom} {nom} · {CLUB} · {VILLE} · {saison} · {annee}', s), 'BRÉHAUT · ÉB · Élodie Bréhaut · FC VALMONT · VALMONT · 1 · 1990');
    });

    test('N4 · liste noire → nom tiré ; vide → nom tiré', () {
      expect(isBlacklisted('Merde', ['merde']), isTrue);
      expect(isBlacklisted('Mérdé-Bonnet', ['merde']), isTrue);
      expect(isBlacklisted('Merdeau', ['merde']), isFalse);
      final e = Engine(_synth());
      final s = e.start(3, prenom: 'Connard', nom: 'Merde');
      expect(s.entities.prenom, 'Jean');
      expect(s.entities.nom, 'Durand');
      final v = e.start(3, prenom: '', nom: '   ');
      expect(v.entities.protagonist, 'Jean Durand');
      expect(v.rngState, s.rngState);
    });

    test('N5 · {toi} par locuteur et relation, {Toi} capitalisé, défauts coach / {prenom}', () {
      final content = _synth();
      final e = Engine(content);
      final s = e.start(3, prenom: 'Lina', nom: 'Nkolo', genre: 'f');
      String say(String card, int rel, {String role = 'entraineur'}) {
        s.role = role;
        s.relations[content.cards[card]!.speaker!] = rel;
        return e.director.toPending(s, content.cards[card]!, 'aller', Rng(1), const {}).text;
      }

      expect(say('re.gege', 1), 'Lina, la tribune n\'oublie rien.');
      expect(say('re.gege', 0), 'Coach, la tribune n\'oublie rien.');
      expect(say('re.gege', -1), 'Nkolo, la tribune n\'oublie rien.');
      expect(say('re.josiane', 0), 'Josiane : « Madame Nkolo, le chauffage. J\'en ai vu passer. »');
      expect(say('re.josiane', 2), 'Josiane : « Lina, le chauffage. J\'en ai vu passer. »');
      s.entities.named['numero'] = '9';
      expect(say('re.gege', -2, role: 'joueur'), 'Le 9, la tribune n\'oublie rien.');
      // Sans adresse : coach pour l'entraîneur, le prénom pour le joueur.
      s.role = 'entraineur';
      expect(formatText('{Toi} ?', s), 'Coach ?');
      s.role = 'joueur';
      expect(formatText('{toi} ?', s), 'Lina ?');
      expect(formatText('{toi}', s, adresse: 'mon {prenom}'), 'mon Lina');
    });
  });

  group('N · élision', () {
    test('N6 · « de » / « que » devant un placeholder à voyelle deviennent « d\' » / « qu\' »', () {
      final e = Engine(_synth());
      final a = e.start(3, prenom: 'Ethan', nom: 'Aubry');
      expect(formatText('la valise de {nom}, obtenu de {prenom}', a), 'la valise d\'Aubry, obtenu d\'Ethan');
      expect(formatText('De {prenom} à {nom}', a), 'D\'Ethan à Aubry');
      expect(formatText('plus que {prenom}', a), 'plus qu\'Ethan');
      expect(formatText('le code de {nom}', a), 'le code d\'Aubry');
      expect(formatText('« de {prenom} »', a), '« d\'Ethan »');
      // Pas d'élision devant une consonne, ni sur un mot qui finit par « de ».
      final b = e.start(3, prenom: 'Lina', nom: 'Vasseur');
      expect(formatText('la valise de {nom}, obtenu de {prenom}', b), 'la valise de Vasseur, obtenu de Lina');
      expect(formatText('tout le monde {prenom}', a), 'tout le monde Ethan');
      expect(formatText('L\'Écho de {ville}', a), 'L\'Écho de Valmont');
    });
  });

  group('J · journal de carrière', () {
    test('J1 · traces écrites au set (une fois), effet journal, ouverture d\'arc, compaction à 12, fingerprint', () {
      final e = Engine(_synth(director: {'journal_par_saison': 12}));
      var s = e.start(31, prenom: 'Lina', nom: 'Nkolo', genre: 'f');
      s = e.choose(s, true);
      final d = e.director;
      d.armArc(s, e.content.arcs['ar.t']!, d.ctx(s, 'presaison'), dueN: s.ncards + 1, deadlineN: s.ncards + 1);
      expect(s.journal.map((x) => x.kind), ['arc']);
      expect(s.journal.first.text, 'Ouverture : Lina Nkolo rencontre Gégé.');
      s.pending = d.drawNarrative(s, 'presaison', Rng(1));
      expect(s.pending!.id, 'ar.t.s1');
      final fpBefore = s.fingerprint();
      s = e.choose(s, false); // set tr_x + journal poids 3
      final trace = s.journal.where((x) => x.kind == 'trace').toList();
      expect(trace.length, 1);
      expect(trace.first.text, '1990 : Lina Nkolo a posé tr_x.');
      expect(trace.first.tags, ['tribune', 'ar.t', 'tr_x']);
      expect(trace.first.poids, 2);
      final carte = s.journal.where((x) => x.kind == 'carte').toList();
      expect(carte.single.text, 'Lina a choisi la gauche.');
      expect(carte.single.poids, 3);
      expect(s.fingerprint(), isNot(fpBefore));
      expect(s.fingerprint(), contains('|j3'));
      expect(evalWhen(_call('journal_has', 'tr_x'), EvalContext(s, 'aller')), isTrue);
      expect(evalWhen(_call('journal_has', 'absent'), EvalContext(s, 'aller')), isFalse);
      // Reposer le drapeau n'écrit pas une seconde ligne.
      final n = s.journal.length;
      d.enqueue(s, Scheduled(card: 'ar.t.s1', kind: 'etape', arc: 'ar.t', step: 's1', dueN: s.ncards + 1, deadlineN: s.ncards + 1));
      s.pending = d.drawNarrative(s, 'aller', Rng(2));
      expect(s.pending!.id, 'ar.t.s1');
      s = e.choose(s, true);
      expect(s.journal.where((x) => x.kind == 'trace').length, 1);
      expect(s.journal.length, n);
      // Compaction : 20 entrées en S0 → les 12 plus lourdes, dans l'ordre.
      s.journal.clear();
      for (var i = 1; i <= 20; i++) {
        s.journal.add(JournalEntry(season: 0, year: 1990, slot: i, kind: 'carte', text: 'e$i', poids: i % 4 == 0 ? 3 : (i % 2 == 0 ? 2 : 1)));
      }
      s.season = 1;
      d.openSeason(s, Rng(1));
      final kept = s.journal.where((x) => x.season == 0).toList();
      expect(kept.length, 12);
      expect(kept.where((x) => x.poids == 3).length, 5);
      expect(kept.where((x) => x.poids == 2).length, 5);
      expect(kept.where((x) => x.poids == 1).map((x) => x.text), ['e1', 'e3'], reason: 'à poids égal, les premiers slots');
      expect(kept.map((x) => x.slot).toList(), kept.map((x) => x.slot).toList()..sort(), reason: 'ordre d\'écriture conservé');
      // Sérialisation à ordre stable.
      final back = GameState.fromJson(json.decode(json.encode(s.toJson())) as Map<String, dynamic>);
      expect(json.encode(back.toJson()), json.encode(s.toJson()));
      expect(back.journal.length, s.journal.length);
      expect(back.fingerprint(), s.fingerprint());
    });

    test('J2 · « Ce qui s\'est passé » : 6 entrées (-poids, -season, slot), epitaph_plus, histoires', () {
      final e = Engine(_synth());
      final s = _atScript(e, 32, 'sc.rien', prenom: 'Lina', nom: 'Nkolo', genre: 'f');
      s.journal.clear();
      s.journal.addAll([
        const JournalEntry(season: 0, year: 1990, slot: 4, kind: 'carte', text: 'A', poids: 1),
        const JournalEntry(season: 0, year: 1990, slot: 6, kind: 'trace', text: 'B', poids: 2),
        const JournalEntry(season: 0, year: 1990, slot: 9, kind: 'une', text: 'UNE 0', poids: 3, arc: 'une.tenu'),
        const JournalEntry(season: 1, year: 1991, slot: 2, kind: 'trace', text: 'C', poids: 2),
        const JournalEntry(season: 1, year: 1991, slot: 8, kind: 'bilan', text: 'D', poids: 3),
        const JournalEntry(season: 1, year: 1991, slot: 12, kind: 'carte', text: 'E', poids: 1),
        const JournalEntry(season: 2, year: 1992, slot: 1, kind: 'carte', text: 'F', poids: 1),
        const JournalEntry(season: 2, year: 1992, slot: 3, kind: 'trace', text: 'G', poids: 2),
      ]);
      s.arcs['ar.t'] = ArcState(status: 'done', step: 's2', plays: 1);
      s.relations['gege'] = 2;
      s.gauges['direction'] = 0;
      final f = e.choose(s, true);
      expect(f.over, isTrue);
      expect(f.endingId, 'en_sms');
      final pl = f.pending!.payload;
      expect(f.pending!.text, contains('Virée par SMS. Lina Nkolo a corrigé la faute.'));
      expect(pl['epitaph_plus'], 'Gégé a découpé la Une. Il la garde.');
      expect(f.pending!.text, endsWith('Gégé a découpé la Une. Il la garde.'));
      expect(f.journal.last.kind, 'fin');
      expect(f.journal.last.poids, 5);
      expect(f.journal.last.text, '1990 · Le SMS de 23h47.');
      final six = (pl['journal'] as List).cast<Map<String, dynamic>>();
      expect(six.length, 6);
      // Les 6 plus lourdes : fin (5), UNE 0 (3), D (3), G (2, S2), C (2, S1), B (2, S0) — rendues dans l'ordre chronologique.
      expect(six.map((x) => x['text']).toSet(), {'1990 · Le SMS de 23h47.', 'UNE 0', 'D', 'G', 'C', 'B'});
      expect(six.map((x) => x['text']).toList(), ['B', 'UNE 0', 'C', 'D', 'G', '1990 · Le SMS de 23h47.'], reason: 'ordre chronologique, la fin en dernier');
      expect(pl['histoires'], ['L\'arc à traces']);
      expect(pl['unes'], ['une.tenu']);
      expect(pl['nom'], 'Lina Nkolo');
    });

    test('J3 · objectif atteint : unlocked, ligne de journal, payload de fin', () {
      final e = Engine(_synth(objectifs: [
        {'id': 'o1', 'titre': 'La trace posée', 'when': _call('flag', 'tr_x'), 'indice': 'Pose la trace.'},
        {'id': 'o2', 'titre': 'Jamais', 'when': _call('flag', 'jamais'), 'indice': 'Introuvable.'},
      ]));
      var s = e.start(33);
      s.flags.add('tr_x');
      s = _playUntil(e, s, (x) => x.pending!.kind == 'bilan_verdict');
      s = e.choose(s, true);
      expect(s.unlocked, contains('objectif:o1'));
      final o = s.journal.where((x) => x.kind == 'objectif').toList();
      expect(o.single.text, '1990 · La trace posée.');
      expect(o.single.poids, 3);
      expect(o.single.tags, ['objectif', 'o1']);
      expect(s.journal.where((x) => x.kind == 'bilan').length, 1);
      s.gauges['direction'] = 0;
      s = e.choose(s, true);
      expect(s.over, isTrue);
      final objs = (s.pending!.payload['objectifs'] as List).cast<Map<String, dynamic>>();
      expect(objs.map((x) => x['atteint']), [true, false]);
      expect(s.journal.where((x) => x.kind == 'objectif').length, 1, reason: 'pas de doublon à la fin');
    });
  });

  group('J · journal de carrière (performance)', () {
    test('J4 · 360 entrées d\'Almanach : le clone du journal coûte moins de 1 ms par swipe (contenu réel)', () {
      final e = Engine(_real());
      // Une carrière de 30 saisons compactée : 30 × 12 entrées immuables,
      // greffées sur des carrières réelles jusqu'à 200 swipes chronométrés.
      GameState fresh(int seed) {
        final s = e.start(seed, postulat: 0);
        for (var season = 0; season < 30; season++) {
          for (var i = 1; i <= 12; i++) {
            s.journal.add(JournalEntry(season: season, year: 1990 + season, slot: i, kind: 'carte', text: 'Saison $season, ligne $i.', poids: 1 + i % 3));
          }
        }
        expect(s.journal.length, 360);
        return s;
      }

      var s = fresh(7);
      for (var i = 0; i < 20 && !s.over; i++) {
        s = e.choose(s, _bot(s, i)); // échauffement
      }
      final sw = Stopwatch();
      int swipes = 0, seed = 8;
      while (swipes < 200) {
        if (s.over) s = fresh(seed++);
        sw.start();
        s = e.choose(s, _bot(s, swipes));
        sw.stop();
        swipes++;
        expect(s.journal.length, greaterThanOrEqualTo(360 - 12), reason: 'seule la saison courante est compactée en cours de route');
      }
      final perSwipe = sw.elapsedMicroseconds / swipes / 1000;
      expect(perSwipe, lessThan(1.0), reason: '${perSwipe.toStringAsFixed(3)} ms par swipe à ${s.journal.length} entrées');
    });
  });

  group('L · lint', () {
    test('L1 · {toi} sans speaker, nom dans un libellé, titre > 44 rendu, placeholder inconnu = erreurs de lint (fixture)', () async {
      final root = _repoRoot();
      final tmp = Directory('${Directory.systemTemp.path}/fusible_l1_${DateTime.now().microsecondsSinceEpoch}')..createSync(recursive: true);
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
        // 1. Une Nouvelle sans locuteur qui dit {toi} ; 2. le nom dans un libellé.
        final nv = File('${tmp.path}/content/cards/common/co_nouvelles.yaml');
        var txt = nv.readAsStringSync();
        expect(txt, contains('    speaker: meneche\n    cooldown: 25\n    text: "Massenet : « Le grand coach du Nord'));
        txt = txt.replaceFirst('    speaker: meneche\n    cooldown: 25\n    text: "Massenet : « Le grand coach du Nord',
            '    cooldown: 25\n    text: "Massenet : « Le grand coach du Nord, {toi},');
        expect(txt, contains('left: {label: "Noter"'));
        txt = txt.replaceFirst('left: {label: "Noter"', 'left: {label: "Merci {prenom}"');
        nv.writeAsStringSync(txt);
        // 3. Un titre de Une trop long une fois rendu ; 4. un placeholder inconnu dans un sous-titre.
        final unes = File('${tmp.path}/content/unes.yaml');
        var u = unes.readAsStringSync();
        expect(u, contains('    titre: "LE BILAN DE {NOM}"\n'));
        u = u.replaceFirst('    titre: "LE BILAN DE {NOM}"\n', '    titre: "LE BILAN DE {NOM}, ENTRAÎNEUR DE {CLUB}"\n');
        u = u.replaceFirst('{club} termine {rang}e.', '{club} termine {rangg}e.');
        unes.writeAsStringSync(u);
        final b = await Process.run(Platform.resolvedExecutable, ['$root/packages/tools/bin/build_content.dart'], workingDirectory: tmp.path);
        expect(b.exitCode, 0, reason: 'le build accepte (ce sont des contrôles de lint) : ${b.stderr}');
        final r = await Process.run(Platform.resolvedExecutable, ['$root/packages/tools/bin/lint.dart'], workingDirectory: tmp.path);
        expect(r.exitCode, 1, reason: 'stdout: ${r.stdout}\nstderr: ${r.stderr}');
        final err = r.stderr.toString();
        expect(err, contains('co.nouvelle.coach_vire_ailleurs: `{toi}` sans `speaker`'));
        expect(err, contains('co.nouvelle.arbitrage_video/left: le nom du joueur n\'entre jamais dans un libellé'));
        expect(err, contains('unes.yaml/une.generic.bilan: titre de'));
        expect(err, contains('caractères rendu (> 44)'));
        expect(err, contains('unes.yaml/une.generic.bilan: placeholder inconnu {rangg}'));
      } finally {
        tmp.deleteSync(recursive: true);
      }
    }, timeout: const Timeout(Duration(minutes: 3)));
  });
}
