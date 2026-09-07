/// Minimal ICU-subset text formatter: `{var}` interpolation and
/// `{pg, select, f{...} other{...}}` gender selection for the protagonist
/// (`pg`) and the current speaker (`sg`). French is gendered, so this is
/// needed even for a French-only MVP (docs/brainstorm section 9.6).
///
/// Placeholders du nom, de la saison et de la Une (spec variété §1.6, §1.8) :
/// `{prenom} {nom} {NOM} {initiales} {toi} {Toi} {numero} {rang} {pts} {annee}
/// {saison} {objectif} {division} {CLUB} {VILLE} {age} {journee}` en plus des entités
/// nommées (`{club}`, `{ville}`, `{rival}`, `{coach}`, `{president}`…).
/// `{toi}` est résolu par l'appelant (adresse du locuteur selon le rôle et la
/// relation) et interpolé récursivement (profondeur ≤ 2) ; défaut « coach »
/// pour l'entraîneur, « {prenom} » pour le joueur. Un « de » ou « que » qui
/// précède un placeholder à voyelle est élidé (« d'Ethan », « qu'Anne »).
library;

import 'naming.dart';
import 'standings.dart';
import 'state.dart';
import 'world.dart';

/// Placeholders simples que le moteur garantit (le lint refuse les autres dans
/// les Unes, le journal et les épitaphes ; les entités nommées s'y ajoutent).
const Set<String> kKnownPlaceholders = {
  'joueur', 'protagoniste', 'prenom', 'nom', 'NOM', 'initiales', 'toi', 'Toi', 'numero',
  'rang', 'pts', 'journee', 'annee', 'saison', 'objectif', 'division', 'CLUB', 'VILLE', 'age',
  'club', 'clubShort', 'rival', 'president', 'capitaine', 'ville', 'coach', 'camille_metier', 'passe_titre', 'fil_rouge',
  // Fournis par le moteur au moment de l'écriture (Une, journal, fin).
  'tenu', 'TENU', 'perso', 'perso_tic', 'objectif_titre', 'fin_titre',
  // Set-pieces (spec variété §1.12, §2.7) : fournis par le beat qui les sert.
  'patron', 'objectif_min', 'adversite', 'vestiaire_mot', 'tour', 'minute', 'score', 'gm_score',
};

/// Placeholders qui portent le nom du joueur (métrique « nom », lint des libellés).
const Set<String> kNamePlaceholders = {'prenom', 'nom', 'NOM', 'initiales', 'toi', 'Toi', 'joueur', 'protagoniste'};

String formatText(
  String template,
  GameState s, {
  String speakerGenre = 'm',
  String? speakerId,
  String? adresse,
  Map<String, String> extra = const {},
}) {
  final e = s.entities;
  final vars = <String, String>{
    'joueur': e.protagonist,
    'protagoniste': e.protagonist,
    'prenom': e.prenom,
    'nom': e.nom,
    'NOM': upperName(e.nom),
    'initiales': initials(e.prenom, e.nom),
    'numero': e.named['numero'] ?? '',
    'rang': '${s.world.standingRank}',
    'pts': '${s.world.pts}',
    // La journée courante du championnat : six blocs de six journées.
    // Une seule définition de la journée, partout (`standings.dart`).
    'journee': '${journeeDeSaison(s.world.blocks)}',
    'annee': '${s.year}',
    'saison': '${s.season + 1}',
    'objectif': objectiveLabelFr(s.objectiveTarget),
    'division': 'Division ${s.world.division}',
    'age': '${s.age}',
    ...e.named,
    // `{age_<id>}` : l'âge d'un personnage (spec variété §1.10) — « J'ai
    // {age_vecchio} ans » se met à jour tout seul d'une saison à l'autre.
    for (final c in s.chars.entries) 'age_${c.key}': '${c.value.age}',
    'CLUB': (e.named['club'] ?? '').toUpperCase(),
    'VILLE': (e.named['ville'] ?? '').toUpperCase(),
    ...extra,
  };
  // `{toi}` : l'adresse du locuteur, elle-même un gabarit (« mon {prenom} »).
  final tpl = adresse ?? (s.role == 'joueur' ? '{prenom}' : 'coach');
  final toi = _render(tpl, vars, e.genre, speakerGenre);
  vars['toi'] = toi;
  vars['Toi'] = toi.isEmpty ? '' : toi[0].toUpperCase() + toi.substring(1);
  return _render(template, vars, e.genre, speakerGenre);
}

