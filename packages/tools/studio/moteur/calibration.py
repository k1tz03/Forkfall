"""La calibration des niveaux (banc.py --calibrer) : ce que le compositeur entend.

Deux tables, rangées dans le dépôt et relues à chaque rendu :

- `zones.json` : l'égalisation des zones. Chaque région d'une bibliothèque (un
  échantillon d'une note, d'une couche de vélocité, d'un tour de rôle) est ramenée à la
  sonie de sa banque : les bibliothèques ont été enregistrées zone par zone à des niveaux
  inégaux (une trompette staccato de 22 dB plus faible à fa 4 qu'à ré 5, une couche
  forte plus faible que la douce…), et une ligne doit garder son niveau sur toute
  l'étendue. La correction s'applique APRÈS le choix de la couche (un gain, jamais une
  vélocité : le timbre ne change pas). Les banques General MIDI et les synthés, qui
  n'ont pas d'échantillons à nous, reçoivent une correction par demi-ton.
- `niveaux.json` : le niveau de chaque articulation, mesuré en contexte (la piste du
  studio : l'instrument, son égaliseur, sa profondeur, sa place) sur des figures de
  musique : une ligne et un accord de croches, une ligne de doubles croches à 120, une
  note et un accord tenus ; dans trois registres (le grave, le médium, l'aigu de
  l'étendue) et à trois vélocités (64, 96, 120). Le gain met la moyenne à la cible :
  −20 LUFS pour une voix à vélocité 100 (−15,2 pour un accord de trois sons).

Les percussions sans hauteur, les batteries et les sons de conception gardent leur
mesure d'origine (une frappe, un roulement, un motif) : leurs articulations sont des
gestes différents (un cercle n'est pas une frappe), pas des façons de jouer une note.

Tout est déterministe : mêmes échantillons, même catalogue, mêmes tables."""
import json
import os
import time

import numpy as np

from . import dsp, echantillonneur as ech, rendu
from .dsp import SR
from .ecriture import Note, Theme
from .instruments import (FAMILLES, INSTRUMENTS, InstrumentConception, InstrumentCouches, InstrumentFoule,
                          InstrumentGM, InstrumentRythmes, InstrumentSfz, InstrumentSynthe, Jeu)
from .theorie import nom as nom_note

ICI = os.path.dirname(os.path.abspath(__file__))

CIBLE = -20.0                   # LUFS : une voix, vélocité 100, en contexte
VELOCITES = (64, 96, 120)
BPM = 120.0
BREVES = ('staccato', 'pizzicato', 'pince', 'frappe', 'dure', 'seul', 'etouffee', 'cercle',
          'timbre_off', 'mediator', 'doigts', 'slap', 'crunch')
# tenus sur le papier, mais leur son s'éteint aussitôt : on les mesure en suites de notes
DECROISSANTS = ('piano', 'arpege_synthe')
SUITES = ('ligne_croches', 'accord_croches', 'ligne_doubles')
# un programme GM tenu à l'attaque lente (0,2 à 0,6 s : un archet lent ; le trémolo, à
# vélocité 64) : comme le legato, il est fait pour les lignes jusqu'à la croche à 120 (en
# doubles, la note n'a pas parlé : 4,6 dB sous les croches à v64)
LENTS = (('pupitre_basses', 'tenu'), ('pupitre_basses', 'tremolo'))
# les corrections par demi-ton (GM, synthés) sont mesurées à ces vélocités ; un programme
# dont le niveau saute d'une vélocité à la suivante l'est sur toute sa grille
VELS_ZONES = VELOCITES
GRILLE = (16, 32, 48, 64, 80, 96, 112, 127)
DESORDRE_DB = 1.0
# la fenêtre d'une mesure : une figure (deux mesures à 120) et 1,6 s de sa queue ; la note
# tenue seule d'une zone est mesurée sur la même (une nappe générale dont l'aigu s'ouvre
# lentement à vélocité 64 garde l'essentiel de son énergie pour après la note : mesurée
# queue comprise, elle sortait 4 dB plus faible dans la figure que dans sa zone)
FENETRE_S = 5.6
TENUES = ('note_tenue', 'accord_tenu')
VOIX = {'ligne_croches': 1, 'accord_croches': 3, 'ligne_doubles': 1, 'note_tenue': 1, 'accord_tenu': 3}
BORNE_ZONE = 18.0               # dB : au-delà, l'échantillon est laissé un peu plus faible
BORNE_HAUTEUR = 12.0
REGISTRES = ('grave', 'medium', 'aigu')


