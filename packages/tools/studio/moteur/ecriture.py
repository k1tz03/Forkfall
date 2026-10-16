"""L'écriture : tout ce qu'une partition importe (`from moteur.ecriture import *`).

Une partition est un fichier Python par thème (`partitions/<clé>.py`) qui déclare un
`Theme` : son tempo, sa mesure, sa tonalité, ses pistes (un instrument et son
réglage de mélange) et ses sections (des fonctions qui écrivent des notes). Le
guide complet, avec des exemples : docs/design/studio.md.

Les positions et les durées se comptent en TEMPS = noires, depuis le début de la
section (une mesure de 4/4 fait 4 temps, une de 6/8 en fait 3). `s.m(3)` est le
début de la mesure 3 de la section, `s.m(3, 2.5)` le milieu de son deuxième temps.
Les hauteurs s'écrivent en lettres, do central = C4 = 60.
"""
import re
from fractions import Fraction

from .theorie import (Tonalite, accord, accord_nomme, hauteur, nom, progression,
                      frequence, fondamentale, MODES, _RE_NOTE)

__all__ = [
    'Theme', 'Motif', 'Note', 'seq', 'mel', 'ostinato', 'arpege', 'grille', 'tenue',
    'accords', 'batterie', 'Tonalite', 'accord', 'accord_nomme', 'progression',
    'hauteur', 'nom', 'frequence', 'NUANCES', 'VELOCITES', 'MODES', 'pompe', 'porte',
    'reunir', 'enchainer',
]

# Les nuances : leur niveau d'expression (0..1, la piste entière) et leur vélocité.
NUANCES = {'ppp': 0.12, 'pp': 0.22, 'p': 0.35, 'mp': 0.5, 'mf': 0.65, 'f': 0.8, 'ff': 0.92, 'fff': 1.0}
VELOCITES = {'ppp': 20, 'pp': 32, 'p': 48, 'mp': 64, 'mf': 80, 'f': 96, 'ff': 112, 'fff': 124}


def _vel(v):
    if isinstance(v, str):
        return VELOCITES[v]
    return int(max(1, min(127, round(v))))


def _nombre(texte):
    """'1', '.5', '1/3', '3/2' → float."""
    return float(Fraction(texte)) if '/' in texte else float(texte)


class Note:
    """Une note : hauteur MIDI (ou nom de pièce de batterie), début et durée en
    temps, vélocité 1..127, articulation (None = celle de la piste), paramètres
    libres (glisse, coupure…)."""
    __slots__ = ('h', 't', 'd', 'v', 'art', 'p')

    def __init__(self, h, t, d, v=90, art=None, p=None):
        # une chaîne qui est une note (« D4 ») devient sa hauteur ; une autre est le
        # nom d'une pièce de batterie (« K », « S », « C »…)
        self.h = hauteur(h) if isinstance(h, str) and _RE_NOTE.match(h.strip()) else h
        self.t = float(t)
        self.d = float(d)
        self.v = _vel(v)
        self.art = art
        self.p = dict(p) if p else None

    def copie(self, **chg):
        n = Note.__new__(Note)
        n.h, n.t, n.d, n.v, n.art, n.p = self.h, self.t, self.d, self.v, self.art, (
            dict(self.p) if self.p else None)
        for k, v in chg.items():
            setattr(n, k, v)
        return n

    def __repr__(self):
        h = self.h if isinstance(self.h, str) else nom(self.h)
        return f'Note({h}, t={self.t:g}, d={self.d:g}, v={self.v}' + (
            f', {self.art}' if self.art else '') + ')'


