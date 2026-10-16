/* ═══════════════════════════════════════════════════════════════════════════
   LE MODÈLE D'UNE BANDE DE LIVRE — à copier en bandes/h<N>.js, puis :

     NODE_PATH=/opt/node22/lib/node_modules node packages/tools/web/promo/promo.js tout h<N> --sp $SP

   L'exemple ci-dessous est le livre 3, « La Sirène ». À changer pour un autre livre :
     · id, livre (le postulat), index (son rang, 0 à 9), titre, ligne, accent (HISTOIRES) ;
     · theme (musique/livre_h<N>.js) ; sans `morceaux`, la musique part du début du thème
       et dure ~60 s (des mesures entières) ; avec, on choisit ses sections (musique.js) ;
     · extraits : les deux extraits du réalisateur (cinema/tournage.js --de a --a b --formats
       16x9,9x16,4x5 → <film>.<format>.mp4 dans $SP/agents/<branche>/extraits/ ; les branches :
       lot-films-r1 livres 1–2, r2 livres 3–4, r3 5–6, r4 7–8, r5 9–10) ; `de`, d'où partir dans
       l'extrait ; `pose`, la seconde de l'image fixe des captures ; `duree`, si l'extrait ne
       fait pas 7 s ;
     · cartes.deux, cartes.trois : le début de l'id de deux cartes du livre que le moteur
       atteint en jouant à gauche (`simulate.dart --trace <graine> --postulat <index>
       --seasons 1` les liste dans l'ordre) — une scène forte, puis un choix ;
     · lieux.jour, lieux.nuit : deux lieux de la ville (ville/lieux.json) ; éviter ceux du
       bord d'un quartier fermé (on y voit sa brume) — `tourner … --poses` pour vérifier ;
     · les légendes : courtes (≤ 40 signes), au neutre, sans rien dire de ce que le livre
       garde pour sa fin.
   Le premier passage : `tourner h<N> --poses --profils social` (des images fixes, vite),
   regarder les poses (travail/h<N>/clips/*.png), puis `tout h<N>`.
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const bandeDeLivre = require('./_livre');

module.exports = bandeDeLivre({
  id: 'modele_livre',
  livre: 'pepite', index: 2, graine: 1990,
  titre: 'La Sirène', ligne: 'Livre 3 · Joueur · 1990', accent: '#FF9A3C',
  heros: { prenom: 'Pascal', nom: 'Ollier', genre: 'm' },
  theme: 'livre_h3',
  extraits: {
    a: { fichier: '${SP}/agents/lot-films-r2/extraits/<film_a>.{format}.mp4', de: 0, pose: 2 },
    b: { fichier: '${SP}/agents/lot-films-r2/extraits/<film_b>.{format}.mp4', de: 0, pose: 3 },
  },
  cartes: { deux: 'jp.h3.s0_sirene', trois: 'jp.h3.s1_trois_heures' },
  lieux: { jour: 'fontaine', nuit: 'laverie' },
  legendes: {
    promesse: { titre: 'Aubérive, 1990', sous: "l'usine ferme ses portes" },
    intro: { titre: 'Dix-neuf ans', sous: 'la dernière chose que la ville fabrique' },
    carte: { titre: 'Sous ton nom, sur le crochet', sous: "le nom d'un gamin qu'on dit vendu" },
    ville: { titre: 'Une ville qui te regarde', sous: 'jouer pour elle' },
    objet: { titre: 'La sirène de seize heures' },
    nuit: { titre: "L'usine est morte", sous: 'la nuit, sa sirène hurle encore' },
    choix: { titre: 'Qui a vendu le gamin ?' },
    fin: { titre: 'Elle sonne pour toi.' },
    carte2Ecran: 'La dernière sirène de l\'usine',
  },
});
