/* ═══════════════════════════════════════════════════════════════════════════
   LA BANDE DU LIVRE 2 — « Le Sapin en carton », une minute (bandes/_livre.js).
   La promesse, sans le secret : 1990, un entraîneur « remercié » après huit journées que
   personne n'a vu partir ; sa berline sur la place peinte, un sapin au rétroviseur ; on te
   donne son banc pour six semaines ; chaque lundi, le répondeur a un message de lui, et il a
   raison ; la nuit, la voiture bouge. Ce qui reste au livre : où il est, qui a besoin qu'il
   n'y soit pas, ce qu'il y a dans le car.
   Les films : « Lundi, sept heures » (le parking à l'aube, puis le répondeur) et « Un sapin
   dans la Rive » (la lumière de l'eau, les ronds sur la Rive) — sans les visages.
   La musique : « Le Répondeur » (livre_h2), ou son master du studio (--musique-studio).
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const bandeDeLivre = require('./_livre');

module.exports = bandeDeLivre({
  id: 'h2',
  livre: 'interimaire', index: 1, graine: 4242,
  titre: 'Le Sapin en carton', ligne: 'Livre 2 · Entraîneur · 1990', accent: '#6FB0E8',
  // (un nom des réservoirs du jeu qu'aucun personnage ne porte : Fauvel est le syndicaliste du livre 7)
  heros: { prenom: 'Serge', nom: 'Guisard', genre: 'm' },
  theme: 'livre_h2',
  extraits: {
    // le parking à 6 h 40, la place peinte, le ticket, le sapin ; puis le bureau noir, le répondeur
    // (l'aperçu de l'App Store le prend au répondeur : sa légende parle du répondeur)
    a: { fichier: '${SP}/agents/lot-films-r1/extraits/lundi_sept_heures.{format}.mp4', de: 0, pose: 5.6, duree: 7.2, deCourt: 4.5 },
    // (une seconde de noir d'abord) la lumière de l'eau au plafond, puis les ronds sur la Rive
    b: { fichier: '${SP}/extraits/sapin_dans_la_rive.{format}.mp4', de: 1.0, pose: 3.4, duree: 6.1 },
  },
  // la voix du répondeur (montrée), puis la berline qui a bougé de trois mètres (glissée)
  cartes: { deux: 'en.h2.rep.message1', trois: 'en.h2.berl.trois_metres' },
  lieux: { jour: 'clubhouse', nuit: 'terminus' },
  legendes: {
    // (après le carton de lieu du film, « Aubérive, parking du stade », qui s'efface à 2,2 s)
    promesse: { titre: 'Remercié après huit journées', sous: "personne ne l'a vu partir", de: 2.2 },
    intro: { titre: 'On te donne son banc', sous: 'pour six semaines' },
    carte: { titre: "Sa voiture n'a pas bougé", sous: 'un sapin en carton au rétroviseur' },
    ville: { titre: 'Aubérive, 1990', sous: 'tout le monde le connaissait' },
    // (en 16:9, le sous-titre du répondeur passe en bas au milieu : la légende monte)
    objet: { titre: 'Chaque lundi, sept heures', sous: 'le répondeur a un message de lui', position: { '16x9': 'haut' } },
    nuit: { titre: 'La nuit, sa voiture bouge', sous: 'de trois mètres' },
    choix: { titre: 'Parler, ou te taire ?' },
    fin: { titre: 'Une nuit, la place est vide.' },
    carte2Ecran: "Un message de l'absent",
    finEcran: 'Une nuit, la place est vide',
  },
});
