# Le compte Instagram : @fusiblegame

Le dossier (`instagram_fusiblegame/`, rendu par `packages/tools/web/promo/reseaux/instagram_kit.js`) porte
l'avatar, les carrousels et les Reels (la vidéo et sa couverture) des deux premières semaines, de quoi tenir
les quatre suivantes (`la_suite/`), et l'aperçu du profil au bout de quinze jours (`apercu_grille.png`). Ce
guide dit où mettre chaque fichier et quoi écrire.

**Pourquoi Instagram en plus de X** : Instagram montre les Reels à des gens qui ne suivent pas le compte, si
bien qu'un compte neuf peut être vu dès sa première vidéo ; le pixel art y a un vrai public ; et les mêmes
vidéos servent à TikTok et à YouTube Shorts. X reste le lieu de la conversation (les développeurs, la presse,
les sondages) ; Instagram est celui où l'on se fait voir.

## Le profil

| | | |
|---|---|---|
| **Type de compte** | Professionnel, « Créateur » | Gratuit (Paramètres → Type de compte et outils) : les statistiques, la programmation des posts, la catégorie sous le nom. |
| **Photo** | `profil/avatar_1080.png` | Instagram la montre en rond. Variante : `avatar_1080_stade.png` (le stade la nuit). |
| **Nom d'utilisateur** | fusiblegame | Le même que sur X. |
| **Nom** | FUSIBLE · jeu de foot mobile | 28 signes. Le nom compte dans la recherche d'Instagram : « jeu » et « foot » y servent. |
| **Catégorie** | Jeu vidéo | Ou la plus proche qu'Instagram propose ; l'afficher sous le nom. |
| **Bio** | Ta carrière de foot en roman noir. 10 histoires, 1990 → 2050, une ville en pixels qui n'oublie rien. Jeu mobile, en français. Bêta bientôt ↓ | 140/150 signes. La flèche montre les liens, juste dessous. |
| **Liens** | 1. « La page du jeu » ; 2. « La bêta : s'inscrire » | Instagram en accepte cinq ; deux suffisent. En attendant la page du jeu, le formulaire de la bêta seul. |
| **Épinglés** | La bande-annonce et « Dix histoires » (J1), puis la bêta (J12) | Trois au plus. L'aperçu de la grille montre le profil ainsi rangé. |

## Les formats

- **Les carrousels** : des images de 1080 × 1350 (4:5), numérotées dans l'ordre (`01.png`, `02.png`…).
  Dans la grille du profil, Instagram n'en montre que le milieu, en 3:4 ; rien d'important n'est à moins de
  50 pixels des bords.
- **Les Reels** : la vidéo (`video.mp4`, 1080 × 1920) et sa couverture (`couverture.png`). La couverture se
  choisit au moment de publier : « Modifier la couverture », puis « Ajouter depuis la pellicule ». La grille
  n'en garde que le milieu, où sont le titre et l'image.
- **Le texte alternatif** se met image par image, au moment de publier : « Paramètres avancés », puis
  « Écrire un texte alternatif ». Ceux de chaque post sont plus bas.

## La voix du compte

- **Les deux voix de X, jamais mélangées dans un même post** : celle d'Aubérive (la ville, ses Unes, ses
  cartes, au présent, sèche) et celle des coulisses (le développeur, à la première personne).
- **La première ligne s'affiche seule sous l'image**, avant « … plus » : une phrase qui donne envie de glisser
  ou de lire la suite.
- **Pas d'émoji, pas de lien dans la légende** (il n'y serait pas cliquable) : « le lien est en bio ».
- **Trois ou quatre mots-clés, à la fin** : #pixelart, #jeuindé, #jeumobile, #football, #gamedev.
- **Jamais un nom réel** : ni club, ni joueur, ni compétition, ni la comparaison avec un autre jeu.

## Les deux premières semaines

