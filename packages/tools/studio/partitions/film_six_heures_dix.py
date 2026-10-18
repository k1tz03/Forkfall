"""FUSIBLE — la musique du film « Six heures dix » (livre 8, « L'Oreillette »), écrite sous ses images
(packages/tools/web/cinema/films/six_heures_dix.js, 37,0 s).

Le premier jour, et le premier ordre : l'oreillette dans son étui, sur le bureau du club-house, à six
heures dix, sa diode qui bat avec la voix (« Bonjour. On commence par les ventes ? », la voix d'un
mort) ; le club dans un tableur, le curseur sur VOLLAIRE ; l'escalier, où Vaubourg monte, une
marche, la canne, une marche (« Il lui reste six cent douze jours. ») ; par la fenêtre, le stade à
l'aube, le tableur en reflet sur la vitre ; la bâche de vingt mètres, VOLLAIRE, L'ENFANT DU QUAI ;
la Nord dans la brume. La musique est un chapitre de « L'Oreillette » (livre_h8) : la dorien, la voix
dans l'oreillette (un chœur d'homme dans la bande d'un écouteur, saturé, ses formants de synthèse
dessous, un écho en triolets) qui chante la tête UNE MESURE AVANT l'orchestre : elle prédit, le
monde suit ; la machine qui calcule (des triolets sur une pulsation binaire) ; la voix d'ailleurs
(la majeur — mib majeur, deux majeurs à un triton, la sous-basse qui glisse de l'un à l'autre) ;
l'arc : l'oreillette qui s'allume.

LE TEMPS : 110 à la noire (la mesure = 2,18 s) : le film a été coupé sur les mesures de l'ancien
thème au même tempo, chaque coupe tombe sur une barre de mesure (à moins d'une demi-milliseconde) ;
le dernier plan est coupé au titre : 107,3 jusqu'au titre, 112,5 après. Chaque coupe est un premier
temps.

LA FEUILLE DE SYNCHRO (temps du film → section, mesure.temps ; la musique)
   0,00  le noir, l'étui ouvert               h1 1.1     presque rien : la sous-basse, le verre
   0,25  la diode s'allume                    (h1 1.1,5) l'arc : l'oreillette qui s'allume
   0,55 · 0,82 · 1,09  la voix (0,3-2,0 s)    h1 1.2 · 2,5 · 3  la voix : « la mi | FA# » (la tête)
   2,73 · 3,00 · 3,27  —                      h1 2.2 · 2,5 · 3  le cor la répète, une mesure plus tard
   4,36  coupe : le tableur, VOLLAIRE          h2 1.1     la machine : les triolets (vibraphone), les
                                                          croches de la contrebasse, le tic
   8,73  coupe : l'escalier                    h3 1.1     la machine se tait ; le verre, la cymbale
                                                          frottée (un bourdon sur fa#)
   9,62 · 11,17 · 12,72 · 14,27  la canne de Vaubourg      une timbale très douce, à chaque marche
  10,20 → 14,90  « Il lui reste six cent douze jours. »    presque rien dessous :
  10,36 · 10,64 · 10,91  —                    h3 1.4 · 4,5 · 2.1  la voix : « la mi | FA# »
  12,55 · 12,82 · 13,09  —                    h3 2.4 · 4,5 · 3.1  un violoncelle répond, une mesure après
  14,73 · 15,00  —                            h3 3.4 · 4,5  la voix : l'anacrouse du motif…
  15,27  coupe : le stade à l'aube, par la vitre  h4 1.1  … « FA# » ; la machine revient (le tableur
                                                          en reflet) ; IV – i – IV
  17,46  —                                     h4 2.1     les cordes : le motif, une mesure après
  21,82  coupe : la bâche, VOLLAIRE            h5 1.1     la voix d'ailleurs : la majeur ; la voix
                                                          hachée en triolets pose la mèche (FA#)
  24,00  —                                     h5 2.1     les cors : la mèche, une mesure après
  26,18  —                                     h5 3.1     mib majeur : la sous-basse glisse ; la voix,
                                                          la mèche à l'autre bout du triton (DO)
  28,36  coupe : la Nord, la brume             h6a 1.1    les trombones : DO, une mesure après ; la
                                                          machine s'est tue
  30,04 · 30,32  —                             h6a 1.4 · 4,5  la voix : « la mi »…
  30,60  le titre « Aubérive · 2024 »          h6b 1.1    … « FA# » : la tête, sur i (la sous-basse
                                                          revient sur la) ; le verre, la cymbale frottée
  32,73  —                                     h6b 2.1    les cors répondent, une mesure après
  35,60  le noir commence (1,4 s)              h6b 3.2,6  decrescendo
  37,00  la fin du film                                   la traîne (le corps : la mineur et fa#, tenus)

L'introduction (le film entier) : 37,0 s, sonie réglée sur elle (`sonie_sur='intro'`). Le corps :
`traine`, trois mesures (6,55 s) de la mineur et de sa sixte dorienne, que le jeu boucle si le film
dure plus.
"""
import random

