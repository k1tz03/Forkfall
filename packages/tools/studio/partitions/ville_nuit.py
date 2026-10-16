"""FUSIBLE — « Néons » (`ville_nuit`) : le soir et la nuit en ville.

Les enseignes s'allument, la chaleur reste dans les rues, on traîne. Ralenti, moite, délavé :
un piano électrique qui ondule (la signature), une contrebasse en demi-temps, une nappe de
cordes très douce, une trompette en sourdine au loin ; l'orchestre encadre le groupe et se lève
une fois, quand les néons s'allument.

82 à la noire, 4/4 en demi-temps (grosse caisse sur 1, baguette sur le cercle sur 3,
charleston rare) ; ré éolien (un bémol : la même armure que le jour, le soir tombe sans
changer de clé). Mesure 2,927 s.

LE MOTIF (partitions/_fusible.py, en ré mineur) :
- la tête « ré la | SIb » (la ♭6 sur ♭VI, l'habit épique) : au vibraphone dans
  l'introduction ; aux cors à l'ouverture du sommet D (« fu-si » dans le temps de silence) ;
- le motif UNE fois, en augmentation, à la trompette en sourdine (harmon), au milieu du long
  creux : la mèche sur SIb maj7, « fa mi » sur DO à vide, « sol ré » sur ré m ;
- jamais la phrase entière.
L'ARC : au premier temps de l'introduction (une enseigne qui grésille) ; dans la boucle une
fois : le temps de silence qui finit le creux (les néons s'allument), l'impact sur D.

LA NUIT, le thème de Néons (8 mesures sur la navette ré m9 – DO – SIb maj7 – DO) : des
soupirs, une appoggiature qui descend sur chaque premier temps, le sommet sur LA5 ; au piano
électrique (en retard sur le temps), au vibraphone, aux violons au sommet.

LA CARTE (la boucle : 88 mesures, 257,6 s ; l'introduction : 4 mesures, 11,7 s)
  intro   4 m.  0:00  l'arc (doux), le piano électrique, la tête au vibraphone ; la batterie 2→4
  A       8 m.  0:00  le boulevard : la navette, contrebasse en demi-temps, nappe pp          4
  A2      8 m.  0:23  les vitrines : LA NUIT au piano électrique, le vibraphone l'double      5
  F1      8 m.  0:47  FENÊTRE : l'accord qui sonne, presque rien ; la batterie revient        1
  B       8 m.  1:10  le comptoir : ré m9 / SIb maj7♯11, la clarinette grave chante           5
  A3      8 m.  1:34  les feux : LA NUIT variée, au vibraphone                                5
  C      16 m.  1:57  LE LONG CREUX sans batterie : presque rien, puis LA TROMPETTE (le
                      motif), puis les violoncelles ; le silence et L'ARC                    2→4
  D       8 m.  2:44  les néons s'allument : les cors, les violons chantent LA NUIT          7
  F2      8 m.  3:07  FENÊTRE                                                                  1
  A4      8 m.  3:31  la dernière rue : la navette, LA NUIT à moitié                          5
  B2      8 m.  3:54  le comptoir, plus tard ; la relance                                     5
Fenêtres (reprise=False ; et les quatre premières mesures du creux) : 0:47, 1:57, 3:07.
"""
from moteur.ecriture import *
from partitions._fusible import phrase, Arc

theme = Theme('ville_nuit', 'Néons', bpm=82, mesure='4/4', tonalite='ré mineur', graine=2311,
              ville=True, moment='le soir et la nuit en ville',
              humeur='ralenti, moite, délavé : la chaleur reste dans les rues')
TON = 'ré mineur'
SEC = 82 / 60.0      # les temps d'une seconde

# --- les pistes (les volumes sont provisoires : le studio recalibre ses niveaux) ---------
# le groupe
ep = theme.piste('ep', 'piano_electrique', art='desaccorde', volume=0, largeur=1.0, salle=0.3, humain=(6, 6))
ep_chant = theme.piste('ep_chant', 'piano_electrique', art='desaccorde', volume=2, retard=0.04, salle=0.3,
                       echo=0.12, humain=(8, 6))
