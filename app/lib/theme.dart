import 'package:flutter/material.dart';

/// Tokens de la fiche de design « L'album de vignettes » (§1). Un seul thème,
/// peint explicitement : pas de mode sombre.
class FusibleColors {
  // Marque.
  static const pelouse = Color(0xFF1F5A32);
  static const pelouse2 = Color(0xFF123D22);
  static const creme = Color(0xFFEFE4C6);
  static const creme2 = Color(0xFFE3D5AE);
  static const tampon = Color(0xFFC8262C);
  static const tampon2 = Color(0xFF8C161B);

  // Camps (fond de vignette).
  static const campTerrain = Color(0xFF2F7A44);
  static const campDirection = Color(0xFF6E1F2F);
  static const campInstances = Color(0xFF4C5E72);
  static const campSelection = Color(0xFF1F5FB4);

  // Teintes UI (sûres daltonisme).
  static const uiBleu = Color(0xFF2E6DB4);
  static const uiOrange = Color(0xFFE07A17);
  static const uiViolet = Color(0xFF7A4DAF);
  static const uiJauneVert = Color(0xFF9DBE2A);
  static const uiRose = Color(0xFFD6538B);
  static const uiArdoise = Color(0xFF5A6D7E);

  // Matières.
  static const board = Color(0xFF16382A);
  static const board2 = Color(0xFF0F2A1F);
  static const bois = Color(0xFF7A4E2A);
  static const bois2 = Color(0xFF5A371C);
  static const bois3 = Color(0xFFA47444);
  static const mur = Color(0xFF2A2E2A);
  static const alu = Color(0xFFC9CBC4);
  static const blancVignette = Color(0xFFFCFAF3);
  static const journal = Color(0xFFFBFAF4);
  static const journalBleu = Color(0xFF1C4C9A);
  static const encre = Color(0xFF1E1A14);
  static const encre2 = Color(0xFF4A423A);
  static const encre3 = Color(0xFF8A8072);
  static const or = Color(0xFFD9B85A);
  static const craie = Color(0x8CEFE4C6); // rgba(239,228,198,.55)
  static const scotch = Color(0x8CFFEC96); // rgba(255,236,150,.55)

  /// Disque de jauge vide (fond du remplissage).
  static const disqueVide = Color(0xFFE6DEC7);

  static Color camp(String? camp) => switch (camp) {
        'direction' => campDirection,
        'instances' => campInstances,
        'selection' => campSelection,
        _ => campTerrain,
      };

  static Color gauge(String id) => switch (id) {
        'vestiaire' => uiBleu,
        'tribunes' => uiOrange,
        'direction' => uiViolet,
        'caisse' => uiJauneVert,
        _ => uiRose,
      };

  /// Teinte à 78 % de sa valeur (bas du dégradé de photo).
  static Color darken78(Color c) => Color.lerp(c, Colors.black, .22)!;

  /// La photo de presse (§4.5) : `grayscale(1) contrast(1.25) brightness(1.05)`
  /// de la maquette, calculé en Dart sur chaque couleur (L' = 1,31·L − 0,13)
  /// plutôt que par un ColorFilter : le rendu est le même en natif, en
  /// canvaskit et dans le renderer web html (dont les filtres SVG travaillent
  /// en linearRGB et transmettent mal les décalages de matrice).
  static Color photoGray(Color c) {
    final l = .2126 * c.r + .7152 * c.g + .0722 * c.b;
    final v = (1.3125 * l - .131).clamp(0.0, 1.0);
    return Color.from(alpha: c.a, red: v, green: v, blue: v);
  }
}

/// Familles déclarées dans pubspec.yaml (§2).
class FusibleFonts {
  static const cond = 'BarlowCondensed';
  static const ui = 'Manrope';
  static const paper = 'Fraunces';

