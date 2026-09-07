# Équilibrage — étape 8 : la variété narrative, avant / après

Clôture du lot « variété narrative » (spec `docs/spec_variete_narrative.md` § 6,
étape 8 : *retune et mesure*). Le **avant** est la baseline figée à l'étape 0
(`docs/balance/step4_baseline.md`, HEAD `9d9c425`, 336 cartes, 12 arcs, 21 fins,
1 Une). Le **après** est mesuré sur le dépôt à la fin de ce lot : contenu
`19f6f62c`, **1 241 cartes** (402 dans le sac, 87 réactions, 87 Nouvelles
datées), 241 manchettes, 154 variantes de set-piece sur 9 beats, **70 arcs**,
17 personnages (19 portraits), **42 fins**, 6 destins.

Protocole, inchangé depuis l'étape 0 pour que les deux colonnes se comparent :
`simulate --narrative --reservoir --postulat p --runs 500 --seasons ∞`,
politique `human_like`, graines `i·2654435761 mod 2³¹`. Les budgets globaux sont
lus par `simulate --runs 2000 --assert`, globalement et postulat par postulat.
Deux exécutions donnent la même sortie au caractère près.

---

## 1. Ce que l'étape 8 a changé (le retune lui-même)

Sept réglages, tous mesurés avant/après. Rien d'autre n'a bougé : les magnitudes
de `content/balance.yaml` (5 / 10 / 18), `reactions_max` (4) et `soft_steps_max`
(12) sont **restés tels quels**, et la raison est écrite ci-dessous.

| Réglage | Avant | Après | Pourquoi, et ce que ça déplace |
|---|---|---|---|
| `force` du promu (`postulats.yaml`) | 52 | **55** | À 52 contre une D1 à 62 de base, la descente était fréquente et sa facture (−25 direction) faisait du SMS de 23h47 la fin de **42 %** des carrières du promu — au-dessus du plafond de 40 % (§ 5.3) et, surtout, quatre relances sur dix qui finissent sur le même écran. Après : **en_sms 38 %**, médiane 85 cartes, 93 % des carrières atteignent leur premier Bilan. L'effectif reste le plus faible de l'étage (−7) et `co_relegation` reste servie (7 %). |
| `ouverture_echeance` (`calendar.yaml`) | 5 | **7** | Avec les quatre réservoirs pleins, trois premières étapes tirées dans la même fenêtre arrivaient à échéance ensemble : backlog P99 **3** (max 4) en S0 et en S1 du promu, pour un plafond de 2, avec des empilements `etape+etape+etape`. Après : **P99 2** sur les quatre postulats, sans dégrader le taux d'étapes échues (S0 13 %, S1 38 % ; plafonds 60 % et 40 %). |
| Échelonnement des alarmes (`director.raiseAlarms`) | +1 créneau par alarme en attente | **+2** | Trois jauges qui franchissent 20/80 au même tirage (le Bilan qui tombe) donnaient trois alarmes aux créneaux 3-4-5. Une alarme n'est pas un temps d'histoire : le joueur lisait quatre cartes sans histoire. Mesuré sur la pépite (graine 698041536). Après : plus aucun écart > 3 en S0-S1, > 4 en S2+. |
| `forceStory` (b) : `_openableNow` | l'intrigue tirée était armée sans vérifier sa carte d'ouverture | **filtre rôle + statut + `when` avant d'armer** | Quand la carte d'ouverture n'était pas servable (locuteur parti, `when` faux), l'intrigue était armée pour rien, la purge du tirage suivant l'annulait, et le créneau retombait sur une carte de sac. C'était à la fois un trou de cadence en fin de saison **et une intrigue brûlée sans avoir été lue**. Mesuré sur l'intérimaire, graine 521863682 : à la fin d'une S1, `eligibleArcs` rendait 12 intrigues, celle qui était tirée n'était pas servable, et la saison finissait sur quatre cartes de sac d'affilée (écart 5). Après : écart max 3 sur les quatre postulats. Le compteur d'annulations, lui, ne bouge pas — ces armements-là tombaient déjà dans `ineligible`, qui est hors du total. |
| `forceStory` (c) : le filet de rattrapage | étapes et chaînes seulement | **+ paliers, s'ils tombaient dans les 3 créneaux** | Une file qui ne contenait plus qu'un palier laissait `forceStory` rendre `null`. Un palier est un temps d'histoire et il se décale déjà : l'avancer d'un cran vaut mieux que quatre cartes de sac. La limite des 3 créneaux garde la règle « une cible programmée ne sort jamais du sac » (test `director_test`). |
| `kStoryKinds` : le kind `passe` | hors « temps d'histoire » | **compté** | « Nouvelles du passé » (ce qu'est devenue une intrigue laissée dans l'ancien club) est une scène avec un locuteur qui conclut une histoire ; la mesure de variété la comptait déjà comme carte d'histoire. Servie en bande 6 dans un creux, elle donnait un écart mesuré de 4 alors que le joueur venait de lire une histoire. Correction de **définition**, documentée ici parce qu'elle rend la mesure plus indulgente : les autres écarts corrigés ci-dessus, eux, sont réels. |
| `age` de « Fin de contrat à 31 ans » | tiré dans la bande du rôle joueur `[19, 31]` | **déclaré : 31** | La pochette promet 31 ans et la barre d'état annonçait « 23 ans » (vu à l'aperçu, capture `40_p3_carte.png`). La porte `age >= 32 \|\| flag('genou')` du rôle ne tenait que par le drapeau. |

