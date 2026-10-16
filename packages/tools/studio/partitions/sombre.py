"""FUSIBLE — « Garde à vue » (sombre) : la carte sombre, un événement noir (la police, la
ruine, la trahison). La crispation : un cœur qui bat, deux notes à un demi-ton, du métal
frotté, une voix d'homme seule, et le silence qui pèse. Jamais de mélodie entière.

68 à la noire (une mesure = 3,53 s), ré mineur à couleur phrygienne (mi♭). L'orchestre seul :
cordes graves tenues, cors bouchés, cuivres graves, timbales, piano ; la sous-basse en grain.

LE MOTIF, jamais entier (`_fusible.phrase`) :
  la MÈCHE seule : ré la | SI♭ ─────── (1 5 ♭6, la ♭6 qui ne se résout pas) ;
  la TÊTE RENVERSÉE (`tete.inverse()`, posée sur fa) : fa si♭ | LA ── (♭3 ♭6 5, la mèche
  tête en bas) ;
  la seconde de la mèche, la – si♭ (5 – ♭6), devient l'ostinato de deux notes à un demi-ton :
  un BALANCIER lent aux violoncelles (la trois temps, si♭ un temps) sur la pédale de ré ; au
  piano grave, la paire phrygienne ré – mi♭.

L'harmonie : pédale de ré ; i – ♭vi mineur (ré m – si♭ m : la menace) ; i – ♭II (ré m – mi♭
sur ré : le frottement) ; le choral i | ♭vi | ♭II | i.

LA CARTE (le corps : 44 mesures, 155 s)
  intro  2 m.        l'ARC à découvert (le néon de la cellule qui saute), la cymbale frottée
                     à l'archet, la pédale de ré ; le cœur entre                     1 → 2
  S1     8 m.  0:00  « la cellule » : le cœur un temps sur deux (grosse caisse étouffée et
                     timbale sourde accordée sur ré), la pédale, le balancier la – si♭ ;
                     m. 5 la mèche, fredonnée par une voix seule, au fond            2 → 3
  S2     8 m.  0:28  « l'interrogatoire » : i – ♭vi aux trémolos, la basse sur si♭ ; le
                     cœur à chaque temps ; la tête renversée au cor bouché ; la goutte
                     (piano aigu) ; m. 8 un SILENCE écrit, le cœur seul relance    3 → 4, 0
  S3     8 m.  0:56  « la pression » : i – ♭II ; le braam ; les quatre cors, ouverts,
                     crient la mèche, les trombones répondent par la tête renversée ;
                     le cœur s'emballe ; coupé net au 3ᵉ temps de la m. 8           5 → 6
  S4     4 m.  1:25  « le silence » (jamais repris) : l'ARC dans le silence, un cœur
                     lointain, le tam-tam gratté                                       1
  S5     8 m.  1:39  « l'aveu » : le piano grave, ré – mi♭ obstinés ; les violoncelles
                     en pizzicato sur le cœur ; la voix seule, la tête renversée     3 → 4
  S6     8 m.  2:08  « la nuit » : le choral des cuivres graves, i | ♭vi | ♭II | i ; la
                     mèche aux cors bouchés ; le roulement de timbales relance S1    4 → 3
"""
from moteur.ecriture import *
from partitions._fusible import phrase, Arc

theme = Theme('sombre', 'Garde à vue', bpm=68, mesure='4/4', tonalite='ré mineur', graine=1984,
              ville=False, moment='une carte sombre, un événement noir',
              humeur='la crispation : un cœur qui bat, deux notes à un demi-ton, le silence qui pèse')

TON = 'ré mineur'
SEC = 68 / 60.0                 # une seconde, en temps

# --- l'arc (le son-signature commun) -------------------------------------------------------
arc = Arc(theme)
# --- les cordes ----------------------------------------------------------------------------
basses = theme.piste('basses', 'contrebasses', art='sans_vibrato', volume=0)
celles = theme.piste('celles', 'violoncelles', art='legato', pan=0.3, volume=0)
celles_pizz = theme.piste('celles_pizz', 'violoncelles', art='pizzicato', pan=0.35, volume=0)
celles_trem = theme.piste('celles_trem', 'violoncelles', art='tremolo', pan=0.3, volume=0)
altos = theme.piste('altos', art='tremolo', volume=0)
violons2 = theme.piste('violons2', 'violons', art='tremolo', pan=-0.25, volume=0)
violons = theme.piste('violons', art='tenu', pan=-0.45, profondeur=0.6, volume=-6)
# --- les cuivres -----------------------------------------------------------------------------
cors = theme.piste('cors', art='sourdine', volume=0)
cor_bouche = theme.piste('cor_bouche', 'cors', art='sourdine', unisson=1, pan=-0.35, profondeur=0.8,
                         salle=0.5, volume=0)
