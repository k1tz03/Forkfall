#!/usr/bin/env node
// LE JOURNAL D'APPELS DU SON — la preuve qu'un changement d'audio.js ne touche pas au son de la qualité pleine.
//
// Pourquoi pas deux WAV côte à côte : avec le Chromium de Playwright, le rendu hors ligne ne se refait pas au bit
// près, même pour le même code sur la même machine — un nœud qui reçoit trois entrées les somme dans l'ordre d'un
// ensemble de pointeurs, et les flottants changent à la dernière décimale (le bruit entre deux rendus du même
// code : −109 dB, quelques échantillons sur dix mille diffèrent d'un bit sur 16). Une comparaison de WAV peut
// dire « à ce bruit près » ; elle ne peut pas dire « identique ». Ce journal, lui, le peut : il enregistre CHAQUE
// appel que le moteur fait à Web Audio — création de nœud, connexion, automation de paramètre, réglage de
// propriété, start/stop — avec ses arguments (les nœuds par leur numéro d'ordre de rencontre, les tampons, les
// courbes et les ondes par une empreinte de leur contenu). Deux moteurs qui laissent le même journal bâtissent le
// même graphe, réglé de la même façon : le même son. (Pour un ordonnancement donné : le son d'un balayage de
// filtre de section dépend du moment où le séquenceur écrit — voir `debut` dans audio.js — et le journal fixe
// ce moment.)
//
//   NODE_PATH=/opt/node22/lib/node_modules node packages/tools/web/journal_son.js [options]
//
//   --git <réf>        l'ancien audio.js est celui de cette référence git (défaut : HEAD)
//   --ancien <fichier> ou : un fichier audio.js d'avant
//   --rapide           cinq passages seulement (les plus lourds), pas les vingt thèmes
//
// Il rend, pour chaque scénario (les cinq passages les plus lourds, chacun des vingt thèmes depuis son début en
// 2030 — les voix `epoque` —, et le moteur entier : nappe, lieux, gestes, jingle, fondus enchaînés, modes), le
// nombre d'appels, de nœuds et l'empreinte du journal de l'ancien audio.js, du nouveau, et du nouveau en
// `qualite: 'pleine'`. Ils doivent être identiques ; sortie 0 si oui. Deux témoins vérifient que le journal voit :
// la qualité légère doit laisser un autre journal, et un audio.js dont une constante change d'un millionième aussi.
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ICI = __dirname;
const MUSIQUE = require(path.join(ICI, 'musique_sources.js'));

function args() {
  const a = process.argv.slice(2), o = { git: 'HEAD', rapide: false };
  for (let i = 0; i < a.length; i++) {
    if (a[i] === '--git') o.git = a[++i];
    else if (a[i] === '--ancien') o.ancien = path.resolve(a[++i]);
    else if (a[i] === '--rapide') o.rapide = true;
    else { console.error('journal_son : option inconnue ' + a[i]); process.exit(2); }
  }
  return o;
}

// le script de la page : un audio.js (le texte donné) puis les thèmes du dépôt, chacun dans son filet
function texte(audioSrc) {
  const m = [audioSrc];
  for (const f of MUSIQUE.fichiers()) {
    m.push('/* ── musique/' + f.nom + ' ── */\ntry {\n' + fs.readFileSync(f.chemin, 'utf8') + '\n} catch (e) {\n' +
      '  if (typeof FusibleAudio === "object" && FusibleAudio._erreur) FusibleAudio._erreur("musique/' + f.nom + '", e);\n}');
  }
  return m.join('\n');
}

