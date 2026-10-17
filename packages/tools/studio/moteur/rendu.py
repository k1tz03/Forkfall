"""Le rendu : d'une partition à un master mixé et masterisé, et ses repères.

Le principe qui rend la boucle parfaite : l'introduction et le corps sont rendus
CHACUN UNE FOIS, chacun avec sa queue (les relâches, les réverbes, les échos qui
débordent), pistes, bus et envois compris ; le master est ensuite assemblé en
posant l'introduction, puis le corps, puis le corps encore (les queues débordent
sur ce qui suit), et seule la chaîne du master (compresseur, écrêteur, limiteur,
gain de sonie) passe sur l'ensemble. Le second passage du corps (`boucle`) commence
donc avec la queue de la fin du corps : boucler `boucle.fin → boucle.debut` est
exactement jouer le corps une troisième fois (le banc le mesure : l'écart est nul
à la précision des flottants près, une fois la mémoire du compresseur écoulée)."""
import math
import time

import numpy as np

from . import dsp, synthe
from .dsp import SR
from .ecriture import Ecrivain, NUANCES
from .instruments import FAMILLES, Jeu, instrument

PREROLL = 1.0       # s avant le début d'un segment (attaques en avance, humanisation)
QUEUE = 14.0        # s après sa fin (relâches, réverbes, échos, un tam-tam qui sonne)

# l'humanisation par défaut, par famille : (écart de temps en ms, écart de vélocité)
HUMAIN = {'cordes': (9, 6), 'cuivres': (10, 6), 'bois': (8, 6), 'percussions': (4, 5),
          'claviers': (6, 5), 'choeur': (12, 4), 'guitares': (6, 6), 'batterie': (4, 6),
          'synthes': (0, 0), 'conception': (0, 0)}

# les bus et leur traitement par défaut (réglable par theme.bus(nom, ...))
BUS = {
    'cordes': {'eq': {'passe_haut': 32, 'cloches': [(2500, 1.0, 0.7)]}, 'comp': (-20, 1.6, 0.03, 0.25)},
    'cuivres': {'eq': {'passe_haut': 38, 'boue': -1.0}, 'comp': (-18, 1.8, 0.02, 0.2)},
    'bois': {'eq': {'passe_haut': 90}, 'comp': None},
    'percussions': {'eq': {'passe_haut': 28}, 'comp': (-14, 2.0, 0.01, 0.15)},
    'claviers': {'eq': {'passe_haut': 35}, 'comp': None},
    'choeur': {'eq': {'passe_haut': 120, 'cloches': [(3200, 1.5, 0.8)]}, 'comp': (-22, 1.8, 0.03, 0.3)},
    'guitares': {'eq': {'passe_haut': 80}, 'comp': (-18, 2.5, 0.01, 0.15)},
    'batterie': {'eq': {'passe_haut': 30}, 'comp': (-16, 3.0, 0.008, 0.12), 'sature': 0.6},
    'synthes': {'eq': {'passe_haut': 28}, 'comp': (-18, 1.8, 0.01, 0.15)},
    'conception': {'eq': {'passe_haut': 25}, 'comp': None},
}

# les salles (envois) : réponse fabriquée, retour égalisé
SALLES = {
    'salle': {'type': 'salle', 'rt60': 2.6, 'predelai': 0.028, 'clarte': 1.0, 'retour': 0.0,
              'eq': {'passe_haut': 160, 'passe_bas': 12000, 'boue': -2.0}},
    'plaque': {'type': 'plaque', 'rt60': 1.7, 'predelai': 0.008, 'clarte': 1.1, 'retour': 0.0,
               'eq': {'passe_haut': 220, 'passe_bas': 11000}},
    'piece': {'type': 'piece', 'rt60': 0.55, 'predelai': 0.004, 'clarte': 1.0, 'retour': -2.0,
              'eq': {'passe_haut': 150, 'passe_bas': 10000}},
}
# l'écho : `temps` en temps (0,75 = croche pointée) au tempo `bpm` (celui du thème
# par défaut : un écho ne suit pas les changements de tempo d'un segment)
ECHO = {'temps': 0.75, 'retour': 0.38, 'coupe_bas': 3800.0, 'coupe_haut': 280.0, 'pingpong': True,
        'niveau': -3.0, 'salle': 0.25}

