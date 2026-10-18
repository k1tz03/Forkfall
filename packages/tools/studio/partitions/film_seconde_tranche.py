"""FUSIBLE — la musique du film « La seconde tranche » (livre 5, « La Maquette »), écrite sous ses
images (packages/tools/web/cinema/films/seconde_tranche.js, 36,4 s).

Juillet 1999, 23 h 10, la pluie. Une seule vitrine allumée sur le quai : la maquette des Terrasses
de la Rive sous son capot, Gégé de dos devant elle ; de tout près, l'allée, les gradins blancs, le lac
de résine, trois arbres en lichen à la place de l'Est (« Et la 14B, ils la mettent où ? ») ; la vraie
tribune sous la pluie, la 14B, la plaque de 1931 ; à minuit, le minuteur coupe la vitrine. La musique
est un chapitre de « La Maquette » (livre_h5) : la BOÎTE À MUSIQUE chante le motif en MAJEUR (le
jouet, le sourire de la vitrine : la sixte devient majeure) ; la vraie tribune lui répond en mineur,
de loin, aux cuivres bouchés ; le sourire tombe (IV → iv) au fondu qui change les arbres de lichen en
tribune ; à 33,4 s le relais claque et la boîte s'arrête net, au milieu de son air : il ne reste que
do mineur, très bas, dans le verre noir.

LE TEMPS : une section par plan (de 94,7 à 100 à la noire, autour des 96 du livre) : chaque coupe est
un premier temps ; un événement qui tombe entre deux temps est écrit à son heure (b(s, t)).

LA FEUILLE DE SYNCHRO (temps du film → section, temps ; la musique)
   0,00  le noir s'ouvre (1,4 s) : le quai, la nuit   s1 t.1     do grave, la quinte à vide (cordes pp)
   1,00  le carton « Aubérive, quai de la Rive »       s1 t.2,6   des notes de harpe, de plus en plus haut
   4,98  —                                            s1 t.9     « fu-si » de la boîte (do6 sol6)
   5,60  coupe : la vitrine, Gégé de dos               s2 m.1 t.1 « BLE » : la6 sur fa majeur (IV) ; le motif
                                                                 en majeur, le peigne en croches
  10,40  coupe : la maquette, l'allée                  s3 m.1 t.1 le peigne seul ; le célesta répond (la tête)
  13,73  le lac de résine                              s3 m.3 t.1 ♭VI : la fausse merveille (la harpe monte)
  16,00  coupe : le parc, les trois arbres             s4 m.1 t.1 la boîte se tait ; fa majeur tenu, pp
  16,40  la réplique de Gégé (→ 21,2)                  s4         presque rien : les cordes, un la de célesta
  21,40  fondu : la vraie tribune Est                  s5 t.1     IV → iv (la → la♭) : le sourire tombe
  22,00  —                                            s5 t.2     la tête au cor bouché : do sol | LA♭ (tenu)
  24,40  coupe : la 14B                                s6 t.1     le violoncelle seul : mi♭ ré | fa do
  26,80  —                                            s6 t.5     « fu-si » de la trompette bouchée
  27,40  coupe : la plaque de 1931                     s7 t.1     la montée : la♭ (♭VI) · si♭ (♭VII) · DO (I)
  31,20  du noir : le reflet, la vitrine               s8a t.1    « fu-si » de la boîte ; « BLE » à 31,83
  32,60  le titre (→ 36,0)                             s8a        sous le la6 tenu
  33,40  le relais claque : la vitrine s'éteint         s8b t.1    la boîte coupée net (le fa6 ne vient pas)
  34,00  —                                            s8b t.2    do mineur, très bas : la tribune dans le verre
  35,20  le noir commence (1,2 s)                      s8b t.4    diminuendo
  36,40  la fin du film                                s8b fin    la traîne (do mineur tenu)

L'introduction (le film entier) : 36,4 s, sonie réglée sur elle (`sonie_sur='intro'`). Le corps :
`traine`, trois mesures (12 s) de do mineur, que le jeu boucle si le film dure plus.
"""
from moteur.ecriture import *
from partitions._fusible import phrase

theme = Theme('film_seconde_tranche', 'La seconde tranche', bpm=100, mesure='4/4', tonalite='do majeur',
              graine=19990712, ville=False, boucle_min=0, moment='le film « La seconde tranche », livre 5',
              humeur="la maquette sous son capot : la boîte joue l'air en majeur, la vraie tribune attend sous la pluie")