trombones = theme.piste('trombones', art='tenu', volume=0)
tuba = theme.piste('tuba', art='tenu', volume=0)
braam = theme.piste('braam', volume=-4)
# --- la voix seule (un chœur « ouh » réduit à une prise, au fond) ------------------------------
voix = theme.piste('voix', 'choeur', art='ouh', unisson=1, pan=0.15, profondeur=0.9, salle=0.6,
                   volume=0)
# --- le piano --------------------------------------------------------------------------------
piano = theme.piste('piano', art='pedale', salle=0.4, volume=0)
goutte = theme.piste('goutte', 'piano', art='tenu', pan=-0.5, profondeur=0.7, salle=0.7, volume=-6)
# --- les percussions --------------------------------------------------------------------------
# le cœur : la grosse caisse de concert étouffée (son corps), une timbale sourde sur ré (le
# coup qu'un petit haut-parleur entend)
coeur = theme.piste('coeur', 'grosse_caisse', eq={'passe_bas': 1200}, profondeur=0.4, salle=0.15,
                    volume=0)
coeur_ton = theme.piste('coeur_ton', 'timbales', eq={'passe_bas': 2500}, profondeur=0.5, salle=0.15,
                        volume=0)
timb_roul = theme.piste('timb_roul', 'timbales', art='roulement', volume=0)
archet = theme.piste('archet', 'cymbale_suspendue', art='archet', profondeur=0.6, salle=0.5, volume=0)
tamtam = theme.piste('tamtam', 'tam_tam', art='gratte', salle=0.5, volume=0)
# --- le grain ---------------------------------------------------------------------------------
sub = theme.piste('sub', 'sub_synthe', volume=-14)


def nuances(s, **niveaux):
    """La nuance de chaque piste au début de la section."""
    for nom_piste, v in niveaux.items():
        s.nuance(theme.pistes[nom_piste], v, 0)


# =====================================================================================
# Le matériau

MECHE = phrase('meche', TON, octave=3)                        # ré3 la3 | si♭3 ───────
MECHE_HAUTE = phrase('meche', TON, octave=4)                  # ré4 la4 | si♭4 ───────
# la tête renversée, posée sur fa (♭3) : fa4 si♭3 | la3 ──
TETE_RENVERSEE = phrase('tete', TON, octave=4).inverse().transpose(3)

# les accords (trois sons, voix proches) ; 'II' = mi♭ majeur sur la pédale de ré
ACC = {'i': ['A3', 'D4', 'F4'], 'vi': ['Bb3', 'Db4', 'F4'], 'II': ['Bb3', 'Eb4', 'G4']}
ACC_HAUT = {'i': ['F4', 'A4', 'D5'], 'vi': ['F4', 'Bb4', 'Db5'], 'II': ['G4', 'Bb4', 'Eb5']}
RAC = {'i': 'D', 'vi': 'Bb', 'II': 'Eb'}


def grille(texte):
    """« i i vi vi » → une liste d'accords, une mesure chacun."""
    return texte.split()


def tenus(s, piste, mesures, voix_acc, vel=70, de=1, jusqua=None, art=None):
    """Les accords de la grille, tenus mesure par mesure (une note qui reste la même d'une
    mesure à l'autre n'est pas rejouée)."""
    fin = s.longueur if jusqua is None else jusqua
    nv = len(next(iter(voix_acc.values())))
    for i in range(nv):
        cour = None
        for m, ch in enumerate(mesures, start=1):
            if m < de:
                continue
            a, b = s.m(m), min(s.m(m + 1), fin)
            if a >= fin:
                break
            h = voix_acc[ch][i]
            if cour and cour[0] == h and abs(cour[2] - a) < 1e-6:
                cour[2] = b
            else:
                if cour:
                    s.note(piste, cour[0], cour[1], cour[2] - cour[1], vel=vel, art=art)
                cour = [h, a, b]
        if cour:
            s.note(piste, cour[0], cour[1], cour[2] - cour[1], vel=vel, art=art)


