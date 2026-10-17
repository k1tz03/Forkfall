"""FUSIBLE — « Le match d'après » (film_match_d_apres) : la musique du film du livre 10.

Le film (packages/tools/web/cinema/films/match_d_apres.js, 38,5 s) : avril 2040, la Rive, le
premier match après la nuit de février où Gégé est mort. La Nord pleine à l'heure bleue, des
centaines d'écrans de téléphone allumés comme des étoiles basses, les panneaux à diodes qui
défilent ; les panneaux s'éteignent d'un coup, le coup de sifflet : la minute. Depuis la loge,
derrière la vitre, sans un bruit : les équipes autour du rond central, les écrans de la Nord qui
s'éteignent un à un. Nino lève le premier masque ; puis la vague : trois mille visages de Gégé
en carton. Un masque de près, l'écharpe au poignet ; la Nord entière. Personne ne parle.
La musique est un chapitre de « Deux téléphones » (livre_h10) : ses deux sonneries, sa basse
lourde, et sa section D2, « Trois mille visages » : le motif en augmentation, en sol, au chœur,
aux cors et à la foule du stade, de loin ; à la fin, l'accord des deux tonalités.

L'HEURE BLEUE (plan 1) : les deux sonneries, doucement, rares, comme les écrans dans les gradins ;
le chœur de loin, sol–ré.
LES PANNEAUX (plan 2) : la basse lourde en 3+3+2, les deux sonneries croisées (le fixe, le
clapet, le fixe ; le dernier sans vibraphone, qui sonnerait dans la minute), la timbale ; tout
monte jusqu'à l'instant où les panneaux s'éteignent (11,2 s) — et la musique s'arrête avec eux,
net : le coup de sifflet (11,25 s) part dans le silence.
LA MINUTE (la fin du plan 2, le plan 3) : « on n'entend rien » ; les queues de la salle
s'éteignent ; au milieu de la minute, le chœur, de très loin, tient sol–ré, à peine (la tribune
retient son souffle).
LES MASQUES (plan 4) : Nino lève le premier masque (20,5 s) : c'est la première note du motif en
augmentation (sol) ; la vague part de lui (21,1 s) : la foule du stade entre avec le ré, et
enfle avec la vague ; la mèche (mib) tenue six temps ; le chœur et les cors avec elle ; la basse
lourde sur les premiers temps seulement, tenue (le stade).
LE MASQUE (plan 5, en fondu) : la seconde fois, le chœur une octave plus haut, la foule sur « ah »,
les trombones dessous.
LE TITRE : la fin du motif (do sol), puis l'accord des deux tonalités (sol mineur en bas, do♯
mineur en haut) qui s'éteint avec l'image.

LE TEMPO : une section par plan et par événement (chaque coupe, l'extinction des panneaux et le
premier masque commencent sur un premier temps, au même échantillon), entre 114 et 120 à la
noire (le thème est à 116) ; la mesure de 3/8 du plan 4, avant le masque, à 100.

LA FEUILLE DE SYNCHRO : SYNCHRO ci-dessous (outils/synchro.py la vérifie sur le JSON du rendu).
"""
from moteur.ecriture import *
from partitions._fusible import phrase

theme = Theme('film_match_d_apres', "Le match d'après", bpm=116, mesure='4/4', tonalite='sol mineur',
              graine=2140, ville=False, boucle_min=0,
              moment="le film « Le match d'après », livre 10",
              humeur='la minute de silence, puis trois mille visages de Gégé')
theme.master(sonie_sur='intro')

SOL = 'sol mineur'

theme.salle('salle', rt60=2.9, clarte=1.2)
theme.salle('echo', temps=0.75, retour=0.3)

PLANS = [  # (section, début, fin, mesure, mesures)
    ('nord', 0.0, 7.0, '7/4', 2),
    ('panneaux', 7.0, 11.2, '4/4', 2),
    ('minute', 11.2, 19.6, '4/4', 4),
    ('nino', 19.6, 20.5, '3/8', 1),
    ('masques', 20.5, 28.6, '4/4', 4),
    ('masque', 28.6, 33.8, '5/4', 2),
    ('titre', 33.8, 38.5, '9/4', 1),
]


