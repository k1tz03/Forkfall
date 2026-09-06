import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:fusible_core/fusible_core.dart';

import '../../theme.dart';
import 'paper.dart';
import 'vignette.dart';

// ─────────────────────────────────────────────────────────────────────────────
// Les composants de presse (§4.5, spec variété §1.6, §3.8) : une feuille de
// journal penchée, son masthead, sa dateline, sa manchette qui se réduit, sa
// photo tramée, ses encadrés. La page de journal du Bilan (UnePage) et la Une
// de l'écran de fin sont bâties avec ces mêmes pièces, comme dans l'aperçu web.
// ─────────────────────────────────────────────────────────────────────────────

/// Devises des trois journaux (décoratives, spec variété §1.6) ; le nom vient
/// du moteur (payload `journal_nom`).
const Map<String, String> kDevises = {
  'quotidien': "Le journal qui siffle avant l'arbitre",
  'gazette': "Tout ce qu'on n'ose pas dire, en rose",
  'echo': 'Le journal de ta rue, depuis toujours',
};

/// La teinte du journal : bleu (Quotidien), rose (Gazette), local (Écho).
Color journalColor(String? style) => switch (style) {
      'rose' => FusibleColors.uiRose,
      'local' => FusibleColors.pelouse,
      _ => FusibleColors.journalBleu,
    };

/// La page de journal du Bilan, prête à rendre : tout vient du payload de
/// `bilan_une` (spec variété §1.6), la photo est la vignette de la dernière
/// carte d'histoire (locuteur, camp, expression du moment), comme
/// `_unePayload` de l'aperçu web.
class UneData {
  final String? journalId;
  final String journalNom;
  final String style;
  final String titre;
  final String sous;
  final List<String> breves;
  final String date;
  final String prix;
  final int annee;
  final int season; // 1-based
  final String club;
  final int division;
  final String rang;
  final bool tenu;
  final String objectif;
  final VignetteData? photo;
  final String? photoAnswer;

  const UneData({
    this.journalId,
    required this.journalNom,
    this.style = 'bleu',
    required this.titre,
    this.sous = '',
    this.breves = const [],
    required this.date,
    this.prix = '',
    required this.annee,
    this.season = 1,
    this.club = '',
    this.division = 1,
    required this.rang,
    this.tenu = false,
    this.objectif = '',
    this.photo,
    this.photoAnswer,
  });

  /// Le payload de `bilan_une` (engine `_bilanUne`) résolu avec le contenu.
  factory UneData.fromPending(Pending p, GameState s, Content content) {
    final pl = p.payload;
    VignetteData? photo;
    String? answer;
    final ph = pl['photo'];
    final selfId = s.role == 'joueur' ? 'joueur' : 'coach';
    if (ph is Map) {
      final cardId = ph['card'] as String?;
      final card = cardId == null ? null : content.cards[cardId];
      final speaker = card?.speaker;
      final ch = speaker == null ? null : content.characters[speaker];
      final rel = speaker == null ? 0 : (s.relations[speaker] ?? 0);
      answer = ph['answer'] as String?;
      photo = VignetteData(
        characterId: speaker ?? selfId,
        expression: rel >= 1 ? 'sourire' : (rel <= -1 ? 'noir' : 'neutre'),
        camp: ch?.camp,
        genre: speaker == null ? s.entities.genre : (ch?.genre ?? 'm'),
        name: ch?.name ?? (speaker ?? s.entities.protagonist),
        label: ch?.label ?? (speaker == null ? (content.roles[s.role]?.name ?? '') : ''),
        number: s.turn,
      );
    }
    final rang = pl['rang'];
    return UneData(
      journalId: pl['journal'] as String?,
      journalNom: (pl['journal_nom'] as String?) ?? 'Le journal',
      style: (pl['style'] as String?) ?? 'bleu',
      titre: (pl['titre'] as String?) ?? p.text,
      sous: (pl['sous'] as String?) ?? '',
      breves: (pl['breves'] as List?)?.map((e) => e.toString()).toList() ?? const [],
      date: (pl['date'] as String?) ?? 'juin ${s.year + 1}',
      prix: (pl['prix'] as String?) ?? '',
      annee: (pl['annee'] as num?)?.toInt() ?? s.year,
      season: s.season + 1,
      club: s.entities.named['club'] ?? '',
      division: s.world.division,
      rang: rang == null ? '${s.world.standingRank}' : '$rang',
      tenu: pl['tenu'] == true,
      objectif: (pl['objectif'] as String?) ?? s.objectiveLabel,
      photo: photo,
      photoAnswer: answer,
    );
  }
}

