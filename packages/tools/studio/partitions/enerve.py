"""FUSIBLE — « Court-circuit » (enerve) : le mode éclair, « Le Fusible », une carrière en dix
minutes. Énervé : des doubles croches qui grondent, des cuivres graves saturés, une batterie
qui cogne, des cassures. La musique ne repart jamais de zéro : quand une partie recommence,
l'arc marque la mort et la pulsation continue.

150 à la noire (une mesure = 1,6 s), mi phrygien (la seconde mineure, fa, contre la tonique).
L'orchestre reste la voix : violoncelles et contrebasses en doubles croches brèves, trombones,
tuba, cors et trompettes à pleine force (leur éclat), le braam aux impacts, taïkos, timbales ;
une batterie hybride (la batterie puissante, une grosse caisse de boîte à rythmes dessous, la
caisse claire « gated ») ; en grain : une basse de synthé saturée qui double les cordes graves
(et pompe sous la grosse caisse), une nappe sombre au fond, les montées.

LE MOTIF EN DIMINUTION, en phrygien (`_fusible.phrase(…).diminue(2)`) : mi si | DO ── sol fa |
la MI (1 5 | ♭6 ♭3 ♭2 | 4 1) en une mesure au lieu de deux (jamais la réponse : la phrase
entière est réservée à cinq thèmes) ; aux sommets le motif diminué en appel (cors) et réponse
(trombones), puis à la ligne haute (trompettes) ; le motif contre son renversement autour de
ré (qui reste dans le mode) ; la tête en canon aux trompettes ; une fois le motif à sa vitesse
par-dessus sa diminution ; au creux, la tête en valeurs longues au piano, droite puis renversée.

L'harmonie, en quintes à vide (les cuivres saturés, les cordes graves) : i – ♭II (mi – fa : le
frottement) ; i – ♭VII – ♭VI – ♭VII (mi – ré – do – ré) ; ♭VI – ♭VII – i pour relancer ; sous le
motif, la cellule du thème principal, accélérée : ♭VI ── ♭vii | i.

LA CARTE (le corps : 96 mesures, 153,6 s)
  intro  2 m.        l'ARC à découvert ; la basse en doubles croches, la grosse caisse    3 → 6
  A1     8 m.  0:00  « le fil » : quatre au sol, basse et cordes graves (i – ♭II) ; m. 5
                     les trombones martèlent la tête en diminution                        6
  A2     8 m.  0:13  « l'étincelle » : le motif diminué (cors et trombones), les trompettes
                     répondent par la tête ; caisse « gated »                             7
  B1     8 m.  0:26  « la cassure » : i – ♭VII – ♭VI – ♭VII ; une demi-mesure se tait toutes
                     les deux mesures ; l'ARC dans la cassure de la m. 4                 6,5
  C1     8 m.  0:38  « la surtension » : braam, taïkos ; le motif diminué en appel (cors,
                     trompettes) et réponse (trombones), deux fois ; les quintes frappées ;
                     violons en doubles croches                                           9
  C2     8 m.  0:51  « le court-circuit » : le motif aux cors contre son renversement aux
                     trombones (autour de ré : do fa | MI…, il reste dans le mode), une
                     demi-mesure plus tard ; ♭VI – ♭VII en quintes ; i, la cassure       9,5
  T1     8 m.  1:04  « le creux » : la pulsation douce, la basse filtrée, la nappe ; le
                     piano : la tête en valeurs longues, puis renversée (do fa | MI) ;
                     ♭II – i ; m. 7 la montée                                              4
  A3     8 m.  1:17  « le redémarrage » : une batterie cassée, des toms ; la tête aux cors   6
  A4     8 m.  1:30  « la charge » : coups de cuivres sur les contretemps ; le motif
                     diminué aux trompettes ; montée                                      7
  B2     8 m.  1:42  « la panne » : ♭VI – ♭VII ; cassures ; l'ARC (m. 6) ; la tête aux cors,
                     puis aux trombones sur i                                             7
  C3     8 m.  1:55  « la ligne haute » : le motif diminué (cors, trombones), la tête en
                     canon aux trompettes, puis le motif tout en haut aux trompettes ;
                     taïkos                                                               9
  C4     8 m.  2:08  « le disjoncteur » : le motif à sa vitesse aux cors par-dessus sa
                     diminution aux trombones ; ♭VI – ♭VII – i                          9,5
  R      8 m.  2:21  « la reprise » : le disjoncteur a sauté ; la pulsation continue seule
                     (grosse caisse, basse filtrée), la tête aux trombones, doux ; m. 5
                     la caisse claire, les violoncelles ; m. 7–8 toms, montée → A1     4,5 → 7
"""
from moteur.ecriture import *
from partitions._fusible import phrase, Arc

