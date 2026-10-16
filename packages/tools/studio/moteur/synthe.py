"""Le synthétiseur : des voix soustractives calculées avec numpy (oscillateurs à
bande limitée, filtre en échelle à résonance et enveloppe, glissando, sous-basse,
bruit), les sons de conception (montées, impacts, la couche de synthé du « braam »)
et la boîte à rythmes (grosse caisse, caisse claire, claps, charleston).

Chaque note est calculée seule, à partir de sa hauteur, de sa durée et d'une graine
tirée de la note elle-même : un même passage rend les mêmes échantillons, et deux
passages de la boucle sont identiques (la couture est parfaite)."""
import hashlib

import numpy as np

from . import dsp, noyau
from .dsp import SR
from .theorie import frequence

# ---------------------------------------------------------------------------------
# Oscillateurs à bande limitée (PolyBLEP)


def _polyblep(t, dt):
    y = np.zeros_like(t)
    m = t < dt
    x = t[m] / dt[m] if np.ndim(dt) else t[m] / dt
    y[m] = 2 * x - x * x - 1
    m2 = t > 1 - dt
    x = (t[m2] - 1) / (dt[m2] if np.ndim(dt) else dt)
    y[m2] = x * x + 2 * x + 1
    return y


def phase(freq, phase0=0.0):
    """La phase (0..1) d'un oscillateur dont la fréquence suit le tableau `freq`."""
    inc = np.atleast_1d(np.asarray(freq, dtype=np.float64)) / SR
    ph = phase0 + np.cumsum(inc) - inc[0]
    return np.mod(ph, 1.0), inc


def scie(freq, phase0=0.0):
    ph, dt = phase(freq, phase0)
    return (2 * ph - 1 - _polyblep(ph, dt)).astype(np.float32)


def carre(freq, largeur=0.5, phase0=0.0):
    ph, dt = phase(freq, phase0)
    a = 2 * ph - 1 - _polyblep(ph, dt)
    ph2 = np.mod(ph + largeur, 1.0)
    b = 2 * ph2 - 1 - _polyblep(ph2, dt)
    return (0.5 * (a - b)).astype(np.float32)


def triangle(freq, phase0=0.0):
    ph, _ = phase(freq, phase0)
    return (2 * np.abs(2 * ph - 1) - 1).astype(np.float32)


def sinus(freq, phase0=0.0):
    ph, _ = phase(freq, phase0)
    return np.sin(2 * np.pi * ph).astype(np.float32)


def graine_note(*morceaux):
    """Une graine stable tirée de ce qui définit une note (pas de hasard caché)."""
    h = hashlib.blake2b(repr(morceaux).encode(), digest_size=8).digest()
    return int.from_bytes(h, 'little')


# ---------------------------------------------------------------------------------
# Les patchs : les réglages d'un son, complétés par défaut

PATCH_DEFAUT = {
    'osc': [{'forme': 'scie', 'niveau': 1.0}],
    'sub': 0.0,              # sinus une octave sous la note
    'bruit': 0.0,
    'filtre': {'coupure': 2000.0, 'resonance': 0.6, 'env': 2.0, 'suivi': 0.3,
               'a': 0.003, 'd': 0.25, 's': 0.2, 'r': 0.2, 'drive': 1.2},
    'amp': {'a': 0.004, 'd': 0.3, 's': 0.8, 'r': 0.15},
    'glisse': 0.0,           # secondes de portamento (en jeu lié)
    'mono': False,
    'vibrato': None,         # {'prof': cents, 'vit': Hz, 'delai': s}
    'drive': 0.0,            # saturation après le filtre
    'largeur': 0.5,          # l'écart stéréo des voix désaccordées
    'velocite': 0.6,         # la part de la vélocité dans le niveau (0 = aucune)
    'vel_filtre': 0.5,       # la part de la vélocité dans l'ouverture du filtre
}


def completer(patch):
    p = dict(PATCH_DEFAUT)
    for k, v in (patch or {}).items():
        if isinstance(v, dict) and isinstance(p.get(k), dict):
            q = dict(p[k])
            q.update(v)
            p[k] = q
        else:
            p[k] = v
    return p


