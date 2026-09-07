/// Content lint. Validates the compiled bundle against the closed taxonomies
/// (tags, flags, characters), the `when` vocabulary, references (scheduled
/// cards, roles, endings, arcs), the no-real-names rule, text/label lengths,
/// flag read/write consistency, and the narrative layer's shape
/// (docs/brainstorm section 9.5, narrative spec §2.11).
/// Run: dart run fusible_tools:lint
library;

import 'dart:convert';
import 'dart:io';

import 'package:fusible_core/fusible_core.dart' show kKnownCalls, kKnownPathPrefixes, kKnownPaths, kKnownPlaceholders, kNamePlaceholders, kVerdictOutcomes, placeholdersOf;
import 'package:yaml/yaml.dart';

/// Valeurs de rendu du lint pour la longueur des manchettes (spec variété
/// §2.4) : un nom de 16 lettres, une ville de 12, le club le plus long.
const Map<String, String> kSampleVars = {
  'NOM': 'BRÉHAUT-LEMOINE',
  'nom': 'Bréhaut-Lemoine',
  'prenom': 'Marie-Josèphe',
  'initiales': 'MB',
  'joueur': 'Marie-Josèphe Bréhaut-Lemoine',
  'protagoniste': 'Marie-Josèphe Bréhaut-Lemoine',
  'toi': 'monsieur Bréhaut-Lemoine',
  'Toi': 'Monsieur Bréhaut-Lemoine',
  'numero': '10',
  'VILLE': 'SAINT-ÉTOILE',
  'ville': 'Saint-Étoile',
  'CLUB': 'OLYMPIQUE SAINT-ÉTOILE',
  'club': 'Olympique Saint-Étoile',
  'clubShort': 'Saint-Étoile',
  'rival': 'Sporting Valentienne',
  'president': 'Aulard',
  'capitaine': 'Bréhaut',
  'coach': 'Jean-Pierre Vasseur',
  'rang': '18',
  'pts': '100',
  'annee': '1990',
  'saison': '10',
  'objectif': 'Le maintien',
  'tenu': 'manqué',
  'TENU': 'MANQUÉ',
  'division': 'Division 2',
  'age': '65',
  'camille_metier': 'journaliste',
  'passe_titre': 'Le vieux gardien',
  'fil_rouge': 'president',
  'perso': 'Madame Josiane',
  'perso_tic': 'J\'en ai vu passer, vous savez.',
  'objectif_titre': 'Deux maintiens de suite',
  'fin_titre': 'Le SMS de 23h47',
};

/// Longueur maximale d'une ligne d'Almanach une fois rendue (spec §1.7).
const int kJournalMax = 120;

final RegExp _selectRe = RegExp(r'\{(pg|sg),\s*select,?\s*((?:\w+\{[^{}]*\}\s*)+)\}');
final RegExp _branchRe = RegExp(r'(\w+)\{([^{}]*)\}');
final RegExp _simpleRe = RegExp(r'\{(\w+)\}');

/// Rend un gabarit avec les valeurs de `kSampleVars` : chaque `select` prend
/// sa branche la plus longue, chaque `{x}` connu sa valeur d'exemple.
String renderSample(String tpl) {
  var t = tpl.replaceAllMapped(_selectRe, (m) {
    String longest = '';
    for (final b in _branchRe.allMatches(m.group(2)!)) {
      if (b.group(2)!.length > longest.length) longest = b.group(2)!;
    }
    return longest;
  });
  for (var depth = 0; depth < 2; depth++) {
    t = t.replaceAllMapped(_simpleRe, (m) => kSampleVars[m.group(1)] ?? m.group(0)!);
  }
  return t;
}

/// Placeholders inconnus d'un gabarit (hors `select`, hors `age_<id>`).
Iterable<String> unknownPlaceholders(String tpl, Set<String> known) =>
    placeholdersOf(tpl).where((p) => !known.contains(p) && !p.startsWith('age_'));

bool hasNamePlaceholder(String tpl) => placeholdersOf(tpl).any(kNamePlaceholders.contains);

late String contentDir;

dynamic _yaml(String rel) {
  final f = File('$contentDir/$rel');
  if (!f.existsSync()) return null;
  return loadYaml(f.readAsStringSync());
}

// A small blacklist of real brands/competitions that must never appear as
// in-world names. Extend as needed (docs/brainstorm section 8).
const List<String> kBlacklist = [
  'fifa', 'uefa', 'ballon d\'or', 'ligue 1', 'ligue des champions', 'champions league',
  'premier league', 'la liga', 'laliga', 'serie a', 'bundesliga', 'real madrid', 'barcelona',
  'manchester', 'liverpool', 'juventus', 'paris saint-germain', 'psg', 'mbappé', 'messi',
  'ronaldo', 'zidane', 'guardiola', 'mourinho', 'raiola', 'infantino', 'coupe du monde',
];

/// Les mots d'une manchette qui affirment une descente, une montée ou un
/// titre : la manchette doit lire `bilan.outcome` (l'issue que le Verdict
/// appliquera), jamais le rang seul (18e de Division 2 = lanterne, pas
/// descente ; 1er de Division 2 = montée, pas titre).
final RegExp kUneDescenteRe = RegExp(r"descen(d|te|du)|étage du dessous|relégu|dernier wagon");
final RegExp kUneMonteeRe = RegExp(r"mont(ée|e en)|étage du dessus|\bmonte\b");
final RegExp kUneTitreRe = RegExp(r"\bchampion(s|ne|nes)?\b");

/// Flags the engine itself writes (Bilan, Camille's job, role history).
const List<String> kEngineFlags = ['bilan_tenu', 'bilan_manque', 'descente'];
const List<String> kEngineFlagPrefixes = ['camille_', 'role_was_'];

