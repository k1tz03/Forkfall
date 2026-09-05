import 'package:flutter/material.dart';

/// A restrained palette drawn from the design bible: pitch green, cream paper,
/// tampon red. The full "album de vignettes" visual identity is a later design
/// pass; this keeps the MVP legible in light and dark.
class FusibleColors {
  static const pitch = Color(0xFF1F7A3F);
  static const pitchDark = Color(0xFF4CC26F);
  static const cream = Color(0xFFF3F5F1);
  static const ink = Color(0xFF152019);
  static const red = Color(0xFFC4372E);
  static const yellow = Color(0xFFE5B63D);
}

ThemeData fusibleTheme(Brightness brightness) {
  final isDark = brightness == Brightness.dark;
  final scheme = ColorScheme.fromSeed(
    seedColor: FusibleColors.pitch,
    brightness: brightness,
  ).copyWith(
    primary: isDark ? FusibleColors.pitchDark : FusibleColors.pitch,
  );
  return ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    scaffoldBackgroundColor: isDark ? const Color(0xFF0F1512) : FusibleColors.cream,
    fontFamily: 'Roboto',
    textTheme: const TextTheme(
      displaySmall: TextStyle(fontWeight: FontWeight.w800),
      titleLarge: TextStyle(fontWeight: FontWeight.w700),
      bodyLarge: TextStyle(fontSize: 18, height: 1.4),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        minimumSize: const Size.fromHeight(56),
        textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      ),
    ),
  );
}
