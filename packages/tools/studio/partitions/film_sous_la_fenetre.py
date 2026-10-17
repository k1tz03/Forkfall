"""FUSIBLE — la musique du film « L'homme sous la fenêtre » (film_sous_la_fenetre), livre 1.

Le film (packages/tools/web/cinema/films/sous_la_fenetre.js, 35,6 s) : la fin de la première
saison, rue des Lilas, mardi, minuit. Ta fenêtre allumée au troisième ; en bas, entre deux
voitures, sous le réverbère, un homme immobile. Le radio-réveil passe de 23:59 à 00:00 ; l'homme,
de dos, les mains jointes dans le dos (ta façon de te tenir sur le banc) ; Camille : « Il se tient
comme toi sur le banc. Les mains dans le dos. » ; son visage, le tien, imprimé, mouillé ; une main
éteint la lampe (le clic) ; une voiture passe, ses phares le prennent, il ne bouge pas ; le regard
se resserre sur le masque qui te regarde ; « Aubérive · 1991 ».

La musique est la section « sous la fenêtre » du thème du livre (livre_h1), écrite sous les
images : la nuit en ré mineur sur sa pédale, le battement de cœur (la grosse caisse et la boîte à
rythmes de 1990), le piano du creux, la voix seule (« la tienne ») qui chante la tête droite, la
tribune désaccordée qui répond renversée, très loin :
  - la rue, du noir : la pédale, le battement, presque rien sous le carton du lieu ;
  - MINUIT (7,8 s, le réveil passe à 00:00) : le piano dit la tête renversée (ré4 sol3 | FA#3),
    une note par temps ; sous elle, si♭ mineur sur la pédale de ré ;
  - de dos, sous la réplique de Camille : la pédale, le battement, la tribune qui fredonne au
    loin, rien d'autre ;
  - son visage : le battement s'accélère ; la ligne finie, la voix seule chante la tête (ré la |
    SI♭) et retombe sur la ;
  - LE CLIC (22,7 s, le bruit du film) : tout s'arrête avant lui ; après, une seule note très haut,
    les chiffres rouges ;
  - de la fenêtre : la tribune désaccordée répond, la tête renversée, lente (les trombones à +12
    centièmes) ; LES PHARES (26,6 → 28,6) : la cymbale et les trémolos enflent jusqu'à la voiture
    qui passe (28,6), puis rien : il ne bouge pas ;
  - le masque, le titre (31,6) : la plainte (fa# → fa → mi | sol → ré) sur si♭ mineur, la menace
    (ré♭ sur la pédale de ré) jusqu'au fondu.

LA FEUILLE DE SYNCHRONISATION (l'intro dure le film, 35,6 s ; chaque section son tempo) :
  section    mesure  tempo    de → à (s)       ce qui tombe
  rue        4/4×2   85,71    0,00 → 5,60      le départ, du noir
  minuit     3/4×1   81,82    5,60 → 7,80      le fondu dans la pièce 5,60
  chambre    3/4×1   75       7,80 → 10,20     MINUIT 7,80 : le piano (ré4), sol3 8,60, fa#3 9,40
  dos        3/4×2   66,67    10,20 → 15,60    la coupe 10,20 ; Camille 12,4 → 17,4 (presque rien)
  visage     4/4×2   88,89    15,60 → 21,00    la coupe sur le visage 15,60 ; la voix : ré 17,625,
                                               SI♭ 18,30 (m. 2, 1ᵉʳ temps), la 20,325
  lampe      2/4×1   70,59    21,00 → 22,70    la coupe sur la lampe 21,00
  noir       2/4×1   80       22,70 → 24,20    LE CLIC 22,70
  fenetre    3/4×1   75       24,20 → 26,60    la coupe à la fenêtre 24,20 : la tribune (ré4)
  phares     2/4×1   60       26,60 → 28,60    les phares 26,60
  passe      3/4×1   81,82    28,60 → 30,80    la voiture passe devant lui 28,60
  masque     3/4×2   75       30,80 → 35,60    la coupe sur le masque 30,80 ; le titre 31,60 (fa) ;
                                               le fondu 34,2 → 35,6
Le corps : une traîne de seize secondes (si♭ mineur sur la pédale de ré, pianissimo).
"""
from moteur.ecriture import *
from partitions._fusible import phrase

theme = Theme('film_sous_la_fenetre', "L'homme sous la fenêtre", bpm=80, mesure='4/4', tonalite='ré mineur',
              graine=1991, ville=False, boucle_min=0, moment='le film « L\'homme sous la fenêtre », livre 1',
              humeur='minuit, un homme en bas qui porte ton visage et ne bouge pas')