theme.master(sonie_sur='intro')

# --- les pistes ---------------------------------------------------------------------------------
boite = theme.piste('boite', 'boite_a_musique', humain=0, salle=0.3, volume=8)
peigne = theme.piste('peigne', 'boite_a_musique', humain=0, salle=0.3, pan=0.1, volume=10)
celesta = theme.piste('celesta', humain=(3, 4), volume=10)
harpe = theme.piste('harpe', profondeur=0.6, volume=4)
violons = theme.piste('violons', legato=True, volume=0)
altos = theme.piste('altos', legato=True, volume=0)
celles = theme.piste('celles', 'violoncelles', art='tenu', pan=0.2, largeur=0.5, volume=0)
cello_solo = theme.piste('cello_solo', 'violoncelles', art='tenu', unisson=1, pan=-0.1, volume=3)
basses = theme.piste('basses', 'contrebasses', art='tenu', pan=0.08, largeur=0.4, salle=0.18, volume=0)
cors = theme.piste('cors', art='tenu', profondeur=0.7, volume=-2)
cor_sourd = theme.piste('cor_sourd', 'cors', art='sourdine', unisson=1, pan=-0.3, profondeur=0.85, salle=0.55,
                        volume=4)
tromp_sourd = theme.piste('tromp_sourd', 'trompettes', art='sourdine', unisson=1, pan=0.3, profondeur=0.85,
                          salle=0.5, volume=4)
trombones = theme.piste('trombones', art='tenu', profondeur=0.7, volume=-3)

# =====================================================================================
# Le temps : une section par plan (début, fin, tempo, mesure, nombre de mesures)
PLANS = {
    's1_quai': (0.0, 5.6, 9 * 60 / 5.6, (9, 4), 1),
    's2_vitrine': (5.6, 10.4, 100.0, (4, 4), 2),
    's3_allee': (10.4, 16.0, 9 * 60 / 5.6, (3, 4), 3),
    's4_parc': (16.0, 21.4, 100.0, (3, 4), 3),
    's5_rive': (21.4, 24.4, 100.0, (5, 4), 1),
    's6_14b': (24.4, 27.4, 100.0, (5, 4), 1),
    's7_plaque': (27.4, 31.2, 6 * 60 / 3.8, (6, 4), 1),
    's8a_reflet': (31.2, 33.4, 3.5 * 60 / 2.2, (7, 8), 1),
    's8b_noir': (33.4, 36.4, 100.0, (5, 4), 1),
}
ORDRE = list(PLANS)


def plan(nom):
    _d, _f, bpm, mes, n = PLANS[nom]
    return theme.section(nom, mesures=n, bpm=bpm, mesure=mes, reprise=False)


def b(s, t):
    """Le temps du film `t` → la position (en temps) depuis le début de la section en cours, à travers
    les sections suivantes au besoin (une note tenue par-dessus une coupe finit à l'heure)."""
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


# le matériau (le motif commun, en do : majeur pour la boîte, mineur pour la vraie tribune)
MOTIF_MAJ = phrase('motif', 'do majeur', octave=4)      # do4 sol4 | la4 ── mi4 ré4 | fa4 do4
TETE_MAJ = phrase('tete', 'do majeur', octave=4)        # do4 sol4 la4
# l'accompagnement du peigne (les lames graves de la boîte), comme dans le thème (section E)
PEIGNE = {'IV': ['F5', 'A5', 'C6', 'A5'], 'V': ['G5', 'B5', 'D6', 'B5'], 'V7': ['G5', 'B5', 'F5', 'B5'],
          'I': ['E5', 'G5', 'C6', 'G5'], 'bVI': ['Eb5', 'Ab5', 'C6', 'Ab5']}


def peigne_croches(s, t0, accords_par_temps, vel=56, duree_temps=None):
    """Le peigne en croches à partir du temps du film `t0` : un accord par temps (liste de chiffres)."""
    a0 = b(s, t0)
    for k, ch in enumerate(accords_par_temps):
        notes = PEIGNE[ch]
        s.note(peigne, notes[(2 * k) % 4], a0 + k, 0.5, vel=vel)
        s.note(peigne, notes[(2 * k + 1) % 4], a0 + k + 0.5, 0.5, vel=vel - 6)


