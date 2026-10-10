# FUSIBLE — reprendre le projet

Ce fichier existe pour qu'un agent (ou un humain) qui n'a rien suivi puisse
reprendre le travail sans poser de question. Il vaut aussi comme `CLAUDE.md`.

## Ce qu'est le jeu

Un jeu mobile façon *Reigns*, sur une carrière de football. Une carte est une
scène ; on glisse à gauche ou à droite ; quatre équilibres (vestiaire, tribunes,
président, caisse) se vident ou débordent, et la carrière s'arrête. On rejoue
avec un successeur. La chronologie va de 1990 à 2050, dans un pays qui n'existe
pas : villes, clubs, journaux, compétitions, personnes — tout est inventé.
Français uniquement pour le moment.

**La règle qui ne se négocie pas** : aucun nom réel de club, de joueur, de
dirigeant, de marque ou de compétition, nulle part — ni dans le contenu, ni dans
les visuels, ni dans les prompts de génération d'images. Ce qui peut être réel,
c'est le *sport* : les règles qui changent, l'argent de la télévision, les stades
tout-assis, l'équipement, les tactiques. Jamais les gens.

## L'état, en une page

| | |
|---|---|
| Contenu | 2 480 cartes, 235 arcs, 90 fins, 175 Nouvelles datées, 389 manchettes de Une, 459 variantes de set-piece, 41 personnages ; la ville : 292 scènes de la semaine |
| Rôles jouables | entraîneur, joueur, président, directeur sportif — six histoires livrées sur dix (voir « Les dix histoires ») |
| Moteur | Dart pur, déterministe, 131 tests, 20 goldens |
| Qualité | `dart analyze` propre, `lint` 0 erreur (6 avertissements connus : les postulats sans prologue des livres à venir, la part des Unes qui nomment le héros, `histoire_h4`) |
| Bible narrative | `docs/bible/`, 13 chapitres, 565 000 mots, et la **charte d'écriture** (`docs/bible/charte_histoire.md`) |
| La ville | la version jouable : Aubérive en pixel art, la semaine en tranches d'heures, les cartes à leur lieu — voir plus bas |

## Les dix histoires (où on en est)

Les dix histoires de lancement (`docs/histoires/00_les_dix_histoires.md`) sont des
livres : chacune remplace le contenu d'un postulat par un prologue, une épine
d'ancres à créneaux fixes, ses intrigues, ses événements sombres, ses fins, ses
Unes, ses set-pieces et sa ville (répliques, missions, scènes de la semaine).

- **Fusionnés** dans cette branche : 1 « Trois mille visages » (entraîneur, promu),
  2 « Le Sapin en carton » (entraîneur, intérimaire), 3 « La Sirène » (joueur,
  pépite), 5 « La Maquette » (président, géant déchu), 6 « 23 h 58 » (directrice
  sportive, vendre trente), 8 « L'Oreillette » (directeur sportif, le modèle, 2024),
  4 « La Route de la Rive » (joueur, fin de contrat).
  Le menu de l'aperçu montre les postulats qui ne sont plus `chantier`.
- **Pas encore fusionnés**, sauvés en patchs dans `docs/histoires/chantier/` avec la
  procédure de reprise et de fusion : 7, 9, 10 (en cours d'écriture, instantanés
  partiels ; leurs auteurs ont été arrêtés avec la session).

## L'arborescence

```
packages/core/     moteur déterministe, Dart pur (aucun Flutter, aucune I/O)
packages/tools/    build_content, lint, simulate, et l'aperçu web (web/)
content/           la source YAML → content/build/content.json
app/               l'application Flutter
docs/brainstorm/   la bible de conception (11 sections) — le pourquoi
docs/bible/        la bible scénaristique (13 chapitres) — la matière écrite ; charte_histoire.md fait loi pour l'écriture
docs/design/pixel_iso/  le moteur de rendu voxel de la ville (Node) et ses rendus
docs/design/       les directions artistiques (dont trois rejetées)
docs/spec_variete_narrative.md   la spec du metteur en scène (mécanismes, budgets)
docs/balance/      les rapports d'équilibrage, avant/après
```

### Le moteur (`packages/core/lib/src/`)

