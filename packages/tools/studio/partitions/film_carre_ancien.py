"""FUSIBLE — la musique du film « Le carré ancien » (livre 4, « La Route de la Rive »), écrite sous
ses images (packages/tools/web/cinema/films/carre_ancien.js, 37,0 s).

Le 14 mai 1991, dix-huit heures, le cimetière d'Aubérive : l'allée à contre-jour, la tombe et ses
deux pots de chrysanthèmes, la pierre enfin lue (JULES BERTIN, 1902 – 1983), le médaillon d'un vieil
homme où passe un reflet du soleil, les six ronds pâles des pots des années d'avant ; le gardien
ferme la grille (« Deux pots pour Monsieur Bertin. Je l'écris. »), le fer claque. La musique est un
chapitre de « La Route de la Rive » (livre_h4) : sa section `creux` (« freine » : tout s'arrête, les
derniers lampadaires dans l'écho, la lumière au bout du pont), puis la mélodie de `A2` — le motif en
valeurs longues aux cordes — qui entre sur le médaillon ; la guitare qui bat ; fa# éolien, et la
clairière dorienne (le ré#) pour finir.

LE TEMPS : autour de 100 à la noire (la route), une section par plan, chaque plan un nombre entier
de temps (100 à 103,4 ; le titre ralentit à 94,7) : chaque coupe est un premier temps ; le plan de
la grille est coupé au claquement du fer.

LA FEUILLE DE SYNCHRO (temps du film → section, temps ; la musique)
   0,00  le noir, l'allée à contre-jour      c1 t.0     la pédale de fa#, la lumière (do# très haut)
   0,90  le carton « Cimetière d'Aubérive »   c1 t.1,5   la guitare, une note qui bat, au loin
   1,80 · 3,00 · 4,20  —                      c1 t.3 · 5 · 7   les derniers lampadaires (harpe, écho)
   6,00  coupe : la tombe, les deux pots      c2 t.0     la guitare : un accord de fa# mineur ; les
                                                          cordes, très doucement ; deux notes de harpe
  12,00  coupe : la pierre, JULES BERTIN      c3 t.0     ♭VI – ♭VII, les cordes qui montent
  17,24 · 17,82  la caméra arrive aux dates   c3 t.9 · 10  l'anacrouse : « fa# do# »…
  18,40  coupe : le médaillon                 c4 t.0     … « RÉ » : la mélodie entre (la mèche, sur ♭VI)
  19,20 → 23,80  le reflet passe sur l'émail   c4 t.1,3 → 9   le ré tenu (jusqu'à 22,0), « la sol# »
  24,40  coupe : la dalle, les six ronds      c5 t.0     « … fa# » : la tonique sur la coupe ; six notes
                                                          de harpe, une par rond
  27,88 · 28,46 · 29,04  —                    c5 t.6 · 7 · 8  la guitare en dorien : « fa# do# | RÉ# »
  30,20  coupe : la grille, de la rue          c6a t.0    le ré# s'éteint sous la réplique (30,4-32,9)
  32,60  le fer claque                         c6a t.4    la contrebasse et la timbale, avec lui ; rien
  33,20  le titre « Le carré ancien »          c6b t.0    fa# mineur, la lumière, la guitare : do#
  35,60  le noir commence (1,4 s)               c6b t.3,8  decrescendo
  37,00  la fin du film                        c6b t.6    la traîne (le corps : fa# mineur, tenu)

L'introduction (le film entier) : 37,0 s, sonie réglée sur elle (`sonie_sur='intro'`). Le corps :
`traine`, trois mesures (7,2 s) de fa# mineur, que le jeu boucle si le film dure plus.
"""
from moteur.ecriture import *
from partitions._fusible import phrase

theme = Theme('film_carre_ancien', 'Le carré ancien', bpm=100, mesure='4/4', tonalite='fa# mineur', graine=1991,
              ville=False, boucle_min=0, moment='le film « Le carré ancien », livre 4',
              humeur='un cimetière en mai, une pierre enfin lue')
theme.master(sonie_sur='intro')

TON = 'fa# mineur'
DOR = 'fa# dorien'
theme.salle('salle', rt60=2.8)
theme.salle('echo', temps=1.0, retour=0.42, bpm=100)