# =====================================================================================
@plan('s1_quai')
def s1(s):
    """Le quai, la nuit, au ras de l'eau noire ; la caméra monte vers la seule vitrine allumée."""
    s.nuance(basses, 'pp', 0)
    s.nuance(altos, 'pp', 0)
    s.nuance(violons, 'pp', 0)
    tenue(s, basses, 'C2', 0.0, 5.6, vel=60)
    accord(s, altos, ['C4'], 0.6, 5.6, vel=56, art='legato')
    accord(s, violons, ['G4'], 0.6, 5.6, vel=54, art='legato')
    s.crescendo(violons, b(s, 0.6), b(s, 5.6), 'pp', 'p')
    # des lumières, de plus en plus haut (la caméra monte)
    s.nuance(harpe, 'mp', 0)
    for t, h, v in ((1.87, 'G5', 52), (3.11, 'C6', 56), (4.36, 'E6', 58)):
        s.note(harpe, h, b(s, t), 1.5, vel=v)
    # « fu-si » de la boîte : le jouet qu'on remonte
    s.nuance(boite, 'mf', 0)
    s.note(boite, 'C6', 8, 0.5, vel=88)
    s.note(boite, 'G6', 8.5, 0.5, vel=88)


@plan('s2_vitrine')
def s2(s):
    """La vitrine : Gégé de dos, la maquette sous son capot. La boîte chante le motif en majeur
    (« BLE » = la6 sur fa majeur, à la coupe) ; le peigne en croches ; les cordes, de loin."""
    s.nuance(boite, 'mf', 0)
    s.nuance(peigne, 'mf', 0)
    s.joue(boite, MOTIF_MAJ.coupe(1, MOTIF_MAJ.longueur).octave(2), a=0, vel=92)
    peigne_croches(s, 5.6, ['IV', 'IV', 'IV', 'V', 'V7', 'I', 'I', 'I'])
    for t0, t1, hs, bas in ((5.6, 7.4, ['F3', 'A3', 'C4'], 'F2'), (7.4, 8.0, ['G3', 'B3', 'D4'], 'G2'),
                            (8.0, 8.6, ['G3', 'B3', 'F4'], 'G2'), (8.6, 10.4, ['G3', 'C4', 'E4'], 'C2')):
        accord(s, altos, hs, t0, t1, vel=54, art='legato')
        tenue(s, basses, bas, t0, t1, vel=56)


@plan('s3_allee')
def s3(s):
    """La maquette de tout près : l'allée des Terrasses, les gradins blancs, les figurines ; au bout,
    le lac de résine. Le peigne tourne ; le célesta répond par la tête ; au lac, ♭VI (la fausse
    merveille), la harpe monte."""
    s.nuance(celesta, 'mf', 0)
    s.nuance(peigne, 'mf', 0)
    peigne_croches(s, 10.4, ['I', 'I', 'I', 'IV', 'IV', 'IV', 'bVI', 'bVI', 'bVI'])
    # le célesta : la tête en majeur (« fu-si » au 3ᵉ temps de la 1ʳᵉ mesure, « BLE » au 1ᵉʳ de la 2ᵉ)
    s.joue(celesta, TETE_MAJ.octave(1), a=s.m(2) - 1, vel=84)
    # ♭VI : la harpe monte (la♭ majeur), le lac s'allume
    s.nuance(harpe, 'mf', 0)
    for k, h in enumerate(['Ab4', 'C5', 'Eb5', 'Ab5', 'C6', 'Eb6']):
        s.note(harpe, h, s.m(3) + 0.25 * k, 1.5, vel=62 + 2 * k)
    for t0, t1, hs, bas in ((10.4, 12.27, ['G3', 'C4', 'E4'], 'C2'), (12.27, 14.13, ['F3', 'A3', 'C4'], 'F2'),
                            (14.13, 16.0, ['Eb3', 'Ab3', 'C4'], 'Ab1')):
        accord(s, altos, hs, t0, t1, vel=52, art='legato')
        tenue(s, basses, bas, t0, t1, vel=54)


