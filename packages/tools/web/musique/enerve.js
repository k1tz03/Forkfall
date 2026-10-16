/* ---------------------------------------------------------------------------
 * FUSIBLE — la bande originale : « Court-circuit » (enerve), le mode éclair,
 * Le Fusible : dix minutes, quatre jauges qui tuent.
 *
 * Énervé. Une basse saturée en doubles croches qui cogne avec la grosse caisse
 * (quatre au sol) et saute : deux doubles croches manquent dans chaque mesure,
 * un mauvais contact ; le mi, le fa qui grince (phrygien), la quinte diminuée
 * quand ça chauffe. Ce qui n'appartient qu'à ce thème : les COUPURES — le courant saute,
 * tout le groupe se tait d'un coup pendant un temps (deux à la fin des
 * phrases), et repart sur la grosse caisse ; l'arc d'une basse acide qui
 * crépite ; un lead saturé dont le filtre s'ouvre jusqu'au cri. Au second
 * sommet, une seule fois, le cri reprend l'accroche de « Fusible » (do, si, mi,
 * sol dièse, en valeurs doublées, sur do puis mi majeur) : le fusible du titre
 * saute. Énervé sans épuiser : un creux toutes les cinquante-six mesures, une
 * section au demi-temps entre les deux sommets. Mi phrygien ; 140.
 *
 *   etincelle 4 m.  (une fois) la basse qui grésille et s'ouvre, l'arc, la
 *                   grosse caisse ; un temps de noir
 *   ── la boucle, 112 mesures, 3 min 12 ──
 *   A        16 m.  la tension : la basse, la grosse caisse, le charleston, les
 *                   claps ; l'arc à la cinquième ; une coupure au bout de la phrase
 *   B        16 m.  l'arc : la basse qui saute à l'octave et dévale, l'arc, les
 *                   stabs ; à la neuvième, le lead qui s'ouvre jusqu'au cri ;
 *                   deux coupures
 *   C1        8 m.  la surtension, premier sommet : la reese sous la basse, le
 *                   cri harmonisé, l'arc à l'octave, le charleston en doubles croches
 *   coupure   8 m.  le court-circuit, le creux : la basse qui bégaie, fermée,
 *                   les crépitements, l'arc seul ; la grosse caisse revient
 *   D        16 m.  le délestage : le demi-temps, la basse en croches, une grande
 *                   scie sombre, les stabs qui boitent ; à la neuvième, une
 *                   mélodie en valeurs longues
 *   A2       16 m.  la remise sous tension : la quinte diminuée dans la basse,
 *                   l'arc, le lead qui monte
 *   C2       16 m.  la surtension, second sommet : tout ; l'accroche du titre,
 *                   une fois ; une coupure au milieu
 *   panne     8 m.  la retombée : le filtre de la basse se ferme, la panne
 *   redemarrage 8 m. le groupe électrogène : la basse s'ouvre sous la grosse
 *                   caisse, le charleston, les claps ; la relance
 *
 * Toutes les sections du corps partent d'un premier temps franc (la grosse
 * caisse et la cymbale, la basse sur le temps) : le thème peut reprendre à
 * chacune. La grammaire : audio.js (« L'ÉCRITURE », « LES VOIX ») ; le guide du
 * compositeur : docs/design/bande_originale.md § 6.
 * ------------------------------------------------------------------------- */
