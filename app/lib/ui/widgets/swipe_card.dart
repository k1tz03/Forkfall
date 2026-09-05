import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../theme.dart';
import 'vignette.dart';

/// La vignette que l'on décolle (§5) : elle suit le doigt, rotation =
/// progression × 12° (max), badges révélés à partir de 8 px, aperçu d'effet à
/// partir de 12 px, validation à 30 % de la largeur, sinon retour élastique
/// 250 ms ; départ 200 ms (±1,6 largeur, ±12°) ; pop d'arrivée 200 ms.
/// Sans animation (`MediaQuery.disableAnimations` ou `reduceMotion`), la
/// vignette ne translate ni ne tourne et les états sont finaux.
class SwipeCard extends StatefulWidget {
  final Widget child;
  final double width;
  final String leftLabel;
  final String rightLabel;
  final bool single;
  final bool reduceMotion;
  final ValueChanged<bool> onChosen; // true = droite

  /// Décalage horizontal courant en px (signé) : l'écran en dérive l'aperçu
  /// sur les jauges (> 12 px à droite, < −12 px à gauche).
  final ValueChanged<double>? onDrag;

  const SwipeCard({
    super.key,
    required this.child,
    required this.width,
    required this.leftLabel,
    required this.rightLabel,
    required this.onChosen,
    this.single = false,
    this.reduceMotion = false,
    this.onDrag,
  });

  @override
  State<SwipeCard> createState() => SwipeCardState();
}

class SwipeCardState extends State<SwipeCard> with TickerProviderStateMixin {
  double _dx = 0;
  bool _dragging = false;
  bool _departing = false;
  late final AnimationController _move = AnimationController(vsync: this, duration: FusibleMotion.back)
    ..addListener(() => setState(() => _dx = _moveTween.evaluate(_move)));
  Tween<double> _moveTween = Tween(begin: 0, end: 0);
  late final AnimationController _pop = AnimationController(vsync: this, duration: FusibleMotion.pop);

  bool get _reduced => widget.reduceMotion || MediaQuery.disableAnimationsOf(context);

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      if (_reduced) {
        _pop.value = 1;
      } else {
        _pop.forward();
      }
    });
  }

  @override
  void dispose() {
    _move.dispose();
    _pop.dispose();
    super.dispose();
  }

  double get _progress => (_dx / (widget.width * .5)).clamp(-1.0, 1.0);
  double get _threshold => widget.width * .30;

  void _animateTo(double target, Duration duration, Curve curve, {VoidCallback? then}) {
    _moveTween = Tween(begin: _dx, end: target);
    _move
      ..duration = duration
      ..reset();
    final f = _move.animateTo(1, curve: curve);
    if (then != null) f.whenComplete(then);
  }

  void _update(double delta) {
    if (widget.single || _departing) return;
    setState(() => _dx += delta);
    widget.onDrag?.call(_dx);
  }

  void _end() {
    if (widget.single || _departing) return;
    _dragging = false;
    if (_dx.abs() > _threshold) {
      fling(_dx > 0);
    } else if (_reduced) {
      setState(() => _dx = 0);
      widget.onDrag?.call(0);
    } else {
      _animateTo(0, FusibleMotion.back, FusibleMotion.backCurve, then: () => widget.onDrag?.call(0));
    }
  }

  /// Le même geste, déclenché par un magnet : la vignette part en 200 ms puis
  /// le choix est appliqué (immédiatement sans animation).
  void fling(bool right) {
    if (_departing) return;
    _departing = true;
    if (_reduced) {
      widget.onDrag?.call(0);
      widget.onChosen(right);
      return;
    }
    final target = (right ? 1 : -1) * widget.width * 1.6;
    _animateTo(target, FusibleMotion.depart, Curves.easeInOut, then: () {
      if (!mounted) return;
      widget.onDrag?.call(0);
      widget.onChosen(right);
    });
  }

  @override
  Widget build(BuildContext context) {
    final reduced = _reduced;
    final t = (_dx.abs() / _threshold).clamp(0.0, 1.0);
    final rightOpacity = _dx > 8 ? t : 0.0;
    final leftOpacity = _dx < -8 ? t : 0.0;
    final visualDx = reduced ? 0.0 : _dx;
    final angle = reduced ? 0.0 : _progress * 12 * math.pi / 180;

    final card = Stack(
      clipBehavior: Clip.none,
      children: [
        widget.child,
        if (!widget.single)
          Positioned(bottom: 54, left: -14, child: SwipeBadge(text: widget.leftLabel, right: false, opacity: leftOpacity)),
        Positioned(bottom: 54, right: -14, child: SwipeBadge(text: widget.rightLabel, right: true, opacity: rightOpacity)),
      ],
    );

    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onHorizontalDragStart: widget.single ? null : (_) => _dragging = true,
      onHorizontalDragUpdate: widget.single ? null : (d) => _update(d.delta.dx),
      onHorizontalDragEnd: widget.single ? null : (_) => _end(),
      onHorizontalDragCancel: widget.single ? null : _end,
      child: MouseRegion(
        cursor: widget.single ? MouseCursor.defer : (_dragging ? SystemMouseCursors.grabbing : SystemMouseCursors.grab),
        child: ScaleTransition(
          scale: Tween<double>(begin: .95, end: 1).animate(CurvedAnimation(parent: _pop, curve: Curves.easeOut)),
          child: Transform.translate(
            offset: Offset(visualDx, 0),
            child: Transform.rotate(angle: angle, child: card),
          ),
        ),
      ),
    );
  }
}
