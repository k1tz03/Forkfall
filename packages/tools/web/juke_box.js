#!/usr/bin/env node
// LE JUKE-BOX — une page qui joue toute la bande originale en direct, avec le
// vrai moteur (audio.js et musique/*.js, embarqués dans la page) : la liste des
// thèmes (titre, moment, tempo, tonalité, humeur, durée de la boucle), le
// lecteur (la section et la mesure qui jouent, le spectre, le niveau à côté de
// la cible du banc), le saut d'une section à l'autre, l'écoute de la couture, le
// fondu enchaîné du jeu d'un thème à l'autre. Aucun réseau, aucun fichier à
// côté : seulement les polices de Google (Space Mono, Jersey 15), et une pile de
// repli si elles ne viennent pas.
//
//   node packages/tools/web/juke_box.js --out <dossier> [--avec brouillon.js …]
//
// Écrit deux pages, la même musique :
//   <dossier>/index.html     la page entière (à ouvrir, à servir, à tester)
//   <dossier>/artefact.html  la même sans l'enveloppe du document (ni doctype, ni
//                            <html>, <head>, <body>) : ce que l'outil Artifact
//                            publie tel quel — il pose lui-même l'enveloppe
// `--avec` ajoute un thème hors de musique/ (un brouillon qu'on veut écouter).
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ICI = __dirname;
const MUSIQUE = require(path.join(ICI, 'musique_sources.js'));

function args() {
  const a = process.argv.slice(2), o = { out: null, avec: [] };
  for (let i = 0; i < a.length; i++) {
    if (a[i] === '--out') o.out = a[++i];
    else if (a[i] === '--avec') o.avec.push(path.resolve(a[++i]));
    else if (a[i] === '-h' || a[i] === '--help') { console.log('usage : node juke_box.js --out <dossier> [--avec brouillon.js …]'); process.exit(0); }
    else { console.error('juke_box : argument inconnu ' + a[i]); process.exit(2); }
  }
  if (!o.out) { console.error('juke_box : --out <dossier> attendu'); process.exit(2); }
  return o;
}

function polices() {
  const href = 'https://fonts.googleapis.com/css2?family=Jersey+15&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap';
  return [
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link rel="stylesheet" href="' + href + '">'
  ].join('\n');
}

function main() {
  const o = args();
  // une faute de syntaxe, dans musique/ ou dans un brouillon, arrête l'assemblage ici (le fichier, la ligne)
  let musique = MUSIQUE.texte();
  for (const f of o.avec) musique += MUSIQUE.enveloppe(f);
  let version = '';
  try { version = execFileSync('git', ['-C', ICI, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim(); } catch (e) { /* hors dépôt */ }
  const themes = MUSIQUE.fichiers().map((f) => f.nom.replace(/\.js$/, '')).concat(o.avec.map((f) => path.basename(f, '.js')));
  const build = 'Assemblé le ' + new Date().toISOString().slice(0, 10) + (version ? ' (version ' + version + ')' : '') +
    ' · thèmes : ' + themes.join(', ') + '.';
  const gabarit = fs.readFileSync(path.join(ICI, 'juke_box_template.html'), 'utf8');
  for (const p of ['__FONTS__', '__AUDIO__', '__BUILD__']) {
    if (gabarit.split(p).length !== 2) throw new Error('juke_box_template.html : le repère ' + p + ' doit apparaître une fois');
  }
  // split/join : rien n'est interprété dans ce qu'on insère
  const page = gabarit
    .split('__FONTS__').join(polices())
    .split('__BUILD__').join(build.replace(/'/g, '’'))
    .split('__AUDIO__').join(musique.split('</script').join('<\\/script'));
  fs.mkdirSync(o.out, { recursive: true });
  const entiere = '<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n</head>\n<body>\n' + page + '\n</body>\n</html>\n';
  fs.writeFileSync(path.join(o.out, 'index.html'), entiere);
  fs.writeFileSync(path.join(o.out, 'artefact.html'), page);
  console.log('juke-box : ' + themes.length + ' thèmes (' + themes.join(', ') + ') → ' + path.join(o.out, 'index.html') +
    ' (' + Math.round(Buffer.byteLength(entiere) / 1024) + ' Ko) et artefact.html');
}

try { main(); } catch (e) { console.error('juke_box : ' + (e && e.message ? e.message : e)); process.exit(1); }
