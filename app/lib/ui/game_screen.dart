import 'package:flutter/material.dart';
import 'package:fusible_core/fusible_core.dart';

import '../state/game_controller.dart';
import 'widgets/gauges.dart';
import 'widgets/swipe_card.dart';

class GameScreen extends StatefulWidget {
  final GameController controller;
  const GameScreen({super.key, required this.controller});

  @override
  State<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen> {
  double _dragProgress = 0;

  GameController get c => widget.controller;

  @override
  Widget build(BuildContext context) {
    final s = c.state!;
    final p = s.pending!;
    final preview = _dragProgress > 0.05 ? p.previewRight : (_dragProgress < -0.05 ? p.previewLeft : const <GaugeHint>[]);

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            children: [
              const SizedBox(height: 8),
              GaugeRail(role: c.role, gauges: s.gauges, preview: preview),
              const SizedBox(height: 6),
              _ContextLine(state: s, role: c.role),
              const Spacer(),
              Expanded(
                flex: 8,
                child: SwipeCard(
                  key: ValueKey('${p.id}-${s.turn}'),
                  leftLabel: p.leftLabel,
                  rightLabel: p.rightLabel,
                  single: p.single,
                  reduceMotion: c.reduceMotion,
                  onDrag: (v) => setState(() => _dragProgress = v),
                  onChosen: (right) {
                    setState(() => _dragProgress = 0);
                    c.choose(right);
                  },
                  child: _CardBody(pending: p),
                ),
              ),
              const SizedBox(height: 10),
              if (s.lastAnswer != null && s.lastAnswer!.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Text(
                    s.lastAnswer!,
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(fontStyle: FontStyle.italic),
                  ),
                ),
              _Controls(pending: p, showButtons: c.showButtons, onChosen: c.choose),
              const SizedBox(height: 8),
            ],
          ),
        ),
      ),
    );
  }
}

class _ContextLine extends StatelessWidget {
  final GameState state;
  final RoleDef role;
  const _ContextLine({required this.state, required this.role});

  @override
  Widget build(BuildContext context) {
    final obj = state.objectiveLabel.isEmpty ? '' : ' · Obj. ${state.objectiveLabel}';
    final line = 'Saison ${state.season + 1} · ${state.year} · ${state.age} ans · '
        '${state.world.standingRank}e$obj';
    return Text(line, style: Theme.of(context).textTheme.labelMedium?.copyWith(color: Theme.of(context).hintColor));
  }
}

class _CardBody extends StatelessWidget {
  final Pending pending;
  const _CardBody({required this.pending});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      constraints: const BoxConstraints(maxWidth: 420),
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: scheme.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: scheme.outlineVariant),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.12), blurRadius: 18, offset: const Offset(0, 8)),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          if (pending.speaker != null)
            Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: scheme.surfaceContainerHighest,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(pending.speaker!, style: Theme.of(context).textTheme.labelMedium),
              ),
            ),
          Flexible(
            child: SingleChildScrollView(
              child: Text(
                pending.text,
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyLarge,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Controls extends StatelessWidget {
  final Pending pending;
  final bool showButtons;
  final ValueChanged<bool> onChosen;
  const _Controls({required this.pending, required this.showButtons, required this.onChosen});

  @override
  Widget build(BuildContext context) {
    if (pending.single) {
      return FilledButton(
        onPressed: () => onChosen(true),
        child: Text(pending.rightLabel),
      );
    }
    if (!showButtons) {
      return Text(
        'Glisse la carte à gauche ou à droite',
        style: Theme.of(context).textTheme.bodySmall,
        textAlign: TextAlign.center,
      );
    }
    return Row(
      children: [
        Expanded(
          child: FilledButton.tonal(
            onPressed: () => onChosen(false),
            child: Text(pending.leftLabel, textAlign: TextAlign.center),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: FilledButton(
            onPressed: () => onChosen(true),
            child: Text(pending.rightLabel, textAlign: TextAlign.center),
          ),
        ),
      ],
    );
  }
}