// ── dans la page : le moteur tourne sur un contexte dont chaque appel est noté ──
function tracerDansLaPage(o) {
  const A = window.FusibleAudio;
  const log = [], ids = new WeakMap(), proxies = new WeakMap(), natifs = new WeakMap(), hashes = new WeakMap();
  let nid = 0;
  const id = (x) => { if (!ids.has(x)) ids.set(x, ++nid); return ids.get(x); };
  function fnv(arr) {
    let h = 2166136261 >>> 0;
    const u = new Uint32Array(arr.buffer, arr.byteOffset, arr.length);
    for (let i = 0; i < u.length; i++) { h ^= u[i]; h = Math.imul(h, 16777619) >>> 0; }
    return h.toString(16);
  }
  function hashTab(a) { if (!hashes.has(a)) hashes.set(a, fnv(a)); return hashes.get(a); }
  function hashBuf(b) {
    if (!hashes.has(b)) {
      const l = [];
      for (let c = 0; c < b.numberOfChannels; c++) l.push(fnv(b.getChannelData(c)));
      hashes.set(b, b.numberOfChannels + 'x' + b.length + '@' + b.sampleRate + ':' + l.join('/'));
    }
    return hashes.get(b);
  }
  const estWebAudio = (v) => v && typeof v === 'object' && (v instanceof AudioNode || v instanceof AudioParam || v instanceof AudioBuffer || v instanceof PeriodicWave || v instanceof BaseAudioContext);
  const dehabille = (v) => (v && typeof v === 'object' && natifs.has(v)) ? natifs.get(v) : v;
  function ser(v) {
    if (v === undefined) return 'u';
    if (v === null) return 'n';
    switch (typeof v) {
      case 'number': return Object.is(v, -0) ? '-0' : String(v);
      case 'string': return JSON.stringify(v);
      case 'boolean': return v ? 'T' : 'F';
      case 'function': return 'fn';
    }
    v = dehabille(v);
    if (v instanceof AudioBuffer) return '#' + id(v) + '[' + hashBuf(v) + ']';
    if (estWebAudio(v)) return '#' + id(v);
    if (v instanceof Float32Array) return 'F[' + v.length + ':' + hashTab(v) + ']';
    return Object.prototype.toString.call(v);
  }
  const habille = (v) => (v && typeof v === 'object' && estWebAudio(v) && !(v instanceof BaseAudioContext)) ? envelopper(v) : v;
  // l'appel d'une méthode : le numéro du nœud est pris AVANT l'appel (un nœud est numéroté dans l'ordre où le
  // code le touche pour la première fois), les arguments et le résultat sont notés après
  function appeler(t, k, v, nom, argsObj) {
    const n = nom || id(t);
    const args = Array.prototype.map.call(argsObj, dehabille);
    const res = v.apply(t, args);
    log.push(n + '.' + String(k) + '(' + args.map(ser).join(',') + ')' + (res !== undefined && estWebAudio(res) ? '->' + ser(res) : ''));
    return habille(res);
  }
  function envelopper(cible) {
    if (proxies.has(cible)) return proxies.get(cible);
    const p = new Proxy(cible, {
      get(t, k) {
        if (k === 'constructor') return t.constructor;
        const v = Reflect.get(t, k, t);
        if (typeof v === 'function') return function () { return appeler(t, k, v, null, arguments); };
        return habille(v);
      },
      set(t, k, val) { const nat = dehabille(val); log.push(id(t) + '.' + String(k) + '=' + ser(nat)); t[k] = nat; return true; }
    });
    proxies.set(cible, p); natifs.set(p, cible);
    return p;
  }
  const natif = new OfflineAudioContext(2, Math.ceil(44100 * (o.duree + 2)), 44100);
  const ctx = new Proxy(natif, {
    get(t, k) {
      if (k === 'constructor') return t.constructor;
      const v = Reflect.get(t, k, t);
      if (typeof v === 'function') return function () { return appeler(t, k, v, 'ctx', arguments); };
      return habille(v);
    },
    set(t, k, val) { t[k] = dehabille(val); return true; }
  });
  natifs.set(ctx, natif);
  const e = A.createEngine(ctx, ctx.destination, Object.assign({ seed: 1, pad: false, at: 0 }, o.moteur || {}));
  e.setYear(o.annee || 1990);
  (o.avant || []).forEach((cmd) => { e[cmd[0]].apply(e, cmd.slice(1)); });
  if (o.nom) e.setTheme(o.nom, { at: 0, fade: 0, depuis: o.depuis == null ? undefined : o.depuis });
  const AV = o.avance || 1.5, CAD = o.cadence || 0.25;
  for (let k = 0; k * CAD <= o.duree; k++) {
    const t = k * CAD;
    (o.aux || []).forEach((cmd) => { if (Math.abs(cmd[0] - t) < 1e-9) e[cmd[1]].apply(e, cmd.slice(2)); });
    e.scheduleUntil(t + AV);
  }
  let h1 = 0x811c9dc5 >>> 0, h2 = 0x01000193 >>> 0;
  for (let i = 0; i < log.length; i++) {
    const s = log[i] + '\n';
    for (let j = 0; j < s.length; j++) {
      const c = s.charCodeAt(j);
      h1 ^= c; h1 = Math.imul(h1, 16777619) >>> 0;
      h2 = (Math.imul(h2 ^ c, 0x85ebca6b) + (h2 >>> 13)) >>> 0;
    }
  }
  return { n: log.length, noeuds: nid, empreinte: h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0'), erreurs: A.erreurs().length };
}

// ── les scénarios ──
function scenarios(rapide) {
  const S = [];
  [['accueil', 'C2'], ['livre_h2', 'E'], ['suspense', 'D'], ['sombre', 'C'], ['livre_h1', 'B3']]
    .forEach(([nom, depuis]) => S.push({ k: `${nom} ${depuis} 20 s`, o: { nom, depuis, duree: 20 } }));
  if (rapide) return S;
  ['accueil', 'decouverte', 'enerve', 'fin', 'joie', 'livre_h1', 'livre_h10', 'livre_h2', 'livre_h3', 'livre_h4', 'livre_h5', 'livre_h6', 'livre_h7', 'livre_h8', 'livre_h9', 'match', 'sombre', 'suspense', 'ville_jour', 'ville_nuit']
    .forEach((nom) => S.push({ k: `${nom} début 14 s (2030)`, o: { nom, duree: 14, annee: 2030 } }));
  S.push({ k: 'moteur entier (nappe, lieux, gestes, fondus, modes)', o: {
    nom: null, duree: 30, moteur: { pad: true },
    avant: [['setAmbiance', 'tribune', { fade: 0, at: 0 }], ['setTension', 0.6, 0]],
    aux: [
      [1.0, 'setTheme', 'livre_h4', { at: 1.0, fade: 0.6 }],
      [2.0, 'play', 'carte_arrivee', { at: 2.0 }], [2.5, 'playAll', ['choix_droite', 'palier_haut'], { at: 2.5 }],
      [3.0, 'jingle', 'depart', { at: 3.0 }],
      [6.0, 'setTheme', 'sombre', { at: 6.0, fade: 0.8 }],
      [9.0, 'setAmbiance', 'bureau', { fade: 1.5, at: 9.0 }],
      [12.0, 'setTheme', 'ville_nuit', { at: 12.0, fade: 0.6, depuis: 1 }],
      [15.0, 'setYear', 2030, 15.0],
      [16.0, 'setTheme', null, { at: 16.0, fade: 1.2 }],
      [20.0, 'setMode', 'gestes', 20.0], [22.0, 'setMode', 'tout', 22.0], [24.0, 'setTheme', 'fin', { at: 24.0, fade: 0.6 }]
    ] } });
  return S;
}

async function main() {
  const o = args();
  const { chromium } = require('playwright');
  const nouveau = fs.readFileSync(path.join(ICI, 'audio.js'), 'utf8');
  let ancien;
  if (o.ancien) ancien = fs.readFileSync(o.ancien, 'utf8');
  else ancien = execFileSync('git', ['show', o.git + ':packages/tools/web/audio.js'], { cwd: path.resolve(ICI, '..', '..', '..'), encoding: 'utf8', maxBuffer: 64 << 20 });
  // un témoin : le nouvel audio.js dont le niveau général change d'un millionième
  const temoin = nouveau.replace('opt.master == null ? 0.85 : opt.master);\n    // Un limiteur', 'opt.master == null ? 0.850001 : opt.master);\n    // Un limiteur');
  if (temoin === nouveau) { console.error('journal_son : le témoin n\'a pas trouvé sa constante (le niveau général du moteur a changé de place ?)'); process.exit(2); }
  const exe = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const S = scenarios(o.rapide);
  async function journal(src, sc, moteur, legere) {
    const page = await browser.newPage();   // une page neuve : les tampons gardés par fréquence ne passent pas d'un scénario à l'autre
    try {
      await page.setContent('<!doctype html><meta charset="utf-8"><script>' + texte(src).split('</script').join('<\\/script') + '</script>');
      const oo = JSON.parse(JSON.stringify(sc.o));
      if (moteur) oo.moteur = Object.assign({}, oo.moteur || {}, moteur);
      if (legere) { oo.avance = 1.0; oo.cadence = 0.15; }
      return await page.evaluate(tracerDansLaPage, oo);
    } finally { await page.close(); }
  }
  let ok = true;
  console.log('scénario'.padEnd(54) + 'appels'.padStart(8) + 'nœuds'.padStart(7) + '  ancien == nouveau == nouveau{qualite:pleine}');
  for (const sc of S) {
    const a = await journal(ancien, sc), b = await journal(nouveau, sc), c = await journal(nouveau, sc, { qualite: 'pleine' });
    const egal = a.empreinte === b.empreinte && a.empreinte === c.empreinte && a.n === b.n && a.n === c.n;
    if (!egal) ok = false;
    console.log(sc.k.padEnd(54) + String(a.n).padStart(8) + String(a.noeuds).padStart(7) + '  ' + (egal ? 'identiques ' + a.empreinte : 'DIFFÉRENTS ' + [a, b, c].map((x) => x.empreinte + '/' + x.n).join(' ')));
  }
  // les témoins
  const t0 = S[0], a0 = await journal(ancien, t0);
  const leg = await journal(nouveau, t0, { qualite: 'legere' }, true), tem = await journal(temoin, t0);
  const voit1 = leg.empreinte !== a0.empreinte, voit2 = tem.empreinte !== a0.empreinte;
  console.log(`témoin 1, la qualité légère : ${voit1 ? 'un autre journal (' + leg.n + ' appels, ' + leg.noeuds + ' nœuds) — le journal voit' : 'LE MÊME JOURNAL : le journal ne voit rien'}`);
  console.log(`témoin 2, une constante changée d'un millionième : ${voit2 ? 'un autre journal — le journal voit' : 'LE MÊME JOURNAL : le journal ne voit rien'}`);
  await browser.close();
  ok = ok && voit1 && voit2;
  console.log(ok ? '\nLE SON DE LA QUALITÉ PLEINE N\'A PAS CHANGÉ (journaux identiques)' : '\nLE SON DE LA QUALITÉ PLEINE A CHANGÉ, ou le journal est aveugle (voir ci-dessus)');
  process.exit(ok ? 0 : 1);
}
main().catch((e) => { console.error('journal_son : ' + (e && e.message ? e.message : e)); process.exit(1); });
