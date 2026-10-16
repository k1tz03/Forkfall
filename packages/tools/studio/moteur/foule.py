"""La foule du stade : deux instruments fabriqués avec ce qui est installé, à graine fixe.

- `foule` : des milliers d'hommes qui chantent à l'unisson, sur « o » ou sur « ah », de
  loin, dans un stade. Dix prises du chœur de la banque générale (chacune rendue une
  fois : désaccordée de quelques cents, une lente dérive de hauteur, des attaques
  décalées de dizaines de millisecondes, une couleur de voyelle différente par un
  filtre, un niveau différent ; deux voix qui se passent la ligne, pour que la queue
  du chœur ne traîne pas sous la note suivante), chacune posée deux fois dans l'image
  (un second rang plus loin, de l'autre côté) : vingt pupitres de supporters. Puis les
  formants d'une voix d'homme, la distance (l'air mange les aigus), le stade (de longues
  premières réflexions sur les tribunes, la tribune d'en face, le ciel ouvert : une
  queue courte et sombre, pas de cathédrale ; discret, pour que la ligne se lise) et,
  sous le chant, la rumeur : le souffle et le grondement de la foule, un bruit mis en
  forme qui enfle et retombe lentement et suit la nuance des notes. `rumeur` ne garde
  que la rumeur.
- `applaudissements` : une tribune qui frappe dans ses mains. `mesure` : chaque note est
  un coup de toute la tribune (quarante-huit mains, chacune à sa place dans l'image, avec
  son claquement à elle, son avance ou son retard, ± 30 ms) ; `ovation` : des
  applaudissements sans pulsation qui enflent pendant la note (chacun à son rythme, les
  mains qui arrivent, puis qui s'arrêtent une à une), avec la clameur dessous.

Le coût reste borné : vingt rendus d'une voix de chœur pour la foule (pas des centaines
de voix), sur la seule durée où elle chante ; une banque de quarante claquements calculée
une fois et rejouée."""
from functools import lru_cache

import numpy as np
from scipy import signal
from scipy.ndimage import uniform_filter1d

from . import dsp, echantillonneur as ech, noyau, synthe
from .dsp import SR
from .fluide import Synthe
from .sources import chemin

GRAINE = 1907                   # les tirages fixes des deux instruments (places, timbres)
CLAPS = 'communautaire/Idiophones/Struck Idiophones/Claps.sfz'
# la voyelle de la foule : les deux premiers formants d'une voix d'homme (« o » : 450 et
# 850 Hz ; « ah » : 700 et 1 150 Hz), renforcés sur le chœur entier
VOYELLES = {'o': {'cloches': [(450, 3.0, 1.0), (850, 2.0, 1.2)], 'aigu': (-3.0, 2500)},
            'ah': {'cloches': [(700, 3.0, 1.0), (1150, 2.0, 1.2)], 'aigu': (-1.5, 3000)}}
# la foule qui chante : le désaccord des prises (± cents), leur dérive lente (± cents),
# leur retard (s), le flottement des attaques d'une note à l'autre (écart type, s), le
# retard du second rang (s, au plus) ; au-delà, la ligne se brouille (le test du
# téléphone, audition.py --telephone : avec 40 ms de retard et 65 ms de second rang, la
# moitié des croches se lisaient sur la note d'avant)
DESACCORD = 8.0
DERIVE = 4.0
RETARD = 0.025
FLOTTEMENT = 0.008
RANG2 = 0.03
# le stade : le niveau de chaque groupe de réflexions (proches, lointaines, la tribune
# d'en face), la durée de la queue, la part du son direct et celle du stade : un stade
# plus présent garde la note d'avant sous la suivante (4 croches sur 14 mal lues au
# téléphone avec le stade à part égale du direct)
REFLEXIONS = (0.7, 0.35, 0.12)
QUEUE_S = 1.0
DIRECT = 1.0
MOUILLE = 0.3


# ---------------------------------------------------------------------------------
# Le stade

