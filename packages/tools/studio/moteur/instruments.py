"""Les instruments du studio, nommés en français, et leur façon de jouer.

Quatre sortes :
- échantillonnés (SFZ) : l'orchestre de chambre et la bibliothèque communautaire
  (cordes, cuivres, bois, timbales, percussions, piano, orgue) ;
- General MIDI par FluidSynth : ce qui manque aux bibliothèques CC0 (chœur,
  guitares, batteries, basse électrique, pupitre de contrebasses, taiko) ;
- synthétiques (numpy) : basses, arpèges, nappes, leads, montées, impacts, la boîte
  à rythmes ;
- en couches : plusieurs des précédents joués ensemble (le « braam », le taiko,
  la contrebasse de film).

Chaque instrument dit son étendue, ses articulations, son caractère et ses réglages
de mélange par défaut (sa place sur la scène, sa profondeur, sa salle, son bus).
La table complète, pour les compositeurs : docs/design/studio.md."""
import json
import os

import numpy as np

from . import dsp, echantillonneur as ech, synthe
from .dsp import SR
from .fluide import Synthe
from .sources import chemin
from .theorie import hauteur

# les petites variations d'une note brève répétée (les bibliothèques n'ont que deux prises
# par note : sans elles, un ostinato de doubles croches « mitraille ») : (cents, dB), en
# cycle sur le rang de la note — fixes, donc rendues à l'identique à chaque rendu
_VARIATIONS = [(0.0, 0.0), (3.0, -0.6), (-2.5, -0.3), (1.5, -0.9), (-1.5, -0.2)]

# les prises d'un pupitre fabriqué : désaccord (cents), retard (ms), place (±)
_UNISSON = [(0.0, 0.0, 0.0), (7.0, 13.0, -0.14), (-6.0, 22.0, 0.14), (4.0, 7.0, -0.07),
            (-9.0, 29.0, 0.08), (10.0, 17.0, -0.2), (-3.0, 35.0, 0.2), (5.0, 4.0, 0.0)]

_NIVEAUX = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'niveaux.json')


class Jeu:
    """Une note prête à jouer : début et durée en secondes (depuis le début du tampon
    du segment), hauteur MIDI (ou nom de pièce), vélocité, articulation, paramètres."""
    __slots__ = ('t', 'd', 'h', 'v', 'art', 'p', 'rang')

    def __init__(self, t, d, h, v, art, p, rang):
        self.t, self.d, self.h, self.v, self.art, self.p, self.rang = t, d, h, v, art, p, rang


def _ajouter(sortie, x, pos, g=1.0, gl=1.0, gr=1.0):
    """Ajoute `x` (stéréo) dans `sortie` à l'échantillon `pos` (coupé aux bords)."""
    n = len(sortie)
    if pos >= n or pos + len(x) <= 0:
        return
    a = max(0, pos)
    b = min(n, pos + len(x))
    morceau = x[a - pos:b - pos]
    if gl == gr == 1.0:
        sortie[a:b] += morceau * np.float32(g)
    else:
        sortie[a:b, 0] += morceau[:, 0] * np.float32(g * gl)
        sortie[a:b, 1] += morceau[:, 1] * np.float32(g * gr)


class Instrument:
    sorte = '?'

    def __init__(self, nom, famille, etendue, articulations, defaut, caractere, mix=None,
                 niveau=0.0, avance=None, transposition=0):
        self.nom = nom
        # les échantillons de certains instruments sont rangés à la hauteur écrite des
        # partitions d'orchestre (le piccolo, le xylophone, le glockenspiel sonnent une
        # octave au-dessus) : on écrit ici en sons réels, la transposition les remet
        self.transposition = transposition
        self.famille = famille
        self.etendue = (hauteur(etendue[0]), hauteur(etendue[1])) if etendue else None
        self.articulations = articulations
        self.defaut = defaut
        self.caractere = caractere
        self.mix = mix or {}
        self.niveau = niveau            # dB, calibré pour qu'un mf soit à hauteur des autres
        self.niveaux_art = {}           # dB par articulation (banc.py --calibrer)
        self.avance = avance or {}      # s : l'avance d'attaque par articulation

    def niveau_art(self, art):
        return self.niveaux_art.get(art, self.niveau)

    def art(self, jeu, reglages):
        a = jeu.art or reglages.get('art') or self.defaut
        if a not in self.articulations:
            raise ValueError(f'{self.nom} : articulation inconnue {a!r} '
                             f'(connues : {", ".join(self.articulations)})')
        return a

    def rendre(self, jeux, n, ctx):
        raise NotImplementedError


# ---------------------------------------------------------------------------------
# Les instruments échantillonnés