# --- les pistes --------------------------------------------------------------------------------
guitare = theme.piste('guitare', 'guitare_claire', pan=0.18, salle=0.42, echo=0.16, volume=6)
violons = theme.piste('violons', art='tenu', volume=3)
violons2 = theme.piste('violons2', 'violons', pan=-0.22, art='tenu', legato=True, volume=0)
altos = theme.piste('altos', art='tenu', legato=True, volume=1.5)
celles = theme.piste('celles', 'violoncelles', art='tenu', pan=0.25, volume=0)
basses = theme.piste('basses', 'basses_film', volume=1)
lumiere = theme.piste('lumiere', 'violons', art='tenu', profondeur=0.85, salle=0.7, pan=0.3, volume=-1)
harpe = theme.piste('harpe', pan=-0.55, echo=0.45, salle=0.3, volume=3)
timbales = theme.piste('timbales', volume=-4)
sub = theme.piste('sub', 'sub_synthe', volume=-24)

# =====================================================================================
# Le temps : une section par plan (début, fin, tempo, mesure, mesures)
PLANS = {
    'c1_allee': (0.0, 6.0, 100, (5, 4), 2),
    'c2_tombe': (6.0, 12.0, 100, (5, 4), 2),
    'c3_pierre': (12.0, 18.4, 1650 / 16, (11, 4), 1),
    'c4_medaillon': (18.4, 24.4, 100, (5, 4), 2),
    'c5_dalle': (24.4, 30.2, 3000 / 29, (5, 4), 2),
    'c6a_grille': (30.2, 33.2, 100, (5, 4), 1),
    'c6b_titre': (33.2, 37.0, 1800 / 19, (6, 4), 1),
}
ORDRE = list(PLANS)


def plan(nom):
    _d, _f, bpm, mes, n = PLANS[nom]
    return theme.section(nom, mesures=n, bpm=bpm, mesure=mes, reprise=False)


def b(s, t):
    """Le temps du film `t` → la position (en temps) depuis le début de la section en cours, à
    travers les sections suivantes au besoin."""
    pos = 0.0
    suite = ORDRE[ORDRE.index(s.section.nom):]
    for nom in suite:
        d, f, bpm, _m, _n = PLANS[nom]
        if t <= f + 1e-9 or nom == suite[-1]:
            return pos + (t - d) * bpm / 60.0
        pos += (f - d) * bpm / 60.0


def tenue(s, piste, h, t0, t1, vel=70, art=None):
    s.note(piste, h, b(s, t0), b(s, t1) - b(s, t0), vel=vel, art=art)


def accord(s, piste, notes, t0, t1, vel=58):
    for h in notes:
        tenue(s, piste, h, t0, t1, vel=vel)


def tremolo(s, piste, de, a, pas=0.25, prof=-9.0):
    pts = []
    t = de
    while t < a - 1e-9:
        pts.append((t, 0.0))
        pts.append((t + pas / 2, prof))
        t += pas
    pts.append((a, 0.0))
    s.automation(piste, 'volume', pts)


# =====================================================================================
# Les plans

@plan('c1_allee')
def c1(s):
    """L'allée à contre-jour : tout s'est arrêté (« freine ») ; la pédale de fa#, la lumière au bout
    du pont (do# très haut), la guitare au loin, les derniers lampadaires dans l'écho."""
    s.nuance(basses, 'pp', 0)
    tenue(s, basses, 'F#1', 0.0, 12.0, vel=58, art='tenu')
    s.expression(basses, [(0, 'ppp'), (b(s, 2.0), 'pp')])
    tenue(s, sub, 'F#1', 0.0, 12.0, vel=48)
    s.nuance(lumiere, 'ppp', 0)
    tenue(s, lumiere, 'C#6', 0.0, 9.0, vel=56)
    s.expression(lumiere, [(0, 'ppp'), (b(s, 3.0), 'pp'), (b(s, 9.0), 'ppp')])
    s.nuance(guitare, 'p', 0)
    tenue(s, guitare, 'C#5', 0.9, 5.4, vel=70)
    s.expression(guitare, [(b(s, 0.9), 'pp'), (b(s, 2.4), 'p'), (b(s, 5.4), 'pp')])
    tremolo(s, guitare, b(s, 0.9), b(s, 5.6), prof=-12.0)
    s.nuance(harpe, 'mp', 0)
    for t, h, v in ((1.8, 'C#5', 76), (3.0, 'A4', 64), (4.2, 'F#4', 54)):
        s.note(harpe, h, b(s, t), 1, vel=v)


