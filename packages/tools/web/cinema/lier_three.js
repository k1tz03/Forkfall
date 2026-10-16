#!/usr/bin/env node
// LIER THREE — refait packages/tools/web/vendor/three/fusible-three.js, le seul
// fichier de three.js que le jeu charge : un script classique (pas un module ES)
// qui pose `window.FusibleTHREE` (tout three.js, plus les passes de
// post-traitement de la trousse). Un script classique se charge partout de la
// même façon : par <script src> dans la version jouable, par son texte dans le
// fichier seul (où un module ES devrait passer par une URL blob, qu'un
// hébergement en bac à sable peut refuser).
//
// Les sources sont à côté, telles que publiées (three@0.186.1, licence MIT) :
// build/three.core.js et build/three.module.js, et les modules d'exemple de
// examples/jsm/ dans addons/. On ne les modifie jamais : on les relie.
//
//   npm install --no-save esbuild@0.28.2      (dans un dossier de travail)
//   NODE_PATH=<ce dossier>/node_modules node packages/tools/web/cinema/lier_three.js
//
// Pour ajouter une passe (un module de examples/jsm) : la copier dans addons/
// avec ce qu'elle importe, l'ajouter à ADDONS, relancer ce script, commiter les
// deux. Le fichier produit est déterministe (même esbuild, mêmes sources).
'use strict';
const fs = require('fs');
const path = require('path');

const ICI = path.resolve(__dirname, '..', 'vendor', 'three');
const SORTIE = path.join(ICI, 'fusible-three.js');

// [nom exporté, fichier sous addons/]
const ADDONS = [
  ['EffectComposer', 'postprocessing/EffectComposer.js'],
  ['Pass', 'postprocessing/Pass.js'],
  ['FullScreenQuad', 'postprocessing/Pass.js'],
  ['RenderPass', 'postprocessing/RenderPass.js'],
  ['ShaderPass', 'postprocessing/ShaderPass.js'],
  ['UnrealBloomPass', 'postprocessing/UnrealBloomPass.js'],
  ['OutputPass', 'postprocessing/OutputPass.js'],
  ['BokehPass', 'postprocessing/BokehPass.js'],
  ['CopyShader', 'shaders/CopyShader.js'],
];

async function main() {
  let esbuild;
  try { esbuild = require('esbuild'); } catch (e) {
    console.error('lier_three : esbuild introuvable (npm install --no-save esbuild@0.28.2, puis NODE_PATH=…/node_modules)');
    process.exit(2);
  }
  const version = (/REVISION = '(\d+)'/.exec(fs.readFileSync(path.join(ICI, 'three.core.js'), 'utf8')) || [])[1];
  const entree = [
    "export * from './three.module.js';",
    ...ADDONS.map(([n, f]) => `export { ${n} } from './addons/${f}';`),
  ].join('\n');
  const r = await esbuild.build({
    stdin: { contents: entree, resolveDir: ICI, sourcefile: 'fusible-three-entree.js', loader: 'js' },
    bundle: true,
    format: 'iife',
    globalName: 'FusibleTHREE',
    minify: true,
    target: ['es2018'],
    legalComments: 'none',
    alias: { three: path.join(ICI, 'three.module.js') },
    write: false,
    logLevel: 'error',
  });
  const corps = r.outputFiles[0].text;
  const tete = '/* fusible-three.js — three.js r' + version + ' (MIT, voir LICENSE à côté) et ses passes de post-traitement,\n' +
    ' * reliés par packages/tools/web/cinema/lier_three.js (esbuild ' + esbuild.version + ') en un script classique : window.FusibleTHREE.\n' +
    ' * Ne pas modifier à la main : relancer le script. */\n';
  fs.writeFileSync(SORTIE, tete + corps);
  console.log('lier_three : ' + path.relative(process.cwd(), SORTIE) + ' (' + Math.round((tete + corps).length / 1024) + ' Ko, three r' + version + ')');
}

main().catch((e) => { console.error('lier_three : ' + (e && e.message ? e.message : e)); process.exit(1); });
