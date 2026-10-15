# Le Fusible — le mode éclair

Le titre du jeu prend tout son sens : « un fusible, ça se change ».

> « Le Fusible : le mode éclair. Une carrière de 10 minutes, avec un rôle et une époque tirés au
> hasard (un entraîneur en 1993, une présidente en 2041). Les quatre jauges sont visibles et
> mortelles, comme dans *Reigns*, et il n'y a pas de ville, seulement les cartes. Le score est le
> nombre de semaines tenues, avec la même graine du jour pour tout le monde. »

Un livre se lit en deux heures, dans une ville, et ses jauges sont cachées (le mode histoire,
`calendar.yaml` `director.jauges_fatales: false`). Le Fusible est l'autre bout du jeu : une carrière
courte, nue, où la tension des quatre jauges est rendue. On glisse, une jauge touche le bas ou le haut,
le fusible saute, on recommence. On ne gagne pas, on tient.

## Ce que c'est, en cinq lignes

- Cinq **postulats cachés**, un par rôle (`eclair_entraineur` … `eclair_selectionneur`), ajoutés à la fin de
  `content/postulats.yaml` : `mode: eclair`. Le moteur copie le mode dans `GameState.mode` au départ ; c'est
  l'état qui décide ensuite (une sauvegarde reprend dans le mode où elle a été jouée).
- Le rôle et la **graine** viennent du défi du jour (la date de Paris, hachée : la même chose pour tout le
  monde, sans serveur) ou d'un tirage libre (« Une autre ») ; **l'époque** (1990–2044, 1999–2044 pour les
  rôles de bureau) sort de la graine, dans `Engine.start`.
- Les quatre jauges sont **visibles et mortelles** ; **pas de ville** : la page contourne toute la coquille
  de la ville le temps d'une partie.
- Le **score** est le nombre de **semaines tenues** (`semainesTenues`, eclair.dart) : trente-six par saison jouée
  plus les journées de la saison en cours. Dix saisons au plus (360 semaines) : la fin « Le fusible a tenu ».
- Une partie éclair ne touche **jamais** aux sauvegardes des livres, au Cimetière ni au compteur de
  carrières : sa seule mémoire est `fusible.eclair.v1`.

## Les garde-fous (ce qui ne doit pas bouger)

Le mode est une propriété de la CARRIÈRE, jamais du contenu : les livres n'en voient rien.