class Motif:
    """Une suite de notes à positions relatives, qu'on transforme et qu'on pose.

    Les transformations rendent un nouveau motif : transpose(demi_tons),
    octave(n), diatonique(pas, tonalite), inverse(axe), retrograde(),
    augmente(facteur), diminue(facteur), decale(temps), vel(valeur ou +delta),
    art(articulation), repete(n), legato(), staccato(rapport), coupe(debut, fin).
    m1 + m2 enchaîne (m2 après la longueur de m1) ; m1 | m2 superpose."""

    def __init__(self, notes=(), longueur=None):
        self.notes = sorted(notes, key=lambda n: (n.t, str(n.h)))
        fin = max((n.t + n.d for n in self.notes), default=0.0)
        self.longueur = float(longueur) if longueur is not None else fin

    def __iter__(self):
        return iter(self.notes)

    def __len__(self):
        return len(self.notes)

    def __repr__(self):
        return f'Motif({len(self.notes)} notes, {self.longueur:g} temps)'

    def _map(self, f, longueur=None):
        return Motif([f(n) for n in self.notes],
                     self.longueur if longueur is None else longueur)

    def transpose(self, demi_tons):
        return self._map(lambda n: n.copie(h=n.h + demi_tons) if not isinstance(n.h, str) else n)

    def octave(self, k=1):
        return self.transpose(12 * k)

    def diatonique(self, pas, tonalite):
        """Monte ou descend de `pas` degrés dans la gamme (une marche harmonique)."""
        ton = Tonalite(tonalite) if isinstance(tonalite, str) else tonalite
        return self._map(lambda n: n.copie(h=ton.pas_diatonique(n.h, pas)) if not isinstance(n.h, str) else n)

    def inverse(self, axe=None):
        """Le renversement des intervalles autour d'`axe` (par défaut la première note)."""
        hs = [n.h for n in self.notes if not isinstance(n.h, str)]
        if not hs:
            return self
        a = hauteur(axe) if axe is not None else hs[0]
        return self._map(lambda n: n.copie(h=2 * a - n.h) if not isinstance(n.h, str) else n)

    def retrograde(self):
        L = self.longueur
        return Motif([n.copie(t=L - n.t - n.d) for n in self.notes], L)

    def augmente(self, facteur=2.0):
        return Motif([n.copie(t=n.t * facteur, d=n.d * facteur) for n in self.notes],
                     self.longueur * facteur)

    def diminue(self, facteur=2.0):
        return self.augmente(1.0 / facteur)

    def decale(self, temps):
        """Le déplacement rythmique : tout glisse de `temps` (la longueur reste)."""
        return Motif([n.copie(t=n.t + temps) for n in self.notes], self.longueur)

    def vel(self, v):
        """`vel(100)` fixe ; `vel('+10')` ou `vel(-12)` avec un signe en texte décale ;
        une fonction reçoit (note, rang) et rend la vélocité."""
        if callable(v):
            return Motif([n.copie(v=_vel(v(n, i))) for i, n in enumerate(self.notes)], self.longueur)
        if isinstance(v, str) and v[:1] in '+-':
            d = int(v)
            return self._map(lambda n: n.copie(v=_vel(n.v + d)))
        return self._map(lambda n: n.copie(v=_vel(v)))

    def art(self, articulation):
        return self._map(lambda n: n.copie(art=articulation))

    def params(self, **p):
        def f(n):
            q = dict(n.p or {})
            q.update(p)
            return n.copie(p=q)
        return self._map(f)

    def repete(self, n, periode=None):
        P = self.longueur if periode is None else periode
        notes = [x.copie(t=x.t + k * P) for k in range(n) for x in self.notes]
        return Motif(notes, P * n)

    def remplir(self, longueur):
        """Répète le motif jusqu'à `longueur` temps (la dernière fois est coupée)."""
        if self.longueur <= 0:
            return self
        notes = []
        k = 0
        while k * self.longueur < longueur - 1e-9:
            for x in self.notes:
                t = x.t + k * self.longueur
                if t < longueur - 1e-9:
                    notes.append(x.copie(t=t, d=min(x.d, longueur - t)))
            k += 1
        return Motif(notes, longueur)

    def coupe(self, debut, fin):
        return Motif([n.copie(t=n.t - debut, d=min(n.d, fin - n.t)) for n in self.notes
                      if debut <= n.t < fin], fin - debut)

    def legato(self, recouvre=0.0):
        """Chaque note tient jusqu'à la suivante (plus `recouvre` temps)."""
        notes = list(self.notes)
        sortie = []
        for i, n in enumerate(notes):
            suiv = next((m.t for m in notes[i + 1:] if m.t > n.t + 1e-9), self.longueur)
            sortie.append(n.copie(d=suiv - n.t + recouvre))
        return Motif(sortie, self.longueur)

    def staccato(self, rapport=0.5):
        return self._map(lambda n: n.copie(d=n.d * rapport))

    def __add__(self, autre):
        return Motif(self.notes + [n.copie(t=n.t + self.longueur) for n in autre.notes],
                     self.longueur + autre.longueur)

    def __or__(self, autre):
        return Motif(self.notes + autre.notes, max(self.longueur, autre.longueur))


def enchainer(*motifs):
    m = Motif()
    for x in motifs:
        m = m + x
    return m


def reunir(*motifs):
    m = Motif()
    for x in motifs:
        m = m | x
    return m


_ACCENTS = {'!': 22, '?': -30}