@plan('s4_parc')
def s4(s):
    """Par-dessus la haie de lichen : le lac, les trois arbres à la place de l'Est. La réplique de
    Gégé (16,4–21,2) : presque rien, fa majeur tenu ; un la de célesta à la coupe."""
    s.nuance(celesta, 'mp', 0)
    s.note(celesta, 'A5', 0, 2, vel=70)
    s.nuance(altos, 'pp', 0)
    s.nuance(violons, 'pp', 0)
    accord(s, altos, ['F3', 'C4'], 16.0, 21.4, vel=50, art='legato')
    accord(s, violons, ['A4'], 16.0, 21.4, vel=48, art='legato')
    tenue(s, basses, 'F2', 16.0, 21.4, vel=50)
    s.expression(violons, [(0, 'pp'), (b(s, 20.4), 'pp'), (b(s, 21.4), 'p')])


@plan('s5_rive')
def s5(s):
    """Le fondu : les arbres de lichen deviennent la vraie tribune Est, sous la pluie, un seul pylône
    allumé. IV → iv : le la devient la♭ (le sourire tombe) ; puis la tête, au cor bouché, de loin :
    do sol | LA♭ tenu, sur la♭ majeur (♭VI) ; do grave, la vraie tribune."""
    s.nuance(altos, 'p', 0)
    s.nuance(violons, 'p', 0)
    accord(s, altos, ['F3', 'C4'], 21.4, 22.0, vel=56, art='legato')
    accord(s, violons, ['Ab4'], 21.4, 22.0, vel=56, art='legato')
    # « fu-si » (do sol) sur do mineur, puis « BLE » (la♭) sur la♭ majeur
    accord(s, altos, ['Eb3', 'C4'], 22.0, 22.6, vel=54, art='legato')
    accord(s, violons, ['G4'], 22.0, 22.6, vel=52, art='legato')
    accord(s, altos, ['Eb3', 'C4'], 22.6, 24.4, vel=54, art='legato')
    accord(s, violons, ['Ab4'], 22.6, 24.4, vel=52, art='legato')
    s.nuance(basses, 'p', 0)
    tenue(s, basses, 'C2', 21.4, 22.6, vel=60)
    tenue(s, basses, 'Ab1', 22.6, 24.4, vel=58)
    s.nuance(cor_sourd, 'mf', 0)
    s.note(cor_sourd, 'C4', 1, 0.5, vel=84)
    s.note(cor_sourd, 'G4', 1.5, 0.5, vel=86)
    s.note(cor_sourd, 'Ab4', 2, 3, vel=88)
    s.expression(cor_sourd, [(2, 'mf'), (5, 'mp')])


@plan('s6_14b')
def s6(s):
    """La 14B : le banc de chêne, le numéro au pochoir, la pluie dessus. Le violoncelle seul chante la
    chute du motif en mineur (mi♭ ré | fa do, sur ♭VII puis do mineur) ; « fu-si » de la trompette
    bouchée vers la plaque."""
    s.nuance(cello_solo, 'mf', 0)
    for h, a, d in (('Eb4', 0, 1), ('D4', 1, 1), ('F4', 2, 1), ('C4', 3, 2)):
        s.note(cello_solo, h, a, d, vel=86)
    accord(s, altos, ['F3', 'Bb3'], 24.4, 25.6, vel=50, art='legato')     # ♭VII à vide sous « mi♭ ré »
    accord(s, altos, ['C3', 'Eb3', 'G3'], 25.6, 27.4, vel=50, art='legato')
    tenue(s, basses, 'Bb1', 24.4, 25.6, vel=56)
    tenue(s, basses, 'C2', 25.6, 27.4, vel=56)
    s.nuance(tromp_sourd, 'mf', 0)
    s.note(tromp_sourd, 'C4', 4, 0.5, vel=84)
    s.note(tromp_sourd, 'G4', 4.5, 0.5, vel=86)


@plan('s7_plaque')
def s7(s):
    """La plaque de la grille : TERRAIN DONNÉ AUX ENFANTS DU QUARTIER · 1931 ; l'eau coule des lettres.
    La montée, une fois, à la trompette bouchée (la♭ · si♭ · DO) sur ♭VI ♭VII I, en majeur : le cadeau
    de 1931 ; les cors, doux, sous elle ; la harpe sur le do majeur."""
    s.nuance(tromp_sourd, 'mf', 0)
    for h, a, d in (('Ab4', 0, 2), ('Bb4', 2, 2), ('C5', 4, 2)):
        s.note(tromp_sourd, h, a, d, vel=90)
    s.expression(tromp_sourd, [(0, 'mf'), (4, 'f'), (6, 'mp')])
    s.nuance(cors, 'mp', 0)
    s.nuance(trombones, 'mp', 0)
    for a, hs_c, hs_t, bas in ((0, ['Eb4', 'C4'], ['Ab2', 'Eb3'], 'Ab1'), (2, ['F4', 'D4'], ['Bb2', 'F3'], 'Bb1'),
                               (4, ['E4', 'G4'], ['C3', 'G3'], 'C2')):
        for h in hs_c:
            s.note(cors, h, a, 2, vel=70)
        for h in hs_t:
            s.note(trombones, h, a, 2, vel=66)
        s.note(basses, bas, a, 2, vel=58)
    s.nuance(harpe, 'mf', 0)
    for k, h in enumerate(['C4', 'E4', 'G4', 'C5', 'E5', 'G5', 'C6']):
        s.note(harpe, h, 4 + 0.25 * k, 1.8, vel=60 + 2 * k)