# le master : passe-haut (rien sous 24 Hz), une pente douce (un peu d'air au-dessus de
# 8 kHz, un peu moins de grave sous 60), la colle (2:1, lente), l'écrêteur doux, le
# limiteur de crête vraie, la sonie
MASTER = {'passe_haut': 24.0, 'glue': (-16.0, 2.0, 0.03, 0.2), 'ecreteur': -2.5, 'plafond': -1.2,
          'cible_lufs': -16.0, 'pente': {'aigu': (1.5, 8000), 'grave': (-1.0, 60)}}


# ---------------------------------------------------------------------------------
# Le temps : la carte des tempos d'un segment

class CarteTempo:
    """Des morceaux (début, fin en temps ; bpm au début, bpm à la fin) : la conversion
    temps → secondes, rampes d'accelerando et de ritardando comprises (le tempo varie
    linéairement en temps le long d'une rampe)."""

    def __init__(self, morceaux):
        self.morceaux = morceaux
        self.depart = [0.0]
        for b0, b1, t0, t1 in morceaux:
            self.depart.append(self.depart[-1] + _integre(b0, b1, t0, t1, b1))

    def secondes(self, b):
        b = float(b)
        if not self.morceaux:
            return 0.0
        if b <= self.morceaux[0][0]:
            b0, _, t0, _ = self.morceaux[0]
            return (b - b0) * 60.0 / t0
        for i, (b0, b1, t0, t1) in enumerate(self.morceaux):
            if b <= b1 or i == len(self.morceaux) - 1:
                return self.depart[i] + _integre(b0, b1, t0, t1, b)
        return self.depart[-1]


def _integre(b0, b1, t0, t1, b):
    """∫ 60 / bpm(x) dx de b0 à b, bpm allant linéairement de t0 (en b0) à t1 (en b1)."""
    if b1 <= b0 or abs(t1 - t0) < 1e-9:
        return (b - b0) * 60.0 / t0
    if b > b1:
        return _integre(b0, b1, t0, t1, b1) + (b - b1) * 60.0 / t1
    k = (t1 - t0) / (b1 - b0)
    return 60.0 / k * math.log((t0 + k * (b - b0)) / t0)


# ---------------------------------------------------------------------------------
# Les segments : l'introduction, le corps

class Segment:
    def __init__(self, nom):
        self.nom = nom
        self.sections = []       # (nom, début, fin en temps, reprise, rang)
        self.notes = {}          # piste → [Note en temps absolus]
        self.courbes = {}        # (piste, paramètre) → [(temps, valeur)]
        self.longueur = 0.0      # en temps
        self.tempo = None

    @property
    def duree(self):
        return self.tempo.secondes(self.longueur) if self.tempo else 0.0


def construire(theme, noms, nom_segment, deja=None):
    """Écrit les sections `noms` les unes après les autres (chaque fonction de
    section est appelée avec son écrivain) ; `deja` compte les occurrences
    précédentes de chaque section (s.fois)."""
    seg = Segment(nom_segment)
    deja = dict(deja or {})
    pos = 0.0
    morceaux = []
    for rang, nom in enumerate(noms):
        sec = theme.sections[nom]
        bpm = sec.bpm if sec.bpm is not None else theme.bpm
        t0, t1 = (bpm, bpm) if not isinstance(bpm, (tuple, list)) else bpm
        morceaux.append((pos, pos + sec.longueur, float(t0), float(t1)))
        e = Ecrivain(theme, sec, deja.get(nom, 0), rang)
        sec.fonction(e)
        deja[nom] = deja.get(nom, 0) + 1
        for piste, note in e.evenements:
            seg.notes.setdefault(piste.nom, []).append(note.copie(t=note.t + pos))
        for piste, param, pts in e.courbes:
            # chaque appel (une nuance, un crescendo) garde ses points ensemble
            seg.courbes.setdefault((piste.nom, param), []).append([(t + pos, v) for t, v in pts])
        seg.sections.append((nom, pos, pos + sec.longueur, sec.reprise, rang))
        pos += sec.longueur
    seg.longueur = pos
    seg.tempo = CarteTempo(morceaux)
    return seg, deja