| Garde-fou | Où |
|---|---|
| `GameState.mode` vaut `histoire` par défaut et **n'est écrit dans la sauvegarde que s'il est `eclair`** : une sauvegarde de livre ne change pas d'un octet ; un mode inconnu retombe sur `histoire` | state.dart |
| Le Code de Carrière (graine, postulat, coups) est inchangé ; l'époque et le rôle ne se lisent que dans le postulat éclair | engine.dart |
| **Un seul tirage de plus**, à la fin de `Engine.start`, et seulement pour un postulat qui déclare `annees` (aucun livre n'en déclare) : le flux d'un livre ne bouge pas | engine.dart |
| `jaugesMortelles(content, s)` = le réglage du contenu OU le mode éclair, lu partout où le moteur lisait `jaugesFatales` | eclair.dart |
| Les postulats éclair sont **forcés `chantier`** par `build_content` : jamais sur l'accueil, ni dans l'album, ni dans le titre de l'app Flutter, ni dans les « livres ouverts » du partage ; ils n'entrent dans aucun budget de livre (lint) ni dans `simulate` | build_content.dart, lint.dart, simulate.dart |
| Les fins `ec_tenu_*` **dorment** (aucune n'est une fin de jauge) : elles ne sortent pas du Cimetière | build_content.dart |
| Les goldens (20) et `simulate --runs 2000 --assert` rendent **exactement** la même chose qu'avant le mode (mesuré octet pour octet, voir plus bas) | tests |

### Ce qu'une carrière éclair ne joue pas

Le mode joue le **contenu commun**, et lui seul, plus les cartes `ec.*` des rôles de bureau. Le moteur y ajoute
des gardes, toutes conditionnées par `s.mode == eclair` (un livre garde son tirage tel qu'il est) :

- **aucune carte d'un livre** (`carteDeLivre`, eclair.dart : l'identifiant `…h7.…`, `…h1_…`) ne se sert, même quand
  son auteur a oublié de la garder derrière un drapeau (la réaction orpheline `en.h1.re.gege_berline` du livre 1) ;
- **aucun événement ni rituel d'un livre** : un arc qui nomme ses `postulats` et ne nomme pas le postulat éclair
  n'arme pas (`Director.armEvents`, la boucle des rituels). Pour ouvrir un événement commun au mode, on y ajoute
  l'id du postulat éclair (c'est ce que fait `co.sp.commission`, voir « les fins de longue carrière ») ;
- **pas de grand déballage** : la parole est un compteur caché que rien n'arme, et « Les douze pages » demandent
  douze promesses qu'une carrière de dix minutes n'a pas eu le temps de faire (`_checkEndings`, `armEvents`) ;
- **pas de Carrefour** : aucune transition de rôle n'est offerte, parce qu'une transition recale les jauges à 50,
  ce qui ferait d'un Carrefour une porte de secours (`_bilanCarrefour`).

## Les cinq postulats

| id | index | rôle | époque | fin à 360 semaines |
|---|---|---|---|---|
| `eclair_entraineur` | 10 | entraîneur | 1990–2044 | `ec_tenu_banc` |
| `eclair_joueur` | 11 | joueur | 1990–2044 | `ec_tenu_terrain` |
| `eclair_president` | 12 | président | 1999–2044 | `ec_tenu_loge` |
| `eclair_ds` | 13 | directeur sportif | 1999–2044 | `ec_tenu_bureau` |
| `eclair_selectionneur` | 14 | sélectionneur | 1999–2044 | `ec_tenu_national` |

Chacun : `division: 1`, les quatre jauges à 50, `objective: maintien`, `saisons: 10`, `fin_de_livre: ec_tenu_*`,
`flags: [eclair]`, pas de prologue ni d'arc d'ouverture. **L'index est le Code de Carrière** : on n'insère jamais
un postulat avant eux, on n'en change pas l'ordre. Les âges des personnages sont relatifs au début de la carrière
(`initChars`), pas à l'année : tirer 2038 ne vieillit personne de quarante-huit ans.

**L'entraîneur et le joueur** jouent les intrigues communes que leur programme tire (les anciens réservoirs, hors
des dix livres : un peu plus de 1 200 cartes chacun). **Les trois rôles de bureau vivent dans leurs livres** : ce
qui n'est pas d'un livre y est mince (environ 230 cartes par rôle). C'est pour eux que
`content/cards/{president,ds,selectionneur}/eclair.yaml` (39, 37, 34 cartes) et
`content/cards/common/eclair_bureau.yaml` (17 cartes, les trois rôles) ont été écrits. Toutes les cartes `ec.*`
se lisent derrière `flag('eclair')`. Les visages sont ceux qui tiennent à toute époque (Léa, Nassir, Vialat,
la mère Mbako, Dorian, Malbec ; Fardelli avant 2020, Solvang à partir de 2020). L'entraîneur n'a qu'une carte à
lui, `content/cards/entraineur/eclair.yaml` (la porte de `en_dauphin`, voir plus bas).

Les jauges des bureaux sont les mêmes quatre sous d'autres noms (`roles.yaml`) ; pour les trois cartes communes,
vestiaire = ceux qui travaillent avec toi, tribunes = le public, direction = ceux qui te tiennent (le président,
les actionnaires, la Fédération), caisse = l'argent.

### Le calage de la durée