Trois publications le premier jour, pour que le profil ne soit pas vide quand on arrive de X, puis deux ou
trois par semaine, entre 18 h et 21 h. Le premier jour, publier dans l'ordre du tableau : la dernière
publiée s'affiche en premier.

| Jour | Publication | Dossier | |
|---|---|---|---|
| J1 (lundi) | Carrousel « Bienvenue à Aubérive », 5 images | `posts/01_carrousel_auberive` | |
| J1 | Carrousel « Dix histoires », 12 images | `posts/02_carrousel_dix_histoires` | épingler |
| J1 | Reel, la bande-annonce (1 min) | `posts/03_reel_bande_annonce` | épingler |
| J3 (mercredi) | Carrousel « La carte du jour » n° 1, 4 images | `posts/04_carrousel_carte_du_jour_1` | |
| J5 (vendredi) | Reel, « 23 h 58 », le livre 6 (1 min) | `posts/05_reel_23h58` | |
| J7 (dimanche) | Carrousel « 39 pièces », 8 images | `posts/06_carrousel_39_pieces` | |
| J9 (mardi) | Reel, « La tribune », la musique (23 s) | `posts/07_reel_la_tribune` | |
| J11 (jeudi) | Carrousel « La carte du jour » n° 2, 4 images | `posts/08_carrousel_carte_du_jour_2` | |
| J12 (vendredi) | Carrousel « Bêta », 3 images | `posts/09_carrousel_beta` | épingler |
| J14 (dimanche) | Reel, « Trois mille visages », le livre 1 (1 min) | `posts/10_reel_trois_mille_visages` | |

**La carte du jour** : sur X, l'image et le sondage vont dans deux posts ; ici, le carrousel fait le jeu
lui-même. La carte en première image, on répond « gauche » ou « droite » en commentaire, et on glisse :
les deux images suivantes donnent ce que le jeu répond, mot pour mot.

### J1 · Carrousel « Bienvenue à Aubérive »

**Fichiers** : `posts/01_carrousel_auberive/01.png` à `05.png`

```
Aubérive n'existe pas. Elle se souvient pourtant de tout ce que tu y fais.

C'est la ville de FUSIBLE, un jeu mobile : ta carrière de football de 1990 à 2050, en roman noir. Entre deux cartes, tu marches dans ses rues, tu pousses ses portes, tu vas au match le samedi.

Glisse pour faire le tour.

Bêta bientôt : le lien est en bio.

#pixelart #jeuindé #jeumobile
```

**Textes alternatifs** :
1. « Bienvenue à Aubérive » : la ville en pixel art, la nuit, autour de son stade éclairé.
2. Une rue d'Aubérive la nuit : l'enseigne rose de la laverie, un passant, un réverbère.
3. L'intérieur du Corner, le bar du quartier : le zinc, le flipper, la télé des résultats.
4. Le match du samedi : 1-0 à la 66e minute, et deux gestes à choisir.
5. « Dix histoires t'y attendent », sur le panorama d'Aubérive la nuit.

### J1 · Carrousel « Dix histoires » (épinglé)

**Fichiers** : `posts/02_carrousel_dix_histoires/01.png` à `12.png`

```
Dix histoires. Dix rôles. Soixante ans de football, dans une ville qui n'existe pas.

Entraîneur promu en 1990, pépite de dix-neuf ans, présidente en 2037 : chaque livre de FUSIBLE est un roman noir qu'on joue en glissant des cartes, avec ses fins.

Lequel tu ouvres en premier ? Dis-le en commentaire.

#jeumobile #football #pixelart
```

**Textes alternatifs** :
1. Le sommaire des dix livres de Fusible, chacun avec son heure.
2. à 11. Pour chaque livre, sur le même modèle : « Livre 1, Trois mille visages : entraîneur, 1990. Une vignette de la ville en pixels, à l'heure du livre. »
12. « Lequel tu ouvres en premier ? », sur le panorama de la ville.

### J1 · Reel, la bande-annonce (épinglé)

