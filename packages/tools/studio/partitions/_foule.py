"""FUSIBLE — le studio : « Le virage » (_foule), un exemple, pas un thème du jeu : huit
mesures pour entendre la foule du stade et ses mains.

  m. 1–2  la foule chante la tête d'un motif à l'unisson, dans le grave (la2–fa3), sur
          « o » ; la grosse caisse frappe les temps 1 et 3, la tribune les temps 2 et 4
  m. 3–4  la même tête sur « ah », la foule un peu plus fort
  m. 5–6  la tête une octave plus haut, resserrée dans la3–ré4, la foule à pleine voix
  m. 7    la dernière note tenue, les mains continuent
  m. 8    l'ovation : les mains sans pulsation, la clameur ; la foule retombe en rumeur

Rendre et mesurer :
    python3 packages/tools/studio/rendre.py packages/tools/studio/partitions/_foule.py \\
        --out /tmp/foule --banc --pistes
"""
from moteur.ecriture import *

theme = Theme('_foule', 'Le virage', bpm=96, mesure='4/4', tonalite='la mineur', graine=1907,
              boucle_min=0, moment='exemple (pas un thème du jeu)', humeur='un stade qui chante')

foule = theme.piste('foule', volume=0)
mains = theme.piste('mains', 'applaudissements', volume=-3)
grosse = theme.piste('grosse_caisse', volume=-1)
basse = theme.piste('basse', 'contrebasses', art='pizzicato', volume=-8)

# la tête : la, mi | fa tenu (la sixte mineure qui mord), do si | ré, la longue
TETE = mel('A2:.5 E3:.5 F3:2 C3:.5 B2:.5 | D3:1 A2:3')
# la même, resserrée dans la3–ré4 (la quarte remplace la quinte)
HAUTE = mel('A3:.5 C4:.5 D4:2 C4:.5 B3:.5 | C4:1 A3:3')


@theme.section('A', mesures=8)
def A(s):
    s.joue(foule, TETE, a=s.m(1), vel=96, art='o')
    s.joue(foule, TETE, a=s.m(3), vel=104, art='ah')
    s.joue(foule, HAUTE, a=s.m(5), vel=112, art='o')
    s.note(foule, 'A3', s.m(7), 4, vel=112, art='o')
    s.note(foule, 'A3', s.m(8), 6, vel=90, art='rumeur')
    # la grosse caisse aux temps 1 et 3, les mains aux temps 2 et 4, jusqu'à l'ovation
    s.batterie(grosse, 'K : X . . . . . . . X . . . . . . .', jusqua=s.m(8))
    s.note(grosse, 'C4', s.m(8), 1, vel=118)
    s.joue(mains, grille('. . . . X . . . . . . . X . . .', 'C4', vel=100), a=0, fois=7)
    s.note(mains, 'C4', s.m(8), 4, vel=112, art='ovation')
    s.crescendo(mains, s.m(8), s.m(8, 4), 'mf', 'ff')
    for m, r in enumerate(['A1', 'A1', 'F1', 'E1', 'A1', 'F1', 'E1'], start=1):
        s.joue(basse, grille('X . . . . . . . X . . . . . . .', r), a=s.m(m))


theme.forme(intro=[], corps=['A'])
