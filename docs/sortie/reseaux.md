# Les réseaux : le kit des teasers

## Les règles

- **Pas de date, pas de prix** tant que les fiches des stores n'existent pas.
- **Seulement ce qui ne changera plus** : la ville, les films, la musique, les dix livres. Les
  bandes-annonces montrent encore l'ancien écran des cartes : elles servent pour le teasing, et
  seront remontées quand les écrans changeront.
- **Chaque post finit sur la bêta** : « Bêta bientôt, inscription en bio », avec le lien de la
  page du jeu (`packages/tools/web/vitrine/`).
- **Jamais un nom réel** : ni club, ni joueur, ni compétition, ni marque, ni la comparaison avec un
  jeu existant, dans les textes comme dans les mots-clés.
- **Deux posts par semaine**, le mardi et le vendredi, entre 18 h et 20 h. Les mêmes vidéos
  partout : TikTok, Instagram (Reels), YouTube (Shorts) en 9:16 ; X et Bluesky en 16:9 ; les
  groupes Facebook en 4:5.
- **Trois à cinq mots-clés**, toujours les mêmes : #jeuindé #jeumobile #pixelart #football
  #fusiblejeu.

## Les fichiers

La chaîne de la promo (`packages/tools/web/promo/README.md`) rend, dans son dossier de livrables :
`bandes_annonces/jeu.<format>.mp4` (la bande-annonce du jeu, une minute) et
`bandes_annonces/h1…h10.<format>.mp4` (une par livre), chacune en `9x16`, `16x9`, `4x5` et
`appstore` ; et les captures des stores, `captures/jeu/apple/*.png` (la ville, le samedi, la
porte, l'album, le dossier 1974). Un extrait de musique sur une image fixe se fait d'une ligne :

```bash
ffmpeg -loop 1 -i panorama_nuit.png -i accueil.1.mp3 -t 20 -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" \
  -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest musique_9x16.mp4
```

## Les huit premières semaines

| Semaine | Mardi | Vendredi |
|---|---|---|
| 1 | La bande-annonce du jeu (`jeu`) | La ville : trois captures en carrousel |
| 2 | Livre 1, « Trois mille visages » (`h1`) | Les coulisses : 39 pièces modelées à la main |
| 3 | Livre 6, « 23 h 58 » (`h6`) | La musique : vingt secondes de « Fusible » |
| 4 | Livre 3, « La Sirène » (`h3`) | Le samedi en direct : la capture du match |
| 5 | Livre 8, « L'Oreillette » (`h8`) | L'appel aux bêta-testeurs |
| 6 | Livre 7, « Chambre 12 » (`h7`) | Le dossier 1974 : le visage gratté |
| 7 | Livre 9, « Vingt degrés dedans » (`h9`) | L'album : 232 vignettes |
| 8 | Livre 10, « Les Deux Téléphones » (`h10`) | La bêta ouvre (ou « bientôt ») |

Les livres 2, 4 et 5 restent pour l'annonce de la date, six à huit semaines avant la sortie.

## Les textes

**S1, mardi (la bande-annonce)**
> Une carte. Un choix. Glisse à gauche ou à droite.
> Une carrière de football de 1990 à 2050, dans une ville qui n'oublie rien.
> FUSIBLE. Bêta bientôt, inscription en bio.

**S1, vendredi (la ville)**
> Entre deux cartes, tu vis à Aubérive. Tu bois un café avec qui tu veux. Les gens retiennent ce
> que tu fais pour eux, et ce que tu leur dois.

**S2, mardi (livre 1)**
> 1990. Ton club monte. Trois mille supporters vont porter ton visage en carton.
> Ils t'aiment. Ils feront ce que tu n'oses pas faire.

**S2, vendredi (les coulisses)**
> Trente-neuf pièces, toutes modelées à la main : le bar, la laverie, la loge du stade, la chambre
> 12 de l'hôtel. On peut entrer dans chacune. Quelqu'un t'y attend toujours.

**S3, mardi (livre 6)**
> 23 h 58. Un fax sans en-tête, une photo de 1999, et un chiffre : trente millions par an.
> Le papier blanchit en six mois.

**S3, vendredi (la musique)**
> Le thème du jeu : une tribune qui chante, jouée par de vrais instruments. Monte le son.

**S4, mardi (livre 3)**
> Dix-neuf ans. L'usine ferme à Noël, et tu es la dernière chose que la ville fabrique. La nuit,
> la sirène de l'usine morte hurle encore.

**S4, vendredi (le samedi)**
> Le samedi, à la Rive, le match s'arrête sur une action. Deux gestes. Cinq secondes pour choisir.

**S5, mardi (livre 8)**
> 2024. Un club dans un tableur, et dans ton oreille, la voix d'un mort qui choisit qui vendre.

**S5, vendredi (l'appel à la bêta)**
> On cherche cinquante personnes pour jouer à FUSIBLE avant sa sortie et nous dire ce qui coince.
> Gratuit, sur téléphone, en français. Ton nom au générique. Inscription en bio.

**S6, mardi (livre 7)**
> 2011. À l'hôtel de la Rive, vingt-six doubles pendent au tableau des clés. La troisième nuit,
> quelqu'un demande celui de la 12.

**S6, vendredi (le dossier 1974)**
> Une photo de la finale de 1974. Cinq visages. Le cinquième a été gratté au couteau.
> Dix carrières pour comprendre pourquoi.

**S7, mardi (livre 9)**
> Le Mondial se joue sous un dôme, à vingt degrés dedans. Ton capitaine veut y porter un brassard
> noir. Toi, tu es la sélectionneuse.

**S7, vendredi (l'album)**
> 232 vignettes à coller, d'une carrière à l'autre. Les doubles s'échangent au comptoir.

**S8, mardi (livre 10)**
> 2037. Le téléphone du bureau est pour la ville. Le clapet dans ta veste, pour ceux qui ont payé
> ta campagne.

**S8, vendredi**
> La bêta de FUSIBLE ouvre. Dix livres, une ville, et tes retours pour finir le jeu.

## Répondre aux commentaires

- Répondre dans la journée, en deux lignes, avec la voix du jeu plutôt qu'avec des émojis.
- À « c'est quel club ? » : « Aucun : tout est inventé, la ville, les clubs, les gens. »
- À « c'est comme tel jeu » : remercier, ne pas citer de nom, parler de ce que FUSIBLE fait (la
  ville, les livres).
- Ne jamais répondre à une provocation ; masquer une insulte.
- Noter dans le tableau de la bêta (`docs/sortie/beta.md`) chaque question qui revient : c'est une
  phrase à mettre sur la page du jeu.