def _plan(nom):
    return next(p for p in PLANS if p[0] == nom)


def tempo(nom):
    """Le tempo (noires par minute) qui fait durer la section exactement son plan."""
    _, d, f, me, n = _plan(nom)
    num, den = me.split('/')
    return 60.0 * n * int(num) * 4 / int(den) / (f - d)


def au(nom, t):
    """La position (en temps depuis le début de la section) d'un instant `t` du film."""
    return (t - _plan(nom)[1]) * tempo(nom) / 60.0


SYNCHRO = [
    ('le noir s\'ouvre ; l\'heure bleue', 0.0, 'nord', 0),
    ('coupe : les panneaux ; la basse lourde', 7.0, 'panneaux', 0),
    ('les panneaux s\'éteignent : la musique s\'arrête', 11.2, 'minute', 0),
    ('le coup de sifflet (rien dessous)', 11.25, 'minute', au('minute', 11.25)),
    ('coupe (par le noir) : la loge, sans un bruit', 12.4, 'minute', au('minute', 12.4)),
    ('le chœur, de très loin', 15.4, 'minute', 8),
    ('coupe : devant la Nord ; la grue monte', 19.6, 'nino', 0),
    ('Nino lève le premier masque : sol', 20.5, 'masques', 0),
    ('la vague part de lui : la foule entre (ré)', 21.1, 'masques', au('masques', 21.1)),
    ('la mèche (mib), tenue', 21.51, 'masques', 2),
    ('fondu : un masque de près ; la seconde fois', 28.6, 'masque', 0),
    ('le titre : do sol, puis les deux tonalités', 33.8, 'titre', 0),
    ('l\'image s\'éteint (37,1–38,5 s)', 37.1, 'titre', au('titre', 37.1)),
]

# --- les pistes (celles du thème) -----------------------------------------------------------
fixe_vib = theme.piste('fixe_vib', 'vibraphone', pan=-0.3, salle=0.3, echo=0.08, volume=-6)
fixe_mar = theme.piste('fixe_mar', 'marimba', pan=-0.25, salle=0.25, volume=-1)
fixe_pizz = theme.piste('fixe_pizz', 'violons', art='pizzicato', pan=-0.35, volume=0)
clapet_glock = theme.piste('clapet_glock', 'glockenspiel', pan=0.3, salle=0.32, echo=0.1, volume=2)
clapet_pizz = theme.piste('clapet_pizz', 'altos', art='pizzicato', pan=0.35, volume=-2)
LOURDE = {'osc': [{'forme': 'reese', 'voix': 2, 'ecart': 18, 'niveau': 0.85},
                  {'forme': 'carre', 'niveau': 0.25, 'largeur': 0.5, 'octave': 1}],
          'sub': 0.45,
          'filtre': {'coupure': 480.0, 'resonance': 0.9, 'env': 1.7, 'suivi': 0.3,
                     'a': 0.003, 'd': 0.32, 's': 0.3, 'r': 0.12, 'drive': 2.2},
          'amp': {'a': 0.004, 'd': 0.6, 's': 0.85, 'r': 0.12}, 'largeur': 0.25, 'drive': 1.3,
          'velocite': 0.45, 'glisse': 0.16, 'mono': True}
basse = theme.piste('basse', 'basse_reese', synthe=LOURDE, mono=True, volume=-9)
basses = theme.piste('basses', 'contrebasses', art='pizzicato', pan=0.12, volume=-5)
basses_tenu = theme.piste('basses_tenu', 'contrebasses', art='tenu', pan=0.04, volume=-4)
celles = theme.piste('celles', 'violoncelles', art='staccato', bref=0.2, pan=0.1, volume=-1)
violons_tr = theme.piste('violons_tr', 'violons', art='tremolo', pan=-0.3, profondeur=0.6, volume=-8)
cors = theme.piste('cors', art='tenu', volume=4)
trombones = theme.piste('trombones', art='tenu', pan=0.12, volume=3)
trompettes = theme.piste('trompettes', art='tenu', volume=3)
choeur = theme.piste('choeur', art='ouh', profondeur=0.9, largeur=1.3, salle=0.6, volume=7)
halo = theme.piste('halo', 'nappe_gm', art='verre', profondeur=0.7, volume=-2)
foule = theme.piste('foule', volume=0)
timbales = theme.piste('timbales', pan=0.0, volume=-3)
cymbales = theme.piste('cymbales', volume=-7)


