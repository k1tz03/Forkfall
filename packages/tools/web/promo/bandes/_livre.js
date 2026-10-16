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
   Chaque plan dure un nombre entier de mesures, le plus proche de sa durée visée ; la fin
   prend ce qui reste. L'App Store : 2, 3, 6 (le film A), 8, 11 (le film B), la cartouche.
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const { depart, enVille, devant, auStade } = require('./_communs');

function bpm(theme) {
  const f = path.join(__dirname, '..', '..', 'musique', theme + '.js');
  const m = fs.existsSync(f) ? fs.readFileSync(f, 'utf8').match(/\bbpm:\s*(\d+(?:\.\d+)?)/) : null;
  if (!m) throw new Error('livre : pas de bpm pour le thème ' + theme);
  return +m[1];
}
// des durées visées (secondes, en proportion) → des mesures entières, au moins une par plan, dont
// la somme fait `total` mesures (les plus forts restes d'abord)
function enMesures(cibles, M, total) {
  const somme = cibles.reduce((a, b) => a + b, 0);
  const ideal = cibles.map((s) => s / somme * total);
  const n = ideal.map((x) => Math.max(1, Math.floor(x)));
  let reste = total - n.reduce((a, b) => a + b, 0);
  const ordre = ideal.map((x, i) => [x - Math.floor(x), i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
  for (let k = 0; reste > 0; k = (k + 1) % ordre.length) { n[ordre[k][1]]++; reste--; }
  for (let k = 0; reste < 0 && k < 1000; k++) { const i = n.indexOf(Math.max(...n)); n[i]--; reste++; }
  return n;
}

module.exports = function bandeDeLivre(P) {
  const M = 240 / bpm(P.theme);
  const L = P.legendes || {};
  const ECRAN = { '9x16': 'ecran', '16x9': { mode: 'ecran' }, '4x5': 'ecran' };
  const VILLE = { '16x9': { mode: 'ecran' } };
  const A_DROITE = { '16x9': 'droite' }, FILM_BAS = { '16x9': 'bas-gauche' };
  const leg = (x, pos) => (x ? Object.assign({ position: pos }, typeof x === 'string' ? { titre: x } : x) : undefined);
  const G = P.graine, I = P.index;
  const aCarte = (prefixe, sens) => depart(I, G).concat([['avancer', 'v.card.id.indexOf(' + JSON.stringify(prefixe) + ') === 0', { reponses: sens || 'gauche' }],
    ['jouerJusqua', 'etat.carte', { max: 180 }], ['attendre', 1.2]]);

  // ─── les moments
  const moments = [
    { id: 'intro', profils: ['social', 'appstore', 'apple'], heros: P.heros, prepare: [['attendre', 0.3]],
      tournage: [['demarrer', I, G], ['attendreQue', 'etat.cine', 30], ['attendre', 1.4], ['pose', 'titre'], ['attendre', 1.0],
        ['scene', 1], ['attendreQue', 'etat.boiteFinie', 15], ['attendre', 0.8], ['pose', 'scene'], ['attendre', 1.6]] },
    { id: 'carte1', profils: ['social', 'appstore', 'apple'], heros: P.heros, prepare: depart(I, G).concat([['attendre', 1.2]]),
      tournage: [['attendre', 1.1], ['pose', 'carte'], ['glisser', P.sens1 || 'gauche', { duree: 0.85, ampleur: 0.46, tenue: 0.5, pose: 'glisse' }], ['attendre', 1.8]] },
    { id: 'jour', profils: ['social', 'apple'], heros: P.heros,
      prepare: enVille(I, G).concat([['tranche', 'aprem']], devant(P.lieux.jour), [['zoom', 3], ['attendre', 1.8]]),
      tournage: [['attendre', 0.5], ['touche', 'ArrowDown', 1, 1.2], ['pose', 'jour'], ['attendre', 2.0]] },
    { id: 'carte2', profils: ['social', 'apple'], heros: P.heros, prepare: aCarte(P.cartes.deux, P.cartes.sens),
      tournage: [['attendre', 1.6], ['pose', 'carte'], ['attendre', 2.4]] },
    { id: 'nuit', profils: ['social', 'appstore', 'apple'], heros: P.heros,
      prepare: enVille(I, G).concat([['tranche', 'nuit']], devant(P.lieux.nuit), [['zoom', 3], ['attendre', 1.8]]),
      tournage: [['attendre', 0.6], ['touche', 'ArrowRight', 1, 1.4], ['pose', 'nuit'], ['attendre', 2.0]] },
    { id: 'carte3', profils: ['social', 'appstore', 'apple'], heros: P.heros, prepare: aCarte(P.cartes.trois, P.cartes.sens),
      tournage: [['attendre', 1.2], ['pose', 'carte'], ['glisser', P.cartes.sensTrois || 'gauche', { duree: 0.8, ampleur: 0.44, tenue: 0.5, pose: 'glisse' }], ['attendre', 1.8]] },
    { id: 'stade', profils: ['social', 'apple'], heros: P.heros, prepare: auStade(I, G),
      tournage: [['attendre', 0.6], ['glisser', 'gauche', { duree: 0.6, ampleur: 0.45 }], ['attendre', 3.2], ['pose', 'stade'], ['attendre', 2.0]] },
    { id: 'accueil', profils: ['appstore', 'apple', 'google'], heros: P.heros, profil: { runs: 1 }, prepare: [['attendre', 1.6]],
      tournage: [['attendre', 0.8], ['defiler', '#postulats .postulat[data-index="' + I + '"]', { duree: 1.0, marge: 96 }], ['attendre', 1.2], ['pose', 'cartouche'], ['attendre', 2.6]] },
  ];

  // ─── le montage d'une minute : des durées visées, posées sur les mesures
  const total = P.mesures || Math.round(60 / M);
  const A = P.extraits.a, B = P.extraits.b;
  const visees = P.visees || [3.5, 4, 4.5, 4.5, 4, 3.5, 4.5, 4.5, 3.5, 4, 3.5, 6.5];
  const n = enMesures(visees, M, total);
  const d = (k) => n[k] + 'm';
  // la suite d'un extrait reprend où son premier plan l'a laissé — ou plus tôt, pour finir avec
  // l'extrait (6 à 8 s) plutôt que de figer sa dernière image
  const suite = (X, k1, k2) => (X.de || 0) + Math.max(0, Math.min(n[k1] * M, (X.duree || 7) - n[k2] * M));
  const dA2 = suite(A, 0, 5), dB2 = suite(B, 8, 10);
  const plans = [
    { duree: d(0), source: { film: 'a', de: A.de || 0 }, entree: 'noir', transition: 0.5, legende: leg(L.promesse, FILM_BAS) },
    { duree: d(1), source: { moment: 'intro', de: 0.4 }, cadre: VILLE, legende: leg(L.intro, A_DROITE) },
    { duree: d(2), source: { moment: 'carte1', de: 0.25 }, cadre: ECRAN, legende: leg(L.carte, A_DROITE) },
    { duree: d(3), source: { moment: 'jour', de: 0.3 }, cadre: VILLE, legende: leg(L.ville, A_DROITE) },
    { duree: d(4), source: { moment: 'carte2', de: 0.4 }, cadre: ECRAN },
    { duree: d(5), source: { film: 'a', de: dA2 }, legende: leg(L.objet, FILM_BAS) },
    { duree: d(6), source: { moment: 'nuit', de: 0.3 }, cadre: VILLE, legende: leg(L.nuit, A_DROITE) },
    { duree: d(7), source: { moment: 'carte3', de: 0.3 }, cadre: ECRAN, legende: leg(L.choix, A_DROITE) },
    { duree: d(8), source: { film: 'b', de: B.de || 0 } },
    { duree: d(9), source: { moment: 'stade', de: { pose: 'stade', avant: 2.4 } }, cadre: VILLE },
    { duree: d(10), source: { film: 'b', de: dB2 }, legende: leg(L.fin, FILM_BAS) },
    { duree: 'reste', source: { carton: 'fin', image: P.panorama || '${WEB}/accueil/panorama_nuit.webp', livre: { titre: P.titre, ligne: P.ligne },
      disponibilite: P.disponibilite || 'Bientôt sur mobile', logoA: 0.5, dispoA: 2.2 }, entree: 'flash', transition: 0.3, couleurFlash: P.accent },
  ];
  // ─── l'aperçu de l'App Store : ~28 s, rien que le jeu et ses films
  const totalCourt = P.mesuresCourt || Math.floor(29 / M);
  const nc = enMesures([4, 4, 4, 4, 4, 4, 4], M, totalCourt);
  const court = [
    { duree: nc[0] + 'm', source: { moment: 'intro', de: 0.4 }, legende: leg(L.intro) },
    { duree: nc[1] + 'm', source: { moment: 'carte1', de: 0.25 }, legende: leg(L.carte) },
    { duree: nc[2] + 'm', source: { film: 'a', de: A.de || 0 }, legende: leg(L.objet) },
    { duree: nc[3] + 'm', source: { moment: 'nuit', de: 0.3 }, legende: leg(L.nuit) },
    { duree: nc[4] + 'm', source: { moment: 'carte3', de: 0.3 }, legende: leg(L.choix) },
    { duree: nc[5] + 'm', source: { film: 'b', de: B.de || 0 } },
    { duree: 'reste', source: { moment: 'accueil', de: { pose: 'cartouche', avant: 1.6 } }, entree: 'fondu', transition: 0.5 },
  ];

  return {
    id: P.id, titre: P.titre, livre: P.livre, accent: P.accent, disponibilite: P.disponibilite || 'Bientôt sur mobile',
    films: { a: A.fichier, b: B.fichier },
    moments,
    montages: {
      long: { musique: { theme: P.theme, morceaux: P.morceaux || [{ depuis: null, de: 0, a: total }], fondu: { sortie: 2.6 } }, plans },
      court: { musique: { theme: P.theme, morceaux: P.morceauxCourt || [{ depuis: null, de: P.debutCourt || 0, a: (P.debutCourt || 0) + totalCourt }], fondu: { sortie: 2.0 } }, plans: court },
    },
    formats: { '9x16': 'long', '16x9': 'long', '4x5': 'long', appstore: 'court' },
    ecrans: { liste: (P.ecrans || [
      { legende: L.carteEcran || L.carte, source: { moment: 'carte1', pose: 'glisse' } },
      { legende: L.introEcran || L.intro, source: { moment: 'intro', pose: 'titre' } },
      { legende: L.villeEcran || L.ville, source: { moment: 'jour', pose: 'jour' } },
      { legende: L.objetEcran || L.objet, source: { film: 'a', t: (A.de || 0) + (A.pose || 2) } },
      { legende: L.carte2Ecran, source: { moment: 'carte2', pose: 'carte' } },
      { legende: L.nuitEcran || L.nuit, source: { moment: 'nuit', pose: 'nuit' } },
      { legende: L.choixEcran || L.choix, source: { moment: 'carte3', pose: 'glisse' } },
      { legende: L.stadeEcran || 'Le samedi, la Rive', source: { moment: 'stade', pose: 'stade' } },
      { legende: L.finEcran || L.fin, source: { film: 'b', t: (B.de || 0) + (B.pose || 3) } },
      { legende: P.ligne, source: { moment: 'accueil', pose: 'cartouche' } },
    ]).map((e) => Object.assign({}, e, { legende: typeof e.legende === 'object' ? e.legende.titre : e.legende })).filter((e) => e.legende) },
  };
};
