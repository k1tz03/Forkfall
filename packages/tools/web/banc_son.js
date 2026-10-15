#!/usr/bin/env node
// LE BANC D'ESSAI DU SON — rend la musique hors ligne, sans haut-parleur.
// Chromium (Playwright) joue un thème dans un OfflineAudioContext avec le vrai
// moteur (audio.js et musique/*.js, comme le jeu), le banc en tire un WAV (et un
// MP3), le mesure, et dessine ce qu'on ne peut pas écouter : le spectrogramme
// (les notes, le rythme, la brillance) et la courbe d'énergie mesure par mesure
// (les sections, les creux, la couture de la boucle).
//
//   NODE_PATH=/opt/node22/lib/node_modules node packages/tools/web/banc_son.js [options] [thème …]
//
//   --out <dossier>    où écrire (défaut : ./banc_son)
//   --boucle           rend l'introduction et deux passages du corps de la boucle
//                      (la mesure du niveau porte alors sur le corps seul)
//   --couture          mesure la couture de la boucle : la dernière mesure du corps
//                      contre la première qui la suit (sans --boucle, le rendu va
//                      juste assez loin pour la traverser) ; alias --seam
//   --duree <s>        la durée du rendu sans --boucle (défaut 24 s)
//   --depuis <section> partir d'une section (son nom, ou son rang dans l'ordre)
//   --mp3              un MP3 à 192 kb/s à côté du WAV
//   --annee <a>        l'année (le timbre des voix `epoque`), défaut 1990
//   --avec <f.js>      charge aussi ce fichier de thème (un brouillon hors de musique/)
//   --sans-images      ni spectrogramme ni courbe
//   --verifier         compile seulement, en Node, sans navigateur : les fautes
//                      d'écriture et la forme de chaque thème (rapide)
//
// Sans nom de thème, il les fait tous. Sorties, par thème : <thème>.wav,
// <thème>.png (spectrogramme), <thème>_courbe.png (l'énergie par mesure, les
// sections), <thème>.mp3 (--mp3), et banc.json (toutes les mesures, cumulées).
// Une ligne par thème, puis l'écart des niveaux entre les thèmes.
//
// LES CIBLES (docs/design/bande_originale.md, § 2 et § 6) : une moyenne vers
// −21 dB (à ±1,5 dB), une crête sous −3 dB, de l'énergie au-dessus de 250 Hz
// (le haut-parleur d'un téléphone), peu au-dessus de 6 kHz (le confort), une
// boucle qui ne se redit pas avant 150 s (240 s pour un thème de ville), une
// couture sans marche, et un rendu léger (le direct d'un téléphone moyen).
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const ICI = __dirname;
const MUSIQUE = require(path.join(ICI, 'musique_sources.js'));

const CIBLES = {
  moyenne: -21, ecart: 1.5,       // dB : la moyenne, et la marge autour
  crete: -3,                      // dB : la crête doit rester dessous
  aigus250: 0.2,                  // part de l'énergie au-dessus de 250 Hz : au moins (viser 25 à 40 %)
  aigus6k: 0.06,                  // part de l'énergie au-dessus de 6 kHz : au plus (viser 1 à 4 %)
  boucle: 150, boucleVille: 240,  // s : la période de la boucle, au moins
  couture: 3, coutureMax: 6,      // dB : l'écart des deux mesures de la couture (à écouter, puis trop)
  sources: 100                    // oscillateurs et bruits qui sonnent ensemble, au plus (viser 80)
  // la vitesse du rendu (×temps réel) dépend de la charge de la machine : elle
  // s'affiche, elle ne juge pas — on la compare à l'accueil rendu dans la même séance
};

