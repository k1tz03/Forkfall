#!/usr/bin/env node
// LA MUSIQUE ENREGISTRÉE — des masters du studio aux fichiers que le jeu télécharge.
//
// Le studio (packages/tools/studio ; son contrat : docs/design/studio.md § 7) rend chaque thème hors ligne, en
// un master continu : l'introduction, le corps de la boucle, le corps encore, une queue ; et dit où sont les choses :
//   <clé>.wav    44,1 kHz, stéréo, PCM 24 bits (16 bits et flottant se lisent aussi ; un FLAC aussi)
//   <clé>.json   { cle, titre, bpm, mesure_s, frequence: 44100, intro: { debut: 0, fin }, boucle: { debut, fin },
//                  sections: [{ nom, debut, fin, intro, reprise, rang, mesures }], reprise: { sauf: [nom…] },
//                  lufs, crete_dbtp, duree_s, … }   (positions en échantillons ; les autres champs sont ignorés)
// `boucle` est le SECOND passage du corps : ses premiers échantillons portent la queue de la fin du corps,
// et boucler de `boucle.fin` à `boucle.debut` ne s'entend pas. `sections` : celles de l'introduction
// (`intro: true`), puis celles du corps DANS LE SECOND PASSAGE, dans l'ordre (une section jouée deux fois y
// paraît deux fois) ; `reprise: false` et `reprise.sauf` : le jeu n'y reprend jamais le thème ; `mesures` :
// leur nombre de mesures (un thème peut changer de tempo : les positions des sections font foi, jamais
// mesures × mesure_s ; sans `mesures`, on les compte avec `mesure_s`). La boucle est à −16 LUFS (`lufs`).
//
//   node packages/tools/web/musique_audio.js --masters <dossier> [clé …]
//        empaquette : MP3 par blocs dans packages/tools/web/musique/audio/ (commités : ce sont les fichiers
//        du jeu) et le manifeste (musique/audio/manifeste.json) que le lecteur d'audio.js lit. <dossier> : celui
//        que livrent les compositeurs (un <clé>.wav et un <clé>.json par thème ; le reste y est ignoré)
//   … --sortie <dossier>   (avec --masters, --verifier, --retirer) un autre dossier que musique/audio/ : un
//        essai (la démonstration du studio) qui ne touche pas aux fichiers du jeu
//   node packages/tools/web/musique_audio.js --maquettes <dossier> [clé …]
//        rend les MAQUETTES : les thèmes de synthèse d'aujourd'hui (musique/*.js), rendus hors ligne par le
//        vrai moteur dans Chromium (comme banc_son.js), au même contrat — pour que toute la chaîne se
//        construise et se mesure avant que le studio livre. Puis --masters sur le même dossier.
//   node packages/tools/web/musique_audio.js --verifier --masters <dossier> [clé …] [--out <dossier>]
//        mesure les coutures dans Chromium : le lecteur d'audio.js joue les MP3 autour de chaque jointure
//        (entre deux blocs, l'introduction qui passe la main, la boucle), à 44,1 et 48 kHz, et on compare au
//        master aux mêmes échantillons ; plus deux décodeurs simulés qui ne retirent pas le retard du MP3
//   node packages/tools/web/musique_audio.js --retirer <clé> [clé …]
//        retire l'enregistrement de ces thèmes (leurs MP3 et leur entrée du manifeste) : la synthèse les joue
// Un empaquetage ne touche qu'aux thèmes qu'il trouve dans le dossier ; les autres gardent leurs fichiers.
// Il dit aussi, pour chaque film qui part d'une section de son thème (cinema/films : `musiqueDepuis`), si le
// master la nomme : sinon la musique du film partira du début (garder les noms que les films citent).
//
// POURQUOI DES BLOCS. Un thème de ville dure plus de quatre minutes ; décodé (flottants, stéréo), il pèse
// 85 Mo à 44,1 kHz, 92 à 48 kHz. Le lecteur ne garde que le bloc qui joue et le suivant (deux blocs de
// 54 s au plus : 40 Mio à 48 kHz), et il les télécharge au fil de l'eau. Un thème = au plus six fichiers :
//   bloc 0          l'introduction et la tête du PREMIER passage (jusqu'à `entree`, une mesure choisie
//                   quand la queue de l'introduction s'est tue), joué une fois ; coupé en deux (0 et 1)
//                   quand il dure plus de 12 s et qu'il reste un fichier : la première note n'attend que
//                   les 6 premières secondes ;
//   blocs … K       le SECOND passage (`boucle`), coupé en blocs de même longueur, qui tournent
//                   (`boucle_bloc` : le rang du premier).
// Après le bloc 0, le lecteur passe au second passage à la même place musicale (entree + longueur du
// corps) : le premier passage n'est jamais stocké en entier.
//
// POURQUOI ÇA NE S'ENTEND PAS. Chaque bloc déborde de son morceau (FONDU + MARGE avant, MARGE après). Une
// jointure est un fondu de FONDU échantillons posé JUSTE AVANT le point de jointure, entre deux signaux qui
// sont la même musique au même échantillon : deux décodages du même master (entre deux blocs), ou la fin
// du premier passage et celle du second (la boucle : la marge avant `boucle.debut` du bloc 1 est la fin du
// premier passage, qui coule dans le second sans couture — le master le garantit). Le décodeur MP3 ajoute un
// retard (le délai de l'encodeur et celui du décodeur, 1 105 échantillons) que la plupart des navigateurs
// retirent grâce à l'étiquette LAME : le même pour tous les fichiers d'un même encodage, donc les jointures
// restent alignées quel qu'il soit ; la MARGE le couvre jusqu'à 4 000 échantillons, et le lecteur le mesure
// en décodant l'ÉTALON (un clic à un échantillon connu). Les débuts de fichier tombent sur un pas de 1 764
// échantillons : décodés à 48 kHz (ou 32, 24, 16, 96…), deux blocs restent alignés à l'échantillon près.
//
// LE FORMAT : MP3, le seul que décodent tous les navigateurs visés (Chromium de Playwright compris, Safari
// d'iPhone, Android), 44,1 kHz stéréo, LAME en débit moyen (ABR) 160 kbit/s : les bits vont où la musique
// les demande (les cymbales, les queues de salle, le chœur), pour la taille d'un débit constant
// (1,2 Mo la minute, le budget en permet 5). Voir le rapport du lot pour les mesures.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const ICI = __dirname;
let SORTIE = path.join(ICI, 'musique', 'audio');
let MANIFESTE = path.join(SORTIE, 'manifeste.json');
// un autre dossier de sortie (--sortie) : un essai qui ne touche pas aux fichiers du jeu
function poserSortie(dossier) { SORTIE = path.resolve(dossier); MANIFESTE = path.join(SORTIE, 'manifeste.json'); }

