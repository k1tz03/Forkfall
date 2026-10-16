/* ---------------------------------------------------------------------------
 * FUSIBLE — la bande originale : « Seize heures » (livre_h3), la ville le
 * jour dans le livre 3, « La Sirène », et son introduction.
 *
 * L'usine qui ferme, la sirène de seize heures. La machine tourne en trois :
 * la barre de métal frappée toutes les trois doubles croches et la basse
 * industrielle sur le même cycle (il faut trois mesures pour qu'elles
 * retombent sur le temps) ; le corps tourne en quatre (la presse, la grosse
 * caisse lourde au premier et au troisième temps, la caisse « gated » au
 * deuxième et au quatrième). Toutes les seize mesures — seize heures —, la
 * sirène se lève : une voix qui monte d'un demi-ton par double croche (le
 * rotor qui prend sa vitesse), tient sur si, et redescend par la gamme
 * phrygienne, de plus en plus lentement, jusqu'au mi. Au milieu, le chant du
 * père à la tréfileuse (si, do, si, la, sol…), la nuit du Rideau Rouge en
 * demi-temps, et la grande halle à trois heures du matin. Mi phrygien ; 124.
 *
 * Ce qui n'est qu'à lui dans la bande : la sirène (le glissando par demi-tons,
 * la voix qui s'ouvre de « ou » à « a »), le métal en boucle, la machine en
 * trois contre le corps en quatre, la salle de béton de la grande halle.
 *
 *   intro    4 m.  (une fois) la machine s'éveille : le métal seul, la sirène
 *                  au loin, la basse, la presse
 *   ── la boucle, 128 mesures, 4 min 08 ──
 *   A       16 m.  le poste : la machine (métal et basse en trois), la presse
 *                  en quatre ; la sirène des seize heures aux mesures 13 à 16
 *   B       16 m.  la tréfileuse : le fil (un pincé en doubles croches), la
 *                  sirène qui chante deux fois quatre mesures (des quintes qui
 *                  glissent), la caisse
 *   pont    16 m.  le creux, la grande halle à trois heures : la reese, la
 *                  sirène au fond, des gouttes de métal ; quatre mesures pour
 *                  remonter
 *   A2      16 m.  le poste, et le chant du père par-dessus ; la sirène
 *   C       16 m.  le Rideau Rouge : le demi-temps, le velours (une voix
 *                  grave), la basse qui traîne, un mi majeur qui sent la nuit
 *   D       16 m.  le corps : le sommet — la machine à fond, la sirène doublée
 *                  par la grande scie, des stabs, le mi majeur
 *   D2       8 m.  la sirène à pleine voix, deux fois
 *   creux   16 m.  la dernière sirène (le 24 décembre) : elle tombe sur la
 *                  machine qui ralentit, puis la halle vide, un cœur de grosse
 *                  caisse
 *   retour   8 m.  la machine repart : le métal, la basse, la presse, relance
 *
 * La courbe : A 5 → B 7 → pont 2 (remonte à 5) → A2 6 → C 4 → D 8 → D2 9 →
 * creux 3 puis 1 → retour 4. La sirène sonne toutes les seize mesures ou
 * presque ; entre ses passages, la machine seule.
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
  var NOMS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];
  var PCS = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function midi(n) { var m = /^([A-G])(#|b)?(\d)$/.exec(n); return 12 * (+m[3] + 1) + PCS[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0); }
  function nom(x) { return NOMS[x % 12] + (Math.floor(x / 12) - 1); }
  // des cases en mesures de seize
  function mesures(c) { var r = []; for (var j = 0; j < c.length; j += 16) r.push(c.slice(j, j + 16).join(' ')); return r; }
  // LA SIRÈNE : `attente` cases de silence, puis de `de` à `a` un demi-ton par
  // case (chaque note glisse depuis la précédente : le rotor prend sa vitesse),
  // la note tenue `tenue` cases, puis la descente (des notes et leurs durées,
  // chacune glissée), et du silence jusqu'à `total` cases
  // (`tenueSeule` : la montée se tait, la note s'ouvre en haut — la grande scie
  // ne double que la tenue et la descente : sept oscillateurs par double croche,
  // c'était trop)
  function sirene(attente, de, a, tenue, descente, total, tenueSeule) {
    var c = [], i;
    for (i = 0; i < attente; i++) c.push('.');
    for (var x = midi(de); x <= midi(a); x++) {
      if (tenueSeule) c.push(x === midi(a) ? nom(x) : '.');
      else c.push((x === midi(de) ? '' : '~') + nom(x));
    }
    for (i = 1; i < tenue; i++) c.push('-');
    (descente || []).forEach(function (d) { c.push('~' + d[0]); for (var k = 1; k < d[1]; k++) c.push('-'); });
    while (c.length < total) c.push('.');
    return mesures(c.slice(0, total));
  }
  // deux mesures de batterie l'une sur l'autre, case par case
  function mele(a, b) {
    var x = a.trim().split(/\s+/), y = b.trim().split(/\s+/);
    return x.map(function (c, i) {
      var d = y[i];
      if (c === '.' || c === '-') return d === '-' ? '.' : d;
      if (d === '.' || d === '-') return c;
      return c + d;
    }).join(' ');
  }

  // ── LA MACHINE, EN TROIS : le métal toutes les trois doubles croches (trois
  //    mesures pour retomber sur le temps), la basse sur le même cycle
  // (une frappe sur deux est un cerclage sec : la barre sonne moins, le cycle reste)
  var METAL = ['m . . r . . m . . r . . m . . r', '. . m . . r . . m . . r . . m .', '. r . . m . . r . . m . . r . .'];
  var METAL_RARE = ['m . . . . . m . . . . . . . . m', '. . . . . m . . . . . . . . m .', '. . . . m . . . . . . . . m . .'];
  function machine(l) { return l.map(function (b, i) { return mele(b, METAL[i % 3]); }); }
  function machineRare(l) { return l.map(function (b, i) { return mele(b, METAL_RARE[i % 3]); }); }
  var BASSE3 = ['R - . R - . 8 - . R - . R - . 8', '- . R - . R - . 8 - . R - . R -', '. 8 - . R - . R - . 8 - . R - .'];
  var BASSE3B = ['R - . R - . 8 - . R - . 7 - . 8', '- . R - . R - . 8 - . 5 - . R -', '. 8 - . R - . R - . 8 - . 5 - .'];
  function basse3(n, l) { var r = []; l = l || BASSE3; for (var i = 0; i < n; i++) r.push(l[i % 3]); return r; }
  // le demi-temps du Rideau : la basse traîne
  var TRAINE = 'R - - - - - . R - - . 8 - - 5 -';

  // ── LE CORPS, EN QUATRE : la presse (la lourde au premier et au troisième
  //    temps, la légère entre), la caisse « gated » au deuxième et au quatrième
  var P_X = 'Kx . . . k . . . K . . . k . . .';
  var P = 'K . . . k . . . K . . . k . . .';
  var PS_X = 'Kx . . . kS . . . K . . . kS . . .';
  var PS = 'K . . . kS . . . K . . . kS . . .';
  var PS_O = 'K . . . kS . . . K . . . kS . o .';          // la vapeur
  var PS_R = 'K . . r kS . . . K . . r kS . o .';
  var PS_TOUR = 'K . . . kS . . . K . T . kS T T T';
  var PS_RELANCE = 'K . . . kS . . . Kz . T . T T S S';
  // le Rideau : le demi-temps
  var RID_X = 'Kx . . . . . . . S . . . . . k .';
  var RID = 'K . . . . . r . S . . . . . k .';
  var RID_O = 'K . . . . . r . S . . . o . k .';
  var COEUR = 'K . . . . . . . . . . . . . . .';

  // ── LA SIRÈNE DES SEIZE HEURES (quatre mesures) : de mi 3 à si 4 en dix-neuf
  //    doubles croches, tenue, puis la descente phrygienne qui ralentit
  var SEIZE = sirene(4, 'E3', 'B4', 22, [['A4', 3], ['G4', 4], ['F4', 6], ['E4', 10]], 64);
  // au sommet, plus haut : de si 3 à mi 5
  var SEIZE_HAUT = sirene(4, 'B3', 'E5', 22, [['D5', 3], ['C5', 4], ['B4', 6], ['A4', 4], ['G#4', 8]], 64);
  var SEIZE_HAUT_T = sirene(4, 'B3', 'E5', 22, [['D5', 3], ['C5', 4], ['B4', 6], ['A4', 4], ['G#4', 8]], 64, true);
  // la sirène à pleine voix (D2), deux fois : la voix, et la grande scie sur la tenue
  var PLEINE = sirene(0, 'E3', 'B4', 26, [['C5', 6]], 64).concat(sirene(0, 'F3', 'C5', 22, [['B4', 4], ['G#4', 10]], 64));
  var PLEINE_T = sirene(0, 'E3', 'B4', 26, [['C5', 6]], 64, true).concat(sirene(0, 'F3', 'C5', 22, [['B4', 4], ['G#4', 10]], 64, true));
  // la dernière sirène : la plus longue, la descente qui n'en finit pas
  var DERNIERE = sirene(0, 'E3', 'B4', 40, [['A4', 6], ['G4', 8], ['F4', 12], ['E4', 18], ['D4', 10], ['E4', 14]], 128);
  // au fond de la halle, trois heures : elle se lève à peine
  var LOIN = sirene(8, 'B3', 'F4', 26, [['E4', 12]], 64);
  // LA SIRÈNE QUI CHANTE (B) : des quintes qui glissent vers le haut
  var CHANTE = [
    'E4 - - - ~B4 - - - - - - - - - - -', 'C5 - - - - - - - ~A4 - - - - - - -',
    'D4 - - - ~B4 - - - - - - - G4 - - -', 'G4 - - - - - - - . . . . . . . .',
    'E4 - - - ~B4 - - - - - - - - - - -', 'C5 - - - - - - - ~F5 - - - - - - -',
    'F4 - - - ~A4 - - - - - - - - - - -', 'G#4 - - - - - - - - - - - . . . .',
    'E4 - - - ~B4 - - - - - - - - - - -', 'C5 - - - - - - - ~A4 - - - - - - -',
    'D4 - - - ~B4 - - - - - - - G4 - - -', 'G4 - - - - - - - . . . . . . . .',
    'E4 - - - ~C5 - - - - - - - - - - -', 'A4 - - - - - - - ~C5 - - - - - - -',
    'F4 - - - ~D5 - - - - - - - - - - -', 'B4 - - - - - - - ~G#4 - - - . . . .'
  ];

  // ── LE CHANT DU PÈRE à la tréfileuse : si, do, si, la, sol ; la, mi ; sol,
  //    la, sol, fa, mi ; fa, mi (la cadence phrygienne)
  var PERE = [
    'B4 - - - C5 - B4 - A4 - - - G4 - - -', 'A4 - - - - - - - E4 - - - - - - -',
    'G4 - - - A4 - G4 - F4 - - - E4 - - -', 'F4 - - - - - - - E4 - - - - - - .',
    'B4 - - - C5 - B4 - A4 - - - G4 - - -', 'A4 - - - - - - - C5 - - - - - - -',
    'D5 - - - C5 - B4 - A4 - - - G4 - - -', 'F4 - - - - - - - E4 - - - - - - .',
    'G4 - - - - - - - C5 - - - - - - -', 'C5 - - - B4 - A4 - - - - - E4 - - -',
    'F4 - - - G4 - A4 - D5 - - - - - - -', 'C5 - - - - - - - A4 - - - - - - .'
  ];

  // ── LE FIL : un pincé en doubles croches qui monte et descend sans fin
  var FIL = '1 5 8 9 8 5 1 5 8 9 8 5 1 5 8 9';
  var FIL2 = '1 5 8 5 9 5 8 5 1 5 8 5 9 8 5 8';
  // les stabs du sommet
  var STAB = 'X . . . . . X . . . . . . . X .';

  A.theme('livre_h3', {
    titre: 'Seize heures', moment: 'la ville le jour, livre 3 (La Sirène)',
    tonalite: 'mi phrygien',
    humeur: 'l\'usine qui ferme : une sirène qui monte, du métal frappé en boucle, une basse de machine',
    ville: true,
    bpm: 124, gain: 1.12,
    pompe: { prof: 0.5, rel: 0.2 },
    echo: { pas: 3, retour: 0.33, coupe: 2000 },
    salle: { taille: 0.95, duree: 3.6, ton: 3000 },
    cassette: { sature: 1.2, coupe: 9500, bas: 40, souffle: 0.004, flotte: { prof: 2.5, vit: 0.29 } },
    voix: {
      sirene: { inst: 'vox', vol: 0.2, voyelle: 'ou', vers: 'a', env: [0.012, 0.3, 0.92, 0.12], rev: 0.5, echo: 0.18, flotte: { prof: 6, vit: 0.5 }, pan: 0.05 },
      envol:  { inst: 'supersaw', vol: 0.07, scies: 5, desaccord: 18, large: 0.85, rev: 0.45, flotte: { prof: 7, vit: 0.45 }, filtre: 3600, env: [0.012, 0.4, 0.85, 0.22] },
      lead:   { inst: 'lead', vol: 0.12, rev: 0.4, echo: 0.25, flotte: { prof: 7, vit: 0.5 }, filtre: 2600, pan: -0.1 },
      velours: { inst: 'vox', vol: 0.09, oct: 3, voyelle: 'o', vers: 'ou', rev: 0.55, pompe: true, flotte: { prof: 12, vit: 0.3 }, env: [0.3, 0.8, 0.85, 0.4] },
      fil:    { inst: 'pluck2', vol: 0.075, oct: 3, echo: 0.35, rev: 0.15, pompe: true, pan: 0.3, filtre: 2600 },
      stab:   { inst: 'stab', vol: 0.08, oct: 4, echo: 0.2, rev: 0.3, pompe: true, pan: -0.2 },
      nappe:  { inst: 'supersaw', vol: 0.065, oct: 3, scies: 5, rev: 0.45, pompe: true, flotte: { prof: 9, vit: 0.38 }, filtre: 2400, env: [0.3, 0.8, 0.85, 0.3] },
      reese:  { inst: 'reese', vol: 0.11, oct: 1, plancher: 'G1', desaccord: 10, pompe: true, filtre: 1500 },
      basse:  { inst: 'basse', vol: 0.085, oct: 2, pompe: true, drive: 2.0, q: 2.2, filtre: 2200, ton: [2200, 700, 0.05] },
      batt:   { vol: 0.7, porte: 0.55, tenue: 0.22, rev: 0.22, filtre: 13000 }
    },
    sections: {
      // ── l'introduction, jouée une fois : la machine s'éveille ──
      intro: {
        accords: ['Em', 'Em', 'F', 'Em'],
        ouvre: { basse: [300, 2200] },
        sirene: LOIN,
        basse: [SILENCE, SILENCE, BASSE3[0], BASSE3[1]],
        batt: machine(['. . . . . . . . . . . . . . . .', '. . . . . . . . . . . . . . . .', 'K . . . . . . . K . . . . . . .', 'K . . . k . . . Kz . T . T T S S'])
      },
      // ── la boucle ──
      A: {
        accords: ['Em', 'Em', 'F', 'Em', 'Em', 'Em', 'F', 'Em', 'Am', 'Am', 'G', 'F', 'Em', 'Em', 'F', 'F'],
        ouvre: { basse: [900, 2200], nappe: [900, 1800] },
        basse: basse3(16),
        nappe: [NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU, NAPPE, TENU],
        sirene: silences(12).concat(SEIZE),
        batt: machine([P_X, P, P, P, PS, PS, PS, PS_TOUR, PS, PS, PS_O, PS, PS, PS, PS_O, PS_RELANCE])
      },
      // la tréfileuse : le fil, la sirène qui chante
      B: {
        accords: ['Am', 'F', 'G', 'Em', 'Am', 'F', 'Dm', 'Em', 'Am', 'F', 'G', 'Em', 'C', 'F', 'Dm', 'E'],
        ouvre: { fil: [1200, 3400] },
        basse: basse3(16, BASSE3B),
        fil: rep(FIL, 8).concat(rep(FIL2, 8)),
        sirene: CHANTE.slice(0, 4).concat(silences(4)).concat(CHANTE.slice(8, 12)).concat(silences(4)),
        nappe: NAPPE,
        batt: machine([PS_X, PS, PS_R, PS, PS, PS, PS_R, PS_TOUR, PS, PS, PS_R, PS, PS, PS, PS_R, PS_RELANCE])
      },
      // le creux, la grande halle à trois heures : la reese, la sirène au fond, des gouttes de métal
      pont: {
        accords: ['Em', 'Em', 'Em', 'Em', 'C', 'C', 'C', 'C', 'Am', 'Am', 'Am', 'Am', 'Em', 'Em', 'F', 'F'],
        ouvre: { reese: [500, 1200], basse: [300, 2200], nappe: [700, 1300] },
        reese: [RACINE, TENU, TENU, TENU, RACINE, TENU, TENU, TENU, RACINE, TENU, TENU, TENU].concat(silences(4)),
        nappe: [NAPPE, TENU, TENU, TENU, NAPPE, TENU, TENU, TENU, NAPPE, TENU, TENU, TENU, NAPPE, TENU, NAPPE, TENU],
        sirene: silences(4).concat(LOIN).concat(silences(8)),
        basse: silences(12).concat(basse3(4)),
        batt: ['bx . . . . . . . . . . . . . . .', '. . . . . . m . . . . . . . . .', '. . . . . . . . . . . m . . . .', '. . m . . . . . . . . . . . . .',
               '. . . . . . . . m . . . . . . .', '. . . . . . . . . . . . . m . .', '. . . . m . . . . . . . . . . .', '. . . . . . . . . . m . . . . .',
               '. m . . . . . . . . . . . . . .', '. . . . . . . . . m . . . . . .', '. . . . . m . . . . . . . . m .', '. . . . . . . . . . . . r . r r',
               mele(P, METAL[0]), mele(P, METAL[1]), mele(PS, METAL[2]), mele(PS_RELANCE, METAL[0])]
      },
      // le poste, et le chant du père
      A2: {
        accords: ['Em', 'Am', 'Dm', 'F Em', 'Em', 'Am', 'Dm', 'F Em', 'C', 'Am', 'Dm', 'F', 'Em', 'Em', 'F', 'F'],
        ouvre: { basse: [1400, 2200], lead: [1800, 2800] },
        basse: basse3(16),
        nappe: NAPPE,
        lead: PERE.concat(silences(4)),
        sirene: silences(12).concat(SEIZE),
        batt: machine([PS_X, PS, PS, PS_O, PS, PS, PS, PS_TOUR, PS, PS, PS_O, PS, PS, PS, PS_O, PS_RELANCE])
      },
      // le Rideau Rouge : le demi-temps, le velours, la basse qui traîne
      C: {
        accords: ['Am', 'Am', 'F', 'F', 'Dm', 'Dm', 'E', 'E', 'Am', 'Am', 'F', 'F', 'Dm', 'Dm', 'E', 'E'],
        ouvre: { basse: [700, 1500] },
        basse: TRAINE,
        velours: [NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU, NAPPE, TENU],
        lead: silences(8).concat(['E5 - - - - - - - - - - - D5 - C5 -', 'B4 - - - - - - - - - - - . . . .', 'A4 - - - - - - - C5 - - - - - - -', 'B4 - - - A4 - - - - - - - . . . .',
                                  'F4 - - - - - - - A4 - - - - - - -', 'D5 - - - - - - - C5 - - - B4 - - -', 'G#4 - - - - - - - - - - - - - - -', '- - - - - - - - . . . . . . . .']),
        batt: machineRare([RID_X, RID, RID, RID_O, RID, RID, RID, 'K . . . . . r . S . . . S . S S',
                           RID, RID, RID, RID_O, RID, RID, RID, PS_RELANCE])
      },
      // le corps : la machine à fond, la sirène doublée par la grande scie, les stabs
      D: {
        accords: ['Em', 'F', 'G', 'F', 'Em', 'F', 'G', 'Am', 'C', 'F', 'Dm', 'E', 'Em', 'F', 'G', 'F'],
        ouvre: { fil: [2000, 3600] },
        basse: basse3(16, BASSE3B),
        fil: FIL2,
        stab: STAB,
        nappe: rep(NAPPE, 12).concat(silences(4)),
        sirene: CHANTE.slice(0, 8).concat(silences(4)).concat(SEIZE_HAUT),
        envol: silences(12).concat(SEIZE_HAUT_T),
        batt: machine([PS_X, PS, PS_R, PS, PS_X, PS, PS_R, PS_TOUR, PS_X, PS, PS_R, PS, PS_X, PS, PS_R, PS_RELANCE])
      },
      // la sirène à pleine voix
      D2: {
        accords: ['Em', 'F', 'Em', 'F', 'C', 'F', 'E', 'E'],
        basse: basse3(8, BASSE3B),
        fil: FIL,
        stab: STAB,
        sirene: PLEINE,
        envol: PLEINE_T,
        batt: machine([PS_X, PS, PS_R, PS_TOUR, PS_X, PS, PS_R, 'K . . . kS . . . K . T T T T T T'])
      },
      // la dernière sirène : elle tombe sur la machine qui ralentit, puis la halle vide
      creux: {
        accords: ['Em', 'Em', 'Em', 'Em', 'F', 'F', 'F', 'F', 'Em', 'Em', 'Em', 'Em', 'Em', 'Em', 'Em', 'Em'],
        ouvre: { basse: [2200, 300], nappe: [1600, 600], reese: [1200, 500] },
        sirene: DERNIERE.concat(silences(8)),
        basse: basse3(6).concat([RACINE, TENU]).concat(silences(8)),
        reese: silences(8).concat([RACINE, TENU, TENU, TENU, RACINE, TENU, TENU, TENU]),
        nappe: [NAPPE, TENU, TENU, TENU, NAPPE, TENU, TENU, TENU, NAPPE, TENU, TENU, TENU, TENU, TENU, TENU, TENU],
        batt: machineRare(['Kx . . . k . . . K . . . k . . .', P, P, P, P, 'K . . . . . . . K . . . . . . .', COEUR, COEUR])
          .concat(['bx . . . . . . . . . . . . . . .', COEUR, '. . . . . . . . . . . . . . . .', COEUR,
                   '. . . . . . . . m . . . . . . .', COEUR, '. . . . . . . . . . . . . . . .', 'K . . . . . . . K . . . K . K K'])
      },
      // la machine repart
      retour: {
        accords: ['Em', 'Em', 'F', 'Em', 'Em', 'Em', 'F', 'F'],
        ouvre: { basse: [400, 2200] },
        basse: basse3(8),
        nappe: [NAPPE, TENU, NAPPE, NAPPE, NAPPE, TENU, NAPPE, TENU],
        batt: machine([P_X, P, P, P, PS, PS, PS, PS_RELANCE])
      }
    },
    ordre: ['intro', 'A', 'B', 'pont', 'A2', 'C', 'D', 'D2', 'creux', 'retour'], boucle: 1
  });
})(typeof FusibleAudio === 'object' ? FusibleAudio : require('../audio.js'));
