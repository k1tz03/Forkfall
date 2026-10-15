/// LES LIVRES — le bundle de l'aperçu web découpé en un bundle **commun** (ce que
/// l'accueil, la ville et tous les livres lisent) et un bundle **par livre** (ce
/// que ses carrières peuvent servir ou voir et que tous les livres ne partagent
/// pas). La page ne décompresse que le commun au démarrage ; le livre le rejoint
/// quand une carrière commence (packages/tools/web/demarrage.js), dans l'ordre
/// exact du bundle entier.
///
/// LE CONTRAT : une carrière jouée sur (commun + livre) est identique à la même
/// carrière jouée sur le bundle entier — packages/core/test/livres_test.dart le
/// vérifie, livre par livre. Un item ne quitte le commun que si l'on sait montrer
/// qu'un livre ne peut ni le servir, ni le voir ; dans le doute, il reste commun.
///
/// Deux besoins, calculés pour chaque item (un ensemble de livres) :
///   · A (servir) : les livres où l'item peut être servi, armé, choisi. Il naît
///     d'une porte (la condition qui fait tirer l'item tout seul : le `when` d'une
///     carte du sac, d'une Nouvelle, d'un événement, d'une Une, d'une variante de
///     set-piece ; le `si` d'un lot de la ville), d'une racine (le postulat du
///     livre ; le commun et le moteur, qui valent pour tous) et se propage le long
///     des références (ce qu'un item servi peut programmer, armer, réveiller). Une
///     porte exige un drapeau que seul le postulat du livre pose (`histoire_hN`,
///     jamais posé par un effet), le postulat lui-même, ou un rôle que les
///     carrières du livre ne peuvent pas tenir (roles.yaml `transitions`, `role:`).
///   · P (être là) : A, plus ce que le moteur cherche ou PARCOURT sans filtrer
///     d'abord — la carte qu'une carte programme (qu'elle joue le rôle ou non), les
///     Nouvelles datées (`countLostNouvelles`), le premier arc qui déclare une
///     trace (`tracesIndex`), les Unes qui prennent une carte en photo
///     (`_unePhotos`).
/// Un item dont P couvre tous les livres va au commun ; sinon, dans chacun des
/// livres de P (un item de deux livres est dans les deux).
///
/// Les listes « stables » (les variantes de set-piece, dont le moteur garde
/// l'index ; les paroles de la ville, dont la sauvegarde garde l'index) gardent
/// leur longueur : un item absent y est remplacé par un bouche-trou inerte.
library;

/// Les listes compactées : la fusion remet leurs items dans l'ordre du bundle
/// entier (le moteur et la ville tirent dans cet ordre).
const List<String> kListesLivre = [
  'cards',
  'arcs',
  'unes',
  'ville.scenes',
  'ville.cinematiques',
  'ville.conversations',
  'ville.missions',
  'ville.lieux_variantes',
];

/// Les listes stables : `setpieces.<beat>` et les paroles.
List<String> listesStables(Map<String, dynamic> bundle) => [
      for (final b in ((bundle['setpieces'] as Map?) ?? const {}).keys) 'setpieces.$b',
      if ((bundle['ville'] as Map?)?['paroles'] is List) 'ville.paroles',
    ];

/// Le bouche-trou d'une liste stable : une variante d'aucun rôle (le moteur la
/// saute), une parole de personne (la ville ne la tire jamais).
Map<String, dynamic> boucheTrou(String liste) => liste.startsWith('setpieces.')
    ? {
        'roles': ['-'],
        'text': ''
      }
    : {'qui': '-', 'sujet': '-', 'texte': ''};

/// Les ids que le moteur nomme en dur (draw/director.dart).
const List<String> kRacinesMoteur = ['tr.nouvelles_du_passe', 'co.script.generique', 'co.deballage'];

/// Les drapeaux que le moteur pose lui-même (engine.dart) : jamais une porte.
final RegExp _drapeauxMoteur = RegExp(r'^(camille_|rep_|role_was_|bilan_|descente$)');

