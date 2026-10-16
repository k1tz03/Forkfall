"""L'échantillonneur : joue les instruments enregistrés décrits par des fichiers SFZ
(l'orchestre de chambre, la bibliothèque communautaire).

Ce qu'il sait faire : plusieurs échantillons par note (couches de vélocité, tours de
rôle « round robin »), la transposition depuis l'échantillon le plus proche quand une
note manque, l'enveloppe et la queue de relâche, les notes plus longues que leur
échantillon (une boucle en fondu enchaîné dans la partie tenue), le legato
(la note suivante entre sans son attaque, en fondu sur la précédente), les pupitres
fabriqués à partir d'un soliste (plusieurs prises désaccordées de quelques cents et
décalées de quelques millisecondes), l'alignement des attaques (chaque échantillon
est posé pour que son attaque tombe sur le temps).
"""
import os
import re
from collections import OrderedDict

import numpy as np
import soundfile as sf

from . import dsp
from .dsp import SR

# ---------------------------------------------------------------------------------
# La lecture des SFZ

_RE_JETON = re.compile(r'<(\w+)>|([A-Za-z0-9_$]+)=')
_NOMS = {'c': 0, 'd': 2, 'e': 4, 'f': 5, 'g': 7, 'a': 9, 'b': 11}


def _cle_sfz(v):
    """Une touche SFZ : un nombre, ou un nom (« c4 » = 60, « c#4 », « db4 »)."""
    v = v.strip()
    try:
        return int(v)
    except ValueError:
        m = re.match(r'^([a-gA-G])([#b]?)(-?\d+)$', v)
        if not m:
            raise
        return _NOMS[m.group(1).lower()] + {'': 0, '#': 1, 'b': -1}[m.group(2)] + 12 * (int(m.group(3)) + 1)


class Region:
    __slots__ = ('echantillon', 'lokey', 'hikey', 'centre', 'lovel', 'hivel', 'volume', 'tune',
                 'offset', 'seq_length', 'seq_position', 'lorand', 'hirand', 'trigger', 'attaque',
                 'relache', 'veltrack', 'locc64', 'hicc64')

    def __repr__(self):
        return (f'Region({os.path.basename(self.echantillon)}, {self.lokey}-{self.hikey}@{self.centre},'
                f' v{self.lovel}-{self.hivel})')


def lire_sfz(chemin):
    """Les régions d'un fichier SFZ, chaque en-tête (global, master, group) héritant
    au suivant ; les chemins d'échantillons rendus absolus."""
    with open(chemin, encoding='utf-8', errors='replace') as f:
        texte = f.read()
    texte = re.sub(r'//[^\n]*', '', texte)
    racine = os.path.dirname(os.path.abspath(chemin))
    niveaux = {'global': {}, 'master': {}, 'group': {}}
    controle = {}
    courant = None
    regions = []
    entete = None
    jetons = list(_RE_JETON.finditer(texte))

    def fermer():
        if entete == 'region' and courant is not None:
            o = {}
            o.update(niveaux['global'])
            o.update(niveaux['master'])
            o.update(niveaux['group'])
            o.update(courant)
            regions.append(o)

    for i, m in enumerate(jetons):
        if m.group(1):
            fermer()
            entete = m.group(1).lower()
            if entete == 'global':
                niveaux['global'] = {}
                niveaux['master'] = {}
                niveaux['group'] = {}
                courant = niveaux['global']
            elif entete == 'master':
                niveaux['master'] = {}
                niveaux['group'] = {}
                courant = niveaux['master']
            elif entete == 'group':
                niveaux['group'] = {}
                courant = niveaux['group']
            elif entete == 'control':
                courant = controle
            elif entete == 'region':
                courant = {}
            else:
                courant = {}
            continue
        cle = m.group(2)
        fin = jetons[i + 1].start() if i + 1 < len(jetons) else len(texte)
        valeur = texte[m.end():fin].strip()
        if cle not in ('sample', 'default_path', 'group_label', 'sw_label', 'region_label'):
            valeur = valeur.split()[0] if valeur else ''
        if courant is not None:
            courant[cle] = valeur
    fermer()

    sortie = []
    defaut = controle.get('default_path', '').replace('\\', '/')
    for o in regions:
        if 'sample' not in o:
            continue
        r = Region()
        r.echantillon = os.path.normpath(os.path.join(racine, defaut, o['sample'].replace('\\', '/')))
        if 'key' in o:
            k = _cle_sfz(o['key'])
            r.lokey = r.hikey = r.centre = k
        else:
            r.lokey = _cle_sfz(o.get('lokey', '0'))
            r.hikey = _cle_sfz(o.get('hikey', '127'))
            r.centre = _cle_sfz(o.get('pitch_keycenter', str(r.lokey)))
        r.lovel = int(o.get('lovel', 0))
        r.hivel = int(o.get('hivel', 127))
        r.volume = float(o.get('volume', 0))
        r.tune = float(o.get('tune', 0)) + 100.0 * float(o.get('transpose', 0))
        r.offset = int(float(o.get('offset', 0)))
        r.seq_length = int(o.get('seq_length', 1))
        r.seq_position = int(o.get('seq_position', 1))
        r.lorand = float(o.get('lorand', 0))
        r.hirand = float(o.get('hirand', 1))
        r.trigger = o.get('trigger', 'attack')
        r.attaque = float(o.get('ampeg_attack', 0.001))
        r.relache = float(o.get('ampeg_release', 0.3))
        r.veltrack = float(o.get('amp_veltrack', 100))
        r.locc64 = int(o.get('locc64', 0))
        r.hicc64 = int(o.get('hicc64', 127))
        sortie.append(r)
    return sortie


