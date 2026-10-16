"""FUSIBLE — « Chambre 12 » (livre_h7) : le thème du livre 7, en ville un jour sur deux, et
sous son introduction jouée (six heures, la réception de l'hôtel de la Rive).

2011, le huis clos. Vingt-six crochets de laiton derrière un comptoir, une réceptionniste qui
n'a pas dormi, et la troisième nuit, à 2 h 10, des pas dans le couloir, une porte, puis plus
rien. On ne sort pas de la chambre : UNE grille de huit mesures, la même d'un bout à l'autre
(une chaconne), que seule l'orchestration fait changer ; une mesure à trois temps revient, la
valse lente du pianiste de l'hôtel ; des silences.

LA GRILLE (mi bémol mineur, la même partout ; en 3/4, un accord par mesure)
    m.1 i   m.2 ♭vi   m.3 i   m.4 ♭vi     mib m — dob m : deux mineurs à une tierce majeure,
                                          la menace ; les voix glissent d'un demi-ton
                                          (mib→ré, sib→dob), solb reste
    m.5 i → ♭vi/ré   m.6 i7/réb → ø/do   m.7 ♭vi   m.8 V
                                          le lamento : la basse descend mib ré réb do dob sib
                                          sous un accord qui tient, ♭vi revient dans la chute,
                                          V (sib majeur) : la porte ; on revient toujours à i
  Les voix du dessus ne bougent que par demi-tons (mib/ré, solb/fa#/fa, sib/si) : ce sont les
  cordes graves tenues de la fiche, les murs qui respirent.

LE MOTIF (partitions/_fusible.py, en mi bémol mineur ; jamais la phrase entière)
    le motif     mib4 sib4 | DOB5 ── solb4 fa4 | lab4 mib4     anacrouse sur i, la mèche sur la
                                                                fondamentale de ♭vi, la chute sur i
    la mèche     mib4 sib4 | DOB5 ── ── ── ── ── ──             sur ♭vi puis i : elle brûle, ne se
                                                                résout pas (l'habit « menace »)
    la valse     | (3ᵉ temps) mib sib | DOB ── solb fa | lab mib (et la mèche sur deux mesures) :
                 les mêmes notes, un autre mètre (remesure() ne touche qu'aux durées)
    la tête      dans les clés (le trousseau), au cor (le couloir), en valeurs doublées au creux.

LA SIGNATURE : la sonnette de réception, accordée sur mib (glockenspiel mib7 en deux prises
désaccordées, le battement d'un timbre de comptoir, et le corps d'un vibraphone mib6), sur sib
quand l'accord est V ; une frappe, deux au creux (quelqu'un attend au comptoir vide). Autour :
les trois coups (une mesure à trois temps : caisse claire sans timbre et tom accordé, dans la
pièce sèche), le trousseau (célesta et glockenspiel : cinq petites notes sur mib, sib, dob), le
piano dans une pièce sèche, les cordes graves tenues, la cymbale frottée à l'archet (un
sifflement sur fa#, la tierce de mib mineur : ce qui reste dans l'oreille après les coups). L'arc
(le son de FUSIBLE) : l'ampoule du couloir qui grésille ; à l'ouverture, puis une fois dans la
boucle, au creux.

L'ÉPOQUE (2011) : l'orchestre hybride de cinéma, gardé intime — l'ostinato de violoncelles en
doubles croches 3+3+2, les cuivres graves, le sous-grave, le braam une fois, les timbales.

LA CARTE (76 à la noire ; une mesure de 4/4 = 3,16 s, de 3/4 = 2,37 s ; le corps boucle :
81 mesures, 242,4 s)
  intro   3 m. + 1 m. 3/4  l'arc ; la sonnette ; les cordes graves sur mib ; le trousseau ; la
                           tête au piano ; les trois coups                             2 → 3
  A      8 m.  0:00  « La réception » : la sonnette sur le 1 ; cordes graves tenues ; le
                     motif au piano (le pianiste de l'hôtel, tôt) ; le trousseau        2 → 3
  B      8 m.  0:25  « Le tableau » : pizzicati (le tic-tac du hall), la clarinette chante le
                     motif, le cor lointain la mèche                                    3 → 4
  V1     8 m. 3/4  0:51  « La valse » : le piano seul, valse lente ; le motif, la mèche ; la
                     sonnette sur sib                                                    3
  C      8 m.  1:09  « Le couloir » : l'ostinato, les cuivres graves, la tête au cor (une
                     porte au bout du couloir) ; la cymbale enfle                       5 → 6
  D      8 m.  1:35  « Deux heures dix » : le sommet — le braam, le motif aux cors avec
                     trombones et violoncelles, la mèche tenue, le lamento plein ; tout
                     s'arrête au 3ᵉ temps de la dernière mesure (un temps de silence)   8
  K      1 m. 3/4  2:00  « La porte » : les trois coups, seuls                           1
  E      8 m.  2:02  « La douze » : le creux — l'arc (l'ampoule meurt), la cymbale frottée,
                     une pédale presque muette, la sonnette deux fois au loin, la tête en
                     valeurs doublées au piano ; puis le lamento revient                1 → 2
  V2     8 m. 3/4  2:28  « La valse, la nuit » : la valse orchestrée (pizzicati, basson) ; la
                     clarinette chante, puis la valse tourne seule ; la sonnette sur sib  4
  F      8 m.  2:47  « Le cahier de nuit » : l'ostinato aux altos, les violoncelles chantent
                     le motif, le chœur au fond sur le lamento (les bougies)           5 → 6
  G      8 m.  3:12  « Passez-moi la 12 » : le second sommet — les cordes à trois octaves
                     chantent le motif, les cors la mèche, le lamento en contre-chant   7 → 8
  H      8 m.  3:37  « Six heures » : le trousseau, la mèche au cor sur la pédale ; la
                     dernière mesure enfle vers la sonnette de A                         3
"""
from moteur.ecriture import *
from partitions._fusible import phrase, Arc

