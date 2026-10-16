"""FUSIBLE — le studio : « La démonstration » (demo_studio). Pas un thème du jeu : la
preuve que le studio sonne vrai et grand, et un modèle d'écriture complet.

Un seul motif (« l'appel » : ré, si bémol, la — la sixte mineure qui retombe sur la
quinte — puis sol fa sol ré) traverse quatre mondes :

  intro   2 m.  96   le grave qui s'éveille : tam-tam frotté, chœur « ouh », roulements
  A1      4 m.  96   l'ostinato : violoncelles et contrebasses en doubles croches
                     (groupées 3+3+2), timbales, taiko, sous-basse ; crescendo p → f
  A2      4 m.  96   l'appel aux quatre cors, le « braam » sur le premier temps, le chœur
  A3      4 m.  96   le tutti : trompettes à l'octave, trombones dessous, violons en
                     doubles croches, cymbales ; la dernière mesure se tait sur une montée
  B      10 m. 112   les néons : basse en scie qui pompe sous la grosse caisse, arpège en
                     écho ping-pong, caisse claire « gated », le même appel au lead
                     analogique décalé d'une croche ; deux mesures de creux, filtre fermé
  C       8 m. 124   la place : pizzicati, flûtes et clarinettes, glockenspiel, basse qui
                     rebondit, batterie légère ; cadence de victoire bVI – bVII – I
  D1      4 m.  96   le tutti final : l'appel en valeurs longues, chœur, braam, timbales
  D2      2 m. 96→72 le ralenti, l'accord de ré MAJEUR (tierce picarde), tam-tam

  la boucle (le corps) : A1 … D2 ≈ 87 s ; l'introduction ≈ 5 s.
"""
from moteur.ecriture import *

theme = Theme('demo_studio', 'La démonstration du studio', bpm=96, mesure='4/4',
              tonalite='ré mineur', graine=2026, boucle_min=0,
              moment='démonstration (pas un thème du jeu)',
              humeur='épique hybride, néons noirs, la place au soleil, le tutti')

# --- les pistes : l'orchestre ---------------------------------------------------------
# (les faders ont été corrigés de l'opposé de ce qui a changé à la calibration des
# niveaux, studio.md § 4.1 : le tuba n'a plus besoin de +7 dB pour sortir du grave)
violons = theme.piste('violons', volume=-1.5)
violons2 = theme.piste('violons2', 'violons', pan=-0.22, volume=-3.5)
altos = theme.piste('altos', volume=-2)
celles = theme.piste('violoncelles', volume=2)
basses = theme.piste('contrebasses', 'basses_film', volume=1)
cors = theme.piste('cors', volume=1.5)
trompettes = theme.piste('trompettes', volume=0.5)
trombones = theme.piste('trombones', volume=2.5)
tuba = theme.piste('tuba', volume=-2)
braam = theme.piste('braam', volume=1.5)
flutes = theme.piste('flutes', volume=1.5)
clarinettes = theme.piste('clarinettes', volume=-3.5)
bassons = theme.piste('bassons', volume=-2.5)
timbales = theme.piste('timbales', volume=1.5)
taiko = theme.piste('taiko', volume=2)
cymbales = theme.piste('cymbales', volume=2)
suspendue = theme.piste('cymbale_suspendue', volume=0)
tamtam = theme.piste('tam_tam', volume=0)
glock = theme.piste('glockenspiel', volume=-1)
choeur = theme.piste('choeur', volume=-0.5)
# --- les synthés et la batterie -------------------------------------------------------
sub = theme.piste('sub', 'sub_synthe', volume=-8)
kick = theme.piste('kick', 'boite_a_rythmes', volume=3, bus='batterie')
caisse = theme.piste('caisse', 'caisse_claire', volume=-5, bus='batterie', salle=0.0,
                     porte=porte(duree=0.28), pan=0.0, profondeur=0.0)