**Ce qui n'a pas bougé, et pourquoi.** `balance.yaml` (5/10/18) : les quatre
postulats tiennent déjà la bande de durée, changer les magnitudes aurait déplacé
tous les budgets pour rien. `reactions_max: 4` : mesuré à 2,1-2,4 réactions par
saison pour une bande de 1,5-3, max 4, zéro consécutive, latence 1 à 100 % — le
plafond n'est pas le facteur limitant. `soft_steps_max: 12` : essayé à 14, sans
le moindre effet sur le backlog (le quota n'est jamais le mur : c'est
l'échéance qui l'était, d'où `ouverture_echeance`). Le poids de la cadence
forcée (`gap_max: 2`) reste à 2 : les ouvertures forcées sont à 5-10 % des
ouvertures pour un plafond de 15 %.

---

## 2. Budgets globaux (`simulate --runs 2000 --assert`)

Bandes de la commande de clôture : médiane `human_like` ∈ [60, 200], P95 ≤ 600,
aucun run > 1 500, première saison ni expédiée ni interminable, aucune cause de
mort > 40 % (§ 5.3). L'assert porte désormais ces bandes (il tolérait
[20, 320] / 55 % à l'étape 0) et il tourne **par postulat**, quatre fois, en
plus du tirage global.

| | médiane | P95 | max | saisons moy | S0 close | 1re cause de fin |
|---|---|---|---|---|---|---|
| tous postulats | 108 | 255 | 408 | 2,8 | 94 % | grand_deballage 27 % |
| P0 promu | **85** | 201 | 367 | 2,1 | 93 % | en_sms 38 % |
| P1 intérimaire | **126** | 255 | 408 | 3,2 | 91 % | en_sms 35 % |
| P2 pépite | **116** | 265 | 555 | 3,0 | 92 % | grand_deballage 26 % |
| P3 fin de contrat | **110** | 277 | 429 | 3,1 | 100 % | grand_deballage 35 % |

« S0 close » = part des carrières qui atteignent leur premier Bilan (la Une, le
Verdict, le carrefour). C'est la mesure de « première saison ni expédiée » ;
« interminable » n'existe pas côté saison (17 créneaux fixes) et se lit sur le
P95 / max de la carrière. Avant l'étape 8 : P0 en_sms 42 % (budget violé),
S0 close 92 %.

Rappel « avant » (étape 0, `--runs 200`, tous postulats) : médiane 109, P95 406,
max 575, en_sms 29 %. La durée n'a donc pas dérivé alors que le contenu a été
multiplié par 3,7 — c'est ce que la commande demandait de vérifier.

---

## 3. Variété perçue (§ 5.1) — avant / après, par postulat

« Avant » = `docs/balance/step4_baseline.md`. Tous les seuils sont ceux de la
spec § 5.1.

| Métrique (seuil) | P0 avant → après | P1 avant → après | P2 avant → après | P3 avant → après |
|---|---|---|---|---|
| Ensembles S0 distincts (≥ 25) | 1 → **58** | 7 → **43** | 1 → **59** | 1 → **38** |
| Programmes S0 distincts (≥ 60) | 1 → **100** | 15 → **100** | 1 → **100** | 1 → **100** |
| Jaccard S0 (≤ 0,35) | 0,71 → **0,22** | 0,37 → **0,25** | 0,44 → **0,22** | 0,51 → **0,20** |
| Jaccard carrière (≤ 0,30) | 0,47 → **0,19** | 0,42 → **0,20** | 0,35 → **0,21** | 0,34 → **0,19** |
| Noyau fixe (≤ 4) | 10 → **1** | 2 → **2** | 2 → **0** | 2 → **0** |
| Ouverture identique (≤ 10 %) | 65 % → **3 %** | 7 % → **6 %** | 13 % → **5 %** | 14 % → **6 %** |
| Entropie d'histoire (≥ 0,9) | 0,25 → **0,99** | 0,68 → **0,97** | 0,49 → **1,00** | 0,40 → **1,00** |
| Rythme : σ du 1er slot (≥ 1,8) · paires < 3 slots (0 %) | 0,00 / 100 % → **1,92 / 0 %** | 0,47 / 0 % → **2,16 / 0 %** | — → **1,83 / 0 %** | — → **1,83 / 0 %** |
| Couverture : chaque intrigue ∈ [10 %, 65 %] | 6, toutes à 91-100 % → **19, toutes ∈ [12 %, 57 %]** ✔ | 6 héritées → 28, ∈ [8 %, 55 %] ✗ (`gigi_staff` 8 %) | 0 → **23, ∈ [10 %, 61 %]** ✔ | 0 → 19, deux à la limite basse ✗ (`brassard_20`, `pari`) |
| Signature ∈ [50 %, 65 %] | — → **kop 57 %** | — → **vestiaire_ancien 53 %** | — → **tifo 60 %** | — → **vestiaire_porte 52 %** |
| Intrigues vues sur 20 carrières (≥ 70 %) | 100 % → **100 %** | 100 % → **96 %** | — → **100 %** | — → **100 %** |
| Ouvertures forcées (≤ 15 %) | 0 % → **5 %** | 31 % → **8 %** | 25 % → **6 %** | 24 % → **10 %** |
| Fil rouge (aucune < 25 %) | — → **33/34/33 %** | — → **34/33/33 %** | — → **35/32/33 %** | — → **36/34/30 %** |
| **Distance de carrière D** (médiane ≥ 0,6 ; P10 ≥ 0,35) | 0,15 / 0,11 → **0,81 / 0,65** | 0,28 / 0,15 → **0,80 / 0,65** | 0,17 / 0,13 → **0,80 / 0,67** | 0,18 / 0,12 → **0,81 / 0,65** |
| Exposition à 10 carrières (≥ 70 %) | 33 % → **32 %** ✗ | 52 % → **36 %** ✗ | 65 % → **43 %** ✗ | 67 % → **35 %** ✗ |

Trois cases rouges : l'exposition à 10 carrières sur les quatre postulats
(§ 7.1) et la couverture du réservoir sur deux d'entre eux (§ 7.3). Tout le
reste tient, y compris les six budgets que la baseline donnait au rouge sur
les quatre postulats.

---

## 4. Sentiment d'histoire (§ 5.2)

| Métrique (seuil) | P0 | P1 | P2 | P3 |
|---|---|---|---|---|
| Temps d'histoire médian S0 / S1 / S2-S4 / S5-S8 (≥ 12 / 10 / 8 / 6) | 15 / 13 / 11 / 9 | 16 / 13 / 12 / 11 | 15 / 12 / 13 / 12 | 15 / 14 / 12 / 11 |
| *avant (étape 0)* | *14 / 12 / 6 / —* | *7 / 8 / 8 / —* | *4 / 3 / 3 / —* | *4 / 3 / 3 / —* |
| Isolement S0 / S1 / S2-S4 / S5-S8 (< 10 / 20 / 30 / 40 %) | 7 / 5 / 8 / 10 % | 5 / 6 / 9 / 9 % | 6 / 8 / 5 / 7 % | 8 / 4 / 8 / 9 % |
| *avant* | *0 / 3 / 30 %* | *39 / 30 / 31 %* | *58 / 60 / 61 %* | *59 / 54 / 51 %* |
| Écart max entre temps d'histoire (≤ 3 S0-S1, ≤ 4 S2+) | 3 / 3 / 3 | 3 / 3 / 3 | 3 / 3 / 3 | 3 / 3 / 3 |
| *avant l'étape 8 (mêmes 500 graines)* | *3 / **4** / 3* | *3 / 3 / **4*** | *3 / **4** / 3* | *3 / 3 / 3* |
| **Coutures** (≥ 70 % des saisons S1+) | **87 %** | **85 %** | **79 %** | **88 %** |
| *avant (étape 0)* | *58 %* | *57 %* | *17 %* | *20 %* |
| Réactions/saison (1,5-3 · max ≤ 4 · 0 consécutive · latence 1 à 100 %) | 2,36 ✔ | 2,08 ✔ | 2,11 ✔ | 2,16 ✔ |
| Échéances : échues S0 / backlog P99 (≤ 60 % / ≤ 2) | 13 % / 2 | 20 % / 2 | 15 % / 2 | 12 % / 2 |
| *avant l'étape 8* | *15 % / **3*** | *20 % / 2* | *15 % / 2* | *12 % / 2* |
| Visages du cast portant ≥ 1 intrigue (≥ 80 %) | **100 %** (13/13) | 100 % | 100 % | 100 % |
| Famine · cartes hors rôle · locuteur muet | 0 · 0 · 0 | 0 · 0 · 0 | 0 · 0 · 0 | 0 · 0 · 0 |

---

## 5. Journal, Une, nom, époque (§ 5.3)

| Métrique (seuil) | P0 | P1 | P2 | P3 |
|---|---|---|---|---|
| Unes distinctes (≥ 12) · la plus fréquente (≤ 30 %) | **57** · 11 % | 37 · 18 % | 53 · 15 % | 48 · 11 % |
| Génériques (< 25 %) · secours (< 10 %) | 0 % · 0 % | 0 % · 0 % | 0 % · 0 % | 0 % · 0 % |
| « La Une ne ment pas » (100 %) | 100 % (1 119) | 100 % (1 672) | 100 % (1 663) | 100 % (1 717) |
| Brèves : Bilans à 3 brèves du journal (≥ 90 %) | 100 % | 99 % | 96 % | 100 % |
| Journal : entrées de poids ≥ 2 par saison (≥ 3 ; ≤ 12 après compaction) | méd. 11 | 9 | 9 | 10 |
| Nom : saisons à ≥ 2 cartes nommées (≥ 95 %) · moyenne | 97 % · 5,3 | 100 % · 5,8 | 95 % · 5,3 | 96 % · 5,2 |
| Deux cartes de nom de suite (hors `{toi}`) | 0 | 0 | 0 | 0 |
| Placeholders non résolus (0) | 0 | 0 | 0 | 0 |
| Nouvelles datées servies / perdues par run | 10,0 / 0,04 | 10,1 / 0,04 | 9,9 / 0,01 | 10,1 / 0,03 |
| Set-pieces servis en variante hors secours (≥ 50 %) | 99 % | 99 % | 100 % | 100 % |
| Fins servies (chacune ≥ 1 fois ; aucune > 40 %) | 22 à 500 runs, **24/24 à 3 000** | 21 (2 manquantes à 500) | 24 (4 manquantes) | 29 (2 manquantes) |

Avant l'étape 0 : **1 Une** pour tous les postulats, nom prononcé **0 fois par
carrière**, aucune brève, aucun journal.

Les fins « manquantes » à 500 runs sont un effet d'échantillon, pas une porte
fermée : sur le promu à 3 000 runs, `en_retraite` (dix saisons de carrière)
sort et le compte passe à 24/24 ✔. Les fins de jauge du rôle joueur
(`jp_mouton`, `jp_sansclub`, `jp_bache_pliee`, `jp_statue`) demandent le même
volume ; elles sont servies sur les postulats où leur porte s'ouvre le plus.

---

## 6. Goldens (G1) et reproductibilité

`content/tests/goldens.yaml` fige **20 Codes de Carrière** : 5 graines × 4
postulats, la suite complète des swipes écrite dans le code lui-même. Chaque
code est rejoué du premier écran à la fin et réduit à quatre valeurs : la fin
atteinte, les cartes servies, le hachage FNV-1a des ids servis dans l'ordre
(« ce que la graine raconte ») et `GameState.fingerprint()` du dernier état.

- **Vérification** : `packages/core/test/goldens_test.dart` (3 tests) et
  `dart run packages/tools/bin/simulate.dart --goldens`.
- **Régénération** : `dart run packages/tools/bin/simulate.dart --goldens --write`.
  Les codes déjà figés sont **rejoués tels quels** : le contenu change, le code
  ne bouge pas, et le diff dit « cette carrière-là ne raconte plus la même
  chose ». Ajouter `--recode` uniquement quand les swipes eux-mêmes n'ont plus
  de sens (une saison qui change de longueur, un bump de `meta.version`).
- **Un golden rouge n'est pas forcément un bug** : c'est un changement de
  contenu ou de moteur qui déplace une carrière. La marche à suivre est écrite
  en tête du fichier et en tête du test : lire le diff, rejouer la graine en
  `--trace`, puis régénérer.

Les 20 codes couvrent les 4 postulats (5 chacun) et portent **13 fins
distinctes** : `grand_deballage` ×3, `co_dix_huit_mois` ×3, `co_cheque`,
`en_sms`, `jp_porteparole` ×2 chacune, puis `statue_de_bronze`, `jp_panama`,
`jp_croises`, `jp_coup_de_tete`, `en_decoupe`, `en_copain`, `en_banderole`,
`co_relegation`. Un code plafonné (400 swipes sans mourir) resterait un golden
valide — il fige un début de carrière — mais le test refuse un fichier où plus
de cinq codes sur vingt ne meurent plus : les swipes figés ne raconteraient
alors plus une carrière entière et il faut les retirer (`--recode`).

Le déterminisme reste vérifié par ailleurs : 25 graines × 4 postulats × 2
exécutions identiques (`director_test`), et deux exécutions de `simulate`
donnent la même sortie au caractère près.

---

## 7. Ce qui reste ouvert

Quatre choses, toutes mesurées, aucune bloquante pour la boucle de jeu.

**1. Exposition à 10 carrières : 32-43 % pour un seuil de 70 % (§ 5.1).**
C'est le budget le plus rouge du lot, et c'est un problème d'arithmétique, pas
de tirage. Un postulat rend 560-690 cartes atteignables ; dix carrières de
`human_like` servent 110 cartes en médiane, dont 4 Nouvelles et 2 réactions par
saison — soit au mieux ≈ 1 100 tirages pour 600 cartes, avec les répétitions
inévitables du sac et les gardes d'état. Le détail que `simulate` imprime le
dit : sur le promu, 201 cartes sont derrière une **garde d'état** (une relation,
un drapeau, une jauge), 164 ne sont **jamais tirées** en dix carrières faute de
créneaux de sac, 44 sont des **variantes perdantes** (une autre variante de la
même étape gagne). Le même dénominateur mesuré sur **3 000 carrières** rend
**90 %** (585/650) : le contenu est atteignable, il ne tient pas en dix parties.
Deux issues possibles, à arbitrer au prochain lot : baisser le seuil à ce que dix
carrières peuvent honnêtement montrer (≈ 45 %) en gardant les 90 % à 3 000
carrières comme vrai budget de couverture, ou réduire le nombre de cartes
derrière une garde d'état. Ne pas écrire moins : le volume est ce qui fait la
distance D à 0,80.

