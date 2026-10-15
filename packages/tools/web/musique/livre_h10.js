/* ---------------------------------------------------------------------------
 * FUSIBLE — la bande originale : « Deux téléphones » (livre_h10), la ville le
 * jour dans le livre 10, et son introduction.
 *
 * 2040 : le noir le plus moderne du jeu. Un demi-temps lourd (la grosse caisse
 * appuyée, la caisse « gated » sur le trois, la batterie saturée), une reese
 * épaisse qui glisse d'une note à l'autre et respire avec la grosse caisse,
 * des nappes larges comme une ville la nuit. Et deux téléphones qui se
 * répondent : le fixe du bureau (la ville), une sonnerie double, deux sinus qui
 * tremblent à la tierce, à gauche ; le clapet de la poche intérieure (ceux qui
 * ont payé), une mélodie de 1995 au carré mince, à droite — si, si, sol dièse,
 * si, do dièse : la sonnerie qu'on reconnaît dans la veste d'un autre.
 *
 * L'harmonie a son ombre : le napolitain (ré majeur septième) posé sur la
 * pédale de do dièse. Au creux, l'escalier nord : une montée de huit marches à
 * l'arpège, qui en perd une à chaque mesure (une marche murée par mois), la
 * truelle, et de l'autre côté du mur, quelqu'un qui frappe. Do dièse mineur ; 116.
 *
 *   intro      4 m.  (une fois) le clapet sonne seul, le fixe répond, la reese
 *                    tombe, le roulement
 *   ── la boucle, 120 mesures, 4 min 08 ──
 *   A         16 m.  la ville en 2040 : le demi-temps, la reese, la nappe ; les
 *                    deux téléphones se répondent (m. 4-5 et 12-13)        [3]
 *   B         16 m.  Madame Septembre : la mélodie à la grande scie, en valeurs
 *                    longues ; les sonneries dans ses silences            [4]
 *   escalier  16 m.  le creux : la montée qui perd une marche par mesure, la
 *                    truelle, les coups derrière le mur ; quatre mesures pour
 *                    remonter                                        [1 → 2,5]
 *   A2        16 m.  la ville, la reese plus mobile, la mélodie en contrechant,
 *                    harmonisée                                         [3,5]
 *   C         16 m.  la dernière marche : quatre temps au sol, la mélodie haute,
 *                    harmonisée                                           [5]
 *   clapets    8 m.  deux clapets sur le comptoir : les deux sonneries seules
 *                    sur la pédale, la reese qui glisse                  [2,5]
 *   B2         8 m.  Madame Mai : la mélodie, la nappe ouverte             [4]
 *   C2         8 m.  la dernière marche, au sommet                        [5]
 *   retour    16 m.  la retombée : la reese se referme, les deux sonneries une
 *                    dernière fois, la relance                       [2 → 3]
 *
 * Les creux : l'escalier (mesures 33 à 48), les clapets (81 à 88), le retour.
 * La mélodie joue moins de la moitié du temps ; les sonneries, une phrase sur
 * huit mesures.
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
  function silences(n) { var l = []; for (var i = 0; i < n; i++) l.push(SILENCE); return l; }
  function fois(b, n) { var l = []; for (var i = 0; i < n; i++) l.push(b); return l; }
  function a(m, n, barre) { var l = silences(n); l[m - 1] = barre; return l; }

  // LES DEUX TÉLÉPHONES
  var FIXE = 'E5 G#5 E5 G#5 E5 G#5 . . E5 G#5 E5 G#5 E5 G#5 . .';     // le fixe : deux sonneries à la tierce
  var CLAPET = 'B5 B5 . G#5 . B5 . . C#6 . B5 . G#5 . . .';            // le clapet : la mélodie de 1995
  var CLAPET_FIN = 'B5 B5 . G#5 . B5 . . C#6 . B5 . E5 . . .';         // … qui retombe

  // L'ESCALIER : huit marches, une de moins à chaque mesure
  var MARCHES = ['C#4', 'D#4', 'E4', 'F#4', 'G#4', 'A4', 'B4', 'C#5'];
  function escalier(n) {
    var l = [];
    for (var i = 0; i < 16; i++) l.push(i < n ? MARCHES[i] : '.');
    return l.join(' ');
  }

  // LA REESE : de longues notes qui glissent
  var R_GLISSE = 'R - - - - - - - - - ~8 - R - - -';
  var R_TOMBE = 'R - - - - - - - 7 - - - ~5 - - -';
  var R_SAUTE = 'R - - R . . R - - - ~8 - - - 5 -';
  var R_APPEL = 'R - - - - - - - R - - R - - ~8 -';     // elle appelle la mesure suivante

  // LA MÉLODIE À LA GRANDE SCIE
  var LEAD_B = [
    'C#5 - - - - - - - E5 - - - - - - -',
    'B4 - - - - - - - G#4 - - - - - - -',
    'A4 - - - - - - - C#5 - - - F#5 - - -',
    'E5 - - - - - - - - - - - . . . .',
    'C#5 - - - - - - - E5 - - - A5 - - -',
    'G#5 - - - - - - - B5 - - - - - - -',
    'F#5 - - - - - - - D#5 - - - B4 - - -',
    'D#5 - - - - - - - - - - - . . . .'
  ];
  var LEAD_B_FIN = [
    'C#5 - - - - - - - A4 - - - F#4 - - -',
    'D#5 - - - - - - - F#5 - - - - - - -',
    'C#5 - - - - - - - D#5 - - - - - - -',
    'B#4 - - - - - - - - - - - . . . .'
  ];
  var LEAD_C = [
    'E5 - - - - - - - A5 - - - G#5 - - -',
    'F#5 - - - - - - - D#5 - - - B4 - - -',
    'C#5 - - - - - - - E5 - - - G#5 - - -',
    'B5 - - - - - - - G#5 - - - - - - -',
    'A5 - - - - - - - E5 - - - C#5 - - -',
    'D#5 - - - - - - - F#5 - - - B5 - - -',
    'G#5 - - - - - - - C#5 - - - D#5 - - -',
    'B#4 - - - - - - - - - - - D#5 - - -',
    'C#6 - - - - - - - B5 - - - A5 - - -',
    'B5 - - - - - - - F#5 - - - D#5 - - -',
    'E5 - - - - - - - G#5 - - - C#6 - - -',
    'B5 - - - - - - - G#5 - - - - - - -',
    'A5 - - - - - - - F#5 - - - C#5 - - -',
    'E5 - - - - - - - C#5 - - - A4 - - -',
    'C#5 - - - - - - - D#5 - - - - - - -',
    'B#4 - - - - - - - - - - - . . . .'
  ];
  var LEAD_A2 = [
    'G#4 - - - - - - - - - - - . . . .',
    'E4 - - - - - - - - - - - . . . .',
    'F#4 - - - - - - - C#5 - - - - - - -',
    'G#4 - - - - - - - - - - - . . . .'
  ];

  // la batterie : le demi-temps, saturé
  var B_NUIT_X = 'Kx . h . h . k h S . h . h . k h';
  var B_NUIT = 'K . h . h . k h S . h . h h k h';
  var B_NUIT_T = 'K . h . h . k h S . h . T T T T';
  var B_RELANCE = 'K . h . h . k h kz . . . T T S S';
  var B_SEPT_X = 'Kx . h h h . k h S c h h h . k h';
  var B_SEPT = 'K . h h h . k h S c h h h . k h';
  var B_SOL_X = 'Kx h h h kS c h h k h h h kS c h h';     // la dernière marche : quatre temps au sol
  var B_SOL = 'K h h h kS c h h k h h h kS c h h';
  var B_SOL_R = 'K h h h kS c h h kz . T T T T S S';
  var B_CLAP_X = 'Kx . . . . . . . S . . . . . . .';
  var B_CLAP = 'K . . . . . k . S . . . . . . .';

  A.theme('livre_h10', {
    titre: 'Deux téléphones', moment: 'la ville le jour, livre 10 (et son introduction)',
    tonalite: 'do dièse mineur',
    humeur: 'la ville la nuit en 2040 : une reese lourde qui glisse, deux sonneries qui se répondent, un escalier qu\'on mure',
    ville: true,
    bpm: 116, gain: 1,
    pompe: { prof: 0.6, rel: 0.2 },
    echo: { pas: 3, retour: 0.4, coupe: 3200 },
    salle: { taille: 0.7, duree: 3, ton: 4500 },
    cassette: { sature: 1.1, coupe: 11000, bas: 45, souffle: 0.003, flotte: { prof: 2, vit: 0.4 } },
    voix: {
      lead:    { inst: 'supersaw', vol: 0.08, scies: 7, desaccord: 20, large: 0.9, rev: 0.35, echo: 0.25, flotte: { prof: 6, vit: 0.5 }, filtre: 4000, env: [0.02, 0.5, 0.85, 0.25], pan: 0.05 },
      harmo:   { inst: 'supersaw', vol: 0.04, scies: 5, desaccord: 16, large: 0.7, rev: 0.35, echo: 0.15, filtre: 3200, env: [0.02, 0.5, 0.85, 0.25], pan: -0.25 },
      fixe:    { inst: 'sub', vol: 0.06, echo: 0.3, rev: 0.3, pan: -0.35 },
      clapet:  { inst: 'pulse', duty: 0.25, vol: 0.05, filtre: 3000, echo: 0.35, rev: 0.25, pan: 0.35 },
      marches: { inst: 'pluck2', vol: 0.08, oct: 4, filtre: 2800, echo: 0.4, rev: 0.2, pan: 0.1 },
      nappe:   { inst: 'supersaw', vol: 0.08, oct: 3, scies: 5, rev: 0.45, pompe: true, large: 1, flotte: { prof: 8, vit: 0.35 }, filtre: 2600, env: [0.25, 0.8, 0.85, 0.3] },
      reese:   { inst: 'reese', vol: 0.12, oct: 1, plancher: 'A1', desaccord: 14, chaleur: 2.6, pompe: true, ton: [2200, 700, 0.3], filtre: 2400 },
      batt:    { vol: 0.55, drive: 1.4, porte: 0.6, tenue: 0.22, rev: 0.18, filtre: 11000 }
    },
    sections: {
      // ── l'introduction, jouée une fois : le clapet sonne ──
      intro: {
        accords: ['C#m', 'C#m', 'Dmaj7/C#', 'G#'],
        ouvre: { nappe: [700, 2600] },
        clapet: [CLAPET, SILENCE, SILENCE, SILENCE],
        fixe: [SILENCE, FIXE, SILENCE, SILENCE],
        nappe: [SILENCE, NAPPE, NAPPE, NAPPE],
        reese: [SILENCE, SILENCE, R_GLISSE, R_APPEL],
        batt: [SILENCE, 'i . . . . . . . i . . . . . . .', B_NUIT_X, B_RELANCE]
      },
      // ── la boucle ──
      A: {
        accords: ['C#m', 'C#m', 'Dmaj7/C#', 'C#m', 'A', 'A', 'G#sus4', 'G#', 'C#m', 'C#m', 'Dmaj7/C#', 'C#m', 'F#m', 'A', 'G#sus4', 'G#'],
        ouvre: { nappe: [1200, 2400] },
        reese: [R_GLISSE, R_TOMBE, R_GLISSE, R_SAUTE, R_GLISSE, R_TOMBE, R_GLISSE, R_APPEL],
        nappe: [NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU, NAPPE, NAPPE],
        fixe: a(4, 16, FIXE).map(function (b, i) { return i === 11 ? FIXE : b; }),
        clapet: a(5, 16, CLAPET).map(function (b, i) { return i === 12 ? CLAPET_FIN : b; }),
        batt: [B_NUIT_X].concat(fois(B_NUIT, 6)).concat([B_NUIT_T, B_NUIT_X]).concat(fois(B_NUIT, 6)).concat([B_RELANCE])
      },
      // Madame Septembre
      B: {
        accords: ['A', 'E/G#', 'F#m', 'C#m', 'A', 'E', 'B', 'B', 'A', 'E/G#', 'F#m', 'C#m/E', 'Dmaj7', 'B', 'G#sus4', 'G#'],
        ouvre: { nappe: [1600, 3000] },
        reese: [R_GLISSE, R_TOMBE, R_GLISSE, R_SAUTE, R_GLISSE, R_TOMBE, R_GLISSE, R_APPEL],
        nappe: NAPPE,
        lead: LEAD_B.concat(silences(4)).concat(LEAD_B_FIN),
        clapet: a(10, 16, CLAPET),
        fixe: a(9, 16, FIXE),
        batt: [B_SEPT_X].concat(fois(B_SEPT, 6)).concat([B_NUIT_T, B_SEPT_X]).concat(fois(B_SEPT, 6)).concat([B_RELANCE])
      },
      // le creux : l'escalier nord, une marche murée par mois
      escalier: {
        accords: ['C#m', 'C#m', 'C#m', 'C#m', 'A', 'A', 'A', 'A', 'F#m', 'F#m', 'F#m', 'F#m', 'C#m', 'A', 'G#sus4', 'G#'],
        ouvre: { nappe: [2400, 1000] },
        marches: [escalier(8), escalier(7), escalier(6), escalier(5), escalier(4), escalier(3), escalier(2), escalier(1)].concat(silences(8)),
        nappe: [NAPPE, TENU, TENU, TENU, NAPPE, TENU, TENU, TENU, NAPPE, TENU, TENU, TENU, NAPPE, NAPPE, NAPPE, NAPPE],
        reese: [RACINE, TENU, TENU, TENU, RACINE, TENU, TENU, TENU, RACINE, TENU, TENU, TENU, R_GLISSE, R_TOMBE, R_GLISSE, R_APPEL],
        clapet: silences(10).concat(['. . . . . . . . B5 B5 . G#5 . . . .']).concat(silences(5)),
        batt: ['x . . . . . . . . . . . . . . .', SILENCE, 'm . . . . . . . . . . . . . . .', SILENCE,
               'm . . . . . . . m . . . . . . .', SILENCE, 'm . . . . . . . m . . . m . . .', SILENCE,
               'T . . . T . . . T . . . . . . .', SILENCE, 'T . . . T . . . T . . . . . . .', 'm . . . m . . . m . . . m . . .',
               'K . . . . . . . S . . . . . . .', 'K . h . h . k h S . h . h . . .', B_NUIT, B_RELANCE]
      },
      A2: {
        copie: 'A', harmo: true,
        reese: [R_SAUTE, R_TOMBE, R_GLISSE, R_SAUTE, R_SAUTE, R_TOMBE, R_GLISSE, R_APPEL],
        lead: silences(4).concat(LEAD_A2).concat(silences(8)),
        batt: [B_NUIT_X].concat(fois(B_NUIT, 6)).concat([B_NUIT_T, B_SEPT_X]).concat(fois(B_SEPT, 6)).concat([B_RELANCE])
      },
      // la dernière marche : quatre temps au sol
      C: {
        accords: ['A', 'B', 'C#m', 'C#m', 'A', 'B', 'G#sus4', 'G#', 'A', 'B', 'C#m', 'E', 'F#m', 'A', 'G#sus4', 'G#'],
        ouvre: { nappe: [2200, 3400] },
        harmo: true,
        lead: LEAD_C,
        reese: [R_SAUTE, R_GLISSE, R_TOMBE, R_SAUTE],
        nappe: NAPPE,
        batt: [B_SOL_X].concat(fois(B_SOL, 6)).concat([B_NUIT_T, B_SOL_X]).concat(fois(B_SOL, 6)).concat([B_SOL_R])
      },
      // deux clapets sur le comptoir
      clapets: {
        accords: ['C#m', 'C#m', 'Dmaj7/C#', 'Dmaj7/C#', 'C#m', 'C#m', 'Dmaj7/C#', 'G#'],
        ouvre: { nappe: [900, 1800] },
        reese: [R_GLISSE, R_TOMBE, R_GLISSE, R_TOMBE, R_GLISSE, R_TOMBE, R_GLISSE, R_APPEL],
        nappe: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE],
        clapet: [CLAPET, SILENCE, SILENCE, SILENCE, CLAPET, SILENCE, SILENCE, SILENCE],
        fixe: [SILENCE, FIXE, SILENCE, SILENCE, SILENCE, FIXE, SILENCE, SILENCE],
        batt: [B_CLAP_X, B_CLAP, B_CLAP, B_CLAP, B_CLAP, B_CLAP, 'K . h . h . k h S . h . h h k h', B_RELANCE]
      },
      // Madame Mai
      B2: {
        copie: 'B', harmo: true,
        accords: ['A', 'E/G#', 'F#m', 'C#m', 'A', 'E', 'B', 'B'],
        clapet: SILENCE, fixe: SILENCE,
        batt: [B_SEPT_X, B_SEPT, B_SEPT, B_SEPT, B_SEPT, B_SEPT, B_SEPT, B_NUIT_T]
      },
      C2: {
        copie: 'C',
        accords: ['A', 'B', 'C#m', 'E', 'F#m', 'A', 'G#sus4', 'G#'],
        lead: LEAD_C.slice(8),
        batt: [B_SOL_X, B_SOL, B_SOL, B_SOL, B_SOL, B_SOL, B_SOL, 'K h h h kS c h h k . h . kS . . .']
      },
      // la retombée
      retour: {
        accords: ['C#m', 'C#m', 'Dmaj7/C#', 'C#m', 'A', 'A', 'G#sus4', 'G#', 'C#m', 'C#m', 'A', 'A', 'F#m', 'A', 'G#sus4', 'G#'],
        ouvre: { reese: [2200, 500], nappe: [2000, 900] },
        reese: [R_GLISSE, R_TOMBE, R_GLISSE, R_SAUTE, R_GLISSE, R_TOMBE, R_GLISSE, R_APPEL],
        nappe: [NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU, NAPPE, NAPPE],
        fixe: a(9, 16, FIXE),
        clapet: a(10, 16, CLAPET_FIN),
        batt: [B_NUIT_X, B_NUIT, B_NUIT, B_NUIT, 'K . . . h . k . S . . . h . . .', 'K . . . h . k . S . . . h . . .', 'K . . . h . k . S . . . h . . .', 'K . . . h . k . S . . . h . k .',
               'K . . . . . . . S . . . . . . .', 'K . . . . . . . S . . . . . . .', 'K . . . . . k . S . . . . . . .', 'K . . . . . k . S . . . . . k .',
               'K . h . h . k h S . h . h . k h', B_NUIT, B_NUIT_T, B_RELANCE]
      }
    },
    ordre: ['intro', 'A', 'B', 'escalier', 'A2', 'C', 'clapets', 'B2', 'C2', 'retour'], boucle: 1
  });
})(typeof FusibleAudio === 'object' ? FusibleAudio : require('../audio.js'));
