"""FUSIBLE — la musique du film « Papier thermique » (livre 6, « 23 h 58 »), écrite sous ses images
(packages/tools/web/cinema/films/papier_thermique.js, 32,4 s).

Août 2003, en temps réel, de 23 h 57 min 47 s à 23 h 58 min 19 s : le parking du club-house, le
bureau dans le noir, l'horloge dont l'aiguille saute sur 58, le fax qui sonne et sort son papier
(l'en-tête « 23:58 · P.01 », puis, ligne à ligne, le haut d'une photo granuleuse), le bureau vide et
le papier qui pend dans les rayures de la lune. La musique est un chapitre de « 23 h 58 » (livre_h6) :
l'HORLOGE ACCORDÉE (le bois et les violons en pizzicato, tic sur ré, tac sur sol) bat ici sur les
SECONDES DU FILM, celles que montre la trotteuse ; la pédale de dominante ; à 23 h 58 pile, ♭II et
l'ARC ; la sonnerie du film à découvert ; le chant du fax (ses vraies fréquences) quand le papier sort ;
le motif aux cors dans l'habit napolitain pendant que la photo s'imprime ; la COUPURE nette, puis
l'horloge seule et la tête au cor bouché sous le titre : la mèche ne se résout pas.

LE TEMPS : la grille suit l'horloge du film (60 à la noire, les premiers temps sur 0,8 + 4k s : l'aiguille
saute sur un premier temps, la sonnerie tombe sur le troisième) ; les coupes du film tombent 0,2 à
0,6 s à côté des temps de l'horloge : elles sont écrites à leur heure (b(s, t)), comme le papier
(16,6 s) ; la dernière mesure, 3,6 s, presse un peu (66,7) pour finir avec le film.

LA FEUILLE DE SYNCHRO (temps du film → section, temps ; la musique)
   0,00  le noir s'ouvre (1,2 s) : le parking         s0 t.1     —
   0,80  23:57:48 (puis chaque seconde)                s1 t.1     le premier tic, très loin ; la pédale de ré
   1,00  le carton « Aubérive, club-house »            s1 t.1,2   —
   5,40  coupe : le bureau dans le noir                s2 m.1 t.1,6 le piano électrique : sol mineur
   7,80  —                                            s2 m.1 t.4 le cor bouché : « fu-si » (sol ré)…
   8,80  —                                            s2 m.2 t.1 … « BLE » : mi♭ sur la♭ majeur (♭II)
  10,40  coupe : l'horloge, la trotteuse monte          s2 m.2 t.2,6 l'ostinato des cordes, pp ; l'horloge
                                                                   plus près
  12,80  23:58:00 : l'aiguille saute sur 58            s3 t.1     ♭II frappé, l'ARC
  14,60  coupe : le fax                                s3 t.2,8   —
  14,80  la sonnerie du film (deux fois)               s3 t.3     à découvert : la pédale, l'horloge
  15,80  —                                            s3 t.4     la réponse du fax (do6, do7)
  16,60  le papier commence                            s3 t.4,8   le chant du fax (la♭6 / si♭6), en grain
  19,60  coupe : le papier, de tout près               s4 m.1 t.3,8 « fu-si » aux cors (19,8)…
  20,80  —                                            s4 m.2 t.1 … « BLE » (♭II) : la photo s'imprime
  24,80  —                                            s4 m.3 t.1 « do » (sol mineur)
  26,60  coupe : le bureau vide, le papier qui pend     s4 m.3 t.2,8 LA COUPURE : un coup, puis l'horloge seule
  28,60  le titre (→ 32,0 ; plein à 28,8)              s5 t.1     « BLE » du cor bouché (mi♭ sur ré)
  31,20  le noir commence (1,2 s)                      s5 t.3,6   —
  31,80  23:58:19                                      s5 t.4,2   le dernier tic
  32,40  la fin du film                                s5 fin     la traîne (ré et mi♭ tenus)

L'introduction (le film entier) : 32,4 s, sonie réglée sur elle (`sonie_sur='intro'`). Le corps :
`traine`, deux mesures (8 s) de ré grave et de mi♭, que le jeu boucle si le film dure plus.
"""
from moteur.ecriture import *
from moteur.theorie import fondamentale
from partitions._fusible import phrase, Arc

theme = Theme('film_papier_thermique', 'Papier thermique', bpm=60, mesure='4/4', tonalite='sol mineur',
              graine=20030823, ville=False, boucle_min=0, moment='le film « Papier thermique », livre 6',
              humeur='23 h 58, en temps réel : l\'horloge, la sonnerie, le fax qui imprime')