from moteur.ecriture import *
from partitions._fusible import phrase, Arc

theme = Theme('film_six_heures_dix', 'Six heures dix', bpm=110, mesure='4/4', tonalite='la dorien', graine=610,
              ville=False, boucle_min=0, moment='le film « Six heures dix », livre 8',
              humeur="le premier ordre : la voix d'un mort dans l'oreillette, le tableur, la bâche de Vollaire")
theme.master(sonie_sur='intro')

TON = 'la dorien'
# l'écho de la voix est en triolets (une noire de triolet) : même l'écho calcule
theme.salle('echo', temps=2 / 3, retour=0.34)

# --- l'arc (le son de FUSIBLE) : l'oreillette qui s'allume -----------------------------------------
arc = Arc(theme, volume=-6, impact_volume=-12)

# --- la voix dans l'oreillette (la signature) -------------------------------------------------------
OREILLETTE = {'passe_haut': 320, 'passe_bas': 3400, 'cloches': [(1100, 4.0, 1.2), (2600, 5.0, 2.0)]}
_VOIX = {'pan': 0.0, 'largeur': 0.0, 'profondeur': 0.0, 'eq': OREILLETTE, 'humain': 0}
voix = theme.piste('voix', 'choeur', art='ouh', unisson=1, salle=0.04, echo=0.2, sature=0.5, volume=0, **_VOIX)
voix_hachee = theme.piste('voix_hachee', 'choeur', art='ouh', unisson=1, salle=0.04, echo=0.25, sature=0.5,
                          pompe=pompe(0.8, 0.1, source='triolets'), volume=0, **_VOIX)
triolets = theme.piste('triolets', 'boite_a_rythmes', muet=True)       # la porte de la voix hachée
_FORMANT = {'osc': [{'forme': 'scie', 'niveau': 1.0}, {'forme': 'carre', 'niveau': 0.3, 'largeur': 0.3}],
            'sub': 0.0, 'amp': {'a': 0.05, 'd': 0.2, 's': 0.9, 'r': 0.22}, 'velocite': 0.4,
            'vel_filtre': 0.0, 'vibrato': {'prof': 10, 'vit': 5.0, 'delai': 0.3}}
voix_f1 = theme.piste('voix_f1', 'lead_synthe', bus='synthes', volume=-14, pan=0.0, largeur=0.0, echo=0.2,
                      synthe=dict(_FORMANT, filtre={'type': 'bande', 'q': 5.0, 'coupure': 520.0, 'suivi': 0.0,
                                                    'env': 0.0, 'a': 0.01, 'd': 0.1, 's': 1.0, 'r': 0.2}))
voix_f2 = theme.piste('voix_f2', 'lead_synthe', bus='synthes', volume=-17, pan=0.0, largeur=0.0, echo=0.2,
                      synthe=dict(_FORMANT, filtre={'type': 'bande', 'q': 6.0, 'coupure': 1150.0, 'suivi': 0.0,
                                                    'env': 0.0, 'a': 0.01, 'd': 0.1, 's': 1.0, 'r': 0.2}))

# --- l'orchestre ---------------------------------------------------------------------------------
violons = theme.piste('violons', volume=-1)
altos = theme.piste('altos', volume=-1)
celles = theme.piste('celles', 'violoncelles', art='tenu', volume=-1)
celles_tri = theme.piste('celles_tri', 'violoncelles', bref=0.15, volume=-2)       # les triolets
basses = theme.piste('basses', 'contrebasses', bref=0.15, volume=2)              # les croches
cors = theme.piste('cors', art='tenu', volume=0)
trombones = theme.piste('trombones', art='tenu', volume=-1)

