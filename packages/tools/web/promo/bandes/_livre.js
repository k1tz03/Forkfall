/* ═══════════════════════════════════════════════════════════════════════════
   LA FABRIQUE D'UNE BANDE DE LIVRE — les livres 2 à 10, sur le patron du livre 1.
   Une bande de livre se décrit en paramètres (bandes/modele_livre.js, à copier) :
   le livre, la graine, ses deux extraits de film, trois cartes du livre, deux lieux,
   le thème et ses mesures, huit légendes. La fabrique en tire les moments à tourner,
   le montage d'une minute (et l'aperçu de l'App Store), les dix captures.

   Le montage (une minute, coupé sur les mesures du thème du livre) :
     1  le film A (son ouverture)             la promesse                (P.legendes.promesse)
     2  l'introduction jouée (le titre néon)  l'année, le rôle           (P.legendes.intro)
     3  la première carte, glissée            le personnage               (P.legendes.carte)
     4  la ville, le jour                     le monde                    (P.legendes.ville)
     5  une carte du livre (deux)             —
     6  le film A (sa suite)                  l'objet du livre            (P.legendes.objet)
     7  la ville, la nuit                     la menace                   (P.legendes.nuit)
     8  une carte du livre (trois), glissée   le choix                    (P.legendes.choix)
     9  le film B                             —
    10  le samedi à la Rive                   —
    11  le film B (sa suite)                  la dernière ligne           (P.legendes.fin)
    12  la fin : le titre au néon, le livre, le logo, la disponibilité
   Chaque coupe tombe sur la barre de mesure la plus proche de son temps visé (`visees`) ; la
   fin prend ce qui reste. L'App Store : 2, 3, 6 (le film A), 8, 11 (le film B), la cartouche.

   La musique se change d'une commande : les barres viennent de la source qui servira — le master
   du studio du thème s'il est dans `--musique-studio` (FUSIBLE_MUSIQUE_STUDIO), sinon le banc
   (la partition synthétisée). Sans `morceaux`, la bande part du début du thème et dure ~60 s de
   mesures entières, l'aperçu ≤ 29 s ; `morceaux` (le banc) et `studio.morceaux` (le master)
   choisissent des sections. Les moments, eux, ne dépendent pas de la musique : chacun se tourne
   assez long pour son plan visé et une mesure lente de plus (`marge`) — un master plus lent que
   le banc n'y fige jamais une dernière image, et changer de musique ne demande pas de retourner.
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const { depart, enVille, devant, auStade } = require('./_communs');
const MU = require('../lib/musique');

// des durées visées (secondes, en proportion) → des mesures par plan : chaque coupe sur la barre la
// plus proche de son temps visé (au moins une mesure par plan) ; `barres` : le temps de chaque barre
function enMesures(cibles, barres) {
  const total = barres.length - 1, T = barres[total];
  const somme = cibles.reduce((a, b) => a + b, 0);
  const n = [];
  let prec = 0, cumul = 0;
  for (let k = 0; k < cibles.length - 1; k++) {
    cumul += cibles[k];
    const vise = cumul / somme * T, min = prec + 1, max = total - (cibles.length - 1 - k);
    let best = Math.min(min, max);
    for (let i = min; i <= max; i++) if (Math.abs(barres[i] - vise) < Math.abs(barres[best] - vise)) best = i;
    n.push(best - prec);
    prec = best;
  }
  n.push(total - prec);
  if (n.some((x) => x < 1)) throw new Error('livre : trop peu de mesures (' + total + ') pour ' + cibles.length + ' plans');
  return n;
}

module.exports = function bandeDeLivre(P) {
  const L = P.legendes || {};
  const ECRAN = { '9x16': 'ecran', '16x9': { mode: 'ecran' }, '4x5': 'ecran' };
  const VILLE = { '16x9': { mode: 'ecran' } };
  // (sur un film en 16:9, la légende en haut : la trousse du cinéma pose son carton de lieu en bas à
  // gauche et ses répliques en bas au milieu ; en portrait, son carton de lieu est en haut à gauche —
  // une bande en éloigne sa légende par `de`, `a` ou `position`, extrait par extrait)
  const A_DROITE = { '16x9': 'droite' }, FILM_BAS = { '16x9': 'haut' };
  const leg = (x, pos) => (x ? Object.assign({ position: pos }, typeof x === 'string' ? { titre: x } : x) : undefined);
  const G = P.graine, I = P.index;
  // (la carte seule : une scène jouée « avant la carte » la couvre d'abord — l'automate la passe)
  const aCarte = (prefixe, sens, sauter) => depart(I, G).concat([['avancer', 'v.card.id.indexOf(' + JSON.stringify(prefixe) + ') === 0', { reponses: sens || 'gauche', saute: sauter || 0 }],
    ['jouerJusqua', 'etat.carte && !etat.cine && !etat.fondu', { max: 180 }], ['attendre', 1.2]]);

  // ─── la musique d'abord : la source qui servira (le master du studio, sinon le banc), ses barres
  const studio = !!MU.masterDe(P.theme);
  const DUREE = P.duree || 60, DUREE_COURT = P.dureeCourt || 29;
  const S = (studio && P.studio) || {};
  const morceaux = (studio ? S.morceaux : P.morceaux) || [{ depuis: null, de: 0, a: MU.mesuresPour(P.theme, DUREE) }];
  const debutCourt = (studio ? S.debutCourt : P.debutCourt) || 0;
  const morceauxCourt = (studio ? S.morceauxCourt : P.morceauxCourt) ||
    [{ depuis: null, de: debutCourt, a: debutCourt + MU.mesuresPour(P.theme, DUREE_COURT, { de: debutCourt, auPlus: true }) }];
  const musiqueLong = { theme: P.theme, morceaux, fondu: { sortie: 2.6 } };
  const musiqueCourt = { theme: P.theme, morceaux: morceauxCourt, fondu: { sortie: 2.0 } };
  const B = MU.carteMusique(musiqueLong).barres, Bc = MU.carteMusique(musiqueCourt).barres;
  const visees = P.visees || [3.5, 4.5, 4, 4.5, 4, 3.5, 4.5, 4, 3.5, 3.5, 3.5, 6.5];
  const n = enMesures(visees, B), nc = enMesures([4, 4, 4, 4, 4, 4, 4], Bc);
  const d = (k) => n[k] + 'm';
  // la durée d'un plan dans cette musique (secondes)
  const bornes = n.reduce((a, x) => a.concat(a[a.length - 1] + x), [0]);
  const duree = (k) => B[bornes[k + 1]] - B[bornes[k]];

  // ─── la longueur des moments, sans la musique : le plan visé, plus une mesure lente (`marge`)
  const MARGE = P.marge == null ? 3.0 : P.marge;
  const somme = visees.reduce((a, b) => a + b, 0);
  const s = (k) => visees[k] / somme * DUREE + MARGE, sc = () => DUREE_COURT / 7 + MARGE;
  // l'attente qui finit un moment : `deja` secondes tournées avant elle ; le plan le plus long part de
  // `de` dans le moment ; 0,2 s de marge
  const reste = (min, deja, de, ...plans) => +Math.max(min, Math.max(...plans) + de + 0.2 - deja).toFixed(2);
  const GLISSE = 1.6;   // un glissé (geste, tenue, lâcher)
  const LX = P.lieux || {};

  // ─── les moments
  const moments = [
    { id: 'intro', profils: ['social', 'appstore', 'apple'], heros: P.heros, prepare: [['attendre', 0.3]],
      tournage: [['demarrer', I, G], ['attendreQue', 'etat.cine', 30], ['attendre', 1.4], ['pose', 'titre'], ['attendre', 1.0],
        ['scene', P.repliques || 1], ['attendreQue', 'etat.boiteFinie', 15], ['attendre', 0.8], ['pose', 'scene'], ['attendre', reste(1.6, 4.0, 0.4, s(1), sc(0))]] },
    { id: 'carte1', profils: ['social', 'appstore', 'apple'], heros: P.heros, prepare: depart(I, G).concat([['attendre', 1.2]]),
      // le temps de lire la carte avant le geste ; après, une seconde de ce qu'il produit
      tournage: [['attendre', reste(1.1, GLISSE + 1.0, 0.25, s(2), sc(1))], ['pose', 'carte'],
        ['glisser', P.sens1 || 'gauche', { duree: 0.85, ampleur: 0.46, tenue: 0.5, pose: 'glisse' }], ['attendre', 1.0]] },
    // (la ville sans ses bulles d'aide : l'aide de la première semaine, l'écho d'une réponse)
    { id: 'jour', profils: ['social', 'apple'], heros: P.heros,
      prepare: enVille(I, G).concat([['tranche', LX.trancheJour || 'aprem']], devant(LX.jour), [['zoom', 3], ['cacher', '#villeToast, #echoLigne'], ['attendre', 1.8]]),
      tournage: [['attendre', 0.5], ['touche', LX.toucheJour || 'ArrowDown', 1, 1.2], ['pose', 'jour'], ['attendre', reste(2.0, 1.7, 0.3, s(3))]] },
    { id: 'carte2', profils: ['social', 'apple'], heros: P.heros, prepare: aCarte(P.cartes.deux, P.cartes.sens, P.cartes.sauteDeux),
      tournage: [['attendre', 1.6], ['pose', 'carte'], ['attendre', reste(2.4, 1.6, 0.4, s(4))]] },
    { id: 'nuit', profils: ['social', 'appstore', 'apple'], heros: P.heros,
      prepare: enVille(I, G).concat([['tranche', 'nuit']], devant(LX.nuit), [['zoom', 3], ['cacher', '#villeToast, #echoLigne'], ['attendre', 1.8]]),
      tournage: [['attendre', 0.6], ['touche', LX.toucheNuit || 'ArrowRight', 1, 1.4], ['pose', 'nuit'], ['attendre', reste(2.0, 2.0, 0.3, s(6), sc(3))]] },
    { id: 'carte3', profils: ['social', 'appstore', 'apple'], heros: P.heros, prepare: aCarte(P.cartes.trois, P.cartes.sens, P.cartes.sauteTrois),
      tournage: [['attendre', reste(1.2, GLISSE + 1.0, 0.3, s(7), sc(4))], ['pose', 'carte'],
        ['glisser', P.cartes.sensTrois || 'gauche', { duree: 0.8, ampleur: 0.44, tenue: 0.5, pose: 'glisse' }], ['attendre', 1.0]] },
    // (la carte du match peut sortir sous le fondu de la ville qui va au stade : le doigt toucherait le
    // fondu et sélectionnerait le texte — mesuré aux livres 5 et 8 ; on attend qu'il se lève)
    { id: 'stade', profils: ['social', 'apple'], heros: P.heros, prepare: auStade(I, G).concat([['attendreQue', '!etat.fondu && !etat.cine', 20], ['attendre', 0.6]]),
      // le plan part 2,4 s avant la pose
      tournage: [['attendre', 0.6], ['glisser', 'gauche', { duree: 0.6, ampleur: 0.45 }], ['attendre', 3.2], ['pose', 'stade'], ['attendre', reste(2.0, 2.4, 0, s(9))]] },
    { id: 'accueil', profils: ['appstore', 'apple', 'google'], heros: P.heros, profil: { runs: 1 }, prepare: [['attendre', 1.6]],
      // le dernier plan de l'aperçu part 1,6 s avant la pose
      tournage: [['attendre', 0.8], ['defiler', '#postulats .postulat[data-index="' + I + '"]', { duree: 1.0, marge: 96 }], ['attendre', 1.2], ['pose', 'cartouche'],
        ['attendre', reste(2.6, 1.6, 0, sc(6))]] },
  ];
  // une bande peut retoucher un moment (ses étapes, ses profils) : `moments: { jour: { prepare: […] } }`
  for (const m of moments) if (P.moments && P.moments[m.id]) Object.assign(m, P.moments[m.id]);

  // ─── le montage d'une minute
  // la suite d'un extrait reprend où son premier plan l'a laissé — ou plus tôt, pour finir avec
  // l'extrait (6 à 8 s) plutôt que de figer sa dernière image
  const A = P.extraits.a, Bx = P.extraits.b;
  const suite = (X, k1, k2) => (X.de || 0) + Math.max(0, Math.min(duree(k1), (X.duree || 7) - duree(k2)));
  const dA2 = A.suite != null ? A.suite : suite(A, 0, 5), dB2 = Bx.suite != null ? Bx.suite : suite(Bx, 8, 10);
  const plans = [
    { duree: d(0), source: { film: 'a', de: A.de || 0 }, entree: 'noir', transition: 0.5, legende: leg(L.promesse, FILM_BAS) },
    { duree: d(1), source: { moment: 'intro', de: 0.4 }, cadre: VILLE, legende: leg(L.intro, A_DROITE) },
    { duree: d(2), source: { moment: 'carte1', de: 0.25 }, cadre: ECRAN, legende: leg(L.carte, A_DROITE) },
    { duree: d(3), source: { moment: 'jour', de: 0.3 }, cadre: VILLE, legende: leg(L.ville, A_DROITE) },
    { duree: d(4), source: { moment: 'carte2', de: 0.4 }, cadre: ECRAN },
    { duree: d(5), source: { film: 'a', de: dA2 }, legende: leg(L.objet, FILM_BAS) },
    { duree: d(6), source: { moment: 'nuit', de: 0.3 }, cadre: VILLE, legende: leg(L.nuit, A_DROITE) },
    { duree: d(7), source: { moment: 'carte3', de: 0.3 }, cadre: ECRAN, legende: leg(L.choix, A_DROITE) },
    { duree: d(8), source: { film: 'b', de: Bx.de || 0 } },
    { duree: d(9), source: { moment: 'stade', de: { pose: 'stade', avant: 2.4 } }, cadre: VILLE },
    { duree: d(10), source: { film: 'b', de: dB2 }, legende: leg(L.fin, FILM_BAS) },
    { duree: 'reste', source: { carton: 'fin', image: P.panorama || '${WEB}/accueil/panorama_nuit.webp', livre: { titre: P.titre, ligne: P.ligne },
      disponibilite: P.disponibilite || 'Bientôt sur mobile', logoA: 0.5, dispoA: 2.2 }, entree: 'flash', transition: 0.3, couleurFlash: P.accent },
  ];
  // ─── l'aperçu de l'App Store : ~28 s, rien que le jeu et ses films ; sur une carte, la légende en
  // bas (le texte de la carte est en haut de l'écran)
  const court = [
    { duree: nc[0] + 'm', source: { moment: 'intro', de: 0.4 }, legende: leg(L.intro) },
    { duree: nc[1] + 'm', source: { moment: 'carte1', de: 0.25 }, legende: leg(L.carte, 'bas') },
    { duree: nc[2] + 'm', source: { film: 'a', de: A.deCourt != null ? A.deCourt : A.de || 0 }, legende: leg(L.objet) },
    { duree: nc[3] + 'm', source: { moment: 'nuit', de: 0.3 }, legende: leg(L.nuit) },
    { duree: nc[4] + 'm', source: { moment: 'carte3', de: 0.3 }, legende: leg(L.choix, 'bas') },
    { duree: nc[5] + 'm', source: { film: 'b', de: Bx.deCourt != null ? Bx.deCourt : Bx.de || 0 } },
    { duree: 'reste', source: { moment: 'accueil', de: { pose: 'cartouche', avant: 1.6 } }, entree: 'fondu', transition: 0.5 },
  ];
  // une légende de l'aperçu peut différer de celle de la bande (`legendesCourt: { objet: … }`)
  if (P.legendesCourt) {
    const cles = ['intro', 'carte', 'objet', 'nuit', 'choix'];
    [0, 1, 2, 3, 4].forEach((i) => { const c = P.legendesCourt[cles[i]]; if (c !== undefined) court[i].legende = c ? leg(c, court[i].legende && court[i].legende.position) : undefined; });
  }

  return {
    id: P.id, titre: P.titre, livre: P.livre, accent: P.accent, disponibilite: P.disponibilite || 'Bientôt sur mobile',
    films: { a: A.fichier, b: Bx.fichier },
    moments,
    montages: { long: { musique: musiqueLong, plans }, court: { musique: musiqueCourt, plans: court } },
    formats: { '9x16': 'long', '16x9': 'long', '4x5': 'long', appstore: 'court' },
    ecrans: { liste: (P.ecrans || [
      { legende: L.carteEcran || L.carte, source: { moment: 'carte1', pose: 'glisse' } },
      { legende: L.introEcran || L.intro, source: { moment: 'intro', pose: 'scene' } },
      { legende: L.villeEcran || L.ville, source: { moment: 'jour', pose: 'jour' } },
      { legende: L.objetEcran || L.objet, source: { film: 'a', t: (A.de || 0) + (A.pose || 2) } },
      { legende: L.carte2Ecran, source: { moment: 'carte2', pose: 'carte' } },
      { legende: L.nuitEcran || L.nuit, source: { moment: 'nuit', pose: 'nuit' } },
      { legende: L.choixEcran || L.choix, source: { moment: 'carte3', pose: 'glisse' } },
      { legende: L.stadeEcran || 'Le samedi, la Rive', source: { moment: 'stade', pose: 'stade' } },
      { legende: L.finEcran || L.fin, source: { film: 'b', t: (Bx.de || 0) + (Bx.pose || 3) } },
      { legende: P.ligne, source: { moment: 'accueil', pose: 'cartouche' } },
    ]).map((e) => Object.assign({}, e, { legende: typeof e.legende === 'object' ? e.legende.titre : e.legende })).filter((e) => e.legende) },
  };
};
