/* ---------------------------------------------------------------------------
 * FUSIBLE — la bande originale : « 23 h 58 » (livre_h6), la ville le jour dans
 * le livre 6, et son introduction.
 *
 * Le fax, la dernière minute du mercato, en 2003 : encore l'analogique, et la
 * panique. Une tête d'impression qui avance en doubles croches — l'horloge du
 * livre, ré et sol, qui ne suit pas les accords —, une basse carrée qui galope
 * (une croche, deux doubles), un arpège nerveux de cinq notes contre seize cases
 * (il ne retombe sur la barre que toutes les cinq mesures), des stabs d'accords
 * comme des échéances. L'harmonie descend (sol, fa, mi bémol : le temps qui
 * file) et, au sommet, elle accélère : deux accords par mesure.
 *
 * L'accroche se dit comme on dit l'heure : « vingt-trois cinquante-huit » — la,
 * si bémol, ré, ré, sol, les degrés 2, 3, 5, 5 et 8 de sol mineur, posés sur
 * l'accord de ré qui attend sa résolution. Le bip du fax (un sinus pur, le ré
 * au-dessus de tout) l'annonce ; le lead carré, fin comme un papier thermique,
 * la dit au bout des phrases ; le creux la ralentit au bip ; le sommet la
 * chante deux fois, harmonisée. Sol mineur ; 132.
 *
 *   intro     4 m.  (une fois) 23 h 58 : deux bips, la tête d'impression qui
 *                   part, la basse qui s'ouvre, le roulement
 *   ── la boucle, 136 mesures, 4 min 07 ──
 *   A        16 m.  la course : le galop, l'horloge, la nappe fermée ; la basse
 *                   descend sol fa mi bémol, do si bémol ; l'accroche aux
 *                   mesures 7 et 15, sur l'accord de ré                  [3]
 *   B        16 m.  les offres : l'arpège nerveux, les stabs à la noire pointée,
 *                   une mélodie qui descend par marches (sol, fa, mi bémol, ré)
 *                   puis l'accroche                                      [4]
 *   C         8 m.  la dernière minute : deux accords par mesure, l'accroche et
 *                   sa réponse, la nappe ouverte                         [5]
 *   papier   16 m.  le creux : le papier descend l'escalier et coule dans la
 *                   Rive — un boum, puis l'horloge seule qui sort du coton, une
 *                   voix « ouh », la basse en rondes ; l'accroche lente au bip ;
 *                   quatre mesures pour remonter                      [1 → 3]
 *   A2       16 m.  la course, plus serrée : la basse saute à l'octave,
 *                   l'arpège revient, l'accroche harmonisée            [3,5]
 *   sous_sol 16 m.  23 h 57, la buanderie : demi-temps, la reese, l'horloge à
 *                   la croche, le napolitain (la bémol) ; deux mesures pour
 *                   repartir                                          [2,5]
 *   B2       16 m.  les offres, harmonisées, la grande scie dessous      [4,5]
 *   C2       16 m.  minuit moins une : la dernière minute deux fois, la grande
 *                   scie double l'accroche au second passage            [5]
 *   minuit   12 m.  la retombée : la basse se referme, le bip, l'horloge seule
 *                                                                     [2]
 *   relance   4 m.  le galop rouvre, les toms, la montée                 [3]
 *
 * Les creux : le papier (mesures 41 à 56), le sous-sol à moitié (73 à 88),
 * minuit (121 à 132). La mélodie joue un gros tiers du temps ; le reste,
 * l'horloge et le galop.
 *
 * La grammaire : audio.js (« L'ÉCRITURE », « LES VOIX ») ; le guide du
 * compositeur : docs/design/bande_originale.md § 6.
 * ------------------------------------------------------------------------- */
