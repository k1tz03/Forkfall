"""FUSIBLE — « Les Douze Pages » (suspense) : le grand déballage, les décisions du samedi en
direct, la dernière carte d'un livre. Retenir son souffle : une horloge accordée, des cordes en
doubles croches qui accélèrent par paliers, une montée qui ne finit pas.

Si♭ mineur, sur une pédale de dominante (fa). Trois paliers : 100, 110, 120 à la noire (et 120
à 5/4, groupé 3+3+2+2, au plus tendu). L'orchestre : cordes en doubles croches brèves, cors et
trompettes bouchés puis ouverts, cuivres graves, timbales, caisse claire, taïkos ; le xylophone
pour l'horloge, le piano pour le souffle ; la sous-basse en grain.

LE MOTIF : la TÊTE en notes répétées, de plus en plus serrée (si♭ fa | SOL♭ : 1 5 ♭6) — au
palier 100 en noires répétées (la tête en valeurs doubles), à 110 en croches, à 120 en doubles
croches (la tête en diminution) ; chaque note de la phrase découpée en attaques égales. Le
tic-tac de l'horloge joue la seconde de la mèche, fa – sol♭ (5 – ♭6) : l'horloge est la mèche
qui brûle. Une fois par boucle, au creux, le piano chante le motif entier en valeurs doublées.

L'harmonie : pédale de fa ; i – ♭II (si♭ m – do♭ sur fa : le triton à la basse) ; i – ♭vi
mineur (si♭ m – sol♭ m : la menace) ; LA GAMME SANS FIN : trois pupitres à l'octave (violoncelles,
altos, violons) montent ensemble par demi-tons ; le plus grave enfle, le plus aigu s'efface,
et à chaque octave tous redescendent d'un cran, sans qu'on l'entende.

LA CARTE (le corps : 72 mesures, 162 s)
  intro   2 m.  100        l'ARC à découvert ; l'horloge démarre ; la pédale de fa      2
  P1     16 m.  100  0:00  « première page » : le braam au premier temps (la montée de P7
                           y tombe), puis l'horloge en noires, violoncelles en doubles
                           croches p, pédale ; m. 5 la tête en noires répétées (cors
                           bouchés) ; m. 9 les altos, i – ♭II ; m. 13 la tête aux cors et
                           aux trombones ; m. 15–16 la montée → impact                3 → 4,5
  P2      8 m.  110  0:38  « la deuxième » : l'impact ; l'horloge en croches ; les violons ;
                           la tête en croches répétées (trompettes bouchées) ; timbales ;
                           montée → deux temps de silence                                5
  P3      8 m.  120  0:56  « la troisième » : le braam ; la caisse claire ; la tête en
                           doubles croches (cors, trombones) toutes les deux mesures ; i – ♭II
                           à chaque mesure                                              6,5
  P4      8 m. 120 5/4 1:12 « la gamme sans fin » : 3+3+2+2 dans les accents des cordes
                           (la basse tient la pédale) ; la gamme sans fin ; la tête en doubles
                           croches ; taïkos ; montée → SILENCE (une seconde)              8
  P5      8 m.  100  1:32  « le souffle » : l'horloge seule, la pédale ; le piano chante le
                           motif en valeurs doublées ; trémolo pp ; ça repart               3
  P6     16 m.  110  1:51  « l'avant-dernière » : les doubles croches, i – ♭vi ; la tête en
                           croches puis en doubles croches ; m. 8 un temps de silence : l'ARC ;
                           m. 15–16 la montée → impact                                5 → 6,5
  P7      8 m.  120  2:26  « la dernière » : tout ; la tête en doubles croches en strette ;
                           la gamme sans fin ; la montée → l'impact du premier temps de P1 :
                           la boucle repart d'un palier bas, sans couture                  8
"""
from moteur.ecriture import *
from partitions._fusible import phrase, Arc

theme = Theme('suspense', 'Les Douze Pages', bpm=100, mesure='4/4', tonalite='si bémol mineur',
              graine=1212, ville=False,
              moment='le grand déballage, les décisions du samedi en direct, la dernière carte d\'un livre',
              humeur='retenir son souffle : une horloge, une montée qui ne finit pas')

TON = 'si bémol mineur'