theme = Theme('enerve', 'Court-circuit', bpm=150, mesure='4/4', tonalite='mi phrygien', graine=1010,
              ville=False, moment='le mode éclair, Le Fusible',
              humeur='énervé : des doubles croches qui grondent, des cuivres saturés, des cassures')

TON = 'mi phrygien'

# --- l'arc ----------------------------------------------------------------------------------
arc = Arc(theme)
# --- la batterie hybride ----------------------------------------------------------------------
kick = theme.piste('kick', 'boite_a_rythmes', bus='batterie', volume=2)
kit = theme.piste('kit', 'batterie_puissante', volume=1.5)
caisse_g = theme.piste('caisse_g', 'batterie_puissante', porte=porte(duree=0.22), volume=0)
# --- les cordes ------------------------------------------------------------------------------
celles = theme.piste('celles', 'violoncelles', art='staccato', bref=0.12, pan=0.3, volume=2)
basses = theme.piste('basses', 'contrebasses', art='staccato', bref=0.12, volume=3)
altos = theme.piste('altos', art='staccato', bref=0.12, pan=0.15, volume=0)
violons = theme.piste('violons', art='staccato', bref=0.12, pan=-0.45, volume=2)
# --- les cuivres -----------------------------------------------------------------------------
# les cuivres graves « cuivrent » plus que d'ordinaire (l'éclat : la saturation des notes fortes)
cors = theme.piste('cors', art='tenu', volume=1.5)
trombones = theme.piste('trombones', art='tenu', eclat=3.0, volume=2)
tuba = theme.piste('tuba', art='tenu', eclat=2.5, volume=-1)
trompettes = theme.piste('trompettes', art='tenu', volume=4.5)
coups = theme.piste('coups', 'trombones', art='staccato', bref=0.12, eclat=3.0, volume=-1)   # les quintes frappées
braam = theme.piste('braam', volume=-1)
cuivre_s = theme.piste('cuivre_s', 'cuivre_synthe', volume=-5.5)
# --- le piano (le creux) ---------------------------------------------------------------------
piano = theme.piste('piano', art='pedale', salle=0.3, volume=11)
# --- les percussions --------------------------------------------------------------------------
taiko = theme.piste('taiko', volume=2, eq={'passe_haut': 40})
timbales = theme.piste('timbales', volume=4)
timb_roul = theme.piste('timb_roul', 'timbales', art='roulement', volume=2)
cymbales = theme.piste('cymbales', volume=2)
suspendue = theme.piste('suspendue', 'cymbale_suspendue', volume=0)
effets = theme.piste('effets', volume=0)
# --- le grain de synthèse ---------------------------------------------------------------------
basse_s = theme.piste('basse_s', 'basse_synthe', mono=True, sature=0.8, pompe=pompe(0.45, 0.1, source='kick'),
                      eq={'passe_haut': 36}, volume=-6)
nappe = theme.piste('nappe', 'nappe_synthe', pompe=pompe(0.6, 0.12, source='kick'), eq={'passe_haut': 200},
                    synthe={'filtre': {'coupure': 700.0}}, volume=4)


def nuances(s, **niveaux):
    for nom_piste, v in niveaux.items():
        s.nuance(theme.pistes[nom_piste], v, 0)


# =====================================================================================
# Le matériau

MOTIF_DIM = phrase('motif', TON, octave=3).diminue(2)        # mi3 si3 | DO4 ─ sol3 fa3 | la3 MI3 (une mesure)
TETE_DIM = phrase('tete', TON, octave=3).diminue(2)          # mi si | DO
TETE = phrase('tete', TON, octave=3)
MOTIF = phrase('motif', TON, octave=3)                       # à sa vitesse (deux mesures)

# les fondamentales des chiffres, en mi phrygien
RAC = {'i': 'E', 'II': 'F', 'VII': 'D', 'VI': 'C', 'vii': 'D'}
GAMME = {4, 5, 7, 9, 11, 0, 2}        # mi phrygien : mi fa sol la si do ré
# les quintes à vide des trombones, dans leur étendue (mi 2 et plus) : sur i et ♭II la
# fondamentale en bas ; sur ♭VII et ♭VI la quinte passe dessous, la fondamentale au milieu
# (le tuba, les contrebasses et la basse la tiennent en bas)
QUINTE = {'i': ['E2', 'B2', 'E3'], 'II': ['F2', 'C3', 'F3'], 'VII': ['A2', 'D3', 'A3'], 'VI': ['G2', 'C3', 'G3'],
          'vii': ['A2', 'D3', 'A3']}


def temps_de(mesures):
    """« i i II i » ou des mesures découpées (« VI.VI.vii.i ») → un chiffre par temps."""
    sortie = []
    for m in mesures.split():
        parts = m.split('.')
        if len(parts) == 1:
            parts = parts * 4
        sortie += parts
    return sortie


