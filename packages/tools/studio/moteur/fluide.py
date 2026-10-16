"""Les banques General MIDI (soundfonts) par FluidSynth, appelé directement par
ctypes (libfluidsynth, LGPL : une bibliothèque qu'on appelle, rien n'est lié au
studio). Elles fournissent ce que les bibliothèques CC0 n'ont pas : le chœur, les
guitares, les batteries complètes, les basses électriques, les pupitres de
contrebasses.

Chaque piste se rend seule, sans la réverbe ni le chorus internes (le mélange les
fait), en flottants (aucun tramage) : le rendu est déterministe."""
import ctypes
import ctypes.util
import os

import numpy as np

from .dsp import SR

BANQUES = {
    # la banque générale de référence (MIT ; échantillons en partie CC0)
    'generale': '/usr/share/sounds/sf2/MuseScore_General_Full.sf2',
    # la banque de secours (MIT)
    'secours': '/usr/share/sounds/sf2/FluidR3_GM.sf2',
}

_lib = None


def _bib():
    global _lib
    if _lib is not None:
        return _lib
    nom = ctypes.util.find_library('fluidsynth') or 'libfluidsynth.so.3'
    lib = ctypes.CDLL(nom)
    vp, ci, cd, cc = ctypes.c_void_p, ctypes.c_int, ctypes.c_double, ctypes.c_char_p
    lib.new_fluid_settings.restype = vp
    lib.fluid_settings_setnum.argtypes = [vp, cc, cd]
    lib.fluid_settings_setint.argtypes = [vp, cc, ci]
    lib.fluid_settings_setstr.argtypes = [vp, cc, cc]
    lib.new_fluid_synth.restype = vp
    lib.new_fluid_synth.argtypes = [vp]
    lib.fluid_synth_sfload.argtypes = [vp, cc, ci]
    lib.fluid_synth_program_select.argtypes = [vp, ci, ci, ci, ci]
    lib.fluid_synth_noteon.argtypes = [vp, ci, ci, ci]
    lib.fluid_synth_noteoff.argtypes = [vp, ci, ci]
    lib.fluid_synth_cc.argtypes = [vp, ci, ci, ci]
    lib.fluid_synth_pitch_bend.argtypes = [vp, ci, ci]
    lib.fluid_synth_pitch_wheel_sens.argtypes = [vp, ci, ci]
    lib.fluid_synth_system_reset.argtypes = [vp]
    lib.fluid_synth_all_sounds_off.argtypes = [vp, ci]
    lib.fluid_synth_set_interp_method.argtypes = [vp, ci, ci]
    lib.fluid_synth_write_float.argtypes = [vp, ci, vp, ci, ci, vp, ci, ci]
    lib.fluid_synth_get_active_voice_count.argtypes = [vp]
    lib.fluid_synth_get_sfont_by_id.restype = vp
    lib.fluid_synth_get_sfont_by_id.argtypes = [vp, ci]
    lib.fluid_synth_add_sfont.argtypes = [vp, vp]
    lib.fluid_synth_remove_sfont.argtypes = [vp, vp]
    lib.delete_fluid_synth.argtypes = [vp]
    lib.delete_fluid_settings.argtypes = [vp]
    lib.fluid_set_log_function.argtypes = [ci, vp, vp]
    # FluidSynth parle beaucoup (un synthé neuf cherche un programme sur 32 canaux
    # avant qu'on lui prête la banque) : on garde ses erreurs, on tait ses avis
    for niveau in (2, 3, 4):
        lib.fluid_set_log_function(niveau, None, None)
    _lib = lib
    return lib


