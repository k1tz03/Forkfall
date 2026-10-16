// LE BANC DES COUTURES — la preuve, aux échantillons, que la musique enregistrée se joue sans couture.
// (musique_audio.js --verifier : node packages/tools/web/musique_audio.js --verifier --masters <dossier> [clé …])
//
// Chromium (Playwright) charge la page du jeu (audio.js et les thèmes) et le manifeste ; le VRAI lecteur
// d'audio.js joue les MP3 dans un OfflineAudioContext (le compresseur de sortie retiré : tout est linéaire),
// en partant trois secondes avant chaque jointure d'un thème :
//   bloc      d'un bloc au suivant dans un même passage (deux décodages du même master ; les deux blocs de
//             l'introduction quand elle en a deux)
//   entree    l'introduction (premier passage) qui passe la main au second passage
//   boucle    la fin du second passage qui revient à son début
// Le banc relit le plan que le lecteur a écrit (les nœuds : leur trame de départ, leur décalage, leurs
// fondus) et reconstruit, depuis le master, ce qu'ils devaient faire entendre : `attendu`. Il compare :
//   exact     le joué contre le mélange que le plan promet des deux tampons décodés (les mêmes échantillons, les
//             mêmes fondus) : l'exactitude de l'ordonnancement, à l'arrondi des flottants près
//   ajouté    ce que la jointure ajoute au bruit du MP3 : les aigus et la crête (le plus grand saut d'un
//             échantillon au suivant) de l'erreur du joué, contre ceux de chaque décodage SEUL dans la même
//             fenêtre — un clic, un trou, un décalage y monteraient ; rien ne doit dépasser +1 dB
//   trou      des échantillons nuls (les deux canaux) là où le master sonne
//   décalage, A/B  entre deux blocs : le décalage (−4 à 4) qui rend les deux décodages le plus semblables dans
//             le fondu, et leur écart au décalage 0 contre le bruit de leurs MP3 (aligné : sous +3 dB ; un
//             échantillon de travers le ferait monter de plus de 15 dB dès qu'il y a des aigus)
//   passages  dans le fondu des jointures `entree` et `boucle`, ce que le master lui-même change d'un passage
//             à l'autre (attendu contre la suite que le contrat promet) : ce n'est pas le lecteur
// à 44,1 et 48 kHz ; puis deux décodeurs simulés (les blocs et l'étalon réencodés sans étiquette LAME, le
// décodeur ne retire plus ses 1 105 échantillons) : l'étalon le mesure (`sans-etiquette`), ou ne le dit pas
// (`etalon-faux` : le lecteur croit 0) — les jointures doivent rester propres dans les deux cas.
// Enfin la MÉMOIRE : dix minutes du thème le plus long, comme en direct (le séquenceur toutes les 0,25 s),
// et les octets décodés que le chargeur tient, au plus et en moyenne.
'use strict';
const fs = require('fs');
const path = require('path');
const MA = require('./musique_audio.js');

const ICI = __dirname;
const HOTE = 'http://banc.fusible/';

function db(x) { return x > 0 ? 20 * Math.log10(x) : -200; }
const fr = (x, d = 1) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(d).replace('.', ',');

// la valeur du master en une position fractionnaire (48 kHz) : sinus cardinal fenêtré, 16 passages par zéro
function lecteurMaster(X) {
  const Z = 16;
  return (x) => {
    const xr = Math.round(x);
    if (Math.abs(x - xr) < 1e-6) return xr >= 0 && xr < X.length ? X[xr] : 0;
    const i = Math.floor(x), f = x - i;
    let s = 0;
    for (let k = -Z + 1; k <= Z; k++) {
      const j = i + k;
      if (j < 0 || j >= X.length) continue;
      const u = k - f, w = 0.42 + 0.5 * Math.cos(Math.PI * u / Z) + 0.08 * Math.cos(2 * Math.PI * u / Z);
      s += X[j] * (Math.sin(Math.PI * u) / (Math.PI * u)) * w;
    }
    return s;
  };
}

