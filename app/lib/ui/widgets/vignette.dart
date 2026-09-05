import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../theme.dart';
import 'paper.dart';
import 'portrait.dart';

/// Ce que l'écran doit savoir pour coller une vignette (§4.1).
class VignetteData {
  final String characterId; // id de characters.yaml, ou 'coach' / 'joueur'
  final String expression; // sourire | neutre | noir
  final String? camp; // terrain | direction | instances | selection ; null = toi
  final String genre; // 'm' | 'f' (pour coach / joueur)
  final String name;
  final String label;
  final int number;
  final bool sablier;
  final String? kindTag; // Alarme / Nouvelle / Événement / Face à face / Nouvelles du passé

  const VignetteData({
    required this.characterId,
    this.expression = 'neutre',
    this.camp,
    this.genre = 'm',
    required this.name,
    this.label = '',
    required this.number,
    this.sablier = false,
    this.kindTag,
  });

  bool get isSelf => characterId == 'coach' || characterId == 'joueur';

  /// Libellé lisible : « Carte n° X, {nom}, {fonction} ».
  String get semanticsLabel => 'Carte n° $number, $name${label.isEmpty ? '' : ', ${label.toLowerCase()}'}';

  /// Le tampon de genre de la carte (§6 : kind → texte), null si aucun.
  static String? kindTagFor(String? kind) => switch (kind) {
        'alarme' => 'Alarme',
        'nouvelle' => 'Nouvelle',
        'evenement' => 'Événement',
        'palier' => 'Face à face',
        'passe' => 'Nouvelles du passé',
        _ => null,
      };
}

/// Forme de la vignette : bords légèrement gauches et coin supérieur droit
/// coupé sur `peel` (le `--cut` de la maquette).
class VignetteClipper extends CustomClipper<Path> {
  final double peel;
  const VignetteClipper(this.peel);

  static Path cut(Size s, double peel) => Path()
    ..moveTo(s.width * .005, s.height * .003)
    ..lineTo(s.width - peel, 0)
    ..lineTo(s.width, peel)
    ..lineTo(s.width * .996, s.height)
    ..lineTo(0, s.height * .996)
    ..close();

  @override
  Path getClip(Size size) => cut(size, peel);

  @override
  bool shouldReclip(VignetteClipper oldClipper) => oldClipper.peel != peel;
}

/// La vignette autocollante : aimant rouge, bord blanc irrégulier, photo 3:4
/// du camp avec le buste, pastille sablier, tampon de genre, n° de carte, bande
/// NOM · FONCTION. `width` 222 en jeu, 136 pour la carte fatale (compact).
class Vignette extends StatelessWidget {
  final VignetteData data;
  final double width;
  final bool compact;
  final bool showPin;
  final bool grayscale;

  const Vignette({
    super.key,
    required this.data,
    this.width = 222,
    this.compact = false,
    this.showPin = true,
    this.grayscale = false,
  });

  double get peel => compact ? 20 : 30;
  EdgeInsets get padding => compact ? const EdgeInsets.fromLTRB(5, 5, 5, 4) : const EdgeInsets.fromLTRB(7, 7, 8, 6);
  double get bandHeight => compact ? 26 : 36;

  /// Hauteur totale (sans l'aimant) pour une largeur donnée.
  static double heightFor(double width, {bool compact = false}) {
    final pad = compact ? const EdgeInsets.fromLTRB(5, 5, 5, 4) : const EdgeInsets.fromLTRB(7, 7, 8, 6);
    final photoW = width - pad.horizontal;
    return pad.vertical + photoW * 4 / 3 + (compact ? 3 + 26 : 4 + 36);
  }

