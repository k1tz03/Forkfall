"""FUSIBLE — « La première marche » (film_premiere_marche) : la musique du film du livre 10.

Le film (packages/tools/web/cinema/films/premiere_marche.js, 37 s) : septembre 2037, les
premiers jours d'une présidence. Minuit, le bureau du club-house : sur le sous-main, deux
téléphones ; le clapet gris vibre (« appel masqué »), puis le fixe s'allume ; on ne décroche ni
l'un ni l'autre. Sept heures et demie, l'escalier nord de la Rive : un maçon pose le dernier
bloc de la première marche, creusée au milieu par des années de semelles ; l'arrêté de la Ligue
sur la rampe ; il lève la tête vers la fenêtre de Gégé : « Bonjour, Gégé. Elle est creusée au
milieu, celle-là. Je la mure quand même. » ; on monte les trente-trois marches dans la brume.
La musique est un chapitre de « Deux téléphones » (livre_h10) : ses deux sonneries (le clapet,
do♯ mineur ; le fixe, sol mineur), sa basse lourde en 3+3+2, son escalier qui perd une marche à
chaque mesure, « Madame » (la trompette bouchée, filtrée comme une voix au téléphone).

LE BUREAU (plan 1) : le clapet sonne PENDANT qu'il vibre (0,2–2,1 s : sol♯ do♯, glockenspiel et
altos en pizzicato), puis le fixe PENDANT qu'il s'allume (2,1–4,1 s : sol ré, marimba,
vibraphone, violons en pizzicato) ; puis personne : les deux tonalités tenues de loin, sol–ré en
bas, do♯ mineur au chœur, au-dessus (« 1 appel manqué »).
LA RUE (plan 2, par le noir) : la portière de la fourgonnette (8,9 s : rien dessous), puis le
matin : la basse lourde en 3+3+2 sur sol (la ville), et l'escalier qu'on voit monter en
diagonale aux altos (la gamme qui perd une marche).
LA MARCHE (plan 3) : la tête en sol aux cors, la mèche (mib) quand le bloc descend dans le creux ;
rien sous le bloc qui se pose (18,2 s) ; la basse reprend sous les coups du manche.
L'ARRÊTÉ (plan 4) : la basse tombe d'un triton (sol → do♯) ; « Madame » dit la tête en do♯ : la
règle vient de l'autre téléphone.
LA FENÊTRE (plan 5) : sous la réplique, rien que le chœur, de loin, en sol (la tribune se
souvient), et le verre frotté.
L'ESCALIER (plan 6, en fondu) : on monte les trente-trois marches : la gamme aux violons, qui
perd une marche à chaque temps fort, la basse lourde, la mèche tenue aux cors, le roulement.
LE TITRE : les deux tonalités ensemble (sol mineur en bas, do♯ mineur en haut), et les deux
sonneries, une fois chacune ; personne ne décroche ; l'image s'éteint.

LE TEMPO : une section par plan (chaque coupe commence sur un premier temps, au même
échantillon), entre 109 et 118 à la noire (le thème est à 116) ; le titre ralentit un peu.

LA FEUILLE DE SYNCHRO : SYNCHRO ci-dessous (outils/synchro.py la vérifie sur le JSON du rendu).
"""
from moteur.ecriture import *
from partitions._fusible import phrase

theme = Theme('film_premiere_marche', 'La première marche', bpm=116, mesure='4/4', tonalite='sol mineur',
              graine=2137, ville=False, boucle_min=0,
              moment='le film « La première marche », livre 10',
              humeur="deux téléphones qu'on ne décroche pas ; une marche murée, la première")
theme.master(sonie_sur='intro')

SOL = 'sol mineur'
DOD = 'do# mineur'

theme.salle('salle', rt60=2.9, clarte=1.2)
theme.salle('echo', temps=0.75, retour=0.3)