claps = theme.piste('claps', 'boite_a_rythmes', volume=-2, bus='batterie', porte=porte(duree=0.22), pan=-0.1)
charley = theme.piste('charley', 'boite_a_rythmes', volume=-4, bus='batterie', pan=0.3, plaque=0.1)
basse_s = theme.piste('basse_s', 'basse_synthe', volume=0.5, pompe=pompe(0.55, 0.17, source='kick'),
                       eq={'passe_haut': 38})
reese = theme.piste('reese', 'basse_reese', volume=-5)
arp = theme.piste('arp', 'arpege_synthe', volume=-2, pompe=pompe(0.4, 0.15, source='kick'), echo=0.35,
                   pan=0.3)
nappe = theme.piste('nappe', 'nappe_synthe', volume=-5, pompe=pompe(0.7, 0.22, source='kick'), largeur=1.4)
lead = theme.piste('lead', 'lead_synthe', volume=-2, echo=0.3, salle=0.22)
effets = theme.piste('effets', volume=-1)
# --- la place --------------------------------------------------------------------------
basse_e = theme.piste('basse_e', 'basse_electrique', volume=0)
batterie = theme.piste('batterie', volume=-6)

theme.salle('echo', bpm=112, temps=0.75, retour=0.42)

# --- le matériau ------------------------------------------------------------------------
# l'appel : deux mesures, puis sa réponse (deux mesures) ; on le pose, on le transpose,
# on l'augmente, on le décale
APPEL = mel('D4:1 Bb4:2 A4:1 | G4:.75 F4:.25 G4:1 D4:2')
REPONSE = mel('F4:1 C5:2 Bb4:.5 A4:.5 | G4:1.5 A4:.5 E4:2')
GRILLE_A = 'i VI III VII'                       # ré m, si bémol, fa, do : une mesure chacun
RACINES_A = ['D', 'Bb', 'F', 'C']
# l'ostinato des cordes graves : groupé 3+3+2 (les accents tombent sur 1, 4, 7, 9, 12, 15)
ACCENTS = 'X x x X x x X x X x x X x x X x'


def ostinato_grave(racine, octave, pas_haut=True):
    """Une mesure de doubles croches sur la fondamentale, l'octave en écho."""
    r = f'{racine}{octave}'
    h = f'{racine}{octave + 1}'
    notes = [r, r, h, r, r, r, h, r, r, r, h, r, r, r, h, r] if pas_haut else [r] * 16
    return ostinato(notes, pas=0.25, accents=ACCENTS, art='staccato', vel=92)


# --- les sections -----------------------------------------------------------------------

@theme.section('intro', mesures=2)
def intro(s):
    s.joue(tamtam, tenue(['C4'], 8, vel=70), a=0, art='gratte')
    s.joue(choeur, tenue(['D3', 'A3', 'D4', 'F4'], 8, vel=55), art='ouh')
    s.crescendo(choeur, 0, 8, 'pp', 'mp')
    s.note(basses, 'D2', 0, 8, vel=60)
    s.note(timbales, 'D2', 4, 4, vel=70, art='roulement')
    s.crescendo(timbales, 4, 8, 'pp', 'f')
    # la cymbale enfle quatre secondes (6,4 temps à 96) : elle culmine sur le premier temps de A1
    s.note(suspendue, 'C4', 8 - 6.4, 6.4, vel=90, art='monte_4s')
    s.note(sub, 'D2', 0, 8, vel=70)


