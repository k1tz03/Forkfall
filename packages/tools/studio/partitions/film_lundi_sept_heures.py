"""FUSIBLE — la musique du film « Lundi, sept heures » (film_lundi_sept_heures), livre 2.

Le film (packages/tools/web/cinema/films/lundi_sept_heures.js, 29,0 s) : le premier lundi, l'heure qui
précède la carte de la diode. Le parking du stade à 6 h 40 sous la pluie, la place peinte ENTRAÎNEUR
et la berline grise (le sapin en carton au rétroviseur) ; un téléphone sonne deux fois dans le stade
vide ; le bureau noir, le répondeur décroche, son annonce (« Bureau de l'entraîneur. Laissez un
message, je rappelle. »), le bip ; la bande tourne, quelqu'un parle ; la bande s'arrête, la diode
rouge clignote ; sept heures ; la lumière du couloir derrière la porte vitrée : tu arrives.

La musique est un chapitre du thème du livre (« Le Répondeur », livre_h2) : si mineur, la pédale de
si, les accords suspendus qui ne se résolvent pas, le piano feutré, LE BIP (si5, 988 Hz, la première
note du motif), la voix de l'absent (un basson seul dans une bande de téléphone), le balancier des
pizzicati, la diode au célesta. Sa forme suit les plans et laisse les bruits du film à découvert (les
deux sonneries, le déclic de la prise de ligne, la bande qui s'arrête) :
  - le parking : la pédale, la nappe ; le piano « fu-si »… et la voiture ne démarre pas — c'est le
    téléphone qui sonne (3,33 s) ; « fu-si »… et la deuxième sonnerie (5,33 s) tombe sur le premier
    temps, à la place du « BLE » ; rien d'aigu autour de 900 Hz sous les sonneries ;
  - la berline : le sapin qui tourne au rétroviseur (la harpe, si fa# sol fa#, dans le médium) ;
  - le déclic (7,33 s) : presque rien sous l'annonce ;
  - LE BIP (10,67 s) sur le premier temps ; la voix de la bande chante le motif (si fa# | SOL ── ré
    do# | mi si) et commence la réponse ; LA BANDE S'ARRÊTE (18,4 s) : la voix est coupée net,
    le balancier aussi ;
  - la diode : le célesta clignote avec elle (18,6 s, puis toutes les 1,2 s, comme l'image) ;
  - sept heures (22,6) : le piano « fu-si »… et, quand la lumière du couloir s'allume (23,6), le
    « BLE » vient enfin (sol, la mèche) : tu arrives ; la chaleur (sol 6/9), le titre ; la question
    (si sus4) jusqu'au fondu.

LA FEUILLE DE SYNCHRONISATION (l'intro dure le film, 29,0 s) :
  section   mesure  tempo   de → à (s)        ce qui tombe
  parking   4/4×2   90      0,000 → 5,333     la 1ʳᵉ sonnerie 3,333 (m. 2, 2ᵉ temps)
  berline   3/4×1   90      5,333 → 7,333     la 2ᵉ sonnerie 5,333 (1ᵉʳ temps) ; la coupe 7,0 (2ᵉ temps et demi)
  annonce   5/4×1   90      7,333 → 10,667    le déclic de la prise de ligne 7,333 ; l'annonce 7,45 → 10,9
  message   4/4×3   93,10   10,667 → 18,400   LE BIP 10,667 ; la coupe sur les bobines 15,2 (≈ m. 2, 4ᵉ temps,
                                              +22 ms : le si de la voix)
  diode     2/4×1   75      18,400 → 20,000   la bande s'arrête 18,4 ; la diode 18,6 (le célesta)
  chaise    4/4×1   92,31   20,000 → 22,600   la coupe 20,0
  sept      2/4×1   120     22,600 → 23,600   SEPT HEURES 22,6 : « fu-si » au 2ᵉ temps
  couloir   3/4×2   66,67   23,600 → 29,000   LA LUMIÈRE DU COULOIR 23,6 : « BLE » (sol) ; le titre 24,0 ;
                                              le fondu 27,8 → 29,0
Le corps : une traîne de seize secondes (si sus2 sur la pédale, pianissimo).
"""
from moteur.ecriture import *
from partitions._fusible import phrase

