/* ---------------------------------------------------------------------------
 * FUSIBLE — la bande originale : « Fusible » (accueil), l'écran titre.
 *
 * La carte de visite du groupe, et le modèle des autres thèmes : une basse qui
 * court en octaves et respire avec la grosse caisse, un arpège qui rebondit
 * d'une oreille à l'autre, une grande scie qui flotte comme une cassette
 * fatiguée, la caisse claire « gated » dans sa salle qu'on ferme net — et une
 * accroche de quatre notes : do, si, mi, sol dièse (3 + 3 + 2, puis le sol
 * dièse qui reste en l'air sur l'accord de mi). La mineur ; 116.
 *
 * L'accroche est économe : la boîte à musique la présente dans l'introduction,
 * le lead la pose au bout de chaque phrase du couplet, le refrain la déforme
 * (do, si, mi, do : elle se résout enfin), le pont la ralentit à la boîte à
 * musique, l'envolée la monte d'une octave. Le reste du temps, l'ostinato.
 *
 *   amorce  4 m.  (une fois) la mèche : le tic, la nappe qui s'éclaire, la boîte
 *   mise    4 m.  (une fois) la basse s'ouvre, la batterie sort du coton
 *   ── la boucle, 88 mesures, 3 min 02 ──
 *   A      16 m.  la course : basse, arpège en croches, l'accroche en fin de phrase
 *   B       8 m.  le refrain : claps, stabs à contretemps, la mélodie en marches
 *   B2      8 m.  le refrain, harmonisé
 *   pont   16 m.  le creux : la reese, une voix « aah », l'arpège au loin, le tic,
 *                 l'accroche lente ; quatre mesures pour remonter
 *   A2     16 m.  la course, plus nerveuse (l'arpège à trois notes contre quatre temps)
 *   C       8 m.  l'envolée : la mélodie en valeurs longues, la majeure volée (do,
 *                 sol), l'accroche à l'octave
 *   C2      8 m.  l'envolée au sommet : la grande scie la double, l'harmonie dessous
 *   retour  8 m.  la retombée : la basse se referme, et la boîte relance la course
 *
 * La grammaire : audio.js (« L'ÉCRITURE », « LES VOIX ») ; le guide du
 * compositeur : docs/design/bande_originale.md § 6. (L'ancien thème de
 * l'accueil, La Mèche, vit dans Le Dernier Tour : musique/fin.js.)
 * ------------------------------------------------------------------------- */
