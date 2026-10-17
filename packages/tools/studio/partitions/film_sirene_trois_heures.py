"""FUSIBLE — la musique du film « Trois heures » (livre 3, « La Sirène »), écrite sous ses images
(packages/tools/web/cinema/films/sirene_trois_heures.js, 34,0 s).

Une nuit d'hiver, longtemps après la fermeture, la sirène de l'usine morte se remet à hurler : la
cité qui se réveille fenêtre par fenêtre, une voix (« Rendors-toi. L'usine est fermée. »), la sirène
dans la pluie, la grande halle au toit troué, un terrain tracé à la craie, quelqu'un couché dans le
rond central, des yeux qui s'ouvrent. La musique est un chapitre de « Seize heures » (livre_h3), sa
section `pont` (« trois heures ») : mi phrygien, une pédale, des gouttes de métal, le cœur de la
halle, la tête au cor lointain, la sirène des cordes. Mais ici la sirène du FILM hurle presque sans
arrêt (son bruit, `sons` : 1,0 · 3,6 · 6,2 · 8,8 · 11,4 · 14,0 · 17,6 · 22,0 s, chaque fois 2,6 s de
270 à 650 Hz et retour) : tant qu'elle sonne, la musique lui laisse cette bande (la pédale dessous ;
un si et un mi très hauts, le vibraphone, au-dessus : moins d'un dixième de son énergie entre 270 et
650 Hz), et ne chante qu'après sa dernière (24,7 s).

LE TEMPS : une section par plan, de six temps environ (60 à 66 à la noire : chaque plan dure un
nombre entier de temps) ; la coupe est un premier temps.

LA FEUILLE DE SYNCHRO (temps du film → section, temps ; la musique)
   0,00  le noir, la rue de la cité          s1 t.0     la pédale de mi (contrebasses, sous-basse)
   0,80  le carton « Trois heures du matin »  s1 t.0,8  un si très haut (les violons, la nuit)
   1,00  la sirène du film (puis toutes les 2,6 s jusqu'à 16,7 s)   presque rien entre 270 et 650 Hz
   6,00  coupe : les façades                 s2 t.0
   6,30  la fenêtre qui s'allume              s2 t.0,3  une note de vibraphone, au-dessus de la sirène
   7,50  la voix à la fenêtre (→ 11,3)        s2 t.1,6  presque rien
  11,60  coupe : la sirène dans la pluie      s3 t.0     les violoncelles et la timbale montent…
  16,60  coupe (au noir) : la grande halle    s4 t.0     … coupés net ; le cœur de la halle, un
                                                          temps par 0,97 s ; des gouttes de métal
  20,25  la sirène du film s'est tue          (s4 t.3,8) le chœur, très doux (♭VI)
  22,40  coupe : d'en haut, le terrain, toi   s5 t.0
  24,65  la dernière sirène s'est tue          (s5 t.2,25)
  25,40  —                                    s5 t.3     le cor au loin : « mi si »…
  26,40  —                                    s5 t.4     … « DO » : la mèche, sur le corps couché
  28,40  coupe : au ras du béton, le noir     s6a t.0    le silence
  28,75  les yeux s'entrouvrent               s6a t.0,39 un battement ; la sirène des cordes part
  29,45  ils s'ouvrent                        s6a t.1,17 un battement
  30,20  le titre « Trois heures »            s6b t.0    la mèche (do), cordes et chœur, sur la
                                                          pédale de mi : elle ne se résout pas
  32,60  le noir commence (1,4 s)              s6b t.2,4  decrescendo
  34,00  la fin du film                       s6b t.4    la traîne (le corps : mi et do, tenus)

L'introduction (le film entier) : 34,0 s, sonie réglée sur elle (`sonie_sur='intro'`). Le corps :
`traine`, trois mesures (12 s) de la pédale et de la mèche, que le jeu boucle si le film dure plus.
"""
import math

from moteur.ecriture import *
from partitions._fusible import phrase

theme = Theme('film_sirene_trois_heures', 'Trois heures', bpm=60, mesure='4/4', tonalite='mi phrygien',
              graine=300, ville=False, boucle_min=0, moment='le film « Trois heures », livre 3',
              humeur='la sirène de l\'usine morte, à trois heures du matin')
theme.master(sonie_sur='intro')

TON = 'mi phrygien'
T = Tonalite(TON)
theme.salle('salle', rt60=3.4)