# --- l'arc --------------------------------------------------------------------------------
arc = Arc(theme)
# --- les cordes : les doubles croches (brèves), la pédale, la gamme sans fin -----------------
celles = theme.piste('celles', 'violoncelles', art='staccato', bref=0.15, pan=0.3, volume=5)
altos = theme.piste('altos', art='staccato', bref=0.15, pan=0.15, volume=5)
violons = theme.piste('violons', art='staccato', bref=0.15, pan=-0.45, volume=6)
basses = theme.piste('basses', 'contrebasses', art='sans_vibrato', volume=4)
trem = theme.piste('trem', 'violons', art='tremolo', pan=-0.25, volume=4)
g_bas = theme.piste('g_bas', 'violoncelles', art='tenu', legato=True, pan=0.35, volume=4)
g_mil = theme.piste('g_mil', 'altos', art='tenu', legato=True, pan=0.1, volume=4)
g_haut = theme.piste('g_haut', 'violons', art='tenu', legato=True, pan=-0.35, volume=4)
# --- les cuivres ----------------------------------------------------------------------------
cors = theme.piste('cors', art='sourdine', volume=5.5)
trompettes = theme.piste('trompettes', art='sourdine', volume=6)
trombones = theme.piste('trombones', art='tenu', volume=2.5)
tuba = theme.piste('tuba', art='tenu', volume=2)
braam = theme.piste('braam', volume=-1.5)
# --- l'horloge, le piano ----------------------------------------------------------------------
xylo = theme.piste('xylo', 'xylophone', pan=-0.2, salle=0.2, volume=8)
piano = theme.piste('piano', art='pedale', salle=0.35, volume=10)
# --- les percussions --------------------------------------------------------------------------
timbales = theme.piste('timbales', volume=5)
timb_roul = theme.piste('timb_roul', 'timbales', art='roulement', volume=2)
caisse = theme.piste('caisse', 'caisse_claire', volume=2.5)
caisse_roul = theme.piste('caisse_roul', 'caisse_claire', art='roulement', volume=7)
taiko = theme.piste('taiko', volume=3, eq={'passe_haut': 40})
suspendue = theme.piste('suspendue', 'cymbale_suspendue', volume=4)
effets = theme.piste('effets', volume=2)
# --- le grain ---------------------------------------------------------------------------------
sub = theme.piste('sub', 'sub_synthe', volume=-14)


def nuances(s, **niveaux):
    for nom_piste, v in niveaux.items():
        s.nuance(theme.pistes[nom_piste], v, 0)


# =====================================================================================
# Le matériau

TETE = phrase('tete', TON, octave=3)                    # si♭3 fa4 | sol♭4 ──
MOTIF = phrase('motif', TON, octave=4)                  # si♭4 fa5 | sol♭5 ── ré♭5 do5 | mi♭5 si♭4 ──


def repetee(motif, pas):
    """La phrase en notes répétées : chaque note découpée en attaques égales de `pas` temps
    (la tête qui insiste ; plus le pas est court, plus elle se serre)."""
    notes = []
    for n in motif.notes:
        k = max(1, int(round(n.d / pas)))
        for i in range(k):
            notes.append(n.copie(t=n.t + i * pas, d=pas * 0.85))
    return Motif(notes, motif.longueur)


TETE_NOIRES = repetee(TETE.augmente(2), 1.0)            # 100 : si♭ fa sol♭ sol♭ sol♭…  (8 temps)
TETE_CROCHES = repetee(TETE, 0.5)                       # 110 : en croches            (4 temps)
TETE_DOUBLES = repetee(TETE.diminue(2), 0.25)           # 120 : en doubles croches     (2 temps)

# les accords au-dessus de la pédale de fa (trois sons)
ACC = {'i': ['Bb3', 'Db4', 'F4'], 'II': ['Cb4', 'Eb4', 'Gb4'], 'vi': ['Bbb3', 'Db4', 'Gb4'],
       'VI': ['Bb3', 'Db4', 'Gb4'], 'VII5': ['Ab3', 'Eb4', 'Ab4']}
# (♭VII à vide sous « ré♭ do » : la quarte suspendue et sa résolution sonnent justes toutes deux)
ACC_TROMB = {'i': ['Bb2', 'Db3', 'F3'], 'II': ['Cb3', 'Eb3', 'Gb3'], 'vi': ['Gb2', 'Bbb2', 'Db3']}