**Fichiers** : `posts/03_reel_bande_annonce/video.mp4`, couverture `couverture.png`

```
Une carte. Un choix. Tu glisses à gauche ou à droite.

FUSIBLE, c'est ta carrière de football de 1990 à 2050 : dix histoires noires, une ville en pixels qui n'oublie rien. Sur téléphone, en français.

La bêta arrive : le lien est en bio.

#jeumobile #jeuindé #pixelart #football
```

### J3 · Carrousel « La carte du jour » n° 1

**Fichiers** : `posts/04_carrousel_carte_du_jour_1/01.png` à `04.png`

```
La carte du jour. Gauche ou droite ?

1990, ton premier jour au club. Dans l'escalier, une photo de 1974 : un visage gratté au couteau. Madame Josiane te tend deux clés.

Réponds en commentaire avant de glisser : les deux images suivantes disent ce que le jeu en fait.

#jeumobile #jeuindé #football
```

**Textes alternatifs** :
1. Une carte du jeu : Madame Josiane tend deux clés devant la photo de la finale de 1974. À gauche, « Je prends les deux » ; à droite, « Le local me suffit ».
2. La réponse de gauche : « On ne l'a jamais décrochée. Ni fait réparer. »
3. La réponse de droite : elle redresse le cadre d'un doigt, sans regarder le trou.
4. « Chaque réponse laisse une trace », sur le panorama de la ville.

**Dans les commentaires** : répondre à chacun avec la voix du jeu, comme ses échos : « Ça reviendra. »,
« Josiane s'en souviendra. »

### J5 · Reel, « 23 h 58 »

**Fichiers** : `posts/05_reel_23h58/video.mp4`, couverture `couverture.png`

```
23 h 58. Un fax sans en-tête. Une photo de 1999, et un chiffre : trente millions par an.

Le papier blanchit en six mois.

« 23 h 58 », livre 6 de FUSIBLE. Bêta bientôt : le lien est en bio.

#jeumobile #jeuindé #pixelart
```

### J7 · Carrousel « 39 pièces »

**Fichiers** : `posts/06_carrousel_39_pieces/01.png` à `08.png`

```
39 pièces, modelées à la main, voxel par voxel.

La buvette du kop, la laverie de nuit, l'hôtel de la Rive, l'église Saint-Aubin… Dans FUSIBLE, on entre dans chacune, et quelqu'un t'y attend toujours.

Glisse pour pousser les portes.

#pixelart #gamedev #jeuindé
```

**Textes alternatifs** :
1. « 39 pièces, modelées à la main » : le Corner, un bar en pixel art vu de trois quarts.
2. La buvette du kop : le comptoir en zinc, les écharpes au plafond.
3. La laverie : les machines, et le néon au-dessus des sèche-linge.
4. Le hall de l'hôtel de la Rive.
5. La nef de l'église Saint-Aubin et ses cierges.
6. La salle du cinéma L'Aurore.
7. La brasserie du Pont et ses banquettes.
8. « Laquelle tu pousses en premier ? », sur le panorama de la ville.

### J9 · Reel, « La tribune »

**Fichiers** : `posts/07_reel_la_tribune/video.mp4` (le panorama d'Aubérive qui défile sous le thème du
jeu), couverture `couverture.png`

```
Le thème de FUSIBLE s'appelle « La tribune » : une tribune qui chante, en la mineur, jouée par de vrais instruments.

Monte le son.

#jeuindé #gamedev #pixelart
```

### J11 · Carrousel « La carte du jour » n° 2

**Fichiers** : `posts/08_carrousel_carte_du_jour_2/01.png` à `04.png`

```
La carte du jour. Gauche ou droite ?

2003. Il manque quatre cent mille écus pour les salaires de mars. La banque propose une avance. Le fax de cette nuit propose une vente.

Réponds en commentaire avant de glisser : les deux images suivantes disent ce que le jeu en fait.

#jeumobile #jeuindé #football
```