basse = theme.piste('basse', 'contrebasse_jazz', volume=-6, sature=0.2, humain=(6, 4),
                    eq={'cloches': [(700, 3.0, 1.0)]})
balais = theme.piste('balais', 'batterie_balais', volume=-9, humain=(5, 6))
kit = theme.piste('batterie', 'batterie_jazz', volume=-4, plaque=0.18, humain=(5, 8))
# l'orchestre
vibra = theme.piste('vibra', 'vibraphone', volume=4, pan=-0.3, echo=0.15, retard=0.03)
nappe_v = theme.piste('nappe_v', 'violons', volume=-5.6, largeur=1.3, profondeur=0.75, salle=0.45)
nappe_a = theme.piste('nappe_a', 'altos', volume=-2.2, largeur=1.2, profondeur=0.75, salle=0.45)
nappe_c = theme.piste('nappe_c', 'violoncelles', volume=-2.6, profondeur=0.7, salle=0.4)
violons = theme.piste('violons', art='legato', volume=-1.8, profondeur=0.55, salle=0.4)
celles = theme.piste('celles', 'violoncelles', art='legato', volume=-2.5)
cb = theme.piste('cb', 'contrebasses', art='sans_vibrato', volume=-7)
clar = theme.piste('clar', 'clarinettes', unisson=1, volume=-1.6, retard=0.03, pan=0.15)
trompette = theme.piste('trompette', 'trompettes', art='harmon', unisson=1, volume=-4, pan=0.25,
                        profondeur=0.8, salle=0.5, echo=0.18, retard=0.05, eq={'passe_bas': 6500})
cors = theme.piste('cors', volume=-6)
timbales = theme.piste('timbales', volume=-6)
suspendue = theme.piste('suspendue', 'cymbale_suspendue', volume=-10)
# la signature commune
arc = Arc(theme, volume=-6, impact_volume=-9)

theme.salle('echo', temps=0.75, retour=0.3)

# --- l'harmonie ---------------------------------------------------------------------------------
# le piano électrique (voix sans fondamentale, dans le médium)
EP = {
    're m9': ['F3', 'C4', 'E4', 'A4'], 'do add9': ['E3', 'G3', 'C4', 'D4'],
    'sib maj7#11': ['F3', 'A3', 'D4', 'E4'], 'sib maj7': ['F3', 'A3', 'D4', 'F4'],
    'do sus4': ['F3', 'G3', 'C4', 'D4'], 'do': ['E3', 'G3', 'C4', 'E4'], 'sol m9': ['F3', 'A3', 'Bb3', 'D4'],
    'la m7': ['G3', 'C4', 'E4'], 'do5': ['G3', 'C4', 'G4'], 're m sus4': ['G3', 'A3', 'D4'],
    're m': ['F3', 'A3', 'D4'],
}
# la nappe : (violons, altos, violoncelles)
NAPPE = {
    're m9': (['A4', 'E5'], ['F4'], ['D3']), 'do add9': (['G4', 'D5'], ['E4'], ['C3']),
    'sib maj7#11': (['A4', 'E5'], ['D4'], ['Bb2']), 'sib maj7': (['A4', 'D5'], ['F4'], ['Bb2']),
    'do sus4': (['G4', 'D5'], ['F4'], ['C3']), 'do': (['G4', 'E5'], ['C4'], ['C3']),
    'sol m9': (['A4', 'D5'], ['Bb3'], ['G2']), 'la m7': (['G4', 'E5'], ['C4'], ['A2']),
}
RACINE = {'re m9': 'D2', 'do add9': 'C2', 'sib maj7#11': 'Bb1', 'sib maj7': 'Bb1', 'do sus4': 'C2', 'do': 'C2',
          'sol m9': 'G1', 'la m7': 'A1', 're m': 'D2', 're m sus4': 'D2', 'do5': 'C2'}