def racine(ch, octave, plancher=None):
    """La fondamentale du chiffre à l'octave dite, remontée d'une octave sous `plancher`."""
    h = hauteur(f'{RAC[ch]}{octave}')
    while plancher is not None and h < hauteur(plancher):
        h += 12
    return h


def voisin(h):
    """Le degré au-dessus dans la gamme : fa sur mi (le demi-ton phrygien), sol sur fa,
    mi sur ré, ré sur do — jamais une note hors du mode."""
    h += 1
    while h % 12 not in GAMME:
        h += 1
    return h


def dans_trou(t, trous):
    return any(a - 1e-9 <= t < b - 1e-9 for a, b in trous)


# les figures des doubles croches (décalages en demi-tons sur la fondamentale du temps, accents) :
# 3+3+2, le voisin du dessus (1 : fa sur mi, le demi-ton phrygien) au bout des groupes, l'octave
# et la quinte sur les accents ; jamais deux mesures pareilles de suite
FIG = {
    'a': ([0, 0, 12, 0, 0, 12, 0, 1, 0, 0, 12, 0, 0, 12, 0, 1], 'X x o X x o X o X x o X x o X o'),
    'b': ([0, 0, 7, 0, 0, 12, 0, 1, 0, 0, 7, 0, 0, 12, 1, 0], 'X o x X o x X x X o x X o x X x'),
    'c': ([0, 12, 0, 0, 12, 0, 1, 0, 0, 12, 0, 0, 12, 0, 1, 12], 'X x o X x o X o X x o X x o X o'),
    'd': ([0, 0, 0, 12, 0, 0, 7, 0, 0, 0, 1, 12, 0, 0, 7, 1], 'X o x X o x X o X o x X o x X x'),
}


