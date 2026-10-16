"""FUSIBLE — « La Rive » (match) : le samedi au stade.

La tribune mène : dès la première mesure, la foule chante le motif « Fusible » (la phrase
entière) sur le tambour de tribune en croches et les mains ; les cuivres graves lui
RÉPONDENT par la tête dans ses soupirs ; une pédale de la sous i–♭VI tient la tension ;
les deux tribunes se répondent en canon ; un but (la montée, la majeur, l'ovation).
Même famille que le thème principal (la éolien, la cellule | ♭VI ── ── ♭VII | i |, l'arc),
un cran plus vite et plus près du terrain : plus de tambours, moins d'ostinato de cordes.

LA CARTE (124 à la noire, une mesure = 1,935 s ; le corps boucle : 80 mesures, 154,8 s)
  intro  8 m.        l'ARC ; l'entrée des joueurs : pédale de la, accords pulsés des
                     cuivres (i, ♭VI), arpèges de violons qui montent, roulements, le
                     tambour de tribune entre ; dernier temps : silence, « fu-si »     4 → 8
  A     16 m.  0:00  chant A : la foule chante motif puis réponse sur la pédale de la ;
                     les cuivres graves répondent par la tête dans ses soupirs ; m. 9–12
                     elle scande sans chanter (« hé » sur les appuis), les trompettes
                     pulsent ; puis la réponse ; tambour en croches (3+3+2), mains     7
  B     16 m.  0:31  chant B : les deux tribunes en canon (une mesure d'écart) sur ♭VI
                     et iv ; trompettes en fanfare ; m. 9–12 on scande, les arpèges
                     montent ; taïkos ; puis les appels qui s'éteignent              7,5
  T      8 m.  1:02  la tension : pédale de la, i et ♭VI, puis une fois ♭vi mineur (la
                     menace) ; la rumeur de la foule, un cœur, trémolos ; roulements   4
  C     16 m.  1:17  le but : m. 1–4 la montée (♭VI ♭VII pulsés, arpèges, caisse
                     claire) puis silence, l'ARC, « fu-si » ; m. 5–14 tout le monde :
                     motif, réponse, motif, réponse, motif ; m. 15–16 LA MONTÉE → la
                     majeur, l'ovation                                             8 → 10
  A2    16 m.  1:48  la retombée (m. 1–4 : l'ovation s'éteint, la foule fredonne la
                     tête) ; puis la fanfare de 1990 (défilé, poum-pa), les
                     trompettes chantent le motif, la tribune tape dans ses mains   5 → 7
  B2     8 m.  2:19  la contre-attaque : la tête appelée par les cuivres et la foule,
                     taïkos ; silence, « fu-si » → A                                    8
  Les creux : T, et l'ouverture de A2. L'arc : l'intro et le silence d'avant le but.
  La mélodie (la foule, les cuivres qui répondent, le contre-chant) : 49 mesures sur 80 ;
  plus que la moitié, parce qu'une tribune chante : les m. 9–12 de A et de B scandent.
"""
from moteur.ecriture import *
from partitions._fusible import phrase, Arc

theme = Theme('match', 'La Rive', bpm=124, mesure='4/4', tonalite='la mineur', graine=1974,
              ville=False, moment='le samedi au stade, le match',
              humeur='la poussée : une tribune qui chante, le tambour, les cuivres qui répondent')

TON = 'la mineur'

arc = Arc(theme)
# l'équilibre d'origine des quatre voix de l'arc (la calibration corrigée des synthés a baissé
# ses voix aiguës plus que son grésillement) : comme dans le thème principal
for _voix, _db in ((arc.zap, 4.5), (arc.clics, 3.4), (arc.ton, 2.7), (arc.bzz, 0.8)):
    _voix.reglages['volume'] = _voix.reglages.get('volume', 0.0) + _db