NAVETTE = ['re m9', 'do add9', 'sib maj7#11', 'do sus4', 're m9', 'do add9', 'sib maj7', 'do']
NAVETTE_2 = ['re m9', 'do add9', 'sib maj7', 'sol m9', 're m9', 'do add9', 'sib maj7', 'la m7']
BALANCEMENT = ['re m9', 'sib maj7#11', 're m9', 'sib maj7#11', 'sol m9', 'sib maj7', 'do sus4', 'do']

# les rythmes du piano électrique (une mesure : (temps, durée, vélocité relative)), en demi-temps
RYTHMES_EP = [
    [(0, 1.5, 0), (1.5, 0.5, -16), (3.5, 0.5, -10)],
    [(0, 2.5, 0), (2.5, 0.5, -14)],
    [(0, 1.0, 0), (1.5, 1.5, -8)],
    [(0, 3.0, 0), (3.5, 0.5, -12)],
]


def ep_comp(s, grille, de=1, vel=70, decal=0):
    """Le piano électrique : la navette, un rythme différent à chaque mesure."""
    for i, ch in enumerate(grille):
        for t, d, dv in RYTHMES_EP[(i + decal) % len(RYTHMES_EP)]:
            for h in EP[ch]:
                s.note(ep, h, s.m(de + i) + t, d, vel=vel + dv)


def nappe(s, grille, de=1, vel=60, ondule=True, jusqua=None):
    """La nappe de cordes, une tenue par mesure ; elle ondule (deux mesures pour monter et
    redescendre) : « une nappe qui ondule fort »."""
    for i, ch in enumerate(grille):
        v, a, c = NAPPE[ch]
        m = de + i
        fin = s.m(m + 1) if jusqua is None else min(s.m(m + 1), jusqua)
        for h in v:
            s.note(nappe_v, h, s.m(m), fin - s.m(m), vel=vel)
        for h in a:
            s.note(nappe_a, h, s.m(m), fin - s.m(m), vel=vel)
        for h in c:
            s.note(nappe_c, h, s.m(m), fin - s.m(m), vel=vel - 4)
    if ondule:
        pts = []
        for k in range(0, len(grille), 2):
            pts += [(s.m(de + k), 'pp'), (s.m(de + k + 1), 'mp')]
        pts.append((s.m(de + len(grille)), 'pp'))
        for p in (nappe_v, nappe_a, nappe_c):
            s.expression(p, pts)


def basse_ligne(s, texte, de=1, vel=86, pas=0.5):
    s.joue(basse, seq(texte.replace('|', ' | '), pas=pas, vel=vel), a=s.m(de))


def demi_temps(s, de, a, variante=0, vel=84):
    """La batterie en demi-temps : grosse caisse sur 1, baguette sur le cercle sur 3 ; le
    charleston, rare (un contretemps toutes les deux mesures)."""
    motifs = [
        'K : X . . . . . . . . . . . . . . .\nSR : . . . . . . . . X . . . . . . .',
        'K : X . . . . . . x . . . . . . . .\nSR : . . . . . . . . X . . . . . . .\nH : . . . . . . . . . . . . . . x .',
        'K : X . . . . . . . . . x . . . . .\nSR : . . . . . . . . X . . . . . . .',
        'K : X . . . . . . x . . . . . . . .\nSR : . . . . . . . . X . . . . . . o\nH : . . . . . . . . . . . . . . x .',
    ]
    for m in range(de, a):
        s.joue(kit, batterie(motifs[(m - de + variante) % len(motifs)], pas=0.25, vel=vel), a=s.m(m))


def relance(s, m, vel=84):
    s.joue(kit, batterie('K : X . . . . . . . . . X . . . . .\nSR : . . . . . . . . X . . . . . . .\n'
                              'S : . . . . . . . . . . . . x o x X', pas=0.25, vel=vel), a=s.m(m))