# ---------------------------------------------------------------------------------
# Les figures

def notes_figure(figure, p, vel, art):
    """Les notes d'une figure de deux mesures (en temps, à 120) bâtie sur la hauteur `p` :
    la ligne monte et descend une quinte (p, p+2, p+3, p+5, p+7…), l'accord est p, p+3, p+7."""
    n = []
    motif = (0, 2, 3, 5, 7, 5, 3, 2)
    if figure == 'accord_croches':
        for k in range(16):
            n += [Note(p + d, k * 0.5, 0.5, vel, art) for d in (0, 3, 7)]
    elif figure == 'ligne_croches':
        n = [Note(p + motif[k % 8], k * 0.5, 0.5, vel, art) for k in range(16)]
    elif figure == 'ligne_doubles':
        n = [Note(p + motif[k % 8], k * 0.25, 0.25, vel, art) for k in range(32)]
    elif figure == 'note_tenue':
        n = [Note(p, 0, 8, vel, art)]
    elif figure == 'accord_tenu':
        n = [Note(p + d, 0, 8, vel, art) for d in (0, 3, 7)]
    else:
        raise ValueError(f'figure inconnue : {figure}')
    return n


def rendre_figure(nom_inst, art, vel, p, figure, reglages=None, graine=1):
    """Une figure jouée par une piste seule, dans la chaîne de piste du studio (comme
    `rendre.py --pistes` la mesure) : le signal stéréo de la piste."""
    th = Theme('_calibration', 'calibration', bpm=BPM, graine=graine, boucle_min=0)
    piste = th.piste('x', nom_inst, **dict(reglages or {}))
    notes = notes_figure(figure, p, vel, art)

    @th.section('A', mesures=2)
    def _a(s):
        for x in notes:
            s.evenements.append((piste, x))
    th.forme(intro=[], corps=['A'])
    seg, _ = rendu.construire(th, ['A'], 'corps')
    n = int((rendu.PREROLL + seg.duree + 3.0) * SR)
    x, _ = rendu.rendre_piste(th, piste, seg, n, {})
    return x


def sonie_figure(nom_inst, art, vel, p, figure, reglages=None):
    """La sonie intégrée (LUFS) d'une figure en contexte (voir `rendre_figure`), sur
    FENETRE_S secondes à partir de 0,1 s avant sa première attaque."""
    x = rendre_figure(nom_inst, art, vel, p, figure, reglages)
    a = int((rendu.PREROLL - 0.1) * SR)
    return float(dsp.sonie_integree(x[a:a + int(FENETRE_S * SR)]))


def registres(inst):
    """Le grave, le médium et l'aigu de l'étendue : la hauteur de base de chaque figure
    (une figure couvre une quinte au-dessus d'elle)."""
    lo, hi = inst.etendue
    L = max(0, hi - lo - 7)
    return {'grave': lo + round(0.15 * L), 'medium': lo + round(0.5 * L), 'aigu': lo + round(0.85 * L)}


def a_hauteur(inst):
    """Les instruments calibrés par figures (à hauteur) ; les autres gardent l'ancienne mesure."""
    if inst.etendue is None or inst.famille == 'batterie' or isinstance(inst, (InstrumentRythmes,
                                                                                InstrumentConception)):
        return False
    return True


def est_breve(inst, art):
    """Une articulation brève (ou un son qui s'éteint aussitôt) : mesurée en suites."""
    if inst.nom in DECROISSANTS or art in BREVES:
        return True
    if isinstance(inst, InstrumentSfz):
        return bool(inst.articulations[art].get('oneshot'))
    return False


