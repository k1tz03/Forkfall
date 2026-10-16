/* ═══════════════════════════════════════════════════════════════════════════
   LES CAPTURES DES BOUTIQUES — une ligne (≤ 40 signes) au-dessus d'une vraie capture
   du jeu, aux tailles des boutiques, en PNG sans alpha :
     apple   1290 × 2796  (iPhone 6,9")     ← les images fixes du profil `apple` (430 × 932, ×3)
     google  1080 × 1920  (Google Play)     ← celles du profil `social` (393 × 699, ×2,748)
   L'ordre est celui d'une page de boutique : les deux premières vendent le jeu seules.

     ecrans: { liste: [ { legende: '…', sur: '…', source: { moment: 'carte', pose: 'glisse' } | { film: 'masques', t: 30 } | { image: '…' } } ] }
   Et la bannière de Google Play (1024 × 500) : banniere: { image, titre, recadre: { x, y, l } (le
   rectangle de la source, en pixels), cote: droite|gauche, largeur, marge (en %), tt } — le centre
   reste libre (le bouton de lecture de Google, quand la fiche a une vidéo).
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const C = require('./commun');
const K = require('./cartons');
const S = require('./scenes');

const MAGASINS = { apple: { l: 1290, h: 2796, profil: 'apple' }, google: { l: 1080, h: 1920, profil: 'social' } };

// l'image d'une capture, pour un magasin
function imageDe(cfg, d, src, magasin, dossierTmp) {
  const clips = path.join(d.travail, src.bande || cfg.id, 'clips');
  if (src.moment) {
    const profils = magasin === 'apple' ? ['apple', 'appstore', 'social'] : ['social', 'google'];
    for (const p of profils) {
      const f = path.join(clips, src.moment + '.' + p + '.' + src.pose + '.png');
      if (fs.existsSync(f)) return f;
    }
    throw new Error('capture : pas d\'image ' + src.moment + ' / ' + src.pose + ' (tourner le moment avec le profil ' + MAGASINS[magasin].profil + ')');
  }
  if (src.film) {
    // une image du film (son format 9:16), au temps t
    const modele = (cfg.films || {})[src.film];
    const f = C.chemin(modele, d, '9x16', cfg);
    if (!fs.existsSync(f)) throw new Error('capture : film absent ' + f);
    const out = path.join(C.assurer(dossierTmp), 'film_' + src.film + '_' + String(src.t).replace('.', '_') + '.png');
    // refaite si le film a été retourné depuis
    if (!fs.existsSync(out) || fs.statSync(out).mtimeMs < fs.statSync(f).mtimeMs) C.ffmpeg(['-ss', String(src.t), '-i', f, '-frames:v', '1', out], 'image du film');
    return out;
  }
  if (src.image) return C.chemin(src.image, d, '', cfg);
  throw new Error('capture : une source (moment, film ou image)');
}

// un PNG opaque, RGB (Apple refuse l'alpha)
function sansAlpha(entree, sortie) {
  C.ffmpeg(['-i', entree, '-vf', 'format=rgb24', '-frames:v', '1', sortie], 'sans alpha');
  fs.unlinkSync(entree);
}

async function ecrans(cfg, o) {
  if (!cfg.ecrans || !cfg.ecrans.liste) { C.journal('captures : la bande n\'en déclare pas'); return []; }
  const d = C.dossiers(o);
  const H = C.histoires();
  const accent = cfg.accent || (cfg.livre && H[cfg.livre] && H[cfg.livre].c) || C.PALETTE.framboise;
  const atelier = new K.Atelier();
  const faits = [];
  try {
    for (const magasin of (o.magasins ? String(o.magasins).split(',') : Object.keys(MAGASINS))) {
      const M = MAGASINS[magasin];
      const dir = C.assurer(path.join(d.livrables, 'captures', cfg.id, magasin));
      for (const [i, e] of cfg.ecrans.liste.entries()) {
        if (String(e.legende).replace(/\*/g, '').length > 40) throw new Error('capture ' + (i + 1) + ' : la légende fait plus de 40 signes : ' + e.legende);
        const img = imageDe(cfg, d, e.source, magasin, path.join(d.travail, cfg.id, 'ecrans'));
        const nom = String(i + 1).padStart(2, '0') + '_' + C.slug(e.nom || e.legende) + '.png';
        const tmp = path.join(dir, '.' + nom);
        await atelier.png(S.capture({ legende: e.legende, sur: e.sur, image: img, accent: e.accent || accent, plein: e.plein, taille: e.taille }, M.l, M.h), M.l, M.h, tmp);
        const sortie = path.join(dir, nom);
        sansAlpha(tmp, sortie);
        faits.push(sortie);
        C.journal('  ' + magasin + ' ' + nom + ' — « ' + e.legende.replace(/\n/g, ' ') + ' »');
      }
    }
  } finally { await atelier.fermer(); }
  // la planche des captures (une par magasin)
  for (const magasin of Object.keys(MAGASINS)) {
    const dir = path.join(d.livrables, 'captures', cfg.id, magasin);
    if (!fs.existsSync(dir)) continue;
    const pngs = fs.readdirSync(dir).filter((f) => /^\d\d_.*\.png$/.test(f)).sort().map((f) => path.join(dir, f));
    if (!pngs.length) continue;
    const pl = path.join(C.assurer(path.join(d.livrables, 'planches')), cfg.id + '.captures.' + magasin + '.jpg');
    const args = [];
    pngs.forEach((f) => args.push('-i', f));
    const n = pngs.length, cols = Math.min(n, 5);
    const g = pngs.map((f, i) => '[' + i + ':v]scale=270:-2,setsar=1[e' + i + ']').join(';') + ';' +
      pngs.map((f, i) => '[e' + i + ']').join('') + 'xstack=inputs=' + n + ':layout=' + pngs.map((f, i) => (i % cols ? (Array.from({ length: i % cols }, () => 'w0').join('+')) : '0') + '_' +
        (Math.floor(i / cols) ? Array.from({ length: Math.floor(i / cols) }, () => 'h0').join('+') : '0')).join('|') + ':fill=0x161016[p]';
    if (n === 1) { C.ffmpeg(['-i', pngs[0], '-vf', 'scale=270:-2', pl], 'planche des captures'); continue; }
    C.ffmpeg(args.concat(['-filter_complex', g, '-map', '[p]', '-frames:v', '1', '-q:v', '3', pl]), 'planche des captures');
  }
  return faits;
}

async function banniere(cfg, o) {
  if (!cfg.banniere) { C.journal('bannière : la bande n\'en déclare pas'); return null; }
  const d = C.dossiers(o);
  const atelier = new K.Atelier();
  const sortie = path.join(C.assurer(d.livrables), cfg.banniere.fichier || 'feature_graphic.png');
  try {
    const b = Object.assign({}, cfg.banniere, { image: C.chemin(cfg.banniere.image, d, '', cfg) });
    const tmp = sortie + '.tmp.png';
    await atelier.png(S.banniere(b, 1024, 500), 1024, 500, tmp);
    sansAlpha(tmp, sortie);
  } finally { await atelier.fermer(); }
  C.journal('bannière : ' + sortie);
  return sortie;
}

module.exports = { ecrans, banniere, MAGASINS };
