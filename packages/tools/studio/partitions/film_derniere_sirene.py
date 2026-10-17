"""FUSIBLE — la musique du film « La dernière sirène » (livre 3, « La Sirène »), écrite sous ses
images (packages/tools/web/cinema/films/derniere_sirene.js, 38,0 s).

Le 24 décembre 1990, seize heures, la Tréfilerie ferme : la ville au grillage, la sirène une
dernière fois, les clés dans la boîte du gardien, les lampes du bâtiment C qui s'éteignent rangée
par rangée pendant que les tambours des tréfileuses ralentissent, la pointeuse, le premier rang qui
lâche le grillage, le cadenas, le crépuscule. La musique est un chapitre de « Seize heures »
(livre_h3) : mi phrygien, la chaîne (le motif en basse obstinée), la tête au cor, le cœur de la
halle, la sirène des cordes ; mais la VRAIE sirène est celle du film (son bruit, `sons`, à 0,15 et
5,4 s : elle monte de 270 à 650 Hz et retombe en 2,6 s) : la musique lui laisse sa bande, et le cor
ne prend la mèche qu'une fois qu'elle s'est tue.

LE TEMPS : une pulsation lente, 75 à la noire (la croche = 0,4 s : les plans du film tombent sur
cette grille), une section par plan, des mesures de la longueur des plans ; la pointeuse a son
propre tempo (55,6 : cinq temps de 1,08 s, la grande aiguille qui saute sur le troisième). Chaque
coupe est un premier temps.

LA FEUILLE DE SYNCHRO (temps du film → section, temps ; la musique)
   0,00  le noir, le grillage               p1 t.0      la pédale de mi, la chaîne au loin (l'usine
                                                         tourne encore), le chœur de la ville
   0,15  la sirène du film monte            (p1 t.0,19) rien entre 250 et 700 Hz jusqu'à 2,8 s
   0,80  le carton « La Tréfilerie »        p1 t.1      le chœur entre
   5,20  coupe : la sirène, la tour         p2 t.0      la chaîne, plus près
   5,40  la sirène du film, encore          (p2 t.0,25) la bande libre jusqu'à 8,1 s
   8,40  —                                  p2 t.4      le cor : « mi si » (l'anacrouse)…
   9,20  coupe : le portail                 p3 t.0      … « DO » : la mèche, sur la coupe
  10,20  la réplique du gardien             p3 t.1,25   le cor est retombé sur si ; tout s'amincit
  14,00  coupe : le bâtiment C, dedans      p4a t.0     LA MACHINE, tout près, à pleine vitesse
  14,40  la 1re rangée s'éteint (contacteur) p4b t.0    la presse se tait ; la chaîne ralentit
  15,20  la 2e rangée                        p4b t.1    les contrebasses se taisent
  16,00  la 3e rangée                        p4b t.2    la basse de synthèse se tait
  16,80  la 4e rangée                        p4b t.3    la dernière croche des violoncelles
  17,60  les tambours arrêtés                p4b t.4    le dernier coup (timbale, contrebasse), rien
  18,20  coupe : la pointeuse                p5 t.0     le cœur (grosse caisse étouffée), un temps
                                                         par 1,08 s
  20,36  la grande aiguille saute            p5 t.2     le cœur, une timbale très douce
  21,44  la carte de ta mère approche        p5 t.3     le cor au loin : « mi si »…
  22,52  —                                   p5 t.4     … « DO » : la mèche, sur la carte
  23,60  coupe : le premier rang au treillis p6 t.0     le silence d'après : la pédale, à peine
  24,90 · 25,75 · 26,60 · 27,45  les quatre lampadaires du parking s'allument : au vibraphone, de
                                                         loin, « mi si do » puis sol (la tête)
  28,40  coupe : la chaîne                   p7 t.0
  30,00  le cadenas claque                   p7 t.2     une timbale et la contrebasse, très bas
  32,40  coupe (du noir) : le crépuscule     p8a t.0    la sirène des cordes monte (altos, violons,
                                                         le chœur) — celle du film est muette
  34,40  le titre « Aubérive · 1990 »        p8b t.0    la mèche (do) sur ♭VI, cordes, chœur, cor
  35,60  —                                   p8b t.1,5  elle retombe sur la quinte (si), mi mineur
  36,60  le noir commence (1,4 s)            p8b t.2,75 decrescendo
  38,00  la fin du film                      p8b t.4,5  la traîne (le corps : un accord tenu)

L'introduction (le film entier) : 38,0 s, sonie réglée sur elle (`sonie_sur='intro'`). Le corps :
`traine`, trois mesures d'un mi mineur tenu (9,6 s), que le jeu boucle si le film dure plus.
"""
import math