| Fichier | Ce qu'il fait |
|---|---|
| `engine.dart` | démarre une carrière, sert une carte, applique un choix ; toute la boucle |
| `draw/director.dart` | le metteur en scène : quelle carte à quel moment, et pourquoi |
| `state.dart` | `GameState`, entièrement sérialisable — c'est la sauvegarde |
| `content.dart` | le bundle compilé, lu une fois au démarrage |
| `condition.dart` | le langage des `when` (`flag('x')`, `relation.gege >= 1`, `season >= 2`…) |
| `effects.dart` | ce qu'un choix fait (jauges, relations, drapeaux, réactions, fins…) |
| `world.dart` | le championnat simulé (points, journées, verdict de fin de saison) |
| `standings.dart` | le classement affichable, dérivé de `world` |
| `text.dart` | les placeholders (`{prenom}`, `{toi}`, `{annee}`…) |
| `sfx.dart` | quelle ambiance et quels sons pour la carte servie |
| `goldens.dart` | rejoue un Code de Carrière et en calcule l'empreinte |

**Le déterminisme est le socle de tout le reste** (partage d'un run, défi entre
amis, sauvegarde, tests). Trois règles à ne jamais casser :

1. Aucun aléa hors du `Rng` porté par `GameState`, consommé dans un ordre fixe.
2. Aucune itération de `Map`/`Set` non triée avant un tirage.
3. Toute liste sérialisée a un ordre stable.

Les 20 goldens (`content/tests/goldens.yaml`, `packages/core/test/goldens_test.dart`)
échouent si une carrière figée ne se rejoue plus à l'identique. Quand un
changement de contenu ou de calendrier les casse **légitimement**, on les
régénère avec `--goldens --write --recode` et **on écrit la raison** dans
l'en-tête du test.

## Les commandes

```bash
dart pub get
dart run packages/tools/bin/build_content.dart   # YAML → content/build/content.json + app/assets/content.json
dart run packages/tools/bin/lint.dart            # 0 erreur exigé
cd packages/core && dart test                    # 131 tests
dart run packages/tools/bin/simulate.dart --runs 2000 --assert   # budgets d'équilibrage
```

`simulate` porte tout l'outillage d'analyse : `--narrative --postulat i` (les
budgets de variété et d'histoire), `--reservoir` (à quelle fréquence chaque
intrigue s'ouvre), `--arc <id>` (le détail d'une intrigue), `--trace <graine>
--seasons n` (une carrière lisible en clair), `--diff a b` (deux carrières côte
à côte), `--une-check`, `--goldens`.

L'aperçu web jouable (un seul fichier HTML autonome, aucune ressource externe) :

```bash
dart compile js -O2 packages/tools/web/preview.dart -o /tmp/engine.js
node packages/tools/web/assemble.js --engine /tmp/engine.js --out /tmp/fusible.html
```

L'application Flutter : `cd app && flutter pub get && flutter analyze && flutter test`.

## La ville (la version jouable)

La couche « Punch Club » de la préproduction, branchée sur le vrai moteur :
`content/ville.yaml` (les lieux, qui on trouve où, ce qu'on y fait), `Engine.activite`
(une activité bouge les jauges sans rien tirer), et la coquille web avec
`packages/tools/web/ville.js` + `ville.css`. La ville décide **où et quand** une carte se
montre : chaque carte a un lieu (son `lieu:`, sinon son locuteur, sinon son beat) et une
fenêtre dans la semaine (deux ou trois cartes du lundi au vendredi, le match le samedi à
15 h, le classement le dimanche) ; un événement sombre ne s'annonce pas, il tombe le soir.
Le temps, l'énergie, la faim et l'argent sont tenus par la coquille ; la partie se
sauvegarde par l'état entier du moteur (le Code de Carrière ne rejoue pas la ville).

Ce que la ville porte en plus des cartes :

- **Les scènes de la semaine** (`content/ville/scenes*.yaml`) : le moteur ne sert que deux ou
  trois cartes entre deux samedis ; chaque jour sans carte, et souvent le soir, la ville
  programme une scène (un texte, un ou deux choix, des effets légers), à son lieu et à son
  heure ou qui vient à toi (`rue`, `domicile`). Quand l'heure arrive (une activité,
  « Attendre », « Y aller », le réveil), la ville s'y rend d'un fondu : on ne saute plus trois
  jours sans que rien n'arrive. Une scène est une mission d'une seule étape (`scene`) que le
  moteur applique sans tirage ; une fois par carrière ; `mission(<id>)` lit une scène vue. Le
  plan du jour se tire de la graine, de la semaine et du jour.