def _hauteurs(jeton):
    """'D4' → [62] ; 'D4+F4+A4' → [62, 65, 69] (un accord)."""
    return [hauteur(x) for x in jeton.split('+')]


def seq(texte, pas=0.25, vel=90, art=None):
    """Une grille de cases de `pas` temps (0.25 = doubles croches) : une hauteur
    attaque (« D4 », un accord « D4+F4+A4 »), « - » tient la note d'avant, « . » se
    tait ; « ! » après une note l'accentue, « ? » l'adoucit, « ~ » devant la fait
    glisser depuis la précédente (synthés). Les barres « | » sont décoratives.

        seq('D4 - - F4 . A4 - - | D5 - - - . . . .', pas=0.5)"""
    jetons = [j for j in texte.split() if j != '|']
    notes = []
    courantes = []
    for i, j in enumerate(jetons):
        t = i * pas
        if j == '-':
            for n in courantes:
                n.d += pas
            continue
        if j == '.':
            courantes = []
            continue
        glisse = j.startswith('~')
        j = j.lstrip('~')
        v = vel
        while j and j[-1] in _ACCENTS:
            v += _ACCENTS[j[-1]]
            j = j[:-1]
        courantes = [Note(h, t, pas, v, art, {'glisse': True} if glisse else None) for h in _hauteurs(j)]
        notes.extend(courantes)
    return Motif(notes, len(jetons) * pas)


def mel(texte, vel=90, art=None):
    """Une mélodie en hauteurs:durées (en temps) ; « r » est un silence :

        mel('D4:1 F4:.5 A4:.5 D5:2 r:1 C5:1/3 Bb4:1/3 A4:1/3')"""
    notes = []
    t = 0.0
    for j in texte.split():
        if j == '|':
            continue
        h, _, d = j.partition(':')
        d = _nombre(d) if d else 1.0
        v = vel
        while h and h[-1] in _ACCENTS:
            v += _ACCENTS[h[-1]]
            h = h[:-1]
        if h.lower() not in ('r', '.'):
            glisse = h.startswith('~')
            for x in _hauteurs(h.lstrip('~')):
                notes.append(Note(x, t, d, v, art, {'glisse': True} if glisse else None))
        t += d
    return Motif(notes, t)


def ostinato(notes, pas=0.25, longueur=None, vel=90, accents=None, art=None, duree=None):
    """Un ostinato : les notes, une par case de `pas`, répétées sur `longueur` temps.
    `accents` : une grille de vélocités (« X x x x x x X x », X fort, x moyen, o faible)
    ou une liste ; `duree` : la durée de chaque note (par défaut la case)."""
    if isinstance(notes, str):
        notes = notes.split()
    hs = [_hauteurs(n) if isinstance(n, str) else [n] for n in notes]
    if longueur is None:
        longueur = len(hs) * pas
    acc = None
    if isinstance(accents, str):
        acc = [{'X': min(127, vel + 24), 'x': vel, 'o': max(1, vel - 28), '.': None}[c]
               for c in accents.split()]
    elif accents is not None:
        acc = list(accents)
    sortie = []
    k = 0
    while k * pas < longueur - 1e-9:
        v = vel if acc is None else acc[k % len(acc)]
        if v is not None:
            for h in hs[k % len(hs)]:
                sortie.append(Note(h, k * pas, duree or pas, v, art))
        k += 1
    return Motif(sortie, longueur)


def arpege(notes_accord, motif='1 2 3 2', pas=0.25, longueur=None, vel=90, art=None, duree=None):
    """Un arpège dans un accord (liste de hauteurs) : `motif` cite ses notes par rang,
    1 = la plus grave ; un rang au-delà monte d'une octave (4 dans un accord de trois
    sons = la fondamentale à l'octave), 0 et les négatifs descendent ; « . » se tait."""
    ac = sorted(hauteur(h) for h in notes_accord)
    rangs = motif.split() if isinstance(motif, str) else list(motif)
    if longueur is None:
        longueur = len(rangs) * pas
    sortie = []
    k = 0
    while k * pas < longueur - 1e-9:
        r = rangs[k % len(rangs)]
        if r != '.':
            r = int(r)
            o, i = divmod(r - 1, len(ac))
            sortie.append(Note(ac[i] + 12 * o, k * pas, duree or pas, vel, art))
        k += 1
    return Motif(sortie, longueur)


