/// Recursive-descent parser for the `when` mini-language. Emits the AST that
/// packages/core/lib/src/condition.dart evaluates. Kept in the build tool so
/// the shipped app carries no parser.
library;

Object parseCondition(String src) {
  final tokens = _tokenize(src);
  final parser = _Parser(tokens, src);
  final ast = parser._parseOr();
  parser._expect(_TokKind.eof);
  return ast;
}

enum _TokKind { number, string, ident, op, lparen, rparen, lbracket, rbracket, comma, eof }

class _Tok {
  final _TokKind kind;
  final String text;
  final Object? value;
  const _Tok(this.kind, this.text, [this.value]);
}

List<_Tok> _tokenize(String s) {
  final toks = <_Tok>[];
  int i = 0;
  bool isIdentStart(String c) => RegExp(r'[A-Za-z_]').hasMatch(c);
  bool isIdentPart(String c) => RegExp(r'[A-Za-z0-9_.]').hasMatch(c);
  while (i < s.length) {
    final c = s[i];
    if (c == ' ' || c == '\t' || c == '\n' || c == '\r') {
      i++;
      continue;
    }
    if (c == '(') {
      toks.add(const _Tok(_TokKind.lparen, '('));
      i++;
      continue;
    }
    if (c == ')') {
      toks.add(const _Tok(_TokKind.rparen, ')'));
      i++;
      continue;
    }
    if (c == '[') {
      toks.add(const _Tok(_TokKind.lbracket, '['));
      i++;
      continue;
    }
    if (c == ']') {
      toks.add(const _Tok(_TokKind.rbracket, ']'));
      i++;
      continue;
    }
    if (c == ',') {
      toks.add(const _Tok(_TokKind.comma, ','));
      i++;
      continue;
    }
    if (c == "'" || c == '"') {
      final quote = c;
      final sb = StringBuffer();
      i++;
      while (i < s.length && s[i] != quote) {
        sb.write(s[i]);
        i++;
      }
      i++; // closing quote
      toks.add(_Tok(_TokKind.string, sb.toString(), sb.toString()));
      continue;
    }
    if (RegExp(r'[0-9]').hasMatch(c) || (c == '-' && i + 1 < s.length && RegExp(r'[0-9]').hasMatch(s[i + 1]) && (toks.isEmpty || _isOperandBoundary(toks.last)))) {
      final start = i;
      if (c == '-') i++;
      while (i < s.length && RegExp(r'[0-9.]').hasMatch(s[i])) {
        i++;
      }
      final numStr = s.substring(start, i);
      final num n = numStr.contains('.') ? double.parse(numStr) : int.parse(numStr);
      toks.add(_Tok(_TokKind.number, numStr, n));
      continue;
    }
    // Multi-char operators.
    final two = i + 1 < s.length ? s.substring(i, i + 2) : '';
    if (['&&', '||', '==', '!=', '<=', '>='].contains(two)) {
      toks.add(_Tok(_TokKind.op, two));
      i += 2;
      continue;
    }
    if (['<', '>', '!'].contains(c)) {
      toks.add(_Tok(_TokKind.op, c));
      i++;
      continue;
    }
    if (isIdentStart(c)) {
      final start = i;
      while (i < s.length && isIdentPart(s[i])) {
        i++;
      }
      final word = s.substring(start, i);
      if (word == 'true') {
        toks.add(const _Tok(_TokKind.number, 'true', true));
      } else if (word == 'false') {
        toks.add(const _Tok(_TokKind.number, 'false', false));
      } else if (word == 'in') {
        toks.add(const _Tok(_TokKind.op, 'in'));
      } else {
        toks.add(_Tok(_TokKind.ident, word));
      }
      continue;
    }
    throw FormatException('Caractère inattendu "$c" dans : $s');
  }
  toks.add(const _Tok(_TokKind.eof, ''));
  return toks;
}

bool _isOperandBoundary(_Tok t) =>
    t.kind == _TokKind.op || t.kind == _TokKind.lparen || t.kind == _TokKind.lbracket || t.kind == _TokKind.comma;

class _Parser {
  final List<_Tok> toks;
  final String src;
  int pos = 0;
  _Parser(this.toks, this.src);

  _Tok get _cur => toks[pos];
  _Tok _advance() => toks[pos++];

  void _expect(_TokKind kind) {
    if (_cur.kind != kind) {
      throw FormatException('Attendu $kind, trouvé "${_cur.text}" dans : $src');
    }
    _advance();
  }

  bool _matchOp(String op) {
    if (_cur.kind == _TokKind.op && _cur.text == op) {
      _advance();
      return true;
    }
    return false;
  }

  Object _parseOr() {
    final parts = <Object>[_parseAnd()];
    while (_matchOp('||')) {
      parts.add(_parseAnd());
    }
    return parts.length == 1 ? parts.first : ['or', ...parts];
  }

  Object _parseAnd() {
    final parts = <Object>[_parseCmp()];
    while (_matchOp('&&')) {
      parts.add(_parseCmp());
    }
    return parts.length == 1 ? parts.first : ['and', ...parts];
  }

  Object _parseCmp() {
    final left = _parseUnary();
    for (final op in ['==', '!=', '<=', '>=', '<', '>']) {
      if (_matchOp(op)) {
        final right = _parseUnary();
        return ['cmp', op, left, right];
      }
    }
    if (_matchOp('in')) {
      final list = _parseList();
      return ['in', left, list];
    }
    return left;
  }

  Object _parseUnary() {
    if (_matchOp('!')) {
      return ['not', _parseUnary()];
    }
    return _parsePrimary();
  }

  Object _parsePrimary() {
    final t = _cur;
    if (t.kind == _TokKind.lparen) {
      _advance();
      final e = _parseOr();
      _expect(_TokKind.rparen);
      return e;
    }
    if (t.kind == _TokKind.lbracket) {
      return _parseList();
    }
    if (t.kind == _TokKind.number) {
      _advance();
      return ['lit', t.value];
    }
    if (t.kind == _TokKind.string) {
      _advance();
      return ['lit', t.value];
    }
    if (t.kind == _TokKind.ident) {
      _advance();
      // Function call?
      if (_cur.kind == _TokKind.lparen) {
        _advance();
        final args = <Object>[];
        if (_cur.kind != _TokKind.rparen) {
          args.add(_parseOr());
          while (_cur.kind == _TokKind.comma) {
            _advance();
            args.add(_parseOr());
          }
        }
        _expect(_TokKind.rparen);
        return ['call', t.text, args];
      }
      return ['path', t.text];
    }
    throw FormatException('Expression inattendue "${t.text}" dans : $src');
  }

  List<Object> _parseList() {
    _expect(_TokKind.lbracket);
    final items = <Object>[];
    if (_cur.kind != _TokKind.rbracket) {
      items.add(_parseOr());
      while (_cur.kind == _TokKind.comma) {
        _advance();
        items.add(_parseOr());
      }
    }
    _expect(_TokKind.rbracket);
    return items;
  }
}