def seizes(s, piste, temps, octave, figs, de=1, a=None, vel=84, trous=(), art=None, plancher=None):
    """Les doubles croches sur la fondamentale de chaque temps, de la mesure `de` à `a`
    comprise ; `trous` : des plages (en temps) où tout se tait (les cassures)."""
    a = a or s.mesures
    for m in range(de, a + 1):
        decal, acc = FIG[figs[(m - de) % len(figs)]]
        acc = acc.split()
        for i in range(16):
            t = s.m(m) + i * 0.25
            if dans_trou(t, trous):
                continue
            base = racine(temps[(m - 1) * 4 + i // 4], octave, plancher)
            h = voisin(base) if decal[i] == 1 else base + decal[i]
            v = {'X': vel + 20, 'x': vel, 'o': vel - 22}[acc[i]]
            s.note(piste, h, t, 0.25, vel=v, art=art)


def basse(s, temps, figs, **kw):
    """La basse de synthé saturée double les violoncelles deux octaves plus bas (mi 1, fa 1 ;
    ré 2 et do 2 : l'étendue s'arrête à mi 1)."""
    seizes(s, basse_s, temps, 1, figs, plancher='E1', **kw)


def accents_basses(s, temps, de=1, a=None, figs='abcd', vel=96, trous=()):
    """Les contrebasses frappent les accents des figures, au plus grave (mi 1 et plus)."""
    a = a or s.mesures
    for m in range(de, a + 1):
        acc = FIG[figs[(m - de) % len(figs)]][1].split()
        for i, c in enumerate(acc):
            t = s.m(m) + i * 0.25
            if c == 'X' and not dans_trou(t, trous):
                s.note(basses, racine(temps[(m - 1) * 4 + i // 4], 1, 'E1'), t, 0.25, vel=vel)


def coups_quintes(s, temps, rythme, de=1, a=None, vel=100, trous=(), piste=None):
    """Les quintes frappées des cuivres graves sur une grille de doubles croches (X fort,
    x moyen), répétée chaque mesure."""
    piste = piste or coups
    a = a or s.mesures
    jetons = rythme.split()
    for m in range(de, a + 1):
        for i, j in enumerate(jetons):
            t = s.m(m) + i * 0.25
            if j == '.' or dans_trou(t, trous):
                continue
            for h in QUINTE[temps[(m - 1) * 4 + i // 4]]:
                s.note(piste, h, t, 0.25, vel=vel + (14 if j == 'X' else 0))


def quatre(s, de, a, trous=(), ouvert=True, crash=True):
    """La batterie à quatre temps (de `de` à `a`, en temps) : grosse caisse (boîte et batterie),
    caisse « gated » sur 2 et 4, charleston en croches (ouvert sur les contretemps)."""
    for t in [de + k * 1.0 for k in range(int(round(a - de)))]:
        if not dans_trou(t, trous):
            s.note(kick, 'K', t, 0.25, vel=112)
            s.note(kit, 'K', t, 0.25, vel=104)
        if (round(t) % 2 == 1) and not dans_trou(t, trous):
            s.note(caisse_g, 'S', t, 0.25, vel=110)
        for d, piece, v in ((0.0, 'H', 84), (0.5, 'O' if ouvert else 'H', 92)):
            if not dans_trou(t + d, trous):
                s.note(kit, piece, t + d, 0.25, vel=v)
    if crash:
        s.note(kit, 'C', de, 1, vel=110)


def cassee(s, de, a, trous=()):
    """La batterie cassée : grosse caisse sur 1, le « et » de 2, 3 ; caisse sur 2 et 4 ; les
    toms qui roulent en fin de mesure paire."""
    k = 0
    t = de
    while t < a - 1e-9:
        for d, v in ((0.0, 112), (1.5, 100), (2.0, 108)):
            if not dans_trou(t + d, trous):
                s.note(kick, 'K', t + d, 0.25, vel=v)
                s.note(kit, 'K', t + d, 0.25, vel=v - 6)
        for d in (1.0, 3.0):
            if not dans_trou(t + d, trous):
                s.note(caisse_g, 'S', t + d, 0.25, vel=108)
        for i in range(8):
            if not dans_trou(t + i * 0.5, trous):
                s.note(kit, 'H', t + i * 0.5, 0.25, vel=86 if i % 2 == 0 else 70)
        if k % 2 == 1:
            for i, piece in enumerate(('T6', 'T5', 'T4', 'T3')):
                if not dans_trou(t + 3 + i * 0.25, trous):
                    s.note(kit, piece, t + 3 + i * 0.25, 0.25, vel=96)
        t += 4.0
        k += 1


def montee(s, de, a, vel=100):
    s.note(effets, 'E3', de, a - de, vel=vel, art='montee')
    s.note(timb_roul, 'E2', de, a - de, vel=90)
    s.expression(timb_roul, [(de, 'p'), (a, 'ff')])
    secondes = 2.0
    temps = secondes * 150 / 60.0
    s.note(suspendue, 'C4', a - temps, temps, vel=96, art='monte_2s')


def fondamentales(s, piste, temps, octave, vel=80, de=0, jusqua=None, trous=()):
    """Les fondamentales tenues (une note par plage d'accords égaux) ; une cassure coupe la
    note, qui reprend après elle."""
    fin = len(temps) if jusqua is None else jusqua
    b = de
    while b < fin:
        c = temps[int(b)]
        e = b + 1
        while e < fin and temps[int(e)] == c:
            e += 1
        debut = b
        for ta, tb in sorted(trous):
            if ta < e and tb > debut:
                if ta > debut:
                    s.note(piste, racine(c, octave), debut, ta - debut, vel=vel)
                debut = max(debut, tb)
        if debut < e:
            s.note(piste, racine(c, octave), debut, e - debut, vel=vel)
        b = e


# =====================================================================================
# Les sections

@theme.section('intro', mesures=2)
def intro(s):
    t = temps_de('i i')
    nuances(s, basse_s='mf', celles='mf', kick='f', kit='mf')
    # l'arc, seul (une demi-mesure de silence autour de lui)
    arc.poser(s, 0, impact=True)
    # la basse en doubles croches qui s'ouvre, les violoncelles avec elle
    basse(s, t, 'ab', de=1, vel=86, trous=[(0, 1.5)])
    s.automation(basse_s, 'coupure', [(1.5, 0.25), (s.m(2, 4), 1.0)])
    seizes(s, celles, t, 2, 'ab', de=1, vel=80, trous=[(0, 2.0)])
    s.crescendo(celles, 2, 8, 'mp', 'f')
    # la grosse caisse entre à la mesure 2 ; un roulement de toms relance
    for b in (4, 5, 6, 7):
        s.note(kick, 'K', b, 0.25, vel=110)
    s.joue(kit, batterie('T6 : . . . . . . . . X . X . . . . .\nT3 : . . . . . . . . . . . . X X X X'), a=s.m(2))


GRILLE_A = 'i i II i i i II VII'


@theme.section('A1', mesures=8)
def A1(s):
    t = temps_de(GRILLE_A)
    nuances(s, celles='f', basses='f', basse_s='mf', kick='f', kit='mf', caisse_g='mf', trombones='ff',
            nappe='p')
    quatre(s, 0, s.longueur)
    seizes(s, celles, t, 2, 'abcd', vel=86)
    basse(s, t, 'abcd', vel=84)
    accents_basses(s, t)
    fondamentales(s, nappe, t, 3, vel=70)
    # m. 5 : les trombones martèlent la tête en diminution, deux fois
    s.joue(trombones, TETE_DIM, a=s.m(5) - 0.5, vel=110)
    s.joue(trombones, TETE_DIM, a=s.m(7) - 0.5, vel=114)


@theme.section('A2', mesures=8)
def A2(s):
    t = temps_de('i VI.VI.vii.i i II i VI.VI.vii.i i II')
    nuances(s, celles='f', basses='f', basse_s='mf', kick='f', kit='mf', caisse_g='f', cors='ff', trombones='f',
            trompettes='f', nappe='p')
    quatre(s, 0, s.longueur)
    seizes(s, celles, t, 2, 'badc', vel=88)
    basse(s, t, 'badc', vel=86)
    accents_basses(s, t, figs='badc')
    fondamentales(s, nappe, t, 3, vel=72)
    # le motif diminué : les cors, les trombones à l'octave grave (m. 2 et m. 6 : la mèche sur
    # ♭VI, « sol fa » sur ♭vii, « la mi » sur i)
    for m in (2, 6):
        s.joue(cors, MOTIF_DIM.octave(1), a=s.m(m) - 0.5, vel=112)
        s.joue(trombones, MOTIF_DIM, a=s.m(m) - 0.5, vel=110)
    # les trompettes répondent par la tête, décalée : sa note longue sur le contretemps (m. 4, m. 8)
    for m in (4, 8):
        s.joue(trompettes, TETE_DIM.octave(1), a=s.m(m), vel=104)


GRILLE_B = 'i VII VI VII i VII VI VII'


@theme.section('B1', mesures=8)
def B1(s):
    t = temps_de(GRILLE_B)
    trous = [(s.m(2, 3), s.m(3)), (s.m(4, 3), s.m(5)), (s.m(6, 3), s.m(7))]
    nuances(s, celles='f', basses='f', basse_s='mf', kick='f', kit='mf', caisse_g='f', coups='mf', nappe='mp')
    quatre(s, 0, s.longueur, trous=trous)
    seizes(s, celles, t, 2, 'cadb', vel=88, trous=trous)
    basse(s, t, 'cadb', vel=86, trous=trous)
    accents_basses(s, t, figs='cadb', trous=trous)
    fondamentales(s, nappe, t, 3, vel=74, trous=trous)
    # les quintes frappées sur chaque premier temps, et sur le « et » de 2
    coups_quintes(s, t, 'X . . . . . x . . . . . . . . .', trous=trous)
    # la cassure de la mesure 4 : l'arc, à découvert
    arc.poser(s, s.m(4, 3) + 0.1, impact=True)
    # les cuivres relancent après chaque cassure (la tête diminuée)
    for m in (3, 7):
        s.joue(trombones, TETE_DIM, a=s.m(m) - 0.5, vel=108)
    s.nuance(trombones, 'ff')


TEMPS_C1 = 'VI.VI.vii.i VI.VI.vii.i II i VI.VI.vii.i VI.VI.vii.i II i'


def sommet_base(s, t, figs='abdc', trous=(), crash_a=0.0, braam_a=0.0, braam_h='C2'):
    """Le socle d'un sommet : batterie, doubles croches graves et aiguës, basse, taïkos,
    timbales, le braam au premier temps."""
    quatre(s, 0, s.longueur, trous=trous, crash=False)
    s.note(kit, 'CH', crash_a, 1, vel=116)
    s.note(cymbales, 'C4', crash_a, 2, vel=110)
    seizes(s, celles, t, 2, figs, vel=92, trous=trous)
    seizes(s, altos, t, 3, figs[1:] + figs[0], vel=84, trous=trous)
    seizes(s, violons, t, 4, figs[2:] + figs[:2], vel=80, trous=trous)
    basse(s, t, figs, vel=88, trous=trous)
    accents_basses(s, t, figs=figs, trous=trous)
    fondamentales(s, tuba, t, 2, vel=96, trous=trous)
    fondamentales(s, cuivre_s, t, 2, vel=88, trous=trous)
    jetons = 'X . . x . . X . X . . x . . X x'.split()
    k = 0
    for m in range(1, s.mesures + 1):
        for i, j in enumerate(jetons):
            t0 = s.m(m) + i * 0.25
            if j == '.' or dans_trou(t0, trous):
                continue
            s.note(taiko, ('E2', 'B2')[k % 2], t0, 0.25, vel=112 if j == 'X' else 92)
            k += 1
    s.note(braam, braam_h, braam_a, 3, vel=120)
    s.note(timbales, 'E2', braam_a, 1, vel=116)


@theme.section('C1', mesures=8)
def C1(s):
    t = temps_de(TEMPS_C1)
    nuances(s, celles='ff', basses='ff', altos='f', violons='mf', basse_s='mf', kick='f', kit='f', caisse_g='f',
            cors='ff', trombones='ff', trompettes='f', tuba='f', taiko='f', timbales='f', cuivre_s='mf', nappe='mp')
    sommet_base(s, t)
    # le motif diminué en appel et réponse : l'appel aux cors et aux trompettes à l'unisson
    # (m. 1, m. 5), la réponse aux trombones, une octave plus bas (m. 2, m. 6)
    for m in (1, 5):
        corps = MOTIF_DIM if m > 1 else MOTIF_DIM.coupe(0.5, MOTIF_DIM.longueur)
        a = s.m(m) - 0.5 if m > 1 else 0
        s.joue(cors, corps.octave(1), a=a, vel=116)
        s.joue(trompettes, corps.octave(1), a=a, vel=100)
    for m in (2, 6):
        s.joue(trombones, MOTIF_DIM, a=s.m(m) - 0.5, vel=116)
    # m. 3–4 et 7–8 : les quintes frappées répondent
    coups_quintes(s, t, 'X . x . X . x . X . x . X x X x', de=3, a=4)
    coups_quintes(s, t, 'X . x . X . x . X . x . X x X x', de=7, a=8)
    s.note(braam, 'C2', s.m(5), 2.5, vel=114)
    s.note(cymbales, 'C4', s.m(5), 2, vel=104)


@theme.section('C2', mesures=8)
def C2(s):
    t = temps_de('i II i II VI VII VI.VI.VII.VII i')
    trous = [(s.m(8, 3), s.m(9))]
    nuances(s, celles='ff', basses='ff', altos='f', violons='f', basse_s='mf', kick='f', kit='f', caisse_g='f',
            cors='ff', trombones='f', trompettes='f', tuba='f', taiko='f', timbales='f', cuivre_s='mf', nappe='mp')
    sommet_base(s, t, figs='dcba', trous=trous, braam_h='E2')
    # le motif aux cors, son renversement aux trombones une demi-mesure plus tard (m. 1 et m. 3) :
    # renversé autour de ré, il reste dans le mode (do fa | MI ── la si | sol do) et sa note
    # longue tombe sur la tonique grave
    renverse = MOTIF_DIM.inverse('D3')
    for m in (1, 3):
        corps = MOTIF_DIM if m > 1 else MOTIF_DIM.coupe(0.5, MOTIF_DIM.longueur)
        s.joue(cors, corps.octave(1), a=s.m(m) - 0.5 if m > 1 else 0, vel=116)
        s.joue(trombones, renverse, a=s.m(m) + 1.5, vel=112)
    # m. 5–7 : ♭VI – ♭VII – ♭VI ♭VII, les trombones et les cors en quintes tenues ; m. 8 i, la cassure
    for a, d, ch in ((s.m(5), 4, 'VI'), (s.m(6), 4, 'VII'), (s.m(7), 2, 'VI'), (s.m(7, 3), 2, 'VII')):
        for h in QUINTE[ch]:
            s.note(trombones, h, a, d, vel=110)
        for h in (QUINTE[ch][1], QUINTE[ch][2]):
            s.note(cors, nom(hauteur(h) + 12), a, d, vel=110)
    s.joue(trompettes, MOTIF_DIM.octave(1), a=s.m(5) - 0.5, vel=104)
    s.joue(trompettes, TETE_DIM.octave(1), a=s.m(7) - 0.5, vel=108)
    for h in QUINTE['i']:
        s.note(trombones, h, s.m(8), 2, vel=118)
    s.note(braam, 'E2', s.m(8), 2, vel=118)
    s.note(cymbales, 'C4', s.m(8), 2, vel=112)


@theme.section('T1', mesures=8)
def T1(s):
    t = temps_de('i i II i i i i II')
    nuances(s, basse_s='p', kit='p', kick='pp', nappe='mp', piano='f')
    # la pulsation ne s'arrête pas : la grosse caisse douce, le charleston ; la cymbale marque
    # l'arrivée
    s.note(kit, 'C', 0, 1, vel=72)
    for b in range(32):
        s.note(kick, 'K', b, 0.25, vel=96)
        s.note(kit, 'H', b + 0.5, 0.25, vel=72)
    basse(s, t, 'aabb', vel=80)
    s.automation(basse_s, 'coupure', [(0, 0.3), (s.m(6), 0.3), (s.m(8, 4), 1.0)])
    fondamentales(s, nappe, t, 3, vel=80)
    # le piano : la tête en valeurs longues (m. 2), puis renversée autour de ré (m. 6 : do fa |
    # MI, la chute qui se pose sur la tonique)
    lente = TETE.augmente(2)
    s.joue(piano, lente.octave(1), a=s.m(2) - 2, vel=84)
    s.joue(piano, lente, a=s.m(2) - 2, vel=60)
    s.joue(piano, lente.inverse('D4'), a=s.m(6) - 2, vel=80)
    s.joue(piano, lente.inverse('D4').octave(-1), a=s.m(6) - 2, vel=58)
    for m in (1, 3, 5, 7):
        s.note(piano, racine(t[(m - 1) * 4], 2), s.m(m), 4, vel=64)
    # m. 7–8 : les cordes graves reviennent, la montée
    seizes(s, celles, t, 2, 'ab', de=7, a=8, vel=78)
    s.crescendo(celles, s.m(7), s.m(9), 'mp', 'f')
    montee(s, s.m(7), s.m(9))


@theme.section('A3', mesures=8)
def A3(s):
    t = temps_de('i i II i i i VI VII')
    nuances(s, celles='f', basses='f', basse_s='mf', kick='f', kit='mf', caisse_g='f', cors='ff', nappe='p')
    cassee(s, 0, s.longueur)
    s.note(kit, 'C', 0, 1, vel=110)
    seizes(s, celles, t, 2, 'cbda', vel=88)
    basse(s, t, 'cbda', vel=86)
    accents_basses(s, t, figs='cbda')
    fondamentales(s, nappe, t, 3, vel=72)
    # la tête aux cors, en valeurs normales (m. 2, m. 6), comme un appel
    s.joue(cors, TETE.octave(1), a=s.m(2) - 1, vel=110)
    s.joue(cors, TETE.octave(1), a=s.m(6) - 1, vel=114)


@theme.section('A4', mesures=8)
def A4(s):
    t = temps_de('i II i VI.VI.vii.i i II i VI.VI.vii.i')
    nuances(s, celles='f', basses='f', basse_s='mf', kick='f', kit='mf', caisse_g='f', coups='f', trompettes='f',
            nappe='p')
    quatre(s, 0, s.longueur)
    seizes(s, celles, t, 2, 'dbca', vel=88)
    basse(s, t, 'dbca', vel=86)
    accents_basses(s, t, figs='dbca')
    fondamentales(s, nappe, t, 3, vel=74)
    # les quintes frappées sur les contretemps (« pa ») ; le motif diminué aux trompettes
    coups_quintes(s, t, '. . x . . . x . . . x . . . x .', vel=96)
    for m in (4, 8):
        s.joue(trompettes, MOTIF_DIM.octave(1), a=s.m(m) - 0.5, vel=108)
    montee(s, s.m(7), s.m(9))


@theme.section('B2', mesures=8)
def B2(s):
    t = temps_de('VI VII VI VII VI VII VI.VI.VII.VII i')
    trous = [(s.m(2, 3), s.m(3)), (s.m(6, 3), s.m(7))]
    nuances(s, celles='f', basses='f', basse_s='mf', kick='f', kit='mf', caisse_g='f', coups='mp', trombones='ff',
            cors='ff', nappe='mp')
    quatre(s, 0, s.longueur, trous=trous)
    seizes(s, celles, t, 2, 'acbd', vel=88, trous=trous)
    basse(s, t, 'acbd', vel=86, trous=trous)
    accents_basses(s, t, figs='acbd', trous=trous)
    fondamentales(s, nappe, t, 3, vel=74, trous=trous)
    coups_quintes(s, t, 'X . . x . . X . X . . x . . X .', trous=trous)
    # la cassure de la mesure 6 : l'arc
    arc.poser(s, s.m(6, 3) + 0.1, impact=True)
    # ♭VI – ♭VII – i à la fin : les cors chantent la tête (après la cassure, l'arc à découvert),
    # les trombones la reprennent sur i
    s.joue(cors, TETE_DIM.octave(1), a=s.m(7), vel=112)
    s.joue(trombones, TETE_DIM, a=s.m(8) - 0.5, vel=110)


TEMPS_C3 = 'VI.VI.vii.i VI.VI.vii.i II i VI.VI.vii.i VI.VI.vii.i VI VII'


@theme.section('C3', mesures=8)
def C3(s):
    t = temps_de(TEMPS_C3)
    nuances(s, celles='ff', basses='ff', altos='f', violons='mf', basse_s='mf', kick='f', kit='f', caisse_g='f',
            cors='ff', trombones='ff', trompettes='f', tuba='f', taiko='f', timbales='f', cuivre_s='mf', nappe='mp')
    sommet_base(s, t, figs='bdac')
    # le motif diminué (cors, et les trombones à l'octave grave) ; les trompettes reprennent la
    # tête en canon, deux octaves plus haut, une croche après la note longue des cors (mi 5 si 5
    # DO 6, qui tient pendant que les cors descendent) ; puis elles prennent le motif tout en
    # haut, seules (m. 2, m. 6 : la ligne haute)
    for m in (1, 5):
        corps = MOTIF_DIM if m > 1 else MOTIF_DIM.coupe(0.5, MOTIF_DIM.longueur)
        a = s.m(m) - 0.5 if m > 1 else 0
        s.joue(cors, corps.octave(1), a=a, vel=116)
        s.joue(trombones, corps, a=a, vel=114)
        s.joue(trompettes, TETE_DIM.octave(2), a=s.m(m) + 0.5, vel=100)
    for m in (2, 6):
        s.joue(trompettes, MOTIF_DIM.octave(2), a=s.m(m) - 0.5, vel=106)
    coups_quintes(s, t, 'X . x . X . x . X . x . X x X x', de=3, a=4)
    coups_quintes(s, t, 'X . x x X . x x X . x x X X X X', de=7, a=8)
    s.note(braam, 'C2', s.m(5), 2.5, vel=114)


@theme.section('C4', mesures=8)
def C4(s):
    t = temps_de('VI VI.VI.vii.i i i VI VI.VI.vii.i i VI.VI.VII.VII')
    nuances(s, celles='ff', basses='ff', altos='f', violons='f', basse_s='mf', kick='f', kit='f', caisse_g='f',
            cors='ff', trombones='ff', trompettes='f', tuba='f', taiko='f', timbales='f', cuivre_s='mf', nappe='mp')
    sommet_base(s, t, figs='cadb', braam_h='C2')
    # le motif à sa vitesse (deux mesures) aux cors, par-dessus sa diminution aux trombones
    for m in (1, 5):
        lent = MOTIF if m > 1 else MOTIF.coupe(1, MOTIF.longueur)
        s.joue(cors, lent.octave(1), a=s.m(m) - 1 if m > 1 else 0, vel=118)
        s.joue(trompettes, lent.octave(1), a=s.m(m) - 1 if m > 1 else 0, vel=102)
    for m in (1, 2, 5, 6):
        corps = MOTIF_DIM if m > 1 else MOTIF_DIM.coupe(0.5, MOTIF_DIM.longueur)
        s.joue(trombones, corps, a=s.m(m) - 0.5 if m > 1 else 0, vel=112)
    # m. 8 : ♭VI – ♭VII en quintes tenues, qui relancent vers R (i)
    for ch, a in (('VI', s.m(8)), ('VII', s.m(8, 3))):
        for h in QUINTE[ch]:
            s.note(coups, h, a, 2, vel=112)
    s.note(cymbales, 'C4', s.m(5), 2, vel=106)


@theme.section('R', mesures=8)
def R(s):
    """Le disjoncteur a sauté : la pulsation continue seule (la grosse caisse, la basse filtrée,
    la nappe), la tête aux trombones, doux, dans le grave ; m. 5 la caisse claire et les
    violoncelles reviennent ; m. 7–8 les toms, la montée : A1 repart."""
    t = temps_de('i i II i i i VI VII')
    nuances(s, basse_s='p', basses='p', kick='p', kit='p', caisse_g='p', trombones='mf', nappe='mp')
    s.note(kit, 'C', 0, 1, vel=100)
    for b in range(32):
        s.note(kick, 'K', b, 0.25, vel=100 if b < 16 else 108)
        s.note(kit, 'H', b + 0.5, 0.25, vel=70 if b < 16 else 82)
    for b in range(17, 32, 2):
        s.note(caisse_g, 'S', b, 0.25, vel=96 if b < 24 else 108)
    basse(s, t, 'bcad', vel=84)
    s.automation(basse_s, 'coupure', [(0, 0.25), (s.m(5), 0.35), (s.m(8, 4), 1.0)])
    accents_basses(s, t, figs='bcad', vel=84)
    fondamentales(s, nappe, t, 3, vel=76)
    s.joue(trombones, TETE_DIM.octave(-1), a=s.m(3) - 0.5, vel=96)
    s.joue(trombones, TETE_DIM.octave(-1), a=s.m(5) - 0.5, vel=104)
    seizes(s, celles, t, 2, 'cadb', de=5, a=8, vel=80)
    s.crescendo(celles, s.m(5), s.m(9), 'p', 'f')
    # la relance vers A1 : le roulement de toms, la montée
    s.joue(kit, batterie('''
        T6 : . . . . . . . . X x . . . . . .
        T4 : . . . . . . . . . . X x . . . .
        T2 : . . . . . . . . . . . . X x X X
    '''), a=s.m(8))
    montee(s, s.m(7), s.m(9))


theme.forme(intro=['intro'], corps=['A1', 'A2', 'B1', 'C1', 'C2', 'T1', 'A3', 'A4', 'B2', 'C3', 'C4', 'R'])
