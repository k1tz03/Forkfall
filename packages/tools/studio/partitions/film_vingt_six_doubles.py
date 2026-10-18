"""FUSIBLE — la musique du film « Vingt-six doubles » (livre 7, « Chambre 12 »), écrite sous ses
images (packages/tools/web/cinema/films/vingt_six_doubles.js, 37,0 s).

Mars 2011, la veille du premier entraînement : le parking de l'hôtel de la Rive au crépuscule, sous
la bruine, l'enseigne rose qui s'allume ; dans le bus de 2010, un nom au sparadrap sur chaque
appui-tête, et RANCÉ seul au dernier rang ; quatre survêtements sous la pluie, le troisième qui
s'arrête pour regarder le bus, la porte qui se referme ; le cahier de nuit (« minuit — 26 »), le
tableau des vingt-six doubles qui bougent encore ; la 12 qui s'allume, une silhouette, Tibo Rancé
(« J'ai appris là, en bas. En novembre, je joue ? ») ; d'en haut, le coin du terrain sous la pluie.
La musique est un chapitre de « Chambre 12 » (livre_h7) : mi bémol mineur, i–♭vi, la sonnette de
réception accordée sur mib (la signature : l'hôtel), le motif à la clarinette, la mèche au cor
lointain, le motif au piano de l'hôtel, le trousseau (célesta et glockenspiel), les cordes graves
tenues, les pizzicati du hall.

LE TEMPS : autour de 73 à la noire (sept temps par plan de 5,7 s, et ses voisins : 72 à 77), une
section par plan ; trois plans sont coupés à leur événement — l'enseigne (1,8 s), la porte (16,4 s),
la 12 (23,5 s) —, chaque événement un premier temps ; le titre ralentit (71,7). Chaque coupe est un
premier temps.

LA FEUILLE DE SYNCHRO (temps du film → section, temps ; la musique)
   0,00  le noir, le parking d'en haut        v1a t.0    la contrebasse sur mib ; la bruine (violons)
   1,80  l'enseigne rose s'allume             v1b t.0    la sonnette de réception (mib) ; i s'ouvre
   4,92 · 5,31  —                             v1b t.4 · 4,5  la clarinette : « mib sib »…
   5,70  coupe : le bus de 2010, dedans       v2 t.0     … « DOB » : la mèche, sur ♭vi
   8,14 · 8,55 · 8,96 · 9,77  l'allée, RANCÉ  v2 t.3 · 3,5 · 4 · 5  « solb fa | lab mib » : la chute
  11,40  coupe : l'arrivée sous la pluie      v3a t.0    les pizzicati du hall ; i
  13,90 · 14,32  le troisième s'arrête (14,1)  v3a t.3 · 3,5  le cor lointain : « mib sib »…
  14,73  il regarde le bus                     v3a t.4    … « DOB » : la mèche, sur ♭vi, tenue…
  16,40  la porte se referme (le bruit)        v3b t.0    … coupée net : le silence
  17,10  coupe : le cahier, « minuit — 26 »    v4 t.0     le piano de l'hôtel : « mib sib »…
  17,93  —                                     v4 t.1     … « DOB » (♭vi)
  19,0 · 19,75 · 20,55 · 21,35  les doubles bougent, puis se calment   le trousseau, de moins en moins
  20,41 · 21,24 · 22,07  —                     v4 t.4 · 5 · 6  « solb fa | lab mib » : la chute sur i
  22,90  coupe : la façade du terrain          v5a t.0    i
  23,50  la 12 s'allume                        v5b t.0    le vibraphone : « DOB », très haut ; ♭vi
  25,60 → 30,40  la réplique de Tibo Rancé                 presque rien : ♭vi, puis i, tenus
  28,60  coupe : dans la 12                    v6a t.0    i
  31,13  on passe son épaule : le terrain      v6a t.3    ♭vi ; les cordes s'ouvrent
  32,40  le titre « Aubérive · 2011 »          v6b t.0    la sonnette ; i, et la mèche aux violons
  35,60  le noir commence (1,4 s)              v6b t.3,8  decrescendo
  37,00  la fin du film                                   la traîne (le corps : i et la mèche, tenus)

L'introduction (le film entier) : 37,0 s, sonie réglée sur elle (`sonie_sur='intro'`). Le corps :
`traine`, trois mesures à trois temps (7,5 s), que le jeu boucle si le film dure plus.
"""
from moteur.ecriture import *