# --- les pistes --------------------------------------------------------------------------------
violons = theme.piste('violons', legato=True, volume=2.5)
violons_h = theme.piste('violons_h', 'violons', legato=True, profondeur=0.85, salle=0.7, pan=0.2, volume=-3)
altos = theme.piste('altos', legato=True, volume=3)
celles_t = theme.piste('celles_t', 'violoncelles', art='tenu', pan=0.2, volume=0)
# la houle sous la sirène (le plan 3) : des violoncelles en trémolo, étouffés (sous la bande de la sirène)
houle = theme.piste('houle', 'violoncelles', art='tremolo', pan=-0.15, eq={'passe_bas': 360}, volume=0)
basses = theme.piste('basses', 'basses_film', volume=-1)
cor_solo = theme.piste('cor_solo', 'cors', unisson=1, pan=-0.4, profondeur=0.9, salle=0.7, volume=-4)
choeur = theme.piste('choeur', art='ouh', profondeur=0.8, largeur=1.2, volume=1)
vibra = theme.piste('vibra', 'vibraphone', pan=0.3, profondeur=0.8, salle=0.6, volume=6)
timbales = theme.piste('timbales', volume=-2)
timb_roul = theme.piste('timb_roul', 'timbales', art='roulement', volume=-3)
coeur = theme.piste('coeur', 'grosse_caisse', profondeur=0.6, salle=0.45, volume=0)
gouttes = theme.piste('gouttes', 'enclume', profondeur=0.9, salle=0.8, pan=0.3,
                      eq={'passe_haut': 500, 'passe_bas': 3500}, volume=-3)
basse = theme.piste('basse', 'basse_synthe', sature=0.6, volume=-14)      # la reese de la halle
sub = theme.piste('sub', 'sub_synthe', volume=-25)

# =====================================================================================
# Le temps : une section par plan (début, fin, tempo, mesure : une mesure par section)
PLANS = {
    's1_cite': (0.0, 6.0, 60, (6, 4)),
    's2_facades': (6.0, 11.6, 450 / 7, (6, 4)),
    's3_sirene': (11.6, 16.6, 60, (5, 4)),
    's4_halle': (16.6, 22.4, 1800 / 29, (6, 4)),
    's5_terrain': (22.4, 28.4, 60, (6, 4)),
    's6a_yeux': (28.4, 30.2, 200 / 3, (2, 4)),
    's6b_titre': (30.2, 34.0, 1200 / 19, (4, 4)),
}
ORDRE = list(PLANS)


def plan(nom):
    _d, _f, bpm, mes = PLANS[nom]
    return theme.section(nom, mesures=1, bpm=bpm, mesure=mes, reprise=False)


def b(s, t):
    """Le temps du film `t` → la position (en temps) depuis le début de la section en cours, à
    travers les sections suivantes au besoin (une note tenue par-dessus une coupe finit à l'heure)."""
    pos = 0.0
    suite = ORDRE[ORDRE.index(s.section.nom):]
    for nom in suite:
        d, f, bpm, _m = PLANS[nom]
        if t <= f + 1e-9 or nom == suite[-1]:
            return pos + (t - d) * bpm / 60.0
        pos += (f - d) * bpm / 60.0


def tenue(s, piste, h, t0, t1, vel=70, art=None):
    s.note(piste, h, b(s, t0), b(s, t1) - b(s, t0), vel=vel, art=art)


def glisse(s, piste, h0, h1, t0, t1, pas=0.25, vel=(66, 94), art='legato'):
    """Un glissando de cordes (micro-pas d'un quart de ton) de `h0` à `h1`, de `t0` à `t1` (temps
    du film), sur la courbe d'une sirène."""
    h0, h1 = hauteur(h0), hauteur(h1)
    n = max(2, int(round(abs(h1 - h0) / pas)))
    q = 1 - math.exp(-3.0)

    def instant(p):
        return -math.log(1 - p * q) / 3.0

    for k in range(n):
        p0, p1 = k / n, (k + 1) / n
        a, z = t0 + (t1 - t0) * instant(p0), t0 + (t1 - t0) * instant(p1)
        s.note(piste, h0 + (h1 - h0) * p0, b(s, a), max(0.02, b(s, z) - b(s, a)),
               vel=vel[0] + (vel[1] - vel[0]) * p0, art=art)


DO5 = T.degre(6, 4)


# =====================================================================================
# Les plans