class InstrumentSfz(Instrument):
    """`articulations` : {nom: {'sfz': chemin, 'oneshot': bool, 'relache': s,
    'legato': bool, 'cle': touche fixe, 'gain': dB}} ; `unisson` : un pupitre fabriqué
    à partir d'un soliste (le nombre de prises) ; `eclat` : les cuivres « cuivrent » aux
    fortes nuances (une saturation qui ajoute des harmoniques aux seules notes fortes :
    les échantillons, enregistrés mezzo, en manquent)."""
    sorte = 'échantillons'

    def __init__(self, *a, unisson=1, eclat=0.0, **kw):
        super().__init__(*a, **kw)
        self.unisson = unisson
        self.eclat = eclat
        self._banques = {}

    def banque(self, art):
        b = self._banques.get(art)
        if b is None:
            b = ech.Banque(chemin(self.articulations[art]['sfz']))
            self._banques[art] = b
        return b

    def couches_velocite(self, art):
        return sorted({(r.lovel, r.hivel) for r in self.banque(art).regions})

    def _couches(self, art):
        """Le nombre de couches de vélocité qu'une note du milieu traverse."""
        b = self.banque(art)
        lo, hi = b.etendue()
        k = (lo + hi) // 2
        return len({(r.lovel, r.hivel) for r in b.regions if r.lokey <= k <= r.hikey})

    @staticmethod
    def _fondu_couches(banque, cle, vel, duree, cents, relache, sans_attaque, fondu, alea, expr, a0):
        """Une note tenue sous un crescendo (ou un diminuendo) : la couche douce et la
        couche forte, au même niveau, fondues l'une dans l'autre selon l'expression."""
        xs = []
        for vc in (36, 118):
            x, d = ech.jouer(banque, cle, vel, duree, desaccord_cents=cents, relache=relache,
                             sans_attaque_s=sans_attaque, fondu_entree_s=fondu, alea=alea, vel_couche=vc)
            xs.append((x, d))
        dec = max(d for _, d in xs)
        n = max(len(x) + dec - d for x, d in xs)
        doux = np.zeros((n, 2), dtype=np.float32)
        fort = np.zeros((n, 2), dtype=np.float32)
        for (x, d), cible in zip(xs, (doux, fort)):
            cible[dec - d:dec - d + len(x)] = x
        e = expr[max(0, a0 - dec):max(0, a0 - dec) + n]
        if len(e) < n:
            e = np.concatenate([e, np.full(n - len(e), e[-1] if len(e) else 1.0, np.float32)])
        w = np.clip((e - 0.3) / 0.5, 0.0, 1.0)[:, None].astype(np.float32)
        return doux * (1 - w) + fort * w, dec

    def rendre(self, jeux, n, ctx):
        reg = ctx['reglages']
        sortie = np.zeros((n, 2), dtype=np.float32)
        for b in self._banques.values():
            b.raz()
        k_uni = int(reg.get('unisson', self.unisson))
        legato_piste = reg.get('legato', False)
        expr = ctx.get('courbes', {}).get('expression')
        jeux = sorted(jeux, key=lambda j: (j.t, j.h if not isinstance(j.h, str) else 0))
        for i, j in enumerate(jeux):
            art = self.art(j, reg)
            spec = self.articulations[art]
            banque = self.banque(art)
            cle = spec.get('cle', j.h + self.transposition if not isinstance(j.h, str) else j.h)
            accord = 0.0
            if 'reference' in spec and not isinstance(j.h, str):
                accord = 100.0 * (j.h - hauteur(spec['reference']))
            oneshot = spec.get('oneshot', False)
            relache = spec.get('relache')
            bref = oneshot and not isinstance(j.h, str)       # une note brève à hauteur
            if bref and reg.get('bref') and self.famille in ('cordes', 'cuivres', 'bois'):
                # `bref` sur la piste : la note brève ne joue plus tout son échantillon
                # (sa queue de salle d'enregistrement) mais sa durée écrite, puis une
                # relâche courte : un ostinato plus sec, chaque attaque plus nette
                oneshot = False
                relache = float(reg['bref'])
            sans_attaque = 0.0
            fondu = 0.0
            duree = j.d
            if (spec.get('legato') or legato_piste) and not oneshot:
                # le legato : la note suivante entre sans son attaque, en fondu, et
                # celle-ci s'efface vite (pas de queue de l'ancienne hauteur dessous)
                suiv = next((x for x in jeux[i + 1:i + 6] if x.t > j.t + 0.01), None)
                prec = next((x for x in reversed(jeux[max(0, i - 6):i]) if x.t < j.t - 0.01), None)
                if suiv is not None and suiv.t - (j.t + j.d) < 0.06:
                    duree = max(duree, suiv.t - j.t) + 0.05
                    relache = 0.14
                if prec is not None and j.t - (prec.t + prec.d) < 0.06:
                    sans_attaque = spec.get('entree', 0.11)
                    fondu = 0.07
            # l'expression de la piste choisit aussi le timbre : une note jouée p prend
            # la couche douce, f la forte (le niveau, lui, reste celui de la vélocité :
            # l'expression le règle ensuite pour toute la piste) ; sous un crescendo, une
            # note tenue fond ses deux couches l'une dans l'autre
            v_couche, croise = None, None
            if expr is not None and not isinstance(j.h, str):
                a0 = min(len(expr) - 1, max(0, int(j.t * SR)))
                e0 = float(expr[a0])
                v_couche = int(max(1, min(127, round(j.v * (0.45 + 0.55 * e0)))))
                if not oneshot and self._couches(art) >= 2:
                    b0 = min(len(expr), a0 + int((duree + 0.5) * SR))
                    tranche = expr[a0:b0]
                    if len(tranche) and float(tranche.max() - tranche.min()) > 0.12:
                        croise = a0
            for u in range(k_uni):
                c, ms, place = _UNISSON[u % len(_UNISSON)]
                if k_uni == 1:
                    c, ms, place = 0.0, 0.0, 0.0
                alea = ((j.rang * 7 + u * 3) % 10) / 10 + 0.05
                if bref:
                    vc, vg = _VARIATIONS[j.rang % len(_VARIATIONS)]
                    c += vc
                else:
                    vg = 0.0
                if croise is not None:
                    x, dec = self._fondu_couches(banque, cle, j.v, duree, c + accord, relache,
                                                 sans_attaque, fondu, alea, expr, croise)
                else:
                    x, dec = ech.jouer(banque, cle, j.v, duree, desaccord_cents=c + accord, oneshot=oneshot,
                                       relache=relache, sans_attaque_s=sans_attaque,
                                       fondu_entree_s=fondu, alea=alea, vel_couche=v_couche)
                pos = int(round((j.t - self.avance.get(art, 0.0) + ms / 1000.0) * SR)) - dec
                g = dsp.gain(self.niveau_art(art) + spec.get('gain', 0.0) + vg) / np.sqrt(k_uni)
                eclat = float(reg.get('eclat', self.eclat))
                if eclat and j.v > 72:
                    # la note forte « cuivre » : la saturation monte avec la vélocité, le
                    # niveau reste (saturer compense), le timbre s'éclaire
                    x = dsp.saturer(x * np.float32(1.0 / max(np.abs(x).max(), 1e-6)),
                                    eclat * (j.v - 72) / 55.0, asymetrie=0.12) * np.float32(np.abs(x).max())
                _ajouter(sortie, x, pos, g, 1.0 - place, 1.0 + place)
        return sortie


# ---------------------------------------------------------------------------------
# General MIDI (FluidSynth)

PIECES_GM = {
    'K': 36, 'K2': 35, 'S': 38, 'S2': 40, 'SR': 37, 'CL': 39, 'H': 42, 'P': 44, 'O': 46,
    'C': 49, 'C2': 57, 'R': 51, 'RB': 53, 'SP': 55, 'CH': 52, 'T1': 41, 'T2': 43, 'T3': 45,
    'T4': 47, 'T5': 48, 'T6': 50, 'TB': 54, 'CB': 56, 'SH': 70, 'CA': 69, 'CV': 75, 'TR': 81,
}


