# Équilibrage — étape 0 de la variété narrative : la baseline « avant »

Chiffres figés **avant** le tirage de saison (spec `docs/spec_variete_narrative.md`
§5-6, étape 0), à HEAD `9d9c425` : 336 cartes, 12 arcs (6 séries entraîneur,
0 série joueur), 21 fins, contenu `28a62237`. Aucun changement de moteur ni de
contenu dans cette étape : seul `simulate` gagne les métriques.

Protocole : `simulate --narrative --reservoir --postulat p --runs 200 --seasons 3`,
politique `human_like`, graines `i·2654435761 mod 2³¹` pour i = 0..199 (la liste
que `--narrative` utilisait déjà ; deux exécutions donnent la même sortie au
caractère près). Les seuils sont ceux de la spec §5.1-5.3 ; **aucun `--assert`**
ne les porte encore.

## Comment `simulate` mesure (définitions retenues, approximations)

| Métrique | Ce que compte `simulate` |
|---|---|
| carte d'histoire (Jaccard, noyau) | `payload.kind` ∈ script / etape / evenement / alarme / palier / chaine / passe / reaction — tout sauf routine et Nouvelle |
| temps d'histoire (ouverture, entropie, médianes) | `kStoryKinds` = script / etape / evenement / palier / chaine / reaction (§1.1) |
| intrigue ouverte | arc `kind: serie` dont l'état passe à `armed`/`active` ; slot = `dueN − seasonStartN` de sa première étape, ou le slot courant si elle est servie dans le même tirage (`forceStory` b, alors « forcée ») ; les ouvertures d'une saison jamais jouée (coupure `--seasons`) sont ignorées |
| ensemble / programme S0 | ensemble trié des intrigues ouvertes en S0 / le même ordonné par slot d'ouverture, sur les 100 premières graines |
| Jaccard S0 / carrière | moyenne sur 500 paires (a, b) tirées par un hachage fixe des indices de run |
| Une | `payload.une` si le moteur l'expose, sinon le texte de `bilan_une` où les entités nommées (club, ville, …) sont remplacées par leur placeholder — aujourd'hui une seule phrase fixe |
| traces | drapeaux posés pendant la carrière, hors drapeaux initiaux du postulat et hors `bilan_tenu`/`bilan_manque` (verdict du moteur, pas une trace) |
| D | `0,5·(1−J intrigues) + 0,3·(1−J Unes) + 0,2·(1−J traces)` ; J = 1 quand les deux ensembles sont vides |
| couture | saison S1+ où au moins une carte servie a un `when` (carte, variante d'étape ou entrée d'alarme) qui lit `flag('x')`, `flags.x`, `relation.x`, `relation('x')`, `vars.x` ou `enemy('x')` **posé** (première pose / premier changement) dans une saison antérieure ; approximation : les lectures des set-pieces Dart et des `if` de `next` ne sont pas vues |
| couverture du réservoir | arcs `serie` du rôle dont `postulats` est vide ou contient le postulat ; part des carrières (3 saisons max) où l'arc s'ouvre ; « vues sur 20 carrières » sur les 20 premières graines |
| exposition à 10 carrières | cartes du rôle vues (toutes kinds, beats compris) sur les 10 premières graines / cartes du rôle |
| fil rouge, issues | lus de façon tolérante (`entities.named['fil_rouge']`, `arcs[*].outcome` dans le JSON) : « non mesuré » tant que le moteur ne les pose pas |

## P0 — « Le promu sans un sou » (entraîneur, D1)