theme.master(sonie_sur='intro')

TON = 'ré mineur'

# --- la tribune de la nuit, la voix -------------------------------------------------------------------
foule_nuit = theme.piste('foule_nuit', 'foule', art='o', volume=6, eq={'passe_bas': 2600})
trombones_nuit = theme.piste('trombones_nuit', 'trombones', art='tenu', transpose=0.12, profondeur=0.8, volume=4)
voix = theme.piste('voix', 'trombones', art='vibrato', unisson=1, pan=-0.12, profondeur=0.3, salle=0.32, volume=1)

# --- le piano du creux, les cordes ----------------------------------------------------------------------
piano = theme.piste('piano', art='pedale', salle=0.34, volume=10)
celles = theme.piste('celles', 'violoncelles', art='tremolo', volume=0)
celles_chant = theme.piste('celles_chant', 'violoncelles', art='tenu', pan=0.25, volume=3)
altos = theme.piste('altos', art='tremolo', volume=1)
violons2 = theme.piste('violons2', 'violons', art='tremolo', pan=-0.22, volume=-1)
violons_h = theme.piste('violons_h', 'violons', art='tremolo', pan=-0.4, volume=-4)
basses = theme.piste('basses', 'basses_film', art='tenu', volume=0)

# --- le battement de cœur (la grosse caisse, la boîte à rythmes de 1990), la nuit -----------------------
tambour = theme.piste('tambour', 'grosse_caisse', volume=-3)
boite = theme.piste('boite', 'boite_a_rythmes', volume=-8, eq={'passe_bas': 3000})
timb_roul = theme.piste('timb_roul', 'timbales', art='roulement', volume=0)
suspendue = theme.piste('suspendue', 'cymbale_suspendue', volume=-8)
nappe = theme.piste('nappe', 'nappe_synthe', volume=-10, synthe={'filtre': {'coupure': 900.0}})
sub = theme.piste('sub', 'sub_synthe', volume=-16)


def nuances(s, **niveaux):
    for nom_piste, v in niveaux.items():
        s.nuance(theme.pistes[nom_piste], v, 0)


TETE = phrase('tete', TON, octave=3)                       # ré3 la3 | si♭3
TETE_RENV = phrase('tete', TON, octave=4).inverse()        # ré4 sol3 | fa#3 (la mèche à l'envers)


def accord(s, piste, hauteurs, a, d, vel=70, art=None):
    for h in hauteurs:
        s.note(piste, h, a, d, vel=vel, art=art)


def battement(s, a, vel=84, ecart=0.25):
    """Un battement de cœur : « lub-dub », la grosse caisse et la boîte à rythmes de 1990."""
    for p, v in ((tambour, vel), (boite, vel - 4)):
        s.note(p, 'K', a, 0.25, vel=v)
        s.note(p, 'K', a + ecart, 0.25, vel=v - 12)


# =====================================================================================
# L'introduction : le film

@theme.section('rue', mesures=2, bpm=8 * 60 / 5.6)
def rue(s):
    """0,00 → 5,60 : la rue des Lilas, du noir : la pédale, le battement (sous le carton du lieu)."""
    nuances(s, basses='pp', sub='pp', celles_chant='pp', tambour='p', boite='p', nappe='pp')
    s.note(basses, 'D2', 0, 8, vel=64)
    s.crescendo(basses, 0, 8, 'pp', 'p')
    s.note(sub, 'D2', 0, 8, vel=50)
    s.note(celles_chant, 'D3', 1, 7, vel=54)
    for a in (2, 4, 6):
        battement(s, a, vel=76 + 2 * a)


@theme.section('minuit', mesures=1, bpm=3 * 60 / 2.2, mesure='3/4')
def minuit(s):
    """5,60 → 7,80 : le fondu dans la pièce, le réveil à 23:59 : le battement, la nappe."""
    nuances(s, basses='p', celles_chant='pp', nappe='pp', tambour='p', boite='p')
    s.note(basses, 'D2', 0, 3, vel=64)
    s.note(celles_chant, 'D3', 0, 3, vel=54)
    accord(s, nappe, ['D4', 'F4'], 0, 3, vel=50)
    battement(s, 0, vel=84)


