# FUSIBLE — Spec finale : le système de variété narrative (metteur en scène v2)

Version 1.0 · septembre 2026 · vérifiée contre le dépôt à HEAD `7c5a728` (director.dart 839 l., engine.dart 851 l., state.dart 687 l., content.dart 735 l., 336 cartes, 12 arcs, 21 fins, 22 tests : `director_test.dart` 16 + `engine_test.dart` 6).

Cette spec remplace les trois propositions du scratchpad (`variete_systemes.md`, `variete_showrunner.md`, `variete_reigns.md`). Elle est écrite pour des agents qui ne les ont pas lues : tout ce qu'il faut implémenter est ici, avec les points d'insertion (fichier:ligne à HEAD), les schémas YAML, des exemples de cartes écrites dans le ton du jeu, les budgets et l'ordre de livraison.

Conventions : *slot* = index 1..17 de la carte narrative dans la saison ; *n* = `s.ncards` (compteur de cartes narratives depuis le début de la carrière) ; fenêtres `[due, échéance]` en cartes narratives ; S0 = première saison ; P0..P3 = postulats promu / intérimaire / pépite / fin de contrat ; « intrigue » = arc `kind: serie` ; ← gauche, → droite ; magnitudes symboliques `+`/`++`/`+++` (5/10/18, `content/balance.yaml`). Tout nom est fictif (Étoile Bretagne, Le Quotidien du Ballon, les Cobalts, Valdorne, Montbéliac…) ; aucune ville, aucun club, aucune personne, aucune compétition réels, y compris « à peine maquillés ».

---

## 0. Ce que le client a dit, ce qu'on décide

**Le retour** : « on devrait vivre de vraies histoires ; on devrait écrire son nom ; des histoires se déroulent et à chaque relance l'histoire est différente, comme dans Reigns ; la partie histoire, scénario, intervention, journal n'est pas assez fournie ; il n'y a de scénario pour aucun thème sélectionné. »

**Le diagnostic mesuré** (traces `simulate --trace` sur 30 graines, `docs/balance/step3_bible.md`) :

| Symptôme | Cause à HEAD | Mesure |
|---|---|---|
| chaque relance rejoue la même histoire | `postulats.yaml:34-39` sème 5 séries à créneaux fixes (`kop [3,4]`, `prodige [4,6]`, `vieux_gardien [7,8]`, `nassir [8,10]`, `clow S1 [5,12]`), armées sans aléa par `Director.openSeason` (`director.dart:814-823`) ; le script occupe 6 des 17 slots de S0 ; `maintainArcs` n'ouvre rien tant que `min_active` est atteint | 10 cartes d'histoire présentes dans ≥ 90 % des S0 ; Jaccard moyen entre deux S0 = **0,73** ; 5 premiers temps d'histoire identiques dans **60 %** des runs ; l'« entropie » de `simulate` (374/400 séquences distinctes) compte les ids de routine, pas l'histoire |
| S2+ est vide | `eligibleArcs` (`director.dart:383-394`) : une série jouée est morte pour toute la carrière (`if (st != null && !(a.everySeason …)) continue`) ; seule `en.conf_presse` est `every_season` | S2+ : temps d'histoire médian **4**, isolement 50 %, écart max 14 |
| aucun scénario pour 3 thèmes sur 4 | `interimaire`, `pepite`, `fin_de_contrat` : ni `opening_arc`, ni `seeds`, ni `cast` (`postulats.yaml:43-79`) → `co.script.generique` (2 ancres) ; `arcs/joueur/` n'existe pas ; `interim` lu par 0 carte | P2/P3 : temps d'histoire S0 = 4, isolement ≈ 58 % |
| pas de nom | `_makeEntities` (`engine.dart:816-833`) tire un nom ; `{joueur}` existe dans `text.dart:11` et n'est utilisé par **0** carte ; aucune saisie dans l'app | nom prononcé : 0 fois par carrière |
| journal absent | `_bilanUne` (`engine.dart:721-731`) = une ligne fixe ; `GameState` n'a aucun journal ; 17 des 34 beats sont du texte Dart en dur | Unes distinctes : 1 |
| les choix tombent dans le vide | après un swipe, la suite arrive au plus tôt 1 carte plus tard (`enqueueNext`, `inMin ≥ 1`) et souvent 3 à 14 cartes plus tard ; rien ne répond au choix sauf la ligne `answer` | — |

**Ce qui marche et qu'on ne touche pas** : échéances dures et bandes 3-7 sans aléa, réservation des Nouvelles avec dette, cadence forcée `gap_max`, alarmes à hystérésis, `refreshVariants`, « Nouvelles du passé », dette de visage, drame ≤ 1 par run, le tirage de carte lui-même (`drawNarrative`, `director.dart:127-237`).

**Les décisions** (arbitrage des trois propositions par les deux juges, puis les manques comblés ici) :

