/* ---------------------------------------------------------------------------
 * FUSIBLE — la bande originale : « Trois mille masques » (livre_h1), la ville
 * le jour dans le livre 1, « Trois mille visages », et son introduction.
 *
 * La tribune qui t'aime trop. Le virage a appris ton nom avant de te voir : un
 * chœur de synthèse le scande sans paroles — ré, ré, ré, la ; si bémol, do,
 * ré : il monte vers toi —, les mains du virage répondent dans les silences,
 * le grand tambour bat sur ses syllabes, et la basse marche au pas pointé des
 * cortèges. Fier, et inquiétant : derrière le chœur, un second chœur chante la
 * même chose un temps trop tard, plus pâle, plus faux (trois mille visages qui
 * ont le tien, et ta voix). La nuit, le chant garde son rythme et change de
 * chute : la quinte diminuée (la bémol) remplace la quarte, le mi bémol
 * napolitain tourne autour du ré. Ré mineur ; 120.
 *
 * Ce qui n'est qu'à lui dans la bande : des voix au centre (le chœur, l'écho
 * des masques, la tribune qui murmure), un pas de marche au lieu des quatre
 * temps, le grand tambour et les mains du virage au lieu du charleston, une
 * salle de stade (un écho lent, la tribune d'en face).
 *
 *   intro    4 m.  (une fois) le grillage : la main de Gégé bat la mesure, le
 *                  chant au loin, la tribune s'éclaire, la basse s'avance
 *   ── la boucle, 128 mesures, 4 min 16 ──
 *   A       16 m.  la marche : basse pointée, grosse caisse aux temps forts,
 *                  les mains au contretemps ; le chant, au loin, en fin de phrase
 *   B       16 m.  le chant : l'appel et la réponse, deux fois, puis sur sol et
 *                  sur le mi bémol ; le tambour sur les syllabes, la caisse
 *                  « gated », les mains
 *   pont    16 m.  le creux, le local : la reese tenue, la tribune lointaine,
 *                  le chant des masques seul au fond ; quatre mesures pour
 *                  remonter
 *   A2      16 m.  la marche, et ta voix au-dessus : le lead en valeurs
 *                  longues, fier
 *   N       16 m.  les nuits : ré et mi bémol, la reese qui boite, le chant à
 *                  la quinte diminuée et son ombre en canon, les toms
 *   creux    8 m.  l'homme sous la fenêtre : la basse à la noire, le tic, la
 *                  tribune qui retient son souffle
 *   B2      16 m.  le sommet : le chant doublé par le lead et harmonisé, la
 *                  grande scie tient ses notes
 *   B3       8 m.  tout le stade : quatre mesures a cappella (le chœur, le
 *                  tambour, les mains), puis tout le monde, la cymbale
 *   retour  16 m.  la retombée : ta voix seule, douce, sur la tribune ; puis
 *                  la marche qui revient et relance
 *
 * La courbe : A 5 → B 7 → pont 2 (remonte à 5) → A2 6 → N 7 → creux 2 → B2 8 →
 * B3 9 → retour 3 → 5. Le chant (et ses ombres) tient la moitié de la boucle ;
 * l'autre moitié, la marche seule ou ta voix.
 *
 * La grammaire : audio.js (« L'ÉCRITURE », « LES VOIX ») ; le guide du
 * compositeur : docs/design/bande_originale.md § 6.
 * ------------------------------------------------------------------------- */
