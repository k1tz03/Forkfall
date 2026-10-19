#!/usr/bin/env node
// LE KIT X (docs/sortie/x.md) : l'avatar, la bannière et les images des premiers posts du compte
// @fusiblegame, rendus par Chromium (Playwright) dans la palette de l'accueil du jeu : l'encre de
// prune, le crème, l'or de la mèche, la police pixel Jersey 15, les couvertures des dix livres.
//
//   NODE_PATH=/opt/node22/lib/node_modules node packages/tools/web/promo/reseaux/x_kit.js \
//     --promo <livrables de la promo> --ville <dossier des images de la ville> --out <dossier>
//
// <livrables> : le dossier de packages/tools/web/promo (captures/jeu/apple, captures/h1/apple) ;
// <ville> : celui que lit assemble.js --ville (les pièces, int_<lieu>_nuit.webp). Les tailles sont
// celles de X : l'avatar 400 × 400 (rogné en rond), la bannière 1500 × 500 (l'avatar mord sur son
// coin bas gauche, le téléphone rogne le haut et le bas), les images 1200 × 675 (16:9, sans rognage).
'use strict';
const K = require('./commun');
const { esc, couv, PANO, LIVRES } = K;

const PROMO = K.arg('--promo'), VILLE = K.arg('--ville'), OUT = K.arg('--out');
if (!PROMO || !VILLE || !OUT) { console.error('usage : x_kit.js --promo <livrables> --ville <dossier> --out <dossier>'); process.exit(2); }
const { capture, piece } = K.sources(PROMO, VILLE);

