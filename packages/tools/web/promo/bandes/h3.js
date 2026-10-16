/* ═══════════════════════════════════════════════════════════════════════════
   LA BANDE DU LIVRE 3 — « La Sirène », une minute (bandes/_livre.js).
   La promesse, sans le secret : 1990, dix-neuf ans, la dernière chose que fabrique une ville
   dont l'usine ferme à Noël ; sous ton nom, au crochet, le nom à demi arraché d'un gamin
   qu'on dit parti à l'étranger ; tout le monde veut te vendre ; une nuit, la sirène de l'usine
   morte hurle, et tu te réveilles sur le béton de la grande halle. Ce qui reste au livre : où
   est Didier, qui tire la poignée, ce que vaut ton nom.
   Les films : « La dernière sirène » (les lampes de la halle qui s'éteignent, la pendule de la
   Tréfilerie à seize heures) et « Trois heures » (le terrain à la craie, les yeux qui s'ouvrent).
   La musique : « Seize heures » (livre_h3), ou son master du studio (--musique-studio).
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const bandeDeLivre = require('./_livre');

module.exports = bandeDeLivre({
  id: 'h3',
  livre: 'pepite', index: 2, graine: 1990,
  titre: 'La Sirène', ligne: 'Livre 3 · Joueur · 1990', accent: '#FF9A3C',
  heros: { prenom: 'Pascal', nom: 'Ollier', genre: 'm' },
  theme: 'livre_h3',
  extraits: {
    // la grande halle dont les lampes s'éteignent une à une, puis la pendule à seize heures
    a: { fichier: '${SP}/agents/lot-films-r2/extraits/derniere_sirene.{format}.mp4', de: 0, pose: 5.5, duree: 7.0, deCourt: 3.6 },
    // le terrain tracé à la craie, d'en haut ; les yeux qui s'ouvrent ; le titre du film (à 3,8 s)
    b: { fichier: '${SP}/extraits/sirene_trois_heures.{format}.mp4', de: 0, pose: 1.0, duree: 7.0 },
  },
  // la main de Fardelli sur le parking (montrée), puis trois heures du matin dans la halle (glissée)
  // (le moteur y va en répondant à droite : à gauche, la carte de trois heures devient sa variante
  // à la boîte de Steph, que ni le film ni la bande ne montrent)
  cartes: { deux: 'jp.h3.s0_main', trois: 'jp.h3.s1_trois_heures', sens: 'droite' },
  lieux: { jour: 'tabac_stade', nuit: 'halle' },
  legendes: {
    promesse: { titre: 'Aubérive, 1990', sous: "l'usine ferme à Noël" },
    intro: { titre: 'Dix-neuf ans', sous: 'la dernière chose que la ville fabrique' },
    carte: { titre: 'Sous ton nom, un autre nom', sous: "un gamin qu'on dit parti à l'étranger" },
    ville: { titre: 'Une ville qui te regarde', sous: 'tout le monde veut te vendre' },
    objet: { titre: 'La sirène de seize heures' },
    nuit: { titre: "L'usine est morte", sous: 'la nuit, sa sirène hurle encore' },
    choix: { titre: 'Il est trois heures.', sous: 'tu ne te rappelles pas le chemin' },
    fin: { titre: 'Elle sonne pour toi.' },
    carte2Ecran: 'Une main tendue sur le parking',
    finEcran: 'Trois heures, la grande halle',
  },
});
