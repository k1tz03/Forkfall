/* ---------------------------------------------------------------------------
 * FUSIBLE — la bande originale : « Vingt degrés dedans » (livre_h9), la ville
 * le jour dans le livre 9, et son introduction.
 *
 * 2029 : un Mondial d'hiver sous un dôme, vingt degrés dedans, cinquante
 * dehors. Des cloches de glace, pures (trois sinus qui ne s'accordent pas), qui
 * tombent en cascade dans un écho à la croche pointée et une salle immense — le
 * Dôme, sa réverbération de cinq secondes ; une nappe lointaine qui met une
 * seconde à venir ; une basse qui pulse en doubles croches comme une
 * ventilation, accentuée par trois comme des pales, son filtre qui respire
 * d'une section à l'autre ; et le souffle de la cassette poussé un peu : l'air
 * qu'on climatise. Le noir, ici, est froid et poli.
 *
 * L'accroche est aux cloches : do, la bémol, fa, mi bémol, fa — une cascade de
 * cinq notes à la croche pointée, qui se pose sur fa (sur ré bémol, puis si bémol
 * mineur, elle change sa dernière marche). Une flûte froide, au souffle mince,
 * chante dans les sections du milieu. Au creux, la minute de silence : huit
 * mesures, et l'arbitre en ajoute une. Au pont, la porte de service s'ouvre : la
 * chaleur est un mur (une reese qui tremble, le napolitain, sol bémol).
 * Fa mineur ; 100.
 *
 *   intro    4 m.  (une fois) le Dôme : les cloches seules, la nappe qui vient
 *                  de loin, la ventilation qui démarre, le roulement
 *   ── la boucle, 104 mesures, 4 min 10 ──
 *   A       16 m.  le Dôme : la ventilation, la grosse caisse et le cerclage, la
 *                  nappe, les cloches une mesure sur deux en tête de phrase  [3]
 *   B       16 m.  le pain de six heures et demie : la flûte (huit mesures), la
 *                  caisse « gated » dans la salle immense, la nappe s'ouvre  [4]
 *   minute   9 m.  le creux : la minute de silence — la nappe, une voix « ouh »
 *                  au loin, la basse en noires, deux cascades au fond ; et la
 *                  neuvième mesure, celle que l'arbitre ajoute, presque vide [1]
 *   reprise  3 m.  la ventilation repart, la grosse caisse, le roulement  [2,5]
 *   A2      16 m.  le Dôme, et la flûte en contrechant, harmonisée       [3,5]
 *   C       16 m.  le tunnel : le sommet, la flûte en grand, le do majeur (la
 *                  chaleur qui entre), les cloches sur les accords froids   [5]
 *   porte    8 m.  la porte de service : la reese qui tremble, le napolitain,
 *                  demi-temps, plus de cloches                              [3]
 *   C2       8 m.  le tunnel, harmonisé                                     [5]
 *   retour  12 m.  la retombée : la ventilation se referme, une dernière
 *                  cascade, la relance                                [2 → 3]
 *
 * Les creux : la minute (mesures 33 à 41), la porte à moitié (77 à 84), le
 * retour. Les cloches jouent un gros tiers du temps, la flûte un autre.
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

  // L'ACCROCHE, AUX CLOCHES : une cascade de cinq notes à la croche pointée
  var GLACE_F = 'C6 . . Ab5 . . F5 . . Eb5 . . F5 . . .';    // sur fa mineur
  var GLACE_DB = 'C6 . . Ab5 . . F5 . . Db5 . . F5 . . .';   // sur ré bémol
  var GLACE_BB = 'F6 . . Db6 . . Bb5 . . Ab5 . . Bb5 . . .';  // sur si bémol mineur
  var GLACE_AB = 'Eb6 . . C6 . . Ab5 . . G5 . . Ab5 . . .';  // sur la bémol
  var GLACE_LENTE = ['C6 . . . . . Ab5 . . . . . F5 . . .', 'Eb5 . . . . . F5 . . . . . . . . .'];

  // LA VENTILATION : des doubles croches, accentuées par trois comme des pales
  var VENT = 'R! R R R! R R R! R R R! R R R! R R R';
  var VENT_CROCHES = 'R . R . R . R . R . R . R . R .';
  var VENT_NOIRES = 'R - - - R - - - R - - - R - - -';

  // LA FLÛTE : le pain du matin (B), le contrechant (A2), le tunnel (C)
  var LEAD_B = [
    'C5 - - - - - - - Db5 - - - Eb5 - - -',
    'Eb5 - - - - - - - - - - - Db5 - C5 -',
    'Ab4 - - - - - - - C5 - - - - - - -',
    'Bb4 - - - Ab4 - - - G4 - - - F4 - - -',
    'Db5 - - - - - - - F5 - - - - - - -',
    'Eb5 - - - - - - - - - - - Db5 - C5 -',
    'C5 - - - - - - - Eb5 - - - G5 - - -',
    'G5 - - - - - - - - - - - . . . .'
  ];
  var LEAD_A2 = [
    'F4 - - - - - - - - - - - . . . .',
    'Ab4 - - - - - - - G4 - - - - - - -',
    'F4 - - - - - - - - - - - . . . .',
    'Ab4 - - - - - - - C5 - - - - - - -',
    'Db5 - - - - - - - - - - - . . . .',
    'C5 - - - - - - - Bb4 - - - G4 - - -',
    'Ab4 - - - - - - - - - - - . . . .',
    'Bb4 - - - - - - - - - - - . . . .'
  ];
  var LEAD_C = [
    'Ab5 - - - - - - - F5 - - - C5 - - -',
    'Bb4 - - - - - - - G5 - - - - - - -',
    'Ab5 - - - - - - - - - - - G5 - F5 -',
    'C5 - - - - - - - - - - - . . . .',
    'Ab5 - - - - - - - F5 - - - Db5 - - -',
    'Eb5 - - - - - - - G5 - - - Bb5 - - -',
    'C6 - - - - - - - - - - - Bb5 - G5 -',
    'E5 - - - - - - - - - - - . . . .',
    'F5 - - - - - - - Ab5 - - - C6 - - -',
    'Bb5 - - - - - - - G5 - - - - - - -',
    'Ab5 - - - G5 - - - F5 - - - C5 - - -',
    'Eb5 - - - - - - - G5 - - - - - - -',
    'F5 - - - - - - - Db5 - - - Bb4 - - -',
    'C5 - - - - - - - F5 - - - Ab5 - - -',
    'G5 - - - - - - - F5 - - - - - - -',
    'E5 - - - - - - - - - - - . . . .'
  ];

  // la batterie : le Dôme (cerclage), le pain (la caisse « gated »), le tunnel (claps en fla)
  var B_DOME_X = 'kx . h . r . h . k . h . r . h .';
  var B_DOME = 'k . h . r . h . k . h . r . h h';
  var B_DOME_T = 'k . h . r . h . k . h . r . t T';
  var B_RELANCE = 'k . h . r . h . kz . . . t T t S';
  var B_PAIN_X = 'kx . h . S . h . k . h . S . h .';
  var B_PAIN = 'k . h . S . h . k . h . S . h h';
  var B_PAIN_R = 'k . h . S . h . kz . . . t T t S';
  var B_TUNNEL_X = 'kx . h h S c h h k . h h S c h h';
  var B_TUNNEL = 'k . h h S c h h k . h h S c h h';
  var B_TUNNEL_R = 'k . h h S c h h kz . t t T T t S';
  var B_PORTE_X = 'Kx . . . . . . . S . . . . . . .';
  var B_PORTE = 'K . . . . . . . S . . . . . k .';

  A.theme('livre_h9', {
    titre: 'Vingt degrés dedans', moment: 'la ville le jour, livre 9 (et son introduction)',
    tonalite: 'fa mineur',
    humeur: 'un Mondial d\'hiver sous un dôme : des cloches de glace, une nappe immense, une basse qui pulse comme une ventilation',
    ville: true,
    bpm: 100, gain: 1.32,
    pompe: { prof: 0.4, rel: 0.25 },
    echo: { pas: 3, retour: 0.5, coupe: 2600 },
    salle: { taille: 1, duree: 5, ton: 3000 },
    cassette: { sature: 0.7, coupe: 9000, bas: 45, souffle: 0.008, flotte: { prof: 3, vit: 0.25 } },
    voix: {
      lead:   { inst: 'flute', vol: 0.11, echo: 0.3, rev: 0.45, flotte: { prof: 6, vit: 0.4 }, filtre: 3000, pan: -0.05 },
      harmo:  { inst: 'flute', vol: 0.05, echo: 0.2, rev: 0.45, flotte: { prof: 6, vit: 0.4 }, filtre: 2600, pan: 0.3 },
      glace:  { inst: 'cloche', vol: 0.09, echo: 0.5, rev: 0.55, pan: 0.25 },
      nappe:  { inst: 'supersaw', vol: 0.08, oct: 3, scies: 5, rev: 0.6, pompe: true, large: 1, flotte: { prof: 10, vit: 0.25 }, filtre: 2000, env: [1.2, 1.5, 0.9, 0.5] },
      loin:   { inst: 'vox', vol: 0.07, oct: 4, voyelle: 'ou', vers: 'o', rev: 0.7, flotte: { prof: 12, vit: 0.3 } },
      reese:  { inst: 'reese', vol: 0.1, oct: 1, plancher: 'A1', desaccord: 22, chaleur: 2.2, pompe: true },
      basse:  { inst: 'sqbasse', vol: 0.07, oct: 1, plancher: 'A1', pompe: true, drive: 1.2, filtre: 1100, ton: [1400, 520, 0.04] },
      batt:   { vol: 0.5, drive: 1.2, porte: 0.3, tenue: 0.3, rev: 0.35, filtre: 9000 }
    },
    sections: {
      // ── l'introduction, jouée une fois : le Dôme ──
      intro: {
        accords: ['Fm7', 'Fm7', 'Dbmaj7', 'Ebsus4'],
        ouvre: { nappe: [600, 2000], basse: [300, 1100] },
        glace: [GLACE_F, SILENCE, GLACE_DB, SILENCE],
        nappe: [NAPPE, TENU, NAPPE, NAPPE],
        basse: [SILENCE, SILENCE, VENT_CROCHES, VENT],
        batt: [SILENCE, 'i . . . . . . . i . . . . . . .', 'k . . . . . . . k . . . . . . .', 'k . . . r . . . kz . . . t T t S']
      },
      // ── la boucle ──
      A: {
        accords: ['Fm7', 'Fm7', 'Dbmaj7', 'Dbmaj7', 'Bbm7', 'Bbm7', 'Ebsus4', 'Eb', 'Fm7', 'Fm7', 'Dbmaj7', 'Dbmaj7', 'Bbm7', 'Cm7', 'Dbmaj7', 'Ebsus4'],
        ouvre: { basse: [500, 1100] },
        basse: VENT,
        nappe: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE, NAPPE, NAPPE],
        glace: [GLACE_F, SILENCE, GLACE_DB, SILENCE, GLACE_BB, SILENCE, SILENCE, SILENCE,
                GLACE_F, SILENCE, GLACE_DB, SILENCE, GLACE_BB, SILENCE, SILENCE, SILENCE],
        batt: [B_DOME_X].concat(fois(B_DOME, 6)).concat([B_DOME_T, B_DOME_X]).concat(fois(B_DOME, 6)).concat([B_RELANCE])
      },
      // le pain de six heures et demie
      B: {
        accords: ['Dbmaj7', 'Ebsus4', 'Fm7', 'Fm7', 'Bbm7', 'Ebsus4', 'Abmaj7', 'Abmaj7', 'Dbmaj7', 'Ebsus4', 'Fm7', 'Dbmaj7', 'Bbm7', 'Ebsus4', 'Csus4', 'C'],
        ouvre: { basse: [700, 1400], nappe: [1400, 2600] },
        basse: VENT,
        nappe: NAPPE,
        lead: LEAD_B.concat(silences(8)),
        glace: silences(8).concat([GLACE_DB, SILENCE, GLACE_F, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE]),
        batt: [B_PAIN_X].concat(fois(B_PAIN, 6)).concat([B_DOME_T, B_PAIN_X]).concat(fois(B_PAIN, 6)).concat([B_PAIN_R])
      },
      // le creux : la minute de silence, et celle que l'arbitre ajoute
      minute: {
        accords: ['Fm7', 'Fm7', 'Dbmaj7', 'Dbmaj7', 'Bbm7', 'Bbm7', 'Fm7', 'Fm7', 'Fm7'],
        ouvre: { nappe: [2000, 900] },
        nappe: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, TENU],
        loin: ['C5 - - - - - - - - - - - - - - -', TENU, 'C5 - - - - - - - - - - - - - - -', TENU, 'Db5 - - - - - - - - - - - - - - -', TENU, 'C5 - - - - - - - - - - - - - - -', TENU, SILENCE],
        basse: [VENT_NOIRES, VENT_NOIRES, VENT_NOIRES, VENT_NOIRES, RACINE, TENU, RACINE, TENU, TENU],
        glace: [SILENCE, GLACE_LENTE[0], GLACE_LENTE[1], SILENCE, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE],
        batt: ['kx . . . . . . . . . . . . . . .'].concat(silences(8))
      },
      reprise: {
        accords: ['Dbmaj7', 'Ebsus4', 'Eb'],
        ouvre: { basse: [300, 1100] },
        basse: [VENT_CROCHES, VENT, VENT],
        nappe: [NAPPE, NAPPE, NAPPE],
        batt: ['kx . . . k . . . k . . . k . . .', 'k . h . r . h . k . h . r . h .', B_RELANCE]
      },
      A2: {
        copie: 'A', harmo: true,
        lead: silences(8).concat(LEAD_A2),
        batt: [B_DOME_X].concat(fois(B_DOME, 6)).concat([B_DOME_T, B_PAIN_X]).concat(fois(B_PAIN, 6)).concat([B_PAIN_R])
      },
      // le tunnel : le sommet
      C: {
        accords: ['Dbmaj7', 'Eb', 'Fm7', 'Fm7', 'Dbmaj7', 'Eb', 'Csus4', 'C', 'Dbmaj7', 'Eb', 'Fm7', 'Abmaj7', 'Bbm7', 'Dbmaj7', 'Csus4', 'C'],
        ouvre: { basse: [900, 1800], nappe: [2000, 3200] },
        basse: VENT,
        nappe: NAPPE,
        lead: LEAD_C,
        glace: [GLACE_DB, SILENCE, GLACE_F, SILENCE, GLACE_DB, SILENCE, SILENCE, SILENCE,
                GLACE_DB, SILENCE, GLACE_F, GLACE_AB, GLACE_BB, GLACE_DB, SILENCE, SILENCE],
        batt: [B_TUNNEL_X].concat(fois(B_TUNNEL, 6)).concat([B_PAIN_R, B_TUNNEL_X]).concat(fois(B_TUNNEL, 6)).concat([B_TUNNEL_R])
      },
      // la porte de service : la chaleur est un mur
      porte: {
        accords: ['Fm', 'Fm', 'Gb', 'Gb', 'Fm', 'Fm', 'Gb', 'C'],
        ouvre: { nappe: [700, 1500] },
        reese: [RACINE, TENU, RACINE, TENU, RACINE, TENU, RACINE, RACINE],
        nappe: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE],
        basse: silences(6).concat([VENT_CROCHES, VENT]),
        batt: [B_PORTE_X, B_PORTE, B_PORTE, B_PORTE, B_PORTE, B_PORTE, 'k . h . S . h . k . h . S . h h', B_PAIN_R]
      },
      C2: {
        copie: 'C', harmo: true,
        accords: ['Dbmaj7', 'Eb', 'Fm7', 'Fm7', 'Dbmaj7', 'Eb', 'Csus4', 'C'],
        batt: [B_TUNNEL_X, B_TUNNEL, B_TUNNEL, B_TUNNEL, B_TUNNEL, B_TUNNEL, B_TUNNEL, 'k . h h S c h h k . h . S . . .']
      },
      // la retombée
      retour: {
        accords: ['Fm7', 'Fm7', 'Dbmaj7', 'Dbmaj7', 'Bbm7', 'Bbm7', 'Ebsus4', 'Eb', 'Fm7', 'Dbmaj7', 'Ebsus4', 'Eb'],
        ouvre: { basse: [1400, 450], nappe: [2000, 1000] },
        basse: [VENT, VENT, VENT, VENT, VENT, VENT, VENT, VENT, VENT_CROCHES, VENT_CROCHES, VENT, VENT],
        nappe: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE],
        glace: [SILENCE, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE, GLACE_F, GLACE_DB, SILENCE, SILENCE],
        batt: [B_DOME_X, B_DOME, 'k . h . . . h . k . h . . . h .', 'k . h . . . h . k . h . . . h .',
               'k . . . . . . . k . . . . . . .', 'k . . . . . . . k . . . . . . .', 'k . . . . . . . k . . . . . . .', 'k . . . . . . . k . . . r . . .',
               'k . . . r . . . k . . . r . . .', 'k . h . r . h . k . h . r . h .', 'k . h . r . h . k . h . r . h h', B_RELANCE]
      }
    },
    ordre: ['intro', 'A', 'B', 'minute', 'reprise', 'A2', 'C', 'porte', 'C2', 'retour'], boucle: 1
  });
})(typeof FusibleAudio === 'object' ? FusibleAudio : require('../audio.js'));
