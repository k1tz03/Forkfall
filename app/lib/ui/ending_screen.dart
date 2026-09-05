import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:fusible_core/fusible_core.dart';

import '../state/game_controller.dart';
import '../theme.dart';
import 'card_data.dart';
import 'widgets/album_rail.dart';
import 'widgets/paper.dart';
import 'widgets/portrait.dart';
import 'widgets/vignette.dart';

const double _fatalWidth = 136;

/// L'écran de fin (§4.4, §4.5) : les jauges s'éteignent (la coupable clignote),
/// le tampon s'abat sur la carte fatale, puis la Une du Quotidien du Ballon se
/// déplie ; Successeur, Rejouer, graine.
class EndingScreen extends StatefulWidget {
  final GameController controller;
  final VoidCallback onNewRun;
  final VoidCallback onReplay;
  const EndingScreen({super.key, required this.controller, required this.onNewRun, required this.onReplay});

  @override
  State<EndingScreen> createState() => _EndingScreenState();
}

class _EndingScreenState extends State<EndingScreen> with TickerProviderStateMixin {
  late final AnimationController _stamp = AnimationController(vsync: this, duration: FusibleMotion.stamp);
  late final AnimationController _shake = AnimationController(vsync: this, duration: FusibleMotion.shake);
  late final AnimationController _une = AnimationController(vsync: this, duration: FusibleMotion.page);
  bool _started = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_started) return;
    _started = true;
    if (FusibleMotion.reduced(context)) {
      _stamp.value = 1;
      _une.value = 1;
    } else {
      _playStamp();
      Future<void>.delayed(FusibleMotion.uneDelay, () {
        if (mounted) _une.forward();
      });
    }
  }

  void _playStamp() {
    _stamp.forward(from: 0);
    Future<void>.delayed(const Duration(milliseconds: 220), () {
      if (mounted) _shake.forward(from: 0);
    });
  }

  void _replayStamp() {
    if (FusibleMotion.reduced(context)) return;
    _playStamp();
  }

  @override
  void dispose() {
    _stamp.dispose();
    _shake.dispose();
    _une.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = widget.controller;
    final s = c.state!;
    final content = c.engine.content;
    final e = c.ending;
    final pending = s.pending;
    final payload = pending?.payload ?? const {};
    final golden = payload['golden'] == true || (e?.golden ?? false);
    final guilty = payload['gauge'] as String? ?? e?.gauge;
    final side = payload['side'] as String? ?? e?.side;
    final title = (payload['title'] as String?) ?? e?.title ?? 'Fin de carrière';
    final textParts = (pending?.text ?? '').split('\n\n');
    final epitaph = textParts.length > 1 ? textParts.sublist(1).join('\n\n') : (e?.epitaph ?? '');
    final role = c.role;
    final fatalPending = c.fatalCard ?? pending;
    final fatal = fatalPending == null
        ? VignetteData(characterId: s.role == 'joueur' ? 'joueur' : 'coach', expression: 'noir', genre: s.entities.genre, name: s.entities.protagonist, label: role.name, number: s.turn)
        : vignetteFor(fatalPending, s, content, expression: 'noir', number: c.fatalNumber == 0 ? s.turn : c.fatalNumber);
    final stampText = stampTextFor(s.endingId, golden: golden);

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
                const SizedBox(height: 10),
                // fin-top : jauges éteintes · carte fatale + tampon · légende.
                ConstrainedBox(
                  constraints: const BoxConstraints(minHeight: 216),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      DeadRail(role: role, gauges: s.gauges, guilty: guilty, side: side),
                      Expanded(
                        child: Center(
                          child: _FatalCard(
                            data: fatal,
                            stampText: stampText,
                            golden: golden,
                            stamp: _stamp,
                            shake: _shake,
                            onTap: _replayStamp,
                          ),
                        ),
                      ),
                      SizedBox(
                        width: 80,
                        child: Text(
                          // Espaces insécables : « SAISON 4 · J 4 » reste sur une ligne.
                          'CARTE FATALE\nN°\u00A0${fatal.number}\nSAISON\u00A0${s.season + 1}\u00A0·\u00A0J\u00A0${s.world.blocks}',
                          textAlign: TextAlign.right,
                          maxLines: 3,
                          overflow: TextOverflow.ellipsis,
                          style: FusibleFonts.cond_(11, weight: FontWeight.w600, height: 1.35, spacing: .12, color: FusibleColors.creme.withValues(alpha: .65)),
                        ),
                      ),
                    ],
                  ),
                ),
                // La Une, dépliée.
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(0, 8, 0, 0),
                    child: AnimatedBuilder(
                      animation: _une,
                      builder: (_, child) {
                        final t = Curves.easeOut.transform(_une.value);
                        return Opacity(
                          opacity: t,
                          child: Transform(
                            alignment: Alignment.topCenter,
                            transform: Matrix4.identity()
                              ..setEntry(3, 2, .0011)
                              ..rotateX(-70 * math.pi / 180 * (1 - t)),
                            child: child,
                          ),
                        );
                      },
                      child: _Une(
                        state: s,
                        content: content,
                        role: role,
                        title: title,
                        epitaph: epitaph,
                        fatal: fatal,
                        guilty: guilty,
                        side: side,
                        discovered: c.discoveredEndings.length,
                      ),
                    ),
                  ),
                ),
                // Actions.
                const SizedBox(height: 10),
                _SuccessorButton(onPressed: widget.onNewRun),
                const SizedBox(height: 5),
                FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _GhostLink(label: 'Rejouer', text: 'Rejouer cette graine à l\'identique', onPressed: widget.onReplay),
                      const SizedBox(width: 14),
                      _GhostLink(
                        label: 'Partager le récit',
                        text: 'Partager',
                        onPressed: () async {
                          await Clipboard.setData(ClipboardData(text: c.shareText()));
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Récit copié — colle-le où tu veux.')));
                          }
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 5),
                Text(
                  'Graine ${_group(s.seed)} · postulat ${s.postulat + 1} · album n° ${c.albumNumber}',
                  textAlign: TextAlign.center,
                  style: FusibleFonts.paper_(10.5, color: FusibleColors.creme.withValues(alpha: .5)),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  static String _group(int n) {
    final s = n.toString();
    final b = StringBuffer();
    for (var i = 0; i < s.length; i++) {
      if (i > 0 && (s.length - i) % 3 == 0) b.write(' ');
      b.write(s[i]);
    }
    return b.toString();
  }
}

