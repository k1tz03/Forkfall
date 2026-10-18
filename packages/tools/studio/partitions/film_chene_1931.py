"""FUSIBLE — la musique du film « Chêne de 1931 » (livre 5, « La Maquette »), écrite sous ses images
(packages/tools/web/cinema/films/chene_1931.js, 36,8 s).

La nuit du 27 novembre 1999 : la tribune Est brûle d'un bloc sous la pluie, chêne de 1931. Les
pompiers arrosent la Nord (« L'Est, on la laisse. Toutes les lances sur la Nord. »), Gégé tient sa
lance et tourne la tête vers l'Est, la 14B brûle, le toit tombe à 3 h 40 ; de l'autre rive, la
Rive brûle en reflets ; dans la vitrine de l'agence, la maquette, et dans le verre la vraie tribune
qui brûle. La musique est un chapitre de « La Maquette » (livre_h5), ses sections F et G : la mèche
(la♭, ♭6, tenue aux cors : il ne lâche pas), la marche funèbre en do mineur qui se prépare (les
timbales do–sol, le tambour voilé), l'ARC quand le toit tombe — la mèche saute — et la marche des
cendres, creuse et immense ; puis, à la vitrine, la BOÎTE À MUSIQUE seule, en mineur, dont les notes
s'espacent. Le feu du film a ses bruits : les sirènes (0,5 et 3,3 s) gardent le médium pour elles, le
coup sourd du toit (22,2 s) tombe sur une marche déjà lancée ; sous la réplique, la pédale seule.

LE TEMPS : une section par plan (le toit est coupé en deux à l'instant où il tombe) ; chaque coupe est
un premier temps ; la marche à 120 (le poum toutes les secondes), plus lente sur l'autre rive (96).

LA FEUILLE DE SYNCHRO (temps du film → section, temps ; la musique)
   0,00  le noir s'ouvre (1,2 s) : l'Est brûle       s1 t.1     do grave (contrebasses en trémolo), le
                                                                 tam-tam frotté, un roulement pp
   0,50  la sirène du film (puis 3,3 s)              s1 t.1,5   le médium libre
   6,20  coupe : la Nord, les pompiers               s2 t.1     la pédale seule ; la RÉPLIQUE 6,8–11,6
  12,00  coupe : Gégé, de profil                     s3 t.1     « fu-si » aux cors (do sol)…
  12,63  —                                          s3 t.2     … « BLE » : la♭, tenu jusqu'à la coupe
  16,40  coupe : la 14B                              s4 m.1 t.1 la♭ → sol (♭6 → 5) ; les timbales do–sol,
                                                                 le tambour voilé, les pizzicati
  20,40  coupe : le toit                             s5a t.1    le roulement, la cymbale qui enfle
  21,60  LE TOIT TOMBE                               s5b m.1 t.1 l'ARC, la cymbale, les timbales : « BLE »
                                                                 (♭VI) ; la marche des cendres, le motif
                                                                 aux cors
  22,20  le coup sourd du toit (le film)             s5b m.1 t.2,2 sous la marche
  25,60  coupe : l'autre rive, la Rive rouge         s6 m.1 t.1 la marche au loin (96) ; la tête élargie
  30,60  coupe : la vitrine, la maquette             s7a t.1    la boîte seule, en mineur : « fu-si »…
  33,60  le titre (→ 36,4)                           s7b t.1    … « ré » ; do mineur très bas
  35,60  le noir commence (1,2 s)                    s7b ~t.4   la boîte finit son air, de plus en plus lente
  36,80  la fin du film                              s7b fin    la traîne (do mineur tenu)

L'introduction (le film entier) : 36,8 s, sonie réglée sur elle (`sonie_sur='intro'`). Le corps :
`traine`, trois mesures (12 s) de do mineur, que le jeu boucle si le film dure plus.
"""
from moteur.ecriture import *
from partitions._fusible import phrase, Arc

theme = Theme('film_chene_1931', 'Chêne de 1931', bpm=120, mesure='4/4', tonalite='do majeur',
              graine=19991127, ville=False, boucle_min=0, moment='le film « Chêne de 1931 », livre 5',
              humeur='la tribune de 1931 brûle d\'un bloc ; dans la vitrine, la maquette')
theme.master(sonie_sur='intro')

arc = Arc(theme, impact_volume=-9.0)        # l'impact sur do1 : plus bas que dans le thème principal