# --- le verre, les grains, la pulsation -------------------------------------------------------------
vibra = theme.piste('vibra', 'vibraphone', pan=-0.25, echo=0.12, volume=4)
celesta = theme.piste('celesta', pan=0.3, echo=0.2, volume=2)
grains = theme.piste('grains', 'glockenspiel', pan=0.35, profondeur=0.6, echo=0.5, volume=-4)
verre = theme.piste('verre', 'nappe_gm', art='verre', volume=-4)
kick = theme.piste('kick', 'boite_a_rythmes', volume=-12, eq={'passe_haut': 35})
gcaisse = theme.piste('gcaisse', 'grosse_caisse', volume=-12)
tic = theme.piste('tic', 'boite_a_rythmes', pan=0.2, volume=-7)
timbales = theme.piste('timbales', volume=-4)
archet = theme.piste('archet', 'cymbale_suspendue', art='archet', profondeur=0.85, salle=0.4, volume=-7)
suspendue = theme.piste('suspendue', 'cymbale_suspendue', volume=-8)

# --- la sous-basse immense (elle glisse d'un monde à l'autre) ------------------------------------
sub = theme.piste('sub', 'sub_synthe', volume=-20, glisse=0.5)

theme.bus('cordes', eq={'passe_haut': 32, 'cloches': [(2500, 1.0, 0.7)], 'air': 4.0})
theme.bus('cuivres', eq={'passe_haut': 38, 'boue': -1.0, 'air': 3.0})
theme.bus('choeur', eq={'passe_haut': 120, 'cloches': [(3200, 1.5, 0.8)], 'air': 3.0})

# =====================================================================================
# Le temps : 110 à la noire, une section par plan (début et fin dans le film, tempo, mesure, mesures)
MES = 4 * 60 / 110.0
PLANS = {
    'h1_etui': (0.0, 2 * MES, 110, '4/4', 2),
    'h2_tableur': (2 * MES, 4 * MES, 110, '4/4', 2),
    'h3_escalier': (4 * MES, 7 * MES, 110, '4/4', 3),
    'h4_fenetre': (7 * MES, 10 * MES, 110, '4/4', 3),
    'h5_bache': (10 * MES, 13 * MES, 110, '4/4', 3),
    'h6a_nord': (13 * MES, 30.6, 4 * 60 / (30.6 - 13 * MES), '4/4', 1),
    'h6b_titre': (30.6, 37.0, 12 * 60 / 6.4, '4/4', 3),
}
ORDRE = list(PLANS)


def plan(nom):
    _d, _f, bpm, mes, n = PLANS[nom]
    return theme.section(nom, mesures=n, bpm=bpm, mesure=mes, reprise=False)


def b(s, t):
    """Le temps du film `t` (en secondes) → la position, en temps, depuis le début de la section en
    cours (au-delà de sa fin, à travers les sections suivantes et leurs tempos)."""
    pos = 0.0
    suite = ORDRE[ORDRE.index(s.section.nom):]
    for nom in suite:
        d, f, bpm, _m, _n = PLANS[nom]
        if t <= f + 1e-9 or nom == suite[-1]:
            return pos + (t - d) * bpm / 60.0
        pos += (f - d) * bpm / 60.0


def tenue(s, piste, h, t0, t1, vel=70, art=None, **kw):
    s.note(piste, h, b(s, t0), b(s, t1) - b(s, t0), vel=vel, art=art, **kw)


def courbe(s, piste, points):
    """La nuance d'une piste au fil du film : [(temps du film, nuance)]."""
    s.expression(piste, [(b(s, t), v) for t, v in points])


# =====================================================================================
# Le matériau (celui de « L'Oreillette »)
MOTIF = phrase('motif', TON, octave=3)        # la3 mi4 | fa#4 ── do4 si3 | ré4 la3
MECHE = phrase('meche', TON, octave=3)
TETE = phrase('tete', TON, octave=3)
MECHE_AILLEURS = MECHE.transpose(6)           # mib4 sib4 | DO5 : la mèche à l'autre bout du triton