# ---------------------------------------------------------------------------------
# Une piste dans un segment

def _courbe_echantillons(appels, tempo, n, defaut, decalage):
    """Les courbes d'une piste (une liste d'appels, chacun ses points en temps) → un
    tableau par échantillon du tampon. Un appel tient la valeur de son premier point
    dès ce point, va en ligne droite d'un point à l'autre, puis tient son dernier point
    jusqu'à l'appel suivant : un crescendo de la section B ne déborde jamais sur A ou C.
    Avant le premier appel : la valeur par défaut."""
    if not appels:
        return None
    c = np.full(n, defaut, dtype=np.float64)
    idx = np.arange(n, dtype=np.float64)
    for pts in sorted((sorted(a) for a in appels if a), key=lambda a: a[0][0]):
        xs = np.array([decalage + tempo.secondes(t) for t, _ in pts]) * SR
        ys = np.array([v for _, v in pts], dtype=np.float64)
        a = max(0, int(np.ceil(xs[0])))
        if a >= n:
            continue
        c[a:] = np.interp(idx[a:], xs, ys)
    return c.astype(np.float32)


def _humain(piste, famille, reglages):
    h = reglages.get('humain')
    if h is None:
        return HUMAIN.get(famille, (0, 0))
    if isinstance(h, (int, float)):
        return (h, h * 0.6)
    return h


def jeux_piste(theme, piste, seg):
    """Les notes d'une piste → des Jeu en secondes dans le tampon du segment, humanisées
    (à graine fixe : la même note bouge toujours de la même façon)."""
    inst = instrument(piste.instrument)
    reg = piste.reglages
    ms, dv = _humain(piste, inst.famille, reg)
    transp = reg.get('transpose', 0)
    retard = reg.get('retard', 0.0)
    notes = sorted(seg.notes.get(piste.nom, []), key=lambda n: (n.t, str(n.h)))
    jeux = []
    for rang, n in enumerate(notes):
        rng = np.random.default_rng(synthe.graine_note(theme.graine, piste.nom, seg.nom, rang))
        dt = float(np.clip(rng.normal(0, ms / 2000.0), -ms / 1000.0, ms / 1000.0)) if ms else 0.0
        vel = n.v + (int(rng.integers(-dv, dv + 1)) if dv else 0)
        t = PREROLL + seg.tempo.secondes(n.t) + dt + retard
        d = seg.tempo.secondes(n.t + n.d) - seg.tempo.secondes(n.t)
        h = n.h + transp if not isinstance(n.h, str) else n.h
        jeux.append(Jeu(t, max(0.005, d), h, max(1, min(127, vel)), n.art, n.p, rang))
    return jeux


def _declencheurs(theme, seg, source):
    """Les instants (en échantillons du tampon) qui font pomper : les notes d'une
    piste, ou chaque temps."""
    if source == 'temps':
        return [int((PREROLL + seg.tempo.secondes(b)) * SR) for b in np.arange(0, seg.longueur, 1.0)]
    return sorted({int((PREROLL + seg.tempo.secondes(n.t)) * SR) for n in seg.notes.get(source, [])})


def enveloppe_pompe(n, instants, profondeur, relache, attaque=0.004, forme=2.0):
    """Le gain d'une piste qui pompe : plonge à chaque instant, remonte en `relache`."""
    g = np.ones(n, dtype=np.float32)
    na = max(1, int(attaque * SR))
    nr = max(1, int(relache * SR))
    plonge = 1 - profondeur * (np.arange(na) / na)
    remonte = 1 - profondeur * (1 - (np.arange(nr) / nr) ** (1 / forme))
    motif = np.concatenate([plonge, remonte]).astype(np.float32)
    for i in instants:
        a = i - na
        b = min(n, a + len(motif))
        if b <= max(0, a):
            continue
        m = motif[max(0, -a):b - a]
        g[max(0, a):b] = np.minimum(g[max(0, a):b], m)
    return g


