# Les cinématiques — la trousse du cinéma

Ce document suffit pour réaliser un film : la langue visuelle, la trousse (son API),
le gabarit d'un film, le déclencheur, le tournage, les budgets et la livraison. Le film
de référence est « Trois mille masques » (livre 1, `cinema/films/trois_mille_masques.js`) :
quand une question n'a pas de réponse ici, sa réponse est dans ce fichier.

Le porteur : « des cinématiques vivantes, pas forcément avec le moteur du jeu : en 3D
animée, léchées, textures fines ». Les mêmes images nourrissent les bandes-annonces
d'une minute et les vidéos des boutiques.

**La règle qui ne se négocie pas** vaut ici comme partout : aucun nom réel de club, de
joueur, de dirigeant, de marque ou de compétition — ni dans un texte, ni sur une
enseigne, un panneau, un maillot, une affiche ou une texture peinte.

## 1. En une page

```
packages/tools/web/cinema/
  lecteur.js            le lecteur (window.FusibleCinema) : toujours dans la page, petit
  kit/00_base.js …      la trousse (window.FusibleCinema.kit), chargée au moment de jouer
  films/<id>.js         un film par fichier ; il se déclare avec id: "<id>"
  tournage.js           l'outil de tournage : les vidéos, les affiches, la planche
  lier_three.js         refait vendor/three/fusible-three.js (three.js r186 + ses passes)
  polices/              Jersey 15 et Space Mono (OFL), pour le tournage
packages/tools/web/vendor/three/   three.js (MIT, sa LICENSE), les modules et le paquet
packages/tools/web/ville_film.js   les films dans la ville (un module de ville.js)
packages/tools/web/preview_film.js les films sans la ville (un module de l'aperçu)
content/ville/films_<livre>.yaml   QUAND un film se joue (validé par build_content)
```

Réaliser un film, dans l'ordre :

1. Lire le livre (son chapitre de `docs/histoires/00_les_dix_histoires.md`, ses cartes,
   ses scènes jouées) et la charte (`docs/bible/charte_histoire.md`). Le film ne devance
   rien : il montre ce que le joueur sait déjà, ou ce que le livre dit à cet endroit.
2. Copier le gabarit (§ 5) dans `cinema/films/<id>.js`, écrire les décors et les plans.
3. Déclarer le déclencheur dans `content/ville/films_<livre>.yaml` (§ 6), puis
   `dart run packages/tools/bin/build_content.dart` et `lint.dart` (0 erreur).
4. Tourner un brouillon et regarder la planche (§ 8) ; recommencer jusqu'à ce que ce
   soit beau — la lumière, la matière, le cadre, le mouvement, plan par plan.
5. Tourner les quatre formats (§ 8), vérifier les tailles (§ 10), jouer le film dans
   le jeu (§ 7) aux deux tailles de téléphone.

## 2. La langue visuelle (les réglages par défaut de la trousse)

- **Un court néo-noir animé.** La nuit, la pluie, le sodium et le néon, les reflets
  mouillés, la fumée, les projecteurs. Le jour existe, mais il est gris, bas, de biais.
- **La couleur du livre est la lumière d'accent** (`HISTOIRES` du gabarit de l'aperçu,
  `K.LIVRES`) : un voyant, une enseigne, un fumigène, le néon du titre. Une seule.
- **Les objets et les lieux portent l'histoire.** Une presse, une corde à linge, un fax
  qui sort, une photo grattée : on filme ce que les gens laissent, pas les gens.
- **Les visages restent dans l'ombre** : des silhouettes à contre-jour, des dos, des
  mains, une foule instanciée au loin. **Un visage est toujours une image imprimée**,
  dessinée par art.js (`K.tex.visage`, `feuilleMasques`, `photoEquipe`, `tifo`) : un
  masque, une photo, une affiche, une Une. Jamais un visage modelé.
- **Des matières fines, procédurales** (`K.tex.*`) : pas un fichier image.
- **Le rendu** : PBR, une carte d'environnement (les reflets mouillés), le brouillard,
  le bloom, la tonalité filmique (ACES), le grain, le vignettage, les bandes.
