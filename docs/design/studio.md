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
# le test du téléphone : la phrase d'un instrument en mono, 400 Hz–6 kHz, la note lue
# trame par trame contre la note écrite (§ 4.2)
python3 audition.py foule --telephone --out <dossier>
# la hauteur de chaque échantillon ; --ecrire range les corrections (moteur/accords.json)
python3 audition.py --echantillons [--ecrire]
# la table des instruments de ce document, régénérée depuis le catalogue
python3 audition.py --table
# recalibrer les niveaux (§ 4.1) : l'égalisation des zones (moteur/zones.json), puis
# chaque articulation en contexte (moteur/niveaux.json) ; à refaire si les échantillons
# ou le catalogue changent (≈ 16 min avec --travaux 2, sous le verrou en VERROU_POIDS=2 ;
# des noms d'instruments : ceux-là seulement, les autres gardent leurs lignes)
python3 banc.py --calibrer [instrument…] [--travaux 2] [--out <dossier>]
# la preuve : la sonie en contexte de chaque articulation, registre par registre
python3 banc.py --niveaux [instrument…] --out <dossier>
# ce qui a changé entre deux états du studio (deux sorties de --niveaux)
python3 banc.py --comparer <avant>/niveaux.json <après>/niveaux.json
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

theme.forme(intro=['intro'], corps=['A', 'B', 'A'])   # A revient : s.fois vaut 0 puis 1
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

`Sorte` : échantillons (l'orchestre de chambre ou la bibliothèque communautaire, lus
par l'échantillonneur), banque GM (FluidSynth), synthèse (numpy), couches (plusieurs
instruments ensemble), fabriqué (la foule du stade et ses mains, § 4.2).
`Articulations (a×b)` : `a` couches de vélocité traversées par une même note, `b`
tours de rôle (une note répétée change d'échantillon). `Pupitre` : un soliste rejoué
en plusieurs prises désaccordées de quelques cents et décalées de quelques
millisecondes. `Place` : le panoramique par défaut (−1 gauche, +1 droite) / la
profondeur (0 devant, 1 au fond). Les étendues sont en sons réels ; une note hors
étendue est jouée depuis l'échantillon le plus proche (transposé), mais s'éloigne vite
du vrai instrument.

| Instrument | Sorte | Étendue | Articulations (couches de vélocité × tours de rôle) | Pupitre | Place | Caractère |
|---|---|---|---|---|---|---|
| `altos` | échantillons | C3–E6 | tenu (2×1), legato (2×1), staccato (2×2), pizzicato (2×1), tremolo (2×1) | — | +0.18 / 0.35 | pupitre d'altos : le milieu sombre des cordes |
| `basses_film` | couches | E1–G3 | tenu, staccato, pizzicato, tremolo | — | +0.50 / 0.40 | les contrebasses de film : le soliste en pupitre et le pupitre de la banque générale sous lui |
| `contrebasse_jazz` | banque GM | E1–G3 | pince | — | +0.05 / 0.20 | contrebasse pincée du bal : la marche souple, le demi-temps de la nuit |
| `contrebasses` | échantillons | E1–G3 | tenu (2×1), sans_vibrato (2×1), legato (2×1), staccato (1×1), pizzicato (1×1), tremolo (2×1) | 3 prises | +0.55 / 0.40 | pupitre de contrebasses (un soliste en trois prises) : le sol de l'orchestre |
| `harpe` | échantillons | C1–G7 | pince (1×1) | — | -0.55 / 0.45 | harpe de concert : arpèges, glissandos écrits |
| `pupitre_basses` | banque GM | E1–G3 | tenu, staccato, pizzicato, tremolo | — | +0.55 / 0.45 | pupitre de contrebasses (banque générale) |
| `violoncelles` | échantillons | C2–A5 | tenu (2×1), legato (2×1), staccato (2×2), pizzicato (2×2), tremolo (2×1) | — | +0.35 / 0.30 | pupitre de violoncelles : les ostinatos, le chant grave |
| `violons` | échantillons | G3–C7 | tenu (2×1), legato (2×1), staccato (2×2), pizzicato (2×1), tremolo (2×1) | — | -0.50 / 0.30 | pupitre de violons : vibrato chaud, spiccato mordant |
| `braam` | couches | C1–C4 | tenu | — | +0.10 / 0.50 | le « braam » : trombones, tuba et cors fortissimo, une octave de synthé saturé dessous ; écrire la fondamentale grave (C2..G2), il double à l'octave |
| `cors` | échantillons | A1–F5 | tenu (3×1), legato (3×1), staccato (3×1), sourdine (2×1) | 4 prises | -0.30 / 0.65 | quatre cors à l'unisson : le thème héroïque, rond et lointain |
| `trombones` | échantillons | E2–F5 | tenu (3×1), vibrato (1×1), legato (3×1), staccato (4×1) | 3 prises | +0.40 / 0.60 | trois trombones : le cuivre grave qui gronde |
| `trompettes` | échantillons | F#3–D6 | tenu (2×1), vibrato (2×1), legato (2×1), staccato (3×1), sourdine (2×1), harmon (2×1) | 2 prises | +0.25 / 0.60 | deux trompettes : l'éclat, les fanfares |
| `tuba` | échantillons | D1–F4 | tenu (3×1), legato (3×1), staccato (2×4) | — | +0.50 / 0.60 | tuba : le fond des cuivres |
| `bassons` | échantillons | A#1–E5 | tenu (2×1), vibrato (2×1), legato (2×1), staccato (2×1) | 2 prises | +0.15 / 0.50 | bassons : le grave boisé, le staccato qui sautille |
| `clarinettes` | échantillons | D3–C7 | tenu (3×1), legato (3×1), staccato (3×1) | 2 prises | -0.08 / 0.50 | clarinettes : le bois rond, souple |
| `flutes` | échantillons | C4–C7 | tenu (1×1), sans_vibrato (2×1), legato (1×1), staccato (3×1) | 2 prises | -0.12 / 0.50 | deux flûtes : l'air, la lumière |
| `hautbois` | échantillons | A#3–G6 | tenu (2×1), sans_vibrato (2×1), legato (2×1), staccato (3×1) | — | +0.10 / 0.50 | hautbois : la plainte, le chant pastoral |
| `piccolo` | échantillons | D5–C8 | tenu (1×1), staccato (1×1) | — | -0.18 / 0.55 | piccolo : la pointe, à petites doses |
| `sifflet` | banque GM | C5–C7 | tenu | — | +0.10 / 0.40 | sifflet : quelqu'un qui siffle en marchant |
| `applaudissements` | fabriqué | — | mesure, ovation | — | +0.00 / 0.20 | une tribune qui frappe dans ses mains : en mesure (chaque note, un coup) ou l'ovation qui enfle pendant la note |
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
| `piano_electrique` | banque GM | E1–G6 | lames, fm, desaccorde | — | +0.00 / 0.30 | piano électrique à lames : la nuit, le bar, les néons |
| `choeur` | banque GM | C3–C6 | aah, ouh | 2 prises | +0.00 / 0.70 | chœur mixte « aah » / « ouh » : l'épopée, la messe |
| `foule` | fabriqué | G2–E4 | o, ah, rumeur | — | +0.00 / 0.20 | la foule du stade : des milliers d'hommes à l'unisson sur « o » ou « ah », de loin, la rumeur dessous ; `rumeur` seule |
| `voix_synthe` | banque GM | C3–C6 | tenu | — | +0.00 / 0.50 | voix de synthèse : un chœur de machine |
| `basse_electrique` | banque GM | E1–G4 | doigts, mediator, slap | — | +0.00 / 0.10 | basse électrique : le groove |
| `guitare_claire` | banque GM | E2–E6 | tenu, etouffee | — | +0.35 / 0.30 | guitare électrique claire : les arpèges de nuit |
| `guitare_nylon` | banque GM | E2–B5 | tenu | — | -0.30 / 0.30 | guitare à cordes de nylon : les arpèges pincés du jour |
| `guitare_saturee` | banque GM | E2–E6 | tenu, crunch, etouffee | — | -0.40 / 0.20 | guitare saturée : les quintes à vide, le mur |
| `batterie` | banque GM | — | kit | — | +0.00 / 0.20 | batterie standard : la pop, le rock léger |
| `batterie_balais` | banque GM | — | kit | — | +0.00 / 0.20 | les balais : S frappe, CL claque, S2 frottement (un balai qui tourne, une demi-seconde), K grosse caisse feutrée ; la promenade |
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
  claps) et **les couches** de vélocité ; une note brève répétée varie en plus d'une
  prise à l'autre (± 3 cents, jusqu'à −0,9 dB, en cycle de cinq : fixe, donc identique
  d'un rendu à l'autre) ; une note sans échantillon est transposée depuis le plus
  proche (rééchantillonnage polyphasé, sans repliement) ;
