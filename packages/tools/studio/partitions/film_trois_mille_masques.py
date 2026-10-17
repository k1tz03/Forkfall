"""FUSIBLE — la musique du film « Trois mille masques » (film_trois_mille_masques), livre 1.

Le film (packages/tools/web/cinema/films/trois_mille_masques.js, 41,0 s) : la veille du premier
match à la Rive. La rue du Port à 23 h 40, la presse des Cartonnages qui imprime ton visage par
quatre, l'épreuve pendue sous l'ampoule, les masques qui sèchent dans la cour (Gégé : « Trois
mille. Personne n'en parle avant le coup d'envoi. »), la Nord vide dont les pylônes s'allument un
à un, le tifo, et, comme en rêve, trois mille masques qui se lèvent au coup de sifflet ; puis
l'escalier du club-house, la photo de 1974, le cinquième visage gratté ; « Aubérive · 1990 ».

La musique est un chapitre du thème du livre (« Trois mille masques », livre_h1) : ré mineur, la
tribune (l'instrument `foule`), le tambour de la Nord, la voix seule (« la tienne »), le motif
« Fusible » dans sa robe du livre. Sa forme suit les plans :
  - la presse imprime la tête du motif, UNE NOTE PAR COUP : ré au premier coup (« fu »), la au
    second (« si »), si♭ au troisième (« BLE », la mèche), le « ta-ta » des toms de la Nord entre
    deux coups ; le claquement de la presse est le bruit du film, la musique ne le double pas ;
  - l'épreuve sous l'ampoule : la mèche tenue aux violons, qui retombe sur la (♭6 → 5) ;
  - la cour, sous la réplique de Gégé : la pédale, la rumeur des masques, presque rien ;
  - la Nord : chaque pylône qui claque (le bruit du film) allume une voix de cordes, qui entre
    pianissimo avec lui (le claquement reste à découvert) ; la timbale et la cymbale suspendue enflent jusqu'au tifo ;
  - le tifo et les trois mille : le tambour de la Nord (BOUM… ta-ta), ♭VI puis ♭VII, les arpèges
    qui montent, la rumeur de la tribune ; au flash, le coup ; « fu-si » au dernier temps ;
  - LE COUP DE SIFFLET (29,25 s, le bruit du film) : « BLE », la tribune chante le motif avec ses
    cuivres (si♭ ── fa mi | sol ré), sans cymbale sous le sifflet ;
  - la coupe au noir (32,6 s) : l'arc (la mèche qui saute, le rêve qui finit) ; l'escalier, la
    voix seule chante la tête (ré la | SI♭) devant la photo ; au titre, si♭ retombe sur la ;
    le fondu au noir.

LA FEUILLE DE SYNCHRONISATION (temps du film → mesure et temps de la musique ; l'intro dure le
film, 41,0 s, fondu compris ; chaque section a son tempo, pour que les coups tombent sur des temps) :
  section       mesure  tempo     de → à (s)       ce qui tombe
  rue           2/4×7   138,16    0,00 → 6,08      la coupe sur la presse (5,20) : m. 7, 1ᵉʳ temps (5,211)
  presse        4/4×2   141,18    6,08 → 9,48      coups de presse 6,08 · 7,78 sur les premiers temps
  mache         1/4×1   115,38    9,48 → 10,00     3ᵉ coup 9,48 : « BLE »
  epreuve       3/4×2   120       10,00 → 13,00    la coupe sur l'épreuve 10,00
  cour          4/4×3   120       13,00 → 19,00    le fondu sur la cour 13,00 ; Gégé 14,00 (m. 1, 3ᵉ temps)
  nord          4/4×2   104,35    19,00 → 23,60    le noir sur la Nord 19,00 ; pylônes 19,5 · 20,2 ·
                                                   21,30 (m. 2, 1ᵉʳ temps) · 22,75 (m. 2, 3ᵉ temps et demi)
  tifo, tifo2   4/4, 5/4 138,05   23,60 → 27,51    la coupe sur le tifo 23,60
  trois_mille   4/4×1   138,05    27,51 → 29,25    le flash 27,50 (+11 ms) ; « fu-si » au 4ᵉ temps
  vague         7/4×1   125,37    29,25 → 32,60    le sifflet, la vague des masques 29,25 : « BLE »
  escalier      3/4×2   72        32,60 → 37,60    le noir sur l'escalier 32,60 : l'arc
  titre         4/4×1   70,59     37,60 → 41,00    le titre 37,60 : si♭ → la ; le fondu 39,60 → 41,00
Le corps : une traîne de seize secondes (la pédale de ré, la quinte, la nappe), que le jeu ne
reprend pas et ne boucle que si le film dure plus que prévu.
"""
from moteur.ecriture import *
from partitions._fusible import phrase, Arc

