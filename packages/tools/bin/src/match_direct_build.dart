/// LE SAMEDI EN DIRECT (docs/histoires/samedi_direct.md) — la compilation des
/// décisions du bord du terrain (`match_direct:` dans content/ville/*.yaml),
/// appelée par build_content (`_compileVille`). Le moteur les lit sous
/// `ville.match_direct` (packages/core/lib/src/match_direct.dart).
///
/// Ce qui est refusé : un id en double, un rôle, une situation, un moment, une
/// caméra ou une foule inconnus ; un texte vide ou de plus de 200 caractères
/// (220 une fois rendu), un libellé de plus de 28, une réponse vide ou de plus
/// de 140 (charte d'écriture, R6-R7) ; un trou inconnu, `{toi}` (une décision
/// n'a pas de locuteur), un trou dans un libellé ; un poids de geste hors de
/// ±6 ; des effets autres qu'un peu de climat (`jauges`, ±1 ou ±2) et un cran
/// de relation (`relation`, ±1) ; une condition illisible, une fonction ou un
/// chemin inconnus, un drapeau non déclaré ; un rôle qui a des décisions sans
/// en avoir une, sans condition, pour chaque moment et chaque situation (sinon
/// un samedi peut rester muet).
library;

import 'package:fusible_core/fusible_core.dart'
    show kCamerasDirect, kDirectGesteMax, kFoulesDirect, kKnownCalls, kKnownPathPrefixes, kKnownPaths, kMomentsDirect, kSituationsDirect, placeholdersOf;

import 'condition_parser.dart';

const Set<String> _clesDecision = {'id', 'roles', 'situations', 'moments', 'when', 'camera', 'poids', 'texte', 'gauche', 'droite', 'defaut'};
const Set<String> _clesCote = {'label', 'reponse', 'v', 'n', 'foule', 'effets'};

/// Les drapeaux que le moteur écrit lui-même (lint.dart, `kEngineFlags` et
/// `kEngineFlagPrefixes`) : une condition peut les lire sans qu'ils soient
/// déclarés dans flags.yaml.
const Set<String> _drapeauxMoteur = {'bilan_tenu', 'bilan_manque', 'descente'};
const List<String> _prefixesMoteur = ['camille_', 'role_was_', 'rep_', 'tuyau_', 'service_', 'dette_', 'quartier_'];
bool _drapeauConnu(String f, Set<String> declares) =>
    declares.contains(f) || _drapeauxMoteur.contains(f) || _prefixesMoteur.any(f.startsWith);

/// Les trous qu'une décision peut porter, et la longueur la plus longue que
/// chacun peut prendre une fois rendu (le contrôle « ≤ 220 rendu »).
const Map<String, int> kTrousDirect = {
  'minute': 2, 'score': 3, 'adv': 12, 'Adv': 12, 'club': 18, 'clubShort': 9, 'rival': 18,
  'capitaine': 20, 'coach': 20, 'prenom': 14, 'nom': 16, 'numero': 2, 'ville': 12, 'annee': 4,
};

