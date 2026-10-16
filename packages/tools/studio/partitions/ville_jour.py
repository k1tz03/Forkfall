"""FUSIBLE — « Promenade » (`ville_jour`) : la ville le jour, en balade.

Un après-midi d'été à Aubérive : quelqu'un sort et marche, la ville bavarde autour de lui ;
au milieu, un orage passe (le ciel se couvre, l'éclair, la pluie, puis la lumière revient).
Le groupe (guitare de nylon pincée, contrebasse, balais, piano) fait la marche ; l'orchestre
l'encadre (cordes en pizzicato, bois, cordes au pont, cuivres et timbales à l'orage).

98 à la noire, 4/4, balancé léger (la croche du contretemps à 0,6 du temps) ; sol dorien (un
bémol : la 6 est un MI naturel, la lumière) ; les ponts en fa majeur (les mêmes notes, une
autre lumière) ; l'orage en sol éolien (MIb : la mèche du thème principal). Mesure 2,449 s.

LE MOTIF (partitions/_fusible.py, en sol dorien) :
- la tête « sol ré | MI » en contre-chant : la flûte (intro, A, A3), les cors en fa (pont),
  les violoncelles pizz. (A6), le piano en valeurs longues (fenêtre F3) ; la 6 majeure du
  dorien se pose sur IV (do majeur) : le merveilleux qui rêve ;
- le motif complet UNE fois par boucle, sifflé (A) : quelqu'un siffle l'air de la ville ;
- l'orage : la tête en éolien aux cors (sol ré | MIb), puis la MÈCHE (la ♭6 tenue sept
  temps, sans résolution) sur la cellule | MIb – – FA5 | sol m | du thème principal ;
- jamais la phrase entière (motif et réponse) : elle est gardée pour cinq thèmes.
L'ARC : au premier temps de l'introduction (doux) ; dans la boucle, une fois : l'éclair de
l'orage, seul dans le temps de silence qui finit C1 (l'impact est le tonnerre).

L'AIR, le thème de Promenade (8 mesures, sur la grille A) : une marche qui bavarde, syncopée,
autour de ré–mi–fa (5–6–♭7) ; deux fois et demie par boucle, à trois voix (piano, bois,
guitare).

LA CARTE (la boucle : 104 mesures, 254,7 s ; l'introduction : 4 mesures, 9,8 s)
  intro   4 m.  0:00  l'arc (doux), la guitare seule, la flûte : la tête ; balais, basse    2→4
  A       8 m.  0:00  la sortie : le groupe ; le SIFFLET : le motif ; la flûte en écho        5
  A2      8 m.  0:20  le marché : le piano chante l'AIR, la guitare en accords, pizz.        5
  B       8 m.  0:39  le pont en fa : les cors (la tête en fa), les cordes chantent           6
  F1      8 m.  0:59  FENÊTRE : presque rien (six mesures), puis le groupe revient           1
  A3      8 m.  1:18  les terrasses : la flûte appelle (la tête), la clarinette répond        5
  A4      8 m.  1:38  la place : les pizz. reprennent la guitare ; les bois : la fin de l'AIR 6
  C1      8 m.  1:57  le ciel se couvre (éolien) : les cors, les trombones ; L'ARC (l'éclair) 6→7
  C2      8 m.  2:17  l'orage : le tonnerre, la MÈCHE aux cors, les trompettes ; il s'éloigne 9→4
  F2      8 m.  2:37  FENÊTRE « après la pluie » : des gouttes sur MI (le dorien revient)      1
  B2      8 m.  2:56  la lumière revient (fa) : les bois, puis les cordes et les cors        6→7
  A5      8 m.  3:16  le retour : la guitare chante l'AIR, les violoncelles pizz.            5
  F3      8 m.  3:36  FENÊTRE : le piano seul, la tête en valeurs longues                    1
  A6      8 m.  3:55  la ville tourne : le groupe seul ; la relance                           5
Fenêtres (reprise=False) toutes les 1 à 2 minutes : 0:59, 2:37, 3:36.
"""
import math

from moteur.ecriture import *
from partitions._fusible import phrase, Arc

theme = Theme('ville_jour', 'Promenade', bpm=98, mesure='4/4', tonalite='sol dorien', graine=1406,
              ville=True, moment='la ville le jour, en balade',
              humeur="la marche tranquille, l'été qui sent l'orage")
TON = 'sol dorien'

# --- les pistes (les volumes sont provisoires : le studio recalibre ses niveaux) ---------
# le groupe
guitare = theme.piste('guitare', 'guitare_nylon', volume=-1, pan=-0.3, echo=0.2, humain=(7, 8))
basse = theme.piste('basse', 'contrebasse_jazz', volume=-2, sature=0.2, humain=(6, 6),
                    eq={'cloches': [(750, 3.0, 1.0)]})
balais = theme.piste('balais', 'batterie_balais', volume=-3, humain=(5, 8))
piano = theme.piste('piano', volume=4, pan=0.05, humain=(6, 6))
# l'orchestre
vln_pz = theme.piste('vln_pz', 'violons', art='pizzicato', volume=-6)
alt_pz = theme.piste('alt_pz', 'altos', art='pizzicato', volume=-4)
vc_pz = theme.piste('vc_pz', 'violoncelles', art='pizzicato', volume=-1)
violons = theme.piste('violons', art='legato', volume=1.2)
violons2 = theme.piste('violons2', 'violons', pan=-0.2, volume=-6)
altos = theme.piste('altos', volume=-4)
celles = theme.piste('celles', 'violoncelles', volume=-2)
cb = theme.piste('cb', 'contrebasses', volume=-4)
flute = theme.piste('flute', 'flutes', unisson=1, volume=3.7)
clar = theme.piste('clar', 'clarinettes', unisson=1, volume=-2.6)
cors = theme.piste('cors', volume=-3)
trombones = theme.piste('trombones', volume=-3)
trompettes = theme.piste('trompettes', volume=-7)
tuba = theme.piste('tuba', volume=-8)
harpe = theme.piste('harpe', volume=0)
timbales = theme.piste('timbales', volume=-2)
timb_roul = theme.piste('timb_roul', 'timbales', art='roulement', volume=-1)
gcaisse = theme.piste('gcaisse', 'grosse_caisse', volume=-4)
tamtam = theme.piste('tamtam', 'tam_tam', volume=-4)
cymbales = theme.piste('cymbales', volume=-6)
suspendue = theme.piste('suspendue', 'cymbale_suspendue', volume=-8)
# l'humain
sifflet = theme.piste('sifflet', volume=-1.7, pan=0.1)
# la signature commune
arc = Arc(theme, volume=-5, impact_volume=-8)

