"""FUSIBLE — « La seconde manche » (film_seconde_manche) : la musique du film du livre 9.

Le film (packages/tools/web/cinema/films/seconde_manche.js, 38,5 s) : la veille du barrage
aller, novembre 2029, cinq heures du matin, rue des Lilas. Aubérive gèle ; une seule chose est
chaude, le four de la boulangerie Marçais. Sur le marbre fariné, la chemise de travail de Kévin,
noire, à une manche : la première est devenue le brassard du capitaine, les ciseaux mordent
déjà l'autre. Sa photo au-dessus de la caisse ; la seule réplique, Marie-Jo : « Ta chemise, je
l'ai lavée deux fois. Elle sent encore le chantier. » ; la télévision sans le son montre le
Dôme, vingt degrés dedans. La musique est un chapitre de « Vingt degrés dedans » (livre_h9) :
ici, le choral à voix basse des bois (le pain qui se fait la nuit, comme toujours) et sa
doublure en deuil aux violoncelles seuls ; les grains de verre du célesta pour la neige ; la
tête aux cloches de verre, en majeur, quand la télévision montre le Dôme.

LA RUE (plan 1) : la neige dans les diodes froides, des grains de célesta en fa mineur ; dessous,
les clarinettes graves, la seule chaleur (la vitrine allumée).
LE FOURNIL (plan 2) : la porte du four qu'on referme (6,2 s : rien dessous) ; le choral majeur,
à voix basse, aux bois (flûte, clarinettes, bassons) : I – IV, le pain.
LE MARBRE (plan 3, en fondu) : le choral devient sa doublure, aux violoncelles seuls, en fa
mineur ; la mèche (réb) tombe quand la chemise est sous nos yeux, doublée par une cloche de
verre ; iv dessous.
LA PHOTO (plan 4) : la chute du motif (lab sol | sib fa), et le soupir du livre : i – ♭VII – IV –
iv – I ; sous la réplique, les violoncelles et une nappe, rien d'autre.
LA TÉLÉVISION (plan 5) : après le bruit de la télévision qui s'allume (23,1 s), le Dôme : la
ventilation, à peine, et la tête aux cloches de verre, en majeur : le sourire, là-bas.
LA RUE, ENCORE (plan 6, en fondu) : la boulangerie seule allumée ; les bois reprennent le choral ;
sous le titre, la tête en MINEUR aux cloches de verre, et sa mèche, réb, qui ne se résout pas
(comme dans la fenêtre « 4 °C » du thème) : à qui ira le second brassard ? la carte le demande.

LE TEMPO : une section par plan (chaque coupe et chaque fondu commencent sur un premier temps,
au même échantillon), entre 91 et 104 à la noire (le thème est à 100) ; le titre a la sienne.

LA FEUILLE DE SYNCHRO : SYNCHRO ci-dessous (outils/synchro.py la vérifie sur le JSON du rendu).
"""
from moteur.ecriture import *
from partitions._fusible import phrase

theme = Theme('film_seconde_manche', 'La seconde manche', bpm=100, mesure='4/4', tonalite='fa majeur',
              graine=2129, ville=False, boucle_min=0,
              moment='le film « La seconde manche », livre 9',
              humeur="cinq heures du matin, la neige, le four ; une chemise à une seule manche")
theme.master(sonie_sur='intro')

TON = 'fa majeur'
MIN = 'fa mineur'

theme.salle('salle', rt60=3.0, clarte=1.2)
theme.salle('echo', temps=1.5, retour=0.3)

