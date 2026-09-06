import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:fusible_app/main.dart';
import 'package:fusible_app/services/content_service.dart';
import 'package:fusible_app/state/game_controller.dart';

Future<void> settle(WidgetTester tester, {int ms = 900}) async {
  for (var t = 0; t < ms; t += 150) {
    await tester.pump(const Duration(milliseconds: 150));
  }
}

Finder byLabel(String label) => find.bySemanticsLabel(RegExp('^${RegExp.escape(label)}\$'));

/// Le nom saisi sur la page 1 de l'album (spec variété §1.8) : il passe au
/// moteur, les cartes le citent via `{toi}` et le kicker de fin le porte ; il
/// est mémorisé pour la carrière suivante et n'entre pas dans le Code.
void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('saisie du nom → la première carte cite le nom via {toi} ou le kicker de fin', timeout: const Timeout(Duration(minutes: 2)), (tester) async {
    tester.view.physicalSize = const Size(390 * 3, 844 * 3);
    tester.view.devicePixelRatio = 3;
    addTearDown(tester.view.reset);
    final semantics = tester.ensureSemantics();

    final content = ContentService();
    await content.load();
    final controller = GameController(content.engine);
    await tester.pumpWidget(FusibleApp(controller: controller));
    await settle(tester);

    // Ouvrir l'album : la page 1 porte « Nom : ________ ».
    await tester.tap(byLabel('Nouvel album'));
    await settle(tester);
    expect(find.text('Nom :'), findsWidgets);
    final fields = find.byType(TextField);
    expect(fields, findsNWidgets(2));
    await tester.enterText(fields.at(0), 'lina');
    await tester.enterText(fields.at(1), 'nkolo');
    await tester.tap(byLabel('Genre : homme ; toucher pour changer'));
    await settle(tester, ms: 300);
    expect(controller.playerName.prenom, 'lina');
    expect(controller.playerName.genre, 'f');

    await tester.tap(byLabel('Pochette 1 : Le promu sans un sou'));
    await settle(tester, ms: 1200);
    expect(controller.playing, isTrue);
    final s = controller.state!;
    // Le moteur normalise (capitale) et accorde : Lina Nkolo, au féminin.
    expect(s.entities.prenom, 'Lina');
    expect(s.entities.nom, 'Nkolo');
    expect(s.entities.genre, 'f');
    expect(s.entities.protagonist, 'Lina Nkolo');

    // Le nom n'entre pas dans le Code : même graine, même première carte sans nom.
    final anon = content.engine.start(s.seed, postulat: s.postulat);
    expect(anon.pending!.id, s.pending!.id);
    expect(anon.rngState, s.rngState);

    // La première carte cite le nom via {toi} (objectif de saison : « {Toi}, … »),
    // sinon le kicker de fin le porte.
    final first = s.pending!.text;
    final cites = first.contains('Lina') || first.contains('Nkolo');
    if (!cites) {
      for (var i = 0; i < 400 && controller.playing; i++) {
        controller.choose(i % 3 != 2);
      }
      expect(controller.ended, isTrue);
      await settle(tester, ms: 1500);
      expect(find.textContaining('LINA NKOLO'), findsWidgets, reason: 'kicker « {prenom} {nom} · {age} ans · … »');
      expect(controller.shareText(), contains('Lina Nkolo'));
      expect(controller.shareText(hideName: true), isNot(contains('Nkolo')));
    }
    expect(tester.takeException(), isNull);

    // Successeur : le nom de famille reste (lignée textuelle), le prénom est tiré.
    if (controller.ended) {
      controller.succeed();
      expect(controller.state!.entities.nom, 'Nkolo');
      expect(controller.playerName.prenom, 'lina', reason: 'le profil garde le nom saisi');
    }
    semantics.dispose();
  });
}
