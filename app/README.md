# fusible_app

L'application Flutter de FUSIBLE, dans l'identité « L'album de vignettes
autocollantes » (`docs/design/album_de_vignettes.md`, maquette validée
`docs/design/maquette_album.html`).

## Lancer et vérifier

```sh
cd app
flutter analyze
flutter test                                  # parcours complet titre → fin → successeur
flutter build web --dart-define=FUSIBLE_A11Y=true   # sémantique activée pour les captures headless
```

`FUSIBLE_A11Y=true` force l'arbre de sémantique (les captures Playwright
cliquent les boutons par leur libellé) ; l'app de production n'en a pas besoin.

## Cible web : canvaskit

Le renderer web visé est **canvaskit** (le défaut de Flutter 3.27) ; le renderer
`html` est déprécié et n'est vérifié que par courtoisie. Deux règles en découlent :

- Aucun `ColorFilter` porteur de sens : les filtres SVG du renderer html
  travaillent en linearRGB et transmettent mal la 5ᵉ colonne des matrices. La
  photo N&B de la Une est donc calculée en Dart (`FusibleColors.photoGray`,
  appliqué par `Vignette(grayscale: true)` et `Portrait(grayscale: true)`),
  identique sur tous les renderers et en natif.
- Aucun glyphe hors des trois polices embarquées (Barlow Condensed, Manrope,
  Fraunces) : sous canvaskit, un caractère manquant déclenche le téléchargement
  d'une police Noto depuis le CDN Google et tombe en carré sans réseau. Les
  flèches, étoiles d'adversité (★ / ☆ du moteur) et ∞ sont tracés
  (`ArrowGlyph`, `StarGlyph`, `cardTextSpan`, `_InfinityPainter`), et chaque
  famille a les deux autres en tête de sa liste de repli (`FusibleFonts`).
  Le seul chargement réseau restant est le « Roboto » par défaut du moteur
  Flutter web, sans effet visible.
