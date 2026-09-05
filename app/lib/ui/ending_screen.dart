import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../state/game_controller.dart';

/// The Épitaphe: the guilty gauge barred, two lines of epitaph, the score, and
/// the Succession (start the next run) plus a share text (docs/brainstorm 2.9).
class EndingScreen extends StatelessWidget {
  final GameController controller;
  final VoidCallback onNewRun;
  const EndingScreen({super.key, required this.controller, required this.onNewRun});

  @override
  Widget build(BuildContext context) {
    final c = controller;
    final s = c.state!;
    final e = c.ending;
    final payload = s.pending?.payload ?? const {};
    final golden = payload['golden'] == true;
    final guilty = payload['gauge'] as String?;
    final side = payload['side'] as String?;
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      backgroundColor: golden ? const Color(0xFF2A2410) : scheme.surface,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 8),
              Container(
                alignment: Alignment.center,
                padding: const EdgeInsets.symmetric(vertical: 6),
                decoration: BoxDecoration(
                  color: golden ? const Color(0xFFE5B63D) : const Color(0xFFC4372E),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  golden ? 'FIN' : 'CARTON ROUGE',
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, letterSpacing: 2),
                ),
              ),
              const SizedBox(height: 28),
              Text(
                e?.title ?? 'Fin de carrière',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.displaySmall?.copyWith(
                      color: golden ? const Color(0xFFF3E9C6) : null,
                    ),
              ),
              if (guilty != null) ...[
                const SizedBox(height: 16),
                _GuiltyGauge(gauge: guilty, side: side),
              ],
              const SizedBox(height: 20),
              Text(
                e?.epitaph ?? '',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      fontStyle: FontStyle.italic,
                      color: golden ? const Color(0xFFE8DFC4) : null,
                    ),
              ),
              const SizedBox(height: 24),
              _ScoreRow(controller: c),
              const Spacer(),
              OutlinedButton.icon(
                onPressed: () async {
                  await Clipboard.setData(ClipboardData(text: c.shareText()));
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Récit copié — colle-le où tu veux.')),
                    );
                  }
                },
                icon: const Icon(Icons.ios_share),
                label: const Text('Partager le récit'),
              ),
              const SizedBox(height: 10),
              FilledButton(
                onPressed: onNewRun,
                child: const Text('Successeur — nouvelle carrière'),
              ),
              const SizedBox(height: 8),
            ],
          ),
        ),
      ),
    );
  }
}

class _GuiltyGauge extends StatelessWidget {
  final String gauge;
  final String? side;
  const _GuiltyGauge({required this.gauge, this.side});

  static const _icons = {'vestiaire': '👟', 'tribunes': '🧣', 'direction': '💺', 'caisse': '💶'};

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Stack(
          alignment: Alignment.center,
          children: [
            Text(_icons[gauge] ?? '•', style: const TextStyle(fontSize: 28)),
            Container(width: 40, height: 3, color: const Color(0xFFC4372E)),
          ],
        ),
        const SizedBox(width: 10),
        Text(side == 'plein' ? 'jauge qui déborde' : 'jauge vide',
            style: Theme.of(context).textTheme.labelLarge),
      ],
    );
  }
}

class _ScoreRow extends StatelessWidget {
  final GameController controller;
  const _ScoreRow({required this.controller});

  @override
  Widget build(BuildContext context) {
    final s = controller.state!;
    Widget tile(String v, String l) => Column(
          children: [
            Text(v, style: Theme.of(context).textTheme.headlineSmall),
            Text(l, style: Theme.of(context).textTheme.labelSmall),
          ],
        );
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        tile('${s.stats['saisons'] ?? 0}', 'saisons'),
        tile('${s.stats['roles'] ?? 1}', 'rôles'),
        tile('${s.stats['titres'] ?? 0}', 'titres'),
        tile('${controller.discoveredEndings.length}', 'fins'),
      ],
    );
  }
}
