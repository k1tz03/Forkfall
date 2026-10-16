/* ═══════════════════════════════════════════════════════════════════════════
   LA BANDE DU LIVRE 8 — « L'Oreillette », une minute (bandes/_livre.js).
   La promesse, sans le secret : 2024, soixante-douze matchs par saison, un club qui est une
   ligne dans le tableur d'un fonds ; dans ton oreille, le modèle, qui choisit qui acheter et
   qui vendre, et parle avec la voix de l'homme qui l'a construit ; « Vendez Kerdal avant
   lundi » ; la nuit, le stade vide s'allume tout seul. Ce qui reste au livre : ce qui arrive à
   ceux qu'il nomme, d'où vient la voix, si elle est dans l'oreillette ou en toi.
   Les films : « Six heures dix » (le premier jour, le premier ordre) et « Trois heures » (les
   projecteurs, la pelouse vide). On ne voit jamais le héros.
   La musique : livre_h8, ou son master du studio (--musique-studio).
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const bandeDeLivre = require('./_livre');

module.exports = bandeDeLivre({
  id: 'h8',
  livre: 'le_modele', index: 7, graine: 4242,
  titre: "L'Oreillette", ligne: 'Livre 8 · Directeur sportif · 2024', accent: '#4FE3FF',
  heros: { prenom: 'Olivier', nom: 'Nkolo', genre: 'm' },
  theme: 'livre_h8',
  extraits: {
    a: { fichier: '${SP}/extraits/six_heures_dix.{format}.mp4', de: 0, pose: 2.5, duree: 6.5 },
    b: { fichier: '${SP}/extraits/trois_heures.{format}.mp4', de: 0, pose: 3.0, duree: 6.85 },
  },
  // « Vendez Vollaire » sous la bâche de la Nord (montrée), puis « Vendez Kerdal avant lundi » (glissée)
  cartes: { deux: 'ds.h8.a1_vollaire', trois: 'ds.h8.a2_fin_de_cycle' },
  lieux: { jour: 'boutique', nuit: 'friche' },
  legendes: {
    promesse: { titre: 'Aubérive, 2024', sous: 'soixante-douze matchs par saison' },
    intro: { titre: 'Un club, une ligne de tableur', sous: 'et une voix dans ton oreille' },
    carte: { titre: 'Le modèle choisit', sous: 'qui acheter, qui vendre, qui faire jouer' },
    ville: { titre: 'Il ne dort jamais', sous: 'toi, deux heures par nuit' },
    objet: { titre: 'Il parle avec la voix', sous: "de l'homme qui l'a construit" },
    nuit: { titre: "La nuit, le stade s'allume", sous: 'tout seul' },
    choix: { titre: '« Vendez Kerdal avant lundi. »' },
    fin: { titre: "Ce qu'il prédit arrive." },
    carte2Ecran: '« Vendez Vollaire. »',
    finEcran: "Ce qu'il prédit arrive",
  },
});
