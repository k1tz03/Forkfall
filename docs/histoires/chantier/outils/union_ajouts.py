"""Reconstruit un fichier « union » : la version de HEAD, plus ce que la
branche a ajouté en fin de fichier depuis la base commune."""
import subprocess, sys
def show(ref, path):
    r = subprocess.run(['git', 'show', f'{ref}:{path}'], capture_output=True, text=True)
    if r.returncode: raise SystemExit(r.stderr)
    return r.stdout
branche = sys.argv[1]
base = subprocess.run(['git', 'merge-base', 'HEAD', branche], capture_output=True, text=True).stdout.strip()
for path in sys.argv[2:]:
    b, t, o = show(base, path), show(branche, path), show('HEAD', path)
    if not t.startswith(b):
        # retrouve le plus long préfixe commun, ligne à ligne
        bl, tl = b.splitlines(True), t.splitlines(True)
        i = 0
        while i < min(len(bl), len(tl)) and bl[i] == tl[i]: i += 1
        if i < len(bl):
            raise SystemExit(f'{path}: la branche modifie la base ligne {i+1}, pas seulement en fin de fichier :\n  base: {bl[i]!r}\n  branche: {tl[i]!r}')
        ajout = ''.join(tl[i:])
    else:
        ajout = t[len(b):]
    if not o.endswith('\n'): o += '\n'
    open(path, 'w', encoding='utf-8').write(o + ajout)
    print(f'{path}: +{ajout.count(chr(10))} lignes de {branche}')
