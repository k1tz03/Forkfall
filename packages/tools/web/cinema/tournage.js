#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   LE TOURNAGE — un film du cinéma (cinema/films/<id>.js) rendu image par image,
   hors temps réel, à cadence fixe, et livré en vidéos (docs/design/cinematiques.md).

   Chromium (Playwright) rend l'image maîtresse — un carré, WebGL par SwiftShader sur
   une machine sans carte graphique — et y découpe chaque format à sa taille native,
   habillé (bandes, textes, grain) par le même code que le jeu. La musique et les
   bruits sont rendus hors ligne par le même moteur sonore que le jeu (audio.js,
   OfflineAudioContext), puis ffmpeg encode chaque format et y colle le son.

     NODE_PATH=/opt/node22/lib/node_modules node packages/tools/web/cinema/tournage.js \
       --film trois_mille_masques --out /tmp/films

   Options :
     --film <id>          le film (obligatoire)
     --out <dossier>      où poser les vidéos (défaut : ./tournage)
     --formats a,b        9x16, 16x9, 4x5, appstore (défaut : les quatre)
     --fps <n>            la cadence (défaut : 30 ; l'App Store est toujours à 30)
     --taille <px>        le côté de l'image maîtresse (défaut : 1920)
     --qualite <q>        haute | moyenne | basse (défaut : haute)
     --de <s> --a <s>     une tranche du film (un essai) ; l'App Store n'est pas tourné
     --brouillon          un essai rapide : maîtresse 720, 12 i/s, formats à la moitié
     --nom "…" --genre m  le héros (le visage des masques) ; défaut : Marc Delorme, m
     --sans-son           pas de musique
     --chromium <chemin>  défaut : /opt/pw-browsers/chromium s'il existe
     --port <n>           le serveur local (défaut : un port libre)

   Ce qui sort, pour un film <id> :
     <id>.<format>.mp4          H.264 High, yuv420p, +faststart, CRF plafonné
     <id>.<format>.affiche.jpg  l'affiche (l'image de `affiche`, le titre du film)
     <id>.planche.16x9.jpg      la planche contact (ffmpeg tile), et .9x16
     <id>.wav, <id>.court.wav   le son, tel qu'il est collé
     <id>.rapport.json          les temps, les tailles, ce que coûte chaque plan
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn, spawnSync } = require('child_process');

const WEB = path.resolve(__dirname, '..');

// Les formats de livraison. Le débit : ≤ 15 Mo par minute en 1080 × 1920 (réseaux), soit
// ~2 Mbit/s tout compris ; l'App Store suit la recommandation d'Apple pour les aperçus
// (H.264 High 4.0, 30 i/s, 10 Mbit/s environ, AAC 256 kbit/s stéréo, 15 à 30 s).
const FORMATS = {
  '9x16': { l: 1080, h: 1920, crf: 23, maxrate: '1800k', bufsize: '3600k', niveau: '4.1', aac: '192k' },
  '16x9': { l: 1920, h: 1080, crf: 23, maxrate: '1800k', bufsize: '3600k', niveau: '4.1', aac: '192k' },
  '4x5': { l: 1080, h: 1350, crf: 23, maxrate: '1400k', bufsize: '2800k', niveau: '4.1', aac: '192k' },
  appstore: { l: 886, h: 1920, crf: 19, maxrate: '10M', bufsize: '20M', niveau: '4.0', aac: '256k', montage: 'court', fps: 30, max: 30 },
};

function lireArgs(argv) {
  const o = { formats: Object.keys(FORMATS), fps: 30, taille: 1920, qualite: 'haute', out: 'tournage', nom: 'Marc Delorme', genre: 'm', port: 0 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i], v = () => argv[++i];
    if (a === '--film') o.film = v();
    else if (a === '--out') o.out = v();
    else if (a === '--formats') o.formats = v().split(',').map((s) => s.trim()).filter(Boolean);
    else if (a === '--fps') o.fps = +v();
    else if (a === '--taille') o.taille = +v();
    else if (a === '--qualite') o.qualite = v();
    else if (a === '--de') o.de = +v();
    else if (a === '--a') o.a = +v();
    else if (a === '--brouillon') o.brouillon = true;
    else if (a === '--nom') o.nom = v();
    else if (a === '--genre') o.genre = v();
    else if (a === '--sans-son') o.sansSon = true;
    else if (a === '--chromium') o.chromium = v();
    else if (a === '--port') o.port = +v();
    else throw new Error('option inconnue : ' + a);
  }
  if (!o.film) throw new Error('--film <id> manque (un fichier de packages/tools/web/cinema/films/)');
  for (const f of o.formats) if (!FORMATS[f]) throw new Error('format inconnu : ' + f + ' (' + Object.keys(FORMATS).join(', ') + ')');
  if (o.brouillon) { o.taille = Math.min(o.taille, 720); o.fps = 12; }
  return o;
}

