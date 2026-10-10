#!/usr/bin/env node
// L'ACCUEIL — les images de l'écran d'accueil, découpées dans la vraie ville.
//
// Chaque histoire a sa vignette : le lieu d'Aubérive où elle se noue, à
// l'heure qui lui ressemble (le stade la nuit pour les trois mille masques,
// la gare routière au crépuscule pour le car du Sapin en carton, la friche
// au coucher pour la sirène…), légèrement teintée de la couleur de l'histoire.
// Le haut de l'accueil est le panorama de la ville, au crépuscule et de nuit.
//
// Entrée : les rendus complets de la ville (ville_assets.js → out/ville/
// day.png, dusk.png, night.png, 4040 × 2260). Sortie : des WebP dans
// packages/tools/web/accueil/, que assemble.js embarque dans la page.
// ImageMagick (`convert`) fait le travail.
//
//   node docs/design/pixel_iso/accueil.js [--rendus out/ville] [--out packages/tools/web/accueil]

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ICI = __dirname;
const RACINE = path.resolve(ICI, '..', '..', '..');

function args() {
  const a = process.argv.slice(2), o = {};
  for (let i = 0; i < a.length; i++) {
    if (a[i] === '--rendus') o.rendus = a[++i];
    else if (a[i] === '--out') o.out = a[++i];
  }
  return o;
}

// Une vignette par postulat : le centre du cadrage (en pixels du rendu, les
// `u, v` de lieux.json), sa largeur (16:9), l'heure, et le grain de couleur.
// `teinte` : une couleur posée à quelques pour cent ; `sat` : la saturation.
const VIGNETTES = {
  promu:          { lieu: 'stade',      heure: 'night', u: 1746, v: 1150, w: 760, teinte: '#ff3b3b', pc: 9,  sat: 112 },
  interimaire:    { lieu: 'gareRoutiere', heure: 'dusk', u: 2040, v: 1890, w: 660, teinte: '#4d7fbf', pc: 22, sat: 78 },
  pepite:         { lieu: 'friche',     heure: 'dusk',  u: 930,  v: 1080, w: 760, teinte: '#ff8a2a', pc: 8,  sat: 118 },
  fin_de_contrat: { lieu: 'tabac',      heure: 'night', u: 3300, v: 1250, w: 760, teinte: '#ffd84d', pc: 6,  sat: 110 },
  geant_dechu:    { lieu: 'mairie',     heure: 'dusk',  u: 2860, v: 760,  w: 760, teinte: '#7ed37e', pc: 7,  sat: 104 },
  vendre_trente:  { lieu: 'clubhouse',  heure: 'night', u: 2000, v: 1290, w: 640, teinte: '#9a7bff', pc: 16, sat: 106 },
  le_modele:      { lieu: 'centre',     heure: 'day',   u: 2560, v: 1440, w: 760, teinte: '#3fd6ff', pc: 18, sat: 92 },
  // les livres encore en chantier : prêts pour le jour où ils arrivent
  apres_fiasco:   { lieu: 'hotel',      heure: 'night', u: 1830, v: 520,  w: 640, teinte: '#ff6fa8', pc: 10, sat: 104 },
  mondial_hiver:  { lieu: 'terrain',    heure: 'day',   u: 2850, v: 1450, w: 700, teinte: '#dff2ff', pc: 26, sat: 70 },
  escalier_ferme: { lieu: 'agence',     heure: 'dusk',  u: 640,  v: 1250, w: 560, teinte: '#ffb547', pc: 8,  sat: 108 },
};

// Le panorama du haut : le cœur de la ville (le stade, le canal, la vieille
// ville, le cimetière, la cheminée de l'usine), au crépuscule et de nuit.
const PANORAMA = { x: 640, y: 260, w: 2600, h: 1080, sortie: 1950 };

function convert(argv) {
  execFileSync('convert', argv, { stdio: ['ignore', 'ignore', 'inherit'] });
}

function main() {
  const o = args();
  const rendus = path.resolve(o.rendus || path.join(ICI, 'out', 'ville'));
  const out = path.resolve(o.out || path.join(RACINE, 'packages', 'tools', 'web', 'accueil'));
  fs.mkdirSync(out, { recursive: true });
  for (const h of ['day', 'dusk', 'night']) {
    if (!fs.existsSync(path.join(rendus, h + '.png'))) {
      throw new Error(`rendu absent : ${path.join(rendus, h + '.png')} — lance d'abord ville_assets.js`);
    }
  }
  for (const [id, c] of Object.entries(VIGNETTES)) {
    const h = Math.round(c.w * 9 / 16);
    const x = Math.round(c.u - c.w / 2), y = Math.round(c.v - h / 2);
    const dest = path.join(out, `couv_${id}.webp`);
    convert([
      path.join(rendus, c.heure + '.png'),
      '-crop', `${c.w}x${h}+${x}+${y}`, '+repage',
      '-resize', '640x360!',
      '-modulate', `100,${c.sat},100`,
      '-fill', c.teinte, '-colorize', `${c.pc}%`,
      '-quality', '80', '-define', 'webp:method=6',
      dest,
    ]);
    console.log(`${id.padEnd(15)} ${c.lieu.padEnd(13)} ${c.heure.padEnd(6)} → ${path.basename(dest)} (${Math.round(fs.statSync(dest).size / 1024)} Ko)`);
  }
  for (const h of ['dusk', 'night']) {
    const p = PANORAMA, hh = Math.round(p.sortie * p.h / p.w);
    const dest = path.join(out, `panorama_${h === 'dusk' ? 'crepuscule' : 'nuit'}.webp`);
    convert([
      path.join(rendus, h + '.png'),
      '-crop', `${p.w}x${p.h}+${p.x}+${p.y}`, '+repage',
      '-resize', `${p.sortie}x${hh}!`,
      // la nuit, on relève les ombres : l'accueil doit montrer la ville
      ...(h === 'night' ? ['-gamma', '1.35', '-modulate', '112,108,100'] : []),
      '-quality', '78', '-define', 'webp:method=6',
      dest,
    ]);
    console.log(`panorama ${h.padEnd(6)} → ${path.basename(dest)} (${Math.round(fs.statSync(dest).size / 1024)} Ko)`);
  }
}

main();