# --- les pistes ---------------------------------------------------------------------------------
cors = theme.piste('cors', art='tenu', humain=(4, 5), volume=3.5)
trombones = theme.piste('trombones', art='tenu', humain=(4, 5), volume=2)
tromb_st = theme.piste('tromb_st', 'trombones', art='staccato', bref=0.15, humain=(4, 5), volume=2)
tuba = theme.piste('tuba', art='staccato', bref=0.25, pan=0.12, largeur=0.4, salle=0.22, volume=5)
violons = theme.piste('violons', art='tremolo', volume=0)
altos = theme.piste('altos', art='tenu', volume=0)
celles = theme.piste('celles', 'violoncelles', art='tenu', pan=0.2, largeur=0.5, volume=2)
basses = theme.piste('basses', 'contrebasses', art='tremolo', pan=0.08, largeur=0.4, salle=0.18, volume=2)
pizz_b = theme.piste('pizz_b', 'contrebasses', art='pizzicato', pan=0.08, largeur=0.4, salle=0.18, volume=9)
timbales = theme.piste('timbales', largeur=0.5, volume=5)
timb_roul = theme.piste('timb_roul', 'timbales', art='roulement', largeur=0.5, volume=6)
caisse_voilee = theme.piste('caisse_voilee', 'caisse_claire', art='timbre_off', humain=(2, 4), volume=0)
caisse_roul = theme.piste('caisse_roul', 'caisse_claire', art='roulement', volume=4)
gcaisse = theme.piste('gcaisse', 'grosse_caisse', humain=(2, 4), largeur=0.4, volume=0.5)
cymbales = theme.piste('cymbales', volume=3)
suspendue = theme.piste('suspendue', 'cymbale_suspendue', volume=-8)
tamtam = theme.piste('tam_tam', volume=4)
boite = theme.piste('boite', 'boite_a_musique', humain=0, salle=0.35, volume=8)

# =====================================================================================
# Le temps : une section par plan (début, fin, tempo, mesure, nombre de mesures)
PLANS = {
    's1_feu': (0.0, 6.2, 6 * 60 / 6.2, (6, 4), 1),
    's2_nord': (6.2, 12.0, 6 * 60 / 5.8, (6, 4), 1),
    's3_gege': (12.0, 16.4, 7 * 60 / 4.4, (7, 4), 1),
    's4_14b': (16.4, 20.4, 120.0, (4, 4), 2),
    's5a_toit': (20.4, 21.6, 100.0, (2, 4), 1),
    's5b_cendres': (21.6, 25.6, 120.0, (4, 4), 2),
    's6_rive': (25.6, 30.6, 96.0, (4, 4), 2),
    's7a_vitrine': (30.6, 33.6, 100.0, (5, 4), 1),
    's7b_titre': (33.6, 36.8, 5 * 60 / 3.2, (5, 4), 1),
}
ORDRE = list(PLANS)


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


MOTIF = phrase('motif', 'do mineur', octave=4)          # do4 sol4 | la♭4 ── mi♭4 ré4 | fa4 do4
LARGE = MOTIF.augmente(2)
VOILEE = 'S : X . . . x . . . X . . x x . . .'          # le tambour voilé de la marche funèbre


# =====================================================================================
@plan('s1_feu')
def s1(s):
    """L'Est brûle d'un bloc, au ras de la pelouse trempée ; les sirènes du premier camion. Do grave,
    le tam-tam frotté, un roulement de timbales pp : le médium reste aux sirènes."""
    s.nuance(basses, 'p', 0)
    tenue(s, basses, 'C2', 0.0, 12.0, vel=62)
    s.expression(basses, [(0, 'pp'), (b(s, 2.0), 'p'), (b(s, 12.0), 'p')])
    s.nuance(tamtam, 'p', 0)
    s.note(tamtam, 'C4', b(s, 0.3), 6, vel=66, art='gratte')
    s.note(timb_roul, 'C2', b(s, 1.0), b(s, 6.2) - b(s, 1.0), vel=60)
    s.expression(timb_roul, [(b(s, 1.0), 'ppp'), (b(s, 4.5), 'pp'), (b(s, 6.2), 'ppp')])
    # très haut, au-dessus des sirènes : la tribune qui chante encore (la quinte, les violons)
    s.nuance(violons, 'pp', 0)
    tenue(s, violons, 'G5', 2.4, 6.2, vel=50)