(function (A) {
  'use strict';
  var SILENCE = A.SILENCE;
  var TENU = '- - - - - - - - - - - - - - - -';
  var NAPPE = 'X - - - - - - - - - - - - - - -';
  var RACINE = 'R - - - - - - - - - - - - - - -';
  function silences(n) { var l = []; for (var i = 0; i < n; i++) l.push(SILENCE); return l; }
  function fois(l, n) { var o = []; for (var i = 0; i < n; i++) o = o.concat(l); return o; }
  // la coupure : le dernier temps (ou les deux derniers) se tait, quelle que soit la voix
  function coupe(b, temps) {
    var c = b.split(/\s+/), n = 4 * (temps || 1);
    for (var i = 16 - n; i < 16; i++) c[i] = '.';
    return c.join(' ');
  }

  // LA BASSE : des doubles croches saturées, l'accent avec la grosse caisse ; deux doubles
  // croches manquent dans chaque mesure (après le deuxième temps, au milieu du troisième) :
  // un mauvais contact — le court-circuit en petit, à chaque mesure
  var RIFF_A = ['E2! E2 E3 E2 E2! . E2 E3 E2! E2 . E2 F2! F2 E3 E2',
                'E2! E2 E3 E2 E2! . E2 E3 E2! E2 . E2 G2! F2 E2 D2'];
  var RIFF_B = ['E3! E2 E2 E3 E3! . E2 E2 E3! E2 . E2 F3! E2 F2 E2',
                'E3! E2 E2 E3 C3! . C2 C2 B2! B2 . B2 A2! G2 F2 E2'];
  var RIFF_C = ['E2! E2 E3 E2 E2! . E2 E3 Bb2! Bb2 . E2 A2! A2 E3 E2',
                'E2! E2 E3 E2 E2! . E2 E3 Bb2! A2 . G2 F2! F2 E2 D2'];
  var RIFF_MI = 'E2! E2 E3 E2 E2! . E2 E3 E2! E2 . E2 E2! E2 E3 E2';     // le mi seul (sous l'accroche)
  var PANNE = 'E2! E2 E3 E2 E2! . E2 E3 E2! E2 . E2 E2 D2 C2 B1';          // le courant baisse
  var BEGAIE = ['E2 . . . . . . . . . . . . . . .', 'E2 . . E2 . . . E2 . E2 . . . . E2 E2',
                '. . E2 . . E2 . . E2 . . E2 . . . .', 'E2 E2 . . E2 . . E2 . E2 E2 . . . . .',
                'E2 . E2 . E2 . E2 . E2 . E2 . E2 . E2 .', 'E2 . E2 . E2 . E2 . E2 . E2 . E2 E3 E2 E3',
                'E2 E2 E3 E2 E2 E3 E2 E2 E3 E2 E2 E3 E2 E2 E3 E2', RIFF_A[1]];
  var BASSE_D = 'R . 8 . R . 8 . R . 8 . R . 8 .';

  // L'ARC : la basse acide qui crépite
  var ARC = ['E3 . E4! . E3 E3 . E4! . E3 F3! . E3 . E4 .',
             'E3 . E4! . E3 E3 . E4! . G3 F3! . E3 . D4 E4!'];
  var ARC_HAUT = ['E4! . E4 B4! . E4 F4! . E4 . B4! E4 . G4! F4 .',
                  'E4! . E4 B4! . E4 C5! . B4 . A4! G4 . F4! E4 .'];
  var ETINCELLES = ['E3! . . . . . . . . . . . E4! . . .', '. . . . . . E3! . . . . . . . . .',
                    '. . . E4! . . . . . . . . . . F3! .', '. . . . . . . . E3! . . E4! . . . .'];

  // LE LEAD : le cri (des glissés d'un demi-ton, le fa contre le mi)
  var CRI_B = [
    'E5 - - - - - - - - - - - ~F5 - - -', 'E5 - - - - - - - - - - - . . . .',
    'G5 - - - - - - - ~F5 - - - E5 - - -', 'D5 - - - - - - - - - - - . . . .',
    'E5 - - - - - - - - - - - ~G5 - - -', 'A5 - - - - - - - ~G5 - - - F5 - - -',
    'E5 - - - - - - - - - - - - - - -', '- - - - - - - - - - - - . . . .',
    'B4 - - - - - - - ~C5 - - - - - - -', 'B4 - - - - - - - G4 - - - A4 - - -',
    'B4 - - - - - - - ~C5 - - - D5 - - -', 'E5 - - - - - - - - - - - . . . .',
    'F5 - - - - - - - - - - - ~E5 - - -', 'D5 - - - - - - - C5 - - - B4 - - -',
    'C5 - - - - - - - - - - - ~B4 - - -', 'B4 - - - - - - - . . . . . . . .'
  ];
  var CRI_C = [
    'E5 - - - ~F5 - - - E5 - - - - - - -', 'G5 - - - ~A5 - - - G5 - - - F5 - - -',
    'E5 - - - - - - - ~F5 - - - - - - -', 'E5 - - - - - - - - - - - . . . .',
    'A5 - - - - - - - ~G5 - - - F5 - - -', 'E5 - - - - - - - D5 - - - C5 - - -',
    'D5 - - - - - - - ~E5 - - - F5 - - -', 'E5 - - - - - - - - - - - - - - -'
  ];
  // le second sommet : le cri qui monte par glissés, puis l'accroche du titre (do, si,
  // mi, sol dièse : 6 + 6 + 4 doubles croches, le sol dièse tenu sur mi majeur), une fois
  var CRI_C2 = CRI_C.slice(0, 7).concat([
    coupe('E5 - - - - - - - - - - - - - - -'),
    'E5 - - - ~F5 - - - ~G5 - - - ~A5 - - -', 'A5 - - - - - - - G5 - - - F5 - - -',
    'E5 - - - ~F5 - - - E5 - - - D5 - - -', 'E5 - - - - - - - - - - - . . . .',
    'C5 - - - - - B4 - - - - - E5 - - -', 'G#4 - - - - - - - - - - - - - - -',
    'F5 - - - - - - - E5 - - - - - - -', 'E5 - - - - - - - - - - - . . . .'
  ]);
  // le délestage : une mélodie en valeurs longues, sombre
  var LENT = [
    'B4 - - - - - - - - - - - - - - -', 'G4 - - - - - - - E4 - - - - - - -',
    'E5 - - - - - - - - - - - - - - -', 'D5 - - - - - - - C5 - - - G4 - - -',
    'A4 - - - - - - - - - - - - - - -', 'F4 - - - - - - - A4 - - - D5 - - -',
    'C5 - - - - - - - - - - - - - - -', 'C5 - - - - - - - - - - - . . . .',
    'B4 - - - - - - - - - - - - - - -', 'G4 - - - - - - - B4 - - - E5 - - -',
    'G5 - - - - - - - - - - - - - - -', 'E5 - - - - - - - C5 - - - - - - -',
    'C5 - - - - - - - - - - - B4 - - -', 'A4 - - - - - - - - - - - - - - -',
    'A4 - - - - - - - - - - - G4 - - -', 'E4 - - - - - - - - - - - . . . .'
  ];
  var MONTE = [
    SILENCE, SILENCE, SILENCE, SILENCE,
    'E5 - - - - - - - - - - - - - - -', 'F5 - - - - - - - E5 - - - D5 - - -',
    'C5 - - - - - - - - - - - - - - -', coupe('- - - - - - - - - - - - - - - -'),
    'G5 - - - - - - - ~F5 - - - E5 - - -', 'F5 - - - - - - - E5 - - - D5 - - -',
    'C5 - - - - - - - D5 - - - E5 - - -', 'F5 - - - - - - - - - - - . . . .',
    'G5 - - - - - - - ~A5 - - - G5 - - -', 'F5 - - - - - - - E5 - - - D5 - - -',
    'D5 - - - - - - - - - - - - - - -', 'C5 - - - - - - - . . . . . . . .'
  ];

  var STAB_A = '. . . . . . X . . . . . . . . .';
  var STAB_B = '. . . X . . X . . . . X . . X .';
  var STAB_D = '. . X . . . . . . . X . . X . .';                       // le délestage : trois coups qui boitent

  // LA BATTERIE : la grosse caisse cognée, quatre au sol ; les coupures
  var D_A = 'K . h . kSc . h . K . h . kSc . h .';
  var D_A_X = 'Kx . h . kSc . h . K . h . kSc . h .';
  var D_B = 'K . h h kSc . h . K . h h kSc . h h';
  var D_B_X = 'Kx . h h kSc . h . K . h h kSc . h h';
  var D_C = 'K h h h kSc h o h K h h h kSc h o h';
  var D_C_X = 'Kx h h h kSc h o h K h h h kSc h o h';
  var D_RELANCE = 'K . h . kSc . h . Kz . S . S S S S';
  var D_RELANCE_C = 'K h h h kSc h o h Kz S . S S S S S';
  var D_DEMI = 'K . . . . . h . S . . . . . h .';
  var D_DEMI_X = 'Kx . . . . . h . S . . . . . h .';
  var D_DEMI_K = 'K . . . . . h . S . . K . . h .';
  var D_DEMI_R = 'K . . . . . h . S . . K S . S S';

  A.theme('enerve', {
    titre: 'Court-circuit', moment: 'le mode éclair, Le Fusible', tonalite: 'mi phrygien',
    humeur: 'une basse saturée en doubles croches, la grosse caisse cognée, le cri filtré, les coupures',
    bpm: 140, gain: 1.32,
    pompe: { prof: 0.65, rel: 0.12 },
    echo: { pas: 2, retour: 0.25, coupe: 3500 },
    salle: { taille: 0.4, duree: 1.4, ton: 5500 },
    cassette: { sature: 1.6, coupe: 11000, bas: 50, souffle: 0.003, flotte: { prof: 2, vit: 0.8 } },
    voix: {
      lead:  { inst: 'lead', vol: 0.12, drive: 2.5, filtre: 3000, echo: 0.2, rev: 0.15, flotte: { prof: 3, vit: 0.8 }, pan: 0.05 },
      harmo: { inst: 'lead', vol: 0.06, drive: 2, filtre: 2600, echo: 0.1, rev: 0.15, pan: -0.3 },
      acide: { inst: 'acide', vol: 0.1, echo: 0.2, rev: 0.1, filtre: 3000, pan: -0.2 },
      stab:  { inst: 'stab', vol: 0.15, oct: 4, echo: 0.15, rev: 0.12, pompe: true, pan: 0.2, filtre: 5000 },
      nappe: { inst: 'supersaw', vol: 0.06, oct: 3, scies: 5, rev: 0.25, pompe: true, filtre: 2200, env: [0.2, 0.8, 0.85, 0.3] },
      reese: { inst: 'reese', vol: 0.06, oct: 2, plancher: 'E2', desaccord: 14, chaleur: 2, pompe: true },
      basse: { inst: 'basse', vol: 0.06, oct: 2, plancher: 'E2', pompe: true, drive: 2.6, filtre: 4500, ton: [4000, 2000, 0.04] },
      batt:  { vol: 0.27, drive: 1.8, porte: 0.6, tenue: 0.15, rev: 0.1, filtre: 13000 }
    },
    sections: {
      // ── l'introduction, jouée une fois ──
      etincelle: {
        accords: ['Em', 'Em', 'Em', 'F'],
        ouvre: { basse: [250, 2600] },
        basse: [RIFF_A[0], RIFF_A[1], RIFF_A[0], coupe(RIFF_A[1])],
        acide: [SILENCE, ETINCELLES[0], ETINCELLES[1], coupe(ETINCELLES[3])],
        batt: [SILENCE, '. . i . . i . . . i . . i . . .', 'K . . . K . . . K . . . K . . .', 'K . K . K . K . K K K K . . . .']
      },
      // ── la boucle ──
      A: {
        accords: ['Em', 'Em', 'Em', 'Em', 'Em', 'Em', 'F', 'F', 'Em', 'Em', 'Em', 'Em', 'Em', 'Em', 'G', 'F'],
        ouvre: { basse: [1200, 2600], acide: [900, 2600] },
        basse: [RIFF_A[0], RIFF_A[1], RIFF_A[0], RIFF_A[1], RIFF_A[0], RIFF_A[1], RIFF_A[0], coupe(RIFF_A[1]),
                RIFF_A[0], RIFF_A[1], RIFF_A[0], RIFF_A[1], RIFF_A[0], RIFF_A[1], RIFF_A[0], RIFF_A[1]],
        acide: silences(4).concat([ARC[0], ARC[1], ARC[0], coupe(ARC[1])], fois(ARC, 4)),
        stab: [STAB_A, STAB_A, STAB_A, STAB_A, STAB_A, STAB_A, STAB_A, SILENCE].concat(fois([STAB_A], 8)),
        batt: [D_A_X, D_A, D_A, D_A, D_A, D_A, D_A, coupe(D_A), D_A_X, D_A, D_A, D_A, D_A, D_A, D_A, D_RELANCE]
      },
      B: {
        accords: ['Em', 'C', 'Em', 'C', 'Em', 'C', 'Em', 'Em', 'Em', 'C', 'Em', 'C', 'F', 'Dm', 'C', 'Em'],
        ouvre: { lead: [900, 4500] },
        lead: silences(8).concat(CRI_B.slice(8)),
        basse: [RIFF_B[0], RIFF_B[1], RIFF_B[0], RIFF_B[1], RIFF_B[0], RIFF_B[1], RIFF_B[0], coupe(RIFF_B[1]),
                RIFF_B[0], RIFF_B[1], RIFF_B[0], RIFF_B[1], RIFF_B[0], RIFF_B[1], RIFF_B[0], coupe(RIFF_B[1], 2)],
        acide: fois(ARC, 3).concat(silences(10)),
        stab: [STAB_B, STAB_B, STAB_B, STAB_B, STAB_B, STAB_B, STAB_B, coupe(STAB_B),
               STAB_B, STAB_B, STAB_B, STAB_B, STAB_B, STAB_B, STAB_B, coupe(STAB_B, 2)],
        batt: [D_B_X, D_B, D_B, D_B, D_B, D_B, D_B, coupe(D_B), D_B_X, D_B, D_B, D_B, D_B, D_B, D_B, coupe(D_B, 2)]
      },
      C1: {
        accords: ['Em', 'F', 'Em', 'G', 'Em', 'F', 'Dm', 'Em'],
        harmo: true,
        lead: CRI_C,
        basse: RIFF_A,
        reese: RACINE,
        acide: ARC_HAUT,
        stab: STAB_B,
        batt: [D_C_X, D_C, D_C, D_C, D_C, D_C, D_C, D_RELANCE_C]
      },
      coupure: {
        accords: ['Em', 'Em', 'Em', 'Em', 'Em', 'Em', 'Em', 'Em'],
        ouvre: { basse: [300, 1500] },
        basse: BEGAIE,
        acide: ETINCELLES.concat(silences(4)),
        batt: ['Kx . . . . . . . . . . . . . . .', '. . i . . i . . . i . . i . . .', '. i . . i . . . i . . . . i . i',
               '. . i . . i . . . i . . i . i i', 'K . . . . . . . K . . . . . . .', 'K . . . . . . . K . . . K . . .',
               'K . . . K . . . K . . . K . . .', 'K . . . K . . . Kz . . . . . . .']
      },
      D: {
        accords: ['Em', 'Em', 'C', 'C', 'Dm', 'Dm', 'F', 'F', 'Em', 'Em', 'C', 'C', 'Am', 'Am', 'F', 'Em'],
        ouvre: { lead: [700, 1400] },
        lead: silences(8).concat(LENT.slice(8)),
        basse: BASSE_D,
        nappe: fois([NAPPE, TENU], 7).concat([NAPPE, NAPPE]),
        stab: STAB_D,
        batt: [D_DEMI_X, D_DEMI, D_DEMI, D_DEMI_K, D_DEMI, D_DEMI, D_DEMI, D_DEMI_R,
               D_DEMI_X, D_DEMI, D_DEMI, D_DEMI_K, D_DEMI, D_DEMI, D_DEMI_K, 'K . . . K . . . Kz . h . K . S S']
      },
      A2: {
        accords: ['Em', 'Em', 'Em', 'Em', 'Em', 'Em', 'F', 'F', 'Em', 'Em', 'Em', 'Em', 'Em', 'Em', 'G', 'F'],
        harmo: true,
        ouvre: { lead: [1000, 3600], acide: [800, 3000] },
        lead: MONTE,
        basse: [RIFF_C[0], RIFF_C[1], RIFF_C[0], RIFF_C[1], RIFF_C[0], RIFF_C[1], RIFF_C[0], coupe(RIFF_C[1]),
                RIFF_C[0], RIFF_C[1], RIFF_C[0], RIFF_C[1], RIFF_C[0], RIFF_C[1], RIFF_C[0], RIFF_C[1]],
        acide: fois(ARC, 3).concat([ARC[0], coupe(ARC[1])], fois(ARC, 4)),
        stab: [STAB_A, STAB_A, STAB_A, STAB_A, STAB_A, STAB_A, STAB_A, SILENCE, STAB_B, STAB_B, STAB_B, STAB_B, STAB_B, STAB_B, STAB_B, STAB_B],
        batt: [D_A_X, D_A, D_A, D_A, D_A, D_A, D_A, coupe(D_A), D_B_X, D_B, D_B, D_B, D_B, D_B, D_B, D_RELANCE]
      },
      C2: {
        accords: ['Em', 'F', 'Em', 'G', 'Em', 'F', 'Dm', 'Em', 'Em', 'F', 'Em', 'Em', 'C', 'E', 'F', 'Em'],
        harmo: true,
        lead: CRI_C2,
        basse: [RIFF_A[0], RIFF_A[1], RIFF_B[0], RIFF_B[1], RIFF_A[0], RIFF_A[1], RIFF_B[0], coupe(RIFF_B[1]),
                RIFF_A[0], RIFF_A[1], RIFF_B[0], RIFF_B[1], RIFF_MI, RIFF_MI, RIFF_A[0], RIFF_A[1]],
        reese: fois([RACINE], 7).concat([coupe(RACINE)], fois([RACINE], 8)),
        acide: fois(ARC_HAUT, 3).concat([ARC_HAUT[0], coupe(ARC_HAUT[1])], fois(ARC_HAUT, 4)),
        stab: [STAB_B, STAB_B, STAB_B, STAB_B, STAB_B, STAB_B, STAB_B, coupe(STAB_B),
               STAB_B, STAB_B, STAB_B, STAB_B, NAPPE, NAPPE, STAB_B, STAB_B],
        batt: [D_C_X, D_C, D_C, D_C, D_C, D_C, D_C, coupe(D_C), D_C_X, D_C, D_C, D_C, D_C_X, D_C, D_C, D_RELANCE_C]
      },
      panne: {
        accords: ['Em', 'Em', 'Em', 'Em', 'Em', 'Em', 'F', 'Em'],
        ouvre: { basse: [2600, 600] },
        basse: [RIFF_A[0], RIFF_A[1], RIFF_A[0], RIFF_A[1], RIFF_A[0], RIFF_A[1], RIFF_A[0], PANNE],
        acide: [ETINCELLES[0], ETINCELLES[1], ETINCELLES[2], ETINCELLES[3], SILENCE, SILENCE, SILENCE, SILENCE],
        batt: [D_A_X, D_A, D_A, D_A, 'K . . . K . . . K . . . K . . .', 'K . . . K . . . K . . . K . . .',
               'K . . . K . . . K . . . K . . .', 'K . . . kSc . . . K . . . . . . .']
      },
      redemarrage: {
        accords: ['Em', 'Em', 'Em', 'Em', 'Em', 'Em', 'F', 'F'],
        ouvre: { basse: [200, 2600] },
        basse: [RIFF_A[0], RIFF_A[1], RIFF_A[0], RIFF_A[1], RIFF_A[0], RIFF_A[1], RIFF_A[0], RIFF_A[1]],
        batt: ['Kx . . . K . . . K . . . K . . .', 'K . . . K . . . K . . . K . . .', 'K . . . K . . . K . . . K . . .',
               'K . . . K . . . K . . . K . . .', 'K . h . K . h . K . h . K . h .', 'K . h . K . h . K . h . K . h .',
               D_A, D_RELANCE]
      }
    },
    ordre: ['etincelle', 'A', 'B', 'C1', 'coupure', 'D', 'A2', 'C2', 'panne', 'redemarrage'], boucle: 1
  });
})(typeof FusibleAudio === 'object' ? FusibleAudio : require('../audio.js'));
