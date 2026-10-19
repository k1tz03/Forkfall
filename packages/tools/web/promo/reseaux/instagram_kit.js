#!/usr/bin/env node
// LE KIT INSTAGRAM (docs/sortie/instagram.md) : l'avatar, les carrousels, les couvertures des Reels et leurs
// vidéos, et l'aperçu de la grille du compte @fusiblegame, dans la palette de l'accueil du jeu (commun.js).
//
//   NODE_PATH=/opt/node22/lib/node_modules node packages/tools/web/promo/reseaux/instagram_kit.js \
//     --promo <livrables de la promo> --ville <dossier des images de la ville> --out <dossier> \
//     [--bandes <dossier des bandes-annonces>[,<autre dossier>]]
//
// <livrables>, <ville> : comme x_kit.js. <bandes> : les dossiers où la promo a rendu les bandes-annonces
// verticales (<id>.9x16.mp4 : jeu, h1 à h10), copiées à côté de leur couverture. La vidéo de « La tribune »
// se monte avec ffmpeg : le panorama de nuit qui défile sous le titre, sur les deux premiers blocs du thème
// de l'accueil (musique/audio, vingt-trois secondes).
//
// Les tailles sont celles d'Instagram : l'avatar 1080 × 1080 (montré en rond, à 320) ; les images des
// carrousels 1080 × 1350 (4:5, le plus haut que le fil accepte ; la grille du profil n'en montre que le milieu
// en 3:4, rogné de 34 px de chaque côté : rien d'important à moins de 50 px des bords) ; les couvertures des
// Reels 1080 × 1920 (la grille en garde le milieu, de 240 à 1680 : le titre et l'image y tiennent).
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const K = require('./commun');
const { url, esc, couv, PANO, LIVRES } = K;

const PROMO = K.arg('--promo'), VILLE = K.arg('--ville'), OUT = K.arg('--out'), BANDES = K.arg('--bandes');
if (!PROMO || !VILLE || !OUT) { console.error('usage : instagram_kit.js --promo <livrables> --ville <dossier> --out <dossier> [--bandes <dossiers>]'); process.exit(2); }
const { capture, piece } = K.sources(PROMO, VILLE);

const CSS = `
.etiq{font-size:24px;letter-spacing:.16em;color:var(--or)}
.titre{font-family:var(--pix);font-weight:400;line-height:.95;text-shadow:6px 6px 0 var(--ombre)}
.texte{font-size:30px;line-height:1.5;color:var(--lavande)}
.bloc{position:absolute;left:64px;right:64px;display:grid;gap:26px}
.voile{position:absolute;left:0;right:0}
.signe{position:absolute;right:56px;bottom:50px;display:flex;align-items:center;gap:12px;font:40px/1 var(--pix);color:var(--creme)}
.signe i{display:block;width:50px;height:7px;background:var(--or)}
.plaque{justify-self:start;font-family:var(--pix);font-size:44px;line-height:1;color:var(--or);background:var(--ombre);padding:14px 20px 10px}
`;
const SIGNE = '<div class="signe"><i></i>FUSIBLE</div>';
const GLISSE = '<div class="signe">Glisse <span style="color:var(--or)">→</span></div>';
const br = (s) => esc(s).replace(/\n/g, '<br>');

// une image vue par une fenêtre de 1080 de large : <src> à sa taille (w × h), décalée de (dx, dy)
const fenetre = (top, haut, src, w, h, dx, dy, filtre) => `<div style="position:absolute;left:0;top:${top}px;width:1080px;height:${haut}px;overflow:hidden">
<img src="${src}" style="position:absolute;left:${-dx}px;top:${-dy}px;width:${w}px;height:${h}px${filtre ? ';filter:' + filtre : ''}"></div>`;
// le panorama de nuit au naturel (1950 × 810, un pixel pour un pixel), centré sur le stade (dx = 345)
const ville = (top, haut, { dx = 345, dy = 0, filtre } = {}) => fenetre(top, haut, PANO, 1950, 810, dx, dy, filtre);
// la vignette d'un livre (640 × 360) agrandie d'un nombre entier de fois, sans flou, centrée dans sa fenêtre
const vignette = (id, top, haut, fois, filtre) =>
  fenetre(top, haut, couv(id), 640 * fois, 360 * fois, (640 * fois - 1080) / 2, (360 * fois - haut) / 2, filtre);

