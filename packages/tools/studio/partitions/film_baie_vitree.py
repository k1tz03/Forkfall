"""FUSIBLE — « La baie vitrée » (film_baie_vitree) : la musique du film du livre 9.

Le film (packages/tools/web/cinema/films/baie_vitree.js, 40,5 s) : Al-Dorado, décembre 2030,
trente-neuf degrés dehors ; le Dôme, vingt degrés dedans ; par la baie vitrée du couloir, au
loin, un homme en casque marche le long d'une planche, en haut d'un échafaudage. La carte qui
suit dira qu'il tombe ; le film le montre debout. La musique est un chapitre de « Vingt degrés
dedans » (livre_h9) : fa majeur figé et sa doublure en deuil, la mèche qui change (ré, le
sourire ; réb, le cercueil), les cloches de verre, le souffle de la ventilation, le choral.

DEHORS, LA CHALEUR (plans 1–2) : une pédale de fa (la sous-basse, les contrebasses), la cymbale à
l'archet qui miroite, le verre frotté, les violoncelles en trémolo ; pas de cloche. Quand le
panneau de la pharmacie passe de « 39 °C » à « 14:10 » (l'heure du rapport : « malaise, à
l'intérieur du Dôme, 14 h 10 »), une seule cloche de verre : réb, la mèche du cercueil. Le
panoramique vers la tour et ses casques : les cordes graves enflent vers si♭ mineur (iv)…
LA PORTE coupe la chaleur (le claquement du film, 11,62 s, puis le carillon des haut-parleurs,
12,3 s) : la musique se tait sous eux.
DEDANS, LE FROID (plans 3–4) : la ventilation se met en marche (3+3+2 noires, le souffle et ses
cordes), le verre aigu ; sous la seule réplique (les haut-parleurs, 12,6–18,2 s), rien d'autre.
Au banc, un cycle entier du souffle, et la tête du motif aux cloches de verre, en majeur : le
sourire, « vingt degrés ».
LE COULOIR (plan 5) : le choral, trop lent, aux cors : le motif en augmentation sur I–IV–I–V ;
sa note sib tombe sur la coupe de la baie.
LA BAIE (plan 6) : le choral se pose sur fa ; pendant le zoom, un cor très loin dit la tête en
majeur (comme le garçon sur le toit, dans la fenêtre « La porte de service » du thème) : son
ré tombe sur le titre. Sous le titre, le soupir du livre, IV–iv–I : le ré du cor devient réb,
puis do (la mèche du sourire devient celle du cercueil, à la fin du zoom), et le glas de fa, en
majeur, quand l'image s'éteint. Le film ne montre pas la chute ; la musique la murmure.

LE TEMPO : une section par plan (la coupe tombe sur un premier temps, au même échantillon),
chacune à son tempo, entre 92 et 105 à la noire (le thème est à 100) ; le titre a deux sections,
pour que iv tombe à la fin du zoom ; les autres événements sont posés à leur temps exact dans la
section.

LA FEUILLE DE SYNCHRO (temps du film → mesure.temps de la section, temps de la musique)
  événement                                          film      section     musique
  le noir s'ouvre ; la pédale de fa                  0,00 s    dehors 1.1     0,000 s
  coupe : le panneau « 39 °C »                       6,20 s    panneau 1.1    6,200 s
  « 14:10 » au panneau : la cloche réb               7,50 s    panneau 1.3⅙   7,500 s
  panoramique vers la tour : les cordes enflent      9,10 s    panneau 2.2⅚   9,100 s
  coupe (flash), la porte : tout se tait            11,60 s    dedans 1.1    11,600 s
  le carillon des haut-parleurs (rien dessous)      12,30 s    dedans 1.2⅕   12,300 s
  la ventilation se met en marche                   12,78 s    dedans 1.3    12,767 s
  la réplique (12,6–18,2 s) : le souffle seul
  coupe : le banc                                   18,60 s    banc 1.1      18,600 s
  la tête aux cloches (ré, le sourire)              21,20 s    banc 2.1      21,200 s
  coupe (par le noir) : le couloir, le choral       23,80 s    couloir 1.1   23,800 s
  la mèche du choral (ré, tenu six temps)           26,40 s    couloir 2.1   26,400 s
  coupe : la baie ; le sib du choral                31,60 s    baie 1.1      31,600 s
  le titre ; le ré du cor lointain                  35,80 s    titre 1.1     35,800 s
  la fin du zoom ; iv (réb)                         38,10 s    fin 1.1       38,100 s
  I, le glas ; l'image s'éteint (39,1–40,5 s)       39,30 s    fin 1.3       39,300 s
  la fin du film                                    40,50 s    traîne 1.1    40,500 s
  (SYNCHRO ci-dessous ; vérifiée sur le JSON du rendu : le pire écart, 3,3 ms, est la
  ventilation, posée sur le 3e temps, 12,767 s)
"""
from moteur.ecriture import *
from partitions._fusible import phrase

