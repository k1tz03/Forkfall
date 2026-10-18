"""FUSIBLE — la musique du film « La buanderie » (livre 6, « 23 h 58 »), écrite sous ses images
(packages/tools/web/cinema/films/la_buanderie.js, 31,6 s).

Un rêve : la buanderie du club-house en 1987, une ampoule nue qui se balance dans la vapeur, les
maillots de l'année qui sèchent rang après rang, une machine qui tourne, l'horloge ARRÊTÉE sur
23 h 58 ; à tâtons à travers le linge ; derrière le dernier rang, dans un panier, un téléphone beige
qui sonne sans fin ; noir sur la sonnerie (la carte demandera « Je décroche »). La musique est un
chapitre de « 23 h 58 » (livre_h6), sa face de nuit : le piano électrique DÉSACCORDÉ (le rêve) chante le
motif au ralenti ; la pédale de dominante, très loin ; l'horloge du livre ne bat qu'une fois — elle est
arrêtée ; à tâtons, le moteur des violoncelles en doubles croches sur ré ; trouvé : la tête au cor
bouché, la mèche (mi♭) sur la♭ majeur (♭II) ; elle ne se résout pas. Les SONNERIES du film (deux coups
toutes les quatre secondes) tombent sur les premiers temps : la musique leur laisse le premier temps,
et parle entre elles.

LE TEMPS : 60 à la noire, les premiers temps sur les sonneries (1,5 + 4k s) ; la dernière sonnerie
vient en avance (29,3 s au lieu de 29,5) : la mesure d'avant presse (60 → 66,7 sur sa seconde moitié,
la coupe de 27,5 s gardée sur son premier temps) ; la toute dernière mesure retient (52,2) jusqu'au noir.

LA FEUILLE DE SYNCHRO (temps du film → section, temps ; la musique)
   0,00  le noir s'ouvre (1,4 s) : l'ampoule         s0 t.1     la vapeur : le piano désaccordé, la pédale
   1,50  SONNERIE (étouffée)                        s1 t.1     le premier temps laissé à la sonnerie
   2,50  —                                          s1 t.2     le motif, au ralenti : sol…
   4,50  —                                          s1 t.4     … mi♭ (♭II), tenu par-dessus la sonnerie
   5,00  coupe : l'allée des maillots                s1 t.4,5   —
   5,50  SONNERIE                                   s2 t.1     —
   7,50  —                                          s2 t.3     « si♭ la » (V sans quinte)
   9,50  SONNERIE                                   s3 t.1     —
  10,50  coupe : la machine, puis l'horloge          s3 t.2     « do » (sol mineur) ; …
  12,50  l'horloge arrêtée sur 23 h 58               s3 t.4     … un seul tic : elle ne bat plus
  13,50  SONNERIE                                   s4 t.1     —
  15,00  coupe : à tâtons dans le linge             s4 t.2,5   le moteur des violoncelles sur ré, pp
  17,50  SONNERIE                                   s5 t.1     les altos ; la tête renversée au violoncelle
  21,50  coupe + SONNERIE : trouvé, le téléphone     s6 t.1     le moteur se tait ; le cor bouché :
  22,50  —                                          s6 t.2     « fu-si » (sol ré)…
  23,50  —                                          s6 t.3     … « BLE » : mi♭ sur la♭ (♭II)
  25,50  SONNERIE                                   s7a t.1    —
  26,50  —                                          s7a t.2    « si♭ la » (V)
  27,50  coupe : le combiné, de près                s7b t.1    la mesure presse ; mi♭ encore
  28,40  le titre (plein ; il entre à 28,2)          s7b t.2    —
  29,30  la dernière SONNERIE                       s8 t.1     la mèche sur la pédale de ré : rien ne
                                                               se résout
  31,00  le noir (0,6 s)                            s8 t.2,5   —
  31,60  la fin du film                             s8 fin     la traîne (ré, mi♭)

L'introduction (le film entier) : 31,6 s, sonie réglée sur elle (`sonie_sur='intro'`). Le corps :
`traine`, deux mesures (8 s) de la pédale et de la mèche, que le jeu boucle si le film dure plus.
"""
from moteur.ecriture import *
from partitions._fusible import phrase