theme.master(sonie_sur='intro')

arc = Arc(theme)

# --- les pistes (celles du thème du livre) ------------------------------------------------------
horloge_bois = theme.piste('horloge_bois', 'batterie', humain=0, pan=0.25, salle=0.18, volume=2)
horloge_pizz = theme.piste('horloge_pizz', 'violons', art='pizzicato', humain=0, pan=0.25, salle=0.2,
                           volume=-1.5)
pedale = theme.piste('pedale', 'contrebasses', art='tenu', pan=0.05, largeur=0.4, salle=0.15, volume=6)
sub = theme.piste('sub', 'sub_synthe', volume=-13)
harmonique = theme.piste('harmonique', 'violons', art='tenu', unisson=1, pan=-0.4, profondeur=0.7,
                         salle=0.45, volume=-1)
ep = theme.piste('ep', 'piano_electrique', art='fm', salle=0.3, echo=0.15, volume=2.7)
violons2 = theme.piste('violons2', 'violons', art='staccato', bref=0.12, pan=-0.22, volume=-0.5)
altos = theme.piste('altos', art='staccato', bref=0.12, volume=0)
celles = theme.piste('celles', 'violoncelles', art='staccato', bref=0.14, pan=0.2, largeur=0.5, volume=3)
cors = theme.piste('cors', art='tenu', volume=4.5)
cor_bouche = theme.piste('cor_bouche', 'cors', art='sourdine', unisson=1, pan=-0.35, profondeur=0.85,
                         salle=0.55, volume=5)
trombones = theme.piste('trombones', art='tenu', volume=3)
tromb_st = theme.piste('tromb_st', 'trombones', art='staccato', bref=0.12, volume=-2.5)
violons_chant = theme.piste('violons_chant', 'violons', art='tenu', volume=-1)
timbales = theme.piste('timbales', largeur=0.5, volume=2)
cymbales = theme.piste('cymbales', volume=-3)
_FAX = {'osc': [{'forme': 'sinus', 'niveau': 0.8}, {'forme': 'carre', 'niveau': 0.18, 'largeur': 0.5}],
        'sub': 0.0,
        'filtre': {'type': 'bande', 'q': 1.6, 'coupure': 1900.0, 'suivi': 0.0, 'env': 0.0,
                   'a': 0.001, 'd': 0.05, 's': 1.0, 'r': 0.02, 'drive': 1.0},
        'amp': {'a': 0.002, 'd': 0.06, 's': 0.35, 'r': 0.02}, 'velocite': 0.5, 'vel_filtre': 0.0}
_TON = {'osc': [{'forme': 'sinus', 'niveau': 1.0}], 'sub': 0.0, 'filtre': None,
        'amp': {'a': 0.06, 'd': 0.2, 's': 0.85, 'r': 0.25}, 'velocite': 0.4}
fax = theme.piste('fax', 'arpege_synthe', synthe=_FAX, humain=0, pan=-0.3, profondeur=0.6, salle=0.2,
                  echo=0.1, eq={'passe_haut': 900, 'passe_bas': 4500}, volume=-16.5)
fax_ton = theme.piste('fax_ton', 'arpege_synthe', synthe=_TON, humain=0, pan=0.35, profondeur=0.8, salle=0.3,
                      eq={'passe_haut': 900, 'passe_bas': 4000}, volume=-25.5)

# =====================================================================================
# Le temps : la grille de l'horloge (début, fin, tempo, mesure, nombre de mesures)
PLANS = {
    's0': (0.0, 0.8, 75.0, (1, 4), 1),
    's1_dehors': (0.8, 4.8, 60.0, (4, 4), 1),
    's2_bureau': (4.8, 12.8, 60.0, (4, 4), 2),
    's3_minute': (12.8, 16.8, 60.0, (4, 4), 1),
    's4_papier': (16.8, 28.8, 60.0, (4, 4), 3),
    's5_titre': (28.8, 32.4, 4 * 60 / 3.6, (4, 4), 1),
}
ORDRE = list(PLANS)


def plan(nom):
    _d, _f, bpm, mes, n = PLANS[nom]
    return theme.section(nom, mesures=n, bpm=bpm, mesure=mes, reprise=False)


