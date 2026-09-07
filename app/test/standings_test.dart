import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:fusible_app/main.dart';
import 'package:fusible_app/services/content_service.dart';
import 'package:fusible_app/state/game_controller.dart';
import 'package:fusible_app/ui/widgets/standings_table.dart';
import 'package:fusible_app/ui/widgets/vignette.dart';
import 'package:fusible_core/fusible_core.dart';

import 'helpers/fonts.dart';

/// Le test de rendu du classement (retour joueur : « parfois on parle de
/// classement mais cela n'est indiqué nulle part, aucune carte avec le
/// classement n'apparaît »). Il échoue si une carte `classement` s'affiche
/// sans tableau — c'est exactement l'état d'avant ce lot, où la carte sortait
/// comme une vignette de dialogue et commentait un tableau invisible.
Future<void> settle(WidgetTester tester, {int ms = 900}) async {
  for (var t = 0; t < ms; t += 150) {
    await tester.pump(const Duration(milliseconds: 150));
  }
}

Finder byLabel(String label) => find.bySemanticsLabel(RegExp('^${RegExp.escape(label)}\$'));

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('une carte Classement affiche le tableau, pas une vignette',
      timeout: const Timeout(Duration(minutes: 3)), (tester) async {
    await loadFusibleFonts();
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

    var vus = 0;
    for (var i = 0; i < 400 && controller.playing; i++) {
      final p = controller.state!.pending!;
      final s = controller.state!;
      if (p.kind == 'classement') {
        vus++;
        final rows = standingRowsFrom(p.payload['standings']);
        expect(rows.length, 6, reason: 'le moteur sert six lignes autour de la tienne');
        // Le tableau est là, et il a pris la place de la vignette.
        expect(find.byType(StandingsSheet), findsOneWidget, reason: 'la carte Classement montre un tableau');
        expect(find.byType(Vignette), findsNothing, reason: 'pas de portrait sur une carte Classement');
        for (final r in rows) {
          expect(find.text(r.club), findsWidgets, reason: 'la ligne « ${r.club} » est affichée');
        }
        // Ta ligne dit ce que le moteur compte, et rien d'autre.
        final moi = rows.firstWhere((r) => r.toi);
        expect(moi.rang, s.world.standingRank);
        expect(moi.pts, s.world.pts);
        expect(find.text('${moi.pts}'), findsWidgets);
        // « Tout le tableau » ouvre les dix-huit clubs, et se referme.
        await tester.tap(find.text('TOUT LE TABLEAU'));
        await settle(tester);
        final complet = content.engine.standingsOf(s);
        expect(complet.length, kStandingsClubs);
        expect(find.text('REFERMER LE CLASSEMENT'), findsOneWidget);
        expect(find.text(complet.first.club), findsWidgets, reason: 'le leader du championnat est visible');
        await tester.tap(find.text('REFERMER LE CLASSEMENT'));
        await settle(tester);
      }
      await tester.tap(byLabel(p.single ? p.rightLabel : (i % 4 != 3 ? p.rightLabel : p.leftLabel)), warnIfMissed: false);
      await settle(tester);
      if (vus >= 2) break;
    }
    expect(vus, greaterThan(0), reason: 'aucune carte Classement atteinte dans cette carrière');
    expect(tester.takeException(), isNull);
    semantics.dispose();
  });

  testWidgets('avant la première journée, le bandeau ne montre pas de rang',
      timeout: const Timeout(Duration(minutes: 2)), (tester) async {
    await loadFusibleFonts();
    tester.view.physicalSize = const Size(390 * 3, 844 * 3);
    tester.view.devicePixelRatio = 3;
    addTearDown(tester.view.reset);

    final content = ContentService();
    await content.load();
    final controller = GameController(content.engine);
    await tester.pumpWidget(FusibleApp(controller: controller));
    await settle(tester);
    await tester.tap(byLabel('Pochette 1 : Le promu sans un sou'));
    await settle(tester, ms: 1200);

    // Première carte de la carrière : aucun match joué, donc aucun rang — et
    // aucune journée dans le bandeau.
    expect(controller.state!.world.blocks, 0);
    expect(find.textContaining('—'), findsWidgets, reason: 'le rang se tait tant que le championnat n\'a pas commencé');
    expect(find.textContaining('\u00A0J\u00A0'), findsNothing, reason: 'pas de journée avant la première journée');
    // Et le rang n'est pas affiché du tout : ni « 10e », ni aucun autre.
    expect(find.textContaining(RegExp(r'\d+\s*(e|ᵉ)\b')), findsNothing, reason: 'aucun rang inventé au coup d\'envoi');
  });
}