/// Les tables du moteur et de la ville : un id n'est unique que dans la sienne.
/// Les missions, les scènes de la semaine et les effets des gens partagent
/// `Content.missions` (la dernière déclarée gagne).
String _table(String liste) => switch (liste) {
      'ville.scenes' || 'ville.missions' => 'missions',
      _ => liste,
    };

class DecoupeLivres {
  /// Le bundle commun, avec `__livres` : la position de chacun de ses items dans
  /// le bundle entier, de quoi refaire l'ordre à la fusion.
  final Map<String, dynamic> commun;

  /// id du postulat → `{livre, hash, listes: {liste: {pos: [plages], items: [...]}}}`.
  final Map<String, Map<String, dynamic>> livres;

  /// Le bilan : liste → part (`commun` ou id du postulat) → [items, octets].
  final Map<String, Map<String, List<int>>> bilan;

  /// Pourquoi des items sont restés au commun : raison → [items, octets].
  final Map<String, List<int>> raisons;

  DecoupeLivres(this.commun, this.livres, this.bilan, this.raisons);
}

class _Item {
  final String liste;
  final int pos;
  final Map<String, dynamic> obj;
  final String? id;
  final bool moteur; // domaine du moteur (cartes, arcs, Unes, set-pieces) ou de la ville
  final Set<String> roles; // les rôles qui peuvent le servir ; vide : tous
  final Set<String> a = {};
  final Set<String> p = {};
  String? raison;
  _Item(this.liste, this.pos, this.obj, this.id, this.moteur, this.roles);
}

