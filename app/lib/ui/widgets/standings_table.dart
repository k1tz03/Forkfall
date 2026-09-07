import 'package:flutter/material.dart';
import 'package:fusible_core/fusible_core.dart';

import '../../theme.dart';
import 'une_page.dart';

// ─────────────────────────────────────────────────────────────────────────────
// LE CLASSEMENT — la feuille punaisée
//
// Retour joueur : « parfois on parle de classement mais cela n'est indiqué
// nulle part, aucune carte avec le classement n'apparaît ». Le moteur
// construit le tableau depuis `world.pts` / `world.standingRank`
// (packages/core/lib/src/standings.dart) et le sert deux fois par saison ; il
// fallait le DESSINER. Rien n'est recalculé ici : on met en page.
//
// La feuille emprunte tout à ce qui existe — le papier de la Une
// ([PaperSheet], `journal` / `encre` / `journalBleu`), les filets pointillés
// de l'Almanach, le scotch des vignettes. Aucune couleur, aucune fonte neuve.
// ─────────────────────────────────────────────────────────────────────────────

/// Les lignes telles que le moteur les pose dans le payload d'une carte
/// Classement (`standings` : la fenêtre de six, `standings_complet` : les
/// dix-huit) — du JSON, relu en [StandingRow] sans rien recalculer.
List<StandingRow> standingRowsFrom(Object? raw) {
  if (raw is! List) return const [];
  final out = <StandingRow>[];
  for (final e in raw) {
    if (e is! Map) continue;
    out.add(StandingRow(
      rang: (e['rang'] as num?)?.toInt() ?? 0,
      club: e['club']?.toString() ?? '',
      pts: (e['pts'] as num?)?.toInt() ?? 0,
      diff: (e['diff'] as num?)?.toInt() ?? 0,
      toi: e['toi'] == true,
    ));
  }
  return out;
}

const double _kRangW = 26;
const double _kPtsW = 36;
const double _kDiffW = 34;

/// Une feuille de classement : en-tête, lignes, pied (qui parle, et le bouton
/// qui ouvre les dix-huit clubs).
class StandingsSheet extends StatelessWidget {
  final List<StandingRow> rows;

  /// « Classement » sur la carte de l'aller, « Classement final » au Bilan,
  /// « Le championnat » sur l'écran complet.
  final String titre;

  /// « 18e journée · D2 ».
  final String sousTitre;

  /// Le locuteur de la carte, ou le nom du club ; masqué sur l'écran complet.
  final String? pied;

  /// « Tout le tableau » : absent quand on regarde déjà tout le tableau.
  final VoidCallback? onPlus;

  final double angle;
  final bool dense;

  const StandingsSheet({
    super.key,
    required this.rows,
    required this.titre,
    required this.sousTitre,
    this.pied,
    this.onPlus,
    this.angle = -1,
    this.dense = false,
  });

  @override
  Widget build(BuildContext context) {
    StandingRow? moi;
    for (final r in rows) {
      if (r.toi) moi = r;
    }
    return Semantics(
      container: true,
      label: '$titre, $sousTitre'
          '${moi == null ? '' : '. Ton club, ${moi.club}, est ${moi.rang}e avec ${moi.pts} points'}',
      child: PaperSheet(
        angle: angle,
        padding: const EdgeInsets.fromLTRB(11, 10, 11, 8),
        children: [
          _tete(),
          const SizedBox(height: 4),
          _entetes(),
          for (var i = 0; i < rows.length; i++) _ligne(rows[i], premiere: i == 0),
          if (pied != null || onPlus != null) _pied(),
        ],
      ),
    );
  }

  Widget _tete() => Container(
        padding: const EdgeInsets.only(bottom: 4),
        decoration: const BoxDecoration(
          border: Border(bottom: BorderSide(color: FusibleColors.journalBleu, width: 2.5)),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.baseline,
          textBaseline: TextBaseline.alphabetic,
          children: [
            Expanded(
              child: Text(
                titre.toUpperCase(),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: FusibleFonts.cond_(13, spacing: .12, color: FusibleColors.journalBleu),
              ),
            ),
            const SizedBox(width: 6),
            Text(
              sousTitre.toUpperCase(),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: FusibleFonts.cond_(9.5, weight: FontWeight.w700, spacing: .08, color: FusibleColors.encre2),
            ),
          ],
        ),
      );

