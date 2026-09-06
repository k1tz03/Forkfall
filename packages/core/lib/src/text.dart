/// Minimal ICU-subset text formatter: `{var}` interpolation and
/// `{pg, select, f{...} other{...}}` gender selection for the protagonist
/// (`pg`) and the current speaker (`sg`). French is gendered, so this is
/// needed even for a French-only MVP (docs/brainstorm section 9.6).
///
/// Placeholders du nom, de la saison et de la Une (spec variété §1.6, §1.8) :
/// `{prenom} {nom} {NOM} {initiales} {toi} {Toi} {numero} {rang} {pts} {annee}
/// {saison} {objectif} {division} {CLUB} {VILLE} {age}` en plus des entités
/// nommées (`{club}`, `{ville}`, `{rival}`, `{coach}`, `{president}`…).
/// `{toi}` est résolu par l'appelant (adresse du locuteur selon le rôle et la
/// relation) et interpolé récursivement (profondeur ≤ 2) ; défaut « coach »
/// pour l'entraîneur, « {prenom} » pour le joueur.
library;

import 'naming.dart';
import 'state.dart';
import 'world.dart';

/// Placeholders simples que le moteur garantit (le lint refuse les autres dans
/// les Unes, le journal et les épitaphes ; les entités nommées s'y ajoutent).
const Set<String> kKnownPlaceholders = {
  'joueur', 'protagoniste', 'prenom', 'nom', 'NOM', 'initiales', 'toi', 'Toi', 'numero',
  'rang', 'pts', 'annee', 'saison', 'objectif', 'division', 'CLUB', 'VILLE', 'age',
  'club', 'clubShort', 'rival', 'president', 'capitaine', 'ville', 'coach', 'camille_metier', 'passe_titre', 'fil_rouge',
  // Fournis par le moteur au moment de l'écriture (Une, journal, fin).
  'tenu', 'TENU', 'perso', 'perso_tic', 'objectif_titre', 'fin_titre',
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
    'annee': '${s.year}',
    'saison': '${s.season + 1}',
    'objectif': objectiveLabelFr(s.objectiveTarget),
    'division': 'Division ${s.world.division}',
    'age': '${s.age}',
    ...e.named,
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
    out.write(_resolveTag(inner, vars, pg, sg));
    i = end + 1;
  }
  return out.toString();
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
