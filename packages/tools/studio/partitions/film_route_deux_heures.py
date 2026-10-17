"""FUSIBLE — la musique du film « Deux heures » (livre 4, « La Route de la Rive »), écrite sous ses
images (packages/tools/web/cinema/films/route_deux_heures.js, 36,8 s).

Le premier rêve de la route : deux heures du matin, la route de la Rive, une chanson de l'été 1984
à la radio, les lampadaires qui passent sur le tableau de bord, les mains sur le volant, le virage,
le pont, et au bout du pont la lumière d'une mobylette. « Pas de réplique : la chanson tient lieu de
voix. » La musique est un chapitre de « La Route de la Rive » (livre_h4), sa section `C` : la
chanson de 1984 (le motif À L'ENVERS, en valeurs longues, sur fa#m–mi–ré–LA, dans la bande d'un
poste de voiture), et dehors la nuit : la pédale de do# (« le do# qui ramène la nuit »), la lumière
au bout du pont (un do# très haut), la guitare qui bat.

LE TEMPS : 104 à la noire, du début à la fin, sans un écart. Le film fait battre la mesure aux
doigts de la main droite (`bat = (t · 104 / 60) mod 1`, dès 7,0 s) : la chanson est sur cette grille,
temps 0 au début du film ; les plans ne tombent donc pas sur ses temps, et ce sont les passages de
la voiture à la berge qui les marquent : la radio, dedans (le poste) ou dehors (de loin, étouffée),
change de place AU MOMENT de la coupe (un fondu de 40 ms).

LA FEUILLE DE SYNCHRO (temps du film → la musique)
   0,00  le noir, le tableau de bord        mes. 1, t.1   la chanson, dans le poste (elle sort du noir)
   0,90  le carton « La route de la Rive »                 —
   2,40  la pendule : 01:59 → 02:00                        la pédale de do# entre (la nuit), à 2,40
   6,40  coupe : les mains sur le volant     (mes. 3, t.4,1) la radio, dedans
   7,00  les doigts battent la mesure        mes. 4, t.1 → chaque temps de la chanson (0,577 s)
  12,00  coupe : dehors, de la berge         (mes. 6, t.1,8) la radio passe dehors, à 12,00 ; les
                                                            lampadaires (harpe, arpège) dès le temps 21
  18,40  coupe : par le pare-brise           (mes. 8, t.4,9) la radio revient dedans, à 18,40 ; le
                                                            refrain (une octave plus haut) à 18,46
  24,40  coupe : d'en haut, le pont          (mes. 11, t.3,3) la radio dehors ; la guitare, une note
                                                            qui bat, au loin ; la lumière (do# très haut)
  30,40  coupe : sur le pont                 (mes. 14, t.2,2) la radio revient dedans… et s'éteint
                                                            jusqu'au titre
  31,25 · 31,82  —                                        la guitare : « fa# do# »…
  32,40  le titre « Deux heures »                          … « RÉ » : la mèche, sur le titre
  34,10  —                                                 elle retombe sur do# (la quinte)
  35,50  le noir commence (1,3 s)                          decrescendo
  36,80  la fin du film                                    la traîne (le corps : do#, tenu)

L'introduction (le film entier) : 36,8 s, sonie réglée sur elle (`sonie_sur='intro'`). Le corps :
`traine`, quatre mesures (9,2 s) de la pédale de do# et de la lumière.
"""
from moteur.ecriture import *
from partitions._fusible import phrase

theme = Theme('film_route_deux_heures', 'Deux heures', bpm=104, mesure='4/4', tonalite='fa# mineur', graine=1984,
              ville=False, boucle_min=0, moment='le film « Deux heures », livre 4',
              humeur='la route de nuit, une chanson de 1984 à la radio')
theme.master(sonie_sur='intro')

TON = 'fa# mineur'
RADIO_TON = 'la majeur'
theme.salle('salle', rt60=2.8)
theme.salle('echo', temps=1.0, retour=0.42, bpm=104)
# le poste de la voiture (dedans) ; la même chanson entendue de dehors, de loin, étouffée
theme.bus('radio', eq={'passe_haut': 320, 'passe_bas': 3600, 'cloches': [(1400, 3.0, 1.0)]}, sature=0.5,
          comp=(-20, 3.0, 0.005, 0.12))
theme.bus('dehors', eq={'passe_haut': 200, 'passe_bas': 1100}, sature=0.3, comp=(-22, 2.5, 0.01, 0.2),
          volume=-9)