theme = Theme('film_trois_mille_masques', 'Trois mille masques', bpm=120, mesure='4/4', tonalite='ré mineur',
              graine=1974, ville=False, boucle_min=0, moment='le film « Trois mille masques », livre 1',
              humeur='la veille du match : la presse, la cour, la Nord, trois mille fois ton visage')
theme.master(sonie_sur='intro')

TON = 'ré mineur'
arc = Arc(theme)

# --- le bruissement du papier (le souffle d'une feuille), repris du thème du livre ----------------
_SOUFFLE = {'osc': [], 'bruit': 1.0, 'sub': 0.0,
            'filtre': {'type': 'bande', 'q': 0.9, 'coupure': 523.2, 'suivi': 1.0, 'env': 1.2,
                       'a': 0.04, 'd': 0.35, 's': 0.0, 'r': 0.1},
            'amp': {'a': 0.03, 'd': 0.45, 's': 0.0, 'r': 0.15}, 'velocite': 0.7, 'vel_filtre': 0.0}
papier = theme.piste('papier', 'arpege_synthe', synthe=_SOUFFLE, largeur=1.0, volume=-6, bus='conception',
                     humain=0, salle=0.22, plaque=0.1, eq={'passe_haut': 400, 'passe_bas': 6000})

# --- la tribune, la voix -----------------------------------------------------------------------------
foule = theme.piste('foule', 'foule', art='ah', volume=7)
rumeur = theme.piste('rumeur', 'foule', art='rumeur', volume=0)
voix = theme.piste('voix', 'trombones', art='vibrato', unisson=1, pan=-0.12, profondeur=0.3, salle=0.32, volume=1)

# --- les cuivres --------------------------------------------------------------------------------------
cors = theme.piste('cors', art='tenu', volume=4)
trombones = theme.piste('trombones', art='tenu', volume=2)
tuba = theme.piste('tuba', art='tenu', volume=-5)

# --- les cordes ---------------------------------------------------------------------------------------
celles_chant = theme.piste('celles_chant', 'violoncelles', art='tenu', pan=0.25, volume=3)
celles = theme.piste('celles', 'violoncelles', art='tremolo', volume=0)
altos = theme.piste('altos', art='tremolo', volume=1)
violons2 = theme.piste('violons2', 'violons', art='tremolo', pan=-0.22, volume=-1)
violons = theme.piste('violons', art='staccato', bref=0.18, volume=0)
violons_tr = theme.piste('violons_tr', 'violons', art='tremolo', pan=-0.4, volume=-1)
basses = theme.piste('basses', 'basses_film', art='tenu', volume=0)

# --- les percussions : le tambour de la Nord, la timbale, les cymbales ---------------------------------
tambour = theme.piste('tambour', 'grosse_caisse', volume=-3)
tom = theme.piste('tom', 'toms', volume=-5)
timbales = theme.piste('timbales', volume=-2)
timb_roul = theme.piste('timb_roul', 'timbales', art='roulement', volume=0)
cymbales = theme.piste('cymbales', volume=-4)
suspendue = theme.piste('suspendue', 'cymbale_suspendue', volume=-8)

# --- 1990 : la nappe, la sous-basse --------------------------------------------------------------------
nappe = theme.piste('nappe', 'nappe_synthe', volume=-10, synthe={'filtre': {'coupure': 900.0}})
sub = theme.piste('sub', 'sub_synthe', volume=-16)