theme = Theme('film_baie_vitree', 'La baie vitrée', bpm=100, mesure='4/4', tonalite='fa majeur',
              graine=2030, ville=False, boucle_min=0,
              moment='le film « La baie vitrée », livre 9',
              humeur="trente-neuf degrés dehors, vingt dedans ; un homme debout sur l'échafaudage, derrière la vitre")
theme.master(sonie_sur='intro')

TON = 'fa majeur'

# la coupole : une grande salle de verre, un écho à la noire pointée (comme le thème)
theme.salle('salle', rt60=3.3, clarte=1.35)
theme.salle('echo', temps=1.5, retour=0.32)

# --- les plans : une section par plan, son tempo pour que la coupe tombe sur le premier temps
PLANS = [  # (section, début, fin, mesure, mesures)
    ('dehors', 0.0, 6.2, '5/4', 2),
    ('panneau', 6.2, 11.6, '3/4', 3),
    ('dedans', 11.6, 18.6, '4/4', 3),
    ('banc', 18.6, 23.8, '4/4', 2),
    ('couloir', 23.8, 31.6, '4/4', 3),
    ('baie', 31.6, 35.8, '7/4', 1),
    ('titre', 35.8, 38.1, '4/4', 1),
    ('fin', 38.1, 40.5, '4/4', 1),
]


def _plan(nom):
    return next(p for p in PLANS if p[0] == nom)


def tempo(nom):
    """Le tempo (noires par minute) qui fait durer la section exactement son plan."""
    _, d, f, me, n = _plan(nom)
    num, den = me.split('/')
    return 60.0 * n * int(num) * 4 / int(den) / (f - d)


def au(nom, t):
    """La position (en temps depuis le début de la section) d'un instant `t` du film."""
    return (t - _plan(nom)[1]) * tempo(nom) / 60.0


# la feuille de synchro : (l'événement, son temps dans le film, la section, la position où la
# musique le marque, en temps depuis le début de la section) ; outils/synchro.py la vérifie sur
# le JSON du rendu
SYNCHRO = [
    ('le noir s\'ouvre ; la pédale de fa', 0.0, 'dehors', 0),
    ('coupe : le panneau « 39 °C »', 6.2, 'panneau', 0),
    ('« 14:10 » : la cloche réb', 7.5, 'panneau', au('panneau', 7.5)),
    ('panoramique vers la tour : si♭ mineur', 9.1, 'panneau', au('panneau', 9.1)),
    ('coupe, la porte : tout se tait', 11.6, 'dedans', 0),
    ('le carillon (rien dessous)', 12.3, 'dedans', au('dedans', 12.3)),
    ('la ventilation se met en marche', 12.77, 'dedans', 2),
    ('coupe : le banc', 18.6, 'banc', 0),
    ('la tête aux cloches : ré', 21.2, 'banc', 4),
    ('coupe (par le noir) : le couloir', 23.8, 'couloir', 0),
    ('la mèche du choral : ré', 26.4, 'couloir', 4),
    ('coupe : la baie ; sib', 31.6, 'baie', 0),
    ('le titre ; le ré du cor', 35.8, 'titre', 0),
    ('la fin du zoom ; iv (réb)', 38.1, 'fin', 0),
    ('I, le glas ; l\'image s\'éteint', 39.3, 'fin', 2),
]