# --- le matériau mélodique ----------------------------------------------------------------------
TETE_VIBRA = phrase('tete', TON, octave=5)                 # ré5 la5 | sib5 ──
TETE_CORS = phrase('tete', TON, octave=3)                  # ré3 la3 | sib3 ──
MOTIF_LENT = phrase('motif', TON, octave=4).augmente(2)    # ré4 la4 | sib4 ────── fa4 mi4 | sol4 ré4 ────
NUIT = mel('E5:1.5 D5:1.5 A4:1 | D5:1.5 C5:1.5 G4:.5 A4:.5 | E5:2.5 D5:.5 C5:1 | F5:2 E5:2 | '
           'A5:2 G5:.5 F5:.5 E5:1 | D5:2.5 C5:1.5 | D5:1 C5:1 A4:2 | G4:3 r:1')
NUIT_B = mel('E5:1.5 D5:1.5 A4:1 | D5:1.5 C5:1.5 G4:.5 A4:.5 | E5:2.5 D5:.5 C5:1 | Bb4:2 A4:1 G4:1 | '
             'F4:1.5 A4:.5 D5:2 | E5:2.5 D5:1.5 | C5:1 A4:1 F4:2 | E4:3 r:1')
CLAR = mel('A3:3 G3:.5 F3:.5 | E3:4 | F3:1 A3:1 D4:2 | C4:2.5 Bb3:.5 A3:1 | Bb3:3 A3:1 | G3:2 F3:2 | '
           'E3:3 F3:1 | G3:4')
CLAR_2 = mel('D4:3 C4:.5 A3:.5 | E4:4 | F4:1 E4:1 D4:2 | C4:2.5 A3:.5 G3:1 | Bb3:2 D4:2 | F4:2 E4:2 | '
             'D4:3 C4:1 | E4:4')


# --- l'introduction --------------------------------------------------------------------------------
@theme.section('intro', mesures=4)
def intro(s):
    arc.poser(s, 0, impact=False, vel=104)
    for h in EP['re m9']:
        s.note(ep, h, 0.05, 3.9, vel=70)
    for h in EP['sib maj7#11']:
        s.note(ep, h, s.m(2), 3.9, vel=66)
    ep_comp(s, ['re m9', 'do sus4'], de=3, vel=66)
    s.nuance(ep, 'mf')
    s.note(basse, 'D2', 0, 3.5, vel=80)
    s.note(basse, 'Bb1', s.m(2), 3.5, vel=78)
    basse_ligne(s, 'D2 - - - - - . A1 | C2 - - - G2 - C2 .', de=3, vel=82)
    s.nuance(basse, 'mf')
    s.joue(vibra, TETE_VIBRA, a=s.m(1, 4), vel=82)
    s.nuance(vibra, 'mf')
    nappe(s, ['re m9', 'sib maj7#11', 're m9', 'do sus4'], vel=56)
    demi_temps(s, 3, 4)
    relance(s, 4, vel=74)
    s.crescendo(kit, s.m(3), s.m(5), 'mp', 'mf')


# --- A : le boulevard ------------------------------------------------------------------------------
@theme.section('A', mesures=8)
def A(s):
    ep_comp(s, NAVETTE, vel=72)
    s.nuance(ep, 'mf')
    basse_ligne(s, 'D2 - - - - - . A1 | C2 - - - - - . G1 | Bb1 - - - - - . F2 | C2 - - - G2 - C2 . | '
                   'D2 - - - - - . A1 | C2 - - - - - E2 . | Bb1 - - - - - . F1 | C2 - - - - . E2 C2')
    s.nuance(basse, 'mf')
    demi_temps(s, 1, 9)
    s.nuance(kit, 'mf')
    nappe(s, NAVETTE, vel=58)
    # le vibraphone, très loin : une note par deux mesures (la lumière d'une enseigne)
    for m, h in ((2, 'E5'), (4, 'D5'), (6, 'G5'), (8, 'E5')):
        s.note(vibra, h, s.m(m, 3), 2, vel=58)
    s.nuance(vibra, 'mp')


