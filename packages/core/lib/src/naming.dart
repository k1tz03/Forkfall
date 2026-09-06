/// Validation et normalisation du nom du joueur (spec variété §1.8). Pur :
/// aucune dépendance, aucun état ; le nom est cosmétique et n'entre jamais dans
/// un tirage. Testé par N2-N4.
library;

/// Particules gardées en minuscule quand elles ne sont pas le premier mot.
const Set<String> kParticles = {'de', 'da', 'du', 'del', 'van', 'von', 'le', 'la', 'des', 'di', 'der', 'den', 'ter'};

final RegExp _allowed = RegExp(r"[\p{L}' \-]", unicode: true);
final RegExp _spaces = RegExp(r'\s+');

/// Normalise un prénom ou un nom saisi : caractères hors lettres / espace /
/// apostrophe / tiret retirés (`{`, `}`, chiffres, emoji…), espaces fusionnés,
/// coupure à [max] caractères, première lettre de chaque mot en capitale (le
/// reste conservé), particules en minuscule sauf en tête. Chaîne vide si rien
/// ne reste (l'appelant tire alors un nom).
String normalizeName(String raw, {int max = 16}) {
  final kept = StringBuffer();
  for (final r in raw.runes) {
    final ch = String.fromCharCode(r);
    if (_allowed.hasMatch(ch)) kept.write(ch);
  }
  var t = kept.toString().replaceAll(_spaces, ' ').trim();
  if (t.isEmpty) return '';
  if (t.length > max) t = t.substring(0, max).trim();
  final words = t.split(' ');
  final out = <String>[];
  for (var i = 0; i < words.length; i++) {
    final w = words[i];
    if (w.isEmpty) continue;
    if (i > 0 && kParticles.contains(w.toLowerCase())) {
      out.add(w.toLowerCase());
      continue;
    }
    out.add(_capitalizeSegments(w));
  }
  return out.join(' ');
}

/// Capitale sur la première lettre de chaque segment séparé par un tiret ou
/// une apostrophe (« jean-luc » → « Jean-Luc », « d'angelo » → « D'Angelo »).
String _capitalizeSegments(String w) {
  final sb = StringBuffer();
  bool start = true;
  for (final r in w.runes) {
    final ch = String.fromCharCode(r);
    if (ch == '-' || ch == "'") {
      sb.write(ch);
      start = true;
      continue;
    }
    sb.write(start ? ch.toUpperCase() : ch);
    start = false;
  }
  return sb.toString();
}

/// `{NOM}` : capitales avec accents conservés (« Bréhaut » → « BRÉHAUT »).
String upperName(String name) => name.toUpperCase();

/// `{initiales}` : première lettre du prénom et du nom, en capitales (« LN »).
String initials(String prenom, String nom) {
  String first(String s) {
    final t = s.trim();
    return t.isEmpty ? '' : String.fromCharCode(t.runes.first).toUpperCase();
  }

  return '${first(prenom)}${first(nom)}';
}

/// Retire les accents usuels pour comparer avec la liste noire.
String foldAccents(String s) {
  const from = 'àâäáãåçéèêëíìîïñóòôöõúùûüýÿœæ';
  const to = 'aaaaaaceeeeiiiinooooouuuuyyoa';
  final sb = StringBuffer();
  for (final r in s.toLowerCase().runes) {
    final ch = String.fromCharCode(r);
    final i = from.indexOf(ch);
    sb.write(i < 0 ? ch : to[i]);
  }
  return sb.toString();
}

/// Vrai si un mot du nom (séparé par espace, tiret, apostrophe) figure dans la
/// liste noire, sans tenir compte de la casse ni des accents.
bool isBlacklisted(String name, Iterable<String> blacklist) {
  final words = foldAccents(name).split(RegExp(r"[ \-']+")).where((w) => w.isNotEmpty).toSet();
  if (words.isEmpty) return false;
  final whole = words.join(' ');
  for (final b in blacklist) {
    final f = foldAccents(b.trim());
    if (f.isEmpty) continue;
    if (words.contains(f) || whole == f) return true;
  }
  return false;
}
