#!/usr/bin/env python3
"""Rendre un thème : partition → master mixé et masterisé + repères + écoute MP3.

    python3 packages/tools/studio/rendre.py packages/tools/studio/partitions/<clé>.py --verifier
        vérifier la partition en une seconde, sans rien rendre
    python3 packages/tools/studio/rendre.py packages/tools/studio/partitions/<clé>.py --out <dossier>
        [--banc]            mesurer aussi (banc.py) : rapport, spectrogramme, courbe
        [--sans-mp3]        pas d'écoute MP3
        [--intro-seule]     ne rend que l'introduction (pour travailler un début)
        [--sections A,B]    ne rend que ces sections, dans cet ordre, en boucle (pour
                            travailler un passage ; le master et le banc suivent)

Le dossier reçoit <clé>.wav, <clé>.json (le contrat du lecteur), <clé>.ecoute.mp3.
Une partition est un fichier Python qui définit `theme` (moteur.ecriture.Theme) ;
le guide : docs/design/studio.md."""
import argparse
import importlib.util
import json
import os
import sys
import time

ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ICI)


def charger_partition(chemin):
    nom = 'partition_' + os.path.splitext(os.path.basename(chemin))[0]
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    theme = getattr(mod, 'theme', None)
    if theme is None:
        raise SystemExit(f'{chemin} : la partition doit définir `theme` (un Theme)')
    return theme


def verifier(theme):
    """Vérifie une partition sans la rendre (une seconde) : les instruments, les
    articulations, les étendues, les pièces de batterie, la carte des sections, la
    longueur de la boucle. Rend le nombre d'erreurs."""
    from moteur import rendu
    from moteur.instruments import INSTRUMENTS, InstrumentGM, InstrumentRythmes, PIECES_GM
    from moteur.theorie import nom as nom_note
    erreurs = 0
    avis = 0
    for p in theme.pistes.values():
        if p.instrument not in INSTRUMENTS:
            print(f'✗ piste {p.nom} : instrument inconnu {p.instrument!r}')
            erreurs += 1
    intro, deja = rendu.construire(theme, theme.intro, 'intro')
    corps, _ = rendu.construire(theme, theme.corps, 'corps', deja)
    for seg in (intro, corps):
        for nom_p, notes in sorted(seg.notes.items()):
            p = theme.pistes[nom_p]
            inst = INSTRUMENTS.get(p.instrument)
            if inst is None:
                continue
            hors = []
            for n in notes:
                art = n.art or p.reglages.get('art') or inst.defaut
                if art not in inst.articulations:
                    print(f'✗ {seg.nom} {nom_p} : articulation {art!r} inconnue de {inst.nom} '
                          f'(connues : {", ".join(inst.articulations)})')
                    erreurs += 1
                    break
                if isinstance(n.h, str):
                    pieces = PIECES_GM if isinstance(inst, InstrumentGM) else (
                        ('K', 'S', 'CL', 'H', 'O', 'T1', 'T2', 'T3') if isinstance(inst, InstrumentRythmes) else ())
                    # une percussion à touche fixe (la caisse claire, les cymbales…) joue
                    # sa pièce quel que soit le nom écrit
                    fixe = 'cle' in (inst.articulations.get(art) or {}) if isinstance(
                        inst.articulations.get(art), dict) else False
                    if n.h not in pieces and not fixe:
                        print(f'✗ {seg.nom} {nom_p} : pièce {n.h!r} inconnue de {inst.nom}')
                        erreurs += 1
                        break
                elif inst.etendue and not (inst.etendue[0] <= n.h + p.reglages.get('transpose', 0) <= inst.etendue[1]):
                    hors.append(n.h)
            if hors:
                avis += 1
                print(f'! {seg.nom} {nom_p} : {len(hors)} note(s) hors de l\'étendue de {inst.nom} '
                      f'({nom_note(inst.etendue[0])}–{nom_note(inst.etendue[1])}) : '
                      f'{", ".join(sorted({nom_note(h) for h in hors}))}')
    print(f'{theme.cle} « {theme.titre} » : {len(theme.pistes)} pistes')
    for seg in (intro, corps):
        for nom_s, a, b, rep, rang in seg.sections:
            sec = theme.sections[nom_s]
            nb = sum(1 for notes in seg.notes.values() for n in notes if a <= n.t < b)
            print(f'  {seg.nom:5s} {nom_s:8s} {sec.mesures:3d} m.  {seg.tempo.secondes(a):7.2f} → '
                  f'{seg.tempo.secondes(b):7.2f} s  {nb:5d} notes' + ('' if rep else '  (pas de reprise)'))
    bmin = theme.boucle_min if theme.boucle_min is not None else (240 if theme.ville else 150)
    ok = corps.duree >= bmin
    print(f'  la boucle : {corps.duree:.1f} s ({sum(theme.sections[x].mesures for x in theme.corps)} mesures)'
          + (f', il en faut {bmin} {"✓" if ok else "✗"}' if bmin else ''))
    if bmin and not ok:
        erreurs += 1
    print(f'{erreurs} erreur(s), {avis} avis')
    return erreurs


def main(argv=None):
    from moteur import export, rendu
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('partition')
    ap.add_argument('--out')
    ap.add_argument('--verifier', action='store_true', help='vérifier la partition sans la rendre')
    ap.add_argument('--banc', action='store_true')
    ap.add_argument('--sans-mp3', action='store_true')
    ap.add_argument('--intro-seule', action='store_true')
    ap.add_argument('--sections')
    ap.add_argument('--pistes', action='store_true', help='la sonie de chaque piste (pour équilibrer)')
    a = ap.parse_args(argv)
    theme = charger_partition(a.partition)
    if a.verifier:
        raise SystemExit(1 if verifier(theme) else 0)
    if not a.out:
        ap.error('--out est requis pour rendre')
    if a.intro_seule:
        theme.corps = list(theme.intro)
        theme.intro = []
    if a.sections:
        theme.intro = []
        theme.corps = a.sections.split(',')
        theme.boucle_min = 0
    journal = []
    t0 = time.time()
    master, reperes = rendu.rendre(theme, journal)
    duree_rendu = time.time() - t0
    reperes['rendu'] = {
        'secondes': round(duree_rendu, 1),
        'secondes_par_minute': round(duree_rendu / (reperes['duree_s'] / 60.0), 1),
        'pistes': [{'segment': s, 'piste': p, 'secondes': t, 'lufs': l} for s, p, t, l in journal],
    }
    wav, js = export.ecrire(a.out, theme.cle, master, reperes)
    print(f'{theme.cle} « {theme.titre} » : {reperes["duree_s"]:.1f} s de master, boucle '
          f'{reperes["boucle_s"]:.1f} s, {reperes["lufs"]:+.2f} LUFS, crête {reperes["crete_dbtp"]:+.2f} dBTP, '
          f'rendu en {duree_rendu:.0f} s ({reperes["rendu"]["secondes_par_minute"]} s par minute)')
    print(f'  {wav}\n  {js}')
    if a.pistes:
        for seg, p, t, l in sorted(journal, key=lambda x: (x[0], -x[3])):
            print(f'    {seg:6s} {p:20s} {l:+6.1f} LUFS  ({t:.1f} s de rendu)')
    if not a.sans_mp3:
        mp3 = export.ecoute_mp3(a.out, theme.cle, master, reperes)
        print(f'  {mp3}')
    if a.banc:
        import banc
        banc.main([wav, '--out', a.out])


if __name__ == '__main__':
    main()