// ── le contrat avec le lecteur (audio.js) ──
const FS = 44100;
const FONDU = 1024;          // échantillons : le fondu d'une jointure, posé juste avant elle (23 ms)
const MARGE = 4410;          // échantillons au-delà du fondu, de chaque côté d'un bloc : le retard d'un décodeur, les bords
const GRILLE = 1764;         // un début de fichier tombe sur ce pas (40 ms) : entier à 8, 11,025, 16, 22,05, 24, 32, 48, 88,2, 96 kHz
const BLOC_MAX = 54;         // s : deux blocs décodés à 48 kHz (flottants, stéréo) tiennent dans 40 Mio (41,9 Mo)
const FICHIERS_MAX = 6;      // par thème (l'artefact publié a 511 fichiers en tout)
const MO_MINUTE_MAX = 5;     // le budget : Mo de fichiers par minute de musique
const ENTREE = { min: 2, max: 20 };   // s : où l'introduction passe la main au second passage (après sa queue)
const PREMIER = { long: 12, court: 6 }; // s : un bloc d'introduction plus long que `long` se coupe en deux, le premier
                                        // de `court` s : la première note n'attend que lui (quand il reste un fichier)
const DEBIT = 160;           // kbit/s
const ENCODAGE = ['-codec:a', 'libmp3lame', '-b:a', DEBIT + 'k', '-abr', '1'];
const LUFS_CIBLE = -16;
const ETALON_CLIC = 4410;    // l'échantillon du clic de l'étalon

// ════════════════════════════════════════════════════════════════════ les WAV ══
function lireWav(fichier) {
  const b = fs.readFileSync(fichier);
  if (b.toString('ascii', 0, 4) !== 'RIFF' || b.toString('ascii', 8, 12) !== 'WAVE') throw new Error(fichier + ' : pas un WAV');
  let p = 12, fmt = null, data = null;
  while (p + 8 <= b.length) {
    const id = b.toString('ascii', p, p + 4);
    let n = b.readUInt32LE(p + 4);
    if (id === 'fmt ') {
      fmt = { format: b.readUInt16LE(p + 8), canaux: b.readUInt16LE(p + 10), sr: b.readUInt32LE(p + 12), bits: b.readUInt16LE(p + 22) };
      if (fmt.format === 0xFFFE && n >= 40) fmt.format = b.readUInt16LE(p + 32);   // WAVE_FORMAT_EXTENSIBLE : le sous-format
    } else if (id === 'data') {
      if (p + 8 + n > b.length) n = b.length - p - 8;   // un en-tête qui ment (écrit en flux) : jusqu'au bout
      data = { p: p + 8, n };
      break;
    }
    p += 8 + n + (n & 1);
  }
  if (!fmt || !data) throw new Error(fichier + ' : WAV sans fmt ou sans data');
  const oct = fmt.bits / 8, cadre = oct * fmt.canaux, N = Math.floor(data.n / cadre);
  if (!(fmt.canaux >= 1)) throw new Error(fichier + ' : aucun canal');
  const L = new Float32Array(N), R = new Float32Array(N);
  const lu = (q) => {
    if (fmt.format === 3) return oct === 4 ? b.readFloatLE(q) : b.readDoubleLE(q);
    if (fmt.format !== 1) throw new Error(fichier + ' : format ' + fmt.format + ' non lu (PCM ou flottant)');
    if (oct === 2) return b.readInt16LE(q) / 32768;
    if (oct === 3) return (b.readIntLE(q, 3)) / 8388608;
    if (oct === 4) return b.readInt32LE(q) / 2147483648;
    throw new Error(fichier + ' : ' + fmt.bits + ' bits non lus');
  };
  for (let i = 0; i < N; i++) {
    const q = data.p + i * cadre;
    L[i] = lu(q);
    R[i] = fmt.canaux > 1 ? lu(q + oct) : L[i];
  }
  return { sr: fmt.sr, L, R, bits: fmt.bits, format: fmt.format };
}

// un master en FLAC (24 bits) : le même contrat, deux fois moins de place qu'un WAV (les maquettes en ont vingt)
function lireFlac(fichier) {
  const out = ffmpeg(['-i', fichier, '-f', 'f32le', '-ac', '2', 'pipe:1']);
  const f = new Float32Array(out.buffer, out.byteOffset, out.byteLength / 4), n = f.length / 2;
  const L = new Float32Array(n), R = new Float32Array(n);
  for (let i = 0; i < n; i++) { L[i] = f[2 * i]; R[i] = f[2 * i + 1]; }
  const sr = +String(spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=sample_rate', '-of', 'csv=p=0', fichier]).stdout).trim();
  return { sr, L, R, bits: 24, format: 'flac' };
}
function fichierMaster(dossier, cle) {
  for (const ext of ['.wav', '.flac']) if (fs.existsSync(path.join(dossier, cle + ext))) return path.join(dossier, cle + ext);
  return null;
}
function lireAudio(fichier) { return /\.flac$/i.test(fichier) ? lireFlac(fichier) : lireWav(fichier); }
function ecrireFlac24(fichier, L, R) {
  ffmpeg(['-y', '-f', 'f32le', '-ar', String(FS), '-ac', '2', '-i', 'pipe:0', '-c:a', 'flac', '-sample_fmt', 's32', '-bits_per_raw_sample', '24', fichier], entrelace(L, R, 0, L.length));
}

// 24 bits (le contrat accepte 24 bits ou flottant) : la moitié de la place d'un flottant de 64, sans perte audible
function ecrireWav24(fichier, sr, L, R) {
  const N = L.length, b = Buffer.alloc(44 + N * 6);
  b.write('RIFF', 0); b.writeUInt32LE(36 + N * 6, 4); b.write('WAVE', 8); b.write('fmt ', 12);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(2, 22); b.writeUInt32LE(sr, 24);
  b.writeUInt32LE(sr * 6, 28); b.writeUInt16LE(6, 32); b.writeUInt16LE(24, 34);
  b.write('data', 36); b.writeUInt32LE(N * 6, 40);
  const q = (v) => Math.max(-8388608, Math.min(8388607, Math.round(v * 8388608)));
  for (let i = 0; i < N; i++) { b.writeIntLE(q(L[i]), 44 + i * 6, 3); b.writeIntLE(q(R[i]), 47 + i * 6, 3); }
  fs.writeFileSync(fichier, b);
}

function entrelace(L, R, a, b) {
  const n = b - a, f = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    const k = a + i;
    f[2 * i] = k >= 0 && k < L.length ? L[k] : 0;
    f[2 * i + 1] = k >= 0 && k < R.length ? R[k] : 0;
  }
  return Buffer.from(f.buffer, f.byteOffset, f.byteLength);
}

