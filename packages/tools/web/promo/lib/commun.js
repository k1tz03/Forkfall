/* ═══════════════════════════════════════════════════════════════════════════
   LA PROMO — ce que tous les outils partagent : les chemins, les options, le
   serveur local, Chromium, ffmpeg et ffprobe, la palette du jeu et ses polices.
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');

const PROMO = path.resolve(__dirname, '..');                 // packages/tools/web/promo
const WEB = path.resolve(PROMO, '..');                        // packages/tools/web
const DEPOT = path.resolve(WEB, '..', '..', '..');
const NODE_PATH = process.env.NODE_PATH || '/opt/node22/lib/node_modules';
const CHROMIUM = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;

// ─── la palette du jeu (preview_template.html) : le brun, la crème, l'unique accent
const PALETTE = {
  fond: '#1B1109', fond2: '#241608', fond3: '#2E1D0C', creme: '#F2E8CE', creme2: '#C4B491', creme3: '#B0A07C',
  trait: '#8B7A57', framboise: '#E0164B', vert: '#4E9448', encre: '#0B0814', ombre: '#06040B', or: '#FFC94D',
  prune: '#120E1C', prune2: '#1C1630', ligne: '#352B52', texteAcc: '#F6E9CF',
};

// ─── les formats de livraison (docs/design/cinematiques.md § 10, et le brief de la promo)
// marges : là où l'on n'écrit pas (l'interface des réseaux), en fraction de la hauteur / largeur
const FORMATS = {
  '9x16': { l: 1080, h: 1920, crf: 23, maxrate: '1750k', bufsize: '3500k', niveau: '4.1', aac: '192k', profil: 'social',
    marges: { haut: 0.10, bas: 0.20, gauche: 0.07, droite: 0.13 } },
  '16x9': { l: 1920, h: 1080, crf: 23, maxrate: '1750k', bufsize: '3500k', niveau: '4.1', aac: '192k', profil: 'social',
    marges: { haut: 0.07, bas: 0.08, gauche: 0.06, droite: 0.06 } },
  '4x5': { l: 1080, h: 1350, crf: 23, maxrate: '1400k', bufsize: '2800k', niveau: '4.1', aac: '192k', profil: 'social',
    marges: { haut: 0.07, bas: 0.09, gauche: 0.07, droite: 0.07 } },
  appstore: { l: 886, h: 1920, crf: 20, maxrate: '9000k', bufsize: '18000k', niveau: '4.0', aac: '256k', profil: 'appstore',
    marges: { haut: 0.08, bas: 0.10, gauche: 0.06, droite: 0.06 }, max: 30, min: 15 },
};

// ─── les profils de capture : la fenêtre du téléphone, en points CSS et en pixels
const PROFILS = {
  social: { largeur: 393, hauteur: 699, dsf: 1080 / 393, l: 1080, h: 1920 },      // 1080 × 1920 (9:16)
  appstore: { largeur: 393, hauteur: 852, dsf: 886 / 393, l: 886, h: 1920 },       // 886 × 1920 (l'iPhone 6,9")
  apple: { largeur: 430, hauteur: 932, dsf: 3, l: 1290, h: 2796 },                 // la capture d'écran Apple 6,9"
  google: { largeur: 393, hauteur: 699, dsf: 1080 / 393, l: 1080, h: 1920 },      // la capture d'écran Google Play
};

// ─── les options de la ligne de commande : --cle valeur, --drapeau, et le reste
function lireOptions(argv) {
  const o = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const cle = a.slice(2), suivant = argv[i + 1];
      if (suivant != null && !suivant.startsWith('--')) { o[cle] = suivant; i++; } else o[cle] = true;
    } else o._.push(a);
  }
  return o;
}

// ─── les dossiers : `--sp` (le dossier de travail partagé, FUSIBLE_SP) et `--sortie`
function dossiers(o) {
  const sp = path.resolve(o.sp || process.env.FUSIBLE_SP || path.join(os.tmpdir(), 'fusible'));
  const sortie = path.resolve(o.sortie || path.join(sp, 'agents', 'lot-promo'));
  return { sp, sortie, travail: path.join(sortie, 'travail'), livrables: path.join(sortie, 'livrables'), site: path.resolve(o.site || path.join(sortie, 'site')) };
}
// `${SP}`, `${SORTIE}`, `${WEB}` (packages/tools/web), `${TRAVAIL}` (le travail de la bande),
// `{format}` dans un chemin de la configuration ; un chemin relatif part du dossier de la configuration
function chemin(modele, d, format, cfg) {
  let s = String(modele).replace(/\$\{SP\}/g, d.sp).replace(/\$\{SORTIE\}/g, d.sortie).replace(/\$\{WEB\}/g, WEB)
    .replace(/\$\{TRAVAIL\}/g, cfg ? path.join(d.travail, cfg.id) : d.travail).replace(/\{format\}/g, format || '');
  if (!path.isAbsolute(s) && cfg && cfg.__fichier) s = path.resolve(path.dirname(cfg.__fichier), s);
  return s;
}
function assurer(dossier) { fs.mkdirSync(dossier, { recursive: true }); return dossier; }
function empreinte(x) { return crypto.createHash('sha1').update(typeof x === 'string' ? x : JSON.stringify(x)).digest('hex').slice(0, 12); }
function journal(...a) { console.log(...a); }
function hms(s) { s = Math.round(s); return Math.floor(s / 60) + ' min ' + String(s % 60).padStart(2, '0') + ' s'; }
function slug(t) {
  return String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40);
}

// ─── la configuration d'une bande : un module (commentaires permis), relu à chaque appel
function lireConfig(fichier) {
  const f = path.resolve(fichier);
  if (!fs.existsSync(f)) throw new Error('pas de configuration ' + f);
  delete require.cache[require.resolve(f)];
  const c = require(f);
  c.__fichier = f;
  return c;
}

// ─── la couleur et l'heure de chaque livre : la table HISTOIRES du gabarit de l'aperçu
function histoires() {
  const src = fs.readFileSync(path.join(WEB, 'preview_template.html'), 'utf8');
  const m = src.match(/var HISTOIRES = \{([\s\S]*?)\n\s*\};/);
  const out = {};
  if (!m) return out;
  for (const l of m[1].split('\n')) {
    const x = l.match(/^\s*([a-z_]+):\s*\{\s*c:\s*"([^"]+)"(?:,\s*h:\s*"([^"]*)")?/);
    if (x) out[x[1]] = { c: x[2], h: x[3] || '' };
  }
  return out;
}

// ─── les polices du jeu (OFL), en data: pour les pages qu'on compose
function policesCss() {
  const dir = path.join(WEB, 'cinema', 'polices');
  const f = (fam, fichier, poids, style) => {
    const b64 = fs.readFileSync(path.join(dir, fichier)).toString('base64');
    return '@font-face{font-family:"' + fam + '";font-weight:' + poids + ';font-style:' + (style || 'normal') + ';font-display:block;src:url(data:font/woff2;base64,' + b64 + ') format("woff2")}';
  };
  return f('Jersey 15', 'jersey-15-latin-400-normal.woff2', 400) + f('Space Mono', 'space-mono-latin-400-normal.woff2', 400) +
    f('Space Mono', 'space-mono-latin-700-normal.woff2', 700) + f('Space Mono', 'space-mono-latin-400-italic.woff2', 400, 'italic');
}

// ─── un serveur local pour le site assemblé (la ville se sert en HTTP, pas en file://)
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.webp': 'image/webp',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.gz': 'application/gzip', '.webmanifest': 'application/manifest+json', '.css': 'text/css', '.svg': 'image/svg+xml' };
function serveur(racine, port) {
  const srv = http.createServer((q, r) => {
    let u = decodeURIComponent(q.url.split('?')[0]);
    if (u.endsWith('/')) u += 'index.html';
    const f = path.join(racine, path.normalize(u).replace(/^(\.\.[/\\])+/, ''));
    if (!f.startsWith(racine) || !fs.existsSync(f) || !fs.statSync(f).isFile()) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream', 'cache-control': 'no-store' });
    fs.createReadStream(f).pipe(r);
  });
  return new Promise((ok, ko) => { srv.once('error', ko); srv.listen(port || 0, '127.0.0.1', () => ok(srv)); });
}

// ─── Chromium (Playwright)
function playwright() {
  try { return require('playwright'); } catch (e) { return require(path.join(NODE_PATH, 'playwright')); }
}
async function navigateur(args) {
  const { chromium } = playwright();
  return chromium.launch({ executablePath: CHROMIUM, args: ['--autoplay-policy=no-user-gesture-required', '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'].concat(args || []) });
}

// ─── ffmpeg, ffprobe
function ffmpeg(args, quoi) {
  const r = spawnSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error'].concat(args), { maxBuffer: 1 << 26 });
  if (r.status !== 0) throw new Error('ffmpeg (' + (quoi || '') + ') : ' + String(r.stderr || '').slice(-2000));
  return String(r.stderr || '');
}
// ffmpeg qui lit des images sur son entrée (les captures, les cartons) et écrit un fichier
function ffmpegFlux(args, quoi) {
  const p = spawn('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error'].concat(args), { stdio: ['pipe', 'inherit', 'pipe'] });
  let err = '';
  p.stderr.on('data', (d) => { err += d; });
  const fini = new Promise((ok, ko) => p.on('close', (c) => (c === 0 ? ok() : ko(new Error('ffmpeg (' + (quoi || '') + ') : code ' + c + ' ' + err.slice(-1500))))));
  return {
    ecrire: (b) => new Promise((ok) => { if (p.stdin.write(b)) ok(); else p.stdin.once('drain', ok); }),
    fermer: () => { p.stdin.end(); return fini; },
  };
}
function ffprobe(fichier) {
  const r = spawnSync('ffprobe', ['-v', 'error', '-show_format', '-show_streams', '-of', 'json', fichier], { maxBuffer: 1 << 24 });
  if (r.status !== 0) throw new Error('ffprobe ' + fichier + ' : ' + r.stderr);
  return JSON.parse(String(r.stdout));
}
function duree(fichier) { return +ffprobe(fichier).format.duration; }

// le mezzanine : ce que les étapes intermédiaires écrivent (presque sans perte, 4:4:4)
const MEZZANINE = ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '12', '-pix_fmt', 'yuv444p', '-profile:v', 'high444'];

module.exports = {
  PROMO, WEB, DEPOT, NODE_PATH, CHROMIUM, PALETTE, FORMATS, PROFILS, MEZZANINE,
  lireOptions, dossiers, chemin, assurer, empreinte, journal, hms, slug, lireConfig, histoires, policesCss,
  serveur, playwright, navigateur, ffmpeg, ffmpegFlux, ffprobe, duree,
};
