import 'dart:math' as math;
import 'dart:ui' show PointMode;

import 'package:flutter/material.dart';

import '../../theme.dart';

// ─────────────────────────────────────────────────────────────────────────────
// Chemins SVG (les pictogrammes de la maquette, copiés tels quels).
// ─────────────────────────────────────────────────────────────────────────────

/// Pictogrammes de jauge de la maquette (viewBox 24), tracés en encre 1,8 px.
const Map<String, String> kIconPaths = {
  'crampon': 'M3 15h8l2-5 4 1 4 3v2H3z M4 17v2 M8 17v2 M12 17v2 M16 17v2 M11 10l1.5-2.5',
  'echarpe': 'M8 3h8v9l-2.5 9h-3L8 12z M8 6h8 M8 9h8 M9 15h6 M10 18h4',
  'fauteuil': 'M6 11V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5 M3 11h18v5H3z M6 16v3 M18 16v3 M8 11V8h8v3',
  'billets': 'M3 8h16v10H3z M6 5h15v10 M11 13a2.5 2.5 0 1 0 0-0.01 M5 10h1 M16 16h1',
  'sablier': 'M6 3h12 M6 21h12 M8 3v4l4 5 4-5V3 M8 21v-4l4-5 4 5v4 M10 6h4',
};

/// Un mini-parseur de chemins SVG (M L H V C A Z, absolus et relatifs) : assez
/// pour les pictogrammes et l'écusson de la maquette.
Path parseSvgPath(String d) {
  final path = Path();
  final tokens = RegExp(r'[MmLlHhVvCcAaZz]|-?\d*\.?\d+(?:e-?\d+)?').allMatches(d).map((m) => m.group(0)!).toList();
  var i = 0;
  var cmd = '';
  double cx = 0, cy = 0, sx = 0, sy = 0;
  double num() => double.parse(tokens[i++]);
  bool nextIsNumber() => i < tokens.length && !RegExp(r'^[A-Za-z]$').hasMatch(tokens[i]);
  while (i < tokens.length) {
    final t = tokens[i];
    if (RegExp(r'^[A-Za-z]$').hasMatch(t)) {
      cmd = t;
      i++;
      if (cmd == 'Z' || cmd == 'z') {
        path.close();
        cx = sx;
        cy = sy;
        continue;
      }
    }
    final rel = cmd == cmd.toLowerCase();
    switch (cmd.toUpperCase()) {
      case 'M':
        var x = num(), y = num();
        if (rel) {
          x += cx;
          y += cy;
        }
        path.moveTo(x, y);
        cx = sx = x;
        cy = sy = y;
        // Les couples suivants sont des lineTo implicites.
        while (nextIsNumber()) {
          var lx = num(), ly = num();
          if (rel) {
            lx += cx;
            ly += cy;
          }
          path.lineTo(lx, ly);
          cx = lx;
          cy = ly;
        }
      case 'L':
        var x = num(), y = num();
        if (rel) {
          x += cx;
          y += cy;
        }
        path.lineTo(x, y);
        cx = x;
        cy = y;
      case 'H':
        var x = num();
        if (rel) x += cx;
        path.lineTo(x, cy);
        cx = x;
      case 'V':
        var y = num();
        if (rel) y += cy;
        path.lineTo(cx, y);
        cy = y;
      case 'C':
        var x1 = num(), y1 = num(), x2 = num(), y2 = num(), x = num(), y = num();
        if (rel) {
          x1 += cx;
          y1 += cy;
          x2 += cx;
          y2 += cy;
          x += cx;
          y += cy;
        }
        path.cubicTo(x1, y1, x2, y2, x, y);
        cx = x;
        cy = y;
      case 'A':
        final rx = num(), ry = num(), rot = num(), large = num(), sweep = num();
        var x = num(), y = num();
        if (rel) {
          x += cx;
          y += cy;
        }
        path.arcToPoint(Offset(x, y), radius: Radius.elliptical(rx, ry), rotation: rot, largeArc: large != 0, clockwise: sweep != 0);
        cx = x;
        cy = y;
      default:
        i++;
    }
  }
  return path;
}

