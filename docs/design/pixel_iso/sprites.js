'use strict';
// Personnages en pixel art (1 pixel = 10 cm), contour sombre, lumière appliquée au rendu.
const K = [0.06, 0.045, 0.04];
const BASE = {
  k: K, s: [0.86, 0.69, 0.55], S: [0.66, 0.48, 0.37], h: [0.17, 0.11, 0.08], H: [0.30, 0.20, 0.13],
  o: [0.09, 0.09, 0.09], j: [0.24, 0.30, 0.42], J: [0.16, 0.20, 0.30], g: [0.46, 0.46, 0.45], G: [0.32, 0.32, 0.32],
  y: [0.80, 0.62, 0.20], b: [0.84, 0.82, 0.76], B: [0.58, 0.56, 0.50], w: [0.66, 0.66, 0.64],
};
const pal = extra => Object.assign({}, BASE, extra);

// Toi : l'entraîneur, de trois quarts dos, survêtement du club, le sac de maillots à la main.
const COACH = {
  rows: [
    '...kkkkk....',
    '..khhhhhk...',
    '..khHHhhk...',
    '..khhhhhk...',
    '..kShhhSk...',
    '...kSSSk....',
    '..knnnnnk...',
    '.knnnnnnnk..',
    '.kwnnnnnwk..',
    '.kwnnnnnwkk.',
    '.kwnNnNnwkbk',
    '.kSnnnnnSkbk',
    '..knnnnnkbbk',
    '..knnknnkbBk',
    '..kwnkwnkkk.',
    '..knnknnk...',
    '..knnknnk...',
    '..kNNkNNk...',
    '..kookook...',
    '...kk.kk....',
  ],
  pal: pal({ n: [0.44, 0.13, 0.18], N: [0.28, 0.08, 0.12], w: [0.62, 0.62, 0.60] }), ax: 5,
};
// Gégé : le capo, casquette verte, parka rouge à bande or, écharpe bordeaux et grise.
const GEGE = {
  rows: [
    '...kkkkk...',
    '..kvvvvvk..',
    '.kvvvvvvvk.',
    '..ksssssk..',
    '..kskskSk..',
    '..ksShhsk..',
    '..kmMmMmk..',
    '.krrmMmrrk.',
    'krrrmMrrrrk',
    'krrrrMrrrrk',
    'kyyyyyyyyyk',
    'krrrrrrrrrk',
    'ksrrrrrrrsk',
    '.kjjjjjjjk.',
    '.kjjjkjjjk.',
    '.kjjjkjjjk.',
    '.kjJjkjJjk.',
    '.koookoook.',
    '..kk...kk..',
  ],
  pal: pal({ v: [0.18, 0.36, 0.22], r: [0.62, 0.15, 0.15], m: [0.44, 0.12, 0.17], M: [0.60, 0.60, 0.58] }), ax: 5,
};
// Un supporter debout, écharpe du club, une bière à la main.
const FAN = {
  rows: [
    '...kkkk....',
    '..khhhhk...',
    '..khsssk...',
    '..kssksk...',
    '..kssssk...',
    '...kmMk....',
    '..kmMmMk...',
    '.kggmggggk.',
    '.kgggmgggk.',
    '.kgggggggkk',
    '.kGgggggsyk',
    '.kGgggggkyk',
    '..kjjjjjk..',
    '..kjjkjjk..',
    '..kjjkjjk..',
    '..kjjkjjk..',
    '..kookook..',
    '...kk.kk...',
  ],
  pal: pal({ m: [0.44, 0.12, 0.17], M: [0.60, 0.60, 0.58], g: [0.40, 0.40, 0.38], G: [0.28, 0.28, 0.27] }), ax: 4,
};
// Un supporter assis en terrasse, de profil, le bras sur la table.
const FAN_SIT = {
  rows: [
    '..kkkk...',
    '.khhhhk..',
    '.khhssk..',
    '.khsssk..',
    '..kssk...',
    '.kmMmmk..',
    'kccccccck',
    'kcccccssk',
    'kcccck...',
    'kjjjjjjk.',
    '.kkkkjjk.',
    '....kjjk.',
    '....kook.',
  ],
  pal: pal({ c: [0.20, 0.30, 0.24], m: [0.44, 0.12, 0.17], M: [0.60, 0.60, 0.58] }), ax: 3,
};
// Le gamin du centre, maillot du club, et son ballon.
const KID = {
  rows: [
    '..kkkk..',
    '.khhhhk.',
    '.khssskk',
    '.kssssk.',
    '..kSSk..',
    '.kttttk.',
    'kttwwttk',
    'ksttttsk',
    '.kttttk.',
    '.kpppk..',
    '.kspsk..',
    '.ks.sk..',
    '.ko.ok..',
    '..k.k...',
  ],
  pal: pal({ t: [0.48, 0.13, 0.19], w: [0.62, 0.62, 0.60], p: [0.40, 0.40, 0.40], h: [0.10, 0.07, 0.05] }), ax: 3,
};
const BALL = { rows: ['.kk.', 'kwWk', 'kWwk', '.kk.'], pal: pal({ w: [0.86, 0.85, 0.80], W: [0.25, 0.25, 0.25] }), ax: 1, shadow: true, shadowR: 2 };
// Le chat noir sur le toit de la voiture.
const CAT = { rows: ['k.k..', 'kkk..', 'kekk.', '.kkkk', '.kk.k'], pal: pal({ e: [0.7, 0.75, 0.3] }), emit: { e: [0.55, 0.6, 0.2] }, ax: 2, shadow: false };
// L'homme à l'imperméable devant le kiosque (le journaliste de l'Écho).
const COAT = {
  rows: [
    '...kkkk...',
    '..khhhhk..',
    '..khssshk.',
    '..kssksk..',
    '..kssssk..',
    '...kSSk...',
    '..kccccck.',
    '.kcccCcccK',
    '.kcccCccck',
    '.kccCCcbbk',
    '.kcccCcbbk',
    '.ksccCccsk',
    '..kccCcck.',
    '..kcccccck',
    '..kjjkjjk.',
    '..kjjkjjk.',
    '..kookook.',
    '...kk.kk..',
  ],
  pal: pal({ c: [0.62, 0.54, 0.38], C: [0.44, 0.38, 0.26], K: K, b: [0.85, 0.83, 0.75] }), ax: 4,
};
// Deux passants qui rentrent, côte à côte.
const WALKER = {
  rows: [
    '...kkkk...',
    '..khhhhk..',
    '..khhhhk..',
    '..kShhSk..',
    '...kSSk...',
    '..kqqqqk..',
    '.kqqqqqqk.',
    '.kqqqqqqk.',
    '.kqQqqQqk.',
    '.ksqqqqsk.',
    '..kqqqqk..',
    '..kjjjjk..',
    '..kjkkjk..',
    '..kjk.jk..',
    '..kok.ok..',
    '...k...k..',
  ],
  pal: pal({ q: [0.30, 0.34, 0.40], Q: [0.22, 0.25, 0.30], h: [0.36, 0.24, 0.14] }), ax: 4,
};
const WALKER2 = Object.assign({}, WALKER, { pal: pal({ q: [0.55, 0.40, 0.30], Q: [0.40, 0.29, 0.21], h: [0.55, 0.50, 0.42], j: [0.18, 0.18, 0.20] }) });

