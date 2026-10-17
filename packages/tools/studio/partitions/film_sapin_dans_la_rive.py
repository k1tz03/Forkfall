"""FUSIBLE — la musique du film « Un sapin dans la Rive » (film_sapin_dans_la_rive), livre 2.

Le film (packages/tools/web/cinema/films/sapin_dans_la_rive.js, 33,5 s) : la nuit de la Rive, une heure
du matin, sous tes fenêtres du quai. L'eau noire, les sodiums, la brume, le car du club garé tous feux
éteints ; dans l'appartement, le trousseau (« R. M. — ne pas perdre ») et, au plafond, la lumière de
l'eau ; LE BRUIT D'EAU ÉNORME (10,33 s), puis plus rien ; des ronds sur la Rive ; le car ; la phrase du
répondeur (« Ne me cherche pas. ») ; des bulles, une moire d'essence, et le sapin en carton qui remonte
(23,0 s) et tourne ; la caméra monte jusqu'à ta fenêtre ; « Aubérive · 1992 ».

La musique est la fin de « la Rive » du thème du livre (« Le Répondeur », livre_h2), écrite sous les
images : si mineur, la pédale de si, les accords suspendus, la harpe qui fait tourner le sapin (si fa#
sol fa# : la mèche, en rond), la voix de la bande, la brume aux flûtes. Elle ne joue pas le plongeon :
  - le quai, du noir : la pédale, la brume (les violons très haut), deux gouttes de harpe ;
  - le trousseau, la lumière de l'eau au plafond : la harpe qui ondule, la clarinette (la tête, « ne
    pas perdre ») ; TOUT S'ARRÊTE AVANT LE BRUIT D'EAU (10,33 s, le bruit du film : trois coups sourds) :
    la musique se tait, il n'y a que lui ;
  - les ronds sur la Rive : quelques gouttes de harpe qui s'espacent, la pédale qui revient à peine ;
  - le car, « Ne me cherche pas. » : le piano dit la tête, la bande la répète une mesure plus tard
    (l'écho de la cassette), presque rien d'autre ;
  - les bulles : quelques notes de célesta, au hasard d'une graine ;
  - LE SAPIN REMONTE (23,0 s) : la harpe le fait tourner (un tour par mesure), les violons tiennent
    la question (fa# si do#) ; au titre (29,0), les flûtes sifflent la tête sans bruit ; le dernier tour
    s'éteint dans le fondu.

LA FEUILLE DE SYNCHRONISATION (l'intro dure le film, 33,5 s) :
  section    mesure  tempo   de → à (s)        ce qui tombe
  quai       4/4×2   87,27   0,00 → 5,50       le départ, du noir
  trousseau  7/4×1   86,96   5,50 → 10,33      le fondu dans l'appartement 5,50
  plouf      2/4×1   71,86   10,33 → 12,00     LE BRUIT D'EAU 10,33 : la musique se tait
  ronds      3/4×2   90      12,00 → 16,00     la coupe sur la Rive 12,0 : une goutte
  car        4/4×2   96      16,00 → 21,00     la coupe sur le car 16,0 ; « Ne me cherche pas. » 16,6
                                               (m. 1, 2ᵉ temps, −25 ms) : la tête au piano
  bulles     3/4×1   90      21,00 → 23,00     la coupe sur l'eau 21,0
  sapin      4/4×1   80      23,00 → 26,00     LE SAPIN REMONTE 23,0 : le premier tour
  tourne     4/4×2   80      26,00 → 32,00     la coupe 26,0 ; le titre 29,0 (m. 2) : les flûtes
  fin        2/4×1   80      32,00 → 33,50     le fondu 32,2 → 33,5
Le corps : une traîne de seize secondes (si sus2, la pédale, pianissimo).
"""
import random

from moteur.ecriture import *
from partitions._fusible import phrase

theme = Theme('film_sapin_dans_la_rive', 'Un sapin dans la Rive', bpm=80, mesure='4/4', tonalite='si mineur',
              graine=1992, ville=False, boucle_min=0, moment='le film « Un sapin dans la Rive », livre 2',
              humeur='une heure du matin : un bruit d\'eau énorme, puis plus rien, et un sapin qui tourne')
theme.master(sonie_sur='intro')

TON = 'si mineur'

# --- la voix de la bande, le piano feutré, les bois ---------------------------------------------------
message = theme.piste('message', 'bassons', art='vibrato', unisson=1, pan=0.0, largeur=0.25, profondeur=0.3,
                      piece=0.25, volume=2, eq={'passe_haut': 380, 'passe_bas': 3000, 'presence': 2})
piano = theme.piste('piano', art='tenu', pan=-0.05, piece=0.35, salle=0.16, volume=15,
                    eq={'passe_bas': 2400, 'aigu': (-4, 1500)})