@plan('c2_tombe')
def c2(s):
    """La tombe, au ras de la dalle : les deux pots. La guitare pose un accord de fa# mineur ; les
    cordes, très bas (i puis ♭VI) ; deux notes de harpe."""
    tenue(s, sub, 'F#1', 6.0, 12.0, vel=44)
    accord(s, guitare, ('F#3', 'C#4', 'A4'), 6.0, 8.4, vel=70)
    s.expression(guitare, [(0, 'p'), (b(s, 8.4), 'pp')])
    tremolo(s, guitare, 0, b(s, 8.6), prof=-8.0)
    s.nuance(violons2, 'pp', 0)
    s.nuance(altos, 'pp', 0)
    accord(s, violons2, ('A4', 'C#5'), 6.0, 9.0, vel=56)
    accord(s, altos, ('F#3', 'C#4'), 6.0, 9.0, vel=54)
    accord(s, violons2, ('A4', 'D5'), 9.0, 12.0, vel=56)
    accord(s, altos, ('F#3', 'D4'), 9.0, 12.0, vel=54)
    s.crescendo(violons2, 0, b(s, 12.0), 'pp', 'p')
    s.crescendo(altos, 0, b(s, 12.0), 'pp', 'p')
    for t, h, v in ((6.6, 'F#5', 66), (8.4, 'C#5', 58)):
        s.note(harpe, h, b(s, t), 1, vel=v)


@plan('c3_pierre')
def c3(s):
    """La pierre : JULES BERTIN, puis les dates. ♭VI (ré) puis ♭VII (mi, en quinte à vide) ; les cordes
    montent doucement ; l'anacrouse de la mélodie, « fa# do# », quand la caméra arrive aux dates."""
    s.nuance(basses, 'pp', 0)
    s.nuance(celles, 'pp', 0)
    tenue(s, basses, 'D2', 12.0, 15.5, vel=60, art='tenu')
    tenue(s, basses, 'E2', 15.5, 18.4, vel=62, art='tenu')
    tenue(s, celles, 'D3', 12.0, 15.5, vel=60)
    tenue(s, celles, 'E3', 15.5, 18.4, vel=62)
    s.crescendo(celles, 0, s.longueur, 'pp', 'p')
    s.crescendo(basses, 0, s.longueur, 'pp', 'p')
    tenue(s, sub, 'D2', 12.0, 15.5, vel=44)
    tenue(s, sub, 'E2', 15.5, 18.4, vel=44)
    accord(s, violons2, ('A4', 'D5'), 12.0, 15.5, vel=58)
    accord(s, altos, ('F#3', 'A3'), 12.0, 15.5, vel=56)
    accord(s, violons2, ('B4', 'E5'), 15.5, 18.4, vel=58)
    accord(s, altos, ('E3', 'B3'), 15.5, 18.4, vel=56)
    s.crescendo(violons2, 0, s.longueur, 'p', 'mp')
    s.crescendo(altos, 0, s.longueur, 'p', 'mp')
    # l'anacrouse, aux violons (et aux altos à l'octave) : temps 10 et 11 de la mesure (17,24 · 17,82 s)
    s.nuance(violons, 'mp', s.m(1, 10))
    for p, o, v in ((violons, 0, 90), (altos, -12, 84)):
        s.note(p, hauteur('F#4') + o, s.m(1, 10), 1, vel=v, art='legato' if p is altos else None)
        s.note(p, hauteur('C#5') + o, s.m(1, 11), 1, vel=v + 2, art='legato' if p is altos else None)