// les gabarits : chacun rend un fragment HTML et son format
const G = {
  avatar: () => ({ ...K.avatar(), echelle: 2.7 }),
  avatarStade: () => ({ ...K.avatarStade(), echelle: 2.7 }),
  // la première image d'un carrousel : le titre sur l'encre, une image de la ville dessous, et « Glisse »
  couverture(o) {
    const haut = o.haut || 540;
    return { w: 1080, h: 1350, html: `
${o.image(haut, 1350 - haut)}
<div class="voile" style="top:${haut}px;height:220px;background:linear-gradient(180deg,var(--encre),rgba(18,14,28,0))"></div>
<div class="bloc" style="top:84px">
  <div class="etiq">${esc(o.etiquette)}</div>
  <div class="titre" style="font-size:${o.taille || 112}px">${br(o.titre)}</div>
  <div class="meche" style="width:220px"></div>
  <div class="texte">${br(o.texte)}</div>
</div>
${GLISSE}` };
  },
  // une capture du jeu en plein cadre (l'écran du téléphone, sans le cadre des stores), le texte sur un voile
  ecran(o) {
    const s = 1080 / 1095; // dans la capture de 1290 × 2796, l'écran fait 1095 de large à partir de x = 100
    const voile = o.bas
      ? '<div class="voile" style="top:680px;bottom:0;background:linear-gradient(180deg,rgba(18,14,28,0) 0,rgba(18,14,28,.97) 80px)"></div>'
      : '<div class="voile" style="top:0;height:560px;background:linear-gradient(180deg,rgba(18,14,28,.96) 0%,rgba(18,14,28,.86) 50%,rgba(18,14,28,0) 100%)"></div>';
    return { w: 1080, h: 1350, html: `
<img src="${capture('jeu', o.nom)}" style="position:absolute;left:${(-100 * s).toFixed(1)}px;top:${(-o.y * s).toFixed(1)}px;width:${(1290 * s).toFixed(1)}px;image-rendering:auto">
${voile}
<div class="bloc" style="${o.bas ? 'bottom:84px' : 'top:84px'};gap:22px">
  <div class="etiq">${esc(o.etiquette)}</div>
  <div class="titre" style="font-size:100px">${br(o.titre)}</div>
  <div class="texte" style="color:var(--creme)">${br(o.texte)}</div>
</div>` };
  },
  // le sommaire des dix livres : la première image de leur carrousel
  sommaire() {
    return { w: 1080, h: 1350, html: `
<div class="voile" style="top:0;bottom:0;background:radial-gradient(circle at 85% 0%,#231A3A 0,#120E1C 65%)"></div>
<div class="bloc" style="top:84px;gap:22px">
  <div class="etiq">FUSIBLE · LE SOMMAIRE</div>
  <div class="titre" style="font-size:112px">Dix histoires.</div>
  <div class="texte">Dix rôles. Soixante ans de football,<br>dans une ville qui n'existe pas.</div>
</div>
<div style="position:absolute;left:64px;right:64px;top:440px">
${LIVRES.map(([, titre, , , , heure, c], i) => `<div style="display:grid;grid-template-columns:60px 1fr auto;align-items:baseline;gap:18px;padding:11px 0;border-bottom:2px solid var(--trait)">
  <span style="font-size:24px;color:var(--brume)">${String(i + 1).padStart(2, '0')}</span>
  <span class="pix" style="font-size:52px">${esc(titre)}</span>
  <span class="pix" style="font-size:40px;color:${c}">${esc(heure)}</span></div>`).join('')}
</div>
${GLISSE}` };
  },
  // un livre : sa vignette, son heure, son rôle, sa première ligne
  livre(i) {
    const [id, titre, role, an, div, heure, c, pitch] = LIVRES[i];
    return { w: 1080, h: 1350, html: `
${vignette(id, 0, 720, 2)}
<div class="voile" style="top:560px;height:160px;background:linear-gradient(180deg,rgba(18,14,28,0),var(--encre))"></div>
<div class="pix" style="position:absolute;left:64px;top:628px;padding:8px 16px 6px;font-size:46px;color:${c};background:var(--ombre);border:3px solid ${c}">${esc(heure)}</div>
<div class="bloc" style="top:756px;gap:20px">
  <div style="font-size:24px;letter-spacing:.16em;color:var(--brume)">LIVRE ${i + 1} · ${an}</div>
  <div class="titre" style="font-size:100px">${esc(titre)}</div>
  <div style="font-size:28px;color:${c}">${esc(role)} · ${esc(div)}</div>
  <div class="texte">${esc(pitch)}</div>
</div>
${SIGNE}` };
  },
  // la dernière image d'un carrousel : une question pour les commentaires, et la bêta
  fin(o) {
    return { w: 1080, h: 1350, html: `
${ville(600, 750, { dy: 60, filtre: 'brightness(.85)' })}
<div class="voile" style="top:600px;height:240px;background:linear-gradient(180deg,var(--encre),rgba(18,14,28,0))"></div>
<div class="bloc" style="top:120px;gap:30px">
  <div class="titre" style="font-size:${o.taille || 100}px">${br(o.titre)}</div>
  <div class="meche" style="width:220px"></div>
  <div class="texte" style="color:var(--creme)">${br(o.texte)}</div>
  <div class="plaque" style="margin-top:12px">Bêta bientôt · le lien est en bio</div>
</div>` };
  },
  // la carte du jour : la scène, les deux réponses ; on répond en commentaire avant de glisser
  carte(o) {
    return { w: 1080, h: 1350, html: `
${vignette(o.livre, 0, 1350, 4, 'brightness(.42) saturate(.8)')}
<div class="bloc" style="top:84px"><div class="etiq">LA CARTE DU JOUR · ${esc(o.quand)}</div></div>
<div class="cadre" style="position:absolute;left:64px;right:64px;top:160px;padding:44px 48px;background:var(--panneau);display:grid;gap:30px">
  <div style="font-size:23px;letter-spacing:.12em;color:var(--brume)">${esc(o.qui)}</div>
  <div style="font-size:33px;line-height:1.55">${esc(o.texte)}</div>
  <div style="display:flex;justify-content:space-between;gap:24px;margin-top:6px">
    <div class="pix" style="font-size:44px;color:var(--lavande)">← ${esc(o.gauche[0])}</div>
    <div class="pix" style="font-size:44px;color:var(--lavande);text-align:right">${esc(o.droite[0])} →</div>
  </div>
</div>
<div class="bloc" style="bottom:150px;gap:18px">
  <div class="titre" style="font-size:88px">Gauche ou droite ?</div>
  <div class="texte" style="color:var(--creme)">Réponds en commentaire, puis glisse :<br>le jeu te dit ce qu'il en fait.</div>
</div>
${GLISSE}` };
  },
  // ce que le jeu répond, mot pour mot
  reponse(o, cote) {
    const [label, texte] = o[cote];
    return { w: 1080, h: 1350, html: `
${vignette(o.livre, 0, 1350, 4, 'brightness(.28) saturate(.7)')}
<div class="bloc" style="top:180px;gap:34px">
  <div class="etiq">${cote === 'gauche' ? '← À GAUCHE' : 'À DROITE →'}</div>
  <div class="titre" style="font-size:88px">« ${esc(label)} »</div>
  <div class="meche" style="width:220px"></div>
  <div style="font-size:40px;line-height:1.5">${esc(texte)}</div>
</div>
${SIGNE}` };
  },
  // une pièce de la ville, six fois plus grande que nature, avec ce qu'en dit le jeu
  interieur(o) {
    return { w: 1080, h: 1350, html: `
<div class="voile" style="top:0;bottom:0;background:radial-gradient(circle at 50% 36%,#231A3A 0,#120E1C 70%)"></div>
<img src="${piece(o.lieu)}" style="position:absolute;left:36px;top:100px;width:1008px;height:804px">
<div class="bloc" style="top:950px;gap:18px">
  <div class="titre" style="font-size:76px">${esc(o.nom)}</div>
  <div class="texte">${esc(o.texte)}</div>
</div>
${SIGNE}` };
  },
  // une Une, en portrait : le format du journal, du titre à la légende, en une colonne qui coule
  une(o) {
    return { w: 1080, h: 1350, html: `
<div class="voile" style="top:0;bottom:0;background:#EDE3C8"></div>
<div style="position:absolute;left:64px;right:64px;top:56px;display:grid;gap:22px;color:#1E1712">
  <div style="text-align:center">
    <div style="font:700 66px/1 var(--serif)">${esc(o.journal)}</div>
    <div style="font:italic 24px/1.4 var(--serif);margin-top:10px">${esc(o.devise)}</div>
  </div>
  <div style="display:flex;justify-content:space-between;border-top:4px solid #1E1712;border-bottom:1px solid #1E1712;padding:8px 0;font:20px/1 var(--mono)"><span>${esc(o.lieu)}</span><span>${esc(o.date)}</span><span>${esc(o.prix)}</span></div>
  <div style="font:700 70px/1.04 var(--serif);margin-top:6px">${esc(o.titre)}</div>
  <div style="font:30px/1.5 var(--serif)">${esc(o.sous)}</div>
  <div style="border:3px solid #1E1712;margin-top:6px"><img src="${couv(o.photo)}" style="width:946px;height:532px;filter:grayscale(1) contrast(1.1) sepia(.25);image-rendering:auto"></div>
  <div style="font:italic 22px/1.4 var(--serif);color:#3A2E24;margin-top:-10px">${esc(o.legende)}</div>
</div>
<div class="signe" style="color:#1E1712"><i style="background:#C8102E"></i>FUSIBLE</div>` };
  },
  // le mystère du dossier 1974
  mystere(o) {
    return { w: 1080, h: 1350, html: `
${vignette(o.livre, 0, 1350, 4, 'grayscale(.85) sepia(.35) brightness(.45)')}
<div class="voile" style="top:0;bottom:0;background:linear-gradient(180deg,rgba(18,14,28,.9) 0%,rgba(18,14,28,.7) 60%,rgba(18,14,28,.4) 100%)"></div>
<div class="bloc" style="top:200px;gap:30px">
  <div class="etiq">${esc(o.etiquette)}</div>
  <div class="titre" style="font-size:150px">${esc(o.titre)}</div>
  <div class="meche" style="width:240px"></div>
  <div style="font-size:38px;line-height:1.5">${esc(o.texte)}</div>
</div>
${GLISSE}` };
  },
  // une liste courte (la bêta)
  liste(o) {
    return { w: 1080, h: 1350, html: `
<div class="voile" style="top:0;bottom:0;background:radial-gradient(circle at 85% 8%,#231A3A 0,#120E1C 65%)"></div>
<div class="bloc" style="top:110px;gap:30px">
  <div class="etiq">${esc(o.etiquette)}</div>
  <div class="titre" style="font-size:104px">${br(o.titre)}</div>
  <div class="meche" style="width:220px"></div>
  ${o.points.map((t) => `<div style="display:grid;grid-template-columns:40px 1fr;gap:16px;font-size:36px;line-height:1.45"><span style="color:var(--or)">▪</span><span>${esc(t)}</span></div>`).join('\n  ')}
  ${o.bas ? `<div class="plaque" style="margin-top:20px">${esc(o.bas)}</div>` : ''}
</div>
${SIGNE}` };
  },
  // la couverture d'un Reel : la grille du profil n'en garde que le milieu (de 240 à 1680)
  couvReel(o) {
    return { w: 1080, h: 1920, html: `
${o.image(640, 720)}
<div class="voile" style="top:640px;height:140px;background:linear-gradient(180deg,var(--encre),rgba(18,14,28,0))"></div>
<div class="voile" style="top:1220px;height:140px;background:linear-gradient(180deg,rgba(18,14,28,0),var(--encre))"></div>
<div class="bloc" style="bottom:1300px;gap:20px">
  <div class="etiq">${esc(o.etiquette)}</div>
  <div class="titre" style="font-size:${o.taille || 128}px">${br(o.titre)}</div>
</div>
${o.heure ? `<div class="pix" style="position:absolute;left:64px;top:1296px;padding:8px 16px 6px;font-size:46px;color:${o.couleur};background:var(--ombre);border:3px solid ${o.couleur}">${esc(o.heure)}</div>` : ''}
<div class="bloc" style="top:1410px"><div class="texte" style="color:var(--creme)">${br(o.texte)}</div></div>
<div class="signe" style="bottom:200px"><i></i>FUSIBLE</div>` };
  },
  // la vidéo de « La tribune » : le panorama doublé, qui défile, et le calque du titre posé dessus
  panoramaDouble() {
    return { w: 3900, h: 1620, html: `<img src="${PANO}" style="width:3900px;height:1620px">` };
  },
  calqueMusique() {
    return { w: 1080, h: 1920, transparent: true, html: `
<style>html,body{background:transparent}</style>
<div class="voile" style="top:0;height:300px;background:var(--encre)"></div>
<div class="voile" style="top:300px;height:560px;background:linear-gradient(180deg,var(--encre),rgba(18,14,28,0))"></div>
<div class="bloc" style="top:170px;gap:24px">
  <div class="etiq">LA MUSIQUE DU JEU</div>
  <div class="titre" style="font-size:150px">La tribune</div>
  <div class="meche" style="width:220px"></div>
  <div class="texte" style="color:var(--creme)">Le thème de FUSIBLE, joué par de vrais<br>instruments. Monte le son.</div>
</div>` };
  },
  // l'aperçu du profil quand les deux semaines sont postées : les épinglés d'abord, puis du plus récent au plus
  // ancien, chaque publication rognée en 3:4 comme dans la grille
  grille(cases) {
    const img = (f) => url(path.join(OUT, f));
    return { w: 1080, h: 2540, html: `
<div class="voile" style="top:0;height:600px;background:var(--panneau)"></div>
<img src="${img('profil/avatar_1080.png')}" style="position:absolute;left:56px;top:56px;width:180px;height:180px;border-radius:50%;image-rendering:auto">
<div style="position:absolute;left:280px;top:90px;display:grid;gap:14px">
  <div style="font:700 40px/1 var(--mono)">fusiblegame</div>
  <div style="font-size:24px;color:var(--brume)">${cases.length} publications</div>
</div>
<div style="position:absolute;left:56px;right:56px;top:276px;display:grid;gap:8px;font-size:26px;line-height:1.4">
  <div style="font-weight:700">${esc(NOM)}</div>
  <div style="color:var(--brume)">Jeu vidéo</div>
  <div>${esc(BIO)}</div>
  <div style="color:var(--or)">la page du jeu · la bêta</div>
</div>
<div style="position:absolute;left:0;top:612px;display:grid;grid-template-columns:repeat(3,356px);gap:6px">
${cases.map(([f, type, jour, epingle]) => `<div style="position:relative;width:356px;height:475px;overflow:hidden">
  <img src="${img(f)}" style="width:356px;height:475px;object-fit:cover;image-rendering:auto">
  <span style="position:absolute;right:10px;top:10px;padding:5px 8px;font-size:16px;background:rgba(6,4,11,.82)">${type}</span>
  ${epingle ? '<span style="position:absolute;left:10px;top:10px;padding:5px 8px;font-size:16px;color:var(--encre);background:var(--or)">ÉPINGLÉ</span>' : ''}
  <span style="position:absolute;left:10px;bottom:10px;padding:5px 8px;font-size:18px;background:rgba(6,4,11,.82)">${jour}</span></div>`).join('\n')}
</div>` };
  },
};