def nuances(s, **niveaux):
    for nom_piste, v in niveaux.items():
        s.nuance(theme.pistes[nom_piste], v, 0)


# --- le matériau du thème ----------------------------------------------------------------
LENT_SOL = phrase('motif', SOL, octave=3).augmente(2)   # sol3 ré4 | MIb4 ── sib3 la3 | do4 sol3
BASSE = {'Gm': 'G1', 'Eb': 'Eb2', 'F5': 'F2', 'F': 'F2'}
COUPS = ((0.0, 1.4), (1.5, 1.4), (3.0, 0.9))


def basse_lourde(s, accords, de, vel=96):
    """La basse lourde (3+3+2), une mesure de quatre temps par accord, à partir de `de` ; les
    contrebasses en pizzicato et les violoncelles frappent avec elle."""
    for k, c in enumerate(accords):
        b = de + 4 * k
        for dt, d in COUPS:
            h = hauteur(BASSE[c])
            v = vel + (8 if dt == 0 else 0)
            s.note(basse, h, b + dt, d, vel=v)
            s.note(basses, h + 12 if h < hauteur('E2') else h, b + dt, 0.5, vel=v - 10)
            s.note(celles, h + 12 if h < hauteur('C3') else h, b + dt, 0.5, vel=v - 16)


def fixe(s, b, vel=86, cloche=True):
    for dt, h in ((0.5, 'G4'), (1.5, 'D5')):
        if cloche:
            s.note(fixe_vib, h, b + dt, 0.5, vel=vel - 6)
        s.note(fixe_mar, h, b + dt, 0.5, vel=vel - 4)
        s.note(fixe_pizz, h, b + dt, 0.5, vel=vel - 10)


def clapet(s, b, vel=86):
    for dt, h in ((0.75, 'G#5'), (1.25, 'C#6')):
        s.note(clapet_glock, h, b + dt, 0.25, vel=vel)
        s.note(clapet_pizz, hauteur(h) - 12, b + dt, 0.25, vel=vel - 8)


# =====================================================================================
# Le film

@theme.section('nord', mesures=2, bpm=tempo('nord'), mesure='7/4', reprise=False)
def nord(s):
    """0–7 s : la Nord à l'heure bleue, les écrans dans les gradins, les panneaux qui défilent
    (le noir s'ouvre en 1,4 s)."""
    nuances(s, choeur='pp', basses_tenu='pp', halo='pp')
    # les deux sonneries, doucement, rares : les écrans comme des étoiles basses
    clapet(s, 2, vel=70)
    fixe(s, 5, vel=72)
    clapet(s, 8, vel=74)
    fixe(s, 10.5, vel=76)
    clapet(s, 12, vel=78)
    s.joue(choeur, tenue(['G3', 'D4'], 12, vel=58), a=2)
    s.crescendo(choeur, 2, 14, 'pp', 'p')
    s.note(basses_tenu, 'G2', 4, 10, vel=60)
    s.crescendo(basses_tenu, 4, 14, 'pp', 'p')
    s.joue(halo, tenue(['D5', 'G5'], 11, vel=52), a=3)


@theme.section('panneaux', mesures=2, bpm=tempo('panneaux'), mesure='4/4', reprise=False)
def panneaux(s):
    """7–11,2 s : au ras des panneaux à diodes, les premiers rangs ; tout monte, puis les
    panneaux s'éteignent (11,2 s) : la musique s'arrête avec eux."""
    nuances(s, celles='mp', basses='mp', choeur='p', violons_tr='p')
    basse_lourde(s, ['Gm', 'Eb'], 0, vel=94)
    s.note(timbales, 'G2', 0, 1, vel=90)
    # les deux sonneries croisées ; la dernière sans le vibraphone, qui sonnerait dans la minute
    fixe(s, 0, vel=84)
    clapet(s, 2, vel=84)
    fixe(s, 4, vel=88, cloche=False)
    s.joue(choeur, tenue(['G3', 'D4'], 4, vel=64))
    s.joue(choeur, tenue(['G3', 'Eb4'], 4, vel=66), a=4)
    s.joue(violons_tr, tenue(['G4', 'D5'], 4, vel=66))
    s.joue(violons_tr, tenue(['G4', 'Bb4'], 4, vel=70), a=4)      # pas mib5 contre le ré5 du fixe
    for p in (choeur, violons_tr, celles, basses):
        s.crescendo(p, 0, 7.9, 'p', 'mf')