@plan('c4_medaillon')
def c4(s):
    """Le médaillon : la mélodie entre (le motif en valeurs longues, sans son anacrouse) : le ré tenu
    six temps sur ♭VI pendant que le reflet traverse l'émail (19,2-23,8 s), « la sol# » sur ♭VII,
    « si » sur i, et le fa# sur la coupe suivante (24,4 s)."""
    s.nuance(violons, 'mf', 0)
    s.nuance(altos, 'mp', 0)
    # ré (18,4-22,0) · la (22,0-22,6) · sol# (22,6-23,2) · si (23,2-24,4) · fa# (24,4 → la dalle)
    mel_ = [('D5', 0, 6), ('A4', 6, 1), ('G#4', 7, 1), ('B4', 8, 2)]
    for h, a, d in mel_:
        s.note(violons, h, a, d, vel=96)
        s.note(altos, hauteur(h) - 12, a, d, vel=88, art='legato')
    s.expression(violons, [(0, 'mp'), (b(s, 20.4), 'mf'), (b(s, 22.0), 'mf'), (b(s, 24.4), 'mp')])
    # dessous : ♭VI (ré) jusqu'à 22,0, ♭VII (mi) jusqu'à 23,2, puis i
    for h, t0, t1 in (('D2', 18.4, 22.0), ('E2', 22.0, 23.2), ('F#1', 23.2, 24.4)):
        tenue(s, basses, h, t0, t1, vel=66, art='tenu')
        tenue(s, sub, h, t0, t1, vel=46)
    for h, t0, t1 in (('D3', 18.4, 22.0), ('E3', 22.0, 23.2), ('F#2', 23.2, 24.4)):
        tenue(s, celles, h, t0, t1, vel=64)
    s.nuance(celles, 'p', 0)
    s.nuance(basses, 'p', 0)
    accord(s, violons2, ('F#4', 'A4'), 18.4, 22.0, vel=56)
    accord(s, violons2, ('E4', 'B4'), 22.0, 23.2, vel=56)
    accord(s, violons2, ('F#4', 'C#5'), 23.2, 24.4, vel=56)
    s.nuance(violons2, 'pp', 0)
    # la guitare : un accord de ♭VI qui bat, sous le ré
    accord(s, guitare, ('D3', 'A3', 'F#4'), 18.4, 21.6, vel=66)
    s.expression(guitare, [(0, 'pp'), (b(s, 21.6), 'ppp')])
    tremolo(s, guitare, 0, b(s, 21.8), prof=-7.0)


@plan('c5_dalle')
def c5(s):
    """La dalle d'en haut : le fa# de la mélodie sur la coupe ; six notes de harpe, une par rond ;
    puis la guitare en dorien, « fa# do# | RÉ# », la clairière (♭ IV majeur, si)."""
    s.note(violons, 'F#4', 0, 4, vel=88)
    s.note(altos, 'F#3', 0, 4, vel=82, art='legato')
    s.expression(violons, [(0, 'mp'), (4, 'pp')])
    s.expression(altos, [(0, 'p'), (4, 'pp')])
    tenue(s, basses, 'F#1', 24.4, 27.88, vel=60, art='tenu')
    tenue(s, celles, 'F#2', 24.4, 27.88, vel=58)
    tenue(s, sub, 'F#1', 24.4, 27.88, vel=44)
    s.nuance(basses, 'pp', 0)
    s.nuance(celles, 'pp', 0)
    accord(s, violons2, ('A4', 'C#5'), 24.4, 27.88, vel=54)
    s.nuance(violons2, 'pp', 0)
    # six ronds : six notes de harpe qui descendent, une par temps (temps 0,5 à 5,5)
    s.nuance(harpe, 'p', 0)
    for i, h in enumerate(('F#5', 'E5', 'D5', 'C#5', 'B4', 'A4')):
        s.note(harpe, h, 0.5 + i, 1, vel=70 - 2 * i)
    # la clairière : si majeur (IV dorien) sous la guitare
    for h, t0 in (('B1', 27.88), ):
        tenue(s, basses, h, t0, 32.6, vel=58, art='tenu')
    tenue(s, celles, 'F#2', 27.88, 32.6, vel=56)
    accord(s, violons2, ('B4', 'D#5'), 27.88, 32.6, vel=54)
    accord(s, altos, ('F#3', 'B3'), 27.88, 32.6, vel=52)
    s.nuance(altos, 'pp', b(s, 27.88))
    # la guitare : fa# (27,88) do# (28,46) | RÉ# (29,04), tenu
    s.nuance(guitare, 'mp', b(s, 27.8))
    for h, t0, t1, v in (('F#4', 27.88, 28.46, 86), ('C#5', 28.46, 29.04, 88), ('D#5', 29.04, 32.0, 94)):
        tenue(s, guitare, h, t0, t1, vel=v)
    s.expression(guitare, [(b(s, 27.8), 'mp'), (b(s, 29.04), 'mf'), (b(s, 30.4), 'mp'), (b(s, 32.0), 'pp')])
    tremolo(s, guitare, b(s, 27.88), b(s, 32.2), prof=-8.0)