@theme.section('chambre', mesures=1, bpm=75, mesure='3/4')
def chambre(s):
    """7,80 → 10,20 : MINUIT : le piano dit la tête renversée, une note par temps (ré4 sol3 fa#3) ;
    si♭ mineur sur la pédale (ré♭ contre ré : la menace)."""
    nuances(s, piano='mp', basses='p', altos='pp', violons2='pp', tambour='p', boite='p')
    for k, n in enumerate(TETE_RENV.notes):
        s.note(piano, n.h, k, 3 - k + (2.0 if k == 2 else 0), vel=66 if k < 2 else 62)
        s.note(piano, n.h - 12, k, 3 - k + (2.0 if k == 2 else 0), vel=46)
    s.note(basses, 'D2', 0, 3, vel=62)
    s.note(altos, 'F3', 2, 1, vel=56)
    s.note(violons2, 'C#4', 2, 1, vel=54)
    battement(s, 0, vel=84)


@theme.section('dos', mesures=2, bpm=6 * 60 / 5.4, mesure='3/4')
def dos(s):
    """10,20 → 15,60 : de dos, les mains jointes ; la réplique de Camille (12,4 → 17,4) : la pédale, le
    battement, la tribune qui fredonne la pédale au loin ; rien d'autre."""
    nuances(s, basses='p', foule_nuit='pp', altos='pp', violons2='pp', tambour='p', boite='p', sub='pp')
    s.note(basses, 'D2', 0, 6, vel=62)
    s.note(sub, 'D2', 0, 6, vel=46)
    s.note(altos, 'F3', 0, 6, vel=52)
    s.note(violons2, 'C#4', 0, 4, vel=50)
    s.note(foule_nuit, 'D3', 0.5, 5.5, vel=64)
    for a in (0, 3):
        battement(s, a, vel=80)


@theme.section('visage', mesures=2, bpm=8 * 60 / 5.4)
def visage(s):
    """15,60 → 21,00 : son visage, le tien : le battement s'accélère ; si♭ mineur enfle ; la réplique
    finie, la voix seule chante la tête (ré 17,6 · la · SI♭ 18,3) et retombe sur la (20,3)."""
    nuances(s, voix='mf', basses='p', celles='pp', altos='pp', violons2='pp', foule_nuit='pp', tambour='mp',
            boite='mp', nappe='pp')
    s.note(basses, 'D2', 0, 8, vel=66)
    accord(s, celles, ['A#2'], 0, 8, vel=62)
    s.note(altos, 'F3', 0, 8, vel=58)
    s.note(violons2, 'C#4', 0, 4, vel=56)
    for p in (celles, altos, violons2):
        s.crescendo(p, 0, 3, 'pp', 'p')
        s.diminuendo(p, 3, 8, 'p', 'pp')
    s.note(foule_nuit, 'D3', 0, 2.8, vel=60)
    s.joue(voix, TETE, a=3, vel=88)                       # ré (3) la (3,5) | si♭ (4 → 7)
    s.note(voix, 'A3', 7, 1, vel=80)
    accord(s, nappe, ['A#3', 'D4'], 4, 3, vel=50)
    for a in (0, 1, 2, 3, 4, 5, 6):
        battement(s, a, vel=80 + (6 if a in (0, 4) else 0), ecart=0.25)


@theme.section('lampe', mesures=1, bpm=2 * 60 / 1.7, mesure='2/4')
def lampe(s):
    """21,00 → 22,70 : la lampe ; une main tourne le bouton : tout s'arrête avant le clic."""
    nuances(s, nappe='pp', basses='pp', celles_chant='pp')
    accord(s, nappe, ['D4', 'F4', 'A4'], 0, 1.8, vel=48)
    s.note(basses, 'D2', 0, 1.8, vel=56)
    s.note(celles_chant, 'A2', 0, 1.8, vel=50)
    for p in (nappe, basses, celles_chant):
        s.diminuendo(p, 0.6, 1.8, 'pp', 'ppp')


@theme.section('noir', mesures=1, bpm=80, mesure='2/4')
def noir(s):
    """22,70 → 24,20 : LE CLIC (le bruit du film) ; il ne reste que les chiffres rouges : une note très
    haut (la mèche renversée, sol♭ sur fa), la pédale à peine."""
    nuances(s, violons_h='ppp', basses='ppp')
    s.note(violons_h, 'F#5', 0.15, 1.85, vel=50)
    s.note(violons_h, 'F5', 0.15, 1.85, vel=46)
    s.crescendo(violons_h, 0.15, 2, 'ppp', 'pp')
    s.note(basses, 'D2', 0.3, 1.7, vel=48)