def battements(s, de, jusqua, motif, vel=88):
    """Le cœur : « boum-boum » (le premier coup fort, le second une double croche plus tard,
    plus doux), selon `motif` (une grille de doubles croches, L le premier coup, d le second).
    La timbale sourde double le premier coup."""
    jetons = motif.split()
    t = de
    k = 0
    while t < jusqua - 1e-9:
        j = jetons[k % len(jetons)]
        if j == 'L':
            s.note(coeur, 'K', t, 0.25, vel=vel)
            s.note(coeur_ton, 'D2', t, 0.25, vel=vel - 30)
        elif j == 'd':
            s.note(coeur, 'K', t, 0.25, vel=vel - 26)
        t += 0.25
        k += 1


def balancier(s, de, a, haut='Bb3', bas='A3', vel=78):
    """Le balancier de deux notes à un demi-ton, aux violoncelles : la trois temps, si♭ un
    temps, de la mesure `de` à la mesure `a` comprise."""
    for m in range(de, a + 1):
        s.note(celles, bas, s.m(m), 3, vel=vel)
        s.note(celles, haut, s.m(m, 4), 1, vel=vel - 6)


# =====================================================================================
# Les sections

@theme.section('intro', mesures=2)
def intro(s):
    nuances(s, archet='mf', basses='pp', sub='mf', coeur='mp', coeur_ton='mp')
    # le néon de la cellule saute : l'arc, seul
    arc.poser(s, 0, impact=True)
    # le métal frotté, puis la pédale qui entre sous lui
    s.note(archet, 'C4', 1.0, 6, vel=88)
    s.note(basses, 'D2', 1.5, 6.5, vel=60)
    s.crescendo(basses, 1.5, 8, 'pp', 'p')
    s.note(sub, 'D2', 2, 6, vel=60)
    # le cœur, à la mesure 2, un temps sur deux
    battements(s, s.m(2), s.m(3), 'L d . . . . . . L d . . . . . .', vel=82)


@theme.section('S1', mesures=8)
def S1(s):
    nuances(s, basses='p', sub='mf', coeur='mf', coeur_ton='mf', celles='mp', voix='mp', archet='mf',
            goutte='p')
    # le premier temps : le cœur, la pédale, le métal frotté
    s.note(archet, 'C4', 0, 8, vel=84)
    s.note(basses, 'D2', 0, 32, vel=66)
    s.note(sub, 'D2', 0, 32, vel=62)
    battements(s, 0, s.longueur, 'L d . . . . . . L d . . . . . .', vel=86)
    # le balancier, dès la mesure 2
    balancier(s, 2, 8)
    s.crescendo(celles, s.m(2), s.m(8, 4), 'p', 'mp')
    # la mèche, fredonnée par une voix seule (elle ne se résout pas : le si♭ s'éteint)
    s.joue(voix, MECHE, a=s.m(5) - 1, vel=80)
    s.expression(voix, [(s.m(5) - 1, 'mp'), (s.m(6), 'mf'), (s.m(7, 3), 'p')])
    # la goutte : un ré aigu, deux fois
    s.note(goutte, 'D6', s.m(3, 2.5), 1, vel=52)
    s.note(goutte, 'D6', s.m(7, 3.5), 1, vel=46)


GRILLE_S2 = grille('i i vi vi i i vi vi')


@theme.section('S2', mesures=8)
def S2(s):
    nuances(s, basses='mp', coeur='mf', coeur_ton='mf', altos='pp', violons2='pp', cor_bouche='mf',
            celles='mp', goutte='p')
    silence = s.m(8)
    # la basse : ré, puis si♭ (la menace)
    for m in (1, 3, 5, 7):
        ch = GRILLE_S2[m - 1]
        s.note(basses, 'D2' if ch == 'i' else 'Bb1', s.m(m), 8 if m < 7 else 4, vel=70)
        s.note(sub, 'D2' if ch == 'i' else 'Bb1', s.m(m), 8 if m < 7 else 4, vel=60)
    # le cœur à chaque temps ; il se tait avec tout le monde à la mesure 8, et revient seul
    battements(s, 0, silence, 'L d . . L d . . L d . . L d . .', vel=88)
    battements(s, s.m(8, 4), s.m(9), 'L d . .', vel=84)
    # les trémolos de la menace (i – ♭vi), pianissimo, qui enflent un peu
    tenus(s, altos, GRILLE_S2, ACC, vel=74, jusqua=silence)
    tenus(s, violons2, GRILLE_S2, ACC_HAUT, vel=70, jusqua=silence)
    s.expression(altos, [(0, 'pp'), (s.m(7, 4), 'mp')])
    s.expression(violons2, [(0, 'pp'), (s.m(7, 4), 'p')])
    # le balancier sous ré mineur ; sous si♭ mineur, les violoncelles tiennent le si♭ (la
    # mèche devient la fondamentale de la menace)
    for m in (1, 5):
        balancier(s, m, m + 1, vel=76)
    for m in (3, 7):
        s.note(celles, 'Bb2', s.m(m), 8 if m < 7 else 4, vel=74)
    # la tête renversée, au cor bouché, sur ré mineur
    s.joue(cor_bouche, TETE_RENVERSEE, a=s.m(1, 4), vel=92)
    s.joue(cor_bouche, TETE_RENVERSEE, a=s.m(5, 4), vel=96)
    # la goutte
    s.note(goutte, 'D6', s.m(2, 3), 1, vel=50)
    s.note(goutte, 'Db6', s.m(4, 1.5), 1, vel=48)
    s.note(goutte, 'D6', s.m(6, 3), 1, vel=52)