  @override
  Widget build(BuildContext context) {
    final photoW = width - padding.horizontal;
    final photoH = photoW * 4 / 3;
    final height = heightFor(width, compact: compact);
    final camp = data.isSelf ? null : FusibleColors.camp(data.camp);
    // Photo de presse (§4.5) : chaque couleur de la vignette passe par le même
    // N&B contrasté que le buste ; aucun ColorFilter, donc un rendu identique
    // en natif, en canvaskit et dans le renderer web html (voir photoGray).
    Color tone(Color c) => grayscale ? FusibleColors.photoGray(c) : c;
    final top = tone(camp ?? const Color(0xFF2A6E3F));
    final bottom = tone(camp == null ? FusibleColors.board : FusibleColors.darken78(camp));
    final pinSize = compact ? 20.0 : 26.0;

    final traits = data.isSelf ? {...?Portrait.traitsOf(data.characterId), 'genre': data.genre} : null;
    // Le n° de carte vit en bas à droite (§4.1) ; il passe à gauche quand le
    // buste porte un accessoire dessiné à cet endroit (carnet, micro, montre).
    final numberLeft = Portrait.accessoryAtBottomRight(Portrait.accessoryOf(data.characterId, traits));

    final body = Container(
      width: width,
      height: height,
      color: tone(FusibleColors.blancVignette),
      padding: padding,
      child: Column(
        children: [
          SizedBox(
            width: photoW,
            height: photoH,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(2),
              child: Stack(
                fit: StackFit.expand,
                children: [
                  DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [top, bottom]),
                    ),
                  ),
                  Align(
                    alignment: Alignment.bottomCenter,
                    child: SizedBox(
                      width: photoW,
                      child: Portrait(
                        characterId: data.characterId,
                        expression: data.expression,
                        traits: traits,
                        grayscale: grayscale,
                      ),
                    ),
                  ),
                  const IgnorePointer(child: RepaintBoundary(child: CustomPaint(painter: GrainPainter(opacity: .09)))),
                  if (data.sablier)
                    Positioned(
                      left: compact ? 4 : 6,
                      top: compact ? 4 : 6,
                      child: Container(
                        width: compact ? 18 : 26,
                        height: compact ? 18 : 26,
                        decoration: BoxDecoration(
                          color: tone(FusibleColors.creme),
                          shape: BoxShape.circle,
                          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: .4), blurRadius: 2, offset: const Offset(0, 1))],
                        ),
                        alignment: Alignment.center,
                        child: GaugeIcon('sablier', size: compact ? 10 : 15, strokeWidth: 2.2),
                      ),
                    ),
                  if (data.kindTag != null && !compact)
                    Positioned(
                      right: 8,
                      top: 38,
                      child: Transform.rotate(
                        angle: 6 * math.pi / 180,
                        child: Opacity(
                          opacity: .92,
                          child: Container(
                            padding: const EdgeInsets.fromLTRB(6, 2, 6, 2),
                            decoration: BoxDecoration(border: Border.all(color: FusibleColors.tampon, width: 2)),
                            child: Text(
                              data.kindTag!.toUpperCase(),
                              style: FusibleFonts.cond_(12, height: 1, spacing: .12, color: FusibleColors.tampon),
                            ),
                          ),
                        ),
                      ),
                    ),
                  Positioned(
                    right: numberLeft ? null : (compact ? 4 : 6),
                    left: numberLeft ? (compact ? 4 : 6) : null,
                    bottom: compact ? 4 : 5,
                    child: Container(
                      padding: const EdgeInsets.fromLTRB(5, 1, 5, 1),
                      decoration: BoxDecoration(color: Colors.black.withValues(alpha: .35), borderRadius: BorderRadius.circular(2)),
                      child: Text('n° ${data.number}', style: FusibleFonts.paper_(compact ? 8 : 11, height: 1.2, color: tone(FusibleColors.creme))),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SizedBox(height: compact ? 3 : 4),
          SizedBox(
            height: bandHeight,
            width: photoW,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  data.name.toUpperCase(),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  textAlign: TextAlign.center,
                  style: FusibleFonts.cond_(compact ? 10.5 : 16, height: 1, spacing: compact ? .04 : .06, color: tone(FusibleColors.encre)),
                ),
                if (data.label.isNotEmpty) ...[
                  SizedBox(height: compact ? 2 : 3),
                  Text(
                    data.label.toUpperCase(),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: FusibleFonts.cond_(compact ? 7.5 : 10.5, weight: FontWeight.w600, height: 1, spacing: .2, color: tone(FusibleColors.encre2)),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );

    final sticker = ClipPath(clipper: VignetteClipper(peel), child: body);

    return Semantics(
      label: data.semanticsLabel,
      container: true,
      excludeSemantics: true,
      child: SizedBox(
        width: width,
        height: height,
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            // Ombre portée découpée à la même forme, floutée 8 px, décalée 3/12.
            Positioned.fill(child: IgnorePointer(child: CustomPaint(painter: _CutShadowPainter(peel)))),
            sticker,
            // Coin décollé : ombre + rabat blanc → gris dans le carré `peel`.
            Positioned(top: 0, right: 0, child: IgnorePointer(child: CustomPaint(size: Size(peel, peel), painter: const _PeelPainter()))),
            if (showPin)
              Positioned(
                top: -pinSize / 2 + 1,
                left: (width - pinSize) / 2,
                child: IgnorePointer(
                  child: Container(
                    width: pinSize,
                    height: pinSize,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: const RadialGradient(
                        center: Alignment(-.3, -.4),
                        colors: [Color(0xFFE8A2A5), FusibleColors.tampon, FusibleColors.tampon],
                        stops: [0, .4, 1],
                      ),
                      border: Border.all(color: Colors.black.withValues(alpha: .2), width: 2),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withValues(alpha: .35), offset: const Offset(0, 3)),
                        BoxShadow(color: Colors.black.withValues(alpha: .45), blurRadius: 8, offset: const Offset(0, 6)),
                      ],
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _CutShadowPainter extends CustomPainter {
  final double peel;
  const _CutShadowPainter(this.peel);

  @override
  void paint(Canvas canvas, Size size) {
    canvas.save();
    canvas.translate(3, 12);
    canvas.drawPath(
      VignetteClipper.cut(size, peel),
      Paint()
        ..color = Colors.black.withValues(alpha: .55)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 8),
    );
    canvas.restore();
  }

  @override
  bool shouldRepaint(_CutShadowPainter oldDelegate) => oldDelegate.peel != peel;
}

class _PeelPainter extends CustomPainter {
  const _PeelPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final tri = Path()
      ..moveTo(0, 0)
      ..lineTo(size.width, size.height)
      ..lineTo(0, size.height)
      ..close();
    canvas.save();
    canvas.translate(-3, 4);
    canvas.drawPath(
      tri,
      Paint()
        ..color = Colors.black.withValues(alpha: .45)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 3),
    );
    canvas.restore();
    canvas.drawPath(
      tri,
      Paint()
        ..shader = const LinearGradient(
          begin: Alignment.bottomRight,
          end: Alignment.topLeft,
          colors: [Colors.white, Color(0xFFEDE8DA), Color(0xFFCFC7B2)],
          stops: [.5, .68, 1],
        ).createShader(Offset.zero & size),
    );
  }

  @override
  bool shouldRepaint(_PeelPainter oldDelegate) => false;
}

/// Badge de swipe : sticker crème à bordure 2,5 px (ardoise à gauche, rouge à
/// droite), ±6°, posé à 54 px du bas de la vignette.
class SwipeBadge extends StatelessWidget {
  final String text;
  final bool right;
  final double opacity;
  const SwipeBadge({super.key, required this.text, required this.right, required this.opacity});

  @override
  Widget build(BuildContext context) {
    final color = right ? FusibleColors.tampon : FusibleColors.uiArdoise;
    return IgnorePointer(
      child: Opacity(
        opacity: opacity.clamp(0, 1),
        child: Transform.rotate(
          angle: (right ? 6 : -6) * math.pi / 180,
          child: Container(
            constraints: const BoxConstraints(maxWidth: 150),
            padding: const EdgeInsets.fromLTRB(9, 7, 9, 7),
            decoration: BoxDecoration(
              color: FusibleColors.creme,
              border: Border.all(color: color, width: 2.5),
              borderRadius: BorderRadius.circular(2),
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: .4), blurRadius: 6, offset: const Offset(0, 3))],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (!right) const ArrowGlyph(right: false, size: 12, color: FusibleColors.encre),
                if (!right) const SizedBox(width: 4),
                Flexible(
                  child: Text(
                    text.toUpperCase(),
                    style: FusibleFonts.cond_(14, height: 1.05, spacing: .04, color: right ? FusibleColors.tampon : FusibleColors.encre),
                  ),
                ),
                if (right) const SizedBox(width: 4),
                if (right) const ArrowGlyph(right: true, size: 12, color: FusibleColors.tampon),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