def nuances(s, **niveaux):
    for nom_piste, v in niveaux.items():
        s.nuance(theme.pistes[nom_piste], v, 0)


TETE = phrase('tete', TON, octave=3)                 # ré3 la3 | si♭3 (3 temps)
MOTIF = phrase('motif', TON, octave=3)               # ré3 la3 | si♭3 ── fa3 mi3 | sol3 ré3
ANACROUSE = phrase('anacrouse', TON, octave=3)       # ré3 la3


def accord(s, piste, hauteurs, a, d, vel=70, art=None):
    for h in hauteurs:
        s.note(piste, h, a, d, vel=vel, art=art)


def ta_ta(s, a, vel=88):
    """Le « ta-ta » de la Nord (les toms, deux croches), qui appelle le coup suivant."""
    s.note(tom, 'A2', a, 0.5, vel=vel)
    s.note(tom, 'A2', a + 0.5, 0.5, vel=vel - 6)


# =====================================================================================
# L'introduction : le film

@theme.section('rue', mesures=7, bpm=14 * 60 / 6.08, mesure='2/4')
def rue(s):
    """0,00 → 6,08 : la rue du Port, du noir ; la pédale de ré, la quinte de la nuit ; le « ta-ta »
    des toms sur la coupe (5,21) appelle le premier coup de presse."""
    nuances(s, basses='pp', sub='pp', celles_chant='p', altos='p', nappe='pp', tom='mf')
    s.note(basses, 'D2', 0, 14, vel=66)
    s.crescendo(basses, 0, 12, 'pp', 'p')
    s.note(sub, 'D2', 0, 14, vel=52)
    s.note(celles_chant, 'D3', 2, 12, vel=56)
    s.note(altos, 'A3', 4, 8, vel=56)
    accord(s, nappe, ['D4', 'F4'], 2, 10, vel=56)
    # m. 7 : la coupe sur la presse ; « ta – ta » → le coup (6,08)
    s.note(tom, 'D3', 12, 1, vel=80)
    s.note(tom, 'A2', 13, 1, vel=86)


@theme.section('presse', mesures=2, bpm=8 * 60 / 3.4)
def presse(s):
    """6,08 → 9,48 : la presse ; « fu » (ré) au premier coup, « si » (la) au second ; le « ta-ta »
    entre deux coups ; la timbale qui roule vers le troisième."""
    nuances(s, trombones='mp', celles_chant='mp', basses='mp', tom='mf', timb_roul='pp', sub='p')
    for b, h_tb, h_vc, h_cb in ((0, 'D3', 'D3', 'D2'), (4, 'A2', 'A2', 'A1')):
        s.note(trombones, h_tb, b, 3.6, vel=90)
        s.note(celles_chant, h_vc, b, 3.8, vel=84)
        s.note(basses, h_cb, b, 3.9, vel=84)
        s.note(sub, h_cb, b, 3.9, vel=54)
    ta_ta(s, 3, vel=86)
    ta_ta(s, 7, vel=92)
    s.note(timb_roul, 'D2', 4, 3.85, vel=80)
    s.crescendo(timb_roul, 4, 7.85, 'pp', 'mf')


@theme.section('mache', mesures=1, bpm=60 / 0.52, mesure='1/4')
def mache(s):
    """9,48 → 10,00 : le troisième coup : « BLE », la mèche (si♭), tenue."""
    nuances(s, trombones='f', celles_chant='f', basses='f', cors='mf', sub='p')
    s.note(trombones, 'A#2', 0, 3.4, vel=98)            # tenu dans l'épreuve (jusqu'à 11,5 s)
    s.note(celles_chant, 'A#2', 0, 3.5, vel=90)
    s.note(basses, 'A#1', 0, 3.5, vel=90)
    s.note(cors, 'A#3', 0, 3.4, vel=88)
    s.note(sub, 'A#1', 0, 3.5, vel=56)