@theme.section('minute', mesures=4, bpm=tempo('minute'), mesure='4/4', reprise=False)
def minute(s):
    """11,2–19,6 s : la minute ; le coup de sifflet (11,25 s) part dans le silence ; la loge,
    derrière la vitre, sans un bruit ; au milieu, le chœur de très loin, à peine."""
    nuances(s, choeur='ppp', basses_tenu='ppp')
    s.joue(choeur, tenue(['G3', 'D4'], 8, vel=52), a=8)
    s.crescendo(choeur, 8, 16, 'ppp', 'pp')
    s.note(basses_tenu, 'G2', 10, 6, vel=52)
    s.crescendo(basses_tenu, 10, 16, 'ppp', 'pp')


@theme.section('nino', mesures=1, bpm=tempo('nino'), mesure='3/8', reprise=False)
def nino(s):
    """19,6–20,5 s : devant la Nord, la grue qui monte ; Nino, sur l'estrade, va lever le masque."""
    nuances(s, choeur='pp', basses_tenu='pp')
    # le sol se tait : il reviendra avec le premier masque ; le ré tient
    s.note(choeur, 'D4', 0, 1.5, vel=56)
    s.note(basses_tenu, 'D3', 0, 1.5, vel=56)
    s.crescendo(choeur, 0, 1.5, 'pp', 'p')


@theme.section('masques', mesures=4, bpm=tempo('masques'), mesure='4/4', reprise=False)
def masques(s):
    """20,5–28,6 s : Nino lève le premier masque (20,5 s) : la première note du motif en
    augmentation ; la vague part de lui (21,1 s) : la foule entre, et enfle avec elle."""
    tvague = au('masques', 21.1)
    nuances(s, choeur='p', cors='mp', foule='p', basses_tenu='mp', trombones='p')
    # le motif en augmentation, en sol : le chœur et les cors dès le masque de Nino
    s.joue(choeur, LENT_SOL, vel=86, art='aah')
    s.joue(cors, LENT_SOL, vel=92)
    # la foule du stade, de loin, à partir de la vague (le ré), sur « o »
    lent = LENT_SOL.notes
    for n in lent:
        if n.t + n.d <= tvague:
            continue
        d0 = max(n.t, tvague)
        s.note(foule, n.h, d0, n.t + n.d - d0, vel=96, art='o')
    for p in (choeur, cors, foule):
        s.crescendo(p, tvague, 10, 'p', 'f')
        s.expression(p, [(10, 'f'), (16, 'mf')])
    # la basse lourde sur les premiers temps seulement, tenue (le stade) : Gm Eb | Eb F5 | F Gm
    for d, l, c in ((0, 2, 'Gm'), (2, 6, 'Eb'), (8, 2, 'Eb'), (10, 2, 'F5'), (12, 4, 'Gm')):
        s.note(basse, BASSE[c], d, l - 0.1, vel=96)
        s.note(basses_tenu, hauteur(BASSE[c]) + 12 if hauteur(BASSE[c]) < hauteur('E2') else BASSE[c], d, l, vel=80)
    for h, d, l in (('G2', 0, 2), ('Bb2', 0, 2), ('Eb3', 2, 8), ('G3', 2, 8), ('F3', 10, 2), ('C4', 10, 2),
                    ('G3', 12, 4), ('D3', 12, 4)):
        s.note(trombones, h, d, l, vel=80)
    s.note(timbales, 'G2', 0, 1, vel=94)
    s.note(timbales, 'Eb2', 2, 1, vel=88)
    s.note(cymbales, 'C4', 2, 2, vel=84)
    s.note(timbales, 'F2', 10, 1, vel=88)
    s.note(timbales, 'G2', 12, 1, vel=92)


