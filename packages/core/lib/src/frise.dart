/// **La frise de carrière** — la carrière posée sur le siècle.
///
/// Ce que la référence montre : une ligne horizontale, l'année en grand, le
/// règne en cours posé dessus, des pictogrammes le long de la ligne pour les
/// événements traversés, et les règnes précédents en arrière-plan. Ici le
/// règne est une SAISON, la ligne est le siècle (1990-2050), les pictogrammes
/// sont ce que l'Almanach a retenu, et l'arrière-plan est fait des carrières
/// déjà jouées par le même profil.
///
/// **Rien n'est stocké pour elle.** La frise est entièrement DÉRIVÉE de ce que
/// la partie porte déjà :
///
/// | ce qu'elle montre        | d'où ça vient                                |
/// |--------------------------|----------------------------------------------|
/// | les saisons              | `GameState.journal` (les lignes de Bilan)     |
/// | le club, le rang, l'objectif d'une saison passée | les tags de sa ligne de Bilan (`rang:`, `div:`, `obj:`, `club:`) |
/// | la saison en cours       | `world`, `entities`, `objectiveTarget`        |
/// | les pictogrammes         | les autres lignes d'Almanach de la saison     |
/// | les Nouvelles datées     | `seenCount` croisé avec `Card.year`           |
/// | les fins d'intrigue      | `arcs[i].status == 'done'`                    |
/// | les carrières précédentes| la coquille les passe (le moteur ne persiste rien entre deux carrières) |
///
/// Zéro tirage, zéro écriture : deux ouvertures de la frise au même instant
/// donnent le même objet, et l'ouvrir ne déplace pas d'un pouce ce que la
/// graine raconte.
library;

import 'content.dart';
import 'draw/director.dart' show ellipsizeWords;
import 'state.dart';
import 'text.dart';
import 'world.dart';

/// Un pictogramme posé sur une saison de la frise.
class FriseEvenement {
  /// `titre | montee | descente | club | role | objectif | palier | une | arc | fin`
  final String type;
  final int annee;
  final String label;
  const FriseEvenement({required this.type, required this.annee, required this.label});

  Map<String, dynamic> toJson() => {'type': type, 'annee': annee, 'label': label};
}

/// Une saison sur la ligne : un « règne » de la référence.
class FriseSaison {
  /// Le numéro de saison affiché (1 pour la première), comme la vue.
  final int saison;
  final int annee;
  final String club;
  final int division;

  /// Le rang de fin de saison ; `0` tant qu'il n'y en a pas (saison en cours
  /// avant la première journée, ou ligne de Bilan compactée).
  final int rang;

  /// Le libellé de l'objectif (« Maintien », « Le titre »…), vide si inconnu.
  final String objectif;

  /// Objectif tenu ? `null` pour la saison en cours (elle n'a pas de verdict).
  final bool? tenu;
  final List<FriseEvenement> evenements;

  const FriseSaison({
    required this.saison,
    required this.annee,
    required this.club,
    required this.division,
    required this.rang,
    required this.objectif,
    required this.tenu,
    required this.evenements,
  });

  Map<String, dynamic> toJson() => {
        'saison': saison,
        'annee': annee,
        'club': club,
        'division': division,
        'rang': rang,
        'objectif': objectif,
        'tenu': tenu,
        'evenements': [for (final e in evenements) e.toJson()],
      };
}

/// Un jalon posé le long de la ligne, entre les saisons : ce que l'époque a
/// fait passer (`nouvelle`), ce que la carrière a changé (`club`, `role`) et
/// ce qu'une intrigue a refermé (`intrigue`).
class FriseJalon {
  final int annee;
  final String type; // nouvelle | club | role | intrigue
  final String label;
  const FriseJalon({required this.annee, required this.type, required this.label});

  Map<String, dynamic> toJson() => {'annee': annee, 'type': type, 'label': label};
}

/// Une carrière déjà jouée par le même profil : l'arrière-plan de la ligne.
/// Le moteur ne persiste rien entre deux carrières — c'est la coquille (aperçu
/// ou application) qui tient la liste et la passe à [buildFrise].
class FriseCarriere {
  final String nom;
  final int debut;
  final int fin;

