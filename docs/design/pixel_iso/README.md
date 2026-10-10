# Le rendu pixel iso de la ville (préproduction)

Ce dossier contient le moteur qui a produit les images de la préproduction RPG :
le quartier du stade de la Rive, la ville entière en maquette, les intérieurs en
coupe et les vignettes d'évolution (logement, stade). Il n'est **pas branché**
dans le jeu : c'est l'outil de la direction artistique, en attente de validation.

## Le principe

- La ville est un volume de petits cubes (voxels). 1 voxel = 20 cm pour le
  quartier, les intérieurs et le logement ; 1 m pour les maquettes (stade, ville).
- Projection 2:1 : `u = 2(x − y)`, `v = (x + y) − 2z`. Un rayon par pixel
  descend selon −(1,1,1) dans la grille.
- Chaque pixel touché est peint par sa matière (2 texels par voxel et par axe) :
  briques appareillées, enduits, ardoises, tuiles, pavés, bitume mouillé,
  feuilles mortes, volets, enseignes en lettres de néon (police 3×5).
- Lumière : ciel ambiant, lune ou soleil avec ombres, lumières ponctuelles
  (réverbères au sodium, néons, vitrines, fenêtres, phares, projecteurs) dont
  l'intensité est quantifiée et tramée. Occlusion ambiante, reflets sur le sol
  mouillé, brume vers l'horizon, contours, halo, tramage final.
- Les personnages sont des sprites dessinés au pixel (`sprites.js`), posés dans
  le monde avec leur profondeur.
- Tout l'aléa passe par des hachages et un générateur à graine : même entrée,
  même image, au pixel près.

## Les commandes

```bash
node scene_quartier.js good night   # le carrefour du stade, la nuit
node scene_quartier.js good day     # le même, mardi 10 h
node scene_quartier.js bad night    # le même, après une saison ratée
node diorama.js                     # logement (4 étapes) et stade (4 étapes)
node interiors.js                   # vestiaire, bureau du président, laverie
node town.js                        # Aubérive entière en maquette de nuit
```

Les images sortent dans `out/` (ignoré par git). `rendus/` garde celles qui
sont sur les planches. `crop.js` et `montage.js` servent à l'inspection.

| Fichier | Rôle |
|---|---|
| `engine.js` | le monde, le rayon de vue, les ombres, la lumière, les sprites, la police, le PNG |
| `mats.js` | les matières et les calques (fenêtres, vitrines, enseignes, affiches) |
| `build.js` | les briques de construction : façades, toits, réverbères, platanes, voitures, mobilier, pylône |
| `sprites.js` | les personnages au pixel |
| `scene_quartier.js` | le quartier du stade de la Rive, le ciel de nuit et de jour |
| `diorama.js` | les vignettes flottantes : logement et stade |
| `interiors.js` | les intérieurs en coupe |
| `town.js` | la ville entière, ses lieux et leurs positions à l'écran |

## Pour la production

Le moteur pré-calcule les décors en tuiles que l'application affiche ; les
personnages sont des sprites animés à la main ; un graphiste peut modeler un
bâtiment dans un éditeur voxel et le moteur l'éclaire dans la palette du jeu.
Le portage en Dart reprend la même logique (aucune dépendance).
