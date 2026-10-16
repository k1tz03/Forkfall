/* ---------------------------------------------------------------------------
 * FUSIBLE — la bande originale : « Le Répondeur » (livre_h2), la ville le
 * jour dans le livre 2, « Le Sapin en carton », et son introduction.
 *
 * Une berline grise sur la place peinte, la pluie sur la tôle, et le lundi à
 * sept heures un répondeur qui parle avec la voix de l'absent. Le bip est un
 * sinus pur sur si (988 Hz : à vingt cents du kilohertz des répondeurs, et
 * c'est la tonique) ; après
 * lui, le piano électrique dit le message sur la prosodie de la phrase (« C'est
 * Roland. Ne mets pas Bréhaut samedi. » : ré, do dièse, si — puis la, si, do
 * dièse, ré…), sans un mot. La basse ne marche pas : elle tient, puis glisse —
 * elle remonte à l'octave en fin de mesure et plonge sur la racine suivante,
 * comme des pneus sur l'eau. Les essuie-glaces battent au contretemps (le
 * cerclage), la caisse « gated » tombe au troisième temps, un demi-temps qui
 * traîne ; les gouttes sur le pare-brise, une voiture qui passe (la montée).
 * Si mineur, des septièmes ; la basse descend en lamento (si, la, sol, fa
 * dièse). 90.
 *
 * Ce qui n'est qu'à lui dans la bande : le bip (un sinus seul), le piano
 * électrique qui parle, la basse qui plonge d'octave en glissant, les
 * essuie-glaces, la cassette la plus fatiguée (le répondeur à microcassette).
 *
 *   intro    4 m.  (une fois) la pluie, la brume, le bip ; la basse glisse,
 *                  les essuie-glaces partent
 *   ── la boucle, 96 mesures, 4 min 16 ──
 *   A       16 m.  lundi, sept heures : le bip, le message (deux fois),
 *                  entre les deux le piano seul sur la basse qui glisse
 *   B       16 m.  la berline : le relatif (sol, fa dièse, mi, ré), la basse
 *                  plus mobile, une ligne lointaine (les phares dans la pluie)
 *                  puis huit mesures sans mélodie
 *   C        8 m.  le creux, la cabine : la basse tenue, le bip sans réponse,
 *                  les pièces qui tombent, la pluie
 *   A2      16 m.  lundi suivant : deux autres messages (« Garde le banc »),
 *                  le charleston de la pluie
 *   D       16 m.  le wagon : ré majeur, la radio à piles joue le message en
 *                  petit, la basse marche ; puis le piano reprend, au chaud
 *   E       16 m.  la Rive : le sommet — la reese, la grande nappe, le
 *                  message crié à l'octave sur le napolitain (do majeur) ; le
 *                  bip dont la pile meurt (il glisse vers le bas)
 *   retour   8 m.  la retombée : la pluie, le bip, puis le groove qui relance
 *
 * La courbe : A 5 → B 6 → C 2 → A2 5 → D 3 puis 5 → E 8 → retour 3 → 4. Le
 * message tient un quart de la boucle ; le reste, le piano et la basse.
 *
 * La grammaire : audio.js (« L'ÉCRITURE », « LES VOIX ») ; le guide du
 * compositeur : docs/design/bande_originale.md § 6.
 * ------------------------------------------------------------------------- */
