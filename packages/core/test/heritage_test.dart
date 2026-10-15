/// TES FANTÔMES ET LE DOSSIER 1974 (docs/histoires/fantomes.md, dossier_1974.md) :
/// `Engine.heritage` pose au début d'une carrière ce que la page a gardé des carrières d'avant
/// (des drapeaux `fantome_*` / `dossier_*`, des noms `{fantome_<livre>}`). Il ne tire rien, il
/// n'écrit que sous ses deux préfixes, et une carrière sans héritage est celle d'avant, carte
/// pour carte : les goldens ne bougent pas.
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
  int postulat(String id) => content.postulatsByIndex.indexWhere((p) => p.id == id);
  final modele = postulat('le_modele');

  // Mbako, seize ans, était assis à ta place en 1990 (La Route de la Rive) ; tu t'es mis à côté.
  const souvenir = ['fantome_h4', 'fantome_h4_mbako_cote', 'dossier_carnet'];
  const noms = {'fantome_h4': 'Chastain', 'fantome_h4_annees': '1990-1993'};

  // Une carrière jouée en alternant gauche et droite ; s'arrête à la fin ou à `max` cartes.
  List<GameState> jouer(GameState s, {int max = 400}) {
    final out = <GameState>[s];
    for (var i = 0; i < max && !s.over; i++) {
      s = engine.choose(s, i.isOdd);
      out.add(s);
    }
    return out;
  }

  test('un héritage ne tire rien : ni aléa, ni carte, ni jauge', () {
    expect(modele, greaterThanOrEqualTo(0), reason: 'le postulat de L\'Oreillette');
    final s0 = engine.start(4242, postulat: modele);
    final s1 = engine.heritage(s0, drapeaux: souvenir, noms: noms);
    expect(s1.rngState, s0.rngState, reason: 'aucun tirage');
    expect(s1.pending!.id, s0.pending!.id, reason: 'la carte en attente ne change pas');
    expect(s1.pending!.text, s0.pending!.text);
    expect(s1.gauges, s0.gauges);
    expect(s1.swipes, s0.swipes);
    expect(s1.turn, s0.turn);
    for (final f in souvenir) {
      expect(s1.flags, contains(f));
    }
    expect(s1.entities.named['fantome_h4'], 'Chastain');
    expect(s1.entities.named['fantome_h4_annees'], '1990-1993');
    // clone puis applique : l'état d'origine n'a pas bougé
    expect(jsonEncode(s0.toJson()), jsonEncode(engine.start(4242, postulat: modele).toJson()));
    // et l'héritage voyage avec la sauvegarde
    final relu = GameState.fromJson((jsonDecode(jsonEncode(s1.toJson())) as Map).cast<String, dynamic>());
    expect(relu.flags, containsAll(souvenir));
    expect(relu.entities.named['fantome_h4'], 'Chastain');
  });

  test('un héritage n\'écrit que sous fantome_ et dossier_', () {
    final s0 = engine.start(7, postulat: 0);
    final s1 = engine.heritage(s0,
        drapeaux: ['histoire_h4', 'genou', 'fantome_h2', 'dossier_cle', 'fantome_', 'Fantome_h3'],
        noms: {'club': 'Racing Ailleurs', 'fantome_h2': '{toi} Mercier', 'fantome_h3_annees': 'hier', 'fantome_h5_annees': '1999-2002'});
    expect(s1.flags.difference(s0.flags), {'fantome_h2', 'dossier_cle'});
    expect(s1.entities.named['club'], s0.entities.named['club'], reason: 'un héritage ne renomme pas le club');
    expect(s1.entities.named['fantome_h2'], 'Toi Mercier', reason: 'le nom passe par normalizeName (ni accolade ni gabarit)');
    expect(s1.entities.named.containsKey('fantome_h3_annees'), isFalse, reason: 'des années, ou rien');
    expect(s1.entities.named['fantome_h5_annees'], '1999-2002');
  });

  test('le tiroir de 1990 met le carnet au dossier, sans tirer (content/ville/dossier_1974.yaml)', () {
    final s0 = engine.start(1990, postulat: 0);
    final s1 = engine.activite(s0, 'do_tiroir_aymard');
    expect(s1.flags, contains('dossier_carnet'));
    expect(s1.rngState, s0.rngState);
    expect(s1.pending!.id, s0.pending!.id);
  });

  test('une carrière finie ne reçoit plus rien', () {
    final fin = engine.banqueroute(engine.start(99, postulat: 0));
    expect(fin.over, isTrue);
    expect(jsonEncode(engine.heritage(fin, drapeaux: souvenir, noms: noms).toJson()), jsonEncode(fin.toJson()));
  });

  test('sans héritage, la carrière est celle d\'avant, carte pour carte', () {
    for (final p in [0, modele]) {
      final a = jouer(engine.start(31337, postulat: p));
      final b = jouer(engine.heritage(engine.start(31337, postulat: p)));
      expect(b.length, a.length);
      for (var i = 0; i < a.length; i++) {
        expect(jsonEncode(b[i].toJson()), jsonEncode(a[i].toJson()), reason: 'postulat $p, carte $i');
      }
    }
  });

  test('un souvenir qu\'aucune carte du livre ne lit ne change rien', () {
    // Trois mille visages (1990) n'a pas de passé : les drapeaux d'un livre plus tardif y dorment
    final a = jouer(engine.start(2024, postulat: 0));
    final b = jouer(engine.heritage(engine.start(2024, postulat: 0),
        drapeaux: ['fantome_h9', 'fantome_h9_dos', 'fantome_h8_silence'], noms: {'fantome_h9': 'Vollaire'}));
    expect(b.map((s) => s.pending?.id).toList(), a.map((s) => s.pending?.id).toList());
    expect(b.last.rngState, a.last.rngState);
  });

  test('en 2024, Mbako se souvient du matin de 1990 (L\'Oreillette)', () {
    var servies = 0;
    for (var graine = 1; graine <= 12; graine++) {
      final avec = jouer(engine.heritage(engine.start(graine, postulat: modele), drapeaux: souvenir, noms: noms));
      final carte = avec.where((s) => s.pending?.id == 'co.fantome.h8_mbako_cote').toList();
      if (carte.isNotEmpty) {
        servies++;
        expect(carte.first.pending!.text, contains('Chastain'), reason: 'le nom du fantôme est rendu');
        expect(carte.first.pending!.text, isNot(contains('{fantome')));
      }
      expect(carte.length, lessThanOrEqualTo(1), reason: 'once');
      // la carrière sans héritage ne la voit jamais
      final sans = jouer(engine.start(graine, postulat: modele));
      expect(sans.any((s) => s.pending?.id == 'co.fantome.h8_mbako_cote'), isFalse);
      expect(sans.any((s) => s.pending?.id == 'co.fantome.h8_mbako_leve'), isFalse);
    }
    printOnFailure('Mbako se souvient dans $servies carrières sur 12');
    // Le sac ne sert que les créneaux que le livre laisse : depuis que L'Oreillette se ferme au
    // bout de trois saisons (`saisons`, `fin_de_livre`), la carte sort dans 2 carrières sur 12
    // (8 sur 12 avant). Le reste du temps, la scène de la semaine fa.sc.h8_mbako_* tient le même
    // souvenir en ville. Ce test dit que la carte peut sortir ; sa fréquence suit le livre.
    expect(servies, greaterThanOrEqualTo(1), reason: 'priorité 1 : le souvenir passe devant le décor au tirage de sac');
  });
}