def figures(inst, art):
    """Les figures d'une articulation : une brève, les suites ; une tenue, les notes et
    accords tenus, et aussi les suites si l'instrument a des articulations brèves (c'est
    sur les mêmes croches que tenu et staccato doivent sonner pareil). Le legato n'est
    pas mesuré en doubles croches : il est fait pour les lignes jusqu'à la croche à 120
    (studio.md § 10 ; plus vite, ses fondus enchaînés se recouvrent et il perd 2 à 3 dB)."""
    if est_breve(inst, art):
        return SUITES
    if any(est_breve(inst, a) for a in inst.articulations):
        if (art == 'legato' or (inst.nom, art) in LENTS
                or (isinstance(inst, InstrumentSfz) and inst.articulations[art].get('legato'))):
            return ('ligne_croches', 'accord_croches') + TENUES
        return SUITES + TENUES
    return TENUES


def cible(figure, vel=100):
    """La sonie visée : −20 LUFS pour une voix à vélocité 100 ; un accord de trois sons
    3 fois plus d'énergie ; la vélocité suit la loi de l'échantillonneur (v/127)²."""
    return CIBLE + 10 * np.log10(VOIX[figure]) + 40 * np.log10(vel / 100.0)


# ---------------------------------------------------------------------------------
# Les zones

def _egaliseur_famille(inst, x):
    """L'égaliseur que la piste pose par défaut (famille, profondeur) : les zones sont
    égalisées telles qu'on les entend dans la piste."""
    fam = FAMILLES.get(inst.famille, {})
    eq = dict(fam.get('eq', {}))
    prof = inst.mix.get('profondeur', 0.3)
    if prof:
        eq.setdefault('aigu', (-4.0 * prof, 6000))
    return dsp.egaliseur(x, eq)


def mesures_note(inst, art, h, breve, v=100):
    """La sonie d'une zone jouée à la hauteur `h` (vélocité `v`, sans éclat, avec les
    prises du pupitre : dans le grave, leurs retards filtrent le son en peigne, et pas
    pareil d'une note à l'autre ; dans l'égaliseur de la piste) : (une note brève, une
    note seule). La note brève (une croche à 120) est jouée seule et son énergie ramenée
    à sa place dans une suite de croches : rejouer huit fois le même échantillon à la
    même hauteur faisait interférer les queues avec les attaques (± 3 dB selon la
    phase, une couche de cor mesurée 4,7 dB trop faible). La note seule : tenue
    LONG_S secondes, sur la fenêtre des figures (FENETRE_S), ou, brève, la sonie
    maximale de la note brève sur 400 ms."""
    ctx = {'reglages': {'eclat': 0}, 'courbes': {}}
    y = _egaliseur_famille(inst, inst.rendre([Jeu(0.3, ech.COURT_S, h, v, art, None, 0)], int(4.0 * SR), ctx))
    k = dsp.ponderation_k(y)
    l_court = float(-0.691 + 10 * np.log10(max(float(np.sum(k * k)) / SR / ech.COURT_S, 1e-15)))
    if breve:
        l_seule = float(dsp.sonie_court_terme(y, fenetre=0.4, pas=0.02).max())
    else:
        y = _egaliseur_famille(inst, inst.rendre([Jeu(0.3, ech.LONG_S, h, v, art, None, 0)],
                                                 int((0.2 + FENETRE_S) * SR), ctx))
        l_seule = dsp.sonie_integree(y[int(0.2 * SR):])
    return l_court, l_seule


def desordre(inst, art):
    """Le niveau d'un programme GM saute-t-il d'une vélocité à la suivante ? Le pupitre de
    contrebasses de la banque générale superpose deux prises très voisines d'une même
    note, l'une démarrée plus ou moins loin dans l'échantillon selon la vélocité (157
    échantillons par pas) : à la fondamentale, elles s'ajoutent ou s'annulent, et la
    note brève saute de 4 à 7 dB d'un pas de vélocité à l'autre (de façon déterministe).
    Mesuré : l'écart type des différences successives de la note brève de v94 à v106
    (pas de 2), dans les trois registres ; au-delà de DESORDRE_DB, le programme joue sur
    une grille de vélocités."""
    if not isinstance(inst, InstrumentGM):
        return False
    regs = registres(inst)
    pire = 0.0
    for rg in REGISTRES:
        xs = [mesures_note(inst, art, regs[rg] + 3, True, v)[0] for v in range(94, 107, 2)]
        pire = max(pire, float(np.std(np.diff(xs))))
    return pire > DESORDRE_DB