theme = Theme('livre_h7', 'Chambre 12', bpm=76, mesure='4/4', tonalite='mi bémol mineur', graine=2011,
              ville=True, moment='la ville le jour, livre 7 ; son introduction jouée',
              humeur="le huis clos : l'hôtel de la Rive à six heures, le tableau des clés, la chambre 12")

TON = 'mi bémol mineur'
SEC = 76 / 60.0          # une seconde, en temps

# --- l'arc (le son de FUSIBLE) : ici l'ampoule du couloir, plus bas que dans l'accueil -----------
arc = Arc(theme, volume=-5, impact_volume=-11)

# --- la sonnette (la signature), le trousseau, les trois coups ------------------------------------
_COMPTOIR = {'profondeur': 0.3, 'salle': 0.1, 'piece': 0.3}
sonnette = theme.piste('sonnette', 'glockenspiel', unisson=2, pan=0.15, volume=4, **_COMPTOIR)
sonnette_corps = theme.piste('sonnette_corps', 'vibraphone', art='dure', pan=0.15, volume=-1, **_COMPTOIR)
cles = theme.piste('cles', 'celesta', pan=0.35, volume=-1, **_COMPTOIR)
cles2 = theme.piste('cles2', 'glockenspiel', pan=0.4, volume=-8, **_COMPTOIR)
_COULOIR = {'profondeur': 0.25, 'salle': 0.04, 'piece': 0.45}
porte = theme.piste('porte', 'caisse_claire', art='timbre_off', pan=-0.2, eq={'passe_bas': 3000}, volume=1,
                    **_COULOIR)
porte_bois = theme.piste('porte_bois', 'toms', pan=-0.2, eq={'passe_bas': 2200}, volume=-5, **_COULOIR)

# --- le piano de l'hôtel, dans une pièce sèche ---------------------------------------------------
piano = theme.piste('piano', art='tenu', profondeur=0.15, salle=0.06, piece=0.35, volume=9)        # la main droite
piano_mg = theme.piste('piano_mg', 'piano', art='tenu', profondeur=0.15, salle=0.06, piece=0.35, volume=5)

# --- les cordes ------------------------------------------------------------------------------------
violons = theme.piste('violons', volume=-1)
violons2 = theme.piste('violons2', 'violons', pan=-0.22, volume=0)
altos = theme.piste('altos', volume=2)
celles = theme.piste('celles', 'violoncelles', bref=0.18, volume=-1)            # l'ostinato
celles_tenu = theme.piste('celles_tenu', 'violoncelles', art='tenu', pan=0.3, volume=6)        # les voix tenues
celles_chant = theme.piste('celles_chant', 'violoncelles', art='tenu', pan=0.25, volume=0)      # le motif
basses = theme.piste('basses', 'contrebasses', art='sans_vibrato', volume=2)

# --- les bois ----------------------------------------------------------------------------------
clarinette = theme.piste('clarinette', 'clarinettes', unisson=1, art='tenu', volume=5)
basson = theme.piste('basson', 'bassons', unisson=1, art='staccato', bref=0.2, volume=6)

# --- les cuivres -----------------------------------------------------------------------------
cor_loin = theme.piste('cor_loin', 'cors', unisson=1, pan=-0.4, profondeur=0.9, salle=0.55, volume=4)
cors = theme.piste('cors', art='tenu', volume=1)
trombones = theme.piste('trombones', art='tenu', volume=-1)
tuba = theme.piste('tuba', volume=0)
braam = theme.piste('braam', volume=-6)
cuivre_s = theme.piste('cuivre_s', 'cuivre_synthe', volume=-14)

# --- les voix ------------------------------------------------------------------------------------
choeur = theme.piste('choeur', art='ouh', profondeur=0.85, largeur=1.2, volume=-2)

# --- les percussions -------------------------------------------------------------------------------
timbales = theme.piste('timbales', volume=-3)
timb_roul = theme.piste('timb_roul', 'timbales', art='roulement', volume=-4)
suspendue = theme.piste('suspendue', 'cymbale_suspendue', volume=-5)
archet = theme.piste('archet', 'cymbale_suspendue', art='archet', profondeur=0.85, salle=0.4, volume=-4)
cymbales = theme.piste('cymbales', volume=-5)
tamtam = theme.piste('tam_tam', volume=-4)

# --- le grain de synthèse ----------------------------------------------------------------------
sub = theme.piste('sub', 'sub_synthe', volume=-17)
effets = theme.piste('effets', volume=-8)