@theme.section('A1', mesures=4)
def A1(s):
    for m, r in enumerate(RACINES_A, start=1):
        s.joue(celles, ostinato_grave(r, 3 if r in ('D', 'C') else 2), a=s.m(m))
        # les contrebasses ne frappent que les accents de l'ostinato
        s.joue(basses, grille('X . . X . . X . X . . X . . X .', f'{r}2' if r in ('D', 'C') else f'{r}1'),
               a=s.m(m), art='staccato')
        s.note(sub, f'{r}2' if r in ('D', 'C') else f'{r}1', s.m(m), 4, vel=80)
    s.crescendo(celles, 0, 16, 'p', 'f')
    s.crescendo(basses, 0, 16, 'p', 'f')
    # les altos tiennent la quinte en trémolo, les violons n'entrent qu'à la mesure 3
    s.accords(altos, GRILLE_A, octave=3, art='tremolo', vel=80)
    s.crescendo(altos, 0, 16, 'pp', 'mf')
    s.seq(violons, 'A4 - - - - - - - F5 - - - G5 - - -', a=s.m(3), pas=0.5, art='tremolo', vel=84)
    s.crescendo(violons, s.m(3), 16, 'pp', 'mf')
    # le chœur en « ouh », la nappe des voix
    s.accords(choeur, GRILLE_A, octave=3, art='ouh', vel=74)
    s.nuance(choeur, 'mf')
    # timbales : un roulement qui enfle, puis des coups ; le taiko de plus en plus serré
    s.note(timbales, 'D2', 0, 8, vel=80, art='roulement')
    s.crescendo(timbales, 0, 8, 'p', 'mf')
    s.joue(timbales, grille('X . . . . . . . x . . . . . . . ', 'D2'), a=s.m(3))
    s.joue(timbales, grille('X . . . . . . . X . . . x . x . ', 'C2'), a=s.m(4))
    s.joue(taiko, grille('X . . . . . . . x . . . . . . . ', 'D3'), a=0, fois=2)
    s.joue(taiko, grille('X . . x . . x . X . . x . . X . ', 'D3'), a=s.m(3), fois=2)
    s.note(effets, 'D3', s.m(4, 2), 3, vel=110, art='montee')


@theme.section('A2', mesures=4)
def A2(s):
    for m, r in enumerate(RACINES_A, start=1):
        s.joue(celles, ostinato_grave(r, 3 if r in ('D', 'C') else 2), a=s.m(m), vel=None)
        s.joue(basses, ostinato_grave(r, 2 if r in ('D', 'C') else 1, pas_haut=False), a=s.m(m))
        s.joue(altos, ostinato_grave(r, 4 if r in ('D', 'C') else 3), a=s.m(m))
        s.note(sub, f'{r}2' if r in ('D', 'C') else f'{r}1', s.m(m), 4, vel=90)
    s.nuance(celles, 'f')
    s.nuance(basses, 'f')
    s.nuance(altos, 'mf')
    # l'appel aux cors, à l'unisson ; les violons tiennent au-dessus, en trémolo
    s.joue(cors, APPEL + REPONSE, vel=100, art='legato')
    s.seq(violons, 'A5 - - - - - - - Bb5 - - - - - - - A5 - - - - - - - G5 - - - - - - -',
          pas=0.5, art='tremolo', vel=80)
    s.seq(violons2, 'F5 - - - - - - - F5 - - - - - - - F5 - - - - - - - E5 - - - - - - -',
          pas=0.5, art='tremolo', vel=76)
    s.nuance(violons, 'mf')
    s.nuance(violons2, 'mf')
    # le braam ouvre la phrase ; le chœur chante les accords
    s.note(braam, 'D2', 0, 2.5, vel=118)
    s.note(braam, 'F2', s.m(3), 2.5, vel=110)
    s.accords(choeur, GRILLE_A, octave=4, art='aah', vel=82)
    s.nuance(choeur, 'mf')
    s.note(cymbales, 'C4', 0, 2, vel=100)
    s.joue(timbales, grille('X . . . x . . . X . . . x . x x', ['D2', 'D2', 'A2', 'A2', 'A2']), fois=4)
    s.joue(taiko, grille('X . . x . . x . X . x . X . . x', 'D3'), fois=4)
    s.note(effets, 'D3', s.m(4, 3), 2, vel=110, art='montee')


