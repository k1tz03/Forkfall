#!/usr/bin/env node
// Test de rendu de l'aperçu jouable (Playwright, Chromium headless) :
//   NODE_PATH=/opt/node22/lib/node_modules node packages/tools/web/check_preview.js \
//     [--file build/web/fusible_preview.html] [--shots <dossier>] [--cartes 90]
//
// Ce script tient les contraintes qu'on ne peut pas voir dans le code, et qui
// sont revenues une fois du contrôle client. Chacune a coûté une passe :
//
//   1. LE PICTO EST LA JAUGE. Le rognage de remplissage doit SUIVRE la valeur,
//      monotone, et deux valeurs éloignées doivent donner deux hauteurs
//      franchement différentes. (L'ancienne version ne codait la valeur que
//      par l'opacité : 50 et 52 étaient indiscernables.)
//   2. LE CRÂNE N'EST PAS UN DÉCOR. Aucun postulat ne démarre avec une tête de
//      mort allumée. (Les tribunes partent à 80, et le test était `>= 80`.)
//   3. LA FRISE EST LE SIÈCLE. Sept décennies posées en repères, la carrière
//      un segment COURT sur une ligne longue, aucun jalon hors cadre.
//   4. LE PLANCHER DE LISIBILITÉ. Aucun texte porteur sous 11 px, et le jeton
//      de texte éteint au-dessus de 7:1 sur le fond.
//   5. LA CARTE-CLASSEMENT GARDE SON IMAGE. La feuille se pose sur
//      l'illustration ; elle ne la remplace pas.
//   6. LE BANDEAU D'ANNONCE NE COUVRE PAS LE VISAGE (tiers bas, pas le centre).
//   7. LE NOM DU LOCUTEUR N'EST PAS TRONQUÉ.
//   8. SOIXANTE CARTES NE SE RESSEMBLENT PAS : au moins quatre familles de
//      cadrage sur un parcours, et jamais deux fois de suite la même image.
//   9. L'ÉTIQUETTE DE RÉPONSE RESTE DANS L'ÉCRAN pendant le glissement.
//  10. Le classement complet s'ouvre et se referme ; le son offre 44 × 44 px ;
//      pas de défilement horizontal ; aucune erreur JavaScript.
'use strict';
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const EXECUTABLE = '/opt/pw-browsers/chromium';

function parseArgs(argv) {
  const o = { file: path.join(ROOT, 'build', 'web', 'fusible_preview.html'), shots: null, cartes: 90 };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--file' && argv[i + 1]) o.file = path.resolve(argv[++i]);
    else if (argv[i] === '--shots' && argv[i + 1]) o.shots = path.resolve(argv[++i]);
    else if (argv[i] === '--cartes' && argv[i + 1]) o.cartes = parseInt(argv[++i], 10);
  }
  return o;
}

const fails = [];
function check(ok, msg) {
  if (!ok) fails.push(msg);
  console.log((ok ? '  ok    ' : '  ÉCHEC ') + msg);
}