# les figures des doubles croches sur la pédale (décalages en demi-tons sur fa, accents) :
# 3+3+2, la hauteur bouge sur les accents (l'octave, la quinte) ; deux mesures de suite
# ne sont jamais pareilles
FIG4 = {
    'a': ([0, 0, 0, 12, 0, 0, 7, 0, 0, 0, 0, 12, 0, 0, 7, 12], 'X x o X x o X x X x o X x o X o'),
    'b': ([0, 0, 0, 7, 0, 0, 12, 0, 0, 0, 0, 7, 0, 0, 12, 7], 'X o x X o x X x X o x X x o X x'),
    'c': ([0, 0, 12, 0, 0, 7, 0, 12, 0, 0, 12, 0, 0, 7, 0, 1], 'X o x X o x X x X o x X o x X x'),
    'd': ([0, 1, 0, 12, 0, 1, 7, 0, 0, 1, 0, 12, 0, 1, 7, 12], 'X o x X o x X x X o x X o x X o'),
}
# à 5/4 : vingt doubles croches, accents 3+3+2+2 (en croches : 6+6+4+4 doubles croches)
FIG5 = {
    'p': ([0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 7, 0, 0, 0, 12, 0, 0, 0],
          'X x o x o x X x o x o x X x o x X x o x'),
    'q': ([0, 0, 1, 0, 0, 0, 12, 0, 1, 0, 0, 0, 7, 0, 1, 0, 12, 0, 7, 0],
          'X o x o x o X o x o x o X o x o X o x o'),
}


def doubles(s, piste, de, a, figs, grave='F2', vel=80, jusqua=None):
    """Les doubles croches sur la pédale, de la mesure `de` à `a` comprise, figures en
    rotation (FIG4 ou FIG5 selon la mesure de la section) ; rien à partir de `jusqua` (un
    silence écrit)."""
    table = FIG5 if s.tpm == 5 else FIG4
    base = hauteur(grave)
    for m in range(de, a + 1):
        decal, acc = table[figs[(m - de) % len(figs)]]
        acc = acc.split()
        for i in range(len(decal)):
            t = s.m(m) + i * 0.25
            if jusqua is not None and t >= jusqua - 1e-9:
                break
            v = {'X': vel + 20, 'x': vel, 'o': vel - 22}[acc[i]]
            s.note(piste, base + decal[i], t, 0.25, vel=v)


def horloge(s, de, a, pas, vel=84, accents=None):
    """Le tic-tac accordé (fa – sol♭, la seconde de la mèche) au xylophone, de `de` à `a`
    (en temps), un coup tous les `pas` temps ; `accents` : des vélocités en plus, en boucle."""
    t, k = de, 0
    while t < a - 1e-9:
        v = vel + (accents[k % len(accents)] if accents else 0)
        s.note(xylo, 'F5' if k % 2 == 0 else 'Gb5', t, min(pas, 0.5) * 0.6, vel=v)
        t += pas
        k += 1


def accords(s, piste, mesures, voix_acc, vel=72, de=1, jusqua=None, art=None):
    """Les accords tenus, une mesure chacun (une note gardée n'est pas rejouée)."""
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


def accords_temps(s, piste, temps, voix_acc, vel=72, art=None):
    """Les accords tenus, temps par temps (`temps` : un chiffre par temps depuis le début de la
    section) ; une voix qui garde sa note la tient."""
    nv = len(next(iter(voix_acc.values())))
    for i in range(nv):
        cour = None
        for b, ch in enumerate(temps):
            h = voix_acc[ch][i]
            if cour and cour[0] == h:
                cour[2] = b + 1
            else:
                if cour:
                    s.note(piste, cour[0], cour[1], cour[2] - cour[1], vel=vel, art=art)
                cour = [h, b, b + 1]
        if cour:
            s.note(piste, cour[0], cour[1], cour[2] - cour[1], vel=vel, art=art)