# l'air de la salle : les bus gardent leurs réglages par défaut, un plateau de plus à 10 kHz
theme.bus('cordes', eq={'passe_haut': 32, 'cloches': [(2500, 1.0, 0.7)], 'air': 4.0})
theme.bus('cuivres', eq={'passe_haut': 38, 'boue': -1.0, 'air': 3.0})
theme.bus('choeur', eq={'passe_haut': 120, 'cloches': [(3200, 1.5, 0.8)], 'air': 3.0})


def nuances(s, **niveaux):
    """La nuance de chaque piste au début de la section (on l'écrit partout où elle compte :
    le jeu peut reprendre le thème à chaque section)."""
    for nom_piste, v in niveaux.items():
        s.nuance(theme.pistes[nom_piste], v, 0)


# =====================================================================================
# Le matériau

MOTIF = phrase('motif', TON, octave=4)          # mib4 sib4 | dob5 ── solb4 fa4 | lab4 mib4
MECHE = phrase('meche', TON, octave=4)
TETE = phrase('tete', TON, octave=4)


def remesure(motif, durees):
    """Les mêmes notes, d'autres durées : le changement de mètre (recette § 1.4)."""
    notes = []
    t = 0.0
    for n, d in zip(motif.notes, durees):
        notes.append(n.copie(t=t, d=d))
        t += d
    return Motif(notes, t)


# la valse de l'hôtel : | (3ᵉ temps) mib sib | DOB ── solb fa | lab mib (le 3ᵉ temps reste libre
# pour l'anacrouse suivante)
VALSE = remesure(MOTIF, [.5, .5, 2, .5, .5, 1, .95])
VALSE_MECHE = remesure(MECHE, [.5, .5, 5.9])

# Les accords de la grille : la basse (octave 2), les trois voix du dessus (octave 3, elles ne
# bougent que par demi-tons) et la « quinte » de l'ostinato (l'intervalle, sur la basse, d'un
# son de l'accord : le saut d'accent des doubles croches)
ACCORDS = {
    'i': ('Eb2', ('Eb3', 'Gb3', 'Bb3'), 7),
    'vi': ('B1', ('D3', 'F#3', 'B3'), 7),         # dob mineur (écrit si : dob ré♭♭ solb)
    'viD': ('D2', ('D3', 'F#3', 'B3'), 4),        # ♭vi sur sa tierce : la basse descend
    'i7': ('Db2', ('Eb3', 'Gb3', 'Bb3'), 5),      # mib m7 sur réb
    'oC': ('C2', ('Eb3', 'Gb3', 'Bb3'), 6),       # do ø7 (mib m6 sur do)
    'V': ('Bb1', ('D3', 'F3', 'Bb3'), 7),
    # les habits de la grille sous la mélodie (des voicings, pas d'autres accords) :
    'VIe': ('Eb2', ('Eb3', 'Gb3', 'B3'), 8),      # i dont la quinte monte sur dob : la mèche
                                                  # qui déborde sur i (♭6) est dans l'accord
    'viT': ('B1', ('D3', None, 'B3'), 7),         # ♭vi sans fa# sous le « fa » de passage
}
GRILLE4 = (['i'] * 4 + ['vi'] * 4 + ['i'] * 4 + ['vi'] * 4 + ['i', 'i', 'viD', 'viD'] +
           ['i7', 'i7', 'oC', 'oC'] + ['vi'] * 4 + ['V'] * 4)
GRILLE3 = (['i'] * 3 + ['vi'] * 3 + ['i'] * 3 + ['vi'] * 3 + ['i', 'i', 'viD'] + ['i7', 'i7', 'oC'] +
           ['vi'] * 3 + ['V'] * 3)


# Les habits de chaque section : (temps → accord). La mèche qui déborde sur i (la mesure qui suit
# ♭vi) y garde dob au lieu de sib ; sous « solb FA » (le 4ᵉ temps de ♭vi, en 3/4 le 3ᵉ), le fa#
# tenu se tait sur ce temps (sinon fa contre fa#).
_MECHE4 = {16: 'VIe', 17: 'VIe', 7: 'viT'}
_MECHE3 = {12: 'VIe', 13: 'VIe', 5: 'viT'}
VARIANTES = {
    'A': {7: 'viT'},
    'B': _MECHE4, 'D': _MECHE4, 'F': _MECHE4, 'G': _MECHE4,
    'H': {8: 'VIe', 9: 'VIe', 10: 'VIe'},
    'V1': _MECHE3, 'V2': _MECHE3,
}


def grille_de(s):
    base = list(GRILLE4 if s.tpm == 4 else GRILLE3)
    for i, c in VARIANTES.get(s.section.nom, {}).items():
        base[i] = c
    return base


def plages(temps, de=0, jusqua=None):
    """Les accords temps par temps → [(début, durée, accord)], les temps égaux fusionnés,
    coupés à [de, jusqua)."""
    fin = len(temps) if jusqua is None else int(round(jusqua))
    de = int(round(de))
    sortie = []
    for i, c in enumerate(temps):
        if i < de or i >= fin:
            continue
        if sortie and sortie[-1][2] == c and sortie[-1][0] + sortie[-1][1] == i:
            d, l, _ = sortie[-1]
            sortie[-1] = (d, l + 1, c)
        else:
            sortie.append((i, 1, c))
    return sortie