theme = Theme('film_lundi_sept_heures', 'Lundi, sept heures', bpm=90, mesure='4/4', tonalite='si mineur',
              graine=1990, ville=False, boucle_min=0, moment='le film « Lundi, sept heures », livre 2',
              humeur='un bureau vide à l\'aube : un répondeur parle à une pièce vide')
theme.master(sonie_sur='intro')

TON = 'si mineur'

# --- le bip du répondeur (le son pur d'un vrai répondeur, si5) -------------------------------------
_BIP = {'osc': [{'forme': 'sinus', 'niveau': 1.0}, {'forme': 'carre', 'niveau': 0.06, 'largeur': 0.5}],
        'sub': 0.0, 'filtre': None,
        'amp': {'a': 0.004, 'd': 0.05, 's': 1.0, 'r': 0.03}, 'velocite': 0.3}
bip = theme.piste('bip', 'arpege_synthe', synthe=_BIP, humain=0, pan=0.0, largeur=0.0, profondeur=0.2,
                  piece=0.3, salle=0.08, volume=-16, eq={'passe_haut': 300}, bus='conception')

# --- le piano feutré, la voix de la bande ----------------------------------------------------------------
piano = theme.piste('piano', art='tenu', pan=-0.05, piece=0.35, salle=0.16, volume=15,
                    eq={'passe_bas': 2400, 'aigu': (-4, 1500)})
message = theme.piste('message', 'bassons', art='vibrato', unisson=1, pan=0.0, largeur=0.25, profondeur=0.3,
                      piece=0.25, volume=2, eq={'passe_haut': 380, 'passe_bas': 3000, 'presence': 2})

# --- les cordes, la harpe, le célesta ----------------------------------------------------------------------
pizz = theme.piste('pizz', 'violoncelles', art='pizzicato', pan=0.3, volume=9)
contrebasses = theme.piste('contrebasses', art='sans_vibrato', volume=5)
cb_pizz = theme.piste('cb_pizz', 'contrebasses', art='pizzicato', volume=4)
altos = theme.piste('altos', art='tenu', volume=2)
violons2 = theme.piste('violons2', 'violons', art='tenu', pan=-0.22, volume=2)
harpe = theme.piste('harpe', volume=6)
celesta = theme.piste('celesta', profondeur=0.6, salle=0.3, volume=8)
nappe = theme.piste('nappe', 'nappe_synthe', volume=-5, synthe={'filtre': {'coupure': 1100.0}})


def nuances(s, **niveaux):
    for nom_piste, v in niveaux.items():
        s.nuance(theme.pistes[nom_piste], v, 0)


TETE = phrase('tete', TON, octave=3)                # si3 fa#4 | sol4
MOTIF = phrase('motif', TON, octave=3)              # si3 fa#4 | sol4 ── ré4 do#4 | mi4 si3
REPONSE = phrase('reponse', TON, octave=3)          # si3 fa#4 | sol4 ── la4 si4 | fa#4
FU_SI = phrase('anacrouse', TON, octave=3)          # si3 fa#4


def accord(s, piste, hauteurs, a, d, vel=60, art=None):
    for h in hauteurs:
        s.note(piste, h, a, d, vel=vel, art=art)


def diode(s, t_film, debut_section, noire, vel):
    """La diode rouge qui clignote : le célesta au temps exact de l'image (si5, bref)."""
    s.note(celesta, 'B5', (t_film - debut_section) / noire, 0.5, vel=vel)


# =====================================================================================
# L'introduction : le film

@theme.section('parking', mesures=2, bpm=90)
def parking(s):
    """0,00 → 5,33 : le parking sous la pluie, du noir : la pédale, la nappe (si sus2) ; le piano
    « fu-si »… (1,33) ; la première sonnerie (3,33, m. 2, 2ᵉ temps) ; « fu-si »… (4,67) et la
    deuxième sonnerie tombe à la place du « BLE »."""
    nuances(s, contrebasses='pp', nappe='pp', piano='mp', violons2='pp')
    s.note(contrebasses, 'B1', 0, 8, vel=58)
    s.crescendo(contrebasses, 0, 8, 'pp', 'p')
    accord(s, nappe, ['F#3', 'C#4'], 0.5, 7.5, vel=56)
    s.joue(piano, FU_SI, a=2, vel=60)
    s.joue(piano, FU_SI, a=7, vel=58)
    s.note(violons2, 'B4', 1, 7, vel=46)


