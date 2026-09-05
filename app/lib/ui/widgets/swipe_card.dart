import 'package:flutter/material.dart';

/// A draggable card à la Reigns: tilt with the drag, reveal the side label past
/// a small threshold, validate past 30% of the width. `reduceMotion` swaps the
/// tilt/throw for a plain fade; the surrounding screen always also offers
/// tappable buttons for accessibility.
class SwipeCard extends StatefulWidget {
  final Widget child;
  final String leftLabel;
  final String rightLabel;
  final bool single;
  final bool reduceMotion;
  final ValueChanged<bool> onChosen; // true = right
  final ValueChanged<double>? onDrag; // -1..1 progress (for gauge previews)

  const SwipeCard({
    super.key,
    required this.child,
    required this.leftLabel,
    required this.rightLabel,
    required this.onChosen,
    this.single = false,
    this.reduceMotion = false,
    this.onDrag,
  });

  @override
  State<SwipeCard> createState() => _SwipeCardState();
}

class _SwipeCardState extends State<SwipeCard> {
  double _dx = 0;

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    final threshold = width * 0.30;
    final progress = (_dx / (width * 0.5)).clamp(-1.0, 1.0);
    final angle = widget.reduceMotion ? 0.0 : progress * 0.18;

    void reset() {
      setState(() => _dx = 0);
      widget.onDrag?.call(0);
    }

    return GestureDetector(
      onHorizontalDragUpdate: (d) {
        if (widget.single) return;
        setState(() => _dx += d.delta.dx);
        widget.onDrag?.call(progress);
      },
      onHorizontalDragEnd: (_) {
        if (widget.single) return;
        if (_dx.abs() > threshold) {
          widget.onChosen(_dx > 0);
        }
        reset();
      },
      child: Stack(
        alignment: Alignment.center,
        children: [
          Transform.rotate(
            angle: angle,
            child: Transform.translate(
              offset: Offset(widget.reduceMotion ? 0 : _dx, 0),
              child: widget.child,
            ),
          ),
          if (!widget.single && _dx.abs() > 24)
            Positioned(
              top: 8,
              left: _dx < 0 ? 16 : null,
              right: _dx > 0 ? 16 : null,
              child: _ChoiceBadge(
                text: _dx > 0 ? widget.rightLabel : widget.leftLabel,
                opacity: (_dx.abs() / threshold).clamp(0.0, 1.0),
              ),
            ),
        ],
      ),
    );
  }
}

class _ChoiceBadge extends StatelessWidget {
  final String text;
  final double opacity;
  const _ChoiceBadge({required this.text, required this.opacity});

  @override
  Widget build(BuildContext context) {
    return Opacity(
      opacity: opacity,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.inverseSurface,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(
          text,
          style: TextStyle(color: Theme.of(context).colorScheme.onInverseSurface, fontWeight: FontWeight.w700),
        ),
      ),
    );
  }
}