# --- les pistes (celles du thème, les mêmes réglages) -----------------------------------
VERRE = {'osc': [{'forme': 'sinus', 'niveau': 1.0},
                 {'forme': 'sinus', 'demi_tons': 17.58, 'niveau': 0.32},
                 {'forme': 'sinus', 'demi_tons': 29.2, 'niveau': 0.1}],
         'sub': 0.0, 'filtre': None, 'amp': {'a': 0.002, 'd': 2.2, 's': 0.0, 'r': 1.2},
         'velocite': 0.6}
vibra = theme.piste('vibra', 'vibraphone', pan=-0.25, salle=0.45, echo=0.16, volume=5)
celesta = theme.piste('celesta', pan=-0.32, salle=0.4, echo=0.14, volume=3)
glock = theme.piste('glock', 'glockenspiel', pan=-0.12, salle=0.5, profondeur=0.6, volume=-8)
verre = theme.piste('verre', 'arpege_synthe', synthe=VERRE, pan=-0.2, salle=0.35, echo=0.2,
                    volume=-22, bus='synthes')
halo = theme.piste('halo', 'nappe_gm', art='verre', profondeur=0.75, largeur=1.2, volume=-4)
SOUFFLE = {'osc': [], 'bruit': 1.0, 'sub': 0.0,
           'filtre': {'type': 'bande', 'q': 0.9, 'coupure': 420.0, 'suivi': 0.5, 'env': 0.9,
                      'a': 0.75, 'd': 1.0, 's': 0.0, 'r': 0.5, 'drive': 1.0},
           'amp': {'a': 0.75, 'd': 1.1, 's': 0.0, 'r': 0.5}, 'velocite': 0.5, 'vel_filtre': 0.0}
souffle = theme.piste('souffle', 'arpege_synthe', synthe=SOUFFLE, largeur=1.3, salle=0.25, echo=0,
                      eq={'passe_haut': 150, 'passe_bas': 2800}, volume=4, bus='synthes')
sub = theme.piste('sub', 'sub_synthe', volume=-16)
basses = theme.piste('basses', 'contrebasses', art='tenu', pan=0.15, volume=0)
celles = theme.piste('celles', 'violoncelles', art='tremolo', pan=0.15, volume=9)
altos = theme.piste('altos', art='tenu', volume=-2)
cors = theme.piste('cors', art='tenu', volume=4)
cors2 = theme.piste('cors2', 'cors', art='tenu', unisson=2, pan=-0.12, volume=-4)
trombones = theme.piste('trombones', art='tenu', volume=0)
tuba = theme.piste('tuba', art='tenu', pan=0.15, volume=-5)
cor_loin = theme.piste('cor_loin', 'cors', unisson=1, pan=-0.45, profondeur=0.95, salle=0.75, volume=5)
coupole = theme.piste('coupole', 'choeur', art='ouh', profondeur=0.85, largeur=1.3, salle=0.6, volume=-7)
cloche = theme.piste('cloche', 'cloches', salle=0.5, volume=-4)
givre = theme.piste('givre', 'cymbale_suspendue', art='archet', volume=0)


def nuances(s, **niveaux):
    for nom_piste, v in niveaux.items():
        s.nuance(theme.pistes[nom_piste], v, 0)


# --- le matériau du thème ----------------------------------------------------------------
TETE_CL = phrase('tete', TON, octave=5)                   # fa5 do6 | RÉ6 (les cloches de verre)
TETE = phrase('tete', TON, octave=4)                      # fa4 do5 | ré5 (le cor lointain)
CHORAL_MAJ = phrase('motif', TON, octave=4).augmente(2)   # fa do | RÉ ── la sol | sib fa, doublé
# les voix du choral (temps 0 à 20 du choral, comme le thème) : alto, ténor, basse
ALTO = mel('C4:3 F4:8 E4:3 C4:6')
TENOR = mel('A3:4 Bb3:6 C4:4 A3:6')
BASSE = mel('F2:4 Bb1:6 F2:1 C2:3 F2:6')


