#!/usr/bin/env node
// Test de rendu de l'aperçu jouable (Playwright, Chromium headless) :
//   NODE_PATH=/opt/node22/lib/node_modules node packages/tools/web/check_preview.js \
//     [--file build/web/fusible_preview.html] [--shots <dossier>]
//
// Ce que le test refuse de laisser passer — c'est le retour client, mis sous
// contrainte :
//
//   1. « aucune carte avec le classement n'apparaît » : une carte dont le beat
//      est `classement` DOIT afficher un tableau (six lignes, une seule à toi,
//      des points qui décroissent) à la place de la vignette. Si le tableau
//      manque, ce script sort en erreur.
//   2. Le tableau complet (dix-huit clubs) s'ouvre depuis la carte et depuis
//      le rang du bandeau, et se referme.
//   3. « on est jeté dans la fosse aux lions » : pendant le prologue, la
//      progression (« 1 / 6 ») s'affiche et le bandeau n'annonce ni journée ni
//      rang inventé.
//   4. « un jeu sans univers musical est un jeu vide » : le bouton du son
//      offre au moins 44 × 44 px au doigt.
//
// Le jeu se joue tout seul en posant le magnet de droite. Une carrière peut
// mourir avant le premier classement (c'est le jeu) : on rejoue jusqu'à
// `--runs` albums avant de conclure.
'use strict';
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const EXECUTABLE = '/opt/pw-browsers/chromium';

function parseArgs(argv) {
  const o = { file: path.join(ROOT, 'build', 'web', 'fusible_preview.html'), shots: null, runs: 6, swipes: 90 };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--file' && argv[i + 1]) o.file = path.resolve(argv[++i]);
    else if (argv[i] === '--shots' && argv[i + 1]) o.shots = path.resolve(argv[++i]);
    else if (argv[i] === '--runs' && argv[i + 1]) o.runs = parseInt(argv[++i], 10);
    else if (argv[i] === '--swipes' && argv[i + 1]) o.swipes = parseInt(argv[++i], 10);
  }
  return o;
}

