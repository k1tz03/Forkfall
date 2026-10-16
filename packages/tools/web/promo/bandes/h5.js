/* ═══════════════════════════════════════════════════════════════════════════
   LA BANDE DU LIVRE 5 — « La Maquette », une minute (bandes/_livre.js).
   La promesse, sans le secret : 1999, la présidence d'un Racing en dépôt de bilan, deux titres
   au mur ; dans la vitrine de l'agence, une maquette où le stade rétrécit chaque mois ; le
   mardi à dix-huit heures, « Ici le Conseil » ; une nuit de novembre, la tribune Est, en chêne
   de 1931, brûle. Ce qui reste au livre : qui est le Conseil, qui y gagne, ce que tu as signé.
   Les films : « La seconde tranche » (la maquette, la vraie tribune, la vitrine) et « Chêne de
   1931 » (le feu sous la pluie).
   La musique : « La Maquette » (livre_h5), ou son master du studio (--musique-studio).
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const bandeDeLivre = require('./_livre');

module.exports = bandeDeLivre({
  id: 'h5',
  livre: 'geant_dechu', index: 4, graine: 4242,
  titre: 'La Maquette', ligne: 'Livre 5 · Président · 1999', accent: '#7ED37E',
  heros: { prenom: 'Claude', nom: 'Vaquez', genre: 'm' },
  theme: 'livre_h5',
  extraits: {
    a: { fichier: '${SP}/extraits/seconde_tranche.{format}.mp4', de: 0, pose: 2.5, duree: 7.2 },
    b: { fichier: '${SP}/extraits/chene_1931.{format}.mp4', de: 0, pose: 3.0, duree: 6.8 },
  },
  // « Ici le Conseil » au téléphone beige (montrée), puis la vitrine de l'agence (glissée)
  cartes: { deux: 'pr.h5.a2_mardi', trois: 'pr.h5.pro2_vitrine' },
  lieux: { jour: 'agence', nuit: 'mairie' },
  legendes: {
    promesse: { titre: 'Deux titres au mur', sous: 'un dépôt de bilan au greffe' },
    intro: { titre: 'Personne ne voulait la présidence', sous: "tu l'as prise" },
    carte: { titre: 'Vendre, ou tenir', sous: 'le Racing en dépôt de bilan' },
    ville: { titre: 'Aubérive, 1999', sous: 'des terrasses à vendre sur la Rive' },
    objet: { titre: 'Chaque mois, la maquette change', sous: 'le stade y rétrécit' },
    nuit: { titre: 'Le Conseil sait où tu dors', sous: 'ce que tu dois, ce que tu as signé' },
    choix: { titre: 'Tu as signé, ce jour-là ?' },
    fin: { titre: 'Toute en bois, de 1931.' },
    carte2Ecran: '« Ici le Conseil. »',
    finEcran: 'La tribune Est, chêne de 1931',
  },
});