**Textes alternatifs** :
1. Une carte du jeu : Madame Josiane pose les fiches de paie à côté du relevé. À gauche, « J'appelle la banque » ; à droite, « Je vends quelqu'un ».
2. La réponse de gauche : la banque avance l'argent au taux des mauvais jours.
3. La réponse de droite : un milieu remplaçant vendu deux millions ; le vestiaire compte les absents.
4. « Chaque réponse laisse une trace », sur le panorama de la ville.

### J12 · Carrousel « Bêta » (épinglé)

**Fichiers** : `posts/09_carrousel_beta/01.png` à `03.png`

```
On cherche cinquante personnes pour tester FUSIBLE avant sa sortie, et nous dire franchement ce qui coince.

Gratuit, sur téléphone, en français. Ton nom au générique, le titre « Membre fondateur » dans le jeu, et le jeu offert à sa sortie.

Inscription en deux minutes : le lien est en bio.

#jeuindé #jeumobile #gamedev
```

**Textes alternatifs** :
1. « On cherche cinquante testeurs », sur le panorama d'Aubérive la nuit.
2. Ce que fait un testeur : jouer une histoire sur son téléphone, et dire ce qui coince.
3. Ce qu'il y gagne : son nom au générique, le titre « Membre fondateur », le jeu offert à la sortie.

Une fois publiée, l'épingler : les trois épinglés sont alors la bande-annonce, « Dix histoires » et la
bêta.

### J14 · Reel, « Trois mille visages »

**Fichiers** : `posts/10_reel_trois_mille_visages/video.mp4`, couverture `couverture.png`

```
1990. Le club monte, et trois mille supporters vont porter ton visage en carton dans la tribune Nord.

Ils t'aiment. Ils feront ce que tu n'oses pas faire. Avec ton visage.

« Trois mille visages », livre 1 de FUSIBLE. Bêta bientôt : le lien est en bio.

#jeumobile #football #pixelart
```

## Publier sans y passer ses soirées

- **Programmer** : un compte professionnel programme ses posts depuis l'application (l'option « Programmer »
  au moment de publier) ou depuis l'ordinateur, là où est le dossier, avec Meta Business Suite (gratuit).
  Une demi-heure le dimanche suffit pour la semaine.
- **Les fichiers sur le téléphone** : par câble, AirDrop, ou un dossier partagé (Google Drive, iCloud).
- **Le son des Reels** : au moment de publier, renommer le « son original » en « FUSIBLE · bande
  originale ». Ceux qui le réutilisent font circuler le nom du jeu.
- **TikTok et YouTube Shorts** : les mêmes `video.mp4`, tels quels, avec la première ligne de la légende.

## Chaque jour, dix minutes

- Répondre à chaque commentaire dans l'heure qui suit la publication : les premiers échanges font monter le
  post. Deux lignes, avec la voix du jeu.
- Aimer et commenter cinq à dix publications du même monde : le pixel art, les jeux indépendants, la culture
  foot (sans jamais parler des clubs).
- Répondre aux messages privés ; noter dans le tableau de la bêta (`docs/sortie/beta.md`) les questions qui
  reviennent.

## Ce qu'on ne fait pas

- Acheter des abonnés ou des « j'aime », suivre et ne plus suivre en masse.
- Reposter une vidéo téléchargée d'un autre réseau, avec son logo : Instagram la montre moins. Toujours le
  `video.mp4` du dossier.
- Mettre plus de quatre mots-clés, ou les mêmes trente sous chaque post.
- Annoncer une date ou un prix avant les fiches des stores.
- Montrer l'écran des cartes en image fixe : il va changer (les bandes-annonces le montrent encore ; elles
  seront remontées avec les nouveaux écrans).

## Ce qu'on mesure