// le profil (docs/sortie/instagram.md)
const NOM = 'FUSIBLE · jeu de foot mobile';
const BIO = "Ta carrière de foot en roman noir. 10 histoires, 1990 → 2050, une ville en pixels qui n'oublie rien. Jeu mobile, en français. Bêta bientôt ↓";

// les deux cartes du jour, et ce que le jeu répond (content/cards/entraineur/h1_script.yaml, ds/h6_alarmes.yaml)
const CARTES = [
  { livre: 'promu', quand: '1990', qui: 'MADAME JOSIANE · SECRÉTAIRE DU CLUB · 1990',
    texte: "Dans l'escalier, la photo de la finale de 1974, le cinquième visage gratté au couteau jusqu'au carton. Josiane tend deux clés : « Le bureau, le local à ballons. Les archives, on n'y monte plus. »",
    gauche: ['Je prends les deux', "Elle te les donne sans quitter la photo des yeux. « On ne l'a jamais décrochée. Ni fait réparer. »"],
    droite: ['Le local me suffit', "Elle garde la clé du bureau. En remontant, elle redresse le cadre d'un doigt, sans regarder le trou."] },
  { livre: 'vendre_trente', quand: '2003', qui: 'MADAME JOSIANE · 2003 · LE BUREAU DE LA DIRECTRICE SPORTIVE',
    texte: "Madame Josiane pose les fiches de paie de mars à côté du relevé : il manque quatre cent mille écus. « La banque propose une avance. Le fax de cette nuit propose une vente. Vous choisissez ? »",
    gauche: ["J'appelle la banque", "La Banque Aubérivoise avance l'argent au taux des mauvais jours. Josiane agrafe l'échéancier à gauche, avec les ventes."],
    droite: ["Je vends quelqu'un", 'Tu vends un milieu remplaçant à deux millions, de jour, sans fax. La paie part le 5. Le vestiaire compte les absents.'] },
];
const carteDuJour = (o) => [G.carte(o), G.reponse(o, 'gauche'), G.reponse(o, 'droite'),
  G.fin({ titre: 'Chaque réponse\nlaisse une trace.', texte: 'Elle revient plus tard, sur une autre carte :\n↩ Parce que tu as dit « … »' })];