@theme.section('fenetre', mesures=1, bpm=75, mesure='3/4')
def fenetre(s):
    """24,20 → 26,60 : de la fenêtre, l'homme en bas : la tribune désaccordée répond, la tête renversée,
    lente (ré4 24,2 · sol3 25,0 · FA#3 25,8), les trombones à +12 centièmes ; le battement revient."""
    nuances(s, foule_nuit='p', trombones_nuit='pp', basses='p', violons_h='pp', tambour='p', boite='p', sub='pp')
    for k, n in enumerate(TETE_RENV.notes):
        d = 1 if k < 2 else 7.0                           # fa#3 tenu jusqu'à la plainte (masque, 31,6 s)
        s.note(foule_nuit, n.h, k, d, vel=90)
        s.note(trombones_nuit, n.h, k, d, vel=76)
    s.note(basses, 'D2', 0, 3, vel=62)
    s.note(sub, 'D2', 0, 3, vel=46)
    s.note(violons_h, 'F#5', 0, 2, vel=46)
    s.note(violons_h, 'F5', 0, 2, vel=42)
    battement(s, 0, vel=80)


@theme.section('phares', mesures=1, bpm=60, mesure='2/4')
def phares(s):
    """26,60 → 28,60 : les phares le prennent : la cymbale suspendue et les trémolos enflent jusqu'à la
    voiture qui passe devant lui (28,6)."""
    nuances(s, celles='pp', altos='pp', violons2='pp', timb_roul='pp', basses='p')
    s.note(basses, 'D2', 0, 2, vel=64)
    for p, hs in ((celles, ['A#2']), (altos, ['F3']), (violons2, ['C#4', 'F4'])):
        accord(s, p, hs, 0, 2, vel=74)
        s.crescendo(p, 0, 2, 'pp', 'mf')
    s.note(timb_roul, 'D2', 0, 2, vel=80)
    s.crescendo(timb_roul, 0, 2, 'pp', 'mf')
    s.note(suspendue, 'C4', 0, 2, vel=92, art='monte_2s')


@theme.section('passe', mesures=1, bpm=3 * 60 / 2.2, mesure='3/4')
def passe(s):
    """28,60 → 30,80 : la voiture est passée ; il ne bouge pas : un seul battement, fort, puis la pédale
    et le fa# tenu de la tribune."""
    nuances(s, basses='p', altos='pp', tambour='mf', boite='mf', sub='p')
    battement(s, 0, vel=92)
    s.note(basses, 'D2', 0, 3, vel=64)
    s.note(sub, 'D2', 0, 3, vel=50)
    s.note(altos, 'F3', 0.5, 2.5, vel=50)


@theme.section('masque', mesures=2, bpm=75, mesure='3/4')
def masque(s):
    """30,80 → 35,60 : le regard se resserre sur le masque ; au titre (31,6) la plainte de la nuit :
    fa → mi | sol → ré, sur si♭ mineur (ré♭ sur la pédale de ré : la menace) ; le fondu (34,2)."""
    nuances(s, foule_nuit='mp', trombones_nuit='p', basses='p', altos='pp', violons2='pp', nappe='pp', sub='pp')
    for a, h, d in ((1, 'F3', 1), (2, 'E3', 1), (3, 'G3', 1), (4, 'D3', 1.6)):
        s.note(foule_nuit, h, a, d, vel=86)
        s.note(trombones_nuit, h, a, d, vel=72)
    s.diminuendo(foule_nuit, 3, 5.6, 'mp', 'pp')
    s.diminuendo(trombones_nuit, 3, 5.6, 'p', 'ppp')
    s.note(basses, 'D2', 0, 5.7, vel=60)
    s.note(sub, 'D2', 0, 5.7, vel=46)
    s.note(altos, 'F3', 1, 4.7, vel=54)
    s.note(violons2, 'C#4', 1, 4.7, vel=50)
    accord(s, nappe, ['A#3', 'D4'], 1, 4.7, vel=46)
    for p in (basses, altos, violons2, nappe):
        s.diminuendo(p, 4, 5.7, 'pp', 'ppp')


# =====================================================================================
# Le corps : la traîne

@theme.section('traine', mesures=4, bpm=60, reprise=False)
def traine(s):
    nuances(s, basses='ppp', altos='ppp', violons2='ppp', nappe='ppp')
    # les notes débordent d'une seconde sur le passage suivant : la couture ne s'entend pas
    s.note(basses, 'D2', 0, 17, vel=50)
    s.note(altos, 'F3', 0, 17, vel=46)
    s.note(violons2, 'C#4', 0, 17, vel=44)
    accord(s, nappe, ['A#3', 'D4'], 0, 17, vel=42)


theme.forme(intro=['rue', 'minuit', 'chambre', 'dos', 'visage', 'lampe', 'noir', 'fenetre', 'phares', 'passe',
                   'masque'],
            corps=['traine'])