// ═════════════════════════════════════════════ l'intensité (UIT-R BS.1770-4) ══
// La pondération K (une étagère haute de +4 dB, un passe-haut à 38 Hz), recalculée pour la fréquence
// d'échantillonnage ; des blocs de 400 ms tous les 100 ms ; la porte absolue (−70 LUFS) puis la relative (−10 LU).
function biquadK(fs) {
  let f0 = 1681.974450955533, G = 3.999843853973347, Q = 0.7071752369554196;
  let K = Math.tan(Math.PI * f0 / fs);
  const Vh = Math.pow(10, G / 20), Vb = Math.pow(Vh, 0.4996667741545416);
  let a0 = 1 + K / Q + K * K;
  const pre = { b: [(Vh + Vb * K / Q + K * K) / a0, 2 * (K * K - Vh) / a0, (Vh - Vb * K / Q + K * K) / a0], a: [2 * (K * K - 1) / a0, (1 - K / Q + K * K) / a0] };
  f0 = 38.13547087602444; Q = 0.5003270373238773; K = Math.tan(Math.PI * f0 / fs);
  a0 = 1 + K / Q + K * K;
  const rlb = { b: [1, -2, 1], a: [2 * (K * K - 1) / a0, (1 - K / Q + K * K) / a0] };
  return [pre, rlb];
}
function filtreK(x, fs) {
  const [p, h] = biquadK(fs), y = new Float64Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0, z1 = 0, z2 = 0, w1 = 0, w2 = 0;
  for (let i = 0; i < x.length; i++) {
    const v = x[i];
    const u = p.b[0] * v + p.b[1] * x1 + p.b[2] * x2 - p.a[0] * y1 - p.a[1] * y2;
    x2 = x1; x1 = v; y2 = y1; y1 = u;
    const z = h.b[0] * u + h.b[1] * z1 + h.b[2] * z2 - h.a[0] * w1 - h.a[1] * w2;
    z2 = z1; z1 = u; w2 = w1; w1 = z;
    y[i] = z;
  }
  return y;
}
function intensite(L, R, fs, a, b) {
  a = a || 0; b = b == null ? L.length : b;
  const kl = filtreK(L.subarray(a, b), fs), kr = filtreK(R.subarray(a, b), fs);
  const bloc = Math.round(0.4 * fs), pas = Math.round(0.1 * fs), z = [];
  // les carrés cumulés : un bloc se lit en deux soustractions
  const c = new Float64Array(kl.length + 1);
  for (let i = 0; i < kl.length; i++) c[i + 1] = c[i] + kl[i] * kl[i] + kr[i] * kr[i];
  for (let i = 0; i + bloc <= kl.length; i += pas) z.push((c[i + bloc] - c[i]) / bloc);
  const lk = (m) => -0.691 + 10 * Math.log10(m + 1e-30);
  const abs = z.filter((m) => lk(m) > -70);
  if (!abs.length) return -99;
  const moy = abs.reduce((s, m) => s + m, 0) / abs.length;
  const rel = abs.filter((m) => lk(m) > lk(moy) - 10);
  return lk(rel.reduce((s, m) => s + m, 0) / rel.length);
}
// la crête vraie : quatre fois suréchantillonnée (un sinus cardinal fenêtré, 12 passages par zéro de chaque
// côté), calculée seulement autour des échantillons à moins de 6 dB de la crête d'échantillon
function creteVraie(L, R) {
  const P = 4, Z = 12, h = [];
  for (let p = 1; p < P; p++) {
    const t = [];
    for (let k = -Z + 1; k <= Z; k++) {
      const x = k - p / P, w = 0.42 + 0.5 * Math.cos(Math.PI * x / Z) + 0.08 * Math.cos(2 * Math.PI * x / Z);
      t.push(Math.abs(x) < 1e-9 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x) * w);
    }
    h.push(t);
  }
  let pic = 0;
  for (const x of [L, R]) for (let i = 0; i < x.length; i++) { const a = Math.abs(x[i]); if (a > pic) pic = a; }
  let vrai = pic;
  const seuil = pic * 0.5;
  for (const x of [L, R]) {
    for (let i = Z; i < x.length - Z; i++) {
      if (Math.abs(x[i]) < seuil && Math.abs(x[i + 1]) < seuil) continue;
      for (let p = 0; p < P - 1; p++) {
        const t = h[p];
        let s = 0;
        for (let k = -Z + 1, j = 0; k <= Z; k++, j++) s += x[i + k] * t[Z * 2 - 1 - j];
        const a = Math.abs(s);
        if (a > vrai) vrai = a;
      }
    }
  }
  return 20 * Math.log10(vrai + 1e-30);
}

