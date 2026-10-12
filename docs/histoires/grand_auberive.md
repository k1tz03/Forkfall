# Le Grand Aubérive — les quartiers autour de la ville

Retour du porteur (octobre 2026), sur le plan :

> « Je trouve dommage que l'on ait un carré avec la carte et qu'autour il n'y ait rien. On ne
> pourrait pas proposer d'autres quartiers, avec de la diversité — gratte-ciel, campagne, etc. —
> que l'on débloquerait plus tard ? Le fond actuel ne me plaît pas. »

La ville d'aujourd'hui (200 m de côté, sept quartiers autour du stade de la Rive) devient le
**centre** d'un monde plus grand. Quatre quartiers l'entourent, chacun avec son caractère, ses
lieux et ses gens. Ils s'ouvrent au fil de la carrière. Au-delà, il n'y a plus de vide : le
paysage continue jusqu'à l'horizon.

## Le plan du monde

Le monde fait **1 800 × 1 800 voxels** (360 m), au même voxel que la ville (20 cm).

- **Le centre.** La ville actuelle est posée telle quelle à l'origine **(400, 400)** ; elle occupe
  `[400, 1400[²`.
- **Le boulevard de ceinture.** Il fait le tour du centre, sur 36 voxels de large : un trottoir de
  6, une chaussée de 24, un trottoir de 6. Il passe la Rive sur deux ponts.
  - Sa bande nord : `y ∈ [364, 400[`, `x ∈ [364, 1436[`.
  - Sa bande sud : `y ∈ [1400, 1436[`, même `x`.
  - Ses bandes ouest et est : `x ∈ [364, 400[` et `x ∈ [1400, 1436[`, `y ∈ [364, 1436[`.

  C'est le maître (`zone.js`) qui le dessine. Toutes les sorties à pied de la ville actuelle y
  débouchent. Il est toujours ouvert.
- **Les quatre quartiers.** Ce sont quatre rectangles, chacun dans son fichier
  `district_<clé>.js`, en coordonnées locales comme les autres quartiers :

| Quartier | Fichier | Rectangle (monde) | Taille (w × h) | Côté du losange | Hauteur permise |
|---|---|---|---|---|---|
| **Les Hauts**, le quartier d'affaires | `district_hauts.js` | x 0 – 1800, y 0 – 364 | 1800 × 364 | en haut à droite (au fond) | tours jusqu'à **220** voxels (44 m) |
| **Les Tilleuls**, la cité | `district_tilleuls.js` | x 0 – 364, y 364 – 1436 | 364 × 1072 | en haut à gauche (au fond) | barres et tours jusqu'à **170** |
| **Le port de la Rive** | `district_port.js` | x 1436 – 1800, y 364 – 1436 | 364 × 1072 | en bas à droite (devant) | **60** près de la ceinture (x local < 150), **130** pour une grue au-delà |
| **La campagne** | `district_campagne.js` | x 0 – 1800, y 1436 – 1800 | 1800 × 364 | en bas à gauche (devant) | **50** (le clocher : 80) |

**Pourquoi ces hauteurs.** La caméra regarde de `+x+y` vers `−x−y`. Ce qui a un petit `x + y`
est au fond de l'image et ne cache jamais le centre : c'est là que montent les tours, au nord et
à l'ouest. Le port et la campagne sont devant : un immeuble haut y cacherait la ville derrière
lui, alors ils restent bas.

**La Rive.** Elle coule le long de `x`, l'eau à `y ∈ [690, 756[` (monde). Elle traverse les
Tilleuls et le port, l'eau à `y` local `[326, 392[` dans les deux. Le maître pose d'abord son
couloir (`couloirRive` dans `zone.js`), de `y` local 270 à 448 :
- la route du quai nord, de 270 à 298 ;
- la promenade nord, de 306 à 322 ;
- le mur du quai, de 322 à 326 ;
- l'eau, de 326 à 392 ;
- le mur du quai, de 392 à 396 ;
- la promenade sud, de 396 à 412 ;
- la route du quai sud, de 420 à 448.