@plan('s2_nord')
def s2(s):
    """La Nord : les pompiers de dos, trois lances, les gyrophares. La réplique du lieutenant (6,8–11,6)
    : la pédale seule (do, les contrebasses), un battement de timbale au début et à la fin."""
    s.nuance(timbales, 'pp', 0)
    s.note(timbales, 'C2', 0, 1, vel=58)
    s.note(timbales, 'C2', b(s, 11.7), 1, vel=56)
    s.nuance(celles, 'pp', 0)
    tenue(s, celles, 'G2', 6.2, 12.0, vel=50)


@plan('s3_gege')
def s3(s):
    """Gégé, de profil contre le feu, la lance à deux mains vers la Nord ; il tourne la tête vers l'Est,
    et ne lâche pas. Les cors : « fu-si-BLE », la mèche (la♭) tenue jusqu'à la coupe, sur la♭ majeur
    (♭VI) ; les cordes montent sous elle."""
    s.nuance(cors, 'f', 0)
    s.note(cors, 'C4', 0, 0.5, vel=96)
    s.note(cors, 'G4', 0.5, 0.5, vel=98)
    s.note(cors, 'Ab4', 1, b(s, 16.4) - 1, vel=100)
    s.expression(cors, [(1, 'f'), (b(s, 14.6), 'mf'), (b(s, 16.3), 'f')])
    s.nuance(trombones, 'mp', 0)
    accord(s, trombones, ['Ab2', 'Eb3'], 12.63, 16.4, vel=72)
    s.nuance(altos, 'p', 0)
    accord(s, altos, ['Eb3', 'C4'], 12.63, 16.4, vel=66)
    s.crescendo(altos, b(s, 12.63), b(s, 16.4), 'p', 'mf')
    s.nuance(basses, 'p', 0)
    tenue(s, basses, 'Ab1', 12.63, 16.4, vel=64)


@plan('s4_14b')
def s4(s):
    """La 14B : le banc de chêne, le numéro au pochoir ; les flammes montent du rang A. La mèche
    retombe sur la quinte (la♭ → sol) : do mineur. La marche funèbre se prépare (les timbales do–sol,
    le tambour voilé qui monte, les pizzicati au poum)."""
    s.nuance(cors, 'mf', 0)
    s.note(cors, 'G4', 0, 4, vel=88)
    s.expression(cors, [(0, 'mf'), (4, 'p')])
    s.nuance(altos, 'mp', 0)
    accord(s, altos, ['Eb3', 'G3', 'C4'], 16.4, 20.4, vel=60)
    s.nuance(timbales, 'mf', 0)
    s.nuance(pizz_b, 'mf', 0)
    for m in (1, 2):
        s.note(timbales, 'C2', s.m(m), 1, vel=80 + 8 * (m - 1))
        s.note(timbales, 'G2', s.m(m, 3), 1, vel=74 + 8 * (m - 1))
        s.note(pizz_b, 'C2', s.m(m), 1, vel=84)
        s.note(pizz_b, 'G1', s.m(m, 3), 1, vel=78)
    s.nuance(caisse_voilee, 'p', 0)
    s.batterie(caisse_voilee, VOILEE, a=0, jusqua=s.m(3), vel=80)
    s.crescendo(caisse_voilee, 0, s.m(3), 'p', 'mf')
    s.nuance(basses, 'p', 0)
    tenue(s, basses, 'C2', 16.4, 21.6, vel=66)


@plan('s5a_toit')
def s5a(s):
    """Le toit, de haut : il craque. Le roulement de caisse claire et la cymbale qui enfle jusqu'à
    l'instant où il tombe."""
    s.note(caisse_roul, 'S', 0, 2, vel=88)
    s.expression(caisse_roul, [(0, 'pp'), (2, 'f')])
    s.note(suspendue, 'C4', 0, 2, vel=96, art='monte_2s')
    s.note(timb_roul, 'G2', 0, 2, vel=80)
    s.expression(timb_roul, [(0, 'p'), (2, 'f')])