@theme.section('epreuve', mesures=2, bpm=120, mesure='3/4')
def epreuve(s):
    """10,00 → 13,00 : l'épreuve sous l'ampoule ; la mèche aux violons, qui retombe sur la
    (m. 2, 11,5 s) ; une feuille qui tourne (le souffle du papier)."""
    nuances(s, violons2='pp', basses='p', cors='mp', celles_chant='mp', nappe='pp')
    s.note(papier, 'A4', 0, 1.2, vel=80)
    s.note(violons2, 'A#4', 0, 3, vel=62)
    s.note(violons2, 'A4', 3, 3, vel=58)
    s.crescendo(violons2, 0, 3, 'pp', 'p')
    s.diminuendo(violons2, 3, 6, 'p', 'pp')
    s.note(cors, 'A3', 3 - 0.1, 2.9, vel=70)
    s.diminuendo(cors, 3, 6, 'mp', 'pp')
    s.note(celles_chant, 'A2', 3, 3, vel=64)
    s.note(basses, 'D2', 3, 3, vel=60)
    accord(s, nappe, ['D4', 'F4', 'A4'], 3, 3, vel=52)


@theme.section('cour', mesures=3, bpm=120)
def cour(s):
    """13,00 → 19,00 : la cour, sous la pluie, les masques sur la corde ; la réplique de Gégé (14,0
    → 18,7) : presque rien — la pédale, la rumeur des masques, une note de violons très haut."""
    nuances(s, basses='pp', sub='pp', rumeur='pp', violons2='pp', nappe='pp')
    s.note(basses, 'D2', 0, 11.4, vel=60)
    s.note(sub, 'D2', 0, 11.4, vel=46)
    s.note(rumeur, 'D3', 0, 11.4, vel=70)
    s.note(violons2, 'D5', 1, 9.8, vel=48)
    accord(s, nappe, ['D4', 'A4'], 0, 11.4, vel=46)
    for p in (basses, rumeur, violons2):
        s.diminuendo(p, 9, 11.4, 'pp', 'ppp')


@theme.section('nord', mesures=2, bpm=8 * 60 / 4.6)
def nord(s):
    """19,00 → 23,60 : la Nord, vide ; chaque pylône qui claque (19,5 · 20,2 · 21,3 · 22,75 : le bruit
    du film) allume une voix de cordes, qui entre pianissimo avec lui ; la timbale et la cymbale suspendue
    enflent jusqu'au tifo ; la rumeur de la tribune monte."""
    b = 4.6 / 8                                         # une noire, en secondes
    nuances(s, celles='pp', altos='pp', violons2='pp', violons_tr='pp', timb_roul='pp', rumeur='pp', basses='p')
    s.note(basses, 'D2', 0, 8, vel=66)
    s.note(timb_roul, 'D2', 0, 8, vel=84)
    s.crescendo(timb_roul, 0, 8, 'pp', 'mf')
    for t_film, piste, hs in ((19.5, celles, ['D3']), (20.2, altos, ['A3']), (21.3, violons2, ['D4', 'F4']),
                              (22.75, violons_tr, ['A4', 'D5'])):
        a = (t_film - 19.0) / b
        accord(s, piste, hs, a, 8 - a, vel=72)
        s.crescendo(piste, a, 8, 'pp', 'mf')
    s.note(rumeur, 'D3', 0, 8, vel=82)
    s.crescendo(rumeur, 0, 8, 'pp', 'mf')
    s.note(suspendue, 'C4', 8 - 4.0 / b, 4.0 / b, vel=92, art='monte_4s')