def _porte(n, instants, duree, profondeur, relache):
    """La porte d'une réverbe : ouverte `duree` s après chaque coup, fermée net."""
    g = np.full(n, 1 - profondeur, dtype=np.float32)
    nd = int(duree * SR)
    nr = max(1, int(relache * SR))
    motif = np.concatenate([np.ones(nd), np.linspace(1, 1 - profondeur, nr)]).astype(np.float32)
    for i in instants:
        b = min(n, i + len(motif))
        if b > i >= 0:
            g[i:b] = np.maximum(g[i:b], motif[:b - i])
    return g


def rendre_piste(theme, piste, seg, n, salles_ir):
    """Rend une piste dans un segment : (sortie stéréo placée, envois {nom: stéréo})."""
    inst = instrument(piste.instrument)
    reg = piste.reglages
    fam = FAMILLES.get(inst.famille, {})
    jeux = jeux_piste(theme, piste, seg)
    if not jeux or reg.get('muet'):
        return None, {}
    courbes = {}
    for (nom_p, param), appels in seg.courbes.items():
        if nom_p == piste.nom:
            defaut = 0.0 if param == 'volume' else 1.0      # dB pour le volume, un facteur sinon
            c = _courbe_echantillons(appels, seg.tempo, n, defaut, PREROLL)
            if c is not None:
                courbes[param] = c
    ctx = {'reglages': reg, 'graine': theme.graine, 'piste': piste.nom, 'segment': seg.nom,
           'courbes': courbes}
    x = inst.rendre(jeux, n, ctx)
    # l'expression (0..1, en loi de puissance 1,2 : f ≈ −2,3 dB, mf ≈ −4,5, p ≈ −11) et le
    # volume ; la vélocité, elle, choisit la couche et la force de l'attaque
    expr = courbes.get('expression')
    exp_defaut = reg.get('expression')
    if isinstance(exp_defaut, str):
        exp_defaut = NUANCES[exp_defaut]
    if expr is not None:
        x *= (np.maximum(expr, 0.0) ** 1.2)[:, None]
    elif exp_defaut is not None:
        x *= np.float32(exp_defaut ** 1.2)
    if 'volume' in courbes:
        x *= dsp.gain(courbes['volume'])[:, None].astype(np.float32)
    x *= np.float32(dsp.gain(reg.get('volume', 0.0)))
    # l'égaliseur : celui de la famille, puis celui de la piste
    eq = dict(fam.get('eq', {}))
    eq.update(reg.get('eq') or {})
    prof = reg.get('profondeur', inst.mix.get('profondeur', 0.3))
    if prof:
        eq.setdefault('aigu', (-4.0 * prof, 6000))
    x = dsp.egaliseur(x, eq)
    if reg.get('sature'):
        x = dsp.saturer(x, reg['sature'])
    if reg.get('comp'):
        s, r, a, rel = reg['comp']
        x, _ = dsp.compresseur(x, s, r, a, rel)
    if reg.get('pompe'):
        p = reg['pompe']
        inst_p = _declencheurs(theme, seg, p.get('source', 'temps'))
        x *= enveloppe_pompe(n, inst_p, p['profondeur'], p['relache'], p.get('attaque', 0.004),
                             p.get('forme', 2.0))[:, None]
    pan = reg.get('pan', inst.mix.get('pan', 0.0))
    largeur = reg.get('largeur', inst.mix.get('largeur', 0.7))
    x = dsp.panoramique(x, pan, largeur)
    if reg.get('mono'):
        m = x.mean(axis=1)
        x = np.stack([m, m], axis=1)
    # la porte : une plaque dense ouverte à chaque coup, fermée net (la caisse « gated »)
    if reg.get('porte'):
        pt = reg['porte']
        ir = salles_ir['plaque_dense']
        mouille = dsp.convoluer(x, ir, croise=0.5)
        inst_p = sorted({int(j.t * SR) for j in jeux})
        mouille *= _porte(n, inst_p, pt['duree'], pt.get('profondeur', 1.0), pt.get('relache', 0.03))[:, None]
        x = x + mouille * np.float32(dsp.gain(pt.get('niveau', -2.0)))
    # les envois (après le volume) ; la profondeur pousse vers la salle
    envois = {}
    for nom_e in ('salle', 'plaque', 'piece', 'echo'):
        niveau = reg.get(nom_e, inst.mix.get(nom_e, fam.get(nom_e, 0.0)))
        if nom_e == 'salle' and niveau:
            niveau *= (0.7 + 0.6 * prof)
        if niveau:
            envois[nom_e] = x * np.float32(niveau)
            if 'envoi' in courbes:
                envois[nom_e] = envois[nom_e] * courbes['envoi'][:, None]
    return x, envois


