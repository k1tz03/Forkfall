/* ═══════════════════════════════════════════════════════════════════════════
   LES SCÈNES DES CARTONS — du HTML et du CSS, dans la langue du jeu.
   L'unité `u` vaut (le petit côté du cadre) / 1080 : le même dessin en 9:16, 4:5,
   16:9 et pour l'App Store. Les marges (FORMATS[fmt].marges) gardent le texte hors
   de l'interface des réseaux.
   Les animations sont des @keyframes à délais : cartons.js les fige et pose le temps.
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const C = require('./commun');

const P = C.PALETTE;
let POLICES = null;
function polices() { return POLICES || (POLICES = C.policesCss()); }
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// une image locale, en data: (les cartons ne passent par aucun serveur)
function dataUrl(f) {
  const ext = path.extname(f).slice(1).toLowerCase();
  const type = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', svg: 'image/svg+xml' }[ext] || 'application/octet-stream';
  return 'data:' + type + ';base64,' + fs.readFileSync(f).toString('base64');
}
// le texte de la configuration : « \n » coupe la ligne, *mot* met en valeur (la couleur du livre)
function texte(t) { return esc(t).replace(/\n/g, '<br>').replace(/\*([^*]+)\*/g, '<em>$1</em>'); }

function page(F, accent, css, corps, script) {
  const u = Math.min(F.l, F.h) / 1080;
  return '<!doctype html><html><head><meta charset="utf-8"><style>' + polices() +
    ':root{--u:' + u + 'px;--acc:' + accent + ';--fond:' + P.fond + ';--fond2:' + P.fond2 + ';--creme:' + P.creme + ';--creme2:' + P.creme2 +
    ';--prune:' + P.prune + ';--prune2:' + P.prune2 + ';--ligne:' + P.ligne + ';--ombre:' + P.ombre + ';--texte:' + P.texteAcc + ';--or:' + P.or + ';--encre:' + P.encre + '}' +
    '*{box-sizing:border-box}html,body{margin:0;width:' + F.l + 'px;height:' + F.h + 'px;overflow:hidden;background:transparent;' +
    '-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}' +
    '.j{font-family:"Jersey 15",monospace;font-weight:400}.m{font-family:"Space Mono",monospace}' +
    'em{font-style:normal;color:var(--acc)}' + css + '</style></head><body>' + corps + (script ? '<script>' + script + '</script>' : '') + '</body></html>';
}

// ─── le logo au pixel (le dessin de l'accueil : preview_template.html, logoPixel) ; `allumage`
// donne à chaque pixel un délai de la gauche vers la droite (la mèche qui brûle)
const GLYPHES = {
  F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  I: ['###', '.#.', '.#.', '.#.', '.#.', '.#.', '###'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
};
function logoPixel(mot, allumage) {
  const on = {};
  let x = 1;
  for (const ch of mot) {
    const g = GLYPHES[ch];
    if (!g) { x += 3; continue; }
    g.forEach((l, y) => { for (let i = 0; i < l.length; i++) if (l[i] === '#') on[(x + i) + ',' + (y + 1)] = 1; });
    x += g[0].length + 1;
  }
  const W = x + 1, H = 10;
  const bord = {};
  for (const k of Object.keys(on)) {
    const [px, py] = k.split(',').map(Number);
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) bord[(px + dx) + ',' + (py + dy)] = 1;
  }
  const face = (y) => (y <= 2 ? '#FFF4D8' : y <= 4 ? '#FFD27A' : '#FF9A3C');
  const rects = (cases, dx, dy, couleur, cls) => Object.keys(cases).map((k) => {
    const [px, py] = k.split(',').map(Number);
    const d = allumage ? ' style="animation-delay:' + (allumage.de + (px / W) * allumage.duree + ((px * 7 + py * 13) % 5) * 0.012).toFixed(3) + 's"' : '';
    return '<rect class="' + cls + '"' + d + ' x="' + (px + dx) + '" y="' + (py + dy) + '" width="1.02" height="1.02" fill="' + (typeof couleur === 'function' ? couleur(py) : couleur) + '"/>';
  }).join('');
  return '<svg class="logo" viewBox="-1 0 ' + (W + 1) + ' ' + H + '" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">' +
    rects(bord, 1, 1, '#8A1238', 'px') + rects(bord, 0, 0, '#0B0814', 'px') + rects(on, 0, 0, face, 'px') + '</svg>';
}