**2. Récurrence du casting en S0 : le président (§ 5.2).** Seul budget que
`--narrative --assert` refuse encore, sur P0 et P1. Le seuil demande Vaubourg
≥ 3 fois dans ≥ 90 % des premières saisons ; il l'est dans **79 %** (promu,
moyenne 3,3 par S0) et **59 %** (intérimaire, moyenne 2,8). Ce n'est **pas** un
problème de poids : la dette de visage a été testée avec un plafond porté de
2,0 à 3,0 et les deux chiffres n'ont pas bougé d'un point — la S0 ne tire
qu'une carte et demie dans le sac, et le président y est déjà prioritaire. Il
manque une **scène** de président par première saison, à écrire (le postulat
s'appelle « L'intérimaire » : l'homme qui décide si l'intérim continue devrait
être la présence la plus lourde de la S0). Ticket de contenu, pas de réglage.
La lecture des vérificateurs dit la même chose que la mesure, ce qui est le
meilleur argument pour l'écrire plutôt que pour baisser la cible.

**3. Couverture du réservoir : trois intrigues sous le plancher de 10 %
(§ 5.1, non asserté).** Aucune intrigue n'est jamais ouverte sur les quatre
postulats — c'était le vrai risque et il est levé. Restent trois entrées sous la
bande basse : `en.gigi_staff` s'ouvre dans 8 % des carrières de l'intérimaire
(elle y partage son porteur, Gigi, avec `en.vieux_gardien` à 55 %, qui gagne le
tirage), et `jp.brassard_20` / `jp.pari` sont à la limite du dixième sur la fin
de contrat. Réglage possible au prochain lot : un poids d'entrée sur ces trois
lignes du `programme`, ou un porteur de secours pour Gigi.