# ---------------------------------------------------------------------------------
# Un segment entier : toutes les pistes, les bus, les envois → un pré-master

def rendre_segment(theme, seg, journal=None):
    n = int((PREROLL + seg.duree + QUEUE) * SR)
    pre = np.zeros((n, 2), dtype=np.float32)
    envois = {k: np.zeros((n, 2), dtype=np.float32) for k in ('salle', 'plaque', 'piece', 'echo')}
    salles_ir = {}
    for nom, spec in SALLES.items():
        s = dict(spec)
        s.update(theme.reglages_salles.get(nom, {}))
        salles_ir[nom] = (dsp.reponse(s['type'], s['rt60'], s['predelai'], s['clarte']), s)
    salles_ir['plaque_dense'] = dsp.reponse('plaque', 1.1, 0.0, 1.2, graine=11)
    ir_porte = {'plaque_dense': salles_ir['plaque_dense']}
    pistes = [p for p in theme.pistes.values()]
    solos = [p for p in pistes if p.reglages.get('solo')]
    if solos:
        pistes = solos
    par_bus = {}
    for p in pistes:
        inst = instrument(p.instrument)
        b = p.reglages.get('bus') or FAMILLES.get(inst.famille, {}).get('bus', inst.famille)
        par_bus.setdefault(b, []).append(p)
    for nom_bus in sorted(par_bus):
        bus = np.zeros((n, 2), dtype=np.float32)
        for p in par_bus[nom_bus]:
            t0 = time.time()
            x, env = rendre_piste(theme, p, seg, n, ir_porte)
            if x is None:
                continue
            bus += x
            for k, v in env.items():
                envois[k] += v
            if journal is not None:
                journal.append((seg.nom, p.nom, round(time.time() - t0, 2),
                                round(dsp.sonie_integree(x), 1)))
        reglage = dict(BUS.get(nom_bus, {}))
        reglage.update(theme.reglages_bus.get(nom_bus, {}))
        if reglage.get('eq'):
            bus = dsp.egaliseur(bus, reglage['eq'])
        if reglage.get('sature'):
            bus = dsp.saturer(bus, reglage['sature'])
        if reglage.get('comp'):
            s, r, a, rel = reglage['comp']
            bus, _ = dsp.compresseur(bus, s, r, a, rel, genou=8.0)
        if reglage.get('pompe'):
            p = reglage['pompe']
            bus *= enveloppe_pompe(n, _declencheurs(theme, seg, p.get('source', 'temps')),
                                   p['profondeur'], p['relache'])[:, None]
        pre += bus * np.float32(dsp.gain(reglage.get('volume', 0.0)))
    # l'écho : il part aussi dans la salle
    e = dict(ECHO)
    e.update(theme.reglages_salles.get('echo', {}))
    if np.any(envois['echo']):
        temps = e['temps'] * 60.0 / e.get('bpm', theme.bpm)
        mouille = dsp.echo_stereo(envois['echo'], temps, e['retour'], e['coupe_bas'], e['coupe_haut'],
                                  e['pingpong'])
        mouille *= np.float32(dsp.gain(e['niveau']))
        envois['salle'] += mouille * np.float32(e.get('salle', 0.0))
        pre += mouille
    for nom in ('salle', 'plaque', 'piece'):
        if not np.any(envois[nom]):
            continue
        ir, s = salles_ir[nom]
        mouille = dsp.convoluer(envois[nom], ir)
        mouille = dsp.egaliseur(mouille, s.get('eq'))
        if s.get('pompe'):
            p = s['pompe']
            mouille *= enveloppe_pompe(n, _declencheurs(theme, seg, p.get('source', 'temps')),
                                       p['profondeur'], p['relache'])[:, None]
        pre += mouille * np.float32(dsp.gain(s.get('retour', 0.0)))
    # les trois dernières secondes du tampon s'effacent : un son plus long que la queue
    # (un tam-tam) ne s'arrête jamais net au milieu du passage suivant
    fin = int(3.0 * SR)
    pre[-fin:] *= np.cos(np.linspace(0, np.pi / 2, fin, dtype=np.float32))[:, None] ** 2
    return pre


