"""FUSIBLE — la musique du film « La troisième nuit » (livre 7, « Chambre 12 »), écrite sous ses
images (packages/tools/web/cinema/films/la_troisieme_nuit.js, 35,5 s).

Novembre 2011, la troisième nuit, après le coup de téléphone de 2 h 30 : le film reste dehors et en
bas — le coin du terrain annexe dans la brume, la 12 seule allumée, l'ombre assise derrière le
rideau, la réception vide où le standard sonne dans le vide, trois coups, la 12 qui s'éteint ; puis
3 h 50 : les fenêtres du hall qui s'allument une à une, « comme pour un mariage », et le coin du
terrain, vide. La musique est un chapitre de « Chambre 12 » (livre_h7) : mi bémol mineur, i–♭vi (la
menace : les voix qui glissent d'un demi-ton, solb qui reste), les cordes graves tenues, le piano
dans une pièce sèche, la tête et la mèche (mib sib | DOB), les trois coups (caisse claire sans
timbre et tom accordé), l'arc (l'ampoule qui meurt), la cymbale frottée, et la valse de l'hôtel.

LE TEMPS : sept temps par plan de 5,7 s (73,7 à la noire : une mesure de quatre et une de trois, la
valse qui revient) ; les trois coups ont leur mesure de trois croches (0,43 s), et la 12 s'éteint
sur le temps qui suit, celui d'un quatrième coup qui ne vient pas ; le noir qui suit, onze croches ;
au hall, la valse suit les fenêtres (rubato) : une fenêtre, un temps ; le titre ralentit (70,6).
Chaque coupe est un premier temps.

LA FEUILLE DE SYNCHRO (temps du film → section, temps ; la musique)
   0,00  le noir, le coin du terrain         n1 t.0     la contrebasse sur mib, de rien
   0,80  le carton                           n1 t.1     les violoncelles : mib, puis la quinte
   3,26 · 3,66  on lève les yeux              n1 t.4 · 4,5  le piano (la pièce sèche) : « mib sib »…
   4,07  la fenêtre allumée, l'ombre          n1 t.5     … « DOB » : la mèche, sur ♭vi (sur la pédale)
   5,70  coupe : la 12, de loin               n2 t.0     i ; les murs respirent (i–♭vi) ; un souffle
                                                          de violons, très haut
  11,40  coupe : la réception vide            n3 t.0     le tic-tac du hall (pizzicati) ; les voix
                                                          tenues ; rien dans la bande du standard
  11,80 · 14,60  le standard sonne dans le vide            (son bruit : 860-940 Hz et 2,5 kHz)
  14,66 · 15,47  —                            n3 t.4 · 5  ♭vi, puis V (la porte)…
  16,29  —                                    n3 t.6     … tout s'arrête : un temps de silence
  17,10  coupe : la 12, plus près ; 1er coup  n4a t.0    les trois coups, seuls
  17,53 · 17,97  2e, 3e coups                 n4a t.½ · 1
  18,40  la 12 s'éteint                       n4b t.0    l'arc : l'ampoule meurt ; la cymbale
                                                          frottée ; la pédale, presque muette
  22,90  coupe : 3 h 50, le parking           n5 t.0     i, très doux
  23,30 … 26,80  les sept fenêtres du hall               la valse de l'hôtel au piano, une fenêtre par
                 (23,30 · 23,85 · 24,35 · 24,95 · 25,55 · 26,20 · 26,80)   temps : « mib sib | DOB ──
                                                          solb fa | lab mib », puis l'anacrouse
  27,40  —                                               « DOB » : la mèche, tenue par-dessus la coupe
  28,60  coupe : l'hôtel depuis le terrain    n6a t.0    i ; le cor au loin : « mib sib »…
  30,40  le titre « Aubérive · 2011 »         n6b t.0    … « DOB » : la mèche au cor lointain, sur i
  34,00  le noir commence (1,5 s)             n6b t.4    decrescendo
  35,50  la fin du film                                  la traîne (le corps : i et la mèche, tenus)

L'introduction (le film entier) : 35,5 s, sonie réglée sur elle (`sonie_sur='intro'`). Le corps :
`traine`, trois mesures à trois temps (7,65 s), que le jeu boucle si le film dure plus.
"""
from moteur.ecriture import *
from partitions._fusible import Arc