@lru_cache(maxsize=4)
def reponse_stade(graine=GRAINE, reflexions=REFLEXIONS, queue_s=QUEUE_S):
    """La réponse d'un stade (stéréo, ≈ 2,4 s) : des réflexions discrètes et espacées (le
    toit et les tribunes proches, 15 à 90 ms ; les tribunes lointaines, 90 à 300 ms ; la
    tribune d'en face, 300 à 650 ms, plus faible : elle répéterait la note d'avant sur la
    suivante), de plus en plus sombres ; une queue diffuse courte et basse (le ciel
    ouvert : `queue_s`, rien sous 180 Hz, rien au-dessus de 3 kHz)."""
    rng = np.random.default_rng(graine)
    n = int(2.4 * SR)
    t = np.arange(n) / SR
    sortie = np.zeros((n, 2), dtype=np.float64)
    groupes = ((12, 0.015, 0.09, 7000.0), (14, 0.09, 0.30, 4000.0), (10, 0.30, 0.65, 2200.0))
    for c in range(2):
        for (k, a, b, fc), niveau in zip(groupes, reflexions):
            imp = np.zeros(n)
            temps = np.sort(rng.uniform(a, b, k))
            gains = niveau * rng.uniform(0.3, 1.0, k) * np.exp(-temps / 0.3) * rng.choice([-1.0, 1.0], k)
            np.add.at(imp, (temps * SR).astype(int), gains)
            sortie[:, c] += signal.sosfilt(signal.butter(2, fc, 'lowpass', fs=SR, output='sos'), imp)
        e_premieres = np.sum(sortie[:, c] ** 2)
        queue = rng.standard_normal(n) * np.exp(-6.9 * t / queue_s)
        queue *= np.clip((t - 0.06) / 0.15, 0, 1)
        queue = signal.sosfilt(signal.butter(2, [180.0, 3000.0], 'bandpass', fs=SR, output='sos'), queue)
        queue *= np.sqrt(0.5 * e_premieres / max(np.sum(queue ** 2), 1e-12))
        sortie[:, c] += queue
    sortie /= np.sqrt(np.sum(sortie ** 2) / 2)
    fondu = int(0.05 * SR)
    sortie[-fondu:] *= np.linspace(1, 0, fondu)[:, None]
    return sortie.astype(np.float32)


def au_loin(x, sec=None, stade=None):
    """La distance : l'air mange les aigus, le stade répond ; `sec` : la part du son
    direct, `stade` : celle du stade (DIRECT et MOUILLE par défaut)."""
    proche = dsp.egaliseur(x, {'aigu': (-7.0, 2500), 'passe_bas': 7000})
    mouille = dsp.convoluer(proche, reponse_stade(GRAINE, REFLEXIONS, QUEUE_S), croise=0.4)
    return (proche * np.float32(DIRECT if sec is None else sec) +
            mouille * np.float32(MOUILLE if stade is None else stade)).astype(np.float32)


