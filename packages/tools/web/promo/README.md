# La promo de FUSIBLE

Des bandes-annonces d'une minute (réseaux, boutiques), l'aperçu de l'App Store, une dizaine de
captures d'écran par bande, la bannière de Google Play — tirés du vrai jeu, de ses films et de sa
musique, par une **configuration par bande** (`bandes/<id>.js`). Les sorties lourdes (vidéos,
images, captures) vont dans le dossier de travail, jamais dans le dépôt.

```
packages/tools/web/promo/
  promo.js            la ligne de commande (une commande par étape, ou `tout`)
  lib/commun.js       les chemins, les formats, les profils, Chromium, ffmpeg, la palette du jeu
  lib/tournage.js     le tournage du jeu : les moments, le temps virtuel, le vocabulaire des étapes
  lib/musique.js      la musique : le banc (banc_son.js) rend le thème, on le monte sur les mesures
  lib/cartons.js      HTML et CSS rendus par Chromium : légendes, cartons, captures, bannière
  lib/scenes.js       les scènes de ces cartons (la langue du jeu : brun, crème, la couleur du livre)
  lib/montage.js      le montage : les plans sur les mesures, les cadres, la chaîne, la livraison
  lib/ecrans.js       les captures des boutiques et la bannière
  lib/controle.js     ffprobe, le niveau sonore, le poids, les planches contact
  bandes/jeu.js       la bande du jeu, « Fusible »
  bandes/h1.js        la bande du livre 1, « Trois mille visages »
  bandes/modele_livre.js   le modèle des livres 2 à 10 (à copier) ; bandes/_livre.js le fabrique
  bandes/_communs.js  les débuts de moments partagés, les fantômes, les pièces du dossier
```

## Ce qu'il faut

- Node 22 et Playwright (`NODE_PATH=/opt/node22/lib/node_modules`), Chromium (`/opt/pw-browsers/chromium`),
  ffmpeg (libx264, aac).
- Le contenu construit (`dart run packages/tools/bin/build_content.dart`), un moteur compilé
  (`dart compile js -O2 packages/tools/web/preview.dart -o <engine.js>`) et les tuiles de la ville
  (`docs/design/pixel_iso`, voir AGENTS.md « La ville »).
- Les films : ceux de la trousse du cinéma (`cinema/tournage.js`), tournés dans les formats
  `9x16`, `16x9`, `4x5` (l'aperçu de l'App Store prend la colonne du milieu du 9:16).

## Les commandes

```bash
export NODE_PATH=/opt/node22/lib/node_modules
P=packages/tools/web/promo/promo.js
SP=/chemin/du/dossier/de/travail          # ou FUSIBLE_SP ; les sorties : $SP/agents/lot-promo

node $P site --sp $SP --engine $SP/integ/engine.js --ville $SP/build_ville/ville_grand   # la ville assemblée
node $P tourner jeu --sp $SP                 # les moments du jeu (vidéos, images fixes)
node $P musique jeu --sp $SP                 # la musique de chaque montage
node $P monter jeu --sp $SP                  # les quatre formats, vérifiés, et leurs planches
node $P ecrans jeu --sp $SP                  # les captures Apple 6,9" et Google Play
node $P banniere jeu --sp $SP                # la bannière de Google Play (si la bande en a une)
node $P tout h1 --sp $SP                     # tout, dans l'ordre
node $P verifier --sp $SP                    # relire les livrables (ffprobe, niveau, poids)
```

Les options utiles : `--moments a,b` et `--profils social,appstore,apple` (tourner une partie),
`--poses` (tourner sans vidéo : les images fixes seules, en quelques secondes — pour régler un
moment), `--formats 9x16,appstore` (monter une partie), `--force` (refaire ce qui est déjà fait ;
sinon chaque étape garde ce qui n'a pas changé : un moment, un plan, une musique ont leur empreinte).

Le temps que ça prend (mesuré sur la machine partagée, quatre cœurs, charge 20 à 27) : `tourner jeu`
18 min (treize moments, trois profils), `tourner h1` 10 min ; `musique` moins d'une minute ;
`monter`, de 7 à 10 min par format d'une minute (dont 4 à 5 min pour l'encodage final, x264
`slow`), 4 à 5 min pour l'aperçu de l'App Store ; `ecrans` une minute ; `verifier` quelques
secondes. Sur la machine partagée, chaque étape lourde (tourner, musique, monter, ecrans) passe par
le verrou des rendus : `bash $SP/rendu_verrou.sh env NODE_PATH=… node $P <commande> …` (deux rendus
lourds au plus à la fois ; il ajoute `nice -n 10`).