/// La carte fatale (136 px) et le tampon qui s'abat : scale 1,6 → 0,96 → 1,
/// −6°, opacité 0 → 1 à 55 % ; secousse ±2 px 220 ms après l'impact.
class _FatalCard extends StatelessWidget {
  final VignetteData data;
  final String stampText;
  final bool golden;
  final Animation<double> stamp;
  final Animation<double> shake;
  final VoidCallback onTap;
  const _FatalCard({required this.data, required this.stampText, required this.golden, required this.stamp, required this.shake, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final height = Vignette.heightFor(_fatalWidth, compact: true) + 12;
    final color = golden ? FusibleColors.or : FusibleColors.tampon;
    return Semantics(
      label: 'Carte fatale, tampon $stampText',
      button: true,
      onTap: onTap,
      excludeSemantics: true,
      child: GestureDetector(
        onTap: onTap,
        child: SizedBox(
          width: _fatalWidth,
          height: height,
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              Positioned(
                top: 12,
                left: 0,
                child: AnimatedBuilder(
                  animation: shake,
                  builder: (_, child) {
                    final v = shake.value;
                    final dx = v <= 0 || v >= 1 ? 0.0 : (v < .5 ? -2.0 : 2.0);
                    final dy = v <= 0 || v >= 1 ? 0.0 : (v < .5 ? 1.0 : -1.0);
                    return Transform.translate(offset: Offset(dx, dy), child: child);
                  },
                  child: Vignette(data: data, width: _fatalWidth, compact: true),
                ),
              ),
              Positioned(
                left: 0,
                right: 0,
                top: height * .6,
                height: 80,
                child: AnimatedBuilder(
                  animation: stamp,
                  builder: (_, child) {
                    final t = FusibleMotion.stampCurve.transform(stamp.value);
                    final double scale, opacity;
                    if (t < .55) {
                      final u = t / .55;
                      scale = 1.6 + (.96 - 1.6) * u;
                      opacity = u;
                    } else {
                      final u = (t - .55) / .45;
                      scale = .96 + (1 - .96) * u;
                      opacity = 1;
                    }
                    return Opacity(
                      opacity: opacity.clamp(0, 1),
                      child: Transform(
                        alignment: Alignment.center,
                        transform: Matrix4.identity()
                          ..scale(scale)
                          ..rotateZ(-6 * math.pi / 180),
                        child: child,
                      ),
                    );
                  },
                  child: OverflowBox(
                    maxWidth: 230,
                    minWidth: 0,
                    maxHeight: 80,
                    alignment: Alignment.topCenter,
                    child: FractionalTranslation(
                      translation: const Offset(0, -.5),
                      child: FittedBox(
                        fit: BoxFit.scaleDown,
                        child: Container(
                          padding: const EdgeInsets.all(1.7),
                          decoration: BoxDecoration(border: Border.all(color: color, width: 1.6), borderRadius: BorderRadius.circular(6)),
                          child: Container(
                            padding: const EdgeInsets.fromLTRB(12, 0, 12, 2),
                            decoration: BoxDecoration(border: Border.all(color: color, width: 1.6), borderRadius: BorderRadius.circular(4)),
                            child: Text(stampText.toUpperCase(), style: FusibleFonts.cond_(52, height: 1, spacing: .08, color: color)),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// La Une du Quotidien du Ballon : papier journal −1°, scotch, masthead,
/// dateline, manchette, lede, photo tramée, encarts En chiffres et Jauge
/// coupable, colonnes, vignette « dernière apparition ».
class _Une extends StatelessWidget {
  final GameState state;
  final Content content;
  final RoleDef role;
  final String title;
  final String epitaph;
  final VignetteData fatal;
  final String? guilty;
  final String? side;
  final int discovered;
  const _Une({
    required this.state,
    required this.content,
    required this.role,
    required this.title,
    required this.epitaph,
    required this.fatal,
    required this.guilty,
    required this.side,
    required this.discovered,
  });

  @override
  Widget build(BuildContext context) {
    final s = state;
    final guiltyDef = role.gauges.where((g) => g.id == guilty).firstOrNull;
    final club = s.entities.named['club'] ?? 'Le club';
    final president = s.entities.named['president'] ?? 'le président';
    final saisons = s.stats['saisons'] ?? (s.season + 1);
    final roles = s.stats['roles'] ?? 1;
    final titres = s.stats['titres'] ?? 0;

    return Transform.rotate(
      angle: -1 * math.pi / 180,
      alignment: Alignment.topCenter,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                color: FusibleColors.journal,
                boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: .5), blurRadius: 24, offset: const Offset(0, 14))],
              ),
              child: ClipRect(
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    OverflowBox(
                      alignment: Alignment.topCenter,
                      maxHeight: double.infinity,
                      child: Padding(
                        padding: const EdgeInsets.fromLTRB(12, 8, 12, 10),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            _Masthead(),
                            _Dateline(year: s.year, seed: s.seed),
                            Text(title.toUpperCase(), style: FusibleFonts.cond_(34, height: .95, spacing: .005)),
                            const SizedBox(height: 6),
                            Text(epitaph, style: FusibleFonts.paper_(12, italic: true, height: 1.35, color: FusibleColors.encre2)),
                            const SizedBox(height: 8),
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                SizedBox(
                                  width: 100,
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Container(
                                        decoration: BoxDecoration(border: Border.all(color: FusibleColors.encre)),
                                        child: ClipRect(
                                          child: Stack(
                                            children: [
                                              Vignette(data: fatal, width: 98, compact: true, showPin: false, grayscale: true),
                                              const Positioned.fill(child: IgnorePointer(child: CustomPaint(painter: _TramePainter()))),
                                            ],
                                          ),
                                        ),
                                      ),
                                      const SizedBox(height: 3),
                                      Text('${fatal.name}, hier, sur le parking. (Photo La Plume)', style: FusibleFonts.paper_(8, italic: true, height: 1.3, color: FusibleColors.encre2)),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.stretch,
                                    children: [
                                      _Box(
                                        head: 'En chiffres',
                                        child: Row(
                                          children: [
                                            Expanded(
                                                child: Column(
                                                    crossAxisAlignment: CrossAxisAlignment.start,
                                                    children: [_cell('$saisons', 'saison${saisons > 1 ? 's' : ''}'), const SizedBox(height: 3), _cell('$titres', 'titre${titres > 1 ? 's' : ''}')])),
                                            Expanded(
                                                child: Column(
                                                    crossAxisAlignment: CrossAxisAlignment.start,
                                                    children: [_cell('$roles', 'rôle${roles > 1 ? 's' : ''}'), const SizedBox(height: 3), _cell('$discovered/${content.endings.length}', 'fins')])),
                                          ],
                                        ),
                                      ),
                                      const SizedBox(height: 6),
                                      _Box(
                                        head: 'La jauge coupable',
                                        child: Row(
                                          crossAxisAlignment: CrossAxisAlignment.center,
                                          children: [
                                            _Barred(icon: guiltyDef?.icon),
                                            const SizedBox(width: 7),
                                            Expanded(
                                              child: Text.rich(
                                                TextSpan(children: [
                                                  if (guiltyDef != null) ...[
                                                    TextSpan(text: guiltyDef.label.toUpperCase(), style: FusibleFonts.cond_(11, weight: FontWeight.w700, spacing: .06)),
                                                    TextSpan(text: side == 'plein' ? ', pleine. ' : ', vidée. '),
                                                    TextSpan(
                                                        text: side == 'plein'
                                                            ? 'Trop, c\'est trop : la jauge a débordé et le club a tranché.'
                                                            : 'Personne n\'a voulu te retenir : la jauge est tombée à zéro.'),
                                                  ] else
                                                    const TextSpan(text: 'Aucune jauge n\'a lâché. C\'est le temps qui a eu le dernier mot.'),
                                                ]),
                                                style: FusibleFonts.paper_(9.5, height: 1.25, color: FusibleColors.encre2),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            _Columns(
                              first:
                                  '$club. Le vestiaire l\'a appris avant la tribune, la tribune avant l\'intéressé. ${role.name} depuis $saisons saison${saisons > 1 ? 's' : ''}, ${s.entities.protagonist} quitte le club à la ${s.world.standingRank}e place.',
                              second: 'Hors micro, $president parle d\'une « décision de bâtisseur ». Le successeur n\'a pas encore de nom ; l\'album, lui, a déjà une page de libre.',
                            ),
                          ],
                        ),
                      ),
                    ),
                    const Positioned.fill(child: IgnorePointer(child: CustomPaint(painter: _ScanlinesPainter()))),
                  ],
                ),
              ),
            ),
          ),
          const Positioned(left: -16, top: -6, child: Tape(angle: -35)),
          const Positioned(right: -16, top: -6, child: Tape(angle: 35)),
          Positioned(right: -6, bottom: 4, child: _LastSticker(genre: s.entities.genre, role: s.role)),
        ],
      ),
    );
  }

  Widget _cell(String n, String l) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(n, style: FusibleFonts.cond_(18, height: 1)),
          Text(l.toUpperCase(), style: FusibleFonts.ui_(7.5, weight: FontWeight.w700, spacing: .1, color: FusibleColors.encre2)),
        ],
      );
}

class _Masthead extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    Widget ear(String head, String body, {bool price = false}) => Container(
          decoration: BoxDecoration(border: Border.all(color: FusibleColors.encre)),
          padding: const EdgeInsets.fromLTRB(4, 3, 4, 3),
          child: Column(
            children: [
              Text(head.toUpperCase(), style: FusibleFonts.cond_(9, weight: FontWeight.w700, spacing: .1)),
              Text(
                body,
                textAlign: TextAlign.center,
                style: price ? FusibleFonts.cond_(16, height: 1, color: FusibleColors.journalBleu) : FusibleFonts.ui_(7.5, weight: FontWeight.w600, height: 1.25, spacing: .03),
              ),
            ],
          ),
        );
    return Container(
      padding: const EdgeInsets.only(bottom: 6),
      decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: FusibleColors.journalBleu, width: 2.5))),
      child: Row(
        children: [
          SizedBox(width: 60, child: ear('Météo', 'AVERSES SUR LA MARMITE\n11° · VENT D\'OUEST')),
          const SizedBox(width: 6),
          Expanded(
            child: Column(
              children: [
                FittedBox(
                  fit: BoxFit.scaleDown,
                  child:
                      Text('Le Quotidien du Ballon', textAlign: TextAlign.center, style: FusibleFonts.paper_(22, weight: FontWeight.w900, height: 1, spacing: -.01, color: FusibleColors.journalBleu)),
                ),
                const SizedBox(height: 4),
                FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text('LE JOURNAL QUI SIFFLE AVANT L\'ARBITRE', style: FusibleFonts.ui_(7.5, weight: FontWeight.w600, spacing: .18, color: FusibleColors.encre2)),
                ),
              ],
            ),
          ),
          const SizedBox(width: 6),
          SizedBox(width: 54, child: ear('Prix', '5 écus', price: true)),
        ],
      ),
    );
  }
}