Le quartier bâtit autour. Il peut y poser un pont, des pontons, un bassin, transformer une
promenade en quai de déchargement. Deux conditions : l'eau reste continue d'un bord à l'autre,
et l'une des deux routes des quais reste praticable de bout en bout.

**Au-delà du monde**, le paysage continue : champs, haies, bois, la route, la Capitale à
l'horizon. Le fond est peint par le moteur (le ciel et le sol lointain). Le bord extérieur d'un
quartier (`y = 0` pour les Hauts, `x = 0` pour les Tilleuls, `x = 1800` pour le port,
`y = 1800` pour la campagne) doit donc s'y fondre : pas de mur, pas de socle, mais un talus, une
lisière, une voie rapide, des champs qui continuent.

## Les quatre quartiers

### Les Hauts — le quartier d'affaires (au nord, derrière la vieille ville)

L'argent de la télévision, les sponsors, les avocats, les agents : là où le football se vend.
Il y a des tours de verre et de béton sur une dalle, un parvis venteux, des parkings, des
enseignes lumineuses la nuit, des fenêtres de bureaux allumées tard. C'est l'autre visage
d'Aubérive, celui qui regarde la vieille ville de haut.

**Lieux** (clé, nom affiché) :
- `tour_ecran`, « La tour Écran » : le siège de la chaîne de télévision (les plateaux, les
  droits).
- `tour_dalmene`, « La tour Dalmène » : le siège d'un assureur qui sponsorise le club.
- `hotel_imperial`, « L'Impérial » : le palace, où se signent les transferts.
- `galerie_hauts`, « La galerie des Hauts » : un passage de boutiques de luxe.
- `cabinet_verdier`, « Le cabinet Verdier » : les avocats.
- `table_hauts`, « La Table des Hauts » : le restaurant où l'on dîne avec le président.
- `parvis`, « Le parvis » : la dalle, sans porte.

### Les Tilleuls — la cité (à l'ouest, derrière le cimetière et la friche)

Des barres et des tours des années soixante, des pelouses pelées, des parkings, des tilleuls. Il
y a le city-stade grillagé où jouent les gamins (les talents de demain), la maison de quartier,
une supérette, un snack, un club de boxe. La Rive passe au milieu, avec une passerelle taguée.
C'est vivant le soir : des fenêtres à toutes les hauteurs, des scooters, des bancs.

**Lieux :**
- `city_stade`, « Le city-stade » : sans porte ; on s'y tient au bord du grillage.
- `maison_quartier`, « La maison de quartier ».
- `snack_tilleuls`, « Le Snack des Tilleuls ».
- `superette`, « La supérette ».
- `club_boxe`, « Le club de boxe ».
- `salon_tilleuls`, « Le salon des Tilleuls » : le coiffeur.
- `tour_c`, « La tour C » : le hall d'entrée, les boîtes aux lettres.

### Le port de la Rive (à l'est, devant le terrain annexe et la santé)

La Rive s'élargit en bassin. Il y a des quais de déchargement, des entrepôts de tôle, des
conteneurs, une ou deux grues, un silo, des péniches amarrées, des voies ferrées dans le pavé. On
y trouve le relais des routiers ouvert la nuit et une casse automobile. C'est le quartier des
histoires noires : on y décharge ce qu'on ne déclare pas.

**Lieux :**
- `docks`, « Les docks » : sans porte ; le bord du quai.
- `entrepot_7`, « L'entrepôt 7 ».
- `relais_routiers`, « Le Relais des routiers ».
- `casse`, « La casse ».
- `capitainerie`, « La capitainerie ».
- `guinguette`, « La guinguette » : une péniche-bar, ou une cabane sur le quai.

### La campagne (au sud, devant la rue des Lilas)

La ville s'arrête d'un coup : des champs, des haies, un chemin de terre, une ferme, un verger,
un étang. Il y a le centre d'entraînement du club « au vert » (la mise au vert avant les grands
matchs), un manoir derrière ses grilles, un stade de village avec sa tribune de bois et son
auberge. Le jour est doré, la nuit noire, avec quelques lumières isolées.