def voix_choral(s, a, de, jusqua, vel=78):
    """Les voix intérieures du choral (cors à deux, trombones, tuba) des temps `de` à `jusqua`
    du choral, posées à partir de la position `a` de la section (le temps `de` y tombe)."""
    for piste, voix in ((cors2, ALTO), (trombones, TENOR), (tuba, BASSE)):
        for n in voix.notes:
            if n.t + n.d <= de or n.t >= jusqua:
                continue
            d0 = max(n.t, de)
            s.note(piste, n.h, a + d0 - de, min(n.t + n.d, jusqua) - d0, vel=vel)


def souffle_a(s, debut, duree, vel=80, h='F3', cordes=True):
    """Un souffle de la ventilation : le bruit accordé, et (si `cordes`) les violoncelles en
    trémolo et les contrebasses qui respirent avec lui."""
    s.note(souffle, h, debut, duree, vel=vel)
    if cordes:
        s.note(celles, h, debut, duree, vel=64)
        s.note(basses, 'F2', debut, duree, vel=62)


# =====================================================================================
# Le film

@theme.section('dehors', mesures=2, bpm=tempo('dehors'), mesure='5/4', reprise=False)
def dehors(s):
    """0–6,2 s : l'esplanade dans la chaleur blanche (le noir s'ouvre en 1,4 s)."""
    nuances(s, sub='pp', basses='pp', celles='pp', halo='pp')
    s.note(sub, 'F1', 0, 10, vel=58)
    s.note(basses, 'F2', 0.5, 9.5, vel=60)
    s.crescendo(basses, 0.5, 10, 'pp', 'p')
    # la chaleur qui miroite : la cymbale à l'archet, le verre frotté, le trémolo des cordes
    s.note(givre, 'C4', 1, 9, vel=58)
    s.joue(halo, tenue(['F4', 'C5'], 8, vel=56), a=2)
    s.note(celles, 'F3', 4, 6, vel=60)
    s.note(celles, 'C4', 4, 6, vel=56)
    s.crescendo(celles, 4, 10, 'pp', 'p')


@theme.section('panneau', mesures=3, bpm=tempo('panneau'), mesure='3/4', reprise=False)
def panneau(s):
    """6,2–11,6 s : le panneau « 39 °C », puis « 14:10 » (7,5 s) ; le panoramique vers la tour (9,1 s)."""
    t1410 = au('panneau', 7.5)
    tpan = au('panneau', 9.1)
    nuances(s, sub='p', basses='p', celles='p', halo='pp')
    s.note(sub, 'F1', 0, tpan, vel=60)
    s.note(basses, 'F2', 0, tpan, vel=64)
    s.note(celles, 'F3', 0, tpan, vel=62)
    s.note(celles, 'C4', 0, t1410, vel=58)
    s.note(celles, 'Ab3', t1410, tpan - t1410, vel=58)
    s.joue(halo, tenue(['F4', 'C5'], t1410, vel=56))
    s.joue(halo, tenue(['F4', 'Ab4'], tpan - t1410, vel=56), a=t1410)
    # « 14:10 » : une seule cloche de verre, réb (la mèche du cercueil), contre fa–do
    s.note(vibra, 'Db6', t1410, 3, vel=74)
    s.note(verre, 'Db6', t1410, 3, vel=70)
    s.note(celesta, 'Db7', t1410, 2, vel=50)
    # vers la tour et ses casques : si♭ mineur (iv), les cordes enflent jusqu'à la porte
    for h in ('Bb2', 'Db3', 'F3'):
        s.note(celles, h, tpan, 9 - tpan, vel=72)
    s.note(basses, 'Bb1', tpan, 9 - tpan, vel=70)
    s.note(sub, 'Bb1', tpan, 9 - tpan, vel=62)
    s.joue(halo, tenue(['Db5', 'F5'], 9 - tpan, vel=58), a=tpan)
    s.crescendo(celles, tpan, 8.8, 'p', 'mf')
    s.crescendo(basses, tpan, 8.8, 'p', 'mf')
    s.crescendo(halo, tpan, 8.8, 'pp', 'p')