# ---------------------------------------------------------------------------------
# Les échantillons en mémoire (deux caches bornés : les fichiers lus, les transpositions)

class _Cache:
    def __init__(self, octets_max):
        self.max = octets_max
        self.octets = 0
        self.d = OrderedDict()

    def get(self, k):
        v = self.d.get(k)
        if v is None:
            return None
        self.d.move_to_end(k)
        return v[0]

    def put(self, k, v, taille):
        self.d[k] = (v, taille)
        self.octets += taille
        while self.octets > self.max and len(self.d) > 1:
            _, (_, t) = self.d.popitem(last=False)
            self.octets -= t
        return v


_FICHIERS = _Cache(1_500_000_000)
_TRANSPOSES = _Cache(1_500_000_000)


def _accords():
    """Les corrections d'accord mesurées échantillon par échantillon (audition.py
    --echantillons --ecrire) : {nom du fichier: cents}."""
    import json
    p = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'accords.json')
    try:
        with open(p, encoding='utf-8') as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


ACCORDS = _accords()


class Echantillon:
    """Un fichier lu : float32 stéréo à 44,1 kHz, avec l'instant de son attaque."""
    __slots__ = ('donnees', 'attaque')

    def __init__(self, donnees, attaque):
        self.donnees = donnees
        self.attaque = attaque


def charger(chemin):
    e = _FICHIERS.get(chemin)
    if e is not None:
        return e
    x, sr = sf.read(chemin, dtype='float32', always_2d=True)
    if x.shape[1] == 1:
        x = np.repeat(x, 2, axis=1)
    elif x.shape[1] > 2:
        x = x[:, :2]
    if sr != SR:
        x = dsp.reechantillonner(x, 1.0, sr_source=sr)
    x = np.ascontiguousarray(x)
    ech = Echantillon(x, _attaque(x))
    return _FICHIERS.put(chemin, ech, x.nbytes)