// les pièces : ce qu'en dit la ville (content/ville.yaml, lieux)
const PIECES = [
  { lieu: 'buvette', nom: 'La buvette du kop', texte: "Le comptoir en zinc, les écharpes au plafond, et la table du fond où personne ne s'assoit sans y être invité." },
  { lieu: 'laverie', nom: 'La laverie', texte: 'Cinq machines, trois qui tournent. Un néon qui clignote au-dessus des sèche-linge. On y attend longtemps.' },
  { lieu: 'hotel', nom: "L'hôtel de la Rive", texte: 'Le hall sent la cire. Ceux qui viennent de la Capitale descendent ici, et ne restent jamais longtemps.' },
  { lieu: 'eglise', nom: "L'église Saint-Aubin", texte: 'La porte est ouverte, la nef est froide, il y a toujours un cierge allumé.' },
  { lieu: 'cinema', nom: "Le cinéma L'Aurore", texte: "Une salle, un film par semaine, et l'affiche qui pâlit dans la vitrine." },
  { lieu: 'brasserie', nom: 'La brasserie du Pont', texte: "Banquettes en moleskine, plat du jour à l'ardoise, une photo de l'équipe de 1962 au-dessus de la caisse." },
];

// les Unes : les mêmes que sur X (x_kit.js)
const UNES = [
  { journal: 'Le Quotidien du Ballon', devise: "Le journal qui siffle avant l'arbitre", lieu: 'AUBÉRIVE', date: 'JEUDI 7 MARS 1991', prix: '5 F',
    titre: "L'ULTIMATUM TIENT SUR UNE LIGNE", sous: "Trois matchs, dit la ligne, point final. Le club dément l'avoir écrite ; personne ne dément l'avoir lue.",
    photo: 'promu', legende: 'La Rive, un soir de match. Le bureau du président est la fenêtre éclairée.' },
  { journal: 'La Gazette', devise: 'Le sport, la ville, et ce qu’on en dit', lieu: 'AUBÉRIVE', date: 'LUNDI 2 DÉCEMBRE 1991', prix: '4 F',
    titre: 'PLACE AU JEUNE, DIT LA TRIBUNE', sous: "Le virage a chanté un autre prénom pendant vingt minutes, et il l'a bien chanté. Ce n'est pas une insulte ; c'est une date.",
    photo: 'fin_de_contrat', legende: 'La route de la Rive, après le match.' },
];

