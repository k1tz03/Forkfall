# Les scènes jouées, les conversations et la vie des pièces

*Octobre 2026. Le format des scènes non jouables de la ville : l'introduction de chaque histoire,
les scènes où les personnages se parlent de l'intrigue, les conversations qu'on surprend, et ce
qu'on fait dans les pièces. Le moteur de la ville les lit dans `content/ville/*.yaml` ;
`build_content` les valide ; `packages/tools/web/ville_cinema.js` les joue.*

Ce que le porteur du projet a demandé :

> « Pour chaque histoire, je voudrais une introduction à l'histoire, des zones de conversations
> non jouées avec phases de dialogues, dans des intérieurs, extérieurs, des évènements non jouables
> où les personnages parlent de l'intrigue, de ce qu'il se passe, comme dans Hotline Miami ou dans
> Final Fantasy Tactics. »
>
> « Les phases sans histoires sont trop vides, il ne se passe pas grand-chose dans la ville ; dans
> Punch Club il y a plein de choses à faire partout. »

La charte d'écriture (`docs/bible/charte_histoire.md`) s'applique à tout ce qui suit, mot pour
mot : pas de tic, une scène est une scène (un lieu, un geste, une demande), on parle de *cette*
situation, le sous-texte avant le texte, aucun nom réel (clubs, joueurs, dirigeants, marques,
compétitions, villes, pays). Français uniquement.

---

## 1. Ce qui existe

| | Où | Combien |
|---|---|---|
| **Scène jouée** (`cinematiques`) | `content/ville/cinematiques_<lot>.yaml` | on la regarde ; une fois par carrière |
| **Conversation surprise** (`conversations`) | même fichier | on l'entend en passant près ; une fois |
| **Activité d'un objet** (`activites`, avec `objet`) | `content/ville/activites_<lot>.yaml` ou `ville.yaml` | répétable, à ses heures |
| **Pièce** | `docs/design/pixel_iso/pieces/` (rendu : `interieurs_jeu.js`) | 39 lieux où l'on entre |

**Les pièces et leurs noms.** Chaque lieu où l'on entre a une pièce : ses **objets** (ce qu'on
touche : un id et un nom affiché) et ses **places** (où se tient quelqu'un : un nom, à qui elle
revient, debout ou assis). Les ids et les noms sont fixés par `docs/design/pixel_iso/pieces/_plan.js`
(et, pour les quatre pièces déjà modelées, par leur fichier : `appartement.js`, `buvette.js`,
`clubhouse.js`, `stade.js`). La liste lue par le jeu est
`packages/tools/web/interieurs/interieurs.json` (`pieces.<lieu>.objets[].id`,
`pieces.<lieu>.places`). On peut l'afficher :

```bash
node -e 'const m=require("./packages/tools/web/interieurs/interieurs.json").pieces;for(const[k,p]of Object.entries(m))console.log(k,"| objets:",p.objets.map(o=>o.id).join(" "),"| places:",Object.entries(p.places).map(([n,q])=>n+"("+q.pour+(q.pose==="assis"?",assis":"")+")").join(" "))'
```

Un lieu sans pièce (le terrain annexe, le square, le cimetière, la friche, la fontaine, le marché,
le monument, le kiosque, le lavoir, la voiture, le feu, le columbarium) se joue **dehors**, devant
sa porte : places `porte`, `centre`, ou `[dx, dy]` (un décalage en cases de 80 cm depuis la porte).

---

## 2. La scène jouée

```yaml
cinematiques:
  - id: h4.ci.intro                 # unique, [a-z0-9_.] ; préfixe du livre (h1 … h10)
    quand: debut                    # debut | drapeau | carte | lieu | semaine (voir § 3)
    roles: [joueur]                 # facultatif
    si: "flag(histoire_h4)"         # la grammaire de la ville : ET seulement (voir § 6)
    titre: "La Route de la Rive"    # facultatif : une carte de titre au néon, avant la scène (≤ 40)
    sous: "Aubérive, août 1990"     # sous le titre (≤ 60)
    lieu: terminus                  # où : une pièce (on est dedans) ou un lieu sans pièce (dehors), ou `ici`
    suite: h4.ci.intro_2            # facultatif : la scène qui s'enchaîne, ailleurs (elle a `quand: suite`)
    tranche: soir                   # facultatif : la lumière de la scène (matin|midi|aprem|soir|nuit)
    meteo: pluie                    # facultatif, dehors : pluie | neige | brume
    vide: true                      # facultatif, dedans : personne d'autre que la distribution
    acteurs:                        # qui est en scène, et où (une place de la pièce)
      - {qui: toi, place: porte}
      - {qui: bertrand_rance, place: bertrand}
      - {id: patron, qui: commercant2, nom: "Le patron", place: patron}
    etapes:                         # une chose par étape, jouées dans l'ordre
      - {narration: "…"}
      - {qui: toi, va: comptoir_1}
      - {qui: bertrand_rance, dit: "…", ton: noir}
      - …
```

