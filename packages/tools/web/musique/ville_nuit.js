/* ---------------------------------------------------------------------------
 * FUSIBLE — la bande originale : « Néons » (ville_nuit), le soir et la nuit
 * en ville, dans les dix livres.
 *
 * Ralenti, moite, délavé. Une nappe de grandes scies qui ondule comme une
 * bande qui a pris l'eau (le flottement le plus profond de la bande
 * originale), une basse ronde en demi-temps, une caisse « gated » énorme sur
 * le troisième temps ; un saxophone de synthèse qui entre toujours en retard
 * et glisse d'une note à l'autre ; et une enseigne au néon qui grésille — un
 * carré nasillard qui clignote par saccades, jamais au même endroit. Les
 * accords glissent d'un demi-ton (fa mineur, sol bémol majeur avec sa
 * septième : le fa qui reste allumé), comme l'enseigne entre deux états. Fa
 * mineur ; 82.
 *
 *   allumage  4 m.  (une fois) l'enseigne qui s'allume par saccades, la nappe
 *                   qui monte, la basse, un roulement de caisse
 *   ── la boucle, 88 mesures, 4 min 18 ──
 *   A        16 m.  le boulevard : la basse, la nappe, l'enseigne ; le saxophone
 *                   sur la seconde moitié, en retard sur chaque temps
 *   B        16 m.  les néons : les accords qui clignotent d'un demi-ton, le
 *                   saxophone qui monte (le refrain) ; puis le piano du bar
 *                   qui répond, l'enseigne seule au-dessus
 *   minuit   16 m.  le creux : une horloge, la basse en notes longues, la nappe
 *                   fermée, le piano électrique d'un bar qui ferme
 *   A2       16 m.  le boulevard encore : la basse qui marche un peu plus, le
 *                   piano d'abord, puis le saxophone harmonisé
 *   C        16 m.  la nuit au plus haut : la nappe qui s'ouvre, les claps dans
 *                   la caisse, le saxophone au plus aigu, harmonisé
 *   retour    8 m.  l'enseigne seule, la basse qui se referme, la relance
 *
 * La grammaire : audio.js (« L'ÉCRITURE », « LES VOIX ») ; le guide du
 * compositeur : docs/design/bande_originale.md § 6.
 * ------------------------------------------------------------------------- */