theme.salle('echo', temps=0.75, retour=0.32)
SEC = 98 / 60.0      # les temps d'une seconde

# --- le balancé --------------------------------------------------------------------------------
BALANCE = 0.6


def balance(motif, r=BALANCE):
    """Le balancé léger : la croche du contretemps glisse à `r` du temps (les doubles croches
    suivent la même déformation, temps par temps)."""
    def w(t):
        b = math.floor(t + 1e-9)
        x = t - b
        return b + (x * r / 0.5 if x <= 0.5 else r + (x - 0.5) * (1 - r) / 0.5)
    notes = []
    for n in motif.notes:
        t0, t1 = w(n.t), w(n.t + n.d)
        notes.append(n.copie(t=t0, d=max(0.04, t1 - t0)))
    return Motif(notes, motif.longueur)


def accentue(motif, accents, vel):
    """Les vélocités croche par croche (« X x o . » : fort, moyen, doux)."""
    tab = {'X': vel + 14, 'x': vel, 'o': vel - 18}
    acc = accents.split()
    return motif.vel(lambda n, i: tab.get(acc[int(round(n.t / 0.5)) % len(acc)], vel))


# --- l'harmonie : les voix des accords ----------------------------------------------------------
# l'arpège de la guitare (de la plus grave à la plus aiguë), dans le médium
GUIT = {
    'sol m9': ['Bb3', 'D4', 'F4', 'A4', 'C5'],
    'do9': ['Bb3', 'E4', 'G4', 'A4', 'D5'],
    'sib maj7': ['D4', 'F4', 'A4', 'Bb4', 'D5'],
    'fa6': ['C4', 'D4', 'F4', 'A4', 'C5'],
    'fa': ['C4', 'F4', 'G4', 'A4', 'C5'],
    'sib': ['D4', 'F4', 'A4', 'Bb4', 'D5'],
    're m7': ['C4', 'F4', 'A4', 'C5', 'E5'],
    'la m7': ['C4', 'E4', 'G4', 'A4', 'C5'],
    'do9sus': ['Bb3', 'F4', 'G4', 'C5', 'D5'],
    'sol m': ['Bb3', 'D4', 'G4', 'Bb4', 'D5'],
    'mib maj7': ['Bb3', 'D4', 'Eb4', 'G4', 'Bb4'],
}
# le piano qui accompagne (voix sans fondamentale, autour du do central)
PIANO = {
    'sol m9': ['F3', 'A3', 'Bb3', 'D4'], 'do9': ['Bb3', 'D4', 'E4', 'A4'], 'sib maj7': ['F3', 'A3', 'C4', 'D4'],
    'fa6': ['A3', 'C4', 'D4', 'F4'], 'fa': ['A3', 'C4', 'F4', 'G4'], 'sib': ['A3', 'D4', 'F4'],
    're m7': ['F3', 'A3', 'C4', 'E4'], 'la m7': ['G3', 'C4', 'D4', 'E4'], 'do9sus': ['F3', 'Bb3', 'D4', 'G4'],
    'sol m': ['G3', 'Bb3', 'D4'], 'mib maj7': ['G3', 'Bb3', 'D4', 'Eb4'], 'do m': ['G3', 'C4', 'Eb4'],
    'mib': ['G3', 'Bb3', 'Eb4'],
}
RACINE = {'sol m9': 'G2', 'do9': 'C3', 'sib maj7': 'Bb2', 'fa6': 'F2', 'fa': 'F2', 'sib': 'Bb2', 're m7': 'D3',
          'la m7': 'A2', 'do9sus': 'C3', 'sol m': 'G2', 'mib maj7': 'Eb2', 'do m': 'C3', 'mib': 'Eb2'}

# les voix de la guitare qui accompagne (trois sons, serrés)
GUIT_COMP = {
    'sol m9': ['Bb3', 'D4', 'F4'], 'do9': ['Bb3', 'E4', 'A4'], 'sib maj7': ['A3', 'D4', 'F4'],
    'fa6': ['A3', 'C4', 'D4'],
}

# les grilles (une case par mesure ; « a|b » : deux accords, deux temps chacun)
GRILLE_A = ['sol m9', 'do9', 'sol m9', 'do9', 'sib maj7', 'do9', 'sol m9', 'fa6|do9']
GRILLE_B = ['fa', 'sib', 'fa', 'sib', 're m7', 'la m7', 'sib maj7', 'do9sus|do9']

# les figures de la guitare (rangs dans l'accord, une croche chacune) : 3+3+2, jamais deux
# mesures pareilles de suite
FIGS = ['1 3 4 2 4 3 5 4', '1 4 3 2 5 4 3 5', '2 4 5 1 4 3 5 3', '1 3 5 4 2 4 5 .']
ACC_GUIT = 'X x x X x x X x'


