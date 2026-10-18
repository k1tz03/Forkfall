# La sortie : le plan (octobre 2026)

Le verdict du test de préparation (18 octobre 2026) : le jeu est prêt à **≈ 90 %**, le produit à
**≈ 60 %** pour une sortie sur les stores. Ce qui manque : l'application mobile, les écrans de jeu
dans la direction de la ville, des tests avec de vraies personnes, le juridique, la vitrine. Le
teasing peut commencer une fois le nom sécurisé, sans date et sans montrer les écrans de carte.

## Les décisions

- **Les mises : retirées** (18 octobre 2026). Une partie de 421 ou de cartes ne rapporte plus
  d'argent ; ce qu'elle coûte est le verre ou la place à la table (`ville.js`, `finirActivite`).
  Au comptoir, on joue pour l'honneur ; le tripot et le fumoir de l'Impérial n'ont plus de partie,
  la nuit s'y perd toujours. Le jeu d'argent simulé aurait porté la classification au-delà de la
  cible (PEGI 12, Apple 13+).
- **Le modèle : payant**, sans achat dans le jeu. Le porteur veut **1 € par jeu vendu** : le prix
  est **1,99 €** (plus bas).
- **En attente** : la direction des écrans de jeu (trois maquettes à choisir) ; les incohérences
  d'histoire (`docs/bible/audit_textes.md` § 6) ; une démo gratuite ou non (la page publiée sur
  claude.ai contient tout le jeu : elle sert de bêta, elle ne restera pas ouverte après la sortie).

## Le prix

Le store reverse sa part sur le prix **hors TVA** ; la TVA est celle du pays de l'acheteur (20 %
en France, 21 % en Belgique, jusqu'à 27 % dans l'Union). La commission est de 15 % pour un
développeur qui gagne moins d'un million de dollars par an (le programme des petites entreprises
d'Apple, auquel il faut s'inscrire ; chez Google, automatiquement sur le premier million). Dans
l'Union européenne, Apple propose aussi d'autres conditions, entre 10 et 20 % selon l'option : à
choisir au moment de signer.

| Prix | France, 15 % | France, 30 % | TVA 27 %, 15 % |
|---|---:|---:|---:|
| 0,99 € | 0,70 € | 0,58 € | 0,66 € |
| 1,49 € | 1,06 € | 0,87 € | 1,00 € |
| **1,99 €** | **1,41 €** | **1,16 €** | **1,33 €** |
| 2,99 € | 2,12 € | 1,74 € | 2,00 € |

À 1,49 €, le compte n'y est qu'au taux réduit et en France. **À 1,99 €, chaque vente rapporte plus
d'un euro dans tous les cas**, et il reste environ 1,06 € une fois retirés 25 % de cotisations et
d'impôt (le taux exact dépend du statut : l'URSSAF ou un comptable le donne).

## Où on en est (les tâches 1 à 7)

1. **Le nom** : le premier tri ne trouve ni jeu ni marque « Fusible » ; la vérification officielle
   et le dossier de dépôt sont dans `docs/sortie/nom.md`.
2. **La page du jeu** : `packages/tools/web/vitrine/` (aperçu publié sur claude.ai) ; à remplir
   avant la mise en ligne : le formulaire, l'éditeur, le contact, les comptes.
3. **Le kit des réseaux** : `docs/sortie/reseaux.md`, seize posts sur huit semaines, leurs textes.
4. **Les mises** : retirées.
5. **La bêta autonome** : `assemble.js --version --retours --lien` ; vérifiée hors de claude.ai ; la
   page du jeu publiée est en « Bêta 0.1 ».
6. **« Donner mon avis »** : `preview_avis.js`, sur l'accueil et l'écran de fin d'une bêta.
7. **Le kit du bêta-testeur** : `docs/sortie/beta.md` (les formulaires, les messages, les
   consignes, le tableau de tri, les vagues).

## Le plan, dans l'ordre