def mesure_note(inst, art, h, breve):
    """La sonie d'une zone en un nombre : la moyenne de la suite et de la note seule."""
    return float(np.mean(mesures_note(inst, art, h, breve)))


def _banques_a_egaliser():
    """Les banques à hauteur des instruments échantillonnés : (nom de banque, instrument,
    articulation qui la mesure). Une banque partagée (tenu et legato) n'est mesurée qu'une
    fois ; les percussions à touche fixe (un cercle, un roulement) gardent leurs couches."""
    vues = {}
    for nom_i in sorted(INSTRUMENTS):
        inst = INSTRUMENTS[nom_i]
        if not isinstance(inst, InstrumentSfz) or inst.etendue is None:
            continue
        for art, spec in inst.articulations.items():
            if 'cle' in spec or spec['sfz'] in vues:
                continue
            vues[spec['sfz']] = (nom_i, art)
    return [(b, i, a) for b, (i, a) in sorted(vues.items())]


def zones_banque(args):
    """Les corrections d'une banque : {clé de région: dB} et le détail (pour le rapport).
    Une banque brève (ou d'un son qui s'éteint : le piano) : une correction par région,
    qui met la moyenne (suite, note seule) à la médiane de la banque. Une banque tenue :
    deux corrections par région, qui mettent sa note brève ET sa note tenue à la médiane
    des notes tenues de la banque (une croche tenue sonne alors comme une note tenue)."""
    banque_nom, nom_i, art = args
    inst = INSTRUMENTS[nom_i]
    spec = inst.articulations[art]
    b = inst.banque(art)
    breve = bool(spec.get('oneshot'))
    deux = not breve and nom_i not in DECROISSANTS
    mesures = []
    for r in b.regions:
        b.forcer = r
        try:
            court, seul = mesures_note(inst, art, r.centre - inst.transposition, breve)
        finally:
            b.forcer = None
        mesures.append((r, court, seul))
    corr = {}
    detail = []
    if deux:
        ref = float(np.median([s for _, _, s in mesures]))
        for r, court, seul in mesures:
            cc = round(float(np.clip(ref - court, -BORNE_ZONE, BORNE_ZONE)), 1)
            cl = round(float(np.clip(ref - seul, -BORNE_ZONE, BORNE_ZONE)), 1)
            corr[ech.cle_region(r)] = [cc, cl] if cc != cl else cl
            detail.append((r.centre, r.lovel, r.hivel, r.seq_position, round(court, 1), round(seul, 1), cc, cl))
    else:
        ms = [0.5 * (c + s) for _, c, s in mesures]
        ref = float(np.median(ms))
        for (r, court, seul), m in zip(mesures, ms):
            c = round(float(np.clip(ref - m, -BORNE_ZONE, BORNE_ZONE)), 1)
            corr[ech.cle_region(r)] = c
            detail.append((r.centre, r.lovel, r.hivel, r.seq_position, round(court, 1), round(seul, 1), c, c))
    return banque_nom, corr, detail


def _instruments_par_hauteur():
    """Les instruments sans échantillons à nous (General MIDI à hauteur, synthés, la
    foule qui chante ; pas sa rumeur, qui n'a pas de hauteur)."""
    sortie = []
    for nom_i in sorted(INSTRUMENTS):
        inst = INSTRUMENTS[nom_i]
        if isinstance(inst, InstrumentGM) and not inst.kit and inst.etendue is not None:
            sortie += [(nom_i, a) for a in inst.articulations]
        elif isinstance(inst, InstrumentSynthe):
            sortie.append((nom_i, 'tenu'))
        elif isinstance(inst, InstrumentFoule):
            sortie += [(nom_i, a) for a in inst.articulations if a != 'rumeur']
    return sortie