- **les notes longues** : au-delà de son échantillon, une note boucle sa partie tenue
  en fondus enchaînés de 0,3 s ;
- **le legato** (`art='legato'`, ou `legato=True` sur la piste) : la note suivante entre
  sans son attaque, en fondu de 70 ms, et la précédente s'efface en 140 ms ;
- **l'éclat des cuivres** : aux fortes vélocités (au-dessus de 72), une saturation
  suréchantillonnée ajoute les harmoniques que les échantillons, enregistrés mezzo,
  n'ont pas (le cor fortissimo gagne 7 à 20 dB entre le 4ᵉ et le 8ᵉ harmonique) ; la
  note garde son énergie (pondérée K) : l'éclat change le timbre, pas le niveau, qui
  suit la vélocité comme dans les autres familles ; `eclat=0` sur la piste l'éteint ;
- **l'accord** : chaque échantillon des instruments à hauteur nette a été mesuré
  (`audition.py --echantillons`) ; 24 sur 580 s'écartaient de plus de 12 cents et sont
  corrigés (`moteur/accords.json`) ; le piano reste « étiré » (ses aigus plus hauts,
  comme un vrai) ;
- **les niveaux** : chaque zone des bibliothèques est égalisée et chaque articulation
  calibrée en contexte (§ 4.1) : à vélocité égale, une phrase garde son niveau quand
  elle change d'articulation ou de registre, le mélange part d'un plateau égal.

### 4.1 Les niveaux : ce que la calibration mesure

La promesse : **à vélocité égale, une phrase garde son niveau quand on change
d'articulation (tenu, staccato, legato, sourdine, trémolo…) et quand elle monte ou
descend dans l'étendue.** `python3 banc.py --calibrer` la tient par deux tables, rangées
dans le dépôt et relues à chaque rendu.