theme = Theme('film_la_buanderie', 'La buanderie', bpm=60, mesure='4/4', tonalite='sol mineur',
              graine=19870523, ville=False, boucle_min=0, moment='le film « La buanderie », livre 6',
              humeur='un rêve de 1987 : la vapeur, les maillots, un téléphone qui sonne sans fin')
theme.master(sonie_sur='intro')

# --- les pistes ---------------------------------------------------------------------------------
reve = theme.piste('reve', 'piano_electrique', art='desaccorde', salle=0.45, echo=0.22, volume=4)
nappe = theme.piste('nappe', 'piano_electrique', art='desaccorde', salle=0.5, echo=0.2, pan=0.15, volume=-4)
harmonique = theme.piste('harmonique', 'violons', art='tenu', unisson=1, pan=-0.4, profondeur=0.75,
                         salle=0.5, volume=-3)
pedale = theme.piste('pedale', 'contrebasses', art='tenu', pan=0.05, largeur=0.4, salle=0.2, volume=6)
sub = theme.piste('sub', 'sub_synthe', volume=-14)
celles = theme.piste('celles', 'violoncelles', art='staccato', bref=0.14, pan=0.2, largeur=0.5, volume=3)
altos = theme.piste('altos', art='staccato', bref=0.12, volume=0)
celles_chant = theme.piste('celles_chant', 'violoncelles', art='tenu', pan=0.25, volume=4)
cor_bouche = theme.piste('cor_bouche', 'cors', art='sourdine', unisson=1, pan=-0.35, profondeur=0.8,
                         salle=0.55, volume=5)
horloge_bois = theme.piste('horloge_bois', 'batterie', humain=0, pan=0.25, salle=0.3, volume=2)
horloge_pizz = theme.piste('horloge_pizz', 'violons', art='pizzicato', humain=0, pan=0.25, salle=0.3,
                           volume=-1.5)

# =====================================================================================
# Le temps : les premiers temps sur les sonneries (début, fin, tempo, mesure, nombre de mesures)
PLANS = {
    's0': (0.0, 1.5, 60.0, (3, 8), 1),
    's1': (1.5, 5.5, 60.0, (4, 4), 1),
    's2': (5.5, 9.5, 60.0, (4, 4), 1),
    's3': (9.5, 13.5, 60.0, (4, 4), 1),
    's4': (13.5, 17.5, 60.0, (4, 4), 1),
    's5': (17.5, 21.5, 60.0, (4, 4), 1),
    's6': (21.5, 25.5, 60.0, (4, 4), 1),
    's7a': (25.5, 27.5, 60.0, (2, 4), 1),
    's7b': (27.5, 29.3, 2 * 60 / 1.8, (2, 4), 1),
    's8': (29.3, 31.6, 2 * 60 / 2.3, (2, 4), 1),
}
ORDRE = list(PLANS)
SONNERIES = [1.5, 5.5, 9.5, 13.5, 17.5, 21.5, 25.5, 29.3]


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


def moteur(s, piste, h, t0, t1, vel=66):
    """Les doubles croches 3+3+2 sur une note (ré) et son octave grave, de t0 à t1 (temps du film)."""
    a, fin = b(s, t0), b(s, t1)
    i = 0
    while a < fin - 1e-6:
        grave = i % 8 in (3, 6)
        s.note(piste, hauteur(h) - 12 if grave else h, a, 0.25, vel=vel + (12 if i % 8 in (0, 3, 6) else 0))
        a += 0.25
        i += 1


TETE = phrase('tete', 'sol mineur', octave=3)            # sol3 ré4 mi♭4
RENVERSE = TETE.inverse()                                 # sol do si : le monde à l'envers


