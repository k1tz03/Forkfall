"""La théorie : les noms de notes, les tonalités, les modes, les accords.

Les hauteurs sont des numéros MIDI, do central = C4 = 60 (la convention anglaise,
celle de l'ancien moteur : « C5 B4 E5 G#4 »). On écrit les notes en lettres :
C D E F G A B, avec # ou b (et x, bb). Les tonalités se nomment en français ou
en anglais : « ré mineur », « fa# dorien », « si bémol majeur », « Dm », « Bb ».

Les accords par chiffres romains, dans une tonalité : majuscule = majeur,
minuscule = mineur, ° diminué, + augmenté, ø demi-diminué ; suffixes 7, maj7,
9, sus2, sus4, add9, 5 (quinte à vide) ; altération devant (bVI, bVII, #iv°) ;
renversement par /3 /5 /7 (la basse prend la tierce, la quinte, la septième) ;
accord secondaire par /chiffre (V7/iv : la dominante du quatrième degré).
"""
import re

LETTRES = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
LETTRES_FR = {'do': 0, 'ré': 2, 're': 2, 'mi': 4, 'fa': 5, 'sol': 7, 'la': 9, 'si': 11}
NOMS_DIESES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

MODES = {
    'majeur': (0, 2, 4, 5, 7, 9, 11),
    'ionien': (0, 2, 4, 5, 7, 9, 11),
    'dorien': (0, 2, 3, 5, 7, 9, 10),
    'phrygien': (0, 1, 3, 5, 7, 8, 10),
    'lydien': (0, 2, 4, 6, 7, 9, 11),
    'mixolydien': (0, 2, 4, 5, 7, 9, 10),
    'mineur': (0, 2, 3, 5, 7, 8, 10),
    'éolien': (0, 2, 3, 5, 7, 8, 10),
    'locrien': (0, 1, 3, 5, 6, 8, 10),
    'mineur harmonique': (0, 2, 3, 5, 7, 8, 11),
    'mineur mélodique': (0, 2, 3, 5, 7, 9, 11),
    'phrygien dominant': (0, 1, 4, 5, 7, 8, 10),
}
ALIAS_MODES = {
    'major': 'majeur', 'maj': 'majeur', 'minor': 'mineur', 'min': 'mineur', 'm': 'mineur',
    'eolien': 'éolien', 'aeolian': 'éolien', 'dorian': 'dorien', 'phrygian': 'phrygien',
    'lydian': 'lydien', 'mixolydian': 'mixolydien', 'locrian': 'locrien',
    'harmonique': 'mineur harmonique', 'melodique': 'mineur mélodique',
    'mineur melodique': 'mineur mélodique', 'mélodique': 'mineur mélodique',
}

_RE_NOTE = re.compile(r'^([A-Ga-g])(#|x|b|bb|♯|♭)?(-?\d+)$')


def hauteur(n):
    """'C4' → 60, 'F#2' → 42, 'Bb3' → 58 ; un nombre passe tel quel."""
    if isinstance(n, (int, float)):
        return n
    m = _RE_NOTE.match(n.strip())
    if not m:
        raise ValueError(f"note illisible : {n!r} (écrire par exemple 'D4', 'F#2', 'Bb3')")
    lettre, alt, octave = m.groups()
    v = LETTRES[lettre.upper()] + 12 * (int(octave) + 1)
    v += {None: 0, '#': 1, '♯': 1, 'x': 2, 'b': -1, '♭': -1, 'bb': -2}[alt]
    return v


def nom(midi):
    """60 → 'C4' (les altérations en dièses)."""
    midi = int(round(midi))
    return f'{NOMS_DIESES[midi % 12]}{midi // 12 - 1}'


def frequence(midi, la=440.0):
    return la * 2.0 ** ((midi - 69) / 12.0)


def _classe(texte):
    """« ré », « fa# », « si bémol », « Bb », « F# » → classe de hauteur 0..11."""
    t = texte.strip().lower().replace('♯', '#').replace('♭', 'b')
    t = t.replace(' dièse', '#').replace('dièse', '#').replace(' bémol', 'b').replace('bémol', 'b')
    t = t.replace(' diese', '#').replace(' bemol', 'b')
    for base in sorted(LETTRES_FR, key=len, reverse=True):
        if t.startswith(base):
            reste = t[len(base):]
            return (LETTRES_FR[base] + {'': 0, '#': 1, 'b': -1}[reste]) % 12
    if t and t[0].upper() in LETTRES:
        reste = t[1:]
        return (LETTRES[t[0].upper()] + {'': 0, '#': 1, 'b': -1}[reste]) % 12
    raise ValueError(f'tonique illisible : {texte!r}')


