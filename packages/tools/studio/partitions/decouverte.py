"""FUSIBLE — « Les Quartiers » (`decouverte`) : un quartier qui s'ouvre, une pièce du dossier
trouvée, une page d'album finie (et le reste de la journée).

La curiosité : une harpe qui arpège en montant, des cloches, un cor qui chante ; chaque section
monte d'un cran, trois vagues par boucle (la troisième jusqu'au sommet de l'orchestre), et
entre elles la harpe seule.

108 à la noire, 4/4 ; fa lydien (sans altération : la lumière ; le SI naturel, la ♯4, est la
couleur) ; les médiantes chromatiques pour l'émerveillement (FA – RÉb, FA – LA) ; fa dorien
(fa m – SIb) quand la découverte inquiète. Mesure 2,222 s.

LE MOTIF (partitions/_fusible.py, en fa lydien : l'habit « merveilleux », la 6 et la ♯4) :
- la tête « fa do | RÉ » : au célesta (introduction, A), aux cloches transposée sur les
  médiantes (RÉb, LA : D), renversée aux bassons quand le quartier inquiète (E), à la harpe en
  valeurs longues (fenêtre F3) ;
- la réponse (elle finit sur la quinte, ouverte) au cor, sur I – II – I (C) ;
- le motif de deux mesures, au cor, plus haut (C2) : la mèche RÉ sur II, « la sol » , puis
  « SI fa » : la ♯4 qui tombe sur la tonique ;
- la montée (fa do | RÉ – MI – | FA) aux cors et aux trompettes au sommet, sur II – III | I ;
- jamais la phrase entière (motif et réponse à la suite).
L'ARC : au premier temps de l'introduction (doux) ; dans la boucle une fois : le temps de
silence qui finit la montée G, avant le sommet.

LA QUESTION, le thème des Quartiers (8 mesures) : une ligne qui monte, demande, et s'arrête
ouverte sur SOL (le II) ; le SI tenu sur SOL/fa est la merveille. Aux bois (B), au hautbois (A2).

LA CARTE (la boucle : 112 mesures, 248,9 s ; l'introduction : 4 mesures, 8,9 s)
  intro   4 m.  0:00  l'arc (doux), un glissando de harpe, la tête au célesta, une cloche  2→3
  A       8 m.  0:00  la porte : la harpe arpège (I – II), le célesta, les pizz. graves      3
  B       8 m.  0:18  la rue : les pizz. arpègent, la flûte et la clarinette : LA QUESTION   4
  C       8 m.  0:36  le cor : la réponse ; les cordes tiennent, les arpèges montent        5→6
  F1      8 m.  0:53  FENÊTRE : la harpe seule                                              1
  A2      8 m.  1:11  l'autre rive : la harpe et le célesta, le hautbois : LA QUESTION      4
  D       8 m.  1:29  les cloches : FA – RÉb – FA – LA, la tête sur chaque médiante          6
  E       8 m.  1:47  l'inquiétude : fa m – SIb, les bassons (la tête renversée) ; RÉb MIb FA 5
  C2      8 m.  2:04  le cor, plus haut : le motif ; les violons arpègent en montant         6→7
  F2      8 m.  2:22  FENÊTRE : la harpe seule                                              1
  G       8 m.  2:40  la montée : cordes graves 3+3+2, arpèges, RÉb MIb ; le silence, L'ARC  7→8
  S      16 m.  2:58  le sommet : la montée aux cors et aux trompettes, tout l'orchestre      9
  H       8 m.  3:33  la descente : l'orchestre s'éclaircit, le cor une dernière fois        6→3
  F3      8 m.  3:51  FENÊTRE : la harpe seule, la tête en valeurs longues ; la relance       1
Fenêtres (reprise=False) toutes les 1 à 2 minutes : 0:53, 2:22, 3:51.
"""
from moteur.ecriture import *
from partitions._fusible import phrase, Arc

theme = Theme('decouverte', 'Les Quartiers', bpm=108, mesure='4/4', tonalite='fa lydien', graine=1974,
              ville=True, moment='un quartier qui s\'ouvre, une pièce du dossier, une page d\'album',
              humeur='la curiosité : une montée claire, sans être naïve')
TON = 'fa lydien'
SEC = 108 / 60.0      # les temps d'une seconde

# --- les pistes (les volumes sont provisoires : le studio recalibre ses niveaux) ---------
harpe = theme.piste('harpe', volume=-1.3, pan=-0.25, largeur=1.0)
celesta = theme.piste('celesta', volume=1, echo=0.15)
cloches = theme.piste('cloches', volume=1)
glock = theme.piste('glock', 'glockenspiel', volume=-9)
vln_pz = theme.piste('vln_pz', 'violons', art='pizzicato', volume=-7)
alt_pz = theme.piste('alt_pz', 'altos', art='pizzicato', volume=-5)
vc_pz = theme.piste('vc_pz', 'violoncelles', art='pizzicato', pan=0.12, volume=-2)
violons = theme.piste('violons', volume=-2)
violons2 = theme.piste('violons2', 'violons', pan=-0.2, volume=-6)
altos = theme.piste('altos', volume=-4)
celles = theme.piste('celles', 'violoncelles', pan=0.12, volume=-2)
cb = theme.piste('cb', 'contrebasses', pan=0.05, volume=-4)
flute = theme.piste('flute', 'flutes', unisson=1, volume=-2.5)
hautbois = theme.piste('hautbois', volume=-3.2)
clar = theme.piste('clar', 'clarinettes', unisson=1, volume=-3.6)
bassons = theme.piste('bassons', volume=0)
cor = theme.piste('cor', 'cors', volume=-3)
cors = theme.piste('cors_pad', 'cors', volume=-11)
trompettes = theme.piste('trompettes', volume=-5)
trombones = theme.piste('trombones', volume=-4)
tuba = theme.piste('tuba', pan=0.1, volume=-10)
timbales = theme.piste('timbales', volume=-3)
timb_roul = theme.piste('timb_roul', 'timbales', art='roulement', volume=-1)
cymbales = theme.piste('cymbales', volume=-7)
suspendue = theme.piste('suspendue', 'cymbale_suspendue', volume=-9)
carillon = theme.piste('carillon', volume=-6)
triangle = theme.piste('triangle', 'batterie', volume=-10, pan=0.3, salle=0.3)
arc = Arc(theme, volume=-5, impact_volume=-7)

