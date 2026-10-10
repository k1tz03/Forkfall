# Le rendu pixel iso de la ville (préproduction)

Ce dossier contient le moteur qui a produit les images de la préproduction RPG :
la zone jouable d'Aubérive (six quartiers autour du stade), le quartier du stade
de la Rive, la ville entière en maquette, les intérieurs en coupe, les vignettes
d'évolution (logement, stade), les figurines du casting et les cases du
storyboard. Il n'est **pas branché** dans le jeu : c'est l'outil de la direction
artistique, en attente de validation.

## Le principe

- La ville est un volume de petits cubes (voxels). 1 voxel = 20 cm pour la zone,
  les quartiers, les intérieurs et le logement ; 1 m pour les maquettes (stade,
  ville) ; 4 cm pour les figurines.
- Projection 2:1 : `u = 2(x − y)`, `v = (x + y) − 2z`. Un rayon par pixel
  descend selon −(1,1,1) dans la grille.
- Chaque pixel touché est peint par sa matière (2 texels par voxel et par axe) :
  briques appareillées, enduits, ardoises, tuiles, pavés, bitume mouillé,
  feuilles mortes, volets, enseignes en lettres de néon (police 3×5).
- Lumière : ciel ambiant, lune ou soleil avec ombres, lumières ponctuelles
  (réverbères au sodium, néons, vitrines, fenêtres, phares, projecteurs) dont
  l'intensité est quantifiée et tramée. Occlusion ambiante, reflets sur le sol
  mouillé et sur la rivière, brume vers l'horizon, contours, halo, tramage final.
- Quatre heures (`presets.js`) : la nuit, l'aube, le jour, le crépuscule ; et deux
  humeurs : la bonne saison et la mauvaise (rideaux baissés, néons éteints, tags).
- Une vue de jeu coupe ce qui est derrière le personnage (un plan de coupe en
  `x + y`) et le noie dans la brume : chaque écran a son horizon et la skyline
  de la Capitale au fond.
- Les personnages sont des sprites dessinés au pixel (`sprites.js`), posés dans
  le monde avec leur profondeur.
- Tout l'aléa passe par des hachages et un générateur à graine : même entrée,
  même image, au pixel près.

## La zone jouable

`zone.js` assemble 1 000 × 1 000 voxels (200 m de côté) : le maître pose le sol,
les rues, la Rive (lit, quais, bas-port, péniche, pont de pierre, passerelle),
puis place le quartier du stade et les six quartiers, chacun dans son fichier :

| Fichier | Quartier | Place (x, y) | Taille |
|---|---|---|---|
| `district_vieilleville.js` | la vieille ville, au nord de la rivière | 0, 0 | 1000 × 226 |
| `scene_quartier.js` | le carrefour du stade de la Rive | 330, 420 | 340 × 340 |
| `district_sport.js` | le terrain annexe, le centre de formation | 708, 420 | 292 × 156 |
| `district_sante.js` | la muscu, le Doc, la banque | 708, 628 | 292 × 132 |
| `district_cimetiere.js` | le cimetière | 0, 420 | 292 × 156 |
| `district_friche.js` | l'ancienne usine | 0, 628 | 292 × 132 |
| `district_residentiel.js` | la rue de l'appartement, l'école, la gare routière | 0, 812 | 1000 × 188 |

Un quartier exporte `{ w, h, seed, build(W, ctx) }` et dessine en coordonnées
locales ; `district_exemple.js` est le modèle, `district_test.js` le banc d'essai
d'un quartier seul.

## Les commandes

```bash
node zone.js night good full          # la zone : six écrans de contrôle (+ l'image entière avec « full »)
node zone_shots.js                    # la vue d'ensemble et un écran par quartier, pour la planche
node story_frames.js                  # les douze cases du storyboard
node phone_frames.js                  # les fonds des écrans « carte » et « entraînement »
node figurines.js                     # les douze figurines du casting
node scene_quartier.js good night     # le carrefour du stade seul (good|bad, night|day)
node diorama.js                       # logement (4 étapes) et stade (4 étapes)
node interiors.js                     # vestiaire, bureau du président, laverie
node town.js                          # Aubérive entière en maquette de nuit
node district_test.js district_sport.js day   # un quartier seul sur son socle
```

Les images sortent dans `out/` (ignoré par git). `rendus/` garde celles qui
sont sur les planches. `crop.js` et `montage.js` servent à l'inspection.

| Fichier | Rôle |
|---|---|
| `engine.js` | le monde, le rayon de vue, les ombres, la lumière, les reflets, les sprites, la police, le PNG |
| `mats.js` | les matières et les calques (fenêtres, vitrines, enseignes, affiches) |
| `build.js` | les briques de construction : façades, toits, réverbères, platanes, voitures, mobilier, pylône, le car du club |
| `presets.js` | les quatre éclairages communs (nuit, aube, jour, crépuscule) |
| `sprites.js` | les personnages au pixel |
| `scene_quartier.js` | le quartier du stade de la Rive, le ciel de nuit et de jour |
| `zone.js` | la zone jouable : le maître, la rivière, les ponts, la pose des quartiers, les vues de jeu |
| `district_*.js` | les quartiers de la zone |
| `diorama.js` | les vignettes flottantes : logement et stade |
| `interiors.js` | les intérieurs en coupe, dont ceux du storyboard |
| `figurines.js` | les figurines du casting (1 voxel = 4 cm) |
| `town.js` | la ville entière, ses lieux et leurs positions à l'écran |
| `story_frames.js`, `zone_shots.js`, `phone_frames.js`, `sprite_png.js` | les images des planches |

## Pour la production

Le moteur pré-calcule les décors en tuiles que l'application affiche ; les
personnages sont des sprites animés à la main ; un graphiste peut modeler un
bâtiment dans un éditeur voxel et le moteur l'éclaire dans la palette du jeu.
Le portage en Dart reprend la même logique (aucune dépendance).