1. **Les zones** (`moteur/zones.json`). Les bibliothèques ont été enregistrées zone par
   zone à des niveaux inégaux, et leurs cartes SFZ en rajoutent (des couches fortes plus
   faibles que les douces, deux tours de rôle d'une même couche réglés à 0 et à
   +12 dB) : à vélocité égale, une note de trompette staccato sonnait 17 dB plus fort à
   ré 5 qu'à fa♯ 3, une note tenue de contrebasse 13 dB plus fort à la 2 qu'à mi 2. Chaque
   région — un échantillon d'une note, d'une couche de vélocité, d'un tour de rôle — est
   jouée seule, avec les prises du pupitre et l'égaliseur de la piste : une croche à 120
   (son énergie, queue comprise, ramenée à sa place dans une suite de croches) et une
   note tenue 4 s (mesurée comme les figures, jusqu'à 1,6 s après sa fin) ; un gain la
   ramène à la médiane de sa banque. Une banque tenue a deux gains par région, celui des
   notes brèves et celui des notes tenues, et le gain d'une note glisse de l'un à
   l'autre avec sa durée (de 0,25 à 4 s) : un archet lent (les violons tenus perdaient
   4,5 dB en croches), un trémolo qui part d'un accent sonnent au même niveau en croches
   et en rondes. Le gain se pose **après** le choix de la couche : il ne change jamais
   le timbre (baisser la vélocité d'une zone trop forte changerait sa couche). Les
   banques générales et les synthés, qui n'ont pas d'échantillons à nous, ont un gain
   par demi-ton, mesuré à vélocité 64, 96 et 120 et interpolé entre elles (dans l'aigu,
   la nappe « atmosphère » prend 8,6 dB de v88 à v112, trois fois plus que dans le
   grave) : à 96, chaque demi-ton est ramené à la médiane du programme ; à 64 et 120, à
   la loi de vélocité de l'échantillonneur, (v/127)² (les synthés gardent la leur, la
   médiane de leurs demi-tons à chaque vélocité). Le pupitre de contrebasses de la
   banque générale superpose deux prises voisines d'une même note, l'une démarrée plus
   loin dans l'échantillon quand la vélocité monte : elles s'ajoutent ou s'annulent, et
   une note brève sautait de 4 à 7 dB d'une vélocité à la suivante (v98 −11,5, v100
   −18,7, v102 −11,6 LUFS). Son tenu et son staccato ne jouent plus que huit vélocités
   (16, 32 … 112, 127), mesurées une à une, et l'écart à la vélocité écrite devient un
   gain. Les clés de la table sont des empreintes : les noms des fichiers des
   bibliothèques ne s'écrivent pas dans le dépôt.
2. **Les articulations** (`moteur/niveaux.json`). Chaque articulation est jouée par une
   piste du studio (l'instrument, son égaliseur, sa profondeur, sa place : ce que
   `rendre.py --pistes` mesure) sur des figures : une ligne et un accord de croches, une
   ligne de doubles croches à 120, une note et un accord tenus deux mesures ; dans le
   grave, le médium et l'aigu de l'étendue ; à vélocité 64, 96 et 120. Le gain met la
   moyenne à **−20 LUFS pour une voix à vélocité 100** (un accord de trois sons à −15,2).
   Une articulation brève est mesurée sur les suites ; une tenue sur les notes tenues, et
   aussi sur les suites quand l'instrument a des articulations brèves (c'est sur les
   mêmes croches que tenu et staccato doivent sonner pareil) ; le legato, et le tenu et
   le trémolo du pupitre de la banque générale (une attaque lente : 0,2 à 0,6 s), sans
   les doubles croches (§ 10). Le piano et l'arpège de synthé, tenus sur le papier mais qui
   s'éteignent, sont mesurés en suites.
3. **Trois règles du moteur** rendent ces mesures vraies dans un thème : une note brève
   des cordes, des cuivres et des bois suivie d'une autre à moins d'une croche à 120 est
   baissée d'autant (ses échantillons portent la queue de leur salle d'enregistrement :
   dans une suite rapide, ces queues s'empilaient, +3 dB à chaque fois que le débit
   double, quand une suite de notes tenues garde son niveau) ; `bref` rend à la note
   coupée l'énergie de la note entière (au plus +6 dB) ; l'éclat des cuivres garde
   l'énergie de la note (il ajoutait 2,5 dB à vélocité 96 et 5 dB à 120).

Les percussions sans hauteur, les batteries et les sons de conception gardent leur mesure
d'origine (une frappe, un roulement, un motif, à −20 LUFS de sonie maximale sur 400 ms) :
leurs articulations sont des gestes différents (un cercle n'est pas une frappe), pas des
façons de jouer une note.

**La preuve** : `python3 banc.py --niveaux --out <dossier>` rejoue toutes ces figures
avec les tables en place et imprime, par instrument, la sonie de chaque articulation à
chaque vélocité, l'écart entre ses articulations et l'écart d'un registre à l'autre.
Mesuré en octobre 2026 sur 43 instruments à hauteur, 104 articulations, 3 312 cases
(registre × figure × vélocité) :

| | Le studio d'origine | Aujourd'hui |
|---|---|---|
| Entre les articulations d'un instrument (même registre, figure, vélocité) : médiane · 9 cases sur 10 · la pire | 4,8 · 13,1 · 23,8 dB | 0,9 · 2,3 · 5,0 dB |
| Cases où toutes les articulations tiennent dans 4 dB (± 2) | 42 % | 99 % |
| Sur l'étendue (grave, médium, aigu d'une articulation) : médiane · 9 sur 10 · la pire | 4,6 · 12,6 · 23,9 dB | 0,7 · 2,1 · 5,1 dB |
| Une articulation à ± 2 dB de la moyenne de son instrument | 61 % (la pire à 14,0 dB) | 99 % (la pire à 3,0 dB) |