def b(s, t):
    """Le temps du film `t` → la position (en temps) depuis le début de la section en cours."""
    pos = 0.0
    suite = ORDRE[ORDRE.index(s.section.nom):]
    for nom in suite:
        d, f, bpm, _m, _n = PLANS[nom]
        if t <= f + 1e-9 or nom == suite[-1]:
            return pos + (t - d) * bpm / 60.0
        pos += (f - d) * bpm / 60.0


def tenue(s, piste, h, t0, t1, vel=70, art=None):
    s.note(piste, h, b(s, t0), b(s, t1) - b(s, t0), vel=vel, art=art)


def accord(s, piste, hs, t0, t1, vel=64, art=None):
    for h in hs:
        tenue(s, piste, h, t0, t1, vel=vel, art=art)


# --- l'horloge : un tic (ré, le bloc aigu) ou un tac (sol, le grave) à chaque seconde du film -----
def horloge(s, t0, t1, vel=78):
    """Les secondes de l'horloge du film (0,8 + k s) entre t0 et t1 : tic sur les secondes paires
    (23:58:00 est un tic), tac sur les impaires."""
    for k in range(0, 33):
        t = 0.8 + k
        if t0 - 1e-6 <= t < t1 - 1e-6:
            tic = (k % 2 == 0)
            v = vel if tic else vel - 8
            s.note(horloge_bois, 76 if tic else 77, b(s, t), 0.25, vel=v)
            s.note(horloge_pizz, 'D5' if tic else 'G4', b(s, t), 0.25, vel=v - 4 if tic else v - 2)


# --- la tête-ostinato en triples croches (la vitesse des doubles croches du thème) ---------------
TETES = {'i': ('G', 'D', 'Eb'), 'bII': ('Ab', 'Eb', 'F'), 'V-5': ('D', 'F#', 'D')}
GROUPES = [0, 1, 2, 0, 1, 2, 0, 1]


def ostinato(s, piste, t0, t1, accords, octave=4, vel=70):
    """Les sons de la tête (1 5 ♭6, groupés 3+3+2) en triples croches, de t0 à t1 (temps du film) ;
    `accords` : [(t, chiffre)…] (le chiffre en vigueur à partir de t)."""
    a, fin = b(s, t0), b(s, t1)
    i = 0
    while a < fin - 1e-6:
        t = t0 + (a - b(s, t0)) * 60.0 / PLANS[s.section.nom][2]
        ch = [c for tt, c in accords if tt <= t + 1e-6][-1]
        r, q, x = (hauteur(f'{n}{octave}') for n in TETES[ch])
        q = q if q > r else q + 12
        x = x if x > q else x + 12
        h = (r, q, x)[GROUPES[i % 8]]
        v = vel + (14 if i % 8 in (0, 3, 6) else 0)
        s.note(piste, h, a, 0.125, vel=v)
        a += 0.125
        i += 1


FSK = {'bII': ('Ab6', 'Bb6')}


def fax_chant(s, t0, t1, motif='x x . x x . x x', vel=72):
    """Le chant du fax (1650 / 1850 Hz ≈ la♭6 / si♭6) en triples croches, de t0 à t1."""
    cases = motif.split()
    a, fin = b(s, t0), b(s, t1)
    k = i = 0
    while a < fin - 1e-6:
        if cases[i % len(cases)] == 'x':
            s.note(fax, FSK['bII'][k % 2], a, 0.1, vel=vel)
            k += 1
        a += 0.125
        i += 1


MOTIF = phrase('motif', 'sol mineur', octave=3)        # sol3 ré4 | mi♭4 ── si♭3 la3 | do4 sol3
TETE = phrase('tete', 'sol mineur', octave=3)


# =====================================================================================
@plan('s0')
def s0(s):
    """Le noir s'ouvre sur le parking (1,2 s)."""
    pass


@plan('s1_dehors')
def s1(s):
    """Le parking, une nuit d'août : la façade, le couloir allumé, le bureau noir à l'étage, la petite
    voiture grise en marche arrière. La pédale de ré, l'horloge très loin, une note de violon tenue."""
    s.nuance(pedale, 'pp', 0)
    s.nuance(sub, 'p', 0)
    tenue(s, pedale, 'D2', 0.8, 12.8, vel=58)
    tenue(s, sub, 'D2', 0.8, 12.8, vel=46)
    s.crescendo(pedale, 0, b(s, 4.8), 'ppp', 'pp')
    horloge(s, 0.8, 4.8, vel=58)
    s.nuance(harmonique, 'pp', 0)
    tenue(s, harmonique, 'D6', 1.6, 5.4, vel=50)