List<Map<String, dynamic>> compileMatchDirect(
  List<String> errors,
  Object? raw, {
  required Set<String> roles,
  required Map<String, Set<String>> jaugesParRole,
  required Set<String> personnages,
  required Set<String> drapeaux,
}) {
  final out = <Map<String, dynamic>>[];
  if (raw == null) return out;
  if (raw is! List) {
    errors.add('ville/match_direct : une liste de décisions');
    return out;
  }
  final ids = <String>{};
  final jauges = jaugesParRole.values.expand((e) => e).toSet();
  // ce que chaque rôle couvre sans condition : moment|situation
  final couvert = <String, Set<String>>{};
  for (final e in raw) {
    if (e is! Map) {
      errors.add('ville/match_direct : une table par décision');
      continue;
    }
    final id = e['id']?.toString() ?? '';
    final where = 'ville/match_direct/$id';
    if (!RegExp(r'^[a-z][a-z0-9_]*$').hasMatch(id) || !ids.add(id)) errors.add('$where : id vide, en double, ou hors de [a-z0-9_]');
    for (final k in e.keys) {
      if (!_clesDecision.contains(k.toString())) errors.add('$where : clé « $k » inconnue (${_clesDecision.join(' ')})');
    }
    List<String> liste(String k, Iterable<String> domaine, String quoi) {
      final v = e[k];
      final l = v is List ? v.map((x) => x.toString()).toList() : (v == null ? <String>[] : [v.toString()]);
      if (l.isEmpty) errors.add('$where : `$k` vide ($quoi : ${domaine.join(' ')})');
      for (final x in l) {
        if (!domaine.contains(x)) errors.add('$where : $quoi « $x » inconnu (${domaine.join(' ')})');
      }
      return l;
    }

    final rs = liste('roles', roles, 'rôle');
    final situations = liste('situations', kSituationsDirect, 'situation');
    final moments = liste('moments', kMomentsDirect.keys, 'moment');
    final camera = e['camera']?.toString();
    if (camera != null && !kCamerasDirect.contains(camera)) errors.add('$where : caméra « $camera » inconnue (${kCamerasDirect.join(' ')})');
    final poids = e['poids'] ?? 1;
    if (poids is! int || poids < 1 || poids > 5) errors.add('$where : `poids` entre 1 et 5');
    // la condition : la langue des cartes, compilée ; ses fonctions, ses chemins, ses drapeaux
    Object? when;
    if (e['when'] != null) {
      try {
        when = parseCondition(e['when'].toString());
        _verifierCondition(when, where, errors, drapeaux);
      } catch (x) {
        errors.add('$where : condition invalide « ${e['when']} » : $x');
      }
    }
    String texte(Object? v, String quoi, int max, {bool trous = true, int rendu = 0}) {
      final t = v?.toString() ?? '';
      if (t.trim().isEmpty) errors.add('$where : $quoi vide');
      if (t.length > max) errors.add('$where : $quoi de ${t.length} caractères (> $max)');
      var long = t.length;
      for (final p in placeholdersOf(t)) {
        if (!trous) {
          errors.add('$where : $quoi : pas de trou dans un libellé ({$p})');
        } else if (p == 'toi' || p == 'Toi') {
          errors.add('$where : $quoi : {$p} demande un locuteur, une décision n\'en a pas');
        } else if (!kTrousDirect.containsKey(p)) {
          errors.add('$where : $quoi : {$p} inconnu (${kTrousDirect.keys.join(' ')})');
        } else {
          long += kTrousDirect[p]! - p.length - 2;
        }
      }
      if (rendu > 0 && long > rendu) errors.add('$where : $quoi de $long caractères une fois rendu (> $rendu)');
      return t;
    }

    final txt = texte(e['texte'], 'texte', 200, rendu: 220);
    Map<String, dynamic> cote(String k) {
      final w = '$where/$k';
      final c = e[k];
      if (c is! Map) {
        errors.add('$w : une table {label, reponse, v, n, foule, effets}');
        return const {};
      }
      for (final x in c.keys) {
        if (!_clesCote.contains(x.toString())) errors.add('$w : clé « $x » inconnue (${_clesCote.join(' ')})');
      }
      final label = texte(c['label'], '$k.label', 28, trous: false);
      final reponse = texte(c['reponse'], '$k.reponse', 140, rendu: 150);
      int poidsDe(String n) {
        final v = c[n] ?? 0;
        if (v is! int || v.abs() > kDirectGesteMax) {
          errors.add('$w : `$n` : un entier entre -$kDirectGesteMax et $kDirectGesteMax (points de pourcentage)');
          return 0;
        }
        return v;
      }

      final v = poidsDe('v'), n = poidsDe('n');
      final foule = c['foule']?.toString() ?? 'rien';
      if (!kFoulesDirect.contains(foule)) errors.add('$w : foule « $foule » inconnue (${kFoulesDirect.join(' ')})');
      final effets = <String, dynamic>{};
      final ef = c['effets'];
      if (ef != null) {
        if (ef is! Map) {
          errors.add('$w : `effets` : une table {jauges, relation}');
        } else {
          for (final cle in ef.keys) {
            if (cle != 'jauges' && cle != 'relation') errors.add('$w : effet « $cle » : seulement `jauges` et `relation` (rien qui touche une histoire)');
          }
          final j = <String, int>{};
          ((ef['jauges'] as Map?) ?? const {}).forEach((g, x) {
            if (!jauges.contains(g.toString())) errors.add('$w : jauge « $g » inconnue');
            for (final r in rs) {
              if (!(jaugesParRole[r] ?? const {}).contains(g.toString())) errors.add('$w : jauge « $g » inconnue du rôle $r');
            }
            if (x is! int || x == 0 || x.abs() > 2) {
              errors.add('$w : jauge $g : ±1 ou ±2 (un climat caché, pas une carte)');
            } else {
              j[g.toString()] = x;
            }
          });
          final rel = <String, int>{};
          ((ef['relation'] as Map?) ?? const {}).forEach((q, x) {
            if (!personnages.contains(q.toString())) errors.add('$w : relation « $q » : personnage inconnu');
            if (x != 1 && x != -1) {
              errors.add('$w : relation $q : +1 ou -1 (un cran)');
            } else {
              rel[q.toString()] = x as int;
            }
          });
          if (j.isNotEmpty) effets['jauges'] = j;
          if (rel.isNotEmpty) effets['relation'] = rel;
        }
      }
      return {
        'label': label,
        'reponse': reponse,
        if (v != 0) 'v': v,
        if (n != 0) 'n': n,
        if (foule != 'rien') 'foule': foule,
        if (effets.isNotEmpty) 'effets': effets,
      };
    }

    final gauche = cote('gauche'), droite = cote('droite');
    final defaut = e['defaut']?.toString();
    if (defaut != 'gauche' && defaut != 'droite') errors.add('$where : `defaut` : gauche ou droite (le geste passif, quand le temps est écoulé)');
    if (when == null) {
      for (final r in rs) {
        for (final m in moments) {
          for (final s in situations) {
            (couvert[r] ??= <String>{}).add('$m|$s');
          }
        }
      }
    }
    out.add({
      'id': id,
      'roles': rs,
      'situations': situations,
      'moments': moments,
      if (when != null) 'when': when,
      if (camera != null) 'camera': camera,
      if (poids is int && poids != 1) 'poids': poids,
      'texte': txt,
      'gauche': gauche,
      'droite': droite,
      'defaut': defaut ?? 'droite',
    });
  }
  // un rôle qui décide au bord du terrain décide à chaque moment, dans chaque situation
  for (final r in couvert.keys.toList()..sort()) {
    for (final m in kMomentsDirect.keys) {
      for (final s in kSituationsDirect) {
        if (!couvert[r]!.contains('$m|$s')) errors.add('ville/match_direct : le rôle $r n\'a aucune décision sans condition au moment « $m », situation « $s »');
      }
    }
  }
  final sansCouverture = out.expand((d) => (d['roles'] as List).cast<String>()).toSet().difference(couvert.keys.toSet());
  for (final r in sansCouverture) {
    errors.add('ville/match_direct : le rôle $r n\'a que des décisions sous condition');
  }
  return out;
}

