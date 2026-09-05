/// Minimal ICU-subset text formatter: `{var}` interpolation and
/// `{pg, select, f{...} other{...}}` gender selection for the protagonist
/// (`pg`) and the current speaker (`sg`). French is gendered, so this is
/// needed even for a French-only MVP (docs/brainstorm section 9.6).
library;

import 'state.dart';

String formatText(String template, GameState s, {String speakerGenre = 'm'}) {
  final vars = <String, String>{
    'joueur': s.entities.protagonist,
    'protagoniste': s.entities.protagonist,
    ...s.entities.named,
  };
  return _render(template, vars, s.entities.genre, speakerGenre);
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
    final body = rest.substring('select'.length).trim();
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
