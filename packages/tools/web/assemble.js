#!/usr/bin/env node
// Assemble l'aperçu web jouable (identité « album de vignettes ») :
//   node packages/tools/web/assemble.js --engine <engine.js> --out <fichier.html>
// Le gabarit (preview_template.html) contient trois placeholders remplacés
// littéralement (split/join, aucune interprétation regex) :
//   __CONTENT_JSON__  ← app/assets/content.json (bundle compilé par build_content)
//   __ENGINE_JS__     ← le moteur Dart compilé en JS (dart compile js preview.dart)
//   __PORTRAITS_JS__  ← packages/tools/web/portraits.js (bustes paper doll)
'use strict';
const fs = require('fs');
const path = require('path');

const SCRATCH = '/tmp/claude-0/-home-user-Forkfall/cd07074c-ad97-5e94-99ba-f10cfbe50abd/scratchpad';
const HERE = __dirname; // packages/tools/web
const ROOT = path.resolve(HERE, '..', '..', '..');

function parseArgs(argv) {
  const opts = { engine: path.join(SCRATCH, 'engine.js'), out: path.join(SCRATCH, 'fusible_preview.html') };
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

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const tplPath = path.join(HERE, 'preview_template.html');
  const portraitsPath = path.join(HERE, 'portraits.js');
  const contentPath = path.join(ROOT, 'app', 'assets', 'content.json');

  let tpl = fs.readFileSync(tplPath, 'utf8');
  const engine = fs.readFileSync(opts.engine, 'utf8');
  const portraits = fs.readFileSync(portraitsPath, 'utf8');
  let content = fs.readFileSync(contentPath, 'utf8');
  JSON.parse(content); // le bundle doit être un JSON valide avant d'être incrusté

  const PLACEHOLDERS = ['__CONTENT_JSON__', '__ENGINE_JS__', '__PORTRAITS_JS__'];
  for (const p of PLACEHOLDERS) {
    if (tpl.indexOf(p) < 0) throw new Error('placeholder absent du gabarit : ' + p);
  }

  // Jamais de fermeture prématurée du <script> par le JSON ou les scripts.
  content = content.split('</').join('<\\/');
  const safeEngine = engine.split('</script').join('<\\/script');
  const safePortraits = portraits.split('</script').join('<\\/script');

  tpl = tpl.split('__CONTENT_JSON__').join(content);
  tpl = tpl.split('__ENGINE_JS__').join(safeEngine);
  tpl = tpl.split('__PORTRAITS_JS__').join(safePortraits);

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