// Bréhaut, le capitaine : mulet blond, brassard, maillot du club.
const BREHAUT = {
  rows: [
    '...kkkkk...',
    '..kyyyyyk..',
    '..kyYyyyk..',
    '..ksssssk..',
    '..kskskSk..',
    '..ksssssyk.',
    '...kSSSkyk.',
    '..kttttttk.',
    '.kttwttwttk',
    '.kttwttwttk',
    '.kAtwttwtsk',
    '.kstwttwtk.',
    '..kppppppk.',
    '..kppkpppk.',
    '..kssk.ssk.',
    '..kttk.ttk.',
    '..kook.ook.',
    '...kk...kk.',
  ],
  pal: pal({ y: [0.86, 0.72, 0.36], Y: [0.95, 0.85, 0.5], t: [0.46, 0.12, 0.18], w: [0.62, 0.62, 0.60], A: [0.88, 0.75, 0.2], p: [0.45, 0.45, 0.45] }), ax: 5,
};
const PLAYER = Object.assign({}, BREHAUT, { pal: pal({ y: [0.14, 0.10, 0.08], Y: [0.22, 0.16, 0.12], t: [0.46, 0.12, 0.18], w: [0.62, 0.62, 0.60], A: [0.46, 0.12, 0.18], p: [0.45, 0.45, 0.45], s: [0.55, 0.38, 0.27], S: [0.42, 0.28, 0.20] }) });
// Vaubourg, le président : costume bordeaux, lunettes, le téléphone à antenne collé à l'oreille.
const VAUBOURG = {
  rows: [
    '...kkkk..p.',
    '..kssssk.p.',
    '.kgssssgkp.',
    '.kgGsGsgsp.',
    '.kgssssgsk.',
    '..ksSSsk...',
    '..kwbbwk...',
    '.krrwbwrrk.',
    '.krrrbrrrk.',
    '.krrrbrrrk.',
    '.kRrrrrrRk.',
    '.ksrrrrrsk.',
    '..kRRRRRk..',
    '..kRRkRRk..',
    '..kRRkRRk..',
    '..kookook..',
    '...kk.kk...',
  ],
  pal: pal({ g: [0.62, 0.62, 0.60], G: [0.15, 0.15, 0.17], w: [0.85, 0.84, 0.80], b: [0.20, 0.20, 0.26], r: [0.44, 0.12, 0.17], R: [0.30, 0.08, 0.12], p: [0.10, 0.10, 0.10] }), ax: 4,
};
// Toi, assis, de profil, en survêtement du club.
const COACH_SIT = Object.assign({}, FAN_SIT, { pal: pal({ c: [0.44, 0.13, 0.18], m: [0.44, 0.13, 0.18], M: [0.62, 0.62, 0.60], j: [0.44, 0.13, 0.18], J: [0.28, 0.08, 0.12] }) });