def zones_hauteurs(args):
    """La correction par demi-ton d'une articulation GM, d'un synthé ou de la foule,
    mesurée comme l'articulation est calibrée (`figures`) : brève, la moyenne (note brève,
    note seule) ; tenue d'un instrument qui n'a que des tenues (une nappe, le chœur, la
    foule), la note tenue ; tenue d'un instrument qui a des brèves, deux corrections par
    demi-ton (note brève, note tenue), que la durée interpole. Les synthés varient sans à-coups (le filtre
    suit la note) : leur courbe est lissée (un polynôme de degré 2) ; les banques GM ont
    leurs zones à elles : un point par demi-ton. Une rangée par vélocité de VELS_ZONES
    (une zone répond plus ou moins vite à la vélocité que ses voisines : la nappe
    « atmosphère » prend 8,6 dB de v88 à v112 dans l'aigu, 3,1 dans le grave). Chaque
    rangée est ramenée à une sonie cible : la médiane des demi-tons à vélocité 96, puis
    la loi de vélocité de l'échantillonneur, (v/127)², pour les autres rangées : un
    programme GM répond alors à la vélocité comme les instruments échantillonnés (de v64
    à v120, ils prenaient de 7,8 à 13,6 dB selon le programme, contre 10,9). Les synthés
    gardent leur loi (la vélocité y ouvre surtout le filtre) : leurs rangées vont à leur
    médiane. Un programme en désordre (`desordre`) : une rangée par vélocité de sa
    GRILLE, et la loi (`ref`) pour les vélocités entre deux."""
    nom_i, art = args
    inst = INSTRUMENTS[nom_i]
    lo, hi = inst.etendue
    hs = np.arange(lo, hi + 1, dtype=float)
    breve = est_breve(inst, art)
    deux = not breve and figures(inst, art) != TENUES
    grille = desordre(inst, art)
    vels = GRILLE if grille else VELS_ZONES
    rangees = []
    for v in vels:
        mesures = np.array([mesures_note(inst, art, int(h), breve, v) for h in hs])     # (court, seul)
        if breve:
            series = {'db': mesures.mean(axis=1)}
        elif not deux:
            series = {'db': mesures[:, 1]}
        else:
            series = {'court': mesures[:, 0], 'long': mesures[:, 1]}
        if isinstance(inst, InstrumentSynthe):
            series = {k: np.polyval(np.polyfit(hs, x, 2), hs) for k, x in series.items()}
        rangees.append(series)
    medianes = [float(np.median(r['long' if deux else 'db'])) for r in rangees]
    if isinstance(inst, InstrumentSynthe):
        cibles = medianes
    else:
        i0 = vels.index(96)
        cibles = [medianes[i0] + 40.0 * np.log10(v / 96.0) for v in vels]
    table = {'de': lo, 'vels': list(vels)}
    for series, c in zip(rangees, cibles):
        for k, x in series.items():
            table.setdefault(k, []).append([round(float(np.clip(c - y, -BORNE_HAUTEUR, BORNE_HAUTEUR)), 1)
                                            for y in x])
    if grille:
        table['grille'] = list(GRILLE)
        table['ref'] = [round(float(c), 2) for c in cibles]
    return f'{nom_i}:{art}', table, [round(m, 2) for m in medianes]


# ---------------------------------------------------------------------------------
# Les articulations

def mesurer_articulation(args):
    """La sonie en contexte d'une articulation : {(registre, figure, vélocité): LUFS}."""
    nom_i, art = args
    inst = INSTRUMENTS[nom_i]
    regs = registres(inst)
    res = {}
    for rg in REGISTRES:
        for fig in figures(inst, art):
            for v in VELOCITES:
                res[(rg, fig, v)] = sonie_figure(nom_i, art, v, regs[rg], fig)
    return nom_i, art, res


def gain_articulation(res):
    """Le gain qui met la moyenne des figures à la cible : pour chaque registre et
    chaque figure, la sonie à vélocité 100 est lue sur la droite (sonie contre
    log(vélocité)) qui passe au mieux par les trois mesures, puis comparée à la cible."""
    ecarts = []
    cles = sorted({(rg, fig) for rg, fig, _ in res})
    for rg, fig in cles:
        vs = sorted(v for r, f, v in res if (r, f) == (rg, fig))
        xs = np.log10(np.array(vs) / 100.0)
        ys = np.array([res[(rg, fig, v)] for v in vs])
        b, a = np.polyfit(xs, ys, 1) if len(vs) > 1 else (0.0, ys[0])
        ecarts.append(cible(fig) - a)
    return float(np.mean(ecarts))