# Les accords : la basse, les voix tenues, le cycle des triolets (quatre sons de l'accord)
ACCORDS = {
    'i': ('A1', ('A3', 'C4', 'E4'), ('A4', 'C5', 'E5', 'F#5')),
    'IV': ('D2', ('A3', 'D4', 'F#4'), ('A4', 'C5', 'D5', 'F#5')),
    'I': ('A1', ('A3', 'C#4', 'E4'), ('A4', 'C#5', 'E5', 'F#5')),
    '#IV': ('Eb2', ('Bb3', 'Eb4', 'G4'), ('G4', 'Bb4', 'C5', 'Eb5')),
}
# la pulsation binaire : des croches sur la basse, l'octave sur les contretemps de 2 et 4
_CROCHES = ([0, 0, 0, 0, 0, 12, 0, 0], 'X o x o X o x x')
_CROCHES2 = ([0, 0, 0, 12, 0, 0, 0, 12], 'X o x o X o x o')


def croches(s, piste, grille, octave=0, vel=78, art='staccato', de=1, a=None):
    a = a or len(grille)
    for m in range(de, a + 1):
        decal, acc = (_CROCHES, _CROCHES2)[(m - de) % 2]
        acc = acc.split()
        for k in range(8):
            h = hauteur(ACCORDS[grille[m - 1]][0]) + 12 * octave + decal[k]
            v = {'X': vel + 18, 'x': vel, 'o': vel - 18}[acc[k]]
            s.note(piste, h, s.m(m) + k * 0.5, 0.5, vel=v, art=art)


def machine(s, piste, grille, octave=0, vel=70, de=1, a=None, art=None, accent=12):
    """La machine qui calcule : le cycle des quatre sons de l'accord, douze croches de triolet par
    mesure ; chaque temps commence par un autre son (la permutation)."""
    a = a or len(grille)
    for m in range(de, a + 1):
        cyc = ACCORDS[grille[m - 1]][2]
        for k in range(12):
            h = hauteur(cyc[k % 4]) + 12 * octave
            s.note(piste, h, s.m(m) + k / 3.0, 1 / 3.0, vel=vel + (accent if k % 3 == 0 else 0), art=art)


def tenues(s, piste, grille, rangs=(0, 1, 2), octave=0, vel=70, art=None, de=1, a=None):
    """Les voix tenues de la grille, une mesure par accord ; une voix qui garde sa hauteur tient."""
    a = a or len(grille)
    for r in rangs:
        debut, h0 = None, None
        for m in range(de, a + 2):
            x = ACCORDS[grille[m - 1]][1][r] if m <= a else None
            h = hauteur(x) + 12 * octave if x is not None else None
            if h != h0:
                if h0 is not None:
                    s.note(piste, h0, s.m(debut), s.m(m) - s.m(debut), vel=vel, art=art)
                debut, h0 = m, h


def chante(s, motif, a, piste=None, vel=92, formants=True):
    """La voix dans l'oreillette (et, dessous, sa couche de formants : la machine sous la voix)."""
    s.joue(piste or voix, motif, a=a, vel=vel)
    if formants:
        s.joue(voix_f1, motif, a=a, vel=vel)
        s.joue(voix_f2, motif, a=a, vel=vel)


def porte_triolets(s, de, jusqua):
    """Les instants qui hachent la voix : chaque croche de triolet (une piste muette)."""
    k = 0
    while de + k / 3.0 < jusqua - 1e-6:
        s.note(triolets, 'H', de + k / 3.0, 1 / 3.0, vel=60)
        k += 1


def semer_grains(s, de, a, n, notes, vel=40, cle=''):
    """Des poussières de glockenspiel à hasard fixe, sur des sons de l'accord qui sonne."""
    alea = random.Random(f'{s.section.nom}-grains{cle}')
    for _ in range(n):
        t = de + alea.random() * (a - de)
        s.note(grains, hauteur(alea.choice(notes)), t, 0.25, vel=vel + alea.randint(-8, 8))


# =====================================================================================
# Les plans