# --- la tribune ----------------------------------------------------------------------
foule = theme.piste('foule', art='ah', pan=-0.25, volume=6)
foule2 = theme.piste('foule2', 'foule', art='ah', pan=0.3, volume=4)       # la tribune d'en face
rumeur = theme.piste('rumeur', 'foule', art='rumeur', volume=-10)
mains = theme.piste('mains', 'applaudissements', art='mesure', volume=-2)
ovation = theme.piste('ovation', 'applaudissements', art='ovation', volume=2)
gcaisse = theme.piste('gcaisse', 'grosse_caisse', volume=-7)               # le tambour de tribune
caisse = theme.piste('caisse', 'caisse_claire', volume=-6)
caisse_roul = theme.piste('caisse_roul', 'caisse_claire', art='roulement', volume=-8)
taiko = theme.piste('taiko', volume=-7, eq={'passe_haut': 40})
timbales = theme.piste('timbales', volume=-2)
timb_roul = theme.piste('timb_roul', 'timbales', art='roulement', volume=-4)
cymbales = theme.piste('cymbales', volume=-2)
suspendue = theme.piste('suspendue', 'cymbale_suspendue', volume=-8)
# --- les cuivres -----------------------------------------------------------------------
cors = theme.piste('cors', art='tenu', volume=1)
trombones = theme.piste('trombones', art='tenu', volume=1)
tuba = theme.piste('tuba', volume=-4)
trompettes = theme.piste('trompettes', art='tenu', volume=2)
trompettes2 = theme.piste('trompettes2', 'trompettes', art='tenu', unisson=1, pan=0.4, volume=0)
braam = theme.piste('braam', volume=-5)
cuivre_s = theme.piste('cuivre_s', 'cuivre_synthe', volume=-12)
# --- les cordes ------------------------------------------------------------------------
violons = theme.piste('violons', volume=-1)
violons2 = theme.piste('violons2', 'violons', pan=-0.22, volume=-1)
altos = theme.piste('altos', bref=0.18, volume=1)
celles = theme.piste('celles', 'violoncelles', bref=0.18, volume=-2)
celles_chant = theme.piste('celles_chant', 'violoncelles', art='tenu', pan=0.25, volume=0)
basses = theme.piste('basses', 'basses_film', volume=-6)
# --- le grain --------------------------------------------------------------------------
sub = theme.piste('sub', 'sub_synthe', volume=-16)
effets = theme.piste('effets', volume=-6)


def nuances(s, **niveaux):
    """La nuance de chaque piste au début de la section."""
    for nom_piste, v in niveaux.items():
        s.nuance(theme.pistes[nom_piste], v, 0)


# =====================================================================================
# Le matériau

MOTIF = phrase('motif', TON, octave=3)        # la3 mi4 | fa4 ── ── do4 si3 | ré4 la3 ──
REPONSE = phrase('reponse', TON, octave=3)
MONTEE = phrase('montee', TON, octave=3)
TETE = phrase('tete', TON, octave=3)
ANACROUSE = phrase('anacrouse', TON, octave=3)
# le contre-chant des trompettes : il bouge quand la foule tient ; sa tête monte fa sol LA
# (la montée en miniature, la promesse du but)
CONTRE = mel('r:1 F5:.5 G5:.5 A5:1.5 G5:.5 | A5:2 E5:1 r:1 | r:1 F5:.5 G5:.5 C6:1 B5:1 | A5:2 E5:1 r:1')
CONTRE2 = mel('r:1 C5:.5 D5:.5 F5:1.5 D5:.5 | E5:2 C5:1 r:1 | r:1 C5:.5 D5:.5 A5:1 G5:1 | E5:2 C5:1 r:1')

RACINES = {'i': 'A', 'I': 'A', 'i5': 'A', 'bVI': 'F', 'bvi': 'F', 'bVII': 'G', 'bVII5': 'G', 'iv': 'D'}
# 'VI' = ♭VI trois temps puis ♭VII à vide (sous « do si ») ; 'VI7' = ♭VI puis ♭VII, deux temps
# chacun (la montée) ; 'VIi4', 'ivi4' = ♭VI ou iv trois temps puis la quinte à vide (le canon)
CELLULES = {'VI': ['bVI', 'bVI', 'bVI', 'bVII5'], 'VI7': ['bVI', 'bVI', 'bVII', 'bVII'],
            'VIi4': ['bVI', 'bVI', 'bVI', 'i5'], 'ivi4': ['iv', 'iv', 'iv', 'i5']}


def temps_accords(mesures):
    sortie = []
    for c in mesures:
        sortie += CELLULES.get(c, [c] * 4)
    return sortie


def plages(temps):
    sortie = []
    for i, c in enumerate(temps):
        if sortie and sortie[-1][2] == c:
            d, l, _ = sortie[-1]
            sortie[-1] = (d, l + 1, c)
        else:
            sortie.append((i, 1, c))
    return sortie


def racine(ch, octave):
    h = hauteur(f'{RACINES[ch]}{octave}')
    return h + 12 if h < hauteur('E1') else h


def voicing(ch, grave):
    g = hauteur(grave)
    sortie = set()
    for h in accord(ch, TON, octave=2):
        while h < g:
            h += 12
        sortie.add(h)
    return sorted(sortie)


def nappe(s, piste, temps, grave, vel=70, art=None, de=0, jusqua=None):
    fin = len(temps) if jusqua is None else jusqua
    for d, l, c in plages(temps):
        if d < de or d >= fin:
            continue
        for h in voicing(c, grave):
            s.note(piste, h, d, min(l, fin - d), vel=vel, art=art)


def fondamentales(s, piste, temps, octave, vel=80, art=None, de=0, jusqua=None, maxi=None):
    fin = len(temps) if jusqua is None else jusqua
    for d, l, c in plages(temps):
        if d < de or d >= fin:
            continue
        s.note(piste, racine(c, octave), d, min(l, fin - d, maxi or l), vel=vel, art=art)