@theme.section('A3', mesures=4)
def A3(s):
    for m, r in enumerate(RACINES_A, start=1):
        haut = 3 if r in ('D', 'C') else 2
        s.joue(celles, ostinato_grave(r, haut), a=s.m(m))
        s.joue(basses, ostinato_grave(r, haut - 1, pas_haut=False), a=s.m(m))
        s.note(tuba, f'{r}2' if r in ('D', 'C') else f'{r}1', s.m(m), 3.5, vel=105)
    s.nuance(celles, 'ff')
    s.nuance(basses, 'ff')
    # l'appel au tutti : cors, trompettes à l'octave, trombones à l'octave grave
    s.joue(cors, APPEL + REPONSE, vel=112, art='legato')
    s.joue(trompettes, (APPEL + REPONSE).octave(1), vel=104, art='legato')
    s.joue(trombones, (APPEL + REPONSE).octave(-1), vel=106, art='legato')
    # les violons courent en doubles croches sur l'accord, les seconds en trémolo
    for m, ch in enumerate(GRILLE_A.split(), start=1):
        # l'arpège monte jusqu'au cinquième rang : on le tient sous le do 7 des violons
        notes = accord(ch, 'ré mineur', octave=5 if ch in ('i', 'VII') else 4)
        s.joue(violons, arpege(notes, '1 2 3 4 3 2 1 2 3 4 5 4 3 2 3 4', pas=0.25, art='staccato', vel=96),
               a=s.m(m))
    s.accords(violons2, GRILLE_A, octave=4, art='tremolo', vel=96)
    s.accords(altos, GRILLE_A, octave=3, art='tremolo', vel=96)
    for p in (violons, violons2, altos):
        s.nuance(p, 'f')
    s.accords(choeur, GRILLE_A, octave=4, art='aah', vel=104)
    s.nuance(choeur, 'f')
    s.note(braam, 'D2', 0, 3, vel=127)
    s.note(braam, 'C2', s.m(4), 2, vel=118)
    s.note(cymbales, 'C4', 0, 2, vel=118)
    s.note(cymbales, 'C4', s.m(3), 2, vel=100)
    s.joue(timbales, grille('X . x . X . x . X . x . X x x x', 'D2'), fois=3)
    s.joue(timbales, grille('X . . . x x x x', 'A2', pas=0.25), a=s.m(4))
    s.joue(taiko, grille('X . x x . . X . X . x . X x x x', 'D3'), fois=3)
    s.joue(taiko, grille('X x x x X x x x', 'D3'), a=s.m(4))
    s.note(reese, 'D2', 0, 12, vel=90)
    s.note(reese, 'C2', s.m(4), 2, vel=90)
    s.note(effets, 'D4', s.m(4, 2.5), 1.5, vel=118, art='montee')
    s.note(suspendue, 'C4', s.longueur - 3.2, 3.2, vel=100, art='monte_2s')   # 2 s à 96


# --- B : les néons (112) ---------------------------------------------------------------
GRILLE_B = ['i', 'i', 'VI', 'VI', 'iv', 'iv', 'V', 'V']
RACINES_B = ['D', 'D', 'Bb', 'Bb', 'G', 'G', 'A', 'A']


