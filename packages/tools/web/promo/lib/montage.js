/* ═══════════════════════════════════════════════════════════════════════════
   LE MONTAGE — une bande, dans chacun de ses formats.

   Le temps est celui de la musique : un plan dure des mesures (« 2m »), des temps
   (« 3t ») ou des secondes ; les coupes tombent donc sur la barre de mesure. Chaque
   plan est rendu à part (un mezzanine presque sans perte, à la taille du format) :
   sa source cadrée, sa légende, ses fondus ; puis la chaîne des plans (coupes et
   fondus enchaînés) va droit à l'encodeur de livraison, avec la musique.

   Un plan :
     { duree: '2m',
       source: { moment: 'carte_photo', de: 0.4, vitesse: 1 }      // un moment tourné (tournage.js)
             | { film: 'film', de: 12.5 }                          // un extrait de film (bande.films)
             | { carton: 'titre'|'livres'|'fin'|'image', … }       // un carton (scenes.js)
             | { noir: true },
       cadre: { '9x16': 'plein', '16x9': { mode: 'ecran', x: -0.4 }, '4x5': { mode: 'plein', y: 0.3 } },
       legende: { titre, sous, position, style, de, a },          // de/a : secondes dans le plan
       entree: 'coupe'|'fondu'|'noir'|'flash', transition: 0.5, sortie: 'noir' }
   Le cadre « plein » couvre le format et en montre une fenêtre (x, y de −1 à 1) ; « ecran »
   pose l'écran du téléphone, entier, dans le format, sur son propre flou (jamais étiré).
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const C = require('./commun');
const K = require('./cartons');
const S = require('./scenes');
const MU = require('./musique');
const CT = require('./controle');

const FPS = 30;

// ─── le temps d'un plan en images (la mesure M en secondes)
function images(duree, M) {
  if (typeof duree === 'number') return Math.round(duree * FPS);
  const m = String(duree).match(/^(\d+(?:\.\d+)?)\s*([mts]?)$/);
  if (!m) throw new Error('durée illisible : ' + duree + ' (« 2m », « 3t » ou des secondes)');
  const v = +m[1], s = m[2] === 'm' ? v * M : m[2] === 't' ? v * M / 4 : v;
  return s * FPS;
}
function calculer(plans, M, total) {
  const out = [];
  let t = 0;   // en images, non arrondi : la somme des mesures tombe juste
  plans.forEach((p, i) => {
    const n = p.duree === 'reste' ? total * FPS - t : images(p.duree, M);
    const a = Math.round(t), b = Math.round(t + n);
    out.push(Object.assign({}, p, { i, debut: a, fin: b, n: b - a }));
    t += n;
  });
  return out;
}
// une valeur qui peut dépendre du format : v, ou { '9x16': …, defaut: … }
function parFormat(v, fmt) {
  const carte = v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length > 0 && Object.keys(v).every((k) => k === 'defaut' || C.FORMATS[k]);
  if (carte) return v[fmt] !== undefined ? v[fmt] : v.defaut;
  return v;
}

// ─── le cadre d'une source (sw × sh) dans le format : un graphe de filtres
const ECRAN = {
  // l'échelle de l'écran du téléphone, et où il se pose (sa gauche, son haut)
  '9x16': { e: 0.78, x: 'centre', y: 372 },
  '16x9': { e: 0.5, x: 300, y: 60 },
  '4x5': { e: 0.56, x: 'centre', y: 246 },     // 605 × 1075 : sous la légende, au-dessus du bord (28 px)
  appstore: { e: 0.8, x: 'centre', y: 330 },
};
function filtreCadre(cad, fmt, sw, sh, dec) {
  const F = C.FORMATS[fmt], W = F.l, H = F.h;
  const mode = typeof cad === 'string' ? cad : (cad && cad.mode) || 'plein';
  const o = typeof cad === 'object' && cad ? cad : {};
  const conv = 'scale=out_color_matrix=bt709:out_range=tv';
  if (mode === 'plein') {
    const k = Math.max(W / sw, H / sh) * (o.zoom || 1);
    const w = Math.round(sw * k / 2) * 2, h = Math.round(sh * k / 2) * 2;
    const x = o.x || 0, y = o.y || 0;
    const sc = (w === sw && h === sh) ? '' : 'scale=' + w + ':' + h + ':flags=lanczos,';
    return { graphe: '[src]' + sc + 'crop=' + W + ':' + H + ':' + Math.round((w - W) * (x + 1) / 2) + ':' + Math.round((h - H) * (y + 1) / 2) + ',' + conv + ',format=yuv444p,setsar=1[base]', entrees: [] };
  }
  // l'écran : entier, à l'échelle e, ses coins ronds (le masque), son cadre et son ombre ; dessous, son flou
  const E = Object.assign({}, ECRAN[fmt] || ECRAN['9x16'], o);
  const e = E.e * (1080 / sw > 1.01 ? 1080 / sw : 1);   // une source plus petite (886) s'agrandit au même gabarit
  const w = Math.round(sw * e / 2) * 2, h = Math.round(sh * e / 2) * 2;
  const x0 = E.x === 'centre' ? Math.round((W - w) / 2) : Math.round(E.x), y0 = Math.round(E.y);
  const flou = E.fond === 'noir' ? 'color=c=0x120E1C:s=' + W + 'x' + H + ':r=30[bg0];[bg0]format=yuv444p[bg];[s1]nullsink;'
    : '[s1]scale=' + Math.round(W / 8 / 2) * 2 + ':' + Math.round(H / 8 / 2) * 2 + ':force_original_aspect_ratio=increase,crop=' + Math.round(W / 8 / 2) * 2 + ':' + Math.round(H / 8 / 2) * 2 +
      ',boxblur=12:3,scale=' + W + ':' + H + ':flags=bicubic,eq=brightness=-0.10:saturation=0.85:contrast=0.92,' + conv + ',format=yuv444p[bg];';
  return {
    graphe: '[src]split[s1][s2];' + flou +
      '[s2]scale=' + w + ':' + h + ':flags=area,format=rgba[fg0];[m0]scale=' + w + ':' + h + ',format=gray[mk];[fg0][mk]alphamerge,' + conv + ',format=yuva444p[fg];' +
      '[c0]format=rgba,' + conv + ',format=yuva444p[cad];' +
      '[bg][cad]overlay=' + (x0 - dec.marge) + ':' + (y0 - dec.marge) + ':format=yuv444[bg2];[bg2][fg]overlay=' + x0 + ':' + y0 + ':format=yuv444,setsar=1[base]',
    entrees: ['masque', 'cadre'], w, h, x0, y0,
  };
}

// ─── un plan : la source, le cadre, la légende, les fondus → un mezzanine de n images (+ ses poignées)
async function rendrePlan(ctx, p, fmt, pre, post) {
  const F = C.FORMATS[fmt], W = F.l, H = F.h;
  const n = p.n + pre + post;
  const src = p.source || { noir: true };
  const dir = C.assurer(path.join(ctx.travail, 'plans', fmt));
  const leg = p.legende ? parFormat(p.legende, fmt) : null;
  const cad = parFormat(p.cadre || {}, fmt) || 'plein';
  // ce qui fait le plan (pour ne pas le refaire s'il n'a pas changé)
  let entree = null, sw = 0, sh = 0, de = 0, vitesse = src.vitesse || 1, cropApp = null;
  if (src.moment) {
    // un moment d'une autre bande (`bande: 'jeu'`) se reprend sans le retourner
    const clips = src.bande ? path.join(ctx.d.travail, src.bande, 'clips') : ctx.clips;
    const profil = fmt === 'appstore' && fs.existsSync(path.join(clips, src.moment + '.appstore.mp4')) ? 'appstore' : 'social';
    entree = path.join(clips, src.moment + '.' + profil + '.mp4');
    // l'entrée du plan : des secondes, ou { pose, avant } — tant de secondes avant une pose du tournage
    // (la décision du samedi, le sachet de l'album) : un nouveau tournage garde la coupe juste
    const dv = parFormat(src.de, fmt);
    if (dv && typeof dv === 'object' && dv.pose) {
      const fj0 = entree.replace(/\.mp4$/, '.json');
      const pz = fs.existsSync(fj0) ? (JSON.parse(fs.readFileSync(fj0, 'utf8')).poses || {})[dv.pose] : null;
      if (!pz) throw new Error('plan ' + p.i + ' : pas de pose « ' + dv.pose + ' » dans ' + fj0);
      de = Math.max(0, pz.t - (dv.avant || 0));
    } else de = dv || 0;
    if (profil === 'appstore' && src.deAppstore != null) de = src.deAppstore;
  } else if (src.film) {
    const modele = (ctx.cfg.films || {})[src.film];
    if (!modele) throw new Error('film inconnu : ' + src.film + ' (la bande déclare `films`)');
    // l'aperçu de l'App Store (886 × 1920) : la colonne du milieu du 9:16 — le même temps que les
    // autres formats (le fichier `appstore` d'un tournage est son montage court, un autre temps)
    entree = C.chemin(modele, ctx.d, fmt === 'appstore' ? '9x16' : fmt, ctx.cfg);
    if (fmt === 'appstore') cropApp = src.xAppstore || 0;
    de = parFormat(src.de, fmt) || 0;
  }
  if (entree && !fs.existsSync(entree)) throw new Error('plan ' + p.i + ' : source absente ' + entree);
  if (entree) { const s = C.ffprobe(entree).streams.find((x) => x.codec_type === 'video'); sw = s.width; sh = s.height; }
  // (le dessin compte aussi : la fabrique du carton, celle des légendes — un carton retouché se refait)
  const dessin = (src.carton && S.cartons[src.carton] ? String(S.cartons[src.carton]) : '') + (leg ? String(S.legende) + S.CSS_LEGENDE : '');
  const cle = C.empreinte({ p: Object.assign({}, p, { i: 0, debut: 0, fin: 0 }), fmt, pre, post, entree, mt: entree ? fs.statSync(entree).mtimeMs : 0, acc: ctx.accent,
    ctx: src.carton ? ctx.contexteCarton : null, dessin: dessin ? C.empreinte(dessin) : null, v: 7 });
  const fichier = path.join(dir, String(p.i).padStart(2, '0') + '_' + (src.moment || src.film || src.carton || 'noir') + '.mp4');
  const fj = fichier + '.json';
  if (!ctx.force && fs.existsSync(fichier) && fs.existsSync(fj) && JSON.parse(fs.readFileSync(fj, 'utf8')).cle === cle) return fichier;

  // les entrées de ffmpeg, et le graphe
  const args = [], g = [];
  let k = 0;
  const entreeVideo = (f, opts) => { args.push(...(opts || []), '-i', f); return k++; };
  if (src.carton || src.image) {
    // un carton : la scène rendue sur toute la durée du plan, poignées comprises
    const spec = Object.assign(src.image && !src.carton ? { carton: 'image' } : {}, src);
    if (spec.image) spec.image = C.chemin(spec.image, ctx.d, fmt, ctx.cfg);
    if (spec.cartouches) spec.cartouches = spec.cartouches.map((c) => Object.assign({}, c, { image: C.chemin(c.image, ctx.d, fmt, ctx.cfg) }));
    const tmp = path.join(dir, String(p.i).padStart(2, '0') + '_carton.mp4');
    await K.carton(ctx.atelier, spec, fmt, n / FPS, ctx.contexteCarton, tmp);
    const i = entreeVideo(tmp);
    g.push('[' + i + ':v]setpts=PTS-STARTPTS,format=yuv444p[base]');
  } else if (src.noir || !entree) {
    const i = entreeVideo('color=c=black:s=' + W + 'x' + H + ':r=30:d=' + (n / FPS + 1).toFixed(3), ['-f', 'lavfi']);
    g.push('[' + i + ':v]format=yuv444p[base]');
  } else {
    // la source : depuis (de − poignée avant), à sa vitesse ; s'il en manque, la dernière image tient
    const debut = Math.max(0, de - pre / FPS * vitesse);
    const i = entreeVideo(entree, ['-ss', debut.toFixed(3)]);
    let chaine = '[' + i + ':v]setpts=(PTS-STARTPTS)/' + vitesse + ',fps=30,tpad=stop_mode=clone:stop_duration=' + (n / FPS + 1).toFixed(2);
    if (cropApp != null) { chaine += ',crop=' + W + ':' + sh + ':' + Math.round((sw - W) * (cropApp + 1) / 2) + ':0'; sw = W; }
    g.push(chaine + '[src]');
    let dec = { marge: 0 };
    const fc = filtreCadre(cad, fmt, sw, sh, dec);
    if (fc.entrees.length) {
      const R = Math.round(fc.w * 0.045);
      dec = await K.cadreEcran(ctx.atelier, fc.w, fc.h, R, ctx.accent, C.assurer(path.join(ctx.travail, 'decors')));
      const fc2 = filtreCadre(cad, fmt, sw, sh, dec);
      const im = entreeVideo(dec.masque, ['-loop', '1', '-framerate', '30']);
      const ic = entreeVideo(dec.cadre, ['-loop', '1', '-framerate', '30']);
      g.push(fc2.graphe.replace('[m0]', '[' + im + ':v]').replace('[c0]', '[' + ic + ':v]'));
    } else g.push(fc.graphe);
  }
  // la légende : un PNG transparent, qui entre (fondu, un glissé de 22 px) et sort (fondu)
  let courant = 'base';
  if (leg && (leg.titre || leg.sous)) {
    const png = path.join(dir, String(p.i).padStart(2, '0') + '_legende.png');
    await K.legende(ctx.atelier, leg, fmt, ctx.accent, png);
    const il = entreeVideo(png, ['-loop', '1', '-framerate', '30']);
    const t0 = pre / FPS + (leg.de || 0.12), t1 = pre / FPS + (leg.a != null ? (leg.a < 0 ? p.n / FPS + leg.a : leg.a) : p.n / FPS - 0.12);
    const fe = 0.22, fs_ = Math.min(0.25, Math.max(0.05, (t1 - t0) / 4));
    const glisse = Math.round(22 * Math.min(F.l, F.h) / 1080);
    g.push('[' + il + ':v]format=rgba,fade=t=in:st=' + t0.toFixed(3) + ':d=' + fe + ':alpha=1,fade=t=out:st=' + (t1 - fs_).toFixed(3) + ':d=' + fs_.toFixed(3) + ':alpha=1,' +
      'scale=out_color_matrix=bt709:out_range=tv,format=yuva444p[leg]');
    g.push('[' + courant + '][leg]overlay=x=0:y=\'if(lt(t\\,' + (t0 + 0.32).toFixed(3) + ')\\,' + glisse + '*pow(max(0\\,1-(t-' + t0.toFixed(3) + ')/0.32)\\,2)\\,0)\':eval=frame:format=yuv444:shortest=0[vl]');
    courant = 'vl';
  }
  // les entrées et sorties : le noir, l'éclair (ce que la chaîne ne fait pas : ni coupe ni fondu enchaîné)
  const dt = p.transition || 0.4;
  const fx = [];
  if (p.entree === 'noir') fx.push('fade=t=in:st=' + (pre / FPS).toFixed(3) + ':d=' + Math.min(dt, p.n / FPS / 2).toFixed(3));
  if (p.sortie === 'noir') fx.push('fade=t=out:st=' + ((pre + p.n) / FPS - Math.min(dt, p.n / FPS / 2)).toFixed(3) + ':d=' + Math.min(dt, p.n / FPS / 2).toFixed(3));
  if (p.entree === 'flash') {
    const ic = entreeVideo('color=c=' + (p.couleurFlash || '#FFF4D8') + ':s=' + W + 'x' + H + ':r=30:d=' + (n / FPS + 1).toFixed(3), ['-f', 'lavfi']);
    g.push('[' + ic + ':v]format=rgba,fade=t=out:st=' + (pre / FPS).toFixed(3) + ':d=' + Math.min(0.35, dt).toFixed(3) + ':alpha=1,scale=out_color_matrix=bt709:out_range=tv,format=yuva444p[fl]');
    g.push('[' + courant + '][fl]overlay=format=yuv444:shortest=0[vf]');
    courant = 'vf';
  }
  g.push('[' + courant + ']' + (fx.length ? fx.join(',') + ',' : '') + 'format=yuv444p,setsar=1[sortie]');
  C.ffmpeg(args.concat(['-filter_complex', g.join(';'), '-map', '[sortie]', '-frames:v', String(n), '-r', '30'].concat(C.MEZZANINE,
    ['-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv', fichier])), 'plan ' + p.i + ' (' + fmt + ')');
  fs.writeFileSync(fj, JSON.stringify({ cle, n, pre, post }));
  return fichier;
}

// ─── la chaîne des plans (coupes, fondus enchaînés) → l'encodeur de livraison, avec la musique
function encoder(ctx, plans, fichiers, poignees, musique, fmt, sortie) {
  const F = C.FORMATS[fmt];
  const args = [], g = [];
  fichiers.forEach((f, i) => { args.push('-i', f); g.push('[' + i + ':v]settb=1/30,setpts=PTS-STARTPTS[s' + i + ']'); });
  args.push('-i', musique.wav);
  // (xfade veut deux entrées à la même base de temps : chaque nœud y revient, settb=1/30)
  let acc = '[s0]', fin = plans[0].fin;   // la fin nominale (en images) de ce qui est déjà enchaîné
  for (let i = 1; i < plans.length; i++) {
    const o = i === plans.length - 1 ? '[vchaine]' : '[a' + i + ']';
    const p = plans[i], pre = poignees[i][0];
    if (p.entree === 'fondu' && pre > 0) {
      const d = pre + poignees[i - 1][1];
      g.push(acc + '[s' + i + ']xfade=transition=fade:duration=' + (d / FPS).toFixed(4) + ':offset=' + ((fin - pre) / FPS).toFixed(4) + ',settb=1/30' + o);
    } else g.push(acc + '[s' + i + ']concat=n=2:v=1:a=0,settb=1/30' + o);
    acc = o; fin = p.fin;
  }
  if (plans.length === 1) g.push('[s0]null[vchaine]');
  const total = plans[plans.length - 1].fin;
  g.push('[vchaine]trim=end_frame=' + total + ',format=yuv420p,setsar=1[v]');
  const enc = ['-filter_complex', g.join(';'), '-map', '[v]', '-map', fichiers.length + ':a',
    '-c:v', 'libx264', '-preset', 'slow', '-profile:v', 'high', '-level:v', F.niveau, '-pix_fmt', 'yuv420p',
    '-crf', String(F.crf), '-maxrate', F.maxrate, '-bufsize', F.bufsize, '-g', '60', '-keyint_min', '30', '-sc_threshold', '40',
    '-x264-params', 'aq-mode=3:aq-strength=0.9',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv', '-r', '30',
    '-c:a', 'aac', '-b:a', F.aac, '-ar', '48000', '-ac', '2', '-t', (total / FPS).toFixed(4), '-movflags', '+faststart', sortie];
  C.ffmpeg(args.concat(enc), 'livraison ' + fmt);
}

// ─── une bande, dans ses formats
async function monter(cfg, o) {
  const d = C.dossiers(o);
  const travail = path.join(d.travail, cfg.id);
  const formats = o.formats ? String(o.formats).split(',') : Object.keys(cfg.formats || {});
  const H = C.histoires();
  const accent = cfg.accent || (cfg.livre && H[cfg.livre] && H[cfg.livre].c) || C.PALETTE.framboise;
  const atelier = new K.Atelier();
  const sorties = C.assurer(path.join(d.livrables, 'bandes_annonces'));
  const bilan = [];
  try {
    for (const fmt of formats) {
      if (!C.FORMATS[fmt]) throw new Error('format inconnu : ' + fmt);
      const nom = cfg.formats[fmt];
      const mt = cfg.montages[nom];
      if (!mt) throw new Error('le format ' + fmt + ' demande le montage « ' + nom + ' », absent');
      const mus = MU.monterMusique(mt.musique || cfg.musique, path.join(travail, 'musique'), nom);
      const plans = calculer(mt.plans, mus.mesure, mus.duree);
      const totalImages = plans[plans.length - 1].fin, attendu = Math.round(mus.duree * FPS);
      if (Math.abs(totalImages - attendu) > 1) throw new Error('le montage « ' + nom + ' » dure ' + (totalImages / FPS).toFixed(2) + ' s, la musique ' + mus.duree.toFixed(2) + ' s : un plan « reste » à la fin, ou des mesures justes');
      const F = C.FORMATS[fmt];
      if (F.max && totalImages / FPS > F.max + 0.01) throw new Error(fmt + ' : ' + (totalImages / FPS).toFixed(2) + ' s, plus que ' + F.max + ' s');
      C.journal('montage ' + cfg.id + ' · ' + fmt + ' (« ' + nom + ' », ' + plans.length + ' plans, ' + (totalImages / FPS).toFixed(2) + ' s)…');
      const contexte = Object.assign({ accent }, cfg.contexte || {});
      if (contexte.cartouches) contexte.cartouches = contexte.cartouches.map((c) => Object.assign({}, c, { image: C.chemin(c.image, d, fmt, cfg) }));
      const ctx = { cfg, d, travail: path.join(travail, 'montage'), clips: path.join(travail, 'clips'), accent, atelier, force: !!o.force, contexteCarton: contexte };
      // les poignées : la moitié d'un fondu enchaîné, de part et d'autre de la coupe
      const poignees = plans.map((p, i) => {
        const avant = p.entree === 'fondu' && i > 0 ? Math.round((p.transition || 0.5) * FPS / 2) : 0;
        const suivant = plans[i + 1], apres = suivant && suivant.entree === 'fondu' ? Math.round((suivant.transition || 0.5) * FPS / 2) : 0;
        return [avant, apres];
      });
      const fichiers = [];
      for (const p of plans) {
        fichiers.push(await rendrePlan(ctx, p, fmt, poignees[p.i][0], poignees[p.i][1]));
        process.stdout.write('.');
      }
      process.stdout.write('\n');
      const sortie = path.join(sorties, cfg.id + '.' + fmt + '.mp4');
      encoder(ctx, plans, fichiers, poignees, mus, fmt, sortie);
      const v = CT.verifier(sortie, fmt);
      CT.planche(sortie, path.join(d.livrables, 'planches', cfg.id + '.' + fmt + '.planche.jpg'), fmt);
      bilan.push(v);
      C.journal('  → ' + sortie + ' · ' + v.resume);
    }
  } finally { await atelier.fermer(); }
  CT.ecrireRapport(d, cfg.id, bilan);
  return bilan;
}

module.exports = { monter, calculer, images };