theme = Theme('film_vingt_six_doubles', 'Vingt-six doubles', bpm=76, mesure='4/4', tonalite='mi bémol mineur',
              graine=2603, ville=False, boucle_min=0, moment='le film « Vingt-six doubles », livre 7',
              humeur="la veille du premier entraînement : l'hôtel de la Rive, le bus de 2010, la 12 qui s'allume")
theme.master(sonie_sur='intro')

# --- la sonnette (la signature), le trousseau ----------------------------------------------------
_COMPTOIR = {'profondeur': 0.3, 'salle': 0.1, 'piece': 0.3}
sonnette = theme.piste('sonnette', 'glockenspiel', unisson=2, pan=0.15, volume=4, **_COMPTOIR)
sonnette_corps = theme.piste('sonnette_corps', 'vibraphone', art='dure', pan=0.15, volume=-1, **_COMPTOIR)
cles = theme.piste('cles', 'celesta', pan=0.35, volume=-1, **_COMPTOIR)
cles2 = theme.piste('cles2', 'glockenspiel', pan=0.4, volume=-8, **_COMPTOIR)
lumiere = theme.piste('lumiere', 'vibraphone', pan=0.25, profondeur=0.8, salle=0.5, volume=0)

# --- le piano de l'hôtel, dans une pièce sèche -----------------------------------------------------
piano = theme.piste('piano', art='tenu', profondeur=0.15, salle=0.06, piece=0.35, volume=9)
piano_mg = theme.piste('piano_mg', 'piano', art='tenu', profondeur=0.15, salle=0.06, piece=0.35, volume=3)

# --- les cordes ------------------------------------------------------------------------------------
violons2 = theme.piste('violons2', 'violons', pan=-0.22, volume=0)
altos = theme.piste('altos', volume=2)
celles_tenu = theme.piste('celles_tenu', 'violoncelles', art='tenu', pan=0.3, volume=5)
basses = theme.piste('basses', 'contrebasses', art='sans_vibrato', volume=2)
sub = theme.piste('sub', 'sub_synthe', volume=-21)

# --- les vents -------------------------------------------------------------------------------------
clarinette = theme.piste('clarinette', 'clarinettes', unisson=1, art='tenu', volume=5)
cor_loin = theme.piste('cor_loin', 'cors', unisson=1, pan=-0.4, profondeur=0.9, salle=0.55, volume=4)

theme.bus('cordes', eq={'passe_haut': 32, 'cloches': [(2500, 1.0, 0.7)], 'air': 4.0})
theme.bus('cuivres', eq={'passe_haut': 38, 'boue': -1.0, 'air': 3.0})

# =====================================================================================
# Le temps : une section par plan (ou par moment du plan) : début et fin dans le film, tempo, mesure
PLANS = {
    'v1a_bruine': (0.0, 1.8, 2 * 60 / 1.8, (2, 4)),
    'v1b_enseigne': (1.8, 5.7, 5 * 60 / 3.9, (5, 4)),
    'v2_bus': (5.7, 11.4, 7 * 60 / 5.7, (7, 4)),
    'v3a_arrivee': (11.4, 16.4, 6 * 60 / 5.0, (6, 4)),
    'v3b_porte': (16.4, 17.1, 1 * 60 / 0.7, (1, 4)),
    'v4_cahier': (17.1, 22.9, 7 * 60 / 5.8, (7, 4)),
    'v5a_facade': (22.9, 23.5, 1 * 60 / 0.6, (1, 4)),
    'v5b_lumiere': (23.5, 28.6, 6 * 60 / 5.1, (6, 4)),
    'v6a_epaule': (28.6, 32.4, 4.5 * 60 / 3.8, (9, 8)),
    'v6b_titre': (32.4, 37.0, 5.5 * 60 / 4.6, (11, 8)),
}
ORDRE = list(PLANS)


def temps(nom, k):
    """Le temps du film du temps `k` (une noire) de la section `nom`."""
    d, _f, bpm, _m = PLANS[nom]
    return d + k * 60.0 / bpm


def plan(nom):
    _d, _f, bpm, mes = PLANS[nom]
    return theme.section(nom, mesures=1, bpm=bpm, mesure=mes, reprise=False)


