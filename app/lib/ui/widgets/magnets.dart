import 'package:flutter/material.dart';

import '../../theme.dart';
import 'paper.dart';

/// Magnet de réponse (§4.3) : 56 px min, rayon 16, pastille métal 24 px ;
/// gauche crème / encre, droite orange / encre. Libellé Barlow 700 14.
class MagnetButton extends StatefulWidget {
  final String label;
  final bool right;
  final VoidCallback onPressed;
  const MagnetButton({super.key, required this.label, required this.right, required this.onPressed});

  @override
  State<MagnetButton> createState() => _MagnetButtonState();
}

class _MagnetButtonState extends State<MagnetButton> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final right = widget.right;
    final bg = right ? FusibleColors.uiOrange : FusibleColors.creme;
    final lip = right ? const Color(0xFFA3550C) : const Color(0xFFB9AB86);
    final disc = Container(
      width: 24,
      height: 24,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(
          center: const Alignment(-.3, -.4),
          colors: right ? const [Colors.white, Color(0xFFFFD6B0), Color(0xFFC86F1A)] : const [Colors.white, Color(0xFFD9D9D9), Color(0xFF8F8F8F)],
          stops: const [0, .6, 1],
        ),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: .5), blurRadius: 2, offset: const Offset(0, 1))],
      ),
    );
    final text = Expanded(
      child: Text(
        widget.label.toUpperCase(),
        textAlign: right ? TextAlign.right : TextAlign.left,
        maxLines: 3,
        overflow: TextOverflow.ellipsis,
        style: FusibleFonts.cond_(14, weight: FontWeight.w700, height: 1.05, spacing: .03),
      ),
    );
    return Semantics(
      label: widget.label,
      button: true,
      onTap: widget.onPressed,
      excludeSemantics: true,
      child: GestureDetector(
        onTapDown: (_) => setState(() => _pressed = true),
        onTapCancel: () => setState(() => _pressed = false),
        onTapUp: (_) => setState(() => _pressed = false),
        onTap: widget.onPressed,
        child: Transform.translate(
          offset: Offset(0, _pressed ? 2 : 0),
          child: Container(
            constraints: const BoxConstraints(minHeight: 56),
            padding: EdgeInsets.fromLTRB(right ? 12 : 10, 8, right ? 10 : 12, 8),
            decoration: BoxDecoration(
              color: bg,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(color: lip, offset: Offset(0, _pressed ? 1 : 3)),
                if (!_pressed) BoxShadow(color: Colors.black.withValues(alpha: .45), blurRadius: 12, offset: const Offset(0, 6)),
              ],
            ),
            child: Row(
              children: right ? [text, const SizedBox(width: 8), disc] : [disc, const SizedBox(width: 8), text],
            ),
          ),
        ),
      ),
    );
  }
}

/// Sticker CTA (§4.3) : blanc vignette, pastille rouge 18 px, −1,5°, ruban
/// adhésif au coin, sous-libellé Manrope 10.
class StickerButton extends StatelessWidget {
  final String label;
  final String? sub;
  final VoidCallback onPressed;
  final String? semanticsLabel;
  const StickerButton({super.key, required this.label, this.sub, required this.onPressed, this.semanticsLabel});

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: semanticsLabel ?? label,
      button: true,
      onTap: onPressed,
      excludeSemantics: true,
      child: GestureDetector(
        onTap: onPressed,
        child: Transform.rotate(
          angle: -1.5 * 3.141592653589793 / 180,
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              Container(
                padding: const EdgeInsets.fromLTRB(24, 12, 24, 12),
                decoration: BoxDecoration(
                  color: FusibleColors.blancVignette,
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(3),
                    topRight: Radius.circular(6),
                    bottomRight: Radius.circular(3),
                    bottomLeft: Radius.circular(5),
                  ),
                  boxShadow: [
                    const BoxShadow(color: Color(0xFFCFC3A0), offset: Offset(0, 3)),
                    BoxShadow(color: Colors.black.withValues(alpha: .35), blurRadius: 18, offset: const Offset(0, 10)),
                  ],
                ),
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 18,
                        height: 18,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: FusibleColors.tampon,
                          border: Border.all(color: FusibleColors.blancVignette, width: 3),
                          boxShadow: const [BoxShadow(color: FusibleColors.tampon, spreadRadius: 2)],
                        ),
                      ),
                      const SizedBox(width: 10),
                      Text(label.toUpperCase(), style: FusibleFonts.cond_(22, height: 1, spacing: .06)),
                      if (sub != null) ...[
                        const SizedBox(width: 10),
                        Text(sub!, style: FusibleFonts.ui_(10, weight: FontWeight.w600, spacing: .02, color: FusibleColors.encre2)),
                      ],
                    ],
                  ),
                ),
              ),
              const Positioned(left: -16, top: -7, child: Tape(width: 48, height: 14, angle: -32)),
            ],
          ),
        ),
      ),
    );
  }
}

/// Lien-texte Barlow 12 souligné, crème 75 % (Rejouer, Partager, Almanach…).
class GhostLink extends StatelessWidget {
  final String label;
  final String text;
  final VoidCallback onPressed;
  const GhostLink({super.key, required this.label, required this.text, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: label,
      button: true,
      onTap: onPressed,
      excludeSemantics: true,
      child: GestureDetector(
        onTap: onPressed,
        behavior: HitTestBehavior.opaque,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 6),
          child: Text(
            text.toUpperCase(),
            style: FusibleFonts.cond_(12, weight: FontWeight.w600, height: 1, spacing: .08, color: FusibleColors.creme.withValues(alpha: .75)).copyWith(
              decoration: TextDecoration.underline,
              decorationColor: FusibleColors.creme.withValues(alpha: .75),
            ),
          ),
        ),
      ),
    );
  }
}