const fails = [];
function check(ok, msg) {
  if (!ok) fails.push(msg);
  console.log((ok ? '  ok   ' : '  ÉCHEC ') + msg);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(opts.file)) throw new Error('aperçu introuvable : ' + opts.file);
  if (opts.shots) fs.mkdirSync(opts.shots, { recursive: true });

  const browser = await chromium.launch({ executablePath: EXECUTABLE, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 400, height: 860 }, hasTouch: true, isMobile: true });
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') erreurs.push('console: ' + m.text()); });
  await page.goto('file://' + opts.file);
  await page.waitForSelector('#titleScreen:not([hidden])');

  // --- 4. le son : la cible tactile ---------------------------------------
  const son = await page.locator('#btnSon').boundingBox();
  check(son && son.width >= 44 && son.height >= 44,
    `bouton du son : cible tactile ${son ? Math.round(son.width) + '×' + Math.round(son.height) : '—'} px (attendu ≥ 44 × 44)`);

  // Sous le doigt il n'y a ni survol ni focus : après un tap, l'étiquette doit
  // rester lisible une seconde (sinon les trois états ne se distinguent pas).
  await page.locator('#btnSon').tap();
  await page.waitForTimeout(200); // le fondu de l'étiquette dure 120 ms
  const tip = await page.evaluate(() => {
    const b = document.getElementById('btnSon');
    const t = document.getElementById('btnSonTip');
    return { dit: b.classList.contains('dit'), texte: t.textContent, opacite: getComputedStyle(t).opacity, mode: b.getAttribute('data-mode') };
  });
  check(tip.dit && parseFloat(tip.opacite) > .9,
    `bouton du son : l'étiquette reste après le tap (« ${tip.texte} », état « ${tip.mode} », opacité ${tip.opacite})`);
  await page.locator('#btnSon').tap();
  await page.locator('#btnSon').tap(); // retour à « tout »

  // --- on entre dans une carrière ------------------------------------------
  let vuClassement = false;
  let vuPrologue = false;
  for (let run = 0; run < opts.runs && !vuClassement; run++) {
    await page.click('#btnNewAlbum');
    await page.click('#postulats .postulat[data-index="0"]');
    await page.waitForSelector('#gameScreen:not([hidden])');

    for (let i = 0; i < opts.swipes; i++) {
      if (!(await page.locator('#endingScreen').isHidden())) break;
      const pro = await page.locator('#cardNumber').innerText();
      // --- 3. le prologue : la progression, et pas de rang inventé ---------
      if (/^\d+\s*\/\s*\d+$/.test(pro.trim()) && !vuPrologue) {
        vuPrologue = true;
        const mid = await page.locator('#statusMid').innerText();
        const rang = await page.locator('#btnRang').innerText();
        const off = await page.locator('#btnRang').isDisabled();
        check(!/·\s*J\s*\d/.test(mid), `prologue : le bandeau n'annonce pas de journée (« ${mid} »)`);
        check(rang.trim() === '—' && off, `prologue : le rang est « — » et n'ouvre rien (lu « ${rang.trim()} »)`);
        if (opts.shots) await page.screenshot({ path: path.join(opts.shots, 'prologue.png') });
      }
      // --- 1. la carte Classement DOIT montrer un tableau -------------------
      const estClassement = await page.evaluate(() => {
        const t = document.getElementById('tableau');
        return { table: t && !t.hidden, card: !document.getElementById('card').hidden };
      });
      if (estClassement.table && !vuClassement) {
        vuClassement = true;
        const rows = await page.$$eval('#tblRows tr', (trs) => trs.map((tr) => ({
          toi: tr.className === 'toi',
          cells: Array.from(tr.children).map((td) => td.textContent.trim()),
        })));
        check(rows.length === 6, `carte Classement : ${rows.length} lignes affichées (attendu 6)`);
        check(rows.filter((r) => r.toi).length === 1, `carte Classement : ${rows.filter((r) => r.toi).length} ligne(s) « toi » (attendu 1)`);
        const pts = rows.map((r) => parseInt(r.cells[2], 10));
        check(pts.every((v, i) => i === 0 || v <= pts[i - 1]), 'carte Classement : les points décroissent de haut en bas (' + pts.join(' ') + ')');
        check(rows.every((r) => r.cells[1].length > 0), 'carte Classement : chaque ligne porte un club');
        check(!estClassement.card, 'carte Classement : la feuille prend la place de la vignette');
        const journee = await page.locator('#tblJournee').innerText();
        check(/journ/i.test(journee), `carte Classement : la journée est dite (« ${journee} »)`);
        if (opts.shots) await page.screenshot({ path: path.join(opts.shots, 'classement_carte.png') });

        // --- 2. le tableau complet ----------------------------------------
        await page.click('#btnTblPlus');
        await page.waitForSelector('#standingsFull:not([hidden])');
        const full = await page.$$eval('#fullRows tr', (trs) => trs.length);
        const fullToi = await page.$$eval('#fullRows tr.toi', (trs) => trs.length);
        check(full === 18, `écran complet : ${full} lignes (attendu 18)`);
        check(fullToi === 1, `écran complet : ${fullToi} ligne(s) « toi » (attendu 1)`);
        if (opts.shots) await page.screenshot({ path: path.join(opts.shots, 'classement_ecran.png') });
        await page.keyboard.press('Escape');
        await page.waitForSelector('#standingsFull', { state: 'hidden' });
        check(true, 'écran complet : Échap le referme');

        // le rang du bandeau ouvre le même tableau
        await page.click('#btnRang');
        await page.waitForSelector('#standingsFull:not([hidden])');
        check(true, 'le rang du bandeau ouvre le classement');
        await page.click('#btnFullClose');
        await page.waitForSelector('#standingsFull', { state: 'hidden' });
        break;
      }
      const magnet = page.locator('#controls .magnet.right');
      if (!(await magnet.count())) break;
      await magnet.click();
      await page.waitForTimeout(20);
    }
    if (!vuClassement) {
      // carrière finie ou trop courte : on rouvre un album
      if (!(await page.locator('#endingScreen').isHidden())) await page.click('#btnNew');
      else await page.reload(), await page.waitForSelector('#titleScreen:not([hidden])');
    }
  }

  check(vuPrologue, 'le prologue affiche sa progression (« n / 6 »)');
  check(vuClassement, `une carte Classement a été atteinte en ${opts.runs} album(s)`);
  check(erreurs.length === 0, 'aucune erreur JavaScript : ' + (erreurs.slice(0, 3).join(' | ') || '—'));

  await browser.close();
  if (fails.length) {
    console.error('\ncheck_preview : ' + fails.length + ' échec(s)');
    process.exit(1);
  }
  console.log('\ncheck_preview : tout passe.');
}

main().catch((e) => {
  console.error('check_preview : ' + (e && e.stack ? e.stack : e));
  process.exit(1);
});