def basse(s, piste, octave=0, vel=80, art=None, de=0, jusqua=None, maxi=None, decale=0.0):
    """La basse de la grille (mib ré réb do dob sib), à l'octave dite (0 : celle d'ACCORDS) ;
    jamais sous do1 (32,7 Hz : la sous-basse remonte d'une octave sous dob et sib)."""
    for d, l, c in plages(grille_de(s), de, jusqua):
        l = min(l, maxi or l)
        h = hauteur(ACCORDS[c][0]) + 12 * octave
        if h < hauteur('C1'):
            h += 12
        s.note(piste, h, d + decale, l - decale, vel=vel, art=art)


def voix(s, piste, rangs=(0, 1, 2), octave=0, vel=72, art=None, de=0, jusqua=None):
    """Les voix du dessus (0 la plus grave, 2 la plus aiguë), tenues d'un accord à l'autre :
    une voix qui ne change pas de hauteur ne se réattaque pas (les murs respirent)."""
    t = grille_de(s)
    fin = len(t) if jusqua is None else int(round(jusqua))
    de = int(round(de))
    for r in rangs:
        debut, h0 = None, None
        for i in range(de, fin + 1):
            x = ACCORDS[t[i]][1][r] if i < fin else None
            h = hauteur(x) + 12 * octave if x is not None else None
            if h != h0:
                if h0 is not None:
                    s.note(piste, h0, debut, i - debut, vel=vel, art=art)
                debut, h0 = i, h


def accord_temps(c, octave=0):
    return [hauteur(x) + 12 * octave for x in ACCORDS[c][1] if x is not None]


# L'ostinato de doubles croches (3+3+2), sur la basse de chaque temps : 0 la basse, 12 son
# octave, 'q' le son de l'accord qui lui sert de quinte ; deux mesures de suite jamais pareilles
FIG = {
    'a': ([0, 0, 0, 12, 0, 0, 'q', 0, 0, 0, 0, 12, 0, 0, 'q', 12], 'X x o X x o X x X x o X x o X o'),
    'b': ([0, 0, 0, 'q', 0, 0, 12, 0, 0, 0, 0, 'q', 0, 0, 12, 'q'], 'X x o X o x X x X o x X x o X x'),
    'c': ([0, 0, 12, 0, 0, 'q', 0, 0, 0, 0, 12, 0, 0, 'q', 12, 'q'], 'X o x X o x X o X o x X x o X x'),
}