// les gabarits : chacun rend un fragment HTML et son format
const G = {
  avatar: K.avatar,
  avatarStade: K.avatarStade,
  banniere() {
    return { w: 1500, h: 500, html: `
<img src="${PANO}" style="position:absolute;left:-60px;top:-150px;width:1620px;height:auto">
<div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(18,14,28,.05) 0%,rgba(18,14,28,.25) 38%,rgba(18,14,28,.86) 64%,rgba(18,14,28,.94) 100%)"></div>
<div style="position:absolute;right:90px;top:92px;width:610px;display:grid;gap:18px">
  <div class="pix" style="font-size:150px;letter-spacing:.02em;text-shadow:7px 7px 0 var(--ombre)">FUSIBLE</div>
  <div class="meche" style="width:300px"></div>
  <div class="pix" style="font-size:44px;line-height:1.1;text-shadow:3px 3px 0 var(--ombre)">Ta carrière de football,<br>en roman noir.</div>
  <div style="font-size:22px;color:var(--lavande);letter-spacing:.04em">Dix histoires · 1990 → 2050 · bêta bientôt</div>
</div>` };
  },
  livre(i) {
    const [id, titre, role, an, div, heure, c, pitch] = LIVRES[i];
    return { w: 1200, h: 675, html: `
<div style="position:absolute;left:48px;top:120px" class="cadre"><img src="${couv(id)}" style="width:704px;height:396px"></div>
<div class="pix" style="position:absolute;left:66px;top:470px;padding:6px 12px 4px;font-size:34px;color:${c};background:var(--ombre);border:3px solid ${c}">${esc(heure)}</div>
<div style="position:absolute;left:48px;top:54px;font-size:20px;letter-spacing:.16em;color:var(--brume)">FUSIBLE · DIX HISTOIRES DE 1990 À 2050</div>
<div style="position:absolute;left:800px;top:120px;width:352px;display:grid;gap:16px">
  <div style="font-size:19px;letter-spacing:.14em;color:var(--brume)">LIVRE ${i + 1} · ${an}</div>
  <div class="pix" style="font-size:58px;line-height:1.02">${esc(titre)}</div>
  <div style="font-size:19px;color:${c}">${esc(role)} · ${esc(div)}</div>
  <div style="font-size:19px;line-height:1.55;color:var(--lavande)">${esc(pitch)}</div>
</div>
<div class="marque"><i></i>FUSIBLE</div>` };
  },
  carte(o) {
    return { w: 1200, h: 675, html: `
<img src="${couv(o.livre)}" style="position:absolute;inset:0;width:1200px;height:675px;object-fit:cover;filter:brightness(.55)">
<div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(18,14,28,.2),rgba(18,14,28,.75))"></div>
<div style="position:absolute;left:44px;top:40px;font-size:22px;letter-spacing:.16em;color:var(--or)">LA CARTE DU JOUR</div>
<div class="cadre" style="position:absolute;left:230px;top:100px;width:740px;padding:34px 40px;background:var(--panneau);display:grid;gap:22px">
  <div style="font-size:19px;letter-spacing:.12em;color:var(--brume)">${esc(o.qui)}</div>
  <div style="font-size:25px;line-height:1.55">${esc(o.texte)}</div>
  <div style="display:flex;justify-content:space-between;gap:20px;margin-top:6px">
    <div class="pix" style="font-size:32px;color:var(--lavande)">← ${esc(o.gauche)}</div>
    <div class="pix" style="font-size:32px;color:var(--lavande);text-align:right">${esc(o.droite)} →</div>
  </div>
</div>
<div style="position:absolute;left:230px;top:${o.basSondage || 560}px;font-size:20px;color:var(--lavande)">Gauche ou droite ? Réponds dans le sondage.</div>
<div class="marque"><i></i>FUSIBLE</div>` };
  },
  une(o) {
    return { w: 1200, h: 675, html: `
<div style="position:absolute;inset:0;background:#EDE3C8"></div>
<div style="position:absolute;left:60px;right:60px;top:34px;text-align:center;color:#1E1712">
  <div style="font:700 64px/1 var(--serif);letter-spacing:.01em">${esc(o.journal)}</div>
  <div style="font:italic 19px/1.4 var(--serif);margin-top:8px">${esc(o.devise)}</div>
  <div style="display:flex;justify-content:space-between;border-top:3px solid #1E1712;border-bottom:1px solid #1E1712;margin-top:14px;padding:6px 0;font:16px/1 var(--mono)"><span>${esc(o.lieu)}</span><span>${esc(o.date)}</span><span>${esc(o.prix)}</span></div>
</div>
<div style="position:absolute;left:60px;top:200px;width:560px;color:#1E1712;display:grid;gap:18px">
  <div style="font:700 50px/1.06 var(--serif)">${esc(o.titre)}</div>
  <div style="font:23px/1.5 var(--serif)">${esc(o.sous)}</div>
</div>
<div style="position:absolute;left:660px;top:206px;width:480px;border:2px solid #1E1712"><img src="${couv(o.photo)}" style="width:476px;height:268px;filter:grayscale(1) contrast(1.1) sepia(.25)"></div>
<div style="position:absolute;left:660px;top:486px;width:480px;font:italic 16px/1.4 var(--serif);color:#3A2E24">${esc(o.legende)}</div>
<div style="position:absolute;right:44px;bottom:30px;display:flex;align-items:center;gap:10px;font:30px/1 var(--pix);color:#1E1712"><i style="display:block;width:40px;height:6px;background:#C8102E"></i>FUSIBLE</div>` };
  },
  telephones(o) {
    const n = o.images.length, h = 590, w = Math.round(h * 480 / 1040), gap = 36;
    const total = n * w + (n - 1) * gap, x0 = o.titre ? 1200 - 60 - total : Math.round((1200 - total) / 2);
    return { w: 1200, h: 675, html: `
<div style="position:absolute;inset:0;background:radial-gradient(circle at 70% 40%,#231A3A 0,#120E1C 70%)"></div>
${o.titre ? `<div style="position:absolute;left:56px;top:120px;width:${x0 - 110}px;display:grid;gap:22px">
  <div class="pix" style="font-size:62px;line-height:1.02">${esc(o.titre)}</div><div class="meche" style="width:140px"></div>
  <div style="font-size:21px;line-height:1.55;color:var(--lavande)">${esc(o.texte || '')}</div></div>` : ''}
${o.images.map((src, k) => `<img src="${src}" class="cadre" style="position:absolute;left:${x0 + k * (w + gap)}px;top:${Math.round((675 - h) / 2)}px;width:${w}px;height:${h}px;image-rendering:auto">`).join('')}
${o.titre ? '' : '<div class="marque"><i></i>FUSIBLE</div>'}` };
  },
  mystere(o) {
    return { w: 1200, h: 675, html: `
<img src="${couv(o.livre)}" style="position:absolute;inset:0;width:1200px;height:675px;object-fit:cover;filter:grayscale(.85) sepia(.35) brightness(.5)">
<div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(18,14,28,.92) 0%,rgba(18,14,28,.75) 55%,rgba(18,14,28,.3) 100%)"></div>
<div style="position:absolute;left:70px;top:130px;width:700px;display:grid;gap:24px">
  <div style="font-size:22px;letter-spacing:.16em;color:var(--or)">${esc(o.sur)}</div>
  <div class="pix" style="font-size:92px;line-height:.95;text-shadow:6px 6px 0 var(--ombre)">${esc(o.titre)}</div>
  <div class="meche" style="width:200px"></div>
  <div style="font-size:25px;line-height:1.55;color:var(--creme)">${esc(o.texte)}</div>
</div>
<div class="marque"><i></i>FUSIBLE</div>` };
  },
  pieces(o) {
    return { w: 1200, h: 675, html: `
<div style="position:absolute;inset:0;background:radial-gradient(circle at 75% 50%,#231A3A 0,#120E1C 70%)"></div>
<div style="position:absolute;left:56px;top:150px;width:380px;display:grid;gap:22px">
  <div class="pix" style="font-size:66px;line-height:1">39 pièces,<br>modelées<br>à la main.</div><div class="meche" style="width:140px"></div>
  <div style="font-size:20px;line-height:1.55;color:var(--lavande)">On entre dans chacune. Quelqu'un t'y attend toujours.</div></div>
<div style="position:absolute;left:480px;top:56px;display:grid;grid-template-columns:repeat(2,336px);gap:26px 30px">
${o.lieux.map(([l, nom]) => `<figure style="display:grid;gap:8px"><img src="${piece(l)}" class="cadre" style="width:336px;height:268px;object-fit:contain;background:#0B0812">
<figcaption style="font-size:17px;color:var(--brume)">${esc(nom)}</figcaption></figure>`).join('')}
</div>` };
  },
  beta() {
    return { w: 1200, h: 675, html: `
<img src="${PANO}" style="position:absolute;left:-100px;top:-60px;width:1400px;height:auto;filter:brightness(.5)">
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,14,28,.3),rgba(18,14,28,.85))"></div>
<div style="position:absolute;left:70px;top:150px;display:grid;gap:24px;width:900px">
  <div style="font-size:22px;letter-spacing:.16em;color:var(--or)">AVANT LA SORTIE</div>
  <div class="pix" style="font-size:96px;line-height:.95;text-shadow:6px 6px 0 var(--ombre)">On cherche<br>cinquante testeurs.</div>
  <div class="meche" style="width:220px"></div>
  <div style="font-size:26px;line-height:1.5;color:var(--creme)">Gratuit · sur téléphone · en français<br>Ton nom au générique du jeu.</div>
</div>
<div class="marque"><i></i>FUSIBLE</div>` };
  },
  ecranMusique() {
    return { w: 1280, h: 720, html: `
<img src="${PANO}" style="position:absolute;left:-200px;top:-40px;width:1680px;height:auto;filter:brightness(.6)">
<div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(18,14,28,.1),rgba(18,14,28,.85) 60%)"></div>
<div style="position:absolute;right:90px;top:200px;width:560px;display:grid;gap:22px">
  <div style="font-size:22px;letter-spacing:.16em;color:var(--or)">LA MUSIQUE DU JEU</div>
  <div class="pix" style="font-size:96px;line-height:.95;text-shadow:6px 6px 0 var(--ombre)">La tribune</div>
  <div class="meche" style="width:200px"></div>
  <div style="font-size:24px;line-height:1.5;color:var(--lavande)">Le thème de FUSIBLE, joué par de vrais instruments. Monte le son.</div>
</div>` };
  },
};