def gamme_sans_fin(s, de, a, pas=1.0, depart=0, vel=86, fort=0.72, doux=0.06):
    """La gamme sans fin, de `de` à `a` (en temps) : trois pupitres à l'octave (violoncelles
    si♭2–la3, altos si♭3–la4, violons si♭4–la5) montent d'un demi-ton tous les `pas` temps ;
    à chaque octave, chacun redescend d'un cran. Sur son octave, le pupitre grave enfle de
    `doux` à `fort`, celui du milieu tient `fort`, l'aigu s'efface de `fort` à `doux` : la voix
    qui monte passe d'un pupitre à l'autre sans changer de force, la plus aiguë disparaît
    pendant qu'une grave apparaît (le saut d'octave se fait là où la voix ne s'entend plus)."""
    pistes = ((g_bas, 'Bb2'), (g_mil, 'Bb3'), (g_haut, 'Bb4'))

    def force(k, x):            # x de 0 (le bas de l'octave) à 1 (l'octave suivante)
        return (doux + (fort - doux) * x, fort, fort - (fort - doux) * x)[k]

    courbes = {p: [] for p, _ in pistes}
    t, j = de, depart
    while t < a - 1e-9:
        pos = j % 12
        d = min(pas, a - t)
        for k, (p, base) in enumerate(pistes):
            s.note(p, hauteur(base) + pos, t, d + 0.02, vel=vel)
            courbes[p].append((t, force(k, pos / 12.0)))
            courbes[p].append((t + d - 0.01, force(k, (pos + 1) / 12.0)))
        t += pas
        j += 1
    for p, pts in courbes.items():
        s.expression(p, pts)


def montee(s, de, a, vers='impact', vel=100):
    """La montée (de `de` à `a`, en temps) : le bruit qui monte, le roulement de caisse claire et
    celui des timbales qui enflent, la cymbale suspendue ; elle finit sur un impact (posé par la
    section suivante) ou sur un silence."""
    s.note(effets, 'F3', de, a - de, vel=vel, art='montee')
    s.note(caisse_roul, 'S', de, a - de, vel=84)
    s.expression(caisse_roul, [(de, 'pp'), (a, 'ff')])
    s.note(timb_roul, 'F2', de, a - de, vel=90)
    s.expression(timb_roul, [(de, 'p'), (a, 'ff')])
    secondes = 2.0 if vers == 'silence' else 4.0
    bpm = s.section.bpm or theme.bpm
    temps = secondes * bpm / 60.0
    s.note(suspendue, 'C4', a - temps, temps, vel=96, art='monte_2s' if secondes == 2.0 else 'monte_4s')


def impact(s, a=0.0, braam_aussi=False):
    """L'impact d'un premier temps : le coup grave, la timbale, et parfois le braam sur fa."""
    s.note(effets, 'F1', a, 2, vel=112, art='impact')
    s.note(timbales, 'F2', a, 1, vel=112)
    if braam_aussi:
        s.note(braam, 'F2', a, 3, vel=116)


# =====================================================================================
# Les sections

@theme.section('intro', mesures=2)
def intro(s):
    nuances(s, xylo='mp', basses='pp', sub='mf')
    arc.poser(s, 0, impact=True)
    # l'horloge démarre (au 2ᵉ temps), la pédale de fa entre dessous
    horloge(s, 1, s.longueur, 1.0, vel=78)
    s.note(basses, 'F2', 1.5, 6.5, vel=62)
    s.crescendo(basses, 1.5, 8, 'pp', 'p')
    s.note(sub, 'F2', 2, 6, vel=56)


GRILLE_P1 = 'i i II i i i II i i i II i i II i II'.split()


@theme.section('P1', mesures=16)
def P1(s):
    nuances(s, xylo='mf', basses='mp', celles='p', altos='pp', cors='mf', trombones='mf', sub='mf',
            timbales='mf', trem='pp')
    impact(s, braam_aussi=True)     # la montée de P7 tombe ici : la boucle repart sur un coup
    horloge(s, 0, s.longueur, 1.0, vel=82)
    s.note(basses, 'F2', 0, s.longueur, vel=66)
    s.note(sub, 'F2', 0, s.longueur, vel=58)
    doubles(s, celles, 1, 16, 'abcb', grave='F2', vel=76)
    s.expression(celles, [(0, 'p'), (s.m(9), 'mp'), (s.m(16, 4), 'mf')])
    # m. 9 : les altos à l'octave, et l'harmonie au-dessus de la pédale (i – ♭II)
    doubles(s, altos, 9, 16, 'bcab', grave='F3', vel=72)
    s.expression(altos, [(s.m(9), 'pp'), (s.m(16, 4), 'mp')])
    accords(s, trem, GRILLE_P1, ACC, vel=70, de=9)
    s.expression(trem, [(s.m(9), 'pp'), (s.m(16, 4), 'p')])
    # la tête en noires répétées : les cors bouchés (m. 5), puis cors et trombones (m. 13)
    s.joue(cors, TETE_NOIRES, a=s.m(5), vel=92)
    s.joue(cors, TETE_NOIRES, a=s.m(13), vel=100)
    s.joue(trombones, TETE_NOIRES.octave(-1), a=s.m(13), vel=92, art='tenu')
    # les timbales marquent les têtes de mesure, de loin en loin
    for m in (5, 9, 13):
        s.note(timbales, 'F2', s.m(m), 1, vel=84)
    montee(s, s.m(15), s.m(17), vers='impact')