**Les acteurs.** `qui` : `toi` (le héros), l'id d'un personnage (`content/characters.yaml`), ou
des gens sans nom : `passant`, `passante`, `enfant`, `fan`, `ancien`, `commercant`, `commercant2`,
`inconnu`, `garagiste`, `portier`. Deux anonymes du même genre prennent chacun un `id` (le nom
qu'utilisent les étapes) et un `nom` affiché (« Le patron », « Un chauffeur »). `place` : une place
de la pièce, `porte`, `centre`, `[dx, dy]`. Facultatifs : `pose: assis`, `regarde: gauche|droite`,
`cache: true` (il n'est pas là au début : il `entre`). Un habitué de la pièce qui joue dans la
scène quitte sa place d'occupant pour son rôle. **Les autres gens de la pièce** sont ceux de
l'heure de la scène (`tranche`) : la nuit, le club-house est vide et le bar plein ; `vide: true`
n'y laisse que la distribution. Une scène `quand: lieu` se joue à la première entrée, à toute
heure : son `si` peut demander `tranche == soir`.

**Les étapes** (une seule clé d'action par étape ; `dit` peut porter `ton`, `geste` et `emote`) :

| Étape | Effet |
|---|---|
| `{titre: "…", sous: "…"}` | une carte de titre au néon de l'histoire, sur le noir |
| `{narration: "…"}` | une boîte sans visage, en italique (≤ 220) : le lieu, l'heure, ce qu'on voit |
| `{qui: X, dit: "…", ton: sourire\|neutre\|noir}` | X parle (≤ 170) : son portrait, son nom, les mots qui tombent ; on touche pour la suite |
| `{qui: toi, pense: "…"}` | ce que le héros pense et ne dit pas (≤ 170) |
| `{qui: X, va: place}` | X marche jusqu'à la place (`attendre: false` : la scène n'attend pas) |
| `{qui: X, entre: place}` | X entre par la porte et va à sa place |
| `{qui: X, sort: true}` | X sort par la porte |
| `{qui: X, geste: g}` | X fait un geste qui dure (`debout` le défait) |
| `{qui: X, emote: e}` | une émotion au-dessus de sa tête, deux secondes |
| `{qui: X, regarde: Y}` | X se tourne vers Y (ou `gauche`, `droite`) |
| `{pause: 800}` | un silence, en millisecondes (≤ 6000) |
| `{fondu: "Trois semaines plus tard."}` | le noir, une ligne (≤ 120), la scène reprend |
| `{secousse: true}` | l'écran tremble (un coup, une porte, une chute) |
| `{flash: rouge\|blanc\|bleu\|noir}` | un éclair de couleur |
| `{son: …}` | un bruit : `carte_arrivee`, `reaction`, `nouvelle`, `une`, `match_but`, `match_encaisse`, `sifflet_final`, `tampon_fin`, `palier_haut`, `palier_bas`, `promesse`, `argent`, `alarme`, et ceux des scènes : `sonnerie` (le téléphone), `sirene` (l'usine, ou au loin), `porte` (qu'on claque), `klaxon`, `verre` |
| `{musique: …}` | le thème, jusqu'à la fin de la scène : `sombre`, `ville_nuit`, `ville_jour`, `match`, `fin`, `depart`, `accueil` |
| `{camera: X}` | la caméra va sur X |
| `{meteo: pluie\|neige\|brume\|aucune}` | le temps change (dehors seulement : dedans, il ne pleut pas) |

**Les gestes** : `assis`, `debout`, `telephone`, `boit`, `fume`, `bras_leves`, `pointe`, `poing`,
`tete_basse`, `pleure`, `rit`, `tremble`, `couche`, `genou`, `danse`, `frappe`, `dos`, `lit`,
`ecrit`, `ballon`. **Les émotions** : `!`, `?`, `...`, `colere`, `sueur`, `coeur`, `note`, `zzz`,
`choc`, `aucun`.

**Les mots** : `{prenom}`, `{nom}`, `{club}`, `{ville}`, `{rival}`, `{annee}`, `{division}`,
`{rang}`, `{groupe}`, et `{toi}` (l'adresse du personnage qui parle, au ton neutre — elle exige
qu'il ait une `adresse` pour le rôle). **Le genre**, comme dans les cartes : le héros est un homme
ou une femme selon la carrière (le joueur choisit, certains livres imposent) — `{pg, select,
f{arrivée} other{arrivé}}` accorde au héros, `{sg, select, f{…} other{…}}` à celui qui parle.
Une option peut contenir un mot (`{prenom}`), pas un autre choix. Partout où le héros est nommé,
décrit ou accordé, on accorde, ou on tourne la phrase pour qu'elle n'ait pas à l'être.

---

## 3. Quand une scène se joue

| `quand` | Ce qu'il faut de plus | Elle se joue |
|---|---|---|
| `debut` | — | **l'introduction** : au début de la carrière, avant la première carte. Une par livre, la première dans l'ordre des fichiers dont le `si` est vrai. Ensuite, le héros se réveille chez lui |
| `drapeau` | `drapeau: h4_xxx` | dès qu'une carte a posé ce drapeau, après cette carte |
| `carte` | `carte: id` (ou `cartes: [ids]`, ou `prefixe: "sl.h9.c1_retour"` pour les variantes), `moment: avant\|apres` | juste avant que la carte s'affiche, ou juste après qu'on y a répondu |
| `lieu` | `lieu: …` | la première fois qu'on entre dans ce lieu et que `si` est vrai |
| `semaine` | `tranches: […]`, `poids` | un jour sans carte, comme une scène de la semaine (le plan du jour la tire) |
| `suite` | une scène qui la nomme dans son `suite:` | **à la fin de la scène qui la précède**, ailleurs : le noir (ou son titre), puis elle. Une introduction peut passer ainsi de la gare routière au club-house, puis à la buvette. « Passer » saute toute la suite |

Une scène ne se joue qu'une fois par carrière. Elle ne se joue jamais pendant une carte ou un match.

**Ce qu'une scène fait de l'histoire.** Elle ne pose pas de drapeau, ne bouge pas de jauge : elle
montre. Les décisions restent dans les cartes. Une bonne scène prépare une carte (le doute avant le
choix : `carte`, `avant`), en montre l'écho (ce que les autres en disent : `carte`, `apres`, ou
`drapeau`), ou fait vivre un lieu (`lieu`, `semaine`).

**La forme.** Six à quatorze étapes. Deux à quatre voix. Un geste ou un déplacement toutes les
deux ou trois répliques (Final Fantasy Tactics : les figurines bougent pendant qu'elles parlent).
Une réplique, une idée ; jamais deux phrases de suite qui expliquent. La fin sur une image (un
geste, un silence, une sortie), pas sur une morale. Les répliques du héros sont rares : il pense
plus qu'il ne parle.

---

## 4. La conversation surprise

```yaml
conversations:
  - id: h1.cv.le_filet
    roles: [entraineur]
    si: "flag(histoire_h1) && annee == 1990"
    lieu: buvette                       # une pièce, ou un lieu sans pièce (devant sa porte)
    tranches: [soir, nuit]              # facultatif : quand on peut l'entendre
    qui:                                # deux ou trois voix, à leurs places
      - {qui: gege, place: fond}
      - {qui: vecchio, place: zinc_1}
    repliques:                          # au moins deux ; ≤ 140 caractères chacune
      - {qui: vecchio, dit: "Tu lui as dit, pour le placard ?"}
      - {qui: gege, dit: "Le filet ? Il le verra bien assez tôt."}
```

Elle se déclenche quand le héros passe à quelques cases d'une des voix, et se joue en bulles, sans
l'arrêter. Les voix absentes de la pièce y prennent place le temps de parler. Trois à huit
répliques. Ce qu'on surprend n'est pas dit au héros : ce sont les autres qui parlent de lui, de
l'affaire, de la ville — la rumeur, la peur, le calcul.

---

## 5. Ce qu'on fait dans une pièce : les activités des objets

Une activité (`content/ville/activites_<lot>.yaml`, sous `activites:`) se fait au lieu, à ses
heures ; avec `objet`, elle s'attache à un objet de la pièce : on touche l'objet, on y va, on la
choisit.

```yaml
activites:
  - id: bar_flechettes
    lieu: bar
    objet: flechettes                 # un objet de la pièce (interieurs.json)
    label: "Une partie de fléchettes" # ≤ 28
    texte: "…"                        # ≤ 200 : ce qui se passe (la ville l'affiche)
    textes: ["…", "…", "…"]           # facultatif : des variantes, tirées tour à tour
    tranches: 1                       # le temps que ça prend (0 : un instant)
    francs: -20                       # ce que ça coûte (négatif) ou rapporte (positif), en francs de 1990
    heures: [aprem, soir]             # facultatif : quand on peut le faire
    roles: [joueur]                   # facultatif
    si: "annee >= 1995"               # facultatif : la grammaire de la ville
    jauges: {tribunes: 1}             # facultatif : ±5 au plus, une fois par semaine (le climat caché)
    max_jour: 2                       # facultatif
    jeu: flechettes                   # facultatif : un petit jeu (flechettes, des, jongles, babyfoot, flipper, cartes, penalty)
    special: tele                     # facultatif : un geste à part (dormir, tele, telephone, journal)
```

Un objet sans activité ouvre le panneau du lieu entier. Une activité sans objet reste dans ce
panneau.

---

## 6. La grammaire de `si`

ET seulement (`&&`) : `flag(x)`, `!flag(x)`, `arc(id)`, `possede(objet)`, `mission(id)`,
`annee >= 1995`, `saison == 2`, `role == joueur`, `tranche == soir`, `jour == sam`,
`rang <= 3`, `vestiaire > 60`… (la liste complète : `build_content.dart`, `_compileVille` → `si`).
Un drapeau lu par la ville doit être déclaré dans `content/flags.yaml` (le lint le vérifie).

---

## 7. Vérifier

```bash
dart run packages/tools/bin/build_content.dart   # 0 erreur : ids, places, objets, personnages, longueurs
dart run packages/tools/bin/lint.dart            # 0 erreur
```

**Voir une scène** sans jouer la carrière jusqu'à sa carte : assembler la ville (`AGENTS.md`,
« La ville »), la servir en HTTP, puis `voir_scene.js` la joue (une nouvelle carrière du livre,
l'introduction passée sauf si c'est elle qu'on regarde), écrit chaque réplique, prend une capture
par réplique et signale ce qui cloche : une figurine debout dans un meuble ou un mur, une figurine
hors de l'écran, une erreur de la page.

```bash
dart compile js -O2 packages/tools/web/preview.dart -o /tmp/moi/engine.js
node packages/tools/web/assemble.js --engine /tmp/moi/engine.js --out /tmp/moi/site/index.html --ville <les tuiles de la ville>
(cd /tmp/moi/site && python3 -m http.server 8771 --bind 127.0.0.1 &)
NODE_PATH=/opt/node22/lib/node_modules node packages/tools/web/voir_scene.js \
  --url http://127.0.0.1:8771/index.html --postulat 3 --scene h4.ci.intro --out /tmp/moi/voir
#   --conv h4.cv.le_quai   une conversation (on se rend à son lieu, à portée de voix)
#   --heure soir           l'heure de la ville avant la scène
```

Les postulats : 0 h1 (promu), 1 h2 (intérimaire), 2 h3 (pépite), 3 h4 (fin de contrat), 4 h5 (géant
déchu), 5 h6 (vendre trente), 6 h7 (après le fiasco), 7 h8 (le modèle), 8 h9 (le Mondial d'hiver),
9 h10 (l'escalier fermé). Dans la page, `FusibleVille._essai('cine', id)` et
`FusibleVille._essai('conv', id)` font la même chose à la main.