Le pire écart entre articulations, par instrument (v64 / v96 / v120), avant → après :
trompettes 20,9 / 19,5 / 19,8 → 1,5 / 2,0 / 2,1 ; trombones 22,6 / 23,8 / 23,6 → 2,8 /
2,4 / 2,7 ; cors 15,3 / 12,3 / 12,5 → 2,6 / 3,6 / 3,6 ; contrebasses 19,5 / 19,9 / 19,9
→ 5,0 / 4,8 / 4,8 ; flûtes 20,1 / 12,7 / 12,7 → 2,9 / 3,5 / 3,5 ; violons 13,7 / 11,8 /
11,8 → 4,0 / 2,8 / 2,8 ; nappes de la banque générale 20,7 / 19,5 / 12,2 → 3,0 / 2,7 /
0,6. Ce qui dépasse encore ± 2 dB est au § 10. La vélocité suit partout la loi de
l'échantillonneur, (v/127)², 10,9 dB de v64 à v120 (les banques générales aussi, qui
prenaient de 7,8 à 13,6 dB) ; sauf les synthés (2 à 3,5 dB : la vélocité y ouvre surtout
le filtre, le niveau se règle au fader ou à l'expression), l'orgue (aucune : un orgue ne
répond pas à la frappe) et les toms (15 dB).

**Ce qui a changé pour un fader réglé avant** (`banc.py --comparer` le refait entre deux
états) : la sonie en contexte de chaque articulation, la moyenne des figures et des
vélocités, puis par registre (grave / médium / aigu) ; une piste réglée sur l'ancienne
calibration se corrige de l'opposé (une piste de tuba tenu montée de +7 dB pour sortir du
grave redescend d'autant). Les percussions sans hauteur, les batteries et les sons de
conception n'ont pas bougé (± 0,2 dB).

| Instrument | Articulation : après − avant, dB (grave / médium / aigu) |
|---|---|
| `altos` | tenu **+1,2** (+2 / 0 / +2) · legato **+1,0** (+2 / 0 / +1) · staccato **−1,5** (+1 / −2 / −3) · pizzicato **+2,2** (+1 / +2 / +3) · tremolo **+1,0** (+3 / +1 / −1) |
| `arpege_synthe` | tenu **−1,6** (−1 / −1 / −3) |
| `basse_electrique` | doigts **+2,7** (+3 / +3 / +2) · mediator **+2,0** (+2 / +3 / +1) · slap **+2,9** (+1 / +4 / +4) |
| `basse_reese` | tenu **+0,1** (+1 / 0 / −1) |
| `basse_synthe` | tenu **+1,0** (+2 / +1 / 0) |
| `basses_film` | tenu **+2,8** (+5 / +1 / +3) · staccato **−4,8** (−4 / −7 / −4) · pizzicato **−9,5** (−8 / −13 / −8) · tremolo **−3,7** (−1 / −5 / −5) |
| `bassons` | tenu **−1,1** (+1 / −1 / −3) · vibrato **−1,2** (−1 / −2 / −1) · legato **−0,9** (+1 / −1 / −3) · staccato **+6,4** (+7 / +8 / +4) |
| `braam` | tenu **−1,7** (+1 / −1 / −6) |
| `celesta` | frappe **−0,1** (0 / 0 / 0) |
| `choeur` | aah **+1,4** (+3 / +2 / 0) · ouh **+4,4** (+6 / +5 / +3) |
| `clarinettes` | tenu **+2,6** (+9 / +2 / −3) · legato **+3,0** (+8 / +2 / −1) · staccato **+1,9** (+7 / +2 / −3) |
| `cloches` | frappe **−2,0** (−1 / −2 / −2) |
| `contrebasses` | tenu **+4,5** (+7 / +3 / +4) · sans_vibrato **+1,9** (+4 / 0 / +1) · legato **+3,8** (+7 / +3 / +2) · staccato **−4,1** (−2 / −7 / −3) · pizzicato **−9,6** (−7 / −12 / −9) · tremolo **−3,0** (+1 / −5 / −5) |
| `cors` | tenu **+3,2** (+7 / +6 / −4) · legato **+3,9** (+8 / +6 / −3) · staccato **−2,5** (+4 / −1 / −10) · sourdine **−2,1** (+5 / −3 / −8) |
| `cuivre_synthe` | tenu **+2,4** (+3 / +2 / +2) |
| `flutes` | tenu **−6,7** (0 / −7 / −13) · sans_vibrato **+2,0** (+8 / +1 / −3) · legato **−6,3** (0 / −5 / −13) · staccato **−3,2** (+4 / −1 / −13) |
| `glockenspiel` | frappe **+1,7** (+5 / +1 / −1) |
| `guitare_claire` | tenu **+1,3** (0 / +3 / +1) · etouffee **+3,2** (+1 / +4 / +5) |
| `guitare_saturee` | tenu **+2,9** (+4 / +3 / +2) · crunch **+0,4** (+1 / +1 / −1) · etouffee **+3,2** (+1 / +4 / +5) |
| `harpe` | pince **+4,3** (+12 / −2 / +3) |
| `hautbois` | tenu **+2,2** (+2 / 0 / +5) · sans_vibrato **+2,4** (+3 / +1 / +3) · legato **+2,8** (+3 / 0 / +6) · staccato **−3,1** (−2 / −5 / −2) |
| `lead_synthe` | tenu **+2,3** (+3 / +3 / +1) |
| `marimba` | frappe **−6,7** (−7 / −7 / −6) |
| `nappe_gm` | chaude **+1,9** (+1 / +2 / +2) · halo **+2,5** (+4 / +3 / +1) · atmosphere **+8,5** (+5 / +5 / +15) · verre **+7,4** (+7 / +6 / +9) · cordes **+1,4** (+2 / +1 / +1) |
| `nappe_synthe` | tenu **+2,4** (+3 / +2 / +3) |
| `orgue` | tenu **+2,7** (0 / +2 / +6) · doux **−2,3** (−3 / −1 / −3) |
| `piano` | tenu **−3,7** (−5 / −4 / −3) · pedale **−4,2** (−5 / −4 / −3) |
| `piccolo` | tenu **−2,1** (+6 / −5 / −7) · staccato **−5,6** (+1 / −7 / −10) |
| `pupitre_basses` | tenu **+4,5** (+5 / +4 / +5) · staccato **+1,8** (0 / +2 / +3) · pizzicato **−0,3** (+1 / −3 / +1) · tremolo **+2,8** (+2 / +3 / +3) |
| `sub_synthe` | tenu **−0,5** (+1 / −1 / −2) |
| `supersaw` | tenu **+0,9** (+2 / +1 / 0) |
| `taiko` | frappe **−1,5** (−1 / −2 / −2) |
| `taiko_gm` | frappe **+0,3** (0 / 0 / 0) |
| `timbales` | frappe **−0,1** (0 / −2 / +1) · roulement **−2,9** (−2 / −4 / −3) |
| `toms` | frappe **+2,7** (+3 / +3 / +3) |
| `trombones` | tenu **+0,9** (+6 / +2 / −5) · vibrato **+7,8** (+12 / +5 / +6) · legato **+0,4** (+6 / +1 / −5) · staccato **−1,9** (−1 / −2 / −2) |
| `trompettes` | tenu **+5,3** (+10 / +4 / +2) · vibrato **+6,1** (+10 / +6 / +3) · legato **+5,0** (+9 / +4 / +2) · staccato **−10,2** (−4 / −12 / −15) · sourdine **+2,0** (+8 / +1 / −3) |
| `tuba` | tenu **+5,7** (+11 / +5 / +1) · legato **+5,2** (+11 / +5 / +1) · staccato **−0,8** (+2 / −1 / −4) |
| `vibraphone` | frappe **−8,1** (−5 / −8 / −11) · dure **−3,7** (−3 / −3 / −5) |
| `violoncelles` | tenu **+0,6** (−2 / +1 / +2) · legato **+0,5** (−1 / +1 / +2) · staccato **−2,0** (0 / −4 / −2) · pizzicato **−0,3** (0 / −2 / +1) · tremolo **+2,9** (+3 / +2 / +4) |
| `violons` | tenu **+2,6** (+6 / +1 / +1) · legato **+0,8** (+4 / −1 / −1) · staccato **−2,8** (−1 / −2 / −5) · pizzicato **+5,1** (+8 / +3 / +5) · tremolo **+1,8** (+5 / +1 / −1) |
| `voix_synthe` | tenu **+1,2** (+1 / +3 / 0) |
| `xylophone` | frappe **+2,0** (+1 / +2 / +4) |

### 4.2 La foule du stade (`foule`, `applaudissements`)

Deux instruments fabriqués (`moteur/foule.py`) avec ce qui est installé, à graine fixe
(la bibliothèque n'a pas de foule, et rien ne se télécharge) :

- **`foule`** : des milliers d'hommes qui chantent à l'unisson, de loin, dans un stade.
  `o` (le défaut) et `ah` : dix prises du chœur de la banque générale (« ouh » et
  « aah », la voyelle demandée en majorité), chacune une voix rendue une fois
  (désaccordée de ± 8 cents, une dérive lente de ± 4 cents, en retard de 0 à 25 ms, ses
  attaques qui flottent de 8 ms, sa vélocité de ± 8, sa couleur de voyelle, son niveau),
  posée deux fois dans l'image (un second rang plus loin, de l'autre côté) : vingt
  pupitres de supporters. Deux voix par prise se passent la ligne (celle qui finit
  s'éteint en 0,12 s quand l'autre attaque : la queue du chœur ne traîne pas sous la
  note suivante) ; les formants d'une voix d'homme (« o » 450 et 850 Hz, « ah » 700 et
  1 150 Hz) ; la distance (l'air mange les aigus) et le stade : des réflexions espacées
  sur le toit et les tribunes (15 à 300 ms), la tribune d'en face (jusqu'à 650 ms, plus
  faible), une queue d'une seconde à ciel ouvert, sombre, rien sous 180 Hz — pas de
  cathédrale. Sous le chant, la rumeur : un grondement de voix et de souffles (un bruit
  mis en forme, des bosses à 300 et 650 Hz) qui enfle et retombe lentement (une houle
  de ± 3 dB) et suit la nuance et la durée des notes, 22 dB sous le chant. `rumeur` :
  la rumeur seule. Étendue G2–E4.
- **`applaudissements`** : une tribune qui frappe dans ses mains. `mesure` : chaque
  note est un coup de toute la tribune — 48 mains, chacune à sa place dans l'image, avec
  son claquement (quarante, tirés une fois des mains seules et des groupes de la
  bibliothèque, transposés, filtrés), son avance ou son retard propre et un flottement
  d'un coup à l'autre (± 30 ms en tout) ; une main sur vingt-cinq se tait parfois.
  `ovation` : des applaudissements sans pulsation qui enflent pendant la note (64 mains
  qui arrivent dans la première seconde et demie, chacune à son rythme, 3,2 à 5,8
  frappes par seconde, puis qui s'arrêtent une à une dans les 2,5 s qui suivent), la
  clameur dessous ; un `crescendo` sur la piste la fait enfler davantage. La hauteur
  écrite ne compte pas.

Ils sont calibrés comme les autres (`banc.py --calibrer foule applaudissements`) : la
foule par demi-ton et par figures (`o`, `ah` et `rumeur` à 2,9 dB l'une de l'autre au
plus, chacune égale sur l'étendue à 1,7 dB près), les mains comme les percussions sans
hauteur (un coup, à −20 LUFS de sonie maximale sur 400 ms ; l'ovation, sur une note de
six secondes).

**Le test du téléphone** (`python3 audition.py foule --telephone --out <dossier>`) : la
phrase d'audition de la foule (la tête d'un motif dans la2–fa3 sur « o », puis
resserrée dans la3–ré4 sur « ah ») en mono, passée dans un passe-bande 400 Hz–6 kHz ;
trame par trame (80 ms), la note que l'oreille lit — la somme des harmoniques qu'elle
sépare, la fondamentale étant coupée — contre la note écrite. Les 14 notes se lisent à
leur hauteur (la tête grave, 7 sur 7 — mi 3, la plus fragile, sur 56 % de ses trames ;
la tête médium, 7 sur 7, sur 78 à 100 % des trames), marge médiane +2,1 dB. Plus de
rumeur ou plus de stade la brouille : la rumeur à −14 dB sous le chant au lieu de −22,
11 notes sur 14 ; le stade à part égale du son direct, 4 croches sur 14 se lisaient sur
la note d'avant (d'où ses réflexions espacées, sombres, et sa part de 0,3).

**Le coût et l'exemple** : la foule ne rend que vingt voix de chœur (dix prises, deux
voix chacune), sur la seule durée où elle chante, puis la convolution du stade ; les
mains rejouent quarante claquements calculés une fois. L'audition des deux instruments
(42 s de son, `python3 audition.py foule applaudissements --out <dossier>`) se rend en
6,9 s, 0,76 Go de mémoire de pointe. L'exemple, « La tribune » (`partitions/_foule.py`,
huit mesures à 96 : la foule chante la tête d'un motif à l'unisson sur « o », puis sur
« ah », puis resserrée dans la3–ré4, sur la grosse caisse aux temps 1 et 3 et les mains
aux temps 2 et 4 ; la dernière note tenue ; l'ovation, la foule retombée en rumeur), se
rend en 24 s (26 s de calcul par minute de master, dont 5,8 s pour les vingt secondes de
la foule et 1,3 s pour les mains), 1,1 Go de mémoire de pointe ; deux rendus sont
identiques au bit. Son banc :