@plan('h1_etui')
def h1(s):
    """L'étui ouvert, l'oreillette ; la diode s'allume (l'arc) et bat avec la voix : la voix chante la
    tête ; le cor la répète une mesure plus tard (le monde suit)."""
    for p, v in ((voix_f1, 'fff'), (voix_f2, 'fff'), (voix, 'mf'), (cors, 'mp'), (basses, 'pp'), (sub, 'mf'),
                 (verre, 'p')):
        s.nuance(p, v, 0)
    arc.poser(s, b(s, 0.25), impact=False, vel=108)
    tenue(s, sub, 'A1', 0.3, 3 * MES, vel=58)
    tenue(s, basses, 'A1', 0.3, 4.4, vel=58, art='tenu')
    for h in ('A4', 'E5'):
        tenue(s, verre, h, 0.6, 8.8, vel=56)
    courbe(s, verre, [(0.6, 'pp'), (2.5, 'p')])
    # la voix (0,3-2,0 s : « Bonjour. On commence par les ventes ? ») : « la mi | FA# »
    chante(s, TETE.coupe(0, 2.75), s.m(1, 2), vel=94)
    # le cor, une mesure plus tard ; sa mèche tient jusqu'à la coupe
    s.joue(cors, TETE.coupe(0, 3), a=s.m(2, 2), vel=84)


@plan('h2_tableur')
def h2(s):
    """Le tableur : le club en lignes, le calcul, le curseur sur VOLLAIRE. La machine : les triolets
    du vibraphone, les croches de la contrebasse, le tic ; le célesta pique les premiers temps."""
    G = ['i', 'IV']
    for p, v in ((vibra, 'mp'), (basses, 'p'), (tic, 'f'), (celesta, 'mp'), (grains, 'mf')):
        s.nuance(p, v, 0)
    machine(s, vibra, G, vel=64)
    croches(s, basses, G, vel=76)
    tenue(s, sub, 'D2', 3 * MES, 4 * MES, vel=56)
    s.batterie(tic, 'H : x . x . x . x . x . x . x . x .', vel=54)
    for m in (1, 2):
        s.note(celesta, hauteur(ACCORDS[G[m - 1]][2][0]) + 12, s.m(m), 1, vel=60)
    semer_grains(s, s.m(1, 3), s.m(3), 4, ['A6', 'E7', 'F#6'])


@plan('h3_escalier')
def h3(s):
    """L'escalier, d'en bas : Vaubourg monte, une marche, la canne, une marche (une timbale très douce
    à chaque fois que la canne se pose) ; la réplique dans l'oreille (10,2-14,9) : presque rien — la
    voix chante la tête, un violoncelle répond une mesure après ; le verre, la cymbale frottée."""
    for p, v in ((voix, 'mp'), (celles, 'mp'), (timbales, 'pp'), (archet, 'mp'), (basses, 'pp'), (verre, 'pp')):
        s.nuance(p, v, 0)
    t0 = PLANS['h3_escalier'][0]
    t1 = PLANS['h4_fenetre'][0]
    tenue(s, basses, 'A1', t0, t1, vel=54, art='tenu')
    tenue(s, sub, 'A1', t0, t1, vel=50)
    for h in ('A4', 'E5'):
        tenue(s, verre, h, t0, t1, vel=52)
    tenue(s, archet, 'C4', 9.0, 15.2, vel=60)
    # la canne : quatre marches (le film : 9,0 + 1,55 × n, la canne posée au tiers du pas)
    for t in (9.62, 11.17, 12.72, 14.27):
        tenue(s, timbales, 'A2', t, t + 0.5, vel=58)
    # la voix (la réplique) : « la mi | FA# » ; un violoncelle répond une mesure plus tard
    chante(s, TETE, s.m(1, 4), vel=86)
    s.joue(celles, TETE, a=s.m(2, 4), vel=78)
    # l'anacrouse du motif, qui tombera sur la coupe (la vitre)
    chante(s, MOTIF.coupe(0, 1), s.m(3, 4), vel=90)