@theme.section('B', mesures=10, bpm=112)
def B(s):
    s.note(effets, 'D2', 0, 1, vel=127, art='impact')
    for m in range(1, 9):
        r = RACINES_B[m - 1]
        o = 2 if r in ('D', 'Bb') else 1
        # la basse en scie : doubles croches en octaves, elle pompe sous la grosse caisse
        bas = f'{r}{o}' if r != 'Bb' else 'Bb1'
        haut = f'{r}{o + 1}' if r != 'Bb' else 'Bb2'
        s.joue(basse_s, ostinato([bas, bas, haut, bas, bas, haut, bas, haut] * 2, pas=0.25,
                                 accents='X x x x X x x x X x x x X x x x', vel=100), a=s.m(m))
        notes = accord(GRILLE_B[m - 1], 'ré mineur', octave=4)
        s.joue(arp, arpege(notes, '1 2 3 4 2 3 4 5 3 4 5 4 3 2 3 4', pas=0.25, vel=96), a=s.m(m))
        s.joue(nappe, tenue(accord(GRILLE_B[m - 1], 'ré mineur', octave=3, etendu=True), 4, vel=80), a=s.m(m))
    s.batterie(kick, 'K : X . . . X . . . X . . . X . . .', jusqua=s.m(9))
    s.batterie(caisse, 'S : . . . . X . . . . . . . X . . .', jusqua=s.m(9))
    s.batterie(claps, 'CL : . . . . x . . . . . . . x . . .', jusqua=s.m(9))
    s.batterie(charley, 'H : x x X x x x X x x x X x x x X x', jusqua=s.m(9))
    s.batterie(charley, 'O : . . . . . . . . . . . . . . X .', jusqua=s.m(9))
    # l'appel au lead analogique, décalé d'une croche, une octave au-dessus
    s.joue(lead, (APPEL + REPONSE).octave(1).decale(0.5), a=s.m(3), vel=100)
    # le creux : la grosse caisse seule bat comme un cœur, la basse se ferme
    for m in (9, 10):
        s.joue(basse_s, ostinato(['D2', 'D2', 'D3', 'D2'] * 4, pas=0.25, vel=90), a=s.m(m))
        s.joue(nappe, tenue(accord('i', 'ré mineur', octave=3, etendu=True), 4, vel=70), a=s.m(m))
    s.batterie(kick, 'K : X . . . . . . . X . . X . . . .', a=s.m(9), jusqua=s.m(11))
    s.automation(basse_s, 'coupure', [(s.m(9), 1.0), (s.m(10, 4), 0.25)])
    s.note(effets, 'A3', s.m(10, 1), 4, vel=110, art='montee')


# --- C : la place (124) -----------------------------------------------------------------
CROCHET = mel('F5:.75 E5:.25 F5:.5 C5:.5 A4:1 C5:1 | D5:.75 C5:.25 D5:.5 G4:.5 E5:2 | '
              'F5:.75 E5:.25 F5:.5 A5:.5 G5:1 F5:1 | E5:.5 D5:.5 C5:1 A4:2')
FIN_C = mel('Ab4:.5 Bb4:.5 C5:.5 Db5:.5 | Eb5:.5 F5:.5 G5:1 | F5:4')