def _attaque(x):
    """L'instant (en échantillons) où le son atteint le dixième de sa crête du début :
    c'est lui qu'on pose sur le temps."""
    n = min(len(x), int(1.0 * SR))
    if n < 16:
        return 0
    a = np.abs(x[:n]).max(axis=1)
    w = max(1, int(0.004 * SR))
    lisse = np.convolve(a, np.ones(w) / w, mode='same')
    pic = lisse.max()
    if pic <= 0:
        return 0
    i = int(np.argmax(lisse >= 0.1 * pic))
    return max(0, i - w // 2)


def transpose(chemin, rapport):
    """L'échantillon lu `rapport` fois plus vite (gardé en cache)."""
    cle = (chemin, round(rapport, 7))
    e = _TRANSPOSES.get(cle)
    if e is not None:
        return e
    ech = charger(chemin)
    if abs(rapport - 1.0) < 1e-7:
        return ech
    y = dsp.reechantillonner(ech.donnees, rapport)
    t = Echantillon(np.ascontiguousarray(y), int(round(ech.attaque / rapport)))
    return _TRANSPOSES.put(cle, t, y.nbytes)


# ---------------------------------------------------------------------------------
# Une banque : un fichier SFZ (une articulation d'un instrument)

class Banque:
    def __init__(self, chemin, regions=None):
        self.chemin = chemin
        self.regions = regions if regions is not None else lire_sfz(chemin)
        self.regions = [r for r in self.regions if r.trigger in ('attack', 'first', 'legato')
                        and r.hicc64 >= 0 and r.locc64 <= 0]
        if not self.regions:
            raise ValueError(f'aucune région jouable dans {chemin}')
        self.relache_regions = [r for r in lire_sfz(chemin) if r.trigger == 'release'] if regions is None else []
        self.compteurs = {}

    def etendue(self):
        return min(r.lokey for r in self.regions), max(r.hikey for r in self.regions)

    def raz(self):
        self.compteurs = {}

    def choisir(self, cle, vel, alea=0.5):
        """La région qui joue `cle` à `vel` : la bonne touche (sinon l'échantillon le
        plus proche), la bonne couche de vélocité (sinon la plus proche), le tour de
        rôle suivant (seq) ou le tirage `alea` (lorand/hirand)."""
        cands = [r for r in self.regions if r.lokey <= cle <= r.hikey]
        if not cands:
            d = min(abs(r.centre - cle) for r in self.regions)
            cands = [r for r in self.regions if abs(r.centre - cle) == d]
        couche = [r for r in cands if r.lovel <= vel <= r.hivel]
        if not couche:
            d = min(min(abs(vel - r.lovel), abs(vel - r.hivel)) for r in cands)
            couche = [r for r in cands if min(abs(vel - r.lovel), abs(vel - r.hivel)) == d]
        if len(couche) > 1:
            longueurs = {r.seq_length for r in couche}
            L = max(longueurs)
            if L > 1:
                k = (self.chemin, cle, couche[0].lovel)
                c = self.compteurs.get(k, 0)
                self.compteurs[k] = c + 1
                pos = c % L + 1
                pris = [r for r in couche if r.seq_position == pos]
                if pris:
                    couche = pris
            hasard = [r for r in couche if r.lorand <= alea < r.hirand]
            if hasard and len(hasard) < len(couche):
                couche = hasard
        return couche[0]


# ---------------------------------------------------------------------------------
# Jouer une note

def allonger(x, n, debut_min):
    """Rallonge `x` à `n` échantillons en bouclant sa partie tenue avec des fondus
    enchaînés à puissance constante (le soliste ne s'arrête pas de jouer)."""
    if len(x) >= n:
        return x[:n]
    L = len(x)
    a = int(max(debut_min + 0.35 * SR, 0.3 * L))
    b = int(L - 0.5 * SR)
    if b - a < int(0.6 * SR):
        a = int(0.25 * L)
        b = int(0.85 * L)
    if b - a < 2048:
        sortie = np.zeros((n, x.shape[1]), dtype=np.float32)
        sortie[:L] = x
        return sortie
    cf = min(int(0.3 * SR), (b - a) // 3)
    morceau = x[a:b]
    sortie = np.zeros((n + len(morceau), x.shape[1]), dtype=np.float32)
    sortie[:b] = x[:b]
    pos = b
    e = np.sin(np.linspace(0, np.pi / 2, cf, dtype=np.float32))[:, None]
    s = np.cos(np.linspace(0, np.pi / 2, cf, dtype=np.float32))[:, None]
    while pos < n:
        # le fondu : la fin de ce qui est posé descend pendant que le morceau monte
        sortie[pos - cf:pos] *= s
        sortie[pos - cf:pos - cf + len(morceau)] += morceau * np.concatenate(
            [e, np.ones((len(morceau) - cf, 1), np.float32)])
        pos += len(morceau) - cf
    return sortie[:n]


def jouer(banque, cle, vel, duree_s, desaccord_cents=0.0, oneshot=False, relache=None,
          sans_attaque_s=0.0, fondu_entree_s=0.0, alea=0.5, veltrack=None, attaque_s=None):
    """Une note : rend (signal stéréo, décalage) où `décalage` est le nombre
    d'échantillons à placer AVANT l'instant de la note (l'attaque tombe sur le temps).

    `oneshot` : la note joue tout son échantillon (percussions, pizzicati, staccati) ;
    `sans_attaque_s` : on entre dans l'échantillon après son attaque (le legato)."""
    r = banque.choisir(cle, vel, alea)
    corr = ACCORDS.get(os.path.basename(r.echantillon), 0.0)
    rapport = 2.0 ** ((cle - r.centre + (r.tune + corr + desaccord_cents) / 100.0) / 12.0)
    ech = transpose(r.echantillon, rapport)
    x = ech.donnees
    debut = int(r.offset / rapport) if r.offset else 0
    att = max(ech.attaque, debut)
    if sans_attaque_s > 0:
        debut = min(len(x) - 1, att + int(sans_attaque_s * SR))
        decalage = 0
    else:
        decalage = att - debut
    rel = r.relache if relache is None else relache
    if oneshot:
        corps = x[debut:]
        n = len(corps)
    else:
        n_tenu = decalage + int(duree_s * SR)
        n = n_tenu + int(rel * SR * 1.2)
        corps = allonger(x[debut:], n, max(0, att - debut))
    corps = np.array(corps, dtype=np.float32, copy=True)
    n = len(corps)
    # l'enveloppe : l'attaque (ampeg_attack, ou le fondu du legato), puis la relâche
    a = attaque_s if attaque_s is not None else (fondu_entree_s if fondu_entree_s > 0 else r.attaque)
    if a > 0.002:
        na = min(n, int(a * SR))
        corps[:na] *= np.sin(np.linspace(0, np.pi / 2, na, dtype=np.float32))[:, None] ** 2
    if not oneshot:
        n_tenu = decalage + int(duree_s * SR)
        if n_tenu < n:
            t = np.arange(n - n_tenu, dtype=np.float32) / SR
            corps[n_tenu:] *= np.exp(-6.9 * t / max(rel, 0.01))[:, None]
    # un fondu de sortie : jamais de coupure sèche en fin d'échantillon
    nf = min(n, int(0.02 * SR))
    corps[n - nf:] *= np.linspace(1, 0, nf, dtype=np.float32)[:, None]
    vt = r.veltrack if veltrack is None else veltrack
    g = 10.0 ** (r.volume / 20.0) * ((vel / 127.0) ** (2.0 * vt / 100.0))
    corps *= np.float32(g)
    return corps, decalage
