/// LA VILLE (la version jouable) : `Engine.activite` applique les jauges d'une
/// activité de `content/ville.yaml` sans rien tirer — ni carte, ni aléa — et
/// peut finir une carrière comme un choix.
library;

import 'dart:convert';
import 'dart:io';

import 'package:fusible_core/fusible_core.dart';
import 'package:test/test.dart';

Content _content() {
  var dir = Directory.current;
  for (var i = 0; i < 6; i++) {
    final f = File('${dir.path}/content/build/content.json');
    if (f.existsSync()) return loadContentFromJson(f.readAsStringSync());
    final parent = dir.parent;
    if (parent.path == dir.path) break;
    dir = parent;
  }
  throw StateError('content/build/content.json introuvable — lance d\'abord: dart run fusible_tools:build_content');
}

void main() {
  final content = _content();
  final engine = Engine(content);

  test('le bundle porte la ville et ses activités', () {
    expect(content.activites, isNotEmpty);
    expect(content.ville['lieux'], isA<List<dynamic>>());
    expect(content.activites['seance']!.roles, ['entraineur']);
    expect(content.activites['seance']!.jauges, {'vestiaire': 3});
  });

  test('une activité bouge ses jauges et rien d\'autre', () {
    final s0 = engine.start(4242, postulat: 0);
    final s1 = engine.activite(s0, 'seance');
    expect(s1.gauges['vestiaire'], (s0.gauges['vestiaire']! + 3).clamp(0, 100));
    for (final g in ['tribunes', 'direction', 'caisse']) {
      expect(s1.gauges[g], s0.gauges[g], reason: g);
    }
    expect(s1.rngState, s0.rngState, reason: 'aucun tirage');
    expect(s1.pending!.id, s0.pending!.id, reason: 'la carte en attente ne change pas');
    expect(s1.swipes, s0.swipes);
    expect(s1.turn, s0.turn);
    // et l'état d'origine n'a pas bougé (clone puis applique)
    expect(jsonEncode(s0.toJson()), jsonEncode(engine.start(4242, postulat: 0).toJson()));
  });

  test('une activité inconnue ou d\'un autre rôle laisse l\'état tel quel', () {
    final s0 = engine.start(7, postulat: 0);
    expect(jsonEncode(engine.activite(s0, 'nimporte_quoi').toJson()), jsonEncode(s0.toJson()));
    expect(s0.role, 'entraineur');
    expect(jsonEncode(engine.activite(s0, 'fonte').toJson()), jsonEncode(s0.toJson()), reason: 'la fonte est au joueur');
  });

  test('la tournée de trop pousse les jauges au bord sans finir la carrière (mode histoire)', () {
    var s = engine.start(99, postulat: 0);
    for (var n = 0; n < 60; n++) {
      s = engine.activite(s, 'tournee');
    }
    expect(s.over, isFalse, reason: 'les jauges ne tuent plus (calendar.yaml jauges_fatales: false)');
    expect(s.gauges['tribunes'], 100, reason: 'mais le climat bouge : les tribunes sont au bord');
  });

  test('une carrière finie ne bouge plus', () {
    // la banqueroute (la ville la déclare) finit la carrière ; la ville n'y touche plus
    var s = engine.start(99, postulat: 0);
    s = engine.banqueroute(s);
    expect(s.over, isTrue);
    expect(s.endingId, 'co_banqueroute');
    expect(s.pending, isNotNull, reason: 'l\'écran de fin a sa carte');
    final apres = engine.activite(s, 'seance');
    expect(jsonEncode(apres.toJson()), jsonEncode(s.toJson()));
  });

  // Le grand déballage, rattaché aux histoires (content/arcs/common/deballage.yaml) :
  // en mode histoire, la parole à -5 ne finit plus rien toute seule ; elle pose
  // le dossier des promesses à la carte suivante (la variante du livre), et seul
  // le démenti finit la carrière. Une fois : la seconde chute n'a plus de scène.
  GameState jusquAuDossier(GameState s) {
    for (var i = 0; i < 12 && !s.over && !(s.pending?.id ?? '').startsWith('co.deballage.'); i++) {
      s = engine.choose(s, false);
    }
    return s;
  }

  test('le grand déballage : la parole à -5 pose le dossier, le démenti finit la carrière', () {
    var s = engine.start(99, postulat: 0);
    for (var i = 0; i < 6; i++) { s = engine.choose(s, i.isEven); }
    s.parole = -5;
    s = engine.activite(s, 'tournee');
    expect(s.over, isFalse, reason: 'la parole à -5 ne finit plus la carrière toute seule');
    s = jusquAuDossier(s);
    expect(s.over, isFalse);
    expect(s.pending!.id, 'co.deballage.h1', reason: 'Trois mille visages : Massenet tient le dossier');
    s = engine.choose(s, true); // « Publiez. Je démentirai »
    expect(s.over, isTrue);
    expect(s.endingId, 'grand_deballage');
  });

  test('le grand déballage : répondre à tout sauve la carrière, une fois', () {
    var s = engine.start(99, postulat: 0);
    for (var i = 0; i < 6; i++) { s = engine.choose(s, i.isEven); }
    s.parole = -5;
    s = engine.activite(s, 'tournee');
    s = jusquAuDossier(s);
    expect(s.pending!.id, 'co.deballage.h1');
    s = engine.choose(s, false); // « Je réponds à chaque page »
    expect(s.over, isFalse);
    expect(s.parole, greaterThanOrEqualTo(0));
    expect(s.flags, contains('deballage_avoue'));
    // la seconde chute : plus de scène, la fin tombe
    s = jusquAuDossier(s);
    s.parole = -5;
    s = engine.activite(s, 'tournee');
    if (!s.over) {
      // le dimanche d'après était encore à venir : il passe, puis la fin tombe
      for (var i = 0; i < 12 && !s.over; i++) { s = engine.choose(s, false); s.parole = -5; s = engine.activite(s, 'tournee'); }
    }
    expect(s.over, isTrue);
    expect(s.endingId, 'grand_deballage');
  });

  test('une carrière sauvegardée en ville se reprend à l\'identique', () {
    var s = engine.start(2024, postulat: 1);
    s = engine.activite(s, 'papiers');
    s = engine.choose(s, true);
    s = engine.activite(s, 'laver_maillots');
    final repris = GameState.fromJson((jsonDecode(jsonEncode(s.toJson())) as Map).cast<String, dynamic>());
    expect(jsonEncode(engine.choose(repris, false).toJson()), jsonEncode(engine.choose(s, false).toJson()));
  });

  test('la ville et le club imposés sont cosmétiques : même graine, mêmes cartes', () {
    var a = engine.start(31337, postulat: 0);
    var b = engine.start(31337, postulat: 0, ville: 'Aubérive', club: 'Racing Aubérive');
    expect(b.entities.named['ville'], 'Aubérive');
    expect(b.entities.named['club'], 'Racing Aubérive');
    expect(b.entities.named['rival'], isNot(endsWith(' Aubérive')));
    for (var i = 0; i < 40 && !a.over; i++) {
      expect(b.pending!.id, a.pending!.id, reason: 'carte $i');
      a = engine.choose(a, i.isEven);
      b = engine.choose(b, i.isEven);
    }
    expect(b.gauges, a.gauges);
  });

  test('l\'article devant le nom du club', () {
    expect(articlesDeClub('Le couloir de Racing Aubérive sent le liniment.', ['Racing Aubérive']), 'Le couloir du Racing Aubérive sent le liniment.');
    expect(articlesDeClub("Le bus d'Olympique Valdorne est là.", ['Olympique Valdorne']), "Le bus de l'Olympique Valdorne est là.");
    expect(articlesDeClub('De Stade Lyonnet à AS Portclair.', ['Stade Lyonnet', 'AS Portclair']), "Du Stade Lyonnet à l'AS Portclair.");
    expect(articlesDeClub('Il signe à Sporting Roquemont.', ['Sporting Roquemont']), 'Il signe au Sporting Roquemont.');
    expect(articlesDeClub('Le stade de Racing.', ['']), 'Le stade de Racing.');
    expect(articlesDeClub("LE BILAN D'OLYMPIQUE SAINT-ÉTOILE", ['Olympique Saint-Étoile']), "LE BILAN DE L'OLYMPIQUE SAINT-ÉTOILE");
    expect(articlesDeClub('ENTRAÎNEUR DE RACING AUBÉRIVE', ['Racing Aubérive']), 'ENTRAÎNEUR DU RACING AUBÉRIVE');
  });
}
