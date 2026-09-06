import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:fusible_core/fusible_core.dart';

import '../state/game_controller.dart';
import '../theme.dart';
import 'card_data.dart';
import 'almanach_screen.dart';
import 'widgets/album_rail.dart';
import 'widgets/magnets.dart';
import 'widgets/paper.dart';
import 'widgets/portrait.dart';
import 'widgets/une_page.dart';
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
    final epitaph = (payload['epitaph'] as String?) ?? (textParts.length > 1 ? textParts.sublist(1).join('\n\n') : (e?.epitaph ?? ''));
    final epitaphPlus = (payload['epitaph_plus'] as String?) ?? '';
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
                // La Une, dépliée ; elle défile (« Ce qui s'est passé » la rallonge).
                Expanded(
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
                    child: SingleChildScrollView(
                      clipBehavior: Clip.hardEdge,
                      padding: const EdgeInsets.fromLTRB(0, 8, 0, 18),
                      child: _Une(
                        state: s,
                        content: content,
                        role: role,
                        title: title,
                        epitaph: epitaph,
                        epitaphPlus: epitaphPlus,
                        stampText: stampText,
                        fatal: fatal,
                        guilty: guilty,
                        side: side,
                        discovered: c.discoveredEndings.length,
                        startYear: c.postulat?.year ?? Engine.startYear,
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
                      GhostLink(label: 'Rejouer', text: 'Rejouer cette graine', onPressed: widget.onReplay),
                      const SizedBox(width: 10),
                      GhostLink(label: 'Partager le récit', text: 'Partager', onPressed: () => _share(context)),
                      const SizedBox(width: 10),
                      GhostLink(
                        label: "Lire l'Almanach",
                        text: "Lire l'Almanach",
                        onPressed: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => AlmanachScreen(controller: c))),
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

  /// Partage (spec variété §1.8) : le récit copié porte le nom, sauf si le
  /// joueur coche « masquer le nom » ; le Code ne le porte jamais.
  Future<void> _share(BuildContext context) async {
    final c = widget.controller;
    var hide = false;
    final ok = await showDialog<bool>(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          backgroundColor: FusibleColors.creme,
          title: Text('PARTAGER LE RÉCIT', style: FusibleFonts.cond_(20, height: 1, spacing: .06)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(c.shareText(hideName: hide), style: FusibleFonts.paper_(12, italic: true, height: 1.4, color: FusibleColors.encre2)),
              const SizedBox(height: 8),
              Semantics(
                label: 'Masquer le nom',
                child: CheckboxListTile(
                  value: hide,
                  onChanged: (v) => setState(() => hide = v ?? false),
                  contentPadding: EdgeInsets.zero,
                  dense: true,
                  controlAffinity: ListTileControlAffinity.leading,
                  activeColor: FusibleColors.tampon,
                  title: Text('Masquer le nom', style: FusibleFonts.ui_(13, weight: FontWeight.w600)),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.of(context).pop(false), child: Text('ANNULER', style: FusibleFonts.cond_(14, weight: FontWeight.w700, color: FusibleColors.encre2))),
            TextButton(onPressed: () => Navigator.of(context).pop(true), child: Text('COPIER', style: FusibleFonts.cond_(14, weight: FontWeight.w700, color: FusibleColors.tampon))),
          ],
        ),
      ),
    );
    if (ok != true) return;
    await Clipboard.setData(ClipboardData(text: c.shareText(hideName: hide)));
    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Récit copié — colle-le où tu veux.')));
    }
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

/// La Une de fin : la feuille de journal (composants de une_page.dart),
/// masthead, dateline, kicker « {prenom} {nom} · {age} ans · {années} · {club} »,
/// manchette qui se réduit, épitaphe (+ epitaph_plus), photo tramée, encarts
/// En chiffres et Jauge coupable, « Ce qui s'est passé » (spec variété §3.8),
/// colonnes, vignette « dernière apparition ».
class _Une extends StatelessWidget {
  final GameState state;
  final Content content;
  final RoleDef role;
  final String title;
  final String epitaph;
  final String epitaphPlus;
  final String stampText;
  final VignetteData fatal;
  final String? guilty;
  final String? side;
  final int discovered;
  final int startYear;
  const _Une({
    required this.state,
    required this.content,
    required this.role,
    required this.title,
    required this.epitaph,
    required this.epitaphPlus,
    required this.stampText,
    required this.fatal,
    required this.guilty,
    required this.side,
    required this.discovered,
    required this.startYear,
  });

  static const _legendPlace = {
    'Viré': 'sur le parking de la Marmite',
    'Blessé': "à la sortie de l'infirmerie",
    'En garde à vue': 'à la sortie du commissariat',
    'Retraité': "en tribune d'honneur",
  };

  /// « Jean-Marie Aulard » → « Aulard » ; les surnoms restent entiers.
  static String _familyName(String name) {
    final parts = name.trim().split(' ');
    if (parts.length < 2 || parts.length > 3) return name;
    if (RegExp(r'^(Madame|Monsieur|Doc|Docteur|Maître)$', caseSensitive: false).hasMatch(parts.first)) return name;
    return parts.last;
  }

  @override
  Widget build(BuildContext context) {
    final s = state;
    final payload = s.pending?.payload ?? const {};
    final guiltyDef = role.gauges.where((g) => g.id == guilty).firstOrNull;
    final club = s.entities.named['club'] ?? 'Le club';
    final president = s.entities.named['president'] ?? 'le président';
    final saisons = s.stats['saisons'] ?? (s.season + 1);
    final roles = s.stats['roles'] ?? 1;
    final titres = s.stats['titres'] ?? 0;
    final nom = (payload['nom'] as String?) ?? s.entities.protagonist;
    final years = s.year != startYear ? '$startYear-${s.year}' : '$startYear';
    final kicker = '$nom · ${s.age} ans · $years · $club';
    final mood = fatal.expression == 'sourire'
        ? (fatal.genre == 'f' ? ' Elle souriait.' : ' Il souriait.')
        : (fatal.expression == 'noir' ? (fatal.genre == 'f' ? " Elle n'a rien dit." : " Il n'a rien dit.") : '');
    final legend = '${_familyName(fatal.name)}, hier, ${_legendPlace[stampText] ?? 'devant le vestiaire'}.$mood (Photo La Plume)';
    final dateStyle = FusibleFonts.ui_(8, weight: FontWeight.w700, spacing: .08);

    return PaperSheet(
      overlays: [Positioned(right: -6, bottom: 4, child: _LastSticker(genre: s.entities.genre, role: s.role))],
      children: [
        const Masthead(
          journalNom: 'Le Quotidien du Ballon',
          devise: "Le journal qui siffle avant l'arbitre",
          leftHead: 'Météo',
          leftBody: "AVERSES SUR LA MARMITE\n11° · VENT D'OUEST",
          rightHead: 'Prix',
          rightBody: '5 écus',
        ),
        Dateline(parts: [
          TextSpan(text: 'LUNDI 4 MAI ${s.year}'),
          TextSpan(children: [ordinalSpan(s.year - 1946, dateStyle), TextSpan(text: ' ANNÉE · N° ${14000 + s.seed % 999}')]),
          const TextSpan(text: 'ÉDITION SUD'),
        ]),
        Text(
          kicker.toUpperCase(),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: FusibleFonts.cond_(11, weight: FontWeight.w700, height: 1.2, spacing: .06, color: FusibleColors.encre2),
        ),
        const SizedBox(height: 3),
        Headline(title),
        const SizedBox(height: 6),
        Text(epitaph, style: FusibleFonts.paper_(12, italic: true, height: 1.35, color: FusibleColors.encre2)),
        if (epitaphPlus.isNotEmpty) ...[
          const SizedBox(height: 3),
          Text(epitaphPlus, style: FusibleFonts.paper_(12, italic: true, height: 1.35, color: FusibleColors.encre)),
        ],
        const SizedBox(height: 8),
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(width: 100, child: PressPhoto(data: fatal, legend: TextSpan(text: legend))),
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  PaperBox(
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
                  PaperBox(
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
        _Almanach(state: s, content: content, startYear: startYear),
        const SizedBox(height: 6),
        _Columns(
          first:
              '$club. Le vestiaire l\'a appris avant la tribune, la tribune avant l\'intéressé. ${role.name} depuis $saisons saison${saisons > 1 ? 's' : ''}, ${s.entities.protagonist} quitte le club à la ${s.world.standingRank}e place.',
          second: 'Hors micro, $president parle d\'une « décision de bâtisseur ». Le successeur n\'a pas encore de nom ; l\'album, lui, a déjà une page de libre.',
        ),
      ],
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

/// « Ce qui s'est passé » (spec variété §1.7, §3.8) : les 6 lignes les plus
/// lourdes de l'Almanach (année · texte), les objectifs cachés (atteints ✔,
/// sinon leur indice), les histoires vécues et débloquées.
class _Almanach extends StatelessWidget {
  final GameState state;
  final Content content;
  final int startYear;
  const _Almanach({required this.state, required this.content, required this.startYear});

  @override
  Widget build(BuildContext context) {
    final payload = state.pending?.payload ?? const {};
    final lines = ((payload['journal'] as List?) ?? const []).map((e) => JournalEntry.fromJson((e as Map).cast<String, dynamic>())).toList();
    final objs = ((payload['objectifs'] as List?) ?? const []).map((e) => (e as Map).cast<String, dynamic>()).toList();
    final hist = ((payload['histoires'] as List?) ?? const []).map((e) => e.toString()).toList();
    final deb = ((payload['debloquees'] as List?) ?? const []).map((e) => e.toString()).toList();
    final k = objs.where((o) => o['atteint'] == true).length;
    final histStyle = FusibleFonts.paper_(11, height: 1.35);
    final sep = TextSpan(text: ' · ', style: histStyle.copyWith(color: FusibleColors.encre3));

    return Container(
      margin: const EdgeInsets.only(top: 8),
      padding: const EdgeInsets.only(top: 5),
      decoration: const BoxDecoration(border: Border(top: BorderSide(color: FusibleColors.encre))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const AlmanachHead("Ce qui s'est passé"),
          if (lines.isEmpty)
            AlmanachLine(year: '$startYear', text: "Une carrière trop courte pour l'Almanach.", first: true)
          else
            for (var i = 0; i < lines.length; i++)
              AlmanachLine(year: '${lines[i].year}', text: almanachText(lines[i], content, state), kind: lines[i].kind, first: i == 0),
          if (objs.isNotEmpty) ...[
            AlmanachHead('Objectifs $k/${objs.length}'),
            for (final o in objs)
              Semantics(
                label: o['atteint'] == true ? 'Objectif atteint : ${o['titre'] ?? o['id']}' : 'Indice : ${o['indice'] ?? ''}',
                excludeSemantics: true,
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 2),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(
                        width: 14,
                        child: o['atteint'] == true
                            ? const Padding(padding: EdgeInsets.only(top: 2), child: _CheckGlyph())
                            : Text('·', textAlign: TextAlign.center, style: FusibleFonts.cond_(11, color: FusibleColors.encre3)),
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        child: o['atteint'] == true
                            ? Text((o['titre'] ?? o['id']).toString().toUpperCase(), style: FusibleFonts.cond_(11, spacing: .04))
                            : Text('« ${(o['indice'] ?? '…').toString()} »', style: FusibleFonts.paper_(11, italic: true, height: 1.3, color: FusibleColors.encre2)),
                      ),
                    ],
                  ),
                ),
              ),
          ],
          const AlmanachHead('Histoires vécues'),
          if (hist.isEmpty)
            Text("Aucune histoire n'a eu le temps de s'écrire.", style: histStyle.copyWith(fontStyle: FontStyle.italic, color: FusibleColors.encre3))
          else
            Text.rich(TextSpan(children: [for (var i = 0; i < hist.length; i++) ...[if (i > 0) sep, TextSpan(text: hist[i])]]), style: histStyle),
          if (deb.isNotEmpty)
            Text.rich(
              TextSpan(children: [
                TextSpan(text: deb.length > 1 ? 'DÉBLOQUÉES : ' : 'DÉBLOQUÉE : ', style: FusibleFonts.cond_(10, weight: FontWeight.w700, spacing: .1, color: FusibleColors.encre2)),
                for (var i = 0; i < deb.length; i++) ...[if (i > 0) sep, TextSpan(text: deb[i])],
              ]),
              style: histStyle,
            ),
        ],
      ),
    );
  }
}

/// Coche « ✔ » dessinée (pelouse), 9 px.
class _CheckGlyph extends StatelessWidget {
  const _CheckGlyph();

  @override
  Widget build(BuildContext context) => const CustomPaint(size: Size(10, 9), painter: _CheckPainter());
}

class _CheckPainter extends CustomPainter {
  const _CheckPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()
      ..color = FusibleColors.pelouse
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    canvas.drawPath(
      Path()
        ..moveTo(1, size.height * .55)
        ..lineTo(size.width * .4, size.height - 1)
        ..lineTo(size.width - 1, 1),
      p,
    );
  }

  @override
  bool shouldRepaint(_CheckPainter oldDelegate) => false;
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