| Sujet | Décision | Origine |
|---|---|---|
| Colonne vertébrale moteur | `variete_systemes` : `openSeason(s, rng)`, réactions servies dans `_draw` **avant** le beat et **hors** `ncards`/`slot`/`beat`, Une qui lit un verdict **calculé sans être appliqué**, nom hors graine avec tirages conservés puis écrasés, JSON à ordre stable | systemes |
| Tirage de saison | réservoir par postulat et par bucket de saison, k intrigues sans remise, contraintes porteur/thème, signature ×3 en S0 (au plus une), réserve, reprise | systemes + showrunner |
| Rythme | **fenêtre d'ouverture tirée** (`u ~ U[fenetre]`, 1 `nextInt` par intrigue prise, ordre fixe) au lieu de fenêtres par rang, garde « jamais deux ouvertures à moins de 3 cartes » | reigns |
| Fil rouge tiré | `questions` du postulat, 1 `weightedIndex` à l'ouverture de saison, chemin `fil_rouge` dans `when` | showrunner |
| Contenu | les bibles écrites de showrunner (14 intrigues par postulat, interventions, manchettes, Nouvelles datées) versées dans le schéma `programme` ; la « couture » (`traces:` déclarées, lint « chaque trace est lue ») en **avertissement** tant qu'un postulat est en chantier, bloquant à la livraison du lot | showrunner |
| Interventions | ce sont les cartes `react` de systemes (même texte, même côté, mêmes effets que les tables de showrunner) ; jamais dans `ncards` | systemes + showrunner |
| Une | trois journaux à ton (Quotidien du Ballon / Gazette Rose / Écho de {ville}), manchette par bande de priorité puis pondération, brèves contribuées par les intrigues, photo = carte fatale + `answer` en légende ; **pas** de météo tirée ; conditions sur `bilan.tenu` / `bilan.rang` | showrunner + systemes |
| Nom | saisi, hors Code de Carrière, `{prenom} {nom} {NOM} {initiales} {toi}` ; `{toi}` résolu par locuteur et relation (`adresse` dans `characters.yaml`) ; genre choisi, **sorti du tirage mais compensé** (§1.8) | systemes + showrunner |
| Relance | 3 objectifs cachés par postulat avec indice sur l'écran de fin ; écran « Ce qui s'est passé » (épitaphe + `epitaph_plus` + 6 lignes + objectifs + histoires découvertes) | reigns |
| Personnages | âge et statut minimaux (`+1` par saison, `statut` posé par effet, `statut_ok` dans les tirages), sans moteur `on_season` | reigns (réduit) |
| Mesure | Jaccard S0, noyau fixe, ouverture, couverture, Unes distinctes, entropie d'histoire, `--diff`, `--reservoir`, baseline figée | reigns + systemes |
| **Rejeté** pour ce chantier | chapitre méta dans le codec, cartes-légendes, Colline, `rarity`, `on_season` scripté, mémoire des clubs lue depuis la sauvegarde, météo tirée, `stats.albums` fourni par l'app, clins d'œil lisant le nom saisi (tout ce qui fait dépendre une carte servie d'un état hors graine) | — |

Ce que cette spec ajoute par rapport aux trois propositions (les « manques » relevés par les juges) : les set-pieces auteurisables en YAML (§1.12), les fins qui concluent une intrigue (§1.13), la validation et la protection du nom (§1.8), les carrières longues S5+ (§1.11), le protocole de playtest humain (§5.4), la conversion du sac joueur (§4.6), la politique de mise à jour en cours de partie (§3.9), le test « la Une ne ment pas » (§3.7), la compaction du journal (§1.7), les règles de rendu de la Une et de l'écran de fin (§3.8), l'écran-titre (§3.8).

---

## 1. Le modèle

### 1.1 Vocabulaire

- **Postulat** : point de départ (`content/postulats.yaml`). Il porte un **script** (arc `kind: postulat`, ancres à créneaux absolus), un **réservoir** d'intrigues par bucket de saison (`programme`), des **questions** (fil rouge), des **objectifs** cachés, des **manchettes** propres, des `alarm_overrides`, un `cast`.
- **Intrigue** : arc `kind: serie` de 3 à 5 étapes, avec un porteur (`carrier`), un thème (`theme`), des issues (`issues` + effet `outcome:`), des traces (`traces:` = drapeaux + ligne de journal), une rejouabilité (`replay`).
- **Étape** : entrée de file `kind: etape` servie dans sa fenêtre (bande 2) ou à l'échéance (bande 6). Inchangé.
- **Réaction** (l'« intervention » du client) : carte `kind: reaction`, posée par l'effet `react:` d'un choix ou par le moteur (`_bilanUne`), servie **au tirage suivant**, hors créneau (bande 8).
- **Trace** : drapeau posé par une intrigue et **lu** ailleurs (variante, manchette, réaction, alarme, set-piece). La « couture ».
- **Journal** (Almanach) : `GameState.journal`, liste d'entrées datées, pondérées, taguées ; source des brèves de la Une et de l'écran de fin.
- **Une** : page de journal composée au beat `bilan_une` : journal fictif, manchette, sous-titre, photo, brèves, pied.
- **Temps d'histoire** : carte de kind `script | etape | evenement | palier | chaine | reaction` (le kind `reaction` s'ajoute à `_storyKinds`, `director.dart:39`, et à `kStoryKinds` de `simulate`).

### 1.2 Le réservoir et le tirage de saison (remplace `seeds`)

**Principe.** À l'ouverture de chaque saison (`Director.openSeason`, beat 0, dans `_draw`), après l'enfilage des ancres du script et avant la boucle `every_season`, le metteur en scène tire dans le réservoir du postulat **k intrigues** (k = `prendre` − intrigues encore actives), sans remise, pondérées, sous contraintes, puis tire pour chacune sa **fenêtre d'ouverture**. Le Rng d'état est consommé dans un ordre fixe ; deux appareils avec la même graine tirent le même programme.

**Buckets.** `programme` a trois entrées : `"0"` (S0), `"1"` (S1), `"2+"` (S2 et suivantes). Chaque bucket : `prendre`, `fenetre`, `reserve`, `reprise`, `pool`. Le pool est une liste ordonnée (ordre du fichier = ordre d'itération, jamais un `Map`).

**Candidats** (dans l'ordre du fichier, bucket courant puis, si `reprise: true`, buckets antérieurs) : l'arc existe, joue le rôle, est `kind: serie`, est *rejouable* (§1.3), son `when` d'arc et le `if` de l'entrée sont vrais, `min_season ≤ season`, aucun `requires` manquant, aucun `excludes` présent, aucun `exclusive_with` actif ou armé, et son **porteur** n'est pas celui d'une intrigue encore active (`carry`).

**Poids** d'un candidat à chaque tour de tirage :

```
x = poids_entree (défaut 1.0)
× 3.0  si signature: true && season == 0 && aucune signature déjà prise cette saison   (au plus UNE signature par postulat, lint)
× 1.5  si le thème n'a jamais été joué dans la carrière (s.themesPlayed)
× 0.6  si plays(arc) > 0 (une reprise pèse moins qu'une nouveauté)
× 0.5  si le porteur a porté une intrigue fermée la saison précédente
× 0.0  si le thème ou le porteur est déjà pris dans ce tirage ou dans carry
```

**Tirage** : `k` fois au plus : `j = rng.weightedIndex(w)` (1 appel), retirer `cands[j]`, l'ajouter à `taken`, marquer porteur et thème. Si `weightedIndex` renvoie −1 (tout à 0), on arrête.

**Fenêtre d'ouverture tirée** (ce qui fait varier le rythme et pas seulement l'ordre) : pour chaque intrigue prise, **dans l'ordre du tirage** : `u = fenetre[0] + rng.nextInt(fenetre[1] - fenetre[0] + 1)` (1 appel) ; tant qu'un slot ∈ [u−2, u+2] est déjà une ouverture d'intrigue de cette saison (`s.openingSlots`) ou une ancre de script à slot unique (`at[0] == at[1]`), `u += 1` (sans Rng) ; si `u > 15`, `u = 15` puis on recule (`u -= 1`) jusqu'à un slot libre — jamais au-delà de `fenetre[1] + 3`. `armArc(s, a, c, dueN: seasonStartN + u, deadlineN: seasonStartN + u + 2)`. Le slot retenu est ajouté à `s.openingSlots` (liste d'entiers, remise à zéro à l'ouverture de saison, sérialisée).

**Réserve** : les `reserve` premiers candidats restants (dans l'ordre du fichier, sans Rng) vont dans `s.reserve` (liste d'ids **triée**). `forceStory` (b) (`director.dart:440-450`) et `maintainArcs` (`:396-405`) piochent **d'abord** dans `s.reserve` (premier id encore éligible, sans aléa), puis dans `eligibleArcs`. Une réserve ouverte est retirée de `s.reserve`. Le biais « alphabétique » de la réserve est accepté et **mesuré** (`--reservoir` : taux d'ouverture forcée par intrigue ≤ 15 %).

**`eligibleArcs`** (`director.dart:383-394`) : si le postulat a un `programme`, la liste = pool de tous les buckets ≤ saison, mêmes filtres que ci-dessus. Les séries non listées ne s'ouvrent plus spontanément : fin de l'intérimaire qui hérite des séries du promu (toutes ont `postulats: []`). Sans `programme` (postulat en chantier ou contenu de test), comportement actuel.

**Fil rouge** : après le tirage des intrigues, `s.vars['fil_rouge'] = rng.weightedIndex(postulat.questions.poids)` (1 appel, seulement si `questions` est non vide), lisible par le chemin `fil_rouge` (renvoie l'id de la question, chaîne) dans tout `when`. Les ancres du script et les manchettes le lisent.

**Le script maigrit.** Le script d'ouverture garde ses ancres à créneaux absolus (c'est la colonne vertébrale : dans Reigns aussi le sacre et l'héritier sont stables) mais passe de 6 à **4 ancres en S0** : slot 1 (l'ouverture), [10,11] (le twist), 16 et 17 (dernier match, dernier virage). Les ancres A2 « L'empire » et A3 « La cote » deviennent l'intrigue *La cote du promu* (§4.1). Chaque ancre reçoit **≥ 2 variantes** lues sur `fil_rouge` et sur les traces (le script *commente* les feuilletons, il ne les raconte plus).

**Budget de créneaux** (17) : ancres 4 · étapes d'intrigues ≈ 8 (3 intrigues × 3 étapes dont une glisse souvent en S+1) · Nouvelles 3 · sac / alarmes / paliers ≈ 2. Réactions : +2 à +4 cartes **hors créneaux** (la saison compte 17 créneaux et 19-21 cartes vécues). `soft_steps_max` passe de 8 à **10**, `max_active` de 3 à **4**, `min_active` reste 2.

**Combinatoire (promu)** : réservoir S0 de 9, 3 prises, fenêtre [2,9] : C(9,3) = 84 ensembles, ≈ 500 programmes ordonnés, × ~40 combinaisons de slots d'ouverture × 3 fils rouges × 2 variantes d'ouverture par intrigue ⇒ > 10⁵ S0 structurellement distinctes. Deux carrières ont le même ensemble avec probabilité 1/84 ; espérance |A∩B| = 3·3/9 = 1 intrigue commune (Jaccard attendu ≈ 0,2 sur les intrigues ; ≈ 0,3 sur les cartes d'histoire une fois les 4 ancres comptées).

### 1.3 Branches d'arc : issues, rejouabilité, rituels, fusées longues, traces

**Issues.** Un arc déclare `issues: [a, b, c]` ; une carte d'étape pose `outcome: a` dans les effets d'un choix (ou au niveau de l'étape, `outcome:` sur le `StepDef`, appliqué quand l'étape est jouée). `ArcState.outcome` garde la dernière issue ; `arc_outcome('id')` la lit dans `when`. Lint : `outcome ∈ issues` ; chaque issue est posée par au moins une sortie (avertissement).

**Rejouabilité** (`replay`) :

```
replayable(s, a):
  st = s.arcs[a.id] ; if st == null → true
  if st.status ∈ {armed, active} → false
  if a.everySeason → st.doneSeason != s.season
  r = a.replay ; if r == null → false                       # défaut : jamais
  if st.status == 'abandonne' && !r.afterAbort → false        # une histoire perdue avec le club ne revient pas
  return st.plays < r.max && s.season - (st.doneSeason ?? -99) >= r.after
```

`arcDone` : `plays += 1`, `doneSeason = season`, écrit `epilogue.journal` au journal si présent. `armArc` sur un arc déjà `done`/`abandonne` : réinitialise `status/step/lastN/startedSeason`, **conserve** `plays` et `outcome`. La première étape d'un arc rejouable a une variante « encore » lue sur `plays()` (lint : arc `replay` ⇒ ≥ 1 variante lisant `plays()`). `once: true` sur une carte d'étape d'un arc `replay` est une **erreur de build** (le purge `deja_vue` de `director.dart:291` tuerait la relance).

**Rituels** : `replay: ritual` = `every_season: true` + variantes en escalier sur `plays()` (retraite de Gigi : « je raccroche » → « encore une » → « cette fois c'est vrai » → « entraîneur des gardiens »). Un rituel est tiré comme les autres (il est dans le pool avec un poids) ; il n'est **plus** armé d'office par la boucle `every_season` quand le postulat a un `programme` (sinon il double le tirage). La boucle `every_season` de `openSeason` (`director.dart:824-830`) ne sert plus que les postulats sans `programme`.

**Tardives** : `min_season: 2` (existant) ; le bucket `"2+"` les liste. **Seconde vague** : intrigues dont le `if` d'entrée lit une issue ou une trace (`arc_outcome('en.vieux_gardien') == 'staff'`, `flag('mbako_vendu')`).

**Fusées longues** : `NextDef` gagne `at_season: +k` + `at: [a, b]` : l'entrée est enfilée avec `dueN = -1` et un champ `Scheduled.atSeason = season + k`, `atSlot = [a, b]` ; à `openSeason` de la saison visée, `dueN/deadlineN = seasonStartN + a / + b`. Avant cela, l'entrée est ignorée par le tirage (`dueN < 0`) et par `purge` (sauf `club`/`annulee`). Lint d'écriture : une intrigue sur deux a au moins une étape en saison suivante (`at_season` ou `in` avec max ≥ 15) — avertissement.

**Traces et couture.** `traces:` sur l'arc : `{ drapeau: "ligne de journal" }`. Quand un choix pose ce drapeau (`set:`), le moteur écrit la ligne au journal (poids 2, tags `[theme, arc]`) — aucun effet `journal:` à répéter. Le lint vérifie que chaque trace déclarée est **lue au moins une fois** (variante `if`, `when` de manchette, `when`/`if` de réaction, `when` d'alarme, `when` de set-piece, `if` de pool) : **avertissement** tant que le postulat porte `chantier: true` dans `postulats.yaml`, **erreur** sinon. C'est la garantie mécanique du « le jeu me rappelle ce que j'ai fait ».

### 1.4 Les cartes-réactions (interventions)

**Ce que c'est.** Une carte servie **au tirage suivant** le swipe qui l'a posée : le personnage revient à la charge (« Et si je double ? »), la conséquence immédiate tombe (le fax, la Une du lendemain), un tiers commente (Josiane qui a tout entendu, Camille qui a lu le journal). Une ou deux sorties, effets petits (`+`/`-`, relation ±1), jamais de `end`, jamais `drame`, jamais `react` elle-même.

**Déclencheurs.** (a) L'effet `react:` d'un choix : `card` ou liste de variantes `[{card, if?, chance?}]`, la première dont `if` est vrai gagne (la dernière n'a pas de `if`). (b) Le moteur : `_bilanUne` pose une réaction « quelqu'un a lu le journal » quand la manchette retenue déclare `react:` (§1.6). (c) Une alarme ou un palier peuvent porter `react:` comme n'importe quelle carte.

**Règles du metteur en scène.**

1. Une seule réaction en attente (`s.reaction`, la dernière écrase). Plafond `reactions_max: 4` par saison (`calendar.yaml`). Jamais deux d'affilée (`s.lastWasReaction`). `chance` consomme 1 `nextDouble` **seulement si présent** (ordre fixe : après `rand`, avant `schedule`).
2. Servie dans `Engine._draw` **avant** le beat courant, y compris quand le beat pointe un match, le Grand Match ou le Bilan : « la veille du dernier bloc… — Vukić revient : “Et le second discours, tu veux le lire ?” ». Elle ne touche **ni** `ncards`, `slot`, `beat`, `lastStoryN`, `tension`, `toneCounts`, `storyThisSeason` : les 17 créneaux absolus et les fenêtres restent en `ncards`, aucune échéance ne bouge. Elle touche `cooldowns`, `seenCount`, `lastSpeaker`, `lastSeenChar`, `speakerSeen`, `recentSpeakers` (voix et dette de visage), `reactionsThisSeason`.
3. `_advance` ne ré-avance pas le beat après une réaction (`if (applied.payload['kind'] == 'reaction') { s.lastWasReaction = true; return; }`).
4. Si la carte n'existe plus, si son `when` est faux, ou si le plafond est atteint : `stats['miss_reaction'] += 1`, on retombe sur le beat normal. À `_transitionTo`, `club: change` et `over` : `s.reaction = null`.
5. Cas limite : réaction posée sur la dernière carte avant `bilan_carrefour` (le Carrefour) : `_advance` fait le rollover de saison, puis `_draw` sert la réaction **avant** `openSeason` (le beat est 0, la réaction est servie, `openSeason` s'exécute au tirage suivant). Test unitaire dédié (§3.6, test R4).
6. Une réaction porte `payload.band = 8`, `kind = 'reaction'`, `arc`/`step` de la carte déclencheuse, `phase` du beat courant (pour `evalWhen`, `phase` = la phase du beat qui aurait été servi ; entre le slot 17 et le Grand Match, `phase = 'sprint'`).

Trois familles, à mesurer (`simulate` : réactions par saison moyenne 1,5-3, max 4, consécutives 0, latence 1 dans 100 % des cas) : **la relance**, **la conséquence immédiate**, **le tiers qui commente**.

### 1.5 Les Nouvelles

- **Datées** : champ `year:` sur la carte. `pickNouvelle` (`director.dart:533-549`) construit deux listes ; si une Nouvelle datée est éligible pour `s.year ∈ [year, year+1]`, on tire dans cette liste seule (1 `weightedIndex`, inchangé en nombre). Une datée non servie dans ses deux ans est perdue (`stats.nouvelle_datee_perdue`). Elles disent l'époque (1990 → 2000 dans ce chantier, une par demi-saison, 22 cartes) et **arment** des intrigues (`set: [monde_bosquet]` lu par le `if` d'une entrée de pool, `var` qui double un poids : `poids_if: [{if, x}]` sur l'entrée).
- **Corrections** : `co.nouvelle.arbitrage_video` → `year: 2016` (elle attend l'ère des fonds) ; `co.nouvelle.arret_contrats` → remplacée par `co.nv.1995_arret_bosquet` ; `co.nouvelle.droits_tele` → `co.nv.1990_droits_tele` ; `co.nouvelle.fonds_voisins` → `co.nv.1999_fonds`.
- **Du passé** (existant, `director.dart:555-595`) : inchangé, mais l'épilogue écrit `epilogue.journal` au journal.
- **Sensibilité** : aucune Nouvelle ne transpose un fait réel reconnaissable. Les trois de showrunner qui le faisaient sont remplacées (§4.5) : la tribune effondrée devient « la buvette de Portclair a brûlé la veille d'une demi-finale : personne dedans, deux cents merguez », l'enveloppe de Valentienne devient « un club de D2 a payé son gardien en bons d'essence : la Fédération “examine” », la Coupe des Champions du club du Sud devient « le club de Montbéliac gagne la Coupe Continentale avec un budget de D2 : la fête dure trois jours, l'audit trois ans ».

### 1.6 Le générateur de Une

La Une est composée au beat `bilan_une` (`engine.dart:721`) et devient le premier objet que le joueur compare d'une relance à l'autre.

1. **Le verdict d'abord, sans l'appliquer.** `_bilanUne(s, rng)` appelle `seasonVerdict(s.world.division, s.world.pts, s.objectiveTarget)` (pur, `world.dart:99`) et expose dans `EvalContext` deux chemins `when` valides pendant la phase `bilan` : `bilan.tenu` (bool) et `bilan.rang` (int). `_resolveBilan` reste appelé au swipe de `bilan_verdict` (`engine.dart:151-152`) : zéro double application. **Aucune manchette ne lit `flag('bilan_tenu')` ni `world.rang_final`** (ce sont les valeurs de la saison précédente) — lint.
2. **La manchette** : candidats = `content.unes` (fichier `content/unes.yaml`) dont `postulats` est vide ou contient le postulat, dont `roles` contient le rôle, dont le `when` est vrai, et qui n'ont pas été servies la saison précédente (`s.lastUne`). Bande = `priority` (4 titre/descente/changement de rôle, 3 trace forte, 2 trace ordinaire, 1 postulat générique, 0 secours) : la plus haute bande éligible gagne, puis `rng.weightedIndex(poids)` dans cette bande (1 appel, le seul du Bilan). `unes.yaml` contient ≥ 2 gabarits de priorité 0 sans condition (secours).
3. **Le journal** : celui de la manchette (`journal: quotidien | gazette | echo`). Trois voix : *Le Quotidien du Ballon* (national, sobre, bleu), *La Gazette Rose* (tabloïd, méchant, rose), *L'Écho de {ville}* (local, tendre). Date : « juin {annee+1} » (le Bilan a lieu en fin de saison sportive ; `annee` = `s.year`), prix « 4,50 F » puis « 0,80 € » quand `s.year ≥ 2002`.
4. **La photo** : la vignette de la carte « fatale » de la saison = le dernier temps d'histoire non-Nouvelle servi (`s.lastStoryCard`, id + `answer` choisie, mis à jour dans `serve`), ou l'id `photo:` de la manchette s'il a été servi cette saison. Légende = l'`answer` du choix fait. Rendu N&B tramé par l'app.
5. **Les brèves** : les `unes_breves` (3) entrées de `s.journal` de la saison, hors kind `bilan|une`, triées `(-poids, slot)`, en excluant celle dont l'arc/tag est déjà le sujet de la manchette (`sujet:` de la manchette, tag). Les intrigues **contribuent** leurs brèves par `traces:` (ligne écrite quand le drapeau est posé) et par `epilogue.journal` ; les cartes clés par `journal:`. À défaut de 3 entrées, la Nouvelle datée de l'année sert de brève.
6. **Le pied** : « Classement : {bilan.rang}e · Objectif {objectif} : {tenu/manqué} » ; puis le Verdict devient la page 2.
7. **La Une entre au journal** (kind `une`, poids 3, texte = titre) et pose `s.lastUne`. Si la manchette déclare `react:`, la réaction est posée (§1.4) : Josiane range le journal, Vecchio le garde, Léa demande « Vous confirmez la Une ? ».

Placeholders des Unes, épitaphes et journal (ajoutés à `formatText`, §1.8) : `{rang}`, `{pts}`, `{annee}`, `{saison}` (1-based), `{objectif}`, `{division}`, `{CLUB}`, `{VILLE}`, `{NOM}`, `{prenom}`, `{nom}`, `{initiales}`, `{coach}` (l'entité existante), `{age}`, plus `entities.named`.

### 1.7 Le journal de carrière (Almanach)

`GameState.journal: List<JournalEntry{season, year, slot, kind, text, poids, tags, arc?}>`. Le texte est formaté par `formatText` **au moment de l'écriture** (le nom, le club, le rang de l'instant), ≤ 120 caractères.

| Source | kind | poids | Qui l'écrit |
|---|---|---|---|
| effet `journal:` d'un choix | carte | 1 (ou `{text, poids 1..3, tags}`) | `_applyEffects` |
| `traces:` d'un arc (drapeau posé) | trace | 2 | `_applyEffects` après `set` |
| `arc.journal` (ouverture) / `epilogue.journal` (clôture, Nouvelles du passé) | arc | 2 | `armArc` (première ouverture seulement) / `arcDone`, `miss` |
| palier ±3 | palier | 2 | `relationCrossings` (gabarit `journal.yaml`) |
| Bilan tenu/manqué, montée, descente, titre | bilan | 3 (titre 4) | `_resolveBilan` |
| la Une | une | 3 | `_bilanUne` |
| objectif caché atteint | objectif | 3 | `_checkObjectifs` |
| transition de rôle / changement de club | transition | 3 | `_transitionTo`, `_changeClub` |
| fin | fin | 5 | `_buildEndingPending` |

Gabarits moteur dans `content/journal.yaml` (§2.8). **Compaction** : à `openSeason`, si la saison précédente a plus de 12 entrées, on garde ses 12 plus lourdes (tri `(-poids, slot)`, déterministe) ; une carrière de 30 saisons tient donc en ≤ 360 entrées, ≈ 40 Ko sérialisés ; le `clone()` copie la liste (copie superficielle d'objets immuables : `JournalEntry` est `const`), coût mesuré par un test de performance (≤ 1 ms par swipe sur la VM à 360 entrées).

**« Ce qui s'est passé »** (écran de fin, `_buildEndingPending`, `engine.dart:446`) : payload `+ journal` = les 6 entrées les plus lourdes de la carrière (tri `(-poids, -season, slot)`), `+ objectifs` (atteints + indices des non atteints), `+ histoires` (titres des arcs joués ≥ 2 étapes, et titres des intrigues débloquées non jouées), `+ unes` (ids servis), `+ epitaph_plus` (§1.13). Maquette §3.8.

### 1.8 Le nom du joueur

**Saisie** (écran-titre, après le choix de la pochette) : une ligne à remplir à la main sur la pochette « Nom : ________ » : un champ prénom, un champ nom, pré-remplis par un tirage (bouton « Au hasard » = retirer parmi `names/fr.yaml` avec un Rng **cosmétique**, jamais celui de la partie), un tampon ♀/♂ à toucher. Mémorisés dans le profil local (`SharedPreferences`) et proposés par défaut au run suivant. **« Successeur »** garde le nom de famille et retire un prénom : la lignée à coût zéro, purement textuelle (`{nom}` persiste d'un album à l'autre ; rien de l'app n'entre dans les cartes servies, voir « Hors Code de Carrière » ci-dessous).

**Validation** (`packages/core/lib/src/naming.dart`, pur, testé) :
- longueur : prénom 1-14, nom 1-16 caractères après trim et fusion des espaces ; au-delà, coupure à la saisie ;
- alphabet : lettres Unicode (`\p{L}`), espace, apostrophe, tiret ; tout autre caractère (chiffres, `{`, `}`, `<`, emoji) est retiré ; `{`/`}` ne peuvent donc jamais entrer dans `formatText` ;
- casse : première lettre de chaque mot en capitale, le reste conservé (« da Silva » → « Da Silva » sauf particules `de, da, du, del, van, von, le, la` gardées en minuscule quand elles ne sont pas le premier mot) ;
- `{NOM}` = `nom.toUpperCase()` avec accents conservés (« BRÉHAUT ») ; `{initiales}` = premières lettres prénom + nom ;
- vide → nom tiré (comportement actuel) ;
- liste noire locale (`content/names/blacklist.yaml`, ≈ 200 entrées : injures courantes, noms de personnes réelles du football) : un nom qui la contient est **remplacé par un nom tiré** avec un message (« La Fédération a refusé l'inscription. Réessaie. ») — jamais affiché, jamais exporté ;
- les noms des 17 personnages (« Bréhaut », « Vecchio »…) sont **autorisés** (rien ne les lit : décision de déterminisme ci-dessous).

**Où il vit** (règle : au moins deux cartes par saison, toujours au moment qui compte ; jamais plus d'une fois par carte ; jamais dans un libellé de bouton ; `{NOM}` seulement en capitales de journal ou de bâche) :

| Lieu | Exemple |
|---|---|
| Carte Objectif (set-piece) | Aulard : « {Toi}, cette saison l'objectif c'est le maintien. Tu t'engages ? » → « Mon {prenom} » à +1, « Monsieur {nom} » à −1 |
| Ancre d'ouverture du script | Josiane : « Monsieur {nom} — ou {prenom} ? — les comptes de l'été… » |
| Alarme tribunes basse, palier Gégé −3 | « La banderole fait vingt mètres. {NOM} DÉMISSION. On a hésité sur l'accent. » |
| La Une | « {NOM}, LE MIRACLE DE {VILLE} » |
| Le journal | « 1991 : {prenom} {nom} a promis le pacte au kop. À la craie. » |
| L'épitaphe | « {prenom} {nom} est descendu{pg, select, f{e} other{}} seul{pg, select, f{e} other{}}, sa valise à la main. Il pleuvait, évidemment. » |
| Écran de fin, partage, Cimetière | « FUSIBLE — {prenom} {nom}, entraîneur · 3 saisons · Fin : Le SMS de 23h47 » (option « masquer le nom » sur l'image) |
| Les personnages, via `{toi}` | Fardelli : « Mon ami {prenom}, on parle d'argent ou d'amitié ? » ; Nassir à −2 : « Monsieur {nom}, ce n'est pas un club, c'est un actif. » |

**`{toi}` / `{Toi}`** : résolu par le **locuteur** et la **relation** : `characters[speakerId].adresse[role][expression(relation)]`, rendu récursivement (« mon {prenom} »). Défaut si absent : « coach » (entraîneur) / « {prenom} » (joueur). La même carte change de ton avec la relation sans variante : Gégé qui passe de « {prenom} » à « {nom} » quand il ne t'aime plus est lisible immédiatement. `_cardToPending` (`engine.dart:557`) passe `card.speaker` à `formatText`. Lint : `{toi}` dans une carte sans `speaker` = erreur ; `adresse` doit couvrir les trois expressions pour les deux rôles quand elle est présente. La retouche des ≈ 60 cartes entraîneur qui disent « coach » se fait par script **puis relecture humaine carte par carte** (une bouche qui tutoie ne dit pas « Monsieur Durand » : la table `adresse` est écrite par personnage pour que ce soit impossible, mais la relecture vérifie la ponctuation et la position dans la phrase).

**Hors Code de Carrière — argumenté.** Le nom est cosmétique : il n'entre ni dans la graine ni dans le Code (0 bit de plus). Raisons : (1) la promesse du README « graine + postulat + choix ⇒ même carrière » reste vraie mot pour mot ; (2) deux joueurs qui échangent un code vivent la même carrière sous leur propre nom (« la carrière de Lina Nkolo rejouée par toi »), ce qui est le bon partage ; (3) un nom dans le code serait une donnée personnelle partagée sans consentement clair, et un vecteur d'injures ; (4) le codec base32 resterait court. Conséquence stricte : **aucune carte servie ne dépend du nom** (ni « si le nom saisi est celui d'un personnage », ni « même nom qu'au run précédent »), sinon deux appareils avec le même code divergent. La lignée « Successeur » est donc purement textuelle (le `{nom}` persiste). Le clin d'œil de Gégé (« Le nom {nom}, ici, on l'a déjà chanté ») exigerait un compteur d'albums fourni par l'app et lu par une variante : c'est une dépendance hors graine. **Tranché : pas de `stats.albums`, pas de clin d'œil.** La lignée mécanique revient avec le Dossier persistant (lot ultérieur, avec un identifiant de lignée encodé dans le Code).

**Le genre.** Aujourd'hui `_makeEntities` (`engine.dart:817`) tire le genre (1 `nextDouble`) puis prénom (2 `nextInt`) et le reste. Pour rendre le genre choisissable sans changer la consommation Rng : `start(seed, {postulat, prenom, nom, genre})` **conserve les trois tirages** (genre, prénom, nom) puis écrase `entities.genre`, `entities.prenom`, `entities.nom` si fournis. Le genre choisi n'influence aucun tirage (il ne fait que sélectionner `{pg, select}`), donc « même code, même carrière » tient : un ami qui rejoue en ♀ ce que j'ai joué en ♂ voit les mêmes cartes, accordées. Test N1 (§3.6) : même `rngState` et même fingerprint hors `entities`.

**Le texte de partage** contient le nom (« la carrière de Lina Nkolo ») ; le Code ne le contient pas ; à l'import d'un code, l'app propose « jouer sous mon nom » (défaut) ou « sous le sien » (saisie libre du texte du partage).

### 1.9 Objectifs cachés et Destins

Par postulat, 3 `objectifs` (`postulats.yaml`) : `{id, titre, when, indice}`. Évalués (sans Rng) à chaque `_resolveBilan` et à `_buildEndingPending`. Atteint ⇒ `s.unlocked.add('objectif:<id>')`, entrée de journal (kind `objectif`, poids 3), plaque au Panthéon (l'app garde `discoveredObjectifs` comme `discoveredEndings`). L'écran de fin liste « Objectifs : 1/3 — Le miracle {nom} ✔ · “Tenir. Encore.” · “Il y a de l'argent qui frappe à la porte. On peut ne pas ouvrir.” » : les indices des non atteints sont le levier de relance (« on ne rejoue pas pour survivre mais pour aller voir »). Zéro carte à écrire ; les `when` lisent des traces et des issues, donc les objectifs forcent aussi la couture. L'écran-titre affiche sous chaque pochette « Objectifs 1/3 · Histoires 5/14 » (§3.8).

### 1.10 Âge et statut des personnages (version minimale)

`characters.yaml` : `age:` (en 1990) et `statut:` initial (`club`). `GameState.chars: Map<String, CharState{age, statut}>` initialisé à `start` depuis le contenu (les personnages sans `age` n'y figurent pas) ; à `openSeason`, `age += 1` pour tous (**sans** règle scriptée, sans journal automatique). Effet `char: { mbako: { statut: vendu } }` ; chemins `chars.<id>.age`, `chars.<id>.statut` dans `when` ; placeholder `{age_<id>}`. Statuts : `club | staff | parti | vendu | retraite | rival`. **`statut_ok`** : dans `pickPool`, `pickNouvelle`, `raiseAlarms` et les variantes d'étape, une carte dont le `speaker` a un statut ∉ {club, staff} est exclue sauf si elle déclare `statut_ok: [parti, …]` (Vecchio parti ne parle plus dans le vestiaire ; il peut téléphoner). Une entrée de file déjà armée dont le locuteur vient de changer de statut est purgée (`miss` raison `statut`, `fallback` respecté). Vecchio a 41 ans en 1990 et 44 en 1993 (« Ma retraite, la vraie, cette fois. J'ai {age_vecchio} ans. ») ; Mbako a 16 puis 19 ans ; c'est le contenu qui lit ces nombres, pas un moteur de règles.

### 1.11 Rejouabilité S2+ et carrières longues

- **S2 à S4** : bucket `"2+"` (4 prises) = intrigues tardives `min_season: 2`, seconde vague (conditionnée aux issues), rejouables `replay: {after: 2, max: 3}` avec variante « encore », rituels (retraite de Gigi, derby, conférence de presse, budget de Josiane, Noël de Camille) — 5 rituels par rôle suffisent à garantir ≥ 4 temps d'histoire par saison sans écrire ; le reste vient du réservoir et des reprises.
- **S5+** (une carrière d'entraîneur peut aller à 65 ans, ≈ 25 saisons ; un joueur à 38) : le réservoir est vu vers S5-S6 (14 intrigues, 3-4 par saison, `after: 2`). Trois réponses, mesurées à S5-S8 par `simulate --seasons 8` : (1) `replay.max: 3` sur 8 intrigues par postulat (chaque relance est jouée avec sa variante « encore » puis « toujours ») ; (2) les **gabarits « dossier »** : 2 intrigues templatées par rôle (*Le dossier Ménèche* — « une affaire par saison, tirée dans tes traces » ; *Le bilan de Josiane*) dont l'étape 1 a 6-8 variantes lues sur les traces de la carrière, rejouables `after: 1, max: 9` ; (3) les Nouvelles datées 2001-2010 (8, lot suivant). Budget honnête : S5-S8 ≥ 6 temps d'histoire médians, isolement < 40 % ; au-delà de S8 la famine revient et c'est **accepté** pour ce chantier (le budget global « aucun run > 1 200 cartes » et `en_retraite` bornent les carrières).
- **`club: change`** (effet) : `_changeClub` = `_transitionTo` (`engine.dart:392-417`) **sans** changement de rôle : nouveau club, `clubSeq += 1`, `tribunes = 40 + 0.3·old`, `direction = 55`, `vestiaire = 50`, `caisse` conservée, `alarmFired.clear()`, `world = WorldState(division: cible)` (`club: {change: true, division: 1}`), `s.reaction = null`, ligne de journal, retrouvailles (§1.13). Les arcs `same_club` deviennent des Nouvelles du passé. Nécessaire à la vente forcée de la pépite et à l'exil doré.
- **Viré puis rappelé** (allonger la carrière sans nouvelles séries) : **hors périmètre** de ce chantier, mais le crochet est réservé : `endings.yaml` gagne `rebond: { when, postulat }` ; quand une fin de jauge `direction` vide est atteinte et que `rebond.when` est vrai (parole ≥ 0, stats.saisons ≥ 2), l'écran de fin propose « La traversée du désert » à la place de « Successeur » : un `start` **nouveau** (nouvelle graine dérivée `seed ^ 0x5EED`, postulat « Le revenant » à écrire) qui hérite `journal`, `relations`, `enemies`, `unlocked`, `chars` via `start(heritage:)`. Déterministe (tout est dans le nouveau code : graine dérivée + héritage sérialisé dans le Code = trop long) — c'est pourquoi c'est un lot ultérieur avec son propre codec.

### 1.12 Les set-pieces auteurisables (les 17 beats en Dart)

Les beats `objective`, `aftermatch`, `gm_annonce`, `cup`, `bilan_verdict`, `bilan_contrat`, `bilan_carrefour` gardent leur **mécanique** en Dart (effets, résolution, Rng) mais prennent leur **texte** dans `content/setpieces.yaml` : pour chaque beat, une liste de variantes `{when, speaker?, text, left?, right?, answer_left?, answer_right?}`, la première vraie gagne, la dernière est sans `when` (secours = texte actuel). Les variantes lisent `fil_rouge`, les traces, `plays()`, `chars.*`, `bilan.tenu` (pendant `bilan`), `relation.*`, `season`. Zéro Rng. `match` et `gm_te` restent en Dart (leur texte est un état de match). Coût moteur : S (une fonction `pickSetpiece(beat, ctx)` + 7 sites). Coût contenu : ≈ 60 lignes de variantes par rôle. C'est ce qui empêche « la moitié des écrans d'une S2+ est la même qu'en S0 » : Aulard ne dit plus « Cette saison, l'objectif c'est le maintien » de la même façon après une descente, un titre, ou quand Vukić dîne avec lui.

### 1.13 Les fins qui concluent une histoire ; retrouvailles

- Une étape finale d'intrigue peut poser `end:` (existant) : *L'enveloppe* → nouvelle fin `en_valise` ; *L'adjoint qui dîne* + Bilan manqué → variante de `en_sms` par `epitaph_plus` (« Remplacé par ton adjoint. Il a gardé ton cahier. ») ; *Le jubilé* accepté puis raccrocher → `jubile` (existant) devient immédiat au Carrefour ; *Le contrat d'image* signé → `jp_panama` plus probable (caisse `+++`). Quatre fins nouvelles : `en_valise` (entraîneur, rare), `en_dauphin` (« Le dauphin » : remplacé par Vukić), `jp_exil` (« Parti pour l'or »), `jp_consultant` (« Le micro du dimanche », dorée). Les 21 fins existantes reçoivent `epitaph_plus: [{when, text}]` (seconde phrase conditionnelle, ≤ 2 par fin, 30 lignes en tout).
- **Retrouvailles** : à `_transitionTo` et `_changeClub`, pour les deux visages à |relation| maximale (tri `(-|rel|, id)`), enfiler `co.retrouvailles.<id>_<sourire|noir>` en `[2,6]` si la carte existe (12 cartes : Vukić, Fardelli, Gégé, Josiane, Ménèche, Vecchio × 2). `same_club: false`, `fallback: drop`.

---
## 2. Les schémas YAML (exacts, avec exemples complets)

Tout s'ajoute ; aucun fichier existant ne casse. `seeds:` reste accepté par le build (déprécié : avertissement du lint) et **exclusif** de `programme:` (erreur). Le rôle joueur reçoit son dossier `content/arcs/joueur/`, ses cartes d'arc dans `content/cards/joueur/arc_*.yaml`, ses réactions dans `content/cards/joueur/reactions.yaml`.

### 2.1 `content/postulats.yaml`

```yaml
postulats:
  - id: promu
    index: 0
    role: entraineur
    title: "Le promu sans un sou"
    question: "Ce club est à qui : à la tribune qui l'a porté, au président qui a promis, ou à l'argent qui frappe à la porte ?"
    pitch: "Promu, ruiné, adoré. Trois histoires par saison, jamais les mêmes."     # NOUVEAU : sous la pochette
    division: 1
    year: 1990
    gauges: { vestiaire: 50, tribunes: 80, direction: 52, caisse: 30 }
    force: 52
    objective: maintien
    flags: [promu]
    president: aulard
    camille: true
    chantier: false                    # NOUVEAU : true = les lints de couture/réservoir sont des avertissements
    cast:                              # inchangé (cibles d'apparition, dette de visage)
      aulard:   { fonction: patron,      target: 3 }
      gege:     { fonction: creancier,   target: 2 }
      vecchio:  { fonction: coeur,       target: 2 }
      josiane:  { fonction: choeur,      target: 2 }
      vukic:    { fonction: messager,    target: 1.5 }
      mbako:    { fonction: horloge,     target: 1 }
      nassir:   { fonction: tentateur,   target: 1 }
      meneche:  { fonction: chroniqueur, target: 1.5 }
      fardelli: { fonction: vautour,     target: 1 }
      brehaut:  { fonction: capitaine,   target: 1 }
      clow:     { fonction: mentor,      target: 0.5 }
      camille:  { fonction: jauge5,      target: 0.5 }
    opening_arc: en.promu.sans_un_sou
    questions:                         # NOUVEAU : fil rouge tiré à l'ouverture de saison (vars.fil_rouge)
      - { id: tribune,   poids: 1.0 }
      - { id: president, poids: 1.0 }
      - { id: argent,    poids: 1.0 }
    programme:                         # NOUVEAU : remplace `seeds`
      "0":
        prendre: 3
        fenetre: [2, 9]                # slot d'ouverture tiré uniformément ; échéance = ouverture + 2
        reserve: 1
        pool:
          - { arc: en.kop_qui_aime_trop,   poids: 1.2, signature: true, if: "gauges.tribunes >= 65" }
          - { arc: en.prodige,             poids: 1.3 }
          - { arc: en.vieux_gardien,       poids: 1.2 }
          - { arc: en.nassir_proprietaire, poids: 1.2, if: "gauges.caisse < 45" }
          - { arc: en.cote_du_promu,       poids: 1.0 }
          - { arc: en.salaires_retard,     poids: 1.0, if: "gauges.caisse < 45" }
          - { arc: en.espion_haie,         poids: 0.9 }
          - { arc: co.derby,               poids: 0.9 }
          - { arc: co.cartons_camille,     poids: 0.7, if: "!flag('divorce')" }
      "1":
        prendre: 3
        fenetre: [2, 10]
        reserve: 1
        reprise: true                  # les entrées de "0" non tirées restent candidates
        pool:
          - { arc: en.mentor_clow,         poids: 1.1 }
          - { arc: en.brassard_brehaut,    poids: 1.0 }
          - { arc: en.adjoint_dine,        poids: 1.0, if: "relation.vukic <= 0 || relation.aulard >= 2" }
          - { arc: en.enveloppe,           poids: 0.9, if: "world.rang <= 6 || objective == 'maintien'" }
          - { arc: co.pharmacie,           poids: 0.8, if: "relation.sabatier >= 1 || gauges.vestiaire < 40" }
          - { arc: en.conf_presse,         poids: 0.8 }
      "2+":
        prendre: 4
        fenetre: [1, 11]
        reserve: 2
        reprise: true
        pool:
          - { arc: en.fils_aulard,         poids: 1.2 }
          - { arc: en.retour_mbako,        poids: 1.5, if: "flag('mbako_vendu')" }
          - { arc: en.gigi_staff,          poids: 1.2, if: "arc_outcome('en.vieux_gardien') == 'staff'" }
          - { arc: en.dossier_meneche,     poids: 1.3, if: "enemy('meneche') || relation.meneche <= -1" }
          - { arc: en.commission_discipline, poids: 1.0, if: "flag('flacon_b') || flag('enveloppe_promise')" }
          - { arc: en.vieux_gardien,       poids: 0.8 }        # rituel (replay: ritual)
          - { arc: co.derby,               poids: 0.9 }        # rituel
          - { arc: en.kop_qui_aime_trop,   poids: 0.6 }        # replay after 2
    objectifs:                         # NOUVEAU : 3 par postulat, évalués au Bilan et à la fin
      - { id: promu_deux_maintiens, titre: "Deux maintiens de suite",  when: "vars.saisons_tenues >= 2",                    indice: "Tenir. Encore." }
      - { id: promu_a_lancienne,    titre: "Le club à l'ancienne",     when: "flag('club_a_lancienne') && stats.saisons >= 3", indice: "Il y a de l'argent qui frappe à la porte. On peut ne pas ouvrir." }
      - { id: promu_banc_gigi,      titre: "Le banc de Gigi",          when: "arc_outcome('en.vieux_gardien') == 'staff'",  indice: "Un gardien de 41 ans a autre chose à donner que ses gants." }
    alarm_overrides:                   # inchangé
      caisse.low:
        - { card: en.promu.alarme_nassir_offre, when: "relation.nassir >= 0 && vars.nassir_palier >= 1" }
      tribunes.high:
        - { card: en.alarme.tribunes_haut_vukic, when: "arc('en.kop_qui_aime_trop') != 'done'" }
```

Règles de compilation (`build_content.dart`) : chaque `arc` du pool existe, joue le rôle du postulat, est `kind: serie` ; `prendre ≥ 1`, `fenetre` dans 1..15 et croissante ; `reserve ≥ 0` ; `if` et `when` d'objectifs parsés comme des `when` ; au plus une entrée `signature` par postulat ; `seeds` et `programme` exclusifs ; `questions` : ids distincts, `poids > 0` ; les arcs cités reçoivent `postulats += [id]` s'ils déclaraient une liste non vide (cohérence, sans effet sur les listes vides).

### 2.2 `content/arcs/**` — champs nouveaux sur un arc

```yaml
arcs:
  - id: en.salaires_retard
    title: "Les salaires en retard"
    kind: serie
    roles: [entraineur]
    postulats: []
    foreground: true
    weight: 1.0
    theme: caisse                      # NOUVEAU (fermé : `themes` de tags.yaml) ; défaut : `arc:` de la carte de l'étape 1
    carrier: josiane                   # NOUVEAU ; défaut : cast[0] ; jamais deux porteurs identiques la même saison
    cast: [josiane, brehaut, aulard, nassir]
    replay: { after: 2, max: 2 }       # NOUVEAU : never (défaut) | {after, max, after_abort?} | ritual
    requires: []                       # NOUVEAU : drapeaux exigés
    excludes: [club_actif]             # NOUVEAU : drapeaux interdits
    exclusive_with: [en.nassir_proprietaire]   # NOUVEAU : jamais actives ensemble
    hint: "La paie du 5 n'est pas arrivée. Quelqu'un le sait avant toi."   # NOUVEAU : indice Codex (histoires non jouées)
    journal: "Josiane a reçu un fax de la banque. Elle l'a plié en quatre."  # NOUVEAU : ligne écrite à la première ouverture
    traces:                            # NOUVEAU : drapeau → ligne d'Almanach écrite quand il est posé
      salaires_retard:  "{annee} : à {club}, la paie de novembre arrive avec trois semaines de retard."
      salaires_avances: "{annee} : {prenom} {nom} obtient du président l'avance des salaires. Il s'en souviendra."
      nassir_paie:      "{annee} : Cheikh Nassir paie les salaires de {club}. « Ce n'est pas un club, c'est un actif. »"
    issues: [avance, patience, nassir] # NOUVEAU : cible de `outcome:`
    when: "gauges.caisse < 45"
    min_season: 0
    start: [2, 5]                      # ignoré quand l'arc est tiré par le programme
    same_club: true
    fallback: nouvelles
    epilogue: { vestiaire: "-", journal: "L'affaire des salaires s'est réglée sans {prenom}." }   # `journal` NOUVEAU
    steps:
      - id: fax
        card:
          - { id: en.salaires.fax_encore, if: "plays('en.salaires_retard') >= 1" }   # variante « encore » (lint : obligatoire si replay)
          - { id: en.salaires.fax }
        next: [ { step: brehaut, in: [2, 5] } ]
      - id: brehaut
        card: en.salaires.brehaut
        next:
          - { step: avance,   if: "flag('salaires_avances')", in: [3, 6] }
          - { step: patience, in: [3, 6] }
      - id: avance
        card: en.salaires.avance
        outcome: avance                # NOUVEAU : posé quand l'étape est jouée (ou dans les effets d'un choix)
        next: [ { step: facture, at_season: +1, at: [2, 4] } ]   # NOUVEAU : la présaison suivante
      - id: patience
        card:
          - { id: en.salaires.patience_nassir, if: "relation.nassir >= 0 && vars.nassir_palier >= 1" }
          - { id: en.salaires.patience }
        next: [ { step: facture, at_season: +1, at: [2, 4] } ]
      - id: facture
        card:
          - { id: en.salaires.facture_greve,  if: "flag('salaires_retard') && gauges.vestiaire < 45" }
          - { id: en.salaires.facture_aulard, if: "flag('salaires_avances')" }
          - { id: en.salaires.facture_nassir }
        next: []
```

Lint (bloquant sauf `chantier`) : `theme` ∈ `tags.yaml → themes` ; `carrier ∈ cast` ; `issues ≥ 2` ; chaque `traces` lue ≥ 1 fois ; arc `replay` ⇒ ≥ 1 variante lisant `plays()` et aucune carte `once: true` ; `exclusive_with` symétrique (le build complète) ; `requires/excludes` sont des drapeaux déclarés.

### 2.3 Cartes — effets et champs nouveaux

```yaml
cards:
  - id: en.promu.a4_commission        # ancre existante, enrichie
    roles: [entraineur]
    arc: direction
    tags: [direction, mercato, sponsors]
    speaker: aulard
    tone: strategique
    once: true
    text: "Aulard : « La Commission veut un plan pour janvier, {toi} : soit on vend le petit Mbako, soit un sponsor paie d'avance. J'ai pas le temps, j'ai un empire. Choisis. »"
    left:
      label: "On vend le gamin"
      effects:
        direction: "+"
        relation: {mbako: -1}
        set: [commission_vente]
        schedule: [{card: en.prodige.offre_express, in: [2, 4]}]
        react:                                       # NOUVEAU : carte-réaction servie AU TIRAGE SUIVANT, hors créneau
          - { card: en.re.aulard_sms_brouillon, if: "relation.aulard >= 0" }
          - { card: en.re.josiane_numero }           # la dernière variante n'a pas de `if`
        journal: { text: "La Commission voulait un plan : {nom} vend le petit.", poids: 3, tags: [direction, mercato] }   # NOUVEAU
      answer: "Fardelli a déjà le numéro. Il l'avait avant vous."
    right:
      label: "On trouve un sponsor"
      effects:
        caisse: "-"
        direction: "-"
        set: [commission_sponsor]
        schedule: [{card: en.nassir.naming_express, in: [2, 4]}]
        journal: "Plutôt un sponsor qu'une vente : {prenom} {nom} a choisi l'orange."
      answer: "Josiane compose un numéro qui commence par l'étranger."

  - id: en.re.aulard_sms_brouillon    # NOUVEAU kind: reaction (dérivé par le build : la carte est citée par un `react`)
    roles: [entraineur]
    arc: direction
    tags: [direction]
    speaker: aulard
    tone: leger
    text: "Aulard, dans le couloir : « J'ai écrit un SMS à Fardelli. Je te le lis. Il y a une faute, tu la vois ? »"
    left:
      label: "Je la corrige"
      effects: {relation: {aulard: 1}}
      answer: "Il corrige. Il envoie. Il ne relit pas."
    right:
      label: "Envoie"
      effects: {direction: "+", parole: -1}
      answer: "Fardelli répond en trente secondes. Avec la même faute."

  - id: en.vieux.bus_descend           # étape finale d'un arc : pose l'issue
    # …
    right:
      effects: {vestiaire: "+++", outcome: staff, set: [gigi_staff], char: {vecchio: {statut: staff}}, journal: "Gigi est descendu du bus le premier. Il reste, au staff."}

  - id: co.nv.1995_arret_bosquet        # Nouvelle datée
    roles: [entraineur, joueur]
    arc: nouvelle
    tags: [nouvelle, mercato]
    speaker: fardelli
    year: 1995                          # NOUVEAU : servie quand s.year ∈ [year, year+1], prioritaire sur les intemporelles
    once: true
    text: "Fardelli : « Un tribunal lointain vient de trancher : fin de contrat, un joueur part libre. Mon ami, c'est de l'amitié. Pour moi. »"
    left:  { label: "Encaisser", effects: {direction: "-", set: [monde_bosquet]} }
    right: { label: "Encaisser", effects: {direction: "-", set: [monde_bosquet]} }

  - id: en.vieux.appel_retraite         # carte dont le locuteur n'est plus au club
    speaker: vecchio
    statut_ok: [retraite, staff]        # NOUVEAU : servie même si chars.vecchio.statut ∈ cette liste
    # …
```

- `react` : `card` (id) ou liste `[{card, if?, chance?}]`. La carte cible reçoit `kind: reaction` (dérivé, hors sac, jamais `once`, `end`, `react`, `tone: drame` ; `speaker` obligatoire). Une carte-réaction peut avoir deux sorties identiques (un bouton).
- `journal` : chaîne (poids 1) ou `{text, poids 1..3, tags}` ; ≤ 120 caractères ; refusé sur une carte de routine (lint) — le journal ne doit pas devenir du bruit.
- `outcome` : chaîne ; valide seulement sur une carte d'étape ; ∈ `issues` de l'arc.
- `char` : `{ <id>: { statut: <valeur> } }`, statut ∈ `club | staff | parti | vendu | retraite | rival`.
- `club` : `{ change: true, division?: 1|2 }`.
- `year` : entier dans [1990, 2050] ; réservé aux cartes `arc: nouvelle`.
- `statut_ok` : liste de statuts.

### 2.4 `content/unes.yaml` (nouveau)

```yaml
journaux:
  - { id: quotidien, nom: "Le Quotidien du Ballon", ton: sobre,  style: bleu }
  - { id: gazette,   nom: "La Gazette Rose",        ton: mechant, style: rose }
  - { id: echo,      nom: "L'Écho de {ville}",      ton: tendre, style: local }
unes:
  - id: une.promu.miracle
    postulats: [promu]                  # vide = tous
    roles: [entraineur]
    journal: quotidien
    priority: 3
    poids: 1.0
    when: "bilan.tenu && world.division == 1 && bilan.rang <= 10 && season == 0"
    titre: "{NOM}, LE MIRACLE DE {VILLE}"           # ≤ 44 caractères une fois {NOM} rendu (lint avec un nom de 16 lettres)
    sous: "Promu sans un sou, maintenu à la {rang}e place. Aulard parle déjà de « projet »."
    sujet: direction                     # tag exclu des brèves (déjà le sujet)
    photo: en.promu.a6_dernier_virage    # optionnel : carte fatale préférée si servie cette saison
    react: { card: co.re.josiane_a_lu, if: "relation.josiane >= 0" }   # optionnel : « quelqu'un a lu le journal »
  - id: une.promu.chauffage
    postulats: [promu]
    journal: gazette
    priority: 2
    when: "!bilan.tenu && flag('choix_maillots')"
    titre: "DES MAILLOTS NEUFS, UN VESTIAIRE FROID"
    sous: "{club} descend. {prenom} {nom} avait choisi les maillots plutôt que le chauffage."
    sujet: caisse
  - id: une.generic.descente
    journal: echo
    priority: 4
    when: "bilan.rang >= 17"
    titre: "LE RÊVE A DURÉ UN AN"
    sous: "Retour en Division 2. {prenom} {nom} n'a pas répondu à nos appels. Gégé, si."
  - id: une.generic.tenu
    priority: 0
    journal: quotidien
    when: "bilan.tenu"
    titre: "{CLUB} : OBJECTIF TENU"
    sous: "{objectif} : c'est fait, {rang}e. La saison prochaine commence demain."
  - id: une.generic.manque
    priority: 0
    journal: gazette
    titre: "SAISON MANQUÉE À {VILLE}"
    sous: "{rang}e. « {objectif} », disait-on en août."
```

Lint : `when` ne cite ni `bilan_tenu`, `bilan_manque`, `world.rang_final` (valeurs de la saison précédente) ; ≥ 2 gabarits `priority: 0` sans `when` ; par postulat livré : ≥ 10 manchettes dont ≥ 3 conditionnées à des traces du postulat ; `{NOM}` ou `{CLUB}`/`{VILLE}` présent dans ≥ 50 % ; titre ≤ 44 caractères rendu avec un nom de 16 lettres et une ville de 12 (le lint rend les gabarits avec « BRÉHAUT-LEMOINE » / « Saint-Étoile ») ; placeholders connus seulement.

### 2.5 `content/characters.yaml` — adresse, âge, statut, retrouvailles

```yaml
characters:
  - id: gege
    name: "Gégé"
    label: "CAPO, TRIBUNE NORD"
    genre: m
    role: ultra
    tic: "La tribune n'oublie rien."
    camp: terrain
    default_target: 1.5
    age: 47                              # NOUVEAU (en 1990 ; +1 par saison)
    statut: club                         # NOUVEAU
    adresse:                             # NOUVEAU : résout {toi} selon le rôle et l'expression du locuteur
      entraineur: { sourire: "{prenom}", neutre: "coach", noir: "{nom}" }
      joueur:     { sourire: "petit", neutre: "{prenom}", noir: "le {numero}" }
    retrouvailles: { sourire: co.retrouvailles.gege_sourire, noir: co.retrouvailles.gege_noir }   # NOUVEAU
    on_relation:
      -3: en.gege.trahison_banderole
      3: en.gege.faveur_insurrection
  - id: aulard
    adresse:
      entraineur: { sourire: "mon {prenom}", neutre: "{nom}", noir: "monsieur {nom}" }
      joueur:     { sourire: "petit", neutre: "{nom}", noir: "monsieur {nom}" }
  - id: josiane
    adresse:
      entraineur: { sourire: "{prenom}", neutre: "{pg, select, f{madame} other{monsieur}} {nom}", noir: "{pg, select, f{madame} other{monsieur}} {nom}" }
      joueur:     { sourire: "{prenom}", neutre: "{prenom}", noir: "{pg, select, f{mademoiselle} other{monsieur}} {nom}" }
  - id: vecchio
    age: 41
    statut: club
    adresse:
      entraineur: { sourire: "coach", neutre: "coach", noir: "coach" }      # Gigi dit toujours coach : c'est le personnage
      joueur:     { sourire: "petit", neutre: "petit", noir: "{prenom}" }
  - id: mbako
    age: 16
    statut: club
```

`{numero}` : dossard du joueur, tiré dans `start` **après** les tirages existants (1 `nextInt(30)+1` **seulement** pour le rôle joueur — c'est un nouvel appel, accepté avec le bump de `meta.version`).

### 2.6 `content/endings.yaml` — `epitaph_plus`, fins nouvelles, `rebond` réservé

```yaml
endings:
  - id: en_sms
    gauge: direction
    side: vide
    rarity: commune
    title: "Le SMS de 23h47"
    epitaph: "Viré{pg, select, f{e} other{}} par SMS entre la conférence de presse et le parking. Le message contenait une faute d'orthographe. {pg, select, f{Elle} other{Il}} l'a corrigée."
    epitaph_plus:                        # NOUVEAU : seconde phrase conditionnelle, la première vraie
      - { when: "flag('vukic_dauphin')", text: "Zoran Vukić a pris le banc le lendemain. Il avait gardé ton cahier." }
      - { when: "relation.gege >= 1",    text: "Gégé a découpé la Une. Il la garde." }
      - { when: "enemy('meneche')",      text: "Ménèche avait le SMS avant toi. Il l'a publié avec la faute." }
  - {id: en_valise,  gauge: direction, side: vide, rarity: rare, title: "La valise", epitaph: "Trois joueurs adverses, une enveloppe, un maintien. La Fédération a « examiné ». Elle a trouvé {prenom} {nom}."}
  - {id: en_dauphin, gauge: direction, side: vide, rarity: rare, title: "Le dauphin", epitaph: "Remplacé{pg, select, f{e} other{}} par ton adjoint. Il « réfléchissait » depuis novembre."}
  - {id: jp_exil,    golden: false, rarity: rare, title: "Parti pour l'or", epitaph: "Le championnat du désert paie comme l'or. Le niveau reste entre eux. {prenom} {nom} a appris à dormir la journée."}
  - {id: jp_consultant, golden: true, rarity: rare, title: "Le micro du dimanche", epitaph: "{prenom} {nom} juge les autres le dimanche soir. Le président « n'a pas le temps » de regarder."}
```

### 2.7 `content/setpieces.yaml` (nouveau) — le texte des beats en Dart

```yaml
setpieces:
  objective:                             # mécanique inchangée (_objectiveCard) ; seul le texte est choisi ici
    - when: "season >= 1 && flag('descente')"
      text: "{patron} : « On est descendus, {toi}. Cette saison, l'objectif c'est {objectif_min}. Et tu paies le chauffage. Tu t'engages ? »"
    - when: "flag('vukic_dauphin')"
      text: "{patron}, Vukić à côté : « Cette saison, l'objectif c'est {objectif_min}. Zoran est d'accord. Tu t'engages ? »"
    - when: "fil_rouge == 'argent'"
      text: "{patron} : « Cette saison, l'objectif c'est {objectif_min}. Et un sponsor. Tu t'engages ? »"
    - text: "{patron} : « Cette saison, l'objectif c'est {objectif_min}. Tu t'engages ? »"      # secours = texte actuel
  bilan_verdict:
    - when: "bilan.tenu && bilan.rang <= 3"
      text: "Le verdict tombe : {rang}e. Le président a fait imprimer la photo de famille. Tu es dessus, au bord."
    - when: "bilan.tenu"
      text: "Le verdict tombe : {rang}e. {objectif} : tenu. Josiane a déjà rangé le dossier sous les autres."
    - when: "!bilan.tenu && bilan.rang >= 17"
      text: "Le verdict tombe : {rang}e. Le mot « descente » est écrit en petit, en bas de la lettre."
    - text: "Le verdict de la saison tombe. Objectif : {objectif}."
  bilan_contrat:
    - when: "relation.aulard <= -1"
      text: "{patron} : « On continue, ou je te fais un chèque ? Je ne le date pas. »"
    - when: "stats.titres >= 1 && season == vars.titre_saison"
      text: "{patron} : « Champion. Je te prolonge sans lire. Tu signes où ? »"
    - text: "{patron} : « On continue l'aventure, ou tu tentes autre chose ? »"
  bilan_carrefour:
    - when: "flag('diplome')"
      transition: entraineur
      text: "Vukić : « Tu as le papier, {prenom}. La réserve n'a pas d'entraîneur. Tu passes de l'autre côté ? »"
  aftermatch:
    - when: "vars.gm_won == 1 && flag('finale_gigi')"
      text: "Score final {gm_score}. Gigi a gardé le ballon. Il en a vu d'autres, pas celui-là."
    - when: "vars.gm_won == 1"
      text: "Score final {gm_score}. Le vestiaire exulte."
    - text: "Le match est terminé. Il faut parler au groupe."
  gm_annonce:
    - when: "arc('co.derby') == 'active'"
      text: "GRAND MATCH. Le derby. Gégé a peint la ville. Coup d'envoi."
    - text: "GRAND MATCH. Le stade est plein, tout se joue ici. Coup d'envoi."
  cup:
    - when: "flag('vitamines') || flag('flacon_b')"
      text: "Tour de Coupe. Un contrôleur attend à l'accueil. Le tirage t'offre un adversaire surprise. On y va ?"
    - text: "Tour de Coupe. Le tirage t'offre un adversaire surprise. On y va ?"
```

Placeholders propres aux set-pieces : `{patron}` (nom du patron du rôle/postulat), `{objectif_min}` (libellé en minuscules), `{gm_score}`. Les libellés des boutons restent en Dart (mécanique) sauf `left:`/`right:` fournis. Une variante `bilan_carrefour` avec `transition:` remplace le texte de `roles.yaml → transitions.label` quand son `when` est vrai **et** que la transition est éligible.

### 2.8 `content/journal.yaml` (nouveau) — gabarits moteur

```yaml
auto:
  bilan_tenu:    "{annee} · {club} termine {rang}e : objectif « {objectif} » tenu."
  bilan_manque:  "{annee} · {club} termine {rang}e : objectif « {objectif} » manqué."
  montee:        "{annee} · Montée en Division 1 avec {club}."
  descente:      "{annee} · {club} descend. {nom} reste. Pour l'instant."
  titre:         "{annee} · {club} champion{pg, select, f{} other{}}. {prenom} {nom} sur la photo, au bord."
  palier_moins3: "{annee} · {perso} ne parle plus à {prenom} {nom}."
  palier_plus3:  "{annee} · {perso} doit quelque chose à {prenom} {nom}. {perso_tic}"
  transition:    "{annee} · {prenom} {nom} raccroche les crampons et prend le banc de {club}."
  club_change:   "{annee} · {prenom} {nom} signe à {club}."
  objectif:      "{annee} · {objectif_titre}."
  fin:           "{annee} · {fin_titre}."
```

### 2.9 `content/calendar.yaml` — quotas

```yaml
director:
  nouvelle_slots: { entraineur: [7, 12, 14], joueur: [7, 12, 14] }
  gap_max: 3
  soft_steps_max: 10        # 8 → 10
  min_active: 2
  max_active: 4             # 3 → 4
  events_max: 1
  alarms_max: 3
  reactions_max: 4          # NOUVEAU
  unes_breves: 3            # NOUVEAU
  journal_par_saison: 12    # NOUVEAU : compaction
  ouverture_ecart: 3        # NOUVEAU : jamais deux ouvertures d'intrigue à moins de 3 slots
```

### 2.10 `content/tags.yaml` — thèmes fermés

```yaml
themes: [argent, tribune, vestiaire, presse, corps, famille, mercato, instances, direction, absurde]
```

### 2.11 Langage `when` — ajouts (`condition.dart`)

| Ajout | Type | Sens |
|---|---|---|
| `plays('arc')` | appel | nombre de clôtures `done` de l'arc dans la carrière |
| `arc_outcome('arc')` | appel | dernière issue posée (`''` sinon) |
| `theme_played('vestiaire')` | appel | un arc de ce thème a déjà été ouvert |
| `journal_has('tag')` | appel | une entrée de journal **de la saison en cours** porte ce tag |
| `objectif('id')` | appel | objectif caché atteint |
| `fil_rouge` | chemin | id de la question tirée (chaîne, `''` sans `questions`) |
| `bilan.tenu`, `bilan.rang` | chemins | verdict calculé, **valides seulement en phase `bilan`** (erreur de lint ailleurs) |
| `reactions` | chemin | réactions servies cette saison |
| `chars.<id>.age`, `chars.<id>.statut` | chemins | état de personnage (0 / `'club'` si absent) |
| `stats.*` | préfixe | existant (`stats.saisons`, `stats.titres`) |

`kKnownPaths`, `kKnownPathPrefixes` (`+ 'chars.'`), `kKnownCalls` sont mis à jour ; le lint les importe déjà.

---
## 3. Plan moteur par fichier et point d'insertion

Les numéros de lignes sont ceux de HEAD `7c5a728`. Tout changement respecte la règle du dépôt : **aucun aléa hors du Rng d'état, consommé dans un ordre fixe** ; toute liste sérialisée est triée ou à ordre d'insertion stable ; jamais d'itération de `Map`/`Set` non triée avant un tirage.

### 3.1 `packages/core/lib/src/content.dart`

| Ajout | Détail |
|---|---|
| `ProgrammeDef { Map<String, BucketDef> buckets }`, `BucketDef { int prendre; List<int> fenetre; int reserve; bool reprise; List<ProgEntry> pool }`, `ProgEntry { String arc; double poids; bool signature; Object? ifWhen }` | `PostulatDef.programme` (nullable) ; `bucketFor(int season)` → `"0"`, `"1"`, `"2+"` ; `entriesWithReprise(season)` = bucket courant puis, si `reprise`, buckets antérieurs dans l'ordre `"1"`, `"0"` |
| `QuestionDef { id, poids }` → `PostulatDef.questions` ; `ObjectifDef { id, titre, when, indice }` → `PostulatDef.objectifs` ; `PostulatDef.pitch`, `PostulatDef.chantier` | |
| `ArcDef` : `theme`, `carrier`, `replay: ReplayDef? { after, max, afterAbort, ritual }`, `requires`, `excludes`, `exclusiveWith`, `hint`, `journal`, `traces: Map<String,String>`, `issues` ; `epilogue` garde son json (clé `journal` lue par `arcDone`) | `carrierId` = `carrier ?? cast.first ?? ''` ; `themeId` = `theme ?? content.cards[steps.first.card.last.id].arc` (résolu par le build, écrit dans le json) |
| `StepDef.outcome` ; `NextDef.atSeason`, `NextDef.at` | |
| `Card` : `year`, `statutOk`, `kind` accepte `reaction` | |
| `UneDef { id, postulats, roles, journal, priority, poids, when, titre, sous, sujet, photo, react }` ; `JournalDef { id, nom, ton, style }` ; `Content.unes`, `Content.journaux` | listes dans l'ordre du fichier |
| `CharacterDef` : `age`, `statut`, `adresse: Map<String, Map<String,String>>`, `retrouvailles` | |
| `EndingDef.epitaphPlus: List<StepVariantText{when, text}>` ; `EndingDef.rebond` (parsé, non lu) | |
| `SetpieceDef` et `Content.setpieces: Map<String, List<SetpieceVariant>>` ; `Content.journalTemplates` | |
| `DirectorConfig` : `reactionsMax`, `unesBreves`, `journalParSaison`, `ouvertureEcart` | |

`Content` conserve `seeds` (rétro-compatibilité des tests synthétiques et des postulats en chantier).

### 3.2 `packages/core/lib/src/state.dart`

- `Entities` : `+ prenom`, `+ nom` (dérivés de `protagonist` par `fromJson` quand absents : split sur le premier espace) ; `protagonist` reste `"$prenom $nom"`.
- `ArcState` : `+ int plays = 0`, `+ String? outcome` ; sérialisés ; **ajoutés au `fingerprint()`** (`arcStr` devient `'$k:$status:$step:$plays:${outcome ?? ''}'`) — sinon une divergence de `plays` sans consommation Rng serait vue une carte trop tard.
- `Scheduled` : `+ int? atSeason`, `+ List<int>? atSlot` (fusée longue, `dueN = -1` tant que non planifiée).
- `GameState` : `+ List<JournalEntry> journal`, `+ List<String> reserve` (triée), `+ ReactionRef? reaction {card, arc, step, phase}`, `+ int reactionsThisSeason`, `+ bool lastWasReaction`, `+ List<String> themesPlayed` (liste triée, pas un `Set`), `+ List<int> openingSlots`, `+ Map<String, CharState> chars` (clés triées à la sérialisation), `+ String? lastUne`, `+ LastStoryCard? lastStoryCard {id, answer}`, `+ Map<String,int> carriersLastSeason` (porteur → saison de clôture, pour le ×0,5). `clone`/`toJson`/`fromJson` avec défauts (une sauvegarde v2 sans ces champs charge : listes vides, `chars` reconstruit par `Engine` au premier `openSeason` si vide).
- `fingerprint()` : `+ '|j${journal.length}'`, `+ '|r${reaction?.card ?? '-'}'`, `+ '|v${vars['fil_rouge'] ?? ''}'`.

### 3.3 `packages/core/lib/src/effects.dart`

`EffectSet` : `+ List<ReactVariant> react {card, ifWhen, chance}`, `+ JournalOp? journal {text, poids, tags}`, `+ String? outcome`, `+ Map<String, Map<String,String>> char`, `+ ClubChangeOp? club {division}`. `fromJson`/`toJson` (clés `react`, `journal`, `outcome`, `char`, `club`). `NextOp` : `+ atSeason`, `+ at`.

### 3.4 `packages/core/lib/src/draw/director.dart`

| Fonction | Ligne HEAD | Changement |
|---|---|---|
| `_storyKinds` | :39 | `+ 'reaction'` |
| `arcDone` | :109 | `st.plays += 1 ; st.doneSeason = season ;` écrit `epilogue.journal` (poids 2) ; enregistre `carriersLastSeason[carrier] = season` |
| `drawNarrative` | :127 | inchangé (les réactions passent avant, dans `_draw`) ; `serve` met à jour `s.lastStoryCard` quand `_storyKinds` et `kind != 'nouvelle'` |
| `purge` | :285 | `+` raison `statut` (locuteur hors statut sans `statut_ok`) ; ignore les entrées `dueN < 0` sauf raisons `club`/`annulee` |
| `eligibleArcs` | :383 | si `post.programme != null` : candidats = entrées de tous les buckets ≤ saison, filtre §1.2 (`replayable`, `if`, `when`, `min_season`, `requires/excludes/exclusive_with`, porteur libre) ; sinon comportement actuel |
| `maintainArcs` | :396 | pioche d'abord `s.reserve` (premier id éligible, sans Rng, retiré de la réserve), sinon `eligibleArcs` + `weightedIndex` (inchangé) |
| `armArc` | :407 | conserve `plays`/`outcome` si l'état existe ; écrit `arc.journal` à la première ouverture (`plays == 0 && !s.arcs.containsKey`) ; ajoute `themeId` à `themesPlayed` (insertion triée) |
| `forceStory` (b) | :440 | réserve d'abord, puis `eligibleArcs` (inchangé) |
| `pickPool`, `pickNouvelle` | :488, :533 | `statut_ok` ; `pickNouvelle` : listes datée / intemporelle, la datée éligible seule si non vide |
| `miss` | :555 | `epilogue.journal` au journal pour `fallback: nouvelles` ; raison `statut` |
| `enqueueNext` | :604 | `at_season` : `dueN = -1`, `atSeason = season + k`, `atSlot = at` |
| `serve` | :631 | `s.lastWasReaction = false` ; `lastStoryCard` |
| `afterNarrative` | :693 | `outcome` de l'étape (`step.outcome`) appliqué avant `_firstNext` (celui des effets est appliqué par `_applyEffects`, plus tôt) |
| `relationCrossings` | :731 | entrée de journal `palier_*` (gabarit `journal.yaml`) |
| `openSeason` | :774 | signature `openSeason(GameState s, Rng rng)` ; reset `reactionsThisSeason`, `openingSlots`, `reaction = null` (§1.4 règle 5 : servie avant, jamais perdue) ; **planification des fusées `atSeason == season`** (`dueN/deadlineN` posés) ; `chars[*].age += 1` (sauf S0) ; compaction du journal de la saison précédente ; ancres du script (inchangé) ; **puis** `_drawProgramme(s, c, rng)` (§1.2) ou l'ancienne boucle `seeds` ; fil rouge ; boucle `every_season` **seulement** si `programme == null` |
| `+ serveReaction(s, rx, rng)` | nouveau | §1.4 règle 2 ; `toPending(..., extra: {band: 8, kind: 'reaction', arc, step, phase})` |
| `+ addJournal(s, text, {kind, poids, tags, arc})` | nouveau | `formatText` à l'écriture, troncature 120 |
| `+ replayable(s, a)` | nouveau | §1.3 |
| `+ _drawProgramme(s, c, rng)` | nouveau | pseudo-code ci-dessous |

```
_drawProgramme(s, c, rng):
  prog = post.programme.bucketFor(s.season)
  carry = arcs armed|active, kind serie, foreground, roles ok
  carriers = {carrierId de carry} ; themes = {themeId de carry} ; k = max(0, prog.prendre - |carry|)
  cands = []                                        # ordre du fichier, bucket courant puis reprise
  for e in prog.entriesWithReprise(s.season):
     a = content.arcs[e.arc] ; if a == null || !a.roles.contains(s.role) || a.kind != 'serie' continue
     if !replayable(s, a) continue
     if e.ifWhen != null && !evalWhen(e.ifWhen, c) continue
     if !evalWhen(a.when, c) || s.season < a.minSeason continue
     if a.requires.any(f => !s.flags.contains(f)) || a.excludes.any(f => s.flags.contains(f)) continue
     if a.exclusiveWith.any(id => s.arcs[id]?.status ∈ {armed, active}) continue
     if carriers.contains(a.carrierId) continue
     cands.add(e)
  taken = [] ; signatureTaken = false
  for i in 0..k-1:
     if cands.isEmpty break
     w = cands.map(e => poids(e))                    # §1.2 ; 0 si porteur/thème pris
     j = rng.weightedIndex(w) ; if j < 0 break        # 1 appel
     e = cands.removeAt(j) ; taken.add(e) ; a = arcs[e.arc]
     carriers.add(a.carrierId) ; themes.add(a.themeId) ; if e.signature signatureTaken = true
  for e in taken:                                     # ordre du tirage
     u = prog.fenetre[0] + rng.nextInt(prog.fenetre[1] - prog.fenetre[0] + 1)   # 1 appel
     u = _freeSlot(s, u, prog.fenetre)                # sans Rng : +1 tant que |u - x| < ouverture_ecart pour x ∈ openingSlots ∪ ancres à slot unique ; borne 15
     s.openingSlots.add(u)
     armArc(s, arcs[e.arc], c, dueN: s.seasonStartN + u, deadlineN: s.seasonStartN + u + 2)
  s.reserve = [for e in cands.take(prog.reserve) e.arc]..sort()
  if post.questions.isNotEmpty:
     q = rng.weightedIndex(post.questions.map(x => x.poids))   # 1 appel
     s.vars['fil_rouge_i'] = q ; (chemin `fil_rouge` → post.questions[q].id)
```

`_freeSlot` est une fonction pure testée seule (test P3).

### 3.5 `packages/core/lib/src/engine.dart`

| Fonction | Ligne | Changement |
|---|---|---|
| `start` | :25 | `start(int seed, {int postulat = 0, String? prenom, String? nom, String? genre})` ; `_makeEntities` inchangé (3 tirages conservés), puis écrasement ; `chars` initialisé depuis `characters` (`age`, `statut`) ; **nouvel appel** `numero = rng.nextInt(30) + 1` si `role == 'joueur'` ; `journal = []` |
| `_applyPending` | :117 | `case 'bilan_une'` : rien ; le `react` de la Une est posé par `_bilanUne` |
| `_applyEffects` | :165 | après `setFlags` : pour chaque drapeau posé qui est une `trace` de l'arc courant (`p.payload['arc']`) ou de n'importe quel arc (recherche `content.tracesIndex[flag]`, première déclaration dans l'ordre des arcs triés) → `addJournal(trace, kind: 'trace', poids: 2)` ; puis `journal:` ; puis `outcome` (`s.arcs[arc].outcome`) ; puis `char:` ; puis `react` (§1.4 règle 1, `chance` → 1 `nextDouble` conditionnel, **après** `rand`, **avant** `schedule`) ; `club: change` → `_changeClub` ; `unlock` inchangé |
| `_resolveBilan` | :344 | journal `bilan_*`, `montee`, `descente`, `titre` ; `vars['titre_saison']` ; `_checkObjectifs(s)` |
| `_transitionTo` | :392 | `s.reaction = null` ; journal `transition` ; `_retrouvailles(s)` |
| `+ _changeClub(s, division, rng)` | nouveau | §1.11 |
| `_checkEndings` | :423 | inchangé |
| `_buildEndingPending` | :446 | `epitaph` via `formatText` (nom, `pg`) ; `epitaph_plus` (première variante vraie) ; `_checkObjectifs` ; payload `journal`, `objectifs`, `histoires`, `unes`, `epitaph_plus` ; journal `fin` |
| `_advance` | :476 | première ligne : `if (applied.payload['kind'] == 'reaction') { s.lastWasReaction = true; return; }` |
| `_draw` | :507 | avant `if (s.beat == 0) director.openSeason(s)` : `final rx = s.reaction; if (rx != null) { s.reaction = null; final p = director.serveReaction(s, rx, rng); if (p != null) { s.turn += 1; s.pending = p; return; } }` ; puis `director.openSeason(s, rng)` ; `case 'bilan_une': s.pending = _bilanUne(s, rng)` ; set-pieces : `_objectiveCard`, `_cupCard`, `_gmAnnonce`, `_afterMatchCard`, `_bilanVerdict`, `_bilanContrat`, `_bilanCarrefour` appellent `_setpieceText(kind, phase)` pour leur texte |
| `_cardToPending` | :557 | `formatText(..., speakerId: card.speaker)` pour `text`, labels, `answer` |
| `_objectiveCard` | :617 | texte par set-piece ; `speaker` = patron (existant) |
| `_bilanUne` | :721 | `_bilanUne(GameState s, Rng rng)` : §1.6 ; `Pending(kind: 'bilan_une', text: titre, payload: {une, journal, journal_nom, titre, sous, breves: [texts], photo: {card, answer}, annee, prix, rang, tenu, objectif}, single: true)` |
| `_bilanCarrefour` | :766 | set-piece `transition:` |
| `_makeEntities` | :816 | inchangé (3 tirages + club, rival, capitaine, ville, coach dans le même ordre) |
| `+ _checkObjectifs(s)` | nouveau | §1.9 |
| `+ _retrouvailles(s)` | nouveau | §1.13 |

### 3.6 `packages/core/lib/src/text.dart`, `condition.dart`, `naming.dart`

- `formatText(template, s, {speakerGenre, speakerId})` : vars `+ prenom, nom, NOM, initiales, toi, Toi, numero, rang, pts, annee, saison, objectif, division, CLUB, VILLE, age, age_<id>`, `chars.*` non exposés au texte. `{toi}` : `content` n'est pas accessible à `text.dart` → `formatText` reçoit `adresse: String?` déjà résolue par l'appelant (`_cardToPending` calcule `characters[speaker].adresse[role][expression]` puis `_render` l'interpole récursivement, profondeur ≤ 2). `{Toi}` capitalise la première lettre.
- `condition.dart` : §2.11 ; `EvalContext` gagne `bilanTenu`, `bilanRang` (nullables, posés par `_bilanUne` et `_resolveBilan` pour la phase `bilan`), `content` n'est pas nécessaire (`fil_rouge` résout via `s.vars['fil_rouge_i']` et une liste d'ids posée dans `s.entities.named['fil_rouge']` à l'ouverture — plus simple : `openSeason` écrit `s.vars['fil_rouge_i']` **et** `s.entities.named['fil_rouge'] = id` ; le chemin lit `named`).
- `naming.dart` (nouveau, pur) : `normalizeName`, `upperName`, `initials`, `isBlacklisted(blacklist)` ; testé (N2-N4).

### 3.7 Outils

**`packages/tools/bin/build_content.dart`** : parse `programme`, `questions`, `objectifs`, `pitch`, `chantier` ; `theme/carrier/replay/requires/excludes/exclusive_with/hint/journal/traces/issues` ; `outcome` d'étape ; `at_season/at` ; `year`, `statut_ok`, `char`, `club`, `react`, `journal`, `outcome` dans les effets ; `unes.yaml`, `journal.yaml`, `setpieces.yaml`, `characters.adresse/age/statut/retrouvailles`, `endings.epitaph_plus/rebond`, `tags.themes`, `calendar` quotas. Dérivations : `kind: reaction` pour toute carte citée par un `react` (claim mécanisme `react/<carte source>`), `themeId` résolu, `exclusive_with` symétrisé, `tracesIndex` (drapeau → arc). Validations (erreurs) : §2.1-2.4 ; `once: true` sur une étape d'arc `replay` ; `react` vers une carte `end`/`react`/`drame`/sans `speaker` ; `outcome ∉ issues` ; `journal:` sur une routine ; `bilan.*` hors d'une manchette / set-piece de bilan / `epitaph_plus` ; `programme` et `seeds` ensemble ; `signature` > 1.

**`packages/tools/bin/lint.dart`** : `seeds` déprécié (avertissement) ; par postulat non `chantier` : réservoir ≥ 12 arcs dont ≥ 1 signature, ≥ 6 thèmes, ≥ 6 porteurs, ≥ 3 `min_season ≥ 2`, ≥ 8 réactions, ≥ 10 manchettes dont ≥ 3 sur des traces, 3 objectifs, chaque visage du cast porteur ou cast d'≥ 2 intrigues, chaque trace lue ≥ 1 fois, ≥ 25 cartes du rôle avec un placeholder de nom ; `{toi}` exige `speaker` ; `adresse` complète ; titres de Une ≤ 44 rendus ; placeholders inconnus (Unes, journal, épitaphes, set-pieces) = erreur ; Nouvelle sans `year` qui parle de vidéo/fonds/réseaux = avertissement ; arc `replay` ⇒ variante `plays()` ; le nom jamais dans un libellé de bouton ; réaction citée deux fois = autorisé (même carte pour deux déclencheurs).

**`packages/tools/bin/simulate.dart`** : §5 (métriques, `--diff`, `--reservoir`, `--seasons`, `--assert` par postulat, `--une-check`).

**`preview`** (l'aperçu jouable web : `engine.js` compilé par dart2js + `fusible_preview.html` du scratchpad, à verser dans `packages/preview/` lors de l'étape 5) : saisie du nom, rendu de la Une, écran « Ce qui s'est passé », bandeau « Nouvelle histoire ».

### 3.8 L'app (`app/lib`)

| Écran | Changement | Taille |
|---|---|---|
| `title_screen.dart` | ligne « Nom : ________ » sur la pochette ouverte (prénom, nom, tampon ♀/♂, « Au hasard »), mémorisée (`shared_preferences`, à ajouter à `pubspec`) ; sous chaque pochette : `pitch`, « Objectifs 1/3 · Histoires 5/14 » (profil local : `discoveredObjectifs`, `discoveredStories`) ; les **4** pochettes visibles dès l'étape 1 (les postulats en `chantier` portent un tampon « EN CHANTIER » tant que leur lot n'est pas livré) | M |
| `game_controller.dart` | `newRun(postulat, {prenom, nom, genre})`, `succeed()` garde `nom` ; `discoveredObjectifs`, `discoveredStories` (titres d'arcs joués) ; import de code : « sous mon nom / sous le sien » | S |
| `game_screen.dart` | rendu du `Pending` `bilan_une` comme **page de journal** (widget `UnePage`) : masthead (nom du journal, `style` bleu/rose/local), date-prix, manchette (Barlow 800, 34/0,95, `text-wrap: balance`, ≤ 3 lignes : au-delà on réduit à 28 puis 24), sous-titre (Fraunces italique 500), photo = vignette de la carte fatale rendue en N&B tramé (`ColorFiltered` + grain) avec la légende `answer`, colonne « En bref » = 3 brèves, pied « Classement · Objectif ». Mode sombre : la page reste papier (`--journal`), le fond hors page suit le thème. Bandeau « Nouvelle histoire : *{titre}* » (2 s) quand `payload.unlocked_story` est présent (posé par `serve` quand `plays == 0` et première étape d'un arc `serie`). Vignette de réaction : kindTag « RÉPLIQUE », coin scotché, sans numéro de créneau | M |
| `ending_screen.dart` | « Ce qui s'est passé » sous l'épitaphe (maquette ci-dessous) ; objectifs avec indices ; histoires découvertes ; boutons « Successeur », « Partager la Une », « Le journal complet » (page Almanach : `journal` par saison, export texte) ; image de partage avec case « masquer le nom » | M |

Maquette de l'écran de fin (texte) :

```
Lina Nkolo · 43 ans · 1990-1992 · Étoile Bretagne
LE SMS DE 23H47
Virée par SMS entre la conférence de presse et le parking. Le message
contenait une faute d'orthographe. Elle l'a corrigée.
Gégé a découpé la Une. Il la garde.

Ce qui s'est passé
1990 · Nommée pour trois matchs, Nkolo n'a rien promis.
1990 · Lian Mbako, 16 ans, lancé en pro contre l'avis du président.
1991 · « NKOLO, LE MIRACLE DE BRETAGNE », titre Le Quotidien du Ballon.
1991 · Gégé ne parle plus à Lina Nkolo.
1992 · Arena Qatalyst : le stade change de nom.
1992 · Le SMS de 23h47.

Objectifs 1/3 — Le banc de Gigi ✔ · « Tenir. Encore. » · « Il y a de l'argent qui frappe à la porte. On peut ne pas ouvrir. »
Histoires vécues : Le prodige · Le vieux gardien · Le sponsor qui devient propriétaire · Les salaires en retard
Débloquée : Le retour de Mbako
[Successeur]   [Partager la Une]   [Le journal complet]
```

Règles typographiques du nom dans l'app : `{NOM}` en Barlow condensé, jamais plus de 16 lettres (garanti par la validation) ; les manchettes sont rendues avec `FittedBox` en largeur et un plafond de 3 lignes ; un titre qui déborde encore passe en 24 pt (le lint garantit ≤ 44 caractères, donc ce cas n'arrive qu'avec des glyphes larges).

### 3.9 Déterminisme, compatibilité, tests

**Inventaire du Rng (par ordre d'appel).**

| Moment | Appels | Ordre |
|---|---|---|
| `start` | inchangé (genre, prénom ×2, nom ×2, club ×2, rival ×2, capitaine ×2, ville, coach ×2, âge, métier de Camille) ; **+ 1 `nextInt` (dossard) si rôle joueur** | après l'existant |
| ouverture de saison | ≤ `prendre` `weightedIndex` + ≤ `prendre` `nextInt` (fenêtres) + 1 `weightedIndex` (fil rouge, si `questions`) | après purge/ancres, avant tout tirage de carte ; **0 appel si `programme == null`** |
| par carte narrative | inchangé (`armEvents` 0-1, `maintainArcs` 0-1, tirage doux 0-1, Nouvelle 0-1, sac 0-1) | — |
| réaction servie | 0 | — |
| swipe | inchangé (`rand`, match, temps fort…) + 0-1 `nextDouble` si un `react` a `chance` | après `rand`, avant `schedule` |
| `bilan_une` | 1 `weightedIndex` | — |
| set-pieces, objectifs, journal, Une (hors manchette), retrouvailles, `_changeClub` | 0 (sauf `_changeClub` : `range(-6,6)` + club ×2, comme `_transitionTo`) | — |

**Conséquence** : `meta.yaml → version: 2` ; les Codes de Carrière v1 ne rejouent plus la même carrière. Politique (app) : un code dont `contentVersion != content.version` s'affiche « carrière d'une ancienne édition — jouable, mais différente » ; une **partie en cours** au moment de la mise à jour est **conservée telle quelle** (l'app garde le `GameState` sérialisé, pas la liste de swipes) : `fromJson` accepte l'absence des champs nouveaux, `chars` est reconstruit, `journal` démarre vide ; seule la **relecture des swipes** (mode replay/duel) diverge, et l'app la refuse sur un code d'une autre version.

**Les 22 tests existants.**

| Test | Effet |
|---|---|
| `director_test` 1-3 (bandes, finale, réservation) | contenu synthétique sans `programme` ni `react` → chemins anciens, **inchangés** |
| 4-6 (cadence, cadence_pull, famine) | inchangés ; `forceStory` pioche `s.reserve` vide puis `eligibleArcs` comme avant |
| 7 (queue-jumping), 8 (once/cooldown en file) | inchangés |
| 9 (changement de club → Nouvelles du passé) | inchangé ; `epilogue.journal` absent = pas d'entrée |
| 10 (alarmes), 11 (drame) | inchangés |
| 12-13 (`next.if`, next explicite) | inchangés ; l'`outcome` d'étape est absent |
| 14 (franchissement de relation) | inchangé ; l'entrée de journal `palier_*` n'existe pas sans `journal.yaml` (gabarit absent = pas d'écriture) |
| 15 (déterminisme 25 graines × 4 postulats, deux exécutions) | **passe** dès que la consommation Rng est à ordre fixe ; le `fingerprint` étendu (`plays`, `outcome`, `journal.length`, `reaction`) le rend plus strict |
| 16 (propriétés 150 runs) | `slot ∈ [0,17]` ✔ (les réactions ne touchent pas `slot`) ; `scheduled.length ≤ 12` : 4 ancres + 4 intrigues + 2 fusées + alarme + palier = 12 — **on garde 12** et on mesure (`--assert` backlog) ; cooldown de bande 0 ✔ ; famine 0 ✔ ; jauges ✔ |
| `engine_test` a-run-ends, determinism ×5, replay swipes, JSON round-trip, gauges, CareerCode | passent (JSON : toutes les nouvelles listes sont à ordre stable — `reserve` triée, `themesPlayed` triée, `chars` clés triées, `journal` en liste) |

**Tests nouveaux** (`director_test.dart`, contenu synthétique + réel) :

- **P1** programme : 3 intrigues prises, porteurs et thèmes distincts, `openingSlots` à ≥ 3 d'écart, `reserve` = le reste trié, `fil_rouge` posé ; **P2** même graine → même programme, 10 graines → ≥ 4 programmes distincts ; **P3** `_freeSlot` : collisions avec les ancres à slot unique et entre ouvertures ; **P4** `reprise` : une entrée de `"0"` non tirée est candidate en `"1"` ; **P5** signature : au plus une, ×3 en S0 seulement.
- **R1** replay : arc `done` en S0 de nouveau éligible en S2 (`after: 2`), variante « encore » servie, `plays == 2`, `outcome` conservé ; **R2** rituel : servi chaque saison sans doublon avec la boucle `every_season` ; **R3** `once: true` sur une étape d'arc `replay` = erreur de build (test de `build_content` sur un fixture).
- **X1** réaction : servie au tirage suivant sans avancer `beat`, `slot` ni `ncards` ; **X2** plafond 4 et jamais deux d'affilée ; **X3** servie entre la carte 17 et le Grand Match ; **X4** posée sur la dernière carte avant le Carrefour : rollover puis réaction avant `openSeason`, saison suivante intacte (mêmes ancres qu'un run sans réaction) ; **X5** jetée à `_transitionTo` ; **X6** `chance` : consommation Rng présente seulement si `chance` déclaré (fingerprint des deux variantes).
- **U1** Une : bande de priorité puis pondération, secours sans condition, `{NOM}` rendu, brèves = 3 entrées les plus lourdes hors sujet ; **U2** « la Une ne ment pas » (réel) : sur 200 runs, `payload.tenu` de `bilan_une` == `verdict.objectiveMet` appliqué au swipe suivant, et `payload.rang == world.rangFinal` après `_resolveBilan` ; **U3** `bilan.tenu` hors phase bilan = erreur de build.
- **N1** nom : `start(prenom: 'Anne', nom: 'Durand', genre: 'f')` → même `rngState` et même fingerprint hors `entities` que `start()` ; **N2** normalisation (« da silva » → « Da Silva », coupure, caractères retirés) ; **N3** `{NOM}` accents, `{initiales}` ; **N4** liste noire → nom tiré ; **N5** `{toi}` par locuteur et relation (Gégé : `{prenom}` → « coach » → `{nom}`), `{Toi}` capitalisé.
- **J1** journal : traces écrites au `set`, compaction à 12, `fingerprint` inclut la longueur ; **J2** « Ce qui s'est passé » = 6 entrées `(-poids, -season, slot)` ; **J3** objectif atteint → `unlocked`, journal, payload.
- **C1** `chars` : âge +1 par saison, `statut_ok`, purge `statut` ; **C2** `club: change` : `clubSeq`, Nouvelles du passé, retrouvailles en `[2,6]`, réaction jetée.
- **S1** set-pieces : première variante vraie, secours ; `transition:` remplace le libellé du Carrefour.
- **G1** golden : 20 Codes de Carrière de référence (`content/tests/goldens.yaml` : code → fingerprint final + id de fin), régénérés à chaque bump de `meta.version` par `simulate --goldens`, vérifiés en CI.

---
## 4. Plan de contenu par postulat

Notation d'une intrigue : **id · Titre** — porteur ; cast ; thème ; saisons (bucket) ; rejouabilité. *Pitch.* Issues → traces (drapeaux) et **qui les lit**. Cartes = étapes + variantes. Les intrigues marquées (∃) existent (à enrichir : `theme`, `carrier`, `issues`, `traces`, variante « encore »). Les intrigues `co.*` sont partagées entre les deux postulats d'un rôle (écrites une fois, comptées une fois). Grille commune : 14 intrigues par postulat, 9 réactions, 10 manchettes, 3 objectifs ; par intrigue 3-5 étapes, ≈ 5-7 cartes avec variantes, dont une étape en saison suivante quand c'est naturel et **une variante lisant une trace d'une autre intrigue**.

Règle d'écriture (inchangée, brainstorm 05 §5.1) : deux phrases, un tic, un nom une fois ; ≤ 200 caractères de texte, ≤ 28 par libellé ; l'`answer` est une phrase de conséquence, jamais une explication ; la relation se lit sur le visage, jamais en chiffre.

### 4.1 P0 — « Le promu sans un sou » (entraîneur, D1, 1990) — existant : 85 cartes, 7 arcs

**Fil rouge** : `tribune` / `president` / `argent` (la question du postulat, tirée). **Script allégé** `en.promu.sans_un_sou` : S0 = A1 *L'inventaire* (slot 1, 3 variantes : `fil_rouge`) · A4 *La lettre de la Commission* (10-11, variante `salaires_retard` : « et la banque, en plus ») · A5 *Le dernier match* (16, ∃ 2 variantes) · A6 *Le dernier virage* (17, variante `vukic_dauphin`) ; A2 *L'empire* et A3 *La cote* sortent du script et deviennent l'intrigue *La cote du promu*. S1 = A7 (∃ 4 variantes) · A8 (∃ 3 + variante `fil_rouge == 'argent'` : Nassir au twist) · A9. S2+ = rentrée (variantes `saisons_tenues`, `fils_ds`) · veille.

**Réservoir (14)**

1. **en.kop_qui_aime_trop · Le kop qui t'aime trop** (∃, `signature`) — Gégé ; tribune ; "0" ; `replay: {after: 2, max: 2}`. *La tribune est à 80 et vient réclamer sa part : le local, le onze du virage, le pacte, les banderoles.* Issues `pacte | banderoles | bache` → `pacte_gege`, `onze_du_virage` lus par *Le derby* (variante « le virage te suit »), la manchette « Le onze du virage », l'alarme tribunes haute. Variante « encore » : « La tribune n'oublie rien, coach. Surtout pas le pacte. » Cartes : 8 (∃) + 1.
2. **en.prodige · Le prodige** (∃) — Mbako ; Vukić, Fardelli, mère, Aulard ; mercato ; "0". Issues `vendu | garde | clause` → `mbako_vendu` (lu par A4, « Trente millions », *Le retour de Mbako*), `mbako_garde`. Effet `char: {mbako: {statut: vendu}}` sur l'issue vendu. Cartes : 9 (∃).
3. **en.nassir_proprietaire · Le sponsor qui devient propriétaire** (∃) — Nassir ; caisse/argent ; "0" ; `replay: {after: 2, max: 2}` ; `exclusive_with: [en.salaires_retard]`. Issues `ancienne | naming | rachat` → `club_a_lancienne` (objectif), `naming_signe` (« Arena Qatalyst », Nouvelle S1), `club_actif` (exclut *Les salaires*). Cartes : 8 (∃) + 1 « encore ».
4. **en.vieux_gardien · Le vieux gardien** (∃, devient `replay: ritual`) — Vecchio ; Vukić, Sabatier ; vestiaire ; "0" puis rituel. *Gigi prend sa retraite chaque juin.* Escalier sur `plays()` : « je raccroche » → « encore une » → « cette fois c'est vrai, j'ai {age_vecchio} ans » → « entraîneur des gardiens » (`outcome: staff`, `char: {vecchio: {statut: staff}}`, objectif *Le banc de Gigi*). Issues `finale | jeune | staff | parti`. Cartes : 6 (∃) + 3 variantes rituelles.
5. **en.mentor_clow · Le mentor** (∃) — Clow ; presse ; "1" ; `min_season: 1`. Cartes : 9 (∃).
6. **en.cote_du_promu · La cote du promu** — Ménèche ; Aulard, Josiane ; presse ; "0". *Cinq mille contre un pour le titre. Aulard vend le rêve, Ménèche vend la cote, Josiane tient la caisse.* Étapes : (1) *L'empire* (∃ A2 : budget ou projet) → (2) *La cote* (∃ A3) [3,6] → (3) *L'encaissement* [8,14, this_season] (variantes : `pari_promu && world.rang <= 13` « vous encaissez ? » / `projet_promis` « le projet, en un mot ? »). Issues `pari_tenu | pari_perdu | jamais_parie` → `pari_promu` (∃, lu par la manchette « Il avait parié sur lui », A7 miracle). Cartes : 2 (∃) + 3.
7. **en.salaires_retard · Les salaires en retard** — Josiane ; Bréhaut, Aulard, Nassir ; argent ; "0" ; `replay: {after: 2, max: 2}` ; `when: caisse < 45`. *La paie du 5 n'est pas arrivée ; le vestiaire l'apprend au distributeur.* Étapes §2.2. Issues `avance | patience | nassir` → `salaires_retard` (alarme vestiaire basse variante « la grève d'entraînement » ; manchette « Payés en retard, sauvés à temps » ; twist S1 de l'intérimaire), `salaires_avances` (A7 ingratitude), `nassir_paie` (arme *Nassir* : `poids ×2` via `if`). Cartes : 6.
8. **en.espion_haie · L'espion dans la haie** — Vukić ; Gégé, Ménèche ; presse ; "0" ; `replay: {after: 3, max: 2}`. *Un type avec des jumelles dans la haie du terrain d'entraînement. Vukić l'a vu. Gégé aussi.* Issues `cafe | presse | retour` → `espion_cafe` (Gégé le raconte au local : variante du kop), `espion_presse` (manchette « L'homme de la haie »), `espion_retour` (à la Coupe, set-piece `cup` variante « les jumelles »). Cartes : 5.
9. **co.derby · Le derby de la vallée** — Gégé ; Bréhaut, Camille, Ménèche ; tribune ; "0" ; `replay: ritual`. *La semaine du derby contre {rival} : mise au vert ou vie normale, puis le chambrage ou la honte au boulot.* Étape 3 lue sur `world.lastResults` du bloc suivant. Issues `gagne | perdu` → `derby_gagne` / `derby_perdu`, `vars.derby_serie` (variantes « encore »). Lu par : set-piece `gm_annonce`, la manchette « La vallée a un patron », *Le kop*. Cartes : 4 + 2 variantes (partagée joueur : « ta sœur est de {rival} »).
10. **co.cartons_camille · Les cartons** — Camille ; Josiane ; famille ; "0" ; `replay: {after: 3, max: 2}` ; `excludes: [divorce]`. *La maison est à deux cents kilomètres ; Camille fait les cartons : elle vient, ou tu rentres.* Issues `ici | hotel | promis` → `camille_ici` (paliers de Camille), `hotel_du_club` (Josiane sert le café chaque rentrée : set-piece `objective` variante), `promis_camille` (non tenu → palier −2). Variante métier (`camille_avocate`…). Cartes : 5.
11. **en.brassard_brehaut · Le brassard** — Bréhaut ; Mbako, Vecchio, Vukić ; vestiaire ; "1". *Bréhaut a 33 ans, un genou qui parle et un brassard qu'il ne veut pas rendre.* Issues `garde | gigi | mbako | staff` → `brehaut_capitaine`, `brassard_gigi`, `brassard_mbako`, `brehaut_staff` (S2+ : il devient ton relais, ou DS de Nassir si `club_actif`). Lu par : alarme vestiaire haute, manchette « Un brassard, deux capitaines », *L'adjoint qui dîne*. Cartes : 6 (dont une à `at_season: +1`).
12. **en.adjoint_dine · L'adjoint qui dîne** — Vukić ; Aulard, Josiane ; direction ; "1" ; `if: relation.vukic <= 0 || relation.aulard >= 2`. *Josiane a vu Vukić et Aulard au restaurant du port. Il n'était pas question de toi. Enfin si.* Issues `confronte | dauphin | aulard` → `vukic_ecarte` (`char: {vukic: {statut: parti}}` : il entraîne {rival}), `vukic_dauphin` (A6 variante, `epitaph_plus` de `en_sms`, fin `en_dauphin` si Bilan manqué à l'étape S+1), `aulard_confronte`. Cartes : 6.
13. **en.enveloppe · L'enveloppe** — Fardelli ; Bréhaut, Ménèche, Legruet ; instances ; "1" ; `if: world.rang <= 6 || objective == 'maintien'`. *Un intermédiaire — Fardelli a « un ami » — propose que trois joueurs de {rival} lèvent le pied avant le dernier bloc.* Issues `jamais | paye | denonce` → `enveloppe_refusee`, `enveloppe_promise` (∃ ; S+1 : « un joueur adverse parle » → *La commission de discipline* → fin `en_valise`), `enveloppe_denoncee`. Cartes : 6.
14. **co.pharmacie · La pharmacie du club** — Sabatier ; Bréhaut, Legruet ; corps ; "1" ; `if: relation.sabatier >= 1 || gauges.vestiaire < 40`. *« De la créatine. Légal. Enfin, encore. » L'armoire, le contrôleur à l'accueil, le flacon B.* Issues `propre | ferme_les_yeux | denonce` → `pharmacie_propre`, `flacon_b` (`rand` 50 % au contrôle ; manchette, *Commission de discipline*), `sabatier` ennemi. Partagée joueur (variante victime). Cartes : 7.

**"2+" (tardives et seconde vague, 4 propres)** : **en.fils_aulard · Le fils du président** (Aulard ; `min_season: 2` ; issues `joueur | ds | refuse` → `fils_ds` : caisse `-` à chaque mercato via set-piece) · **en.retour_mbako · Le retour de Mbako** (`if: flag('mbako_vendu')` ; il marque contre toi (`co.nouvelle.marque_contre_toi` ∃ réutilisée), il veut revenir, sa mère renégocie ; `statut_ok: [vendu]`) · **en.gigi_staff · Gigi au staff** (`arc_outcome == 'staff'` ; rituel : il te dit ce que le vestiaire pense, à sa façon ; `statut_ok: [staff]`) · **en.dossier_meneche · Le dossier Ménèche** (gabarit « dossier » : étape 1 à 6 variantes lues sur `pari_promu`, `voiture_couverte`, `enveloppe_promise`, `flacon_b`, `espion_retour`, `diplome_arrange` ; `replay: {after: 1, max: 9}`) · **en.commission_discipline · La commission de discipline** (Legruet ; `requires` `flacon_b` ou `enveloppe_promise` ; sortie `end: en_valise`). Cartes : 6 + 5 + 4 + 8 + 4 = 27.

**Réactions (10)** — id · après (carte, côté) · qui · texte · effet :

| id | après | qui | texte | effet |
|---|---|---|---|---|
| en.re.josiane_cheque | A2 `en.promu.a2_empire` ← budget | Josiane | « Il n'est pas daté. J'en ai vu passer, vous savez. Je le date de quand ? » | ← aujourd'hui : caisse +, Aulard −1 · → quand il faudra : Josiane +1 |
| en.re.meneche_projet | A2 → projet | Ménèche | « Juste une question, hors micro : le projet, c'est quoi ? En un mot. » | ← « le maintien » : parole +1 · → « le Top 10 » : tribunes ++, parole −1 |
| en.re.camille_le_verre | `en.kop.local` ← j'y vais | Camille | « Tu rentres à quelle heure ? Il est une heure. Tu sens la bière et la tribune. » | ← « je t'explique » : Camille +1, tribunes − · → « c'est le métier » : Camille −1 |
| en.re.fardelli_numero | `en.prodige.gamin_u19` tous | Fardelli | « Mon ami, on parle d'argent ou d'amitié ? Le gamin a un agent depuis ce matin. C'est moi. » | un bouton : `mbako_agent_fardelli` |
| en.re.gege_jumelles | `en.espion.cafe` ← café | Gégé | « On l'a raccompagné à sa voiture. On a noté la plaque. La tribune n'oublie rien. » | un bouton : tribunes + |
| en.re.mere_orange | `en.nassir.maillot` → orange | mère de Mbako | « Mon fils ne portera pas une boisson. Mon fils n'a besoin de personne. Surtout pas d'orange. » | ← « le maillot est le maillot » : Mbako −1 · → « un maillot blanc pour lui » : caisse −, Mbako +1 |
| en.re.vecchio_bus | `en.alarme.vestiaire_bas_vukic` → qu'ils restent | Vecchio | « J'en ai vu d'autres. Pas celle-là. Je descends, coach. Seul. » | un bouton : vestiaire +, Vecchio +1 |
| en.re.aulard_sms_brouillon | A4 ← on vend | Aulard | « J'ai écrit un SMS à Fardelli. Je te le lis. Il y a une faute, tu la vois ? » | ← « je la corrige » : Aulard +1 · → « envoie » : direction +, parole −1 |
| en.re.brehaut_onze | `en.kop.onze` ← on signe | Bréhaut | « Le groupe vit bien. Le groupe a lu la compo dans le journal. Avant toi, {toi}. » | un bouton : vestiaire − |
| co.re.josiane_a_lu | toute manchette de priorité ≥ 3 (`react` de la Une) | Josiane | « J'ai lu le journal. Je l'ai rangé sous les autres. J'en ai vu passer, vous savez. » | un bouton : direction +, Josiane +1 (`once` : une fois par carrière — autorisé sur une réaction posée par la Une) |

**Manchettes (12)** — id · journal · condition · titre — sous-titre :

| id | journal | when | titre |
|---|---|---|---|
| une.promu.miracle | quotidien | `bilan.tenu && world.division == 1 && bilan.rang <= 10 && season == 0` | **{NOM}, LE MIRACLE DE {VILLE}** — Promu sans un sou, {rang}e. Aulard parle déjà de « projet ». |
| une.promu.maintien | quotidien | `bilan.tenu && world.division == 1` | **{VILLE} RESTE PARMI LES GRANDS** — Maintien à la dernière journée. {prenom} {nom} n'a rien promis. Enfin, presque. |
| une.promu.chauffage | gazette | `!bilan.tenu && flag('choix_maillots')` | **DES MAILLOTS NEUFS, UN VESTIAIRE FROID** — {club} descend. {prenom} {nom} avait choisi les maillots. |
| une.promu.ingratitude | gazette | `bilan.tenu && relation.aulard <= -1` | **MAINTENU, PAS AIMÉ** — Aulard, interrogé : « J'ai pas le temps, j'ai un empire. » |
| une.promu.onze_virage | gazette | `flag('onze_du_virage')` | **LE ONZE DU VIRAGE** — À {ville}, la compo se vote en tribune Nord. L'entraîneur signe. |
| une.promu.trente_millions | quotidien | `journal_has('mbako_vendu')` | **TRENTE MILLIONS ET UN GAMIN** — Lian Mbako, 16 ans, vendu. Sa mère a lu la clause. Elle l'avait écrite. |
| une.promu.arena | gazette | `journal_has('naming_signe')` | **ARENA QATALYST** — Le nom en orange, le nôtre en dessous, en petit. La tribune chante l'ancien. |
| une.promu.salaires | echo | `flag('salaires_retard') && bilan.tenu` | **PAYÉS EN RETARD, SAUVÉS À TEMPS** — Trois semaines sans paie, un maintien quand même. |
| une.promu.haie | gazette | `flag('espion_presse') \|\| flag('espion_retour')` | **L'HOMME DE LA HAIE** — Des jumelles, un café et une plaque d'immatriculation. |
| une.promu.dauphin | quotidien | `flag('vukic_dauphin') && !bilan.tenu` | **LE DAUPHIN ATTEND** — Zoran Vukić « réfléchit ». Le président a deux discours. {NOM} n'est que dans un. |
| une.promu.valise | quotidien | `flag('enveloppe_promise')` | **LA VALISE DE {VILLE}** — Trois joueurs adverses, une enveloppe. La Fédération « examine ». |
| une.promu.pari | echo | `flag('pari_promu') && bilan.tenu` | **IL AVAIT PARIÉ SUR LUI** — Cent francs à cinq mille contre un. Ménèche « ne commente pas ». |

Génériques (tous postulats, 8) : **CHAMPIONS !** (`bilan.rang == 1`, 4) · **LE RÊVE A DURÉ UN AN** (descente, 4) · **L'OBJECTIF EST MANQUÉ, PAS LE COUPABLE** (`!bilan.tenu`, 1) · **LES PROMESSES DE {NOM}, DATÉES** (`parole <= -3`, 3) · **{VILLE} EN FEU (DE JOIE)** (`gauges.tribunes >= 80`, 2) · **{NOM} PASSE SUR LE BANC** (`role_was('joueur')`, 4) · **{CLUB} : OBJECTIF TENU** (0) · **SAISON MANQUÉE À {VILLE}** (0).

**Objectifs** : §2.1. **Budget P0** : intrigues nouvelles 6 (32 cartes) + enrichissement des 5 ∃ (6 variantes) + "2+" 27 + réactions 10 + set-pieces 20 lignes + Unes 12 + `journal:` sur 30 cartes ∃ + `{toi}` sur 40 cartes ∃ ≈ **75 cartes nouvelles**, 70 retouchées.

**Exemple de carte écrite (étape 2 des *Salaires en retard*)** :

```yaml
  - id: en.salaires.brehaut
    roles: [entraineur]
    arc: vestiaire
    tags: [vestiaire, caisse]
    speaker: brehaut
    tone: strategique
    text: "Bréhaut, relevé de banque à la main : « Le groupe vit bien. Pas à crédit. Le 5, c'était il y a douze jours, {toi}. Tu savais ? »"
    left:
      label: "Je savais, je m'en occupe"
      effects: {vestiaire: "-", parole: 1, promise: true, relation: {brehaut: 1}, set: [salaires_avances], react: {card: en.re.aulard_avance}}
      answer: "Il plie le relevé. Il le garde dans la poche du survêtement, côté cœur."
    right:
      label: "Première nouvelle"
      effects: {vestiaire: "--", direction: "+", relation: {brehaut: -1}, set: [salaires_retard]}
      answer: "Il te croit. C'est pire."
```

(`salaires_avances` et `salaires_retard` sont des `traces` de l'arc : leur ligne d'Almanach est écrite par le moteur.) Et la réaction qu'elle pose :

```yaml
  - id: en.re.aulard_avance
    roles: [entraineur]
    arc: direction
    tags: [direction, caisse]
    speaker: aulard
    tone: leger
    text: "Aulard, au téléphone, sans dire bonjour : « Tu as fait avancer la paie sans me demander. J'ai pas le temps, j'ai un empire. Tu la dates de quand, ta démission ? »"
    left:
      label: "De jamais"
      effects: {direction: "-", relation: {aulard: -1}}
      answer: "Il raccroche. Il rappelle pour raccrocher encore."
    right:
      label: "Du 5, comme la paie"
      effects: {direction: "+", vestiaire: "-"}
      answer: "Il rit. Le vestiaire, moins."
```

### 4.2 P1 — « L'intérimaire » (entraîneur, D2, 1990, `interim`, direction 40)

**Question** : « Tu as six semaines pour devenir indispensable, et personne ne te croit. » Fil rouge : `vestiaire` (le groupe de l'ancien) / `diplome` (tu n'as pas le papier) / `grand_nom` (celui qu'on attend). **Situation** : l'entraîneur {coach} (entité existante) a été viré après huit journées ; Aulard te nomme « jusqu'à nouvel ordre ». **Cast** : aulard (patron 3), vukic (rival 2,5), brehaut (cœur 2), josiane (chœur 2), meneche (chroniqueur 1,5), fardelli (tentateur 1), legruet (0,5), gege (horloge 1), clow (0,5), camille (0,5), vecchio (1), nassir (0,5). `alarm_overrides.direction.low` → `en.interim.alarme_aulard_cv` (« J'ai trois CV sur le bureau. Le tien n'y est pas. »).

**Script** `en.interim.six_semaines` : S0 = I1 *Le bureau* (slot 1, Josiane : « Le bureau est encore à son nom. Je jette ses cartons ou je les garde ? » ; variantes `fil_rouge`) · I2 *Le verdict de l'intérim* (10-11 ; variantes : `world.serie_victoires >= 1 || world.rang <= 8` → confirmé (`cdi_signe` possible) ; sinon prolongé « un mois de plus, sans prime » (`interim_prolonge`) ; `gauges.direction < 30` → « un vrai coach arrive lundi » (`dechu`, adjoint jusqu'au Bilan)) · I3 *Le CDI ou la porte* (17, Aulard ; variantes `diplome`, `vukic_dauphin`, `dechu`). S1 = *La première vraie saison* (1-2, Josiane ; variantes `cdi_signe`/`interim_prolonge`/`dechu`) · twist *Le retour de l'ancien* (10-11 : {coach} entraîne {rival} ; variante `methodes_ancien`, `ancien_sali`) · veille. S2+ = rentrée / veille (variantes `diplome`).

**Réservoir (14)** : 1 **en.vestiaire_ancien · Le vestiaire de l'ancien** (`signature`) — Bréhaut ; Vukić, Vecchio ; vestiaire ; "0". *Les joueurs jouent encore son système et regardent Bréhaut avant de te regarder.* Issues `methodes | change | ecarte` → `methodes_ancien` (I3, « L'ombre de {coach} », *L'ancien d'en face*), `nouvelle_methode`, `brehaut_ecarte` (exclut *Le brassard*). Cartes 5 · 2 **en.ancien_en_face · L'ancien sur le banc d'en face** — Ménèche ; Gégé, Bréhaut ; presse ; "1". Issues `mots | silence | poignee` → `guerre_des_mots`. Cartes 6 · 3 **en.diplome · Le diplôme** — Legruet ; Clow, Aulard, Josiane ; instances ; "0" ; `excludes: [diplome]`. *Sans diplôme, pas de banc en D1. Une dérogation de six mois, puis un stage — animé par Brian Clow.* Issues `diplome | derogation | arrange` → `diplome` (∃, Carrefour, set-piece), `derogation`, `diplome_arrange` (*Le dossier Ménèche*). Une étape S+1 (l'examen). Cartes 7 · 4 **en.grand_nom · Le grand nom** — Fardelli ; Aulard, Ménèche, Vukić ; mercato ; "0". *Fardelli représente « Marcelo Loco », l'entraîneur mystique assis sur un seau, que le board veut pour janvier.* Issues `evince | adjoint | fuite` → `loco_evince`, `adjoint_de_loco` (fil rouge S1 « L'adjoint du mystique »), `fuite_loco`. Cartes 6 · 5 **en.kop_doute · Le kop qui doute** — Gégé ; Ménèche ; tribune ; "0". *La tribune chantait le nom de l'ancien. Elle attend.* Issues `adopte | siffle | sali` → `ami_ultras` (∃), `kop_hostile` (alarme tribunes basse variante), `ancien_sali`. Cartes 5 · 6 **en.bureau_ancien · Le bureau de l'ancien** — Josiane ; Camille, Aulard ; absurde ; "0" ; léger. *Ses cartons dans le couloir, son carnet, sa cafetière.* Issues `lu | rendu | donne` → `carnet_ancien` (Vukić sait), `carnet_meneche`. Cartes 4 · 7 **en.cote_interim · Le pari de Ménèche** — Ménèche ; Gégé ; presse ; "0". Issues `parie | no_comment | contre` → `pari_interim`, `pari_contre_soi`. Cartes 4 · 8 **en.mairie_d2 · La D2 et la mairie** — Aubert ; Josiane ; instances ; "1". *Aubert réduit la subvention si le club ne monte pas.* Issues `montee_promise | refus | chantier`. Cartes 4 · 9 **en.lettre_anonyme · La lettre anonyme** — Ménèche ; Legruet, Aulard, Bréhaut ; instances ; "1". *Une lettre accuse l'ancien d'avoir arrangé un match ; Bréhaut était sur le terrain.* Issues `couvre | parle | publie` → `match_arrange_couvert`, `lanceur_alerte`. Cartes 6 · 10-14 partagées : **en.adjoint_dine** (`if` adapté : dès "0", Vukić était l'adjoint de l'ancien), **en.prodige**, **en.vieux_gardien** (variante d'ouverture « Tu es le quatrième coach que je vois cette année. »), **en.salaires_retard**, **co.cartons_camille** (variante « six semaines, on ne déménage pas pour six semaines »), **en.mentor_clow** (dès "0" via *Le diplôme*), **en.nassir_proprietaire**, **co.derby**.

**"2+"** : **en.aulard_rappelle · Aulard te rappelle** (`replay: {after: 1, max: 3}` ; « Je te vire souvent, je te rappelle toujours » : après un Bilan manqué, l'offre de rester quand même — 4 cartes) · **en.fils_aulard** (partagée) · **en.dossier_meneche** (partagée, gabarit).

**Réactions (9)** : Josiane après I1 (« Sa cafetière fait un meilleur café. Je la garde ? ») · Bréhaut après « je garde ses méthodes » (« Le groupe vit bien. Il vous fait dire merci. Il vous fait dire aussi qu'il reviendra. ») · Ménèche après le pari (« La Une de demain : “L'INTÉRIMAIRE PARIE SUR LUI”. Ça vous va, ou je mets “SUR SA TÊTE” ? ») · Fardelli après Loco (« Il veut visiter le vestiaire jeudi. Avec son seau. ») · Legruet après la dérogation (« Le tampon, lui, on le voit maintenant. Il manque une signature. ») · Gégé après « pas ce soir » (« Lui, il venait. La tribune n'oublie rien. Elle compte aussi. ») · Camille après I1 (« Six semaines, c'est un délai ou un contrat ? ») · Aulard après I3 ← CDI (« Le CDI est un CDD de douze mois. Tu signes ? » → `cdi_signe`/`interim_prolonge`) · Vukić après une manchette négative (« Le journal était dans la boîte du président. Ouvert. »).

**Manchettes (10)** : **L'INTÉRIMAIRE EST TITULAIRE** (`bilan.tenu && flag('cdi_signe')`) · **L'OMBRE DE {COACH}** (`methodes_ancien`) · **LE COACH SANS PAPIER** (`derogation`) · **DIPLÔMÉ, ET MAINTENU** (`diplome && bilan.tenu`) · **LE SEAU RESTE AU PLACARD** (`loco_evince`) · **{NOM}, L'ADJOINT DU MYSTIQUE** (`adjoint_de_loco`) · **LA TRIBUNE CHANTE ENCORE {COACH}** (`kop_hostile`) · **IL AVAIT PARIÉ SUR LUI** (`pari_interim && bilan.tenu`) · **DERBY DES EX : {NOM} CONTRE {COACH}** (`guerre_des_mots`) · **MONTÉE !** (`bilan.rang <= 2 && world.division == 2`, priorité 4).

**Objectifs** : *Garder le poste* (`!flag('dechu') && stats.saisons >= 1`) · *Sans papier* (`flag('derogation') && stats.saisons >= 2`) · *L'adjoint fidèle* (`relation.vukic >= 2 && stats.saisons >= 2`).

**Budget P1** : script 9 (14 avec variantes) + 9 intrigues propres (47) + "2+" 4 + réactions 9 + alarme 1 + Unes 10 ≈ **75 cartes nouvelles**.

### 4.3 P2 — « La pépite du club-usine » (joueur, D2, 19 ans, tribunes 80)

**Question** : « Tout le monde veut te vendre. Toi, tu veux jouer. » Fil rouge : `prix` / `terrain` / `maison`. **Situation** : Étoile Bretagne (l'entité `club` est tirée ; le texte dit « l'usine »), club-usine de D2 qui vend un jeune par an. Patron narratif : Fardelli (`president: fardelli`, existant). Le postulat pose enfin `flags: [pepite]`. **Cast** : fardelli (vendeur 2,5), aulard (le prix 2), brehaut (capitaine qui te teste 2), mbako (le prodige d'après 1,5), vecchio (le vieux 1), lea (presse 1,5), gege (tifo 1,5), sabatier (corps 1), camille (0,5), vukic (l'adjoint qui te met sur le banc 1), meneche (0,5), nassir (0,5), mere_mbako (0,5). Le rôle joueur a **0 arc** aujourd'hui : dossier `content/arcs/joueur/` à créer ; ses 8 alarmes existent.

**Script** `jp.pepite.club_usine` : S0 = P1 *La valeur* (slot 1, Fardelli : « Tu vaux trois millions ce matin, {prenom}. Quatre ce soir si tu marques. Mon ami, on parle d'argent ou d'amitié ? » — pose `agent_fardelli` ou `sans_agent`) · P2 *Le mercato d'hiver* (10-11 : l'offre de janvier ; variantes `fil_rouge`, `international`, `enfant_du_pays`) · P3 *La vente* (17 : Aulard : « L'usine a besoin d'une vente par an. Cette année, c'est toi. Où ? » — sorties : le grand club (`club: {change: true, division: 1}` à la reprise, `vendu_d1`), rester (`fidele`, si `enfant_du_pays && tribunes >= 70`), l'exil (si `vars.nassir_palier >= 1`)) · dernier virage (17 partagé : P3 remplace le virage). S1 = *Le premier jour* (1-2 ; variantes `vendu_d1` (remplaçant, Josiane d'un autre club), `fidele` (le patron), `exil_dore`) · twist *Le retour à l'usine* (10-11 : jouer contre ton ancien club ; variante `tifo_adieu`) · veille. S2+ : rentrée (Fardelli : la valeur) / veille.

**Réservoir (14)** : 1 **jp.tifo · Le tifo à ton nom** (`signature`) — Gégé ; Léa ; tribune ; "0". *La tribune Nord a peint {NOM} sur vingt mètres. Elle veut une promesse : rester.* Issues `promis | rien | honnete` → `enfant_du_pays` (P3), `honnete_tribune`. Cartes 5 · 2 **jp.brassard_test · Le test du capitaine** — Bréhaut ; Vecchio ; vestiaire ; "0". *Les bouteilles d'eau, puis le penalty à sa place. Il teste.* Issues `accepte | mouton | capitaine` → `groupe_accepte`, `mouton_noir` (alarme vestiaire basse variante « plus de passe »), `capitaine` (∃). Cartes 5 · 3 **co.mbako_rival · Le prodige d'après** — Mbako ; mère, Vukić ; vestiaire ; "0". *Lian Mbako a 16 ans, ton poste, et une mère qui dit qu'il n'a besoin de personne.* Issues `mentor | rival | demande_vente` → `mentor_mbako` (à +3 « il te demande de partir avec lui »), `rival_mbako`, `demande_vente`. Cartes 6 · 4 **co.pharmacie** (partagée, variante victime) · 5 **jp.contrat_image · Le contrat d'image** — Fardelli ; « ton cousin », Camille ; argent ; "0" ; `replay: {after: 2, max: 2}` ; `if: caisse >= 45`. *Une société aux îles pour ton image. Tu as 19 ans et une image.* Issues `signe | refuse | camille` → `offshore` (∃, fin `jp_panama`, étape S+1 « le fisc »). Cartes 5 · 6 **jp.selection · La sélection espoirs** — Legruet ; Léa, Aulard ; instances ; "0" ; `if: tribunes >= 55`. *Les Cobalts espoirs t'appellent. Le pays de ton père aussi.* Issues `cobalts | autre | refus` → `international` (∃), `binational`, `refus_selection`. Cartes 5 · 7 **jp.premiere_une · La première Une** — Léa ; Ménèche ; presse ; "0". Issues `modeste | special | critique` → `special` (∃, enfin lu : manchette, réaction de Bréhaut), `coach_critique`. Cartes 4 · 8 **jp.banc_hiver · Le banc** — Vukić ; Aulard, Fardelli ; direction ; "0" ; `replay: {after: 2, max: 2}` ; `if: world.serie_defaites >= 1 || direction < 40`. Issues `bosse | boude | partir` → `banc_bosse` (*Le coach qui te veut*), `banc_boude`. Cartes 5 · 9 **jp.genou_20 · Le genou à vingt ans** — Sabatier ; Camille ; corps ; "1" ; absorbe `jp.corps.premiere_gene / infiltration / rechute` (∃, 3 cartes recyclées). Issues `ecoute | joue | cache` → `genou_ecoute`, `infiltre` (∃ → `genou` à 50 %), `genou_cache` (P3 : visite médicale du club acheteur). Cartes 6 (3 ∃) · 10 **co.derby** (partagée) · 11 **jp.camille_bac · Le bac de Camille** — Camille ; Josiane ; famille ; "0". *Camille passe le bac en juin. Toi, tu passes peut-être en D1 à quatre cents kilomètres.* Issues `aide | apres | voiture` → `camille_bac_aidee`, `voiture_camille`. Cartes 4 · 12 **jp.conseils_gigi · Les trois conseils de Gigi** — Vecchio ; formation ; "0" ; `replay: ritual` (3 saisons). *Le tutoriel déguisé du joueur* : « une tribune pleine tue autant qu'une tribune vide », « l'agent est ton employé, pas ton père », « le genou a toujours raison ». Issues → `vars.gigi_conseils`. Cartes 3 + 2 · 13 **jp.clause · La clause** — Fardelli ; Aulard, Gégé ; mercato ; "1" ; absorbe `jp.mercato.clause` (∃). Issues `part | refuse | double` → `club: change`, `fidele`, `mercenaire`. Cartes 4 · 14 **jp.exil_dore · L'exil doré** — Nassir ; Fardelli, Camille ; argent ; "1" ; absorbe `jp.mercato.exil_dore` (∃). Issues `part | reste | cousin` → `exil_dore` (fin `jp_exil` au Carrefour suivant si `caisse >= 80`). Cartes 4.

**"2+"** : **jp.coach_qui_te_veut · Le coach qui te veut** (Vukić devenu coach ailleurs ; `requires: [banc_bosse]` ; issue « Le fils spirituel » = `jp_fils` dorée douce) · **jp.retour_usine · Le retour à l'usine** (`replay`, `requires: [vendu_d1]`) · **jp.brassard_20 · Le brassard** (`if: relation.brehaut >= 2 || flag('capitaine')`) · **jp.pari · Le pari** (partagé P3, recyclage de 4 des 14 cartes `jp_scandale` : pisteur → pari → La Plume → déballage TV).

**Réactions (9)** : Aulard après P1 (« Quatre millions. J'ai pas le temps, j'ai une usine. Tu marques dimanche ? ») · Léa après « je promets » (« Vous confirmez ? Vous venez de promettre de rester à vingt mètres de bâche. ») · mère de Mbako après Vukić (« Mon fils n'a besoin de personne. Surtout pas d'un aîné. Vous avez dix-neuf ans, vous aussi vous étiez le prochain. ») · Camille après « je signe » (« Ton cousin a acheté une montre. Avec quoi ? ») · Vecchio après « je refuse les bouteilles » (« Ceux qui refusaient les bouteilles finissaient par les vendre. ») · Bréhaut après « le meilleur » (« Le groupe a découpé l'article. Il est dans ton casier. ») · Fardelli après le banc (« Trois recruteurs en tribune et toi sur le banc. J'ai dit que tu étais blessé. Tu confirmes ? ») · Sabatier après la piqûre (« Tu ne sens plus rien. C'est bien ça, le problème. ») · Léa après toute manchette (« Vous confirmez la Une ? »).

**Manchettes (10)** : **{NOM}, {PRIX} MILLIONS ET UN ALLER SIMPLE** (`vendu_d1` ; `{PRIX}` = `vars.prix` posé par P3) · **L'ENFANT DU PAYS RESTE AU PAYS** (`fidele && enfant_du_pays`) · **{NOM} EN BLEU COBALT** (`international && !binational`) · **IL A CHOISI L'AUTRE MAILLOT** (`binational`) · **« LE MEILLEUR » : C'EST LUI QUI LE DIT** (`special`) · **LA PÉPITE BOUDE SUR LE BANC** (`banc_boude`) · **LE GENOU DE {NOM} A PARLÉ** (`genou`) · **PARTI POUR L'OR** (`exil_dore`) · **PLUS PERSONNE NE LUI FAIT LA PASSE** (`mouton_noir`) · **DEUX PÉPITES, UN VESTIAIRE** (`mentor_mbako`).

**Objectifs** : *Choisir sa destination* (`flag('vendu_d1') && flag('sans_agent')`) · *L'enfant du club* (`flag('enfant_du_pays') && flag('fidele') && stats.saisons >= 3`) · *Le brassard avant 22 ans* (`flag('capitaine') && age <= 22`).

**Budget P2** : script 11 (16) + 11 intrigues propres (51, dont 8 ∃ recyclées) + "2+" 12 + réactions 9 + Unes 10 + événements joueur 6 (« Le fax du dernier jour », « La morsure », « Le faux cousin » (1996+), « La blessure des vacances », « La liste des 26 », « Le contrôleur ») ≈ **80 cartes nouvelles**.

### 4.4 P3 — « Fin de contrat à 31 ans » (joueur, D1, 1990, `genou`, caisse 60)

**Question** : « Ton genou a un avis, ton agent en a un autre. » Fil rouge : `genou` / `agent` / `vestiaire`. **Situation** : dernière année de contrat ; personne ne prolonge un genou ; ce postulat est le **sas vers le banc** (transition `roles.yaml`, `age >= 32 || genou`). **Cast** : fardelli (2,5), sabatier (le genou 2), brehaut (même bateau 1,5), mbako (ton poste 1), vecchio (la preuve qu'on peut durer 1,5), vukic/clow (le diplôme 1), nassir (0,5), gege (jubilé 1), lea (mémoires 1), meneche (télé 1), legruet (0,5), camille (1), aulard (0,5).

**Script** `jp.fin.dernier_contrat` : S0 = F1 *La dernière année* (slot 1, Fardelli : « Personne ne prolonge un genou, {prenom}. Moi si, pour dix pour cent. » — variantes `fil_rouge`) · F2 *L'offre d'hiver* (10-11 : variantes par traces : `exil_propose` (Nassir), `maison_pays` (le club de D2 de ta ville natale), sinon prolonger au rabais (Aulard)) · F3 *Juin* (17 : prolongé (`prolonge`) / parti (`club: change`) / sans club (`sans_club`, alarme caisse) / le banc (set-piece Carrefour lit `diplome`)). S1 = *Le premier jour* (destination) · twist *Les jambes* (Sabatier : −3 de force ; variante `gigi_conseils`) · veille. S2+ = *Une saison de plus* (Vecchio) / veille.

**Réservoir (14)** : 1 **jp.genou_parle · Le genou qui parle** (`signature`) — Sabatier ; Camille, Fardelli ; corps ; "0" ; absorbe `jp.corps.verdict_genou / infiltration / rechute` (∃). *Radio en main, Sabatier : fêlé. Tu finis la saison, ou tu la finis vraiment.* Issues `bistouri | piqure | silence` → `genou_opere`, `infiltre` (∃ ; 50 % `genou_grave`), lu par F2/F3, la manchette, le Carrefour. Cartes 6 (3 ∃) · 2 **jp.brassard_33 · Deux capitaines de 33 ans** — Bréhaut ; Vecchio, Mbako ; vestiaire ; "0" ; absorbe `jp.vestiaire.brassard` (∃). Issues `prend | gigi | refuse` → `capitaine`, `brassard_refuse`. Cartes 4 · 3 **co.mbako_rival** (partagée, variante « papy ») · 4 **jp.diplome_joueur · Le diplôme** — Vukić ; Clow, Aulard ; formation ; "0" ; `excludes: [diplome]`. *« Tes jambes parlent. La réserve n'a pas d'entraîneur. Tu passes ton diplôme cet été ? »* (la transition devient une intrigue en trois temps). Issues `diplome | pas_encore | brehaut` → `diplome` (Carrefour set-piece « Tu as le papier »), `brehaut_diplome` (il sera ton adjoint ou ton rival). Cartes 5 · 5 **jp.exil_dore** (partagée) · 6 **jp.contrat_image** (partagée, variante « à 31 ans on prépare l'après ») · 7 **jp.jubile · Le jubilé** — Gégé ; Léa, Aulard ; tribune ; "1" ; `if: tribunes >= 60`. *Un jubilé, c'est une fin. Tu n'as pas fini.* Issues `accepte | reporte | charite` → `jubile_fait` (fin `jubile` immédiate au Carrefour si tu raccroches), `jubile_reporte`, `jubile_charite`. Cartes 5 · 8 **jp.maison_pays · La maison du pays** — Camille ; Fardelli ; famille ; "0" ; absorbe `maison_pays` (∃, enfin lu). Issues `rentre | reste | achete` → `maison_pays` (F2, `club: {change: true, division: 2}`), `promis_camille`. Cartes 5 · 9 **jp.memoires · Les mémoires** — Léa ; Ménèche, Bréhaut ; presse ; "0". *Léa te propose d'écrire tes mémoires. Ménèche te propose de les raconter à la radio d'abord.* Issues `verite | lisse | renonce` → `memoires_verite` (Bréhaut : « Le groupe a lu le chapitre trois. »), `memoires_lisses`. Cartes 4 · 10 **jp.consultant · Le consultant du dimanche** — Ménèche ; Aulard, Vukić ; presse ; "1". Issues `accepte | refuse | cache` → `consultant` (fin `jp_consultant` au Carrefour si `age >= 33`), `consultant_cache`. Cartes 4 · 11 **co.pharmacie** (partagée, variante « un coup de pouce pour finir ») · 12 **jp.pari · Le pari** — un inconnu (sans portrait, `speaker: null`), Fardelli ; instances ; "1" ; `if: caisse < 45` ; recyclage `jp_scandale` (∃ 4). Issues `refuse | parie | double` → `pari_refuse`, `pari` (∃ ; S+1 « La Plume a un enregistrement » → parole −5 ou fin « La place 14B »). Cartes 5 · 13 **jp.derniere_selection · Une dernière fois en bleu cobalt** — Legruet ; Léa, Sabatier ; instances ; "0" ; `if: flag('international') || tribunes >= 65`. Issues `y_va | refuse | ne_joue_pas` → `adieu_cobalt` (30 % rechute). Cartes 4 · 14 **jp.vestiaire_porte · Le vestiaire te porte** — Bréhaut ; Vecchio, Aulard ; vestiaire ; "0" ; `if: vestiaire >= 65`. *Le vestiaire a signé une pétition pour ta prolongation. Le président l'a reçue par fax. Il « n'a pas le temps ».* Issues `porte | retire | presse` → `petition_portee` (F3 variante « prolongé par le vestiaire »), `petition_presse`. Cartes 4. Plus **jp.conseils_gigi** (partagée ; à 31 ans le premier conseil est « le genou a toujours raison »).

**"2+"** : **jp.adieu · L'adieu** (`if: age >= 34` ; issues raccrocher (fin `jubile` ou transition) / une de plus) · **jp.vecchio_exemple · Vecchio, l'exemple** (Gigi te raconte ses cinq retraites, rituel) · **jp.pari** (partagé).

**Réactions (9)** : Camille après F1 (« Ton agent a appelé à la maison. Il a demandé si on avait “un projet”. ») · Sabatier après « je finis la saison » (« Ça reste entre la table et moi. Et entre la table et ton agent, qui a demandé la radio. » → `radio_cachee`) · Vecchio après Mbako (« À trente et un ans, j'étais papy aussi. J'ai encore dix ans. ») · Aulard après la pétition (« Une pétition, ça se lit en deux minutes. J'ai pas deux minutes. ») · Léa après le jubilé (« Un jubilé en mars, et vous jouez en avril ? ») · Fardelli après le pari (« Là, on ne parle plus. ») · Bréhaut après les mémoires (« Le groupe a lu le chapitre trois. Le groupe ne te fait plus la passe. ») · Clow après le diplôme (« Je ne dirais pas que j'étais le meilleur formateur, mais j'étais dans le top un. Lundi, huit heures. ») · Vecchio après toute manchette (« J'en ai vu d'autres, des Unes. Celle-là, je la garde. »).

**Manchettes (10)** : **UN AN DE PLUS POUR {NOM}** (`prolonge`) · **PROLONGÉ PAR LE VESTIAIRE** (`petition_portee && prolonge`) · **{NOM}, 32 ANS, SANS CLUB** (`sans_club`) · **L'ENFANT PRODIGUE REVIENT EN D2** (`maison_pays`) · **STADE PLEIN POUR LE JUBILÉ DE {NOM}** (`jubile_fait`) · **{NOM} PASSE SUR LE BANC** (générique, priorité 4) · **IL JOUE LE SAMEDI, IL JUGE LE DIMANCHE** (`consultant`) · **LE CHAPITRE 3 QUE LE VESTIAIRE N'A PAS AIMÉ** (`memoires_verite`) · **UN ENREGISTREMENT, UN BAR D'HÔTEL** (`pari`) · **LE GENOU A EU LE DERNIER MOT** (`genou_grave`).

**Objectifs** : *Rejouer une saison entière* (`stats.saisons >= 2 && !flag('genou_grave')`) · *Le passeur* (`role_was('joueur') && relation.vukic >= 1`) · *Debout* (`flag('jubile_fait') && flag('prolonge')`).

**Budget P3** : script 11 (16) + 9 intrigues propres (41, dont 7 ∃) + "2+" 8 + réactions 9 + Unes 10 + événements joueur partagés ≈ **65 cartes nouvelles**.

### 4.5 Transversal

- **Nouvelles datées 1990-2000 (22)**, `year:`, un bouton, chacune arme quelque chose : 1990 *les droits télé* (Josiane, caisse +) · 1990 *la Coupe d'été des Cobalts perdue aux tirs au but* (Ménèche, tribunes +, `monde_cobalts_1990`) · 1991 *le club de la capitale racheté par une chaîne de télé* (direction −) · 1991 *premier contrôle inopiné du championnat* (Sabatier ; *La pharmacie* : `poids ×2` via `if`) · **1992 *la buvette de Portclair a brûlé la veille d'une demi-finale*** (Aubert, sobre : « Personne dedans. Deux cents merguez. Le stade, c'est de l'argent public. » ; `vars.tribune_alerte = 3` → `en.evt.tribune` ×2) · 1992 *un club de D2 dépose le bilan* (Josiane, caisse −) · **1993 *Montbéliac gagne la Coupe Continentale avec un budget de D2*** (Gégé : « La fête dure trois jours. L'audit, trois ans. » ; tribunes +) · **1993 *un club de D2 a payé son gardien en bons d'essence*** (Ménèche : « La Fédération “examine”. » ; *L'enveloppe* `poids ×2`) · 1994 *pas de Mondial pour les Cobalts* (direction −) · 1994 *le match du dimanche soir* (Aulard, tribunes −) · 1995 *l'arrêt Bosquet* (Fardelli ; `monde_bosquet` lu par *La clause*, F2) · 1995 *les quotas tombent* (Vukić, force +1) · 1996 *vingt clubs, puis dix-huit* (Legruet, absurde) · 1996 *le faux cousin* (Fardelli ; arme l'événement joueur) · 1997 *les droits doublent* (Josiane, caisse +) · 1997 *le Grand Stade de la capitale* (Aubert ; *La tribune vétuste*) · 1998 *les Cobalts champions à la maison* (Gégé, tribunes ++, `monde_1998` : manchette « L'ANNÉE OÙ TOUT LE MONDE AIMAIT LE FOOT ») · 1998 *premier joueur parti libre* (Fardelli) · 1999 *un fonds lointain rachète un club de D1* (Nassir ; `when` de Nassir assoupli) · 1999 *le but en or* (Vecchio) · 2000 *le fax imprime « 1900 »* (Josiane, absurde) · 2000 *les contrats en euros dans deux ans* (Aulard ; `{monnaie}`). Remplacements : `droits_tele`, `arret_contrats`, `fonds_voisins` ; `arbitrage_video` → 2016.
- **Réactions communes (6)** : `co.re.josiane_a_lu`, `co.re.lea_confirme`, `co.re.vecchio_garde`, `co.re.camille_journal` (« Tu rentres à quelle heure ? J'ai lu le journal. »), `co.re.meneche_no_comment` (après le 3e « je ne commente pas »), `co.re.nassir_reviendrai`.
- **Paliers `on_relation` ±3** pour 8 personnages de plus (16 cartes : Fardelli, Aulard, Vukić, Sabatier, Josiane, Bréhaut, Léa, Nassir) ; **retrouvailles** (12) ; **`adresse`** des 17 ; **`age`/`statut`** de 8 (Vecchio 41, Mbako 16, Bréhaut 33, Gégé 47, Aulard 58, Clow 61, Josiane 52, Fardelli 44).
- **Set-pieces** : ≈ 60 lignes par rôle (§2.7). **`journal.yaml`** : 11 gabarits. **`epitaph_plus`** : 30 lignes. **4 fins** nouvelles.

### 4.6 Le sac du rôle joueur (conversion des routines existantes)

Le joueur a 99 routines propres + 30 communes, qui ne lisent ni trace ni relation. Avant d'écrire de nouvelles routines, **40 cartes existantes** sont converties (par lots de 10, une relecture humaine par lot) : (a) 15 cartes `jp_vestiaire`/`jp_presse` reçoivent un `when` sur une trace (`special`, `mouton_noir`, `capitaine`, `international`, `banc_boude`) ou une relation (`relation.brehaut`, `relation.lea`) ; (b) 15 cartes `jp_mercato`/`jp_famille` reçoivent `{toi}`/`{prenom}` et un `when` sur `agent_fardelli`/`sans_agent`/`offshore`/`camille_*` ; (c) 10 cartes `jp_corps` (le pool `genou`) sont absorbées par *Le genou qui parle* / *Le genou à vingt ans* (étapes) ou reçoivent `when: flag('genou') && plays('jp.genou_parle') >= 1`. Mesure : isolement S0 par postulat joueur < 35 % après l'étape 5, exposition à 10 carrières ≥ 70 %. Les 14 cartes `jp_scandale` : 8 recyclées en étapes (*Le pari*), 6 restent en routine conditionnée (`when: flag('pari') || flag('offshore')`).

### 4.7 Budget total

| | P0 | P1 | P2 | P3 | Transversal | Total |
|---|---|---|---|---|---|---|
| cartes nouvelles | 75 | 75 | 80 | 65 | 22 Nouvelles + 6 réactions + 16 paliers + 12 retrouvailles = 56 | **≈ 350** (336 → ≈ 690) |
| dont réactions | 10 | 9 | 9 | 9 | 6 | 43 |
| manchettes (lignes) | 12 | 10 | 10 | 10 | 8 génériques | 50 |
| intrigues au réservoir | 14 + 5 | 14 + 3 | 14 + 4 | 14 + 3 | — | 57 distinctes dont 9 partagées |
| set-pieces / journal / épitaphes (lignes) | — | — | — | — | 120 + 11 + 30 | 161 |
| cartes existantes retouchées (`{toi}`, `journal:`, `when`, `traces`) | 70 | 10 | 40 | 30 | 20 | 170 |

À 12-15 cartes rédigées par jour (brainstorm 10 §10.3), ≈ **26 jours d'écriture**, dont 6 pour le promu (jouable seul après l'étape 3 du §6).

---
## 5. Métriques et budgets de diversité

Tout se mesure dans `simulate --narrative --postulat p --runs 500` (politique `human_like`, 3 saisons pour les métriques S0/S1, `--seasons 8` pour S5+) ; unité = **carte d'histoire** (kinds `script/etape/evenement/palier/chaine/reaction`) et **intrigue** (arc `serie` ouvert). Les chiffres « aujourd'hui » sont ceux du promu à HEAD ; ils sont figés dans `docs/balance/step4_baseline.md` à l'étape 0 pour les 4 postulats.

### 5.1 Variété perçue

| Métrique | Définition | Aujourd'hui (P0) | Budget (`--assert`) |
|---|---|---|---|
| **Ensembles S0 distincts** | ensembles triés d'intrigues ouvertes en S0, sur 100 graines | 2 | ≥ 25 |
| **Programmes S0 distincts** | idem, ordonnés par slot d'ouverture | 2 | ≥ 60 |
| **Jaccard S0** | moyenne sur 500 paires de \|A∩B\|/\|A∪B\| des cartes d'histoire de S0 | 0,73 | **≤ 0,35** (« deux carrières d'un même postulat partagent < 40 % de leurs temps d'histoire ») |
| **Jaccard carrière** | idem sur la carrière entière | 0,49 | ≤ 0,30 |
| **Noyau fixe** | cartes d'histoire présentes dans ≥ 90 % des S0 | 10 | ≤ 4 (les ancres) |
| **Ouverture** | part des runs dont les 5 premiers temps d'histoire sont la séquence la plus fréquente | 60 % | ≤ 10 % |
| **Entropie d'histoire** | séquences distinctes de `(arc, step)` de S0 / runs (remplace l'entropie actuelle, aveugle) | non mesurée | ≥ 0,9 |
| **Rythme** | distribution du slot de première ouverture d'intrigue ; écart-type | 0 | ≥ 1,8 slot ; aucune paire d'ouvertures à < 3 slots |
| **Couverture du réservoir** | par intrigue, part des carrières de 3 saisons où elle s'ouvre | kop/prodige/gardien 100 %, nassir 60 % | chaque ∈ [10 %, 65 %] ; signature ∈ [50 %, 65 %] ; aucune à 0 ; **≥ 70 % des intrigues du réservoir vues sur 20 carrières** |
| **Fil rouge** | distribution des questions | — | aucune < 25 % |
| **Issues** | distribution des `outcome` par intrigue | — | aucune issue sans condition d'état rare < 10 % |
| **Distance de carrière D** | `D = 0,5·(1−J(intrigues)) + 0,3·(1−J(Unes)) + 0,2·(1−J(traces))` sur paires de même postulat | ≈ 0,2 | médiane ≥ 0,6 ; P10 ≥ 0,35 |
| **Exposition à 10 carrières** | cartes distinctes vues en 10 carrières / cartes du rôle | ≈ 55 % | ≥ 70 % |

### 5.2 Sentiment d'histoire

| Métrique | Définition | Aujourd'hui | Budget |
|---|---|---|---|
| Temps d'histoire par saison (médiane) | S0 / S1 / S2-S4 / S5-S8 | 14 / 12 / 4 / — | ≥ 12 / ≥ 10 / **≥ 8** / ≥ 6 |
| Isolement | routines sans lien / cartes | 0 % / 3 % / 50 % | < 10 % / < 20 % / < 30 % (S2+) / < 40 % (S5+) |
| Écart max entre temps d'histoire | par saison | 3 / 7 / 14 | ≤ 3 (S0-S1), ≤ 4 (S2+) |
| **Coutures** | part des saisons S1+ où ≥ 1 variante/manchette/réaction/set-piece a lu une trace posée dans une saison antérieure | — | ≥ 70 % |
| **Réactions** | par saison : moyenne · max · consécutives · latence 1 carte | 0 | 1,5-3 · ≤ 4 · 0 · 100 % |
| Casting | visages du cast porteurs d'≥ 1 intrigue sur 3 saisons | — | ≥ 80 % ; Vecchio ≥ 2 dans ≥ 60 % des S1 |
| Échéances | étapes servies en bande 6 ; backlog max | S0 ≤ 60 % / S1 41 % ; 3 | S0 ≤ 50 %, S1+ ≤ 40 % ; backlog ≤ 2 ; `scheduled.length ≤ 12` |
| Budgets spec v1 §5.2 | cadence, voix, tons, Nouvelles, alarmes, famine | P0 ✔, P1-P3 ✗ | ✔ pour les 4 postulats |

### 5.3 Journal, Une, nom, époque

| Métrique | Définition | Aujourd'hui | Budget |
|---|---|---|---|
| **Unes distinctes** | ids de manchettes servis / Bilans, par postulat sur 200 carrières | 1 | ≥ 12 ; aucune > 30 % ; génériques (priorité ≤ 1) < 25 % ; secours (0) < 10 % |
| **La Une ne ment pas** | `payload.tenu == verdict appliqué`, `payload.rang == rangFinal` | — | 100 % (`--une-check`) |
| Brèves | Bilans avec 3 brèves issues du journal | — | ≥ 90 % |
| Journal | entrées de poids ≥ 2 par saison | 0 | ≥ 3 ; ≤ 12 après compaction |
| **Nom** | saisons avec ≥ 2 cartes portant un placeholder de nom (`{prenom}`, `{nom}`, `{NOM}`, `{toi}` résolu en nom) | 0 % | ≥ 95 % ; jamais deux cartes de suite |
| Placeholders non résolus | `{…}` restant dans un texte servi (cartes, Unes, journal, épitaphes) | — | 0 (`--assert`) |
| Époque | Nouvelles datées servies dans leur fenêtre / éligibles | — | ≥ 80 % |
| Objectifs | carrières atteignant ≥ 1 objectif | — | 30-60 % ; chaque objectif ∈ [5 %, 60 %] |
| Fins | chaque fin atteinte ≥ 1 fois sur 5 000 ; aucune > 40 % ; `en_sms` ≤ 40 % sur P0 | en_sms 56 % | ✔ |

### 5.4 Budgets globaux et protocole de validation humaine

Budgets Monte-Carlo inchangés (`simulate --runs 5000 --assert`) : médiane `human_like` ∈ [60, 200] cartes narratives, P95 < 500, aucun run > 1 200 ; les réactions rallongent une saison de 2-4 cartes à petits effets ; si la médiane dérive de plus de 15 %, on baisse `reactions_max` avant de toucher aux magnitudes.

**Playtest humain** (obligatoire avant de clore chaque lot de contenu, parce que le retour vient d'un joueur, pas de `simulate`) : 3 testeurs × 3 carrières du même postulat (l'aperçu web ou l'app), 20-30 minutes chacune, puis un questionnaire de 8 questions : (1) Raconte ta deuxième carrière en trois phrases. (2) Est-ce qu'elle ressemblait à la première ? (0-4) (3) Cite une histoire que tu as vécue et son issue. (4) Un choix a-t-il eu une réponse immédiate ? Laquelle ? (5) Ton nom est-il apparu ? Où ? (6) Qu'est-ce que la Une racontait ? Était-ce vrai ? (7) Que voudrais-tu aller voir en relançant ? (8) Une carte t'a-t-elle semblé fausse (mauvais personnage, mauvais moment) ? Critères de sortie : moyenne (2) ≤ 1,5 ; 9/9 réponses correctes à (3) ; ≥ 6/9 à (4) et (5) ; (6) jamais « faux » ; ≥ 5/9 citent un indice d'objectif ou une histoire débloquée à (7). Les réponses (8) deviennent des tickets de contenu. Le rapport est commité dans `docs/balance/step4_playtest_<postulat>.md`.

**Outils** : `simulate --diff <seedA> <seedB> --postulat p` (deux carrières côte à côte : programme par saison, Unes, traces, fin, `D`) ; `simulate --reservoir --postulat p` (matrice intrigue × saison : taux d'ouverture, ouvertures forcées, issues ; matrice porteur × saison) ; `simulate --une-check` ; `simulate --goldens` ; `simulate --arc <id>` (toutes les branches d'une intrigue : chaque issue atteinte ? chaque variante servie ? traces lues ?) ; `--assert` par postulat en CI.

---

## 6. Ordre de mise en œuvre (étapes vérifiables)

| Étape | Moteur / outils | Contenu | Critère de sortie |
|---|---|---|---|
| **0. Baseline** (½ j) | métriques §5 dans `simulate` (sans `--assert`), `--diff`, `--reservoir` ; entropie d'histoire | — | `docs/balance/step4_baseline.md` : chiffres « avant » des 4 postulats ; les 22 tests passent |
| **1. Le tirage** (2 j) | `programme`/`questions`/`objectifs` (content, build), `openSeason(s, rng)` : `_drawProgramme`, fenêtre tirée, `_freeSlot`, réserve, fil rouge ; `eligibleArcs` restreint ; `replay/plays/outcome/issues/traces/theme/carrier`, `at_season` ; `when` : `plays`, `arc_outcome`, `theme_played`, `fil_rouge` ; fingerprint étendu ; tests P1-P5, R1-R3 ; `meta.version 2` | P0 : `programme` avec les 6 arcs ∃ + *La cote du promu* (A2/A3 déplacés) + `theme/carrier/issues/traces` sur les 6 ; `replay` gardien/kop/nassir, 3 variantes « encore » ; 3 objectifs | ensembles S0 distincts ≥ 12 avec 7 arcs ; noyau fixe ≤ 6 ; cadence S0 ≤ 3 conservée ; déterminisme 25 × 4 ✔ ; lint 0 erreur (`chantier: true` sur P1-P3) |
| **2. Réactions, nom, journal, Une** (3 j) | `react` (effects, `_draw`, `_advance`, `serveReaction`, état), `journal` + `addJournal` + compaction, `traces` écrites, `unes.yaml` + `_bilanUne(rng)` + `bilan.tenu/rang`, `journal.yaml`, `text.dart` (`{toi}`, placeholders), `naming.dart`, `start(prenom, nom, genre)`, `adresse`, `epitaph_plus`, « Ce qui s'est passé » ; tests X1-X6, U1-U3, N1-N5, J1-J3 ; aperçu web : saisie du nom, page Une, écran de fin | P0 : 10 réactions, 12 Unes + 8 génériques, `journal:` sur 30 cartes, `{toi}` sur 40 cartes, `adresse` des 17, `epitaph_plus` des 21 fins, 4 fins nouvelles | réactions 1,5-3/saison, latence 1, jamais deux d'affilée ; Unes distinctes ≥ 10 ; `--une-check` 100 % ; nom ≥ 95 % ; placeholders non résolus 0 ; JSON round-trip ✔ |
| **3. Le réservoir du promu** (6 j d'écriture + 1 j outil) | `pickNouvelle` datée ; `chars` (âge/statut, `statut_ok`, `char:`) ; `--arc` ; tests C1 | P0 : 6 intrigues S0/S1 + 5 "2+" (dont *Le dossier Ménèche*), 22 Nouvelles datées, paliers ±3 (16), retrouvailles (12), réactions communes (6) ; `chantier: false` sur P0 | P0 : tous les budgets §5.1-5.3 ; S2-S4 ≥ 8 ; `D` médiane ≥ 0,6 ; couverture ≥ 70 % sur 20 carrières ; **playtest P0 validé** |
| **4. L'intérimaire** (4 j) | — | P1 complet (§4.2), `alarm_overrides`, cast ; `chantier: false` | budgets §5 sur P1 ; playtest P1 |
| **5. La pépite** (6 j + 1 j outil) | `club: change` (`_changeClub`, retrouvailles), événements joueur, `arcs/joueur/`, conversion du sac joueur (§4.6, 40 cartes) ; tests C2 ; `packages/preview/` versé au dépôt | P2 complet (§4.3) ; scandale recyclé ; `chantier: false` | budgets §5 sur P2 ; isolement S0 joueur < 35 % ; transition joueur→entraîneur avec traces ; playtest P2 |
| **6. Fin de contrat + set-pieces** (4 j + 1 j outil) | `setpieces.yaml` + `_setpieceText` (7 beats) ; test S1 | P3 complet (§4.4) ; 60 lignes de set-pieces par rôle ; `chantier: false` | budgets §5 sur P3 ; chaque fin joueur atteinte ; « moitié des écrans identiques en S2+ » : part des set-pieces servis en variante non-secours ≥ 50 % ; playtest P3 |
| **7. App Flutter** (4 j) | `title_screen` (nom, pitch, compteurs, 4 pochettes), `game_screen` (page Une, bandeau, vignette réplique), `ending_screen` (Ce qui s'est passé, Almanach, partage avec « masquer le nom »), `game_controller` (profil, import de code) | — | captures headless des 3 écrans en clair et sombre ; nom de 16 lettres et ville de 12 sans débordement ; test widget de `UnePage` |
| **8. Retune et mesure** (2 j) | `force`, `balance.yaml`, `reactions_max`, `soft_steps_max` ; goldens (G1) ; CI `--assert` × 4 postulats | routine conditionnelle +40 si isolement > 30 % ; Nouvelles 2001-2010 (8) si le temps le permet | budgets globaux ✔ ; `docs/balance/step4_variete.md` (avant/après, protocole de step3) ; les 22 + ≈ 30 tests passent ; goldens figés |

Total ≈ **14 jours moteur/outils/app + 26 jours d'écriture**. Les étapes 0-3 (≈ 13 jours) répondent seules au retour du client sur le postulat joué (relance différente, nom, réactions, Une, journal) ; 4-6 couvrent « aucun thème n'a de scénario » ; 7 est ce que le client voit en premier et se fait dès que l'étape 2 est stable (en parallèle de 3-6 si deux personnes).

---

## 7. Risques et parades

1. **Le tirage casse la cadence exemplaire de S0** (écart max 3). Parade : 4 ancres aux slots pivots (1, 10-11, 16, 17), écart ≥ 3 entre ouvertures, réserve + `min_active`, `--assert` conservé à chaque étape.
2. **Trois intrigues qui se marchent dessus** (mêmes visages, deux « premières scènes » d'affilée). Parade : porteur et thème distincts, fenêtres à ≥ 3 slots, `_continuity` existant (×0,5 même arc, ×0,3 même locuteur).
3. **Rejouer = répéter**. Parade : lint (variante `plays()` obligatoire), `after ≥ 1`, ×0,6 des reprises, tardives et seconde vague prioritaires en "2+".
4. **Les réactions deviennent du bruit**. Parade : plafond 4, jamais deux d'affilée, effets petits, réservées aux cartes de script/étape/palier/alarme/Une (lint : `react` refusé sur une routine), fréquence et latence mesurées.
5. **La Une ment**. Parade : `bilan.tenu`/`bilan.rang` calculés sans application, lint qui interdit `bilan_tenu`/`rang_final` dans une manchette, `--une-check`.
6. **Déterminisme**. Parade : inventaire §3.9, listes triées, `_freeSlot` sans Rng, `chance` conditionnel documenté, test 25 × 4 × 2 exécutions, goldens de 20 codes, aucune carte ne lit le nom ni le profil.
7. **Le nom dans les partages**. Parade : validation et liste noire locales, « masquer le nom » sur l'image, le nom jamais dans le Code, jamais dans une carte où un tiers parle **de** toi à la presse (les manchettes sont la seule exposition publique et le joueur les partage lui-même).
8. **Volume d'écriture** (≈ 350 cartes, 26 jours). Parade : P0 d'abord, 9 intrigues partagées, recyclage (`jp_scandale`, `jp_corps`, événements), `{toi}` par script puis relecture par lots de 30.
9. **Sensibilité** : aucune Nouvelle, aucune intrigue ne transpose un fait réel reconnaissable (les trois cas de showrunner sont réécrits §4.5) ; drame ≤ 1 par run, jamais en S0 ; *La pharmacie* et *L'enveloppe* restent sobres et désactivables en « mode confort ».
10. **`scheduled.length ≤ 12`** avec 4 ancres + 4 intrigues + fusées + alarme + palier. Parade : les fusées `at_season` sont dans la file (elles comptent) — mesure du backlog ; si le test casse, on passe le plafond à 14 **après** avoir vérifié que le backlog d'échus reste ≤ 2.
11. **Sauvegardes et codes anciens** : `fromJson` tolérant, partie en cours conservée, relecture des swipes refusée sur une autre version (§3.9).
12. **Le rôle joueur part de zéro** (0 arc, sac sans lecture). Parade : P2 avant P3, 5 intrigues `co.*`, conversion des 40 routines avant les nouvelles, isolement mesuré par postulat joueur.
13. **Coût de `GameState`** : compaction à 12 entrées par saison, `JournalEntry` immuable, test de performance à 360 entrées.
14. **Le client attend Reigns, pas un feuilleton** : trop de traces = une histoire qui se ferme. Parade : 3 intrigues par saison seulement, le sac et les alarmes gardent ≈ 2 créneaux, les réactions sont des répliques (une carte), jamais des sous-arcs ; les objectifs cachés et le bandeau « Nouvelle histoire » disent au joueur ce qu'il reste à voir.

**Hors périmètre, gardé pour un lot ultérieur** (après que les 4 postulats tiennent leurs budgets) : chapitre méta dans le codec, cartes-légendes et Colline, `on_season` scripté, mémoire des clubs et lignée dans le code, Fantôme et Nemesis, « viré puis rappelé » (§1.11, crochet `rebond` réservé), Nouvelles 2001-2050, mode « Vestiaire fermé », éditeur/graphe des arcs.

---

## Annexe A — Exemple déroulé : deux S0 du promu, même postulat, deux graines

**Graine 41** — fil rouge `tribune` ; tirage : *Le kop* (u = 3), *Les salaires en retard* (u = 6), *Le vieux gardien* (u = 9) ; réserve : *La cote du promu*.

```
slot 1  script   A1 L'inventaire (variante tribune : « Les maillots, Gégé les a déjà vus. »)
        réaction Josiane : « Le chauffage, j'en ai vu passer. Des maillots neufs, jamais. »   [bande 8]
slot 2  routine  Sabatier
slot 3  étape    kop.local — ← j'y vais
        réaction Camille : « Il est une heure. Tu sens la bière et la tribune. »
slot 4  routine  Vukić
slot 5  étape    salaires.fax
slot 6  étape    kop.onze — ← on signe
        réaction Bréhaut : « Le groupe a lu la compo dans le journal. Avant toi, coach. »
slot 7  nouvelle 1990 · la Coupe d'été des Cobalts
slot 8  étape    salaires.brehaut — → première nouvelle (salaires_retard)
slot 9  étape    vieux.retraite
slot 10 script   A4 La Commission (variante « et la banque, en plus ») — ← on vend
slot 11 étape    prodige.offre_express (saut d'arc)
slot 12 nouvelle 1990 · les droits télé
slot 13 alarme   vestiaire bas — Bréhaut, variante « la grève d'entraînement » (lit salaires_retard)
slot 14 étape    vieux.epaule
slot 15 étape    salaires.patience
slot 16 script   A5 Le dernier match (promis)
slot 17 script   A6 Le dernier virage
Bilan   Une      L'Écho de Bretagne — « PAYÉS EN RETARD, SAUVÉS À TEMPS » · brèves : la compo votée en tribune Nord ; Mbako vendu trente millions ; Gigi dans les cages pour le dernier match.
        réaction Josiane : « J'ai lu le journal. Je l'ai rangé sous les autres. »
```

**Graine 42** — fil rouge `argent` ; tirage : *La cote du promu* (u = 2), *L'espion dans la haie* (u = 7), *Nassir* (u = 11) ; réserve : *Le derby*.

```
slot 1  script   A1 L'inventaire (variante argent : « Le chauffage, c'est le sponsor qui le paie. S'il signe. »)
slot 2  étape    cote.empire — ← un budget
        réaction Josiane : « Il n'est pas daté. Je le date de quand ? »
slot 3  routine  Gégé
slot 4  routine  Fardelli
slot 5  étape    cote.cote — ← cent francs
slot 6  routine  Vecchio
slot 7  étape    espion.jumelles — ← le café
        réaction Gégé : « On a noté la plaque. La tribune n'oublie rien. »
slot 8  nouvelle 1990 · les droits télé
slot 9  étape    cote.encaissement (rang 12 : « Vous encaissez ? »)
slot 10 script   A4 La Commission — → un sponsor
slot 11 étape    nassir.maillot — → orange
        réaction la mère de Mbako : « Mon fils ne portera pas une boisson. »
slot 12 nouvelle 1990 · la Coupe d'été
slot 13 étape    espion.meneche (« la haie, c'est vous ? »)
slot 14 étape    nassir.naming_express
slot 15 routine  Aulard (fil rouge argent : set-piece Objectif avait dit « et un sponsor »)
slot 16 script   A5 Le dernier match
slot 17 script   A6 Le dernier virage
Bilan   Une      La Gazette Rose — « ARENA QATALYST » · brèves : il avait parié cent francs ; un café pour l'homme de la haie ; la Commission voulait un plan, le sponsor a payé.
```

Cartes d'histoire communes : A1, A4, A5, A6 (les ancres) sur 14-15 → Jaccard ≈ 0,17. Aucune ligne de journal commune. Deux Unes qui ne partagent pas un mot.

## Annexe B — Check-list de relecture d'une intrigue (avant `chantier: false`)

1. `theme`, `carrier` ∈ cast, `issues ≥ 2`, `traces` ≥ 1 et chacune lue (variante / manchette / réaction / alarme / set-piece / `if` de pool).
2. Étape 1 : variante « encore » si `replay` ; aucune carte `once`.
3. Une étape au moins glisse en saison suivante (`at_season` ou `in` max ≥ 15) — ou justification en commentaire.
4. Une variante lit une trace d'une **autre** intrigue.
5. Chaque `answer` est une conséquence, pas une explication ; deux phrases, un tic, le nom une fois au plus ; `{toi}` seulement si le locuteur a une `adresse`.
6. `simulate --arc <id>` : chaque issue atteinte, chaque variante servie, aucune étape périmée > 20 %.
7. Aucun nom réel, aucune ville réelle, aucun fait réel reconnaissable.