# --- A2 : les vitrines (LA NUIT au piano électrique) -----------------------------------------------
@theme.section('A2', mesures=8)
def A2(s):
    ep_comp(s, NAVETTE, vel=64, decal=1)
    s.nuance(ep, 'mp')
    s.joue(ep_chant, NUIT, vel=88)
    s.nuance(ep_chant, 'mf')
    s.joue(vibra, NUIT.coupe(16, 32), a=s.m(5), vel=64)
    s.nuance(vibra, 'mp')
    basse_ligne(s, 'D2 - - - - - . A1 | C2 - - - - - . G1 | Bb1 - - - - - . F2 | C2 - - - G2 - C2 . | '
                   'D2 - - - A2 - . A1 | C2 - - - G2 - . G1 | Bb1 - - - F2 - . F1 | C2 - - - - . E2 C2')
    s.nuance(basse, 'mf')
    demi_temps(s, 1, 8, variante=1)
    relance(s, 8)
    s.nuance(kit, 'mf')
    nappe(s, NAVETTE, vel=58)


# --- F1 : la fenêtre ----------------------------------------------------------------------------
@theme.section('F1', mesures=8, reprise=False)
def F1(s):
    for h in EP['re m9']:
        s.note(ep, h, 0, 8, vel=58)
    s.nuance(ep, 'mp')
    s.note(basse, 'D2', 0, 6, vel=70)
    s.nuance(basse, 'mp')
    s.note(vibra, 'A5', s.m(3, 2), 3, vel=52)
    s.note(vibra, 'E5', s.m(5, 3), 3, vel=50)
    s.nuance(vibra, 'mp')
    for p, h in ((nappe_v, 'A5'), (nappe_a, 'E5')):
        s.note(p, h, 0, s.m(5), vel=44)
        s.expression(p, [(0, 'pp'), (s.m(5), 0.03)])
    # m. 7–8 : le groupe revient
    ep_comp(s, ['re m9', 'do sus4'], de=7, vel=60, decal=2)
    basse_ligne(s, 'D2 - - - - - . A1 | C2 - - - G2 - C2 .', de=7, vel=78)
    demi_temps(s, 7, 8, vel=72)
    relance(s, 8, vel=72)
    s.crescendo(kit, s.m(7), s.m(9), 'mp', 'mf')


# --- B : le comptoir (le balancement ; la clarinette grave) -----------------------------------------
@theme.section('B', mesures=8)
def B(s):
    ep_comp(s, BALANCEMENT, vel=66, decal=2)
    s.nuance(ep, 'mp')
    s.joue(clar, CLAR, vel=86)
    s.nuance(clar, 'mf')
    basse_ligne(s, 'D2 - - - - - . A1 | Bb1 - - - - - . F1 | D2 - - - - - . A1 | Bb1 - - - F2 - . A1 | '
                   'G1 - - - - - . D2 | Bb1 - - - - - . F2 | C2 - - - - - . G1 | C2 - - - G2 - E2 .')
    s.nuance(basse, 'mf')
    demi_temps(s, 1, 9, variante=1)
    s.nuance(kit, 'mf')
    s.joue(balais, batterie('S2 : x . . . . . . . x . . . . . . .', pas=0.25, vel=58), remplir=True)
    s.nuance(balais, 'mp')
    nappe(s, BALANCEMENT, vel=56)


# --- A3 : les feux (LA NUIT variée, au vibraphone) -----------------------------------------------------
@theme.section('A3', mesures=8)
def A3(s):
    ep_comp(s, NAVETTE_2, vel=66, decal=3)
    s.nuance(ep, 'mp')
    s.joue(vibra, NUIT_B.coupe(0, 24), vel=80)
    s.nuance(vibra, 'mf')
    s.joue(ep_chant, NUIT_B.coupe(16, 32), a=s.m(5), vel=84)
    s.nuance(ep_chant, 'mf')
    basse_ligne(s, 'D2 - - - - - . A1 | C2 - - - - - . G1 | Bb1 - - - - - . F1 | G1 - - - D2 - . G1 | '
                   'D2 - - - - - . A1 | C2 - - - - - . G1 | Bb1 - - - F2 - . E2 | A1 - - - E2 - . A1')
    s.nuance(basse, 'mf')
    demi_temps(s, 1, 8, variante=2)
    relance(s, 8, vel=76)
    s.nuance(kit, 'mf')
    nappe(s, NAVETTE_2, vel=58)