/// Découpe [bundle] (le bundle entier, tel qu'écrit dans content.json).
DecoupeLivres decouperParLivre(Map<String, dynamic> bundle) {
  final posts = ((bundle['postulats'] as List?) ?? const []).cast<Map<String, dynamic>>().toList()
    ..sort((a, b) => (a['index'] as num).compareTo(b['index'] as num));
  final idsLivres = [for (final p in posts) p['id'] as String];
  final tous = idsLivres.toSet();
  final roleDef = {
    for (final r in ((bundle['roles'] as List?) ?? const []).cast<Map<String, dynamic>>()) r['id'] as String: r,
  };

  // ── 1. Les portes de livre.
  // Les drapeaux de livre : posés au départ par UN postulat, jamais par un effet.
  final poses = <String>{};
  _drapeauxPosesOuRetires(bundle, poses);
  final parDrapeau = <String, List<String>>{};
  for (final p in posts) {
    for (final f in (p['flags'] as List? ?? const [])) {
      parDrapeau.putIfAbsent(f.toString(), () => []).add(p['id'] as String);
    }
  }
  final drapeauLivre = <String, String>{};
  parDrapeau.forEach((f, ps) {
    if (ps.length == 1 && !poses.contains(f) && !_drapeauxMoteur.hasMatch(f)) drapeauLivre[f] = ps.single;
  });
  // Les rôles qu'une carrière de chaque livre peut tenir : le sien, puis les
  // transitions de roles.yaml et les effets `role:` de ce qui joue un rôle atteint.
  final effetsRole = <(Set<String>, String)>[];
  void chercherRole(Object? x, Set<String> rolesItem) {
    if (x is Map) {
      if (x['role'] is String && roleDef.containsKey(x['role'])) effetsRole.add((rolesItem, x['role'] as String));
      for (final v in x.values) {
        chercherRole(v, rolesItem);
      }
    } else if (x is List) {
      for (final v in x) {
        chercherRole(v, rolesItem);
      }
    }
  }

  for (final k in const ['cards', 'arcs', 'unes', 'setpieces', 'ville']) {
    void parItem(Object? x) {
      if (x is List) {
        for (final o in x) {
          if (o is Map) {
            final rs = (o['roles'] as List? ?? const []).map((e) => e.toString()).toSet();
            // un `role:` d'item ne vaut que dans ses effets : on fouille ses choix et ses étapes
            for (final e in o.entries) {
              if (e.key != 'roles') chercherRole(e.value, rs);
            }
          }
        }
      } else if (x is Map) {
        for (final v in x.values) {
          parItem(v);
        }
      }
    }

    parItem(bundle[k]);
  }
  final rolesDuLivre = <String, Set<String>>{};
  for (final p in posts) {
    final r = <String>{p['role'] as String};
    var change = true;
    while (change) {
      change = false;
      for (final x in List.of(r)) {
        for (final t in ((roleDef[x]?['transitions'] as List?) ?? const []).cast<Map<dynamic, dynamic>>()) {
          if (t['to'] is String && r.add(t['to'] as String)) change = true;
        }
      }
      for (final (rs, vers) in effetsRole) {
        if ((rs.isEmpty || rs.any(r.contains)) && r.add(vers)) change = true;
      }
    }
    rolesDuLivre[p['id'] as String] = r;
  }
  Set<String> livresDuRole(Set<String> rs) => rs.isEmpty
      ? tous
      : {
          for (final l in idsLivres)
            if (rolesDuLivre[l]!.any(rs.contains)) l
        };

  // Les livres où une condition compilée (`when`, `if`) peut être vraie.
  Set<String> livresDe(Object? n) {
    if (n is! List || n.isEmpty) return tous;
    switch (n[0]) {
      case 'and':
        var r = tous;
        for (var i = 1; i < n.length; i++) {
          r = r.intersection(livresDe(n[i]));
        }
        return r;
      case 'or':
        final r = <String>{};
        for (var i = 1; i < n.length; i++) {
          r.addAll(livresDe(n[i]));
        }
        return r;
      case 'call':
        if (n.length == 3 && n[1] == 'flag' && n[2] is List && (n[2] as List).length == 1) {
          final arg = (n[2] as List).single;
          if (arg is List && arg.length == 2 && arg[0] == 'lit' && drapeauLivre[arg[1]] != null) return {drapeauLivre[arg[1]]!};
        }
        return tous;
      case 'path':
        final p = n.length > 1 ? n[1] : null;
        if (p is String && p.startsWith('flags.') && drapeauLivre[p.substring(6)] != null) return {drapeauLivre[p.substring(6)]!};
        return tous;
      case 'cmp':
        if (n.length == 4 && n[1] == '==') {
          String? lit(Object? x, Object? y) => (x is List &&
                  x.length == 2 &&
                  x[0] == 'path' &&
                  x[1] == 'postulat' &&
                  y is List &&
                  y.length == 2 &&
                  y[0] == 'lit' &&
                  tous.contains(y[1]))
              ? y[1] as String
              : null;
          final l = lit(n[2], n[3]) ?? lit(n[3], n[2]);
          if (l != null) return {l};
        }
        return tous;
      case 'in':
        if (n.length == 3 &&
            n[1] is List &&
            (n[1] as List).length == 2 &&
            (n[1] as List)[0] == 'path' &&
            (n[1] as List)[1] == 'postulat' &&
            n[2] is List) {
          final out = <String>{};
          for (final y in n[2] as List) {
            if (y is! List || y.length != 2 || y[0] != 'lit' || !tous.contains(y[1])) return tous;
            out.add(y[1] as String);
          }
          return out;
        }
        return tous;
    }
    return tous;
  }

  // La grammaire de la ville (ville.js `siVrai`) : ET seulement ; `flag(x)` sans `!`.
  final reDrapeau = RegExp(r'^flag\(\s*([A-Za-z0-9_.]+)\s*\)$');
  Set<String> livresSi(Object? si) {
    var r = tous;
    if (si == null) return r;
    for (final t in si.toString().split('&&')) {
      final m = reDrapeau.firstMatch(t.trim().replaceAll(RegExp('[\'"]'), ''));
      if (m != null && drapeauLivre[m.group(1)] != null) r = r.intersection({drapeauLivre[m.group(1)]!});
    }
    return r;
  }

  // ── 2. Les items des listes découpées.
  final items = <_Item>[];
  final parId = <String, List<_Item>>{};
  final stables = listesStables(bundle);
  for (final liste in [...kListesLivre, ...stables]) {
    final l = _lire(bundle, liste);
    if (l == null) continue;
    for (var i = 0; i < l.length; i++) {
      final o = (l[i] as Map).cast<String, dynamic>();
      final id = o['id'] is String ? o['id'] as String : null;
      final rs = (o['roles'] as List? ?? const []).map((e) => e.toString()).toSet();
      final it = _Item(liste, i, o, id, !liste.startsWith('ville.'), rs);
      items.add(it);
      if (id != null) parId.putIfAbsent(id, () => []).add(it);
    }
  }
  final ids = parId.keys.toSet();

  // ── 3. Le besoin A : portes, racines, puis propagation le long des références.
  final file = <_Item>[];
  void servir(_Item it, Set<String> l, String raison) {
    var neuf = false;
    for (final b in l) {
      if (it.a.add(b)) neuf = true;
    }
    if (neuf) {
      if (it.a.length == tous.length) it.raison ??= raison;
      file.add(it);
    }
  }

  // Servir une cible : là où la source sert, où la condition de l'arête tient, et
  // où la cible joue un rôle que le livre peut tenir (aucun chemin du moteur ne
  // sert une carte, n'arme un arc, hors de son rôle).
  void servirCible(_Item t, Set<String> l, String raison) => servir(t, t.moteur ? l.intersection(livresDuRole(t.roles)) : l, raison);

  void servirId(String id, Set<String> l, String raison, {required bool versMoteur, required bool versVille}) {
    for (final it in parId[id] ?? const <_Item>[]) {
      if (it.moteur ? versMoteur : versVille) servirCible(it, l, raison);
    }
  }

  // un id porté par deux items d'une même table (que le moteur ou la ville range
  // par id) : on ne sait pas lequel gagne, les deux restent communs
  final parTable = <String, List<_Item>>{};
  for (final it in items) {
    if (it.id != null) parTable.putIfAbsent('${_table(it.liste)}\u0000${it.id}', () => []).add(it);
  }
  for (final l in parTable.values) {
    if (l.length > 1) {
      for (final it in l) {
        it.p.addAll(tous);
        servir(it, tous, 'id en double');
      }
    }
  }
  // les portes : la condition qui fait tirer l'item tout seul, dans son rôle
  for (final it in items) {
    final o = it.obj;
    final roleOk = livresDuRole(it.roles);
    switch (it.liste) {
      case 'cards':
        if (o['kind'] == 'nouvelle' || (o['kind'] == 'routine' && o['pool'] != false)) {
          servir(it, livresDe(o['when']).intersection(roleOk), 'sac ou Nouvelle sans porte de livre');
        }
      case 'arcs':
        if (o['kind'] == 'evenement' || o['every_season'] == true) {
          servir(it, livresDe(o['when']).intersection(roleOk), 'événement ou rituel sans porte de livre');
        } else if (o['kind'] == 'serie') {
          final ps = (o['postulats'] as List? ?? const []).map((e) => e.toString()).toSet();
          servir(it, (ps.isEmpty ? tous : ps.intersection(tous)).intersection(livresDe(o['when'])).intersection(roleOk), 'série sans porte de livre');
        }
      case 'unes':
        final ps = (o['postulats'] as List? ?? const []).map((e) => e.toString()).toSet();
        servir(it, (ps.isEmpty ? tous : ps.intersection(tous)).intersection(livresDe(o['when'])).intersection(roleOk), 'Une sans porte de livre');
      default:
        if (it.liste.startsWith('setpieces.')) {
          servir(it, livresDe(o['when']).intersection(roleOk), 'set-piece sans porte de livre');
        } else {
          servir(it, livresSi(o['si']).intersection(roleOk), 'lot de la ville sans porte de livre');
        }
    }
  }
  // les racines du moteur
  for (final id in kRacinesMoteur) {
    servirId(id, tous, 'nommé par le moteur', versMoteur: true, versVille: false);
  }
  // le commun du moteur : ce qu'il référence peut servir partout (les alarmes et
  // les paliers de relation filtrent par leurs conditions)
  const sectionsListes = {'cards', 'arcs', 'unes', 'setpieces', 'postulats', 'ville'};
  for (final k in bundle.keys) {
    if (sectionsListes.contains(k)) continue;
    if (k == 'alarms') {
      ((bundle['alarms'] as Map?) ?? const {}).forEach((role, parCle) {
        (parCle as Map).forEach((cle, entrees) {
          for (final e in (entrees as List).cast<Map<dynamic, dynamic>>()) {
            for (final it in parId[e['card']] ?? const <_Item>[]) {
              if (it.moteur) servirCible(it, livresDe(e['when']).intersection(livresDe(it.obj['when'])), 'alarme commune');
            }
          }
        });
      });
      continue;
    }
    if (k == 'characters') {
      for (final ch in ((bundle['characters'] as List?) ?? const []).cast<Map<dynamic, dynamic>>()) {
        final copie = Map<String, dynamic>.of(ch.cast<String, dynamic>());
        final onRel = copie.remove('on_relation');
        if (onRel is Map) {
          for (final vs in onRel.values) {
            final l = (vs as List).cast<Map<dynamic, dynamic>>();
            for (var i = 0; i < l.length; i++) {
              // la dernière variante est le secours : elle part sans condition
              servirId(l[i]['id'] as String, i == l.length - 1 ? tous : livresDe(l[i]['if']), 'palier de relation',
                  versMoteur: true, versVille: false);
            }
          }
        }
        for (final id in _references(copie, ids)) {
          servirId(id, tous, 'personnage', versMoteur: true, versVille: false);
        }
      }
      continue;
    }
    for (final id in _references(bundle[k], ids)) {
      servirId(id, tous, 'commun : $k', versMoteur: true, versVille: false);
    }
  }
  // le commun de la ville : ce qu'il nomme parmi les lots de la ville sert partout ;
  // il ne sert aucune carte (la ville lit l'état du moteur, elle ne tire rien)
  final ville = (bundle['ville'] as Map?)?.cast<String, dynamic>() ?? const <String, dynamic>{};
  final villeDecoupee = {
    for (final l in [...kListesLivre, ...stables])
      if (l.startsWith('ville.')) l.substring(6)
  };
  for (final k in ville.keys) {
    if (villeDecoupee.contains(k)) continue;
    for (final id in _references(ville[k], ids)) {
      servirId(id, tous, 'commun de la ville : $k', versMoteur: false, versVille: true);
    }
  }
  // chaque postulat : son livre
  for (final p in posts) {
    for (final id in _references(p, ids)) {
      servirId(id, {p['id'] as String}, 'postulat', versMoteur: true, versVille: true);
    }
  }
  // les arêtes : ce qu'un item servi peut servir (et chercher) à son tour
  final aretes = <_Item, List<(_Item, Set<String>)>>{};
  for (final it in items) {
    final out = <(String, Set<String>)>[];
    _aretes(it, ids, livresDe, tous, roleDef.keys.toList(), parId, out);
    final l = <(_Item, Set<String>)>[];
    for (final (id, porte) in out) {
      for (final t in parId[id] ?? const <_Item>[]) {
        if (identical(t, it)) continue;
        // la ville ne sert aucune carte : un lot de la ville ne nomme une carte, un arc,
        // que pour la reconnaître (« avant la carte… », `arc(…)` dans un `si`)
        if (!it.moteur && t.moteur) continue;
        l.add((t, porte));
      }
    }
    if (l.isNotEmpty) aretes[it] = l;
  }
  while (file.isNotEmpty) {
    final it = file.removeLast();
    for (final (t, porte) in aretes[it] ?? const <(_Item, Set<String>)>[]) {
      final l = it.a.intersection(porte);
      // la cible est cherchée (programmée, réveillée, lue) avant que son rôle compte
      t.p.addAll(l);
      servirCible(t, l, 'servi par un item commun');
    }
  }

  // ── 4. Le besoin P : A, plus les listes que le moteur parcourt sans filtrer.
  for (final it in items) {
    it.p.addAll(it.a);
    // une Nouvelle datée est comptée perdue par tout livre qui tient son rôle (countLostNouvelles)
    if (it.liste == 'cards' && it.obj['kind'] == 'nouvelle' && it.obj['year'] != null) {
      final l = livresDuRole(it.roles);
      if (!it.p.containsAll(l)) {
        it.p.addAll(l);
        if (it.p.length == tous.length) it.raison = 'Nouvelle datée (comptée perdue partout)';
      }
    }
  }
  // la trace : le premier arc (ordre des ids) qui la déclare écrit sa ligne partout où on la pose
  final premierArc = <String, _Item>{};
  for (final it in items) {
    if (it.liste != 'arcs') continue;
    for (final f in ((it.obj['traces'] as Map?) ?? const {}).keys) {
      final d = premierArc[f];
      if (d == null || it.id!.compareTo(d.id!) < 0) premierArc[f as String] = it;
    }
  }
  void present(_Item it, Set<String> l, String raison) {
    if (it.p.containsAll(l)) return;
    it.p.addAll(l);
    if (it.p.length == tous.length) it.raison = raison;
  }

  for (final it in items) {
    final fs = <String>{};
    _drapeauxPosesOuRetires(it.obj, fs);
    for (final f in fs) {
      final o = premierArc[f];
      if (o != null && !identical(o, it)) present(o, it.a, 'premier arc d\'une trace posée ailleurs');
    }
  }
  final posesCommun = <String>{};
  for (final k in bundle.keys) {
    if (k == 'cards' || k == 'arcs' || k == 'unes' || k == 'setpieces') continue;
    if (k == 'ville') {
      for (final vk in ville.keys) {
        if (!villeDecoupee.contains(vk)) _drapeauxPosesOuRetires(ville[vk], posesCommun);
      }
      continue;
    }
    _drapeauxPosesOuRetires(bundle[k], posesCommun);
  }
  for (final f in posesCommun) {
    final o = premierArc[f];
    if (o != null) present(o, tous, 'premier arc d\'une trace que le commun pose');
  }
  // la Une qui prend une carte en photo garde sa réponse partout où la carte sert
  for (final it in items) {
    if (it.liste != 'unes' || it.obj['photo'] is! String) continue;
    for (final t in parId[it.obj['photo']] ?? const <_Item>[]) {
      if (t.moteur) present(it, t.a, 'Une dont la photo sert partout');
    }
  }

  // ── 5. Le partage.
  final commun = _copieProfonde(bundle) as Map<String, dynamic>;
  final positions = <String, List<int>>{};
  final livres = <String, Map<String, dynamic>>{
    for (final p in idsLivres) p: {'livre': p, 'hash': bundle['hash'], 'listes': <String, dynamic>{}},
  };
  final bilan = <String, Map<String, List<int>>>{};
  final raisons = <String, List<int>>{};
  for (final liste in [...kListesLivre, ...stables]) {
    final l = _lire(bundle, liste);
    if (l == null) continue;
    final stable = stables.contains(liste);
    final garde = <Object?>[];
    final posCommun = <int>[];
    final parLivre = <String, (List<int>, List<Object?>)>{};
    for (final it in items.where((x) => x.liste == liste)) {
      final octets = _octets(it.obj);
      // jamais vu nulle part (un item mort, ou que l'analyse ne sait pas voir) : commun
      final auCommun = it.p.length == tous.length || it.p.isEmpty;
      void compte(String part) {
        final b = bilan.putIfAbsent(liste, () => {}).putIfAbsent(part, () => [0, 0]);
        b[0] += 1;
        b[1] += octets;
      }

      if (auCommun) {
        compte('commun');
        garde.add(l[it.pos]);
        posCommun.add(it.pos);
        final r = raisons.putIfAbsent(it.p.isEmpty ? 'jamais servi (gardé)' : (it.raison ?? '?'), () => [0, 0]);
        r[0] += 1;
        r[1] += octets;
      } else {
        for (final b in it.p) {
          compte(b);
          final e = parLivre.putIfAbsent(b, () => (<int>[], <Object?>[]));
          e.$1.add(it.pos);
          e.$2.add(l[it.pos]);
        }
        if (stable) garde.add(boucheTrou(liste));
      }
    }
    _remplacer(commun, liste, garde);
    positions[liste] = posCommun;
    for (final b in idsLivres) {
      final e = parLivre[b];
      if (e != null) (livres[b]!['listes'] as Map<String, dynamic>)[liste] = {'pos': plages(e.$1), 'items': e.$2};
    }
  }
  commun['__livres'] = {
    'version': 1,
    'listes': {
      for (final e in positions.entries)
        if (!stables.contains(e.key)) e.key: plages(e.value)
    },
    'stables': stables,
    'livres': [
      for (final p in idsLivres)
        if ((livres[p]!['listes'] as Map).isNotEmpty) p
    ],
  };
  livres.removeWhere((_, v) => (v['listes'] as Map).isEmpty);
  return DecoupeLivres(commun, livres, bilan, raisons);
}

