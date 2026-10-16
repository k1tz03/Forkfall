#!/usr/bin/env python3
"""L'audition : entendre (et vérifier) un instrument seul.

    python3 packages/tools/studio/audition.py violons cors --out <dossier>
        rend pour chaque instrument une phrase type (une gamme, une note tenue, des
        notes brèves, un accord) : <instrument>.wav et <instrument>_spectre.png
    python3 packages/tools/studio/audition.py --accordage
        joue trois notes de chaque instrument mélodique et mesure leur hauteur (la
        fondamentale estimée contre la note écrite, en cents) et l'instant de leur
        attaque (contre le temps écrit, en millisecondes)."""
import argparse
import os
import sys

import numpy as np
import soundfile as sf

ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ICI)

from moteur import dsp  # noqa: E402
from moteur.dsp import SR  # noqa: E402
from moteur.instruments import INSTRUMENTS, Jeu, InstrumentCouches, InstrumentRythmes, InstrumentConception  # noqa: E402
from moteur.theorie import frequence, nom  # noqa: E402


def fondamentale(x, fmin=25.0, fmax=6000.0, seuil=0.12):
    """La fondamentale d'une note tenue par la méthode YIN (la différence cumulée
    normalisée : le premier creux sous le seuil, pas le plus profond, ce qui évite les
    erreurs d'octave), affinée par interpolation parabolique."""
    m = x.mean(axis=1) if x.ndim == 2 else x
    a = int(0.2 * SR)
    seg = m[a:a + int(0.4 * SR)].astype(np.float64)
    if np.abs(seg).max() < 1e-6:
        return None
    W = len(seg) // 2
    tmax = min(int(SR / fmin), W)
    tmin = max(2, int(SR / fmax))
    # d(τ) = Σ (x_j − x_{j+τ})², calculé par FFT
    x0 = seg[:W]
    e0 = np.sum(x0 ** 2)
    cum = np.concatenate([[0.0], np.cumsum(seg ** 2)])
    n = len(seg)
    f = np.fft.rfft(seg, 2 * n)
    g = np.fft.rfft(x0[::-1], 2 * n)
    corr = np.fft.irfft(f * g)[W - 1:W - 1 + tmax]
    taus = np.arange(tmax)
    e_tau = cum[taus + W] - cum[taus]
    d = e0 + e_tau - 2 * corr
    d[0] = 0
    cmnd = np.ones(tmax)
    cs = np.cumsum(d[1:])
    cmnd[1:] = d[1:] * np.arange(1, tmax) / np.maximum(cs, 1e-20)
    tau = None
    for t in range(tmin, tmax - 1):
        if cmnd[t] < seuil:
            while t + 1 < tmax - 1 and cmnd[t + 1] < cmnd[t]:
                t += 1
            tau = t
            break
    if tau is None:
        tau = tmin + int(np.argmin(cmnd[tmin:tmax - 1]))
    y0, y1, y2 = cmnd[tau - 1], cmnd[tau], cmnd[tau + 1]
    den = y0 - 2 * y1 + y2
    dd = 0.5 * (y0 - y2) / den if den != 0 else 0.0
    return SR / (tau + dd)


def attaque_ms(x, t_ecrit):
    m = np.abs(x).max(axis=1)
    w = int(0.003 * SR)
    l = np.convolve(m, np.ones(w) / w, mode='same')
    pic = l.max()
    i = int(np.argmax(l >= 0.1 * pic))
    return (i / SR - t_ecrit) * 1000