/// Les kinds narratifs : une de leurs sorties sans `answer:` est une erreur
/// (voir la boucle de cartes). `routine`, `nouvelle` et `passe` en sont hors :
/// le sac d'origine en compte des centaines, c'est un manque connu.
const Set<String> kKindsHistoire = {'etape', 'script', 'evenement', 'palier', 'chaine', 'reaction', 'alarme'};

void main() {
  contentDir = _findContentDir();
  final errors = <String>[];
  final warnings = <String>[];

  final tagsDoc = _yaml('tags.yaml') as YamlMap;
  final tags = (tagsDoc['tags'] as YamlList).map((e) => e.toString()).toSet();
  final themes = ((tagsDoc['themes'] as YamlList?) ?? YamlList()).map((e) => e.toString()).toSet();
  final flags = ((_yaml('flags.yaml') as YamlMap)['flags'] as YamlList).map((e) => e.toString()).toSet();
  final characters = ((_yaml('characters.yaml') as YamlMap)['characters'] as YamlList)
      .map((e) => (e as YamlMap)['id'].toString())
      .toSet();

  final bundleFile = File('$contentDir/build/content.json');
  if (!bundleFile.existsSync()) {
    stderr.writeln('content/build/content.json introuvable. Lance build_content d\'abord.');
    exit(1);
  }
  final bundle = json.decode(bundleFile.readAsStringSync()) as Map<String, dynamic>;
  final roleIds = (bundle['roles'] as List).map((r) => (r as Map)['id'].toString()).toSet();
  final endingIds = (bundle['endings'] as List).map((e) => (e as Map)['id'].toString()).toSet();
  final cards = (bundle['cards'] as List).cast<Map<String, dynamic>>();
  final cardIds = cards.map((c) => c['id'].toString()).toSet();
  final arcs = (bundle['arcs'] as List? ?? const []).cast<Map<String, dynamic>>();
  final postulats = (bundle['postulats'] as List? ?? const []).cast<Map<String, dynamic>>();
  final alarms = (bundle['alarms'] as Map? ?? const {}).cast<String, dynamic>();
  final chars = (bundle['characters'] as List? ?? const []).cast<Map<String, dynamic>>();

  final flagsWritten = <String>{...kEngineFlags};
  final flagsRead = <String>{};
  final knownPlaceholders = <String>{...kKnownPlaceholders};
  final nameCardsByRole = <String, int>{}; // cartes du rôle portant le nom (budget §3.7)

  // --- AST scanning: flags read, and the `when` vocabulary (L20).
  void scanAst(Object? node, String where) {
    if (node is! List || node.isEmpty) return;
    final op = node[0];
    if (op == 'call' && node.length >= 3) {
      final name = node[1].toString();
      if (!kKnownCalls.contains(name)) errors.add('$where: appel inconnu dans `when` : $name()');
      if (name == 'flag' && node[2] is List) {
        final args = node[2] as List;
        if (args.isNotEmpty && args[0] is List && (args[0] as List)[0] == 'lit') {
          flagsRead.add((args[0] as List)[1].toString());
        }
      }
    } else if (op == 'path' && node.length >= 2) {
      final p = node[1].toString();
      final known = kKnownPaths.contains(p) || kKnownPathPrefixes.any((pre) => p.startsWith(pre));
      if (!known) errors.add('$where: chemin inconnu dans `when` : $p');
      if (p.startsWith('flags.')) flagsRead.add(p.substring(6));
    }
    for (final child in node) {
      scanAst(child, where);
    }
  }

  void scanEffects(Map<String, dynamic>? eff, String where) {
    if (eff == null) return;
    for (final f in (eff['set'] as List?) ?? const []) {
      flagsWritten.add(f.toString());
      if (!flags.contains(f)) errors.add('$where: drapeau non déclaré "$f"');
    }
    for (final f in (eff['clear'] as List?) ?? const []) {
      flagsWritten.add(f.toString());
      if (!flags.contains(f)) errors.add('$where: drapeau non déclaré "$f"');
    }
    if (eff['role'] != null && !roleIds.contains(eff['role'])) errors.add('$where: rôle inconnu "${eff['role']}"');
    if (eff['end'] != null && !endingIds.contains(eff['end'])) errors.add('$where: fin inconnue "${eff['end']}"');
    for (final sc in (eff['schedule'] as List?) ?? const []) {
      final target = (sc as Map)['card'].toString();
      if (!cardIds.contains(target)) errors.add('$where: carte planifiée inexistante "$target"');
      scanAst(sc['cancel_if'], '$where/schedule');
    }
    for (final e in (eff['enemy'] as List?) ?? const []) {
      if (!characters.contains(e)) errors.add('$where: ennemi inconnu "$e"');
    }
    for (final a in (eff['arc'] as List?) ?? const []) {
      if (!arcs.any((x) => x['id'] == (a as Map)['id'])) errors.add('$where: arc inconnu "${(a as Map)['id']}"');
    }
    for (final b in (eff['rand'] as List?) ?? const []) {
      scanEffects((b as Map).cast<String, dynamic>(), '$where/rand');
    }
  }

  for (final card in cards) {
    final id = card['id'];
    for (final t in (card['tags'] as List)) {
      if (!tags.contains(t)) errors.add('$id: tag inconnu "$t"');
    }
    final speaker = card['speaker'];
    if (speaker != null && !characters.contains(speaker)) {
      errors.add('$id: personnage inconnu "$speaker"');
    }
    for (final side in ['left', 'right']) {
      final choice = card[side] as Map<String, dynamic>;
      final label = choice['label'].toString();
      if (label.length > 28) warnings.add('$id/$side: libellé de ${label.length} caractères (> 28)');
      scanEffects((choice['effects'] as Map?)?.cast<String, dynamic>(), '$id/$side');
    }
    final text = card['text'].toString();
    if (text.length > 200) warnings.add('$id: texte de ${text.length} caractères (> 200)');
    final lower = text.toLowerCase();
    for (final bad in kBlacklist) {
      if (lower.contains(bad)) errors.add('$id: nom/marque réel(le) interdit(e) "$bad"');
    }
    scanAst(card['when'], '$id/when');
    // Le nom du joueur (spec variété §1.8, §3.7) : `{toi}` exige un locuteur ;
    // jamais dans un libellé de bouton ; au plus une fois par carte (avertissement) ;
    // aucun placeholder inconnu dans les textes servis.
    final answers = [for (final side in ['left', 'right']) (card[side] as Map)['answer']?.toString() ?? ''];
    final labels = [for (final side in ['left', 'right']) (card[side] as Map)['label'].toString()];
    for (final t in [text, ...answers, ...labels]) {
      final ph = placeholdersOf(t);
      if ((ph.contains('toi') || ph.contains('Toi')) && speaker == null) errors.add('$id: `{toi}` sans `speaker` (l\'adresse est celle du locuteur)');
      for (final u in unknownPlaceholders(t, knownPlaceholders)) {
        errors.add('$id: placeholder inconnu {$u}');
      }
    }
    for (var i = 0; i < 2; i++) {
      if (hasNamePlaceholder(labels[i])) errors.add('$id/${i == 0 ? 'left' : 'right'}: le nom du joueur n\'entre jamais dans un libellé de bouton');
    }
    // Une sortie de carte d'HISTOIRE sans `answer:` est un écran muet : le
    // swipe ne renvoie rien, et la « carte fatale » de la Une n'a plus de
    // légende de photo (spec §3.8). Défaut de relecture pépite : deux cartes
    // servies dans les traces étaient dans ce cas (jp.presse.merguez à droite,
    // en.direction.fils_president à droite). Le sac d'origine, lui, compte
    // ~320 routines sans `answer` : c'est un manque connu, hérité, et le lint
    // ne le crie pas — mais aucune carte de kind narratif ne s'y ajoute.
    for (var i = 0; i < 2; i++) {
      if (kKindsHistoire.contains(card['kind']) && answers[i].isEmpty) {
        errors.add('$id/${i == 0 ? 'left' : 'right'}: sortie de carte d\'histoire (${card['kind']}) sans `answer:` — l\'écran reste muet après le swipe');
      }
    }
    // Charte § 4.1 : « un seul bouton = deux sorties identiques ». Le moteur
    // rend en un seul bouton toute Nouvelle et toute « Nouvelle du passé »
    // (engine `single`), et il affiche alors le libellé de DROITE : deux
    // libellés différents laissent celui de gauche en texte mort, et rien ne
    // garantit que c'est celui de droite que l'auteur voulait montrer.
    if ((card['kind'] == 'nouvelle' || card['kind'] == 'passe') && labels[0] != labels[1]) {
      errors.add('$id: carte à un seul bouton (${card['kind']}) avec deux libellés — « ${labels[0]} » à gauche est du texte mort, seul « ${labels[1]} » s\'affiche');
    }
    final nameHits = RegExp(r'\{(prenom|nom|NOM|initiales|toi|Toi|joueur|protagoniste)\}').allMatches(text).length;
    if (nameHits > 1) warnings.add('$id: le nom du joueur apparaît $nameHits fois dans le texte (une fois au plus)');
    if (hasNamePlaceholder(text) || answers.any(hasNamePlaceholder)) {
      for (final r in card['roles'] as List) {
        nameCardsByRole[r.toString()] = (nameCardsByRole[r.toString()] ?? 0) + 1;
      }
    }
    // Narrative shape.
    if ((card['tags'] as List).contains('nouvelle') && card['arc'] != 'nouvelle' && card['kind'] != 'passe') {
      warnings.add('$id: tag « nouvelle » sur une carte dont l\'arc n\'est pas « nouvelle » (ne sera pas une respiration)');
    }
    if (card['kind'] == 'nouvelle') {
      final l = json.encode((card['left'] as Map)['effects']);
      final r = json.encode((card['right'] as Map)['effects']);
      if (l != r) warnings.add('$id: Nouvelle aux effets différents des deux côtés (servie comme une carte à un seul bouton)');
    }
  }

  // --- Arcs.
  for (final a in arcs) {
    final id = a['id'];
    scanAst(a['when'], 'arc $id/when');
    scanAst(a['cancel_if'], 'arc $id/cancel_if');
    for (final f in [...(a['requires'] as List? ?? const []), ...(a['excludes'] as List? ?? const [])]) {
      flagsRead.add(f.toString());
      if (!flags.contains(f)) errors.add('arc $id: requires/excludes cite un drapeau non déclaré "$f"');
    }
    for (final f in (a['traces'] as Map? ?? const {}).keys) {
      if (!flags.contains(f)) errors.add('arc $id: traces cite un drapeau non déclaré "$f"');
    }
    // Une rétractation n'a de sens que pour une trace que l'arc déclare : c'est
    // la ligne qui remplace celle du drapeau quand un `clear:` le retire.
    for (final f in (a['traces_retract'] as Map? ?? const {}).keys) {
      if (!(a['traces'] as Map? ?? const {}).containsKey(f)) {
        errors.add('arc $id: traces_retract cite "$f", qui n\'est pas une trace de cet arc');
      }
    }
    final steps = (a['steps'] as List).cast<Map<String, dynamic>>();
    if (a['kind'] == 'serie' && steps.length < 3) warnings.add('arc $id: série de moins de 3 étapes');
    for (final f in (a['epilogue'] as Map? ?? const {}).keys) {
      if (f == 'set' || f == 'clear') scanEffects((a['epilogue'] as Map).cast<String, dynamic>(), 'arc $id/epilogue');
    }
    for (final s in steps) {
      for (final v in s['card'] as List) {
        scanAst((v as Map)['if'], 'arc $id/${s['id']}/if');
      }
      for (final nx in s['next'] as List) {
        scanAst((nx as Map)['if'], 'arc $id/${s['id']}/next');
      }
    }
  }

  // --- Postulats.
  for (final p in postulats) {
    for (final f in (p['flags'] as List?) ?? const []) {
      flagsWritten.add(f.toString());
      if (!flags.contains(f)) errors.add('postulat ${p['id']}: drapeau non déclaré "$f"');
    }
    final seeds = (p['seeds'] as List?) ?? const [];
    if (seeds.isNotEmpty) warnings.add('postulat ${p['id']}: `seeds` est déprécié (remplacé par `programme`, spec variété §1.2)');
    // Le prologue (beat `prologue`, saison 0). Sans lui, la toute première
    // carte d'une carrière est le président qui réclame un objectif : « on est
    // jeté dans la fosse aux lions sans savoir ce qu'est vraiment le jeu ».
    if (p['prologue'] == null) {
      warnings.add('postulat ${p['id']}: aucun `prologue:` — la carrière commence sur la carte Objectif, sans mise en situation');
    }
    for (final sd in seeds) {
      scanAst((sd as Map)['if'], 'postulat ${p['id']}/seeds');
    }
    ((p['programme'] as Map?) ?? const {}).forEach((bucket, bm) {
      for (final e in ((bm as Map)['pool'] as List?) ?? const []) {
        scanAst((e as Map)['if'], 'postulat ${p['id']}/programme/$bucket/${e['arc']}');
      }
    });
    for (final o in (p['objectifs'] as List?) ?? const []) {
      scanAst((o as Map)['when'], 'postulat ${p['id']}/objectifs/${o['id']}');
    }
    (p['alarm_overrides'] as Map? ?? const {}).forEach((key, list) {
      for (final e in list as List) {
        scanAst((e as Map)['when'], 'postulat ${p['id']}/alarm_overrides/$key');
      }
    });
    (p['cast'] as Map? ?? const {}).forEach((ch, _) {
      if (!characters.contains(ch)) errors.add('postulat ${p['id']}: personnage du casting inconnu "$ch"');
      final hasRoutine = cards.any((c) => c['speaker'] == ch && (c['roles'] as List).contains(p['role']) && c['pool'] == true);
      if (!hasRoutine) warnings.add('postulat ${p['id']}: « $ch » est au casting mais n\'a aucune carte de routine pour le rôle ${p['role']}');
    });
  }

  // --- Alarms (L26): 8 (gauge, side) entries per role; the last candidate has no `when`.
  alarms.forEach((role, byKey) {
    final keys = (byKey as Map).keys.map((k) => k.toString()).toSet();
    for (final g in ['vestiaire', 'tribunes', 'direction', 'caisse']) {
      for (final side in ['low', 'high']) {
        if (!keys.contains('$g.$side')) errors.add('alarms/$role: entrée manquante « $g.$side »');
      }
    }
    byKey.forEach((key, list) {
      final l = list as List;
      if (l.isEmpty || (l.last as Map)['when'] != null) {
        errors.add('alarms/$role/$key: le dernier candidat doit être sans `when` (sinon l\'alarme peut ne jamais sortir)');
      }
      for (final e in l) {
        scanAst((e as Map)['when'], 'alarms/$role/$key');
      }
    });
  });
  for (final r in roleIds) {
    if (!alarms.containsKey(r)) warnings.add('alarms: aucune alarme pour le rôle « $r »');
  }

  // --- Characters: on_relation ifs.
  for (final ch in chars) {
    (ch['on_relation'] as Map? ?? const {}).forEach((t, variants) {
      for (final v in variants as List) {
        scanAst((v as Map)['if'], 'characters/${ch['id']}/on_relation/$t');
      }
    });
  }

  // --- La Une, le journal, les épitaphes, les adresses (spec variété §2.4-2.6,
  // §3.7) : placeholders connus seulement ; titre ≤ 44 caractères rendu avec un
  // nom de 16 lettres et une ville de 12 ; `when` sans les drapeaux de la
  // saison précédente ; ≥ 2 secours ; {NOM}/{CLUB}/{VILLE} dans ≥ 50 % des
  // manchettes (avertissement).
  final unes = (bundle['unes'] as List? ?? const []).cast<Map<String, dynamic>>();
  int unesNamed = 0;
  bool readsFlag(Object? node, Set<String> names) {
    if (node is! List || node.isEmpty) return false;
    if (node[0] == 'call' && node.length > 2 && node[1] == 'flag') {
      final args = node[2];
      if (args is List && args.isNotEmpty && args[0] is List && (args[0] as List)[0] == 'lit' && names.contains((args[0] as List)[1].toString())) return true;
    }
    if (node[0] == 'path' && node.length > 1) {
      final p = node[1].toString();
      if (names.contains(p) || (p.startsWith('flags.') && names.contains(p.substring(6)))) return true;
    }
    return node.any((c) => readsFlag(c, names));
  }

  bool readsPath(Object? node, String path) {
    if (node is! List || node.isEmpty) return false;
    if (node[0] == 'path' && node.length > 1 && node[1].toString() == path) return true;
    return node.any((c) => readsPath(c, path));
  }

  void checkOutcomeLiterals(Object? node, String where) {
    if (node is! List || node.isEmpty) return;
    if (node[0] == 'cmp' && node.length == 4 && readsPath(node[2], 'bilan.outcome') || node[0] == 'cmp' && node.length == 4 && readsPath(node[3], 'bilan.outcome')) {
      for (final side in [node[2], node[3]]) {
        if (side is List && side.isNotEmpty && side[0] == 'lit' && !kVerdictOutcomes.contains(side[1].toString())) {
          errors.add('$where: bilan.outcome comparé à « ${side[1]} » (issues connues : ${(kVerdictOutcomes.toList()..sort()).join(', ')})');
        }
      }
    }
    for (final c in node) {
      checkOutcomeLiterals(c, where);
    }
  }

  for (final u in unes) {
    final uid = u['id'].toString();
    scanAst(u['when'], 'unes.yaml/$uid/when');
    checkOutcomeLiterals(u['when'], 'unes.yaml/$uid/when');
    if (readsFlag(u['when'], const {'bilan_tenu', 'bilan_manque', 'world.rang_final'})) {
      errors.add('unes.yaml/$uid: `when` lit bilan_tenu / bilan_manque / world.rang_final (valeurs de la saison précédente) : utiliser bilan.tenu / bilan.rang');
    }
    // Une manchette qui titre une descente, une montée ou un sacre lit l'issue
    // du verdict (`bilan.outcome`), jamais le rang seul : « la Une ne ment pas ».
    final words = '${u['titre']} ${u['sous'] ?? ''}'.toLowerCase();
    final claims = [
      if (kUneDescenteRe.hasMatch(words)) 'une descente',
      if (kUneMonteeRe.hasMatch(words)) 'une montée',
      if (kUneTitreRe.hasMatch(words)) 'un titre',
    ];
    if (claims.isNotEmpty && !readsPath(u['when'], 'bilan.outcome')) {
      errors.add('unes.yaml/$uid: le titre ou le sous-titre affirme ${claims.join(' / ')} sans lire `bilan.outcome` (le rang ne dit pas la division : 18e de Division 2 = lanterne)');
    }
    for (final v in (u['react'] as List?) ?? const []) {
      scanAst((v as Map)['if'], 'unes.yaml/$uid/react');
      if (!cardIds.contains(v['card'].toString())) errors.add('unes.yaml/$uid: react vers une carte inexistante « ${v['card']} »');
    }
    final titre = u['titre'].toString();
    final sous = u['sous']?.toString() ?? '';
    for (final t in [titre, sous]) {
      for (final p in unknownPlaceholders(t, knownPlaceholders)) {
        errors.add('unes.yaml/$uid: placeholder inconnu {$p}');
      }
    }
    final rendered = renderSample(titre);
    if (rendered.length > 44) errors.add('unes.yaml/$uid: titre de ${rendered.length} caractères rendu (> 44) : « $rendered »');
    if (u['photo'] != null && !cardIds.contains(u['photo'].toString())) errors.add('unes.yaml/$uid: photo vers une carte inexistante « ${u['photo']} »');
    final ph = placeholdersOf(titre);
    if (ph.contains('NOM') || ph.contains('CLUB') || ph.contains('VILLE')) unesNamed += 1;
    final lower = '$titre $sous'.toLowerCase();
    for (final bad in kBlacklist) {
      if (lower.contains(bad)) errors.add('unes.yaml/$uid: nom/marque réel(le) interdit(e) "$bad"');
    }
  }
  if (unes.isNotEmpty && unesNamed < unes.length / 2) {
    warnings.add('unes.yaml: {NOM} ou {CLUB}/{VILLE} dans $unesNamed manchette(s) sur ${unes.length} (attendu ≥ 50 %)');
  }
  final journaux = (bundle['journaux'] as List? ?? const []).cast<Map<String, dynamic>>();
  for (final j in journaux) {
    for (final p in unknownPlaceholders(j['nom'].toString(), knownPlaceholders)) {
      errors.add('unes.yaml/journaux/${j['id']}: placeholder inconnu {$p}');
    }
  }
  ((bundle['journal_templates'] as Map?) ?? const {}).forEach((k, v) {
    for (final p in unknownPlaceholders(v.toString(), knownPlaceholders)) {
      errors.add('journal.yaml/auto/$k: placeholder inconnu {$p}');
    }
  });

  // --- Longueur RENDUE des lignes d'Almanach (spec variété §1.7 : « ≤ 120
  // caractères »). `Director.addJournal` coupait au 119e caractère, en plein
  // mot : ces lignes sont servies telles quelles dans les brèves de la Une et
  // sur l'écran « Ce qui s'est passé ». La troncature reste un garde-fou de
  // rendu ; la règle d'écriture est ici, et elle est bloquante. Même échantillon
  // que le titre de manchette (`renderSample`, le pire cas de nom et de club).
  void journalLen(String where, String tpl) {
    final r = renderSample(tpl);
    if (r.length > kJournalMax) {
      errors.add('$where: ligne de journal de ${r.length} caractères rendue (> $kJournalMax) : « $r »');
    }
  }

  String? journalText(Object? v) {
    if (v is String) return v;
    if (v is Map) return v['text']?.toString();
    return null;
  }

  for (final c in cards) {
    for (final side in ['left', 'right']) {
      final eff = ((c[side] as Map?)?['effects'] as Map?) ?? const {};
      final t = journalText(eff['journal']);
      if (t != null) journalLen('${c['id']}/$side/journal', t);
    }
  }
  for (final a in arcs) {
    ((a['traces'] as Map?) ?? const {}).forEach((k, v) {
      journalLen('arc ${a['id']}/traces/$k', v.toString());
    });
    ((a['traces_retract'] as Map?) ?? const {}).forEach((k, v) {
      journalLen('arc ${a['id']}/traces_retract/$k', v.toString());
    });
    if (a['journal'] != null) journalLen('arc ${a['id']}/journal', a['journal'].toString());
    final ep = journalText((a['epilogue'] as Map?)?['journal']);
    if (ep != null) journalLen('arc ${a['id']}/epilogue/journal', ep);
  }
  ((bundle['journal_templates'] as Map?) ?? const {}).forEach((k, v) {
    journalLen('journal.yaml/auto/$k', v.toString());
  });
  for (final e in (bundle['endings'] as List).cast<Map<String, dynamic>>()) {
    final eid = e['id'];
    for (final p in unknownPlaceholders(e['epitaph'].toString(), knownPlaceholders)) {
      errors.add('endings/$eid: placeholder inconnu {$p}');
    }
    for (final v in (e['epitaph_plus'] as List?) ?? const []) {
      final vm = v as Map;
      scanAst(vm['when'], 'endings/$eid/epitaph_plus');
      for (final p in unknownPlaceholders(vm['text'].toString(), knownPlaceholders)) {
        errors.add('endings/$eid/epitaph_plus: placeholder inconnu {$p}');
      }
    }
  }
  // --- Les set-pieces (spec variété §1.12, §2.7) : placeholders connus, `{toi}`
  // avec un locuteur, aucun nom réel, et le budget d'écriture par rôle.
  final setpieces = (bundle['setpieces'] as Map? ?? const {}).cast<String, dynamic>();
  final spByRole = <String, int>{};
  setpieces.forEach((beat, list) {
    final variants = (list as List).cast<Map<String, dynamic>>();
    for (int i = 0; i < variants.length; i++) {
      final v = variants[i];
      final where = 'setpieces.yaml/$beat[$i]';
      scanAst(v['when'], '$where/when');
      for (final key in const ['text', 'left', 'right', 'answer_left', 'answer_right']) {
        final t = v[key];
        if (t is! String) continue;
        for (final ph in unknownPlaceholders(t, {...knownPlaceholders, 'patron', 'objectif_min', 'adversite', 'vestiaire_mot', 'tour', 'minute', 'score', 'gm_score'})) {
          // `{rang}`, `{pts}` et `{journee}` sont dans kKnownPlaceholders : le
          // beat `classement` les fournit comme le Bilan fournit `{rang}`.
          errors.add('$where/$key: placeholder inconnu {$ph}');
        }
        if (placeholdersOf(t).any((x) => x == 'toi' || x == 'Toi') && v['speaker'] == null) {
          errors.add('$where/$key: {toi} sans `speaker` (l\'adresse est celle du locuteur)');
        }
        final lower = t.toLowerCase();
        for (final bad in kBlacklist) {
          if (lower.contains(bad)) errors.add('$where/$key: nom/marque réel(le) interdit(e) "$bad"');
        }
        if (const ['left', 'right'].contains(key) && hasNamePlaceholder(t)) {
          errors.add('$where/$key: le nom du joueur n\'a rien à faire dans un libellé de bouton');
        }
      }
      final roles = (v['roles'] as List?)?.map((e) => e.toString()).toList() ?? const <String>[];
      for (final r in roles.isEmpty ? roleIds.toList() : roles) {
        if (v['when'] != null || roles.isNotEmpty) spByRole[r] = (spByRole[r] ?? 0) + 1;
      }
    }
  });
  for (final r in roleIds) {
    final n = spByRole[r] ?? 0;
    if (setpieces.isNotEmpty && n < 20) {
      warnings.add('setpieces.yaml: $n variante(s) conditionnée(s) pour le rôle « $r » (budget ≈ 60 lignes par rôle, spec variété §1.12)');
    }
  }

  for (final ch in chars) {
    ((ch['adresse'] as Map?) ?? const {}).forEach((role, byExpr) {
      (byExpr as Map).forEach((expr, tpl) {
        for (final p in unknownPlaceholders(tpl.toString(), knownPlaceholders)) {
          errors.add('characters/${ch['id']}/adresse/$role/$expr: placeholder inconnu {$p}');
        }
      });
    });
  }

  // --- Réservoir et couture (spec variété §2.2, §3.7). Les contrôles de
  // structure sont bloquants pour un postulat livré (`chantier: false`) et de
  // simples avertissements tant qu'il est en chantier ; les budgets de volume
  // (≥ 12 intrigues, ≥ 6 thèmes…) restent des avertissements jusqu'à la
  // livraison du lot de contenu (étape 3).
  final arcById = {for (final a in arcs) a['id'].toString(): a};
  bool readsPlays(Object? node) {
    if (node is! List || node.isEmpty) return false;
    if (node[0] == 'call' && node.length >= 2 && node[1] == 'plays') return true;
    return node.any(readsPlays);
  }

  final outcomesPosed = <String, Set<String>>{};
  for (final a in arcs) {
    final id = a['id'].toString();
    for (final st in (a['steps'] as List).cast<Map<String, dynamic>>()) {
      if (st['outcome'] != null) (outcomesPosed[id] ??= {}).add(st['outcome'].toString());
    }
  }
  // Une issue peut être posée dans une branche de `rand:` (le moteur applique
  // les effets récursivement, engine `_applyEffects`) : le scanner descend donc
  // dans `rand`, sinon `co.derby` passe pour n'avoir jamais posé `gagne`.
  void collectOutcomes(String arcId, Map<dynamic, dynamic> eff) {
    final o = eff['outcome'];
    if (o != null) (outcomesPosed[arcId] ??= {}).add(o.toString());
    for (final b in (eff['rand'] as List?) ?? const []) {
      if (b is Map) collectOutcomes(arcId, b);
    }
  }

  for (final c in cards) {
    final arcId = c['arcId']?.toString();
    if (arcId == null) continue;
    for (final side in ['left', 'right']) {
      collectOutcomes(arcId, (c[side] as Map)['effects'] as Map);
    }
  }
  for (final a in arcs) {
    final id = a['id'].toString();
    if (a['replay'] != null) {
      final first = ((a['steps'] as List).isEmpty ? const [] : ((a['steps'] as List).first as Map)['card'] as List);
      if (!first.any((v) => readsPlays((v as Map)['if']))) {
        warnings.add('arc $id: rejouable sans variante « encore » (aucune variante de l\'étape 1 ne lit plays())');
      }
    }
    for (final issue in (a['issues'] as List? ?? const [])) {
      if (!(outcomesPosed[id] ?? const {}).contains(issue)) warnings.add('arc $id: issue « $issue » jamais posée par une sortie');
    }
  }
  for (final p in postulats) {
    final pid = p['id'].toString();
    final prog = p['programme'] as Map?;
    if (prog == null) continue;
    final chantier = p['chantier'] == true;
    final strict = chantier ? warnings : errors;
    final suffix = chantier ? ' (en chantier)' : '';
    final poolArcs = <String>[];
    bool signature = false;
    prog.forEach((bucket, bm) {
      for (final e in ((bm as Map)['pool'] as List?) ?? const []) {
        final arcId = (e as Map)['arc'].toString();
        if (!poolArcs.contains(arcId)) poolArcs.add(arcId);
        if (e['signature'] == true) signature = true;
      }
    });
    final objectifs = (p['objectifs'] as List?) ?? const [];
    if (objectifs.length != 3) strict.add('postulat $pid: ${objectifs.length} objectifs (attendu 3)$suffix');
    final cast = (p['cast'] as Map? ?? const {}).keys.map((k) => k.toString()).toSet();
    final themesSeen = <String>{};
    final carriers = <String>{};
    int tardives = 0;
    for (final arcId in poolArcs) {
      final a = arcById[arcId];
      if (a == null) continue;
      final theme = a['theme']?.toString() ?? '';
      final carrier = a['carrier']?.toString() ?? ((a['cast'] as List).isEmpty ? '' : (a['cast'] as List).first.toString());
      themesSeen.add(theme);
      carriers.add(carrier);
      if (((a['min_season'] as num?)?.toInt() ?? 0) >= 2) tardives += 1;
      if (!themes.contains(theme)) strict.add('postulat $pid: intrigue $arcId : thème « $theme » hors de tags.yaml → themes$suffix');
      if (carrier.isEmpty) {
        strict.add('postulat $pid: intrigue $arcId sans porteur (carrier ou cast)$suffix');
      } else if (cast.isNotEmpty && !cast.contains(carrier)) {
        warnings.add('postulat $pid: le porteur « $carrier » de $arcId n\'est pas au casting du postulat');
      }
      if (((a['issues'] as List?) ?? const []).length < 2) strict.add('postulat $pid: intrigue $arcId : moins de 2 issues$suffix');
      final traces = (a['traces'] as Map?) ?? const {};
      if (traces.isEmpty) warnings.add('postulat $pid: intrigue $arcId sans `traces` (rien ne rappellera cette histoire)');
      for (final f in traces.keys) {
        if (!flagsRead.contains(f)) strict.add('postulat $pid: la trace « $f » de $arcId n\'est lue nulle part$suffix');
      }
      if (a['replay'] != null) {
        final first = ((a['steps'] as List).isEmpty ? const [] : ((a['steps'] as List).first as Map)['card'] as List);
        if (!first.any((v) => readsPlays((v as Map)['if']))) strict.add('postulat $pid: intrigue rejouable $arcId sans variante lisant plays()$suffix');
      }
    }
    // Budgets de volume (spec variété §3.7) : avertissements tant que le
    // postulat est en chantier, erreurs dès `chantier: false` (la livraison du lot).
    void budget(bool ok, String msg) {
      if (!ok) strict.add('postulat $pid: budget de réservoir — $msg${chantier ? ' (bloquant dès chantier: false)' : ''}');
    }

    budget(poolArcs.length >= 12, 'réservoir de ${poolArcs.length} intrigues (attendu ≥ 12)');
    budget(signature, 'aucune intrigue `signature`');
    budget(themesSeen.length >= 6, '${themesSeen.length} thèmes (attendu ≥ 6)');
    budget(carriers.length >= 6, '${carriers.length} porteurs (attendu ≥ 6)');
    budget(tardives >= 3, '$tardives intrigues tardives min_season ≥ 2 (attendu ≥ 3)');
    // Un visage du casting doit avoir deux histoires. Les Cartes Événement du
    // rôle comptent : elles sont tirées dans la carrière comme les intrigues du
    // réservoir (la bible donne à Aubert « la D2 et la mairie » **et** « la
    // tribune vétuste » : la seconde est un événement, pas une entrée de pool).
    final postRole = p['role']?.toString();
    final eventArcs = <String>[];
    arcById.forEach((id, a) {
      if (a['kind']?.toString() != 'evenement') return;
      final roles = ((a['roles'] as List?) ?? const []).map((e) => e.toString());
      if (postRole != null && roles.isNotEmpty && !roles.contains(postRole)) return;
      final posts = ((a['postulats'] as List?) ?? const []).map((e) => e.toString());
      if (posts.isNotEmpty && !posts.contains(pid)) return;
      eventArcs.add(id);
    });
    for (final ch in cast) {
      final n = [...poolArcs, ...eventArcs]
          .where((id) => (arcById[id]?['cast'] as List? ?? const []).contains(ch))
          .length;
      budget(n >= 2, '« $ch » est au casting mais porteur ou cast de $n intrigue(s) (attendu ≥ 2)');
    }
    // Étape 2 (spec variété §3.7) : réactions, manchettes (dont sur des traces), cartes portant le nom.
    final role = p['role'].toString();
    final reactions = cards.where((c) => c['kind'] == 'reaction' && (c['roles'] as List).contains(role)).length;
    budget(reactions >= 8, '$reactions réaction(s) pour le rôle $role (attendu ≥ 8)');
    final traceNames = <String>{};
    for (final arcId in poolArcs) {
      traceNames.addAll(((arcById[arcId]?['traces'] as Map?) ?? const {}).keys.map((k) => k.toString()));
    }
    final mine = unes.where((u) {
      final ps = (u['postulats'] as List?) ?? const [];
      final rs = (u['roles'] as List?) ?? const [];
      return (ps.isEmpty || ps.contains(pid)) && (rs.isEmpty || rs.contains(role));
    }).toList();
    final onTraces = mine.where((u) => readsFlag(u['when'], traceNames)).length;
    budget(mine.length >= 10 && onTraces >= 3, '${mine.length} manchette(s) dont $onTraces sur des traces du postulat (attendu ≥ 10 dont ≥ 3)');
    final named = nameCardsByRole[role] ?? 0;
    budget(named >= 25, '$named carte(s) du rôle $role portant le nom du joueur (attendu ≥ 25)');
  }

  // Flags declared but never referenced, and read-but-never-written.
  bool engineWrites(String f) => kEngineFlagPrefixes.any((p) => f.startsWith(p));
  for (final f in flags) {
    if (!flagsWritten.contains(f) && !flagsRead.contains(f) && !engineWrites(f)) {
      warnings.add('drapeau déclaré mais jamais utilisé : "$f"');
    }
  }
  for (final f in flagsRead) {
    if (!flagsWritten.contains(f) && flags.contains(f) && !engineWrites(f)) {
      warnings.add('drapeau lu mais jamais posé : "$f"');
    }
  }

  // Endings referenced by roles must exist.
  final gaugeEndings = <String>{};
  for (final role in bundle['roles'] as List) {
    for (final g in (role as Map)['gauges'] as List) {
      for (final key in ['empty', 'full']) {
        final e = (g as Map)[key];
        if (e == null) continue;
        gaugeEndings.add(e.toString());
        if (!endingIds.contains(e)) errors.add('rôle ${role['id']}: fin inconnue "$e"');
      }
    }
  }

  // Toute fin doit avoir une **porte**, et son champ `cause:` doit dire
  // laquelle. Trois portes existent, et trois seulement (`Engine._checkEndings`
  // et `_applyEffects`) :
  //   * la jauge à 0 / 100, déclarée dans roles.yaml (`cause: jauge`) ;
  //   * l'effet `end:` d'un choix, d'une variante de set-piece ou d'une étape
  //     d'arc (toute autre `cause:` — choix, chaîne, objectif, destin, âge…) ;
  //   * le moteur lui-même, en Dart : `grand_deballage` (parole ≤ −5),
  //     `jubile` (joueur de 38 ans), `en_retraite` (entraîneur de 65 ans) et
  //     `generique` (le repli de fin de carrière). Ces quatre-là ne s'écrivent
  //     pas en contenu : elles sont exemptées, `cause:` comprise.
  // Une fin sans porte est inatteignable et compte quand même au Cimetière :
  // c'est une ERREUR, pas un avertissement — le dépôt refuse une fin orpheline.
  const enginePosed = {'generique', 'grand_deballage', 'jubile', 'en_retraite'};
  final endsTargeted = <String>{};
  void collectEnds(Object? node) {
    if (node is Map) {
      final e = node['end'];
      if (e is String) endsTargeted.add(e);
      for (final v in node.values) {
        collectEnds(v);
      }
    } else if (node is List) {
      for (final v in node) {
        collectEnds(v);
      }
    }
  }

  collectEnds(bundle);
  for (final e in (bundle['endings'] as List).cast<Map<String, dynamic>>()) {
    final eid = e['id'].toString();
    if (enginePosed.contains(eid)) continue;
    final cause = e['cause']?.toString();
    final parJauge = gaugeEndings.contains(eid);
    final parEnd = endsTargeted.contains(eid);
    if (!parJauge && !parEnd) {
      errors.add('fin « $eid » sans porte : ni fin de jauge (roles.yaml), ni cible d\'un `end:`'
          '${cause == null ? '' : ' — elle se déclare pourtant « cause: $cause »'}');
      continue;
    }
    // Le champ `cause:` est lu : il doit désigner la porte qui existe.
    if (cause == 'jauge' && !parJauge) {
      errors.add('fin « $eid » : « cause: jauge » mais aucune jauge de roles.yaml ne la pose');
    } else if (cause != null && cause != 'jauge' && !parEnd) {
      errors.add('fin « $eid » : « cause: $cause » demande un `end: $eid` (carte, set-piece ou étape) ; seule une jauge la pose');
    }
  }

  stdout.writeln('Lint : ${cards.length} cartes, ${arcs.length} arcs, ${errors.length} erreurs, ${warnings.length} avertissements.');
  for (final w in warnings.take(60)) {
    stdout.writeln('  ! $w');
  }
  if (warnings.length > 60) stdout.writeln('  … (+${warnings.length - 60})');
  for (final e in errors) {
    stderr.writeln('  ✗ $e');
  }
  if (errors.isNotEmpty) exit(1);
}

String _findContentDir() {
  var dir = Directory.current;
  for (var i = 0; i < 6; i++) {
    final c = Directory('${dir.path}/content');
    if (c.existsSync()) return c.path;
    final p = dir.parent;
    if (p.path == dir.path) break;
    dir = p;
  }
  return '${Directory.current.path}/content';
}
