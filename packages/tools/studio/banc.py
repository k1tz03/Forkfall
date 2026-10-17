#!/usr/bin/env python3
"""Le banc : mesurer un thème rendu (son <clé>.wav et son <clé>.json).

    python3 packages/tools/studio/banc.py <dossier>/<clé>.wav [--out <dossier>]
    python3 packages/tools/studio/banc.py --calibrer [instrument…] [--travaux 2] [--out <dossier>]
        les niveaux des instruments : moteur/zones.json, moteur/niveaux.json (des noms :
        seulement ces instruments, les autres gardent leurs lignes)
    python3 packages/tools/studio/banc.py --niveaux [instrument…] [--out <dossier>]
        la preuve : la sonie en contexte de chaque articulation (registres, vélocités)
    python3 packages/tools/studio/banc.py --comparer <avant>/niveaux.json <après>/niveaux.json
        ce qui a changé d'un état du studio à l'autre (pour corriger des faders)

Il mesure : la sonie (intégrée sur la boucle, par section, court terme maximale), la
crête vraie, l'équilibre spectral (< 250 Hz, 250 Hz–2 kHz, 2–6 kHz, > 6 kHz), la
largeur stéréo (côtés / milieu, corrélation), la couture de la boucle (l'écart entre
la fin du second passage et la fin du premier, le saut de niveau et de spectre de part
et d'autre du raccord, le clic), la durée, le temps de rendu ; il dessine
<clé>_spectre.png (le spectrogramme, fréquences en échelle logarithmique) et
<clé>_courbe.png (la sonie mesure par mesure, les sections, la cible) ; il ajoute sa
ligne à banc.json dans le dossier (on y lit l'écart des thèmes entre eux)."""
import argparse
import json
import os
import sys

import numpy as np
import soundfile as sf

ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ICI)

from moteur import dsp  # noqa: E402
from moteur.dsp import SR  # noqa: E402

CIBLES = {
    'lufs': (-16.0, 0.5),          # la sonie de la boucle (le jeu : ±0,5 LU entre thèmes)
    'crete_max': -1.0,             # dBTP
    'graves_max': 75.0,            # % de l'énergie sous 250 Hz (au-delà, un téléphone n'entend rien)
    'aigus_max': 10.0,             # % au-dessus de 6 kHz (rien de strident et continu)
    'couture_ecart_max': -60.0,    # dBFS : la fin du 2ᵉ passage = la fin du 1ᵉʳ
    'couture_saut_max': 3.0,       # dB de part et d'autre du raccord
}


def _bandes(x):
    """Les parts de l'énergie (en %) par bande, sur le mélange des deux canaux."""
    from scipy import signal
    m = x.mean(axis=1) if x.ndim == 2 else x
    f, p = signal.welch(m, SR, nperseg=8192)
    tot = p.sum()
    def part(a, b):
        return float(100 * p[(f >= a) & (f < b)].sum() / tot)
    return {'<250': part(0, 250), '250-2k': part(250, 2000), '2k-6k': part(2000, 6000), '>6k': part(6000, SR)}


def _largeur(x):
    m = (x[:, 0] + x[:, 1]) / 2
    s = (x[:, 0] - x[:, 1]) / 2
    sm = 10 * np.log10(max(np.mean(s ** 2), 1e-15) / max(np.mean(m ** 2), 1e-15))
    c = float(np.corrcoef(x[:, 0], x[:, 1])[0, 1]) if np.std(x[:, 0]) > 0 else 1.0
    # le grave doit rester au milieu (un téléphone est mono, un vinyle aussi)
    from scipy import signal
    sos = signal.butter(4, 150, 'lowpass', fs=SR, output='sos')
    xb = signal.sosfilt(sos, x, axis=0)
    cb = float(np.corrcoef(xb[:, 0], xb[:, 1])[0, 1]) if np.std(xb[:, 0]) > 0 else 1.0
    return {'cotes_milieu_db': round(float(sm), 1), 'correlation': round(c, 3),
            'correlation_grave': round(cb, 3)}


def _tiers_octave(x):
    from scipy import signal
    m = x.mean(axis=1)
    f, p = signal.welch(m, SR, nperseg=4096)
    centres = 1000 * 2 ** (np.arange(-17, 14) / 3)
    v = []
    for c in centres:
        sel = (f >= c / 2 ** (1 / 6)) & (f < c * 2 ** (1 / 6))
        v.append(10 * np.log10(p[sel].sum() + 1e-20) if sel.any() else -200)
    return np.array(v)


