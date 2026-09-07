import 'dart:async';

import 'package:flutter/material.dart';
import 'package:fusible_core/fusible_core.dart';

import '../state/game_controller.dart';
import '../theme.dart';
import 'card_data.dart';
import 'widgets/album_rail.dart';
import 'widgets/magnets.dart';
import 'widgets/paper.dart';
import 'widgets/swipe_card.dart';
import 'widgets/une_page.dart';
import 'widgets/vignette.dart';

const double _cardWidth = 222;
const double _cardZoneHeight = 342;

/// L'écran de jeu (§3, référence 390 × 844) : statut, rail de cases d'album,
/// ligne de contexte, ruban de promesse, le tableau tactique qui tient la
/// vignette, le texte de carte hors de la vignette, la réponse précédente, les
/// magnets et la hintline.
class GameScreen extends StatefulWidget {
  final GameController controller;
  const GameScreen({super.key, required this.controller});

  @override
  State<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen> {
  double _dx = 0;
  // Une clé par carte : la vignette est remontée (et « pop ») à chaque carte.
  GlobalKey<SwipeCardState> _cardKey = GlobalKey<SwipeCardState>();
  String _cardKeyFor = '';
  // Bandeau « Nouvelle histoire : {titre} » (spec variété §3.8) : 2 s à
  // l'arrivée d'une carte dont le payload porte `unlocked_story`.
  String? _banner;
  Timer? _bannerTimer;

  GameController get c => widget.controller;

  @override
  void dispose() {
    _bannerTimer?.cancel();
    super.dispose();
  }

  void _onNewCard(Pending p) {
    final story = p.payload['unlocked_story'];
    _bannerTimer?.cancel();
    _bannerTimer = null;
    if (story == null) {
      _banner = null;
      return;
    }
    _banner = story.toString();
    _bannerTimer = Timer(const Duration(seconds: 2), () {
      if (mounted) setState(() => _banner = null);
    });
  }

  @override
  Widget build(BuildContext context) {
    final s = c.state!;
    final p = s.pending!;
    final content = c.engine.content;
    final role = c.role;
    final reduced = c.reduceMotion || FusibleMotion.reduced(context);
    final preview = _dx > 12 ? p.previewRight : (_dx < -12 ? p.previewLeft : const <GaugeHint>[]);
    final data = vignetteFor(p, s, content);
    final cardId = '${p.id}-${s.turn}';
    if (_cardKeyFor != cardId) {
      _cardKey = GlobalKey<SwipeCardState>();
      _cardKeyFor = cardId;
      _onNewCard(p);
    }
    final isUne = p.kind == 'bilan_une';

    void choose(bool right) {
      setState(() => _dx = 0);
      c.choose(right);
    }

    void pose(bool right) {
      final state = _cardKey.currentState;
      if (state != null) {
        state.fling(right);
      } else {
        choose(right);
      }
    }

    return Scaffold(
      backgroundColor: FusibleColors.board,
      body: BoardFrame(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(13, 0, 13, 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 6),
                _StatusLine(state: s, roleName: role.name),
                const SizedBox(height: 10),
                AlbumRail(role: role, gauges: s.gauges, preview: preview),
                const SizedBox(height: 10),
                _ContextLine(state: s),
                if (s.objectivePromised) ...[
                  const SizedBox(height: 6),
                  // Le créancier de la promesse est le PATRON du rôle courant
                  // (le président sur un banc, l'agent chez un joueur) : c'est
                  // lui qui tient la carte Objectif. `named['president']` ne
                  // nomme que le président, et le bandeau d'une carrière de
                  // joueur créditait le mauvais homme.
                  _Ruban(state: s, creancier: c.engine.patronName(s)),
                ],
                // La page de journal du Bilan (spec variété §1.6, §3.8) remplace
                // la vignette, le texte et la réponse : elle défile, un seul
                // magnet « Tourner la page ».
                if (isUne)
                  Expanded(
                    child: SingleChildScrollView(
                      clipBehavior: Clip.hardEdge,
                      padding: const EdgeInsets.fromLTRB(0, 16, 0, 14),
                      child: UnePage(data: UneData.fromPending(p, s, content)),
                    ),
                  )
                else
                // Zone de vignette (342 px de référence) + texte de carte + réponse
                // précédente : le texte suit la vignette et les magnets suivent la
                // réponse (8 à 30 px) ; ce qui reste tombe SOUS la hintline, comme
                // dans la maquette. Le Flexible « loose » ne prend que ce dont il
                // a besoin ; sur un écran court, la vignette se réduit avant le
                // texte.
                Flexible(
                  child: LayoutBuilder(
                    builder: (context, box) {
                      final textStyle = FusibleFonts.ui_(16, height: 1.5, color: FusibleColors.creme);
                      final answerStyle = FusibleFonts.paper_(12, italic: true, height: 1.4, color: FusibleColors.creme.withValues(alpha: .7));
                      final tp = TextPainter(text: TextSpan(text: cardTextForMeasure(p.text), style: textStyle), textAlign: TextAlign.center, textDirection: TextDirection.ltr, maxLines: 6)
                        ..layout(maxWidth: box.maxWidth);
                      final textH = tp.height.clamp(72.0, 144.0);
                      // Réponse précédente : 18 px de référence (1 ligne), 2 lignes au plus.
                      final ap = TextPainter(text: TextSpan(text: s.lastAnswer ?? '', style: answerStyle), textAlign: TextAlign.center, textDirection: TextDirection.ltr, maxLines: 2)
                        ..layout(maxWidth: box.maxWidth);
                      final answerH = ap.height.clamp(18.0, 34.0);
                      final zoneH = (box.maxHeight - 12 - textH - 10 - 4 - answerH).clamp(0.0, _cardZoneHeight);
                      final gap = (box.maxHeight - 12 - zoneH - 10 - textH - 4 - answerH).clamp(0.0, 22.0);
                      return Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          const SizedBox(height: 12),
                          SizedBox(
                            height: zoneH,
                            child: FittedBox(
                              fit: BoxFit.scaleDown,
                              alignment: Alignment.topCenter,
                              child: SizedBox(
                                width: _cardWidth + 2 * 40,
                                height: _cardZoneHeight,
                                child: Stack(
                                  clipBehavior: Clip.none,
                                  alignment: Alignment.topCenter,
                                  children: [
                                    Positioned(
                                      top: 12,
                                      child: SwipeCard(
                                        key: _cardKey,
                                        width: _cardWidth,
                                        leftLabel: p.leftLabel,
                                        rightLabel: p.rightLabel,
                                        single: p.single,
                                        reduceMotion: reduced,
                                        onDrag: (dx) => setState(() => _dx = dx),
                                        onChosen: choose,
                                        child: Vignette(data: data, width: _cardWidth),
                                      ),
                                    ),
                                    if (_banner != null) Positioned(top: -8, child: _StoryBanner(title: _banner!, reduced: reduced)),
                                  ],
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 10),
                          // Le texte de carte, hors de la vignette (Manrope 16/24, fondu 120 ms).
                          SizedBox(
                            height: textH,
                            child: AnimatedSwitcher(
                              duration: reduced ? Duration.zero : FusibleMotion.text,
                              switchInCurve: Curves.linear,
                              switchOutCurve: Curves.linear,
                              layoutBuilder: (current, previous) => Stack(
                                alignment: Alignment.topCenter,
                                children: [...previous, if (current != null) current],
                              ),
                              child: SingleChildScrollView(
                                key: ValueKey(cardId),
                                child: Text.rich(cardTextSpan(p.text, textStyle), textAlign: TextAlign.center, style: textStyle),
                              ),
                            ),
                          ),
                          const SizedBox(height: 4),
                          SizedBox(
                            height: answerH,
                            child: Text(
                              s.lastAnswer ?? '',
                              textAlign: TextAlign.center,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: answerStyle,
                            ),
                          ),
                          SizedBox(height: gap),
                        ],
                      );
                    },
                  ),
                ),
                const SizedBox(height: 8),
                if (p.single)
                  MagnetButton(label: p.rightLabel, right: true, onPressed: () => pose(true))
                else
                  IntrinsicHeight(
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Expanded(child: MagnetButton(label: p.leftLabel, right: false, onPressed: () => pose(false))),
                        const SizedBox(width: 12),
                        Expanded(child: MagnetButton(label: p.rightLabel, right: true, onPressed: () => pose(true))),
                      ],
                    ),
                  ),
                const SizedBox(height: 8),
                _Hintline(single: p.single, une: isUne),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Statut (44 px) : écusson, club, « Saison n · J x », étiquette de rôle.
class _StatusLine extends StatelessWidget {
  final GameState state;
  final String roleName;
  const _StatusLine({required this.state, required this.roleName});

  @override
  Widget build(BuildContext context) {
    final club = (state.entities.named['club'] ?? state.entities.named['clubShort'] ?? '').toUpperCase();
    final clubShort = (state.entities.named['clubShort'] ?? club).toUpperCase();
    final season = 'SAISON\u00A0${state.season + 1}\u00A0·\u00A0J\u00A0${state.world.blocks}';
    final style = FusibleFonts.cond_(13, weight: FontWeight.w700, height: 1, spacing: .06, color: FusibleColors.creme);
    return SizedBox(
      height: 44,
      child: Row(
        children: [
          const ExcludeSemantics(child: Ecu()),
          const SizedBox(width: 8),
          // Le nom entier du club, ou son nom court (fourni par le moteur) dès
          // que le nom entier ne tient pas ; « Saison n · J x » garde sa largeur
          // naturelle et ne se réduit (« J x » d'abord) qu'après le nom court.
          Expanded(
            child: LayoutBuilder(
              builder: (context, box) {
                double widthOf(String t) => (TextPainter(text: TextSpan(text: t, style: style), maxLines: 1, textDirection: TextDirection.ltr)..layout()).width;
                final seasonW = widthOf(season);
                final seasonMinW = widthOf('SAISON\u00A0${state.season + 1}');
                final fullW = widthOf(club);
                final shortW = widthOf(clubShort);
                final String text;
                final double clubW;
                if (fullW <= box.maxWidth - 8 - seasonW) {
                  text = club;
                  clubW = fullW;
                } else {
                  text = clubShort;
                  clubW = shortW.clamp(0.0, (box.maxWidth - 8 - seasonMinW).clamp(0.0, box.maxWidth));
                }
                return Row(
                  children: [
                    SizedBox(width: clubW, child: Text(text, maxLines: 1, overflow: TextOverflow.ellipsis, softWrap: false, style: style)),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        season,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        softWrap: false,
                        style: style.copyWith(color: FusibleColors.creme.withValues(alpha: .75)),
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
          const SizedBox(width: 8),
          Transform.rotate(
            angle: -2 * 3.141592653589793 / 180,
            child: Container(
              padding: const EdgeInsets.fromLTRB(8, 3, 8, 3),
              decoration: BoxDecoration(
                color: FusibleColors.creme,
                borderRadius: BorderRadius.circular(2),
                boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: .4), offset: const Offset(0, 2))],
              ),
              child: Text(roleName.toUpperCase(), style: style.copyWith(fontSize: 12, color: FusibleColors.pelouse2)),
            ),
          ),
        ],
      ),
    );
  }
}

/// Ligne de contexte : saison · année · âge · rang · objectif (Manrope 600 12).
class _ContextLine extends StatelessWidget {
  final GameState state;
  const _ContextLine({required this.state});

  @override
  Widget build(BuildContext context) {
    final style = FusibleFonts.ui_(12, weight: FontWeight.w600, height: 1.4, spacing: .02, color: FusibleColors.creme.withValues(alpha: .9)).copyWith(fontFeatures: const [FontFeature.tabularFigures()]);
    final sep = TextSpan(text: '  ·  ', style: style.copyWith(color: FusibleColors.creme.withValues(alpha: .45)));
    final rank = state.world.standingRank;
    return Text.rich(
      TextSpan(children: [
        TextSpan(text: 'Saison ${state.season + 1}'),
        sep,
        TextSpan(text: '${state.year}'),
        sep,
        TextSpan(text: '${state.age} ans'),
        sep,
        ordinalSpan(rank, style),
        if (state.objectiveLabel.isNotEmpty) ...[
          sep,
          TextSpan(text: 'Objectif : ${state.objectiveLabel}', style: style.copyWith(color: FusibleColors.uiJauneVert)),
        ],
      ]),
      style: style,
      maxLines: 2,
      overflow: TextOverflow.ellipsis,
    );
  }
}

/// Ruban de promesse : « Promis à {créancier} : {promesse} ».
class _Ruban extends StatelessWidget {
  final GameState state;
  final String creancier;
  const _Ruban({required this.state, required this.creancier});

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: 'Promesse en cours : promis à $creancier, ${state.objectiveLabel}',
      excludeSemantics: true,
      child: SizedBox(
        height: 18,
        child: Row(
          children: [
            Container(
              width: 26,
              height: 3,
              decoration: BoxDecoration(
                color: FusibleColors.tampon,
                borderRadius: BorderRadius.circular(2),
                boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: .4), offset: const Offset(0, 1))],
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                'Promis à $creancier : ${state.objectiveLabel}'.toUpperCase(),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: FusibleFonts.cond_(11, weight: FontWeight.w600, height: 1, spacing: .1, color: FusibleColors.creme.withValues(alpha: .85)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Hintline : « Décolle la vignette ← / →, ou pose un magnet ».
class _Hintline extends StatelessWidget {
  final bool single;
  final bool une;
  const _Hintline({required this.single, this.une = false});

  @override
  Widget build(BuildContext context) {
    final style = FusibleFonts.cond_(11, weight: FontWeight.w600, height: 1, spacing: .08, color: FusibleColors.creme.withValues(alpha: .55));
    if (une) return Text('TOURNE LA PAGE', textAlign: TextAlign.center, style: style);
    if (single) return Text('POSE LE MAGNET', textAlign: TextAlign.center, style: style);
    WidgetSpan arrow(bool right) => WidgetSpan(alignment: PlaceholderAlignment.middle, child: ArrowGlyph(right: right, size: 10, color: style.color!));
    return Text.rich(
      TextSpan(children: [
        const TextSpan(text: 'DÉCOLLE LA VIGNETTE '),
        arrow(false),
        const TextSpan(text: ' / '),
        arrow(true),
        const TextSpan(text: ', OU POSE UN MAGNET'),
      ]),
      textAlign: TextAlign.center,
      style: style,
    );
  }
}

/// Bandeau « Nouvelle histoire : {titre} » (spec variété §3.8) : sticker blanc
/// −1,5°, pastille rouge, scotch au coin, titre en Fraunces italique ; il
/// apparaît en 200 ms et reste 2 s.
class _StoryBanner extends StatelessWidget {
  final String title;
  final bool reduced;
  const _StoryBanner({required this.title, required this.reduced});

  @override
  Widget build(BuildContext context) {
    final banner = Semantics(
      label: 'Nouvelle histoire : $title',
      liveRegion: true,
      excludeSemantics: true,
      child: Transform.rotate(
        angle: -1.5 * 3.141592653589793 / 180,
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            Container(
              constraints: const BoxConstraints(maxWidth: 300),
              padding: const EdgeInsets.fromLTRB(12, 7, 14, 7),
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
                  BoxShadow(color: Colors.black.withValues(alpha: .45), blurRadius: 18, offset: const Offset(0, 10)),
                ],
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 12,
                    height: 12,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: FusibleColors.tampon,
                      border: Border.all(color: FusibleColors.blancVignette, width: 2),
                      boxShadow: const [BoxShadow(color: FusibleColors.tampon, spreadRadius: 1.5)],
                    ),
                  ),
                  const SizedBox(width: 8),
                  // Une seule ligne : « NOUVELLE HISTOIRE : » puis le titre en
                  // Fraunces italique, coupée d'une ellipse si la place manque.
                  Flexible(
                    child: Text.rich(
                      TextSpan(children: [
                        TextSpan(text: 'NOUVELLE HISTOIRE : ', style: FusibleFonts.cond_(13, height: 1, spacing: .06)),
                        TextSpan(text: title, style: FusibleFonts.paper_(13, italic: true, height: 1).copyWith(fontWeight: FontWeight.w600)),
                      ]),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: FusibleFonts.cond_(13, height: 1, spacing: .06),
                    ),
                  ),
                ],
              ),
            ),
            const Positioned(left: -18, top: -6, child: Tape(width: 44, height: 13, angle: -32)),
          ],
        ),
      ),
    );
    if (reduced) return banner;
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0, end: 1),
      duration: FusibleMotion.pop,
      curve: Curves.easeOut,
      builder: (_, t, child) => Opacity(opacity: t, child: Transform.scale(scale: .9 + .1 * t, child: child)),
      child: banner,
    );
  }
}
