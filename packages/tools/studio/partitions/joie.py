"""FUSIBLE — « La Montée » (joie) : un bilan tenu, une montée, un titre, une coupe.

La ville fait la fête au bord de la nuit : la fanfare municipale descend la rue, la place
chante le motif « Fusible » en majeur, deux pieds et une main sur les gradins de bois.
Le relatif du stade (do majeur, l'armure de la mineur), couleur mixolydienne : des accords
majeurs volés au mineur (♭VII, ♭VI). Le motif en majeur : do sol | LA ── mi ré | fa do ── ;
la sixte n'est plus une mèche, c'est une lumière (sur IV) ; « fa do » = ♭VII → I. La montée
deux fois : en mixolydien (la si♭ DO, au premier refrain) et volée au mineur (la♭ si♭ DO,
la cadence de la victoire : l'introduction, le grand refrain, la finale). Le pont se
souvient du stade : le motif dans son habit d'origine, en la mineur, aux violoncelles.

LA CARTE (120 à la noire, une mesure = 2 s ; le corps boucle : 128 mesures, 256 s)
  intro  4 m.        l'ARC ; la fanfare : « fu-si », la♭ si♭ | DO (♭VI ♭VII | I), puis les
                     coups I ♭VII IV en 3+3+2 (deux pieds, une main)                      7
  V1    16 m.  0:00  couplet : la basse qui saute d'une octave (3+3+2), les pizz, les
                     mains légères ; le motif aux cors et aux clarinettes (m. 5–8) ; la
                     réplique des bois (m. 13–16) qui mène au refrain                     5
  R1    16 m.  0:32  refrain : la place chante la phrase (motif, réponse, motif, montée
                     mixolydienne), les cors avec elle, les trompettes dans ses soupirs ;
                     deux pieds, une main ; la réplique aux trompettes ; les coups, l'arrêt  8
  W1     8 m.  1:04  la fenêtre : la basse pp, une nappe en sixte ; la tête au
                     glockenspiel, son écho à la harpe                                    2
  V2    16 m.  1:20  la fanfare de 1990 : la marche des trompettes (en tierces), le poum-pa
                     du tuba et des trombones, la caisse de défilé ; les cors appellent la
                     tête ; la fanfare s'éloigne                                          6
  P     16 m.  1:52  le pont, au bord de la nuit : la mineur, les violoncelles se
                     souviennent du stade (le motif d'origine) ; la remontée : la♭ si♭, la
                     tête volée aux cors puis aux trompettes, les arpèges qui montent  5 → 7
  R2    16 m.  2:24  le grand refrain : trois familles à l'unisson, le chœur ; un silence,
                     l'ARC, « fu-si » a cappella ; la montée volée → DO, l'ovation, les
                     cloches ; puis la fête retombe                                   9 → 4
  W2     8 m.  2:56  la fenêtre : la rumeur de la place, au loin ; fa/do → do             2
  V3    16 m.  3:12  le lendemain matin : la harpe, les pizz, les bassons qui sautillent ;
                     le motif à la flûte, la réplique au hautbois                         4
  F     16 m.  3:44  la finale : la fanfare (la♭ si♭ | DO), la place chante le motif et la
                     montée volée, la danse ; les coups relancent le couplet          8 → 6
  Les fenêtres : W1 et W2 (le jeu n'y reprend pas). L'arc : l'intro, le silence de R2.
"""
from moteur.ecriture import *
from moteur.theorie import fondamentale
from partitions._fusible import phrase, Arc

theme = Theme('joie', 'La Montée', bpm=120, mesure='4/4', tonalite='do majeur', graine=1990,
              ville=True, moment='un bilan tenu, une montée, un titre, une coupe : la ville fait la fête',
              humeur='la fête au bord de la nuit : la fanfare, la place qui chante, deux pieds et une main')

TON = 'do majeur'

arc = Arc(theme)
# l'équilibre d'origine des quatre voix de l'arc (la calibration corrigée des synthés a baissé
# ses voix aiguës plus que son grésillement) : comme dans le thème principal
for _voix, _db in ((arc.zap, 4.5), (arc.clics, 3.4), (arc.ton, 2.7), (arc.bzz, 0.8)):
    _voix.reglages['volume'] = _voix.reglages.get('volume', 0.0) + _db
# --- la place -------------------------------------------------------------------------
foule = theme.piste('foule', art='ah', pan=-0.1, volume=3)
rumeur = theme.piste('rumeur', 'foule', art='rumeur', volume=-12)
choeur = theme.piste('choeur', art='aah', volume=-9)
pieds = theme.piste('pieds', 'grosse_caisse', volume=-5)                   # les pieds sur le bois
pieds_t = theme.piste('pieds_t', 'taiko', volume=-12, eq={'passe_haut': 45})
mains = theme.piste('mains', 'applaudissements', art='mesure', volume=-5)                  # la place, sur 4
claps = theme.piste('claps', volume=-14)                                    # les mains légères
ovation = theme.piste('ovation', 'applaudissements', art='ovation', volume=-3)
caisse = theme.piste('caisse', 'caisse_claire', volume=-6)                  # la caisse de défilé
cercle = theme.piste('cercle', 'caisse_claire', art='cercle', volume=-16)
caisse_roul = theme.piste('caisse_roul', 'caisse_claire', art='roulement', volume=-9)
timbales = theme.piste('timbales', volume=-4)
timb_roul = theme.piste('timb_roul', 'timbales', art='roulement', volume=-6)
cymbales = theme.piste('cymbales', volume=-5)
etouffee = theme.piste('etouffee', 'cymbales', art='etouffee', volume=-10)
suspendue = theme.piste('suspendue', 'cymbale_suspendue', volume=-10)
cloches = theme.piste('cloches', volume=-1)
glock = theme.piste('glock', 'glockenspiel', volume=-4)
# --- les cuivres -----------------------------------------------------------------------
trompettes = theme.piste('trompettes', art='tenu', volume=0)
trompettes2 = theme.piste('trompettes2', 'trompettes', art='tenu', pan=0.35, volume=-2)
cors = theme.piste('cors', art='tenu', volume=1)
trombones = theme.piste('trombones', art='tenu', volume=-3)
tuba = theme.piste('tuba', volume=-2)
# --- les bois --------------------------------------------------------------------------
flutes = theme.piste('flutes', art='tenu', volume=4)
hautbois = theme.piste('hautbois', art='tenu', volume=1)
clarinettes = theme.piste('clarinettes', art='tenu', volume=-4)
bassons = theme.piste('bassons', art='staccato', bref=0.15, volume=-3)
# --- les cordes ------------------------------------------------------------------------
violons = theme.piste('violons', volume=-4)
violons2 = theme.piste('violons2', 'violons', pan=-0.2, volume=-6)
altos = theme.piste('altos', volume=-5)
celles = theme.piste('celles', 'violoncelles', bref=0.18, volume=-3)
celles_chant = theme.piste('celles_chant', 'violoncelles', art='tenu', pan=0.25, volume=0)
basses = theme.piste('basses', 'basses_film', volume=0)
harpe = theme.piste('harpe', volume=-2)
# --- le grain --------------------------------------------------------------------------
sub = theme.piste('sub', 'sub_synthe', volume=-18)
effets = theme.piste('effets', volume=-8)