/// Les positions en plages `[début, longueur, début, longueur…]` : les items d'un
/// même fichier se suivent, la liste tient en quelques nombres.
List<int> plages(List<int> pos) {
  final out = <int>[];
  for (final p in pos) {
    if (out.isNotEmpty && out[out.length - 2] + out[out.length - 1] == p) {
      out[out.length - 1] += 1;
    } else {
      out
        ..add(p)
        ..add(1);
    }
  }
  return out;
}

/// L'inverse de [plages].
List<int> dePlages(List<dynamic> pl) => [
      for (var i = 0; i + 1 < pl.length; i += 2)
        for (var k = 0; k < (pl[i + 1] as num).toInt(); k++) (pl[i] as num).toInt() + k,
    ];

/// La fusion : le commun et un livre (ou aucun) → le bundle que le moteur lit,
/// sans `__livres`. Même algorithme que `fusionner` de demarrage.js.
Map<String, dynamic> fusionnerLivre(Map<String, dynamic> commun, Map<String, dynamic>? livre) {
  final out = _copieProfonde(commun) as Map<String, dynamic>;
  final d = (out.remove('__livres') as Map?)?.cast<String, dynamic>();
  if (d == null) return out;
  final listes = ((livre?['listes'] as Map?) ?? const {}).cast<String, dynamic>();
  final stables = ((d['stables'] as List?) ?? const []).cast<String>().toSet();
  for (final e in listes.entries) {
    final l = _lire(out, e.key);
    if (l == null) continue;
    final pos = dePlages((e.value as Map)['pos'] as List);
    final its = (e.value as Map)['items'] as List;
    if (stables.contains(e.key)) {
      for (var k = 0; k < pos.length; k++) {
        l[pos[k]] = its[k];
      }
      continue;
    }
    final posC = dePlages(((d['listes'] as Map)[e.key] as List?) ?? const []);
    final m = <Object?>[];
    var i = 0, j = 0;
    while (i < l.length || j < its.length) {
      if (j >= its.length || (i < l.length && posC[i] < pos[j])) {
        m.add(l[i++]);
      } else {
        m.add(its[j++]);
      }
    }
    _remplacer(out, e.key, m);
  }
  return out;
}

