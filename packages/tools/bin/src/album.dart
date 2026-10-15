// L'ALBUM D'AUBÉRIVE — la validation et la compilation du lot content/ville/album.yaml.
//
// Un fichier à part de build_content.dart (`part of`) : il en partage les aides (`_loadYaml`,
// `_strList`, les énumérations de portraits) et n'ajoute au script qu'une ligne `part` et un appel.
// Il rend la section `album` (rangée sous `ville` : le lint y passe sa liste de noms réels comme sur
// le reste de la ville) et les missions d'une étape que le moteur applique quand une page est finie
// (`album.page.<id>` : l'argent par le pont de la ville, le quartier par son drapeau, le tuyau).
//
// Ce que le lot écrit à la main (légendes, échanges, récompenses) est validé ici ; ce que les
// personnages donnent (les visages) est tiré d'eux, et un visage qui ne tombe dans aucune page est
// une erreur : l'album les contient tous.
part of '../build_content.dart';

const Set<String> _albumRaretes = {'commune', 'brillante'};
const Set<String> _albumMotifs = {'rayures', 'cerceaux', 'unie', 'bande', 'chevrons', 'damier'};
const Set<String> _albumCols = {'polo', 'ronde', 'v', 'aucun'};
const Set<String> _albumManches = {'courtes', 'longues'};
const Set<String> _albumQuartiers = {'tilleuls', 'port', 'hauts', 'campagne'};
const int _albumPageMax = 24;