@theme.section('C', mesures=8, bpm=124)
def C(s):
    ton = 'fa majeur'
    grille_c = ['I', 'V', 'vi', 'IV', 'I', 'V', 'bVI', 'bVII', 'I']
    # les pizzicati : la basse sur les temps, les accords sur les contretemps
    for m, ch in enumerate(['I', 'V', 'vi', 'IV', 'I', 'V'], start=1):
        ac = accord(ch, ton, octave=4)
        racine = accord(ch, ton, octave=2)[0]
        s.joue(celles, grille('X . . . x . . . X . . . x . x .', [racine, racine + 7]), a=s.m(m), art='pizzicato')
        for h in ac:
            s.joue(violons2, grille('. . x . . . x . . . x . . . x .', h), a=s.m(m), art='pizzicato')
        s.joue(altos, grille('. . x . . . x . . . x . . . x .', ac[0]), a=s.m(m), art='pizzicato')
    # mesure 7 : bVI – bVII (deux temps chacun), mesure 8 : I
    for t, ch in ((0, 'bVI'), (2, 'bVII')):
        for h in accord(ch, ton, octave=4):
            s.note(violons2, h, s.m(7, 1 + t), 1, vel=96, art='pizzicato')
            s.note(trompettes, h, s.m(7, 1 + t), 1.8, vel=82, art='tenu')
        s.note(celles, accord(ch, ton, octave=2)[0], s.m(7, 1 + t), 1, vel=110, art='pizzicato')
    for h in accord('I', ton, octave=4):
        s.note(violons2, h, s.m(8), 1, vel=100, art='pizzicato')
        s.note(trompettes, h, s.m(8), 3, vel=86, art='tenu')
    # le crochet : flûtes et clarinettes à l'octave, le glockenspiel qui scintille
    s.joue(flutes, CROCHET, vel=96, art='legato')
    s.joue(clarinettes, CROCHET.octave(-1), vel=90, art='legato')
    s.joue(glock, CROCHET.octave(1).staccato(0.5), vel=90)
    s.joue(flutes, CROCHET.coupe(0, 8), a=s.m(5), vel=100, art='legato')
    s.joue(clarinettes, CROCHET.coupe(0, 8).octave(-1), a=s.m(5), vel=92, art='legato')
    s.joue(flutes, FIN_C, a=s.m(7), vel=104, art='legato')
    s.joue(glock, FIN_C.octave(1).staccato(0.5), a=s.m(7), vel=96)
    # les bassons sautillent avec la basse électrique
    ligne = mel('F2:.75 F2:.25 r:.5 C3:.5 F2:.5 F2:.5 A2:.5 C3:.5 | C2:.75 C2:.25 r:.5 G2:.5 C3:.5 C2:.5 E2:.5 G2:.5 | '
                'D2:.75 D2:.25 r:.5 A2:.5 D3:.5 D2:.5 F2:.5 A2:.5 | Bb1:.75 Bb1:.25 r:.5 F2:.5 Bb2:.5 Bb1:.5 D2:.5 F2:.5')
    s.joue(basse_e, ligne, vel=96)
    s.joue(basse_e, ligne.coupe(0, 8), a=s.m(5), vel=96)
    s.joue(basse_e, mel('Db2:2 Eb2:2 | F2:1 C2:1 F2:2'), a=s.m(7), vel=104)
    s.joue(bassons, ligne.octave(1).staccato(0.5), vel=84, art='staccato')
    s.batterie(batterie, '''
        K : X . . . . . x . X . . . . . . .
        S : . . . . X . . . . . . . X . . o
        H : x . x . x . x . x . x . x . x .
    ''', jusqua=s.m(8))
    s.batterie(batterie, '''
        K : X . . . . . . . . . . . . . . .
        C : X . . . . . . . . . . . . . . .
    ''', a=s.m(8), jusqua=s.m(9))
    s.note(suspendue, 'C4', s.longueur - 4.13, 4.13, vel=100, art='monte_2s')   # 2 s à 124


# --- D : le tutti final (96, puis ralenti) -----------------------------------------------

@theme.section('D1', mesures=4)
def D1(s):
    for m, r in enumerate(RACINES_A, start=1):
        haut = 3 if r in ('D', 'C') else 2
        s.joue(celles, ostinato_grave(r, haut), a=s.m(m))
        s.joue(basses, ostinato_grave(r, haut - 1, pas_haut=False), a=s.m(m))
        s.note(tuba, f'{r}2' if r in ('D', 'C') else f'{r}1', s.m(m), 3.5, vel=110)
        s.note(sub, f'{r}2' if r in ('D', 'C') else f'{r}1', s.m(m), 4, vel=90)
    s.nuance(celles, 'ff')
    s.nuance(basses, 'ff')
    # l'appel en valeurs longues (augmenté), cors et trompettes, violons à l'octave
    grand = APPEL.augmente(2).coupe(0, 16)
    s.joue(cors, grand, vel=118, art='legato')
    s.joue(trompettes, grand.octave(1), vel=110, art='legato')
    s.joue(trombones, grand.octave(-1), vel=112, art='legato')
    s.joue(violons, grand.octave(1), vel=104, art='legato')
    s.joue(violons2, grand, vel=100, art='legato')
    s.accords(altos, GRILLE_A, octave=3, art='tremolo', vel=100)
    for p in (violons, violons2, altos):
        s.nuance(p, 'ff')
    s.accords(choeur, GRILLE_A, octave=4, art='aah', vel=112)
    s.nuance(choeur, 'ff')
    s.note(braam, 'D2', 0, 3, vel=127)
    s.note(cymbales, 'C4', 0, 2, vel=124)
    s.joue(timbales, grille('X . x . X . x . X . x . X x x x', 'D2'), fois=4)
    s.joue(taiko, grille('X . x x . . X . X . x . X x x x', 'D3'), fois=4)
    s.note(reese, 'D2', 0, 16, vel=96)


