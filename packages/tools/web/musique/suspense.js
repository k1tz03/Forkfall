/* ---------------------------------------------------------------------------
 * FUSIBLE — la bande originale : « Les Douze Pages » (suspense), le grand
 * déballage, les décisions du samedi en direct, la dernière carte d'un livre.
 *
 * Retenir son souffle. Ce qui n'appartient qu'à ce thème : DOUZE PAGES, douze
 * accords mineurs qui montent d'un demi-ton toutes les deux mesures (si bémol,
 * si, do… la) et ne finissent pas de monter — les cordes y sont menées voix par
 * voix dans la même octave (chaque ligne monte, et retombe à son tour, jamais
 * deux ensemble), et un chœur sur trois octaves fait l'illusion d'une montée
 * sans fin (l'octave du bas s'ouvre pendant que celle du haut se ferme : à la
 * treizième page, on croit monter encore). Dessous, un ostinato qui accélère
 * par paliers — une note toutes les six doubles croches, puis quatre, trois,
 * deux, une — et des roulements de timbales qui enflent. Une seule pulsation
 * au tempo (le moteur n'en a qu'une par thème) : c'est l'ostinato qui presse,
 * de 67 à 400 notes à la minute. Si bémol mineur ; 100.
 *
 *   chemise   4 m.  (une fois) le dossier qu'on pose : le roulement qui enfle,
 *                   l'ostinato qui passe de quatre à trois, deux, une ; le souffle
 *   ── la boucle, 68 mesures, 2 min 43 ──
 *   C        24 m.  les douze pages : la montée (si bémol mineur → la mineur),
 *                   l'ostinato à trois, puis à deux ; le chœur sans fin, les
 *                   roulements qui s'ouvrent ; les pages 1 à 4 en quintes à vide
 *   D         8 m.  la dernière page, le sommet : la montée continue (si bémol,
 *                   si, do, do dièse), l'ostinato en doubles croches, le cri qui
 *                   monte, la caisse « gated »
 *   creux     8 m.  le souffle relâché : le boum, la pédale seule, le chœur tenu,
 *                   le tic qui compte et qui presse ; le roulement repart
 *   B        16 m.  les promesses : l'ostinato à quatre puis à trois, la phrase
 *                   qui reste suspendue sur la sensible ; deux mesures où l'on
 *                   retient son souffle
 *   A        12 m.  la page d'avant : l'ostinato toutes les six doubles croches
 *                   (à contretemps de la mesure), la pédale, les cordes, le chœur
 *                   tenu ; le roulement au bout des phrases, et la montée revient
 *
 * La montée ouvre la boucle : le jeu reprend un thème retrouvé à la section qui
 * suit celle qu'il a quittée, et une décision du samedi n'en entend que cinq à dix
 * secondes — la deuxième décision d'un samedi tombe sur la montée, la troisième sur
 * le sommet.
 *
 * Toutes les sections du corps partent d'un premier temps franc (la grosse
 * caisse lourde et la cymbale, la pédale dans la mesure) : le thème peut
 * reprendre à chacune. La grammaire : audio.js (« L'ÉCRITURE », « LES VOIX ») ;
 * le guide du compositeur : docs/design/bande_originale.md § 6.
 * ------------------------------------------------------------------------- */
