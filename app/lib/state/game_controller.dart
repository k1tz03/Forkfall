import 'dart:math' as math;

import 'package:flutter/foundation.dart';
import 'package:fusible_core/fusible_core.dart';

/// Le nom du joueur (spec variété §1.8) : cosmétique, mémorisé dans le profil
/// et proposé par défaut à la carrière suivante ; jamais dans le Code de
/// Carrière. Une chaîne vide laisse le moteur tirer.
class PlayerName {
  final String prenom;
  final String nom;
  final String genre; // 'm' | 'f'
  const PlayerName({this.prenom = '', this.nom = '', this.genre = 'm'});

  PlayerName copyWith({String? prenom, String? nom, String? genre}) =>
      PlayerName(prenom: prenom ?? this.prenom, nom: nom ?? this.nom, genre: genre ?? this.genre);

  bool get isEmpty => prenom.trim().isEmpty && nom.trim().isEmpty;

  Map<String, dynamic> toJson() => {'prenom': prenom, 'nom': nom, 'genre': genre};
  factory PlayerName.fromJson(Map<String, dynamic> j) => PlayerName(
        prenom: j['prenom'] as String? ?? '',
        nom: j['nom'] as String? ?? '',
        genre: j['genre'] == 'f' ? 'f' : 'm',
      );
}

/// Le profil local : le nom, les albums joués et, par postulat, les
/// déblocages cumulés du moteur (`objectif:<id>`, `fin:<id>`) plus les
/// histoires vécues (`histoire:<titre>`). Sérialisable pour un stockage
/// ultérieur ; aujourd'hui il vit en mémoire (aucun stockage dans l'app).
class Profile {
  PlayerName name;
  int runsPlayed;
  final Map<String, Set<String>> unlocked; // postulatId → clés

  Profile({this.name = const PlayerName(), this.runsPlayed = 0, Map<String, Set<String>>? unlocked}) : unlocked = unlocked ?? {};

  Set<String> of(String postulatId) => unlocked[postulatId] ?? const {};

  /// Toutes les fins découvertes, tous postulats confondus.
  Set<String> get endings => {
        for (final keys in unlocked.values)
          for (final k in keys)
            if (k.startsWith('fin:')) k.substring(4),
      };

  int objectifsDone(String postulatId) => of(postulatId).where((k) => k.startsWith('objectif:')).length;
  int storiesSeen(String postulatId) => of(postulatId).where((k) => k.startsWith('histoire:')).length;

  Map<String, dynamic> toJson() => {
        'name': name.toJson(),
        'runs': runsPlayed,
        'unlocked': {for (final e in unlocked.entries) e.key: e.value.toList()..sort()},
      };

  factory Profile.fromJson(Map<String, dynamic> j) => Profile(
        name: j['name'] is Map ? PlayerName.fromJson((j['name'] as Map).cast<String, dynamic>()) : const PlayerName(),
        runsPlayed: (j['runs'] as num?)?.toInt() ?? 0,
        unlocked: {
          for (final e in ((j['unlocked'] as Map?) ?? const {}).entries) e.key.toString(): ((e.value as List?) ?? const []).map((x) => x.toString()).toSet(),
        },
      );
}

/// Holds the current run and the meta profile (name, discovered endings,
/// objectives and stories per postulat). Persistence to disk is a later
/// milestone: the profile is serializable but lives in memory.
class GameController extends ChangeNotifier {
  final Engine engine;
  GameController(this.engine, {Profile? profile}) : profile = profile ?? Profile();

  GameState? state;
  int _nextSeed = 1;

  /// La carte fatale : la dernière vignette jouée avant la fin (et son n°).
  Pending? fatalCard;
  int fatalNumber = 0;

  // Meta profile.
  final Profile profile;
  Set<String> get discoveredEndings => profile.endings;
  int get runsPlayed => profile.runsPlayed;

  // Accessibility.
  bool reduceMotion = false;
  bool showButtons = true;

  bool get playing => state != null && !(state!.over);
  bool get ended => state != null && state!.over;

  RoleDef get role => engine.content.roles[state!.role]!;
  EndingDef? get ending => state?.endingId == null ? null : engine.content.endings[state!.endingId];
  PostulatDef? get postulat => state == null ? null : engine.content.postulats[state!.postulatId];

  /// Numéro d'album (1 pour le premier run), pour la plaque du Cimetière.
  int get albumNumber => runsPlayed;

  // ---------------------------------------------------------------------------
  // Le nom (spec variété §1.8).
  // ---------------------------------------------------------------------------

  PlayerName get playerName => profile.name;

  /// Mémorise le nom saisi sur la page 1 de l'album (sans rebâtir l'écran :
  /// c'est le formulaire qui tient les champs).
  void setPlayerName({String? prenom, String? nom, String? genre}) {
    profile.name = profile.name.copyWith(prenom: prenom, nom: nom, genre: genre);
  }

