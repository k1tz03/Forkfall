// CE QUE PARTAGENT LES KITS DES RÉSEAUX (x_kit.js, instagram_kit.js) : les images du jeu, la palette de
// l'accueil (l'encre de prune, le crème, l'or de la mèche, la police pixel Jersey 15), les dix livres, l'avatar
// du compte, et le rendu des gabarits par Chromium (Playwright).
'use strict';
const fs = require('fs');
const path = require('path');

const WEB = path.resolve(__dirname, '..', '..');
function arg(nom) { const i = process.argv.indexOf(nom); return i > 0 ? process.argv[i + 1] : null; }

const url = (p) => 'file://' + path.resolve(p);
const POLICE = url(path.join(WEB, 'cinema', 'polices', 'jersey-15-latin-400-normal.woff2'));
const couv = (id) => url(path.join(WEB, 'accueil', 'couv_' + id + '.webp'));
const PANO = url(path.join(WEB, 'accueil', 'panorama_nuit.webp'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// les images rendues hors du dépôt : <promo>, les livrables de packages/tools/web/promo (captures/jeu/apple,
// captures/h1/apple) ; <ville>, le dossier que lit assemble.js --ville (les pièces, int_<lieu>_nuit.webp)
function sources(promo, ville) {
  return {
    capture: (livre, nom) => url(path.join(promo, 'captures', livre, 'apple', nom)),
    piece: (lieu) => url(path.join(ville, 'int_' + lieu + '_nuit.webp')),
  };
}

// les dix livres : comme la vitrine (packages/tools/web/vitrine/page.html), l'heure et la couleur de HISTOIRES
const LIVRES = [
  ['promu', 'Trois mille visages', 'Entraîneur', 1990, 'Division 1', 'DIMANCHE', '#FF5A4E', "Ils t'aiment. Ils feront ce que tu n'oses pas faire. Avec ton visage."],
  ['interimaire', 'Le Sapin en carton', 'Entraîneur intérimaire', 1990, 'Division 2', 'LUNDI', '#6FB0E8', "Une berline grise sur la place d'un autre. Le lundi, son répondeur parle."],
  ['pepite', 'La Sirène', 'Joueur, dix-neuf ans', 1990, 'Division 2', '16:00', '#FF9A3C', "L'usine ferme à Noël, et tu es la dernière chose que cette ville fabrique. La nuit, la sirène de l'usine morte hurle pour les gamins qui tombent."],
  ['fin_de_contrat', 'La Route de la Rive', 'Joueur en fin de contrat', 1990, 'Division 1', '02:40', '#FFD84D', 'Chaque 14 mai, des chrysanthèmes sur une tombe de 1984. Cet automne, la photo de la montée arrive par morceaux.'],
  ['geant_dechu', 'La Maquette', 'Président', 1999, 'Division 2', 'MAR. 18:00', '#7ED37E', 'Deux titres au mur, un dépôt de bilan au greffe, et toi. Dans une vitrine, le stade rétrécit chaque mois.'],
  ['vendre_trente', '23 h 58', 'Directrice sportive', 2003, 'Division 1', '23:58', '#B49BFF', 'Un fax sans en-tête, une photo de 1999, trente millions par an. Le papier blanchit en six mois.'],
  ['apres_fiasco', 'Chambre 12', 'Sélectionneur', 2011, "L'équipe nationale", '02:10', '#FF79B0', "En 2010, le bus n'est jamais descendu. À l'hôtel de la Rive, la troisième nuit, quelqu'un demande la clé de la 12."],
  ['le_modele', "L'Oreillette", 'Directeur sportif', 2024, 'Division 1', '06:10', '#4FE3FF', "Un club dans un tableur, et dans ton oreille, la voix d'un mort qui choisit qui vendre."],
  ['mondial_hiver', 'Vingt degrés dedans', 'Sélectionneuse', 2029, "L'équipe nationale", '14:10', '#DDEFFF', 'Le Mondial se joue sous un dôme, à vingt degrés dedans. Ton capitaine veut y porter un brassard noir.'],
  ['escalier_ferme', 'Les Deux Téléphones', 'Présidente', 2037, 'Division 2', '00:00', '#FFB547', 'Le téléphone du bureau est pour la ville ; le clapet dans ta veste, pour ceux qui ont payé ta campagne.'],
];

const BASE = `
@font-face{font-family:"Jersey 15";src:url(${POLICE}) format("woff2")}
:root{--encre:#120E1C;--panneau:#1C1630;--trait:#352B52;--ombre:#06040B;--creme:#F6E9CF;--lavande:#CBC1E2;--brume:#A79CC4;--or:#FFC94D;
  --pix:"Jersey 15",monospace;--mono:"DejaVu Sans Mono",monospace;--serif:"DejaVu Serif",serif}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:100%;height:100%;overflow:hidden;background:var(--encre);color:var(--creme);font-family:var(--mono)}
img{display:block;image-rendering:pixelated}
.pix{font-family:var(--pix);font-weight:400;line-height:1}
.meche{height:8px;background:var(--or);box-shadow:4px 4px 0 var(--ombre)}
.cadre{border:3px solid var(--trait);box-shadow:8px 8px 0 var(--ombre)}
.marque{position:absolute;right:44px;bottom:34px;display:flex;align-items:center;gap:12px;font:34px/1 var(--pix);color:var(--creme)}
.marque i{display:block;width:44px;height:6px;background:var(--or)}
`;

// l'avatar du compte, le même sur tous les réseaux : le F de FUSIBLE, sa mèche et son étincelle (400 × 400 ;
// un réseau qui le veut plus grand le rend à une autre échelle, le dessin ne change pas)
function avatar() {
  return { w: 400, h: 400, html: `
<div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 42%,#231A3A 0,#120E1C 62%)"></div>
<div class="pix" style="position:absolute;left:0;right:0;top:38px;text-align:center;font-size:330px;color:var(--creme);text-shadow:12px 12px 0 var(--ombre)">F</div>
<div style="position:absolute;left:108px;top:318px;width:150px;height:14px;background:var(--or);box-shadow:6px 6px 0 var(--ombre)"></div>
<div style="position:absolute;left:262px;top:302px;width:14px;height:14px;background:#FFE7A0"></div>
<div style="position:absolute;left:280px;top:314px;width:10px;height:10px;background:var(--or)"></div>
<div style="position:absolute;left:270px;top:330px;width:10px;height:10px;background:#FF7A3C"></div>
<div style="position:absolute;left:286px;top:292px;width:8px;height:8px;background:#FFE7A0"></div>` };
}
// la variante : le stade la nuit, la vignette du livre 1
function avatarStade() {
  return { w: 400, h: 400, html: `
<img src="${couv('promu')}" style="position:absolute;left:-155px;top:0;height:400px;width:711px;object-fit:cover">
<div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,transparent 55%,rgba(18,14,28,.65) 72%)"></div>` };
}

// rend chaque [fichier, gabarit] de <liste> en PNG dans <out>. Un gabarit est { w, h, html } (sa taille en pixels
// CSS) ; il peut demander une échelle (`echelle` : l'image sort en w × echelle) ou un fond transparent
// (`transparent` : un calque posé sur une vidéo). <css> s'ajoute à la feuille commune.
async function rendre(liste, out, css = '') {
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const pages = new Map();
  fs.mkdirSync(out, { recursive: true });
  const tmp = path.join(out, '.gabarit.html');
  for (const [fichier, g] of liste) {
    const echelle = g.echelle || 1;
    if (!pages.has(echelle)) pages.set(echelle, await (await b.newContext({ deviceScaleFactor: echelle })).newPage());
    const p = pages.get(echelle);
    const dest = path.join(out, fichier);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(tmp, `<!doctype html><meta charset="utf-8"><style>${BASE}${css}</style><body>${g.html}</body>`);
    await p.setViewportSize({ width: g.w, height: g.h });
    await p.goto(url(tmp));
    await p.evaluate(() => document.fonts.ready);
    await p.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => null))));
    await p.screenshot({ path: dest, omitBackground: !!g.transparent });
    console.log('rendu :', fichier);
  }
  fs.unlinkSync(tmp);
  await b.close();
}

module.exports = { WEB, arg, url, esc, couv, PANO, sources, LIVRES, BASE, avatar, avatarStade, rendre };