theme = Theme('film_la_troisieme_nuit', 'La troisième nuit', bpm=76, mesure='4/4', tonalite='mi bémol mineur',
              graine=1411, ville=False, boucle_min=0, moment='le film « La troisième nuit », livre 7',
              humeur="la troisième nuit : trois coups, la 12 qui s'éteint, le hall qui s'allume comme pour "
                     "un mariage")
theme.master(sonie_sur='intro')

# --- l'arc (le son de FUSIBLE) : l'ampoule de la 12, qui meurt ---------------------------------------
arc = Arc(theme, volume=-6, impact_volume=-12)

# --- les trois coups (dans la pièce sèche) ---------------------------------------------------------
_COULOIR = {'profondeur': 0.25, 'salle': 0.04, 'piece': 0.45}
porte = theme.piste('porte', 'caisse_claire', art='timbre_off', pan=-0.2, eq={'passe_bas': 3000}, volume=1,
                    **_COULOIR)
porte_bois = theme.piste('porte_bois', 'toms', pan=-0.2, eq={'passe_bas': 2200}, volume=-5, **_COULOIR)

# --- le piano de l'hôtel, dans une pièce sèche -----------------------------------------------------
piano = theme.piste('piano', art='tenu', profondeur=0.15, salle=0.06, piece=0.35, volume=9)        # la main droite
piano_mg = theme.piste('piano_mg', 'piano', art='tenu', profondeur=0.15, salle=0.06, piece=0.35, volume=4)

# --- les cordes graves tenues (les murs), un souffle de violons ---------------------------------------
violons2 = theme.piste('violons2', 'violons', pan=-0.22, volume=0)
altos = theme.piste('altos', volume=2)
celles_tenu = theme.piste('celles_tenu', 'violoncelles', art='tenu', pan=0.3, volume=5)
basses = theme.piste('basses', 'contrebasses', art='sans_vibrato', volume=2)
sub = theme.piste('sub', 'sub_synthe', volume=-21)

# --- le couloir : le cor lointain, la cymbale frottée -------------------------------------------------
cor_loin = theme.piste('cor_loin', 'cors', unisson=1, pan=-0.4, profondeur=0.9, salle=0.55, volume=4)
archet = theme.piste('archet', 'cymbale_suspendue', art='archet', profondeur=0.85, salle=0.4, volume=-4)

theme.bus('cordes', eq={'passe_haut': 32, 'cloches': [(2500, 1.0, 0.7)], 'air': 4.0})
theme.bus('cuivres', eq={'passe_haut': 38, 'boue': -1.0, 'air': 3.0})

# =====================================================================================
# Le temps : une section par plan (début et fin dans le film, tempo, mesure : une mesure par section)
B7 = 7 * 60 / 5.7          # 73,68 : sept temps par plan de 5,7 s
PLANS = {
    'n1_coin': (0.0, 5.7, B7, (7, 4)),
    'n2_douze': (5.7, 11.4, B7, (7, 4)),
    'n3_reception': (11.4, 17.1, B7, (7, 4)),
    'n4a_coups': (17.1, 18.4, 1.5 * 60 / 1.3, (3, 8)),       # trois croches de 0,433 s
    'n4b_noir': (18.4, 22.9, 5.5 * 60 / 4.5, (11, 8)),       # onze croches de 0,409 s
    'n5_hall': (22.9, 28.6, B7, (7, 4)),
    'n6a_hotel': (28.6, 30.4, 2 * 60 / 1.8, (2, 4)),
    'n6b_titre': (30.4, 35.5, 6 * 60 / 5.1, (6, 4)),
}
ORDRE = list(PLANS)
T7 = 5.7 / 7               # le temps des plans de sept temps (0,814 s)


def plan(nom):
    _d, _f, bpm, mes = PLANS[nom]
    return theme.section(nom, mesures=1, bpm=bpm, mesure=mes, reprise=False)


def b(s, t):
    """Le temps du film `t` (en secondes) → la position, en temps, comptée depuis le début de la
    section en cours (au-delà de sa fin, à travers les sections suivantes et leurs tempos : une note
    tenue par-dessus une coupe finit à l'heure juste)."""
    pos = 0.0
    suite = ORDRE[ORDRE.index(s.section.nom):]
    for nom in suite:
        d, f, bpm, _m = PLANS[nom]
        if t <= f + 1e-9 or nom == suite[-1]:
            return pos + (t - d) * bpm / 60.0
        pos += (f - d) * bpm / 60.0