# --- C : le long creux (sans batterie ; la trompette, le motif) ------------------------------------------
GRILLE_C = ['re m9', 're m9', 'sib maj7', 'sib maj7', 'sib maj7', 'sib maj7|do5', 're m sus4', 're m',
            'sol m9', 'sib maj7', 're m9', 'do add9', 'sol m9', 'sib maj7', 'do sus4', 'do']


@theme.section('C', mesures=16)
def C(s):
    silence = s.m(16, 4)
    # m. 1–4 : presque rien — le ré tenu à l'archet, l'accord du piano électrique, la nappe
    s.note(cb, 'D2', 0, s.m(9), vel=60)
    s.expression(cb, [(0, 'pp'), (s.m(5), 'p'), (s.m(9), 'pp')])
    for h in EP['re m9']:
        s.note(ep, h, 0.05, 7.9, vel=56)
    for m, ch in ((3, 'sib maj7'), (5, 'sib maj7'), (6, 'sib maj7'), (7, 're m sus4'), (8, 're m')):
        for h in EP[ch]:
            s.note(ep, h, s.m(m), 3.9, vel=54)
    for h in EP['do5']:
        s.note(ep, h, s.m(6, 3), 1.9, vel=54)
    s.nuance(ep, 'mp')
    nappe(s, ['re m9', 're m9', 'sib maj7', 'sib maj7', 'sib maj7', 'sib maj7', 're m9', 're m9'], vel=50,
          ondule=False)
    for p in (nappe_v, nappe_a, nappe_c):
        s.expression(p, [(0, 'ppp'), (s.m(4), 'pp'), (s.m(8), 'pp')])
    # m. 5–8 : LA TROMPETTE, le motif en augmentation (la mèche sur SIb maj7)
    s.joue(trompette, MOTIF_LENT, a=s.m(4, 3), vel=96)
    s.nuance(trompette, 'mf')
    # m. 9–16 : les violoncelles chantent, le piano électrique arpège, ça remonte
    s.joue(celles, mel('D3:3 F3:1 | A3:4 | G3:2 F3:1 E3:1 | F3:4 | Bb3:3 A3:1 | G3:2 D3:2 | E3:3 F3:1 | G3:3 r:1'),
           a=s.m(9), vel=84)
    s.expression(celles, [(s.m(9), 'mp'), (s.m(13), 'mf'), (s.m(16), 'f'), (silence, 'mf')])
    for i, ch in enumerate(GRILLE_C[8:]):
        notes = EP[ch]
        motif = arpege(notes, '1 2 3 4 3 2 4 3', pas=0.5, vel=58)
        s.joue(ep, motif, a=s.m(9 + i))
    s.expression(ep, [(s.m(9), 'p'), (s.m(16), 'mf')])
    nappe(s, GRILLE_C[8:], de=9, vel=56, ondule=False, jusqua=silence)
    for p in (nappe_v, nappe_a, nappe_c):
        s.expression(p, [(s.m(9), 'pp'), (s.m(16), 'mf'), (silence, 'mp')])
    basse_ligne(s, 'G1 - - - - - . D2 | Bb1 - - - - - . F2 | D2 - - - - - . A1 | C2 - - - - - . G1 | '
                   'G1 - - - D2 - . G1 | Bb1 - - - F2 - . F1 | C2 - - - G2 - C2 . | C2 - - - - - . .', de=9, vel=80)
    s.expression(basse, [(s.m(9), 'mp'), (s.m(16), 'mf')])
    s.note(suspendue, 'C4', silence - 4 * SEC, 4 * SEC, vel=84, art='monte_4s')
    # le temps de silence : l'arc ; les cors prennent leur élan (« fu-si »)
    arc.poser(s, silence, impact=False, vel=118)
    s.joue(cors, TETE_CORS.coupe(0, 1), a=silence, vel=96)
    s.nuance(cors, 'mf', silence)


# --- D : les néons s'allument ----------------------------------------------------------------------
GRILLE_D = ['sib maj7|do5', 're m9', 'sib maj7|do5', 're m9', 'sol m9', 'sib maj7', 'do sus4', 're m9']


