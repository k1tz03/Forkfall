# FUSIBLE — Bible scénaristique

*Une carrière de football, de 1990 à 2050, dans un pays qui n'existe pas.*

Ce dossier est la **matière narrative** du jeu : le monde, le casting, les intrigues, les scènes
dialoguées, les journaux, les fins. Il se lit comme un document de série — loglines, synopsis,
fiches, séquenciers, scènes — et il s'importe comme une base de données : chaque scène porte son
id, ses deux choix, ses effets, ses traces.

Il ne contredit jamais `docs/brainstorm/` (la bible de conception) ni `docs/spec_variete_narrative.md`
(les mécanismes) : il les prolonge.

---

## 1. Sommaire

| # | Chapitre | Ce qu'on y trouve |
|---|---|---|
| 00 | [La charte du showrunner](00_charte.md) | Le monde (pays, monnaie, trente villes, compétitions, instances, journaux, glossaire), le casting complet, les huit rôles et les vingt et un postulats, le **graphe de transitions**, les **dix gabarits** (scène, fiche, intrigue, réaction, Une, Nouvelle, set-piece, fin, anecdote, ids), la notation des effets, les quarante traces transversales, les interdits. **À lire avant tout le reste.** |
| 01 | [Personnages — le terrain](01_personnages_terrain.md) | Dix-neuf fiches complètes (Gégé, Vukić, Bréhaut, Sabatier, Camille, Corven, Mbako, Vecchio, la mère de Mbako, Vaz, Vogler, Rouvier, Dembo, Fauvel, Brissac, Gérard, Dédé, Paulette, Sacha) : trajectoire 1990-2050, adresse dans les huit rôles, scènes de palier ±3, retrouvailles, cartes propres. |
| 02 | [Personnages — direction et instances](02_personnages_direction_instances.md) | Vingt-trois fiches (Fardelli, Massenet, Vaubourg, Josiane, Léa, Ilyas, Solvang, Vence, La Plume, Barbier, Malbec, Montoya, Dupuis, Aubert, Berthomier, Bambini, Dauzat, Vialat, Amsel, Colline, Pichon, Roux, Rossard), la table « qui préside quoi, quand », la **table des retournements** (ce que chacun devient quand tu changes de côté de la table) et leurs intrigues propres. |
| 10 | [Scénarios — le joueur](10_scenarios_joueur.md) | Le tutoriel de Trébignac, le joueur amateur, puis les postulats `pepite`, `fin_de_contrat`, `village_endette`, `lache_academie`, `retour_croises`, `binational`, `banc_dore`, `capitaine_dechu` : scripts d'ouverture, réservoirs, réactions, manchettes, objectifs. |
| 11 | [Scénarios — l'entraîneur](11_scenarios_entraineur.md) | `promu` (le réservoir complet) et `interimaire`, puis `bout_du_monde`, `six_mois`, `section_feminine`. Le kop, le prodige, l'enveloppe, la pharmacie, le dossier, la commission. |
| 12 | [Scénarios — le directeur sportif](12_scenarios_directeur_sportif.md) | `vendre_trente` et `coach_intouchable` : le mercato comme sous-paquet dense (vingt-quatre offres), les agents persistants, le fax de 23 h 58, l'algorithme contre l'œil. |
| 13 | [Scénarios — les présidents](13_scenarios_president.md) | Président amateur (`fusion_imposee`, `coupe_du_village`) et pro (`geant_dechu`, `rachete_fonds`) : la buvette, la mairie, les actionnaires, les écoutes, la valise, la chaîne « 60 heures » de la Ligue fermée. |
| 14 | [Scénarios — le sélectionneur](14_scenarios_selectionneur.md) | `pays_emergent` et `apres_fiasco` : les cartes Liste, la chaîne Tournoi sans respiration, le bus, l'avion des primes, l'hymne, le contrat de minuit. |
| 15 | [Scénarios — les instances](15_scenarios_instance.md) | `heritage_empoisonne`, `sous_tutelle`, `tournoi_desert`, `elu_surprise` : les Cartes Événement double face (les dossiers), le Congrès, la Campagne, les valises de l'hôtel du Lac. |
| 20 | [Les journaux](20_journaux.md) | La voix des quatre titres, les manchettes de Une, la **chronologie du monde 1990-2050** (les Nouvelles datées), l'Almanach de carrière, la Gazette Rose. |
| 30 | [Set-pieces, alarmes et fins](30_setpieces_alarmes_fins.md) | Les sept beats moteurs déclinés par rôle, les alarmes de jauge, les face-à-face de palier, les retrouvailles, **toutes les fins** et leurs épitaphes, les Cartes Destin de transition, le piège du centre. |
| 31 | [Anecdotes et Almanach](31_anecdotes_et_almanach.md) | Les quatorze lieux, cent anecdotes de décor, les running gags, les objets qui reviennent, les Nouvelles « à côté », les cartes-légendes, l'Almanach du Ballon, les quarante-deux enterrements. |
| 90 | [Interconnexions](90_interconnexions.md) | La matrice des traces (qui pose, qui lit), la carte des réactions, les personnages à statut, les intrigues miroir, les chaînes multi-rôles, la chronologie croisée, les **contradictions tranchées**, les trois carrières de référence rejouées scène par scène. |

**Version lisible en une page** (papier crème, navigation, index) : `bible.html`, produit par
`docs/bible/tools/build_html.js` — voir § 4.

---

## 2. Comment lire une scène

Le gabarit est fixé par la charte (§ 4.1) et il commence **toujours** par trois dièses. C'est ce que
lisent les outils d'extraction.

```
### SCÈNE en.kop.pacte  —  Le pacte de la craie
**Rôle** : entraineur · **Intrigue** : en.kop_qui_aime_trop · **Étape** : 3/6 · **Moment** : saison 1, créneaux 9-14 · **Lieu** : le local du virage · **Conditions** : relation.gege >= 1
**GÉGÉ** *(chef du virage — sourire — il pose une craie sur la table)*
« Le local, il prend l'eau depuis douze ans et personne n'a jamais signé. Tu signes, ou tu fais comme les autres ? »
← **Je signe le local** — effets : tribunes ++, caisse −, relation.gege +1, set: pacte_gege — *Il grave la date à la craie, au-dessus de la porte.*
→ **Pas de promesse en l'air** — effets : direction +, tribunes −− — *La craie reste sur la table. Personne ne la reprend.*
**Traces** : pacte_gege · **Réactions déclenchées** : en.re.josiane_chauffage · **Lu plus tard par** : ch. 13 (Gégé réclame le local au président), une.promu.local, en_otage
```

Trois choses ne sont **pas** dans le YAML et servent seulement à écrire juste : l'**expression**
(c'est la relation qui la choisit au rendu), la **didascalie**, et la ligne « Lu plus tard par »
(c'est un contrat de couture, tenu par le chapitre 90).

---

## 3. Mode d'emploi : remplir la base de données

Les auteurs n'écrivent pas dans `content/`. Ce paragraphe dit **où va quoi** quand on importe.
La commande de reprise des ids et des renommages est au § 5.3 de la charte.

### 3.1 Une scène → une carte de `content/cards/<rôle>/<arc>.yaml`

| Ligne du gabarit (§ 4.1) | Champ YAML | Règle d'import |
|---|---|---|
| `### SCÈNE <id> — <titre>` | `id:` | L'id tel quel, snake_case ASCII. Le titre ne s'importe pas : il sert au sommaire et aux ancres. |
| `**Rôle**` | `roles: [entraineur]` | Liste. `tous` → liste vide ou la liste explicite des rôles concernés. |
| `**Intrigue**` | `arc:` | Le **mot** de l'arc, pas l'id complet (`arc: kop` pour `en.kop_qui_aime_trop`), comme les cartes existantes. Une scène de décor prend `arc: routine` ou `arc: nouvelle`. |
| `**Étape** : n/N` | `steps[].id` dans `content/arcs/**` | La scène n'a pas de champ « étape » : c'est l'arc qui la cite (`card: en.kop.pacte`) et qui enchaîne par `next: [{step, in}]`. |
| `**Moment**` | `min_season`, `start: [a,b]`, `next.in` (arc) ; `when` (carte) | La fenêtre de créneaux vit dans l'arc, pas dans la carte. |
| `**Lieu**` | — | Décor d'auteur. Il peut ressortir en `tags:` (`local`, `couloir`, `buvette`). |
| `**Conditions**` | `when:` | Expression du jeu : `flag('x')`, `relation.gege >= 1`, `season >= 2`, `plays('arc') >= 1`, `count('mot')`, `fil_rouge == 'prix'`, `bilan.*` (au Bilan seulement). |
| `**NOM** *(fonction — expression — didascalie)*` | `speaker:` | L'**id** du personnage (`gege`), jamais le nom affiché. L'expression et la didascalie ne s'importent pas. |
| « Réplique » | `text:` | ≤ 200 caractères. Deux phrases, un tic, un nom une fois. `{toi}` seulement si le locuteur a une `adresse` ; `{prenom}/{nom}/{NOM}` au plus une fois par carte et jamais deux cartes de suite dans une même intrigue. |
| ton de la scène | `tone: leger \| neutre \| drame` | `drame` interdit en S0 et jamais deux d'affilée dans un réservoir. |
| `←` libellé | `left.label` | ≤ 28 caractères. Jamais le nom du joueur. |
| `←` effets | `left.effects` | Voir § 3.2. |
| `←` *conséquence* | `left.answer` | Une à deux phrases, ≤ 140 caractères, au présent. Jamais l'explication des effets. Un côté sans conséquence n'a pas d'`answer`. |
| `→` idem | `right.{label, effects, answer}` | Deux sorties identiques = carte à un seul bouton (Nouvelles, alarmes douces). |
| `**Traces**` | `set: [...]` dans les effets **et** `traces:` de l'arc | Une trace n'est « posée » que si l'arc lui donne sa **ligne d'Almanach** (`{annee} : …`, ≤ 120 caractères). Sans ligne d'Almanach, utiliser `journal: {text, poids, tags}`. |
| `**Réactions déclenchées**` | `react:` dans les effets | `react: en.re.x` ou `react: [{card, if}, {card}]` — la dernière variante sans `if`. |
| `**Lu plus tard par**` | — | Contrat de couture. Le chapitre 90 refuse toute trace posée jamais lue et toute trace lue jamais posée. |

Les autres champs de carte utiles : `tags:`, `once: true`, `chance:`, `cooldown`/`cd`,
`exclusive_with:`, `schedule:`, `next:`, `char:`, `club:`, `end:`.

### 3.2 Les effets symboliques → `effects:`

`+` = 5, `++` = 10, `+++` = 18 (`content/balance.yaml`), et les négatifs de même. Jauges canoniques :
`vestiaire`, `tribunes`, `direction`, `caisse` — jamais le libellé du rôle.
Un à trois effets de jauge par côté, un `+++` par carte au plus.

```yaml
effects:
  tribunes: "++"
  caisse: "-"
  relation: { gege: 1 }        # ou relation.gege dans la notation d'écriture
  force: 2
  parole: 1
  promise: true
  set: [pacte_gege]
  clear: [pari_promu]
  outcome: pacte               # ferme l'étape sur une issue de l'arc
  react: en.re.josiane_chauffage
  schedule: [{ card: in.dossier.video_apres, in: [14, 14] }]
  next: { step: banderoles, in: [9, 14] }
  var: { tiroirs: "+1" }
  world: { capitaine: mbako }
  rand: [{ p: 0.5, tribunes: "++" }, { tribunes: "--" }]
  char: { mbako: { statut: vendu } }
  club: { change: true, division: 2 }
  role: entraineur             # Carte Destin seulement
  chain: pr.ligue_fermee
  end: en_valise
```

`rand` ne décide jamais d'une trace ni d'une fin. `elimination` n'est pas un effet de carte : c'est
une entrée de `balance.yaml` appliquée par le moteur à la clôture d'une chaîne.

### 3.3 Une fiche d'intrigue → un arc de `content/arcs/<rôle>/<mot>.yaml`

| Ligne du gabarit (§ 4.3) | Champ |
|---|---|
| `## INTRIGUE <id> — <Titre>` | `id:` et `title:` |
| **Logline / Synopsis** | commentaire d'en-tête du fichier (le YAML n'a pas de champ) ; la logline peut servir de `hint:` |
| **Rôle(s)** / **Postulat(s)** | `roles:` / `postulats:` (vide = tous) |
| **Porteur** / **Cast** | `carrier:` / `cast:` |
| **Thème** | `theme:` |
| **Saisons** | `min_season:` et le bucket `"0" \| "1" \| "2+"` du `programme:` du postulat |
| **Conditions d'entrée** | `if:` de l'entrée de réservoir, dans `content/postulats.yaml` |
| **Exclusions** | `exclusive_with:` |
| **Rejouabilité** | `once: true` \| `replay: {after, max}` \| `every_season: true` |
| **Issues → Traces → Qui les lit** | `issues: [...]` et `traces: { <drapeau>: "{annee} : …" }` |
| **Séquencier** | `steps: [{id, card, outcome, next: [{step, if, in}]}]` — les variantes sont une **liste** de `card`, première vraie gagnée |
| **Scènes** | les cartes de `content/cards/**` citées par `steps[].card` |
| **Épilogue** | `epilogue: {…}` et `fallback:` |
| — | `foreground:`, `weight:`, `same_club:`, `start: [a,b]` |

Le **réservoir** d'un postulat (l'ensemble tiré en début de saison) et son `programme` par bucket
vivent dans `content/postulats.yaml`, avec `cast`, `questions` (le fil rouge), `objectifs` cachés,
`opening_arc` et `alarm_overrides`.

### 3.4 Les autres gabarits

| Gabarit | Fichier de destination | Notes d'import |
|---|---|---|
| **§ 4.4 Réaction** `<rôle>.re.<qui>_<quoi>` | `content/cards/<rôle>/reactions.yaml` ; les partagées `co.re.*` dans `content/cards/common/reactions.yaml` | Carte ordinaire, `speaker` obligatoire. **Ne pas écrire `kind:`** : le build le dérive de tout `react:` qui la cite. Jamais `end`, jamais `react`, jamais `tone: drame`, effets petits, plafond quatre par saison, jamais deux d'affilée. Une réaction `once` doit être gardée par `!seen()` dans le `react` qui l'appelle. |
| **§ 4.5 Manchette** `une.<postulat\|generic\|journal>.<mot>` | `content/unes.yaml` | `id, postulats, roles, journal (quotidien\|gazette\|echo), priority 0-4, poids, when, titre (≤ 44 caractères rendus), sous, sujet, photo, react`. `when` lit `bilan.tenu`, `bilan.rang`, `bilan.outcome` — jamais `flag('bilan_tenu')`, jamais `world.rang_final`. ≥ 2 manchettes de secours en priorité 0 sans `when`. **Une manchette citée est une manchette écrite** : à défaut, citer `une.generic.*`. |
| **§ 4.6 Nouvelle datée** `co.nv.<annee>_<mot>` | `content/cards/common/nouvelles_datees.yaml` (non datées : `co.nouvelle.<mot>`) | `arc: nouvelle`, `once: true`, `when` sur l'année, un seul bouton (effets identiques des deux côtés), effet ≤ `+`. Les traces de monde (`monde_*`) se posent ici. |
| **§ 4.7 Set-piece** (beat) | `content/cards/**` + la table des beats du moteur | Une variante = une entrée conditionnelle ; zéro aléa ; la première vraie gagne ; **la dernière est sans condition** (le secours). Sept beats : `objective`, `aftermatch`, `gm_annonce`, `cup`, `bilan_verdict`, `bilan_contrat`, `bilan_carrefour`. |
| **§ 4.8 Fin** | `content/endings.yaml` | `id, gauge \| cause, rarete, doree, partageable, epitaph` (deux phrases, le joueur nommé une fois, accord `{pg, select, f{e} other{}}`), `epitaph_plus: [{when, text}]` (≤ 2, première vraie), `rebond: {when, postulat}` (réservé), ligne d'Almanach. Le `end:` d'une carte doit désigner une plaque écrite. |
| **§ 4.9 Anecdote** | `content/cards/common/*.yaml` (décor), `content/journal.yaml` (lignes d'Almanach), ou le Codex | ≤ 120 caractères si c'est une ligne d'Almanach. |
| **Alarme** `<rôle>.alarme.<jauge>_<bas\|haut>_<qui>` | `content/alarms.yaml` | Deux par jauge et par rôle ; `alarm_overrides` par postulat dans `postulats.yaml`. |
| **Trace / drapeau** | `content/flags.yaml` | snake_case, un nom qui se lit comme un souvenir, jamais un verbe à l'infinitif, jamais de chiffre. Le nom d'un postulat **est** un drapeau : on écrit `flag('promu')`, jamais `postulat == 'promu'`. |
| **Personnage** | `content/characters.yaml` | `nom, fonction, genre, tic, camp, adresse, statut` (dont `mort`). Les ids techniques ne bougent jamais ; seuls les `name` changent (charte § 5.3.a). |

### 3.5 L'ordre d'import conseillé

1. `flags.yaml` (les traces, dont les drapeaux de postulat), `characters.yaml` (les noms et les tics).
2. Les arcs (`content/arcs/**`) — ils déclarent les traces et leurs lignes d'Almanach.
3. Les cartes (`content/cards/**`) citées par les `steps`, puis les réactions, puis les Nouvelles.
4. `postulats.yaml` (réservoirs, cast, fils rouges, objectifs), `alarms.yaml`, `endings.yaml`.
5. `unes.yaml` en dernier : c'est lui qui cite tout le reste (`photo`, `react`, `sujet`).
6. Passer le lint : aucune manchette fantôme, aucune trace posée jamais lue, aucune fin citée non écrite.

---

## 4. Les statistiques (comptées)

Comptées par `docs/bible/tools/stats.js` sur les treize fichiers de `docs/bible/`
(`node docs/bible/tools/stats.js`, `--json` pour la sortie machine).

### 4.1 Par chapitre

| Chapitre | Mots | Scènes | Intrigues | Fiches | Réactions | Manchettes | Nouvelles | Anecdotes | Fins |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 00_charte | 17 889 | 1 | 0 | 0 | 2 | 5 | 1 | 0 | 0 |
| 01_personnages_terrain | 71 498 | 216 | 0 | 19 | 23 | 0 | 0 | 0 | 0 |
| 02_personnages_direction_instances | 65 100 | 138 | 23 | 23 | 18 | 127 | 11 | 0 | 0 |
| 10_scenarios_joueur | 86 352 | 245 | 21 | 0 | 67 | 82 | 0 | 0 | 19 |
| 11_scenarios_entraineur | 64 266 | 160 | 40 | 0 | 60 | 80 | 2 | 0 | 6 |
| 12_scenarios_directeur_sportif | 39 145 | 83 | 15 | 0 | 15 | 55 | 2 | 0 | 8 |
| 13_scenarios_president | 50 354 | 111 | 21 | 0 | 34 | 161 | 1 | 4 | 19 |
| 14_scenarios_selectionneur | 38 355 | 63 | 13 | 0 | 20 | 58 | 2 | 0 | 8 |
| 15_scenarios_instance | 36 378 | 37 | 0 | 0 | 19 | 59 | 1 | 0 | 8 |
| 20_journaux | 28 402 | 0 | 0 | 0 | 26 | 269 | 113 | 0 | 0 |
| 30_setpieces_alarmes_fins | 24 623 | 28 | 0 | 0 | 1 | 5 | 0 | 0 | 31 |
| 31_anecdotes_et_almanach | 19 105 | 6 | 0 | 0 | 4 | 0 | 4 | 101 | 0 |
| 90_interconnexions | 23 443 | 0 | 0 | 0 | 84 | 1 | 3 | 1 | 0 |
| **Total** | **564 910** | **1 088** | **133** | **42** | **213** | **843** | **127** | **106** | **99** |

Les colonnes Réactions, Manchettes, Nouvelles et Anecdotes comptent des **identifiants distincts
dans le fichier** : un même id cité par deux chapitres apparaît deux fois par ligne, une seule fois
au total.

### 4.2 Totaux du corpus (identifiants dédupliqués)

| Grandeur | Compte | Règle |
|---|---:|---|
| Chapitres | 13 | fichiers `.md` de `docs/bible/` |
| Mots | 564 910 | tokens `\p{L}\p{N}` |
| Signes | 3 696 889 | caractères, espaces comprises |
| Fiches de personnage | 42 | titres `## NOM (\`id\`)` |
| Intrigues | 133 | titres `## INTRIGUE` (hors gabarit) |
| Scènes au gabarit complet | 1 088 | titres `### SCÈNE` (hors gabarit) |
| Identifiants de carte cités | 2 180 | `<préfixe>.<arc>.<étape>` distincts |
| Réactions | 213 | ids `*.re.*` distincts |
| Manchettes de Une | 843 | ids `une.*` distincts |
| Nouvelles datées | 99 | ids `co.nv.<annee>_*` distincts |
| Nouvelles « à côté » | 28 | ids `co.nouvelle.*` distincts |
| **Nouvelles au total** | **127** | |
| Anecdotes et décors | 106 | ids `co.dec.*` distincts + titres `### ANECDOTE` |
| Fins | 99 | titres `### FIN` (hors gabarit) |
| Alarmes | 67 | ids `*.alarme.*` distincts |
| Beats de set-piece | 10 | sections de beat du chapitre 30 |
| Variantes de set-piece | 63 | blocs `#### <rôle>` |
| Traces distinctes posées | 63 | drapeaux vus dans un `set:`/`clear:` |

---

## 5. Les interdits (rappel de la charte § 6.1)

1. Aucune personne, aucun club, aucune ville, aucun journal, aucune compétition, aucune marque réels
   — ni maquillés. Un personnage ne porte jamais plus de deux traits reconnaissables d'un vivant.
2. Le narrateur tutoie le joueur. Les personnages parlent avec leur tic.
3. Deux phrases par réplique. Un nom une fois. La relation se lit sur le visage, jamais en chiffre.
4. Une carte de drame a une seule sortie, ou deux sorties graves — et jamais en saison 0.
5. Un libellé de choix : vingt-huit caractères, pas un de plus, et jamais le nom du joueur.
6. Une conséquence tient en deux lignes. La troisième phrase tombe dans le vide : elle descend dans
   l'Almanach ou dans un `epitaph_plus`.
7. Une manchette citée est une manchette écrite. Une trace posée est une trace lue.

---

## 6. L'outillage de la bible

Deux scripts, sans dépendance, dans `docs/bible/tools/` :

| Script | Ce qu'il fait |
|---|---|
| `node docs/bible/tools/stats.js` | Recompte tout ce qui est au § 4 (`--json` pour la sortie machine). À relancer après chaque livraison de chapitre. |
| `node docs/bible/tools/build_html.js [sortie.html]` | Assemble les treize chapitres en une page unique « papier crème » : page de garde chiffrée, sommaire, navigation collante, scènes mises en scénario, index des personnages et des intrigues. Sortie par défaut : `docs/bible/bible.html`. |

Ils ne lisent que `docs/bible/*.md` et n'écrivent jamais dans `content/`.