def _desaccords(n, ecart):
    """Les désaccords (en cents) de `n` voix réparties sur ±ecart, la centrale à 0."""
    if n <= 1:
        return [0.0]
    base = np.linspace(-1, 1, n)
    # les voix extérieures plus loin (la courbe de la « grande scie »)
    return list(np.sign(base) * np.abs(base) ** 1.5 * ecart)


def voix(hauteur, duree_s, vel, patch, f0=None, debut_niveau=0.0, graine=0, coupure_mult=None):
    """Une note de synthé : (signal stéréo float32, nombre d'échantillons tenus).
    `f0` : la fréquence d'où l'on glisse ; `debut_niveau` : le niveau d'où l'attaque
    part (jeu lié) ; `coupure_mult` : une courbe qui multiplie la coupure."""
    p = patch
    amp = p['amp']
    n_tenu = max(1, int(duree_s * SR))
    n = n_tenu + int(amp['r'] * SR * 1.1) + 64
    rng = np.random.default_rng(graine)
    f = frequence(hauteur)
    t = np.arange(n) / SR
    freq = np.full(n, f, dtype=np.float64)
    if f0 is not None and p['glisse'] > 0 and abs(f0 - f) > 0.01:
        k = np.exp(-t / max(p['glisse'] / 3.0, 1e-4))
        freq = f * (f0 / f) ** k
    if p['vibrato']:
        v = p['vibrato']
        rampe = np.clip((t - v.get('delai', 0.3)) / 0.4, 0, 1)
        freq *= 2 ** (v.get('prof', 12) * rampe * np.sin(2 * np.pi * v.get('vit', 5.5) * t) / 1200)
    gauche = np.zeros(n, dtype=np.float32)
    droite = np.zeros(n, dtype=np.float32)
    for o in p['osc']:
        forme = o.get('forme', 'scie')
        niveau = o.get('niveau', 1.0)
        mult = 2 ** (o.get('octave', 0) + o.get('demi_tons', 0) / 12.0 + o.get('desaccord', 0) / 1200.0)
        if forme in ('supersaw', 'reese'):
            nv = o.get('voix', 7 if forme == 'supersaw' else 2)
            ecart = o.get('ecart', 25.0 if forme == 'supersaw' else 14.0)
            larg = o.get('stereo', p['largeur'])
            des = _desaccords(nv, ecart)
            for i, c in enumerate(des):
                s = scie(freq * mult * 2 ** (c / 1200), rng.random())
                pan = 0.0 if nv == 1 else larg * (-1 + 2 * i / (nv - 1))
                pan = pan if i % 2 == 0 else -pan
                th = (pan + 1) * np.pi / 4
                g = niveau / np.sqrt(nv)
                gauche += s * (g * np.cos(th) * np.sqrt(2))
                droite += s * (g * np.sin(th) * np.sqrt(2))
            continue
        if forme == 'scie':
            s = scie(freq * mult, rng.random())
        elif forme == 'carre':
            s = carre(freq * mult, o.get('largeur', 0.5), rng.random())
        elif forme == 'triangle':
            s = triangle(freq * mult, rng.random())
        elif forme == 'sinus':
            s = sinus(freq * mult, rng.random())
        else:
            raise ValueError(f'oscillateur inconnu : {forme}')
        gauche += s * niveau
        droite += s * niveau
    if p['sub']:
        # la sous-basse une octave dessous, jamais sous 32 Hz (aucun haut-parleur ne la
        # rend, elle mange la marge) : plus bas, elle double la note à l'unisson
        s = sinus(freq * (0.5 if f * 0.5 >= 32.0 else 1.0))
        gauche += s * p['sub']
        droite += s * p['sub']
    if p['bruit']:
        b = rng.standard_normal(n).astype(np.float32) * p['bruit'] * 0.3
        gauche += b
        droite += b
    # le filtre et son enveloppe
    fl = p['filtre']
    if fl:
        velf = 1.0 + p['vel_filtre'] * (vel / 127.0 - 0.6)
        envf = dsp.adsr(n, fl['a'], fl['d'], fl['s'], fl['r'], duree_s)
        suivi = (f / 261.6) ** fl.get('suivi', 0.3)
        fc = fl['coupure'] * suivi * 2 ** (fl.get('env', 0) * envf * velf)
        if coupure_mult is not None:
            fc = fc * coupure_mult[:n] if len(coupure_mult) >= n else fc * np.pad(
                coupure_mult, (0, n - len(coupure_mult)), mode='edge')
        fc = np.minimum(fc, 0.45 * SR).astype(np.float32)
        typ = fl.get('type', 'echelle')
        if typ == 'echelle':
            gauche = noyau.echelle(gauche, fc, fl.get('resonance', 0.6), SR, fl.get('drive', 1.0))
            droite = gauche if np.shares_memory(gauche, droite) else noyau.echelle(
                droite, fc, fl.get('resonance', 0.6), SR, fl.get('drive', 1.0))
        else:
            q = fl.get('q', 0.8)
            gauche = noyau.variable(gauche, fc, q, SR, typ)
            droite = noyau.variable(droite, fc, q, SR, typ)
    if p['drive']:
        st = dsp.saturer(np.stack([gauche, droite], axis=1), p['drive'], surech=2)
        gauche, droite = st[:, 0], st[:, 1]
    enva = dsp.adsr(n, amp['a'], amp['d'], amp['s'], amp['r'], duree_s)
    if debut_niveau > 0:
        na = int(max(amp['a'], 0.005) * SR)
        enva[:na] = np.maximum(enva[:na], debut_niveau * np.linspace(1, 0.9, na))
    g = (1 - p['velocite']) + p['velocite'] * (vel / 127.0) ** 1.5
    sortie = np.stack([gauche * enva, droite * enva], axis=1) * np.float32(g)
    return sortie.astype(np.float32), n_tenu