  /// L'id de la fin qui a refermé cette carrière (null si elle est en cours).
  final String? finId;
  const FriseCarriere({required this.nom, required this.debut, required this.fin, this.finId});

  Map<String, dynamic> toJson() => {'nom': nom, 'debut': debut, 'fin': fin, 'fin_id': finId};

  factory FriseCarriere.fromJson(Map<String, dynamic> j) => FriseCarriere(
        nom: j['nom'] as String? ?? '',
        debut: (j['debut'] as num?)?.toInt() ?? 0,
        fin: (j['fin'] as num?)?.toInt() ?? 0,
        finId: j['fin_id'] as String?,
      );
}

/// La frise complète, prête à dessiner.
class Frise {
  final int debut;
  final int fin;
  final int annee;
  final List<FriseSaison> saisons;
  final List<FriseJalon> jalons;
  final List<FriseCarriere> carrieres;

  const Frise({
    required this.debut,
    required this.fin,
    required this.annee,
    required this.saisons,
    required this.jalons,
    required this.carrieres,
  });

  Map<String, dynamic> toJson() => {
        'debut': debut,
        'fin': fin,
        'annee': annee,
        'saisons': [for (final s in saisons) s.toJson()],
        'jalons': [for (final j in jalons) j.toJson()],
        'carrieres': [for (final c in carrieres) c.toJson()],
      };
}

// ---------------------------------------------------------------------------
// Les tags de faits posés sur la ligne de Bilan.
// ---------------------------------------------------------------------------

/// Le préfixe des tags de faits qu'une ligne d'Almanach de Bilan porte pour la
/// frise (`rang:12`, `div:2`, `obj:maintien`, `club:Union Vaubelle`).
///
/// Pourquoi des tags et pas un stockage à part : l'Almanach est DÉJÀ le
/// registre daté de la carrière, il est déjà sérialisé dans la sauvegarde,
/// déjà compacté, déjà relu par la Une et par l'écran de fin. Lui ajouter
/// quatre tags coûte quelques octets et évite un second registre qui aurait
/// pu diverger du premier. Les tags de contenu (`tags.yaml`) sont une liste
/// fermée sans ces préfixes : aucune collision possible avec `journal_has()`.
List<String> friseTagsDeBilan({
  required int rang,
  required int division,
  required String objectifTarget,
  required String club,
}) =>
    ['rang:$rang', 'div:$division', 'obj:$objectifTarget', 'club:$club'];

String? _tag(JournalEntry? e, String prefixe) {
  if (e == null) return null;
  for (final t in e.tags) {
    if (t.startsWith(prefixe)) return t.substring(prefixe.length);
  }
  return null;
}

// ---------------------------------------------------------------------------
// La construction.
// ---------------------------------------------------------------------------

/// Le type de pictogramme d'une ligne d'Almanach, ou `null` si la ligne ne
/// mérite pas de pictogramme (une anecdote, une trace : la frise dirait tout
/// et ne montrerait rien).
String? _typeDeLigne(JournalEntry e) {
  switch (e.kind) {
    case 'bilan':
      if (e.tags.contains('titre')) return 'titre';
      if (e.tags.contains('montee')) return 'montee';
      if (e.tags.contains('descente')) return 'descente';
      return null; // « objectif tenu / manqué » est déjà dans la saison
    case 'transition':
      return e.tags.contains('club') ? 'club' : 'role';
    case 'objectif':
      return 'objectif';
    case 'palier':
      return 'palier';
    case 'une':
      return 'une';
    case 'arc':
      return 'arc';
    case 'fin':
      return 'fin';
    default:
      return null;
  }
}

/// L'année d'une saison : celle qu'a écrite l'Almanach si la saison y a laissé
/// une ligne, sinon celle que le calendrier impose (une saison, une année).
int _anneeDeSaison(GameState s, int saison, Map<int, int> anneesVues) =>
    anneesVues[saison] ?? (s.year - (s.season - saison));

