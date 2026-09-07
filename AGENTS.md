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
| Contenu | 1 364 cartes, 74 intrigues, 42 fins, 148 Nouvelles datées, 241 manchettes de Une, 173 variantes de set-piece |
| Rôles jouables | entraîneur, joueur (4 postulats de départ) |
| Moteur | Dart pur, déterministe, 99 tests, 20 goldens |
| Qualité | `dart analyze` propre, `lint` 0 erreur 0 avertissement |
| Bible narrative | `docs/bible/`, 13 chapitres, 565 000 mots |
| Design | **c'est le chantier ouvert** — voir plus bas |

## L'arborescence

```
packages/core/     moteur déterministe, Dart pur (aucun Flutter, aucune I/O)
packages/tools/    build_content, lint, simulate, et l'aperçu web (web/)
content/           la source YAML → content/build/content.json
app/               l'application Flutter
docs/brainstorm/   la bible de conception (11 sections) — le pourquoi
docs/bible/        la bible scénaristique (13 chapitres) — la matière écrite
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
cd packages/core && dart test                    # 99 tests
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

## Comment on ajoute du contenu

La bible (`docs/bible/`) est la matière écrite ; son `README.md` § 3 est la table
de conversion scène → YAML, champ par champ. En résumé : une intrigue est un arc
(`content/arcs/<rôle>/<mot>.yaml`) qui enchaîne des étapes, chaque étape cite une
carte (`content/cards/<rôle>/*.yaml`), et le postulat déclare dans son
`programme` (`content/postulats.yaml`) dans quel « bucket » de saison l'intrigue
peut être tirée, avec quel poids.

Les contrats que le lint fait respecter : un libellé de bouton ≤ 28 caractères,
un texte ≤ 200, une trace posée est lue quelque part, une fin déclarée a une
porte, `{toi}` exige que le locuteur ait une `adresse`, une réaction ne se pose
pas sur une carte de routine.

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

- Le « J » du bandeau n'affiche pas la vraie journée de championnat, et ne dit
  pas la même chose dans l'aperçu web et dans l'application.
- Après un changement de club en cours de saison, le classement de fin de saison
  n'affiche qu'une demi-saison.
- Deux budgets d'équilibrage restent hors cible et sont documentés dans
  `docs/balance/step4_variete.md` : la récurrence du président en première
  saison, et l'exposition (la part des cartes vues en dix carrières).
- Les rôles directeur sportif, président, sélectionneur et dirigeant d'instance
  sont **écrits** dans la bible mais **pas branchés** dans le moteur
  (`content/roles.yaml` n'en connaît que deux).