def couture(x, rep):
    """La couture de la boucle : (1) l'écart entre la fin du second passage et la fin du
    premier (si elles sont identiques, sauter de `fin` à `debut` revient à jouer la
    suite naturelle : la couture est parfaite) ; (2) le saut de niveau et de spectre
    entre les 400 ms avant `fin` et les 400 ms après `debut` ; (3) le clic : le saut
    d'échantillon au raccord comparé au saut naturel au même instant dans le master
    continu (de `debut - 1` à `debut`) : 1,00 = le raccord est la transition même."""
    d, f = rep['boucle']['debut'], rep['boucle']['fin']
    L = min(SR, d)
    ecart = float(np.abs(x[f - L:f] - x[d - L:d]).max()) if L > 0 else 0.0
    w = int(0.4 * SR)
    avant = x[f - w:f]
    apres = x[d:d + w]
    def lufs_court(y):
        k = dsp.ponderation_k(y)
        return -0.691 + 10 * np.log10(max(float((k ** 2).sum(axis=1).mean()), 1e-15))
    saut = lufs_court(apres) - lufs_court(avant)
    spectre = float(np.sqrt(np.mean((_tiers_octave(apres) - _tiers_octave(avant)) ** 2)))
    raccord = float(np.abs(x[d] - x[f - 1]).max())
    naturel = float(np.abs(x[d] - x[d - 1]).max()) if d > 0 else raccord
    clic = raccord / naturel if naturel > 1e-9 else (1.0 if raccord < 1e-9 else float('inf'))
    return {'ecart_db': round(float(dsp.db(ecart)), 1), 'saut_db': round(float(saut), 2),
            'spectre_db': round(spectre, 2), 'clic': round(clic, 2)}


def mesures_par_mesure(x, rep):
    """La sonie de chaque mesure (moyenne pondérée K, sans porte) : [(début s, LUFS, section)]."""
    k = dsp.ponderation_k(x)
    p = (k ** 2).sum(axis=1)
    sortie = []
    for s in rep['sections']:
        nb = max(1, int(s.get('mesures', 0)) or round((s['fin'] - s['debut']) / (rep['mesure_s'] * SR)))
        bords = np.linspace(s['debut'], s['fin'], nb + 1).astype(int)
        for a, b in zip(bords[:-1], bords[1:]):
            v = -0.691 + 10 * np.log10(max(float(p[a:b].mean()), 1e-15))
            sortie.append((a / SR, (b - a) / SR, v, s['nom'], s.get('intro', False)))
    return sortie