@plan('c6a_grille')
def c6a(s):
    """La grille : la réplique du gardien (30,4-32,9 s) : le ré# s'éteint dessous ; la grille se
    ferme (31,0-32,6) ; le fer claque (32,6 s, le temps 5) : la contrebasse et la timbale avec lui,
    puis rien jusqu'au titre."""
    for p in (violons2, altos, celles, basses):
        s.expression(p, [(0, 'pp'), (b(s, 32.4), 'ppp'), (b(s, 32.6), 0.0)])
    s.note(timbales, 'F#2', b(s, 32.6), 1, vel=66)
    s.note(basses, 'F#1', b(s, 32.6), 1, vel=74, art='pizzicato')
    s.nuance(basses, 'p', b(s, 32.6) - 0.01)


@plan('c6b_titre')
def c6b(s):
    """Le titre : fa# mineur, doux, la lumière (do# très haut), la guitare au loin (do#) ; tout
    s'éteint dans le noir (35,6-37,0 s)."""
    for p, v in ((violons2, 'pp'), (altos, 'pp'), (celles, 'pp'), (basses, 'pp')):
        s.nuance(p, v, 0)
    accord(s, violons2, ('A4', 'C#5'), 33.2, 37.4, vel=60)
    accord(s, altos, ('F#3', 'C#4'), 33.2, 37.4, vel=58)
    tenue(s, celles, 'F#2', 33.2, 37.4, vel=60)
    tenue(s, basses, 'F#1', 33.2, 37.4, vel=60, art='tenu')
    tenue(s, sub, 'F#1', 33.2, 37.4, vel=44)
    for p in (violons2, altos, celles, basses):
        s.expression(p, [(0, 'pp'), (b(s, 34.2), 'p'), (b(s, 35.6), 'pp'), (b(s, 37.0), 'ppp')])
    s.nuance(lumiere, 'pp', 0)
    tenue(s, lumiere, 'C#6', 33.4, 37.4, vel=56)
    s.expression(lumiere, [(b(s, 33.4), 'ppp'), (b(s, 34.6), 'pp'), (b(s, 37.0), 'ppp')])
    s.nuance(guitare, 'p', 0)
    tenue(s, guitare, 'C#5', 33.2, 37.2, vel=72)
    s.expression(guitare, [(0, 'p'), (b(s, 35.6), 'pp'), (b(s, 37.0), 'ppp')])
    tremolo(s, guitare, 0, b(s, 37.2), prof=-10.0)


# --- la traîne : le corps, que le jeu boucle seulement si le film dure plus ----------------------
@theme.section('traine', mesures=3, bpm=100, reprise=False)
def traine(s):
    """Fa# mineur et la lumière, tenus (le médium devant) ; chaque note déborde de deux temps sur le
    passage suivant : à la couture, la traîne ne respire pas."""
    for p, v in ((violons2, 'pp'), (altos, 'pp'), (celles, 'pp'), (basses, 'pp'), (lumiere, 'ppp')):
        s.nuance(p, v, 0)
    d = s.longueur + 2
    for h in ('A4', 'C#5'):
        s.note(violons2, h, 0, d, vel=58)
    for h in ('F#3', 'C#4'):
        s.note(altos, h, 0, d, vel=56)
    s.note(celles, 'F#2', 0, d, vel=56)
    s.note(basses, 'F#1', 0, d, vel=56, art='tenu')
    s.note(lumiere, 'C#6', 0, d, vel=56)


theme.forme(intro=ORDRE, corps=['traine'])