@theme.section('D', mesures=8)
def D(s):
    # l'impact de l'arc ; les cors tiennent la mèche (sib) sur SIb – – DO5 | ré m
    s.note(arc.impact, 'D2', 0, 2, vel=110, art='impact')
    s.note(timbales, 'D2', 0, 1, vel=104)
    s.note(kit, 'C', 0, 2, vel=96)
    s.joue(cors, TETE_CORS.coupe(1, 4), a=0, vel=100)
    s.joue(cors, TETE_CORS, a=s.m(2, 4), vel=100)
    for m, voix in ((5, ['Bb3', 'D4']), (6, ['A3', 'D4']), (7, ['G3', 'C4']), (8, ['A3', 'D4'])):
        for h in voix:
            s.note(cors, h, s.m(m), 4, vel=78)
    s.expression(cors, [(0, 'f'), (s.m(4), 'mf'), (s.m(5), 'mp'), (s.m(7), 'mf'), (s.m(8, 4), 'mp')])
    # les violons chantent LA NUIT (sa seconde moitié, le sommet sur la5), à l'octave
    s.joue(violons, NUIT.coupe(16, 32), a=s.m(5), vel=86)
    s.joue(violons, NUIT.coupe(16, 32).octave(-1), a=s.m(5), vel=78)
    s.expression(violons, [(s.m(5), 'mf'), (s.m(6), 'f'), (s.m(8), 'mf'), (s.m(8, 4), 'mp')])
    # les m. 1–4 : le piano électrique et le vibraphone sur la cellule
    for i, ch in enumerate(GRILLE_D):
        parts = ch.split('|')
        for k, c in enumerate(parts):
            t = s.m(i + 1) + (3 if k == 1 else 0)
            d = (3 if (len(parts) == 2 and k == 0) else (1 if k == 1 else 4)) - 0.1
            for h in EP[c]:
                s.note(ep, h, t, d, vel=74)
    s.nuance(ep, 'mf')
    s.joue(vibra, mel('D5:.5 A5:.5 F5:.5 D5:.5 A4:1 r:1 | E5:.5 A5:.5 F5:.5 C5:.5 D5:2'), vel=70)
    s.joue(vibra, mel('D5:.5 A5:.5 F5:.5 D5:.5 A4:1 r:1 | E5:.5 A5:.5 F5:.5 C5:.5 D5:2'), a=s.m(3), vel=70)
    s.nuance(vibra, 'mp')
    # la nappe s'ouvre en grand (les cordes pleines, f) ; les violoncelles et la contrebasse
    for i, ch in enumerate(GRILLE_D):
        c = ch.split('|')[0]
        v, a, cc = NAPPE[c]
        for h in v:
            s.note(nappe_v, h, s.m(i + 1), 4, vel=66)
        for h in a:
            s.note(nappe_a, h, s.m(i + 1), 4, vel=66)
    for p in (nappe_v, nappe_a):
        s.expression(p, [(0, 'mp'), (s.m(4), 'mf'), (s.m(8), 'mp'), (s.m(8, 4), 'p')])
    basse_ligne(s, 'Bb1 - - - - . C2 . | D2 - - - A1 - . A1 | Bb1 - - - - . C2 . | D2 - - - A2 - F2 . | '
                   'G1 - - - D2 - . G1 | Bb1 - - - F2 - . F1 | C2 - - - G2 - C2 . | D2 - - - A1 - D2 .', vel=92)
    s.nuance(basse, 'f')
    # la batterie : caisse claire sur 3, le charleston en croches, une crash au premier temps
    s.joue(kit, batterie('K : X . . . . . . x . . x . . . . .\nS : . . . . . . . . X . . . . . . .\n'
                              'H : x . x . x . x . x . x . x . x .', pas=0.25, vel=86).remplir(s.m(8)))
    s.joue(kit, batterie('K : X . . . . . . . . . X . . . . .\nS : . . . . . . . . X . . . X x X X\n'
                              'H : x . x . x . x . . . . . . . . .', pas=0.25, vel=86), a=s.m(8))
    s.expression(kit, [(0, 'f'), (s.m(8), 'mf')])
    s.note(timbales, 'D2', s.m(5), 1, vel=92)
    s.note(suspendue, 'C4', s.m(8, 4) - 2 * SEC, 2 * SEC, vel=70, art='monte_2s')