def dessiner(x, rep, dossier, mesures):
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    cle = rep['cle']
    # --- le spectrogramme (le master entier, échelle de fréquence logarithmique) ---
    m = x.mean(axis=1)
    nfft, pas = 4096, 2048
    nb = 1 + (len(m) - nfft) // pas
    fen = np.hanning(nfft).astype(np.float32)
    freqs = np.fft.rfftfreq(nfft, 1 / SR)
    lignes = np.geomspace(30, 18000, 260)
    idx = np.searchsorted(freqs, lignes)
    image = np.zeros((len(lignes), nb), dtype=np.float32)
    for c in range(0, nb, 512):
        sel = np.arange(c, min(nb, c + 512))
        trames = np.stack([m[i * pas:i * pas + nfft] for i in sel]) * fen
        spec = np.abs(np.fft.rfft(trames, axis=1)) ** 2
        image[:, sel] = (10 * np.log10(spec[:, idx] + 1e-12)).T
    t = np.arange(nb) * pas / SR
    fig, ax = plt.subplots(figsize=(16, 6), dpi=100)
    vmax = np.percentile(image, 99.5)
    ax.pcolormesh(t, lignes, image, shading='auto', cmap='magma', vmin=vmax - 80, vmax=vmax)
    ax.set_yscale('log')
    ax.set_ylim(30, 18000)
    ax.set_yticks([50, 100, 250, 500, 1000, 2000, 4000, 8000, 16000])
    ax.set_yticklabels(['50', '100', '250', '500', '1k', '2k', '4k', '8k', '16k'])
    for s in rep['sections']:
        ax.axvline(s['debut'] / SR, color='white', lw=0.6, alpha=0.6)
        ax.text(s['debut'] / SR + 0.3, 14500, s['nom'], color='white', fontsize=8, va='top')
    for k in ('debut', 'fin'):
        ax.axvline(rep['boucle'][k] / SR, color='cyan', lw=1.4)
    ax.set_xlabel('secondes')
    ax.set_ylabel('Hz')
    ax.set_title(f'{cle} — spectrogramme (traits bleus : la boucle)')
    fig.tight_layout()
    p1 = os.path.join(dossier, f'{cle}_spectre.png')
    fig.savefig(p1)
    plt.close(fig)
    # --- la courbe : la sonie mesure par mesure ---
    fig, ax = plt.subplots(figsize=(16, 5), dpi=100)
    couleurs = {}
    palette = plt.get_cmap('tab20')
    for i, (t0, dt, v, nom, intro) in enumerate(mesures):
        if nom not in couleurs:
            couleurs[nom] = palette(len(couleurs) % 20)
        ax.bar(t0, v + 60, width=dt * 0.92, bottom=-60, align='edge', color=couleurs[nom],
               alpha=0.55 if intro else 0.9)
    ct = dsp.sonie_court_terme(x, pas=0.25)
    ax.plot(np.arange(len(ct)) * 0.25 + 1.5, ct, color='black', lw=0.8, label='court terme (3 s)')
    ax.axhline(rep['lufs'], color='green', lw=1.2, ls='--', label=f'boucle {rep["lufs"]:+.1f} LUFS')
    ax.axhline(-16, color='red', lw=0.6, ls=':', label='cible −16')
    for k in ('debut', 'fin'):
        ax.axvline(rep['boucle'][k] / SR, color='cyan', lw=1.4)
    vus = set()
    for s in rep['sections']:
        cle_s = (s['nom'], s.get('intro'))
        if s['nom'] in vus and not s.get('intro'):
            pass
        vus.add(s['nom'])
        ax.text((s['debut'] + s['fin']) / 2 / SR, -8, s['nom'], ha='center', fontsize=8)
    ax.set_ylim(-45, -5)
    ax.set_xlim(0, len(x) / SR)
    ax.set_xlabel('secondes')
    ax.set_ylabel('LUFS (par mesure)')
    ax.set_title(f'{cle} — la sonie mesure par mesure (couleur : la section ; traits bleus : la boucle)')
    ax.legend(loc='lower right', fontsize=8)
    fig.tight_layout()
    p2 = os.path.join(dossier, f'{cle}_courbe.png')
    fig.savefig(p2)
    plt.close(fig)
    return p1, p2