from moteur.ecriture import *
from partitions._fusible import phrase

theme = Theme('film_derniere_sirene', 'La dernière sirène', bpm=75, mesure='4/4', tonalite='mi phrygien',
              graine=2412, ville=False, boucle_min=0, moment='le film « La dernière sirène », livre 3',
              humeur='la dernière sirène de la Tréfilerie, les lampes qui s\'éteignent')
theme.master(sonie_sur='intro')

TON = 'mi phrygien'
T = Tonalite(TON)
theme.salle('salle', rt60=3.0)

# --- les pistes --------------------------------------------------------------------------------
violons = theme.piste('violons', legato=True, volume=2.5)
altos = theme.piste('altos', legato=True, volume=3)
celles = theme.piste('celles', 'violoncelles', art='staccato', bref=0.18, volume=1.5)      # la chaîne
celles_t = theme.piste('celles_t', 'violoncelles', art='tenu', pan=0.25, volume=-1)
basses = theme.piste('basses', 'basses_film', volume=-1)
cors = theme.piste('cors', art='tenu', volume=5.5)
cor_solo = theme.piste('cor_solo', 'cors', unisson=1, pan=-0.4, profondeur=0.9, salle=0.7, volume=-3)
choeur = theme.piste('choeur', art='ouh', profondeur=0.75, largeur=1.2, volume=1.5)
vibra = theme.piste('vibra', 'vibraphone', pan=0.3, profondeur=0.8, salle=0.6, volume=4)
timbales = theme.piste('timbales', volume=-2)
coeur = theme.piste('coeur', 'grosse_caisse', profondeur=0.6, salle=0.45, volume=0)
tamtam = theme.piste('tamtam', 'tam_tam', volume=-6)
gouttes = theme.piste('gouttes', 'enclume', profondeur=0.9, salle=0.8, pan=-0.3,
                      eq={'passe_haut': 500, 'passe_bas': 3500}, volume=-3)
marteau = theme.piste('marteau', 'enclume', profondeur=0.45, salle=0.3,
                      eq={'passe_haut': 350, 'passe_bas': 6000, 'cloches': [(900, 3.0, 1.0)]}, volume=-6)
presse = theme.piste('presse', 'boite_a_rythmes', volume=-6)
basse = theme.piste('basse', 'basse_synthe', sature=0.5, volume=-10)
# la chaîne de loin (plans 1-3, derrière le mur de l'usine) : étouffée, sous la bande de la sirène
celles_loin = theme.piste('celles_loin', 'violoncelles', art='staccato', bref=0.18, profondeur=0.8, salle=0.6,
                          eq={'passe_bas': 420}, volume=1.5)
basse_loin = theme.piste('basse_loin', 'basse_synthe', sature=0.5, eq={'passe_bas': 380}, volume=-10)
sub = theme.piste('sub', 'sub_synthe', volume=-25)

# =====================================================================================
# Le temps : une section par plan (début et fin dans le film, tempo, mesure : une mesure par section)
PLANS = {
    'p1_grillage': (0.0, 5.2, 75, (13, 8)),
    'p2_sirene': (5.2, 9.2, 75, (5, 4)),
    'p3_portail': (9.2, 14.0, 75, (6, 4)),
    'p4a_atelier': (14.0, 14.4, 75, (1, 8)),
    'p4b_lampes': (14.4, 18.2, 75, (19, 16)),
    'p5_pointeuse': (18.2, 23.6, 500 / 9, (5, 4)),
    'p6_treillis': (23.6, 28.4, 75, (6, 4)),
    'p7_cadenas': (28.4, 32.4, 75, (5, 4)),
    'p8a_crepuscule': (32.4, 34.4, 75, (5, 8)),
    'p8b_titre': (34.4, 38.0, 75, (9, 8)),
}
ORDRE = list(PLANS)


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