| | Tâche | Qui |
|---|---|---|
| Avant le premier teaser (semaines 1 et 2) | Le premier tri d'antériorité du nom FUSIBLE (marques, stores, domaines, réseaux) et le dossier de dépôt INPI, classes 9 et 41 | Claude ; le porteur dépose et paie |
| | La page du jeu : la bande-annonce, les dix livres, l'inscription à la bêta et à la lettre, les mentions légales | Claude |
| | Le kit des réseaux : douze à quinze posts tirés des bandes-annonces, un calendrier sur huit semaines, sans date | Claude |
| Préparer la bêta (semaines 2 à 4) | Les mises retirées des petits jeux (après accord) | Claude |
| | Une version bêta autonome, hors de claude.ai (itch.io ou un hébergeur gratuit), son numéro de version visible | Claude |
| | Le bouton « Donner mon avis » : un rapport prêt à coller (version, livre, Code de Carrière, carte, téléphone), un court questionnaire en fin de partie ; rien n'est envoyé sans le joueur | Claude |
| | Le kit du bêta-testeur : le message de recrutement, le questionnaire, les consignes des jours 1, 3 et 7, le tableau de tri ; puis le tri des retours | Claude ; le porteur recrute |
| L'application (semaines 3 à 9) | La version web emballée pour iOS et Android : tout embarqué hors ligne, les sauvegardes dans le téléphone, le bouton retour, l'encoche, le partage ; les fonctions propres à claude.ai remplacées ou retirées | Claude ; iOS se compile sur un Mac ou un service en ligne |
| | Les écrans de jeu dans le style de la ville, puis les captures des stores refaites | Claude ; le porteur choisit la maquette |
| | Les réglages : taille du texte, contraste, son et musique séparés | Claude |
| | Les passes de test sur téléphones simulés à chaque version (petits écrans, processeur lent, mémoire, hors ligne, reprise après un appel) | Claude |
| Avant la sortie (semaines 8 à 12) | Le juridique : confidentialité, mentions légales, conditions, « toute ressemblance… », l'écran des licences, les réponses de classification d'âge ; la liste noire des vrais noms portée à ≈ 1 500 termes | Claude ; le porteur relit et soumet |
| | Les fiches des stores et le dossier de presse | Claude |
| | Les bugs connus (le « J », le classement après un changement de club), les incohérences, la réécriture des cartes au-delà de la première heure | Claude |
| | Le modèle économique choisi (la démo web, le jeu payant) | Claude |

**Ce que seul le porteur peut faire** : décider (plus haut) ; déposer le nom ; ouvrir les comptes
(Apple Developer 99 $ par an, Google Play Console 25 $ une fois, itch.io, Discord, les réseaux, un
nom de domaine) ; jouer sur de vrais téléphones et y faire jouer des proches ; recruter et animer
les testeurs ; compiler pour iOS (un Mac, ou un service de compilation en ligne) ; soumettre aux
stores et remplir leurs déclarations.

## La bêta

**Trois vagues** :

1. Semaines 2 et 3 : cinq à dix proches, sur la version web. On cherche ce qui bloque ; on les
   regarde jouer.
2. Semaines 4 à 6 : trente à cinquante joueurs des communautés (plus bas), avec le questionnaire.
   On mesure où ils décrochent et ce qu'ils ne comprennent pas.
3. Semaines 7 à 10 : cent et plus en test fermé ou ouvert sur les stores. La stabilité, les
   téléphones, et le test fermé de Google.

**Le test fermé de Google** : un compte développeur personnel ouvert après le 13 novembre 2023
doit faire tester l'application par au moins **douze testeurs inscrits pendant quatorze jours
d'affilée** avant la publication (le compteur repart de zéro sous douze). Un compte
« organisation » en est dispensé. Apple : TestFlight, jusqu'à 10 000 testeurs externes par un
lien public.

**Où les trouver, gratuitement** :

- L'entourage d'abord (amis, famille, collègues qui aiment le foot ou les histoires).
- Les développeurs francophones : les serveurs Discord *Indie Park* (des playtests avec de vrais
  joueurs) et *Game Dev Alliance* (lié à FaireDesJeux.fr) ; on teste leurs jeux, ils testent le
  nôtre.
- Reddit : r/playtesters (≈ 17 000 membres, une catégorie mobile), r/playmygame (≈ 130 000),
  r/GamePlayTest ; en anglais, préciser que le jeu est en français. Lire les règles avant de poster.
- itch.io : la bêta web en page gratuite, un journal de développement.
- Les services gratuits contre des clés : IndieQA, Alpha Beta Gamer.
- Le public du jeu : les clubs amateurs (joueurs, éducateurs, supporters), les associations de
  supporters, les groupes de foot amateur.
- Les écoles de jeu vidéo (ENJMIN, Rubika, ISART Digital) : une séance de playtest proposée à un
  enseignant donne des retours structurés.
- Les teasers : chaque post finit sur l'inscription à la bêta.

**Les contreparties, gratuites** : le nom aux crédits, un titre « Membre fondateur » dans le jeu,
le jeu offert à la sortie (les codes promotionnels des stores), les prochains livres en avance.