def ancienne_mesure(nom_i):
    """Les percussions sans hauteur, les batteries, les sons de conception : la mesure
    d'origine (une frappe, huit croches, un roulement de deux secondes, un motif de
    batterie ; l'ovation, six secondes : elle enfle pendant la note), sa sonie maximale
    sur 400 ms mise à −20 LUFS."""
    inst = INSTRUMENTS[nom_i]
    sortie = {}
    h = int((inst.etendue[0] + inst.etendue[1]) / 2) - 5 if inst.etendue else 60
    for art in inst.articulations:
        if inst.famille == 'batterie':
            jeux = [Jeu(0.2 + 0.25 * i, 0.2, p, 100, art, None, i) for i, p in
                    enumerate(['K', 'H', 'S', 'H', 'K', 'H', 'S', 'H'])]
        elif art in BREVES or art in ('montee', 'impact'):
            if art in ('montee', 'impact', 'frappe') and inst.etendue is None:
                jeux = [Jeu(0.2, 2.0, h, 100, art, None, 0)]
            else:
                jeux = [Jeu(0.2 + 0.25 * i, 0.2, h, 100, art, None, i) for i in range(8)]
        elif art == 'ovation':
            jeux = [Jeu(0.2, 6.0, h, 100, art, None, 0)]
        else:
            jeux = [Jeu(0.2, 2.0, h, 100, art, None, 0)]
        y = inst.rendre(jeux, int((11 if art == 'ovation' else 5) * SR), {'reglages': {}, 'courbes': {}})
        y = dsp.panoramique(y, 0.0, 0.7)
        v = float(dsp.sonie_court_terme(y, fenetre=0.4, pas=0.05).max())
        sortie[art] = round(-20.0 - v, 1)
    return nom_i, sortie


# ---------------------------------------------------------------------------------
# L'orchestration

def _carte(f, taches, travaux):
    """`map` dans l'ordre des tâches (le résultat ne dépend pas du nombre de processus)."""
    if travaux <= 1 or len(taches) <= 1:
        return [f(t) for t in taches]
    import multiprocessing as mp
    with mp.get_context('fork').Pool(travaux) as pool:
        return pool.map(f, taches, chunksize=1)


def _remettre_banques():
    for inst in INSTRUMENTS.values():
        if isinstance(inst, InstrumentSfz):
            inst._banques = {}


def _poser_niveaux(niveaux):
    for inst in INSTRUMENTS.values():
        inst.niveau = 0.0
        inst.niveaux_art = {}
    for cle, v in niveaux.items():
        n, _, a = cle.partition(':')
        if n in INSTRUMENTS:
            INSTRUMENTS[n].niveaux_art[a] = float(v)


def _lire(dossier, nom, defaut):
    try:
        with open(os.path.join(dossier, nom), encoding='utf-8') as f:
            return json.load(f)
    except (OSError, ValueError):
        return defaut