La cible : une carrière ordinaire de **soixante à cent cartes** (une dizaine de minutes à six ou huit secondes la
carte), une grande carrière bien plus longue. On l'a obtenue **sans toucher à l'échelle des effets**, par le
contenu : la part des cartes qui poussent une jauge d'un seul côté, les cooldowns (≤ 26 cartes, sinon la famine),
les cartes de secours (`rescue:<jauge>`, ×3 quand la jauge est sous 20 ou au-dessus de 80) et de piège (`piege`,
×4 après douze réponses au centre). Les mesures :

Cartes jouées avant que le fusible saute, médiane (et p10–p90) sur 300 carrières par case, quatre joueurs types :
`random` (pile ou face), `novice` (lit la taille des effets, jamais le sens : il se trompe quatre fois sur dix),
`human_like` (se trompe dix-huit fois sur cent), `balancer` (le joueur parfait, qui lit les vrais effets).

| rôle | random | novice | human_like | balancer |
|---|---|---|---|---|
| entraîneur | **71** (36–120) | **95** (44–156) | 156 (70–241) | 203 (87–361) |
| joueur | **80** (38–137) | **104** (47–186) | 169 (80–299) | 195 (92–363) |
| président | **70** (32–126) | **94** (35–179) | 250 (111–342) | 323 (250–358) |
| directeur sportif | **67** (34–117) | **97** (42–182) | 214 (109–322) | 322 (214–358) |
| sélectionneur | **56** (29–111) | **88** (37–167) | 204 (97–319) | 295 (131–328) |

En gras, la cible : un joueur ordinaire tient de soixante à cent cartes. Le score médian (les semaines) va de 66–72
pour un pile ou face à 324 pour un joueur parfait d'un rôle de bureau, et **le fusible a tenu dix saisons** dans
32 à 42 % des carrières parfaites d'un bureau (9 à 10 % pour l'entraîneur et le joueur, dont l'âge et les fins de
carrière coupent avant), 1 à 9 % de celles du joueur type humain. **Aucune famine** (aucune carte de remplissage
servie) sur ces 6 000 carrières, et toutes finissent.

Les chiffres se relisent avec `dart run packages/tools/bin/eclair.dart` (voir « Les outils »).

## Le score et le défi du jour

**Semaines tenues** : `season × 36 + journeeDeSaison(world.blocks)`. Une seule définition, dérivée du monde
simulé (la même que `{journee}` dans les textes) ; jamais du calendrier des cartes, qui compte les vestiaires
comme des matchs. Monotone : un changement de club ne la fait pas reculer. La page la lit sur la vue
(`view.semaines`, preview.dart `_view`), avec `view.mode`.

**Le défi du jour** (`defiDuJour(content, date)`, eclair.dart) :

```
rôle   = postulats éclair[ fnv1a32('fusible|eclair|role|<date>') % 5 ]
graine = fnv1a32('fusible|eclair|graine|<date>') & 0x7FFFFFFF
```

`<date>` est la date du jour **de Paris** (`YYYY-MM-DD`) : le défi change à minuit chez nous, pour tout le monde,
sans serveur. L'époque en découle (tirée de la graine par le moteur). La page en tient **un miroir** (`defiDe`,
preview_eclair.js) parce que le moteur n'est pas chargé quand l'accueil se dessine (les livres arrivent à la
demande) : `eclair_test.dart` épingle les valeurs que le miroir doit rendre (2026-10-15 → entraîneur,
graine 1924176856 ; 10-16 → joueur ; 10-17 → président ; 10-19 → directeur sportif ; 10-20 → sélectionneur).
**Si l'ordre ou le nombre des postulats éclair change, le défi de chaque jour change** : on ne le fait pas.

## La page

`packages/tools/web/preview_eclair.js`, inséré par `assemble.js` dans la fermeture du gabarit (`PREVIEW_MODULES`,
en dernier). Ce qu'il fait, et pourquoi le gabarit n'a presque pas bougé :