(function (A) {
  'use strict';
  var SILENCE = A.SILENCE;
  var TENU = '- - - - - - - - - - - - - - - -';
  var NAPPE = 'X - - - - - - - - - - - - - - -';
  var NAPPE2 = 'X - - - - - - - X - - - - - - -';
  var RACINE = 'R - - - - - - - - - - - - - - -';

  function rep(b, n) { var l = []; for (var i = 0; i < n; i++) l.push(b); return l; }
  function silences(n) { return rep(SILENCE, n); }
  // décaler des notes écrites de d demi-tons (la doublure à l'octave)
  var NOMS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
  var PCS = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function decale(barre, d) {
    return barre.trim().split(/\s+/).map(function (c) {
      var m = /^(~?)([A-G])(#|b)?(\d)(!?)$/.exec(c);
      if (!m) return c;
      var x = 12 * (+m[4] + 1) + PCS[m[2]] + (m[3] === '#' ? 1 : m[3] === 'b' ? -1 : 0) + d;
      return m[1] + NOMS[x % 12] + (Math.floor(x / 12) - 1) + m[5];
    }).join(' ');
  }
  function octave(l, d) { return l.map(function (b) { return decale(b, d); }); }
  // le canon des masques : la même ligne, n doubles croches plus tard (la fin
  // de la liste revient au début : la liste tourne, le canon aussi)
  function retarde(l, n) {
    var c = l.join(' ').trim().split(/\s+/), N = c.length, o = [], r = [];
    for (var i = 0; i < N; i++) o.push(c[(i - n + N) % N]);
    for (var j = 0; j < N; j += 16) r.push(o.slice(j, j + 16).join(' '));
    return r;
  }

  // ── LE CHANT : l'appel (ré ré ré la ; si bémol do ré) et la réponse (fa fa
  //    fa mi ré ; do dièse, qui reste en l'air)
  var APPEL1 = 'D5 . D5 . D5 - - - A4 - - - . . . .';
  var APPEL2 = 'Bb4 - - - C5 - - - D5 - - - - - . .';
  var REPONSE1 = 'F5 . F5 . F5 - - - E5 - - - D5 - - -';
  var REPONSE2 = 'C#5 - - - - - - - - - - - . . . .';
  var REPONSE2B = 'E5 - - - C#5 - - - D5 - - - - - . .';   // sur « A Dm » : elle se pose
  var CHANT_B = [
    APPEL1, APPEL2, REPONSE1, REPONSE2,
    APPEL1, APPEL2, REPONSE1, REPONSE2B,
    'G5 . G5 . G5 - - - D5 - - - . . . .', 'F5 - - - E5 - - - D5 - - - - - . .',
    'Bb4 - - - C5 - - - D5 - - - F5 - - -', 'D5 - - - - - - - - - - - . . . .',
    'G5 . G5 . G5 - - - D5 - - - . . . .', REPONSE1,
    'Eb5 - - - - - - - D5 - - - C5 - - -', REPONSE2
  ];
  // la nuit : la quinte diminuée au lieu de la quarte, le napolitain
  var CHANT_NUIT = [
    'D5 . D5 . D5 - - - Ab4 - - - . . . .', 'G4 - - - Ab4 - - - Bb4 - - - - - . .',
    REPONSE1, 'Eb5 - - - - - - - D5 - - - - - . .',
    'D5 . D5 . D5 - - - Ab4 - - - . . . .', 'G4 - - - Ab4 - - - Bb4 - - - - - . .',
    'F5 . F5 . F5 - - - Db5 - - - C5 - - -', REPONSE2,
    SILENCE, SILENCE, SILENCE, SILENCE,
    'G5 . G5 . G5 - - - Db5 - - - . . . .', 'C5 - - - Db5 - - - Eb5 - - - - - . .',
    'E5 . E5 . E5 - - - C#5 - - - . . . .', 'D5 - - - - - - - C#5 - - - . . . .'
  ];
  // la grande scie du sommet : les notes du chant, tenues
  var ENVOL_B = [
    'D5 - - - - - - - A4 - - - - - - -', 'Bb4 - - - - - - - C5 - - - - - - -',
    'F5 - - - - - - - E5 - - - D5 - - -', 'C#5 - - - - - - - - - - - - - - .',
    'D5 - - - - - - - A4 - - - - - - -', 'Bb4 - - - - - - - C5 - - - - - - -',
    'F5 - - - - - - - E5 - - - D5 - - -', 'E5 - - - C#5 - - - D5 - - - - - - .',
    'G5 - - - - - - - D5 - - - - - - -', 'F5 - - - - - - - - - - - - - - -',
    'D5 - - - - - - - E5 - - - - - - -', 'F5 - - - - - - - - - - - - - - .',
    'G5 - - - - - - - D5 - - - - - - -', 'F5 - - - - - - - - - - - D5 - - -',
    'Eb5 - - - - - - - G5 - - - - - - -', 'E5 - - - - - - - C#5 - - - - - - .'
  ];

  // ── TA VOIX : la ligne fière, en valeurs longues (sur la grille de A)
  var FIER = [
    'A4 - - - - - - - - - - - D5 - - -', 'F5 - - - - - - - E5 - - - D5 - - -',
    'D5 - - - - - - - - - - - - - - -', 'C5 - - - Bb4 - - - A4 - - - - - - -',
    'G4 - - - - - - - C5 - - - - - - -', 'E5 - - - - - - - D5 - - - C5 - - -',
    'D5 - - - - - - - - - - - - - - -', '- - - - - - - - . . . . . . . .',
    'A4 - - - - - - - - - - - D5 - - -', 'F5 - - - - - - - G5 - - - A5 - - -',
    'Bb5 - - - - - - - - - - - A5 - - -', 'G5 - - - - - - - F5 - - - - - - -',
    'G5 - - - - - - - D5 - - - - - - -', 'Bb4 - - - - - - - C5 - - - D5 - - -',
    'C#5 - - - - - - - - - - - E5 - - -', 'A4 - - - - - - - - - - - . . . .'
  ];
  // la même, seule et douce, à la retombée (sur la grille du retour)
  var FIER_SEUL = [
    'A4 - - - - - - - - - - - D5 - - -', 'F5 - - - - - - - E5 - - - - - - -',
    'D5 - - - - - - - - - - - - - - -', '- - - - - - - - . . . . . . . .',
    'Bb4 - - - - - - - - - - - D5 - - -', 'C#5 - - - - - - - - - - - - - - -',
    '- - - - . . . . . . . . . . . .', SILENCE
  ];

  // ── LA MARCHE : la basse au pas pointé, la racine puis la quinte au
  //    troisième temps (le tuba des cortèges)
  var MARCHE = 'R! - - R R - - R 5! - - 5 R - - R';
  var MARCHE_8 = 'R! - - 8 R - - 8 5! - - 8 R - - 8';         // au chant : la levée à l'octave
  var MARCHE_TOUR = 'R! - - R R - - R 5! - - 5 R - 8 -';
  var MARCHE_MONTE = 'R! - - R R - - R 5! - - 3 5 - 8 -';
  var NOIRES = 'R . . . R . . . R . . . R . . .';
  var REESE_BOITE = 'R - - - - - R - R - - - - - R -';          // la marche ralentie, qui boite

  // ── la batterie : grosse caisse aux temps forts, les mains et le tambour au contretemps
  var M_X = 'Kx . . . c . . . k . . . Tc . . .';
  var M = 'K . . . c . . . k . . . Tc . . .';
  var M_T = 'K . . . c . . . k . . t tc . t .';
  var M_H = 'K . h . c . h . k . h . tc . h .';
  var M_HX = 'Kx . h . c . h . k . h . Tc . h .';
  var M_HT = 'K . h . c . h . k . h t tc . t t';
  var M_TOUR = 'K . . . c . . . k . t t T . T T';
  var M_RELANCE = 'K . h . c . h . kz . t . t T S S';
  // au chant : le tambour sur les syllabes, la caisse « gated », les mains dans les silences
  var C_APPEL1_X = 'KxT . t . St . h . kT . h . Sc . c .';
  var C_APPEL1 = 'KT . t . St . h . kT . h . Sc . c .';
  var C_APPEL2 = 'KT . . . St . h . kT . h . S . c c';
  var C_REPONSE1 = 'KT . t . St . h . kT . h . St . h .';
  var C_REPONSE2 = 'KT . . . S . h . k . h . Sc . c c';
  var C_RELANCE = 'KT . . . S . h . kz . T . t T S S';
  var C_SEUL1 = 'KxT . t . t . . . T . . . c . c .';         // a cappella : le tambour et les mains
  var C_SEUL2 = 'T . . . T . . . T . . . c . c c';
  var C_SEUL3 = 'T . t . t . . . T . . . t . . .';
  var C_SEUL4 = 'T . . . . . . . . . . . kz . T T';
  // la nuit : les toms qui roulent
  var N_X = 'Kx . . t S . . t k . t . S . t t';
  var N_1 = 'K . . t S . . t k . t . S . t t';
  var N_2 = 'K . . t S . . t k . . T S T t t';
  var N_ROULE = 'K . t t S t t t k t t t T T T T';
  var TIC = 'i . . . i . . . i . . . i . . .';

  A.theme('livre_h1', {
    titre: 'Trois mille masques', moment: 'la ville le jour, livre 1 (Trois mille visages)',
    tonalite: 'ré mineur',
    humeur: 'la tribune qui t\'aime trop : un chœur qui scande sans paroles, une basse en marche, le grand tambour',
    ville: true,
    bpm: 120, gain: 1.08,
    pompe: { prof: 0.5, rel: 0.22 },
    echo: { pas: 6, retour: 0.3, coupe: 2200 },
    salle: { taille: 0.85, duree: 3.0, ton: 3800 },
    cassette: { sature: 1.1, coupe: 10000, bas: 40, souffle: 0.004, flotte: { prof: 3, vit: 0.31 } },
    voix: {
      foule:   { inst: 'vox', vol: 0.25, voyelle: 'o', env: [0.03, 0.22, 0.8, 0.13], rev: 0.42, echo: 0.1, flotte: { prof: 8, vit: 0.45 }, pan: -0.12 },
      foule2:  { inst: 'vox', vol: 0.21, voyelle: 'a', env: [0.03, 0.22, 0.8, 0.13], rev: 0.42, pan: 0.14 },
      masques: { inst: 'vox', vol: 0.085, voyelle: 'ou', vers: 'o', env: [0.06, 0.3, 0.8, 0.3], rev: 0.7, echo: 0.22, flotte: { prof: 24, vit: 0.29 }, pan: 0.45 },
      tribune: { inst: 'vox', vol: 0.1, oct: 3, voyelle: 'a', vers: 'o', rev: 0.5, pompe: true, flotte: { prof: 12, vit: 0.33 }, filtre: 2400, env: [0.35, 0.8, 0.85, 0.3] },
      lead:    { inst: 'lead', vol: 0.11, rev: 0.35, echo: 0.22, flotte: { prof: 6, vit: 0.55 }, pan: 0.05 },
      harmo:   { inst: 'lead', vol: 0.045, rev: 0.35, echo: 0.12, pan: -0.3 },
      envol:   { inst: 'supersaw', vol: 0.07, scies: 5, desaccord: 16, large: 0.8, rev: 0.4, flotte: { prof: 8, vit: 0.5 }, filtre: 4200, env: [0.02, 0.4, 0.8, 0.2] },
      reese:   { inst: 'reese', vol: 0.08, oct: 1, plancher: 'G1', desaccord: 11, pompe: true, filtre: 1600 },
      basse:   { inst: 'basse', vol: 0.072, oct: 1, plancher: 'E1', pompe: true, drive: 1.7, filtre: 2300, ton: [1900, 600, 0.06] },
      batt:    { vol: 0.72, porte: 0.5, tenue: 0.24, rev: 0.22, filtre: 14000 }
    },
    sections: {
      // ── l'introduction, jouée une fois : le grillage, le chant au loin ──
      intro: {
        accords: ['Dm', 'Dm', 'Bb', 'A'],
        ouvre: { tribune: [500, 2400] },
        tribune: [NAPPE, TENU, NAPPE, NAPPE],
        masques: [APPEL1, APPEL2, SILENCE, SILENCE],
        basse: [SILENCE, SILENCE, RACINE, 'R! - - R R - - R R! - - R R - R R'],
        batt: ['r . . . r . . . r . . . r . . .', 'T . . . r . . . T . . . r . . .',
               'T . . . Tr . . . T . . . Tr . . .', 'K . . . c . . . Kz . t . t T S S']
      },
      // ── la boucle ──
      A: {
        accords: ['Dm', 'Dm', 'Bb', 'Bb', 'C', 'C', 'Dm', 'Dm', 'Dm', 'Dm', 'Bb', 'Bb', 'Gm', 'Gm', 'A', 'A'],
        ouvre: { basse: [700, 2300], tribune: [1100, 2200] },
        basse: rep(MARCHE, 7).concat([MARCHE_TOUR]).concat(rep(MARCHE, 7)).concat([MARCHE_MONTE]),
        tribune: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU],
        masques: silences(6).concat([APPEL1, APPEL2]).concat(silences(6)).concat([REPONSE1, REPONSE2]),
        batt: [M_X, M, M, M_T, M, M, M, M_TOUR, M_HX, M_H, M_H, M_HT, M_H, M_H, M_H, M_RELANCE]
      },
      B: {
        accords: ['Dm', 'Bb C', 'Dm', 'A', 'Dm', 'Bb C', 'Dm', 'A Dm', 'Gm', 'Dm', 'Bb C', 'Dm', 'Gm', 'Dm', 'Eb', 'A'],
        foule: CHANT_B,
        foule2: octave(CHANT_B, -12),
        basse: rep(MARCHE_8, 15).concat(['R! - - 8 R - - 8 R! - 3 - 5 - 8 -']),
        tribune: [NAPPE, NAPPE2, NAPPE, NAPPE, NAPPE, NAPPE2, NAPPE, NAPPE2, NAPPE, NAPPE, NAPPE2, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE],
        batt: [C_APPEL1_X, C_APPEL2, C_REPONSE1, C_REPONSE2, C_APPEL1, C_APPEL2, C_REPONSE1, C_REPONSE2,
               C_APPEL1, C_APPEL2, C_APPEL2, C_REPONSE2, C_APPEL1, C_REPONSE1, C_APPEL2, C_RELANCE]
      },
      // le creux : le local sous la tribune, la reese, le chant des masques au fond
      pont: {
        accords: ['Dm', 'Dm', 'Dm', 'Dm', 'Bb', 'Bb', 'Gm', 'Gm', 'Eb', 'Eb', 'Eb', 'Eb', 'A', 'A', 'A', 'A'],
        ouvre: { reese: [500, 1100], basse: [400, 2300], tribune: [900, 1500] },
        reese: [RACINE, TENU, TENU, TENU, RACINE, TENU, RACINE, TENU, RACINE, TENU, TENU, TENU].concat(silences(4)),
        basse: silences(12).concat([MARCHE, MARCHE, MARCHE, MARCHE_MONTE]),
        tribune: [NAPPE, TENU, TENU, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, TENU, TENU, NAPPE, TENU, NAPPE, TENU],
        masques: [SILENCE, SILENCE, APPEL1, APPEL2, SILENCE, SILENCE, SILENCE, SILENCE,
                  'Eb5 . Eb5 . Eb5 - - - Bb4 - - - . . . .', 'C5 - - - D5 - - - Eb5 - - - - - . .', SILENCE, SILENCE,
                  SILENCE, SILENCE, SILENCE, SILENCE],
        batt: ['bx . . . . . . . . . . . . . . .', 't . . . . . . . . . . . . . . .', 'T . . . . . . . r . . . . . . .', 't . . . . . . . r . . . r . . .',
               'T . . . . . . . . . . . . . . .', 't . . . . . . . r . . . . . . .', 'T . . . . . . . . . . . . . . .', 't . . . . . . . r . . . r . r .',
               'T . . . . . . . . . . . . . . .', 't . . . . . . . r . . . . . . .', 'T . . . . . . . . . . . . . . .', 't . . . r . . . T . . . r . r r',
               'K . . . . . . . K . . . . . . .', 'K . . . c . . . K . . . c . . .', 'K . . . c . . . K . . . Tc . . .', M_RELANCE]
      },
      A2: {
        copie: 'A',
        lead: FIER,
        masques: silences(16),
        batt: [M_HX, M_H, M_H, M_HT, M_H, M_H, M_H, M_TOUR, M_HX, M_H, M_H, M_HT, M_H, M_H, M_H, N_ROULE]
      },
      // les nuits : ré et mi bémol, la reese qui boite, le chant à la quinte diminuée et son ombre
      N: {
        accords: ['Dm', 'Eb', 'Dm', 'Eb', 'Dm', 'Eb', 'Bbm', 'A', 'Dm', 'Eb', 'Dm', 'Eb', 'Gm', 'Ab', 'A', 'A'],
        ouvre: { reese: [700, 1800] },
        reese: REESE_BOITE,
        foule: CHANT_NUIT,
        masques: retarde(CHANT_NUIT, 4),
        tribune: [NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, TENU],
        batt: [N_X, N_1, N_1, N_2, N_1, N_1, N_1, N_2, N_1, N_1, N_1, N_2, N_1, N_2, N_1, N_ROULE]
      },
      // l'homme sous la fenêtre : la basse à la noire, le tic, la tribune retient son souffle
      creux: {
        accords: ['Dm', 'Dm', 'Bb', 'Bb', 'Gm', 'Gm', 'A', 'A'],
        ouvre: { basse: [280, 900], tribune: [1400, 900] },
        basse: NOIRES,
        tribune: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU],
        masques: [SILENCE, SILENCE, APPEL1, APPEL2, SILENCE, SILENCE, SILENCE, SILENCE],
        batt: ['bx . . . i . . . i . . . i . . .', TIC, TIC, TIC, TIC, TIC, 'i . . . i . . . i . . . i . i i', 'K . . . K . . . Kz . T . t T S S']
      },
      // le sommet : le chant doublé par le lead et harmonisé, la grande scie
      B2: {
        copie: 'B',
        lead: CHANT_B,
        harmo: true,
        envol: ENVOL_B,
        batt: [C_APPEL1_X, C_APPEL2, C_REPONSE1, C_REPONSE2, C_APPEL1, C_APPEL2, C_REPONSE1, C_REPONSE2,
               C_APPEL1, C_APPEL2, C_APPEL2, C_REPONSE2, C_APPEL1, C_REPONSE1, C_APPEL2, C_SEUL4]
      },
      // tout le stade : quatre mesures a cappella, puis tout le monde
      B3: {
        accords: ['Dm', 'Bb C', 'Dm', 'A', 'Gm', 'Dm', 'Eb', 'A'],
        foule: [APPEL1, APPEL2, REPONSE1, REPONSE2, 'G5 . G5 . G5 - - - D5 - - - . . . .', REPONSE1, 'Eb5 - - - - - - - D5 - - - C5 - - -', REPONSE2],
        foule2: octave([APPEL1, APPEL2, REPONSE1, REPONSE2, 'G5 . G5 . G5 - - - D5 - - - . . . .', REPONSE1, 'Eb5 - - - - - - - D5 - - - C5 - - -', REPONSE2], -12),
        lead: silences(4).concat(['G5 . G5 . G5 - - - D5 - - - . . . .', REPONSE1, 'Eb5 - - - - - - - D5 - - - C5 - - -', REPONSE2]),
        envol: silences(4).concat(['G5 - - - - - - - D5 - - - - - - -', 'F5 - - - - - - - E5 - - - D5 - - -', 'Eb5 - - - - - - - G5 - - - - - - -', 'E5 - - - - - - - C#5 - - - - - - .']),
        basse: [RACINE, TENU, TENU, TENU, MARCHE_8, MARCHE_8, MARCHE_8, MARCHE_8],
        tribune: [NAPPE, NAPPE2, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE],
        batt: [C_SEUL1, C_SEUL2, C_SEUL3, C_SEUL4, 'KxT . T . ST . h . KT . h . Sc . c .', C_REPONSE1, 'KxT . . . ST . h . KT . h . S . c c', 'KT . . . S . h . K . t t T T T T']
      },
      // la retombée : ta voix seule sur la tribune, puis la marche qui revient
      retour: {
        accords: ['Dm', 'Dm', 'Bb', 'Bb', 'Gm', 'Gm', 'A', 'A', 'Dm', 'Dm', 'Bb', 'Bb', 'C', 'C', 'A', 'A'],
        ouvre: { basse: [300, 2300], tribune: [2200, 1000] },
        lead: FIER_SEUL.concat(silences(8)),
        basse: [RACINE, TENU, RACINE, TENU, RACINE, TENU, RACINE, TENU, MARCHE, MARCHE, MARCHE, MARCHE, MARCHE, MARCHE, MARCHE, MARCHE_MONTE],
        tribune: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU],
        masques: silences(12).concat([APPEL1, APPEL2, SILENCE, SILENCE]),
        batt: ['bx . . . . . . . i . . . . . . .', 'i . . . . . . . i . . . . . . .', 'T . . . . . . . i . . . . . . .', 'i . . . . . . . i . . . i . . .',
               'T . . . . . . . i . . . . . . .', 'i . . . . . . . i . . . . . . .', 'T . . . . . . . i . . . i . . .', 'T . . . i . . . T . . . i . i i',
               'K . . . . . . . K . . . . . . .', 'K . . . c . . . K . . . c . . .', M, M_T, M_H, M_H, M_HT, M_RELANCE]
      }
    },
    ordre: ['intro', 'A', 'B', 'pont', 'A2', 'N', 'creux', 'B2', 'B3', 'retour'], boucle: 1
  });
})(typeof FusibleAudio === 'object' ? FusibleAudio : require('../audio.js'));