def analyser(wav, dossier=None):
    x, sr = sf.read(wav, dtype='float32', always_2d=True)
    assert sr == SR, f'{wav} : {sr} Hz, le studio rend à {SR}'
    with open(os.path.splitext(wav)[0] + '.json', encoding='utf-8') as f:
        rep = json.load(f)
    d, fn = rep['boucle']['debut'], rep['boucle']['fin']
    boucle = x[d:fn]
    r = {'cle': rep['cle'], 'titre': rep['titre']}
    # une musique de film se règle sur son introduction (`sonie_sur: 'intro'`) : la cible s'y mesure
    ref = rep['intro'] if rep.get('sonie_sur') == 'intro' else rep['boucle']
    r['lufs_boucle'] = round(dsp.sonie_integree(x[ref['debut']:ref['fin']]), 2)
    r['lufs_master'] = round(dsp.sonie_integree(x), 2)
    ct = dsp.sonie_court_terme(boucle)
    r['court_terme_max'] = round(float(ct.max()), 1)
    r['court_terme_min'] = round(float(ct.min()), 1)
    r['crete_dbtp'] = round(dsp.crete_vraie_db(x), 2)
    r['sections'] = []
    for s in rep['sections']:
        y = x[s['debut']:s['fin']]
        r['sections'].append({'nom': s['nom'], 'intro': s.get('intro', False),
                              'lufs': round(dsp.sonie_integree(y), 1) if len(y) > 0.5 * SR else None,
                              'secondes': round(len(y) / SR, 2)})
    r['bandes'] = {k: round(v, 1) for k, v in _bandes(boucle).items()}
    r['stereo'] = _largeur(boucle)
    r['couture'] = couture(x, rep)
    r['duree_s'] = rep['duree_s']
    r['boucle_s'] = rep['boucle_s']
    r['rendu'] = rep.get('rendu', {}).get('secondes_par_minute')
    # les vérifications
    c = []
    lu, tol = CIBLES['lufs']
    c.append(('sonie', abs(r['lufs_boucle'] - lu) <= tol, f'{r["lufs_boucle"]:+.2f} LUFS (cible {lu} ±{tol})'))
    c.append(('crête', r['crete_dbtp'] <= CIBLES['crete_max'], f'{r["crete_dbtp"]:+.2f} dBTP (≤ {CIBLES["crete_max"]})'))
    au_dessus = 100 - r['bandes']['<250']
    c.append(('médium', r['bandes']['<250'] <= CIBLES['graves_max'],
              f'{au_dessus:.0f} % de l\'énergie au-dessus de 250 Hz (≥ {100 - CIBLES["graves_max"]:.0f} %)'))
    c.append(('aigus', r['bandes']['>6k'] <= CIBLES['aigus_max'], f'{r["bandes"][">6k"]:.1f} % au-dessus de 6 kHz (≤ {CIBLES["aigus_max"]:.0f} %)'))
    c.append(('couture', r['couture']['ecart_db'] <= CIBLES['couture_ecart_max'] and
              abs(r['couture']['saut_db']) <= CIBLES['couture_saut_max'],
              f'écart {r["couture"]["ecart_db"]} dB, saut {r["couture"]["saut_db"]:+.2f} dB, spectre {r["couture"]["spectre_db"]} dB, clic ×{r["couture"]["clic"]}'))
    c.append(('grave au milieu', r['stereo']['correlation_grave'] >= 0.8,
              f'corrélation sous 150 Hz {r["stereo"]["correlation_grave"]}'))
    bmin = rep.get('boucle_min_s')
    if bmin is None:
        bmin = 240 if rep.get('ville') else 150
    if bmin:
        c.append(('boucle', r['boucle_s'] >= bmin, f'{r["boucle_s"]:.0f} s (≥ {bmin} s)'))
    r['verifications'] = [{'nom': n, 'ok': bool(ok), 'detail': dtl} for n, ok, dtl in c]
    r['ok'] = all(ok for _, ok, _ in c)
    if dossier:
        mes = mesures_par_mesure(x, rep)
        r['png'] = dessiner(x, rep, dossier, mes)
    return r


def ligne(r):
    b = r['bandes']
    s = r['stereo']
    cu = r['couture']
    l1 = (f'{r["cle"]} « {r["titre"]} »  boucle {r["lufs_boucle"]:+.2f} LUFS · master {r["lufs_master"]:+.2f} · '
          f'court terme {r["court_terme_min"]:+.1f}..{r["court_terme_max"]:+.1f} · crête {r["crete_dbtp"]:+.2f} dBTP')
    l2 = (f'  bandes <250 {b["<250"]:.0f} % · 250–2k {b["250-2k"]:.0f} % · 2–6k {b["2k-6k"]:.1f} % · >6k {b[">6k"]:.1f} %'
          f' · stéréo côtés/milieu {s["cotes_milieu_db"]} dB, corr. {s["correlation"]} (grave {s["correlation_grave"]})')
    l3 = (f'  couture : écart {cu["ecart_db"]} dB, saut {cu["saut_db"]:+.2f} dB, spectre {cu["spectre_db"]} dB, '
          f'clic ×{cu["clic"]} · durée {r["duree_s"]:.1f} s, boucle {r["boucle_s"]:.1f} s · rendu {r["rendu"]} s/min')
    l4 = '  ' + ' · '.join(f'{v["nom"]} {"✓" if v["ok"] else "✗"}' for v in r['verifications'])
    l5 = '  sections : ' + ', '.join(f'{x["nom"]}{"(i)" if x["intro"] else ""} {x["lufs"]}' for x in r['sections'])
    return '\n'.join([l1, l2, l3, l4, l5])


def calibrer(travaux=1, dossier=None, instruments=None):
    """Recalibre les niveaux (moteur/calibration.py) : l'égalisation des zones
    (moteur/zones.json), puis le niveau de chaque articulation mesuré en contexte sur des
    figures de musique (moteur/niveaux.json) ; imprime la table des écarts. Avec des noms
    d'instruments : seulement ceux-là (les autres gardent leurs lignes)."""
    from moteur import calibration
    zones, niveaux, mesures, detail = calibration.calibrer(travaux, journal=lambda m: print(m, flush=True),
                                                           instruments=instruments or None)
    print(calibration.resume_zones(detail))
    print(calibration.table_markdown(mesures))
    if dossier:
        os.makedirs(dossier, exist_ok=True)
        with open(os.path.join(dossier, 'calibration.json'), 'w', encoding='utf-8') as f:
            json.dump({'mesures': calibration.en_json(mesures),
                       'zones': {b: [list(d) for d in det] for b, det in detail.items()}},
                      f, ensure_ascii=False, indent=1)
    print(os.path.join(ICI, 'moteur', 'zones.json'))
    print(os.path.join(ICI, 'moteur', 'niveaux.json'))