// Josiane, la secrétaire : chignon gris, lunettes rondes, gilet violet.
const JOSIANE = {
  rows: [
    '....kkk....',
    '...kgggk...',
    '..kkgggkk..',
    '.kgggggggk.',
    '.kgsssssgk.',
    '.kgOsOsOgk.',
    '..ksssssk..',
    '...kSSSk...',
    '..kvvwvvk..',
    '.kvvvwvvvk.',
    '.kvvvwvvvk.',
    'kvvvvvvvvvk',
    'ksvvvvvvvsk',
    '.kppppppk..',
    '.kppppppk..',
    '..ksk.ksk..',
    '..kok.kok..',
    '...k...k...',
  ],
  pal: pal({ g: [0.62, 0.62, 0.60], O: [0.12, 0.12, 0.14], v: [0.40, 0.25, 0.48], w: [0.85, 0.84, 0.80], p: [0.35, 0.35, 0.36] }), ax: 5,
};
// Vukić, l'adjoint : moustache, survêtement marine, sifflet.
const VUKIC = {
  rows: [
    '...kkkkk...',
    '..khhhhhk..',
    '..khssshk..',
    '..ksksksk..',
    '..kshhhsk..',
    '...kSSSk...',
    '..knnnnnk..',
    '.knnwnwnnk.',
    '.knnnynnnk.',
    '.knwnnnwnk.',
    '.ksnnnnnsk.',
    '..knnnnnk..',
    '..knnknnk..',
    '..kwnkwnk..',
    '..knnknnk..',
    '..kookook..',
    '...kk.kk...',
  ],
  pal: pal({ n: [0.18, 0.24, 0.40], w: [0.80, 0.80, 0.78], y: [0.80, 0.78, 0.60], h: [0.22, 0.15, 0.10] }), ax: 5,
};
// Un joueur assis sur le banc, en tenue.
const PLAYER_SIT = Object.assign({}, FAN_SIT, { pal: pal({ c: [0.46, 0.12, 0.18], m: [0.46, 0.12, 0.18], M: [0.62, 0.62, 0.60], j: [0.45, 0.45, 0.45], J: [0.35, 0.35, 0.35] }) });

module.exports = { JOSIANE, VUKIC, PLAYER_SIT, BREHAUT, PLAYER, VAUBOURG, COACH_SIT, COACH, GEGE, FAN, FAN_SIT, KID, BALL, CAT, COAT, WALKER, WALKER2 };