@theme.section('D2', mesures=2, bpm=(96, 72))
def D2(s):
    ton = 'ré mineur'
    for h in accord('VI', ton, octave=3) + accord('VI', ton, octave=4):
        s.note(cors if h < 62 else trompettes, h, 0, 2, vel=110, art='tenu')
    for h in accord('VII', ton, octave=3) + accord('VII', ton, octave=4):
        s.note(cors if h < 62 else trompettes, h, 2, 2, vel=114, art='tenu')
    s.note(tuba, 'Bb1', 0, 2, vel=110)
    s.note(tuba, 'C2', 2, 2, vel=112)
    s.accords(choeur, ['VI', 'VII'], octave=4, duree=2, art='aah', vel=116)
    s.accords(violons, ['VI', 'VII'], octave=5, duree=2, art='tenu', vel=110)
    s.accords(altos, ['VI', 'VII'], octave=3, duree=2, art='tenu', vel=104)
    s.note(celles, 'Bb2', 0, 2, vel=110, art='tenu')
    s.note(celles, 'C3', 2, 2, vel=110, art='tenu')
    s.note(basses, 'Bb1', 0, 2, vel=110, art='tenu')
    s.note(basses, 'C2', 2, 2, vel=110, art='tenu')
    s.note(timbales, 'C2', 2, 2, vel=110, art='roulement')
    # l'accord final : ré MAJEUR (la tierce picarde), tenu sur toute la mesure
    final = ['D3', 'A3', 'D4', 'F#4', 'A4', 'D5']
    for h in final:
        s.note(choeur, h, s.m(2), 4, vel=118, art='aah')
    for h in ('D4', 'F#4', 'A4'):
        s.note(cors, h, s.m(2), 4, vel=118, art='tenu')
    for h in ('D5', 'F#5', 'A5'):
        s.note(trompettes, h, s.m(2), 4, vel=112, art='tenu')
    s.note(trombones, 'D3', s.m(2), 4, vel=116, art='tenu')
    s.note(trombones, 'A3', s.m(2), 4, vel=112, art='tenu')
    s.note(tuba, 'D2', s.m(2), 4, vel=116, art='tenu')
    for h in ('D5', 'F#5', 'A5', 'D6'):
        s.note(violons, h, s.m(2), 4, vel=110, art='tenu')
    for h in ('D3', 'A3', 'F#4'):
        s.note(altos, h, s.m(2), 4, vel=106, art='tenu')
    s.note(celles, 'D3', s.m(2), 4, vel=112, art='tenu')
    s.note(basses, 'D2', s.m(2), 4, vel=112, art='tenu')
    s.note(braam, 'D2', s.m(2), 3, vel=124)
    s.note(tamtam, 'C4', s.m(2), 4, vel=118)
    s.note(cymbales, 'C4', s.m(2), 2, vel=118)
    s.note(timbales, 'D2', s.m(2), 4, vel=118, art='roulement')
    s.diminuendo(timbales, s.m(2), s.m(2, 4.9), 'ff', 'p')
    s.note(sub, 'D2', s.m(2), 4, vel=90)
    # l'accord s'éteint (le tam-tam reste) : la boucle repart sur l'ostinato piano de A1
    # sans marche
    for piste in (choeur, cors, trompettes, trombones, tuba, violons, altos, celles, basses):
        s.expression(piste, [(s.m(2), 'ff'), (s.m(2, 2), 'mf'), (s.m(2, 4.9), 'ppp')])


theme.forme(intro=['intro'], corps=['A1', 'A2', 'A3', 'B', 'C', 'D1', 'D2'])
