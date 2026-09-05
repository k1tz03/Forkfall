import 'package:flutter/material.dart';
import 'package:fusible_core/fusible_core.dart' show kPostulats;

import '../state/game_controller.dart';

/// The title / postulat draw. Three postulats are offered; retourner one starts
/// the run. The full "album fermé" title art is a later design pass.
class TitleScreen extends StatelessWidget {
  final GameController controller;
  final VoidCallback onStart;
  const TitleScreen({super.key, required this.controller, required this.onStart});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    // Offer three postulats drawn from the deck (MVP: first three, stable).
    final offered = [0, 2, 1].take(3).toList();

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 12),
              Text('FUSIBLE', style: Theme.of(context).textTheme.displaySmall?.copyWith(
                    color: scheme.primary,
                    letterSpacing: 2,
                    fontWeight: FontWeight.w900,
                  )),
              Text('Une carrière, un swipe à la fois',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Theme.of(context).hintColor)),
              const SizedBox(height: 28),
              Text('Choisis ton point de départ', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 12),
              Expanded(
                child: ListView(
                  children: [
                    for (final i in offered) _PostulatCard(index: i, controller: controller, onStart: onStart),
                  ],
                ),
              ),
              if (controller.discoveredEndings.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: Text('Cimetière : ${controller.discoveredEndings.length} fin(s) découverte(s)',
                      style: Theme.of(context).textTheme.labelMedium),
                ),
              _SettingsBar(controller: controller),
            ],
          ),
        ),
      ),
    );
  }
}

class _PostulatCard extends StatelessWidget {
  final int index;
  final GameController controller;
  final VoidCallback onStart;
  const _PostulatCard({required this.index, required this.controller, required this.onStart});

  @override
  Widget build(BuildContext context) {
    final post = kPostulats[index];
    final roleName = controller.engine.content.roles[post.role]?.name ?? post.role;
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        title: Text(post.title, style: const TextStyle(fontWeight: FontWeight.w700)),
        subtitle: Text('$roleName · Division ${post.division}'),
        trailing: const Icon(Icons.play_arrow),
        onTap: () {
          controller.newRun(index);
          onStart();
        },
      ),
    );
  }
}

class _SettingsBar extends StatelessWidget {
  final GameController controller;
  const _SettingsBar({required this.controller});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        _toggle(context, 'Boutons', controller.showButtons, controller.setShowButtons),
        _toggle(context, 'Moins d\'animation', controller.reduceMotion, controller.setReduceMotion),
      ],
    );
  }

  Widget _toggle(BuildContext context, String label, bool value, ValueChanged<bool> onChanged) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(label, style: Theme.of(context).textTheme.labelMedium),
        Switch(value: value, onChanged: onChanged),
      ],
    );
  }
}
