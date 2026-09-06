import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

bool _loaded = false;

/// Charge les vraies polices de l'app (Barlow Condensed, Manrope, Fraunces)
/// dans le banc de test : sans elles, la police de test rend chaque glyphe en
/// carré et la mesure des manchettes (34 → 28 → 24) n'a aucun sens.
Future<void> loadFusibleFonts() async {
  if (_loaded) return;
  _loaded = true;
  TestWidgetsFlutterBinding.ensureInitialized();
  const fonts = {
    'BarlowCondensed': ['BarlowCondensed-600.ttf', 'BarlowCondensed-700.ttf', 'BarlowCondensed-800.ttf'],
    'Manrope': ['Manrope-500.ttf', 'Manrope-600.ttf', 'Manrope-700.ttf', 'Manrope-800.ttf'],
    'Fraunces': ['Fraunces-600.ttf', 'Fraunces-700.ttf', 'Fraunces-900.ttf', 'Fraunces-500Italic.ttf'],
  };
  for (final e in fonts.entries) {
    final loader = FontLoader(e.key);
    for (final f in e.value) {
      loader.addFont(rootBundle.load('assets/fonts/$f'));
    }
    await loader.load();
  }
}
