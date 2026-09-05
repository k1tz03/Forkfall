import 'package:flutter/foundation.dart';
import 'package:fusible_core/fusible_core.dart';

/// Holds the current run and the (in-memory) meta profile: discovered endings
/// for the Cimetière. Persistence to disk is a later milestone.
class GameController extends ChangeNotifier {
  final Engine engine;
  GameController(this.engine);

  GameState? state;
  int _nextSeed = 1;

  // Meta profile.
  final Set<String> discoveredEndings = {};
  int runsPlayed = 0;

  // Accessibility.
  bool reduceMotion = false;
  bool showButtons = true;

  bool get playing => state != null && !(state!.over);
  bool get ended => state != null && state!.over;

  RoleDef get role => engine.content.roles[state!.role]!;
  EndingDef? get ending => state?.endingId == null ? null : engine.content.endings[state!.endingId];

  void newRun(int postulat) {
    _nextSeed = _seedFrom(runsPlayed, postulat);
    state = engine.start(_nextSeed, postulat: postulat);
    runsPlayed++;
    notifyListeners();
  }

  /// Start from an explicit Code de Carrière seed (challenge / duel).
  void newRunFromSeed(int seed, int postulat) {
    state = engine.start(seed, postulat: postulat);
    runsPlayed++;
    notifyListeners();
  }

  void choose(bool right) {
    final s = state;
    if (s == null || s.over) return;
    state = engine.choose(s, right);
    if (state!.over && state!.endingId != null) {
      discoveredEndings.add(state!.endingId!);
    }
    notifyListeners();
  }

  /// Succession: start a fresh run keeping the meta profile. For the MVP the
  /// successor is simply the next drawn postulat in the same world seed line.
  void succeed() {
    final prev = state;
    final nextPostulat = prev == null ? 0 : (prev.postulat + 1) % kPostulats.length;
    newRun(nextPostulat);
  }

  int _seedFrom(int runs, int postulat) {
    // A stable-but-varied seed; xor with a per-run salt.
    return (fnv1a32('fusible-$runs-$postulat') ^ (runs * 2654435761)) & 0x7FFFFFFF;
  }

  CareerCode get careerCode => CareerCode(
        contentVersion: engine.content.version,
        seed: state!.seed,
        postulat: state!.postulat,
        swipes: state!.swipes,
      );

  /// A shareable, spoiler-light recap for social feeds (docs/brainstorm 7.5).
  String shareText() {
    final s = state!;
    final e = ending;
    final title = e?.title ?? 'Fin de carrière';
    final saisons = s.stats['saisons'] ?? 0;
    final roles = s.stats['roles'] ?? 1;
    return 'FUSIBLE — ${role.name} · $saisons saison(s) · $roles rôle(s) · '
        'Fin : « $title ». Code : ${careerCode.seedCode}. #JaiÉtéViré';
  }

  void setReduceMotion(bool v) {
    reduceMotion = v;
    notifyListeners();
  }

  void setShowButtons(bool v) {
    showButtons = v;
    notifyListeners();
  }
}