def arpege_guitare(s, grille, de=1, vel=74, decal=0, piste=None):
    """L'arpège pincé, mesure par mesure (une demi-mesure par accord dans « a|b »)."""
    p = piste or guitare
    for i, ch in enumerate(grille):
        fig = FIGS[(i + decal) % len(FIGS)].split()
        moities = ch.split('|')
        for k, c in enumerate(moities):
            part = fig if len(moities) == 1 else fig[4 * k:4 * k + 4]
            m = arpege(GUIT[c], ' '.join(part), pas=0.5, vel=vel)
            m = accentue(m, ACC_GUIT if len(moities) == 1 else 'X x x X', vel)
            s.joue(p, balance(m), a=s.m(de + i, 1 + 2 * k))


def accords_contretemps(s, piste, grille, de=1, vel=58, places=((1.5, 0.45), (3.0, 0.4)), voix=PIANO):
    """Des accords brefs sur les contretemps (le piano ou la guitare qui accompagnent)."""
    for i, ch in enumerate(grille):
        moities = ch.split('|')
        for t, d in places:
            c = moities[0] if (len(moities) == 1 or t < 2) else moities[1]
            for h in voix[c]:
                s.joue(piste, balance(mel(f'{h}:{d}', vel=vel)), a=s.m(de + i) + t)


def basse_ligne(s, texte, de=1, vel=88, piste=None, pas=0.5):
    """Une ligne de basse en croches (« sol2 - - . ré3 »), balancée."""
    s.joue(piste or basse, balance(seq(texte.replace('|', ' | '), pas=pas, vel=vel)), a=s.m(de))


def balais_marche(s, de, a, variante=0, vel=80):
    """Les balais : le tourbillon sur 1 et 3, la frappe sur 2 et 4, les « a » fantômes."""
    motifs = [
        'K : x . . . o . . .\nS2 : x . . . x . . .\nS : . . X . . o X o\nP : . . X . . . X .',
        'K : x . . . o . . .\nS2 : x . . . x . . .\nS : . o X . . o X .\nP : . . X . . . X .',
    ]
    s.joue(balais, balance(batterie(motifs[variante], pas=0.5, vel=vel)).remplir(s.m(a) - s.m(de)),
           a=s.m(de))


def balais_relance(s, m, vel=84):
    """La relance d'une mesure : les frappes se resserrent vers le premier temps suivant."""
    s.joue(balais, balance(batterie('K : x . . . . . x .\nS : x o x o X o X X\nS2 : x . . . . . . .',
                                    pas=0.5, vel=vel)), a=s.m(m))


def balais_ride(s, de, a, vel=70):
    """Au pont : la cymbale ride en croches balancées, la pédale sur 2 et 4."""
    s.joue(balais, balance(batterie('R : x . x o x . x o\nP : . . x . . . x .\nK : x . . . . . . .',
                                    pas=0.5, vel=vel)).remplir(s.m(a) - s.m(de)), a=s.m(de))


# --- le matériau mélodique ----------------------------------------------------------------------
MOTIF = phrase('motif', TON, octave=5)          # sol5 ré6 | mi6 ── sib5 la5 | do6 sol5 (sifflé)
TETE = phrase('tete', TON, octave=4)            # sol4 ré5 | mi5 ──
TETE_GRAVE = phrase('tete', TON, octave=2)      # sol2 ré3 | mi3 (violoncelles pizz.)
TETE_FA = phrase('tete', 'fa majeur', octave=3)   # fa3 do4 | ré4 ── (les cors, au pont)
TETE_ORAGE = phrase('tete', 'sol mineur', octave=3)   # sol3 ré4 | mib4 ── (l'habit épique)
MECHE = phrase('meche', 'sol mineur', octave=3)       # sol3 ré4 | mib4 ── sept temps
ANACROUSE_ORAGE = phrase('anacrouse', 'sol mineur', octave=3)

AIR_1 = mel('r:.5 Bb4:.5 D5:1 r:.5 C5:.5 D5:.5 E5:1.5 r:.5 D5:.5 E5:2 '
            'r:.5 D5:.5 F5:1 E5:.5 D5:.5 C5:.5 D5:1.5 r:.5 C5:.5 A4:2')
AIR_2 = mel('r:.5 Bb4:.5 D5:1 r:.5 C5:.5 D5:.5 F5:1.5 r:.5 E5:1.5 D5:.5 C5:.5 '
            'Bb4:1 r:.5 A4:.5 G4:1.5 r:2 F4:.5 G4:2')
AIR = AIR_1 + AIR_2
CROCHET = AIR_1.coupe(0, 8)                     # « (·) sib-RÉ (·) do-ré-MI ── ré MI »


# --- l'introduction --------------------------------------------------------------------------------
@theme.section('intro', mesures=4)
def intro(s):
    arc.poser(s, 0, impact=False, vel=110)
    arpege_guitare(s, ['sol m9', 'do9', 'sol m9', 'do9'], vel=70)
    s.expression(guitare, [(0, 'mp'), (s.m(3), 'mf')])
    s.joue(flute, balance(TETE), a=s.m(1, 4), vel=80)
    s.nuance(flute, 'mf')
    # les balais entrent en tourbillon, la contrebasse prend son élan
    s.joue(balais, balance(batterie('S2 : x . . . x . . .', pas=0.5, vel=60)).repete(2), a=s.m(3))
    s.crescendo(balais, s.m(3), s.m(5), 'mp', 'mf')
    basse_ligne(s, 'G2 - - . D3 - . C3 | - - - . G2 - . G2', de=3, vel=84)
    s.nuance(basse, 'mf')
    for h in PIANO['do9']:
        s.note(piano, h, s.m(4, 2.5), 1, vel=50)
    s.nuance(piano, 'mp')