def b(s, t):
    """Le temps du film `t` (en secondes) → la position, en temps, comptée depuis le début de la
    section en cours (au-delà de sa fin, à travers les sections suivantes et leurs tempos)."""
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


def phrase_a(s, piste, notes, vel=80):
    """Une phrase posée au temps du film : [(hauteur, début, fin, vélocité relative)]."""
    for h, t0, t1, dv in notes:
        tenue(s, piste, h, t0, t1, vel=vel + dv)


def sonner(s, t, vel=90):
    """La sonnette de réception, accordée sur mib (une frappe)."""
    tenue(s, sonnette, 'Eb7', t, t + 1.6, vel=vel)
    tenue(s, sonnette_corps, 'Eb6', t, t + 2.4, vel=vel - 4)


# le trousseau : six petites frappes irrégulières (en secondes) sur mib, sib, dob — la tête
_TROUSSEAU = ((0.0, 'Eb7', 70), (0.045, 'Bb6', 56), (0.1, 'B6', 62), (0.16, 'Eb7', 48),
              (0.235, 'Bb6', 42), (0.32, 'B6', 36))


def trousseau(s, t, vel=0):
    for dt, h, v in _TROUSSEAU:
        tenue(s, cles, h, t + dt, t + dt + 0.3, vel=v + vel)
        tenue(s, cles2, h, t + dt + 0.008, t + dt + 0.25, vel=v - 8 + vel)


# =====================================================================================
# Les plans

@plan('v1a_bruine')
def v1a(s):
    """Le parking, d'en haut, au crépuscule, sous la bruine : la contrebasse sur mib, de rien ; la
    bruine (les violons, un trémolo très haut, presque rien)."""
    for p, v in ((basses, 'ppp'), (violons2, 'ppp'), (sub, 'p')):
        s.nuance(p, v, 0)
    tenue(s, basses, 'Eb2', 0.15, 5.7, vel=64)
    courbe(s, basses, [(0.15, 'ppp'), (1.8, 'pp'), (5.0, 'p')])
    tenue(s, sub, 'Eb2', 0.4, 5.7, vel=50)
    tenue(s, violons2, 'Bb5', 0.3, 5.7, vel=42, art='tremolo')
    courbe(s, violons2, [(0.3, 'ppp'), (2.5, 'pp'), (5.6, 'ppp')])


@plan('v1b_enseigne')
def v1b(s):
    """L'enseigne s'allume : la sonnette de réception (l'hôtel) ; i s'ouvre (mib, la quinte, la
    tierce) ; la clarinette prend l'anacrouse, et sa mèche tombera sur le bus."""
    for p, v in ((celles_tenu, 'pp'), (altos, 'pp'), (clarinette, 'mp')):
        s.nuance(p, v, 0)
    sonner(s, 1.8, vel=90)
    tenue(s, celles_tenu, 'Eb3', 1.8, 5.7, vel=62)
    tenue(s, celles_tenu, 'Bb3', temps('v1b_enseigne', 1), 5.7, vel=60)
    tenue(s, altos, 'Gb3', temps('v1b_enseigne', 2), temps('v2_bus', 3), vel=60)
    courbe(s, celles_tenu, [(1.8, 'pp'), (5.6, 'p')])
    # « mib sib | DOB ── ── solb fa | lab mib » : l'anacrouse ici, la mèche sur la coupe (le bus)
    t4, t45 = temps('v1b_enseigne', 4), temps('v1b_enseigne', 4.5)
    T = lambda k: temps('v2_bus', k)
    phrase_a(s, clarinette, (('Eb4', t4, t45, -6), ('Bb4', t45, 5.7, -4), ('B4', 5.7, T(3), 6),
                             ('Gb4', T(3), T(3.5), -4), ('F4', T(3.5), T(4), -8), ('Ab4', T(4), T(5), 0),
                             ('Eb4', T(5), T(6.75), -4)), vel=84)
    courbe(s, clarinette, [(t4, 'mp'), (5.7, 'mf'), (8.0, 'mp'), (11.0, 'p')])


