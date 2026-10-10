"""Retire la SECONDE fiche d'un personnage (characters.yaml) ou d'un portrait
(portraits.yaml) quand deux livres l'ont créé : la première arrivée fait foi."""
import re, sys
def blocs(lignes, debut_re):
    starts = [i for i, l in enumerate(lignes) if debut_re.match(l)]
    return starts
for path, motif in [('content/characters.yaml', r'^  - id: ([a-z_0-9]+)\s*$'),
                    ('content/portraits.yaml', r'^  ([a-z_0-9]+):(\s|$)')]:
    lignes = open(path, encoding='utf-8').read().splitlines(True)
    debut = re.compile(motif)
    fin_bloc = re.compile(r'^  (- id: |[a-z_0-9]+:|#)|^[^ \n]')
    vus, a_retirer = set(), []
    for i, l in enumerate(lignes):
        m = debut.match(l)
        if not m: continue
        cid = m.group(1)
        if cid in vus:
            j = i + 1
            while j < len(lignes) and not fin_bloc.match(lignes[j]): j += 1
            # garde la ligne vide qui sépare deux blocs, une seule fois
            a_retirer.append((i, j, cid))
        vus.add(cid)
    for i, j, cid in reversed(a_retirer):
        del lignes[i:j]
        print(f'{path}: seconde fiche « {cid} » retirée ({j - i} lignes)')
    texte = re.sub(r'\n{3,}', '\n\n', ''.join(lignes))
    open(path, 'w', encoding='utf-8').write(texte)