/// Le libellé court d'une Nouvelle datée : son titre s'il en a un, sinon la
/// phrase qu'elle dit entre guillemets — c'est là que l'époque parle.
String _labelNouvelle(GameState s, Card c) {
  final t = c.title;
  if (t != null && t.trim().isNotEmpty) return formatText(t.trim(), s);
  var out = c.text;
  final i = out.indexOf('«');
  if (i >= 0) {
    final j = out.indexOf('»', i + 1);
    out = out.substring(i + 1, j < 0 ? out.length : j);
  }
  out = formatText(out, s).trim();
  final p = out.indexOf('. ');
  if (p > 12) out = out.substring(0, p + 1);
  return ellipsizeWords(out, 72);
}

/// Fabrique la frise de l'instant. [carrieres] est l'arrière-plan : les
/// carrières précédentes du même profil, que la coquille tient (le moteur, lui,
/// ne connaît qu'une carrière à la fois).
Frise buildFrise(Content content, GameState s, {List<FriseCarriere> carrieres = const []}) {
  // 1. Ce que l'Almanach sait de chaque saison.
  final anneesVues = <int, int>{};
  final lignes = <int, List<JournalEntry>>{};
  final bilans = <int, JournalEntry>{};
  for (final e in s.journal) {
    anneesVues.putIfAbsent(e.season, () => e.year);
    (lignes[e.season] ??= <JournalEntry>[]).add(e);
    if (e.kind == 'bilan' && (e.tags.contains('bilan_tenu') || e.tags.contains('bilan_manque'))) {
      bilans[e.season] = e;
    }
  }

  // 2. Une ligne par saison jouée, la saison en cours comprise.
  final saisons = <FriseSaison>[];
  for (var i = 0; i <= s.season; i++) {
    final annee = _anneeDeSaison(s, i, anneesVues);
    final b = bilans[i];
    final encours = i == s.season && b == null;
    // Un pictogramme par fait, dans l'ordre où l'Almanach l'a écrit. Deux
    // lignes identiques (le même palier franchi deux fois dans la saison) ne
    // font qu'un pictogramme : la frise montre, elle ne bégaie pas.
    final evenements = <FriseEvenement>[];
    final vus = <String>{};
    for (final e in (lignes[i] ?? const <JournalEntry>[])) {
      final type = _typeDeLigne(e);
      if (type == null || !vus.add('$type|${e.text}')) continue;
      evenements.add(FriseEvenement(type: type, annee: e.year, label: e.text));
    }
    if (encours) {
      // La saison en cours n'a pas de verdict : elle se lit dans le monde.
      saisons.add(FriseSaison(
        saison: i + 1,
        annee: annee,
        club: s.entities.named['club'] ?? '',
        division: s.world.division,
        rang: s.world.blocks > 0 ? s.world.standingRank : 0,
        objectif: s.objectiveTarget.isEmpty ? '' : objectiveLabelFr(s.objectiveTarget),
        tenu: null,
        evenements: evenements,
      ));
    } else {
      final obj = _tag(b, 'obj:');
      saisons.add(FriseSaison(
        saison: i + 1,
        annee: annee,
        club: _tag(b, 'club:') ?? '',
        division: int.tryParse(_tag(b, 'div:') ?? '') ?? 0,
        rang: int.tryParse(_tag(b, 'rang:') ?? '') ?? 0,
        objectif: obj == null ? '' : objectiveLabelFr(obj),
        tenu: b?.tags.contains('bilan_tenu'),
        evenements: evenements,
      ));
    }
  }

  // 3. Les jalons, dans l'ordre du siècle.
  final jalons = <FriseJalon>[];
  //    a. Les Nouvelles datées traversées : l'époque, à sa date à elle.
  for (final id in content.cards.keys.toList()..sort()) {
    final c = content.cards[id]!;
    if (c.year == null || !s.seenCount.containsKey(id)) continue;
    jalons.add(FriseJalon(annee: c.year!, type: 'nouvelle', label: _labelNouvelle(s, c)));
  }
  //    b. Les changements de club et de rôle.
  for (final e in s.journal) {
    if (e.kind != 'transition') continue;
    jalons.add(FriseJalon(annee: e.year, type: e.tags.contains('club') ? 'club' : 'role', label: e.text));
  }
  //    c. Les intrigues refermées.
  for (final a in content.arcsSorted) {
    final st = s.arcs[a.id];
    if (st == null || st.status != 'done' || st.doneSeason == null) continue;
    jalons.add(FriseJalon(
      annee: _anneeDeSaison(s, st.doneSeason!, anneesVues),
      type: 'intrigue',
      label: a.title ?? a.id,
    ));
  }
  jalons.sort((x, y) {
    final c = x.annee.compareTo(y.annee);
    if (c != 0) return c;
    final d = x.type.compareTo(y.type);
    return d != 0 ? d : x.label.compareTo(y.label);
  });
  //    d. Deux jalons identiques (même année, même type, même libellé) n'en
  //       font qu'un — la liste est triée, les doublons sont voisins.
  final jalonsUniques = <FriseJalon>[];
  for (final j in jalons) {
    final k = jalonsUniques.isEmpty ? null : jalonsUniques.last;
    if (k != null && k.annee == j.annee && k.type == j.type && k.label == j.label) continue;
    jalonsUniques.add(j);
  }

  // 4. Les bornes affichées : tout ce que le profil a vécu, carrières
  //    précédentes comprises.
  var debut = saisons.isEmpty ? s.year : saisons.first.annee;
  var fin = s.year;
  for (final c in carrieres) {
    if (c.debut > 0 && c.debut < debut) debut = c.debut;
    if (c.fin > fin) fin = c.fin;
  }
  for (final j in jalonsUniques) {
    if (j.annee > 0 && j.annee < debut) debut = j.annee;
    if (j.annee > fin) fin = j.annee;
  }

  return Frise(
    debut: debut,
    fin: fin,
    annee: s.year,
    saisons: saisons,
    jalons: jalonsUniques,
    carrieres: List.of(carrieres),
  );
}