def calibrer(travaux=1, dossier=None, journal=print, instruments=None):
    """Recalcule zones.json puis niveaux.json ; rend (zones, niveaux, mesures, détail des
    zones) où `mesures` = {(instrument, articulation): {(registre, figure, vélocité): LUFS
    calibrée}}. `instruments` : ne recalibrer que ceux-là (un instrument ajouté au
    catalogue), les autres gardent leurs lignes des deux tables."""
    dossier = dossier or ICI
    t0 = time.time()
    choisis = set(instruments or INSTRUMENTS)
    # 1. les zones, mesurées sans correction (celles des instruments recalibrés) ni niveau
    zones = {'echantillons': {}, 'hauteurs': {}}
    if instruments:
        anciennes = _lire(dossier, 'zones.json', {})
        banques = {b for b, i, _ in _banques_a_egaliser() if i in choisis}
        zones['echantillons'] = {b: t for b, t in anciennes.get('echantillons', {}).items() if b not in banques}
        zones['hauteurs'] = {k: t for k, t in anciennes.get('hauteurs', {}).items()
                             if k.partition(':')[0] not in choisis}
    ech.ZONES = {k: dict(v) for k, v in zones.items()}
    _remettre_banques()
    _poser_niveaux({})
    detail = {}
    for b, corr, det in _carte(zones_banque, [t for t in _banques_a_egaliser() if t[1] in choisis], travaux):
        zones['echantillons'][b] = corr
        detail[b] = det
    for cle, table, brut in _carte(zones_hauteurs, [t for t in _instruments_par_hauteur() if t[0] in choisis],
                                   travaux):
        zones['hauteurs'][cle] = table
    journal(f'zones mesurées ({time.time() - t0:.0f} s)')
    # 2. les articulations, les zones posées
    ech.ZONES = zones
    _remettre_banques()
    niveaux = {}
    if instruments:
        niveaux = {k: v for k, v in _lire(dossier, 'niveaux.json', {}).items() if k.partition(':')[0] not in choisis}
        _poser_niveaux(niveaux)
    simples = [n for n in sorted(choisis)
               if not a_hauteur(INSTRUMENTS[n]) and not isinstance(INSTRUMENTS[n], InstrumentCouches)]
    for nom_i, arts in _carte(ancienne_mesure, simples, travaux):
        for a, g in arts.items():
            niveaux[f'{nom_i}:{a}'] = g
    taches = [(n, a) for n in sorted(choisis) if a_hauteur(INSTRUMENTS[n])
              and not isinstance(INSTRUMENTS[n], InstrumentCouches) for a in INSTRUMENTS[n].articulations]
    mesures = {}
    for nom_i, art, res in _carte(mesurer_articulation, taches, travaux):
        g = round(gain_articulation(res), 1)
        niveaux[f'{nom_i}:{art}'] = g
        mesures[(nom_i, art)] = {k: v + g for k, v in res.items()}
    journal(f'articulations mesurées ({time.time() - t0:.0f} s)')
    # 3. les couches, leurs instruments calibrés
    _poser_niveaux(niveaux)
    couches = [(n, a) for n in sorted(choisis) if isinstance(INSTRUMENTS[n], InstrumentCouches)
               for a in INSTRUMENTS[n].articulations]
    for nom_i, art, res in _carte(mesurer_articulation, couches, travaux):
        g = round(gain_articulation(res), 1)
        niveaux[f'{nom_i}:{art}'] = g
        mesures[(nom_i, art)] = {k: v + g for k, v in res.items()}
    _poser_niveaux(niveaux)
    journal(f'couches mesurées ({time.time() - t0:.0f} s)')
    with open(os.path.join(dossier, 'zones.json'), 'w', encoding='utf-8') as f:
        json.dump(zones, f, ensure_ascii=False, indent=1, sort_keys=True)
        f.write(chr(10))
    with open(os.path.join(dossier, 'niveaux.json'), 'w', encoding='utf-8') as f:
        json.dump(niveaux, f, ensure_ascii=False, indent=1, sort_keys=True)
        f.write(chr(10))
    return zones, niveaux, mesures, detail


def mesurer_tout(travaux=1, instruments=None):
    """La sonie en contexte de chaque articulation de chaque instrument à hauteur, avec
    les tables en place (la preuve) : {(instrument, articulation): {(registre, figure,
    vélocité): LUFS}}."""
    noms = instruments or [n for n in sorted(INSTRUMENTS) if a_hauteur(INSTRUMENTS[n])]
    taches = [(n, a) for n in noms for a in INSTRUMENTS[n].articulations]
    return {(n, a): res for n, a, res in _carte(mesurer_articulation, taches, travaux)}


# ---------------------------------------------------------------------------------
# Le rapport