- **L'accueil** : la cartouche « Le Fusible » (un fusible de verre en pixel art, la mèche qui brûle, les quatre
  pictogrammes), avant les livres : « Rôle du jour : … », **Graine du jour**, **Une autre**, et **Reprendre**
  quand une partie éclair attend. Elle ne ressemble pas à une histoire : elle n'a ni heure ni livre.
- **Le départ** : une affiche (le rôle, l'année, les quatre jauges, la règle en une phrase), puis la carte.
  Le Fusible n'accepte **aucun héritage** : s'il est là, `FusibleDossier.sansHeritage()` est appelé avant le
  départ (la même graine doit donner la même partie à tout le monde).
- **Pendant** : les quatre jauges visibles (le rail du mode éclair, `body.mode-eclair`), le bandeau du bas dit
  « N semaines tenues », un bouton Accueil dans le menu. La ville est contournée en posant `VILLE = null` : la
  coquille retombe sur son chemin « sans ville », celui de l'aperçu simple. `retourHistoire()` rend tout à
  l'accueil. La partie se garde à chaque réponse (`fusible.eclair.v1`, champ `cours`).
- **La fin** : « Le fusible a sauté » (ou « a tenu »), la jauge fautive, le score en grand, le record,
  « Un fusible, ça se change. » et trois boutons : **Rejouer**, **Graine du jour**, **Accueil**. Un nouveau
  record offre une pochette d'album (`profile.recompenses.pochettes`, preview_album.js).
- **Ce que le mode ne fait jamais** : écrire une sauvegarde de livre (`fusible.ville.v2.<postulat>`, la
  ville de chaque livre ; un balayage retire celle qu'un geste en retard de la ville aurait écrite pour un
  postulat éclair), toucher au Cimetière (`advanceEnd` ne note pas une fin éclair dans le profil), ou compter
  une carrière de livre.

`fusible.eclair.v1` : `{v: 1, best, bestCartes, parties, jours: {<date>: {s, c, r, f}}, cours}` — le record,
les scores des quarante derniers jours, la partie en cours. Tout `localStorage` est dans un `try`.

### Le classement du jour (facultatif, capacité `db`)

Un document par joueur, `eclair/<son id>` = `{date, semaines, cartes, role, fin}`, **écrit une seule fois, à la
fin d'un défi du jour, et seulement s'il fait mieux** que celui du même jour ; jamais au chargement, aucun
nom. La page lit les documents du jour (`where('date', '==', …).limit(1000)`) et écrit « 3ᵉ sur 41 », « en
tête » ; le rang n'existe que si le résultat est dans la base. Sans `db`, sans identifiant, avec une écriture
refusée ou un délai de neuf secondes : le record local reste, sans une erreur à l'écran.

**À la publication** de la page (Artifact), déclarer :

```js
capabilities: {
  user: {},
  downloads: true,                       // le module de partage (WP5)
  db: { rules: [
    { path: "eclair",        read: "view", write: "owner" },
    { path: "eclair/{self}", write: "interact" },
    // + les règles de `jour/<id>` du module de partage
  ] }
}
```

## Les fins de longue carrière

La clôture des livres (la carrière d'un livre s'arrête à sa fin) a rendu inatteignables, dans les livres, les
fins qu'on ne posait qu'au bout d'une longue carrière. Le mode éclair, qui joue jusqu'à dix saisons, en
atteint la plupart. Mesure : `eclair.dart --fins --runs 400` (8 000 carrières : 5 rôles × 4 joueurs types × 400).

Les fins de la liste demandée (celles qu'on ne posait qu'au bout d'une longue carrière), telles que le mode
les atteint — le nombre de carrières sur 8 000, puis le détail par joueur type (`random`, `novice`,
`human_like`, `balancer`) :

| fin | titre | carrières | r / n / h / b | la carte qui la pose |
|---|---|---|---|---|
| `statue_de_bronze` | La statue de bronze | 55 (0,69 %) | 1 / 4 / 20 / 30 | `co.destin.statue_bronze` (entraîneur, joueur) |
| `co_fuyard` | La porte de sortie, la troisième fois | 118 (1,48 %) | 1 / 3 / 46 / 68 | `co.destin.porte_troisieme` (entraîneur, joueur) |
| `jp_consultant` | Le micro du dimanche | 151 (1,89 %) | 7 / 15 / 53 / 76 | `jp.consultant.dimanche_adieu` (joueur) |
| `en_valise` | La valise | 48 (0,60 %) | 5 / 10 / 16 / 17 | `en.evt.enveloppe_federation`, `en.commission.salle_3_valise` (entraîneur) |
| `en_placard` | Promotion-placard | 14 (0,17 %) | 2 / 4 / 5 / 3 | `en.nassir.notification` (entraîneur) |
| `en_retraite` | Le banc en bois | 18 (0,23 %) | 0 / 5 / 4 / 9 | `en.gigi.banc_inaugure` (entraîneur) |
| `en_chaussure` | La chaussure | 10 (0,13 %) | 1 / 2 / 7 / 0 | `en.vestiaire.chaussure` (entraîneur) |
| `ta_loge` | Ta loge | 15 (0,19 %) | 0 / 1 / 3 / 11 | `co.loge.derby` (entraîneur) |
| `co_radiation` | La radiation | 33 (0,41 %) | 0 / 0 / 7 / 26 | `co.sp.commission_jaune`, `co.sp.commission_parle` (joueur) — **porte rouverte par le mode** |
| `en_dauphin` | Le dauphin | 10 (0,13 %) | 1 / 1 / 3 / 5 | `en.adjoint.novembre_banc` (entraîneur) — **porte rouverte par le mode** |
| `co_pacte_tenu` | Le local rénové | 4 (0,05 %) | 0 / 1 / 0 / 3 | `en.kop.anniversaire_inauguration` (entraîneur) — très rare |
| `co_photo_famille` | La photo de famille | 7 (0,09 %) | 0 / 0 / 0 / 7 | `co.verdict.photo_famille` (entraîneur) — très rare (le joueur parfait seulement) |
| `co_retraite` | — | **n'existe pas** dans le contenu (le plus proche : `en_retraite`) | | |

Deux fins n'avaient aucune porte dans une carrière éclair, et le mode leur en ouvre une, sans rien changer
pour les livres :

- **`en_dauphin`** est posée par un script de livre (`en.promu.veille_dauphin`, `en.h2.s3.veille_dauphin`), jamais
  par les intrigues communes. « L'adjoint qui dîne » (`en.adjoint_dine`, dans le programme de l'entraîneur) se
  termine pourtant sur la même scène, en novembre : `en.adjoint.novembre`. Son étape lit maintenant, sous le
  drapeau `eclair`, `en.adjoint.novembre_banc` (`content/cards/entraineur/eclair.yaml`) : laisser le banc à Vukić
  ferme la carrière. Hors éclair le drapeau n'existe pas : la carte de toujours, au même tirage.
- **`co_radiation`** est posée par la commission (`co.sp.commission`, un événement dont `postulats` ne nomme que trois
  livres). Le programme du joueur éclair tire `jp.sp.tripot`, qui pose `sp_tripot_service`, mais une carrière éclair
  n'arme jamais l'événement d'un livre : `eclair_joueur` est maintenant dans la liste de la commission.

Reste que `co_pacte_tenu` et `co_photo_famille` demandent une très longue carrière (près de 200 cartes) et un
joueur qui ne se trompe presque jamais : elles sont atteignables, pas fréquentes. **Cinquante-quatre fins** du
contenu ne sont jamais posées en éclair : les fins des livres (`promu_*`, `interim_*`, `pepite_*`, `trente_*`,
`modele_*`, `fiasco_*`, `geant_*`, `mondial_*`, `escalier_*`, `fdc_*`, `jp_agent`/`jp_exil`/`jp_bache_pliee`),
`generique`, et `co_banqueroute` (la ruine, qui vient de la ville).

## Ce qui a été vérifié à la livraison

- `build_content` (3 988 cartes, 15 postulats, 123 fins), `lint` (0 erreur ; l'avertissement connu des Unes),
  `dart analyze packages/core packages/tools`, `flutter analyze` : propres.
- `dart test` dans `packages/core` : les 250 tests passent, les 20 goldens sans y toucher.
- `simulate --runs 2000 --assert` : sortie identique, octet pour octet, à celle du tronc d'intégration sans le mode.
- `eclair.dart --fuites --runs 150` : aucune carte de livre servie, 0 fuite ; `--runs 300` : aucune famine.
- La page, assemblée, jouée dans Chromium à 393 × 851 et 360 × 640 (Playwright) : l'accueil (la cartouche, aucun
  débordement, des boutons de 40 px et plus), le défi du jour jusqu'à la mort d'une jauge, la fin, Rejouer,
  Reprendre, le retour aux livres (la case du livre en cours n'a pas changé d'un octet), le classement avec une
  `db` simulée (60 autres joueurs : « 25ᵉ sur 61 », un seul document écrit, « seulement s'il fait mieux ») et avec
  une `db` absente, sans identifiant, refusée ou qui plante (aucune erreur à l'écran, aucune écriture).
- Les tests de l'application Flutter : les cinq échecs du tronc d'intégration (« Le promu sans un sou »), ni plus
  ni moins.

## Les outils et les tests

```bash
dart run packages/tools/bin/eclair.dart                       # un tableau par rôle et par joueur type
dart run packages/tools/bin/eclair.dart --postulat 10 --runs 400
dart run packages/tools/bin/eclair.dart --trace 123 --postulat 12 --policy novice   # une carrière lisible
dart run packages/tools/bin/eclair.dart --jours 30            # le défi des trente prochains jours
dart run packages/tools/bin/eclair.dart --fuites --runs 150   # aucune carte de livre ne doit servir (exit 2 sinon)
dart run packages/tools/bin/eclair.dart --fins --runs 400     # les fins atteintes (--policy x : un seul joueur type)
```

`packages/core/test/eclair_test.dart` (23 tests, groupes M L P J S D C T B F V) : le mode (sérialisation), les
livres qui ne bougent pas (les dix livres, deux graines chacun, avec et sans ce que le mode ajoute), les
postulats, une jauge qui fait sauter le fusible (chaque rôle), le score, le défi du jour (valeurs épinglées pour le
miroir de la page), rien d'un livre (cartes, événements, rituels, déballage, famine), les trois cent soixante
semaines d'une carrière qui ne meurt pas, le bandeau, la validation de `build_content`, et les portes des fins.

## Ce qui reste ouvert

- **Le classement du jour** demande la capacité `db` à la publication ; sans elle, le Fusible est un jeu solo
  avec un record local.
- **L'application Flutter** ne joue pas le mode éclair (les postulats `chantier` y sont sautés à la succession) :
  c'est une affaire de la page.
- Le miroir `defiDe` de la page doit rester d'accord avec `defiDuJour` (le test épingle les valeurs, pas le
  code de la page : un changement des deux côtés à la fois passe).
- **Le contenu d'un rôle de bureau** (127 cartes pour trois rôles) est plus court que celui d'un livre : la
  répétition se voit sur une grande carrière (cent cinquante cartes et plus). Les cooldowns la tiennent à
  distance, pas à zéro.
- **La jauge qui tue le plus est la direction à zéro**, pour les cinq rôles (le président, les actionnaires, la
  Fédération, le club : `en_sms`, `jp_place14b`, `ds_commun_accord`, `pr_ag`, `sl_minuit`, de 14 % des carrières
  du joueur à 37 % de celles du sélectionneur, les quatre joueurs types confondus). Les fins de jauge sont celles
  que chaque rôle déclare dans `roles.yaml` : le mode n'en écrit aucune, il n'ajoute que `ec_tenu_*`, la seule
  fin qui ne soit pas une jauge.