# --- A : la sortie (le motif sifflé) -------------------------------------------------------------
@theme.section('A', mesures=8)
def A(s):
    arpege_guitare(s, GRILLE_A, vel=74)
    s.nuance(guitare, 'mf')
    basse_ligne(s, 'G2 - - . D3 - . C3 | - - - . G2 - . G2 | - - - . D3 - . C3 | - - - . G2 - . Bb2 | '
                   '- - - . F2 - . C3 | - - - . G2 - . G2 | - - - . D3 - . F2 | - - - . C3 - . G2')
    s.nuance(basse, 'mf')
    balais_marche(s, 1, 8)
    balais_relance(s, 8)
    s.nuance(balais, 'mf')
    # le motif, sifflé (la mèche MI sur do9), puis la tête en écho à la flûte
    s.joue(sifflet, balance(MOTIF), a=s.m(1, 4), vel=96)
    s.nuance(sifflet, 'mf')
    s.joue(flute, balance(TETE), a=s.m(5, 4), vel=78)
    s.nuance(flute, 'mp')
    # le piano, discret, sur les contretemps de la seconde moitié
    accords_contretemps(s, piano, GRILLE_A[4:], de=5, vel=54)
    s.nuance(piano, 'mp')


# --- A2 : le marché (le piano chante l'AIR) -------------------------------------------------------
@theme.section('A2', mesures=8)
def A2(s):
    s.joue(piano, balance(AIR), vel=86)
    s.nuance(piano, 'mf')
    # la guitare accompagne en accords brefs sur les contretemps
    accords_contretemps(s, guitare, GRILLE_A, vel=62, places=((1.5, 0.35), (3.5, 0.3)), voix=GUIT_COMP)
    s.nuance(guitare, 'mp')
    basse_ligne(s, 'G2 - - . D3 - . C3 | - - - . G2 - A2 Bb2 | - - - . D3 - . C3 | - - - . E2 - . F2 | '
                   'Bb2 - - . F2 - . C3 | - - - . G2 - . A2 | Bb2 - - . D3 - C3 F2 | - - - . C3 - . G2')
    s.nuance(basse, 'mf')
    balais_marche(s, 1, 8, variante=1)
    balais_relance(s, 8, vel=78)
    s.nuance(balais, 'mf')
    # les pizz. répondent quand l'AIR tient (m. 2, 4, 6)
    s.joue(vln_pz, balance(mel('A5:.5 G5:.5 E5:1')), a=s.m(2, 3), vel=70)
    s.joue(vln_pz, balance(mel('D5:.5 C5:.5 A4:1')), a=s.m(4, 3), vel=70)
    s.joue(vln_pz, balance(mel('G5:.5 A5:.5 C6:1')), a=s.m(6, 3), vel=66)
    s.nuance(vln_pz, 'mp')
    s.joue(alt_pz, balance(mel('E4:.5 D4:.5 Bb3:1')), a=s.m(2, 3), vel=66)
    s.joue(alt_pz, balance(mel('A3:.5 G3:.5 F3:1')), a=s.m(4, 3), vel=66)
    s.nuance(alt_pz, 'mp')



# --- B : le pont en fa ----------------------------------------------------------------------------
@theme.section('B', mesures=8)
def B(s):
    # les cors : la tête en fa (la 6, ré, sur SIb : IV) ; puis ils tiennent l'harmonie
    s.joue(cors, TETE_FA, a=s.m(1, 4), vel=100)
    s.nuance(cors, 'mf')
    for m, voix in ((3, ['A3', 'C4']), (4, ['Bb3', 'D4']), (5, ['A3', 'D4']), (6, ['G3', 'C4']),
                    (7, ['A3', 'D4']), (8, ['Bb3', 'C4'])):
        for h in voix:
            s.note(cors, h, s.m(m), 4, vel=62)
    s.expression(cors, [(0, 'mf'), (s.m(3), 'mp'), (s.m(5), 'mf'), (s.m(8, 4), 'mp')])
    # les violons chantent la ligne large (legato), les altos la doublent à la sixte dessous
    ligne = mel('C5:2 A4:2 Bb4:2 D5:2 F5:3 E5:1 C5:4 D5:2 Bb4:2 C5:2 Bb4:2')
    s.joue(violons, ligne, a=s.m(3), vel=80)
    s.expression(violons, [(s.m(3), 'mp'), (s.m(5), 'mf'), (s.m(6, 3), 'f'), (s.m(8, 4), 'mp')])
    s.joue(altos, ligne.diatonique(-5, 'fa majeur').art('legato'), a=s.m(3), vel=70)
    s.expression(altos, [(0, 'p'), (s.m(5), 'mp'), (s.m(8, 4), 'p')])
    # les violoncelles : un contrechant qui descend
    s.joue(celles, mel('A3:4 G3:4 F3:2 E3:2 D3:4 C3:4 D3:2 F3:2 E3:2 Bb2:2', art='legato'), vel=74)
    s.expression(celles, [(0, 'mp'), (s.m(6), 'mf'), (s.m(8, 4), 'mp')])
    # la basse en deux temps, sans anticipation : la lumière se pose
    basse_ligne(s, 'F2 - - - C3 - - - | Bb2 - - - F2 - - - | A2 - - - C3 - - - | Bb2 - - - D3 - - . | '
                   'D2 - - - A2 - - - | A2 - - - E2 - - - | Bb2 - - - F2 - - - | C3 - - - G2 - . G2', vel=84)
    s.nuance(basse, 'mf')
    balais_ride(s, 1, 8)
    s.nuance(balais, 'mp')
    # la guitare pince un accord roulé au premier temps
    for i, ch in enumerate(GRILLE_B):
        c = ch.split('|')[0]
        for k, h in enumerate(GUIT[c][:4]):
            s.note(guitare, h, s.m(i + 1) + 0.06 * k, 3.5 - 0.06 * k, vel=60)
    s.nuance(guitare, 'mp')