class Synthe:
    """Un FluidSynth chargé d'une banque (on le garde : charger la banque coûte)."""
    _ouverts = {}

    @classmethod
    def pour(cls, banque='generale'):
        s = cls._ouverts.get(banque)
        if s is None:
            s = cls(BANQUES.get(banque, banque))
            cls._ouverts[banque] = s
        return s

    def __init__(self, chemin):
        if not os.path.exists(chemin):
            raise FileNotFoundError(f'banque introuvable : {chemin} (bash packages/tools/studio/installer.sh)')
        lib = _bib()
        self.lib = lib
        self.reglages = lib.new_fluid_settings()
        lib.fluid_settings_setnum(self.reglages, b'synth.sample-rate', float(SR))
        lib.fluid_settings_setnum(self.reglages, b'synth.gain', 1.0)
        lib.fluid_settings_setint(self.reglages, b'synth.reverb.active', 0)
        lib.fluid_settings_setint(self.reglages, b'synth.chorus.active', 0)
        lib.fluid_settings_setint(self.reglages, b'synth.polyphony', 1024)
        lib.fluid_settings_setint(self.reglages, b'synth.cpu-cores', 1)
        lib.fluid_settings_setint(self.reglages, b'synth.midi-channels', 32)
        # le porteur charge la banque une fois et la garde ; chaque rendu se fait dans un
        # synthé neuf qui l'emprunte (un synthé qui a déjà joué garde des états : deux
        # rendus des mêmes notes y différaient de −90 dB, et de −30 dB après une autre
        # piste ; un synthé neuf rend toujours les mêmes échantillons)
        self.porteur = lib.new_fluid_synth(self.reglages)
        sid = lib.fluid_synth_sfload(self.porteur, chemin.encode(), 1)
        if sid < 0:
            raise RuntimeError(f'FluidSynth ne lit pas {chemin}')
        self.banque = lib.fluid_synth_get_sfont_by_id(self.porteur, sid)

    def rendre(self, evenements, n, canaux):
        """Rend `n` échantillons stéréo. `canaux` : {canal: (banque, programme)} ;
        `evenements` : [(échantillon, type, canal, a, b)] avec type 'on' (note, vel),
        'off' (note), 'cc' (numéro, valeur), 'pb' (valeur 0..16383), 'sens' (demi-tons).
        Les événements s'appliquent au début du bloc de 64 qui les contient."""
        lib = self.lib
        s = lib.new_fluid_synth(self.reglages)
        sf_id = lib.fluid_synth_add_sfont(s, self.banque)
        lib.fluid_synth_set_interp_method(s, -1, 7)   # l'interpolation la plus fine
        for c, (bq, prog) in canaux.items():
            lib.fluid_synth_program_select(s, c, sf_id, bq, prog)
            lib.fluid_synth_cc(s, c, 7, 100)
            lib.fluid_synth_cc(s, c, 10, 64)
            lib.fluid_synth_cc(s, c, 11, 127)
            lib.fluid_synth_cc(s, c, 91, 0)
            lib.fluid_synth_cc(s, c, 93, 0)
        evenements = sorted(evenements, key=lambda e: (e[0], 0 if e[1] in ('sens', 'cc', 'pb') else
                                                       (1 if e[1] == 'off' else 2)))
        n_demande = n
        n = -(-n // 64) * 64              # des blocs entiers de 64
        gauche = np.zeros(n, dtype=np.float32)
        droite = np.zeros(n, dtype=np.float32)
        pos = 0
        i = 0
        B = 64
        while pos < n:
            while i < len(evenements) and evenements[i][0] < pos + B:
                _, typ, c, a, b = evenements[i]
                if typ == 'on':
                    lib.fluid_synth_noteon(s, c, int(a), int(b))
                elif typ == 'off':
                    lib.fluid_synth_noteoff(s, c, int(a))
                elif typ == 'cc':
                    lib.fluid_synth_cc(s, c, int(a), int(b))
                elif typ == 'pb':
                    lib.fluid_synth_pitch_bend(s, c, int(b))
                elif typ == 'sens':
                    lib.fluid_synth_pitch_wheel_sens(s, c, int(a))
                i += 1
            # aller jusqu'au prochain événement d'un coup (en multiples de 64)
            prochain = evenements[i][0] if i < len(evenements) else n
            bout = max(B, ((prochain - pos) // B) * B)
            bout = min(bout, n - pos)
            lp = gauche[pos:pos + bout].ctypes.data_as(ctypes.c_void_p)
            rp = droite[pos:pos + bout].ctypes.data_as(ctypes.c_void_p)
            lib.fluid_synth_write_float(s, int(bout), lp, 0, 1, rp, 0, 1)
            pos += bout
            if i >= len(evenements) and lib.fluid_synth_get_active_voice_count(s) == 0:
                break
        lib.fluid_synth_remove_sfont(s, self.banque)
        lib.delete_fluid_synth(s)
        return np.stack([gauche[:n_demande], droite[:n_demande]], axis=1)