List<dynamic>? _lire(Map<String, dynamic> b, String chemin) {
  Object? x = b;
  for (final k in chemin.split('.')) {
    x = x is Map ? x[k] : null;
  }
  return x is List ? x : null;
}

void _remplacer(Map<String, dynamic> b, String chemin, List<Object?> l) {
  final ks = chemin.split('.');
  Map<dynamic, dynamic> x = b;
  for (var i = 0; i < ks.length - 1; i++) {
    x = x[ks[i]] as Map<dynamic, dynamic>;
  }
  x[ks.last] = l;
}

Object? _copieProfonde(Object? x) {
  if (x is Map) return <String, dynamic>{for (final e in x.entries) e.key as String: _copieProfonde(e.value)};
  if (x is List) return [for (final y in x) _copieProfonde(y)];
  return x;
}

int _octets(Object? x) {
  if (x is String) return x.length + 2;
  if (x is num || x is bool || x == null) return 4;
  if (x is List) return x.fold<int>(2, (s, y) => s + _octets(y) + 1);
  if (x is Map) return x.entries.fold<int>(2, (s, e) => s + (e.key as String).length + 4 + _octets(e.value));
  return 4;
}

/// Les drapeaux qu'un morceau du bundle pose ou retire (`set:` / `clear:`).
void _drapeauxPosesOuRetires(Object? x, Set<String> out) {
  if (x is Map) {
    for (final e in x.entries) {
      if ((e.key == 'set' || e.key == 'clear') && e.value is List) {
        for (final f in e.value as List) {
          if (f is String) out.add(f);
        }
      }
      _drapeauxPosesOuRetires(e.value, out);
    }
  } else if (x is List) {
    for (final y in x) {
      _drapeauxPosesOuRetires(y, out);
    }
  }
}