GRILLE_P2 = 'II II i i II II i i'.split()


@theme.section('P2', mesures=8, bpm=110)
def P2(s):
    nuances(s, xylo='mf', basses='mf', celles='mp', altos='mp', violons='p', trompettes='mf', trombones='mp',
            sub='mf', trem='p')
    silence = s.m(8, 3)            # deux temps de silence (1,1 s) avant l'impact de P3
    impact(s)
    horloge(s, 0, silence, 0.5, vel=82, accents=[8, 0, 2, 0])
    s.note(basses, 'F2', 0, silence, vel=72)
    s.note(sub, 'F2', 0, silence, vel=60)
    doubles(s, celles, 1, 8, 'cdab', grave='F2', vel=80, jusqua=silence)
    doubles(s, altos, 1, 8, 'dabc', grave='F3', vel=76, jusqua=silence)
    doubles(s, violons, 3, 8, 'abcd', grave='F4', vel=72, jusqua=silence)
    accords(s, trem, GRILLE_P2, ACC, vel=74, jusqua=silence)
    accords(s, trombones, GRILLE_P2, ACC_TROMB, vel=80, jusqua=silence)
    # la tête en croches répétées, aux trompettes bouchées (m. 3, m. 7)
    s.joue(trompettes, TETE_CROCHES.octave(1), a=s.m(3), vel=96)
    s.joue(trompettes, TETE_CROCHES.octave(1), a=s.m(7), vel=102)
    s.joue(cors, TETE_CROCHES, a=s.m(7), vel=94)
    for m in (1, 3, 5, 7):
        s.note(timbales, 'F2', s.m(m), 1, vel=92)
    montee(s, s.m(7), silence, vers='silence')


GRILLE_P3 = 'i II i II i II i II'.split()


@theme.section('P3', mesures=8, bpm=120)
def P3(s):
    nuances(s, xylo='mf', basses='mf', celles='mp', altos='mp', violons='mp', cors='f', trombones='mf',
            tuba='mf', caisse='mp', trem='mp', sub='f')
    impact(s, braam_aussi=True)
    horloge(s, 0, s.longueur, 0.5, vel=86, accents=[8, 0, 2, 0])
    s.note(basses, 'F2', 0, s.longueur, vel=78)
    s.note(tuba, 'F2', 0, s.longueur, vel=78)
    s.note(sub, 'F2', 0, s.longueur, vel=64)
    doubles(s, celles, 1, 8, 'abdc', grave='F2', vel=84)
    doubles(s, altos, 1, 8, 'bdca', grave='F3', vel=80)
    doubles(s, violons, 1, 8, 'dcab', grave='F4', vel=76)
    accords(s, trem, GRILLE_P3, ACC, vel=78)
    accords(s, trombones, GRILLE_P3, ACC_TROMB, vel=84)
    s.batterie(caisse, 'S : x . o o x . o . x . o o x o x o', vel=84)
    # la tête en doubles croches, toutes les deux mesures (cors, et les trombones l'octave dessous)
    for m in (1, 3, 5, 7):
        s.joue(cors, TETE_DOUBLES, a=s.m(m), vel=104, art='staccato')
    for m in (3, 7):
        s.joue(trombones, TETE_DOUBLES.octave(-1), a=s.m(m, 3), vel=98, art='staccato')
    for m in range(1, 9):
        s.note(timbales, 'F2', s.m(m), 1, vel=96 if m % 2 else 88)


