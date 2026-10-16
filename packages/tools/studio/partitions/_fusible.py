"""FUSIBLE — le matériau commun des vingt thèmes : le motif « Fusible » et l'arc.

Pas un thème (le nom commence par « _ ») : un module que les partitions importent, pour
que le motif et le son-signature soient les mêmes d'un thème à l'autre. Ils viennent du
thème principal, `partitions/accueil.py` (« La tribune »), qui les garde écrits en clair.

    from partitions._fusible import phrase, Arc

    MOTIF = phrase('motif', 'ré mineur')          # un Motif, comme mel() : ré la | sib ── fa mi | sol ré
    REPONSE = phrase('reponse', 'ré mineur', octave=4)
    arc = Arc(theme)                              # ajoute ses pistes au thème (à l'écriture des pistes)
    ...
    arc.poser(s, s.m(1))                          # dans une section : l'arc, accordé sur la tonique

LE MOTIF, en degrés de la gamme du thème : le mode fait l'habit (recette § 1.3). En éolien
la 6 est la ♭6 (la mèche) et la 3 la ♭3 ; en dorien la 6 devient 6 ; en phrygien la 2
devient ♭2 ; en majeur et en lydien la 3 est majeure (et la 4 ♯4 en lydien). Une phrase
commence par son anacrouse (deux croches, un temps) : poser `a=s.m(n, 4)` met le « BLE »
sur le premier temps de la mesure n + 1.

    tête      1 5 | 6 ──                         (le signal)
    motif     1 5 | 6 ── ── 3 2 | 4 1 ── (·)     (la mèche, puis la chute)
    réponse   1 5 | 6 ── ── 7 8 | 5 ── ──        (essaie la montée, retombe d'une quarte)
    montée    1 5 | 6 ── 7 ── | 8 ── ── ──       (la victoire : sur ♭VI ♭VII | I)
    mèche     1 5 | 6 ── ── ── ── ── ──          (la menace : la ♭6 qui ne se résout pas)
    anacrouse 1 5

L'ARC, le son-signature : un claquement électrique, la mèche qui saute — six micro-clics
irréguliers, un grésillement (une scie sur la tonique, toutes ses harmoniques sont des
toniques), un bruit en bande étroite qui tombe vers la tonique, une note accordée sur la
tonique qui s'éteint en une seconde, et un impact grave. On l'entend à découvert : au
début d'un thème, et deux ou trois fois au plus dans sa boucle.
"""
from moteur.ecriture import mel
from moteur.theorie import Tonalite, nom

# les phrases : (degré, durée en temps) ; None est un silence
PHRASES = {
    'tete': [(1, .5), (5, .5), (6, 3)],
    'motif': [(1, .5), (5, .5), (6, 3), (3, .5), (2, .5), (4, 1), (1, 1.75), (None, .25)],
    'reponse': [(1, .5), (5, .5), (6, 3), (7, .5), (8, .5), (5, 2.75), (None, .25)],
    'montee': [(1, .5), (5, .5), (6, 2), (7, 2), (8, 4)],
    'meche': [(1, .5), (5, .5), (6, 7)],
    'anacrouse': [(1, .5), (5, .5)],
}


def phrase(cle, tonalite, octave=3, vel=90, art=None):
    """La phrase `cle` (tete, motif, reponse, montee, meche, anacrouse) dans la tonalité
    et son mode, la tonique à l'octave dite (3 : la tonique du thème principal, la3) :
    un Motif qu'on transforme et qu'on pose comme les autres."""
    ton = tonalite if isinstance(tonalite, Tonalite) else Tonalite(tonalite)
    jetons = []
    for degre, duree in PHRASES[cle]:
        h = 'r' if degre is None else nom(ton.degre(degre, octave))
        jetons.append(f'{h}:{duree:g}')
    return mel(' '.join(jetons), vel=vel, art=art)


# --- l'arc : quatre voix de synthèse (des patchs complets, voir moteur/synthe.py) ---------
_ZAP = {'osc': [], 'bruit': 1.0, 'sub': 0.0,
        'filtre': {'type': 'bande', 'q': 6.0, 'coupure': 261.6, 'suivi': 1.0, 'env': 1.4,
                   'a': 0.0005, 'd': 0.12, 's': 0.0, 'r': 0.03, 'drive': 1.0},
        'amp': {'a': 0.0006, 'd': 0.16, 's': 0.0, 'r': 0.04}, 'velocite': 0.4, 'vel_filtre': 0.0}
_CLIC = {'osc': [], 'bruit': 1.0, 'sub': 0.0,
         'filtre': {'type': 'bande', 'q': 2.5, 'coupure': 523.2, 'suivi': 1.0, 'env': 0.0,
                    'a': 0.0005, 'd': 0.01, 's': 1.0, 'r': 0.005},
         'amp': {'a': 0.0002, 'd': 0.004, 's': 0.0, 'r': 0.004}, 'velocite': 0.6, 'vel_filtre': 0.0}