class _Dateline extends StatelessWidget {
  final int year;
  final int seed;
  const _Dateline({required this.year, required this.seed});

  @override
  Widget build(BuildContext context) {
    final style = FusibleFonts.ui_(8, weight: FontWeight.w700, spacing: .08);
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(vertical: 3),
      decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: FusibleColors.encre))),
      child: FittedBox(
        fit: BoxFit.scaleDown,
        alignment: Alignment.centerLeft,
        child: Row(
          children: [
            Text('LUNDI 4 MAI $year', style: style),
            const SizedBox(width: 12),
            Text.rich(TextSpan(children: [ordinalSpan(year - 1946, style), TextSpan(text: ' ANNÉE · N° ${14000 + seed % 999}')]), style: style),
            const SizedBox(width: 12),
            Text('ÉDITION SUD', style: style),
          ],
        ),
      ),
    );
  }
}

class _Box extends StatelessWidget {
  final String head;
  final Widget child;
  const _Box({required this.head, required this.child});

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
            child: Text(head.toUpperCase(), style: FusibleFonts.cond_(10, spacing: .14, color: FusibleColors.journalBleu)),
          ),
          child,
        ],
      ),
    );
  }
}

/// Pictogramme barré dans un cercle 28 px.
class _Barred extends StatelessWidget {
  final String? icon;
  const _Barred({this.icon});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 28,
      height: 28,
      child: Stack(
        clipBehavior: Clip.none,
        alignment: Alignment.center,
        children: [
          Container(
            width: 28,
            height: 28,
            decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: FusibleColors.encre, width: 1.5)),
            alignment: Alignment.center,
            // « Toutes les jauges » : un ∞ dessiné (aucune dépendance à un glyphe).
            child: icon == null ? const CustomPaint(size: Size(16, 8), painter: _InfinityPainter()) : GaugeIcon(icon!, size: 17),
          ),
          Positioned(
            left: -4,
            right: -4,
            child: Transform.rotate(angle: -32 * math.pi / 180, child: Container(height: 3, color: FusibleColors.tampon)),
          ),
        ],
      ),
    );
  }
}