const livreReel = (i) => {
  const [id, titre, , an, , heure, c, pitch] = LIVRES[i];
  return { etiquette: `LIVRE ${i + 1} · ${an}`, titre, image: (t, h) => vignette(id, t, h, 2), heure, couleur: c, texte: pitch };
};
const P = 'posts/', S = 'la_suite/';
const carrousel = (dossier, images) => images.map((g, k) => [dossier + '/' + String(k + 1).padStart(2, '0') + '.png', g]);

const LISTE = [
  ['profil/avatar_1080.png', G.avatar()],
  ['profil/avatar_1080_stade.png', G.avatarStade()],
  ...carrousel(P + '01_carrousel_auberive', [
    G.couverture({ etiquette: 'FUSIBLE · LA VILLE', titre: 'Bienvenue\nà Aubérive.', texte: "Une ville qui n'existe pas, de 1990 à 2050.\nElle se souvient de tout.", image: (t, h) => ville(t, h) }),
    G.ecran({ nom: '02_une_ville_en_pixels_qui_se_souvient.png', y: 1000, etiquette: 'ENTRE DEUX CARTES', titre: 'Tu vis ici.', texte: "Tu touches la ville pour marcher.\nEn rouge : là où l'on t'attend." }),
    G.ecran({ nom: '05_pousse_la_porte_on_te_reconnait.png', y: 736, etiquette: 'POUSSE LA PORTE', titre: 'On te reconnaît.', texte: 'Les gens retiennent ce que tu fais pour eux.\nEt ce que tu leur dois.' }),
    G.ecran({ nom: '04_le_samedi_cinq_secondes_pour_decider.png', y: 1411, etiquette: 'LE SAMEDI, À LA RIVE', titre: 'Cinq secondes.', texte: "Le match s'arrête sur une action.\nDeux gestes. À toi de choisir." }),
    G.fin({ titre: "Dix histoires\nt'y attendent.", texte: 'Une carrière de football de 1990 à 2050,\nen roman noir, sur ton téléphone.' }),
  ]),
  ...carrousel(P + '02_carrousel_dix_histoires', [
    G.sommaire(),
    ...LIVRES.map((l, i) => G.livre(i)),
    G.fin({ titre: 'Lequel tu ouvres\nen premier ?', texte: 'Dis-le en commentaire.' }),
  ]),
  [P + '03_reel_bande_annonce/couverture.png', G.couvReel({ etiquette: 'LA BANDE-ANNONCE', titre: 'FUSIBLE', taille: 170, image: (t, h) => ville(t, h, { dy: 90 }), texte: 'Ta carrière de football, en roman noir.\nDix histoires, de 1990 à 2050.' })],
  ...carrousel(P + '04_carrousel_carte_du_jour_1', carteDuJour(CARTES[0])),
  [P + '05_reel_23h58/couverture.png', G.couvReel(livreReel(5))],
  ...carrousel(P + '06_carrousel_39_pieces', [
    G.couverture({ etiquette: 'LES COULISSES', titre: '39 pièces,\nmodelées à la main.', taille: 96, haut: 520, texte: "On entre dans chacune.\nQuelqu'un t'y attend toujours.",
      image: (t, h) => `<img src="${piece('bar')}" style="position:absolute;left:36px;top:${t + Math.round((h - 804) / 2)}px;width:1008px;height:804px">` }),
    ...PIECES.map((p) => G.interieur(p)),
    G.fin({ titre: 'Laquelle tu pousses\nen premier ?', texte: 'Dis-le en commentaire.' }),
  ]),
  [P + '07_reel_la_tribune/couverture.png', G.couvReel({ etiquette: 'LA MUSIQUE DU JEU', titre: 'La tribune', image: (t, h) => ville(t, h, { dx: 870, dy: 40 }), texte: 'Le thème de FUSIBLE, joué par de vrais\ninstruments. Monte le son.' })],
  ...carrousel(P + '08_carrousel_carte_du_jour_2', carteDuJour(CARTES[1])),
  ...carrousel(P + '09_carrousel_beta', [
    G.couverture({ etiquette: 'AVANT LA SORTIE', titre: 'On cherche\ncinquante testeurs.', taille: 100, texte: 'Gratuit · sur téléphone · en français', image: (t, h) => ville(t, h, { dx: 0 }) }),
    G.liste({ etiquette: 'CE QUE TU FAIS', titre: 'Tu joues.\nTu nous dis.', points: ['Une histoire, à ton rythme, sur ton téléphone.', 'Ce qui coince, ce qui ennuie, ce qui plaît : tout nous sert.', 'Dans le jeu, « Donner mon avis » prépare ton rapport.'] }),
    G.liste({ etiquette: 'CE QUE TU Y GAGNES', titre: 'Ton nom\nau générique.', points: ['Le titre « Membre fondateur » dans le jeu.', 'Le jeu offert à sa sortie.'], bas: 'Inscription : le lien est en bio' }),
  ]),
  [P + '10_reel_trois_mille_visages/couverture.png', G.couvReel(livreReel(0))],
  // la suite (semaines 3 à 6) : les livres que le calendrier des réseaux garde pour plus tard (reseaux.md)
  [S + '11_reel_la_sirene/couverture.png', G.couvReel(livreReel(2))],
  ...carrousel(S + '12_carrousel_les_unes', [
    G.une(UNES[0]), G.une(UNES[1]),
    G.fin({ titre: '548 manchettes,\nde 1990 à 2050.', texte: "La presse d'Aubérive suit ta carrière.\nCelle de demain dépend de toi." }),
  ]),
  [S + '13_reel_l_oreillette/couverture.png', G.couvReel(livreReel(7))],
  ...carrousel(S + '14_carrousel_dossier_1974', [
    G.mystere({ livre: 'promu', etiquette: 'LE DOSSIER 1974', titre: 'Cinq visages.', texte: "Une photo de la finale, dans l'escalier du club. Le cinquième visage a été gratté au couteau, jusqu'au carton." }),
    G.ecran({ nom: '10_le_dossier_1974_d_une_vie_a_l_autre.png', y: 640, bas: true, etiquette: "D'UNE VIE À L'AUTRE", titre: 'Douze pièces.', texte: "Une au moins par livre. Le dossier se garde\nd'une carrière à l'autre." }),
    G.fin({ titre: 'Qui ? Pourquoi ?', texte: 'Tes théories en commentaire.' }),
  ]),
  [S + '15_reel_chambre_12/couverture.png', G.couvReel(livreReel(6))],
  [S + '16_reel_vingt_degres_dedans/couverture.png', G.couvReel(livreReel(8))],
  [S + '17_reel_les_deux_telephones/couverture.png', G.couvReel(livreReel(9))],
  ['travail/panorama_x2.png', G.panoramaDouble()],
  ['travail/calque_musique.png', G.calqueMusique()],
  // en dernier : l'aperçu de la grille lit les images rendues plus haut
  ['apercu_grille.png', G.grille([
    [P + '03_reel_bande_annonce/couverture.png', 'REEL', 'J1', true],
    [P + '02_carrousel_dix_histoires/01.png', 'CARROUSEL', 'J1', true],
    [P + '09_carrousel_beta/01.png', 'CARROUSEL', 'J12', true],
    [P + '10_reel_trois_mille_visages/couverture.png', 'REEL', 'J14'],
    [P + '08_carrousel_carte_du_jour_2/01.png', 'CARROUSEL', 'J11'],
    [P + '07_reel_la_tribune/couverture.png', 'REEL', 'J9'],
    [P + '06_carrousel_39_pieces/01.png', 'CARROUSEL', 'J7'],
    [P + '05_reel_23h58/couverture.png', 'REEL', 'J5'],
    [P + '04_carrousel_carte_du_jour_1/01.png', 'CARROUSEL', 'J3'],
    [P + '01_carrousel_auberive/01.png', 'CARROUSEL', 'J1'],
  ])],
];