# ---------------------------------------------------------------------------------
# Le master : l'assemblage, la chaîne, la sonie

def chaine_master(x, reglage, gain_db, marge_debut=0):
    y = dsp.passe_haut(x, reglage['passe_haut'], ordre=2) if reglage.get('passe_haut') else x
    if reglage.get('pente'):
        y = dsp.egaliseur(y, reglage['pente'])
    y = y * np.float32(dsp.gain(gain_db))
    if reglage.get('glue'):
        s, r, a, rel = reglage['glue']
        y, _ = dsp.compresseur(y, s, r, a, rel, genou=10.0, rms=0.02)
    if reglage.get('ecreteur') is not None:
        y = dsp.ecreteur_doux(y, reglage['ecreteur'])
    y, _ = dsp.limiteur(y, reglage['plafond'])
    return y


def rendre(theme, journal=None, rapide=False):
    """Rend un thème : (master stéréo float32, repères)."""
    t_debut = time.time()
    intro, deja = construire(theme, theme.intro, 'intro')
    corps, _ = construire(theme, theme.corps, 'corps', deja)
    if not theme.corps:
        raise ValueError('le corps (la boucle) est vide : theme.forme(intro=[…], corps=[…])')
    if corps.duree < QUEUE + PREROLL:
        print(f'! le corps dure {corps.duree:.1f} s, moins que sa queue ({QUEUE:.0f} s) : la fin du second '
              f'passage porte encore la queue du premier, la couture ne sera pas exacte au bit')
    pre_intro = rendre_segment(theme, intro, journal) if theme.intro else None
    pre_corps = rendre_segment(theme, corps, journal)
    n_intro = int(round(intro.duree * SR)) if theme.intro else 0
    n_corps = int(round(corps.duree * SR))
    p = int(PREROLL * SR)
    n_queue = int(QUEUE * SR)
    b0, b1 = n_intro + n_corps, n_intro + 2 * n_corps

    def ligne_de_temps(passages, preroll_suivant):
        """L'introduction puis `passages` fois le corps (les queues débordent sur ce qui
        suit) ; `preroll_suivant` : la pré-attaque du passage d'après, seule. Chaque
        tampon commence PREROLL avant son segment : on le pose décalé d'autant."""
        n = n_intro + passages * n_corps + n_queue
        m = np.zeros((n + p, 2), dtype=np.float32)

        def poser(buf, debut):
            b = min(len(m), debut + len(buf))
            m[debut:b] += buf[:b - debut]
        if pre_intro is not None:
            poser(pre_intro, 0)
        for k in range(passages):
            poser(pre_corps, n_intro + k * n_corps)
        if preroll_suivant:
            poser(pre_corps[:p], n_intro + passages * n_corps)
        return m[p:p + n]

    reglage = dict(MASTER)
    reglage.update(theme.reglages_master)
    # La chaîne du master anticipe (le limiteur voit 2 ms devant lui, les filtres de
    # suréchantillonnage aussi) : pour que la fin du second passage soit traitée comme
    # celle du premier, elle doit « voir » un troisième passage. Le master est donc la
    # ligne à trois passages jusqu'à la fin de la boucle, puis la queue d'une ligne à
    # deux passages (le corps qui s'éteint), raccordées en 30 ms après la boucle.
    trois = ligne_de_temps(3, False)
    # la sonie : le gain qui met la boucle (le second passage) à la cible ; on itère sur
    # un extrait (la boucle et cinq secondes avant elle), c'est la même chaîne. Une musique
    # de film (`theme.master(sonie_sur='intro')`) se règle sur son introduction : c'est elle
    # qu'on entend sous les images, la boucle n'est qu'une traîne si le film dure plus
    r0, r1 = (0, n_intro) if reglage.get('sonie_sur') == 'intro' else (b0, b1)
    a = max(0, r0 - 5 * SR)
    extrait = trois[a:r1 + SR]
    gain_db = reglage['cible_lufs'] - dsp.sonie_integree(trois[r0:r1])
    for _ in range(8):
        y = chaine_master(extrait, reglage, gain_db)
        l = dsp.sonie_integree(y[r0 - a:r1 - a])
        ecart = reglage['cible_lufs'] - l
        if abs(ecart) < 0.02:
            break
        gain_db += ecart
    y3 = chaine_master(trois, reglage, gain_db)
    del trois
    deux = ligne_de_temps(2, True)
    y2 = chaine_master(deux, reglage, gain_db)
    del deux
    y = y2
    y[:b1] = y3[:b1]
    raccord = int(0.03 * SR)
    f = np.sin(np.linspace(0, np.pi / 2, raccord, dtype=np.float32))[:, None] ** 2
    y[b1:b1 + raccord] = y3[b1:b1 + raccord] * (1 - f) + y2[b1:b1 + raccord] * f
    del y3
    # un fondu final sur la queue (rien ne s'arrête net)
    fin = int(2.0 * SR)
    y[-fin:] *= np.linspace(1, 0, fin, dtype=np.float32)[:, None]
    reperes = _reperes(theme, intro, corps, n_intro, n_corps, y, b0, b1)
    if reglage.get('sonie_sur') == 'intro':
        reperes['sonie_sur'] = 'intro'
        reperes['lufs'] = round(dsp.sonie_integree(y[:n_intro]), 2)
    reperes['duree_rendu_s'] = round(time.time() - t_debut, 1)
    reperes['gain_master_db'] = round(gain_db, 2)
    return y, reperes


