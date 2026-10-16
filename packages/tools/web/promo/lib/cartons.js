/* ═══════════════════════════════════════════════════════════════════════════
   LES CARTONS — tout ce qui s'écrit ou se compose : les légendes (PNG transparents),
   les cartons pleins (le titre, les livres, la fin : des images animées), les cadres
   de l'écran, les captures des boutiques, la bannière. Du HTML et du CSS rendus par
   Chromium, dans la palette du jeu (le brun, la crème, la couleur du livre) et ses
   polices (Jersey 15 pour les titres, Space Mono pour le texte).

   Une scène animée est du CSS (des @keyframes) : on la fige, puis on pose le temps de
   chaque image (document.getAnimations().currentTime) — la même image à chaque rendu.
   Les scènes elles-mêmes : scenes.js.
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const C = require('./commun');
const S = require('./scenes');

class Atelier {
  constructor() { this.nav = null; this.pages = {}; }
  async page(l, h) {
    if (!this.nav) this.nav = await C.navigateur();
    const k = l + 'x' + h;
    if (!this.pages[k]) {
      const ctx = await this.nav.newContext({ viewport: { width: l, height: h }, deviceScaleFactor: 1 });
      this.pages[k] = await ctx.newPage();
    }
    return this.pages[k];
  }
  async charger(html, l, h) {
    const p = await this.page(l, h);
    // la page sert d'une scène à l'autre, et setContent garde la fenêtre : la fonction du temps de la
    // scène d'avant (`window.__t`, les livres) ne doit pas jouer sur la suivante
    await p.evaluate(() => { window.__t = undefined; }).catch(() => {});
    await p.setContent(html, { waitUntil: 'load' });
    await p.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([].slice.call(document.images).map((i) => (i.decode ? i.decode().catch(() => {}) : null)));
      document.getAnimations().forEach((a) => a.pause());
    });
    return p;
  }
  // une image fixe (au temps t de la scène)
  async png(html, l, h, fichier, o) {
    o = o || {};
    const p = await this.charger(html, l, h);
    await poser(p, o.t || 0);
    await p.screenshot({ path: fichier, omitBackground: !!o.transparent, type: 'png' });
    return fichier;
  }
  // une scène animée → un plan (le mezzanine), d secondes à 30 i/s
  async sequence(html, l, h, d, fichier) {
    const p = await this.charger(html, l, h);
    const n = Math.round(d * 30);
    const ff = C.ffmpegFlux(['-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-',
      '-vf', 'scale=' + l + ':' + h + ':out_color_matrix=bt709:out_range=tv,setsar=1', '-r', '30'].concat(C.MEZZANINE,
      ['-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-frames:v', String(n), fichier]), path.basename(fichier));
    for (let i = 0; i < n; i++) {
      await poser(p, i / 30);
      await ff.ecrire(await p.screenshot({ type: 'jpeg', quality: 95 }));
    }
    await ff.fermer();
    return fichier;
  }
  async fermer() { if (this.nav) await this.nav.close(); this.nav = null; this.pages = {}; }
}
// le temps de la scène : les animations CSS, et la fonction de la scène (`window.__t`) s'il y en a une
function poser(p, t) {
  return p.evaluate((t) => {
    document.getAnimations().forEach((a) => { a.pause(); a.currentTime = t * 1000; });
    if (window.__t) window.__t(t);
  }, t);
}

// ─── les légendes d'un montage, dans un format : un PNG transparent par légende
async function legende(atelier, leg, fmt, accent, fichier) {
  const F = C.FORMATS[fmt];
  return atelier.png(S.legende(leg, fmt, F, accent), F.l, F.h, fichier, { transparent: true });
}

// ─── un carton plein : une scène animée de `d` secondes
async function carton(atelier, spec, fmt, d, contexte, fichier) {
  const F = C.FORMATS[fmt];
  const fabrique = S.cartons[spec.carton];
  if (!fabrique) throw new Error('carton inconnu : ' + spec.carton + ' (' + Object.keys(S.cartons).join(', ') + ')');
  const html = fabrique(spec, fmt, F, d, contexte);
  return atelier.sequence(html, F.l, F.h, d, fichier);
}

// ─── les pièces de l'écran (le mode « ecran ») : son masque aux coins ronds, son cadre et son ombre
async function cadreEcran(atelier, l, h, rayon, accent, dossier) {
  const masque = path.join(dossier, 'masque_' + l + 'x' + h + '_' + rayon + '.png');
  const cadre = path.join(dossier, 'cadre_' + l + 'x' + h + '_' + rayon + '_' + accent.replace('#', '') + '.png');
  const marge = 60;
  if (!fs.existsSync(masque)) await atelier.png(S.masqueEcran(l, h, rayon), l, h, masque);
  if (!fs.existsSync(cadre)) await atelier.png(S.cadreEcran(l, h, rayon, accent, marge), l + 2 * marge, h + 2 * marge, cadre, { transparent: true });
  return { masque, cadre, marge };
}

module.exports = { Atelier, legende, carton, cadreEcran };