(function (A) {
  'use strict';
  var SILENCE = A.SILENCE;
  var TENU = '- - - - - - - - - - - - - - - -';
  var NAPPE = 'X - - - - - - - - - - - - - - -';
  var NAPPE2 = 'X - - - - - - - X - - - - - - -';
  var RACINE = 'R - - - - - - - - - - - - - - -';
  function silences(n) { var l = []; for (var i = 0; i < n; i++) l.push(SILENCE); return l; }

  // ── la basse ronde, en demi-temps : une note qui tient, l'octave qui pousse ──
  var DEMI = ['R - - - - - - - - - - 8 - - . .', 'R - - - - - - - - - - 5 - 8 - .'];
  var DEMI2 = ['R - - - - - R - . . . 8 - - 5 -', 'R - - - - - R - . . 7 - 8 - 5 -'];

  // ── l'enseigne : un carré nasillard, des saccades qui ne retombent jamais pareil ──
  var NEON = ['8 8 . . . . . . 8 . 8 8 . . . .', '. . . . 8 . 8 8 8 . . . . . 5 .'];
  var NEON_VIF = ['8 8 . 8 . . 5 . 8 . . 8 8 . . 5', '. 8 . 8 8 . . 5 . . 8 . 8 . 5 .'];
  var NEON_ALLUME = ['8 . . . . . . . . . . 8 8 . . .', '8 8 . . . . . . 8 . . . 8 8 8 .'];

  // ── le saxophone : il entre en retard, glisse, retombe ──
  var SAX_A = [
    '. . C5 - - Eb5 - - F5 - - - - - - -',
    '- - - - . . Eb5 - ~F5 - - - Eb5 - C5 -',
    '. C5 - - - - - - - - - - Ab4 - - -',
    '. . Bb4 - - Db5 - - ~F5 - - - - - - -',
    '- - - - . . Ab5 - - - - - ~F5 - - -',
    '- - - - - - - - . . Eb5 - Db5 - - -',
    '. . C5 - - - - - . . E5 - - - G5 -',
    'Bb4 - - - - - - - - - - - . . . .'
  ];
  // le refrain : il monte, la septième majeure de sol bémol (le fa) qui reste allumée
  var SAX_B = [
    '. . F5 - - - Ab5 - - - C6 - - - - -',
    '- - - - Bb5 - - - ~Db6 - - - - - - -',
    '. . C6 - - - Ab5 - - - F5 - - - Eb5 -',
    'F5 - - - - - - - - - - - . . . .',
    '. . Ab5 - - - F5 - - - C5 - - - Db5 -',
    '. . . . . . F5 - Eb5 - - - Db5 - - -',
    '. . E5 - - - G5 - - - Bb5 - - - ~Ab5 -',
    'G5 - - - - - - - - - - - . . . .'
  ];
  // la nuit au plus haut
  var SAX_C = [
    '. . Ab5 - - - - - C6 - - - - - - -',
    '- - - - . . Bb5 - - - G5 - - - Eb5 -',
    'F5 - - - - - - - - - - - . . . .',
    '. . . . . . C5 - Eb5 - F5 - Ab5 - C6 -',
    '~Db6 - - - - - - - C6 - - - - - - -',
    '- - - - . . Bb5 - - - G5 - - - - -',
    '. . F5 - - - Gb5 - - - Bb5 - - - Db6 -',
    'C6 - - - - - - - ~Bb5 - - - G5 - E5 -'
  ];

  // ── le piano électrique d'un bar ──
  var EP_REPONSE = ['. . X . . . . . . . X . . . . .', '. . . . . . X . . . . . . . 5 .'];
  var EP_MINUIT = [
    '. . X - - - - - - - - - - - - -',
    '. . . . . . . . . . C5 - Eb5 - F5 -',
    'Ab5 - - - - - - - G5 - - - Eb5 - - -',
    'F5 - - - - - - - . . . . . . . .',
    '. . X - - - - - - - - - - - - -',
    '. . . . . . . . . . Ab4 - C5 - Eb5 -',
    'F5 - - - - - - - Eb5 - - - C5 - - -',
    'Db5 - - - - - - - . . . . . . . .',
    '. . X - - - - - - - - - - - - -',
    '. . . . . . . . F5 - - - Db5 - - -',
    '. . X - - - - - - - - - - - - -',
    '. . . . . . . . Bb4 - - - F5 - - -',
    '. . X - - - - - - - - - - - - -',
    SILENCE,
    '. . X - - - - - - - - - - - - -',
    '. . X - - - - - . . . . . . . .'
  ];
  var EP_APPEL = ['. . X - - - - - . . . . . . . .', '. . . . . . . . . . 5 . 8 . 9 .'];

  // ── la batterie en demi-temps : la grosse caisse sur le un, la caisse énorme sur le trois ──
  var D_NUIT = 'k . h . . . h . S . h . . . h .';
  var D_NUIT_X = 'kx . h . . . h . S . h . . . h .';
  var D_NUIT2 = 'k . h . . . h . S . h k . . h .';
  var D_NUIT_FIN = 'k . h . . . h . S . h . S . S S';
  var D_NUIT_PASSE = 'k . h . . . h . S . h k . . h h';
  var D_NEON = 'k . h . . . h . Sc . h . . . h .';
  var D_NEON_X = 'kx . h . . . h . Sc . h . . . h .';
  var D_NEON_FIN = 'k . h . . . h . Sc . h . S . S S';
  var D_HAUT = 'k . h h . . h k Sc . h h . . h .';
  var D_HAUT_X = 'kx . h h . . h k Sc . h h . . h .';
  var D_HAUT_FIN = 'k . h h . . h k Sc . t . t T S S';
  var D_HORLOGE = 'i . . . i . . . i . . . i . . .';

  function nuit(x, n, n2, passe, fin) {
    return [x, n, n, n2, n, n, n, passe, x, n, n, n2, n, n, n, fin];
  }

  A.theme('ville_nuit', {
    titre: 'Néons', moment: 'le soir et la nuit en ville', tonalite: 'fa mineur',
    humeur: 'ralenti, moite, délavé : une nappe qui ondule, un saxophone en retard, une enseigne qui grésille',
    ville: true,
    bpm: 82, gain: 1.75,
    pompe: { prof: 0.4, rel: 0.4 },
    echo: { pas: 3, retour: 0.45, coupe: 1800 },
    salle: { taille: 0.9, duree: 4, ton: 3200 },
    cassette: { sature: 1.1, coupe: 8500, bas: 45, souffle: 0.006, flotte: { prof: 5, vit: 0.25 } },
    voix: {
      lead:  { inst: 'saxo', vol: 0.12, echo: 0.3, rev: 0.45, flotte: { prof: 10, vit: 0.3 }, filtre: 3200, pan: 0.06 },
      harmo: { inst: 'saxo', vol: 0.05, echo: 0.15, rev: 0.45, pan: -0.3 },
      brume: { inst: 'supersaw', vol: 0.1, oct: 3, scies: 5, desaccord: 20, large: 0.9, rev: 0.5, pompe: true,
               flotte: { prof: 24, vit: 0.2 }, filtre: 2200, env: [0.6, 1, 0.9, 0.45] },
      neon:  { inst: 'pulse', duty: 0.125, vol: 0.04, oct: 4, env: [0.002, 0.07, 0.25, 0.04], echo: 0.5, rev: 0.25,
               pan: 0.35, filtre: 3600 },
      ep:    { inst: 'epiano', vol: 0.07, oct: 4, rev: 0.45, echo: 0.2, pan: -0.25 },
      basse: { inst: 'basse', vol: 0.12, oct: 2, pompe: true, drive: 1, filtre: 1600, ton: [900, 380, 0.12] },
      batt:  { vol: 0.45, porte: 0.6, tenue: 0.3, rev: 0.35, filtre: 9000 }
    },
    sections: {
      // ── l'introduction, jouée une fois : l'enseigne s'allume ──
      allumage: {
        accords: ['Fm7', 'Gbmaj7', 'Fm7', 'Csus4 C7'],
        ouvre: { brume: [500, 2200] },
        neon: NEON_ALLUME.concat(NEON),
        brume: [NAPPE, NAPPE, NAPPE, NAPPE2],
        basse: [SILENCE, SILENCE, DEMI[0], DEMI[1]],
        batt: [SILENCE, SILENCE, 'k . . . . . . . . . . . . . . .', 'k . . . . . . . S . . . S . S S']
      },
      // ── la boucle ──
      A: {
        accords: ['Fm7', 'Fm7', 'Dbmaj7', 'Gbmaj7', 'Bbm7', 'Bbm7', 'Csus4', 'C7',
                  'Fm7', 'Ab', 'Dbmaj7', 'Gbmaj7', 'Bbm7', 'Db', 'Csus4 C7', 'C7'],
        basse: DEMI,
        brume: [NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE2, NAPPE],
        neon: NEON,
        lead: silences(8).concat(SAX_A),
        batt: nuit(D_NUIT_X, D_NUIT, D_NUIT2, D_NUIT_PASSE, D_NUIT_FIN)
      },
      B: {
        accords: ['Fm7', 'Gbmaj7', 'Fm7', 'Gbmaj7', 'Dbmaj7', 'Dbmaj7', 'C7', 'C7',
                  'Fm7', 'Gbmaj7', 'Fm7', 'Gbmaj7', 'Bbm7', 'Dbmaj7', 'Csus4 C7', 'C7'],
        basse: DEMI,
        brume: [NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE2, NAPPE],
        neon: NEON_VIF,
        lead: SAX_B.concat(silences(8)),
        ep: silences(8).concat([EP_REPONSE[0], EP_REPONSE[1], EP_REPONSE[0], EP_REPONSE[1],
                                EP_REPONSE[0], EP_REPONSE[1], EP_REPONSE[0], SILENCE]),
        batt: nuit(D_NEON_X, D_NEON, D_NEON, D_NEON, D_NEON_FIN)
      },
      // le creux : à minuit, rien qu'une horloge et le piano d'un bar qui ferme
      minuit: {
        accords: ['Fm7', 'Fm7', 'Fm7', 'Fm7', 'Dbmaj7', 'Dbmaj7', 'Dbmaj7', 'Dbmaj7',
                  'Bbm7', 'Bbm7', 'Gbmaj7', 'Gbmaj7', 'Fm7', 'Fm7', 'Csus4', 'C7'],
        ouvre: { brume: [700, 1400], basse: [500, 1000] },
        basse: [RACINE, TENU, TENU, TENU, RACINE, TENU, TENU, TENU, RACINE, TENU, RACINE, TENU, RACINE, TENU, RACINE, RACINE],
        brume: silences(8).concat([NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE]),
        ep: EP_MINUIT,
        batt: ['kx . . . i . . . i . . . i . . .', D_HORLOGE, D_HORLOGE, D_HORLOGE,
               D_HORLOGE, D_HORLOGE, D_HORLOGE, D_HORLOGE, D_HORLOGE, D_HORLOGE, D_HORLOGE, D_HORLOGE,
               'k . . . i . . . i . . . i . . .', 'k . . . i . . . i . . . i . . .',
               'k . . . i . . . S . . . i . . .', 'k . . . i . . . S . . . S . S S']
      },
      A2: {
        copie: 'A', harmo: true,
        basse: DEMI2,
        neon: NEON_VIF,
        ep: [EP_APPEL[0], EP_APPEL[1], EP_APPEL[0], EP_APPEL[1], EP_APPEL[0], EP_APPEL[1], EP_APPEL[0], SILENCE]
          .concat(silences(8)),
        batt: nuit(D_NUIT_X, D_NUIT2, D_NUIT, D_NUIT_PASSE, D_NUIT_FIN)
      },
      // la nuit au plus haut
      C: {
        accords: ['Dbmaj7', 'Eb', 'Fm7', 'Fm7', 'Dbmaj7', 'Eb', 'Gbmaj7', 'C7',
                  'Dbmaj7', 'Eb', 'Fm7', 'Ab', 'Bbm7', 'Gbmaj7', 'Csus4 C7', 'C7'],
        harmo: true,
        ouvre: { brume: [2200, 3400] },
        basse: DEMI2,
        brume: [NAPPE, NAPPE, NAPPE, TENU, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE2, NAPPE],
        neon: NEON_VIF,
        lead: SAX_C.concat(silences(8)),
        ep: silences(8).concat([EP_REPONSE[0], EP_REPONSE[1], EP_REPONSE[0], EP_REPONSE[1],
                                EP_REPONSE[0], EP_REPONSE[1], EP_REPONSE[0], SILENCE]),
        batt: nuit(D_HAUT_X, D_HAUT, D_HAUT, D_HAUT, D_HAUT_FIN)
      },
      retour: {
        accords: ['Fm7', 'Gbmaj7', 'Fm7', 'Gbmaj7', 'Fm7', 'Gbmaj7', 'Csus4', 'C7'],
        ouvre: { basse: [1600, 400], brume: [1400, 500] },
        basse: DEMI,
        neon: NEON,
        brume: [NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE],
        batt: [D_NUIT_X, D_NUIT, D_NUIT, D_NUIT2, D_NUIT, D_NUIT, D_NUIT_PASSE, D_NUIT_FIN]
      }
    },
    ordre: ['allumage', 'A', 'B', 'minuit', 'A2', 'C', 'retour'], boucle: 1
  });
})(typeof FusibleAudio === 'object' ? FusibleAudio : require('../audio.js'));