Ce qui sort, dans `<sortie>` (`$SP/agents/lot-promo` par défaut) :

```
site/                                   la ville assemblée (servie par le tournage lui-même)
travail/<bande>/clips/                  les moments tournés : <id>.<profil>.mp4, .json, .<pose>.png
travail/<bande>/musique/                les rendus du banc, la musique montée (<montage>.wav)
travail/<bande>/montage/                les plans rendus (mezzanine), les cartons, les cadres
livrables/bandes_annonces/<bande>.<format>.mp4
livrables/captures/<bande>/{apple,google}/NN_<légende>.png
livrables/feature_graphic.png
livrables/planches/                     une image par seconde de chaque bande, les captures en planche
livrables/rapport.json                  ffprobe, niveau, poids, écarts, pour chaque livrable
```

## Monter la bande d'un livre (2 à 10), une fois ses extraits de film tournés

Chaque réalisateur rend, pour chacun de ses deux films, un extrait de 6 à 8 s :
`$SP/agents/<branche>/extraits/<film>.{16x9,9x16,4x5}.mp4` (les branches : `lot-films-r1` livres 1
et 2, `r2` 3 et 4, `r3` 5 et 6, `r4` 7 et 8, `r5` 9 et 10). Alors :

```bash
cp packages/tools/web/promo/bandes/modele_livre.js packages/tools/web/promo/bandes/h3.js
# remplir h3.js : id, livre, index, titre, ligne, accent, theme, extraits (les deux fichiers,
# avec {format}), cartes (deux débuts d'id), lieux, légendes — le modèle dit chaque champ
node $P tourner h3 --sp $SP --poses --profils social      # régler : regarder travail/h3/clips/*.png
node $P tout h3 --sp $SP                                  # la bande, ses quatre formats, ses captures
```

Le modèle construit tout le reste (`bandes/_livre.js`) : huit moments (l'introduction jouée, la
première carte glissée, la ville le jour et la nuit, deux cartes du livre atteintes par le moteur,
le samedi à la Rive, la cartouche de l'accueil), un montage d'une minute coupé sur les mesures du
thème du livre (les extraits A et B, chacun en deux temps), l'aperçu de l'App Store (~28 s), dix
captures. Les cartes : `dart run packages/tools/bin/simulate.dart --trace <graine> --postulat
<index> --seasons 1` liste dans l'ordre celles que le moteur sert. Une bande plus fine s'écrit à
la main, comme `bandes/h1.js`.

## Une configuration de bande

```js
module.exports = {
  id: 'h1', titre: '…', livre: 'promu',            // la couleur : HISTOIRES[livre] (preview_template.html)
  accent: '#E0164B',                               // ou une couleur donnée
  disponibilite: 'Bientôt sur mobile',             // la ligne de la fin (au porteur d'en décider)
  films: { masques: '${SP}/…/trois_mille_masques.{format}.mp4' },
  moments: [ … ],                                  // ce qu'on tourne dans le jeu
  contexte: { cartouches: [ … ] },                 // ce que les cartons lisent
  montages: { long: { musique, plans }, court: { musique, plans } },
  formats: { '9x16': 'long', '16x9': 'long', '4x5': 'long', appstore: 'court' },
  ecrans: { liste: [ { legende, source: { moment, pose } | { film, t } } ] },
  banniere: { image, titre, recadre: { x, y, l }, cote: 'droite' },   // la bannière de Google Play (la bande du jeu)
};
```

Dans un chemin : `${SP}`, `${SORTIE}`, `${WEB}` (packages/tools/web), `${TRAVAIL}` (le travail de
la bande), `{format}` ; un chemin relatif part du dossier de la configuration.

### Les moments (lib/tournage.js)

Un moment, c'est le jeu amené quelque part (`prepare`, en temps réel), puis filmé (`tournage`, en
temps virtuel) dans un ou plusieurs **profils** — la fenêtre du téléphone :