def tenue(s, piste, h, t0, t1, vel=70, art=None):
    s.note(piste, h, b(s, t0), b(s, t1) - b(s, t0), vel=vel, art=art)


def accord(s, piste, hs, t0, t1, vel=70, art=None):
    for h in hs:
        tenue(s, piste, h, t0, t1, vel=vel, art=art)


def courbe(s, piste, points):
    """La nuance d'une piste au fil du film : [(temps du film, nuance)]."""
    s.expression(piste, [(b(s, t), v) for t, v in points])


# Les accords de la grille (ceux de « Chambre 12 ») : les voix du dessus ne bougent que par demi-tons
I = ('Eb3', 'Gb3', 'Bb3')          # mib mineur
VI = ('D3', 'F#3', 'B3')           # dob mineur (♭vi) : mib→ré, sib→dob, solb reste
VIT = ('D3', 'B3')                 # ♭vi sans fa# (sous le « solb FA » de la valse)
V = ('D3', 'F3', 'Bb3')            # sib majeur : la porte

# la valse : les sept fenêtres du hall (le film : HALL), une par temps, puis deux temps encore
FENETRES = [23.3, 23.85, 24.35, 24.95, 25.55, 26.2, 26.8]
VALSE_T = FENETRES + [27.4, 28.0]


def entre(a, z):
    return (a + z) / 2


# =====================================================================================
# Les plans

@plan('n1_coin')
def n1(s):
    """Le coin du terrain, la brume ; on lève les yeux : une seule fenêtre allumée, l'ombre. Les
    cordes graves sur mib, de rien ; le piano, dans sa pièce sèche, pose la tête : la mèche sur la
    fenêtre."""
    for p, v in ((basses, 'ppp'), (celles_tenu, 'ppp'), (altos, 'pp'), (piano, 'mp'), (sub, 'p')):
        s.nuance(p, v, 0)
    tenue(s, basses, 'Eb2', 0.0, 11.4, vel=66)
    courbe(s, basses, [(0.0, 'ppp'), (3.0, 'pp'), (5.7, 'p'), (10.6, 'pp')])
    tenue(s, sub, 'Eb2', 0.3, 11.4, vel=52)
    # les violoncelles : mib avec le carton, puis la quinte ; l'alto, la tierce (solb : il restera)
    tenue(s, celles_tenu, 'Eb3', 0.8, 4 * T7 + T7, vel=64)
    tenue(s, celles_tenu, 'Bb3', 2 * T7, 5 * T7, vel=62)
    tenue(s, altos, 'Gb3', 3 * T7, 15.47, vel=60)
    courbe(s, celles_tenu, [(0.8, 'ppp'), (3.5, 'pp'), (5.7, 'p')])
    courbe(s, altos, [(2.44, 'ppp'), (4.0, 'pp')])
    # ♭vi sur la pédale de mib : les voix glissent d'un demi-ton (mib→ré, sib→dob)
    accord(s, celles_tenu, ('D3', 'B3'), 5 * T7, 5.7, vel=66)
    # la tête au piano : « mib sib | DOB », la mèche quand la fenêtre est là (le regard y arrive à 4,0)
    for h, t0, t1, v in (('Eb4', 4 * T7, 4.5 * T7, 72), ('Bb4', 4.5 * T7, 5 * T7, 74), ('B4', 5 * T7, 7.3, 82)):
        tenue(s, piano, h, t0, t1, vel=v)


@plan('n2_douze')
def n2(s):
    """La 12, de loin : quelqu'un d'assis, la tête basse, qui ne bouge pas. i, puis ♭vi : les murs
    respirent ; un souffle de violons très haut."""
    accord(s, celles_tenu, ('Eb3', 'Bb3'), 5.7, 5.7 + 4 * T7, vel=64)
    accord(s, celles_tenu, ('D3', 'B3'), 5.7 + 4 * T7, 11.4, vel=66)
    courbe(s, celles_tenu, [(5.7, 'p'), (8.5, 'pp'), (10.6, 'p'), (11.4, 'pp')])
    s.nuance(violons2, 'ppp', 0)
    tenue(s, violons2, 'Bb5', 5.7 + 2 * T7, 11.3, vel=50, art='tenu')
    courbe(s, violons2, [(7.33, 'ppp'), (9.4, 'pp'), (11.1, 'ppp')])


