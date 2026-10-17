"""FUSIBLE — « Le Dernier Tour » (fin) : l'écran de fin d'une carrière, l'épilogue de 2050.

Le motif « Fusible » en valeurs doublées, comme un souvenir : la mi | fa ── ── do si | ré la ;
sa chute « ré – la » harmonisée IV – iv – I (ré majeur, ré mineur, LA MAJEUR : le soupir
plagal, une voix intérieure qui descend fa# – fa – mi) ; sur IV, la septième qui descend vers
la sixte (le « do si » du motif sur ré : l'accord de la nostalgie). Une voix par tour : le
piano seul, le chœur bouche fermée et le sifflet (la flûte sans vibrato), le cor, puis la
foule de 2050, seule et de loin, qui se souvient ; le retour : la montée en valeurs doublées
sur ♭VI ♭VII | I, la majeur. Respiré : des ritardandos en fin de phrase.

LA CARTE (76 à la noire, une mesure = 3,16 s ; le corps boucle : 50 mesures, ~165 s)
  intro  2 m.        l'ARC, doux (la dernière étincelle) ; la main gauche, la quinte
                     ouverte ; « la mi »                                                  2
  A1     8 m.  0:00  le piano seul : le motif en valeurs doublées, la chute sur IV–iv–I ;
                     puis l'interlude (♭VI, ré7 → ré6, ré m → ré m6, la m)                 3
  A2     8 m.  0:25  le piano : la réponse (fa ── sol la | mi, sur ♭VI ♭VII | ♭III) ;
                     des accords qui respirent (ritardando)                               3
  B1     8 m.  0:51  le chœur bouche fermée, violoncelles et contrebasses tenus, l'accord
                     de la nostalgie (do → si sur ré) ; le sifflet chante le motif        5
  B2     8 m.  1:16  le cor chante la réponse ; les cordes enflent sur ré7 → ré6, puis
                     s'éteignent (ritardando)                                         6 → 3
  C      8 m.  1:43  2050 : la foule seule, de loin, chante le motif et sa réponse
                     (aucun instrument) ; l'ARC très loin au premier temps ; la rumeur    2
  D     10 m.  2:11  le retour : le piano, les cordes, le cor : la montée en valeurs
                     doublées sur ♭VI ♭VII | LA MAJEUR ; ré → ré m → la (le dernier
                     soupir) ; la dernière mesure s'ouvre sur ♭VII (sol) et enfle
                     jusqu'au raccord (les cordes), où le piano reprend seul      6 → 2 → 4
  Le creux : C. L'arc : l'intro et le premier temps de C.
"""
from moteur.ecriture import *
from moteur.theorie import fondamentale
from partitions._fusible import phrase, Arc

theme = Theme('fin', 'Le Dernier Tour', bpm=76, mesure='4/4', tonalite='la mineur', graine=2050,
              ville=False, moment="l'écran de fin d'une carrière, l'épilogue de 2050",
              humeur='le dernier tour : le piano seul, le chœur bouche fermée, le stade qui se souvient')

TON = 'la mineur'

arc = Arc(theme, volume=-16, impact_volume=-14)
# l'équilibre d'origine des quatre voix de l'arc (la calibration corrigée des synthés a baissé
# ses voix aiguës plus que son grésillement) : comme dans le thème principal
for _voix, _db in ((arc.zap, 4.5), (arc.clics, 3.4), (arc.ton, 2.7), (arc.bzz, 0.8)):
    _voix.reglages['volume'] = _voix.reglages.get('volume', 0.0) + _db
