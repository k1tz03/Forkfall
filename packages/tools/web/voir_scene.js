// VOIR UNE SCÈNE — joue une scène jouée (`cinematiques`) ou une conversation (`conversations`)
// dans la ville assemblée, et en rend le texte et des captures. Pour les auteurs : on écrit,
// on regarde, on corrige la mise en scène (qui se tient où, qui marche dans un mur, qui sort
// du cadre) sans jouer la carrière jusqu'à la carte qui la déclenche.
//
//   # la page (voir AGENTS.md, « La ville ») servie en HTTP, puis :
//   NODE_PATH=/opt/node22/lib/node_modules node packages/tools/web/voir_scene.js \
//     --url http://127.0.0.1:8765/index.html --postulat 3 --scene h4.ci.intro --out /tmp/voir
//   … --conv h4.cv.le_quai          # une conversation (on se rend à son lieu)
//   … --scene h4.ci.x --heure soir  # l'heure de la ville avant la scène (matin|midi|aprem|soir|nuit)
//
// Sortie : chaque réplique (« Nom : texte »), une capture par réplique (au plus --captures, 12
// par défaut), et ce qui cloche : une erreur de la page, une figurine debout posée hors de la
// grille (dans un meuble ou un mur ; assis, c'est la chaise) ou hors de l'écran.
'use strict';
const path = require('path');
const fs = require('fs');

const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a.startsWith('--')) args[a.slice(2)] = process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[++i] : true;
}
if (!args.url || (!args.scene && !args.conv)) {
  console.error('usage : voir_scene.js --url <page> --postulat <i> (--scene <id> | --conv <id>) [--out dossier] [--heure soir] [--captures 12]');
  process.exit(2);
}
const OUT = path.resolve(args.out || 'voir_scene');
const MAX = +(args.captures || 12);
fs.mkdirSync(OUT, { recursive: true });

let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

(async () => {
  const browser = await chromium.launch({ executablePath: fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const erreurs = [];
  page.on('pageerror', e => erreurs.push(e.message + ' | ' + (e.stack || '').split('\n').slice(1, 3).join(' ')));
  await page.goto(args.url, { waitUntil: 'load' });
  await page.evaluate(() => localStorage.clear());
  await page.goto(args.url, { waitUntil: 'load' });
  await page.waitForTimeout(700);
  await page.evaluate(i => document.querySelector('#postulats .postulat[data-index="' + i + '"]').click(), +(args.postulat || 0));
  await page.waitForTimeout(2500);
  const id = args.scene || args.conv;
  // l'introduction qu'on ne regarde pas : on la passe
  const intro = await page.evaluate(() => { const d = window.FusibleVille._debug(); return d.cine && d.cine.id; });
  if (intro && intro !== id) {
    await page.evaluate(() => document.querySelector('#villeCine .v-cine-passer').click());
    await page.waitForTimeout(1500);
  }
  if (args.heure) await page.evaluate(h => window.FusibleVille._essai('tranche', h), args.heure);
  if (!(intro && intro === id)) {
    const r = await page.evaluate(([q, v]) => window.FusibleVille._essai(q, v), [args.scene ? 'cine' : 'conv', id]);
    if (r && r.erreur) { console.error(r.erreur); await browser.close(); process.exit(1); }
  }
  const etat = () => page.evaluate(() => {
    const c = document.querySelector('#villeCine'), b = c && c.querySelector('.v-cine-boite'), t = c && c.querySelector('.v-cine-titre');
    const d = window.FusibleVille._debug();
    return {
      cine: !!c && !c.hidden, titre: t && !t.hidden ? t.innerText.replace(/\n/g, ' / ') : null,
      nom: b && !b.hidden ? b.querySelector('.v-cine-nom').textContent : null,
      texte: b && !b.hidden ? b.querySelector('p').textContent : null,
      fini: !!(b && !b.hidden && b.classList.contains('fini')),
      fondu: document.querySelector('#villeFondu').classList.contains('on') ? document.querySelector('#villeFondu').innerText.replace(/\n/g, ' / ') : null,
      bulle: d.bulle, conv: d.conv, scene: d.cine, dedans: d.dedans && d.dedans.cle,
      gens: d.gens.filter(g => g.t.startsWith('f:')).map(g => ({ qui: g.t.slice(2), mur: g.mur && g.pose !== 'assis' && g.pose !== 'couche', ecran: g.ecran, a: g.a })),
    };
  });
  const vu = new Set(), problemes = new Set();
  let n = 0, calme = 0;
  for (let i = 0; i < 400; i++) {
    await page.waitForTimeout(450);
    const e = await etat();
    for (const g of e.gens) {
      if (g.a < 0.5) continue;
      if (g.mur) problemes.add(g.qui + ' se tient hors de la grille (dans un meuble ou un mur)' + (e.scene ? ' — étape ' + (e.scene.etape + 1) : ''));
      if (!g.ecran) problemes.add(g.qui + ' est hors de l\'écran' + (e.scene ? ' — étape ' + (e.scene.etape + 1) : ''));
    }
    let ligne = null;
    if (e.titre) ligne = '[titre] ' + e.titre;
    else if (e.fondu) ligne = '[fondu] ' + e.fondu;
    else if (e.fini && e.texte != null) ligne = (e.nom ? e.nom : '[narration]') + ' : ' + e.texte;
    else if (args.conv && e.bulle && e.bulle.texte) ligne = e.bulle.nom + ' : ' + e.bulle.texte;
    if (ligne && !vu.has(ligne)) {
      vu.add(ligne);
      console.log(ligne + (e.dedans ? '' : '   (dehors)'));
      if (n < MAX) await page.screenshot({ path: path.join(OUT, String(n++).padStart(2, '0') + '.png') });
    }
    if (args.scene) {
      if (!e.cine) { if (++calme > 3) break; continue; }
      calme = 0;
      if ((e.fini && e.texte != null) || e.titre) await page.mouse.click(195, 300);
    } else if (!e.conv) { if (++calme > 3) break; } else calme = 0;
  }
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, 'fin.png') });
  for (const p of problemes) console.log('! ' + p);
  console.log(erreurs.length ? 'erreurs de la page :\n  ' + erreurs.join('\n  ') : 'aucune erreur de la page');
  console.log('captures : ' + OUT);
  await browser.close();
  process.exit(erreurs.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