```
_foule « La tribune »  boucle -16.02 LUFS · master -16.46 · court terme -17.4..-14.7 · crête -1.20 dBTP
  bandes <250 47 % · 250–2k 49 % · 2–6k 4.2 % · >6k 0.0 % · stéréo côtés/milieu -4.1 dB, corr. 0.437 (grave 0.893)
  couture : écart -240.0 dB, saut +1.69 dB, spectre 14.34 dB, clic ×1.0 · durée 54.0 s, boucle 20.0 s · rendu 26.4 s/min
  sonie ✓ · crête ✓ · médium ✓ · aigus ✓ · couture ✓ · grave au milieu ✓
  sections : A -16.0
```

Les pistes : la foule −18,2 LUFS, la grosse caisse −20,6, les mains −21,8, la basse
pizzicato −31,6 (un fond).

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
| `bref` | `0.2` | les notes brèves (staccato, pizzicato) des cordes, des bois et des cuivres ne jouent plus tout leur échantillon (avec la queue de la salle d'enregistrement) : leur durée écrite, puis cette relâche (s), avec l'énergie de la note entière (au plus +6 dB) : le niveau ne change pas. Un ostinato de doubles croches y gagne une attaque plus nette, et perd un peu d'ampleur |
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
  "boucle": {"debut": 3866074, "fin": 7511648},
  "sections": [
    {"nom": "intro", "debut": 0, "fin": 220500, "intro": true, "reprise": false, "rang": 0, "mesures": 2},
    {"nom": "A1", "debut": 3866074, "fin": 4307074, "intro": false, "reprise": true, "rang": 0, "mesures": 4},
    {"nom": "A2", "debut": 4307074, "fin": 4748074, "intro": false, "reprise": true, "rang": 1, "mesures": 4},
    {"nom": "B", "debut": 5189074, "fin": 6134074, "intro": false, "reprise": true, "rang": 3, "mesures": 10},
    {"nom": "D2", "debut": 7257913, "fin": 7511648, "intro": false, "reprise": true, "rang": 6, "mesures": 2}
  ],
  "reprise": {"sauf": []},
  "lufs": -16.01, "lufs_master": -16.08, "crete_dbtp": -1.2,
  "duree_s": 184.332, "boucle_s": 82.666, "boucle_min_s": 0, "echantillons": 8129048,
  "gain_master_db": -1.59, "duree_rendu_s": 173.7,
  "rendu": {"secondes": 173.7, "secondes_par_minute": 56.5,
            "pistes": [{"segment": "corps", "piste": "cors", "secondes": 5.76, "lufs": -15.8}]}
}
```

  (L'exemple omet trois sections.) Toutes les positions sont des **indices
  d'échantillons dans le master**. `intro` est
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

Côté jeu, un dossier de masters livrés (`<clé>.wav` et `<clé>.json` par thème) s'empaquette d'une
commande : `node packages/tools/web/musique_audio.js --masters <dossier>` (des MP3 par blocs et le manifeste
du lecteur, `packages/tools/web/musique/audio/`), puis `--verifier --masters <dossier>` mesure les coutures
dans Chromium (AGENTS.md, « La musique enregistrée »). Une section qu'un film cite (`musiqueDepuis` dans
`cinema/films/`) garde son nom : sinon la musique du film part du début (l'empaquetage le signale).

## 8. Le déterminisme et la vitesse

- **Même partition, même son** : aucun hasard sans graine (l'humanisation tire de la
  graine du thème, de la piste, du segment et du rang de la note ; les synthés de la
  note elle-même ; les salles de leur propre graine) ; chaque piste General MIDI est
  rendue dans un FluidSynth neuf (un synthé qui a déjà joué gardait des états :
  −90 dB d'écart d'un rendu à l'autre, −30 dB après une autre piste). Deux rendus de la
  démonstration sont identiques au bit (§ 9).
- **La vitesse et la mémoire**, mesurées sur la machine partagée (quatre cœurs, charge 6
  à 9) : la démonstration (87,7 s de musique, 184 s de master) se rend en 174 à 186 s
  (≈ 56 s de calcul par minute de master, ≈ 2 min par minute de musique), mémoire de
  pointe 3,4 Go ; le modèle (21,8 s de boucle, 58 s de master) en 26 à 31 s, 0,8 Go.
  Le rendu des pistes n'en prend qu'un tiers (55 s pour la démonstration) ; le reste
  est la chaîne du master (≈ 4 s par minute d'audio, passée sur l'extrait de la boucle
  jusqu'à ce que la sonie tombe à 0,02 LU de la cible, puis sur les deux lignes de
  temps), les bus et les salles. Un thème de ville de quatre minutes se rend en six à
  huit minutes : on travaille par sections (`--sections`), on rend le tout à la fin.

## 9. La démonstration

`partitions/demo_studio.py`, 87,7 secondes (une introduction de 5 s, un corps de
82,7 s) : (a) un crescendo épique hybride — ostinato des violoncelles et contrebasses
en doubles croches, l'appel aux quatre cors, taiko et timbales, le « braam », le chœur,
la sous-basse ; (b) les néons — basse en scie qui pompe, arpège en écho, caisse claire
« gated », le même appel au lead analogique ; (c) la place — pizzicati, flûtes et
clarinettes, glockenspiel, basse qui rebondit, batterie légère, cadence bVI – bVII – I ;
(d) le tutti final et la tierce picarde. Le banc :

```
demo_studio « La démonstration du studio »  boucle -16.01 LUFS · master -16.09 · court terme -21.3..-12.7 · crête -1.20 dBTP
  bandes <250 49 % · 250–2k 47 % · 2–6k 2.8 % · >6k 0.7 % · stéréo côtés/milieu -5.2 dB, corr. 0.533 (grave 0.909)
  couture : écart -240.0 dB, saut +2.23 dB, spectre 7.32 dB, clic ×1.0 · durée 184.3 s, boucle 82.7 s · rendu 56.7 s/min
  sonie ✓ · crête ✓ · médium ✓ · aigus ✓ · couture ✓ · grave au milieu ✓
  sections : intro(i) -25.1, A1 -20.1, A2 -16.8, A3 -14.3, B -18.3, C -15.9, D1 -13.7, D2 -13.8