/// Trace un chemin SVG (viewBox carré `box`) au trait, mis à l'échelle.
class SvgStrokePainter extends CustomPainter {
  final String d;
  final double box;
  final Color color;
  final double strokeWidth;
  final Color? fill;
  SvgStrokePainter(this.d, {this.box = 24, this.color = FusibleColors.encre, this.strokeWidth = 1.8, this.fill});

  @override
  void paint(Canvas canvas, Size size) {
    final s = math.min(size.width, size.height) / box;
    canvas.save();
    canvas.translate((size.width - box * s) / 2, (size.height - box * s) / 2);
    canvas.scale(s);
    final path = parseSvgPath(d);
    if (fill != null) canvas.drawPath(path, Paint()..color = fill!);
    canvas.drawPath(
      path,
      Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = strokeWidth
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round,
    );
    canvas.restore();
  }

  @override
  bool shouldRepaint(SvgStrokePainter oldDelegate) => oldDelegate.d != d || oldDelegate.color != color || oldDelegate.strokeWidth != strokeWidth || oldDelegate.fill != fill;
}

/// Pictogramme de jauge (crampon / écharpe / fauteuil / billets / sablier).
class GaugeIcon extends StatelessWidget {
  final String icon;
  final double size;
  final Color color;
  final double strokeWidth;
  const GaugeIcon(this.icon, {super.key, this.size = 28, this.color = FusibleColors.encre, this.strokeWidth = 1.8});

  @override
  Widget build(BuildContext context) {
    final d = kIconPaths[icon] ?? kIconPaths['crampon']!;
    return SizedBox(
      width: size,
      height: size,
      child: CustomPaint(painter: SvgStrokePainter(d, color: color, strokeWidth: strokeWidth)),
    );
  }
}

/// L'écusson du statut (28 × 30) : moitié crème, moitié pelouse, rond central.
class Ecu extends StatelessWidget {
  const Ecu({super.key});

  @override
  Widget build(BuildContext context) {
    return const SizedBox(width: 28, height: 30, child: CustomPaint(painter: _EcuPainter()));
  }
}

class _EcuPainter extends CustomPainter {
  const _EcuPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final s = size.width / 28;
    canvas.scale(s);
    final outline = parseSvgPath('M14 1l12 4v9c0 7-5 11-12 15C7 25 2 21 2 14V5z');
    canvas.drawPath(outline, Paint()..color = const Color(0xFFF2E9CF));
    canvas.drawPath(parseSvgPath('M14 1l12 4v9c0 7-5 11-12 15z'), Paint()..color = FusibleColors.pelouse);
    final stroke = Paint()
      ..color = const Color(0xFF0F2B1B)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;
    canvas.drawPath(outline, stroke);
    canvas.drawCircle(const Offset(14, 14), 4.5, Paint()..color = Colors.white);
    canvas.drawCircle(const Offset(14, 14), 4.5, stroke);
  }

  @override
  bool shouldRepaint(_EcuPainter oldDelegate) => false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Habillage papier : scotch, punaise, dentelure, grain, pointillés, hachures.
// ─────────────────────────────────────────────────────────────────────────────

/// Ruban adhésif (`.tape`) : jaune translucide, fines rayures.
class Tape extends StatelessWidget {
  final double width;
  final double height;
  final double angle; // degrés
  const Tape({super.key, this.width = 60, this.height = 16, this.angle = 0});

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: Transform.rotate(
        angle: angle * math.pi / 180,
        child: SizedBox(width: width, height: height, child: const CustomPaint(painter: _TapePainter())),
      ),
    );
  }
}

class _TapePainter extends CustomPainter {
  const _TapePainter();
  @override
  void paint(Canvas canvas, Size size) {
    final r = Offset.zero & size;
    canvas.drawRect(r.shift(const Offset(0, 1)), Paint()..color = Colors.black.withValues(alpha: .2));
    canvas.drawRect(r, Paint()..color = FusibleColors.scotch);
    final stripe = Paint()..color = Colors.white.withValues(alpha: .2);
    for (var x = 0.0; x < size.width; x += 5) {
      canvas.drawRect(Rect.fromLTWH(x, 0, 2, size.height), stripe);
    }
  }

  @override
  bool shouldRepaint(_TapePainter oldDelegate) => false;
}

/// Punaise (rouge tampon par défaut, ou bleue).
class Punaise extends StatelessWidget {
  final bool bleu;
  final double size;
  const Punaise({super.key, this.bleu = false, this.size = 16});