@plan('h4_fenetre')
def h4(s):
    """Par la fenêtre : le stade à l'aube, ALMADIS, la bâche au loin ; le tableur en reflet sur la vitre
    : la machine revient. Le motif en canon : la voix (sa mèche sur la coupe), puis les cordes, une
    mesure après (IV – i – IV)."""
    G = ['IV', 'i', 'IV']
    for p, v in ((voix_f1, 'fff'), (voix_f2, 'fff'), (voix, 'mf'), (vibra, 'mp'), (basses, 'mp'), (tic, 'f'),
                 (violons, 'mf'), (altos, 'mf'), (celles_tri, 'mp'), (kick, 'mp'), (gcaisse, 'mp')):
        s.nuance(p, v, 0)
    machine(s, vibra, G, vel=64)
    machine(s, celles_tri, G, octave=-2, vel=70, de=2, art='staccato')
    croches(s, basses, G, vel=80)
    s.batterie(tic, 'H : x . x . x . x . x . x . x . x .', vel=56)
    s.batterie(kick, 'K : X . . . . . . . x . . . . . . .', a=s.m(2), vel=90)
    s.batterie(gcaisse, 'K : X . . . . . . . x . . . . . . .', a=s.m(2), vel=72)
    for m, c in enumerate(G, 1):
        tenue(s, sub, ACCORDS[c][0], PLANS['h4_fenetre'][0] + (m - 1) * MES, PLANS['h4_fenetre'][0] + m * MES,
              vel=60)
    # la voix : la suite du motif (sa mèche est sur la coupe) ; les cordes une mesure après
    chante(s, MOTIF.coupe(1, 8), 0, vel=92)
    s.joue(violons, MOTIF.octave(1), a=s.m(1, 4), vel=86)
    s.joue(altos, MOTIF, a=s.m(1, 4), vel=84)
    s.crescendo(celles_tri, s.m(2), s.m(4), 'mp', 'mf')
    # la voix d'ailleurs prend son anacrouse au dernier temps : sa mèche tombera sur la bâche
    s.nuance(voix_hachee, 'mf', 0)
    s.joue(voix_hachee, MECHE.coupe(0, 1), a=s.m(3, 4), vel=90)


@plan('h5_bache')
def h5(s):
    """La bâche, de près, lettre après lettre : la voix d'ailleurs. La majeur : la voix, hachée en
    triolets, pose la mèche sur la coupe ; les cors, une mesure après ; puis mib majeur (la
    sous-basse glisse d'un monde à l'autre) : la voix, la mèche à l'autre bout du triton."""
    G = ['I', 'I', '#IV']
    for p, v in ((voix_hachee, 'mf'), (vibra, 'mp'), (cors, 'f'), (trombones, 'f'), (basses, 'mp'), (altos, 'mp'),
                 (verre, 'mf'), (timbales, 'f'), (tic, 'f'), (grains, 'mf'), (sub, 'ff'), (kick, 'mf'),
                 (gcaisse, 'mf'), (celles_tri, 'mf')):
        s.nuance(p, v, 0)
    d = PLANS['h5_bache'][0]
    s.note(timbales, 'A2', 0, 1, vel=86)
    s.note(timbales, 'Eb2', s.m(3), 1, vel=88)
    # la sous-basse et la contrebasse : la, puis mib (glissé)
    tenue(s, sub, 'A1', d, d + 2 * MES, vel=66)
    tenue(s, sub, 'Eb2', d + 2 * MES, 30.6, vel=66, glisse=True)
    tenue(s, basses, 'A1', d, d + 2 * MES, vel=70, art='tenu')
    tenue(s, basses, 'Eb2', d + 2 * MES, 30.0, vel=70, art='tenu')
    for m, c in enumerate(G, 1):
        for h in ACCORDS[c][1]:
            s.note(verre, hauteur(h) + 12, s.m(m), 4, vel=60)
    tenues(s, altos, G, vel=62)
    machine(s, vibra, G, vel=62)
    machine(s, celles_tri, G, octave=-2, vel=72, art='staccato')
    s.batterie(tic, 'H : x . x x x . x x x . x x x . x x', vel=58)
    s.batterie(kick, 'K : X . . . . . . . x . . . . . . .', vel=92)
    s.batterie(gcaisse, 'K : X . . . . . . . x . . . . . . .', vel=74)
    porte_triolets(s, 0, s.longueur)
    # la mèche en la (la voix, hachée) — son anacrouse est au dernier temps du plan d'avant
    s.joue(voix_hachee, MECHE.coupe(1, 5), a=0, vel=92)
    # les cors, une mesure après : sa mèche se tait quand le monde change (mib)
    s.joue(cors, MECHE.coupe(0, 5), a=s.m(1, 4), vel=90)
    # la mèche à l'autre bout du triton (mib sib | DO), sur mib majeur
    s.joue(voix_hachee, MECHE_AILLEURS.coupe(0, 5), a=s.m(2, 4), vel=94)
    # les trombones prendront cette mèche une mesure après : leur anacrouse, au dernier temps
    s.joue(trombones, MECHE_AILLEURS.octave(-1).coupe(0, 1), a=s.m(3, 4), vel=86)
    semer_grains(s, s.m(1, 2), s.m(3), 4, ['A6', 'C#7', 'E7', 'F#6'], cle='la')
    semer_grains(s, s.m(3), s.m(4), 3, ['G6', 'Bb6', 'C7', 'Eb7'], cle='mib')