# --- les pistes --------------------------------------------------------------------------------
guitare = theme.piste('guitare', 'guitare_claire', pan=0.18, salle=0.42, echo=0.16, volume=7.5)
violons = theme.piste('violons', art='tenu', volume=3)
altos = theme.piste('altos', art='tenu', legato=True, volume=0)
celles_t = theme.piste('celles_t', 'violoncelles', art='tenu', pan=0.25, volume=-2)
basses = theme.piste('basses', 'basses_film', volume=0)
harpe = theme.piste('harpe', pan=-0.55, echo=0.45, salle=0.3, volume=2)
arp = theme.piste('arp', 'arpege_synthe', pan=-0.55, echo=0.5, volume=-11)
sub = theme.piste('sub', 'sub_synthe', volume=-22)
R = {'salle': 0.0, 'plaque': 0.0, 'echo': 0.0, 'profondeur': 0.0}
CHANSON = {  # nom: (instrument, volume)
    'lead': ('lead_synthe', 0), 'vibra': ('vibraphone', 5), 'boite': ('boite_analogique', -9.5),
    'basse': ('basse_synthe', -6.5), 'mains': ('claps', -13),
}
DEDANS = {k: theme.piste(f'radio_{k}', inst, volume=v, bus='radio', **R) for k, (inst, v) in CHANSON.items()}
DEHORS = {k: theme.piste(f'loin_{k}', inst, volume=v, bus='dehors', **dict(R, salle=0.25))
          for k, (inst, v) in CHANSON.items()}

# =====================================================================================
# Le temps : la grille de la chanson, temps 0 au début du film ; des sections de quatre mesures
MES = 4 * 60 / 104.0
PLANS = {
    'r1': (0.0, 4 * MES, 104, '4/4', 4),
    'r2': (4 * MES, 8 * MES, 104, '4/4', 4),
    'r3': (8 * MES, 12 * MES, 104, '4/4', 4),
    'r4': (12 * MES, 15 * MES, 104, '4/4', 3),
    'r5': (15 * MES, 36.8, 104, (71, 75), 1),     # la fin du film tombe à 3,79 temps de la mesure 16
}
ORDRE = list(PLANS)


def plan(nom):
    _d, _f, bpm, mes, n = PLANS[nom]
    return theme.section(nom, mesures=n, bpm=bpm, mesure=mes, reprise=False)


def b(s, t):
    """Le temps du film `t` → la position (en temps) depuis le début de la section en cours."""
    d = PLANS[s.section.nom][0]
    return (t - d) * 104 / 60.0


# =====================================================================================
# Le matériau (celui de « La Route de la Rive »)
MOTIF = phrase('motif', TON, octave=4)             # fa#4 do#5 | ré5 ── ── la4 sol#4 | si4 fa#4 ──
RETRO = MOTIF.retrograde().augmente(2)             # la chanson de 1984 : le motif à l'envers
GRILLE = ['vi', 'V', 'IVr', 'I']                    # fa#m – mi – ré – LA
RACINES = {'vi': 'F#', 'V': 'E', 'IVr': 'D', 'I': 'A'}
# les places de la radio : dedans (le poste) aux plans 1, 2, 4, 6 ; dehors aux plans 3 et 5
COUPES = [(12.0, 'dehors'), (18.4, 'dedans'), (24.4, 'dehors'), (30.4, 'dedans')]


def chanson(s, m0, m1):
    """La chanson de 1984, mesures `m0` à `m1` de la section (comptées dans la section), dans les deux
    jeux de pistes à la fois (le poste et le dehors) ; `k` : le rang de la mesure dans le film."""
    d = PLANS[s.section.nom][0]
    k0 = int(round(d / MES))
    for m in range(m0, m1 + 1):
        k = k0 + m - 1                      # la mesure du film, à partir de 0
        ch = GRILLE[k % 4]
        r = hauteur(f'{RACINES[ch]}2')
        for P in (DEDANS, DEHORS):
            s.joue(P['basse'], seq(' '.join([f'{nom(r)} {nom(r + 12)}'] * 4), pas=0.5, vel=90), a=s.m(m))
            s.batterie(P['boite'], 'K : X . . . . . x . X . . . . . . .\nS : . . . . X . . . . . . . X . . .\n'
                                   'H : x . x . x . x . x . x . x . x .', a=s.m(m), jusqua=s.m(m + 1), vel=96)
            s.batterie(P['mains'], 'CL : . . . . X . . . . . . . X . . .', a=s.m(m), jusqua=s.m(m + 1), vel=96)