@theme.section('tifo', mesures=1, bpm=13 * 60 / 5.65)
def tifo(s):
    """23,60 → 25,34 : le tifo se déroule : le tambour de la Nord (BOUM… ta-ta), ♭VI, les arpèges
    qui montent, la tribune qui gronde."""
    nuances(s, tambour='f', tom='f', cors='mf', basses='mf', violons='mp', celles='mf', rumeur='mf', timb_roul='mf')
    s.note(tambour, 'K', 0, 1, vel=104)
    ta_ta(s, 3, vel=96)
    accord(s, cors, ['A#3', 'D4', 'F4'], 0, 4, vel=88)
    s.note(basses, 'A#1', 0, 4, vel=86)
    s.note(celles, 'A#2', 0, 4, vel=80)
    s.joue(violons, arpege(['A#3', 'D4', 'F4', 'A#4'], '1 2 3 4 2 3 4 3 1 2 3 4 2 3 4 3', pas=0.25, vel=86,
                           art='staccato'))
    s.note(rumeur, 'D3', 0, 4, vel=92)
    s.note(timb_roul, 'A#2', 0, 4, vel=84)


@theme.section('tifo2', mesures=1, bpm=13 * 60 / 5.65, mesure='5/4')
def tifo2(s):
    """25,34 → 27,51 : ♭VII, les arpèges plus haut, la tribune qui monte vers le flash."""
    nuances(s, tambour='f', tom='f', cors='mf', basses='mf', violons='mf', rumeur='f', timb_roul='mf')
    s.note(tambour, 'K', 0, 1, vel=106)
    s.note(tambour, 'K', 2, 1, vel=96)
    ta_ta(s, 4, vel=100)
    accord(s, cors, ['C4', 'E4', 'G4'], 0, 5, vel=92)
    s.note(basses, 'C2', 0, 5, vel=88)
    s.note(celles, 'C3', 0, 5, vel=84)
    s.joue(violons, arpege(['C4', 'E4', 'G4', 'C5'], '2 3 4 3 2 3 4 3 3 4 3 4 3 4 3 4 4 3 4 3', pas=0.25, vel=90,
                           art='staccato'))
    s.crescendo(violons, 0, 5, 'mf', 'f')
    s.note(rumeur, 'D3', 0, 5, vel=100)
    s.crescendo(rumeur, 0, 5, 'f', 'ff')
    s.note(timb_roul, 'C2', 0, 5, vel=90)
    s.crescendo(timb_roul, 0, 5, 'mf', 'f')
    s.note(suspendue, 'C4', 5 - 2.0 / (5.65 / 13), 2.0 / (5.65 / 13), vel=96, art='monte_2s')


@theme.section('trois_mille', mesures=1, bpm=13 * 60 / 5.65)
def trois_mille(s):
    """27,51 → 29,25 : le flash, les trois mille sortent de l'ombre : le coup ; les toms ; au dernier
    temps la tribune et ses cuivres, « fu-si »."""
    nuances(s, tambour='ff', timbales='ff', cymbales='f', tom='f', foule='f', trombones='f', cors='f',
            celles_chant='f', rumeur='ff', basses='f')
    s.note(tambour, 'K', 0, 1, vel=118)
    s.note(timbales, 'D2', 0, 1, vel=116)
    s.note(cymbales, 'C4', 0, 2, vel=110)
    s.note(basses, 'C2', 0, 3, vel=92)
    accord(s, cors, ['C4', 'E4', 'G4'], 0, 3, vel=96)
    s.joue(tom, grille('x x x x x x x x X X X X', ['A2', 'D3'], pas=0.25, vel=96))
    s.crescendo(tom, 0, 3, 'mf', 'ff')
    s.note(rumeur, 'D3', 0, 3.9, vel=104)
    # « fu-si » : la tribune, les trombones, les violoncelles ; les cors à l'octave
    s.joue(foule, ANACROUSE, a=3, vel=110)
    s.joue(trombones, ANACROUSE, a=3, vel=100)
    s.joue(celles_chant, ANACROUSE, a=3, vel=96)
    s.joue(cors, ANACROUSE.octave(1), a=3, vel=100)