@plan('n3_reception')
def n3(s):
    """La réception, vide : le tic-tac du hall (la contrebasse en pizzicati, la basse et sa quinte) ;
    les voix tenues ; le standard sonne dans le vide (11,8 et 14,6 : la musique lui laisse sa bande) ;
    ♭vi, V (la porte), puis plus rien : un temps de silence avant les coups."""
    s.nuance(basses, 'p', 0)
    for k, (h, v) in enumerate((('Eb2', 80), ('Bb2', 66), ('Eb2', 78), ('Bb2', 64), ('B1', 80), ('Bb1', 82))):
        s.note(basses, h, k, 0.9, vel=v, art='pizzicato')
    accord(s, celles_tenu, ('Eb3', 'Bb3'), 11.4, 11.4 + 4 * T7, vel=62)
    accord(s, celles_tenu, VI[::2], 11.4 + 4 * T7, 11.4 + 5 * T7, vel=66)
    accord(s, celles_tenu, ('D3', 'Bb3'), 11.4 + 5 * T7, 11.4 + 6 * T7, vel=68)
    tenue(s, altos, 'F3', 11.4 + 5 * T7, 11.4 + 6 * T7, vel=64)
    courbe(s, celles_tenu, [(11.4, 'pp'), (14.0, 'p'), (15.5, 'mp'), (16.28, 'p')])
    courbe(s, altos, [(11.4, 'pp'), (14.6, 'p')])


@plan('n4a_coups')
def n4a(s):
    """La 12, plus près : trois coups à la porte, seuls (une croche chacun)."""
    for k in range(3):
        s.note(porte, 'S', 0.5 * k, 0.25, vel=96)
        s.note(porte_bois, 'Eb3', 0.5 * k, 0.25, vel=84)


@plan('n4b_noir')
def n4b(s):
    """La 12 s'éteint, sur le temps d'un quatrième coup : l'arc (l'ampoule meurt), puis la cymbale
    frottée (le sifflement d'après) ; une pédale de mib presque muette ; la vitre noire, le
    reflet du lampadaire (un souffle de violons)."""
    arc.poser(s, 0, impact=False, vel=110)
    tenue(s, archet, 'C4', 18.65, 22.9, vel=70)
    s.nuance(basses, 'pp', 0)
    tenue(s, basses, 'Eb2', 18.4, 22.9, vel=56)
    courbe(s, basses, [(18.4, 'ppp'), (20.5, 'pp'), (22.8, 'ppp')])
    tenue(s, sub, 'Eb2', 18.4, 22.9, vel=46)
    s.nuance(violons2, 'ppp', 0)
    tenue(s, violons2, 'Bb5', 19.6, 22.85, vel=46, art='tenu')
    courbe(s, violons2, [(19.6, 'ppp'), (21.0, 'pp'), (22.7, 'ppp')])


@plan('n5_hall')
def n5(s):
    """3 h 50 : le parking, le bus ; au rez-de-chaussée, les fenêtres du hall s'allument une à une,
    « comme pour un mariage » : la valse de l'hôtel, au piano, une fenêtre par temps (la mesure à
    trois temps : l'anacrouse sur la première, « DOB » sur la deuxième, la chute, puis la mèche)."""
    for p, v in ((piano, 'mf'), (piano_mg, 'mf'), (celles_tenu, 'pp'), (altos, 'pp'), (basses, 'pp')):
        s.nuance(p, v, 0)
    F = VALSE_T
    # les murs, très doux, sous la valse : i, ♭vi (avec « DOB »), i, ♭vi (la mèche)
    accord(s, celles_tenu, ('Eb3', 'Bb3'), 22.9, F[1], vel=58)
    accord(s, celles_tenu, ('D3', 'B3'), F[1], F[4], vel=58)
    accord(s, celles_tenu, ('Eb3', 'Bb3'), F[4], F[7], vel=58)
    accord(s, celles_tenu, ('D3', 'B3'), F[7], 28.6, vel=58)
    tenue(s, altos, 'Gb3', 22.9, 28.6, vel=56)
    # un fil de contrebasse sous la valse : la basse de chaque mesure
    for t0, t1, h in ((22.9, F[1], 'Eb2'), (F[1], F[3], 'B1'), (F[4], F[6], 'Eb2'), (F[7], 28.6, 'B1')):
        tenue(s, basses, h, t0, t1, vel=54)
    # la main droite : « mib sib | DOB ── solb fa | lab mib », puis « mib sib | DOB »
    chant = (('Eb4', F[0], entre(F[0], F[1]), 74), ('Bb4', entre(F[0], F[1]), F[1], 76), ('B4', F[1], F[3], 84),
             ('Gb4', F[3], entre(F[3], F[4]), 74), ('F4', entre(F[3], F[4]), F[4], 70), ('Ab4', F[4], F[5], 78),
             ('Eb4', F[5], F[6] - 0.04, 72), ('Eb4', F[6], entre(F[6], F[7]), 70),
             ('Bb4', entre(F[6], F[7]), F[7], 74), ('B4', F[7], 29.8, 82))
    for h, t0, t1, v in chant:
        tenue(s, piano, h, t0, t1, vel=v)
    # la main gauche : la basse sur le 1, l'accord sur le 2 et le 3
    mg = ((F[0], I, 50), (F[1], ('B1',), 64), (F[2], VI, 50), (F[3], VIT, 48), (F[4], ('Eb2',), 64),
          (F[5], I, 50), (F[6], I, 46), (F[7], ('B1',), 62), (F[8], VI, 44))
    for k, (t0, hs, v) in enumerate(mg):
        t1 = VALSE_T[k + 1] if k + 1 < len(VALSE_T) else 28.6
        dur = t1 - t0 if len(hs) == 1 else 0.8 * (t1 - t0)
        accord(s, piano_mg, hs, t0, t0 + dur, vel=v)