def pulsations(s, piste, accords_mes, grave, vel=90, de=1, derniere=4):
    """Les accords pulsés en croches, accents 3+3+2 (la dernière mesure s'arrête après
    `derniere` temps)."""
    for k, c in enumerate(accords_mes):
        m = de + k
        rythme = 'X x x X x x X x'.split()[:2 * (derniere if k == len(accords_mes) - 1 else 4)]
        for h in voicing(c, grave):
            s.joue(piste, grille(' '.join(rythme), h, pas=0.5, vel=vel), a=s.m(m), art='staccato')


def arpeges(s, piste, accords_mes, depart, de=1, vel=90, derniere=4):
    """Des arpèges de doubles croches qui montent : la vague commence plus haut toutes les
    deux mesures."""
    for k, c in enumerate(accords_mes):
        b = depart + k // 2
        rangs = [b, b + 1, b + 2, b + 3, b + 1, b + 2, b + 3, b + 4,
                 b + 2, b + 3, b + 4, b + 5, b + 3, b + 4, b + 5, b + 4]
        if k == len(accords_mes) - 1:
            rangs = rangs[:4 * derniere]
        s.joue(piste, arpege(voicing(c, 'A3'), [str(r) for r in rangs], pas=0.25, vel=vel,
                             art='staccato'), a=s.m(de + k))


# le tambour de tribune : des croches groupées 3+3+2, et ses relances
TAMBOUR = 'K : X . x . x . X . x . x . X . x .'
TAMBOUR2 = 'K : X . x . x . X . x . x . X . X x'
RELANCE = 'K : X . x . X . x . X x X x X X X X'


def tambour(s, de, a, vel=96, relance=True):
    """Le tambour de tribune de la mesure `de` à la mesure `a` (comprise) ; une relance
    toutes les quatre mesures."""
    for m in range(de, a + 1):
        motif = RELANCE if relance and (m - de) % 4 == 3 else (TAMBOUR if (m - de) % 2 == 0 else TAMBOUR2)
        s.batterie(gcaisse, motif, a=s.m(m), jusqua=s.m(m + 1), vel=vel)


def mains_2_4(s, de, jusqua, vel=100):
    """La tribune frappe dans ses mains sur 2 et 4, de la mesure `de` jusqu'à `jusqua`."""
    b = s.m(de, 2)
    while b < jusqua - 1e-9:
        s.note(mains, 'C4', b, 0.5, vel=vel)
        b += 2


def foule_chante(s, piste, motif, a, vel=100, cuivres=False):
    """La tribune chante (la2–la3), doublée par les violoncelles ; `cuivres` : les cors et
    les trombones avec elle (au but)."""
    s.joue(piste, motif.octave(-1), a=a, vel=vel)
    s.joue(celles_chant, motif.octave(-1), a=a, vel=vel - 10)
    if cuivres:
        s.joue(cors, motif, a=a, vel=vel + 6)
        s.joue(trombones, motif.octave(-1), a=a, vel=vel + 2)


def cris(s, de, a, h='A2', vel=96):
    """La tribune scande sans chanter : « hé » sur les appuis 3+3+2 du tambour (une seule
    note, pas un air)."""
    for m in range(de, a + 1):
        for b in (1, 2.5, 4):
            s.note(foule, h, s.m(m, b), 0.5, vel=vel if b == 1 else vel - 8)


def tete_cuivres(s, a, vel=104):
    """Les cuivres graves répondent par la tête (trombones, cors à l'octave, le tuba sur le
    fa)."""
    s.joue(trombones, TETE.octave(-1), a=a, vel=vel)
    s.joue(cors, TETE, a=a, vel=vel - 4)
    s.note(tuba, 'F1', a + 1, 3, vel=vel - 6)


def cymbale_vers(s, fin, art='monte_4s', vel=96):
    secondes = {'monte_2s': 2.0, 'monte_4s': 4.0, 'monte_7s': 7.0}[art]
    s.note(suspendue, 'C4', fin - secondes * 124 / 60, secondes * 124 / 60, vel=vel, art=art)


def roulement(s, piste, h, de, a, nd, na, vel=90):
    s.note(piste, h, de, a - de, vel=vel)
    s.expression(piste, [(de, nd), (a, na)])


# =====================================================================================
# Les sections