@theme.section('vague', mesures=1, bpm=7 * 60 / 3.35, mesure='7/4')
def vague(s):
    """29,25 → 32,60 : le coup de sifflet (le bruit du film), la vague des masques : « BLE », la
    tribune chante le motif (si♭ ── fa mi | sol ré), ♭VI ── ♭VII | i ; pas de cymbale sous le
    sifflet (le choc au deuxième temps) ; tout s'arrête à la coupe au noir."""
    nuances(s, foule='ff', trombones='f', cors='f', celles_chant='f', tambour='f', timbales='f', basses='f',
            tuba='f', cymbales='f', tom='f')
    chute = MOTIF.coupe(1, 8)                           # si♭3 (3) fa3 mi3 | sol3 ré3 (1,75)
    s.joue(foule, chute, vel=114)
    s.joue(trombones, chute, vel=104)
    s.joue(celles_chant, chute, vel=100)
    s.joue(cors, chute.octave(1), vel=102)
    # la cellule : ♭VI trois temps, ♭VII à vide (sous « fa mi »), ré mineur (sous « sol ré »)
    for a, d, h in ((0, 3, 'A#1'), (3, 1, 'C2'), (4, 2.8, 'D2')):
        s.note(basses, h, a, d, vel=96)
        s.note(tuba, h, a, d, vel=92)
    s.note(tambour, 'K', 0, 1, vel=112)
    s.note(timbales, 'A#2', 0, 1, vel=112)
    s.note(cymbales, 'C4', 1, 2, vel=104)
    ta_ta(s, 3, vel=100)
    s.note(tambour, 'K', 4, 1, vel=108)
    s.note(timbales, 'D2', 4, 1, vel=106)


@theme.section('escalier', mesures=2, bpm=72, mesure='3/4')
def escalier(s):
    """32,60 → 37,60 : la coupe au noir : l'arc (la mèche qui saute, le rêve qui finit) ; l'escalier,
    la photo de 1974 ; la voix seule chante la tête (ré la | SI♭) devant le cinquième visage."""
    nuances(s, basses='pp', celles_chant='pp', voix='mf', nappe='pp', sub='pp')
    arc.poser(s, 0, impact=True, vel=116)
    s.note(basses, 'D2', 0.5, 5.5, vel=62)
    s.note(sub, 'D2', 0.5, 5.5, vel=46)
    s.note(celles_chant, 'D3', 1, 5, vel=56)
    s.joue(voix, TETE, a=2, vel=92)                    # ré (2) la (2,5) | si♭ (3 → 6)
    accord(s, nappe, ['D4', 'F4'], 3, 3, vel=50)


@theme.section('titre', mesures=1, bpm=4 * 60 / 3.4)
def titre(s):
    """37,60 → 41,00 : le titre : si♭ retombe sur la (♭6 → 5) ; la rumeur, très loin ; le fondu au
    noir (39,6 → 41,0) : tout s'éteint avant la fin."""
    nuances(s, voix='mp', basses='pp', celles_chant='pp', nappe='pp', rumeur='pp')
    s.note(voix, 'A3', 0, 3.0, vel=80)
    s.diminuendo(voix, 0, 3.0, 'mp', 'pp')
    s.note(basses, 'D2', 0, 3.6, vel=58)
    s.note(celles_chant, 'A2', 0, 3.6, vel=52)
    accord(s, nappe, ['D4', 'F4', 'A4'], 0, 3.6, vel=48)
    s.note(rumeur, 'D3', 0, 3.6, vel=60)
    for p in (basses, celles_chant, nappe, rumeur):
        s.diminuendo(p, 2.0, 3.6, 'pp', 'ppp')


# =====================================================================================
# Le corps : la traîne (si le film dure plus que prévu)

@theme.section('traine', mesures=4, bpm=60, reprise=False)
def traine(s):
    nuances(s, basses='ppp', celles_chant='ppp', nappe='ppp')
    s.note(basses, 'D2', 0, 16, vel=50)
    s.note(celles_chant, 'A2', 0, 16, vel=46)
    accord(s, nappe, ['D4', 'F4', 'A4'], 0, 16, vel=44)


theme.forme(intro=['rue', 'presse', 'mache', 'epreuve', 'cour', 'nord', 'tifo', 'tifo2', 'trois_mille', 'vague',
                   'escalier', 'titre'],
            corps=['traine'])
