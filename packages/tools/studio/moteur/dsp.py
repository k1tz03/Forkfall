"""Le traitement du signal : filtres, égaliseur, panoramique, saturation,
compresseur, limiteur de crête vraie, réverbérations par convolution (les réponses
impulsionnelles sont fabriquées ici : aucune n'est téléchargée), sonie.

Tout signal est un tableau numpy float32 : (n,) en mono, (n, 2) en stéréo, à
44 100 Hz. Rien n'est tiré au hasard sans graine : un même appel rend les mêmes
échantillons."""
from fractions import Fraction
from functools import lru_cache

import numpy as np
from scipy import signal
from scipy.ndimage import minimum_filter1d

from . import noyau

SR = 44100


def db(x):
    return 20.0 * np.log10(np.maximum(np.abs(x), 1e-12))


def gain(d):
    return 10.0 ** (np.asarray(d) / 20.0)


def stereo(x):
    x = np.asarray(x, dtype=np.float32)
    if x.ndim == 1:
        return np.stack([x, x], axis=1)
    if x.shape[1] == 1:
        return np.repeat(x, 2, axis=1)
    return x


def mono(x):
    x = np.asarray(x, dtype=np.float32)
    return x if x.ndim == 1 else x.mean(axis=1)


# ---------------------------------------------------------------------------------
# Rééchantillonner (changer la hauteur d'un échantillon, ou sa fréquence)

def reechantillonner(x, rapport, sr_source=SR):
    """Lit `x` `rapport` fois plus vite (rapport 2 = une octave plus haut, deux fois
    plus court), et convertit sa fréquence d'échantillonnage vers 44,1 kHz. Filtre
    polyphasé (fenêtre de Kaiser) : pas de repliement en montant."""
    r = Fraction(SR, int(sr_source)) / Fraction(rapport).limit_denominator(4000)
    r = r.limit_denominator(2000)
    up, down = r.numerator, r.denominator
    if up == down:
        return np.asarray(x, dtype=np.float32)
    y = signal.resample_poly(x, up, down, axis=0, window=('kaiser', 6.0))
    return y.astype(np.float32)


# ---------------------------------------------------------------------------------
# Filtres (biquads de l'« audio EQ cookbook »)

def biquad(type_, f, q=0.707, gain_db=0.0, sr=SR):
    """Une section du second ordre : 'bas', 'haut', 'bande', 'cloche', 'plateau_bas',
    'plateau_haut', 'coupe' (encoche)."""
    f = min(max(f, 5.0), 0.49 * sr)
    w = 2 * np.pi * f / sr
    c, s = np.cos(w), np.sin(w)
    a = s / (2 * q)
    A = 10 ** (gain_db / 40.0)
    if type_ == 'bas':
        b = [(1 - c) / 2, 1 - c, (1 - c) / 2]
        aa = [1 + a, -2 * c, 1 - a]
    elif type_ == 'haut':
        b = [(1 + c) / 2, -(1 + c), (1 + c) / 2]
        aa = [1 + a, -2 * c, 1 - a]
    elif type_ == 'bande':
        b = [a, 0, -a]
        aa = [1 + a, -2 * c, 1 - a]
    elif type_ == 'coupe':
        b = [1, -2 * c, 1]
        aa = [1 + a, -2 * c, 1 - a]
    elif type_ == 'cloche':
        b = [1 + a * A, -2 * c, 1 - a * A]
        aa = [1 + a / A, -2 * c, 1 - a / A]
    elif type_ in ('plateau_bas', 'plateau_haut'):
        sq = 2 * np.sqrt(A) * a
        if type_ == 'plateau_bas':
            b = [A * ((A + 1) - (A - 1) * c + sq), 2 * A * ((A - 1) - (A + 1) * c),
                 A * ((A + 1) - (A - 1) * c - sq)]
            aa = [(A + 1) + (A - 1) * c + sq, -2 * ((A - 1) + (A + 1) * c), (A + 1) + (A - 1) * c - sq]
        else:
            b = [A * ((A + 1) + (A - 1) * c + sq), -2 * A * ((A - 1) + (A + 1) * c),
                 A * ((A + 1) + (A - 1) * c - sq)]
            aa = [(A + 1) - (A - 1) * c + sq, 2 * ((A - 1) - (A + 1) * c), (A + 1) - (A - 1) * c - sq]
    else:
        raise ValueError(f'filtre inconnu : {type_}')
    return np.array([b[0] / aa[0], b[1] / aa[0], b[2] / aa[0], 1.0, aa[1] / aa[0], aa[2] / aa[0]])


