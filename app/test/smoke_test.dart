import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:fusible_app/main.dart';
import 'package:fusible_app/services/content_service.dart';
import 'package:fusible_app/state/game_controller.dart';
import 'package:fusible_app/ui/widgets/une_page.dart';
import 'package:fusible_app/ui/widgets/vignette.dart';

/// Les jauges en zone rouge respirent sans fin : on n'attend donc jamais
/// `pumpAndSettle`, on avance le temps par petits pas (les tweens de la fiche
/// durent au plus 600 ms).
Future<void> settle(WidgetTester tester, {int ms = 900}) async {
  for (var t = 0; t < ms; t += 150) {
    await tester.pump(const Duration(milliseconds: 150));
  }
}

Finder byLabel(String label) => find.bySemanticsLabel(RegExp('^${RegExp.escape(label)}\$'));

Future<void> tapMagnet(WidgetTester tester, GameController controller, {bool right = true}) async {
  final p = controller.state!.pending!;
  final label = right || p.single ? p.rightLabel : p.leftLabel;
  final magnet = byLabel(label);
  expect(magnet, findsOneWidget, reason: 'magnet « $label »');
  await tester.tap(magnet, warnIfMissed: false);
  await settle(tester);
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('titre -> pochette -> quelques vignettes -> fin -> successeur', timeout: const Timeout(Duration(minutes: 2)), (tester) async {
    // Référence de la fiche : 390 × 844.
    tester.view.physicalSize = const Size(390 * 3, 844 * 3);
    tester.view.devicePixelRatio = 3;
    addTearDown(tester.view.reset);
    final semantics = tester.ensureSemantics();

    final content = ContentService();
    await content.load();
    final controller = GameController(content.engine);

    await tester.pumpWidget(FusibleApp(controller: controller));
    await settle(tester);

    // L'album fermé, les quatre pochettes, le sticker « Nouvel album ».
    expect(find.text('FUSIBLE'), findsWidgets);
    expect(find.text('Le promu sans un sou'), findsOneWidget);
    expect(byLabel('Nouvel album'), findsOneWidget);
    expect(byLabel('Pochette 2 : L\'intérimaire'), findsOneWidget);

    // Déchirer la première pochette (600 ms) démarre le run.
    await tester.tap(byLabel('Pochette 1 : Le promu sans un sou'));
    await settle(tester, ms: 1200);
    expect(controller.playing, isTrue);

    // L'écran de jeu : contexte, vignette, magnets.
    expect(find.textContaining('Saison'), findsWidgets);
    expect(find.bySemanticsLabel(RegExp(r'^Carte n° \d+, ')), findsOneWidget);

    // Trois cartes par les magnets (droite, gauche, droite).
    await tapMagnet(tester, controller, right: true);
    await tapMagnet(tester, controller, right: false);
    await tapMagnet(tester, controller, right: true);
    expect(tester.takeException(), isNull);

    // Une carte décollée au doigt : au-delà de 30 % de la largeur, elle part
    // (une réplique se décolle comme les autres, sans numéro de créneau).
    if (controller.playing && !controller.state!.pending!.single) {
      final turn = controller.state!.turn;
      await tester.drag(find.bySemanticsLabel(RegExp(r'^(Carte n° \d+|Réplique), ')), const Offset(160, 0));
      await settle(tester);
      expect(controller.state!.turn, greaterThan(turn), reason: 'le drag valide la carte');
    }

    // Jusqu'à la fin de carrière (magnet droit), puis Successeur. En chemin :
    // le Bilan est une page de journal (UnePage, un seul magnet « Tourner la
    // page »), une réplique est une vignette « Réplique » sans numéro.
    var unes = 0;
    for (var i = 0; i < 400 && controller.playing; i++) {
      final p = controller.state!.pending!;
      if (p.kind == 'bilan_une') {
        unes++;
        expect(find.byType(UnePage), findsOneWidget, reason: 'le Bilan est une page de journal');
        expect(find.byType(Vignette), findsOneWidget, reason: 'la photo de la Une est une vignette tramée');
        expect(find.textContaining('CLASSEMENT'), findsOneWidget);
        expect(byLabel('Tourner la page'), findsOneWidget);
      } else if (p.payload['kind'] == 'reaction') {
        expect(find.bySemanticsLabel(RegExp(r'^Réplique, ')), findsOneWidget);
        expect(find.textContaining('n° '), findsNothing, reason: 'une réplique n\'a pas de numéro de créneau');
      }
      await tapMagnet(tester, controller, right: i % 3 != 2);
    }
    expect(unes, greaterThan(0), reason: 'au moins un Bilan (page de journal) dans la carrière');
    expect(controller.ended, isTrue, reason: 'la carrière se termine en moins de 400 cartes');
    await settle(tester, ms: 1500);
    expect(byLabel('Successeur'), findsOneWidget);
    expect(byLabel('Rejouer'), findsOneWidget);
    expect(byLabel("Lire l'Almanach"), findsOneWidget);
    expect(find.text('Le Quotidien du Ballon'), findsOneWidget);
    // « Ce qui s'est passé » (spec variété §3.8) sous l'épitaphe.
    expect(find.text("CE QUI S'EST PASSÉ"), findsOneWidget);
    expect(find.text('HISTOIRES VÉCUES'), findsOneWidget);
    expect(tester.takeException(), isNull);

    await tester.tap(byLabel('Successeur'));
    await settle(tester);
    expect(controller.playing, isTrue);
    expect(controller.runsPlayed, 2);
    expect(tester.takeException(), isNull);
    semantics.dispose();
  });

  testWidgets(
    'objectif : « Je m\'engage » affiche le ruban de promesse',
    // Verrouille le sens de la promesse : la réponse « Promesse publique : … »
    // est celle du magnet GAUCHE, et c'est elle qui lève le ruban.
    (tester) async {
      tester.view.physicalSize = const Size(390 * 3, 844 * 3);
      tester.view.devicePixelRatio = 3;
      addTearDown(tester.view.reset);
      final semantics = tester.ensureSemantics();

      final content = ContentService();
      await content.load();
      final controller = GameController(content.engine);
      await tester.pumpWidget(FusibleApp(controller: controller));
      await settle(tester);
      await tester.tap(byLabel('Pochette 1 : Le promu sans un sou'));
      await settle(tester, ms: 1200);

      // La première carte est l'objectif de saison ; sans promesse, pas de ruban.
      final p = controller.state!.pending!;
      expect(p.kind, 'objective');
      expect(p.leftLabel, 'Je m\'engage');
      expect(find.textContaining('PROMIS À'), findsNothing);

      // « Je m'engage » (gauche) = promesse publique → ruban « Promis à … ».
      await tapMagnet(tester, controller, right: false);
      expect(controller.state!.lastAnswer, startsWith('Promesse publique'));
      expect(controller.state!.objectivePromised, isTrue, reason: '« Je m\'engage » promet');
      expect(find.textContaining('PROMIS À'), findsOneWidget, reason: 'ruban de promesse visible');
      expect(find.bySemanticsLabel(RegExp(r'^Promesse en cours : promis à ')), findsOneWidget);
      expect(tester.takeException(), isNull);
      semantics.dispose();
    },
  );
}