// ═══════════════════════════════════════════════════════════════ l'encodage ══
function ffmpeg(args, entree) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error'].concat(args), { input: entree, maxBuffer: 1 << 30 });
  if (r.status !== 0) throw new Error('ffmpeg : ' + String(r.stderr || '').trim());
  return r.stdout;
}
// un MP3 du morceau [a, b) du master, écrit dans `fichier` (et rendu) ; sans étiquette ID3 (rien que la
// musique et l'étiquette LAME, qui dit le retard et le remplissage : c'est elle qui rend le décodage exact —
// ffmpeg la remplit à la fin de l'encodage en revenant au début du fichier, d'où un vrai fichier et pas un
// tuyau) ; `sansEtiquette` : sans l'étiquette LAME non plus (le banc simule ainsi un décodeur qui ne retire rien)
function encoderMp3(L, R, a, b, fichier, sansEtiquette) {
  ffmpeg(['-y', '-f', 'f32le', '-ar', String(FS), '-ac', '2', '-i', 'pipe:0'].concat(ENCODAGE)
    .concat(['-id3v2_version', '0', '-write_id3v1', '0', '-map_metadata', '-1', '-write_xing', sansEtiquette ? '0' : '1', '-f', 'mp3', fichier]), entrelace(L, R, a, b));
  return fs.readFileSync(fichier);
}
// décodé depuis le FICHIER : lu dans un tuyau, ffmpeg ne retire pas le remplissage de la fin
function decoderMp3(fichier) {
  const out = ffmpeg(['-i', fichier, '-f', 'f32le', '-ac', '2', '-ar', String(FS), 'pipe:1']);
  const f = new Float32Array(out.buffer, out.byteOffset, out.byteLength / 4), n = f.length / 2;
  const L = new Float32Array(n), R = new Float32Array(n);
  for (let i = 0; i < n; i++) { L[i] = f[2 * i]; R[i] = f[2 * i + 1]; }
  return { L, R };
}
// l'étalon : 0,3 s de silence et un clic (un sinus de 3 kHz dans une fenêtre de Hann, crête en ETALON_CLIC),
// encodé exactement comme les blocs ; le lecteur le décode et y lit le retard de son décodeur
function etalon(fichier, sansEtiquette) {
  const n = Math.round(0.3 * FS), L = new Float32Array(n), R = new Float32Array(n), W = 48;
  for (let i = -W; i <= W; i++) {
    const v = 0.7 * (0.5 + 0.5 * Math.cos(Math.PI * i / W)) * Math.cos(2 * Math.PI * 3000 * i / FS);
    L[ETALON_CLIC + i] = v; R[ETALON_CLIC + i] = v;
  }
  const mp3 = encoderMp3(L, R, 0, n, fichier, sansEtiquette);
  fs.rmSync(fichier, { force: true });
  return mp3;
}

// ═══════════════════════════════════════════════════════════ les masters lus ══
function lireMaster(dossier, cle) {
  const j = JSON.parse(fs.readFileSync(path.join(dossier, cle + '.json'), 'utf8'));
  const audio = fichierMaster(dossier, cle);
  if (!audio) throw new Error(cle + ' : ni ' + cle + '.wav ni ' + cle + '.flac dans ' + dossier);
  const w = lireAudio(audio);
  const faute = (m) => { throw new Error(cle + ' : ' + m); };
  if (j.cle !== cle) faute('« cle » vaut ' + JSON.stringify(j.cle));
  if (j.frequence !== FS || w.sr !== FS) faute('le master doit être à 44 100 Hz (json ' + j.frequence + ', wav ' + w.sr + ')');
  const I = j.intro && j.intro.fin, B0 = j.boucle && j.boucle.debut, B1 = j.boucle && j.boucle.fin;
  if (!(j.intro && j.intro.debut === 0)) faute('intro.debut doit valoir 0');
  if (!(I >= 0 && B0 >= I && B1 > B0)) faute('positions incohérentes : intro.fin ' + I + ', boucle ' + B0 + ' → ' + B1);
  const Lc = B1 - B0;
  if (Math.abs((B0 - I) - Lc) > 2) faute('le premier passage du corps (' + (B0 - I) + ' éch.) et le second (' + Lc + ') n\'ont pas la même longueur');
  if (w.L.length < B1 + MARGE) console.warn('  ' + cle + ' : la queue après boucle.fin est courte (' + (w.L.length - B1) + ' éch.) : complétée de silence');
  if (!(j.mesure_s > 0)) faute('mesure_s manquant');
  const sections = (j.sections || []).map((s) => ({ nom: String(s.nom), debut: s.debut, fin: s.fin, intro: s.intro, reprise: s.reprise, mesures: s.mesures }));
  for (const s of sections) if (!(s.fin > s.debut)) faute('section ' + s.nom + ' vide');
  // l'introduction : ses sections (`intro: true` ; sans le drapeau, celles qui finissent avant intro.fin) ; le
  // corps : celles du SECOND passage, dans l'ordre (une section jouée deux fois y paraît deux fois)
  const intro = sections.filter((s) => s.intro === true || (s.intro == null && s.fin <= I));
  const corps = sections.filter((s) => s.intro !== true && s.debut >= B0 && s.fin <= B1).sort((a, b) => a.debut - b.debut);
  if (!corps.length) faute('aucune section dans le second passage (boucle.debut → boucle.fin)');
  // le corps pavé de boucle.debut à boucle.fin, sans trou ni recouvrement (la position, la reprise en dépendent) ;
  // deux échantillons d'écart s'arrondissent
  const raccord = (x, y, ou) => { if (Math.abs(x - y) > 2) faute('sections du corps disjointes ' + ou + ' (' + x + ' / ' + y + ')'); };
  raccord(corps[0].debut, B0, 'au début du second passage'); corps[0].debut = B0;
  for (let i = 1; i < corps.length; i++) { raccord(corps[i].debut, corps[i - 1].fin, 'entre ' + corps[i - 1].nom + ' et ' + corps[i].nom); corps[i].debut = corps[i - 1].fin; }
  raccord(corps[corps.length - 1].fin, B1, 'à la fin du second passage'); corps[corps.length - 1].fin = B1;
  // le nombre de mesures de chaque section : le master le dit (un tempo qui change), sinon mesure_s
  for (const s of intro.concat(corps)) s.mesures = s.mesures >= 1 ? Math.round(s.mesures) : Math.max(1, Math.round((s.fin - s.debut) / (j.mesure_s * FS)));
  return { j, w, I, B0, B1, L: Lc, intro, corps };
}