@theme.section('P4', mesures=8, bpm=120, mesure='5/4')
def P4(s):
    nuances(s, xylo='mf', basses='mf', celles='ff', altos='f', violons='mf', cors='ff', trombones='ff',
            tuba='f', taiko='ff', sub='f', timbales='f')
    silence = s.m(8, 4)            # les deux derniers groupes (« 2 + 2 ») se taisent : une seconde
    # le premier temps : taïko et timbale
    s.note(timbales, 'F2', 0, 1, vel=110)
    # l'horloge en croches, accentuée 3+3+2+2
    horloge(s, 0, silence, 0.5, vel=84, accents=[12, 0, 0, 12, 0, 0, 12, 0, 12, 0])
    s.note(basses, 'F2', 0, silence, vel=82)
    s.note(tuba, 'F2', 0, silence, vel=82)
    s.note(sub, 'F2', 0, silence, vel=66)
    # les doubles croches : 3+3+2+2 dans les accents ; la basse ne chante pas ce rythme, elle tient
    doubles(s, celles, 1, 8, 'pq', grave='F2', vel=86, jusqua=silence)
    doubles(s, altos, 1, 8, 'qp', grave='F3', vel=82, jusqua=silence)
    s.joue(taiko, grille('X . . . . . x . . . . . X . . . X . . .', 'F2'), a=0)
    for m in range(2, 8):
        s.joue(taiko, grille('X . . . . . x . . . . . X . . . X . x .', ['F2', 'C3']), a=s.m(m))
    # la gamme sans fin (une demi-mesure de 5/4 par demi-ton : la voix monte d'une octave en
    # six mesures) ; elle s'arrête avec tout le monde
    gamme_sans_fin(s, 0, silence, pas=2.5, vel=88)
    # la tête en doubles croches au début de chaque groupe de deux mesures : les cors, puis
    # les trombones à l'octave grave (sur le 4ᵉ temps)
    for m in (1, 3, 5, 7):
        s.joue(cors, TETE_DOUBLES, a=s.m(m), vel=108, art='staccato')
        s.joue(trombones, TETE_DOUBLES.octave(-1), a=s.m(m, 4), vel=100, art='staccato')
    montee(s, s.m(7), silence, vers='silence')


# le creux, temps par temps : | i | ♭VI | ♭VI ── ♭VII ── | i | i | i | ♭II | i | (la cellule du motif
# sous le piano : « ré♭ do » en quarte suspendue qui se résout sur la tierce de la♭)
TEMPS_P5 = ['i'] * 4 + ['VI'] * 4 + ['VI', 'VI', 'VII5', 'VII5'] + ['i'] * 12 + ['II'] * 4 + ['i'] * 4


@theme.section('P5', mesures=8)
def P5(s):
    nuances(s, xylo='mf', basses='mp', piano='f', trem='p', sub='mp', timbales='mp', celles='pp')
    s.note(timbales, 'F2', 0, 1, vel=80)
    horloge(s, 0, s.longueur, 1.0, vel=76)
    s.note(basses, 'F2', 0, s.longueur, vel=60)
    s.note(sub, 'F2', 0, s.longueur, vel=54)
    accords_temps(s, trem, TEMPS_P5, ACC, vel=66)
    # le piano chante le motif entier en valeurs doublées (une fois par boucle), sur la pédale
    lent = MOTIF.augmente(2)
    s.joue(piano, lent, a=s.m(1, 3), vel=80)
    s.joue(piano, lent.octave(-1), a=s.m(1, 3), vel=56)
    # la relance : les doubles croches reviennent pianissimo
    doubles(s, celles, 7, 8, 'ab', grave='F2', vel=70)
    s.crescendo(celles, s.m(7), s.m(9), 'pp', 'mp')


GRILLE_P6 = 'i i vi vi i i vi vi i II i II i II i II'.split()