- **Le match à la Rive**, le samedi : la ville va au stade (les passants vers les grilles,
  puis la sortie), vingt-deux joueurs, l'arbitre et le ballon sur la pelouse, les deux tribunes
  remplies selon la jauge tribunes (peintes une fois avec la profondeur du décor), deux ou trois
  actions racontées à leur minute (`ville.yaml` `match:` et les lots `match_textes:`), le tableau,
  la mi-temps, le résultat, et le score peint sur le mur est jusqu'au samedi suivant. Le moteur
  joue un bloc de six journées d'un tirage ; la ville met en scène la dernière, et son score se
  tire de la lettre (V, N, D) pour l'écran seulement.
- **Le domicile** (`ville.yaml` `domiciles`) : par rôle (le sélectionneur à l'hôtel de la Rive),
  et une histoire peut en décider autrement par un drapeau.

- **Les gens** : personne n'apparaît au milieu de la rue ; un passant sort d'une porte ou
  arrive du hors-champ, et marche au large des murs (une grille érodée, des chemins qui ne
  rasent aucun angle). Les personnages connus (`presences`), celui qui t'attend et les
  commerçants sortent de chez eux et y rentrent. On les **touche** : ils s'arrêtent et disent
  une réplique du moment, tirée de `content/ville/paroles_*.yaml` selon son `si` (une petite
  grammaire, ET seulement, que `build_content` valide et que `ville.js` évalue — les deux
  doivent rester d'accord).
- **Les missions secondaires** (`content/ville/missions*.yaml`), rares : un donneur à un lieu
  et une heure, des étapes avec rendez-vous et délai, de l'argent propre ou sale, des effets
  appliqués par `Engine.mission` ; leurs risques sont des événements sombres du moteur
  (`ville_risques`).
- **La boutique et les biens** (`content/ville/boutique.yaml`) : vêtements, montres,
  voitures, logements, hélicoptère ; achat en deux gestes, revente, effets par
  `Engine.biens` (drapeaux `bn_*`), usage en ville (vitesse, repos, faim, l'hélicoptère),
  saisies.
- **Le pont** : une carte agit sur la ville par des compteurs `var:` en francs de 1990 —
  `ville_francs`, `ville_francs_sales` (l'argent sale salit ce qu'il paie : saisi en premier),
  `ville_amende`, `cadeau_<objet>`, `rendre_<objet>` (un seul objet rendu),
  `saisie_vehicules|logement|luxe|tout`, `vol_luxe` ; la
  ville retient ce qu'elle en a appliqué. L'argent s'affiche selon l'époque (inflation, puis
  l'écu après `monde_ecus`).
- **Le plan** : la ville vue de loin (`plan.webp`), un point par lieu, toi, le rendez-vous.

```bash
# les images (une fois ; ~4 min) : la zone de jour, au crépuscule, de nuit, sa profondeur, la grille
cd docs/design/pixel_iso && for t in day night; do node ville_assets.js $t grille; done && node ville_assets.js dusk && node ville_post.js
# puis la découpe en tuiles WebP (ImageMagick), dans out/ville/web — voir le README du dossier
dart compile js -O2 packages/tools/web/preview.dart -o /tmp/engine.js
node packages/tools/web/assemble.js --engine /tmp/engine.js --out /tmp/ville/index.html --ville docs/design/pixel_iso/out/ville/web
```

La page sort avec un dossier `ville/` à côté (tuiles, profondeur, grille, lieux, sprites) :
elle se sert en HTTP (les JSON sont lus par `fetch`), pas en `file://`.

## Comment on ajoute du contenu

La bible (`docs/bible/`) est la matière écrite ; son `README.md` § 3 est la table
de conversion scène → YAML, champ par champ. En résumé : une intrigue est un arc
(`content/arcs/<rôle>/<mot>.yaml`) qui enchaîne des étapes, chaque étape cite une
carte (`content/cards/<rôle>/*.yaml`), et le postulat déclare dans son
`programme` (`content/postulats.yaml`) dans quel « bucket » de saison l'intrigue
peut être tirée, avec quel poids.

**On écrit des scènes, pas des répliques à tic** : la charte d'écriture
(`docs/bible/charte_histoire.md`) passe avant le § 3.1 du README de la bible. Un geste,
un objet, une question qui engage ; une graine plantée qui revient trois à dix cartes plus
tard ; jamais une formule qui revient d'une carte à l'autre. Les événements sombres sont
des arcs `kind: evenement` avec un `lieu:` et le tag `sombre` (catalogue : charte § 5) ;
le metteur en scène en arme deux par saison au plus, jamais à moins de cinq cartes
d'écart.

Les contrats que le lint fait respecter : un libellé de bouton ≤ 28 caractères,
un texte ≤ 200, une trace posée est lue quelque part, une fin déclarée a une
porte, `{toi}` exige que le locuteur ait une `adresse`, une réaction ne se pose
pas sur une carte de routine.

**Écrire à plusieurs sans se marcher dessus** : les fins, les manchettes, les set-pieces
et la ville se lisent aussi par lots — `content/endings/<lot>.yaml` (et
`epitaph_plus_ajouts:` pour ajouter une ligne d'épitaphe à une fin commune, comme la garde
à vue, sans toucher à son fichier), `content/unes/<lot>.yaml`, `content/setpieces/<lot>.yaml`
(des variantes rangées avant le secours, jamais un secours), `content/ville/<lot>.yaml`
(`paroles`, `missions`, `objets`, `presences`, `rencontres`). Un postulat peut imposer son
`club`, sa `ville` et son `rival` (cosmétiques, posés après les tirages). Les dix histoires
de lancement (`docs/histoires/00_les_dix_histoires.md`) ont leurs outils : le tag
`intermede` (une carte à part, plus sombre, sans locuteur), la ligne d'ordre selon son
support (`fax`, `repondeur`, `portable`, `oreillette`, `telephone`), et `lieu: ailleurs`
(loin d'Aubérive : la ville s'efface derrière le décor que nomme un tag, ville.yaml
`ailleurs`).

## Le chantier ouvert : la direction artistique

L'identité visuelle actuelle (« l'album de vignettes ») **est rejetée par le
porteur du projet**, ainsi que les trois directions proposées ensuite
(`docs/design/piste_nuit.md`, `piste_archive.md`, `piste_affiche.md` — gardées
pour mémoire, à ne pas reprendre telles quelles).

La cible est explicite : **la grammaire visuelle de *Reigns*, avec les matériaux
du football.** Concrètement — fond brun très sombre et chaud, texte crème dans
une monospace, quatre pictogrammes en haut qui font office de jauges (avec un
petit triangle qui indique le sens du changement), une seule illustration
vectorielle plate et géométrique au centre de la carte, un bandeau du bas qui
porte le nom et le temps passé, un unique accent rouge pour l'interface. Et ce
que ça doit sentir, mot pour mot : **le gazon, le jeu de cartes, l'histoire du
foot.**

Deux mécaniques manquantes, vues chez *Reigns* et demandées :

- **La frise** : un écran qui montre où l'on en est dans l'histoire — la
  carrière posée sur une ligne, les années, des pictogrammes pour les événements
  traversés. Elle apparaît de temps à autre, pas à la demande.
- **Le bandeau « nouvelles cartes »** : quand du contenu se débloque, une bande
  colorée l'annonce par-dessus la carte en cours.

Bonne nouvelle pour qui reprend : ce style est *dessinable en code* (SVG plat,
formes géométriques, palette courte). Il ne demande aucun générateur d'images.

## Ce qui reste connu et ouvert

- La ville : un changement de club garde le même plan de ville (seuls les noms changent) ;
  tous les rôles ont les mêmes lieux ; un logement acheté change le nom de « chez toi », pas
  sa porte ; les statistiques (physique, tactique…) de la préproduction ne sont pas
  branchées. Le match du samedi est mis en scène, mais tous à domicile, et la Coupe et le
  Grand Match restent des cartes. Les scènes de la semaine s'épuisent si le réservoir est
  court (une fois par carrière) : il en faut beaucoup, par rôle et par époque.

- Le « J » du bandeau n'affiche pas la vraie journée de championnat, et ne dit
  pas la même chose dans l'aperçu web et dans l'application.
- Après un changement de club en cours de saison, le classement de fin de saison
  n'affiche qu'une demi-saison.
- Deux budgets d'équilibrage restent hors cible et sont documentés dans
  `docs/balance/step4_variete.md` : la récurrence du président en première
  saison, et l'exposition (la part des cartes vues en dix carrières).
- Le directeur sportif (`ds`), le président (`president`) et le sélectionneur
  (`selectionneur`) sont **branchés** (`content/roles.yaml`, `calendar.yaml`,
  `content/endings/roles_bureau.yaml`, `packages/core/test/roles_test.dart`) : mêmes
  quatre jauges sous d'autres noms, leurs fins, leur calendrier (le sélectionneur vit
  l'année des fenêtres internationales, son classement est un classement de nations). Leurs
  transitions de carrière ne sont pas écrites. Le joueur amateur, le président amateur et le
  dirigeant d'instance restent dans la bible seulement.
