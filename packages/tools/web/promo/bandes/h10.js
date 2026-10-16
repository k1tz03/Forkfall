/* ═══════════════════════════════════════════════════════════════════════════
   LA BANDE DU LIVRE 10 — « Les Deux Téléphones », une minute (bandes/_livre.js).
   La promesse, sans le secret : 2037, les socios t'élisent présidente sur une seule promesse,
   monter avant que la loi ne ferme l'escalier en 2040 ; le téléphone du bureau pour la ville,
   le clapet dans ta veste pour ceux qui ont payé ta campagne ; sur l'escalier nord, un maçon
   mure une marche par mois. Ce qui reste au livre : qui appelle, qui a écrit la loi, le dernier
   soir.
   Les films : « La première marche » (minuit, deux téléphones, puis le maçon) et « Le match
   d'après » (la Nord à l'heure bleue) — sans rien dire de ce que la Nord porte, ni pourquoi.
   La musique : « Deux téléphones » (livre_h10), ou son master du studio (--musique-studio).
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const bandeDeLivre = require('./_livre');

module.exports = bandeDeLivre({
  id: 'h10',
  livre: 'escalier_ferme', index: 9, graine: 4242,
  titre: 'Les Deux Téléphones', ligne: 'Livre 10 · Présidente · 2037', accent: '#FFB547',
  heros: { prenom: 'Françoise', nom: 'Vasseur', genre: 'f' },
  theme: 'livre_h10',
  extraits: {
    a: { fichier: '${SP}/extraits/premiere_marche.{format}.mp4', de: 0, pose: 2.5, duree: 7.0 },
    b: { fichier: '${SP}/extraits/match_d_apres.{format}.mp4', de: 0, pose: 3.0, duree: 7.4 },
  },
  // le clapet qui sonne à minuit (montrée), puis le maçon de l'escalier nord (glissée)
  cartes: { deux: 'pr.h10.pro6_septembre', trois: 'pr.h10.a1_marche' },
  lieux: { jour: 'buvette', nuit: 'clubhouse' },
  legendes: {
    promesse: { titre: 'Deux téléphones', sous: 'un pour la ville, un pour les autres' },
    intro: { titre: "Les socios t'ont élue", sous: 'sur une seule promesse : monter' },
    carte: { titre: 'Monter avant 2040', sous: 'avant que la porte se ferme' },
    ville: { titre: 'Aubérive, 2037', sous: 'trois saisons avant la loi' },
    objet: { titre: 'Une marche murée par mois', sous: '« par sécurité »' },
    nuit: { titre: 'Le clapet sonne la nuit', sous: 'pour ceux qui ont payé ta campagne' },
    choix: { titre: 'Monter, ou rester en bas ?' },
    fin: { titre: "Ce n'est pas le tien." },
    carte2Ecran: '« Ici Madame Septembre. »',
    finEcran: "Un second clapet. Pas le tien.",
  },
});
