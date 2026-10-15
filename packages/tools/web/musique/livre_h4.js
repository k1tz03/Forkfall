/* ---------------------------------------------------------------------------
 * FUSIBLE — la bande originale : « La Route de la Rive » (livre_h4), la ville
 * le jour dans le livre 4, « La Route de la Rive », et son introduction.
 *
 * Rouler de nuit vers un virage de 1984. Les lampadaires passent : chaque note
 * de l'arpège sonne à gauche, puis la même à droite une croche plus tard — une
 * lumière qui traverse le pare-brise (et le jeu de Sacha, « à gauche ou à
 * droite ? »). Dessous, la basse carrée des années quatre-vingt roule sur la
 * pédale de fa dièse pendant que les accords défilent au-dessus (ré, mi, fa
 * dièse mineur : le paysage) ; au-dessus, une mélodie en valeurs longues, comme
 * l'horizon. Le moteur au ralenti (une reese en doubles croches, comme la
 * mobylette du téléphone de trois heures), la lumière d'une mobylette au bout
 * du pont (un triangle aigu, loin) ; la chanson de 1984 à la radio, en carré
 * nasillard ; et le virage : le sol majeur napolitain. Fa dièse mineur ; 104.
 *
 * Ce qui n'est qu'à lui dans la bande : les lampadaires d'une oreille à
 * l'autre, la pédale de basse sous des accords qui passent, la basse carrée,
 * le moteur au ralenti, la radio de 1984.
 *
 *   intro    4 m.  (une fois) le contact : le moteur au ralenti, les premiers
 *                  lampadaires, la grosse caisse, la basse
 *   ── la boucle, 112 mesures, 4 min 18 ──
 *   A       16 m.  la route : la pédale de fa dièse, les lampadaires à la
 *                  noire, la batterie de route ; la mélodie entre à la
 *                  mesure 9
 *   B       16 m.  les lampadaires : la pédale lâchée (ré, mi, do dièse
 *                  mineur), les lumières à la double croche, la basse au galop
 *   creux    8 m.  « freine » : tout s'arrête, les lampadaires s'éloignent dans
 *                  l'écho, la lumière au bout du pont
 *   A2      16 m.  la route, la mélodie entière, harmonisée
 *   C       16 m.  1984 : la chanson à la radio (la majeur volé), les mains
 *                  dans les tambours de la fête ; le do dièse qui ramène la nuit
 *   D       16 m.  le virage : la mélodie à l'octave, la grande scie, le sol
 *                  napolitain, le galop
 *   D2       8 m.  le virage, harmonisé, le sommet
 *   pont     8 m.  trois heures : le moteur au ralenti, la nappe, la lumière ;
 *                  deux mesures pour repartir
 *   retour   8 m.  la route revient, et relance
 *
 * La courbe : A 5 → B 6 → creux 2 → A2 6 → C 5 → D 8 → D2 9 → pont 2 →
 * retour 4. La mélodie tient un peu plus de la moitié de la boucle ; le reste,
 * les lampadaires et la basse.
 *
 * La grammaire : audio.js (« L'ÉCRITURE », « LES VOIX ») ; le guide du
 * compositeur : docs/design/bande_originale.md § 6.
 * ------------------------------------------------------------------------- */