@theme.section('dedans', mesures=3, bpm=tempo('dedans'), mesure='4/4', reprise=False)
def dedans(s):
    """11,6–18,6 s : la porte, le carillon, la réplique des haut-parleurs (12,6–18,2 s)."""
    # rien sous la porte (11,62 s) ni sous le carillon (12,3 s) : la ventilation se met en
    # marche au 3e temps (12,77 s), en 3+3+2 noires ; le verre aigu ; rien d'autre sous la réplique
    nuances(s, souffle='pp', celles='pp', basses='pp', halo='pp')
    for d, l, v in ((2, 3, 70), (5, 3, 74), (8, 2, 72), (10, 2, 76)):
        souffle_a(s, d, l, vel=v)
    s.joue(halo, tenue(['F5', 'C6'], 9.5, vel=54), a=2.5)
    s.crescendo(souffle, 2, 12, 'pp', 'p')


@theme.section('banc', mesures=2, bpm=tempo('banc'), mesure='4/4', reprise=False)
def banc(s):
    """18,6–23,8 s : le banc, les bouches d'air, les rubans, « 20,0 °C »."""
    nuances(s, souffle='p', celles='p', basses='p', sub='pp', halo='pp')
    # un cycle entier de la ventilation (3+3+2 noires), les cordes qui respirent
    for d, l, v in ((0, 3, 84), (3, 3, 80), (6, 2, 82)):
        souffle_a(s, d, l, vel=v)
        s.expression(celles, [(d, 'pp'), (d + 0.42 * l, 'mp'), (d + l - 0.05, 'pp')])
    s.note(sub, 'F1', 0, 8, vel=60)
    s.joue(halo, tenue(['F5', 'C6'], 8, vel=54))
    # la tête aux cloches de verre, en majeur : le sourire ; le ré sur le premier temps de m.2
    s.joue(vibra, TETE_CL, a=3, vel=86)
    s.joue(verre, TETE_CL, a=3, vel=80)
    s.joue(celesta, TETE_CL.octave(1), a=3, vel=72)


@theme.section('couloir', mesures=3, bpm=tempo('couloir'), mesure='4/4', reprise=False)
def couloir(s):
    """23,8–31,6 s : le couloir vitré (par le noir) ; le choral, trop lent, aux cors."""
    nuances(s, cors='mp', cors2='p', trombones='p', tuba='p', halo='pp', celles='pp', coupole='pp')
    # le choral : fa do | RÉ ── ── ── la sol | (sib, au plan suivant) ; l'anacrouse au 3e temps
    s.joue(cors, CHORAL_MAJ.coupe(0, 10), a=2, vel=88)
    voix_choral(s, 0, 0, 12, vel=78)
    s.crescendo(cors, 2, 10, 'mp', 'mf')
    # la mèche du choral, doublée aux cloches (l'attaque seulement), et le verre au-dessus
    s.note(vibra, 'D6', 4, 3, vel=70)
    s.note(verre, 'D6', 4, 3, vel=66)
    for notes_h, notes_c, d, l in ((['A4', 'F5'], ['F3', 'C4'], 0, 4), (['Bb4', 'F5'], ['F3', 'D4'], 4, 6),
                                   (['A4', 'F5'], ['F3', 'C4'], 10, 1), (['G4', 'C5'], ['E3', 'C4'], 11, 1)):
        s.joue(halo, tenue(notes_h, l, vel=52), a=d)
        s.joue(coupole, tenue(notes_c, l, vel=58), a=d)