class Tonalite:
    """Une tonique et un mode. Tonalite('ré mineur'), Tonalite('F# dorien'), Tonalite('Dm')."""

    def __init__(self, texte):
        self.texte = texte
        t = texte.strip()
        m = re.match(r'^([A-G])([#b]?)(m?)$', t)          # « Dm », « Bb », « F#m »
        if m:
            self.tonique = _classe(m.group(1) + m.group(2))
            self.mode = 'mineur' if m.group(3) else 'majeur'
        else:
            mots = t.split()
            # la tonique peut faire deux mots (« si bémol ») : on essaie le plus long
            for k in (2, 1):
                try:
                    self.tonique = _classe(' '.join(mots[:k]))
                    reste = ' '.join(mots[k:]).lower() or 'majeur'
                    break
                except (ValueError, KeyError):
                    continue
            else:
                raise ValueError(f'tonalité illisible : {texte!r}')
            reste = ALIAS_MODES.get(reste, reste)
            if reste not in MODES:
                raise ValueError(f'mode inconnu : {reste!r} (connus : {", ".join(MODES)})')
            self.mode = reste
        self.gamme = MODES[self.mode]

    def __repr__(self):
        return f'Tonalite({self.texte!r})'

    def degre(self, n, octave=4):
        """La note du n-ième degré (1 = la tonique) dans l'octave donnée ; n peut
        dépasser 7 (l'octave d'au-dessus) ou descendre sous 1."""
        i = n - 1
        o, r = divmod(i, 7)
        return 12 * (octave + 1 + o) + self.tonique + self.gamme[r]

    def note(self, n, octave=4):
        return self.degre(n, octave)

    def dans(self, midi):
        return (int(midi) - self.tonique) % 12 in self.gamme

    def pas_diatonique(self, midi, pas):
        """Monte (ou descend) de `pas` degrés de la gamme à partir de `midi`
        (une note hors gamme est d'abord rabattue sur le degré d'en dessous)."""
        midi = int(midi)
        rel = (midi - self.tonique) % 12
        base = midi - rel
        idx = max(i for i, g in enumerate(self.gamme) if g <= rel)
        reste = rel - self.gamme[idx]
        o, r = divmod(idx + pas, 7)
        return base + 12 * o + self.gamme[r] + reste


_RE_CHIFFRE = re.compile(
    r'^(?P<alt>b|♭|#|♯)?(?P<rom>VII|VI|IV|V|III|II|I|vii|vi|iv|v|iii|ii|i)'
    r'(?P<qual>°|o|ø|\+)?(?P<ext>maj7|maj9|7|9|sus2|sus4|add9|add2|5|6)?'
    r'(?P<ext2>sus2|sus4|add9)?(?:/(?P<sur>[^/]+))?$')
_ROMAINS = {'i': 1, 'ii': 2, 'iii': 3, 'iv': 4, 'v': 5, 'vi': 6, 'vii': 7}


def _intervalles(majeur, qual, ext, ext2):
    """Les intervalles d'un accord depuis sa fondamentale."""
    if qual in ('°', 'o'):
        tri = [0, 3, 6]
    elif qual == 'ø':
        tri = [0, 3, 6]
    elif qual == '+':
        tri = [0, 4, 8]
    else:
        tri = [0, 4, 7] if majeur else [0, 3, 7]
    iv = list(tri)
    for e in (ext, ext2):
        if not e:
            continue
        if e == '5':
            iv = [0, 7, 12]
        elif e == 'sus2':
            iv = [0, 2, 7] + [x for x in iv if x > 7]
        elif e == 'sus4':
            iv = [0, 5, 7] + [x for x in iv if x > 7]
        elif e in ('add9', 'add2'):
            iv = iv + [14]
        elif e == '6':
            iv = iv + [9]
        elif e == '7':
            if qual in ('°', 'o'):
                iv = iv + [9]          # septième diminuée
            elif qual == 'ø':
                iv = iv + [10]
            else:
                iv = iv + [10]         # dominante (majuscule) ou mineure 7
        elif e == 'maj7':
            iv = iv + [11]
        elif e == '9':
            iv = iv + [10, 14]
        elif e == 'maj9':
            iv = iv + [11, 14]
    return iv