@theme.section('intro', mesures=8)
def intro(s):
    arc.poser(s, 0)
    accs = ['i', 'i', 'bVI', 'bVI', 'i', 'i', 'bVI', 'bVII']
    t = temps_accords(accs)
    silence = s.m(8, 4)
    nuances(s, cors='mp', trombones='mp', basses='p', celles='p', violons='p', rumeur='p', gcaisse='fff')
    # la pédale de la (contrebasses, violoncelles, sous-basse), la rumeur du stade
    s.note(basses, 'A1', 0, silence, vel=78, art='tenu')
    s.note(celles, 'A2', 0, silence, vel=72, art='tremolo')
    s.note(sub, 'A1', 0, silence, vel=64)
    s.expression(basses, [(0, 'p'), (silence, 'f')])
    s.expression(celles, [(0, 'pp'), (silence, 'mf')])
    s.note(rumeur, 'A2', 0, silence, vel=70)
    s.expression(rumeur, [(0, 'p'), (silence, 'f')])
    # les accords pulsés des cuivres et les arpèges qui montent
    pulsations(s, cors, accs, 'C4', vel=84, derniere=3)
    pulsations(s, trombones, accs, 'E3', vel=84, derniere=3)
    s.expression(cors, [(0, 'p'), (s.m(8, 3), 'f')])
    s.expression(trombones, [(0, 'p'), (s.m(8, 3), 'f')])
    arpeges(s, violons, accs, 1, vel=90, derniere=3)
    s.expression(violons, [(0, 'p'), (s.m(8, 3), 'f')])
    nappe(s, violons2, t, 'E4', vel=74, art='tremolo', jusqua=silence)
    s.expression(violons2, [(0, 'pp'), (silence, 'mf')])
    # le tambour de tribune entre à la mesure 5 ; roulements, cymbale, montée
    tambour(s, 5, 7, vel=88, relance=False)
    s.batterie(gcaisse, 'K : X . x . X . x . X X X X . . . .', a=s.m(8), jusqua=s.m(9), vel=96)
    roulement(s, timb_roul, 'A2', s.m(5), silence, 'p', 'ff', vel=90)
    roulement(s, caisse_roul, 'S', s.m(5), silence, 'p', 'ff', vel=80)
    cymbale_vers(s, silence, 'monte_4s', vel=96)
    s.note(effets, 'A3', s.m(7), 7, vel=100, art='montee')
    # le dernier temps : silence, la tribune et les cuivres chantent « fu-si »
    s.joue(foule, ANACROUSE.octave(-1), a=silence, vel=108)
    s.joue(trombones, ANACROUSE.octave(-1), a=silence, vel=104)
    s.joue(cors, ANACROUSE, a=silence, vel=100)
    s.joue(celles_chant, ANACROUSE.octave(-1), a=silence, vel=96)


# --- A : chant A, la tribune mène -----------------------------------------------------------
GRILLE_A = ['VI', 'i', 'bVI', 'i', 'VI', 'i', 'bVI', 'bVII', 'bVI', 'i', 'bVI', 'i', 'VI', 'i', 'bVI', 'bVII']


@theme.section('A', mesures=16)
def A(s):
    t = temps_accords(GRILLE_A)
    nuances(s, foule='f', celles_chant='mf', cors='f', trombones='f', tuba='mf', basses='mf', celles='mf', gcaisse='fff',
            violons2='p', altos='p', caisse='mp')
    # la tribune : motif (m. 1, son anacrouse au dernier temps d'avant), réponse (m. 5) ;
    # m. 9–12 elle scande sans chanter (les trompettes pulsent) ; réponse (m. 13) ; les
    # cuivres répondent par la tête aux m. 3, 7, 15
    foule_chante(s, foule, MOTIF.coupe(1, MOTIF.longueur), 0)
    foule_chante(s, foule, REPONSE, s.m(5) - 1)
    foule_chante(s, foule, REPONSE, s.m(13) - 1)
    for m in (3, 7, 15):
        tete_cuivres(s, s.m(m) - 1, vel=100 if m < 11 else 106)
    cris(s, 9, 12)
    pulsations(s, trompettes, ['bVI', 'i', 'bVI', 'i'], 'C5', vel=80, de=9)
    s.expression(trompettes, [(s.m(9), 'p'), (s.m(12, 4), 'mp')])
    s.joue(foule, ANACROUSE.octave(-1), a=s.m(16, 4), vel=104)      # le canon de B commence
    # la pédale de la, en croches comme le tambour ; les cordes tiennent l'harmonie au-dessus
    for m in range(1, 17):
        s.joue(celles, grille('X . x . x . X . x . x . X . x .', 'A2', vel=86), a=s.m(m), art='staccato')
        s.joue(basses, grille('X . . . . . X . . . . . X . . .', 'A1', vel=92), a=s.m(m), art='staccato')
    s.note(sub, 'A1', 0, s.longueur, vel=60)
    nappe(s, violons2, t, 'C5', vel=70, art='tremolo')
    nappe(s, altos, t, 'A3', vel=66, art='tremolo')
    # le tambour, les mains, la caisse claire sur les accents
    tambour(s, 1, 16)
    mains_2_4(s, 1, s.m(17))
    s.batterie(caisse, 'S : . . . . x . . . . . . . x . . o', a=0, jusqua=s.longueur, vel=80)
    s.note(cymbales, 'C4', 0, 2, vel=104)
    s.note(braam, 'F2', 0, 2.5, vel=110)
    s.note(timbales, 'F2', 0, 1, vel=110)
    s.note(cymbales, 'C4', s.m(9), 2, vel=92)


# --- B : chant B, les deux tribunes en canon --------------------------------------------------
GRILLE_B = ['VIi4', 'ivi4', 'VIi4', 'ivi4', 'VI', 'i', 'VI', 'i',
            'bVI', 'iv', 'bVI', 'iv', 'VI', 'i', 'bVI', 'bVII']