def _houle(n, graine, vitesse=0.22, profondeur_db=3.0):
    """Une lente houle aléatoire (un gain autour de 1, ± `profondeur_db`)."""
    rng = np.random.default_rng(graine)
    pas = max(1, int(SR / vitesse / 4))
    points = rng.uniform(-1.0, 1.0, n // pas + 3)
    x = np.interp(np.arange(n) / pas, np.arange(len(points)), points)
    return dsp.gain(profondeur_db * x).astype(np.float32)


def _enveloppe_notes(n, jeux, a0, montee=0.5, descente=2.5, apres=1.5, plancher=0.0):
    """Le niveau d'une foule qui suit les notes : (v/127)² pendant la note et `apres`
    secondes de plus, lissé (monte en `montee`, retombe en `descente` secondes)."""
    cible = np.full(n, plancher, dtype=np.float32)
    for j in jeux:
        a = max(0, int((j.t - a0) * SR))
        b = min(n, int((j.t + j.d + apres - a0) * SR))
        if b > a:
            cible[a:b] = np.maximum(cible[a:b], (j.v / 127.0) ** 2)
    c_m = 1.0 - np.exp(-1.0 / (montee * SR))
    c_d = 1.0 - np.exp(-1.0 / (descente * SR))
    return noyau.lisse(cible, c_m, c_d, 0.0)


def rumeur(n, jeux, a0, graine):
    """La rumeur de la foule (stéréo, avant le stade) : un grondement de voix et de
    souffles (un bruit rosé, des bosses à 350 Hz et 900 Hz, peu au-dessus de 1,5 kHz), un
    souffle léger plus haut, une houle lente, le niveau des notes."""
    rng = np.random.default_rng(graine)
    b = rng.standard_normal((n, 2)).astype(np.float32)
    gronde = dsp.egaliseur(b, {'passe_haut': 110, 'passe_bas': 1000,
                               'cloches': [(300, 5.0, 0.8), (650, 2.0, 1.2)]})
    souffle = dsp.egaliseur(rng.standard_normal((n, 2)).astype(np.float32),
                            {'passe_haut': 2200, 'passe_bas': 6000}) * np.float32(0.05)
    houle = _houle(n, graine + 1)
    env = _enveloppe_notes(n, jeux, a0, plancher=0.0)
    return ((gronde + souffle) * (houle * env)[:, None]).astype(np.float32)


# ---------------------------------------------------------------------------------
# La foule qui chante

def _prises(art):
    """Les dix prises de la foule (tirées une fois) : programme du chœur (« ouh » 53,
    « aah » 52 : la voyelle demandée en majorité, l'autre pour l'épaisseur), désaccord
    (cents), retard (s), niveau (dB), place, la voyelle (une cloche de formant et une
    pente d'aigus), le second rang (retard, place, niveau)."""
    rng = np.random.default_rng(GRAINE + (0 if art == 'o' else 1))
    principal, autre = ((0, 53), (0, 52)) if art == 'o' else ((0, 52), (0, 53))
    prises = []
    for k in range(10):
        prises.append({
            'programme': principal if k % 10 not in (3, 7) else autre,
            'cents': float(rng.uniform(-1.0, 1.0)) * DESACCORD,
            'retard': float(rng.uniform(0.0, 1.0)) * RETARD,
            'niveau': float(rng.uniform(-2.5, 1.0)),
            'place': float(rng.uniform(-0.85, 0.85)),
            'formant': (float(np.exp(rng.uniform(np.log(450.0), np.log(2400.0)))), float(rng.uniform(-4.0, 4.0))),
            'pente': float(rng.uniform(-3.0, 1.5)),
            'rang2': (float(rng.uniform(0.4, 1.0)) * RANG2, float(rng.uniform(0.5, 1.0)), float(rng.uniform(-4.0, -1.0))),
            'graine': int(rng.integers(1 << 30)),
        })
    return prises


def _derive(n, graine, cents=None, toutes=0.04):
    """La dérive lente d'une prise (cents), un point toutes les `toutes` secondes."""
    cents = DERIVE if cents is None else cents
    rng = np.random.default_rng(graine)
    secondes = n / SR
    points = rng.uniform(-1.0, 1.0, int(secondes / 1.7) + 3)
    ts = np.arange(0, secondes, toutes)
    return cents * np.interp(ts / 1.7, np.arange(len(points)), points)


ETOUFFE = 0.12          # s : la voix qui passe la main s'éteint en 0,12 s
APRES_ATTAQUE = 0.03    # s : après l'attaque de la note suivante


def _grappes(jeux):
    """Les notes regroupées par attaque (à 30 ms près : un accord, une humanisation) :
    [(instant, [notes])], dans l'ordre."""
    sortie = []
    for j in sorted(jeux, key=lambda j: (j.t, j.h)):
        if sortie and j.t - sortie[-1][0] <= 0.03:
            sortie[-1][1].append(j)
        else:
            sortie.append((j.t, [j]))
    return sortie


def _etouffoir(m, grappes, parite, decalage):
    """Le gain de l'une des deux voix d'une prise (les grappes de rang pair, ou impair) :
    elle sonne pendant ses notes ; quand la grappe suivante attaque, elle s'éteint en
    ETOUFFE secondes, et se tait jusqu'à sa grappe d'après. Avant un silence, la queue
    naturelle est gardée. `decalage` : l'instant (s) que porte le début du tampon de la
    prise (son retard et l'avance d'attaque déjà comptés)."""
    g = np.ones(m, dtype=np.float32)
    nf = int(ETOUFFE * SR)
    nr = int(0.01 * SR)
    fondu = (np.cos(np.linspace(0, np.pi / 2, nf)) ** 2).astype(np.float32)
    for i, (tg, notes) in enumerate(grappes):
        if i % 2 != parite or i + 1 >= len(grappes):
            continue
        t_suiv = grappes[i + 1][0]
        if t_suiv > max(j.t + j.d for j in notes) + 0.5:
            continue
        a = max(0, int((t_suiv - decalage + APRES_ATTAQUE) * SR))
        if a >= m:
            continue
        e = min(m, a + nf)
        g[a:e] = np.minimum(g[a:e], fondu[:e - a])
        b = int((grappes[i + 2][0] - decalage) * SR) - nr if i + 2 < len(grappes) else m
        if b > e:
            g[e:b] = 0.0
            if b < m:
                g[b:b + nr] = np.minimum(g[b:b + nr], np.linspace(0, 1, min(nr, m - b), dtype=np.float32))
    return g


class InstrumentFoule:
    """Le moteur de rendu de `foule` (voir le haut du fichier) ; la classe d'instrument
    du catalogue l'appelle (instruments.InstrumentFoule)."""

    @staticmethod
    def chant(inst, jeux, n, ctx, art, zone):
        """La foule qui chante `jeux` (articulation 'o' ou 'ah') : stéréo, n échantillons,
        rumeur et stade compris. `zone(h, programme, vélocité)` : la correction de zone (dB)."""
        sortie = np.zeros((n, 2), dtype=np.float32)
        if not jeux:
            return sortie
        a0 = max(0.0, min(j.t for j in jeux) - 0.3)
        b0 = max(j.t + j.d for j in jeux) + 4.0
        a = int(a0 * SR)
        m = min(n, int(b0 * SR)) - a
        if m <= 0:
            return sortie
        syn = Synthe.pour('generale')
        chant = np.zeros((m, 2), dtype=np.float32)
        grappes = _grappes(jeux)
        avance = inst.avance.get(art, 0.0)
        for k, p in enumerate(_prises(art)):
            derive = [(0, 'sens', 0, 2, 0)]
            pas = int(0.04 * SR)
            for i, d in enumerate(_derive(m, p['graine'])):
                pb = int(np.clip(8192 + (p['cents'] + d) / 200.0 * 8192, 0, 16383))
                derive.append((i * pas, 'pb', 0, 0, pb))
            gains = np.zeros(m, dtype=np.float32)
            poids = np.zeros(m, dtype=np.float32)
            # deux voix qui se passent la ligne (les grappes paires, les impaires) : chacune
            # se tait quand l'autre attaque, la note d'avant ne traîne pas sous la suivante
            # (la queue du chœur de la banque dure une demi-seconde)
            voix = []
            for parite in (0, 1):
                evs = list(derive)
                for i, (tg, notes) in enumerate(grappes):
                    if i % 2 != parite:
                        continue
                    for j in notes:
                        rng = np.random.default_rng(synthe.graine_note('foule', k, j.rang))
                        dt = p['retard'] + float(np.clip(rng.normal(0, FLOTTEMENT), -2.5 * FLOTTEMENT,
                                                         2.5 * FLOTTEMENT))
                        v = int(np.clip(j.v + rng.integers(-8, 9), 1, 127))
                        t0 = int(round((j.t - a0 + dt - avance) * SR))
                        t1 = t0 + max(64, int(j.d * SR))
                        if 0 <= t0 < m:
                            evs.append((t0, 'on', 0, int(round(j.h)), v))
                            evs.append((min(t1, m - 1), 'off', 0, int(round(j.h)), 0))
                            fin = min(m, t1 + int(0.4 * SR))
                            gains[max(0, t0):fin] += np.float32(dsp.gain(zone(j.h, p['programme'], j.v)))
                            poids[max(0, t0):fin] += 1.0
                y = syn.rendre(evs, m, {0: p['programme']})
                voix.append(y * _etouffoir(m, grappes, parite, a0 - p['retard'] + avance)[:, None])
            y = voix[0] + voix[1]
            # la correction de zone de la note qui sonne (une foule chante à l'unisson)
            g = np.where(poids > 0, gains / np.maximum(poids, 1e-6), 1.0).astype(np.float32)
            g = uniform_filter1d(g, size=int(0.03 * SR), mode='nearest')
            y = y * g[:, None]
            f, gf = p['formant']
            y = dsp.egaliseur(y, {'cloches': [(f, gf, 1.2)], 'aigu': (p['pente'], 3000)})
            mono = y.mean(axis=1)
            niveau = float(dsp.gain(p['niveau'])) / np.sqrt(20.0)
            for retard, place, g_db in ((0.0, p['place'], 0.0),
                                        (p['rang2'][0], -p['place'] * p['rang2'][1], p['rang2'][2])):
                r = int(retard * SR)
                th = (place + 1) * np.pi / 4
                gg = niveau * float(dsp.gain(g_db)) * np.sqrt(2.0)
                chant[r:, 0] += mono[:m - r] * np.float32(gg * np.cos(th))
                chant[r:, 1] += mono[:m - r] * np.float32(gg * np.sin(th))
        chant = dsp.egaliseur(chant, VOYELLES[art])
        lit = rumeur(m, jeux, a0, synthe.graine_note('rumeur', ctx.get('graine'), ctx.get('piste'),
                                                      ctx.get('segment'), art))
        tout = chant + lit * np.float32(dsp.gain(inst.rumeur_db))
        sortie[a:a + m] = au_loin(tout)
        return sortie

    @staticmethod
    def rumeur_seule(inst, jeux, n, ctx):
        sortie = np.zeros((n, 2), dtype=np.float32)
        if not jeux:
            return sortie
        a0 = max(0.0, min(j.t for j in jeux) - 0.5)
        b0 = max(j.t + j.d for j in jeux) + 5.0
        a = int(a0 * SR)
        m = min(n, int(b0 * SR)) - a
        if m <= 0:
            return sortie
        lit = rumeur(m, jeux, a0, synthe.graine_note('rumeur', ctx.get('graine'), ctx.get('piste'),
                                                      ctx.get('segment'), 'rumeur'))
        sortie[a:a + m] = au_loin(lit)
        return sortie


# ---------------------------------------------------------------------------------
# Les applaudissements

@lru_cache(maxsize=1)
def claquements():
    """Quarante claquements de mains (stéréo identique, énergie égale), tirés une fois des
    échantillons de la bibliothèque communautaire (quatre mains seules, six groupes) :
    chacun transposé (la taille des mains), filtré (des mains creuses ou plates), coupé à
    0,4 s."""
    b = ech.Banque(chemin(CLAPS), nom=CLAPS)
    seules = [r for r in b.regions if r.lokey == 61]
    groupes = [r for r in b.regions if r.lokey == 60]
    rng = np.random.default_rng(GRAINE + 7)
    sortie = []
    for k in range(40):
        r = (seules[k % len(seules)] if rng.random() < 0.7 else groupes[k % len(groupes)])
        e = ech.charger(r.echantillon)
        x = e.donnees[max(0, e.attaque - int(0.002 * SR)):].mean(axis=1)
        x = x[:int(0.6 * SR)]
        x = dsp.reechantillonner(x, 2.0 ** (rng.uniform(-2.5, 3.0) / 12.0))
        x = dsp.egaliseur(x, {'passe_haut': float(rng.uniform(150.0, 500.0)),
                               'passe_bas': float(rng.uniform(3500.0, 9000.0)),
                               'cloches': [(float(rng.uniform(900.0, 2500.0)), float(rng.uniform(-4.0, 5.0)), 1.4)]})
        x = np.asarray(x[:int(0.4 * SR)], dtype=np.float32)
        nf = int(0.04 * SR)
        x[-nf:] *= np.linspace(1, 0, nf, dtype=np.float32)
        x /= np.float32(np.sqrt(np.mean(x ** 2)) + 1e-9)
        sortie.append(x * np.float32(dsp.gain(float(rng.uniform(-3.0, 3.0)))))
    return sortie


def _mains(n_mains, graine):
    """Les places de la tribune : (claquement, place, niveau, avance ou retard propre)."""
    rng = np.random.default_rng(graine)
    return [(int(rng.integers(40)), float(rng.uniform(-0.9, 0.9)), float(dsp.gain(rng.uniform(-4.0, 1.0))),
             float(np.clip(rng.normal(0.0, 0.009), -0.02, 0.02))) for _ in range(n_mains)]


def _poser(dest, x, pos, g, place):
    th = (place + 1) * np.pi / 4
    a = max(0, pos)
    b = min(len(dest), pos + len(x))
    if b <= a:
        return
    m = x[a - pos:b - pos]
    dest[a:b, 0] += m * np.float32(g * np.cos(th) * np.sqrt(2))
    dest[a:b, 1] += m * np.float32(g * np.sin(th) * np.sqrt(2))


def applaudir_mesure(jeux, n):
    """Chaque note : un coup de toute la tribune (48 mains, ± 30 ms, une main sur
    vingt-cinq se tait parfois)."""
    sortie = np.zeros((n, 2), dtype=np.float32)
    banque = claquements()
    mains = _mains(48, GRAINE + 11)
    for j in jeux:
        rng = np.random.default_rng(synthe.graine_note('mesure', j.rang))
        g_note = (j.v / 127.0) ** 2 / np.sqrt(len(mains))
        for c, place, g, propre in mains:
            if rng.random() < 0.04:
                continue
            dt = float(np.clip(propre + rng.normal(0.0, 0.007), -0.03, 0.03))
            _poser(sortie, banque[c], int(round((j.t + dt) * SR)), g * g_note, place)
    return sortie


def applaudir_ovation(jeux, n, graine):
    """Chaque note : une ovation qui enfle (les mains arrivent dans la première seconde
    et demie, chacune à son rythme, 3,2 à 5,8 claquements par seconde), tient, puis
    s'éteint main par main dans les 2,5 s après la note ; la clameur dessous."""
    sortie = np.zeros((n, 2), dtype=np.float32)
    banque = claquements()
    for j in jeux:
        rng = np.random.default_rng(synthe.graine_note('ovation', j.rang, graine))
        mains = _mains(64, GRAINE + 13)
        g_note = (j.v / 127.0) ** 2 / np.sqrt(len(mains) * 4.5 * 0.4)
        for c, place, g, _ in mains:
            t = j.t + rng.uniform(0.0, 1.6)
            fin = j.t + j.d + rng.uniform(0.0, 2.5)
            periode = 1.0 / rng.uniform(3.2, 5.8)
            k = 0
            while t < fin:
                # l'ovation enfle : les premières frappes de chacun sont plus douces
                monte = min(1.0, 0.45 + 0.55 * (t - j.t) / 2.0)
                _poser(sortie, banque[(c + k % 3) % len(banque)], int(round(t * SR)), g * g_note * monte, place)
                t += periode * rng.uniform(0.88, 1.12)
                k += 1
        # la clameur : un « ah » de foule, large, qui enfle avec l'ovation
        a = max(0, int(j.t * SR))
        m = min(n, int((j.t + j.d + 3.0) * SR)) - a
        if m > 0:
            b = rng.standard_normal((m, 2)).astype(np.float32)
            clameur = dsp.egaliseur(b, {'passe_haut': 250, 'passe_bas': 3500,
                                        'cloches': [(700, 5.0, 1.0), (1200, 3.0, 1.2)]})
            tt = np.arange(m) / SR
            env = np.clip(tt / 1.8, 0, 1) ** 1.5 * np.where(tt < j.d, 1.0, np.exp(-(tt - j.d) / 0.9))
            env = env * _houle(m, int(rng.integers(1 << 30)), vitesse=0.3, profondeur_db=2.0)
            sortie[a:a + m] += clameur * np.float32((j.v / 127.0) ** 2 * 0.35) * env[:, None].astype(np.float32)
    return sortie