/// La page de journal du Bilan (spec variété §3.8) : masthead = le journal,
/// date et prix ; dateline saison · club · division ; manchette Barlow 800 34
/// réduite à 28 puis 24 au-delà de 3 lignes ; sous-titre Fraunces italique ;
/// photo = la vignette de la carte fatale en N&B tramé + légende ; colonne
/// « En bref » = 3 brèves ; pied « Classement · Objectif ».
class UnePage extends StatelessWidget {
  final UneData data;
  const UnePage({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    final d = data;
    final accent = journalColor(d.style);
    final yy = ((d.annee + 1) % 100).toString().padLeft(2, '0');
    final pied = FusibleFonts.cond_(11, weight: FontWeight.w700, height: 1, spacing: .08).copyWith(fontFeatures: const [FontFeature.tabularFigures()]);
    final who = d.photo?.name ?? '';
    final rangInt = int.tryParse(d.rang);
    final rangSpan = rangInt == null ? TextSpan(text: d.rang.toUpperCase()) : ordinalSpan(rangInt, pied.copyWith(color: accent));
    final legend = TextSpan(children: [
      if (who.isNotEmpty) ...[
        TextSpan(text: who.toUpperCase(), style: FusibleFonts.cond_(8.5, spacing: .06, color: FusibleColors.encre)),
        const TextSpan(text: ' '),
      ],
      TextSpan(text: d.photoAnswer != null && d.photoAnswer!.isNotEmpty ? '— ${d.photoAnswer}' : "(Photo d'archives)"),
    ]);

    return Semantics(
      label: '${d.journalNom} · ${d.titre}',
      container: true,
      child: PaperSheet(
        children: [
          Masthead(
            journalNom: d.journalNom,
            devise: kDevises[d.journalId] ?? '',
            accent: accent,
            leftHead: 'Édition',
            leftBody: d.date,
            rightHead: 'Prix',
            rightBody: d.prix,
          ),
          Dateline(parts: [
            TextSpan(text: 'SAISON ${d.season} · ${d.annee}-$yy'),
            TextSpan(text: d.club.toUpperCase()),
            TextSpan(text: 'DIVISION ${d.division}'),
          ]),
          Headline(d.titre),
          if (d.sous.isNotEmpty) ...[
            const SizedBox(height: 6),
            Text(d.sous, style: FusibleFonts.paper_(12, italic: true, height: 1.35, color: FusibleColors.encre2)),
          ],
          const SizedBox(height: 8),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(
                width: 100,
                child: PressPhoto(
                  data: d.photo ?? const VignetteData(characterId: 'coach', expression: 'neutre', name: '', number: 0),
                  legend: legend,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: PaperBox(
                  head: 'En bref',
                  accent: accent,
                  child: Breves(items: d.breves, accent: accent),
                ),
              ),
            ],
          ),
          Container(
            margin: const EdgeInsets.only(top: 8),
            padding: const EdgeInsets.only(top: 5),
            decoration: const BoxDecoration(border: Border(top: BorderSide(color: FusibleColors.encre, width: 1.5))),
            child: Row(
              children: [
                Expanded(
                  child: Text.rich(
                    TextSpan(children: [
                      const TextSpan(text: 'CLASSEMENT : '),
                      TextSpan(children: [rangSpan], style: pied.copyWith(color: accent)),
                    ]),
                    style: pied,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                const SizedBox(width: 8),
                Flexible(
                  child: Text.rich(
                    TextSpan(children: [
                      TextSpan(text: 'OBJECTIF ${d.objectif.toUpperCase()} : '),
                      TextSpan(text: d.tenu ? 'TENU' : 'MANQUÉ', style: pied.copyWith(color: d.tenu ? accent : FusibleColors.tampon)),
                    ]),
                    style: pied,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    textAlign: TextAlign.right,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// La feuille de journal : papier `--journal`, −1°, scotchs aux coins,
/// scanlines 1990, ombre portée. Les enfants sont empilés en colonne.
class PaperSheet extends StatelessWidget {
  final List<Widget> children;
  final double angle; // degrés
  final EdgeInsets padding;
  final List<Widget> overlays;
  const PaperSheet({
    super.key,
    required this.children,
    this.angle = -1,
    this.padding = const EdgeInsets.fromLTRB(12, 8, 12, 10),
    this.overlays = const [],
  });

  @override
  Widget build(BuildContext context) {
    return Transform.rotate(
      angle: angle * math.pi / 180,
      alignment: Alignment.topCenter,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Container(
            decoration: BoxDecoration(
              color: FusibleColors.journal,
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: .5), blurRadius: 24, offset: const Offset(0, 14))],
            ),
            child: Stack(
              children: [
                Padding(
                  padding: padding,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: children,
                  ),
                ),
                const Positioned.fill(child: IgnorePointer(child: CustomPaint(painter: ScanlinesPainter()))),
              ],
            ),
          ),
          const Positioned(left: -16, top: -6, child: Tape(angle: -35)),
          const Positioned(right: -16, top: -6, child: Tape(angle: 35)),
          ...overlays,
        ],
      ),
    );
  }
}

/// Masthead : oreille gauche 60 px, titre du journal (Fraunces 900 22) et sa
/// devise, oreille droite 54 px ; filet 2,5 px de la teinte du journal.
class Masthead extends StatelessWidget {
  final String journalNom;
  final String devise;
  final Color accent;
  final String leftHead;
  final String leftBody;
  final String rightHead;
  final String rightBody;
  const Masthead({
    super.key,
    required this.journalNom,
    this.devise = '',
    this.accent = FusibleColors.journalBleu,
    required this.leftHead,
    required this.leftBody,
    required this.rightHead,
    required this.rightBody,
  });

  @override
  Widget build(BuildContext context) {
    Widget ear(String head, String body, {required bool price}) => Container(
          decoration: BoxDecoration(border: Border.all(color: FusibleColors.encre)),
          padding: const EdgeInsets.fromLTRB(4, 3, 4, 3),
          child: Column(
            children: [
              Text(head.toUpperCase(), style: FusibleFonts.cond_(9, weight: FontWeight.w700, spacing: .1)),
              FittedBox(
                fit: BoxFit.scaleDown,
                child: Text(
                  body,
                  textAlign: TextAlign.center,
                  style: price ? FusibleFonts.cond_(16, height: 1, color: accent) : FusibleFonts.cond_(10, weight: FontWeight.w700, height: 1.25, spacing: .04, color: accent),
                ),
              ),
            ],
          ),
        );
    return Container(
      padding: const EdgeInsets.only(bottom: 6),
      decoration: BoxDecoration(border: Border(bottom: BorderSide(color: accent, width: 2.5))),
      child: Row(
        children: [
          SizedBox(width: 60, child: ear(leftHead, leftBody, price: false)),
          const SizedBox(width: 6),
          Expanded(
            child: Column(
              children: [
                FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(journalNom, textAlign: TextAlign.center, style: FusibleFonts.paper_(22, weight: FontWeight.w900, height: 1, spacing: -.01, color: accent)),
                ),
                if (devise.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Text(devise.toUpperCase(), style: FusibleFonts.ui_(7.5, weight: FontWeight.w600, spacing: .18, color: FusibleColors.encre2)),
                  ),
                ],
              ],
            ),
          ),
          const SizedBox(width: 6),
          SizedBox(width: 54, child: ear(rightHead, rightBody, price: true)),
        ],
      ),
    );
  }
}

/// Dateline : petites capitales Manrope 700 8, filet encre en dessous.
class Dateline extends StatelessWidget {
  final List<InlineSpan> parts;
  const Dateline({super.key, required this.parts});

  @override
  Widget build(BuildContext context) {
    final style = FusibleFonts.ui_(8, weight: FontWeight.w700, spacing: .08).copyWith(fontFeatures: const [FontFeature.tabularFigures()]);
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(vertical: 3),
      decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: FusibleColors.encre))),
      child: Row(
        children: [
          for (var i = 0; i < parts.length; i++) ...[
            if (i > 0) const SizedBox(width: 6),
            Flexible(
              child: Text.rich(
                parts[i],
                style: style,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                textAlign: i == 0 ? TextAlign.left : (i == parts.length - 1 ? TextAlign.right : TextAlign.center),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

/// La manchette (Barlow 800, 34 / .95, capitales) : ≤ 3 lignes ; au-delà on
/// réduit à 28 puis à 24 (spec variété §3.8). Le corps retenu se lit sur le
/// `Text` rendu (testé).
class Headline extends StatelessWidget {
  final String text;
  final List<double> sizes;
  const Headline(this.text, {super.key, this.sizes = const [34, 28, 24]});

  static TextStyle styleFor(double size) => FusibleFonts.cond_(size, height: .95, spacing: .005);

  @override
  Widget build(BuildContext context) {
    final upper = text.toUpperCase();
    return LayoutBuilder(
      builder: (context, box) {
        final width = box.maxWidth.isFinite ? box.maxWidth : 340.0;
        var chosen = sizes.last;
        for (final size in sizes) {
          final tp = TextPainter(text: TextSpan(text: upper, style: styleFor(size)), textDirection: TextDirection.ltr)..layout(maxWidth: width);
          final lines = tp.computeLineMetrics().length;
          if (lines <= 3) {
            chosen = size;
            break;
          }
        }
        return Text(upper, style: styleFor(chosen));
      },
    );
  }
}

/// La photo de presse : la vignette en N&B contrasté, trame 3 px, filet encre,
/// légende Fraunces italique 8.
class PressPhoto extends StatelessWidget {
  final VignetteData data;
  final InlineSpan legend;
  const PressPhoto({super.key, required this.data, required this.legend});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          decoration: BoxDecoration(border: Border.all(color: FusibleColors.encre)),
          child: ClipRect(
            child: Stack(
              children: [
                Vignette(data: data, width: 98, compact: true, showPin: false, grayscale: true),
                const Positioned.fill(child: IgnorePointer(child: CustomPaint(painter: TramePainter()))),
              ],
            ),
          ),
        ),
        const SizedBox(height: 3),
        Text.rich(legend, style: FusibleFonts.paper_(8, italic: true, height: 1.3, color: FusibleColors.encre2)),
      ],
    );
  }
}

/// Encadré à filet encre 1 px et tête de rubrique (Barlow 800 10, .14em) dans
/// la teinte du journal.
class PaperBox extends StatelessWidget {
  final String head;
  final Widget child;
  final Color accent;
  const PaperBox({super.key, required this.head, required this.child, this.accent = FusibleColors.journalBleu});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(border: Border.all(color: FusibleColors.encre)),
      padding: const EdgeInsets.fromLTRB(6, 4, 6, 5),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            margin: const EdgeInsets.only(bottom: 4),
            padding: const EdgeInsets.only(bottom: 2),
            decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: FusibleColors.encre3))),
            child: Text(head.toUpperCase(), style: FusibleFonts.cond_(10, spacing: .14, color: accent)),
          ),
          child,
        ],
      ),
    );
  }
}