def ecarts(mesures):
    """Par instrument : l'écart entre articulations (pour chaque registre, figure et
    vélocité : la plus forte moins la plus faible) et l'écart sur l'étendue (pour chaque
    articulation, figure et vélocité : le registre le plus fort moins le plus faible)."""
    par_inst = {}
    for (n, a), res in mesures.items():
        par_inst.setdefault(n, {})[a] = res
    sortie = {}
    for n, arts in sorted(par_inst.items()):
        entre = {v: [] for v in VELOCITES}
        cles = {k for res in arts.values() for k in res}
        for rg, fig, v in sorted(cles):
            xs = [res[(rg, fig, v)] for res in arts.values() if (rg, fig, v) in res]
            if len(xs) > 1:
                entre[v].append(max(xs) - min(xs))
        etendue = {}
        for a, res in arts.items():
            par_v = {v: [] for v in VELOCITES}
            for fig in {f for _, f, _ in res}:
                for v in VELOCITES:
                    xs = [res[(rg, fig, v)] for rg in REGISTRES if (rg, fig, v) in res]
                    if len(xs) > 1:
                        par_v[v].append(max(xs) - min(xs))
            etendue[a] = {v: (max(x) if x else 0.0) for v, x in par_v.items()}
        sortie[n] = {'entre': {v: (max(x) if x else 0.0) for v, x in entre.items()}, 'etendue': etendue}
    return sortie


def table_markdown(mesures):
    """La table de la preuve, une ligne par instrument et articulation : la sonie moyenne
    à chaque vélocité (en contexte, toutes figures et tous registres), l'écart sur
    l'étendue à chaque vélocité, et, sur la ligne de l'instrument, l'écart entre ses
    articulations à chaque vélocité."""
    e = ecarts(mesures)
    lignes = ['| Instrument | Articulation | Sonie v64 / v96 / v120 (LUFS, une voix) | '
              'Étendue v64 / v96 / v120 (dB) | Entre articulations v64 / v96 / v120 (dB) |',
              '|---|---|---|---|---|']
    noms = sorted({n for n, _ in mesures})
    for n in noms:
        arts = [a for a in INSTRUMENTS[n].articulations if (n, a) in mesures]
        for i, a in enumerate(arts):
            res = mesures[(n, a)]
            moy = []
            for v in VELOCITES:
                xs = [x - 10 * np.log10(VOIX[f]) for (rg, f, vv), x in res.items() if vv == v]
                moy.append(np.mean(xs))
            et = e[n]['etendue'][a]
            entre = e[n]['entre'] if i == 0 and len(arts) > 1 else None
            lignes.append(f'| {"`" + n + "`" if i == 0 else ""} | {a} | '
                          + ' / '.join(f'{x:.1f}' for x in moy) + ' | '
                          + ' / '.join(f'{et[v]:.1f}' for v in VELOCITES) + ' | '
                          + (' / '.join(f'{entre[v]:.1f}' for v in VELOCITES) if entre else '') + ' |')
    return '\n'.join(lignes)


def en_json(mesures):
    return {f'{n}:{a}': {f'{rg}|{fig}|{v}': round(x, 2) for (rg, fig, v), x in sorted(res.items())}
            for (n, a), res in sorted(mesures.items())}


def depuis_json(d):
    sortie = {}
    for cle, res in d.items():
        n, _, a = cle.partition(':')
        sortie[(n, a)] = {}
        for k, x in res.items():
            rg, fig, v = k.split('|')
            sortie[(n, a)][(rg, fig, int(v))] = x
    return sortie


def resume_zones(detail):
    """Une ligne par banque : l'étendue des corrections, et combien touchent la borne."""
    lignes = []
    for b, det in sorted(detail.items()):
        cs = [c for *_, cc, cl in det for c in (cc, cl)]
        ms = [s for *_, s, _, _ in det]
        n_borne = sum(1 for c in cs if abs(c) >= BORNE_ZONE - 0.05)
        lignes.append(f'{b:58s} {len(det):4d} régions  sonie tenue {min(ms):+6.1f}..{max(ms):+6.1f}  '
                      f'correction {min(cs):+5.1f}..{max(cs):+5.1f}' + (f'  ({n_borne} à la borne)' if n_borne else ''))
    return '\n'.join(lignes)


def nom_hauteur(h):
    return nom_note(h)