  @override
  Widget build(BuildContext context) {
    final base = bleu ? FusibleColors.uiBleu : FusibleColors.tampon;
    final deep = bleu ? const Color(0xFF173A6C) : const Color(0xFF7A1119);
    return IgnorePointer(
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: RadialGradient(center: const Alignment(-.3, -.4), colors: [Colors.white, base, deep], stops: const [0, .3, 1]),
          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: .4), blurRadius: 5, offset: const Offset(2, 4))],
        ),
      ),
    );
  }
}

/// Dentelure de pochette : bord supérieur en dents de scie de `depth` px
/// (pas de 5 % de la largeur), comme le `clip-path` de la maquette.
class DentelleClipper extends CustomClipper<Path> {
  final double depth;
  const DentelleClipper({this.depth = 7});

  @override
  Path getClip(Size size) {
    final p = Path()..moveTo(0, depth);
    final step = size.width / 20;
    for (var k = 1; k <= 20; k++) {
      p.lineTo(step * (k - .5), 0);
      p.lineTo(step * k, depth);
    }
    p
      ..lineTo(size.width, size.height)
      ..lineTo(0, size.height)
      ..close();
    return p;
  }

  @override
  bool shouldReclip(DentelleClipper oldClipper) => oldClipper.depth != depth;
}

/// Coupure de presse : bords déchirés (polygone de la maquette `.clip`).
class TornClipper extends CustomClipper<Path> {
  const TornClipper();
  @override
  Path getClip(Size size) {
    const pts = [
      [0, .03], [.12, 0], [.28, .02], [.45, 0], [.62, .03], [.80, 0], [1, .02],
      [.99, .40], [1, .70], [.98, 1], [.70, .98], [.50, 1], [.30, .97], [.10, 1], [0, .97],
    ];
    final p = Path();
    for (var k = 0; k < pts.length; k++) {
      final o = Offset(pts[k][0] * size.width, pts[k][1] * size.height);
      k == 0 ? p.moveTo(o.dx, o.dy) : p.lineTo(o.dx, o.dy);
    }
    return p..close();
  }

  @override
  bool shouldReclip(TornClipper oldClipper) => false;
}

/// Grain papier / photo : un semis de points fixes (graine stable), à poser en
/// surimpression légère. Remplace la texture SVG `--grain` de la maquette.
class GrainPainter extends CustomPainter {
  final double opacity;
  final Color color;
  const GrainPainter({this.opacity = .12, this.color = Colors.black});

  @override
  void paint(Canvas canvas, Size size) {
    final rng = math.Random(7);
    final n = (size.width * size.height / 14).round().clamp(0, 6000);
    final pts = List<Offset>.generate(n, (_) => Offset(rng.nextDouble() * size.width, rng.nextDouble() * size.height));
    final light = pts.take(n ~/ 2).toList();
    final dark = pts.skip(n ~/ 2).toList();
    canvas.drawPoints(PointMode.points, dark, Paint()..color = color.withValues(alpha: opacity)..strokeWidth = 1);
    canvas.drawPoints(PointMode.points, light, Paint()..color = Colors.white.withValues(alpha: opacity * .8)..strokeWidth = 1);
  }

  @override
  bool shouldRepaint(GrainPainter oldDelegate) => oldDelegate.opacity != opacity || oldDelegate.color != color;
}

/// Cadre à pointillés (les cases d'album, les emplacements de la page 1).
class DashedBorderPainter extends CustomPainter {
  final Color color;
  final double strokeWidth;
  final double dash;
  final double gap;
  const DashedBorderPainter({this.color = FusibleColors.craie, this.strokeWidth = 1.5, this.dash = 4, this.gap = 3});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;
    final r = Rect.fromLTWH(strokeWidth / 2, strokeWidth / 2, size.width - strokeWidth, size.height - strokeWidth);
    final src = Path()..addRect(r);
    for (final metric in src.computeMetrics()) {
      var d = 0.0;
      while (d < metric.length) {
        final end = math.min(d + dash, metric.length);
        canvas.drawPath(metric.extractPath(d, end), paint);
        d = end + gap;
      }
    }
  }

  @override
  bool shouldRepaint(DashedBorderPainter oldDelegate) => oldDelegate.color != color || oldDelegate.strokeWidth != strokeWidth;
}