// les exceptions de reprise : celles du master s'il en donne (`reprise.sauf` ; une section `reprise: false` le dit
// dans le manifeste, à son rang), sinon celles du thème de synthèse du même nom (musique/<clé>.js), pour les
// sections que le master a aussi
function repriseSauf(m, cle) {
  if (m.j.reprise && Array.isArray(m.j.reprise.sauf)) return m.j.reprise.sauf.map(String);
  try {
    const A = chargerSynthese();
    const def = A._definition && A._definition(cle);
    const sauf = def && def.reprise && def.reprise.sauf || [];
    const noms = new Set(m.corps.map((s) => s.nom));
    return sauf.filter((n) => noms.has(n));
  } catch (e) { return []; }
}
let SYNTHESE = null;
function chargerSynthese() {
  if (SYNTHESE) return SYNTHESE;
  const A = require(path.join(ICI, 'audio.js'));
  global.FusibleAudio = A;
  for (const f of require(path.join(ICI, 'musique_sources.js')).fichiers()) { try { require(f.chemin); } catch (e) { /* le thème se tait */ } }
  return (SYNTHESE = A);
}

// ═════════════════════════════════════════════════════════════ le découpage ══
// L'entrée : où le bloc 0 (l'introduction et la tête du premier passage) passe la main au second passage.
// Candidats : chaque mesure de ENTREE.min à ENTREE.max après l'introduction ; on garde celle où le premier et
// le second passage diffèrent le moins (la queue de l'introduction s'est tue, celle de la fin du corps aussi),
// la plus tôt à 3 dB près (un bloc 0 plus court : une première note plus tôt). Les mesures viennent des
// sections (celles du second passage, moins la longueur du corps) : un thème qui change de tempo les a
// de longueurs différentes.
function barresPremierPassage(m) {
  const l = [];
  for (const s of m.corps) for (let j = 0; j < s.mesures; j++) l.push(Math.round(s.debut - m.L + j * (s.fin - s.debut) / s.mesures));
  return l;
}
function choisirEntree(m) {
  const { w, I, L: Lc } = m;
  const ecart = (h) => {
    const a = Math.round(h - FONDU - 2048), b = Math.round(h + 2048);
    let d = 0, s = 0;
    for (let i = a; i < b; i++) {
      const k = i + Lc;
      const dl = w.L[i] - w.L[k], dr = w.R[i] - w.R[k];
      d += dl * dl + dr * dr; s += w.L[i] * w.L[i] + w.R[i] * w.R[i] + w.L[k] * w.L[k] + w.R[k] * w.R[k];
    }
    return { rel: 10 * Math.log10((d + 1e-20) / (s / 2 + 1e-20)), abs: 10 * Math.log10(d / (2 * (b - a)) + 1e-20) };
  };
  let meilleure = null;
  const barres = barresPremierPassage(m);
  for (let k = 1; k < barres.length; k++) {
    const h = barres[k];
    if (h - I < ENTREE.min * FS) continue;
    if (h - I > ENTREE.max * FS || h + FONDU + 4096 >= m.B0) break;
    const e = ecart(h);
    if (!meilleure || e.rel < meilleure.rel - 3) meilleure = Object.assign({ h, mesures: k }, e);
  }
  if (!meilleure) {   // une introduction et un corps trop courts pour chercher : la fin de l'introduction
    const h = I + Math.round(Math.min(ENTREE.min * FS, (m.B0 - I) / 2));
    meilleure = Object.assign({ h, mesures: 0 }, ecart(h));
  }
  return meilleure;
}

function decouper(m) {
  const { B0, B1, L: Lc } = m;
  const entree = choisirEntree(m);
  // le second passage en K blocs de même longueur (deux décodages du même master se joignent à l'échantillon
  // près n'importe où : pas besoin de couper sur une mesure, et deux blocs voisins pèsent le moins possible
  // ensemble, boucle comprise) ; K ≤ FICHIERS_MAX − 1
  let K = Math.max(1, Math.ceil(Lc / (BLOC_MAX * FS)));
  if (K > FICHIERS_MAX - 1) {
    console.warn('  ' + m.j.cle + ' : corps de ' + (Lc / FS).toFixed(0) + ' s : ' + (FICHIERS_MAX - 1) + ' blocs de plus de ' + BLOC_MAX + ' s (la mémoire dépassera 40 Mio à 48 kHz)');
    K = FICHIERS_MAX - 1;
  }
  const coupes = [B0];
  for (let k = 1; k < K; k++) coupes.push(B0 + Math.round(k * Lc / K));
  coupes.push(B1);
  const avant = FONDU + MARGE + 512, apres = MARGE + 512;
  const grille = (x) => Math.max(0, Math.floor(x / GRILLE) * GRILLE);
  // l'introduction (et la tête du premier passage) : un bloc, ou deux quand elle est longue et qu'il reste un
  // fichier — le premier, court, est tout ce que la première note attend (téléchargé, décodé)
  const blocs = [];
  if (entree.h > PREMIER.long * FS && K + 2 <= FICHIERS_MAX) {
    const c0 = Math.round(PREMIER.court * FS);
    blocs.push({ de: 0, a: c0, debut: 0, fin: c0 + apres }, { de: c0, a: entree.h, debut: grille(c0 - avant), fin: entree.h + apres });
  } else blocs.push({ de: 0, a: entree.h, debut: 0, fin: entree.h + apres });
  const premierBoucle = blocs.length;
  for (let k = 1; k <= K; k++) blocs.push({ de: coupes[k - 1], a: coupes[k], debut: grille(coupes[k - 1] - avant), fin: coupes[k] + apres });
  return { entree, blocs, premierBoucle };
}