# le piano : 'tenu' (la pédale écrite : chaque note dure jusqu'au changement d'harmonie ;
# la pédale du studio laisse sonner 2,2 s et brouillerait fa# – fa – mi)
piano = theme.piste('piano', art='tenu', humain=(14, 6), volume=4)                   # le chant
piano_mg = theme.piste('piano_mg', 'piano', art='tenu', humain=(12, 5), volume=2)     # la main gauche
choeur = theme.piste('choeur', art='ouh', profondeur=0.7, volume=-6)
foule = theme.piste('foule', art='o', profondeur=0.85, volume=-6)
rumeur = theme.piste('rumeur', 'foule', art='rumeur', profondeur=0.9, volume=-7)
flute = theme.piste('flute', 'flutes', art='sans_vibrato', volume=2)               # le sifflet
cor = theme.piste('cor', 'cors', art='tenu', volume=-4)
violons = theme.piste('violons', art='tenu', volume=-6)
altos = theme.piste('altos', art='tenu', volume=-4)
celles = theme.piste('celles', 'violoncelles', art='tenu', volume=0)
basses = theme.piste('basses', 'contrebasses', art='sans_vibrato', volume=-1)
timb_roul = theme.piste('timb_roul', 'timbales', art='roulement', volume=-14)


def nuances(s, **niveaux):
    for nom_piste, v in niveaux.items():
        s.nuance(theme.pistes[nom_piste], v, 0)


# =====================================================================================
# Le matériau : le motif en valeurs doublées (l'anacrouse dure deux temps)

MOTIF = phrase('motif', TON, octave=4).augmente(2)        # la4 mi5 | fa5 (6) do5 si4 | ré5 (2) la4
REPONSE = phrase('reponse', TON, octave=4).augmente(2)    # la4 mi5 | fa5 (6) sol5 la5 | mi5
MONTEE = phrase('montee', TON, octave=4).augmente(2)      # la4 mi5 | fa5 (4) sol5 (4) | la5 (8)
MOTIF_C = phrase('motif', TON, octave=2)                  # la foule de 2050 : la2 mi3 | fa3…
REPONSE_C = phrase('reponse', TON, octave=2)
ANACROUSE = phrase('anacrouse', TON, octave=4).augmente(2)

# les voix intérieures sous chaque énoncé (temps depuis l'anacrouse, durée, notes) : sous
# la chute, fa# – fa – mi (ré, ré m, la) ; sous « do si », ré7 → ré6
ALTO_MOTIF = ((2, 4, ('A4', 'C5')), (6, 2, ('A4', 'D5')), (8, 1, ('F#4', 'A4')), (9, 1, ('F#4', 'A4')),
              (10, 1, ('F#4', 'A4')), (11, 1, ('F4', 'A4')), (12, 4, ('C#4', 'E4')))
ALTO_REPONSE = ((2, 4, ('A4', 'C5')), (6, 2, ('A4', 'C5')), (8, 1, ('B4', 'D5')), (9, 1, ('B4', 'D5')),
                (10, 4, ('G4', 'C5')), (14, 2, ('A4', 'C5')))
ALTO_MONTEE = ((2, 4, ('A4', 'C5')), (6, 4, ('B4', 'D5')), (10, 8, ('C#5', 'E5')))
# l'harmonie des quatre mesures d'un énoncé (la mesure du « fa » d'abord)
G_MOTIF = ['bVI', 'iv iv IV7 IV6', 'IV iv I I']
G_REPONSE = ['bVI', 'bVI bVI bVII bVII', 'bIII']