@plan('s1_cite')
def s1(s):
    """La rue de la cité, la nuit, la pluie ; la sirène du film se lève (1,0 s) : la pédale en bas,
    un si très haut avec le carton (0,8 s), des gouttes."""
    s.nuance(basses, 'ppp', 0)
    tenue(s, basses, 'E1', 0.0, 11.6, vel=60, art='tremolo')
    s.expression(basses, [(0, 'ppp'), (b(s, 3.0), 'pp')])
    tenue(s, sub, 'E1', 0.0, 16.6, vel=52)
    s.nuance(violons_h, 'pp', 0)
    tenue(s, violons_h, 'B5', 0.8, 7.4, vel=66)
    s.expression(violons_h, [(b(s, 0.8), 'pp'), (b(s, 3.0), 'p'), (b(s, 7.4), 'pp')])
    for t, v in ((2.2, 44), (3.9, 50), (5.3, 40)):
        s.note(gouttes, 'C4', b(s, t), 0.25, vel=v)


@plan('s2_facades')
def s2(s):
    """Les façades : la fenêtre qui s'allume (6,3 s), une note de vibraphone au-dessus de la
    sirène ; la voix à la fenêtre (7,5-11,3 s) : presque rien."""
    s.nuance(vibra, 'p', 0)
    s.note(vibra, 'G5', b(s, 6.3), 2, vel=62)
    s.note(vibra, 'E6', b(s, 6.32), 2, vel=48)
    for t, v in ((6.9, 46), (9.6, 40), (11.0, 48)):
        s.note(gouttes, 'C4', b(s, t), 0.25, vel=v)
    tenue(s, violons_h, 'E6', 8.0, 11.6, vel=62)
    s.expression(violons_h, [(b(s, 8.0), 'pp'), (b(s, 10.0), 'p'), (b(s, 11.6), 'pp')])


@plan('s3_sirene')
def s3(s):
    """La sirène dans la pluie, en haut de sa tour ; personne : les violoncelles, les contrebasses et
    la timbale montent sous elle, et sont coupés net par le noir (16,6 s)."""
    s.nuance(houle, 'pp', 0)
    tenue(s, houle, 'E2', 11.6, 16.6, vel=72)
    s.crescendo(houle, 0, b(s, 16.6), 'pp', 'mp')
    tenue(s, basses, 'E1', 11.6, 16.6, vel=70, art='tremolo')
    s.crescendo(basses, 0, b(s, 16.6), 'pp', 'mp')
    s.note(timb_roul, 'E2', b(s, 13.0), b(s, 16.6) - b(s, 13.0), vel=84)
    s.crescendo(timb_roul, b(s, 13.0), b(s, 16.6), 'ppp', 'mp')
    for p in (houle, basses, timb_roul):
        s.expression(p, [(b(s, 16.55), 'mp'), (b(s, 16.6), 0.0)])


@plan('s4_halle')
def s4(s):
    """La grande halle au toit troué : le cœur, un temps par 0,97 s ; la reese ; des gouttes de
    métal dans le faisceau ; quand la sirène du film s'est tue (20,25 s), le chœur, très doux."""
    for p in (basses, timb_roul):
        s.nuance(p, 'pp', b(s, 16.6) + 0.01)
    s.nuance(coeur, 'mp', 0)
    for k in range(6):
        t = 16.6 + k * 5.8 / 6
        s.note(coeur, 'C4', b(s, t), 0.25, vel=64 if k else 72)
        s.note(coeur, 'C4', b(s, t) + 0.3, 0.25, vel=44)
    s.nuance(basse, 'pp', 0)
    tenue(s, basse, 'E1', 16.6, 28.4, vel=60)
    s.expression(basse, [(0, 'ppp'), (b(s, 18.6), 'pp'), (b(s, 27.0), 'pp'), (b(s, 28.4), 0.0)])
    tenue(s, basses, 'E1', 16.6, 28.4, vel=56, art='tenu')
    for t, v in ((17.1, 52), (18.3, 44), (19.4, 56), (20.9, 48), (21.8, 42)):
        s.note(gouttes, 'C4', b(s, t), 0.25, vel=v)
    # le chœur, quand la sirène s'est tue : ♭VI (do sol) puis il tient sur le plan suivant
    s.nuance(choeur, 'ppp', 0)
    for h in ('C3', 'G3'):
        tenue(s, choeur, h, 20.5, 28.0, vel=60)
    s.expression(choeur, [(b(s, 20.5), 'ppp'), (b(s, 22.4), 'pp')])