PLANS = [  # (section, début, fin, mesure, mesures)
    ('bureau', 0.0, 8.3, '4/4', 4),
    ('rue', 8.3, 14.5, '4/4', 3),
    ('marche', 14.5, 20.6, '4/4', 3),
    ('arrete', 20.6, 23.2, '5/4', 1),
    ('fenetre', 23.2, 27.0, '7/4', 1),
    ('escalier', 27.0, 32.6, '11/4', 1),
    ('titre', 32.6, 37.0, '4/4', 2),
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
    ('le clapet vibre ; sa sonnerie (sol♯)', 0.39, 'bureau', 0.75),
    ('… do♯, puis la seconde salve', 1.43, 'bureau', 2.75),
    ('le fixe s\'allume ; sa sonnerie (sol)', 2.33, 'bureau', 4.5),
    ('… la dernière (ré), avant que le fixe se taise', 3.89, 'bureau', 7.5),
    ('« 1 appel manqué » : les deux tonalités au loin', 4.15, 'bureau', 8),
    ('coupe (par le noir) : le matin, l\'escalier', 8.3, 'rue', 0),
    ('la portière (rien dessous)', 8.9, 'rue', au('rue', 8.9)),
    ('la basse lourde, sur sol', 9.33, 'rue', 2),
    ('coupe : la première marche', 14.5, 'marche', 0),
    ('le bloc descend : la mèche (mib) aux cors', 16.02, 'marche', 3),
    ('le bloc se pose (rien dessous)', 18.2, 'marche', au('marche', 18.2)),
    ('coupe : l\'arrêté ; la basse tombe sur do♯', 20.6, 'arrete', 0),
    ('« Madame » : la (la mèche de do♯)', 21.64, 'arrete', 2),
    ('coupe : le maçon lève la tête ; la réplique', 23.2, 'fenetre', 0),
    ('fondu : les trente-trois marches', 27.0, 'escalier', 0),
    ('le titre : les deux tonalités', 32.6, 'titre', 0),
    ('l\'image s\'éteint (35,6–37 s)', 35.6, 'titre', au('titre', 35.6)),
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
basses_tenu = theme.piste('basses_tenu', 'contrebasses', art='tenu', pan=0.12, volume=-4)
celles = theme.piste('celles', 'violoncelles', art='staccato', bref=0.2, pan=0.1, volume=-1)
celles_chant = theme.piste('celles_chant', 'violoncelles', art='tenu', pan=0.25, volume=4)
altos = theme.piste('altos', art='staccato', bref=0.18, volume=2)
violons = theme.piste('violons', art='staccato', bref=0.18, volume=4)
violons_tr = theme.piste('violons_tr', 'violons', art='tremolo', pan=-0.3, profondeur=0.6, volume=-8)
cors = theme.piste('cors', art='tenu', volume=4)
trombones = theme.piste('trombones', art='tenu', volume=3)
madame = theme.piste('madame', 'trompettes', art='sourdine', unisson=1, pan=0.15, profondeur=0.3,
                     salle=0.12, echo=0.12, eq={'passe_haut': 450, 'passe_bas': 3200,
                                                 'cloches': [(1500, 3.0, 1.0)]}, volume=5)
choeur = theme.piste('choeur', art='ouh', profondeur=0.9, largeur=1.3, salle=0.6, volume=7)
halo = theme.piste('halo', 'nappe_gm', art='verre', profondeur=0.7, volume=-2)
timbales = theme.piste('timbales', volume=-3)
timb_roul = theme.piste('timb_roul', 'timbales', art='roulement', volume=-5)
suspendue = theme.piste('suspendue', 'cymbale_suspendue', volume=-8)


def nuances(s, **niveaux):
    for nom_piste, v in niveaux.items():
        s.nuance(theme.pistes[nom_piste], v, 0)


# --- le matériau du thème ----------------------------------------------------------------
TETE_SOL = phrase('tete', SOL, octave=3)              # sol3 ré4 | MIb4
TETE_DOD4 = phrase('tete', DOD, octave=4)             # do♯4 sol♯4 | LA4
GAMME_SOL = ['G3', 'A3', 'Bb3', 'C4', 'D4', 'Eb4', 'F4', 'G4']
BASSE = {'Gm': 'G1', 'Eb': 'Eb2', 'F5': 'F2', 'C#m': 'C#2', 'A': 'A1'}
COUPS = ((0.0, 1.4), (1.5, 1.4), (3.0, 0.9))           # 1, 2 et, 4 : le 3+3+2 du thème principal


def basse_lourde(s, accords, de, a, vel=96, cordes=True):
    """La basse lourde, mesure de quatre temps par mesure de quatre temps, de la position `de` à
    `a` ; `accords` : un accord par mesure (ses quatre temps) ; les contrebasses en pizzicato et
    les violoncelles frappent avec elle, une octave dessus."""
    for k, c in enumerate(accords):
        b = de + 4 * k
        for dt, d in COUPS:
            t = b + dt
            if t >= a - 1e-6:
                break
            h = hauteur(BASSE[c])
            v = vel + (8 if dt == 0 else 0)
            s.note(basse, h, t, min(d, a - t), vel=v)
            if cordes:
                s.note(basses, h + 12 if h < hauteur('E2') else h, t, 0.5, vel=v - 10)
                s.note(celles, h + 12 if h < hauteur('C3') else h, t, 0.5, vel=v - 16)


def fixe(s, b, vel=86, pizz=True):
    """Le fixe sonne une fois (sol4 → ré5 sur les contretemps de croche, à b + 0,5 et b + 1,5)."""
    for dt, h in ((0.5, 'G4'), (1.5, 'D5')):
        s.note(fixe_vib, h, b + dt, 0.5, vel=vel - 6)
        s.note(fixe_mar, h, b + dt, 0.5, vel=vel - 4)
        if pizz:
            s.note(fixe_pizz, h, b + dt, 0.5, vel=vel - 10)


def clapet(s, b, vel=86, pizz=True):
    """Le clapet sonne une fois (sol♯5 → do♯6 sur les contretemps de double, b + 0,75 et b + 1,25)."""
    for dt, h in ((0.75, 'G#5'), (1.25, 'C#6')):
        s.note(clapet_glock, h, b + dt, 0.25, vel=vel)
        if pizz:
            s.note(clapet_pizz, hauteur(h) - 12, b + dt, 0.25, vel=vel - 8)


# =====================================================================================
# Le film

@theme.section('bureau', mesures=4, bpm=tempo('bureau'), mesure='4/4', reprise=False)
def bureau(s):
    """0–8,3 s : minuit ; le clapet vibre (0,2–2,1 s), puis le fixe s'allume (2,1–4,1 s) ;
    personne ne décroche ; « 1 appel manqué » (le noir s'ouvre en 1,2 s)."""
    nuances(s, choeur='pp', basses_tenu='pp', celles_chant='pp', halo='pp')
    clapet(s, 0, vel=86)
    clapet(s, 2, vel=80)
    fixe(s, 4, vel=88)
    fixe(s, 6, vel=82)
    # personne : les deux tonalités, de loin ; sol–ré en bas, do♯ mineur au-dessus (au chœur)
    s.note(basses_tenu, 'G2', 8, 8, vel=62)
    s.note(celles_chant, 'D3', 8, 8, vel=60)
    s.joue(choeur, tenue(['C#4', 'E4', 'G#4'], 8, vel=60), a=8)
    s.joue(halo, tenue(['G#4', 'C#5'], 7, vel=56), a=9)
    for p in (basses_tenu, celles_chant, choeur, halo):
        s.expression(p, [(8, 'pp'), (12, 'p'), (16, 'pp')])


@theme.section('rue', mesures=3, bpm=tempo('rue'), mesure='4/4', reprise=False)
def rue(s):
    """8,3–14,5 s : le matin derrière la Nord ; la portière (8,9 s : rien dessous) ; le maçon
    porte le bloc (9–13,6 s)."""
    nuances(s, celles='mp', basses='mp', altos='mp', choeur='pp')
    # la ville commence avec le matin : la basse lourde en 3+3+2 sur sol, dès le 3e temps
    basse_lourde(s, ['Gm', 'Gm', 'Gm'], 2, 12, vel=92)
    s.note(timbales, 'G2', 2, 1, vel=72)
    # l'escalier qu'on voit monter en diagonale : la gamme aux altos, qui perd une marche
    for k, (b, n) in enumerate(((4, 8), (8, 7))):
        for i in range(n):
            s.note(altos, GAMME_SOL[i], b + 0.5 * i, 0.5, vel=80 + (10 if i == 0 else 0))
    s.joue(choeur, tenue(['G3', 'D4'], 10, vel=56), a=2)


@theme.section('marche', mesures=3, bpm=tempo('marche'), mesure='4/4', reprise=False)
def marche(s):
    """14,5–20,6 s : la première marche ; le mortier, le bloc qui descend (16–18,2 s), qui se
    pose (18,2 s : rien dessous), les coups du manche (18,4–20 s)."""
    nuances(s, cors='mp', celles='mp', basses='mp', choeur='pp')
    tpose = au('marche', 18.2)
    # la basse continue (sol, puis mib : ♭VI, la marche qu'on comble) ; elle se tait pour le bloc
    basse_lourde(s, ['Gm', 'Eb'], 0, 7.0, vel=88)
    # la tête aux cors, en sol : la mèche (mib) quand le bloc descend dans le creux
    s.joue(cors, TETE_SOL.coupe(0, 1), a=2, vel=88)
    s.note(cors, 'Eb4', 3, 4, vel=88)
    s.diminuendo(cors, 3, 7, 'mp', 'p')
    s.joue(choeur, tenue(['G3', 'Eb4'], 4, vel=54), a=3)
    # après le bloc : la basse reprend sous les coups du manche (fa à vide, puis sol)
    for t, h, d in ((tpose + 0.6, 'F2', 1.4), (10, 'G1', 2)):
        s.note(basse, h, t, d, vel=86)
        s.note(basses, hauteur(h) + 12 if hauteur(h) < hauteur('E2') else h, t, 0.5, vel=76)


@theme.section('arrete', mesures=1, bpm=tempo('arrete'), mesure='5/4', reprise=False)
def arrete(s):
    """20,6–23,2 s : l'arrêté de la Ligue sur la rampe ; la basse tombe d'un triton (sol → do♯) ;
    « Madame » dit la tête en do♯, sa mèche (la) sur LA majeur."""
    nuances(s, madame='mf', celles='mp', basses='mp', halo='pp')
    s.note(basse, 'C#2', 0, 2, vel=94)
    s.note(basses, 'C#3', 0, 0.5, vel=82)
    s.note(celles, 'C#3', 0, 0.5, vel=76)
    s.note(basse, 'A1', 2, 3, vel=90)
    s.note(basses, 'A2', 2, 0.5, vel=78)
    s.joue(madame, TETE_DOD4, a=1, vel=94)
    s.joue(halo, tenue(['C#5', 'E5'], 2, vel=52))
    s.joue(halo, tenue(['C#5', 'E5'], 3, vel=52), a=2)


@theme.section('fenetre', mesures=1, bpm=tempo('fenetre'), mesure='7/4', reprise=False)
def fenetre(s):
    """23,2–27 s : le maçon lève la tête vers la fenêtre de Gégé ; la réplique (23,4–27 s) :
    rien que le chœur, de loin, en sol (la tribune se souvient), et le verre frotté."""
    nuances(s, choeur='pp', halo='pp', basses_tenu='pp')
    s.joue(choeur, tenue(['G3', 'Bb3', 'D4'], 7, vel=62))
    s.crescendo(choeur, 0, 5, 'pp', 'p')
    s.expression(choeur, [(5, 'p'), (7, 'pp')])
    s.joue(halo, tenue(['D5', 'G5'], 6, vel=54), a=1)
    s.note(basses_tenu, 'G2', 0, 7, vel=58)


@theme.section('escalier', mesures=1, bpm=tempo('escalier'), mesure='11/4', reprise=False)
def escalier(s):
    """27–32,6 s : on monte les trente-trois marches dans la brume (en fondu), le gyrophare ; la
    gamme aux violons qui perd une marche, la basse lourde, la mèche aux cors, le roulement."""
    nuances(s, violons='mp', cors='mp', celles='mp', basses='mp', choeur='p', violons_tr='pp')
    basse_lourde(s, ['Gm', 'Gm'], 1, 9, vel=90)
    s.note(basse, 'Eb2', 9, 1, vel=94)
    s.note(basse, 'F2', 10, 1, vel=98)
    # la gamme (sol4 → sol5), qui perd une marche à chaque groupe : 8, 7, 6 croches
    debut = 1
    for n in (8, 7, 6):
        for i in range(n):
            if debut + 0.5 * i >= 11:
                break
            s.note(violons, hauteur(GAMME_SOL[i]) + 12, debut + 0.5 * i, 0.5, vel=78 + (10 if i == 0 else 0))
        debut += 0.5 * n
    s.crescendo(violons, 1, 11, 'mp', 'f')
    # la mèche tenue aux cors (mib), puis fa : vers le titre
    s.note(cors, 'Eb4', 2, 7, vel=88)
    s.note(cors, 'F4', 9, 2, vel=92)
    s.crescendo(cors, 2, 11, 'mp', 'mf')
    s.joue(choeur, tenue(['G3', 'Bb3'], 10, vel=60), a=1)
    s.note(timb_roul, 'G2', 7, 4, vel=78)
    s.crescendo(timb_roul, 7, 11, 'pp', 'mf')
    s.note(suspendue, 'C4', 11 - 2.0 * tempo('escalier') / 60, 2.0 * tempo('escalier') / 60,
           vel=84, art='monte_2s')


@theme.section('titre', mesures=2, bpm=tempo('titre'), mesure='4/4', reprise=False)
def titre(s):
    """32,6–37 s : le titre ; les deux tonalités ensemble (sol mineur en bas, do♯ mineur en
    haut), et les deux sonneries, une fois chacune ; l'image s'éteint (35,6–37 s)."""
    nuances(s, trombones='mf', choeur='mp', violons_tr='mp', celles_chant='mf', basses_tenu='mf')
    s.note(timbales, 'G2', 0, 1, vel=92)
    s.note(basse, 'G1', 0, 6, vel=96)
    for h in ('G2', 'D3', 'Bb3'):
        s.note(trombones, h, 0, 6, vel=88)
    s.note(celles_chant, 'G2', 0, 7, vel=80)
    s.note(basses_tenu, 'G2', 0, 7, vel=74)
    s.joue(choeur, tenue(['C#4', 'E4', 'G#4'], 7, vel=78, ), a=0)
    s.joue(violons_tr, tenue(['C#5', 'G#5'], 7, vel=72), a=0)
    # les deux sonneries, une fois chacune : le fixe, puis le clapet ; personne ne décroche
    fixe(s, 0, vel=84)
    clapet(s, 2, vel=84)
    for p in (trombones, choeur, violons_tr, celles_chant, basses_tenu, basse):
        s.expression(p, [(4.5, 'mf'), (8, 'pp')])


# --- la traîne : sol–ré qui tient, do♯ au loin ----------------------------------------------
@theme.section('traine', mesures=3, bpm=116, mesure='4/4', reprise=False)
def traine(s):
    nuances(s, basses_tenu='pp', choeur='pp', halo='pp')
    s.note(basses_tenu, 'G2', 0, 12, vel=56)
    s.joue(choeur, tenue(['G3', 'D4'], 12, vel=54))
    s.joue(halo, tenue(['G#4', 'C#5'], 12, vel=50))


theme.forme(intro=['bureau', 'rue', 'marche', 'arrete', 'fenetre', 'escalier', 'titre'], corps=['traine'])