theme.salle('echo', temps=0.75, retour=0.3)

# --- l'harmonie --------------------------------------------------------------------------------
# l'arpège de la harpe qui monte (huit croches, de la basse vers l'aigu)
HARPE = {
    'fa': ['F2', 'C3', 'F3', 'A3', 'C4', 'E4', 'A4', 'C5'],
    'sol/fa': ['F2', 'D3', 'G3', 'B3', 'D4', 'G4', 'B4', 'D5'],
    'la m7': ['A2', 'E3', 'G3', 'C4', 'E4', 'G4', 'C5', 'E5'],
    'sol/si': ['B2', 'D3', 'G3', 'B3', 'D4', 'G4', 'B4', 'D5'],
    'sol': ['G2', 'D3', 'G3', 'B3', 'D4', 'G4', 'B4', 'D5'],
    're m7': ['D3', 'A3', 'C4', 'F4', 'A4', 'C5', 'F5', 'A5'],
    'reb': ['Db3', 'Ab3', 'Db4', 'F4', 'Ab4', 'C5', 'F5', 'Ab5'],
    'la': ['A2', 'E3', 'A3', 'C#4', 'E4', 'A4', 'C#5', 'E5'],
    'fa m9': ['F2', 'C3', 'Ab3', 'C4', 'Eb4', 'G4', 'Ab4', 'C5'],
    'sib': ['Bb2', 'F3', 'Bb3', 'D4', 'F4', 'Bb4', 'D5', 'F5'],
    'mib': ['Eb3', 'Bb3', 'Eb4', 'G4', 'Bb4', 'Eb5', 'G5', 'Bb5'],
    'sib maj7': ['Bb2', 'F3', 'A3', 'D4', 'F4', 'A4', 'D5', 'F5'],
    'do sus4': ['C3', 'G3', 'C4', 'F4', 'G4', 'C5', 'F5', 'G5'],
}
# la tenue des cordes : (violons, altos, violoncelles)
TENUE = {
    'fa': (['A4', 'F5'], ['C4'], ['F2']), 'sol/fa': (['B4', 'D5'], ['G3'], ['F2']),
    'la m7': (['E5', 'G5'], ['C4'], ['A2']), 'sol/si': (['B4', 'D5'], ['G3'], ['B2']),
    'sol': (['B4', 'D5'], ['G3'], ['G2']), 're m7': (['A4', 'C5'], ['F3'], ['D3']),
    'reb': (['Ab4', 'F5'], ['Db4'], ['Db3']), 'la': (['C#5', 'E5'], ['A3'], ['A2']),
    'fa m9': (['Ab4', 'G5'], ['C4'], ['F2']), 'sib': (['Bb4', 'D5'], ['F3'], ['Bb2']),
    'mib': (['G4', 'Bb4'], ['Eb4'], ['Eb3']), 'sib maj7': (['A4', 'D5'], ['F3'], ['Bb2']),
    'do sus4': (['G4', 'C5'], ['F3'], ['C3']),
}
BASSE = {'fa': 'F2', 'sol/fa': 'F2', 'la m7': 'A2', 'sol/si': 'B2', 'sol': 'G2', 're m7': 'D3', 'reb': 'Db3',
         'la': 'A2', 'fa m9': 'F2', 'sib': 'Bb2', 'mib': 'Eb3', 'sib maj7': 'Bb2', 'do sus4': 'C3'}

BALANCE = ['fa', 'sol/fa'] * 4
GRILLE_A2 = ['fa', 'sol/fa', 'la m7', 'sol/si', 'fa', 'sol/fa', 're m7', 'sol']
GRILLE_B = ['fa', 'sol/fa', 'la m7', 'sol', 'fa', 'sol/fa', 're m7', 'sol']
GRILLE_C = ['fa', 'sol/fa', 'fa', 'sol/fa', 'fa', 'sol/fa', 'la m7', 'sol/si']
GRILLE_D = ['fa', 'reb', 'fa', 'la', 'fa', 'reb', 'la m7', 'sol/fa']
GRILLE_E = ['fa m9', 'sib', 'fa m9', 'sib', 'reb', 'sib', 'reb', 'mib']
GRILLE_G = ['fa', 'sol/fa', 'fa', 'sol/fa', 'reb', 'mib', 'reb', 'mib']
GRILLE_H = ['fa', 'sol/fa', 'fa', 'sol/fa', 're m7', 'la m7', 'sib maj7', 'do sus4']

