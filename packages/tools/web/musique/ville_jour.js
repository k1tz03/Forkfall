/* ---------------------------------------------------------------------------
 * FUSIBLE — la bande originale : « Promenade » (ville_jour), la ville le jour,
 * un jour sur deux dans les dix livres (l'autre jour, le thème du livre).
 *
 * Le thème qu'on entend le plus : il doit s'user le moins. La marche
 * tranquille d'un été qui sent l'orage. Le seul thème qui chaloupe (`swing`) :
 * une basse carrée souple qui rebondit d'une octave à l'autre et descend en
 * marchant ; des accords étouffés à contretemps, comme une guitare qu'on
 * gratte du bout des doigts ; un pincé tout en haut qui scintille dans son
 * écho, le soleil sur une vitrine. Et au milieu de la boucle, l'orage : le
 * tonnerre au loin, le vent, les gouttes — le do majeur du dorien (le
 * soleil, son mi bécarre) devient do mineur. Sol dorien ; 98.
 *
 * L'accroche (ré, mi-sol-mi, ré) ferme les phrases de la marche, passe en
 * mineur sous l'orage (le mi devient mi bémol) ; l'air du soleil a son propre
 * rythme (un temps de silence, puis la phrase). La moitié du temps, la
 * démarche seule. Les accords qui reviennent toujours : la cadence qui trompe
 * (ré 7 qui file vers si bémol) ouvre chaque air.
 *
 *   sortie     4 m.  (une fois) le scintillement seul, les pas, la basse qui s'ouvre
 *   ── la boucle, 104 mesures, 4 min 15 ──
 *   A         16 m.  la marche : la basse chaloupée, les contretemps étouffés, le
 *                    scintillement ; l'accroche au bout des deux phrases
 *   B         16 m.  le soleil : l'air, la caisse claire douce, une nappe
 *   A2        16 m.  la marche plus loin : la basse plus bavarde, le scintillement
 *                    à trois contre quatre, l'accroche harmonisée
 *   orage     16 m.  le creux : le tonnerre, les gouttes, le vent ; la reese qui
 *                    gronde, une voix « ou » ; l'accroche en mineur ; la marche
 *                    qui revient sur les quatre dernières mesures
 *   eclaircie 16 m.  la rue mouillée qui brille : sol en pédale sous les accords
 *                    qui passent, le scintillement qui ruisselle et s'ouvre, une
 *                    voix lente ; pas d'air
 *   B2        16 m.  le soleil au plus haut : l'air harmonisé, la grande scie, la
 *                    caisse « gated »
 *   retour     8 m.  la basse se referme, les pas, et la relance
 *
 * La grammaire : audio.js (« L'ÉCRITURE », « LES VOIX ») ; le guide du
 * compositeur : docs/design/bande_originale.md § 6.
 * ------------------------------------------------------------------------- */
