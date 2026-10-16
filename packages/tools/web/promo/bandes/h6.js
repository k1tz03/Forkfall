/* ═══════════════════════════════════════════════════════════════════════════
   LA BANDE DU LIVRE 6 — « 23 h 58 », une minute (bandes/_livre.js).
   La promesse, sans le secret : 2003, la première femme à diriger le recrutement d'un club de
   première division ; trente millions de ventes par an, page deux du contrat, et la page trois
   qu'on n'a pas lue ; chaque nuit à 23 h 58, le fax imprime un nom, un prix, un club ; si tu
   n'obéis pas, une photo de toi au Rideau Rouge. Le papier thermique blanchit en six mois. Ce
   qui reste au livre : qui écrit, ce que dit la photo.
   Les films (le héros n'y est ni nommé ni montré) : « Papier thermique » (le bureau, l'horloge,
   le fax qui sonne) et « La buanderie » (les maillots de 1987, la vapeur, un téléphone).
   La musique : « 23 h 58 » (livre_h6), ou son master du studio (--musique-studio).
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const bandeDeLivre = require('./_livre');

module.exports = bandeDeLivre({
  id: 'h6',
  livre: 'vendre_trente', index: 5, graine: 4242,
  titre: '23 h 58', ligne: 'Livre 6 · Directrice sportive · 2003', accent: '#B49BFF',
  heros: { prenom: 'Martine', nom: 'Estève', genre: 'f' },
  theme: 'livre_h6',
  extraits: {
    // l'horloge du bureau qui passe à 23 h 58, puis le fax qui sort sa page (dès 2,3 s)
    a: { fichier: '${SP}/extraits/papier_thermique.{format}.mp4', de: 0, pose: 5.6, duree: 7.4, deCourt: 2.4 },
    b: { fichier: '${SP}/extraits/la_buanderie.{format}.mp4', de: 0, pose: 3.0, duree: 7.2 },
  },
  // la page du fax de 23 h 58 (montrée), puis la photo qui sort le lendemain (glissée)
  cartes: { deux: 'ds.h6.pro.fax', trois: 'ds.h6.sc.photo' },
  lieux: { jour: 'clubhouse', nuit: 'club_prive' },
  legendes: {
    promesse: { titre: '23 h 58', sous: 'le fax de ton bureau imprime une page' },
    intro: { titre: 'Trente millions par an', sous: "c'est écrit à la page deux" },
    carte: { titre: 'La page trois', sous: "tu ne l'as pas lue" },
    ville: { titre: 'Aubérive, 2003', sous: 'un club qui ne vit que de ses ventes' },
    objet: { titre: 'Un nom, un prix, un club', sous: 'chaque nuit à 23 h 58' },
    nuit: { titre: "Si tu n'obéis pas", sous: 'il imprime une photo de toi' },
    choix: { titre: 'Qui écrit ?' },
    fin: { titre: 'Le papier blanchit en six mois.' },
    carte2Ecran: '23 h 58 · une page · aucun numéro',
    finEcran: 'Le papier blanchit en six mois',
  },
});