def grille(texte, h, pas=0.25, vel=90, art=None):
    """Un rythme seul sur une hauteur (ou une liste qui tourne) : « x . . x . . x . »
    (X fort, x moyen, o faible, 1..9 une vélocité, - tient, . se tait)."""
    hs = [hauteur(x) for x in (h if isinstance(h, (list, tuple)) else [h])]
    jetons = [j for j in texte.split() if j != '|']
    notes = []
    der = None
    k = 0
    for i, c in enumerate(jetons):
        if c == '-':
            if der is not None:
                der.d += pas
            continue
        if c == '.':
            der = None
            continue
        v = _vel_lettre(c, vel)
        der = Note(hs[k % len(hs)], i * pas, pas, v, art)
        notes.append(der)
        k += 1
    return Motif(notes, len(jetons) * pas)


def _vel_lettre(c, vel):
    if c.isdigit():
        return max(1, min(127, 14 * int(c)))
    return {'X': min(127, vel + 26), 'x': vel, 'o': max(1, vel - 34), 'g': max(1, vel - 50)}.get(c, vel)


def tenue(notes, duree, vel=80, art=None):
    """Un accord tenu : toutes les notes ensemble pendant `duree` temps."""
    return Motif([Note(hauteur(h), 0, duree, vel, art) for h in notes], duree)


def accords(chiffres, tonalite, duree=4, octave=3, rythme=None, vel=80, art=None,
            conduite=True, etendu=False, basse=False, pas=0.25):
    """Une suite d'accords par chiffres romains (« i VI III VII »), chacun pendant
    `duree` temps (un nombre ou une liste) ; `rythme` (une grille « x . . x . . x . »
    de `pas`) les refrappe ; `basse` ajoute la fondamentale une octave sous l'accord."""
    if isinstance(chiffres, str):
        chiffres = chiffres.split()
    durees = duree if isinstance(duree, (list, tuple)) else [duree] * len(chiffres)
    voix = progression(chiffres, tonalite, octave=octave, conduite=conduite, etendu=etendu)
    notes = []
    t = 0.0
    for ch, ac, d in zip(chiffres, voix, durees):
        hs = list(ac)
        if basse:
            c, _, _ = fondamentale(ch, tonalite)
            b = min(ac) - ((min(ac) - c) % 12)
            hs = [b - 12 if b > min(ac) - 6 else b] + hs
        if rythme:
            m = grille(rythme, hs[0], pas=pas, vel=vel, art=art).remplir(d)
            for x in m.notes:
                for h in hs:
                    notes.append(x.copie(h=h, t=x.t + t))
        else:
            notes.extend(Note(h, t, d, vel, art) for h in hs)
        t += d
    return Motif(notes, t)


def batterie(texte, pas=0.25, vel=96):
    """Une grille de batterie, une ligne par pièce (« pièce : cases ») :

        K : x . . . x . . . x . . . x . . .
        S : . . . . X . . . . . . . X . . o
        H : x x x x x x x x x x x x x x x x

    X fort, x moyen, o fantôme, g très doux, 1..9 une vélocité, . rien, - tient.
    Les pièces sont celles de l'instrument (docs/design/studio.md, « Les pièces »)."""
    notes = []
    longueur = 0.0
    for ligne in texte.strip().splitlines():
        ligne = ligne.strip()
        if not ligne or ligne.startswith('#'):
            continue
        piece, sep, cases = ligne.partition(':')
        if not sep:
            raise ValueError(f'ligne de batterie sans « : » : {ligne!r}')
        piece = piece.strip()
        jetons = [j for j in cases.split() if j != '|']
        longueur = max(longueur, len(jetons) * pas)
        der = None
        for i, c in enumerate(jetons):
            if c == '-':
                if der is not None:
                    der.d += pas
                continue
            if c == '.':
                der = None
                continue
            der = Note(piece, i * pas, pas, _vel_lettre(c, vel))
            notes.append(der)
    return Motif(notes, longueur)


def pompe(profondeur=0.6, relache=0.2, source='temps', attaque=0.004, forme=2.0):
    """Le pompage par la grosse caisse (sidechain) : le volume de la piste plonge de
    `profondeur` (0..1) à chaque coup de `source` (le nom d'une piste, ou « temps »
    pour chaque noire) et remonte en `relache` secondes."""
    return {'profondeur': profondeur, 'relache': relache, 'source': source,
            'attaque': attaque, 'forme': forme}


def porte(duree=0.25, profondeur=1.0, relache=0.03):
    """La porte d'une réverbe (la caisse claire « gated ») : la queue s'ouvre à chaque
    coup de la piste et se ferme net après `duree` secondes."""
    return {'duree': duree, 'profondeur': profondeur, 'relache': relache}