// ─── la page de tournage : le lecteur, three.js, la trousse, le film, le son, les polices
function pageHtml(film) {
  const kit = fs.readdirSync(path.join(WEB, 'cinema', 'kit')).filter((f) => /^\d\d_[a-z_]+\.js$/.test(f)).sort();
  // la musique : audio.js, et ses thèmes s'ils vivent dans leurs propres fichiers (musique/*.js)
  const sons = ['audio.js'].concat(['musique', 'audio'].filter((d) => fs.existsSync(path.join(WEB, d)) && fs.statSync(path.join(WEB, d)).isDirectory())
    .flatMap((d) => fs.readdirSync(path.join(WEB, d)).filter((f) => f.endsWith('.js')).sort().map((f) => d + '/' + f)));
  const scripts = ['art.js'].concat(sons, ['cinema/lecteur.js', 'vendor/three/fusible-three.js'], kit.map((f) => 'cinema/kit/' + f), ['cinema/films/' + film + '.js']);
  const police = (fam, fichier, poids, style) => '@font-face{font-family:"' + fam + '";font-weight:' + poids + ';font-style:' + (style || 'normal') + ';src:url(/cinema/polices/' + fichier + ') format("woff2")}';
  return '<!doctype html><meta charset="utf-8"><title>tournage</title><style>' +
    police('Space Mono', 'space-mono-latin-400-normal.woff2', 400) + police('Space Mono', 'space-mono-latin-700-normal.woff2', 700) +
    police('Space Mono', 'space-mono-latin-400-italic.woff2', 400, 'italic') + police('Jersey 15', 'jersey-15-latin-400-normal.woff2', 400) +
    'body{margin:0;background:#000}</style>' + scripts.map((s) => '<script src="/' + s + '"></script>').join('') + '<script>window.__PRET__ = true;</script>';
}

function serveur(film, port) {
  const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png' };
  const html = pageHtml(film);
  const srv = http.createServer((q, r) => {
    const u = decodeURIComponent(q.url.split('?')[0]);
    if (u === '/' || u === '/tournage.html') { r.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); return r.end(html); }
    const f = path.join(WEB, path.normalize(u).replace(/^(\.\.[/\\])+/, ''));
    if (!f.startsWith(WEB) || !fs.existsSync(f) || !fs.statSync(f).isFile()) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(r);
  });
  return new Promise((ok) => srv.listen(port, '127.0.0.1', () => ok(srv)));
}

// ─── le son, hors ligne, dans la page : la musique du film (son thème, sinon le secours),
// ses bruits à leurs temps, un fondu d'entrée et de sortie → un WAV 48 kHz stéréo (base64)
async function rendreSon(page, o) {
  return page.evaluate(async (o) => {
    const FA = window.FusibleAudio, FC = window.FusibleCinema, def = FC.films[o.film];
    if (!FA || !FA.createEngine) return { erreur: 'audio.js absent' };
    const sr = 48000, n = Math.ceil(sr * o.duree);
    const ctx = new OfflineAudioContext(2, n, sr);
    const e = FA.createEngine(ctx, ctx.destination, { seed: FC.kit.hash(o.film) % 100000, pad: false, at: 0 });
    const theme = FC.themeDe(def, FA);
    if (theme) e.setTheme(theme, { at: 0, fade: o.entree });
    for (const [t, nom] of o.sons) if (t >= 0 && t < o.duree) e.play(nom, { at: t });
    e.scheduleUntil(o.duree);
    const buf = await ctx.startRendering();
    const L = buf.getChannelData(0), R = buf.numberOfChannels > 1 ? buf.getChannelData(1) : L;
    const dv = new DataView(new ArrayBuffer(44 + n * 4));
    const ecrire = (p, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(p + i, s.charCodeAt(i)); };
    ecrire(0, 'RIFF'); dv.setUint32(4, 36 + n * 4, true); ecrire(8, 'WAVE'); ecrire(12, 'fmt ');
    dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 2, true); dv.setUint32(24, sr, true);
    dv.setUint32(28, sr * 4, true); dv.setUint16(32, 4, true); dv.setUint16(34, 16, true); ecrire(36, 'data'); dv.setUint32(40, n * 4, true);
    const fs0 = Math.round(sr * 0.05), fs1 = Math.round(sr * o.sortie);
    let crete = 0;
    for (let i = 0; i < n; i++) {
      // le fondu : 50 ms à l'entrée (pas de clic), la sortie avec l'image qui va au noir
      const k = Math.min(1, i / fs0, (n - i) / fs1);
      const l = Math.max(-1, Math.min(1, L[i] * k)), r = Math.max(-1, Math.min(1, R[i] * k));
      crete = Math.max(crete, Math.abs(l), Math.abs(r));
      dv.setInt16(44 + i * 4, l * 32767, true); dv.setInt16(46 + i * 4, r * 32767, true);
    }
    const u8 = new Uint8Array(dv.buffer); let bin = '';
    for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return { b64: btoa(bin), theme, crete };
  }, o);
}