  // Les deux autres familles embarquées ouvrent chaque liste de repli : un
  // glyphe absent d'une police (flèches, ∞…) est pris dans une police livrée
  // avec l'app, jamais téléchargé (renderer canvaskit) ni rendu en carré.
  static const condFallback = [ui, paper, 'Roboto Condensed', 'Arial Narrow', 'Impact', 'sans-serif'];
  static const uiFallback = [cond, paper, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'];
  static const paperFallback = [cond, ui, 'Playfair Display', 'Georgia', 'Times New Roman', 'serif'];

  /// Barlow Condensed : manchettes, tampons, bandes, boutons, étiquettes.
  static TextStyle cond_(
    double size, {
    FontWeight weight = FontWeight.w800,
    double? height,
    double spacing = 0,
    Color color = FusibleColors.encre,
  }) =>
      TextStyle(
        fontFamily: cond,
        fontFamilyFallback: condFallback,
        fontSize: size,
        fontWeight: weight,
        height: height,
        letterSpacing: size * spacing,
        color: color,
      );

  /// Manrope : texte de carte, contexte, sous-titres.
  static TextStyle ui_(
    double size, {
    FontWeight weight = FontWeight.w500,
    double? height,
    double spacing = 0,
    Color color = FusibleColors.encre,
  }) =>
      TextStyle(
        fontFamily: ui,
        fontFamilyFallback: uiFallback,
        fontSize: size,
        fontWeight: weight,
        height: height,
        letterSpacing: size * spacing,
        color: color,
      );

  /// Fraunces : masthead, lede, accroches, n° de vignette, réponse précédente.
  static TextStyle paper_(
    double size, {
    FontWeight weight = FontWeight.w600,
    bool italic = false,
    double? height,
    double spacing = 0,
    Color color = FusibleColors.encre,
  }) =>
      TextStyle(
        fontFamily: paper,
        fontFamilyFallback: paperFallback,
        fontSize: size,
        fontWeight: italic ? FontWeight.w500 : weight,
        fontStyle: italic ? FontStyle.italic : FontStyle.normal,
        height: height,
        letterSpacing: size * spacing,
        color: color,
      );
}

/// Motion (§5, liste fermée).
class FusibleMotion {
  static const stamp = Duration(milliseconds: 400);
  static const page = Duration(milliseconds: 400);
  static const pack = Duration(milliseconds: 600);
  static const text = Duration(milliseconds: 120);
  static const pop = Duration(milliseconds: 200);
  static const back = Duration(milliseconds: 250);
  static const depart = Duration(milliseconds: 200);
  static const shake = Duration(milliseconds: 80);
  static const pulse = Duration(milliseconds: 1200);
  static const uneDelay = Duration(milliseconds: 500);

  /// Retour élastique après drag : cubic-bezier(.2,.8,.3,1.2).
  static const backCurve = Cubic(.2, .8, .3, 1.2);

  /// Couverture de l'album : cubic-bezier(.3,.7,.2,1).
  static const coverCurve = Cubic(.3, .7, .2, 1);

  /// Tampon qui s'abat : cubic-bezier(.2,1.2,.3,1).
  static const stampCurve = Cubic(.2, 1.2, .3, 1);