/// Lemniscate encre 2 px : deux boucles tangentes au centre.
class _InfinityPainter extends CustomPainter {
  const _InfinityPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final r = size.height / 2 - 1;
    final cy = size.height / 2;
    final paint = Paint()
      ..color = FusibleColors.encre
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;
    canvas.drawOval(Rect.fromCircle(center: Offset(size.width / 2 - r, cy), radius: r), paint);
    canvas.drawOval(Rect.fromCircle(center: Offset(size.width / 2 + r, cy), radius: r), paint);
  }

  @override
  bool shouldRepaint(_InfinityPainter oldDelegate) => false;
}

/// Deux colonnes Fraunces 8 px justifiées, lettrine bleue, marge droite 62 px
/// pour la vignette « dernière apparition ».
class _Columns extends StatelessWidget {
  final String first;
  final String second;
  const _Columns({required this.first, required this.second});

  @override
  Widget build(BuildContext context) {
    final style = FusibleFonts.paper_(8, height: 1.32, color: const Color(0xFF3A342C));
    return Container(
      height: 74,
      margin: const EdgeInsets.only(right: 62),
      padding: const EdgeInsets.only(top: 5),
      decoration: const BoxDecoration(border: Border(top: BorderSide(color: FusibleColors.encre))),
      clipBehavior: Clip.hardEdge,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Text.rich(
              TextSpan(children: [
                TextSpan(text: first.substring(0, 1), style: FusibleFonts.paper_(18, weight: FontWeight.w900, height: .8, color: FusibleColors.journalBleu)),
                TextSpan(text: first.substring(1)),
              ]),
              style: style,
              textAlign: TextAlign.justify,
            ),
          ),
          Container(width: 1, height: 60, color: const Color(0xFFCCCCCC), margin: const EdgeInsets.symmetric(horizontal: 4)),
          Expanded(
            child: Text.rich(
              TextSpan(children: [
                TextSpan(text: 'HORS MICRO, ', style: FusibleFonts.cond_(9.5, spacing: .04)),
                TextSpan(text: second.replaceFirst('Hors micro, ', '')),
              ]),
              style: style,
              textAlign: TextAlign.justify,
            ),
          ),
        ],
      ),
    );
  }
}