  Widget _entetes() {
    final st = FusibleFonts.cond_(8.5, weight: FontWeight.w700, spacing: .1, color: FusibleColors.encre3);
    return Container(
      padding: const EdgeInsets.only(bottom: 2),
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: FusibleColors.encre3, width: 1)),
      ),
      child: Row(
        children: [
          SizedBox(width: _kRangW, child: Text('RG', textAlign: TextAlign.right, style: st)),
          const SizedBox(width: 7),
          Expanded(child: Text('CLUB', style: st)),
          SizedBox(width: _kPtsW, child: Text('PTS', textAlign: TextAlign.right, style: st)),
          SizedBox(width: _kDiffW, child: Text('DIFF', textAlign: TextAlign.right, style: st)),
        ],
      ),
    );
  }

  Widget _ligne(StandingRow r, {required bool premiere}) {
    final club = FusibleFonts.paper_(11, height: 1.25, color: FusibleColors.encre)
        .copyWith(fontWeight: r.toi ? FontWeight.w700 : FontWeight.w400);
    final rang = FusibleFonts.cond_(11, spacing: .0, color: r.toi ? FusibleColors.journalBleu : FusibleColors.encre2);
    final pts = FusibleFonts.cond_(12, color: r.toi ? FusibleColors.journalBleu : FusibleColors.encre)
        .copyWith(fontFeatures: const [FontFeature.tabularFigures()]);
    final diff = FusibleFonts.paper_(10, height: 1.25, color: FusibleColors.encre2)
        .copyWith(fontFeatures: const [FontFeature.tabularFigures()]);
    final d = r.diff >= 0 ? '+${r.diff}' : '${r.diff}';
    return Container(
      padding: EdgeInsets.symmetric(vertical: dense ? 2 : 3),
      decoration: BoxDecoration(
        // Ta ligne, teintée du bleu du journal : elle se trouve du coin de
        // l'œil, sans clignoter.
        color: r.toi ? FusibleColors.journalBleu.withValues(alpha: .10) : null,
        border: premiere ? null : const Border(top: BorderSide(color: FusibleColors.encre3, width: .6)),
      ),
      child: Row(
        children: [
          SizedBox(
            width: _kRangW,
            child: Text('${r.rang}',
                textAlign: TextAlign.right,
                style: rang.copyWith(fontFeatures: const [FontFeature.tabularFigures()])),
          ),
          const SizedBox(width: 7),
          Expanded(
            child: Row(
              children: [
                if (r.toi)
                  Text('▸ ', style: FusibleFonts.paper_(11, height: 1.25, color: FusibleColors.tampon)),
                Flexible(child: Text(r.club, maxLines: 1, overflow: TextOverflow.ellipsis, style: club)),
              ],
            ),
          ),
          SizedBox(width: _kPtsW, child: Text('${r.pts}', textAlign: TextAlign.right, style: pts)),
          SizedBox(width: _kDiffW, child: Text(d, textAlign: TextAlign.right, style: diff)),
        ],
      ),
    );
  }

  Widget _pied() => Container(
        margin: const EdgeInsets.only(top: 6),
        padding: const EdgeInsets.only(top: 4),
        decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: FusibleColors.encre, width: 1.5)),
        ),
        child: Row(
          children: [
            Expanded(
              child: Text(
                (pied ?? '').toUpperCase(),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: FusibleFonts.cond_(9.5, weight: FontWeight.w700, spacing: .08, color: FusibleColors.encre2),
              ),
            ),
            if (onPlus != null) ...[
              const SizedBox(width: 6),
              Semantics(
                button: true,
                label: 'Voir tout le classement',
                child: InkWell(
                  onTap: onPlus,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                    decoration: BoxDecoration(border: Border.all(color: FusibleColors.encre, width: 1)),
                    child: Text('TOUT LE TABLEAU',
                        style: FusibleFonts.cond_(9.5, spacing: .08, color: FusibleColors.journalBleu)),
                  ),
                ),
              ),
            ],
          ],
        ),
      );
}

/// Ouvre les dix-huit clubs par-dessus le jeu. `view.standings` de l'aperçu
/// web, `engine.standingsOf(state)` ici : la même table, à tout moment.
Future<void> showStandings(
  BuildContext context, {
  required List<StandingRow> rows,
  required String sousTitre,
}) {
  return showDialog<void>(
    context: context,
    barrierColor: FusibleColors.board2.withValues(alpha: .94),
    builder: (context) => Dialog(
      backgroundColor: Colors.transparent,
      elevation: 0,
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 28),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Flexible(
            child: SingleChildScrollView(
              padding: const EdgeInsets.only(top: 10),
              child: StandingsSheet(
                rows: rows,
                titre: 'Le championnat',
                sousTitre: sousTitre,
                angle: -.6,
                dense: true,
              ),
            ),
          ),
          const SizedBox(height: 12),
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text(
              'REFERMER LE CLASSEMENT',
              style: FusibleFonts.cond_(12, weight: FontWeight.w700, spacing: .08, color: FusibleColors.creme)
                  .copyWith(decoration: TextDecoration.underline, decorationColor: FusibleColors.creme),
            ),
          ),
        ],
      ),
    ),
  );
}
