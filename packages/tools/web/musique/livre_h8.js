/* ---------------------------------------------------------------------------
 * FUSIBLE — la bande originale : « L'Oreillette » (livre_h8), la ville le jour
 * dans le livre 8, et son introduction.
 *
 * 2024 : une voix de mort dans l'oreille, un club dans un tableur. Le thème
 * entier est écrit sur une grille de triolets (`swing` à deux tiers : les cases
 * 1, 2 et 3 de chaque temps tombent sur trois croches en triolet) — les triolets
 * qui calculent : un carré étroit qui égrène trois notes par temps et permute
 * ses cellules mesure après mesure, comme un modèle qui itère ; une basse qui
 * boite en croches ternaires ; des bips purs, des sinus, rien de chaud. Le
 * froid du numérique, dans le son du groupe : la cassette presque propre.
 *
 * L'accroche est la voix : une voix formantée, trois voyelles qui se passent
 * les syllabes, sèche, collée à l'oreille droite (l'oreillette), dit la phrase
 * du livre sur la grille des triolets — « On commence par les ventes ? » : mi,
 * mi, sol, mi, ré, mi… et si, qui reste en l'air. Au creux, elle compte les
 * jours (« six cent douze » : fa dièse, la, si — les degrés 6, 1, 2 du dorien).
 * Une mélodie au triangle, froide, lui répond dans les sections chantées.
 * La dorien ; 110.
 *
 *   intro       4 m.  (une fois) le déclic de l'oreillette, la voix seule, puis
 *                     le calcul qui se met en route, la basse, le roulement
 *   ── la boucle, 116 mesures, 4 min 13 ──
 *   A          16 m.  le tableur : la bascule dorienne (la mineur, ré sur la),
 *                     le calcul, la basse qui boite, les bips ; la voix à la
 *                     mesure 8                                            [3]
 *   B          16 m.  le modèle : les accords montent et descendent comme des
 *                     lignes, la mélodie au triangle (huit mesures), la nappe
 *                     de verre ; la voix à la mesure 16                    [4]
 *   projecteurs 16 m. le creux : trois heures, le stade s'allume tout seul (un
 *                     boum) ; la nappe, la basse en rondes, le calcul au loin,
 *                     le si bémol du mort (l'ombre phrygienne) ; la voix compte
 *                     « six cent douze », puis « trois cent douze » ; quatre
 *                     mesures pour remonter                            [1 → 2]
 *   A2         16 m.  le tableur, et la mélodie en contrechant, harmonisée ;
 *                     la voix se tait                                    [3,5]
 *   C          16 m.  fin de cycle : le sommet, la mélodie deux fois, les
 *                     triolets partout, la voix à la toute fin             [5]
 *   laverie    16 m.  minuit, la chemise tourne pour la troisième fois :
 *                     demi-temps, un tambour qui roule en triolets, puis la
 *                     reprise                                         [2 → 3]
 *   B2          8 m.  le modèle, harmonisé                               [4]
 *   retour      8 m.  la retombée : le calcul et la basse se referment    [2,5]
 *   relance     4 m.  le déclic, la voix, le roulement en triolets        [3]
 *
 * Les creux : les projecteurs (mesures 33 à 48), la laverie (81 à 96). La
 * voix parle cinq fois par boucle, moins d'une fois par minute ; la mélodie
 * au triangle, un gros tiers du temps.
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
  // une voix qui ne parle qu'à la mesure `m` (1 à n) d'une section de n mesures
  function a(m, n, barre) { var l = silences(n); l[m - 1] = barre; return l; }

  // LA VOIX : « On commence par les ventes ? » — une syllabe par triolet ; les
  // trois voyelles se passent la phrase (o : « on com- », a : « -mence par…
  // ven- », e : « les… -tes ? »)
  var DIT_O = 'E3 E3 . . . . . . . . . . . . . .';
  var DIT_A = '. . G3 . E3 . E3 . . . . . . . . .';
  var DIT_E = '. . . . . D3 . . B3 - - - . . . .';
  // « six cent douze » (fa dièse, la, si : 6, 1, 2) et « trois cent douze »
  var SIX_E = 'F#3 . . . B3 - - - . . . . . . . .';
  var SIX_A = '. A3 . . . . . . . . . . . . . .';
  var SIX_O = '. . B3 . . . . . . . . . . . . .';
  var TROIS_A = 'C4 A3 . . . . . . . . . . . . . .';
  var TROIS_O = '. . B3 . . . . . . . . . . . . .';
  var TROIS_E = '. . . . B3 - - - . . . . . . . .';

  // LE CALCUL : trois notes par temps, des cellules qui permutent
  var CALCUL = ['1 5 8 . 5 8 1 . 8 1 5 . 1 5 9 .', '5 1 8 . 1 8 5 . 8 5 1 . 5 9 8 .', '1 8 5 . 8 5 1 . 5 1 8 . 7 5 1 .'];
  var CALCUL_LOIN = ['1 . . . 5 . . . 8 . . . 5 . . .', '1 . . . 5 . . . 9 . . . 8 . . .'];
  var TAMBOUR = '1 5 1 . 5 1 5 . 1 5 1 . 5 1 5 .';         // la laverie : le tambour qui tourne

  // la basse qui boite
  var B_BOITE = 'R . 8 . R . R . R . 8 . R . 5 .';
  var B_TRIOLET = 'R R 8 . R . R . R R 8 . R . 5 .';
  var B_BOITE_FIN = 'R . 8 . R . 5 . R . 8 . 5 5 8 .';
  var BIPS = [SILENCE, '. . . . . . . . . . . . . . E6 .', SILENCE, '. . A5 . . . . . . . . . . . . .'];

  // LA MÉLODIE AU TRIANGLE : des valeurs longues, des levées en triolet
  var LEAD_B = [
    'B4 - - - - - - - - - - - G4 A4 B4 .',
    'D5 - - - - - - - - - - - . . . .',
    'C5 - - - B4 - - - A4 - - - E4 - - -',
    'F#4 - - - - - - - - - - - . . . .',
    'E5 - - - - - - - - - - - D5 E5 G5 .',
    'F#5 - - - - - - - - - - - . . . .',
    'G5 - - - F#5 - - - E5 - - - B4 - - -',
    'E5 - - - - - - - - - - - . . . .'
  ];
  var LEAD_A2 = [
    'A4 - - - - - - - - - - - . . . .',
    'C5 - - - - - - - B4 - - - - - - -',
    'A4 - - - - - - - F#4 - - - - - - -',
    'D5 - - - - - - - - - - - . . . .',
    'E5 - - - - - - - - - - - D5 E5 G5 .',
    'F#5 - - - - - - - - - - - . . . .',
    'G5 - - - - - - - E5 - - - B4 - - -',
    'A4 - - - - - - - - - - - . . . .'
  ];
  var LEAD_C = [
    'E5 - - - - - - - A5 - - - G5 - - -',
    'F#5 - - - - - - - - - - - E5 F#5 A5 .',
    'G5 - - - - - - - E5 - - - - - - -',
    'D5 - - - - - - - B4 - - - - - - -',
    'C5 - - - - - - - E5 - - - A5 - - -',
    'A5 - - - F#5 - - - D5 - - - - - - -',
    'B4 - - - - - - - - - - - E5 F#5 G5 .',
    'E5 - - - - - - - - - - - . . . .'
  ];

  // la batterie : la croche ternaire, des roulements en triolets
  var B_X = 'kx . h . . . k . S . h . . . h .';          // le demi-temps : la caisse sur le trois
  var B_ = 'k . h . . . k . S . h . k . h .';
  var B_FILL = 'k . h . . . k . S . h . t t T .';           // les toms en triolet
  var B_RELANCE = 'k . h . . . k . kz . . . t T S .';
  var B_QUATRE_X = 'kx . h . S . h . k . h . S . h .';      // le modèle : la caisse sur deux et quatre
  var B_QUATRE = 'k . h . S . h . k . h . S h h .';
  var B_C_X = 'kx h h . S c h . k h h . S c h .';
  var B_C = 'k h h . S c h . k h h . S c k .';
  var B_C_R = 'k h h . S c h . kz . . . t T S .';
  var B_B_X = 'kx . h . S c h . k . h . S c h .';
  var B_B = 'k . h . S c h . k . h . S c k .';
  var B_LAV_X = 'kx . . . . . h . S . . . . . h .';
  var B_LAV = 'k . . . . . h . S . . . k . h .';
  var B_LAV2 = 'k . . . . . h . S . h . k h h .';

  A.theme('livre_h8', {
    titre: "L'Oreillette", moment: 'la ville le jour, livre 8 (et son introduction)',
    tonalite: 'la dorien',
    humeur: 'une voix de mort dans l\'oreille droite, des triolets qui calculent : « On commence par les ventes ? »',
    ville: true,
    bpm: 110, gain: 1.4, swing: 0.6667,
    pompe: { prof: 0.5, rel: 0.18 },
    echo: { pas: 2.6667, retour: 0.38, coupe: 3000 },
    salle: { taille: 0.7, duree: 2.6, ton: 5000 },
    cassette: { sature: 0.6, coupe: 11000, bas: 55, souffle: 0.002, flotte: { prof: 1.5, vit: 0.5 } },
    voix: {
      lead:    { inst: 'tri', vol: 0.12, echo: 0.3, rev: 0.3, flotte: { prof: 4, vit: 0.5 }, filtre: 3200, pan: 0.05, env: [0.01, 0.3, 0.75, 0.2] },
      harmo:   { inst: 'tri', vol: 0.055, echo: 0.2, rev: 0.3, filtre: 2600, pan: -0.3, env: [0.01, 0.3, 0.75, 0.2] },
      vo:      { inst: 'vox', vol: 0.42, oct: 3, voyelle: 'o', vers: 'ou', env: [0.015, 0.12, 0.85, 0.07], pan: 0.7, echo: 0.12 },
      va:      { inst: 'vox', vol: 0.42, oct: 3, voyelle: 'a', env: [0.015, 0.12, 0.85, 0.07], pan: 0.7, echo: 0.12 },
      ve:      { inst: 'vox', vol: 0.42, oct: 3, voyelle: 'e', vers: 'eu', env: [0.015, 0.12, 0.85, 0.07], pan: 0.7, echo: 0.12 },
      calcul:  { inst: 'pulse', duty: 0.2, vol: 0.15, oct: 3, env: [0.001, 0.14, 0, 0.08], filtre: 2800, echo: 0.25, rev: 0.1, pan: -0.2, pompe: true },
      bips:    { inst: 'sub', vol: 0.035, echo: 0.5, rev: 0.35, pan: -0.45 },
      tambour: { inst: 'pluck2', vol: 0.06, oct: 3, filtre: 1500, echo: 0.2, rev: 0.15, pompe: true, pan: 0.15 },
      nappe:   { inst: 'supersaw', vol: 0.1, oct: 3, scies: 5, desaccord: 9, large: 0.6, rev: 0.4, pompe: true, filtre: 2400, flotte: { prof: 4, vit: 0.4 }, env: [0.3, 0.8, 0.85, 0.35] },
      basse:   { inst: 'sqbasse', vol: 0.07, oct: 1, plancher: 'C2', pompe: true, drive: 1.3, filtre: 2000, ton: [2400, 1000, 0.05] },
      batt:    { vol: 0.52, drive: 1.2, porte: 0.4, tenue: 0.18, rev: 0.15, filtre: 10000 }
    },
    sections: {
      // ── l'introduction, jouée une fois : le déclic, la voix ──
      intro: {
        accords: ['Am7', 'Am7', 'D/A', 'Am7'],
        ouvre: { calcul: [600, 2800] },
        vo: [DIT_O, SILENCE, SILENCE, SILENCE],
        va: [DIT_A, SILENCE, SILENCE, SILENCE],
        ve: [DIT_E, SILENCE, SILENCE, SILENCE],
        calcul: [SILENCE].concat(CALCUL),
        basse: [SILENCE, SILENCE, B_BOITE, B_BOITE_FIN],
        batt: ['i . . . . . . . . . . . . . . .', 'i . . . i . . . i . . . i . . .', 'k . h . k . h . k . h . k . h .', B_RELANCE]
      },
      // ── la boucle ──
      A: {
        accords: ['Am7', 'Am7', 'D/A', 'D/A', 'Am7', 'Am7', 'D/A', 'Em7', 'Am7', 'Am7', 'D/A', 'D/A', 'Cmaj7', 'Bm7', 'Em7', 'D'],
        ouvre: { calcul: [1200, 2800], basse: [900, 1600] },
        calcul: CALCUL,
        basse: [B_BOITE, B_BOITE, B_BOITE, B_TRIOLET],
        bips: BIPS,
        nappe: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE, NAPPE, NAPPE],
        vo: a(8, 16, DIT_O), va: a(8, 16, DIT_A), ve: a(8, 16, DIT_E),
        batt: [B_X].concat(fois(B_, 6)).concat([B_FILL, B_X]).concat(fois(B_, 6)).concat([B_RELANCE])
      },
      // le modèle : les accords montent et descendent comme des lignes
      B: {
        accords: ['Cmaj7', 'Bm7', 'Am7', 'D', 'Cmaj7', 'Bm7', 'Em7', 'Em7', 'Cmaj7', 'D', 'Bm7', 'Em7', 'Cmaj7', 'D', 'Esus4', 'Em7'],
        ouvre: { nappe: [1600, 2800] },
        calcul: CALCUL,
        basse: [B_BOITE, B_BOITE, B_BOITE, B_TRIOLET],
        nappe: NAPPE,
        lead: LEAD_B.concat(silences(8)),
        vo: a(16, 16, DIT_O), va: a(16, 16, DIT_A), ve: a(16, 16, DIT_E),
        batt: [B_QUATRE_X].concat(fois(B_QUATRE, 6)).concat([B_FILL, B_B_X]).concat(fois(B_B, 6)).concat([B_RELANCE])
      },
      // le creux : trois heures, le stade s'allume tout seul
      projecteurs: {
        accords: ['Am', 'Am', 'Bbmaj7', 'Bbmaj7', 'Am', 'Am', 'Fmaj7', 'E', 'Am', 'Am', 'Bbmaj7', 'Bbmaj7', 'Fmaj7', 'Fmaj7', 'Esus4', 'E'],
        ouvre: { calcul: [500, 1400], basse: [500, 1600] },
        nappe: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE],
        basse: [RACINE, TENU, RACINE, TENU, RACINE, TENU, RACINE, RACINE, RACINE, TENU, RACINE, TENU, B_BOITE, B_BOITE, B_BOITE, B_BOITE_FIN],
        calcul: CALCUL_LOIN,
        bips: ['. . . . . . . . . . . . . . E6 .', SILENCE, SILENCE, SILENCE],
        vo: a(5, 16, SIX_O).map(function (b, i) { return i === 12 ? TROIS_O : b; }),
        va: a(5, 16, SIX_A).map(function (b, i) { return i === 12 ? TROIS_A : b; }),
        ve: a(5, 16, SIX_E).map(function (b, i) { return i === 12 ? TROIS_E : b; }),
        batt: ['kx . . . . . . . . . . . . . . .', SILENCE, SILENCE, SILENCE,
               'i . . . . . . . . . . . . . . .', SILENCE, 'i . . . . . . . . . . . . . . .', SILENCE,
               'i . . . . . . . i . . . . . . .', SILENCE, 'i . . . . . . . i . . . . . . .', SILENCE,
               'k . . . . . . . k . . . . . . .', 'k . . . k . . . k . . . k . . .', 'k . h . k . h . k . h . k . h .', B_RELANCE]
      },
      A2: {
        copie: 'A', harmo: true,
        lead: silences(8).concat(LEAD_A2),
        vo: SILENCE, va: SILENCE, ve: SILENCE,      // la mélodie a la parole ; la voix se tait
        accords: ['Am7', 'Am7', 'D/A', 'D/A', 'Am7', 'Am7', 'D/A', 'Em7', 'Am7', 'Am7', 'D/A', 'D/A', 'Cmaj7', 'Bm7', 'Em7', 'D'],
        nappe: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE, NAPPE, NAPPE],
        batt: [B_X].concat(fois(B_, 6)).concat([B_FILL, B_B_X]).concat(fois(B_B, 6)).concat([B_RELANCE])
      },
      // fin de cycle : le sommet
      C: {
        accords: ['Am7', 'D', 'Cmaj7', 'G', 'Am7', 'D', 'Em7', 'Em7', 'Am7', 'D', 'Cmaj7', 'G', 'Am7', 'D', 'Esus4', 'Em7'],
        ouvre: { nappe: [2000, 3400] },
        harmo: true,
        lead: LEAD_C,
        calcul: CALCUL,
        basse: [B_TRIOLET, B_BOITE, B_TRIOLET, B_BOITE],
        nappe: NAPPE,
        bips: BIPS,
        vo: a(16, 16, DIT_O), va: a(16, 16, DIT_A), ve: a(16, 16, DIT_E),
        batt: [B_C_X].concat(fois(B_C, 6)).concat([B_FILL, B_C_X]).concat(fois(B_C, 6)).concat([B_C_R])
      },
      // la laverie, à minuit : le tambour tourne pour la troisième fois
      laverie: {
        accords: ['Am7', 'Am7', 'Am7', 'Am7', 'Fmaj7', 'Fmaj7', 'Esus4', 'E', 'Am7', 'Am7', 'D/A', 'D/A', 'Fmaj7', 'Fmaj7', 'Esus4', 'E'],
        ouvre: { tambour: [700, 2200] },
        tambour: TAMBOUR,
        basse: [RACINE, TENU, TENU, TENU, RACINE, TENU, RACINE, RACINE, B_BOITE, B_BOITE, B_BOITE, B_BOITE, B_BOITE, B_BOITE, B_BOITE, B_BOITE_FIN],
        bips: BIPS,
        nappe: silences(8).concat([NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE]),
        batt: [B_LAV_X, B_LAV, B_LAV, B_LAV2, B_LAV, B_LAV, B_LAV, B_LAV2,
               B_X, B_, B_, B_, B_, B_, B_FILL, B_RELANCE]
      },
      B2: {
        copie: 'B', harmo: true,
        accords: ['Cmaj7', 'Bm7', 'Am7', 'D', 'Cmaj7', 'Bm7', 'Em7', 'Em7'],
        vo: SILENCE, va: SILENCE, ve: SILENCE,
        batt: [B_B_X, B_B, B_B, B_B, B_B, B_B, B_B, B_FILL]
      },
      // la retombée
      retour: {
        accords: ['Am7', 'Am7', 'D/A', 'D/A', 'Am7', 'Am7', 'D/A', 'Em7'],
        ouvre: { calcul: [2800, 900], basse: [1600, 600] },
        calcul: CALCUL,
        basse: [B_BOITE, B_BOITE, B_BOITE, B_TRIOLET],
        bips: BIPS,
        nappe: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE],
        batt: [B_X, B_, 'k . h . k . h . k . h . k . h .', 'k . h . k . h . k . h . k . h .',
               'k . . . k . . . k . . . k . . .', 'k . . . k . . . k . . . k . . .', 'k . . . k . . . k . . . k . . .', 'k . . . k . . . k . h . k . h .']
      },
      // le déclic : la voix, et le roulement en triolets
      relance: {
        accords: ['Cmaj7', 'Bm7', 'Em7', 'D'],
        ouvre: { calcul: [900, 2800], basse: [600, 1600] },
        calcul: CALCUL,
        basse: [B_BOITE, B_BOITE, B_TRIOLET, B_BOITE_FIN],
        vo: [SILENCE, SILENCE, DIT_O, SILENCE], va: [SILENCE, SILENCE, DIT_A, SILENCE], ve: [SILENCE, SILENCE, DIT_E, SILENCE],
        batt: ['kx . h . k . h . k . h . k . h .', 'k . h . S . h . k . h . S . h .', 'k . h . S . h . k t t . t T T .', B_RELANCE]
      }
    },
    ordre: ['intro', 'A', 'B', 'projecteurs', 'A2', 'C', 'laverie', 'B2', 'retour', 'relance'], boucle: 1
  });
})(typeof FusibleAudio === 'object' ? FusibleAudio : require('../audio.js'));