**4. Deux indicateurs d'hygiène (non assertés) au-dessus de leur repère.**
« Cadence forcée par saison » 0,50-0,51 pour un repère de 0,5 sur P0 et P3 :
une ouverture forcée toutes les deux saisons, c'est-à-dire le metteur en scène
qui comble un creux au lieu de le laisser. « Annulations par run hors
inéligible » 1,44 (P0) à 2,88 (P3) pour un repère de 1 : la tête de liste est
`club` (une intrigue laissée dans l'ancien club, 288 sur P0) et `deja_vue`, deux
causes normales quand un joueur change de club ; sur la fin de contrat s'y
ajoute `role` (508), la transition joueur → banc. Ce sont des annulations
attendues, mesurées contre un repère écrit avant que les transitions de rôle
soient fréquentes. À relire au prochain lot — le repère, autant que la valeur.

**Playtest humain (§ 5.4).** Non fait : il demande trois testeurs humains ×
trois carrières. Les rapports iront dans `docs/balance/step4_playtest_<postulat>.md`.
L'aperçu jouable ci-dessous est prêt pour ça.

---

## 8. Aperçu jouable et app

**Aperçu** (`dart compile js -O2 packages/tools/web/preview.dart` puis
`node packages/tools/web/assemble.js`) : reconstruit sur le contenu `19f6f62c`,
4,2 Mo, un seul fichier. Vérifié sous Chromium headless en 400 × 860, quatre
postulats × 40 cartes, nom saisi (« Sylvie Beaugendre », genre ♀) :

- **0 erreur JS, 0 erreur de console** ;
- aucun débordement horizontal de la page sur les 160 écrans visités ;
- portrait présent sur **160/160** cartes ; 33-34 textes distincts par série de
  40 cartes (aucune boucle) ;
- une **page de Une** atteinte et lue sur les quatre postulats, opacité 1 après
  son dépliage (manchette, photo légendée, trois brèves, verdict) ;
- captures dans le dossier `shots/` du scratchpad (`00_titre`, `p0..p3` carte /
  Une / fin).

Trois défauts vus **dans les captures** et corrigés dans ce lot :

1. **L'aperçu s'affichait en mojibake** (`DÃ©CHIRE UNE POCHETTE`,
   `La pÃ©pite du club-usine`). Le gabarit n'avait **aucun `<meta charset>`** :
   ouvert en `file://`, le navigateur lisait l'UTF-8 en latin-1. Un jeu écrit
   en français ne peut pas laisser ça se deviner — `<meta charset="utf-8">` (et
   le `viewport`) sont désormais les premières lignes du `<head>`.
2. **Les trois familles de l'identité album venaient de la CDN Google Fonts** :
   hors ligne, la page perdait sa typographie et crachait quatre erreurs de
   console. `assemble.js` incruste maintenant les `.ttf` de `app/assets/fonts`
   (les mêmes que l'app Flutter) en `@font-face` `data:`. L'aperçu est un
   fichier unique qui se lit sans réseau ; si les `.ttf` manquent, il retombe
   sur les `<link>` de la CDN.

3. **Le bandeau de promesse créditait le mauvais homme.** « PROMIS À
   JEAN-MARIE VAUBOURG : TOP 5 » sur une carrière de joueur, alors que la carte
   Objectif est tenue par l'agent — le postulat déclare `patron: fardelli` et
   le moteur le sait déjà (`_patronOf`). L'aperçu **et** l'app lisaient
   `entities.named['president']`, qui ne nomme que le président. `Engine`
   expose maintenant `patronName(s)` (le patron **du rôle courant**, donc juste
   après une transition joueur → banc aussi) et les deux surfaces le lisent.
   Vérifié à la capture : « PROMIS À ROCCO FARDELLI : TOP 10 ».

**App Flutter** : `flutter analyze` propre, `flutter test` vert (5 tests) avec
le bundle de 1 241 cartes.

---

## 9. Vérifications de sortie

- `dart analyze packages/core packages/tools` : propre.
- `dart run packages/tools/bin/build_content.dart` : OK, contenu `19f6f62c`.
- `dart run packages/tools/bin/lint.dart` : 1 241 cartes, 70 arcs, **0 erreur, 0 avertissement**.
- `cd packages/core && dart test` : **80 tests verts** (77 + les 3 goldens).
- `simulate --runs 2000 --assert` : aucun budget violé, globalement **et** sur
  chacun des quatre postulats.
- `simulate --une-check` : 100 %, aucun placeholder non résolu.
- `simulate --goldens` : les 20 codes racontent la même carrière qu'au moment où
  ils ont été figés.
- `simulate --narrative --postulat p --runs 500 --assert` : vert sur P2 et P3 ;
  un budget rouge sur P0 et P1 (récurrence du casting en S0, § 7.2).
- Aperçu assemblé et vérifié sous Playwright (§ 8) ; `flutter analyze` et
  `flutter test` verts.