PLANS = [  # (section, début, fin, mesure, mesures)
    ('rue', 0.0, 5.8, '5/4', 2),
    ('fournil', 5.8, 11.0, '4/4', 2),
    ('marbre', 11.0, 16.8, '5/4', 2),
    ('photo', 16.8, 23.0, '5/4', 2),
    ('tele', 23.0, 29.6, '5/4', 2),
    ('boulangerie', 29.6, 33.8, '7/4', 1),
    ('titre', 33.8, 38.5, '4/4', 2),
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


SYNCHRO = [
    ('le noir s\'ouvre ; la neige (célesta)', 0.0, 'rue', 0),
    ('coupe : le fournil ; le choral des bois', 5.8, 'fournil', 0),
    ('la porte du four (rien dessous)', 6.2, 'fournil', au('fournil', 6.2)),
    ('le choral reprend après la porte', 6.45, 'fournil', 1),
    ('fondu : le marbre, la doublure aux violoncelles', 11.0, 'marbre', 0),
    ('la chemise : la mèche réb', 12.74, 'marbre', 3),
    ('coupe : la photo ; lab', 16.8, 'photo', 0),
    ('la réplique (17,5–22,6 s) : les violoncelles seuls', 17.5, 'photo', au('photo', 17.5)),
    ('vers le sac à pain : I, fa majeur', 20.52, 'photo', 6),
    ('coupe : la télévision (rien dessous)', 23.0, 'tele', 0),
    ('le bruit de la télévision', 23.1, 'tele', au('tele', 23.1)),
    ('le Dôme : la tête aux cloches, ré', 27.62, 'tele', 7),
    ('fondu : la rue, la boulangerie seule', 29.6, 'boulangerie', 0),
    ('le titre ; la tête en mineur, réb', 33.8, 'titre', 0),
    ('l\'image s\'éteint (37,1–38,5 s)', 37.1, 'titre', au('titre', 37.1)),
]

# --- les pistes (celles du thème) -----------------------------------------------------------
VERRE = {'osc': [{'forme': 'sinus', 'niveau': 1.0},
                 {'forme': 'sinus', 'demi_tons': 17.58, 'niveau': 0.32},
                 {'forme': 'sinus', 'demi_tons': 29.2, 'niveau': 0.1}],
         'sub': 0.0, 'filtre': None, 'amp': {'a': 0.002, 'd': 2.2, 's': 0.0, 'r': 1.2},
         'velocite': 0.6}
vibra = theme.piste('vibra', 'vibraphone', pan=-0.25, salle=0.45, echo=0.16, volume=5)
celesta = theme.piste('celesta', pan=-0.32, salle=0.4, echo=0.14, volume=3)
verre = theme.piste('verre', 'arpege_synthe', synthe=VERRE, pan=-0.2, salle=0.35, echo=0.2,
                    volume=-22, bus='synthes')
halo = theme.piste('halo', 'nappe_gm', art='verre', profondeur=0.75, largeur=1.2, volume=-4)
SOUFFLE = {'osc': [], 'bruit': 1.0, 'sub': 0.0,
           'filtre': {'type': 'bande', 'q': 0.9, 'coupure': 420.0, 'suivi': 0.5, 'env': 0.9,
                      'a': 0.75, 'd': 1.0, 's': 0.0, 'r': 0.5, 'drive': 1.0},
           'amp': {'a': 0.75, 'd': 1.1, 's': 0.0, 'r': 0.5}, 'velocite': 0.5, 'vel_filtre': 0.0}
souffle = theme.piste('souffle', 'arpege_synthe', synthe=SOUFFLE, largeur=1.3, salle=0.25, echo=0,
                      eq={'passe_haut': 150, 'passe_bas': 2800}, volume=4, bus='synthes')
basses = theme.piste('basses', 'contrebasses', art='tenu', pan=0.0, largeur=0.3, volume=0)
celles_chant = theme.piste('celles_chant', 'violoncelles', art='tenu', pan=0.06, largeur=0.4, volume=1)
altos = theme.piste('altos', art='tenu', volume=-2)
flute = theme.piste('flute', 'flutes', art='sans_vibrato', volume=8)
clarinettes = theme.piste('clarinettes', art='tenu', volume=-1)
bassons = theme.piste('bassons', art='tenu', pan=0.04, largeur=0.4, volume=7)
coupole = theme.piste('coupole', 'choeur', art='ouh', profondeur=0.85, largeur=1.3, salle=0.6, volume=-7)
cloche = theme.piste('cloche', 'cloches', salle=0.5, volume=-4)


def nuances(s, **niveaux):
    for nom_piste, v in niveaux.items():
        s.nuance(theme.pistes[nom_piste], v, 0)


# --- le matériau du thème ----------------------------------------------------------------
TETE_CL = phrase('tete', TON, octave=5)                   # fa5 do6 | RÉ6
TETE_CL_MIN = phrase('tete', MIN, octave=5)               # fa5 do6 | RÉb6


def grains(s, positions, accord, vel=54):
    """Les grains de verre : le célesta (et le verre de synthèse dessous), une note de
    l'accord à chaque position."""
    for k, p in enumerate(positions):
        h = accord[k % len(accord)]
        s.note(celesta, h, p, 0.5, vel=vel)
        s.note(verre, h, p, 0.5, vel=vel + 6)


# =====================================================================================
# Le film

@theme.section('rue', mesures=2, bpm=tempo('rue'), mesure='5/4', reprise=False)
def rue(s):
    """0–5,8 s : la rue sous la neige ; la vitrine allumée (le noir s'ouvre en 1,4 s)."""
    nuances(s, clarinettes='pp', halo='pp', basses='pp')
    # la neige dans les diodes froides : des grains de célesta, en fa mineur, rares
    grains(s, (0.5, 2.0, 3.25, 5.0, 6.5, 8.25), ['C6', 'F6', 'Ab5', 'C6', 'Eb6', 'F5'], vel=52)
    s.joue(halo, tenue(['C5', 'F5'], 9, vel=50), a=1)
    # la seule chaleur : les clarinettes, graves (la vitrine)
    s.joue(clarinettes, tenue(['F3', 'Ab3', 'C4'], 6, vel=60), a=4)
    s.crescendo(clarinettes, 4, 10, 'pp', 'p')
    s.note(basses, 'F2', 4, 6, vel=56)


@theme.section('fournil', mesures=2, bpm=tempo('fournil'), mesure='4/4', reprise=False)
def fournil(s):
    """5,8–11 s : le four à soles, la porte qu'on referme (6,2 s), la farine dans la lueur ;
    le choral majeur, à voix basse, aux bois (rien sous la porte : il reprend au 2e temps)."""
    nuances(s, flute='mp', clarinettes='p', bassons='p', basses='pp')
    # le choral : fa | do RÉ ── (le motif en augmentation, une noire par croche) ; I puis IV
    s.note(flute, 'F4', 1, 1, vel=80)
    s.note(flute, 'C5', 2, 1, vel=80)
    s.note(flute, 'D5', 3, 5, vel=84)
    for h, d, l in (('A3', 1, 2), ('C4', 1, 2), ('Bb3', 3, 5), ('D4', 3, 5)):
        s.note(clarinettes, h, d, l, vel=66)
    for h, d, l in (('F2', 1, 2), ('Bb1', 3, 5)):
        s.note(bassons, hauteur(h) + 12, d, l, vel=68)
    s.note(basses, 'F2', 1, 2, vel=54)
    s.note(basses, 'Bb1', 3, 5, vel=54)
    # la farine dans la lueur : deux grains, en majeur
    grains(s, (4.5, 6.75), ['F6', 'D6'], vel=48)


@theme.section('marbre', mesures=2, bpm=tempo('marbre'), mesure='5/4', reprise=False)
def marbre(s):
    """11–16,8 s : la chemise à une manche, les ciseaux dans la couture, l'étiquette ; le
    choral devient sa doublure, aux violoncelles seuls ; la mèche réb sur la chemise."""
    nuances(s, celles_chant='mp', altos='pp', basses='pp', clarinettes='pp')
    # la fin du choral majeur, qui s'éteint dans le fondu
    s.note(flute, 'D5', 0, 1.5, vel=70)
    s.diminuendo(flute, 0, 1.5, 'mp', 'pp')
    # la doublure : fa do | RÉb ── ── ── (en fa mineur), les violoncelles seuls
    s.note(celles_chant, 'F3', 1, 1, vel=84)
    s.note(celles_chant, 'C4', 2, 1, vel=84)
    s.note(celles_chant, 'Db4', 3, 7, vel=88)
    s.crescendo(celles_chant, 1, 6, 'mp', 'mf')
    s.expression(celles_chant, [(6, 'mf'), (10, 'mp')])
    # la mèche sur la chemise : une cloche de verre, réb ; iv dessous (sib réb fa)
    s.note(vibra, 'Db6', 3, 3, vel=76)
    s.note(verre, 'Db6', 3, 3, vel=70)
    for h in ('Bb2', 'F3'):
        s.note(altos, hauteur(h) + 12, 3, 7, vel=60)
    s.note(basses, 'Bb1', 3, 7, vel=56)
    s.joue(clarinettes, tenue(['F3', 'Ab3'], 2, vel=56), a=1)


@theme.section('photo', mesures=2, bpm=tempo('photo'), mesure='5/4', reprise=False)
def photo(s):
    """16,8–23 s : la photo de Kévin, puis le sac à pain ; la réplique de Marie-Jo (17,5–22,6 s) :
    la chute du motif aux violoncelles, et le soupir du livre (i ♭VII IV iv I)."""
    nuances(s, celles_chant='mp', altos='pp', basses='pp', clarinettes='pp', halo='pp')
    # lab sol | sib ── fa (la chute) ; dessous i, ♭VII, IV, iv, I
    for h, d, l in (('Ab3', 0, 2), ('G3', 2, 1), ('Bb3', 3, 3), ('A3', 6, 0), ('F3', 6, 4)):
        if l:
            s.note(celles_chant, h, d, l, vel=82)
    s.diminuendo(celles_chant, 3, 10, 'mp', 'p')
    for notes, d, l in ((['C3', 'F3'], 0, 2), (['Bb2', 'Eb3'], 2, 1), (['Bb2', 'D3'], 3, 1.5),
                        (['Bb2', 'Db3'], 4.5, 1.5), (['A2', 'C3'], 6, 4)):
        for h in notes:
            s.note(altos, hauteur(h) + 12, d, l, vel=58)
    for h, d, l in (('F2', 0, 2), ('Eb2', 2, 1), ('Bb1', 3, 3), ('F2', 6, 4)):
        s.note(basses, h, d, l, vel=54)
    s.joue(halo, tenue(['F4', 'C5'], 4, vel=48), a=6)


@theme.section('tele', mesures=2, bpm=tempo('tele'), mesure='5/4', reprise=False)
def tele(s):
    """23–29,6 s : la télévision sans le son (son bruit à 23,1 s : rien dessous) ; le Dôme,
    vingt degrés : la ventilation, à peine, et la tête aux cloches de verre, en majeur."""
    nuances(s, souffle='pp', halo='pp', basses='pp', coupole='pp')
    # la ventilation de là-bas, à peine (3+3+2 noires, dès le 2e temps)
    for d, l, v in ((1, 3, 54), (4, 3, 58), (7, 3, 56)):
        s.note(souffle, 'F3', d, l, vel=v)
    s.joue(halo, tenue(['F5', 'C6'], 8.5, vel=50), a=1.5)
    s.joue(coupole, tenue(['F3', 'C4'], 7, vel=50), a=3)
    # la tête aux cloches, en majeur (le sourire, là-bas) : le ré sur le 3e temps de m.2
    s.joue(vibra, TETE_CL, a=6, vel=80)
    s.joue(verre, TETE_CL, a=6, vel=74)
    s.joue(celesta, TETE_CL.octave(1), a=6, vel=64)
    # derrière la vitre, la neige
    grains(s, (2.5, 4.5, 9.0), ['C6', 'F6', 'A5'], vel=46)


@theme.section('boulangerie', mesures=1, bpm=tempo('boulangerie'), mesure='7/4', reprise=False)
def boulangerie(s):
    """29,6–33,8 s : la rue, de l'autre trottoir (en fondu) : la boulangerie seule allumée ;
    les bois reprennent le choral, à voix basse."""
    nuances(s, flute='p', clarinettes='p', bassons='p', basses='pp', halo='pp')
    s.note(flute, 'F4', 1, 1, vel=74)
    s.note(flute, 'C5', 2, 1, vel=74)
    s.note(flute, 'D5', 3, 4, vel=78)
    for h, d, l in (('A3', 1, 2), ('C4', 1, 2), ('Bb3', 3, 4), ('D4', 3, 4)):
        s.note(clarinettes, h, d, l, vel=62)
    for h, d, l in (('F3', 1, 2), ('Bb2', 3, 4)):
        s.note(bassons, h, d, l, vel=64)
    s.note(basses, 'F2', 1, 2, vel=52)
    s.note(basses, 'Bb1', 3, 4, vel=52)
    grains(s, (0.5, 4.75), ['C6', 'F6'], vel=46)


@theme.section('titre', mesures=2, bpm=tempo('titre'), mesure='4/4', reprise=False)
def titre(s):
    """33,8–38,5 s : le titre ; la tête en mineur aux cloches de verre, sa mèche (réb) qui ne se
    résout pas ; l'image s'éteint (37,1–38,5 s)."""
    nuances(s, halo='p', celles_chant='p', basses='pp', clarinettes='pp')
    # sous la tête : fa–lab (réb y reste sans grincer contre do)
    s.joue(halo, tenue(['F4', 'Ab4'], 8, vel=54))
    s.joue(clarinettes, tenue(['F3', 'Ab3'], 8, vel=56))
    s.note(celles_chant, 'F2', 0, 8, vel=70)
    s.note(basses, 'F2', 0, 8, vel=52)
    # la tête en mineur : fa do | RÉb, tenu (l'anacrouse au 1er temps)
    s.note(vibra, 'F5', 0, 0.5, vel=82)
    s.note(vibra, 'C6', 0.5, 0.5, vel=82)
    s.note(vibra, 'Db6', 1, 6, vel=84)
    s.note(verre, 'F5', 0, 0.5, vel=76)
    s.note(verre, 'C6', 0.5, 0.5, vel=76)
    s.note(verre, 'Db6', 1, 6, vel=78)
    s.note(celesta, 'Db7', 1, 2, vel=60)
    for p in (halo, clarinettes, celles_chant, basses):
        s.expression(p, [(5.4, 'p'), (8, 'pp')])


# --- la traîne : fa–lab qui tient, la mèche au loin -----------------------------------------
@theme.section('traine', mesures=3, bpm=100, mesure='4/4', reprise=False)
def traine(s):
    nuances(s, halo='pp', clarinettes='pp', celles_chant='pp')
    s.joue(halo, tenue(['F4', 'Ab4'], 12, vel=50))
    s.joue(clarinettes, tenue(['F3', 'Ab3'], 12, vel=52))
    s.note(celles_chant, 'F2', 0, 12, vel=56)


theme.forme(intro=['rue', 'fournil', 'marbre', 'photo', 'tele', 'boulangerie', 'titre'], corps=['traine'])