/// Toute chaîne (ou tout mot d'une chaîne, ou toute clé) qui est l'id d'un item :
/// une référence. Trop large exprès — une référence de trop garde un item au
/// commun, une référence oubliée casserait un livre.
Set<String> _references(Object? x, Set<String> ids, [Set<String>? out]) {
  out ??= <String>{};
  if (x is String) {
    if (ids.contains(x)) {
      out.add(x);
    } else {
      for (final m in _mot.allMatches(x)) {
        if (ids.contains(m.group(0))) out.add(m.group(0)!);
      }
    }
  } else if (x is List) {
    for (final y in x) {
      _references(y, ids, out);
    }
  } else if (x is Map) {
    for (final e in x.entries) {
      if (ids.contains(e.key)) out.add(e.key as String);
      _references(e.value, ids, out);
    }
  }
  return out;
}

final RegExp _mot = RegExp(r'[A-Za-z0-9_.:-]+');

/// Les arêtes d'un item : (id visé, livres où l'arête peut servir). Les variantes
/// d'étape d'un arc et les réactions (`react:`) portent leur `if` ; une variante
/// qui peut être le secours de `resolveVariant` (la dernière qui joue un rôle
/// donné) part sans condition. La photo d'une Une n'est pas une arête (le moteur
/// ne la regarde que si la carte a déjà été servie ; voir la règle des photos).
void _aretes(_Item it, Set<String> ids, Set<String> Function(Object?) livresDe, Set<String> tous, List<String> roles, Map<String, List<_Item>> parId,
    List<(String, Set<String>)> out) {
  void generique(Object? x) {
    for (final id in _references(x, ids)) {
      out.add((id, tous));
    }
  }

  void parcours(Object? x) {
    if (x is Map) {
      for (final e in x.entries) {
        if (e.key == 'react' && e.value is List) {
          for (final v in (e.value as List)) {
            if (v is Map && v['card'] is String) {
              out.add((v['card'] as String, livresDe(v['if'])));
              generique(Map<dynamic, dynamic>.of(v)..remove('card'));
            } else {
              generique(v);
            }
          }
          continue;
        }
        if (ids.contains(e.key)) out.add((e.key as String, tous));
        parcours(e.value);
      }
    } else if (x is List) {
      for (final y in x) {
        parcours(y);
      }
    } else {
      generique(x);
    }
  }

  final o = it.obj;
  if (it.liste == 'arcs') {
    final copie = Map<String, dynamic>.of(o);
    final steps = (copie.remove('steps') as List?) ?? const [];
    parcours(copie);
    for (final st in steps.cast<Map<dynamic, dynamic>>()) {
      final s2 = Map<dynamic, dynamic>.of(st);
      final vs = ((s2.remove('card') as List?) ?? const []).cast<Map<dynamic, dynamic>>();
      parcours(s2);
      // les secours possibles de resolveVariant : pour chaque rôle, la dernière
      // variante qui le joue ; à défaut, la dernière tout court
      final secours = <int>{};
      if (vs.isNotEmpty) secours.add(vs.length - 1);
      for (final r in roles) {
        for (var k = vs.length - 1; k >= 0; k--) {
          final c = (parId[vs[k]['id']] ?? const <_Item>[]).where((x) => x.liste == 'cards').toList();
          if (c.isNotEmpty && (c.first.roles.isEmpty || c.first.roles.contains(r))) {
            secours.add(k);
            break;
          }
        }
      }
      for (var k = 0; k < vs.length; k++) {
        out.add((vs[k]['id'] as String, secours.contains(k) ? tous : livresDe(vs[k]['if'])));
        parcours(Map<dynamic, dynamic>.of(vs[k])..remove('id'));
      }
    }
    return;
  }
  if (it.liste == 'unes') {
    parcours(Map<String, dynamic>.of(o)..remove('photo'));
    return;
  }
  parcours(o);
}