# ---------------------------------------------------------------------------------
# Les sons de conception


def montee(duree_s, vel=100, graine=0, hauteur=None):
    """La montée (le « riser ») : un bruit dont le filtre s'ouvre et qui enfle jusqu'au
    bout de la note, avec un sifflement qui monte d'une octave et demie."""
    n = int(duree_s * SR)
    rng = np.random.default_rng(graine)
    t = np.linspace(0, 1, n)
    b = rng.standard_normal((n, 2)).astype(np.float32)
    fc = (300 * (6000 / 300) ** (t ** 1.6)).astype(np.float32)
    L = noyau.variable(b[:, 0], fc, 1.2, SR, 'bande')
    R = noyau.variable(b[:, 1], fc * 1.06, 1.2, SR, 'bande')
    env = (t ** 2.2).astype(np.float32)
    f0 = frequence(hauteur) if hauteur is not None else 220.0
    ton = scie(f0 * 2 ** (1.5 * t ** 1.3)) * 0.12
    ton = noyau.echelle(ton, fc * 0.7, 1.0, SR)
    s = np.stack([(L + ton) * env, (R + ton) * env], axis=1)
    queue = int(0.05 * SR)
    s[-queue:] *= np.linspace(1, 0, queue)[:, None]
    return (s * (vel / 127.0)).astype(np.float32)


def impact(vel=120, graine=0, grave=48.0, duree_s=3.0):
    """L'impact : un coup grave qui tombe (sinus de 90 à `grave` Hz), un souffle de
    bruit brillant et court, une queue sombre."""
    n = int(duree_s * SR)
    rng = np.random.default_rng(graine)
    t = np.arange(n) / SR
    f = grave + (90 - grave) * np.exp(-t / 0.06)
    boum = sinus(f) * np.exp(-t / 0.9).astype(np.float32)
    boum = dsp.saturer(boum, 1.5, surech=2)
    claque = rng.standard_normal(n).astype(np.float32) * np.exp(-t / 0.05).astype(np.float32)
    claque = dsp.passe_bas(dsp.passe_haut(claque, 300), 6000)
    souffle = rng.standard_normal((n, 2)).astype(np.float32) * np.exp(-t / 0.7).astype(np.float32)[:, None]
    souffle = dsp.passe_bas(souffle, 900) * 0.4
    s = np.stack([boum + claque * 0.6, boum + claque * 0.6], axis=1) + souffle
    return (s * (vel / 127.0)).astype(np.float32)


# ---------------------------------------------------------------------------------
# La boîte à rythmes (synthétique) : chaque pièce est une note de nom connu

