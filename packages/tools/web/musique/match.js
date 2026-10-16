/* ---------------------------------------------------------------------------
 * FUSIBLE — la bande originale : « La Rive » (match), le samedi au stade.
 *
 * La poussée. Quatre temps au sol ; une basse qui cogne à contretemps (elle
 * pousse entre les coups de grosse caisse, puis roule en doubles croches) ; et
 * la tribune : un mur de voix « oh » qui respire avec la grosse caisse, un
 * chant en valeurs longues (une quinte qui monte, un saut d'octave), trois
 * stabs qui lui répondent au bout des phrases. Ce qui
 * n'appartient qu'à ce thème : les montées — la caisse claire qui accélère
 * (noires, croches, doubles croches, la caisse « gated »), le filtre qui
 * s'ouvre, la tribune qui se lève (« oh » qui devient « ah »), un dernier temps
 * où seul le souffle monte — et la retombée sur la grosse caisse et la cymbale.
 * Mi mineur (i, VI, III, VII : l'hymne ; si majeur pour pousser) ; 128.
 *
 *   entree    4 m.  (une fois) les grilles : les toms qui roulent, la foule
 *                   qui monte, la basse qui s'ouvre, un roulement
 *   ── la boucle, 104 mesures, 3 min 15 ──
 *   A        16 m.  l'échauffement : la basse à contretemps, le charleston, la
 *                   foule qui s'éclaire ; les claps entrent à la neuvième mesure
 *   B         8 m.  la tribune : le chant, les stabs qui répondent au bout des phrases
 *   B2        8 m.  le chant harmonisé, les stabs
 *   montee    8 m.  la montée : noires, croches, doubles croches, la caisse
 *                   « gated », le souffle ; la foule se lève
 *   C        16 m.  la poussée, le sommet : la basse qui roule, le chant en
 *                   valeurs longues puis le chant entier, harmonisé
 *   mitemps   8 m.  le creux : la basse seule et fermée, la foule qui murmure,
 *                   le carillon du stade
 *   reprise   8 m.  le retour des vestiaires : la grosse caisse revient, la basse
 *                   s'ouvre, la tribune rappelle
 *   A2        8 m.  la seconde mi-temps : la basse qui double ses coups, l'arpège
 *                   à trois contre quatre, l'appel de la tribune
 *   montee2   8 m.  la montée, aux toms
 *   C2        8 m.  le dernier quart d'heure : le chant harmonisé, la reese sous
 *                   la basse ; le second sommet
 *   sortie    8 m.  la sortie : la basse se referme, la réponse des stabs, la relance
 *
 * Toutes les sections du corps partent d'un premier temps franc (grosse caisse
 * et cymbale, la basse dans la mesure) : le thème peut reprendre à chacune.
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

  // LE CHANT de la tribune, sur « Em C G D Em C Am B » : la quinte qui monte,
  // le saut d'octave, et le ré dièse qui ramène au mi
  var CHANT = [
    'E4 - - - B4 - - - - - - - A4 - G4 -',
    'G4 - - - - - - - E4 - - - - - - -',
    'D4 - - - D5 - - - - - - - C5 - B4 -',
    'A4 - - - - - - - - - - - . . . .',
    'E4 - - - B4 - - - - - - - A4 - G4 -',
    'G4 - - - - - - - C5 - - - - - - -',
    'C5 - - - B4 - - - A4 - - - G4 - - -',
    'F#4 - - - - - - - D#4 - - - - - . .'
  ];
  // le chant en valeurs longues, sur « Em C G D » deux fois : la tribune debout
  var CHANT_HAUT = [
    'B4 - - - - - - - - - - - - - - -',
    'C5 - - - - - - - G4 - - - - - - -',
    'D5 - - - - - - - - - - - B4 - - -',
    'A4 - - - - - - - F#4 - - - - - - -',
    'G4 - - - - - - - B4 - - - - - - -',
    'E5 - - - - - - - - - - - D5 - C5 -',
    'D5 - - - - - - - B4 - - - G4 - - -',
    'A4 - - - - - - - - - - - . . . .'
  ];
  // l'appel : la tribune rappelle les joueurs (sur si majeur, puis la mineur et si)
  var RAPPEL = ['F#4 - - - B4 - - - - - - - . . . .', 'D#5 - - - - - - - - - - - . . . .'];
  var APPEL = ['E5 - - - - - - - C5 - - - - - - -', 'A4 - - - - - - - - - - - . . . .',
               'B4 - - - - - - - D#5 - - - - - - -', 'B4 - - - - - - - - - - - . . . .'];
  // le carillon du stade, à la mi-temps (mi mineur, en descendant)
  var CARILLON = 'B4 - - - G4 - - - E4 - - - - - - -';

  // LA BASSE : à contretemps (elle pousse entre les coups), puis elle roule
  var B_POUSSE = '. . R . . . 8 . . . R . . . 8 .';
  var B_POUSSE2 = '. . R . . . 8 . . . R . . R 8 .';
  var B_DOUBLE = '. . R R . . 8 . . . R R . . 8 8';
  var B_ROULE = '. R 8 R . R 8 R . R 8 R . R 8 R';
  var B_ROULE2 = '. R 8 R . R 8 R . R 8 R . 8 R 8';
  var B_COGNE = 'R . . . R . . . R . . . R . . .';
  var B_HUIT = 'R . R . R . R . R . R . R . R .';
  var B_SEIZE = 'R R R R R R R R R R R R R R R R';

  var STAB_TRIBUNE = '. . . . . . X . . . . . . . . .';
  var STAB_POUSSE = '. . X . . . . . . . X . . . X .';
  var ARP_TROIS = '8 5 3 8 5 3 8 5 3 8 5 3 8 5 3 5';   // trois notes contre quatre temps

  // LA BATTERIE : quatre au sol, le charleston à contretemps avec la basse
  var D_SOL = 'k . h . k . h . k . h . k . h .';
  var D_SOL_X = 'Kx . h . k . h . k . h . k . h .';
  var D_CLAP = 'k . h . kc . h . k . h . kc . h .';
  var D_CLAP_X = 'Kx . h . kc . h . k . h . kc . h .';
  var STAB_REPONSE = '. . . . . . . . X . X . X . . .';     // la réponse au bout des phrases du chant
  var D_DROP = 'k . h h kc . o . k . h h kc . o .';
  var D_DROP_X = 'Kx . h h kc . o . k . h h kc . o .';
  var D_RELANCE = 'k . h . kc . h . kz . t . T . t T';        // le souffle sur la seconde moitié, les toms
  var D_RELANCE_C = 'k . h h kc . o . kz . t t T . T T';
  // les montées : la caisse qui accélère, et le dernier temps où seul le souffle monte
  var MONTEE = [
    'Kx . . . k . . . k . . . k . . .',
    'k . . . kS . . . k . . . kS . . .',
    'k . s . k . s . k . s . k . s .',
    'k . s . k . s . k . s . k . s s',
    'k s s s k s s s k s s s k s s s',
    'k s s s k s s s k s s s k s s s',
    'kS s S s kS s S s kS s S s kS s S s',
    'S s S s S s S s kzS s S s . . . .'
  ];
  var MONTEE_TOMS = [
    'Kx . . . k . . . k . . . k . . .',
    'k . . . kt . . . k . . . kt . . .',
    'k . t . k . t . k . t . k . t .',
    'k . t . k . t . k . t . k . t t',
    'k t t t k t t t k t t t k t t t',
    'k t t T k t t T k t t T k t T T',
    'kS t S t kS t S t kS t S t kS T S T',
    'S t S t S t S t kzS t S t . . . .'
  ];

  A.theme('match', {
    titre: 'La Rive', moment: 'le samedi au stade', tonalite: 'mi mineur',
    humeur: 'quatre temps au sol, une basse qui pousse à contretemps, la tribune qui chante, les montées',
    bpm: 128, gain: 1.38,
    pompe: { prof: 0.6, rel: 0.14 },
    echo: { pas: 3, retour: 0.3, coupe: 3200 },
    salle: { taille: 0.85, duree: 2.2, ton: 4800 },
    cassette: { sature: 1.3, coupe: 11500, bas: 70, souffle: 0.003, flotte: { prof: 2, vit: 0.6 } },
    voix: {
      lead:   { inst: 'vox', vol: 0.2, voyelle: 'a', vers: 'e', rev: 0.35, echo: 0.12, flotte: { prof: 5, vit: 0.5 }, env: [0.05, 0.4, 0.9, 0.25], pan: 0.05 },
      harmo:  { inst: 'vox', vol: 0.1, voyelle: 'o', rev: 0.4, flotte: { prof: 5, vit: 0.5 }, env: [0.05, 0.4, 0.9, 0.25], pan: -0.25 },
      foule:  { inst: 'vox', vol: 0.18, oct: 3, plancher: 'G3', voyelle: 'o', vers: 'a', rev: 0.45, pompe: true, filtre: 2600, env: [0.35, 0.8, 0.9, 0.3] },
      cloche: { inst: 'cloche', vol: 0.07, echo: 0.4, rev: 0.4, pan: 0.2 },
      arp:    { inst: 'pluck2', vol: 0.055, oct: 4, echo: 0.35, rev: 0.1, pompe: true, pan: 0.3, filtre: 3400 },
      stab:   { inst: 'stab', vol: 0.12, oct: 4, echo: 0.2, rev: 0.2, pompe: true, pan: -0.15, filtre: 5000 },
      reese:  { inst: 'reese', vol: 0.07, oct: 2, plancher: 'A2', desaccord: 12, pompe: true },
      basse:  { inst: 'basse', vol: 0.055, oct: 2, plancher: 'E2', pompe: true, drive: 2.2, filtre: 2200, ton: [2400, 1000, 0.06] },
      batt:   { vol: 0.28, porte: 0.45, tenue: 0.2, rev: 0.12, drive: 1.8, filtre: 15000 }
    },
    sections: {
      // ── l'introduction, jouée une fois ──
      entree: {
        accords: ['Em', 'Em', 'Em', 'B'],
        ouvre: { foule: [600, 2600], basse: [300, 1800] },
        foule: [NAPPE, TENU, NAPPE, NAPPE],
        basse: [SILENCE, SILENCE, B_HUIT, B_SEIZE],
        batt: ['T . . t . . T . . . t . T . t .', 'T . . t . . T . . . t . T t T t',
               'K . . t . . T . k . t . T . t .', 'K . s s k . s s kz s s s S S S S']
      },
      // ── la boucle ──
      A: {
        accords: ['Em', 'Em', 'C', 'C', 'G', 'G', 'D', 'D', 'Em', 'Em', 'C', 'C', 'Am', 'Am', 'B', 'B'],
        ouvre: { basse: [900, 1800], foule: [1400, 2600] },
        basse: B_POUSSE,
        foule: [NAPPE, TENU],
        stab: [STAB_TRIBUNE, STAB_TRIBUNE, STAB_TRIBUNE, STAB_TRIBUNE, STAB_TRIBUNE, STAB_TRIBUNE, STAB_TRIBUNE, STAB_TRIBUNE,
               STAB_POUSSE, STAB_POUSSE, STAB_POUSSE, STAB_POUSSE, STAB_POUSSE, STAB_POUSSE, STAB_POUSSE, SILENCE],
        batt: [D_SOL_X, D_SOL, D_SOL, D_SOL, D_SOL, D_SOL, D_SOL, 'k . h . k . h . k . h . k . t T',
               D_CLAP_X, D_CLAP, D_CLAP, D_CLAP, D_CLAP, D_CLAP, D_CLAP, D_RELANCE]
      },
      B: {
        accords: ['Em', 'C', 'G', 'D', 'Em', 'C', 'Am', 'B'],
        lead: CHANT,
        basse: B_POUSSE2,
        foule: NAPPE,
        stab: [STAB_TRIBUNE, STAB_TRIBUNE, STAB_TRIBUNE, STAB_REPONSE, STAB_TRIBUNE, STAB_TRIBUNE, STAB_TRIBUNE, STAB_REPONSE],
        batt: [D_CLAP_X, D_CLAP, D_CLAP, D_CLAP, D_CLAP, D_CLAP, D_CLAP, D_CLAP]
      },
      B2: {
        copie: 'B', harmo: true,
        stab: [STAB_TRIBUNE, STAB_TRIBUNE, STAB_TRIBUNE, STAB_REPONSE, STAB_TRIBUNE, STAB_TRIBUNE, STAB_TRIBUNE, STAB_TRIBUNE],
        batt: [D_CLAP_X, D_CLAP, D_CLAP, D_CLAP, D_CLAP, D_CLAP, D_CLAP, D_RELANCE]
      },
      montee: {
        accords: ['Am', 'Am', 'C', 'C', 'D', 'D', 'B', 'B'],
        ouvre: { basse: [350, 2200], batt: [2500, 15000], foule: [800, 2600] },
        basse: [B_COGNE, B_COGNE, B_HUIT, B_HUIT, B_SEIZE, B_SEIZE, B_SEIZE, B_SEIZE],
        foule: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU],
        batt: MONTEE
      },
      C: {
        accords: ['Em', 'C', 'G', 'D', 'Em', 'C', 'G', 'D', 'Em', 'C', 'G', 'D', 'Em', 'C', 'Am', 'B'],
        harmo: true,
        lead: CHANT_HAUT.concat(CHANT),
        basse: B_ROULE,
        reese: [RACINE, RACINE, RACINE, RACINE, RACINE, RACINE, RACINE, RACINE].concat(silences(8)),
        arp: silences(8).concat([ARP_TROIS, ARP_TROIS, ARP_TROIS, ARP_TROIS, ARP_TROIS, ARP_TROIS, ARP_TROIS, ARP_TROIS]),
        foule: NAPPE,
        stab: [STAB_POUSSE, STAB_POUSSE, STAB_POUSSE, STAB_POUSSE, STAB_POUSSE, STAB_POUSSE, STAB_POUSSE, STAB_REPONSE,
               STAB_POUSSE, STAB_POUSSE, STAB_POUSSE, STAB_REPONSE, STAB_POUSSE, STAB_POUSSE, STAB_POUSSE, STAB_POUSSE],
        batt: [D_DROP_X, D_DROP, D_DROP, D_DROP, D_DROP, D_DROP, D_DROP, D_DROP,
               D_DROP_X, D_DROP, D_DROP, D_DROP, D_DROP, D_DROP, D_DROP, D_RELANCE_C]
      },
      mitemps: {
        accords: ['Em', 'Em', 'Cmaj7', 'Cmaj7', 'Am', 'Am', 'B7', 'B7'],
        ouvre: { basse: [600, 1400] },
        reese: [RACINE, TENU, RACINE, TENU, RACINE, TENU, SILENCE, SILENCE],
        basse: silences(6).concat([B_COGNE, B_HUIT]),
        foule: [NAPPE, TENU],
        cloche: [SILENCE, CARILLON, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE],
        arp: [SILENCE, SILENCE, '1 . . . 5 . . . 8 . . . . . . .', SILENCE, '1 . . . 5 . . . 8 . . . . . . .', SILENCE,
              '1 . . . 5 . . . 8 . . . 5 . . .', '1 . . . 5 . . . 8 . . . 5 . 3 .'],
        batt: ['Kx . . . . . . . . . . . . . . .', SILENCE, 'k . . . . . . . . . . . . . . .', '. . . . . . . . . . . . i . i .',
               'k . . . . . . . k . . . . . . .', '. . . . . . . . . . . . i . i .',
               'k . . . k . . . k . . . k . . .', 'k . . . k . . . k . h . k . h h']
      },
      reprise: {
        accords: ['Em', 'Em', 'C', 'C', 'G', 'G', 'B', 'B'],
        ouvre: { basse: [400, 1800] },
        basse: B_POUSSE,
        foule: [NAPPE, TENU],
        lead: silences(6).concat(RAPPEL),
        batt: [D_SOL_X, D_SOL, D_SOL, D_SOL, D_CLAP, D_CLAP, D_CLAP, D_RELANCE]
      },
      A2: {
        accords: ['Em', 'Em', 'C', 'C', 'Am', 'Am', 'B', 'B'],
        basse: B_DOUBLE,
        arp: ARP_TROIS,
        stab: [STAB_TRIBUNE, STAB_TRIBUNE, STAB_TRIBUNE, STAB_REPONSE, STAB_TRIBUNE, STAB_TRIBUNE, STAB_TRIBUNE, STAB_TRIBUNE],
        foule: [NAPPE, TENU],
        lead: silences(4).concat(APPEL),
        batt: [D_CLAP_X, D_CLAP, D_CLAP, D_CLAP, D_CLAP, D_CLAP, D_CLAP, D_RELANCE]
      },
      montee2: {
        copie: 'montee',
        accords: ['C', 'C', 'D', 'D', 'Em', 'Em', 'B', 'B'],
        batt: MONTEE_TOMS
      },
      C2: {
        accords: ['Em', 'C', 'G', 'D', 'Em', 'C', 'Am', 'B'],
        harmo: true,
        lead: CHANT,
        basse: B_ROULE2,
        reese: RACINE,
        foule: NAPPE,
        stab: [STAB_POUSSE, STAB_POUSSE, STAB_POUSSE, STAB_REPONSE, STAB_POUSSE, STAB_POUSSE, STAB_POUSSE, STAB_POUSSE],
        batt: [D_DROP_X, D_DROP, D_DROP, D_DROP, D_DROP, D_DROP, D_DROP, D_RELANCE_C]
      },
      sortie: {
        accords: ['Em', 'Em', 'C', 'C', 'Am', 'Am', 'B', 'B'],
        ouvre: { basse: [1800, 600] },
        basse: B_POUSSE,
        foule: [NAPPE, TENU, NAPPE, TENU, SILENCE, SILENCE, SILENCE, SILENCE],
        lead: [CHANT[0], CHANT[1], SILENCE, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE],
        stab: [SILENCE, SILENCE, SILENCE, STAB_REPONSE, SILENCE, SILENCE, SILENCE, SILENCE],
        batt: [D_CLAP_X, D_CLAP, D_CLAP, D_CLAP, D_SOL, D_SOL, D_SOL, D_RELANCE]
      }
    },
    ordre: ['entree', 'A', 'B', 'B2', 'montee', 'C', 'mitemps', 'reprise', 'A2', 'montee2', 'C2', 'sortie'], boucle: 1
  });
})(typeof FusibleAudio === 'object' ? FusibleAudio : require('../audio.js'));
