import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:fusible_app/services/content_service.dart';
import 'package:fusible_app/theme.dart';
import 'package:fusible_app/ui/widgets/une_page.dart';
import 'package:fusible_app/ui/widgets/vignette.dart';

import 'helpers/fonts.dart';

/// La page de journal du Bilan (spec variété §1.6, §3.8) sur un payload
/// synthétique : manchette longue → corps réduit, 3 brèves, photo tramée.
void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  Future<void> pumpPage(WidgetTester tester, UneData data) async {
    // Les vraies polices : la réduction de corps se mesure en Barlow Condensed.
    await loadFusibleFonts();
    tester.view.physicalSize = const Size(390 * 3, 844 * 3);
    tester.view.devicePixelRatio = 3;
    addTearDown(tester.view.reset);
    await tester.pumpWidget(MaterialApp(
      theme: fusibleTheme(),
      home: Scaffold(
        backgroundColor: FusibleColors.board,
        body: SingleChildScrollView(padding: const EdgeInsets.all(13), child: UnePage(data: data)),
      ),
    ));
    await tester.pump(const Duration(milliseconds: 300));
  }

  double headlineSize(WidgetTester tester, String text) {
    final w = tester.widget<Text>(find.text(text.toUpperCase()));
    return w.style!.fontSize!;
  }

  const breves = [
    'Josiane a rangé le journal dans le tiroir du bas.',
    'Lian Mbako, 16 ans, lancé en pro contre l\'avis du président.',
    'Le kop a chanté le nom du coach pendant vingt minutes.',
  ];

  testWidgets('manchette longue → corps réduit, 3 brèves, photo, pied', (tester) async {
    final content = ContentService();
    await content.load();
    const long = 'Nkolo, le miracle de Bretagne : un promu sans un sou qui finit sur le podium malgré tout';
    const data = UneData(
      journalId: 'quotidien',
      journalNom: 'Le Quotidien du Ballon',
      style: 'bleu',
      titre: long,
      sous: 'Le président parle de bâtisseur, le vestiaire de miracle.',
      breves: breves,
      date: 'juin 1991',
      prix: '4,50 F',
      annee: 1990,
      season: 1,
      club: 'Étoile Bretagne',
      division: 1,
      rang: '3',
      tenu: true,
      objectif: 'Maintien',
      photo: VignetteData(characterId: 'gege', expression: 'sourire', camp: 'terrain', name: 'Gégé', label: 'Capo du kop', number: 12),
      photoAnswer: 'On a hésité sur l\'accent.',
    );
    await pumpPage(tester, data);
    expect(tester.takeException(), isNull);

    // Le masthead, la date et le prix.
    expect(find.text('Le Quotidien du Ballon'), findsOneWidget);
    expect(find.text('juin 1991'), findsOneWidget);
    expect(find.text('4,50 F'), findsOneWidget);
    // La manchette dépasse 3 lignes à 34 : elle passe à 28 ou 24, et tient alors en 3 lignes.
    expect(headlineSize(tester, long), lessThan(34));
    final rendered = tester.widget<Text>(find.text(long.toUpperCase()));
    final box = tester.getSize(find.text(long.toUpperCase()));
    final tp = TextPainter(text: TextSpan(text: long.toUpperCase(), style: rendered.style), textDirection: TextDirection.ltr)..layout(maxWidth: box.width);
    expect(tp.computeLineMetrics().length, lessThanOrEqualTo(3));
    // Les 3 brèves, la photo (vignette N&B tramée) et sa légende.
    for (final b in breves) {
      expect(find.text(b), findsOneWidget);
    }
    expect(find.byType(Vignette), findsOneWidget);
    expect(tester.widget<Vignette>(find.byType(Vignette)).grayscale, isTrue);
    expect(find.byType(PressPhoto), findsOneWidget);
    expect(find.textContaining('On a hésité sur l\'accent.'), findsOneWidget);
    // Le pied « Classement · Objectif ».
    expect(find.textContaining('CLASSEMENT'), findsOneWidget);
    expect(find.textContaining('OBJECTIF MAINTIEN'), findsOneWidget);
    expect(find.textContaining('TENU'), findsOneWidget);
  });

  testWidgets('manchette courte : corps 34 ; sans brève, texte de secours', (tester) async {
    const short = 'Un fusible, ça se change';
    const data = UneData(
      journalNom: 'La Gazette Rose',
      style: 'rose',
      titre: short,
      date: 'juin 1992',
      prix: '4,50 F',
      annee: 1991,
      rang: '17',
      tenu: false,
      objectif: 'Maintien',
    );
    await pumpPage(tester, data);
    expect(tester.takeException(), isNull);
    expect(headlineSize(tester, short), 34);
    expect(find.textContaining("Rien à signaler"), findsOneWidget);
    expect(find.textContaining('MANQUÉ'), findsOneWidget);
    expect(find.textContaining("(Photo d'archives)"), findsOneWidget);
  });
}