def fondamentale(chiffre, tonalite):
    """Un chiffre romain dans `tonalite` → (classe de la fondamentale, intervalles,
    renversement imposé par /3 /5 /7 ou None)."""
    if isinstance(tonalite, str):
        tonalite = Tonalite(tonalite)
    m = _RE_CHIFFRE.match(chiffre.strip())
    if not m:
        raise ValueError(f'accord illisible : {chiffre!r} (par exemple « i », « bVI », « V7/iv », « iv/3 »)')
    rom = m.group('rom')
    deg = _ROMAINS[rom.lower()]
    majeur = rom.isupper()
    alt = m.group('alt')
    if alt:
        # une altération se lit sur la gamme MAJEURE de la tonique (l'usage des
        # analyses modernes) : en ré mineur comme en ré majeur, bVI = si bémol,
        # bVII = do, bIII = fa ; sans altération, le degré de la gamme du mode
        racine = tonalite.tonique + MODES['majeur'][deg - 1]
        racine += {'b': -1, '♭': -1, '#': 1, '♯': 1}[alt]
    else:
        racine = tonalite.tonique + tonalite.gamme[deg - 1]
    iv = _intervalles(majeur, m.group('qual'), m.group('ext'), m.group('ext2'))
    sur = m.group('sur')
    if sur:
        if sur in ('3', '5', '7'):
            return racine % 12, iv, {'3': 1, '5': 2, '7': 3}[sur]
        # accord secondaire : X/Y = l'accord X pris dans la tonalité dont Y est la tonique
        c_sur, _, _ = fondamentale(sur, tonalite)
        mineur = sur.strip('b#♭♯')[:1].islower()
        ton2 = Tonalite(NOMS_DIESES[c_sur % 12] + ('m' if mineur else ''))
        return fondamentale(chiffre.split('/')[0], ton2)
    return racine % 12, iv, None


def accord(chiffre, tonalite, octave=3, renversement=0, etendu=False):
    """Les notes MIDI d'un chiffre romain : accord('i', 'ré mineur') → [50, 53, 57].

    octave : l'octave de la fondamentale ; renversement : 0, 1, 2 (ou /3 /5 /7 dans
    le chiffre) ; etendu : position large (fondamentale grave, quinte, dixième…)."""
    if isinstance(tonalite, str):
        tonalite = Tonalite(tonalite)
    c, iv, basse = fondamentale(chiffre, tonalite)
    racine = 12 * (octave + 1) + c
    notes = [racine + i for i in iv]
    if basse is not None:
        renversement = basse
    for _ in range(renversement):
        notes = notes[1:] + [notes[0] + 12]
    if etendu and len(notes) >= 3:
        # position large : la fondamentale, la quinte, puis la tierce à l'octave
        r = notes[0]
        autres = sorted(notes[1:])
        notes = [r] + [n if n - r >= 7 else n + 12 for n in autres]
        notes = sorted(notes)
    return notes


def accord_nomme(symbole, octave=3):
    """Les notes d'un accord nommé : 'Dm', 'F', 'Bb7', 'Esus4', 'D5', 'C/E', 'Amaj7'."""
    m = re.match(r'^([A-G][#b]?)(m(?!aj))?(°|dim|\+|aug|ø)?(maj7|maj9|7|9|sus2|sus4|add9|5|6)?(?:/([A-G][#b]?))?$',
                 symbole.strip())
    if not m:
        raise ValueError(f'accord illisible : {symbole!r}')
    racine, mineur, qual, ext, basse = m.groups()
    q = {'dim': '°', 'aug': '+'}.get(qual, qual)
    iv = _intervalles(not mineur, q, ext, None)
    r = 12 * (octave + 1) + _classe(racine)
    notes = [r + i for i in iv]
    if basse:
        b = _classe(basse)
        b = 12 * (octave + 1) + b
        while b >= notes[0]:
            b -= 12
        notes = [b] + notes
    return notes


def progression(chiffres, tonalite, octave=3, conduite=True, etendu=False):
    """Une suite d'accords (« i VI III VII ») ; avec `conduite`, chaque accord prend
    le renversement le plus proche du précédent (les voix bougent peu)."""
    if isinstance(chiffres, str):
        chiffres = chiffres.split()
    sortie = []
    prec = None
    for ch in chiffres:
        base = accord(ch, tonalite, octave=octave, etendu=etendu)
        if conduite and prec is not None and '/' not in ch:
            candidats = []
            for r in range(len(base)):
                notes = list(base)
                for _ in range(r):
                    notes = notes[1:] + [notes[0] + 12]
                for dec in (-12, 0, 12):
                    n2 = [x + dec for x in notes]
                    cout = sum(min(abs(a - b) for b in prec) for a in n2)
                    # rester près de l'octave demandée
                    cout += 0.3 * abs(sum(n2) / len(n2) - sum(base) / len(base))
                    candidats.append((cout, n2))
            base = min(candidats, key=lambda c: c[0])[1]
        sortie.append(base)
        prec = base
    return sortie