# ---------------------------------------------------------------------------------
# Le thème, ses pistes, ses sections

_REGLAGES_PISTE = {
    'volume', 'pan', 'largeur', 'profondeur', 'salle', 'plaque', 'echo', 'bus', 'eq',
    'sature', 'comp', 'pompe', 'porte', 'humain', 'unisson', 'transpose', 'art',
    'legato', 'expression', 'synthe', 'kit', 'programme', 'retard', 'muet', 'solo',
    'octaves', 'filtre', 'glisse', 'mono', 'eclat', 'bref',
}


class Piste:
    def __init__(self, theme, nom, instrument, reglages):
        inconnus = set(reglages) - _REGLAGES_PISTE
        if inconnus:
            raise ValueError(f'piste {nom!r} : réglage inconnu {sorted(inconnus)} '
                             f'(connus : {", ".join(sorted(_REGLAGES_PISTE))})')
        self.theme = theme
        self.nom = nom
        self.instrument = instrument
        self.reglages = reglages

    def __repr__(self):
        return f'Piste({self.nom!r}, {self.instrument!r})'


class Mesure:
    def __init__(self, texte):
        if isinstance(texte, tuple):
            self.num, self.den = texte
        else:
            a, b = str(texte).split('/')
            self.num, self.den = int(a), int(b)
        self.temps = self.num * 4.0 / self.den      # en noires

    def __repr__(self):
        return f'{self.num}/{self.den}'


class Section:
    def __init__(self, nom, mesures, fonction, bpm, mesure, reprise):
        self.nom = nom
        self.mesures = mesures
        self.fonction = fonction
        self.bpm = bpm                  # un nombre, ou (début, fin) : une rampe
        self.mesure = mesure
        self.reprise = reprise

    @property
    def longueur(self):
        return self.mesures * self.mesure.temps


class Ecrivain:
    """Ce que reçoit la fonction d'une section : `s.joue(piste, motif, a=…)`…
    Les positions sont en temps depuis le début de la section."""

    def __init__(self, theme, section, fois, rang):
        self.theme = theme
        self.section = section
        self.fois = fois            # 0 à la première occurrence de la section dans la forme
        self.rang = rang            # la place de la section dans le segment
        self.tonalite = theme.tonalite
        self.evenements = []        # (piste, Note)
        self.courbes = []           # (piste, paramètre, [(t, v)…])

    @property
    def mesures(self):
        return self.section.mesures

    @property
    def tpm(self):
        """Les temps par mesure."""
        return self.section.mesure.temps

    @property
    def longueur(self):
        return self.section.longueur

    def m(self, n, t=1):
        """Le début de la mesure `n` (1 = la première de la section), au temps `t`."""
        return (n - 1) * self.tpm + (t - 1)

    def _piste(self, p):
        if isinstance(p, str):
            return self.theme.pistes[p]
        return p

    def note(self, piste, h, a, duree, vel=90, art=None, **params):
        self.evenements.append((self._piste(piste), Note(h, a, duree, vel, art, params or None)))

    def joue(self, piste, motif, a=0.0, fois=1, remplir=False, vel=None, art=None,
             transpose=0, jusqua=None):
        """Pose un motif à la position `a` ; `fois` le répète ; `remplir` le répète
        jusqu'à la fin de la section (ou jusqu'à `jusqua`)."""
        piste = self._piste(piste)
        if remplir or jusqua is not None:
            fin = self.longueur if jusqua is None else jusqua
            motif = motif.remplir(fin - a)
        elif fois > 1:
            motif = motif.repete(fois)
        for n in motif.notes:
            x = n.copie(t=n.t + a)
            if transpose and not isinstance(x.h, str):
                x.h += transpose
            if vel is not None:
                x.v = _vel(vel)
            if art is not None and x.art is None:
                x.art = art
            self.evenements.append((piste, x))
        return motif

    def seq(self, piste, texte, a=0.0, pas=0.25, vel=90, art=None, **kw):
        return self.joue(piste, seq(texte, pas=pas, vel=vel, art=art), a=a, **kw)

    def mel(self, piste, texte, a=0.0, vel=90, art=None, **kw):
        return self.joue(piste, mel(texte, vel=vel, art=art), a=a, **kw)

    def accords(self, piste, chiffres, a=0.0, duree=None, octave=3, **kw):
        chiffres = chiffres.split() if isinstance(chiffres, str) else chiffres
        if duree is None:
            duree = self.tpm
        opts = {k: kw.pop(k) for k in list(kw) if k in ('rythme', 'vel', 'art', 'conduite',
                                                        'etendu', 'basse', 'pas')}
        return self.joue(piste, accords(chiffres, self.tonalite, duree=duree, octave=octave, **opts),
                         a=a, **kw)

    def batterie(self, piste, texte, a=0.0, pas=0.25, vel=96, remplir=True, jusqua=None):
        return self.joue(piste, batterie(texte, pas=pas, vel=vel), a=a, remplir=remplir, jusqua=jusqua)

    def expression(self, piste, points):
        """La courbe d'expression d'une piste (0..1 ou une nuance), par points
        (temps, valeur) reliés en ligne droite : la piste entière monte ou descend
        (un crescendo d'échantillons change aussi de timbre). L'appel tient son premier
        point dès ce point et son dernier point jusqu'à l'appel suivant (de cette
        section ou d'une autre) : deux appels ne se rejoignent jamais en pente."""
        pts = [(float(t), NUANCES[v] if isinstance(v, str) else float(v)) for t, v in points]
        self.courbes.append((self._piste(piste), 'expression', pts))

    def nuance(self, piste, valeur, a=0.0):
        self.expression(piste, [(a, valeur)])

    def crescendo(self, piste, de_t, a_t, de='p', a='f'):
        self.expression(piste, [(de_t, de), (a_t, a)])

    def diminuendo(self, piste, de_t, a_t, de='f', a='p'):
        self.expression(piste, [(de_t, de), (a_t, a)])

    def automation(self, piste, parametre, points):
        """Une courbe libre : 'coupure' (le filtre d'un synthé, en multiple de sa
        coupure), 'volume' (dB), 'envoi' (multiple des envois)."""
        self.courbes.append((self._piste(piste), parametre, [(float(t), float(v)) for t, v in points]))