// ─── le grain et le vignettage (une image de film, pas un aplat)
const GRAIN = 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 .95  0 0 0 0 .85  0 0 0 .55 0"/></filter><rect width="240" height="240" filter="url(#n)"/></svg>').toString('base64');
const CSS_FOND = '.grain{position:absolute;inset:0;background:url(' + GRAIN + ');opacity:.07;mix-blend-mode:screen;pointer-events:none}' +
  '.vign{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 45%,rgba(0,0,0,.55) 100%);pointer-events:none}';

// ─── la boîte où l'on écrit, selon le format et la position demandée
function boite(fmt, F, position) {
  const m = F.marges, L = F.l, H = F.h;
  const g = Math.round(m.gauche * L), d = Math.round(m.droite * L), h = Math.round(m.haut * H), b = Math.round(m.bas * H);
  switch (position) {
    case 'bas': return 'left:' + g + 'px;right:' + d + 'px;bottom:' + b + 'px';
    case 'centre': return 'left:' + g + 'px;right:' + d + 'px;top:50%;transform:translateY(-50%)';
    case 'droite': return 'left:' + Math.round(L * 0.5) + 'px;right:' + Math.round(L * 0.05) + 'px;top:50%;transform:translateY(-50%)';
    case 'gauche': return 'left:' + Math.round(L * 0.05) + 'px;right:' + Math.round(L * 0.5) + 'px;top:50%;transform:translateY(-50%)';
    case 'bas-gauche': return 'left:' + g + 'px;right:' + Math.round(L * 0.42) + 'px;bottom:' + b + 'px';
    default: return 'left:' + g + 'px;right:' + d + 'px;top:' + h + 'px';
  }
}
const CSS_LEGENDE =
  '.leg{position:absolute;display:flex;flex-direction:column;align-items:flex-start}' +
  '.leg.centre-txt{align-items:center;text-align:center}' +
  '.pan{background:rgba(18,14,28,.88);border-left:calc(10*var(--u)) solid var(--acc);padding:calc(22*var(--u)) calc(34*var(--u)) calc(26*var(--u));' +
  'box-shadow:calc(8*var(--u)) calc(8*var(--u)) 0 rgba(6,4,11,.92)}' +
  '.t{font-family:"Jersey 15",monospace;text-transform:uppercase;color:var(--texte);font-size:calc(var(--tt)*var(--u));line-height:.94;letter-spacing:.025em;text-wrap:balance;' +
  'text-shadow:calc(5*var(--u)) calc(5*var(--u)) 0 var(--ombre)}' +
  '.s{font-family:"Space Mono",monospace;font-style:italic;color:var(--creme);font-size:calc(var(--ts)*var(--u));line-height:1.28;margin-top:calc(14*var(--u));text-wrap:balance;' +
  'text-shadow:calc(3*var(--u)) calc(3*var(--u)) 0 var(--ombre)}' +
  '.k{font-family:"Space Mono",monospace;font-weight:700;text-transform:uppercase;letter-spacing:.22em;color:var(--acc);font-size:calc(28*var(--u));margin-bottom:calc(14*var(--u))}' +
  '.neon{font-family:"Jersey 15",monospace;text-transform:uppercase;color:#FFF1EC;font-size:calc(var(--tt)*var(--u));line-height:.92;letter-spacing:.03em;' +
  'text-shadow:0 0 calc(2*var(--u)) #fff,0 0 calc(10*var(--u)) var(--acc),0 0 calc(26*var(--u)) var(--acc),0 0 calc(54*var(--u)) var(--acc)}';

// une légende : { titre, sous, sur, position, style: 'panneau'|'nu'|'neon', taille }
function legende(leg, fmt, F, accent) {
  const pos = (leg.position && typeof leg.position === 'object' ? leg.position[fmt] : leg.position) || 'haut';
  const style = (leg.style && typeof leg.style === 'object' ? leg.style[fmt] : leg.style) || 'panneau';
  // le 4:5 a peu de hauteur au-dessus de l'écran : un cran plus petit (le titre reste ≥ 64 px)
  const taille = leg.taille || 1, kf = fmt === '16x9' ? 1.05 : fmt === '4x5' ? 0.86 : 1;
  const tt = Math.round((leg.tt || 86) * taille * kf), ts = Math.round((leg.ts || 38) * taille * kf);
  const contenu = (leg.sur ? '<div class="k">' + texte(leg.sur) + '</div>' : '') +
    (leg.titre ? '<div class="' + (style === 'neon' ? 'neon' : 't') + '">' + texte(leg.titre) + '</div>' : '') +
    (leg.sous ? '<div class="s">' + texte(leg.sous) + '</div>' : '');
  const corps = '<div class="leg' + (pos === 'centre' ? ' centre-txt' : '') + '" style="' + boite(fmt, F, pos) + ';--tt:' + tt + ';--ts:' + ts + '">' +
    (style === 'panneau' ? '<div class="pan">' + contenu + '</div>' : contenu) + '</div>';
  return page(F, accent, CSS_LEGENDE, corps);
}

// ─── l'écran du téléphone (mode « ecran ») : son masque, son cadre
function masqueEcran(l, h, r) {
  return '<!doctype html><html><body style="margin:0;background:#000"><div style="width:' + l + 'px;height:' + h + 'px;border-radius:' + r + 'px;background:#fff"></div></body></html>';
}
function cadreEcran(l, h, r, accent, marge) {
  return '<!doctype html><html><body style="margin:0;background:transparent"><div style="position:absolute;left:' + marge + 'px;top:' + marge + 'px;width:' + l + 'px;height:' + h +
    'px;border-radius:' + r + 'px;box-shadow:0 0 0 ' + Math.max(3, Math.round(l / 180)) + 'px ' + accent + ',0 0 0 ' + Math.max(6, Math.round(l / 90)) + 'px rgba(6,4,11,.85),0 ' +
    Math.round(marge / 3) + 'px ' + marge + 'px rgba(0,0,0,.65)"></div></body></html>';
}

// ═══ LES CARTONS PLEINS ════════════════════════════════════════════════════════
// Chaque fabrique reçoit (spec, fmt, F, d, contexte) et rend une page animée de d secondes.

// un titre plein cadre : { sur, titre, sous, fond: 'brun'|'prune'|<image>, style: 'panneau'|'neon' }
function cTitre(s, fmt, F, d, ctx) {
  const acc = s.accent || ctx.accent;
  const fond = s.image ? '<img class="fondimg" src="' + dataUrl(s.image) + '">' : '';
  const css = CSS_FOND + CSS_LEGENDE +
    'body{background:radial-gradient(140% 95% at 50% 42%,' + (s.fond === 'prune' ? '#251c3d' : '#2b1b0d') + ' 0,' + (s.fond === 'prune' ? P.prune : P.fond) + ' 48%,#080507 100%)}' +
    '.fondimg{position:absolute;inset:-4%;width:108%;height:108%;object-fit:cover;opacity:.42;filter:saturate(.8) brightness(.8);animation:kb ' + d + 's linear both}' +
    '@keyframes kb{from{transform:scale(1.0)}to{transform:scale(1.07)}}' +
    '.bloc{position:absolute;left:8%;right:8%;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;align-items:center;text-align:center}' +
    '.bloc .k,.bloc .t,.bloc .neon,.bloc .s{animation:ent .5s cubic-bezier(.2,.8,.2,1) both}' +
    '.bloc .t,.bloc .neon{animation-delay:.12s}.bloc .s{animation-delay:.45s}' +
    '@keyframes ent{from{opacity:0;transform:translateY(calc(26*var(--u)))}to{opacity:1;transform:none}}' +
    '.trait{width:calc(260*var(--u));height:calc(8*var(--u));background:var(--acc);margin:calc(30*var(--u)) 0 calc(6*var(--u));animation:tr .6s .3s cubic-bezier(.2,.8,.2,1) both;transform-origin:50% 50%}' +
    '@keyframes tr{from{transform:scaleX(0)}to{transform:scaleX(1)}}' +
    '.sortie{animation:so .35s ' + Math.max(0, d - 0.35).toFixed(2) + 's ease-in both}@keyframes so{from{opacity:1}to{opacity:0}}';
  const tt = Math.round((s.tt || (fmt === '16x9' ? 150 : 132)) * (s.taille || 1)), ts = Math.round((s.ts || 42) * (s.taille || 1));
  const corps = fond + '<div class="vign"></div><div class="bloc' + (s.sortie ? ' sortie' : '') + '" style="--tt:' + tt + ';--ts:' + ts + '">' +
    (s.sur ? '<div class="k">' + texte(s.sur) + '</div>' : '') +
    '<div class="' + (s.style === 'neon' ? 'neon' : 't') + '">' + texte(s.titre || '') + '</div>' +
    (s.trait === false ? '' : '<div class="trait"></div>') +
    (s.sous ? '<div class="s">' + texte(s.sous) + '</div>' : '') + '</div><div class="grain"></div>';
  return page(F, acc, css, corps);
}

// les livres, donnés comme des cartes : { cartouches: [{ image, annee, titre, role }], titre, sous }
function cLivres(s, fmt, F, d, ctx) {
  const liste = s.cartouches || ctx.cartouches || [];
  const H = C.histoires();
  // les cartes données une à une ; la dernière posée, la pile reste une seconde (1990 → 2050)
  const n = liste.length, pas = (s.pas || Math.max(0.25, d - 1.5) / Math.max(1, n));
  const large = fmt === '16x9';
  const acc = s.accent || ctx.accent;
  const css = CSS_FOND + CSS_LEGENDE +
    'body{background:radial-gradient(ellipse at 50% 55%,#2a2140 0,' + P.prune + ' 60%,#06040b 100%)}' +
    '.tete{position:absolute;left:0;right:0;top:' + Math.round(F.marges.haut * F.h) + 'px;display:flex;flex-direction:column;align-items:center;text-align:center;--tt:' + (large ? 120 : 128) + ';--ts:40}' +
    '.tete .t{animation:ent .45s cubic-bezier(.2,.8,.2,1) both}' +
    '@keyframes ent{from{opacity:0;transform:translateY(calc(20*var(--u)))}to{opacity:1;transform:none}}' +
    '.an{font-family:"Jersey 15",monospace;font-size:calc(' + (large ? 92 : 104) + '*var(--u));color:var(--or);letter-spacing:.06em;margin-top:calc(8*var(--u));text-shadow:calc(5*var(--u)) calc(5*var(--u)) 0 var(--ombre)}' +
    '.an b{color:var(--texte);font-weight:400}' +
    '.carte{position:absolute;left:50%;top:' + (large ? 63 : fmt === '4x5' ? 64 : 60) + '%;width:calc(' + (large ? 600 : fmt === '4x5' ? 690 : 860) + '*var(--u));transform-origin:50% 120%;animation:donne .42s cubic-bezier(.15,.85,.25,1) both}' +
    '.carte img{width:100%;display:block;outline:calc(7*var(--u)) solid var(--coul);box-shadow:calc(14*var(--u)) calc(14*var(--u)) 0 rgba(6,4,11,.92),0 calc(30*var(--u)) calc(60*var(--u)) rgba(0,0,0,.55)}' +
    '@keyframes donne{from{opacity:0;transform:translate(var(--x0),var(--y0)) rotate(var(--r0)) scale(1.08)}to{opacity:1;transform:translate(var(--x1),var(--y1)) rotate(var(--r1)) scale(1)}}';
  let cartes = '';
  liste.forEach((c, i) => {
    const t0 = 0.25 + i * pas;
    const r1 = large ? (i - (n - 1) / 2) * 1.5 : ((i * 37) % 7 - 3) * 0.9;
    let x1, y1;
    // en 16:9, un éventail (chaque carte un peu plus à droite, les premières dépassent à gauche) ;
    // en portrait, une pile, chacune un peu de travers
    const k = i - (n - 1) / 2;
    if (large) { x1 = 'calc(-50% + ' + Math.round(k * 64) + '*var(--u))'; y1 = 'calc(-50% + ' + Math.round(Math.abs(k) * 7) + '*var(--u))'; }
    else { x1 = 'calc(-50% + ' + (((i * 53) % 5) - 2) * 6 + '*var(--u))'; y1 = 'calc(-50% + ' + (i * 4) + '*var(--u))'; }
    // la couleur du livre (HISTOIRES) : le cadre de sa cartouche, comme à l'accueil
    const coul = (c.livre && H[c.livre] && H[c.livre].c) || c.couleur || '#F6E9CF';
    cartes += '<div class="carte" style="--x0:calc(-50% + ' + (i % 2 ? -900 : 900) + '*var(--u));--y0:calc(-50% + 700*var(--u));--r0:' + (i % 2 ? -24 : 24) + 'deg;' +
      '--x1:' + x1 + ';--y1:' + y1 + ';--r1:' + r1.toFixed(1) + 'deg;--coul:' + coul + ';animation-delay:' + t0.toFixed(3) + 's;z-index:' + (i + 1) + '"><img src="' + dataUrl(c.image) + '"></div>';
  });
  const annees = liste.map((c, i) => [0.25 + i * pas, c.annee]);
  const corps = '<div class="vign"></div>' + cartes +
    '<div class="tete"><div class="t">' + texte(s.titre || 'Dix livres') + '</div><div class="an" id="an"><b>1990</b></div>' +
    (s.sous ? '<div class="s">' + texte(s.sous) + '</div>' : '') + '</div><div class="grain"></div>';
  // la frise qui s'allonge : 1990, puis 1990 → l'année du livre qu'on vient de donner (en or) ; la
  // dernière carte posée, 1990 → 2050
  const script = 'var A=' + JSON.stringify(annees) + ';window.__t=function(t){var a=null;for(var i=0;i<A.length;i++)if(t>=A[i][0])a=A[i][1];' +
    'var y=A.length&&t>=A[A.length-1][0]+0.5?2050:a;document.getElementById("an").innerHTML="<b>1990</b>"+(y&&y>1990?" → "+y:"");};';
  return page(F, acc, css, corps, script);
}

// la fin : le logo au pixel qui s'allume comme une mèche, la phrase, la disponibilité
// { livre: { titre, ligne }, phrase, disponibilite, image (le panorama) }
function cFin(s, fmt, F, d, ctx) {
  const acc = s.accent || ctx.accent;
  const large = fmt === '16x9';
  const img = s.image ? dataUrl(s.image) : null;
  const css = CSS_FOND + CSS_LEGENDE +
    'body{background:' + P.prune + '}' +
    '.pano{position:absolute;left:0;right:0;top:0;height:' + (large ? 100 : 62) + '%;overflow:hidden}' +
    '.pano img{position:absolute;height:100%;width:auto;left:50%;top:0;animation:pan ' + d + 's linear both}' +
    '@keyframes pan{from{transform:translateX(-46%) scale(1.06)}to{transform:translateX(-54%) scale(1.06)}}' +
    '.pano:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,14,28,.25) 0,rgba(18,14,28,.35) 45%,' + P.prune + ' 100%)}' +
    (large ? '.pano:after{background:linear-gradient(90deg,rgba(18,14,28,.25) 0,rgba(18,14,28,.55) 50%,rgba(18,14,28,.25) 100%),linear-gradient(180deg,rgba(18,14,28,.1),rgba(18,14,28,.75))}' : '') +
    '.bloc{position:absolute;left:7%;right:7%;top:' + (large ? 50 : 54) + '%;transform:translateY(-50%);display:flex;flex-direction:column;align-items:center;text-align:center}' +
    '.logo{width:calc(' + (large ? 1100 : 900) + '*var(--u));height:auto;display:block;filter:drop-shadow(0 0 calc(30*var(--u)) rgba(255,154,60,.25))}' +
    '.px{animation:px .09s steps(1) both}@keyframes px{from{opacity:0}to{opacity:1}}' +
    '.meche{position:relative;width:calc(' + (large ? 1060 : 860) + '*var(--u));height:calc(8*var(--u));margin-top:calc(26*var(--u));' +
    'background:repeating-linear-gradient(90deg,#FFC94D 0 calc(22*var(--u)),transparent 0 calc(34*var(--u)));opacity:.8}' +
    '.etincelle{position:absolute;top:50%;width:calc(34*var(--u));height:calc(34*var(--u));margin:calc(-17*var(--u)) 0 0 calc(-17*var(--u));' +
    'background:radial-gradient(circle,#fff 0,#FFE08A 30%,rgba(255,154,60,.6) 55%,rgba(255,154,60,0) 72%);animation:et ' + (s.meche || 1.4) + 's .1s cubic-bezier(.4,0,.2,1) both}' +
    '@keyframes et{from{left:0}to{left:100%}}' +
    '.livre{display:flex;flex-direction:column;align-items:center;margin-bottom:calc(46*var(--u));--tt:' + (large ? 120 : 112) + ';--ts:36}' +
    '.livre .neon{animation:neon 1.1s .1s steps(1) both}' +
    '@keyframes neon{0%{opacity:0}8%{opacity:1}12%{opacity:.25}18%{opacity:1}30%{opacity:.5}36%{opacity:1}100%{opacity:1}}' +
    '.livre .ligne{font-family:"Space Mono",monospace;font-weight:700;text-transform:uppercase;letter-spacing:.2em;color:var(--creme);font-size:calc(30*var(--u));margin-top:calc(18*var(--u));animation:ent .5s .7s both}' +
    '.phr{font-family:"Space Mono",monospace;font-style:italic;color:var(--creme);font-size:calc(' + (large ? 40 : 40) + '*var(--u));line-height:1.35;margin-top:calc(38*var(--u));animation:ent .6s ' + (s.phraseA || 1.3) + 's both;text-shadow:calc(3*var(--u)) calc(3*var(--u)) 0 var(--ombre)}' +
    '.dispo{margin-top:calc(46*var(--u));font-family:"Jersey 15",monospace;text-transform:uppercase;letter-spacing:.08em;font-size:calc(' + (large ? 64 : 66) + '*var(--u));color:var(--encre);' +
    'background:var(--or);padding:calc(10*var(--u)) calc(30*var(--u)) calc(8*var(--u));box-shadow:calc(7*var(--u)) calc(7*var(--u)) 0 var(--ombre);animation:ent .5s ' + (s.dispoA || 1.9) + 's both}' +
    '@keyframes ent{from{opacity:0;transform:translateY(calc(18*var(--u)))}to{opacity:1;transform:none}}';
  const livre = s.livre ? '<div class="livre"><div class="neon">' + texte(s.livre.titre) + '</div>' + (s.livre.ligne ? '<div class="ligne">' + texte(s.livre.ligne) + '</div>' : '') + '</div>' : '';
  const corps = (img ? '<div class="pano"><img src="' + img + '"></div>' : '') + '<div class="vign"></div>' +
    '<div class="bloc">' + livre + logoPixel('FUSIBLE', { de: s.logoA || 0.15, duree: s.meche || 1.4 }) +
    '<div class="meche"><div class="etincelle"></div></div>' +
    (s.phrase ? '<div class="phr">' + texte(s.phrase) + '</div>' : '') +
    (s.disponibilite ? '<div class="dispo">' + texte(s.disponibilite) + '</div>' : '') + '</div><div class="grain"></div>';
  return page(F, acc, css, corps);
}

// une image fixe qui vit (un lent travelling) : { image, zoom: [1, 1.08], x: [0, 0], y: [0, 0], sombre: 0..1 }
function cImage(s, fmt, F, d, ctx) {
  const z = s.zoom || [1, 1.06], x = s.x || [0, 0], y = s.y || [0, 0];
  const css = CSS_FOND + 'body{background:#000}' +
    '.im{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:' + (s.position || '50% 50%') + ';animation:kb ' + d + 's linear both}' +
    '@keyframes kb{from{transform:translate(' + x[0] + '%,' + y[0] + '%) scale(' + z[0] + ')}to{transform:translate(' + x[1] + '%,' + y[1] + '%) scale(' + z[1] + ')}}' +
    '.voile{position:absolute;inset:0;background:rgba(10,6,4,' + (s.sombre || 0) + ')}';
  return page(F, s.accent || ctx.accent, css, '<img class="im" src="' + dataUrl(s.image) + '"><div class="voile"></div><div class="vign"></div>');
}

// ═══ LES CAPTURES DES BOUTIQUES ════════════════════════════════════════════════
// Une ligne en haut (≤ 40 signes), la capture du jeu dessous, entière en largeur à 86 %,
// aux coins ronds, qui sort par le bas : { legende, sur, image, accent, plein }
function capture(s, l, h) {
  const u = l / 1080, acc = s.accent;
  const F = { l, h };
  const haut = Math.round(h * 0.215);
  const css = CSS_FOND +
    'body{background:linear-gradient(180deg,#1E1733 0,' + P.prune + ' 38%,#0B0814 100%)}' +
    '.lum{position:absolute;left:-20%;right:-20%;top:-10%;height:55%;background:radial-gradient(ellipse at 50% 30%,' + acc + '33 0,rgba(0,0,0,0) 60%)}' +
    '.tete{position:absolute;left:' + Math.round(76 * u) + 'px;right:' + Math.round(76 * u) + 'px;top:' + Math.round(h * 0.055) + 'px;height:' + Math.round(haut - h * 0.055) + 'px;' +
    'display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}' +
    '.k{font-family:"Space Mono",monospace;font-weight:700;text-transform:uppercase;letter-spacing:.24em;color:' + acc + ';font-size:' + Math.round(30 * u) + 'px;margin-bottom:' + Math.round(18 * u) + 'px}' +
    '.t{font-family:"Jersey 15",monospace;text-transform:uppercase;color:' + P.texteAcc + ';font-size:' + Math.round((s.taille || 1) * 98 * u) + 'px;line-height:.98;letter-spacing:.02em;text-wrap:balance;' +
    'text-shadow:' + Math.round(6 * u) + 'px ' + Math.round(6 * u) + 'px 0 ' + P.ombre + '}' +
    '.t em{font-style:normal;color:' + acc + '}' +
    '.trait{width:' + Math.round(150 * u) + 'px;height:' + Math.round(8 * u) + 'px;background:' + acc + ';margin-top:' + Math.round(26 * u) + 'px}' +
    '.ecran{position:absolute;left:7%;width:86%;top:' + haut + 'px;bottom:-' + Math.round(60 * u) + 'px;border-radius:' + Math.round(44 * u) + 'px ' + Math.round(44 * u) + 'px 0 0;overflow:hidden;' +
    'box-shadow:0 0 0 ' + Math.round(6 * u) + 'px ' + acc + ',0 0 0 ' + Math.round(12 * u) + 'px rgba(6,4,11,.9),0 ' + Math.round(30 * u) + 'px ' + Math.round(90 * u) + 'px rgba(0,0,0,.6);background:#000}' +
    '.ecran img{display:block;width:100%;height:100%;object-fit:cover;object-position:50% 0}' +
    (s.plein ? '.ecran{left:0;width:100%;border-radius:0;box-shadow:none}' : '');
  const corps = '<div class="lum"></div><div class="tete">' + (s.sur ? '<div class="k">' + texte(s.sur) + '</div>' : '') +
    '<div class="t">' + texte(s.legende) + '</div><div class="trait"></div></div>' +
    '<div class="ecran"><img src="' + dataUrl(s.image) + '"></div><div class="grain"></div>';
  return page(F, acc, css, corps);
}

// la bannière de Google Play (1024 × 500) : le titre, une image forte, rien de petit
function banniere(s, l, h) {
  const css = CSS_FOND +
    'body{background:#120E1C}' +
    '.im{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:' + (s.position || '62% 60%') + ';transform:scale(' + (s.zoom || 1.25) + ');transform-origin:' + (s.origine || '62% 60%') + '}' +
    // le texte du côté `cote` (droite par défaut : le stade du panorama est à gauche), un voile de ce côté
    (s.cote === 'gauche'
      ? '.voile{position:absolute;inset:0;background:linear-gradient(90deg,rgba(18,14,28,.92) 0,rgba(18,14,28,.75) 34%,rgba(18,14,28,.1) 64%,rgba(18,14,28,0) 100%)}' +
        '.bloc{position:absolute;left:5.5%;top:50%;transform:translateY(-50%);width:50%;display:flex;flex-direction:column;align-items:flex-start}'
      : '.voile{position:absolute;inset:0;background:linear-gradient(270deg,rgba(18,14,28,.94) 0,rgba(18,14,28,.78) 36%,rgba(18,14,28,.12) 62%,rgba(18,14,28,0) 100%)}' +
        // (le bouton de lecture de Google, si la fiche a une vidéo, se pose au centre : le bloc reste à droite de 54 %)
        '.bloc{position:absolute;right:' + (s.marge || 3.5) + '%;top:50%;transform:translateY(-50%);width:' + (s.largeur || 42) + '%;display:flex;flex-direction:column;align-items:flex-end}') +
    '.logo{width:100%;height:auto;filter:drop-shadow(0 0 18px rgba(255,154,60,.3))}' +
    '.meche{width:100%;height:6px;margin-top:14px;background:repeating-linear-gradient(90deg,#FFC94D 0 18px,transparent 0 28px);opacity:.85}' +
    '.t{margin-top:20px;font-family:"Jersey 15",monospace;text-transform:uppercase;color:' + P.texteAcc + ';font-size:' + (s.tt || 40) + 'px;line-height:1;letter-spacing:.03em;white-space:nowrap;text-shadow:4px 4px 0 ' + P.ombre + '}';
  const corps = '<img class="im" src="' + dataUrl(s.image) + '"><div class="voile"></div><div class="vign"></div><div class="bloc">' + logoPixel('FUSIBLE') +
    '<div class="meche"></div>' + (s.titre ? '<div class="t">' + texte(s.titre) + '</div>' : '') + '</div><div class="grain"></div>';
  // `recadre` : le rectangle de l'image source (x, y, largeur, en pixels de la source) que montre la bannière
  const script = s.recadre ? 'window.__t=function(){var i=document.querySelector(".im"),r=' + JSON.stringify(s.recadre) + ',k=' + l + '/r.l;' +
    'i.style.cssText="position:absolute;transform:none;object-fit:fill;width:"+(i.naturalWidth*k)+"px;height:"+(i.naturalHeight*k)+"px;left:"+(-r.x*k)+"px;top:"+(-r.y*k)+"px";};' : '';
  return page({ l, h }, s.accent || P.framboise, css, corps, script);
}

module.exports = { legende, masqueEcran, cadreEcran, logoPixel, dataUrl, page, texte, esc, CSS_LEGENDE, CSS_FOND, capture, banniere,
  cartons: { titre: cTitre, livres: cLivres, fin: cFin, image: cImage } };