# --- F1 : la fenêtre (presque rien) --------------------------------------------------------------
@theme.section('F1', mesures=8, reprise=False)
def F1(s):
    # l'air : les violons tiennent ré6–la6 très doux, et s'éteignent
    for h in ('D6', 'A6'):
        s.note(violons2, h, 0, s.m(7), vel=40)
    s.expression(violons2, [(0, 'pp'), (s.m(4), 'ppp'), (s.m(7), 0.04)])
    # la guitare : une note seule toutes les deux mesures, ré, mi, la
    for m, h in ((1, 'D5'), (3, 'E5'), (5, 'A4')):
        s.note(guitare, h, s.m(m, 1.5), 4, vel=54)
    s.nuance(guitare, 'mp')
    for m in (1, 3, 5):
        s.note(vc_pz, 'G2', s.m(m), 1, vel=56)
    s.nuance(vc_pz, 'mp')
    # m. 7–8 : le groupe revient
    basse_ligne(s, 'G2 - - . D3 - . C3 | - - - . G2 - . G2', de=7, vel=78)
    s.joue(balais, balance(batterie('S2 : x . . . x . . .\nS : . . x . . . x o', pas=0.5, vel=62)).repete(2),
           a=s.m(7))
    s.crescendo(balais, s.m(7), s.m(8, 4), 'p', 'mf')


# --- A3 : les terrasses (la flûte appelle, la clarinette répond) ----------------------------------
@theme.section('A3', mesures=8)
def A3(s):
    arpege_guitare(s, GRILLE_A, vel=70, decal=2)
    s.nuance(guitare, 'mp')
    # la contrebasse marche (des noires, les approches chromatiques des terrasses)
    basse_ligne(s, 'G2 A2 Bb2 B2 | C3 G2 E2 F#2 | G2 Bb2 D3 Db3 | C3 E3 C3 A2 | Bb2 F2 D2 B2 | C3 G2 Bb2 F#2 | '
                   'G2 D3 Bb2 E2 | F2 A2 C3 F#2', pas=1, vel=84)
    s.nuance(basse, 'mf')
    balais_marche(s, 1, 9, variante=1)
    s.nuance(balais, 'mf')
    s.joue(flute, balance(TETE), a=s.m(1, 4), vel=84)
    s.joue(flute, balance(TETE), a=s.m(5, 4), vel=86)
    s.nuance(flute, 'mf')
    s.joue(clar, balance(CROCHET.transpose(-12)), a=s.m(3), vel=84)
    s.joue(clar, balance(AIR_2.coupe(0, 8).transpose(-12)), a=s.m(7), vel=84)
    s.nuance(clar, 'f')


# --- A4 : la place (les pizz. reprennent la figure ; les bois : la fin de l'AIR) -------------------
@theme.section('A4', mesures=8)
def A4(s):
    arpege_guitare(s, GRILLE_A, vel=72, decal=1, piste=vln_pz)
    s.nuance(vln_pz, 'mp')
    for i, ch in enumerate(GRILLE_A):
        c = ch.split('|')[0]
        s.joue(alt_pz, balance(mel(f'{GUIT[c][0]}:.5 r:1 {GUIT[c][1]}:.5 r:2', vel=66)), a=s.m(i + 1, 2))
    s.nuance(alt_pz, 'mp')
    basse_ligne(s, 'G2 - - . D3 - . C3 | - - - . G2 - . G2 | - - - . D3 - . C3 | - - - . G2 - . Bb2 | '
                   '- - - . F2 - . C3 | - - - . G2 - . G2 | - - - . D3 - . F2 | - - - . C3 - . G2')
    s.nuance(basse, 'mf')
    balais_marche(s, 1, 8)
    balais_relance(s, 8)
    s.nuance(balais, 'mf')
    accords_contretemps(s, piano, GRILLE_A[:4], vel=52)
    s.nuance(piano, 'mp')
    # la seconde moitié de l'AIR : la flûte la chante, la clarinette une tierce dessous
    fin_air = AIR_2
    s.joue(flute, balance(fin_air), a=s.m(5), vel=82)
    s.joue(clar, balance(fin_air.diatonique(-2, TON)), a=s.m(5), vel=78)
    s.nuance(clar, 'mf')
    s.nuance(flute, 'mf')


# --- C1 : le ciel se couvre (éolien) ---------------------------------------------------------------
GRILLE_C1 = ['sol m', 'mib maj7', 'sol m', 'mib maj7', 'do m', 'mib', 'fa', 'fa']