GRILLE_S3 = grille('i i II II i i II i')


@theme.section('S3', mesures=8)
def S3(s):
    nuances(s, cors='f', trombones='f', basses='mf', celles_trem='mf', piano='mf', coeur='f', coeur_ton='f',
            violons='p', timb_roul='mf')
    coupe = s.m(8, 3)
    # le premier temps : le braam sur ré, la timbale, le métal
    s.note(braam, 'D2', 0, 3, vel=112)
    s.note(coeur_ton, 'D2', 0, 1, vel=104)
    s.note(archet, 'C4', 0, 8, vel=92)
    # la pédale ; le piano grave en octaves : ré, puis mi♭ (la paire phrygienne)
    s.note(basses, 'D2', 0, coupe, vel=80)
    s.note(sub, 'D2', 0, coupe, vel=68)
    for m, ch in enumerate(GRILLE_S3, start=1):
        r = 'D' if ch == 'i' else 'Eb'
        fin_m = min(s.m(m + 1), coupe)
        for h in (f'{r}1', f'{r}2'):
            s.note(piano, h, s.m(m), fin_m - s.m(m), vel=86)
    # les violoncelles en trémolo sur l'harmonie (ré m – mi♭ sur ré)
    for m, ch in enumerate(GRILLE_S3, start=1):
        hs = ('D3', 'A3') if ch == 'i' else ('Eb3', 'Bb3')
        for h in hs:
            s.note(celles_trem, h, s.m(m), min(s.m(m + 1), coupe) - s.m(m), vel=86)
    s.crescendo(celles_trem, 0, s.m(7), 'mf', 'f')
    # le violon tenu, très haut : le fil qui siffle
    s.note(violons, 'A5', s.m(3), s.m(7) - s.m(3), vel=70)
    s.note(violons, 'Bb5', s.m(7), coupe - s.m(7), vel=74)
    # les quatre cors : la mèche, ouverte, forte ; elle ne se résout pas (m. 3 et m. 7)
    s.joue(cors, MECHE_HAUTE, a=s.m(2, 4), vel=110, art='tenu')
    s.joue(cors, MECHE_HAUTE.coupe(0, 7), a=s.m(6, 4), vel=116, art='tenu')
    # les trombones répondent : la tête renversée, à l'octave grave (m. 5)
    s.joue(trombones, TETE_RENVERSEE.octave(-1), a=s.m(4, 4), vel=104)
    s.joue(trombones, TETE_RENVERSEE.octave(-1).coupe(0, 3), a=s.m(8) - 1, vel=100)
    # le cœur s'emballe
    battements(s, 0, s.m(5), 'L d . . L d . . L d . . L d . .', vel=94)
    battements(s, s.m(5), coupe, 'L d L d L d L d L d L d L d L d', vel=98)
    # la fin : le roulement enfle et tout se coupe au 3ᵉ temps de la mesure 8
    s.note(timb_roul, 'D2', s.m(7), coupe - s.m(7), vel=96)
    s.crescendo(timb_roul, s.m(7), coupe, 'mf', 'ff')
    s.crescendo(cors, s.m(6, 4), coupe, 'f', 'ff')


@theme.section('S4', mesures=4, reprise=False)
def S4(s):
    nuances(s, basses='ppp', sub='mp', coeur='pp', coeur_ton='pp', tamtam='mp', goutte='pp')
    # la lumière saute, dans le silence : l'arc, à découvert
    arc.poser(s, 0.5, impact=True)
    # un cœur lointain, une pédale à peine
    battements(s, s.m(2), s.longueur, 'L d . . . . . . L d . . . . . .', vel=70)
    s.note(basses, 'D2', s.m(2), 12, vel=50)
    s.note(sub, 'D2', s.m(2), 12, vel=50)
    # le tam-tam gratté, la goutte
    s.note(tamtam, 'C4', s.m(3), 6, vel=70)
    s.note(goutte, 'D6', s.m(4, 2), 1, vel=42)


