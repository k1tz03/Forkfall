/* ---------------------------------------------------------------------------
 * FUSIBLE — la bande originale : « Le Dernier Tour » (fin), l'écran de fin
 * d'une carrière, et l'épilogue de 2050 du dossier de 1974.
 *
 * La mélancolie : la dernière chanson de la soirée, le slow qu'on danse quand
 * la salle se vide. En douze-huit : un `swing` de deux tiers fait des trois
 * premières doubles croches de chaque temps un triolet exact (on n'écrit que
 * les cases 0, 1 et 2 de chaque temps), et la case 3 se tait. Une basse ronde, un
 * piano électrique qui égrène l'accord en triolets, une nappe large ; un lead
 * en larmes qui prend son élan d'une croche et glisse d'une quarte vers le
 * haut, puis retombe. Et la cassette qui fatigue : au second couplet et dans
 * le creux, le lead passe sur une bande deux fois plus flottante. La mineur ; 80.
 *
 * Deux souvenirs, à la boîte à musique désaccordée : l'introduction rejoue
 * La Mèche (l'ancien thème de l'accueil, que ce fichier garde) ; la dernière
 * section joue une seule fois l'accroche de « Fusible » (do, si, mi, sol
 * dièse), deux fois plus lente — la dernière image avant que tout reparte.
 *
 *   souvenir  4 m.  (une fois) la boîte à musique seule : La Mèche
 *   ── la boucle, 64 mesures, 3 min 12 ──
 *   A        16 m.  la dernière chanson : la basse ronde, le slow en triolets,
 *                   le piano qui égrène ; le lead en larmes (l'élan, la glissade)
 *   B         8 m.  le refrain : le plus haut, fa, mi 7 sur sol dièse, la mineur
 *   creux     8 m.  la bande fatigue : plus de batterie, la nappe, la basse
 *                   longue, le lead usé en notes longues
 *   A2       16 m.  le couplet encore, sur la bande usée ; la basse qui marche
 *   B2        8 m.  le refrain au plus grand : la caisse « gated », une voix
 *                   « ou », l'harmonie sous le lead
 *   dernier   8 m.  la dernière image : l'accroche de « Fusible » à la boîte, une
 *                   fois, sur la salle vide ; le slow qui revient
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

  // La Mèche, l'ancien thème de l'accueil : trois mi répétés qui descendent,
  // la réponse qui remonte par le sol dièse (gardée telle quelle : le swing du
  // slow la déforme, comme un souvenir)
  var MECHE = [
    'E5 - . E5 - . E5 - F5 - E5 - D5 - C5 -',
    'D5 - . C5 - . A4 - - - - - . . . .',
    'C5 - . C5 - . C5 - D5 - C5 - A4 - F4 -',
    'G#4 - . A4 - . B4 - - - - - . . . .'
  ];
  // l'accroche de « Fusible » (do, si, mi, sol dièse), deux fois plus lente : une fois
  var DERNIERE_IMAGE = ['C5 - - - - - B4 - - - - - E5 - - -', 'G#4 - - - - - - - - - - - - - - -'];

  // ── en douze-huit : chaque temps, les cases 0, 1, 2 (la case 3 se tait) ──
  var BASSE = 'R - - . . . 5 . R - - . 8 . 5 .';
  var BASSE2 = 'R - - . . . 5 . R - - . 3 . 5 .';
  var EGRENE = '1 5 8 . 9 8 5 . 1 5 8 . 9 8 5 .';
  var EGRENE2 = '1 5 8 . 9 . 8 . 5 8 9 . 8 5 1 .';

  // ── LE LEAD EN LARMES : l'élan d'une croche, la glissade d'une quarte, la retombée ──
  var COUPLET = [
    '. . E5 - ~A5 - - - - - G5 . E5 - - -',
    '- - - - - - . . C5 - - . D5 - E5 -',
    'F5 - - - - - - - E5 - - . D5 - - -',
    'D5 - - - - - - - B4 - - . G#4 - - -',
    '. . E5 - ~A5 - - - - - G5 . E5 - - -',
    '- - - - - - . . C5 - - . A4 - C5 -',
    'D5 - - - - - - - F5 - - . E5 - D5 -',
    'E5 - - - - - - - - - - . . . . .',
    '. . G5 - ~C6 - - - - - B5 . G5 - - -',
    '- - - - - - . . D5 - - . G5 - - -',
    'A5 - - - - - - - G5 - - . E5 - - -',
    '- - - - - - . . B4 - - . D5 - E5 -',
    'F5 - - - - - - - E5 - - . C5 - - -',
    'D5 - - - - - - - - - - . A4 - B4 -',
    'A4 - - - - - - - - - - - . . . .',
    'G#4 - - - - - - - - - - - . . . .'
  ];
  var REFRAIN = [
    '. . A5 - ~C6 - - - - - - . B5 - A5 -',
    'G#5 - - - - - - - - - - . B5 - D6 -',
    'C6 - - - - - - - B5 - - . A5 - - -',
    '- - - - - - . . G5 - - . E5 - - -',
    '. . F5 - ~A5 - - - - - G5 . F5 - E5 -',
    'D5 - - - - - - - F5 - - . E5 - D5 -',
    'E5 - - - - - - - - - - . D5 - B4 -',
    'G#4 - - - - - - - - - - - . . . .'
  ];
  // la voix « ou » du refrain : une ligne intérieure, la note qui tient sous le lead
  var VOIX_REFRAIN = ['A4 - - - - - - - - - - - - - - -', 'G#4 - - - - - - - - - - - - - - -', 'A4 - - - - - - - - - - - - - - -',
                      'G4 - - - - - - - - - - - - - - -', 'A4 - - - - - - - - - - - - - - -', TENU,
                      'G#4 - - - - - - - - - - - - - - -', 'B4 - - - - - - - - - - - . . . .'];
  // la bande usée : des notes longues, la neuvième qui ne se résout pas
  var USEE = [
    '. . . . A4 - - - - - - - C5 - - -', 'B4 - - - - - - - - - - - - - - -',
    '. . . . A4 - - - - - - - C5 - - -', 'E5 - - - - - - - - - - - - - - -',
    '. . . . F5 - - - - - - - E5 - - -', 'D5 - - - - - - - C5 - - - - - - -',
    'B4 - - - - - - - - - - - - - - -', 'G#4 - - - - - - - - - - - . . . .'
  ];

  // ── la batterie du slow : la grosse caisse, la caisse sur le deux et le
  //    quatre, un tic sur le troisième triolet ──
  var D_SLOW = 'k . i . s . i . k . i . s . i .';
  var D_SLOW_X = 'kx . i . s . i . k . i . s . i .';
  var D_SLOW2 = 'k . i . s . i . k . k . s . i .';
  var D_SLOW_FIN = 'k . i . s . i . k . . . t t T .';
  var D_GRAND = 'k . i . S . i . k . i . S . i .';
  var D_GRAND_X = 'kx . i . S . i . k . i . S . i .';
  var D_GRAND_FIN = 'k . i . S . i . k . . . S S S .';

  function slow(x, n, n2, fin8, fin) {
    return [x, n, n, n2, n, n, n, fin8, x, n, n, n2, n, n, n, fin];
  }

  A.theme('fin', {
    titre: 'Le Dernier Tour', moment: "l'écran de fin, l'épilogue de 2050", tonalite: 'la mineur',
    humeur: 'la dernière chanson de la soirée : un slow en triolets, un lead en larmes, la cassette qui fatigue',
    bpm: 80, swing: 0.667, gain: 1.6,
    pompe: { prof: 0.25, rel: 0.35 },
    echo: { pas: 2.667, retour: 0.45, coupe: 1800 },
    salle: { taille: 0.9, duree: 3.8, ton: 3000 },
    cassette: { sature: 1.1, coupe: 8000, bas: 45, souffle: 0.008, flotte: { prof: 6, vit: 0.28 } },
    voix: {
      lead:  { inst: 'lead', vol: 0.13, ton: [2400, 1300, 0.25], echo: 0.3, rev: 0.45, flotte: { prof: 10, vit: 0.45 }, pan: 0.05 },
      usee:  { inst: 'lead', vol: 0.13, ton: [2000, 1100, 0.3], echo: 0.38, rev: 0.5, flotte: { prof: 22, vit: 0.33 }, pan: 0.08 },
      harmo: { inst: 'lead', vol: 0.05, ton: [2000, 1100, 0.25], echo: 0.15, rev: 0.45, pan: -0.3 },
      boite: { inst: 'cloche', vol: 0.1, faux: 26, echo: 0.45, rev: 0.5, pan: 0.2 },
      ep:    { inst: 'epiano', vol: 0.06, oct: 3, echo: 0.15, rev: 0.4, pan: -0.25 },
      nappe: { inst: 'supersaw', vol: 0.085, oct: 3, scies: 5, desaccord: 16, large: 0.85, rev: 0.5, pompe: true,
               flotte: { prof: 14, vit: 0.3 }, filtre: 2400, env: [0.5, 1, 0.9, 0.25] },
      ou:    { inst: 'vox', vol: 0.08, oct: 3, voyelle: 'ou', vers: 'o', rev: 0.55, pompe: true, pan: -0.1 },
      basse: { inst: 'basse', vol: 0.12, oct: 2, pompe: true, drive: 0.8, filtre: 1200, ton: [700, 320, 0.15] },
      batt:  { vol: 0.42, porte: 0.65, tenue: 0.3, rev: 0.45, filtre: 8000 }
    },
    sections: {
      // ── l'introduction, jouée une fois : le souvenir de La Mèche ──
      souvenir: {
        accords: ['Am', 'Am', 'F', 'E'],
        ouvre: { nappe: [600, 1800] },
        boite: MECHE,
        nappe: [NAPPE, TENU, NAPPE, NAPPE]
      },
      // ── la boucle ──
      A: {
        accords: ['Am7', 'Fmaj7', 'Bm7b5', 'E7', 'Am7', 'Fmaj7', 'Dm7', 'Esus4 E7',
                  'Cmaj7', 'G', 'Am7', 'Em7', 'Fmaj7', 'Bm7b5', 'Esus4', 'E7'],
        lead: COUPLET,
        basse: BASSE,
        ep: EGRENE,
        nappe: [NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE2, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE],
        batt: slow(D_SLOW_X, D_SLOW, D_SLOW2, D_SLOW, D_SLOW_FIN)
      },
      B: {
        accords: ['Fmaj7', 'E7/G#', 'Am7', 'Am7/G', 'Fmaj7', 'Bm7b5', 'E7', 'E7'],
        lead: REFRAIN,
        ou: VOIX_REFRAIN,
        basse: BASSE,
        ep: EGRENE2,
        nappe: [NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, TENU],
        batt: [D_SLOW_X, D_SLOW, D_SLOW, D_SLOW2, D_SLOW, D_SLOW, D_SLOW, D_SLOW_FIN]
      },
      // le creux : la bande fatigue
      creux: {
        accords: ['Am7', 'Am7', 'Fmaj7', 'Fmaj7', 'Dm7', 'Dm7', 'E7', 'E7'],
        ouvre: { nappe: [900, 1600], basse: [500, 1000] },
        usee: USEE,
        basse: [RACINE, TENU, RACINE, TENU, RACINE, TENU, RACINE, TENU],
        nappe: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU],
        batt: ['kx . . . . . . . . . . . . . . .', SILENCE, SILENCE, SILENCE, SILENCE, SILENCE,
               'k . . . . . . . k . . . . . . .', 'k . i . s . i . k . . . t t T .']
      },
      // le couplet encore, sur la bande usée
      A2: {
        copie: 'A',
        lead: null,
        usee: COUPLET,
        basse: BASSE2,
        ep: [EGRENE, EGRENE2],
        batt: slow(D_SLOW_X, D_SLOW2, D_SLOW, D_SLOW, 'k . i . s . i . k . . . S S S .')
      },
      B2: {
        copie: 'B', harmo: true,
        ep: null,
        ouvre: { nappe: [2400, 3400] },
        batt: [D_GRAND_X, D_GRAND, D_GRAND, D_GRAND, D_GRAND, D_GRAND, D_GRAND, D_GRAND_FIN]
      },
      // la dernière image : l'accroche de « Fusible », une fois, sur la salle vide
      dernier: {
        accords: ['Am', 'E', 'Fmaj7', 'Dm7', 'Am7', 'Fmaj7', 'Dm7', 'E7'],
        ouvre: { nappe: [1800, 700] },
        boite: DERNIERE_IMAGE.concat(silences(6)),
        basse: [RACINE, RACINE, RACINE, RACINE, BASSE, BASSE, BASSE, BASSE],
        nappe: [NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE, NAPPE],
        ep: [SILENCE, SILENCE, SILENCE, SILENCE, EGRENE, EGRENE, EGRENE, EGRENE],
        batt: ['kx . . . . . . . . . . . . . . .', SILENCE, SILENCE, SILENCE,
               'k . . . . . . . k . . . . . . .', 'k . i . . . i . k . i . . . i .', D_SLOW, D_SLOW_FIN]
      }
    },
    ordre: ['souvenir', 'A', 'B', 'creux', 'A2', 'B2', 'dernier'], boucle: 1,
    // le creux n'a plus de batterie : un thème retrouvé n'y reprend pas
    reprise: { sauf: ['creux'] }
  });
})(typeof FusibleAudio === 'object' ? FusibleAudio : require('../audio.js'));
