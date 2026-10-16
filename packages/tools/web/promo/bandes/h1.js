/* ═══════════════════════════════════════════════════════════════════════════
   LA BANDE DU LIVRE 1 — « Trois mille visages », une minute.
   La promesse du livre, sans son secret : 1990, un entraîneur promu sans un sou, revenu
   à Aubérive sous le nom de sa mère ; la photo de 1974 au visage gratté ; un kop qui
   t'aime avant de te connaître et imprime trois mille masques à ton visage ; l'homme
   sous la fenêtre. Ce qui reste au livre : qui a gratté, ce que le père a fait.

   La musique : « Trois mille masques » (livre_h1), 120 à la noire, une mesure = 2 s.
   L'intro et la marche (12 mesures), le creux — l'homme sous la fenêtre (8) —, puis B3,
   tout le stade : quatre mesures a cappella, puis tout le monde et la cymbale (8), et
   deux mesures de retour. 30 mesures = 60 s. L'App Store : l'intro (4) et B3 (10), 28 s.

   Le film : « Trois mille masques » (cinema/films/trois_mille_masques.js), tourné dans
   chaque format par la trousse du cinéma (docs/design/cinematiques.md § 11).
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const { depart, enVille, devant, auStade } = require('./_communs');

const G = 4242;    // la graine (les mêmes cartes à chaque tournage)
const ECRAN = { '9x16': 'ecran', '16x9': { mode: 'ecran' }, '4x5': 'ecran' };
const VILLE = { '16x9': { mode: 'ecran' } };
const A_DROITE = { '16x9': 'droite' };
const FILM_BAS = { '16x9': 'bas-gauche' };   // sur le film en 16:9, la légende en bas à gauche (les bandes du cinémascope)

module.exports = {
  id: 'h1',
  titre: 'Trois mille visages',
  livre: 'promu',                            // la couleur : HISTOIRES.promu (#FF5A4E)
  disponibilite: 'Bientôt sur mobile',
  films: { masques: '${SP}/agents/lot-cinema-kit/rendu/trois_mille_masques.{format}.mp4' },

  moments: [
    // l'introduction jouée : le titre au néon, puis le club-house de la Rive
    { id: 'h1_intro', profils: ['social', 'appstore', 'apple'],
      prepare: [['attendre', 0.3]],
      tournage: [['demarrer', 0, G], ['attendreQue', 'etat.cine', 30], ['attendre', 1.4], ['pose', 'titre'], ['attendre', 1.0],
        ['scene', 1], ['attendreQue', 'etat.boiteFinie', 15], ['attendre', 0.8], ['pose', 'scene'], ['attendre', 1.6]] },
    // la photo de 1974 : la carte de Josiane, glissée (« Je prends les deux »)
    { id: 'h1_photo', profils: ['social', 'appstore', 'apple'],
      prepare: depart(0, G).concat([['attendre', 1.2]]),
      tournage: [['attendre', 1.1], ['pose', 'carte'], ['glisser', 'gauche', { duree: 0.85, ampleur: 0.46, tenue: 0.5, pose: 'glisse' }], ['attendre', 1.8]] },
    // la rue des Lilas, le matin : la buvette du kop en rouge, là où Gégé t'attend
    { id: 'h1_rue', profils: ['social', 'apple'],
      prepare: enVille(0, G).concat(devant('presse'), [['zoom', 3], ['attendre', 1.8]]),
      tournage: [['attendre', 0.5], ['touche', 'ArrowRight', 1, 1.2], ['pose', 'rue'], ['touche', 'ArrowRight', 1, 1.4], ['attendre', 0.6]] },
    // « Y aller » : la buvette, et Gégé au grillage (la carte du chant)
    { id: 'h1_gege', profils: ['social', 'appstore', 'apple'],
      prepare: enVille(0, G).concat([['zoom', 3], ['attendre', 1.0]]),
      tournage: [['attendre', 0.4], ['cliquer', '#villeRdv'], ['attendreQue', 'etat.carte', 25], ['attendre', 1.0], ['pose', 'carte'], ['attendre', 2.4]] },
    // la rue des Lilas, la nuit, sous les fenêtres
    { id: 'h1_nuit', profils: ['social', 'appstore', 'apple'],
      prepare: enVille(0, G).concat([['tranche', 'nuit']], devant('presse'), [['zoom', 3], ['attendre', 1.8]]),
      tournage: [['attendre', 0.6], ['touche', 'ArrowRight', 1, 1.4], ['pose', 'nuit'], ['attendre', 2.0]] },
    // l'homme sous la fenêtre (la carte « mardi, minuit »), « Je descends »
    { id: 'h1_fenetre', profils: ['social', 'appstore', 'apple'],
      prepare: depart(0, G).concat([['avancer', 'v.card.id.indexOf("en.h1.a5_fenetre") === 0', { reponses: 'gauche' }], ['jouerJusqua', 'etat.carte', { max: 150 }], ['attendre', 1.2]]),
      tournage: [['attendre', 1.2], ['pose', 'carte'], ['glisser', 'gauche', { duree: 0.8, ampleur: 0.44, tenue: 0.5, pose: 'glisse' }], ['attendre', 1.6]] },
    // le match de présentation : la Nord se lève avec ton visage (le film passe avant, on le passe)
    { id: 'h1_presentation', profils: ['social', 'apple'],
      prepare: depart(0, G).concat([['avancer', 'v.card.id.indexOf("en.h1.a1_presentation") === 0'], ['jouerJusqua', 'etat.carte', { max: 150 }], ['attendre', 1.2]]),
      tournage: [['attendre', 1.2], ['pose', 'carte'], ['glisser', 'gauche', { duree: 0.8, ampleur: 0.44, tenue: 0.5, pose: 'glisse' }], ['attendre', 2.4], ['pose', 'reponse']] },
    // le samedi à la Rive : le stade, la Nord
    { id: 'h1_samedi', profils: ['social', 'apple'],
      prepare: auStade(0, G),
      tournage: [['attendre', 0.6], ['pose', 'carte'], ['glisser', 'gauche', { duree: 0.6, ampleur: 0.45 }], ['attendre', 3.2], ['pose', 'stade'], ['attendre', 2.0]] },
    // l'accueil : la cartouche du livre 1 (« Commence ici »)
    { id: 'h1_accueil', profils: ['appstore', 'apple', 'google'], profil: { runs: 0 },
      prepare: [['attendre', 1.6]],
      tournage: [['attendre', 0.8], ['defiler', '#postulats .postulat[data-index="0"]', { duree: 1.0, marge: 96 }], ['attendre', 1.2], ['pose', 'cartouche'], ['attendre', 2.6]] },
  ],

  montages: {
    long: {
      musique: { theme: 'livre_h1', morceaux: [{ depuis: null, de: 0, a: 12 }, { depuis: 'creux', de: 0, a: 8 }, { depuis: 'B3', de: 0, a: 10 }], fondu: { sortie: 2.6 } },
      plans: [
        // l'intro : le cadre au mur, la photo, le visage gratté (le titre du film vient après : on coupe
        // avant) — puis la ville
        { duree: '2m', source: { film: 'masques', de: 33.4 }, entree: 'noir', transition: 0.4,
          legende: { titre: 'La photo de 1974', sous: 'un visage gratté au couteau', position: FILM_BAS } },
        { duree: '2m', source: { moment: 'h1_intro', de: 0.4 }, cadre: VILLE,
          legende: { titre: '1990. Tu reviens à Aubérive', sous: 'sous le nom de ta mère', position: A_DROITE } },
        // la marche
        { duree: '2m', source: { moment: 'h1_photo', de: 0.25 }, cadre: ECRAN,
          legende: { titre: 'Entraîneur du promu', sous: 'en première division, sans un sou', position: A_DROITE } },
        { duree: '2m', source: { moment: 'h1_rue', de: 0.2 }, cadre: VILLE,
          legende: { titre: "Le kop t'aime déjà", sous: 'avant même de te connaître', position: A_DROITE } },
        { duree: '2m', source: { moment: 'h1_gege', de: { pose: 'carte', avant: 1.4 } }, cadre: ECRAN },
        { duree: '2m', source: { film: 'masques', de: 5.25 },
          legende: { titre: 'Trois mille masques', sous: 'à ton visage', position: FILM_BAS } },
        // le creux : la nuit
        { duree: '2m', source: { film: 'masques', de: 14.0 } },
        { duree: '2m', source: { moment: 'h1_nuit', de: 0.3 }, cadre: VILLE,
          legende: { titre: 'Un mardi, à minuit,', sous: 'un homme se tient sous ta fenêtre', position: A_DROITE } },
        { duree: '2m', source: { moment: 'h1_fenetre', de: 0.3 }, cadre: ECRAN,
          legende: { titre: 'Il porte ta figure.', position: A_DROITE } },
        { duree: '2m', source: { film: 'masques', de: 19.6 } },
        // B3 : le stade a cappella, puis tout le monde
        { duree: '2m', source: { film: 'masques', de: 23.6 }, legende: { titre: "Ils t'aiment.", position: FILM_BAS, de: 0.3 } },
        { duree: '2m', source: { moment: 'h1_presentation', de: 0.25 }, cadre: ECRAN,
          legende: { titre: "Ils feront ce que tu n'oses pas faire.", position: A_DROITE } },
        { duree: '2m', source: { film: 'masques', de: 28.6 }, legende: { titre: 'Avec ton visage.', position: FILM_BAS, de: 0.2 } },
        { duree: '1m', source: { moment: 'h1_samedi', de: { pose: 'stade', avant: 1.2 } }, cadre: VILLE },
        // le retour
        { duree: 'reste', source: { carton: 'fin', image: '${WEB}/accueil/panorama_nuit.webp', livre: { titre: 'Trois mille visages', ligne: 'Livre 1 · Entraîneur · 1990' },
          disponibilite: 'Bientôt sur mobile', logoA: 0.5, dispoA: 2.2 }, entree: 'flash', transition: 0.3, couleurFlash: '#FF5A4E' },
      ],
    },
    court: {
      musique: { theme: 'livre_h1', morceaux: [{ depuis: null, de: 0, a: 4 }, { depuis: 'B3', de: 0, a: 10 }], fondu: { sortie: 2.0 } },
      plans: [
        { duree: '2m', source: { moment: 'h1_intro', de: 0.4 }, legende: { titre: '1990. Tu reviens à Aubérive', sous: 'sous le nom de ta mère' } },
        { duree: '2m', source: { moment: 'h1_photo', de: 0.25 }, legende: { titre: 'La photo de 1974', sous: 'un visage gratté au couteau', position: 'bas' } },
        { duree: '2m', source: { moment: 'h1_gege', de: { pose: 'carte', avant: 1.4 } }, legende: { titre: "Le kop t'aime déjà", sous: 'avant même de te connaître', position: 'bas' } },
        { duree: '2m', source: { film: 'masques', de: 5.25 }, legende: { titre: 'Trois mille masques', sous: 'à ton visage' } },
        { duree: '2m', source: { film: 'masques', de: 28.6 } },
        { duree: '2m', source: { moment: 'h1_fenetre', de: 0.3 }, legende: { titre: 'Un mardi, à minuit,', sous: 'un homme porte ta figure', position: 'bas' } },
        { duree: 'reste', source: { moment: 'h1_accueil', de: { pose: 'cartouche', avant: 1.6 } }, entree: 'fondu', transition: 0.5 },
      ],
    },
  },
  formats: { '9x16': 'long', '16x9': 'long', '4x5': 'long', appstore: 'court' },

  ecrans: {
    liste: [
      { legende: '1974 : un visage gratté au couteau', source: { moment: 'h1_photo', pose: 'glisse' } },
      { legende: '1990. Tu reviens à Aubérive', source: { moment: 'h1_intro', pose: 'scene' } },
      { legende: "Le kop t'aime avant de te connaître", source: { moment: 'h1_gege', pose: 'carte' } },
      { legende: 'Trois mille masques, à ton visage', source: { film: 'masques', t: 11.5 } },
      { legende: 'La Nord se lève avec ton visage', source: { moment: 'h1_presentation', pose: 'glisse' } },
      { legende: 'Rue des Lilas, mardi, minuit', source: { moment: 'h1_nuit', pose: 'nuit' } },
      { legende: 'Un homme porte ta figure', source: { moment: 'h1_fenetre', pose: 'glisse' } },
      { legende: 'Le samedi, la Rive gronde', source: { moment: 'h1_samedi', pose: 'stade' } },
      { legende: 'Trois mille visages se lèvent', source: { film: 'masques', t: 31.4 } },
      { legende: 'Livre 1 · Entraîneur · 1990', source: { moment: 'h1_accueil', pose: 'cartouche' } },
    ],
  },
};
