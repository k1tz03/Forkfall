import 'package:flutter/foundation.dart';
import 'package:fusible_core/fusible_core.dart';

/// Holds the current run and the (in-memory) meta profile: discovered endings
/// for the Cimetière. Persistence to disk is a later milestone.
class GameController extends ChangeNotifier {
  final Engine engine;
  GameController(this.engine);

  GameState? state;
  int _nextSeed = 1;

  /// La carte fatale : la dernière vignette jouée avant la fin (et son n°).
  Pending? fatalCard;
  int fatalNumber = 0;

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

  /// Numéro d'album (1 pour le premier run), pour la plaque du Cimetière.
  int get albumNumber => runsPlayed;

  void newRun(int postulat) {
    _nextSeed = _seedFrom(runsPlayed, postulat);
    state = engine.start(_nextSeed, postulat: postulat);
    fatalCard = null;
    fatalNumber = 0;
    runsPlayed++;
    notifyListeners();
  }

  /// Start from an explicit Code de Carrière seed (challenge / duel).
  void newRunFromSeed(int seed, int postulat) {
    state = engine.start(seed, postulat: postulat);
    fatalCard = null;
    fatalNumber = 0;
    runsPlayed++;
    notifyListeners();
  }

  /// Rejouer cette graine à l'identique (même postulat, même monde).
  void replay() {
    final s = state;
    if (s == null) return;
    newRunFromSeed(s.seed, s.postulat);
  }

  /// Retour à l'écran titre (l'album fermé), sans toucher au profil.
  void backToTitle() {
    state = null;
    notifyListeners();
  }

  void choose(bool right) {
    final s = state;
    if (s == null || s.over) return;
    final before = s.pending;
    final number = s.turn;
    state = engine.choose(s, right);
    if (state!.over) {
      fatalCard = before;
      fatalNumber = number;
      if (state!.endingId != null) discoveredEndings.add(state!.endingId!);
    }
    notifyListeners();
  }

  /// Succession: start a fresh run keeping the meta profile. For the MVP the
  /// successor is simply the next drawn postulat in the same world seed line.
  void succeed() {
    final prev = state;
    final nextPostulat = prev == null ? 0 : (prev.postulat + 1) % engine.content.postulatsByIndex.length;
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