@theme.section('P6', mesures=16, bpm=110)
def P6(s):
    nuances(s, xylo='mf', basses='mf', celles='mp', altos='mp', violons='p', trompettes='mf', cors='mf',
            trombones='mp', sub='mf', trem='p', timbales='mf')
    trou = s.m(8, 4)                 # un temps de silence : l'arc
    impact(s)
    horloge(s, 0, trou, 0.5, vel=82, accents=[8, 0, 2, 0])
    horloge(s, s.m(9), s.longueur, 0.5, vel=86, accents=[8, 0, 2, 0])
    for de, a in ((0, trou), (s.m(9), s.longueur)):
        s.note(basses, 'F2', de, a - de, vel=72)
        s.note(sub, 'F2', de, a - de, vel=60)
    doubles(s, celles, 1, 7, 'dcba', grave='F2', vel=80)
    doubles(s, celles, 9, 16, 'abdc', grave='F2', vel=84)
    doubles(s, altos, 5, 7, 'cab', grave='F3', vel=76)
    doubles(s, altos, 9, 16, 'bcda', grave='F3', vel=80)
    doubles(s, violons, 11, 16, 'cdab', grave='F4', vel=76)
    # (la mesure 8 s'arrête au 4ᵉ temps : les doubles croches de la m. 8, sur trois temps)
    s.joue(celles, Motif([Note(hauteur('F2') + o, i * 0.25, 0.25, 84 if i % 3 == 0 else 70)
                          for i, o in enumerate([0, 0, 0, 12, 0, 0, 7, 0, 0, 0, 0, 12])], 3.0), a=s.m(8))
    accords(s, trem, GRILLE_P6, ACC, vel=74, jusqua=trou)
    accords(s, trem, GRILLE_P6, ACC, vel=78, de=9)
    accords(s, trombones, GRILLE_P6, ACC_TROMB, vel=80, de=9)
    s.expression(celles, [(0, 'mp'), (s.m(8), 'mf'), (s.m(9), 'mf'), (s.m(16, 4), 'f')])
    s.expression(trem, [(0, 'p'), (s.m(16, 4), 'mf')])
    # la tête : en croches (m. 3, 7 : trompettes bouchées), puis en doubles croches (m. 11–15 :
    # cors, puis cors et trombones)
    s.joue(trompettes, TETE_CROCHES.octave(1), a=s.m(1), vel=98)
    s.joue(trompettes, TETE_CROCHES.octave(1), a=s.m(5), vel=102)
    for m in (9, 11, 13, 15):
        s.joue(cors, TETE_DOUBLES, a=s.m(m), vel=106, art='staccato')
    for m in (11, 13, 15):
        s.joue(trombones, TETE_DOUBLES.octave(-1), a=s.m(m, 3), vel=98, art='staccato')
    # le temps de silence de la mesure 8 : l'arc, à découvert ; la reprise sur un coup
    arc.poser(s, trou + 0.1, impact=False)
    s.note(timbales, 'F2', s.m(9), 1, vel=104)
    for m in (1, 5, 11, 13, 15):
        s.note(timbales, 'F2', s.m(m), 1, vel=90)
    montee(s, s.m(15), s.m(17), vers='impact')


GRILLE_P7 = 'i i i i i i i i'.split()


@theme.section('P7', mesures=8, bpm=120)
def P7(s):
    nuances(s, xylo='mf', basses='mf', celles='f', altos='f', violons='mf', cors='f', trompettes='mf',
            trombones='mf', tuba='f', caisse='mf', trem='mf', sub='f', timbales='f', taiko='f')
    impact(s, braam_aussi=True)
    horloge(s, 0, s.longueur, 0.5, vel=90, accents=[10, 0, 4, 0])
    s.note(basses, 'F2', 0, s.longueur, vel=84)
    s.note(tuba, 'F2', 0, s.longueur, vel=84)
    s.note(sub, 'F2', 0, s.longueur, vel=66)
    doubles(s, celles, 1, 8, 'dabc', grave='F2', vel=88)
    doubles(s, altos, 1, 8, 'cdab', grave='F3', vel=84)
    doubles(s, violons, 1, 8, 'bcda', grave='F4', vel=80)
    accords(s, trombones, GRILLE_P7, ACC_TROMB, vel=88)
    s.batterie(caisse, 'S : x . x o x . x o x . x o x x x o', vel=88)
    for m in range(1, 9):
        s.joue(taiko, grille('X . . x . . X . X . . x . . X x', ['F2', 'C3']), a=s.m(m))
    # la tête en doubles croches, en strette : chaque mesure, cors puis trompettes puis trombones
    for m in range(1, 9):
        s.joue(cors, TETE_DOUBLES, a=s.m(m), vel=110, art='staccato')
        s.joue(trompettes, TETE_DOUBLES.octave(1), a=s.m(m, 2), vel=100, art='staccato')
        s.joue(trombones, TETE_DOUBLES.octave(-1), a=s.m(m, 3), vel=104, art='staccato')
    # la gamme sans fin, plus vite (un demi-ton par temps)
    gamme_sans_fin(s, s.m(3), s.longueur, pas=1.0, depart=3, vel=90)
    # la montée qui finit sur l'impact du premier temps de P1 (la boucle repart d'en bas)
    montee(s, s.m(7), s.m(9), vers='impact')


theme.forme(intro=['intro'], corps=['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'])
