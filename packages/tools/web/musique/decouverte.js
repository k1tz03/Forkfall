/* ---------------------------------------------------------------------------
 * FUSIBLE — la bande originale : « Les Quartiers » (decouverte), le reste
 * d'une journée de découverte : un quartier qui s'ouvre, une pièce du dossier
 * de 1974 trouvée, une page d'album finie.
 *
 * La curiosité. Un arpège qui s'ouvre vraiment : à chaque section son filtre
 * s'éclaire et sa figure s'élargit (deux notes en croches, puis trois, puis
 * quatre en doubles croches sur deux octaves) — une porte qu'on pousse. Des
 * cloches graves, de bronze, qui sonnent la quinte comme un clocher de
 * quartier (pas la glace ni la boîte à musique : la pierre). Une montée
 * claire : la basse grimpe ré, mi, fa, sol, la ; un si bémol emprunté passe
 * comme une ombre, et c'est ce qui la garde de la naïveté. Ré dorien ; 108.
 *
 * L'air a sa démarche : une croche d'élan, une note longue, un regard plus
 * loin (« . . sol - do - - - - - - - mi »). Il ne chante que dans B et C ;
 * ailleurs l'arpège et les cloches.
 *
 *   porte     4 m.  (une fois) une cloche seule, l'arpège fermé, la basse, l'élan
 *   ── la boucle, 112 mesures, 4 min 09 ──
 *   A        16 m.  la curiosité : la basse monte d'un degré toutes les deux
 *                   mesures, l'arpège s'ouvre de quatre en quatre, les cloches
 *                   au début et au bout des phrases
 *   B        16 m.  le quartier s'ouvre : l'air (la croche d'élan, la note
 *                   longue), la caisse claire, la basse redescend do, si, la
 *   ruelle   16 m.  le creux : le dossier de 1974 ; les cloches seules, une voix
 *                   « o », l'arpège fermé ; sol mineur et la majeur, l'ombre ;
 *                   quatre mesures pour repartir
 *   A2       16 m.  la curiosité encore : l'arpège à cinq contre quatre, la basse
 *                   qui pousse, les cloches en carillon
 *   C        16 m.  la vue d'en haut : l'air monté d'un cran, la grosse caisse
 *                   à chaque temps, la caisse « gated », une grande scie
 *   C2        8 m.  le sommet : les cloches doublent l'air, l'harmonie dessous
 *   descente 16 m.  la retombée : la basse redescend la gamme, l'air en notes
 *                   longues à la quinte, l'arpège se referme
 *   retour    8 m.  la cloche, la basse qui remonte, la relance
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
  function silences(n) { var l = []; for (var i = 0; i < n; i++) l.push(SILENCE); return l; }
  function fois(n, l) { var r = []; for (var i = 0; i < n; i++) r = r.concat(l); return r; }

  // ── L'ARPÈGE QUI S'OUVRE : deux notes, trois, quatre, puis deux octaves ──
  var ARP1 = '1 . 5 . 1 . 5 . 1 . 5 . 1 . 5 .';
  var ARP2 = '1 . 5 . 8 . 5 . 1 . 5 . 8 . 5 .';
  var ARP3 = '1 . 5 8 . 5 1 . 5 8 . 5 9 . 8 5';
  var ARP4 = '1 5 8 9 8 5 1 5 8 9 8 5 1 5 8 9';
  var ARP_CINQ = '1 5 8 9 5 1 5 8 9 5 1 5 8 9 5 8';     // cinq notes contre quatre temps
  var OUVERTURE = fois(4, [ARP1]).concat(fois(4, [ARP2]), fois(4, [ARP3]), fois(4, [ARP4]));

  // ── les cloches : la quinte du clocher, et le carillon de quatre notes ──
  var GLAS = '1 - - - - - - - 5 - - - - - - -';
  var CARILLON = 'A4 - - - D5 - - - E5 - - - A4 - - -';
  var CARILLON2 = 'D5 - - - A4 - - - E5 - - - D5 - - -';

  // ── la basse : la note longue, les noires, puis le pouls ──
  var POULS = 'R . R . 8 . R . R . R . 8 . 5 .';
  var POULS2 = 'R . R 8 . R 8 . R . R 8 . R 8 5';
  var NOIRES = 'R . . . R . . . R . . . R . . .';
  var BLANCHES = 'R - - - - - - - R - - - - - - -';

  // ── L'AIR : une croche d'élan, une note longue, un regard plus loin ──
  var AIR_B = [
    '. . G4 - C5 - - - - - - - E5 - - -',
    '- - - - - - - - D5 - - - - - - -',
    '. . G4 - B4 - - - - - - - D5 - - -',
    '- - - - - - - - C5 - - - - - - -',
    '. . E4 - A4 - - - - - - - C5 - - -',
    '- - - - - - - - B4 - - - - - - -',
    '. . C5 - F5 - - - - - - - A5 - - -',
    '- - - - - - - - B5 - - - - - - -',
    '. . E5 - G5 - - - - - - - B5 - - -',
    '- - - - - - - - A5 - - - G5 - - -',
    '. . D5 - G5 - - - - - - - A5 - - -',
    '- - - - - - - - B5 - - - - - - -',
    '. . C6 - - - - - B5 - - - A5 - - -',
    'B5 - - - - - - - A5 - - - - - - -',
    SILENCE,
    SILENCE
  ];
  // la vue d'en haut : le même pas, un cran plus haut, le si bémol qui passe
  var AIR_C = [
    '. . C5 - F5 - - - - - - - A5 - - -',
    '- - - - - - - - B5 - - - D6 - - -',
    'C6 - - - - - - - - - - - B5 - A5 -',
    'E5 - - - - - - - . . . . . . . .',
    '. . A5 - C6 - - - - - - - A5 - - -',
    '- - - - - - - - B5 - - - G5 - - -',
    '. . E5 - G5 - - - - - - - B5 - - -',
    '- - - - - - - - - - - - . . . .',
    '. . D5 - F5 - - - - - - - A5 - - -',
    '- - - - - - - - G5 - - - E5 - - -',
    '. . F5 - A5 - - - - - - - C6 - - -',
    '- - - - - - - - B5 - - - - - - -',
    '. . D6 - - - C6 - - - Bb5 - - - A5 -',
    'G5 - - - - - - - E5 - - - - - - -',
    'D5 - - - - - - - - - - - . . . .',
    SILENCE
  ];
  // la descente : des notes longues, à la quinte de la basse qui redescend
  var AIR_DESCENTE = [
    'A5 - - - - - - - - - - - - - - -', 'G5 - - - - - - - - - - - - - - -',
    'F5 - - - - - - - - - - - - - - -', 'E5 - - - - - - - - - - - - - - -',
    'D5 - - - - - - - - - - - - - - -', 'C5 - - - - - - - - - - - - - - -',
    'B4 - - - - - - - - - - - - - - -', 'C#5 - - - - - - - - - - - . . . .'
  ].concat(silences(8));

  // ── la voix du creux, et les cloches du dossier ──
  var VOIX_RUELLE = [
    'D4 - - - - - - - - - - - - - - -', TENU, 'F4 - - - - - - - - - - - - - - -', TENU,
    'F4 - - - - - - - - - - - - - - -', TENU, 'D4 - - - - - - - - - - - - - - -', TENU,
    'Bb4 - - - - - - - - - - - - - - -', TENU, 'C#5 - - - - - - - - - - - - - - -', 'A4 - - - - - - - - - - - - - - -',
    SILENCE, SILENCE, SILENCE, SILENCE
  ];
  var CLOCHES_RUELLE = [GLAS, SILENCE, SILENCE, SILENCE, CARILLON2, SILENCE, GLAS, SILENCE,
                        GLAS, SILENCE, '1 - - - - - - - 3 - - - - - - -', SILENCE, CARILLON, SILENCE, GLAS, SILENCE];

  // ── la batterie : un pas léger, puis la caisse, puis quatre au sol ──
  var D_PAS = 'k . h . r . h . k . h . r . h .';
  var D_PAS_X = 'kx . h . r . h . k . h . r . h .';
  var D_PAS_FIN = 'k . h . r . h . kz . t . t . T T';
  var D_OUVERT = 'k . h . s . h . k . h k s . h .';
  var D_OUVERT_X = 'kx . h . s . h . k . h k s . h .';
  var D_OUVERT_FIN = 'k . h . s . h . kz . t . t T s s';
  var D_HAUT = 'k . h . kS . h . k . h . kS . h .';
  var D_HAUT_X = 'kx . h . kS . h . k . h . kS . h .';
  var D_HAUT_FIN = 'k . h . kS . h . kz . t . t T S S';

  function phrases(x, n, fin8, fin) {
    return [x, n, n, n, n, n, n, fin8, x, n, n, n, n, n, n, fin];
  }

  A.theme('decouverte', {
    titre: 'Les Quartiers', moment: "un quartier qui s'ouvre, une pièce du dossier, une page d'album (le reste du jour)",
    tonalite: 'ré dorien',
    humeur: "la curiosité : un arpège qui s'ouvre, des cloches de bronze, une montée claire",
    ville: true,
    bpm: 108, gain: 1.52,
    pompe: { prof: 0.5, rel: 0.22 },
    echo: { pas: 3, retour: 0.38, coupe: 2800 },
    salle: { taille: 0.75, duree: 3, ton: 4200 },
    cassette: { sature: 1, coupe: 10500, bas: 45, souffle: 0.004, flotte: { prof: 3, vit: 0.33 } },
    voix: {
      lead:   { inst: 'lead', vol: 0.12, echo: 0.3, rev: 0.32, flotte: { prof: 6, vit: 0.5 }, pan: 0.05 },
      harmo:  { inst: 'lead', vol: 0.045, echo: 0.15, rev: 0.32, pan: -0.3 },
      arp:    { inst: 'saw', vol: 0.072, oct: 4, filtre: 3500, ton: [3000, 1200, 0.08], env: [0.003, 0.12, 0.3, 0.06],
                echo: 0.35, rev: 0.2, pompe: true, pan: 0.25 },
      cloche: { inst: 'cloche', vol: 0.12, oct: 3, rev: 0.5, echo: 0.15, pan: -0.15 },
      nappe:  { inst: 'nappe', vol: 0.085, oct: 3, rev: 0.35, pompe: true, flotte: { prof: 8, vit: 0.4 }, filtre: 2600 },
      grande: { inst: 'supersaw', vol: 0.075, oct: 3, scies: 5, desaccord: 16, large: 0.85, rev: 0.38, pompe: true,
                filtre: 3600, env: [0.2, 0.8, 0.85, 0.3] },
      voixo:  { inst: 'vox', vol: 0.07, voyelle: 'o', vers: 'ou', rev: 0.55, echo: 0.1, pan: 0.12 },
      basse:  { inst: 'basse', vol: 0.1, oct: 2, pompe: true, drive: 1.4, filtre: 2200, ton: [1800, 600, 0.06] },
      batt:   { vol: 0.48, porte: 0.45, tenue: 0.22, rev: 0.18, filtre: 11000 }
    },
    sections: {
      // ── l'introduction, jouée une fois : on pousse la porte ──
      porte: {
        accords: ['Dm7', 'Dm7', 'Bbmaj7', 'Asus4 A'],
        ouvre: { arp: [400, 1400], nappe: [800, 2600] },
        cloche: [GLAS, SILENCE, CARILLON2, SILENCE],
        arp: [SILENCE, ARP1, ARP1, ARP2],
        nappe: [SILENCE, NAPPE, NAPPE, NAPPE2],
        basse: [SILENCE, SILENCE, BLANCHES, NOIRES],
        batt: [SILENCE, SILENCE, 'k . . . r . . . k . . . r . . .', 'k . h . r . h . kz . t . t . T T']
      },
      // ── la boucle ──
      A: {
        accords: ['Dm7', 'Dm7', 'Em7', 'Em7', 'Fmaj7', 'Fmaj7', 'G', 'G',
                  'Am7', 'Am7', 'Bbmaj7', 'C', 'Dm7', 'Em7', 'Fmaj7', 'Gsus4 G'],
        ouvre: { arp: [500, 4000] },
        arp: OUVERTURE,
        basse: fois(4, [BLANCHES]).concat(fois(4, [NOIRES]), fois(8, [POULS])),
        cloche: [GLAS, SILENCE, SILENCE, CARILLON, GLAS, SILENCE, SILENCE, CARILLON,
                 GLAS, SILENCE, SILENCE, SILENCE, GLAS, SILENCE, SILENCE, CARILLON2],
        nappe: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE2],
        batt: phrases(D_PAS_X, D_PAS, D_PAS, D_PAS_FIN)
      },
      B: {
        accords: ['Cmaj7', 'Cmaj7', 'G/B', 'G/B', 'Am7', 'Am7', 'Fmaj7', 'G',
                  'Cmaj7', 'Cmaj7', 'G/B', 'G/B', 'Am7', 'Dm7', 'Fmaj7 G', 'Asus4'],
        lead: AIR_B,
        arp: ARP3,
        basse: POULS,
        cloche: [GLAS, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE, CARILLON,
                 GLAS, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE, CARILLON2],
        nappe: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE, NAPPE2, NAPPE],
        batt: phrases(D_OUVERT_X, D_OUVERT, D_OUVERT, D_OUVERT_FIN)
      },
      // le creux : le dossier de 1974 (sol mineur et la majeur : l'ombre)
      ruelle: {
        accords: ['Dm7', 'Dm7', 'Dm7', 'Dm7', 'Bbmaj7', 'Bbmaj7', 'Bbmaj7', 'Bbmaj7',
                  'Gm7', 'Gm7', 'A', 'A', 'Dm7', 'Dm7', 'Em7', 'Fmaj7'],
        ouvre: { arp: [450, 900], basse: [400, 1400], nappe: [700, 1300] },
        cloche: CLOCHES_RUELLE,
        voixo: VOIX_RUELLE,
        arp: fois(12, [ARP1]).concat([ARP1, ARP2, ARP2, ARP3]),
        basse: [RACINE, TENU, TENU, TENU, RACINE, TENU, TENU, TENU, RACINE, TENU, RACINE, TENU,
                NOIRES, NOIRES, POULS, POULS],
        nappe: silences(12).concat([NAPPE, TENU, NAPPE, NAPPE]),
        batt: ['kx . . . . . . . . . . . . . . .'].concat(silences(11),
               ['k . . . r . . . k . . . r . . .', 'k . . . r . . . k . . . r . . .', D_PAS, D_PAS_FIN])
      },
      A2: {
        copie: 'A',
        arp: fois(4, [ARP2]).concat(fois(4, [ARP3]), fois(8, [ARP_CINQ])),
        basse: fois(4, [NOIRES]).concat(fois(4, [POULS]), fois(8, [POULS2])),
        cloche: [GLAS, SILENCE, SILENCE, CARILLON, GLAS, SILENCE, CARILLON2, SILENCE,
                 GLAS, SILENCE, SILENCE, CARILLON, GLAS, SILENCE, CARILLON2, CARILLON],
        batt: phrases(D_PAS_X, D_PAS, D_PAS_FIN, D_OUVERT_FIN)
      },
      // la vue d'en haut
      C: {
        accords: ['Fmaj7', 'G', 'Am7', 'Am7', 'Fmaj7', 'G', 'Cmaj7', 'Cmaj7',
                  'Bbmaj7', 'C', 'Dm7', 'Dm7', 'Bbmaj7', 'C', 'Asus4', 'A'],
        lead: AIR_C,
        arp: ARP4,
        basse: POULS2,
        grande: [NAPPE, NAPPE, NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU, NAPPE, NAPPE, NAPPE, NAPPE],
        cloche: [GLAS, SILENCE, SILENCE, SILENCE, GLAS, SILENCE, SILENCE, CARILLON,
                 GLAS, SILENCE, SILENCE, SILENCE, GLAS, SILENCE, SILENCE, SILENCE],
        batt: phrases(D_HAUT_X, D_HAUT, D_HAUT, D_HAUT_FIN)
      },
      // le sommet : les cloches doublent l'air, l'harmonie dessous
      C2: {
        accords: ['Fmaj7', 'G', 'Am7', 'Am7', 'Fmaj7', 'G', 'Cmaj7', 'Cmaj7'],
        harmo: true,
        lead: AIR_C.slice(0, 8),
        cloche: AIR_C.slice(0, 8),
        arp: ARP4,
        basse: POULS2,
        grande: [NAPPE, NAPPE, NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU],
        batt: [D_HAUT_X, D_HAUT, D_HAUT, D_HAUT, D_HAUT_X, D_HAUT, D_HAUT, D_OUVERT_FIN]
      },
      // la retombée : la gamme redescend, l'arpège se referme
      descente: {
        accords: ['Dm7', 'Cmaj7', 'Bbmaj7', 'Am7', 'Gm7', 'Fmaj7', 'Em7', 'A',
                  'Dm7', 'Dm7', 'Bbmaj7', 'Bbmaj7', 'Gm7', 'Gm7', 'Asus4', 'A'],
        ouvre: { arp: [3600, 700] },
        lead: AIR_DESCENTE,
        arp: fois(4, [ARP4]).concat(fois(4, [ARP3]), fois(4, [ARP2]), fois(4, [ARP1])),
        basse: fois(8, [POULS]).concat(fois(4, [NOIRES]), fois(4, [BLANCHES])),
        nappe: [NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE],
        cloche: [GLAS, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE, SILENCE,
                 GLAS, SILENCE, CARILLON2, SILENCE, GLAS, SILENCE, SILENCE, SILENCE],
        batt: [D_OUVERT_X, D_OUVERT, D_OUVERT, D_OUVERT, D_OUVERT, D_OUVERT, D_OUVERT, D_OUVERT_FIN,
               D_PAS_X, D_PAS, D_PAS, D_PAS, 'k . . . r . . . k . . . r . . .', 'k . . . r . . . k . . . r . . .',
               'k . . . r . . . k . . . r . . .', 'k . h . r . h . kz . t . t . T T']
      },
      retour: {
        accords: ['Dm7', 'Dm7', 'Em7', 'Em7', 'Fmaj7', 'G', 'Asus4', 'A'],
        ouvre: { arp: [600, 1800] },
        cloche: [GLAS, SILENCE, SILENCE, SILENCE, CARILLON, SILENCE, SILENCE, SILENCE],
        arp: [ARP1, ARP1, ARP2, ARP2, ARP2, ARP3, ARP3, ARP3],
        basse: [BLANCHES, BLANCHES, NOIRES, NOIRES, POULS, POULS, POULS, POULS],
        nappe: [NAPPE, TENU, NAPPE, TENU, NAPPE, NAPPE, NAPPE, NAPPE],
        batt: [D_PAS_X, D_PAS, D_PAS, D_PAS, D_PAS, D_PAS, D_PAS, D_PAS_FIN]
      }
    },
    ordre: ['porte', 'A', 'B', 'ruelle', 'A2', 'C', 'C2', 'descente', 'retour'], boucle: 1
  });
})(typeof FusibleAudio === 'object' ? FusibleAudio : require('../audio.js'));
