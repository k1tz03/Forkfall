# Le studio : la bande originale jouée par de vrais instruments

> « Pas des bip bip mais des vrais sons, iconiques, captivants, grandiloquents,
> uniques. » (le porteur, octobre 2026)

La première bande originale (vingt thèmes synthétisés en direct par WebAudio,
`docs/design/bande_originale.md`) a été refusée pour son **son** ; sa liste de thèmes
(§ 3) et leur place dans le jeu (§ 4) restent valables. Le studio
(`packages/tools/studio/`) remplace le son : une partition écrite en Python devient,
**hors ligne**, un master mixé et masterisé, joué par de vrais instruments enregistrés
(un orchestre symphonique, de grandes percussions, un chœur, des guitares, un piano,
une batterie) mêlés à de bons synthétiseurs. Le jeu ne joue plus que des fichiers :
le lecteur (`audio.js`, lot « lecteur audio ») lit le master et ses repères.

```
partition (partitions/<clé>.py)
   │  moteur/ecriture.py : notes, accords, motifs, grilles, nuances
   ▼
les pistes : échantillons SFZ │ banques General MIDI (FluidSynth) │ synthèse numpy
   │  humanisation à graine, attaques alignées, legato, pupitres, éclat des cuivres
   ▼
le mélange : égaliseur, saturation, compression, pompe, porte, place sur scène,
   bus par famille, envois vers la salle, la plaque, la pièce, l'écho
   ▼
l'assemblage : introduction + corps + corps (+ queue), la chaîne du master,
   la sonie (−16 LUFS, crête vraie ≤ −1 dBTP)
   ▼
<clé>.wav (44,1 kHz, 24 bits) · <clé>.json (les repères : le contrat) · <clé>.ecoute.mp3
```

## 1. Installer

```bash
bash packages/tools/studio/installer.sh             # outils + échantillons (≈ 2,6 Go)
bash packages/tools/studio/installer.sh --verifier  # ne télécharge rien : dit ce qui manque
```

- Les **échantillons ne vont jamais dans le dépôt** : `installer.sh` les télécharge dans
  `$FUSIBLE_ECHANTILLONS` (par défaut `…/scratchpad/studio/echantillons`), à des commits
  épinglés, en ne prenant que les dossiers utiles ; il vérifie leur licence (CC0, MIT)
  sur les fichiers eux-mêmes. Les sources, leurs versions et leurs licences :
  `packages/tools/studio/LICENCES.md`.
- Les outils : FluidSynth et les deux banques General MIDI (paquets Ubuntu), ffmpeg
  (l'écoute MP3), Python 3 avec numpy, scipy, soundfile, matplotlib (pyloudnorm en
  plus, pour contre-vérifier la sonie). `installer.sh` appelle `python3 -m pip` : sur
  cette machine `pip` vise un autre Python que `python3`.
- Un compilateur C (`cc`) compile `moteur/noyau.c` (le filtre en échelle, les
  lissages des compresseurs, l'écho) une fois, dans `$FUSIBLE_STUDIO_CACHE` (par défaut
  `~/.cache/fusible-studio`). Sans compilateur, des équivalents numpy prennent le
  relais (plus lents, un son très proche mais pas identique au bit).
- La machine est partagée : un rendu complet passe par
  `bash $SP/rendu_verrou.sh <commande>` (deux rendus lourds à la fois, une file équitable).

## 2. Les commandes

```bash
cd packages/tools/studio
# vérifier une partition en une seconde, sans rien rendre : instruments, articulations,
# étendues, pièces de batterie, la carte des sections, la longueur de la boucle
python3 rendre.py partitions/<clé>.py --verifier
# rendre un thème : <clé>.wav, <clé>.json, <clé>.ecoute.mp3 ; --banc le mesure aussi
python3 rendre.py partitions/<clé>.py --out <dossier> --banc --pistes
# travailler un passage : seulement ces sections, en boucle
python3 rendre.py partitions/<clé>.py --out <dossier> --sections B,C --banc
# mesurer un rendu (et ajouter sa ligne à <dossier>/banc.json)
python3 banc.py <dossier>/<clé>.wav
# entendre un instrument seul (une gamme, une note tenue, des brèves, un accord)
python3 audition.py cors violons --out <dossier>
# vérifier les instruments : la hauteur et l'attaque de trois notes de chacun
python3 audition.py --accordage
# la hauteur de chaque échantillon ; --ecrire range les corrections (moteur/accords.json)
python3 audition.py --echantillons [--ecrire]
# la table des instruments de ce document, régénérée depuis le catalogue
python3 audition.py --table
# recalibrer les niveaux (chaque articulation de chaque instrument à −20 LUFS) :
# moteur/niveaux.json, à refaire si les échantillons ou le catalogue changent
python3 banc.py --calibrer
```

`rendre.py --pistes` imprime la sonie de chaque piste dans chaque segment : c'est
l'outil du mélange (on règle les `volume` jusqu'à ce que chaque rôle ait sa place).

## 3. Écrire une partition

Une partition est **un fichier Python par thème** : `partitions/<clé>.py`. Un fichier
dont le nom commence par `_` est un modèle ou un brouillon, pas un thème du jeu. Le
modèle à ouvrir à côté : `partitions/_modele.py` (huit mesures, chaque tournure une
fois, commentée) ; la démonstration complète : `partitions/demo_studio.py`.

### 3.1 Le squelette

