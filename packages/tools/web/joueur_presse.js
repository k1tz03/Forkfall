// LE JOUEUR PRESSÉ : il suit l'histoire en ville (« Y aller », il répond, il regarde les scènes
// jouées réplique par réplique dès qu'elles sont écrites, il laisse le match se jouer) et
// chronomètre ce que le jeu impose. La lecture humaine s'ajoute après, à partir des textes.
// Voir docs/balance/duree_partie.md. La page assemblée avec la ville, servie en HTTP, puis :
//   NODE_PATH=/opt/node22/lib/node_modules node packages/tools/web/joueur_presse.js URL postulat saisons sortie.json [minutes_max]
const fs = require('fs');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const [URL, POST, SAISONS, OUT, CAP] = [process.argv[2], +process.argv[3], +(process.argv[4] || 1), process.argv[5], +(process.argv[6] || 40)];
(async () => {
  const browser = await chromium.launch({ executablePath: fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto(URL, { waitUntil: 'load' }); await page.evaluate(() => localStorage.clear());
  await page.goto(URL, { waitUntil: 'load' }); await page.waitForTimeout(800);
  await page.evaluate(n => document.querySelector('#postulats .postulat[data-index="' + n + '"]').click(), POST);
  const debut = Date.now();
  const saisons = [];
  let S = null;
  const nouvelleSaison = (n) => { S = { saison: n, semaines: new Set(), temps: {}, n: {}, scenes: [], lignes: [], cartes: [], matchs: [], cines: [] }; saisons.push(S); };
  let cineVue = null;
  const ajoute = (k, ms) => { S.temps[k] = (S.temps[k] || 0) + ms; };
  const compte = k => { S.n[k] = (S.n[k] || 0) + 1; };
  let herosAvant = '', immobile = 0, yAllerSuite = 0;
  let avant = Date.now(), cat = 'demarrage', ligneVue = null, ligneT0 = 0, titreVu = null, sceneVue = null, reponseVue = null, carteVue = null, matchT0 = 0, enMatch = false, fin = null;
  nouvelleSaison(1);
  while (true) {
    const st = await page.evaluate(() => {
      const $ = s => document.querySelector(s), vis = e => !!e && !e.hidden && e.offsetParent !== null;
      const V = window.FusibleVille, e = V && V._essai ? V._essai('rien') : null, v = window.FusibleCoquille && window.FusibleCoquille.vue ? window.FusibleCoquille.vue() : null;
      const C = $('#villeCine'), B = C && C.querySelector('.v-cine-boite'), T = C && C.querySelector('.v-cine-titre');
      const P = $('#villePorte'), choix = P ? [...P.querySelectorAll('.v-choix')].filter(vis) : [], sortir = P ? [...P.querySelectorAll('.v-sortir')].filter(vis) : [];
      const panneau = !$('#frisePanel').hidden ? '#btnFriseClose' : !$('#panel').hidden ? '#btnPanelClose' : !$('#standingsFull').hidden ? '#btnFullClose' : null;
      const hud = (($('#villeHud .v-temps span') || {}).textContent || '');
      return {
        over: !!(v && v.over), saison: v ? v.season : 0, fin: v && v.over && v.ending ? v.ending.id : null,
        sem: +(hud.match(/Sem\. (\d+)/) || [0, 0])[1],
        cine: !!C && !C.hidden, titre: T && !T.hidden ? T.innerText : null,
        boite: B && !B.hidden ? { nom: (B.querySelector('.v-cine-nom') || {}).textContent || '', texte: (B.querySelector('p') || {}).textContent || '', fini: B.classList.contains('fini') } : null,
        fondu: $('#villeFondu').classList.contains('on') ? $('#villeFondu').innerText : null,
        match: e && e.match ? e.match.phase : null, quitter: vis($('.v-match-quitter')),
        porte: !!P && P.classList.contains('on'), scene: !!P && P.classList.contains('v-scene'),
        sceneTexte: P && P.classList.contains('v-scene') ? P.innerText : '', nChoix: choix.length, nSortir: sortir.length,
        carte: $('#gameScreen').classList.contains('carte-on'), carteTexte: (($('#cardText') || {}).textContent || ''), carteId: v && v.card ? v.card.id + ':' + v.turn : null,
        panneau, rdv: vis($('#villeRdv')), attendre: vis($('#villeAttendre')) && !$('#villeAttendre').disabled,
        heros: V && V._debug ? V._debug().heros.map(x => Math.round(x * 10)).join(',') : '',
        cineId: V && V._debug && V._debug().cine ? V._debug().cine.id : null,
      };
    });
    const t = Date.now();
    ajoute(cat, t - avant);
    if (cat === 'cine' && cineVue) S.tempsCine = Object.assign(S.tempsCine || {}, { [cineVue]: ((S.tempsCine || {})[cineVue] || 0) + (t - avant) });
    avant = t;
    if (st.over) { fin = st.fin; break; }
    if (st.saison > S.saison) { if (saisons.length >= SAISONS) break; nouvelleSaison(st.saison); }
    if ((t - debut) / 60000 > CAP) { fin = 'plafond'; break; }
    if (st.sem) S.semaines.add(st.sem);
    // le match qui finit
    if (enMatch && !st.match) { enMatch = false; S.matchs.push(t - matchT0); }
    // quelque chose arrive : « Y aller » a de nouveau un sens
    if (st.cine || st.fondu || st.match || st.scene || st.carte || st.porte || st.panneau) yAllerSuite = 0;
    if (st.panneau) { cat = 'panneau'; compte('panneau'); await page.click(st.panneau).catch(() => {}); await page.waitForTimeout(120); continue; }
    if (st.cine) {
      cat = 'cine';
      if (st.cineId && st.cineId !== cineVue) { cineVue = st.cineId; S.cines.push(st.cineId); }
      if (st.titre && st.titre !== titreVu) { titreVu = st.titre; compte('cine_titre'); await page.waitForTimeout(150); await page.mouse.click(195, 300); continue; }
      if (st.boite) {
        const cle = st.boite.nom + '|' + st.boite.texte;
        if (!st.boite.fini) { if (ligneVue !== 'en cours:' + st.boite.nom) { ligneVue = 'en cours:' + st.boite.nom; ligneT0 = t; } }
        else if (ligneVue !== cle) {
          S.lignes.push({ ci: st.cineId, nom: st.boite.nom, n: st.boite.texte.length, frappe: ligneT0 ? t - ligneT0 : 0 });
          ligneVue = cle; ligneT0 = 0;
          await page.mouse.click(195, 300); await page.waitForTimeout(60); continue;
        }
      }
      await page.waitForTimeout(80); continue;
    }
    ligneVue = null; titreVu = null;
    if (st.fondu) { cat = 'fondu'; await page.waitForTimeout(100); continue; }
    if (st.match) {
      cat = 'match';
      if (!enMatch) { enMatch = true; matchT0 = t; compte('match'); }
      if (st.quitter) { await page.click('.v-match-quitter').catch(() => {}); await page.waitForTimeout(150); }
      else await page.waitForTimeout(150);
      continue;
    }
    if (st.scene) {
      cat = 'scene';
      if (st.nChoix) {
        if (sceneVue !== st.sceneTexte) { sceneVue = st.sceneTexte; S.scenes.push({ n: st.sceneTexte.length, choix: st.nChoix }); }
        await page.evaluate(() => document.querySelector('#villePorte .v-choix').click()); await page.waitForTimeout(120); continue;
      }
      if (st.nSortir) {
        if (reponseVue !== st.sceneTexte) { reponseVue = st.sceneTexte; const s0 = S.scenes[S.scenes.length - 1]; if (s0) s0.reponse = st.sceneTexte.length; }
        await page.evaluate(() => { const b = [...document.querySelectorAll('#villePorte .v-sortir')].filter(e => e.offsetParent)[0]; if (b) b.click(); }); await page.waitForTimeout(120); continue;
      }
      await page.waitForTimeout(100); continue;
    }
    if (st.carte) {
      cat = 'carte';
      if (st.carteId !== carteVue) { carteVue = st.carteId; S.cartes.push(st.carteTexte.length); }
      await page.evaluate(() => { const b = document.querySelector('.controls .act.right') || document.querySelector('.controls .act'); if (b) b.click(); });
      await page.waitForTimeout(250); continue;
    }
    if (st.porte) { cat = 'porte'; await page.evaluate(() => { const b = document.querySelector('#villePorte .v-sortir:not(.v-y):not(.v-att)') || document.querySelector('#villePorte .v-sortir'); if (b) b.click(); }); await page.waitForTimeout(120); continue; }
    // en marche vers le rendez-vous : on ne reclique pas tant que le héros avance
    if (st.heros && st.heros !== herosAvant) { herosAvant = st.heros; immobile = 0; yAllerSuite = 0; if (cat === 'trajet') { await page.waitForTimeout(150); continue; } }
    else immobile++;
    herosAvant = st.heros;
    if (cat === 'trajet' && immobile < 3) { await page.waitForTimeout(150); continue; }
    // « Y aller » qui ne mène nulle part (un événement sombre ne s'annonce pas) : un joueur attend
    if (st.rdv && yAllerSuite < 2) { cat = 'trajet'; immobile = 0; yAllerSuite++; compte('y_aller'); await page.click('#villeRdv').catch(() => {}); await page.waitForTimeout(150); continue; }
    if (st.attendre) { cat = 'attente'; yAllerSuite = 0; compte('attendre'); await page.click('#villeAttendre').catch(() => {}); await page.waitForTimeout(150); continue; }
    cat = 'autre'; await page.waitForTimeout(150);
  }
  const res = { postulat: POST, fin, minutes: +((Date.now() - debut) / 60000).toFixed(1), erreurs: errs, saisons: saisons.map(s => ({ ...s, semaines: s.semaines.size })) };
  fs.writeFileSync(OUT, JSON.stringify(res));
  console.log(`livre ${POST + 1} : ${res.minutes} min réelles, fin ${fin}, ` + res.saisons.map(s => `S${s.saison} ${s.semaines} sem, ${s.cartes.length} cartes, ${s.scenes.length} scènes, ${s.lignes.length} répliques, ${s.matchs.length} matchs`).join(' | ') + (errs.length ? ' ERREURS ' + errs.slice(0, 3).join(' / ') : ''));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