// ── dans la page : une jointure jouée par le lecteur ──
async function jouerJointure({ nom, xDepart, duree, sr }) {
  const A = window.FusibleAudio;
  const oc = new OfflineAudioContext(2, Math.ceil(duree * sr), sr);
  oc.createDynamicsCompressor = undefined;
  const e = A.createEngine(oc, oc.destination, { seed: 1, pad: false, at: 0, master: 1, musique: 1 });
  e.setTheme(nom, { at: 0, fade: 0, depuis: { x: xDepart } });
  await A._attendre(oc);
  e.scheduleUntil(0.5);
  await A._attendre(oc);
  e.scheduleUntil(0.6);
  const segs = e._segments(), version = e.version();
  // les deux tampons décodés que les nœuds lisent (le chargeur les rendra pendant le rendu : on les garde)
  const ch = A._chargeur(oc), tampons = (segs || []).map((s) => (ch.blocs[nom + '#' + s.k] || {}).buf || null);
  for (let k = 1; k * 0.25 < duree; k++) {
    const tq = Math.round(k * 0.25 * sr / 128) * 128 / sr;
    if (tq >= duree) break;
    oc.suspend(tq).then(() => { e.scheduleUntil(tq + 1.5); oc.resume(); });
  }
  const buf = await oc.startRendering();
  const R = A._rendus()[nom];
  if (!segs || segs.length < 2 || !tampons[0] || !tampons[1]) return { segs, version, erreurs: A.erreurs() };
  // la fenêtre : 0,6 s de chaque côté de la jointure ; ce que joue chaque nœud, aligné sur les trames de sortie
  const J = segs[0].J, w0 = Math.max(0, Math.round(J - 0.6 * sr)), nw = Math.min(buf.length - w0, Math.round(1.2 * sr));
  const aligne = (s, tb, c) => {
    const d = tb.getChannelData(c), o = new Float32Array(nw);
    for (let i = 0; i < nw; i++) { const n = w0 + i, j = s.o + (n - s.T); o[i] = n >= s.T && j >= 0 && j < d.length ? d[j] : 0; }
    return o;
  };
  const en64 = (a) => { const u = new Uint8Array(a.buffer, a.byteOffset, a.byteLength); let s = ''; for (let k = 0; k < u.length; k += 0x8000) s += String.fromCharCode.apply(null, u.subarray(k, k + 0x8000)); return btoa(s); };
  return {
    segs, version, w0, nw, niveau: R.niveau, fondu: 1024, erreurs: A.erreurs(),
    P: [0, 1].map((c) => en64(buf.getChannelData(c).slice(w0, w0 + nw))),
    A: [0, 1].map((c) => en64(aligne(segs[0], tampons[0], c))),
    B: [0, 1].map((c) => en64(aligne(segs[1], tampons[1], c)))
  };
}

// ── dans la page : dix minutes comme en direct, la mémoire décodée à chaque pas ──
async function jouerLongtemps({ nom, duree, sr }) {
  const A = window.FusibleAudio;
  const oc = new OfflineAudioContext(2, Math.ceil(duree * sr), sr);
  oc.createDynamicsCompressor = undefined;
  const e = A.createEngine(oc, oc.destination, { seed: 1, pad: false, at: 0, master: 1, musique: 1 });
  const ch = A._chargeur(oc);
  e.setTheme(nom, { at: 0, fade: 0 });
  await A._attendre(oc);
  e.scheduleUntil(1.5);
  const mem = [], jointures = [];
  let derniere = null;
  for (let k = 1; k * 0.25 < duree; k++) {
    const tq = Math.round(k * 0.25 * sr / 128) * 128 / sr;
    if (tq >= duree) break;
    oc.suspend(tq).then(async () => {
      e.scheduleUntil(tq + 1.5);
      await A._attendre(oc);
      e.scheduleUntil(tq + 1.5 + 1e-3);
      mem.push([tq, ch.octets]);
      const s = e._segments();
      const der = s && s[s.length - 1];
      if (der && (!derniere || der.J0 !== derniere.J0)) { jointures.push({ t: der.J0 / sr, k: der.k, passage: der.passage }); derniere = der; }
      oc.resume();
    });
  }
  const buf = await oc.startRendering();
  // le silence : la plus longue suite de paquets de 10 ms quasi muets, hors du tout début
  const L = buf.getChannelData(0), Rr = buf.getChannelData(1), p = Math.round(sr / 100);
  let muets = 0, pire = 0;
  for (let i = Math.round(0.2 * sr); i + p <= L.length; i += p) {
    let s = 0;
    for (let j = i; j < i + p; j++) s += L[j] * L[j] + Rr[j] * Rr[j];
    if (s / (2 * p) < 1e-10) { muets++; if (muets > pire) pire = muets; } else muets = 0;
  }
  return { mem, jointures, pic: ch.pic, silenceMax: pire * 10, frequence: sr, erreurs: A.erreurs() };
}

