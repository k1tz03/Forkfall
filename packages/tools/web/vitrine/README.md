# La vitrine du jeu

La page publique de FUSIBLE : la porte d'Aubérive de nuit, la bande-annonce, les dix livres (les
cartouches de l'accueil du jeu, leur heure et leur couleur), la ville, la bêta, les mentions. Une
seule page, la police pixel embarquée, aucune requête vers un tiers.

```bash
python3 packages/tools/web/vitrine/assembler.py --promo <livrables de la promo> --out <dossier> [--artefact]
```

`<livrables de la promo>` est le dossier que rend `packages/tools/web/promo/` (la bande-annonce
`bandes_annonces/jeu.16x9.mp4`, les captures `captures/jeu/apple/`). Il faut ImageMagick et ffmpeg.
Le dossier de sortie (≈ 13 Mo, la vidéo comprise) se sert tel quel. `--artefact` écrit aussi
`artefact.html`, l'aperçu pour claude.ai, sans en-tête.

## Avant la mise en ligne

Dans `index.html`, en tête :

- `fusible-beta` : l'adresse du formulaire d'inscription (`https://…`). Vide, les boutons disent
  « Inscriptions bientôt ».
- `fusible-editeur` et `fusible-contact` : les mentions légales (le nom de l'éditeur, une adresse
  de contact). Vides, le pied dit qu'elles sont à compléter.
- `fusible-reseaux` : les adresses des comptes, séparées par des espaces.
- `og:image` : une adresse complète (`https://votre-domaine/images/apercu.jpg`), pour que l'aperçu
  du lien s'affiche sur les réseaux.

La page dit « Ton adresse ne sert qu'à t'envoyer la bêta et à te prévenir de la sortie » : le
formulaire doit tenir cette promesse.

## Ce qui vient d'où

- Les dix livres : le titre, le rôle et l'année de `content/postulats.yaml`, l'heure et la couleur
  de la table `HISTOIRES` du jeu (`preview_template.html`). Un livre qui arrive s'ajoute à la liste
  `LIVRES` de `page.html`.
- Les images : `packages/tools/web/accueil/` (les couvertures et le panorama de nuit),
  `packages/tools/web/pwa/apercu.jpg`, et trois captures des stores : la ville, le samedi, la porte.
  Pas l'écran des cartes, qui va changer.