@theme.section('masque', mesures=2, bpm=tempo('masque'), mesure='5/4', reprise=False)
def masque(s):
    """28,6–33,8 s : un masque de près, l'écharpe au poignet (en fondu) ; la caméra recule : la
    Nord entière ; la seconde fois, le chœur une octave plus haut, la foule sur « ah »."""
    nuances(s, choeur='mf', foule='mf', trombones='mp', cors='mp', basses_tenu='mp', violons_tr='p')
    deb = LENT_SOL.coupe(0, 10)
    s.joue(choeur, deb.octave(1), vel=84, art='aah')
    s.joue(foule, deb, vel=100, art='ah')
    s.joue(cors, deb, vel=88)
    s.joue(trombones, deb.octave(-1), vel=86)
    for d, l, c in ((0, 2, 'Gm'), (2, 6, 'Eb'), (8, 2, 'Eb')):
        s.note(basse, BASSE[c], d, l - 0.1, vel=92)
        s.note(basses_tenu, hauteur(BASSE[c]) + 12 if hauteur(BASSE[c]) < hauteur('E2') else BASSE[c], d, l, vel=76)
    s.joue(violons_tr, tenue(['G4', 'D5'], 2, vel=64))
    s.joue(violons_tr, tenue(['G4', 'Eb5'], 8, vel=66), a=2)
    s.note(timbales, 'G2', 0, 1, vel=86)


@theme.section('titre', mesures=1, bpm=tempo('titre'), mesure='9/4', reprise=False)
def titre(s):
    """33,8–38,5 s : le titre ; la fin du motif (do sol), puis l'accord des deux tonalités qui
    s'éteint avec l'image (37,1–38,5 s)."""
    nuances(s, choeur='mf', foule='mf', trombones='mp', cors='mp', basses_tenu='mp', violons_tr='p',
            trompettes='p')
    # do (sur F, ♭VII) puis sol (sur Gm)
    for p, dec, v, art in ((choeur, 12, 82, 'aah'), (foule, 0, 96, 'ah'), (cors, 0, 86, None)):
        s.note(p, hauteur('C4') + dec, 0, 2, vel=v, art=art)
        s.note(p, hauteur('G3') + dec, 2, 7, vel=v - 4, art=art)
    s.note(basse, 'F2', 0, 1.9, vel=90)
    s.note(basse, 'G1', 2, 7, vel=92)
    s.note(basses_tenu, 'F2', 0, 2, vel=74)
    s.note(basses_tenu, 'G2', 2, 7, vel=72)
    for h in ('F3', 'C4'):
        s.note(trombones, h, 0, 2, vel=80)
    for h in ('G2', 'D3', 'Bb3'):
        s.note(trombones, h, 2, 7, vel=80)
    s.note(timbales, 'G2', 2, 1, vel=84)
    # l'accord des deux tonalités : do♯ mineur en haut, au-dessus de sol mineur
    for h in ('C#5', 'E5', 'G#5'):
        s.note(violons_tr, h, 3, 6, vel=70)
    s.note(trompettes, 'C#5', 3, 6, vel=76)
    for p in (choeur, foule, cors, trombones, basses_tenu, basse, violons_tr, trompettes):
        s.expression(p, [(5.5, 'mf'), (9, 'pp')])


# --- la traîne : sol–ré qui tient, la rumeur de la tribune -----------------------------------
@theme.section('traine', mesures=3, bpm=116, mesure='4/4', reprise=False)
def traine(s):
    nuances(s, choeur='pp', basses_tenu='pp', foule='pp')
    s.joue(choeur, tenue(['G3', 'D4'], 12, vel=54))
    s.note(basses_tenu, 'G2', 0, 12, vel=56)
    s.note(foule, 'G3', 0, 12, vel=70, art='rumeur')


theme.forme(intro=['nord', 'panneaux', 'minute', 'nino', 'masques', 'masque', 'titre'], corps=['traine'])
