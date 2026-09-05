import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:fusible_core/fusible_core.dart';

import '../../theme.dart';
import 'paper.dart';

const _tilts = [-1.5, 1.0, -0.5, 2.0];

bool gaugeInDanger(int value) => value <= 20 || value >= 80;

/// Le rail des 4 jauges = 4 cases d'album à remplir (§4.2) : case 64 × 64 à
/// pointillés craie, sticker blanc penché, disque 48 rempli verticalement de la
/// teinte UI, pictogramme ; hachures + anneau rouge en danger ; pastille orange
/// d'aperçu (10 / 14 px) pendant le drag.
class AlbumRail extends StatelessWidget {
  final RoleDef role;
  final Map<String, int> gauges;
  final List<GaugeHint> preview;
  const AlbumRail({super.key, required this.role, required this.gauges, this.preview = const []});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        for (var i = 0; i < role.gauges.length; i++) ...[
          if (i > 0) const SizedBox(width: 8),
          Expanded(
            child: _GaugeCase(
              index: i,
              def: role.gauges[i],
              value: gauges[role.gauges[i].id] ?? 50,
              hint: preview.where((h) => h.gauge == role.gauges[i].id).fold<int>(0, (m, h) => math.max(m, h.magnitude)),
            ),
          ),
        ],
      ],
    );
  }
}

class _GaugeCase extends StatelessWidget {
  final int index;
  final GaugeDef def;
  final int value;
  final int hint;
  const _GaugeCase({required this.index, required this.def, required this.value, required this.hint});

  @override
  Widget build(BuildContext context) {
    final danger = gaugeInDanger(value);
    return Semantics(
      label: '${def.label} $value${danger ? ', danger' : ''}',
      container: true,
      excludeSemantics: true,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(
            width: 64,
            height: 64,
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                const Positioned.fill(child: CustomPaint(painter: DashedBorderPainter(color: Color(0x80EFE4C6)))),
                Positioned(
                  top: -8,
                  left: -6,
                  child: Container(
                    color: FusibleColors.board,
                    padding: const EdgeInsets.symmetric(horizontal: 3),
                    child: Text('${index + 1}', style: FusibleFonts.paper_(10, color: FusibleColors.creme)),
                  ),
                ),
                Positioned(
                  left: 4,
                  top: 4,
                  child: Transform.rotate(
                    angle: _tilts[index % _tilts.length] * math.pi / 180,
                    child: SizedBox(
                      width: 56,
                      height: 56,
                      child: Stack(
                        clipBehavior: Clip.none,
                        children: [
                          // Anneau rouge 2 px plein en danger (`0 0 0 2px`), posé
                          // au-dessus de l'ombre noire comme dans la maquette.
                          DangerRing(
                            danger: danger,
                            child: Container(
                              width: 56,
                              height: 56,
                              color: FusibleColors.blancVignette,
                              alignment: Alignment.center,
                              child: GaugeDisc(id: def.id, icon: def.icon, value: value, size: 48, danger: danger),
                            ),
                          ),
                          Positioned(
                            top: -6,
                            right: -6,
                            child: AnimatedOpacity(
                              opacity: hint > 0 ? 1 : 0,
                              duration: FusibleMotion.reduced(context) ? Duration.zero : FusibleMotion.text,
                              child: Container(
                                width: hint == 2 ? 14 : 10,
                                height: hint == 2 ? 14 : 10,
                                decoration: const BoxDecoration(
                                  color: FusibleColors.uiOrange,
                                  shape: BoxShape.circle,
                                  boxShadow: [BoxShadow(color: FusibleColors.board, spreadRadius: 2)],
                                ),
                              ),
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
          const SizedBox(height: 4),
          SizedBox(
            height: 14,
            width: double.infinity,
            child: Text(
              def.label.toUpperCase(),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
              style: FusibleFonts.cond_(11, weight: FontWeight.w600, height: 1, spacing: .1, color: FusibleColors.creme),
            ),
          ),
        ],
      ),
    );
  }
}

/// Le sticker et son ombre portée (`0 2px 3px rgba(0,0,0,.4)`) ; en danger,
/// un vrai anneau rouge de 2 px l'entoure (bord plein, jamais flouté), dessiné
/// au-dessus de l'ombre : le `box-shadow: 0 0 0 2px var(--tampon), 0 2px 3px …`
/// de la maquette, sans changer la taille ni l'axe de rotation du sticker.
class DangerRing extends StatelessWidget {
  final bool danger;
  final Widget child;
  const DangerRing({super.key, required this.danger, required this.child});

  @override
  Widget build(BuildContext context) {
    final shadow = BoxShadow(color: Colors.black.withValues(alpha: .4), blurRadius: 3, offset: const Offset(0, 2));
    if (!danger) return DecoratedBox(decoration: BoxDecoration(boxShadow: [shadow]), child: child);
    return Stack(
      clipBehavior: Clip.none,
      children: [
        Positioned(
          left: -2,
          top: -2,
          right: -2,
          bottom: -2,
          child: DecoratedBox(decoration: BoxDecoration(color: FusibleColors.tampon, boxShadow: [shadow])),
        ),
        child,
      ],
    );
  }
}

/// Le disque de jauge : remplissage vertical de la teinte UI, anneau encre,
/// pictogramme ; hachures rouges qui respirent (1,2 s) en danger.
class GaugeDisc extends StatelessWidget {
  final String id;
  final String icon;
  final int value;
  final double size;
  final bool danger;
  final double ringWidth;
  const GaugeDisc({super.key, required this.id, required this.icon, required this.value, this.size = 48, this.danger = false, this.ringWidth = 1.5});

  @override
  Widget build(BuildContext context) {
    final v = (value / 100).clamp(0.0, 1.0);
    final color = FusibleColors.gauge(id);
    return SizedBox(
      width: size,
      height: size,
      child: ClipOval(
        child: Stack(
          fit: StackFit.expand,
          children: [
            DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.bottomCenter,
                  end: Alignment.topCenter,
                  colors: [color, color, FusibleColors.disqueVide, FusibleColors.disqueVide],
                  stops: [0, v, v, 1],
                ),
              ),
            ),
            Center(child: GaugeIcon(icon, size: size * 28 / 48)),
            if (danger) const _Breathing(child: CustomPaint(painter: HatchPainter())),
            DecoratedBox(
              decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: FusibleColors.encre, width: ringWidth)),
            ),
          ],
        ),
      ),
    );
  }
}

/// Respiration d'opacité .45 ↔ 1 en 1,2 s ; coupée (opacité 1) sans animation.
class _Breathing extends StatefulWidget {
  final Widget child;
  const _Breathing({required this.child});