function ffmpegPour(fichier, f, fps, son) {
  const args = ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-'];
  if (son) args.push('-ss', String(son.de), '-t', String(son.duree), '-i', son.wav);
  args.push('-map', '0:v');
  if (son) args.push('-map', '1:a');
  args.push('-c:v', 'libx264', '-preset', 'slow', '-profile:v', 'high', '-level:v', f.niveau, '-pix_fmt', 'yuv420p',
    '-crf', String(f.crf), '-maxrate', f.maxrate, '-bufsize', f.bufsize, '-g', String(fps * 2),
    // aq-mode 3 : les bits vont aux ombres (le film est la nuit : sans lui, les dégradés sombres se baguent)
    '-x264-params', 'aq-mode=3:aq-strength=0.9',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv', '-r', String(fps));
  if (son) args.push('-c:a', 'aac', '-b:a', f.aac, '-ar', '48000', '-ac', '2', '-shortest');
  args.push('-movflags', '+faststart', fichier);
  const p = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });
  const fini = new Promise((ok, ko) => p.on('close', (c) => (c === 0 ? ok() : ko(new Error('ffmpeg ' + path.basename(fichier) + ' : code ' + c)))));
  return {
    ecrire: (b) => new Promise((ok) => { if (p.stdin.write(b)) ok(); else p.stdin.once('drain', ok); }),
    fermer: () => { p.stdin.end(); return fini; },
  };
}

function hms(ms) { const s = Math.round(ms / 1000); return Math.floor(s / 60) + ' min ' + String(s % 60).padStart(2, '0') + ' s'; }

