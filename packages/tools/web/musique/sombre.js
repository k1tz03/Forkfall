/* ---------------------------------------------------------------------------
 * FUSIBLE — la bande originale : « Garde à vue » (sombre), une carte sombre,
 * un événement noir. (C'était « Le Fusible » ; le titre est passé à l'accueil.)
 *
 * Une boîte à musique qui boite (cinq notes contre quatre temps : le motif ne
 * retombe jamais au même endroit), un cœur qui bat et fait respirer la nappe,
 * une basse profonde, un mi bémol partout (le deuxième degré abaissé) ; puis
 * une voix grave qui descend par demi-tons, le triton au milieu ; puis la
 * boîte, seule.
 *
 * La grammaire : audio.js (« L'ÉCRITURE », « LES VOIX ») ; le guide du
 * compositeur : docs/design/bande_originale.md § 6.
 * ------------------------------------------------------------------------- */
(function (A) {
  'use strict';
  // cinq notes (la, ré, fa, mi bémol, ré) qui tournent en croches contre une
  // mesure de huit — il faut cinq mesures pour qu'elles retombent
  var BOITE = [
    'A4 . D5 . F5 . Eb5 . D5 . A4 . D5 . F5 .',
    'Eb5 . D5 . A4 . D5 . F5 . Eb5 . D5 . A4 .',
    'D5 . F5 . Eb5 . D5 . A4 . D5 . F5 . Eb5 .',
    'D5 . A4 . D5 . F5 . Eb5 . D5 . A4 . D5 .',
    'F5 . Eb5 . D5 . A4 . D5 . F5 . Eb5 . D5 .'
  ];
  // un cœur au repos (pas tout à fait), une horloge, un coup de métal
  var COEUR = [
    'k . k . . . . . k . k . . . i .',
    'k . k . . . . . k . k . . . i .',
    'k . k . . . i . k . k . . . i .',
    'k . k . . . . . k . k . . . i .',
    'k . k . . . . . k . k . m . . .'
  ];

  A.theme('sombre', {
    titre: 'Garde à vue', moment: 'une carte sombre, un événement noir', tonalite: 'ré mineur',
    humeur: 'une boîte à musique qui boite, un cœur qui bat, une voix qui descend par demi-tons',
    bpm: 96, gain: 0.95,
    pompe: { prof: 0.5, rel: 0.32 },
    echo: { pas: 3, retour: 0.5, coupe: 1600 },
    voix: {
      boite: { inst: 'cloche', vol: 0.09, faux: 30, echo: 0.4, pan: 0.15 },
      lead:  { inst: 'lead', vol: 0.13, echo: 0.35, pan: -0.1, filtre: 2000 },
      nappe: { inst: 'pad', vol: 0.05, oct: 3, pompe: true },
      basse: { inst: 'sub', vol: 0.15, oct: 2, pompe: true },
      batt:  { vol: 0.6 }
    },
    sections: {
      A: {
        accords: ['Dm', 'Dm', 'Eb', 'Dm', 'A', 'Dm', 'Bb', 'Gm', 'Eb', 'A'],
        boite: BOITE,
        nappe: 'X - - - - - - - - - - - - - - -',
        basse: 'R - - - - - - - - - - - - - - -',
        batt: COEUR
      },
      B: {
        accords: ['Dm', 'Dm', 'Eb', 'Dm', 'A'],
        boite: BOITE,
        lead: [
          'D4 - - - - - - - - - - - A4 - - -',
          'Ab4 - - - - - - - - - - - G4 - - -',
          'F4 - - - - - - - E4 - - - Eb4 - - -',
          'D4 - - - - - - - - - - - - - - -',
          'C#4 - - - - - - - - - - - . . . .'
        ],
        nappe: 'X - - - - - - - - - - - - - - -',
        basse: 'R - - - - - - - - - - - - - - -',
        batt: COEUR
      },
      C: {
        accords: ['Dm', 'Dm', 'Eb', 'Dm', 'A'],
        boite: BOITE,
        nappe: 'X - - - - - - - - - - - - - - -',
        batt: ['b . . . . . . . . . . . i . . .', '. . . . . . . . . . . . i . . .',
               '. . . . . . . . . . . . i . . .', '. . . . . . . . . . . . i . . .',
               '. . . . . . . . m . . . i . . .']
      }
    },
    ordre: ['A', 'B', 'C'], boucle: 0
  });
})(typeof FusibleAudio === 'object' ? FusibleAudio : require('../audio.js'));