void _verifierCondition(Object? node, String where, List<String> errors, Set<String> drapeaux) {
  if (node is! List || node.isEmpty) return;
  final op = node[0];
  if (op is List) {
    // une liste de nœuds (les éléments d'un `in`)
    for (final x in node) {
      _verifierCondition(x, where, errors, drapeaux);
    }
    return;
  }
  if (op == 'path') {
    final p = node[1].toString();
    if (!kKnownPaths.contains(p) && !kKnownPathPrefixes.any(p.startsWith)) errors.add('$where : chemin inconnu dans `when` : $p');
    if (p.startsWith('flags.') && !_drapeauConnu(p.substring(6), drapeaux)) errors.add('$where : drapeau « ${p.substring(6)} » non déclaré dans flags.yaml');
    return;
  }
  if (op == 'call') {
    final nom = node[1].toString();
    if (!kKnownCalls.contains(nom)) errors.add('$where : fonction inconnue dans `when` : $nom()');
    final args = node.length > 2 && node[2] is List ? node[2] as List : const [];
    if ((nom == 'flag') && args.isNotEmpty && args[0] is List && (args[0] as List).length > 1 && (args[0] as List)[0] == 'lit') {
      final f = (args[0] as List)[1].toString();
      if (!_drapeauConnu(f, drapeaux)) errors.add('$where : drapeau « $f » non déclaré dans flags.yaml');
    }
    for (final a in args) {
      _verifierCondition(a, where, errors, drapeaux);
    }
    return;
  }
  for (final x in node.skip(1)) {
    _verifierCondition(x, where, errors, drapeaux);
  }
}