Map<String, dynamic> _compileAlbum(
  List<String> errors, {
  required Map<String, dynamic> ville,
  required List<Map<String, dynamic>> characters,
  required List<Map<String, dynamic>> gensBruts,
  required List<Map<String, dynamic>> postulats,
  required List<Map<String, dynamic>> missionsOut,
}) {
  final rawAlbum = (_loadYaml('ville/album.yaml') as Map?)?['album'];
  if (rawAlbum is! Map) return const {};
  final m = rawAlbum.cast<String, dynamic>();
  const w0 = 'ville/album';

  String texte(Map<dynamic, dynamic> e, String k, String where, int max, {bool requis = true}) {
    final v = e[k]?.toString() ?? '';
    if (v.isEmpty) {
      if (requis) errors.add('$where: `$k` vide');
    } else if (v.length > max) {
      errors.add('$where: `$k` de ${v.length} caractères (> $max)');
    }
    return v;
  }

  bool couleur(Object? v) => v is String && RegExp(r'^#[0-9A-Fa-f]{6}$').hasMatch(v);
  int? entier(Object? v, String where, {required int min, required int max}) {
    if (v == null) return null;
    if (v is! int || v < min || v > max) {
      errors.add('$where: un entier entre $min et $max');
      return null;
    }
    return v;
  }

  // --- la pochette
  final po = (m['pochette'] as Map?)?.cast<String, dynamic>() ?? const <String, dynamic>{};
  final vignettes = entier(po['vignettes'], '$w0/pochette/vignettes', min: 3, max: 6) ?? 4;
  final prix = entier(po['prix'], '$w0/pochette/prix', min: 1, max: 1000) ?? 30;
  final neuves = (po['neuves'] as num?)?.toDouble() ?? 0.6;
  if (neuves < 0 || neuves > 1) errors.add('$w0/pochette/neuves : entre 0 et 1');
  final brillanteSur = entier(po['brillante_sur'], '$w0/pochette/brillante_sur', min: 2, max: 50) ?? 6;
  final epoque = (po['epoque'] as num?)?.toDouble() ?? 2.5;
  if (epoque < 1 || epoque > 10) errors.add('$w0/pochette/epoque : entre 1 et 10');
  // le prix d'une pochette est celui des activités qui la vendent
  final acts = [for (final a in (ville['activites'] as List? ?? const [])) (a as Map).cast<String, dynamic>()];
  final vendeuses = acts.where((a) => a['jeu'] == 'pochette').toList();
  if (vendeuses.isEmpty) errors.add('$w0: aucune activité à `jeu: pochette` (la pochette ne se vend nulle part)');
  for (final a in vendeuses) {
    if (a['francs'] != -prix) errors.add('$w0/pochette/prix : ${a['id']} coûte ${a['francs']} (attendu -$prix)');
  }
  final cad = (m['cadeaux'] as Map?)?.cast<String, dynamic>() ?? const <String, dynamic>{};
  final cadeauLien = entier(cad['lien'], '$w0/cadeaux/lien', min: 0, max: 40) ?? 8;
  final cadeauService = entier(cad['service'], '$w0/cadeaux/service', min: 0, max: 40) ?? 5;
  final ech = (m['echange'] as Map?)?.cast<String, dynamic>() ?? const <String, dynamic>{};
  final donne = entier(ech['donne'], '$w0/echange/donne', min: 1, max: 6) ?? 2;
  final recoit = entier(ech['recoit'], '$w0/echange/recoit', min: 1, max: 3) ?? 1;

  // --- les visages : où chacun vit (son lot), depuis quand (son époque en ville, sinon sa première histoire)
  final lotDe = <String, String>{};
  final dossier = Directory('$contentDir/ville');
  if (dossier.existsSync()) {
    final fichiers = dossier.listSync().whereType<File>().where((f) => f.path.endsWith('.yaml')).toList()
      ..sort((a, b) => a.path.compareTo(b.path));
    for (final f in fichiers) {
      final nom = f.uri.pathSegments.last;
      final doc = _loadYaml('ville/$nom');
      if (doc is! Map) continue;
      for (final g in (doc['gens'] as List? ?? const [])) {
        if (g is Map && g['id'] != null) lotDe.putIfAbsent(g['id'].toString(), () => nom.substring(0, nom.length - 5));
      }
    }
  }
  final anneesDe = <String, List<int>>{};
  for (final g in gensBruts) {
    final a = g['annees'];
    if (a is List && a.length == 2 && a[0] is int && a[1] is int) anneesDe[g['id'].toString()] = [a[0] as int, a[1] as int];
  }
  final premier = <String, int>{};
  for (final p in postulats) {
    final an = (p['year'] as num?)?.toInt() ?? 1990;
    for (final id in ((p['cast'] as Map?)?.keys ?? const <Object?>[])) {
      final k = id.toString();
      if (!premier.containsKey(k) || an < premier[k]!) premier[k] = an;
    }
  }
  int debutDe(String id) => anneesDe[id]?[0] ?? premier[id] ?? 1990;

  // --- les portraits à la main (les mêmes énumérations que content/portraits.yaml)
  Map<String, dynamic>? portrait(Object? raw, String where) {
    if (raw is! Map) {
      errors.add('$where: `portrait` : une table de traits (comme portraits.yaml)');
      return null;
    }
    final out = <String, dynamic>{};
    raw.forEach((k, v) => out[k.toString()] = v?.toString());
    for (final key in _portraitRequired) {
      if (out[key] == null) errors.add('$where/portrait: trait « $key » manquant');
    }
    for (final e in _portraitEnums.entries) {
      final v = out[e.key];
      if (v != null && !e.value.contains(v)) errors.add('$where/portrait: ${e.key} « $v » inconnu (${e.value.join(' | ')})');
    }
    for (final key in _portraitColourKeys) {
      final v = out[key];
      if (v != null && !_portraitColours.contains(v)) errors.add('$where/portrait: $key « $v » hors palette');
    }
    out['genre'] = 'm';
    return out;
  }

  final pages = <Map<String, dynamic>>[];
  final quartiersOuverts = <String>{};   // les quartiers qu'une page ouvre d'avance (à chaque nouvelle carrière)
  final idsPages = <String>{};
  final idsVignettes = <String>{};
  final assignes = <String>{};
  final charIds = {for (final c in characters) c['id'].toString()};
  final charIndex = {for (var i = 0; i < characters.length; i++) characters[i]['id'].toString(): i};
  var numero = 0;
  final postulatsJouables = [for (final p in postulats) if (p['chantier'] != true) p];
  final idsPostulats = {for (final p in postulats) p['id'].toString()};

  for (final e in (m['pages'] as List? ?? const [])) {
    if (e is! Map) continue;
    final id = e['id']?.toString() ?? '';
    final where = '$w0/pages/$id';
    if (!RegExp(r'^[a-z][a-z0-9_]*$').hasMatch(id) || !idsPages.add(id)) errors.add('$where: id en minuscules, unique');
    final section = e['section']?.toString() ?? '';
    if (section != 'legendes' && section != 'visages') errors.add('$where: section « $section » (legendes | visages)');
    final titre = texte(e, 'titre', where, 40);
    final sous = texte(e, 'sous', where, 160);
    final fond = e['fond'], bande = e['bande'];
    if (!couleur(fond) || !couleur(bande)) errors.add('$where: `fond` et `bande` : des couleurs #RRGGBB');
    final raretePage = e['rarete']?.toString() ?? 'commune';
    if (!_albumRaretes.contains(raretePage)) errors.add('$where: rareté « $raretePage » (${_albumRaretes.join(' | ')})');
    // « cette histoire aime cette page » : les vignettes y sortent plus souvent des pochettes (page, ou vignette)
    Map<String, num> livresDe(Object? raw, String w) {
      final out = <String, num>{};
      ((raw as Map?) ?? const {}).forEach((k, v) {
        if (!idsPostulats.contains(k.toString())) errors.add('$w/livres: histoire « $k » inconnue');
        if (v is! num || v < 1 || v > 10) {
          errors.add('$w/livres/$k: un poids entre 1 et 10');
        } else {
          out[k.toString()] = v;
        }
      });
      return out;
    }

    final livres = livresDe(e['livres'], where);

    final stickers = <Map<String, dynamic>>[];
    if (e['vignettes'] is List) {
      // une page écrite à la main
      for (final v in (e['vignettes'] as List)) {
        if (v is! Map) continue;
        final vid = v['id']?.toString() ?? '';
        final wv = '$where/$vid';
        if (!RegExp(r'^[a-z0-9][a-z0-9_]*$').hasMatch(vid) || !idsVignettes.add(vid) || charIds.contains(vid)) {
          errors.add('$wv: id en minuscules, unique (ni celui d\'un personnage)');
        }
        final secret = v['secret'] == true;
        final nom = secret ? null : texte(v, 'nom', wv, 32);
        if (secret && v['nom'] != null) errors.add('$wv: une vignette secrète n\'a pas de `nom` (il a bavé à l\'impression)');
        final label = texte(v, 'label', wv, 36);
        final annee = entier(v['annee'], '$wv/annee', min: 1900, max: 2050);
        final dos = texte(v, 'dos', wv, 160);
        final rarete = v['rarete']?.toString() ?? raretePage;
        if (!_albumRaretes.contains(rarete)) errors.add('$wv: rareté « $rarete »');
        List<int>? ep;
        if (v['epoque'] != null) {
          final l = v['epoque'];
          if (l is! List || l.length != 2 || l[0] is! int || l[1] is! int || (l[0] as int) > (l[1] as int)) {
            errors.add('$wv/epoque : [début, fin]');
          } else {
            ep = [l[0] as int, l[1] as int];
          }
        }
        final out = <String, dynamic>{
          'id': vid, 'n': ++numero, 'nom': nom, 'label': label, 'annee': annee,
          if (secret) 'secret': true,
          if (rarete != 'commune') 'rarete': rarete,
          if (v['echangeable'] == false) 'echangeable': false,
          if (ep != null) 'epoque': ep,
          if (v['livres'] != null) 'livres': livresDe(v['livres'], wv),
          'dos': dos,
        };
        if (v['maillot'] != null) {
          final mm = (v['maillot'] as Map?)?.cast<String, dynamic>() ?? const <String, dynamic>{};
          if (!_albumMotifs.contains(mm['motif'])) errors.add('$wv/maillot: motif « ${mm['motif']} » (${_albumMotifs.join(' | ')})');
          if (!_albumCols.contains(mm['col'])) errors.add('$wv/maillot: col « ${mm['col']} » (${_albumCols.join(' | ')})');
          if (!_albumManches.contains(mm['manches'])) errors.add('$wv/maillot: manches « ${mm['manches']} »');
          if (!couleur(mm['c1']) || !couleur(mm['c2'])) errors.add('$wv/maillot: `c1` et `c2` : des couleurs #RRGGBB');
          out['k'] = 'e';
          out['maillot'] = {for (final k in const ['motif', 'c1', 'c2', 'col', 'manches']) k: mm[k]};
        } else {
          out['k'] = 'l';
          final pr = portrait(v['portrait'], wv);
          if (pr != null) out['portrait'] = pr;
        }
        stickers.add(out);
      }
    } else if (e['unes'] == true) {
      // les Unes : une par histoire jouable, gagnée en jouant (jamais dans une pochette)
      for (final p in postulatsJouables) {
        stickers.add({
          'id': 'une_${p['id']}', 'n': ++numero, 'k': 'u', 'histoire': p['id'].toString(),
          'rarete': 'brillante', 'hors_pochette': true, 'echangeable': false,
          'annee': (p['year'] as num?)?.toInt() ?? 1990,
        });
        idsVignettes.add('une_${p['id']}');
      }
    } else {
      // une page de visages : un sélecteur
      final camps = _strList(e['camp']);
      final lot = e['lot']?.toString();
      final horsLots = e['hors_lots'] == true;
      final debut = e['debut'] == null ? null : _intPair(e['debut'], [1990, 2050]);
      for (final c in camps) {
        if (!const {'terrain', 'direction', 'instances', 'selection', 'famille', 'ville'}.contains(c)) errors.add('$where: camp « $c » inconnu');
      }
      if (camps.isEmpty && lot == null) errors.add('$where: ni `vignettes`, ni `unes`, ni sélecteur (`camp` ou `lot`)');
      if (lot != null && !lotDe.containsValue(lot)) errors.add('$where: lot « $lot » inconnu (un fichier de content/ville/ qui porte `gens:`)');
      final pris = <Map<String, dynamic>>[];
      for (final c in characters) {
        final cid = c['id'].toString();
        if (assignes.contains(cid)) continue;
        if (camps.isNotEmpty && !camps.contains(c['camp']?.toString())) continue;
        if (lot != null && lotDe[cid] != lot) continue;
        if (horsLots && lotDe.containsKey(cid)) continue;
        final d = debutDe(cid);
        if (debut != null && (d < debut[0] || d > debut[1])) continue;
        pris.add(c);
      }
      pris.sort((a, b) {
        final da = debutDe(a['id'].toString()), db = debutDe(b['id'].toString());
        return da != db ? da.compareTo(db) : charIndex[a['id'].toString()]!.compareTo(charIndex[b['id'].toString()]!);
      });
      for (final c in pris) {
        final cid = c['id'].toString();
        assignes.add(cid);
        idsVignettes.add(cid);
        stickers.add({
          'id': cid, 'n': ++numero, 'k': 'p', 'annee': debutDe(cid),
          if (anneesDe.containsKey(cid)) 'epoque': anneesDe[cid],
        });
      }
    }
    if (stickers.isEmpty) errors.add('$where: la page est vide');
    if (stickers.length > _albumPageMax) errors.add('$where: ${stickers.length} vignettes (une page en tient $_albumPageMax au plus)');

    // la récompense d'une page finie : des pochettes, de l'argent, un quartier d'avance, un tuyau
    Map<String, dynamic>? recompense;
    final rr = e['recompense'];
    if (rr != null) {
      if (rr is! Map) {
        errors.add('$where/recompense: une table');
      } else {
        final wr = '$where/recompense';
        final pochettes = entier(rr['pochettes'], '$wr/pochettes', min: 1, max: 10);
        final francs = entier(rr['francs'], '$wr/francs', min: 100, max: 10000);
        final quartier = rr['quartier']?.toString();
        if (quartier != null && !_albumQuartiers.contains(quartier)) errors.add('$wr: quartier « $quartier » (${_albumQuartiers.join(' | ')})');
        Map<String, dynamic>? tuyau;
        if (rr['tuyau'] is Map) {
          final t = rr['tuyau'] as Map;
          final qui = t['qui']?.toString();
          if (qui != null && !charIds.contains(qui)) errors.add('$wr/tuyau: personnage « $qui » inconnu');
          tuyau = {'texte': texte(t, 'texte', '$wr/tuyau', 200), if (qui != null) 'qui': qui};
        } else if (rr['tuyau'] != null) {
          errors.add('$wr/tuyau: une table {texte, qui}');
        }
        final txt = texte(rr, 'texte', wr, 160);
        if (pochettes == null && francs == null && quartier == null && tuyau == null) errors.add('$wr: rien à donner (pochettes, francs, quartier ou tuyau)');
        // ce que le moteur applique : l'argent (le pont de la ville), le drapeau du quartier, le tuyau
        if (quartier != null) quartiersOuverts.add(quartier);
        final set = <String>[if (quartier != null) 'quartier_$quartier', if (tuyau != null) 'tuyau_album_$id'];
        final moteur = francs != null || set.isNotEmpty;
        if (moteur) {
          missionsOut.add({
            'id': 'album.page.$id',
            'etapes': [
              {
                'id': 'rendu',
                'choix': [
                  {
                    'id': 'oui',
                    'effets': {
                      if (set.isNotEmpty) 'set': set,
                      if (francs != null) 'var': {'ville_francs': '+$francs'},
                    },
                  },
                ],
              },
            ],
          });
        }
        recompense = {
          'texte': txt,
          if (pochettes != null) 'pochettes': pochettes,
          if (francs != null) 'francs': francs,
          if (quartier != null) 'quartier': quartier,
          if (tuyau != null) 'tuyau': tuyau,
          if (moteur) 'mission': 'album.page.$id',
        };
      }
    }
    pages.add({
      'id': id, 'section': section, 'titre': titre, 'sous': sous, 'fond': fond, 'bande': bande,
      if (raretePage != 'commune') 'rarete': raretePage,
      if (livres.isNotEmpty) 'livres': livres,
      if (recompense != null) 'recompense': recompense,
      'vignettes': stickers,
    });
  }

  // un quartier ouvert d'avance l'est à chaque carrière : une mission qui ne pose que son drapeau
  for (final q in quartiersOuverts.toList()..sort()) {
    missionsOut.add({
      'id': 'album.quartier.$q',
      'etapes': [
        {
          'id': 'rendu',
          'choix': [
            {'id': 'oui', 'effets': {'set': ['quartier_$q']}},
          ],
        },
      ],
    });
  }

  // l'album les contient tous : un visage sans page est une erreur (un livre en a ajouté un)
  for (final c in characters) {
    final cid = c['id'].toString();
    if (!assignes.contains(cid)) errors.add('$w0: le visage « $cid » n\'est dans aucune page (ajoute-lui une page ou élargis un sélecteur)');
  }

  // --- avec qui l'on échange
  final gensIds = {for (final g in gensBruts) g['id'].toString()};
  final echanges = <Map<String, dynamic>>[];
  final vus = <String>{};
  for (final e in (m['echanges'] as List? ?? const [])) {
    if (e is! Map) continue;
    final gid = e['gens']?.toString() ?? '';
    final where = '$w0/echanges/$gid';
    if (!gensIds.contains(gid)) errors.add('$where: « $gid » n\'est pas un des gens d\'Aubérive (`gens:`)');
    if (!vus.add(gid)) errors.add('$where: en double');
    final activite = 'album_echange_$gid';
    final a = acts.where((x) => x['id'] == activite).toList();
    if (a.isEmpty) {
      errors.add('$where: l\'activité cachée « $activite » manque (`activites:` du lot)');
    } else {
      if (a.first['cache'] != true) errors.add('$where: « $activite » doit être `cache: true`');
      if (a.first['avec'] != gid) errors.add('$where: « $activite » doit se faire `avec: $gid`');
      if (a.first['habitude'] != 'quartier') errors.add('$where: « $activite » doit nourrir l\'habitude `quartier`');
    }
    final affinite = _strList(e['affinite']);
    for (final p in affinite) {
      if (!idsPages.contains(p)) errors.add('$where/affinite: page « $p » inconnue');
    }
    final brillante = (e['brillante'] as num?)?.toDouble() ?? 0.1;
    if (brillante < 0 || brillante > 1) errors.add('$where/brillante : entre 0 et 1');
    final stock = entier(e['stock'], '$where/stock', min: 4, max: 24) ?? 12;
    final scene = texte(e, 'scene', where, 200);
    final fin = _strList(e['fin']);
    if (fin.isEmpty || fin.length > 4) errors.add('$where/fin : de une à quatre phrases');
    for (final f in fin) {
      if (f.isEmpty || f.length > 200) errors.add('$where/fin : une phrase vide ou de plus de 200 caractères');
    }
    echanges.add({
      'gens': gid, 'activite': activite, 'affinite': affinite, 'brillante': brillante, 'stock': stock, 'scene': scene, 'fin': fin,
    });
  }
  for (final a in acts) {
    if (a['cache'] == true && '${a['id']}'.startsWith('album_echange_') && !vus.contains('${a['id']}'.substring(14))) {
      errors.add('$w0: l\'activité cachée « ${a['id']} » n\'a pas d\'échange (`echanges:`)');
    }
  }

  return {
    'pochette': {'vignettes': vignettes, 'prix': prix, 'neuves': neuves, 'brillante_sur': brillanteSur, 'epoque': epoque},
    'cadeaux': {'lien': cadeauLien, 'service': cadeauService},
    'echange': {'donne': donne, 'recoit': recoit},
    'total': numero,
    'pages': pages,
    'echanges': echanges,
  };
}