GRILLE_S5 = grille('i i vi vi i i vi vi')


@theme.section('S5', mesures=8)
def S5(s):
    nuances(s, piano='mf', celles_pizz='mf', voix='mp', altos='pp', basses='p', coeur='mf', coeur_ton='mf',
            sub='mf')
    # le piano grave : ré – mi♭ obstinés (la paire phrygienne), longue-brève
    for m in range(1, 9):
        r = 'D' if GRILLE_S5[m - 1] == 'i' else 'Bb'
        s.note(piano, f'{r}1', s.m(m), 3, vel=84)
        s.note(piano, f'{r}2', s.m(m), 3, vel=80)
        voisin = 'Eb' if r == 'D' else 'Cb'
        s.note(piano, f'{voisin}2', s.m(m, 4), 1, vel=72)
    # la basse et la sous-basse sur les fondamentales
    for m in (1, 3, 5, 7):
        i = GRILLE_S5[m - 1] == 'i'
        s.note(basses, 'D2' if i else 'Bb1', s.m(m), 8, vel=66)
        s.note(sub, 'D2' if i else 'Bb1', s.m(m), 8, vel=58)
    # le cœur à chaque temps ; les violoncelles en pizzicato sur ses premiers coups
    battements(s, 0, s.longueur, 'L d . . L d . . L d . . L d . .', vel=86)
    for m in range(1, 9):
        r = 'D3' if GRILLE_S5[m - 1] == 'i' else 'Bb2'
        for t in (1, 3):
            s.note(celles_pizz, r, s.m(m, t), 1, vel=74)
    # ♭vi aux altos ; la voix seule fredonne la tête renversée (m. 2 et m. 6)
    tenus(s, altos, GRILLE_S5, ACC, vel=70)
    s.expression(altos, [(0, 'pp'), (s.m(8, 4), 'p')])
    s.joue(voix, TETE_RENVERSEE, a=s.m(1, 4), vel=84)
    s.joue(voix, TETE_RENVERSEE, a=s.m(5, 4), vel=88)
    s.expression(voix, [(0, 'mp'), (s.m(6), 'mf'), (s.m(8), 'mp')])


GRILLE_S6 = grille('i i vi vi II II i i')
CHORAL_TROMB = {'i': ['D3', 'F3', 'A3'], 'vi': ['Db3', 'F3', 'Bb3'], 'II': ['Eb3', 'G3', 'Bb3']}
CHORAL_TUBA = {'i': 'D2', 'vi': 'Bb1', 'II': 'Eb2'}


@theme.section('S6', mesures=8)
def S6(s):
    nuances(s, trombones='mp', tuba='mp', cors='mf', basses='mp', coeur='mf', coeur_ton='mf', archet='mp',
            timb_roul='p', sub='mf')
    # le choral des cuivres graves, deux mesures par accord
    tenus(s, trombones, GRILLE_S6, CHORAL_TROMB, vel=88)
    s.expression(trombones, [(0, 'mp'), (s.m(5), 'mf'), (s.m(7), 'mp')])
    for m in (1, 3, 5, 7):
        h = CHORAL_TUBA[GRILLE_S6[m - 1]]
        s.note(tuba, h, s.m(m), 8, vel=84)
        s.note(basses, h, s.m(m), 8, vel=70)
        s.note(sub, h, s.m(m), 8, vel=58)
    # la mèche aux cors bouchés, sur ♭vi (le si♭ en est la fondamentale) puis ♭II (sa quinte)
    s.joue(cors, MECHE_HAUTE, a=s.m(2, 4), vel=96, art='sourdine')
    # le cœur ; le métal frotté sur ♭II
    battements(s, 0, s.longueur, 'L d . . L d . . L d . . L d . .', vel=86)
    s.note(archet, 'C4', s.m(5), 8, vel=84)
    # la relance : le roulement de timbales sur ré, qui enfle jusqu'au premier temps de S1
    s.note(timb_roul, 'D2', s.m(7), 8, vel=88)
    s.crescendo(timb_roul, s.m(7), s.m(9), 'pp', 'mf')


theme.forme(intro=['intro'], corps=['S1', 'S2', 'S3', 'S4', 'S5', 'S6'])