class InstrumentGM(Instrument):
    """`articulations` : {nom: (banque, programme)} ; une batterie se joue sur le
    canal 10 (banque 128), ses notes sont des noms de pièces (PIECES_GM)."""
    sorte = 'General MIDI'

    def __init__(self, *a, kit=False, unisson=1, banque_sf='generale', **kw):
        super().__init__(*a, **kw)
        self.kit = kit
        self.unisson = unisson
        self.banque_sf = banque_sf

    def rendre(self, jeux, n, ctx):
        reg = ctx['reglages']
        k_uni = int(reg.get('unisson', self.unisson))
        par_art = {}
        for j in jeux:
            par_art.setdefault(self.art(j, reg), []).append(j)
        sortie = np.zeros((n, 2), dtype=np.float32)
        syn = Synthe.pour(self.banque_sf)
        for art, liste in sorted(par_art.items()):
            bq, prog = self.articulations[art]
            canaux = {}
            evs = []
            for u in range(k_uni):
                canal = 9 if self.kit else u
                canaux[canal] = (bq, prog)
                if k_uni > 1 and not self.kit:
                    c, ms, _ = _UNISSON[u % len(_UNISSON)]
                    evs.append((0, 'sens', canal, 2, 0))
                    evs.append((0, 'pb', canal, 0, int(8192 + c / 200.0 * 8192)))
                else:
                    ms = 0.0
                for j in liste:
                    if self.kit:
                        cle = PIECES_GM.get(j.h, j.h) if isinstance(j.h, str) else int(j.h)
                    else:
                        cle = int(round(j.h))
                    t0 = int(round((j.t - self.avance.get(art, 0.0) + ms / 1000.0) * SR))
                    t1 = t0 + max(64, int(j.d * SR))
                    if 0 <= t0 < n:
                        evs.append((t0, 'on', canal, cle, j.v))
                        evs.append((min(t1, n - 1), 'off', canal, cle, 0))
                if self.kit:
                    break
            y = syn.rendre(evs, n, canaux)
            sortie += y * np.float32(dsp.gain(self.niveau_art(art)) / np.sqrt(k_uni if not self.kit else 1))
        return sortie


# ---------------------------------------------------------------------------------
# Les synthétiseurs

class InstrumentSynthe(Instrument):
    """Une voix soustractive (`patch`, voir synthe.PATCH_DEFAUT) ; `mono` : jeu lié,
    une note chasse l'autre, avec glissando si `glisse`."""
    sorte = 'synthèse'

    def __init__(self, *a, patch=None, **kw):
        super().__init__(*a, **kw)
        self.patch = patch or {}

    def rendre(self, jeux, n, ctx):
        reg = ctx['reglages']
        p = synthe.completer(_fusion(self.patch, reg.get('synthe') or {}))
        if 'glisse' in reg:
            p['glisse'] = reg['glisse']
        if 'mono' in reg:
            p['mono'] = reg['mono']
        courbe = ctx.get('courbes', {}).get('coupure')
        sortie = np.zeros((n, 2), dtype=np.float32)
        jeux = sorted(jeux, key=lambda j: (j.t, j.h))
        cache = {}
        g = dsp.gain(self.niveau_art('tenu'))
        prec = None
        for i, j in enumerate(jeux):
            duree = j.d
            f0 = None
            niveau0 = 0.0
            if p['mono']:
                suiv = jeux[i + 1] if i + 1 < len(jeux) else None
                if suiv is not None and suiv.t < j.t + duree:
                    duree = max(0.01, suiv.t - j.t)
                if prec is not None and prec.t + prec.d >= j.t - 0.005:
                    f0 = synthe.frequence(prec.h)
                    niveau0 = p['amp']['s']
            elif (j.p or {}).get('glisse') and prec is not None:
                f0 = synthe.frequence(prec.h)
            pos = int(round((j.t - self.avance.get('tenu', 0.0)) * SR))
            mult = None
            if courbe is not None:
                a = max(0, pos)
                mult = courbe[a:a + int((duree + p['amp']['r'] * 1.2) * SR) + 64]
                if len(mult) == 0:
                    mult = None
            cle = (j.h, round(duree, 4), j.v, f0, niveau0)
            if mult is None and cle in cache:
                x = cache[cle]
            else:
                x, _ = synthe.voix(j.h, duree, j.v, p, f0=f0, debut_niveau=niveau0,
                                   graine=synthe.graine_note(self.nom, j.h, j.v, round(duree, 4), j.rang % 16),
                                   coupure_mult=mult)
                if mult is None:
                    cache[cle] = x
            if p['mono'] and niveau0 > 0:
                x = dsp.fondu(x, entree=int(0.004 * SR))
            _ajouter(sortie, x, pos, g)
            prec = j
        return sortie


def _fusion(a, b):
    sortie = dict(a)
    for k, v in b.items():
        if isinstance(v, dict) and isinstance(sortie.get(k), dict):
            q = dict(sortie[k])
            q.update(v)
            sortie[k] = q
        else:
            sortie[k] = v
    return sortie


class InstrumentRythmes(Instrument):
    """La boîte à rythmes synthétique : K, S, CL, H, O, T1..T3 (synthe.piece_synthe)."""
    sorte = 'synthèse'

    def rendre(self, jeux, n, ctx):
        sortie = np.zeros((n, 2), dtype=np.float32)
        cache = {}
        g = dsp.gain(self.niveau_art('kit'))
        for j in jeux:
            piece = j.h if isinstance(j.h, str) else 'K'
            cle = (piece, j.v, j.rang % 4)
            x = cache.get(cle)
            if x is None:
                x = dsp.stereo(synthe.piece_synthe(piece, j.v, synthe.graine_note(piece, j.rang % 4)))
                cache[cle] = x
            _ajouter(sortie, x, int(round(j.t * SR)), g)
        return sortie


class InstrumentConception(Instrument):
    """Les sons de conception : 'montee' (dure ce que dure la note, culmine à sa fin),
    'impact' (part de la note)."""
    sorte = 'synthèse'

    def rendre(self, jeux, n, ctx):
        sortie = np.zeros((n, 2), dtype=np.float32)
        for j in jeux:
            art = self.art(j, ctx['reglages'])
            g = dsp.gain(self.niveau_art(art))
            gr = synthe.graine_note(self.nom, art, j.rang)
            if art == 'montee':
                x = synthe.montee(max(0.2, j.d), j.v, gr, hauteur=j.h if not isinstance(j.h, str) else None)
                _ajouter(sortie, x, int(round(j.t * SR)), g)
            else:
                x = synthe.impact(j.v, gr, grave=synthe.frequence(j.h) if not isinstance(j.h, str) and j.h < 50 else 46.0)
                _ajouter(sortie, x, int(round(j.t * SR)), g)
        return sortie


class InstrumentCouches(Instrument):
    """Plusieurs instruments joués ensemble : `couches` = [(nom d'instrument,
    transposition, gain dB, {articulation: articulation de la couche ('=' la même,
    False : la couche se tait ; '*' pour toutes)}, vel ±)]."""
    sorte = 'couches'

    def __init__(self, *a, couches=(), **kw):
        super().__init__(*a, **kw)
        self.couches = couches

    def rendre(self, jeux, n, ctx):
        sortie = np.zeros((n, 2), dtype=np.float32)
        reg = ctx['reglages']
        for nom, transp, g_db, arts, dvel in self.couches:
            inst = INSTRUMENTS[nom]
            js = []
            for j in jeux:
                a = self.art(j, reg)
                a2 = arts.get(a, arts.get('*', '='))
                if a2 is False:
                    continue
                if a2 == '=':
                    a2 = a
                h = j.h + transp if not isinstance(j.h, str) else j.h
                js.append(Jeu(j.t, j.d, h, max(1, min(127, j.v + dvel)), a2, j.p, j.rang))
            if not js:
                continue
            sous = dict(ctx)
            sous['reglages'] = {k: v for k, v in reg.items() if k in ('legato',)}
            sortie += inst.rendre(js, n, sous) * np.float32(dsp.gain(g_db))
        return sortie * np.float32(dsp.gain(self.niveau))