/// Ta vignette « dernière apparition » : buste coach / joueur, expression noire,
/// 62 px, scotchée, +7°.
class _LastSticker extends StatelessWidget {
  final String genre;
  final String role;
  const _LastSticker({required this.genre, required this.role});

  @override
  Widget build(BuildContext context) {
    final id = role == 'joueur' ? 'joueur' : 'coach';
    return Semantics(
      label: 'Dernière apparition',
      excludeSemantics: true,
      child: Transform.rotate(
        angle: 7 * math.pi / 180,
        child: SizedBox(
          width: 62,
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              Container(
                padding: const EdgeInsets.fromLTRB(4, 4, 4, 3),
                decoration: BoxDecoration(
                  color: FusibleColors.blancVignette,
                  boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: .4), blurRadius: 10, offset: const Offset(0, 6))],
                ),
                child: Column(
                  children: [
                    AspectRatio(
                      aspectRatio: 3 / 4,
                      child: ClipRect(
                        child: Stack(
                          fit: StackFit.expand,
                          children: [
                            const DecoratedBox(
                                decoration: BoxDecoration(gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [Color(0xFF2A6E3F), FusibleColors.board]))),
                            Align(
                              alignment: Alignment.bottomCenter,
                              child: Portrait(characterId: id, expression: 'noir', traits: {...?Portrait.traitsOf(id), 'genre': genre}),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 3),
                    Text('DERNIÈRE\nAPPARITION', textAlign: TextAlign.center, style: FusibleFonts.cond_(7.5, weight: FontWeight.w700, height: 1.1, spacing: .08)),
                  ],
                ),
              ),
              const Positioned(left: 13, top: -7, child: Tape(width: 36, height: 12, angle: -3)),
            ],
          ),
        ),
      ),
    );
  }
}

