/* ═══════════════════════════════════════════════════════════════════════════
   LA BANDE DU LIVRE 10 — « Les Deux Téléphones », une minute (bandes/_livre.js).
   La promesse, sans le secret : 2037, les socios t'élisent présidente sur une seule promesse,
   monter avant que la loi ne ferme l'escalier en 2040 ; le téléphone du bureau pour la ville,
   le clapet dans ta veste pour ceux qui ont payé ta campagne ; sur l'escalier nord, un maçon
   mure une marche par mois. Ce qui reste au livre : qui appelle, qui a écrit la loi, le dernier
   soir.
   Les films : « La première marche » (son extrait : minuit, les deux téléphones sur le bureau) et
   « Le match d'après » (la Nord à l'heure bleue) — sans rien dire de ce que la Nord porte, ni
   pourquoi.
   La musique : « Deux téléphones » (livre_h10), ou son master du studio (--musique-studio).
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const bandeDeLivre = require('./_livre');

const BAS_PORTRAIT = { '9x16': 'bas', '4x5': 'bas' };

module.exports = bandeDeLivre({
  id: 'h10',
  livre: 'escalier_ferme', index: 9, graine: 4242,
  titre: 'Les Deux Téléphones', ligne: 'Livre 10 · Présidente · 2037', accent: '#FFB547',
  heros: { prenom: 'Françoise', nom: 'Vasseur', genre: 'f' },
  theme: 'livre_h10',
  extraits: {
    // minuit, le bureau du club-house : le téléphone du bureau et le clapet qui s'allument (1,5 à
    // 4,5 s), sous le carton de lieu du film (0,5 à 5 s, en haut à gauche en portrait, x 76 à 539 :
    // l'aperçu de l'App Store prend sa colonne à gauche pour le garder entier) ; le maçon n'y est pas
    a: { fichier: '${SP}/extraits/premiere_marche.{format}.mp4', de: 0, pose: 2.5, duree: 7.0, xAppstore: -1 },
    // le plan 4 du film (19,6 à 27 s) : devant la Nord, Nino lève le premier masque, puis la vague
    // des visages de Gégé — l'extrait de son réalisateur (celui de la liste centrale, le même plan,
    // n'a pas fini de se tourner)
    b: { fichier: '${SP}/agents/lot-films-r5/extraits/match_d_apres.{format}.mp4', de: 0, pose: 3.0, duree: 7.4 },
  },
  // le clapet qui sonne à minuit (montrée), puis le maçon de l'escalier nord (glissée)
  cartes: { deux: 'pr.h10.pro6_septembre', trois: 'pr.h10.a1_marche' },
  lieux: { jour: 'buvette', nuit: 'clubhouse' },
  legendes: {
    // (les cinq premières secondes de l'extrait portent le carton de lieu du film, « Aubérive, le
    // club-house », en haut à gauche en portrait : les légendes du film A descendent)
    promesse: { titre: 'Deux téléphones', sous: 'un pour la ville, un pour les autres', position: BAS_PORTRAIT },
    intro: { titre: "Les socios t'ont élue", sous: 'sur une seule promesse : monter' },
    carte: { titre: 'Monter avant 2040', sous: 'avant que la porte se ferme' },
    ville: { titre: 'Aubérive, 2037', sous: 'trois saisons avant la loi' },
    // (la suite du film A montre les deux téléphones à minuit, juste après la carte du clapet ; la
    // marche murée passe sur le club-house de nuit, avant la carte du maçon)
    objet: { titre: 'Le clapet sonne la nuit', sous: 'pour ceux qui ont payé ta campagne', position: BAS_PORTRAIT },
    nuit: { titre: 'Une marche murée par mois', sous: '« par sécurité »' },
    choix: { titre: 'Monter, ou rester en bas ?' },
    fin: { titre: "Ce n'est pas le tien." },
    carte2Ecran: '« Ici Madame Septembre. »',
    objetEcran: 'Minuit, deux téléphones',
    nuitEcran: 'Le clapet sonne la nuit',
    finEcran: "Un second clapet. Pas le tien.",
  },
  legendesCourt: { objet: { titre: 'Le clapet sonne la nuit', sous: 'pour ceux qui ont payé ta campagne', position: 'bas' } },
});