  /// True quand toutes les animations doivent être coupées (états finaux).
  static bool reduced(BuildContext context) => MediaQuery.disableAnimationsOf(context);
}

/// Le thème unique de l'application (fond crème, palette explicite, échelle §2).
ThemeData fusibleTheme() {
  const scheme = ColorScheme(
    brightness: Brightness.light,
    primary: FusibleColors.pelouse,
    onPrimary: FusibleColors.creme,
    primaryContainer: FusibleColors.pelouse2,
    onPrimaryContainer: FusibleColors.creme,
    secondary: FusibleColors.tampon,
    onSecondary: Colors.white,
    secondaryContainer: FusibleColors.tampon2,
    onSecondaryContainer: Colors.white,
    tertiary: FusibleColors.uiOrange,
    onTertiary: FusibleColors.encre,
    tertiaryContainer: FusibleColors.or,
    onTertiaryContainer: FusibleColors.encre,
    error: FusibleColors.tampon,
    onError: Colors.white,
    errorContainer: FusibleColors.tampon2,
    onErrorContainer: Colors.white,
    surface: FusibleColors.creme,
    onSurface: FusibleColors.encre,
    surfaceContainerHighest: FusibleColors.creme2,
    onSurfaceVariant: FusibleColors.encre2,
    outline: FusibleColors.encre3,
    outlineVariant: FusibleColors.creme2,
    inverseSurface: FusibleColors.board,
    onInverseSurface: FusibleColors.creme,
    inversePrimary: FusibleColors.uiJauneVert,
    shadow: Colors.black,
    scrim: Colors.black,
    surfaceTint: FusibleColors.pelouse,
  );

  final textTheme = TextTheme(
    // Tampon (52 / 1, .08em) et titre en relief (42 / .9).
    displayLarge: FusibleFonts.cond_(52, height: 1, spacing: .08),
    displayMedium: FusibleFonts.cond_(42, height: .9),
    // Manchette (34 / .95, .005em).
    displaySmall: FusibleFonts.cond_(34, height: .95, spacing: .005),
    // Masthead Fraunces 900 22.
    headlineMedium: FusibleFonts.paper_(22, weight: FontWeight.w900, height: 1, spacing: -.01, color: FusibleColors.journalBleu),
    headlineSmall: FusibleFonts.cond_(22, height: 1, spacing: .06),
    // Titre de pochette 18, nom du personnage 16 .06em, boutons-magnets 14.
    titleLarge: FusibleFonts.cond_(18, height: 1, spacing: .01),
    titleMedium: FusibleFonts.cond_(16, height: 1, spacing: .06),
    titleSmall: FusibleFonts.cond_(14, weight: FontWeight.w700, height: 1.05, spacing: .03),
    // Texte de carte Manrope 500 16/24 ; contexte Manrope 600 12/1.4.
    bodyLarge: FusibleFonts.ui_(16, height: 1.5),
    bodyMedium: FusibleFonts.ui_(12, weight: FontWeight.w600, height: 1.4, spacing: .02),
    // Lede / réponse précédente : Fraunces italique 12.
    bodySmall: FusibleFonts.paper_(12, italic: true, height: 1.35, color: FusibleColors.encre2),
    // Statut 13, étiquettes 11, fonction 10,5 .2em.
    labelLarge: FusibleFonts.cond_(13, weight: FontWeight.w700, height: 1, spacing: .06),
    labelMedium: FusibleFonts.cond_(11, weight: FontWeight.w600, height: 1, spacing: .1),
    labelSmall: FusibleFonts.cond_(10.5, weight: FontWeight.w600, height: 1, spacing: .2, color: FusibleColors.encre2),
  );

  return ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    colorScheme: scheme,
    scaffoldBackgroundColor: FusibleColors.creme,
    canvasColor: FusibleColors.creme,
    fontFamily: FusibleFonts.ui,
    textTheme: textTheme,
    splashFactory: NoSplash.splashFactory,
    focusColor: FusibleColors.uiOrange,
    snackBarTheme: SnackBarThemeData(
      backgroundColor: FusibleColors.board,
      contentTextStyle: FusibleFonts.ui_(13, weight: FontWeight.w600, color: FusibleColors.creme),
    ),
  );
}

/// « 14ᵉ » : un ordinal dont le suffixe est en exposant (réduit à 70 % et
/// remonté de 35 % du corps). Les polices embarquées n'ont pas de lettres
/// supérieures : le suffixe est un vrai texte décalé, pas un glyphe manquant.
InlineSpan ordinalSpan(int n, TextStyle style) {
  final size = style.fontSize ?? 12;
  return TextSpan(children: [
    TextSpan(text: '$n'),
    WidgetSpan(
      alignment: PlaceholderAlignment.baseline,
      baseline: TextBaseline.alphabetic,
      child: Transform.translate(
        offset: Offset(0, -size * .35),
        child: Text(n == 1 ? 'er' : 'e', style: style.copyWith(fontSize: size * .7, height: 1)),
      ),
    ),
  ]);
}