@theme.section('berline', mesures=1, bpm=90, mesure='3/4')
def berline(s):
    """5,33 → 7,33 : la berline, par le pare-brise : le sapin en carton qui tourne au rétroviseur (la
    harpe, dans le médium, sous la bande de la sonnerie) ; ♭VI sur la pédale."""
    nuances(s, contrebasses='p', harpe='mp', nappe='pp', altos='pp', violons2='pp')
    s.note(contrebasses, 'B1', 0, 3, vel=58)
    accord(s, nappe, ['D3', 'G3'], 0, 3, vel=52)
    for k, h in enumerate(['B4', 'F#4', 'G4', 'F#4']):
        s.note(harpe, h, 0.5 + 0.5 * k, 1, vel=74 - 3 * k)
    s.note(altos, 'D4', 0, 2.4, vel=48)
    s.note(violons2, 'G4', 0, 2.4, vel=46)


@theme.section('annonce', mesures=1, bpm=90, mesure='5/4')
def annonce(s):
    """7,33 → 10,67 : le déclic (le bruit du film), l'annonce de l'absent (le texte à l'écran) :
    presque rien — la pédale, la nappe très bas — jusqu'au bip."""
    nuances(s, contrebasses='pp', nappe='ppp')
    s.note(contrebasses, 'B1', 0.25, 4.75, vel=52)
    accord(s, nappe, ['F#3', 'C#4'], 0.25, 4.75, vel=48)


@theme.section('message', mesures=3, bpm=12 * 60 / 7.7333333)
def message_(s):
    """10,67 → 18,40 : LE BIP sur le premier temps ; la voix de la bande chante le motif, puis la
    réponse ; le balancier des pizzicati (les bobines qui tournent) ; la bande s'arrête net (18,4)."""
    nuances(s, message='mf', contrebasses='p', pizz='mp', cb_pizz='mp', altos='p', violons2='p', nappe='p')
    s.note(bip, 'B5', 0, 0.62 * 93.10345 / 60, vel=100)
    s.joue(message, MOTIF, a=1, vel=94)                 # si (1) fa# | sol (2 → 5) ré do# | mi (6) si (7)
    s.joue(message, REPONSE.coupe(0, 3), a=9, vel=92)   # si (9) fa# | sol (10 → 12) : coupé par la bande
    s.note(cb_pizz, 'B1', 0, 1, vel=80)
    s.note(contrebasses, 'B1', 0, 11.95, vel=60)
    # les accords : ♭VI sous la mèche, ♭VII à vide sous « ré do# », si sus4 sous « mi si », ♭VI encore
    for a, d, hs in ((2, 3, ['D3', 'G3', 'B3']), (5, 1, ['E3', 'A3']), (6, 3, ['F#3', 'B3', 'E4']),
                     (9, 2.95, ['D3', 'G3', 'B3'])):
        accord(s, altos, hs[:2], a, d, vel=58)
        s.note(violons2, hs[-1], a, d, vel=54)
    # le balancier : les bobines qui tournent (si fa#, sur le 1 et le 3)
    for m in range(3):
        for b, h in ((0, 'B2'), (2, 'F#2')):
            if 4 * m + b + 1 <= 12:
                s.note(pizz, h, 4 * m + b, 1, vel=66)
    accord(s, nappe, ['F#3', 'C#4'], 0, 11.95, vel=50)


@theme.section('diode', mesures=1, bpm=75, mesure='2/4')
def diode_(s):
    """18,40 → 20,00 : la bande s'est arrêtée (le bruit du film) ; la diode clignote : le célesta avec
    elle (18,6, 19,8) ; la pédale seule."""
    nuances(s, celesta='mp', contrebasses='pp')
    s.note(contrebasses, 'B1', 0.2, 1.8, vel=50)
    for t, v in ((18.6, 70), (19.8, 66)):
        diode(s, t, 18.4, 0.8, v)


