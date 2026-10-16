/* ═══════════════════════════════════════════════════════════════════════════
   « La buanderie » — livre 6, « 23 h 58 » (2003-2006, la directrice sportive ;
   la couleur du livre : #B49BFF). Le second film du livre : un rêve.

   QUAND : avant l'intermède de la buanderie (ds.h6.sous_sol.buanderie), la fin de
   l'intrigue du sous-sol (la clé USB du stagiaire, puis Vukić et l'escalier). La
   carte dit : « Tu rêves de la buanderie de 1987 : les maillots de l'année sèchent sur
   des fils, la vapeur monte, et quelque part dans le linge un téléphone sonne sans
   fin. Tu le cherches à tâtons. » Le film est ce rêve, jusqu'au bord du geste : il
   finit sur le téléphone qui sonne, et la carte demande « Je décroche ». Il ne dit rien
   de plus que le rêve : ni la ligne de 1987 (c'est Josiane qui la trouvera sur la
   facture), ni qui envoie quoi.

   LA LISTE DES PLANS (31,6 s ; image maîtresse carrée, fenêtres 16:9 → 2,35:1 et 9:16)
    1  0,0–5,0   buanderie · une ampoule nue qui se balance dans la vapeur ; la
                 première sonnerie, étouffée. [lieu : LA BUANDERIE DU CLUB-HOUSE /
                 1987 · EN RÊVE]
    2  5,0–10,5  buanderie · l'allée : des fils tendus d'un mur à l'autre, rang après
                 rang, les maillots bordeaux de l'année, numéros blancs dans le dos,
                 qui sèchent et se balancent ; lente avancée.
    3  10,5–15,0 buanderie · la machine : derrière le hublot, un maillot tourne ; on
                 lève les yeux : au-dessus, l'horloge arrêtée sur 23 h 58.
    4  15,0–21,5 buanderie · à tâtons, à travers le linge : la caméra pousse les
                 maillots, rang après rang ; ils s'écartent et retombent derrière ;
                 le dernier rang passé, le regard tombe sur un panier.
    5  21,5–27,5 buanderie · trouvé : derrière le dernier rang, dans un panier de
                 serviettes, un téléphone beige à cadran qui sonne ; le combiné
                 tremble sur sa fourche à chaque sonnerie.
    6  27,5–31,6 buanderie · de près : le combiné, la sonnerie ; noir sur la
                 sonnerie. [titre : AUBÉRIVE · 1987 / 23 H 58]
   LA LUMIÈRE : trois ampoules nues dans la vapeur (en candelas, decay 2), celle du
   milieu qui se balance et fait bouger les ombres ; la brume chaude du rêve.
   LES BRUITS : la sonnerie du téléphone, toutes les quatre secondes, sans fin.
   LA MUSIQUE : le thème du livre (livre_h6).
   LA COUPE DE 30 S (l'aperçu de l'App Store) : les six plans, resserrés (montages.court).
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var FC = global.FusibleCinema;
  var PI = Math.PI;
  var VIOLET = "#B49BFF";
  // les sonneries (le téléphone sonne sans fin) : deux coups, toutes les quatre secondes
  var SONNERIES = [1.5, 5.5, 9.5, 13.5, 17.5, 21.5, 25.5, 29.3];

  function unique(ctx, cle, fn) { var c = ctx.matieresFilm || (ctx.matieresFilm = {}); return c[cle] || (c[cle] = fn()); }
  function tailleQ(K, n) { return Math.max(64, Math.round(n * (K.qualiteTextures || 1) / 16) * 16); }
  // le combiné sursaute quand la cloche frappe (0 à 1)
  function sursaut(t) {
    for (var i = 0; i < SONNERIES.length; i++) {
      var d = t - SONNERIES[i];
      if (d >= 0 && d < 1.15) { var r = d < 0.5 ? d : d - 0.62; return r >= 0 && r < 0.5 ? Math.abs(Math.sin(r * 120)) * (1 - r * 2) : 0; }
    }
    return 0;
  }

  // ─── LES MAILLOTS DE 1987 : un atlas 4 × 4, vus de dos (le bordeaux du club, le col
  // blanc, la bande blanche aux manches, le numéro), et trois serviettes blanches
  function texMaillots(K) {
    var C = tailleQ(K, 1024), u = C / 4, c = K.tex.canvas(C, C), x = c.getContext("2d");
    x.clearRect(0, 0, C, C);
    var numeros = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    for (var k = 0; k < 16; k++) {
      var ox = (k % 4) * u, oy = Math.floor(k / 4) * u, s = u / 256;
      x.save(); x.translate(ox, oy); x.scale(s, s);
      if (k >= 13) {
        // une serviette, pendue par un coin
        x.fillStyle = "#e9e4d8"; x.beginPath(); x.moveTo(40, 10); x.lineTo(216, 10); x.lineTo(206, 240); x.lineTo(50, 236); x.closePath(); x.fill();
        x.fillStyle = "rgba(160,150,130,0.25)"; for (var b = 0; b < 6; b++) x.fillRect(44, 30 + b * 34, 168, 4);
        x.restore(); continue;
      }
      // le corps et les manches (vu de dos, pendu par les épaules)
      x.fillStyle = "#7a1f2e";
      x.beginPath();
      x.moveTo(78, 12); x.lineTo(178, 12);           // les épaules
      x.lineTo(246, 52); x.lineTo(226, 104);           // la manche droite
      x.lineTo(194, 88); x.lineTo(192, 246);           // le flanc droit
      x.lineTo(64, 246); x.lineTo(62, 88);             // le bas, le flanc gauche
      x.lineTo(30, 104); x.lineTo(10, 52);             // la manche gauche
      x.closePath(); x.fill();
      // le col blanc, les bandes des manches, l'ourlet
      x.strokeStyle = "#ece6d8"; x.lineWidth = 7;
      x.beginPath(); x.moveTo(104, 13); x.quadraticCurveTo(128, 26, 152, 13); x.stroke();
      x.lineWidth = 6; x.beginPath(); x.moveTo(236, 80); x.lineTo(218, 96); x.moveTo(20, 80); x.lineTo(38, 96); x.stroke();
      // le numéro, au dos
      x.fillStyle = "#ece6d8"; x.font = "700 104px " + K.habillage.MONO; x.textAlign = "center"; x.textBaseline = "middle";
      x.fillText(String(numeros[k]), 128, 150);
      // l'usure, les plis
      x.fillStyle = "rgba(0,0,0,0.12)"; for (var p = 0; p < 5; p++) x.fillRect(70 + p * 26, 30, 3, 214);
      x.restore();
    }
    return K.tex.texture(c, { clamp: true });
  }

  // ─── LE CADRAN DU TÉLÉPHONE, vu d'en haut : la roue et ses dix trous (le 1 à deux heures,
  // puis à rebours), les chiffres de la plaque au fond des trous, la butée, l'étiquette du
  // milieu (vide : pas de numéro)
  function texCadran(K) {
    var C = 256, R = C / 2, c = K.tex.canvas(C, C), x = c.getContext("2d");
    x.fillStyle = "#c9bb96"; x.fillRect(0, 0, C, C);
    x.fillStyle = "#d6c9a6"; x.beginPath(); x.arc(R, R, R * 0.97, 0, PI * 2); x.fill();
    x.strokeStyle = "rgba(60,48,30,0.5)"; x.lineWidth = 3; x.beginPath(); x.arc(R, R, R * 0.97, 0, PI * 2); x.stroke();
    x.font = "700 " + Math.round(R * 0.15) + "px " + K.habillage.MONO; x.textAlign = "center"; x.textBaseline = "middle";
    for (var i = 0; i < 10; i++) {
      var a = (60 - i * 30) * PI / 180, cx = R + Math.sin(a) * R * 0.7, cy = R - Math.cos(a) * R * 0.7;
      x.fillStyle = "#2b241b"; x.beginPath(); x.arc(cx, cy, R * 0.155, 0, PI * 2); x.fill();
      x.fillStyle = "#efe6cf"; x.beginPath(); x.arc(cx, cy, R * 0.12, 0, PI * 2); x.fill();
      x.fillStyle = "#2b241b"; x.fillText(String((i + 1) % 10), cx, cy + 1);
    }
    x.save(); x.translate(R, R); x.rotate(115 * PI / 180); x.fillStyle = "#8d8f90"; x.fillRect(-4, -R * 0.99, 8, R * 0.2); x.restore();
    x.fillStyle = "#efe8d6"; x.beginPath(); x.arc(R, R, R * 0.36, 0, PI * 2); x.fill();
    x.strokeStyle = "rgba(60,48,30,0.45)"; x.lineWidth = 2; x.beginPath(); x.arc(R, R, R * 0.36, 0, PI * 2); x.stroke();
    x.strokeStyle = "rgba(122,31,46,0.55)";
    for (var l = 0; l < 3; l++) { x.beginPath(); x.moveTo(R - R * 0.2, R - R * 0.08 + l * R * 0.08); x.lineTo(R + R * 0.2, R - R * 0.08 + l * R * 0.08); x.stroke(); }
    return K.tex.texture(c, { clamp: true });
  }

  // ─── LE LINGE : les maillots et les serviettes pendus aux fils, instanciés (un appel),
  // qui se balancent dans l'air chaud ; quand la caméra passe, ils s'écartent (le rêve,
  // à tâtons). Repère d'un vêtement : le haut (le fil) en y = 0, il pend vers −y.
  //  places : [{ x, y, z, ry, c (la case de l'atlas), ph }] → Mesh ; maj(t, camera)
  function linge(K, ctx, places) {
    var THREE = ctx.THREE, n = places.length;
    var geo = new THREE.PlaneGeometry(0.6, 0.62, 6, 8); geo.translate(0, -0.31, 0);
    var aCase = new Float32Array(n * 2), aPh = new Float32Array(n);
    places.forEach(function (p, i) { aCase[i * 2] = (p.c % 4) * 0.25; aCase[i * 2 + 1] = 0.75 - Math.floor(p.c / 4) * 0.25; aPh[i] = p.ph; });
    geo.setAttribute("aCase", new THREE.InstancedBufferAttribute(aCase, 2));
    geo.setAttribute("aPh", new THREE.InstancedBufferAttribute(aPh, 1));
    K.garder(geo);
    var U = { uT: { value: 0 }, uPousse: { value: new THREE.Vector3(0, -99, 0) } };
    var mat = K.garder(new THREE.MeshStandardMaterial({ map: unique(ctx, "maillots", function () { return texMaillots(K); }), alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.92, emissive: new THREE.Color("#ffffff"), emissiveIntensity: 0.14 }));
    mat.emissiveMap = mat.map;   // le tissu à contre-jour garde sa couleur (une étoffe mince laisse passer la lampe)
    mat.onBeforeCompile = function (sh) {
      sh.uniforms.uT = U.uT; sh.uniforms.uPousse = U.uPousse;
      sh.vertexShader = "attribute vec2 aCase; attribute float aPh; uniform float uT; uniform vec3 uPousse;\n" + sh.vertexShader
        .replace("#include <uv_vertex>", "#include <uv_vertex>\n#ifdef USE_MAP\n vMapUv = vMapUv * 0.25 + aCase;\n#endif\n#ifdef USE_EMISSIVEMAP\n vEmissiveMapUv = vEmissiveMapUv * 0.25 + aCase;\n#endif")
        .replace("#include <begin_vertex>", [
          "#include <begin_vertex>",
          "float pend = -position.y;",
          // l'air chaud : un balancement lent, un frisson
          "transformed.z += (sin(uT * 0.9 + aPh * 6.28 + position.y * 1.2) * 0.05 + sin(uT * 2.3 + aPh * 11.0 + position.x * 3.0) * 0.012) * pend;",
          "transformed.x += sin(uT * 0.6 + aPh * 9.0) * 0.02 * pend;",
          // la main qui passe : le linge s'écarte de la caméra (dans le repère du monde, puis
          // dans celui du vêtement : instanceMatrix n'est qu'une rotation et un déplacement)
          "#ifdef USE_INSTANCING",
          "vec3 centreW = (instanceMatrix * vec4(0.0, -0.3, 0.0, 1.0)).xyz;",
          "vec3 dW = centreW - uPousse; float dist = length(dW.xz);",
          "float kP = 1.0 - smoothstep(0.15, 0.95, dist);",
          "vec3 awayW = vec3(dW.x, 0.0, dW.z) / max(dist, 0.05);",
          "vec3 awayL = transpose(mat3(instanceMatrix)) * awayW;",
          "transformed += awayL * kP * 0.55 * pend + vec3(0.0, kP * 0.12 * pend * pend, 0.0);",
          "#endif"
        ].join("\n"));
    };
    var mesh = new THREE.InstancedMesh(geo, mat, n), dd = new THREE.Object3D();
    places.forEach(function (p, i) { dd.position.set(p.x, p.y, p.z); dd.rotation.set(0, p.ry, 0); dd.updateMatrix(); mesh.setMatrixAt(i, dd.matrix); });
    mesh.instanceMatrix.needsUpdate = true; mesh.frustumCulled = false; mesh.receiveShadow = true;
    var cam = new THREE.Vector3();
    mesh.maj = function (t, camera) { U.uT.value = t; camera.getWorldPosition(cam); U.uPousse.value.copy(cam); };
    return mesh;
  }

  // ─── UNE MACHINE À LAVER DE 1987 (industrielle) : la caisse émaillée, le hublot, le
  // tambour qui tourne (un maillot dedans). Le hublot regarde +z.  → Group ; maj(t)
  function machine(K, ctx, graine) {
    var THREE = ctx.THREE, P = K.props, g = new THREE.Group();
    var mE = unique(ctx, "email", function () { return K.garder(new THREE.MeshStandardMaterial({ color: "#d9d4c4", roughness: 0.35, metalness: 0.1 })); });
    var mInox = unique(ctx, "inox", function () { return K.mat.metal({ couleur: "#a7aaac", rugosite: 0.3 }); });
    P.boite(g, 0.9, 1.1, 0.85, mE, 0, 0.55, 0);
    P.boite(g, 0.92, 0.12, 0.87, mInox, 0, 1.16, 0);
    var tore = new THREE.Mesh(K.garder(new THREE.TorusGeometry(0.25, 0.04, 10, 32)), mInox); tore.position.set(0, 0.58, 0.43); g.add(tore);
    // le tambour, derrière le hublot : le fond sombre, un maillot qui tourne contre le verre
    var fondT = new THREE.Mesh(K.garder(new THREE.CircleGeometry(0.245, 32)), unique(ctx, "fondTambour", function () { return K.garder(new THREE.MeshStandardMaterial({ color: "#121314", roughness: 0.6, metalness: 0.2 })); }));
    fondT.position.set(0, 0.58, 0.427); g.add(fondT);
    var tambour = new THREE.Group(); tambour.position.set(0, 0.58, 0.434); g.add(tambour);
    var linge0 = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.11, 12, 8)), unique(ctx, "lingeTambour", function () { return K.garder(new THREE.MeshStandardMaterial({ color: "#5a1520", roughness: 0.9 })); }));
    linge0.scale.set(1.25, 0.75, 0.04); linge0.position.set(0, -0.09, 0); tambour.add(linge0);
    var hublot = new THREE.Mesh(K.garder(new THREE.CircleGeometry(0.25, 32)), unique(ctx, "hublot", function () { return K.garder(new THREE.MeshPhysicalMaterial({ color: "#0e1214", roughness: 0.06, transparent: true, opacity: 0.32, envMapIntensity: 1.0, depthWrite: false })); }));
    hublot.position.set(0, 0.58, 0.44); hublot.renderOrder = 3; g.add(hublot);
    var ph = (K.hash(graine) % 100) / 100;
    g.maj = function (t) { tambour.rotation.z = t * 2.4 + ph * 6; linge0.position.y = -0.08 + Math.sin(t * 2.4 + ph * 6) * 0.03; };
    return g;
  }

  // ─── LA BUANDERIE DE 1987, au sous-sol du club-house : un long sous-sol voûté de brique
  // chaulée, le sol de ciment mouillé, les tuyaux au plafond ; des fils tendus d'un mur à
  // l'autre, rang après rang ; deux machines ; au fond, le panier et le téléphone.
  function decorBuanderie(K, ctx) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: false, fond: "#0b0908", environnement: { zenith: "#14110e", horizon: "#2a231c", lueur: "#4a3420", fenetres: 6,
      lampes: [{ pos: [0, 2.3, -6], couleur: "#ffd49a", intensite: 2.5, taille: 1.5 }] }, reflets: 0.8,
      ambiance: ["#3a3024", "#0c0a08", 0.07], brouillard: ["#2a231c", 0.075] });
    var W = 5.4, D = 15, H = 2.55, z0 = 1.5;   // le sous-sol va de z = 1,5 à z = −13,5
    var mMur = K.mat.brique({ couleur: "#cfc6b4", graine: "buanderie-chaux", suie: 0.5, humide: 0.6 });
    var mSol = K.mat.beton({ couleur: "#5a554c", graine: "buanderie-sol", taches: 1.4 });
    var sol = new THREE.Mesh(P.planUV(W, D, 2), mSol); sol.rotation.x = -PI / 2; sol.position.set(0, 0, z0 - D / 2); sol.receiveShadow = true; s.add(sol);
    sol.material.roughness = 0.45;
    var plaf = new THREE.Mesh(P.planUV(W, D, 2), K.mat.beton({ couleur: "#4a463e", graine: "buanderie-plafond" })); plaf.rotation.x = PI / 2; plaf.position.set(0, H, z0 - D / 2); s.add(plaf);
    [[-W / 2, PI / 2], [W / 2, -PI / 2]].forEach(function (m) { var w = new THREE.Mesh(P.planUV(D, H, 2), mMur); w.position.set(m[0], H / 2, z0 - D / 2); w.rotation.y = m[1]; w.receiveShadow = true; s.add(w); });
    var fond = new THREE.Mesh(P.planUV(W, H, 2), mMur); fond.position.set(0, H / 2, z0 - D); s.add(fond);
    var devant = new THREE.Mesh(P.planUV(W, H, 2), mMur); devant.position.set(0, H / 2, z0); devant.rotation.y = PI; s.add(devant);
    // les tuyaux du plafond
    var tuyaux = new THREE.Group(); s.add(tuyaux);
    var mTuyau = K.mat.metal({ couleur: "#6d6a62", rugosite: 0.55, metal: 0.5 });
    [[-1.9, 2.32, 0.07], [-1.6, 2.38, 0.05], [2.0, 2.3, 0.09]].forEach(function (p) { P.cylindre(tuyaux, p[2], p[2], D, mTuyau, p[0], p[1], z0 - D / 2, { rx: PI / 2, cotes: 10 }); });
    P.fusionner(tuyaux);
    // les fils, rang après rang (de mur à mur), et le linge : des maillots, quelques serviettes
    var rangs = [-1.2, -2.6, -4.0, -5.4, -6.8, -8.2, -9.6], places = [], fils = new THREE.Group(), rl = K.alea("linge-1987");
    var mFil = K.garder(new THREE.MeshStandardMaterial({ color: "#c9c2b0", roughness: 0.8 }));
    rangs.forEach(function (z, ri) {
      P.cylindre(fils, 0.006, 0.006, W, mFil, 0, 1.98, z, { rz: PI / 2, cotes: 5 });
      for (var x = -2.2; x <= 2.21; x += 0.66) {
        var c = rl() < 0.18 ? 13 + Math.floor(rl() * 3) : Math.floor(rl() * 13);
        places.push({ x: x + (rl() - 0.5) * 0.12, y: 1.98, z: z, ry: (rl() - 0.5) * 0.12, c: c, ph: rl() });
      }
    });
    P.fusionner(fils);
    var lin = linge(K, ctx, places); s.add(lin);
    // les pinces : deux par vêtement (un appel)
    var gPince = K.garder(new THREE.BoxGeometry(0.012, 0.05, 0.016)), pinces = new THREE.InstancedMesh(gPince, unique(ctx, "pince", function () { return K.garder(new THREE.MeshStandardMaterial({ color: "#b49a6a", roughness: 0.7 })); }), places.length * 2);
    var dp = new THREE.Object3D();
    places.forEach(function (p, i) { [-0.2, 0.2].forEach(function (dx, j) { dp.position.set(p.x + dx * Math.cos(p.ry), p.y - 0.01, p.z - dx * Math.sin(p.ry)); dp.rotation.set(0, p.ry, 0); dp.updateMatrix(); pinces.setMatrixAt(i * 2 + j, dp.matrix); }); });
    pinces.instanceMatrix.needsUpdate = true; s.add(pinces);
    // les machines, contre le mur de gauche (le hublot vers l'allée)
    var machines = [-2.0, -3.1].map(function (z, i) { var m = machine(K, ctx, "machine" + i); m.position.set(-2.2, 0, z); m.rotation.y = PI / 2; s.add(m); return m; });
    // l'horloge au-dessus des machines : arrêtée sur 23 h 58
    var hc = K.tex.canvas(256, 256), hx = hc.getContext("2d");
    hx.fillStyle = "#ebe4d2"; hx.beginPath(); hx.arc(128, 128, 124, 0, 7); hx.fill();
    hx.strokeStyle = "#1a1612";
    for (var i = 0; i < 12; i++) { var a = i / 12 * PI * 2; hx.lineWidth = 8; hx.beginPath(); hx.moveTo(128 + Math.sin(a) * 96, 128 - Math.cos(a) * 96); hx.lineTo(128 + Math.sin(a) * 116, 128 - Math.cos(a) * 116); hx.stroke(); }
    // les aiguilles peintes : 23 h 58
    hx.lineCap = "round"; hx.lineWidth = 10; hx.beginPath(); hx.moveTo(128, 128); hx.lineTo(128 + Math.sin(-0.017) * 62, 128 - Math.cos(-0.017) * 62); hx.stroke();
    hx.lineWidth = 6; hx.beginPath(); hx.moveTo(128, 128); hx.lineTo(128 + Math.sin(58 / 60 * PI * 2) * 92, 128 - Math.cos(58 / 60 * PI * 2) * 92); hx.stroke();
    var horl = new THREE.Mesh(K.garder(new THREE.CircleGeometry(0.17, 32)), K.garder(new THREE.MeshStandardMaterial({ map: K.tex.texture(hc, { clamp: true }), roughness: 0.5 })));
    horl.position.set(-W / 2 + 0.035, 1.85, -2.55); horl.rotation.y = PI / 2; s.add(horl);
    P.cylindre(s, 0.185, 0.185, 0.03, K.mat.metal({ couleur: "#2a2826", rugosite: 0.4 }), -W / 2 + 0.01, 1.85, -2.55, { rz: PI / 2, cotes: 32 });
    // un calendrier de 1987 au clou, gondolé par la vapeur
    var tc = K.tex.texte({ lignes: ["RACING", "1987"], fond: "#e3dac6", encre: "#7a1f2e", largeur: 256, hauteur: 320, graine: "calendrier-1987" });
    var cal = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.28, 0.36)), K.garder(new THREE.MeshStandardMaterial({ map: tc.map, roughness: 0.8 })));
    cal.position.set(-W / 2 + 0.02, 1.55, -3.9); cal.rotation.y = PI / 2; s.add(cal);
    // le panier au fond, les serviettes, le téléphone beige à cadran ; son fil jusqu'au mur
    var panier = new THREE.Group(); panier.position.set(0.35, 0, -11.2); s.add(panier);
    var osier = (function () {
      var c = K.tex.canvas(256, 128), x = c.getContext("2d"); x.fillStyle = "#8a6a3e"; x.fillRect(0, 0, 256, 128);
      x.strokeStyle = "#5a4224"; x.lineWidth = 3; for (var yy = 0; yy < 128; yy += 8) { x.beginPath(); for (var xx = 0; xx <= 256; xx += 8) x.lineTo(xx, yy + ((xx / 8) % 2 ? 3 : -3)); x.stroke(); }
      return K.tex.texture(c, { repete: [3, 1] });
    })();
    P.cylindre(panier, 0.34, 0.28, 0.38, K.garder(new THREE.MeshStandardMaterial({ map: osier, roughness: 0.9, side: THREE.DoubleSide })), 0, 0.19, 0, { ouvert: true, cotes: 24 });
    // le linge du panier : des serviettes froissées (la trame en relief), blanches et grises
    var trame = K.tex.tissu({ fils: 64, repete: [3, 3] }).relief;
    var mServ = K.garder(new THREE.MeshStandardMaterial({ color: "#bfb6a4", roughness: 1, bumpMap: trame, bumpScale: 1.4 }));
    var mServG = K.garder(new THREE.MeshStandardMaterial({ color: "#8f897e", roughness: 1, bumpMap: trame, bumpScale: 1.4 }));
    var froisse = K.garder(new THREE.SphereGeometry(0.1, 18, 12));
    (function () {
      var p = froisse.attributes.position, v = new THREE.Vector3();
      for (var i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i);
        v.multiplyScalar(1 + 0.16 * Math.sin(v.x * 61 + v.y * 37) * Math.cos(v.z * 53 + v.x * 23) + 0.08 * Math.sin(v.y * 97 + v.z * 71));
        p.setXYZ(i, v.x, v.y, v.z);
      }
      p.needsUpdate = true; froisse.computeVertexNormals();
    })();
    var rs = K.alea("serviettes"), serv = new THREE.Group(); panier.add(serv);
    for (var sv = 0; sv < 12; sv++) {
      var b = new THREE.Mesh(froisse, sv % 4 === 1 ? mServG : mServ);
      b.position.set((rs() - 0.5) * 0.4, 0.3 + rs() * 0.06, (rs() - 0.5) * 0.4); b.scale.set(1.1 + rs() * 0.3, 0.36 + rs() * 0.08, 0.85 + rs() * 0.2);
      b.rotation.set((rs() - 0.5) * 0.4, rs() * 3, (rs() - 0.5) * 0.4); serv.add(b);
    }
    P.fusionner(serv);
    var tel = P.telephone({ epoque: "cadran", couleur: "#c2b28f" }); tel.position.set(0.02, 0.4, 0.02); tel.rotation.set(-0.08, 0.35, 0.05); panier.add(tel);
    // le cadran : le sien, posé à plat sur la coque (vu d'en haut, celui de la trousse
    // s'enfonce à moitié dans la coque) ; la coque est une demi-sphère de 0,121 × 0,0825 × 0,11
    tel.traverse(function (o) { if (o.isMesh && o.geometry && (o.geometry.type === "RingGeometry" || (o.geometry.type === "CircleGeometry" && o.geometry.parameters.radius < 0.01))) o.visible = false; });
    var beta = 0.5, th = Math.atan(0.0825 / 0.11 * Math.tan(beta)), cadran = new THREE.Group();
    cadran.position.set(0, 0.0825 * Math.cos(beta) + Math.cos(th) * 0.006, 0.11 * Math.sin(beta) + Math.sin(th) * 0.006); cadran.rotation.x = th; tel.add(cadran);
    P.cylindre(cadran, 0.05, 0.05, 0.03, K.garder(new THREE.MeshStandardMaterial({ color: "#b8a882", roughness: 0.4 })), 0, -0.009, 0, { cotes: 28 });
    var disque = new THREE.Mesh(K.garder(new THREE.CircleGeometry(0.05, 32)), K.garder(new THREE.MeshStandardMaterial({ map: texCadran(K), roughness: 0.35 })));
    disque.rotation.x = -PI / 2; disque.position.y = 0.0062; cadran.add(disque);
    var fil = new THREE.Mesh(K.garder(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.2, 0.4, -11.3), new THREE.Vector3(0.5, 0.05, -11.6), new THREE.Vector3(1.4, 0.01, -12.2), new THREE.Vector3(2.4, 0.01, -12.9), new THREE.Vector3(W / 2 - 0.02, 0.35, -13.0)]), 40, 0.006, 5, false)),
      K.garder(new THREE.MeshStandardMaterial({ color: "#2a2622", roughness: 0.6 })));
    s.add(fil);
    P.boite(s, 0.03, 0.09, 0.07, K.garder(new THREE.MeshStandardMaterial({ color: "#c2b28f", roughness: 0.5 })), W / 2 - 0.02, 0.35, -13.0);
    // les ampoules nues : trois dans l'allée ; celle du milieu se balance (et porte l'ombre)
    var ampoules = [[0.1, -1.9, 26, false, 0.05], [-0.2, -6.1, 30, true, 0.16], [0.25, -10.2, 14, false, 0.07]].map(function (a, i) {
      var am = P.ampoule({ fil: 0.32, intensite: a[2], ombre: a[3], loin: 14, halo: 0.38, balancement: a[4], graine: "ampoule-buanderie" + i });
      am.position.set(a[0], H, a[1]); s.add(am); return am;
    });
    // la vapeur : des machines, du sol mouillé, autour du panier ; chaude sous les ampoules
    var lumV = [{ pos: [0.1, 2.1, -1.9], couleur: "#ffd49a", intensite: 0.9, rayon: 4 }, { pos: [-0.2, 2.1, -6.1], couleur: "#ffd49a", intensite: 1.0, rayon: 4 }, { pos: [0.25, 2.1, -10.2], couleur: "#ffd49a", intensite: 0.6, rayon: 4 }];
    // (au-dessus des machines, pas devant les hublots ; au ras du sol de l'allée ; derrière
    // le panier, pas devant : le téléphone doit se lire à travers)
    var vapeurs = [[-2.05, 1.3, -2.5, 0.8], [0.0, 0.12, -6.0, 3.2], [0.4, 0.15, -12.7, 1.2]].map(function (v, i) {
      var f = K.particules.fumee({ n: 40, source: [v[0], v[1], v[2]], vent: [0.06, -0.12], montee: 0.25, vie: 9, taille: 1.1, etalement: v[3], couleur: "#5e554a", lueur: "#b89a74", opacite: 0.08, graine: "vapeur-buanderie" + i, lumieres: lumV });
      s.add(f); return f;
    });
    var poussiere = K.particules.poussiere({ n: 900, zone: { min: [-2.4, 0.2, -11.5], max: [2.4, 2.4, 1.0] }, taille: 0.01, couleur: "#ffe2bc", opacite: 0.5, lumieres: lumV, graine: "buanderie-air" });
    s.add(poussiere);
    s.updateMatrixWorld(true);
    var combine = tel.combine, comb0 = combine ? combine.position.y : 0;
    return {
      scene: s,
      look: { bloom: 0.4, rayon: 0.55, seuil: 1.05, exposition: 1.0, contraste: 1.14, saturation: 0.82 },
      maj: function (t, c) {
        ampoules.forEach(function (a) { a.maj(t); });
        machines.forEach(function (m) { m.maj(t); });
        lin.maj(t, c.camera);
        vapeurs.forEach(function (f) { f.maj(t); }); poussiere.maj(t);
        // le combiné tremble sur sa fourche quand la cloche frappe
        var k = sursaut(t);
        if (combine) { combine.position.y = comb0 + k * 0.006; combine.rotation.z = Math.sin(t * 90) * k * 0.05; }
      }
    };
  }

  FC.film({
    id: "la_buanderie",
    livre: "vendre_trente",
    titre: "La buanderie",
    duree: 31.6,
    musique: "livre_h6",
    secours: "suspense",
    couleur: VIOLET,
    affiche: 12.6,
    habillage: { vignette: 0.7, grain: 0.1, ratioPaysage: 2.35, ratioPortrait: 0 },
    sortie: { noir: 0.6 },
    sons: SONNERIES.map(function (t) { return [t, "sonnerie"]; }),
    textes: [
      { sorte: "lieu", de: 1.0, a: 4.8, texte: "La buanderie du club-house", sous: "1987 · en rêve" },
      { sorte: "titre", de: 28.2, a: 31.2, texte: "Aubérive · 1987", sous: "23 h 58", entree: 0.2, sortie: 0.5 }
    ],
    montages: { court: [[0.4, 4.8], [5.4, 10.2], [10.9, 14.6], [15.4, 21.2], [21.9, 27.3], [27.6, 31.6]] },
    preparer: function (K, ctx) {
      return K.etapes(ctx, [
        function () { ctx.decors.buanderie = decorBuanderie(K, ctx); }
      ]);
    },
    plans: [
      // 1 · l'ampoule nue dans la vapeur ; la première sonnerie
      { de: 0, a: 5.0, decor: "buanderie", entree: "noir", transition: 1.4, fixe: 2.8,
        camera: { pos: K_cles([[0, [0.55, 1.55, -4.3]], [5.0, [0.45, 1.6, -4.6]]], "lin"), cible: [-0.2, 2.15, -6.1], fov: 40, epaule: 0.06 } },
      // 2 · l'allée : les maillots de l'année, rang après rang ; lente avancée
      { de: 5.0, a: 10.5, decor: "buanderie", entree: "coupe", fixe: 3.0,
        camera: { pos: K_cles([[0, [0.15, 1.45, 0.9]], [5.5, [0.05, 1.42, -0.2]]], "lin"), cible: K_cles([[0, [0.0, 1.55, -8]], [5.5, [0.1, 1.5, -8]]], "lin"), fov: 46, epaule: 0.07 } },
      // 3 · les machines : le maillot qui tourne derrière le hublot ; l'horloge sur 23 h 58
      { de: 10.5, a: 15.0, decor: "buanderie", entree: "coupe", fixe: 4.2,
        camera: { pos: K_cles([[0, [-0.55, 0.95, -1.45]], [4.5, [-0.75, 1.15, -1.75]]], "douce"), cible: K_cles([[0, [-1.76, 0.6, -2.0]], [1.6, [-1.76, 0.62, -2.05]], [3.6, [-2.66, 1.8, -2.55]], [4.5, [-2.66, 1.81, -2.55]]], "douce"), fov: 40, epaule: 0.06 } },
      // 4 · à tâtons, à travers le linge : les maillots s'écartent, rang après rang
      { de: 15.0, a: 21.5, decor: "buanderie", entree: "coupe", fixe: 3.2,
        camera: { pos: K_cles([[0, [0.2, 1.5, -0.6]], [6.5, [0.35, 1.45, -8.9]]], "lin"), cible: K_cles([[0, [0.2, 1.45, -6]], [4.6, [0.3, 1.3, -11]], [6.5, [0.36, 0.55, -11.2]]], "douce"), fov: 52, epaule: 0.12, frequence: 1.6 } },
      // 5 · trouvé : le panier, le téléphone beige qui sonne
      { de: 21.5, a: 27.5, decor: "buanderie", entree: "coupe", fixe: 4.2,
        camera: { pos: K_cles([[0, [0.55, 1.35, -9.3]], [6.0, [0.45, 1.05, -10.3]]], "douce"), cible: [0.36, 0.42, -11.2], fov: 42, epaule: 0.06 } },
      // 6 · de près : le combiné qui tremble ; noir sur la sonnerie
      { de: 27.5, a: 31.6, decor: "buanderie", entree: "coupe", fixe: 2.0,
        camera: { pos: K_cles([[0, [0.66, 0.8, -10.55]], [4.1, [0.58, 0.72, -10.7]]], "lin"), cible: [0.37, 0.47, -11.18], fov: 36, epaule: 0.05 }, look: { exposition: 0.85 } }
    ]
  });

  function K_() { return FC.kit; }
  function K_cles(p, a) { var f = null; return function (t) { if (!f) f = K_().cles(p, a); return f(t); }; }
})(typeof window !== "undefined" ? window : this);
