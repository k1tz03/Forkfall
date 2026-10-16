/* ═══════════════════════════════════════════════════════════════════════════
   « La seconde manche » — livre 9, « Vingt degrés dedans » (2029-2031, la
   sélectionneuse des Cobalts ; la couleur du livre : #DDEFFF, la glace).

   La veille du barrage aller, novembre 2029, cinq heures du matin, rue des Lilas.
   Aubérive gèle ; dans la rue, une seule chose est chaude : le four de la
   boulangerie Marçais. Ce que le film montre, et pourquoi :
     · la rue sous la neige, les lampadaires froids (en 2029, des diodes), et la
       seule vitrine allumée ; contre le mur, les caisses à pain vides sous la
       neige (le vélo de Kévin n'y est pas : il est à la cave, le livre le dit) ;
     · le fournil : le four à soles, une porte ouverte, les baguettes, la farine
       dans la lumière ;
     · sur le marbre fariné, la chemise de travail de Kévin (électricien sur le
       chantier du Dôme : sl.h9.pro4_listes), noire, à plat : il lui reste une manche ; l'autre entournure
       est nue, effilochée — la première manche est devenue le brassard du
       capitaine (sl.h9.pro5_brassard). Les ciseaux de tailleur mordent la couture
       de l'épaule, la coupe commencée. L'étiquette cousue : K. MARÇAIS ;
     · au-dessus de la caisse, Kévin en casque de chantier, qui rit, punaisé de
       travers (sl.h9.pro3_pain ; art.js : une photo, imprimée) ; sur le comptoir,
       le sac à pain mis de côté, une baguette dedans, qui attend ;
     · en haut, dans le coin, la télévision sans le son : le Dôme d'Al-Dorado sous
       un soleil blanc, vingt degrés dedans ; derrière la vitre, la neige.
   Il se joue avant sl.h9.a4_manche* (S0, créneau 16 : toutes les carrières y
   passent) : la carte où Marie-Jo glisse un second brassard noir dans le sac à
   pain. Le film s'arrête avant : la manche n'est pas encore coupée, le sac est
   vide ; il ne dit pas à qui elle ira, la carte le demande. « Manche », c'est
   aussi la manche d'un barrage : demain, l'aller.

   LES PLANS (38,5 s) — la lumière, ce que chaque plan dit
   | 1 | 0–5,8    | la rue, de haut, puis à hauteur de vitrine : la neige dans les diodes
   |   |          | froides, la vapeur du fournil, les caisses sous la neige ; « Aubérive,
   |   |          | rue des Lilas / La veille du barrage aller · 5 h 10 » | où, quand ; le
   |   |          | seul endroit chaud de la ville
   | 2 | 5,8–11   | le fournil : le four à soles, une porte ouverte, rouge-orange ; les
   |   |          | baguettes ; la farine qui flotte dans la lueur (porte : le four) | le pain
   |   |          | se fait la nuit, comme toujours
   | 3 | 11–16,8  | le marbre, de haut, la caméra qui descend : la chemise noire à une
   |   |          | manche, l'entournure nue, les ciseaux ouverts dans la couture de l'épaule,
   |   |          | l'étiquette K. MARÇAIS ; l'ampoule nue | l'objet du livre : le brassard
   |   |          | sort d'une chemise de chantier ; le second est en route
   | 4 | 16,8–23  | la photo de Kévin au-dessus de la caisse, puis le sac à pain mis de
   |   |          | côté ; Marie-Jo, hors champ, à la photo : « Ta chemise, je l'ai lavée
   |   |          | deux fois. Elle sent encore le chantier. » | le deuil, la seule
   |   |          | réplique ; le sac attend
   | 5 | 23–29,6  | la télévision sans le son, en haut du coin (le bruit « nouvelle ») : le
   |   |          | Dôme sous un soleil blanc, « 20 °C » ; derrière la vitre, la neige | là-
   |   |          | bas, vingt degrés dedans
   | 6 | 29,6–38,5| la rue, de l'autre trottoir : la boulangerie, seule allumée ; « Aubérive ·
   |   |          | 2029 / Vingt degrés dedans » | le titre
   Le mouvement réduit : une image par plan (`fixe`). La coupe de 30 s (`montages.court`)
   garde les six plans, resserrés. La musique : livre_h9 (les cloches de glace, la
   ventilation), `ville_nuit` en secours.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var FC = global.FusibleCinema;
  var PI = Math.PI;
  var GLACE = "#DDEFFF";

  // la taille d'une toile selon la qualité (les textures d'un téléphone sont à la moitié)
  function tt(K, n) { return Math.max(64, Math.round(n * (K.qualiteTextures || 1) / 16) * 16); }
  function garderMat(K, m) { K.garder(m); return m; }

  // ─── LES MATIÈRES DU FILM (peintes ici : elles ne servent qu'à lui) ─────────
  // la neige au sol : un blanc bleuté, des congères, des traces de pas et de pneus
  function toileNeige(K, o) {
    var W = tt(K, o.taille || 512), c = K.tex.canvas(W, W), x = c.getContext("2d");
    var n = K.tex.couche(W, W, { periode: 4, octaves: 4, graine: o.graine || "neige-sol" });
    var im = x.createImageData(W, W), d = im.data;
    for (var p = 0, q = 0; p < n.length; p++, q += 4) {
      var v = n[p], a = K.lisse(o.seuil || 0.32, (o.seuil || 0.32) + 0.22, v);
      var l = 205 + v * 40;
      d[q] = l * 0.93; d[q + 1] = l * 0.96; d[q + 2] = Math.min(255, l * 1.05); d[q + 3] = 255 * a * (o.opacite || 1);
    }
    x.putImageData(im, 0, 0);
    if (o.traces) {
      // deux traces de pneus, sombres et mouillées, et des pas
      x.globalCompositeOperation = "destination-out";
      [0.36, 0.64].forEach(function (u) { var g = x.createLinearGradient(W * (u - 0.06), 0, W * (u + 0.06), 0); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(0.5, "rgba(0,0,0,0.85)"); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.fillRect(W * (u - 0.06), 0, W * 0.12, W); });
      x.globalCompositeOperation = "source-over";
    }
    if (o.pas) {
      var r = K.alea(o.graine + "pas");
      for (var i = 0; i < 26; i++) { x.fillStyle = "rgba(120,130,150,0.35)"; x.beginPath(); x.ellipse(W * (0.42 + (i % 2) * 0.12 + (r() - 0.5) * 0.04), (i / 26) * W, W * 0.02, W * 0.034, 0.1, 0, 7); x.fill(); }
    }
    return K.tex.texture(c, { repete: o.repete });
  }
  // le carrelage blanc du fournil : des carreaux, des joints gris, la farine et la suie
  function toileCarrelage(K) {
    var W = tt(K, 512), c = K.tex.canvas(W, W), x = c.getContext("2d"), n = 8, s = W / n, r = K.alea("carreaux");
    x.fillStyle = "#8f8a80"; x.fillRect(0, 0, W, W);
    for (var j = 0; j < n; j++) for (var i = 0; i < n; i++) {
      var k = 0.86 + r() * 0.1; x.fillStyle = "rgb(" + (228 * k | 0) + "," + (224 * k | 0) + "," + (214 * k | 0) + ")";
      x.fillRect(i * s + 2, j * s + 2, s - 4, s - 4);
      var g = x.createLinearGradient(0, j * s, 0, j * s + s); g.addColorStop(0, "rgba(255,255,255,0.12)"); g.addColorStop(1, "rgba(0,0,0,0.08)");
      x.fillStyle = g; x.fillRect(i * s + 2, j * s + 2, s - 4, s - 4);
    }
    var tache = K.tex.couche(W, W, { periode: 3, octaves: 3, graine: "fournil-suie" }), im = x.getImageData(0, 0, W, W), d = im.data;
    for (var p = 0, q = 0; p < tache.length; p++, q += 4) { var m = 1 - Math.max(0, tache[p] - 0.55) * 0.9; d[q] *= m; d[q + 1] *= m * 0.98; d[q + 2] *= m * 0.94; }
    x.putImageData(im, 0, 0);
    return K.tex.texture(c, { repete: [3, 2] });
  }
  // le marbre du pétrin : un blanc gris veiné, et la farine en nappes
  function toileMarbre(K) {
    var W = tt(K, 1024), c = K.tex.canvas(W, Math.round(W / 2)), x = c.getContext("2d"), H = Math.round(W / 2);
    var n = K.tex.couche(W, H, { periode: 3, octaves: 5, graine: "marbre", rapportX: 2 }), f = K.tex.couche(W, H, { periode: 5, octaves: 4, graine: "farine", rapportX: 2 });
    var im = x.createImageData(W, H), d = im.data, rg = K.alea("marbre-grains");
    for (var p = 0, q = 0; p < n.length; p++, q += 4) {
      // un marbre gris clair, usé : un nuage doux, des grains, une veine fine de loin en loin
      var veine = Math.pow(1 - Math.abs(Math.sin((n[p] * 3 + (p % W) / W * 0.8) * PI)), 60);
      var v = 196 + n[p] * 26 - veine * 26 + (rg() - 0.5) * 10, fl = K.lisse(0.5, 0.78, f[p]);
      v = v * (1 - fl) + 236 * fl;
      d[q] = v * 0.985; d[q + 1] = v * 0.975; d[q + 2] = v * 0.955; d[q + 3] = 255;
    }
    x.putImageData(im, 0, 0);
    // un rond de farine, la trace d'un pâton
    x.fillStyle = "rgba(245,242,232,0.55)"; x.beginPath(); x.ellipse(W * 0.82, H * 0.45, W * 0.07, H * 0.16, 0.3, 0, 7); x.fill();
    return K.tex.texture(c, { clamp: true });
  }
  // la croûte d'une baguette : dorée, brunie, des grignes plus claires en biais
  function toileCroute(K) {
    var W = tt(K, 256), H = Math.round(W / 4), c = K.tex.canvas(W, H), x = c.getContext("2d");
    var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#7a4718"); g.addColorStop(0.5, "#b8732c"); g.addColorStop(1, "#6a3a14");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (var i = 0; i < 5; i++) {
      var cx = W * (0.14 + i * 0.18);
      x.fillStyle = "rgba(232,190,120,0.85)"; x.beginPath(); x.ellipse(cx, H * 0.5, W * 0.06, H * 0.12, -0.35, 0, 7); x.fill();
      x.fillStyle = "rgba(80,40,10,0.5)"; x.fillRect(cx - W * 0.05, H * 0.5 + H * 0.1, W * 0.1, 1.5);
    }
    var r = K.alea("farine-croute");
    for (var k = 0; k < W; k++) { x.fillStyle = "rgba(240,235,220," + (r() * 0.35) + ")"; x.fillRect(r() * W, r() * H, 1.4, 1.4); }
    return K.tex.texture(c);
  }
  // la chemise de travail, à plat, le col en haut : il lui reste une manche (à gauche de
  // l'image), retroussée ; à droite, l'entournure nue, effilochée (la première manche est
  // devenue le brassard du capitaine). La couture de l'épaule gauche est ouverte depuis
  // l'aisselle, sur neuf centimètres : la coupe a commencé. Le tissu noir, la patte, la poche,
  // l'étiquette cousue, l'écusson du chantier. La toile fait 768 × 640 (en haute) : 1 px ≈ 1 mm
  // de la chemise posée (0,78 × 0,65 m) ; le corps fait 44 cm de large, 57 de long.
  // CHEMISE.pivot : le bout de la coupure, où mordent les ciseaux (lu par le décor).
  var CHEMISE = { pivot: [256, 180], patte: 470 };
  function toileChemise(K) {
    var W = tt(K, 768), H = Math.round(W * 640 / 768), c = K.tex.canvas(W, H), x = c.getContext("2d"), r = K.alea("chemise");
    var u = W / 768;
    function M(px, py) { x.moveTo(px * u, py * u); }
    function L(px, py) { x.lineTo(px * u, py * u); }
    function Q(cx, cy, px, py) { x.quadraticCurveTo(cx * u, cy * u, px * u, py * u); }
    function forme() {
      x.beginPath();
      M(420, 40); Q(470, 64, 520, 40);          // l'encolure
      L(678, 82);                                // l'épaule droite
      Q(652, 170, 690, 272);                     // l'entournure nue
      L(700, 610); Q(470, 630, 240, 610);        // le côté droit, le bas
      L(250, 272);                               // le côté gauche, jusqu'à l'aisselle
      L(100, 452); L(48, 372);                   // le dessous de la manche, le poignet retroussé
      L(262, 82);                                // le dessus de la manche
      x.closePath();                             // l'épaule gauche
    }
    // le fond transparent ; le tissu : un noir de coton lavé, la trame
    forme(); x.fillStyle = "#26262b"; x.fill();
    x.save(); forme(); x.clip();
    var n = K.tex.couche(W, H, { periode: 6, octaves: 3, graine: "coton" }), im = x.getImageData(0, 0, W, H), d = im.data;
    for (var p = 0, q = 0; p < n.length; p++, q += 4) { if (!d[q + 3]) continue; var v = (n[p] - 0.5) * 24 + ((p % W) % 3 === 0 ? 4 : 0); d[q] += v; d[q + 1] += v; d[q + 2] += v * 1.1; }
    x.putImageData(im, 0, 0);
    // les plis, flous : des ombres longues sur le corps, un reflet à côté ; un pli le long
    // de la manche
    x.lineCap = "round"; x.filter = "blur(" + Math.max(1, Math.round(5 * u)) + "px)";
    for (var k = 0; k < 6; k++) {
      var fx = 290 + r() * 380, fy = 120 + r() * 200, fl = 160 + r() * 260, fb = (r() - 0.5) * 60;
      x.strokeStyle = "rgba(0,0,0,0.42)"; x.lineWidth = (8 + r() * 8) * u; x.beginPath(); M(fx, fy); Q(fx + fb, fy + fl / 2, fx + fb * 0.4, fy + fl); x.stroke();
      x.strokeStyle = "rgba(255,255,255,0.06)"; x.lineWidth = 5 * u; x.beginPath(); M(fx + 12, fy + 6); Q(fx + fb + 12, fy + fl / 2, fx + fb * 0.4 + 12, fy + fl - 6); x.stroke();
    }
    x.strokeStyle = "rgba(0,0,0,0.45)"; x.lineWidth = 10 * u; x.beginPath(); M(236, 130); L(80, 356); x.stroke();
    x.strokeStyle = "rgba(255,255,255,0.07)"; x.lineWidth = 5 * u; x.beginPath(); M(246, 140); L(90, 366); x.stroke();
    x.filter = "none";
    // le poignet retroussé : une bande plus sombre, son bord, un bouton
    x.fillStyle = "#18181c"; x.beginPath(); M(100, 452); L(48, 372); L(71, 342); L(123, 422); x.closePath(); x.fill();
    x.strokeStyle = "rgba(255,255,255,0.1)"; x.lineWidth = 2 * u; x.beginPath(); M(71, 342); L(123, 422); x.stroke();
    x.fillStyle = "#3a3a3e"; x.beginPath(); x.arc(82 * u, 400 * u, 5 * u, 0, 7); x.fill();
    // le col (deux pointes rabattues), la patte de boutonnage, les boutons
    x.fillStyle = "#303036"; x.strokeStyle = "rgba(0,0,0,0.7)"; x.lineWidth = 2.5 * u;
    [[420, 452, 466], [520, 488, 474]].forEach(function (cc) { x.beginPath(); M(cc[0], 40); L(cc[1], 114); L(cc[2], 72); x.closePath(); x.fill(); x.stroke(); });
    x.fillStyle = "#151518"; x.fillRect(462 * u, 84 * u, 16 * u, 530 * u);
    for (var b = 0; b < 6; b++) { x.fillStyle = "#3e3e43"; x.beginPath(); x.arc(470 * u, (128 + b * 80) * u, 5 * u, 0, 7); x.fill(); }
    // la couture de l'épaule gauche (là où la manche tient encore), et celle de l'entournure nue
    x.strokeStyle = "rgba(150,146,136,0.6)"; x.lineWidth = 1.6 * u; x.setLineDash([5 * u, 4 * u]);
    x.beginPath(); M(266, 88); L(255, 268); x.stroke();
    x.beginPath(); M(671, 88); Q(646, 170, 683, 266); x.stroke();
    x.setLineDash([]);
    // la poche, l'étiquette cousue au-dessus, l'écusson du chantier (des noms inventés)
    x.strokeStyle = "rgba(0,0,0,0.55)"; x.lineWidth = 2 * u; x.strokeRect(548 * u, 156 * u, 74 * u, 86 * u);
    x.fillStyle = "#ddd7c6"; x.fillRect(540 * u, 126 * u, 90 * u, 20 * u);
    x.fillStyle = "#1c2a4a"; x.font = "700 " + Math.round(12.5 * u) + 'px "Space Mono","DejaVu Sans Mono",monospace'; x.textAlign = "center"; x.textBaseline = "middle";
    x.fillText("K. MARÇAIS", 585 * u, 136.5 * u);
    x.fillStyle = "#2e2e33"; x.beginPath(); x.arc(372 * u, 176 * u, 24 * u, 0, 7); x.fill();
    x.strokeStyle = "#8d8a80"; x.lineWidth = 2 * u; x.beginPath(); x.arc(372 * u, 176 * u, 22 * u, 0, 7); x.stroke();
    x.fillStyle = "#b9b4a6"; x.font = "700 " + Math.round(8 * u) + 'px "Space Mono","DejaVu Sans Mono",monospace';
    x.fillText("DÔME", 372 * u, 172 * u); x.fillText("LOT 7", 372 * u, 183 * u);
    x.restore();
    // la coupe commencée : la couture de l'épaule gauche ouverte depuis l'aisselle
    x.save(); x.globalCompositeOperation = "destination-out"; x.lineCap = "round"; x.lineWidth = 5 * u;
    x.beginPath(); M(251, 270); L(CHEMISE.pivot[0], CHEMISE.pivot[1]); x.stroke(); x.restore();
    // l'entournure nue effilochée, et quelques fils au bord de la coupe
    x.strokeStyle = "rgba(120,118,112,0.8)"; x.lineWidth = 1.1 * u;
    for (var i = 0; i < 48; i++) {
      var t = i / 48, a0 = (1 - t) * (1 - t), a1 = 2 * (1 - t) * t, a2 = t * t;
      var ex = (a0 * 678 + a1 * 652 + a2 * 690) * u, ey = (a0 * 82 + a1 * 170 + a2 * 272) * u;
      x.beginPath(); x.moveTo(ex, ey); x.lineTo(ex + (2 + r() * 7) * u, ey + (r() - 0.5) * 5 * u); x.stroke();
    }
    for (var j = 0; j < 18; j++) { var jy = 184 + j * 4.8, jx = 251 + (256 - 251) * (270 - jy) / 90; x.beginPath(); M(jx - 2, jy); L(jx - 4 - r() * 5, jy + (r() - 0.5) * 3); x.stroke(); }
    return K.tex.texture(c, { clamp: true });
  }
  // le sac à pain : un papier blanc cassé, une frise et le nom de la boulangerie
  function toileSac(K) {
    var W = tt(K, 512), H = Math.round(W / 4), c = K.tex.canvas(W, H), x = c.getContext("2d");
    x.fillStyle = "#ece6d6"; x.fillRect(0, 0, W, H);
    x.strokeStyle = "rgba(122,74,34,0.75)"; x.lineWidth = H * 0.04;
    for (var i = 0; i < 18; i++) { x.beginPath(); x.moveTo(i * W / 18, H * 0.08); x.lineTo(i * W / 18 + W / 36, H * 0.18); x.lineTo(i * W / 18 + W / 18, H * 0.08); x.stroke(); }
    x.fillStyle = "rgba(122,74,34,0.9)"; x.font = "700 " + Math.round(H * 0.2) + 'px "Space Mono","DejaVu Sans Mono",monospace'; x.textAlign = "center"; x.textBaseline = "middle";
    x.fillText("BOULANGERIE MARÇAIS", W * 0.5, H * 0.5);
    x.font = "400 " + Math.round(H * 0.12) + 'px "Space Mono","DejaVu Sans Mono",monospace'; x.fillText("RUE DES LILAS · AUBÉRIVE", W * 0.5, H * 0.74);
    return K.tex.texture(c, { clamp: true });
  }
  // la télévision sans le son : le Dôme sous un soleil blanc, vingt degrés, un bandeau qui défile
  function ecranTele(K) {
    return K.tex.ecran({ largeur: 512, hauteur: 288, type: "lcd", fond: "#dfe8ee", ips: 15, dessiner: function (x, t, w, h) {
      // le ciel blanc, le sol ocre qui tremble de chaleur
      var g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#5f8db8"); g.addColorStop(0.55, "#efe6d2"); g.addColorStop(0.62, "#d9b97f"); g.addColorStop(1, "#9c7440");
      x.fillStyle = g; x.fillRect(0, 0, w, h);
      var cx = w * (0.46 + Math.sin(t * 0.12) * 0.02), base = h * 0.62, R = w * 0.3;
      // le soleil, blanc, qui mange le ciel
      var gs = x.createRadialGradient(w * 0.82, h * 0.14, 2, w * 0.82, h * 0.14, w * 0.3); gs.addColorStop(0, "rgba(255,255,250,1)"); gs.addColorStop(0.2, "rgba(255,252,240,0.8)"); gs.addColorStop(1, "rgba(255,250,235,0)");
      x.fillStyle = gs; x.fillRect(0, 0, w, h);
      // le Dôme : une calotte blanche, ses nervures
      x.fillStyle = "#f4f7f8"; x.beginPath(); x.ellipse(cx, base, R, R * 0.42, 0, PI, 0); x.fill();
      x.strokeStyle = "rgba(120,140,155,0.55)"; x.lineWidth = 1.5;
      for (var i = -5; i <= 5; i++) { x.beginPath(); x.ellipse(cx, base, Math.abs(i) / 5 * R + 0.1, R * 0.42, 0, PI, 0); x.stroke(); }
      x.fillStyle = "#c9ccc6"; x.fillRect(cx - R * 1.04, base - 2, R * 2.08, 7);
      // une grue, à côté
      x.strokeStyle = "rgba(70,60,50,0.8)"; x.lineWidth = 2; x.beginPath(); x.moveTo(cx + R * 1.2, base); x.lineTo(cx + R * 1.2, base - h * 0.42); x.lineTo(cx + R * 0.5, base - h * 0.42); x.moveTo(cx + R * 1.2, base - h * 0.42); x.lineTo(cx + R * 1.45, base - h * 0.42); x.stroke();
      // la chaleur : des bandes qui ondulent au ras du sol
      for (var k = 0; k < 6; k++) { var yy = base + 4 + k * 6; x.drawImage(x.canvas, 0, yy, w, 3, Math.sin(t * 6 + k) * 3, yy, w, 3); }
      // le logo de la chaîne, le bandeau, la température
      x.fillStyle = "rgba(10,20,40,0.85)"; x.fillRect(0, h * 0.8, w, h * 0.2);
      x.fillStyle = "#DDEFFF"; x.font = "700 " + Math.round(h * 0.075) + 'px "Space Mono","DejaVu Sans Mono",monospace'; x.textAlign = "left"; x.textBaseline = "middle";
      var bandeau = "MONDIAL D'HIVER · AL-DORADO · LE DÔME A FERMÉ SON TOIT · VINGT DEGRÉS SOUS LE DÔME, MÊME EN ÉTÉ · ";
      var off = (t * 60) % (bandeau.length * h * 0.045);
      x.fillText(bandeau + bandeau, w * 0.02 - off, h * 0.9);
      x.fillStyle = "rgba(10,20,40,0.85)"; x.fillRect(w * 0.7, h * 0.06, w * 0.26, h * 0.2);
      x.fillStyle = "#ffffff"; x.font = "700 " + Math.round(h * 0.14) + 'px "Space Mono","DejaVu Sans Mono",monospace'; x.textAlign = "center";
      x.fillText("20 °C", w * 0.83, h * 0.165);
      x.fillStyle = "#DDEFFF"; x.font = "700 " + Math.round(h * 0.05) + 'px "Space Mono","DejaVu Sans Mono",monospace'; x.textAlign = "left";
      x.fillText("TÉLÉ-STADE", w * 0.03, h * 0.08);
    } });
  }

  // une baguette : une capsule allongée, aplatie, sa croûte
  function baguette(K, THREE, mat, L) {
    var g = K.garder(new THREE.CapsuleGeometry(0.03, L || 0.56, 4, 10));
    g.rotateZ(PI / 2);
    var b = new THREE.Mesh(g, mat); b.scale.set(1, 0.82, 1); b.castShadow = true; b.receiveShadow = true;
    return b;
  }

  // ─── LA RUE DES LILAS, CINQ HEURES DU MATIN ────────────────────────────────
  function rueDesLilas(K, ctx, tex) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: { zenith: "#03050c", horizon: "#121a2c", lueur: "#1a2334", lueurDir: [0, -1], force: 0.6 },
      brouillard: ["#0d1422", 0.05], environnement: { fenetres: 10, teintes: ["#cfe0ff", "#FFC27A"] }, reflets: 0.8, ambiance: ["#3a4a6c", "#0a0b10", 0.22] });
    var rue = P.rue({ longueur: 64, largeur: 7, trottoir: 2.4, flaques: 0.3, graine: "lilas" }); rue.position.z = -14; s.add(rue);
    // la neige au sol : les trottoirs blancs, la chaussée en traces
    var mNeige = garderMat(K, new THREE.MeshStandardMaterial({ map: tex.neigeTrottoir, transparent: true, roughness: 0.85, metalness: 0, depthWrite: false }));
    [-1, 1].forEach(function (sg) { var p = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(2.4, 64)), mNeige); p.rotation.x = -PI / 2; p.position.set(sg * (3.5 + 1.2), 0.156, -14); p.receiveShadow = true; s.add(p); });
    var mChaussee = garderMat(K, new THREE.MeshStandardMaterial({ map: tex.neigeChaussee, transparent: true, roughness: 0.7, metalness: 0, depthWrite: false }));
    var pc = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(7, 64)), mChaussee); pc.rotation.x = -PI / 2; pc.position.set(0, 0.008, -14); pc.receiveShadow = true; s.add(pc);
    // les façades : la boulangerie à gauche, entre deux immeubles ; trois en face
    var gauche = [{ z: 3.9, w: 9, e: 3, g: "l1", b: "#5a3a2e" }, { z: -4.6, w: 8, e: 2, g: "boulangerie", b: "#6b4a3a", enseigne: { lignes: ["BOULANGERIE MARÇAIS"], fond: "#2a2420", encre: "#E9E1CC", lumiere: 0.12 } },
      { z: -14, w: 9, e: 3, g: "l3", b: "#553228" }, { z: -24, w: 10, e: 3, g: "l4", b: "#5e3a2c" }, { z: -34, w: 10, e: 4, g: "l5", b: "#563428" }];
    gauche.forEach(function (f) {
      var fa = P.facade({ largeur: f.w, etages: f.e, graine: f.g, brique: f.b, enseigne: f.enseigne, vitrine: f.g !== "boulangerie", fenetres: { allumees: f.g === "l3" ? 0.12 : 0.06 } });
      fa.rotation.y = PI / 2; fa.position.set(-5.9, 0, f.z); s.add(fa);
    });
    [{ z: 4, w: 10, e: 3, g: "r1", b: "#5c3a2c" }, { z: -7, w: 11, e: 3, g: "r2", b: "#644030" }, { z: -18, w: 10, e: 4, g: "r3", b: "#583226" }, { z: -29, w: 12, e: 3, g: "r4", b: "#5e382a" }].forEach(function (f) {
      var fa = P.facade({ largeur: f.w, etages: f.e, graine: f.g, brique: f.b, vitrine: true, fenetres: { allumees: 0.07 } });
      fa.rotation.y = -PI / 2; fa.position.set(5.9, 0, f.z); s.add(fa);
    });
    var fond = P.facade({ largeur: 18, etages: 4, graine: "lilas-fond", brique: "#4a2c22", fenetres: { allumees: 0.05 } }); fond.position.set(0, 0, -44); s.add(fond);
    // la neige sur les rebords : une corniche blanche le long des façades de gauche
    var mNeigeBord = garderMat(K, new THREE.MeshStandardMaterial({ color: "#d9e2ee", roughness: 0.9 }));
    P.boite(s, 0.32, 0.05, 60, mNeigeBord, -5.7, 3.72, -14, { ombre: false });
    // la vitrine de la boulangerie : la seule lumière chaude de la rue
    var vitrine = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(4.4, 2.3)), garderMat(K, new THREE.MeshBasicMaterial({ map: tex.vitrine, color: new THREE.Color(1, 1, 1).multiplyScalar(1.05) })));
    vitrine.rotation.y = PI / 2; vitrine.position.set(-5.86, 1.45, -5.4); s.add(vitrine);
    var vitre = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(4.4, 2.3)), garderMat(K, new THREE.MeshPhysicalMaterial({ color: "#14100c", roughness: 0.05, metalness: 0, transparent: true, opacity: 0.28, envMapIntensity: 2.2, depthWrite: false })));
    vitre.rotation.y = PI / 2; vitre.position.set(-5.82, 1.45, -5.4); s.add(vitre);
    // la porte vitrée, éclairée elle aussi, et sa marche enneigée
    var porteV = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(1.05, 2.25)), garderMat(K, new THREE.MeshBasicMaterial({ map: tex.porteVitree })));
    porteV.rotation.y = PI / 2; porteV.position.set(-5.86, 1.13, -2.2); s.add(porteV);
    P.boite(s, 0.5, 0.16, 1.3, mNeigeBord, -5.65, 0.16, -2.2, { ombre: false });
    // la lumière qui sort de la vitrine sur la neige du trottoir
    var chaud = K.look.projecteur({ couleur: "#FFB766", intensite: 30, angle: 0.9, penombre: 0.7, decroissance: 2, ombre: true, loin: 14, ombreTaille: 1024 });
    chaud.position.set(-6.8, 2.2, -5.0); s.add(chaud);
    var cc = new THREE.Object3D(); cc.position.set(-3.2, 0, -4.6); s.add(cc); chaud.target = cc;
    // la vapeur du fournil, par la grille au-dessus de la porte
    var vapeur = K.particules.fumee({ n: 40, source: [-5.75, 3.15, -2.2], vent: [0.25, 0.05], montee: 0.45, vie: 6, taille: 0.55, etalement: 0.2, couleur: "#c8d0dc", lueur: "#ffd6a6", opacite: 0.32, graine: "vapeur" });
    s.add(vapeur);
    P.boite(s, 0.06, 0.25, 0.5, K.mat.metal({ couleur: "#3a3d40", rugosite: 0.5 }), -5.8, 3.15, -2.2);
    // les caisses à pain vides, empilées contre le mur, la neige dessus (la livraison des
    // restaurants part à six heures ; le vélo de Kévin, lui, est à la cave : le livre le dit)
    var caisses = caissesAPain(K, THREE); caisses.position.set(-5.45, 0.15, -1.22); caisses.rotation.y = PI / 2 + 0.08; s.add(caisses);
    // les lampadaires : des diodes froides (2029), l'une qui grésille
    var lamps = [[4.6, 1.5], [-4.6, -11], [4.6, -22]].map(function (p, i) {
      var r = P.reverbere({ hauteur: 6, bras: 1.3, couleur: "#D7E3FF", intensite: i ? 95 : 130, ombre: i === 0, gresille: i === 1 ? 0.8 : 0, forceCone: 0.09 });
      r.position.set(p[0], 0.15, p[1]); r.rotation.y = p[0] > 0 ? PI : 0; s.add(r);
      return r;
    });
    s.updateMatrixWorld(true);
    var lum = [
      { pos: lamps[0].positionLampe(), couleur: "#D7E3FF", intensite: 1.3, rayon: 7 },
      { pos: [-5.2, 1.6, -5.2], couleur: "#FFB766", intensite: 1.3, rayon: 4.6 },
      { pos: lamps[1].positionLampe(), couleur: "#D7E3FF", intensite: 1.0, rayon: 7 },
      { pos: lamps[2].positionLampe(), couleur: "#D7E3FF", intensite: 0.9, rayon: 7 }
    ];
    var neige = K.particules.neige({ n: 7000, zone: { min: [-8, -0.2, -14], max: [8, 9, 14] }, suivre: true, avance: 7, taille: 0.026, chute: 0.75, couleur: "#9aa8c4", opacite: 0.95, lumieres: lum, graine: "neige-rue" });
    s.add(neige);
    var reflets = [
      K.look.reflet({ pos: [-5.6, 0, -5.4], sol: 0.01, couleur: "#FFB766", intensite: 0.55, largeur: 3.0, longueur: 4 }),
      K.look.reflet({ pos: lamps[0].positionLampe(), couleur: "#D7E3FF", intensite: 0.5, largeur: 0.8, longueur: 6 })
    ];
    reflets.forEach(function (r) { s.add(r); });
    return {
      scene: s, look: { bloom: 0.8, rayon: 0.6, seuil: 0.82, exposition: 1.12, contraste: 1.14, saturation: 0.9 },
      maj: function (t, c) {
        neige.maj(t, c.camera); vapeur.maj(t);
        lamps.forEach(function (l) { l.maj(t); });
        reflets.forEach(function (r) { r.maj(c.camera); });
      }
    };
  }
  // les caisses à pain : quatre bacs de plastique ajourés, empilés de guingois, la neige
  // sur celle du haut
  function caissesAPain(K, THREE) {
    var P = K.props, g = new THREE.Group();
    var W = tt(K, 128), c = K.tex.canvas(W, W / 2), x = c.getContext("2d"), u = W / 128;
    x.fillStyle = "#2f4f72"; x.fillRect(0, 0, W, W / 2);
    x.fillStyle = "#0d1520";
    for (var i = 0; i < 6; i++) for (var j = 0; j < 2; j++) { x.beginPath(); x.ellipse((14 + i * 20) * u, (20 + j * 22) * u, 6 * u, 7 * u, 0, 0, 7); x.fill(); }
    x.fillStyle = "rgba(255,255,255,0.08)"; x.fillRect(0, 0, W, 4 * u);
    var mC = garderMat(K, new THREE.MeshStandardMaterial({ map: K.tex.texture(c, {}), roughness: 0.55, metalness: 0 }));
    var mN = garderMat(K, new THREE.MeshStandardMaterial({ color: "#d8e0ea", roughness: 0.9 }));
    for (var k = 0; k < 4; k++) P.boite(g, 0.6, 0.2, 0.4, mC, (K.h01(k, 5) - 0.5) * 0.05, 0.1 + k * 0.2, (K.h01(k, 9) - 0.5) * 0.04, { ry: (K.h01(k, 13) - 0.5) * 0.08 });
    P.boite(g, 0.58, 0.05, 0.38, mN, 0, 0.825, 0, { ombre: false });
    P.fusionner(g);
    return g;
  }

  // ─── LA BOULANGERIE : LE FOURNIL ET LA BOUTIQUE ────────────────────────────
  // La pièce va de z = -4 (le four, au fond) à z = +4 (la vitrine sur la rue). La
  // boutique est devant : le comptoir et la caisse le long du mur de gauche, la
  // télévision en haut du coin droit ; le fournil derrière : le four, le marbre, l'échelle.
  function boulangerie(K, ctx, tex) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: false, fond: "#020203", environnement: { zenith: "#050404", horizon: "#120a05", lueur: "#2a1406", fenetres: 0,
      lampes: [{ pos: [10, 4, -60], couleur: "#FF8A3D", intensite: 5, taille: 8 }, { pos: [0, 40, 0], couleur: "#FFD9A6", intensite: 3, taille: 6 }, { pos: [-30, 6, 50], couleur: "#9FB8E8", intensite: 2, taille: 8 }] },
      reflets: 0.7, ambiance: ["#2f3a52", "#160c06", 0.16], brouillard: ["#0d0907", 0.045] });
    var mMur = garderMat(K, new THREE.MeshStandardMaterial({ map: tex.carrelage, roughness: 0.35, metalness: 0 }));
    var mSol = K.mat.beton({ couleur: "#6a3d2c", graine: "tomettes", banches: 0, taches: 1.2, repete: [3, 3] });
    var piece = P.piece({ largeur: 7, profondeur: 8, hauteur: 3.2, murs: mMur, sol: mSol, plafond: K.mat.beton({ couleur: "#3a3632", graine: "plafond-fournil", banches: 0 }) });
    s.add(piece);
    // le mur de devant, la vitrine : la rue derrière, la neige
    var mFace = K.mat.beton({ couleur: "#5c564c", graine: "facade-int", banches: 0, taches: 0.7 });
    [[-3.5, -1.6], [2.6, 3.5]].forEach(function (b) { var w = b[1] - b[0]; P.boite(s, w, 3.2, 0.2, mFace, (b[0] + b[1]) / 2, 1.6, 4.1); });
    P.boite(s, 4.2, 0.8, 0.2, mFace, 0.5, 0.4, 4.1); P.boite(s, 4.2, 0.6, 0.2, mFace, 0.5, 2.9, 4.1);
    var dehors = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(12, 6)), garderMat(K, new THREE.MeshBasicMaterial({ map: tex.dehors, color: new THREE.Color(1, 1, 1).multiplyScalar(0.55) })));
    dehors.rotation.y = PI; dehors.position.set(0.5, 2.0, 9.5); s.add(dehors);
    var verreV = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(4.2, 1.8)), garderMat(K, new THREE.MeshPhysicalMaterial({ color: "#0c1018", roughness: 0.06, transparent: true, opacity: 0.22, envMapIntensity: 1.6, depthWrite: false })));
    verreV.rotation.y = PI; verreV.position.set(0.5, 1.7, 4.02); s.add(verreV);
    var lettres = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(2.6, 0.26)), garderMat(K, new THREE.MeshBasicMaterial({ map: tex.lettresVitrine, transparent: true, depthWrite: false, color: new THREE.Color(1, 1, 1).multiplyScalar(0.7) })));
    lettres.rotation.y = PI; lettres.position.set(0.5, 2.35, 4.0); s.add(lettres);
    var neigeDehors = K.particules.neige({ n: 1500, zone: { min: [-2, 0.3, 4.3], max: [3, 3.2, 8.5] }, taille: 0.02, chute: 0.7, couleur: "#9aa8c0", opacite: 0.7, graine: "neige-vitre",
      lumieres: [{ pos: [0.5, 2.6, 6.5], couleur: "#D7E3FF", intensite: 1.2, rayon: 5 }] });
    s.add(neigeDehors);
    // le froid de la rue entre par la vitrine : un contre-jour bleu
    var froid = K.look.projecteur({ couleur: "#7f95c8", intensite: 14, angle: 0.7, penombre: 0.8, decroissance: 2, ombre: false });
    froid.position.set(0.5, 2.6, 6.5); s.add(froid);
    var cf = new THREE.Object3D(); cf.position.set(-0.5, 0.6, 1.0); s.add(cf); froid.target = cf;

    // ── LE FOUR À SOLES, contre le mur du fond
    var mInox = garderMat(K, new THREE.MeshStandardMaterial({ color: "#8d9296", roughness: 0.32, metalness: 0.85 }));
    var mNoir = K.mat.metal({ couleur: "#1c1d1f", rugosite: 0.55 });
    var four = new THREE.Group(); four.position.set(1.0, 0, -3.27); s.add(four);
    // le corps : le bas, le haut, les deux joues de la sole du milieu (sa bouche est ouverte)
    P.boite(four, 2.5, 0.93, 0.9, mNoir, 0, 0.465, -0.25);
    P.boite(four, 2.5, 0.89, 0.9, mNoir, 0, 1.755, -0.25);
    P.boite(four, 0.25, 0.38, 0.9, mNoir, -1.125, 1.12, -0.25);
    P.boite(four, 0.25, 0.38, 0.9, mNoir, 1.125, 1.12, -0.25);
    P.boite(four, 2.5, 0.25, 0.95, mInox, 0, 2.32, -0.28);                // la hotte
    P.boite(four, 2.5, 0.42, 0.12, mInox, 0, 0.21, 0.2);                  // le socle
    var portes = [];
    [0.62, 1.12, 1.62].forEach(function (y, i) {
      var ch = new THREE.Group(); ch.position.set(0, y - 0.19, 0.22); four.add(ch);
      P.boite(ch, 2.1, 0.38, 0.06, mInox, 0, 0.19, 0);
      if (i !== 1) {
        var hublot = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(1.5, 0.14)), K.mat.lumiere({ couleur: "#FF7A2A", intensite: 1.6 }));
        hublot.position.set(0, 0.2, 0.032); ch.add(hublot);
      }
      P.cylindre(ch, 0.018, 0.018, 1.8, K.mat.metal({ couleur: "#2a2a2a", rugosite: 0.3 }), 0, 0.33, 0.07, { rz: PI / 2, cotes: 8 });
      portes.push(ch);
    });
    portes[1].rotation.x = 1.3;   // la porte du milieu, rabattue : on enfourne
    // la sole du milieu : la pierre, le fond qui rougeoie, les baguettes qui cuisent
    P.boite(four, 2.0, 0.03, 0.85, K.mat.beton({ couleur: "#6a5040", graine: "sole", banches: 0 }), 0, 0.945, -0.25);
    var bouche = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(2.0, 0.34)), garderMat(K, new THREE.MeshBasicMaterial({ map: tex.braise, color: new THREE.Color(1, 1, 1).multiplyScalar(1.1), toneMapped: true })));
    bouche.position.set(0, 1.12, -0.66); four.add(bouche);
    var mCroute = garderMat(K, new THREE.MeshStandardMaterial({ map: tex.croute, roughness: 0.7, metalness: 0, emissive: new THREE.Color("#ff6a1a"), emissiveIntensity: 0.22 }));
    for (var bi = 0; bi < 6; bi++) { var bg = baguette(K, THREE, mCroute, 0.56); bg.rotation.y = PI / 2 + (K.h01(bi, 9) - 0.5) * 0.06; bg.position.set(-0.75 + bi * 0.3, 0.985, -0.32 + (bi % 2) * 0.04); four.add(bg); }
    var feu = K.look.ponctuelle({ couleur: "#FF7A2A", intensite: 3.2, portee: 9 }); feu.position.set(1.0, 1.12, -2.97); s.add(feu);
    var dedans = K.look.ponctuelle({ couleur: "#FF9A4A", intensite: 0.9, portee: 1.5 }); dedans.position.set(1.0, 1.22, -3.47); s.add(dedans);
    var halo = K.look.halo({ couleur: "#FF8A3D", taille: 1.6, intensite: 0.22 }); halo.position.set(1.0, 1.1, -2.92); s.add(halo);
    // le tableau de commande : deux cadrans, le voyant de la couleur du livre
    P.boite(four, 0.36, 0.5, 0.05, mNoir, 1.08, 1.75, 0.22);
    var voyant = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.016, 10, 8)), K.mat.lumiere({ couleur: GLACE, intensite: 5, toneMapped: false })); voyant.position.set(1.08, 1.92, 0.26); four.add(voyant);
    var hv = K.look.halo({ couleur: GLACE, taille: 0.14, intensite: 1.4 }); hv.position.set(1.08, 1.92, 0.28); four.add(hv);
    [1.62, 1.75].forEach(function (y) { P.cylindre(four, 0.04, 0.04, 0.03, K.mat.metal({ couleur: "#c9c6bd", rugosite: 0.3 }), 1.08, y - 0.05, 0.26, { rx: PI / 2, cotes: 16 }); });
    // la pelle à enfourner, appuyée au four
    var mBois = K.mat.bois({ couleur: "#9a7650", lames: 1, graine: "pelle" });
    P.boite(s, 0.03, 2.4, 0.03, mBois, -0.42, 1.2, -2.72, { rz: 0.12 });
    P.boite(s, 0.3, 0.42, 0.012, mBois, -0.56, 0.2, -2.72, { rz: 0.12 });
    // ── LE MARBRE, au milieu du fournil
    var mMarbre = garderMat(K, new THREE.MeshStandardMaterial({ map: tex.marbre, roughness: 0.42, metalness: 0 }));
    var mPied = K.mat.bois({ couleur: "#4a3322", lames: 3, graine: "petrin" });
    P.boite(s, 2.2, 0.06, 1.0, mMarbre, -0.5, 0.93, -1.6);
    P.boite(s, 2.1, 0.7, 0.9, mPied, -0.5, 0.52, -1.6);
    // la chemise, à plat, le col vers le four : il lui reste une manche (à gauche), la couture
    // de son épaule ouverte sur sept centimètres ; les ciseaux mordent la couture, la lame du
    // dessous glissée sous le tissu, celle du dessus par-dessus. Le tissu flotte à un
    // centimètre du marbre (la place de la lame du dessous), et ne descend jamais plus bas.
    var CH = { x: -0.62, y: 0.972, z: -1.62, rz: 0.06 };
    var gch = new THREE.PlaneGeometry(0.78, 0.65, 26, 22), pch = gch.attributes.position, xPatte = CHEMISE.patte / 768 * 0.78 - 0.39;
    for (var i = 0; i < pch.count; i++) { var X = pch.getX(i), Y = pch.getY(i); pch.setZ(i, 0.0026 + Math.sin(X * 11 + Y * 3) * 0.0015 + Math.sin(Y * 9) * 0.001 + Math.max(0, 0.03 - Math.abs(X - xPatte)) * 0.06); }
    gch.computeVertexNormals(); K.garder(gch);
    var mCh = garderMat(K, new THREE.MeshStandardMaterial({ map: tex.chemise, alphaTest: 0.5, roughness: 0.92, metalness: 0, bumpMap: K.tex.tissu({ fils: 160 }).relief, bumpScale: 0.25, side: THREE.DoubleSide }));
    var chemise = new THREE.Mesh(gch, mCh); chemise.rotation.x = -PI / 2; chemise.rotation.z = CH.rz; chemise.position.set(CH.x, CH.y, CH.z); chemise.castShadow = true; chemise.receiveShadow = true; s.add(chemise);
    // le pivot des ciseaux au bout de la coupure (sur la toile de 768 × 640), les lames le long
    // de la couture, vers l'épaule
    var u0 = CHEMISE.pivot[0] / 768 * 0.78 - 0.39, v0 = 0.325 - CHEMISE.pivot[1] / 640 * 0.65, cr = Math.cos(CH.rz), sr = Math.sin(CH.rz);
    var ciseaux = ciseauxTailleur(K, THREE, { mordre: 0.016 });
    ciseaux.position.set(CH.x + u0 * cr - v0 * sr, 0.986, CH.z - (u0 * sr + v0 * cr)); ciseaux.rotation.y = PI / 2 + 0.03; s.add(ciseaux);
    // des boules de pâte, au fond du marbre : le travail qui continue
    var mPate = garderMat(K, new THREE.MeshStandardMaterial({ color: "#e8dcc0", roughness: 0.8 }));
    for (var pi2 = 0; pi2 < 4; pi2++) { var bo = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.07, 16, 10)), mPate); bo.scale.y = 0.55; bo.position.set(-0.04 + (pi2 % 2) * 0.17, 0.985, -1.86 - Math.floor(pi2 / 2) * 0.16); bo.castShadow = true; s.add(bo); }
    // ── L'ÉCHELLE À PAIN, à gauche du four : des baguettes sur des toiles
    var mEch = K.mat.metal({ couleur: "#a6a9a8", rugosite: 0.35 });
    var ech = new THREE.Group(); ech.position.set(-2.55, 0, -3.1); s.add(ech);
    [-0.4, 0.4].forEach(function (x) { [-0.3, 0.3].forEach(function (z) { P.cylindre(ech, 0.015, 0.015, 1.9, mEch, x, 0.95, z, { cotes: 6 }); }); });
    var mToile = garderMat(K, new THREE.MeshStandardMaterial({ color: "#d9d0bc", roughness: 0.95 }));
    for (var et = 0; et < 5; et++) {
      var y0 = 0.3 + et * 0.36;
      P.boite(ech, 0.82, 0.01, 0.62, mToile, 0, y0, 0);
      for (var bb = 0; bb < 5; bb++) { var b2 = baguette(K, THREE, mCroute, 0.55); b2.position.set(0, y0 + 0.03, -0.22 + bb * 0.11); b2.rotation.y = (K.h01(bb + et * 7, 3) - 0.5) * 0.08; ech.add(b2); }
    }
    P.fusionner(ech);
    // le sac de farine, une étagère, la radio
    var sacF = K.tex.texte({ lignes: ["FARINE T65", "MOULIN DE LA RIVE", "25 KG"], fond: "#d8ccb0", encre: "#5a3a1e", largeur: 256, hauteur: 320, graine: "sac-farine" });
    var mSacF = garderMat(K, new THREE.MeshStandardMaterial({ map: sacF.map, roughness: 0.95 }));
    var sf = P.boite(s, 0.5, 0.75, 0.28, mSacF, 2.7, 0.38, -2.3, { ry: -0.5 });
    P.boite(s, 1.2, 0.04, 0.3, K.mat.bois({ couleur: "#3a2a1c", lames: 2, graine: "etagere" }), 2.85, 1.85, -1.0, { ry: PI / 2 });
    var radio = new THREE.Group(); radio.position.set(3.25, 1.87, -1.0); radio.rotation.y = -PI / 2; s.add(radio);
    P.boite(radio, 0.3, 0.17, 0.09, garderMat(K, new THREE.MeshStandardMaterial({ color: "#3b2c22", roughness: 0.5 })), 0, 0.085, 0);
    var cadran = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.16, 0.05)), K.mat.lumiere({ couleur: "#FFB766", intensite: 1.6 })); cadran.position.set(-0.04, 0.11, 0.047); radio.add(cadran);
    // l'ampoule nue au-dessus du marbre
    var amp = P.ampoule({ fil: 1.15, intensite: 2.6, ombre: true, balancement: 0.03, graine: "fournil", halo: 0.45, loin: 8 });
    amp.position.set(-0.98, 3.2, -1.98); s.add(amp);
    // la lampe de la boutique, au-dessus du comptoir : la seule allumée devant, à cette heure
    var lampe = P.ampoule({ fil: 1.05, intensite: 2.4, ombre: false, balancement: 0.02, graine: "comptoir", halo: 0.35 });
    lampe.position.set(-2.75, 3.2, 2.45); s.add(lampe);
    var farine = K.particules.poussiere({ n: 1400, zone: { min: [-1.4, 0.7, -3.3], max: [2.2, 2.6, -0.6] }, couleur: "#ffe3c0", opacite: 1, taille: 0.009,
      lumieres: [{ pos: [1.0, 1.1, -3.0], couleur: "#FF8A3D", intensite: 2.2, rayon: 2.4 }, { pos: [-0.5, 2.2, -1.6], couleur: "#FFD9A6", intensite: 1.2, rayon: 1.6 }] });
    s.add(farine);

    // ── LA BOUTIQUE : le comptoir et la caisse le long du mur de gauche
    var mComptoir = K.mat.bois({ couleur: "#5a3a24", lames: 4, graine: "comptoir-bl", cire: true });
    P.boite(s, 1.0, 1.0, 3.2, mComptoir, -3.0, 0.5, 2.2);
    P.boite(s, 1.1, 0.04, 3.3, garderMat(K, new THREE.MeshStandardMaterial({ color: "#c9c2b2", roughness: 0.3 })), -3.0, 1.02, 2.2);
    // la caisse : une petite caisse électronique beige, son écran vert
    var caisse = new THREE.Group(); caisse.position.set(-3.1, 1.04, 2.9); caisse.rotation.y = PI / 2; s.add(caisse);
    P.boite(caisse, 0.36, 0.1, 0.32, garderMat(K, new THREE.MeshStandardMaterial({ color: "#cfc6b0", roughness: 0.45 })), 0, 0.05, 0);
    P.boite(caisse, 0.36, 0.12, 0.05, garderMat(K, new THREE.MeshStandardMaterial({ color: "#bdb49e", roughness: 0.45 })), 0, 0.16, -0.12, { rx: -0.4 });
    var ecr = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.16, 0.04)), K.mat.lumiere({ couleur: "#7fd890", intensite: 1.3 })); ecr.position.set(0, 0.19, -0.095); ecr.rotation.x = -0.4; caisse.add(ecr);
    // la photo de Kévin, au-dessus de la caisse, punaisée de travers
    var gph = new THREE.PlaneGeometry(0.2, 0.27, 4, 6), pph = gph.attributes.position;
    for (var k = 0; k < pph.count; k++) pph.setZ(k, Math.pow(pph.getY(k) / 0.135, 2) * 0.006 + Math.pow(pph.getX(k) / 0.1, 2) * 0.003);
    gph.computeVertexNormals(); K.garder(gph);
    var photo = new THREE.Mesh(gph, garderMat(K, new THREE.MeshStandardMaterial({ map: tex.photo, roughness: 0.55, metalness: 0 })));
    photo.rotation.y = PI / 2; photo.rotation.x = 0.0; photo.position.set(-3.48, 1.64, 2.86); photo.rotateZ(-0.13); photo.castShadow = true; s.add(photo);
    var punaise = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.009, 10, 8)), garderMat(K, new THREE.MeshStandardMaterial({ color: "#b8231c", roughness: 0.3 })));
    punaise.position.set(-3.465, 1.765, 2.845); s.add(punaise);
    // le sac à pain sur le comptoir, mis de côté, une baguette dedans : il attend quelqu'un
    // (la carte qui suit y glisse le second brassard ; le film le laisse vide)
    var mSac = garderMat(K, new THREE.MeshStandardMaterial({ map: tex.sac, roughness: 0.85, side: THREE.DoubleSide }));
    var gSac = K.garder(new THREE.CylinderGeometry(0.045, 0.045, 0.5, 14, 1, true)); gSac.rotateZ(PI / 2);
    var sac = new THREE.Mesh(gSac, mSac); sac.scale.set(1, 0.7, 1); sac.position.set(-2.85, 1.07, 2.05); sac.rotation.y = PI / 2 - 0.25; sac.castShadow = true; s.add(sac);
    var bSac = baguette(K, THREE, garderMat(K, new THREE.MeshStandardMaterial({ map: tex.croute, roughness: 0.75 })), 0.62); bSac.position.set(-2.86, 1.075, 2.02); bSac.rotation.y = PI / 2 - 0.25; s.add(bSac);
    // la clochette au-dessus de la porte (elle colle)
    var cloche = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.035, 12, 8, 0, PI * 2, 0, PI / 2)), K.mat.metal({ couleur: "#b8923f", rugosite: 0.3 }));
    cloche.rotation.x = PI; cloche.position.set(-2.5, 2.75, 4.0); s.add(cloche);
    // ── LA TÉLÉVISION, en haut du coin droit, sur sa potence
    var tele = new THREE.Group(); tele.position.set(3.05, 2.45, 3.45); tele.rotation.y = -PI / 2 - 0.55; s.add(tele);
    P.boite(tele, 0.78, 0.48, 0.06, garderMat(K, new THREE.MeshStandardMaterial({ color: "#121316", roughness: 0.35, metalness: 0.3 })), 0, 0, 0);
    var tv = ecranTele(K);
    var ecran = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.72, 0.405)), garderMat(K, new THREE.MeshBasicMaterial({ map: tv.texture, toneMapped: true, color: new THREE.Color(1, 1, 1).multiplyScalar(0.48) })));
    ecran.position.z = 0.032; tele.add(ecran);
    P.cylindre(s, 0.02, 0.02, 0.5, K.mat.metal({ couleur: "#2a2a2a" }), 3.35, 2.45, 3.62, { rz: PI / 2 - 0.2, cotes: 8 });
    var bleu = K.look.ponctuelle({ couleur: "#cfe0ff", intensite: 1.1, portee: 5 }); bleu.position.set(2.7, 2.3, 3.1); s.add(bleu);
    return {
      scene: s, look: { bloom: 0.75, rayon: 0.55, seuil: 0.85, exposition: 1.1, contraste: 1.12, saturation: 0.95 },
      maj: function (t, c) {
        amp.maj(t); lampe.maj(t); farine.maj(t); neigeDehors.maj(t); tv.maj(t);
        var f = 0.85 + 0.15 * K.fbm1(t * 2.2, 11);
        feu.intensity = 3.2 * f; halo.intensite(0.22 * f);
        bleu.intensity = 1.1 * (0.8 + 0.2 * Math.sin(t * 7.3) * Math.sin(t * 2.1));
      }
    };
  }
  // des ciseaux de tailleur, tout acier (des anneaux noirs ne se liraient pas sur le tissu
  // noir) : deux lames ouvertes, deux anneaux. `mordre` : la lame du dessous descend d'autant,
  // sous le tissu ; celle du dessus et les deux anneaux restent par-dessus
  function ciseauxTailleur(K, THREE, o) {
    o = o || {};
    // l'acier est brossé (rugosité 0,45) : poli, il renvoyait l'ampoule droit dans l'objectif
    var g = new THREE.Group(), mL = K.mat.metal({ couleur: "#b4b8bb", rugosite: 0.45, metal: 0.9 }), mA = K.mat.metal({ couleur: "#7a7e82", rugosite: 0.4, metal: 0.85 });
    [-1, 1].forEach(function (sg) {
      var br = new THREE.Group(); br.rotation.y = sg * 0.22; g.add(br);
      var lame = new THREE.Shape(); lame.moveTo(0, -0.012); lame.lineTo(0.2, -0.003); lame.lineTo(0.2, 0.004); lame.lineTo(0, 0.012);
      var gl = K.garder(new THREE.ExtrudeGeometry(lame, { depth: 0.003, bevelEnabled: false })); gl.rotateX(PI / 2);
      // la lame roule un peu sur son fil (les ciseaux ne sont jamais tout à fait à plat)
      var l = new THREE.Mesh(gl, mL); l.castShadow = true; l.rotation.x = sg * 0.14; if (sg < 0 && o.mordre) l.position.y = -o.mordre; br.add(l);
      var an = new THREE.Mesh(K.garder(new THREE.TorusGeometry(0.026, 0.007, 8, 20)), mA); an.rotation.x = PI / 2; an.position.set(-0.06, 0, sg * 0.02); an.castShadow = true; br.add(an);
      var tige = new THREE.Mesh(K.garder(new THREE.BoxGeometry(0.05, 0.004, 0.01)), mA); tige.position.set(-0.025, 0, sg * 0.01); br.add(tige);
    });
    return g;
  }

  // les toiles qui attendent art.js (la photo), puis les autres
  function photoKevin(K) {
    // un visage d'art.js tiré d'un nom (une fiche déduite : art.js la tire de l'id, toujours la
    // même) : un homme de vingt-quatre ans, sans lunettes ni casquette, qui rit. La fiche de
    // « kevin_marcais_152 » a 25 ans en 1990 : l'année 1989 lui en donne 24. Le casque de
    // chantier se peint ici, par-dessus.
    var spec = { speaker: "kevin_marcais_152", genre: "m", expression: "sourire", camp: "terrain", lieu: "couloir", kind: "scene", cadrage: "serre", annee: 1989, seed: "photo-kevin" };
    return K.tex.visageCouleur(spec, 512).then(function (src) {
      var W = tt(K, 384), H = Math.round(W * 1.35), c = K.tex.canvas(W, H), x = c.getContext("2d"), b = W * 0.06;
      x.fillStyle = "#efe9dc"; x.fillRect(0, 0, W, H);
      var iw = W - b * 2, ih = H - b * 2 - W * 0.08;
      x.save(); x.beginPath(); x.rect(b, b, iw, ih); x.clip();
      // le portrait carré (le viewBox d'art.js fait 400) couvre la photo, en hauteur
      var k2 = ih / 400, ox = b - (ih - iw) / 2, oy = b;
      x.filter = "saturate(0.85) contrast(1.05)";
      x.drawImage(src, 0, 0, src.width, src.height, ox, oy, ih, ih);
      x.filter = "none";
      // le casque de chantier, blanc, posé sur la tête (les yeux tombent à y ≈ 175/400)
      var cx = ox + 200 * k2, cy = oy + 104 * k2;
      x.fillStyle = "#f1f1ea"; x.beginPath(); x.ellipse(cx, cy, 150 * k2, 92 * k2, 0, PI, 0); x.fill();
      x.fillStyle = "#d9d8cf"; x.fillRect(cx - 176 * k2, cy - 6 * k2, 352 * k2, 18 * k2);
      x.fillStyle = "rgba(0,0,0,0.14)"; x.beginPath(); x.ellipse(cx + 46 * k2, cy - 6 * k2, 86 * k2, 74 * k2, 0, PI, 0); x.fill();
      x.fillStyle = "#c9c8bf"; x.fillRect(cx - 9 * k2, cy - 90 * k2, 18 * k2, 86 * k2);
      // le tirage : un voile chaud sur les bords
      var g = x.createRadialGradient(W / 2, b + ih / 2, W * 0.1, W / 2, b + ih / 2, W * 0.75); g.addColorStop(0, "rgba(255,230,190,0)"); g.addColorStop(1, "rgba(60,40,20,0.35)");
      x.fillStyle = g; x.fillRect(b, b, iw, ih);
      x.restore();
      return K.tex.texture(c, { clamp: true });
    });
  }
  // la vitrine vue de la rue : l'intérieur chaud, les étagères, une silhouette au fond
  function toileVitrine(K) {
    // la boutique vue de la rue, à travers la buée : le mur du fond dans la pénombre, les
    // étagères encore vides (les paniers attendent la fournée), la porte du fournil ouverte au
    // fond, orange, et sur le mur l'ombre de quelqu'un qui travaille (une ombre, pas un visage)
    var W = tt(K, 512), H = Math.round(W / 2), c = K.tex.canvas(W, H), x = c.getContext("2d"), u = W / 512, r = K.alea("vitrine-bl");
    var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#3a2414"); g.addColorStop(0.6, "#6a4022"); g.addColorStop(1, "#2a180c");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    // la porte du fournil, au fond à droite : la lueur du four
    var gp = x.createLinearGradient(330 * u, 0, 430 * u, 0); gp.addColorStop(0, "#ffb15a"); gp.addColorStop(1, "#ff8a30");
    x.fillStyle = gp; x.fillRect(338 * u, 40 * u, 74 * u, 150 * u);
    var gl = x.createRadialGradient(375 * u, 120 * u, 10 * u, 375 * u, 120 * u, 190 * u); gl.addColorStop(0, "rgba(255,170,80,0.55)"); gl.addColorStop(1, "rgba(255,140,60,0)");
    x.fillStyle = gl; x.fillRect(0, 0, W, H);
    // l'ombre sur le mur, à gauche de la porte : une épaule, un bras levé (elle enfourne)
    x.fillStyle = "rgba(25,12,5,0.55)";
    x.beginPath(); x.ellipse(300 * u, 82 * u, 13 * u, 16 * u, 0.2, 0, 7); x.fill();
    x.beginPath(); x.moveTo(270 * u, 190 * u); x.quadraticCurveTo(268 * u, 112 * u, 296 * u, 100 * u); x.quadraticCurveTo(322 * u, 108 * u, 326 * u, 190 * u); x.fill();
    x.beginPath(); x.moveTo(316 * u, 116 * u); x.lineTo(352 * u, 92 * u); x.lineTo(356 * u, 100 * u); x.lineTo(322 * u, 128 * u); x.fill();
    // les étagères : des paniers d'osier presque vides, deux ou trois pains de la veille
    for (var i = 0; i < 3; i++) {
      var y = (70 + i * 44) * u;
      x.fillStyle = "rgba(40,22,10,0.9)"; x.fillRect(24 * u, y, 280 * u, 5 * u);
      for (var j = 0; j < 6; j++) {
        x.fillStyle = "rgba(" + (120 + (r() * 30 | 0)) + "," + (78 + (r() * 20 | 0)) + ",38,0.9)";
        x.beginPath(); x.moveTo((30 + j * 46) * u, y); x.lineTo((36 + j * 46) * u, y - 26 * u); x.lineTo((66 + j * 46) * u, y - 26 * u); x.lineTo((72 + j * 46) * u, y); x.fill();
        if (r() < 0.35) { x.fillStyle = "rgba(190,130,60,0.95)"; x.beginPath(); x.ellipse((51 + j * 46) * u, y - 22 * u, 13 * u, 7 * u, 0, 0, 7); x.fill(); }
      }
    }
    // le comptoir vitré, au premier plan, une lumière de veilleuse dessous
    x.fillStyle = "rgba(20,12,6,0.95)"; x.fillRect(0, 196 * u, W, 60 * u);
    x.fillStyle = "rgba(255,200,130,0.35)"; x.fillRect(10 * u, 198 * u, 300 * u, 6 * u);
    // la buée : le bas de la vitre blanchit, et des coulures
    var gb = x.createLinearGradient(0, H * 0.55, 0, H); gb.addColorStop(0, "rgba(230,220,210,0)"); gb.addColorStop(1, "rgba(230,220,210,0.42)");
    x.fillStyle = gb; x.fillRect(0, 0, W, H);
    for (var k = 0; k < 40; k++) { x.fillStyle = "rgba(255,240,225," + (0.1 + r() * 0.2) + ")"; x.fillRect(r() * W, H * (0.5 + r() * 0.3), 1.2 * u, (8 + r() * 30) * u); }
    // les lettres collées sur la vitre, et le montant du milieu
    x.fillStyle = "rgba(255,248,232,0.85)"; x.font = "700 " + Math.round(18 * u) + 'px "Space Mono","DejaVu Sans Mono",monospace'; x.textAlign = "center";
    x.fillText("PAIN · VIENNOISERIE", W * 0.5, 232 * u);
    x.fillStyle = "rgba(14,9,6,1)"; x.fillRect(0, 0, W, 5 * u); x.fillRect(W * 0.5 - 3 * u, 0, 6 * u, H);
    return K.tex.texture(c, { clamp: true });
  }
  function toilePorteVitree(K) {
    var W = tt(K, 128), H = W * 2, c = K.tex.canvas(W, H), x = c.getContext("2d");
    var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#f0b670"); g.addColorStop(1, "#7a3e18");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.fillStyle = "#1c120c"; x.fillRect(0, 0, W, H * 0.04); x.fillRect(0, H * 0.96, W, H * 0.04); x.fillRect(0, 0, W * 0.08, H); x.fillRect(W * 0.92, 0, W * 0.08, H); x.fillRect(0, H * 0.55, W, H * 0.03);
    x.fillStyle = "rgba(255,240,220,0.85)"; x.font = "700 " + Math.round(W * 0.13) + 'px "Space Mono","DejaVu Sans Mono",monospace'; x.textAlign = "center"; x.fillText("OUVERT 6 H 30", W / 2, H * 0.62);
    return K.tex.texture(c, { clamp: true });
  }
  // la rue vue de dedans : la nuit, un lampadaire, une façade aux fenêtres éteintes
  function toileDehors(K) {
    var W = tt(K, 512), H = Math.round(W / 2), c = K.tex.canvas(W, H), x = c.getContext("2d");
    var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#05070e"); g.addColorStop(0.6, "#121a2c"); g.addColorStop(1, "#c9d3e2");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.fillStyle = "#1a1412"; x.fillRect(W * 0.08, H * 0.16, W * 0.84, H * 0.66);
    var r = K.alea("dehors");
    for (var i = 0; i < 14; i++) for (var j = 0; j < 3; j++) { x.fillStyle = r() < 0.08 ? "#ffcf8a" : "#07080b"; x.fillRect(W * (0.11 + i * 0.058), H * (0.22 + j * 0.18), W * 0.03, H * 0.1); }
    var gl = x.createRadialGradient(W * 0.72, H * 0.12, 2, W * 0.72, H * 0.12, W * 0.16); gl.addColorStop(0, "rgba(220,232,255,1)"); gl.addColorStop(1, "rgba(220,232,255,0)");
    x.fillStyle = gl; x.fillRect(0, 0, W, H);
    x.fillStyle = "#dfe6f0"; x.fillRect(0, H * 0.84, W, H * 0.16);
    return K.tex.texture(c, { clamp: true });
  }
  function toileLettres(K) {
    var W = tt(K, 512), H = Math.round(W / 10), c = K.tex.canvas(W, H), x = c.getContext("2d");
    x.fillStyle = "rgba(255,248,232,0.9)"; x.font = "700 " + Math.round(H * 0.6) + 'px "Space Mono","DejaVu Sans Mono",monospace'; x.textAlign = "center"; x.textBaseline = "middle";
    x.save(); x.translate(W, 0); x.scale(-1, 1); x.fillText("PAIN · VIENNOISERIE", W / 2, H / 2); x.restore();   // vue de dedans : à l'envers
    return K.tex.texture(c, { clamp: true });
  }
  function toileBraise(K) {
    var W = tt(K, 256), H = Math.round(W / 4), c = K.tex.canvas(W, H), x = c.getContext("2d");
    var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#3a1004"); g.addColorStop(0.5, "#ff7a22"); g.addColorStop(1, "#ffb860");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (var i = 0; i < 6; i++) { x.fillStyle = "rgba(90,40,10,0.7)"; x.fillRect(W * (0.08 + i * 0.15), H * 0.62, W * 0.12, H * 0.16); }
    return K.tex.texture(c, { clamp: true });
  }

  FC.film({
    id: "seconde_manche",
    livre: "mondial_hiver",
    titre: "La seconde manche",
    duree: 38.5,
    musique: "livre_h9",
    secours: "ville_nuit",
    couleur: GLACE,
    affiche: 34.2,
    habillage: { vignette: 0.58, grain: 0.07, ratioPaysage: 2.35, ratioPortrait: 0 },
    sortie: { noir: 1.4 },
    // le four qu'on referme, la télévision qui s'allume
    sons: [[6.2, "porte"], [23.1, "nouvelle"]],
    textes: [
      { sorte: "lieu", de: 0.9, a: 5.5, texte: "Aubérive, rue des Lilas", sous: "La veille du barrage aller · 5 h 10" },
      { sorte: "replique", de: 17.5, a: 22.6, qui: "Marie-Jo", texte: "Ta chemise, je l'ai lavée deux fois. Elle sent encore le chantier." },
      { sorte: "titre", de: 33.8, a: 38.2, texte: "Aubérive · 2029", sous: "Vingt degrés dedans", entree: 0.2, sortie: 0.7 }
    ],
    montages: { court: [[0.3, 5.2], [6.0, 9.8], [11.4, 15.4], [17.2, 22.6], [23.6, 27.0], [32.6, 38.2]] },
    preparer: function (K, ctx) {
      return photoKevin(K).then(function (photo) {
        var tex = {
          photo: photo, neigeTrottoir: toileNeige(K, { graine: "trottoir", seuil: 0.18, pas: true, repete: [1, 10] }),
          neigeChaussee: toileNeige(K, { graine: "chaussee", seuil: 0.45, traces: true, opacite: 0.85, repete: [1, 6] }),
          carrelage: toileCarrelage(K), marbre: toileMarbre(K), croute: toileCroute(K), chemise: toileChemise(K),
          sac: toileSac(K), vitrine: toileVitrine(K), porteVitree: toilePorteVitree(K), dehors: toileDehors(K), lettresVitrine: toileLettres(K), braise: toileBraise(K)
        };
        return K.etapes(ctx, [
          function () { ctx.decors.rue = rueDesLilas(K, ctx, tex); },
          function () { ctx.decors.boulangerie = boulangerie(K, ctx, tex); }
        ]);
      });
    },
    plans: [
      // 1 · la rue, de haut, puis à hauteur de vitrine : la neige, la vapeur, les caisses
      { de: 0, a: 5.8, decor: "rue", entree: "noir", transition: 1.4, fixe: 4.2,
        camera: { pos: K_cles([[0, [2.4, 6.4, 9.5]], [5.8, [-1.6, 1.75, 1.2]]], "douce"), cible: K_cles([[0, [-3.0, 1.8, -10]], [5.8, [-5.6, 1.35, -4.4]]], "douce"), fov: 50, epaule: 0.1 },
        cadrage: { portrait: { x: K_cles([[0, 0], [5.8, -0.22]]) } } },
      // 2 · le fournil : le four à soles, la sole ouverte, la farine dans la lueur
      { de: 5.8, a: 11.0, decor: "boulangerie", entree: "coupe", fixe: 2.6,
        camera: { pos: K_cles([[0, [-1.1, 1.35, -0.75]], [5.2, [0.35, 1.3, -1.05]]], "lin"), cible: K_cles([[0, [0.3, 1.1, -3.4]], [5.2, [1.2, 1.05, -3.4]]], "lin"), fov: 50, epaule: 0.16 },
        look: { exposition: 0.92 } },
      // 3 · le marbre, de haut : la chemise à une manche, les ciseaux dans la couture ;
      // la caméra descend et tourne un peu (la chemise passe par l'aplomb vers 0,5 s)
      { de: 11.0, a: 16.8, decor: "boulangerie", entree: "fondu", transition: 0.8, fixe: 3.6,
        camera: { pos: function (l) { var k = l / 5.8, a = -0.02 + l * 0.04, h = 1.56 - l * 0.045, R = 0.3 - l * 0.01; return [-0.64 + 0.02 * k + Math.sin(a) * R, 0.96 + h, -1.66 - 0.06 * k + Math.cos(a) * R]; },
          cible: K_cles([[0, [-0.64, 0.96, -1.66]], [5.8, [-0.62, 0.96, -1.72]]], "lin"), fov: 60, epaule: 0.06 },
        // en 16:9, la fenêtre monte un peu : le col et la pointe des ciseaux restent dans la
        // bande (le bas de la chemise, lui, peut sortir)
        cadrage: { paysage: { y: 0.3 } }, look: { exposition: 1.05 } },
      // 4 · la photo de Kévin au-dessus de la caisse, puis le sac à pain
      { de: 16.8, a: 23.0, decor: "boulangerie", entree: "coupe", fixe: 2.4,
        camera: { pos: K_cles([[0, [-2.8, 1.66, 2.62]], [3.0, [-2.74, 1.62, 2.56]], [6.2, [-2.1, 1.78, 2.85]]], "douce"), cible: K_cles([[0, [-3.48, 1.65, 2.86]], [3.0, [-3.48, 1.62, 2.82]], [6.2, [-2.88, 1.08, 2.1]]], "douce"), fov: K_cles([[0, 30], [3.0, 30], [6.2, 52]]), epaule: 0.12 },
        cadrage: { portrait: { x: K_cles([[0, 0], [3.0, 0], [6.2, 0.3]]) } } },
      // 5 · la télévision sans le son, en haut du coin : le Dôme ; derrière la vitre, la neige
      { de: 23.0, a: 29.6, decor: "boulangerie", entree: "coupe", fixe: 3.4,
        camera: { pos: K_cles([[0, [-0.2, 1.25, 0.5]], [6.6, [0.9, 1.5, 1.6]]], "lin"), cible: K_cles([[0, [2.0, 2.15, 3.6]], [6.6, [2.75, 2.38, 3.48]]], "douce"), fov: K_cles([[0, 56], [6.6, 36]], "douce"), epaule: 0.1 },
        cadrage: { portrait: { x: K_cles([[0, -0.75], [6.6, -0.1]]) } } },
      // 6 · la rue, de l'autre trottoir : la boulangerie seule allumée ; le titre
      { de: 29.6, a: 38.5, decor: "rue", entree: "fondu", transition: 1.2, fixe: 5.0,
        camera: { pos: K_cles([[0, [4.6, 1.6, 3.2]], [8.9, [3.9, 2.4, 5.4]]], "lin"), cible: K_cles([[0, [-5.8, 1.6, -3.8]], [8.9, [-5.8, 1.9, -4.6]]], "lin"), fov: 54, epaule: 0.05 },
        cadrage: { portrait: { x: -0.35 } } }
    ]
  });

  // les aides de la trousse, lues quand le film tourne (la trousse est chargée avant le film)
  function K_() { return FC.kit; }
  function K_cles(p, a) { var f = null; return function (t) { if (!f) f = K_().cles(p, a); return f(t); }; }
})(typeof window !== "undefined" ? window : this);