/// **Quand la frise s'impose d'elle-même**, sans qu'on la demande.
///
/// Trois moments, et seulement trois : la fin d'une carrière (on regarde ce
/// qu'on vient de vivre), l'ouverture d'une saison qui fait basculer une
/// décennie (le siècle tourne une page), et l'ouverture d'une saison qui suit
/// un changement de club ou de rôle (on repart d'ailleurs). Partout ailleurs,
/// c'est le bouton qui l'ouvre.
///
/// « L'ouverture d'une saison » se lit à la carte Objectif : c'est le premier
/// temps servi d'un exercice (le prologue n'existe qu'en saison 0). Pur, sans
/// aléa, sans écriture — la coquille peut l'appeler à chaque rendu.
bool friseAuto(GameState s) {
  if (s.over) return true;
  final p = s.pending;
  if (p == null) return false;
  // a. Le temps qui suit une signature ou une reconversion, y compris en plein
  //    mois de janvier : la ligne d'Almanach vient d'être écrite, au créneau
  //    qu'on est en train de quitter (`slot` avance d'un cran par carte
  //    narrative, et pas du tout sur un match ou un classement).
  //    On remonte les toutes dernières lignes de la saison en cours : le même
  //    swipe a pu écrire, après la transition, l'épilogue d'une intrigue ou un
  //    palier de relation.
  for (var i = s.journal.length - 1; i >= 0; i--) {
    final e = s.journal[i];
    if (e.season != s.season || e.slot < s.slot - 1) break;
    if (e.kind == 'transition') return true;
  }
  // b. L'ouverture d'une saison — la carte Objectif est le premier temps servi
  //    d'un exercice (le prologue n'existe qu'en saison 0).
  if (p.kind != 'objective') return false;
  if (s.season > 0 && s.year % 10 == 0) return true;
  // Un changement décidé au Carrefour de la saison close : sa ligne est écrite
  // après le verdict. On remonte jusqu'au Bilan précédent.
  for (var i = s.journal.length - 1; i >= 0; i--) {
    final e = s.journal[i];
    if (e.kind == 'bilan') break;
    if (e.kind == 'transition') return true;
  }
  return false;
}