# ---------------------------------------------------------------------------------
# Le catalogue

O = 'orchestre/'
C = 'communautaire/'
ID = C + 'Idiophones/Struck Idiophones/'
MB = C + 'Membranophones/Struck Membranophones/'

# les réglages de mélange par défaut, par famille (la place sur scène se règle par
# instrument) : bus, salle (envoi), profondeur (0 devant, 1 au fond), égaliseur
FAMILLES = {
    'cordes': {'bus': 'cordes', 'salle': 0.28, 'eq': {'boue': -1.5}},
    'cuivres': {'bus': 'cuivres', 'salle': 0.36, 'eq': {'boue': -2.0}},
    'bois': {'bus': 'bois', 'salle': 0.3, 'eq': {}},
    'percussions': {'bus': 'percussions', 'salle': 0.32, 'eq': {}},
    'claviers': {'bus': 'claviers', 'salle': 0.24, 'eq': {}},
    'choeur': {'bus': 'choeur', 'salle': 0.42, 'eq': {'passe_haut': 110, 'boue': -2.0}},
    'guitares': {'bus': 'guitares', 'salle': 0.08, 'piece': 0.18, 'eq': {'passe_haut': 90, 'boue': -2.5}},
    'batterie': {'bus': 'batterie', 'salle': 0.06, 'piece': 0.2, 'eq': {}},
    'synthes': {'bus': 'synthes', 'salle': 0.12, 'eq': {}},
    'conception': {'bus': 'conception', 'salle': 0.25, 'eq': {}},
}


def _sfz(nom, famille, etendue, arts, defaut, caractere, mix=None, **kw):
    return InstrumentSfz(nom, famille, etendue, arts, defaut, caractere, mix, **kw)


