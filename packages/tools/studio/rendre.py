#!/usr/bin/env python3
"""Rendre un thème : partition → master mixé et masterisé + repères + écoute MP3.

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


def main(argv=None):
    from moteur import export, rendu
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('partition')
    ap.add_argument('--out', required=True)
    ap.add_argument('--banc', action='store_true')
    ap.add_argument('--sans-mp3', action='store_true')
    ap.add_argument('--intro-seule', action='store_true')
    ap.add_argument('--sections')
    ap.add_argument('--pistes', action='store_true', help='la sonie de chaque piste (pour équilibrer)')
    a = ap.parse_args(argv)
    theme = charger_partition(a.partition)
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