class Theme:
    """Un thème : Theme('ma_cle', 'Mon titre', bpm=96, mesure='4/4', tonalite='ré mineur')."""

    def __init__(self, cle, titre, bpm, mesure='4/4', tonalite='la mineur', graine=1,
                 ville=False, moment='', humeur='', boucle_min=None):
        self.cle = cle
        # la durée minimale de la boucle que le banc exige (None : 240 s pour un thème de
        # ville, 150 s sinon ; 0 : pas d'exigence, pour une démonstration ou un modèle)
        self.boucle_min = boucle_min
        self.titre = titre
        self.bpm = bpm
        self.mesure = Mesure(mesure)
        self.tonalite = Tonalite(tonalite) if isinstance(tonalite, str) else tonalite
        self.graine = graine
        self.ville = ville
        self.moment = moment
        self.humeur = humeur
        self.pistes = {}
        self.sections = {}
        self.intro = []
        self.corps = []
        self.reglages_bus = {}
        self.reglages_master = {}
        self.reglages_salles = {}

    def piste(self, nom, instrument=None, **reglages):
        """Une piste : un instrument (par défaut celui du même nom) et son mélange."""
        if nom in self.pistes:
            raise ValueError(f'piste en double : {nom!r}')
        p = Piste(self, nom, instrument or nom, reglages)
        self.pistes[nom] = p
        return p

    def section(self, nom, mesures, bpm=None, mesure=None, reprise=True):
        """Décorateur : la fonction écrit la section (elle reçoit l'écrivain `s`).
        `bpm` change le tempo (un nombre, ou (début, fin) pour une rampe) ;
        `reprise=False` : le jeu ne reprend jamais le thème à cette section."""
        def deco(f):
            if nom in self.sections:
                raise ValueError(f'section en double : {nom!r}')
            self.sections[nom] = Section(nom, mesures, f, bpm, Mesure(mesure) if mesure else self.mesure,
                                         reprise)
            return f
        return deco

    def forme(self, intro, corps):
        """L'ordre : `intro` (jouée une fois) puis `corps` (la boucle)."""
        self.intro = list(intro)
        self.corps = list(corps)
        for n in self.intro + self.corps:
            if n not in self.sections:
                raise ValueError(f'forme : section inconnue {n!r}')

    def bus(self, nom, **reglages):
        self.reglages_bus[nom] = reglages

    def salle(self, nom, **reglages):
        """Règle une réverbe : 'salle' (le grand hall), 'plaque', 'piece', 'echo'."""
        self.reglages_salles[nom] = reglages

    def master(self, **reglages):
        self.reglages_master = reglages
