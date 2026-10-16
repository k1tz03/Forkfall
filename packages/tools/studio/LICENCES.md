# Le studio : les sources et leurs licences

Les échantillons et les banques de sons ne sont **jamais** versés dans le dépôt :
`installer.sh` les télécharge (commits et paquets épinglés) dans
`$FUSIBLE_ECHANTILLONS`, et vérifie leur licence sur les fichiers eux-mêmes. Seules
des sources CC0, du domaine public ou MIT sont admises : elles permettent l'usage
commercial dans un jeu sans obligation de mention. Ce que le jeu embarque, ce sont
des enregistrements rendus par le studio, jamais les échantillons.

## Les échantillons

| Source | Version épinglée | Licence (vérifiée) | Ce qu'on en prend |
|---|---|---|---|
| Versilian Studios Chamber Orchestra 2, Community Edition — <https://github.com/sgossner/VSCO-2-CE> | branche des cartographies SFZ, commit `6dd651d55dde97fd4028699be9d4481f26917891` | **CC0 1.0 Universal** (fichier `LICENSE` du dépôt, contrôlé par `installer.sh`) | pupitres de violons, d'altos, de violoncelles ; contrebasse ; harpe ; cor, trompette, trombone, tuba ; flûte, piccolo, hautbois, clarinette, basson ; timbales, marimba, xylophone, percussions d'orchestre ; leurs fichiers `.sfz` (≈ 1,5 Go) |
| Versilian Community Sample Library — <https://github.com/sgossner/VCSL> | branche des cartographies SFZ, commit `dfcf4a4918771eee884b96ad4493de82ef84daf6` ; le texte de la licence au commit `c1ea7bcc3c7309650ab0da9d15c9cd1fbc4a4c7e` de la branche principale | **CC0 1.0 Universal** (fichier `LICENSE` ; le README le dit : « no royalties, no credit, no special terms ») | piano à queue (le dossier « Grand Piano, S… », sans pédale, et ses relâchements), orgue à tuyaux, grosses caisses de concert, caisses claires, toms, cymbales frappées et suspendue, tam-tam, charleston, claps, cloches tubulaires, glockenspiel, vibraphone, carillon à tiges, enclume, tambourin, shaker (≈ 1,1 Go) |

Le `Readme.txt` de l'orchestre de chambre **demande** (sans l'imposer : la licence est
CC0) de ne pas revendre les échantillons tels quels et de citer la source « là où
c'est possible ». Le studio ne redistribue aucun échantillon ; une mention dans les
crédits du jeu est une courtoisie possible, pas une obligation.

## Les banques General MIDI (FluidSynth)

| Source | Version épinglée | Licence (vérifiée) | Ce qu'on en prend |
|---|---|---|---|
| Banque générale « MuseScore General » (`/usr/share/sounds/sf2/MuseScore_General_Full.sf2`) | paquet Ubuntu 24.04 `musescore-general-soundfont-lossless` 0.2.1-1 | **MIT**, avec des parties CC0 et domaine public (fichier `copyright` du paquet, contrôlé par `installer.sh`) | chœur « aah » et « ouh », voix de synthèse, guitares, basse électrique, batteries complètes, pupitre de contrebasses, taiko, célesta |
| Banque de secours « Fluid R3 » (`/usr/share/sounds/sf2/FluidR3_GM.sf2`) | paquet Ubuntu 24.04 `fluid-soundfont-gm` 3.1-5.3 | **MIT** (fichier `copyright` du paquet) | rien par défaut : `banque_sf='secours'` pour un instrument qui la préférerait |

## Les réponses impulsionnelles

Aucune n'est téléchargée : la salle, la plaque et la pièce sont **fabriquées** par
`moteur/dsp.py` (`reponse`) à partir de bruit filtré à graine fixe. Rien à licencier.

## Les outils (leur licence ne lie pas le son qu'ils rendent)

| Outil | Licence | Usage |
|---|---|---|
| Python 3.11 | PSF | le studio |
| numpy, scipy | BSD-3 | le calcul |
| soundfile (libsndfile) | BSD-3 (LGPL-2.1, bibliothèque chargée dynamiquement) | lire et écrire les WAV |
| matplotlib | licence matplotlib (de type PSF, permissive) | les images du banc |
| pyloudnorm | MIT | facultatif : contre-vérifier la sonie du banc (écart mesuré : 0,04 LU) |
| FluidSynth (libfluidsynth 2.3.4) | LGPL-2.1 | appelé par ctypes : une bibliothèque chargée, rien n'est lié au studio |
| ffmpeg (libmp3lame) | LGPL / GPL selon la compilation | programme externe : il encode l'écoute MP3 |
| un compilateur C (cc) | — | compile `moteur/noyau.c` (le studio) dans un cache ; sans lui, des équivalents numpy |

Le studio n'importe **aucune** bibliothèque GPL (en particulier pas la bibliothèque
d'effets audio sous GPL-3 que l'on trouve sur PyPI : les effets sont écrits ici, en
numpy et en C).
