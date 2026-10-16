/* ═══════════════════════════════════════════════════════════════════════════
   LA MUSIQUE D'UNE BANDE — le thème rendu par le banc (banc_son.js : le vrai
   moteur du jeu, hors ligne), monté sur ses mesures, mis au niveau des réseaux.

   La configuration (une par montage) :
     musique: {
       theme: 'accueil',                     // la clé (musique/<clé>.js)
       morceaux: [                           // bout à bout, coupés sur la barre de mesure
         { depuis: 'amorce', de: 0, a: 29 }, // le rendu part de cette section ; mesures [de, a[
       ],
       fondu: { entree: 0, sortie: 2.5 },    // secondes
       niveau: -14, crete: -1,               // LUFS intégrés, dBTP (vrai crête)
     }
   La durée d'une bande est celle de sa musique : la somme des mesures. Une mesure dure
   240 / bpm secondes (« Fusible », 116 : 2,069 s ; « Trois mille masques », 120 : 2 s).
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const C = require('./commun');

// le tempo d'un thème, lu dans sa partition (musique/<clé>.js : `bpm: 116`)
function bpmDe(cle) {
  const f = path.join(C.WEB, 'musique', cle + '.js');
  const m = fs.existsSync(f) ? fs.readFileSync(f, 'utf8').match(/\bbpm:\s*(\d+(?:\.\d+)?)/) : null;
  if (!m) throw new Error('le thème « ' + cle + ' » n\'a pas de bpm (musique/' + cle + '.js)');
  return +m[1];
}

// ─── un rendu du banc (gardé : la même clé, la même section ; la durée arrondie à 10 s)
function rendre(cle, depuis, duree, dossier) {
  duree = Math.ceil(duree / 10) * 10;
  const nom = cle + '__' + (depuis == null ? 'debut' : depuis) + '__' + duree;
  const dir = C.assurer(path.join(dossier, 'rendus', nom));
  const wav = path.join(dir, cle + '.wav'), json = path.join(dir, 'banc.json');
  if (!(fs.existsSync(wav) && fs.existsSync(json))) {
    C.journal('musique : le banc rend « ' + cle + ' » depuis ' + (depuis == null ? 'le début' : depuis) + ', ' + Math.ceil(duree) + ' s…');
    const args = [path.join(C.WEB, 'banc_son.js'), '--duree', String(Math.ceil(duree)), '--out', dir, '--sans-images'];
    if (depuis != null) args.push('--depuis', String(depuis));
    args.push(cle);
    const r = spawnSync('nice', ['-n', '10', 'node'].concat(args), { stdio: ['ignore', 'pipe', 'pipe'], env: Object.assign({}, process.env, { NODE_PATH: C.NODE_PATH }), maxBuffer: 1 << 24 });
    if (r.status !== 0 || !fs.existsSync(wav)) throw new Error('banc_son : ' + String(r.stderr || r.stdout).slice(-1500));
  }
  const b = JSON.parse(fs.readFileSync(json, 'utf8')).themes[cle];
  const M = 240 / b.bpm;
  // le temps de chaque barre de mesure : celles que le banc a mesurées, puis au pas de la mesure
  const t0 = b.mesures.length ? b.mesures[0].t : 0.05;
  return { wav, bpm: b.bpm, mesure: M, t: (i) => (i < b.mesures.length ? b.mesures[i].t : t0 + i * M), sections: b.mesures.map((m) => m.section + ' ' + m.m) };
}

// ─── le niveau : intégré (LUFS), vraie crête (dBTP), plage (LU) — le scanner EBU R128 de ffmpeg
function niveau(fichier) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', fichier, '-map', '0:a:0', '-af', 'ebur128=peak=true', '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 1 << 26 });
  const s = String(r.stderr || '');
  const bloc = s.slice(s.lastIndexOf('Summary:'));
  const lire = (re) => { const m = bloc.match(re); return m ? +m[1] : null; };
  return { I: lire(/I:\s+(-?[\d.]+) LUFS/), LRA: lire(/LRA:\s+(-?[\d.]+) LU/), TP: lire(/Peak:\s+(-?[\d.]+) dBFS/) };
}

// ─── monter la musique d'un montage → un WAV 48 kHz stéréo, à son niveau
function monterMusique(spec, dossier, nom) {
  if (!spec || !spec.theme) throw new Error('la musique : pas de thème');
  const sortie = path.join(C.assurer(dossier), nom + '.wav');
  const cle = C.empreinte({ spec, v: 5 });
  const fj = sortie.replace(/\.wav$/, '.json');
  if (fs.existsSync(sortie) && fs.existsSync(fj)) {
    const vieux = JSON.parse(fs.readFileSync(fj, 'utf8'));
    if (vieux.cle === cle) return vieux;
  }
  const morceaux = spec.morceaux && spec.morceaux.length ? spec.morceaux : [{ depuis: null, de: 0, a: spec.mesures || 30 }];
  const tmp = C.assurer(path.join(dossier, 'tmp'));
  const XF = 0.04;   // le fondu de chaque collure (40 ms : pas de clic, pas de trou)
  const pieces = [];
  const M = 240 / bpmDe(spec.theme);
  let total = 0;
  morceaux.forEach((m, i) => {
    const r = rendre(spec.theme, m.depuis, 0.05 + (m.a + 1.5) * M + 3, dossier);
    const de = r.t(m.de), a = r.t(m.a) + (i < morceaux.length - 1 ? XF : 0);
    const f = path.join(tmp, nom + '_' + i + '.wav');
    C.ffmpeg(['-i', r.wav, '-af', 'atrim=start=' + de.toFixed(5) + ':end=' + a.toFixed(5) + ',asetpts=N/SR/TB,aresample=48000', '-ac', '2', '-c:a', 'pcm_s16le', f], 'morceau ' + i);
    pieces.push(f);
    total += (m.a - m.de) * M;
  });
  // bout à bout, la collure en fondu enchaîné court
  let brut = path.join(tmp, nom + '_brut.wav');
  if (pieces.length === 1) fs.copyFileSync(pieces[0], brut);
  else {
    const ins = [], g = [];
    pieces.forEach((p) => ins.push('-i', p));
    let prec = '[0:a]';
    for (let i = 1; i < pieces.length; i++) {
      const o = i === pieces.length - 1 ? '[x]' : '[c' + i + ']';
      g.push(prec + '[' + i + ':a]acrossfade=d=' + XF + ':c1=tri:c2=tri' + o);
      prec = o;
    }
    C.ffmpeg(ins.concat(['-filter_complex', g.join(';'), '-map', '[x]', '-c:a', 'pcm_s16le', brut]), 'collures');
  }
  // les fondus, et la durée juste (la somme des mesures)
  const f = spec.fondu || {};
  const af = ['atrim=end=' + total.toFixed(5)];
  if (f.entree) af.push('afade=t=in:st=0:d=' + f.entree);
  if (f.sortie) af.push('afade=t=out:st=' + (total - f.sortie).toFixed(3) + ':d=' + f.sortie + ':curve=qsin');
  const pret = path.join(tmp, nom + '_pret.wav');
  C.ffmpeg(['-i', brut, '-af', af.join(','), '-c:a', 'pcm_s24le', pret], 'fondus');
  // le niveau des réseaux : on vise `niveau` LUFS, la crête limitée sous `crete` dBTP
  const cible = spec.niveau == null ? -14 : spec.niveau, plafond = spec.crete == null ? -1 : spec.crete;
  const n0 = niveau(pret);
  let gain = cible - n0.I, n = null;
  // la crête des échantillons, bien sous la vraie crête visée : l'AAC des livrables relève les crêtes
  // entre les échantillons (mesuré : jusqu'à 1,4 dB sur « livre_h3 » à 256 kbit/s)
  const limite = Math.pow(10, (plafond - (spec.marge == null ? 2.6 : spec.marge)) / 20);
  for (let k = 0; k < 4; k++) {
    C.ffmpeg(['-i', pret, '-af', 'volume=' + gain.toFixed(2) + 'dB,alimiter=limit=' + limite.toFixed(4) + ':attack=4:release=80:level=false,aresample=48000',
      '-c:a', 'pcm_s24le', sortie], 'niveau');
    n = niveau(sortie);
    if (Math.abs(n.I - cible) <= 0.25) break;
    gain += cible - n.I;
  }
  const res = { cle, wav: sortie, theme: spec.theme, duree: +total.toFixed(4), mesure: M, bpm: +(240 / M).toFixed(3), mesures: morceaux.reduce((s, m) => s + m.a - m.de, 0),
    avant: n0, apres: n, gain: +gain.toFixed(2) };
  fs.writeFileSync(fj, JSON.stringify(res, null, 1));
  C.journal('musique « ' + nom + ' » : ' + res.mesures + ' mesures, ' + res.duree.toFixed(2) + ' s ; ' + (n0.I != null ? n0.I.toFixed(1) : '?') + ' → ' + n.I.toFixed(1) + ' LUFS, crête ' + n.TP.toFixed(1) + ' dBTP');
  return res;
}

// ─── toutes les musiques d'une bande (une par montage)
async function musiques(cfg, o) {
  const d = C.dossiers(o);
  const dossier = path.join(d.travail, cfg.id, 'musique');
  const out = {};
  for (const [nom, mt] of Object.entries(cfg.montages || {})) out[nom] = monterMusique(mt.musique || cfg.musique, dossier, nom);
  return out;
}

module.exports = { bpmDe, rendre, niveau, monterMusique, musiques };
