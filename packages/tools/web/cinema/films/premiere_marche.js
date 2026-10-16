/* ═══════════════════════════════════════════════════════════════════════════
   « La première marche » — livre 10, « Les Deux Téléphones » (2037-2040, la
   présidente du Racing ; la couleur du livre : #FFB547, l'ambre).

   Septembre 2037, les premiers jours d'une présidence. Ce que le film montre, et
   pourquoi :
     · minuit, le bureau du club-house : sur le sous-main, deux téléphones. Le clapet
       gris, ouvert, vibre (« appel masqué ») : c'est lui qui a sonné le soir de
       l'élection, dans la veste au portemanteau (pr.h10.pro6_septembre, « Ici Madame
       Septembre ») ; puis le fixe du bureau, la ville, s'allume à son tour. On ne
       décroche ni l'un ni l'autre. La pluie de la vitre, projetée sur le mur ;
     · sept heures et demie, le stade de la Rive : le mur arrière de la Nord, et
       l'escalier nord qui le longe, trente-trois marches. Une fourgonnette, son
       gyrophare ambre qui tourne dans la bruine ; un maçon en bleu de travail porte un
       parpaing jusqu'au pied de l'escalier ;
     · la première marche, creusée au milieu par des années de semelles : les deux
       parpaings des bouts sont posés ; dans le creux, le mortier, puis le dernier bloc,
       tapoté du manche de la truelle ;
     · l'arrêté de la Ligue, scotché sur la rampe : une marche par mois ;
     · le maçon se relève et lève la tête : en haut du mur, une fenêtre allumée, la
       chambre de Gégé au-dessus du local du kop (une silhouette, une casquette,
       derrière le voilage) : « Bonjour, Gégé. Elle est creusée au milieu, celle-là. Je
       la mure quand même. » ;
     · on monte les trente-trois marches dans la brume, jusqu'au palier ; « Aubérive ·
       2037 / Les Deux Téléphones ».
   Il se joue avant pr.h10.a1_marche* (S0, créneau 1 : toutes les carrières) : la
   carte où l'on parle au maçon, au pied de l'escalier (des écoliers le regardent,
   dans une de ses variantes : d'où l'heure, le matin). Le film ne devance rien : les
   dates de la loi, le compte des marches, la nuit de la dernière restent à la carte et
   au livre. Le maçon, Ahmed Tazi, n'est pas nommé : la carte le présente. On ne voit
   de lui que le dos, les mains, la casquette.

   LES PLANS (37 s) — la lumière, ce que chaque plan dit
   | 1 | 0–8,3    | le bureau à minuit, la lampe verte, la pluie projetée sur le mur ; le
   |   |          | clapet vibre, « appel masqué » (0,2–2,1), puis le fixe s'allume
   |   |          | (2,1–4,1) ; on s'approche des deux téléphones qui se taisent ; carton
   |   |          | « Aubérive, le club-house / Septembre 2037 · minuit » | le titre du
   |   |          | livre : deux téléphones, et aucun qu'on décroche
   | 2 | 8,3–14,5 | le matin, la rue derrière la Nord : le mur, l'escalier qui monte en
   |   |          | diagonale, la fourgonnette et son gyrophare ambre ; le maçon porte un
   |   |          | parpaing (porte : la portière) ; carton « Stade de la Rive, escalier
   |   |          | nord / Sept heures et demie » | le matin d'après
   | 3 | 14,5–20,6| de près, d'en haut : le creux de la première marche entre deux
   |   |          | parpaings, le mortier, les mains, le bloc qui s'y pose (tampon : le
   |   |          | bloc), le manche qui le tapote | on commence par le bas
   | 4 | 20,6–23,2| l'arrêté de la Ligue sur la rampe, lu de haut en bas | la règle
   | 5 | 23,2–27  | le maçon de trois quarts dos, la tête levée ; on monte avec son regard
   |   |          | jusqu'à la fenêtre allumée ; « Bonjour, Gégé. Elle est creusée au
   |   |          | milieu, celle-là. Je la mure quand même. » | qui regarde ; la seule
   |   |          | réplique
   | 6 | 27–37    | on monte l'escalier dans la brume, le gyrophare balaie les marches ;
   |   |          | « Aubérive · 2037 / Les Deux Téléphones » | trente-trois marches
   Le mouvement réduit : une image par plan (`fixe`). La coupe de 30 s (`montages.court`)
   garde les six plans, resserrés. La musique : livre_h10 (son introduction : le
   clapet sonne, le fixe répond ; la ville commence avec le matin), `ville_nuit` en
   secours.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var FC = global.FusibleCinema;
  var PI = Math.PI;
  var AMBRE = "#FFB547";

  function tt(K, n) { return Math.max(64, Math.round(n * (K.qualiteTextures || 1) / 16) * 16); }
  function gm(K, m) { K.garder(m); return m; }
  function MONO(K) { return K.habillage.MONO; }

  // ─── LES MATIÈRES DU FILM ──────────────────────────────────────────────────
  // l'écran intérieur du clapet : l'appel masqué, qui clignote quand il sonne ; puis, le
  // téléphone tu, l'appel manqué, en ambre éteint
  function ecranClapet(K, sonne) {
    return function (x, t, w, h) {
      var on = sonne(t), cl = on && Math.floor(t * 4) % 2 === 0;
      x.fillStyle = on ? "#3a2408" : "#120c04"; x.fillRect(0, 0, w, h);
      if (!on) {
        if (t < 2.1) return;
        x.fillStyle = "#b57a2a"; x.textAlign = "center"; x.textBaseline = "middle";
        x.font = "700 " + Math.round(h * 0.11) + "px " + MONO(K);
        x.fillText("1 APPEL", w / 2, h * 0.4); x.fillText("MANQUÉ", w / 2, h * 0.55);
        return;
      }
      x.fillStyle = cl ? "#ffcf7a" : "#ffb547"; x.textAlign = "center"; x.textBaseline = "middle";
      x.font = "700 " + Math.round(h * 0.12) + "px " + MONO(K);
      x.fillText("APPEL", w / 2, h * 0.36); x.fillText("MASQUÉ", w / 2, h * 0.52);
      x.fillRect(w * 0.3, h * 0.7, w * 0.4, h * 0.03);
    };
  }
  // l'écran du fixe : la ligne qui sonne
  function ecranFixe(K, sonne) {
    return K.tex.ecran({ largeur: 256, hauteur: 96, type: "lcd", fond: "#0a0f12", ips: 8, dessiner: function (x, t, w, h) {
      var on = sonne(t);
      x.fillStyle = on ? "#173040" : "#081014"; x.fillRect(0, 0, w, h);
      x.fillStyle = on ? (Math.floor(t * 3) % 2 ? "#cfe8ff" : "#8fc4ee") : "#20323c";
      x.textAlign = "left"; x.textBaseline = "middle"; x.font = "700 " + Math.round(h * 0.34) + "px " + MONO(K);
      x.fillText(on ? "LIGNE 1 · APPEL" : "00:02", w * 0.06, h * 0.5);
    } });
  }
  // le parpaing : du béton gris, deux alvéoles devinées, les arêtes
  function toileParpaing(K) {
    var W = tt(K, 256), H = Math.round(W / 2), c = K.tex.canvas(W, H), x = c.getContext("2d");
    var n = K.tex.couche(W, H, { periode: 6, octaves: 4, graine: "parpaing", rapportX: 2 }), im = x.createImageData(W, H), d = im.data, r = K.alea("parpaing-t");
    for (var p = 0, q = 0; p < n.length; p++, q += 4) { var v = 128 + (n[p] - 0.5) * 50 + (r() - 0.5) * 30; d[q] = v; d[q + 1] = v * 0.99; d[q + 2] = v * 0.96; d[q + 3] = 255; }
    x.putImageData(im, 0, 0);
    for (var k = 0; k < W * 0.8; k++) { x.fillStyle = "rgba(30,30,30," + r() * 0.5 + ")"; x.beginPath(); x.arc(r() * W, r() * H, 0.5 + r() * 1.6, 0, 7); x.fill(); }
    x.strokeStyle = "rgba(200,198,190,0.6)"; x.lineWidth = 3; x.strokeRect(1.5, 1.5, W - 3, H - 3);
    return K.tex.texture(c);
  }
  // le béton de l'escalier : la marche creusée au milieu, lustrée par les semelles
  function toileMarcheUsee(K) {
    var W = tt(K, 256), c = K.tex.canvas(W, W), x = c.getContext("2d");
    var n = K.tex.couche(W, W, { periode: 5, octaves: 4, graine: "marche-usee" }), im = x.createImageData(W, W), d = im.data;
    for (var p = 0, q = 0; p < n.length; p++, q += 4) {
      var u = (p % W) / W, v = (p / W | 0) / W, creux = Math.exp(-Math.pow((v - 0.5) / 0.26, 2)) * Math.exp(-Math.pow((u - 0.55) / 0.3, 2));
      var bord = Math.exp(-Math.pow((v - 0.5) / 0.4, 2)) * Math.exp(-Math.pow((u - 0.55) / 0.46, 2)) - creux;
      var g = 92 + (n[p] - 0.5) * 36 + creux * 70 - bord * 22;
      d[q] = g; d[q + 1] = g * 0.98; d[q + 2] = g * 0.95; d[q + 3] = 255;
    }
    x.putImageData(im, 0, 0);
    return K.tex.texture(c);
  }
  // l'arrêté de la Ligue, scotché sur la rampe
  function toileArrete(K) {
    var W = tt(K, 512), H = Math.round(W * 1.3), c = K.tex.canvas(W, H), x = c.getContext("2d"), u = W / 512;
    x.fillStyle = "#efece2"; x.fillRect(0, 0, W, H);
    x.fillStyle = "#1a1a1a"; x.textAlign = "center"; x.textBaseline = "middle";
    x.font = "700 " + Math.round(30 * u) + "px " + MONO(K); x.fillText("LIGUE", W / 2, 70 * u);
    x.font = "700 " + Math.round(22 * u) + "px " + MONO(K); x.fillText("ARRÊTÉ DE SÉCURITÉ", W / 2, 120 * u);
    x.fillRect(80 * u, 150 * u, W - 160 * u, 3 * u);
    x.font = "700 " + Math.round(30 * u) + "px " + MONO(K); x.fillText("ESCALIER NORD", W / 2, 220 * u);
    x.font = "400 " + Math.round(22 * u) + "px " + MONO(K);
    ["CONDAMNATION", "PROGRESSIVE :", "UNE MARCHE", "PAR MOIS"].forEach(function (l, i) { x.fillText(l, W / 2, (300 + i * 44) * u); });
    x.font = "400 " + Math.round(15 * u) + "px " + MONO(K); x.fillText("POUR LA LIGUE, LE COMMISSAIRE", W / 2, 560 * u);
    // le tampon, un peu de travers ; le ruban adhésif aux coins ; la pluie qui a gondolé le bas
    x.save(); x.translate(370 * u, 600 * u); x.rotate(-0.2); x.strokeStyle = "rgba(40,60,140,0.75)"; x.lineWidth = 4 * u; x.beginPath(); x.arc(0, 0, 44 * u, 0, 7); x.stroke();
    x.fillStyle = "rgba(40,60,140,0.75)"; x.font = "700 " + Math.round(12 * u) + "px " + MONO(K); x.fillText("LIGUE", 0, -6 * u); x.fillText("VU", 0, 12 * u); x.restore();
    x.fillStyle = "rgba(220,214,190,0.75)"; [[0, 0], [W - 90 * u, 0]].forEach(function (p) { x.fillRect(p[0], p[1], 90 * u, 30 * u); });
    var g = x.createLinearGradient(0, H * 0.8, 0, H); g.addColorStop(0, "rgba(120,110,90,0)"); g.addColorStop(1, "rgba(120,110,90,0.3)"); x.fillStyle = g; x.fillRect(0, 0, W, H);
    return K.tex.texture(c, { clamp: true });
  }
  // la fenêtre de Gégé : la lumière chaude derrière un rideau, une silhouette en casquette
  function toileFenetreGege(K) {
    var W = tt(K, 256), H = Math.round(W * 1.25), c = K.tex.canvas(W, H), x = c.getContext("2d"), u = W / 256;
    var g = x.createRadialGradient(W * 0.5, H * 0.35, 4, W * 0.5, H * 0.45, W * 0.9); g.addColorStop(0, "#ffd8a0"); g.addColorStop(1, "#8a4a1c");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    // la silhouette : une tête en casquette, des épaules, un peu floue (le voilage)
    x.save(); x.filter = "blur(" + (2.4 * u).toFixed(1) + "px)";
    x.fillStyle = "rgba(24,12,6,0.85)";
    x.beginPath(); x.ellipse(126 * u, 120 * u, 26 * u, 31 * u, 0, 0, 7); x.fill();
    x.beginPath(); x.ellipse(122 * u, 96 * u, 32 * u, 13 * u, -0.08, PI, 0); x.fill();
    x.fillRect(84 * u, 94 * u, 76 * u, 7 * u);
    x.beginPath(); x.moveTo(60 * u, H); x.quadraticCurveTo(66 * u, 168 * u, 126 * u, 156 * u); x.quadraticCurveTo(190 * u, 168 * u, 196 * u, H); x.fill();
    x.restore();
    // le voilage, ses plis ; les croisillons
    for (var i = 0; i < 12; i++) { x.fillStyle = "rgba(255,240,220," + (0.06 + (i % 2) * 0.06) + ")"; x.fillRect(i * W / 12, 0, W / 24, H); }
    x.fillStyle = "#1a120c"; x.fillRect(0, 0, W, 6 * u); x.fillRect(0, H - 6 * u, W, 6 * u); x.fillRect(0, 0, 6 * u, H); x.fillRect(W - 6 * u, 0, 6 * u, H); x.fillRect(W / 2 - 3 * u, 0, 6 * u, H); x.fillRect(0, H * 0.48, W, 5 * u);
    return K.tex.texture(c, { clamp: true });
  }
  // la porte du local du kop : une tôle peinte, des autocollants délavés
  function toilePorteLocal(K) {
    var W = tt(K, 256), H = Math.round(W * 2), c = K.tex.canvas(W, H), x = c.getContext("2d"), r = K.alea("local-kop"), u = W / 256;
    x.fillStyle = "#4a2328"; x.fillRect(0, 0, W, H);
    for (var i = 0; i < 26; i++) { x.fillStyle = r.choix(["rgba(230,220,200,0.6)", "rgba(122,31,46,0.8)", "rgba(142,140,134,0.7)", "rgba(255,181,71,0.45)"]); x.save(); x.translate(r() * W, (H * 0.35) + r() * H * 0.5); x.rotate((r() - 0.5) * 0.6); x.fillRect(-14 * u, -9 * u, (16 + r() * 22) * u, (10 + r() * 14) * u); x.restore(); }
    x.fillStyle = "rgba(240,232,214,0.9)"; x.font = "700 " + Math.round(34 * u) + "px " + MONO(K); x.textAlign = "center"; x.fillText("NORD", W / 2, 120 * u);
    x.font = "400 " + Math.round(16 * u) + "px " + MONO(K); x.fillText("LOCAL DES SOCIOS", W / 2, 152 * u);
    return K.tex.texture(c, { clamp: true });
  }
  // la pluie sur la vitre du bureau, projetée sur le mur et le bureau (un gobo, comme
  // dans l'escalier du film de référence)
  function goboPluie(K) {
    return K.tex.ecran({ largeur: 256, hauteur: 256, type: "lcd", fond: "#000", ips: 20, dessiner: function (x, t, w, h) {
      x.fillStyle = "#fff"; x.fillRect(w * 0.05, h * 0.05, w * 0.9, h * 0.9);
      x.fillStyle = "#000"; x.fillRect(w * 0.48, 0, w * 0.04, h); x.fillRect(0, h * 0.48, w, h * 0.04);
      for (var i = 0; i < 50; i++) {
        var gx = K.h01(i, 15) * w, v = 0.06 + K.h01(i, 19) * 0.14, gy = ((K.h01(i, 17) + t * v) % 1) * h * 1.2 - h * 0.1;
        x.fillStyle = "rgba(0,0,0,0.3)"; x.fillRect(gx - 0.8, gy - h * 0.12, 1.6, h * 0.12);
        x.fillStyle = "rgba(255,255,255,0.9)"; x.beginPath(); x.arc(gx, gy, 1.5, 0, 7); x.fill();
      }
      for (var j = 0; j < 120; j++) { x.fillStyle = "rgba(0,0,0," + (0.12 + K.h01(j, 23) * 0.2) + ")"; x.beginPath(); x.arc(K.h01(j, 29) * w, K.h01(j, 31) * h, 0.5 + K.h01(j, 37) * 1.1, 0, 7); x.fill(); }
    } });
  }

  // ─── LE BUREAU, MINUIT ─────────────────────────────────────────────────────
  var SONNE_CLAPET = function (t) { return t > 0.2 && t < 2.1; };
  var SONNE_FIXE = function (t) { return t > 2.1 && t < 4.1; };
  function bureau(K, ctx) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: false, fond: "#020203", environnement: { zenith: "#06080c", horizon: "#141a22", lueur: "#1a1206", fenetres: 4,
      lampes: [{ pos: [0, 30, -20], couleur: "#FFD9A0", intensite: 4, taille: 5 }, { pos: [40, 10, 0], couleur: "#9fb8e8", intensite: 2, taille: 8 }] }, reflets: 0.8,
      ambiance: ["#26324a", "#0c0806", 0.16], brouillard: ["#0a0a0d", 0.05] });
    var mMur = K.mat.beton({ couleur: "#5e574d", graine: "bureau-pres", banches: 0, taches: 0.6 });
    var piece = P.piece({ largeur: 4.6, profondeur: 5, hauteur: 2.9, murs: mMur, sol: K.mat.bois({ couleur: "#3e2818", lames: 7, graine: "parquet-pres", repete: [3, 3] }),
      fenetre: { mur: "droite", x: -0.6, y: 1.55, w: 1.3, h: 1.4 } });
    s.add(piece);
    var dehors = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(4, 3)), gm(K, new THREE.MeshBasicMaterial({ color: new THREE.Color("#1b2738") })));
    dehors.rotation.y = -PI / 2; dehors.position.set(4.2, 1.6, -0.6); s.add(dehors);
    // dehors, au loin : la Nord sans lumière, et le voyant rouge d'un pylône qui clignote
    var voyant = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.05, 8, 6)), K.mat.lumiere({ couleur: "#ff3a2a", intensite: 4, toneMapped: false })); voyant.position.set(4.1, 2.25, -0.95); s.add(voyant);
    var vitre = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(1.3, 1.4)), gm(K, new THREE.MeshPhysicalMaterial({ color: "#10161e", roughness: 0.08, transparent: true, opacity: 0.4, envMapIntensity: 1.4 })));
    vitre.rotation.y = -PI / 2; vitre.position.set(2.29, 1.55, -0.6); s.add(vitre);
    var bur = P.bureau({ lampe: 2.6, ombre: true }); bur.position.set(0, 0, -0.6); s.add(bur);
    // le sous-main, deux téléphones : le fixe à gauche, le clapet ouvert à droite
    var fixe = new THREE.Group(); fixe.position.set(-0.16, 0.78, -0.48); fixe.rotation.y = 0.18; s.add(fixe);
    var mNoir = gm(K, new THREE.MeshStandardMaterial({ color: "#1b1d20", roughness: 0.35, metalness: 0.2 }));
    P.boite(fixe, 0.22, 0.035, 0.19, mNoir, 0, 0.018, 0);
    P.boite(fixe, 0.2, 0.05, 0.05, mNoir, 0, 0.055, -0.06, { rx: -0.25 });
    var comb = new THREE.Mesh(K.garder(new THREE.CapsuleGeometry(0.022, 0.16, 4, 10)), mNoir); comb.rotation.z = PI / 2; comb.position.set(0, 0.06, 0.035); comb.castShadow = true; fixe.add(comb);
    for (var b = 0; b < 12; b++) P.boite(fixe, 0.022, 0.006, 0.016, gm(K, new THREE.MeshStandardMaterial({ color: "#3a3d42", roughness: 0.4 })), -0.05 + (b % 3) * 0.03, 0.038, -0.035 + Math.floor(b / 3) * 0.022);
    var ef = ecranFixe(K, SONNE_FIXE);
    var ecrF = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.11, 0.03)), gm(K, new THREE.MeshBasicMaterial({ map: ef.texture, toneMapped: false, color: new THREE.Color(1, 1, 1).multiplyScalar(1.4) })));
    ecrF.rotation.x = -PI / 2 + 0.25; ecrF.position.set(0.04, 0.083, -0.06); fixe.add(ecrF);
    var ledF = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.005, 8, 6)), K.mat.lumiere({ couleur: "#8fc4ee", intensite: 0.2, toneMapped: false })); ledF.position.set(0.085, 0.04, 0.07); fixe.add(ledF);
    var lumF = K.look.ponctuelle({ couleur: "#8fc4ee", intensite: 0, portee: 1.2 }); lumF.position.set(0.0, 0.15, 0.0); fixe.add(lumF);
    var clapet = P.telephone({ epoque: "clapet", couleur: "#a9adb3", ouvert: -0.45, ecran: ecranClapet(K, SONNE_CLAPET) });
    clapet.scale.setScalar(1.5); var socleC = new THREE.Group(); socleC.position.set(0.12, 0.782, -0.44); socleC.rotation.y = -0.3; socleC.add(clapet); s.add(socleC);
    var lumC = K.look.ponctuelle({ couleur: AMBRE, intensite: 0, portee: 1.0 }); lumC.position.set(0.12, 0.86, -0.5); s.add(lumC);
    var haloC = K.look.halo({ couleur: AMBRE, taille: 0.18, intensite: 0 }); haloC.position.set(0.12, 0.81, -0.56); s.add(haloC);
    // des papiers, un stylo, une tasse froide
    var mTasse = gm(K, new THREE.MeshStandardMaterial({ color: "#e8e2d4", roughness: 0.3 }));
    P.cylindre(s, 0.04, 0.035, 0.09, mTasse, -0.48, 0.825, -0.3, { cotes: 18 });
    P.boite(s, 0.14, 0.008, 0.012, gm(K, new THREE.MeshStandardMaterial({ color: "#1a1a1a", roughness: 0.3, metalness: 0.5 })), 0.38, 0.784, -0.3, { ry: 0.6 });
    // la pluie de la vitre, projetée : la seule lumière froide de la pièce
    var gobo = goboPluie(K);
    var froid = K.look.projecteur({ couleur: "#8fa6d8", intensite: 26, angle: 0.55, penombre: 0.3, decroissance: 2, ombre: true, loin: 12, ombreTaille: 1024 });
    froid.map = gobo.texture; froid.position.set(3.6, 2.4, -0.6); s.add(froid);
    var cf = new THREE.Object3D(); cf.position.set(-0.4, 0.8, -0.6); s.add(cf); froid.target = cf;
    return {
      scene: s, look: { bloom: 0.5, rayon: 0.45, seuil: 0.93, exposition: 1.0, contraste: 1.14, saturation: 0.9 },
      maj: function (t) {
        gobo.maj(t); ef.maj(t); clapet.maj(t);
        var vib = SONNE_CLAPET(t) ? 1 : 0;
        socleC.position.x = 0.12 + vib * Math.sin(t * 90) * 0.0016; socleC.rotation.y = -0.3 + vib * Math.sin(t * 70) * 0.012;
        lumC.intensity = vib * 0.15; haloC.intensite(vib * 0.3);
        var f = SONNE_FIXE(t) ? (Math.floor(t * 3) % 2 ? 1 : 0.5) : 0;
        lumF.intensity = f * 0.3; ledF.material.color.set("#8fc4ee").multiplyScalar(0.2 + f * 6);
        voyant.material.color.set("#ff3a2a").multiplyScalar(Math.floor(t * 0.8) % 2 ? 0.3 : 4);
      }
    };
  }

  // ─── L'ESCALIER NORD, À L'AUBE ─────────────────────────────────────────────
  // Le mur arrière de la Nord est en z = 0 (il regarde +z, la rue). L'escalier le longe et
  // monte vers +x : la marche i occupe x ∈ [0,3 i ; 0,3 (i+1)], son dessus à 0,2 (i+1) ; la
  // première contremarche regarde -x. La rue est devant, z > 1,6.
  var N_MARCHES = 33, GIRON = 0.3, HM = 0.2, LARG = 1.6;
  function escalier(K, ctx, tex) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: { zenith: "#33445f", horizon: "#8a93a2", lueur: "#d6b08c", lueurDir: [1, -0.3], force: 1.0 },
      brouillard: ["#6d7686", 0.03], environnement: { fenetres: 6, teintes: ["#ffd49a", "#9fc4ff"] }, reflets: 0.9, ambiance: ["#8a98b4", "#2a2824", 0.95] });
    // le jour gris du matin, côté rue : il éclaire le mur, et le dos du maçon quand il lève la tête
    var matin = new THREE.DirectionalLight("#b8c4d8", 0.9); matin.position.set(10, 22, 20); matin.target.position.set(-2, 3, 0); s.add(matin); s.add(matin.target);
    // le mur de la Nord : du béton, des banches, la suie ; le bord du toit en haut
    var mMur = K.mat.beton({ couleur: "#6b675f", graine: "mur-nord", banches: 6, taches: 1.1, repete: [6, 2] });
    var mur = new THREE.Mesh(P.boiteUV(70, 15, 1, 3), mMur); mur.position.set(2, 7.5, -0.5); mur.receiveShadow = true; s.add(mur);
    P.boite(s, 70, 0.5, 4, K.mat.metal({ couleur: "#2a2d31", rugosite: 0.6 }), 2, 15.2, 1.0);
    // la rue mouillée, le trottoir
    var rue = P.rue({ longueur: 80, largeur: 9, trottoir: 2.4, flaques: 0.55, graine: "rue-nord" }); rue.rotation.y = PI / 2; rue.position.set(2, 0, 7.6); s.add(rue);
    // l'escalier : les marches (un seul maillage), la première à part (creusée)
    var mBeton = K.mat.beton({ couleur: "#76726a", graine: "marches-nord", banches: 0, taches: 0.9 });
    var marches = new THREE.Group();
    for (var i = 1; i < N_MARCHES; i++) P.boite(marches, GIRON, HM * (i + 1), LARG, mBeton, GIRON * (i + 0.5), HM * (i + 1) / 2, LARG / 2);
    P.fusionner(marches); s.add(marches);
    var mUsee = gm(K, new THREE.MeshStandardMaterial({ map: tex.usee, roughness: 0.55, metalness: 0, envMapIntensity: 1.2 }));
    P.boite(s, GIRON, HM, LARG, mUsee, GIRON * 0.5, HM / 2, LARG / 2);
    // le palier en haut, la porte grillagée qui mène aux gradins
    P.boite(s, 2.6, HM * N_MARCHES, LARG, mBeton, GIRON * N_MARCHES + 1.3, HM * N_MARCHES / 2, LARG / 2);
    P.boite(s, 1.4, 2.3, 0.1, K.mat.rouille({ peinture: "#3b4446", part: 0.35, graine: "grille-nord" }), GIRON * N_MARCHES + 1.4, HM * N_MARCHES + 1.15, 0.06);
    // la rampe, côté rue : une main courante en biais, des montants ; sur le mur, une seconde main courante
    var mRampe = K.mat.metal({ couleur: "#8b9094", rugosite: 0.35 }), rampe = new THREE.Group();
    var long = Math.hypot(N_MARCHES * GIRON, N_MARCHES * HM), ang = Math.atan2(N_MARCHES * HM, N_MARCHES * GIRON);
    P.boite(rampe, long, 0.05, 0.05, mRampe, N_MARCHES * GIRON / 2, N_MARCHES * HM / 2 + 1.0, LARG - 0.04, { rz: ang });
    P.boite(rampe, long, 0.04, 0.04, mRampe, N_MARCHES * GIRON / 2, N_MARCHES * HM / 2 + 0.55, LARG - 0.04, { rz: ang });
    for (var m = 0; m <= N_MARCHES; m += 3) P.boite(rampe, 0.04, 1.0, 0.04, mRampe, m * GIRON + 0.15, HM * (m + 1) + 0.5, LARG - 0.04);
    P.boite(rampe, long, 0.04, 0.06, mRampe, N_MARCHES * GIRON / 2, N_MARCHES * HM / 2 + 0.9, 0.04, { rz: ang });
    P.fusionner(rampe); s.add(rampe);
    // le premier rang de parpaings sur la première marche : ceux des deux bouts sont posés ; le
    // milieu, le creux lustré par les semelles, reste nu : c'est là que le dernier se pose
    var mParp = gm(K, new THREE.MeshStandardMaterial({ map: tex.parpaing, roughness: 0.95 })), mMortier = gm(K, new THREE.MeshStandardMaterial({ color: "#8a8780", roughness: 0.9 }));
    [0.29, 1.31].forEach(function (zz) { P.boite(s, 0.24, 0.025, 0.5, mMortier, 0.15, HM + 0.012, zz); });
    var mortier = P.boite(s, 0.24, 0.025, 0.5, mMortier, 0.15, HM + 0.012, 0.8); mortier.scale.z = 0.001;
    var parp = [];
    for (var k = 0; k < 3; k++) { var bp = P.boite(s, 0.2, 0.2, 0.5, mParp, 0.13, HM + 0.125, 0.29 + k * 0.51); parp.push(bp); }
    // le chantier : la palette de parpaings, les sacs, le seau de mortier, la brouette
    var pal = new THREE.Group(); pal.position.set(-2.6, 0, 3.2); s.add(pal);
    P.boite(pal, 1.2, 0.14, 1.0, K.mat.bois({ couleur: "#8a6a44", lames: 4, graine: "palette" }), 0, 0.07, 0);
    for (var a = 0; a < 3; a++) for (var bb = 0; bb < 2; bb++) for (var cc2 = 0; cc2 < 2; cc2++) P.boite(pal, 0.5, 0.2, 0.2, mParp, -0.27 + cc2 * 0.54, 0.24 + a * 0.21, -0.25 + bb * 0.5);
    P.fusionner(pal);
    var sac = K.tex.texte({ lignes: ["CIMENT", "35 KG"], fond: "#c9bfa6", encre: "#3a3022", largeur: 256, hauteur: 192, graine: "sac-ciment" });
    var mSac = gm(K, new THREE.MeshStandardMaterial({ map: sac.map, roughness: 0.95 }));
    [0, 1].forEach(function (i2) { var sc2 = P.boite(s, 0.6, 0.16, 0.42, mSac, -1.4 + i2 * 0.08, 0.08 + i2 * 0.16, 2.6, { ry: 0.3 + i2 * 0.4 }); sc2.castShadow = true; });
    var seau = P.cylindre(s, 0.16, 0.13, 0.3, gm(K, new THREE.MeshStandardMaterial({ color: "#2a2c2e", roughness: 0.6 })), -0.55, 0.15, 1.15, { cotes: 18, ouvert: true });
    P.cylindre(s, 0.15, 0.15, 0.02, mMortier, -0.55, 0.26, 1.15, { cotes: 18 });
    // la fourgonnette blanche, son gyrophare ambre
    var fg = fourgonnette(K, THREE); fg.position.set(-7.2, 0, 5.2); fg.rotation.y = 0.12; s.add(fg);
    var gyro = new THREE.Group(); gyro.position.set(-7.0, 2.62, 5.1); s.add(gyro);
    var mGyro = K.mat.lumiere({ couleur: AMBRE, intensite: 3, toneMapped: false });
    var dome = new THREE.Mesh(K.garder(new THREE.CylinderGeometry(0.1, 0.12, 0.16, 14)), mGyro); gyro.add(dome);
    var faisceau = K.look.projecteur({ couleur: AMBRE, intensite: 60, angle: 0.32, penombre: 0.4, decroissance: 2, ombre: false });
    gyro.add(faisceau); var cibleG = new THREE.Object3D(); gyro.add(cibleG); faisceau.target = cibleG;
    var haloG = K.look.halo({ couleur: AMBRE, taille: 1.6, intensite: 1.2 }); gyro.add(haloG);
    var coneG = K.look.cone({ longueur: 14, rayonHaut: 0.08, rayonBas: 3.2, couleur: AMBRE, intensite: 0.08 }); gyro.add(coneG);
    // la lampe de chantier, sur son trépied : la lumière froide de la première marche
    var trep = new THREE.Group(); trep.position.set(-1.6, 0, 2.5); s.add(trep);
    var mTrep = K.mat.metal({ couleur: "#e2b02a", rugosite: 0.5 });
    [0, 2.1, 4.2].forEach(function (a2) { P.boite(trep, 0.03, 1.5, 0.03, mTrep, Math.cos(a2) * 0.25, 0.72, Math.sin(a2) * 0.25, { rz: Math.cos(a2) * 0.18, rx: -Math.sin(a2) * 0.18 }); });
    P.boite(trep, 0.32, 0.22, 0.08, gm(K, new THREE.MeshStandardMaterial({ color: "#1c1c1c", roughness: 0.5 })), 0, 1.5, 0, { ry: -0.9 });
    var panneau = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.28, 0.18)), K.mat.lumiere({ couleur: "#f2f6ff", intensite: 4, toneMapped: false }));
    panneau.position.set(0.03, 1.5, 0.04); panneau.rotation.y = -0.9; trep.add(panneau);
    var chantier = K.look.projecteur({ couleur: "#eef3ff", intensite: 26, angle: 0.6, penombre: 0.6, decroissance: 2, ombre: true, loin: 12, ombreTaille: 1024 });
    chantier.position.set(-1.55, 1.5, 2.45); s.add(chantier);
    var cch = new THREE.Object3D(); cch.position.set(0.3, 0.25, 0.8); s.add(cch); chantier.target = cch;
    var haloCh = K.look.halo({ couleur: "#f2f6ff", taille: 0.9, intensite: 0.9 }); haloCh.position.set(-1.52, 1.5, 2.48); s.add(haloCh);
    // l'arrêté de la Ligue, scotché sur le premier montant de la rampe
    var arr = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.21, 0.27)), gm(K, new THREE.MeshStandardMaterial({ map: tex.arrete, roughness: 0.85, side: THREE.DoubleSide })));
    arr.position.set(0.17, 1.02, LARG + 0.005); arr.rotation.z = 0.04; s.add(arr);
    // en haut du mur, la fenêtre de Gégé ; en bas, la porte du local
    var fen = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(1.0, 1.25)), gm(K, new THREE.MeshBasicMaterial({ map: tex.fenetreGege, color: new THREE.Color(1, 1, 1).multiplyScalar(1.1) })));
    fen.position.set(-5.2, 9.2, 0.02); s.add(fen);
    var lumFen = K.look.ponctuelle({ couleur: "#ffc27a", intensite: 6, portee: 6 }); lumFen.position.set(-5.2, 9.0, 0.8); s.add(lumFen);
    P.boite(s, 1.2, 0.08, 0.25, K.mat.beton({ couleur: "#8a857a", graine: "appui" }), -5.2, 8.53, 0.12);
    // l'encadrement : la fenêtre est en retrait dans le mur, un tableau de béton plus clair
    var mTab = K.mat.beton({ couleur: "#7a756b", graine: "tableau-fen" }), tab = new THREE.Group();
    P.boite(tab, 1.24, 0.12, 0.2, mTab, -5.2, 9.88, 0.1); P.boite(tab, 0.12, 1.37, 0.2, mTab, -5.76, 9.22, 0.1); P.boite(tab, 0.12, 1.37, 0.2, mTab, -4.64, 9.22, 0.1);
    P.fusionner(tab); s.add(tab);
    var porteL = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(1.1, 2.2)), gm(K, new THREE.MeshStandardMaterial({ map: tex.porteLocal, roughness: 0.55, metalness: 0.3 })));
    porteL.position.set(-9.5, 1.1, 0.02); s.add(porteL);
    // le maçon : bleu de travail, casquette ; il porte, puis il pose (une truelle à la main)
    var macon = K.gens.mannequin({ tenue: "blouson", couleur: "#2d4a7a", couleur2: "#263f6a", casquette: true, graine: "macon" });
    s.add(macon.groupe);
    var truelle = new THREE.Group(); macon.os.mainD.add(truelle); truelle.position.set(0, -0.08, 0.02);
    var lame = new THREE.Shape(); lame.moveTo(0, 0); lame.lineTo(0.06, 0.16); lame.lineTo(-0.06, 0.16); lame.lineTo(0, 0);
    var gl = K.garder(new THREE.ExtrudeGeometry(lame, { depth: 0.003, bevelEnabled: false })); gl.rotateX(PI / 2);
    var mLame = K.mat.metal({ couleur: "#b9bcbf", rugosite: 0.3 });
    var lm = new THREE.Mesh(gl, mLame); lm.position.set(0, -0.05, 0.02); truelle.add(lm);
    P.cylindre(truelle, 0.012, 0.014, 0.1, K.mat.bois({ couleur: "#8a5a32", lames: 1, graine: "manche-truelle" }), 0, 0, 0, { cotes: 8 });
    var porte = new THREE.Mesh(K.garder(new THREE.BoxGeometry(0.2, 0.2, 0.5)), mParp); porte.castShadow = true; s.add(porte);
    // la brume, un peu de bruine qui finit ; les reflets sur le trottoir mouillé
    var bruine = K.particules.pluie({ n: 3000, zone: { min: [-10, -0.2, -2], max: [12, 12, 14] }, suivre: true, avance: 4, vitesse: [0.3, -6, 0.1], longueur: 0.25, largeur: 0.006, couleur: "#8090a8", opacite: 0.45,
      lumieres: [{ pos: [-7, 2.6, 5.1], couleur: AMBRE, intensite: 0.9, rayon: 6 }, { pos: [-1.5, 1.5, 2.5], couleur: "#eef3ff", intensite: 0.8, rayon: 4 }] });
    s.add(bruine);
    var refl = [K.look.reflet({ pos: [-7, 2.6, 5.1], couleur: AMBRE, intensite: 0.6, largeur: 1.0, longueur: 6 }), K.look.reflet({ pos: [-1.5, 1.5, 2.5], couleur: "#eef3ff", intensite: 0.4, largeur: 0.6, longueur: 3 })];
    refl.forEach(function (r) { s.add(r); });
    // le pylône de la Rive, au loin, dans la brume (une silhouette)
    var mSil = gm(K, new THREE.MeshBasicMaterial({ color: "#3c4452" }));
    var py = new THREE.Mesh(K.garder(new THREE.CylinderGeometry(0.5, 1.2, 34, 4)), mSil); py.position.set(26, 17, -12); s.add(py);
    var tete = new THREE.Mesh(K.garder(new THREE.BoxGeometry(6, 4, 0.6)), mSil); tete.position.set(26, 35, -12); s.add(tete);
    return {
      scene: s, macon: macon, parpaings: parp, porte: porte,
      look: { bloom: 0.6, rayon: 0.55, seuil: 0.9, exposition: 1.1, contraste: 1.1, saturation: 0.88 },
      maj: function (t, c) {
        bruine.maj(t, c.camera);
        refl.forEach(function (r) { r.maj(c.camera); });
        // le gyrophare tourne (un tour par seconde et quart)
        var a = t * 5.0;
        cibleG.position.set(Math.cos(a) * 4, -0.6, Math.sin(a) * 4); coneG.rotation.set(0, 0, 0); coneG.lookAt(gyro.localToWorld(new THREE.Vector3(Math.cos(a) * 4, -0.6, Math.sin(a) * 4)));
        coneG.rotateX(-PI / 2);
        var face = Math.max(0, Math.cos(a - 0.6)), k2 = 0.55 + 0.45 * face;
        haloG.intensite(0.5 + 1.4 * face); mGyro.color.set(AMBRE).multiplyScalar(2 + 4 * face); faisceau.intensity = 60 * k2;
        poserMacon(K, macon, porte, parp, t);
        // le mortier du milieu s'étale à la truelle, d'un bout à l'autre du creux
        var km = K.lisse(14.6, 16.0, t); mortier.scale.z = Math.max(0.001, km); mortier.position.z = 0.55 + 0.25 * km;
      }
    };
  }
  // le maçon à t : il porte le parpaing de la fourgonnette au pied de l'escalier (plan 2) ;
  // accroupi, il étale le mortier dans le creux, pose le bloc du milieu et le tapote du manche
  // de la truelle (plan 3) ; il se relève, se retourne vers le mur et lève la tête vers la
  // fenêtre de Gégé (plans 4 et 5)
  function poserMacon(K, m, bloc, parp, t) {
    var os = m.os, g = m.groupe;
    var depart = [-6.0, 0, 4.4], arrivee = [-0.62, 0, 0.82];
    if (t < 13.6) {
      // la marche, le parpaing dans les bras
      var k = K.lisse(9.0, 13.6, t), x = K.mix(depart[0], arrivee[0], k), z = K.mix(depart[2], arrivee[2], k);
      m.marche(t, k > 0 && k < 1 ? 1.25 : 0.0001);
      if (k <= 0 || k >= 1) m.repos(t);
      m.bras(0.95, 0.12, 0.95, 0.12, 1.05);
      g.position.set(x, 0, z); g.rotation.y = Math.atan2(arrivee[0] - depart[0], arrivee[2] - depart[2]);
      bloc.visible = true; bloc.position.set(x + Math.sin(g.rotation.y) * 0.42, 1.0, z + Math.cos(g.rotation.y) * 0.42); bloc.rotation.set(0, g.rotation.y, 0);
      parp[1].visible = false;
      return;
    }
    g.position.set(arrivee[0], 0, arrivee[2]);
    // arrivé, il se tourne vers la marche ; debout, plus tard, il se retourne vers le mur et la
    // fenêtre (par la gauche)
    var cap = Math.atan2(arrivee[0] - depart[0], arrivee[2] - depart[2]), versFen = Math.atan2(-5.2 - arrivee[0], 0 - arrivee[2]);
    g.rotation.y = K.mix(K.mix(cap, PI / 2, K.lisse(13.6, 14.2, t)), versFen + 2 * PI, K.lisse(21.2, 22.5, t));
    // accroupi : le bassin bas, les cuisses levées, le buste penché vers la marche
    var acc = K.lisse(13.6, 14.4, t) * (1 - K.lisse(20.2, 21.2, t));
    m.repos(t);
    os.bassin.position.y = K.mix(0.95, 0.5, acc) * m.taille;
    os.hancheG.rotation.x = os.hancheD.rotation.x = -1.95 * acc; os.genouG.rotation.x = os.genouD.rotation.x = 2.25 * acc;
    os.piedG.rotation.x = os.piedD.rotation.x = -0.3 * acc;
    os.buste.rotation.x = 0.55 * acc;
    os.tete.rotation.y = 0;
    os.tete.rotation.x = 0.25 * acc - 0.62 * K.lisse(22.4, 23.3, t);
    // le geste : étaler le mortier (14,6–16), poser le bloc (16–18,2), le tapoter (18,4–20)
    var etale = K.cloche(14.5, 14.8, 15.8, 16.1, t), pose = K.lisse(16.0, 18.2, t), tape = K.cloche(18.4, 18.6, 19.8, 20.0, t);
    var balai = Math.sin(t * 5.5) * 0.25 * etale, coup = Math.abs(Math.sin(t * 9)) * 0.3 * tape;
    m.bras(acc * (1.25 + 0.2 * pose), 0.1, acc * (1.2 + 0.2 * etale - coup) + balai * 0.2, 0.15 + balai, acc * (0.5 - 0.2 * pose));
    var p1 = parp[1];
    bloc.visible = pose < 1; p1.visible = pose >= 1;
    if (t < 16.0) {
      // le bloc descend des bras au sol, à côté de lui, pendant qu'il s'accroupit
      var kb = K.lisse(13.6, 14.4, t);
      bloc.position.set(K.mix(arrivee[0] + Math.sin(cap) * 0.42, -0.3, kb), K.mix(1.0, 0.1, kb), K.mix(arrivee[2] + Math.cos(cap) * 0.42, 1.5, kb));
      bloc.rotation.set(0, K.mix(cap, 0.3, kb), 0);
    }
    else if (pose < 1) {
      var e = K.aisance("sortie")(pose);
      bloc.position.set(K.mix(-0.3, 0.13, e), K.mix(0.1, 0.325, pose) + Math.sin(pose * PI) * 0.32, K.mix(1.5, 0.8, e));
      bloc.rotation.set(0, 0.3 * (1 - pose), 0);
    }
  }
  // la fourgonnette : la caisse, la cabine, les roues, la vitre ; un sigle effacé
  function fourgonnette(K, THREE) {
    var g = new THREE.Group(), P = K.props;
    var mC = gm(K, new THREE.MeshPhysicalMaterial({ color: "#e9eaea", roughness: 0.35, metalness: 0.2, clearcoat: 0.6 }));
    var mV = gm(K, new THREE.MeshPhysicalMaterial({ color: "#10151a", roughness: 0.05, metalness: 0.2, envMapIntensity: 1.5 }));
    var mP = gm(K, new THREE.MeshStandardMaterial({ color: "#151515", roughness: 0.8 }));
    P.boite(g, 3.4, 2.1, 1.9, mC, -0.4, 1.35, 0);
    P.boite(g, 1.2, 1.4, 1.9, mC, 1.9, 1.0, 0);
    P.boite(g, 0.05, 0.6, 1.7, mV, 2.5, 1.45, 0, { rz: 0.35 });
    P.boite(g, 0.9, 0.55, 0.04, mV, 1.8, 1.45, 0.96);
    [[1.6, 1], [1.6, -1], [-1.4, 1], [-1.4, -1]].forEach(function (p) { P.cylindre(g, 0.36, 0.36, 0.24, mP, p[0], 0.36, p[1] * 0.86, { rx: PI / 2, cotes: 18 }); });
    var phare = K.mat.lumiere({ couleur: "#fff4e0", intensite: 2.2 });
    [-0.62, 0.62].forEach(function (z) { P.boite(g, 0.04, 0.12, 0.3, phare, 2.51, 0.85, z, { ombre: false }); });
    return g;
  }

  FC.film({
    id: "premiere_marche",
    livre: "escalier_ferme",
    titre: "La première marche",
    duree: 37.0,
    musique: "livre_h10",
    secours: "ville_nuit",
    couleur: AMBRE,
    affiche: 33.4,
    habillage: { vignette: 0.56, grain: 0.07, ratioPaysage: 2.35, ratioPortrait: 0 },
    sortie: { noir: 1.4 },
    // la portière de la fourgonnette, le parpaing qui se pose
    sons: [[8.9, "porte"], [18.2, "tampon_fin"]],
    textes: [
      { sorte: "lieu", de: 0.9, a: 5.6, texte: "Aubérive, le club-house", sous: "Septembre 2037 · minuit" },
      { sorte: "lieu", de: 9.2, a: 13.6, texte: "Stade de la Rive, escalier nord", sous: "Sept heures et demie" },
      { sorte: "replique", de: 23.4, a: 27.0, qui: "Le maçon", texte: "Bonjour, Gégé. Elle est creusée au milieu, celle-là. Je la mure quand même." },
      { sorte: "titre", de: 32.6, a: 36.7, texte: "Aubérive · 2037", sous: "Les Deux Téléphones", entree: 0.2, sortie: 0.7 }
    ],
    montages: { court: [[0.3, 7.6], [8.6, 13.4], [15.4, 19.6], [20.8, 22.9], [23.4, 26.8], [31.6, 36.7]] },
    preparer: function (K, ctx) {
      var tex = { parpaing: toileParpaing(K), usee: toileMarcheUsee(K), arrete: toileArrete(K), fenetreGege: toileFenetreGege(K), porteLocal: toilePorteLocal(K) };
      return K.etapes(ctx, [
        function () { ctx.decors.bureau = bureau(K, ctx); },
        function () { ctx.decors.escalier = escalier(K, ctx, tex); }
      ]);
    },
    plans: [
      // 1 · minuit : deux téléphones sur le sous-main ; le clapet vibre, puis le fixe s'allume
      { de: 0, a: 8.3, decor: "bureau", entree: "noir", transition: 1.2, fixe: 1.6,
        camera: { pos: K_cles([[0, [-1.35, 1.62, 1.25]], [8.3, [-0.78, 1.5, 0.6]]], "douce"), cible: K_cles([[0, [0.0, 0.86, -0.5]], [8.3, [0.0, 0.82, -0.48]]], "douce"), fov: K_cles([[0, 46], [8.3, 34]], "douce"), epaule: 0.06 },
        cadrage: { portrait: { x: K_cles([[0, 0.35], [2.0, 0.35], [3.2, -0.35], [5.0, -0.35], [8.3, 0]], "douce") } } },
      // 2 · le matin, la rue derrière la Nord : le mur, l'escalier, le gyrophare, le maçon qui porte
      { de: 8.3, a: 14.5, decor: "escalier", entree: "noir", transition: 0.8, fixe: 4.6,
        camera: { pos: K_cles([[0, [6.5, 1.75, 15]], [6.2, [4.6, 1.9, 12.4]]], "lin"), cible: K_cles([[0, [1.0, 3.0, 0]], [6.2, [-0.6, 2.4, 0.5]]], "lin"), fov: 54, epaule: 0.08 },
        cadrage: { portrait: { x: K_cles([[0, -0.15], [6.2, -0.3]]) } } },
      // 3 · par-dessus l'épaule du maçon : le creux de la première marche, le mortier, le bloc
      { de: 14.5, a: 20.6, decor: "escalier", entree: "coupe", fixe: 3.9,
        camera: { pos: K_cles([[0, [-0.12, 1.3, 2.05]], [6.1, [-0.05, 1.15, 1.85]]], "douce"), cible: K_cles([[0, [0.14, 0.22, 0.82]], [6.1, [0.14, 0.22, 0.8]]], "douce"), fov: K_cles([[0, 34], [6.1, 30]], "douce"), epaule: 0.08 },
        cadrage: { portrait: { x: 0.2 } } },
      // 4 · l'arrêté de la Ligue, scotché sur la rampe
      { de: 20.6, a: 23.2, decor: "escalier", entree: "coupe", fixe: 1.2,
        camera: { pos: K_cles([[0, [0.28, 1.1, 2.15]], [2.6, [0.24, 1.0, 2.1]]], "lin"), cible: K_cles([[0, [0.17, 1.1, 1.6]], [2.6, [0.17, 0.95, 1.6]]], "douce"), fov: 30, epaule: 0.06 } },
      // 5 · le maçon de trois quarts dos, la tête levée ; on monte avec son regard jusqu'à la fenêtre
      { de: 23.2, a: 27.0, decor: "escalier", entree: "coupe", fixe: 3.5,
        camera: { pos: K_cles([[0, [0.75, 1.35, 3.4]], [3.8, [0.6, 1.3, 3.2]]], "lin"), cible: K_cles([[0, [-0.62, 1.62, 0.82]], [1.1, [-0.72, 1.95, 0.8]], [3.8, [-5.0, 8.6, 0.15]]], "douce"), fov: K_cles([[0, 42], [3.8, 36]], "douce"), epaule: 0.05 } },
      // 6 · on monte l'escalier dans la brume ; le titre
      { de: 27.0, a: 37.0, decor: "escalier", entree: "fondu", transition: 1.0, fixe: 6.4,
        camera: { pos: K_cles([[0, [-0.7, 1.35, 0.85]], [10.0, [7.4, 7.9, 0.85]]], "lin"), cible: K_cles([[0, [3.0, 2.2, 0.8]], [10.0, [12.5, 9.2, 0.6]]], "lin"), fov: 58, epaule: 0.12, frequence: 1.4 },
        cadrage: { portrait: { x: 0.1 } } }
    ]
  });

  function K_() { return FC.kit; }
  function K_cles(p, a) { var f = null; return function (t) { if (!f) f = K_().cles(p, a); return f(t); }; }
})(typeof window !== "undefined" ? window : this);