def nuances(s, **niveaux):
    """La nuance de chaque piste au début de la section."""
    for nom_piste, v in niveaux.items():
        s.nuance(theme.pistes[nom_piste], v, 0)


# =====================================================================================
# Le matériau

MOTIF = phrase('motif', TON)                    # do3 sol3 | la3 ── mi3 ré3 | fa3 do3 ──
REPONSE = phrase('reponse', 'do mixolydien')    # do sol | la ── ── si♭ do | sol ──
MONTEE = phrase('montee', 'do mixolydien')      # do sol | la ── si♭ ── | DO
VOLEE = phrase('montee', 'do mineur')           # do sol | la♭ ── si♭ ── | DO : la victoire
TETE = phrase('tete', TON)
TETE_VOLEE = phrase('tete', 'do mineur')        # do sol | la♭ : la mèche, dans la fête
ANACROUSE = phrase('anacrouse', TON)
STADE = phrase('motif', 'la mineur')            # la3 mi4 | fa4 ── do4 si3 | ré4 la3 : le stade
STADE_R = phrase('reponse', 'la mineur')
TETE_STADE = phrase('tete', 'la mineur')
# la réplique des bois : elle monte dans chaque mesure (3+3+2) et sa septième (si♭) se
# résout sur la tierce du refrain (la)
REPLIQUE = mel('E5:1.5 A5:1.5 G5:1 | F5:1.5 A5:1.5 C6:1 | Bb5:1.5 F5:1.5 D5:1 | E5:1.5 G5:1.5 Bb5:1')
REPLIQUE2 = mel('C5:1.5 E5:1.5 E5:1 | C5:1.5 F5:1.5 A5:1 | F5:1.5 D5:1.5 Bb4:1 | C5:1.5 E5:1.5 G5:1')
# la marche de la fanfare de 1990 (huit mesures, sur I ♭VII IV I) : la croche pointée du
# deuxième temps ; la seconde trompette en tierces et en sixtes
MARCHE = mel('G4:1 C5:.75 D5:.25 E5:1 G5:1 | F5:1 D5:.75 C5:.25 Bb4:1 D5:1 | C5:1 A4:.75 Bb4:.25 C5:1 F5:1 | '
             'E5:2 C5:1 r:1 | G4:1 C5:.75 D5:.25 E5:1 A5:1 | Bb5:1 F5:.75 G5:.25 F5:1 D5:1 | '
             'C5:1 F5:.75 G5:.25 A5:1 C6:1 | E5:1 D5:.5 E5:.5 C5:2')
MARCHE2 = mel('E4:1 G4:1 C5:1 E5:1 | D5:1 Bb4:1 F4:1 Bb4:1 | A4:1 F4:1 A4:1 C5:1 | C5:2 G4:1 r:1 | '
              'E4:1 G4:1 C5:1 E5:1 | F5:1 D5:1 D5:1 Bb4:1 | A4:1 C5:1 F5:1 A5:1 | C5:1 Bb4:.5 C5:.5 E4:2')


