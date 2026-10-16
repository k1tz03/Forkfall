/* ═══════════════════════════════════════════════════════════════════════════
   LA BANDE DU LIVRE 9 — « Vingt degrés dedans », une minute (bandes/_livre.js).
   La promesse, sans le secret : janvier 2029, un cercueil scellé revenu d'Al-Dorado, un
   électricien de vingt-quatre ans, « malaise » ; sa mère pétrit ton pain ; tu es la première
   sélectionneuse des Cobalts, et le Mondial se joue sous un dôme à vingt degrés ; le ministère
   appelle sans dire son nom, l'émirat envoie une montre ; ton capitaine veut porter un brassard
   noir. Ce qui reste au livre : ce qu'il y a dans le rapport, le vote de 2010, ce que tu feras
   là-bas.
   Les films : « La seconde manche » (le fournil à cinq heures, la chemise de Kévin) et « La
   baie vitrée » (le Dôme, trente-neuf degrés dehors).
   La musique : « Vingt degrés dedans » (livre_h9), ou son master du studio (--musique-studio).
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const bandeDeLivre = require('./_livre');

module.exports = bandeDeLivre({
  id: 'h9',
  livre: 'mondial_hiver', index: 8, graine: 4242,
  titre: 'Vingt degrés dedans', ligne: 'Livre 9 · Sélectionneuse · 2029', accent: '#DDEFFF',
  heros: { prenom: 'Catherine', nom: 'Rocher', genre: 'f' },
  theme: 'livre_h9',
  extraits: {
    // le four du fournil, puis (dès 1,5 s) la chemise noire sur la table farinée, les ciseaux sur la manche
    a: { fichier: '${SP}/extraits/seconde_manche.{format}.mp4', de: 0, pose: 3.0, duree: 7.0 },
    b: { fichier: '${SP}/extraits/baie_vitree.{format}.mp4', de: 0, pose: 3.0, duree: 7.0 },
  },
  // la montre gravée DÔME 2030 (montrée), puis le brassard noir du capitaine (glissée)
  cartes: { deux: 'sl.h9.a2_montre_page', trois: 'sl.h9.pro5_brassard' },
  lieux: { jour: 'boulangerie_residentiel', nuit: 'eglise' },
  legendes: {
    promesse: { titre: 'Un cercueil scellé', sous: "revenu d'Al-Dorado" },
    intro: { titre: 'Janvier 2029', sous: 'la première sélectionneuse des Cobalts' },
    carte: { titre: 'Cause du décès : « malaise »', sous: 'il avait vingt-quatre ans' },
    ville: { titre: 'Aubérive, 2029', sous: 'sa mère pétrit ton pain' },
    objet: { titre: 'Un brassard noir', sous: "taillé dans la chemise d'un mort" },
    nuit: { titre: "Le ministère t'appelle", sous: 'sans dire son nom' },
    choix: { titre: 'Le pays te demande de sourire.' },
    fin: { titre: '« Vous irez quand même ? »' },
    carte2Ecran: "L'émirat envoie une montre",
    finEcran: 'Vingt degrés dedans',
  },
});
