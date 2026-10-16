/* ═══════════════════════════════════════════════════════════════════════════
   LE TOURNAGE DU JEU — les « moments » d'une bande, capturés dans le vrai jeu.

   Le jeu tourne dans Chromium (Playwright), la page de la ville assemblée, servie
   en HTTP. Un moment a deux temps :
     · `prepare`  : le temps réel (l'horloge de la page court) ; on y amène le jeu
                    où il faut : un livre lancé, une introduction passée, une semaine
                    jouée par l'automate (`jouerJusqua`) ;
     · `tournage` : le temps virtuel. L'horloge de la page est arrêtée (page.clock) et
                    avance d'un trentième de seconde par image (33, 33, 34 ms) ; les
                    animations CSS (document.getAnimations) avancent du même pas. Chaque
                    image est capturée, puis encodée : 30 images par seconde régulières,
                    quelle que soit la charge de la machine (mesuré ici, quatre cœurs
                    partagés : de 130 à 290 ms par image capturée et encodée à 1080 × 1920,
                    soit 4 à 9 fois le temps réel ; la capture en direct, CDP screencast,
                    y donnait 50 i/s en moyenne mais des trous de 250 ms).
   Ce qui sort, par moment et par profil (la fenêtre du téléphone, commun.js PROFILS) :
     <id>.<profil>.mp4   le plan, presque sans perte (le mezzanine)
     <id>.<profil>.json  sa durée, ses poses, l'empreinte du moment (pour ne pas le refaire)
     <id>.<profil>.<pose>.png  les images fixes demandées (`['pose', nom]`)

   Le vocabulaire des étapes (une étape : [nom, ...arguments]) est dans ACTIONS, plus bas.
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const C = require('./commun');

// ─── ce que la page reçoit avant tout script : le profil du joueur, la mémoire voulue, et
// l'outil du tournage (les animations au pas, le doigt qui touche)
function scriptInitial(arg) {
  try {
    if (arg && arg.stockage) Object.keys(arg.stockage).forEach(function (k) {
      var v = arg.stockage[k];
      localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
    });
  } catch (e) {}
  window.__promo = (function () {
    var suivies = new Map(), actif = false;
    // les animations CSS (et les transitions) avancent au pas du temps virtuel : chacune est
    // mise en pause, puis avancée de dt ; une neuve part de zéro ; une finie est « finie » (ses
    // événements partent : le jeu en attend parfois la fin)
    function pas(dt) {
      if (!actif) return 0;
      var liste = document.getAnimations();
      for (var i = 0; i < liste.length; i++) {
        var a = liste[i];
        if (!suivies.has(a)) {
          if (a.playState !== 'running') continue;
          a.pause();
          if (a.currentTime != null && a.currentTime < 80) a.currentTime = 0;
          suivies.set(a, { t: a.currentTime || 0 });
          continue;
        }
        var s = suivies.get(a);
        if (a.playState !== 'paused') { suivies.delete(a); continue; }
        s.t += dt;
        var ct = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : null;
        var fin = ct && isFinite(ct.endTime) ? ct.endTime : Infinity;
        if (s.t >= fin) { try { a.finish(); } catch (e) { a.currentTime = fin; } suivies.delete(a); }
        else a.currentTime = s.t;
      }
      return liste.length;
    }
    function figer(on) {
      actif = !!on;
      if (!actif) { suivies.forEach(function (s, a) { try { a.play(); } catch (e) {} }); suivies.clear(); }
    }
    // le doigt : un rond crème, à la place du toucher (pas de main à l'écran)
    var doigtEl = null;
    function doigt(x, y, alpha, echelle) {
      if (!doigtEl) {
        doigtEl = document.createElement('div');
        doigtEl.id = 'promoDoigt';
        doigtEl.style.cssText = 'position:fixed;left:0;top:0;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;' +
          'background:radial-gradient(circle,rgba(246,233,207,.55) 0,rgba(246,233,207,.32) 55%,rgba(246,233,207,0) 72%);' +
          'box-shadow:0 0 0 2px rgba(246,233,207,.85),0 0 18px rgba(0,0,0,.45);pointer-events:none;z-index:2147483647;opacity:0;will-change:transform';
        document.body.appendChild(doigtEl);
      }
      doigtEl.style.opacity = String(alpha);
      doigtEl.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + (echelle || 1) + ')';
    }
    // cacher ce qui ne doit pas se voir (un bandeau d'essai, une bulle d'aide)
    function cacher(sel) {
      var st = document.getElementById('promoCacher');
      if (!st) { st = document.createElement('style'); st.id = 'promoCacher'; document.head.appendChild(st); }
      st.textContent += sel + '{visibility:hidden!important}';
    }
    function rect(sel) {
      var e = typeof sel === 'string' ? document.querySelector(sel) : sel;
      if (!e) return null;
      var r = e.getBoundingClientRect();
      return { x: r.left, y: r.top, l: r.width, h: r.height, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
    }
    return { pas: pas, figer: figer, doigt: doigt, cacher: cacher, rect: rect };
  })();
}

// ─── l'état du jeu, d'un coup d'œil (l'automate et les attentes s'en servent)
function etatJeu() {
  var $ = function (s) { return document.querySelector(s); };
  var vis = function (e) { return !!e && !e.hidden && e.offsetParent !== null; };
  var V = window.FusibleVille, Q = window.FusibleCoquille;
  var d = V && V._debug ? V._debug() : null, v = Q && Q.vue ? Q.vue() : null, m = V && V.moment ? V.moment() : null;
  var Cn = $('#villeCine'), B = Cn && Cn.querySelector('.v-cine-boite'), T = Cn && Cn.querySelector('.v-cine-titre');
  var P = $('#villePorte');
  var choix = P ? [].slice.call(P.querySelectorAll('.v-choix')).filter(vis) : [];
  var panneau = $('#frisePanel') && !$('#frisePanel').hidden ? '#btnFriseClose' : $('#panel') && !$('#panel').hidden ? ($('#panel .v-ch-go') ? '#panel .v-ch-go' : '#btnPanelClose') :
    $('#standingsFull') && !$('#standingsFull').hidden ? '#btnFullClose' : null;
  var e = V && V._essai ? V._essai('rien') : null;
  return {
    accueil: vis($('#titleScreen')), jeu: vis($('#gameScreen')), fin: vis($('#endingScreen')),
    over: !!(v && v.over), carte: !!($('#gameScreen') && $('#gameScreen').classList.contains('carte-on')),
    carteId: v && v.card ? v.card.id : null, beat: v && v.card ? v.card.beatKind : null, saison: v ? v.season : 0, an: v ? v.year : 0,
    cine: !!(Cn && !Cn.hidden), boiteFinie: !!(B && !B.hidden && B.classList.contains('fini')), titre: !!(T && !T.hidden),
    fondu: !!($('#villeFondu') && $('#villeFondu').classList.contains('on')),
    match: e && e.match ? e.match.phase : null, direct: !!($('#villeDirect') && !$('#villeDirect').hidden), quitter: vis($('.v-match-quitter')),
    porte: !!(P && P.classList.contains('on')), scene: !!(P && P.classList.contains('v-scene') && P.classList.contains('on')), nChoix: choix.length,
    panneau: panneau, rdv: vis($('#villeRdv')), attendre: vis($('#villeAttendre')) && !$('#villeAttendre').disabled,
    dedans: d && d.dedans ? d.dedans.cle : null, occupe: d ? d.occupe : null, jour: m ? m.jour : null, nuit: m ? m.nuit : null,
    lieu: e ? e.lieu : null, eclair: !!(window.FusibleEclair && window.FusibleEclair.partie && window.FusibleEclair.partie()),
    film: !!document.querySelector('.fc-film')
  };
}

// une condition de la configuration (du JS), lue dans la page : `etat` (etatJeu) et `window`
function condition(page, cond) {
  return page.evaluate(([src, cond]) => {
    const etat = (0, eval)('(' + src + ')')();
    try { return !!(new Function('etat', 'return (' + cond + ');'))(etat); } catch (e) { return false; }
  }, [etatJeu.toString(), cond]);
}

// ─── l'enregistreur : une image = l'horloge avance d'un pas, les animations aussi, on capture
class Enregistreur {
  constructor(page, o) {
    this.page = page; this.o = o; this.n = 0; this.poses = {};
    this.ff = null;
    if (o.fichier) {
      const L = o.l, H = o.h;
      this.ff = C.ffmpegFlux(['-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-',
        // jamais d'agrandissement : on rogne la ligne de trop, ou l'on complète (le pixel reste un pixel)
        '-vf', 'crop=min(iw\\,' + L + '):min(ih\\,' + H + '):0:0,pad=' + L + ':' + H + ':0:0:color=black,setsar=1',
        '-r', '30'].concat(C.MEZZANINE, [o.fichier]), path.basename(o.fichier));
    }
  }
  get t() { return this.n / 30; }
  async image(parImage) {
    const dt = this.n % 3 === 2 ? 34 : 33;
    if (parImage) await parImage();
    await this.page.clock.runFor(dt);
    await this.page.evaluate((d) => window.__promo.pas(d), dt);
    if (this.ff) {
      const buf = await this.page.screenshot({ type: 'jpeg', quality: 94 });
      await this.ff.ecrire(buf);
    }
    this.n++;
  }
  // enregistrer s secondes ; parImage(i, n) est appelé avant chaque image (un geste en cours)
  async pendant(s, parImage) {
    const n = Math.max(0, Math.round(s * 30));
    for (let i = 0; i < n; i++) await this.image(parImage ? () => parImage(i, n) : null);
  }
  async pose(nom, selecteur) {
    const f = this.o.base + '.' + nom + '.png';
    if (selecteur) {
      const el = await this.page.$(selecteur);
      if (!el) throw new Error('pose : rien sous ' + selecteur);
      await el.screenshot({ path: f, type: 'png' });
    } else await this.page.screenshot({ path: f, type: 'png' });
    this.poses[nom] = { t: +this.t.toFixed(3), fichier: f };
  }
  async fermer() { if (this.ff) await this.ff.fermer(); }
}

// ─── les aisances (les gestes du doigt, les défilements)
const lisse = (x) => x * x * (3 - 2 * x);
const sortie = (x) => 1 - Math.pow(1 - x, 3);

// ─── le vocabulaire des étapes. `c` : { page, mode: 'prepare'|'tournage', rec, m, journal }
const ACTIONS = {
  // ── le temps
  async attendre(c, s) { if (c.mode === 'prepare') await c.page.waitForTimeout(s * 1000); else await c.rec.pendant(s); },
  // attendre une condition (JS) : en préparation, en temps réel ; au tournage, en images
  async attendreQue(c, cond, max) {
    max = max || 30;
    const vrai = () => condition(c.page, cond);
    if (c.mode === 'prepare') {
      const t0 = Date.now();
      while (!(await vrai())) { if (Date.now() - t0 > max * 1000) throw new Error('attendreQue : jamais vrai en ' + max + ' s : ' + cond); await c.page.waitForTimeout(150); }
    } else {
      let n = 0;
      while (!(await vrai())) { if (n++ > max * 30) throw new Error('attendreQue (tournage) : jamais vrai en ' + max + ' s : ' + cond); await c.rec.image(); }
    }
  },
  // ── la page
  async eval(c, js) { return c.page.evaluate(js); },
  async cacher(c, sel) { await c.page.evaluate((s) => window.__promo.cacher(s), sel); },
  async pose(c, nom) { if (c.rec) await c.rec.pose(nom); },
  // l'image d'un élément seul (une cartouche de l'accueil), à sa taille en pixels
  async poseElement(c, sel, nom) { if (c.rec) await c.rec.pose(nom, sel); },
  // toucher un élément (au tournage : le doigt s'y pose, puis le clic)
  async cliquer(c, sel, o) {
    o = o || {};
    if (c.mode === 'prepare' || o.sansDoigt) {
      const ok = await c.page.evaluate((s) => { const e = document.querySelector(s); if (!e) return false; e.click(); return true; }, sel);
      if (!ok && !o.facultatif) throw new Error('cliquer : rien sous ' + sel);
      return;
    }
    const r = await c.page.evaluate((s) => window.__promo.rect(s), sel);
    if (!r) { if (o.facultatif) return; throw new Error('cliquer : rien sous ' + sel); }
    await toucherPoint(c, r.cx + (o.dx || 0), r.cy + (o.dy || 0), o);
  },
  // toucher un point de l'écran (en points CSS, ou en fraction de la fenêtre si ≤ 1)
  async toucher(c, x, y, o) {
    const vp = c.page.viewportSize();
    if (x <= 1) x *= vp.width;
    if (y <= 1) y *= vp.height;
    if (c.mode === 'prepare') { await c.page.mouse.click(x, y); return; }
    await toucherPoint(c, x, y, o || {});
  },
  // ── l'accueil
  async accueil(c) {
    await c.page.waitForFunction(() => document.querySelectorAll('#postulats .postulat').length > 0, null, { timeout: 120000 });
  },
  // défiler jusqu'à un élément (son haut à `marge` points du haut) ou jusqu'à y, en s secondes
  async defiler(c, cible, o) {
    o = o || {};
    const y1 = await c.page.evaluate(([cible, marge]) => {
      if (typeof cible === 'number') return cible;
      const e = document.querySelector(cible);
      if (!e) return null;
      return Math.max(0, e.getBoundingClientRect().top + window.scrollY - (marge || 0));
    }, [cible, o.marge || 0]);
    if (y1 == null) throw new Error('defiler : rien sous ' + cible);
    if (c.mode === 'prepare' || !o.duree) { await c.page.evaluate((y) => window.scrollTo(0, y), y1); return; }
    const y0 = await c.page.evaluate(() => window.scrollY);
    await c.rec.pendant(o.duree, (i, n) => c.page.evaluate((y) => window.scrollTo(0, y), y0 + (y1 - y0) * (o.aisance === 'lin' ? (i + 1) / n : lisse((i + 1) / n))));
  },
  // ── un livre
  async demarrer(c, livre, graine) {
    await c.page.evaluate(([l, g]) => { window.__promoDepart = false; window.FusibleApercu.demarrer(l, g).then(() => { window.__promoDepart = true; }); }, [livre, graine == null ? 4242 : graine]);
    if (c.mode === 'prepare') await c.page.waitForFunction(() => window.__promoDepart === true, null, { timeout: 120000 });
    else await ACTIONS.attendreQue(c, 'window.__promoDepart === true', 60);
  },
  async introPasser(c) {
    for (let i = 0; i < 60; i++) {
      const e = await c.page.evaluate(etatJeu);
      if (!e.cine) break;
      await c.page.evaluate(() => { const b = document.querySelector('.v-cine-passer'); if (b) b.click(); });
      if (c.mode === 'prepare') await c.page.waitForTimeout(400); else await c.rec.pendant(0.4);
    }
  },
  // avancer une scène jouée comme un lecteur : on touche quand la boîte a fini d'écrire, après
  // le temps de la lire (~18 signes par seconde) ; `max` répliques au plus
  async scene(c, max, o) {
    o = o || {};
    for (let k = 0; k < (max || 99); k++) {
      let e = await c.page.evaluate(etatJeu), n = 0;
      if (!e.cine) return;
      while (!e.boiteFinie && !e.titre && e.cine && n++ < 400) { if (c.mode === 'prepare') await c.page.waitForTimeout(120); else await c.rec.image(); e = await c.page.evaluate(etatJeu); }
      if (!e.cine) return;
      const lu = await c.page.evaluate(() => { const b = document.querySelector('#villeCine .v-cine-boite p'); return b ? b.textContent.length : 30; });
      const s = Math.min(o.lectureMax || 3.2, Math.max(o.lectureMin || 1.2, lu / (o.vitesse || 22)));
      if (c.mode === 'prepare') await c.page.waitForTimeout(s * 1000); else await c.rec.pendant(s);
      await c.page.evaluate(() => { const v = window.innerWidth / 2, h = window.innerHeight * 0.45; const el = document.elementFromPoint(v, h); if (el) el.click(); });
      if (c.mode === 'prepare') await c.page.waitForTimeout(300); else await c.rec.pendant(0.15);
    }
  },
  async attendreCarte(c, max) { await ACTIONS.attendreQue(c, 'etat.carte', max || 40); },
  // glisser la carte : le doigt se pose au centre, tire de `ampleur` × la largeur, lâche (ou non)
  async glisser(c, sens, o) {
    o = Object.assign({ duree: 0.75, ampleur: 0.5, tenue: 0.35, lacher: true, approche: 0.25 }, o || {});
    const droite = sens !== 'gauche';
    if (c.mode === 'prepare') { await ACTIONS.repondre(c, sens); return; }
    const r = await c.page.evaluate(() => window.__promo.rect('#card'));
    if (!r) throw new Error('glisser : pas de carte');
    const x0 = r.cx, y0 = r.cy + r.h * 0.12, dx = (droite ? 1 : -1) * r.l * o.ampleur, dy = r.h * 0.03;
    const doigt = (x, y, a, s) => c.page.evaluate(([x, y, a, s]) => window.__promo.doigt(x, y, a, s), [x, y, a, s]);
    // le doigt arrive
    await c.rec.pendant(o.approche, (i, n) => doigt(x0, y0, sortie((i + 1) / n), 1.25 - 0.25 * sortie((i + 1) / n)));
    await c.page.mouse.move(x0, y0);
    await c.page.mouse.down();
    await c.rec.pendant(0.08, () => doigt(x0, y0, 1, 0.9));
    // il tire
    await c.rec.pendant(o.duree, async (i, n) => {
      const k = lisse((i + 1) / n), x = x0 + dx * k, y = y0 + dy * Math.sin(k * Math.PI / 2);
      await c.page.mouse.move(x, y);
      await doigt(x, y, 1, 0.9);
    });
    await c.rec.pendant(o.tenue / 2, () => doigt(x0 + dx, y0 + dy, 1, 0.9));
    if (o.pose) await c.rec.pose(o.pose);
    await c.rec.pendant(o.tenue / 2, () => doigt(x0 + dx, y0 + dy, 1, 0.9));
    if (!o.lacher) {
      // il revient : la carte se remet en place (une hésitation)
      await c.rec.pendant(o.duree * 0.8, async (i, n) => { const k = lisse((i + 1) / n), x = x0 + dx * (1 - k), y = y0 + dy * (1 - k); await c.page.mouse.move(x, y); await doigt(x, y, 1, 0.9); });
      await c.page.mouse.up();
      await c.rec.pendant(0.2, (i, n) => doigt(x0, y0, 1 - (i + 1) / n, 1));
      return;
    }
    await c.page.mouse.up();
    await c.rec.pendant(0.25, (i, n) => doigt(x0 + dx * (1 + 0.15 * (i + 1) / n), y0 + dy, 1 - (i + 1) / n, 0.9 + 0.3 * (i + 1) / n));
  },
  // répondre sans geste (le bouton de gauche ou de droite)
  async repondre(c, sens) {
    await c.page.evaluate((droite) => { const bs = document.querySelectorAll('.controls .act'); const b = bs[droite ? bs.length - 1 : 0]; if (b) b.click(); }, sens !== 'gauche');
  },
  // ── la ville (FusibleVille._essai : les crochets d'essai de ville.js)
  async sortir(c) { await c.page.evaluate(() => { const b = document.querySelector('#villeSortir'); if (b && b.offsetParent) b.click(); }); },
  async allerLieu(c, cle) { await c.page.evaluate((k) => window.FusibleVille._essai('allerLieu', k), cle); },
  async aller(c, cle) { await c.page.evaluate((k) => window.FusibleVille._essai('aller', k), cle); },
  async zoom(c, z) {
    await c.page.evaluate((z) => { const d = window.FusibleVille._debug(); const k = d.ui[4]; if (z !== k) window.FusibleVille._essai('zoom', z - k); }, z);
  },
  async tranche(c, t) { await c.page.evaluate((t) => window.FusibleVille._essai('tranche', t), t); },
  async jour(c, j) { await c.page.evaluate((j) => window.FusibleVille._essai('jour', j), j); },
  async semaine(c, s) { await c.page.evaluate((s) => window.FusibleVille._essai('semaine', s), s); },
  async parler(c, qui) { await c.page.evaluate((q) => window.FusibleVille._essai('parler', q), qui); },
  async match(c, resultats) { await c.page.evaluate((r) => window.FusibleVille._essai('match', r || 'V N V D V V'), resultats); },
  // marcher : toucher la ville à (dx, dy) points du héros (le héros est au centre de la vue)
  async marcher(c, dx, dy) {
    const vp = c.page.viewportSize();
    const pt = await c.page.evaluate(() => { const h = document.querySelector('#villeCanvas'); const r = h ? h.getBoundingClientRect() : null; return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null; });
    const x = (pt ? pt.x : vp.width / 2) + dx, y = (pt ? pt.y : vp.height / 2) + dy;
    if (c.mode === 'prepare') await c.page.mouse.click(x, y); else await toucherPoint(c, x, y, {});
  },
  // marcher au clavier : chaque flèche envoie le héros six cases plus loin (ville.js), sans ouvrir
  // aucun lieu ; `n` appuis, un toutes les `intervalle` secondes
  async touche(c, cle, n, intervalle) {
    n = n || 1; intervalle = intervalle || 0.45;
    for (let i = 0; i < n; i++) {
      await c.page.keyboard.press(cle);
      if (c.mode === 'prepare') await c.page.waitForTimeout(intervalle * 1000); else await c.rec.pendant(intervalle);
    }
  },
  // toucher le passant le plus proche du milieu de l'écran : il s'arrête et dit sa réplique
  async toucherPassant(c, o) {
    o = o || {};
    const r = await c.page.evaluate((o) => {
      const V = window.FusibleVille, d = V._debug();
      const h = d.heros;
      const gens = d.gens.filter((g) => g.ecran && !g.loin && g.a > 0.9 && (o.qui ? g.t.indexOf(o.qui) >= 0 : (g.t === 'p' || g.t.indexOf('a:') === 0 || g.t.indexOf('f:') === 0)));
      gens.sort((a, b) => Math.hypot(a.x - h[0], a.y - h[1]) - Math.hypot(b.x - h[0], b.y - h[1]));
      for (const g of gens) { if (V._toucher(g.uid)) return { uid: g.uid, t: g.t, bulle: V._debug().bulle }; }
      return null;
    }, o);
    if (!r && !o.facultatif) throw new Error('toucherPassant : personne à l\'écran');
    return r;
  },
  // un film du cinéma (cinema/lecteur.js) passe par-dessus : « Passer »
  async filmPasser(c) {
    for (let i = 0; i < 20; i++) {
      const on = await c.page.evaluate(() => { const f = document.querySelector('.fc-film'); if (!f) return false; const b = f.querySelector('.fc-passer'); if (b) b.click(); return true; });
      if (!on) return;
      if (c.mode === 'prepare') await c.page.waitForTimeout(500); else await c.rec.pendant(0.3);
    }
  },
  // refermer le panneau d'un lieu (on reste devant sa porte, ou dans sa pièce)
  async fermerPorte(c) {
    await c.page.evaluate(() => { const b = document.querySelector('#villePorte.on .v-sortir:not(.v-y):not(.v-att)'); if (b && b.offsetParent) b.click(); });
  },
  async chapitre(c) { await c.page.evaluate(() => window.FusibleVilleChapitres && window.FusibleVilleChapitres.ouvrir()); },
  async carnet(c) { await ACTIONS.cliquer(c, '#villeBiens'); },
  async fermer(c) { await c.page.evaluate(() => { window.FusibleApercu.fermer(); }); },
  // ── avancer le moteur seul (fusibleChoose), carte après carte, jusqu'à ce que la condition sur
  // la vue `v` soit vraie (`v.card.beatKind === 'match'`, `v.card.id.indexOf('en.h1.a5') === 0`…), puis
  // la coquille et la ville reprennent cet état (comme une partie sauvée). `reponses` : droite,
  // gauche, alterne, ou une liste ; `saute` : passer les n premières cartes qui vérifient la condition ;
  // `gestes` : les activités de la ville faites avant chaque carte (une liste par carte, tour à tour :
  // le café chez Marcel, les mots croisés de Simone…) — le lien, l'habitude, comme un joueur qui
  // fréquente la ville (Engine.activite) ; la condition voit `g`, le nombre de cartes jouées.
  async avancer(c, cond, o) {
    o = Object.assign({ reponses: 'droite', saute: 0, max: 600, gestes: null }, o || {});
    const r = await c.page.evaluate(([cond, o]) => {
      const f = new Function('v', 'g', 'return (' + cond + ');');
      let v = window.FusibleCoquille.vue(), g = 0, saute = o.saute, gestes = 0;
      const vues = [];
      while (!v.over && g < o.max) {
        if (f(v, g)) { if (saute <= 0) break; saute--; }
        if (o.gestes && o.gestes.length) {
          for (const id of o.gestes[g % o.gestes.length] || []) { const w = JSON.parse(window.fusibleActivite(id, true)); if (!w.over) { v = w; gestes++; } }
        }
        const lr = Array.isArray(o.reponses) ? o.reponses[g % o.reponses.length] : o.reponses;
        const droite = v.card.single ? true : lr === 'gauche' ? false : lr === 'alterne' ? g % 2 === 0 : true;
        vues.push(v.card.id);
        v = JSON.parse(window.fusibleChoose(droite));
        g++;
      }
      const gr = window.FusibleCoquille.graine();
      window.FusibleCoquille.reprendre(window.fusibleEtat(), gr.postulat, gr.seed);
      return { carte: v.card && v.card.id, beat: v.card && v.card.beatKind, over: v.over, n: g, gestes, saison: v.season, annee: v.year, vues: vues.slice(-12) };
    }, [cond, o]);
    if (r.over) throw new Error('avancer : la carrière a fini avant « ' + cond + ' »');
    if (c.journal !== false) C.journal('  avancé de ' + r.n + ' cartes' + (r.gestes ? ' (' + r.gestes + ' gestes en ville)' : '') + ' → ' + r.carte + ' (' + r.beat + ', saison ' + r.saison + ', ' + r.annee + ')');
    await c.page.waitForTimeout(1200);
    return r;
  },
  // ── l'automate : jouer (temps réel) jusqu'à ce que la condition soit vraie
  async jouerJusqua(c, cond, o) {
    o = Object.assign({ max: 240, reponses: 'droite', match: 'passer' }, o || {});
    if (c.mode !== 'prepare') throw new Error('jouerJusqua se fait en préparation');
    const t0 = Date.now();
    let n = 0;
    for (;;) {
      const e = await c.page.evaluate(etatJeu);
      // un film du cinéma passe d'abord (la carte attend dessous) : on le passe, sauf demande
      if (e.film && !o.films) { await ACTIONS.filmPasser(c); continue; }
      if (await condition(c.page, cond)) return;
      if (e.over) throw new Error('jouerJusqua : la carrière a fini avant « ' + cond + ' »');
      if (Date.now() - t0 > o.max * 1000) throw new Error('jouerJusqua : rien en ' + o.max + ' s : ' + cond + ' (dernier état ' + JSON.stringify(e) + ')');
      n++;
      if (e.panneau) { await c.page.evaluate((s) => { const b = document.querySelector(s); if (b) b.click(); }, e.panneau); await c.page.waitForTimeout(250); continue; }
      if (e.cine) { await c.page.evaluate(() => { const b = document.querySelector('.v-cine-passer'); if (b) b.click(); }); await c.page.waitForTimeout(300); continue; }
      if (e.fondu) { await c.page.waitForTimeout(150); continue; }
      if (e.direct) { await c.page.evaluate(() => { const b = document.querySelector('#villeDirect .v-direct-g[data-cote="d"]'); if (b) b.click(); }); await c.page.waitForTimeout(300); continue; }
      if (e.match) {
        if (e.quitter) await c.page.evaluate(() => { const b = document.querySelector('.v-match-quitter'); if (b) b.click(); });
        else if (o.match === 'passer') await c.page.evaluate(() => { const b = document.querySelector('.v-match-passer'); if (b && b.offsetParent) b.click(); });
        await c.page.waitForTimeout(300); continue;
      }
      if (e.scene && e.nChoix) { await c.page.evaluate(() => { const b = [].slice.call(document.querySelectorAll('#villePorte .v-choix')).filter((x) => x.offsetParent && !x.disabled)[0]; if (b) b.click(); }); await c.page.waitForTimeout(250); continue; }
      if (e.carte) {
        const droite = o.reponses === 'gauche' ? false : o.reponses === 'alterne' ? n % 2 === 0 : true;
        await ACTIONS.repondre(c, droite ? 'droite' : 'gauche');
        await c.page.waitForTimeout(350); continue;
      }
      if (e.porte) { await c.page.evaluate(() => { const b = document.querySelector('#villePorte .v-sortir:not(.v-y):not(.v-att)') || document.querySelector('#villePorte .v-sortir'); if (b) b.click(); }); await c.page.waitForTimeout(200); continue; }
      if (e.rdv) { await c.page.evaluate(() => { const b = document.querySelector('#villeRdv'); if (b) b.click(); }); await c.page.waitForTimeout(500); if (n % 6 !== 5) continue; }
      if (e.attendre) { await c.page.evaluate(() => { const b = document.querySelector('#villeAttendre'); if (b) b.click(); }); await c.page.waitForTimeout(350); continue; }
      await c.page.waitForTimeout(250);
    }
  },
  // ── les modules de l'accueil
  async album(c) { await ACTIONS.cliquer(c, '#btnAlbum'); },
  async dossier(c) { await ACTIONS.cliquer(c, '#dossierAccueil [data-dos="dossier"]'); },
  async carrieres(c) { await ACTIONS.cliquer(c, '#dossierAccueil [data-dos="carrieres"]'); },
  // le Fusible : la carte de l'accueil, puis « Commencer »
  async eclair(c, mode) {
    await c.page.evaluate((m) => { const b = document.querySelector('.fz-go[data-a="' + (m || 'jour') + '"], .fz-ot[data-a="' + (m || 'jour') + '"]'); if (b) b.click(); }, mode);
    // (au tournage, l'horloge ne court qu'au pas des images : on attend en images)
    await ACTIONS.attendreQue(c, '!!document.querySelector("#fzBrief .fz-go")', 60);
  },
};

// un toucher au tournage : le doigt arrive, presse, le clic part, le doigt s'efface
async function toucherPoint(c, x, y, o) {
  const doigt = (a, s) => c.page.evaluate(([x, y, a, s]) => window.__promo.doigt(x, y, a, s), [x, y, a, s]);
  await c.rec.pendant(o.approche == null ? 0.25 : o.approche, (i, n) => doigt(sortie((i + 1) / n), 1.25 - 0.3 * sortie((i + 1) / n)));
  await c.page.mouse.click(x, y);
  await c.rec.pendant(0.25, (i, n) => doigt(1 - (i + 1) / n, 0.95 + 0.25 * (i + 1) / n));
}

async function executer(c, etape) {
  const [nom, ...args] = etape;
  const f = ACTIONS[nom];
  if (!f) throw new Error('étape inconnue : ' + nom + ' (' + Object.keys(ACTIONS).join(', ') + ')');
  return f(c, ...args);
}

// ─── un moment, dans un profil
async function unMoment(nav, url, m, profil, base, o) {
  const P = C.PROFILS[profil];
  if (!P) throw new Error('profil inconnu : ' + profil);
  const ctx = await nav.newContext({ viewport: { width: P.largeur, height: P.hauteur }, deviceScaleFactor: P.dsf, isMobile: true, hasTouch: true,
    locale: 'fr-FR', serviceWorkers: 'block', reducedMotion: 'no-preference' });
  const heros = Object.assign({ prenom: 'Marc', nom: 'Delorme', genre: 'm' }, m.heros || {});
  const profilJeu = Object.assign({ name: heros, son: 'muet', runs: 1, directVu: 1 }, m.profil || {});
  const stockage = Object.assign({ 'fusible.preview.v3': profilJeu }, m.stockage || {});
  await ctx.addInitScript(scriptInitial, { stockage });
  await ctx.clock.install({ time: new Date(m.date || ('2026-10-16T' + (m.heure || '19:40') + ':00')) });
  const page = await ctx.newPage();
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(e.message));
  const c = { page, mode: 'prepare', rec: null, m };
  const t0 = Date.now();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 180000 });
    await ACTIONS.accueil(c);
    await page.waitForTimeout(600);
    for (const e of m.prepare || []) await executer(c, e);
    // le temps s'arrête : l'horloge de la page n'avance plus qu'au pas des images
    // (pauseAt ne revient pas en arrière : on vise un peu plus loin que « maintenant », la machine est lente)
    for (let marge = 400; ; marge *= 2) {
      const maintenant = await page.evaluate(() => Date.now());
      try { await page.clock.pauseAt(maintenant + marge); break; } catch (e) { if (marge > 20000 || !/past/.test(e.message)) throw e; }
    }
    await page.evaluate(() => window.__promo.figer(true));
    const enregistrer = o.poses ? null : base + '.mp4';
    c.mode = 'tournage';
    c.rec = new Enregistreur(page, { fichier: enregistrer, base, l: P.l, h: P.h });
    for (const e of m.tournage || []) await executer(c, e);
    await c.rec.fermer();
    if (erreurs.length) C.journal('  (la page : ' + erreurs.slice(0, 3).join(' | ') + ')');
    return { images: c.rec.n, duree: +(c.rec.n / 30).toFixed(3), poses: c.rec.poses, ms: Date.now() - t0, erreurs };
  } finally {
    await ctx.close().catch(() => {});
  }
}

// ─── tous les moments d'une configuration (ou ceux qu'on demande), dans les profils demandés
async function tourner(cfg, o) {
  const d = C.dossiers(o);
  const dossier = C.assurer(path.join(d.travail, cfg.id, 'clips'));
  const index = path.join(d.site, 'index.html');
  if (!o.url && !fs.existsSync(index)) throw new Error('pas de site assemblé dans ' + d.site + ' : `promo.js site` d\'abord');
  const ids = o.moments ? String(o.moments).split(',') : null;
  const profils = o.profils ? String(o.profils).split(',') : null;
  const travaux = [];
  for (const m of cfg.moments || []) {
    if (ids && ids.indexOf(m.id) < 0) continue;
    for (const p of m.profils || ['social']) {
      if (profils && profils.indexOf(p) < 0) continue;
      travaux.push({ m, p });
    }
  }
  if (!travaux.length) { C.journal('tournage : rien à tourner'); return {}; }
  const srv = o.url ? null : await C.serveur(d.site, +o.port || 0);
  const url = o.url || ('http://127.0.0.1:' + srv.address().port + '/index.html');
  let nav = await C.navigateur();
  const bilan = {};
  try {
    for (const { m, p } of travaux) {
      const base = path.join(dossier, m.id + '.' + p);
      // les profils des boutiques ne donnent que des images fixes (les captures d'écran)
      const posesSeules = p === 'apple' || p === 'google' || !!m.posesSeules || !!o.poses;
      const cle = C.empreinte({ prepare: m.prepare, tournage: m.tournage, heure: m.heure, date: m.date, heros: m.heros, profil: m.profil, stockage: m.stockage, p, v: 3 });
      const fj = base + '.json';
      if (!o.force && fs.existsSync(fj)) {
        const vieux = JSON.parse(fs.readFileSync(fj, 'utf8'));
        // (un tournage d'images fixes seules, --poses, ne vaut pas pour la vidéo)
        if (vieux.cle === cle && (posesSeules || (!vieux.posesSeules && fs.existsSync(base + '.mp4')))) { bilan[m.id + '.' + p] = vieux; C.journal('  ' + m.id + ' (' + p + ') : déjà tourné'); continue; }
      }
      C.journal('tournage : ' + m.id + ' (' + p + (posesSeules ? ', images fixes' : '') + ')…');
      let r = null, essai = 0;
      while (!r) {
        try { r = await unMoment(nav, url, m, p, base, { poses: posesSeules }); } catch (e) {
          essai++;
          C.journal('  échec (' + essai + ') : ' + String(e.message).split('\n')[0]);
          if (essai >= (+o.essais || 2)) throw e;
          // une page qui plante (la mémoire, une machine chargée) : un navigateur neuf
          await nav.close().catch(() => {});
          nav = await C.navigateur();
        }
      }
      const res = Object.assign({ id: m.id, profil: p, cle, posesSeules, l: C.PROFILS[p].l, h: C.PROFILS[p].h, fichier: posesSeules ? null : base + '.mp4' }, r);
      fs.writeFileSync(fj, JSON.stringify(res, null, 1));
      bilan[m.id + '.' + p] = res;
      C.journal('  → ' + res.duree + ' s, ' + res.images + ' images, ' + Object.keys(res.poses).length + ' pose(s), ' + C.hms(res.ms / 1000) + (res.images ? ' (' + Math.round(res.ms / Math.max(1, res.images)) + ' ms l\'image)' : ''));
    }
  } finally {
    await nav.close().catch(() => {});
    if (srv) srv.close();
  }
  return bilan;
}

module.exports = { tourner, ACTIONS, etatJeu };