```python
from moteur.ecriture import *

theme = Theme('livre_h4', 'La Route de la Rive', bpm=104, mesure='4/4',
              tonalite='fa# mineur', graine=4, ville=True,
              moment='la ville le jour, livre 4', humeur='rouler de nuit')

basse = theme.piste('basse', 'basse_synthe', volume=-3, pompe=pompe(0.5, 0.2, source='kick'))
kick = theme.piste('kick', 'boite_a_rythmes')
cors = theme.piste('cors', volume=-2)              # l'instrument du même nom
violons2 = theme.piste('violons2', 'violons', pan=-0.2, art='tremolo')

APPEL = mel('F#4:1 D5:2 C#5:1 | B4:.75 A4:.25 B4:1 F#4:2')   # un motif nommé

@theme.section('intro', mesures=2)
def intro(s):
    ...

@theme.section('A', mesures=16)
def A(s):
    s.joue(cors, APPEL, a=s.m(5), art='legato')     # à la mesure 5
    s.batterie(kick, 'K : X . . . X . . . X . . . X . . .')
    s.crescendo(violons2, 0, s.longueur, 'p', 'f')

@theme.section('B', mesures=8, bpm=(104, 112))      # une rampe de tempo
def B(s):
    ...

theme.forme(intro=['intro'], corps=['A', 'B', 'A', 'C'])
```

- `Theme(clé, titre, bpm, mesure, tonalite, graine, ville, moment, humeur, boucle_min)` :
  `ville=True` pour un thème joué en ville (le banc exige alors une boucle de 240 s au
  lieu de 150) ; `boucle_min=0` pour une démonstration ou un modèle.
- `theme.piste(nom, instrument, **réglages)` : voir § 5 pour les réglages.
- `@theme.section(nom, mesures, bpm=None, mesure=None, reprise=True)` : la fonction
  écrit la section ; `bpm` change le tempo (un nombre, ou `(début, fin)` pour une rampe
  d'accelerando ou de ritardando) ; `mesure='6/8'` change la mesure ; `reprise=False`
  interdit au jeu de reprendre le thème à cette section (un creux presque muet).
- `theme.forme(intro=[…], corps=[…])` : l'introduction est jouée une fois, le corps
  boucle. Une section peut revenir plusieurs fois ; `s.fois` (0, 1…) dit la quantième.

### 3.2 Le temps et les hauteurs

- Les positions et les durées sont en **temps = noires**, depuis le début de la
  section : une mesure de 4/4 fait 4 temps, une de 6/8 en fait 3. `s.m(3)` est le
  début de la mesure 3, `s.m(3, 2.5)` le milieu de son deuxième temps ; `s.longueur`,
  `s.tpm` (temps par mesure).
- Les hauteurs en lettres, **do central = C4 = 60** : `'D4'`, `'F#2'`, `'Bb3'`. On
  écrit toujours en **sons réels** (le studio transpose lui-même le piccolo, le
  xylophone, le glockenspiel).
- Les vélocités 1..127 (ou une nuance `'mf'`) : elles choisissent la couche
  d'échantillons et la force de l'attaque ; `vel` 64 ≈ −12 dB d'une note à 127.

### 3.3 Les briques (des motifs à poser)

| Brique | Exemple | Ce qu'elle fait |
|---|---|---|
| `mel(texte)` | `mel('D4:1 Bb4:2 A4:1 r:1 C5:1/3')` | hauteur:durée en temps ; `r` un silence ; `D4+F4` un accord ; `!` accent, `?` adouci, `~` glissé (synthés) |
| `seq(texte, pas)` | `seq('D4 - - F4 . A4', pas=0.5)` | une grille de cases : une hauteur attaque, `-` tient, `.` se tait |
| `ostinato(notes, pas, longueur, accents)` | `ostinato('D3 D3 D4 D3', accents='X x x X')` | les notes une par case, répétées ; accents X/x/o |
| `arpege(accord, motif, pas)` | `arpege(['D4','F4','A4'], '1 2 3 4 3 2')` | les rangs dans l'accord (4 = l'octave du 1) |
| `grille(texte, hauteur, pas)` | `grille('X . . x . . x .', 'D2')` | un rythme sur une hauteur (ou une liste qui tourne) |
| `tenue(notes, durée)` | `tenue(['D3','A3','F4'], 8)` | un accord tenu |
| `accords(chiffres, tonalité, durée, octave, rythme, basse)` | `accords('i VI III VII', 'ré mineur')` | la suite d'accords, voix conduites |
| `batterie(texte, pas)` | voir ci-dessous | une ligne par pièce |

```python
s.batterie(kick, '''
    K : X . . . X . . . X . . . X . . .
    S : . . . . X . . . . . . . X . . o
    H : x x x x x x x x x x x x x x x x
''')    # X fort, x moyen, o fantôme, g très doux, 1..9 une vélocité, - tient
```

