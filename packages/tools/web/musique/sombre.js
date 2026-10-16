/* ---------------------------------------------------------------------------
 * FUSIBLE — la bande originale : « Garde à vue » (sombre), une carte sombre,
 * un événement noir.
 *
 * La crispation. Une cellule, la nuit : un cœur qui bat (la grosse caisse et
 * un tom, lent puis pressé), une goutte qui tombe sur deux notes — ré, mi
 * bémol — toutes les cinq doubles croches (elle ne retombe jamais sur le même
 * temps : il faut cinq mesures pour qu'elle revienne), des cordes de synthèse
 * qui frottent (le mi bémol tenu contre le ré, une reese qui colle un
 * demi-ton au-dessus de la voix), une voix qui descend par demi-tons, de ré à
 * la. Et le silence qui pèse : au creux, le cœur ralentit, s'arrête, une
 * mesure entière où il ne reste que la salle, puis un sifflement d'oreille.
 * Ré mineur (le deuxième degré abaissé partout) ; 92.
 *
 *   porte     2 m.  (une fois) les cordes qui montent, le mi bémol qui frotte,
 *                   la porte de la cellule ; le cœur
 *   ── la boucle, 64 mesures, 2 min 47 ──
 *   A        16 m.  la cellule : le cœur lent, la goutte, les cordes sur la
 *                   pédale de ré qui s'éclairent ; la voix ose deux notes
 *   B        16 m.  l'interrogatoire : le cœur pressé, la voix qui descend par
 *                   demi-tons, la reese qui la suit un demi-ton au-dessus
 *   creux     8 m.  le silence : le cœur ralentit et s'arrête, une mesure vide,
 *                   le sifflement, la porte au loin ; le cœur repart
 *   C        16 m.  la nuit qui tourne mal, le sommet : la porte claque au
 *                   troisième temps, la voix à l'octave, doublée ; ré mineur et
 *                   mi bémol qui se bercent sur la pédale
 *   aube      8 m.  la retombée : le cœur lent, les cordes se ferment ; la
 *                   relance
 *
 * Toutes les sections du corps partent d'un premier temps franc (le cœur, la
 * cymbale sourde, les cordes dans la mesure) : le thème peut reprendre à
 * chacune. La grammaire : audio.js (« L'ÉCRITURE », « LES VOIX ») ; le guide
 * du compositeur : docs/design/bande_originale.md § 6.
 * ------------------------------------------------------------------------- */