(function (A) {
  'use strict';
  var SILENCE = A.SILENCE;
  var TENU = '- - - - - - - - - - - - - - - -';    // la note d'avant continue
  var NAPPE = 'X - - - - - - - - - - - - - - -';
  var NAPPE2 = 'X - - - - - - - X - - - - - - -';   // deux accords dans la mesure
  var RACINE = 'R - - - - - - - - - - - - - - -';
  function silences(n) { var l = []; for (var i = 0; i < n; i++) l.push(SILENCE); return l; }
  function fois(b, n) { var l = []; for (var i = 0; i < n; i++) l.push(b); return l; }
  // un motif de quelques cases qui tourne sans se soucier de la barre : la liste
  // de mesures qu'il remplit avant de retomber sur le premier temps
  function tourne(cases, n) {
    var l = [], k = 0;
    for (var m = 0; m < n; m++) {
      var b = [];
      for (var i = 0; i < 16; i++) { b.push(cases[k % cases.length]); k++; }
      l.push(b.join(' '));
    }
    return l;
  }

  // L'ACCROCHE : « vingt-trois cinquante-huit » — la, si bémol, ré, ré, sol
  var HEURE = 'A4 Bb4 - - D5 D5 G5 - - - - - - - . .';
  var HEURE_FIN = '. . . . . . . . . . . . F#5 - G5 -';      // la sensible, qui relance
  var HEURE_BIP = ['A4 - - - Bb4 - - - - - - - D5 - - -', 'D5 - - - G5 - - - - - - - - - - -'];
  var BIP = 'D6 - - - - - - - . . . . . . . .';              // le fax qui appelle

  // L'HORLOGE : la tête d'impression, ré et sol, qui ne suit pas les accords
  var TETE = 'D5! G4 G4 G4 D5 G4 G4 G4 D5! G4 G4 G4 D5 G4 G4 G4';
  var TETE_LIGNE = 'D5! G4 G4 . D5 G4 G4 . D5! G4 G4 . D5 G4 G4 .';   // une ligne, un saut de papier
  var TIC = 'D5! . . . G4 . . . D5 . . . G4 . . .';                   // la croche : l'heure ralentit

  // la basse, au galop
  var GALOP = 'R! . R R R . R R R . R R R . R R';
  var GALOP_8 = 'R! . R R 8 . R R R . R R 8 . R 8';
  var GALOP_FIN = 'R! . R R R . R R 8 . 8 . 5 . 8 .';
  var CROCHES = 'R . R . R . R . R . R . R . R .';

  // l'arpège nerveux : cinq notes contre seize cases
  var ARP5 = tourne(['1', '3', '5', '8', '9'], 5);
  var ARP_BAS = 'R . 5 . 8 . 5 . R . 5 . 9 . 5 .';

  // les stabs
  var STAB_POINTE = 'X . . . . . X . . . . . X . . .';       // trois coups à la noire pointée
  var STAB_MINUTE = 'X . . X . . . . X . . X . . . .';       // deux par accord
  var STAB_SOUS = '. . . . . . X . . . . . . . . .';
  var STAB_A = '. . . . . . X . . . . . . . . .';         // un coup par mesure : l'échéance

  // la batterie
  var B_COURSE_X = 'kx . h . ks . h . k . h . ks . h .';    // la course : la caisse sèche
  var B_COURSE = 'k . h . ks . h . k . h . ks . h h';
  var B_COURSE_T = 'k . h . ks . h . k . h . ks . T T';
  var B_SERRE_X = 'kx . h . kS . h . k . h . kS . h .';     // plus serrée : la caisse « gated »
  var B_SERRE = 'k . h . kS . h . k . h . kS . h h';
  var B_SERRE_T = 'k . h . kS . h . k . h . kS . T T';
  var B_RELANCE = 'k . h . kS . h . kz . T . t T S S';
  var B_OFFRE_X = 'kx . o . kS c h . k . o . kS c h .';    // le clap en fla, une double croche après
  var B_OFFRE = 'k . o . kS c h . k . o . kS c h h';
  var B_OFFRE_R = 'k . o . kS c h . kz . T . t T S S';
  var B_MINUTE_X = 'kx h h h kS c h h k h h h kS c h h';
  var B_MINUTE = 'k h h h kS c h h k h h h kS c h h';
  var B_MINUTE_R = 'k h h h kS c h h kz . t t T T S S';
  var B_SOUS_X = 'kx . . . . . . . S . . . . . k .';      // le demi-temps
  var B_SOUS = 'k . . . . . . . S . . . . . k .';
  var B_SOUS_I = 'k . i . . . i . S . i . . . k i';
  var B_TIC = 'i . . . . . . . i . . . . . . .';

  // LA MÉLODIE DES OFFRES : elle descend par marches (sol, fa, mi bémol, ré)
  var LEAD_B = [
    '. . G5 - - - - - F5 - G5 - - - - -',
    '. . F5 - - - - - D5 - F5 - - - - -',
    '. . Eb5 - - - - - D5 - Eb5 - - - G5 -',
    'D5 - - - - - - - - - - - . . . .',
    '. . G5 - - - - - F5 - G5 - - - Bb5 -',
    'Bb5 - - - A5 - - - F5 - - - D5 - - -',
    'Eb5 - - - - - - - C5 - - - Eb5 - - -',
    'D5 - - - - - - - - - - - . . . .'
  ].concat(silences(6)).concat([HEURE, HEURE_FIN]);
  // LA DERNIÈRE MINUTE : l'accroche et sa réponse, sur deux accords par mesure
  var LEAD_C = [
    HEURE,
    'Eb5 - - - D5 - C5 - D5 - - - F#5 - - -',
    'A4 Bb4 - - D5 D5 G5 - - - - - Bb5 - - -',
    'G5 - - - Eb5 - - - F#5 - - - A5 - - -',
    'Bb5 - - - - - - - A5 - - - G5 - - -',
    'G5 - - - - - - - F#5 - - - - - - -',
    'G5 - - - Eb5 - - - Eb5 - - - C5 - - -',
    'D5 - - - - - - - - - - - F#5 - G5 -'
  ];
  var LEAD_A = silences(6).concat([HEURE, SILENCE]).concat(silences(6)).concat([HEURE, HEURE_FIN]);

  A.theme('livre_h6', {
    titre: '23 h 58', moment: 'la ville le jour, livre 6 (et son introduction)',
    tonalite: 'sol mineur',
    humeur: 'le fax de la dernière minute : une tête d\'impression en doubles croches, une basse qui galope, « vingt-trois cinquante-huit »',
    ville: true,
    bpm: 132, gain: 1,
    pompe: { prof: 0.55, rel: 0.16 },
    echo: { pas: 3, retour: 0.32, coupe: 2800 },
    salle: { taille: 0.55, duree: 2.0, ton: 4500 },
    cassette: { sature: 1.2, coupe: 10000, bas: 45, souffle: 0.004, flotte: { prof: 3, vit: 0.4 } },
    voix: {
      lead:  { inst: 'pulse', duty: 0.3, vol: 0.1, echo: 0.28, rev: 0.25, flotte: { prof: 5, vit: 0.6 }, filtre: 3600, pan: 0.05 },
      harmo: { inst: 'pulse', duty: 0.3, vol: 0.045, echo: 0.15, rev: 0.25, flotte: { prof: 5, vit: 0.6 }, filtre: 3000, pan: -0.3 },
      envol: { inst: 'supersaw', vol: 0.065, rev: 0.3, scies: 5, desaccord: 14, large: 0.85, filtre: 4200, flotte: { prof: 6, vit: 0.5 }, env: [0.01, 0.4, 0.8, 0.15] },
      fax:   { inst: 'sub', vol: 0.05, echo: 0.4, rev: 0.3, pan: 0.2 },
      tete:  { inst: 'pluck', vol: 0.1, env: [0.001, 0.05, 0, 0.04], ton: [3000, 600, 0.02], filtre: 3200, pan: -0.15, echo: 0.08 },
      arp:   { inst: 'pluck2', vol: 0.075, oct: 4, echo: 0.35, rev: 0.12, pompe: true, pan: 0.3, filtre: 3400 },
      stab:  { inst: 'stab', vol: 0.09, oct: 4, echo: 0.2, rev: 0.25, pompe: true, pan: -0.2 },
      nappe: { inst: 'supersaw', vol: 0.11, oct: 3, scies: 5, rev: 0.35, pompe: true, large: 0.8, flotte: { prof: 8, vit: 0.45 }, filtre: 2600, env: [0.15, 0.8, 0.85, 0.18] },
      ouh:   { inst: 'vox', vol: 0.075, oct: 3, voyelle: 'ou', vers: 'o', rev: 0.5, flotte: { prof: 12, vit: 0.3 }, pompe: true },
      reese: { inst: 'reese', vol: 0.11, oct: 1, plancher: 'G1', desaccord: 11, chaleur: 1.8, pompe: true },
      basse: { inst: 'sqbasse', vol: 0.075, oct: 1, plancher: 'A1', pompe: true, drive: 1.6, filtre: 2400, ton: [2600, 1000, 0.06] },
      batt:  { vol: 0.52, porte: 0.5, tenue: 0.2, rev: 0.14, filtre: 12000 }
    },
    sections: {
      // ── l'introduction, jouée une fois : 23 h 58 ──
      intro: {
        accords: ['Gm', 'Gm', 'Eb', 'D'],
        ouvre: { basse: [250, 2200] },
        fax: [BIP, SILENCE, BIP, SILENCE],
        tete: [TIC, TETE_LIGNE, TETE, TETE],
        basse: [SILENCE, SILENCE, GALOP, GALOP_FIN],
        batt: [B_TIC, B_TIC, 'k . . . k . . . k . . . k . . .', 'k . . . k . . . kz . T . t T S S']
      },
      // ── la boucle ──
      A: {
        accords: ['Gm', 'Gm/F', 'Eb', 'Eb', 'Cm', 'Cm/Bb', 'D', 'D', 'Gm', 'Gm/F', 'Eb', 'Eb', 'Cm', 'Ab', 'D', 'D'],
        ouvre: { basse: [1000, 2400], nappe: [1500, 2600] },
        basse: fois(GALOP, 7).concat([GALOP_FIN]).concat(fois(GALOP, 7)).concat([GALOP_FIN]),
        tete: TETE,
        stab: STAB_A,
        arp: silences(8).concat(ARP5),
        nappe: [NAPPE, NAPPE, NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU],
        lead: LEAD_A,
        batt: [B_COURSE_X].concat(fois(B_COURSE, 6)).concat([B_COURSE_T, B_COURSE_X]).concat(fois(B_COURSE, 6)).concat([B_RELANCE])
      },
      B: {
        accords: ['Eb', 'Bb/D', 'Cm', 'Gm', 'Eb', 'Bb/D', 'Ab', 'D', 'Eb', 'Bb/D', 'Cm', 'Gm', 'Ab', 'Eb/G', 'D', 'D'],
        basse: fois(GALOP_8, 7).concat([GALOP_FIN]).concat(fois(GALOP_8, 7)).concat([GALOP_FIN]),
        arp: ARP5,
        stab: STAB_POINTE,
        tete: TETE_LIGNE,
        lead: LEAD_B,
        batt: [B_OFFRE_X].concat(fois(B_OFFRE, 6)).concat([B_SERRE_T, B_OFFRE_X]).concat(fois(B_OFFRE, 6)).concat([B_OFFRE_R])
      },
      C: {
        accords: ['Gm Eb', 'Cm D', 'Gm Eb', 'Cm D', 'Gm Gm/F', 'Eb D', 'Cm Ab', 'D'],
        ouvre: { nappe: [1800, 3200] },
        basse: GALOP_8,
        arp: ARP5,
        stab: STAB_MINUTE,
        tete: TETE,
        nappe: NAPPE2,
        lead: LEAD_C,
        batt: [B_MINUTE_X].concat(fois(B_MINUTE, 6)).concat([B_MINUTE_R])
      },
      // le creux : le papier descend l'escalier, traverse la rue et coule dans la Rive
      papier: {
        accords: ['Gm', 'Gm', 'Gm/F', 'Gm/F', 'Eb', 'Eb', 'Cm', 'Cm', 'Ab', 'Ab', 'Eb', 'Eb', 'Cm', 'Cm', 'D', 'D'],
        ouvre: { tete: [700, 2800], basse: [400, 2200] },
        ouh: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU],
        basse: [RACINE, TENU, RACINE, TENU, RACINE, TENU, RACINE, TENU, RACINE, TENU, RACINE, TENU, CROCHES, CROCHES, GALOP, GALOP_FIN],
        tete: TETE_LIGNE,
        fax: [SILENCE, HEURE_BIP[0], HEURE_BIP[1]].concat(silences(9)).concat([BIP, SILENCE, SILENCE, SILENCE]),
        batt: ['Tx . . . . . . . . . . . . . . .', SILENCE, SILENCE, SILENCE].concat(fois(B_TIC, 8)).concat([
          'k . . . k . . . k . . . k . . .', 'k . . . k . . . k . . . k . h .',
          'k . h . k . h . k . h . k . h .', B_RELANCE])
      },
      A2: {
        copie: 'A', harmo: true,
        basse: fois(GALOP_8, 7).concat([GALOP_FIN]).concat(fois(GALOP_8, 7)).concat([GALOP_FIN]),
        arp: ARP5,
        stab: 'X . . . . . X . . . . . . . . .',
        batt: [B_SERRE_X].concat(fois(B_SERRE, 6)).concat([B_SERRE_T, B_OFFRE_X]).concat(fois(B_OFFRE, 6)).concat([B_RELANCE])
      },
      // 23 h 57 : le sous-sol, la vieille ligne de la buanderie
      sous_sol: {
        accords: ['Cm', 'Cm', 'Ab', 'Ab', 'Cm', 'Cm', 'Ab', 'D', 'Eb', 'Eb', 'Cm', 'Cm', 'Ab', 'Ab', 'D', 'D'],
        ouvre: { arp: [700, 2400] },
        reese: [RACINE, TENU, RACINE, TENU, RACINE, TENU, RACINE, RACINE, RACINE, TENU, RACINE, TENU, RACINE, TENU, RACINE, TENU],
        basse: silences(14).concat([CROCHES, GALOP_FIN]),
        arp: ARP_BAS,
        stab: STAB_SOUS,
        tete: TIC,
        fax: silences(8).concat([BIP]).concat(silences(7)),
        batt: [B_SOUS_X, B_SOUS, B_SOUS_I, B_SOUS, B_SOUS, B_SOUS, B_SOUS_I, B_SOUS,
               B_SOUS_X, B_SOUS, B_SOUS_I, B_SOUS, B_SOUS, B_SOUS_I,
               'k . h . kS . h . k . h . kS . h h', B_RELANCE]
      },
      B2: {
        copie: 'B', harmo: true,
        ouvre: { nappe: [1400, 2600] },
        nappe: [NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, TENU],
        batt: [B_OFFRE_X].concat(fois(B_OFFRE, 6)).concat([B_SERRE_T, B_MINUTE_X]).concat(fois(B_MINUTE, 6)).concat([B_MINUTE_R])
      },
      // minuit moins une : la dernière minute, harmonisée…
      C2: {
        copie: 'C', harmo: true,
        ouvre: { nappe: [2000, 3000] },
        batt: [B_MINUTE_X].concat(fois(B_MINUTE, 6)).concat(['k h h h kS c h h k . T . T . T .'])
      },
      // … puis doublée par la grande scie, au sommet
      C3: {
        copie: 'C',
        ouvre: { nappe: [3000, 3600] },
        envol: LEAD_C,
        batt: [B_MINUTE_X].concat(fois(B_MINUTE, 6)).concat(['k h h h kS c h h k . h . kS . . .'])
      },
      // la retombée : la basse se referme, le fax rappelle, l'horloge reste seule
      minuit: {
        accords: ['Gm', 'Gm', 'Eb', 'Eb', 'Cm', 'Cm', 'D', 'D', 'Gm', 'Gm/F', 'Eb', 'Eb'],
        ouvre: { basse: [2200, 380], nappe: [1600, 900] },
        basse: CROCHES,
        tete: TETE,
        nappe: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU],
        fax: [BIP, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE, BIP, SILENCE, SILENCE, SILENCE],
        batt: ['kx . h . . . h . k . h . . . h .', 'k . h . . . h . k . h . . . h .', 'k . h . . . h . k . h . . . h .', 'k . h . . . h . k . h . . . h .',
               'k . . . . . . . k . . . . . . .', 'k . . . . . . . k . . . . . . .', 'k . . . . . . . . . . . . . . .', 'k . . . . . . . . . . . . . . .',
               'k . i . . . i . . . i . . . i .', 'k . i . . . i . . . i . . . i .', 'k . i . . . i . k . i . . . i .', 'k . i . k . i . k . i . k . i .']
      },
      relance: {
        accords: ['Cm', 'Ab', 'D', 'D'],
        ouvre: { basse: [400, 2200] },
        basse: [GALOP, GALOP, GALOP_8, GALOP_FIN],
        tete: TETE,
        lead: [SILENCE, SILENCE, SILENCE, HEURE_FIN],
        batt: ['k . h . kS . h . k . h . kS . h .', 'k . h . kS . h . k . h . kS . h h', 'k . h . kS . h . k . T . t . T .', B_RELANCE]
      }
    },
    ordre: ['intro', 'A', 'B', 'C', 'papier', 'A2', 'sous_sol', 'B2', 'C2', 'C3', 'minuit', 'relance'], boucle: 1
  });
})(typeof FusibleAudio === 'object' ? FusibleAudio : require('../audio.js'));