// ══════════════════════════════════════════════════════════════ l'empaquetage ══
// les sections que les films citent (cinema/films/*.js : `musique` et `musiqueDepuis`) : un film part de là, et un
// master qui ne nomme pas la section le fait partir du début (audio.js) — l'empaquetage le dit
function sectionsDesFilms() {
  const dossier = path.join(ICI, 'cinema', 'films'), l = [];
  let fichiers = [];
  try { fichiers = fs.readdirSync(dossier).filter((f) => f.endsWith('.js')); } catch (e) { return l; }
  for (const f of fichiers) {
    const t = fs.readFileSync(path.join(dossier, f), 'utf8');
    const depuis = /musiqueDepuis\s*:\s*["']([^"']+)["']/.exec(t), theme = /\bmusique\s*:\s*["']([a-z0-9_]+)["']/.exec(t);
    if (depuis && theme) l.push({ film: f.replace(/\.js$/, ''), cle: theme[1], section: depuis[1] });
  }
  return l;
}

function empaqueter(dossier, cles) {
  fs.mkdirSync(SORTIE, { recursive: true });
  const films = sectionsDesFilms(), jeu = SORTIE === path.join(ICI, 'musique', 'audio');
  let manifeste = { version: 1, themes: {} };
  try { manifeste = JSON.parse(fs.readFileSync(MANIFESTE, 'utf8')); } catch (e) { /* un premier */ }
  if (!cles.length) cles = fs.readdirSync(dossier).filter((f) => /^[a-z][a-z0-9_]*\.json$/.test(f) && fichierMaster(dossier, f.slice(0, -5))).map((f) => f.slice(0, -5)).sort();
  if (!cles.length) throw new Error(dossier + ' : aucun master (<clé>.wav ou .flac, et <clé>.json)');
  const et = etalon(path.join(SORTIE, '.etalon.mp3'), false);
  manifeste.version = 1;
  manifeste.frequence = FS;
  manifeste.fondu = FONDU;
  manifeste.marge = MARGE;
  manifeste.encodage = { codec: 'mp3', debit: DEBIT, mode: 'abr', encodeur: 'LAME (ffmpeg libmp3lame)' };
  manifeste.etalon = { clic: ETALON_CLIC, mp3: et.toString('base64') };
  let total = 0;
  for (const cle of cles) {
    const t0 = Date.now();
    const m = lireMaster(dossier, cle);
    // la musique d'un film (film_<id>) n'a pas de synthèse : le lecteur des films la demande
    // (`musiqueFilm`), elle est dans THEMES dès que le manifeste la nomme
    if (jeu && !/^film_/.test(cle) && !fs.existsSync(path.join(ICI, 'musique', cle + '.js'))) console.warn('  ' + cle + ' : pas un thème du jeu (musique/' + cle + '.js absent) : la page ne le demandera pas, le juke-box le montrera');
    const { entree, blocs, premierBoucle } = decouper(m);
    for (const f of fs.readdirSync(SORTIE)) if (f.startsWith(cle + '.') && /\.mp3$/.test(f)) fs.rmSync(path.join(SORTIE, f));
    const sorties = [];
    let octets = 0, pireSnr = 99;
    blocs.forEach((b, k) => {
      const nom = cle + '.' + k + '.mp3';
      const mp3 = encoderMp3(m.w.L, m.w.R, b.debut, b.fin, path.join(SORTIE, nom));
      octets += mp3.length;
      // le contrôle : décodé (ffmpeg retire le retard grâce à l'étiquette), le bloc a la longueur de son
      // morceau et colle au master ; l'erreur du MP3 sur la partie jouée
      // (le remplissage de la fin n'est pas toujours tout retiré — l'étiquette en dit parfois moins que la vérité :
      // quelques dizaines d'échantillons de plus, APRÈS la marge, que le lecteur ne lit jamais ; le début, lui,
      // doit tomber juste : l'erreur plus bas le dirait)
      const d = decoderMp3(path.join(SORTIE, nom));
      if (d.L.length < b.fin - b.debut || d.L.length > b.fin - b.debut + 2304) throw new Error(nom + ' : décodé en ' + d.L.length + ' éch., ' + (b.fin - b.debut) + ' attendus');
      let e = 0, s = 0;
      for (let i = b.de - b.debut; i < b.a - b.debut; i++) {
        const x = i + b.debut, ml = x < m.w.L.length ? m.w.L[x] : 0, mr = x < m.w.R.length ? m.w.R[x] : 0;
        e += (d.L[i] - ml) ** 2 + (d.R[i] - mr) ** 2; s += ml * ml + mr * mr;
      }
      const snr = 10 * Math.log10((s + 1e-20) / (e + 1e-20));
      // décalé d'un seul échantillon, le décodé ne colle plus au master que de quelques décibels
      if (snr < 10) throw new Error(nom + ' : le décodé ne colle pas au master (' + snr.toFixed(1) + ' dB) : un décalage ?');
      if (snr < pireSnr) pireSnr = snr;
      sorties.push({ fichier: nom, debut: b.debut, fin: b.fin, de: b.de, a: b.a, octets: mp3.length, snr: +snr.toFixed(1) });
    });
    // la sonie : celle de la boucle (le contrat du studio : −16 LUFS) — ou de l'introduction pour une
    // musique de film (`sonie_sur: 'intro'` : la boucle n'y est qu'une traîne) ; la crête : tout ce qui se joue
    const lufs = m.j.sonie_sur === 'intro' ? intensite(m.w.L, m.w.R, FS, 0, m.j.intro.fin) : intensite(m.w.L, m.w.R, FS, m.B0, m.B1);
    const tp = creteVraie(m.w.L.subarray(0, m.B1), m.w.R.subarray(0, m.B1));
    const gainDb = Math.max(-6, Math.min(6, LUFS_CIBLE - lufs));
    if (Math.abs(LUFS_CIBLE - lufs) > 6) console.warn('  ' + cle + ' : ' + lufs.toFixed(1) + ' LUFS, loin de ' + LUFS_CIBLE + ' : le lecteur ne corrige que ±6 dB');
    // la musique du thème : l'introduction et un passage du corps (le reste est sa redite)
    const musique = m.B0 / FS, minutes = musique / 60, mo = octets / 1e6;
    const entreeTheme = {
      titre: m.j.titre || cle, bpm: m.j.bpm, mesure_s: m.j.mesure_s, lufs: +lufs.toFixed(2), crete_dbtp: +tp.toFixed(2), gain_db: +gainDb.toFixed(2),
      intro: [0, m.I], boucle: [m.B0, m.B1], entree: entree.h,
      // [nom, debut, fin, mesures] (et `false` : on n'y reprend jamais le thème)
      sections: m.intro.concat(m.corps).map((s) => s.reprise === false ? [s.nom, s.debut, s.fin, s.mesures, false] : [s.nom, s.debut, s.fin, s.mesures]),
      boucle_rang: m.intro.length, boucle_bloc: premierBoucle,
      reprise_sauf: repriseSauf(m, cle),
      blocs: sorties.map((s) => ({ fichier: s.fichier, debut: s.debut, fin: s.fin, de: s.de, a: s.a, octets: s.octets })),
      octets
    };
    if (m.j.provisoire) entreeTheme.provisoire = true;
    manifeste.themes[cle] = entreeTheme;
    total += octets;
    const verdicts = [];
    if (sorties.length > FICHIERS_MAX) verdicts.push(sorties.length + ' fichiers');
    if (mo / minutes > MO_MINUTE_MAX) verdicts.push((mo / minutes).toFixed(2) + ' Mo/min');
    const longs = sorties.slice(premierBoucle).map((s) => (s.a - s.de) / FS);
    console.log(`${cle.padEnd(11)} ${(musique / 60 | 0)}:${String(Math.round(musique % 60)).padStart(2, '0')} de musique · ${sorties.length} fichiers, ${mo.toFixed(2)} Mo (${(mo / minutes).toFixed(2)} Mo/min) · ` +
      `entrée à +${((entree.h - m.I) / FS).toFixed(1)} s (${entree.mesures} m., passages à ${entree.rel.toFixed(0)} dB) · blocs ${sorties.slice(0, premierBoucle).map((s) => ((s.a - s.de) / FS).toFixed(1)).join('/')} s + ${longs.map((x) => x.toFixed(1)).join('/')} s · ` +
      `MP3 ${pireSnr.toFixed(1)} dB au pire · ${lufs.toFixed(1)} LUFS, ${tp.toFixed(1)} dBTP · ${((Date.now() - t0) / 1000).toFixed(1)} s  ${verdicts.length ? '✗ ' + verdicts.join(', ') : '✓'}`);
    const noms = m.intro.concat(m.corps).map((s) => s.nom);
    films.filter((f) => f.cle === cle).forEach((f) => {
      if (noms.indexOf(f.section) < 0) console.warn(`  ! ${cle} : le film « ${f.film} » part de la section « ${f.section} », que ce master ne nomme pas (${noms.join(', ')}) : sa musique partira du début`);
      else console.log(`  ${cle} : le film « ${f.film} » part de « ${f.section} » ✓`);
    });
  }
  const tri = {};
  for (const k of Object.keys(manifeste.themes).sort()) tri[k] = manifeste.themes[k];
  manifeste.themes = tri;
  fs.writeFileSync(MANIFESTE, JSON.stringify(manifeste, null, 1) + '\n');
  const tous = Object.values(manifeste.themes).reduce((s, t) => s + t.octets, 0);
  const nf = Object.values(manifeste.themes).reduce((s, t) => s + t.blocs.length, 0);
  console.log(`→ ${path.relative(process.cwd(), SORTIE)}/ : ${cles.length} thème(s) empaqueté(s), ${(total / 1e6).toFixed(1)} Mo ; en tout ${Object.keys(manifeste.themes).length} thèmes, ${nf} fichiers, ${(tous / 1e6).toFixed(1)} Mo`);
}

function retirer(cles) {
  if (!cles.length) throw new Error('--retirer <clé> [clé …]');
  const manifeste = JSON.parse(fs.readFileSync(MANIFESTE, 'utf8'));
  for (const cle of cles) {
    for (const f of fs.readdirSync(SORTIE)) if (f.startsWith(cle + '.') && /\.mp3$/.test(f)) fs.rmSync(path.join(SORTIE, f));
    console.log(cle + (manifeste.themes[cle] ? ' : retiré' : ' : absent du manifeste'));
    delete manifeste.themes[cle];
  }
  fs.writeFileSync(MANIFESTE, JSON.stringify(manifeste, null, 1) + '\n');
}

// ══════════════════════════════════════════════════════════ les maquettes ══
// Le thème de synthèse rendu « nu » : sans le compresseur de sortie, la musique et le maître à 1 (le jeu les
// remet à la lecture), avec la petite pièce commune qu'il a en jeu. Le même ordonnancement que banc_son.js
// (des fenêtres de 2 s écrites 3 s d'avance) : le son de référence.
async function rendreMaquetteDansLaPage({ nom, queue }) {
  const A = window.FusibleAudio;
  const S = A.structure(nom), inf = A.infos(nom);
  const sr = 44100, debut = 0.05;
  const duree = debut + S.intro.secondes + 2 * S.corps.secondes + queue;
  const N = Math.ceil(sr * duree);
  const ctx = new OfflineAudioContext(2, N, sr);
  ctx.createDynamicsCompressor = undefined;
  const e = A.createEngine(ctx, ctx.destination, { seed: 1, pad: false, at: 0, qualite: 'pleine', musique: 1, master: 1, rendus: false });
  e.setYear(1990);
  e.setTheme(nom, { at: 0, fade: 0 });
  const PAS = 2;
  e.scheduleUntil(Math.min(duree, PAS + 1));
  for (let t = PAS; t < duree; t += PAS) {
    const tq = Math.round(t * sr / 128) * 128 / sr;
    ctx.suspend(tq).then(() => { e.scheduleUntil(Math.min(duree + 1, tq + PAS + 1)); ctx.resume(); });
  }
  const t0 = performance.now();
  const buf = await ctx.startRendering();
  window.__L = buf.getChannelData(0); window.__R = buf.getChannelData(1);
  return { N, debut, rendu: (performance.now() - t0) / 1000, S, inf, def: { reprise: A._definition ? (A._definition(nom) || {}).reprise || null : null } };
}

async function maquettes(dossier, cles) {
  const { chromium } = require('playwright');
  fs.mkdirSync(dossier, { recursive: true });
  const texte = require(path.join(ICI, 'musique_sources.js')).texte();
  const exe = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const page = await browser.newPage();
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(e.message));
  await page.setContent('<!doctype html><meta charset="utf-8"><script>' + texte.split('</script').join('<\\/script') + '</script>');
  const tous = await page.evaluate(() => window.FusibleAudio.THEMES);
  if (!cles.length) cles = tous.slice().sort();
  for (const nom of cles) {
    if (tous.indexOf(nom) < 0) { console.log(nom + ' : thème de synthèse inconnu'); continue; }
    const r = await page.evaluate(rendreMaquetteDansLaPage, { nom, queue: 3 });
    // les échantillons, par morceaux (base64 des flottants)
    const lire = async (canal) => {
      const out = new Float32Array(r.N);
      const pasM = 1 << 20;
      for (let i = 0; i < r.N; i += pasM) {
        const b64 = await page.evaluate(({ canal, i, n }) => {
          const a = window[canal].subarray(i, i + n), u = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
          let s = '';
          for (let k = 0; k < u.length; k += 0x8000) s += String.fromCharCode.apply(null, u.subarray(k, k + 0x8000));
          return btoa(s);
        }, { canal, i, n: pasM });
        const b = Buffer.from(b64, 'base64');
        out.set(new Float32Array(b.buffer, b.byteOffset, b.byteLength / 4), i);
      }
      return out;
    };
    const L0 = await lire('__L'), R0 = await lire('__R');
    await page.evaluate(() => { window.__L = window.__R = null; });
    // le thème part à 50 ms (setTheme sans fondu) : le master commence à sa première note
    const d = Math.round(r.debut * FS);
    let L = L0.subarray(d), R = R0.subarray(d);
    const S = r.S, M = S.mesure * FS;
    const pos = (s) => Math.round(s * FS);
    const I = pos(S.intro.secondes), B0 = pos(S.intro.secondes + S.corps.secondes), B1 = pos(S.intro.secondes + 2 * S.corps.secondes);
    const sections = [];
    let t = 0;
    // les sections au contrat du studio (docs/design/studio.md § 7) : l'introduction, puis le corps dans le second passage
    let rang = 0;
    S.sections.forEach((s) => { if (!s.boucle) { sections.push({ nom: s.nom, debut: pos(t), fin: pos(t + s.secondes), intro: true, rang: rang++, mesures: s.mesures }); t += s.secondes; } });
    t = S.intro.secondes + S.corps.secondes; rang = 0;
    S.sections.forEach((s) => { if (s.boucle) { sections.push({ nom: s.nom, debut: pos(t), fin: pos(t + s.secondes), intro: false, rang: rang++, mesures: s.mesures }); t += s.secondes; } });
    // le niveau : −16 LUFS sur la boucle (le contrat du studio), sauf si la crête vraie de ce qui se joue passait
    // au-dessus de −1 dBTP (alors moins : le lecteur rattrape l'écart par `gain_db`, sans limiteur qui changerait
    // le son de la synthèse)
    const lufs0 = intensite(L, R, FS, B0, B1), tp0 = creteVraie(L.subarray(0, B1), R.subarray(0, B1));
    const gDb = Math.min(LUFS_CIBLE - lufs0, -1 - tp0), g = Math.pow(10, gDb / 20);
    const Lg = new Float32Array(L.length), Rg = new Float32Array(R.length);
    for (let i = 0; i < L.length; i++) { Lg[i] = L[i] * g; Rg[i] = R[i] * g; }
    ecrireFlac24(path.join(dossier, nom + '.flac'), Lg, Rg);
    const json = {
      cle: nom, titre: r.inf.titre, bpm: r.inf.bpm, mesure_s: S.mesure, frequence: FS,
      intro: { debut: 0, fin: I }, boucle: { debut: B0, fin: B1 }, sections,
      lufs: +(lufs0 + gDb).toFixed(2), crete_dbtp: +(tp0 + gDb).toFixed(2), duree_s: +(L.length / FS).toFixed(3),
      provisoire: true, source: 'synthèse (musique/' + nom + '.js), rendue par le moteur du jeu',
      gain_synthese_db: +gDb.toFixed(3)
    };
    if (r.def.reprise) json.reprise = r.def.reprise;
    fs.writeFileSync(path.join(dossier, nom + '.json'), JSON.stringify(json, null, 1) + '\n');
    console.log(`${nom.padEnd(11)} ${(L.length / FS).toFixed(1)} s rendus en ${r.rendu.toFixed(1)} s · nu ${lufs0.toFixed(1)} LUFS, ${tp0.toFixed(1)} dBTP → ${gDb >= 0 ? '+' : ''}${gDb.toFixed(1)} dB : ${json.lufs} LUFS, ${json.crete_dbtp} dBTP`);
  }
  if (erreurs.length) console.log('erreurs de la page : ' + erreurs.join(' | '));
  await browser.close();
}