def filtrer(x, sos):
    sos = np.atleast_2d(sos)
    return signal.sosfilt(sos, x, axis=0).astype(np.float32)


@lru_cache(maxsize=256)
def _butter(ordre, f, type_, sr):
    return signal.butter(ordre, min(f, 0.49 * sr), btype=type_, fs=sr, output='sos')


def passe_haut(x, f, ordre=2, sr=SR):
    if not f:
        return x
    return signal.sosfilt(_butter(ordre, float(f), 'highpass', sr), x, axis=0).astype(np.float32)


def passe_bas(x, f, ordre=2, sr=SR):
    if not f or f >= 0.49 * sr:
        return x
    return signal.sosfilt(_butter(ordre, float(f), 'lowpass', sr), x, axis=0).astype(np.float32)


def egaliseur(x, reglage, sr=SR):
    """Un égaliseur à partir d'un dictionnaire (les clés absentes ne font rien) :
        passe_haut: Hz (24 dB/oct.), passe_bas: Hz (12 dB/oct.),
        grave: (dB, Hz) plateau bas, aigu: (dB, Hz) plateau haut,
        cloches: [(Hz, dB, Q), …], presence: dB (cloche large à 3 kHz),
        boue: dB (cloche à 300 Hz, négative pour dégager), air: dB (plateau à 10 kHz)."""
    if not reglage:
        return x
    y = x
    if reglage.get('passe_haut'):
        y = passe_haut(y, reglage['passe_haut'], ordre=4, sr=sr)
    if reglage.get('passe_bas'):
        y = passe_bas(y, reglage['passe_bas'], ordre=2, sr=sr)
    sos = []
    if reglage.get('grave'):
        g, f = reglage['grave']
        sos.append(biquad('plateau_bas', f, 0.7, g, sr))
    if reglage.get('aigu'):
        g, f = reglage['aigu']
        sos.append(biquad('plateau_haut', f, 0.7, g, sr))
    if reglage.get('presence'):
        sos.append(biquad('cloche', 3000, 0.8, reglage['presence'], sr))
    if reglage.get('boue'):
        sos.append(biquad('cloche', 300, 1.0, reglage['boue'], sr))
    if reglage.get('air'):
        sos.append(biquad('plateau_haut', 10000, 0.7, reglage['air'], sr))
    for f, g, q in reglage.get('cloches', ()):
        sos.append(biquad('cloche', f, q, g, sr))
    if sos:
        y = filtrer(y, np.vstack(sos))
    return y


# ---------------------------------------------------------------------------------
# L'espace : panoramique, largeur

def panoramique(x, pan=0.0, largeur=1.0):
    """Place une source : `pan` -1 (gauche) .. +1 (droite), loi à puissance
    constante (−3 dB par côté au centre). Une source stéréo garde son image,
    resserrée par `largeur` (0 = mono au point `pan`, 1 = l'image telle quelle,
    déplacée vers `pan`) : chaque canal est placé à part (le double panoramique)."""
    x = np.asarray(x, dtype=np.float32)
    if x.ndim == 1:
        th = (np.clip(pan, -1, 1) + 1) * np.pi / 4
        return np.stack([x * np.cos(th), x * np.sin(th)], axis=1).astype(np.float32)
    w = float(np.clip(largeur, 0.0, 1.0))
    tl = (float(np.clip(pan - w, -1, 1)) + 1) * np.pi / 4
    tr = (float(np.clip(pan + w, -1, 1)) + 1) * np.pi / 4
    k = 1.0 / np.sqrt(2.0 - w)      # resserrer additionne les canaux : on compense
    L, R = x[:, 0], x[:, 1]
    sortie = np.stack([k * (L * np.cos(tl) + R * np.cos(tr)),
                       k * (L * np.sin(tl) + R * np.sin(tr))], axis=1)
    if largeur > 1.0:
        sortie = largeur_ms(sortie, largeur)
    return sortie.astype(np.float32)