async function main() {
  const o = lireArgs(process.argv.slice(2));
  if (!fs.existsSync(path.join(WEB, 'cinema', 'films', o.film + '.js'))) throw new Error('pas de film ' + o.film + ' dans packages/tools/web/cinema/films/');
  if (spawnSync('ffmpeg', ['-version']).status !== 0) throw new Error('ffmpeg introuvable');
  fs.mkdirSync(o.out, { recursive: true });
  const { chromium } = require('playwright');
  const srv = await serveur(o.film, o.port);
  const url = 'http://127.0.0.1:' + srv.address().port + '/tournage.html';
  const exe = o.chromium || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
  // WebGL sans carte graphique : SwiftShader (lent, mais le même rendu partout)
  const nav = await chromium.launch({ executablePath: exe, args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] });
  const page = await nav.newPage({ viewport: { width: 320, height: 320 } });
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(e.message));
  // une ressource absente se dit par son adresse (le message de la console ne la donne pas)
  page.on('response', (r) => { if (r.status() >= 400 && !/favicon/.test(r.url())) console.warn('  (' + r.status() + ' ' + r.url() + ')'); });
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) erreurs.push(m.text()); });
  const debut = Date.now();
  try {
    await page.goto(url);
    await page.waitForFunction(() => window.__PRET__ && window.FusibleCinema && window.FusibleCinema.films);
    const info = await page.evaluate((a) => window.FusibleCinema.tournage.preparer(a.film, { taille: a.taille, qualite: a.qualite, heros: { nom: a.nom, genre: a.genre } }), o);
    if (erreurs.length) throw new Error('la page : ' + erreurs.join(' | '));
    const prep = Date.now() - debut;
    console.log('« ' + info.titre + ' » (' + info.id + ', ' + info.duree + ' s) prêt en ' + hms(prep) + ' ; maîtresse ' + o.taille + '², ' + o.fps + ' i/s');

    // ── les images à rendre : pour chaque format, la suite de ses temps (dans le film)
    const de = o.de != null ? o.de : 0, a = Math.min(info.duree, o.a != null ? o.a : info.duree), tranche = o.de != null || o.a != null;
    const echelle = o.brouillon ? 0.5 : 1;
    const sorties = [];
    for (const nom of o.formats) {
      const f = FORMATS[nom];
      let temps = [], fps = f.fps || o.fps, montage = null;
      if (f.montage) {
        montage = info.montages[f.montage];
        if (!montage) { console.warn(nom + ' : le film n\'a pas de montage « ' + f.montage + ' » ; pas de ' + nom); continue; }
        if (tranche) { console.warn(nom + ' : une tranche ne fait pas un aperçu de l\'App Store ; pas de ' + nom); continue; }
        if (o.brouillon) fps = o.fps;
        for (const [d0, d1] of montage) for (let i = Math.round(d0 * fps); i < Math.round(d1 * fps); i++) temps.push(i / fps);
        if (temps.length / fps > f.max + 1e-6) throw new Error(nom + ' : le montage dure ' + (temps.length / fps).toFixed(1) + ' s (> ' + f.max + ' s)');
      } else {
        for (let i = Math.round(de * fps); i < Math.round(a * fps); i++) temps.push(i / fps);
      }
      sorties.push({ nom, f, fps, temps, montage, l: Math.round(f.l * echelle / 2) * 2, h: Math.round(f.h * echelle / 2) * 2, i: 0 });
    }
    if (!sorties.length) throw new Error('rien à tourner');

    // ── le son : le film entier, et chaque montage (la musique d'un seul tenant, les bruits recalés)
    const sons = {};
    if (!o.sansSon) {
      const sortie = (info.sortie && info.sortie.noir) || 1.4;
      const ecrireWav = async (cle, duree, liste) => {
        const r = await rendreSon(page, { film: o.film, duree, sons: liste, entree: 1.2, sortie: sortie + 0.2 });
        if (r.erreur) { console.warn('le son : ' + r.erreur + ' ; des vidéos muettes'); return null; }
        const wav = path.join(o.out, o.film + (cle === 'film' ? '' : '.' + cle) + '.wav');
        fs.writeFileSync(wav, Buffer.from(r.b64, 'base64'));
        console.log('le son (' + cle + ') : thème « ' + (r.theme || 'aucun') + ' », ' + duree.toFixed(1) + ' s, crête ' + (20 * Math.log10(r.crete || 1e-6)).toFixed(1) + ' dBFS');
        return wav;
      };
      sons.film = await ecrireWav('film', info.duree, info.sons);
      for (const s of sorties) {
        if (!s.montage || sons[s.f.montage] !== undefined) continue;
        let off = 0; const liste = [];
        for (const [d0, d1] of s.montage) { for (const [t, n] of info.sons) if (t >= d0 && t < d1) liste.push([t - d0 + off, n]); off += d1 - d0; }
        sons[s.f.montage] = await ecrireWav(s.f.montage, off, liste);
      }
    }
    for (const s of sorties) {
      const wav = s.montage ? sons[s.f.montage] : sons.film;
      const son = wav ? { wav, de: s.montage ? 0 : de, duree: s.temps.length / s.fps } : null;
      s.fichier = path.join(o.out, o.film + '.' + s.nom + '.mp4');
      s.enc = ffmpegPour(s.fichier, s.f, s.fps, son);
    }

    // ── les images : chaque temps maîtresse une fois, découpé dans tous les formats qui le demandent
    const maitresse = [...new Set(sorties.flatMap((s) => s.temps.map((t) => Math.round(t * 1e6) / 1e6)))].sort((x, y) => x - y);
    const parPlan = {};
    const t0 = Date.now();
    for (let k = 0; k < maitresse.length; k++) {
      const t = maitresse[k];
      const demandes = sorties.filter((s) => s.i < s.temps.length && Math.abs(s.temps[s.i] - t) < 1e-5);
      const r = await page.evaluate(([t, dem]) => {
        // mesurer : l'image, et l'attente que la carte graphique (ici SwiftShader) l'ait finie
        const FC = window.FusibleCinema, inf = FC.tournage.mesurer(t);
        return { ms: inf.ms, plan: FC.tournage.film().indice(t), appels: inf.appels, triangles: inf.triangles, images: dem.map((d) => FC.tournage.composer(d[0], d[1], t, 0.95)) };
      }, [t, demandes.map((s) => [s.l, s.h])]);
      const pp = parPlan[r.plan] || (parPlan[r.plan] = { images: 0, ms: 0, appels: 0, triangles: 0 });
      pp.images++; pp.ms += r.ms; pp.appels = Math.max(pp.appels, r.appels); pp.triangles = Math.max(pp.triangles, r.triangles);
      for (let j = 0; j < demandes.length; j++) {
        await demandes[j].enc.ecrire(Buffer.from(r.images[j], 'base64'));
        demandes[j].i++;
      }
      if (erreurs.length) throw new Error('la page : ' + erreurs.join(' | '));
      if (k % 30 === 29 || k === maitresse.length - 1) {
        const ecoule = Date.now() - t0, reste = ecoule / (k + 1) * (maitresse.length - k - 1);
        console.log('  ' + (k + 1) + '/' + maitresse.length + ' images (t = ' + t.toFixed(2) + ' s) · ' + hms(ecoule) + ' · encore ~' + hms(reste));
      }
    }
    for (const s of sorties) await s.enc.fermer();
    const rendu = Date.now() - t0;

    // ── les affiches : l'image de `affiche`, sans sous-titre, avec le titre du film
    const titre = (info.textes || []).filter((x) => x.sorte === 'titre')[0];
    const tA = info.affiche;
    await page.evaluate((t) => window.FusibleCinema.tournage.rendre(t), tA);
    const affiches = [];
    for (const s of sorties) {
      const textes = titre ? [Object.assign({}, titre, { de: tA - 2, a: tA + 3, entree: 0.01, sortie: 0.01 })] : [];
      const b64 = await page.evaluate(([w, h, t, tx]) => window.FusibleCinema.tournage.composer(w, h, t, 0.92, { textes: tx }), [s.l, s.h, tA, textes]);
      const fa = path.join(o.out, o.film + '.' + s.nom + '.affiche.jpg');
      fs.writeFileSync(fa, Buffer.from(b64, 'base64'));
      affiches.push(fa);
    }

    // ── les planches contact (ffmpeg tile) : de quoi juger le film d'un coup d'œil
    const planches = [];
    for (const [nom, tuile, grille] of [['16x9', '384:-2', '5x6'], ['9x16', '180:-2', '10x3']]) {
      const s = sorties.find((x) => x.nom === nom);
      if (!s) continue;
      const n = grille.split('x').reduce((x, y) => x * y, 1), duree = s.temps.length / s.fps;
      const pl = path.join(o.out, o.film + '.planche.' + nom + '.jpg');
      const r = spawnSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-i', s.fichier, '-vf',
        'fps=' + n + '/' + duree.toFixed(3) + ',scale=' + tuile + ',tile=' + grille + ':padding=4:margin=4:color=0x111111', '-frames:v', '1', '-q:v', '3', pl]);
      if (r.status === 0) planches.push(pl);
    }

    // ── le rapport
    const tailles = {};
    for (const s of sorties) {
      const octets = fs.statSync(s.fichier).size, duree = s.temps.length / s.fps;
      tailles[s.nom] = { fichier: s.fichier, l: s.l, h: s.h, fps: s.fps, duree: +duree.toFixed(2), octets, mo: +(octets / 1048576).toFixed(2),
        mo_par_minute: +(octets / 1048576 / duree * 60).toFixed(2), kbit_s: Math.round(octets * 8 / duree / 1000) };
    }
    const plans = Object.keys(parPlan).sort((x, y) => x - y).map((i) => ({ plan: +i, images: parPlan[i].images, ms_image: Math.round(parPlan[i].ms / parPlan[i].images), appels: parPlan[i].appels, triangles: parPlan[i].triangles }));
    const rapport = { film: info.id, titre: info.titre, duree: info.duree, maitresse: o.taille, qualite: o.qualite, images: maitresse.length,
      textures: info.memoire ? { nombre: info.memoire.textures, mo: +(info.memoire.octets / 1048576).toFixed(1) } : null,
      preparation_s: +(prep / 1000).toFixed(1), rendu_s: +(rendu / 1000).toFixed(1), ms_par_image: Math.round(rendu / maitresse.length), plans, formats: tailles, affiches, planches,
      son: Object.fromEntries(Object.entries(sons).filter(([, v]) => v)) };
    fs.writeFileSync(path.join(o.out, o.film + '.rapport.json'), JSON.stringify(rapport, null, 2) + '\n');
    console.log('fini en ' + hms(Date.now() - debut) + ' (' + maitresse.length + ' images maîtresses, ' + Math.round(rendu / maitresse.length) + ' ms l\'image)');
    for (const [nom, t] of Object.entries(tailles)) console.log('  ' + nom.padEnd(9) + t.l + '×' + t.h + ' ' + t.duree + ' s · ' + t.mo + ' Mo (' + t.mo_par_minute + ' Mo/min, ' + t.kbit_s + ' kbit/s) → ' + t.fichier);
    for (const p of planches.concat(affiches)) console.log('  ' + p);
  } finally {
    await nav.close();
    srv.close();
  }
}

main().catch((e) => { console.error('tournage : ' + (e && e.stack ? e.stack : e)); process.exit(1); });
