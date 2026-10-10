#!/usr/bin/env node
// Assemble l'aperçu web jouable (la grammaire de *Reigns*, matériaux du
// football) :
//   node packages/tools/web/assemble.js --engine <engine.js> --out <fichier.html>
// Le gabarit (preview_template.html) contient cinq placeholders remplacés
// littéralement (split/join, aucune interprétation regex) :
//   __CONTENT_JSON__  ← app/assets/content.json (bundle compilé par build_content)
//   __ENGINE_JS__     ← le moteur Dart compilé en JS (dart compile js preview.dart)
//   __ART_JS__        ← packages/tools/web/art.js (le SEUL moteur
//                       d'illustration : SVG plat, géométrique, sans contour.
//                       Il a remplacé la piste « album de vignettes », dont
//                       le code dort sous docs/design/archive/ et n'est plus
//                       assemblé — ne pas le rebrancher.)
//   __AUDIO_JS__      ← packages/tools/web/audio.js (l'univers sonore, tout
//                       synthétisé : aucun fichier audio, aucune URL)
//   __FONTS_CSS__     ← le <link> Google Fonts de Space Mono (la seule
//                       ressource externe de tout le fichier)
//   __VILLE_CSS__, __VILLE_JS__ ← vides, sauf avec --ville <dossier> : la
//                       version jouable (la ville d'Aubérive en pixel art,
//                       ville.css + ville.js). Le dossier donné porte les
//                       images de la ville (tuiles, profondeur, grille, lieux,
//                       sprites : scratchpad iso/ville_assets.js + ville_post.js,
//                       docs/design/pixel_iso) ; il est copié sous `ville/`
//                       à côté de la page.
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
  const opts = { engine: path.join(BUILD_DIR, 'engine.js'), out: path.join(BUILD_DIR, 'fusible_preview.html'), ville: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--engine') opts.engine = argv[++i];
    else if (a === '--out') opts.out = argv[++i];
    else if (a === '--ville') opts.ville = argv[++i];
    else if (a === '--content') opts.content = argv[++i];   // un autre bundle (les essais)
    else if (a.startsWith('--engine=')) opts.engine = a.slice(9);
    else if (a.startsWith('--out=')) opts.out = a.slice(6);
    else if (a === '-h' || a === '--help') {
      console.log('usage: node assemble.js [--engine engine.js] [--out fusible_preview.html] [--ville dossier_des_images]');
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

/// LA POLICE — Space Mono (400/700, romain et italique), par <link> Google
/// Fonts. C'est la SEULE ressource externe de tout le fichier assemblé ; la
/// pile de repli du gabarit (DejaVu Sans Mono, ui-monospace, Menlo, Consolas,
/// monospace) tient le jeu debout hors ligne.
///
/// Trois monospaces ont été comparées côte à côte sur le fond brun réel, à la
/// taille réelle : Space Mono l'emporte sur les chiffres (le 4 ouvert, le 7
/// sans barre mais à talon, le 9 droit — un tableau d'affichage), sur la
/// présence de ses capitales, et sur un italique qui est un vrai dessin et
/// reste lisible à 15,5 px. IBM Plex Mono était plus sage, JetBrains Mono trop
/// technique.
function fontsCss() {
  return [
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?' +
      'family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap">',
  ].join('\n');
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const tplPath = path.join(HERE, 'preview_template.html');
  const artPath = path.join(HERE, 'art.js');
  const audioPath = path.join(HERE, 'audio.js');
  const contentPath = opts.content ? path.resolve(opts.content) : path.join(ROOT, 'app', 'assets', 'content.json');

  let tpl = fs.readFileSync(tplPath, 'utf8');
  const engine = fs.readFileSync(opts.engine, 'utf8');
  const art = fs.readFileSync(artPath, 'utf8');
  const audio = fs.readFileSync(audioPath, 'utf8');
  let content = fs.readFileSync(contentPath, 'utf8');
  JSON.parse(content); // le bundle doit être un JSON valide avant d'être incrusté

  const PLACEHOLDERS = ['__CONTENT_JSON__', '__ENGINE_JS__', '__ART_JS__', '__AUDIO_JS__', '__FONTS_CSS__', '__VILLE_CSS__', '__VILLE_JS__'];
  for (const p of PLACEHOLDERS) {
    if (tpl.indexOf(p) < 0) throw new Error('placeholder absent du gabarit : ' + p);
  }

  // Jamais de fermeture prématurée du <script> par le JSON ou les scripts.
  content = content.split('</').join('<\\/');
  const safeEngine = engine.split('</script').join('<\\/script');
  const safeArt = art.split('</script').join('<\\/script');
  const safeAudio = audio.split('</script').join('<\\/script');

  tpl = tpl.split('__CONTENT_JSON__').join(content);
  tpl = tpl.split('__ENGINE_JS__').join(safeEngine);
  tpl = tpl.split('__ART_JS__').join(safeArt);
  tpl = tpl.split('__AUDIO_JS__').join(safeAudio);
  tpl = tpl.split('__FONTS_CSS__').join(fontsCss());
  // LA VILLE : la feuille et la couche, ou rien.
  let villeCss = '', villeJs = '';
  if (opts.ville) {
    villeCss = '<style>\n' + fs.readFileSync(path.join(HERE, 'ville.css'), 'utf8') + '\n</style>';
    villeJs = fs.readFileSync(path.join(HERE, 'ville.js'), 'utf8').split('</script').join('<\\/script');
  }
  // la version jouable porte son nom dans l'onglet
  if (opts.ville) tpl = tpl.replace('<title>Fusible</title>', '<title>Fusible à Aubérive</title>');
  tpl = tpl.split('__VILLE_CSS__').join(villeCss);
  tpl = tpl.split('__VILLE_JS__').join(villeJs);

  const left = PLACEHOLDERS.filter((p) => tpl.indexOf(p) >= 0);
  if (left.length) throw new Error('placeholder(s) toujours présent(s) après assemblage : ' + left.join(', '));

  fs.mkdirSync(path.dirname(opts.out), { recursive: true });
  fs.writeFileSync(opts.out, tpl);
  console.log('assemblé : ' + opts.out + ' (' + tpl.length + ' octets)');
  if (opts.ville) {
    // les images de la ville, à côté de la page (chemins relatifs : ville/…)
    const dest = path.join(path.dirname(opts.out), 'ville');
    fs.mkdirSync(dest, { recursive: true });
    let n = 0, octets = 0;
    for (const f of fs.readdirSync(opts.ville).sort()) {
      if (!/\.(webp|png|json)$/.test(f)) continue;
      fs.copyFileSync(path.join(opts.ville, f), path.join(dest, f));
      n++; octets += fs.statSync(path.join(dest, f)).size;
    }
    if (!n) throw new Error('--ville : aucune image dans ' + opts.ville);
    console.log('la ville : ' + n + ' fichiers (' + Math.round(octets / 1024) + ' Ko) → ' + dest);
  }
}

try {
  main();
} catch (e) {
  console.error('assemble.js : ' + (e && e.message ? e.message : e));
  process.exit(1);
}