def largeur_ms(x, largeur):
    """Élargit (>1) ou resserre (<1) une image stéréo par milieu / côtés."""
    if largeur == 1.0 or x.ndim == 1:
        return x
    m = (x[:, 0] + x[:, 1]) * 0.5
    s = (x[:, 0] - x[:, 1]) * 0.5 * largeur
    return np.stack([m + s, m - s], axis=1).astype(np.float32)


# ---------------------------------------------------------------------------------
# La couleur : saturation

def saturer(x, drive=2.0, melange=1.0, asymetrie=0.0, surech=2):
    """Saturation douce (tanh), suréchantillonnée pour ne pas replier ; `asymetrie`
    ajoute des harmoniques paires (la lampe, la bande) ; niveau compensé."""
    if drive <= 0 or melange <= 0:
        return x
    y = signal.resample_poly(x, surech, 1, axis=0) if surech > 1 else np.asarray(x, np.float64)
    d = 1.0 + drive
    sat = (np.tanh(d * (y + asymetrie)) - np.tanh(d * asymetrie)) / np.tanh(d)
    if surech > 1:
        sat = signal.resample_poly(sat, 1, surech, axis=0)[:len(x)]
    if asymetrie:
        sat = passe_haut(sat.astype(np.float32), 8)
    return ((1 - melange) * x + melange * sat).astype(np.float32)


# ---------------------------------------------------------------------------------
# La dynamique

def _coef(temps, sr=SR):
    return 1.0 - np.exp(-1.0 / max(temps * sr, 1.0))


def compresseur(x, seuil=-18.0, ratio=3.0, attaque=0.01, relache=0.15, genou=6.0,
                compense=0.0, cle=None, rms=None, sr=SR):
    """Compresseur à contrôle anticipé, stéréo lié ; `cle` : un autre signal qui
    commande (la grosse caisse qui fait pomper) ; `rms` : fenêtre de détection (s)
    au lieu des crêtes. Rend (signal, réduction de gain en dB)."""
    det = mono(np.abs(x) if cle is None else np.abs(cle)) if (x.ndim == 1 or cle is not None and
                                                              np.asarray(cle).ndim == 1) else \
        np.max(np.abs(x if cle is None else cle), axis=1)
    if rms:
        p = noyau.lisse((det.astype(np.float32)) ** 2, _coef(rms, sr), _coef(rms, sr), 0.0)
        niveau = 10 * np.log10(np.maximum(p, 1e-12))
    else:
        env = noyau.lisse(det.astype(np.float32), _coef(0.0005, sr), _coef(relache, sr), 0.0)
        niveau = db(env)
    dep = niveau - seuil
    gr = np.where(dep <= -genou / 2, 0.0,
                  np.where(dep >= genou / 2, dep * (1 - 1 / ratio),
                           (1 - 1 / ratio) * (dep + genou / 2) ** 2 / (2 * genou)))
    gr = noyau.lisse(gr.astype(np.float32), _coef(attaque, sr), _coef(relache, sr), 0.0)
    g = gain(compense - gr).astype(np.float32)
    y = x * (g[:, None] if x.ndim == 2 else g)
    return y.astype(np.float32), gr


def crete_par_echantillon(x, surech=4):
    """La crête vraie (ITU-R BS.1770, suréchantillonnage ×4) de chaque échantillon,
    tous canaux confondus."""
    y = signal.resample_poly(x, surech, 1, axis=0, window=('kaiser', 8.0))
    a = np.abs(y)
    if a.ndim == 2:
        a = a.max(axis=1)
    n = len(x)
    a = a[:n * surech].reshape(n, surech).max(axis=1)
    return a.astype(np.float32)


def crete_vraie_db(x):
    return float(db(crete_par_echantillon(x).max()))