(function (A) {
  'use strict';
  var SILENCE = A.SILENCE;
  var TENU = '- - - - - - - - - - - - - - - -';
  var NAPPE = 'X - - - - - - - - - - - - - - -';
  var RACINE = 'R - - - - - - - - - - - - - - -';

  function rep(b, n) { var l = []; for (var i = 0; i < n; i++) l.push(b); return l; }
  function silences(n) { return rep(SILENCE, n); }
  // la même ligne, une croche plus tard (la lumière passe de gauche à droite)
  function retarde(b, n) {
    var c = b.trim().split(/\s+/), N = c.length, o = [];
    for (var i = 0; i < N; i++) o.push(c[(i - n + N) % N]);
    return o.join(' ');
  }

  // ── LES LAMPADAIRES : à gauche, puis la même note à droite une croche plus tard
  var LAMPES = '1 . . . 5 . . . 8 . . . 5 . . .';
  var LAMPES_B = '1 . . . 5 . . . 8 . . . 9 . . .';
  var VITE = '1 . 5 . 8 . 5 . 1 . 5 . 9 . 5 .';          // plus vite : une lumière par croche
  var MONTE = '1 . . . 3 . . . 5 . . . 8 . . .';          // la radio : l'arpège monte
  var LOIN = '1 . . . . . . . 5 . . . . . . .';           // freine : elles s'éloignent

  // ── LA BASSE CARRÉE : le moteur à la croche, puis le galop
  var MOTEUR = 'R . R . R . R . R . R . R . R R';
  var MOTEUR2 = 'R . R . R . R . R . R . 8 . R R';
  var GALOP = 'R . R R R . R R R . R R R . R R';
  var GALOP2 = 'R . R R R . R R R . R R 8 . R R';
  // le moteur au ralenti (la reese, en doubles croches, sourde)
  var RALENTI = 'R R R R R R R R R R R R R R R R';

  // ── LA MÉLODIE EN VALEURS LONGUES : do dièse, fa dièse, mi… (sur la pédale)
  var HORIZON1 = [
    'C#5 - - - - - - - F#5 - - - - - - -', 'E5 - - - - - - - - - - - - - - -',
    'C#5 - - - - - - - D5 - - - - - - -', 'B4 - - - - - - - - - - - - - - -',
    'G#4 - - - - - - - B4 - - - E5 - - -', 'C#5 - - - - - - - B4 - - - - - - -',
    'A4 - - - - - - - - - - - - - - -', '- - - - - - - - . . . . . . . .'
  ];
  var HORIZON2 = [
    'C#5 - - - - - - - F#5 - - - - - - -', 'A5 - - - - - - - G#5 - - - F#5 - - -',
    'F#5 - - - - - - - E5 - - - D5 - - -', 'A4 - - - - - - - - - - - - - - -',
    'B4 - - - - - - - D5 - - - F#5 - - -', 'E5 - - - - - - - D5 - - - - - - -',
    'C#5 - - - - - - - - - - - E#5 - - -', 'G#5 - - - - - - - - - - - . . . .'
  ];
  // le virage : à l'octave, sur le napolitain
  var VIRAGE = [
    'C#5 - - - - - - - F#5 - - - - - - -', 'E5 - - - - - - - D5 - - - - - - -',
    'D5 - - - - - - - B4 - - - - - - -', 'C#5 - - - - - - - E#5 - - - G#5 - - -',
    'A5 - - - - - - - F#5 - - - - - - -', 'F#5 - - - - - - - E5 - - - D5 - - -',
    'D5 - - - - - - - - - - - B4 - - -', 'B4 - - - - - - - G#4 - - - E#4 - - -',
    'D5 - - - - - - - F#5 - - - - - - -', 'A5 - - - - - - - F#5 - - - - - - -',
    'G5 - - - - - - - B5 - - - - - - -', 'G#5 - - - - - - - - - - - E#5 - - -',
    'F#5 - - - - - - - C#5 - - - - - - -', 'D5 - - - - - - - F#5 - - - A5 - - -',
    'G5 - - - - - - - F#5 - - - D5 - - -', 'C#5 - - - - - - - - - - - . . . .'
  ];
  var VIRAGE2 = [
    'C#5 - - - - - - - F#5 - - - - - - -', 'A5 - - - - - - - F#5 - - - - - - -',
    'G5 - - - - - - - B5 - - - - - - -', 'G#5 - - - - - - - E#5 - - - C#5 - - -',
    'D5 - - - - - - - F#5 - - - B5 - - -', 'B5 - - - - - - - A5 - - - G5 - - -',
    'G#5 - - - - - - - - - - - - - - -', '- - - - - - - - . . . . . . . .'
  ];
  // LA RADIO, 1984 : une chanson en la majeur, en carré nasillard
  var RADIO = [
    'E5 - - - C#5 - - - E5 - - - F#5 - E5 -', 'B4 - - - - - - - G#4 - - - B4 - - -',
    'C#5 - - - A4 - - - C#5 - - - E5 - D5 -', 'D5 - - - - - - - A4 - - - - - - -',
    'E5 - - - C#5 - - - E5 - - - A5 - G#5 -', 'G#5 - - - - - - - E5 - - - - - - -',
    'F#5 - - - E5 - - - D5 - - - C#5 - - -', 'B4 - - - - - - - - - - - . . . .',
    'E5 - - - C#5 - - - E5 - - - F#5 - E5 -', 'B4 - - - - - - - G#4 - - - B4 - - -',
    'C#5 - - - A4 - - - C#5 - - - E5 - D5 -', 'D5 - - - - - - - A4 - - - - - - -',
    'D5 - - - - - - - F#5 - - - - - - -', 'E5 - - - - - - - G#4 - - - B4 - - -',
    'A4 - - - - - - - - - - - . . . .', 'E#4 - - - - - - - G#4 - - - . . . .'
  ];
  // la lumière au bout du pont : un triangle aigu, loin
  var PHARE = '. . . . . . . . C#6 - . . . . . .';
  var PHARE2 = '. . . . . . . . . . . . G#5 - . .';

  // ── la batterie de route : la caisse « gated » aux temps 2 et 4, le charleston à la croche
  var R0_X = 'kx . h . r . h . k . h k r . h .';         // le départ : le cerclage, la caisse viendra
  var R0 = 'k . h . r . h . k . h k r . h .';
  var R_X = 'kx . h . S . h . k . h k S . h .';
  var R = 'k . h . S . h . k . h k S . h .';
  var R_O = 'k . h . S . h . k . h k S . o .';
  var R_TOUR = 'k . h . S . h . k . t t T . T T';
  var R_RELANCE = 'k . h . S . h . kz . T . t T S S';
  var V_X = 'kx h h h S h h h k h h k S h o h';           // le virage : le charleston à la double croche
  var V = 'k h h h S h h h k h h k S h o h';
  var V_TOUR = 'k h h h S h h h k . t t T T S S';
  var F_X = 'kx . h . c . h . k . h k c . h .';         // 1984 : les mains de la fête, sans la caisse
  var F = 'k . h . c . h . k . h k c . h .';
  var F_T = 'k . h . c . h . k . t t c . T T';

  A.theme('livre_h4', {
    titre: 'La Route de la Rive', moment: 'la ville le jour, livre 4 (La Route de la Rive)',
    tonalite: 'fa dièse mineur',
    humeur: 'rouler de nuit vers un virage de 1984 : des lampadaires d\'une oreille à l\'autre, une mélodie en valeurs longues',
    ville: true,
    bpm: 104, gain: 1.24,
    pompe: { prof: 0.5, rel: 0.22 },
    echo: { pas: 6, retour: 0.38, coupe: 2400 },
    salle: { taille: 0.7, duree: 2.8, ton: 3600 },
    cassette: { sature: 1, coupe: 10000, bas: 40, souffle: 0.004, flotte: { prof: 3, vit: 0.33 } },
    voix: {
      lead:    { inst: 'lead', vol: 0.11, rev: 0.4, echo: 0.3, flotte: { prof: 7, vit: 0.5 }, pan: 0.05 },
      harmo:   { inst: 'lead', vol: 0.045, rev: 0.4, echo: 0.15, pan: -0.25 },
      envol:   { inst: 'supersaw', vol: 0.075, scies: 7, desaccord: 16, large: 0.85, rev: 0.4, flotte: { prof: 8, vit: 0.5 }, filtre: 4600, env: [0.02, 0.5, 0.82, 0.25] },
      radio:   { inst: 'pulse', duty: 0.25, vol: 0.09, filtre: 2800, rev: 0.3, echo: 0.28, flotte: { prof: 8, vit: 0.6 }, pan: 0.1 },
      gauche:  { inst: 'pluck', vol: 0.095, oct: 4, pan: -0.75, echo: 0.22, rev: 0.2, pompe: true, filtre: 3200 },
      droite:  { inst: 'pluck', vol: 0.095, oct: 4, pan: 0.75, echo: 0.22, rev: 0.2, pompe: true, filtre: 3200 },
      phare:   { inst: 'tri', vol: 0.045, echo: 0.55, rev: 0.5, pan: 0.15, env: [0.01, 0.2, 0.6, 0.3] },
      nappe:   { inst: 'supersaw', vol: 0.06, oct: 3, scies: 5, desaccord: 15, rev: 0.45, pompe: true, flotte: { prof: 10, vit: 0.37 }, filtre: 2600, env: [0.4, 0.8, 0.85, 0.35] },
      ralenti: { inst: 'reese', vol: 0.09, oct: 1, plancher: 'F#1', desaccord: 14, ton: [700, 300, 0.1], env: [0.004, 0.08, 0.6, 0.05], filtre: 900 },
      basse:   { inst: 'sqbasse', vol: 0.092, oct: 1, plancher: 'A1', pompe: true, drive: 1.5, filtre: 2200 },
      batt:    { vol: 0.68, porte: 0.6, tenue: 0.26, rev: 0.25, filtre: 12000 }
    },
    sections: {
      // ── l'introduction, jouée une fois : le contact ──
      intro: {
        accords: ['F#m', 'F#m', 'D/F#', 'C#'],
        ouvre: { ralenti: [400, 900], gauche: [900, 3200], droite: [900, 3200] },
        ralenti: [RALENTI, RALENTI, RALENTI, 'R R R R R R R R . . . . . . . .'],
        nappe: [NAPPE, TENU, NAPPE, NAPPE],
        gauche: [SILENCE, LAMPES, LAMPES, LAMPES],
        droite: [SILENCE, retarde(LAMPES, 2), retarde(LAMPES, 2), retarde(LAMPES, 2)],
        basse: [SILENCE, SILENCE, SILENCE, MOTEUR],
        batt: ['. . . . . . . . . . . . . . . .', '. . . . . . . . . . . . . . . .', 'k . . . . . . . k . . . . . . .', 'k . h . S . h . kz . T . t T S S']
      },
      // ── la boucle ──
      A: {
        accords: ['F#m', 'F#m', 'D/F#', 'D/F#', 'E/F#', 'E/F#', 'F#m', 'F#m', 'F#m', 'F#m', 'D/F#', 'D/F#', 'Bm/F#', 'Bm/F#', 'C#7', 'C#7'],
        ouvre: { basse: [800, 2200], nappe: [1000, 2000] },
        basse: rep(MOTEUR, 7).concat([MOTEUR2]).concat(rep(MOTEUR, 7)).concat([MOTEUR2]),
        gauche: LAMPES,
        droite: retarde(LAMPES, 2),
        nappe: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU],
        phare: [SILENCE, PHARE, SILENCE, PHARE, SILENCE, PHARE, SILENCE, PHARE2].concat(silences(8)),
        lead: silences(8).concat(HORIZON2),
        batt: [R0_X, R0, R0, R0, R, R, R, R_TOUR, R_X, R, R, R_O, R, R, R, R_RELANCE]
      },
      // les lampadaires : la pédale lâchée, les lumières plus vite, le galop
      B: {
        accords: ['D', 'E', 'C#m', 'F#m', 'D', 'E', 'F#m', 'F#m', 'Bm', 'C#m', 'D', 'E', 'Bm', 'C#m', 'D', 'C#'],
        ouvre: { gauche: [2000, 3600], droite: [2000, 3600] },
        basse: rep(GALOP, 7).concat([GALOP2]).concat(rep(GALOP, 7)).concat([GALOP2]),
        gauche: VITE,
        droite: retarde(VITE, 1),
        nappe: NAPPE,
        batt: [R_X, R, R, R_O, R, R, R, R_TOUR, R_X, R, R, R_O, R, R, R, R_RELANCE]
      },
      // « freine » : tout s'arrête, les lampadaires s'éloignent, la lumière au bout du pont
      creux: {
        accords: ['F#m', 'F#m', 'D', 'D', 'Bm', 'Bm', 'C#', 'C#'],
        ouvre: { gauche: [2600, 700], droite: [2600, 700], basse: [300, 800] },
        basse: [RACINE, TENU, RACINE, TENU, RACINE, TENU, RACINE, TENU],
        gauche: LOIN,
        droite: retarde(LOIN, 2),
        nappe: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU],
        phare: [PHARE, SILENCE, PHARE, SILENCE, PHARE2, SILENCE, PHARE, SILENCE],
        batt: ['bx . . . . . . . . . . . . . . .', SILENCE, SILENCE, SILENCE, SILENCE, SILENCE, '. . . . . . . . . . . . . . . .', 'k . . . k . . . kz . T . t T S S']
      },
      // la route, la mélodie entière, harmonisée
      A2: {
        copie: 'A',
        harmo: true,
        lead: HORIZON1.concat(HORIZON2),
        phare: silences(16),
        gauche: LAMPES_B,
        droite: retarde(LAMPES_B, 2),
        batt: [R_X, R, R, R_O, R, R, R, R_TOUR, R_X, R, R, R_O, R, R, R, R_RELANCE]
      },
      // 1984 : la chanson à la radio, la fête
      C: {
        accords: ['A', 'E/G#', 'F#m', 'D', 'A', 'E/G#', 'D', 'E', 'A', 'E/G#', 'F#m', 'D', 'Bm', 'E', 'A', 'C#'],
        ouvre: { radio: [1800, 3200] },
        basse: rep(MOTEUR, 15).concat([MOTEUR2]),
        gauche: MONTE,
        droite: retarde(MONTE, 2),
        nappe: NAPPE,
        radio: RADIO,
        batt: [F_X, F, F, F, F, F, F, F_T, F_X, F, F, F, F, F, F, R_RELANCE]
      },
      // le virage : la mélodie à l'octave, la grande scie, le napolitain
      D: {
        accords: ['F#m', 'D', 'G', 'C#', 'F#m', 'D', 'G', 'C#7', 'Bm', 'D', 'G', 'C#', 'F#m', 'D', 'G', 'C#'],
        ouvre: { nappe: [1800, 3200] },
        basse: rep(GALOP, 7).concat([GALOP2]).concat(rep(GALOP, 7)).concat([GALOP2]),
        gauche: VITE,
        droite: retarde(VITE, 1),
        nappe: NAPPE,
        lead: VIRAGE,
        envol: VIRAGE,
        batt: [V_X, V, V, V, V_X, V, V, V_TOUR, V_X, V, V, V, V_X, V, V, V_TOUR]
      },
      D2: {
        accords: ['F#m', 'F#m', 'G', 'C#', 'Bm', 'G', 'C#', 'C#'],
        basse: rep(GALOP, 7).concat([GALOP2]),
        gauche: VITE,
        droite: retarde(VITE, 1),
        nappe: NAPPE,
        lead: VIRAGE2,
        harmo: true,
        envol: VIRAGE2,
        batt: [V_X, V, V, V, V_X, V, V, 'k h h h S h h h k . t t T T T T']
      },
      // trois heures : le moteur au ralenti, la nappe, la lumière
      pont: {
        accords: ['F#m', 'F#m', 'F#m', 'F#m', 'G', 'G', 'C#', 'C#'],
        ouvre: { ralenti: [350, 900], nappe: [700, 1600] },
        ralenti: [RALENTI, RALENTI, RALENTI, RALENTI, RALENTI, RALENTI, SILENCE, SILENCE],
        nappe: [NAPPE, TENU, TENU, TENU, NAPPE, TENU, NAPPE, TENU],
        phare: [SILENCE, PHARE, SILENCE, PHARE2, SILENCE, PHARE, SILENCE, SILENCE],
        basse: [RACINE, TENU, TENU, TENU, SILENCE, SILENCE, MOTEUR, MOTEUR2],
        batt: ['bx . . . . . . . . . . . . . . .', SILENCE, SILENCE, SILENCE, '. . . . . . . . . . . . . . . .', SILENCE, 'k . . . k . . . k . . . k . . .', R_RELANCE]
      },
      // la route revient, et relance
      retour: {
        accords: ['F#m', 'F#m', 'D/F#', 'D/F#', 'E/F#', 'E/F#', 'C#', 'C#'],
        ouvre: { basse: [500, 2200], gauche: [1400, 3200], droite: [1400, 3200] },
        basse: rep(MOTEUR, 7).concat([MOTEUR2]),
        gauche: LAMPES,
        droite: retarde(LAMPES, 2),
        nappe: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU],
        batt: [R_X, R, R, R_O, R, R, R, R_RELANCE]
      }
    },
    ordre: ['intro', 'A', 'B', 'creux', 'A2', 'C', 'D', 'D2', 'pont', 'retour'], boucle: 1
  });
})(typeof FusibleAudio === 'object' ? FusibleAudio : require('../audio.js'));
