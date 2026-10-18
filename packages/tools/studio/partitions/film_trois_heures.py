"""FUSIBLE — la musique du film « Trois heures » (livre 8, « L'Oreillette »), écrite sous ses images
(packages/tools/web/cinema/films/trois_heures.js, 35,0 s).

Les projecteurs : le duplex de la Tréfilerie, la nuit, le crochet du pont roulant au-dessus du lit
vide ; sur la table de nuit, l'oreillette dans son étui et la montre qui passe de 02:59 à 03:00 ; par
la baie, au loin, les quatre pylônes du stade de la Rive qui s'allument d'un coup sur une pelouse
vide ; quelqu'un court seul le long de la touche, passe, s'en va, ses quatre ombres autour de lui ;
le duplex encore, la lumière froide en carreaux sur le béton. Le film ne dit pas pourquoi le stade
s'allume. La musique est un chapitre de « L'Oreillette » (livre_h8), ses sections `S2` (« Deux
heures » : presque rien, puis la voix seule, tout près, chuchote la tête ; le cor répond de très
loin) et `F1` (« Les projecteurs » : trémolos très haut, pizzicati en triolets, les cors tiennent la
grille et enflent ; pas de voix : le stade s'allume seul) ; la dorien, la quinte à vide du verre, la
cymbale frottée (un bourdon sur fa#, la sixte dorienne), les cloches tubulaires de l'horloge.

LE TEMPS : 110 à la noire (la mesure = 2,18 s) : le film a été coupé sur les mesures de l'ancien
thème au même tempo, chaque coupe tombe sur une barre de mesure ; le plan de la baie est coupé aux
pylônes (103,1 : trois croches, puis six temps) ; le dernier plan est coupé au titre (111,7, puis
112,5). Chaque coupe est un premier temps.

LA FEUILLE DE SYNCHRO (temps du film → section, mesure.temps ; la musique)
   0,00  le noir, le duplex, le crochet       t1 1.1     une timbale et une lame, très doux ; la
                                                          quinte à vide du verre ; la cymbale frottée
   6,00 · 6,27  la table de nuit, l'oreillette  t2 1.4 · 4,5  la voix, tout près, chuchote : « la mi »…
   6,55  —                                     t2 2.1     … « FA# » ; les triolets s'éveillent
   8,18  la montre : 03:00 (8,2)               t2 2.4     l'horloge, un coup (cloches)…
   8,73  coupe : la baie, le stade au loin      t3a 1.1    le verre seul
   8,89  —                                     (t3a)      … un deuxième coup…
   9,60  les quatre pylônes d'un coup (le bruit)  t3b 1.1  … le troisième est celui du film ; la
                                                          lumière : les violons, un trémolo très haut ;
                                                          les pizzicati en triolets ; les croches
  13,09  coupe : le stade, quelqu'un court      t4 1.1     les cors tiennent la grille et enflent
  19,64  coupe : il passe au ras de la touche   t5 1.1     …
  21,82  il passe devant nous (21,95)            t5 2.1     le sommet : la timbale, la cymbale
  24,00  il s'en va                              t5 3.1     ♭VII ; tout s'éloigne avec lui
  26,18  coupe : le duplex, la lumière froide   t6a 1.1    le trémolo seul (la lumière), le verre
  28,06 · 28,33  —                              t6a 1.3,5 · 4  le cor, de très loin : « la mi »…
  28,60  le titre « Aubérive · 2024 »           t6b 1.1    … « FA# » : la tête, sur i ; la cymbale
                                                          frottée
  33,50  le noir commence (1,5 s)               t6b 3.2,6  decrescendo
  35,00  la fin du film                                    la traîne (le corps : la mineur et fa#, tenus)

L'introduction (le film entier) : 35,0 s, sonie réglée sur elle (`sonie_sur='intro'`). Le corps :
`traine`, trois mesures (6,55 s), que le jeu boucle si le film dure plus.
"""
from moteur.ecriture import *
from partitions._fusible import phrase