def limiteur(x, plafond_db=-1.2, anticipation=0.002, relache=0.06, sr=SR):
    """Limiteur à anticipation sur la crête vraie : aucune crête (suréchantillonnée ×4)
    ne dépasse `plafond_db`. Le gain descend en `anticipation` avant chaque crête (une
    rampe, pas un saut) et remonte en `relache`."""
    plafond = gain(plafond_db)
    pic = crete_par_echantillon(x)
    cible = np.minimum(1.0, plafond / np.maximum(pic, 1e-9)).astype(np.float32)
    L = max(1, int(anticipation * sr))
    # le minimum sur [n, n + L] : la fenêtre centrée, décalée vers l'avant
    m = minimum_filter1d(cible, size=2 * L + 1, mode='nearest')
    m = np.concatenate([m[L:], np.full(L, m[-1], np.float32)])
    m = np.minimum(m, cible)
    # moyenne glissante causale sur L+1 : la rampe atteint le minimum à temps
    noyau_moy = np.ones(L + 1, dtype=np.float64) / (L + 1)
    lisse_ = signal.lfilter(noyau_moy, [1.0], np.concatenate([np.full(L, m[0]), m]))[L:]
    lisse_ = np.minimum(lisse_.astype(np.float32), m + 0)  # sûreté
    g = noyau.lisse(lisse_, _coef(relache, sr), 1.0, 1.0)
    g = np.minimum(g, lisse_)
    y = x * (g[:, None] if x.ndim == 2 else g)
    return y.astype(np.float32), g


def ecreteur_doux(x, seuil_db=-3.0, surech=4):
    """Arrondit les crêtes au-dessus de `seuil_db` (tanh au-delà du seuil), sans
    toucher au reste : une saturation qui ne s'entend que sur les coups."""
    s = gain(seuil_db)
    y = signal.resample_poly(x, surech, 1, axis=0)
    a = np.abs(y)
    dessus = a > s
    z = np.where(dessus, np.sign(y) * (s + (1 - s) * np.tanh((a - s) / (1 - s))), y)
    return signal.resample_poly(z, 1, surech, axis=0)[:len(x)].astype(np.float32)


# ---------------------------------------------------------------------------------
# Les salles : réponses impulsionnelles fabriquées

_BANDES = (63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000)


@lru_cache(maxsize=16)
def reponse(type_='salle', rt60=2.4, predelai=0.025, clarte=1.0, largeur=1.0, graine=7, sr=SR):
    """Une réponse impulsionnelle stéréo (float32, (n, 2)), fabriquée :
    - 'salle' : une grande salle de concert (premières réflexions espacées, queue
      dense dont les aigus meurent plus vite que les graves, montée progressive) ;
    - 'plaque' : la plaque des batteries (dense dès le début, brillante) ;
    - 'piece' : une petite pièce (réflexions serrées, queue courte).
    `clarte` > 1 garde plus d'aigus dans la queue, < 1 l'assombrit."""
    rng = np.random.default_rng(graine)
    duree = predelai + rt60 * 1.15 + 0.05
    n = int(duree * sr)
    t = np.arange(n) / sr
    if type_ == 'plaque':
        facteurs = (1.0, 1.0, 1.0, 1.0, 1.0, 0.95, 0.85, 0.7, 0.5)
        montee = 0.002
    elif type_ == 'piece':
        facteurs = (1.3, 1.2, 1.1, 1.0, 1.0, 0.9, 0.75, 0.55, 0.35)
        montee = 0.004
    else:
        facteurs = (1.35, 1.25, 1.12, 1.0, 1.0, 0.88, 0.7, 0.5, 0.3)
        montee = 0.03
    sortie = np.zeros((n, 2), dtype=np.float64)
    for c in range(2):
        bruit = rng.standard_normal(n)
        queue = np.zeros(n)
        for i, fb in enumerate(_BANDES):
            lo = fb / np.sqrt(2)
            hi = min(fb * np.sqrt(2), 0.47 * sr)
            sos = signal.butter(2, [lo, hi], btype='bandpass', fs=sr, output='sos')
            bande = signal.sosfilt(sos, bruit)
            f = facteurs[i]
            if fb >= 2000:
                f = f * clarte
            rt = max(0.05, rt60 * f)
            queue += bande * np.exp(-6.9078 * t / rt)
        # la queue naît après les premières réflexions et monte doucement
        debut = predelai + (0.012 if type_ != 'plaque' else 0.0)
        env = np.clip((t - debut) / montee, 0, None)
        env = 1 - np.exp(-env)
        env[t < debut] = 0.0
        sortie[:, c] = queue * env
    # les premières réflexions (pas de la plaque) : des échos discrets, filtrés, qui
    # diffèrent d'une oreille à l'autre (c'est ce qui place la salle autour de nous)
    if type_ != 'plaque':
        k = 14 if type_ == 'salle' else 10
        fin_er = 0.085 if type_ == 'salle' else 0.03
        for c in range(2):
            temps = np.sort(rng.uniform(0.006, fin_er, k)) + predelai * (0.6 if type_ == 'salle' else 0.3)
            gains = rng.uniform(0.35, 1.0, k) * np.exp(-temps / (0.05 if type_ == 'salle' else 0.02))
            imp = np.zeros(n)
            idx = np.minimum((temps * sr).astype(int), n - 1)
            np.add.at(imp, idx, gains * rng.choice([-1, 1], k))
            imp = signal.sosfilt(_butter(1, 5500.0, 'lowpass', sr), imp)
            sortie[:, c] += imp * (3.0 if type_ == 'salle' else 4.0) * np.sqrt(
                np.mean(sortie[:, c] ** 2) * n / max(np.sum(imp ** 2), 1e-12)) * 0.25
    # largeur : décorrèle plus ou moins les deux oreilles
    if largeur != 1.0:
        m = (sortie[:, 0] + sortie[:, 1]) / 2
        s = (sortie[:, 0] - sortie[:, 1]) / 2 * largeur
        sortie = np.stack([m + s, m - s], axis=1)
    # un passe-haut léger : pas de boue dans la queue
    sortie = signal.sosfilt(_butter(2, 90.0 if type_ == 'salle' else 120.0, 'highpass', sr), sortie, axis=0)
    # énergie normalisée : une source envoyée à 1 revient à un niveau comparable
    sortie /= np.sqrt(np.sum(sortie ** 2) / 2)
    fondu = int(0.05 * sr)
    sortie[-fondu:] *= np.linspace(1, 0, fondu)[:, None]
    return sortie.astype(np.float32)