@theme.section('B', mesures=16)
def B(s):
    t = temps_accords(GRILLE_B)
    nuances(s, foule='f', foule2='f', celles_chant='mf', trompettes='mf', trompettes2='mf', cors='mp',
            gcaisse='fff', trombones='mp', tuba='mf', basses='mf', celles='mf', altos='mp', violons2='p')
    # le canon : la tribune de gauche (m. 1, 3), celle d'en face une mesure plus tard ; aux
    # m. 9–12, elles scandent, les arpèges montent, les trombones pulsent
    for m in (1,):
        a = 0 if m == 1 else s.m(m) - 1
        motif = MOTIF.coupe(1, MOTIF.longueur) if m == 1 else MOTIF
        s.joue(foule, motif.octave(-1), a=a, vel=100)
        s.joue(foule2, MOTIF.octave(-1), a=s.m(m + 1) - 1, vel=98)
        s.joue(foule, MOTIF.octave(-1), a=s.m(m + 2) - 1, vel=102)
        s.joue(foule2, MOTIF.octave(-1), a=s.m(m + 3) - 1, vel=100)
    # m. 5–8 et 13–16 : la fanfare des trompettes, la tribune tape dans ses mains
    s.joue(trompettes, CONTRE, a=s.m(5), vel=100)
    s.joue(trompettes2, CONTRE2, a=s.m(5), vel=94)
    s.joue(trompettes, CONTRE.coupe(0, 8), a=s.m(13), vel=104)
    s.joue(trompettes2, CONTRE2.coupe(0, 8), a=s.m(13), vel=98)
    for m in (15,):
        tete_cuivres(s, s.m(m) - 1, vel=100)
    cris(s, 9, 12, vel=100)
    arpeges(s, violons, ['bVI', 'iv', 'bVI', 'iv'], 2, de=9, vel=86)
    s.expression(violons, [(s.m(9), 'mp'), (s.m(12, 4), 'f')])
    pulsations(s, trombones, ['bVI', 'iv', 'bVI', 'iv'], 'F3', vel=82, de=9)
    # l'harmonie : les cors tiennent, les fondamentales en croches aux violoncelles
    nappe(s, cors, t, 'C4', vel=76, art='tenu')
    fondamentales(s, tuba, t, 1, vel=80)
    for d, l, c in plages(t):
        for k in range(int(l * 2)):
            s.note(celles, racine(c, 2) + (12 if k % 4 == 3 else 0), d + 0.5 * k, 0.5,
                   vel=88 if k % 2 == 0 else 74, art='staccato')
    fondamentales(s, basses, t, 1, vel=84, art='tenu')
    nappe(s, violons2, t, 'C5', vel=72, art='tremolo')
    nappe(s, altos, t, 'F3', vel=68, art='tremolo')
    # les tambours : taïkos et tambour de tribune, les mains ; la fin s'éteint vers T
    tambour(s, 1, 14)
    s.batterie(gcaisse, 'K : X . x . x . X . x . . . . . . .', a=s.m(15), jusqua=s.m(16), vel=90)
    s.batterie(gcaisse, 'K : X . . . . . . . x . . . . . . .', a=s.m(16), jusqua=s.m(17), vel=80)
    for m in range(1, 15):
        s.joue(taiko, grille('X . . . . . x . X . . . . . . .', 'A2', vel=96), a=s.m(m))
        s.joue(taiko, grille('. . . x . . . . . . . x . . x .', 'E3', vel=86), a=s.m(m))
    mains_2_4(s, 1, s.m(15))
    s.note(cymbales, 'C4', 0, 2, vel=100)
    s.note(cymbales, 'C4', s.m(5), 2, vel=96)
    s.note(cymbales, 'C4', s.m(9), 2, vel=96)
    s.expression(trompettes, [(0, 'mf'), (s.m(15), 'mf'), (s.m(16, 4), 'p')])


# --- T : la tension ----------------------------------------------------------------------------
@theme.section('T', mesures=8)
def T(s):
    nuances(s, basses='mp', celles='mp', violons='p', altos='mp', foule='mp', rumeur='mf', gcaisse='mf')
    # la pédale de la ; au-dessus, la mineur et fa majeur (le ♭VI de la fiche), puis une fois fa
    # mineur, à la m. 7 (deux mineurs à une tierce : la menace, au plus fort de l'attente)
    s.note(basses, 'A1', 0, s.longueur, vel=76, art='tremolo')
    s.note(sub, 'A1', 0, s.longueur, vel=62)
    s.note(celles, 'A2', 0, s.longueur, vel=74, art='tremolo')
    for m, notes in ((1, ('A5', 'C6', 'E6')), (3, ('A5', 'C6', 'F6')), (5, ('A5', 'C6', 'E6')),
                     (7, ('Ab5', 'C6', 'F6'))):
        for h in notes:
            s.note(violons, h, s.m(m), 8, vel=72, art='tremolo')
    for m, notes in ((1, ('E4', 'A4')), (3, ('F4', 'A4')), (5, ('E4', 'A4')), (7, ('F4', 'Ab4'))):
        for h in notes:
            s.note(altos, h, s.m(m), 8, vel=70, art='tremolo')
    s.expression(violons, [(0, 'p'), (s.m(8, 4), 'mf')])
    # la tribune retient son souffle : la rumeur, et la tête fredonnée en valeurs doublées
    s.note(rumeur, 'A2', 0, s.longueur, vel=84)
    s.joue(foule, TETE.augmente(2).octave(-1), a=s.m(3) - 2, vel=80, art='o')
    s.joue(foule, TETE.augmente(2).octave(-1), a=s.m(7) - 2, vel=86, art='o')
    # un cœur (la grosse caisse étouffée), puis les roulements
    for m in range(1, 9):
        s.batterie(gcaisse, 'K : X . . x . . . . . . . . . . . .', a=s.m(m), jusqua=s.m(m + 1), vel=84)
    roulement(s, timb_roul, 'A2', s.m(7), s.m(9), 'pp', 'f', vel=84)
    roulement(s, caisse_roul, 'S', s.m(8), s.m(9), 'p', 'f', vel=76)


