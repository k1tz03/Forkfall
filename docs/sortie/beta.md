# La bêta : le kit

## Mettre la bêta en ligne

- **Tout de suite, sans rien payer** : la page du jeu sur claude.ai (l'artefact du jeu) porte déjà
  « Bêta 0.1 » et le bouton « Donner mon avis ». Elle se partage depuis son menu « Partager » ;
  les testeurs n'ont rien à installer. Quand le formulaire des retours existe, on republie avec son
  adresse (`assemble.js --retours <adresse>`).
- **Avec votre domaine** : la version autonome, la même page sans claude.ai, à déposer sur un
  hébergeur gratuit (Cloudflare Pages accepte un dossier glissé dans son tableau de bord) :

  ```bash
  dart compile js -O2 packages/tools/web/preview.dart -o /tmp/engine.js
  node packages/tools/web/assemble.js --engine /tmp/engine.js --out beta/index.html \
    --ville docs/design/pixel_iso/out/ville/web --version "Bêta 0.1" --retours https://…
  ```

  Le dossier `beta/` (≈ 500 fichiers, 175 Mo avec la musique) se sert tel quel, en HTTPS. Vérifié
  hors de claude.ai le 18 octobre 2026 : l'accueil, l'avis, un livre lancé, sans une erreur. Le
  classement du jour du mode éclair et la part des joueurs par fin, qui vivent dans la base de
  claude.ai, s'y taisent ; le reste du jeu est entier. L'adresse du formulaire se change ensuite
  dans `index.html`, sur la ligne `<meta name="fusible-retours" content="…">`.
- **Plus tard, les stores** : TestFlight chez Apple (jusqu'à 10 000 testeurs par un lien public)
  et le test fermé de Google Play, obligatoire pour un compte personnel : douze testeurs inscrits
  pendant quatorze jours d'affilée avant la publication (le compteur repart à zéro sous douze). Un
  compte « organisation » en est dispensé.

## Les deux formulaires (Tally ou Google Forms, gratuits)

**L'inscription**, derrière le bouton de la page du jeu :

1. Ton prénom ou ton pseudo (il ira au générique). *Obligatoire.*
2. Ton adresse e-mail. *Obligatoire.*
3. Ton téléphone : iPhone ou Android, et le modèle si tu le connais.
4. Tu joues à quoi, d'habitude ? Jeux d'histoire, jeux de foot, jeux de cartes, jeux mobiles de
   temps en temps, autre.
5. Comment nous as-tu connus ? TikTok, Instagram, Reddit, Discord, un ami, autre.
6. J'accepte que mon prénom ou mon pseudo figure au générique. *Case à cocher.*

Sous le formulaire : « Ton adresse ne sert qu'à t'envoyer la bêta et à te prévenir de la sortie.
Écris-nous pour qu'on l'efface. »

**Les retours**, derrière « Donner mon avis » dans le jeu :

1. Ton prénom ou ton pseudo.
2. Ton avis : colle ici le texte copié dans le jeu. *Réponse longue, obligatoire.*
3. Une capture d'écran ? *Dépôt de fichier, facultatif.*

Le texte que le jeu prépare contient déjà la version, le livre, la graine, l'année, la saison, la
carte, l'appareil, la note et les trois réponses : il suffit de le coller.

## Le message de recrutement

**Court** (une story, un post) :
> On cherche cinquante personnes pour tester FUSIBLE avant sa sortie : un jeu de cartes et une
> ville en pixels, ta carrière de football en roman noir. Gratuit, sur téléphone, en français.
> Ton nom au générique. Inscription en bio.

**Communautés de développeurs** (Discord, Reddit) :
> Bonjour ! Je termine FUSIBLE, un jeu mobile narratif en français : on glisse des cartes à gauche
> ou à droite, et entre deux cartes on vit dans une ville en pixel art qui se souvient de ce qu'on
> fait. Dix histoires, de 1990 à 2050, deux heures chacune. Je cherche des testeurs pour une
> session de vingt minutes à deux heures. Je teste volontiers vos jeux en échange. Le lien : …

**Proches et clubs** (WhatsApp, SMS) :
> Salut ! Le jeu dont je t'ai parlé est jouable. Tu as vingt minutes cette semaine pour y jouer
> sur ton téléphone et me dire franchement ce qui t'a ennuyé ? Le lien : …

## Les consignes du testeur

> Joue comme tu jouerais seul, sans chercher à nous faire plaisir. Quand quelque chose t'agace ou
> te perd, touche « Donner mon avis » sur l'accueil : c'est le retour le plus précieux.
>
> **Jour 1, vingt minutes** : choisis « Trois mille visages », le premier livre, et joue jusqu'au
> premier samedi.
> **Jour 3, quarante minutes** : continue, ou commence un autre livre. Entre dans trois lieux de la
> ville et parle à trois personnes.
> **Jour 7** : finis un livre si tu peux (deux heures environ), puis touche « Ton avis sur cette
> histoire » sur l'écran de fin.

Avec un proche, le meilleur test se fait à côté de lui : le regarder jouer sans l'aider, noter où
il hésite, où il sourit, où il pose le téléphone.

## Le tableau de tri

| Date | Testeur | Appareil | Livre | Type | Gravité | Combien l'ont dit | Statut |
|---|---|---|---|---|---|---|---|

- **Type** : bug, compréhension, rythme, texte, idée.
- **Gravité** : bloquant (on ne peut plus jouer), gênant, détail.
- **L'ordre** : un bug bloquant d'abord ; puis ce que trois testeurs ou plus ont dit ; le reste
  ensuite.
- Les retours bruts se collent par lots dans la session de développement : chaque bug se
  reproduit avec la graine et la carte de son rapport, se corrige, et part dans la version
  suivante (« Bêta 0.2 »).

## Les trois vagues

1. **Semaines 2 et 3** : cinq à dix proches, sur la page du jeu. On cherche ce qui bloque.
2. **Semaines 4 à 6** : trente à cinquante joueurs des communautés (`docs/sortie.md`, « Où les
   trouver »). On mesure où ils décrochent.
3. **Semaines 7 à 10** : cent et plus sur les stores (TestFlight, le test fermé de Google Play).
   La stabilité, les téléphones, et les quatorze jours de Google.

## Ce qu'on promet aux testeurs, et ce qu'il reste à construire

La page du jeu promet le nom au générique, le titre « Membre fondateur » dans le jeu et le jeu
offert à la sortie. Le générique et le titre ne sont pas encore dans le jeu : ils sont à faire
avant la sortie ; le jeu offert se fait avec les codes promotionnels des stores.