def accordage():
    print(f'{"instrument":20s} {"note":>5s} {"écrit":>8s} {"mesuré":>8s} {"cents":>7s} {"attaque":>8s}')
    for nom_i in sorted(INSTRUMENTS):
        inst = INSTRUMENTS[nom_i]
        if inst.etendue is None or isinstance(inst, (InstrumentRythmes, InstrumentConception)):
            continue
        if inst.famille == 'percussions' and nom_i in ('timbales', 'toms', 'taiko', 'taiko_gm'):
            continue
        lo, hi = inst.etendue
        for h in (lo + 5, (lo + hi) // 2, hi - 7):
            jeu = Jeu(0.5, 1.5, h, 100, None, None, 0)
            try:
                y = inst.rendre([jeu], int(3 * SR), {'reglages': {}, 'courbes': {}})
            except Exception as e:
                print(f'{nom_i:20s} {nom(h):>5s}  erreur : {e}')
                continue
            f = fondamentale(y[int(0.5 * SR):])
            att = attaque_ms(y, 0.5)
            ecrit = frequence(h)
            if f is None:
                print(f'{nom_i:20s} {nom(h):>5s} {ecrit:8.1f}        ?         {att:+7.0f} ms')
                continue
            c = 1200 * np.log2(f / ecrit)
            # une octave d'écart (la fondamentale manque, l'harmonique 2 domine) est notée
            oct_ = round(c / 1200)
            reste = c - 1200 * oct_
            drapeau = '' if abs(reste) < 15 else '  ✗'
            o = f' ({oct_:+d} oct.)' if oct_ else ''
            print(f'{nom_i:20s} {nom(h):>5s} {ecrit:8.1f} {f:8.1f} {reste:+7.1f}{o} {att:+7.0f} ms{drapeau}')


# les instruments à hauteur nette dont on vérifie chaque échantillon (les cloches, les
# timbales, les sons inharmoniques n'ont pas de fondamentale qu'un algorithme lise ; le
# piano est accordé « étiré », ses extrêmes plus hauts : c'est voulu, on n'y touche pas)
A_VERIFIER = ('violons', 'altos', 'violoncelles', 'contrebasses', 'harpe', 'cors', 'trompettes',
              'trombones', 'tuba', 'flutes', 'piccolo', 'hautbois', 'clarinettes', 'bassons',
              'vibraphone', 'marimba')


def echantillons(ecrire=False):
    """Mesure la hauteur de CHAQUE échantillon des instruments à hauteur nette, joué à sa
    touche de référence, et propose une correction quand l'écart est crédible : de 12 à
    60 cents, ou au-delà quand une autre couche de la même note est juste à 8 cents près
    (l'échantillon est alors mal étiqueté). Avec `ecrire` : moteur/accords.json."""
    import json
    from moteur import echantillonneur as ech
    from moteur.sources import chemin
    corrections = {}
    vus = set()
    douteux = []
    for nom_i in A_VERIFIER:
        inst = INSTRUMENTS[nom_i]
        for art, spec in inst.articulations.items():
            if spec.get('oneshot') and nom_i not in ('harpe', 'marimba'):
                if not (nom_i == 'vibraphone' and art == 'frappe'):
                    continue
            banque = ech.Banque(chemin(spec['sfz']))
            mesures = {}
            for r in banque.regions:
                cle_e = os.path.basename(r.echantillon)
                if cle_e in vus:
                    continue
                vus.add(cle_e)
                e = ech.charger(r.echantillon)
                f = fondamentale(e.donnees[e.attaque:])
                if f is None:
                    continue
                c = 1200 * np.log2(f / frequence(r.centre + r.tune / 100.0))
                o = round(c / 1200)
                if o != 0:
                    continue        # une erreur d'octave de la mesure, pas de l'échantillon
                mesures[cle_e] = (r.centre, c)
            for cle_e, (centre, c) in mesures.items():
                if abs(c) <= 12:
                    continue
                voisins = [v for k, (ce, v) in mesures.items() if ce == centre and k != cle_e]
                if abs(c) <= 60 or (abs(c) <= 130 and any(abs(v) <= 8 for v in voisins)):
                    corrections[cle_e] = round(-c, 1)
                    print(f'{nom_i:14s} {art:10s} {cle_e:42s} touche {nom(centre):4s} {c:+6.1f} cents → corrigé')
                else:
                    douteux.append(cle_e)
                    print(f'{nom_i:14s} {art:10s} {cle_e:42s} touche {nom(centre):4s} {c:+6.1f} cents (laissé : mesure douteuse)')
    print(f'{len(corrections)} échantillons corrigés sur {len(vus)} ; {len(douteux)} laissés')
    if ecrire:
        p = os.path.join(ICI, 'moteur', 'accords.json')
        with open(p, 'w', encoding='utf-8') as fh:
            json.dump(corrections, fh, ensure_ascii=False, indent=1, sort_keys=True)
            fh.write(chr(10))
        print(p)


def table():
    """La table des instruments (Markdown) : sorte, étendue, articulations, couches de
    vélocité et tours de rôle (lus dans les SFZ), pupitre, place, caractère."""
    from moteur import echantillonneur as ech
    from moteur.instruments import InstrumentSfz, InstrumentGM, InstrumentSynthe
    from moteur.sources import chemin
    print('| Instrument | Sorte | Étendue | Articulations (couches de vélocité × tours de rôle) | Pupitre | Place | Caractère |')
    print('|---|---|---|---|---|---|---|')
    familles = ['cordes', 'cuivres', 'bois', 'percussions', 'claviers', 'choeur', 'guitares', 'batterie',
                'synthes', 'conception']
    for fam in familles:
        for nom_i in sorted(n for n, i in INSTRUMENTS.items() if i.famille == fam):
            inst = INSTRUMENTS[nom_i]
            etendue = f'{nom(inst.etendue[0])}–{nom(inst.etendue[1])}' if inst.etendue else '—'
            arts = []
            for art, spec in inst.articulations.items():
                if isinstance(inst, InstrumentSfz):
                    b = ech.Banque(chemin(spec['sfz']))
                    if 'cle' in spec:
                        regs = [r for r in b.regions if r.lokey <= spec['cle'] <= r.hikey]
                    else:
                        regs = b.regions
                    # les couches qu'une même note traverse (la médiane sur l'étendue)
                    par_note = [len({(r.lovel, r.hivel) for r in regs if r.lokey <= k <= r.hikey})
                                for k in range(128)]
                    par_note = [c for c in par_note if c] or [1]
                    couches = int(np.median(par_note))
                    rr = max(r.seq_length for r in regs) if regs else 1
                    arts.append(f'{art} ({couches}×{rr})')
                else:
                    arts.append(art)
            sorte = {'échantillons': 'échantillons', 'General MIDI': 'banque GM', 'synthèse': 'synthèse',
                     'couches': 'couches'}[inst.sorte]
            uni = getattr(inst, 'unisson', 1)
            pupitre = f'{uni} prises' if uni > 1 else '—'
            pan = inst.mix.get('pan', 0.0)
            prof = inst.mix.get('profondeur', 0.3)
            place = f'{pan:+.2f} / {prof:.2f}'
            print(f'| `{nom_i}` | {sorte} | {etendue} | {", ".join(arts)} | {pupitre} | {place} | {inst.caractere} |')


def phrase(inst):
    """Une phrase type selon l'instrument : (jeux, durée totale)."""
    j = []
    if isinstance(inst, InstrumentRythmes) or inst.famille == 'batterie':
        motif = ['K', 'H', 'S', 'H', 'K', 'K', 'S', 'O']
        for i, p in enumerate(motif * 2):
            j.append(Jeu(0.3 + i * 0.25, 0.2, p, 100 if i % 2 == 0 else 80, None, None, i))
        return j, 5.0
    if inst.etendue is None:
        arts = list(inst.articulations)
        t = 0.3
        for i, a in enumerate(arts):
            for v in (60, 110):
                j.append(Jeu(t, 1.0, 60, v, a, None, len(j)))
                t += 1.6
        return j, t + 3.0
    lo, hi = inst.etendue
    base = max(lo, min(hi - 14, (lo + hi) // 2 - 7))
    gamme = [0, 2, 3, 5, 7, 8, 10, 12]
    t = 0.3
    for i, g in enumerate(gamme):           # la gamme, legato
        j.append(Jeu(t, 0.42, base + g, 90, None, None, len(j)))
        t += 0.4
    t += 0.4
    j.append(Jeu(t, 3.0, base + 7, 100, None, None, len(j)))      # une note tenue
    t += 3.6
    brefs = [a for a in inst.articulations if a in ('staccato', 'pizzicato', 'frappe', 'pince')]
    for i in range(8):                      # des notes brèves
        j.append(Jeu(t, 0.12, base + (0, 7, 12, 7)[i % 4], 70 + 6 * i, brefs[0] if brefs else None,
                     None, len(j)))
        t += 0.2
    t += 0.4
    for h in (0, 3, 7, 12):                 # un accord tenu
        j.append(Jeu(t, 2.5, base + h, 85, None, None, len(j)))
    return j, t + 5.0


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('instruments', nargs='*')
    ap.add_argument('--out')
    ap.add_argument('--accordage', action='store_true')
    ap.add_argument('--echantillons', action='store_true', help='vérifie chaque échantillon')
    ap.add_argument('--ecrire', action='store_true', help='avec --echantillons : écrit moteur/accords.json')
    ap.add_argument('--table', action='store_true', help='la table des instruments (Markdown)')
    a = ap.parse_args(argv)
    if a.table:
        table()
        return
    if a.accordage:
        accordage()
        return
    if a.echantillons:
        echantillons(a.ecrire)
        return
    os.makedirs(a.out, exist_ok=True)
    from banc import dessiner
    for nom_i in a.instruments:
        inst = INSTRUMENTS[nom_i]
        jeux, duree = phrase(inst)
        y = inst.rendre(jeux, int(duree * SR), {'reglages': {}, 'courbes': {}})
        y = dsp.panoramique(y, 0.0, 0.8)
        crete = np.abs(y).max()
        y = y * (0.5 / max(crete, 1e-9))
        chemin = os.path.join(a.out, f'{nom_i}.wav')
        sf.write(chemin, y, SR, subtype='PCM_24')
        rep = {'cle': nom_i, 'sections': [{'nom': nom_i, 'debut': 0, 'fin': len(y), 'mesures': 1}],
               'boucle': {'debut': 0, 'fin': len(y)}, 'mesure_s': duree, 'lufs': dsp.sonie_integree(y)}
        dessiner(y, rep, a.out, [])
        print(chemin)


if __name__ == '__main__':
    main()