/// Hachures rouges à 45° (2 px pleins / 8 px de pas), dans un disque.
class HatchPainter extends CustomPainter {
  final Color color;
  final double opacity;
  const HatchPainter({this.color = FusibleColors.tampon, this.opacity = .55});

  @override
  void paint(Canvas canvas, Size size) {
    final r = Offset.zero & size;
    canvas.save();
    canvas.clipPath(Path()..addOval(r));
    final paint = Paint()
      ..color = color.withValues(alpha: opacity)
      ..strokeWidth = 2;
    final n = ((size.width + size.height) / 8).ceil() + 2;
    for (var k = -n; k < n; k++) {
      final o = k * 8.0;
      canvas.drawLine(Offset(o, 0), Offset(o + size.height, size.height), paint);
    }
    canvas.restore();
  }

  @override
  bool shouldRepaint(HatchPainter oldDelegate) => oldDelegate.opacity != opacity || oldDelegate.color != color;
}

/// Lignes de craie du tableau tactique (fond des écrans de jeu et de fin).
class ChalkLinesPainter extends CustomPainter {
  final bool full;
  const ChalkLinesPainter({this.full = true});

  @override
  void paint(Canvas canvas, Size size) {
    // viewBox 386 × 846, preserveAspectRatio none.
    final sx = size.width / 386, sy = size.height / 846;
    canvas.scale(sx, sy);
    final p = Paint()
      ..color = FusibleColors.creme.withValues(alpha: .35)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5 / math.min(sx, sy);
    canvas.drawRect(const Rect.fromLTWH(24, 22, 338, 802), p);
    canvas.drawLine(const Offset(24, 423), const Offset(362, 423), p);
    canvas.drawCircle(const Offset(193, 423), 58, p);
    canvas.drawRect(const Rect.fromLTWH(110, 22, 166, 70), p);
    canvas.drawPath(parseSvgPath('M150 92 A44 44 0 0 0 236 92'), p);
    if (full) {
      canvas.drawRect(const Rect.fromLTWH(110, 754, 166, 70), p);
      canvas.drawPath(parseSvgPath('M150 754 A44 44 0 0 1 236 754'), p);
      final faint = Paint()
        ..color = FusibleColors.creme.withValues(alpha: .21)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.5 / math.min(sx, sy);
      final curve = parseSvgPath('M70 600 C120 560 160 640 210 590');
      for (final m in curve.computeMetrics()) {
        var d = 0.0;
        while (d < m.length) {
          canvas.drawPath(m.extractPath(d, math.min(d + 6, m.length)), faint);
          d += 11;
        }
      }
      canvas.drawPath(parseSvgPath('M204 586 l10 4 -4 10'), faint);
    }
  }

  @override
  bool shouldRepaint(ChalkLinesPainter oldDelegate) => oldDelegate.full != full;
}

/// Cadre « tableau tactique » : fond board + grain, cadre bois 7 px, liseré alu
/// 1 px, lignes de craie ; tient les écrans de jeu et de fin.
class BoardFrame extends StatelessWidget {
  final Widget child;
  final bool fullChalk;
  const BoardFrame({super.key, required this.child, this.fullChalk = true});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: FusibleColors.board,
        border: Border.all(color: FusibleColors.bois2, width: 7),
      ),
      child: Stack(
        fit: StackFit.expand,
        children: [
          const RepaintBoundary(child: CustomPaint(painter: GrainPainter(opacity: .06))),
          RepaintBoundary(child: CustomPaint(painter: ChalkLinesPainter(full: fullChalk))),
          DecoratedBox(
            decoration: BoxDecoration(
              border: Border.all(color: FusibleColors.alu, width: 1),
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: .35), blurRadius: 40, spreadRadius: -10)],
            ),
            position: DecorationPosition.foreground,
            child: const SizedBox.expand(),
          ),
          child,
        ],
      ),
    );
  }
}

/// Un texte en capitales, façon Barlow condensé (sans casser les ligatures des
/// tests : on garde le texte source dans les finders).
String caps(String s) => s.toUpperCase();

/// Étoile d'adversité ★ / ☆ tracée (les polices embarquées n'ont pas ces
/// glyphes ; sans réseau, canvaskit les rendrait en carrés).
class StarGlyph extends StatelessWidget {
  final bool filled;
  final double size;
  final Color color;
  const StarGlyph({super.key, required this.filled, this.size = 14, this.color = FusibleColors.encre});