# --- C : le but ----------------------------------------------------------------------------------
GRILLE_C = ['bVI', 'bVII', 'bVI', 'bVII', 'VI', 'i', 'VI', 'i', 'VI', 'i', 'VI', 'i', 'VI', 'i', 'VI7', 'I']


@theme.section('C', mesures=16)
def C(s):
    t = temps_accords(GRILLE_C)
    silence = s.m(4, 4)
    nuances(s, trompettes='mp', trompettes2='mp', trombones='mp', violons='mp', celles='mf', basses='f', gcaisse='fff',
            altos='mf', violons2='mp', tuba='f', foule='f', celles_chant='f', cors='f')
    # m. 1–4 : la montée
    pulsations(s, trompettes, ['bVI', 'bVII', 'bVI', 'bVII'], 'A4', vel=84, derniere=3)
    pulsations(s, trombones, ['bVI', 'bVII', 'bVI', 'bVII'], 'F3', vel=84, derniere=3)
    s.expression(trompettes, [(0, 'p'), (s.m(4, 3), 'mf'), (s.m(5), 'mf')])
    s.expression(trombones, [(0, 'mp'), (s.m(4, 3), 'f'), (s.m(4, 4), 'f')])
    arpeges(s, violons, ['bVI', 'bVII', 'bVI', 'bVII'], 3, vel=92, derniere=3)
    s.expression(violons, [(0, 'mp'), (s.m(4, 3), 'f'), (s.m(5), 'mf')])
    for m, c in enumerate(['bVI', 'bVII', 'bVI', 'bVII'], start=1):
        n = 3 if m == 4 else 4
        s.joue(celles, ostinato([racine(c, 2), racine(c, 2), racine(c, 3), racine(c, 2)] * 4, pas=0.25,
                                accents='X x x X x x X x X x x X x x X x', vel=88).coupe(0, n), a=s.m(m),
               art='staccato')
        s.note(basses, racine(c, 1), s.m(m), n, vel=96, art='tenu')
    for m in (1, 2, 3):
        s.joue(taiko, grille('X . x . X . x . X x x x X . x x', ['A2', 'E3'], vel=104), a=s.m(m))
    s.joue(taiko, grille('X x x x X x x x X X X X', ['A2', 'E3'], vel=112), a=s.m(4))
    roulement(s, caisse_roul, 'S', 0, silence, 'mp', 'ff', vel=84)
    cymbale_vers(s, silence, 'monte_4s', vel=100)
    s.note(effets, 'E4', s.m(3), 7, vel=104, art='montee')
    # le silence : l'arc, et « fu-si »
    arc.poser(s, silence, impact=False, vel=122)
    for p, mo, v in ((foule, ANACROUSE.octave(-1), 110), (cors, ANACROUSE, 106),
                     (trombones, ANACROUSE.octave(-1), 106), (celles_chant, ANACROUSE.octave(-1), 98)):
        s.joue(p, mo, a=silence, vel=v)
    # m. 5–16 : tout le monde chante ; la montée, la majeur, l'ovation
    s.note(arc.impact, 'A1', s.m(5), 2, vel=116, art='impact')
    s.note(braam, 'F2', s.m(5), 3, vel=124)
    s.note(cymbales, 'C4', s.m(5), 2, vel=122)
    s.note(timbales, 'F2', s.m(5), 1, vel=120)
    for k, u in enumerate([MOTIF, REPONSE, MOTIF, REPONSE, MOTIF, MONTEE]):
        m = 5 + 2 * k
        motif = u.coupe(1, u.longueur) if m == 5 else u
        a = s.m(m) if m == 5 else s.m(m) - 1
        foule_chante(s, foule, motif, a, vel=108, cuivres=True)
        s.joue(foule2, motif.octave(-1), a=a, vel=100)
    s.joue(trompettes, CONTRE + CONTRE + CONTRE.coupe(0, 8), a=s.m(5), vel=100)
    s.joue(trompettes2, CONTRE2 + CONTRE2 + CONTRE2.coupe(0, 8), a=s.m(5), vel=94)
    for h in ('A4', 'C#5', 'E5', 'A5'):
        s.note(trompettes if h in ('A5', 'E5') else trompettes2, h, s.m(16), 4, vel=118)
    nappe(s, violons2, t, 'C5', vel=84, art='tremolo', de=s.m(5))
    nappe(s, violons, t, 'A5', vel=84, art='tremolo', de=s.m(5))
    nappe(s, altos, t, 'A3', vel=80, art='tremolo', de=s.m(5))
    for m in range(5, 16):
        r4 = [racine(c, 2) for c in t[(m - 1) * 4:m * 4]]
        s.joue(celles, ostinato([r4[i // 4] + (12 if i % 4 == 3 else (7 if i % 8 == 6 else 0))
                                 for i in range(16)], pas=0.25,
                                accents='X x x X x x X x X x x X x x X x', vel=90), a=s.m(m), art='staccato')
    fondamentales(s, basses, t, 1, vel=96, art='tenu', de=s.m(5))
    fondamentales(s, tuba, t, 1, vel=100, de=s.m(5), maxi=4)
    fondamentales(s, sub, t, 1, vel=70, de=s.m(5), maxi=4)
    fondamentales(s, cuivre_s, t, 2, vel=88, de=s.m(5, 2), maxi=4)
    tambour(s, 5, 15, vel=104)
    mains_2_4(s, 5, s.m(16), vel=108)
    for m in (9, 13):
        s.note(braam, 'F2', s.m(m), 2.5, vel=114)
        s.note(cymbales, 'C4', s.m(m), 2, vel=106)
    for m in range(5, 15, 2):
        s.note(timbales, 'F2', s.m(m), 1, vel=112)
        s.note(timbales, 'A2', s.m(m + 1), 1, vel=106)
    roulement(s, timb_roul, 'G2', s.m(15, 3), s.m(16), 'f', 'ff', vel=100)
    # la majeur : le but ; l'ovation
    s.note(braam, 'A2', s.m(16), 3, vel=126)
    s.note(cymbales, 'C4', s.m(16), 2, vel=124)
    s.note(timbales, 'A2', s.m(16), 1, vel=124)
    s.note(gcaisse, 'K', s.m(16), 1, vel=124)
    s.note(ovation, 'C4', s.m(16), 8, vel=110)
    for p in (foule, foule2, cors, trombones, celles_chant, trompettes, trompettes2, violons, violons2):
        s.expression(p, [(s.m(16), 'ff'), (s.m(16, 4.9), 'mf')])


# --- A2 : la retombée, puis la fanfare de 1990 -------------------------------------------------
GRILLE_A2 = ['i', 'bVI', 'i', 'bVII', 'i', 'i', 'VI', 'i', 'VI', 'i', 'bVI', 'bVII', 'bVI', 'bVII', 'bVI',
             'bVII']
DEFILE = 'S : X . x x X . x . X . x x X x x .'
DEFILE2 = 'S : X . x x X . x . X x x . X . x x'


@theme.section('A2', mesures=16)
def A2(s):
    t = temps_accords(GRILLE_A2)
    nuances(s, foule='mp', basses='mp', celles='mp', tuba='fff', trompettes='f', trompettes2='mf', gcaisse='f',
            trombones='mf', cors='mp', caisse='mf', violons2='p', rumeur='mp')
    # m. 1–4 : l'ovation s'éteint, la tribune fredonne la tête, le tambour reprend doucement
    s.note(ovation, 'C4', 0, 4, vel=84)
    s.note(rumeur, 'A2', 0, s.m(5), vel=76)
    s.joue(foule, TETE.octave(-1), a=s.m(2) - 1, vel=84, art='o')
    s.joue(foule, TETE.octave(-1), a=s.m(4) - 1, vel=88, art='o')
    s.note(basses, 'A1', 0, 4, vel=84, art='tenu')
    s.note(celles, 'A2', 0, 4, vel=78, art='tenu')
    for m in range(1, 5):
        s.batterie(gcaisse, 'K : X . . . x . . . X . . . x . . .', a=s.m(m), jusqua=s.m(m + 1),
                   vel=80 + 4 * m)
    nappe(s, violons2, t, 'C5', vel=70, art='tremolo', jusqua=s.m(5))
    # m. 5–16 : la fanfare : défilé, poum-pa, les trompettes chantent le motif
    for m in range(5, 15):
        s.batterie(caisse, DEFILE if m % 2 else DEFILE2, a=s.m(m), jusqua=s.m(m + 1), vel=90)
    roulement(s, caisse_roul, 'S', s.m(15), s.m(17), 'mf', 'f', vel=84)
    s.batterie(gcaisse, 'K : X . . . . . . . X . . . . . . .', a=s.m(5), jusqua=s.m(15), vel=94)
    for b in range(int(s.m(5)), int(s.m(15))):
        c = t[b]
        if b % 2 == 0:
            s.note(tuba, racine(c, 1), b, 1, vel=96, art='staccato')
        else:
            for h in voicing(c, 'E3'):
                s.note(trombones, h, b, 0.5, vel=84, art='staccato')
    s.joue(trompettes, MOTIF.octave(1), a=s.m(7) - 1, vel=100)
    s.joue(trompettes, REPONSE.octave(1), a=s.m(9) - 1, vel=102)
    s.joue(trompettes2, MOTIF, a=s.m(7) - 1, vel=88)
    s.joue(trompettes2, REPONSE, a=s.m(9) - 1, vel=90)
    nappe(s, cors, t, 'C4', vel=74, art='tenu', de=s.m(5))
    for d, l, c in plages(t[int(s.m(5)):]):
        for k in range(int(l * 2)):
            s.note(celles, racine(c, 2) + (12 if k % 2 else 0), s.m(5) + d + 0.5 * k, 0.5,
                   vel=86 if k % 2 == 0 else 76, art='staccato')
    fondamentales(s, basses, t, 1, vel=80, art='tenu', de=s.m(5))
    mains_2_4(s, 5, s.m(15), vel=96)
    s.note(cymbales, 'C4', s.m(5), 2, vel=96)
    s.note(cymbales, 'C4', s.m(11), 2, vel=92)
    # m. 13–16 : la relance vers la contre-attaque (la tête aux cuivres graves)
    tete_cuivres(s, s.m(13) - 1, vel=98)
    for m in range(13, 17):
        s.joue(taiko, grille('X . . . x . . . X . x . X . x x', ['A2', 'E3'], vel=96 + 2 * (m - 13)), a=s.m(m))
    s.note(effets, 'A3', s.m(15), 8, vel=96, art='montee')


# --- B2 : la contre-attaque -------------------------------------------------------------------------
@theme.section('B2', mesures=8)
def B2(s):
    accs = ['bVI', 'bVII', 'bVI', 'bVII', 'bVI', 'bVII', 'bVI', 'bVII']
    t = temps_accords(accs)
    silence = s.m(8, 4)
    nuances(s, foule='f', cors='f', trombones='f', tuba='mf', basses='f', celles='f', violons='mf', gcaisse='fff',
            violons2='mp', trompettes='mp')
    for m, v in ((1, 100), (3, 106), (5, 112)):
        a = 0 if m == 1 else s.m(m) - 1
        tete = TETE.coupe(1, TETE.longueur) if m == 1 else TETE
        s.joue(foule, tete.octave(-1), a=a, vel=v)
        s.joue(cors, tete, a=a, vel=v)
        s.joue(trombones, tete.octave(-1), a=a, vel=v - 4)
    pulsations(s, trompettes, accs, 'C5', vel=82, derniere=3)
    arpeges(s, violons, accs, 2, vel=92, derniere=3)
    s.expression(violons, [(0, 'mf'), (s.m(8, 3), 'f')])
    s.expression(trompettes, [(0, 'p'), (s.m(8, 3), 'mp')])
    for m, c in enumerate(accs, start=1):
        n = 3 if m == 8 else 4
        s.joue(celles, ostinato([racine(c, 2), racine(c, 2), racine(c, 3), racine(c, 2)] * 4, pas=0.25,
                                accents='X x x X x x X x X x x X x x X x', vel=90).coupe(0, n), a=s.m(m),
               art='staccato')
        s.note(basses, racine(c, 1), s.m(m), n, vel=96, art='tenu')
        s.note(tuba, racine(c, 1), s.m(m), n, vel=88)
    nappe(s, violons2, t, 'C5', vel=80, art='tremolo', jusqua=silence)
    for m in range(1, 7):
        s.joue(taiko, grille('X . x . X . x . X x x x X . x x', ['A2', 'E3'], vel=100 + m), a=s.m(m))
    s.joue(taiko, grille('X x x x X x x x X x x x X X X X', ['A2', 'E3'], vel=112), a=s.m(7))
    s.joue(taiko, grille('X X X X X X X X X X X X', ['A2', 'E3'], vel=118), a=s.m(8))
    tambour(s, 1, 7, vel=100)
    roulement(s, caisse_roul, 'S', s.m(5), silence, 'p', 'ff', vel=84)
    roulement(s, timb_roul, 'G2', s.m(7), silence, 'mp', 'ff', vel=96)
    cymbale_vers(s, silence, 'monte_4s', vel=96)
    s.note(effets, 'A3', s.m(7), 7, vel=104, art='montee')
    # le silence, et « fu-si » : la boucle repart sur le chant A
    for p, mo, v in ((foule, ANACROUSE.octave(-1), 108), (cors, ANACROUSE, 104),
                     (trombones, ANACROUSE.octave(-1), 104), (celles_chant, ANACROUSE.octave(-1), 96)):
        s.joue(p, mo, a=silence, vel=v)


theme.forme(intro=['intro'], corps=['A', 'B', 'T', 'C', 'A2', 'B2'])