# =====================================================================================
# Le matériau (celui de « Seize heures »)
TETE = phrase('tete', TON, octave=3)            # mi3 si3 | do4 ──
DO5 = T.degre(6, 4)                              # la mèche, en haut
SI4 = T.degre(5, 4)

# la chaîne : le motif posé sur la grille, chaque note répétée tant qu'elle dure, tournée pour que
# le do tombe sur la barre : | do do do do do do sol fa | la la mi mi mi mi mi si |
CHAINE = ['C3', 'C3', 'C3', 'C3', 'C3', 'C3', 'G2', 'F2', 'A2', 'A2', 'E2', 'E2', 'E2', 'E2', 'E2', 'B2']
ACCENTS = 'X x x X x x X x X x x X x x X x'.split()
ACC = {'X': 20, 'x': 0}
PAS = 0.2            # la double croche à 75 : la machine (le film : les tambours des tréfileuses)
T_CHAINE = 0.0       # la chaîne compte ses notes depuis le début du film


def chaine(s, de, a, pistes, vel=80, octave=0, seuls_accents=()):
    """La chaîne de `de` à `a` (temps du film), sur la grille de 0,2 s comptée depuis le début du film
    (elle ne recommence pas à chaque plan) ; `pistes` : [(piste, transposition, art)] ;
    `seuls_accents` : les pistes qui ne jouent que les accents (la presse, les contrebasses)."""
    k = int(math.ceil((de - T_CHAINE) / PAS - 1e-9))
    while T_CHAINE + k * PAS < a - 1e-9:
        t = T_CHAINE + k * PAS
        i = k % 16
        for piste, tr, art in pistes:
            if piste in seuls_accents and ACCENTS[i] != 'X':
                continue
            h = 'K' if piste is presse else hauteur(CHAINE[i]) + 12 * octave + tr
            s.note(piste, h, b(s, t), PAS * 75 / 60.0, vel=vel + ACC[ACCENTS[i]], art=art)
        k += 1


def glisse(s, piste, h0, h1, t0, t1, pas=0.25, vel=(70, 96), art='legato'):
    """Un glissando de cordes (micro-pas d'un quart de ton, en legato) de `h0` à `h1`, du temps du
    film `t0` à `t1`, sur la courbe d'une sirène (vite d'abord, puis elle approche sa note)."""
    h0, h1 = hauteur(h0), hauteur(h1)
    n = max(2, int(round(abs(h1 - h0) / pas)))
    q = 1 - math.exp(-3.0)

    def instant(p):
        return -math.log(1 - p * q) / 3.0

    for k in range(n):
        p0, p1 = k / n, (k + 1) / n
        a, z = t0 + (t1 - t0) * instant(p0), t0 + (t1 - t0) * instant(p1)
        v = vel[0] + (vel[1] - vel[0]) * p0
        s.note(piste, h0 + (h1 - h0) * p0, b(s, a), max(0.02, b(s, z) - b(s, a)), vel=v, art=art)


def tenue(s, piste, h, t0, t1, vel=70, art=None):
    s.note(piste, h, b(s, t0), b(s, t1) - b(s, t0), vel=vel, art=art)


# =====================================================================================
# Les plans

@plan('p1_grillage')
def p1(s):
    """Le grillage, la ville entière ; la sirène du film monte (0,15-2,8 s) : la musique reste sous
    250 Hz et loin ; la chaîne, l'usine qui tourne encore, derrière le mur."""
    for p, v in ((basses, 'pp'), (choeur, 'pp'), (celles_loin, 'pp'), (basse_loin, 'pp'), (presse, 'pp'),
                 (altos, 'pp')):
        s.nuance(p, v, 0)
    tenue(s, basses, 'E1', 0.0, 5.2, vel=62, art='tremolo')
    s.crescendo(basses, 0, b(s, 5.2), 'pp', 'p')
    tenue(s, sub, 'E1', 0.0, 9.2, vel=58)
    # la chaîne au loin, qui monte doucement
    chaine(s, 0.4, 5.2, [(celles_loin, 0, 'staccato'), (basse_loin, 0, None), (presse, 0, None)], vel=70,
           seuls_accents=(presse,))
    s.crescendo(celles_loin, 0, b(s, 5.2), 'pp', 'p')
    # le chœur de la ville, sous la sirène (mi3–si3 : sous sa bande) ; il entre avec le carton
    for h in ('E3', 'B3'):
        tenue(s, choeur, h, 0.8, 5.0, vel=64)
    s.expression(choeur, [(b(s, 0.8), 'pp'), (b(s, 3.0), 'p'), (b(s, 5.0), 'pp')])
    # la sirène du film s'est tue (2,8 s) : les altos montent vers la tour (si3 → mi4), sans la
    # rejoindre ; ils se retirent avant la seconde sirène
    tenue(s, altos, 'B3', 3.0, 4.6, vel=66, art='legato')
    tenue(s, altos, 'E4', 4.0, 5.3, vel=62, art='legato')
    s.expression(altos, [(b(s, 3.0), 'pp'), (b(s, 4.4), 'p'), (b(s, 5.3), 'ppp')])