@plan('n6a_hotel')
def n6a(s):
    """L'hôtel depuis le terrain : en haut tout est noir, en bas le hall allumé. i revient ; le cor
    lointain prend l'anacrouse de la mèche."""
    for p, v in ((celles_tenu, 'pp'), (altos, 'pp'), (basses, 'pp'), (cor_loin, 'mp')):
        s.nuance(p, v, 0)
    accord(s, celles_tenu, ('Eb3', 'Bb3'), 28.6, 35.6, vel=62)
    tenue(s, altos, 'Gb3', 28.6, 35.6, vel=60)
    tenue(s, basses, 'Eb2', 28.6, 35.6, vel=58)
    tenue(s, sub, 'Eb2', 28.6, 35.6, vel=44)
    for h, t0, t1, v in (('Eb4', 29.5, 29.95, 76), ('Bb4', 29.95, 30.4, 78), ('B4', 30.4, 35.6, 86)):
        tenue(s, cor_loin, h, t0, t1, vel=v)
    courbe(s, cor_loin, [(29.5, 'mp'), (30.4, 'mp'), (32.4, 'p'), (34.0, 'pp'), (35.5, 'ppp')])
    for p in (celles_tenu, altos, basses):
        courbe(s, p, [(28.6, 'pp'), (30.4, 'p'), (34.0, 'pp'), (35.5, 'ppp')])


@plan('n6b_titre')
def n6b(s):
    """Le titre : la mèche au cor lointain, sur i — elle brûle, ne se résout pas ; on baisse les yeux
    vers le coin, vide ; le noir (34,0-35,5 s)."""
    s.nuance(violons2, 'ppp', 0)
    tenue(s, violons2, 'Eb5', 31.25, 35.6, vel=48, art='tenu')
    courbe(s, violons2, [(31.25, 'ppp'), (33.0, 'pp'), (35.5, 'ppp')])


# --- la traîne : le corps, que le jeu boucle seulement si le film dure plus ----------------------
@theme.section('traine', mesures=3, bpm=6 * 60 / 5.1, mesure='3/4', reprise=False)
def traine(s):
    """i et la mèche (dob), tenus — le médium devant ; d'un passage au suivant, en legato (la note
    suivante entre sans son attaque, la précédente s'efface en 0,14 s) : à la couture, la traîne ne
    respire pas, et rien ne s'empile."""
    for p, v in ((basses, 'pp'), (celles_tenu, 'pp'), (altos, 'pp'), (violons2, 'ppp')):
        s.nuance(p, v, 0)
    d = s.longueur
    s.note(basses, 'Eb2', 0, d, vel=52, art='legato')
    s.note(celles_tenu, 'Bb3', 0, d, vel=56, art='legato')
    for h in ('Eb4', 'Gb4'):
        s.note(altos, h, 0, d, vel=58, art='legato')
    s.note(violons2, 'B4', 0, d, vel=54, art='legato')
    s.note(violons2, 'Eb5', 0, d, vel=50, art='legato')


theme.forme(intro=ORDRE, corps=['traine'])