  @override
  State<_Breathing> createState() => _BreathingState();
}

class _BreathingState extends State<_Breathing> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: FusibleMotion.pulse);

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final reduced = FusibleMotion.reduced(context);
    if (reduced) {
      _c.stop();
      return widget.child;
    }
    if (!_c.isAnimating) _c.repeat(reverse: true);
    return FadeTransition(
      opacity: Tween<double>(begin: .45, end: 1).animate(CurvedAnimation(parent: _c, curve: Curves.easeInOut)),
      child: widget.child,
    );
  }
}

/// Fin de run : 4 mini-stickers 29 px éteints ; la coupable garde sa couleur,
/// barrée d'un trait rouge à −30° et clignotante (steps 2, 1,2 s).
class DeadRail extends StatelessWidget {
  final RoleDef role;
  final Map<String, int> gauges;
  final String? guilty;
  final String? side; // vide | plein
  const DeadRail({super.key, required this.role, required this.gauges, this.guilty, this.side});

  @override
  Widget build(BuildContext context) {
    final guiltyDef = role.gauges.where((g) => g.id == guilty).firstOrNull;
    final caption = guiltyDef == null ? 'Toutes les jauges' : '${guiltyDef.label} · ${side == 'plein' ? 'pleine' : 'vidée'}';
    return Semantics(
      label: 'Jauges à la fin : $caption',
      container: true,
      excludeSemantics: true,
      child: SizedBox(
        width: 72,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: [
                for (var i = 0; i < role.gauges.length; i++)
                  _MiniSticker(
                    def: role.gauges[i],
                    value: gauges[role.gauges[i].id] ?? 50,
                    tilt: _tilts[i % _tilts.length],
                    guilty: role.gauges[i].id == guilty,
                  ),
              ],
            ),
            const SizedBox(height: 4),
            Text(caption.toUpperCase(), style: FusibleFonts.cond_(9.5, weight: FontWeight.w600, height: 1.2, spacing: .12, color: FusibleColors.creme.withValues(alpha: .6))),
          ],
        ),
      ),
    );
  }
}

class _MiniSticker extends StatelessWidget {
  final GaugeDef def;
  final int value;
  final double tilt;
  final bool guilty;
  const _MiniSticker({required this.def, required this.value, required this.tilt, required this.guilty});

  @override
  Widget build(BuildContext context) {
    Widget mini = DangerRing(
      danger: guilty,
      child: Container(
        width: 29,
        height: 29,
        color: FusibleColors.blancVignette,
        alignment: Alignment.center,
        child: GaugeDisc(id: def.id, icon: def.icon, value: value, size: 22, ringWidth: 1),
      ),
    );
    if (guilty) {
      mini = _Blink(
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            mini,
            Positioned(
              left: -4,
              right: -4,
              top: 13,
              child: Transform.rotate(angle: -30 * math.pi / 180, child: Container(height: 3, color: FusibleColors.tampon)),
            ),
          ],
        ),
      );
    } else {
      // brightness(.45) saturate(.3) : on éteint le sticker.
      mini = ColorFiltered(
        colorFilter: const ColorFilter.matrix([
          .45 * (.3 + .7 * .2126), .45 * .7 * .7152, .45 * .7 * .0722, 0, 0,
          .45 * .7 * .2126, .45 * (.3 + .7 * .7152), .45 * .7 * .0722, 0, 0,
          .45 * .7 * .2126, .45 * .7 * .7152, .45 * (.3 + .7 * .0722), 0, 0,
          0, 0, 0, 1, 0,
        ]),
        child: mini,
      );
    }
    return Transform.rotate(angle: tilt * math.pi / 180, child: mini);
  }
}

class _Blink extends StatefulWidget {
  final Widget child;
  const _Blink({required this.child});
  @override
  State<_Blink> createState() => _BlinkState();
}

class _BlinkState extends State<_Blink> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: FusibleMotion.pulse);

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (FusibleMotion.reduced(context)) {
      _c.stop();
      return widget.child;
    }
    if (!_c.isAnimating) _c.repeat();
    return AnimatedBuilder(
      animation: _c,
      builder: (_, child) => Opacity(opacity: _c.value < .5 ? 1 : .4, child: child),
      child: widget.child,
    );
  }
}