@plan('s5b_cendres')
def s5b(s):
    """Le toit tombe (21,6 s) : l'ARC, la cymbale, les timbales, tout le monde sur « BLE » (♭VI) ; la
    marche des cendres, en do mineur, creuse et immense : le motif aux cors (habit épique), le poum
    du tuba et des contrebasses, le « pa » des trombones, le tambour voilé."""
    arc.poser(s, 0, impact=True, vel=124)
    s.note(cymbales, 'C4', 0, 2, vel=116)
    s.nuance(timbales, 'f', 0)
    s.note(timbales, 'Ab2', 0, 1, vel=112)
    s.note(gcaisse, 'C4', 0, 1, vel=110)
    s.nuance(cors, 'f', 0)
    s.joue(cors, MOTIF.coupe(1, MOTIF.longueur), a=0, vel=106)
    s.nuance(trombones, 'f', 0)
    s.joue(trombones, MOTIF.coupe(1, MOTIF.longueur).octave(-1), a=0, vel=100)
    # les accords, temps par temps : ♭VI ♭VI ♭VI ♭VII5 | i5 i i i
    temps = ['Ab', 'Ab', 'Ab', 'Bb5', 'C5', 'Cm', 'Cm', 'Cm']
    basse = {'Ab': 'Ab1', 'Bb5': 'Bb1', 'C5': 'C2', 'Cm': 'C2'}
    quinte = {'Ab': 'Eb2', 'Bb5': 'F2', 'C5': 'G1', 'Cm': 'G1'}
    pa = {'Ab': ['Eb3', 'Ab3', 'C4'], 'Bb5': ['F3', 'Bb3'], 'C5': ['G3', 'C4'], 'Cm': ['Eb3', 'G3', 'C4']}
    s.nuance(tuba, 'f', 0)
    s.nuance(tromb_st, 'mf', 0)
    for k, ch in enumerate(temps):
        if k % 2 == 0:
            s.note(tuba, basse[ch] if k % 4 == 0 else quinte[ch], k, 1, vel=96)
            s.note(pizz_b, basse[ch] if k % 4 == 0 else quinte[ch], k, 1, vel=86)
        else:
            for h in pa[ch]:
                s.note(tromb_st, h, k, 0.5, vel=78)
    s.note(timbales, 'Eb2', s.m(1, 3), 1, vel=84)     # sous ♭VI : la quinte de la♭
    s.note(timbales, 'C2', s.m(2), 1, vel=88)
    s.note(timbales, 'G2', s.m(2, 3), 1, vel=84)
    s.nuance(caisse_voilee, 'mf', 0)
    s.batterie(caisse_voilee, VOILEE, a=0, jusqua=s.m(3), vel=90)
    for m in (1, 2):
        s.note(gcaisse, 'C4', s.m(m, 3), 1, vel=86)
    s.note(gcaisse, 'C4', s.m(2), 1, vel=92)
    s.nuance(altos, 'mf', 0)
    s.nuance(violons, 'mp', 0)
    accord(s, altos, ['Eb3', 'C4'], 21.6, 23.1, vel=70)
    accord(s, altos, ['F3', 'Bb3'], 23.1, 23.6, vel=68)
    accord(s, altos, ['Eb3', 'G3', 'C4'], 23.6, 25.6, vel=68)
    accord(s, violons, ['C5', 'Eb5'], 21.6, 23.1, vel=62)
    accord(s, violons, ['Eb5', 'G5'], 23.6, 25.6, vel=60)
    s.nuance(basses, 'mf', 0)
    tenue(s, basses, 'C2', 21.6, 25.6, vel=70)


@plan('s6_rive')
def s6(s):
    """L'autre rive : le feu derrière le dos de l'Est, la Rive qui brûle en reflets. La marche s'en
    va (96) : la tête élargie aux cors, do sol | LA♭ tenu (i → ♭VI) ; le poum plus loin ; les violons
    en trémolo, les reflets."""
    s.nuance(cors, 'mf', 0)
    s.note(cors, 'C4', 0, 1, vel=96)
    s.note(cors, 'G4', 1, 1, vel=98)
    s.note(cors, 'Ab4', 2, 6, vel=100)
    s.expression(cors, [(2, 'mf'), (5, 'f'), (8, 'mp')])
    s.nuance(trombones, 'mp', 0)
    accord(s, trombones, ['C3', 'G3'], 25.6, 26.85, vel=70)
    accord(s, trombones, ['Ab2', 'Eb3'], 26.85, 30.6, vel=70)
    s.nuance(tuba, 'mp', 0)
    for k, h in ((0, 'C2'), (2, 'Ab1'), (4, 'Eb2'), (6, 'Ab1')):
        s.note(tuba, h, k, 1, vel=84)
    s.nuance(violons, 'p', 0)
    accord(s, violons, ['C5', 'G5'], 25.6, 26.85, vel=58)
    accord(s, violons, ['C5', 'Eb5'], 26.85, 30.6, vel=58)
    s.expression(violons, [(0, 'p'), (4, 'mp'), (8, 'pp')])
    s.nuance(caisse_voilee, 'p', 0)
    s.batterie(caisse_voilee, 'S : X . . . . . . . X . . . . . . .', a=0, jusqua=s.m(2), vel=70)
    s.nuance(basses, 'p', 0)
    tenue(s, basses, 'C2', 25.6, 26.85, vel=62)
    tenue(s, basses, 'Ab1', 26.85, 30.6, vel=60)
    s.diminuendo(basses, b(s, 28.0), b(s, 30.6), 'p', 'pp')