/// Trame radiale 3 px en multiply (photo de presse).
class _TramePainter extends CustomPainter {
  const _TramePainter();

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
  bool shouldRepaint(_TramePainter oldDelegate) => false;
}

/// Scanlines 1990 à 5 % (une ligne sur trois).
class _ScanlinesPainter extends CustomPainter {
  const _ScanlinesPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()..color = Colors.black.withValues(alpha: .05);
    for (var y = 0.0; y < size.height; y += 3) {
      canvas.drawRect(Rect.fromLTWH(0, y, size.width, 1), p);
    }
  }

  @override
  bool shouldRepaint(_ScanlinesPainter oldDelegate) => false;
}

/// Successeur : sticker rouge tampon à bord blanc 4 px, 54 px min, trois
/// cartes face cachée en éventail, « — nouvel album ».
class _SuccessorButton extends StatelessWidget {
  final VoidCallback onPressed;
  const _SuccessorButton({required this.onPressed});

  @override
  Widget build(BuildContext context) {
    Widget card(double angle) => Transform.rotate(
          angle: angle * math.pi / 180,
          child: Container(
            width: 13,
            height: 18,
            decoration: BoxDecoration(
              color: FusibleColors.blancVignette,
              borderRadius: BorderRadius.circular(1),
              border: Border.all(color: FusibleColors.pelouse, width: 2),
            ),
          ),
        );
    return Semantics(
      label: 'Successeur',
      button: true,
      onTap: onPressed,
      excludeSemantics: true,
      child: GestureDetector(
        onTap: onPressed,
        child: Transform.rotate(
          angle: -.6 * math.pi / 180,
          child: Container(
            constraints: const BoxConstraints(minHeight: 54),
            padding: const EdgeInsets.fromLTRB(16, 6, 16, 6),
            decoration: BoxDecoration(
              color: FusibleColors.tampon,
              border: Border.all(color: FusibleColors.blancVignette, width: 4),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(3),
                topRight: Radius.circular(5),
                bottomRight: Radius.circular(3),
                bottomLeft: Radius.circular(4),
              ),
              boxShadow: [
                const BoxShadow(color: FusibleColors.tampon2, offset: Offset(0, 3)),
                BoxShadow(color: Colors.black.withValues(alpha: .45), blurRadius: 18, offset: const Offset(0, 10)),
              ],
            ),
            child: FittedBox(
              fit: BoxFit.scaleDown,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    width: 34,
                    height: 20,
                    child: Stack(
                      children: [
                        Positioned(left: 0, top: 1, child: card(-8)),
                        Positioned(left: 9, top: 0, child: card(0)),
                        Positioned(left: 18, top: 1, child: card(8)),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Text('SUCCESSEUR', style: FusibleFonts.cond_(22, height: 1, spacing: .08, color: Colors.white)),
                  const SizedBox(width: 8),
                  Text('— nouvel album', style: FusibleFonts.ui_(12, weight: FontWeight.w600, color: Colors.white.withValues(alpha: .9))),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Lien-texte Barlow 12 souligné, crème 75 %.
class _GhostLink extends StatelessWidget {
  final String label;
  final String text;
  final VoidCallback onPressed;
  const _GhostLink({required this.label, required this.text, required this.onPressed});

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