def convoluer(x, ir, croise=0.3):
    """La réverbe : chaque oreille de `x` traverse la réponse de son côté, avec un
    peu de l'autre oreille (`croise`), pour que la salle enveloppe sans perdre la
    place des instruments."""
    x = stereo(x)
    gl = x[:, 0] + croise * x[:, 1]
    dr = x[:, 1] + croise * x[:, 0]
    L = signal.oaconvolve(gl, ir[:, 0])[:len(x)]
    R = signal.oaconvolve(dr, ir[:, 1])[:len(x)]
    return np.stack([L, R], axis=1).astype(np.float32) / (1 + croise)


def retarder(x, n):
    """Retarde de `n` échantillons (même longueur)."""
    if n <= 0:
        return x
    y = np.zeros_like(x)
    y[n:] = x[:-n]
    return y


def echo_stereo(x, temps_s, retour=0.35, coupe_bas=3500.0, coupe_haut=250.0, pingpong=True, sr=SR):
    """L'écho (retard calé sur le tempo), le signal mouillé seul : en ping-pong, les
    répétitions passent d'une oreille à l'autre ; chaque tour s'assombrit et
    s'amincit (passe-bas `coupe_bas`, passe-haut `coupe_haut` dans la boucle)."""
    x = stereo(x)
    d = max(1, int(round(temps_s * sr)))
    if not pingpong:
        sorties = []
        for c in range(2):
            v = passe_bas(passe_haut(x[:, c], coupe_haut, 1), coupe_bas, 1)
            sorties.append(noyau.echo_mono(retarder(v, d), d, retour, coupe_bas, coupe_haut, sr))
        return np.stack(sorties, axis=1).astype(np.float32)
    m = (x[:, 0] + x[:, 1]) * 0.5
    v = passe_bas(passe_haut(m, coupe_haut, 1), coupe_bas, 1)
    e = noyau.echo_mono(retarder(v, d), 2 * d, retour * retour, coupe_bas, coupe_haut, sr)
    return np.stack([e, retarder(e, d) * retour], axis=1).astype(np.float32)


# ---------------------------------------------------------------------------------
# La sonie (ITU-R BS.1770-4 / EBU R128)

def _k_sos(sr=SR):
    # le pré-filtre (plateau haut +4 dB) et le passe-haut RLB, dérivés pour `sr`
    f0, G, Q = 1681.974450955533, 3.999843853973347, 0.7071752369554196
    K = np.tan(np.pi * f0 / sr)
    Vh = 10 ** (G / 20)
    Vb = Vh ** 0.4996667741545416
    a0 = 1 + K / Q + K * K
    b = [(Vh + Vb * K / Q + K * K) / a0, 2 * (K * K - Vh) / a0, (Vh - Vb * K / Q + K * K) / a0]
    a = [1, 2 * (K * K - 1) / a0, (1 - K / Q + K * K) / a0]
    f1, Q1 = 38.13547087602444, 0.5003270373238773
    K1 = np.tan(np.pi * f1 / sr)
    a01 = 1 + K1 / Q1 + K1 * K1
    b1 = [1, -2, 1]
    a1 = [1, 2 * (K1 * K1 - 1) / a01, (1 - K1 / Q1 + K1 * K1) / a01]
    return np.array([b + a, b1 + a1], dtype=np.float64)