(function (A) {
  'use strict';
  var SILENCE = A.SILENCE;
  var TENU = '- - - - - - - - - - - - - - - -';
  var NAPPE = 'X - - - - - - - - - - - - - - -';
  var NAPPE2 = 'X - - - - - - - X - - - - - - -';   // deux accords dans la mesure
  var RACINE = 'R - - - - - - - - - - - - - - -';
  function silences(n) { var l = []; for (var i = 0; i < n; i++) l.push(SILENCE); return l; }
  function fois(n, l) { var r = []; for (var i = 0; i < n; i++) r = r.concat(l); return r; }

  // ── LA DÉMARCHE : la basse carrée, sur deux mesures ──
  // le pas, l'octave qui rebondit, l'anticipation ; puis la descente qui marche
  var MARCHE = ['R - - . . . R . 8 . . R . . 5 .', 'R - - . . . R . 8 . 7 . 5 . 3 .'];
  // plus bavarde : la note répétée, la glissade qui remonte vers la mesure suivante
  var MARCHE2 = ['R - . R . . 8 . . R . R . . 5 ~7', 'R - - . 8 . . R . . 7 . 5 . 3 .'];
  // le soleil : plus liée, la quinte sur le deuxième temps
  var SOLEIL = ['R - - . 5 . R . 8 - . 7 . 5 . .', 'R - - . 5 . R . 8 - . 5 . 3 . 5'];
  // l'éclaircie : sol en pédale, quelles que soient les harmonies au-dessus
  var PEDALE = ['G2 - - . . . G2 . G3 . . G2 . . D3 .', 'G2 - - . . . G2 . G3 . . D3 . . G2 .'];

  // ── le scintillement (le pincé, tout en haut, dans l'écho) ──
  var SCINT = ['8 . . . 9 . . 5 . . . . 8 . . .', '. . 5 . . . 9 . . . 8 . . . 5 .'];
  var SCINT_TROIS = '8 . . 5 . . 9 . . 8 . . 5 . . 9';        // trois contre quatre
  var SCINT_RUISSELLE = ['9 . 8 . 5 . . . 3 . . . . . . .', '. . . . . . 9 . 8 . 5 . . . 3 .'];
  var SCINT_GOUTTES = ['8 . . . . . . . . . 5 . . . . .', '. . . . 9 . . . . . . . . . . .'];

  // ── les accords étouffés, à contretemps ──
  var CHOP = ['. . . . . . X . . . . . . . X .', '. . X . . . X . . . . . . X . .'];
  var CHOP_SOLEIL = '. . X . . . . . . . X . . . . .';

  // ── L'ACCROCHE : ré, mi-sol-mi, ré ; puis la réponse qui se pose ──
  var ACCROCHE = 'D5 - - E5 G5 - E5 - D5 - - - . . . .';
  var POSE = '. . C5 - D5 - Bb4 - - - A4 - - - - -';           // sur si bémol : le la, la septième
  var POSE_RE = '. . C5 - D5 - A4 - - - F#4 - - - . .';         // sur « Am7 D7 » : le fa dièse appelle la suite
  var ACCROCHE_MINEURE = 'D5 - - Eb5 G5 - Eb5 - D5 - - - . . . .';   // sous l'orage

  // ── L'AIR DU SOLEIL : un temps de silence, puis la phrase ──
  var AIR = [
    '. . . . D5 - F5 - - - A5 - - - G5 -',
    'E5 - - - - - - - . . D5 - E5 - G5 -',
    'A5 - - - G5 - E5 - - - - - . . . .',
    SILENCE,
    '. . . . D5 - F5 - - - A5 - - - Bb5 -',
    'G5 - - - - - E5 - - - - - D5 - E5 -',
    'D5 - - - - - - - - - - - . . . .',
    SILENCE,
    '. . . . Bb4 - D5 - - - G5 - - - F5 -',
    'E5 - - - - - - - . . C5 - D5 - E5 -',
    'F5 - - - E5 - D5 - - - - - . . . .',
    '. . . . . . . . . . . . Bb4 - C5 -',
    'D5 - - - - - Bb4 - - - G4 - - - Bb4 -',
    'C5 - - - - - - - . . A4 - C5 - E5 -',
    'D5 - - - - - - - - - - - . . . .',
    SILENCE
  ];

  // ── les voix lentes : le vent sous l'orage, puis la voix de l'éclaircie ──
  var VENT = [
    'G4 - - - - - - - Bb4 - - - - - - -', 'G4 - - - - - - - - - - - . . . .', SILENCE, SILENCE,
    'Bb4 - - - - - - - D5 - - - - - - -', 'Bb4 - - - - - - - - - - - . . . .',
    'A4 - - - - - - - - - - - - - - -', 'F#4 - - - - - - - - - - - . . . .',
    'G4 - - - - - - - Bb4 - - - - - - -', 'G4 - - - - - - - - - - - . . . .', SILENCE, SILENCE,
    SILENCE, SILENCE, SILENCE, SILENCE
  ];
  var FREDON = [
    'D5 - - - - - - - - - - - - - - -', TENU,
    'C5 - - - - - - - - - - - E5 - - -', TENU,
    'D5 - - - - - - - - - - - Bb4 - - -', TENU,
    'C5 - - - - - - - - - - - . . . .', SILENCE,
    'Bb4 - - - - - - - D5 - - - - - - -', TENU,
    'E5 - - - - - - - - - - - C5 - - -', TENU,
    'Bb4 - - - - - - - - - - - - - - -', 'A4 - - - - - - - - - - - - - - -',
    'C5 - - - - - - - E5 - - - - - - -', SILENCE
  ];

  // ── la batterie : la démarche (la grosse caisse, le cerclage, le charleston) ──
  var D_PAS = 'k . h . r . h k . . . . r . h .';
  var D_PAS_X = 'kx . h . r . h k . . . . r . h .';
  var D_PAS_O = 'k . h . r . h k . . . . r . o .';
  var D_PAS_FIN = 'k . h . r . h k z . t . t T r r';            // la relance : la montée, les toms
  var D_PAS_FIN_DOUX = 'k . h . r . h k . . k . r . r r';
  var D_SOLEIL = 'k . h . s . h k . . k . s . h h';
  var D_SOLEIL_X = 'kx . h . s . h k . . k . s . h h';
  var D_SOLEIL_O = 'k . h . s . h k . . k . s . o .';
  var D_SOLEIL_FIN = 'k . h . s . h k z . k . s t s s';
  var D_HAUT = 'k . h . S . h k . . k . S . h h';               // le soleil au plus haut : la caisse « gated »
  var D_HAUT_X = 'kx . h . S . h k . . k . S . h h';
  var D_HAUT_O = 'k . h . S . h k . . k . S . o .';
  var D_HAUT_FIN = 'k . h . S . h k z . t . t T S S';
  var D_PLUIE = 'i . . i . . i . . . i . . i . .';               // les gouttes, irrégulières
  var D_PLUIE2 = '. . i . . i . . i . . . i . i .';
  var D_VENT = '. . i . . i . . z . . . i . . .';                // une rafale

  function marche(fin) {
    return [D_PAS_X, D_PAS, D_PAS, D_PAS_O, D_PAS, D_PAS, D_PAS, D_PAS_FIN_DOUX,
            D_PAS_X, D_PAS, D_PAS, D_PAS_O, D_PAS, D_PAS, D_PAS, fin];
  }
  function soleil(x, n, o, fin) {
    return [x, n, n, o, n, n, n, o, x, n, n, o, n, n, n, fin];
  }

  A.theme('ville_jour', {
    titre: 'Promenade', moment: 'la ville le jour (un jour sur deux)', tonalite: 'sol dorien',
    humeur: "la marche tranquille d'un été qui sent l'orage : une basse carrée qui chaloupe, un scintillement",
    ville: true,
    bpm: 98, swing: 0.13, gain: 1.7,
    pompe: { prof: 0.35, rel: 0.25 },
    echo: { pas: 3, retour: 0.4, coupe: 2400 },
    salle: { taille: 0.65, duree: 2.4, ton: 4000 },
    cassette: { sature: 0.9, coupe: 10500, bas: 50, souffle: 0.004, flotte: { prof: 3, vit: 0.3 } },
    voix: {
      lead:   { inst: 'lead', vol: 0.12, ton: [2600, 1500, 0.25], echo: 0.22, rev: 0.28, flotte: { prof: 7, vit: 0.5 }, pan: 0.06 },
      harmo:  { inst: 'lead', vol: 0.05, ton: [2200, 1300, 0.25], echo: 0.12, rev: 0.3, pan: -0.28 },
      scint:  { inst: 'pluck2', vol: 0.08, oct: 5, echo: 0.5, rev: 0.18, pan: 0.32, filtre: 4200, ton: [5000, 800, 0.05] },
      chop:   { inst: 'stab', vol: 0.07, oct: 4, ton: [3200, 700, 0.06], env: [0.002, 0.3, 0.3, 0.15], echo: 0.12, rev: 0.15, pan: -0.22, pompe: true },
      nappe:  { inst: 'nappe', vol: 0.075, oct: 3, rev: 0.35, pompe: true, flotte: { prof: 9, vit: 0.4 }, filtre: 2400 },
      brume:  { inst: 'supersaw', vol: 0.085, oct: 4, scies: 5, desaccord: 14, large: 0.8, rev: 0.38, pompe: true,
                flotte: { prof: 9, vit: 0.45 }, filtre: 3400, env: [0.3, 0.8, 0.85, 0.25] },
      fredon: { inst: 'vox', vol: 0.065, voyelle: 'ou', vers: 'o', rev: 0.5, echo: 0.15, pan: 0.1 },
      gronde: { inst: 'reese', vol: 0.065, oct: 2, desaccord: 11, chaleur: 1.4, ton: [1100, 450, 0.5] },
      basse:  { inst: 'sqbasse', vol: 0.09, oct: 2, pompe: true, drive: 1.1, filtre: 2400, ton: [3000, 1100, 0.08] },
      batt:   { vol: 0.55, porte: 0.35, tenue: 0.2, rev: 0.18, filtre: 11000 }
    },
    sections: {
      // ── l'introduction, jouée une fois : on sort ──
      sortie: {
        accords: ['Gm7', 'Gm7', 'C7', 'Dsus4'],
        ouvre: { nappe: [700, 2400], basse: [350, 1900] },
        scint: SCINT,
        nappe: [NAPPE, TENU, NAPPE, NAPPE],
        basse: [SILENCE, MARCHE[0], MARCHE[0], MARCHE[1]],
        batt: ['. . . . r . . . . . . . r . . .', 'k . . . r . . k . . . . r . . .', D_PAS, D_PAS_FIN]
      },
      // ── la boucle ──
      A: {
        accords: ['Gm7', 'Gm7', 'C7', 'C7', 'Gm7', 'Gm7', 'Am7', 'Bbmaj7',
                  'Gm7', 'Gm7', 'C7', 'C7', 'Ebmaj7', 'Fmaj7', 'Gm7', 'Am7 D7'],
        basse: MARCHE,
        chop: CHOP,
        scint: SCINT,
        ouvre: { nappe: [700, 2400] },
        nappe: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE, NAPPE, NAPPE2],
        lead: silences(6).concat([ACCROCHE, POSE]).concat(silences(6)).concat([ACCROCHE, POSE_RE]),
        batt: marche(D_PAS_FIN)
      },
      B: {
        accords: ['Bbmaj7', 'C', 'Am7', 'Dm7', 'Bbmaj7', 'C', 'Gm7', 'Gm7',
                  'Ebmaj7', 'Fmaj7', 'Dm7', 'Gm7', 'Ebmaj7', 'Fmaj7', 'Gm7', 'Am7 D7'],
        basse: SOLEIL,
        chop: CHOP_SOLEIL,
        scint: SCINT,
        nappe: [NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, TENU, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE2],
        lead: AIR,
        batt: soleil(D_SOLEIL_X, D_SOLEIL, D_SOLEIL_O, D_SOLEIL_FIN)
      },
      A2: {
        copie: 'A', harmo: true,
        basse: MARCHE2,
        nappe: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE, NAPPE, NAPPE2],
        scint: SCINT_TROIS,
        batt: marche('k . h . r . h k z . k . r t r r')
      },
      // le creux : l'orage passe (le soleil du dorien, do majeur, devient do mineur)
      orage: {
        accords: ['Ebmaj7', 'Ebmaj7', 'Cm7', 'Cm7', 'Ebmaj7', 'Ebmaj7', 'D', 'D',
                  'Ebmaj7', 'Ebmaj7', 'Cm7', 'Cm7', 'Gm7', 'Gm7', 'C7', 'D7'],
        ouvre: { scint: [800, 1700], basse: [300, 1900] },
        gronde: [RACINE, TENU, RACINE, TENU, RACINE, TENU, RACINE, TENU, RACINE, TENU, RACINE, TENU,
                 SILENCE, SILENCE, SILENCE, SILENCE],
        nappe: silences(12).concat([NAPPE, TENU, NAPPE, NAPPE]),
        fredon: VENT,
        scint: SCINT_GOUTTES,
        lead: [SILENCE, SILENCE, ACCROCHE_MINEURE, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE,
               SILENCE, SILENCE, ACCROCHE_MINEURE, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE],
        basse: silences(12).concat(MARCHE).concat(MARCHE),
        batt: ['bx . . . . . . . . . i . . i . .', D_PLUIE, D_PLUIE2, D_VENT,
               'i . . . . . i . . . i . . . . .', D_PLUIE, D_PLUIE2, D_VENT,
               'T . . . . . i . . . i . . . . .', D_PLUIE, D_PLUIE2, '. . i . . i . . z . . . i . i i',
               'kx . . . r . . k . . . . r . . .', D_PAS, D_PAS_O, D_PAS_FIN]
      },
      // la rue mouillée qui brille : sol en pédale, le scintillement s'ouvre
      eclaircie: {
        accords: ['Gm7', 'Gm7', 'Fmaj7/G', 'Fmaj7/G', 'Ebmaj7/G', 'Ebmaj7/G', 'C/G', 'C/G',
                  'Gm7', 'Gm7', 'Fmaj7/G', 'Fmaj7/G', 'Ebmaj7', 'Fmaj7', 'Am7', 'D7'],
        ouvre: { scint: [1800, 5200] },
        basse: fois(6, PEDALE).concat(MARCHE2),
        scint: SCINT_RUISSELLE,
        chop: CHOP,
        nappe: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE, NAPPE, NAPPE],
        fredon: FREDON,
        batt: marche(D_SOLEIL_FIN)
      },
      B2: {
        copie: 'B', harmo: true,
        scint: SCINT_TROIS,
        nappe: null,
        brume: [NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, TENU, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE2],
        batt: soleil(D_HAUT_X, D_HAUT, D_HAUT_O, D_HAUT_FIN)
      },
      retour: {
        accords: ['Gm7', 'Gm7', 'C7', 'C7', 'Gm7', 'Gm7', 'Am7', 'Dsus4'],
        ouvre: { basse: [1900, 450] },
        basse: MARCHE,
        scint: SCINT,
        batt: [D_PAS_X, D_PAS, D_PAS, D_PAS_O, D_PAS, D_PAS, D_PAS, D_PAS_FIN]
      }
    },
    ordre: ['sortie', 'A', 'B', 'A2', 'orage', 'eclaircie', 'B2', 'retour'], boucle: 1
  });
})(typeof FusibleAudio === 'object' ? FusibleAudio : require('../audio.js'));
