# Tes fantômes

> « La chronologie va de 1990 à 2050, et tes carrières aussi. À la fin de chacune, le jeu garde
> quelques faits : ton nom, ta fin, trois choix forts. Les livres suivants s'en servent. » (le
> porteur) — une ville qui se souvient de tes carrières précédentes.

Le contenu : `content/ville/fantomes.yaml` (les faits retenus par livre, ce que dit la ville, les
plaques et les photos, les scènes de Mbako) et `content/cards/common/fantomes.yaml` (cinq cartes).
Le système : `packages/tools/web/preview_dossier.js` (ce qui se garde, l'héritage, l'accueil,
l'écran de fin), `Engine.heritage` (packages/core) et `fusibleHeritage` (preview.dart). Le dossier
1974, qui se garde de la même façon : `docs/histoires/dossier_1974.md`.

## 1. Ce qu'une carrière laisse

À la fin d'une carrière (le crochet `fin`), la page garde :

| Champ | Exemple |
|---|---|
| `livre`, `postulat` | `h4`, `fin_de_contrat` |
| `nom` (tel que l'écran de fin le dit), `prenom`, `famille`, `genre` | Marc Chastain, Marc, Chastain, m |
| `debut`, `fin` (les années) | 1990, 1993 |
| `finId`, `finTitre` | `fdc_tour_honneur`, « Le tour d'honneur » |
| `faits` : trois au plus | `h4_tour`, `h4_mbako_cote` |

Les faits sont choisis dans la liste du livre (`fantomes.livres.<livre>.faits`), dans son ordre :
les fins d'abord, puis les choix. Un fait est retenu si la carrière a fini sur une de ses `fins`,
OU posé un de ses `drapeaux`, OU répondu à une de ses `cartes` du côté `cote` — ce dernier cas est
noté par la page au moment du choix (le crochet `reponse`), parce que le moteur ne garde pas le côté
d'une carte (exemple : Mbako, seize ans, assis à ta place, `jp.fin.pro3_place` et
`jp.fin.pro3_place_genou` : à droite « Reste, je me mets à côté », à gauche « Lève-toi, c'est ma
place »). L'écran de fin montre « Ce que la ville gardera » ; l'accueil, « Tes carrières ».

Seules les carrières finies laissent un fantôme. Une carrière abandonnée ne laisse rien ; une pièce
du dossier trouvée en route, si.

## 2. Qui se souvient de qui

Au début d'une carrière (le crochet `debut`), la page compose l'héritage :

- **le passé seulement** : un livre ne reçoit que les carrières des livres qui **commencent avant
  lui** (l'année de départ de son postulat) ; jamais l'inverse, jamais lui-même. Les quatre livres
  de 1990 sont quatre fois le même été : aucun n'est le passé d'un autre ;
- **un fantôme par livre** : la carrière la plus récente de ce livre ;
- pour chacune : le drapeau `fantome_<livre>`, un drapeau `fantome_<fait>` par fait retenu, et deux
  noms, `fantome_<livre>` (le nom de famille, sinon le prénom ; seize lettres au plus) et
  `fantome_<livre>_annees` (« 1990-1993 ») ;
- et le dossier 1974 : un drapeau `dossier_<pièce>` par pièce déjà trouvée.

La règle est celle de l'année de départ du livre, pas de la fin de la carrière : une carrière de
1990 qui a duré jusqu'en 2001 est un fantôme pour *La Maquette* (1999) ; les textes ne parlent que
de ce que le livre a vécu (ses trois premières saisons).

## 3. Le moteur : `Engine.heritage`

```dart
GameState heritage(GameState prev, {Iterable<String> drapeaux = const [], Map<String, String> noms = const {}})
```

- pur comme `activite` (clone, puis applique) et **sans tirage** : `rngState`, la carte en attente,
  les jauges, les swipes ne bougent pas ;
- n'écrit que sous `fantome_` et `dossier_` (`^(fantome|dossier)_[a-z0-9_]{1,40}$`) : un héritage ne
  pose pas de drapeau d'histoire, ne renomme pas le club ;
- les noms passent par `normalizeName` (seize lettres) et la liste noire du contenu, les années par
  `^\d{4}(-\d{4})?$` ; ils entrent dans `entities.named`, dans l'ordre des clés (la sauvegarde
  reste stable) : `formatText` les rend dans les cartes (`{fantome_h4}`, avec l'élision « d'… ») ;
- une carrière finie revient telle quelle.

`preview.dart` : `fusibleHeritage(json)` → la vue, et le champ `fantomes` de la vue (les noms
`fantome_*`), que la ville rend dans ses textes (`ville.js` `remplir`, avec la même élision).

**Pourquoi après `start`, et pas dedans** : la première carte est tirée par `start` ; aucun texte de
fantôme ne vise la première carte, et les drapeaux posés juste après agissent dès le premier choix.
`Engine.start` ne change pas (ni sa signature, ni ses tirages) ; la page appelle `fusibleHeritage`
dans le crochet `debut`, avant que la ville ne démarre (elle reçoit la vue héritée).

**Le déterminisme** (AGENTS.md, les trois règles) : rien n'est tiré, aucune `Map` n'est parcourue
avant un tirage, les drapeaux sont un ensemble trié à la sauvegarde, les noms sont écrits dans
l'ordre des clés. Une carrière **sans héritage** est celle d'avant, carte pour carte (les goldens
ne bougent pas : `packages/core/test/heritage_test.dart` le vérifie sur deux livres). Une carrière
**avec héritage** change, c'est voulu : ses cartes lisent les drapeaux. Le Code de Carrière (graine
+ swipes) ne la rejoue donc qu'avec le même héritage : la page garde l'héritage d'une graine
(`fusible.heritage.v1`) et le reprend pour « Rejouer cette graine » ; un défi entre amis ou un livre
du jour doit partir sans héritage (`FusibleDossier.sansHeritage()` avant `demarrer`).