| profil | fenêtre (points × échelle) | image | sert à |
|---|---|---|---|
| `social` | 393 × 699 × 2,748 | 1080 × 1920 | les bandes 9:16, 4:5, 16:9 ; les captures Google Play |
| `appstore` | 393 × 852 × 2,254 | 886 × 1920 | l'aperçu de l'App Store (un iPhone 6,9") |
| `apple` | 430 × 932 × 3 | 1290 × 2796 | les captures Apple (images fixes seules) |

**Le temps virtuel.** La ville bouge par `requestAnimationFrame` et des minuteries, ses panneaux
par des transitions CSS. Au tournage, l'horloge de la page est arrêtée (`page.clock`) et avance de
33, 33, 34 ms par image ; les animations CSS sont figées et avancent du même pas
(`document.getAnimations()`). Chaque image est donc juste, quelle que soit la charge de la machine :
30 images par seconde régulières. Mesuré ici (quatre cœurs partagés avec cinq tournages de films) :
de 100 à 270 ms par image capturée à 1080 × 1920, soit trois à neuf fois le temps réel ; la capture
en direct (CDP screencast) n'y tient pas 30 i/s. Une attente, au tournage, se compte donc en images
(`attendre`, `attendreQue`) : une attente de Playwright n'y verrait rien bouger.

Les étapes (une étape : `[nom, …arguments]`) :

| étape | ce qu'elle fait |
|---|---|
| `['attendre', s]` | le temps passe (en images au tournage) |
| `['attendreQue', 'cond', max]` | jusqu'à ce que la condition (JS, sur `etat` — etatJeu — ou `window`) soit vraie |
| `['demarrer', index, graine]` | un livre (FusibleApercu.demarrer) |
| `['introPasser']` · `['scene', n]` | passer l'introduction jouée · l'avancer de n répliques, au rythme d'un lecteur |
| `['attendreCarte']` · `['glisser', 'gauche'\|'droite', { duree, ampleur, tenue, lacher, pose }]` · `['repondre', sens]` | une carte : l'attendre, la glisser au doigt (un rond crème le montre), y répondre sans geste |
| `['avancer', 'cond sur v, g', { reponses, saute, gestes }]` | le moteur seul, carte après carte, jusqu'à la carte voulue (`v.card.id`, `v.card.beatKind`, `v.blocs` ; `g` : les cartes jouées) ; `gestes` : les activités de la ville faites avant chaque carte (`[['vi_marcel_demi', 'presse_trois'], …]`, le lien et l'habitude : le carnet se remplit) ; la ville reprend l'état |
| `['jouerJusqua', 'cond', { max, reponses }]` | l'automate (temps réel) : scènes, rendez-vous, « Attendre », films passés |
| `['aller', lieu]` · `['allerLieu', lieu]` · `['sortir']` · `['fermerPorte']` | sauter à la porte d'un lieu · y aller comme le joueur · quitter la pièce · refermer le panneau |
| `['tranche', 'nuit']` · `['jour', 'sam']` · `['semaine', n]` · `['zoom', 1–4]` | l'heure, le jour, la semaine, la vue |
| `['touche', 'ArrowDown', n, intervalle]` · `['marcher', dx, dy]` | marcher (six cases par flèche) · toucher la ville à côté du héros |
| `['toucherPassant']` · `['parler', id]` | un passant s'arrête et parle (sa bulle) |
| `['match', 'V N D…']` · `['chapitre']` · `['carnet']` | le match mis en scène · la Une de la semaine · le carnet |
| `['album']` · `['dossier']` · `['carrieres']` · `['eclair', 'jour']` | les panneaux de l'accueil, le Fusible |
| `['cliquer', sel, { facultatif }]` · `['toucher', x, y]` · `['defiler', sel\|y, { duree, marge }]` | toucher un élément (le doigt au tournage), un point, défiler |
| `['pose', nom]` · `['poseElement', sel, nom]` | une image fixe (les captures), celle d'un élément seul (une cartouche) |
| `['eval', 'js']` · `['cacher', sel]` · `['filmPasser']` | du JS dans la page ; masquer un bandeau ; passer un film du cinéma |