@plan('v2_bus')
def v2(s):
    """Le bus de 2010, dedans : l'allée, les noms au sparadrap, RANCÉ seul au dernier rang. La
    mèche de la clarinette sur ♭vi (les voix glissent d'un demi-ton), puis la chute sur i."""
    T = lambda k: temps('v2_bus', k)
    s.nuance(basses, 'pp', 0)
    accord(s, celles_tenu, ('D3', 'B3'), 5.7, T(4), vel=62)            # ♭vi, puis ♭vi sans fa# (t. 3)
    accord(s, celles_tenu, ('Eb3', 'Bb3'), T(4), 11.4, vel=62)          # i : la chute
    tenue(s, altos, 'Gb3', T(4), 11.4, vel=58)
    tenue(s, basses, 'B1', 5.7, T(4), vel=60)
    tenue(s, basses, 'Eb2', T(4), 11.4, vel=58)
    courbe(s, celles_tenu, [(5.7, 'p'), (8.9, 'pp'), (11.3, 'pp')])


@plan('v3a_arrivee')
def v3a(s):
    """L'arrivée, sous la pluie : les pizzicati du hall ; le troisième s'arrête et regarde le bus :
    le cor lointain, la mèche (sur ♭vi), tenue jusqu'à la porte, qui la coupe."""
    T = lambda k: temps('v3a_arrivee', k)
    for p, v in ((basses, 'p'), (cor_loin, 'mp'), (violons2, 'ppp')):
        s.nuance(p, v, 0)
    for k, (h, v) in enumerate((('Eb2', 78), ('Bb2', 64), ('Eb2', 76), ('Bb2', 62), ('B1', 78), ('F#2', 64))):
        s.note(basses, h, k, 0.9, vel=v, art='pizzicato')
    accord(s, celles_tenu, ('Eb3', 'Bb3'), 11.4, T(4), vel=60)
    accord(s, celles_tenu, ('D3', 'B3'), T(4), 16.4, vel=64)
    tenue(s, altos, 'Gb3', 11.4, 16.4, vel=58)
    courbe(s, celles_tenu, [(11.4, 'pp'), (14.7, 'p'), (16.3, 'p')])
    phrase_a(s, cor_loin, (('Eb4', T(3), T(3.5), -6), ('Bb4', T(3.5), T(4), -4), ('B4', T(4), 16.4, 4)), vel=82)
    courbe(s, cor_loin, [(T(3), 'mp'), (T(4), 'mf'), (16.3, 'mp')])
    tenue(s, violons2, 'Bb5', 11.5, T(4), vel=40, art='tremolo')


@plan('v3b_porte')
def v3b(s):
    """La porte s'est refermée (son bruit, sur ce premier temps) : le silence."""


@plan('v4_cahier')
def v4(s):
    """Le cahier de nuit (« minuit — 26 »), puis le tableau : les vingt-six doubles qui bougent
    encore, et se calment ; on s'approche de la 12. Le piano de l'hôtel joue le motif ; le trousseau,
    de moins en moins."""
    T = lambda k: temps('v4_cahier', k)
    for p, v in ((piano, 'mf'), (piano_mg, 'mp'), (celles_tenu, 'pp'), (altos, 'pp'), (basses, 'pp')):
        s.nuance(p, v, 0)
    phrase_a(s, piano, (('Eb4', 17.1, T(0.5), -6), ('Bb4', T(0.5), T(1), -4), ('B4', T(1), T(4), 6),
                        ('Gb4', T(4), T(4.5), -4), ('F4', T(4.5), T(5), -8), ('Ab4', T(5), T(6), 0),
                        ('Eb4', T(6), 23.4, -4)), vel=80)
    # la main gauche marque chaque changement de basse (sèche, une octave au-dessus)
    for h, k in (('Eb3', 0), ('B2', 1), ('Eb3', 5)):
        tenue(s, piano_mg, h, T(k), T(k + 1.5), vel=56)
    # les murs : i, ♭vi (sous « DOB »), ♭vi sans fa# (sous « solb fa »), i (la chute)
    accord(s, celles_tenu, ('Eb3', 'Bb3'), 17.1, T(1), vel=58)
    accord(s, celles_tenu, ('D3', 'B3'), T(1), T(5), vel=60)
    accord(s, celles_tenu, ('Eb3', 'Bb3'), T(5), 23.5, vel=58)
    tenue(s, altos, 'Gb3', 17.1, T(4), vel=56)
    tenue(s, altos, 'Gb3', T(5), 23.5, vel=56)
    tenue(s, basses, 'Eb2', 17.1, T(1), vel=56)
    tenue(s, basses, 'B1', T(1), T(5), vel=56)
    tenue(s, basses, 'Eb2', T(5), 23.5, vel=54)
    # le courant d'air : les doubles bougent, puis se calment (le film : jusqu'à 21,5 s)
    for t, dv in ((19.0, 0), (19.75, -5), (20.55, -10), (21.35, -16)):
        trousseau(s, t, vel=dv)