@plan('s2_bureau')
def s2(s):
    """Le bureau dans le noir (5,4 s) : les stores, le carnet, le tableau « 30 M », vers le fax qui
    veille ; le piano électrique (sol mineur) ; le cor bouché, loin : « fu-si-BLE », mi♭ sur ♭II.
    L'horloge (10,4 s) : la trotteuse monte ; l'ostinato des cordes, pp, qui monte vers 23 h 58."""
    horloge(s, 4.8, 10.4, vel=68)
    horloge(s, 10.4, 12.8, vel=86)
    s.nuance(ep, 'p', 0)
    accord(s, ep, ['G3', 'Bb3', 'D4'], 5.4, 8.8, vel=60)
    accord(s, ep, ['Ab3', 'C4', 'Eb4'], 8.8, 10.4, vel=58)
    s.nuance(cor_bouche, 'mp', 0)
    tenue(s, cor_bouche, 'G3', 7.8, 8.3, vel=82)
    tenue(s, cor_bouche, 'D4', 8.3, 8.8, vel=84)
    tenue(s, cor_bouche, 'Eb4', 8.8, 10.4, vel=86)
    s.expression(cor_bouche, [(b(s, 8.8), 'mp'), (b(s, 10.4), 'p')])
    s.nuance(violons2, 'pp', 0)
    s.nuance(celles, 'pp', 0)
    ostinato(s, violons2, 10.4, 12.8, [(10.4, 'i'), (12.0, 'bII')], octave=4, vel=62)
    s.crescendo(violons2, b(s, 10.4), b(s, 12.8), 'pp', 'mp')


@plan('s3_minute')
def s3(s):
    """23 h 58 min 0 s (12,8 s) : l'aiguille saute ; ♭II frappé et l'ARC. Puis la sonnerie du film
    (14,8 s) à découvert : la pédale, l'horloge. La réponse du fax (do6, do7) ; le papier (16,6 s) :
    le chant du fax, en grain."""
    arc.poser(s, 0, impact=True, vel=118)
    s.nuance(tromb_st, 'f', 0)
    for h in ('Ab3', 'C4', 'Eb4'):
        s.note(tromb_st, h, 0, 0.5, vel=104)
    s.nuance(timbales, 'f', 0)
    s.note(timbales, 'D2', 0, 1, vel=104)
    s.note(cymbales, 'C4', 0, 1, vel=92, art='etouffee')
    horloge(s, 12.8, 16.8, vel=80)
    s.nuance(pedale, 'p', 0)
    tenue(s, pedale, 'D2', 12.8, 26.6, vel=62)
    tenue(s, sub, 'D2', 12.8, 26.6, vel=50)
    # la réponse du fax : l'appel (do6, deux bips), puis la tonalité (do7)
    s.note(fax, 'C6', b(s, 15.8), 0.25, vel=70)
    s.note(fax, 'C6', b(s, 16.1), 0.25, vel=66)
    tenue(s, fax_ton, 'C7', 16.3, 16.6, vel=80)
    s.nuance(fax, 'mp', 0)
    fax_chant(s, 16.6, 16.8, vel=70)