## 4. Ce que la ville en fait

Deux à quatre échos au moins par livre qui laisse un fantôme, dans les livres d'après :

- **le vieux du Corner** (`ancien`, au bar) raconte tes matchs **en se trompant** — une année, un
  pied, une chambre : « Chastain ? La tête dans la lucarne, en 83. Ou en 84. » (un par livre, h1 à h9) ;
- **les plaques et les murs** (des activités d'un instant, à l'objet qui convient) : la plaque de
  cuivre des entraîneurs au club-house (`{fantome_h1}, {fantome_h1_annees}`), celle de l'intérimaire
  vissée de travers, le crochet du fond et ses couches de sparadrap (DID…), le casier du vétéran, le
  mur des présidents, la feuille des ventes de 2003, la photo des Cobalts de 2011 au salon de l'hôtel,
  les « Recommandations du modèle » avec ton paraphe, la photo du départ de 2030 ; et les faits : la
  plaque gravée au caveau (`h1_plaque`), **le livre de Léa** sur toi à la librairie (`h6_lea`, la
  journaliste trahie), la photo de 2030 où l'on ne te voit que de dos (`h9_dos`) ;
- **ceux qui étaient là** : Gégé et les cartons de masques (ou le brasero), Josiane et la plaque de
  l'intérimaire au tiroir du milieu, Didier Vallin et la clé de la tour (1999), Sandrine Lavergne en
  2011 (le micro, le fauteuil, les chèques renvoyés), la mère de Tibo Rancé après la chambre 12
  (vendu ou gardé en 2003), la fleuriste et la gerbe de novembre, le modèle qui a pris ta voix ;