Les pièces des batteries General MIDI : `K` `K2` grosse caisse, `S` `S2` caisse claire,
`SR` cercle, `CL` claps, `H` charleston fermé, `P` au pied, `O` ouvert, `C` `C2` crash,
`R` ride, `RB` cloche de ride, `SP` splash, `CH` china, `T1`..`T6` toms (du grave à
l'aigu), `TB` tambourin, `CB` cloche, `SH` maracas. La boîte à rythmes synthétique :
`K`, `S`, `CL`, `H`, `O`, `T1`..`T3`.

**Les transformations** (chacune rend un nouveau motif) : `transpose(n)`, `octave(k)`,
`diatonique(pas, tonalité)` (une marche dans la gamme), `inverse(axe)`,
`retrograde()`, `augmente(f)`, `diminue(f)`, `decale(temps)` (le déplacement
rythmique), `vel(100)` ou `vel('+10')`, `art('staccato')`, `repete(n)`,
`remplir(longueur)`, `coupe(début, fin)`, `legato()`, `staccato(rapport)` ; `m1 + m2`
enchaîne, `m1 | m2` superpose.

### 3.4 L'écrivain d'une section (`s`)

| Appel | Ce qu'il fait |
|---|---|
| `s.joue(piste, motif, a=0, fois=1, remplir=False, jusqua=None, vel=None, art=None, transpose=0)` | pose un motif ; `remplir` le répète jusqu'au bout de la section |
| `s.note(piste, 'D4', a, durée, vel, art, **paramètres)` | une note |
| `s.mel(…)`, `s.seq(…)`, `s.accords(piste, 'i VI III VII', octave=4, art='aah')`, `s.batterie(piste, texte)` | les briques, posées directement |
| `s.expression(piste, [(temps, 'p'), (temps, 'f')])` | la courbe d'expression (0..1 ou nuances), droite entre les points |
| `s.crescendo(piste, de, à, 'p', 'f')`, `s.diminuendo(…)`, `s.nuance(piste, 'mf', a)` | ses raccourcis |
| `s.automation(piste, 'coupure', [(temps, 1.0), (temps, 0.25)])` | une courbe libre : `coupure` (le filtre d'un synthé, en multiple), `volume` (dB), `envoi` (multiple des envois) |

L'expression est un gain (puissance 1,2 : `f` ≈ −2 dB, `mf` ≈ −5, `p` ≈ −11, `pp` ≈ −16)
qui vaut 1 jusqu'au premier appel. **Chaque appel** (`nuance`, `crescendo`,
`expression`) tient la valeur de son premier point dès ce point, va en ligne droite
d'un point à l'autre, puis tient son dernier point jusqu'à l'appel suivant : un
crescendo écrit en B ne déborde ni sur A ni sur C, et deux appels ne se rejoignent
jamais en pente. Écrire donc la nuance de chaque section où elle change.

L'expression choisit aussi le **timbre** des instruments échantillonnés : une note
brève jouée `p` prend la couche douce, `f` la forte ; une note tenue sous un crescendo
fond sa couche douce dans sa couche forte (le violon s'éclaire en montant). Le niveau,
lui, vient du gain ci-dessus : on ne double pas la nuance. La vélocité règle l'attaque
et la couche de départ ; ne pas l'abaisser en plus d'une nuance douce (une note
`vel=48` dans une piste `p` est très loin).

### 3.5 La théorie

- `Tonalite('ré mineur')`, `'fa# dorien'`, `'si bémol majeur'`, `'Dm'`, `'Bb'` ; les
  modes : majeur, dorien, phrygien, lydien, mixolydien, mineur (éolien), locrien,
  mineur harmonique, mineur mélodique, phrygien dominant. `ton.degre(n, octave)`,
  `ton.pas_diatonique(note, pas)`.
- `accord('V7', 'ré mineur', octave=3)` : majuscule majeur, minuscule mineur, `°`
  diminué, `+` augmenté, `ø` demi-diminué ; `7`, `maj7`, `9`, `sus2`, `sus4`, `add9`,
  `5` (quinte à vide), `6` ; une **altération se lit sur la gamme majeure de la
  tonique** (en ré mineur comme en ré majeur, `bVI` = si bémol, `bVII` = do) ; `/3`
  `/5` `/7` renversent ; `V7/iv` est la dominante du quatrième degré.
  `accord_nomme('Bb7')`, `progression('i VI III VII', ton, conduite=True)`.

### 3.6 La forme, la boucle, la reprise

Le jeu joue l'introduction une fois, puis le corps sans fin ; retrouvé dans les dix
minutes, il reprend à la section qui suit celle qu'il a quittée. Donc :

- chaque section du corps doit pouvoir **ouvrir le morceau à froid** (le premier temps
  marqué, la basse dès la première mesure) ;
- la dernière mesure du corps **relance** la première (le studio garantit que la
  couture est sans défaut ; elle doit aussi être musicale : le banc mesure le saut de
  niveau, sous 3 dB) ;
- la boucle dure **150 s au moins, 240 s pour un thème de ville**, et varie (des
  sections différentes, un creux toutes les 32 à 64 mesures) ;
- l'introduction est courte (2 à 8 mesures) : elle rejoue à chaque entrée neuve.

## 4. Les instruments

`Sorte` : échantillons (l'orchestre de chambre ou la bibliothèque communautaire,
lus par l'échantillonneur), banque GM (FluidSynth), synthèse (numpy), couches
(plusieurs instruments ensemble). `Articulations (a×b)` : `a` couches de vélocité
traversées par une même note, `b` tours de rôle (une note répétée change
d'échantillon). `Pupitre` : un soliste rejoué en plusieurs prises désaccordées de
quelques cents et décalées de quelques millisecondes. `Place` : le panoramique par
défaut (−1 gauche, +1 droite) / la profondeur (0 devant, 1 au fond). Les étendues sont
en sons réels ; une note hors étendue est jouée depuis l'échantillon le plus proche
(transposé), mais s'éloigne vite du vrai instrument.

| Instrument | Sorte | Étendue | Articulations (couches de vélocité × tours de rôle) | Pupitre | Place | Caractère |
|---|---|---|---|---|---|---|
| `altos` | échantillons | C3–E6 | tenu (2×1), legato (2×1), staccato (2×2), pizzicato (2×1), tremolo (2×1) | — | +0.18 / 0.35 | pupitre d'altos : le milieu sombre des cordes |
| `basses_film` | couches | E1–G3 | tenu, staccato, pizzicato, tremolo | — | +0.50 / 0.40 | les contrebasses de film : le soliste en pupitre et le pupitre de la banque générale sous lui |
| `contrebasses` | échantillons | E1–G3 | tenu (2×1), sans_vibrato (2×1), legato (2×1), staccato (1×1), pizzicato (1×1), tremolo (2×1) | 3 prises | +0.55 / 0.40 | pupitre de contrebasses (un soliste en trois prises) : le sol de l'orchestre |
| `harpe` | échantillons | C1–G7 | pince (1×1) | — | -0.55 / 0.45 | harpe de concert : arpèges, glissandos écrits |
| `pupitre_basses` | banque GM | E1–G3 | tenu, staccato, pizzicato, tremolo | — | +0.55 / 0.45 | pupitre de contrebasses (banque générale) |
| `violoncelles` | échantillons | C2–A5 | tenu (2×1), legato (2×1), staccato (2×2), pizzicato (2×2), tremolo (2×1) | — | +0.35 / 0.30 | pupitre de violoncelles : les ostinatos, le chant grave |
| `violons` | échantillons | G3–C7 | tenu (2×1), legato (2×1), staccato (2×2), pizzicato (2×1), tremolo (2×1) | — | -0.50 / 0.30 | pupitre de violons : vibrato chaud, spiccato mordant |
| `braam` | couches | C1–C4 | tenu | — | +0.10 / 0.50 | le « braam » : trombones, tuba et cors fortissimo, une octave de synthé saturé dessous ; écrire la fondamentale grave (C2..G2), il double à l'octave |
| `cors` | échantillons | A1–F5 | tenu (3×1), legato (3×1), staccato (3×1), sourdine (2×1) | 4 prises | -0.30 / 0.65 | quatre cors à l'unisson : le thème héroïque, rond et lointain |
| `trombones` | échantillons | E2–F5 | tenu (3×1), vibrato (1×1), legato (3×1), staccato (4×1) | 3 prises | +0.40 / 0.60 | trois trombones : le cuivre grave qui gronde |
| `trompettes` | échantillons | F#3–D6 | tenu (2×1), vibrato (2×1), legato (2×1), staccato (3×1), sourdine (2×1) | 2 prises | +0.25 / 0.60 | deux trompettes : l'éclat, les fanfares |
| `tuba` | échantillons | D1–F4 | tenu (3×1), legato (3×1), staccato (2×4) | — | +0.50 / 0.60 | tuba : le fond des cuivres |
| `bassons` | échantillons | A#1–E5 | tenu (2×1), vibrato (2×1), legato (2×1), staccato (2×1) | 2 prises | +0.15 / 0.50 | bassons : le grave boisé, le staccato qui sautille |
| `clarinettes` | échantillons | D3–C7 | tenu (3×1), legato (3×1), staccato (3×1) | 2 prises | -0.08 / 0.50 | clarinettes : le bois rond, souple |
| `flutes` | échantillons | C4–C7 | tenu (1×1), sans_vibrato (2×1), legato (1×1), staccato (3×1) | 2 prises | -0.12 / 0.50 | deux flûtes : l'air, la lumière |
| `hautbois` | échantillons | A#3–G6 | tenu (2×1), sans_vibrato (2×1), legato (2×1), staccato (3×1) | — | +0.10 / 0.50 | hautbois : la plainte, le chant pastoral |
| `piccolo` | échantillons | D5–C8 | tenu (1×1), staccato (1×1) | — | -0.18 / 0.55 | piccolo : la pointe, à petites doses |
| `caisse_claire` | échantillons | — | frappe (5×2), timbre_off (4×2), roulement (3×1), cercle (1×2) | — | +0.05 / 0.70 | caisse claire d'orchestre (timbre) : les marches, les roulements |
| `carillon` | échantillons | — | monte (1×1), descend (1×1), vite (1×1) | — | +0.40 / 0.60 | carillon à tiges : la poussière d'étoiles d'une transition |
| `claps` | échantillons | — | frappe (1×6), seul (4×1) | — | +0.00 / 0.40 | claquements de mains d'un groupe |
| `cloches` | échantillons | C4–F5 | frappe (2×1) | — | +0.30 / 0.80 | cloches tubulaires : le glas, la cérémonie |
| `cymbale_suspendue` | échantillons | — | frappe (4×1), roulement (3×1), monte_2s (1×1), monte_4s (1×1), monte_7s (1×1), archet (1×1) | — | -0.25 / 0.75 | cymbale suspendue : les montées roulées, l'archet qui grince |
| `cymbales` | échantillons | — | frappe (4×2), etouffee (1×1) | — | +0.20 / 0.75 | cymbales frappées : le sommet d'un crescendo |
| `enclume` | échantillons | — | frappe (3×1) | — | +0.20 / 0.50 | enclume : le métal de l'usine |
| `glockenspiel` | échantillons | G5–C8 | frappe (1×1) | — | -0.20 / 0.60 | glockenspiel : la lumière, la boîte à musique |
| `grosse_caisse` | échantillons | — | frappe (7×2), roulement (4×1) | — | +0.10 / 0.80 | grosse caisse de concert : le coup de canon, sept nuances |
| `marimba` | échantillons | C2–C7 | frappe (1×1) | — | -0.10 / 0.55 | marimba : le bois rond qui rebondit |
| `taiko` | couches | C2–C4 | frappe | — | +0.00 / 0.65 | taiko d'ensemble : la grosse caisse de concert, le taiko et un coup grave synthétique (la hauteur écrite accorde le coup) |
| `taiko_gm` | banque GM | C2–C4 | frappe | — | +0.00 / 0.70 | taiko (banque générale) |
| `tam_tam` | échantillons | — | frappe (4×1), gratte (1×1) | — | +0.30 / 0.85 | tam-tam : la fin du monde en une frappe |
| `timbales` | échantillons | C2–C4 | frappe (3×2), roulement (2×1) | — | -0.15 / 0.75 | timbales : frappes à hauteur, roulements qui enflent |
| `toms` | échantillons | C2–C4 | frappe (3×2) | — | -0.10 / 0.70 | tom de concert (accordé par la hauteur écrite, autour de D3) |
| `vibraphone` | échantillons | F3–F6 | frappe (2×1), dure (2×1) | — | -0.15 / 0.50 | vibraphone : la nuit, les néons |
| `xylophone` | échantillons | F4–C8 | frappe (1×1) | — | +0.12 / 0.60 | xylophone : sec, joueur, pointu |
| `celesta` | banque GM | C4–C8 | frappe | — | -0.30 / 0.50 | célesta : le conte, le mystère |
| `orgue` | échantillons | C2–C7 | tenu (1×1), doux (1×1) | — | +0.00 / 0.85 | orgue à tuyaux : la messe, le vertige |
| `piano` | échantillons | A0–C8 | tenu (3×1), pedale (3×1) | — | -0.05 / 0.35 | piano de concert (trois nuances) : la confidence, le martèlement |
| `choeur` | banque GM | C3–C6 | aah, ouh | 2 prises | +0.00 / 0.70 | chœur mixte « aah » / « ouh » : l'épopée, la messe |
| `voix_synthe` | banque GM | C3–C6 | tenu | — | +0.00 / 0.50 | voix de synthèse : un chœur de machine |
| `basse_electrique` | banque GM | E1–G4 | doigts, mediator, slap | — | +0.00 / 0.10 | basse électrique : le groove |
| `guitare_claire` | banque GM | E2–E6 | tenu, etouffee | — | +0.35 / 0.30 | guitare électrique claire : les arpèges de nuit |
| `guitare_saturee` | banque GM | E2–E6 | tenu, crunch, etouffee | — | -0.40 / 0.20 | guitare saturée : les quintes à vide, le mur |
| `batterie` | banque GM | — | kit | — | +0.00 / 0.20 | batterie standard : la pop, le rock léger |
| `batterie_electro` | banque GM | — | kit | — | +0.00 / 0.20 | batterie électronique des années 80 |
| `batterie_jazz` | banque GM | — | kit | — | +0.00 / 0.20 | batterie jazz : les balais du soir |
| `batterie_puissante` | banque GM | — | kit | — | +0.00 / 0.20 | batterie puissante : le stade |
| `batterie_salle` | banque GM | — | kit | — | +0.00 / 0.20 | batterie en pièce : plus d'air |
| `boite_a_rythmes` | synthèse | — | kit | — | +0.00 / 0.10 | boîte à rythmes synthétique : K, S, CL, H, O, T1..T3 (la caisse claire « gated » se fait par la porte de la piste) |
| `boite_analogique` | banque GM | — | kit | — | +0.00 / 0.20 | la boîte à rythmes analogique des années 80 |
| `arpege_synthe` | synthèse | C2–C7 | tenu | — | +0.15 / 0.20 | arpège pincé (scie + impulsion, filtre qui se ferme vite) |
| `basse_reese` | synthèse | E1–C4 | tenu | — | +0.00 / 0.00 | basse « reese » : deux scies qui battent, le grave qui menace |
| `basse_synthe` | synthèse | E1–C4 | tenu | — | +0.00 / 0.00 | basse analogique (scie + carré + sous-basse, filtre qui claque) |
| `cuivre_synthe` | synthèse | C1–C5 | tenu | — | +0.00 / 0.40 | la couche de synthé du « braam » : trois scies saturées, le filtre s'ouvre |
| `lead_synthe` | synthèse | C3–C7 | tenu | — | +0.00 / 0.20 | lead analogique (deux scies, glissando, vibrato tardif) |
| `nappe_gm` | banque GM | C2–C7 | chaude, halo, atmosphere, verre, cordes | — | +0.00 / 0.50 | nappes de la banque générale (chaude, halo, atmosphère, verre frotté, cordes de synthèse) : un fond prêt, moins personnel que nappe_synthe |
| `nappe_synthe` | synthèse | C2–C7 | tenu | — | +0.00 / 0.40 | nappe en grande scie (sept voix désaccordées), lente et large |
| `sub_synthe` | synthèse | E1–C3 | tenu | — | +0.00 / 0.00 | sous-basse (sinus et un peu de deuxième harmonique, pour qu'un téléphone l'entende) |
| `supersaw` | synthèse | C2–C7 | tenu | — | +0.00 / 0.25 | la grande scie : accords plaqués de stade, lead immense |
| `effets` | synthèse | — | montee, impact | — | +0.00 / 0.40 | sons de conception : la montée (dure la note), l'impact |

Ce que l'échantillonneur fait pour qu'un instrument sonne vrai :

- **l'attaque sur le temps** : chaque échantillon est posé pour que son attaque (le
  dixième de sa crête) tombe sur la note écrite ; les cordes et les cuivres tenus sont
  avancés de 15 à 30 ms de plus, le chœur de 90 ms (leurs attaques sont lentes) ;
- **les tours de rôle** (deux prises par note pour les spiccatos, jusqu'à six pour les
  claps) et **les couches** de vélocité ; une note sans échantillon est transposée
  depuis le plus proche (rééchantillonnage polyphasé, sans repliement) ;
- **les notes longues** : au-delà de son échantillon, une note boucle sa partie tenue
  en fondus enchaînés de 0,3 s ;
- **le legato** (`art='legato'`, ou `legato=True` sur la piste) : la note suivante entre
  sans son attaque, en fondu de 70 ms, et la précédente s'efface en 140 ms ;
- **l'éclat des cuivres** : aux fortes vélocités (au-dessus de 72), une saturation
  suréchantillonnée ajoute les harmoniques que les échantillons, enregistrés mezzo,
  n'ont pas (le cor fortissimo gagne 7 à 20 dB entre le 4ᵉ et le 8ᵉ harmonique) ;
  `eclat=0` sur la piste l'éteint ;
- **l'accord** : chaque échantillon des instruments à hauteur nette a été mesuré
  (`audition.py --echantillons`) ; 24 sur 580 s'écartaient de plus de 12 cents et sont
  corrigés (`moteur/accords.json`) ; le piano reste « étiré » (ses aigus plus hauts,
  comme un vrai) ;
- **les niveaux** : chaque articulation de chaque instrument est calibrée à la même
  sonie à vélocité égale (`moteur/niveaux.json`) : passer de `tenu` à `staccato` ne
  change pas le niveau, le mélange part d'un plateau égal.

## 5. Le mélange

### 5.1 Une piste

| Réglage | Exemple | Effet |
|---|---|---|
| `volume` | `-3` | dB, après tout le reste (c'est le fader) |
| `pan`, `largeur` | `pan=-0.4, largeur=0.6` | la place ; une source stéréo est resserrée puis posée (double panoramique), `largeur > 1` l'élargit |
| `profondeur` | `0.7` | recule l'instrument : moins d'aigus (−4 dB × profondeur au-dessus de 6 kHz), plus de salle |
| `salle`, `plaque`, `piece`, `echo` | `salle=0.3, echo=0.25` | les envois (0..1), après le volume |
| `eq` | `{'passe_haut': 90, 'boue': -2, 'presence': 2, 'cloches': [(2500, 1.5, 0.8)]}` | l'égaliseur (aussi `passe_bas`, `grave: (dB, Hz)`, `aigu: (dB, Hz)`, `air`) |
| `sature` | `0.8` | saturation douce suréchantillonnée |
| `comp` | `(-18, 3.0, 0.01, 0.15)` | compresseur (seuil dB, ratio, attaque s, relâche s) |
| `pompe` | `pompe(0.6, 0.18, source='kick')` | le pompage : la piste plonge à chaque note de la piste `kick` (ou `'temps'` : chaque noire) et remonte en 0,18 s |
| `porte` | `porte(duree=0.28)` | la réverbe « gated » : une plaque dense ouverte 0,28 s à chaque coup, fermée net (la caisse claire des années 80) |
| `art`, `legato`, `unisson`, `transpose`, `retard` | `art='tremolo'` | l'articulation par défaut, le legato, les prises du pupitre, la transposition, un retard (s) |
| `humain` | `(9, 6)` ou `0` | l'humanisation : écart de temps (ms) et de vélocité ; à graine fixe (la même note bouge toujours pareil). Par défaut : cordes 9 ms, cuivres 10, bois 8, chœur 12, percussions 4, synthés 0 |
| `synthe` | `{'filtre': {'coupure': 220}}` | un synthé : son patch, champ par champ (`moteur/synthe.py`, `PATCH_DEFAUT`) |
| `bus`, `muet`, `solo`, `mono`, `eclat`, `expression` | `bus='synthes'` | le bus, couper, isoler, mono, l'éclat des cuivres, une expression fixe |

### 5.2 Les bus, les salles, le master

- **La scène** : violons à gauche (−0,5), seconds violons (−0,2), altos (+0,18) et
  violoncelles (+0,35) au centre droit, contrebasses à droite (+0,55) ; cors au centre
  gauche (−0,3), trompettes (+0,25) et trombones (+0,4) au centre droit, tuba (+0,5) ;
  bois au centre ; timbales au fond (profondeur 0,75) ; le chœur large et au fond.
- **Les bus** (un par famille : cordes, cuivres, bois, percussions, claviers, chœur,
  guitares, batterie, synthés, conception) : un passe-haut contre la boue, une
  compression douce (la batterie : 3:1, rapide, un peu saturée) ; `theme.bus(nom, …)`
  les règle.
- **Les salles** (réponses impulsionnelles fabriquées, stéréo, à graine fixe) : la
  `salle` (2,6 s, premières réflexions espacées, les aigus meurent avant les graves),
  la `plaque` (1,7 s, dense, brillante : la batterie, les voix), la `piece` (0,55 s : les
  guitares, la batterie de près) ; leurs retours sont égalisés (rien sous 160 Hz dans
  la salle) ; `theme.salle('salle', rt60=3.2)` les règle. **L'écho** est calé sur le
  tempo (croche pointée par défaut, ping-pong, chaque tour plus sombre) :
  `theme.salle('echo', temps=0.75, retour=0.4, bpm=112)`.
- **Le master** : passe-haut à 24 Hz, une pente douce (+1,5 dB d'air au-dessus de
  8 kHz, −1 dB sous 60 Hz), la colle (2:1, détection RMS, 30 ms / 200 ms), un écrêteur
  doux au-dessus de −2,5 dBFS, le limiteur de **crête vraie** (suréchantillonné ×4,
  anticipation 2 ms, relâche 60 ms, plafond −1,2 dBTP), puis le gain qui met la
  **boucle à −16 LUFS** (itéré à 0,02 LU près). `theme.master(…)` les règle.

### 5.3 Les règles d'un bon mélange (pour un téléphone)

- **Le grave au milieu, et pas seulement du grave** : une ligne de basse doit avoir des
  harmoniques au-dessus de 250 Hz (une scie, une saturation, une octave) ; jamais une
  basse en sinus pur (le banc vérifie la corrélation sous 150 Hz et la part au-dessus
  de 250 Hz) ; la sous-basse des synthés ne descend jamais sous 32 Hz.
- **Une chose devant à la fois** : la mélodie vers −16 LUFS de piste, l'accompagnement
  4 à 8 dB dessous, les nappes 8 à 12 dB dessous (`rendre.py --pistes`).
- **Les grandes percussions sont graves** : taiko, timbales et grosse caisse mangent
  la marge ; une cymbale, une caisse claire ou un charleston les font entendre sur un
  petit haut-parleur.
- **L'espace** : la réverbe sur les cordes, les cuivres, le chœur ; la basse et la
  grosse caisse sèches ; l'écho sur les arpèges et les leads.

## 6. Les cibles (le banc)

| Mesure | Cible | Pourquoi |
|---|---|---|
| sonie intégrée de la boucle | **−16 LUFS ± 0,5** (le studio vise ± 0,03) | le niveau du jeu ; ± 0,5 LU entre thèmes pour qu'un fondu enchaîné ne saute pas |
| crête vraie (tout le master) | **≤ −1 dBTP** | l'encodage MP3 du jeu ajoute des crêtes |
| part de l'énergie au-dessus de 250 Hz | ≥ 25 % | un téléphone n'entend pas le grave |
| part au-dessus de 6 kHz | ≤ 10 % | rien de strident et continu |
| couture : écart entre la fin du second passage et la fin du premier | ≤ −60 dB (le studio rend −240 dB : identique au bit) | sauter de `boucle.fin` à `boucle.debut` = jouer la suite naturelle |
| couture : saut de niveau de part et d'autre du raccord | ≤ 3 dB | la boucle ne doit pas s'entendre |
| corrélation sous 150 Hz | ≥ 0,8 | le grave au milieu |
| durée de la boucle | ≥ 150 s, ≥ 240 s en ville | deux heures d'écoute |

Le banc imprime aussi la sonie par section, la sonie à court terme (fenêtres de 3 s,
la plus basse et la plus haute de la boucle), les quatre bandes, la largeur (côtés /
milieu, corrélation), le clic au raccord, la durée et le temps de rendu, et dessine
`<clé>_spectre.png` (le spectrogramme du master, fréquences logarithmiques, la boucle
en traits bleus) et `<clé>_courbe.png` (la sonie mesure par mesure, les sections en
couleurs, la sonie à court terme, la cible). Sa sonie suit l'UIT-R BS.1770-4 (les
filtres K dérivés exactement pour 44,1 kHz) ; pyloudnorm donne 0,04 LU de moins.

## 7. Le contrat (avec le lecteur du jeu)

Pour un thème `<clé>`, `rendre.py` écrit dans le dossier de sortie :

- `<clé>.wav` : **un master continu**, 44 100 Hz, stéréo, PCM 24 bits : l'introduction,
  le corps, le corps encore, puis la queue (dix secondes : les réverbes qui
  s'éteignent, un fondu de deux secondes à la fin) ;
- `<clé>.json` :

```json
{
  "cle": "demo_studio", "titre": "La démonstration du studio",
  "bpm": 96, "mesure": "4/4", "mesure_s": 2.5, "frequence": 44100,
  "tonalite": "ré mineur", "moment": "…", "humeur": "…", "ville": false,
  "intro": {"debut": 0, "fin": 220500},
  "boucle": {"debut": 4048064, "fin": 7875628},
  "sections": [
    {"nom": "intro", "debut": 0, "fin": 220500, "intro": true, "reprise": false, "rang": 0, "mesures": 2},
    {"nom": "A1", "debut": 4048064, "fin": 4489064, "intro": false, "reprise": true, "rang": 0, "mesures": 4}
  ],
  "reprise": {"sauf": []},
  "lufs": -16.0, "lufs_master": -16.02, "crete_dbtp": -1.2,
  "duree_s": 184.3, "boucle_s": 86.8, "boucle_min_s": 0, "echantillons": 8128000,
  "rendu": {"secondes": 95.2, "secondes_par_minute": 31.0, "pistes": [{"segment": "corps", "piste": "cors", "secondes": 1.1, "lufs": -16.7}]}
}
```

  Toutes les positions sont des **indices d'échantillons dans le master**. `intro` est
  l'introduction ; `boucle` est le **second passage** du corps : ses premiers
  échantillons portent la queue de la fin du corps (les réverbes, les notes qui
  sonnent encore), si bien que boucler `boucle.fin → boucle.debut` est **exactement**
  jouer le corps une troisième fois. `sections` donne chaque section de l'introduction,
  puis chaque section du corps **dans le second passage** (une section jouée deux fois
  dans le corps y paraît deux fois, `rang` les distingue) ; `reprise: false` (et
  `reprise.sauf`) : le jeu ne reprend jamais le thème là. `bpm` et `mesure_s` sont ceux
  de la première section du corps (un thème peut changer de tempo : les sections, elles,
  sont exactes). `lufs` : la sonie de la boucle ; `crete_dbtp` : la crête vraie du
  master entier ;
- `<clé>.ecoute.mp3` : pour les oreilles : du début à la fin du premier passage, puis
  six secondes du second en fondu (on entend la couture).

Comment le studio garantit la couture : l'introduction et le corps sont rendus
**chacun une fois**, avec leurs queues ; le master pose l'introduction, le corps, le
corps encore (les queues débordent sur ce qui suit) ; la pré-attaque du début du corps
(les attaques qui commencent avant le temps) est posée aussi à la fin du second
passage ; la chaîne du master, qui anticipe de quelques millisecondes, traite une ligne
à trois passages jusqu'à `boucle.fin`, puis la queue d'une ligne à deux passages
(raccord en 30 ms après la boucle). Le banc vérifie : la fin du second passage est
identique au bit à la fin du premier.

## 8. Le déterminisme et la vitesse

- **Même partition, même son** : aucun hasard sans graine (l'humanisation tire de la
  graine du thème, de la piste, du segment et du rang de la note ; les synthés de la
  note elle-même ; les salles de leur propre graine) ; chaque piste General MIDI est
  rendue dans un FluidSynth neuf (un synthé qui a déjà joué gardait des états :
  −90 dB d'écart d'un rendu à l'autre, −30 dB après une autre piste). Deux rendus de la
  démonstration sont identiques au bit (§ 9).
- **La vitesse** : de 30 à 40 secondes de calcul par minute de master sur la machine
  partagée (le rendu d'une piste prend de 0,1 à 1,2 s par minute ; la chaîne du master
  et les salles, le reste).

## 9. La démonstration

`partitions/demo_studio.py`, environ 90 secondes (une introduction de 5 s, un corps
de 87 s) : (a) un crescendo épique hybride — ostinato des violoncelles et contrebasses
en doubles croches, l'appel aux quatre cors, taiko et timbales, le « braam », le chœur,
la sous-basse ; (b) les néons — basse en scie qui pompe, arpège en écho, caisse claire
« gated », le même appel au lead analogique ; (c) la place — pizzicati, flûtes et
clarinettes, glockenspiel, basse qui rebondit, batterie légère, cadence bVI – bVII – I ;
(d) le tutti final et la tierce picarde. Les mesures du banc et les chemins des fichiers
rendus sont dans le rapport du lot studio.

## 10. Ce qui sonne encore artificiel, et comment l'éviter

- **Le chœur** vient d'une banque General MIDI : juste, mais générique de près. Le
  garder en nappe (« aah » / « ouh »), au fond (`profondeur` 0,7, la salle), sous les
  cordes ; jamais seul en premier plan, jamais en notes rapides.
- **Les pupitres fabriqués** (cors à quatre, contrebasses à trois) : un unisson de
  prises désaccordées ; au-delà de quatre prises le son « phase ». Pour un vrai
  pupitre de contrebasses, `basses_film` double le soliste par le pupitre de la banque
  générale.
- **Le legato** est un fondu entre deux notes, pas une vraie liaison enregistrée : il
  sonne bien jusqu'à la croche à 120 ; plus vite, écrire `staccato`.
- **Les notes répétées** n'ont que deux prises (spiccato) : un ostinato de doubles
  croches sur une seule note devient mécanique au-delà de deux mesures. Varier les
  hauteurs (l'octave, la quinte), les accents (`accents='X x x X x x X x'`), l'humanisation.
- **Le crescendo** d'une note tenue est un gain : son timbre ne s'éclaire pas. Pour un
  vrai crescendo, enchaîner deux notes (la seconde à une vélocité plus haute) ou doubler
  par un roulement de cymbale.
- **Les guitares et la basse électrique** viennent de la banque générale : utiles en
  accompagnement (quintes saturées, arpèges clairs), faibles en solo.
- **Les instruments hors étendue** : une note sous la plus grave de la bibliothèque est
  transposée et perd son timbre ; rester dans les étendues du § 4.
- **Les cuivres doux** (vélocité < 72) gardent le timbre mezzo des échantillons ; leur
  éclat ne vient qu'aux fortes vélocités.
- **La boîte à rythmes** est synthétique : la grosse caisse et la caisse claire gagnent
  à être doublées par la `caisse_claire` ou la `grosse_caisse` de l'orchestre.

## 11. L'arborescence

```
packages/tools/studio/
  installer.sh          outils + échantillons (épinglés, vérifiés), jamais dans le dépôt
  LICENCES.md           chaque source, sa version, sa licence
  rendre.py             partition → master, repères, écoute (et le banc)
  banc.py               les mesures, les images, la calibration des niveaux
  audition.py           un instrument seul, l'accord, la table des instruments
  partitions/           un fichier par thème ; _modele.py, demo_studio.py
  moteur/
    ecriture.py         ce qu'une partition importe : Theme, motifs, briques, nuances
    theorie.py          notes, tonalités, modes, accords par chiffres romains
    instruments.py      le catalogue (noms français), les quatre sortes d'instruments
    echantillonneur.py  le lecteur SFZ : couches, tours de rôle, boucles, legato
    fluide.py           FluidSynth par ctypes (les banques General MIDI)
    synthe.py           la synthèse : oscillateurs, filtre, montées, impacts, boîte à rythmes
    dsp.py              filtres, saturation, compresseur, limiteur, salles, sonie
    noyau.c, noyau.py   les boucles échantillon par échantillon (compilées en cache)
    rendu.py            segments, pistes, bus, envois, assemblage, master
    export.py           le WAV, le JSON, l'écoute MP3
    niveaux.json        les niveaux calibrés (banc.py --calibrer)
    accords.json        les corrections d'accord (audition.py --echantillons --ecrire)
```