// les Reels et leur bande-annonce (<id>.9x16.mp4)
const REELS = [[P + '03_reel_bande_annonce', 'jeu'], [P + '05_reel_23h58', 'h6'], [P + '10_reel_trois_mille_visages', 'h1'],
  [S + '11_reel_la_sirene', 'h3'], [S + '13_reel_l_oreillette', 'h8'], [S + '15_reel_chambre_12', 'h7'],
  [S + '16_reel_vingt_degres_dedans', 'h9'], [S + '17_reel_les_deux_telephones', 'h10']];

function videos() {
  const dossiers = (BANDES || '').split(',').filter(Boolean);
  for (const [dossier, id] of REELS) {
    const src = dossiers.map((d) => path.join(d, id + '.9x16.mp4')).find((f) => fs.existsSync(f));
    if (!src) { console.warn(`pas de ${id}.9x16.mp4 : ${dossier} reste sans vidéo`); continue; }
    fs.copyFileSync(src, path.join(OUT, dossier, 'video.mp4'));
    console.log('vidéo :', dossier);
  }
  // « La tribune » : l'introduction du thème de l'accueil et le début de son premier passage, coupés à
  // l'échantillon près sur les positions du manifeste, sous le panorama qui défile de gauche à droite
  const audio = path.join(K.WEB, 'musique', 'audio');
  const m = JSON.parse(fs.readFileSync(path.join(audio, 'manifeste.json'), 'utf8'));
  const [b0, b1] = m.themes.accueil.blocs;
  const duree = (b1.a / m.frequence).toFixed(3);
  const trav = path.join(OUT, 'travail');
  execFileSync('ffmpeg', ['-y', '-v', 'error',
    '-loop', '1', '-framerate', '30', '-i', path.join(trav, 'panorama_x2.png'),
    '-loop', '1', '-framerate', '30', '-i', path.join(trav, 'calque_musique.png'),
    '-i', path.join(audio, b0.fichier), '-i', path.join(audio, b1.fichier),
    '-filter_complex',
    `[2:a]atrim=start_sample=${b0.de - b0.debut}:end_sample=${b0.a - b0.debut},asetpts=PTS-STARTPTS[a0];` +
    `[3:a]atrim=start_sample=${b1.de - b1.debut}:end_sample=${b1.a - b1.debut},asetpts=PTS-STARTPTS[a1];` +
    `[a0][a1]concat=n=2:v=0:a=1,afade=t=out:st=${(duree - 1.2).toFixed(3)}:d=1.2[a];` +
    `color=c=0x120E1C:s=1080x1920:r=30:d=${duree}[f];` +
    `[0:v]crop=1080:1620:x='2820*t/${duree}':y=0[p];[f][p]overlay=0:300[b];` +
    `[b][1:v]overlay=0:0,fade=t=out:st=${(duree - 0.6).toFixed(3)}:d=0.6:color=0x120E1C,format=yuv420p[v]`,
    '-map', '[v]', '-map', '[a]', '-t', duree, '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
    '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', path.join(OUT, P + '07_reel_la_tribune', 'video.mp4')]);
  console.log('vidéo :', P + '07_reel_la_tribune');
}

K.rendre(LISTE, OUT, CSS).then(videos);