/// Les brèves : liste Fraunces 10,5, puce carrée 4 px de la teinte du journal,
/// filet pointillé entre les entrées ; texte de secours sans brève.
class Breves extends StatelessWidget {
  final List<String> items;
  final Color accent;
  const Breves({super.key, required this.items, this.accent = FusibleColors.journalBleu});

  @override
  Widget build(BuildContext context) {
    final style = FusibleFonts.paper_(10.5, height: 1.3);
    if (items.isEmpty) {
      return Text("Rien à signaler. La saison s'est jouée sur le terrain.", style: style.copyWith(fontStyle: FontStyle.italic, color: FusibleColors.encre3));
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        for (var i = 0; i < items.length; i++)
          Container(
            padding: EdgeInsets.fromLTRB(9, i == 0 ? 1 : 3, 0, 3),
            decoration: i == 0 ? null : const BoxDecoration(border: Border(top: BorderSide(color: FusibleColors.encre3, width: .8))),
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                Positioned(left: -9, top: 5, child: Container(width: 4, height: 4, color: accent)),
                Text(items[i], style: style),
              ],
            ),
          ),
      ],
    );
  }
}

/// Trame radiale 3 px en multiply (photo de presse).
class TramePainter extends CustomPainter {
  const TramePainter();

  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()
      ..color = Colors.black.withValues(alpha: .35)
      ..blendMode = BlendMode.multiply;
    for (var y = 1.5; y < size.height; y += 3) {
      for (var x = 1.5; x < size.width; x += 3) {
        canvas.drawCircle(Offset(x, y), .7, p);
      }
    }
  }

  @override
  bool shouldRepaint(TramePainter oldDelegate) => false;
}