@theme.section('baie', mesures=1, bpm=tempo('baie'), mesure='7/4', reprise=False)
def baie(s):
    """31,6–35,8 s : à travers la baie, au téléobjectif ; l'homme sur la planche."""
    nuances(s, cors='mf', cors2='p', trombones='p', tuba='p', cor_loin='mp', coupole='p', halo='p')
    # le choral se pose : sib (sur V7) puis fa (sur I)
    s.note(cors, 'Bb4', 0, 2, vel=90)
    s.note(cors, 'F4', 2, 3.5, vel=86)
    voix_choral(s, 0, 12, 19, vel=78)
    s.diminuendo(cors, 2, 5.5, 'mf', 'p')
    s.joue(coupole, tenue(['E3', 'G3', 'C4'], 2, vel=60))
    s.joue(coupole, tenue(['F3', 'A3', 'C4'], 5, vel=60), a=2)
    s.joue(halo, tenue(['C5', 'G5'], 2, vel=54))
    s.joue(halo, tenue(['C5', 'F5'], 5, vel=54), a=2)
    # la chaleur, vue à travers la vitre : la cymbale à l'archet
    s.note(givre, 'C4', 2, 5, vel=54)
    # le cor très loin : l'anacrouse de la tête (fa do), son ré tombera sur le titre
    s.note(cor_loin, 'F4', 6, 0.5, vel=80)
    s.note(cor_loin, 'C5', 6.5, 0.5, vel=80)


@theme.section('titre', mesures=1, bpm=tempo('titre'), mesure='4/4', reprise=False)
def titre(s):
    """35,8–38,1 s : le titre, pendant la fin du zoom ; IV, le ré du cor (la mèche du sourire)."""
    nuances(s, cor_loin='mp', coupole='p', celles='p', basses='p', halo='p')
    s.note(cor_loin, 'D5', 0, 4, vel=84)
    s.note(vibra, 'D6', 0, 3, vel=80)
    s.note(verre, 'D6', 0, 3, vel=74)
    s.note(glock, 'D7', 0, 2, vel=60)
    s.note(celles, 'Bb2', 0, 4, vel=66)
    s.note(basses, 'Bb1', 0, 4, vel=64)
    s.joue(coupole, tenue(['Bb3', 'D4', 'F4'], 4, vel=62))
    s.joue(halo, tenue(['F4', 'Bb4'], 4, vel=54))


@theme.section('fin', mesures=1, bpm=tempo('fin'), mesure='4/4', reprise=False)
def fin(s):
    """38,1–40,5 s : iv à la fin du zoom (réb, la mèche du cercueil), puis I et le glas de fa,
    en majeur, quand l'image s'éteint (39,1–40,5 s)."""
    nuances(s, cor_loin='mp', coupole='p', celles='p', basses='p', halo='p')
    s.note(cor_loin, 'Db5', 0, 2, vel=80)
    s.note(vibra, 'Db6', 0, 2, vel=74)
    s.note(verre, 'Db6', 0, 2, vel=70)
    s.joue(coupole, tenue(['Bb3', 'Db4', 'F4'], 2, vel=60))
    s.joue(halo, tenue(['F4', 'Bb4'], 2, vel=54))
    s.note(celles, 'Bb2', 0, 2, vel=64)
    s.note(basses, 'Bb1', 0, 2, vel=62)
    s.note(cor_loin, 'C5', 2, 2, vel=76)
    s.joue(coupole, tenue(['F3', 'A3', 'C4'], 2, vel=58), a=2)
    s.joue(halo, tenue(['F4', 'C5'], 2, vel=54), a=2)
    s.note(celles, 'F2', 2, 2, vel=62)
    s.note(basses, 'F2', 2, 2, vel=60)
    s.note(cloche, 'F4', 2, 2, vel=70)
    for p in (cor_loin, coupole, celles, basses):
        s.expression(p, [(1.8, 'p'), (4, 'pp')])


# --- la traîne : si le film dure plus que prévu (une pause), un accord de fa qui tient --------
@theme.section('traine', mesures=4, bpm=80, mesure='4/4', reprise=False)
def traine(s):
    # (12 s : plus longue que les queues de l'introduction, la cloche et la cymbale à l'archet)
    nuances(s, halo='pp', celles='pp', coupole='pp', sub='pp')
    s.joue(halo, tenue(['F4', 'C5'], 16, vel=52))
    s.joue(coupole, tenue(['F3', 'A3', 'C4'], 16, vel=54))
    s.note(celles, 'F3', 0, 16, vel=56)
    s.note(sub, 'F1', 0, 16, vel=52)


theme.forme(intro=['dehors', 'panneau', 'dedans', 'banc', 'couloir', 'baie', 'titre', 'fin'], corps=['traine'])