def temps(grille):
    sortie = []
    for c in grille:
        x = c.split()
        for a in x:
            sortie += [a] * (4 // len(x))
    return sortie


def plages(t, cle=None):
    """Les accords consécutifs regroupés : (début, longueur, accord) ; `cle` regroupe ce
    qui partage une même clé (la fondamentale, pour les quintes et les basses tenues)."""
    sortie = []
    for i, c in enumerate(t):
        if sortie and (cle or (lambda x: x))(sortie[-1][2]) == (cle or (lambda x: x))(c):
            d, l, _ = sortie[-1]
            sortie[-1] = (d, l + 1, c)
        else:
            sortie.append((i, 1, c))
    return sortie


def classe(ch):
    return fondamentale(ch, TON)[0]


def basse_piano(ch):
    """La fondamentale de la main gauche : la, si♭, si au grave (octave 1), les autres à
    l'octave 2 — la basse descend avec la chute (ré2 → la1)."""
    c = classe(ch)
    return 12 * (2 if c >= 9 else 3) + c


def voicing(ch, bas):
    g = hauteur(bas)
    sortie = set()
    for h in accord(ch, TON, octave=2):
        while h < g:
            h += 12
        sortie.add(h)
    return sorted(sortie)


def nappe(s, piste, t, bas, vel=64, de=0, jusqua=None):
    fin = len(t) if jusqua is None else jusqua
    for d, l, c in plages(t):
        if d + l <= de or d >= fin:
            continue
        a = max(d, de)
        for h in voicing(c, bas):
            s.note(piste, h, a, min(d + l, fin) - a, vel=vel)


def main_gauche(s, t, de, a, vel=60, jusqua=None):
    """La main gauche en quintes ouvertes : la fondamentale, la quinte, l'octave, la quinte,
    en noires, chacune tenue jusqu'au changement de fondamentale (la pédale écrite) ; sans
    tierce, ré–la porte ré majeur comme ré mineur."""
    fin = min(jusqua if jusqua is not None else s.m(a + 1), len(t))
    for d, l, c in plages(t, cle=classe):
        for b in range(int(l)):
            pos = d + b
            if pos < s.m(de) or pos >= fin:
                continue
            r = basse_piano(c)
            k = b % 4                       # la fondamentale à chaque changement
            s.note(piano_mg, (r, r + 7, r + 12, r + 7)[k], pos, min(d + l, fin) - pos,
                   vel=vel + (8 if k == 0 else 0))


def fondamentales(s, t, de=0, jusqua=None, vel_c=64, vel_b=60):
    """Les violoncelles et les contrebasses tiennent les fondamentales."""
    fin = len(t) if jusqua is None else jusqua
    for d, l, c in plages(t, cle=classe):
        if d + l <= de or d >= fin:
            continue
        a = max(d, de)
        r = basse_piano(c)
        s.note(celles, r + 12, a, min(d + l, fin) - a, vel=vel_c)
        s.note(basses, r if r >= hauteur('E1') else r + 12, a, min(d + l, fin) - a, vel=vel_b)


def enonce(s, piste, motif, alto, a, vel=84, alto_piste=None, alto_vel=58, transpose=0):
    """Un énoncé en valeurs doublées à `a` (l'anacrouse), et ses voix intérieures."""
    s.joue(piste, motif, a=a, vel=vel, transpose=transpose)
    for t0, d, notes in alto:
        for h in notes:
            s.note(alto_piste or piste, hauteur(h) + transpose, a + t0, d, vel=alto_vel)


def roulement(s, piste, h, de, a, nd, na, vel=80):
    s.note(piste, h, de, a - de, vel=vel)
    s.expression(piste, [(de, nd), (a, na)])


# =====================================================================================
# Les sections

@theme.section('intro', mesures=2)
def intro(s):
    nuances(s, piano='mp', piano_mg='p')
    arc.poser(s, 0, vel=104)
    # la quinte ouverte de la (la1 mi2 la2 mi2), puis « la mi »
    s.note(piano_mg, 'A1', s.m(1, 2), 3, vel=58, art='pedale')
    main_gauche(s, temps(['i', 'i']), 2, 2, vel=56)
    s.joue(piano, ANACROUSE, a=s.m(2, 3), vel=80)


# --- A1 : le piano seul ----------------------------------------------------------------------
GRILLE_A1 = G_MOTIF + ['I', 'bVI', 'IV7 IV7 IV6 IV6', 'iv iv iv6 iv6', 'i']


@theme.section('A1', mesures=8)
def A1(s):
    t = temps(GRILLE_A1)
    nuances(s, piano='mp', piano_mg='p')
    # m. 1–4 : le motif (son anacrouse à la fin de la section d'avant), la chute sur IV–iv–I ;
    # le fa d'abord, seul sur sa basse, les voix intérieures au deuxième temps
    alto = tuple((t0 - 2, d, n) for t0, d, n in ALTO_MOTIF)
    enonce(s, piano, MOTIF.coupe(2, 16), ((1, 3, alto[0][2]),) + alto[1:], 0, vel=84)
    main_gauche(s, t, 1, 8, vel=58)
    # m. 5–8 : l'interlude : ♭VI, ré7 → ré6, ré m → ré m6 (la sixte du dorien), la m
    for m, b, d, notes in ((5, 1, 4, ('F4', 'A4', 'C5')), (6, 1, 2, ('F#4', 'A4', 'C5')),
                           (6, 3, 2, ('F#4', 'A4', 'B4')), (7, 1, 2, ('F4', 'A4', 'D5')),
                           (7, 3, 2, ('F4', 'A4', 'B4')), (8, 1, 2, ('E4', 'A4', 'C5'))):
        for i, h in enumerate(notes):
            s.note(piano, h, s.m(m, b), d, vel=66 if i == len(notes) - 1 else 54)
    s.joue(piano, ANACROUSE, a=s.m(8, 3), vel=80)


# --- A2 : la réponse ------------------------------------------------------------------------
GRILLE_A2 = G_REPONSE + ['i', 'iv', 'bVI', 'bVII', 'bVII']


@theme.section('A2', mesures=8, bpm=(76, 72))
def A2(s):
    t = temps(GRILLE_A2)
    nuances(s, piano='mp', piano_mg='p')
    enonce(s, piano, REPONSE.coupe(2, 16), tuple((t0 - 2, d, n) for t0, d, n in ALTO_REPONSE), 0, vel=86)
    main_gauche(s, t, 1, 8, vel=58)
    # m. 5–8 : des accords qui respirent, vers le chœur
    for m, notes in ((5, ('D4', 'F4', 'A4')), (6, ('C4', 'F4', 'A4')), (7, ('D4', 'G4', 'B4')),
                     (8, ('D4', 'G4', 'B4'))):
        for i, h in enumerate(notes):
            s.note(piano, h, s.m(m), 4, vel=(60 if i == 2 else 50) - (6 if m == 8 else 0))
    s.expression(piano, [(s.m(5), 'mp'), (s.m(8, 4), 'p')])
    s.expression(piano_mg, [(s.m(5), 'p'), (s.m(8, 4), 'pp')])


# --- B1 : le chœur bouche fermée, le sifflet ------------------------------------------------------
GRILLE_B1 = ['i', 'bVI', 'IV7 IV7 IV6 IV6', 'i'] + G_MOTIF + ['I']
CHOEUR_B1 = ((1, 1, 4, ('A3', 'C4', 'E4')), (2, 1, 4, ('A3', 'C4', 'F4')), (3, 1, 2, ('F#3', 'A3', 'C4')),
             (3, 3, 2, ('F#3', 'A3', 'B3')), (4, 1, 4, ('A3', 'C4', 'E4')),
             (5, 1, 4, ('A3', 'C4', 'F4')), (6, 1, 2, ('A3', 'D4', 'F4')), (6, 3, 1, ('F#3', 'A3', 'C4')),
             (6, 4, 1, ('F#3', 'A3', 'B3')), (7, 1, 1, ('F#3', 'A3', 'D4')), (7, 2, 1, ('F3', 'A3', 'D4')),
             (7, 3, 2, ('E3', 'A3', 'C#4')), (8, 1, 4, ('E3', 'A3', 'C#4')))


@theme.section('B1', mesures=8)
def B1(s):
    t = temps(GRILLE_B1)
    nuances(s, choeur='p', celles='p', basses='p', flute='mp', cor='mf')
    for m, b, d, notes in CHOEUR_B1:
        for h in notes:
            s.note(choeur, h, s.m(m, b), d, vel=72)
    s.expression(choeur, [(0, 'pp'), (s.m(3), 'mp'), (s.m(4, 4), 'p'), (s.m(7), 'mp'), (s.m(8, 4), 'p')])
    fondamentales(s, t, vel_c=66, vel_b=62)
    # le sifflet : le motif une octave plus haut (l'anacrouse à la m. 4)
    s.joue(flute, MOTIF.octave(1), a=s.m(4, 3), vel=82)
    # l'anacrouse du cor
    s.joue(cor, ANACROUSE.octave(-1), a=s.m(8, 3), vel=82)


# --- B2 : le cor chante la réponse ; les cordes enflent --------------------------------------------
GRILLE_B2 = G_REPONSE + ['i', 'iv', 'IV7 IV7 IV6 IV6', 'bVI', 'bVII']


@theme.section('B2', mesures=8, bpm=(76, 70))
def B2(s):
    t = temps(GRILLE_B2)
    nuances(s, cor='mf', choeur='p', celles='p', basses='p', altos='pp', violons='pp')
    s.joue(cor, REPONSE.octave(-1).coupe(2, 16), a=0, vel=88)
    nappe(s, choeur, t, 'G3', vel=70, jusqua=s.m(5))
    nappe(s, altos, t, 'C4', vel=62, jusqua=s.m(5))
    fondamentales(s, t, vel_c=68, vel_b=64)
    # m. 5–8 : les cordes et le chœur enflent sur ré7 → ré6 (do → si en haut), puis s'éteignent
    for m, b, d, notes in ((5, 1, 4, ('D4', 'F4', 'A4')), (6, 1, 2, ('F#4', 'A4', 'C5')),
                           (6, 3, 2, ('F#4', 'A4', 'B4')), (7, 1, 4, ('F4', 'A4', 'C5')),
                           (8, 1, 4, ('D4', 'G4', 'B4'))):
        for h in notes:
            s.note(violons, h, s.m(m, b), d, vel=74)
            s.note(choeur, hauteur(h) - 12, s.m(m, b), d, vel=74)
        s.note(altos, hauteur(notes[0]) - 12, s.m(m, b), d, vel=66)
    for p in (violons, choeur, altos):
        s.expression(p, [(s.m(5), 'p'), (s.m(6, 3), 'mf'), (s.m(8, 4), 'pp')])
    s.expression(celles, [(s.m(5), 'p'), (s.m(6, 3), 'mp'), (s.m(8, 4), 'pp')])
    s.expression(basses, [(s.m(5), 'p'), (s.m(6, 3), 'mp'), (s.m(8, 4), 'pp')])


# --- C : 2050, la foule de loin -------------------------------------------------------------------
@theme.section('C', mesures=8, bpm=68)
def C(s):
    nuances(s, foule='mp', rumeur='p')
    arc.poser(s, 0, impact=False, vel=96)
    # la rumeur du stade, le la grave ; la foule chante le motif et sa réponse, seule
    s.note(rumeur, 'A2', 0, s.longueur, vel=70)
    s.expression(rumeur, [(0, 'pp'), (s.m(3), 'p'), (s.m(8, 4), 'pp')])
    s.joue(foule, MOTIF_C, a=s.m(1, 4), vel=84)
    s.joue(foule, REPONSE_C, a=s.m(3, 4), vel=86)
    # le dernier « o », tenu sur la, qui s'éteint sous la rumeur
    s.note(foule, 'A2', s.m(6), 8, vel=74)
    s.expression(foule, [(s.m(1, 4), 'mp'), (s.m(5), 'mp'), (s.m(6), 'p'), (s.m(7, 4), 'pp')])


# --- D : le retour --------------------------------------------------------------------------------
GRILLE_D = ['i', 'i', 'bVI', 'bVII', 'I', 'I', 'IV', 'iv', 'I', 'bVII']


@theme.section('D', mesures=10, bpm=(74, 68))
def D(s):
    t = temps(GRILLE_D)
    nuances(s, piano='mp', piano_mg='p', cor='mf', celles='pp', basses='pp', altos='pp', violons='pp', choeur='pp')
    # m. 1–2 : le piano revient sur la mineur ; « la mi » au piano et au cor
    main_gauche(s, t, 1, 10, vel=60)
    for h in ('E4', 'A4', 'C5'):
        s.note(piano, h, 0, 8, vel=56)
    fondamentales(s, t, vel_c=62, vel_b=58)
    # m. 3–6 : la montée en valeurs doublées : fa | sol | LA (la majeur)
    enonce(s, piano, MONTEE, ALTO_MONTEE, s.m(2, 3), vel=88, alto_vel=60)
    s.joue(cor, MONTEE.octave(-1), a=s.m(2, 3), vel=90)
    nappe(s, choeur, t, 'A3', vel=72, de=s.m(3), jusqua=s.m(7))
    nappe(s, altos, t, 'C4', vel=66, de=s.m(3), jusqua=s.m(7))
    for m, notes in ((3, ('C5', 'F5')), (4, ('D5', 'G5')), (5, ('C#5', 'E5', 'A5')), (6, ('C#5', 'E5', 'A5'))):
        for h in notes:
            s.note(violons, h, s.m(m), 4, vel=72)
    # les nappes (chœur, altos) un cran sous les violons, qui doublent la montée en haut
    for p in (violons, celles, basses):
        s.expression(p, [(s.m(3), 'pp'), (s.m(5), 'mf'), (s.m(6, 4), 'mp')])
    for p in (choeur, altos):
        s.expression(p, [(s.m(3), 'pp'), (s.m(5), 'mp'), (s.m(6, 4), 'mp')])
    roulement(s, timb_roul, 'A2', s.m(4, 3), s.m(5), 'pp', 'mp', vel=70)
    # m. 6 : la dernière étincelle du piano (la majeur qui monte)
    s.joue(piano, mel('C#6:.5 E6:.5 A6:2'), a=s.m(6, 2), vel=62)
    # m. 7–9 : ré → ré m → la : le dernier soupir (fa# – fa – mi en haut des violons)
    for m, notes in ((7, ('D4', 'A4', 'F#5')), (8, ('D4', 'A4', 'F5')), (9, ('C#4', 'A4', 'E5'))):
        for h in notes:
            s.note(violons, h, s.m(m), 4, vel=66)
        s.note(altos, 'A3', s.m(m), 4, vel=60)
        s.note(choeur, hauteur(notes[1]) - 12, s.m(m), 4, vel=64)
    for m, notes in ((7, ('F#4', 'A4', 'D5')), (8, ('F4', 'A4', 'D5')), (9, ('C#4', 'E4', 'A4'))):
        for i, h in enumerate(notes):
            s.note(piano, h, s.m(m), 4, vel=58 if i < 2 else 64)
    s.expression(choeur, [(s.m(7), 'mp'), (s.m(9, 4), 'pp')])
    s.expression(piano, [(s.m(7), 'mp'), (s.m(9, 4), 'p'), (s.m(10, 3), 'mp')])
    # m. 10 : sol, ouvert, et la relance : les cordes enflent jusqu'au raccord, où le piano
    # reprend seul le motif (elles s'éteignent sur leur relâche) ; « la mi » au piano
    for h in ('D4', 'G4', 'B4'):
        s.note(piano, h, s.m(10), 4, vel=54)
    for p, notes in ((violons, ('B4', 'D5')), (altos, ('B3', 'D4'))):
        for h in notes:
            s.note(p, h, s.m(10), 4, vel=62)
    for p in (violons, altos, celles, basses):
        s.expression(p, [(s.m(7), 'mp'), (s.m(9, 4), 'pp'), (s.m(10, 2), 'pp'), (s.longueur, 'mf')])
    s.joue(piano, ANACROUSE, a=s.m(10, 3), vel=84)


theme.forme(intro=['intro'], corps=['A1', 'A2', 'B1', 'B2', 'C', 'D'])