def melodie(s, motif, a, vel_lead=96, vibra=None, vel_vibra=92):
    for P in (DEDANS, DEHORS):
        s.joue(P['lead'], motif, a=a, vel=vel_lead)
        s.joue(P['vibra'], vibra if vibra is not None else motif, a=a, vel=vel_vibra)


def tremolo(s, piste, de, a, pas=0.25, prof=-8.0):
    pts = []
    t = de
    while t < a - 1e-9:
        pts.append((t, 0.0))
        pts.append((t + pas / 2, prof))
        t += pas
    pts.append((a, 0.0))
    s.automation(piste, 'volume', pts)


def tenue(s, piste, h, t0, t1, vel=70, art=None):
    s.note(piste, h, b(s, t0), b(s, t1) - b(s, t0), vel=vel, art=art)


# =====================================================================================
# Les sections

@plan('r1')
def r1(s):
    """Mesures 1-4 : le tableau de bord, puis les mains. La chanson sort du noir (dans le poste) ; à
    2,40 s, la pendule passe à deux heures : la pédale de do# entre."""
    for P in (DEDANS, DEHORS):
        for p in P.values():
            s.nuance(p, 'f', 0)
    # où est la radio : dedans ou dehors, changé à l'instant de chaque coupe (40 ms), et la chanson
    # qui sort du noir (0-1,4 s) puis s'éteint sur le pont (30,4-32,4 s)
    pts_d, pts_h = [(0.0, -30.0), (b(s, 1.4), 0.0)], [(0.0, -80.0)]
    for t, ou in COUPES:
        a, z = b(s, t - 0.02), b(s, t + 0.02)
        if ou == 'dehors':
            pts_d += [(a, 0.0), (z, -80.0)]
            pts_h += [(a, -80.0), (z, 0.0)]
        else:
            pts_d += [(a, -80.0), (z, 0.0)]
            pts_h += [(a, 0.0), (z, -80.0)]
    pts_d += [(b(s, 30.6), 0.0), (b(s, 32.4), -36.0), (b(s, 32.6), -80.0)]
    for k in CHANSON:
        s.automation(DEDANS[k], 'volume', pts_d)
        s.automation(DEHORS[k], 'volume', pts_h)
    chanson(s, 1, 4)
    melodie(s, RETRO, a=0)
    # 2,40 s : deux heures ; la nuit (la pédale de do#), jusqu'à la fin
    s.nuance(basses, 'pp', 0)
    s.nuance(celles_t, 'pp', 0)
    tenue(s, basses, 'C#2', 2.4, 36.9, vel=60, art='tenu')
    tenue(s, celles_t, 'C#3', 2.4, 36.9, vel=58)
    tenue(s, sub, 'C#2', 2.4, 36.9, vel=46)
    s.expression(basses, [(b(s, 2.4), 'ppp'), (b(s, 4.4), 'pp')])
    s.expression(celles_t, [(b(s, 2.4), 'ppp'), (b(s, 4.4), 'pp')])


@plan('r2')
def r2(s):
    """Mesures 5-8 : les mains (les doigts battent la mesure), puis dehors (12,0 s) : la radio de
    loin, et les lampadaires (la harpe et l'arpège, une note par temps) sur la route mouillée."""
    chanson(s, 1, 4)
    melodie(s, RETRO, a=0)
    # les lampadaires : du temps 21 (12,12 s) à la fin du plan, sur les accords de la chanson
    arpeges = {5: ['E4', 'G#4', 'B4', 'G#4'], 6: ['D4', 'F#4', 'A4', 'F#4'], 7: ['C#4', 'E4', 'A4', 'E4']}
    s.nuance(harpe, 'mp', 0)
    s.nuance(arp, 'p', 0)
    debut = 12.0 * 104 / 60 - 16          # le temps 20,8 du film, ici 4,8
    for i in range(int(debut) + 1, 16):    # le temps 21 du film (12,12 s) → le dernier de la mesure 8
        mes = 4 + i // 4                    # la mesure du film (0 = la première)
        h = arpeges[mes][i % 4]
        s.note(harpe, h, i, 1, vel=74)
        s.note(arp, h, i, 1, vel=64)
    # la lumière au bout du pont (do# très haut) : elle naît dehors
    s.nuance(violons, 'ppp', 0)
    tenue(s, violons, 'C#6', 12.0, 36.9, vel=56)
    s.expression(violons, [(b(s, 12.0), 'ppp'), (b(s, 16.0), 'pp'), (b(s, 18.4), 'ppp')])