@plan('s4_papier')
def s4(s):
    """Le papier sort, tiède (16,6 s) ; de tout près (19,6 s) : l'en-tête, puis la photo, ligne à ligne
    — un rideau, une lampe, deux têtes à contre-jour. La densité monte : le chant du fax, l'ostinato,
    le moteur des violoncelles sur la pédale ; le motif aux cors (habit napolitain : ♭II – V | i),
    les violons à l'octave. 26,6 s : la COUPURE — un coup, puis l'horloge seule."""
    horloge(s, 16.8, 28.8, vel=78)
    # les accords : ♭II jusqu'à « BLE » compris, V sans quinte sous « si♭ la », i sur « do sol »
    # (sous « fu-si » des cors, 19,8–20,8 : sol mineur ; le fax se tait, il reprend sur « BLE »)
    acc = [(16.6, 'bII'), (19.8, 'i'), (20.8, 'bII'), (23.8, 'V-5'), (24.8, 'i')]
    s.nuance(fax, 'mp', 0)
    fax_chant(s, 16.8, 19.8, vel=72)
    fax_chant(s, 20.8, 23.8, vel=74)
    s.nuance(violons2, 'mp', 0)
    s.nuance(altos, 'p', 0)
    ostinato(s, violons2, 16.8, 26.6, acc, octave=4, vel=66)
    ostinato(s, altos, 20.8, 26.6, acc, octave=3, vel=62)
    s.crescendo(violons2, b(s, 16.8), b(s, 26.6), 'mp', 'f')
    s.crescendo(altos, b(s, 20.8), b(s, 26.6), 'p', 'mf')
    # le moteur des violoncelles : la pédale de ré en triples croches (ré3, ré2)
    s.nuance(celles, 'p', 0)
    a = b(s, 18.8)
    i = 0
    while a < b(s, 26.6) - 1e-6:
        s.note(celles, 'D3' if i % 8 not in (3, 6) else 'D2', a, 0.125, vel=70 + (14 if i % 8 in (0, 3, 6) else 0))
        a += 0.125
        i += 1
    s.crescendo(celles, b(s, 18.8), b(s, 26.6), 'p', 'f')
    # le motif aux cors, les violons à l'octave (« fu-si » 19,8 ; « BLE » 20,8 ; « do » 24,8)
    s.nuance(cors, 'f', 0)
    s.nuance(violons_chant, 'mf', 0)
    # (le dernier « sol » est coupé net à 26,6 s : la coupure)
    s.joue(cors, MOTIF.coupe(0, 26.6 - 19.8), a=b(s, 19.8), vel=104)
    s.joue(violons_chant, MOTIF.coupe(0, 26.6 - 19.8).octave(1), a=b(s, 19.8), vel=88)
    s.nuance(trombones, 'mf', 0)
    accord(s, trombones, ['Ab2', 'Eb3'], 20.8, 23.8, vel=78)
    accord(s, trombones, ['D3', 'F#3'], 23.8, 24.8, vel=76)
    accord(s, trombones, ['G2', 'D3'], 24.8, 26.6, vel=76)
    # LA COUPURE (26,6 s) : un coup sur ♭II… et plus rien que l'horloge
    t = b(s, 26.6)
    for h in ('Ab3', 'C4', 'Eb4'):
        s.note(tromb_st, h, t, 0.5, vel=110)
    s.note(timbales, 'D2', t, 1, vel=110)
    s.note(cymbales, 'C4', t, 1, vel=96, art='etouffee')
    tenue(s, pedale, 'D2', 26.6, 28.8, vel=50)
    s.expression(pedale, [(b(s, 26.6), 'pp'), (b(s, 28.8), 'pp')])
    # la tête au cor bouché, pour le titre : « fu-si » à 28,1 / 28,45
    s.nuance(cor_bouche, 'mp', 0)
    tenue(s, cor_bouche, 'G3', 28.1, 28.45, vel=82)
    tenue(s, cor_bouche, 'D4', 28.45, 28.8, vel=84)


@plan('s5_titre')
def s5(s):
    """Le titre (plein à 28,8 s) : « BLE » du cor bouché, mi♭ sur la pédale de ré (la ♭9 : elle ne se
    résout pas) ; l'horloge seule, jusqu'au dernier tic (31,8 s) ; le noir à 31,2 s."""
    horloge(s, 28.8, 32.4, vel=76)
    tenue(s, cor_bouche, 'Eb4', 28.8, 32.4, vel=86)
    s.expression(cor_bouche, [(0, 'mp'), (b(s, 31.2), 'p'), (b(s, 32.4), 'ppp')])
    s.nuance(pedale, 'pp', 0)
    tenue(s, pedale, 'D2', 28.8, 32.4, vel=54)
    tenue(s, sub, 'D2', 28.8, 32.4, vel=44)
    s.expression(pedale, [(0, 'pp'), (b(s, 31.2), 'pp'), (b(s, 32.4), 'ppp')])


# --- la traîne : le corps, que le jeu boucle seulement si le film dure plus ------------------------
@theme.section('traine', mesures=2, bpm=60, reprise=False)
def traine(s):
    """Ré grave et mi♭ (la mèche sur la dominante), tenus ; chaque note déborde de deux temps."""
    for p, v in ((pedale, 'pp'), (cor_bouche, 'pp'), (harmonique, 'ppp')):
        s.nuance(p, v, 0)
    d = s.longueur + 2
    s.note(pedale, 'D2', 0, d, vel=50)
    s.note(cor_bouche, 'Eb4', 0, d, vel=60)
    s.note(harmonique, 'D6', 0, d, vel=46)


theme.forme(intro=ORDRE, corps=['traine'])