@plan('v5a_facade')
def v5a(s):
    """La façade, du terrain : la 12 est encore noire."""


@plan('v5b_lumiere')
def v5b(s):
    """La 12 s'allume : « DOB », très haut, au vibraphone ; les voix glissent sur ♭vi. Puis une
    silhouette, et la réplique (25,6-30,4 s) : presque rien."""
    for p, v in ((lumiere, 'mp'), (celles_tenu, 'pp'), (basses, 'pp'), (altos, 'pp')):
        s.nuance(p, v, 0)
    tenue(s, lumiere, 'B5', 23.5, 27.0, vel=74)
    accord(s, celles_tenu, ('D3', 'B3'), 23.5, 28.6, vel=58)
    tenue(s, altos, 'F#3', 23.5, 28.6, vel=54)
    tenue(s, basses, 'B1', temps('v5b_lumiere', 1), 28.6, vel=52)
    courbe(s, celles_tenu, [(23.5, 'pp'), (25.2, 'p'), (25.6, 'pp'), (28.5, 'ppp')])
    courbe(s, altos, [(23.5, 'pp'), (25.6, 'ppp')])
    courbe(s, basses, [(24.35, 'pp'), (25.6, 'ppp')])


@plan('v6a_epaule')
def v6a(s):
    """Dans la 12 : Tibo de dos à la vitre (la réplique finit à 30,4) ; on passe son épaule, le coin du
    terrain sous la pluie : ♭vi, les cordes s'ouvrent."""
    T = lambda k: temps('v6a_epaule', k)
    accord(s, celles_tenu, ('Eb3', 'Bb3'), 28.6, T(3), vel=58)
    accord(s, celles_tenu, ('D3', 'B3'), T(3), 32.4, vel=64)
    tenue(s, altos, 'Gb3', 28.6, 32.4, vel=56)
    tenue(s, basses, 'Eb2', 28.6, T(3), vel=52)
    tenue(s, basses, 'B1', T(3), 32.4, vel=58)
    s.nuance(violons2, 'ppp', 0)
    tenue(s, violons2, 'F#4', T(3), 32.4, vel=54, art='tenu')
    tenue(s, violons2, 'B4', T(3), 32.4, vel=54, art='tenu')
    for p in (celles_tenu, altos, basses):
        courbe(s, p, [(28.6, 'ppp'), (30.4, 'pp'), (32.3, 'p')])
    courbe(s, violons2, [(T(3), 'ppp'), (32.3, 'pp')])


@plan('v6b_titre')
def v6b(s):
    """Le titre : la sonnette (l'hôtel), i, et la mèche (dob) aux violons, qui ne se résout pas ; le
    noir (35,6-37,0 s)."""
    sonner(s, 32.4, vel=88)
    accord(s, celles_tenu, ('Eb3', 'Bb3'), 32.4, 37.1, vel=60)
    tenue(s, altos, 'Gb3', 32.4, 37.1, vel=58)
    tenue(s, basses, 'Eb2', 32.4, 37.1, vel=56)
    tenue(s, sub, 'Eb2', 32.4, 37.1, vel=44)
    tenue(s, violons2, 'B4', 32.4, 37.1, vel=58, art='tenu')
    tenue(s, violons2, 'Eb5', 32.4, 37.1, vel=52, art='tenu')
    for p in (celles_tenu, altos, basses, violons2):
        courbe(s, p, [(32.4, 'p'), (35.6, 'pp'), (37.0, 'ppp')])


# --- la traîne : le corps, que le jeu boucle seulement si le film dure plus ----------------------
@theme.section('traine', mesures=3, bpm=5.5 * 60 / 4.6, mesure='3/4', reprise=False)
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