theme = Theme('film_trois_heures', 'Trois heures', bpm=110, mesure='4/4', tonalite='la dorien', graine=300,
              ville=False, boucle_min=0, moment='le film « Trois heures », livre 8',
              humeur='trois heures du matin : le stade qui s\'allume tout seul, quelqu\'un qui court')
theme.master(sonie_sur='intro')

TON = 'la dorien'
theme.salle('echo', temps=2 / 3, retour=0.34)

# --- la voix dans l'oreillette (elle chuchote) ------------------------------------------------------
OREILLETTE = {'passe_haut': 320, 'passe_bas': 3400, 'cloches': [(1100, 4.0, 1.2), (2600, 5.0, 2.0)]}
_VOIX = {'pan': 0.0, 'largeur': 0.0, 'profondeur': 0.0, 'eq': OREILLETTE, 'humain': 0}
voix = theme.piste('voix', 'choeur', art='ouh', unisson=1, salle=0.04, echo=0.2, sature=0.5, volume=0, **_VOIX)
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
violons = theme.piste('violons', volume=-1)                                     # le trémolo, très haut
violons2 = theme.piste('violons2', 'violons', pan=-0.22, bref=0.15, volume=-2)  # les triolets, pizzicato
altos = theme.piste('altos', volume=-1)
basses = theme.piste('basses', 'contrebasses', bref=0.15, volume=2)
cors = theme.piste('cors', art='tenu', volume=0)
cor_loin = theme.piste('cor_loin', 'cors', unisson=1, pan=-0.4, profondeur=0.9, salle=0.6, volume=-1)

# --- le verre, l'horloge, les percussions --------------------------------------------------------
verre = theme.piste('verre', 'nappe_gm', art='verre', volume=-4)
vibra = theme.piste('vibra', 'vibraphone', pan=-0.25, echo=0.12, volume=3)
cloches = theme.piste('cloches', profondeur=0.8, salle=0.6, volume=2)
timbales = theme.piste('timbales', volume=-4)
timb_roul = theme.piste('timb_roul', 'timbales', art='roulement', volume=-6)
suspendue = theme.piste('suspendue', 'cymbale_suspendue', volume=-8)
archet = theme.piste('archet', 'cymbale_suspendue', art='archet', profondeur=0.85, salle=0.4, volume=-7)
sub = theme.piste('sub', 'sub_synthe', volume=-20, glisse=0.5)

theme.bus('cordes', eq={'passe_haut': 32, 'cloches': [(2500, 1.0, 0.7)], 'air': 4.0})
theme.bus('cuivres', eq={'passe_haut': 38, 'boue': -1.0, 'air': 3.0})
theme.bus('choeur', eq={'passe_haut': 120, 'cloches': [(3200, 1.5, 0.8)], 'air': 3.0})