(function (A) {
  'use strict';
  var SILENCE = A.SILENCE;
  var TENU = '- - - - - - - - - - - - - - - -';
  var NAPPE = 'X - - - - - - - - - - - - - - -';

  function rep(b, n) { var l = []; for (var i = 0; i < n; i++) l.push(b); return l; }
  function silences(n) { return rep(SILENCE, n); }
  // deux mesures de batterie l'une sur l'autre, case par case
  function mele(a, b) {
    var x = a.trim().split(/\s+/), y = b.trim().split(/\s+/);
    return x.map(function (c, i) {
      var d = y[i];
      if (c === '.' || c === '-') return d === '-' ? '.' : d;
      if (d === '.' || d === '-') return c;
      return c + d;
    }).join(' ');
  }
  // les gouttes sur le pare-brise : trois mesures qui tournent contre les phrases de quatre
  var GOUTTES = ['. . . i . . . . . . . . . i . .', '. . . . . . . i . . . . . . . .', '. i . . . . . . . . . i . . . .'];
  function pluie(l) { return l.map(function (b, i) { return mele(b, GOUTTES[i % GOUTTES.length]); }); }

  // ── LE BIP : si 5, un sinus seul, une seconde
  var BIP = 'B5 - - - - - . . . . . . . . . .';
  // la pile qui meurt : le bip glisse vers le bas
  var BIP_MEURT = 'B5 - - - ~A#5 - ~A5 - ~G#5 - ~G5 - ~F#5 - - .';

  // ── LE MESSAGE : la prosodie de la phrase, au piano électrique
  //    « C'est Ro-land. » ré do# si ; « Ne mets pas Bré-haut sa-me-di. »
  var MESSAGE1 = [
    '. . . . . . . . D5 - C#5 - B4 - - -',
    '- - - - . . A4 . B4 . C#5 . D5 - - -',
    'C#5 . B4 . A4 - - - B4 - - - - - . .',
    SILENCE
  ];
  //    « C'est Roland. Ne me cherche pas. »
  var MESSAGE2 = [
    '. . . . . . . . D5 - C#5 - B4 - - -',
    '- - - - . . F#4 . A4 . B4 - - . D5 -',
    'C#5 - - - - - - - B4 - - - G4 - - -',
    'A#4 - - - - - - - - - - - . . . .'
  ];
  //    « Garde le banc. Et ne monte jamais seul dans le car… »
  var MESSAGE3 = [
    '. . . . . . . . F#5 - - - E5 . D5 .',
    'C#5 - - - - - - - . . . . . . . .',
    '. . A4 . B4 . D5 . C#5 . B4 . A4 - B4 -',
    'A#4 - - - C#5 - - - - - - - . . . .'
  ];
  var MESSAGE4 = [
    '. . . . . . . . D5 - C#5 - B4 - - -',
    '- - - - . . F#5 - E5 - D5 - C#5 - - -',
    'B4 - - - - - - - . . . . . . . .',
    SILENCE
  ];
  // la radio du wagon : le message en ré majeur, en petit
  var RADIO = [
    '. . . . F#5 . E5 . D5 - - - A4 - - -', 'B4 - - - A4 - - - F#4 - - - - - - -',
    '. . . . G4 . A4 . B4 - - - D5 - - -', 'C#5 - - - B4 - - - A4 - - - - - - -',
    '. . . . G4 . A4 . B4 - - - E5 - - -', 'C#5 - - - - - - - E5 - - - - - - -',
    'F#5 - - - E5 - - - D5 - - - C#5 - - -', 'A#4 - - - - - - - - - - - . . . .'
  ];
  // le wagon, au chaud : le piano reprend
  var CHAUD = [
    '. . . . . . . . F#5 - E5 - D5 - - -', '- - - - . . A4 . B4 . D5 . F#5 - - -',
    'E5 - - - D5 - - - B4 - - - - - . .', SILENCE,
    '. . . . . . . . G5 - F#5 - E5 - - -', 'C#5 - - - - - - - E5 - - - A4 - - -',
    'D5 - - - - - - - C#5 - - - B4 - - -', 'A#4 - - - - - - - - - - - . . . .'
  ];
  // les phares dans la pluie (B) : une ligne lointaine, en valeurs longues
  var PHARES = [
    'F#5 - - - - - - - - - - - - - - -', 'E5 - - - - - - - C#5 - - - - - - -',
    'D5 - - - - - - - - - - - B4 - - -', 'C#5 - - - - - - - - - - - . . . .',
    'F#5 - - - - - - - G5 - - - A5 - - -', 'A5 - - - - - - - - - - - E5 - - -',
    'G5 - - - - - - - F#5 - - - E5 - - -', 'A#4 - - - - - - - C#5 - - - E5 - - -'
  ];
  // la Rive : le message crié à l'octave
  var CRI = [
    'D6 - - - C#6 - - - B5 - - - - - - -', 'D6 - - - - - - - B5 - - - G5 - - -',
    'E5 - - - - - - - G5 - - - B5 - - -', 'A#5 - - - - - - - - - - - C#6 - - -',
    'D6 - - - C#6 - - - B5 - - - F#5 - - -', 'G5 - - - - - - - B5 - - - D6 - - -',
    'E6 - - - - - - - - - - - D6 - C6 -', 'A#5 - - - - - - - - - - - . . . .'
  ];

  // ── LA BASSE QUI GLISSE : elle tient, remonte à l'octave en fin de mesure,
  //    et plonge sur la racine suivante
  var GLISSE = '~R - - - - - - - - - - 5 - - ~8 -';
  var GLISSE2 = '~R - - - - - - - R . 5 . ~8 - 7 -';
  var GLISSE_FIN = '~R - - - - - - - - - 5 - ~8 - ~R -';
  var LONGUE = '~R - - - - - - - - - - - - - - -';
  var MARCHE = 'R - - - 5 - - - 8 - - - 5 - - -';            // le wagon : une basse qui marche à la noire
  var CROCHES = 'R - R - R - R - R - R - ~8 - R -';          // la Rive

  // ── le piano : l'accord au temps, l'autre à contretemps
  var PIANO = 'X - - - - - - - - - X - - - - -';
  var PIANO_B = 'X - - - - - X - - - - - - - - -';
  var PIANO_C = 'X - - - - - - - - - - - - - - -';

  // ── la batterie : le demi-temps, les essuie-glaces (le cerclage aux temps 2 et 4)
  var E_X = 'kx . . . r . . . S . . . r . . .';
  var E = 'k . . . r . . . S . . . r . . .';
  var E_K = 'k . . . r . . . S . . . r . k .';
  var E_Z = 'k . . . r . . . Sz . . . r . k .';        // une voiture qui passe
  var E_TOUR = 'k . . . r . . . S . . . S . S S';
  var E_RELANCE = 'k . . . r . . . Sz . . . r . S S';
  var P_X = 'kx . h . r . h . S . h . r . k h';          // la pluie forcit : le charleston
  var P = 'k . h . r . h . S . h . r . k h';
  var P_Z = 'k . h . r . h . Sz . h . r . k h';
  var R_X = 'kx . h . r . h . S . h . r h k h';
  var R = 'k . h . r . h . S . h . r h k h';
  var R_TOUR = 'k . h . r . h . S . t . T . S S';

  A.theme('livre_h2', {
    titre: 'Le Répondeur', moment: 'la ville le jour, livre 2 (Le Sapin en carton)',
    tonalite: 'si mineur',
    humeur: 'une berline grise sous la pluie, un répondeur qui parle : un bip, un piano électrique triste, une basse qui glisse',
    ville: true,
    bpm: 90, gain: 1.45,
    pompe: { prof: 0.35, rel: 0.3 },
    echo: { pas: 3, retour: 0.45, coupe: 1800 },
    salle: { taille: 0.55, duree: 2.4, ton: 2600 },
    cassette: { sature: 0.9, coupe: 8000, bas: 40, souffle: 0.006, flotte: { prof: 3.5, vit: 0.37 } },
    voix: {
      bip:   { inst: 'sub', vol: 0.04, env: [0.004, 0.05, 1, 0.025], echo: 0.2, rev: 0.25 },
      voix:  { inst: 'epiano', vol: 0.15, echo: 0.3, rev: 0.35, flotte: { prof: 7, vit: 0.5 }, pan: 0.08 },
      piano: { inst: 'epiano', vol: 0.085, oct: 3, rev: 0.25, pompe: true, flotte: { prof: 5, vit: 0.41 }, pan: -0.15 },
      brume: { inst: 'nappe', vol: 0.075, oct: 3, rev: 0.45, pompe: true, flotte: { prof: 12, vit: 0.33 }, filtre: 1400 },
      lead:  { inst: 'lead', vol: 0.1, echo: 0.35, rev: 0.4, flotte: { prof: 9, vit: 0.4 }, filtre: 2200, pan: 0.2 },
      radio: { inst: 'pulse', duty: 0.125, vol: 0.05, filtre: 1500, rev: 0.15, echo: 0.1, flotte: 6, pan: 0.35 },
      envol: { inst: 'supersaw', vol: 0.075, oct: 3, scies: 5, desaccord: 14, rev: 0.45, pompe: true, flotte: { prof: 10, vit: 0.36 }, filtre: 2600, env: [0.4, 0.8, 0.85, 0.35] },
      reese: { inst: 'reese', vol: 0.1, oct: 1, plancher: 'F#1', desaccord: 8, pompe: true },
      basse: { inst: 'basse', vol: 0.09, oct: 1, plancher: 'E1', pompe: true, drive: 1.2, filtre: 1100, ton: [900, 380, 0.12] },
      batt:  { vol: 0.56, porte: 0.6, tenue: 0.3, rev: 0.3, filtre: 9000 }
    },
    sections: {
      // ── l'introduction, jouée une fois : la pluie, la brume, le bip ──
      intro: {
        accords: ['Bm7', 'Bm7', 'Gmaj7', 'F#7'],
        ouvre: { brume: [500, 1400] },
        brume: [NAPPE, TENU, NAPPE, NAPPE],
        bip: [SILENCE, BIP, SILENCE, SILENCE],
        piano: [PIANO_C, SILENCE, PIANO, 'X - - - - - - - - - - - . . . .'],
        basse: [SILENCE, SILENCE, GLISSE, LONGUE],
        batt: ['. . i . . . . . . . . i . . . .', '. . . . . i . . . . . . . . i .',
               'k . . . . . i . . . . . r . . .', 'k . . . r . . . S . . . r . S S']
      },
      // ── la boucle ──
      A: {
        accords: ['Bm7', 'Bm7/A', 'Gmaj7', 'F#7', 'Bm7', 'Bm7/A', 'Em7', 'F#7',
                  'Bm7', 'Bm7/A', 'Gmaj7', 'F#7', 'Bm7', 'Bm7/A', 'Em7', 'F#7'],
        ouvre: { basse: [600, 1100], brume: [900, 1500] },
        basse: rep(GLISSE, 7).concat([GLISSE_FIN]).concat(rep(GLISSE, 7)).concat([GLISSE_FIN]),
        piano: PIANO,
        brume: NAPPE,
        bip: [BIP].concat(silences(7)).concat([BIP]).concat(silences(7)),
        voix: MESSAGE1.concat(silences(4)).concat(MESSAGE2).concat(silences(4)),
        batt: pluie([E_X, E, E, E_K, E, E, E, E_TOUR, E_X, E, E, E_K, E, E, E_Z, E_RELANCE])
      },
      // la berline : le relatif, une ligne lointaine, puis la basse et la pluie
      B: {
        accords: ['Gmaj7', 'F#m7', 'Em7', 'Dmaj7', 'Gmaj7', 'F#m7', 'Em7', 'F#7',
                  'Gmaj7', 'F#m7', 'Em7', 'Dmaj7', 'Gmaj7', 'F#m7', 'Em7', 'F#7'],
        ouvre: { lead: [1600, 2600] },
        basse: rep(GLISSE2, 7).concat([GLISSE_FIN]).concat(rep(GLISSE2, 7)).concat([GLISSE_FIN]),
        piano: PIANO_B,
        brume: NAPPE,
        lead: PHARES.concat(silences(8)),
        batt: pluie([P_X, P, P, P_Z, P, P, P, R_TOUR, P_X, P, P, P_Z, P, P, P, E_RELANCE])
      },
      // le creux, la cabine : la basse tenue, le bip sans réponse, les pièces qui tombent
      C: {
        accords: ['Bm7', 'Bm7', 'Em7', 'Em7', 'Bm7', 'Bm7', 'F#7', 'F#7'],
        ouvre: { basse: [350, 800], brume: [1200, 700] },
        basse: [LONGUE, TENU, LONGUE, TENU, LONGUE, TENU, LONGUE, '- - - - - - - - . . . . . . . .'],
        brume: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU],
        piano: [PIANO_C, SILENCE, PIANO_C, SILENCE, PIANO_C, SILENCE, PIANO_C, SILENCE],
        bip: [SILENCE, SILENCE, BIP, SILENCE, SILENCE, SILENCE, BIP, SILENCE],
        batt: pluie(['bx . . . . . . . . . . . . . . .', '. . . . . . . . . . . . m . m m', '. . . . . . . . . . . . . . . .', '. . . . . . . . . . . . . . . .',
                     '. . . . . . . . . . . . . . . .', '. . . . . . . . . . m . m m . m', '. . . . . . . . . . . . . . . .', 'k . . . r . . . S . . . r . S S'])
      },
      // lundi suivant : deux autres messages, le charleston de la pluie
      A2: {
        copie: 'A',
        voix: MESSAGE3.concat(silences(4)).concat(MESSAGE4).concat(silences(4)),
        batt: pluie([P_X, P, P, P_Z, P, P, P, R_TOUR, P_X, P, P, P_Z, P, P, P, E_TOUR])
      },
      // le wagon : ré majeur, la radio à piles, la basse qui marche ; puis le piano au chaud
      D: {
        accords: ['Dmaj7', 'Dmaj7', 'Gmaj7', 'Gmaj7', 'Em7', 'A', 'Dmaj7', 'F#7',
                  'Dmaj7', 'Dmaj7', 'Gmaj7', 'Gmaj7', 'Em7', 'A', 'Bm7', 'F#7'],
        ouvre: { basse: [700, 1100], brume: [800, 1500] },
        basse: rep(MARCHE, 7).concat(['R - - - 5 - - - 8 - - - ~5 - ~3 -']).concat(rep(GLISSE2, 7)).concat([GLISSE_FIN]),
        piano: [PIANO_C, SILENCE, PIANO_C, SILENCE, PIANO_C, PIANO_C, PIANO_C, PIANO_C].concat(rep(PIANO_B, 8)),
        brume: NAPPE,
        radio: RADIO.concat(silences(8)),
        voix: silences(8).concat(CHAUD),
        batt: ['kx . . . . . . . . . . . r . . .', 'k . . . . . . . . . . . r . . .', 'k . . . r . . . . . . . r . . .', 'k . . . r . . . . . . . r . k .',
               'k . . . r . . . . . . . r . . .', 'k . . . r . . . . . . . r . k .', 'k . . . r . . . S . . . r . . .', E_TOUR,
               R_X, R, R, R, R, R, R, E_RELANCE]
      },
      // la Rive : le sommet, la reese, la grande nappe, le message crié, la pile qui meurt
      E: {
        accords: ['Bm', 'G', 'Em', 'F#', 'Bm', 'G', 'C', 'F#7', 'Bm', 'G', 'Em', 'F#', 'Bm', 'G', 'C', 'F#7'],
        ouvre: { envol: [1200, 3000], basse: [800, 1400], lead: [1800, 3200] },
        reese: [LONGUE, LONGUE, LONGUE, LONGUE, LONGUE, LONGUE, LONGUE, LONGUE, LONGUE, LONGUE, LONGUE, LONGUE, LONGUE, LONGUE, LONGUE, '~R - - - - - - - - - - - . . . .'],
        basse: rep(CROCHES, 15).concat(['R - R - R - R - R - R - ~8 - ~5 -']),
        envol: NAPPE,
        piano: PIANO_B,
        lead: CRI.concat(silences(4)).concat(['E6 - - - - - - - - - - - D6 - C6 -', 'A#5 - - - - - - - - - - - . . . .', SILENCE, SILENCE]),
        bip: silences(8).concat([BIP_MEURT]).concat(silences(7)),
        batt: ['kx . h . r . h . S . h . r h k h', R, R, 'k . h . r . h . S . h . r h kx h', R, R, R, R_TOUR,
               R_X, R, R, 'k . h . r . h . S . h . r h kx h', R, R, R, 'k . h . r . t . S . t . T T T T']
      },
      // la retombée : la pluie, le bip, puis le groove qui relance
      retour: {
        accords: ['Bm7', 'Bm7/A', 'Gmaj7', 'F#7', 'Bm7', 'Bm7/A', 'Em7', 'F#7'],
        ouvre: { basse: [350, 1100], brume: [700, 1400] },
        basse: [LONGUE, LONGUE, LONGUE, LONGUE, GLISSE, GLISSE, GLISSE, GLISSE_FIN],
        brume: NAPPE,
        piano: [PIANO_C, SILENCE, PIANO_C, SILENCE, PIANO, PIANO, PIANO, PIANO],
        bip: [BIP, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE],
        batt: pluie(['bx . . . . . . . . . . . . . . .', '. . . . . . . . . . . . . . . .', '. . . . . . . . . . . . . . . .', '. . . . . . . . . . . . m . m m',
                     'k . . . r . . . . . . . r . . .', 'k . . . r . . . S . . . r . . .', E_K, E_RELANCE])
      }
    },
    ordre: ['intro', 'A', 'B', 'C', 'A2', 'D', 'E', 'retour'], boucle: 1
  });
})(typeof FusibleAudio === 'object' ? FusibleAudio : require('../audio.js'));