async function verifier(o) {
  const { chromium } = require('playwright');
  if (!o.masters) throw new Error('--verifier veut --masters <dossier> (les WAV/FLAC et leurs JSON)');
  const manifeste = JSON.parse(fs.readFileSync(MA.MANIFESTE, 'utf8'));
  const cles = (o.cles.length ? o.cles : Object.keys(manifeste.themes)).filter((k) => manifeste.themes[k] && MA.fichierMaster(o.masters, k));
  if (!cles.length) throw new Error('aucun thème à la fois dans le manifeste et dans ' + o.masters);
  const out = o.out || path.join(process.cwd(), 'banc_coutures');
  fs.mkdirSync(out, { recursive: true });
  // les variantes « sans étiquette » : les blocs et l'étalon réencodés sans l'étiquette LAME
  const sansEt = path.join(out, 'sans_etiquette');
  fs.mkdirSync(sansEt, { recursive: true });
  const etalonSans = MA.etalon(path.join(sansEt, '.etalon.mp3'), true).toString('base64');

  const texte = require(path.join(ICI, 'musique_sources.js')).texte();
  const exe = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const page = await browser.newPage();
  const erreursPage = [];
  page.on('pageerror', (e) => erreursPage.push(e.message));
  await page.route(HOTE + '**', (route) => {
    const u = new URL(route.request().url());
    if (u.pathname === '/') return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: '<!doctype html><meta charset="utf-8"><script>' + texte.split('</script').join('<\\/script') + '</script>' });
    const m = /^\/(normal|sans)\/([a-z0-9_.]+\.mp3)$/.exec(u.pathname);
    if (!m) return route.fulfill({ status: 404, body: '' });
    const f = path.join(m[1] === 'normal' ? MA.SORTIE : sansEt, m[2]);
    if (!fs.existsSync(f)) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ status: 200, contentType: 'audio/mpeg', body: fs.readFileSync(f) });
  });
  await page.goto(HOTE);

  const rapport = { themes: {}, date: new Date().toISOString() };
  const variantes = [
    { nom: 'normal', base: 'normal/', etalon: manifeste.etalon.mp3, frequences: [44100, 48000], decalageVrai: 0 },
    { nom: 'sans-etiquette', base: 'sans/', etalon: etalonSans, frequences: [44100], decalageVrai: 1105 },
    { nom: 'etalon-faux', base: 'sans/', etalon: manifeste.etalon.mp3, frequences: [44100], decalageVrai: 1105 }
  ];
  const lignes = [];
  for (const cle of cles) {
    const t = manifeste.themes[cle];
    const m = MA.lireMaster(o.masters, cle);
    // les blocs réencodés sans étiquette (une fois par thème)
    for (const b of t.blocs) {
      const f = path.join(sansEt, b.fichier);
      if (!fs.existsSync(f)) MA.encoderMp3(m.w.L, m.w.R, b.debut, b.fin, f, true);
    }
    const N = t.blocs.length, m0 = t.boucle_bloc || 1, FSm = MA.FS;
    // les jointures : [type, la jointure dans le repère du bloc qui finit] (on part trois secondes avant)
    const joints = [];
    for (let k = 0; k < m0 - 1; k++) joints.push(['bloc ' + k + '→' + (k + 1), t.blocs[k].a]);
    joints.push(['entree', t.entree]);
    for (let k = m0; k < N - 1; k++) joints.push(['bloc ' + k + '→' + (k + 1), t.blocs[k].a]);
    joints.push(['boucle', t.boucle[1]]);
    rapport.themes[cle] = {};
    for (const v of variantes) {
      for (const sr of v.frequences) {
        // une adresse par variante : le cache des MP3 du lecteur ne mélange pas deux encodages
        const man = JSON.parse(JSON.stringify(manifeste));
        man.etalon = { clic: manifeste.etalon.clic, mp3: v.etalon };
        await page.evaluate(({ man, base }) => { window.FusibleAudio.enregistrements(man, { base }); }, { man, base: v.base + '' });
        for (const [type, xJ] of joints) {
          const xDepart = Math.max(0, xJ - 3 * FSm);
          const r = await page.evaluate(jouerJointure, { nom: cle, xDepart, duree: 4.5, sr });
          const lire = (b64) => { const b = Buffer.from(b64, 'base64'); return new Float32Array(b.buffer, b.byteOffset, b.byteLength / 4); };
          if (r.version !== 'rendu' || !r.P) {
            lignes.push(`${cle.padEnd(11)} ${v.nom.padEnd(14)} ${sr} ${type.padEnd(9)} ✗ pas de jointure écrite (${r.version}, ${r.segs ? r.segs.length : 0} segment(s)) ${JSON.stringify(r.erreurs)}`);
            console.log(lignes[lignes.length - 1]);
            continue;
          }
          const P = r.P.map(lire), Aa = r.A.map(lire), Ba = r.B.map(lire);
          const [A, B] = r.segs, ratio = sr / FSm, D = A.decalage, dv = v.decalageVrai;
          // la position du master que chaque nœud lit en la trame n (dv : le retard que le décodeur a vraiment
          // laissé ; le lecteur, lui, a supposé D)
          const xDe = (s, n) => s.bd - dv + (s.o + (n - s.T)) / ratio;
          const mst = [lecteurMaster(m.w.L), lecteurMaster(m.w.R)];
          const W = r.fondu * ratio, tA = (A.J - W) / sr, tB = A.J / sr;
          const gB = (n) => { const tt = n / sr; return tt <= tA ? 0 : tt >= tB ? 1 : (tt - tA) / (tB - tA); };
          const rms = (f, a, b) => { let s2 = 0, k = 0; for (let n = a; n < b; n++) { const v2 = f(n); s2 += v2 * v2; k++; } return k ? Math.sqrt(s2 / k) : 0; };
          const w0 = r.w0, nw = r.nw, J = A.J, i = (n) => n - w0;
          // 1. l'exactitude : ce que la sortie fait entendre contre ce que les deux nœuds devaient faire, aux
          //    mêmes échantillons des mêmes tampons (le plan, les fondus) — à l'arrondi des flottants près
          let exact = 0, trou = 0;
          // 2. l'erreur du MP3 (décodé contre master), 4. le saut, 6. les passages
          const mA = [new Float64Array(nw), new Float64Array(nw)], mB = [new Float64Array(nw), new Float64Array(nw)], ref = [new Float64Array(nw), new Float64Array(nw)], ctr = [new Float64Array(nw), new Float64Array(nw)];
          for (let n = w0; n < w0 + nw; n++) {
            const g = gB(n), aOn = n >= A.T && n < (A.fin || Infinity), bOn = n >= B.T;
            for (let c = 0; c < 2; c++) {
              const a = aOn ? Aa[c][i(n)] : 0, bb = bOn ? Ba[c][i(n)] : 0;
              const att = r.niveau * ((1 - g) * a + g * bb);
              const d = Math.abs(P[c][i(n)] - att);
              if (d > exact) exact = d;
              const ma = mst[c](xDe(A, n)), mb = mst[c](xDe(B, n));
              mA[c][i(n)] = a - ma; mB[c][i(n)] = bb - mb;
              ref[c][i(n)] = r.niveau * ((1 - g) * ma + g * mb);      // le même plan, sans MP3
              ctr[c][i(n)] = r.niveau * (n < J ? ma : mb);              // la suite que le contrat promet
            }
            if (P[0][i(n)] === 0 && P[1][i(n)] === 0 && Math.abs(ref[0][i(n)]) + Math.abs(ref[1][i(n)]) > 1e-4) trou++;
          }
          const jA = Math.max(w0 + 1, Math.floor(J - W - 256)), jB = Math.min(w0 + nw, Math.ceil(J + 256)), L0 = jB - jA;
          // LE SAUT : ce que la jointure AJOUTE. Autour d'elle, l'erreur du joué (contre le même plan sans MP3) n'est faite
          // que du bruit des deux décodages ; on la compare au bruit de chacun SEUL, dans la même fenêtre (le bloc A
          // continue au-delà de la jointure, le B commence avant) : ses aigus (la différence d'un échantillon au
          // suivant, en moyenne quadratique) et sa crête (le plus grand saut : un clic y monterait). Une jointure qui
          // n'ajoute rien ne dépasse pas le pire des deux seuls.
          const dP = (n) => Math.max(Math.abs((P[0][i(n)] - ref[0][i(n)]) - (P[0][i(n) - 1] - ref[0][i(n) - 1])), Math.abs((P[1][i(n)] - ref[1][i(n)]) - (P[1][i(n) - 1] - ref[1][i(n) - 1])));
          const seul = (X, s0) => {   // l'erreur d'un décodage seul (non coupé à la fin de son nœud)
            const e = [new Float64Array(nw), new Float64Array(nw)];
            for (let n = w0; n < w0 + nw; n++) for (let c = 0; c < 2; c++) e[c][i(n)] = r.niveau * (X[c][i(n)] - mst[c](xDe(s0, n)));
            return (n) => Math.max(Math.abs(e[0][i(n)] - e[0][i(n) - 1]), Math.abs(e[1][i(n)] - e[1][i(n) - 1]));
          };
          const dA = seul(Aa, A), dB = seul(Ba, B), jB0 = Math.max(jA, Math.ceil(B.T) + 2);
          const maxi = (f, a2, b2) => { let mx = 0; for (let n = a2; n < b2; n++) mx = Math.max(mx, f(n)); return mx; };
          const hfP = rms(dP, jA, jB), hfSeul = Math.max(rms(dA, jA, jB), rms(dB, jB0, jB));
          const crP = maxi(dP, jA, jB), crSeul = Math.max(maxi(dA, jA, jB), maxi(dB, jB0, jB));
          const sautHf = db(hfP) - db(hfSeul), sautCr = db(crP) - db(crSeul);
          // 3. l'alignement : dans le fondu, les deux décodages l'un contre l'autre, et leurs erreurs de MP3
          const f0 = Math.max(w0, Math.floor(J - W)), f1 = Math.min(w0 + nw, Math.ceil(J));
          const ecartAB = rms((n) => (Aa[0][i(n)] - Ba[0][i(n)]), f0, f1), bruitAB = Math.hypot(rms((n) => mA[0][i(n)], f0, f1), rms((n) => mB[0][i(n)], f0, f1));
          // le décalage : celui qui rend les deux décodages le plus semblables (le plus petit écart). Une corrélation
          // brute, elle, préfère un décalage quand l'énergie entre ou sort de la fenêtre (une note qui s'éteint,
          // une basse seule) : des jointures alignées s'y lisaient « −1 », pendant que leur écart A/B au décalage 0
          // restait sous le bruit du MP3
          let lag = 0, best = Infinity;
          for (let d = -4; d <= 4; d++) {
            let e2 = 0;
            for (let n = f0 + 8; n < f1 - 8; n++) {
              const u = Aa[0][i(n)] - Ba[0][i(n + d)], v = Aa[1][i(n)] - Ba[1][i(n + d)];
              e2 += u * u + v * v;
            }
            if (e2 < best) { best = e2; lag = d; }
          }
          const sig = rms((n) => ctr[0][i(n)], w0, w0 + nw) / r.niveau;
          const mp3 = Math.max(rms((n) => mA[0][i(n)], w0, Math.floor(J)), rms((n) => mB[0][i(n)], Math.ceil(J), w0 + nw));
          // 6. les passages : dans le fondu, ce que le master change d'un passage à l'autre (le même plan sans MP3
          //    contre la suite du contrat), et le creux de niveau que le fondu de deux prises fait (par 2 ms)
          const passRms = rms((n) => (ref[0][i(n)] - ctr[0][i(n)]) / r.niveau, f0, f1);
          let creux = 0;
          const p2 = Math.round(0.002 * sr);
          for (let a2 = f0; a2 + p2 <= f1; a2 += p2) {
            const lp = Math.hypot(rms((n) => P[0][i(n)], a2, a2 + p2), rms((n) => P[1][i(n)], a2, a2 + p2));
            const lc = Math.hypot(rms((n) => ctr[0][i(n)], a2, a2 + p2), rms((n) => ctr[1][i(n)], a2, a2 + p2), rms((n) => r.niveau * mst[0](xDe(B, n)), a2, a2 + p2), rms((n) => r.niveau * mst[1](xDe(B, n)), a2, a2 + p2)) / Math.SQRT2;
            if (lc > 1e-6) creux = Math.min(creux, db(lp) - db(lc));
          }
          const res = {
            exact: db(exact), trou, lag, hf: sautHf, crete: sautCr,
            mp3: db(mp3) - db(sig), alignement: db(ecartAB) - db(bruitAB), passagesRel: db(passRms) - db(sig), creux, decalage: D, segs: r.segs
          };
          if (process.env.BANC_DIAG) {
            const pas = 256, l = [];
            for (let a = w0 + 1; a + pas <= w0 + nw; a += pas) l.push({ n: a - Math.round(J), e: db(rms((n) => (P[0][i(n)] - ref[0][i(n)]), a, a + pas)), d: db(rms(dP, a, a + pas)), dA: db(rms(dA, a, a + pas)), dB: db(rms(dB, a, a + pas)), sig: db(rms((n) => ref[0][i(n)], a, a + pas)) });
            fs.writeFileSync(path.join(out, 'diag_' + cle + '_' + v.nom + '_' + sr + '_' + type.replace(/[^a-z0-9]/g, '') + '.json'), JSON.stringify({ J, A, B, W, l }, null, 0));
          }
          const prise = /^(entree|boucle)$/.test(type);
          const ok = exact < 1e-5 && !trou && (prise || (lag === 0 && res.alignement < 3)) && res.hf <= 1 && res.crete <= 1;
          lignes.push(`${cle.padEnd(11)} ${v.nom.padEnd(14)} ${String(sr).padEnd(5)} ${type.padEnd(9)} exact ${fr(res.exact, 0)} dB · trou ${trou} · ` +
            (prise ? `prises ${fr(res.passagesRel)} dB, creux ${fr(res.creux)} dB` : `décalage ${lag}, A/B ${res.alignement >= 0 ? '+' : ''}${fr(res.alignement)} dB`) +
            ` · ajouté : aigus ${res.hf >= 0 ? '+' : ''}${fr(res.hf)} dB, crête ${res.crete >= 0 ? '+' : ''}${fr(res.crete)} dB · MP3 ${fr(res.mp3)} dB · retard ${D}  ${ok ? '✓' : '✗'}`);
          console.log(lignes[lignes.length - 1]);
        }
      }
    }
  }
  // LA MÉMOIRE : dix minutes du thème le plus long, à 48 et 44,1 kHz
  await page.evaluate(({ man }) => { window.FusibleAudio.enregistrements(man, { base: 'normal/' }); }, { man: manifeste });
  const long = cles.slice().sort((a, b) => (manifeste.themes[b].boucle[1] - manifeste.themes[b].boucle[0]) - (manifeste.themes[a].boucle[1] - manifeste.themes[a].boucle[0]))[0];
  for (const sr of [48000, 44100]) {
    const r = await page.evaluate(jouerLongtemps, { nom: long, duree: 600, sr });
    const moy = r.mem.reduce((s, x) => s + x[1], 0) / Math.max(1, r.mem.length), pic = Math.max(...r.mem.map((x) => x[1]));
    const ligne = `mémoire ${long} ${sr} Hz, 10 min : décodé au plus ${(pic / 1048576).toFixed(1)} Mio (${(pic / 1e6).toFixed(1)} Mo), en moyenne ${(moy / 1048576).toFixed(1)} Mio · ${r.jointures.length} segments (${r.jointures.map((j) => j.k).join(' ')}) · plus long silence ${r.silenceMax} ms`;
    console.log(ligne);
    lignes.push(ligne);
    rapport['memoire@' + sr] = { theme: long, pic, moyenne: moy, jointures: r.jointures, silenceMax: r.silenceMax, courbe: r.mem.filter((x, i) => i % 8 === 0) };
  }
  if (erreursPage.length) console.log('erreurs de la page : ' + erreursPage.join(' | '));
  fs.writeFileSync(path.join(out, 'coutures.json'), JSON.stringify(rapport, null, 1));
  fs.writeFileSync(path.join(out, 'coutures.txt'), lignes.join('\n') + '\n');
  console.log('→ ' + path.join(out, 'coutures.json'));
  await browser.close();
}

module.exports = { verifier };