def _bruit(n, graine):
    return np.random.default_rng(graine).standard_normal(n).astype(np.float32)


def piece_synthe(piece, vel, graine, accord=1.0):
    """Une frappe de la boîte à rythmes : 'K' grosse caisse, 'S' caisse claire, 'C'
    clap (ici « CL »), 'H' charleston fermé, 'O' ouvert, 'T' tom (grave à aigu :
    T1 T2 T3). Rend du mono float32."""
    # chaque pièce a son niveau propre : à vélocité égale, un charleston s'entend autant
    # qu'une grosse caisse (c'est le mélange qui les place ensuite)
    v = vel / 127.0 * {'K': 1.0, 'S': 0.9, 'CL': 1.0, 'H': 3.2, 'O': 2.2}.get(piece, 1.0)
    if piece == 'K':
        n = int(0.5 * SR)
        t = np.arange(n) / SR
        # le corps descend de 150 à 50 Hz ; le « knock » de 100 à 200 Hz fait entendre la
        # grosse caisse sur un téléphone ; le clic marque l'attaque
        f = 50 * accord + 100 * np.exp(-t / 0.03) + 60 * np.exp(-t / 0.004)
        s = sinus(f) * np.exp(-t / 0.22)
        clic = dsp.passe_haut(_bruit(n, graine), 2500) * np.exp(-t / 0.003) * 0.35
        s = dsp.saturer((s + clic).astype(np.float32), 2.2, surech=2)
        return (s * v).astype(np.float32)
    if piece == 'S':
        n = int(0.45 * SR)
        t = np.arange(n) / SR
        corps = (sinus(185 * accord + 60 * np.exp(-t / 0.01)) * 0.7 +
                 sinus(np.full(n, 330.0 * accord)) * 0.3) * np.exp(-t / 0.07)
        bruit = dsp.passe_haut(_bruit(n, graine), 1200) * np.exp(-t / 0.17)
        bruit = dsp.egaliseur(bruit, {'cloches': [(5000, 4, 0.8)]})
        return ((corps * 0.8 + bruit * 0.9) * v).astype(np.float32)
    if piece == 'CL':
        n = int(0.5 * SR)
        t = np.arange(n) / SR
        b = _bruit(n, graine)
        env = np.zeros(n)
        for k, d in enumerate((0.0, 0.011, 0.022, 0.034)):
            env += np.where(t >= d, np.exp(-(t - d) / (0.006 if k < 3 else 0.12)), 0)
        s = dsp.egaliseur((b * env).astype(np.float32), {'passe_haut': 700, 'cloches': [(1300, 6, 1.2)]})
        return (s * v * 0.9).astype(np.float32)
    if piece in ('H', 'O'):
        n = int((0.09 if piece == 'H' else 0.5) * SR)
        t = np.arange(n) / SR
        metal = np.zeros(n, dtype=np.float32)
        for fq in (205.3, 304.4, 369.6, 522.7, 540.0, 800.0):
            metal += carre(np.full(n, fq * 1.0))
        # le métal de six carrés désaccordés, filtré entre 6,5 et 14 kHz (au-dessus, rien
        # qu'on entende, seulement de quoi fatiguer)
        metal = dsp.egaliseur(metal, {'passe_haut': 6500, 'passe_bas': 14000, 'cloches': [(9000, 5, 1.0)]})
        tau = 0.025 if piece == 'H' else 0.22
        s = (metal * 0.25 + dsp.passe_bas(dsp.passe_haut(_bruit(n, graine), 8000), 14000) * 0.4) * np.exp(-t / tau)
        return (s * v).astype(np.float32)
    if piece in ('T1', 'T2', 'T3'):
        base = {'T1': 82, 'T2': 110, 'T3': 147}[piece] * accord
        n = int(0.7 * SR)
        t = np.arange(n) / SR
        s = sinus(base + base * 0.9 * np.exp(-t / 0.05)) * np.exp(-t / 0.28)
        s += dsp.passe_haut(_bruit(n, graine), 1500) * np.exp(-t / 0.01) * 0.15
        return dsp.saturer((s * v).astype(np.float32), 1.0, surech=2)
    raise ValueError(f'pièce de boîte à rythmes inconnue : {piece}')
