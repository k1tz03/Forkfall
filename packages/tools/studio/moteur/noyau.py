"""Le noyau : les boucles échantillon par échantillon (noyau.c), compilées une fois
dans un dossier de cache (FUSIBLE_STUDIO_CACHE, sinon ~/.cache/fusible-studio) et
appelées par ctypes. Sans compilateur C, des équivalents numpy par petits blocs
prennent le relais (plus lents, un son très proche mais pas identique au bit)."""
import ctypes
import hashlib
import os
import subprocess

import numpy as np

_ICI = os.path.dirname(os.path.abspath(__file__))
_SOURCE = os.path.join(_ICI, 'noyau.c')
_lib = None
_essaye = False


def _cache():
    d = os.environ.get('FUSIBLE_STUDIO_CACHE') or os.path.join(os.path.expanduser('~'), '.cache',
                                                                 'fusible-studio')
    os.makedirs(d, exist_ok=True)
    return d


def bibliotheque():
    """La bibliothèque compilée, ou None (alors les équivalents numpy servent)."""
    global _lib, _essaye
    if _essaye:
        return _lib
    _essaye = True
    if os.environ.get('FUSIBLE_STUDIO_SANS_C'):
        return None
    with open(_SOURCE, 'rb') as f:
        empreinte = hashlib.sha256(f.read()).hexdigest()[:16]
    so = os.path.join(_cache(), f'noyau-{empreinte}.so')
    if not os.path.exists(so):
        tmp = so + f'.{os.getpid()}.tmp'
        try:
            subprocess.run(['cc', '-O2', '-shared', '-fPIC', '-o', tmp, _SOURCE, '-lm'],
                           check=True, capture_output=True)
            os.replace(tmp, so)
        except (OSError, subprocess.CalledProcessError):
            return None
    lib = ctypes.CDLL(so)
    f32 = np.ctypeslib.ndpointer(dtype=np.float32, flags='C_CONTIGUOUS')
    f64 = np.ctypeslib.ndpointer(dtype=np.float64, flags='C_CONTIGUOUS')
    i32 = np.ctypeslib.ndpointer(dtype=np.int32, flags='C_CONTIGUOUS')
    lib.echelle.argtypes = [f32, f32, ctypes.c_int, f32, f32, ctypes.c_double, ctypes.c_double, f64]
    lib.variable.argtypes = [f32, ctypes.c_void_p, ctypes.c_void_p, ctypes.c_void_p, ctypes.c_int,
                             f32, ctypes.c_double, ctypes.c_double, f64]
    lib.lisse.argtypes = [f32, f32, ctypes.c_int, ctypes.c_double, ctypes.c_double, f64]
    lib.echo.argtypes = [f32, f32, ctypes.c_int, ctypes.c_int, ctypes.c_double, ctypes.c_double,
                         ctypes.c_double, f32, ctypes.c_int, i32, f64]
    _lib = lib
    return lib


def _f32(x):
    return np.ascontiguousarray(x, dtype=np.float32)


def _par_echantillon(v, n):
    a = np.asarray(v, dtype=np.float32)
    if a.ndim == 0:
        a = np.full(n, float(a), dtype=np.float32)
    return np.ascontiguousarray(a[:n], dtype=np.float32)


def echelle(x, fc, res, sr, drive=1.0):
    """Le filtre en échelle (24 dB/oct.) : `fc` et `res` par échantillon ou fixes."""
    x = _f32(x)
    n = len(x)
    fc = _par_echantillon(fc, n)
    res = _par_echantillon(res, n)
    lib = bibliotheque()
    y = np.zeros(n, dtype=np.float32)
    if lib is not None:
        lib.echelle(x, y, n, fc, res, float(drive), float(sr), np.zeros(4))
        return y
    # repli numpy : deux biquads passe-bas par blocs de 32, la coupure du bloc
    from scipy.signal import sosfilt
    zi = np.zeros((2, 2))
    B = 32
    for i in range(0, n, B):
        f = float(min(max(fc[i], 10.0), 0.49 * sr))
        q = 0.5 + 2.5 * float(res[i]) / 4.0
        sos = np.vstack([_biquad_bas(f, q, sr), _biquad_bas(f, 0.54, sr)])
        y[i:i + B], zi = sosfilt(sos, np.tanh(x[i:i + B] * drive) / max(np.tanh(drive), 1e-9)
                                 if drive != 1.0 else x[i:i + B], zi=zi)
    return y