@theme.section('chaise', mesures=1, bpm=4 * 60 / 2.6)
def chaise(s):
    """20,00 → 22,60 : du coin de la fenêtre : la diode devant, la chaise vide, la porte vitrée ; la
    nappe, la pédale, le célesta (21,0, 22,2)."""
    nuances(s, celesta='mp', contrebasses='pp', nappe='pp', violons2='pp')
    s.note(contrebasses, 'B1', 0, 4, vel=52)
    accord(s, nappe, ['F#3', 'C#4'], 0, 4, vel=48)
    s.note(violons2, 'B4', 0.5, 3.5, vel=42)
    for t, v in ((21.0, 64), (22.2, 60)):
        diode(s, t, 20.0, 0.65, v)


@theme.section('sept', mesures=1, bpm=120, mesure='2/4')
def sept(s):
    """22,60 → 23,60 : SEPT HEURES : ♭VI sur la pédale ; le piano « fu-si »… (23,1) ; la diode (23,4)."""
    nuances(s, piano='mp', contrebasses='p', nappe='pp', celesta='p')
    s.note(contrebasses, 'B1', 0, 2, vel=56)
    accord(s, nappe, ['D3', 'G3'], 0, 2, vel=50)
    s.joue(piano, FU_SI, a=1, vel=62)
    diode(s, 23.4, 22.6, 0.5, 56)


@theme.section('couloir', mesures=2, bpm=6 * 60 / 5.4, mesure='3/4')
def couloir(s):
    """23,60 → 29,00 : LA LUMIÈRE DU COULOIR : « BLE » (sol, la mèche) — tu arrives ; la chaleur (sol
    6/9), la harpe ; le titre (24,0) ; la question (si sus4) ; le fondu (27,8 → 29,0)."""
    nuances(s, piano='mf', altos='p', violons2='p', harpe='p', contrebasses='p', nappe='pp', celesta='p')
    s.note(piano, 'G4', 0, 3, vel=66)
    for h in ('G2', 'D3'):
        s.note(piano, h, 0, 3, vel=44)
    s.note(contrebasses, 'G1', 0, 3, vel=58)
    accord(s, altos, ['A3', 'B3'], 0, 3, vel=58)
    s.note(violons2, 'E4', 0, 3, vel=54)
    for k, h in enumerate(['G3', 'B3', 'D4', 'E4', 'A4', 'B4']):
        s.note(harpe, h, 0.5 * k, 2, vel=64 - 2 * k)
    # la question : si sus4 (la tierce ne vient pas)
    s.note(piano, 'F#4', 3, 2.6, vel=58)
    s.note(piano, 'B2', 3, 2.6, vel=40)
    s.note(contrebasses, 'B1', 3, 2.6, vel=54)
    accord(s, altos, ['F#3', 'B3'], 3, 2.6, vel=52)
    s.note(violons2, 'E4', 3, 2.6, vel=48)
    accord(s, nappe, ['F#3', 'B3', 'E4'], 0, 5.6, vel=46)
    for p in (piano, altos, violons2, contrebasses, nappe):
        s.diminuendo(p, 3.5, 5.6, 'p', 'ppp')
    for t, v in ((24.6, 52), (25.8, 48), (27.0, 44), (28.2, 38)):
        diode(s, t, 23.6, 0.9, v)


# =====================================================================================
# Le corps : la traîne

@theme.section('traine', mesures=4, bpm=60, reprise=False)
def traine(s):
    nuances(s, contrebasses='ppp', nappe='ppp', violons2='ppp')
    # les notes débordent d'une seconde sur le passage suivant : la couture ne s'entend pas
    s.note(contrebasses, 'B1', 0, 17, vel=48)
    accord(s, nappe, ['F#3', 'C#4'], 0, 17, vel=44)
    s.note(violons2, 'B4', 0, 17, vel=40)


theme.forme(intro=['parking', 'berline', 'annonce', 'message', 'diode', 'chaise', 'sept', 'couloir'],
            corps=['traine'])
