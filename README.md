# FUSIBLE

Un jeu mobile façon *Reigns*, basé sur le football : une carte, un pouce, gauche
ou droite, quatre jauges à tenir entre le vide et le trop-plein, et le jour où
l'une déborde, on est viré. On incarne au hasard un joueur ou un entraîneur, on
monte, on chute, on change de métier au fil des saisons ; le monde persiste et
le successeur reprend là où l'on a été viré. Chronologie à partir des années 90.

Le brainstorm et la bible de design complets sont dans [`docs/brainstorm`](docs/brainstorm/README.md).
Ce dépôt contient le **MVP** (deux rôles : Joueur pro et Entraîneur, en français).

## Architecture

Le jeu est à 90 % une application de lecture et de geste, piloté par des données.
Cœur de règles **déterministe** en Dart pur ; tout le contenu est en YAML compilé
en JSON ; l'interface est en Flutter (design final délégué à une passe dédiée).

```
packages/core/     # moteur déterministe, pur Dart (aucun Flutter, aucune I/O)
packages/tools/    # build_content, lint, simulate (Monte-Carlo)
content/           # source YAML (rôles, calendrier, cartes, fins…) → build/content.json
app/               # application Flutter
docs/brainstorm/   # bible de design (11 sections)
```

Le déterminisme est le socle du social : « même graine + mêmes choix » reproduit
un run à l'identique, ce qui rend le *Code de Carrière*, le défi du jour et le
duel entre amis possibles **sans serveur**.

## Développer (cœur + outils, sans Flutter)

Prérequis : le SDK Dart (`^3.6`).

```bash
dart pub get                              # résout le workspace (core + tools)
dart run fusible_tools:build_content      # content/*.yaml -> content/build/content.json
dart run fusible_tools:lint               # valide tags, drapeaux, noms, longueurs
dart run fusible_tools:simulate --runs 5000   # équilibrage Monte-Carlo
dart test packages/core                   # déterminisme, round-trip, bornes des jauges
```

`build_content` compile chaque condition `when` en AST et résout les magnitudes
symboliques (`+`/`++`/`+++`) via `content/balance.yaml`. `simulate --assert`
échoue si un budget est violé (durée médiane, cause de mort dominante, run trop long).

## Lancer l'application (Flutter)

```bash
cd app
flutter pub get
flutter run          # un appareil / émulateur, ou -d chrome pour le web
```

L'app charge `content/build/content.json` (générer d'abord avec `build_content`).

## État

MVP jouable de bout en bout : boucle de saison en six actes, Cartes Match, Grand
Match en direct, Bilan, objectifs et Parole (Grand Déballage), transitions de
carrière (joueur → entraîneur), 19 fins écrites avec épitaphes, Succession,
Code de Carrière. Le contenu (cartes) et le polish visuel sont en cours
d'étoffement. Langue : français (l'anglais viendra en version finale).