@plan('s7a_vitrine')
def s7a(s):
    """La vitrine : l'enseigne, l'agence, la vitrine éteinte depuis minuit ; seul le lac de résine luit,
    et la lueur du feu rougit les petits immeubles blancs. La boîte seule, en mineur : « fu-si-BLE »
    (do sol la♭), puis « mi♭ » — ses notes s'espacent : le ressort se détend."""
    s.nuance(boite, 'mf', 0)
    s.note(boite, 'C6', 0, 0.5, vel=92)
    s.note(boite, 'G6', 0.5, 0.5, vel=92)
    s.note(boite, 'Ab6', 1, 2.5, vel=94)
    s.note(boite, 'Eb6', 3.5, 1.5, vel=86)
    # dessous, l'habit du motif : do | la♭ (♭VI) sous « BLE » | si♭ à vide (♭VII) sous « mi♭ ré » | do
    s.nuance(basses, 'pp', 0)
    tenue(s, basses, 'C2', 30.6, 31.2, vel=54)
    tenue(s, basses, 'Ab1', 31.2, 32.7, vel=54)
    tenue(s, basses, 'Bb1', 32.7, 34.75, vel=52)
    tenue(s, basses, 'C2', 34.75, 36.8, vel=52)
    s.nuance(celles, 'pp', 0)
    tenue(s, celles, 'Eb3', 31.2, 32.7, vel=50)
    tenue(s, celles, 'F2', 32.7, 34.75, vel=48)
    tenue(s, celles, 'G2', 34.75, 36.8, vel=48)


@plan('s7b_titre')
def s7b(s):
    """Le titre : « ré » (33,6 s), puis « fa » de plus en plus tard ; le dernier « do » tombe dans le
    noir (35,6–36,8 s). Do mineur très bas dessous ; dans la vitre, la vraie tribune brûle."""
    s.nuance(boite, 'mf', 0)
    s.note(boite, 'D6', 0, 1.6, vel=84)
    s.note(boite, 'F6', b(s, 34.75), 1.6, vel=78)
    s.note(boite, 'C6', b(s, 36.05), 1.5, vel=70)
    s.nuance(altos, 'pp', 0)
    accord(s, altos, ['F3', 'Bb3'], 33.6, 34.75, vel=48)       # « ré » sur si♭ à vide
    accord(s, altos, ['G3', 'C4'], 34.75, 36.05, vel=46)       # « fa » sur la quinte à vide
    accord(s, altos, ['Eb3', 'C4'], 36.05, 36.8, vel=44)       # « do » : do mineur
    for p in (basses, celles, altos):
        s.expression(p, [(0, 'pp'), (b(s, 35.6), 'pp'), (b(s, 36.8), 'ppp')])


# --- la traîne : le corps, que le jeu boucle seulement si le film dure plus ------------------------
@theme.section('traine', mesures=3, bpm=60, reprise=False)
def traine(s):
    """Do mineur tenu, très bas ; chaque note déborde de deux temps sur le passage suivant."""
    for p, v in ((basses, 'pp'), (celles, 'pp'), (altos, 'ppp')):
        s.nuance(p, v, 0)
    d = s.longueur + 2
    s.note(basses, 'C2', 0, d, vel=52, art='tenu')
    s.note(celles, 'G2', 0, d, vel=50)
    s.note(altos, 'Eb3', 0, d, vel=48)
    s.note(altos, 'C4', 0, d, vel=46)


theme.forme(intro=ORDRE, corps=['traine'])
