#!/usr/bin/env node
// Assemble l'aperçu web jouable (identité « album de vignettes ») :
//   node packages/tools/web/assemble.js --engine <engine.js> --out <fichier.html>
// Le gabarit (preview_template.html) contient cinq placeholders remplacés
// littéralement (split/join, aucune interprétation regex) :
//   __CONTENT_JSON__  ← app/assets/content.json (bundle compilé par build_content)
//   __ENGINE_JS__     ← le moteur Dart compilé en JS (dart compile js preview.dart)
//   __PORTRAITS_JS__  ← packages/tools/web/portraits.js (bustes paper doll)
//   __AUDIO_JS__      ← packages/tools/web/audio.js (l'univers sonore, tout
//                       synthétisé : aucun fichier audio, aucune URL)
//   __FONTS_CSS__     ← app/assets/fonts/*.ttf en @font-face data: (hors ligne)
'use strict';
const fs = require('fs');
const path = require('path');

const HERE = __dirname; // packages/tools/web
const ROOT = path.resolve(HERE, '..', '..', '..');
// Répertoire de travail par défaut : `build/web/` à la racine du dépôt, ou
// FUSIBLE_BUILD_DIR s'il est posé. Les options --engine / --out restent
// prioritaires. Aucun chemin absolu propre à une machine n'est écrit ici.
const BUILD_DIR = process.env.FUSIBLE_BUILD_DIR || path.join(ROOT, 'build', 'web');

function parseArgs(argv) {
  const opts = { engine: path.join(BUILD_DIR, 'engine.js'), out: path.join(BUILD_DIR, 'fusible_preview.html') };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--engine') opts.engine = argv[++i];
    else if (a === '--out') opts.out = argv[++i];
    else if (a.startsWith('--engine=')) opts.engine = a.slice(9);
    else if (a.startsWith('--out=')) opts.out = a.slice(6);
    else if (a === '-h' || a === '--help') {
      console.log('usage: node assemble.js [--engine engine.js] [--out fusible_preview.html]');
      process.exit(0);
    } else {
      console.error('argument inconnu : ' + a);
      process.exit(2);
    }
  }
  if (!opts.engine || !opts.out) {
    console.error('--engine et --out attendent une valeur');
    process.exit(2);
  }
  return opts;
}

/// Les @font-face de l'identité album, fichiers incrustés en data: URI.
/// Mêmes .ttf que l'app Flutter (`app/assets/fonts`), mêmes noms de famille
/// que les variables CSS du gabarit. Sans eux, l'aperçu retombe sur les
/// <link> de la CDN : il reste jouable, mais il lui faut le réseau.
function fontsCss(dir) {
  const CDN = [
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800' +
      '&family=Manrope:wght@500;600;700;800' +
      '&family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,500&display=swap">',
  ].join('\n');
  let files;
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith('.ttf')).sort();
  } catch (e) {
    return CDN;
  }
  if (!files.length) return CDN;
  const FAMILY = { BarlowCondensed: 'Barlow Condensed', Manrope: 'Manrope', Fraunces: 'Fraunces' };
  const faces = [];
  for (const f of files) {
    const m = /^([A-Za-z]+)-(\d{3})(Italic)?\.ttf$/.exec(f);
    if (!m) continue;
    const family = FAMILY[m[1]];
    if (!family) continue;
    const b64 = fs.readFileSync(path.join(dir, f)).toString('base64');
    faces.push(
      '@font-face{font-family:"' + family + '";font-style:' + (m[3] ? 'italic' : 'normal') +
        ';font-weight:' + m[2] + ';font-display:swap;src:url(data:font/ttf;base64,' + b64 + ') format("truetype")}'
    );
  }
  if (!faces.length) return CDN;
  return '<style>\n' + faces.join('\n') + '\n</style>';
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const tplPath = path.join(HERE, 'preview_template.html');
  const portraitsPath = path.join(HERE, 'portraits.js');
  const audioPath = path.join(HERE, 'audio.js');
  const contentPath = path.join(ROOT, 'app', 'assets', 'content.json');

  let tpl = fs.readFileSync(tplPath, 'utf8');
  const engine = fs.readFileSync(opts.engine, 'utf8');
  const portraits = fs.readFileSync(portraitsPath, 'utf8');
  const audio = fs.readFileSync(audioPath, 'utf8');
  let content = fs.readFileSync(contentPath, 'utf8');
  JSON.parse(content); // le bundle doit être un JSON valide avant d'être incrusté

  const PLACEHOLDERS = ['__CONTENT_JSON__', '__ENGINE_JS__', '__PORTRAITS_JS__', '__AUDIO_JS__', '__FONTS_CSS__'];
  for (const p of PLACEHOLDERS) {
    if (tpl.indexOf(p) < 0) throw new Error('placeholder absent du gabarit : ' + p);
  }

  // Jamais de fermeture prématurée du <script> par le JSON ou les scripts.
  content = content.split('</').join('<\\/');
  const safeEngine = engine.split('</script').join('<\\/script');
  const safePortraits = portraits.split('</script').join('<\\/script');
  const safeAudio = audio.split('</script').join('<\\/script');

  tpl = tpl.split('__CONTENT_JSON__').join(content);
  tpl = tpl.split('__ENGINE_JS__').join(safeEngine);
  tpl = tpl.split('__PORTRAITS_JS__').join(safePortraits);
  tpl = tpl.split('__AUDIO_JS__').join(safeAudio);
  tpl = tpl.split('__FONTS_CSS__').join(fontsCss(path.join(ROOT, 'app', 'assets', 'fonts')));

  const left = PLACEHOLDERS.filter((p) => tpl.indexOf(p) >= 0);
  if (left.length) throw new Error('placeholder(s) toujours présent(s) après assemblage : ' + left.join(', '));

  fs.mkdirSync(path.dirname(opts.out), { recursive: true });
  fs.writeFileSync(opts.out, tpl);
  console.log('assemblé : ' + opts.out + ' (' + tpl.length + ' octets)');
}

try {
  main();
} catch (e) {
  console.error('assemble.js : ' + (e && e.message ? e.message : e));
  process.exit(1);
}