_BZZ = {'osc': [{'forme': 'scie', 'niveau': 1.0},
                {'forme': 'carre', 'niveau': 0.5, 'largeur': 0.2, 'desaccord': 9}],
        'sub': 0.0,
        'filtre': {'type': 'bande', 'q': 1.6, 'coupure': 2200.0, 'suivi': 0.0, 'env': 0.5,
                   'a': 0.001, 'd': 0.05, 's': 0.0, 'r': 0.02, 'drive': 1.0},
        'amp': {'a': 0.0008, 'd': 0.06, 's': 0.45, 'r': 0.012}, 'velocite': 0.5, 'vel_filtre': 0.0,
        'drive': 1.5}
_TON = {'osc': [{'forme': 'sinus', 'niveau': 0.8}, {'forme': 'carre', 'niveau': 0.35, 'largeur': 0.5},
                {'forme': 'sinus', 'octave': 1, 'niveau': 0.3}],
        'sub': 0.0,
        'filtre': {'type': 'echelle', 'coupure': 1500.0, 'resonance': 0.3, 'env': 1.5, 'suivi': 0.0,
                   'a': 0.001, 'd': 0.4, 's': 0.0, 'r': 0.3, 'drive': 1.0},
        'amp': {'a': 0.0015, 'd': 1.1, 's': 0.0, 'r': 0.4}, 'velocite': 0.4, 'vel_filtre': 0.0}
# les clics : (décalage en secondes, centre de la bande, vélocité) — des bruits, pas des notes
_CLICS = ((0.0, 'E6', 120), (0.017, 'B5', 100), (0.031, 'G6', 110), (0.058, 'C6', 90),
          (0.083, 'F#6', 105), (0.121, 'A5', 80))
# le grésillement : (décalage, durée, vélocité), en secondes
_GRESILLE = ((0.0, 0.035, 118), (0.05, 0.028, 100), (0.094, 0.06, 112))


def _temps_par_seconde(s):
    """Combien de temps (noires) dure une seconde au début de la section."""
    b = s.section.bpm or s.theme.bpm
    if isinstance(b, (tuple, list)):
        b = b[0]
    return b / 60.0


class Arc:
    """Les voix de l'arc, ajoutées au thème (quatre pistes de synthèse et l'impact), et sa pose.
    `volume` décale les quatre voix ensemble (dB) ; le thème principal les règle à 0."""

    def __init__(self, theme, volume=0.0, impact_volume=-4.0):
        r = {'bus': 'conception', 'humain': 0, 'pan': 0.0, 'profondeur': 0.15, 'salle': 0.16,
             'plaque': 0.22}
        self.zap = theme.piste('arc_zap', 'arpege_synthe', synthe=_ZAP, volume=-3 + volume, largeur=0.5,
                               eq={'passe_haut': 400, 'passe_bas': 9000}, **r)
        self.clics = theme.piste('arc_clics', 'arpege_synthe', synthe=_CLIC, volume=6 + volume,
                                 largeur=0.9, eq={'passe_haut': 600, 'passe_bas': 9000}, **r)
        self.bzz = theme.piste('arc_bzz', 'arpege_synthe', synthe=_BZZ, volume=-4 + volume, largeur=0.4,
                               eq={'passe_haut': 300, 'passe_bas': 8000}, **r)
        self.ton = theme.piste('arc_ton', 'arpege_synthe', synthe=_TON, volume=-11 + volume, largeur=0.3, **r)
        self.impact = theme.piste('arc_impact', 'effets', volume=impact_volume)
        self.tonique = theme.tonalite.tonique      # la classe de hauteur (0 = do)

    def _note(self, octave):
        return 12 * (octave + 1) + self.tonique

    def poser(self, s, a, impact=True, vel=118):
        """L'arc à la position `a` (en temps, dans la section `s`), accordé sur la tonique."""
        sec = _temps_par_seconde(s)
        for dt, h, v in _CLICS:
            s.note(self.clics, h, a + dt * sec, 0.004 * sec, vel=v)
        for dt, d, v in _GRESILLE:
            s.note(self.bzz, self._note(2), a + dt * sec, d * sec, vel=v)
        s.note(self.zap, self._note(6), a, 0.18 * sec, vel=vel)
        s.note(self.ton, self._note(5), a + 0.004 * sec, 1.0 * sec, vel=110)
        s.note(self.ton, self._note(6), a + 0.004 * sec, 0.3 * sec, vel=86)
        if impact:
            s.note(self.impact, self._note(1), a, 2, vel=112, art='impact')