@theme.section('C1', mesures=8)
def C1(s):
    silence = s.m(8, 4)
    # la guitare garde son arpège quatre mesures, assombri (MIb), puis se tait
    arpege_guitare(s, GRILLE_C1[:4], vel=70, decal=3)
    s.expression(guitare, [(0, 'mf'), (s.m(4, 4), 'p')])
    # la contrebasse marche droit (sans balancé) : la ville presse le pas
    s.joue(basse, seq('G2 G2 G2 G2 | Eb2 Eb2 Eb2 Eb2 | G2 G2 G2 G2 | Eb2 Eb2 Eb2 Eb2 | C3 C3 C3 C3 | '
                      'Eb2 Eb2 Eb2 Eb2 | F2 F2 F2 F2 | F2 F2 F2 .', pas=1, vel=86))
    s.expression(basse, [(0, 'mf'), (s.m(8, 3), 'f')])
    # les balais passent aux toms : le tonnerre au loin
    s.joue(balais, batterie('T1 : x . . . . . x .\nS2 : x . . . x . . .', pas=0.5, vel=70).remplir(s.m(5)))
    s.joue(balais, batterie('T1 : x . . x . . x .\nT2 : . . x . . x . x\nK : x . . . x . . .', pas=0.5,
                            vel=78).remplir(s.m(8, 4) - s.m(5)), a=s.m(5))
    s.crescendo(balais, 0, silence, 'mp', 'f')
    # les cordes graves en trémolo, qui montent ; les violons les rejoignent
    for m, ch in enumerate(GRILLE_C1, start=1):
        r = RACINE[ch]
        d = 4 if m < 8 else 3
        s.note(celles, r.replace('2', '3') if ch != 'do m' else 'C3', s.m(m), d, vel=76, art='tremolo')
        s.note(cb, r, s.m(m), d, vel=76, art='tremolo')
    s.expression(celles, [(0, 'p'), (silence, 'f')])
    s.expression(cb, [(0, 'p'), (silence, 'f')])
    for m, voix in ((5, ['G4', 'C5', 'Eb5']), (6, ['G4', 'Bb4', 'Eb5']), (7, ['A4', 'C5', 'F5']),
                    (8, ['A4', 'C5', 'F5'])):
        for h in voix:
            s.note(violons2, h, s.m(m), 4 if m < 8 else 3, vel=74, art='tremolo')
    s.expression(violons2, [(s.m(5), 'p'), (silence, 'f')])
    # les cors : la tête en éolien (la ♭6 sur MIb) ; les trombones répondent
    s.joue(cors, TETE_ORAGE, a=s.m(1, 4), vel=90)
    s.joue(trombones, TETE_ORAGE.octave(-1), a=s.m(3, 4), vel=88)
    s.nuance(cors, 'mf')
    s.nuance(trombones, 'mf')
    # les timbales roulent, la cymbale monte vers le silence
    s.note(timb_roul, 'G2', s.m(7), 7, vel=90)
    s.crescendo(timb_roul, s.m(7), silence, 'p', 'f')
    s.note(suspendue, 'C4', silence - 4 * SEC, 4 * SEC, vel=96, art='monte_4s')
    # le temps de silence : l'arc (l'éclair), et les cors prennent leur élan (« fu-si »)
    arc.poser(s, silence, impact=False, vel=124)
    s.joue(cors, ANACROUSE_ORAGE, a=silence, vel=104)
    s.nuance(cors, 'f', silence)


