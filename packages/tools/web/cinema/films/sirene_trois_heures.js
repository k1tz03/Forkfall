/* ═══════════════════════════════════════════════════════════════════════════
   « Trois heures » — livre 3, « La Sirène » (1990-1993, le joueur, la pépite ;
   la couleur du livre : #FF9A3C). Docs : docs/design/cinematiques.md.

   Une nuit d'hiver, longtemps après la fermeture, la sirène de l'usine morte se
   remet à hurler. Il est trois heures. Le film passe AVANT la carte « Trois heures »
   (jp.h3.s1_trois_heures et ses deux variantes, la saison 1, créneau 12 ;
   content/ville/films_h3.yaml) : la cité qui se réveille fenêtre par fenêtre, la
   sirène dans la pluie en haut de sa tour, la grande halle au toit troué, un terrain
   tracé à la craie sur le béton, quelqu'un couché dans le rond central — puis des
   yeux qui s'ouvrent, au ras du béton. La carte dit le reste. Le film ne devance
   rien : on ne voit pas qui tire la poignée (rien ne bouge dans la tour), ni qui a
   tracé le terrain ; ni la boîte, ni le masque (la main est fermée, la poche ne se
   voit pas) : il vaut pour les trois variantes de la carte.

   LES PLANS (34 s ; la musique : livre_h3, « Seize heures » ; au tournage, la section
   `pont` — « le creux, la grande halle à trois heures : la reese, la sirène au fond,
   des gouttes de métal ; quatre mesures pour remonter »)
     1   0,0– 6,0  la cité de la Tréfilerie, la nuit, sous une pluie fine : la rue
                   mouillée, les maisons de brique, les volets verts, le sodium ; au bout
                   de la rue, au-dessus du mur de l'usine, la tour de la grande halle. La
                   sirène se lève, son voyant s'allume ; au fond, une fenêtre, puis une
                   autre. Carton : « La cité de la Tréfilerie / Trois heures du matin ».
     2   6,0–11,6  les façades, de l'autre trottoir : les fenêtres s'allument l'une après
                   l'autre ; un volet vert s'ouvre ; sur le rideau, l'ombre de quelqu'un.
                   Une voix : « Rendors-toi. L'usine est fermée. »
     3  11,6–16,6  la sirène, en haut de sa tour, dans la pluie : le rotor derrière les
                   fentes, le voyant ; en bas, la cité allumée. Personne.
     4  16,6–22,4  la grande halle, dedans : le toit troué, la lumière orange du quai qui
                   tombe par un trou, la pluie dans le faisceau, les flaques, un bidon où
                   rougissent des braises ; au ras du béton, des lignes de craie.
     5  22,4–28,4  d'en haut : le terrain tracé à la craie, le rond central, et dedans,
                   couché en chien de fusil, la veste sous la tête, quelqu'un.
     6  28,4–34,0  au ras du béton, de travers : des yeux qui s'ouvrent (deux battements
                   de noir), le béton éclairé, la craie ; la tête se relève vers le trou du
                   toit, la lampe du quai derrière, la pluie qui tombe dans la lumière, droit
                   sur toi. Titre : « Trois heures / La Sirène ».
   La coupe de 30 s (l'aperçu de l'App Store) : les six plans, resserrés.
   La lumière : la nuit bleue, le sodium des réverbères, les fenêtres jaunes ou d'un
   néon de cuisine, le voyant orange de la sirène (l'accent du livre) ; dedans, un seul
   faisceau orange, le bleu froid des autres trous du toit, les braises. Les visages :
   jamais (une ombre sur un rideau, un corps vu d'en haut, recroquevillé, de dos ; le
   dernier plan est un regard). La réplique est celle d'une voix à une fenêtre, à un
   enfant qu'on ne voit pas : elle ne nomme personne.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var FC = global.FusibleCinema;
  var PI = Math.PI;
  var ORANGE = "#FF9A3C";
  var SODIUM = "#FF9A3D";

  // ─── LES PIÈCES ──────────────────────────────────────────────────────────
  // la sirène de la tour : le mât, le moteur, le tambour fendu (le rotor tourne derrière
  // les fentes), le chapeau, la boîte de commande et son voyant ; → Group, .maj(vitesse, t)
  function sirene(K, THREE, P) {
    var g = new THREE.Group();
    var mR = K.mat.rouille({ peinture: "#56605b", part: 0.22, graine: "sirene" });
    var mAc = K.mat.metal({ couleur: "#3c4042", rugosite: 0.55 });
    P.cylindre(g, 0.07, 0.09, 2.2, mAc, 0, 1.1, 0, { cotes: 10 });
    P.boite(g, 0.5, 0.06, 0.5, mAc, 0, 0.03, 0);
    P.cylindre(g, 0.26, 0.3, 0.55, mR, 0, 2.45, 0, { cotes: 20 });
    var ca = K.tex.canvas(256, 64), ax = ca.getContext("2d");
    ax.fillStyle = "#fff"; ax.fillRect(0, 0, 256, 64);
    for (var a = 0; a < 10; a++) { ax.fillStyle = "#000"; ax.fillRect(a * 25.6 + 6, 10, 13, 44); }
    var mTamb = K.garder(new THREE.MeshStandardMaterial({ color: "#5c6461", roughness: 0.45, metalness: 0.6, alphaMap: K.tex.texture(ca, { donnee: true }), alphaTest: 0.5, side: THREE.DoubleSide }));
    var tamb = new THREE.Mesh(K.garder(new THREE.CylinderGeometry(0.46, 0.46, 0.4, 32, 1, true)), mTamb); tamb.position.y = 2.92; g.add(tamb);
    var cr = K.tex.canvas(256, 32), rx = cr.getContext("2d");
    rx.fillStyle = "#151717"; rx.fillRect(0, 0, 256, 32);
    for (var b = 0; b < 8; b++) { rx.fillStyle = "#b7bbb4"; rx.fillRect(b * 32 + 4, 0, 10, 32); }
    var mRot = K.garder(new THREE.MeshStandardMaterial({ map: K.tex.texture(cr, {}), roughness: 0.3, metalness: 0.75 }));
    var rotor = new THREE.Mesh(K.garder(new THREE.CylinderGeometry(0.4, 0.4, 0.36, 24, 1, false)), mRot); rotor.position.y = 2.92; g.add(rotor);
    P.cylindre(g, 0.48, 0.48, 0.05, mR, 0, 2.7, 0, { cotes: 32 });
    P.cylindre(g, 0.48, 0.48, 0.05, mR, 0, 3.14, 0, { cotes: 32 });
    var chapeau = new THREE.Mesh(K.garder(new THREE.ConeGeometry(0.64, 0.36, 32, 1)), mR); chapeau.position.y = 3.35; chapeau.castShadow = true; g.add(chapeau);
    P.cylindre(g, 0.64, 0.64, 0.04, mR, 0, 3.17, 0, { cotes: 32 });
    P.cylindre(g, 0.04, 0.04, 0.2, mAc, 0, 3.6, 0, { cotes: 8 });
    P.boite(g, 0.16, 0.42, 0.32, mR, 0.2, 1.5, -0.12);
    var voy = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.04, 10, 8)), K.mat.lumiere({ couleur: ORANGE, intensite: 6, toneMapped: false }));
    voy.position.set(0.3, 1.66, -0.22); g.add(voy);
    var hv = K.look.halo({ couleur: ORANGE, taille: 0.6, intensite: 1.2 }); hv.position.copy(voy.position); g.add(hv);
    // la lueur du voyant sur le métal (le plan 3, la nuit)
    var lv = K.look.ponctuelle({ couleur: ORANGE, intensite: 0, portee: 7 }); lv.position.set(0.55, 1.9, -0.6); g.add(lv);
    g.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    g.maj = function (vit, t, voyant) {
      rotor.rotation.y = -t * 40 * vit;
      var k = voyant;
      voy.material.color.set(ORANGE).multiplyScalar(7 * k + 0.05); hv.intensite(1.3 * k); lv.intensity = 9 * k * (0.75 + 0.25 * Math.sin(t * 9));
    };
    return g;
  }

  // la craie : un trait tremblé, repris trois fois, avec ses manques et sa poussière ;
  // (x0, y0)-(x1, y1) en pixels, `ep` l'épaisseur en pixels
  function trait(x, r, x0, y0, x1, y1, ep) {
    var L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(2, Math.ceil(L / (ep * 2.5)));
    for (var passe = 0; passe < 3; passe++) {
      x.lineWidth = ep * (0.45 + r() * 0.35); x.strokeStyle = "rgba(240,238,228," + (0.28 + r() * 0.3).toFixed(2) + ")";
      x.beginPath();
      var leve = false;
      for (var i = 0; i <= n; i++) {
        var u = i / n, px = x0 + (x1 - x0) * u + (r() - 0.5) * ep * 0.5, py = y0 + (y1 - y0) * u + (r() - 0.5) * ep * 0.5;
        if (r() < 0.04) { leve = true; continue; }   // la craie saute sur une aspérité du béton
        if (i === 0 || leve) { x.moveTo(px, py); leve = false; } else x.lineTo(px, py);
      }
      x.stroke();
    }
    // la poussière de craie, de part et d'autre
    for (var k = 0; k < n * 2; k++) {
      var v = r(), d = (r() - 0.5) * ep * 2.6;
      var nx = -(y1 - y0) / (L || 1), ny = (x1 - x0) / (L || 1);
      x.fillStyle = "rgba(235,232,220," + (0.08 + r() * 0.16).toFixed(2) + ")";
      x.fillRect(x0 + (x1 - x0) * v + nx * d, y0 + (y1 - y0) * v + ny * d, 1 + r() * 1.5, 1 + r() * 1.5);
    }
  }
  function arc(x, r, cx, cy, R, a0, a1, ep) {
    var n = Math.max(6, Math.ceil(Math.abs(a1 - a0) * R / (ep * 3)));
    for (var i = 0; i < n; i++) {
      var u0 = a0 + (a1 - a0) * i / n, u1 = a0 + (a1 - a0) * (i + 1) / n;
      trait(x, r, cx + Math.cos(u0) * R, cy + Math.sin(u0) * R, cx + Math.cos(u1) * R, cy + Math.sin(u1) * R, ep);
    }
  }
  // le terrain : 50 × 26 m, centré ; `zone` = [x0, z0, x1, z1] en mètres, ce que couvre la
  // toile ; `trou` = [x0, z0, x1, z1] : ce qu'une autre toile, plus fine, dessine à sa place
  function terrainCraie(K, o) {
    var W = o.w, H = o.h, c = K.tex.canvas(W, H), x = c.getContext("2d"), r = K.alea(o.graine);
    var z = o.zone, sx = W / (z[2] - z[0]), sz = H / (z[3] - z[1]);
    function px(m) { return (m - z[0]) * sx; }
    function pz(m) { return (m - z[1]) * sz; }
    var ep = Math.max(2, 0.1 * sx);
    x.lineCap = "round";
    function dans(mx, mz) { return o.trou && mx > o.trou[0] && mx < o.trou[2] && mz > o.trou[1] && mz < o.trou[3]; }
    // un segment en mètres, coupé là où la toile fine prend le relais
    function seg(ax, az, bx, bz) {
      var n = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / 0.5));
      for (var i = 0; i < n; i++) {
        var u0 = i / n, u1 = (i + 1) / n, mx = ax + (bx - ax) * (u0 + u1) / 2, mz = az + (bz - az) * (u0 + u1) / 2;
        if (dans(mx, mz) || mx < z[0] - 0.3 || mx > z[2] + 0.3 || mz < z[1] - 0.3 || mz > z[3] + 0.3) continue;
        trait(x, r, px(ax + (bx - ax) * u0), pz(az + (bz - az) * u0), px(ax + (bx - ax) * u1), pz(az + (bz - az) * u1), ep);
      }
    }
    function cercle(cx, cz, R, a0, a1) {
      var n = Math.max(8, Math.ceil(Math.abs(a1 - a0) * R / 0.4));
      for (var i = 0; i < n; i++) {
        var u0 = a0 + (a1 - a0) * i / n, u1 = a0 + (a1 - a0) * (i + 1) / n;
        seg(cx + Math.cos(u0) * R, cz + Math.sin(u0) * R, cx + Math.cos(u1) * R, cz + Math.sin(u1) * R);
      }
    }
    function point(cx, cz, R) {
      if (dans(cx, cz)) return;
      x.fillStyle = "rgba(240,238,228,0.75)"; x.beginPath(); x.arc(px(cx), pz(cz), R * sx, 0, 7); x.fill();
    }
    var L = 25, Wd = 13;
    seg(-L, -Wd, L, -Wd); seg(L, -Wd, L, Wd); seg(L, Wd, -L, Wd); seg(-L, Wd, -L, -Wd);
    seg(0, -Wd, 0, Wd);
    cercle(0, 0, 4, 0, PI * 2); point(0, 0, 0.12);
    [-1, 1].forEach(function (s) {
      seg(s * L, -7, s * (L - 8), -7); seg(s * (L - 8), -7, s * (L - 8), 7); seg(s * (L - 8), 7, s * L, 7);
      seg(s * L, -3.5, s * (L - 3), -3.5); seg(s * (L - 3), -3.5, s * (L - 3), 3.5); seg(s * (L - 3), 3.5, s * L, 3.5);
      point(s * (L - 6), 0, 0.1);
      cercle(s * (L - 6), 0, 4, s > 0 ? PI - PI / 3 : -PI / 3, s > 0 ? PI + PI / 3 : PI / 3);
      cercle(s * L, -Wd, 0.6, s > 0 ? PI / 2 : 0, s > 0 ? PI : PI / 2);
      cercle(s * L, Wd, 0.6, s > 0 ? PI : -PI / 2, s > 0 ? PI * 1.5 : 0);
    });
    return K.tex.texture(c, { clamp: true });
  }
  // une tache de lumière au sol (le bleu d'un trou du toit) : un rectangle aux bords flous
  function tache(K) {
    var W = 128, c = K.tex.canvas(W, W), x = c.getContext("2d"), im = x.createImageData(W, W), d = im.data;
    for (var j = 0; j < W; j++) for (var i = 0; i < W; i++) {
      var u = Math.abs(i / (W - 1) - 0.5) * 2, v = Math.abs(j / (W - 1) - 0.5) * 2;
      var a = (1 - K.lisse(0.55, 1, u)) * (1 - K.lisse(0.55, 1, v)) * (0.8 + 0.2 * K.h01(i * 7 + j * 131, 5));
      var p = (j * W + i) * 4; d[p] = d[p + 1] = d[p + 2] = 255 * a; d[p + 3] = 255;
    }
    x.putImageData(im, 0, 0);
    return K.tex.texture(c, { clamp: true, donnee: true });
  }
  // une flaque : une forme irrégulière (alpha)
  function flaque(K, graine) {
    var W = 256, c = K.tex.canvas(W, W), x = c.getContext("2d"), r = K.alea(graine);
    x.fillStyle = "#000"; x.fillRect(0, 0, W, W);
    x.fillStyle = "#fff";
    for (var i = 0; i < 9; i++) { x.beginPath(); x.ellipse(W * (0.3 + r() * 0.4), W * (0.3 + r() * 0.4), W * (0.08 + r() * 0.16), W * (0.05 + r() * 0.12), r() * PI, 0, 7); x.fill(); }
    x.filter = "blur(3px)"; x.drawImage(c, 0, 0); x.filter = "none";
    return K.tex.texture(c, { clamp: true, donnee: true });
  }
  // les braises du bidon : des points rouges sur la cendre
  function braises(K) {
    var W = 128, c = K.tex.canvas(W, W), x = c.getContext("2d"), r = K.alea("braises");
    x.fillStyle = "#050302"; x.fillRect(0, 0, W, W);
    for (var i = 0; i < 160; i++) {
      var a = r() * PI * 2, d = Math.sqrt(r()) * W * 0.45, k = r();
      x.fillStyle = k > 0.7 ? "rgba(255,170,80,0.9)" : k > 0.35 ? "rgba(220,70,20,0.8)" : "rgba(90,30,12,0.8)";
      x.beginPath(); x.arc(W / 2 + Math.cos(a) * d, W / 2 + Math.sin(a) * d, 1.5 + r() * 4, 0, 7); x.fill();
    }
    return K.tex.texture(c, { clamp: true });
  }
  // le rideau d'une fenêtre allumée (les plis), et l'ombre de quelqu'un derrière
  function rideau(K) {
    var W = 128, H = 160, c = K.tex.canvas(W, H), x = c.getContext("2d");
    for (var i = 0; i < W; i++) { var k = 0.72 + 0.28 * Math.sin(i / W * PI * 9) * Math.sin(i / W * PI * 2.2 + 0.4); x.fillStyle = K.css([k, k * 0.86, k * 0.62]); x.fillRect(i, 0, 1, H); }
    var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "rgba(0,0,0,0.25)"); g.addColorStop(0.5, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,0.3)");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    return K.tex.texture(c, { clamp: true });
  }
  function ombreChinoise(K) {
    var W = 128, H = 160, c = K.tex.canvas(W, H), x = c.getContext("2d");
    x.fillStyle = "#000"; x.fillRect(0, 0, W, H);
    x.filter = "blur(4px)"; x.fillStyle = "#fff";
    x.beginPath(); x.ellipse(70, 62, 17, 21, 0.1, 0, 7); x.fill();                                         // la tête
    x.beginPath(); x.moveTo(30, H); x.quadraticCurveTo(34, 100, 62, 92); x.lineTo(80, 92); x.quadraticCurveTo(112, 98, 116, H); x.fill();   // les épaules
    x.fillRect(62, 76, 16, 20);                                                                              // le cou
    x.filter = "none";
    return K.tex.texture(c, { clamp: true, donnee: true });
  }

  // ─── LA CITÉ DE LA TRÉFILERIE, LA NUIT ; AU BOUT, LA TOUR DE LA GRANDE HALLE ───
  function cite(K, ctx) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: { zenith: "#05070d", horizon: "#25222a", lueur: "#5a3624", lueurDir: [0.05, -1], force: 1.2 },
      brouillard: ["#1a181e", 0.0072], environnement: { fenetres: 30, teintes: ["#FFB060", "#FFD49A", "#CFE0FF"], lampes: [{ pos: [0, 7, -12], couleur: SODIUM, intensite: 4, taille: 4 }, { pos: [0, 7, 14], couleur: SODIUM, intensite: 4, taille: 4 }] },
      reflets: 1.0, ambiance: ["#3a4766", "#120e0b", 0.7] });
    // la lune derrière les nuages : un contre-jour froid, très bas (la tour, les toits)
    var lune = new THREE.DirectionalLight("#9fb2d6", 1.1); lune.position.set(-30, 60, -160); lune.target.position.set(0, 0, -60); s.add(lune); s.add(lune.target);
    // les nuages bas, éclairés par en dessous par la ville
    var mN = [], rn = K.alea("nuages-cite");
    for (var ni = 0; ni < 9; ni++) {
      var mat = K.garder(new THREE.SpriteMaterial({ map: K.tex.fumee({ graine: "nuage" + (ni % 3) }), color: new THREE.Color("#5a4038").multiplyScalar(0.45 + rn() * 0.35), transparent: true, depthWrite: false, fog: false, opacity: 0.75 }));
      var sp = new THREE.Sprite(mat); sp.scale.set(140 + rn() * 120, 50 + rn() * 40, 1);
      sp.position.set(-170 + ni * 42 + rn() * 20, 55 + rn() * 35, -230 - rn() * 80); sp.renderOrder = -5; s.add(sp); mN.push({ s: sp, x: sp.position.x });
    }
    // ── le sol : la rue, ses trottoirs ; autour, la terre noire
    var rue = P.rue({ longueur: 84, largeur: 7, trottoir: 2, flaques: 0.62, graine: "cite" }); rue.position.set(0, 0, -26); s.add(rue);
    var mSolLoin = K.garder(new THREE.MeshStandardMaterial({ color: "#151517", roughness: 0.55 }));
    var solLoin = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(700, 700)), mSolLoin); solLoin.rotation.x = -PI / 2; solLoin.position.set(0, -0.02, -120); s.add(solLoin);
    // ── les deux rangées de maisons : brique, un étage, les volets verts
    var mBr = K.mat.brique({ couleur: "#6c3528", graine: "cite-trefilerie", suie: 0.9, humide: 0.9 });
    var mPierre = K.mat.beton({ couleur: "#8b857a", graine: "appuis", banches: 0, taches: 0.6 });
    var ct = K.tex.canvas(256, 256), tx = ct.getContext("2d"), rt = K.alea("tuiles");
    tx.fillStyle = "#2a1c18"; tx.fillRect(0, 0, 256, 256);
    for (var ty = 0; ty < 8; ty++) for (var tx2 = 0; tx2 < 8; tx2++) {
      var ox = (ty % 2) * 16, tk = 0.75 + rt() * 0.4;
      tx.fillStyle = K.css([0.29 * tk, 0.17 * tk, 0.14 * tk]); tx.fillRect(tx2 * 32 + ox + 1, ty * 32 + 1, 30, 28);
      tx.fillStyle = "rgba(0,0,0,0.45)"; tx.fillRect(tx2 * 32 + ox, ty * 32 + 26, 32, 6);
    }
    var tTuile = K.tex.texture(ct, {}); tTuile.repeat.set(20, 2.2);
    var mToit = K.garder(new THREE.MeshStandardMaterial({ map: tTuile, roughness: 0.45, metalness: 0.05 }));
    var mVolet = K.garder(new THREE.MeshStandardMaterial({ color: "#2b5a43", roughness: 0.55 }));
    var mPorte = K.garder(new THREE.MeshStandardMaterial({ color: "#2a1d15", roughness: 0.6 }));
    var NM = 15, LM = 5.4, Z0 = 16, PROF = 8, HE = 5.8, FAITE = 8.2;
    var fenetres = [], volets = [], appuis = [], portes = [], chem = [], murets = [];
    var rf = K.alea("fenetres-cite");
    [-1, 1].forEach(function (cote) {
      var xf = cote * 5.5, xc = cote * (5.5 + PROF / 2);
      var corps = new THREE.Mesh(P.boiteUV(PROF, HE, NM * LM, 2.0), mBr); corps.position.set(xc, HE / 2, Z0 - NM * LM / 2); corps.castShadow = true; corps.receiveShadow = true; s.add(corps);
      // le toit : un prisme le long de la rue
      var pr = new THREE.Shape(); pr.moveTo(-PROF / 2 - 0.35, 0); pr.lineTo(PROF / 2 + 0.35, 0); pr.lineTo(0, FAITE - HE); pr.lineTo(-PROF / 2 - 0.35, 0);
      var gT = K.garder(new THREE.ExtrudeGeometry(pr, { depth: NM * LM, bevelEnabled: false }));
      var toit = new THREE.Mesh(gT, mToit); toit.position.set(xc, HE, Z0 - NM * LM); s.add(toit);
      for (var m = 0; m < NM; m++) {
        var zc = Z0 - LM / 2 - m * LM;
        murets.push([xf - cote * 0.03, HE / 2, zc + LM / 2, 0.06, HE, 0.2]);
        chem.push([xc + cote * 1.2, FAITE - 0.2, zc + LM / 2 - 0.4, 0.7, 1.6, 0.5]);
        // l'étage : deux fenêtres ; le rez-de-chaussée : une fenêtre et la porte
        [[zc - 1.3, 4.3, 1.0, 1.3], [zc + 1.3, 4.3, 1.0, 1.3], [zc - 1.3, 1.65, 1.1, 1.35]].forEach(function (f, fi) {
          var frac = (f[0] + 64) / 80;
          var allume = rf() < 0.78, t0 = 1.9 + 8.6 * frac + rf() * 2.6, neon = rf() < 0.3;
          fenetres.push({ x: xf - cote * 0.02, y: f[1], z: f[0], w: f[2], h: f[3], cote: cote, t0: allume ? t0 : 1e9, neon: neon, ph: rf() * 6, haut: fi < 2 });
          appuis.push([xf - cote * 0.04, f[1] - f[3] / 2 - 0.06, f[0], 0.16, 0.1, f[2] + 0.2]);
          volets.push([xf - cote * 0.03, f[1], f[0] - f[2] / 2 - 0.27, 0.04, f[3], 0.52]);
          volets.push([xf - cote * 0.03, f[1], f[0] + f[2] / 2 + 0.27, 0.04, f[3], 0.52]);
        });
        portes.push([xf - cote * 0.03, 1.08, zc + 1.4, 0.08, 2.16, 0.95]);
      }
    });
    // la fenêtre du plan 2 (rangée de droite, la septième maison, à l'étage) : son volet
    // s'ouvre, le rideau s'allume, une ombre s'y pose
    var zF = Z0 - LM / 2 - 6 * LM - 1.3, iF = -1;
    fenetres.forEach(function (f, i) { if (f.cote > 0 && f.haut && Math.abs(f.z - zF) < 0.01) iF = i; });
    var FEN = fenetres[iF]; FEN.t0 = 6.3; FEN.neon = false; FEN.special = true;
    volets = volets.filter(function (v) { return !(v[0] > 0 && Math.abs(v[1] - 4.3) < 0.01 && Math.abs(v[2] - (zF - 0.77)) < 0.01); });
    function instances(liste, mat, ombre) {
      var im = new THREE.InstancedMesh(K.garder(new THREE.BoxGeometry(1, 1, 1)), mat, liste.length), d = new THREE.Object3D();
      liste.forEach(function (b, i) { d.position.set(b[0], b[1], b[2]); d.scale.set(b[3], b[4], b[5]); d.updateMatrix(); im.setMatrixAt(i, d.matrix); });
      im.instanceMatrix.needsUpdate = true; im.castShadow = !!ombre; im.receiveShadow = true; s.add(im);
      return im;
    }
    // au fond de la cité, une rangée en travers, face à la tour : d'en haut, on la voit
    // s'allumer (les fenêtres de la tour, au plan 3)
    var ZB = 24;
    [-1, 1].forEach(function (cote) {
      var x0 = cote < 0 ? -44 : 7, larg = 37, nb = 7;
      var corpsB = new THREE.Mesh(P.boiteUV(larg, HE, PROF, 2.0), mBr); corpsB.position.set(x0 + larg / 2, HE / 2, ZB + PROF / 2); s.add(corpsB);
      var prB = new THREE.Shape(); prB.moveTo(-PROF / 2 - 0.35, 0); prB.lineTo(PROF / 2 + 0.35, 0); prB.lineTo(0, FAITE - HE); prB.lineTo(-PROF / 2 - 0.35, 0);
      var toitB = new THREE.Mesh(K.garder(new THREE.ExtrudeGeometry(prB, { depth: larg, bevelEnabled: false })), mToit); toitB.rotation.y = PI / 2; toitB.position.set(x0, HE, ZB + PROF / 2); s.add(toitB);
      for (var m = 0; m < nb; m++) {
        var xm = x0 + LM / 2 + m * LM;
        [[xm - 1.3, 4.3, 1.0, 1.3], [xm + 1.3, 4.3, 1.0, 1.3], [xm - 1.3, 1.65, 1.1, 1.35]].forEach(function (f) {
          var allume = rf() < 0.8;
          fenetres.push({ x: f[0], y: f[1], z: ZB - 0.02, w: f[2], h: f[3], ry: PI, t0: allume ? 10.9 + rf() * 3.6 : 1e9, neon: rf() < 0.3, ph: rf() * 6, haut: false });
          volets.push([f[0] - f[2] / 2 - 0.27, f[1], ZB - 0.03, 0.52, f[3], 0.04]); volets.push([f[0] + f[2] / 2 + 0.27, f[1], ZB - 0.03, 0.52, f[3], 0.04]);
        });
        chem.push([xm + LM / 2 - 0.4, FAITE - 0.2, ZB + PROF / 2 + 1.2, 0.5, 1.6, 0.7]);
      }
    });
    instances(murets, mBr); instances(chem, mBr); instances(appuis, mPierre); instances(volets, mVolet); instances(portes, mPorte);
    // les vitres : un seul appel, une couleur par fenêtre (éteinte : la vitre noire qui
    // reflète un peu ; allumée : l'ampoule jaune, ou le néon blanc d'une cuisine)
    var mVit = K.garder(new THREE.MeshBasicMaterial({ color: "#ffffff", toneMapped: false }));
    var vitres = new THREE.InstancedMesh(K.garder(new THREE.PlaneGeometry(1, 1)), mVit, fenetres.length), dv = new THREE.Object3D();
    fenetres.forEach(function (f, i) {
      dv.position.set(f.x, f.y, f.z); dv.rotation.set(0, f.ry != null ? f.ry : f.cote > 0 ? -PI / 2 : PI / 2, 0); dv.scale.set(f.w, f.h, 1); dv.updateMatrix(); vitres.setMatrixAt(i, dv.matrix);
      vitres.setColorAt(i, new THREE.Color("#0b0d12"));
    });
    vitres.instanceMatrix.needsUpdate = true; s.add(vitres);
    var cJaune = new THREE.Color("#FFB765"), cNeon = new THREE.Color("#D2E2FF"), cNuit = new THREE.Color("#0b0d12"), cTmp = new THREE.Color();
    // la fenêtre du plan 2 : le rideau (devant la vitre), l'ombre, le volet qui s'ouvre
    var mRid = K.garder(new THREE.MeshBasicMaterial({ map: rideau(K), color: "#000000", toneMapped: false }));
    var rid = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(FEN.w * 0.96, FEN.h * 0.96)), mRid); rid.position.set(FEN.x - 0.012, FEN.y, FEN.z); rid.rotation.y = -PI / 2; s.add(rid);
    var mOmbre = K.garder(new THREE.MeshBasicMaterial({ color: "#1a1008", alphaMap: ombreChinoise(K), transparent: true, opacity: 0, depthWrite: false }));
    var ombre = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(FEN.w * 0.96, FEN.h * 0.96)), mOmbre); ombre.position.set(FEN.x - 0.02, FEN.y, FEN.z); ombre.rotation.y = -PI / 2; s.add(ombre);
    var charn = new THREE.Group(); charn.position.set(FEN.x - 0.06, FEN.y, FEN.z - FEN.w / 2 - 0.02); s.add(charn);
    var voletM = P.boite(charn, 0.04, FEN.h, 0.52, mVolet, 0, 0, 0.26 + 0.01);
    voletM.castShadow = true;
    var lumFen = K.look.ponctuelle({ couleur: "#FFB765", intensite: 0, portee: 9 }); lumFen.position.set(FEN.x - 1.2, FEN.y, FEN.z); s.add(lumFen);
    // ── les réverbères de la rue (allumés) ; leurs reflets sur l'asphalte mouillé
    var lamps = [[-4.6, 9], [4.6, -7], [-4.6, -23], [4.6, -39]].map(function (p, i) {
      var r = P.reverbere({ hauteur: 6.2, bras: 1.3, intensite: 120, gresille: i === 2 ? 1 : 0.2, forceCone: 0.13 });
      r.position.set(p[0], 0, p[1]); r.rotation.y = p[0] < 0 ? 0 : PI; s.add(r);
      return r;
    });
    s.updateMatrixWorld(true);
    var refletsL = lamps.map(function (l) { var rl = K.look.reflet({ pos: l.positionLampe(), couleur: SODIUM, intensite: 1.1, largeur: 1.0, longueur: 11 }); s.add(rl); return rl; });
    // ── au bout de la rue : le mur de l'usine, le portail fermé ; la grande halle, sa tour
    var mBrU = K.mat.brique({ couleur: "#5a2e24", graine: "mur-usine", suie: 1.2, humide: 1.0 });
    var murU = new THREE.Mesh(P.boiteUV(90, 2.8, 0.4, 2.0), mBrU); murU.position.set(0, 1.4, -72); s.add(murU);
    var mTole = K.mat.rouille({ peinture: "#3c4042", part: 0.35, graine: "toles-halle" });
    var halle = new THREE.Mesh(P.boiteUV(56, 12.5, 32, 2.0), mBrU); halle.position.set(0, 6.25, -134); halle.castShadow = true; s.add(halle);
    var pign = new THREE.Shape(); pign.moveTo(-16, 0); pign.lineTo(16, 0); pign.lineTo(0, 4.5); pign.lineTo(-16, 0);
    var gPg = K.garder(new THREE.ExtrudeGeometry(pign, { depth: 56, bevelEnabled: false }));
    var toitH = new THREE.Mesh(gPg, mTole); toitH.rotation.y = PI / 2; toitH.position.set(-28, 12.5, -134); s.add(toitH);
    var T = { x: 5, z: -116, c: 4.6, h: 24 };
    var tour = new THREE.Mesh(P.boiteUV(T.c, T.h, T.c, 1.6), mBrU); tour.position.set(T.x, T.h / 2, T.z); tour.castShadow = true; s.add(tour);
    P.boite(s, T.c + 0.5, 0.45, T.c + 0.5, mPierre, T.x, T.h + 0.22, T.z);
    [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(function (d) {
      P.boite(s, d[0] ? 0.25 : T.c + 0.5, 0.9, d[1] ? 0.25 : T.c + 0.5, mBrU, T.x + d[0] * (T.c / 2 + 0.12), T.h + 0.9, T.z + d[1] * (T.c / 2 + 0.12));
    });
    var sir = sirene(K, THREE, P); sir.position.set(T.x, T.h + 0.45, T.z); s.add(sir);
    // la sirène vue de la rue : une lueur orange au sommet de la tour (elle s'efface là-haut)
    var voyLoin = K.look.halo({ couleur: ORANGE, taille: 7, intensite: 0 }); voyLoin.position.set(T.x, T.h + 3.3, T.z + 0.6); s.add(voyLoin);
    // la ville éclaire la sirène par en dessous, du côté de la cité
    var lueurVille = K.look.ponctuelle({ couleur: "#FF9A50", intensite: 60, portee: 16 }); lueurVille.position.set(T.x + 1.5, T.h - 1.5, T.z + 6); s.add(lueurVille);
    // les lampadaires du quai, devant la halle
    var quai = [[-14, -113], [17, -113]].map(function (p) {
      var r = P.reverbere({ hauteur: 6.6, bras: 1.4, intensite: 160, forceCone: 0.1 }); r.position.set(p[0], 0, p[1]); r.rotation.y = PI / 2; s.add(r); return r;
    });
    // ── la pluie fine, les ronds dans les flaques
    var pluie = K.particules.pluie({ n: 7000, zone: { min: [-14, 0, -14], max: [14, 16, 14] }, suivre: true, avance: 7, vitesse: [0.6, -8.5, 0.2], longueur: 0.5, largeur: 0.011, couleur: "#9fb2cc", opacite: 0.85,
      lumieres: lamps.map(function (l) { return { pos: l.positionLampe(), couleur: SODIUM, intensite: 1.6, rayon: 8 }; }) });
    s.add(pluie);
    var ronds = K.particules.ronds({ n: 500, zone: { min: [-3.4, 0.0, -44], max: [3.4, 0.0, 16] }, periode: 0.8, rayon: 0.08, couleur: "#9fb2cc",
      lumieres: lamps.map(function (l) { return { pos: [l.positionLampe()[0], 0.5, l.positionLampe()[2]], couleur: SODIUM, intensite: 1.0, rayon: 7 }; }) });
    s.add(ronds);
    return {
      scene: s, sirene: sir,
      look: { bloom: 0.75, rayon: 0.6, seuil: 0.82, exposition: 1.0, contraste: 1.12, saturation: 0.9 },
      maj: function (t, c) {
        // la sirène : le moteur prend sa vitesse (1,0-3,2 s), tient
        var vit = K.lisse(0.9, 3.2, t), voyant = K.lisse(0.95, 1.05, t);
        sir.maj(vit, t, voyant);
        var cam = c.camera.position, loin = Math.hypot(cam.x - T.x, cam.z - T.z) > 30 ? 1 : 0;
        voyLoin.intensite(1.4 * voyant * loin);
        lamps.forEach(function (l, i) { l.maj(t, 1); refletsL[i].maj(c.camera, 1); });
        quai.forEach(function (l) { l.maj(t, 1); });
        // les fenêtres : une vague qui part du bout de la rue, vers nous
        fenetres.forEach(function (f, i) {
          var k = K.lisse(f.t0, f.t0 + 0.12, t);
          if (f.neon && t > f.t0 && t < f.t0 + 0.7) k *= K.bruit1(t * 30, i) > 0 ? 1 : 0.15;   // le néon qui hésite
          cTmp.copy(cNuit).lerp(f.neon ? cNeon : cJaune, k).multiplyScalar(1 - (f.neon ? 0.25 : 0.12) * k);
          if (f.special) cTmp.copy(cNuit);
          vitres.setColorAt(i, cTmp);
        });
        vitres.instanceColor.needsUpdate = true;
        // la fenêtre du plan 2 : le rideau s'allume, le volet s'ouvre, l'ombre se pose
        var kf = K.lisse(FEN.t0, FEN.t0 + 0.12, t);
        mRid.color.set("#FFB765").multiplyScalar(1.5 * kf);
        lumFen.intensity = 6 * kf;
        charn.rotation.y = -K.lisse(6.85, 7.6, t) * 2.6;
        mOmbre.opacity = 0.85 * K.lisse(7.9, 8.5, t) * (1 - 0.15 * K.lisse(10.6, 11.4, t));
        mN.forEach(function (n, i) { n.s.position.x = n.x + t * (0.6 + i * 0.05); });
        pluie.maj(t, c.camera); ronds.maj(t, c.camera);
      }
    };
  }

  // ─── LA GRANDE HALLE, DEDANS : LE TOIT TROUÉ, LE TERRAIN À LA CRAIE ─────────
  function halle(K, ctx) {
    var THREE = ctx.THREE, P = K.props, q = ctx.qualite, qt = K.qualiteTextures || 1;
    var s = K.decor(ctx, { ciel: false, fond: "#020305", environnement: { zenith: "#06080d", horizon: "#151820", lueur: "#4a2a16", fenetres: 0,
      lampes: [{ pos: [3, 18, 8], couleur: SODIUM, intensite: 8, taille: 3 }, { pos: [-14, 16, -6], couleur: "#7f9ccc", intensite: 2, taille: 4 }] },
      reflets: 1.0, ambiance: ["#5a6e9a", "#2a1e16", 2.6], brouillard: ["#0a0b10", 0.016] });
    // la nuit par les trous du toit : un bleu froid, de haut, sans ombre
    var nuitBleue = new THREE.DirectionalLight("#6f86b8", 0.9); nuitBleue.position.set(-10, 40, -6); s.add(nuitBleue);
    var X0 = -28, X1 = 28, Z0 = -16, Z1 = 16, HM = 12.5, FAITE = 17;
    // le sol : le béton, les lignes de craie (une toile pour le terrain, une plus fine au centre)
    var mSol = K.mat.beton({ couleur: "#57544d", graine: "halle-sol", banches: 0, taches: 1.5 });
    var sol = new THREE.Mesh(P.planUV(X1 - X0, Z1 - Z0, 4), mSol); sol.rotation.x = -PI / 2; sol.receiveShadow = true; s.add(sol);
    var CENTRE = [-5, -5, 5, 5];
    var tGrand = terrainCraie(K, { w: Math.round(2048 * qt), h: Math.round(1024 * qt), zone: [-26, -14, 26, 14], trou: CENTRE, graine: "craie" });
    var tCentre = terrainCraie(K, { w: Math.round(1024 * qt), h: Math.round(1024 * qt), zone: CENTRE, graine: "craie-centre" });
    function planCraie(tex, z, y) {
      var m = K.garder(new THREE.MeshStandardMaterial({ color: "#e6e3d8", map: tex, transparent: true, depthWrite: false, roughness: 0.95, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
      var p = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(z[2] - z[0], z[3] - z[1])), m);
      p.rotation.x = -PI / 2; p.position.set((z[0] + z[2]) / 2, y, (z[1] + z[3]) / 2); p.receiveShadow = true; p.renderOrder = 1; s.add(p);
      return p;
    }
    planCraie(tGrand, [-26, -14, 26, 14], 0.004); planCraie(tCentre, CENTRE, 0.005);
    // les flaques (sous les trous du toit) : un béton noir qui reflète
    var flaques = [[0.4, 6.0, 5.4, 2.8, "f1"], [-9.5, -6.5, 3.4, 2.2, "f2"], [14, 3, 2.8, 2, "f3"], [1.6, 2.5, 1.6, 1.0, "f4"]].map(function (f) {
      var m = K.garder(new THREE.MeshStandardMaterial({ color: "#07080a", roughness: 0.04, metalness: 0.0, alphaMap: flaque(K, f[4]), transparent: true, depthWrite: false, envMapIntensity: 1.6 }));
      var p = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(f[2], f[3])), m); p.rotation.x = -PI / 2; p.position.set(f[0], 0.007, f[1]); p.renderOrder = 2; s.add(p); return p;
    });
    // les murs : la brique, les hautes fenêtres aux carreaux crevés (le bleu de la nuit)
    var mBr = K.mat.brique({ couleur: "#5a2f25", graine: "halle-dedans", suie: 1.4, humide: 0.9 });
    function mur(w, h, d, x, y, z) { var b = new THREE.Mesh(P.boiteUV(w, h, d, 1.6), mBr); b.position.set(x, y, z); b.receiveShadow = true; s.add(b); return b; }
    mur(X1 - X0, HM, 0.6, 0, HM / 2, Z0 - 0.3); mur(X1 - X0, HM, 0.6, 0, HM / 2, Z1 + 0.3);
    mur(0.6, HM, Z1 - Z0, X0 - 0.3, HM / 2, 0); mur(0.6, HM, Z1 - Z0, X1 + 0.3, HM / 2, 0);
    // les pignons (au-dessus des murs courts)
    [-1, 1].forEach(function (sg) {
      var pg = new THREE.Shape(); pg.moveTo(Z0, 0); pg.lineTo(Z1, 0); pg.lineTo(0, FAITE - HM); pg.lineTo(Z0, 0);
      var m = new THREE.Mesh(K.garder(new THREE.ShapeGeometry(pg)), mBr); m.rotation.y = -sg * PI / 2; m.position.set(sg > 0 ? X1 : X0, HM, 0); s.add(m);
    });
    var cv = K.tex.canvas(256, 192), vx = cv.getContext("2d"), rv = K.alea("carreaux-halle");
    vx.fillStyle = "#0a0b0d"; vx.fillRect(0, 0, 256, 192);
    for (var vj = 0; vj < 7; vj++) for (var vi = 0; vi < 5; vi++) {
      var v = rv(); if (v < 0.32) continue;
      var kk = 0.2 + rv() * 0.35; vx.fillStyle = K.css([0.18 * kk + 0.04, 0.24 * kk + 0.05, 0.38 * kk + 0.07]); vx.fillRect(vi * 51 + 3, vj * 27 + 3, 45, 21);
    }
    var mVitre = K.garder(new THREE.MeshBasicMaterial({ map: K.tex.texture(cv, { clamp: true }), color: new THREE.Color("#ffffff").multiplyScalar(1.3) }));
    var gVitre = K.garder(new THREE.PlaneGeometry(4, 6));
    for (var wi = 0; wi < 7; wi++) {
      var xw = X0 + 5 + wi * 7.7;
      [Z0 + 0.01, Z1 - 0.01].forEach(function (zw, k) { var p = new THREE.Mesh(gVitre, mVitre); p.position.set(xw, 7.2, zw); p.rotation.y = k ? PI : 0; s.add(p); });
    }
    // la charpente : les poteaux, les entraits, les arbalétriers (un appel)
    var mFer = K.mat.metal({ couleur: "#1e2124", rugosite: 0.7 });
    var poutres = [], pente = Math.atan2(FAITE - HM, Z1), Lp = Math.hypot(Z1, FAITE - HM);
    for (var px = X0 + 3.5; px < X1; px += 7) {
      poutres.push([px, HM / 2, Z0 + 0.45, 0.35, HM, 0.35, 0]); poutres.push([px, HM / 2, Z1 - 0.45, 0.35, HM, 0.35, 0]);
      poutres.push([px, HM - 0.15, 0, 0.22, 0.3, Z1 - Z0, 0]);
      poutres.push([px, (HM + FAITE) / 2 - 0.2, Z0 / 2, 0.2, 0.32, Lp, pente]); poutres.push([px, (HM + FAITE) / 2 - 0.2, Z1 / 2, 0.2, 0.32, Lp, -pente]);
      poutres.push([px, (HM + FAITE) / 2 - 0.1, 0, 0.16, FAITE - HM, 0.16, 0]);
    }
    for (var pz2 = -12; pz2 <= 12; pz2 += 6) poutres.push([0, HM + (FAITE - HM) * (1 - Math.abs(pz2) / Z1) - 0.35, pz2, X1 - X0, 0.22, 0.16, 0]);
    var gB = K.garder(new THREE.BoxGeometry(1, 1, 1)), imP = new THREE.InstancedMesh(gB, mFer, poutres.length), dP = new THREE.Object3D();
    poutres.forEach(function (b, i) { dP.position.set(b[0], b[1], b[2]); dP.rotation.set(b[6], 0, 0); dP.scale.set(b[3], b[4], b[5]); dP.updateMatrix(); imP.setMatrixAt(i, dP.matrix); });
    imP.instanceMatrix.needsUpdate = true; imP.castShadow = true; s.add(imP);
    // le toit : des tôles, et des trous (le grand, par où tombe la lumière du quai)
    var TROUS = { "7,1,1": 1, "6,1,1": 1, "2,0,1": 1, "11,2,-1": 1, "10,1,-1": 1, "4,3,1": 1, "12,0,1": 1, "1,2,-1": 1, "3,1,-1": 1 };
    var toles = [], dT = new THREE.Object3D(), NL = 4, lt = Lp / NL;
    [-1, 1].forEach(function (sg) {
      for (var ix = 0; ix < 14; ix++) for (var iz = 0; iz < NL; iz++) {
        if (TROUS[ix + "," + iz + "," + sg]) continue;
        var d = (iz + 0.5) * lt, zz = sg * d * Math.cos(pente), yy = FAITE - d * Math.sin(pente);
        toles.push([X0 + 2 + ix * 4, yy + 0.1, zz, sg]);
      }
    });
    var imT = new THREE.InstancedMesh(gB, mFerToles(), toles.length);
    function mFerToles() { var m = K.mat.rouille({ peinture: "#33383a", part: 0.4, graine: "toles-dedans" }); m.side = THREE.DoubleSide; return m; }
    toles.forEach(function (b, i) {
      var jx = K.h01(i, 3) * 0.12;
      dT.position.set(b[0] + jx, b[1], b[2]); dT.rotation.set(-b[3] * pente, 0, (K.h01(i, 9) - 0.5) * 0.03); dT.scale.set(4.02, 0.05, lt + 0.02); dT.updateMatrix(); imT.setMatrixAt(i, dT.matrix);
    });
    imT.instanceMatrix.needsUpdate = true; imT.castShadow = true; imT.receiveShadow = true; s.add(imT);
    // la lumière du quai : un projecteur au-dessus du grand trou, qui vise le rond central
    var SRC = [5, 26, 14], CIB = [0.2, 0, -0.4];
    var quai = K.look.projecteur({ couleur: SODIUM, intensite: 5200, angle: 0.15, penombre: 0.55, decroissance: 2, ombre: true, loin: 40, pres: 4, ombreTaille: 1024 });
    quai.position.fromArray(SRC); s.add(quai);
    var lampeQuai = K.look.halo({ couleur: SODIUM, taille: 10, intensite: 1.0 }); lampeQuai.position.fromArray(SRC); s.add(lampeQuai);
    var lampeQuai2 = K.look.halo({ couleur: "#FFC27A", taille: 2.2, intensite: 1.6, coeur: 0.2 }); lampeQuai2.position.fromArray(SRC); s.add(lampeQuai2); var cq = new THREE.Object3D(); cq.position.fromArray(CIB); s.add(cq); quai.target = cq;
    // son faisceau dans la pluie (du trou au sol)
    var dir = new THREE.Vector3().fromArray(CIB).sub(new THREE.Vector3(2.65, 14.87, 7.58));
    var Lf = dir.length();
    var faisceau = K.look.cone({ longueur: Lf, rayonHaut: 1.5, rayonBas: 2.9, couleur: SODIUM, intensite: 0.36, poussiere: 0.8 });
    faisceau.position.set(2.65, 14.87, 7.58);
    faisceau.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir.clone().normalize()); s.add(faisceau);
    // les trous bleus : des faisceaux froids, et leurs taches au sol
    var tT = tache(K), bleus = [];
    [[-21.5, -8.7, 2.6], [15.5, -4.6, 2.2], [-9.5, -6.5, 2.4], [-23.5, 8.7, 2.0]].forEach(function (b, i) {
      var co = K.look.cone({ longueur: 15, rayonHaut: 1.5, rayonBas: 2.2, couleur: "#7f9ccc", intensite: 0.24, poussiere: 0.6 });
      co.position.set(b[0], 15.2, b[1]); co.rotation.x = 0.06; s.add(co); bleus.push(co);
      var mt = K.garder(new THREE.MeshBasicMaterial({ map: tT, color: new THREE.Color("#6f8cc0").multiplyScalar(0.6), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      var pt = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(4 * b[2] / 2.4, 4.2 * b[2] / 2.4)), mt); pt.rotation.x = -PI / 2; pt.position.set(b[0], 0.009, b[1] + 0.9); pt.renderOrder = 3; s.add(pt);
    });
    // le reflet du faisceau dans les flaques
    var refl = K.look.reflet({ pos: [2.65, 14.87, 7.58], couleur: SODIUM, intensite: 0.7, largeur: 1.6, longueur: 9 }); s.add(refl);
    // la pluie qui tombe par le grand trou (dans le faisceau), ses ronds dans la flaque
    var LUMF = [{ pos: [2.2, 12, 6.4], couleur: SODIUM, intensite: 2.2, rayon: 5 }, { pos: [1.4, 7, 3.6], couleur: SODIUM, intensite: 2.2, rayon: 5 }, { pos: [0.6, 2.5, 1.0], couleur: SODIUM, intensite: 2.4, rayon: 4 }];
    var pluie = K.particules.pluie({ n: 1800, zone: { min: [-3.8, 0, 4.1], max: [3.8, 15.4, 7.9] }, vitesse: [0.3, -8, 0.1], longueur: 0.42, largeur: 0.01, couleur: "#8ea3c2", opacite: 0.9, lumieres: LUMF });
    s.add(pluie);
    var pluie2 = K.particules.pluie({ n: 900, zone: { min: [-23.5, 0, -10.8], max: [-19.5, 15, -6.6] }, vitesse: [0.3, -8, 0.1], longueur: 0.42, largeur: 0.01, couleur: "#8ea3c2", opacite: 0.6,
      lumieres: [{ pos: [-21.5, 6, -8.7], couleur: "#6f8cc0", intensite: 0.9, rayon: 7 }] });
    s.add(pluie2);
    var ronds = K.particules.ronds({ n: 140, zone: { min: [-2.2, 0.0, 5.0], max: [3.0, 0.0, 7.1] }, periode: 0.6, rayon: 0.07, couleur: "#9fb2cc", lumieres: [{ pos: [2.5, 0.8, 5.8], couleur: SODIUM, intensite: 1.2, rayon: 5 }] });
    s.add(ronds);
    var gouttes = K.particules.egouttures({ points: [[-3.9, 15.3, 5.6], [3.9, 14.9, 7.4], [1.1, 15.8, 4.1], [-19.6, 14.4, -7.0], [16.6, 14.6, -3.4]], parPoint: 3, chute: 14.5, vie: 2.6, couleur: "#a9bad6", opacite: 0.9, lumieres: LUMF });
    s.add(gouttes);
    // le bidon et ses braises, deux caisses ; des socles de machines arrachées
    var mRouille = K.mat.rouille({ peinture: "#4a3a30", part: 0.6, graine: "bidon" });
    var B = [-14.5, 10.6];
    P.cylindre(s, 0.3, 0.3, 0.88, mRouille, B[0], 0.44, B[1], { cotes: 18, ouvert: true });
    var mBr2 = K.garder(new THREE.MeshBasicMaterial({ map: braises(K), color: "#ffffff", toneMapped: false }));
    var feu = new THREE.Mesh(K.garder(new THREE.CircleGeometry(0.29, 20)), mBr2); feu.rotation.x = -PI / 2; feu.position.set(B[0], 0.8, B[1]); s.add(feu);
    var lumFeu = K.look.ponctuelle({ couleur: "#FF6A2A", intensite: 12, portee: 10 }); lumFeu.position.set(B[0], 1.25, B[1]); s.add(lumFeu);
    var hFeu = K.look.halo({ couleur: "#FF7A3A", taille: 1.6, intensite: 0.5 }); hFeu.position.set(B[0], 1.0, B[1]); s.add(hFeu);
    var fumeeF = K.particules.fumee({ n: 14, source: [B[0], 0.95, B[1]], vent: [0.15, 0.05], montee: 0.5, vie: 7, taille: 0.9, etalement: 0.2, couleur: "#3a3632", lueur: "#8a4a2a", opacite: 0.22, graine: "bidon" });
    s.add(fumeeF);
    var etinc = K.particules.etincelles({ n: 10, source: [B[0], 0.85, B[1]], direction: [0.05, 1, 0], vie: 2.4, force: 1.2, couleur: "#FF8A3A", taille: 0.02, graine: "bidon" });
    s.add(etinc);
    var mBois = K.mat.bois({ couleur: "#4a3322", lames: 4, graine: "caisses" });
    P.boite(s, 0.6, 0.45, 0.45, mBois, B[0] + 1.0, 0.225, B[1] - 0.5, { ry: 0.3 }); P.boite(s, 0.55, 0.4, 0.4, mBois, B[0] - 0.9, 0.2, B[1] + 0.6, { ry: -0.5 });
    var mSocle = K.mat.beton({ couleur: "#4a4740", graine: "socles", banches: 0, taches: 1.0 });
    [[-18, -3], [-18, 4], [12, -8], [19, -8], [12, 8], [19, 9]].forEach(function (p, i) { P.boite(s, 2.4, 0.35, 1.4, mSocle, p[0], 0.175, p[1], { ry: (i % 2) * 0.02 }); });
    // ── toi : couché en chien de fusil dans le rond central, la veste sous la tête
    var corps = K.gens.mannequin({ silhouette: true, tenue: "blouson", graine: "toi", taille: 1.76 });
    var o = corps.os;
    corps.repos(0);
    o.buste.rotation.x = 0.42; o.tete.rotation.x = 0.35; o.tete.rotation.y = 0.15;
    o.hancheG.rotation.x = -1.25; o.hancheD.rotation.x = -1.05; o.genouG.rotation.x = 1.7; o.genouD.rotation.x = 1.45;
    corps.bras(1.15, 0.0, 0.85, -0.25, 1.75);
    o.epauleD.rotation.y = 0.2;
    corps.groupe.rotation.z = -PI / 2; corps.groupe.rotation.y = -0.12;
    corps.groupe.position.set(-0.75, 0.2, -0.2); s.add(corps.groupe);
    var mVeste = K.garder(new THREE.MeshStandardMaterial({ color: "#1a1c22", roughness: 0.9 }));
    var veste = P.boite(s, 0.5, 0.09, 0.36, mVeste, 0.86, 0.045, 0.05, { ry: 0.1 });
    veste.castShadow = true;
    var poussiere = K.particules.poussiere({ n: 900, zone: { min: [-3, 0.4, -3], max: [5, 13, 8] }, couleur: "#ffd09a", opacite: 0.9, taille: 0.012, lumieres: LUMF });
    s.add(poussiere);
    var look = { bloom: 0.7, rayon: 0.6, seuil: 0.82, exposition: 1.0, contraste: 1.14, saturation: 0.9 };
    return {
      scene: s, look: look,
      maj: function (t, c) {
        // le sodium du quai grésille un peu ; le feu respire
        var g = 1 - 0.06 * Math.max(0, K.bruit1(t * 7, 3));
        quai.intensity = 5200 * g; faisceau.maj(t, 0.36 * g);
        bleus.forEach(function (b) { b.maj(t); });
        var fl = 0.75 + 0.25 * K.fbm1(t * 2.3, 11);
        lumFeu.intensity = 12 * fl; hFeu.intensite(0.5 * fl); mBr2.color.setScalar(0.8 + 0.6 * fl);
        refl.maj(c.camera, 1);
        pluie.maj(t, c.camera); pluie2.maj(t, c.camera); ronds.maj(t, c.camera); gouttes.maj(t, c.camera);
        fumeeF.maj(t); etinc.maj(t, c.camera); poussiere.maj(t, c.camera);
        corps.groupe.visible = t < 28.4;
        // le dernier plan : des yeux qui s'ouvrent (deux battements de noir), flou puis net
        if (t > 28.3) {
          var u = t - 28.4;
          var e = u < 0.35 ? 0 : u < 0.75 ? 0.6 * K.lisse(0.35, 0.75, u) : u < 1.05 ? 0.6 - 0.52 * K.lisse(0.75, 1.05, u) : 0.08 + 0.92 * K.lisse(1.05, 1.9, u);
          look.exposition = e; look.rayon = 0.95 - 0.35 * K.lisse(1.0, 2.6, u); look.bloom = 1.1 - 0.4 * K.lisse(1.0, 2.6, u);
        } else { look.exposition = 1.0; look.rayon = 0.6; look.bloom = 0.7; }
      }
    };
  }

  FC.film({
    id: "sirene_trois_heures",
    livre: "pepite",
    titre: "Trois heures",
    duree: 34.0,
    musique: "livre_h3",
    musiqueDepuis: "pont",
    secours: "sombre",
    couleur: ORANGE,
    affiche: 25.6,
    habillage: { vignette: 0.55, grain: 0.08, ratioPaysage: 2.35, ratioPortrait: 0 },
    sortie: { noir: 1.4 },
    // la sirène (le vrai bruit, sous la musique) : elle monte, retombe, remonte
    sons: [[1.0, "sirene"], [3.6, "sirene"], [6.2, "sirene"], [8.8, "sirene"], [11.4, "sirene"], [14.0, "sirene"], [17.6, "sirene"], [22.0, "sirene"]],
    textes: [
      { sorte: "lieu", de: 0.8, a: 5.4, texte: "La cité de la Tréfilerie", sous: "Trois heures du matin" },
      { sorte: "replique", de: 7.5, a: 11.3, qui: "Une voix, à une fenêtre", texte: "Rendors-toi. L'usine est fermée." },
      { sorte: "titre", de: 30.2, a: 33.7, texte: "Trois heures", sous: "La Sirène", entree: 0.2, sortie: 0.7 }
    ],
    montages: { court: [[0.5, 5.8], [6.4, 11.4], [12.0, 16.2], [17.0, 21.8], [23.0, 27.8], [28.6, 33.9]] },
    preparer: function (K, ctx) {
      return K.etapes(ctx, [
        function () { ctx.decors.cite = cite(K, ctx); },
        function () { ctx.decors.halle = halle(K, ctx); }
      ]);
    },
    plans: [
      // 1 · la rue de la cité, la nuit ; au bout, la tour ; la sirène se lève
      { de: 0, a: 6.0, decor: "cite", entree: "noir", transition: 1.4, fixe: 3.4,
        camera: { pos: K_cles([[0, [0.9, 1.45, 15]], [6, [1.1, 1.5, 10.4]]], "douce"), cible: K_cles([[0, [2.6, 8.4, -118]], [6, [2.9, 9.4, -118]]], "douce"), fov: 40, epaule: 0.06 } },
      // 2 · les façades : les fenêtres s'allument, le volet, l'ombre sur le rideau
      { de: 6.0, a: 11.6, decor: "cite", entree: "coupe", fixe: 3.4,
        camera: { pos: K_cles([[0, [-4.4, 1.55, -16.6]], [5.6, [-4.3, 1.6, -18.2]]], "lin"), cible: K_cles([[0, [5.5, 3.9, -21.0]], [5.6, [5.5, 4.1, -21.8]]], "lin"), fov: 46, epaule: 0.08 } },
      // 3 · la sirène dans la pluie ; en bas, la cité allumée
      { de: 11.6, a: 16.6, decor: "cite", entree: "coupe", fixe: 2.2,
        camera: { pos: K_cles([[0, [6.3, 28.1, -121.5]], [5, [5.5, 28.3, -122.1]]], "douce"), cible: K_cles([[0, [2.5, 23.4, -108]], [5, [2.2, 23.2, -108]]], "douce"), fov: 54, epaule: K_cles([[0, 0.1], [5, 0.07]]) },
        cadrage: { paysage: { y: 0.62 } } },
      // 4 · la grande halle : le faisceau du quai, la pluie, les braises, la craie
      { de: 16.6, a: 22.4, decor: "halle", entree: "noir", transition: 0.9, fixe: 3.0,
        camera: { pos: K_cles([[0, [-21.5, 3.1, 12.0]], [5.8, [-17.8, 2.6, 10.2]]], "douce"), cible: K_cles([[0, [-1.2, 1.9, 1.6]], [5.8, [-0.6, 1.6, 1.0]]], "douce"), fov: 50, epaule: 0.06 } },
      // 5 · d'en haut : le terrain, le rond central, toi
      { de: 22.4, a: 28.4, decor: "halle", entree: "coupe", fixe: 3.4,
        camera: { pos: K_cles([[0, [0.32, 14.2, -0.55]], [6, [0.3, 9.6, -0.45]]], "douce"), cible: [0.25, 0, -0.2], roulis: K_cles([[0, 0.42], [6, 0.06]], "douce"), fov: 40, epaule: 0.03 } },
      // 6 · au ras du béton, de travers : les yeux qui s'ouvrent ; la tête se relève vers
      // le trou du toit, la pluie qui tombe dans la lumière
      { de: 28.4, a: 34.0, decor: "halle", entree: "coupe", fixe: 4.2,
        camera: { pos: K_cles([[0, [0.95, 0.16, 0.16]], [1.2, [0.95, 0.16, 0.16]], [5.6, [0.97, 0.36, 0.24]]], "douce"),
          cible: K_cles([[0, [1.5, 0.3, 5.0]], [1.3, [1.55, 0.45, 5.0]], [4.4, [2.6, 12.6, 7.3]], [5.6, [2.62, 13.0, 7.35]]], "douce"),
          roulis: K_cles([[0, -1.22], [1.3, -1.18], [4.4, -0.34], [5.6, -0.3]], "douce"), fov: 60, epaule: 0.05 } }
    ]
  });

  // les aides de la trousse, lues quand le film tourne (la trousse est chargée avant le film)
  function K_() { return FC.kit; }
  function K_cles(p, a) { var f = null; return function (t) { if (!f) f = K_().cles(p, a); return f(t); }; }
})(typeof window !== "undefined" ? window : this);