  /// Un nom au hasard (Rng cosmétique, jamais celui de la partie) parmi
  /// content/names : prénom du genre courant, nom de famille.
  PlayerName randomName([math.Random? rng]) {
    final r = rng ?? math.Random();
    final names = engine.content.names;
    String pick(String key) {
      final list = (names[key] as List?)?.cast<String>() ?? const [];
      return list.isEmpty ? '' : list[r.nextInt(list.length)];
    }

    final genre = profile.name.genre;
    profile.name = PlayerName(prenom: pick(genre == 'f' ? 'prenoms_f' : 'prenoms_m'), nom: pick('noms'), genre: genre);
    return profile.name;
  }

  // ---------------------------------------------------------------------------
  // Les runs.
  // ---------------------------------------------------------------------------

  /// Démarre une carrière sur un postulat, sous le nom fourni (ou, à défaut,
  /// celui du profil ; vide = tiré par le moteur). Le nom n'entre ni dans la
  /// graine ni dans le Code de Carrière.
  void startRun(int postulat, {String? prenom, String? nom, String? genre}) {
    if (prenom != null || nom != null || genre != null) setPlayerName(prenom: prenom, nom: nom, genre: genre);
    _nextSeed = _seedFrom(runsPlayed, postulat);
    _begin(_nextSeed, postulat, profile.name);
  }

  /// Compatibilité : `newRun` = `startRun` sous le nom du profil.
  void newRun(int postulat) => startRun(postulat);

  /// Start from an explicit Code de Carrière seed (challenge / duel). Le code
  /// ne porte pas de nom : on joue sous le sien (le profil), ou sous un nom
  /// libre si l'appelant en fournit un (« sous le sien »).
  void newRunFromSeed(int seed, int postulat, {String? prenom, String? nom, String? genre}) {
    final name = (prenom == null && nom == null && genre == null) ? profile.name : PlayerName(prenom: prenom ?? '', nom: nom ?? '', genre: genre ?? profile.name.genre);
    _begin(seed, postulat, name);
  }

  void _begin(int seed, int postulat, PlayerName name) {
    String? opt(String v) => v.trim().isEmpty ? null : v.trim();
    state = engine.start(seed, postulat: postulat, prenom: opt(name.prenom), nom: opt(name.nom), genre: name.genre);
    fatalCard = null;
    fatalNumber = 0;
    profile.runsPlayed++;
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
      _recordUnlocks(state!);
    }
    notifyListeners();
  }

  /// À la fin : les déblocages du run (objectifs, fin) et les histoires vécues
  /// rejoignent le profil, cumulés par postulat.
  void _recordUnlocks(GameState s) {
    final keys = profile.unlocked.putIfAbsent(s.postulatId, () => <String>{});
    keys.addAll(s.unlocked.where((k) => k.startsWith('objectif:') || k.startsWith('fin:')));
    if (s.endingId != null) keys.add('fin:${s.endingId}');
    final histoires = (s.pending?.payload['histoires'] as List?) ?? const [];
    for (final h in histoires) {
      keys.add('histoire:$h');
    }
  }

  /// Succession : une carrière neuve sur le postulat suivant, même profil. La
  /// lignée est textuelle (spec variété §1.8) : le nom de famille reste, le
  /// moteur tire un nouveau prénom.
  void succeed() {
    final prev = state;
    final nextPostulat = prev == null ? 0 : (prev.postulat + 1) % engine.content.postulatsByIndex.length;
    _nextSeed = _seedFrom(runsPlayed, nextPostulat);
    _begin(_nextSeed, nextPostulat, PlayerName(prenom: '', nom: profile.name.nom, genre: profile.name.genre));
  }

  int _seedFrom(int runs, int postulat) {
    // A stable-but-varied seed; xor with a per-run salt.
    return (fnv1a32('fusible-$runs-$postulat') ^ (runs * 2654435761)) & 0x7FFFFFFF;
  }

  // ---------------------------------------------------------------------------
  // Les compteurs des pochettes (spec variété §1.9, §3.8).
  // ---------------------------------------------------------------------------

  /// Le nombre d'intrigues (`serie`) ouvertes au postulat : toutes celles sans
  /// restriction, plus celles qui le nomment.
  int storiesTotal(PostulatDef p) => engine.content.arcsSorted.where((a) => a.kind == 'serie' && (a.postulats.isEmpty || a.postulats.contains(p.id))).length;

  // ---------------------------------------------------------------------------
  // Partage.
  // ---------------------------------------------------------------------------

  CareerCode get careerCode => CareerCode(
        contentVersion: engine.content.version,
        seed: state!.seed,
        postulat: state!.postulat,
        swipes: state!.swipes,
      );

  /// A shareable, spoiler-light recap for social feeds (docs/brainstorm 7.5).
  /// Le nom y figure (spec variété §1.8) sauf demande contraire ; le Code,
  /// lui, ne le porte jamais.
  String shareText({bool hideName = false}) {
    final s = state!;
    final e = ending;
    final title = (s.pending?.payload['title'] as String?) ?? e?.title ?? 'Fin de carrière';
    final saisons = s.stats['saisons'] ?? 0;
    final roles = s.stats['roles'] ?? 1;
    final who = hideName ? role.name : '${s.entities.protagonist}, ${role.name.toLowerCase()}';
    return 'FUSIBLE — $who · $saisons saison(s) · $roles rôle(s) · '
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