  @override
  Widget build(BuildContext context) {
    return SizedBox(width: size, height: size, child: CustomPaint(painter: _StarPainter(filled, color)));
  }
}

class _StarPainter extends CustomPainter {
  final bool filled;
  final Color color;
  const _StarPainter(this.filled, this.color);

  @override
  void paint(Canvas canvas, Size size) {
    final c = Offset(size.width / 2, size.height / 2 + size.height * .03);
    final outer = size.width * .46, inner = outer * .45;
    final path = Path();
    for (var i = 0; i < 10; i++) {
      final r = i.isEven ? outer : inner;
      final a = -math.pi / 2 + i * math.pi / 5;
      final pt = c + Offset(math.cos(a) * r, math.sin(a) * r);
      if (i == 0) {
        path.moveTo(pt.dx, pt.dy);
      } else {
        path.lineTo(pt.dx, pt.dy);
      }
    }
    path.close();
    final paint = Paint()
      ..color = color
      ..style = filled ? PaintingStyle.fill : PaintingStyle.stroke
      ..strokeWidth = size.width * .09
      ..strokeJoin = StrokeJoin.round;
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(_StarPainter oldDelegate) => oldDelegate.filled != filled || oldDelegate.color != color;
}

/// Le texte d'une carte avec ses symboles tracés : chaque ★ / ☆ (adversité
/// du bloc de matchs) devient une [StarGlyph] de la taille du corps, alignée
/// sur le milieu de la ligne. Tout autre caractère reste du texte.
InlineSpan cardTextSpan(String text, TextStyle style) {
  if (!text.contains('★') && !text.contains('☆')) return TextSpan(text: text, style: style);
  final size = (style.fontSize ?? 14) * .95;
  final color = style.color ?? FusibleColors.encre;
  final children = <InlineSpan>[];
  final buf = StringBuffer();
  void flush() {
    if (buf.isNotEmpty) children.add(TextSpan(text: buf.toString()));
    buf.clear();
  }

  for (final rune in text.runes) {
    if (rune == 0x2605 || rune == 0x2606) {
      flush();
      children.add(WidgetSpan(
        alignment: PlaceholderAlignment.middle,
        child: Padding(padding: EdgeInsets.symmetric(horizontal: size * .04), child: StarGlyph(filled: rune == 0x2605, size: size, color: color)),
      ));
    } else {
      buf.writeCharCode(rune);
    }
  }
  flush();
  return TextSpan(style: style, children: children);
}

/// Le même texte, symboles remplacés par un caractère de largeur voisine :
/// pour mesurer avec un TextPainter sans dimensions de placeholder.
String cardTextForMeasure(String text) => text.replaceAll('★', 'W').replaceAll('☆', 'W');

/// Flèche ← / → tracée (les polices embarquées n'ont pas ces glyphes).
class ArrowGlyph extends StatelessWidget {
  final bool right;
  final double size;
  final Color color;
  const ArrowGlyph({super.key, required this.right, this.size = 12, this.color = FusibleColors.encre});

  @override
  Widget build(BuildContext context) {
    return SizedBox(width: size, height: size, child: CustomPaint(painter: _ArrowPainter(right, color)));
  }
}

class _ArrowPainter extends CustomPainter {
  final bool right;
  final Color color;
  const _ArrowPainter(this.right, this.color);

  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.width * .16
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    final y = size.height / 2;
    final x0 = size.width * .1, x1 = size.width * .9;
    final head = size.width * .3;
    if (right) {
      canvas.drawLine(Offset(x0, y), Offset(x1, y), p);
      canvas.drawPath(Path()..moveTo(x1 - head, y - head)..lineTo(x1, y)..lineTo(x1 - head, y + head), p);
    } else {
      canvas.drawLine(Offset(x1, y), Offset(x0, y), p);
      canvas.drawPath(Path()..moveTo(x0 + head, y - head)..lineTo(x0, y)..lineTo(x0 + head, y + head), p);
    }
  }

  @override
  bool shouldRepaint(_ArrowPainter oldDelegate) => oldDelegate.right != right || oldDelegate.color != color;
}
