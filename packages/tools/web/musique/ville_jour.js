/* ---------------------------------------------------------------------------
 * FUSIBLE — la bande originale : « La Filature » (ville_jour), la ville le jour.
 *
 * On suit quelqu'un. La basse est le motif (la gamme de blues de mi, la quinte
 * diminuée qui traîne), un pincé qui compte les pas avec son écho ; un pas de
 * côté d'un demi-ton (fa mineur) pour dire qu'on est repéré. La mélodie entre
 * au deuxième passage, l'air de rien ; un arrêt au coin de la rue, la basse qui
 * se rouvre. (La bible prévoit « Promenade » à cette place : sol dorien, 98.)
 *
 * La grammaire : audio.js (« L'ÉCRITURE », « LES VOIX ») ; le guide du
 * compositeur : docs/design/bande_originale.md § 6.
 * ------------------------------------------------------------------------- */
(function (A) {
  'use strict';
  // le motif de basse, sur chaque accord (la gamme de blues : la tierce
  // mineure, la quarte, la quinte diminuée qui traîne, la septième)
  var FIL = {
    E:  'E2 - . E2 . . G2 - A2 . Bb2 B2 . . D3 -',
    E2: 'E2 - . E2 . . G2 - A2 . Bb2 B2 . D3 . E3',
    F:  'F2 - . F2 . . Ab2 - Bb2 . B2 C3 . . Eb3 -',
    A:  'A2 - . A2 . . C3 - D3 . Eb3 E3 . . G3 -',
    C:  'C3 - . C3 . . Eb3 - F3 . F#3 G3 . . Bb3 -',
    B:  'B2 - . B2 . . D#3 - F#3 . A3 - B3 . . .',
    B2: 'C3 - . B2 . . A2 - G2 . F#2 . F2 . E2 .'
  };

  A.theme('ville_jour', {
    titre: 'La Filature', moment: 'la ville le jour', tonalite: 'mi, gamme de blues',
    humeur: 'on suit quelqu’un : une basse en gamme de blues, un pincé qui compte les pas',
    ville: true,
    bpm: 100, swing: 0.1, gain: 1.05,
    pompe: { prof: 0.3, rel: 0.12 },
    echo: { pas: 3, retour: 0.42, coupe: 2200 },
    voix: {
      lead:   { inst: 'lead', epoque: true, vol: 0.115, echo: 0.25, pan: 0.1 },
      harmo:  { inst: 'lead', epoque: true, vol: 0.05, pan: -0.3 },
      gratte: { inst: 'pluck', vol: 0.045, oct: 4, echo: 0.45, pan: 0.35, pompe: true },
      nappe:  { inst: 'pad', vol: 0.026, oct: 3, pompe: true },
      basse:  { inst: 'basse', vol: 0.19, pompe: true, filtre: 2600 },
      batt:   { vol: 0.62 }
    },
    sections: {
      A: {
        accords: ['Em', 'Em', 'Fm', 'Em', 'Am', 'Am', 'B7', 'B7'],
        basse: [FIL.E, FIL.E, FIL.F, FIL.E, FIL.A, FIL.A, FIL.B, FIL.B2],
        gratte: '1 . 5 . . 1 . 5 . . 1 . 5 . 3 .',
        nappe: 'X - - - - - - - - - - - - - - -',
        batt: ['k . h . c . h k . . h . c . h .', 'k . h . c . h k . . h . c . h .',
               'k . h . c . h k . . h . c . h .', 'k . h . c . h k . . h . c . o .',
               'k . h . c . h k . . h . c . h .', 'k . h . c . h k . . h . c . h .',
               'k . h . c . h k . . h . c . h .', 'k . h . c . h k . . h . c c c c']
      },
      B: {
        accords: ['Am', 'Am', 'Em', 'Em', 'C', 'B7', 'Em', 'Em'],
        basse: [FIL.A, FIL.A, FIL.E, FIL.E, FIL.C, FIL.B, FIL.E, FIL.E2],
        lead: [
          '. . . . E5 - - . G5 - E5 . D5 - . .',
          'C5 - - - - - . . A4 - C5 - D5 - Eb5 -',
          'E5 - - - - - - - - - . . . . . .',
          '. . . . B4 - D5 . E5 - G5 . Bb4 - ~B4 -',
          'G5 - - - E5 - - . C5 - - - D5 - Eb5 -',
          'D#5 - - - - - . . F#5 - - . A5 - - -',
          'G5 - - . F#5 - - . E5 - - - - - - -',
          '. . . . . . . . . . . . B4 . D5 .'
        ],
        gratte: '1 . 5 . . 1 . 5 . . 1 . 5 . 3 .',
        nappe: 'X - - - - - - - - - - - - - - -',
        batt: ['k . h . c . h k . . h . c . h .', 'k . h . c . h k . . h . c . o .']
      },
      C: {
        accords: ['Em', 'Em', 'Fm', 'Em'],
        ouvre: { basse: [380, 2600] },
        basse: [FIL.E, FIL.E, FIL.F, FIL.E],
        gratte: '1 . 5 . . 1 . 5 . . 1 . 5 . 3 .',
        batt: ['. . h . . . h . . . h . . . h .', '. . h . . . h . . . h . . . h .',
               'k . h . . . h . k . h . . . h .', 'k . h . c . h k z . h . c . s s']
      },
      B2: { copie: 'B', harmo: true }
    },
    ordre: ['A', 'B', 'C', 'B2'], boucle: 0
  });
})(typeof FusibleAudio === 'object' ? FusibleAudio : require('../audio.js'));
