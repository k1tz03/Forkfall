/* ---------------------------------------------------------------------------
 * FUSIBLE — la bande originale : « La Rive » (match), le samedi au stade.
 *
 * Des tambours de guerre pour entrer, une basse saturée qui martèle mi en
 * octaves avec le fa phrygien qui grince au bout de la mesure, la tribune qui
 * chante en mineur ; au refrain, les claps du virage (deux, puis trois), une
 * sirène qui monte d'un demi-ton, une basse acide ; une charge au demi-temps,
 * et ça repart.
 *
 * La grammaire : audio.js (« L'ÉCRITURE », « LES VOIX ») ; le guide du
 * compositeur : docs/design/bande_originale.md § 6.
 * ------------------------------------------------------------------------- */
(function (A) {
  'use strict';
  var SILENCE = A.SILENCE;
  // la basse en octaves, et ce qui grince à la fin de la mesure
  var RIVE = {
    E:  'E2 E3 E2 E3 E2 E3 E2 E3 E2 E3 E2 E3 G2 G3 F2 F3',
    E2: 'E2 E3 E2 E3 E2 E3 E2 E3 E2 E3 E2 E3 D2 D3 F2 F3',
    F:  'F2 F3 F2 F3 F2 F3 F2 F3 F2 F3 F2 F3 A2 A3 G2 G3',
    C:  'C2 C3 C2 C3 C2 C3 C2 C3 C2 C3 C2 C3 E2 E3 D2 D3',
    B:  'B1 B2 B1 B2 B1 B2 B1 B2 D#2 D#3 D#2 D#3 F#2 F#3 A2 A3'
  };

  A.theme('match', {
    titre: 'La Rive', moment: 'le samedi au stade', tonalite: 'mi phrygien',
    humeur: 'des tambours de guerre, une basse saturée en octaves, la tribune qui chante',
    bpm: 132, gain: 0.85,
    pompe: { prof: 0.55, rel: 0.13 },
    echo: { pas: 3, retour: 0.3, coupe: 3000 },
    voix: {
      choeur: { inst: 'choeur', vol: 0.13 },
      sirene: { inst: 'lead', vol: 0.12, echo: 0.3, pan: 0.2, drive: 2.5, filtre: 4500 },
      acide:  { inst: 'acide', vol: 0.065, oct: 3, pompe: true, echo: 0.2, pan: -0.25 },
      basse:  { inst: 'basse', vol: 0.18, oct: 1, pompe: true, drive: 2, filtre: 1400 },
      batt:   { vol: 0.95 }
    },
    sections: {
      intro: {
        accords: ['Em', 'Em', 'Em', 'Em'],
        choeur: ['E4 - - - - - - - - - - - - - - -', SILENCE,
                 'E4 - - - - - - - G4 - - - - - - -', 'B4 - - - - - - - - - - - . . . .'],
        basse: [SILENCE, SILENCE, 'E2 . E2 . E2 . E2 . E2 . E2 . E2 . E2 .',
                'E2 E2 E2 E2 E2 E2 E2 E2 E2 E2 E2 E2 E2 E2 E2 E2'],
        batt: [
          'T . . T . . T . . . T . T . T .',
          'T . . T . . T . . . T . T T T T',
          'K . . T . . T . K . T . T . T .',
          'K . . T . . T . Kz . T . T T T T'
        ]
      },
      A: {
        accords: ['Em', 'Em', 'F', 'Em', 'Em', 'Em', 'C', 'B7'],
        choeur: [
          'E4 - - - E4 - G4 - B4 - - - - - . .',
          'A4 - - - G4 - - - F#4 - - - E4 - . .',
          'F4 - - - A4 - - - C5 - - - - - . .',
          'B4 - - - - - - - - - - - . . . .',
          'E4 - - - E4 - G4 - B4 - - - E5 - - -',
          'D5 - - - C5 - - - B4 - - - G4 - . .',
          'C5 - - - B4 - - - A4 - - - G4 - - -',
          'F#4 - - - - - - - D#5 - - - - - . .'
        ],
        basse: [RIVE.E, RIVE.E2, RIVE.F, RIVE.E, RIVE.E, RIVE.E2, RIVE.C, RIVE.B],
        batt: ['Kx . h . KS . h . K . h . KS . h h', 'K . h . KS . h . K . h . KS . h h',
               'K . h . KS . h . K . h . KS . h h', 'K . h . KS . h . K . h . KS . h h',
               'K . h . KS . h . K . h . KS . h h', 'K . h . KS . h . K . h . KS . h h',
               'K . h . KS . h . K . h . KS . h h', 'K . h . KS . h . K . T . T T T T']
      },
      B: {
        accords: ['Em', 'Em', 'C', 'C', 'Am', 'Am', 'B7', 'B7'],
        sirene: [
          'E4 - - - - - - - F4 - - - - - - -',
          'E4 - - - - - - - - - - - . . . .',
          'G4 - - - - - - - Ab4 - - - - - - -',
          'G4 - - - - - - - - - - - . . . .',
          'C5 - - - - - - - B4 - - - - - - -',
          'A4 - - - - - - - - - - - . . . .',
          'B4 - - - - - - - C5 - - - - - - -',
          'B4 - - - - - - - D#5 - - - F#5 - - -'
        ],
        acide: '1! 1 8 1 5 1 8 1! 1 1 8 1 5 1 8 5',
        basse: 'R . 8 . R . 8 . R . 8 . R . 8 .',
        batt: ['Kcx . h . Kc . h . Kc . c . KcS . h .', 'K . h . KS . h . K . h . KS . h h']
      },
      charge: {
        accords: ['Em', 'Em', 'F', 'B7'],
        choeur: ['E4 - - - - - - - - - - - - - - -', 'G4 - - - - - - - - - - - - - - -',
                 'A4 - - - - - - - - - - - - - - -', 'B4 - - - - - - - - - - - - - - -'],
        basse: ['E2 - - - - - - - E2 - - - - - - -', 'E2 - - - - - - - E2 - - - - - - -',
                'F2 - - - - - - - F2 - - - - - - -', 'B1 - - - - - - - B1 - - - - - - -'],
        batt: [
          'K . . . . . . . S . . . . . . .',
          'K . . . . . . . S . . . . . . .',
          'K . . T . . T . S . . T . T T T',
          'K . T . T . T . Sz . T . T T T T'
        ]
      }
    },
    ordre: ['intro', 'A', 'B', 'charge', 'A', 'B'], boucle: 1
  });
})(typeof FusibleAudio === 'object' ? FusibleAudio : require('../audio.js'));
