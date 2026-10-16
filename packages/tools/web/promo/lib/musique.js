/* ═══════════════════════════════════════════════════════════════════════════
   LA MUSIQUE D'UNE BANDE — le thème, monté sur ses mesures, mis au niveau des
   réseaux. Deux sources, le même montage :
     · le MASTER DU STUDIO (docs/design/studio.md § 7), s'il existe pour le thème :
       <dossier>/<clé>.wav (44,1 kHz, 24 bits, un master continu) et <clé>.json
       (le contrat : l'introduction, la boucle, chaque section avec ses mesures) ;
       le dossier : `--musique-studio <dossier>` ou FUSIBLE_MUSIQUE_STUDIO
       (plusieurs, séparés par « : ») ;
     · sinon LE BANC (banc_son.js : la partition synthétisée du jeu, hors ligne).

   La configuration (une par montage) :
     musique: {
       theme: 'accueil',                     // la clé (musique/<clé>.js, ou le master <clé>.wav)
       morceaux: [                           // bout à bout, coupés sur la barre de mesure
         { depuis: 'amorce', de: 0, a: 29 }, // depuis cette section (null : le début) ; mesures [de, a[
       ],
       studio: { morceaux: [ … ] },          // facultatif : d'autres morceaux pour le master
       fondu: { entree: 0, sortie: 2.5 },    // secondes
       niveau: -14, crete: -1,               // LUFS intégrés, dBTP (vrai crête)
     }
   La durée d'une bande est celle de sa musique : la somme des mesures. Au banc, une mesure
   dure 240 / bpm secondes (« Fusible », 116 : 2,069 s ; « Trois mille masques », 120 : 2 s).
   Au master, chaque section a ses mesures (son tempo, sa rampe) : les barres se lisent dans le
   JSON (`debut`, `fin`, `mesures`), et le montage coupe ses plans sur ces barres-là (`barres`).
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const C = require('./commun');

const XF = 0.04;   // le fondu de chaque collure (40 ms : pas de clic, pas de trou)

// le tempo d'un thème, lu dans sa partition (musique/<clé>.js : `bpm: 116`)
function bpmDe(cle) {
  const f = path.join(C.WEB, 'musique', cle + '.js');
  const m = fs.existsSync(f) ? fs.readFileSync(f, 'utf8').match(/\bbpm:\s*(\d+(?:\.\d+)?)/) : null;
  if (!m) throw new Error('le thème « ' + cle + ' » n\'a pas de bpm (musique/' + cle + '.js)');
  return +m[1];
}

// ═══ LE MASTER DU STUDIO ═════════════════════════════════════════════════════

function dossiersStudio() {
  const v = process.env.FUSIBLE_MUSIQUE_STUDIO;
  return v ? String(v).split(path.delimiter).filter(Boolean).map((d) => path.resolve(d)) : [];
}

// les rampes de tempo d'une partition du studio (packages/tools/studio/partitions/<clé>.py :
// `@theme.section('D2', mesures=2, bpm=(96, 72))`) — le JSON ne les donne pas, et dans une rampe
// les mesures n'ont pas la même durée. Une partition absente : des mesures égales (exact hors rampe).
const RAMPES = {};
function rampesPartition(cle) {
  if (RAMPES[cle]) return RAMPES[cle];
  const r = {};
  const f = path.join(C.DEPOT, 'packages', 'tools', 'studio', 'partitions', cle + '.py');
  if (fs.existsSync(f)) {
    const re = /@theme\.section\(\s*['"]([^'"]+)['"]([^\n]*)/g;
    const src = fs.readFileSync(f, 'utf8');
    let m;
    while ((m = re.exec(src))) {
      const b = m[2].match(/\bbpm\s*=\s*[([]\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)/);
      if (b) r[m[1]] = [+b[1], +b[2]];
    }
  }
  return (RAMPES[cle] = r);
}

// où tombent les barres d'une section, de 0 (son début) à 1 (sa fin). Le studio fait varier le
// tempo linéairement en temps (rendu.py, CarteTempo) : de t0 à t1 bpm sur la section, la barre k
// sur m tombe à ln(1 + (q − 1)·k/m) / ln(q), q = t1/t0 (k/m sans rampe). `cle` : la partition (la
// clé écrite dans le JSON du master, celle qui l'a rendu)
function fractions(s, cle) {
  let q = null;
  if (Array.isArray(s.bpm) && s.bpm.length === 2 && s.bpm[0] > 0) q = s.bpm[1] / s.bpm[0];
  else { const r = rampesPartition(cle)[s.nom]; if (r && r[0] > 0) q = r[1] / r[0]; }
  const out = [];
  for (let k = 0; k <= s.mesures; k++) out.push(q && Math.abs(q - 1) > 1e-9 ? Math.log(1 + (q - 1) * k / s.mesures) / Math.log(q) : k / s.mesures);
  return out;
}

// le master d'un thème, s'il y en a un dans les dossiers du studio (lu une fois, vérifié)
const MASTERS = {};
function masterDe(cle) {
  for (const d of dossiersStudio()) {
    const wav = path.join(d, cle + '.wav'), json = path.join(d, cle + '.json');
    if (!(fs.existsSync(wav) && fs.existsSync(json))) continue;
    const st = fs.statSync(wav), brut = fs.readFileSync(json, 'utf8');
    const k = json + '|' + st.size + '|' + st.mtimeMs + '|' + C.empreinte(brut);
    if (MASTERS[k]) return MASTERS[k];
    const J = JSON.parse(brut);
    const faute = (q) => { throw new Error('le master ' + json + ' : ' + q); };
    if (!J.frequence || !J.boucle || !Array.isArray(J.sections)) faute('ni frequence, ni boucle, ni sections (studio.md § 7)');
    const intro = J.sections.filter((s) => s.intro), corps = J.sections.filter((s) => !s.intro);
    if (!corps.length) faute('pas de section dans le corps');
    const b0 = J.boucle.debut, b1 = J.boucle.fin, L = b1 - b0;
    if (!(L > 0)) faute('une boucle vide');
    if (corps[0].debut !== b0) faute('la première section du corps ne commence pas la boucle');
    for (const s of J.sections) if (!(s.mesures > 0) || !(s.fin > s.debut)) faute('la section ' + s.nom + ' n\'a ni mesures ni longueur');
    MASTERS[k] = { cle, wav, json, J, sr: J.frequence, b0, b1, L, intro, corps, n: J.echantillons || null,
      empreinte: C.empreinte({ json: brut, wav: st.size, t: Math.round(st.mtimeMs) }) };
    return MASTERS[k];
  }
  return null;
}

// les barres de mesure du master, en échantillons « virtuels », depuis une section : l'introduction,
// puis le corps sans fin — son premier passage, le second, puis le second encore (boucler
// boucle.fin → boucle.debut, c'est jouer la suite, au bit près : studio.md § 7). Les sections du JSON
// sont celles du second passage ; le premier est le même, L échantillons plus tôt. `n` mesures :
// n + 1 barres (la dernière ferme la dernière mesure).
function barresMaster(ms, depuis, fois, n) {
  // (sans section : la première barre du master, celle de l'introduction, ou du corps s'il n'y en a pas)
  let debut = ms.intro.length ? ms.intro[0].debut : ms.corps[0].debut - ms.L;
  if (depuis != null) {
    const dans = ms.intro.filter((s) => s.nom === depuis), corps = ms.corps.filter((s) => s.nom === depuis);
    const s = (dans.length ? dans : corps)[fois || 0];
    if (!s) throw new Error('la section « ' + depuis + ' »' + (fois ? ' (fois ' + fois + ')' : '') + ' n\'est pas dans le master ' + ms.cle + ' (sections : ' +
      ms.J.sections.map((x) => x.nom).join(', ') + ') : écrire musique.studio.morceaux');
    debut = dans.length ? s.debut : s.debut - ms.L;
  }
  const barres = [];
  const poser = (s, decal) => {
    const f = fractions(s, ms.J.cle || ms.cle);
    for (let k = 0; k < s.mesures; k++) { const v = Math.round(decal + s.debut + f[k] * (s.fin - s.debut)); if (v >= debut) barres.push(v); }
  };
  for (const s of ms.intro) poser(s, 0);
  for (let passe = 0; barres.length < n + 1 && passe < 1000; passe++) for (const s of ms.corps) poser(s, (passe - 1) * ms.L);
  if (barres[0] !== debut) throw new Error('le master ' + ms.cle + ' : « ' + depuis + ' » ne tombe pas sur une barre');
  return barres.slice(0, n + 1);
}
// une position virtuelle → l'échantillon du fichier ; une plage virtuelle → ses tronçons dans le fichier
// (avant le début du master, du silence : un tronçon [−n, 0])
function physique(ms, v) { return v < ms.b1 ? v : ms.b0 + ((v - ms.b0) % ms.L); }
function troncons(ms, va, vb) {
  const r = [];
  if (va < 0) { r.push([va, 0]); va = 0; }
  for (let v = va; v < vb;) {
    const p = physique(ms, v), fin = Math.min(vb, v + (ms.b1 - p));
    r.push([p, p + (fin - v)]);
    v = fin;
  }
  return r;
}

// ═══ LA CARTE DES MESURES D'UNE MUSIQUE (sans rien rendre) ═══════════════════
// La source qui servira (le master s'il existe, sinon le banc), les morceaux qu'on y coupe, et les
// barres de la musique montée, en secondes depuis son début : le montage y cale ses plans, et une
// bande de livre (bandes/_livre.js) y cherche ses mesures avant tout rendu.
function morceauxDe(spec, ms) {
  const m = (ms && spec.studio && spec.studio.morceaux) || spec.morceaux;
  return m && m.length ? m : [{ depuis: null, de: 0, a: spec.mesures || 30 }];
}
function carteMusique(spec) {
  if (!spec || !spec.theme) throw new Error('la musique : pas de thème');
  const ms = masterDe(spec.theme);
  const morceaux = morceauxDe(spec, ms);
  const barres = [0];
  const pieces = [];
  let t = 0;
  if (ms) {
    for (const m of morceaux) {
      const b = barresMaster(ms, m.depuis, m.fois, m.a);
      pieces.push({ m, debut: t, va: b[m.de], vb: b[m.a] });
      for (let i = m.de + 1; i <= m.a; i++) barres.push(t + (b[i] - b[m.de]) / ms.sr);
      t += (b[m.a] - b[m.de]) / ms.sr;
    }
  } else {
    const M = 240 / bpmDe(spec.theme);
    for (const m of morceaux) {
      pieces.push({ m, debut: t });
      for (let i = m.de + 1; i <= m.a; i++) barres.push(t + (i - m.de) * M);
      t += (m.a - m.de) * M;
    }
  }
  const mesures = barres.length - 1;
  return { source: ms ? 'studio' : 'banc', master: ms, morceaux, pieces, barres, duree: t, mesures, mesure: t / Math.max(1, mesures),
    bpm: ms ? ms.J.bpm : bpmDe(spec.theme) };
}
// la barre la plus proche d'une durée (au moins une mesure) : combien de mesures depuis `depuis`
// font `s` secondes — `auPlus` : sans dépasser
function mesuresPour(theme, s, o) {
  o = o || {};
  const ms = masterDe(theme);
  const de = o.de || 0;
  let t;
  if (ms) {
    // (assez de barres pour `s` secondes, même à des mesures d'une demi-seconde)
    const b = barresMaster(ms, o.depuis == null ? null : o.depuis, o.fois, de + Math.ceil(s / 0.5) + 4);
    t = b.map((v) => (v - b[de]) / ms.sr).slice(de);
  } else {
    const M = 240 / bpmDe(theme);
    t = Array.from({ length: Math.ceil(s / M) + 3 }, (x, i) => i * M);
  }
  let best = 1;
  for (let i = 1; i < t.length; i++) {
    // (à égalité, la plus courte : une minute plutôt qu'un peu plus)
    if (o.auPlus ? t[i] <= s + 1e-6 : Math.abs(t[i] - s) < Math.abs(t[best] - s) - 1e-6) best = i;
  }
  return best;
}

// ═══ LE BANC ═════════════════════════════════════════════════════════════════
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

// ═══ LE MONTAGE DE LA MUSIQUE ════════════════════════════════════════════════
// → un WAV 48 kHz stéréo, à son niveau, et ses barres (`barres`, en secondes)
function monterMusique(spec, dossier, nom) {
  if (!spec || !spec.theme) throw new Error('la musique : pas de thème');
  const sortie = path.join(C.assurer(dossier), nom + '.wav');
  const carte = carteMusique(spec);
  const ms = carte.master;
  const cle = ms ? C.empreinte({ spec, studio: ms.empreinte, v: 3 }) : C.empreinte({ spec, v: 5 });
  const fj = sortie.replace(/\.wav$/, '.json');
  if (fs.existsSync(sortie) && fs.existsSync(fj)) {
    const vieux = JSON.parse(fs.readFileSync(fj, 'utf8'));
    if (vieux.cle === cle) return Object.assign({ source: 'banc', barres: carte.barres }, vieux);
  }
  const morceaux = carte.morceaux;
  const tmp = C.assurer(path.join(dossier, 'tmp'));
  const pieces = [];
  let total = 0;
  const coupes = [];
  if (ms) {
    // les morceaux, coupés dans le master à l'échantillon ; un morceau qui passe la fin de la boucle
    // reprend à son début (deux tronçons, sans fondu : c'est la suite). La collure FINIT sur la barre :
    // le morceau qui entre prend 40 ms d'élan dans le master (ce qui y précède sa barre), celui qui
    // sort s'arrête sur la sienne — le premier temps arrive entier. (Au banc, la collure commence sur
    // la barre : mesuré sur la démonstration, le premier temps de C y perdait les trois quarts de son
    // attaque, et le premier temps suivant du morceau sortant s'y glissait.)
    const xf = Math.round(XF * ms.sr);
    carte.pieces.forEach((pc, i) => {
      const tr = troncons(ms, pc.va - (i > 0 ? xf : 0), pc.vb);
      const f = path.join(tmp, nom + '_' + i + '.wav');
      const g = [], reels = tr.filter((x) => x[0] >= 0).length;
      if (reels) g.push('[0:a]asplit=' + reels + tr.filter((x) => x[0] >= 0).map((x, k) => '[e' + k + ']').join(''));
      let k = 0;
      tr.forEach(([p0, p1], j) => {
        if (p0 < 0) g.push('anullsrc=r=' + ms.sr + ':cl=stereo,atrim=end_sample=' + (-p0) + ',asetpts=N/SR/TB[t' + j + ']');
        else g.push('[e' + (k++) + ']atrim=start_sample=' + p0 + ':end_sample=' + p1 + ',asetpts=N/SR/TB[t' + j + ']');
      });
      g.push(tr.map((x, j) => '[t' + j + ']').join('') + (tr.length > 1 ? 'concat=n=' + tr.length + ':v=0:a=1,' : '') + 'aresample=48000[x]');
      C.ffmpeg(['-i', ms.wav, '-filter_complex', g.join(';').replace(/^\[0:a\]asplit=1\[e0\];\[e0\]/, '[0:a]'), '-map', '[x]', '-ac', '2', '-c:a', 'pcm_s24le', f], 'morceau ' + i);
      pieces.push(f);
      coupes.push({ morceau: i, depuis: pc.m.depuis == null ? null : pc.m.depuis, de: pc.m.de, a: pc.m.a, a_s: +pc.debut.toFixed(5),
        barre: physique(ms, pc.va), echantillons: tr, mesures: pc.m.a - pc.m.de });
      total += (pc.vb - pc.va) / ms.sr;
    });
  } else {
    const M = 240 / bpmDe(spec.theme);
    morceaux.forEach((m, i) => {
      const r = rendre(spec.theme, m.depuis, 0.05 + (m.a + 1.5) * M + 3, dossier);
      const de = r.t(m.de), a = r.t(m.a) + (i < morceaux.length - 1 ? XF : 0);
      const f = path.join(tmp, nom + '_' + i + '.wav');
      C.ffmpeg(['-i', r.wav, '-af', 'atrim=start=' + de.toFixed(5) + ':end=' + a.toFixed(5) + ',asetpts=N/SR/TB,aresample=48000', '-ac', '2', '-c:a', 'pcm_s16le', f], 'morceau ' + i);
      pieces.push(f);
      coupes.push({ morceau: i, depuis: m.depuis == null ? null : m.depuis, de: m.de, a: m.a, a_s: +total.toFixed(5), mesures: m.a - m.de });
      total += (m.a - m.de) * M;
    });
  }
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
    C.ffmpeg(ins.concat(['-filter_complex', g.join(';'), '-map', '[x]', '-c:a', ms ? 'pcm_s24le' : 'pcm_s16le', brut]), 'collures');
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
  // (au master, le limiteur rattrape son retard — `latency` — : sans lui, toute la musique arrive
  // 4 ms, son attaque, après les barres ; le banc garde son réglage d'avant)
  const rattrape = ms ? ':latency=1' : '';
  for (let k = 0; k < 4; k++) {
    C.ffmpeg(['-i', pret, '-af', 'volume=' + gain.toFixed(2) + 'dB,alimiter=limit=' + limite.toFixed(4) + ':attack=4:release=80:level=false' + rattrape + ',aresample=48000',
      '-c:a', 'pcm_s24le', sortie], 'niveau');
    n = niveau(sortie);
    if (Math.abs(n.I - cible) <= 0.25) break;
    gain += cible - n.I;
  }
  const res = { cle, source: carte.source, master: ms ? ms.wav : null, wav: sortie, theme: spec.theme, duree: +total.toFixed(4), mesure: carte.mesure, bpm: +(+carte.bpm).toFixed(3),
    mesures: carte.mesures, barres: carte.barres.map((x) => +x.toFixed(5)), coupes, avant: n0, apres: n, gain: +gain.toFixed(2) };
  fs.writeFileSync(fj, JSON.stringify(res, null, 1));
  C.journal('musique « ' + nom + ' » (' + (ms ? 'le master du studio, ' + ms.wav : 'le banc') + ') : ' + res.mesures + ' mesures, ' + res.duree.toFixed(2) + ' s ; ' +
    (n0.I != null ? n0.I.toFixed(1) : '?') + ' → ' + n.I.toFixed(1) + ' LUFS, crête ' + n.TP.toFixed(1) + ' dBTP');
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

module.exports = { bpmDe, rendre, niveau, monterMusique, musiques, carteMusique, mesuresPour, masterDe, barresMaster, troncons, physique, fractions, dossiersStudio, XF };