# les figures de l'arpège (rangs 1..8 dans l'accord), jamais deux mesures pareilles de suite
FIGS = ['1 2 3 4 5 6 7 8', '1 3 2 4 3 5 6 8', '1 2 4 3 5 7 6 8', '1 3 4 5 6 5 7 8']


def montant(ch, n=8, de=3, plafond='C7'):
    """n hauteurs qui montent dans l'accord, à partir de son rang `de` (puis ses octaves)."""
    base = [hauteur(x) for x in HARPE[ch][de:]]
    lst = list(base)
    k = 0
    while len(lst) < n:
        c = base[k % len(base)] + 12 * (1 + k // len(base))
        if c > lst[-1]:
            lst.append(c)
        k += 1
    return [h for h in lst if h <= hauteur(plafond)]


def harpe_arpege(s, grille, de=1, vel=72, decal=0, piste=None, figs=FIGS):
    """L'arpège qui monte ; ses deux notes graves plus douces (une harpiste allège la basse
    dans un arpège léger : la calibration rend le grave de la harpe aussi fort que l'aigu)."""
    p = piste or harpe
    for i, ch in enumerate(grille):
        fig = figs[(i + decal) % len(figs)]
        graves = sorted(hauteur(x) for x in HARPE[ch])[:2]
        m = arpege(HARPE[ch], fig, pas=0.5, vel=vel, duree=1.5)
        m = m.vel(lambda n, k: vel - 16 if n.h == graves[0] else (vel - 8 if n.h == graves[1] else vel))
        s.joue(p, m, a=s.m(de + i))


def premier_temps(s, ch, cloche=None, vel=94, timbale=None):
    """Le premier temps marqué (le jeu peut reprendre le thème à cette section) : la
    fondamentale de l'accord à la harpe et aux violoncelles pizz., une frappe claire (une
    cloche, le triangle), une timbale s'il le faut."""
    r = BASSE[ch]
    s.note(harpe, r, 0, 2, vel=vel)
    s.note(vc_pz, r, 0, 1, vel=vel)
    s.note(triangle, 'TR', 0, 2, vel=vel - 22)
    if cloche:
        s.note(cloches, cloche, 0, 4, vel=vel - 8)
    if timbale:
        s.note(timbales, timbale, 0, 1, vel=vel - 6)


def pizz_graves(s, grille, de=1, vel=76, piste=None):
    """Les violoncelles pizz. : la fondamentale au premier temps, la quinte au troisième."""
    p = piste or vc_pz
    for i, ch in enumerate(grille):
        r = BASSE[ch]
        s.note(p, r, s.m(de + i), 1, vel=vel)
        s.note(p, HARPE[ch][1], s.m(de + i, 3), 1, vel=vel - 12)


def tenue(s, grille, de=1, vel=62, jusqua=None, pistes=None):
    pv, pa, pc = pistes or (violons2, altos, celles)
    for i, ch in enumerate(grille):
        v, a, c = TENUE[ch]
        d0 = s.m(de + i)
        d1 = s.m(de + i + 1) if jusqua is None else min(s.m(de + i + 1), jusqua)
        for p, hs in ((pv, v), (pa, a), (pc, c)):
            for h in hs:
                s.note(p, h, d0, d1 - d0, vel=vel)


def glissando(s, piste, a, de='C4', vers='C6', duree=0.5, vel=64, gamme=TON, sonne=1.5):
    """Un glissando de harpe écrit : la gamme, note à note, en `duree` temps (chaque note
    sonne `sonne` temps)."""
    ton = Tonalite(gamme)
    h = hauteur(de)
    notes = []
    while h <= hauteur(vers):
        notes.append(h)
        h = ton.pas_diatonique(h, 1)
    pas = duree / max(1, len(notes))
    for k, x in enumerate(notes):
        s.note(piste, x, a + k * pas, sonne, vel=vel)


# --- le matériau mélodique -----------------------------------------------------------------------
TETE_CEL = phrase('tete', TON, octave=5)                     # fa5 do6 | ré6 ──
TETE_CLOCHE = phrase('tete', TON, octave=4)                  # fa4 do5 | ré5 ──
REPONSE_COR = phrase('reponse', TON, octave=3)               # fa3 do4 | ré4 ── mi4 fa4 | do4 ──
MOTIF_COR = phrase('motif', TON, octave=4)                   # fa4 do5 | ré5 ── la4 sol4 | si4 fa4
MONTEE = phrase('montee', TON, octave=4)                     # fa4 do5 | ré5 — mi5 — | fa5 ────
MONTEE_GRAVE = phrase('montee', TON, octave=3)
TETE_RENVERSEE = phrase('tete', 'fa dorien', octave=3).inverse('F3')   # fa3 sib2 | la2 : la menace
QUESTION = mel('r:.5 A4:.5 C5:.5 E5:1.5 D5:1 | B4:2 A4:.5 G4:.5 A4:1 | r:.5 C5:.5 E5:.5 G5:1.5 E5:1 | '
               'D5:2 B4:1 A4:1 | C5:1.5 A4:.5 F4:1 G4:1 | A4:2 B4:1 C5:1 | D5:1.5 C5:.5 A4:1 F4:1 | G4:4')


# --- l'introduction ----------------------------------------------------------------------------
@theme.section('intro', mesures=4)
def intro(s):
    arc.poser(s, 0, impact=False, vel=110)
    # l'étincelle d'abord ; la harpe, la cloche et le triangle juste après
    glissando(s, harpe, 0.35, 'F3', 'F5', duree=0.9, vel=66)
    s.note(cloches, 'F4', 0.35, 4, vel=70)
    s.note(triangle, 'TR', 0.35, 2, vel=60)
    s.joue(celesta, TETE_CEL, a=s.m(1, 4), vel=82)
    s.nuance(celesta, 'mf')
    tenue(s, ['fa', 'sol/fa', 'fa', 'sol/fa'], vel=54)
    for p in (violons2, altos, celles):
        s.expression(p, [(0, 'pp'), (s.m(3), 'p'), (s.m(4, 4), 'pp')])
    harpe_arpege(s, ['fa', 'sol/fa'], de=3, vel=66)
    s.crescendo(harpe, s.m(3), s.m(5), 'mp', 'mf')
    s.note(vc_pz, 'F2', s.m(3), 1, vel=70)
    s.note(vc_pz, 'F2', s.m(4), 1, vel=70)
    s.nuance(vc_pz, 'mp')


# --- A : la porte ---------------------------------------------------------------------------------
@theme.section('A', mesures=8)
def A(s):
    premier_temps(s, 'fa', cloche='F4', vel=90)
    s.nuance(cloches, 'mp')
    harpe_arpege(s, BALANCE, vel=74)
    s.nuance(harpe, 'mf')
    pizz_graves(s, BALANCE)
    s.nuance(vc_pz, 'mp')
    s.joue(celesta, TETE_CEL, a=s.m(1, 4), vel=80)
    s.joue(celesta, TETE_CEL.octave(-1), a=s.m(5, 4), vel=76)
    s.nuance(celesta, 'mf')
    # le carillon à tiges, une poussière, à la fin
    s.note(carillon, 'C4', s.m(8, 3), 2, vel=60, art='monte')


# --- B : la rue nouvelle (LA QUESTION aux bois) ----------------------------------------------------
@theme.section('B', mesures=8)
def B(s):
    premier_temps(s, 'fa', cloche='C5', vel=90)
    harpe_arpege(s, GRILLE_B, vel=70, decal=1)
    s.nuance(harpe, 'mp')
    pizz_graves(s, GRILLE_B)
    s.nuance(vc_pz, 'mp')
    # les violons et altos pizz. sur les contretemps (des points de lumière)
    for i, ch in enumerate(GRILLE_B):
        v, a, _ = TENUE[ch]
        for t in (1.5, 3.5):
            s.note(vln_pz, v[i % 2], s.m(i + 1) + t, 0.5, vel=64)
        s.note(alt_pz, a[0], s.m(i + 1, 2), 0.5, vel=62)
    s.nuance(vln_pz, 'mp')
    s.nuance(alt_pz, 'mp')
    s.joue(flute, QUESTION, vel=84)
    s.joue(clar, QUESTION.diatonique(-2, TON), vel=74)
    s.nuance(flute, 'mf')
    s.nuance(clar, 'mp')


# --- C : le cor (la réponse) ---------------------------------------------------------------------
@theme.section('C', mesures=8)
def C(s):
    premier_temps(s, 'fa', cloche='C5', vel=92)
    harpe_arpege(s, GRILLE_C, vel=70, decal=2)
    s.nuance(harpe, 'mp')
    pizz_graves(s, GRILLE_C)
    s.nuance(vc_pz, 'mp')
    tenue(s, GRILLE_C, vel=64, pistes=(violons2, altos, celles))
    for p in (violons2, altos, celles):
        s.expression(p, [(0, 'p'), (s.m(4), 'mp'), (s.m(8), 'mf')])
    # le cor chante la réponse (elle finit sur la quinte, ouverte), deux fois
    s.joue(cor, REPONSE_COR, a=s.m(1, 4), vel=92)
    s.joue(cor, REPONSE_COR.octave(1).coupe(0, 4), a=s.m(5, 4), vel=88)
    s.joue(cor, mel('C5:1.5 B4:.5 A4:1 G4:1 | A4:4'), a=s.m(7), vel=86)
    s.expression(cor, [(0, 'mf'), (s.m(6), 'f'), (s.m(8, 4), 'mf')])
    # les violons : des arpèges qui montent dans la seconde moitié
    for i, ch in enumerate(GRILLE_C[4:]):
        s.joue(violons, arpege(HARPE[ch][3:], '1 2 3 4 5 4 5 .', pas=0.5, vel=70, art='staccato'),
               a=s.m(5 + i))
    s.crescendo(violons, s.m(5), s.m(9), 'p', 'mf')
    s.note(carillon, 'C4', s.m(8, 3), 2, vel=62, art='monte')


# --- F1 : la harpe seule (fenêtre) ---------------------------------------------------------------
@theme.section('F1', mesures=8, reprise=False)
def F1(s):
    notes = [(1, 1, 'F3'), (1, 2, 'C4'), (1, 3, 'A4'), (2, 3, 'B4'), (3, 1, 'F3'), (3, 3, 'E5'),
             (5, 1, 'D4'), (5, 2.5, 'G4'), (6, 2, 'B4')]
    for m, t, h in notes:
        s.note(harpe, h, s.m(m, t), 3, vel=56)
    s.nuance(harpe, 'mp')
    # m. 7–8 : la harpe reprend son arpège, doucement
    harpe_arpege(s, ['fa', 'sol/fa'], de=7, vel=62, decal=3)
    s.note(vc_pz, 'F2', s.m(8), 1, vel=62)


# --- A2 : l'autre rive (le hautbois : LA QUESTION) -------------------------------------------------
@theme.section('A2', mesures=8)
def A2(s):
    premier_temps(s, 'fa', cloche='A4', vel=92)
    harpe_arpege(s, GRILLE_A2, vel=72, decal=1)
    s.nuance(harpe, 'mf')
    pizz_graves(s, GRILLE_A2)
    s.nuance(vc_pz, 'mp')
    for i, ch in enumerate(GRILLE_A2):
        h = HARPE[ch][6]
        s.note(celesta, h, s.m(i + 1, 2.5), 1, vel=62)
        s.note(celesta, HARPE[ch][7], s.m(i + 1, 4), 1, vel=58)
    s.nuance(celesta, 'mp')
    s.joue(hautbois, QUESTION.coupe(0, 16), vel=84)
    s.nuance(hautbois, 'mf')
    s.joue(flute, QUESTION.coupe(16, 32), a=s.m(5), vel=76)
    s.nuance(flute, 'mp')


# --- D : les cloches (les médiantes chromatiques) ----------------------------------------------------
@theme.section('D', mesures=8)
def D(s):
    premier_temps(s, 'fa', vel=96, timbale='F2')
    harpe_arpege(s, GRILLE_D, vel=74, decal=2)
    s.nuance(harpe, 'mf')
    pizz_graves(s, GRILLE_D)
    s.nuance(vc_pz, 'mf')
    tenue(s, GRILLE_D, vel=70)
    for p in (violons2, altos, celles):
        s.expression(p, [(0, 'mp'), (s.m(4), 'mf'), (s.m(8), 'mf')])
    # la tête aux cloches, sur chaque accord : fa (I), réb (♭VI), fa, la (III) — déplacée
    # au premier temps (l'anacrouse dans la mesure de l'accord)
    for m, h in ((1, 'F4'), (3, 'C5'), (5, 'F4')):
        s.note(cloches, h, s.m(m), 4, vel=78)
    for m in (2, 4, 6):
        s.note(triangle, 'TR', s.m(m), 2, vel=60)
    for m in (2, 6):
        s.joue(cloches, TETE_CLOCHE.transpose(-4), a=s.m(m), vel=84)
    s.nuance(cloches, 'mf')
    s.joue(celesta, TETE_CEL.transpose(4), a=s.m(4), vel=96)
    # un glissando de harpe à chaque médiante ; le célesta qui répond ; les cors tiennent
    for m in (2, 6):
        glissando(s, celesta, s.m(m, 2.5), 'Db5', 'Db6', duree=1.0, vel=58, gamme='Db', sonne=0.6)
    s.nuance(celesta, 'mp')
    for i, ch in enumerate(GRILLE_D):
        v, a, c = TENUE[ch]
        for h in a + [c[0][:-1] + '3']:
            s.note(cors, h, s.m(i + 1), 4, vel=64)
    s.nuance(cors, 'mp')
    s.joue(flute, mel('C6:2 A5:1 E5:1 | D5:4'), a=s.m(7), vel=76)
    s.nuance(flute, 'mp')
    for m in (2, 4, 6):
        s.note(timb_roul, BASSE[GRILLE_D[m - 1]].replace('3', '2'), s.m(m), 4, vel=60)
    s.expression(timb_roul, [(0, 'pp'), (s.m(8), 'p')])
    s.note(suspendue, 'C4', s.m(8, 4) - 2 * SEC, 2 * SEC, vel=70, art='monte_2s')


# --- E : l'inquiétude (fa dorien : fa m – SIb ; RÉb MIb FA) --------------------------------------------
@theme.section('E', mesures=8)
def E(s):
    premier_temps(s, 'fa m9', vel=96)
    # la harpe dans le grave, une figure obstinée
    for i, ch in enumerate(GRILLE_E):
        s.joue(harpe, arpege(HARPE[ch][:5], '1 3 2 4 3 5 4 3', pas=0.5, vel=70, duree=1.0), a=s.m(i + 1))
    s.nuance(harpe, 'mp')
    # les violoncelles et contrebasses à l'archet, les altos qui tiennent
    for i, ch in enumerate(GRILLE_E):
        v, a, c = TENUE[ch]
        s.note(celles, c[0], s.m(i + 1), 4, vel=72)
        s.note(cb, c[0].replace('3', '2'), s.m(i + 1), 4, vel=66)
        for h in a:
            s.note(altos, h, s.m(i + 1), 4, vel=64)
    for p in (celles, cb, altos):
        s.expression(p, [(0, 'mp'), (s.m(5), 'mf'), (s.m(8), 'f'), (s.m(8, 4), 'mf')])
    # les bassons : la tête renversée (la menace) ; les clarinettes répondent
    s.joue(bassons, TETE_RENVERSEE, a=s.m(1, 4), vel=88)
    s.joue(bassons, TETE_RENVERSEE, a=s.m(3, 4), vel=90)
    s.nuance(bassons, 'mf')
    s.joue(clar, mel('Ab4:2 G4:1 F4:1 | D4:4 | Ab4:2 Bb4:1 C5:1 | Db5:4'), a=s.m(2), vel=78)
    s.nuance(clar, 'mp')
    # la sortie : RÉb – MIb – FA (♭VI ♭VII I), les cors s'éclairent
    for m, voix in ((5, ['Ab3', 'Db4']), (6, ['Bb3', 'D4']), (7, ['Ab3', 'F4']), (8, ['Bb3', 'G4'])):
        for h in voix:
            s.note(cors, h, s.m(m), 4, vel=70)
    s.crescendo(cors, s.m(5), s.m(9), 'mp', 'mf')
    s.note(timbales, 'F2', 0, 1, vel=80)
    s.note(timb_roul, 'Eb2', s.m(8), 4, vel=70)
    s.crescendo(timb_roul, s.m(8), s.m(9), 'p', 'mf')


# --- C2 : le cor, plus haut (le motif) -----------------------------------------------------------------
@theme.section('C2', mesures=8)
def C2(s):
    premier_temps(s, 'fa', cloche='F4', vel=98)
    s.note(cymbales, 'C4', 0, 2, vel=64)
    harpe_arpege(s, GRILLE_C, vel=72, decal=3)
    s.nuance(harpe, 'mf')
    pizz_graves(s, GRILLE_C, vel=80)
    s.nuance(vc_pz, 'mf')
    tenue(s, GRILLE_C, vel=68)
    for p in (violons2, altos, celles):
        s.expression(p, [(0, 'mp'), (s.m(5), 'mf'), (s.m(8, 4), 'mf')])
    # le cor : le motif (la ♯4 qui tombe sur la tonique), puis la tête plus haut encore
    s.joue(cor, MOTIF_COR, a=s.m(1, 4), vel=96)
    s.joue(cor, phrase('tete', TON, octave=4), a=s.m(5, 4), vel=94)
    s.joue(cor, mel('E5:2 D5:1 B4:1 | D5:4'), a=s.m(7), vel=90)
    s.expression(cor, [(0, 'mf'), (s.m(2), 'f'), (s.m(8, 4), 'mf')])
    # les violons arpègent en montant (deux mesures sur trois)
    for i, ch in enumerate(GRILLE_C):
        if i % 3 == 2:
            continue
        s.joue(violons, arpege(montant(ch, 6), '1 2 3 4 5 6 5 6', pas=0.5, vel=72, art='staccato'), a=s.m(1 + i))
    s.expression(violons, [(0, 'mp'), (s.m(8), 'mf')])
    s.note(carillon, 'C4', s.m(8, 3), 2, vel=64, art='monte')


# --- F2 : la harpe seule (fenêtre) -------------------------------------------------------------------
@theme.section('F2', mesures=8, reprise=False)
def F2(s):
    notes = [(1, 1, 'A3'), (1, 2.5, 'E4'), (2, 2, 'D4'), (2, 3, 'B4'), (3, 2, 'C5'), (4, 1, 'G4'),
             (5, 1, 'F3'), (5, 3, 'A4'), (6, 2, 'G4')]
    for m, t, h in notes:
        s.note(harpe, h, s.m(m, t), 3, vel=56)
    s.nuance(harpe, 'mp')
    s.note(cloches, 'C5', s.m(3), 4, vel=48)
    s.nuance(cloches, 'p')
    harpe_arpege(s, ['fa', 'sol/fa'], de=7, vel=64, decal=1)
    s.note(vc_pz, 'F2', s.m(8), 1, vel=64)


# --- G : la montée -----------------------------------------------------------------------------
@theme.section('G', mesures=8)
def G(s):
    silence = s.m(8, 4)
    premier_temps(s, 'fa', vel=100, timbale='F2')
    # les cordes graves : doubles croches 3+3+2 (le moteur du thème principal)
    figs = ['X x x X x x X x X x x X x x X x', 'X x x X x x X x X x x X x X x x', 'X x X x x X x x X x x X x x X x']
    for i, ch in enumerate(GRILLE_G):
        r = BASSE[ch]
        rg = r.replace('3', '2') if r.endswith('3') else r
        fin = 4 if i < 7 else 3
        s.joue(celles, ostinato([r if r.endswith('3') else r.replace('2', '3')], pas=0.25, longueur=fin, vel=82,
                                accents=figs[i % 3], art='staccato'), a=s.m(1 + i))
        s.joue(cb, ostinato([rg], pas=0.25, longueur=fin, vel=78, accents=figs[i % 3], art='staccato'),
               a=s.m(1 + i))
    for p in (celles, cb):
        s.expression(p, [(0, 'mp'), (silence, 'f')])
    # les violons : des arpèges en croches qui montent, toujours plus haut
    for i, ch in enumerate(GRILLE_G):
        notes = montant(ch, 8, de=3 if i < 4 else 4)
        s.joue(violons, arpege(notes, '1 2 3 4 5 6 7 8', pas=0.5, vel=74, art='staccato'), a=s.m(1 + i),
               jusqua=min(s.m(2 + i), silence))
    s.expression(violons, [(0, 'mp'), (silence, 'f')])
    for i, ch in enumerate(GRILLE_G):
        v, a, _ = TENUE[ch]
        d0, d1 = s.m(1 + i), min(s.m(2 + i), silence)
        for h in v:
            s.note(violons2, h, d0, d1 - d0, vel=70)
        for h in a:
            s.note(altos, h, d0, d1 - d0, vel=70)
    for p in (violons2, altos):
        s.expression(p, [(0, 'p'), (silence, 'f')])
    harpe_arpege(s, GRILLE_G[:6], vel=72)
    s.nuance(harpe, 'mf')
    # les trompettes appellent la tête (m. 1, 3, 5)
    for m, v, dt in ((1, 84, 0), (3, 90, 0), (5, 96, -4)):
        s.joue(trompettes, phrase('tete', TON, octave=4).transpose(dt), a=s.m(m, 4), vel=v)
    s.expression(trompettes, [(0, 'mp'), (silence, 'f')])
    # la montée : RÉb – MIb (m. 5–8) ; les timbales roulent, la cymbale monte ; le silence
    for m, voix in ((5, ['Ab3', 'Db4']), (6, ['Bb3', 'Eb4']), (7, ['Ab3', 'F4']), (8, ['Bb3', 'G4'])):
        for h in voix:
            s.note(cors, h, s.m(m), 4 if m < 8 else 3, vel=74)
    s.crescendo(cors, s.m(5), silence, 'mp', 'f')
    s.note(timb_roul, 'Eb2', s.m(7), 7, vel=86)
    s.crescendo(timb_roul, s.m(7), silence, 'p', 'f')
    s.note(suspendue, 'C4', silence - 4 * SEC, 4 * SEC, vel=92, art='monte_4s')
    arc.poser(s, silence, impact=False, vel=120)
    s.joue(cor, MONTEE.coupe(0, 1), a=silence, vel=104)
    s.joue(trompettes, MONTEE.coupe(0, 1), a=silence, vel=100)
    s.nuance(cor, 'f', silence)


# --- S : le sommet ---------------------------------------------------------------------------------
# la montée arrive deux fois : RÉ – MI sur SOL – LA (II – III), FA sur FA (I), m. 1–2 et 13–14
GRILLE_S = ['sol|la', 'fa', 'sol/fa', 'fa', 'sol/fa', 'fa', 'la m7', 'fa',
            'sol/fa', 'fa', 'sol/fa', 'fa', 'sol|la', 'fa', 'sol/fa', 'fa']
FIGS_GRAVES = ['X x x X x x X x X x x X x x X x', 'X x x X x x X x X x x X x X x x',
               'X x X x x X x x X x x X x x X x']


@theme.section('S', mesures=16)
def S(s):
    # l'impact au premier temps (l'élan, « fu-si », était dans le silence de G)
    s.note(arc.impact, 'F1', 0, 2, vel=116, art='impact')
    s.note(timbales, 'G2', 0, 1, vel=112)
    s.note(cymbales, 'C4', 0, 2, vel=100)
    # la montée : RÉ – MI | FA ; la seconde fois (m. 12 t. 4 → 14) avec les trombones
    corps_montee = MONTEE.coupe(1, 9)                      # ré5 (2) mi5 (2) | fa5 (4)
    s.joue(cor, corps_montee, a=0, vel=112)
    s.joue(trompettes, corps_montee, a=0, vel=106)
    s.joue(cor, MONTEE, a=s.m(12, 4), vel=116)
    s.joue(trompettes, MONTEE, a=s.m(12, 4), vel=112)
    s.joue(trombones, MONTEE_GRAVE, a=s.m(12, 4), vel=106)
    for p in (cor, trompettes, trombones):
        s.expression(p, [(0, 'f'), (s.m(4), 'mf'), (s.m(12, 4), 'f'), (s.m(14), 'ff'), (s.m(16), 'f'),
                         (s.m(16, 4), 'mf')])
    # les deux arrivées sur FA (m. 2 et 14) : cymbales, timbales, cloches, glissandos
    for m in (2, 6, 10, 14):
        s.note(triangle, 'TR', s.m(m), 2, vel=72)
    for m in (2, 14):
        s.note(cymbales, 'C4', s.m(m), 2, vel=112)
        s.note(timbales, 'F2', s.m(m), 1, vel=118)
        s.note(cloches, 'F4', s.m(m), 4, vel=100)
    # les trombones répondent par la tête (sur SOL/fa, m. 3 et 5)
    for m in (3, 5):
        s.joue(trombones, phrase('tete', TON, octave=3), a=s.m(m - 1, 4), vel=98)
    # les trompettes : un contrechant de fanfare (m. 5–8), quand les cors se taisent
    s.joue(trompettes, mel('r:1 B4:.5 D5:.5 G5:1.5 D5:.5 | C5:2 A4:1 r:1 | r:1 C5:.5 E5:.5 A5:1.5 G5:.5 | '
                           'D5:2 B4:1 r:1'), a=s.m(5), vel=98)
    # la réponse au milieu (m. 8 t. 4 → 11) : les violons à l'octave, la mèche sur SOL/fa
    s.joue(violons, REPONSE_COR.octave(2), a=s.m(8, 4), vel=96)
    s.joue(violons, REPONSE_COR.octave(1), a=s.m(8, 4), vel=90)
    s.expression(violons, [(0, 'mf'), (s.m(9), 'f'), (s.m(12), 'mf')])
    # tout l'orchestre tient l'harmonie (trémolo des seconds violons, altos, tuba, cors)
    for i, ch in enumerate(GRILLE_S):
        parts = ch.split('|')
        for k, c in enumerate(parts):
            t = s.m(i + 1) + 2 * k
            d = 4 / len(parts)
            v, a, cc = TENUE[c]
            for h in v:
                s.note(violons2, h, t, d, vel=84, art='tremolo')
            for h in a:
                s.note(altos, h, t, d, vel=82)
            s.note(tuba, BASSE[c].replace('3', '2'), t, d, vel=92)
            s.note(cors, a[0], t, d, vel=80)
            # les cordes graves : doubles croches 3+3+2 (le moteur du thème principal)
            r = BASSE[c]
            rv = r if r.endswith('3') else r.replace('2', '3')
            rg = r.replace('3', '2') if r.endswith('3') else r
            acc = FIGS_GRAVES[i % 3].split()
            acc = acc[8 * k:8 * k + 8] if len(parts) == 2 else acc
            s.joue(celles, ostinato([rv], pas=0.25, longueur=d, vel=86, accents=' '.join(acc), art='staccato'), a=t)
            s.joue(cb, ostinato([rg], pas=0.25, longueur=d, vel=82, accents=' '.join(acc), art='staccato'), a=t)
    for p in (violons2, altos, tuba, cors, celles, cb):
        s.expression(p, [(0, 'f'), (s.m(4), 'mf'), (s.m(12), 'f'), (s.m(14), 'ff'), (s.m(16), 'f'),
                         (s.m(16, 4), 'mf')])
    # la harpe en glissandos, les cloches, le glockenspiel : la lumière
    for m in (2, 6, 10, 14):
        glissando(s, harpe, s.m(m), 'C4', 'C6', duree=0.75, vel=74)
    s.nuance(harpe, 'f')
    for m, h in ((6, 'C5'), (10, 'A4')):
        s.note(cloches, h, s.m(m), 4, vel=86)
    for i, ch in enumerate(GRILLE_S):
        c = ch.split('|')[-1]
        s.joue(glock, arpege(HARPE[c][5:], '1 2 3 2', pas=0.5, vel=60).octave(2), a=s.m(i + 1, 3))
    s.nuance(glock, 'mp')
    for m in (6, 10):
        s.note(timbales, 'F2', s.m(m), 1, vel=100)
        s.note(cymbales, 'C4', s.m(m), 2, vel=90)
    s.note(timb_roul, 'C3', s.m(12), 4, vel=84)
    s.crescendo(timb_roul, s.m(12), s.m(13), 'mp', 'f')


# --- H : la descente ------------------------------------------------------------------------------
@theme.section('H', mesures=8)
def H(s):
    premier_temps(s, 'fa', cloche='A4', vel=94)
    harpe_arpege(s, GRILLE_H, vel=70, decal=2)
    s.expression(harpe, [(0, 'mf'), (s.m(8, 4), 'mp')])
    pizz_graves(s, GRILLE_H)
    s.nuance(vc_pz, 'mp')
    tenue(s, GRILLE_H, vel=70)
    for p in (violons2, altos, celles):
        s.expression(p, [(0, 'mf'), (s.m(5), 'mp'), (s.m(8, 4), 'p')])
    # les violons descendent, doucement
    s.joue(violons, mel('C6:3 A5:1 | B5:2 D5:2 | A5:3 F5:1 | G5:2 B4:2 | A4:4 | C5:4 | D5:2 C5:2 | Bb4:4',
                        art='legato'), vel=80)
    s.expression(violons, [(0, 'mf'), (s.m(5), 'mp'), (s.m(8, 4), 'p')])
    # le cor, une dernière fois : la tête, loin
    s.joue(cor, phrase('tete', TON, octave=3), a=s.m(4, 4), vel=84)
    s.expression(cor, [(0, 'mp'), (s.m(8), 'p')])
    s.nuance(cloches, 'mp')


# --- F3 : la harpe seule, la tête en valeurs longues (fenêtre ; la relance) --------------------------------
@theme.section('F3', mesures=8, reprise=False)
def F3(s):
    lente = phrase('tete', TON, octave=4).augmente(4)      # fa — do — | ré ────
    s.joue(harpe, lente, vel=70)
    for m, h in ((1, 'F2'), (2, 'F2'), (3, 'F2')):
        s.note(harpe, h, s.m(m), 4, vel=52)
    for m, voix in ((2, ['D3', 'G3', 'B3']), (3, ['G3', 'B3'])):
        for h in voix:
            s.note(harpe, h, s.m(m, 2), 2, vel=46)
    s.nuance(harpe, 'mp')
    # m. 7–8 : la harpe repart, les pizz. graves, une cloche : la porte se rouvre
    harpe_arpege(s, ['fa', 'sol/fa'], de=7, vel=72)
    s.crescendo(harpe, s.m(7), s.m(9), 'mp', 'f')
    s.note(vc_pz, 'F2', s.m(7), 1, vel=66)
    s.note(vc_pz, 'F2', s.m(8), 1, vel=70)
    s.nuance(vc_pz, 'mp')
    s.note(carillon, 'C4', s.m(8, 3), 2, vel=58, art='monte')


theme.forme(intro=['intro'], corps=['A', 'B', 'C', 'F1', 'A2', 'D', 'E', 'C2', 'F2', 'G', 'S', 'H', 'F3'])
