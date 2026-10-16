/* ═══════════════════════════════════════════════════════════════════════════
   LA BANDE DU JEU — « Fusible », une minute.
   Le pitch en images : une carrière de football racontée comme un roman noir ; un
   geste, un choix ; une ville en pixels qui se souvient ; dix livres de 1990 à 2050 ;
   le samedi à la Rive et sa décision en direct ; l'album, le dossier 1974, tes
   fantômes, le Fusible ; le film ; la musique (« Fusible », le thème de l'accueil).

   La musique fait le temps : « Fusible », 116 à la noire, une mesure = 2,069 s ;
   l'amorce (4 mesures, la mèche), la mise (4, la basse s'ouvre), A (16, la course),
   le refrain B (la fin). 29 mesures = 60,0 s. L'aperçu de l'App Store : 14 mesures
   (A9 → B6), 29 s, rien que des images du jeu.
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const { depart, enVille, devant, dedans, auStade, FANTOMES, DOSSIER } = require('./_communs');

const B1 = 4242;   // la graine du livre 1 (les mêmes cartes à chaque tournage)
const ECRAN = { '9x16': 'ecran', '16x9': { mode: 'ecran' }, '4x5': 'ecran' };       // l'écran entier du téléphone
const VILLE = { '16x9': { mode: 'ecran' } };                                       // la ville : plein cadre, sauf en 16:9
const A_DROITE = { '16x9': 'droite' };                                             // en 16:9, la légende à droite de l'écran

module.exports = {
  id: 'jeu',
  titre: 'Fusible',
  accent: '#E0164B',                         // la framboise, l'unique accent du jeu
  disponibilite: 'Bientôt sur mobile',       // la ligne de la fin : au porteur d'en décider
  films: { masques: '${SP}/agents/lot-cinema-kit/rendu/trois_mille_masques.{format}.mp4' },

  // ─── les moments du jeu (tournage.js) ─────────────────────────────────────────
  moments: [
    { id: 'nuit_ville', profils: ['social', 'appstore', 'apple'],
      prepare: enVille(0, B1).concat([['tranche', 'nuit']], devant('laverie'), [['zoom', 3], ['attendre', 1.6]]),
      tournage: [['attendre', 0.6], ['pose', 'nuit'], ['touche', 'ArrowDown', 1, 1.3], ['touche', 'ArrowUp', 1, 1.3], ['attendre', 1.2]] },
    { id: 'carte_photo', profils: ['social', 'appstore', 'apple'],
      prepare: depart(0, B1).concat([['attendre', 1.2]]),
      tournage: [['attendre', 1.1], ['pose', 'carte'], ['glisser', 'gauche', { duree: 0.85, ampleur: 0.46, tenue: 0.5, pose: 'glisse' }], ['attendre', 1.8]] },
    { id: 'jour_ville', profils: ['social', 'appstore', 'apple'],
      prepare: enVille(0, B1).concat([['tranche', 'aprem']], devant('fontaine'), [['zoom', 3], ['attendre', 2.0]]),
      tournage: [['attendre', 0.5], ['touche', 'ArrowDown', 1, 1.0], ['toucherPassant', { facultatif: true }], ['attendre', 0.7], ['pose', 'jour'], ['attendre', 1.8]] },
    { id: 'dedans_corner', profils: ['social', 'apple'],
      prepare: enVille(0, B1).concat([['tranche', 'soir']], dedans('bar'), [['zoom', 3], ['attendre', 0.8]]),
      tournage: [['attendre', 1.2], ['pose', 'corner'], ['attendre', 2.2]] },
    { id: 'une_semaine', profils: ['social', 'apple'],
      prepare: depart(0, B1).concat([['avancer', 'v.blocs >= 1 && v.card.beatKind !== "match"'], ['attendre', 2.0]]),
      tournage: [['attendre', 0.3], ['chapitre'], ['attendre', 2.6], ['pose', 'une'], ['attendre', 0.8]] },
    // le carnet : sept cartes, et entre elles la ville — un demi chez Marcel, un café au Quai, les
    // journaux de Simone… (Engine.activite : le lien, l'habitude ; aucune jauge ne bouge)
    { id: 'carnet', profils: ['social', 'apple'],
      prepare: enVille(0, B1).concat([
        ['avancer', 'g >= 7 && v.card.beatKind !== "match"', { reponses: 'gauche', gestes: [
          ['vi_marcel_demi', 'vi_lavergne_cafe', 'presse_trois'], ['vi_marcel_demi', 'steph_series', 'comptoir'], ['vi_marcel_demi', 'vi_lavergne_cafe', 'qr_garage_cafe'],
          ['vi_marcel_demi', 'presse_trois', 'comptoir'], ['vi_marcel_demi', 'vi_lavergne_cafe', 'papiers'], ['vi_marcel_demi'], []] }],
        ['jouerJusqua', '!etat.carte && !etat.cine && !etat.fondu', { max: 60, reponses: 'gauche' }], ['fermerPorte'], ['cacher', '#villeToast, #echoLigne'], ['attendre', 1.0]]),
      tournage: [['attendre', 0.4], ['carnet'], ['attendre', 1.4], ['pose', 'carnet'], ['attendre', 0.8]] },
    { id: 'samedi', profils: ['social', 'appstore', 'apple'],
      prepare: auStade(0, B1),
      tournage: [['attendre', 0.6], ['pose', 'carte'], ['glisser', 'gauche', { duree: 0.6, ampleur: 0.45 }], ['attendre', 2.5], ['pose', 'stade'],
        ['attendreQue', 'etat.direct', 120], ['attendre', 1.5], ['pose', 'decision'], ['cliquer', '#villeDirect .v-direct-g[data-cote="d"]'], ['attendre', 3.2], ['pose', 'apres']] },
    { id: 'scene_livre9', profils: ['social', 'apple'], heros: { prenom: 'Catherine', nom: 'Peyrard', genre: 'f' },
      prepare: [['attendre', 0.3]],
      // le titre, la nef, le gendarme ; puis ce que tu penses : « Je suis celle qui doit emmener… »
      tournage: [['demarrer', 8, 2029], ['attendreQue', 'etat.cine', 30], ['attendre', 1.2], ['scene', 3], ['attendreQue', 'etat.boiteFinie', 12], ['attendre', 0.6], ['pose', 'scene'], ['attendre', 2.4]] },
    { id: 'album', profils: ['social', 'appstore', 'apple'], profil: { recompenses: { pochettes: 6 } },
      prepare: [['eval', 'window.FusibleAlbum._essai.completer("equipes"); window.FusibleAlbum._essai.completer("vestiaire_90"); window.FusibleApercu.accueil();'],
        ['attendre', 1.0], ['cacher', '#albAnnonce'], ['cacher', '.dos-toast']],
      tournage: [['attendre', 0.3], ['album'], ['attendre', 0.7], ['cliquer', '.alb-page[data-page="vestiaire_90"]'], ['attendre', 1.3], ['pose', 'page'],
        ['cliquer', '.alb-retour'], ['attendre', 0.4], ['cliquer', '.alb-offerte'], ['attendre', 0.8], ['pose', 'sachet'], ['cliquer', '[data-a="dechirer"]'],
        ['attendre', 0.7], ['cliquer', '[data-a="retourner"]'], ['attendre', 1.2], ['pose', 'vignette'], ['attendre', 0.8]] },
    { id: 'dossier', profils: ['social', 'apple'], stockage: { 'fusible.fantomes.v1': FANTOMES },
      prepare: [['eval', JSON.stringify(DOSSIER) + '.forEach(function (i) { window.FusibleDossier.trouver(i); }); window.FusibleApercu.accueil();'],
        ['cacher', '.dos-toast'], ['cacher', '#albAnnonce'], ['attendre', 1.0], ['eval', 'document.querySelector("#dossierAccueil").scrollIntoView({ block: "center" })'], ['attendre', 0.6]],
      tournage: [['attendre', 0.4], ['dossier'], ['attendre', 1.5], ['pose', 'dossier'], ['eval', 'window.FusibleApercu.fermer()'], ['attendre', 0.4], ['carrieres'], ['attendre', 1.5], ['pose', 'carrieres'], ['attendre', 0.5]] },
    { id: 'eclair', profils: ['social', 'appstore', 'apple'],
      prepare: [['eval', 'document.querySelector(".fz-go[data-a=\\"jour\\"]").scrollIntoView({ block: "center" })'], ['attendre', 0.8]],
      tournage: [['attendre', 0.4], ['eclair', 'jour'], ['attendre', 1.1], ['pose', 'brief'], ['cliquer', '#fzBrief .fz-go'], ['attendre', 1.0], ['pose', 'carte'],
        ['glisser', 'droite', { duree: 0.55 }], ['attendre', 0.9], ['glisser', 'gauche', { duree: 0.55 }], ['attendre', 1.1], ['pose', 'jauges'], ['attendre', 0.6]] },
    { id: 'accueil_livres', profils: ['social', 'appstore', 'apple'],
      prepare: [['attendre', 1.6]],
      // les cartouches seules (poseElement) à la fin : Playwright fait défiler la page jusqu'à elles
      tournage: [['attendre', 0.9], ['pose', 'haut'],
        ['defiler', '#postulats .postulat[data-index="0"]', { duree: 0.8, marge: 70 }], ['attendre', 0.5], ['pose', 'livres'],
        ['defiler', '#postulats .postulat[data-index="4"]', { duree: 0.7, marge: 70 }], ['attendre', 0.4],
        ['defiler', '#postulats .postulat[data-index="8"]', { duree: 0.7, marge: 70 }], ['attendre', 0.7]]
        .concat([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ['poseElement', '#postulats .postulat[data-index="' + i + '"]', 'c' + i])) },
    { id: 'accueil_haut', profils: ['appstore'],
      prepare: [['attendre', 1.6]],
      tournage: [['attendre', 4.6], ['pose', 'haut']] },
  ],

  // les cartouches de l'accueil (des images du jeu), pour le carton « livres »
  contexte: {
    cartouches: [[0, 1990, 'promu'], [1, 1990, 'interimaire'], [2, 1990, 'pepite'], [3, 1990, 'fin_de_contrat'], [4, 1999, 'geant_dechu'],
      [5, 2003, 'vendre_trente'], [6, 2011, 'apres_fiasco'], [7, 2024, 'le_modele'], [8, 2029, 'mondial_hiver'], [9, 2037, 'escalier_ferme']]
      .map(([i, an, livre]) => ({ image: '${TRAVAIL}/clips/accueil_livres.social.c' + i + '.png', annee: an, livre })),
  },

  // ─── les montages ─────────────────────────────────────────────────────────────
  montages: {
    long: {
      musique: { theme: 'accueil', morceaux: [{ depuis: null, de: 0, a: 29 }], fondu: { sortie: 2.6 } },
      plans: [
        // l'amorce : la mèche, la nappe, la boîte à musique
        { duree: '2m', source: { moment: 'nuit_ville', de: 0.2 }, cadre: VILLE, entree: 'noir', transition: 0.3,
          legende: { titre: 'Une carrière de football', sous: 'racontée comme un roman noir', position: A_DROITE } },
        { duree: '2m', source: { moment: 'carte_photo', de: 0.25 }, cadre: ECRAN,
          legende: { titre: 'Une carte. Un choix.', sous: 'Glisse à gauche ou à droite.', position: A_DROITE } },
        // la mise : la basse s'ouvre — la ville
        { duree: '2m', source: { moment: 'jour_ville', de: 0.2 }, cadre: VILLE,
          legende: { titre: 'Aubérive se souvient', sous: 'de chaque geste, de chaque dette', position: A_DROITE } },
        { duree: '1m', source: { moment: 'dedans_corner', de: 0.4 }, cadre: VILLE,
          legende: { titre: 'Pousse la porte', position: A_DROITE } },
        { duree: '1m', source: { moment: 'carnet', de: { pose: 'carnet', avant: 1.0 } }, cadre: ECRAN,
          legende: { titre: 'On te reconnaît', sous: 'Marcel te garde un verre', position: A_DROITE } },
        // A, la course : ta semaine, les livres, puis ce que le jeu porte
        { duree: '1m', source: { moment: 'une_semaine', de: { pose: 'une', avant: 1.6 } }, cadre: ECRAN,
          legende: { titre: 'Ta semaine à la Une', position: A_DROITE } },
        { duree: '3m', source: { carton: 'livres', titre: 'Dix livres', sous: 'dix vies dans la même ville' } },
        { duree: '2m', source: { moment: 'samedi', de: { pose: 'decision', avant: 1.7 } }, cadre: { '16x9': { mode: 'ecran' }, '4x5': { mode: 'plein', y: 0.55 } },   // en 4:5, la fenêtre descend : la décision entière
          legende: { titre: 'Le samedi, à la Rive', sous: 'cinq secondes pour décider', position: A_DROITE } },
        { duree: '2m', source: { moment: 'scene_livre9', de: { pose: 'scene', avant: 2.6 } }, cadre: VILLE },
        { duree: '1m', source: { moment: 'album', de: { pose: 'sachet', avant: 0.15 } }, cadre: ECRAN,
          legende: { titre: "L'album d'Aubérive", sous: '232 vignettes à coller', position: A_DROITE } },
        { duree: '1m', source: { moment: 'dossier', de: { pose: 'dossier', avant: 1.1 } }, cadre: ECRAN,
          legende: { titre: 'Le dossier 1974', sous: "une enquête d'une carrière à l'autre", position: A_DROITE } },
        { duree: '1m', source: { moment: 'dossier', de: { pose: 'carrieres', avant: 1.1 } }, cadre: ECRAN,
          legende: { titre: 'Tes fantômes', sous: 'chaque carrière hante les suivantes', position: A_DROITE } },
        { duree: '2m', source: { moment: 'eclair', de: { pose: 'brief', avant: 0.5 } }, cadre: ECRAN,
          legende: { titre: 'Le Fusible', sous: 'dix minutes, quatre jauges, ça saute', position: A_DROITE } },
        // le film (livre 1) : la presse, puis la Nord
        { duree: '3m', source: { film: 'masques', de: 5.25 }, entree: 'fondu', transition: 0.5,
          legende: { titre: 'Trois mille masques', sous: 'à ton visage', position: { '16x9': 'bas-gauche', '4x5': 'haut' }, de: 0.5 } },
        // le refrain : les trois mille se lèvent
        { duree: '2m', source: { film: 'masques', de: 28.45 } },
        { duree: 'reste', source: { carton: 'fin', image: '${WEB}/accueil/panorama_crepuscule.webp', phrase: 'Dix romans noirs. Une ville.\nSoixante ans de football.', disponibilite: 'Bientôt sur mobile' },
          entree: 'flash', transition: 0.3 },
      ],
    },
    // l'aperçu de l'App Store : 886 × 1920, 29 s, rien que le jeu (le film en est : il se joue dans le jeu)
    court: {
      musique: { theme: 'accueil', morceaux: [{ depuis: null, de: 16, a: 30 }], fondu: { entree: 0.4, sortie: 2.0 } },
      plans: [
        { duree: '2m', source: { moment: 'carte_photo', de: 0.25 }, legende: { titre: 'Une carrière de football', sous: 'racontée comme un roman noir', position: 'bas' } },   // en bas : le haut de la carte se lit
        { duree: '2m', source: { moment: 'nuit_ville', de: 0.2 }, legende: { titre: 'Aubérive se souvient', sous: 'de chaque geste, de chaque dette' } },
        { duree: '2m', source: { moment: 'accueil_livres', de: { pose: 'livres', avant: 1.2 } }, legende: { titre: 'Dix livres', sous: 'de 1990 à 2050' } },
        { duree: '2m', source: { moment: 'samedi', de: { pose: 'decision', avant: 1.7 } }, legende: { titre: 'Le samedi, à la Rive', sous: 'cinq secondes pour décider' } },
        { duree: '1m', source: { moment: 'album', de: { pose: 'sachet', avant: 0.15 } }, legende: { titre: "L'album d'Aubérive" } },
        { duree: '1m', source: { moment: 'eclair', de: { pose: 'brief', avant: 0.5 } }, legende: { titre: 'Le Fusible', sous: 'dix minutes, quatre jauges' } },
        { duree: '2m', source: { film: 'masques', de: 28.45 } },
        { duree: 'reste', source: { moment: 'accueil_haut', de: 0.2 }, entree: 'fondu', transition: 0.5 },
      ],
    },
  },
  formats: { '9x16': 'long', '16x9': 'long', '4x5': 'long', appstore: 'court' },

  // ─── les captures des boutiques : les deux premières vendent le jeu seules ; Google Play
  // en prend huit (un téléphone), Apple dix : les huit premières tiennent seules ──────────
  ecrans: {
    liste: [
      { legende: 'Ta carrière de football, en roman noir', source: { moment: 'carte_photo', pose: 'glisse' } },
      { legende: 'Une ville en pixels qui se souvient', source: { moment: 'nuit_ville', pose: 'nuit' } },
      { legende: 'Dix livres, de 1990 à 2050', source: { moment: 'accueil_livres', pose: 'livres' } },
      { legende: 'Le samedi, cinq secondes pour décider', source: { moment: 'samedi', pose: 'decision' } },
      { legende: 'Pousse la porte, on te reconnaît', source: { moment: 'dedans_corner', pose: 'corner' } },
      { legende: 'Le Fusible : dix minutes, quatre jauges', source: { moment: 'eclair', pose: 'jauges' } },
      { legende: 'Chaque livre ouvre sur une scène', source: { moment: 'scene_livre9', pose: 'scene' } },
      { legende: '232 vignettes à coller', source: { moment: 'album', pose: 'vignette' } },
      { legende: 'Chaque geste en ville laisse une trace', source: { moment: 'carnet', pose: 'carnet' } },
      { legende: "Le dossier 1974, d'une vie à l'autre", source: { moment: 'dossier', pose: 'dossier' } },
    ],
  },

  // ─── la bannière de Google Play (1024 × 500) ────────────────────────────────────
  // le stade de la Rive à gauche, le titre à droite (Google pose son bouton de lecture au milieu)
  banniere: { image: '${WEB}/accueil/panorama_crepuscule.webp', titre: 'Une carrière de football', recadre: { x: 560, y: 250, l: 1120 }, cote: 'droite' },
};
