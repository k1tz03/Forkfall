/* ---------------------------------------------------------------------------
 * FUSIBLE — la bande originale : « La Maquette » (livre_h5), la ville le jour
 * dans le livre 5, « La Maquette », et son introduction.
 *
 * Un stade en carton dans une vitrine. Une marche de cérémonie, pompeuse
 * comme une inauguration : la basse au premier et au troisième temps, les
 * cuivres de synthèse plaqués au deuxième et au quatrième (le « boum-pah » des
 * fanfares municipales), la caisse claire sèche et ses roulements. La fanfare
 * (do, do, sol… fa, mi bémol ; do) est grandiose, et creuse : chaque fois
 * qu'elle revient, elle est plus courte — huit mesures, puis six, puis quatre,
 * puis deux : le stade rétrécit dans la maquette. Une boîte à musique
 * désaccordée la cite en petit, au mauvais moment, à la double croche, comme
 * un jouet qui se moque ; le mardi à dix-huit heures, une cloche grave sonne
 * six coups (le Conseil) ; la nuit de novembre, la tribune Est brûle, et la
 * fanfare tient enfin toute sa grandeur ; à la fin, les cuivres se dégonflent
 * d'un demi-ton à l'autre, et l'accord final n'a plus de tierce. Do mineur ;
 * 96.
 *
 * Ce qui n'est qu'à lui dans la bande : la boîte à musique au centre (elle se
 * moque), les cuivres (la fanfare, le « pah », les quintes à vide), la marche
 * de cérémonie à la caisse sèche, la fanfare qui rétrécit.
 *
 *   intro    4 m.  (une fois) la vitrine : la boîte à musique remontée, puis
 *                  les cuivres qui s'installent et un roulement
 *   ── la boucle, 104 mesures, 4 min 20 ──
 *   A       16 m.  la vitrine : la marche (boum-pah), la boîte qui tourne son
 *                  air ; la moitié du temps la marche seule
 *   B       16 m.  la fanfare : huit mesures pleines ; puis la boîte la refait
 *                  en petit, et les cuivres restent sur la dominante
 *   creux    8 m.  la mousse verte : le stade fond, la boîte qui ralentit, une
 *                  nappe, la basse tenue
 *   A2      16 m.  la vitrine, avec un contrechant de cuivre ; la fanfare en
 *                  six mesures, la boîte se moque
 *   C       16 m.  le Conseil : six coups de cloche grave, la marche en
 *                  demi-temps, le napolitain (ré bémol), la fanfare en marche
 *                  funèbre, la reese
 *   D       16 m.  la tribune Est : le sommet — toute la fanfare, la grande
 *                  scie, les timbales, la cymbale ; puis la flamme, plus haut
 *   D2       8 m.  quatre mesures de fanfare, puis les quintes à vide, et la
 *                  boîte par-dessus
 *   retour   8 m.  les cuivres se dégonflent ; la boîte seule, la marche
 *                  revient et relance
 *
 * La courbe : A 5 → B 7 → creux 2 → A2 6 → C 4 → D 9 → D2 7 → retour 3 → 5.
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

  function rep(b, n) { var l = []; for (var i = 0; i < n; i++) l.push(b); return l; }
  function silences(n) { return rep(SILENCE, n); }

  // ── LA FANFARE : grandiose, et creuse — do, do, sol, puis elle retombe (fa,
  //    mi bémol ; do) ; la même marche sur mi bémol, le do aigu, la cadence
  var FANFARE = [
    'C5 - - C5 G5 - - - - - - - F5 - Eb5 -', 'Eb5 - - - - - - - C5 - - - - - - -',
    'Eb5 - - Eb5 Bb5 - - - - - - - Ab5 - G5 -', 'F5 - - - - - - - - - - - . . . .',
    'G5 - - G5 C6 - - - Bb5 - - - G5 - - -', 'Ab5 - - - - - - - Eb5 - - - C5 - - -',
    'F5 - - - Ab5 - - - G5 - - - D5 - - -', 'C5 - - - - - - - - - - - . . . .'
  ];
  // la flamme (D, seconde moitié) : plus haut
  var FLAMME = [
    'C6 - - - - - - - Ab5 - - - F5 - - -', 'Ab5 - - - - - - - F5 - - - Db5 - - -',
    'Eb5 - - - - - - - C5 - - - Ab4 - - -', 'G5 - - - - - - - Bb5 - - - - - - -',
    'C6 - - - - - - - Ab5 - - - - - - -', 'F5 - - - - - - - Ab5 - - - Db6 - - -',
    'B5 - - - - - - - - - - - D6 - - -', 'G5 - - - - - - - - - - - . . . .'
  ];
  // le Conseil : la fanfare en marche funèbre, en valeurs longues, au grave
  var FUNEBRE = [
    'F3 - - - - - - - C4 - - - - - - -', 'Ab3 - - - - - - - C4 - - - - - - -',
    'Db4 - - - - - - - - - - - F4 - - -', 'Ab3 - - - - - - - - - - - . . . .',
    'G3 - - - - - - - C4 - - - - - - -', 'Eb4 - - - - - - - C4 - - - Ab3 - - -',
    'B3 - - - - - - - D4 - - - - - - -', 'G3 - - - - - - - - - - - . . . .'
  ];
  // ce qui reste de la fanfare quand elle rétrécit
  var FANFARE6 = FANFARE.slice(0, 4).concat(FANFARE.slice(6, 8));
  var FANFARE4 = [FANFARE[0], FANFARE[1], FANFARE[6], FANFARE[7]];
  // les cuivres qui se dégonflent, d'un demi-ton à l'autre
  var DEGONFLE = ['C5 - - - ~B4 - - - ~Bb4 - - - ~A4 - - -', '~Ab4 - - - - - - - ~G4 - - - - - . .'];

  // ── LA BOÎTE À MUSIQUE : la tête de la fanfare, en petit, à la croche
  var BOITE = [
    'C5 . . C5 G5 . F5 . Eb5 . C5 . G4 . . .', 'Eb5 . D5 . C5 . . . G4 - - - . . . .',
    'Ab4 . C5 . F5 . Eb5 . D5 . C5 . Ab4 . C5 .', 'B4 . . . D5 . . . G4 - - - . . . .'
  ];
  // elle se moque : la fanfare à la double croche
  var MOQUE = [
    'C5 C5 G5 . F5 Eb5 C5 . . . . . . . . .', 'Eb5 Eb5 Bb5 . Ab5 G5 F5 . . . . . . . . .'
  ];
  var MOQUE2 = ['C5 C5 G5 . F5 Eb5 C5 . B4 . . . G4 . . .', SILENCE];
  // elle ralentit (la mousse verte) : les notes s'écartent
  var RALENTIT = [
    'C5 . . C5 G5 . . F5 . . Eb5 . . . C5 .', '. . G4 . . . . . Eb5 . . . . . . .',
    'Eb5 . . . . . C5 . . . . . . . . .', '. . . . . . . . Ab4 . . . . . . .',
    'F5 . . . . . . . . . . . . C5 . .', '. . . . . . . . . . . . . . . .',
    'B4 . . . . . . . . . . . . . . .', '. . . . . . . . . . . . G4 . . .'
  ];
  // mardi, dix-huit heures : six coups de cloche grave
  var SIX_COUPS = ['C4 - - - C4 - - - C4 - - - C4 - - -', 'C4 - - - C4 - - - - - - - - - - -'];

  // ── LA MARCHE : la basse au premier et au troisième temps, le « pah » des cuivres entre
  var BOUM = 'R - - - . . . . 5 - - - . . . .';
  var BOUM2 = 'R - - - . . . . 5 - - - . . 5 .';
  var BOUM_MONTE = 'R - - - . . . . 5 - - - 7 - 8 -';
  var PAH = '. . . . X - . . . . . . X - . .';
  var PAH2 = '. . . . X - . . . . . . X - . X';
  var FUNEBRE_B = 'R - - - - - - - - - - - 5 - - -';     // le demi-temps du Conseil
  // les quintes à vide (D2) : la nappe de cuivre sans tierce, en notes écrites
  var QUINTES = 'C3 - - - - - - - - - - - - - - -';

  // ── la batterie : la caisse sèche et ses roulements ; la « gated » au sommet
  var M_X = 'kx . . . s . . . k . . . s . . .';
  var M = 'k . . . s . . . k . . . s . . .';
  var M_R = 'k . . . s . . . k . . . s . s s';
  var M_ROULE = 'k . . . s . . . s s s s s s s s';
  var M_RELANCE = 'k . . . s . . . kz . s s s s S S';
  var G_X = 'kx . . . S . . . k . . . S . . .';         // la fanfare : la caisse « gated »
  var G = 'k . . . S . . . k . . . S . . .';
  var G_T = 'k . . . S . . . k . T . S . T T';
  var G_ROULE = 'k . . . S . . . t . t . T . T T';          // les timbales
  var C_X = 'kx . . . . . . . s . . . . . . .';         // le Conseil : le demi-temps
  var C = 'k . . . . . . . s . . . . . T .';
  var C_R = 'k . . . . . . . s . . . s . s s';

  A.theme('livre_h5', {
    titre: 'La Maquette', moment: 'la ville le jour, livre 5 (La Maquette)',
    tonalite: 'do mineur',
    humeur: 'un stade en carton dans une vitrine : une fanfare de cuivres qui rétrécit, une marche, une boîte à musique qui se moque',
    ville: true,
    bpm: 96, gain: 1.76,
    pompe: { prof: 0.4, rel: 0.25 },
    echo: { pas: 4, retour: 0.33, coupe: 2400 },
    salle: { taille: 0.65, duree: 2.6, ton: 3800 },
    cassette: { sature: 1, coupe: 10000, bas: 40, souffle: 0.004, flotte: { prof: 3, vit: 0.35 } },
    voix: {
      boite:   { inst: 'cloche', vol: 0.12, faux: 22, echo: 0.3, rev: 0.4, pan: 0.25 },
      lead:    { inst: 'cuivre', vol: 0.13, env: [0.04, 0.3, 0.7, 0.14], ton: [2600, 1500, 0.2], rev: 0.35, echo: 0.12, flotte: { prof: 5, vit: 0.5 }, pan: 0.05 },
      harmo:   { inst: 'cuivre', vol: 0.06, env: [0.04, 0.3, 0.7, 0.14], ton: [2400, 1300, 0.2], rev: 0.35, pan: -0.25 },
      pah:     { inst: 'cuivre', vol: 0.085, oct: 4, env: [0.02, 0.18, 0.4, 0.1], rev: 0.3, pompe: true, pan: -0.15 },
      tenue:   { inst: 'cuivre', vol: 0.09, oct: 3, env: [0.12, 0.6, 0.8, 0.3], ton: [1800, 1200, 0.5], rev: 0.4, flotte: { prof: 6, vit: 0.4 }, pan: -0.1, filtre: 2400 },
      quintes: { inst: 'cuivre', vol: 0.07, env: [0.12, 0.6, 0.8, 0.3], ton: [1800, 1200, 0.5], rev: 0.45, pan: -0.2 },
      quintes2: { inst: 'cuivre', vol: 0.07, env: [0.12, 0.6, 0.8, 0.3], ton: [1800, 1200, 0.5], rev: 0.45, pan: 0.2 },
      envol:   { inst: 'supersaw', vol: 0.07, scies: 5, desaccord: 16, large: 0.85, rev: 0.4, flotte: { prof: 7, vit: 0.45 }, filtre: 4200, env: [0.03, 0.5, 0.82, 0.25] },
      mousse:  { inst: 'pad', vol: 0.075, oct: 3, rev: 0.5, pompe: true, flotte: { prof: 12, vit: 0.3 }, filtre: 1600 },
      cloche:  { inst: 'cloche', vol: 0.12, faux: 8, echo: 0.2, rev: 0.6, pan: -0.2 },
      reese:   { inst: 'reese', vol: 0.1, oct: 1, plancher: 'G1', desaccord: 9, pompe: true, filtre: 1400 },
      basse:   { inst: 'basse', vol: 0.09, oct: 1, plancher: 'E1', pompe: true, drive: 1.3, filtre: 1900, ton: [1300, 520, 0.08] },
      batt:    { vol: 0.5, porte: 0.45, tenue: 0.2, rev: 0.3, filtre: 12000 }
    },
    sections: {
      // ── l'introduction, jouée une fois : la vitrine ──
      intro: {
        accords: ['Cm', 'G', 'Cm', 'G'],
        ouvre: { tenue: [600, 1800] },
        boite: [BOITE[0], BOITE[1], SILENCE, SILENCE],
        tenue: [SILENCE, SILENCE, NAPPE, NAPPE],
        basse: [SILENCE, SILENCE, RACINE, BOUM_MONTE],
        batt: [SILENCE, SILENCE, 'k . . . . . . . k . . . . . . .', M_ROULE]
      },
      // ── la boucle ──
      // la vitrine : la marche, la boîte qui tourne son air
      A: {
        accords: ['Cm', 'Cm', 'Fm', 'G', 'Cm', 'Ab', 'Fm', 'G', 'Cm', 'Cm', 'Fm', 'G', 'Ab', 'Fm', 'G', 'G'],
        ouvre: { basse: [900, 1900] },
        basse: [BOUM, BOUM, BOUM, BOUM2, BOUM, BOUM, BOUM, BOUM_MONTE, BOUM, BOUM, BOUM, BOUM2, BOUM, BOUM, BOUM, BOUM_MONTE],
        pah: [PAH, PAH, PAH, PAH, PAH, PAH, PAH, PAH2, PAH, PAH, PAH, PAH, PAH, PAH, PAH, PAH2],
        boite: BOITE.concat(silences(4)).concat(BOITE).concat(silences(4)),
        batt: [M_X, M, M, M_R, M, M, M, M_ROULE, M_X, M, M, M_R, M, M, M, M_RELANCE]
      },
      // la fanfare : huit mesures pleines, puis la boîte la refait en petit
      B: {
        accords: ['Cm', 'Ab', 'Eb', 'Bb', 'Cm', 'Ab', 'Fm G', 'Cm', 'Cm', 'Ab', 'Eb', 'Bb', 'Ab', 'Fm', 'G', 'G'],
        basse: [BOUM, BOUM, BOUM, BOUM2, BOUM, BOUM, 'R - - - . . . . R - - - . . . .', BOUM, BOUM, BOUM, BOUM, BOUM2, BOUM, BOUM, RACINE, TENU],
        pah: [PAH, PAH, PAH, PAH, PAH, PAH, PAH, PAH, PAH, PAH, PAH, PAH, PAH, PAH, SILENCE, SILENCE],
        tenue: [NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, 'X - - - - - - - X - - - - - - -', NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, TENU],
        lead: FANFARE.concat([FANFARE[0], FANFARE[1]]).concat(silences(2)).concat(['Eb5 - - - - - - - C5 - - - Ab4 - - -', 'F4 - - - Ab4 - - - C5 - - - - - - -', 'D5 - - - - - - - - - - - - - - -', '- - - - - - - - . . . . . . . .']),
        harmo: true,
        boite: silences(10).concat(MOQUE).concat(silences(2)).concat(MOQUE2),
        batt: [G_X, G, G, G_T, G, G, G, G_ROULE, M_X, M, M, M_R, M, M, 'k . . . s . . . k . . . s . . .', M_RELANCE]
      },
      // la mousse verte : le stade fond, la boîte qui ralentit
      creux: {
        accords: ['Cm', 'Cm', 'Ab', 'Ab', 'Fm', 'Fm', 'G', 'G'],
        ouvre: { mousse: [1800, 700], basse: [700, 400] },
        mousse: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU],
        basse: [RACINE, TENU, RACINE, TENU, RACINE, TENU, RACINE, '- - - - - - - - . . . . . . . .'],
        boite: RALENTIT,
        batt: ['bx . . . . . . . . . . . . . . .', SILENCE, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE, 'k . . . s . . . k . . . s s s s']
      },
      // la vitrine, avec un contrechant de cuivre ; la fanfare en six mesures
      A2: {
        copie: 'A',
        accords: ['Cm', 'Cm', 'Fm', 'G', 'Cm', 'Ab', 'Fm', 'G', 'Cm', 'Ab', 'Eb', 'Bb', 'Fm G', 'Cm', 'G', 'G'],
        lead: ['Eb5 - - - - - - - D5 - - - C5 - - -', 'G4 - - - - - - - - - - - - - - -', 'Ab4 - - - - - - - C5 - - - - - - -', 'B4 - - - - - - - D5 - - - - - - -',
               'C5 - - - - - - - Eb5 - - - G5 - - -', 'Ab5 - - - - - - - - - - - G5 - - -', 'F5 - - - - - - - Eb5 - - - D5 - - -', 'D5 - - - - - - - . . . . . . . .']
          .concat(FANFARE6).concat(silences(2)),
        harmo: false,
        boite: BOITE.concat(silences(10)).concat(MOQUE),
        basse: [BOUM, BOUM, BOUM, BOUM2, BOUM, BOUM, BOUM, BOUM_MONTE, BOUM, BOUM, BOUM, BOUM2, 'R - - - . . . . R - - - . . . .', BOUM, BOUM, BOUM_MONTE],
        batt: [M_X, M, M, M_R, M, M, M, M_ROULE, G_X, G, G, G_T, G, G, M, M_RELANCE]
      },
      // le Conseil : six coups de cloche grave, le demi-temps, le napolitain, la marche funèbre
      C: {
        accords: ['Cm', 'Cm', 'Db', 'Db', 'Cm', 'Cm', 'Bbm', 'C', 'Fm', 'Fm', 'Db', 'Db', 'Cm', 'Ab', 'G', 'G'],
        ouvre: { reese: [600, 1400], tenue: [900, 1600] },
        cloche: SIX_COUPS.concat(silences(6)).concat(SIX_COUPS).concat(silences(6)),
        reese: [FUNEBRE_B, FUNEBRE_B, FUNEBRE_B, FUNEBRE_B, FUNEBRE_B, FUNEBRE_B, FUNEBRE_B, FUNEBRE_B, FUNEBRE_B, FUNEBRE_B, FUNEBRE_B, FUNEBRE_B, FUNEBRE_B, FUNEBRE_B, RACINE, '- - - - - - - - . . . . . . . .'],
        tenue: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU],
        lead: silences(8).concat(FUNEBRE),
        batt: [C_X, C, C, C_R, C, C, C, C_R, C_X, C, C, C_R, C, C, 'k . . . . . . . s . . . s s s s', M_RELANCE]
      },
      // la tribune Est : toute la fanfare, la grande scie, les timbales ; puis la flamme
      D: {
        accords: ['Cm', 'Ab', 'Eb', 'Bb', 'Cm', 'Ab', 'Fm G', 'Cm', 'Fm', 'Db', 'Ab', 'Eb', 'Fm', 'Db', 'G', 'G'],
        ouvre: { envol: [2400, 4200] },
        basse: [BOUM, BOUM, BOUM, BOUM2, BOUM, BOUM, 'R - - - . . . . R - - - . . . .', BOUM_MONTE, BOUM, BOUM, BOUM, BOUM2, BOUM, BOUM, BOUM, BOUM_MONTE],
        pah: [PAH, PAH, PAH, PAH, PAH, PAH, PAH, PAH2, PAH, PAH, PAH, PAH, PAH, PAH, PAH, PAH2],
        tenue: NAPPE,
        lead: FANFARE.concat(FLAMME),
        harmo: true,
        envol: FANFARE.concat(FLAMME),
        batt: [G_X, G, G, G_T, G_X, G, G, G_ROULE, G_X, G, G, G_T, G_X, G, G, G_ROULE]
      },
      // quatre mesures de fanfare, puis les quintes à vide : le carton
      D2: {
        accords: ['Cm', 'Ab', 'Fm G', 'Cm', 'Cm', 'Cm', 'Cm', 'Cm'],
        lead: FANFARE4.concat(silences(4)),
        harmo: true,
        tenue: [NAPPE, NAPPE, 'X - - - - - - - X - - - - - - -', NAPPE, SILENCE, SILENCE, SILENCE, SILENCE],
        quintes: [SILENCE, SILENCE, SILENCE, SILENCE, QUINTES, TENU, TENU, '- - - - - - - - . . . . . . . .'],
        quintes2: [SILENCE, SILENCE, SILENCE, SILENCE, 'G3 - - - - - - - - - - - - - - -', TENU, TENU, '- - - - - - - - . . . . . . . .'],
        boite: silences(4).concat(['C5 . . C5 G5 . F5 . Eb5 . C5 . . . . .', SILENCE, 'C4 . . C4 G4 . F4 . . . . . . . . .', SILENCE]),
        basse: [BOUM, BOUM, 'R - - - . . . . R - - - . . . .', BOUM, RACINE, TENU, TENU, '- - - - - - - - . . . . . . . .'],
        pah: [PAH, PAH, PAH, PAH, SILENCE, SILENCE, SILENCE, SILENCE],
        batt: [G_X, G, G, 'kx . . . S . . . k . . . S . . .', 'bx . . . . . . . . . . . . . . .', SILENCE, SILENCE, '. . . . . . . . . . . . s . s s']
      },
      // les cuivres se dégonflent ; la boîte seule ; la marche revient
      retour: {
        accords: ['Cm', 'Cm', 'Fm', 'G', 'Cm', 'Ab', 'Fm', 'G'],
        ouvre: { basse: [500, 1900] },
        lead: DEGONFLE.concat(silences(6)),
        boite: [SILENCE, SILENCE, BOITE[2], BOITE[3], SILENCE, SILENCE, SILENCE, SILENCE],
        basse: [RACINE, TENU, BOUM, BOUM, BOUM, BOUM, BOUM, BOUM_MONTE],
        pah: [SILENCE, SILENCE, SILENCE, SILENCE, PAH, PAH, PAH, PAH2],
        batt: ['kx . . . . . . . . . . . . . . .', SILENCE, 'k . . . . . . . k . . . . . . .', 'k . . . s . . . k . . . s . . .', M, M, M, M_RELANCE]
      }
    },
    ordre: ['intro', 'A', 'B', 'creux', 'A2', 'C', 'D', 'D2', 'retour'], boucle: 1
  });
})(typeof FusibleAudio === 'object' ? FusibleAudio : require('../audio.js'));
