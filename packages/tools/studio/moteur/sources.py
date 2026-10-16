"""Où sont les échantillons (jamais dans le dépôt : installer.sh les télécharge)."""
import glob
import os

ECHANTILLONS = os.environ.get(
    'FUSIBLE_ECHANTILLONS',
    '/tmp/claude-0/-home-user-Forkfall/cd07074c-ad97-5e94-99ba-f10cfbe50abd/scratchpad/studio/echantillons')


def chemin(relatif):
    """Le chemin absolu d'un fichier de la bibliothèque ; un motif (« * ») désigne un
    dossier sans écrire le nom de marque qu'il porte."""
    p = os.path.join(ECHANTILLONS, relatif)
    if any(c in relatif for c in '*?['):
        trouves = sorted(glob.glob(p))
        if not trouves:
            raise FileNotFoundError(f'aucun fichier ne répond à {relatif!r} dans {ECHANTILLONS} '
                                    f'(bash packages/tools/studio/installer.sh)')
        return trouves[0]
    if not os.path.exists(p):
        raise FileNotFoundError(f'{p} manque (bash packages/tools/studio/installer.sh)')
    return p