# =====================================================================================
# Le temps : 110 à la noire, une section par plan (début et fin dans le film, tempo, mesure, mesures)
MES = 4 * 60 / 110.0
PYLONES = 9.6                       # le film : ALLUME, les quatre d'un coup
# l'horloge : un coup sur la montre (03:00, le 4e temps), un deuxième à mi-chemin ; le troisième est
# le claquement des pylônes, le bruit du film
HORLOGE = (4 * MES - MES / 4, (4 * MES - MES / 4 + PYLONES) / 2)
PLANS = {
    't1_duplex': (0.0, 2 * MES, 110, '4/4', 2),
    't2_montre': (2 * MES, 4 * MES, 110, '4/4', 2),
    't3a_baie': (4 * MES, PYLONES, 1.5 * 60 / (PYLONES - 4 * MES), (3, 8), 1),
    't3b_pylones': (PYLONES, 6 * MES, 6 * 60 / (6 * MES - PYLONES), (6, 4), 1),
    't4_stade': (6 * MES, 9 * MES, 110, '4/4', 3),
    't5_coureur': (9 * MES, 12 * MES, 110, '4/4', 3),
    't6a_duplex': (12 * MES, 28.6, 4.5 * 60 / (28.6 - 12 * MES), (9, 8), 1),
    't6b_titre': (28.6, 35.0, 12 * 60 / 6.4, '4/4', 3),
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
TETE = phrase('tete', TON, octave=3)            # la3 mi4 | FA#4 ──

ACCORDS = {
    'i': ('A1', ('A3', 'C4', 'E4'), ('A4', 'C5', 'E5', 'F#5')),
    'IV': ('D2', ('A3', 'D4', 'F#4'), ('A4', 'C5', 'D5', 'F#5')),
    'bVII': ('G1', ('G3', 'B3', 'D4'), ('B4', 'D5', 'F#5', 'A5')),
}


def machine(s, piste, c, de, a, octave=0, vel=70, art=None, accent=12):
    """La machine : le cycle des quatre sons de l'accord `c` en croches de triolet, des temps `de` à
    `a` de la section ; chaque temps commence par un autre son."""
    cyc = ACCORDS[c][2]
    for k in range(int(round((a - de) * 3))):
        h = hauteur(cyc[k % 4]) + 12 * octave
        s.note(piste, h, de + k / 3.0, 1 / 3.0, vel=vel + (accent if k % 3 == 0 else 0), art=art)


_CROCHES = ([0, 0, 0, 0, 0, 12, 0, 0], 'X o x o X o x x')


def croches(s, piste, c, de, a, vel=72, art='pizzicato'):
    """La pulsation binaire : des croches sur la basse de `c`, l'octave sur un contretemps."""
    decal, acc = _CROCHES
    acc = acc.split()
    for k in range(int(round((a - de) * 2))):
        h = hauteur(ACCORDS[c][0]) + decal[k % 8]
        s.note(piste, h, de + k * 0.5, 0.5, vel={'X': vel + 16, 'x': vel, 'o': vel - 16}[acc[k % 8]], art=art)


def grille(s, cs):
    """La grille de la section, une mesure par accord : [(début, fin, accord)] en temps."""
    return [(s.m(m), s.m(m + 1), c) for m, c in enumerate(cs, 1)]


def lumiere(s, cs, vel=62):
    """La lumière : les voix tenues de l'accord, deux octaves plus haut, en trémolo (les violons)."""
    for d, f, c in grille(s, cs):
        for h in ACCORDS[c][1][1:]:
            s.note(violons, hauteur(h) + 24, d, f - d, vel=vel, art='tremolo')


def chante(s, motif, a, vel=90):
    s.joue(voix, motif, a=a, vel=vel)
    s.joue(voix_f1, motif, a=a, vel=vel)
    s.joue(voix_f2, motif, a=a, vel=vel)


# =====================================================================================
# Les plans

@plan('t1_duplex')
def t1(s):
    """Le duplex dans le noir, le crochet du pont roulant à contre-jour ; la ville éteinte : presque
    rien — une timbale et une lame, la quinte à vide du verre, la cymbale frottée (le bourdon)."""
    for p, v in ((timbales, 'pp'), (vibra, 'pp'), (verre, 'pp'), (basses, 'pp'), (sub, 'mp'), (archet, 'mf')):
        s.nuance(p, v, 0)
    s.note(timbales, 'A2', 0, 1, vel=58)
    s.note(vibra, 'A4', 0, 2, vel=56)
    tenue(s, basses, 'A1', 0.2, PYLONES, vel=52, art='tenu')
    tenue(s, sub, 'A1', 0.2, PYLONES, vel=50)
    for h in ('A4', 'E5'):
        tenue(s, verre, h, 0.6, 6 * MES, vel=54)
    courbe(s, verre, [(0.6, 'ppp'), (3.0, 'pp')])
    tenue(s, archet, 'C4', 1.2, 9.2, vel=56)


@plan('t2_montre')
def t2(s):
    """La table de nuit : l'oreillette dans son étui, la montre (02:59). La voix, tout près, chuchote
    la tête ; les triolets s'éveillent ; à 03:00, l'horloge sonne."""
    for p, v in ((voix, 'p'), (voix_f1, 'mp'), (voix_f2, 'mp'), (vibra, 'pp'), (cloches, 'mp')):
        s.nuance(p, v, 0)
    chante(s, TETE, s.m(1, 4), vel=88)
    machine(s, vibra, 'i', s.m(2), s.m(3), vel=54)
    s.crescendo(vibra, s.m(2), s.m(3), 'ppp', 'pp')
    # trois heures : deux coups d'horloge, le troisième est celui des pylônes (le bruit du film)
    for t, v in ((HORLOGE[0], 76), (HORLOGE[1], 76)):
        tenue(s, cloches, 'A4', t, t + 1.6, vel=v)


@plan('t3a_baie')
def t3a(s):
    """La baie : les toits, le stade au loin, éteint ; le verre seul (et l'horloge)."""


@plan('t3b_pylones')
def t3b(s):
    """Les quatre pylônes d'un coup : la lumière (un trémolo de violons, très haut), les pizzicati en
    triolets, les croches de la contrebasse ; les cors tiennent la grille, très doux."""
    for p, v in ((violons, 'p'), (violons2, 'mp'), (basses, 'mp'), (cors, 'pp'), (sub, 'mf')):
        s.nuance(p, v, 0)
    L = s.longueur
    for h in ('C6', 'E6'):
        s.note(violons, h, 0, L, vel=64, art='tremolo')
    courbe(s, violons, [(PYLONES, 'pp'), (PYLONES + 0.4, 'mf'), (11.0, 'mp')])
    machine(s, violons2, 'i', 0, L, vel=70, art='pizzicato')
    croches(s, basses, 'i', 0, L, vel=70)
    tenue(s, sub, 'A1', PYLONES, 6 * MES, vel=56)
    for h in ACCORDS['i'][1]:
        s.note(cors, h, 1, L - 1, vel=60)
    courbe(s, cors, [(PYLONES + 0.6, 'ppp'), (13.0, 'pp')])


@plan('t4_stade')
def t4(s):
    """Le stade, du coin : la pelouse vide sous les pylônes ; au bout de la touche, quelqu'un court
    vers nous. La machine tourne ; les cors tiennent la grille et enflent (i – IV – i)."""
    G = ['i', 'IV', 'i']
    for p, v in ((violons, 'mp'), (violons2, 'mp'), (basses, 'mp'), (cors, 'pp'), (altos, 'pp')):
        s.nuance(p, v, 0)
    lumiere(s, G, vel=64)
    for d, f, c in grille(s, G):
        machine(s, violons2, c, d, f, vel=72, art='pizzicato')
        croches(s, basses, c, d, f, vel=74)
        s.note(sub, ACCORDS[c][0], d, f - d, vel=58)
        for h in ACCORDS[c][1]:
            s.note(cors, h, d, f - d, vel=66)
        if d >= s.m(2):
            for h in ACCORDS[c][1][1:]:
                s.note(altos, hauteur(h) + 12, d, f - d, vel=60)
    s.crescendo(cors, 0, s.longueur, 'pp', 'mp')
    s.crescendo(altos, s.m(2), s.longueur, 'pp', 'p')


@plan('t5_coureur')
def t5(s):
    """Il passe au ras de la touche (devant nous vers 21,9 s), ses quatre ombres ; on le suit, il s'en
    va. Le sommet sur son passage (la timbale, la cymbale), puis tout s'éloigne avec lui (♭VII)."""
    G = ['IV', 'i', 'bVII']
    for p, v in ((violons, 'mp'), (violons2, 'mf'), (basses, 'mf'), (cors, 'mp'), (altos, 'p'), (timbales, 'mf'),
                 (timb_roul, 'p'), (suspendue, 'mf')):
        s.nuance(p, v, 0)
    lumiere(s, G, vel=66)
    for d, f, c in grille(s, G):
        machine(s, violons2, c, d, f, vel=74, art='pizzicato')
        croches(s, basses, c, d, f, vel=76)
        s.note(sub, ACCORDS[c][0], d, f - d, vel=60)
        for h in ACCORDS[c][1]:
            s.note(cors, h, d, f - d, vel=72)
            s.note(altos, hauteur(h) + 12, d, f - d, vel=62)
    # le sommet : il passe (la mesure 2)
    s.note(timb_roul, 'E2', s.m(1, 3), 2, vel=80)
    s.expression(timb_roul, [(s.m(1, 3), 'pp'), (s.m(2), 'mf')])
    s.note(suspendue, 'C4', s.m(2) - 2.0 * 110 / 60, 2.0 * 110 / 60, vel=84, art='monte_2s')
    s.note(timbales, 'A2', s.m(2), 1, vel=84)
    for p in (cors, altos, violons):
        s.expression(p, [(0, 'mp'), (s.m(2), 'f'), (s.m(2, 3), 'mf'), (s.m(3, 3), 'p'), (s.longueur, 'pp')])
    for p in (violons2, basses):
        s.expression(p, [(s.m(2), 'mf'), (s.m(3), 'mp'), (s.longueur, 'pp')])


@plan('t6a_duplex')
def t6a(s):
    """Le duplex : la grille de la baie, le stade allumé au loin, la lumière froide en carreaux sur le
    béton. Le trémolo seul (la lumière), le verre ; le cor, de très loin, prend l'anacrouse."""
    for p, v in ((violons, 'pp'), (basses, 'pp'), (cor_loin, 'mp'), (verre, 'p')):
        s.nuance(p, v, 0)
    for h in ('C6', 'E6'):
        tenue(s, violons, h, 26.18, 31.5, vel=58, art='tremolo')
    courbe(s, violons, [(26.18, 'pp'), (28.6, 'ppp'), (31.4, 'ppp')])
    tenue(s, basses, 'A1', 26.18, 35.1, vel=52, art='tenu')
    tenue(s, sub, 'A1', 26.18, 35.1, vel=50)
    for h in ('A4', 'E5'):
        tenue(s, verre, h, 26.2, 35.1, vel=56)
    s.joue(cor_loin, TETE.coupe(0, 1), a=3.5, vel=78)


@plan('t6b_titre')
def t6b(s):
    """Le titre : la tête du cor lointain pose sa mèche (FA#) sur i — personne ne chante ; la cymbale
    frottée ; le noir (33,5-35,0 s)."""
    for p, v in ((cor_loin, 'mp'), (archet, 'mp'), (altos, 'pp')):
        s.nuance(p, v, 0)
    tenue(s, cor_loin, 'F#4', 28.6, 35.1, vel=84)
    for h in ('A3', 'C4'):
        tenue(s, altos, h, 28.6, 35.1, vel=54)
    tenue(s, archet, 'C4', 28.8, 35.0, vel=58)
    courbe(s, cor_loin, [(28.6, 'mp'), (31.0, 'p'), (33.5, 'pp'), (35.0, 'ppp')])
    for p in (altos, verre, basses, archet, sub):
        courbe(s, p, [(33.5, 'pp'), (35.0, 'ppp')])


# --- la traîne : le corps, que le jeu boucle seulement si le film dure plus ----------------------
@theme.section('traine', mesures=3, bpm=110, reprise=False)
def traine(s):
    """La mineur et sa sixte dorienne (fa#), tenus — le médium devant ; chaque note déborde de deux
    temps sur le passage suivant : à la couture, la traîne ne respire pas."""
    for p, v in ((basses, 'pp'), (altos, 'pp'), (violons, 'pp'), (verre, 'pp'), (cor_loin, 'ppp')):
        s.nuance(p, v, 0)
    d = s.longueur + 2
    s.note(basses, 'A1', 0, d, vel=50, art='tenu')
    for h in ('E3', 'A3', 'C4'):
        s.note(altos, h, 0, d, vel=56, art='tenu')
    for h in ('E4', 'F#4'):
        s.note(violons, h, 0, d, vel=52, art='tenu')
    for h in ('A4', 'E5'):
        s.note(verre, h, 0, d, vel=50)


theme.forme(intro=ORDRE, corps=['traine'])