@plan('h6a_nord')
def h6a(s):
    """La Nord, la bâche, la brume sur la pelouse vide : les trombones prennent la mèche d'ailleurs, une
    mesure après la voix (DO) ; la machine s'est tue ; puis la voix reprend la tête (« la mi »)."""
    for p, v in ((trombones, 'mf'), (voix, 'mf'), (verre, 'p')):
        s.nuance(p, v, 0)
    # l'anacrouse des trombones est au dernier temps de la bâche (avec le DO de la voix)
    s.joue(trombones, MECHE_AILLEURS.octave(-1).coupe(1, 4), a=0, vel=88)
    courbe(s, trombones, [(28.36, 'mf'), (29.4, 'mp'), (30.0, 'p')])
    for h in ('Bb4', 'Eb5', 'G5'):
        tenue(s, verre, h, 28.36, 30.0, vel=56)
    # la voix : « la mi » (l'anacrouse), la tête tombera sur le titre
    chante(s, TETE.coupe(0, 1), s.m(1, 4), vel=90)


@plan('h6b_titre')
def h6b(s):
    """Le titre : la voix pose sa mèche (FA#) sur i, la sous-basse est revenue sur la ; le verre, la
    cymbale frottée (le bourdon de fa#) ; les cors répondent une mesure après ; le noir (35,6-37,0)."""
    for p, v in ((voix_f1, 'fff'), (voix_f2, 'fff'), (voix, 'mf'), (cors, 'mp'), (basses, 'pp'), (verre, 'p'),
                 (archet, 'mp'), (celles, 'pp'), (altos, 'pp')):
        s.nuance(p, v, 0)
    tenue(s, sub, 'A1', 30.6, 37.1, vel=58, glisse=True)
    tenue(s, basses, 'A1', 30.6, 37.1, vel=56, art='tenu')
    tenue(s, celles, 'E3', 30.6, 37.1, vel=56)
    for h in ('A3', 'C4'):
        tenue(s, altos, h, 30.6, 37.1, vel=56)
    for h in ('A4', 'E5'):
        tenue(s, verre, h, 30.6, 37.1, vel=56)
    tenue(s, archet, 'C4', 30.8, 37.0, vel=60)
    chante(s, TETE.coupe(1, 4.5), 0, vel=92)
    s.joue(cors, TETE.coupe(0, 1), a=s.m(1, 4), vel=82)
    tenue(s, cors, 'F#4', 30.6 + 4 * 60 / 112.5, 37.1, vel=86)
    for p in (voix, cors, basses, celles, altos, verre, archet, sub):
        courbe(s, p, [(35.6, 'p'), (37.0, 'ppp')])


# --- la traîne : le corps, que le jeu boucle seulement si le film dure plus ----------------------
@theme.section('traine', mesures=3, bpm=110, reprise=False)
def traine(s):
    """La mineur et sa sixte dorienne (fa#), tenus — le médium devant ; chaque note déborde de deux
    temps sur le passage suivant : à la couture, la traîne ne respire pas."""
    for p, v in ((basses, 'pp'), (celles, 'p'), (altos, 'p'), (violons, 'p'), (verre, 'p')):
        s.nuance(p, v, 0)
    d = s.longueur + 2
    s.note(basses, 'A1', 0, d, vel=56, art='tenu')
    s.note(celles, 'E3', 0, d, vel=60)
    for h in ('A3', 'C4'):
        s.note(altos, h, 0, d, vel=62, art='tenu')
    for h in ('E4', 'F#4'):
        s.note(violons, h, 0, d, vel=58, art='tenu')
    for h in ('A4', 'E5'):
        s.note(verre, h, 0, d, vel=56)


theme.forme(intro=ORDRE, corps=['traine'])