@plan('s8a_reflet')
def s8a(s):
    """Du noir : devant la vitrine, la maquette allumée. La boîte reprend le motif en majeur (« fu-si »,
    « BLE » tenu sous le titre, « mi ré ») ; le peigne sur fa majeur. À 33,4 s, le relais : tout
    s'arrête (le fa6 ne viendra pas)."""
    s.nuance(boite, 'mf', 0)
    s.nuance(peigne, 'mp', 0)
    for t, h, d in ((31.2, 'C6', 31.51), (31.51, 'G6', 31.83), (31.83, 'A6', 32.77), (32.77, 'E6', 33.09),
                    (33.09, 'D6', 33.4)):
        tenue(s, boite, h, t, d, vel=88)
    a0 = b(s, 31.83)
    k = 0
    while a0 + 0.5 * k < b(s, 33.4) - 0.25:
        notes = PEIGNE['IV'] if a0 + 0.5 * k < b(s, 32.77) - 0.01 else PEIGNE['V']
        s.note(peigne, notes[k % 4], a0 + 0.5 * k, 0.5, vel=50)
        k += 1
    # « BLE » sur fa majeur (IV), « mi ré » sur sol (V)
    accord(s, altos, ['F3', 'C4'], 31.83, 32.77, vel=46, art='legato')
    accord(s, violons, ['A4'], 31.83, 32.77, vel=44, art='legato')
    accord(s, altos, ['G3', 'D4'], 32.77, 33.4, vel=46, art='legato')


@plan('s8b_noir')
def s8b(s):
    """Le relais a claqué : la vitrine est noire, il ne reste que le lac ; dans le verre, la vraie
    tribune, de l'autre côté de l'eau. Un temps de silence (le relais seul), puis do mineur, très
    bas ; le violoncelle tient le mi♭ (le sourire parti) ; le noir à 35,2 s."""
    for p, v in ((basses, 'p'), (celles, 'p'), (trombones, 'pp'), (cor_sourd, 'p'), (cello_solo, 'p')):
        s.nuance(p, v, 0)
    tenue(s, basses, 'C2', 34.0, 36.4, vel=60)
    tenue(s, celles, 'G2', 34.0, 36.4, vel=54)
    accord(s, trombones, ['C3', 'G3'], 34.0, 36.4, vel=54)
    tenue(s, cor_sourd, 'C4', 34.0, 36.4, vel=62)
    tenue(s, cello_solo, 'Eb4', 34.3, 36.4, vel=66)
    for p in (basses, celles, trombones, cor_sourd, cello_solo):
        s.expression(p, [(b(s, 34.0), 'pp'), (b(s, 34.9), 'p'), (b(s, 35.2), 'p'), (b(s, 36.4), 'ppp')])


# --- la traîne : le corps, que le jeu boucle seulement si le film dure plus ------------------------
@theme.section('traine', mesures=3, bpm=60, reprise=False)
def traine(s):
    """Do mineur tenu, très bas ; chaque note déborde de deux temps sur le passage suivant."""
    for p, v in ((basses, 'pp'), (celles, 'pp'), (altos, 'ppp'), (cor_sourd, 'pp')):
        s.nuance(p, v, 0)
    d = s.longueur + 2
    s.note(basses, 'C2', 0, d, vel=52)
    s.note(celles, 'G2', 0, d, vel=50)
    s.note(altos, 'Eb3', 0, d, vel=48, art='legato')
    s.note(cor_sourd, 'C4', 0, d, vel=54)


theme.forme(intro=ORDRE, corps=['traine'])
