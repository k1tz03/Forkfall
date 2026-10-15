/* ---------------------------------------------------------------------------
 * FUSIBLE — la bande originale : « Néons » (ville_nuit), le soir et la nuit.
 *
 * Un demi-temps lourd, la caisse claire sur le troisième temps, une basse qui
 * pompe en croches, un saxophone de synthèse qui fume, un piano électrique qui
 * plaque à contretemps ; au refrain, un arpège qui clignote comme une
 * enseigne ; à minuit, rien qu'une horloge.
 *
 * La grammaire : audio.js (« L'ÉCRITURE », « LES VOIX ») ; le guide du
 * compositeur : docs/design/bande_originale.md § 6.
 * ------------------------------------------------------------------------- */
(function (A) {
  'use strict';
  A.theme('ville_nuit', {
    titre: 'Néons', moment: 'le soir et la nuit en ville', tonalite: 'fa mineur',
    humeur: 'un demi-temps lourd, un saxophone de synthèse qui fume, une enseigne qui clignote',
    ville: true,
    bpm: 88, gain: 1.05,
    pompe: { prof: 0.55, rel: 0.25 },
    echo: { pas: 3, retour: 0.45, coupe: 1900 },
    voix: {
      lead:  { inst: 'saxo', vol: 0.12, echo: 0.3 },
      ep:    { inst: 'epiano', vol: 0.05, oct: 4, pan: -0.25, echo: 0.2 },
      arp:   { inst: 'pluck', vol: 0.04, oct: 4, pan: 0.35, echo: 0.5, pompe: true },
      nappe: { inst: 'pad', vol: 0.045, oct: 3, pompe: true },
      basse: { inst: 'basse', vol: 0.18, oct: 2, pompe: true },
      batt:  { vol: 0.75 }
    },
    sections: {
      A: {
        accords: ['Fm', 'Fm', 'Db', 'Db', 'Bbm', 'Bbm', 'C', 'C'],
        lead: [
          '. . . . C5 - - - Ab4 - - - F4 - - -',
          'G4 - - - Ab4 - - - C5 - - - - - . .',
          '. . . . Db5 - - - C5 - - - Ab4 - - -',
          'F4 - - - - - - - - - - - . . . .',
          '. . . . Bb4 - - - Db5 - - - F5 - - -',
          'Eb5 - - - Db5 - - - C5 - - - Bb4 - - -',
          'C5 - - - E5 - - - G5 - - - Bb5 - - -',
          'Ab5 - - - G5 - - - E5 - - - . . . .'
        ],
        ep: '. . . . X - - . . . . . X - - .',
        nappe: 'X - - - - - - - - - - - - - - -',
        basse: 'R . R . R . R . R . R . R . R .',
        batt: ['k . h . . . h . S . h . . . h k', 'k . h . . . h k S . h . . . h .']
      },
      B: {
        accords: ['Db', 'Eb', 'Fm', 'Fm', 'Db', 'Eb', 'C', 'C'],
        lead: [
          'F5 - - - - - - - Eb5 - - - Db5 - - -',
          'Eb5 - - - - - - - G5 - - - Bb5 - - -',
          'Ab5 - - - - - - - - - - - G5 - F5 -',
          'F5 - - - - - - - - - - - . . . .',
          'Db6 - - - - - - - C6 - - - Ab5 - - -',
          'Bb5 - - - - - - - G5 - - - Eb5 - - -',
          'E5 - - - - - - - G5 - - - C6 - - -',
          'Bb5 - - - - - - - - - - - . . . .'
        ],
        arp: '1 . 5 . 8 . 5 . 1 . 5 . 8 . 5 .',
        nappe: 'X - - - - - - - - - - - - - - -',
        basse: 'R . R . R . R . R . R . R . R .',
        batt: ['k . h h . . h . S . h h . . h k', 'k . h h . . h k S . h h . . h .']
      },
      C: {
        accords: ['Fm', 'Fm', 'Db', 'C'],
        ep: 'X - - - - - - - - - - - - - - -',
        nappe: 'X - - - - - - - - - - - - - - -',
        basse: 'R - - - - - - - - - - - - - - -',
        batt: ['i . . . i . . . i . . . i . . .', 'i . . . i . . . i . . . i . . .',
               'i . . . i . . . i . . . i . . .', 'i . . . i . . . z . . . i . . .']
      },
      A2: { copie: 'A', arp: '1 . 5 . 8 . 5 . 1 . 5 . 8 . 5 .' }
    },
    ordre: ['A', 'B', 'C', 'A2', 'B'], boucle: 0
  });
})(typeof FusibleAudio === 'object' ? FusibleAudio : require('../audio.js'));