clar = theme.piste('clar', 'clarinettes', art='tenu', unisson=1, pan=-0.1, profondeur=0.4, volume=1)
flutes = theme.piste('flutes', art='sans_vibrato', profondeur=0.7, salle=0.45, volume=2)

# --- les cordes, la harpe, le célesta -----------------------------------------------------------------
contrebasses = theme.piste('contrebasses', art='sans_vibrato', volume=5)
cb_pizz = theme.piste('cb_pizz', 'contrebasses', art='pizzicato', volume=4)
altos = theme.piste('altos', art='tenu', volume=2)
violons2 = theme.piste('violons2', 'violons', art='tenu', pan=-0.22, volume=2)
violons = theme.piste('violons', art='tenu', volume=-3)
harpe = theme.piste('harpe', volume=6)
celesta = theme.piste('celesta', profondeur=0.6, salle=0.3, volume=4)
nappe = theme.piste('nappe', 'nappe_synthe', volume=-5, synthe={'filtre': {'coupure': 1100.0}})


def nuances(s, **niveaux):
    for nom_piste, v in niveaux.items():
        s.nuance(theme.pistes[nom_piste], v, 0)


TETE = phrase('tete', TON, octave=3)                # si3 fa#4 | sol4


def accord(s, piste, hauteurs, a, d, vel=60, art=None):
    for h in hauteurs:
        s.note(piste, h, a, d, vel=vel, art=art)


def tour(s, a, vel):
    """Un tour du sapin sur l'eau : la tête en rond à la harpe (si fa# sol fa#, une noire chacune)."""
    for k, h in enumerate(['B5', 'F#5', 'G5', 'F#5']):
        s.note(harpe, h, a + k, 1, vel=vel - (2 if k else 0))


# =====================================================================================
# L'introduction : le film

@theme.section('quai', mesures=2, bpm=8 * 60 / 5.5)
def quai(s):
    """0,00 → 5,50 : le quai de la Rive, du noir : la pédale, la brume (les violons très haut), deux
    gouttes de harpe."""
    nuances(s, contrebasses='pp', violons='pp', nappe='pp', harpe='p')
    s.note(contrebasses, 'B1', 0, 8, vel=56)
    s.crescendo(contrebasses, 0, 8, 'pp', 'p')
    s.note(violons, 'B5', 1, 7, vel=44)
    accord(s, nappe, ['F#3', 'C#4'], 0.5, 7.5, vel=52)
    s.note(harpe, 'F#5', 3.5, 1, vel=58)
    s.note(harpe, 'C#6', 6.25, 1, vel=54)


@theme.section('trousseau', mesures=1, bpm=7 * 60 / 4.83, mesure='7/4')
def trousseau(s):
    """5,50 → 10,33 : l'appartement : le trousseau, l'étiquette (« ne pas perdre ») ; la lumière de l'eau
    au plafond (la harpe qui ondule) ; la clarinette, la tête ; tout s'arrête avant le bruit d'eau."""
    nuances(s, harpe='pp', clar='p', contrebasses='p', altos='pp', violons2='pp', nappe='pp')
    s.note(contrebasses, 'B1', 0, 6.85, vel=56)
    accord(s, nappe, ['E3', 'B3', 'F#4'], 0, 6.85, vel=48)
    s.note(altos, 'G3', 0, 6.85, vel=46)
    s.note(violons2, 'D4', 0, 6.85, vel=44)
    for k, h in enumerate(['E4', 'B4', 'F#5', 'B4', 'G4', 'D5', 'F#5', 'D5', 'E4', 'B4', 'G5', 'B4']):
        s.note(harpe, h, 0.5 * k, 1.5, vel=60 - (k % 3) * 3)
    s.joue(clar, TETE, a=2.5, vel=80)                  # si (2,5) fa# (3) | sol (3,5 → 6,5)
    for p in (harpe, clar, altos, violons2, nappe, contrebasses):
        s.diminuendo(p, 5.5, 6.85, 'p', 'ppp')


@theme.section('plouf', mesures=1, bpm=2 * 60 / 1.67, mesure='2/4')
def plouf(s):
    """10,33 → 12,00 : LE BRUIT D'EAU (le bruit du film) : la musique se tait. Plus rien."""
    pass


@theme.section('ronds', mesures=2, bpm=90, mesure='3/4')
def ronds(s):
    """12,00 → 16,00 : des ronds sur la Rive, puis plus rien : des gouttes de harpe qui s'espacent, la
    pédale qui revient à peine."""
    nuances(s, harpe='p', contrebasses='ppp', nappe='ppp')
    for a, h, v in ((0, 'B5', 62), (1.25, 'F#5', 56), (3, 'C#6', 50), (5, 'B5', 44)):
        s.note(harpe, h, a, 1, vel=v)
    s.note(contrebasses, 'B1', 1, 5, vel=48)
    accord(s, nappe, ['F#3', 'C#4'], 1.5, 4.5, vel=44)