@plan('r3')
def r3(s):
    """Mesures 9-12 : par le pare-brise (18,4 s), le refrain une octave plus haut, le vibraphone en
    sixtes dessous ; puis d'en haut (24,4 s) : la radio dehors, la guitare au loin, une note qui bat,
    la lumière au bout du pont."""
    chanson(s, 1, 4)
    haut = RETRO.octave(1)
    melodie(s, haut, a=0, vel_lead=100, vibra=haut.diatonique(-5, RADIO_TON), vel_vibra=88)
    s.expression(violons, [(b(s, 24.4), 'ppp'), (b(s, 26.4), 'pp')])
    # la guitare, au loin : do#5, qui bat (24,4 → 30,4 s)
    s.nuance(guitare, 'mp', 0)
    tenue(s, guitare, 'C#5', 24.4, 30.4, vel=74)
    s.expression(guitare, [(b(s, 24.4), 'pp'), (b(s, 26.0), 'mp'), (b(s, 29.6), 'mp'), (b(s, 30.4), 'pp')])
    tremolo(s, guitare, b(s, 24.4), b(s, 30.4), prof=-10.0)


@plan('r4')
def r4(s):
    """Mesures 13-15 : la fin du plan d'en haut, puis le pont (30,4 s) : la radio revient dedans et
    s'éteint jusqu'au titre ; la guitare chante la tête, « fa# do# | RÉ », la mèche sur le titre
    (32,4 s), puis retombe sur do#."""
    chanson(s, 1, 3)
    melodie(s, RETRO.coupe(0, 12), a=0)
    s.nuance(guitare, 'mp', b(s, 31.2))
    for h, t0, t1, v in (('F#4', 31.246, 31.823, 90), ('C#5', 31.823, 32.4, 92), ('D5', 32.4, 34.1, 98),
                         ('C#5', 34.1, 37.0, 88)):
        tenue(s, guitare, h, t0, t1, vel=v)
    s.expression(guitare, [(b(s, 31.2), 'mp'), (b(s, 32.4), 'mf'), (b(s, 34.1), 'mf'), (b(s, 35.5), 'mp'),
                           (b(s, 36.8), 'ppp')])
    tremolo(s, guitare, b(s, 31.246), b(s, 37.0), prof=-8.0)
    s.expression(violons, [(b(s, 30.4), 'pp'), (b(s, 32.4), 'mp'), (b(s, 35.5), 'pp'), (b(s, 36.8), 'ppp')])
    for p in (basses, celles_t):
        s.expression(p, [(b(s, 30.4), 'pp'), (b(s, 32.4), 'p'), (b(s, 35.5), 'pp'), (b(s, 36.8), 'ppp')])
    # sous la mèche, le ré : les altos le colorent (fa# – la), puis la quinte
    s.nuance(altos, 'pp', b(s, 32.4))
    for h, t0, t1 in (('F#3', 32.4, 34.1), ('A3', 32.4, 34.1), ('G#3', 34.1, 37.0), ('C#4', 34.1, 37.0)):
        tenue(s, altos, h, t0, t1, vel=58)
    s.expression(altos, [(b(s, 32.4), 'pp'), (b(s, 33.4), 'p'), (b(s, 35.5), 'pp'), (b(s, 36.8), 'ppp')])


@plan('r5')
def r5(s):
    """La fin de la mesure 16 : le noir (35,5-36,8 s)."""


# --- la traîne : le corps, que le jeu boucle seulement si le film dure plus ----------------------
@theme.section('traine', mesures=4, bpm=104, reprise=False)
def traine(s):
    """La pédale de do# et la lumière, tenues (le médium devant) ; chaque note déborde de deux temps
    sur le passage suivant : à la couture, la traîne ne respire pas."""
    for p, v in ((basses, 'ppp'), (celles_t, 'pp'), (altos, 'p'), (violons, 'pp')):
        s.nuance(p, v, 0)
    d = s.longueur + 2
    s.note(basses, 'C#2', 0, d, vel=46, art='tenu')
    s.note(celles_t, 'C#3', 0, d, vel=54)
    for h in ('G#3', 'C#4'):
        s.note(altos, h, 0, d, vel=60)
    for h in ('C#5', 'C#6'):
        s.note(violons, h, 0, d, vel=54)


theme.forme(intro=ORDRE, corps=['traine'])
