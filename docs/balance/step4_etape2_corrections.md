# Équilibrage — étape 2 (corrections après vérification) : la Une ne ment plus, cadence S0 ≤ 3

Lot de corrections des défauts relevés par le vérificateur sur l'étape 2 de la
variété narrative (`docs/spec_variete_narrative.md`). Contenu : 372 cartes, 56
manchettes, 14 arcs. Protocole identique à `step4_baseline.md` :
`simulate --narrative --postulat 0 --runs 300 --seasons 3` (politique
`human_like`, graines `i·2654435761 mod 2³¹`), `--une-check --runs 300` sur les
4 postulats, `--runs 500 --assert`, plus un harnais temporaire (hors dépôt) qui
détaille chaque S0/S1 créneau par créneau. Deux exécutions donnent la même
sortie au caractère près (déterminisme conservé ; test 25 graines × 4 postulats).

## 1. La Une ne ment plus sur la descente (bloquant)

**Cause.** `seasonVerdict` renvoyait `descente` (rang 18) en Division 2 alors que
le jeu n'a pas d'étage en dessous (`_resolveBilan` ne descend jamais depuis la
D2), et les trois manchettes de descente lisaient `bilan.rang >= 17` : elles
partaient dès le rang 17 (pire maintien) et au rang 18 en D2. Mesuré sur 300
carrières × 2 saisons : **196 manchettes « descente » servies pour 93 descentes
réelles**.

**Correction, à la racine.**
- `world.dart` : en D2, ≤ 36 points donne l'issue **`lanterne`** (rang 18, même
  facture qu'une descente, objectif « maintien » manqué, aucun changement de
  division). `descente` n'existe plus qu'en D1 ; `SeasonVerdict.relegated` /
  `promoted` ; `kVerdictOutcomes` exporté pour le lint.
- `condition.dart` / `engine.dart` : nouveau chemin **`bilan.outcome`** (titre /
  europe / montee / barrage / maintien / descente / lanterne), posé par
  `_bilanUne` avec `bilan.tenu` / `bilan.rang` ; `payload.outcome` de la Une ;
  chaque ligne d'Almanach du Verdict porte sa clé en tag (`bilan_tenu`,
  `descente`, `montee`, `titre`).