// ════════════════════════════════════════════════════════════════ la ligne ══
function args() {
  const a = process.argv.slice(2), o = { cles: [], masters: null, maquettes: null, verifier: false, out: null, retirer: false };
  for (let i = 0; i < a.length; i++) {
    const x = a[i];
    if (x === '--masters') o.masters = path.resolve(a[++i]);
    else if (x === '--maquettes') o.maquettes = path.resolve(a[++i]);
    else if (x === '--verifier') o.verifier = true;
    else if (x === '--retirer') o.retirer = true;
    else if (x === '--out') o.out = path.resolve(a[++i]);
    else if (x === '--sortie') poserSortie(a[++i]);
    else if (x === '-h' || x === '--help') {
      const l = fs.readFileSync(__filename, 'utf8').split('\n').slice(1), n = l.findIndex((s) => /^\/\/ POURQUOI DES BLOCS/.test(s));
      console.log(l.slice(0, n > 0 ? n - 1 : 30).map((s) => s.replace(/^\/\/ ?/, '')).join('\n'));
      process.exit(0);
    } else if (x.startsWith('--')) { console.error('musique_audio : option inconnue ' + x); process.exit(2); }
    else o.cles.push(x);
  }
  return o;
}

async function main() {
  const o = args();
  if (o.maquettes) return maquettes(o.maquettes, o.cles);
  if (o.verifier) return require(path.join(ICI, 'musique_audio_banc.js')).verifier(o);
  if (o.retirer) return retirer(o.cles);
  if (!o.masters) { console.error('musique_audio : --masters <dossier> (ou --maquettes <dossier>, --verifier ; -h)'); process.exit(2); }
  empaqueter(o.masters, o.cles);
}

module.exports = {
  lireWav, lireAudio, fichierMaster, ecrireWav24, intensite, creteVraie, encoderMp3, decoderMp3, etalon, decouper, lireMaster,
  poserSortie, FS, FONDU, MARGE, GRILLE, ETALON_CLIC,
  get SORTIE() { return SORTIE; }, get MANIFESTE() { return MANIFESTE; }
};
if (require.main === module) main().catch((e) => { console.error('musique_audio : ' + (e && e.message ? e.message : e)); process.exit(1); });
