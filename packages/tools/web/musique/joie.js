/* ---------------------------------------------------------------------------
 * FUSIBLE — la bande originale : « La Montée » (joie), le Bilan tenu, une
 * montée, un titre, une Coupe gagnée (jusqu'au lendemain).
 *
 * La fête, mais au bord de la nuit. Une basse carrée en octaves, en croches,
 * qui roule comme une boule à facettes ; quatre temps au sol, les claps sur le
 * deux et le quatre dans une grande salle sombre, le charleston ouvert entre
 * les temps ; des accords plaqués à contretemps, puis des cordes de grandes
 * scies. Tout va par octaves : la mélodie aussi, un carré creux doublé à
 * l'octave grave par un second carré. L'accroche monte : trois notes syncopées dont la plus haute grimpe
 * d'un demi-ton à chaque mesure (mi, fa, sol, sol dièse… la). Au sommet la
 * même accroche monte jusqu'en do majeur par deux accords majeurs volés au
 * mineur (la bémol, si bémol) ; puis la nuit reprend tout, et l'on retombe en
 * la mineur. Même la joie a son ombre. La mineur → do majeur ; 122.
 *
 *   entree    4 m.  (une fois) les claps seuls dans la salle, la basse qui
 *                   s'ouvre, la grosse caisse, la montée
 *   ── la boucle, 128 mesures, 4 min 12 ──
 *   A        16 m.  la fête : la basse en octaves, les claps ; l'accroche qui
 *                   grimpe (mi, fa, sol, sol dièse) sur la seconde phrase
 *   B        16 m.  le refrain : il penche vers do majeur, le mi majeur volé
 *                   le ramène en la mineur
 *   bord     16 m.  le creux, au bord de la nuit : la basse seule et fermée,
 *                   les claps au loin, des voix « a » ; l'accroche en notes
 *                   longues (mi… fa… sol… sol dièse) ; quatre mesures de montée
 *   A2       16 m.  la fête encore : la basse qui saute, l'accroche harmonisée
 *   montee   16 m.  la montée : fa, sol, la bémol, si bémol, do — l'accroche
 *                   grimpe jusqu'au do aigu ; les cordes
 *   sommet   16 m.  le sommet en do majeur : l'air, la caisse « gated » dans les
 *                   claps ; un mi bémol (le mineur volé) passe dans la lumière
 *   retombee 16 m.  la nuit reprend : la mineur, la basse qui se referme, la
 *                   fin de l'accroche, des voix
 *   retour   16 m.  la fête qui se remonte : les claps, la basse qui s'ouvre, le
 *                   charleston, les accords, la relance
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
  function silences(n) { var l = []; for (var i = 0; i < n; i++) l.push(SILENCE); return l; }
  function fois(n, l) { var r = []; for (var i = 0; i < n; i++) r = r.concat(l); return r; }
  // la même ligne, d'une octave à l'autre (les notes écrites seulement)
  function octave(l, d) {
    return l.map(function (b) { return b.replace(/([A-G][#b]?)(\d)/g, function (m, n, o) { return n + (+o + d); }); });
  }

  // ── la basse carrée en octaves, en croches (la boule à facettes) ──
  var DISCO = 'R . 8 . R . 8 . R . 8 . R 8 R 8';
  var DISCO2 = 'R . 8 . R . 8 R . R 8 . R . 8 .';      // elle saute
  var DISCO_NOIRES = 'R . . . R . . . R . . . R . . .';

  // ── L'ACCROCHE : trois notes syncopées, la plus haute grimpe d'un demi-ton ──
  var MONTE = [
    '. . A4 . C5 . . E5 - - . . . . . .',
    '. . A4 . C5 . . F5 - - . . . . . .',
    '. . B4 . D5 . . G5 - - . . . . . .',
    '. . B4 . E5 . . G#5 - - - - - - . .'
  ];
  var ARRIVEE = 'A5 - - - - - . . . . . . . . . .';
  var MONTE_VITE = [
    '. . A4 . C5 . . E5 - - . . A4 . C5 .',
    '. . A4 . C5 . . F5 - - . . A4 . C5 .',
    '. . B4 . D5 . . G5 - - . . B4 . D5 .',
    '. . B4 . D5 . . G#5 - - - - E5 - D5 -'
  ];
  // la même, jusqu'en do majeur par la bémol et si bémol
  var MONTEE_DO = [
    '. . A4 . C5 . . F5 - - . . . . . .',
    '. . B4 . D5 . . G5 - - . . . . . .',
    '. . C5 . Eb5 . . Ab5 - - . . . . . .',
    '. . D5 . F5 . . Bb5 - - . . . . . .',
    '. . E5 . G5 . . C6 - - - - - - - -',
    '- - - - - - - - . . . . . . . .',
    '. . C5 . Eb5 . . Ab5 - - . . . . . .',
    '. . D5 . F5 . . Bb5 - - . . A5 - Bb5 -',
    'C6 - - - - - - - . . . . . . . .',
    SILENCE,
    '. . A4 . C5 . . F5 - - . . . . . .',
    '. . B4 . D5 . . G5 - - . . . . . .',
    '. . C5 . Eb5 . . Ab5 - - . . . . . .',
    '. . D5 . F5 . . Bb5 - - . . . . . .',
    '. . E5 . G5 . . C6 - - - - - - - -',
    '- - - - - - - - . . . . . . . .'
  ];

  // ── LE REFRAIN : il penche vers do, le mi majeur le ramène ──
  var REFRAIN = [
    '. . D5 - F5 - A5 - - - G5 - F5 - E5 -',
    'D5 - - - - - - - . . B4 - C5 - D5 -',
    'E5 - - - - - - - G5 - - - - - E5 -',
    'C5 - - - - - - - . . . . . . . .',
    '. . D5 - F5 - A5 - - - G5 - F5 - E5 -',
    'D5 - - - - - - - . . D5 - E5 - F5 -',
    'G#5 - - - - - - - - - - - B5 - - -',
    'G#5 - - - - - - - . . . . . . . .',
    '. . A5 - - - G5 - - - F5 - - - E5 -',
    'D5 - - - - - - - G5 - - - - - - -',
    '. . E5 - G5 - B5 - - - - - A5 - G5 -',
    'A5 - - - - - - - . . . . . . . .',
    '. . F5 - - - E5 - - - D5 - - - C5 -',
    'B4 - - - - - - - D5 - - - - - G#4 -',
    'A4 - - - - - - - - - - - . . . .',
    SILENCE
  ];
  // ── LE SOMMET, en do majeur : un mi bémol passe (le mineur volé) ──
  var SOMMET = [
    '. . G5 - - - E5 - - - G5 - C6 - - -',
    '- - - - - - - - Bb5 - - - G5 - - -',
    '. . F5 - - - D5 - - - F5 - Bb5 - - -',
    'G5 - - - - - - - . . . . . . . .',
    '. . A5 - - - F5 - - - A5 - C6 - - -',
    'B5 - - - - - - - D6 - - - - - - -',
    'C6 - - - - - - - Ab5 - - - - - - -',
    'Bb5 - - - - - - - . . . . D6 - - -',
    'C6 - - - - - - - G5 - - - E5 - - -',
    'Eb5 - - - - - - - C5 - - - - - - -',
    'D5 - - - - - - - F5 - - - Bb5 - - -',
    'G5 - - - - - - - . . . . . . . .',
    '. . A5 - - - G5 - - - F5 - - - E5 -',
    'D5 - - - - - - - B4 - - - - - - -',
    'C5 - - - - - - - D5 - - - - - - -',
    'E5 - - - - - - - - - - - . . . .'
  ];
  // ── au bord de la nuit : l'accroche en notes longues ──
  var MONTE_LENTE = silences(8).concat([
    'E5 - - - - - - - - - - - - - - -', TENU, 'F5 - - - - - - - - - - - - - - -', TENU,
    'F5 - - - - - - - - - - - - - - -', 'G5 - - - - - - - - - - - - - - -',
    'G#5 - - - - - - - - - - - - - - -', TENU
  ]);

  // ── les accords plaqués, à contretemps ──
  var STAB = ['. . X . . . . X . . X . . . . .', '. . . . . . X . . . X . . X . .'];

  // ── la batterie : quatre au sol, les claps, le charleston ouvert ──
  var D_DISCO = 'k . o . kc . o . k . o . kc . o .';
  var D_DISCO_X = 'kx . o . kc . o . k . o . kc . o .';
  var D_DISCO_FIN = 'k . o . kc . o . kz . o . kc c c c';
  var D_REFRAIN = 'k . o h kc . o . k . o h kc . o h';
  var D_REFRAIN_X = 'kx . o h kc . o . k . o h kc . o h';
  var D_REFRAIN_FIN = 'k . o h kc . o . kz . t . t T c c';
  var D_SOMMET = 'k . o . kSc . o . k . o . kSc . o .';
  var D_SOMMET_X = 'kx . o . kSc . o . k . o . kSc . o .';
  var D_SOMMET_FIN = 'k . o . kSc . o . kz . t . t T S S';
  var D_LOIN = '. . . . c . . . . . . . c . . .';
  var D_LOIN_K = 'k . . . c . . . k . . . c . . .';

  function fete(x, n, fin8, fin) {
    return [x, n, n, n, n, n, n, fin8, x, n, n, n, n, n, n, fin];
  }

  A.theme('joie', {
    titre: 'La Montée', moment: 'le Bilan tenu, une montée, un titre, une Coupe (jusqu’au lendemain)',
    tonalite: 'la mineur → do majeur',
    humeur: "la fête au bord de la nuit : une basse en octaves, des claps, une accroche qui grimpe d'un demi-ton",
    ville: true,
    bpm: 122, gain: 1.36,
    pompe: { prof: 0.6, rel: 0.2 },
    echo: { pas: 3, retour: 0.38, coupe: 2600 },
    salle: { taille: 0.75, duree: 2.8, ton: 4200 },
    cassette: { sature: 1, coupe: 10500, bas: 55, souffle: 0.004, flotte: { prof: 3, vit: 0.33 } },
    voix: {
      lead:   { inst: 'pulse', duty: 0.5, vol: 0.11, filtre: 3400, env: [0.003, 0.25, 0.65, 0.1], echo: 0.28, rev: 0.3,
                flotte: { prof: 5, vit: 0.5 }, pan: 0.05 },
      grave:  { inst: 'pulse', duty: 0.5, vol: 0.06, filtre: 2400, env: [0.003, 0.25, 0.65, 0.1], echo: 0.12, rev: 0.25, pan: -0.12 },
      harmo:  { inst: 'pulse', duty: 0.5, vol: 0.05, filtre: 3000, env: [0.003, 0.25, 0.65, 0.1], echo: 0.12, rev: 0.3, pan: -0.3 },
      stab:   { inst: 'stab', vol: 0.15, oct: 4, echo: 0.2, rev: 0.25, pompe: true, pan: -0.2 },
      cordes: { inst: 'supersaw', vol: 0.11, oct: 4, scies: 5, desaccord: 16, large: 0.85, rev: 0.38, pompe: true,
                flotte: { prof: 8, vit: 0.45 }, filtre: 4200, env: [0.12, 0.6, 0.85, 0.3] },
      aah:    { inst: 'vox', vol: 0.08, oct: 3, voyelle: 'a', vers: 'o', rev: 0.5, pompe: true, pan: 0.1 },
      basse:  { inst: 'sqbasse', vol: 0.1, oct: 2, pompe: true, drive: 1.5, filtre: 2600, ton: [3200, 1200, 0.07] },
      batt:   { vol: 0.42, porte: 0.45, tenue: 0.22, rev: 0.3, filtre: 10000 }
    },
    sections: {
      // ── l'introduction, jouée une fois : les claps dans la salle ──
      entree: {
        accords: ['Am7', 'Am7', 'Fmaj7', 'G'],
        ouvre: { basse: [300, 2600] },
        basse: [SILENCE, DISCO, DISCO, DISCO],
        stab: [SILENCE, SILENCE, SILENCE, STAB[1]],
        batt: [D_LOIN, D_LOIN, D_LOIN_K, 'k . . . kc . . . kz . o . kc c c c']
      },
      // ── la boucle ──
      A: {
        accords: ['Am7', 'Am7', 'Fmaj7', 'G', 'Am7', 'Fmaj7', 'G', 'E',
                  'Am7', 'Am7', 'Fmaj7', 'G', 'Am7', 'Fmaj7', 'G', 'E7'],
        ouvre: { cordes: [1200, 2600] },
        basse: DISCO,
        stab: STAB,
        cordes: [NAPPE, TENU, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, TENU, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE],
        lead: silences(4).concat(MONTE, [ARRIVEE], silences(3), MONTE_VITE),
        grave: octave(silences(4).concat(MONTE, [ARRIVEE], silences(3), MONTE_VITE), -1),
        batt: fete(D_DISCO_X, D_DISCO, D_DISCO, D_DISCO_FIN)
      },
      B: {
        accords: ['Dm7', 'G', 'Cmaj7', 'Am7', 'Dm7', 'G', 'E', 'E',
                  'Dm7', 'G', 'Cmaj7', 'Fmaj7', 'Dm7', 'E7', 'Am7', 'Am7'],
        basse: DISCO,
        stab: STAB,
        cordes: [NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, TENU, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, TENU],
        lead: REFRAIN,
        grave: octave(REFRAIN, -1),
        batt: fete(D_REFRAIN_X, D_REFRAIN, D_REFRAIN, D_REFRAIN_FIN)
      },
      // le creux : au bord de la nuit
      bord: {
        accords: ['Am7', 'Am7', 'Am7', 'Am7', 'Fmaj7', 'Fmaj7', 'Dm7', 'Dm7',
                  'Am7', 'Am7', 'Fmaj7', 'Fmaj7', 'Dm7', 'Dm7', 'E', 'E'],
        ouvre: { basse: [400, 1300] },
        basse: DISCO,
        aah: [NAPPE, TENU, TENU, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU],
        lead: MONTE_LENTE,
        batt: ['kx . . . c . . . . . . . c . . .', D_LOIN, D_LOIN, D_LOIN, D_LOIN, D_LOIN, D_LOIN, D_LOIN,
               D_LOIN_K, D_LOIN_K, D_LOIN_K, D_LOIN_K,
               'k . . . kc . . . k . . . kc . . .', 'k . o . kc . o . k . o . kc . o .',
               'k . o . kc . o . k . o . kc . s s', 'k . s . kc . s . kz s s s kc s s s']
      },
      A2: {
        copie: 'A', harmo: true,
        basse: DISCO2,
        stab: [STAB[1], STAB[0]],
        lead: silences(4).concat(MONTE_VITE, [ARRIVEE], silences(3), MONTE),
        grave: octave(silences(4).concat(MONTE_VITE, [ARRIVEE], silences(3), MONTE), -1)
      },
      // la montée : jusqu'en do majeur, par la bémol et si bémol
      montee: {
        accords: ['Fmaj7', 'G', 'Ab', 'Bb', 'C', 'C', 'Ab', 'Bb',
                  'C', 'Em7', 'Fmaj7', 'G', 'Ab', 'Bb', 'C', 'C'],
        basse: DISCO,
        cordes: [NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, TENU, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, TENU],
        stab: STAB,
        lead: MONTEE_DO,
        grave: octave(MONTEE_DO, -1),
        batt: fete(D_REFRAIN_X, D_REFRAIN, D_REFRAIN, D_REFRAIN_FIN)
      },
      sommet: {
        accords: ['C', 'Abmaj7', 'Bb', 'C', 'Fmaj7', 'G', 'Ab', 'Bb',
                  'C', 'Abmaj7', 'Bb', 'C', 'Fmaj7', 'G', 'Ab Bb', 'C'],
        harmo: true,
        basse: DISCO2,
        cordes: [NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE2, NAPPE],
        stab: STAB,
        lead: SOMMET,
        grave: octave(SOMMET, -1),
        batt: fete(D_SOMMET_X, D_SOMMET, D_SOMMET, D_SOMMET_FIN)
      },
      // la nuit reprend : retour en la mineur
      retombee: {
        accords: ['Fmaj7', 'E', 'Am7', 'Am7', 'Fmaj7', 'E', 'Dm7', 'Dm7',
                  'Fmaj7', 'E', 'Am7', 'Am7', 'Dm7', 'Dm7', 'E', 'E'],
        ouvre: { basse: [2600, 600] },
        basse: DISCO,
        aah: [NAPPE, NAPPE, NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU],
        lead: [SILENCE, MONTE[3], ARRIVEE, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE,
               SILENCE, MONTE[3], ARRIVEE, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE],
        batt: [D_DISCO_X, D_DISCO, D_DISCO, D_DISCO, D_LOIN_K, D_LOIN_K, D_LOIN_K, D_LOIN_K,
               D_LOIN_K, D_LOIN_K, D_LOIN_K, D_LOIN_K, D_LOIN_K, D_LOIN_K, D_LOIN_K, 'k . . . kc . . . kz . . . kc c c c']
      },
      // la fête qui se remonte
      retour: {
        accords: ['Am7', 'Am7', 'Fmaj7', 'G', 'Am7', 'Am7', 'Fmaj7', 'G',
                  'Am7', 'Am7', 'Fmaj7', 'G', 'Am7', 'Fmaj7', 'G', 'E7'],
        ouvre: { basse: [700, 2600] },
        basse: fois(8, [DISCO_NOIRES]).concat(fois(8, [DISCO])),
        stab: silences(8).concat(fois(4, STAB)),
        aah: [NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU, NAPPE, NAPPE].concat(silences(8)),
        batt: ['kx . . . kc . . . k . . . kc . . .', D_LOIN_K, D_LOIN_K, D_LOIN_K,
               'k . . . kc . . . k . . . kc . . .', 'k . . . kc . . . k . . . kc . . .',
               'k . o . kc . o . k . o . kc . o .', 'k . o . kc . o . k . o . kc . o .',
               D_DISCO_X, D_DISCO, D_DISCO, D_DISCO, D_DISCO, D_DISCO, D_DISCO, D_DISCO_FIN]
      }
    },
    ordre: ['entree', 'A', 'B', 'bord', 'A2', 'montee', 'sommet', 'retombee', 'retour'], boucle: 1
  });
})(typeof FusibleAudio === 'object' ? FusibleAudio : require('../audio.js'));