**Lieux :**
- `ferme`, « La ferme Soulié ».
- `centre_vert`, « Le centre du Bois-Joli » : le centre d'entraînement.
- `manoir`, « Le manoir de la Motte ».
- `etang`, « L'étang » : sans porte ; le ponton.
- `stade_village`, « Le stade du village » : sans porte ; la main courante.
- `auberge`, « L'auberge du Relais ».

## Quand un quartier s'ouvre

Au début, seuls le centre et le boulevard de ceinture sont ouverts. Un quartier fermé reste
visible, mais sous la brume : sur la ville comme sur le plan, avec son nom et ce qui l'ouvrira.
On ne peut pas y entrer. Il s'ouvre au premier des cas suivants :

| Quartier | Ce qui l'ouvre |
|---|---|
| Les Tilleuls | la 4ᵉ semaine de la carrière ; ou un drapeau d'histoire `quartier_tilleuls` |
| Le port | la 8ᵉ semaine ; ou `quartier_port` |
| Les Hauts | l'ouverture de la 2ᵉ saison (« les tours sont inaugurées ») ; ou `quartier_hauts` |
| La campagne | un véhicule (voiture ou moto, la boutique) ; ou la 12ᵉ semaine ; ou `quartier_campagne` |

L'ouverture est un moment. La brume se lève d'un fondu, avec une ligne : « Les Tilleuls :
le boulevard de ceinture ne s'arrête plus là. ». Le plan se met à jour, et une scène ou une carte
peut y attendre.

## Le contrat de modélisation (pour qui modèle un quartier)

**Le module.** Il suit `district_exemple.js` :

```js
module.exports = {
  w, h, seed,
  zmax,        // la hauteur de monde qu'il lui faut : 230 pour les Hauts, 180 pour les Tilleuls, 140 pour le port
  riviere,     // y local de l'eau, pour les Tilleuls et le port : 326
  build(W, ctx) { /* … */ return { places: [{ key, label, x, y, z }] }; },
};
```

Le quartier dessine en coordonnées locales. `ctx` donne `{ w, h, night, time, mood, R, G }` ;
`G = 2` est le dessus du trottoir.

**Ce qu'il dessine.** Il dessine tout son rectangle : le sol, ses rues, ses trottoirs, ses
bâtiments, ses arbres, ses lumières. Le maître ne pose qu'un trottoir partout (le dessus à
`z = 2`) et, pour les Tilleuls et le port, le couloir de la Rive.

**Les raccords.** On doit pouvoir marcher depuis le boulevard de ceinture :
- **Le bord qui touche la ceinture** doit être praticable en au moins **six** endroits répartis
  sur sa longueur, un trottoir ou une rue qui y arrive. Ce bord est `y = 363` local pour les
  Hauts, `y = 0` pour la campagne, `x = 363` pour les Tilleuls et `x = 0` pour le port.
- **Chaque lieu** s'atteint à pied depuis ce bord.

  Une case de marche fait 4 × 4 voxels. Une colonne est praticable si son sol est à hauteur de
  rue (`z` local 0 à 3, le trottoir est à 2) et si deux mètres au-dessus (10 voxels) sont libres.
  L'eau ne l'est pas. Une marche de 1 se monte ; un perron de 3 aussi ; un quai de déchargement à
  `z` 8 ne se monte pas.

