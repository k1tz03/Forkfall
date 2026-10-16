#!/bin/bash
# FUSIBLE — le studio : installe les outils et télécharge les échantillons.
#
#   bash packages/tools/studio/installer.sh            # outils + échantillons
#   bash packages/tools/studio/installer.sh --verifier # ne télécharge rien : dit ce qui manque
#
# Les échantillons ne vont JAMAIS dans le dépôt : ils vont dans $FUSIBLE_ECHANTILLONS
# (par défaut le dossier partagé du studio dans le scratchpad). Chaque source est
# épinglée (un commit, une version de paquet) et sa licence est vérifiée ici, puis
# notée dans packages/tools/studio/LICENCES.md. Seulement CC0, domaine public, MIT.
#
# Les bibliothèques font des gigaoctets : on n'en prend que les dossiers utiles
# (clone sans blobs + extraction partielle). Les noms de marque de certains dossiers
# ne s'écrivent pas ici : un motif les désigne (« Grand Piano, S* »).
set -euo pipefail

SP_DEFAUT=/tmp/claude-0/-home-user-Forkfall/cd07074c-ad97-5e94-99ba-f10cfbe50abd/scratchpad/studio/echantillons
ECH="${FUSIBLE_ECHANTILLONS:-$SP_DEFAUT}"
VERIFIER=0
[ "${1:-}" = "--verifier" ] && VERIFIER=1

# --- les sources épinglées --------------------------------------------------------
# L'orchestre de chambre (CC0), branche des cartographies SFZ.
ORCH_URL=https://github.com/sgossner/VSCO-2-CE
ORCH_COMMIT=6dd651d55dde97fd4028699be9d4481f26917891
# La bibliothèque communautaire (CC0), branche des cartographies SFZ.
COMM_URL=https://github.com/sgossner/VCSL
COMM_COMMIT=dfcf4a4918771eee884b96ad4493de82ef84daf6
# Le texte CC0 de cette bibliothèque n'est versé que sur sa branche principale (son
# README le dit déjà sur la branche SFZ) : on le prend à ce commit-là.
COMM_LICENCE=c1ea7bcc3c7309650ab0da9d15c9cd1fbc4a4c7e
# Les deux banques General MIDI (MIT), paquets Ubuntu 24.04.
PAQUETS_APT="fluidsynth fluid-soundfont-gm musescore-general-soundfont-lossless ffmpeg"
# Les outils Python (licences : BSD, PSF, MIT ; aucun GPL importé par le studio ;
# pyloudnorm ne sert qu'à contre-vérifier la sonie que le banc mesure lui-même).
PAQUETS_PIP="numpy scipy soundfile matplotlib pyloudnorm"

manque=0
dit() { printf '%s\n' "$*"; }

# --- les outils --------------------------------------------------------------------
if [ $VERIFIER = 1 ]; then
  for p in $PAQUETS_APT; do dpkg -s "$p" >/dev/null 2>&1 || { dit "manque le paquet $p"; manque=1; }; done
  python3 - <<'EOF' || manque=1
import importlib, sys
ok = True
for m in ('numpy', 'scipy', 'soundfile', 'matplotlib'):
    try:
        importlib.import_module(m)
    except Exception:
        print('manque le module Python', m); ok = False
sys.exit(0 if ok else 1)
EOF
else
  if ! dpkg -s $PAQUETS_APT >/dev/null 2>&1; then
    apt-get update -qq
    DEBIAN_FRONTEND=noninteractive apt-get install -y -qq $PAQUETS_APT
  fi
  # le même interprète que celui qui rendra (`pip` peut viser un autre Python)
  python3 -c "import numpy, scipy, soundfile, matplotlib, pyloudnorm" 2>/dev/null \
    || python3 -m pip install -q $PAQUETS_PIP
fi

# --- les échantillons --------------------------------------------------------------
# clone_partiel <url> <dossier> <commit> [<commit de la licence>] : clone sans blobs,
# extraction des seuls motifs lus sur l'entrée standard (syntaxe .gitignore), au commit
# épinglé ; puis le dépôt git est effacé (ses blobs doublaient la place prise sur le
# disque) et un témoin `.source` garde l'adresse, le commit et l'empreinte des motifs :
# relancer l'installateur ne retélécharge rien tant que le témoin est le même.
clone_partiel() {
  local url=$1 dest=$2 commit=$3 commit_licence=${4:-}
  local motifs; motifs=$(cat)
  local temoin; temoin="$url $commit $(printf '%s' "$motifs" | sha256sum | cut -c1-16)"
  if [ -f "$dest/.source" ] && [ "$(cat "$dest/.source")" = "$temoin" ]; then
    return 0
  fi
  if [ ! -d "$dest/.git" ]; then
    rm -rf "$dest"
    git clone -q --filter=blob:none --no-checkout "$url" "$dest"
  fi
  if ! git -C "$dest" cat-file -e "$commit^{commit}" 2>/dev/null; then
    git -C "$dest" fetch -q --filter=blob:none origin "$commit"
  fi
  printf '%s\n' "$motifs" | git -C "$dest" sparse-checkout set --no-cone --stdin
  git -C "$dest" -c advice.detachedHead=false checkout -q --detach "$commit"
  if [ -n "$commit_licence" ]; then
    # la licence n'est sur la branche principale qu'à partir de ce commit
    git -C "$dest" fetch -q --filter=blob:none origin "$commit_licence"
    git -C "$dest" show "$commit_licence:LICENSE" > "$dest/LICENSE"
  fi
  rm -rf "$dest/.git"
  printf '%s' "$temoin" > "$dest/.source"
}