def _biquad_bas(f, q, sr):
    w = 2 * np.pi * f / sr
    a = np.sin(w) / (2 * q)
    c = np.cos(w)
    b0 = (1 - c) / 2
    return np.array([b0, 1 - c, b0, 1 + a, -2 * c, 1 - a]) / (1 + a)


def variable(x, fc, q, sr, sortie='bas'):
    """Le filtre d'état variable (12 dB/oct.) : 'bas', 'bande' ou 'haut'."""
    x = _f32(x)
    n = len(x)
    fc = _par_echantillon(fc, n)
    lib = bibliotheque()
    y = np.zeros(n, dtype=np.float32)
    if lib is not None:
        nul = None
        ptr = y.ctypes.data_as(ctypes.c_void_p)
        lib.variable(x, ptr if sortie == 'bas' else nul, ptr if sortie == 'bande' else nul,
                     ptr if sortie == 'haut' else nul, n, fc, float(q), float(sr), np.zeros(2))
        return y
    from scipy.signal import sosfilt
    zi = np.zeros((1, 2))
    B = 32
    for i in range(0, n, B):
        f = float(min(max(fc[i], 10.0), 0.49 * sr))
        w = 2 * np.pi * f / sr
        a = np.sin(w) / (2 * q)
        c = np.cos(w)
        if sortie == 'bas':
            b = [(1 - c) / 2, 1 - c, (1 - c) / 2]
        elif sortie == 'haut':
            b = [(1 + c) / 2, -(1 + c), (1 + c) / 2]
        else:
            b = [a, 0, -a]
        sos = np.array([b + [1 + a, -2 * c, 1 - a]]) / (1 + a)
        y[i:i + B], zi = sosfilt(sos, x[i:i + B], zi=zi)
    return y


def lisse(x, monte, descend, initial=None):
    """Le lissage asymétrique (coefficients 0..1 par échantillon)."""
    x = _f32(x)
    n = len(x)
    etat = np.array([float(x[0]) if initial is None and n else float(initial or 0.0)])
    y = np.zeros(n, dtype=np.float32)
    lib = bibliotheque()
    if lib is not None:
        lib.lisse(x, y, n, float(monte), float(descend), etat)
        return y
    s = etat[0]
    for i in range(n):
        c = monte if x[i] > s else descend
        s += c * (x[i] - s)
        y[i] = s
    return y


def echo_mono(x, d, retour, coupe_bas, coupe_haut, sr):
    """Un écho mono à réinjection filtrée (d en échantillons)."""
    x = _f32(x)
    n = len(x)
    y = np.zeros(n, dtype=np.float32)
    cb = 1.0 - np.exp(-2 * np.pi * coupe_bas / sr)
    ch = 1.0 / (1.0 + 2 * np.pi * coupe_haut / sr)
    lib = bibliotheque()
    taille = d + 1
    if lib is not None:
        lib.echo(x, y, n, int(d), float(retour), float(cb), float(ch), np.zeros(taille, np.float32),
                 int(taille), np.zeros(1, np.int32), np.zeros(3))
        return y
    # repli : par blocs de d échantillons (la boucle ne lit que le passé)
    from scipy.signal import lfilter
    zl = np.zeros(1)
    zh = np.zeros(1)
    y[:] = x
    for i in range(d, n, d):
        r = y[i - d:min(i, n - d)]
        r, zl = lfilter([cb], [1, -(1 - cb)], r, zi=zl)
        r, zh = lfilter([ch, -ch], [1, -ch], r, zi=zh)
        y[i:i + len(r)] += retour * r.astype(np.float32)
    return y
