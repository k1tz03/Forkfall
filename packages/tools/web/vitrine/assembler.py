#!/usr/bin/env python3
"""La vitrine du jeu : la page d'accueil publique (la bande-annonce, les dix livres, la bêta).

    python3 packages/tools/web/vitrine/assembler.py --promo <livrables> --out <dossier>

<livrables> est le dossier que rend la chaîne des bandes-annonces (packages/tools/web/promo/README.md :
`bandes_annonces/jeu.16x9.mp4` et `captures/jeu/apple/*.png`). Le dossier de sortie se sert tel quel
(Cloudflare Pages, itch.io, un hébergeur) : `index.html`, `bande-annonce.mp4`, `images/`.

`--artefact` écrit en plus `artefact.html`, la même page sans son en-tête, pour l'aperçu publié sur
claude.ai (l'hôte ajoute lui-même le doctype, le charset et le viewport).

La police pixel (Jersey 15, licence OFL) est embarquée dans la page : aucune requête vers un tiers.
Il faut ImageMagick (`convert`) et ffmpeg.
"""
import argparse
import base64
import pathlib
import shutil
import subprocess
import sys

ICI = pathlib.Path(__file__).resolve().parent
WEB = ICI.parent
# les trois captures des stores qui montrent la ville (pas l'écran des cartes, qui va changer)
CAPTURES = {
    "02": "02_une_ville_en_pixels_qui_se_souvient.png",
    "04": "04_le_samedi_cinq_secondes_pour_decider.png",
    "05": "05_pousse_la_porte_on_te_reconnait.png",
}
ENTETE = ('<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n'
          '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n')


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--promo", required=True, help="le dossier des livrables de la chaîne promo")
    ap.add_argument("--out", required=True)
    ap.add_argument("--artefact", action="store_true", help="écrit aussi artefact.html (aperçu claude.ai)")
    a = ap.parse_args()
    promo, out = pathlib.Path(a.promo), pathlib.Path(a.out)
    bande = promo / "bandes_annonces" / "jeu.16x9.mp4"
    captures = promo / "captures" / "jeu" / "apple"
    manque = [str(p) for p in [bande] + [captures / f for f in CAPTURES.values()] if not p.exists()]
    if manque:
        sys.exit("vitrine : il manque " + ", ".join(manque))
    images = out / "images"
    images.mkdir(parents=True, exist_ok=True)

    for f in sorted((WEB / "accueil").glob("couv_*.webp")) + [WEB / "accueil" / "panorama_nuit.webp"]:
        shutil.copy2(f, images / f.name)
    shutil.copy2(WEB / "pwa" / "apercu.jpg", images / "apercu.jpg")
    for cle, nom in CAPTURES.items():
        subprocess.run(["convert", str(captures / nom), "-resize", "480x", "-quality", "82",
                        str(images / (cle + ".webp"))], check=True)
    # l'affiche de la vidéo : l'image de la septième seconde (« Une carte. Un choix. »)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "7", "-i", str(bande), "-frames:v", "1",
                    "-vf", "scale=1280:-2", "-q:v", "3", str(images / "affiche.jpg")], check=True)
    shutil.copy2(bande, out / "bande-annonce.mp4")

    page = (ICI / "page.html").read_text(encoding="utf-8")
    police = base64.b64encode((WEB / "cinema" / "polices" / "jersey-15-latin-400-normal.woff2").read_bytes()).decode()
    if page.count("__JERSEY_WOFF2__") != 1:
        sys.exit("vitrine : page.html doit porter une fois __JERSEY_WOFF2__")
    page = page.replace("__JERSEY_WOFF2__", police)
    # le document complet : ce qui précède la fin du <style> va dans l'en-tête
    fin = page.index("</style>") + len("</style>")
    (out / "index.html").write_text(ENTETE + page[:fin] + "\n</head>\n<body>\n" + page[fin:].lstrip() +
                                    "</body>\n</html>\n", encoding="utf-8")
    if a.artefact:
        # dans la galerie claude.ai, à côté du jeu (« Fusible »), l'aperçu porte un autre nom
        (out / "artefact.html").write_text(page.replace("<title>Fusible</title>", "<title>Vitrine Fusible</title>", 1),
                                           encoding="utf-8")
    n = sum(1 for _ in out.rglob("*") if _.is_file())
    print(f"vitrine : {out}/index.html et {n - 1} fichiers à côté")


if __name__ == "__main__":
    main()
