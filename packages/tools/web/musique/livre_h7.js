/* ---------------------------------------------------------------------------
 * FUSIBLE — la bande originale : « Chambre 12 » (livre_h7), la ville le jour
 * dans le livre 7, et son introduction.
 *
 * L'insomnie à l'hôtel de la Rive, en 2011. Un groove lent et moite (les doubles
 * croches un peu traînées, la caisse « gated » dans une grande salle), une
 * basse ronde qui chante et glisse d'une note de l'accord à sa voisine (la
 * tierce vers la quinte, la septième vers la quinte), comme une basse sans
 * frettes, jamais par sauts d'octave — c'est elle qu'on fredonne —, des nappes
 * qui flottent, et un motif de douze doubles croches au maillet, qui tourne
 * contre la mesure de seize sans jamais retomber sur le temps avant trois
 * mesures : le couloir du deuxième, où toutes les portes portent le numéro 12.
 *
 * L'accroche hésite : trois coups frappés à une porte (si bémol, trois fois),
 * un soupir qui glisse (ré bémol, do bémol), et le si bémol qui reste. Deux
 * mesures plus tard, la même phrase répond, une octave plus bas, de l'autre
 * côté : tu frappes, et c'est toi qui réponds. Ailleurs, un tableau de clés
 * qu'on décroche (le métal), une sonnette de réception, une télévision derrière
 * le mur qui chante le barrage. Mi bémol mineur ; 84.
 *
 *   intro     2 m.  (une fois) la chambre : le maillet seul, la nappe qui
 *                   s'éclaire, la basse qui glisse vers le premier temps
 *   ── la boucle, 92 mesures, 4 min 23 ──
 *   A        16 m.  l'insomnie : le groove (le cerclage à voix basse, puis la
 *                   caisse « gated » à la mesure 9), la basse ronde, le maillet ;
 *                   les coups à la porte (m. 5 et 13), la réponse (m. 7 et 15)
 *                                                                        [3]
 *   B         8 m.  le couloir : la nappe s'ouvre, le maillet monte à l'octave,
 *                   la basse en marche ; pas de mélodie                     [3,5]
 *   chambre  12 m.  le creux, douze mesures par trois : la nappe, la basse en
 *                   valeurs longues, le maillet qui sort du coton, la sonnette
 *                   de la réception, trois coups lents ; trois mesures pour
 *                   remonter                                              [1 → 2]
 *   A2       16 m.  l'insomnie, harmonisée ; la nappe dès le début         [3,5]
 *   C         8 m.  trois heures : la mélodie chante enfin (do bémol, ré bémol,
 *                   mi bémol mineur), harmonisée ; le clap en fla          [4,5]
 *   pont      8 m.  le tableau des clés : demi-temps, la basse qui piétine et
 *                   monte d'un demi-ton (le napolitain, fa bémol), les clés, la
 *                   télévision derrière le mur                             [2]
 *   B2        8 m.  le couloir, et la mélodie qui hésite (des entrées en retard,
 *                   des silences)                                          [4]
 *   C2        8 m.  trois heures, au sommet : la réponse double la mélodie à
 *                   l'octave grave                                         [5]
 *   retour    8 m.  le petit matin : le cerclage revient, la basse et la nappe
 *                   se referment, la réponse frappe une dernière fois et
 *                   relance                                               [2,5]
 *
 * Les creux : la chambre (mesures 25 à 36), le pont (61 à 68), le retour.
 * La mélodie joue moins de la moitié du temps ; le reste, la basse et le
 * maillet.
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
  function tourne(cases, n) {
    var l = [], k = 0;
    for (var m = 0; m < n; m++) {
      var b = [];
      for (var i = 0; i < 16; i++) { b.push(cases[k % cases.length]); k++; }
      l.push(b.join(' '));
    }
    return l;
  }
  // une mesure écrite en notes, une octave plus bas (la réponse)
  function octaveBas(b) { return b.replace(/([A-G][#b]?)(\d)/g, function (m, n, o) { return n + (+o - 1); }); }

  // LE MAILLET : douze doubles croches contre seize — il retombe sur le temps
  // toutes les trois mesures
  var DOUZE = tourne(['1', '.', '5', '.', '8', '5', '.', '9', '.', '5', '8', '.'], 3);
  var DOUZE_HAUT = tourne(['8', '.', '9', '.', '5', '8', '.', '9', '.', '8', '5', '.'], 3);

  // LA BASSE RONDE : elle monte, glisse, redescend (les degrés suivent l'accord)
  var BR1 = 'R - - - - - - R . . 3 - ~5 - 7 -';
  var BR2 = 'R - - - - - - 8 . . 7 - ~5 - 3 -';
  var BR3 = 'R - - - - - - R . . 3 - 5 - 7 -';      // elle monte à pied vers la mesure suivante
  var BR_MARCHE = 'R - - R . . 5 - . . 7 - ~8 - 5 -';
  var BR_PEDALE = 'R - - - - - - R . . R - - - . .';

  // L'ACCROCHE : trois coups, un soupir — et la réponse, une octave plus bas
  var FRAPPE = '. . Bb4 - Bb4 - Bb4 - - - . . Db5 - ~Cb5 -';
  var FRAPPE_FIN = 'Bb4 - - - - - - - - - . . . . . .';
  var REPONSE = octaveBas(FRAPPE);
  var REPONSE_FIN = octaveBas(FRAPPE_FIN);
  var COUPS_LENTS = 'Bb3 - - - Bb3 - - - Bb3 - - - - - - -';

  // LA MÉLODIE QUI HÉSITE (B2) : des entrées en retard, des silences
  var LEAD_B = [
    '. . . . Bb4 - - - - - - - . . Gb4 -',
    'F4 - - - - - - - . . . . . . . .',
    '. . . . Eb5 - - - Db5 - - - Cb5 - - -',
    'Bb4 - - - - - - - - - - - . . . .',
    '. . . . Bb4 - - - Db5 - - - Eb5 - - -',
    'F5 - - - - - - - Eb5 - - - Db5 - - -',
    'Cb5 - - - - - - - Ab4 - - - . . . .',
    'D5 - - - - - - - - - - - . . . .'
  ];
  // TROIS HEURES : elle chante enfin, et bute encore une fois
  var LEAD_C = [
    'Eb5 - - - - - - - Db5 - - - Bb4 - - -',
    'Ab4 - - - - - - - F5 - - - - - - -',
    'Gb5 - - - . . Gb5 - - - - - F5 - Eb5 -',
    'Bb4 - - - - - - - . . . . . . . .',
    'Eb5 - - - - - - - Gb5 - - - Bb5 - - -',
    'Ab5 - - - - - - - - - - - F5 - - -',
    'Eb5 - - - - - - - F5 - - - - - - -',
    'D5 - - - - - - - - - - - . . . .'
  ];
  var TELE = 'Eb4 - - - - - - - Bb3 - - - - - - -';   // le barrage, derrière le mur

  // la batterie : un groove lent, la grosse caisse qui traîne sur le « et »
  var B_GROOVE_X = 'kx . h . S . h k . . k . S . h .';
  var B_GROOVE = 'k . h . S . h k . . k . S . h .';
  var B_GROOVE_O = 'k . h . S . h k . . k . S . o .';
  var B_GROOVE_R = 'k . h . S . h k . . k . S . h r';
  var B_GROOVE2 = 'k . h h S . h k . h k . S . h h';
  var B_FILL = 'k . h . S . h k . . k . S . t T';
  var B_RELANCE = 'k . h . S . h k kz . . t . T t S';
  var B_REFRAIN_X = 'kx . h . S c h k . . k . S c o .';   // le clap en fla, une double croche après
  var B_REFRAIN = 'k . h . S c h k . . k . S c o .';
  var B_RELANCE_R = 'k . h . S c h k kz . . t . T t S';
  var B_NUIT_X = 'kx . h . S . h k . . k . r . h .';     // le cerclage : tard, à voix basse (la relance s'y pose d'abord)
  var B_NUIT = 'k . h . r . h k . . k . r . h .';
  var B_NUIT_O = 'k . h . r . h k . . k . r . o .';
  var B_PONT_X = 'kx . . . . . . . S . . . . . m .';
  var B_PONT = 'k . . . . . m . S . . . . . . .';
  var B_PONT2 = 'k . . . . . . . S . . m . . m .';

  A.theme('livre_h7', {
    titre: 'Chambre 12', moment: 'la ville le jour, livre 7 (et son introduction)',
    tonalite: 'mi bémol mineur',
    humeur: 'l\'insomnie à l\'hôtel : une basse ronde qui glisse, un maillet de douze contre seize, trois coups à une porte',
    ville: true,
    bpm: 84, gain: 1.36, swing: 0.12,
    pompe: { prof: 0.35, rel: 0.3 },
    echo: { pas: 6, retour: 0.45, coupe: 1800 },
    salle: { taille: 0.85, duree: 3.6, ton: 3200 },
    cassette: { sature: 0.8, coupe: 8500, bas: 40, souffle: 0.006, flotte: { prof: 4, vit: 0.3 } },
    voix: {
      lead:     { inst: 'lead', vol: 0.11, filtre: 2400, ton: [2600, 1300, 0.3], flotte: { prof: 14, vit: 0.35 }, echo: 0.35, rev: 0.45, pan: 0.1 },
      harmo:    { inst: 'lead', vol: 0.045, filtre: 2000, ton: [2200, 1100, 0.3], flotte: { prof: 14, vit: 0.35 }, echo: 0.2, rev: 0.45, pan: -0.25 },
      reponse:  { inst: 'lead', vol: 0.075, filtre: 1500, ton: [1800, 900, 0.3], flotte: { prof: 16, vit: 0.28 }, echo: 0.3, rev: 0.55, pan: -0.4 },
      douze:    { inst: 'tri', vol: 0.1, oct: 4, env: [0.002, 0.3, 0, 0.25], filtre: 2600, echo: 0.3, rev: 0.3, pan: 0.3 },
      nappe:    { inst: 'supersaw', vol: 0.1, oct: 3, scies: 5, rev: 0.55, pompe: true, large: 0.9, flotte: { prof: 14, vit: 0.3 }, filtre: 2200, env: [0.6, 1.0, 0.9, 0.6] },
      sonnette: { inst: 'cloche', vol: 0.05, rev: 0.55, echo: 0.4, pan: 0.4 },
      tele:     { inst: 'choeur', vol: 0.03, oct: 3, filtre: 750, rev: 0.6, pan: -0.1 },
      basse:    { inst: 'basse', vol: 0.085, oct: 1, plancher: 'G1', pompe: true, drive: 0.9, filtre: 1600, ton: [1600, 650, 0.12], env: [0.004, 0.45, 0.65, 0.14] },
      batt:     { vol: 0.6, drive: 1.2, porte: 0.35, tenue: 0.3, rev: 0.3, filtre: 9000 }
    },
    sections: {
      // ── l'introduction, jouée une fois : la chambre ──
      intro: {
        accords: ['Ebm7', 'Bbsus4'],
        ouvre: { nappe: [700, 2200] },
        douze: tourne(['1', '.', '5', '.', '8', '5', '.', '9', '.', '5', '8', '.'], 2),
        nappe: [NAPPE, NAPPE],
        basse: [SILENCE, '. . . . . . . . . . . . 5 - ~3 -'],
        batt: ['r . . . . . . . . . . . r . . .', 'r . . . . . . . kz . . . t . T S']
      },
      // ── la boucle ──
      A: {
        accords: ['Ebm7', 'Ebm7', 'Abm7', 'Abm7', 'Ebm7', 'Ebm7', 'Abm7', 'Bb7', 'Ebm7', 'Ebm7', 'Abm7', 'Abm7', 'Cbmaj7', 'Cbmaj7', 'Bbsus4', 'Bb7'],
        ouvre: { basse: [700, 1400], douze: [1400, 2600] },
        basse: [BR1, BR2, BR1, BR2, BR1, BR2, BR1, BR3, BR1, BR2, BR1, BR2, BR1, BR2, BR1, BR3],
        douze: DOUZE,
        nappe: silences(4).concat([NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE]),
        lead: silences(4).concat([FRAPPE, FRAPPE_FIN]).concat(silences(6)).concat([FRAPPE, FRAPPE_FIN, SILENCE, SILENCE]),
        reponse: silences(6).concat([REPONSE, REPONSE_FIN]).concat(silences(6)).concat([REPONSE, REPONSE_FIN]),
        batt: [B_NUIT_X, B_NUIT, B_NUIT, B_NUIT_O, B_NUIT, B_NUIT, B_NUIT, B_FILL,
               B_GROOVE_X, B_GROOVE, B_GROOVE, B_GROOVE_O, B_GROOVE, B_GROOVE, B_GROOVE_R, B_RELANCE]
      },
      // le couloir : sans mélodie
      B: {
        accords: ['Cbmaj7', 'Bbm7', 'Abm7', 'Gbmaj7', 'Cbmaj7', 'Bbm7', 'Fm7b5', 'Bb7'],
        ouvre: { nappe: [1400, 2600] },
        basse: [BR_MARCHE, BR2, BR_MARCHE, BR2, BR_MARCHE, BR2, BR1, BR3],
        douze: DOUZE_HAUT,
        nappe: NAPPE,
        batt: [B_REFRAIN_X].concat(fois(B_REFRAIN, 6)).concat([B_RELANCE_R])
      },
      // le creux : douze mesures, par trois
      chambre: {
        accords: ['Ebm7', 'Ebm7', 'Ebm7', 'Cbmaj7', 'Cbmaj7', 'Cbmaj7', 'Abm7', 'Abm7', 'Abm7', 'Bbsus4', 'Bbsus4', 'Bb7'],
        ouvre: { douze: [500, 2000], basse: [500, 1200] },
        nappe: [NAPPE, TENU, TENU, NAPPE, TENU, TENU, NAPPE, TENU, TENU, NAPPE, TENU, NAPPE],
        basse: [RACINE, TENU, TENU, RACINE, TENU, TENU, RACINE, TENU, TENU, BR1, BR2, BR3],
        douze: DOUZE,
        sonnette: [SILENCE, SILENCE, SILENCE, 'Bb5 . . . . . . . . . . . . . . .'].concat(silences(8)),
        reponse: silences(7).concat([COUPS_LENTS]).concat(silences(4)),
        batt: ['kx . . . . . . . . . . . . . . .', SILENCE, SILENCE, 'r . . . . . . . . . . . . . . .', SILENCE, SILENCE,
               'r . . . . . . . . . . . . . . .', SILENCE, SILENCE,
               'k . . . . . . k . . k . . . . .', 'k . h . . . h k . . k . . . h .', B_RELANCE]
      },
      A2: {
        copie: 'A', harmo: true,
        nappe: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE],
        basse: [BR2, BR1, BR2, BR1, BR1, BR2, BR1, BR3, BR2, BR1, BR2, BR1, BR1, BR2, BR1, BR3],
        batt: [B_GROOVE_X, B_GROOVE2, B_GROOVE, B_GROOVE2, B_GROOVE, B_GROOVE2, B_GROOVE, B_FILL,
               B_GROOVE_X, B_GROOVE2, B_GROOVE, B_GROOVE2, B_GROOVE, B_GROOVE2, B_GROOVE_R, B_RELANCE]
      },
      // trois heures
      C: {
        accords: ['Cbmaj7', 'Db', 'Ebm7', 'Ebm7', 'Cbmaj7', 'Db', 'Bbsus4', 'Bb7'],
        ouvre: { nappe: [2000, 3400] },
        harmo: true,
        basse: [BR1, BR3, BR1, BR2, BR1, BR3, BR1, BR3],
        douze: DOUZE,
        nappe: NAPPE,
        lead: LEAD_C,
        batt: [B_REFRAIN_X, B_REFRAIN, B_REFRAIN, B_REFRAIN, B_REFRAIN_X, B_REFRAIN, B_REFRAIN, B_RELANCE_R]
      },
      // le tableau des clés : la basse qui piétine, le napolitain, la télévision derrière le mur
      pont: {
        accords: ['Ebm', 'Ebm', 'Fbmaj7', 'Fbmaj7', 'Ebm', 'Ebm', 'Fbmaj7', 'Bb7'],
        ouvre: { douze: [900, 1600] },
        basse: fois(BR_PEDALE, 7).concat([BR3]),
        douze: DOUZE,
        tele: [TELE, SILENCE, SILENCE, SILENCE, TELE, SILENCE, SILENCE, SILENCE],
        batt: [B_PONT_X, B_PONT, B_PONT2, B_PONT, B_PONT, B_PONT2, 'k . . . . . . k . . k . S . h .', B_RELANCE]
      },
      B2: {
        copie: 'B', harmo: true,
        lead: LEAD_B,
        douze: DOUZE,
        batt: [B_REFRAIN_X, B_REFRAIN, B_REFRAIN, B_GROOVE2, B_REFRAIN, B_REFRAIN, B_REFRAIN, B_RELANCE_R]
      },
      // trois heures, au sommet : la réponse double la mélodie à l'octave grave
      C2: {
        copie: 'C',
        reponse: LEAD_C.map(octaveBas),
        douze: DOUZE_HAUT,
        batt: [B_REFRAIN_X, B_REFRAIN, B_REFRAIN, B_REFRAIN, B_REFRAIN_X, B_REFRAIN, B_REFRAIN, 'k . h . S c h k . . k . S . . .']
      },
      // le petit matin
      retour: {
        accords: ['Ebm7', 'Ebm7', 'Abm7', 'Abm7', 'Cbmaj7', 'Cbmaj7', 'Bbsus4', 'Bb7'],
        ouvre: { basse: [1400, 600], nappe: [1800, 900] },
        basse: [BR1, BR2, BR1, BR2, BR1, BR2, BR1, BR3],
        douze: DOUZE,
        nappe: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE],
        reponse: silences(6).concat([REPONSE, REPONSE_FIN]),
        batt: [B_NUIT_X, B_NUIT, B_NUIT, B_NUIT_O, 'k . . . r . . k . . k . r . . .', 'k . . . r . . k . . k . r . . .', B_FILL, B_RELANCE]
      }
    },
    ordre: ['intro', 'A', 'B', 'chambre', 'A2', 'C', 'pont', 'B2', 'C2', 'retour'], boucle: 1
  });
})(typeof FusibleAudio === 'object' ? FusibleAudio : require('../audio.js'));
