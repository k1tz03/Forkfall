import 'dart:math' as math;
import 'dart:ui' show ImageFilter;

import 'package:flutter/material.dart';
import 'package:fusible_core/fusible_core.dart';

import '../state/game_controller.dart';
import '../theme.dart';
import 'widgets/magnets.dart';
import 'widgets/paper.dart';
import 'widgets/portrait.dart';

/// L'écran titre (§4.6) : l'album fermé sur la table du vestiaire, le sticker
/// « Nouvel album », les quatre pochettes (postulats) et la plaque Cimetière.
class TitleScreen extends StatefulWidget {
  final GameController controller;
  const TitleScreen({super.key, required this.controller});

  @override
  State<TitleScreen> createState() => _TitleScreenState();
}

class _TitleScreenState extends State<TitleScreen> {
  bool _open = false;

  GameController get c => widget.controller;

  @override
  Widget build(BuildContext context) {
    final topPad = MediaQuery.paddingOf(context).top;
    final bottomPad = MediaQuery.paddingOf(context).bottom;
    final content = c.engine.content;
    final postulats = content.postulatsByIndex;
    final total = content.endings.length;

    return Scaffold(
      backgroundColor: FusibleColors.bois,
      body: LayoutBuilder(
        builder: (context, constraints) {
          return Stack(
            fit: StackFit.expand,
            children: [
              const RepaintBoundary(child: CustomPaint(painter: _TablePainter())),
              SingleChildScrollView(
                child: ConstrainedBox(
                  constraints: BoxConstraints(minHeight: constraints.maxHeight),
                  child: IntrinsicHeight(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        // Mur lambris + barre à crochets + chant de table.
                        _Wall(topPad: topPad),
                        // La table : album, coupure punaisée, pochette de vignettes.
                        SizedBox(
                          height: 280,
                          child: Stack(
                            clipBehavior: Clip.none,
                            children: [
                              Positioned(
                                left: 22,
                                top: 20,
                                child: _Album(open: _open, genre: c.state?.entities.genre ?? 'm', onTap: () => setState(() => _open = !_open)),
                              ),
                              const Positioned(right: 12, top: 6, child: _Clipping()),
                              const Positioned(right: 14, bottom: 10, child: _Packet()),
                            ],
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.fromLTRB(20, 10, 20, 0),
                          child: Center(
                            child: StickerButton(
                              label: 'Nouvel album',
                              sub: 'ouvre la couverture',
                              semanticsLabel: 'Nouvel album',
                              onPressed: () => setState(() => _open = true),
                            ),
                          ),
                        ),
                        Expanded(
                          child: Container(
                            padding: EdgeInsets.fromLTRB(20, 12, 20, 8 + bottomPad),
                            decoration: const BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                                colors: [Color(0x33000000), Color(0x00000000)],
                                stops: [0, .1],
                              ),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: [
                                const _SectionLabel('Déchire une pochette'),
                                const SizedBox(height: 10),
                                _PostulatGrid(
                                  postulats: postulats,
                                  content: content,
                                  onStart: (i) => c.newRun(i),
                                ),
                                const Spacer(),
                                const SizedBox(height: 10),
                                _Cimetiere(found: c.discoveredEndings.length, total: total, albums: c.runsPlayed),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Le décor : table en bois, mur lambris.
// ─────────────────────────────────────────────────────────────────────────────

class _TablePainter extends CustomPainter {
  const _TablePainter();

  @override
  void paint(Canvas canvas, Size size) {
    // Planches de 58 px + rainure 2 px, teintes alternées.
    const colors = [FusibleColors.bois, Color(0xFF86582F)];
    const seams = [Color(0xFF6C4324), Color(0xFF5F3C1F)];
    var y = 0.0;
    var k = 0;
    while (y < size.height) {
      canvas.drawRect(Rect.fromLTWH(0, y, size.width, 58), Paint()..color = colors[k % 2]);
      canvas.drawRect(Rect.fromLTWH(0, y + 58, size.width, 2), Paint()..color = seams[k % 2]);
      y += 60;
      k++;
    }
    // Fil du bois : de longs traits fins, à peine plus clairs ou plus sombres.
    final rng = math.Random(3);
    for (var i = 0; i < 160; i++) {
      final yy = rng.nextDouble() * size.height;
      final x0 = rng.nextDouble() * size.width;
      final len = 40 + rng.nextDouble() * 140;
      final light = rng.nextBool();
      canvas.drawLine(
        Offset(x0, yy),
        Offset(x0 + len, yy + (rng.nextDouble() - .5) * 2),
        Paint()
          ..color = (light ? Colors.white : Colors.black).withValues(alpha: light ? .05 : .12)
          ..strokeWidth = .8 + rng.nextDouble(),
      );
    }
  }

  @override
  bool shouldRepaint(_TablePainter oldDelegate) => false;
}

class _Wall extends StatelessWidget {
  final double topPad;
  const _Wall({required this.topPad});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 116 + topPad + 10,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Positioned(left: 0, right: 0, top: 0, height: 116 + topPad, child: CustomPaint(painter: _WallPainter(topPad))),
          // Chant de table 10 px + ombre.
          Positioned(
            left: 0,
            right: 0,
            top: 116 + topPad,
            height: 10,
            child: Container(
              decoration: BoxDecoration(
                gradient: const LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [FusibleColors.bois3, Color(0xFF6B4322)]),
                boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: .4), blurRadius: 10, offset: const Offset(0, 6))],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _WallPainter extends CustomPainter {
  final double topPad;
  const _WallPainter(this.topPad);

  @override
  void paint(Canvas canvas, Size size) {
    final r = Offset.zero & size;
    canvas.drawRect(
      r,
      Paint()
        ..shader = const LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [Color(0xFF333A33), FusibleColors.mur]).createShader(r),
    );
    // Lambris : une rainure sombre toutes les 46 px.
    for (var x = 46.0; x < size.width; x += 48) {
      canvas.drawRect(Rect.fromLTWH(x, 0, 2, size.height), Paint()..color = Colors.black.withValues(alpha: .22));
    }
    canvas.save();
    canvas.translate(0, topPad);
    // Barre à crochets.
    canvas.drawRect(Rect.fromLTWH(0, 18, size.width, 8), Paint()..color = const Color(0xFF1F2724));
    final hook = Paint()
      ..color = const Color(0xFF8E9189)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4
      ..strokeCap = StrokeCap.round;
    for (final x in [60.0, 186.0, 300.0]) {
      canvas.drawPath(parseSvgPath('M$x 26v18a6 6 0 0 0 12 0'), hook);
    }
    // Écharpe rayée vert / crème.
    final scarf = parseSvgPath('M66 44 l-10 80 h20 l-4 -80z');
    canvas.drawPath(scarf, Paint()..color = FusibleColors.pelouse);
    canvas.save();
    canvas.clipPath(scarf);
    for (var y = 44.0; y < 124; y += 14) {
      canvas.drawRect(Rect.fromLTWH(50, y, 32, 7), Paint()..color = FusibleColors.creme.withValues(alpha: .9));
    }
    canvas.restore();
    // Sifflet à cordon rouge.
    canvas.drawPath(
      parseSvgPath('M192 44 c0 12 -10 22 -18 26'),
      Paint()
        ..color = FusibleColors.tampon
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2.5
        ..strokeCap = StrokeCap.round,
    );
    final whistle = parseSvgPath('M160 74 h22 l12 -7 v12 l-12 -2 a11 11 0 1 1 -22 -3z');
    canvas.drawPath(whistle, Paint()..color = FusibleColors.alu);
    canvas.drawPath(
      whistle,
      Paint()
        ..color = const Color(0xFF5C5F59)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2,
    );
    canvas.drawCircle(const Offset(171, 76), 3.5, Paint()..color = const Color(0xFF5C5F59));
    // Maillot n° 9.
    final jersey = parseSvgPath('M306 46 l-24 12 l6 14 l10 -4 v52 h44 v-52 l10 4 l6 -14 l-24 -12 a14 8 0 0 1 -28 0z');
    canvas.drawPath(jersey, Paint()..color = FusibleColors.campTerrain);
    canvas.drawPath(
      jersey,
      Paint()
        ..color = const Color(0xFF173A24)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2,
    );
    final tp = TextPainter(
      text: TextSpan(text: '9', style: FusibleFonts.cond_(28, height: 1, color: FusibleColors.creme)),
      textDirection: TextDirection.ltr,
    )..layout();
    tp.paint(canvas, Offset(320 - tp.width / 2, 106 - tp.height + 4));
    canvas.restore();
  }

  @override
  bool shouldRepaint(_WallPainter oldDelegate) => oldDelegate.topPad != topPad;
}

// ─────────────────────────────────────────────────────────────────────────────
// L'album fermé (186 × 240, −3°) qui s'ouvre sur la page 1.
// ─────────────────────────────────────────────────────────────────────────────

class _Album extends StatefulWidget {
  final bool open;
  final String genre;
  final VoidCallback onTap;
  const _Album({required this.open, required this.genre, required this.onTap});

  @override
  State<_Album> createState() => _AlbumState();
}

class _AlbumState extends State<_Album> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: FusibleMotion.page, value: widget.open ? 1 : 0);

  @override
  void didUpdateWidget(_Album old) {
    super.didUpdateWidget(old);
    if (old.open != widget.open) {
      if (FusibleMotion.reduced(context)) {
        _c.value = widget.open ? 1 : 0;
      } else {
        widget.open ? _c.forward() : _c.reverse();
      }
    }
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final page = Container(
      width: 186,
      height: 240,
      decoration: BoxDecoration(
        color: FusibleColors.creme,
        borderRadius: const BorderRadius.horizontal(left: Radius.circular(3), right: Radius.circular(10)),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: .45), blurRadius: 24, offset: const Offset(0, 18)),
          const BoxShadow(color: Color(0xFFD9CAA2), offset: Offset(0, 2), blurStyle: BlurStyle.inner),
        ],
      ),
      padding: const EdgeInsets.fromLTRB(22, 20, 22, 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('PAGE 1 · 1990-91', style: FusibleFonts.cond_(15, height: 1, spacing: .1, color: FusibleColors.pelouse)),
          const SizedBox(height: 6),
          Text('Colle ici les visages de ta première saison.', style: FusibleFonts.paper_(10.5, height: 1.3, color: FusibleColors.encre2)),
          const SizedBox(height: 8),
          Expanded(
            child: GridView.count(
              crossAxisCount: 3,
              mainAxisSpacing: 8,
              crossAxisSpacing: 8,
              childAspectRatio: 3 / 4,
              physics: const NeverScrollableScrollPhysics(),
              padding: EdgeInsets.zero,
              children: [
                for (var i = 1; i <= 6; i++)
                  CustomPaint(
                    painter: const DashedBorderPainter(color: Color(0xFFA89B74)),
                    child: Center(child: Text('$i', style: FusibleFonts.ui_(9, color: const Color(0xFFA89B74)))),
                  ),
              ],
            ),
          ),
        ],
      ),
    );

    final cover = Container(
      width: 186,
      height: 240,
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        borderRadius: const BorderRadius.horizontal(left: Radius.circular(3), right: Radius.circular(10)),
        gradient: const LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [Color(0xFF27673B), FusibleColors.pelouse, FusibleColors.pelouse2], stops: [0, .55, 1]),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: .4), blurRadius: 20, offset: const Offset(0, 10))],
      ),
      child: Stack(
        children: [
          const Positioned.fill(child: RepaintBoundary(child: CustomPaint(painter: GrainPainter(opacity: .07)))),
          const Positioned(
            left: 0,
            top: 0,
            bottom: 0,
            width: 12,
            child: DecoratedBox(
              decoration: BoxDecoration(gradient: LinearGradient(colors: [Color(0xFF0E2F1A), Color(0xFF1A4B2B), Color(0xFF0E2F1A)], stops: [0, .6, 1])),
            ),
          ),
          Positioned(
            left: 24,
            top: 16,
            child: Row(
              children: [
                Text('ÉDITION 1990 ', style: FusibleFonts.cond_(9.5, weight: FontWeight.w600, spacing: .18, color: FusibleColors.creme.withValues(alpha: .7))),
                ArrowGlyph(right: true, size: 9, color: FusibleColors.creme.withValues(alpha: .7)),
                Text(' 2050', style: FusibleFonts.cond_(9.5, weight: FontWeight.w600, spacing: .18, color: FusibleColors.creme.withValues(alpha: .7))),
              ],
            ),
          ),
          Positioned(
            left: 22,
            top: 30,
            child: Text(
              'FUSIBLE',
              style: FusibleFonts.cond_(42, height: .9, color: const Color(0xFF163F25)).copyWith(shadows: [
                Shadow(color: Colors.white.withValues(alpha: .22), offset: const Offset(-1, -1)),
                Shadow(color: Colors.black.withValues(alpha: .55), offset: const Offset(1, 1)),
                Shadow(color: Colors.black.withValues(alpha: .28), offset: const Offset(2, 3)),
                Shadow(color: Colors.black.withValues(alpha: .35), offset: const Offset(3, 6), blurRadius: 8),
              ]),
            ),
          ),
          Positioned(
            left: 24,
            top: 80,
            right: 16,
            child: Text('Une carrière de football, vignette après vignette.', style: FusibleFonts.paper_(11.5, italic: true, height: 1.25, color: FusibleColors.creme.withValues(alpha: .85))),
          ),
          Positioned(
            right: 16,
            bottom: 44,
            child: Transform.rotate(
              angle: 4 * math.pi / 180,
              child: Container(
                width: 58,
                padding: const EdgeInsets.fromLTRB(4, 4, 4, 12),
                decoration: BoxDecoration(
                  color: FusibleColors.blancVignette,
                  boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: .35), blurRadius: 6, offset: const Offset(0, 3))],
                ),
                child: Stack(
                  clipBehavior: Clip.none,
                  children: [
                    AspectRatio(
                      aspectRatio: 3 / 4,
                      child: ClipRect(
                        child: Container(
                          decoration: const BoxDecoration(gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [Color(0xFF2A6E3F), FusibleColors.board])),
                          alignment: Alignment.bottomCenter,
                          child: Portrait(characterId: 'coach', expression: 'sourire', traits: {...?Portrait.traitsOf('coach'), 'genre': widget.genre}),
                        ),
                      ),
                    ),
                    Positioned(left: 0, right: 0, bottom: -10, child: Text('n° 001', textAlign: TextAlign.center, style: FusibleFonts.paper_(7.5))),
                  ],
                ),
              ),
            ),
          ),
          Positioned(
            left: 24,
            bottom: 18,
            child: Container(
              padding: const EdgeInsets.fromLTRB(7, 3, 7, 3),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFFE5C56A), Color(0xFFF6E7A8), Color(0xFFC9A64C), Color(0xFFF1DD95)], stops: [0, .4, .6, 1]),
                boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: .4), offset: const Offset(0, 1))],
              ),
              child: Text('ALBUM OFFICIEL · 512 VIGNETTES', style: FusibleFonts.cond_(9, weight: FontWeight.w700, spacing: .14, color: const Color(0xFF2B1E10))),
            ),
          ),
        ],
      ),
    );

    return Semantics(
      label: "Ouvrir l'album",
      button: true,
      onTap: widget.onTap,
      excludeSemantics: true,
      child: GestureDetector(
        onTap: widget.onTap,
        child: Transform.rotate(
          angle: -3 * math.pi / 180,
          child: SizedBox(
            width: 186,
            height: 240,
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                page,
                AnimatedBuilder(
                  animation: _c,
                  builder: (_, child) {
                    final t = FusibleMotion.coverCurve.transform(_c.value);
                    final angle = -150 * math.pi / 180 * t;
                    return Transform(
                      alignment: Alignment.centerLeft,
                      transform: Matrix4.identity()
                        ..setEntry(3, 2, .001)
                        ..rotateY(angle),
                      child: t > .6 ? const SizedBox(width: 186, height: 240) : child,
                    );
                  },
                  child: cover,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// La coupure du Quotidien punaisée, la pochette de vignettes (décor).
// ─────────────────────────────────────────────────────────────────────────────

class _Clipping extends StatelessWidget {
  const _Clipping();

  @override
  Widget build(BuildContext context) {
    return ExcludeSemantics(
      child: Transform.rotate(
        angle: 6 * math.pi / 180,
        child: SizedBox(
          width: 122,
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              Container(
                decoration: BoxDecoration(boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: .35), blurRadius: 10, offset: const Offset(0, 4))]),
                child: ClipPath(
                  clipper: const TornClipper(),
                  child: Container(
                    color: FusibleColors.journal,
                    padding: const EdgeInsets.fromLTRB(10, 9, 10, 10),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('LE QUOTIDIEN DU BALLON', style: FusibleFonts.paper_(8, weight: FontWeight.w700, spacing: .04, color: FusibleColors.journalBleu)),
                        const SizedBox(height: 3),
                        Text('UN FUSIBLE, ÇA SE CHANGE.', style: FusibleFonts.cond_(15, height: .95)),
                        const SizedBox(height: 4),
                        Text(
                          "Le président l'a répété hier aux actionnaires : « J'ai pas le temps, j'ai un empire. » Le banc, lui, a le temps de compter les journées.",
                          style: FusibleFonts.paper_(7.5, height: 1.25, color: FusibleColors.encre2),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const Positioned(left: 6, top: -4, child: Punaise()),
            ],
          ),
        ),
      ),
    );
  }
}

class _Packet extends StatelessWidget {
  const _Packet();

  @override
  Widget build(BuildContext context) {
    Widget peek(Color a, Color b) => Container(
          width: 40,
          height: 54,
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(
            color: FusibleColors.blancVignette,
            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: .35), blurRadius: 4, offset: const Offset(0, 2))],
          ),
          child: DecoratedBox(decoration: BoxDecoration(gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [a, b]))),
        );
    return ExcludeSemantics(
      child: Transform.rotate(
        angle: 8 * math.pi / 180,
        child: SizedBox(
          width: 104,
          height: 136,
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              Positioned(left: 8, bottom: -8, child: Transform.rotate(angle: -8 * math.pi / 180, child: peek(const Color(0xFF3E8A4E), FusibleColors.campTerrain))),
              Positioned(left: 40, bottom: -14, child: Transform.rotate(angle: 5 * math.pi / 180, child: peek(const Color(0xFF7A2536), FusibleColors.campDirection))),
              Positioned.fill(
                child: Transform.translate(
                  offset: const Offset(2, 8),
                  child: ImageFiltered(
                    imageFilter: ImageFilter.blur(sigmaX: 6, sigmaY: 6),
                    child: Container(color: Colors.black.withValues(alpha: .45)),
                  ),
                ),
              ),
              Positioned.fill(
                child: ClipPath(
                  clipper: const DentelleClipper(depth: 6),
                  child: Container(
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [Color(0xFF27673B), FusibleColors.pelouse, FusibleColors.pelouse2], stops: [0, .55, 1]),
                    ),
                    child: Stack(
                      children: [
                        const Positioned.fill(child: RepaintBoundary(child: CustomPaint(painter: GrainPainter(opacity: .07)))),
                        Positioned.fill(
                          child: DecoratedBox(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                                colors: [Colors.white.withValues(alpha: .30), Colors.transparent, Colors.white.withValues(alpha: .14), Colors.transparent],
                                stops: const [0, .32, .52, .66],
                              ),
                            ),
                          ),
                        ),
                        const Positioned(left: 0, right: 0, top: 6, height: 14, child: CustomPaint(painter: _StripesPainter(opacity: .5))),
                        Positioned(
                          left: 0,
                          right: 0,
                          top: 22,
                          child: Column(
                            children: [
                              Text('SAISON 1990-91', style: FusibleFonts.cond_(9, weight: FontWeight.w600, spacing: .16, color: FusibleColors.creme.withValues(alpha: .9))),
                              Text(
                                'FUSIBLE',
                                style: FusibleFonts.cond_(21, height: 1, spacing: .03, color: FusibleColors.creme).copyWith(shadows: [Shadow(color: Colors.black.withValues(alpha: .4), offset: const Offset(0, 1))]),
                              ),
                              Container(
                                margin: const EdgeInsets.fromLTRB(10, 10, 10, 0),
                                padding: const EdgeInsets.symmetric(vertical: 3),
                                color: FusibleColors.creme,
                                alignment: Alignment.center,
                                child: Text('5 VIGNETTES', style: FusibleFonts.cond_(10, weight: FontWeight.w700, spacing: .12, color: FusibleColors.pelouse2)),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Bande de colle striée (6 px sombres / 6 px vides).
class _StripesPainter extends CustomPainter {
  final double opacity;
  const _StripesPainter({this.opacity = .5});

  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()..color = Colors.black.withValues(alpha: .28 * opacity);
    for (var x = 0.0; x < size.width; x += 12) {
      canvas.drawRect(Rect.fromLTWH(x, 0, 6, size.height), p);
    }
  }

  @override
  bool shouldRepaint(_StripesPainter oldDelegate) => oldDelegate.opacity != opacity;
}

// ─────────────────────────────────────────────────────────────────────────────
// Les pochettes de postulat (§4.3) et la plaque Cimetière.
// ─────────────────────────────────────────────────────────────────────────────

class _SectionLabel extends StatelessWidget {
  final String text;
  const _SectionLabel(this.text);

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Text(text.toUpperCase(), style: FusibleFonts.cond_(13, weight: FontWeight.w700, height: 1, spacing: .16, color: FusibleColors.creme.withValues(alpha: .85))),
        const SizedBox(width: 10),
        Expanded(child: Container(height: 1, color: FusibleColors.creme.withValues(alpha: .35))),
      ],
    );
  }
}

class _PostulatGrid extends StatelessWidget {
  final List<PostulatDef> postulats;
  final Content content;
  final ValueChanged<int> onStart;
  const _PostulatGrid({required this.postulats, required this.content, required this.onStart});

  @override
  Widget build(BuildContext context) {
    final items = postulats.take(4).toList();
    final rows = <Widget>[];
    for (var r = 0; r < items.length; r += 2) {
      rows.add(Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          for (var k = r; k < r + 2; k++) ...[
            if (k > r) const SizedBox(width: 12),
            Expanded(
              child: k < items.length
                  ? _Pochette(
                      index: k,
                      def: items[k],
                      roleName: content.roles[items[k].role]?.name ?? items[k].role,
                      tilt: (k == 1 || k == 2) ? .6 : 0,
                      onStart: () => onStart(k),
                    )
                  : const SizedBox.shrink(),
            ),
          ],
        ],
      ));
      if (r + 2 < items.length) rows.add(const SizedBox(height: 10));
    }
    return Column(children: rows);
  }
}

class _Pochette extends StatefulWidget {
  final int index;
  final PostulatDef def;
  final String roleName;
  final double tilt;
  final VoidCallback onStart;
  const _Pochette({required this.index, required this.def, required this.roleName, required this.tilt, required this.onStart});

  @override
  State<_Pochette> createState() => _PochetteState();
}

class _PochetteState extends State<_Pochette> with SingleTickerProviderStateMixin {
  late final AnimationController _tear = AnimationController(vsync: this, duration: FusibleMotion.pack);
  bool _busy = false;

  @override
  void dispose() {
    _tear.dispose();
    super.dispose();
  }

  Future<void> _tap() async {
    if (_busy) return;
    _busy = true;
    if (!FusibleMotion.reduced(context)) {
      await _tear.forward();
    }
    if (mounted) widget.onStart();
  }

  @override
  Widget build(BuildContext context) {
    final coach = widget.def.role == 'entraineur';
    final label = 'Pochette ${widget.index + 1} : ${widget.def.title}';
    final bg = coach ? FusibleColors.board : FusibleColors.campTerrain;

    Widget background({required bool flap}) => Stack(
          fit: StackFit.expand,
          children: [
            ColoredBox(color: bg),
            if (!flap) const RepaintBoundary(child: CustomPaint(painter: GrainPainter(opacity: .06))),
            if (!flap) CustomPaint(painter: coach ? const _ChalkPitchPainter() : const _PitchStripesPainter()),
          ],
        );

    return Semantics(
      label: label,
      button: true,
      onTap: _tap,
      excludeSemantics: true,
      child: GestureDetector(
        onTap: _tap,
        child: Transform.rotate(
          angle: widget.tilt * math.pi / 180,
          child: SizedBox(
            height: 122,
            child: ClipPath(
              clipper: const DentelleClipper(depth: 7),
              child: Stack(
                fit: StackFit.expand,
                children: [
                  background(flap: false),
                  // Le rabat : il se déchire (−22°, translate(−30, −60), fondu) en 600 ms.
                  Positioned(
                    left: 0,
                    right: 0,
                    top: 0,
                    height: 28,
                    child: AnimatedBuilder(
                      animation: _tear,
                      builder: (_, child) {
                        final v = Curves.easeOut.transform(_tear.value);
                        final double rot, tx, ty, op;
                        if (v < .4) {
                          final u = v / .4;
                          rot = -8 * u;
                          tx = 0;
                          ty = -6 * u;
                          op = 1;
                        } else {
                          final u = (v - .4) / .6;
                          rot = -8 + (-22 + 8) * u;
                          tx = -30 * u;
                          ty = -6 + (-60 + 6) * u;
                          op = 1 - u;
                        }
                        return Opacity(
                          opacity: op,
                          child: Transform.translate(
                            offset: Offset(tx, ty),
                            child: Transform.rotate(angle: rot * math.pi / 180, alignment: Alignment.topCenter, child: child),
                          ),
                        );
                      },
                      child: Stack(
                        fit: StackFit.expand,
                        children: [
                          background(flap: true),
                          const Positioned(left: 0, right: 0, top: 7, height: 12, child: CustomPaint(painter: _StripesPainter(opacity: .5))),
                        ],
                      ),
                    ),
                  ),
                  Padding(
                    // Sous la bande de colle du rabat (le contenu passe devant lui).
                    padding: const EdgeInsets.fromLTRB(12, 22, 12, 10),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('n° ${(widget.index + 1).toString().padLeft(2, '0')}', style: FusibleFonts.paper_(11, height: 1.1, color: Colors.white.withValues(alpha: .85))),
                        const SizedBox(height: 3),
                        Text(
                          widget.def.title,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: FusibleFonts.cond_(18, height: 1, spacing: .01, color: Colors.white).copyWith(shadows: [Shadow(color: Colors.black.withValues(alpha: .35), offset: const Offset(0, 1))]),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          '${widget.roleName} · D${widget.def.division} · ${widget.def.year}'.toUpperCase(),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: FusibleFonts.ui_(10.5, weight: FontWeight.w600, spacing: .05, color: Colors.white.withValues(alpha: .9)),
                        ),
                        Expanded(
                          child: LayoutBuilder(
                            builder: (context, box) {
                              // Des lignes entières seulement (2 au plus).
                              final lines = (box.maxHeight / (11 * 1.25)).floor().clamp(0, 2);
                              if (lines == 0) return const SizedBox.shrink();
                              return Align(
                                alignment: Alignment.bottomLeft,
                                child: Text(
                                  widget.def.question,
                                  maxLines: lines,
                                  overflow: TextOverflow.ellipsis,
                                  style: FusibleFonts.paper_(11, italic: true, height: 1.25, color: Colors.white.withValues(alpha: .85)),
                                ),
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Fond « entraîneur » : tableau, ligne médiane et rond central à la craie.
class _ChalkPitchPainter extends CustomPainter {
  const _ChalkPitchPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()
      ..color = FusibleColors.craie
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;
    canvas.drawLine(Offset(size.width / 2, 0), Offset(size.width / 2, size.height * .42), p);
    canvas.drawCircle(Offset(size.width / 2, size.height * .42), 17.5, p..strokeWidth = 1);
  }

  @override
  bool shouldRepaint(_ChalkPitchPainter oldDelegate) => false;
}

/// Fond « joueur » : pelouse rayée (14 px / 28 px).
class _PitchStripesPainter extends CustomPainter {
  const _PitchStripesPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()..color = Colors.white.withValues(alpha: .06);
    for (var y = 14.0; y < size.height; y += 28) {
      canvas.drawRect(Rect.fromLTWH(0, y, size.width, 14), p);
    }
  }

  @override
  bool shouldRepaint(_PitchStripesPainter oldDelegate) => false;
}

class _Cimetiere extends StatelessWidget {
  final int found;
  final int total;
  final int albums;
  const _Cimetiere({required this.found, required this.total, required this.albums});

  @override
  Widget build(BuildContext context) {
    final style = FusibleFonts.cond_(11.5, weight: FontWeight.w600, height: 1, spacing: .08, color: FusibleColors.creme);
    Widget screw() => Container(
          width: 6,
          height: 6,
          decoration: const BoxDecoration(
            color: Color(0xFF9AA19D),
            shape: BoxShape.circle,
            boxShadow: [BoxShadow(color: Color(0x99000000), blurRadius: 1, offset: Offset(0, 1), blurStyle: BlurStyle.inner)],
          ),
        );
    return Semantics(
      label: 'Cimetière : $found fins sur $total, $albums albums joués',
      container: true,
      excludeSemantics: true,
      child: Container(
        padding: const EdgeInsets.fromLTRB(12, 7, 12, 7),
        decoration: BoxDecoration(
          gradient: const LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [Color(0xFF4B5250), Color(0xFF333937)]),
          border: Border.all(color: const Color(0xFF6B736F)),
          borderRadius: BorderRadius.circular(3),
          boxShadow: const [BoxShadow(color: Color(0x26FFFFFF), offset: Offset(0, 1), blurStyle: BlurStyle.inner)],
        ),
        child: Row(
          children: [
            screw(),
            const SizedBox(width: 10),
            Expanded(
              child: Text.rich(
                TextSpan(children: [
                  const TextSpan(text: 'CIMETIÈRE · '),
                  TextSpan(text: '$found', style: style.copyWith(color: FusibleColors.uiOrange)),
                  TextSpan(text: '/$total FINS'),
                ]),
                style: style,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            Text('$albums ALBUM${albums > 1 ? 'S' : ''}', style: style),
            const SizedBox(width: 10),
            screw(),
          ],
        ),
      ),
    );
  }
}