def _cat():
    I = {}

    def met(inst):
        I[inst.nom] = inst

    # --- les cordes (l'orchestre de chambre, pupitres) ---
    met(_sfz('violons', 'cordes', ('G3', 'C7'), {
        'tenu': {'sfz': O + 'ViolinEnsSusVib.sfz'},
        'legato': {'sfz': O + 'ViolinEnsSusVib.sfz', 'legato': True},
        'staccato': {'sfz': O + 'ViolinEnsSpic.sfz', 'oneshot': True},
        'pizzicato': {'sfz': O + 'ViolinEnsPizz.sfz', 'oneshot': True},
        'tremolo': {'sfz': O + 'ViolinEnsTrem.sfz'},
    }, 'tenu', 'pupitre de violons : vibrato chaud, spiccato mordant', {'pan': -0.5, 'profondeur': 0.3},
        avance={'tenu': 0.03, 'tremolo': 0.02}))
    met(_sfz('altos', 'cordes', ('C3', 'E6'), {
        'tenu': {'sfz': O + 'ViolaEnsSusVib.sfz'},
        'legato': {'sfz': O + 'ViolaEnsSusVib.sfz', 'legato': True},
        'staccato': {'sfz': O + 'ViolaEnsSpic.sfz', 'oneshot': True},
        'pizzicato': {'sfz': O + 'ViolaEnsPizz.sfz', 'oneshot': True},
        'tremolo': {'sfz': O + 'ViolaEnsTrem.sfz'},
    }, 'tenu', 'pupitre d\'altos : le milieu sombre des cordes', {'pan': 0.18, 'profondeur': 0.35},
        avance={'tenu': 0.03, 'tremolo': 0.02}))
    met(_sfz('violoncelles', 'cordes', ('C2', 'A5'), {
        'tenu': {'sfz': O + 'CelloEnsSusVib.sfz'},
        'legato': {'sfz': O + 'CelloEnsSusVib.sfz', 'legato': True},
        'staccato': {'sfz': O + 'CelloEnsSpic.sfz', 'oneshot': True},
        'pizzicato': {'sfz': O + 'CelloEnsPizz.sfz', 'oneshot': True},
        'tremolo': {'sfz': O + 'CelloEnsTrem.sfz'},
    }, 'tenu', 'pupitre de violoncelles : les ostinatos, le chant grave', {'pan': 0.35, 'profondeur': 0.3},
        avance={'tenu': 0.03, 'tremolo': 0.02}))
    met(_sfz('contrebasses', 'cordes', ('E1', 'G3'), {
        'tenu': {'sfz': O + 'ContrabassSusVB.sfz'},
        'sans_vibrato': {'sfz': O + 'ContrabassSusNV.sfz'},
        'legato': {'sfz': O + 'ContrabassSusVB.sfz', 'legato': True},
        'staccato': {'sfz': O + 'ContrabassSpic.sfz', 'oneshot': True},
        'pizzicato': {'sfz': O + 'ContrabassPizz.sfz', 'oneshot': True},
        'tremolo': {'sfz': O + 'ContrabassTrem.sfz'},
    }, 'tenu', 'pupitre de contrebasses (un soliste en trois prises) : le sol de l\'orchestre',
        {'pan': 0.55, 'profondeur': 0.4}, unisson=3, avance={'tenu': 0.03}))
    met(_sfz('harpe', 'cordes', ('C1', 'G7'), {
        'pince': {'sfz': O + 'Harp.sfz', 'oneshot': True},
    }, 'pince', 'harpe de concert : arpèges, glissandos écrits', {'pan': -0.55, 'profondeur': 0.45}))

    # --- les cuivres ---
    met(_sfz('cors', 'cuivres', ('A1', 'F5'), {
        'tenu': {'sfz': O + 'FHornSus.sfz'},
        'legato': {'sfz': O + 'FHornSus.sfz', 'legato': True},
        'staccato': {'sfz': O + 'FHornStac.sfz', 'oneshot': True},
        'sourdine': {'sfz': O + 'FHornMute.sfz'},
    }, 'tenu', 'quatre cors à l\'unisson : le thème héroïque, rond et lointain',
        {'pan': -0.3, 'profondeur': 0.65}, unisson=4, avance={'tenu': 0.02}, eclat=2.2))
    met(_sfz('trompettes', 'cuivres', ('F#3', 'D6'), {
        'tenu': {'sfz': O + 'TrumpetSus.sfz'},
        'vibrato': {'sfz': O + 'TrumpetSusVib.sfz'},
        'legato': {'sfz': O + 'TrumpetSus.sfz', 'legato': True},
        'staccato': {'sfz': O + 'TrumpetStac.sfz', 'oneshot': True},
        'sourdine': {'sfz': O + 'TrumpetStraightMuteSus.sfz'},
    }, 'tenu', 'deux trompettes : l\'éclat, les fanfares', {'pan': 0.25, 'profondeur': 0.6}, unisson=2,
        avance={'tenu': 0.015}, eclat=1.4))
    met(_sfz('trombones', 'cuivres', ('E2', 'F5'), {
        'tenu': {'sfz': O + 'TromboneSus.sfz'},
        'vibrato': {'sfz': O + 'TromboneVib.sfz'},
        'legato': {'sfz': O + 'TromboneSus.sfz', 'legato': True},
        'staccato': {'sfz': O + 'TromboneStac.sfz', 'oneshot': True},
    }, 'tenu', 'trois trombones : le cuivre grave qui gronde', {'pan': 0.4, 'profondeur': 0.6}, unisson=3,
        avance={'tenu': 0.02}, eclat=2.0))
    met(_sfz('tuba', 'cuivres', ('D1', 'F4'), {
        'tenu': {'sfz': O + 'TubaSus.sfz'},
        'legato': {'sfz': O + 'TubaSus.sfz', 'legato': True},
        'staccato': {'sfz': O + 'TubaStac.sfz', 'oneshot': True},
    }, 'tenu', 'tuba : le fond des cuivres', {'pan': 0.5, 'profondeur': 0.6}, avance={'tenu': 0.02},
        eclat=1.5))

    # --- les bois ---
    met(_sfz('flutes', 'bois', ('C4', 'C7'), {
        'tenu': {'sfz': O + 'FluteSusVib.sfz'},
        'sans_vibrato': {'sfz': O + 'FluteSusNV.sfz'},
        'legato': {'sfz': O + 'FluteSusVib.sfz', 'legato': True},
        'staccato': {'sfz': O + 'FluteStac.sfz', 'oneshot': True},
    }, 'tenu', 'deux flûtes : l\'air, la lumière', {'pan': -0.12, 'profondeur': 0.5}, unisson=2))
    met(_sfz('piccolo', 'bois', ('D5', 'C8'), {
        'tenu': {'sfz': O + 'PiccoloSus.sfz'},
        'staccato': {'sfz': O + 'PiccoloStac.sfz', 'oneshot': True},
    }, 'tenu', 'piccolo : la pointe, à petites doses', {'pan': -0.18, 'profondeur': 0.55},
        transposition=-12))
    met(_sfz('hautbois', 'bois', ('A#3', 'G6'), {
        'tenu': {'sfz': O + 'OboeSusVib.sfz'},
        'sans_vibrato': {'sfz': O + 'OboeSusNV.sfz'},
        'legato': {'sfz': O + 'OboeSusVib.sfz', 'legato': True},
        'staccato': {'sfz': O + 'OboeStac.sfz', 'oneshot': True},
    }, 'tenu', 'hautbois : la plainte, le chant pastoral', {'pan': 0.1, 'profondeur': 0.5}))
    met(_sfz('clarinettes', 'bois', ('D3', 'C7'), {
        'tenu': {'sfz': O + 'ClarinetSus.sfz'},
        'legato': {'sfz': O + 'ClarinetSus.sfz', 'legato': True},
        'staccato': {'sfz': O + 'ClarinetStac.sfz', 'oneshot': True},
    }, 'tenu', 'clarinettes : le bois rond, souple', {'pan': -0.08, 'profondeur': 0.5}, unisson=2))
    met(_sfz('bassons', 'bois', ('A#1', 'E5'), {
        'tenu': {'sfz': O + 'BassoonSus.sfz'},
        'vibrato': {'sfz': O + 'BassoonVib.sfz'},
        'legato': {'sfz': O + 'BassoonSus.sfz', 'legato': True},
        'staccato': {'sfz': O + 'BassoonStac.sfz', 'oneshot': True},
    }, 'tenu', 'bassons : le grave boisé, le staccato qui sautille', {'pan': 0.15, 'profondeur': 0.5},
        unisson=2))

    # --- les percussions d'orchestre ---
    met(_sfz('timbales', 'percussions', ('C2', 'C4'), {
        'frappe': {'sfz': O + 'Timpani.sfz', 'oneshot': True},
        'roulement': {'sfz': O + 'TimpaniRolls.sfz', 'relache': 1.2},
    }, 'frappe', 'timbales : frappes à hauteur, roulements qui enflent', {'pan': -0.15, 'profondeur': 0.75}))
    met(_sfz('grosse_caisse', 'percussions', None, {
        'frappe': {'sfz': O + 'GM-StylePerc.sfz', 'oneshot': True, 'cle': 36},
        'roulement': {'sfz': MB + 'Bass Drum 2.sfz', 'cle': 63, 'relache': 1.5},
    }, 'frappe', 'grosse caisse de concert : le coup de canon, sept nuances', {'pan': 0.1, 'profondeur': 0.8}))
    met(_sfz('caisse_claire', 'percussions', None, {
        'frappe': {'sfz': MB + 'Snare Drum, Modern 1.sfz', 'oneshot': True, 'cle': 61},
        'timbre_off': {'sfz': MB + 'Snare Drum, Modern 1.sfz', 'oneshot': True, 'cle': 60},
        'roulement': {'sfz': MB + 'Snare Drum, Modern 1.sfz', 'cle': 63, 'relache': 0.5},
        'cercle': {'sfz': MB + 'Snare Drum, Modern 1.sfz', 'oneshot': True, 'cle': 64},
    }, 'frappe', 'caisse claire d\'orchestre (timbre) : les marches, les roulements',
        {'pan': 0.05, 'profondeur': 0.7}))
    met(_sfz('cymbales', 'percussions', None, {
        'frappe': {'sfz': ID + 'Clash Cymbals 1.sfz', 'oneshot': True, 'cle': 60},
        'etouffee': {'sfz': ID + 'Clash Cymbals 1.sfz', 'oneshot': True, 'cle': 61},
    }, 'frappe', 'cymbales frappées : le sommet d\'un crescendo', {'pan': 0.2, 'profondeur': 0.75}))
    met(_sfz('cymbale_suspendue', 'percussions', None, {
        'frappe': {'sfz': ID + 'Suspended Cymbal 1.sfz', 'oneshot': True, 'cle': 68},
        'roulement': {'sfz': ID + 'Suspended Cymbal 1.sfz', 'cle': 71, 'relache': 2.5},
        'monte_2s': {'sfz': ID + 'Suspended Cymbal 1.sfz', 'oneshot': True, 'cle': 65},
        'monte_4s': {'sfz': ID + 'Suspended Cymbal 1.sfz', 'oneshot': True, 'cle': 66},
        'monte_7s': {'sfz': ID + 'Suspended Cymbal 1.sfz', 'oneshot': True, 'cle': 67},
        'archet': {'sfz': ID + 'Suspended Cymbal 1.sfz', 'oneshot': True, 'cle': 61},
    }, 'frappe', 'cymbale suspendue : les montées roulées, l\'archet qui grince',
        {'pan': -0.25, 'profondeur': 0.75}))
    met(_sfz('tam_tam', 'percussions', None, {
        'frappe': {'sfz': ID + 'Gong 1.sfz', 'oneshot': True, 'cle': 60},
        'gratte': {'sfz': ID + 'Gong 1.sfz', 'oneshot': True, 'cle': 62},
    }, 'frappe', 'tam-tam : la fin du monde en une frappe', {'pan': 0.3, 'profondeur': 0.85}))
    met(_sfz('glockenspiel', 'percussions', ('G5', 'C8'), {
        'frappe': {'sfz': ID + 'Glockenspiel.sfz', 'oneshot': True},
    }, 'frappe', 'glockenspiel : la lumière, la boîte à musique', {'pan': -0.2, 'profondeur': 0.6},
        transposition=-12))
    met(_sfz('cloches', 'percussions', ('C4', 'F5'), {
        'frappe': {'sfz': ID + 'Tubular Bells 1.sfz', 'oneshot': True},
    }, 'frappe', 'cloches tubulaires : le glas, la cérémonie', {'pan': 0.3, 'profondeur': 0.8}))
    met(_sfz('vibraphone', 'percussions', ('F3', 'F6'), {
        'frappe': {'sfz': ID + 'Vibraphone - Soft Mallets.sfz', 'oneshot': True},
        'dure': {'sfz': ID + 'Vibraphone - Hard Mallets.sfz', 'oneshot': True},
    }, 'frappe', 'vibraphone : la nuit, les néons', {'pan': -0.15, 'profondeur': 0.5}))
    met(_sfz('marimba', 'percussions', ('C2', 'C7'), {
        'frappe': {'sfz': O + 'Marimba.sfz', 'oneshot': True},
    }, 'frappe', 'marimba : le bois rond qui rebondit', {'pan': -0.1, 'profondeur': 0.55}))
    met(_sfz('xylophone', 'percussions', ('F4', 'C8'), {
        'frappe': {'sfz': O + 'Xylophone.sfz', 'oneshot': True},
    }, 'frappe', 'xylophone : sec, joueur, pointu', {'pan': 0.12, 'profondeur': 0.6},
        transposition=-12))
    met(_sfz('carillon', 'percussions', None, {
        'monte': {'sfz': ID + 'Mark Trees.sfz', 'oneshot': True, 'cle': 60},
        'descend': {'sfz': ID + 'Mark Trees.sfz', 'oneshot': True, 'cle': 61},
        'vite': {'sfz': ID + 'Mark Trees.sfz', 'oneshot': True, 'cle': 62},
    }, 'monte', 'carillon à tiges : la poussière d\'étoiles d\'une transition', {'pan': 0.4, 'profondeur': 0.6}))
    met(_sfz('enclume', 'percussions', None, {
        'frappe': {'sfz': ID + 'Anvil.sfz', 'oneshot': True, 'cle': 60},
    }, 'frappe', 'enclume : le métal de l\'usine', {'pan': 0.2, 'profondeur': 0.5}))
    met(_sfz('toms', 'percussions', ('C2', 'C4'), {
        'frappe': {'sfz': MB + 'Tom 1.sfz', 'oneshot': True, 'cle': 62, 'reference': 'D3'},
    }, 'frappe', 'tom de concert (accordé par la hauteur écrite, autour de D3)',
        {'pan': -0.1, 'profondeur': 0.7}))
    met(_sfz('claps', 'percussions', None, {
        'frappe': {'sfz': ID + 'Claps.sfz', 'oneshot': True, 'cle': 60},
        'seul': {'sfz': ID + 'Claps.sfz', 'oneshot': True, 'cle': 61},
    }, 'frappe', 'claquements de mains d\'un groupe', {'pan': 0.0, 'profondeur': 0.4}))

    # --- les claviers ---
    met(_sfz('piano', 'claviers', ('A0', 'C8'), {
        'tenu': {'sfz': C + 'Chordophones/Zithers/Grand Piano, S*.sfz', 'relache': 0.45},
        'pedale': {'sfz': C + 'Chordophones/Zithers/Grand Piano, S*.sfz', 'relache': 2.2},
    }, 'tenu', 'piano de concert (trois nuances) : la confidence, le martèlement',
        {'pan': -0.05, 'profondeur': 0.35, 'largeur': 0.8}))
    met(_sfz('orgue', 'claviers', ('C2', 'C7'), {
        'tenu': {'sfz': C + 'Aerophones/Edge-blown Aerophones/Pipe Organ - Loud.sfz', 'relache': 1.0},
        'doux': {'sfz': C + 'Aerophones/Edge-blown Aerophones/Pipe Organ - Quiet.sfz', 'relache': 1.0},
    }, 'tenu', 'orgue à tuyaux : la messe, le vertige', {'pan': 0.0, 'profondeur': 0.85}))
    met(InstrumentGM('celesta', 'claviers', ('C4', 'C8'), {'frappe': (0, 8)}, 'frappe',
                     'célesta : le conte, le mystère', {'pan': -0.3, 'profondeur': 0.5}))

    # --- le chœur et les voix (General MIDI) ---
    met(InstrumentGM('choeur', 'choeur', ('C3', 'C6'), {'aah': (0, 52), 'ouh': (0, 53)}, 'aah',
                     'chœur mixte « aah » / « ouh » : l\'épopée, la messe', {'pan': 0.0, 'profondeur': 0.7,
                                                                            'largeur': 1.0},
                     unisson=2, avance={'aah': 0.09, 'ouh': 0.09}))
    met(InstrumentGM('voix_synthe', 'choeur', ('C3', 'C6'), {'tenu': (0, 54)}, 'tenu',
                     'voix de synthèse : un chœur de machine', {'pan': 0.0, 'profondeur': 0.5},
                     avance={'tenu': 0.05}))
    # le sifflet (un homme qui siffle, enregistré : un son presque pur, un vibrato de voix) : une
    # phrase rare, jamais un ostinato (au-dessus de do6 il devient perçant)
    met(InstrumentGM('sifflet', 'bois', ('C5', 'C7'), {'tenu': (0, 78)}, 'tenu',
                     'sifflet humain : une phrase rare, la route, le dimanche', {'pan': 0.0, 'profondeur': 0.4},
                     avance={'tenu': 0.03}))

    met(InstrumentGM('nappe_gm', 'synthes', ('C2', 'C7'), {'chaude': (0, 89), 'halo': (0, 94),
                                                         'atmosphere': (0, 99), 'verre': (0, 92),
                                                         'cordes': (0, 50)}, 'chaude',
                     'nappes de la banque générale (chaude, halo, atmosphère, verre frotté, cordes de '
                     'synthèse) : un fond prêt, moins personnel que nappe_synthe',
                     {'pan': 0.0, 'profondeur': 0.5, 'largeur': 1.0},
                     avance={'chaude': 0.12, 'halo': 0.12, 'atmosphere': 0.08, 'verre': 0.12, 'cordes': 0.1}))

    # --- les guitares et la basse (General MIDI) ---
    met(InstrumentGM('guitare_saturee', 'guitares', ('E2', 'E6'), {'tenu': (0, 30), 'crunch': (0, 29),
                                                                    'etouffee': (0, 28)}, 'tenu',
                     'guitare saturée : les quintes à vide, le mur', {'pan': -0.4, 'profondeur': 0.2},
                     unisson=1))
    met(InstrumentGM('guitare_claire', 'guitares', ('E2', 'E6'), {'tenu': (0, 27), 'etouffee': (0, 28)}, 'tenu',
                     'guitare électrique claire : les arpèges de nuit', {'pan': 0.35, 'profondeur': 0.3}))
    met(InstrumentGM('basse_electrique', 'guitares', ('E1', 'G4'), {'doigts': (0, 33), 'mediator': (0, 34),
                                                                     'slap': (0, 36)}, 'doigts',
                     'basse électrique : le groove', {'pan': 0.0, 'profondeur': 0.1}))

    # --- les batteries (General MIDI, canal 10) ---
    for nom, prog, car in (('batterie', 0, 'batterie standard : la pop, le rock léger'),
                           ('batterie_salle', 8, 'batterie en pièce : plus d\'air'),
                           ('batterie_puissante', 16, 'batterie puissante : le stade'),
                           ('batterie_jazz', 32, 'batterie jazz : les balais du soir'),
                           ('batterie_electro', 24, 'batterie électronique des années 80'),
                           ('boite_analogique', 25, 'la boîte à rythmes analogique des années 80')):
        met(InstrumentGM(nom, 'batterie', None, {'kit': (128, prog)}, 'kit', car,
                         {'pan': 0.0, 'profondeur': 0.2}, kit=True))

    # --- les contrebasses de film : le soliste en pupitre et le pupitre GM sous lui ---
    met(InstrumentGM('pupitre_basses', 'cordes', ('E1', 'G3'), {'tenu': (50, 49), 'staccato': (50, 48),
                                                                 'pizzicato': (50, 45), 'tremolo': (50, 44)},
                     'tenu', 'pupitre de contrebasses (banque générale)', {'pan': 0.55, 'profondeur': 0.45}))
    met(InstrumentGM('taiko_gm', 'percussions', ('C2', 'C4'), {'frappe': (0, 116)}, 'frappe',
                     'taiko (banque générale)', {'pan': 0.0, 'profondeur': 0.7}))

    # --- les synthétiseurs ---
    met(InstrumentSynthe('basse_synthe', 'synthes', ('E1', 'C4'), {'tenu': None}, 'tenu',
                         'basse analogique (scie + carré + sous-basse, filtre qui claque)',
                         {'pan': 0.0, 'profondeur': 0.0, 'salle': 0.0},
                         patch={'osc': [{'forme': 'scie', 'niveau': 0.7}, {'forme': 'carre', 'niveau': 0.45,
                                                                          'desaccord': -6}],
                                'sub': 0.3,
                                'filtre': {'coupure': 300.0, 'resonance': 1.4, 'env': 2.6, 'suivi': 0.4,
                                           'a': 0.002, 'd': 0.18, 's': 0.12, 'r': 0.08, 'drive': 1.6},
                                'amp': {'a': 0.002, 'd': 0.4, 's': 0.75, 'r': 0.06},
                                'velocite': 0.4, 'drive': 0.6}))
    met(InstrumentSynthe('basse_reese', 'synthes', ('E1', 'C4'), {'tenu': None}, 'tenu',
                         'basse « reese » : deux scies qui battent, le grave qui menace',
                         {'pan': 0.0, 'profondeur': 0.0, 'salle': 0.0},
                         patch={'osc': [{'forme': 'reese', 'voix': 2, 'ecart': 16, 'niveau': 0.8}],
                                'sub': 0.5,
                                'filtre': {'coupure': 700.0, 'resonance': 0.8, 'env': 0.8, 'suivi': 0.2,
                                           'a': 0.05, 'd': 0.6, 's': 0.5, 'r': 0.2, 'drive': 2.0},
                                'amp': {'a': 0.01, 'd': 0.5, 's': 0.9, 'r': 0.12}, 'largeur': 0.35,
                                'drive': 1.0, 'velocite': 0.3}))
    met(InstrumentSynthe('arpege_synthe', 'synthes', ('C2', 'C7'), {'tenu': None}, 'tenu',
                         'arpège pincé (scie + impulsion, filtre qui se ferme vite)',
                         {'pan': 0.15, 'profondeur': 0.2, 'salle': 0.15, 'echo': 0.22},
                         patch={'osc': [{'forme': 'scie', 'niveau': 0.6}, {'forme': 'carre', 'largeur': 0.3,
                                                                          'niveau': 0.45, 'desaccord': 5}],
                                'filtre': {'coupure': 700.0, 'resonance': 1.2, 'env': 3.0, 'suivi': 0.5,
                                           'a': 0.001, 'd': 0.16, 's': 0.0, 'r': 0.1, 'drive': 1.3},
                                'amp': {'a': 0.001, 'd': 0.3, 's': 0.0, 'r': 0.12}, 'velocite': 0.6}))
    met(InstrumentSynthe('nappe_synthe', 'synthes', ('C2', 'C7'), {'tenu': None}, 'tenu',
                         'nappe en grande scie (sept voix désaccordées), lente et large',
                         {'pan': 0.0, 'profondeur': 0.4, 'salle': 0.3, 'largeur': 1.0},
                         patch={'osc': [{'forme': 'supersaw', 'voix': 7, 'ecart': 22, 'niveau': 0.8}],
                                'filtre': {'coupure': 1500.0, 'resonance': 0.3, 'env': 0.8, 'suivi': 0.2,
                                           'a': 0.8, 'd': 1.5, 's': 0.6, 'r': 1.0, 'drive': 1.0},
                                'amp': {'a': 0.6, 'd': 1.0, 's': 0.85, 'r': 1.2}, 'largeur': 0.8,
                                'velocite': 0.3}))
    met(InstrumentSynthe('lead_synthe', 'synthes', ('C3', 'C7'), {'tenu': None}, 'tenu',
                         'lead analogique (deux scies, glissando, vibrato tardif)',
                         {'pan': 0.0, 'profondeur': 0.2, 'salle': 0.18, 'echo': 0.18},
                         patch={'osc': [{'forme': 'scie', 'niveau': 0.6, 'desaccord': -4.5},
                                        {'forme': 'scie', 'niveau': 0.5, 'desaccord': 4.5}],
                                'filtre': {'coupure': 1300.0, 'resonance': 0.9, 'env': 1.8, 'suivi': 0.5,
                                           'a': 0.01, 'd': 0.4, 's': 0.5, 'r': 0.2, 'drive': 1.4},
                                'amp': {'a': 0.008, 'd': 0.3, 's': 0.85, 'r': 0.2},
                                'glisse': 0.06, 'mono': True, 'vibrato': {'prof': 14, 'vit': 5.3, 'delai': 0.35},
                                'velocite': 0.3}))
    met(InstrumentSynthe('supersaw', 'synthes', ('C2', 'C7'), {'tenu': None}, 'tenu',
                         'la grande scie : accords plaqués de stade, lead immense',
                         {'pan': 0.0, 'profondeur': 0.25, 'salle': 0.2, 'largeur': 1.0},
                         patch={'osc': [{'forme': 'supersaw', 'voix': 7, 'ecart': 28, 'niveau': 0.9}],
                                'filtre': {'coupure': 2600.0, 'resonance': 0.2, 'env': 1.0, 'suivi': 0.3,
                                           'a': 0.005, 'd': 0.5, 's': 0.6, 'r': 0.3, 'drive': 1.1},
                                'amp': {'a': 0.006, 'd': 0.4, 's': 0.8, 'r': 0.3}, 'largeur': 0.9,
                                'velocite': 0.4}))
    met(InstrumentSynthe('sub_synthe', 'synthes', ('E1', 'C3'), {'tenu': None}, 'tenu',
                         'sous-basse (sinus et un peu de deuxième harmonique, pour qu\'un téléphone l\'entende)',
                         {'pan': 0.0, 'profondeur': 0.0, 'salle': 0.0},
                         patch={'osc': [{'forme': 'sinus', 'niveau': 0.9}, {'forme': 'sinus', 'octave': 1,
                                                                           'niveau': 0.25}],
                                'filtre': None, 'amp': {'a': 0.004, 'd': 0.2, 's': 0.9, 'r': 0.1},
                                'velocite': 0.3, 'drive': 0.4}))
    met(InstrumentSynthe('cuivre_synthe', 'synthes', ('C1', 'C5'), {'tenu': None}, 'tenu',
                         'la couche de synthé du « braam » : trois scies saturées, le filtre s\'ouvre',
                         {'pan': 0.0, 'profondeur': 0.4, 'salle': 0.3},
                         patch={'osc': [{'forme': 'reese', 'voix': 3, 'ecart': 12, 'niveau': 0.8},
                                        {'forme': 'scie', 'octave': -1, 'niveau': 0.5}],
                                'filtre': {'coupure': 180.0, 'resonance': 0.7, 'env': 3.2, 'suivi': 0.2,
                                           'a': 0.12, 'd': 1.2, 's': 0.45, 'r': 0.5, 'drive': 2.5},
                                'amp': {'a': 0.03, 'd': 1.5, 's': 0.75, 'r': 0.6}, 'drive': 1.2,
                                'velocite': 0.4}))
    met(InstrumentRythmes('boite_a_rythmes', 'batterie', None, {'kit': None}, 'kit',
                          'boîte à rythmes synthétique : K, S, CL, H, O, T1..T3 (la caisse claire '
                          '« gated » se fait par la porte de la piste)', {'pan': 0.0, 'profondeur': 0.1}))
    met(InstrumentConception('effets', 'conception', None, {'montee': None, 'impact': None}, 'montee',
                             'sons de conception : la montée (dure la note), l\'impact',
                             {'pan': 0.0, 'profondeur': 0.4, 'salle': 0.3}))

    # --- les couches ---
    met(InstrumentCouches('braam', 'cuivres', ('C1', 'C4'), {'tenu': None}, 'tenu',
                          'le « braam » : trombones, tuba et cors fortissimo, une octave de synthé saturé '
                          'dessous ; écrire la fondamentale grave (C2..G2), il double à l\'octave',
                          {'pan': 0.1, 'profondeur': 0.5, 'salle': 0.38},
                          couches=[('trombones', 0, 0.0, {'*': 'tenu'}, 15),
                                   ('trombones', 12, -4.0, {'*': 'tenu'}, 12),
                                   ('tuba', -12, -1.0, {'*': 'tenu'}, 15),
                                   ('cors', 12, -3.0, {'*': 'tenu'}, 15),
                                   ('cuivre_synthe', 0, -4.0, {'*': 'tenu'}, 0)]))
    met(InstrumentCouches('taiko', 'percussions', ('C2', 'C4'), {'frappe': None}, 'frappe',
                          'taiko d\'ensemble : la grosse caisse de concert, le taiko et un coup grave '
                          'synthétique (la hauteur écrite accorde le coup)',
                          {'pan': 0.0, 'profondeur': 0.65, 'salle': 0.3},
                          couches=[('taiko_gm', 0, 0.0, {'*': 'frappe'}, 0),
                                   ('grosse_caisse', 0, -5.0, {'*': 'frappe'}, -10),
                                   ('toms', -7, -9.0, {'*': 'frappe'}, 0)]))
    met(InstrumentCouches('basses_film', 'cordes', ('E1', 'G3'), {'tenu': None, 'staccato': None,
                                                                  'pizzicato': None, 'tremolo': None},
                          'tenu', 'les contrebasses de film : le soliste en pupitre et le pupitre de la '
                          'banque générale sous lui', {'pan': 0.5, 'profondeur': 0.4},
                          couches=[('contrebasses', 0, 0.0, {'*': '='}, 0),
                                   ('pupitre_basses', 0, -3.0, {'*': '='}, 0)]))
    return I


INSTRUMENTS = _cat()


def charger_niveaux():
    """Les niveaux calibrés (banc.py --calibrer) : chaque articulation de chaque
    instrument à la même sonie à vélocité égale, pour que le mélange parte d'un plateau
    égal. Clés « instrument:articulation »."""
    try:
        with open(_NIVEAUX, encoding='utf-8') as f:
            niv = json.load(f)
    except (OSError, ValueError):
        return
    for cle, v in niv.items():
        nom, _, art = cle.partition(':')
        if nom in INSTRUMENTS:
            if art:
                INSTRUMENTS[nom].niveaux_art[art] = float(v)
            else:
                INSTRUMENTS[nom].niveau = float(v)


charger_niveaux()


def instrument(nom):
    try:
        return INSTRUMENTS[nom]
    except KeyError:
        raise ValueError(f'instrument inconnu : {nom!r} (connus : {", ".join(sorted(INSTRUMENTS))})')
