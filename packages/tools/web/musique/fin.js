/* ---------------------------------------------------------------------------
 * FUSIBLE — la bande originale : « Le Dernier Tour » (fin), l'écran de fin.
 *
 * La fin d'une carrière : le motif de La Mèche (l'ancien thème de l'accueil),
 * lent, à la boîte à musique désaccordée, sur un piano électrique qui égrène
 * l'arpège ; plus de batterie, rien qu'une basse ronde. Le thème garde sa
 * copie du motif : l'accueil a changé, la fin ne bouge pas avec lui.
 *
 * La grammaire : audio.js (« L'ÉCRITURE », « LES VOIX ») ; le guide du
 * compositeur : docs/design/bande_originale.md § 6.
 * ------------------------------------------------------------------------- */
(function (A) {
  'use strict';
  // le motif de La Mèche : trois mi répétés (3 + 3 + 2) qui descendent, la
  // réponse qui remonte par le sol dièse
  var MECHE = [
    'E5 - . E5 - . E5 - F5 - E5 - D5 - C5 -',
    'D5 - . C5 - . A4 - - - - - . . . .',
    'C5 - . C5 - . C5 - D5 - C5 - A4 - F4 -',
    'G#4 - . A4 - . B4 - - - - - . . . .'
  ];

  A.theme('fin', {
    titre: 'Le Dernier Tour', moment: "l'écran de fin, l'épilogue", tonalite: 'la mineur',
    humeur: 'le motif de La Mèche, lent, à la boîte à musique désaccordée, sans batterie',
    bpm: 70, gain: 1,
    echo: { pas: 3, retour: 0.45, coupe: 1800 },
    voix: {
      lead:  { inst: 'cloche', vol: 0.13, faux: 26, echo: 0.35 },
      arp:   { inst: 'epiano', vol: 0.032, oct: 3, pan: -0.2, echo: 0.15 },
      nappe: { inst: 'pad', vol: 0.04, oct: 3 },
      basse: { inst: 'sub', vol: 0.14, oct: 2 }
    },
    sections: {
      A: {
        accords: ['Am', 'Am', 'F', 'E', 'Am', 'Am', 'Dm E', 'Am'],
        lead: MECHE.concat([
          'E5 - . E5 - . E5 - F5 - E5 - D5 - C5 -',
          'D5 - . E5 - . A5 - - - G5 - F5 - E5 -',
          'F5 - - - E5 - D5 - E5 - - - G#5 - - -',
          'A5 - - - - - - - . . . . B4 C5 D5 .'
        ]),
        arp: '1 5 8 5 3 5 8 5 1 5 8 5 3 5 8 5',
        nappe: 'X - - - - - - - - - - - - - - -',
        basse: 'R - - - - - - - 5 - - - - - - -'
      },
      B: {
        accords: ['Am', 'Bb', 'Am', 'Bb', 'F', 'G', 'E', 'E'],
        lead: [
          'C6 - - - - - - - B5 - - - A5 - - -',
          'Bb5 - - - - - - - - - - - F5 - - -',
          'A5 - - - - - - - G5 - - - E5 - - -',
          'F5 - - - - - - - D5 - - - - - - -',
          'C6 - - - - - - - A5 - - - F5 - - -',
          'D6 - - - - - - - B5 - - - G5 - - -',
          'G#5 - - - - - - - B5 - - - E6 - - -',
          'D6 - - - - - - - B5 - - - G#5 - - -'
        ],
        arp: '1 5 8 5 3 5 8 5 1 5 8 5 3 5 8 5',
        nappe: 'X - - - - - - - X - - - - - - -',
        basse: 'R - - - - - - - - - - - - - - -'
      }
    },
    ordre: ['A', 'B'], boucle: 0
  });
})(typeof FusibleAudio === 'object' ? FusibleAudio : require('../audio.js'));
