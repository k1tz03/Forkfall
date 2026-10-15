#!/usr/bin/env node
// LES ICÔNES ET L'APERÇU D'UN LIEN — tirés de l'accueil : Aubérive la nuit (le
// panorama de packages/tools/web/accueil/), et le F du titre posé au pixel, avec
// ses trois couches (l'ombre framboise, le contour d'encre, la face éclairée :
// crème, or, orange), comme `logoPixel` le dessine (preview_template.html).
//
//   NODE_PATH=/opt/node22/lib/node_modules node packages/tools/web/pwa/genere.js
//
// Écrit, à côté de ce script (commités, copiés par assemble.js avec --ville) :
//   icone-48.png                          l'icône de l'onglet (légère : elle arrive avec l'accueil)
//   icone-192.png, icone-512.png          l'icône de l'application (« any »)
//   icone-masquable-512.png               la même, le F dans la zone sûre (« maskable »)
//   apple-touch-icon.png                  180 × 180, pour l'écran d'accueil d'un iPhone
//   apercu.jpg                            1200 × 630 : le lien partagé (Open Graph)
// À relancer si le titre ou le panorama changent.
'use strict';
const fs = require('fs');
const path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

const HERE = __dirname;
const ACCUEIL = path.join(HERE, '..', 'accueil');
const PROTEGER = (s) => s.replace(/[<&]/g, '');

// Les glyphes du titre (preview_template.html, GLYPHES) : 5 × 7, le I en 3 × 7.
const GLYPHES = {
  F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  I: ['###', '.#.', '.#.', '.#.', '.#.', '.#.', '###'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
};
// logoPixel : le mot, sa face (dégradé par ligne), son contour d'encre, son ombre framboise
function logoPixel(mot) {
  const on = {};
  let x = 1;
  for (const ch of mot) {
    const g = GLYPHES[ch];
    if (!g) { x += 3; continue; }
    g.forEach((ligne, y) => { for (let i = 0; i < ligne.length; i++) if (ligne[i] === '#') on[(x + i) + ',' + (y + 1)] = 1; });
    x += g[0].length + 1;
  }
  const W = x + 1, H = 10;
  const bord = {};
  for (const k of Object.keys(on)) {
    const [px, py] = k.split(',').map(Number);
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) bord[(px + dx) + ',' + (py + dy)] = 1;
  }
  const rects = (cases, dx, dy, couleur) => Object.keys(cases).map((k) => {
    const [px, py] = k.split(',').map(Number);
    return '<rect x="' + (px + dx) + '" y="' + (py + dy) + '" width="1" height="1" fill="' + (typeof couleur === 'function' ? couleur(py) : couleur) + '"/>';
  }).join('');
  const face = (y) => (y <= 2 ? '#FFF4D8' : y <= 4 ? '#FFD27A' : '#FF9A3C');
  return { W: W + 1, H, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 0 ' + (W + 1) + ' ' + H + '" shape-rendering="crispEdges">' +
    rects(bord, 1, 1, '#8A1238') + rects(bord, 0, 0, '#0B0814') + rects(on, 0, 0, face) + '</svg>' };
}

function dataUri(f) { return 'data:image/webp;base64,' + fs.readFileSync(path.join(ACCUEIL, f)).toString('base64'); }

// Une icône carrée : la ville de nuit en fond (un recadrage du panorama, assombri vers
// le bas), le F au milieu ; `zone` : la part du côté que le F occupe (0,8 pour la zone
// sûre d'une icône masquable, qui peut être rognée en cercle).
function pageIcone(cote, zone) {
  const f = logoPixel('F');
  const l = Math.round(cote * zone);
  return '<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#120E1C}' +
    '.c{width:' + cote + 'px;height:' + cote + 'px;position:relative;overflow:hidden;background:#120E1C}' +
    '.v{position:absolute;inset:0;background:url(' + dataUri('panorama_nuit.webp') + ') 58% 62%/auto 165% no-repeat;image-rendering:pixelated;filter:saturate(1.1)}' +
    '.o{position:absolute;inset:0;background:radial-gradient(circle at 50% 46%,rgba(18,14,28,.15),rgba(18,14,28,.78) 72%)}' +
    '.f{position:absolute;left:50%;top:50%;width:' + l + 'px;transform:translate(-50%,-50%)}.f svg{display:block;width:100%;height:auto}</style>' +
    '<div class="c"><div class="v"></div><div class="o"></div><div class="f">' + f.svg + '</div></div>';
}

// L'aperçu d'un lien : Aubérive au crépuscule, FUSIBLE au pixel, et ce que c'est
function pageApercu() {
  const t = logoPixel('FUSIBLE');
  return '<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#120E1C}' +
    '.c{width:1200px;height:630px;position:relative;overflow:hidden;background:#120E1C;font-family:"DejaVu Sans Mono",monospace}' +
    '.v{position:absolute;inset:0;background:url(' + dataUri('panorama_crepuscule.webp') + ') 50% 70%/cover no-repeat}' +
    '.o{position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,14,28,.55),rgba(18,14,28,.05) 38%,rgba(18,14,28,.05) 62%,rgba(18,14,28,.86))}' +
    '.t{position:absolute;left:50%;top:150px;width:760px;transform:translateX(-50%)}.t svg{display:block;width:100%;height:auto}' +
    '.s{position:absolute;left:0;right:0;bottom:62px;text-align:center;color:#F6E9CF;font-size:30px;font-weight:bold;letter-spacing:.14em;text-shadow:3px 3px 0 #06040B}' +
    '.s b{color:#FFC94D}</style>' +
    '<div class="c"><div class="v"></div><div class="o"></div><div class="t">' + t.svg + '</div>' +
    '<div class="s">' + PROTEGER('UNE CARRIÈRE DE FOOTBALL') + ' · <b>' + PROTEGER('AUBÉRIVE 1990 → 2050') + '</b></div></div>';
}

(async () => {
  const browser = await chromium.launch({ executablePath: fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined });
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  async function rendre(html, w, h, nom) {
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(html, { waitUntil: 'load' });
    await page.waitForTimeout(150);
    const jpeg = /\.jpg$/.test(nom);
    await page.screenshot({ path: path.join(HERE, nom), clip: { x: 0, y: 0, width: w, height: h }, type: jpeg ? 'jpeg' : 'png', quality: jpeg ? 88 : undefined });
    console.log(nom, w + '×' + h, fs.statSync(path.join(HERE, nom)).size, 'octets');
  }
  await rendre(pageIcone(48, 0.72), 48, 48, 'icone-48.png');
  await rendre(pageIcone(192, 0.62), 192, 192, 'icone-192.png');
  await rendre(pageIcone(512, 0.62), 512, 512, 'icone-512.png');
  await rendre(pageIcone(512, 0.46), 512, 512, 'icone-masquable-512.png');
  await rendre(pageIcone(180, 0.62), 180, 180, 'apple-touch-icon.png');
  await rendre(pageApercu(), 1200, 630, 'apercu.jpg');
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