(function (A) {
  'use strict';
  var SILENCE = A.SILENCE;
  var TENU = '- - - - - - - - - - - - - - - -';   // la note d'avant continue
  var NAPPE = 'X - - - - - - - - - - - - - - -';
  var NAPPE2 = 'X - - - - - - - X - - - - - - -';    // deux accords dans la mesure
  var RACINE = 'R - - - - - - - - - - - - - - -';

  // L'ACCROCHE : do, si, mi, sol dièse — sur « Am E »
  var ACCROCHE = 'C5 - - B4 - - E5 - G#4 - - - - - - .';
  var ACCROCHE_LANCE = 'C5 - - B4 - - E5 - G#4 - - - - - B4 -';   // elle appelle le refrain
  var ACCROCHE_HAUTE = 'C6 - - B5 - - E6 - G#5 - - - - - - .';
  var ACCROCHE_LENTE = ['C5 - - - - - B4 - - - - - E5 - - -', 'G#4 - - - - - - - - - - - - - - -'];

  // les ostinatos
  var BASSE_COURSE = 'R! 8 R 8 R 8 R 8 R! 8 R 8 R 8 R 8';
  var BASSE_COURSE2 = 'R! 8 R 8 R 8 5 8 R! 8 R 8 R 8 5 8';
  var BASSE_CROCHES = 'R . 8 . R . 8 . R . 8 . R . 8 .';
  var BASSE_NOIRES = 'R . . . R . . . R . . . R . . .';
  var ARP_CROCHES = '1 . 5 . 8 . 5 . 1 . 5 . 9 . 5 .';
  var ARP_TROIS = '1 5 8 1 5 8 1 5 8 1 5 8 1 5 8 9';      // trois notes contre quatre temps
  var STAB_CONTRE = '. . X . . . X . . . X . . . X .';
  var STAB_DEMI = '. . . . . . X . . . . . . . X .';        // l'envolée a déjà sa grande scie : deux stabs suffisent

  // la batterie
  var B_COURSE = 'k . h . kS . h . k . h . kS . h .';
  var B_COURSE_O = 'k . h . kS . h . k . h . kS . o .';
  var B_COURSE_X = 'kx . h . kS . h . k . h . kS . h .';
  var B_REFRAIN = 'k . h h kSc . o . k . h h kSc . o .';
  var B_REFRAIN_X = 'kx . h h kSc . o . k . h h kSc . o .';
  var B_RELANCE = 'k . h . kS . h . kz . T . t T S S';    // la montée (z) sur la seconde moitié, les toms
  var B_RELANCE_R = 'k . h h kSc . o . kz . T . t T S S';
  var B_ENVOLEE = 'k h h h kSc h o h k h h h kSc h o h';     // le charleston en doubles croches
  var B_ENVOLEE_X = 'kx h h h kSc h o h k h h h kSc h o h';
  var B_TIC = 'i . . . i . . . i . . . i . . .';

  // LE REFRAIN : la mélodie monte par marches sur le rythme de l'accroche,
  // puis l'accroche déformée (do, si, mi, do : elle se résout)
  var REFRAIN = [
    'A4 - - G4 - - C5 - A4 - - - - - . .',
    'B4 - - A4 - - D5 - B4 - - - - - . .',
    'C5 - - B4 - - E5 - C5 - - - - - - -',
    '. . . . . . . . E5 - D5 - C5 - B4 -',
    'A4 - - G4 - - C5 - A4 - - - - - . .',
    'B4 - - A4 - - D5 - B4 - - - G4 - - .',
    'G#4 - - F4 - - B4 - G#4 - - - - - - -',
    SILENCE
  ];
  // L'ENVOLÉE : des valeurs longues, la sixte volée au majeur, l'accroche à l'octave
  var ENVOLEE = [
    'E5 - - - - - - - D5 - - - C5 - - -',
    'C5 - - - - - - - A4 - - - - - - -',
    'G4 - - - C5 - - - E5 - - - G5 - - -',
    'F5 - - - - - - - E5 - - - D5 - - -',
    'E5 - - - - - - - - - - - A5 - - -',
    'A5 - - - G5 - - - F5 - - - E5 - - -',
    'F5 - - - - - - - E5 - - - D5 - - -',
    ACCROCHE_HAUTE
  ];
  function silences(n) { var l = []; for (var i = 0; i < n; i++) l.push(SILENCE); return l; }

  A.theme('accueil', {
    titre: 'Fusible', moment: "l'écran titre", tonalite: 'la mineur',
    humeur: 'la carte de visite : une basse qui court en octaves, une accroche de quatre notes, la cassette qui flotte',
    bpm: 116, gain: 1.2,
    pompe: { prof: 0.6, rel: 0.2 },
    echo: { pas: 3, retour: 0.38, coupe: 2600 },
    salle: { taille: 0.75, duree: 2.8, ton: 4200 },
    cassette: { sature: 1, coupe: 10500, bas: 40, souffle: 0.004, flotte: { prof: 3, vit: 0.33 } },
    voix: {
      lead:  { inst: 'lead', vol: 0.13, echo: 0.28, rev: 0.3, flotte: { prof: 6, vit: 0.6 }, pan: 0.05 },
      harmo: { inst: 'lead', vol: 0.05, echo: 0.15, rev: 0.3, flotte: { prof: 6, vit: 0.6 }, pan: -0.3 },
      envol: { inst: 'supersaw', vol: 0.08, rev: 0.35, flotte: { prof: 8, vit: 0.5 }, scies: 5, desaccord: 16, large: 0.85, filtre: 5200, env: [0.012, 0.5, 0.82, 0.2] },
      boite: { inst: 'cloche', vol: 0.09, faux: 16, echo: 0.45, rev: 0.4, pan: 0.2 },
      arp:   { inst: 'pluck2', vol: 0.085, oct: 4, echo: 0.42, rev: 0.12, pompe: true, pan: 0.3, filtre: 3600 },
      stab:  { inst: 'stab', vol: 0.085, oct: 4, echo: 0.22, rev: 0.25, pompe: true, pan: -0.2 },
      nappe: { inst: 'supersaw', vol: 0.09, oct: 3, rev: 0.35, pompe: true, flotte: { prof: 10, vit: 0.42 }, filtre: 3200, scies: 5, large: 0.8, env: [0.25, 0.8, 0.85, 0.4] },
      aah:   { inst: 'vox', vol: 0.085, oct: 3, voyelle: 'a', vers: 'o', rev: 0.5, flotte: { prof: 12, vit: 0.35 }, pompe: true },
      reese: { inst: 'reese', vol: 0.12, oct: 1, plancher: 'G1', desaccord: 10, pompe: true },
      basse: { inst: 'basse', vol: 0.08, oct: 1, plancher: 'E1', pompe: true, drive: 1.6, filtre: 2400, ton: [2000, 650, 0.07] },
      batt:  { vol: 0.7, porte: 0.5, tenue: 0.22, rev: 0.15, filtre: 15000 }
    },
    sections: {
      // ── l'introduction, jouée une fois ──
      amorce: {
        accords: ['Am', 'Am E', 'F', 'Dm E'],
        ouvre: { nappe: [900, 2600] },
        nappe: [NAPPE, NAPPE2, NAPPE, NAPPE2],
        aah: [NAPPE, TENU, NAPPE, TENU],
        boite: [SILENCE, ACCROCHE, SILENCE, SILENCE],
        batt: ['i . i . i . i . i . i . i . i .', 'i . i . i . i . i . i . i . i .',
               'i . i . i . i . i . i . i . i .', 'i . i . i . i . i . i . i . i i']
      },
      mise: {
        accords: ['Am', 'Am E', 'F', 'E'],
        ouvre: { basse: [180, 2400], batt: [1200, 15000] },
        nappe: [NAPPE, NAPPE2, NAPPE, NAPPE],
        boite: [SILENCE, ACCROCHE, SILENCE, SILENCE],
        basse: BASSE_COURSE,
        arp: [SILENCE, SILENCE, ARP_CROCHES, ARP_CROCHES],
        batt: ['k . i . k . i . k . i . k . i .', 'k . i . k . i . k . i . k . i .',
               'k . h . k . h . k . h . k . h .', 'k . h . k . h . kz . T . t T S S']
      },
      // ── la boucle ──
      A: {
        accords: ['Am', 'Am', 'F', 'F', 'Dm', 'Dm', 'E', 'Am E', 'Am', 'Am', 'F', 'F', 'Dm', 'Dm', 'E', 'Am E'],
        // le couplet se construit : la basse s'ouvre sur les seize mesures, la nappe reste sombre
        ouvre: { basse: [650, 2400], nappe: [1500, 2400] },
        basse: BASSE_COURSE,
        arp: ARP_CROCHES,
        nappe: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE2, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE2],
        lead: silences(7).concat([ACCROCHE]).concat(silences(7)).concat([ACCROCHE_LANCE]),
        batt: [B_COURSE_X, B_COURSE, B_COURSE, B_COURSE_O, B_COURSE, B_COURSE, B_COURSE, B_RELANCE.replace('kz', 'k'),
               B_COURSE_X, B_COURSE, B_COURSE, B_COURSE_O, B_COURSE, B_COURSE, B_COURSE, B_RELANCE]
      },
      B: {
        accords: ['F', 'G', 'Am', 'Am', 'F', 'G', 'E', 'E'],
        lead: REFRAIN,
        basse: BASSE_COURSE,
        arp: ARP_TROIS,
        stab: STAB_CONTRE,
        nappe: [NAPPE, NAPPE, NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU],
        batt: [B_REFRAIN_X, B_REFRAIN, B_REFRAIN, B_REFRAIN, B_REFRAIN, B_REFRAIN, B_REFRAIN, B_RELANCE_R]
      },
      B2: {
        copie: 'B', harmo: true,
        batt: [B_REFRAIN_X, B_REFRAIN, B_REFRAIN, B_REFRAIN, B_REFRAIN, B_REFRAIN, B_REFRAIN, 'k . h h kSc . o . k . h h kSc . . .']
      },
      pont: {
        accords: ['Dm', 'Dm', 'Bb', 'Bb', 'F', 'F', 'E', 'E', 'Dm', 'Dm', 'Bb', 'Bb', 'F', 'G', 'E', 'E'],
        ouvre: { arp: [900, 1800], basse: [250, 2400] },
        reese: [RACINE, TENU, RACINE, TENU, RACINE, TENU, RACINE, TENU, RACINE, TENU, RACINE, TENU, RACINE, RACINE, RACINE, TENU],
        aah: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU],
        arp: ARP_CROCHES,
        boite: silences(6).concat(ACCROCHE_LENTE).concat(silences(8)),
        basse: silences(12).concat([BASSE_NOIRES, BASSE_NOIRES, BASSE_CROCHES, BASSE_CROCHES]),
        batt: ['bx . i . . . i . . . i . . . i .', B_TIC, B_TIC, B_TIC, B_TIC, B_TIC, B_TIC, B_TIC,
               B_TIC, B_TIC, B_TIC, B_TIC,
               'k . i . . . i . k . i . . . i .', 'k . i . k . i . k . i . k . i .',
               'k . h . k . h . k . h . k . h h', 'k . s . k . s . kz . s s s s s s']
      },
      A2: {
        copie: 'A', harmo: true,
        basse: BASSE_COURSE2,
        arp: ARP_TROIS,
        stab: '. . . . . . X . . . . . . . . .',
        lead: silences(7).concat([ACCROCHE]).concat(silences(7)).concat([ACCROCHE])
      },
      // l'envolée en deux marches : la mélodie seule d'abord, puis la grande scie qui
      // la double et l'harmonie dessous (et le poids : la doublure ne sonne qu'au sommet)
      C: {
        accords: ['Am', 'F', 'C', 'G', 'Am', 'F', 'Dm', 'Am E'],
        ouvre: { nappe: [3200, 5200] },
        lead: ENVOLEE,
        basse: BASSE_COURSE,
        arp: ARP_CROCHES,
        stab: STAB_DEMI,
        nappe: [NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE2],
        batt: [B_ENVOLEE_X, B_ENVOLEE, B_ENVOLEE, B_ENVOLEE, B_ENVOLEE_X, B_ENVOLEE, B_ENVOLEE, B_RELANCE_R]
      },
      C2: {
        copie: 'C', harmo: true,
        envol: ENVOLEE,
        batt: [B_ENVOLEE_X, B_ENVOLEE, B_ENVOLEE, B_ENVOLEE, B_ENVOLEE_X, B_ENVOLEE, B_ENVOLEE, 'k . h h kSc . o . t . t . T . T .']
      },
      retour: {
        accords: ['Am', 'Am', 'F', 'F', 'Dm', 'Dm', 'E', 'E'],
        ouvre: { basse: [2400, 450], arp: [3600, 900] },
        basse: BASSE_CROCHES,
        arp: ARP_CROCHES,
        nappe: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU],
        boite: silences(7).concat([ACCROCHE]),
        batt: ['k . h . k . h . k . h . k . h .', 'k . h . k . h . k . h . k . h .', 'k . h . k . h . k . h . k . h .',
               'k . h . k . h . k . h . k . h .', 'k . h . k . h . k . h . k . h .', 'k . h . k . h . k . h . k . h .',
               B_COURSE, B_RELANCE]
      }
    },
    ordre: ['amorce', 'mise', 'A', 'B', 'B2', 'pont', 'A2', 'C', 'C2', 'retour'], boucle: 2
  });
})(typeof FusibleAudio === 'object' ? FusibleAudio : require('../audio.js'));