- **Lian Mbako** (le moment demandé) : seize ans, assis à ta place, un matin de 1990 (*La Route de la
  Rive*). Capitaine en 2011, il le dit aux petits ; **entraîneur en 2024** (*L'Oreillette*), s'il se
  souvient de ce matin-là, il te le dit : la carte `co.fantome.h8_mbako_cote` (ou `_leve`) au tirage
  de sac, et, parce que le livre 8 en sert peu, la même scène en scène de la semaine au centre
  (`fa.sc.h8_mbako_*`) ; l'une tait l'autre (`fantome_h8_mbako_dit`). Président de la Fédération en
  2037, il a fermé l'escalier « quand même ».

Les cartes (`content/cards/common/fantomes.yaml`) sont des cartes du sac, `once`, **de priorité 1** :
le jour où la garde est vraie, la carte passe devant le décor au tirage de sac suivant (une carrière
n'en tire que trois ou quatre). Mesuré (heritage_test, 12 graines du livre 8) : la carte sort dans 8
carrières sur 12 ; les 4 autres ne tirent aucune carte de sac — la scène de la semaine les rattrape.

| Carte | Livre | Garde | Ce qui revient |
|---|---|---|---|
| `co.fantome.h8_mbako_cote` | 8 (ds) | `fantome_h4_mbako_cote` | « En 1990, Chastain m'a fait une place comme ça, sans un mot. » |
| `co.fantome.h8_mbako_leve` | 8 (ds) | `fantome_h4_mbako_leve` | « En 1990, Chastain m'a fait lever de sa place. J'ai mis vingt ans à m'asseoir. » |
| `co.fantome.h5_masques` | 5 (président) | `fantome_h1`, ni brasero ni Hauts | Gégé pose un masque de 1990 sur ton bureau |
| `co.fantome.h6_malbec` | 6 (ds) | `fantome_h5_valise` | Malbec vient voir « si la table est libre » |
| `co.fantome.h9_oreillette` | 9 (sélectionneur) | `fantome_h8_silence` | Léa garde l'oreillette rendue, qui parle encore |

**L'écriture** (la charte) : un fantôme n'a pas de genre (son nom, jamais « il » ni « elle ») ; il ne
raconte que ce que sa carrière a laissé (un fantôme ne vient que d'une carrière jouée) ; il ne dit
rien qu'un livre révèle et que le joueur n'aurait pas lu. Les longueurs se comptent avec un nom de
seize lettres (le lint compte `{fantome_*}` pour seize).

## 5. Ce qui se garde, et où

`localStorage`, chaque accès sous `try`, chaque liste bornée :

| Clé | Contenu | Borne |
|---|---|---|
| `fusible.fantomes.v1` | les carrières finies, la plus récente d'abord | 40 |
| `fusible.fantomes.notes.v1` | les faits notés au choix, par carrière en cours (`graine|postulat`) | 8 carrières |
| `fusible.heritage.v1` | l'héritage donné à une graine (`graine|postulat`), pour la rejouer | 12 |
| `fusible.dossier.v1` | le dossier 1974 (`docs/histoires/dossier_1974.md`) | 13 pièces |

Rien ne sort du navigateur ; rien ne revient au moteur que par `fusibleHeritage`.

## 6. Ce que d'autres modules peuvent lire

`window.FusibleDossier` : `carrieres()`, `heritage()` (ce que la prochaine carrière recevrait),
`sansHeritage()` (la prochaine carrière part sans : un défi, un livre du jour), `pieces()`,
`etat()`, `compte()`, `trouver(id)`, `html()`, `brancher(racine)`, `epilogue()`.

## 7. Vérifier

- `cd packages/core && dart test test/heritage_test.dart` : aucun tirage ; seuls les deux préfixes ;
  une carrière finie ne bouge plus ; sans héritage, la carrière est celle d'avant (livres 1 et 8,
  carte pour carte) ; un souvenir qu'aucune carte du livre ne lit ne change rien ; en 2024, Mbako se
  souvient (le nom rendu, `once`, jamais sans héritage).
- La page (`qa_dossier.js`, le banc du lot) : une carrière du livre 4 où l'on se met à côté de Mbako,
  finie par la ruine (`_essai('paie')`) → l'écran de fin, l'accueil, puis le livre 8 qui reçoit
  `fantome_h4`, `fantome_h4_mbako_cote` et le nom ; la scène du centre (`_essai('scene',
  'fa.sc.h8_mbako_cote')`) et la parole de Mbako (`_essai('parler', 'mbako')`).