```

À la calibration des niveaux (octobre 2026), rendue avec ses anciens faders, elle a bougé
comme la table du § 4.1 le dit : le tuba +9,1 dB (il était monté de +7 dB pour sortir du
grave), les clarinettes +7,6, les bassons +7,4, les seconds violons +5,3, le glockenspiel
+4,0, les altos +3,7 ; les cors −5,1, les contrebasses −2,4, les flûtes −2,3 ; la section
A2 −1,5 dB, C +0,9. Ses faders corrigés de l'opposé (le tuba de +7 à −2, les clarinettes
de +4 à −3,5, les bassons de +5 à −2,5, les cors de −3,5 à +1,5…), chaque piste est
revenue à 0,9 dB près de son niveau d'avant (la plupart à 0,2 dB), les sections à 0,5 dB
près : le même mélange, des articulations égales dessous.

Deux rendus successifs de la démonstration donnent deux WAV identiques au bit.

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
  Les notes brèves jouent par défaut tout leur échantillon (la salle d'enregistrement
  sonne dessous) : pour un ostinato plus sec et plus net, `bref=0.2` sur la piste (le
  niveau ne change pas). Plus rapides qu'une croche à 120, les notes brèves sont baissées
  pour que leurs queues ne s'empilent pas (§ 4.1) : une suite de doubles croches sonne
  au niveau d'une suite de croches, pas 3 dB plus fort.
- **Le crescendo** d'une note tenue est un gain : son timbre ne s'éclaire pas. Pour un
  vrai crescendo, enchaîner deux notes (la seconde à une vélocité plus haute) ou doubler
  par un roulement de cymbale.
- **Les guitares et la basse électrique** viennent de la banque générale : utiles en
  accompagnement (quintes saturées, arpèges clairs), faibles en solo.
- **Les instruments hors étendue** : une note sous la plus grave de la bibliothèque est
  transposée et perd son timbre ; rester dans les étendues du § 4.
- **Les cuivres doux** (vélocité < 72) gardent le timbre mezzo des échantillons ; leur
  éclat ne vient qu'aux fortes vélocités, et il n'ajoute plus de niveau : un cuivre
  fortissimo est plus brillant, pas plus fort qu'une autre famille à la même vélocité.
- **Les niveaux** (§ 4.1) tiennent à ± 2 dB dans 99 cases sur 100. Ce qui dépasse :
  - *les contrebasses en staccato* : leurs trois prises tirent deux enregistrements et
    se filtrent en peigne autrement à chaque note (à la♯ 1, une prise seule sort à −16
    LUFS, trois prises du même enregistrement à −21, une vraie suite de −15 à −17) : une
    suite de croches dans le grave (sol 1 – ré 2) sort 2,7 dB au-dessus de la moyenne de
    l'instrument, dans le médium 2,2 dessous ; `basses_film` en hérite. Le tenu et le
    pizzicato tiennent l'étendue à 2,4 et 2,6 dB près ;
  - *le legato dans le grave* (violons, contrebasses) : 2,7 à 3 dB sous les autres
    articulations à vélocité 64 (le fondu enchaîné mange l'attaque) ; le monter d'autant ;
  - *la nappe « atmosphère »* de la banque générale : son aigu, à vélocité 64 et 96, est
    trop faible pour la borne de correction (12 dB) : 2,3 dB sous les autres nappes ;
  - *le pupitre de la banque générale en doubles croches* : le pizzicato y sonne 2,6 dB
    au-dessus du staccato (ses notes résonnent les unes dans les autres) ; le tenu et le
    trémolo, à l'attaque lente, n'y parlent pas (ils sont calibrés jusqu'à la croche) ;
  - *les cors tenus en doubles croches* dans le médium : 2 dB sous la moyenne de
    l'instrument (l'étendue du cor tenu atteint 4,4 dB à vélocité 96 et 120) ;
    *l'arpège de synthé* : 3,9 dB du grave à l'aigu à vélocité 120 (son filtre suit la
    note).
- **La boîte à rythmes** est synthétique : la grosse caisse et la caisse claire gagnent
  à être doublées par la `caisse_claire` ou la `grosse_caisse` de l'orchestre.
- **La foule** est un chœur d'opéra joué de loin par vingt pupitres : pas de cris, pas
  de paroles, pas d'accent ; sa rumeur est un bruit mis en forme, pas des voix. Elle
  chante des hommes : au-dessus de mi 4 elle s'éclaircit. Ses prises flottent de 8 à
  25 ms : une ligne plus rapide que la croche à 96 se brouille. Plus de rumeur, ou plus
  de stade, et la ligne ne se lit plus au téléphone (§ 4.2) : monter la rumeur à part
  (`rumeur`, sur sa propre piste) plutôt que dans le chant.
- **Les applaudissements** tirent quarante claquements de la même bibliothèque : de
  près et seuls, l'oreille reconnaît les mêmes mains ; une ovation de plus de dix
  secondes devient un bruit (la doubler par la `foule` sur `rumeur`, ou finir).

## 11. L'arborescence

```
packages/tools/studio/
  installer.sh          outils + échantillons (épinglés, vérifiés), jamais dans le dépôt
  LICENCES.md           chaque source, sa version, sa licence
  rendre.py             partition → master, repères, écoute (et le banc)
  banc.py               les mesures, les images, la calibration et la preuve des niveaux
  audition.py           un instrument seul, l'accord, la table des instruments
  partitions/           un fichier par thème ; _modele.py, demo_studio.py, _foule.py
  moteur/
    ecriture.py         ce qu'une partition importe : Theme, motifs, briques, nuances
    theorie.py          notes, tonalités, modes, accords par chiffres romains
    instruments.py      le catalogue (noms français), les cinq sortes d'instruments
    echantillonneur.py  le lecteur SFZ : couches, tours de rôle, boucles, legato
    fluide.py           FluidSynth par ctypes (les banques General MIDI)
    synthe.py           la synthèse : oscillateurs, filtre, montées, impacts, boîte à rythmes
    foule.py            la foule du stade et ses mains (fabriquées : chœur, stade, rumeur, claquements)
    dsp.py              filtres, saturation, compresseur, limiteur, salles, sonie
    noyau.c, noyau.py   les boucles échantillon par échantillon (compilées en cache)
    rendu.py            segments, pistes, bus, envois, assemblage, master
    export.py           le WAV, le JSON, l'écoute MP3
    calibration.py      la calibration des niveaux : les zones, les articulations, la preuve
    zones.json          l'égalisation des zones (banc.py --calibrer)
    niveaux.json        les niveaux calibrés des articulations (banc.py --calibrer)
    accords.json        les corrections d'accord (audition.py --echantillons --ecrire)
```

## 12. Le journal

- **Octobre 2026, deuxième passe — les niveaux.** Un accord de croches de trompettes
  sortait à −4,5 LUFS en staccato et à −22,9 en tenu : les zones des bibliothèques sont
  égalisées une à une, chaque articulation est calibrée en contexte sur des figures de
  musique, dans trois registres et à trois vélocités (§ 4.1). Un fader réglé avant se
  corrige de l'opposé de la table « ce qui a changé ».
- **Octobre 2026, deuxième passe — la tribune.** Deux instruments fabriqués : la `foule`
  qui chante le motif à l'unisson, de loin, dans un stade, et les `applaudissements` en
  mesure ou en ovation (§ 4.2) ; l'exemple « La tribune » (`partitions/_foule.py`).