/// Les noms de placeholders simples cités par un gabarit (hors `select`).
Set<String> placeholdersOf(String template) {
  final out = <String>{};
  int i = 0;
  while (i < template.length) {
    if (template[i] != '{') {
      i++;
      continue;
    }
    final end = _matchBrace(template, i);
    if (end < 0) break;
    final inner = template.substring(i + 1, end);
    if (!inner.contains(',')) {
      out.add(inner.trim());
    } else {
      // Les branches d'un select peuvent contenir des placeholders.
      final comma = inner.indexOf(',');
      final rest = inner.substring(comma + 1).trim();
      if (rest.startsWith('select')) {
        for (final v in _parseSelect(rest.substring('select'.length).trim()).values) {
          out.addAll(placeholdersOf(v));
        }
      }
    }
    i = end + 1;
  }
  return out;
}

String _render(String tpl, Map<String, String> vars, String pg, String sg) {
  final out = StringBuffer();
  int i = 0;
  while (i < tpl.length) {
    final ch = tpl[i];
    if (ch != '{') {
      out.write(ch);
      i++;
      continue;
    }
    // Find matching close brace (handles one level of nesting).
    final end = _matchBrace(tpl, i);
    if (end < 0) {
      out.write(ch);
      i++;
      continue;
    }
    final inner = tpl.substring(i + 1, end);
    final value = _resolveTag(inner, vars, pg, sg);
    if (!inner.contains(',')) _elideBefore(out, value);
    out.write(value);
    i = end + 1;
  }
  return out.toString();
}

const String _vowels = 'aeiouyàâäéèêëîïôöùûüAEIOUYÀÂÄÉÈÊËÎÏÔÖÙÛÜ';

/// Élision devant un placeholder à voyelle (« la valise de {nom} » → « la
/// valise d'Aubry », « que {prenom} » → « qu'Ethan ») : le « de » / « que »
/// qui précède immédiatement la valeur devient « d' » / « qu' ». Le nom
/// saisi par le joueur et les villes peuvent commencer par une voyelle ;
/// aucun gabarit n'a à le prévoir. Le h n'est pas élidé (aspiré ou muet, on
/// ne sait pas).
void _elideBefore(StringBuffer out, String value) {
  if (value.isEmpty || !_vowels.contains(value[0])) return;
  final tail = out.toString();
  for (final w in const ['de', 'De', 'que', 'Que']) {
    final head = '$w ';
    if (!tail.endsWith(head)) continue;
    final before = tail.length - head.length;
    // Un mot entier : début de chaîne ou séparateur devant (« de », « (de »…).
    if (before > 0 && !' «(\'’-\n'.contains(tail[before - 1])) continue;
    final elided = '${w.substring(0, w.length - 1)}\'';
    out
      ..clear()
      ..write(tail.substring(0, before))
      ..write(elided);
    return;
  }
}

int _matchBrace(String s, int open) {
  int depth = 0;
  for (int i = open; i < s.length; i++) {
    if (s[i] == '{') depth++;
    if (s[i] == '}') {
      depth--;
      if (depth == 0) return i;
    }
  }
  return -1;
}

String _resolveTag(String inner, Map<String, String> vars, String pg, String sg) {
  final comma = inner.indexOf(',');
  if (comma < 0) {
    // Simple variable.
    final key = inner.trim();
    return vars[key] ?? '{$key}';
  }
  final name = inner.substring(0, comma).trim();
  final rest = inner.substring(comma + 1).trim();
  if (rest.startsWith('select')) {
    // Les deux formes ICU sont admises : `{pg, select, f{e} other{}}` et `{pg,select,f{e}other{}}`.
    var body = rest.substring('select'.length).trim();
    if (body.startsWith(',')) body = body.substring(1).trim();
    final options = _parseSelect(body);
    final genre = name == 'pg' ? pg : (name == 'sg' ? sg : 'other');
    final chosen = options[genre] ?? options['other'] ?? '';
    return _render(chosen, vars, pg, sg);
  }
  // Unknown structured tag: emit raw.
  return '{$inner}';
}

Map<String, String> _parseSelect(String body) {
  final result = <String, String>{};
  int i = 0;
  while (i < body.length) {
    while (i < body.length && (body[i] == ' ' || body[i] == '\n')) {
      i++;
    }
    if (i >= body.length) break;
    final brace = body.indexOf('{', i);
    if (brace < 0) break;
    final key = body.substring(i, brace).trim();
    final end = _matchBrace(body, brace);
    if (end < 0) break;
    result[key] = body.substring(brace + 1, end);
    i = end + 1;
  }
  return result;
}