def _reperes(theme, intro, corps, n_intro, n_corps, y, b0, b1):
    sections = []
    for nom, deb, fin, reprise, rang in intro.sections:
        sections.append({'nom': nom, 'debut': int(round(intro.tempo.secondes(deb) * SR)),
                         'fin': int(round(intro.tempo.secondes(fin) * SR)), 'intro': True,
                         'reprise': False, 'rang': rang, 'mesures': theme.sections[nom].mesures})
    for nom, deb, fin, reprise, rang in corps.sections:
        sections.append({'nom': nom, 'debut': b0 + int(round(corps.tempo.secondes(deb) * SR)),
                         'fin': b0 + int(round(corps.tempo.secondes(fin) * SR)), 'intro': False,
                         'reprise': bool(reprise), 'rang': rang, 'mesures': theme.sections[nom].mesures})
    if sections and not sections[-1]['intro']:
        sections[-1]['fin'] = b1       # pas d'écart d'arrondi au bout de la boucle
    premier = theme.sections[theme.corps[0]]
    bpm0 = premier.bpm if premier.bpm is not None else theme.bpm
    bpm0 = bpm0[0] if isinstance(bpm0, (tuple, list)) else bpm0
    return {
        'cle': theme.cle,
        'titre': theme.titre,
        'bpm': bpm0,
        'mesure': f'{premier.mesure.num}/{premier.mesure.den}',
        'mesure_s': round(premier.mesure.temps * 60.0 / bpm0, 6),
        'frequence': SR,
        'tonalite': theme.tonalite.texte,
        'moment': theme.moment,
        'humeur': theme.humeur,
        'ville': theme.ville,
        'intro': {'debut': 0, 'fin': n_intro},
        'boucle': {'debut': b0, 'fin': b1},
        'sections': sections,
        'reprise': {'sauf': sorted({s['nom'] for s in sections if not s['intro'] and not s['reprise']})},
        'lufs': round(dsp.sonie_integree(y[b0:b1]), 2),
        'lufs_master': round(dsp.sonie_integree(y), 2),
        'crete_dbtp': round(dsp.crete_vraie_db(y), 2),
        'duree_s': round(len(y) / SR, 3),
        'boucle_s': round((b1 - b0) / SR, 3),
        'boucle_min_s': theme.boucle_min,
        'echantillons': len(y),
    }