def niveaux(instruments=None, travaux=1, dossier=None):
    """La preuve : la sonie en contexte de chaque articulation de chaque instrument à
    hauteur (trois registres, les figures, trois vélocités), avec les tables en place ;
    la table Markdown des écarts, et `niveaux.json` dans `dossier` (pour comparer deux
    états du studio : --comparer)."""
    from moteur import calibration
    mesures = calibration.mesurer_tout(travaux, instruments or None)
    print(calibration.table_markdown(mesures))
    if dossier:
        os.makedirs(dossier, exist_ok=True)
        chemin = os.path.join(dossier, 'niveaux.json')
        with open(chemin, 'w', encoding='utf-8') as f:
            json.dump(calibration.en_json(mesures), f, ensure_ascii=False, indent=1)
        print(chemin)


def comparer(avant, apres):
    """Ce qui a changé d'un état du studio à l'autre (deux sorties de --niveaux) : pour
    chaque instrument et articulation, la différence de sonie en contexte (moyenne des
    figures, des registres et des vélocités), et son étendue d'un registre à l'autre.
    Un fader réglé sur l'ancien état se corrige de l'opposé de la moyenne."""
    from moteur import calibration
    with open(avant, encoding='utf-8') as f:
        a = calibration.depuis_json(json.load(f))
    with open(apres, encoding='utf-8') as f:
        b = calibration.depuis_json(json.load(f))
    print('| Instrument | Articulation | Avant → après (dB) | Grave / médium / aigu (dB) |')
    print('|---|---|---|---|')
    for (n, art) in sorted(set(a) & set(b)):
        ra, rb = a[(n, art)], b[(n, art)]
        cles = sorted(set(ra) & set(rb))
        d = [rb[k] - ra[k] for k in cles]
        par_reg = []
        for rg in calibration.REGISTRES:
            x = [rb[k] - ra[k] for k in cles if k[0] == rg]
            par_reg.append(f'{np.mean(x):+.1f}' if x else '—')
        print(f'| `{n}` | {art} | {np.mean(d):+.1f} | {" / ".join(par_reg)} |')


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('wav', nargs='*')
    ap.add_argument('--out')
    ap.add_argument('--calibrer', action='store_true')
    ap.add_argument('--niveaux', action='store_true', help='la preuve : la sonie en contexte de chaque articulation')
    ap.add_argument('--comparer', nargs=2, metavar=('AVANT', 'APRES'), help='deux sorties de --niveaux')
    ap.add_argument('--travaux', type=int, default=1, help='processus de mesure en parallèle')
    a = ap.parse_args(argv)
    if a.calibrer:
        calibrer(a.travaux, a.out, a.wav)
        return
    if a.niveaux:
        niveaux(a.wav, a.travaux, a.out)
        return
    if a.comparer:
        comparer(*a.comparer)
        return
    for w in a.wav:
        dossier = a.out or os.path.dirname(os.path.abspath(w))
        r = analyser(w, dossier)
        print(ligne(r))
        if r.get('png'):
            print('  ' + '\n  '.join(r['png']))
        chemin = os.path.join(dossier, 'banc.json')
        tout = {}
        if os.path.exists(chemin):
            with open(chemin, encoding='utf-8') as f:
                tout = json.load(f)
        r.pop('png', None)
        tout[r['cle']] = r
        with open(chemin, 'w', encoding='utf-8') as f:
            json.dump(tout, f, ensure_ascii=False, indent=1, default=float)
        if len(tout) > 1:
            l = [v['lufs_boucle'] for v in tout.values()]
            print(f'  l\'ensemble ({len(tout)} thèmes) : sonie de {min(l):+.2f} à {max(l):+.2f} LUFS '
                  f'(écart {max(l) - min(l):.2f} LU)')


if __name__ == '__main__':
    main()