**Les lieux.** `places.push({ key, label, x, y, z })` : `(x, y)` est la porte, sur le trottoir
devant la façade, et `z = G + 12` comme dans les autres quartiers. Un lieu sans porte (le
city-stade, les docks, l'étang, le stade du village, le parvis) donne le point où l'on se tient.
Les clés et les noms sont ceux de la liste du quartier, sans en ajouter ni en retirer. La porte
dessinée (un perron, une enseigne, une lumière la nuit) doit se reconnaître à l'écran.

**La lumière.** La nuit, le quartier vit : des fenêtres allumées en nombre (tirées de `ctx.R`,
jamais toutes), des enseignes, des réverbères, des phares.
- Les lumières ponctuelles coûtent cher au rendu, parce que chaque pixel les parcourt toutes.
  Pas plus de **250** `W.light` par quartier ; pour les fenêtres, préférer `state: 'lit'` sans
  `spill`.
- Les deux humeurs (`mood: good|bad`) changent les détails : rideaux baissés, tags, enseignes
  éteintes.

**Les matières.** Le moteur en tient 255, et la ville en prend 136. Un quartier en crée **au
plus 20** (`material()` dans son fichier) et réutilise d'abord celles de `mats.js` et des autres
quartiers.

**Les noms.** Tout est inventé : enseignes, marques, chaînes de télévision, clubs. Aucun nom réel
de club, de joueur, de marque ou de compétition, nulle part, pas même sur une affiche. Pas
d'objet d'une seule époque non plus : pas d'écran géant à tel âge, pas de téléphone. Le quartier
sert de 1990 à 2050.

**Le banc d'essai.**

```bash
node district_test.js district_hauts.js day          # tout le quartier, et un écran de jeu au centre
node district_test.js district_hauts.js night good 900 300   # un écran de jeu en (900, 300) local
```

Viser **moins de 5 minutes** pour le rendu de nuit du quartier entier au banc d'essai. Un
quartier lent rend la ville lente : le monde entier se rend en une passe.

**Ce qu'on livre** :
- le fichier `district_<clé>.js` ;
- trois rendus de contrôle (jour, nuit, un écran de jeu) ;
- la liste des lieux avec leurs portes ;
- les matières créées.

## Où on en est (octobre 2026)

Les quatre quartiers sont modelés (`district_hauts.js`, `district_tilleuls.js`, `district_port.js`,
`district_campagne.js`, un fichier par auteur) et assemblés par `zone.js` (`buildZone({grand: true})`) :
la ville en (400, 400), le boulevard de ceinture et ses deux ponts, le couloir de la Rive dans les
Tilleuls et le port. Le monde entier se construit en six secondes et tient 2,4 Go ; chaque lieu des
quartiers s'atteint à pied depuis la ville (vérifié sur la grille de marche).

- **Le fond** (`fond.js`) remplace le sol beige et le ciel : le sol continue à la hauteur du trottoir
  (des champs en lanières dans les matières du monde, des haies, des bois, quelques fermes), ce qui
  touche un bord du monde continue tout droit (`W.bords` : la voie rapide des Hauts, la Rive et ses
  routes de quai, la voie ferrée des Tilleuls, la départementale et le ruisseau de la campagne), et
  au fond la brume, les collines, la Capitale. Le moteur efface la tranche du monde (`bordMonde`).
- **Les images** : 7 240 × 3 940 pixels par heure, 32 tuiles ; les lumières du moteur sont rangées
  par cases (même image au bit près, un rendu de nuit trois fois plus rapide). La brume de chaque
  quartier est rendue avec la ville (`brume_<clé>.png`, au quart : ce qu'on voit du quartier, tours
  comprises).
- **La page** (`ville_quartiers.js`) : la brume d'un quartier fermé, son nom et ce qui l'ouvrira dans
  la brume qu'on regarde ; on n'y marche pas ; ses lieux, ses scènes et ses conversations se taisent,
  sur le plan aussi ; à l'ouverture, la brume se lève en fondu et la phrase du quartier s'écrit. Une
  partie sauvée avant le Grand Aubérive glisse de (400, 400).
- **Le contenu** : les 26 lieux (`content/ville/grand_auberive.yaml`) ; la vie de chaque quartier (ses
  activités, ses gens, ses scènes, ses paroles) dans `content/ville/quartier_<clé>.yaml`, et leurs
  cartes de palier dans `content/cards/common/paliers_ville_<clé>.yaml` : 14 personnes aux Hauts, 14
  aux Tilleuls, 12 au port, 12 à la campagne, deux par lieu (celle de 1990, puis celle qui reprend),
  110 activités, 167 scènes. Celui qui tient un lieu sans pièce se tient devant, et on le touche.
  Une scène ou une conversation n'est jamais programmée dans un quartier fermé : les lots ne
  portent pas de garde `semaine >=` ou `saison >=` pour le verrou, et un drapeau `quartier_<clé>`
  posé par une histoire ouvre le quartier avec tout ce qui s'y passe.