@plan('p2_sirene')
def p2(s):
    """La tour : la seconde sirène du film (5,4-8,1 s) ; la chaîne plus près ; quand elle s'est tue,
    le cor chante la tête, « mi si », et pose la mèche sur la coupe (9,2 s)."""
    s.nuance(celles_loin, 'p', 0)
    s.nuance(basse_loin, 'p', 0)
    s.nuance(presse, 'p', 0)
    tenue(s, basses, 'E1', 5.2, 9.2, vel=64, art='tremolo')
    s.nuance(basses, 'p', 0)
    chaine(s, 5.2, 9.2, [(celles_loin, 0, 'staccato'), (basse_loin, 0, None), (presse, 0, None)], vel=74,
           seuls_accents=(presse,))
    # le chœur tient, sous la sirène
    for h in ('E3', 'B3'):
        tenue(s, choeur, h, 5.2, 9.0, vel=62)
    s.expression(choeur, [(0, 'pp'), (b(s, 8.0), 'p'), (b(s, 9.0), 'pp')])
    # le cor : « mi si » (8,4 et 8,8 s), la mèche sur la coupe (le plan suivant)
    s.nuance(cors, 'mp', b(s, 8.4))
    s.note(cors, 'E4', b(s, 8.4), b(s, 8.8) - b(s, 8.4), vel=96)
    s.note(cors, 'B4', b(s, 8.8), b(s, 9.2) - b(s, 8.8), vel=98)


@plan('p3_portail')
def p3(s):
    """Le portail : la mèche du cor sur la coupe, qui retombe sur si comme la sirène ; la réplique
    du gardien (10,2-13,9 s) : presque rien, la chaîne au loin, les clés qui tombent."""
    tenue(s, cors, DO5, 9.2, 10.1, vel=96)
    tenue(s, cors, SI4, 10.1, 11.6, vel=86)
    s.expression(cors, [(0, 'mp'), (b(s, 9.9), 'mp'), (b(s, 10.4), 'p'), (b(s, 11.6), 'ppp')])
    # sous la mèche, ♭VI (do) : les violoncelles, le chœur, puis i
    tenue(s, celles_t, 'C3', 9.2, 10.4, vel=72)
    tenue(s, celles_t, 'E3', 10.4, 13.6, vel=62)
    s.expression(celles_t, [(0, 'mp'), (b(s, 10.4), 'p'), (b(s, 13.6), 'pp')])
    tenue(s, basses, 'C2', 9.2, 10.4, vel=66, art='tenu')
    tenue(s, basses, 'E1', 10.4, 14.0, vel=60, art='tenu')
    s.nuance(basses, 'p', 0)
    tenue(s, sub, 'C2', 9.2, 10.4, vel=54)
    tenue(s, sub, 'E1', 10.4, 14.0, vel=54)
    # la chaîne, de plus en plus loin pendant la réplique, puis elle revient (la porte du bâtiment C)
    s.nuance(celles_loin, 'pp', 0)
    s.nuance(basse_loin, 'pp', 0)
    s.nuance(presse, 'pp', 0)
    chaine(s, 9.2, 14.0, [(celles_loin, 0, 'staccato'), (basse_loin, 0, None), (presse, 0, None)], vel=70,
           seuls_accents=(presse,))
    s.expression(celles_loin, [(0, 'p'), (b(s, 10.2), 'pp'), (b(s, 12.8), 'pp'), (b(s, 14.0), 'mf')])
    s.expression(basse_loin, [(0, 'p'), (b(s, 10.2), 'pp'), (b(s, 12.8), 'pp'), (b(s, 14.0), 'mf')])
    # les clés qui tombent dans la boîte (des gouttes de métal)
    for t, v in ((10.6, 50), (11.5, 44), (12.3, 54), (13.2, 46)):
        s.note(gouttes, 'C4', b(s, t), 0.25, vel=v)