if [ $VERIFIER = 0 ]; then
  mkdir -p "$ECH"
  clone_partiel "$ORCH_URL" "$ECH/orchestre" "$ORCH_COMMIT" <<'EOF'
/*.sfz
/LICENSE
/README.md
/Readme.txt
/Strings/Violin Section/
/Strings/Viola Section/
/Strings/Cello Section/
/Strings/Solo Contrabass/
/Strings/Harp/
/Brass/F Horn/
/Brass/Trumpet/
/Brass/Tenor Trombone/
/Brass/Tuba/
/Woodwinds/Flute/
/Woodwinds/Oboe/
/Woodwinds/Clarinet/
/Woodwinds/Bassoon/
/Woodwinds/Piccolo/
/Percussion/
EOF
  clone_partiel "$COMM_URL" "$ECH/communautaire" "$COMM_COMMIT" "$COMM_LICENCE" <<'EOF'
/README.md
/Chordophones/Zithers/Grand Piano, S*.sfz
/Chordophones/Zithers/Grand Piano, S*/NoSus/
/Chordophones/Zithers/Grand Piano, S*/Rel/
/Membranophones/Struck Membranophones/Bass Drum 1*
/Membranophones/Struck Membranophones/Bass Drum 2*
/Membranophones/Struck Membranophones/Frame Drum*
/Membranophones/Struck Membranophones/Snare Drum, Modern 1*
/Membranophones/Struck Membranophones/Snare Drum, Modern 2*
/Membranophones/Struck Membranophones/Tom 1*
/Membranophones/Struck Membranophones/Tom 2*
/Idiophones/Struck Idiophones/Clash Cymbals 1*
/Idiophones/Struck Idiophones/Suspended Cymbal 1*
/Idiophones/Struck Idiophones/Gong 1*
/Idiophones/Struck Idiophones/Hi-Hat Cymbal*
/Idiophones/Struck Idiophones/Claps*
/Idiophones/Struck Idiophones/Tubular Bells 1*
/Idiophones/Struck Idiophones/Glockenspiel*
/Idiophones/Struck Idiophones/Vibraphone*
/Idiophones/Struck Idiophones/Shaker, Small*
/Idiophones/Struck Idiophones/Tambourine 1*
/Idiophones/Struck Idiophones/Anvil*
/Idiophones/Struck Idiophones/Brake Drum*
/Idiophones/Struck Idiophones/Mark Trees*
/Aerophones/Edge-blown Aerophones/Pipe Organ*
EOF
fi

# --- les licences, vérifiées sur les fichiers eux-mêmes ------------------------------
verifie_cc0() {
  local f=$1
  if [ ! -f "$f" ]; then dit "manque $f"; manque=1; return; fi
  grep -q "CC0 1.0 Universal" "$f" || { dit "licence inattendue : $f"; manque=1; }
}
verifie_cc0 "$ECH/orchestre/LICENSE"
verifie_cc0 "$ECH/communautaire/LICENSE"
for f in /usr/share/doc/fluid-soundfont-gm/copyright \
         /usr/share/doc/musescore-general-soundfont-lossless/copyright; do
  if [ -f "$f" ] && grep -q "MIT" "$f"; then :; else dit "licence MIT introuvable : $f"; manque=1; fi
done
for f in /usr/share/sounds/sf2/FluidR3_GM.sf2 /usr/share/sounds/sf2/MuseScore_General_Full.sf2; do
  [ -f "$f" ] || { dit "manque la banque $f"; manque=1; }
done

if [ $manque = 0 ]; then
  n=$(find "$ECH" -type f \( -name '*.wav' -o -name '*.flac' -o -name '*.ogg' \) | wc -l)
  dit "studio prêt : $n échantillons dans $ECH ($(du -sh "$ECH" | cut -f1))"
else
  dit "studio incomplet (voir ci-dessus)"
  exit 1
fi
