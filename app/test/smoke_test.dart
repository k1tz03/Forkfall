import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:fusible_app/main.dart';
import 'package:fusible_app/services/content_service.dart';
import 'package:fusible_app/state/game_controller.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('title -> start a run -> play a few cards without crashing', (tester) async {
    final content = ContentService();
    await content.load();
    final controller = GameController(content.engine);

    await tester.pumpWidget(FusibleApp(controller: controller));
    await tester.pumpAndSettle();

    // Title screen shows the game name and at least one postulat.
    expect(find.text('FUSIBLE'), findsOneWidget);
    expect(find.text('Le promu sans un sou'), findsOneWidget);

    // Start a run.
    await tester.tap(find.text('Le promu sans un sou'));
    await tester.pumpAndSettle();

    // We should now be in the game: the HUD context line mentions a season.
    expect(find.textContaining('Saison'), findsWidgets);

    // Play up to 12 cards by tapping the right-hand control (or the single OK).
    for (var i = 0; i < 12; i++) {
      if (controller.ended) break;
      // Tap the last FilledButton on screen (right choice / OK).
      final buttons = find.byType(FilledButton);
      expect(buttons, findsWidgets);
      await tester.tap(buttons.last, warnIfMissed: false);
      await tester.pumpAndSettle();
    }

    // Still a valid frame (no thrown exception during the loop).
    expect(tester.takeException(), isNull);
  });
}