const LISTE = [
  ['profil/avatar_400.png', G.avatar()],
  ['profil/avatar_400_stade.png', G.avatarStade()],
  ['profil/banniere_1500x500.png', G.banniere()],
  ...LIVRES.map((l, i) => ['posts/02_fil_dix_livres/livre_' + String(i + 1).padStart(2, '0') + '.png', G.livre(i)]),
  ['posts/03_carte_du_jour_livre1.png', G.carte({ livre: 'promu', qui: 'MADAME JOSIANE · SECRÉTAIRE DU CLUB · 1990',
    texte: "Dans l'escalier, la photo de la finale de 1974, le cinquième visage gratté au couteau jusqu'au carton. Josiane tend deux clés : « Le bureau, le local à ballons. Les archives, on n'y monte plus. »",
    gauche: 'Je prends les deux', droite: 'Le local me suffit' })],
  ['posts/04_la_ville.png', G.telephones({ images: [capture('jeu', '02_une_ville_en_pixels_qui_se_souvient.png'), capture('jeu', '04_le_samedi_cinq_secondes_pour_decider.png'), capture('jeu', '05_pousse_la_porte_on_te_reconnait.png')] })],
  ['posts/05_une_ultimatum.png', G.une({ journal: 'Le Quotidien du Ballon', devise: "Le journal qui siffle avant l'arbitre", lieu: 'AUBÉRIVE', date: 'JEUDI 7 MARS 1991', prix: '5 F',
    titre: "L'ULTIMATUM TIENT SUR UNE LIGNE", sous: "Trois matchs, dit la ligne, point final. Le club dément l'avoir écrite ; personne ne dément l'avoir lue.",
    photo: 'promu', legende: 'La Rive, un soir de match. Le bureau du président est la fenêtre éclairée.' })],
  ['posts/06_samedi.png', G.telephones({ images: [capture('jeu', '04_le_samedi_cinq_secondes_pour_decider.png')], titre: 'Le samedi, cinq secondes.',
    texte: "À la Rive, le match s'arrête sur une action. Deux gestes. Cinq secondes pour choisir." })],
  ['posts/07_pieces.png', G.pieces({ lieux: [['bar', 'Le Corner, le bar des supporters'], ['hotel', "L'hôtel de la Rive"], ['laverie', 'La laverie, la nuit'], ['cafe_mairie', 'Le café de la Mairie']] })],
  ['posts/08_dossier_1974.png', G.mystere({ livre: 'promu', sur: 'LE DOSSIER 1974', titre: 'Cinq visages.',
    texte: "Une photo de la finale, dans l'escalier du club. Le cinquième visage a été gratté au couteau, jusqu'au carton. Dix carrières pour comprendre pourquoi." })],
  ['posts/11_carte_du_jour_livre6.png', G.carte({ livre: 'vendre_trente', qui: 'MADAME JOSIANE · 2003 · LE BUREAU DE LA DIRECTRICE SPORTIVE',
    texte: "Madame Josiane pose les fiches de paie de mars à côté du relevé : il manque quatre cent mille écus. « La banque propose une avance. Le fax de cette nuit propose une vente. Vous choisissez ? »",
    gauche: "J'appelle la banque", droite: 'Je vends quelqu’un' })],
  ['posts/12_beta.png', G.beta()],
  ['posts/13_une_place_au_jeune.png', G.une({ journal: 'La Gazette', devise: 'Le sport, la ville, et ce qu’on en dit', lieu: 'AUBÉRIVE', date: 'LUNDI 2 DÉCEMBRE 1991', prix: '4 F',
    titre: 'PLACE AU JEUNE, DIT LA TRIBUNE', sous: "Le virage a chanté un autre prénom pendant vingt minutes, et il l'a bien chanté. Ce n'est pas une insulte ; c'est une date.",
    photo: 'fin_de_contrat', legende: 'La route de la Rive, après le match.' })],
  ['travail/ecran_musique.png', G.ecranMusique()],
];

K.rendre(LISTE, OUT);