def ponderation_k(x, sr=SR):
    return signal.sosfilt(_k_sos(sr), stereo(x).astype(np.float64), axis=0)


def sonie_integree(x, sr=SR):
    """La sonie intégrée en LUFS (blocs de 400 ms à 75 % de recouvrement, porte
    absolue à −70, porte relative à −10)."""
    y = ponderation_k(x, sr)
    return _integree(y, sr)


def _integree(y, sr=SR):
    bloc = int(0.4 * sr)
    pas = int(0.1 * sr)
    if len(y) < bloc:
        return -70.0
    p = (y ** 2).sum(axis=1)
    c = np.concatenate([[0.0], np.cumsum(p)])
    debuts = np.arange(0, len(y) - bloc + 1, pas)
    z = (c[debuts + bloc] - c[debuts]) / bloc
    l = -0.691 + 10 * np.log10(np.maximum(z, 1e-15))
    z = z[l > -70]
    if len(z) == 0:
        return -70.0
    rel = -0.691 + 10 * np.log10(z.mean()) - 10
    l2 = -0.691 + 10 * np.log10(np.maximum(z, 1e-15))
    z = z[l2 > rel]
    return float(-0.691 + 10 * np.log10(z.mean())) if len(z) else -70.0


def sonie_court_terme(x, sr=SR, fenetre=3.0, pas=0.1):
    """La sonie à court terme (fenêtres de 3 s) : un tableau de LUFS tous les `pas`."""
    y = ponderation_k(x, sr)
    p = (y ** 2).sum(axis=1)
    c = np.concatenate([[0.0], np.cumsum(p)])
    w = int(fenetre * sr)
    h = int(pas * sr)
    if len(p) < w:
        return np.array([-0.691 + 10 * np.log10(max(p.mean(), 1e-15))])
    debuts = np.arange(0, len(p) - w + 1, h)
    z = (c[debuts + w] - c[debuts]) / w
    return -0.691 + 10 * np.log10(np.maximum(z, 1e-15))


# ---------------------------------------------------------------------------------
# Enveloppes

def adsr(n, attaque, declin, maintien, relache, tenue, sr=SR, courbe=3.0):
    """Une enveloppe de `n` échantillons : attaque (s), déclin (s) vers le niveau de
    `maintien` (0..1), tenue jusqu'à `tenue` (s, le relâchement de la touche), puis
    relâche (s). Les pentes sont exponentielles (des instruments, pas des rampes)."""
    t = np.arange(n, dtype=np.float64) / sr
    a = max(attaque, 1e-4)
    env = np.where(t < a, (t / a) ** (1 / 1.6) if attaque > 0.003 else t / a, 1.0)
    if declin > 0:
        d = np.exp(-courbe * np.clip(t - a, 0, None) / declin)
        env = np.where(t >= a, maintien + (1 - maintien) * d, env)
    else:
        env = np.where(t >= a, maintien if maintien else 1.0, env)
    # le niveau au relâchement, puis la descente
    i = min(n - 1, int(tenue * sr))
    niveau = env[i] if n else 0
    r = max(relache, 1e-3)
    queue = niveau * np.exp(-6.9 * np.clip(t - tenue, 0, None) / r)
    env = np.where(t < tenue, env, queue)
    return env.astype(np.float32)


def fondu(x, entree=0, sortie=0):
    """Des fondus en échantillons, en courbe à puissance constante."""
    x = np.array(x, dtype=np.float32, copy=True)
    if entree > 0:
        e = np.sin(np.linspace(0, np.pi / 2, entree)) ** 2
        x[:entree] *= e[:, None] if x.ndim == 2 else e
    if sortie > 0:
        s = np.cos(np.linspace(0, np.pi / 2, sortie)) ** 2
        x[-sortie:] *= s[:, None] if x.ndim == 2 else s
    return x
