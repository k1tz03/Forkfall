import 'package:flutter/material.dart';
import 'package:fusible_core/fusible_core.dart';

const Map<String, String> _icons = {
  'vestiaire': '👟',
  'tribunes': '🧣',
  'direction': '💺',
  'caisse': '💶',
};

/// The four-gauge HUD. Gauges are read-only (out of the thumb zone), lisible by
/// shape and position, hachured near the edges. During a drag, a preview dot
/// hints the magnitude of the swipe (never the sign).
class GaugeRail extends StatelessWidget {
  final RoleDef role;
  final Map<String, int> gauges;
  final List<GaugeHint> preview;
  const GaugeRail({super.key, required this.role, required this.gauges, this.preview = const []});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        for (final g in role.gauges)
          _Gauge(
            label: g.label,
            icon: _icons[g.id] ?? '•',
            value: gauges[g.id] ?? 50,
            hint: preview.where((h) => h.gauge == g.id).fold<int>(0, (m, h) => h.magnitude > m ? h.magnitude : m),
          ),
      ],
    );
  }
}

class _Gauge extends StatelessWidget {
  final String label;
  final String icon;
  final int value;
  final int hint;
  const _Gauge({required this.label, required this.icon, required this.value, required this.hint});

  @override
  Widget build(BuildContext context) {
    final danger = value <= 20 || value >= 80;
    final scheme = Theme.of(context).colorScheme;
    final fillColor = danger ? const Color(0xFFC4372E) : scheme.primary;
    return Semantics(
      label: '$label ${_word(value)}${danger ? ', danger' : ''}',
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(
            width: 34,
            height: 46,
            child: Stack(
              alignment: Alignment.bottomCenter,
              children: [
                Container(
                  decoration: BoxDecoration(
                    color: scheme.surfaceContainerHighest,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: danger ? const Color(0xFFC4372E) : scheme.outlineVariant,
                      width: danger ? 2 : 1,
                    ),
                  ),
                ),
                FractionallySizedBox(
                  heightFactor: (value / 100).clamp(0.02, 1.0),
                  child: Container(
                    decoration: BoxDecoration(
                      color: fillColor,
                      borderRadius: BorderRadius.circular(7),
                    ),
                  ),
                ),
                if (hint > 0)
                  Positioned(
                    top: 2,
                    child: Container(
                      width: 4.0 + hint * 3,
                      height: 4.0 + hint * 3,
                      decoration: BoxDecoration(
                        color: scheme.onSurface,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                Center(child: Text(icon, style: const TextStyle(fontSize: 16))),
              ],
            ),
          ),
          const SizedBox(height: 4),
          SizedBox(
            width: 62,
            child: Text(
              label,
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: Theme.of(context).textTheme.labelSmall,
            ),
          ),
        ],
      ),
    );
  }

  String _word(int v) {
    if (v <= 15) return 'très bas';
    if (v <= 35) return 'bas';
    if (v <= 65) return 'stable';
    if (v <= 85) return 'élevé';
    return 'très élevé';
  }
}
