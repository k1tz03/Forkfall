"""FUSIBLE — le studio : le MODÈLE d'une partition (un fichier dont le nom commence par
« _ » est un modèle ou un brouillon, pas un thème du jeu). Huit mesures, toutes les
tournures de l'écriture, chacune une fois, commentée. Copier ce fichier en
`partitions/<clé>.py`, changer la clé, le titre, puis écrire.

Rendre et mesurer :
    python3 packages/tools/studio/rendre.py packages/tools/studio/partitions/_modele.py \\
        --out /tmp/modele --banc --pistes

La carte des sections, AVANT les notes (la forme, l'énergie, les mesures) :
  A   4 m.  88  le piano expose le motif (cinq notes), les cordes tiennent ; la basse
              respire sous la grosse caisse ; pp → mp
  B   4 m.  88  le motif monte d'une tierce, les violoncelles lui répondent, la
              batterie s'ouvre ; mp → mf ; la dernière mesure relance la première
Le corps (la boucle) : A B, 8 mesures ≈ 22 s (un vrai thème de ville en fait ≥ 240 s).
"""
from moteur.ecriture import *

# 1. Le thème : sa clé (le nom du fichier), son titre, son tempo, sa mesure, sa
#    tonalité, une graine (l'humanisation est tirée d'elle : même graine, même son).
theme = Theme('_modele', 'Le Modèle', bpm=88, mesure='4/4', tonalite='fa mineur', graine=7,
              moment='modèle d\'écriture (pas un thème du jeu)', humeur='la ville la nuit',
              boucle_min=0)

# 2. Les pistes : un nom, un instrument (docs/design/studio.md, « Les instruments »), le
#    mélange. Par défaut chaque instrument a sa place (pan), sa profondeur, sa salle ;
#    on ne règle que ce qui change. `volume` en dB : le mélange se fait au banc
#    (rendre.py --pistes donne la sonie de chaque piste).
piano = theme.piste('piano', volume=0, salle=0.3)
violons = theme.piste('violons', volume=4, art='tremolo')           # articulation par défaut
celles = theme.piste('violoncelles', volume=-3, art='legato')
pizz = theme.piste('pizz', 'contrebasses', art='pizzicato', volume=-5)
kick = theme.piste('kick', 'boite_a_rythmes', volume=-3)
charley = theme.piste('charley', 'boite_a_rythmes', volume=-5, pan=0.3)
# la basse pompe sous la grosse caisse (la piste « kick ») ; un filtre plus sombre
basse = theme.piste('basse', 'basse_synthe', volume=-8, pompe=pompe(0.5, 0.2, source='kick'),
                    synthe={'filtre': {'coupure': 220.0}})
nappe = theme.piste('nappe', 'nappe_synthe', volume=-10, humain=0)

# 3. Le matériau, nommé : on le réutilise et on le transforme (transpose, octave,
#    diatonique, inverse, retrograde, augmente, diminue, decale, vel, staccato…).
MOTIF = mel('C5:.5 Ab4:.5 G4:1 F4:.75 G4:.25 Ab4:2')     # hauteur:durée (en temps)
GRILLE = 'i VI iv V'                                      # une mesure par accord


@theme.section('A', mesures=4)
def A(s):
    # le motif, deux fois : la seconde fois décalé d'une croche (le même, mais inquiet)
    s.joue(piano, MOTIF, a=s.m(1), vel=78)
    s.joue(piano, MOTIF.decale(0.5).vel('-8'), a=s.m(3))
    # les accords par chiffres romains, tenus ; `conduite` (par défaut) rapproche les voix
    s.accords(violons, GRILLE, octave=4, vel=70)
    s.accords(nappe, GRILLE, octave=3, vel=60)
    # la basse : un ostinato de croches sur la fondamentale de chaque accord ; les
    # pizzicati une octave sous elle, sauf sous le mi 1 des contrebasses (28)
    for m, ch in enumerate(GRILLE.split(), start=1):
        r = accord(ch, s.tonalite, octave=2)[0]
        s.joue(basse, ostinato([r, r, r + 12, r], pas=0.5, accents='X x o x'), a=s.m(m), fois=2)
        s.joue(pizz, grille('x . . . x . . .', r - 12 if r - 12 >= 28 else r, pas=0.5), a=s.m(m))
    # la batterie : une ligne par pièce, seize cases par mesure ; `remplir` (par défaut)
    # la répète jusqu'à la fin de la section
    s.batterie(kick, 'K : X . . . . . . . X . . . . . . .')
    s.batterie(charley, 'H : . . x . . . x . . . x . . . x o')
    # l'expression : pp au début, mp à la fin (le crescendo change aussi le timbre)
    s.crescendo(violons, 0, s.longueur, 'pp', 'mp')


@theme.section('B', mesures=4)
def B(s):
    grille_b = 'i VII VI V'
    # le motif une tierce plus haut dans la gamme (une marche diatonique)
    s.joue(piano, MOTIF.diatonique(2, s.tonalite), a=s.m(1), vel=84)
    # la réponse des violoncelles : le motif renversé, augmenté, une octave plus bas
    s.joue(celles, MOTIF.inverse().augmente(2).octave(-1).coupe(0, 8), a=s.m(3), vel=80)
    s.accords(violons, grille_b, octave=4, vel=76)
    s.accords(nappe, grille_b, octave=3, vel=64)
    for m, ch in enumerate(grille_b.split(), start=1):
        r = accord(ch, s.tonalite, octave=2)[0]
        s.joue(basse, ostinato([r, r, r + 12, r], pas=0.5, accents='X x o x'), a=s.m(m), fois=2)
        s.joue(pizz, grille('x . . x x . . .', r - 12 if r - 12 >= 28 else r, pas=0.5), a=s.m(m))
    s.batterie(kick, 'K : X . . . . . X . X . . . . . . .', jusqua=s.m(4))
    s.batterie(charley, 'H : x . x . x . x . x . x . x . x o')
    s.crescendo(violons, 0, s.longueur, 'mp', 'mf')
    # la relance : la dernière mesure prépare la première (un roulement de croches)
    s.batterie(kick, 'K : X . . . X . . . X . X . X X X X', a=s.m(4), jusqua=s.m(5))


# 4. La forme : l'introduction (jouée une fois, ici aucune), puis le corps (la boucle).
theme.forme(intro=[], corps=['A', 'B'])
