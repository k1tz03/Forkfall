/* ═══════════════════════════════════════════════════════════════════════════
   LE CONTRÔLE — ce que chaque livrable doit tenir, mesuré sur le fichier : ffprobe
   (H.264 High, yuv420p, BT.709, 30 i/s, AAC 48 kHz stéréo, +faststart), le poids
   (≤ 15 Mo par minute en 1080 × 1920 pour les réseaux), le niveau (−14 LUFS, vraie
   crête ≤ −1 dBTP), la durée (15 à 30 s pour l'App Store) ; et la planche contact
   (une image par seconde) qu'on regarde avant de livrer.
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const C = require('./commun');
const MU = require('./musique');

// +faststart : l'atome moov avant mdat (le lecteur commence avant d'avoir tout reçu)
function faststart(fichier) {
  const fd = fs.openSync(fichier, 'r'), b = Buffer.alloc(8);
  let pos = 0, ordre = [];
  const taille = fs.fstatSync(fd).size;
  while (pos < taille && ordre.length < 12) {
    fs.readSync(fd, b, 0, 8, pos);
    let n = b.readUInt32BE(0);
    const type = b.toString('latin1', 4, 8);
    if (n === 1) { const g = Buffer.alloc(8); fs.readSync(fd, g, 0, 8, pos + 8); n = Number(g.readBigUInt64BE(0)); }
    ordre.push(type);
    if (n < 8) break;
    pos += n;
  }
  fs.closeSync(fd);
  return ordre.indexOf('moov') >= 0 && ordre.indexOf('moov') < ordre.indexOf('mdat');
}

function verifier(fichier, fmt) {
  const F = C.FORMATS[fmt];
  const p = C.ffprobe(fichier);
  const v = p.streams.find((s) => s.codec_type === 'video'), a = p.streams.find((s) => s.codec_type === 'audio');
  const duree = +p.format.duration, octets = +p.format.size;
  const n = MU.niveau(fichier);
  const r = {
    fichier, format: fmt, duree: +duree.toFixed(3), octets, mo: +(octets / 1e6).toFixed(2), mio: +(octets / 1048576).toFixed(2),
    mo_par_minute: +(octets / 1e6 / duree * 60).toFixed(2), kbit_s: Math.round(octets * 8 / duree / 1000),
    video: { codec: v.codec_name, profil: v.profile, niveau: v.level, l: v.width, h: v.height, pix: v.pix_fmt, fps: v.r_frame_rate, kbit_s: Math.round((+v.bit_rate || 0) / 1000),
      couleur: [v.color_space, v.color_primaries, v.color_transfer, v.color_range].join('/') },
    audio: a ? { codec: a.codec_name, profil: a.profile, hz: +a.sample_rate, canaux: a.channels, kbit_s: Math.round((+a.bit_rate || 0) / 1000) } : null,
    faststart: faststart(fichier), niveau: n,
  };
  const ecarts = [];
  if (v.codec_name !== 'h264' || v.profile !== 'High') ecarts.push('pas en H.264 High');
  if (v.pix_fmt !== 'yuv420p') ecarts.push('pas en yuv420p');
  if (v.width !== F.l || v.height !== F.h) ecarts.push('taille ' + v.width + '×' + v.height);
  if (v.r_frame_rate !== '30/1') ecarts.push('cadence ' + v.r_frame_rate);
  if (v.color_space !== 'bt709') ecarts.push('pas BT.709');
  if (!r.faststart) ecarts.push('pas de +faststart');
  if (!a || a.codec_name !== 'aac' || +a.sample_rate !== 48000 || a.channels !== 2) ecarts.push('son : pas AAC 48 kHz stéréo');
  if (fmt !== 'appstore' && r.mo_par_minute > 15) ecarts.push('plus de 15 Mo par minute');
  if (fmt === 'appstore' && (duree < 15 || duree > 30)) ecarts.push('durée hors de 15–30 s');
  if (fmt === 'appstore' && r.kbit_s > 10000) ecarts.push('plus de 10 Mbit/s');
  if (n.I != null && Math.abs(n.I + 14) > 1) ecarts.push('niveau ' + n.I + ' LUFS');
  if (n.TP != null && n.TP > -1) ecarts.push('vraie crête ' + n.TP + ' dBTP');
  r.ecarts = ecarts;
  r.resume = v.width + '×' + v.height + ' ' + r.duree.toFixed(2) + ' s · ' + r.mo + ' Mo (' + r.mo_par_minute + ' Mo/min) · ' + r.kbit_s + ' kbit/s · ' +
    (n.I != null ? n.I.toFixed(1) + ' LUFS, ' + n.TP.toFixed(1) + ' dBTP' : '') + (ecarts.length ? ' ✗ ' + ecarts.join(', ') : ' ✓');
  return r;
}

// la planche : une image par seconde, en grille
function planche(video, sortie, fmt) {
  C.assurer(path.dirname(sortie));
  const d = C.duree(video), n = Math.max(1, Math.round(d));
  const large = fmt === '16x9';
  const cols = large ? 6 : 10, tuile = large ? 320 : 180;
  C.ffmpeg(['-i', video, '-vf', 'fps=1,scale=' + tuile + ':-2,tile=' + cols + 'x' + Math.ceil(n / cols) + ':padding=4:margin=4:color=0x161016', '-frames:v', '1', '-q:v', '3', '-update', '1', sortie], 'planche');
  return sortie;
}

function ecrireRapport(d, id, bilan) {
  const f = path.join(C.assurer(d.livrables), 'rapport.json');
  let r = {};
  try { r = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { r = {}; }
  r[id] = r[id] || {};
  for (const b of bilan) r[id][b.format] = b;
  fs.writeFileSync(f, JSON.stringify(r, null, 1));
}

// une image livrée (capture, bannière) : sa taille, ses pixels (Apple refuse l'alpha), son poids
function verifierImage(fichier, l, h) {
  const s = C.ffprobe(fichier).streams[0];
  const ecarts = [];
  if (s.width !== l || s.height !== h) ecarts.push('taille ' + s.width + '×' + s.height);
  if (/a/.test(String(s.pix_fmt).replace(/^gray/, ''))) ecarts.push('alpha (' + s.pix_fmt + ')');
  return { fichier, l: s.width, h: s.height, pix: s.pix_fmt, ko: Math.round(fs.statSync(fichier).size / 1024), ecarts };
}

// relire tous les livrables : les bandes (bandes_annonces/*.mp4), les captures, la bannière ; le
// rapport est refait de ce qui est là
function verifierTout(o) {
  const d = C.dossiers(o);
  const dir = path.join(d.livrables, 'bandes_annonces');
  const f0 = path.join(C.assurer(d.livrables), 'rapport.json');
  const rapport = {};
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.mp4')).sort()) {
      const m = f.match(/^(.+)\.(9x16|16x9|4x5|appstore)\.mp4$/);
      if (!m) continue;
      const v = verifier(path.join(dir, f), m[2]);
      (rapport[m[1]] = rapport[m[1]] || {})[m[2]] = v;
      C.journal(f.padEnd(26) + v.resume);
    }
  }
  // les captures : livrables/captures/<bande>/<magasin>/NN_*.png
  const TAILLES = { apple: [1290, 2796], google: [1080, 1920] };
  const cap = path.join(d.livrables, 'captures');
  if (fs.existsSync(cap)) {
    for (const id of fs.readdirSync(cap).sort()) {
      for (const mg of Object.keys(TAILLES)) {
        const dm = path.join(cap, id, mg);
        if (!fs.existsSync(dm)) continue;
        const liste = fs.readdirSync(dm).filter((x) => /^\d\d_.*\.png$/.test(x)).sort().map((x) => verifierImage(path.join(dm, x), TAILLES[mg][0], TAILLES[mg][1]));
        ((rapport[id] = rapport[id] || {}).captures = rapport[id].captures || {})[mg] = liste;
        const mauvais = liste.filter((x) => x.ecarts.length);
        C.journal(('captures ' + id + ' ' + mg).padEnd(26) + liste.length + ' PNG ' + TAILLES[mg].join('×') +
          (mauvais.length ? ' ✗ ' + mauvais.map((x) => path.basename(x.fichier) + ' : ' + x.ecarts.join(', ')).join(' ; ') : ' ✓'));
      }
    }
  }
  const fg = path.join(d.livrables, 'feature_graphic.png');
  if (fs.existsSync(fg)) {
    const b = rapport.feature_graphic = verifierImage(fg, 1024, 500);
    C.journal('feature_graphic.png'.padEnd(26) + b.l + '×' + b.h + ' ' + b.pix + ' ' + b.ko + ' Ko' + (b.ecarts.length ? ' ✗ ' + b.ecarts.join(', ') : ' ✓'));
  }
  fs.writeFileSync(f0, JSON.stringify(rapport, null, 1));
  C.journal('le rapport : ' + f0);
}

module.exports = { verifier, verifierImage, planche, ecrireRapport, verifierTout, faststart };