| Métrique | Avant | Seuil spec |
|---|---|---|
| Ensembles S0 distincts (100 graines) | **1** | ≥ 25 |
| Programmes S0 distincts | **1** | ≥ 60 |
| Jaccard S0 | **0,71** | ≤ 0,35 |
| Jaccard carrière | **0,47** | ≤ 0,30 |
| Noyau fixe (≥ 90 % des S0) | **10** (a1, a2, a3, a4, a6, kop.local, prodige.gamin_u19, nassir.maillot, vieux.retraite, vieux.epaule) | ≤ 4 |
| Ouverture (5 premiers temps d'histoire identiques) | **65 %** (4 séquences) | ≤ 10 % |
| Entropie d'histoire (séquences (arc, étape) S0 / runs) | **0,25** (50/200) | ≥ 0,9 |
| Rythme : σ du slot de première ouverture · S0 avec deux ouvertures à < 3 slots | **0,00** (toujours slot 3) · **100 %** | ≥ 1,8 · 0 % |
| Couverture du réservoir (6 intrigues) | kop 100 · prodige 100 · gardien 100 · nassir 100 · clow 91 · conf_presse 91 % | chaque ∈ [10 %, 65 %] |
| Intrigues vues sur 20 carrières | 100 % (6/6) | ≥ 70 % |
| Ouvertures forcées / ouvertures | 0 % (0/1252) | ≤ 15 % |
| Distance de carrière D | médiane **0,15** · P10 0,11 (J intrigues 0,94 · J Unes 0,94 · J traces 0,31) | médiane ≥ 0,6 · P10 ≥ 0,35 |
| Exposition à 10 carrières | **33 %** (75/229) | ≥ 70 % |
| Temps d'histoire médian S0 / S1 / S2-S4 | 14 / 12 / **6** | ≥ 12 / ≥ 10 / ≥ 8 |
| Isolement S0 / S1 / S2-S4 | 0 / 3 / 30 % | < 10 / < 20 / < 30 % |
| Coutures (saisons S1+) | **58 %** | ≥ 70 % |
| Unes distinctes / Bilans | **1** / 357 (100 %) | ≥ 12 · aucune > 30 % |
| Porteurs du cast avec ≥ 1 intrigue | 55 % (6/11 : aulard, camille, fardelli, josiane, vukic ne portent rien) | ≥ 80 % |

Interprétation :
- La saison S0 est un rail : les 5 `seeds` du postulat arment toujours kop@3, prodige@4, gardien@7, nassir@8 (le `if` de Nassir est vrai à 100 % avec `caisse: 30`), d'où un seul ensemble, un seul programme, une variance de rythme nulle et 10 cartes de noyau fixe (6 ancres + 4 premières étapes).
- Ce qui varie aujourd'hui vient des choix (traces J = 0,31), pas du tirage : D médian 0,15 quand la spec attend 0,6 ; la Une unique et les intrigues identiques (J = 0,94) plombent les deux tiers de la distance.
- La cadence S0/S1 est exemplaire (écart max 3, 14 temps d'histoire) mais s'effondre en S2 (6, isolement 30 %) parce qu'une série jouée est morte pour la carrière ; c'est le réservoir « 2+ » et la rejouabilité qui doivent le corriger, pas le tirage S0.

## P1 — « L'intérimaire » (entraîneur, D2)

| Métrique | Avant | Seuil spec |
|---|---|---|
| Ensembles S0 distincts (100 graines) | **7** | ≥ 25 |
| Programmes S0 distincts | **15** | ≥ 60 |
| Jaccard S0 | **0,37** | ≤ 0,35 |
| Jaccard carrière | **0,42** | ≤ 0,30 |
| Noyau fixe | 2 (co.script.rentree, co.script.veille) | ≤ 4 |
| Ouverture | 7 % (97 séquences) | ≤ 10 % |
| Entropie d'histoire | **0,68** (136/200) | ≥ 0,9 |
| Rythme : σ · paires < 3 slots | **0,47** (moy 2,7) · 0 % | ≥ 1,8 · 0 % |
| Couverture du réservoir (6 intrigues héritées du promu) | conf_presse 95 · kop 92 · prodige 95 · gardien 88 · clow 52 · nassir 19 % | chaque ∈ [10 %, 65 %] |
| Intrigues vues sur 20 carrières | 100 % (6/6) | ≥ 70 % |
| Ouvertures forcées / ouvertures | **31 %** (327/1049 ; clow 100 %, nassir 53 %, prodige 41 %) | ≤ 15 % |
| Distance de carrière D | médiane **0,28** · P10 0,15 (J intrigues 0,72 · J Unes 0,97 · J traces 0,19) | médiane ≥ 0,6 · P10 ≥ 0,35 |
| Exposition à 10 carrières | 52 % (120/229) | ≥ 70 % |
| Temps d'histoire médian S0 / S1 / S2-S4 | **7 / 8 / 8** | ≥ 12 / ≥ 10 / ≥ 8 |
| Isolement S0 / S1 / S2-S4 | **39 / 30 / 31 %** | < 10 / < 20 / < 30 % |
| Coutures (saisons S1+) | 57 % | ≥ 70 % |
| Unes distinctes / Bilans | **1** / 532 | ≥ 12 · aucune > 30 % |

Interprétation :
- Sans script ni `seeds`, l'intérimaire vit des séries du promu tirées par `maintainArcs` : la variété est meilleure qu'en P0 (7 ensembles, ouverture 7 %, noyau 2) mais elle est **subie** — un tiers des ouvertures sont forcées par `forceStory` (Clow à 100 %) et le premier slot ne bouge presque pas (σ 0,47).
- Le sentiment d'histoire est en dessous de tout : 7 temps d'histoire en S0 et 39 % d'isolement, parce que le script générique n'a que deux ancres et que `min_active: 2` bride l'ouverture.
- Les histoires jouées sont celles d'un autre postulat (Gégé, Mbako, Gigi) : la mesure « couverture » compte ici les 6 séries héritées ; le réservoir propre de §4.2 remplacera cette liste.

## P2 — « La pépite du club-usine » (joueur, D2)

| Métrique | Avant | Seuil spec |
|---|---|---|
| Ensembles / programmes S0 distincts | **1 / 1** (l'ensemble vide) | ≥ 25 / ≥ 60 |
| Jaccard S0 | **0,44** | ≤ 0,35 |
| Jaccard carrière | **0,35** | ≤ 0,30 |
| Noyau fixe | 2 (rentree, veille) | ≤ 4 |
| Ouverture | 13 % (98 séquences) | ≤ 10 % |
| Entropie d'histoire | **0,49** (99/200) | ≥ 0,9 |
| Rythme | aucune ouverture d'intrigue en S0 | σ ≥ 1,8 |
| Couverture du réservoir | non mesuré : **0 arc `serie` pour le rôle joueur** | — |
| Ouvertures forcées | 25 % (2/8, séries entraîneur après une transition de rôle) | ≤ 15 % |
| Distance de carrière D | médiane **0,17** · P10 0,13 (J intrigues 0,98 · J Unes 0,95 · J traces 0,15) | médiane ≥ 0,6 · P10 ≥ 0,35 |
| Exposition à 10 carrières | 65 % (102/156) | ≥ 70 % |
| Temps d'histoire médian S0 / S1 / S2-S4 | **4 / 3 / 3** | ≥ 12 / ≥ 10 / ≥ 8 |
| Isolement S0 / S1 / S2-S4 | **58 / 60 / 61 %** | < 10 / < 20 / < 30 % |
| Coutures (saisons S1+) | **17 %** | ≥ 70 % |
| Unes distinctes / Bilans | **1** / 550 | ≥ 12 |

Interprétation :
- Le joueur n'a aucune intrigue : les 4 temps d'histoire d'une saison sont les deux ancres génériques, une alarme et un palier ; l'entropie 0,49 mesure l'ordre de ces quatre cartes, rien de plus.
- Le Jaccard S0 « bas » (0,44) est un faux ami : il vient du sac de 129 routines tirées au hasard, pas d'histoires différentes — l'isolement à 58-61 % le dit ; D reste à 0,17 parce que les traces sont rares (J traces 0,15 sur très peu de drapeaux).
- Les coutures (17 %) ne tiennent qu'aux relations lues par les paliers : la conversion du sac (§4.6) et `arcs/joueur/` partent de zéro.

## P3 — « Fin de contrat à 31 ans » (joueur, D1)

| Métrique | Avant | Seuil spec |
|---|---|---|
| Ensembles / programmes S0 distincts | **1 / 1** (l'ensemble vide) | ≥ 25 / ≥ 60 |
| Jaccard S0 | **0,51** | ≤ 0,35 |
| Jaccard carrière | **0,34** | ≤ 0,30 |
| Noyau fixe | 2 (rentree, veille) | ≤ 4 |
| Ouverture | 14 % (80 séquences) | ≤ 10 % |
| Entropie d'histoire | **0,40** (80/200) | ≥ 0,9 |
| Rythme | aucune ouverture d'intrigue en S0 | σ ≥ 1,8 |
| Couverture du réservoir | non mesuré : 0 arc `serie` pour le rôle joueur | — |
| Ouvertures forcées | 24 % (38/159, séries entraîneur après transition) | ≤ 15 % |
| Distance de carrière D | médiane **0,18** · P10 0,12 (J intrigues 0,70 · J Unes 0,96 · J traces 0,18) | médiane ≥ 0,6 · P10 ≥ 0,35 |
| Exposition à 10 carrières | 67 % (104/156) | ≥ 70 % |
| Temps d'histoire médian S0 / S1 / S2-S4 | **4 / 3 / 3** | ≥ 12 / ≥ 10 / ≥ 8 |
| Isolement S0 / S1 / S2-S4 | **59 / 54 / 51 %** | < 10 / < 20 / < 30 % |
| Coutures (saisons S1+) | **20 %** | ≥ 70 % |
| Unes distinctes / Bilans | **1** / 512 | ≥ 12 |

Interprétation :
- Même diagnostic que P2 : pas de série joueur, 4 temps d'histoire par saison, plus de la moitié des cartes sans lien ; le `genou` posé au départ n'est lu par aucune intrigue.
- Le Jaccard S0 plus haut qu'en P2 (0,51) vient des alarmes `caisse`/`direction` que le postulat déclenche plus souvent (caisse 60, direction 45) : des cartes d'histoire partagées, mais mécaniques.
- La transition vers le banc (28 transitions sur 200 runs `human_like`, tous postulats confondus) est la seule vraie bifurcation de carrière : c'est elle qui fait baisser J intrigues à 0,70 — les histoires d'entraîneur héritées, pas celles du joueur.

## Ce que les métriques ne voient pas encore

- Fil rouge, issues (`outcome`), réactions, journal, brèves, nom, époque (§5.3) : les champs n'existent pas dans l'état ; `simulate` les lit de façon tolérante et affiche « non mesuré ».
- Les coutures ignorent les set-pieces Dart (texte en dur) et les `if` des `next` : la valeur « avant » est donc une borne supérieure du sentiment de couture réel.
- `--une-check`, `--goldens`, `--arc <id>` viennent avec les étapes 2, 8 et 3.

## Vérifications

- `dart analyze packages/core packages/tools` : propre.
- `cd packages/core && dart test` : 22 tests verts, inchangés.
- `simulate --runs 200 --assert` (budgets existants) : aucun budget violé (human_like médiane 109, p95 406, max 575, en_sms 29 %).
- `simulate --narrative --postulat 0 --runs 200 --seasons 3` deux fois : sorties identiques.