def temps(grille):
    """Une grille de mesures → un accord par temps : « IV » tient la mesure, « IV V » deux
    temps chacun, « bVII I I I » un par temps."""
    sortie = []
    for c in grille:
        x = c.split()
        for a in x:
            sortie += [a] * (4 // len(x))
    return sortie


def plages(t):
    sortie = []
    for i, c in enumerate(t):
        if sortie and sortie[-1][2] == c:
            d, l, _ = sortie[-1]
            sortie[-1] = (d, l + 1, c)
        else:
            sortie.append((i, 1, c))
    return sortie


def racine(ch, octave):
    return 12 * (octave + 1) + fondamentale(ch, TON)[0]


def grave(ch):
    """La note des contrebasses et du tuba (de mi1 à ré#2)."""
    h = racine(ch, 1)
    return h + 12 if h < hauteur('E1') else h


def voicing(ch, bas):
    g = hauteur(bas)
    sortie = set()
    for h in accord(ch, TON, octave=2):
        while h < g:
            h += 12
        sortie.add(h)
    return sorted(sortie)


def nappe(s, piste, t, bas, vel=70, art=None, de=0, jusqua=None):
    fin = len(t) if jusqua is None else jusqua
    for d, l, c in plages(t):
        if d + l <= de or d >= fin:
            continue
        a = max(d, de)
        for h in voicing(c, bas):
            s.note(piste, h, a, min(d + l, fin) - a, vel=vel, art=art)


FIGURES = ('R R O R R O R O', 'R R O R R O 5 O')


def basse_dansante(s, t, de, a, vel=84, pizz=True, tuba_aussi=False):
    """La basse qui danse : les violoncelles en croches, l'octave qui saute (3+3+2) ; les
    contrebasses (et le tuba) sur les trois appuis."""
    for m in range(de, a + 1):
        fig = FIGURES[(m - de) % 2].split()
        for k in range(8):
            pos = s.m(m) + 0.5 * k
            r = racine(t[int(pos)], 2)
            h = {'R': r, 'O': r + 12, '5': r + 7}[fig[k]]
            s.note(celles, h, pos, 0.5, vel=vel + (16 if k in (0, 3, 6) else 0), art='staccato')
        for k in (0, 3, 6):
            pos = s.m(m) + 0.5 * k
            d = 1.5 if k < 6 else 1
            c0 = t[int(pos)]
            for j in range(int(pos) + 1, min(len(t), int(pos + d + 0.999))):
                if t[j] != c0:                  # la note s'arrête au changement d'accord
                    d = j - pos
                    break
            s.note(basses, grave(t[int(pos)]), pos, d, vel=vel + 8, art='pizzicato' if pizz else 'staccato')
            if tuba_aussi:
                s.note(tuba, grave(t[int(pos)]), pos, d * 0.7, vel=vel + 4, art='staccato')


def contretemps(s, t, de, a, vel=76, art='pizzicato', quand=(2, 4)):
    """Les accords des cordes sur les temps faibles (le « pa »)."""
    for m in range(de, a + 1):
        for b in quand:
            pos = s.m(m, b)
            c = t[int(pos)]
            for h in voicing(c, 'E4'):
                s.note(violons2, h, pos, 0.5, vel=vel, art=art)
            s.note(altos, voicing(c, 'G3')[0], pos, 0.5, vel=vel - 4, art=art)


def harpe_croches(s, t, de, a, vel=72):
    """La harpe en croches : l'accord qui monte puis redescend d'un cran (elle suit
    l'harmonie temps par temps)."""
    for m in range(de, a + 1):
        for k, r in enumerate((1, 2, 3, 4, 5, 6, 5, 4)):
            pos = s.m(m) + 0.5 * k
            hs = voicing(t[int(pos)], 'C4')[:3]
            o, i = divmod(r - 1, 3)
            s.note(harpe, hs[i] + 12 * o, pos, 0.5, vel=vel + (8 if k in (0, 3, 6) else 0))


def pieds_main(s, de, a, vel=96, deux=False, main=True):
    """Deux pieds, une main : les pieds sur 1 et 2,5 (3+3+2), la main sur 4 ; `deux` : la
    main aussi sur 2 (les sommets)."""
    for m in range(de, a + 1):
        for b, v in ((1, vel), (2.5, vel - 10)):
            s.note(pieds, 'K', s.m(m, b), 1, vel=v)
            s.note(pieds_t, 'C3', s.m(m, b), 1, vel=v - 12)
        if main:
            s.note(mains, 'C4', s.m(m, 4), 0.5, vel=vel + 4)
        if deux:
            s.note(mains, 'C4', s.m(m, 2), 0.5, vel=vel - 6)


CAISSE_R = ('S : . . o . X . . o . . o . X . o o', 'S : . . o . X . . o . o . . X . X o')
DEFILE = ('S : X . x x X . x . X . x x X x x .', 'S : X . x x X . x . X x x . X . x x')
CERCLE = 'S : . . x . . . x . . . x . . . x .'


def caisse_refrain(s, de, a, vel=88):
    for m in range(de, a + 1):
        s.batterie(caisse, CAISSE_R[(m - de) % 2], a=s.m(m), jusqua=s.m(m + 1), vel=vel)


# les coups de la fanfare : la voix des trompettes (haut, second), celle des cors en dessous
VOIX = {'I': ('C6', 'G5', 'E5'), 'bVII': ('Bb5', 'F5', 'D5'), 'IV': ('A5', 'F5', 'C5'),
        'bVI': ('Ab5', 'Eb5', 'C5'), 'vi': ('A5', 'E5', 'C5'), 'I7': ('Bb5', 'G5', 'E5')}


def coup(s, pos, c, vel=104, d=0.5, art='staccato', cordes=True):
    """Un accord de toute la fanfare à la position `pos`."""
    haut, second, bas = VOIX[c]
    s.note(trompettes, haut, pos, d, vel=vel, art=art)
    s.note(trompettes2, second, pos, d, vel=vel - 4, art=art)
    s.note(cors, hauteur(second) - 12, pos, d, vel=vel - 2, art=art)
    s.note(cors, hauteur(bas) - 12, pos, d, vel=vel - 6, art=art)
    for h in voicing(c, 'C3'):
        s.note(trombones, h, pos, d, vel=vel - 4, art=art)
    s.note(tuba, grave(c), pos, d, vel=vel - 2, art=art)
    if cordes:
        s.note(basses, grave(c), pos, d, vel=vel - 8, art='staccato')
        s.note(celles, racine(c, 2), pos, d, vel=vel - 6, art='staccato')
        for h in voicing(c, 'G4'):
            s.note(violons, h, pos, d, vel=vel - 14, art='staccato')


def coups(s, m, accs=('I', 'bVII', 'IV'), vel=104, pieds_=True, foule_=False):
    """Trois coups en 3+3+2 (temps 1, 2,5, 4) : les deux pieds, puis la main."""
    for b, c in zip((1, 2.5, 4), accs):
        pos = s.m(m, b)
        coup(s, pos, c, vel=vel if b != 2.5 else vel - 6)
        s.note(timbales, racine(c, 2), pos, 1, vel=vel - 4)
        if foule_ and b == 4:
            s.note(foule, voicing(c, 'G3')[0], pos, 0.5, vel=vel - 4)
    if pieds_:
        pieds_main(s, m, m, vel=vel - 8)


def fanfare_volee(s, a, vel=110, fin=3):
    """La♭ ── si♭ ── | DO : le corps de la montée volée, en accords (le chant en haut des
    trompettes et des cors, les trombones, le tuba, les cordes)."""
    for c, t0, d in (('bVI', a, 2), ('bVII', a + 2, 2), ('I', a + 4, fin)):
        haut, second, bas = VOIX[c]
        s.note(trompettes, haut, t0, d, vel=vel)
        s.note(trompettes2, second, t0, d, vel=vel - 4)
        s.note(cors, hauteur(haut) - 12, t0, d, vel=vel)
        s.note(cors, hauteur(bas) - 12, t0, d, vel=vel - 8)
        for h in voicing(c, 'C3'):
            s.note(trombones, h, t0, d, vel=vel - 4)
        s.note(tuba, grave(c), t0, d, vel=vel - 4)
        s.note(basses, grave(c), t0, d, vel=vel - 6, art='tenu')
        s.note(celles, racine(c, 2), t0, d, vel=vel - 6, art='tenu')
        for h in voicing(c, 'E5'):
            s.note(violons, h, t0, d, vel=vel - 16, art='tremolo')
        s.note(timbales, racine(c, 2), t0, 1, vel=vel - 2)
        s.note(pieds, 'K', t0, 1, vel=vel - 4)


def chante(s, motif, a, vel=100, cors_=True, trombones_=False, celli=False):
    """La place chante (do3–do4) ; les cors à l'octave ; au sommet, les trombones et les
    violoncelles à l'unisson (trois familles)."""
    s.joue(foule, motif, a=a, vel=vel)
    if cors_:
        s.joue(cors, motif.octave(1), a=a, vel=vel - 4)
    if trombones_:
        s.joue(trombones, motif, a=a, vel=vel - 6)
    if celli:
        s.joue(celles_chant, motif, a=a, vel=vel - 10)


def roulement(s, piste, h, de, a, nd, na, vel=90):
    s.note(piste, h, de, a - de, vel=vel)
    s.expression(piste, [(de, nd), (a, na)])


def cymbale_vers(s, fin, art='monte_2s', vel=90):
    battements = {'monte_2s': 4.0, 'monte_4s': 8.0, 'monte_7s': 14.0}[art]   # à 120, 2 temps/s
    s.note(suspendue, 'C4', fin - battements, battements, vel=vel, art=art)


# =====================================================================================
# Les sections

@theme.section('intro', mesures=4)
def intro(s):
    nuances(s, pieds='f', trompettes='f', trompettes2='f', cors='f', trombones='f', tuba='f', basses='f', celles='f',
            violons='mf', timbales='f')
    arc.poser(s, 0)
    # m. 1 : l'arc seul ; les roulements ; « fu-si » au quatrième temps, en octaves
    roulement(s, caisse_roul, 'S', s.m(1, 2.5), s.m(2), 'p', 'f', vel=84)
    roulement(s, timb_roul, 'G2', s.m(1, 3), s.m(2), 'p', 'f', vel=86)
    for p, k, v in ((trompettes, 2, 104), (cors, 1, 100), (trombones, 0, 100)):
        s.joue(p, ANACROUSE.octave(k), a=s.m(1, 4), vel=v)
    # m. 2–3 : la♭ si♭ | DO, la montée volée en fanfare ; la cymbale sur le do
    fanfare_volee(s, s.m(2), vel=110, fin=3)
    s.note(cymbales, 'C4', s.m(2), 2, vel=96)
    s.note(cymbales, 'C4', s.m(3), 2, vel=110)
    s.note(foule, 'C4', s.m(3), 2, vel=100)
    s.note(foule, 'G3', s.m(3), 2, vel=96)
    # m. 4 : les coups I ♭VII IV, deux pieds et une main → le couplet
    coups(s, 4, vel=104)


# --- V1 : le couplet ------------------------------------------------------------------------
GRILLE_V1 = ['I', 'bVII', 'IV', 'I', 'IV IV IV V', 'bVII I I I', 'IV IV IV bVII', 'I',
             'I', 'bVII', 'IV', 'I', 'vi', 'IV', 'bVII', 'I7']


@theme.section('V1', mesures=16)
def V1(s):
    t = temps(GRILLE_V1)
    nuances(s, pieds='mf', celles='mf', basses='mf', violons2='mp', altos='mp', cors='ff', clarinettes='mp', flutes='mf',
            harpe='mp', violons='pp', foule='mf')
    # le premier temps marqué : la cymbale, le pied, la basse
    s.note(cymbales, 'C4', 0, 2, vel=80)
    basse_dansante(s, t, 1, 16, vel=80)
    contretemps(s, t, 1, 16, vel=74)
    # la batterie de rue : le pied sur 1, le cercle sur les contretemps, les mains légères
    for m in range(1, 17):
        s.note(pieds, 'K', s.m(m), 1, vel=86 if m % 4 == 1 else 76)
        s.batterie(cercle, CERCLE, a=s.m(m), jusqua=s.m(m + 1), vel=70)
    s.batterie(claps, 'CL : . . . . X . . . . . . . X . . .', a=s.m(5), jusqua=s.m(17), vel=80)
    # m. 5–8 : le motif et sa réponse aux cors et aux clarinettes (l'anacrouse à la m. 4)
    s.joue(cors, (MOTIF + REPONSE).octave(1), a=s.m(4, 4), vel=94)
    s.joue(clarinettes, (MOTIF + REPONSE).octave(1), a=s.m(4, 4), vel=84)
    # m. 9–12 : la harpe en croches
    harpe_croches(s, t, 9, 12, vel=72)
    # m. 13–16 : la réplique des bois, les violons qui enflent, le roulement → le refrain
    s.joue(flutes, REPLIQUE, a=s.m(13), vel=92)
    s.joue(clarinettes, REPLIQUE.octave(-1), a=s.m(13), vel=84)
    nappe(s, violons, t, 'C5', vel=70, art='tenu', de=s.m(13))
    s.expression(violons, [(s.m(13), 'pp'), (s.m(16, 4), 'mf')])
    roulement(s, caisse_roul, 'S', s.m(16), s.m(16, 4), 'p', 'mf', vel=80)
    # « fu-si » : la place prend l'anacrouse du refrain
    s.joue(foule, ANACROUSE, a=s.m(16, 4), vel=100)
    s.joue(cors, ANACROUSE.octave(1), a=s.m(16, 4), vel=94)


# --- R1 : le refrain ------------------------------------------------------------------------
GRILLE_R1 = ['IV IV IV V', 'bVII I I I', 'IV IV IV bVII', 'I', 'vi vi vi V', 'IV I I I', 'IV IV bVII bVII', 'I',
             'vi', 'IV', 'bVII', 'I7', 'I', 'I', 'bVI', 'I']
# les trompettes dans les soupirs de la place (temps 2,5 et 3 des mesures où elle tient la sixte)
PONCTUATIONS = {1: (('F5', 'A5'), ('A5', 'C6')), 3: (('A5', 'C6'), ('F5', 'A5')),
                5: (('E5', 'A5'), ('A5', 'C6')), 7: (('F5', 'A5'), ('F5', 'Bb5'))}


@theme.section('R1', mesures=16)
def R1(s):
    t = temps(GRILLE_R1)
    nuances(s, pieds='f', foule='f', cors='f', trompettes='mf', trompettes2='mf', trombones='mf', tuba='mf', celles='mf',
            basses='mf', violons2='mp', altos='mp', violons='p', flutes='mf', caisse='mf', choeur='mp')
    s.note(cymbales, 'C4', 0, 2, vel=104)
    s.note(timbales, 'F2', 0, 1, vel=104)
    s.note(flutes, 'A5', 0, 2, vel=88)        # la septième de la réplique se résout sur la tierce
    # m. 1–8 : la place chante la phrase, les cors avec elle
    chante(s, MOTIF.coupe(1, 8), 0, vel=100)
    chante(s, REPONSE, s.m(2, 4), vel=100)
    chante(s, MOTIF, s.m(4, 4), vel=102)
    chante(s, MONTEE, s.m(6, 4), vel=106)
    for m, (p1, p2) in PONCTUATIONS.items():
        for (bas, haut), b, d in (((p1[0], p1[1]), 2.5, 0.5), ((p2[0], p2[1]), 3, 1)):
            s.note(trompettes, haut, s.m(m, b), d, vel=96, art='staccato')
            s.note(trompettes2, bas, s.m(m, b), d, vel=92, art='staccato')
            for h in voicing(t[int(s.m(m, b))], 'F3')[:2]:
                s.note(trombones, h, s.m(m, b), d, vel=92, art='staccato')
    # la basse qui danse (le tuba avec elle), les cordes sur 2, 4 et 4,5 ; les violons en halo
    basse_dansante(s, t, 1, 12, vel=86, pizz=False, tuba_aussi=True)
    contretemps(s, t, 1, 12, vel=78, art='staccato', quand=(2, 4, 4.5))
    nappe(s, violons, t, 'C5', vel=68, art='tremolo', jusqua=s.m(9))
    # deux pieds, une main ; la caisse claire ; les cymbales aux carrures
    pieds_main(s, 1, 12, vel=96)
    caisse_refrain(s, 1, 12, vel=84)
    s.note(cymbales, 'C4', s.m(5), 2, vel=96)
    s.note(cymbales, 'C4', s.m(9), 2, vel=100)
    # m. 9–12 : la réplique aux trompettes, en tierces ; les cors tiennent l'harmonie
    s.joue(trompettes, REPLIQUE, a=s.m(9), vel=100)
    s.joue(trompettes2, REPLIQUE2, a=s.m(9), vel=94)
    nappe(s, cors, t, 'C4', vel=78, art='tenu', de=s.m(9), jusqua=s.m(13))
    nappe(s, choeur, t, 'E4', vel=70, de=s.m(9), jusqua=s.m(13))
    # m. 13–15 : les coups (I ♭VII IV, deux fois, puis la victoire ♭VI ♭VII I) ; m. 16 : l'arrêt
    coups(s, 13, vel=104)
    coups(s, 14, vel=106, foule_=True)
    coups(s, 15, ('bVI', 'bVII', 'I'), vel=110, foule_=True)
    roulement(s, caisse_roul, 'S', s.m(15), s.m(16), 'mf', 'f', vel=86)
    coup(s, s.m(16), 'I', vel=116, d=1)
    s.note(timbales, 'C3', s.m(16), 1, vel=112)
    s.note(cymbales, 'C4', s.m(16), 2, vel=112)
    s.note(pieds, 'K', s.m(16), 1, vel=110)
    s.note(foule, 'C4', s.m(16), 1.5, vel=108)
    s.note(foule, 'G3', s.m(16), 1.5, vel=100)


# --- W1 : la fenêtre ------------------------------------------------------------------------
@theme.section('W1', mesures=8, reprise=False)
def W1(s):
    nuances(s, basses='pp', altos='pp', violons2='pp', harpe='p', glock='p')
    # do, puis fa/do, puis do : une nappe en sixte (do mi sol la), la basse pp
    s.note(harpe, 'C3', 0, 4, vel=74)
    s.note(harpe, 'G3', 0.5, 4, vel=66)
    s.note(basses, 'C2', 0, s.m(5), vel=64, art='tenu')
    s.note(basses, 'F1', s.m(5), 8, vel=60, art='tenu')
    s.note(basses, 'C2', s.m(7), 8, vel=60, art='tenu')
    s.note(altos, 'G3', 0, s.m(5), vel=58, art='tenu')
    s.note(altos, 'C4', s.m(5), 8, vel=56, art='tenu')
    s.note(altos, 'G3', s.m(7), 8, vel=56, art='tenu')
    s.note(violons2, 'E4', 0, s.m(5), vel=56, art='tenu')
    s.note(violons2, 'A4', s.m(2), s.m(5) - s.m(2), vel=54, art='tenu')
    s.note(violons2, 'F4', s.m(5), 8, vel=54, art='tenu')
    s.note(violons2, 'A4', s.m(5), 8, vel=52, art='tenu')
    s.note(violons2, 'E4', s.m(7), 8, vel=52, art='tenu')
    s.expression(violons2, [(0, 'pp'), (s.m(4), 'p'), (s.m(8, 4), 'pp')])
    # la tête au glockenspiel, son écho à la harpe
    s.joue(glock, TETE.octave(3), a=s.m(2, 4), vel=76)
    s.joue(harpe, TETE.octave(2), a=s.m(6, 4), vel=70)


# --- V2 : la fanfare de 1990 ------------------------------------------------------------------
GRILLE_V2 = ['I', 'I', 'I', 'bVII', 'IV', 'I', 'I', 'bVII', 'IV', 'I', 'IV', 'I', 'IV', 'I', 'bVII', 'IV']


def poum_pa(s, t, de, a, vel=90):
    """Le poum-pa : le tuba sur 1 et 3 (la fondamentale, puis la quinte), les trombones et
    les cors sur 2 et 4."""
    for m in range(de, a + 1):
        for b in (1, 3):
            pos = s.m(m, b)
            h = grave(t[int(pos)]) + (0 if b == 1 else 7)
            s.note(tuba, h, pos, 1, vel=vel, art='staccato')
            s.note(basses, h, pos, 1, vel=vel - 10, art='pizzicato')
        for b in (2, 4):
            pos = s.m(m, b)
            c = t[int(pos)]
            for h in voicing(c, 'E3'):
                s.note(trombones, h, pos, 0.5, vel=vel - 10, art='staccato')
            for h in voicing(c, 'G4')[:2]:
                s.note(cors, h, pos, 0.5, vel=vel - 14, art='staccato')


@theme.section('V2', mesures=16)
def V2(s):
    t = temps(GRILLE_V2)
    nuances(s, pieds='f', trompettes='f', trompettes2='mf', clarinettes='mp', tuba='mf', trombones='mf', cors='mf',
            basses='mp', caisse='mf')
    s.note(cymbales, 'C4', 0, 2, vel=92)
    # la caisse de défilé, la grosse caisse sur 1 et 3, la cymbale étouffée sur 2 et 4
    for m in range(1, 17):
        s.batterie(caisse, DEFILE[(m - 1) % 2], a=s.m(m), jusqua=s.m(m + 1), vel=84)
        s.note(pieds, 'K', s.m(m), 1, vel=92)
        s.note(pieds, 'K', s.m(m, 3), 1, vel=80)
        s.note(etouffee, 'C4', s.m(m, 2), 0.5, vel=72)
        s.note(etouffee, 'C4', s.m(m, 4), 0.5, vel=72)
    poum_pa(s, t, 1, 16)
    # m. 3–10 : la marche des trompettes, en tierces ; les clarinettes à l'octave
    s.joue(trompettes, MARCHE, a=s.m(3), vel=100)
    s.joue(trompettes2, MARCHE2, a=s.m(3), vel=92)
    s.joue(clarinettes, MARCHE.octave(-1), a=s.m(3), vel=82)
    # m. 11–12 : les cors appellent la tête, les trombones répondent
    s.joue(cors, TETE.octave(1), a=s.m(10, 4), vel=98)
    s.joue(trombones, TETE, a=s.m(11, 4), vel=96)
    # m. 13–16 : la fanfare s'éloigne (vers le pont)
    for p in (caisse, pieds, etouffee, tuba, trombones, cors, basses):
        s.expression(p, [(s.m(13), 'mf'), (s.m(16, 4), 'pp')])


# --- P : le pont, au bord de la nuit ---------------------------------------------------------
GRILLE_P = ['vi', 'vi', 'IV IV IV V5', 'vi', 'IV IV IV V', 'vi', 'ii ii ii vi', 'IV IV V V',
            'vi', 'vi', 'IV', 'IV', 'bVI', 'bVII', 'bVI', 'bVII']


@theme.section('P', mesures=16)
def P(s):
    t = temps(GRILLE_P)
    nuances(s, pieds='mf', tuba='mf', celles_chant='mf', harpe='mp', basses='mp', altos='p', violons2='p', violons='p', rumeur='p',
            cors='mp', trompettes='mf', trompettes2='mf', trombones='mp')
    # la mineur : la harpe en croches, les cordes en trémolo, la basse pincée, la place au loin
    harpe_croches(s, t, 1, 12, vel=70)
    nappe(s, altos, t, 'A3', vel=62, art='tremolo', jusqua=s.m(13))
    nappe(s, violons2, t, 'E4', vel=60, art='tremolo', jusqua=s.m(9))
    for m in range(1, 13):
        for b in (1, 3):
            s.note(basses, grave(t[int(s.m(m, b))]), s.m(m, b), 2, vel=78, art='pizzicato')
    s.note(rumeur, 'A2', 0, s.m(9), vel=72)
    s.note(pieds, 'K', 0, 1, vel=74)
    # m. 3–6 : les violoncelles se souviennent du stade (le motif et sa réponse, en la mineur)
    s.joue(celles_chant, STADE + STADE_R, a=s.m(2, 4), vel=96)
    # m. 8 : le cor répond par la tête
    s.joue(cors, TETE_STADE, a=s.m(7, 4), vel=86)
    # m. 9–16 : la remontée : les arpèges des violons, la♭ si♭, la tête volée, le roulement
    for m in range(9, 17):
        c = t[int(s.m(m))]
        b = min(3, 1 + (m - 9) // 2)
        rangs = [b, b + 1, b + 2, b + 3, b + 1, b + 2, b + 3, b + 4,
                 b + 2, b + 3, b + 4, b + 5, b + 3, b + 4, b + 5, b + 4]
        s.joue(violons, arpege(voicing(c, 'A3'), [str(r) for r in rangs], pas=0.25, vel=86, art='staccato'),
               a=s.m(m))
    s.expression(violons, [(s.m(9), 'p'), (s.m(16, 4), 'f')])
    nappe(s, violons2, t, 'C5', vel=70, art='tremolo', de=s.m(9))
    s.expression(violons2, [(s.m(9), 'p'), (s.m(16, 4), 'f')])
    for m in range(13, 17):
        c = t[int(s.m(m))]
        s.note(basses, grave(c), s.m(m), 4, vel=88, art='tenu')
        s.note(celles, racine(c, 2), s.m(m), 4, vel=84, art='tenu')
        s.note(tuba, grave(c), s.m(m), 4, vel=82)
        for h in voicing(c, 'F3'):
            s.note(trombones, h, s.m(m), 4, vel=78)
    s.expression(trombones, [(s.m(13), 'mp'), (s.m(16, 4), 'f')])
    s.joue(cors, TETE_VOLEE.octave(1), a=s.m(12, 4), vel=96)
    s.joue(trompettes, TETE_VOLEE.octave(2), a=s.m(14, 4), vel=100)
    s.joue(trompettes2, TETE_VOLEE.octave(1), a=s.m(14, 4), vel=94)
    pieds_main(s, 13, 16, vel=86, main=False)
    roulement(s, caisse_roul, 'S', s.m(15), s.m(16, 4), 'p', 'f', vel=84)
    roulement(s, timb_roul, 'Bb2', s.m(16), s.m(16, 4), 'mp', 'f', vel=90)
    cymbale_vers(s, s.longueur, 'monte_2s', vel=90)
    s.note(effets, 'C4', s.m(15), 8, vel=96, art='montee')
    # « fu-si » : la place prend l'anacrouse du grand refrain
    s.joue(foule, ANACROUSE, a=s.m(16, 4), vel=106)
    s.joue(cors, ANACROUSE.octave(1), a=s.m(16, 4), vel=100)
    s.joue(trombones, ANACROUSE, a=s.m(16, 4), vel=98)


# --- R2 : le grand refrain ----------------------------------------------------------------------
GRILLE_R2 = ['IV IV IV V', 'bVII I I I', 'IV IV IV bVII', 'I', 'vi vi vi V', 'IV I I I', 'bVI bVI bVII bVII', 'I',
             'I', 'bVII', 'IV', 'I', 'IV', 'bVII', 'I', 'I']


@theme.section('R2', mesures=16)
def R2(s):
    t = temps(GRILLE_R2)
    silence = s.m(6, 3)
    nuances(s, pieds='f', foule='ff', cors='f', trombones='f', celles_chant='f', choeur='mf', trompettes='f',
            trompettes2='f', tuba='f', celles='f', basses='f', violons='mf', violons2='mf', altos='mf', caisse='f')
    s.note(cymbales, 'C4', 0, 2, vel=112)
    s.note(timbales, 'F2', 0, 1, vel=112)
    # m. 1–6 : la phrase, trois familles à l'unisson (la place, les trombones, les
    # violoncelles ; les cors à l'octave), le chœur en nappe ; elle s'arrête au silence
    chante(s, MOTIF.coupe(1, 8), 0, vel=106, trombones_=True, celli=True)
    chante(s, REPONSE, s.m(2, 4), vel=106, trombones_=True, celli=True)
    chante(s, MOTIF.coupe(0, 7), s.m(4, 4), vel=108, trombones_=True, celli=True)
    nappe(s, choeur, t, 'E4', vel=78, jusqua=silence)
    nappe(s, violons, t, 'C5', vel=76, art='tremolo', jusqua=silence)
    for m, (p1, p2) in PONCTUATIONS.items():
        if m > 5:
            continue
        for (bas, haut), b, d in (((p1[0], p1[1]), 2.5, 0.5), ((p2[0], p2[1]), 3, 1)):
            s.note(trompettes, haut, s.m(m, b), d, vel=100, art='staccato')
            s.note(trompettes2, bas, s.m(m, b), d, vel=96, art='staccato')
    basse_dansante(s, t, 1, 5, vel=90, pizz=False, tuba_aussi=True)
    s.note(celles, racine('IV', 2), s.m(6), 1, vel=100, art='staccato')
    s.note(celles, racine('I', 2), s.m(6, 2), 1, vel=100, art='staccato')
    s.note(basses, grave('IV'), s.m(6), 1, vel=100, art='staccato')
    s.note(basses, grave('I'), s.m(6, 2), 1, vel=100, art='staccato')
    contretemps(s, t, 1, 5, vel=84, art='staccato', quand=(2, 4, 4.5))
    pieds_main(s, 1, 5, vel=104, deux=True)
    s.note(pieds, 'K', s.m(6), 1, vel=104)
    s.note(mains, 'C4', s.m(6, 2), 0.5, vel=100)
    caisse_refrain(s, 1, 5, vel=90)
    s.note(cymbales, 'C4', s.m(5), 2, vel=104)
    # le silence : l'arc ; la place seule, a cappella : « fu-si »
    arc.poser(s, silence, impact=False, vel=122)
    s.joue(foule, ANACROUSE, a=s.m(6, 4), vel=112)
    # m. 7–8 : la montée volée, tout le monde : la♭ si♭ | DO
    s.note(arc.impact, 'C1', s.m(7), 2, vel=116, art='impact')
    chante(s, VOLEE.coupe(1, 9), s.m(7), vel=114, trombones_=True, celli=True)
    fanfare_volee(s, s.m(7), vel=118, fin=4)
    for c, a0, d in (('bVI', s.m(7), 2), ('bVII', s.m(7, 3), 2), ('I', s.m(8), 4)):
        for h in voicing(c, 'E4'):
            s.note(choeur, h, a0, d, vel=96)
    s.note(sub, grave('bVI'), s.m(7), 2, vel=72)
    s.note(sub, grave('bVII'), s.m(7, 3), 2, vel=72)
    s.note(sub, grave('I'), s.m(8), 4, vel=76)
    roulement(s, timb_roul, 'C3', s.m(7), s.m(8), 'mf', 'ff', vel=100)
    roulement(s, caisse_roul, 'S', s.m(7), s.m(8), 'mf', 'ff', vel=92)
    cymbale_vers(s, s.m(8), 'monte_2s', vel=96)
    s.note(cymbales, 'C4', s.m(8), 2, vel=124)
    s.note(timbales, 'C3', s.m(8), 1, vel=124)
    s.note(pieds, 'K', s.m(8), 1, vel=122)
    s.note(ovation, 'C4', s.m(8), 10, vel=110)
    # m. 9–12 : la fête : la place appelle la tête, les cloches, la danse
    t9 = t
    basse_dansante(s, t9, 9, 12, vel=88, pizz=False, tuba_aussi=True)
    contretemps(s, t9, 9, 12, vel=80, art='staccato', quand=(2, 4, 4.5))
    pieds_main(s, 9, 12, vel=100, deux=True)
    caisse_refrain(s, 9, 12, vel=86)
    for m in (9, 11):
        chante(s, TETE, s.m(m - 1, 4), vel=104)
    nappe(s, trombones, t, 'E3', vel=80, art='tenu', de=s.m(9), jusqua=s.m(13))
    for m, b, h in ((9, 1, 'C5'), (9, 3, 'G4'), (10, 1, 'Bb4'), (10, 3, 'F4'), (11, 1, 'A4'), (11, 3, 'F4'),
                    (12, 1, 'C5'), (12, 3, 'G4')):
        s.note(cloches, h, s.m(m, b), 4, vel=84)
    s.note(cymbales, 'C4', s.m(9), 2, vel=100)
    # m. 13–16 : la fête retombe : les cuivres tiennent, l'ovation s'éteint, la place fredonne
    for p in (cors, trombones, choeur):
        nappe(s, p, t, {'cors': 'C4', 'trombones': 'E3', 'choeur': 'E4'}[p.nom], vel=80, art=None,
              de=s.m(13))
        s.expression(p, [(s.m(13), 'mf'), (s.m(16, 4), 'pp')])
    for m in range(13, 17):
        c = t[int(s.m(m))]
        s.note(basses, grave(c), s.m(m), 4, vel=80, art='tenu')
        s.note(celles, racine(c, 2), s.m(m), 4, vel=76, art='tenu')
    s.expression(basses, [(s.m(13), 'mf'), (s.m(16, 4), 'p')])
    s.expression(celles, [(s.m(13), 'mf'), (s.m(16, 4), 'p')])
    s.note(ovation, 'C4', s.m(13), 8, vel=80)
    s.note(foule, 'C3', s.m(15), 8, vel=84, art='o')
    s.note(foule, 'G3', s.m(15), 8, vel=80, art='o')
    s.expression(foule, [(s.m(15), 'mp'), (s.m(16, 4), 'pp')])
    s.note(pieds, 'K', s.m(13), 1, vel=96)
    s.note(cymbales, 'C4', s.m(13), 2, vel=88)


# --- W2 : la fenêtre ----------------------------------------------------------------------------
@theme.section('W2', mesures=8, reprise=False)
def W2(s):
    nuances(s, rumeur='mp', basses='pp', altos='pp', violons2='pp')
    # la rumeur de la place, au loin ; une cloche ; fa/do → do (le plagal, au ralenti)
    s.note(rumeur, 'C3', 0, s.longueur, vel=78)
    s.expression(rumeur, [(0, 'mp'), (s.m(8, 4), 'pp')])
    s.note(cloches, 'C5', 0, 6, vel=70)
    s.note(basses, 'C2', 0, s.longueur, vel=62, art='tenu')
    s.note(altos, 'C4', 0, s.longueur, vel=56, art='tenu')
    s.note(violons2, 'F4', 0, s.m(5), vel=54, art='tenu')
    s.note(violons2, 'A4', 0, s.m(5), vel=52, art='tenu')
    s.note(violons2, 'E4', s.m(5), 16, vel=52, art='tenu')
    s.note(violons2, 'G4', s.m(5), 16, vel=50, art='tenu')
    s.expression(violons2, [(0, 'pp'), (s.m(4), 'p'), (s.m(8, 4), 'pp')])


# --- V3 : le lendemain matin ----------------------------------------------------------------------
GRILLE_V3 = ['I', 'bVII', 'IV', 'I', 'IV IV IV V', 'bVII I I I', 'IV IV IV bVII', 'I',
             'I', 'bVII', 'IV', 'I', 'vi', 'IV', 'bVII', 'I']


@theme.section('V3', mesures=16)
def V3(s):
    t = temps(GRILLE_V3)
    nuances(s, pieds='mp', cors='f', bassons='mp', harpe='mp', celles='mp', basses='mp', violons='p', flutes='mf',
            hautbois='mf')
    s.note(pieds, 'K', 0, 1, vel=74)
    s.note(cymbales, 'C4', 0, 2, vel=64)
    # les bassons sautillent (l'octave en 3+3+2), les pizz sur 1, la harpe en croches
    for m in range(1, 17):
        fig = FIGURES[(m - 1) % 2].split()
        for k in range(8):
            pos = s.m(m) + 0.5 * k
            r = racine(t[int(pos)], 2)
            h = {'R': r, 'O': r + 12, '5': r + 7}[fig[k]]
            s.note(bassons, h, pos, 0.5, vel=80 + (14 if k in (0, 3, 6) else 0))
        c = t[int(s.m(m))]
        s.note(celles, racine(c, 2), s.m(m), 1, vel=82, art='pizzicato')
        s.note(basses, grave(c), s.m(m), 1, vel=82, art='pizzicato')
        for h in voicing(t[int(s.m(m, 2))], 'G4'):
            s.note(violons, h, s.m(m, 2), 0.5, vel=66, art='pizzicato')
        for h in voicing(t[int(s.m(m, 4))], 'G4'):
            s.note(violons, h, s.m(m, 4), 0.5, vel=62, art='pizzicato')
    harpe_croches(s, t, 1, 16, vel=68)
    # m. 5–8 : le motif et sa réponse à la flûte ; m. 13–16 : la réplique au hautbois
    s.joue(flutes, (MOTIF + REPONSE).octave(2), a=s.m(4, 4), vel=90)
    s.joue(hautbois, REPLIQUE.octave(-1), a=s.m(13), vel=88)
    s.joue(flutes, REPLIQUE.coupe(8, 16), a=s.m(15), vel=84)
    # m. 16 : la fanfare revient (les roulements ; « fu-si » aux trompettes)
    roulement(s, caisse_roul, 'S', s.m(16), s.m(16, 4), 'p', 'f', vel=84)
    roulement(s, timb_roul, 'G2', s.m(16), s.m(16, 4), 'p', 'f', vel=88)
    s.joue(trompettes, ANACROUSE.octave(2), a=s.m(16, 4), vel=102)
    s.joue(cors, ANACROUSE.octave(1), a=s.m(16, 4), vel=98)


# --- F : la finale ----------------------------------------------------------------------------------
GRILLE_F = ['bVI bVI bVII bVII', 'I', 'I', 'I', 'IV IV IV V', 'bVII I I I', 'bVI bVI bVII bVII', 'I',
            'I', 'bVII', 'IV', 'I', 'I', 'bVII', 'IV', 'I']


@theme.section('F', mesures=16)
def F(s):
    t = temps(GRILLE_F)
    nuances(s, pieds='f', trompettes='f', trompettes2='f', cors='f', trombones='f', tuba='f', basses='f', celles='f',
            violons='mf', foule='f', choeur='mf', violons2='mp', altos='mp', caisse='mf')
    # m. 1–2 : la fanfare, la place avec elle : la♭ si♭ | DO
    s.note(cymbales, 'C4', 0, 2, vel=104)
    fanfare_volee(s, 0, vel=112, fin=4)
    chante(s, VOLEE.coupe(1, 9), 0, vel=104, cors_=False)
    s.note(cymbales, 'C4', s.m(2), 2, vel=112)
    # m. 3–4 : les coups ; « fu-si » au dernier temps
    coups(s, 3, vel=104)
    coups(s, 4, vel=106, foule_=False)
    # m. 5–8 : le motif, puis la montée volée → DO
    chante(s, MOTIF, s.m(4, 4), vel=106, trombones_=True)
    chante(s, VOLEE, s.m(6, 4), vel=110, trombones_=True)
    fanfare_volee(s, s.m(7), vel=112, fin=4)
    basse_dansante(s, t, 5, 6, vel=88, pizz=False, tuba_aussi=True)
    contretemps(s, t, 5, 6, vel=80, art='staccato', quand=(2, 4, 4.5))
    pieds_main(s, 5, 6, vel=100, deux=True)
    caisse_refrain(s, 5, 6, vel=88)
    s.note(cymbales, 'C4', s.m(8), 2, vel=112)
    roulement(s, caisse_roul, 'S', s.m(7), s.m(8), 'mf', 'f', vel=88)
    # m. 9–12 : la danse : la basse, les cordes, deux pieds et une main, le chœur en nappe
    basse_dansante(s, t, 9, 15, vel=86, pizz=False, tuba_aussi=True)
    contretemps(s, t, 9, 15, vel=78, art='staccato', quand=(2, 4, 4.5))
    pieds_main(s, 9, 15, vel=96, deux=True)
    caisse_refrain(s, 9, 15, vel=84)
    nappe(s, choeur, t, 'E4', vel=72, de=s.m(9), jusqua=s.m(13))
    nappe(s, cors, t, 'C4', vel=76, art='tenu', de=s.m(9), jusqua=s.m(16))
    s.note(cymbales, 'C4', s.m(9), 2, vel=100)
    # m. 13–16 : la fête se range ; les coups relancent le couplet
    for p in (celles, basses, tuba, violons2, altos, cors, caisse, pieds, mains):
        s.expression(p, [(s.m(13), 'f'), (s.m(16), 'mf')])
    coups(s, 16, vel=96)


theme.forme(intro=['intro'], corps=['V1', 'R1', 'W1', 'V2', 'P', 'R2', 'W2', 'V3', 'F'])
