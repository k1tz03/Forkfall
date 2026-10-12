/// LA VILLE VIVANTE (docs/histoires/ville_vivante.md) : un geste fait avec
/// quelqu'un donne un point de lien, au plus un par personne entre deux cartes ;
/// aux seuils, la relation monte d'un cran, et un palier programme sa carte. Une
/// habitude devient une réputation au seuil, avec sa ligne d'Almanach. Les
/// tuyaux et les services s'appliquent comme des missions d'une étape. Rien de
/// tout cela ne tire au sort.
///
/// Le contenu réel n'a pas encore ses gens : le test injecte une activité, des
/// seuils courts et deux effets dans une copie du bundle.
library;

import 'dart:convert';
import 'dart:io';

import 'package:fusible_core/fusible_core.dart';
import 'package:test/test.dart';

Map<String, dynamic> _bundle() {
  var dir = Directory.current;
  for (var i = 0; i < 6; i++) {
    final f = File('${dir.path}/content/build/content.json');
    if (f.existsSync()) return json.decode(f.readAsStringSync()) as Map<String, dynamic>;
    final parent = dir.parent;
    if (parent.path == dir.path) break;
    dir = parent;
  }
  throw StateError('content/build/content.json introuvable — lance d\'abord build_content');
}

/// Le bundle, avec un café pris avec Gégé à la buvette, des seuils courts (un,
/// deux, trois points ; trois gestes pour une réputation) et deux effets de
/// gens : un tuyau et un service qui crée une dette et refroidit le lien.
Content _content() {
  final j = _bundle();
  final ville = (j['ville'] as Map).cast<String, dynamic>();
  ville['activites'] = [
    ...(ville['activites'] as List),
    {'id': 't_cafe', 'lieu': 'buvette', 'label': 'Un café avec Gégé', 'texte': 'Le café est trop sucré.', 'avec': 'gege', 'habitude': 'comptoir'},
    {'id': 't_seul', 'lieu': 'buvette', 'label': 'Un café seul', 'texte': 'Personne ne te parle.', 'habitude': 'comptoir', 'effets': {'set': ['t_trace']}},
  ];
  ville['vivante'] = {'liens': [1, 2, 3], 'reputation': 3};
  ville['gens_effets'] = [
    {'id': 'tuyau.t_kop', 'etapes': [{'id': 'dit', 'choix': [{'id': 'ok', 'effets': {'set': ['tuyau_t_kop']}}]}]},
    {'id': 'service.gege', 'etapes': [{'id': 'rendu', 'choix': [{'id': 'oui', 'effets': {'set': ['service_gege', 'dette_gege'], 'relation': {'gege': -1}}}]}]},
  ];
  return loadContentFromJson(json.encode(j));
}

void main() {
  final content = _content();
  final engine = Engine(content);

  test('V1 · un point de lien par personne entre deux cartes ; un cran à chaque seuil ; aucun tirage', () {
    final s0 = engine.start(4242, postulat: 0);
    final r0 = s0.relations['gege'] ?? 0;
    final s1 = engine.activite(engine.activite(s0, 't_cafe'), 't_cafe');
    expect(s1.vars['lien_gege'], 1, reason: 'le second café, avant la carte suivante, ne compte pas');
    expect(s1.relations['gege'], (r0 + 1).clamp(-3, 3), reason: 'premier seuil : un point');
    expect(s1.rngState, s0.rngState, reason: 'aucun tirage');
    expect(s1.pending!.id, s0.pending!.id, reason: 'la carte en attente ne change pas');
    // une carte plus tard, le café compte de nouveau
    final s2 = engine.activite(engine.choose(s1, true), 't_cafe');
    expect(s2.vars['lien_gege'], 2);
    final r1 = engine.choose(s1, true).relations['gege'] ?? 0;
    expect(s2.relations['gege'], (r1 + 1).clamp(-3, 3), reason: 'deuxième seuil : deux points');
  });

  test('V2 · une habitude devient une réputation au seuil, avec sa ligne d\'Almanach', () {
    var s = engine.start(77, postulat: 0);
    s = engine.activite(s, 't_seul');
    s = engine.activite(s, 't_seul');
    expect(s.flags.contains('rep_comptoir'), isFalse);
    expect(s.flags.contains('t_trace'), isTrue, reason: 'l\'effet propre de l\'activité');
    s = engine.activite(s, 't_seul');
    expect(s.vars['hab_comptoir'], 3);
    expect(s.flags.contains('rep_comptoir'), isTrue);
    expect(s.journal.where((e) => e.text.contains('Corner')).length, 1, reason: 'la ligne de la réputation, une fois');
    s = engine.activite(s, 't_seul');
    expect(s.journal.where((e) => e.text.contains('Corner')).length, 1, reason: 'une réputation ne s\'écrit qu\'une fois');
  });

  test('V3 · un lien qui atteint +3 programme la carte du palier du personnage', () {
    var s = engine.start(4242, postulat: 0);
    expect(s.role, 'entraineur');
    for (var i = 0; i < 8 && (s.relations['gege'] ?? 0) < 3; i++) {
      s = engine.activite(s, 't_cafe');
      if ((s.relations['gege'] ?? 0) < 3) s = engine.choose(s, true);
    }
    expect(s.relations['gege'], 3);
    final programmee = s.scheduled.any((sc) => sc.kind == 'palier' && sc.payload['character'] == 'gege');
    final dejaVue = (s.seenCount['en.gege.faveur_insurrection'] ?? 0) > 0;
    expect(programmee || dejaVue, isTrue, reason: 'la faveur de Gégé entre dans l\'histoire');
    expect(s.journal.any((e) => e.kind == 'palier'), isTrue, reason: 'la ligne du palier +3');
  });

  test('V5 · un geste déjà compté cette semaine (`jauges: false`) nourrit le lien et l\'habitude, pas les jauges ni l\'effet propre', () {
    var s = engine.start(31, postulat: 0);
    s = engine.activite(s, 't_seul', jauges: false);
    expect(s.flags.contains('t_trace'), isFalse, reason: 'l\'effet propre attend le premier geste de la semaine');
    expect(s.vars['hab_comptoir'], 1, reason: 'le geste compte dans son habitude');
    final g0 = Map<String, int>.of(s.gauges);
    final sans = engine.activite(s, 'tournee', jauges: false), avec = engine.activite(s, 'tournee');
    expect(sans.gauges, g0, reason: 'les jauges ne bougent pas');
    expect(sans.vars['hab_largesse'], 1, reason: 'la tournée compte dans la largesse');
    expect(avec.gauges['tribunes'], (g0['tribunes']! + 3).clamp(0, 100), reason: 'le premier geste de la semaine bouge les jauges');
  });

  test('V4 · un tuyau pose son drapeau ; un service pose sa dette et peut refroidir le lien', () {
    var s = engine.start(9, postulat: 0);
    final r0 = s.relations['gege'] ?? 0;
    s = engine.mission(s, 'tuyau.t_kop', 'dit', 'ok');
    expect(s.flags.contains('tuyau_t_kop'), isTrue);
    s = engine.mission(s, 'service.gege', 'rendu', 'oui');
    expect(s.flags.containsAll(['service_gege', 'dette_gege']), isTrue);
    expect(s.relations['gege'], (r0 - 1).clamp(-3, 3));
  });
}