- **Toujours quelque chose bouge** : la caméra (au moins l'épaule), des particules,
  une lumière qui grésille, une ampoule qui se balance. Une image fixe est une erreur.
- **Peu de texte, en français, dans les polices du jeu** (Jersey 15, Space Mono) :
  un carton de temps et de lieu ; au plus une réplique de deux lignes ; le carton du
  titre au néon. Pas de voix off. Le texte suit la charte : une ligne qui engage, au
  neutre quand le livre l'est (« Pas même au vestiaire », pas « à lui »).
- **Le son** : le thème du livre (`FusibleAudio.setTheme`, la clé de
  `docs/design/bande_originale.md`, `livre_h1`…), un thème de secours tant qu'il
  n'existe pas, et les bruits du jeu (`une`, `porte`, `match_debut`…). On n'écrit pas
  de son ici : on choisit.
- **De 25 à 45 secondes**, et on peut toujours passer.

## 3. Le cadre : une image maîtresse carrée

La caméra filme **un carré**. `fov` est l'angle du carré, en hauteur comme en largeur.
Chaque format en montre une fenêtre : le paysage (16:9) toute la largeur et une bande
au milieu, le portrait (9:16) toute la hauteur et une colonne au milieu, le 4:5 entre
les deux. `cadrage` déplace la fenêtre plan par plan (`x`, `y` de −1 à 1, une valeur ou
une fonction du temps local) :

```js
cadrage: { portrait: { x: -0.25 }, paysage: { y: 0.1 } }
```

Pourquoi : un seul rendu donne les quatre formats, chacun à sa résolution native (le
tournage rend un carré de 1920 et y découpe 1080 × 1920, 1920 × 1080, 1080 × 1350 et
886 × 1920 sans agrandir) ; le jeu rend directement la fenêtre de l'écran
(`camera.setViewOffset`), quel que soit le téléphone, et c'est la même image. Composer
en 16:9 « avec des zones sûres » obligerait à recadrer le portrait dans une image trop
petite ; rendre le 9:16 en natif seulement perdrait le paysage. Le carré fait les deux.

Ce que ça demande en composant : **le sujet vit dans la croix du milieu**. Ce qui
compte doit tenir dans la bande du paysage *et* dans la colonne du portrait ; le haut
et le bas du carré ne se voient qu'en portrait, les côtés qu'en paysage. En paysage,
l'habillage pose des bandes 2,35:1 (`ratioPaysage`) ; en portrait, pas de bandes.
Les zones sûres de l'habillage : en portrait, rien d'écrit dans les 10 % du haut ni
les 22 % du bas (l'interface des réseaux) ; en paysage, 6 % tout autour. La planche
contact montre les deux découpes : on les regarde toutes les deux.

## 4. La trousse (API)

Tout passe par `t`, le temps du film en secondes : la même image sort du lecteur et
du tournage, quelle que soit l'image d'avant. **Le hasard vient d'une graine** (jamais
`Math.random`), les particules n'ont pas d'état, les animations se calculent de `t`.
`K` est `FusibleCinema.kit` ; three.js est `K.T()` (`window.FusibleTHREE`).

**00 · la base**
- `K.hash(s)`, `K.alea(graine)` (un générateur : `r()`, `r.choix(liste)`), `K.h01(i, graine)`
- `K.bruit1(x, g)`, `K.bruit2`, `K.fbm1(x, g, octaves)`, `K.fbm2` : un bruit lissé, tiré de la graine
- `K.mix`, `K.borne`, `K.lisse(a, b, x)` (smoothstep), `K.rampe(a, b, x)`, `K.cloche(a, b, c, d, x)`
- `K.aisance(nom)` : `lin douce entree sortie sinus expo quint elan marche`
- `K.cles([[t, valeur, aisance?], …], aisance)` → une fonction de `t` (nombres ou tableaux)
- `K.epaule(t, graine, frequence)` : le tremblé d'une caméra à l'épaule
- `K.rgb`, `K.hex`, `K.melange`, `K.css` ; `K.PALETTE` ; `K.LIVRES` (postulat → couleur)

**10 · les matières** (canvas peints une fois, gardés par clé ; leur taille suit la qualité)
- `K.tex.brique beton asphalte pelouse rouille bois papier tissu` → `{ map, rugosite, relief }`
- `K.tex.texte({ lignes, fond, encre })` (une enseigne, une affiche), `fenetres`, `neon`,
  `ecran({ dessiner(x, t, w, h) })` (une texture animée : un écran, un gobo), `halo`, `fumee`, `goutte`
- `K.tex.visage({ heros, taille, masque, yeux })` → Promise : le visage du héros (art.js,
  une fiche déduite de son nom, sans casquette ni lunettes), lissé et imprimé en trame,
  détouré en masque
- `K.tex.feuilleMasques`, `K.tex.cliche` (la plaque qui l'imprime, à l'envers),
  `K.tex.photoEquipe({ gratte: [4], annee })` (rend aussi `visages: [{u, v}]`), `K.tex.tifo`
- `K.mat.brique(o) beton asphalte pelouse rouille bois papier metal lumiere …` : les matériaux PBR

**20 · le rendu** — `K.look.*`
- `Rendu` (fait par le film) : la scène en HDR → le fondu enchaîné → le bloom (à
  demi-résolution) → `ETALONNAGE` (ACES, sRGB, contraste, ombres bleutées, saturation)
- `ciel({ zenith, horizon, lueur, lueurDir, force })`, `environnement(rendu, o)` (o.lampes :
  des lumières dans les reflets), `brouillard(scene, couleur, densite)`
- `halo({ couleur, taille, intensite })` (un halo peint : il tient la lumière quand le
  bloom est coupé), `eclat` (la ligne anamorphique), `cone` (un faisceau dans la pluie),
  `reflet({ pos, couleur, largeur, longueur })` (la traînée d'une lumière sur le sol mouillé)
- `projecteur(o)`, `ponctuelle(o)` : des lumières réglées pour la trousse (décroissance 2)
- `K.QUALITES` : `haute` (le tournage, un ordinateur), `moyenne`, `basse` ;
  `K.qualiteAppareil()` choisit d'après l'appareil

**30 · l'habillage** — `K.habillage.dessiner(ctx2d, w, h, etat)` : le noir, l'éclair,
les bandes, le vignettage, les textes ; `K.habillage.grain(…)`. Trois sortes de texte :

| sorte | ce que c'est | où |
|---|---|---|
| `lieu` | « Aubérive, rue du Port » / « La veille du premier match · 23 h 40 », tapé lettre à lettre, un filet de la couleur du livre | en bas à gauche (paysage), en haut (portrait) |
| `replique` | une ligne dite, deux lignes au plus, et qui la dit (`qui`) | en bas, sur un voile |
| `titre` | le carton du titre au néon du livre, et `sous` | au centre, sur un voile |

**40 · les gens** — `K.gens.mannequin(o)` : une personne articulée (`tenue`, `couleur`,
`echarpe`, `casquette`, `cigarette`, `femme`, `silhouette`) avec ses poses, toutes en
fonction de `t` : `repos marche fumer bras leverMasque tirer salut assis`.
`K.gens.foule({ places, masque, vague })` : des milliers de silhouettes instanciées
(~86 triangles chacune) qui se balancent et lèvent un masque en vague.

**50 · les particules** — `K.particules.pluie neige poussiere fumee etincelles confettis
(papier: true : des feuilles) ronds egouttures`. Chacune : `o.zone` (une boîte), `o.n`
(réglé par la qualité), `o.lumieres` (jusqu'à quatre lumières qui les éclairent),
`maj(t, camera)`. `suivre: true` : la boîte suit la caméra (les gouttes restent à leur place).

**60 · les lieux** — `K.props.tribune` (rend ses `places`), `pylone` (`viser(x, y, z)`,
`maj(t, debut)` : les lampes s'allument une à une), `pelouse`, `but`, `ballon`, `facade`
(fenêtres la nuit, une enseigne), `rue`, `reverbere`, `grillage`, `panneaux` (des noms
inventés), `piece` (sol, murs, plafond, une fenêtre), `escalier` (`marche(i)`), `cadre` ;
`boite`, `cylindre` (une pièce en une ligne), `fusionner` (un appel par matériau).

**61 · les objets** — `K.props.presse` (le cliché, les rouleaux encreurs, la platine,
le volant, la pile de sortie), `ampoule`, `masque`, `cordeLinge`, `feuille`, `voiture`
(1990, plaque inventée), `usine` (sheds, cheminée, sirène), `couloir` (d'hôtel) et
`porte`, `bureau`, `fax` (`sortie(k)`), `telephone({ epoque: cadran | repondeur | clapet
| smartphone | oreillette })`, `dome`, `eglise`, `buvette`.

**70 · le film** — `K.Film(def, o)` (fait par le lecteur et par le tournage),
`K.decor(ctx, o)` (une scène avec son ciel, son brouillard, ses reflets, son ambiance),
`K.fenetre(aspect, cadrage)`, `K.etapes(ctx, [fn, …])` (une étape par tâche du
navigateur : la page reste à l'écoute pendant qu'un film se prépare).

## 5. Le gabarit d'un film

```js
(function (global) {
  "use strict";
  var FC = global.FusibleCinema;

  // un décor : une scène, ce qui bouge (maj), son réglage (look)
  function maRue(K, ctx) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: { zenith: "#02030a", horizon: "#0e1424", lueur: "#3a2416" },
      brouillard: ["#080b16", 0.036], environnement: { fenetres: 30 }, reflets: 1, ambiance: ["#2a3550", "#0a0806", 0.16] });
    var rue = P.rue({ longueur: 70, largeur: 8, flaques: 0.48, graine: "rue" }); s.add(rue);
    var lampe = P.reverbere({ hauteur: 6.2, intensite: 140 }); lampe.position.set(5, 0.15, -1); s.add(lampe);
    var pluie = K.particules.pluie({ n: 9000, zone: { min: [-10, -0.2, -15], max: [10, 9, 15] }, suivre: true });
    s.add(pluie);
    return { scene: s, look: { bloom: 0.8, exposition: 1.1 },
      maj: function (t, c) { pluie.maj(t, c.camera); lampe.maj(t); } };
  }

  FC.film({
    id: "mon_film",                 // = le nom du fichier
    livre: "promu",                 // le postulat (sa couleur, son livre)
    titre: "Mon film", duree: 32,
    musique: "livre_h1", secours: "ville_nuit",
    affiche: 21.5,                  // le temps de l'affiche
    habillage: { vignette: 0.55, grain: 0.075, ratioPaysage: 2.35, ratioPortrait: 0 },
    sortie: { noir: 1.4 },
    sons: [[6.1, "une"], [19.5, "porte"]],
    textes: [
      { sorte: "lieu", de: 1, a: 4.5, texte: "Aubérive, rue du Port", sous: "23 h 40" },
      { sorte: "replique", de: 14, a: 18, qui: "Gégé", texte: "…" },
      { sorte: "titre", de: 28, a: 31.5, texte: "Aubérive · 1990", sous: "Trois mille visages" }
    ],
    montages: { court: [[0.3, 4.5], [6, 10] /* … ≤ 30 s : l'aperçu de l'App Store */] },
    preparer: function (K, ctx) {
      // les textures qui attendent art.js d'abord, puis un décor par étape
      return K.tex.visage({ heros: ctx.heros }).then(function (v) {
        return K.etapes(ctx, [function () { ctx.decors.rue = maRue(K, ctx); }]);
      });
    },
    plans: [
      { de: 0, a: 5.2, decor: "rue", entree: "noir", transition: 1.4, fixe: 3.6,
        camera: { pos: FC.kit.cles([[0, [3, 7.4, 9]], [5.2, [-0.6, 1.55, -2.6]]], "douce"),
                  cible: [-5.5, 1.35, -9.3], fov: 52, epaule: 0.12 },
        cadrage: { portrait: { x: -0.1 } } }
      // entree : coupe | noir | fondu (enchaîné, `transition` s) | flash ; fixe : le temps de
      // l'image fixe de ce plan (le mouvement réduit) ; look : { exposition, bloom… } du plan ;
      // maj(local, progres, ctx) : ce que le plan anime lui-même
    ]
  });
})(typeof window !== "undefined" ? window : this);
```

Le fichier est chargé **après** la trousse (`FusibleCinema.kit` existe quand il se
lit), mais **pas forcément après three.js** : le secours sans WebGL lit la trousse et le
film pour montrer leurs mots. Un film ne crée donc rien de three.js à sa lecture —
tout se fait dans `preparer` et dans les fonctions des plans (le film de référence
passe par de petites aides, `K_cles`, qui lisent la trousse au premier appel). Un film
n'a pas d'état : `maj(t)` pose tout à partir de `t`.

**La lumière, en unités physiques** (décroissance 2, toujours) : une ampoule nue de
2 à 8 cd à un ou deux mètres ; un lampadaire au sodium de 110 à 170 ; une baladeuse de
2,6 ; un projecteur de fenêtre (avec un gobo) de 120 à 150 à six mètres ; un pylône de
4 800 (près) à 21 000 (à cent mètres). Puis on règle l'exposition par décor (`look`,
de 0,8 à 1,4) et, si un plan le demande, par plan. Une feuille blanche sous une
ampoule brûle : on ferme le diaphragme du plan (`look: { exposition: 0.7 }`).

## 6. Le déclencheur

`content/ville/films_<livre>.yaml` dit **quand** un film se joue ; build_content le
valide et le range dans le bundle de son livre (`ville.films`) :

```yaml
films:
  - id: h1.film.masques            # unique, [a-z0-9_.]
    livre: promu                   # le postulat : sa porte flag(histoire_h1) est posée devant `si`
    module: trois_mille_masques    # packages/tools/web/cinema/films/<module>.js (id: "<module>")
    titre: Trois mille masques     # ≤ 40 signes (le carton du secours, l'accessibilité)
    quand: carte                   # debut | carte | drapeau
    prefixe: en.h1.a1_presentation # ou carte: <id>, ou cartes: [ids]
    moment: avant                  # avant | apres (la carte)
    roles: [entraineur]            # facultatif
    si: "saison >= 1"              # facultatif : flag(x), !flag(x), saison|annee|relation.<id> comparés, et &&
  # quand: drapeau → drapeau: <le drapeau qui vient d'être posé>
```

- Un film se joue **une fois par carrière** (la sauvegarde de la ville le retient,
  `S.filmsVus` ; sans la ville, la mémoire du navigateur, par graine et par livre).
- `debut` : au départ de la carrière, avant l'introduction ; `carte` : avant que la
  carte ne s'ouvre (la carte attend dessous) ou après qu'on y a répondu ; `drapeau` :
  après la réponse qui pose le drapeau.
- Dans la ville, un film passe **avant** les scènes jouées du même moment (la veille,
  puis le jour) : `ville_film.js` enveloppe les quatre portes de `ville_cinema.js`
  (`cineDeCarte`, `cineDeDrapeau`, `cineIntro`, `jouerCine`) sans réécrire ni ville.js
  ni ville_cinema.js ; assemble.js casse si l'une d'elles change de nom.
- La grammaire du `si` est petite exprès (`FusibleCinema.siVrai`, `build_content`) : les
  deux doivent rester d'accord.

## 7. Le lecteur, dans le jeu

`FusibleCinema.jouer(id, o)` → `Promise<{ fin: fini | passe | secours | occupe }>` :

- plein écran, par-dessus le jeu (la ville cesse de se dessiner pendant le film) ;
- **« Passer ›»** en haut à droite (44 × 36 px au moins), et Échap ;
- les sous-titres dessinés dans l'image, et redits pour un lecteur d'écran (`aria-live`) ;
- la musique du film (`setTheme`), puis celle du moment ;
- **la pause quand la page se cache** (le temps du film s'arrête) ;
- **le mouvement réduit** (`prefers-reduced-motion`) : une image fixe par plan (`fixe`),
  en fondu lent, les textes par-dessus ;
- **le secours, qui ne bloque jamais** : sans WebGL, ou si un fichier ne vient pas
  (15 s au plus pour les charger), ou si une image plante, un carton de texte (le
  titre, le lieu, la réplique : le fichier du film se lit sans three.js ni la trousse)
  pendant cinq secondes, puis la partie reprend ;
- **la qualité qui s'adapte** : `K.qualiteAppareil()` part de l'appareil (un téléphone
  à quatre cœurs ou peu de mémoire : `basse` ; un ordinateur à huit cœurs et 8 Go :
  `haute` ; sinon `moyenne`) ; DPR plafonné (2, 1,5, 1), 30 images/s au plus sur un
  téléphone ; si une image coûte plus de 45 ms, on baisse la résolution (× 0,75), puis
  on coupe le bloom, puis on baisse encore (× 0,56). En `basse` : sans bloom ni ombres,
  les particules au tiers, la foule éclaircie (45 %), les textures à la moitié et partagées ;
- la préparation se fait **une étape à la fois** (`K.etapes`) : « Passer » répond
  pendant que les décors se bâtissent, et un film passé n'achève pas sa préparation.

Le chargement : le lecteur (25 Ko) est dans la page ; three.js, la trousse et le film
(1 030 Ko, 274 Ko gzip pour le film de référence, dont 750 Ko pour three.js) ne se
chargent qu'au moment de jouer. Dans le **fichier seul**,
ce sont des blocs gzip en base64 ; dans la **version jouable** (`--ville`), des fichiers
`cinema/three.<empreinte>.js`, `kit.<…>.js`, `film.<id>.<…>.js` à côté de la page, que
le service worker garde (et passe d'une version à l'autre sans les retélécharger) ; la
ville les demande d'avance quelques secondes après le départ d'une carrière.

## 8. Tourner, et juger

```bash
# un brouillon (720², 12 i/s, formats à la moitié, une tranche) : une minute ou deux
NODE_PATH=/opt/node22/lib/node_modules node packages/tools/web/cinema/tournage.js \
  --film trois_mille_masques --out /tmp/films --brouillon --de 5 --a 12 --formats 16x9,9x16
# le film entier, les quatre formats, la planche, les affiches, le rapport
NODE_PATH=/opt/node22/lib/node_modules node packages/tools/web/cinema/tournage.js \
  --film trois_mille_masques --out /tmp/films
```

Le tournage rend l'image maîtresse dans Chromium (Playwright ; WebGL par SwiftShader
sur une machine sans carte graphique : lent, mais le même rendu partout), y découpe
chaque format habillé par le même code que le jeu, rend la musique hors ligne par le
même moteur que le jeu (`FusibleAudio.createEngine` sur un `OfflineAudioContext` : le
thème du film ou son secours, ses bruits à leurs temps, un fondu de sortie avec
l'image), et fait encoder par ffmpeg. Il écrit, pour un film `<id>` :
`<id>.<format>.mp4`, `<id>.<format>.affiche.jpg` (l'image de `affiche`, sans
sous-titre, avec le carton du titre), `<id>.planche.16x9.jpg` et `.9x16.jpg` (30 images
réparties sur le film, `ffmpeg tile`), `<id>.wav` et `<id>.court.wav`, `<id>.rapport.json`
(les temps, le coût de chaque plan, les tailles).

**On juge sur la planche**, avec ces questions, plan par plan :
- la lumière : où est la source ? la voit-on, ou son effet ? une zone brûle-t-elle ?
  les noirs sont-ils des noirs bleutés, pas une bouillie brune ?
- la matière : la brique, l'asphalte, le papier se lisent-ils, de près et de loin ?
- le cadre : le sujet tient-il dans le paysage ET dans le portrait ? rien d'écrit sous
  l'interface des réseaux ?
- le mouvement : sur deux images voisines de la planche, quelque chose a-t-il bougé ?
- l'histoire : un plan dit une chose ; le plan d'après en dit une autre.

## 9. Les budgets

Mesurés sur le film de référence (`<id>.rapport.json`, `FusibleCinema.tournage.mesurer`,
`Film.memoire()`). Par décor, au plus fort du plan : appels de dessin et triangles en
qualité haute (le tournage) et basse (un téléphone), et le temps d'une image maîtresse
1920² au tournage, jusqu'à ce que la carte graphique l'ait finie (Chromium + SwiftShader,
quatre cœurs partagés avec un autre tournage ; seule sur la machine, la rue en prend 3,6 s) :

| décor | appels haute / basse | triangles haute / basse | ms / image (1920²) |
|---|---|---|---|
| la rue du Port | 225 / 128 | 33 k / 16 k | 6,0 s |
| l'atelier (le cliché, la pile, l'épreuve) | 166 / 42 | 10 k / 4 k | 3,9 à 12,0 s (la pile) |
| la cour (les masques) | 153 / 37 | 36 k / 13 k | 4,9 s |
| la Rive (tribune, pylônes, tifo, 3 000 masques) | 622 / 336 | 392 k / 239 k | 5,8 à 8,5 s |
| l'escalier du club-house | 105 / 26 | 3 k / 1 k | 6,4 s |

La mémoire des textures du film entier : **553 Mo en haute** (180 textures : chaque
matière garde sa graine), **112 Mo en moyenne**, **53 Mo en basse** (93 textures : les
matières d'un genre partagent une texture peinte en gris que la couleur du matériau
teinte, `K.qualite.partage` ; la carte d'environnement passe de 256 à 64). La
préparation (peindre les textures, bâtir et compiler les cinq décors) : 76 s en haute,
29 s en moyenne, 23 s en basse sur SwiftShader chargé — sur un téléphone, les shaders
se compilent sur la carte graphique et les textures se peignent en 2 à 4 s.

Les budgets d'un film, pour qu'il tienne sur un téléphone moyen à 30 images/s en
qualité `basse` ou `moyenne` :
- **≤ 300 appels de dessin** par image hors foule ; une foule est **un** appel (instanciée) ;
- **≤ 350 000 triangles** visibles (une foule de 3 000 à ~86 triangles : 260 000) ;
- **≤ 64 Mo de textures en `basse`** (`Film.memoire()`) : les textures y sont à la
  moitié (un 1024² RGBA et ses mipmaps : 5,3 Mo ; 1,3 Mo à la moitié) et partagées par
  genre ; une texture propre à un film (une photo, une feuille, un tifo) se compte à part ;
- **≤ 4 lumières qui projettent une ombre**, dont une seule par plan dans un grand décor ;
- **≤ 25 000 particules** à l'écran (la pluie de la Rive en a 12 000, divisées par trois
  en `basse`) ;
- **une préparation sous 4 s** sur un téléphone, bâtie un décor par étape (`K.etapes`).

L'estimation pour un téléphone (Adreno 6xx, Mali-G7x, Apple A13 et après) : en `basse`
(DPR 1, résolution × 0,7, sans bloom ni ombres, 30 images/s au plus), la Rive coûte
~340 appels et ~240 k triangles — la limite haute du budget, tenue par la baisse
automatique de la résolution si l'image dépasse 45 ms ; les autres décors restent sous
130 appels et 16 k triangles et tiennent sans baisse. En `moyenne` (un bon téléphone),
la Rive monte à ~620 appels (les ombres doublent les objets qui en portent) : c'est
le plan que la baisse automatique touche en premier.

## 10. La livraison

| format | taille | cadence | durée | vidéo | son |
|---|---|---|---|---|---|
| `9x16` (réseaux, vertical) | 1080 × 1920 | 30 i/s | le film | H.264 High 4.1, yuv420p, CRF 23, ≤ 1,8 Mbit/s (tampon 3,6) | AAC 192 kbit/s, 48 kHz stéréo |
| `16x9` (paysage, bande-annonce) | 1920 × 1080 | 30 i/s | le film | idem | idem |
| `4x5` (fil d'actualité) | 1080 × 1350 | 30 i/s | le film | CRF 23, ≤ 1,4 Mbit/s (tampon 2,8) | idem |
| `appstore` (aperçu App Store) | 886 × 1920 | 30 i/s | ≤ 30 s (`montages.court`) | H.264 High 4.0, CRF 19, ≤ 10 Mbit/s | AAC 256 kbit/s, 48 kHz stéréo |

Tous : `-pix_fmt yuv420p`, `-movflags +faststart`, BT.709, `aq-mode=3` (le film est la
nuit : sans lui, les dégradés sombres se baguent). La cible des réseaux : **≤ 15 Mo par
minute en 1080 × 1920** — le plafond de 1,8 Mbit/s plus le son tient sous 14,9 Mo. Le
grain coûte des bits : un film plus granuleux que 0,08 tombe en blocs au plafond.

Le film de référence, tourné : ⟨TAILLES⟩.

## 11. Le film de référence : « Trois mille masques »

Livre 1, « Trois mille visages » (1990, l'entraîneur promu), couleur `#FF5A4E`, 41 s.
La veille du premier match à la Rive. Il se joue avant la carte de la présentation
(`en.h1.a1_presentation*`) — donc avant la scène jouée du vestiaire : la veille, puis le
jour. Il ne devance rien : le vestiaire ne sait pas ce qu'il y a sous les cartons, le
joueur le sait depuis « la presse de minuit » (`scenes_h1.yaml`) et les cartons de la
buvette (`intro_h1.yaml`).

| plan | temps | ce qu'on voit | pourquoi |
|---|---|---|---|
| 1 | 0–5,2 | la rue du Port sous la pluie, de haut, puis à hauteur d'homme vers la vitrine des Cartonnages de la Rive ; un ouvrier fume sur le seuil ; carton « Aubérive, rue du Port / La veille du premier match · 23 h 40 » | le lieu et l'heure ; la presse est là, et pas à la buvette |
| 2 | 5,2–7,6 | le cliché : ton visage à l'envers, quatre fois, sur le zinc ; les rouleaux l'encrent ; la platine se lève et retombe (le coup : `une`) | « ton visage sort par quatre » |
| 3 | 7,6–10 | la pile de sortie : une feuille de plus à chaque coup, « TIRAGE 3000 » en pied | trois mille |
| 4 | 10–13 | une épreuve pendue à la ficelle de l'atelier, sous l'ampoule, à contre-jour, deux pinces de bois | le visage, noir sur blanc ; la corde de la cour, déjà |
| 5 | 13–19 | la cour : les masques sèchent sur une corde sous une ampoule nue, la pluie au bord de la tôle ; Gégé, hors champ : « Trois mille. Personne n'en parle avant le coup d'envoi. Pas même au vestiaire. » | la seule ligne ; au neutre |
| 6 | 19–23,6 | la Nord, vide et mouillée ; les pylônes claquent un à un (`porte`), le dernier monte en blanc | la Rive attend |
| 7 | 23,6–27,5 | des silhouettes déroulent un tifo du dernier rang vers le bas : NORD, ton visage | le virage prépare |
| 8 | 27,5–32,6 | comme en rêve, les trois mille sortent de l'ombre rang par rang ; le sifflet (`match_debut`), ils lèvent ton visage ; quatre fumigènes à la couleur du livre | « le virage plein de ton visage » (l'intermède du livre) |
| 9 | 32,6–41 | l'escalier du club-house, la neuvième marche ; la photo de 1974 ; la caméra va au cinquième visage, gratté jusqu'au carton ; « Aubérive · 1990 / Trois mille visages » | le père ; ce que le livre ouvre |

La musique : `livre_h1` (« Trois mille masques » dans la bande originale), `match` en
secours. La coupe de 30 s (`montages.court`) garde les mêmes plans, resserrés.

## 12. Ce qu'on a appris (à ne pas réapprendre)

- **Décroissance 2 partout.** Une lumière à 1,2 ou 1,6 éclaire tout le décor et brûle l'image.
- **Les particules sont bornées à des couleurs positives** (la trousse le fait pour
  toutes) : l'extrapolation des varyings sous MSAA donnait des couleurs négatives dans
  la cible en demi-flottants, des points noirs dans la pluie.
- **three.js r186** : `PCFSoftShadowMap` n'existe plus (`PCFShadowMap` et
  `shadow.radius`) ; `SpotLight.map` projette un gobo (une fenêtre, de la pluie sur une
  vitre) sans ombre. En GLSL, `long` est un mot réservé.
- **Une feuille blanche, une plaque de métal** prennent la lumière autrement que la
  brique : l'encre brille, le papier brûle — réglez l'exposition du plan, pas l'ampoule
  (elle éclaire aussi les autres plans du décor).
- **Ce qui couvre ce qu'on veut voir** : un lambris devant une photo, une platine
  devant un cliché, une corde trop claire qui fait une traînée de bloom. La planche le
  montre ; le code, non.
- **Les visages d'art.js sont dessinés à plat** : `K.tex.visage` les lisse avant la
  trame, sinon ils s'impriment en blocs. Le héros n'a pas de visage de face dans art.js :
  la trousse en déduit un de son nom (la même fiche toute la carrière).
- **Un livre au neutre reste au neutre** dans le film : la réplique ne genre pas le héros.
- **Le tournage est long** sur SwiftShader : de 2 à 8 s l'image maîtresse en 1920²,
  plus quand d'autres travaux tournent ; un brouillon d'abord, toujours.