# --- C2 : l'orage -----------------------------------------------------------------------------
@theme.section('C2', mesures=8)
def C2(s):
    # le tonnerre : l'impact de l'arc, la grosse caisse, le tam-tam, les timbales
    s.note(arc.impact, 'G1', 0, 2, vel=118, art='impact')
    s.note(gcaisse, 'C4', 0, 2, vel=118)
    s.note(tamtam, 'C4', 0, 6, vel=110)
    s.note(timbales, 'G2', 0, 1, vel=120)
    s.note(cymbales, 'C4', 0, 2, vel=110)
    # la MÈCHE aux cors (mib tenu sept temps), sur MIb – – FA5 | sol m
    s.joue(cors, MECHE.coupe(1, 8), a=0, vel=110)
    s.expression(cors, [(0, 'ff'), (s.m(4, 4), 'ff'), (s.m(5), 'fff'), (s.m(6, 4), 'mf'), (s.m(8, 4), 'p')])
    # les trombones répondent (la tête, une octave dessous) ; puis cors et trombones ensemble
    s.joue(trombones, TETE_ORAGE.octave(-1), a=s.m(2, 4), vel=104)
    s.joue(cors, TETE_ORAGE, a=s.m(4, 4), vel=108)
    s.joue(trombones, TETE_ORAGE.octave(-1), a=s.m(4, 4), vel=104)
    s.expression(trombones, [(0, 'ff'), (s.m(5), 'fff'), (s.m(6, 4), 'mf'), (s.m(8, 4), 'p')])
    # les trompettes : un contrechant qui bouge quand les cors tiennent
    s.joue(trompettes, mel('r:1 G4:.5 Bb4:.5 Eb5:1.5 D5:.5 | C5:2 Bb4:1 r:1 | r:1 Bb4:.5 D5:.5 G5:1.5 F5:.5 | '
                           'Eb5:2 D5:1 r:1'), vel=104)
    s.expression(trompettes, [(0, 'f'), (s.m(4, 4), 'ff'), (s.m(6), 'mp'), (s.m(8, 4), 'pp')])
    # la cellule du thème principal, temps par temps : | MIb – – FA5 | sol m | (deux fois), puis
    # do m | MIb | FA | sol m ; le tuba sur les fondamentales
    temps = (['Eb', 'Eb', 'Eb', 'F'] + ['G'] * 4) * 2 + ['C'] * 4 + ['Eb'] * 4 + ['F'] * 4 + ['G'] * 4
    for t, r in enumerate(temps):
        if t == 0 or temps[t - 1] != r:
            fin = t + 1
            while fin < len(temps) and temps[fin] == r and not (fin % 4 == 0 and fin >= 16):
                fin += 1
            s.note(tuba, r + '2', t, fin - t, vel=110 if t < 16 else 96)
    s.expression(tuba, [(0, 'ff'), (s.m(6), 'mf'), (s.m(8, 4), 'p')])
    # les cordes graves : doubles croches 3+3+2 sur ces fondamentales (le moteur du thème
    # principal), jamais deux mesures pareilles de suite
    figs = ['X x x X x x X x X x x X x x X x', 'X x x X x x X x X x x X x X x x', 'X x X x x X x x X x x X x x X x']
    octaves = {'Eb': ('Eb3', 'Eb2'), 'F': ('F3', 'F2'), 'G': ('G2', 'G2'), 'C': ('C3', 'C2')}
    for t, r in enumerate(temps):
        acc = figs[(t // 4) % 3].split()[4 * (t % 4):4 * (t % 4) + 4]
        vc, cbh = octaves[r]
        s.joue(celles, ostinato([vc], pas=0.25, longueur=1, vel=94, accents=' '.join(acc), art='staccato'), a=t)
        s.joue(cb, ostinato([cbh], pas=0.25, longueur=1, vel=90, accents=' '.join(acc), art='staccato'), a=t)
    s.expression(celles, [(0, 'ff'), (s.m(5), 'ff'), (s.m(6), 'mf'), (s.m(8, 4), 'pp')])
    s.expression(cb, [(0, 'ff'), (s.m(5), 'ff'), (s.m(6), 'mf'), (s.m(8, 4), 'pp')])
    # les violons en trémolo : les accords de la cellule (♭VII à vide au 4e temps)
    # (sol mineur sans son ré : la mèche, mib, frotte contre sol et sib, pas contre la quinte)
    voix = {'Eb': ['G4', 'Bb4', 'Eb5'], 'F': ['F4', 'C5'], 'G': ['G4', 'Bb4', 'G5'], 'C': ['G4', 'C5', 'Eb5']}
    for t, r in enumerate(temps):
        if t == 0 or temps[t - 1] != r or t % 4 == 0:
            fin = t + 1
            while fin < len(temps) and temps[fin] == r and fin % 4 != 0:
                fin += 1
            for h in voix[r]:
                s.note(violons2, h, t, fin - t, vel=88, art='tremolo')
    s.expression(violons2, [(0, 'f'), (s.m(5), 'ff'), (s.m(6), 'mp'), (s.m(8, 4), 'ppp')])
    # les timbales, la cymbale, le second coup de tonnerre (m. 5)
    for m, h in ((2, 'G2'), (3, 'D2'), (4, 'G2'), (5, 'C3'), (7, 'F2')):
        s.note(timbales, h, s.m(m), 1, vel=104 if m < 6 else 86)
    s.note(tamtam, 'C4', s.m(5), 6, vel=96)
    s.note(cymbales, 'C4', s.m(5), 2, vel=100)
    s.note(gcaisse, 'C4', s.m(5), 2, vel=104)
    # la batterie : les toms qui roulent puis se taisent
    s.joue(balais, batterie('T1 : X . . x . . x .\nT2 : . x . . x . . x\nK : X . . . X . . .', pas=0.5,
                            vel=100).remplir(s.m(6)))
    s.expression(balais, [(0, 'ff'), (s.m(5), 'ff'), (s.m(6), 'p')])
    # la fin : sol mineur qui s'éteint ; les premières gouttes (harpe)
    s.note(timb_roul, 'G2', s.m(7), 8, vel=70)
    s.expression(timb_roul, [(s.m(7), 'mp'), (s.m(8, 4), 'ppp')])
    for i, h in enumerate(('D6', 'Bb5', 'G5', 'D6')):
        s.note(harpe, h, s.m(7, 2) + 1.5 * i, 1.5, vel=60)
    s.nuance(harpe, 'mp')


# --- F2 : après la pluie -------------------------------------------------------------------------
@theme.section('F2', mesures=8, reprise=False)
def F2(s):
    # la tenue aiguë des violons (l'air lavé) ; des gouttes sur MI : le dorien revient
    for h in ('G5', 'D6'):
        s.note(violons2, h, 0, s.m(6), vel=42)
    s.expression(violons2, [(0, 'pp'), (s.m(6), 0.05)])
    gouttes = [(1, 2, 'E5'), (1, 3.5, 'D5'), (2, 2.5, 'A5'), (3, 1.5, 'E6'), (4, 3, 'G5'), (5, 2, 'E5'),
               (6, 1, 'D6'), (6, 3.5, 'C6')]
    for m, t, h in gouttes:
        s.note(harpe, h, s.m(m, t), 2, vel=58)
    s.nuance(harpe, 'mp')
    for m in (1, 4):
        s.note(vc_pz, 'G2', s.m(m), 1, vel=52)
    s.nuance(vc_pz, 'p')
    # m. 7–8 : la guitare revient, la basse appelle le pont (do9sus → fa)
    arpege_guitare(s, ['sol m9', 'do9sus'], de=7, vel=62)
    s.crescendo(guitare, s.m(7), s.m(8, 4), 'p', 'mf')
    basse_ligne(s, 'G2 - - . D3 - . C3 | - - - . G2 - . C3', de=7, vel=74)
    s.joue(balais, balance(batterie('S2 : x . . . x . . .\nP : . . x . . . x .', pas=0.5, vel=56)), a=s.m(8))
    s.nuance(balais, 'mp')


# --- B2 : la lumière revient (le pont, autrement) --------------------------------------------------
@theme.section('B2', mesures=8)
def B2(s):
    # les bois chantent la première moitié (la flûte, la clarinette une sixte dessous)
    ligne = mel('A4:2 C5:2 D5:3 C5:1 A4:2 F4:2 G4:4')
    s.joue(flute, ligne, vel=64)
    s.joue(clar, ligne.diatonique(-2, 'fa majeur').octave(-1), vel=74)
    s.nuance(flute, 'mf')
    s.nuance(clar, 'mp')
    # puis les cordes et les cors s'ouvrent (m. 5–8)
    large = mel('F5:3 E5:1 C5:4 D5:2 F5:2 E5:2 C5:2')
    s.joue(violons, large, a=s.m(5), vel=74)
    s.expression(violons, [(s.m(5), 'mf'), (s.m(7), 'f'), (s.m(8, 4), 'mf')])
    s.joue(altos, large.diatonique(-5, 'fa majeur').art('legato'), a=s.m(5), vel=76)
    s.expression(altos, [(0, 'mp'), (s.m(7), 'mf')])
    s.joue(celles, mel('D3:4 A2:4 Bb2:4 C3:4', art='legato'), a=s.m(5), vel=80)
    s.nuance(celles, 'mf')
    for m, voix in ((5, ['A3', 'D4']), (6, ['G3', 'C4']), (7, ['A3', 'D4']), (8, ['Bb3', 'C4'])):
        for h in voix:
            s.note(cors, h, s.m(m), 4, vel=70)
    s.expression(cors, [(s.m(5), 'mp'), (s.m(7), 'mf'), (s.m(8, 4), 'mp')])
    # le groupe : la guitare arpège, la basse en deux temps, la ride
    arpege_guitare(s, GRILLE_B, vel=66, decal=1)
    s.nuance(guitare, 'mp')
    basse_ligne(s, 'F2 - - - C3 - . C3 | Bb2 - - - F2 - . F2 | A2 - - - C3 - . C3 | Bb2 - - - D3 - . D3 | '
                   'D2 - - - A2 - . A2 | A2 - - - E2 - . E2 | Bb2 - - - F2 - . F2 | C3 - - - G2 - . G2', vel=84)
    s.nuance(basse, 'mf')
    balais_ride(s, 1, 8, vel=72)
    s.nuance(balais, 'mp')


# --- A5 : le retour (la guitare chante l'AIR) ------------------------------------------------------
@theme.section('A5', mesures=8)
def A5(s):
    # la guitare chante l'antécédent, une octave plus bas ; le piano accompagne
    s.joue(guitare, balance(AIR_1.transpose(-12)), vel=110)
    s.nuance(guitare, 'mf')
    arpege_guitare(s, GRILLE_A[4:], de=5, vel=70, decal=2)
    accords_contretemps(s, piano, GRILLE_A[:4], vel=56)
    s.nuance(piano, 'mp')
    # les violoncelles pizz. doublent la basse (le grave se lit au téléphone)
    ligne = 'G2 - - . D3 - . C3 | - - - . G2 - . G2 | - - - . D3 - . C3 | - - - . G2 - . Bb2 |' \
            '- - - . F2 - . C3 | - - - . G2 - . G2 | - - - . D3 - . F2 | - - - . C3 - . G2'
    basse_ligne(s, ligne)
    s.nuance(basse, 'mf')
    s.joue(vc_pz, balance(seq(ligne.replace('|', ' | '), pas=0.5, vel=74)).transpose(12), a=0)
    s.nuance(vc_pz, 'mp')
    balais_marche(s, 1, 8, variante=1)
    balais_relance(s, 8, vel=78)
    s.nuance(balais, 'mf')
    # la tête aux violons pizz. (m. 6–7), un clin d'œil
    s.joue(vln_pz, balance(TETE), a=s.m(5, 4), vel=74)
    s.nuance(vln_pz, 'mp')


# --- F3 : la fenêtre (le piano seul, la tête en valeurs longues) ------------------------------------
@theme.section('F3', mesures=8, reprise=False)
def F3(s):
    lente = TETE.augmente(4)      # sol — ré — | mi ———— (douze temps)
    s.joue(piano, lente, a=0, vel=66)
    s.note(piano, 'G2', 0, 4, vel=44)
    for h in ('Bb3', 'D4', 'F4'):
        s.note(piano, h, 0.5, 3.5, vel=36)
    for h in ('Bb3', 'E4', 'G4'):
        s.note(piano, h, s.m(2), 12, vel=36)
    s.note(piano, 'C3', s.m(2), 12, vel=42)
    s.nuance(piano, 'mf')
    # l'air ne s'éteint jamais tout à fait : les violons tiennent ré6–la5 à peine (m. 4–7)
    for h in ('A5', 'D6'):
        s.note(violons2, h, s.m(4), 14, vel=40)
    s.expression(violons2, [(s.m(4), 0.05), (s.m(5), 'ppp'), (s.m(7, 3), 0.04)])
    # m. 7–8 : le groupe revient
    basse_ligne(s, 'G2 - - . D3 - . C3 | - - - . G2 - . G2', de=7, vel=80)
    arpege_guitare(s, ['sol m9', 'do9'], de=7, vel=64, decal=3)
    s.crescendo(guitare, s.m(7), s.m(8, 4), 'p', 'mf')
    s.joue(balais, balance(batterie('S2 : x . . . x . . .\nS : . . x . . o x o', pas=0.5, vel=64)).repete(2),
           a=s.m(7))
    s.crescendo(balais, s.m(7), s.m(8, 4), 'p', 'mf')


# --- A6 : la ville tourne (le groupe seul, la relance) -----------------------------------------------
@theme.section('A6', mesures=8)
def A6(s):
    arpege_guitare(s, GRILLE_A, vel=74, decal=1)
    s.nuance(guitare, 'mf')
    basse_ligne(s, 'G2 - - . D3 - . C3 | - - - . G2 - A2 Bb2 | - - - . D3 - . C3 | - - - . E2 - . F2 | '
                   'Bb2 - - . F2 - . C3 | - - - . G2 - . A2 | Bb2 - - . D3 - C3 F2 | - - - . C3 - . G2')
    s.nuance(basse, 'mf')
    balais_marche(s, 1, 8)
    balais_relance(s, 8, vel=84)
    s.nuance(balais, 'mf')
    accords_contretemps(s, piano, GRILLE_A, vel=54)
    s.nuance(piano, 'mp')
    s.joue(vc_pz, balance(TETE_GRAVE), a=s.m(5, 4), vel=80)
    s.nuance(vc_pz, 'mf')


theme.forme(intro=['intro'], corps=['A', 'A2', 'B', 'F1', 'A3', 'A4', 'C1', 'C2', 'F2', 'B2', 'A5', 'F3', 'A6'])