function args() {
  const a = process.argv.slice(2);
  const o = { themes: [], out: path.join(process.cwd(), 'banc_son'), duree: 24, annee: 1990, avec: [], images: true };
  for (let i = 0; i < a.length; i++) {
    const x = a[i];
    if (x === '--out') o.out = a[++i];
    else if (x === '--duree') o.duree = +a[++i];
    else if (x === '--annee') o.annee = +a[++i];
    else if (x === '--boucle') o.boucle = true;
    else if (x === '--couture' || x === '--seam') o.couture = true;
    else if (x === '--mp3') o.mp3 = true;
    else if (x === '--depuis') o.depuis = a[++i];
    else if (x === '--avec') o.avec.push(path.resolve(a[++i]));
    else if (x === '--sans-images') o.images = false;
    else if (x === '--verifier') o.verifier = true;
    else if (x === '-h' || x === '--help') { console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 33).map((l) => l.replace(/^\/\/ ?/, '')).join('\n')); process.exit(0); }
    else if (x.startsWith('--')) { console.error('banc_son : option inconnue ' + x); process.exit(2); }
    else o.themes.push(x);
  }
  if (o.depuis != null && /^\d+$/.test(o.depuis)) o.depuis = +o.depuis;
  return o;
}

// ── l'affichage ──
const fr = (x, d = 1) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(d).replace('.', ',');
const mmss = (s) => Math.floor(s / 60) + ':' + String(Math.round(s % 60)).padStart(2, '0');
const pc = (x) => Math.round(x * 100) + ' %';

// ── --verifier : la partition seule, en Node ──
function verifier(o) {
  const A = require(path.join(ICI, 'audio.js'));
  global.FusibleAudio = A;
  const fichiers = MUSIQUE.fichiers().map((f) => f.chemin).concat(o.avec);
  for (const f of fichiers) {
    try { require(f); } catch (e) { A._erreur(path.basename(f), e); }
  }
  let mauvais = 0;
  const themes = o.themes.length ? o.themes : A.THEMES;
  for (const nom of themes) {
    const inf = A.infos(nom);
    if (!inf) { console.log(nom.padEnd(12) + ' ✗ thème inconnu'); mauvais++; continue; }
    try {
      const s = A.structure(nom);
      const cible = inf.ville || /^(ville_|livre_)/.test(nom) ? CIBLES.boucleVille : CIBLES.boucle;
      const ok = s.periode.secondes >= cible;
      if (!ok) mauvais++;
      console.log(`${nom.padEnd(12)} ${('« ' + inf.titre + ' »').padEnd(24)} ${inf.bpm} bpm · intro ${s.intro.mesures} m. (${mmss(s.intro.secondes)}) · corps ${s.corps.mesures} m. (${mmss(s.corps.secondes)}) · période ${mmss(s.periode.secondes)} · redite à ${mmss(s.redite)} · ${s.ordre.join(' ')}  ${ok ? '✓' : '✗ boucle < ' + mmss(cible)}`);
    } catch (e) {
      mauvais++;
      console.log(`${nom.padEnd(12)} ✗ ${e.message}`);
    }
  }
  for (const e of A.erreurs()) { console.log('erreur : ' + e.ou + ' : ' + e.message); mauvais++; }
  process.exit(mauvais ? 1 : 0);
}