/// Scanlines 1990 à 5 % (une ligne sur trois).
class ScanlinesPainter extends CustomPainter {
  const ScanlinesPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()..color = Colors.black.withValues(alpha: .05);
    for (var y = 0.0; y < size.height; y += 3) {
      canvas.drawRect(Rect.fromLTWH(0, y, size.width, 1), p);
    }
  }

  @override
  bool shouldRepaint(ScanlinesPainter oldDelegate) => false;
}

/// Tête de rubrique de l'Almanach (« Ce qui s'est passé », « Objectifs 1/3 »…)
/// : Barlow 800 11, .14em, teinte du journal, filet qui court à droite.
class AlmanachHead extends StatelessWidget {
  final String text;
  final Color accent;
  const AlmanachHead(this.text, {super.key, this.accent = FusibleColors.journalBleu});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(0, 6, 0, 3),
      child: Row(
        children: [
          Text(text.toUpperCase(), style: FusibleFonts.cond_(11, spacing: .14, color: accent)),
          const SizedBox(width: 6),
          Expanded(child: Container(height: 1, color: FusibleColors.encre3)),
        ],
      ),
    );
  }
}

/// Une ligne d'Almanach : « 1991 · texte » (année Barlow 800 11 dans la teinte
/// du journal, rouge pour la fin ; texte Fraunces 11, italique pour une Une).
class AlmanachLine extends StatelessWidget {
  final String year;
  final String text;
  final String kind;
  final bool first;
  final Color accent;
  const AlmanachLine({super.key, required this.year, required this.text, this.kind = 'carte', this.first = false, this.accent = FusibleColors.journalBleu});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 2),
      decoration: first ? null : const BoxDecoration(border: Border(top: BorderSide(color: FusibleColors.encre3, width: .8))),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 34,
            child: Padding(
              padding: const EdgeInsets.only(top: 1),
              child: Text(year, style: FusibleFonts.cond_(11, spacing: .04, color: kind == 'fin' ? FusibleColors.tampon : accent).copyWith(fontFeatures: const [FontFeature.tabularFigures()])),
            ),
          ),
          const SizedBox(width: 6),
          Expanded(child: Text(text, style: FusibleFonts.paper_(11, height: 1.3, italic: kind == 'une'))),
        ],
      ),
    );
  }
}

/// Le texte d'une ligne d'Almanach : sans l'année en tête (« 1991 · »), première
/// lettre en capitale ; une Une est citée avec le journal qui l'a titrée.
String almanachText(JournalEntry e, Content content, GameState s) {
  var txt = e.text.replaceFirst(RegExp(r'^\s*\d{4}\s*[·:]\s*'), '');
  if (txt.isNotEmpty) txt = txt[0].toUpperCase() + txt.substring(1);
  if (e.kind == 'une') {
    final une = e.arc == null ? null : content.unes.where((u) => u.id == e.arc).firstOrNull;
    final journal = content.journaux[une?.journal ?? 'quotidien'];
    final nom = journal == null ? 'Le journal' : formatText(journal.nom, s);
    txt = '« $txt », titre $nom.';
  }
  return txt;
}