(function (A) {
  'use strict';
  var SILENCE = A.SILENCE;
  var TENU = '- - - - - - - - - - - - - - - -';
  var RACINE = '1 - - - - - - - - - - - - - - -';
  function silences(n) { var l = []; for (var i = 0; i < n; i++) l.push(SILENCE); return l; }
  function fois(l, n) { var o = []; for (var i = 0; i < n; i++) o = o.concat(l); return o; }
  var NOMS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
  function nom(m) { return NOMS[m % 12] + (Math.floor(m / 12) - 1); }
  // une ligne tenue : [[note midi (ou null : silence), mesures], …]
  function ligne(seq) {
    var l = [];
    seq.forEach(function (p) {
      if (p[0] == null) { l = l.concat(silences(p[1])); return; }
      l.push(nom(p[0]) + ' - - - - - - - - - - - - - - -');
      for (var i = 1; i < p[1]; i++) l.push(TENU);
    });
    return l;
  }
  function pages(notes) { return ligne(notes.map(function (m) { return [m, 2]; })); }

  // L'OSTINATO, par paliers : une note toutes les six, quatre, trois, deux, une doubles croches
  var P6 = ['1 . . . . . 1 . . . . . 1 . . .', '. . 1 . . . . . 1 . . . . . 1 .', '. . . . 1 . . . . . 1 . . . . .'];
  var P4 = '1 . . . 1 . . . 1 . . . 1 . . .';
  var P3 = ['1 . . 1 . . 1 . . 1 . . 1 . . 1', '. . 1 . . 1 . . 1 . . 1 . . 1 .', '. 1 . . 1 . . 1 . . 1 . . 1 . .'];
  var P2 = '1 . 1 . 1 . 1 . 1 . 1 . 1 . 1 .';
  var P1 = '1 1 1 1! 1 1 1 1 1 1 1 1! 1 1 1 1';                // l'accent pousse vers le temps, à côté de la grosse caisse
  // sur la pédale (si bémol tenu) : l'horloge du souffle retenu, hors de la montée
  function surBb(b) { return b.replace(/1/g, 'Bb3'); }
  var P6B = P6.map(surBb), P4B = surBb(P4), P3B = P3.map(surBb), P2B = surBb(P2), P1B = surBb(P1);

  // LES DOUZE PAGES : les trois lignes des cordes, une note midi par page (deux
  // mesures), toutes entre fa 3 et mi 4 — chacune monte d'un demi-ton et retombe
  // d'une octave à son tour (la fondamentale à la page 8, la tierce à la 5, la quinte à la 13)
  var FOND = [58, 59, 60, 61, 62, 63, 64, 53, 54, 55, 56, 57];
  var TIERCE = [61, 62, 63, 64, 53, 54, 55, 56, 57, 58, 59, 60];
  var QUINTE = [53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64];
  var DOUZE = ['Bbm', 'Bm', 'Cm', 'C#m', 'Dm', 'Ebm', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am'];
  function deuxFois(l) { var o = []; l.forEach(function (a) { o.push(a, a); }); return o; }

  // LA PHRASE des promesses : elle descend et reste suspendue sur la sensible (la bécarre)
  var PROMESSE = [
    SILENCE, SILENCE,
    'Db5 - - C5 Bb4 - - - . . . . . . . .', 'A4 - - - - - - - - - - - . . . .',
    SILENCE, SILENCE,
    'Eb5 - - Db5 B4 - - - . . . . . . . .', 'A4 - - - - - - - - - - - . . . .',
    SILENCE, SILENCE,
    'Gb5 - - F5 Eb5 - - - Db5 - - - . . . .', 'C5 - - - - - - - A4 - - - - - - -',
    'Gb5 - - - - - - - F5 - - - Eb5 - - -', 'Eb5 - - - - - - - - - - - . . . .',
    SILENCE, SILENCE
  ];
  // LE CRI de la dernière page : la quinte de chaque page, qui monte
  var CRI = ['F5 - - - - - - - - - - - - - - -', TENU, 'F#5 - - - - - - - - - - - - - - -', TENU,
             'G5 - - - - - - - - - - - - - - -', TENU, 'G#5 - - - - - - - - - - - - - - -', '- - - - - - - - - - - - . . . .'];

  // LA BATTERIE : la grosse caisse lourde, les timbales (T), les roulements
  var ROULE = 'T T T T T T T T T T T T T T T T';
  var A_UN = 'K . . . . . . . . . . . . . . .';
  var C_PAGE = 'K . . . . . . . T . . . . . . .';
  var C_PAGE_R = 'K . . . . . . . T . . . T T T T';
  var C_VITE = 'K . . . T . . . K . . . T . . .';
  var C_VITE_R = 'K . . . T . . . K . T T s s s s';
  var D_SOM = 'K . . . KS . . . K . . . KS . . .';
  var D_SOM_R = 'K . . . KS . . . K . . . KS . T T';
  var D_SOM_X = 'Kx . . . KS . . . K . . . KS . . .';

  A.theme('suspense', {
    titre: 'Les Douze Pages', moment: 'le grand déballage, les décisions du samedi en direct, la dernière carte', tonalite: 'si bémol mineur',
    humeur: 'douze accords qui montent sans fin, un ostinato qui accélère par paliers, des roulements',
    bpm: 100, gain: 1.38,
    pompe: { prof: 0.3, rel: 0.35 },
    echo: { pas: 4, retour: 0.4, coupe: 1800 },
    salle: { taille: 0.7, duree: 3, ton: 3000 },
    cassette: { sature: 1.1, coupe: 9500, bas: 45, souffle: 0.005, flotte: { prof: 3, vit: 0.35 } },
    voix: {
      lead:    { inst: 'lead', vol: 0.14, echo: 0.25, rev: 0.35, flotte: { prof: 8, vit: 0.3 }, pan: 0.05, filtre: 2800 },
      harmo:   { inst: 'lead', vol: 0.07, echo: 0.15, rev: 0.35, flotte: { prof: 8, vit: 0.3 }, pan: -0.3, filtre: 2800 },
      pas:     { inst: 'pluck2', vol: 0.1, oct: 3, plancher: 'Bb3', echo: 0.15, rev: 0.15, pan: 0.1, ton: [1800, 450, 0.05], filtre: 3000 },
      c1:      { inst: 'supersaw', vol: 0.09, scies: 5, desaccord: 18, large: 0.7, rev: 0.4, pompe: true, filtre: 2000, env: [0.5, 1, 0.85, 0.3] },
      c2:      { inst: 'supersaw', vol: 0.09, scies: 5, desaccord: 18, large: 0.7, rev: 0.4, pompe: true, filtre: 2000, env: [0.5, 1, 0.85, 0.3] },
      c3:      { inst: 'supersaw', vol: 0.09, scies: 5, desaccord: 18, large: 0.7, rev: 0.4, pompe: true, filtre: 2000, env: [0.5, 1, 0.85, 0.3] },
      sh_bas:  { inst: 'vox', vol: 0.09, oct: 3, plancher: 'Bb3', voyelle: 'eu', rev: 0.5, filtre: 150, env: [0.4, 1, 0.9, 0.3] },
      sh_mil:  { inst: 'vox', vol: 0.09, oct: 4, plancher: 'Bb4', voyelle: 'eu', rev: 0.5, filtre: 3000, env: [0.4, 1, 0.9, 0.3] },
      sh_haut: { inst: 'vox', vol: 0.09, oct: 5, plancher: 'Bb5', voyelle: 'eu', rev: 0.5, filtre: 3000, env: [0.4, 1, 0.9, 0.3] },
      pedale:  { inst: 'reese', vol: 0.07, desaccord: 10, chaleur: 1.5, pompe: true },
      batt:    { vol: 0.42, porte: 0.3, tenue: 0.25, rev: 0.25, filtre: 15000 }
    },
    sections: {
      // ── l'introduction, jouée une fois : ce qu'entend une décision du samedi ──
      chemise: {
        accords: ['Bbm', 'Bbm', 'Gb', 'F7'],
        ouvre: { batt: [300, 15000] },
        pas: [P4B, P3B[0], P2B, P1B],
        c1: ligne([[61, 2], [61, 1], [63, 1]]), c2: ligne([[58, 2], [58, 1], [60, 1]]), c3: ligne([[53, 2], [54, 1], [57, 1]]),
        pedale: ['Bb2 - - - - - - - - - - - - - - -', TENU, TENU, TENU],
        batt: ['T . T . T . T . T . T . T . T .', ROULE, 'T T T T T T T T s s s s s s s s', 'K s s s s s s s kz s s s S S S S']
      },
      // ── la boucle ──
      A: {
        accords: ['Bbm', 'Bbm', 'Bbm', 'Bbm', 'Gb/Bb', 'Gb/Bb', 'Ebm/Bb', 'Ebm/Bb', 'Cb/Bb', 'Cb/Bb', 'F7', 'F7'],
        pas: P6B,
        c1: ligne([[61, 4], [61, 2], [63, 2], [63, 2], [63, 2]]),
        c2: ligne([[58, 4], [58, 2], [58, 2], [59, 2], [60, 2]]),
        c3: ligne([[53, 4], [54, 2], [54, 2], [54, 2], [57, 2]]),
        pedale: ['Bb2 - - - - - - - - - - - - - - -', TENU, TENU, TENU],
        sh_mil: silences(4).concat(ligne([[70, 8]])),
        batt: ['Kx . . . . . . . . . . . . . . .', A_UN, A_UN, 'K . . . . . . . T . T . T T T T',
               A_UN, A_UN, A_UN, 'K . . . . . . . T T T T T T T T',
               A_UN, A_UN, A_UN, 'K . . . T T T T T T T T s s s s']
      },
      C: {
        accords: deuxFois(DOUZE),
        ouvre: { batt: [1500, 15000], c1: [600, 3200], c2: [600, 3200], c3: [600, 3200], sh_bas: [150, 3000], sh_haut: [3000, 300] },
        pas: fois(P3, 4).concat(fois([P2], 12)),
        // les pages 1 à 4 en quintes à vide (la ligne de la quinte seule, sous le chœur) ; la tierce et
        // la fondamentale entrent à la page 5 : la montée se remplit
        c1: silences(8).concat(pages(FOND.slice(4))), c2: silences(8).concat(pages(TIERCE.slice(4))), c3: pages(QUINTE),
        sh_bas: [RACINE, TENU], sh_mil: [RACINE, TENU], sh_haut: [RACINE, TENU],
        pedale: ['Bb2 - - - - - - - - - - - - - - -', TENU, TENU, TENU],
        batt: [C_PAGE.replace('K', 'Kx'), C_PAGE, C_PAGE, C_PAGE, C_PAGE, C_PAGE, C_PAGE, C_PAGE_R,
               C_PAGE, C_PAGE_R, C_PAGE, C_PAGE_R, C_PAGE, C_PAGE_R, C_PAGE, C_PAGE_R,
               C_VITE, C_VITE_R, C_VITE, C_VITE_R, C_VITE, C_VITE_R, C_VITE, 'K . s s s s s s s s s s S S S S']
      },
      D: {
        accords: ['Bbm', 'Bbm', 'Bm', 'Bm', 'Cm', 'Cm', 'C#m', 'C#m'],
        harmo: true,
        ouvre: { sh_haut: [3000, 1393] },
        pas: P1,
        lead: CRI,
        c1: pages(FOND.slice(0, 4)), c2: pages(TIERCE.slice(0, 4)), c3: pages(QUINTE.slice(0, 4)),
        sh_mil: [RACINE, TENU], sh_haut: [RACINE, TENU],
        pedale: ['Bb2 - - - - - - - - - - - - - - -', TENU],
        batt: [D_SOM_X, D_SOM_R, D_SOM_X, D_SOM_R, D_SOM_X, D_SOM_R, D_SOM_X, 'K s s s K s s s Kz s s s S S S S']
      },
      creux: {
        accords: ['Bbm', 'Bbm', 'Bbm', 'Bbm', 'Gb/Bb', 'Gb/Bb', 'F7', 'F7'],
        sh_mil: ['Bb4 - - - - - - - - - - - - - - -', TENU, TENU, '- - - - - - - - - - - - . . . .', SILENCE, SILENCE, SILENCE, SILENCE],
        c2: ligne([[null, 4], [58, 2], [60, 2]]),
        c3: ligne([[null, 4], [54, 2], [57, 2]]),
        pedale: ['Bb2 - - - - - - - - - - - - - - -', TENU, TENU, TENU, 'Bb2 - - - - - - - - - - - - - - -', TENU, TENU, TENU],
        pas: silences(7).concat(['. . . . . . . . Bb3 . . . Bb3 . . .']),
        // le tic qui compte, puis qui presse (blanches, noires, croches)
        batt: ['bx . . . . . . . . . . . . . . .', 'i . . . . . . . i . . . . . . .', 'i . . . . . . . i . . . . . . .',
               'i . . . i . . . i . . . i . . .', 'i . . . i . . . i . . . i . . .', 'i . . . i . . . i . . . i . . .',
               'i . i . i . i . i . i . i . i .', '. . . . . . . . T T T T T T T T']
      },
      B: {
        accords: ['Bbm', 'Bbm', 'Gb', 'F7', 'Bbm', 'Bbm', 'Cb', 'F7', 'Ebm', 'Bbm', 'Gb', 'F7', 'Ebm', 'F7', 'F7', 'F7'],
        pas: fois([P4B], 8).concat(fois(P3B, 2), silences(2)),
        lead: PROMESSE,
        c1: ligne([[61, 2], [61, 1], [63, 1], [61, 2], [63, 1], [63, 1], [63, 1], [61, 1], [61, 1], [63, 1], [63, 1], [63, 1], [null, 2]]),
        c2: ligne([[58, 2], [58, 1], [60, 1], [58, 2], [59, 1], [60, 1], [58, 1], [58, 1], [58, 1], [60, 1], [58, 1], [60, 1], [60, 2]]),
        c3: ligne([[53, 2], [54, 1], [57, 1], [53, 2], [54, 1], [57, 1], [54, 1], [53, 1], [54, 1], [57, 1], [54, 1], [57, 1], [null, 2]]),
        pedale: ['Bb2 - - - - - - - - - - - - - - -', TENU, TENU, TENU],
        batt: ['Kx . . . . . . . T . . . . . . .', C_PAGE, C_PAGE, 'K . . . . . . . T . T . s s s s',
               C_PAGE, C_PAGE, C_PAGE, 'K . . . T . . . s s s s s s s s',
               C_VITE, C_VITE, C_VITE, C_VITE_R, C_VITE, C_VITE_R,
               'K . . . . . . . . . . . . . . .', '. . . . . . . . . . . . T T T T']
      }
    },
    ordre: ['chemise', 'C', 'D', 'creux', 'B', 'A'], boucle: 1
  });
})(typeof FusibleAudio === 'object' ? FusibleAudio : require('../audio.js'));