Un moment peut aussi porter `heure` (l'horloge de la page : le panorama de l'accueil), `heros`
(`{ prenom, nom, genre }`), `profil` (le profil du joueur : `{ runs, recompenses }`), `stockage`
(des clés de localStorage : les fantômes).

### Les montages (lib/montage.js, lib/musique.js)

La musique fait le temps. `musique: { theme, morceaux: [{ depuis: section|null, de, a }], fondu:
{ entree, sortie }, niveau: -14, crete: -1 }` : chaque morceau est un rendu du banc depuis une
section, coupé sur ses barres de mesure `[de, a[` ; les morceaux se suivent (une collure de 40 ms).
Le niveau : −14 LUFS intégrés, la vraie crête sous −1 dBTP (un limiteur, puis la mesure EBU R128).

Un plan dure `'2m'` (mesures), `'3t'` (temps) ou des secondes, et `'reste'` pour le dernier. Ses
champs :

| champ | |
|---|---|
| `source` | `{ moment, de, vitesse, bande }` (de : secondes, ou `{ pose, avant }` — tant de secondes avant une pose du tournage) · `{ film, de }` · `{ carton: 'titre'\|'livres'\|'fin'\|'image', … }` · `{ noir: true }` |
| `cadre` | par format : `'plein'` (la fenêtre du format dans l'image, `{ mode: 'plein', x, y, zoom }`) ou `'ecran'` (l'écran entier du téléphone, ses coins ronds, sur son propre flou ; jamais étiré) |
| `legende` | `{ titre, sous, sur, position, style: 'panneau'\|'nu'\|'neon', taille, de, a }` ; une valeur peut dépendre du format (`{ '16x9': 'droite', defaut: 'haut' }`) |
| `entree` · `sortie` | `'coupe'` (défaut), `'fondu'` (enchaîné, `transition` s), `'noir'`, `'flash'` (`couleurFlash`) |

Les légendes restent dans les marges sûres (`FORMATS` de lib/commun.js) : en 9:16, rien dans les
10 % du haut ni les 20 % du bas (l'interface des réseaux), ni les 13 % de droite ; un titre en
Jersey 15 à 86 px pour 1080 de large.

### La livraison (lib/controle.js)

| format | taille | vidéo | son |
|---|---|---|---|
| `9x16` | 1080 × 1920, 30 i/s | H.264 High 4.1, yuv420p, BT.709, CRF 23, ≤ 1,75 Mbit/s | AAC 192 kbit/s, 48 kHz stéréo |
| `16x9` | 1920 × 1080, 30 i/s | idem | idem |
| `4x5` | 1080 × 1350, 30 i/s | CRF 23, ≤ 1,4 Mbit/s | idem |
| `appstore` | 886 × 1920, 30 i/s, 15 à 30 s | H.264 High 4.0, CRF 20, ≤ 9 Mbit/s | AAC 256 kbit/s, 48 kHz stéréo |

Tous : `+faststart`, −14 LUFS, vraie crête ≤ −1 dBTP ; ≤ 15 Mo par minute pour les réseaux. Chaque
livrable est relu (ffprobe, le niveau mesuré sur le fichier, l'ordre des atomes) et ses écarts vont
au rapport. Les captures sont des PNG RGB sans alpha (Apple les refuse avec) ; Apple en prend dix
par taille d'écran, Google Play huit pour un téléphone : l'ordre de la liste est celui de la page, les
huit premières tiennent seules. `verifier` relit aussi les captures (taille, alpha) et la bannière.

## Les règles

- Rien de réel : aucun club, joueur, dirigeant, marque, compétition, groupe, morceau, ni jeu ; on
  ne cite pas d'autre jeu dans un texte.
- Aucune promesse qu'on ne peut tenir : ni prix, ni note, ni prix reçu, ni date ; la ligne de
  disponibilité (`disponibilite`) est dans la configuration, « Bientôt sur mobile » par défaut.
- Les textes en français, courts, au neutre (« tu », l'infinitif) ; rien de ce qu'un livre garde
  pour sa fin (le dossier 1974 ne montre que ses premières pièces ; jamais l'ardoise).
- L'aperçu de l'App Store ne montre que le jeu (ses écrans, ses films), sans cadre d'appareil.