- `unes.yaml` : les trois manchettes de descente lisent `bilan.outcome ==
  'descente'`, « MONTÉE ! » lit `montee`, « CHAMPIONS ! » lit `titre` (1er de D2
  n'est pas champion du pays) ; deux manchettes honnêtes pour la lanterne rouge
  de D2 (« {VILLE} FERME LA MARCHE », « DERNIERS, ET TOUJOURS LÀ »).
- `lint.dart` : une manchette dont le titre ou le sous-titre affirme une
  descente / une montée / un sacre sans lire `bilan.outcome` = **erreur** ;
  `bilan.outcome` comparé à une issue inconnue = erreur.
- `simulate --une-check` et le test **U2** comparent désormais aussi
  `payload.outcome` aux lignes d'Almanach écrites au swipe du Verdict, la
  division qui bouge (ou non), et les mots du gabarit de la manchette
  (« descend », « étage du dessous », « montée », « champion ») à ce que le
  Verdict a réellement écrit.

**Mesure après.** `--une-check --runs 300` : 100 % sur les 4 postulats (1144 /
1361 / 1740 / 1284 Bilans). Harnais : **100 manchettes « descente » pour 100
descentes réelles**. Trace 123 : plus de manchette de descente suivie de « Le
maintien, c'est bien ».

## 2. Cadence S0 ≤ 3 et l'ordre du tirage (majeurs 2 et 3)

**Diagnostic (harnais, 300 S0).** Les trous de 4-5 cartes n'étaient pas des
saisons sans candidat : dans 9 cas sur 10 le motif est `S r r A S` — une alarme
de bande 3 (pas un temps d'histoire) prend exactement le créneau où la cadence
forcée devait servir une étape. Le dixième cas est deux alarmes de suite.

**Mesure des ordres possibles** (S0, 300 saisons ; « ≤ 3 » = part des saisons
dont l'écart max entre temps d'histoire est ≤ 3 ; Nouvelles = saisons à 3-4) :

| Ordre de `drawNarrative` | écart max S0 | S0 à ≤ 3 | S1 à ≤ 3 | Nouvelles 3-4 S0 |
|---|---|---|---|---|
| spec HEAD `7c5a728` : bandes 3-7 → Nouvelle → bande 2 → cadence forcée (gap_max 2) | 5 | 66 % | 84 % | 59 % |
| étape 2 telle que livrée : bandes 3-7 → forcée → Nouvelle → bande 2 | 5 | 97 % | 97 % | 63 % |
| **retenu** : bandes 4-7 → forcée (bande 2 pondérée, réserve, tirage en avant) → alarmes 3 → Nouvelle → bande 2 | **3** | **100 %** | 99 % | 63 % |

**Décision (déviation documentée par rapport à la spec §0).** La spec range
« réservation des Nouvelles avec dette » et « cadence forcée gap_max » dans ce
qu'on ne touche pas, et exige en §5.2 un écart max ≤ 3 en S0-S1. Les deux ne
tiennent ensemble qu'avec la cadence forcée servie avant l'alarme de bande 3 et
avant la Nouvelle réservée : l'alarme garde son échéance (n + 2, puis bande 6),
la Nouvelle garde sa dette pour le créneau suivant. La priorité forcée n'est
**pas** un tirage à part : (a) l'étape en fenêtre est tirée **au poids de la
bande 2** (`weightedIndex`, suspensions levées ; 1 appel, celui que la bande 2
aurait consommé), (b) l'ouverture pioche la réserve puis le réservoir, (c)
l'étape tirée en avant reste le dernier recours. Une étape déjà due au créneau
suivant est tirée en avant plutôt que d'ouvrir une intrigue juste avant une
autre.

**Nouvelles.** La chute à 63 % (baseline 97 %) ne vient **pas** de l'ordre
(63 % avec les deux ordres, 59 % avec celui de la spec HEAD) mais de la
congestion des créneaux 12-15 : étapes échues (bande 6) des trois intrigues,
sauts d'arc de la Commission (`in: [2, 4]`), événements, avant les ancres
verrouillées 16-17 ; la Nouvelle réservée au 14 est perdue quand 14 et 15
sont durs. C'est un budget de contenu (fenêtres des étapes du réservoir de
l'étape 3), pas de moteur : laissé ✗, à remesurer avec les 14 intrigues.

**Autres réglages du lot.** `simulate` asserte l'écart max par tranche (≤ 3
S0-S1, ≤ 4 S2+) au lieu de ≤ 4 partout. Les alarmes levées au même tirage sont
échelonnées d'un créneau (ordre fixe des jauges) et une alarme encore en file à
l'ouverture de saison compte dans `alarms_max` : alarmes servies max **3** par
saison (était 4 en S1). Résidus : S1 écart 4 dans 3 saisons sur 269 (deux fois
trois « Nouvelles du passé » d'affilée après un changement de club, une fois
trois alarmes échues après un Bilan catastrophique) ; S2+ max 8 (famine de
contenu, étape 3) ; backlog max 3 (S0) / 4 (S1) : la rafale d'après-Bilan
(paliers + alarmes + ancre), inchangée par nature.

## 3. Ouvertures hors tirage et rythme (mineur 9)

`maintainArcs` et `forceStory` (b) inscrivent leur ouverture dans
`s.openingSlots` ; `maintainArcs` décale sa fenêtre `start` par `freeSlot`
(`ouverture_ecart`, ancres à créneau unique), jamais avant le créneau suivant.
La mesure « S0 avec deux ouvertures à < 3 slots : 9 % » venait en réalité des
**sauts d'arc** (la Commission qui `schedule` `offre_express` /
`naming_express` : l'intrigue entre en jeu par une étape qui n'est pas la
première, au créneau 12-14) — ce n'est pas une ouverture du tirage.
`simulate` les marque (`Opening.jump`), les compte pour la couverture et les
exclut de la règle des 3 slots : **0 % (128 sauts d'arc sur 300 S0)**. σ du
premier slot : 1,32, plafond mécanique d'une fenêtre [2, 9] à trois prises
espacées de 3 (seuil σ ≥ 1,8 à revoir à l'étape 8, comme convenu).

## 4. Le nom deux fois de suite (mineur 5)

Mesure : 248 paires sur 732 saisons, **205 tenaient à `{toi}`** (l'adresse du
locuteur résolue en nom : Aulard « {nom} », Fardelli « mon ami {prenom} »),
1 à une réaction, 2 à deux cartes nominatives. Décision : la métrique « jamais
deux de suite » ne compte que les paires où **les deux cartes portent le nom
directement** (texte ou `answer`) ; `{toi}` reste compté pour « ≥ 2 cartes par
saison » et la paire via `{toi}` est affichée hors budget. Une garde moteur
(retomber sur « coach ») aurait cassé la voix des personnages dont l'adresse
ne dit jamais « coach ». Après : **8 paires directes / 756 saisons**, toutes
des collisions de bandes dures (alarmes `tribunes_bas_gege` /
`caisse_bas_josiane` / `vestiaire_haut_brehaut` échues à la suite, `kop.pacte`
→ `presse.trois_questions`) — contenu, étape 3.

## 5. Réactions perdues (mineur 10)

`serveReaction` compte la cause (`miss_reaction_plafond / double / deja_vue /
when / inconnue`) et `simulate` l'affiche : **190 perdues = 188 plafond, 2
`when`** (Camille après le divorce). La cause est le plafond `reactions_max: 4`
que la spec fixe aussi comme budget (« max ≤ 4 ») : on ne le monte pas ; les
`chance` posés sur les `react` par le lot de contenu en cours réduisent les
poses. Les variantes de repli sans `when` ne changeraient que 2 cas.

## 6. Contenu

- A7 « Je pars la tête haute » ne faisait partir personne : le choix devient
  « Je claque la porte » (sortie de bureau, la carrière continue au même club),
  la trace `parti_tete_haute` dit exactement cela (« a claqué la porte du
  bureau, la tête haute ») — règle : aucune trace n'affirme un état que le
  moteur n'a pas posé.
- A4 : « {nom} accepte de vendre le petit », poids 2 (intention ; la trace
  `mbako_vendu` / `mbako_garde` tranche).
- Élision : `formatText` élide « de » / « que » devant une valeur à voyelle
  (« d'Ethan », « qu'Anne », « L'Écho d'Aubérive ») — test N6 ; les deux
  gabarits cités sont aussi reformulés.
- Le tic « Gégé apprend le mot par la presse » : gardé sur l'ultimatum, varié
  sur A1 (« a compté les manches longues ») et A6 (« a écrit “fermer” sur ton
  pare-brise »).
- « Real Montoya » → « Sporting Montoya » (cartes ; la bible en cours
  d'écriture, hors périmètre de ce lot, emploie encore « Real Montoya »).
- `postulats.yaml` : P0 repasse en `chantier: true` jusqu'à la livraison du
  réservoir (étape 3) ; le lint rend les budgets de réservoir **bloquants dès
  `chantier: false`** (ils étaient des avertissements dans tous les cas).
- Liste noire : 258 entrées (injures, slurs, mots interdits sur une pochette
  partagée), sans nom de personne réelle (règle du dépôt, contraire à la lettre
  de la spec §1.8 sur ce point) et sans mot qui soit aussi un nom plausible
  (Boulet, Gros, Sauvage, Romano) : un vrai nom n'est jamais refusé.
- Set-pieces : « l'objectif c'est le maintien » (article) et « objectif
  « La montée » manqué » (accord) dans le Dart en attendant `setpieces.yaml`
  (étape 6).

## 7. Vérifications

- `dart analyze packages/core packages/tools` : propre.
- `build_content` : 372 cartes, 56 manchettes ; `lint` : 0 erreur, 11
  avertissements (budgets de réservoir en chantier, `en.conf_presse` à 2
  étapes, drapeau `diplome`).
- `cd packages/core && dart test` : **57 tests verts** (56 + N6). Test X4
  adapté : il utilisait « `openingSlots` vide » comme témoin de « `openSeason`
  pas encore exécuté » ; les ouvertures spontanées y sont désormais inscrites,
  le témoin devient « `openingSlots` inchangé depuis le Carrefour ».
- `simulate --runs 500 --assert` : aucun budget violé (human_like médiane 136,
  p95 366, max 769, en_sms 36 %, la Une ne ment pas 100 % sur les 4 politiques).
- `simulate --une-check --runs 300` : 100 % × 4 postulats.
- `simulate --narrative --postulat 0 --runs 300 --seasons 3` : cadence S0 max 3
  ✔, alarmes ≤ 3 ✔, réactions ✔ (moy 2,7, latence 1 à 100 %), Une ✔, brèves ✔,
  journal ✔, rythme paires 0 % ; restent ✗ pour l'étape 3 : Jaccard carrière
  0,31, couverture (7 intrigues), D 0,59, Nouvelles 63 %, échéances, S2+.