(function (A) {
  'use strict';
  var SILENCE = A.SILENCE;
  var TENU = '- - - - - - - - - - - - - - - -';
  var NAPPE = 'X - - - - - - - - - - - - - - -';
  function silences(n) { var l = []; for (var i = 0; i < n; i++) l.push(SILENCE); return l; }
  function tenue(note) { return note + ' - - - - - - - - - - - - - - -'; }

  // LA GOUTTE : ré, mi bémol, une note toutes les cinq doubles croches — seize
  // gouttes en cinq mesures, puis elle retombe où elle avait commencé
  var GOUTTE = [
    'D5 . . . . Eb5 . . . . D5 . . . . Eb5',
    '. . . . D5 . . . . Eb5 . . . . D5 .',
    '. . . Eb5 . . . . D5 . . . . Eb5 . .',
    '. . D5 . . . . Eb5 . . . . D5 . . .',
    '. Eb5 . . . . D5 . . . . Eb5 . . . .'
  ];

  // LA VOIX qui descend par demi-tons (ré, do dièse, do, si, si bémol, la), puis
  // le mi bémol qui retombe sur le ré (une quarte suspendue sur si bémol)
  var DESCENTE = [
    'D4 - - - - - - - - - - - . . . .',
    'C#4 - - - - - - - - - - - . . . .',
    'C4 - - - - - - - - - - - - - - -',
    'B3 - - - - - - - . . . . . . . .',
    'Bb3 - - - - - - - - - - - . . . .',
    'A3 - - - - - - - - - - - - - - -',
    'Eb4 - - - - - - - D4 - - - - - - -',
    SILENCE
  ];
  var DESCENTE2 = DESCENTE.slice(0, 6).concat(['Bb3 - - - - - - - G3 - - - - - - -', 'A3 - - - - - - - - - - - . . . .']);
  var DESCENTE_HAUTE = [
    'D5 - - - - - - - - - - - . . . .',
    'C#5 - - - - - - - - - - - . . . .',
    'C5 - - - - - - - - - - - - - - -',
    'B4 - - - - - - - . . . . . . . .',
    'Bb4 - - - - - - - - - - - . . . .',
    'A4 - - - - - - - - - - - - - - -',
    'Eb5 - - - - - - - D5 - - - - - - -',
    SILENCE
  ];
  // la voix bercée entre la et si bémol (ré mineur, mi bémol sur ré), puis elle retombe
  var BERCE = [
    tenue('A4'), tenue('Bb4'),
    'A4 - - - - - - - - - - - F4 - - -',
    'G4 - - - - - - - - - - - Bb4 - - -',
    'Bb4 - - - - - - - A4 - - - - - - -',
    tenue('G4'),
    'G4 - - - - - - - - - - - F4 - - -',
    'E4 - - - - - - - - - - - . . . .'
  ];
  // la reese qui frotte : un demi-ton au-dessus de la voix, puis le mi bémol tenu
  var COLLE = [tenue('Eb4'), tenue('D4'), tenue('C#4'), tenue('C4'), tenue('B3'), tenue('Bb3'), SILENCE, SILENCE];
  var COLLE_HAUT = [tenue('Eb5'), tenue('D5'), tenue('C#5'), tenue('C5'), tenue('B4'), tenue('Bb4'), SILENCE, SILENCE];
  var MIB = [tenue('Eb4'), TENU, TENU, TENU];
  // le bourdon : la pédale de ré, tout au fond (seulement là où l'harmonie repose sur ré)
  var RE = [tenue('D2'), TENU, TENU, TENU];

  // LE CŒUR : la grosse caisse (le premier coup), le tom (le second) ; lent, puis pressé
  var P_LENT = 'D3 . . . . . . . D3 . . . . . . .';
  var P_VITE = 'D3 . . . D3 . . . D3 . . . D3 . . .';
  var P_RATE = 'D3 . . . D3 . . . . . . . D3 . . .';
  var P_UN = 'D3 . . . . . . . . . . . . . . .';
  var C_LENT = 'k . t . . . . . k . t . . . . .';
  var C_LENT_X = 'kx . t . . . . . k . t . . . . .';
  var C_VITE = 'k t . . k t . . k t . . k t . .';
  var C_VITE_X = 'kx t . . k t . . k t . . k t . .';
  var C_RATE = 'k t . . k t . . . . . . k t . .';                // il rate un battement
  var C_PORTE = 'k t . . k t . . S . . . k t . .';                // la porte claque au troisième temps : le cœur s'y arrête
  var C_PORTE_X = 'kx t . . k t . . S . . . k t . .';
  var P_PORTE = 'D3 . . . D3 . . . . . . . D3 . . .';

  A.theme('sombre', {
    titre: 'Garde à vue', moment: 'une carte sombre, un événement noir', tonalite: 'ré mineur',
    humeur: 'un cœur qui bat, une goutte sur deux notes, des cordes qui frottent, le silence qui pèse',
    bpm: 92, gain: 1.5,
    pompe: { prof: 0.3, rel: 0.35 },
    echo: { pas: 3, retour: 0.5, coupe: 1500 },
    salle: { taille: 0.8, duree: 3.4, ton: 2600 },
    cassette: { sature: 1, coupe: 9000, bas: 45, souffle: 0.005, flotte: { prof: 4, vit: 0.3 } },
    voix: {
      lead:   { inst: 'vox', vol: 0.11, voyelle: 'ou', vers: 'o', rev: 0.5, echo: 0.2, flotte: { prof: 12, vit: 0.28 }, pan: 0.05 },
      harmo:  { inst: 'vox', vol: 0.06, voyelle: 'o', vers: 'ou', rev: 0.5, flotte: { prof: 12, vit: 0.28 }, pan: -0.25 },
      goutte: { inst: 'pluck2', vol: 0.13, echo: 0.45, rev: 0.35, pan: 0.25, ton: [2000, 600, 0.05], env: [0.006, 0.2, 0, 0.15], filtre: 3000 },
      cordes: { inst: 'supersaw', vol: 0.15, oct: 3, scies: 5, desaccord: 20, large: 0.8, rev: 0.5, pompe: true,
                flotte: { prof: 10, vit: 0.25 }, filtre: 1800, env: [0.9, 1.5, 0.8, 0.7] },
      frotte: { inst: 'reese', vol: 0.075, desaccord: 14, chaleur: 1.4, rev: 0.4, flotte: { prof: 8, vit: 0.3 }, env: [0.6, 1, 0.9, 0.6], pan: -0.15 },
      pouls:  { inst: 'sqbasse', vol: 0.065, ton: [700, 220, 0.04], env: [0.002, 0.16, 0, 0.08] },
      bourdon:{ inst: 'sub', vol: 0.06, pompe: true, env: [1.2, 1, 0.9, 1] },
      aigu:   { inst: 'sub', vol: 0.025, rev: 0.6, echo: 0.3, flotte: { prof: 6, vit: 0.2 }, env: [1.2, 1, 0.9, 1.2] },
      batt:   { vol: 0.38, porte: 0.25, tenue: 0.3, rev: 0.3, filtre: 6000 }
    },
    sections: {
      // ── l'introduction, jouée une fois ──
      porte: {
        accords: ['Dm', 'Dm'],
        cordes: [NAPPE, TENU],
        frotte: [tenue('Eb4'), TENU],
        pouls: [SILENCE, P_LENT],
        batt: ['. . . . . . . . m . . . . . . .', C_LENT]
      },
      // ── la boucle ──
      A: {
        accords: ['Dm', 'Dm', 'Dm', 'Dm', 'Bb/D', 'Bb/D', 'Gm/D', 'Gm/D', 'Dm', 'Dm', 'Eb/D', 'Eb/D', 'Gm/D', 'Gm/D', 'A7/C#', 'A7/C#'],
        ouvre: { cordes: [900, 1800] },
        cordes: [NAPPE, TENU, TENU, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU],
        frotte: MIB,
        goutte: GOUTTE,
        bourdon: RE.concat(RE, RE, [tenue('D2'), TENU, SILENCE, SILENCE]),
        lead: silences(12).concat([tenue('D4'), TENU, tenue('C#4'), '- - - - - - - - . . . . . . . .']),
        pouls: [P_LENT, P_LENT, P_LENT, P_LENT, P_LENT, P_LENT, P_LENT, P_LENT, P_LENT, P_LENT, P_LENT, P_UN, P_LENT, P_LENT, P_LENT, P_LENT],
        batt: [C_LENT_X, C_LENT, C_LENT, C_LENT, C_LENT, C_LENT, C_LENT, C_LENT,
               C_LENT, C_LENT, C_LENT, 'k . t . . . . . . . . . . . . .', C_LENT, C_LENT, C_LENT, 'k . t . . . . . kz . t . . . . .']
      },
      B: {
        accords: ['Dm', 'A/C#', 'C', 'G/B', 'Gm/Bb', 'A', 'Bb', 'A', 'Dm', 'A/C#', 'C', 'G/B', 'Gm/Bb', 'A7', 'Eb', 'A7'],
        cordes: NAPPE,
        lead: DESCENTE.concat(DESCENTE2),
        frotte: COLLE.concat(MIB, MIB),
        goutte: GOUTTE,
        pouls: [P_VITE, P_VITE, P_VITE, P_VITE, P_VITE, P_VITE, P_VITE, P_RATE, P_VITE],
        batt: [C_VITE_X, C_VITE, C_VITE, C_VITE, C_VITE, C_VITE, C_VITE, C_RATE,
               C_VITE_X, C_VITE, C_VITE, C_VITE, C_VITE, C_VITE, C_VITE, 'k t . . k t . . kz t . . k t . .']
      },
      creux: {
        accords: ['Dm', 'Dm', 'Dm', 'Dm', 'Bb/D', 'Bb/D', 'A', 'A'],
        ouvre: { cordes: [1200, 700] },
        cordes: [NAPPE, TENU, SILENCE, SILENCE, NAPPE, TENU, NAPPE, TENU],
        frotte: [tenue('Eb4'), TENU, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE],
        bourdon: [tenue('D2'), '- - - - - - - - - - - - . . . .', SILENCE, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE],
        goutte: [GOUTTE[0], GOUTTE[1], GOUTTE[2], SILENCE, SILENCE, GOUTTE[3], GOUTTE[4], GOUTTE[0]],
        aigu: [SILENCE, SILENCE, SILENCE, SILENCE, tenue('A5'), '- - - - - - - - - - - - . . . .', SILENCE, SILENCE],
        pouls: [P_LENT, P_UN, P_UN, SILENCE, SILENCE, SILENCE, P_LENT, P_VITE],
        batt: [C_LENT_X, 'k . t . . . . . . . . . . . . .', 'k . . . . . . . . . . . . . . .', SILENCE,
               SILENCE, '. . . . . . . . m . . . . . . .', C_LENT, 'k t . . k t . . kz t . . k t . .']
      },
      C: {
        accords: ['Dm', 'A/C#', 'C', 'G/B', 'Gm/Bb', 'A', 'Bb', 'A', 'Dm', 'Eb/D', 'Dm', 'Eb/D', 'Gm/D', 'A7/C#', 'Eb', 'A7'],
        harmo: true,
        ouvre: { cordes: [1800, 3000] },
        cordes: NAPPE,
        lead: DESCENTE_HAUTE.concat(BERCE),
        frotte: COLLE_HAUT.concat(MIB, MIB),
        bourdon: silences(8).concat(RE, [tenue('D2'), SILENCE, SILENCE, SILENCE]),
        goutte: GOUTTE,
        pouls: P_PORTE,
        batt: [C_PORTE_X, C_PORTE, C_PORTE, C_PORTE, C_PORTE, C_PORTE, C_PORTE, C_RATE,
               C_PORTE_X, C_PORTE, C_PORTE, C_PORTE, C_PORTE, C_PORTE, C_PORTE, 'k t . . k t . . S . . . k t T T']
      },
      aube: {
        accords: ['Dm', 'Dm', 'Bb/D', 'Bb/D', 'Gm/D', 'Gm/D', 'A7/C#', 'A7/C#'],
        ouvre: { cordes: [1800, 900] },
        cordes: [NAPPE, TENU],
        frotte: MIB,
        goutte: GOUTTE,
        bourdon: RE.concat([tenue('D2'), TENU, SILENCE, SILENCE]),
        pouls: [P_LENT, P_LENT, P_LENT, P_LENT, P_LENT, P_LENT, P_LENT, 'D3 . . . . . . . D3 . . . D3 . . .'],
        batt: [C_LENT_X, C_LENT, C_LENT, C_LENT, C_LENT, C_LENT, C_LENT, 'k . t . . . . . kz . t . k t . .']
      }
    },
    ordre: ['porte', 'A', 'B', 'creux', 'C', 'aube'], boucle: 1
  });
})(typeof FusibleAudio === 'object' ? FusibleAudio : require('../audio.js'));