@plan('s5_terrain')
def s5(s):
    """D'en haut : le terrain à la craie, le rond central, toi. La dernière sirène du film se tait
    (24,65 s) : le cor au loin chante la tête, « mi si | DO », la mèche sur le corps couché."""
    s.expression(choeur, [(0, 'pp'), (b(s, 26.4), 'p'), (b(s, 28.0), 'ppp')])
    s.nuance(cor_solo, 'mf', 0)
    s.note(cor_solo, 'E4', b(s, 25.4), b(s, 25.9) - b(s, 25.4), vel=92)
    s.note(cor_solo, 'B4', b(s, 25.9), b(s, 26.4) - b(s, 25.9), vel=94)
    s.note(cor_solo, DO5, b(s, 26.4), b(s, 28.3) - b(s, 26.4), vel=96)
    s.expression(cor_solo, [(b(s, 26.4), 'mf'), (b(s, 27.6), 'mp'), (b(s, 28.3), 'pp')])
    for t, v in ((23.1, 46), (24.2, 40), (27.3, 44)):
        s.note(gouttes, 'C4', b(s, t), 0.25, vel=v)
    s.nuance(coeur, 'p', 0)
    for t in (22.4, 23.4, 24.4, 25.4):
        s.note(coeur, 'C4', b(s, t), 0.25, vel=56)
        s.note(coeur, 'C4', b(s, t) + 0.3, 0.25, vel=38)


@plan('s6a_yeux')
def s6a(s):
    """Au ras du béton : le noir, puis des yeux qui s'entrouvrent (28,75 s), se ferment, s'ouvrent
    (29,45 s) : un battement à chaque fois ; la sirène des cordes part du grave et monte vers le
    titre."""
    s.nuance(coeur, 'mp', 0)
    for t in (28.75, 29.45):
        s.note(coeur, 'C4', b(s, t), 0.25, vel=74)
        s.note(coeur, 'C4', b(s, t) + 0.3, 0.25, vel=50)
    s.nuance(violons, 'p', 0)
    s.nuance(altos, 'p', 0)
    glisse(s, altos, 'E3', DO5 - 12, 28.75, 30.2, vel=(58, 90))
    glisse(s, violons, 'E4', DO5, 29.2, 30.2, vel=(60, 94))
    s.expression(altos, [(b(s, 28.75), 'pp'), (b(s, 30.2), 'f')])
    s.expression(violons, [(b(s, 29.2), 'p'), (b(s, 30.2), 'f')])
    tenue(s, basses, 'E1', 28.75, 34.4, vel=64, art='tremolo')
    s.expression(basses, [(b(s, 28.75), 'pp'), (b(s, 30.2), 'mp')])
    tenue(s, sub, 'E1', 28.75, 34.4, vel=52)


@plan('s6b_titre')
def s6b(s):
    """Le titre : la mèche (do) aux cordes et au chœur, sur la pédale de mi ; elle ne se résout pas ;
    tout s'éteint dans le noir (32,6-34,0 s)."""
    tenue(s, violons, DO5, 30.2, 34.4, vel=92, art='legato')
    tenue(s, altos, DO5 - 12, 30.2, 34.4, vel=88, art='legato')
    for p in (violons, altos):
        s.expression(p, [(0, 'f'), (b(s, 31.4), 'mf'), (b(s, 32.6), 'mp'), (b(s, 34.0), 'ppp')])
    s.nuance(choeur, 'mf', 0)
    for h in ('E3', 'C4'):
        tenue(s, choeur, h, 30.2, 34.4, vel=72)
    s.expression(choeur, [(0, 'mf'), (b(s, 32.6), 'mp'), (b(s, 34.0), 'ppp')])
    tenue(s, celles_t, 'E2', 30.2, 34.4, vel=70)
    s.expression(celles_t, [(0, 'mp'), (b(s, 34.0), 'ppp')])
    s.expression(basses, [(0, 'mp'), (b(s, 32.6), 'p'), (b(s, 34.0), 'ppp')])


# --- la traîne : le corps, que le jeu boucle seulement si le film dure plus ----------------------
@theme.section('traine', mesures=3, bpm=60, reprise=False)
def traine(s):
    """La pédale et la mèche, tenues (le médium devant) ; chaque note déborde de deux temps sur le
    passage suivant : à la couture, la traîne ne respire pas."""
    for p, v in ((choeur, 'pp'), (violons, 'ppp'), (altos, 'ppp'), (celles_t, 'ppp'), (basses, 'ppp')):
        s.nuance(p, v, 0)
    d = s.longueur + 2
    for h in ('E3', 'C4', 'E4'):
        s.note(choeur, h, 0, d, vel=60)
    s.note(violons, DO5, 0, d, vel=56, art='legato')
    s.note(altos, 'E4', 0, d, vel=56, art='legato')
    s.note(celles_t, 'E3', 0, d, vel=54)
    s.note(basses, 'E1', 0, d, vel=46, art='tenu')


theme.forme(intro=ORDRE, corps=['traine'])
