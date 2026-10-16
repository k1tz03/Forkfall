/* ═══════════════════════════════════════════════════════════════════════════
   LA BANDE DU LIVRE 7 — « Chambre 12 », une minute (bandes/_livre.js).
   La promesse, sans le secret : 2011, après le fiasco du bus ; on te confie les Cobalts, que
   la Fédération envoie se préparer à l'hôtel de la Rive ; vingt-six doubles au tableau des
   clés, une réceptionniste de nuit qui voit tout ; la troisième nuit, le téléphone : « Montez
   au 12. » Ce qui reste au livre : qui est monté, ce qu'il y a dans les papiers signés.
   Les films : « Vingt-six doubles » (Tibo à la fenêtre de la 12, le terrain sous la pluie, le
   titre) et « La troisième nuit » (la fenêtre qui s'éteint, le bus de 2010).
   La musique : « Chambre 12 » (livre_h7), ou son master du studio (--musique-studio).
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const bandeDeLivre = require('./_livre');

module.exports = bandeDeLivre({
  id: 'h7',
  livre: 'apres_fiasco', index: 6, graine: 4242,
  titre: 'Chambre 12', ligne: 'Livre 7 · Sélectionneur · 2011', accent: '#FF79B0',
  heros: { prenom: 'Daniel', nom: 'Sabbah', genre: 'm' },
  theme: 'livre_h7',
  extraits: {
    // Tibo Rancé à la fenêtre de la 12 (« En novembre, je joue ? »), puis le terrain annexe sous
    // la pluie, et le titre du film au néon (« Aubérive · 2011 · Chambre 12 ») à mi-hauteur
    a: { fichier: '${SP}/agents/lot-films-r4/extraits/vingt_six_doubles.{format}.mp4', de: 0, pose: 1.2, duree: 7.0, deCourt: 2.6 },
    // la fenêtre allumée, une silhouette ; elle s'éteint ; le bus de 2010 dans le noir
    b: { fichier: '${SP}/agents/lot-films-r4/extraits/la_troisieme_nuit.{format}.mp4', de: 0, pose: 0.8, duree: 7.0 },
  },
  // le tableau des clés à minuit (montré), puis la troisième nuit, « Montez au 12 » (glissée)
  cartes: { deux: 'sl.h7.pro6_tableau_mutins', trois: 'sl.h7.a3_deux_heures_dix' },
  lieux: { jour: 'fontaine', nuit: 'hotel' },
  legendes: {
    promesse: { titre: "Les Cobalts à l'hôtel de la Rive", sous: 'dix jours avant le barrage' },
    intro: { titre: 'Après le fiasco de 2010', sous: 'on te confie les Cobalts' },
    carte: { titre: "Le bus n'est jamais descendu", sous: "il attend derrière l'hôtel" },
    ville: { titre: 'Aubérive, 2011', sous: 'une ville où personne ne les attend' },
    // (le film pose son propre titre au néon à mi-hauteur : la légende reste en haut)
    objet: { titre: 'Vingt-six doubles au tableau', sous: 'une réceptionniste qui voit tout' },
    nuit: { titre: 'La troisième nuit', sous: "quelqu'un a demandé le double de la 12" },
    choix: { titre: 'Monter, ou appeler la police ?' },
    // (le carton de lieu du film, « Hôtel de la Rive », entre dans sa dernière demi-seconde)
    fin: { titre: 'Le tableau sait qui est monté.', a: -0.7 },
    carte2Ecran: 'Vingt-six crochets, vingt-six doubles',
    objetEcran: 'Tibo Rancé, chambre 12',
    finEcran: 'Le tableau sait qui est monté',
  },
});
