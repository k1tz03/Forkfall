/* ═══════════════════════════════════════════════════════════════════════════
   LA BANDE DU LIVRE 4 — « La Route de la Rive », une minute (bandes/_livre.js).
   La promesse, sans le secret : 1990, trente et un ans, un genou qui a un avis, la dernière
   année de contrat ; la photo de la montée de 1984 part aux archives, puis revient par
   morceaux sous ta porte ; chaque nuit, depuis les infiltrations, deux heures du matin, la
   route de la Rive et une lumière de mobylette au bout. Ce qui reste au livre : ce qui s'est
   passé en 1984, qui conduisait, qui découpe la photo.
   Les films : « Deux heures » (le pont, la lumière qui attend au bout ; son titre) et « Le carré
   ancien », pris APRÈS la pierre (sa pierre dit un nom que le livre garde : on n'en montre que
   le médaillon, sans légende qui le relie à 1984).
   La musique : « La Route de la Rive » (livre_h4), ou son master du studio (--musique-studio).
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const bandeDeLivre = require('./_livre');

module.exports = bandeDeLivre({
  id: 'h4',
  livre: 'fin_de_contrat', index: 3, graine: 4242,
  titre: 'La Route de la Rive', ligne: 'Livre 4 · Joueur · 1990', accent: '#FFD84D',
  heros: { prenom: 'Yves', nom: 'Barège', genre: 'm' },
  theme: 'livre_h4',
  musiqueMarge: 4.4,   // l'AAC relevait les crêtes de ce master de 2,4 dB : −0,5 dBTP au lieu de −1
  extraits: {
    // le pont de pierre d'en haut, puis par le pare-brise : la mobylette au bout ; le titre du film
    // (« Deux heures ») entre à 2,6 s
    a: { fichier: '${SP}/extraits/route_deux_heures.{format}.mp4', de: 0, pose: 2.0, duree: 7.0 },
    // le médaillon d'un vieil homme, de plus en plus près (la pierre, avant 1,2 s, n'est pas montrée)
    b: { fichier: '${SP}/agents/lot-films-r2/extraits/carre_ancien.{format}.mp4', de: 1.2, pose: 2.0, duree: 5.8 },
  },
  // la photo de 1984 qui revient découpée (montrée), puis le premier rêve, à gauche ou à droite (glissée)
  cartes: { deux: 'jp.h4.morceaux.premier', trois: 'jp.h4.route.premier_reve' },
  lieux: { jour: 'cabinet', nuit: 'tabac' },
  legendes: {
    // (avant le titre du film, qui entre à 2,6 s)
    promesse: { titre: 'Deux heures du matin', sous: 'la route de la Rive', a: 2.4 },
    intro: { titre: 'Trente et un ans', sous: 'ta dernière année de contrat' },
    carte: { titre: 'La montée de 1984', sous: 'ta photo part aux archives' },
    ville: { titre: 'Aubérive, 1990', sous: 'un genou qui a un avis' },
    // (la suite du film porte son propre titre : pas de légende)
    objet: undefined,
    nuit: { titre: 'La photo de 1984 revient', sous: 'par morceaux, sous ta porte' },
    choix: { titre: 'À gauche, ou à droite ?' },
    fin: { titre: "On te l'a dit le lendemain." },
    carte2Ecran: 'Un visage découpé aux ciseaux',
    objetEcran: 'Deux heures, la route de la Rive',
    finEcran: "On te l'a dit le lendemain",
  },
});
