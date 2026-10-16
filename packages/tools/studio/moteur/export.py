"""L'export : le master (WAV 44,1 kHz stéréo 24 bits), ses repères (JSON, le contrat
avec le lecteur du jeu) et une écoute MP3 (l'introduction, un tour de boucle, six
secondes de fondu)."""
import json
import os
import subprocess

import numpy as np
import soundfile as sf

from .dsp import SR


def ecrire(dossier, cle, master, reperes):
    os.makedirs(dossier, exist_ok=True)
    wav = os.path.join(dossier, f'{cle}.wav')
    sf.write(wav, master, SR, subtype='PCM_24')
    js = os.path.join(dossier, f'{cle}.json')
    with open(js, 'w', encoding='utf-8') as f:
        json.dump(reperes, f, ensure_ascii=False, indent=2)
        f.write('\n')
    return wav, js


def ecoute_mp3(dossier, cle, master, reperes, fondu_s=6.0):
    """L'écoute pour les humains : du début à la fin du premier passage du corps, puis
    six secondes du second passage en fondu (on entend la couture)."""
    b0 = reperes['boucle']['debut']
    nf = int(fondu_s * SR)
    x = np.array(master[:min(len(master), b0 + nf)], dtype=np.float32, copy=True)
    k = len(x) - b0
    if k > 0:
        x[b0:] *= np.cos(np.linspace(0, np.pi / 2, k, dtype=np.float32))[:, None] ** 2
    tmp = os.path.join(dossier, f'.{cle}.ecoute.wav')
    sf.write(tmp, x, SR, subtype='PCM_24')
    mp3 = os.path.join(dossier, f'{cle}.ecoute.mp3')
    try:
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', tmp, '-codec:a', 'libmp3lame',
                        '-q:a', '2', mp3], check=True)
    finally:
        os.remove(tmp)
    return mp3