def ostinato_mesure(s, m, octave, fig, vel=80, temps=4, plancher=None):
    t = grille_de(s)
    decal, acc = FIG[fig]
    acc = acc.split()
    notes = []
    for i in range(4 * temps):
        c = t[(m - 1) * 4 + i // 4]
        b, _, q = ACCORDS[c]
        h = hauteur(b) + 12 * octave
        o = decal[i]
        if plancher is not None and h < hauteur(plancher):
            h += 12
        h += q if o == 'q' else o
        v = {'X': vel + 20, 'x': vel, 'o': vel - 22}[acc[i]]
        notes.append(Note(h, i * 0.25, 0.25, v, 'staccato'))
    return Motif(notes, float(temps))


def moteur(s, piste, octave, figs, vel=80, de=1, a=8, derniere=4, plancher=None):
    """L'ostinato de la mesure `de` à la mesure `a` ; la dernière s'arrête après `derniere` temps ;
    une basse sous `plancher` monte d'une octave (l'étendue de l'instrument)."""
    for m in range(de, a + 1):
        nb = derniere if m == a else 4
        s.joue(piste, ostinato_mesure(s, m, octave, figs[(m - de) % len(figs)], vel, nb, plancher),
               a=s.m(m))


# --- les sons de l'hôtel -----------------------------------------------------------------------

def sonner(s, a, note='Eb', vel=92, double=False):
    """La sonnette de réception, accordée (mib, ou sib sous V) ; `double` : deux frappes."""
    s.note(sonnette, f'{note}7' if note == 'Eb' else f'{note}6', a, 2, vel=vel)
    s.note(sonnette_corps, f'{note}6' if note == 'Eb' else f'{note}5', a, 3, vel=vel - 4)
    if double:
        b = a + 0.38 * SEC
        s.note(sonnette, f'{note}7' if note == 'Eb' else f'{note}6', b, 2, vel=vel - 12)
        s.note(sonnette_corps, f'{note}6' if note == 'Eb' else f'{note}5', b, 3, vel=vel - 16)


# le trousseau : six petites frappes irrégulières (en secondes) sur mib, sib, dob — la tête
_TROUSSEAU = ((0.0, 'Eb7', 70), (0.045, 'Bb6', 56), (0.1, 'B6', 62), (0.16, 'Eb7', 48),
              (0.235, 'Bb6', 42), (0.32, 'B6', 36))


def trousseau(s, a, vel=0):
    for dt, h, v in _TROUSSEAU:
        s.note(cles, h, a + dt * SEC, 0.4, vel=v + vel)
        s.note(cles2, h, a + (dt + 0.008) * SEC, 0.3, vel=v - 8 + vel)


def trois_coups(s, a, vel=96):
    """Trois coups à une porte, un par temps (une mesure à trois temps)."""
    for k in range(3):
        s.note(porte, 'S', a + k, 0.5, vel=vel)
        s.note(porte_bois, 'Eb3', a + k, 0.5, vel=vel - 14)


def cymbale_vers(s, fin, art='monte_4s', vel=90):
    secondes = {'monte_2s': 2.0, 'monte_4s': 4.0, 'monte_7s': 7.0}[art]
    s.note(suspendue, 'C4', fin - secondes * SEC, secondes * SEC, vel=vel, art=art)


def roulement(s, piste, h, de, a, nuance_de, nuance_a, vel=84):
    s.note(piste, h, de, a - de, vel=vel)
    s.expression(piste, [(de, nuance_de), (a, nuance_a)])


def valse_piano(s, piste, vel=62, de=1, a=8):
    """La main gauche de la valse : la basse sur le 1 (octave 2), l'accord sur le 2 et le 3
    (octave 3, sous la mélodie) ; aux mesures 5 et 6, le 3ᵉ temps prend la basse de passage
    (ré, do) avec son accord."""
    t = grille_de(s)
    for m in range(de, a + 1):
        for k in range(3):
            c = t[(m - 1) * 3 + k]
            b = hauteur(ACCORDS[c][0])
            haut = sorted(accord_temps(c))
            if k == 0:
                s.note(piste, b, s.m(m), 1, vel=vel)
            else:
                if k == 2 and c != t[(m - 1) * 3]:
                    s.note(piste, b, s.m(m, 3), 1, vel=vel - 4)
                for h in haut:
                    s.note(piste, h, s.m(m, k + 1), 0.8, vel=vel - 14)


# =====================================================================================
# Les sections

@theme.section('intro', mesures=3)
def intro(s):
    arc.poser(s, 0, impact=True, vel=116)
    nuances(s, basses='pp', celles_tenu='pp', altos='pp', piano='mp', sub='mf')
    # les cordes graves sur mib : la contrebasse, puis la quinte des violoncelles, puis l'alto
    s.note(basses, 'Eb2', 0.5, 11.5, vel=70)
    s.note(sub, 'Eb1', 0.5, 11.5, vel=60)
    s.crescendo(basses, 0.5, 12, 'pp', 'p')
    s.note(celles_tenu, 'Eb3', 1, 7, vel=68)
    s.note(celles_tenu, 'Bb3', 1.5, 6.5, vel=66)
    s.crescendo(celles_tenu, 1, 12, 'pp', 'p')
    # la sonnette, au 3ᵉ temps ; le trousseau ; la menace (♭vi sur la pédale de mib)
    sonner(s, s.m(1, 3), vel=90)
    trousseau(s, s.m(2, 2.5))
    s.note(altos, 'Gb3', s.m(2), 8, vel=64)
    s.note(celles_tenu, 'D3', s.m(3), 4, vel=68)
    s.note(celles_tenu, 'B3', s.m(3), 4, vel=68)
    s.crescendo(altos, s.m(2), 12, 'pp', 'p')
    # la tête au piano : l'anacrouse au 4ᵉ temps, la mèche sur ♭vi (sur la pédale de mib)
    s.joue(piano, TETE, a=s.m(2, 4), vel=74)


@theme.section('porte0', mesures=1, mesure='3/4', reprise=False)
def porte0(s):
    trois_coups(s, 0, vel=94)
    s.note(basses, 'Eb2', 0, 3, vel=56)
    s.diminuendo(basses, 0, 3, 'pp', 'ppp')


# --- A : la réception ------------------------------------------------------------------------
@theme.section('A', mesures=8)
def A(s):
    nuances(s, basses='mp', celles_tenu='pp', altos='p', piano='mf', piano_mg='f', sub='mf', violons2='pp')
    sonner(s, 0, vel=94)
    # la basse et les voix tenues : la grille entière, très bas dans la nuance
    basse(s, basses, vel=72)
    basse(s, sub, octave=-1, vel=56, jusqua=s.m(5))
    voix(s, celles_tenu, rangs=(0, 1), vel=70)
    voix(s, altos, rangs=(2,), vel=70, de=s.m(2))
    s.crescendo(celles_tenu, s.m(4), s.m(8, 4), 'pp', 'p')
    s.crescendo(altos, s.m(4), s.m(8, 4), 'p', 'mp')
    # la main gauche du piano marque chaque changement de basse (sèche, une octave au-dessus)
    for d, l, c in plages(grille_de(s)):
        s.note(piano_mg, hauteur(ACCORDS[c][0]) + 12, d, min(l, 2), vel=58)
    # le motif au piano (le pianiste de l'hôtel, tôt le matin) ; puis plus rien que les cordes
    s.joue(piano, MOTIF, a=s.m(1, 4), vel=76)
    # le trousseau (Sandrine raccroche un double), et un souffle de violons très haut sur V
    trousseau(s, s.m(6, 2.5), vel=-6)
    s.note(violons2, 'Bb5', s.m(8), 4, vel=56, art='tenu')


# --- B : le tableau ---------------------------------------------------------------------------
@theme.section('B', mesures=8)
def B(s):
    nuances(s, basses='f', celles_tenu='p', altos='mf', clarinette='mp', cor_loin='mf', piano_mg='mf')
    # les pizzicati : la basse et sa quinte, sur 1 et 3 (le tic-tac du hall)
    for d, l, c in plages(grille_de(s)):
        b, _, q = ACCORDS[c]
        for k in range(0, l, 2):
            s.note(basses, b, d + k, 1, vel=86 if k == 0 else 72, art='pizzicato')
            if l - k > 1:
                s.note(basses, hauteur(b) + q, d + k + 1, 1, vel=64, art='pizzicato')
    voix(s, celles_tenu, rangs=(0, 1), vel=68)
    voix(s, altos, rangs=(2,), vel=68)
    # la clarinette chante le motif ; le cor lointain répond par la mèche
    s.joue(clarinette, MOTIF, a=s.m(1, 4), vel=88)
    s.joue(cor_loin, MECHE, a=s.m(3, 4), vel=86)
    s.diminuendo(cor_loin, s.m(5), s.m(5, 4), 'mf', 'p')
    trousseau(s, s.m(6), vel=-4)
    # m. 7–8 : le piano reprend la chute de la basse ; un silence au dernier temps
    s.note(piano_mg, 'B2', s.m(7), 3.5, vel=60)
    s.note(piano_mg, 'Bb2', s.m(8), 2.5, vel=62)
    for h in ('D4', 'F4', 'Bb4'):
        s.note(piano_mg, h, s.m(8, 1.5), 1.5, vel=50)


# --- V1 : la valse (le piano seul) -----------------------------------------------------------------
@theme.section('V1', mesures=8, mesure='3/4')
def V1(s):
    nuances(s, piano='mf', piano_mg='f', basses='p')
    valse_piano(s, piano_mg, vel=64)
    s.joue(piano, VALSE, a=s.m(1, 3), vel=80)
    s.joue(piano, VALSE_MECHE, a=s.m(3, 3), vel=76)
    # un fil de contrebasse sous la valse (la basse dès la première mesure)
    basse(s, basses, vel=60, maxi=2)
    sonner(s, s.m(8), note='Bb', vel=84)


# --- C : le couloir ------------------------------------------------------------------------------
@theme.section('C', mesures=8)
def C(s):
    nuances(s, celles='f', basses='mp', altos='mp', violons2='p', cors='ff', trombones='mp', tuba='p',
            sub='f', timbales='mf')
    s.note(timbales, 'Eb2', 0, 1, vel=92)
    moteur(s, celles, 1, 'abcb', vel=80)
    s.crescendo(celles, s.m(5), s.m(8, 4), 'f', 'ff')
    basse(s, basses, vel=78, art='tenu')
    basse(s, sub, octave=-1, vel=60)
    voix(s, altos, rangs=(0, 1, 2), vel=70)
    s.crescendo(altos, s.m(5), s.m(8, 4), 'mp', 'mf')
    voix(s, violons2, rangs=(2,), octave=2, vel=62, de=s.m(5))
    # la tête au cor : une porte au bout du couloir
    s.joue(cors, TETE, a=s.m(1, 4), vel=104)
    # les cuivres graves tiennent le lamento (m. 5–8), le tuba sous eux
    voix(s, trombones, rangs=(0, 1, 2), vel=74, de=s.m(5))
    basse(s, tuba, vel=72, de=s.m(5))
    s.crescendo(trombones, s.m(5), s.m(8, 4), 'mp', 'f')
    s.crescendo(tuba, s.m(5), s.m(8, 4), 'p', 'mf')
    for m in (2, 4, 7):
        s.note(timbales, hauteur(ACCORDS[grille_de(s)[(m - 1) * 4]][0]) + 12, s.m(m), 1, vel=84)
    roulement(s, timb_roul, 'Bb2', s.m(8), s.m(9), 'p', 'f', vel=80)
    cymbale_vers(s, s.m(9), 'monte_4s', vel=96)


# --- D : deux heures dix (le sommet) ------------------------------------------------------------
@theme.section('D', mesures=8)
def D(s):
    nuances(s, celles='f', altos='mf', basses='mf', violons='mf', violons2='mf', cors='f', trombones='f',
            celles_chant='f', tuba='mp', sub='fff', timbales='f', choeur='mp')
    fin = s.m(8, 3)                      # tout s'arrête au 3ᵉ temps de la dernière mesure
    s.note(braam, 'Eb2', 0, 3, vel=108)
    s.note(cymbales, 'C4', 0, 2, vel=100)
    s.note(timbales, 'Eb2', 0, 1, vel=110)
    s.note(cuivre_s, 'Eb2', 0, 3, vel=90)
    # le moteur : violoncelles et altos à l'octave
    moteur(s, celles, 1, 'abac', vel=88, derniere=2)
    moteur(s, altos, 2, 'baca', vel=80, derniere=2)
    basse(s, basses, vel=90, art='tenu', jusqua=fin)
    basse(s, tuba, vel=84, jusqua=fin)
    basse(s, sub, octave=-1, vel=70, jusqua=fin)
    # les violons en trémolo, haut : les voix du dessus deux octaves plus haut
    voix(s, violons, rangs=(1, 2), octave=2, vel=84, art='tremolo', jusqua=fin)
    voix(s, violons2, rangs=(0, 1), octave=2, vel=80, art='tremolo', jusqua=fin)
    # le motif : les cors (octave 4), les trombones et les violoncelles (octave 3)
    s.joue(cors, MOTIF, a=s.m(1, 4), vel=108)
    s.joue(trombones, MOTIF.octave(-1), a=s.m(1, 4), vel=104)
    s.joue(celles_chant, MOTIF.octave(-1), a=s.m(1, 4), vel=100)
    # la mèche tenue, puis le lamento : les cors et les trombones tiennent les voix
    s.joue(cors, MECHE, a=s.m(3, 4), vel=110)
    s.joue(trombones, MECHE.octave(-1), a=s.m(3, 4), vel=106)
    voix(s, trombones, rangs=(0, 1, 2), vel=96, de=s.m(6), jusqua=fin)
    voix(s, cors, rangs=(1, 2), octave=1, vel=98, de=s.m(6), jusqua=fin)
    voix(s, choeur, rangs=(0, 1, 2), octave=1, vel=76, de=s.m(5), jusqua=fin)
    # les timbales sur chaque changement de basse du lamento ; la cymbale vers la porte
    for d, l, c in plages(grille_de(s), de=s.m(5), jusqua=fin):
        s.note(timbales, hauteur(ACCORDS[c][0]) + 12, d, 1, vel=96)
    roulement(s, timb_roul, 'Bb2', s.m(8), fin, 'mf', 'ff', vel=92)
    cymbale_vers(s, fin, 'monte_2s', vel=96)
    for p in (cors, trombones, violons, violons2):
        s.crescendo(p, s.m(7), fin, 'f', 'ff')


# --- K : la porte (les trois coups) --------------------------------------------------------------
@theme.section('K', mesures=1, mesure='3/4', reprise=False)
def K(s):
    trois_coups(s, 0, vel=100)


# --- E : la douze (le creux) ------------------------------------------------------------------------
@theme.section('E', mesures=8)
def E(s):
    nuances(s, basses='pp', violons2='ppp', piano='f', piano_mg='mp', celles_tenu='p', altos='p', violons='pp')
    arc.poser(s, 0, impact=False, vel=112)
    s.note(tamtam, 'C4', 0, 8, vel=60)
    s.note(archet, 'C4', 0.5, 8, vel=72)          # la cymbale frottée : le sifflement d'après
    # la pédale presque muette (mib) : quatre mesures presque vides ; puis le lamento revient
    s.note(basses, 'Eb2', 0, s.m(5, 3), vel=62)
    basse(s, basses, vel=72, de=s.m(5, 3))
    s.crescendo(basses, s.m(5, 3), s.m(8, 4), 'p', 'mf')
    s.note(violons2, 'Bb5', s.m(2), 8, vel=50, art='tenu')
    # quelqu'un attend au comptoir vide
    sonner(s, s.m(3), vel=78, double=True)
    # la tête en valeurs doublées au piano (la mèche sur ♭vi)
    s.joue(piano, TETE.augmente(2), a=s.m(3, 3), vel=80)
    # m. 5–8 : les voix tenues reviennent, le piano reprend la basse du lamento (sec)
    voix(s, celles_tenu, rangs=(0, 1), vel=70, de=s.m(5, 3))
    voix(s, altos, rangs=(2,), vel=70, de=s.m(5, 3))
    voix(s, violons, rangs=(1, 2), octave=1, vel=60, de=s.m(6), art='tenu')
    s.crescendo(celles_tenu, s.m(5, 3), s.m(8, 4), 'p', 'mp')
    s.crescendo(altos, s.m(5, 3), s.m(8, 4), 'p', 'mp')
    s.crescendo(violons, s.m(6), s.m(8, 4), 'pp', 'p')
    for d, l, c in plages(grille_de(s), de=s.m(5, 3)):
        s.note(piano_mg, hauteur(ACCORDS[c][0]) + 12, d, min(l, 2), vel=62)
    roulement(s, timb_roul, 'Bb2', s.m(8), s.m(9), 'pp', 'mp', vel=72)


# --- V2 : la valse, la nuit (orchestrée) ---------------------------------------------------------
@theme.section('V2', mesures=8, mesure='3/4')
def V2(s):
    nuances(s, basses='mf', violons2='f', altos='mp', clarinette='mp', basson='mp', piano_mg='mp')
    t = grille_de(s)
    for m in range(1, 9):
        c1 = t[(m - 1) * 3]
        s.note(basses, ACCORDS[c1][0], s.m(m), 1, vel=86, art='pizzicato')
        s.note(basson, hauteur(ACCORDS[c1][0]) + 12, s.m(m), 0.5, vel=70)
        for k in (1, 2):
            c = t[(m - 1) * 3 + k]
            if k == 2 and c != c1:
                s.note(basses, ACCORDS[c][0], s.m(m, 3), 1, vel=78, art='pizzicato')
            hs = sorted(accord_temps(c))
            for h in hs[:-1]:
                s.note(altos, h, s.m(m, k + 1), 0.5, vel=76, art='pizzicato')
            s.note(violons2, hs[-1], s.m(m, k + 1), 0.5, vel=80, art='pizzicato')
    valse_piano(s, piano_mg, vel=50)
    # la clarinette chante la valse (le motif, puis la mèche) ; puis la valse tourne seule
    s.joue(clarinette, VALSE, a=s.m(1, 3), vel=86)
    s.joue(clarinette, VALSE_MECHE, a=s.m(3, 3), vel=82)
    sonner(s, s.m(8), note='Bb', vel=86)


# --- F : le cahier de nuit ---------------------------------------------------------------------------
@theme.section('F', mesures=8)
def F(s):
    nuances(s, celles='mf', basses='mf', altos='mf', violons2='mp', celles_chant='ff',
            choeur='mp', timbales='mf', sub='f')
    s.note(timbales, 'Eb2', 0, 1, vel=88)
    moteur(s, altos, 2, 'cbab', vel=76)
    s.crescendo(altos, s.m(5), s.m(8, 4), 'mf', 'f')
    basse(s, basses, vel=80, art='tenu')
    basse(s, celles, octave=1, vel=72, art='tenu', de=s.m(5))
    basse(s, sub, octave=-1, vel=58)
    voix(s, violons2, rangs=(0, 1, 2), octave=2, vel=62)
    # les violoncelles chantent le motif (octave 3)
    s.joue(celles_chant, MOTIF.octave(-1), a=s.m(1, 4), vel=104)
    # le chœur (les bougies devant l'hôtel) sur le lamento
    for d, l, c in plages(grille_de(s), de=s.m(5)):
        for h in accord_temps(c):
            s.note(choeur, h + 12, d, l, vel=72)
    s.crescendo(choeur, s.m(5), s.m(8, 4), 'mp', 'f')
    roulement(s, timb_roul, 'Bb2', s.m(8, 2), s.m(9), 'pp', 'mf', vel=76)
    cymbale_vers(s, s.m(9), 'monte_4s', vel=88)


# --- G : passez-moi la 12 (le second sommet) --------------------------------------------------------
@theme.section('G', mesures=8)
def G(s):
    nuances(s, violons='f', violons2='f', altos='f', celles='f', celles_chant='f', basses='mf', cors='f',
            trombones='mf', tuba='mf', choeur='mf', timbales='f', sub='fff')
    fin = s.m(8, 3.5)
    s.note(timbales, 'Eb2', 0, 1, vel=108)
    s.note(cymbales, 'C4', 0, 2, vel=92)
    moteur(s, celles, 1, 'cabc', vel=86, derniere=3)
    basse(s, basses, vel=92, art='tenu', jusqua=fin)
    basse(s, tuba, vel=80, jusqua=fin)
    basse(s, sub, octave=-1, vel=68, jusqua=fin)
    # les cordes à trois octaves chantent le motif (violons, altos, violoncelles)
    s.joue(violons, MOTIF.octave(1), a=s.m(1, 4), vel=100, art='tenu')
    s.joue(altos, MOTIF, a=s.m(1, 4), vel=98, art='tenu')
    s.joue(celles_chant, MOTIF.octave(-1), a=s.m(1, 4), vel=98)
    # les cors : la mèche ; les trombones tiennent les voix
    s.joue(cors, MECHE, a=s.m(3, 4), vel=106)
    voix(s, trombones, rangs=(0, 1, 2), vel=86, jusqua=fin)
    # le lamento en contre-chant aux violons (m. 5–8), la basse au-dessus d'elle-même
    for d, l, c in plages(grille_de(s), de=s.m(5), jusqua=fin):
        s.note(violons, hauteur(ACCORDS[c][0]) + 48, d, l, vel=94, art='tenu')
        s.note(violons2, hauteur(ACCORDS[c][0]) + 36, d, l, vel=90, art='tenu')
    voix(s, altos, rangs=(1, 2), octave=1, vel=86, de=s.m(6), jusqua=fin)
    for d, l, c in plages(grille_de(s), de=s.m(5), jusqua=fin):
        for h in accord_temps(c):
            s.note(choeur, h + 12, d, l, vel=84, art='aah')
        s.note(timbales, hauteur(ACCORDS[c][0]) + 12, d, 1, vel=100)
    s.crescendo(choeur, s.m(5), s.m(8), 'mf', 'f')
    cymbale_vers(s, s.m(8, 3.5), 'monte_4s', vel=84)
    s.note(cymbales, 'C4', s.m(8, 3.5), 1, vel=96, art='etouffee')


# --- H : six heures (la relance) ------------------------------------------------------------------
@theme.section('H', mesures=8)
def H(s):
    nuances(s, basses='mp', celles_tenu='pp', altos='mp', piano_mg='f', cor_loin='f', sub='mf')
    trousseau(s, 0.25, vel=0)
    s.note(archet, 'C4', s.m(1, 3), 6, vel=58)
    # la pédale de mib (la menace demeure), puis le lamento
    s.note(basses, 'Eb2', 0, s.m(5), vel=74)
    basse(s, basses, vel=74, de=s.m(5))
    s.note(piano_mg, 'Eb2', 0, 2, vel=60)
    basse(s, sub, octave=-1, vel=54, jusqua=s.m(5))
    voix(s, celles_tenu, rangs=(0, 1), vel=66)
    voix(s, altos, rangs=(2,), vel=66)
    s.crescendo(celles_tenu, s.m(5), s.m(8, 4), 'pp', 'p')
    # la mèche au cor lointain, sur la pédale
    s.joue(cor_loin, MECHE, a=s.m(1, 4), vel=84)
    s.diminuendo(cor_loin, s.m(2), s.m(3, 4), 'f', 'p')
    # le piano reprend la basse du lamento ; la dernière mesure enfle vers la sonnette de A
    for d, l, c in plages(grille_de(s), de=s.m(5)):
        s.note(piano_mg, hauteur(ACCORDS[c][0]) + 12, d, min(l, 2), vel=56)
    roulement(s, timb_roul, 'Bb2', s.m(8), s.m(9), 'ppp', 'p', vel=70)
    cymbale_vers(s, s.m(9), 'monte_2s', vel=80)


theme.forme(intro=['intro', 'porte0'],
            corps=['A', 'B', 'V1', 'C', 'D', 'K', 'E', 'V2', 'F', 'G', 'H'])