# --- F2 : la fenêtre --------------------------------------------------------------------------------
@theme.section('F2', mesures=8, reprise=False)
def F2(s):
    for h in EP['sib maj7#11']:
        s.note(ep, h, 0, 8, vel=56)
    s.nuance(ep, 'mp')
    s.note(basse, 'Bb1', 0, 6, vel=66)
    s.nuance(basse, 'mp')
    s.note(vibra, 'E5', s.m(2, 3), 3, vel=50)
    s.note(vibra, 'D5', s.m(4, 2), 3, vel=48)
    s.note(vibra, 'A4', s.m(6), 4, vel=46)
    s.nuance(vibra, 'mp')
    for p, h in ((nappe_v, 'D5'), (nappe_a, 'A4')):
        s.note(p, h, 0, s.m(5), vel=44)
        s.expression(p, [(0, 'pp'), (s.m(5), 0.03)])
    ep_comp(s, ['do sus4', 'do'], de=7, vel=60, decal=1)
    basse_ligne(s, 'C2 - - - G2 - . G1 | C2 - - - - . E2 C2', de=7, vel=78)
    demi_temps(s, 7, 8, vel=72)
    relance(s, 8, vel=72)
    s.crescendo(kit, s.m(7), s.m(9), 'mp', 'mf')


# --- A4 : la dernière rue ------------------------------------------------------------------------------
@theme.section('A4', mesures=8)
def A4(s):
    ep_comp(s, NAVETTE, vel=66, decal=2)
    s.nuance(ep, 'mp')
    s.joue(ep_chant, NUIT.coupe(0, 16), vel=86)
    s.nuance(ep_chant, 'mf')
    basse_ligne(s, 'D2 - - - - - . A1 | C2 - - - - - . G1 | Bb1 - - - - - . F2 | C2 - - - G2 - C2 . | '
                   'D2 - - - - - . A1 | C2 - - - - - E2 . | Bb1 - - - - - . F1 | C2 - - - - . E2 C2')
    s.nuance(basse, 'mf')
    demi_temps(s, 1, 9, variante=3)
    s.nuance(kit, 'mf')
    nappe(s, NAVETTE, vel=58)
    for m, h in ((6, 'G5'), (8, 'E5')):
        s.note(vibra, h, s.m(m, 3), 2, vel=58)
    s.nuance(vibra, 'mp')


# --- B2 : le comptoir, plus tard (la relance) -------------------------------------------------------
@theme.section('B2', mesures=8)
def B2(s):
    ep_comp(s, BALANCEMENT, vel=68, decal=1)
    s.nuance(ep, 'mp')
    s.joue(clar, CLAR_2.coupe(0, 16), vel=84)
    s.nuance(clar, 'mf')
    for m, h in ((5, 'D5'), (6, 'F5'), (7, 'E5')):
        s.note(vibra, h, s.m(m, 2), 2, vel=60)
    s.nuance(vibra, 'mp')
    basse_ligne(s, 'D2 - - - - - . A1 | Bb1 - - - - - . F1 | D2 - - - - - . A1 | Bb1 - - - F2 - . A1 | '
                   'G1 - - - - - . D2 | Bb1 - - - - - . F2 | C2 - - - - - . G1 | C2 - - - G2 - C2 .')
    s.nuance(basse, 'mf')
    demi_temps(s, 1, 8, variante=2)
    relance(s, 8, vel=80)
    s.nuance(kit, 'mf')
    s.joue(balais, batterie('S2 : x . . . . . . . x . . . . . . .', pas=0.25, vel=56), jusqua=s.m(8))
    s.nuance(balais, 'mp')
    nappe(s, BALANCEMENT, vel=56)


theme.forme(intro=['intro'], corps=['A', 'A2', 'F1', 'B', 'A3', 'C', 'D', 'F2', 'A4', 'B2'])