@plan('p4a_atelier')
def p4a(s):
    """Coupe dans le bâtiment C : la machine tout près, à pleine vitesse (0,4 s)."""
    for p, v in ((celles, 'f'), (basse, 'f'), (presse, 'mf'), (basses, 'mf')):
        s.nuance(p, v, 0)
    chaine(s, 14.0, 14.4, [(celles, 0, 'staccato'), (celles, 12, 'staccato'), (basse, 0, None),
                           (presse, 0, None), (basses, -12, 'staccato')], vel=88)
    s.note(marteau, 'C4', 0, 0.25, vel=96)


# la machine qui s'arrête : les tambours ralentissent de 14,2 à 17,6 s (leur vitesse tombe en ligne
# droite à zéro) ; la chaîne les suit, une note par tour : la k-ième au temps où la phase vaut k
T1, T2 = 14.2, 17.6
V0 = 1 / PAS


def tours():
    """Les instants des notes de la chaîne qui ralentit (après 14,2 s)."""
    D = T2 - T1
    sortie = []
    k = 1
    while True:
        disc = D * D - 2 * D * k / V0
        if disc < 0:
            break
        sortie.append(T1 + D - math.sqrt(disc))
        k += 1
    return sortie


@plan('p4b_lampes')
def p4b(s):
    """Les rangées s'éteignent (14,4 · 15,2 · 16,0 · 16,8 s : les temps 1 à 4), les tambours
    ralentissent : la chaîne ralentit avec eux, et à chaque rangée une voix se tait ; à 17,6 s la
    machine s'arrête (le dernier coup), puis rien."""
    instants = [t for t in tours() if t >= 14.4]
    # (14,2-14,4 : la dernière double croche à pleine vitesse est dans p4a)
    k0 = int(round((14.4 - T_CHAINE) / PAS))
    voix = [  # (piste, transposition, art, se tait à)
        (presse, 0, None, 14.4),
        (basses, -12, 'staccato', 15.2),
        (basse, 0, None, 16.0),
        (celles, 12, 'staccato', 16.0),
        (celles, 0, 'staccato', 17.0),
    ]
    for j, t in enumerate(instants):
        i = (k0 + j) % 16
        for piste, tr, art, fin in voix:
            if t >= fin - 1e-6:
                continue
            h = 'K' if piste is presse else hauteur(CHAINE[i]) + tr
            s.note(piste, h, b(s, t), 0.4, vel=86 + ACC[ACCENTS[i]] // 2, art=art)
    s.expression(celles, [(0, 'f'), (b(s, 16.8), 'mp')])
    # chaque rangée qui s'éteint : la presse, puis les contrebasses, puis la basse se taisent (le
    # contacteur du film claque dessus) ; le marteau une dernière fois avec la première
    s.note(marteau, 'C4', 0, 0.25, vel=84)
    # 17,6 s : le dernier coup de la machine, puis rien
    for p, h, v, art in ((timbales, 'E2', 92, None), (basses, 'E1', 96, 'pizzicato'), (celles_t, 'E2', 80, None)):
        s.note(p, h, b(s, 17.6), 1.0, vel=v, art=art)
    s.nuance(celles_t, 'mp', b(s, 17.6))
    s.nuance(basses, 'mf', b(s, 17.6))
    s.note(tamtam, 'C4', b(s, 17.6), 3, vel=58, art='gratte')


@plan('p5_pointeuse')
def p5(s):
    """La pointeuse : le cœur, un temps par 1,08 s (la grande aiguille saute sur le troisième) ; le
    cor au loin chante la tête et pose la mèche sur la carte de ta mère (22,5 s)."""
    s.nuance(coeur, 'mp', 0)
    for k in range(5):
        t = 18.2 + k * 1.08
        s.note(coeur, 'C4', b(s, t), 0.25, vel=70 if k != 2 else 76)
        s.note(coeur, 'C4', b(s, t) + 0.3, 0.25, vel=50)
    s.note(timbales, 'E2', b(s, 20.36), 1, vel=58)
    tenue(s, basses, 'E1', 18.2, 23.6, vel=58, art='tenu')
    s.nuance(basses, 'pp', 0)
    tenue(s, sub, 'E1', 18.2, 23.6, vel=50)
    # le cor au loin : mi (21,44) si (21,98) | DO (22,52), tenu sur le plan suivant
    s.nuance(cor_solo, 'mp', 0)
    s.note(cor_solo, 'E4', b(s, 21.44), b(s, 21.98) - b(s, 21.44), vel=92)
    s.note(cor_solo, 'B4', b(s, 21.98), b(s, 22.52) - b(s, 21.98), vel=94)
    s.note(cor_solo, DO5, b(s, 22.52), b(s, 24.4) - b(s, 22.52), vel=96)
    s.expression(cor_solo, [(b(s, 22.52), 'mp'), (b(s, 23.6), 'p')])
    # dessous, ♭VI, très doux (les altos, le chœur)
    for h in ('C4', 'G3'):
        tenue(s, altos, h, 22.52, 24.0, vel=56, art='legato')
    s.expression(altos, [(b(s, 22.52), 'pp'), (b(s, 23.6), 'pp')])


@plan('p6_treillis')
def p6(s):
    """Le premier rang lâche le grillage ; la neige ; les quatre lampadaires du parking
    s'allument (24,9 · 25,75 · 26,6 · 27,45 s) : au vibraphone, de loin, la tête (mi si do) puis
    sol. Le silence d'après."""
    s.expression(cor_solo, [(0, 'p'), (b(s, 24.4), 'ppp')])
    s.expression(altos, [(0, 'pp'), (b(s, 24.0), 'ppp')])
    tenue(s, basses, 'E1', 23.6, 28.4, vel=46, art='tenu')
    s.expression(basses, [(0, 'ppp'), (b(s, 28.4), 'ppp')])
    s.nuance(vibra, 'mp', 0)
    for t, h, v in ((24.9, 'E5', 70), (25.75, 'B5', 66), (26.6, 'C6', 72), (27.45, 'G5', 60)):
        s.note(vibra, h, b(s, t), 2.5, vel=v)
    # la neige : un si très haut, à peine (les violons, sans vibrato de crescendo)
    tenue(s, violons, 'B5', 24.6, 28.6, vel=44, art='legato')
    s.expression(violons, [(b(s, 24.6), 'ppp'), (b(s, 26.6), 'pp'), (b(s, 28.6), 'ppp')])


@plan('p7_cadenas')
def p7(s):
    """La chaîne du portail ; le cadenas claque (30,0 s, le temps 3) : une timbale et la
    contrebasse, très bas, avec lui ; le gardien repart."""
    tenue(s, basses, 'E1', 28.4, 30.0, vel=50, art='tenu')
    s.nuance(basses, 'ppp', 0)
    s.note(timbales, 'E2', b(s, 30.0), 1, vel=70)
    s.note(basses, 'E1', b(s, 30.0), 1, vel=80, art='pizzicato')
    s.nuance(basses, 'p', b(s, 30.0) - 0.01)
    tenue(s, celles_t, 'E2', 30.0, 32.6, vel=56)
    s.expression(celles_t, [(b(s, 30.0), 'pp'), (b(s, 32.4), 'ppp')])
    tenue(s, sub, 'E1', 30.0, 32.4, vel=44)


@plan('p8a_crepuscule')
def p8a(s):
    """Du noir, le crépuscule : la sirène des cordes monte (celle du film est muette) ; elle
    arrive sur la mèche avec le titre (34,4 s)."""
    s.nuance(violons, 'p', 0)
    s.nuance(altos, 'p', 0)
    glisse(s, violons, 'E4', DO5, 32.9, 34.4, vel=(60, 92))
    glisse(s, altos, 'E3', DO5 - 12, 32.6, 34.4, vel=(60, 88))
    s.expression(violons, [(b(s, 32.9), 'p'), (b(s, 34.4), 'f')])
    s.expression(altos, [(b(s, 32.6), 'p'), (b(s, 34.4), 'f')])
    s.nuance(choeur, 'p', 0)
    for h in ('E3', 'B3'):
        tenue(s, choeur, h, 32.8, 34.4, vel=66)
    s.crescendo(choeur, b(s, 32.8), b(s, 34.4), 'p', 'mf')
    s.note(timbales, 'C2', b(s, 33.6), b(s, 34.4) - b(s, 33.6), vel=70)
    s.crescendo(timbales, b(s, 33.6), b(s, 34.4), 'pp', 'mp')


@plan('p8b_titre')
def p8b(s):
    """Le titre : la mèche (do) sur ♭VI, les cordes, le chœur, le cor ; à 35,6 s elle retombe sur
    la quinte (si), mi mineur ; tout s'éteint dans le noir (36,6-38,0 s)."""
    for p in (violons, altos):
        s.note(p, DO5 if p is violons else DO5 - 12, 0, b(s, 35.6), vel=94, art='legato')
    glisse(s, violons, DO5, SI4, 35.6, 36.2, vel=(92, 86))
    glisse(s, altos, DO5 - 12, SI4 - 12, 35.6, 36.2, vel=(90, 84))
    tenue(s, violons, SI4, 36.2, 38.4, vel=84, art='legato')
    tenue(s, altos, SI4 - 12, 36.2, 38.4, vel=82, art='legato')
    for p in (violons, altos):
        s.expression(p, [(0, 'f'), (b(s, 35.6), 'mf'), (b(s, 36.6), 'mp'), (b(s, 38.0), 'ppp')])
    # le chœur : do (sur ♭VI), puis si
    for h in ('C4', 'G3'):
        tenue(s, choeur, h, 34.4, 35.8, vel=78)
    for h in ('B3', 'E3'):
        tenue(s, choeur, h, 35.8, 38.4, vel=72)
    s.expression(choeur, [(0, 'mf'), (b(s, 36.6), 'mp'), (b(s, 38.0), 'ppp')])
    # le cor : la mèche, puis la quinte
    s.nuance(cors, 'mf', 0)
    tenue(s, cors, DO5, 34.4, 35.8, vel=94)
    tenue(s, cors, SI4, 35.8, 37.6, vel=86)
    s.expression(cors, [(0, 'mf'), (b(s, 36.6), 'p'), (b(s, 37.6), 'ppp')])
    # les basses : do (♭VI) puis mi
    tenue(s, basses, 'C2', 34.4, 35.8, vel=78, art='tenu')
    tenue(s, basses, 'E1', 35.8, 38.4, vel=70, art='tenu')
    s.expression(basses, [(0, 'mp'), (b(s, 36.6), 'p'), (b(s, 38.0), 'ppp')])
    tenue(s, celles_t, 'G2', 34.4, 35.8, vel=70)
    tenue(s, celles_t, 'B2', 35.8, 38.4, vel=64)
    s.expression(celles_t, [(0, 'mp'), (b(s, 38.0), 'ppp')])
    tenue(s, sub, 'C2', 34.4, 35.8, vel=50)
    tenue(s, sub, 'E1', 35.8, 38.4, vel=48)
    s.note(tamtam, 'C4', 0, 4, vel=56, art='gratte')


# --- la traîne : le corps, que le jeu boucle seulement si le film dure plus ----------------------
@theme.section('traine', mesures=3, bpm=75, reprise=False)
def traine(s):
    """Mi mineur, tenu (le médium devant, la basse à peine) ; chaque note déborde de deux temps sur le
    passage suivant : à la couture, la traîne ne respire pas."""
    for p, v in ((choeur, 'pp'), (altos, 'pp'), (violons, 'ppp'), (basses, 'ppp'), (celles_t, 'ppp')):
        s.nuance(p, v, 0)
    d = s.longueur + 2
    for h in ('E3', 'B3', 'E4'):
        s.note(choeur, h, 0, d, vel=62)
    for h in ('B3', 'E4'):
        s.note(altos, h, 0, d, vel=60, art='legato')
    s.note(violons, SI4, 0, d, vel=54, art='legato')
    s.note(celles_t, 'E3', 0, d, vel=54)
    s.note(basses, 'E1', 0, d, vel=46, art='tenu')


theme.forme(intro=ORDRE, corps=['traine'])