# =====================================================================================
@plan('s0')
def s0(s):
    """L'ampoule nue dans la vapeur : le piano désaccordé, un accord de sol mineur qui monte du noir ;
    la pédale de ré, très loin."""
    s.nuance(nappe, 'p', 0)
    accord(s, nappe, ['G3', 'Bb3', 'D4', 'A4'], 0.3, 5.5, vel=56)
    s.expression(nappe, [(b(s, 0.3), 'pp'), (b(s, 1.4), 'p'), (b(s, 5.5), 'pp')])
    s.nuance(pedale, 'pp', 0)
    s.nuance(sub, 'pp', 0)
    tenue(s, pedale, 'D2', 0.6, 21.5, vel=56)
    tenue(s, sub, 'D2', 0.6, 21.5, vel=44)


@plan('s1')
def s1(s):
    """La première sonnerie (1,5 s), étouffée ; le motif au ralenti au piano désaccordé : sol, ré, puis
    mi♭ (♭II) tenu par-dessus la sonnerie suivante."""
    s.nuance(reve, 'mp', 0)
    tenue(s, reve, 'G4', 2.5, 3.5, vel=78)
    tenue(s, reve, 'D5', 3.5, 4.5, vel=80)
    tenue(s, reve, 'Eb5', 4.5, 7.5, vel=84)
    s.nuance(harmonique, 'pp', 0)
    tenue(s, harmonique, 'D6', 2.0, 5.3, vel=46)
    # ♭II sous la mèche
    accord(s, nappe, ['Ab3', 'C4', 'Eb4'], 5.6, 7.5, vel=52)


@plan('s2')
def s2(s):
    """L'allée : les maillots bordeaux de 1987, rang après rang, qui sèchent et se balancent. « si♭ la »
    sur ré majeur sans quinte (V)."""
    s.nuance(reve, 'mp', 0)
    tenue(s, reve, 'Bb4', 7.5, 8.5, vel=78)
    tenue(s, reve, 'A4', 8.5, 10.5, vel=76)
    accord(s, nappe, ['D3', 'F#3', 'D4'], 7.5, 10.4, vel=50)


@plan('s3')
def s3(s):
    """La machine : un maillot tourne derrière le hublot ; au-dessus, l'horloge arrêtée sur 23 h 58.
    « do » puis « sol » (sol mineur) ; un seul tic de l'horloge du livre : elle ne bat plus."""
    s.nuance(reve, 'mp', 0)
    tenue(s, reve, 'C5', 10.5, 11.5, vel=76)
    tenue(s, reve, 'G4', 11.5, 13.4, vel=72)
    accord(s, nappe, ['G3', 'Bb3', 'D4'], 10.6, 13.4, vel=48)
    s.note(horloge_bois, 76, b(s, 12.5), 0.25, vel=74)
    s.note(horloge_pizz, 'D5', b(s, 12.5), 0.25, vel=70)


@plan('s4')
def s4(s):
    """À tâtons, à travers le linge (15,0 s) : la caméra pousse les maillots, rang après rang. Le
    moteur des violoncelles en doubles croches sur ré, pp, qui avance."""
    s.nuance(celles, 'pp', 0)
    moteur(s, celles, 'D3', 15.0, 21.5, vel=60)
    s.crescendo(celles, b(s, 15.0), b(s, 21.4), 'pp', 'mf')
    accord(s, nappe, ['Ab3', 'C4', 'Eb4'], 14.0, 17.4, vel=46)


@plan('s5')
def s5(s):
    """La recherche continue : les altos reprennent la tête (1 5 ♭6) en doubles croches ; le
    violoncelle chante la tête renversée (sol do si) ; tout monte vers le panier."""
    s.nuance(altos, 'pp', 0)
    a, fin = b(s, 18.0), b(s, 21.5)
    i = 0
    tete = [hauteur('G4'), hauteur('D5'), hauteur('Eb5')]
    while a < fin - 1e-6:
        s.note(altos, tete[[0, 1, 2, 0, 1, 2, 0, 1][i % 8]], a, 0.25, vel=58 + (12 if i % 8 in (0, 3, 6) else 0))
        a += 0.25
        i += 1
    s.crescendo(altos, b(s, 18.0), b(s, 21.4), 'pp', 'mp')
    s.nuance(celles_chant, 'mp', 0)
    s.joue(celles_chant, RENVERSE.octave(1), a=b(s, 18.0), vel=80)
    # la quinte à vide sous la tête renversée : son si (bécarre) sonne majeur, étrange, sans frotter
    accord(s, nappe, ['G3', 'D4'], 17.6, 21.4, vel=46)