Chaque dimanche, dans les statistiques : les comptes touchés, et la part de non-abonnés parmi eux (elle dit
si les Reels trouvent du monde) ; les enregistrements et les partages (l'envie d'en voir plus) ; les visites
du profil, les clics sur les liens, les abonnés gagnés ; et surtout les inscriptions à la bêta (la question
« Comment nous as-tu connus ? » du formulaire). Si les gens quittent un Reel dans les trois premières
secondes, on en monte un début plus court.

## La suite (semaines 3 à 6)

`la_suite/` porte cinq Reels et deux carrousels. Les vidéos des Reels sont dans une seconde archive
(`instagram_fusiblegame_videos_suite.zip`), à décompresser au même endroit. Les livres 2, 4 et 5 restent pour
l'annonce de la date (`docs/sortie/reseaux.md`).

| Semaine | Mardi | Jeudi | Samedi |
|---|---|---|---|
| 3 | Reel « La Sirène » (`11`) | une carte du jour, à préparer | Carrousel « Les Unes » (`12`) |
| 4 | Reel « L'Oreillette » (`13`) | une carte du jour, à préparer | Carrousel « Le dossier 1974 » (`14`) |
| 5 | Reel « Chambre 12 » (`15`) | une carte du jour, à préparer | des coulisses, à préparer |
| 6 | Reel « Vingt degrés dedans » (`16`) | une carte du jour, à préparer | Reel « Les Deux Téléphones » (`17`) |

**Reel « La Sirène »**
```
Dix-neuf ans. L'usine ferme à Noël, et tu es la dernière chose que la ville fabrique.

La nuit, la sirène de l'usine morte hurle encore.

« La Sirène », livre 3 de FUSIBLE. Bêta bientôt : le lien est en bio.

#jeumobile #football #pixelart
```

**Carrousel « Les Unes »**
```
Le Quotidien du Ballon, jeudi 7 mars 1991. Puis la Gazette, un lundi de décembre.

Dans FUSIBLE, la presse d'Aubérive suit ta carrière : 548 manchettes, de 1990 à 2050. Certaines, tu ne voudrais pas les lire.

#jeuindé #jeumobile #football
```

**Reel « L'Oreillette »**
```
2024. Un club dans un tableur, et dans ton oreille, la voix d'un mort qui choisit qui vendre.

« L'Oreillette », livre 8 de FUSIBLE. Bêta bientôt : le lien est en bio.

#jeumobile #football #pixelart
```

**Carrousel « Le dossier 1974 »**
```
Une photo de la finale de 1974, dans l'escalier du club. Cinq visages. Le cinquième a été gratté au couteau, jusqu'au carton.

Qui ? Pourquoi ? Chacune des dix histoires en garde une pièce. Tes théories en commentaire.

#jeuindé #pixelart #jeumobile
```

**Reel « Chambre 12 »**
```
2011. À l'hôtel de la Rive, vingt-six doubles pendent au tableau des clés. La troisième nuit, quelqu'un demande celui de la 12.

« Chambre 12 », livre 7 de FUSIBLE. Bêta bientôt : le lien est en bio.

#jeumobile #football #pixelart
```

**Reel « Vingt degrés dedans »**
```
Le Mondial se joue sous un dôme, à vingt degrés dedans. Ton capitaine veut y porter un brassard noir. Toi, tu es la sélectionneuse.

« Vingt degrés dedans », livre 9 de FUSIBLE. Bêta bientôt : le lien est en bio.

#jeumobile #football #pixelart
```

**Reel « Les Deux Téléphones »**
```
2037. Le téléphone du bureau est pour la ville. Le clapet dans ta veste, pour ceux qui ont payé ta campagne.

« Les Deux Téléphones », livre 10 de FUSIBLE. Bêta bientôt : le lien est en bio.

#jeumobile #football #pixelart
```

Quand le compte a ses premiers abonnés (une centaine), les stories prennent le relais de la carte du jour :
l'image et l'autocollant « Sondage » y tiennent ensemble, et la réponse du jeu vient le lendemain.
