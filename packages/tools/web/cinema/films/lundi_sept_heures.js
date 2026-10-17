/* ═══════════════════════════════════════════════════════════════════════════
   « Lundi, sept heures » — le premier film du livre 2, « Le Sapin en carton »
   (1990, l'intérimaire ; la couleur du livre : #6FB0E8).

   Le premier lundi (S0, la carte en.h2.rep.diode : « Lundi, sept heures, ton
   bureau. La cafetière de l'autre est chaude ; seule Madame Josiane a la clé.
   Sur le répondeur à microcassette, une diode rouge clignote. »). Le film se
   joue avant la carte : l'heure qui la précède. Il montre ce que l'absent a
   laissé — c'est la langue du livre : on filme ce que les gens laissent, pas
   les gens — et le mécanisme du livre, le répondeur, sans rien en devancer :
     · le parking du stade à 6 h 40 sous la pluie, la place peinte ENTRAÎNEUR
       et la berline grise de l'autre (le prologue : un sapin en carton au
       rétroviseur, un ticket sous l'essuie-glace, un imperméable plié sur le
       siège du passager) ; au fond, le car du club ;
     · un téléphone sonne, quelque part dans le stade vide ; le bureau, dans le
       noir : la chaise vide, la cafetière chaude qui fume, la pluie ;
     · le répondeur décroche ; son annonce (« son répondeur », dit Josiane au
       prologue : la voix de l'absent, enregistrée) ; le bip ;
     · la bande tourne : quelqu'un parle à une pièce vide, on n'entend pas quoi
       (dans la musique du livre, le piano électrique dit la phrase sans les
       mots) ; la bande s'arrête ; la diode rouge se met à clignoter ;
     · sept heures : l'horloge, puis la lumière du couloir derrière la porte
       vitrée — tu arrives.
   Ce que le film ne dit pas : le message (la carte le fait écouter, ou non),
   qui l'a laissé, d'où ; qui a branché la cafetière. L'appel à 6 h 41 tient
   avec ce que le livre dira plus tard (le lundi, six heures quarante).

   LES PLANS (29 s) :
     1  0–4,8     le parking, la grue : de haut sur la place peinte ENTRAÎNEUR,
                  elle descend jusqu'au capot de la berline ; un téléphone sonne
                  au loin (3,3 s) ; carton « Aubérive, parking du stade / Lundi ·
                  6 h 40 »                                     (le lieu, l'heure)
     2  4,8–7     la berline de près, par le pare-brise mouillé : le sapin en
                  carton qui tourne au rétroviseur, le ticket sous l'essuie-
                  glace, l'imperméable plié ; la deuxième sonnerie (5,3 s)
                                                               (ce qu'il a laissé)
     3  7–11,6    le bureau dans le noir, de la porte : la chaise vide, le
                  bureau, la fenêtre et sa pluie, la cafetière qui fume ; le
                  répondeur décroche (7,3 s), l'annonce, le bip (10,67 s, la
                  musique)                                     (sa voix)
     4  11,6–15,2 par-dessus la chaise : le téléphone, le répondeur, la vitre ;
                  la bande tourne, quelqu'un parle            (un message)
     5  15,2–20   la fenêtre de la cassette : les bobines tournent, puis
                  s'arrêtent (18,4 s) ; la diode rouge clignote (18,6 s) ; en
                  portrait, le cadre glisse des bobines à la diode
     6  20–29     du coin de la fenêtre, à hauteur du bureau : la diode au
                  premier plan, la chaise vide, la porte vitrée ; l'horloge passe
                  à sept heures (22,6 s) ; la lumière du couloir s'allume derrière
                  la vitre (23,6 s) ; carton « Aubérive · 1990 / Le Sapin en
                  carton »                                     (tu arrives)
   La lumière : le sodium du parking, le bleu de l'aube (la couleur du livre),
   le rouge d'une diode (le livre l'écrit rouge), l'ambre d'une cafetière ; la
   pluie partout. Le son : le thème du livre (« Le Répondeur » : son bip, son
   piano qui parle, calés sur les plans au tournage), deux sonneries, les
   déclics de la machine.
   La coupe de 30 s (l'App Store) : le film tient en 29 s ; elle le reprend
   presque entier (montages.court).
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var FC = global.FusibleCinema;
  var PI = Math.PI;
  var BLEU = "#6FB0E8";
  // le temps du film : deux sonneries, la prise de ligne, la fin de la bande, la diode, sept heures
  // (calés sur le thème du livre, à 90 : les sonneries sur des temps, le bip de la musique à 10,67 s
  // juste après l'annonce, son piano qui « dit » le message pendant que la bande tourne)
  var T_SONNE = [3.333, 5.333], T_DECROCHE = 7.333, T_FIN_BANDE = 18.4, T_DIODE = 18.6, T_SEPT = 22.6, T_COULOIR = 23.6;
  // la berline sur sa place (son avant regarde l'allée, +z)
  var BERLINE = [0, 0, -3.6];
  // le bureau : la fenêtre au fond (z = -2), le meuble devant, la chaise tournée vers la vitre
  var FEN = { x: 0.55, y: 1.55, w: 1.5, h: 1.25 }, BUREAU = { x: 0.45, y: 0.75, z: -1.45 };
  var REP = [0.5, 0.772, -1.31], TEL = [0.05, 0.772, -1.29];

  // ─── LES OBJETS DU LIVRE (propres au film) ───────────────────────────────
  // le sapin en carton : un sapin vert à trois étages, imprimé, sa ficelle blanche ; rien d'écrit
  function sapinTexture(K) {
    var W = 128, H = 192, c = K.tex.canvas(W, H), x = c.getContext("2d");
    x.clearRect(0, 0, W, H);
    var forme = function () {
      x.beginPath(); x.moveTo(64, 14);
      [[100, 64], [80, 64], [112, 116], [86, 116], [122, 168], [72, 168], [72, 186], [56, 186], [56, 168], [6, 168], [42, 116], [16, 116], [48, 64], [28, 64]].forEach(function (p) { x.lineTo(p[0], p[1]); });
      x.closePath();
    };
    x.fillStyle = "#2c7a3e"; forme(); x.fill();
    x.save(); forme(); x.clip();
    // l'impression : des aiguilles plus claires, un bord usé, le carton qui pâlit au soleil
    for (var i = 0; i < 260; i++) {
      x.strokeStyle = "rgba(130,200,120," + (0.12 + K.h01(i, 3) * 0.35) + ")"; x.lineWidth = 1.2;
      var px = K.h01(i, 5) * W, py = 20 + K.h01(i, 7) * 150;
      x.beginPath(); x.moveTo(px, py); x.lineTo(px + (K.h01(i, 9) - 0.5) * 10, py + 6); x.stroke();
    }
    var g = x.createLinearGradient(0, 0, W, 0); g.addColorStop(0, "rgba(255,240,200,0.0)"); g.addColorStop(1, "rgba(255,240,200,0.18)");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.restore();
    x.strokeStyle = "rgba(10,30,14,0.8)"; x.lineWidth = 2; forme(); x.stroke();
    x.fillStyle = "#e8e2d2"; x.beginPath(); x.arc(64, 22, 3, 0, 7); x.fill();
    return K.tex.texture(c, { clamp: true });
  }
  // un sapin en carton, sa ficelle ; l'origine est le haut de la ficelle
  function sapin(K, THREE, tex, longueurFicelle) {
    var g = new THREE.Group(), L = longueurFicelle || 0.11;
    var fil = new THREE.Mesh(K.garder(new THREE.CylinderGeometry(0.0009, 0.0009, L, 4)), K.garder(new THREE.MeshStandardMaterial({ color: "#e8e2d2", roughness: 0.8 })));
    fil.position.y = -L / 2; g.add(fil);
    var m = K.garder(new THREE.MeshStandardMaterial({ map: tex, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.85 }));
    var p = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.075, 0.112)), m); p.position.y = -L - 0.05; g.add(p);
    return g;
  }
  // des gouttes sur une vitre : des gouttes posées et d'autres qui glissent (un écran animé)
  function gouttesVitre(K, graine, n) {
    return K.tex.ecran({ largeur: 256, hauteur: 256, type: "lcd", fond: "#000", ips: 20, dessiner: function (x, t, w, h) {
      for (var i = 0; i < (n || 150); i++) {
        var gx = K.h01(i, graine + 1) * w, gy = K.h01(i, graine + 3) * h, r = 0.6 + K.h01(i, graine + 5) * 1.7;
        x.fillStyle = "rgba(255,255,255," + (0.25 + K.h01(i, graine + 7) * 0.5) + ")"; x.beginPath(); x.arc(gx, gy, r, 0, 7); x.fill();
      }
      for (var j = 0; j < 12; j++) {
        var v = 0.05 + K.h01(j, graine + 9) * 0.1, sx = K.h01(j, graine + 11) * w, sy = ((K.h01(j, graine + 13) + t * v) % 1) * h * 1.25 - h * 0.1;
        x.fillStyle = "rgba(255,255,255,0.16)"; x.fillRect(sx - 0.8, sy - h * 0.14, 1.6, h * 0.14);
        x.fillStyle = "rgba(255,255,255,0.95)"; x.beginPath(); x.arc(sx, sy, 2, 0, 7); x.fill();
      }
    } });
  }
  // un quadrilatère (a, b, c, d dans l'ordre), ses UV
  function quad(K, THREE, a, b, c, d) {
    var g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute([].concat(a, b, c, d), 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 1], 2));
    g.setIndex([0, 1, 2, 0, 2, 3]); g.computeVertexNormals();
    return K.garder(g);
  }

  // la berline grise de l'absent : une berline à trois volumes de la fin des années 1980,
  // inventée (aucun modèle réel) ; l'avant regarde +z, la gauche (le conducteur) est en +x ;
  // les roues touchent y = 0. Des vitres qu'on traverse du regard ; dedans, la planche, le
  // volant, les sièges, le rétroviseur et son sapin, l'imperméable plié sur le siège du passager.
  function berline(K, THREE, P, tex) {
    var g = new THREE.Group();
    // un vernis fatigué : le sodium d'en face ne s'y allume pas en soleil
    var mTole = K.garder(new THREE.MeshPhysicalMaterial({ color: "#5b6067", roughness: 0.45, metalness: 0.5, clearcoat: 0.6, clearcoatRoughness: 0.3 }));
    var mNoir = K.garder(new THREE.MeshStandardMaterial({ color: "#111214", roughness: 0.6 }));
    var mChrome = K.mat.metal({ couleur: "#a9aeb3", rugosite: 0.22 });
    var mVitre = K.garder(new THREE.MeshPhysicalMaterial({ color: "#121820", roughness: 0.04, metalness: 0, transparent: true, opacity: 0.3, envMapIntensity: 2.0, depthWrite: false, side: THREE.DoubleSide }));
    // la caisse : le profil (z, y), les passages de roue creusés dedans, extrudé sur la largeur
    var RA = 0.37, roues = [1.36, -1.33];
    var sh = new THREE.Shape();
    sh.moveTo(2.2, 0.27);
    [[2.25, 0.62], [2.07, 0.77], [0.98, 0.88], [-1.45, 0.92], [-2.12, 0.9], [-2.22, 0.72], [-2.2, 0.27]].forEach(function (p) { sh.lineTo(p[0], p[1]); });
    // le bas de caisse, de l'arrière vers l'avant, avec les deux passages de roue
    [roues[1], roues[0]].forEach(function (zr) {
      sh.lineTo(zr - RA, 0.27);
      for (var k = 1; k < 12; k++) { var a = PI - k / 12 * PI; sh.lineTo(zr + Math.cos(a) * RA, 0.27 + Math.sin(a) * RA); }
      sh.lineTo(zr + RA, 0.27);
    });
    sh.lineTo(2.2, 0.27);
    var gc = K.garder(new THREE.ExtrudeGeometry(sh, { depth: 1.62, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 3 }));
    gc.translate(0, 0, -0.81); gc.rotateY(-PI / 2);   // le profil était dans (x, y) : x devient l'avant (+z)
    var caisse = new THREE.Mesh(gc, mTole); g.add(caisse);
    // le pavillon, les vitres, les montants
    var yb = 0.9, yt = 1.36, zpb = 0.98, zpt = 0.28, zlt = -0.86, zlb = -1.45, lv = 1.38;
    P.boite(g, lv + 0.06, 0.05, zpt - zlt + 0.02, mTole, 0, yt + 0.02, (zpt + zlt) / 2);
    var pareBrise = new THREE.Mesh(quad(K, THREE, [-lv / 2, yb, zpb], [lv / 2, yb, zpb], [lv / 2, yt, zpt], [-lv / 2, yt, zpt]), mVitre); pareBrise.renderOrder = 4; g.add(pareBrise);
    var lunette = new THREE.Mesh(quad(K, THREE, [lv / 2, yb, zlb], [-lv / 2, yb, zlb], [-lv / 2, yt, zlt], [lv / 2, yt, zlt]), mVitre); lunette.renderOrder = 4; g.add(lunette);
    [-1, 1].forEach(function (s) {
      var xx = s * (lv / 2 + 0.03);
      var cote = new THREE.Mesh(quad(K, THREE, [xx, yb, zpb - 0.04], [xx, yt - 0.01, zpt], [xx, yt - 0.01, zlt], [xx, yb, zlb + 0.04]), mVitre); cote.renderOrder = 4; g.add(cote);
      var mont = function (a, b, ep) {
        var dy = b[1] - a[1], dz = b[0] - a[0], l = Math.sqrt(dy * dy + dz * dz);
        var m = P.boite(g, ep || 0.06, l, 0.06, mNoir, s * (lv / 2 + 0.03), (a[1] + b[1]) / 2, (a[0] + b[0]) / 2);
        m.rotation.x = Math.atan2(dz, dy);
      };
      mont([zpb, yb], [zpt, yt]); mont([zlb, yb], [zlt, yt]); mont([-0.3, yb], [-0.3, yt], 0.07);
      // le rétroviseur extérieur
      P.boite(g, 0.08, 0.07, 0.12, mNoir, s * (lv / 2 + 0.12), yb + 0.07, zpb - 0.12);
    });
    // les roues, dans leurs passages
    var mPneu = K.garder(new THREE.MeshStandardMaterial({ color: "#101010", roughness: 0.85 }));
    roues.forEach(function (zr) { [-1, 1].forEach(function (s) {
      P.cylindre(g, 0.31, 0.31, 0.2, mPneu, s * 0.72, 0.31, zr, { rz: PI / 2, cotes: 20 });
      P.cylindre(g, 0.17, 0.17, 0.205, mChrome, s * 0.725, 0.31, zr, { rz: PI / 2, cotes: 16 });
    }); });
    // l'avant : les pare-chocs, la calandre, les phares (éteints), la plaque ; l'arrière : les feux
    P.boite(g, 1.68, 0.12, 0.08, mChrome, 0, 0.38, 2.27); P.boite(g, 1.68, 0.12, 0.08, mChrome, 0, 0.38, -2.25);
    P.boite(g, 0.62, 0.16, 0.03, mNoir, 0, 0.58, 2.265);
    var mPhare = K.garder(new THREE.MeshPhysicalMaterial({ color: "#b8bcc0", roughness: 0.1, metalness: 0.3, clearcoat: 1, envMapIntensity: 1.8 }));
    var mFeu = K.garder(new THREE.MeshStandardMaterial({ color: "#5a0d0a", roughness: 0.3, emissive: new THREE.Color("#300404") }));
    [-1, 1].forEach(function (s) { P.boite(g, 0.42, 0.15, 0.03, mPhare, s * 0.58, 0.58, 2.265); P.boite(g, 0.36, 0.14, 0.03, mFeu, s * 0.6, 0.66, -2.245); });
    var pl = K.tex.texte({ lignes: ["8347 RV 12"], fond: "#e9e6dc", encre: "#111", largeur: 512, hauteur: 112, graine: "plaque-berline" });
    var plaque = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.52, 0.11)), K.garder(new THREE.MeshStandardMaterial({ map: pl.map, roughness: 0.5 }))); plaque.position.set(0, 0.42, 2.315); g.add(plaque);
    // les essuie-glaces, et le ticket de la semaine dernière sous celui du conducteur (+x)
    [-0.32, 0.32].forEach(function (x0) { var e = P.boite(g, 0.5, 0.012, 0.02, mNoir, x0, yb + 0.02, zpb - 0.03); e.rotation.z = 0.12; });
    var tk = K.tex.texte({ lignes: ["AVIS DE", "CONTRAVENTION", "N° 004127"], fond: "#efe8d0", encre: "#3a3226", largeur: 256, hauteur: 384, graine: "ticket" });
    var ticket = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.085, 0.13)), K.garder(new THREE.MeshStandardMaterial({ map: tk.map, roughness: 0.75, side: THREE.DoubleSide })));
    var pente = Math.atan2(yt - yb, zpb - zpt);
    ticket.rotation.x = -(PI / 2 - pente); ticket.rotation.z = 0.18; ticket.position.set(0.36, yb + 0.06, zpb - 0.08); g.add(ticket);
    // dedans : le plancher sombre (la caisse est pleine), la planche, le volant à gauche (+x),
    // les sièges, l'imperméable plié sur le siège du passager (-x), le rétroviseur et son sapin
    var mInt = K.garder(new THREE.MeshStandardMaterial({ color: "#1c1a19", roughness: 0.9 }));
    P.boite(g, lv + 0.02, 0.02, zpb - zlb - 0.02, mInt, 0, 0.915, (zpb + zlb) / 2, { ombre: false });
    P.boite(g, 1.36, 0.06, 0.33, mInt, 0, 0.95, 0.665);
    var volant = new THREE.Mesh(K.garder(new THREE.TorusGeometry(0.18, 0.014, 8, 28)), mInt); volant.position.set(0.36, 1.0, 0.42); volant.rotation.x = -0.45; g.add(volant);
    var mSiege = K.garder(new THREE.MeshStandardMaterial({ color: "#3a3532", roughness: 0.92 }));
    [-0.36, 0.36].forEach(function (x) {
      P.boite(g, 0.5, 0.06, 0.48, mSiege, x, 0.955, -0.32);
      var dos = P.boite(g, 0.5, 0.38, 0.1, mSiege, x, 1.1, -0.6); dos.rotation.x = -0.16;
      P.boite(g, 0.26, 0.1, 0.07, mSiege, x, 1.31, -0.64);
    });
    P.boite(g, 1.3, 0.06, 0.46, mSiege, 0, 0.955, -1.05);
    var mImper = K.garder(new THREE.MeshStandardMaterial({ color: "#8a7a5a", roughness: 0.8 }));
    var imper = P.boite(g, 0.38, 0.06, 0.34, mImper, -0.36, 1.015, -0.3); imper.rotation.y = 0.2;
    P.boite(g, 0.32, 0.03, 0.27, mImper, -0.35, 1.06, -0.29).rotation.y = 0.14;
    var ceinture = P.boite(g, 0.03, 0.005, 0.32, K.garder(new THREE.MeshStandardMaterial({ color: "#5b4b35", roughness: 0.7 })), -0.33, 1.079, -0.3); ceinture.rotation.y = 0.5;
    var retro = new THREE.Group(); retro.position.set(0, yt - 0.06, zpt + 0.02); g.add(retro);
    P.boite(retro, 0.012, 0.06, 0.012, mNoir, 0, 0.02, 0);
    P.boite(retro, 0.2, 0.055, 0.025, mNoir, 0, -0.025, 0);
    var sap = sapin(K, THREE, tex.sapin, 0.1); sap.position.set(0.02, -0.05, 0); retro.add(sap);
    // les gouttes sur le pare-brise
    var gp = gouttesVitre(K, 100, 90);
    var mG = K.garder(new THREE.MeshBasicMaterial({ map: gp.texture, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, color: new THREE.Color("#ffb878").multiplyScalar(0.17), side: THREE.DoubleSide }));
    var gpb = new THREE.Mesh(quad(K, THREE, [-lv / 2, yb + 0.005, zpb + 0.004], [lv / 2, yb + 0.005, zpb + 0.004], [lv / 2, yt + 0.005, zpt + 0.004], [-lv / 2, yt + 0.005, zpt + 0.004]), mG); gpb.renderOrder = 5; g.add(gpb);
    g.traverse(function (o) { if (o.isMesh && o.material !== mVitre && o.material !== mG) { o.castShadow = true; o.receiveShadow = true; } });
    g.maj = function (t) {
      gp.maj(t);
      // le sapin tourne sur sa ficelle, lentement, et se balance un peu
      // (il revient toujours vers le pare-brise : de profil, un carton n'est plus qu'un trait)
      sap.rotation.y = Math.sin(t * 0.55) * 0.6 + K.fbm1(t * 0.3, 17) * 0.25;
      sap.rotation.z = Math.sin(t * 1.3) * 0.04; sap.rotation.x = Math.sin(t * 1.1 + 1) * 0.03;
    };
    return g;
  }

  // le car du club : un autocar de la fin des années 1980, bordeaux et gris, sans un mot peint ;
  // l'avant regarde +x
  function autocar(K, THREE, P) {
    var g = new THREE.Group(), L = 11.5, W = 2.5;
    var mGris = K.garder(new THREE.MeshPhysicalMaterial({ color: "#8a8c8e", roughness: 0.4, metalness: 0.4, clearcoat: 0.7 }));
    var mBord = K.garder(new THREE.MeshPhysicalMaterial({ color: "#5c1822", roughness: 0.42, metalness: 0.35, clearcoat: 0.7 }));
    var mVitre = K.garder(new THREE.MeshPhysicalMaterial({ color: "#07090c", roughness: 0.05, metalness: 0.2, envMapIntensity: 2.0 }));
    var mPneu = K.garder(new THREE.MeshStandardMaterial({ color: "#0e0e0e", roughness: 0.9 }));
    P.boite(g, L, 1.1, W, mGris, 0, 0.95, 0);
    P.boite(g, L, 0.35, W + 0.01, mBord, 0, 1.55, 0);
    P.boite(g, L - 0.4, 1.0, W - 0.04, mVitre, -0.1, 2.25, 0);
    P.boite(g, L, 0.36, W, mGris, 0, 2.95, 0);
    P.boite(g, 0.08, 1.7, W - 0.1, mVitre, L / 2 + 0.01, 2.0, 0);
    [-1, 1].forEach(function (s) { [-L / 2 + 1.6, L / 2 - 2.4].forEach(function (x) { P.cylindre(g, 0.5, 0.5, 0.3, mPneu, x, 0.5, s * (W / 2 - 0.12), { rx: PI / 2, cotes: 20 }); }); });
    return g;
  }

  // ─── LE PARKING DU STADE, 6 H 40 ─────────────────────────────────────────
  function parking(K, ctx, tex) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: { zenith: "#03050c", horizon: "#1a2a44", lueur: "#2a3e62", lueurDir: [0.3, -1], force: 0.9 },
      brouillard: ["#0b1220", 0.03], environnement: { fenetres: 10, teintes: ["#FF9A3D", "#9FC4FF"] }, reflets: 1.1, ambiance: ["#33456a", "#0a0806", 0.2] });
    var sol = new THREE.Mesh(P.planUV(70, 60, 6), K.mat.asphalte({ flaques: 0.6, graine: "parking-rive", reflets: 2.0 }));
    sol.rotation.x = -PI / 2; sol.position.set(0, 0, -6); sol.receiveShadow = true; s.add(sol);
    // les places peintes : des lignes ; ENTRAÎNEUR au pied de la place de la berline, côté allée
    // (des lettres étirées, pour qu'on les lise de l'allée ; la peinture usée)
    var c = K.tex.canvas(512, 1024), x = c.getContext("2d");
    x.clearRect(0, 0, 512, 1024);
    x.fillStyle = "rgba(232,228,214,0.92)"; x.fillRect(0, 0, 14, 1024); x.fillRect(498, 0, 14, 1024);
    x.save(); x.translate(256, 851); x.font = "700 92px \"Space Mono\",monospace"; x.textAlign = "center"; x.textBaseline = "middle";
    x.scale(0.6, 2.3); x.fillText("ENTRAÎNEUR", 0, 0); x.restore();
    x.globalCompositeOperation = "destination-out";
    for (var e = 0; e < 1100; e++) { x.fillStyle = "rgba(0,0,0," + (0.3 + K.h01(e, 5) * 0.7) + ")"; x.beginPath(); x.arc(K.h01(e, 7) * 512, K.h01(e, 9) * 1024, 1 + K.h01(e, 11) * 4, 0, 7); x.fill(); }
    x.globalCompositeOperation = "source-over";
    var mPeinture = K.garder(new THREE.MeshStandardMaterial({ map: K.tex.texture(c, { clamp: true }), transparent: true, alphaTest: 0.25, roughness: 0.5, envMapIntensity: 1.2, polygonOffset: true, polygonOffsetFactor: -2 }));
    var place = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(2.6, 5.2)), mPeinture);
    place.rotation.x = -PI / 2; place.position.set(0, 0.006, -2.4); place.receiveShadow = true; s.add(place);
    var lignes = new THREE.Group(), mLigne = K.garder(new THREE.MeshStandardMaterial({ color: "#cfcabb", roughness: 0.55 }));
    [-9.1, -6.5, -3.9, 3.9, 6.5, 9.1].forEach(function (lx) { P.boite(lignes, 0.12, 0.004, 5.2, mLigne, lx, 0.003, -2.4, { ombre: false }); });
    P.fusionner(lignes); s.add(lignes);
    // la berline, garée en marche arrière sur sa place
    var b = berline(K, THREE, P, tex); b.position.set(BERLINE[0], BERLINE[1], BERLINE[2]); s.add(b);
    // le mur du stade de la Rive, ses lettres peintes ; au-dessus, le toit de la tribune, les pylônes
    var mur = new THREE.Mesh(P.boiteUV(46, 5.5, 0.6, 2.4), K.mat.beton({ couleur: "#5a5750", graine: "mur-rive", banches: 3, taches: 1 }));
    mur.position.set(0, 2.75, -8.6); mur.receiveShadow = true; s.add(mur);
    var lettres = K.tex.texte({ lignes: ["STADE DE LA RIVE"], peint: true, largeur: 1024, hauteur: 128, encre: "#cfc6ad", graine: "lettres-rive" });
    var mL = K.garder(new THREE.MeshStandardMaterial({ map: lettres.map, transparent: true, alphaTest: 0.3, roughness: 0.8 }));
    var pan = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(8, 1.0)), mL); pan.position.set(-3.6, 3.3, -8.28); s.add(pan);
    var mToit = K.garder(new THREE.MeshStandardMaterial({ color: "#16181c", roughness: 0.5, metalness: 0.5 }));
    var toit = P.boite(s, 46, 0.2, 9, mToit, 0, 9.8, -13); toit.rotation.x = -0.09;
    var mPyl = K.garder(new THREE.MeshBasicMaterial({ color: "#05070b" }));
    [[-19, -16], [19, -16]].forEach(function (p) {
      var py = new THREE.Mesh(K.garder(new THREE.CylinderGeometry(0.4, 1.0, 26, 4)), mPyl); py.position.set(p[0], 13, p[1]); s.add(py);
      var tt = new THREE.Mesh(K.garder(new THREE.BoxGeometry(4.5, 3, 0.5)), mPyl); tt.position.set(p[0], 26.5, p[1]); s.add(tt);
    });
    // le car du club, au fond, le long du mur, éteint
    var car = autocar(K, THREE, P); car.position.set(-8.6, 0, -6.6); s.add(car);
    // les lampadaires au sodium : au fond à droite (au-dessus de la berline), dans l'allée à
    // gauche (son ombre), un loin à droite ; l'un grésille
    var lamps = [[4.2, -7.4, -2.6, 140, false], [-4.6, 1.4, 0.291, 170, true], [10.5, 0.8, PI, 110, false]].map(function (p, i) {
      var r = P.reverbere({ hauteur: 6.4, bras: 1.4, intensite: p[3], ombre: p[4], gresille: i === 2 ? 1 : 0.15, forceCone: 0.06, halo: 1.9 });
      r.position.set(p[0], 0, p[1]); r.rotation.y = p[2]; s.add(r);
      return r;
    });
    s.updateMatrixWorld(true);
    var lumPluie = lamps.map(function (l, i) { return { pos: l.positionLampe(), couleur: "#FF9A3D", intensite: [1.3, 1.5, 0.9][i], rayon: 7.5 }; });
    lumPluie.push({ pos: [0, 8, 12], couleur: "#7FA8E0", intensite: 0.35, rayon: 16 });
    var pluie = K.particules.pluie({ n: 9000, zone: { min: [-9, -0.2, -12], max: [9, 9, 12] }, suivre: true, avance: 6, vitesse: [0.8, -9.5, 0.3], longueur: 0.42, largeur: 0.01, couleur: "#7f8fae", opacite: 0.8, lumieres: lumPluie });
    s.add(pluie);
    var ronds = K.particules.ronds({ n: 700, zone: { min: [-8, 0.0, -8], max: [8, 0, 10] }, periode: 0.55, rayon: 0.06, couleur: "#9aa6c0", opacite: 0.55, lumieres: lumPluie });
    s.add(ronds);
    var reflets = lamps.map(function (l, i) { var r = K.look.reflet({ pos: l.positionLampe(), couleur: "#FF9A3D", intensite: [1.0, 1.3, 0.8][i], largeur: 0.9, longueur: 8 }); s.add(r); return r; });
    // le réverbère de l'allée, par le pare-brise, sur le sapin du rétroviseur (un projecteur étroit :
    // il ne prend que lui, le rétroviseur, le haut des sièges)
    var surSapin = K.look.projecteur({ couleur: "#FFB060", intensite: 7, angle: 0.16, penombre: 0.8, decroissance: 2, ombre: false });
    surSapin.position.set(BERLINE[0] - 0.5, 2.3, BERLINE[2] + 2.2); s.add(surSapin);
    var cSap = new THREE.Object3D(); cSap.position.set(BERLINE[0] + 0.02, 1.1, BERLINE[2] + 0.3); s.add(cSap); surSapin.target = cSap;
    return {
      scene: s, berline: b,
      look: { bloom: 0.8, rayon: 0.6, seuil: 0.85, exposition: 1.12, contraste: 1.15, saturation: 0.92 },
      maj: function (t, c2) {
        pluie.maj(t, c2.camera); ronds.maj(t); b.maj(t);
        lamps.forEach(function (l) { l.maj(t); });
        reflets.forEach(function (r, i) { r.maj(c2.camera, i === 2 ? 1 - 0.1 * Math.max(0, K.bruit1(t * 9, 7)) : 1); });
      }
    };
  }

  // ─── LE BUREAU DE L'ENTRAÎNEUR, DANS LE NOIR ─────────────────────────────
  // le répondeur à microcassette : ses bobines derrière un capot fumé, ses touches, le
  // compteur des messages, la diode. Aucune marque. L'avant (les touches) regarde +z.
  function repondeur(K, THREE, P) {
    var g = new THREE.Group();
    var mCorps = K.garder(new THREE.MeshStandardMaterial({ color: "#1d1e21", roughness: 0.42 }));
    var mDessus = K.garder(new THREE.MeshStandardMaterial({ color: "#26282c", roughness: 0.36 }));
    P.boite(g, 0.24, 0.05, 0.17, mCorps, 0, 0.025, 0);
    P.boite(g, 0.235, 0.004, 0.165, mDessus, 0, 0.052, 0);
    mDessus.roughness = 0.62;
    // les étiquettes des touches, imprimées sur le dessus
    var c = K.tex.canvas(512, 128), x = c.getContext("2d");
    x.fillStyle = "#26282c"; x.fillRect(0, 0, 512, 128);
    x.fillStyle = "#b8b6ae"; x.font = "700 22px \"Space Mono\",monospace"; x.textAlign = "center";
    ["LECTURE", "EFFACER", "ANNONCE", "ARRÊT"].forEach(function (l, i) { x.fillText(l, 64 + i * 128, 112); });
    var mEtiq = K.garder(new THREE.MeshStandardMaterial({ map: K.tex.texture(c, { clamp: true }), roughness: 0.4 }));
    var etiq = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.22, 0.055)), mEtiq); etiq.rotation.x = -PI / 2; etiq.position.set(0, 0.0545, 0.05); g.add(etiq);
    var mTouche = K.garder(new THREE.MeshStandardMaterial({ color: "#8e8c86", roughness: 0.5 }));
    for (var i = 0; i < 4; i++) P.boite(g, 0.04, 0.008, 0.018, mTouche, -0.0825 + i * 0.055, 0.058, 0.044);
    // la cassette : son boîtier, ses deux bobines (la bande brune), sous le capot fumé
    var cas = new THREE.Group(); cas.position.set(-0.045, 0, -0.035); g.add(cas);
    P.boite(cas, 0.056, 0.004, 0.036, K.garder(new THREE.MeshStandardMaterial({ color: "#3a3b3e", roughness: 0.5 })), 0, 0.0555, 0);
    var mBande = K.garder(new THREE.MeshStandardMaterial({ color: "#6a4426", roughness: 0.3, metalness: 0.25 }));
    var mMoyeu = K.garder(new THREE.MeshStandardMaterial({ color: "#e4e0d6", roughness: 0.4 }));
    var bobines = [-0.014, 0.014].map(function (bx, j) {
      var b = new THREE.Group(); b.position.set(bx, 0.0585, 0); cas.add(b);
      var bande = P.cylindre(b, j ? 0.0085 : 0.0115, j ? 0.0085 : 0.0115, 0.0025, mBande, 0, 0, 0, { cotes: 24 });
      P.cylindre(b, 0.0042, 0.0042, 0.003, mMoyeu, 0, 0.0005, 0, { cotes: 12 });
      for (var d = 0; d < 3; d++) { var dent = P.boite(b, 0.0016, 0.0034, 0.0075, mCorps, 0, 0.0008, 0); dent.rotation.y = d * PI / 3; }
      return { g: b, bande: bande };
    });
    var mFume = K.garder(new THREE.MeshPhysicalMaterial({ color: "#3a2a1c", roughness: 0.08, transparent: true, opacity: 0.3, envMapIntensity: 1.8, depthWrite: false }));
    var capot = P.boite(g, 0.072, 0.003, 0.05, mFume, -0.045, 0.0635, -0.035, { ombre: false }); capot.renderOrder = 4;
    // le compteur (un chiffre rouge) et la diode
    var compteur = K.tex.ecran({ largeur: 64, hauteur: 96, type: "lcd", fond: "#120404", ips: 4, dessiner: function (xx, t, w, h) {
      xx.fillStyle = "#ff3a2a"; xx.shadowColor = "#ff2a1a"; xx.shadowBlur = 6; xx.font = "700 76px \"Space Mono\",monospace"; xx.textAlign = "center"; xx.textBaseline = "middle";
      xx.fillText(t < T_FIN_BANDE ? "0" : "1", w / 2, h / 2 + 4);
    } });
    var mCpt = K.garder(new THREE.MeshBasicMaterial({ map: compteur.texture, toneMapped: false, color: new THREE.Color(1, 1, 1).multiplyScalar(1.3) }));
    // le compteur et la diode, tout près de la fenêtre de la cassette
    var cpt = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.016, 0.024)), mCpt); cpt.rotation.x = -PI / 2; cpt.position.set(0.02, 0.0548, -0.045); g.add(cpt);
    var mDiode = K.mat.lumiere({ couleur: "#FF2A20", intensite: 6, toneMapped: false });
    var diode = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.0042, 10, 8)), mDiode); diode.position.set(0.042, 0.0555, -0.022); g.add(diode);
    var haloD = K.look.halo({ couleur: "#FF2A20", taille: 0.035, intensite: 0 }); haloD.position.set(0.042, 0.059, -0.022); g.add(haloD);
    var lumD = K.look.ponctuelle({ couleur: "#FF2A20", intensite: 0, portee: 1.2 }); lumD.position.set(0.042, 0.075, -0.022); g.add(lumD);
    g.cassette = [-0.045, 0.06, -0.035]; g.diode = [0.042, 0.0555, -0.022];
    g.traverse(function (o) { if (o.isMesh && o !== capot) { o.castShadow = true; o.receiveShadow = true; } });
    g.maj = function (t) {
      compteur.maj(t);
      // les bobines : elles tournent de la prise de ligne à la fin de la bande (l'annonce, puis le message)
      var a = Math.max(0, Math.min(t, T_FIN_BANDE) - T_DECROCHE) * 7.5;
      bobines[0].g.rotation.y = -a; bobines[1].g.rotation.y = -a * 1.3;
      var k = K.borne((Math.min(t, T_FIN_BANDE) - T_DECROCHE) / 40, 0, 1);
      bobines[0].bande.scale.set(1 - 0.12 * k, 1, 1 - 0.12 * k); bobines[1].bande.scale.set(1 + 0.18 * k, 1, 1 + 0.18 * k);
      // la diode : éteinte, puis elle clignote (trois quarts de seconde allumée, une demi éteinte)
      var on = t < T_DIODE ? 0 : ((t - T_DIODE) % 1.2 < 0.75 ? 1 : 0);
      mDiode.color.set("#FF2A20").multiplyScalar(3.5 * on + 0.12); haloD.intensite(1.0 * on); lumD.intensity = 0.05 * on;
    };
    return g;
  }
  // un téléphone de bureau de 1990, à touches : le socle, le combiné, le cordon en spirale ;
  // les touches regardent +z
  function telephone(K, THREE, P) {
    var g = new THREE.Group(), mP = K.garder(new THREE.MeshStandardMaterial({ color: "#cfc6b0", roughness: 0.42 }));
    var socle = new THREE.Shape(); socle.moveTo(-0.11, 0); socle.lineTo(0.11, 0); socle.lineTo(0.1, 0.07); socle.lineTo(-0.1, 0.045); socle.lineTo(-0.11, 0);
    var gs = K.garder(new THREE.ExtrudeGeometry(socle, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2 }));
    gs.translate(0, 0, -0.1); gs.rotateY(PI / 2);
    g.add(new THREE.Mesh(gs, mP));
    var mK = K.garder(new THREE.MeshStandardMaterial({ color: "#e8e2d4", roughness: 0.5 }));
    var touches = new THREE.Group(); g.add(touches);
    for (var i = 0; i < 12; i++) { var kk = P.boite(touches, 0.018, 0.008, 0.014, mK, -0.03 + (i % 3) * 0.024, 0.062 + Math.floor(i / 3) * 0.0045, 0.05 - Math.floor(i / 3) * 0.019); kk.rotation.x = -0.12; }
    P.fusionner(touches);
    var comb = new THREE.Group(); comb.position.set(0.0, 0.088, -0.05); g.add(comb);
    P.boite(comb, 0.2, 0.03, 0.045, mP, 0, 0, 0);
    [-0.085, 0.085].forEach(function (x) { P.boite(comb, 0.05, 0.035, 0.055, mP, x, -0.012, 0); });
    var pts = []; for (var k = 0; k < 90; k++) { var u = k / 89, ang = u * PI * 2 * 16; pts.push(new THREE.Vector3(-0.11 - u * 0.12 + Math.cos(ang) * 0.007, 0.07 - u * 0.06 + Math.sin(ang) * 0.007, -0.04 + u * 0.06)); }
    g.add(new THREE.Mesh(K.garder(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 180, 0.0022, 5, false)), mP));
    g.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    g.combine = comb;
    return g;
  }
  // la cafetière électrique : le corps noir, la verseuse de verre et son café, la plaque, le voyant ambre
  function cafetiere(K, THREE, P) {
    var g = new THREE.Group(), mN = K.garder(new THREE.MeshStandardMaterial({ color: "#151517", roughness: 0.35 }));
    P.boite(g, 0.2, 0.03, 0.22, mN, 0, 0.015, 0);
    P.boite(g, 0.2, 0.34, 0.07, mN, 0, 0.17, -0.075);
    P.boite(g, 0.2, 0.06, 0.2, mN, 0, 0.31, 0.0);
    var mVerre = K.garder(new THREE.MeshPhysicalMaterial({ color: "#c8d2dc", roughness: 0.05, metalness: 0, transparent: true, opacity: 0.28, envMapIntensity: 2.2, depthWrite: false, side: THREE.DoubleSide }));
    var verseuse = P.cylindre(g, 0.068, 0.072, 0.15, mVerre, 0, 0.11, 0.03, { cotes: 24, ombre: false }); verseuse.renderOrder = 4;
    P.cylindre(g, 0.064, 0.068, 0.07, K.garder(new THREE.MeshStandardMaterial({ color: "#1a0e08", roughness: 0.2, metalness: 0.1 })), 0, 0.07, 0.03, { cotes: 24 });
    P.cylindre(g, 0.072, 0.072, 0.012, mN, 0, 0.19, 0.03, { cotes: 24 });
    var voy = new THREE.Mesh(K.garder(new THREE.BoxGeometry(0.014, 0.007, 0.004)), K.mat.lumiere({ couleur: "#FFA640", intensite: 4, toneMapped: false })); voy.position.set(0.06, 0.016, 0.112); g.add(voy);
    var hv = K.look.halo({ couleur: "#FFA640", taille: 0.06, intensite: 1.0 }); hv.position.set(0.06, 0.016, 0.118); g.add(hv);
    var lv = K.look.ponctuelle({ couleur: "#FF9A40", intensite: 0.025, portee: 1.0 }); lv.position.set(0.06, 0.03, 0.14); g.add(lv);
    g.traverse(function (o) { if (o.isMesh && o.material !== mVerre) { o.castShadow = true; o.receiveShadow = true; } });
    g.haut = [0, 0.2, 0.03];
    return g;
  }
  // l'horloge murale : un cadran blanc, deux aiguilles ; elle regarde +z (avant qu'on la pose)
  function horloge(K, THREE, P) {
    var g = new THREE.Group(), c = K.tex.canvas(256, 256), x = c.getContext("2d");
    x.fillStyle = "#e9e5da"; x.beginPath(); x.arc(128, 128, 124, 0, 7); x.fill();
    x.fillStyle = "#1b1b1b";
    for (var i = 0; i < 60; i++) { x.save(); x.translate(128, 128); x.rotate(i * PI / 30); x.fillRect(-(i % 5 ? 1.5 : 4), -116, i % 5 ? 3 : 8, i % 5 ? 10 : 22); x.restore(); }
    var face = new THREE.Mesh(K.garder(new THREE.CircleGeometry(0.16, 40)), K.garder(new THREE.MeshStandardMaterial({ map: K.tex.texture(c, { clamp: true }), roughness: 0.4 }))); g.add(face);
    var anneau = new THREE.Mesh(K.garder(new THREE.TorusGeometry(0.165, 0.012, 8, 40)), K.garder(new THREE.MeshStandardMaterial({ color: "#2a2a2c", roughness: 0.35, metalness: 0.5 }))); g.add(anneau);
    var mA = K.garder(new THREE.MeshStandardMaterial({ color: "#121212", roughness: 0.4 }));
    var hP = new THREE.Group(), mP2 = new THREE.Group(); g.add(hP); g.add(mP2);
    P.boite(hP, 0.014, 0.09, 0.004, mA, 0, 0.035, 0.006); P.boite(mP2, 0.009, 0.13, 0.004, mA, 0, 0.055, 0.01);
    g.heure = function (h, m) { mP2.rotation.z = -m / 60 * PI * 2; hP.rotation.z = -((h % 12) + m / 60) / 12 * PI * 2; };
    return g;
  }
  // la chaise de bureau : l'étoile à cinq branches, le vérin, l'assise, le dossier ; elle regarde -z
  function chaise(K, THREE, P) {
    var g = new THREE.Group();
    // l'assise et le dossier : des coussins aux coins ronds, en skaï usé
    var coussin = function (w, h, ep, r) {
      var s = new THREE.Shape(), x0 = -w / 2, y0 = -h / 2;
      s.moveTo(x0 + r, y0); s.lineTo(x0 + w - r, y0); s.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + r); s.lineTo(x0 + w, y0 + h - r);
      s.quadraticCurveTo(x0 + w, y0 + h, x0 + w - r, y0 + h); s.lineTo(x0 + r, y0 + h); s.quadraticCurveTo(x0, y0 + h, x0, y0 + h - r); s.lineTo(x0, y0 + r); s.quadraticCurveTo(x0, y0, x0 + r, y0);
      var ge = new THREE.ExtrudeGeometry(s, { depth: ep, bevelEnabled: true, bevelThickness: 0.022, bevelSize: 0.022, bevelSegments: 4, curveSegments: 6 });
      ge.translate(0, 0, -ep / 2);
      return K.garder(ge);
    };
    var mS = K.garder(new THREE.MeshStandardMaterial({ color: "#7d6552", roughness: 0.42 })), mM = K.mat.metal({ couleur: "#3a3c40", rugosite: 0.4 });
    for (var i = 0; i < 5; i++) { var br = P.boite(g, 0.04, 0.03, 0.3, mM, Math.sin(i * PI * 0.4) * 0.15, 0.06, Math.cos(i * PI * 0.4) * 0.15); br.rotation.y = i * PI * 0.4; }
    P.cylindre(g, 0.028, 0.028, 0.34, mM, 0, 0.24, 0, { cotes: 10 });
    var assise = new THREE.Mesh(coussin(0.44, 0.42, 0.04, 0.08), mS); assise.rotation.x = -PI / 2; assise.position.set(0, 0.45, 0); g.add(assise);
    P.boite(g, 0.05, 0.3, 0.03, mM, 0, 0.58, 0.22);
    var dos = new THREE.Mesh(coussin(0.42, 0.48, 0.035, 0.1), mS); dos.rotation.x = 0.1; dos.position.set(0, 0.85, 0.245); g.add(dos);
    [-1, 1].forEach(function (s) { P.boite(g, 0.05, 0.03, 0.26, mS, s * 0.25, 0.64, 0.04); P.boite(g, 0.03, 0.18, 0.03, mM, s * 0.25, 0.55, 0.1); });
    g.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    return g;
  }
  // le tableau du tacticien, contre le mur de droite : le feutre vert, les lignes à la craie,
  // onze aimants bordeaux, deux flèches ; rien d'écrit
  function tableauTactique(K) {
    var W = 512, H = 384, c = K.tex.canvas(W, H), x = c.getContext("2d");
    x.fillStyle = "#1f3a2a"; x.fillRect(0, 0, W, H);
    for (var i = 0; i < 1600; i++) { x.fillStyle = "rgba(" + (K.h01(i, 3) < 0.5 ? "10,20,14" : "70,110,80") + ",0.25)"; x.fillRect(K.h01(i, 5) * W, K.h01(i, 7) * H, 2, 2); }
    x.strokeStyle = "rgba(230,230,220,0.75)"; x.lineWidth = 3;
    x.strokeRect(24, 24, W - 48, H - 48); x.beginPath(); x.moveTo(W / 2, 24); x.lineTo(W / 2, H - 24); x.stroke();
    x.beginPath(); x.arc(W / 2, H / 2, 46, 0, 7); x.stroke();
    x.strokeRect(24, H / 2 - 90, 70, 180); x.strokeRect(W - 94, H / 2 - 90, 70, 180);
    var pos = [[60, 192], [130, 80], [130, 150], [130, 234], [130, 304], [230, 70], [230, 160], [230, 224], [230, 314], [340, 150], [340, 234]];
    pos.forEach(function (p) { x.fillStyle = "#7a1f2e"; x.beginPath(); x.arc(p[0], p[1], 11, 0, 7); x.fill(); x.fillStyle = "rgba(255,255,255,0.35)"; x.beginPath(); x.arc(p[0] - 3, p[1] - 3, 3, 0, 7); x.fill(); });
    x.strokeStyle = "rgba(240,240,230,0.7)"; x.lineWidth = 2.5; x.setLineDash([8, 6]);
    [[[240, 70], [380, 100]], [[350, 234], [430, 200]]].forEach(function (f) { x.beginPath(); x.moveTo(f[0][0], f[0][1]); x.lineTo(f[1][0], f[1][1]); x.stroke(); });
    x.setLineDash([]);
    return K.tex.texture(c, { clamp: true });
  }
  // dehors, par la fenêtre du bureau : le terrain d'entraînement à l'aube, le toit de la tribune,
  // un pylône éteint, deux sodiums
  function aubeTexture(K) {
    var W = 512, H = 512, c = K.tex.canvas(W, H), x = c.getContext("2d"), gd = x.createLinearGradient(0, 0, 0, H);
    gd.addColorStop(0, "#08111f"); gd.addColorStop(0.45, "#1d3456"); gd.addColorStop(0.6, "#33507a"); gd.addColorStop(0.63, "#1a2232"); gd.addColorStop(1, "#0b0d10");
    x.fillStyle = gd; x.fillRect(0, 0, W, H);
    // le toit de la tribune d'en face, le pylône
    x.fillStyle = "#06080c"; x.beginPath(); x.moveTo(0, 270); x.lineTo(340, 262); x.lineTo(340, 300); x.lineTo(0, 312); x.closePath(); x.fill();
    x.fillRect(0, 300, 340, 26);
    x.fillRect(408, 120, 7, 210); x.fillRect(384, 110, 56, 26);
    // le terrain : du gris-vert, des lignes pâles
    x.fillStyle = "#121a16"; x.fillRect(0, 326, W, 186);
    x.strokeStyle = "rgba(200,210,200,0.25)"; x.lineWidth = 2; x.beginPath(); x.moveTo(0, 360); x.lineTo(W, 352); x.moveTo(250, 326); x.lineTo(180, 512); x.stroke();
    // deux sodiums dans la pluie
    [[90, 300, 34], [470, 318, 28]].forEach(function (p) { var gr = x.createRadialGradient(p[0], p[1], 1, p[0], p[1], p[2]); gr.addColorStop(0, "rgba(255,210,140,1)"); gr.addColorStop(0.25, "rgba(255,150,70,0.55)"); gr.addColorStop(1, "rgba(255,120,40,0)"); x.fillStyle = gr; x.fillRect(p[0] - p[2], p[1] - p[2], p[2] * 2, p[2] * 2); });
    return K.tex.texture(c, { clamp: true });
  }

  function bureau(K, ctx, tex) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: false, fond: "#020305", environnement: { zenith: "#060a14", horizon: "#1a2a44", lueur: "#2a1a0e", fenetres: 6, lampes: [{ pos: [30, 10, -60], couleur: "#9FC4FF", intensite: 2, taille: 12 }] },
      reflets: 0.8, ambiance: ["#2c3c5c", "#0a0806", 0.28], brouillard: ["#06080e", 0.02] });
    // la pièce : de la peinture verte jusqu'à un mètre (le soubassement), crème au-dessus ; du linoléum
    var W = 4.2, D = 4.0, H = 2.7;
    var cm = K.tex.canvas(256, 512), xm = cm.getContext("2d");
    xm.fillStyle = "#b5ae96"; xm.fillRect(0, 0, 256, 512);
    xm.fillStyle = "#3f5546"; xm.fillRect(0, 322, 256, 190); xm.fillStyle = "#26352b"; xm.fillRect(0, 316, 256, 8);
    var nm = K.tex.couche(256, 512, { periode: 4, octaves: 4, graine: "mur-bureau" }), im = xm.getImageData(0, 0, 256, 512);
    for (var q = 0, kq = 0; kq < nm.length; kq++, q += 4) { var v = 0.84 + nm[kq] * 0.24; im.data[q] *= v; im.data[q + 1] *= v; im.data[q + 2] *= v; }
    xm.putImageData(im, 0, 0);
    var tMur = K.tex.texture(cm, {}); tMur.wrapT = THREE.ClampToEdgeWrapping;
    var mMur = K.garder(new THREE.MeshStandardMaterial({ map: tMur, roughness: 0.8 }));
    var cl = K.tex.canvas(256, 256), xl = cl.getContext("2d"); xl.fillStyle = "#3a2e26"; xl.fillRect(0, 0, 256, 256);
    for (var t0 = 0; t0 < 1600; t0++) { xl.fillStyle = "rgba(" + (K.h01(t0, 3) < 0.5 ? "20,14,10" : "120,100,80") + "," + (0.2 + K.h01(t0, 5) * 0.4) + ")"; xl.fillRect(K.h01(t0, 7) * 256, K.h01(t0, 9) * 256, 2, 2); }
    var mSol = K.garder(new THREE.MeshStandardMaterial({ map: K.tex.texture(cl, {}), roughness: 0.42, envMapIntensity: 0.8 }));
    var piece = P.piece({ largeur: W, profondeur: D, hauteur: H, murs: mMur, sol: mSol, plafond: K.mat.beton({ couleur: "#8f8b80", graine: "plafond-bureau", banches: 0 }), fenetre: { mur: "fond", x: FEN.x, y: FEN.y, w: FEN.w, h: FEN.h } });
    s.add(piece);   // le fond en z = -D/2 ; le devant (z = +D/2) est ouvert, la caméra n'y regarde pas
    // les murs : la peinture se lit à la hauteur réelle (le soubassement ne remonte pas au-dessus de la fenêtre)
    piece.updateMatrixWorld(true);
    var vw = new THREE.Vector3();
    piece.traverse(function (o) {
      if (!o.isMesh || o.material !== mMur) return;
      var pa = o.geometry.attributes.position, uv = o.geometry.attributes.uv;
      for (var i = 0; i < pa.count; i++) { vw.fromBufferAttribute(pa, i).applyMatrix4(o.matrixWorld); uv.setY(i, vw.y / H); }
      uv.needsUpdate = true;
    });
    var xF = FEN.x, yF = FEN.y, zF = -D / 2;
    // la fenêtre : le châssis, la vitre, les gouttes ; dehors, l'aube bleue et la pluie
    var mCh = K.garder(new THREE.MeshStandardMaterial({ color: "#c8c2b0", roughness: 0.55 }));
    P.boite(s, FEN.w, 0.06, 0.06, mCh, xF, yF + FEN.h / 2 - 0.03, zF); P.boite(s, FEN.w + 0.1, 0.06, 0.16, mCh, xF, yF - FEN.h / 2 + 0.03, zF + 0.05);
    P.boite(s, 0.06, FEN.h, 0.06, mCh, xF - FEN.w / 2 + 0.03, yF, zF); P.boite(s, 0.06, FEN.h, 0.06, mCh, xF + FEN.w / 2 - 0.03, yF, zF); P.boite(s, 0.05, FEN.h, 0.05, mCh, xF, yF, zF);
    var dehors = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(6, 5)), K.garder(new THREE.MeshBasicMaterial({ map: tex.aube, color: new THREE.Color(1, 1, 1).multiplyScalar(0.95), fog: false })));
    dehors.position.set(xF, yF + 0.3, zF - 2.4); s.add(dehors);
    var pluieD = K.particules.pluie({ n: 1000, zone: { min: [xF - 1.8, 0.2, zF - 2.0], max: [xF + 1.8, 3.4, zF - 0.2] }, vitesse: [0.6, -9.5, 0.2], longueur: 0.36, largeur: 0.007, couleur: "#9ab0d0", opacite: 0.7,
      lumieres: [{ pos: [xF, yF + 1.5, zF - 1.5], couleur: "#8FB4E8", intensite: 0.8, rayon: 3 }, { pos: [xF - 0.6, yF - 0.8, zF - 1.6], couleur: "#FF9A3D", intensite: 0.7, rayon: 2.5 }] });
    s.add(pluieD);
    var mVitre = K.garder(new THREE.MeshPhysicalMaterial({ color: "#0e141c", roughness: 0.06, transparent: true, opacity: 0.22, envMapIntensity: 1.5, depthWrite: false }));
    var vitre = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(FEN.w - 0.06, FEN.h - 0.06)), mVitre); vitre.position.set(xF, yF, zF + 0.01); vitre.renderOrder = 3; s.add(vitre);
    var gv = gouttesVitre(K, 300, 190);
    var mGv = K.garder(new THREE.MeshBasicMaterial({ map: gv.texture, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, color: new THREE.Color("#a8c4f0").multiplyScalar(0.3) }));
    var gouttes = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(FEN.w - 0.06, FEN.h - 0.06)), mGv); gouttes.position.set(xF, yF, zF + 0.014); gouttes.renderOrder = 4; s.add(gouttes);
    // la lumière qui entre : le bleu de l'aube (large, ses ombres : les montants sur le bureau et la
    // chaise), le sodium d'en bas (au plafond)
    var aube = K.look.projecteur({ couleur: "#7FA4DC", intensite: 14, angle: 0.62, penombre: 0.9, decroissance: 2, ombre: true, loin: 12, ombreTaille: 1024 });
    aube.position.set(xF + 0.5, yF + 1.3, zF - 2.2); s.add(aube);
    var ca = new THREE.Object3D(); ca.position.set(xF - 0.4, 0.5, 0.2); s.add(ca); aube.target = ca;
    // (sous l'appui, il viserait aussi le bureau à travers le mur : il part du bas du carreau, raide)
    var sodium = K.look.projecteur({ couleur: "#FF9A3D", intensite: 4, angle: 0.45, penombre: 0.9, decroissance: 2, ombre: false });
    sodium.position.set(xF, yF - 0.45, zF - 0.5); s.add(sodium);
    var cs = new THREE.Object3D(); cs.position.set(xF - 0.3, H, -0.2); s.add(cs); sodium.target = cs;
    // le jour bleu qui entre et s'étale sur les murs, doucement
    var bleu = K.look.ponctuelle({ couleur: "#6F90C8", intensite: 1.6, portee: 0 }); bleu.position.set(xF, yF + 0.2, zF + 0.6); s.add(bleu);
    // le bureau (le meuble), contre la fenêtre : un plateau de bois, deux caissons
    var mB = K.mat.bois({ couleur: "#4a3322", lames: 4, graine: "bureau-entraineur" });
    var bx = BUREAU.x, by = BUREAU.y, bz = BUREAU.z;
    P.boite(s, 1.6, 0.045, 0.78, mB, bx, by, bz); P.boite(s, 0.42, 0.73, 0.74, mB, bx - 0.58, 0.365, bz); P.boite(s, 0.42, 0.73, 0.74, mB, bx + 0.58, 0.365, bz);
    var mPap = K.mat.papier({ graine: "papiers-bureau", couleur: "#e4dccb" });
    var rp = K.alea("papiers-entraineur");
    for (var pp = 0; pp < 5; pp++) { var f = P.boite(s, 0.21, 0.002, 0.297, mPap, bx - 0.52 + rp() * 0.14, by + 0.024 + pp * 0.002, bz - 0.12 + rp() * 0.1); f.rotation.y = (rp() - 0.5) * 0.5; }
    // un sous-main, une chemise fermée, une tasse, un cendrier
    P.boite(s, 0.55, 0.004, 0.38, K.garder(new THREE.MeshStandardMaterial({ color: "#2a3a2e", roughness: 0.7 })), bx + 0.02, by + 0.024, bz + 0.12);
    var chemise = P.boite(s, 0.24, 0.012, 0.32, K.garder(new THREE.MeshStandardMaterial({ color: "#b89a62", roughness: 0.8 })), bx + 0.5, by + 0.029, bz - 0.12); chemise.rotation.y = -0.15;
    P.cylindre(s, 0.038, 0.034, 0.085, K.garder(new THREE.MeshStandardMaterial({ color: "#d8d2c6", roughness: 0.3 })), bx + 0.66, by + 0.065, bz + 0.16, { cotes: 14 });
    P.cylindre(s, 0.06, 0.05, 0.02, K.mat.metal({ couleur: "#6a6c70", rugosite: 0.3 }), bx - 0.66, by + 0.032, bz + 0.2, { cotes: 18 });
    // le téléphone et le répondeur, côte à côte, au bord du bureau (la chaise devant)
    var tel = telephone(K, THREE, P); tel.position.set(TEL[0], TEL[1], TEL[2]); tel.rotation.y = 0.2; s.add(tel);
    var rep = repondeur(K, THREE, P); rep.position.set(REP[0], REP[1], REP[2]); rep.rotation.y = -0.06; s.add(rep);
    // la chaise, vide, tournée vers la fenêtre
    var ch = chaise(K, THREE, P); ch.position.set(bx + 0.02, 0, bz + 0.86); ch.rotation.y = 0.12; s.add(ch);
    // la cafetière, sur le classeur à droite du bureau, sa vapeur
    var mClasseur = K.mat.metal({ couleur: "#55595c", rugosite: 0.5, metal: 0.6 });
    P.boite(s, 0.46, 1.0, 0.5, mClasseur, 1.68, 0.5, zF + 0.4);
    var caf = cafetiere(K, THREE, P); caf.position.set(1.66, 1.0, zF + 0.42); caf.rotation.y = -0.35; s.add(caf);
    s.updateMatrixWorld(true);
    var vh = new THREE.Vector3(caf.haut[0], caf.haut[1], caf.haut[2]); caf.localToWorld(vh);
    var vapeur = K.particules.fumee({ n: 30, source: [vh.x, vh.y, vh.z], vent: [0.02, 0.01], montee: 0.16, vie: 4.5, taille: 0.09, etalement: 0.02, couleur: "#c8ccd4", lueur: "#d8dce4", opacite: 0.24, graine: "vapeur",
      lumieres: [{ pos: [xF + 0.6, yF + 0.4, zF + 0.2], couleur: "#7FA4DC", intensite: 1.0, rayon: 2.0 }, { pos: [vh.x, vh.y - 0.15, vh.z + 0.1], couleur: "#FF9A40", intensite: 0.5, rayon: 0.5 }] });
    s.add(vapeur);
    // le tableau du tacticien, au mur de droite, dans son cadre d'aluminium
    var mAlu = K.mat.metal({ couleur: "#9a9ea2", rugosite: 0.35 });
    var tab = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(1.2, 0.9)), K.garder(new THREE.MeshStandardMaterial({ map: tex.tableau, roughness: 0.9 })));
    tab.rotation.y = -PI / 2; tab.position.set(W / 2 - 0.02, 1.55, -0.2); tab.receiveShadow = true; s.add(tab);
    P.boite(s, 0.03, 0.03, 1.26, mAlu, W / 2 - 0.03, 2.0, -0.2); P.boite(s, 0.03, 0.03, 1.26, mAlu, W / 2 - 0.03, 1.1, -0.2);
    P.boite(s, 0.03, 0.93, 0.03, mAlu, W / 2 - 0.03, 1.55, -0.83); P.boite(s, 0.03, 0.93, 0.03, mAlu, W / 2 - 0.03, 1.55, 0.43);
    // le néon du plafond, éteint
    P.boite(s, 1.3, 0.06, 0.2, K.mat.metal({ couleur: "#cfcfc8", rugosite: 0.5, metal: 0.2 }), 0, H - 0.03, -0.3);
    // la porte, dans le mur de gauche : le bois, la vitre dépolie (ENTRAÎNEUR peint dehors, à l'envers
    // vu d'ici) ; l'horloge à côté
    var px = -W / 2 + 0.02, pz = 1.1;
    var mPorte = K.mat.bois({ couleur: "#5a4430", lames: 3, graine: "porte-bureau" });
    P.boite(s, 0.05, 0.85, 0.88, mPorte, px, 0.425, pz); P.boite(s, 0.05, 0.14, 0.88, mPorte, px, 1.98, pz);
    P.boite(s, 0.05, 1.06, 0.1, mPorte, px, 1.38, pz - 0.39); P.boite(s, 0.05, 1.06, 0.1, mPorte, px, 1.38, pz + 0.39);
    var mCadre = K.garder(new THREE.MeshStandardMaterial({ color: "#3a2a1c", roughness: 0.7 }));
    P.boite(s, 0.06, 2.12, 0.06, mCadre, px + 0.01, 1.06, pz - 0.47); P.boite(s, 0.06, 2.12, 0.06, mCadre, px + 0.01, 1.06, pz + 0.47); P.boite(s, 0.06, 0.06, 1.0, mCadre, px + 0.01, 2.1, pz);
    var cg = K.tex.canvas(256, 384), xg = cg.getContext("2d");
    xg.fillStyle = "#cfd2cf"; xg.fillRect(0, 0, 256, 384);
    for (var gg = 0; gg < 2400; gg++) { xg.fillStyle = "rgba(255,255,255," + (K.h01(gg, 3) * 0.25) + ")"; xg.fillRect(K.h01(gg, 5) * 256, K.h01(gg, 7) * 384, 2, 2); }
    xg.save(); xg.translate(128, 120); xg.scale(-1, 1); xg.fillStyle = "rgba(30,30,32,0.8)"; xg.font = "700 30px \"Space Mono\",monospace"; xg.textAlign = "center"; xg.fillText("ENTRAÎNEUR", 0, 0); xg.restore();
    var tDepoli = K.tex.texture(cg, { clamp: true });
    var mDepoli = K.garder(new THREE.MeshStandardMaterial({ map: tDepoli, roughness: 0.6, emissive: new THREE.Color("#FFD9A0"), emissiveMap: tDepoli, emissiveIntensity: 0 }));
    var depoli = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.68, 0.98)), mDepoli); depoli.rotation.y = PI / 2; depoli.position.set(px + 0.005, 1.38, pz); s.add(depoli);
    var hor = horloge(K, THREE, P); hor.rotation.y = PI / 2; hor.position.set(-W / 2 + 0.03, 1.76, 0.3); s.add(hor);
    // sept heures : la lumière du couloir, à travers la vitre, en biais vers le bureau
    var couloir = K.look.projecteur({ couleur: "#FFC98A", intensite: 0, angle: 0.85, penombre: 0.9, decroissance: 2, ombre: false });
    couloir.position.set(px + 0.12, 1.55, pz); s.add(couloir);
    var cc = new THREE.Object3D(); cc.position.set(bx, 0.4, bz + 0.6); s.add(cc); couloir.target = cc;
    var haloPorte = K.look.halo({ couleur: "#FFD9A0", taille: 1.3, intensite: 0 }); haloPorte.position.set(px + 0.05, 1.4, pz); s.add(haloPorte);
    var poussiere = K.particules.poussiere({ n: 240, zone: { min: [xF - 0.9, 0.8, zF + 0.1], max: [xF + 0.9, 2.2, zF + 1.2] }, couleur: "#a8c0e8", opacite: 0.45, taille: 0.006,
      lumieres: [{ pos: [xF, yF, zF + 0.4], couleur: "#7FA4DC", intensite: 1.0, rayon: 1.6 }] });
    s.add(poussiere);
    return {
      scene: s, repondeur: rep, telephone: tel,
      // la fenêtre de la cassette et la diode, dans le monde (le plan 5 passe de l'une à l'autre)
      cassetteMonde: rep.localToWorld(new THREE.Vector3().fromArray(rep.cassette)).toArray(),
      diodeMonde: rep.localToWorld(new THREE.Vector3().fromArray(rep.diode)).toArray(),
      look: { bloom: 0.7, rayon: 0.55, seuil: 0.85, exposition: 1.2, contraste: 1.14, saturation: 0.95 },
      maj: function (t, c2) {
        pluieD.maj(t); gv.maj(t); vapeur.maj(t); poussiere.maj(t);
        rep.maj(t);
        // l'horloge : six heures cinquante-neuf, puis sept heures
        hor.heure(6, t < T_SEPT ? 59 : 60);
        // le combiné tremble à chaque coup de la sonnerie (la cloche frappée vingt fois par seconde)
        var son = 0;
        T_SONNE.forEach(function (ts) { var d = t - ts; if ((d >= 0 && d < 0.4) || (d >= 0.62 && d < 1.02)) son = Math.abs(Math.sin(d * PI * 40)); });
        tel.combine.position.y = 0.088 + son * 0.0014;
        // sept heures : la lumière du couloir s'allume derrière la porte vitrée
        var k = K.lisse(T_COULOIR, T_COULOIR + 0.3, t);
        mDepoli.emissiveIntensity = 0.95 * k; couloir.intensity = 30 * k; haloPorte.intensite(0.35 * k);
      }
    };
  }

  FC.film({
    id: "lundi_sept_heures",
    livre: "interimaire",
    titre: "Lundi, sept heures",
    duree: 29.0,
    musique: "livre_h2",
    musiqueFilm: "film_lundi_sept_heures",
    secours: "ville_nuit",
    couleur: BLEU,
    affiche: 26.4,
    habillage: { vignette: 0.56, grain: 0.07, ratioPaysage: 2.35, ratioPortrait: 0 },
    sortie: { noir: 1.2 },
    // deux sonneries, le déclic de la prise de ligne, la bande qui s'arrête
    sons: [[T_SONNE[0], "sonnerie"], [T_SONNE[1], "sonnerie"], [T_DECROCHE, "reaction"], [T_FIN_BANDE, "reaction"]],
    textes: [
      { sorte: "lieu", de: 0.5, a: 4.4, texte: "Aubérive, parking du stade", sous: "Lundi · 6 h 40" },
      { sorte: "replique", de: 7.45, a: 10.9, qui: "Le répondeur", texte: "Bureau de l'entraîneur. Laissez un message, je rappelle." },
      { sorte: "titre", de: 24.0, a: 28.2, texte: "Aubérive · 1990", sous: "Le Sapin en carton", entree: 0.2, sortie: 0.7 }
    ],
    montages: { court: [[0.2, 28.9]] },
    preparer: function (K, ctx) {
      var tex = { sapin: sapinTexture(K), tableau: tableauTactique(K), aube: aubeTexture(K) };
      return K.etapes(ctx, [
        function () { ctx.decors.parking = parking(K, ctx, tex); },
        function () { ctx.decors.bureau = bureau(K, ctx, tex); }
      ]);
    },
    plans: [
      // 1 · le parking, la grue : de haut sur la place peinte, jusqu'au capot de la berline
      { de: 0, a: 4.8, decor: "parking", entree: "noir", transition: 1.2, fixe: 1.6,
        camera: { pos: K_cles([[0, [2.6, 4.6, 6.0]], [4.8, [0.55, 1.3, -1.6]]], "douce"), cible: K_cles([[0, [0.0, 0.0, -0.9]], [4.8, [0.25, 0.97, -2.7]]], "douce"), fov: 46, epaule: 0.1 } },
      // 2 · par le pare-brise : le sapin qui tourne au rétroviseur ; derrière, l'imperméable plié
      { de: 4.8, a: 7.0, decor: "parking", entree: "coupe", fixe: 1.4,
        camera: { pos: K_cles([[0, [0.17, 1.17, -2.22]], [2.2, [0.12, 1.15, -2.42]]], "lin"), cible: [0.02, 1.08, -3.3], fov: 34, epaule: 0.1 } },
      // 3 · le bureau dans le noir, de la porte : la chaise vide, la fenêtre, la cafetière ; l'annonce
      { de: 7.0, a: 11.6, decor: "bureau", entree: "coupe", fixe: 2.6,
        camera: { pos: K_cles([[0, [-1.55, 1.5, 1.3]], [4.6, [-1.35, 1.46, 1.05]]], "douce"), cible: [0.45, 1.05, -1.5], fov: 50, epaule: 0.08 } },
      // 4 · par-dessus la chaise : le téléphone, le répondeur, la vitre ; la bande tourne
      { de: 11.6, a: 15.2, decor: "bureau", entree: "coupe", fixe: 2.0,
        camera: { pos: K_cles([[0, [0.16, 1.12, -0.28]], [3.6, [0.2, 1.08, -0.4]]], "lin"), cible: [0.32, 0.86, -1.36], fov: 44, epaule: 0.1 } },
      // 5 · les bobines, de tout près ; elles s'arrêtent ; la diode rouge clignote
      { de: 15.2, a: 20.0, decor: "bureau", entree: "coupe", fixe: 4.65,
        camera: {
          pos: function (l, p, c) { var a = c.decors.bureau.cassetteMonde; return [a[0] + 0.02 + l * 0.002, a[1] + 0.07 - l * 0.002, a[2] + 0.15 - l * 0.003]; },
          cible: function (l, p, c) { var b = c.decors.bureau, a = b.cassetteMonde, d = b.diodeMonde, k = K_lisse(3.1, 3.9, l); return [a[0] + (d[0] - a[0]) * k, a[1] + (d[1] - a[1]) * k, a[2] + (d[2] - a[2]) * k]; },
          fov: 40, epaule: 0.05 },
        // de si près, la diode remplirait l'image de son halo : le bloom se retient
        look: { bloom: 0.3, seuil: 0.95 } },
      // 6 · du coin de la fenêtre : la diode au premier plan, la chaise vide, la porte ; sept heures
      { de: 20.0, a: 29.0, decor: "bureau", entree: "coupe", fixe: 6.2,
        camera: { pos: K_cles([[0, [1.22, 0.9, -1.74]], [9.0, [1.12, 0.92, -1.6]]], "douce"), cible: K_cles([[0, [-2.0, 1.05, 1.0]], [9.0, [-2.0, 1.1, 1.05]]], "douce"), fov: 64, epaule: 0.06 } }
    ]
  });

  // les aides de la trousse, lues quand le film tourne (la trousse est chargée avant le film)
  function K_() { return FC.kit; }
  function K_cles(p, a) { var f = null; return function (t) { if (!f) f = K_().cles(p, a); return f(t); }; }
  function K_lisse(a, b, x) { return K_().lisse(a, b, x); }
})(typeof window !== "undefined" ? window : this);