/// Le contraste WCAG entre deux couleurs `rgb(r, g, b)`.
function contraste(a, b) {
  const lum = (c) => {
    const [r, g, bl] = c.match(/\d+/g).slice(0, 3).map((v) => {
      const x = Number(v) / 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/// L'état de la carte servie, lu dans le DOM.
const LIRE = () => {
  const $ = (id) => document.getElementById(id);
  const svg = document.querySelector('#portrait svg');
  const jauges = [...document.querySelectorAll('#rail .gauge')].map((e) => {
    const r = e.querySelector('.pic clipPath rect');
    return {
      danger: e.classList.contains('danger'),
      bord: e.classList.contains('bord'),
      label: e.getAttribute('aria-label') || '',
      y: r ? parseFloat(r.getAttribute('y')) : null,
    };
  });
  const who = $('cardWho');
  return {
    jauges,
    cadrage: svg ? svg.getAttribute('data-cadrage') : null,
    // Une empreinte, pas une longueur : deux images différentes peuvent
    // peser le même nombre d'octets.
    empreinte: svg ? (function (t) {
      var h = 2166136261 >>> 0;
      for (var i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
      return h >>> 0;
    })(svg.innerHTML) : 0,
    tableau: !$('tableau').hidden,
    carte: !$('cardwrap').hidden,
    art: !!svg && svg.innerHTML.length > 200,
    annonce: !$('annonce').hidden,
    whoVisible: !who.hidden,
    whoNom: who.querySelector('b') ? who.querySelector('b').textContent : '',
    whoRole: who.querySelector('i') ? who.querySelector('i').textContent : '',
    whoCoupe: [...who.querySelectorAll('b,i')].some((n) => n.scrollWidth > n.clientWidth + 1),
    numero: $('cardNumber').textContent,
    large: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  };
};

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(opts.file)) throw new Error('aperçu introuvable : ' + opts.file);
  if (opts.shots) fs.mkdirSync(opts.shots, { recursive: true });
  const shot = async (page, nom, full) =>
    opts.shots ? page.screenshot({ path: path.join(opts.shots, nom + '.png'), fullPage: !!full }) : null;

  const browser = await chromium.launch({ executablePath: EXECUTABLE, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(String(e)));
  // Hors ligne, le <link> Google Fonts échoue : c'est prévu (pile de repli).
  page.on('console', (m) => {
    if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) erreurs.push('console: ' + m.text());
  });
  await page.goto('file://' + opts.file);
  await page.waitForSelector('#titleScreen:not([hidden])');
  await shot(page, 'titre');

  // --- 4. le plancher de lisibilité, mesuré dans le document ---------------
  const typo = await page.evaluate(() => {
    const fond = getComputedStyle(document.body).backgroundColor;
    const cs = getComputedStyle(document.documentElement);
    const petits = [];
    for (const el of document.querySelectorAll('body *')) {
      if (!el.firstChild) continue;
      let texte = '';
      for (const n of el.childNodes) if (n.nodeType === 3) texte += n.textContent.trim();
      if (!texte) continue;
      const s = getComputedStyle(el);
      const px = parseFloat(s.fontSize);
      if (px < 11) petits.push((el.id || el.className || el.tagName) + ' ' + px + 'px');
    }
    return { fond, creme3: cs.getPropertyValue('--creme3').trim(), petits };
  });
  const c3 = await page.evaluate((hex) => {
    const d = document.createElement('span');
    d.style.color = hex; document.body.appendChild(d);
    const c = getComputedStyle(d).color; d.remove(); return c;
  }, typo.creme3);
  const r3 = contraste(c3, typo.fond);
  check(r3 >= 7, `le texte éteint (--creme3 ${typo.creme3}) tient ${r3.toFixed(2)}:1 sur le fond (attendu ≥ 7:1)`);
  check(typo.petits.length === 0, `écran de titre : ${typo.petits.length} texte(s) sous 11 px ${typo.petits.slice(0, 3).join(', ')}`);

  // --- 2. la tête de mort n'est pas allumée à la carte zéro ----------------
  // LES QUATRE POSTULATS, pas seulement le premier : le défaut portait sur
  // « Le promu sans un sou » ET « La pépite du club-usine », qui démarrent
  // tous deux avec des tribunes à 80.
  const nbPostulats = await page.locator('#postulats .postulat').count();
  for (let i = 0; i < nbPostulats; i++) {
    if (i) { await page.reload(); await page.waitForSelector('#titleScreen:not([hidden])'); }
    const titre = (await page.locator(`#postulats .postulat[data-index="${i}"] .t`).innerText()).trim();
    await page.click(`#postulats .postulat[data-index="${i}"]`);
    await page.waitForSelector('#gameScreen:not([hidden])');
    const z = await page.evaluate(LIRE);
    check(!z.jauges.some((g) => g.danger),
      `carte zéro · « ${titre} » : aucune tête de mort allumée (${z.jauges.map((g) => g.label).join(' | ')})`);
    check(z.jauges.length === 4 && z.jauges.every((g) => g.y !== null),
      `carte zéro · « ${titre} » : les quatre pictogrammes portent un rognage de remplissage`);
  }
  // On rejoue le premier postulat pour le parcours de contrôle.
  await page.reload();
  await page.waitForSelector('#titleScreen:not([hidden])');
  await page.click('#postulats .postulat[data-index="0"]');
  await page.waitForSelector('#gameScreen:not([hidden])');
  const sonJeu = await page.locator('#btnSon').boundingBox();
  check(sonJeu && sonJeu.width >= 44 && sonJeu.height >= 44,
    `bouton du son : cible tactile ${sonJeu ? Math.round(sonJeu.width) + '×' + Math.round(sonJeu.height) : '—'} px (attendu ≥ 44 × 44)`);

  // --- 1. le remplissage suit la valeur -----------------------------------
  const echelle = await page.evaluate(() => {
    const A = window.FusibleArt;
    const y = (v) => {
      const m = /<rect x="0" y="([\d.]+)"/.exec(A.jauge('vestiaire', { size: 34, value: v }));
      return m ? parseFloat(m[1]) : null;
    };
    return [0, 0.12, 0.3, 0.45, 0.5, 0.52, 0.8, 0.88, 1].map(y);
  });
  const decroit = echelle.every((v, i) => i === 0 || (v !== null && v <= echelle[i - 1]));
  check(decroit, 'le rognage descend quand la valeur monte : ' + echelle.map((v) => v && v.toFixed(1)).join(' '));
  check(echelle[0] - echelle[8] > 15,
    `écart 0 → 100 : ${(echelle[0] - echelle[8]).toFixed(1)} unités sur 24 (attendu > 15)`);
  check(Math.abs(echelle[4] - echelle[3]) > 0.4,
    `45 et 50 ne donnent pas le même niveau (écart ${Math.abs(echelle[4] - echelle[3]).toFixed(2)})`);

  // --- le parcours de contrôle --------------------------------------------
  const cadrages = {};
  let vuClassement = false, vuAnnonce = false, vuPrologue = false, vuFrise = false;
  let coupes = 0, sansArt = 0, horsEcran = 0, repet = 0, prec = null, precCad = null;
  const empreintes = [];

  for (let i = 0; i < opts.cartes; i++) {
    if (!(await page.locator('#endingScreen').isHidden())) break;
    if (await page.locator('.plein:not([hidden])').count()) {
      if (!vuFrise && !(await page.locator('#frisePanel').isHidden())) { vuFrise = true; await shot(page, 'frise_imposee', true); }
      await page.keyboard.press('Escape');
      await page.waitForTimeout(80);
      continue;
    }
    const st = await page.evaluate(LIRE);
    if (st.large) horsEcran++;
    if (st.whoVisible && st.whoCoupe) coupes++;
    // La page de journal du Bilan remplace la carte : elle n'a pas
    // d'illustration à elle, et le SVG précédent dort encore dans le DOM.
    // On ne la compte donc ni dans les cadrages, ni dans les répétitions.
    if (st.carte) {
      if (!st.art) sansArt++;
      if (st.cadrage) cadrages[st.cadrage] = (cadrages[st.cadrage] || 0) + 1;
      if (prec !== null && st.empreinte === prec) repet++;
      prec = st.empreinte; precCad = st.cadrage;
      empreintes.push(st.empreinte);
    }

    if (/^\d+\s*\/\s*\d+$/.test(st.numero.trim()) && !vuPrologue) { vuPrologue = true; await shot(page, 'prologue'); }

    // --- 5. la carte-classement : l'image ET la feuille --------------------
    if (st.tableau && !vuClassement) {
      vuClassement = true;
      check(st.carte && st.art, 'carte Classement : l\'illustration est là, sous la feuille');
      const rows = await page.$$eval('#tblRows tr', (trs) => trs.map((tr) => ({
        toi: tr.className === 'toi',
        cells: [...tr.children].map((td) => td.textContent.trim()),
      })));
      check(rows.length === 6, `carte Classement : ${rows.length} lignes (attendu 6)`);
      check(rows.filter((r) => r.toi).length === 1, `carte Classement : ${rows.filter((r) => r.toi).length} ligne « toi » (attendu 1)`);
      const pts = rows.map((r) => parseInt(r.cells[2], 10));
      check(pts.every((v, k) => k === 0 || v <= pts[k - 1]), 'carte Classement : les points décroissent (' + pts.join(' ') + ')');
      // La feuille ne déborde pas du cadre carré.
      const [cadre, feuille] = await page.evaluate(() => [
        document.getElementById('cardwrap').getBoundingClientRect(),
        document.getElementById('tableau').getBoundingClientRect(),
      ].map((r) => ({ top: r.top, bottom: r.bottom, height: r.height })));
      check(feuille.bottom <= cadre.bottom + 1 && feuille.top >= cadre.top,
        `carte Classement : la feuille tient dans le cadre (${Math.round(feuille.height)} px sur ${Math.round(cadre.height)})`);
      await shot(page, 'classement_carte');

      await page.click('#btnTblPlus');
      await page.waitForSelector('#standingsFull:not([hidden])');
      const full = await page.$$eval('#fullRows tr', (trs) => trs.length);
      check(full === 18, `écran complet : ${full} lignes (attendu 18)`);
      await shot(page, 'classement_ecran');
      await page.keyboard.press('Escape');
      await page.waitForSelector('#standingsFull', { state: 'hidden' });
      check(true, 'écran complet : Échap le referme');
    }

    // --- 6. le bandeau d'annonce est au tiers bas -------------------------
    if (st.annonce && !vuAnnonce) {
      vuAnnonce = true;
      await page.waitForTimeout(420); // la bande finit d'entrer
      const geo = await page.evaluate(() => {
        const a = document.getElementById('annonce').getBoundingClientRect();
        const s = document.getElementById('cardwrap').getBoundingClientRect();
        return { haut: (a.top - s.top) / s.height, bas: (a.bottom - s.top) / s.height };
      });
      check(geo.haut > 0.52,
        `bandeau d'annonce : posé au tiers bas de l'illustration (haut à ${(geo.haut * 100).toFixed(0)} % du cadre, attendu > 52 %)`);
      await shot(page, 'annonce');
    }

    // --- 9. l'étiquette reste dans l'écran pendant le glissement ----------
    if (i === 10) {
      const b = await page.locator('#card').boundingBox();
      if (b) {
        await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
        await page.mouse.down();
        await page.mouse.move(b.x + b.width / 2 + 90, b.y + b.height / 2, { steps: 8 });
        await shot(page, 'glissement');
        const et = await page.locator('#badgeRight').boundingBox();
        const vw = page.viewportSize().width;
        check(et && et.x >= 0 && et.x + et.width <= vw + 1,
          `glissement : l'étiquette de droite reste dans l'écran (x ${et ? Math.round(et.x) : '—'} → ${et ? Math.round(et.x + et.width) : '—'} pour ${vw} px)`);
        await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 6 });
        await page.mouse.up();
        await page.waitForTimeout(160);
      }
    }
    if (i < 4) await shot(page, 'carte_' + i);

    const acts = page.locator('#controls .act');
    if (!(await acts.count())) break;
    await acts.last().click();
    await page.waitForTimeout(280);
  }

  // --- 8. soixante cartes ne se ressemblent pas ---------------------------
  const familles = Object.keys(cadrages);
  check(familles.length >= 4,
    `cadrages rencontrés : ${familles.length} familles — ${familles.map((k) => k + ' ' + cadrages[k]).join(', ')} (attendu ≥ 4)`);
  const uniques = new Set(empreintes).size;
  check(uniques >= empreintes.length * 0.55,
    `illustrations distinctes : ${uniques} sur ${empreintes.length} cartes (attendu ≥ 55 %)`);
  check(repet === 0, `aucune carte n'affiche exactement l'image de la précédente (${repet} répétition(s))`);
  check(sansArt === 0, `chaque carte porte une illustration (${sansArt} carte(s) sans image)`);
  check(coupes === 0, `le nom du locuteur n'est jamais tronqué (${coupes} troncature(s))`);
  check(horsEcran === 0, `aucun défilement horizontal (${horsEcran} carte(s) en cause)`);
  check(vuPrologue, 'le prologue affiche sa progression (« n / 6 »)');
  check(vuClassement, `une carte Classement a été atteinte en ${opts.cartes} cartes`);

  // --- 3. la frise est le siècle ------------------------------------------
  while (await page.locator('.plein:not([hidden])').count()) { await page.keyboard.press('Escape'); await page.waitForTimeout(80); }
  const fin = !(await page.locator('#endingScreen').isHidden());
  await page.click(fin ? '#btnFriseEnd' : '#btnFriseGame');
  await page.waitForSelector('#frisePanel:not([hidden])');
  await shot(page, 'frise', true);
  const frise = await page.evaluate(() => {
    const axe = document.getElementById('friseAxe');
    const r = axe.getBoundingClientRect();
    const dec = [...axe.querySelectorAll('.dec span')].map((e) => e.textContent);
    const now = axe.querySelector('.now');
    const jal = [...axe.querySelectorAll('.jal')].map((e) => e.getBoundingClientRect());
    return {
      decennies: dec,
      largeurCarriere: now ? now.getBoundingClientRect().width / r.width : null,
      jalonsDehors: jal.filter((b) => b.left < r.left - 12 || b.right > r.right + 12).length,
      saisons: document.querySelectorAll('#friseSaisons li').length,
      jalonsEcrits: document.querySelectorAll('#friseJalons .j').length,
      legendes: document.querySelectorAll('#friseLegende .lg').length,
      hauteurRemplie: document.querySelector('#frisePanel .pbody').scrollHeight,
    };
  });
  check(frise.decennies.length >= 7 && frise.decennies[0] === '1990' && frise.decennies[frise.decennies.length - 1] === '2050',
    `frise : la ligne est le siècle — ${frise.decennies.join(' ')}`);
  check(frise.largeurCarriere !== null && frise.largeurCarriere < 0.5,
    `frise : la carrière est un segment COURT sur une ligne longue (${(frise.largeurCarriere * 100).toFixed(1)} % de l'axe)`);
  check(frise.jalonsDehors === 0, `frise : aucun jalon hors cadre (${frise.jalonsDehors})`);
  check(frise.saisons >= 1 && frise.legendes >= 2,
    `frise : le bas du panneau porte ${frise.saisons} saison(s), ${frise.jalonsEcrits} jalon(s) écrit(s), ${frise.legendes} légende(s)`);

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