@theme.section('car', mesures=2, bpm=96)
def car(s):
    """16,00 → 21,00 : le car, tous feux éteints ; « Ne me cherche pas. » (16,6 → 20,6) : le piano dit la
    tête, la bande la répète une mesure plus tard (l'écho de la cassette) ; la pédale, si sus2. Sous la
    réplique, rien d'autre et pianissimo : une voix à la fois sur la pédale (le passage le plus bas du
    film après le silence du plongeon et les ronds)."""
    nuances(s, piano='pp', message='pp', contrebasses='pp', nappe='ppp')
    s.note(contrebasses, 'B1', 0, 8, vel=50)
    accord(s, nappe, ['F#3', 'C#4'], 0, 8, vel=42)
    s.joue(piano, TETE, a=1, vel=54)                   # si (1) fa# (1,5) | sol (2 → 5)
    s.joue(message, TETE, a=5, vel=72)                 # l'écho de la bande : si (5) fa# | sol (6 → 8,9)


@theme.section('bulles', mesures=1, bpm=90, mesure='3/4')
def bulles(s):
    """21,00 → 23,00 : au-dessus de l'eau : des bulles qui crèvent (le célesta, au hasard d'une graine),
    une moire d'essence ; la pédale."""
    nuances(s, celesta='p', contrebasses='pp', nappe='ppp')
    rnd = random.Random(23)
    for _ in range(6):
        s.note(celesta, rnd.choice(['B5', 'C#6', 'F#5', 'E6']), rnd.uniform(0.2, 2.6), 0.4,
               vel=int(rnd.uniform(40, 58)))
    s.note(contrebasses, 'B1', 0, 3, vel=50)
    accord(s, nappe, ['F#3', 'B3'], 0, 3, vel=44)


@theme.section('sapin', mesures=1, bpm=80)
def sapin(s):
    """23,00 → 26,00 : LE SAPIN REMONTE : le premier tour (la harpe) ; les violons tiennent la question
    (fa# si do#) ; la pédale."""
    nuances(s, harpe='mp', violons2='pp', contrebasses='pp')
    tour(s, 0, 80)
    accord(s, violons2, ['F#4', 'B4', 'C#5'], 0, 4, vel=48)
    s.note(contrebasses, 'B1', 0, 4, vel=50)


@theme.section('tourne', mesures=2, bpm=80)
def tourne(s):
    """26,00 → 32,00 : le sapin tourne sur l'eau noire, la caméra monte à ta fenêtre ; au titre (29,0),
    les flûtes sifflent la tête sans bruit, très haut."""
    nuances(s, harpe='mp', violons2='pp', contrebasses='pp', flutes='pp')
    tour(s, 0, 76)
    tour(s, 4, 70)
    accord(s, violons2, ['F#4', 'B4', 'C#5'], 0, 8, vel=46)
    s.note(contrebasses, 'B1', 0, 8, vel=48)
    s.joue(flutes, TETE.octave(2), a=4, vel=82)        # si5 (4) fa#6 | sol6 (5 → 8)
    s.diminuendo(harpe, 4, 8, 'mp', 'p')


@theme.section('fin', mesures=1, bpm=80, mesure='2/4')
def fin(s):
    """32,00 → 33,50 : le dernier demi-tour s'éteint dans le fondu (32,2 → 33,5)."""
    nuances(s, harpe='p', violons2='pp', contrebasses='pp')
    s.note(harpe, 'B5', 0, 1.2, vel=58)
    s.note(harpe, 'F#5', 1, 0.9, vel=50)
    accord(s, violons2, ['F#4', 'B4', 'C#5'], 0, 1.9, vel=44)
    s.note(contrebasses, 'B1', 0, 1.9, vel=46)
    for p in (violons2, contrebasses):
        s.diminuendo(p, 0, 1.9, 'pp', 'ppp')


# =====================================================================================
# Le corps : la traîne

@theme.section('traine', mesures=4, bpm=60, reprise=False)
def traine(s):
    nuances(s, contrebasses='ppp', nappe='ppp', violons2='ppp')
    # les notes débordent d'une seconde sur le passage suivant : la couture ne s'entend pas
    s.note(contrebasses, 'B1', 0, 17, vel=46)
    accord(s, nappe, ['F#3', 'C#4'], 0, 17, vel=42)
    accord(s, violons2, ['B4', 'C#5'], 0, 17, vel=38)


theme.forme(intro=['quai', 'trousseau', 'plouf', 'ronds', 'car', 'bulles', 'sapin', 'tourne', 'fin'],
            corps=['traine'])
