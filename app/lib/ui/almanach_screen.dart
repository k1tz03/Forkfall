import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:fusible_core/fusible_core.dart';

import '../state/game_controller.dart';
import '../theme.dart';
import 'widgets/magnets.dart';
import 'widgets/paper.dart';
import 'widgets/une_page.dart';

/// L'Almanach complet (spec variété §1.7, §3.8) : tout le journal de carrière,
/// saison par saison, sur une page de papier qui défile ; « Copier le texte »
/// exporte le journal en clair.
class AlmanachScreen extends StatelessWidget {
  final GameController controller;
  const AlmanachScreen({super.key, required this.controller});

  /// Le journal en texte brut (export), une saison par bloc.
  static String exportText(GameState s, Content content) {
    final b = StringBuffer();
    var season = -1;
    for (final e in s.journal) {
      if (e.season != season) {
        season = e.season;
        if (b.isNotEmpty) b.writeln();
        b.writeln('Saison ${season + 1} · ${e.year}-${((e.year + 1) % 100).toString().padLeft(2, '0')}');
      }
      b.writeln('${e.year} · ${almanachText(e, content, s)}');
    }
    return b.toString().trimRight();
  }

  @override
  Widget build(BuildContext context) {
    final c = controller;
    final s = c.state;
    final content = c.engine.content;
    final entries = s?.journal ?? const <JournalEntry>[];
    final bySeason = <int, List<JournalEntry>>{};
    for (final e in entries) {
      bySeason.putIfAbsent(e.season, () => []).add(e);
    }
    final seasons = bySeason.keys.toList()..sort();
    final who = s?.entities.protagonist ?? '';
    final startYear = c.postulat?.year ?? Engine.startYear;
    final endYear = s?.year ?? startYear;

    return Scaffold(
      backgroundColor: FusibleColors.board,
      body: BoardFrame(
        fullChalk: false,
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(13, 0, 13, 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 6),
                Row(
                  children: [
                    GhostLink(label: 'Retour', text: '← Retour', onPressed: () => Navigator.of(context).maybePop()),
                    const Spacer(),
                    Text('ALMANACH', style: FusibleFonts.cond_(13, weight: FontWeight.w700, height: 1, spacing: .16, color: FusibleColors.creme.withValues(alpha: .85))),
                    const Spacer(),
                    if (s != null)
                      GhostLink(
                        label: 'Copier le texte',
                        text: 'Copier',
                        onPressed: () async {
                          await Clipboard.setData(ClipboardData(text: exportText(s, content)));
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Almanach copié.')));
                          }
                        },
                      ),
                  ],
                ),
                Expanded(
                  child: SingleChildScrollView(
                    clipBehavior: Clip.hardEdge,
                    padding: const EdgeInsets.fromLTRB(0, 14, 0, 18),
                    child: PaperSheet(
                      angle: 0,
                      children: [
                        Masthead(
                          journalNom: "L'Almanach",
                          devise: 'Le journal de carrière, saison par saison',
                          leftHead: 'De',
                          leftBody: '$startYear',
                          rightHead: 'À',
                          rightBody: '$endYear',
                        ),
                        Dateline(parts: [
                          TextSpan(text: who.toUpperCase()),
                          TextSpan(text: (s?.entities.named['club'] ?? '').toUpperCase()),
                          TextSpan(text: '${entries.length} ENTRÉE${entries.length > 1 ? 'S' : ''}'),
                        ]),
                        if (entries.isEmpty)
                          AlmanachLine(year: '$startYear', text: "Une carrière trop courte pour l'Almanach.", first: true)
                        else
                          for (final season in seasons) ...[
                            AlmanachHead('Saison ${season + 1} · ${bySeason[season]!.first.year}-${((bySeason[season]!.first.year + 1) % 100).toString().padLeft(2, '0')}'),
                            for (var i = 0; i < bySeason[season]!.length; i++)
                              AlmanachLine(
                                year: '${bySeason[season]![i].year}',
                                text: almanachText(bySeason[season]![i], content, s!),
                                kind: bySeason[season]![i].kind,
                                first: i == 0,
                              ),
                          ],
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