// ── dans la page : le rendu, les mesures, la courbe ──
async function rendreDansLaPage({ nom, o, cibles }) {
  const A = window.FusibleAudio;
  const S = A.structure(nom), inf = A.infos(nom);
  const sr = 44100, M = S.mesure, debut = 0.05;   // le thème part à 50 ms (setTheme sans fondu)
  const queue = 3;
  let duree = o.duree, mesureDe = null;
  if (o.depuis == null && o.boucle) duree = debut + S.intro.secondes + 2 * S.corps.secondes + queue;
  else if (o.depuis == null && o.couture) duree = debut + S.intro.secondes + S.corps.secondes + 2 * M + queue;
  if (o.depuis == null && o.boucle) mesureDe = [debut + S.intro.secondes, debut + S.intro.secondes + 2 * S.corps.secondes];
  const N = Math.ceil(sr * duree);
  const ctx = new OfflineAudioContext(2, N, sr);

  // ce qui sonne en même temps : chaque oscillateur, chaque bruit, du départ à l'arrêt
  const iv = [], noeuds = {};
  const suivre = (n) => {
    const start = n.start.bind(n), stop = n.stop.bind(n);
    let k = -1;
    n.start = function () { k = iv.length; iv.push([arguments[0] || 0, Infinity]); return start.apply(null, arguments); };
    n.stop = function (w) { if (k >= 0) iv[k][1] = Math.min(iv[k][1], w == null ? 0 : w); return stop.apply(null, arguments); };
    return n;
  };
  ['createOscillator', 'createBufferSource'].forEach((m) => { const f = ctx[m].bind(ctx); ctx[m] = () => suivre(f()); });
  ['createBiquadFilter', 'createGain', 'createStereoPanner', 'createWaveShaper', 'createConvolver', 'createDelay', 'createChannelMerger', 'createChannelSplitter']
    .forEach((m) => { const f = ctx[m].bind(ctx); ctx[m] = function () { noeuds[m] = (noeuds[m] || 0) + 1; return f.apply(null, arguments); }; });

  const e = A.createEngine(ctx, ctx.destination, { seed: 1, pad: false, at: 0 });
  e.setYear(o.annee);
  e.setTheme(nom, { at: 0, fade: 0, depuis: o.depuis == null ? undefined : o.depuis });
  // une fenêtre glissante, comme en direct : le graphe reste petit
  const PAS = 2;
  e.scheduleUntil(Math.min(duree, PAS + 1));
  for (let t = PAS; t < duree; t += PAS) {
    const tq = Math.round(t * sr / 128) * 128 / sr;
    ctx.suspend(tq).then(() => { e.scheduleUntil(Math.min(duree + 1, tq + PAS + 1)); ctx.resume(); });
  }
  const t0 = performance.now();
  const buf = await ctx.startRendering();
  const rendu = (performance.now() - t0) / 1000;

  // ── les mesures ──
  const L = buf.getChannelData(0), R = buf.getChannelData(1);
  const i0 = mesureDe ? Math.floor(mesureDe[0] * sr) : 0, i1 = mesureDe ? Math.min(N, Math.floor(mesureDe[1] * sr)) : N;
  const energie = (a, b) => { a = Math.max(0, Math.floor(a)); b = Math.min(N, Math.floor(b)); let s = 0; for (let i = a; i < b; i++) s += L[i] * L[i] + R[i] * R[i]; return b > a ? s / (2 * (b - a)) : 0; };
  const db = (x) => 10 * Math.log10(x + 1e-20);
  let crete = 0;
  for (let i = 0; i < N; i++) { const a = Math.abs(L[i]), b = Math.abs(R[i]); if (a > crete) crete = a; if (b > crete) crete = b; }
  const moyenne = db(energie(i0, i1));
  // le spectre moyen (fenêtres de Hann de 8192, sans recouvrement) : la part au-dessus de 250 Hz et de 6 kHz
  const F = 8192, re = new Float64Array(F), im = new Float64Array(F), P = new Float64Array(F / 2), hann = new Float64Array(F);
  for (let i = 0; i < F; i++) hann[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / F);
  const fft = () => {
    for (let i = 1, j = 0; i < F; i++) {
      let bit = F >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
    }
    for (let len = 2; len <= F; len <<= 1) {
      const ang = -2 * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang);
      for (let i = 0; i < F; i += len) {
        let cr = 1, ci = 0;
        for (let k = 0; k < len / 2; k++) {
          const a = i + k, b = a + len / 2;
          const xr = re[b] * cr - im[b] * ci, xi = re[b] * ci + im[b] * cr;
          re[b] = re[a] - xr; im[b] = im[a] - xi; re[a] += xr; im[a] += xi;
          const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t;
        }
      }
    }
  };
  for (let a = i0; a + F <= i1; a += F) {
    for (const ch of [L, R]) {
      for (let i = 0; i < F; i++) { re[i] = ch[a + i] * hann[i]; im[i] = 0; }
      fft();
      for (let k = 1; k < F / 2; k++) P[k] += re[k] * re[k] + im[k] * im[k];
    }
  }
  let tot = 0, h250 = 0, h6k = 0;
  for (let k = 1; k < F / 2; k++) { const f = k * sr / F; tot += P[k]; if (f > 250) h250 += P[k]; if (f > 6000) h6k += P[k]; }
  // L'INTENSITÉ : ce que l'oreille entend, pas ce que pèse le grave — le signal
  // pondéré « K » (un passe-haut à 38 Hz, +4 dB au-dessus de 1,5 kHz, comme les
  // mesures de loudness), en dB : la courbe des sections se lit là-dessus
  const biquad = (b0, b1, b2, a0, a1, a2) => [b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0];
  const K1 = (() => {   // la tablette haute
    const A_ = Math.pow(10, 4 / 40), w = 2 * Math.PI * 1500 / sr, al = Math.sin(w) / (2 * Math.SQRT1_2), c = Math.cos(w), s = 2 * Math.sqrt(A_) * al;
    return biquad(A_ * ((A_ + 1) + (A_ - 1) * c + s), -2 * A_ * ((A_ - 1) + (A_ + 1) * c), A_ * ((A_ + 1) + (A_ - 1) * c - s),
      (A_ + 1) - (A_ - 1) * c + s, 2 * ((A_ - 1) - (A_ + 1) * c), (A_ + 1) - (A_ - 1) * c - s);
  })();
  const K2 = (() => {   // le passe-haut
    const w = 2 * Math.PI * 38 / sr, al = Math.sin(w) / (2 * 0.5), c = Math.cos(w);
    return biquad((1 + c) / 2, -(1 + c), (1 + c) / 2, 1 + al, -2 * c, 1 - al);
  })();
  const KL = new Float32Array(N), KR = new Float32Array(N);
  for (const [x, y] of [[L, KL], [R, KR]]) {
    let a1 = 0, a2 = 0, b1 = 0, b2 = 0, c1 = 0, c2 = 0, d1 = 0, d2 = 0;
    for (let i = 0; i < N; i++) {
      const v = x[i];
      const u = K1[0] * v + K1[1] * a1 + K1[2] * a2 - K1[3] * b1 - K1[4] * b2;
      a2 = a1; a1 = v; b2 = b1; b1 = u;
      const z = K2[0] * u + K2[1] * c1 + K2[2] * c2 - K2[3] * d1 - K2[4] * d2;
      c2 = c1; c1 = u; d2 = d1; d1 = z;
      y[i] = z;
    }
  }
  const intensiteDe = (a, b) => { a = Math.max(0, Math.floor(a)); b = Math.min(N, Math.floor(b)); let s = 0; for (let i = a; i < b; i++) s += KL[i] * KL[i] + KR[i] * KR[i]; return b > a ? -0.691 + 10 * Math.log10(s / (b - a) + 1e-20) : -99; };
  const intensite = intensiteDe(i0, i1);

  // l'énergie mesure par mesure, avec le nom des sections (depuis le départ)
  const mesures = [];
  let si = o.depuis == null ? 0 : (typeof o.depuis === 'number' ? o.depuis : S.ordre.indexOf(o.depuis));
  let tm = debut, passage = 0;
  while (tm + M <= duree - 0.5 && mesures.length < 2000) {
    const sec = S.sections[si];
    for (let m = 0; m < sec.mesures && tm + M <= duree - 0.5; m++) {
      mesures.push({ t: tm, db: db(energie(tm * sr, (tm + M) * sr)), lu: intensiteDe(tm * sr, (tm + M) * sr), section: sec.nom, index: si, m: m + 1, passage });
      tm += M;
    }
    si++;
    if (si >= S.ordre.length) { si = S.boucle; passage++; }
  }
  // la couture : la dernière mesure du corps contre la première qui la suit
  let couture = null;
  if (o.depuis == null && (o.couture || o.boucle)) {
    const ts = debut + S.intro.secondes + S.corps.secondes, temps = M / 4;
    if (ts + M <= duree) {
      couture = {
        t: ts,
        mesure: db(energie(ts * sr, (ts + M) * sr)) - db(energie((ts - M) * sr, ts * sr)),
        temps: db(energie(ts * sr, (ts + temps) * sr)) - db(energie((ts - temps) * sr, ts * sr))
      };
    }
  }
  // les sources ensemble : au plus (et où), et en moyenne
  const evs = [];
  for (const [a, b] of iv) { evs.push([a, 1]); evs.push([Math.min(b, duree), -1]); }
  evs.sort((x, y) => x[0] - y[0] || x[1] - y[1]);
  let n = 0, pointe = 0, cumul = 0, tp = 0, tPointe = 0;
  for (const [t, d] of evs) { cumul += n * (t - tp); tp = t; n += d; if (n > pointe) { pointe = n; tPointe = t; } }
  let ouPointe = '';
  for (const m of mesures) if (m.t <= tPointe) ouPointe = m.section + ' m.' + m.m;

  // ── la courbe d'énergie ──
  let courbe = null;
  if (o.images) {
    const W = 1400, H = 380, cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const g = cv.getContext('2d'), haut = -8, bas = -46, x0 = 48, x1 = W - 12, y0 = 70, y1 = H - 34;
    const X = (t) => x0 + (x1 - x0) * t / duree, Y = (v) => y0 + (y1 - y0) * (haut - Math.max(bas, Math.min(haut, v))) / (haut - bas);
    g.fillStyle = '#1B1109'; g.fillRect(0, 0, W, H);
    g.font = '13px monospace'; g.fillStyle = '#F2E8CE';
    g.fillText(`${nom} — « ${inf.titre} » · ${inf.bpm} bpm · l'énergie, mesure par mesure`, 12, 20);
    g.fillStyle = '#B0A07C';
    g.fillText(`barres : l'intensité de chaque mesure (pondérée K, dB) · points : son RMS brut · moyenne ${moyenne.toFixed(1)} dB${mesureDe ? ' (corps)' : ''} · intensité ${intensite.toFixed(1)} · crête ${db(crete * crete).toFixed(1)} dB · période ${S.periode.secondes.toFixed(0)} s`, 12, 38);
    // les sections
    let prec = null, bande = 0;
    const finRang = [-1e9, -1e9];   // où finit la dernière étiquette de chaque rang : deux sections courtes ne se chevauchent pas
    mesures.forEach((m) => {
      if (!prec || prec.index !== m.index || prec.passage !== m.passage) {
        bande++;
        g.fillStyle = bande % 2 ? 'rgba(242,232,206,0.05)' : 'rgba(242,232,206,0.11)';
        let fin = m.t; for (const k of mesures) if (k.index === m.index && k.passage === m.passage) fin = k.t + M;
        g.fillRect(X(m.t), y0, X(fin) - X(m.t), y1 - y0);
        g.fillStyle = '#C4B491'; g.font = '11px monospace';
        const xe = X(m.t) + 3, rang = xe >= finRang[0] + 6 ? 0 : (xe >= finRang[1] + 6 ? 1 : 0);
        g.fillText(m.section, xe, y0 - 4 - rang * 13);
        finRang[rang] = xe + g.measureText(m.section).width;
      }
      prec = m;
    });
    // les graduations
    g.strokeStyle = 'rgba(242,232,206,0.18)'; g.fillStyle = '#B0A07C'; g.font = '11px monospace';
    for (let v = -10; v >= bas; v -= 6) { g.beginPath(); g.moveTo(x0, Y(v)); g.lineTo(x1, Y(v)); g.stroke(); g.fillText(String(v), 8, Y(v) + 4); }
    for (let t = 0; t < duree; t += 30) g.fillText(Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'), X(t) - 12, H - 12);
    // les mesures : l'intensité en barres, le RMS en points
    mesures.forEach((m) => {
      g.fillStyle = '#F2E8CE';
      const y = Y(m.lu);
      g.fillRect(X(m.t) + 1, y, Math.max(1, X(m.t + M) - X(m.t) - 2), y1 - y);
    });
    g.fillStyle = '#E0164B';
    mesures.forEach((m) => g.fillRect(X(m.t + M / 2) - 2, Y(m.db) - 2, 4, 4));
    // la cible du RMS moyen, la couture
    g.strokeStyle = '#4E9448'; g.setLineDash([6, 4]); g.beginPath(); g.moveTo(x0, Y(cibles.moyenne)); g.lineTo(x1, Y(cibles.moyenne)); g.stroke(); g.setLineDash([]);
    if (couture) { g.strokeStyle = '#E0164B'; g.lineWidth = 2; g.beginPath(); g.moveTo(X(couture.t), y0 - 14); g.lineTo(X(couture.t), y1); g.stroke(); g.fillStyle = '#E0164B'; g.fillText('couture', X(couture.t) + 4, y0 + 12); }
    courbe = cv.toDataURL('image/png').split(',')[1];
  }

  // ── le WAV, 16 bits stéréo, gardé dans la page : Node le lit par morceaux ──
  const out = new DataView(new ArrayBuffer(44 + N * 4));
  const w = (p, s) => { for (let i = 0; i < s.length; i++) out.setUint8(p + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); out.setUint32(4, 36 + N * 4, true); w(8, 'WAVE'); w(12, 'fmt ');
  out.setUint32(16, 16, true); out.setUint16(20, 1, true); out.setUint16(22, 2, true);
  out.setUint32(24, sr, true); out.setUint32(28, sr * 4, true); out.setUint16(32, 4, true); out.setUint16(34, 16, true);
  w(36, 'data'); out.setUint32(40, N * 4, true);
  for (let i = 0; i < N; i++) {
    out.setInt16(44 + i * 4, Math.max(-1, Math.min(1, L[i])) * 32767, true);
    out.setInt16(46 + i * 4, Math.max(-1, Math.min(1, R[i])) * 32767, true);
  }
  window.__wav = new Uint8Array(out.buffer);
  return {
    nom, titre: inf.titre, bpm: inf.bpm, ville: inf.ville || /^(ville_|livre_)/.test(nom), duree, rendu,
    moyenne, intensite, mesureCorps: !!mesureDe, crete: db(crete * crete), aigus250: h250 / tot, aigus6k: h6k / tot,
    structure: { intro: S.intro, corps: S.corps, periode: S.periode, redite: S.redite, ordre: S.ordre, boucle: S.boucle },
    couture, sources: { pointe, ou: ouPointe, moyenne: cumul / duree, parSeconde: iv.length / duree }, noeuds,
    mesures: mesures.map((m) => ({ t: +m.t.toFixed(3), db: +m.db.toFixed(2), lu: +m.lu.toFixed(2), section: m.section, m: m.m, passage: m.passage })),
    erreurs: A.erreurs(), courbe, octets: window.__wav.length
  };
}

async function main() {
  const o = args();
  if (o.verifier) return verifier(o);
  const { chromium } = require('playwright');
  fs.mkdirSync(o.out, { recursive: true });
  let texte = MUSIQUE.texte();
  for (const f of o.avec) texte += MUSIQUE.enveloppe(f);
  const exe = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const page = await browser.newPage();
  const erreursPage = [];
  page.on('pageerror', (e) => erreursPage.push(e.message));
  await page.setContent('<!doctype html><meta charset="utf-8"><script>' + texte.split('</script').join('<\\/script') + '</script>');
  const tous = await page.evaluate(() => window.FusibleAudio.THEMES);
  const themes = o.themes.length ? o.themes : tous;
  const jsonPath = path.join(o.out, 'banc.json');
  let rapport = { themes: {} };
  try { rapport = JSON.parse(fs.readFileSync(jsonPath, 'utf8')); } catch (e) { /* nouveau */ }
  const lignes = [];
  for (const nom of themes) {
    if (tous.indexOf(nom) < 0) { console.log(`${nom.padEnd(12)} ✗ thème inconnu (${tous.join(', ')})`); continue; }
    let r;
    try {
      r = await page.evaluate(rendreDansLaPage, { nom, o: { duree: o.duree, boucle: !!o.boucle, couture: !!o.couture, depuis: o.depuis, annee: o.annee, images: o.images }, cibles: CIBLES });
    } catch (e) {
      console.log(`${nom.padEnd(12)} ✗ ${String(e.message || e).split('\n')[0]}`);
      continue;
    }
    // le WAV, par morceaux de 6 Mo
    const wav = path.join(o.out, nom + '.wav');
    const fd = fs.openSync(wav, 'w');
    for (let i = 0; i < r.octets; i += 6 << 20) {
      const b64 = await page.evaluate(({ i, n }) => {
        const b = window.__wav.subarray(i, i + n);
        let s = '';
        for (let k = 0; k < b.length; k += 0x8000) s += String.fromCharCode.apply(null, b.subarray(k, k + 0x8000));
        return btoa(s);
      }, { i, n: 6 << 20 });
      fs.writeSync(fd, Buffer.from(b64, 'base64'));
    }
    fs.closeSync(fd);
    await page.evaluate(() => { window.__wav = null; });
    const sorties = [path.basename(wav)];
    if (o.images) {
      const png = path.join(o.out, nom + '.png');
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav, '-lavfi', 'showspectrumpic=s=1400x520:legend=1:scale=log:fscale=log', png]);
      fs.writeFileSync(path.join(o.out, nom + '_courbe.png'), Buffer.from(r.courbe, 'base64'));
      sorties.push(path.basename(png), nom + '_courbe.png');
    }
    if (o.mp3) {
      const mp3 = path.join(o.out, nom + '.mp3');
      const x = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav, '-codec:a', 'libmp3lame', '-b:a', '192k', mp3], { encoding: 'utf8' });
      if (x.status === 0) sorties.push(path.basename(mp3)); else console.log('   (mp3 : ' + (x.stderr || '').trim() + ')');
    }
    delete r.courbe;
    // ── le verdict ──
    const S = r.structure, cibleBoucle = r.ville ? CIBLES.boucleVille : CIBLES.boucle;
    const vitesse = r.duree / r.rendu;
    const revoir = [];
    if (Math.abs(r.moyenne - CIBLES.moyenne) > CIBLES.ecart) revoir.push('niveau');
    if (r.crete >= CIBLES.crete) revoir.push('crête');
    if (r.aigus250 < CIBLES.aigus250) revoir.push('trop grave');
    if (r.aigus6k > CIBLES.aigus6k) revoir.push('trop brillant');
    if (S.periode.secondes < cibleBoucle) revoir.push('boucle courte');
    if (r.couture && Math.abs(r.couture.mesure) > CIBLES.coutureMax) revoir.push('couture');
    if (r.sources.pointe > CIBLES.sources) revoir.push('trop de sources');
    if (r.erreurs.length) revoir.push('erreurs');
    const couture = r.couture ? ` · couture ${r.couture.mesure >= 0 ? '+' : ''}${fr(r.couture.mesure)} dB${Math.abs(r.couture.mesure) > CIBLES.couture && Math.abs(r.couture.mesure) <= CIBLES.coutureMax ? ' (à écouter)' : ''}` : '';
    const ligne = `${nom.padEnd(11)} ${('« ' + r.titre + ' »').padEnd(22)} moy ${fr(r.moyenne)} dB${r.mesureCorps ? ' (corps)' : ''} · int ${fr(r.intensite)} · crête ${fr(r.crete)} · >250 Hz ${pc(r.aigus250)} · >6 kHz ${fr(r.aigus6k * 100)} % · ` +
      `boucle ${mmss(S.periode.secondes)} (${S.periode.mesures} m.) · redite ${mmss(S.redite)}${couture} · ×${fr(vitesse)} · ${r.sources.pointe} sources (${r.sources.ou}), ${Math.round(r.sources.moyenne)} en moyenne  ` +
      (revoir.length ? '✗ ' + revoir.join(', ') : '✓');
    console.log(ligne);
    for (const e of r.erreurs) console.log('   erreur : ' + e.ou + ' : ' + e.message);
    console.log('   → ' + path.relative(process.cwd(), o.out) + '/{' + sorties.join(', ') + '}');
    lignes.push(ligne);
    rapport.themes[nom] = Object.assign(r, { vitesse, revoir, date: new Date().toISOString(), options: { boucle: !!o.boucle, couture: !!o.couture, depuis: o.depuis, annee: o.annee } });
  }
  await browser.close();
  // l'ensemble : un fondu enchaîné ne doit pas sauter d'un thème à l'autre
  const moy = Object.keys(rapport.themes).map((k) => [k, rapport.themes[k].moyenne]);
  if (moy.length > 1) {
    const vals = moy.map((x) => x[1]), hi = Math.max(...vals), lo = Math.min(...vals);
    console.log(`l'ensemble (${moy.length} thèmes dans banc.json) : moyennes de ${fr(lo)} à ${fr(hi)} dB, écart ${fr(hi - lo)} dB` +
      (hi - lo > 2 * CIBLES.ecart ? ` ✗ (au plus ${fr(2 * CIBLES.ecart)})` : ' ✓'));
  }
  if (erreursPage.length) console.log('erreurs de la page : ' + erreursPage.join(' | '));
  rapport.cibles = CIBLES;
  fs.writeFileSync(jsonPath, JSON.stringify(rapport, null, 1));
}

main().catch((e) => { console.error('banc_son : ' + (e && e.message ? e.message : e)); process.exit(1); });