@plan('s6')
def s6(s):
    """Trouvé (21,5 s) : derrière le dernier rang, dans un panier de serviettes, le téléphone beige qui
    sonne ; le combiné tremble. Le moteur se tait ; le cor bouché : « fu-si-BLE », mi♭ sur la♭ (♭II)."""
    s.nuance(cor_bouche, 'mf', 0)
    tenue(s, cor_bouche, 'G3', 22.5, 23.0, vel=84)
    tenue(s, cor_bouche, 'D4', 23.0, 23.5, vel=86)
    tenue(s, cor_bouche, 'Eb4', 23.5, 26.5, vel=90)
    s.expression(cor_bouche, [(b(s, 23.5), 'mf'), (b(s, 25.4), 'mp'), (b(s, 26.5), 'mf')])
    s.nuance(nappe, 'p', 0)
    accord(s, nappe, ['Ab3', 'C4', 'Eb4'], 23.5, 26.4, vel=54)
    s.nuance(pedale, 'p', 0)
    tenue(s, pedale, 'D2', 21.7, 31.6, vel=58)
    tenue(s, sub, 'D2', 21.7, 31.6, vel=46)


@plan('s7a')
def s7a(s):
    """La sonnerie (25,5 s) ; « si♭ la » du cor bouché sur ré majeur sans quinte (V)."""
    tenue(s, cor_bouche, 'Bb3', 26.5, 27.0, vel=86)
    tenue(s, cor_bouche, 'A3', 27.0, 27.5, vel=84)
    accord(s, nappe, ['D3', 'F#3', 'D4'], 26.5, 27.4, vel=50)


@plan('s7b')
def s7b(s):
    """Le combiné de près (27,5 s), la mesure presse ; le titre (plein à 28,4 s). La mèche revient :
    mi♭, sur la♭ (♭II), le piano désaccordé et le cor."""
    s.nuance(reve, 'mp', 0)
    tenue(s, reve, 'Eb5', 27.5, 31.6, vel=80)
    tenue(s, cor_bouche, 'Eb4', 27.5, 31.6, vel=84)
    accord(s, nappe, ['Ab3', 'C4'], 27.6, 31.6, vel=50)
    for p in (reve, cor_bouche, nappe):
        s.expression(p, [(0, 'mp'), (b(s, 29.3), 'mp'), (b(s, 31.0), 'p'), (b(s, 31.6), 'ppp')])


@plan('s8')
def s8(s):
    """La dernière sonnerie (29,3 s) : la mèche sur la pédale de ré, rien ne se résout ; le noir à
    31,0 s."""
    s.expression(pedale, [(0, 'p'), (b(s, 31.0), 'pp'), (b(s, 31.6), 'ppp')])


# --- la traîne : le corps, que le jeu boucle seulement si le film dure plus ------------------------
@theme.section('traine', mesures=2, bpm=60, reprise=False)
def traine(s):
    """La pédale de ré et la mèche (mi♭), tenues, très bas ; elles entrent au deuxième temps et débordent
    de trois : la boucle repart sur leur fin, au même niveau (la couture)."""
    for p, v in ((pedale, 'pp'), (nappe, 'pp'), (cor_bouche, 'pp')):
        s.nuance(p, v, 0)
    d = s.longueur + 2
    s.note(pedale, 'D2', 1, d, vel=50)
    s.note(nappe, 'Ab3', 1, d, vel=46)
    s.note(cor_bouche, 'Eb4', 1, d, vel=56)


theme.forme(intro=ORDRE, corps=['traine'])
