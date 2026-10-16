/* ═══════════════════════════════════════════════════════════════════════════
   « La baie vitrée » — livre 9, « Vingt degrés dedans » (2029-2031, la
   sélectionneuse des Cobalts ; la couleur du livre : #DDEFFF, la glace).

   Al-Dorado, décembre 2030 : le Mondial d'hiver. Pour la première fois, on voit le
   Dôme dont on parle depuis le cercueil de janvier 2029. Ce que le film montre, et
   pourquoi :
     · dehors, trente-neuf degrés : l'esplanade blanche, le Dôme, ses nervures, les
       grues ; un panneau de pharmacie qui dit la température ; à côté, une tour
       qu'on finit, son échafaudage, des casques au soleil (Kévin était électricien
       sur ce chantier : « malaise, à l'intérieur du Dôme, 14 h 10 », disait le
       rapport — sl.h9.a3_rapport) ;
     · dedans, vingt degrés : la pelouse parfaite, les gradins blancs, vides, la brume
       froide qui sort des bouches au ras de l'herbe ; les Cobalts à l'entraînement ;
       les haut-parleurs qui souhaitent la bienvenue (l'humour à froid du livre :
       « pour votre confort, ne stationnez pas devant les baies ») ;
     · le banc : la climatisation jusque sous les sièges, des rubans qui battent dans
       le souffle froid (sl.h9.b4_couloir : « la climatisation jusque sur le banc ») ;
     · le couloir vitré : le sol poli, les ombres des meneaux, et derrière la vitre,
       au loin, la ville blanche et la tour ; on s'approche de la baie, et là-bas, en
       haut de l'échafaudage, un homme en casque marche le long d'une planche.
   Il se joue avant sl.h9.b4_couloir* (S1, créneau 15 : 91 % des carrières ; les
   autres finissent à l'aéroport, en garde à vue) : la carte dit la suite, « par la
   baie, au loin, un échafaudage, et un homme qui tombe. Personne d'autre n'a vu ».
   Le film ne montre pas la chute : il montre l'homme debout. Rien d'autre ne devance
   le livre : le tunnel, le brassard, la porte de service viennent après.

   LES PLANS (40,5 s) — la lumière, ce que chaque plan dit
   | 1 | 0–6,2    | l'esplanade, au ras du sol, dans la chaleur blanche : le Dôme, ses
   |   |          | nervures, deux grues ; la poussière dans le soleil ; carton « Al-Dorado,
   |   |          | le Dôme / Décembre 2030 · trente-neuf degrés dehors » | où ; la chaleur
   | 2 | 6,2–11,6 | le panneau de pharmacie, « 39 °C », puis la tour qu'on finit, son
   |   |          | échafaudage, des casques au soleil | ceux qui travaillent dehors
   | 3 | 11,6–18,6| dedans (une porte qui claque, « porte ») : la pelouse parfaite, les
   |   |          | gradins blancs, la brume froide, les Cobalts ; les haut-parleurs (le
   |   |          | carillon, « nouvelle ») : « Bienvenue sous le Dôme : vingt degrés. Pour
   |   |          | votre confort, ne stationnez pas devant les baies. » | le froid qu'on
   |   |          | achète ; la seule réplique
   | 4 | 18,6–23,8| le banc : les bouches d'air sous les sièges, la brume, les rubans qui
   |   |          | battent, « 20,0 °C » | la climatisation jusque sur le banc
   | 5 | 23,8–31,6| le couloir vitré : le sol poli, les ombres des meneaux ; derrière la
   |   |          | vitre, la ville blanche, la tour, les grues | la vitre : dedans, dehors
   | 6 | 31,6–40,5| à travers la baie, au téléobjectif : la tour, l'échafaudage ; en haut,
   |   |          | un homme en casque marche le long de la planche ; « Al-Dorado · 2030 /
   |   |          | Vingt degrés dedans » | l'homme debout, et la carte qui vient
   Le mouvement réduit : une image par plan (`fixe`). La coupe de 30 s (`montages.court`)
   garde les six plans, resserrés. La musique : livre_h9 (la ventilation, les cloches),
   `match` en secours.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var FC = global.FusibleCinema;
  var PI = Math.PI;
  var GLACE = "#DDEFFF";

  function tt(K, n) { return Math.max(64, Math.round(n * (K.qualiteTextures || 1) / 16) * 16); }
  function gm(K, m) { K.garder(m); return m; }

  // ─── LES MATIÈRES DU FILM ──────────────────────────────────────────────────
  // la peau du Dôme : des coussins de film tendu, en losanges, blancs, un peu bleus
  function toilePeau(K, dedans) {
    var W = tt(K, 512), c = K.tex.canvas(W, W), x = c.getContext("2d"), n = 16, s = W / n, r = K.alea(dedans ? "peau-in" : "peau");
    x.fillStyle = dedans ? "#e7eef4" : "#e9edf0"; x.fillRect(0, 0, W, W);
    for (var j = 0; j < n; j++) for (var i = 0; i < n; i++) {
      var k = 0.94 + r() * 0.06;
      var g = x.createRadialGradient((i + 0.5) * s, (j + 0.4) * s, 1, (i + 0.5) * s, (j + 0.5) * s, s * 0.7);
      g.addColorStop(0, "rgba(255,255,255," + (dedans ? 0.5 : 0.35) * k + ")"); g.addColorStop(1, "rgba(160,175,190," + (dedans ? 0.35 : 0.25) + ")");
      x.fillStyle = g; x.beginPath(); x.moveTo((i + 0.5) * s, j * s + 1); x.lineTo((i + 1) * s - 1, (j + 0.5) * s); x.lineTo((i + 0.5) * s, (j + 1) * s - 1); x.lineTo(i * s + 1, (j + 0.5) * s); x.closePath(); x.fill();
    }
    x.strokeStyle = dedans ? "rgba(90,105,120,0.55)" : "rgba(120,130,140,0.6)"; x.lineWidth = Math.max(1, W / 256);
    for (var d = -n; d <= n * 2; d++) { x.beginPath(); x.moveTo(d * s, 0); x.lineTo(d * s + W, W); x.stroke(); x.beginPath(); x.moveTo(d * s, W); x.lineTo(d * s + W, 0); x.stroke(); }
    return K.tex.texture(c, { repete: [10, 3] });
  }
  // l'esplanade : de grandes dalles claires, des joints, la poussière
  function toileDalles(K) {
    var W = tt(K, 512), c = K.tex.canvas(W, W), x = c.getContext("2d"), r = K.alea("dalles");
    x.fillStyle = "#cbbd9c"; x.fillRect(0, 0, W, W);
    var n = K.tex.couche(W, W, { periode: 4, octaves: 4, graine: "poussiere-sol" }), im = x.getImageData(0, 0, W, W), dd = im.data;
    for (var p = 0, q = 0; p < n.length; p++, q += 4) { var v = 0.9 + (n[p] - 0.5) * 0.25; dd[q] *= v; dd[q + 1] *= v; dd[q + 2] *= v * 0.97; }
    x.putImageData(im, 0, 0);
    x.strokeStyle = "rgba(120,104,80,0.6)"; x.lineWidth = Math.max(1, W / 300);
    for (var i = 0; i <= 4; i++) { x.beginPath(); x.moveTo(i * W / 4, 0); x.lineTo(i * W / 4, W); x.stroke(); x.beginPath(); x.moveTo(0, i * W / 4); x.lineTo(W, i * W / 4); x.stroke(); }
    for (var k = 0; k < W; k++) { x.fillStyle = "rgba(255,250,235," + r() * 0.2 + ")"; x.fillRect(r() * W, r() * W, 2, 2); }
    return K.tex.texture(c, { repete: [60, 60] });
  }
  // le panneau de pharmacie : des diodes ambrées, la température
  function ecranPanneau(K) {
    return K.tex.ecran({ largeur: 256, hauteur: 128, type: "lcd", fond: "#0c0806", ips: 4, dessiner: function (x, t, w, h) {
      // la température, puis l'heure (au plan 2, quand on le regarde), puis la température
      var on = !(t >= 7.5 && t < 10.5);
      x.fillStyle = "#ffb04a"; x.textAlign = "center"; x.textBaseline = "middle";
      x.font = "700 " + Math.round(h * 0.62) + 'px "Space Mono","DejaVu Sans Mono",monospace';
      x.fillText(on ? "39°C" : "14:10", w / 2, h * 0.54);
      // la grille des diodes
      x.fillStyle = "rgba(0,0,0,0.45)";
      for (var i = 0; i < w; i += 4) x.fillRect(i, 0, 1.5, h);
      for (var j = 0; j < h; j += 4) x.fillRect(0, j, w, 1.5);
    } });
  }
  // le petit afficheur du banc : vingt degrés, en vert
  function ecranBanc(K) {
    return K.tex.ecran({ largeur: 256, hauteur: 96, type: "lcd", fond: "#06100c", ips: 2, dessiner: function (x, t, w, h) {
      x.fillStyle = "#9df2c0"; x.textAlign = "center"; x.textBaseline = "middle";
      x.font = "700 " + Math.round(h * 0.6) + 'px "Space Mono","DejaVu Sans Mono",monospace';
      x.fillText("20,0 °C", w / 2, h * 0.52);
    } });
  }
  // la grille d'une bouche d'air
  function toileGrille(K) {
    var W = tt(K, 256), H = Math.round(W / 4), c = K.tex.canvas(W, H), x = c.getContext("2d");
    x.fillStyle = "#c9cdd0"; x.fillRect(0, 0, W, H);
    x.fillStyle = "#1a1d20"; for (var i = 4; i < W - 4; i += 7) x.fillRect(i, H * 0.15, 3.5, H * 0.7);
    return K.tex.texture(c, { repete: [6, 1] });
  }
  // la ville au loin, derrière la vitre : un horizon blanc, des tours, des grues
  function toileHorizon(K) {
    var W = tt(K, 1024), H = Math.round(W / 4), c = K.tex.canvas(W, H), x = c.getContext("2d"), r = K.alea("horizon");
    var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "rgba(220,226,232,0)"); g.addColorStop(1, "rgba(236,230,214,1)");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (var i = 0; i < 40; i++) { var w = 10 + r() * 30, h = 20 + r() * 120, xx = r() * W; x.fillStyle = "rgba(" + (170 + r() * 40 | 0) + "," + (172 + r() * 36 | 0) + "," + (168 + r() * 30 | 0) + ",0.85)"; x.fillRect(xx, H - h, w, h); }
    x.strokeStyle = "rgba(120,110,100,0.7)"; x.lineWidth = 2;
    for (var k = 0; k < 6; k++) { var cx = r() * W, hh = 80 + r() * 90; x.beginPath(); x.moveTo(cx, H); x.lineTo(cx, H - hh); x.lineTo(cx - 60 - r() * 40, H - hh); x.moveTo(cx, H - hh); x.lineTo(cx + 25, H - hh); x.stroke(); }
    var gb = x.createLinearGradient(0, H * 0.6, 0, H); gb.addColorStop(0, "rgba(240,236,222,0)"); gb.addColorStop(1, "rgba(240,236,222,0.7)");
    x.fillStyle = gb; x.fillRect(0, 0, W, H);
    return K.tex.texture(c, { clamp: true });
  }

  // ─── LE DÔME (vu de dehors : la peau blanche ; de dedans : la voûte) ──────────
  function dome(K, THREE, o) {
    var g = new THREE.Group(), R = o.rayon || 70, tm = PI * 0.42, ech = 0.55, bas = R * Math.cos(tm) * ech, socle = 6;
    var mPeau = gm(K, new THREE.MeshStandardMaterial({ map: o.peau, color: o.dedans ? "#ffffff" : "#f4f6f7", roughness: o.dedans ? 0.9 : 0.32, metalness: 0,
      emissive: new THREE.Color(o.dedans ? "#dfeaf4" : "#000000"), emissiveMap: o.dedans ? o.peau : null, emissiveIntensity: o.dedans ? 0.9 : 0, side: o.dedans ? THREE.BackSide : THREE.FrontSide, envMapIntensity: 1.2 }));
    var peau = new THREE.Mesh(K.garder(new THREE.SphereGeometry(R, 72, 24, 0, PI * 2, 0, tm)), mPeau); peau.scale.y = ech; peau.position.y = -bas + socle; peau.receiveShadow = true; g.add(peau);
    // les nervures : des tubes le long des méridiens, et quatre anneaux, en un seul maillage
    var geos = [], mN = gm(K, new THREE.MeshStandardMaterial({ color: o.dedans ? "#5d6670" : "#c8cdd2", roughness: 0.4, metalness: 0.8 }));
    var sur = function (th, ph, plus) { return new THREE.Vector3((R + plus) * Math.sin(th) * Math.cos(ph), (R + plus) * Math.cos(th) * ech - bas + socle, (R + plus) * Math.sin(th) * Math.sin(ph)); };
    var plus = o.dedans ? -0.6 : 0.4;
    for (var i = 0; i < 24; i++) { var ph = i / 24 * PI * 2, pts = []; for (var k = 0; k <= 16; k++) pts.push(sur(k / 16 * tm, ph, plus)); geos.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 32, 0.35, 4, false).toNonIndexed()); }
    for (var j = 1; j <= 4; j++) { var th = j / 5 * tm, rr = (R + plus) * Math.sin(th), y = (R + plus) * Math.cos(th) * ech - bas + socle, ga = new THREE.TorusGeometry(rr, 0.3, 4, 96); ga.rotateX(PI / 2); ga.translate(0, y, 0); geos.push(ga.toNonIndexed()); }
    geos.forEach(function (x) { Object.keys(x.attributes).forEach(function (k) { if (["position", "normal", "uv"].indexOf(k) < 0) x.deleteAttribute(k); }); });
    var nerv = new THREE.Mesh(K.garder(K.gens.fusion(geos)), mN); nerv.castShadow = !o.dedans; g.add(nerv);
    geos.forEach(function (x) { x.dispose(); });
    // le socle : un anneau de béton clair, la bande des baies (le verre sombre qui court autour)
    if (!o.dedans) {
      var rb = R * Math.sin(tm);
      K.props.cylindre(g, rb * 1.01, rb * 1.03, socle, K.mat.beton({ couleur: "#d8d0bf", graine: "socle-dome", banches: 2 }), 0, socle / 2, 0, { cotes: 96 });
      var mVerre = gm(K, new THREE.MeshPhysicalMaterial({ color: "#2a3640", roughness: 0.08, metalness: 0.2, envMapIntensity: 1.6 }));
      K.props.cylindre(g, rb * 1.035, rb * 1.035, 2.6, mVerre, 0, 2.6, 0, { cotes: 96, ouvert: true });
    }
    g.rayonBase = R * Math.sin(tm);
    return g;
  }
  // une grue à tour : le mât en treillis, la flèche, le contrepoids, le câble
  function grue(K, THREE, o) {
    var g = new THREE.Group(), H = o.hauteur || 56, L = o.fleche || 46, m = gm(K, new THREE.MeshStandardMaterial({ color: o.couleur || "#d8b43a", roughness: 0.6, metalness: 0.4 }));
    var P = K.props, tr = new THREE.Group();
    for (var y = 0; y < H; y += 3) {
      [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (c) { P.boite(tr, 0.14, 3, 0.14, m, c[0] * 0.8, y + 1.5, c[1] * 0.8, { ombre: true }); });
      P.boite(tr, 1.7, 0.08, 0.08, m, 0, y + 1.5, 0.8, { rz: 0.9 }); P.boite(tr, 0.08, 0.08, 1.7, m, 0.8, y + 1.5, 0, { rx: 0.9 });
    }
    P.boite(tr, L, 0.9, 0.9, m, L / 2 - 8, H + 0.5, 0); P.boite(tr, 1.2, 4, 1.2, m, 0, H + 2.5, 0);
    P.boite(tr, 4, 2, 2.2, gm(K, new THREE.MeshStandardMaterial({ color: "#7d7a74", roughness: 0.9 })), -9, H - 0.2, 0);
    P.boite(tr, 0.04, H * 0.55, 0.04, gm(K, new THREE.MeshStandardMaterial({ color: "#222", roughness: 0.6 })), L * 0.7 - 8, H - H * 0.275, 0);
    P.fusionner(tr); g.add(tr);
    g.rotation.y = o.angle || 0;
    return g;
  }
  // la tour qu'on finit : les dalles, les poteaux, et sur sa face, l'échafaudage
  // (des tubes, des planches) ; rend .haut (la planche d'en haut : où marche l'homme)
  function tour(K, THREE, o) {
    var g = new THREE.Group(), P = K.props, N = o.etages || 11, he = 3.3, W = 24, D = 16;
    var mB = K.mat.beton({ couleur: "#b9b1a0", graine: "tour-al-dorado", banches: 3, taches: 0.7 });
    var st = new THREE.Group();
    for (var k = 0; k <= N; k++) {
      P.boite(st, W, 0.32, D, mB, 0, k * he, 0);
      if (k < N) for (var i = 0; i < 4; i++) for (var j = 0; j < 3; j++) P.boite(st, 0.5, he, 0.5, mB, -W / 2 + 1 + i * (W - 2) / 3, k * he + he / 2, -D / 2 + 1 + j * (D - 2) / 2);
    }
    P.fusionner(st); g.add(st);
    // l'échafaudage, devant la face qui regarde le Dôme (-x)
    var mT = K.mat.metal({ couleur: "#9aa0a4", rugosite: 0.45 }), mP = K.mat.bois({ couleur: "#b08a52", lames: 2, graine: "planches-ech" });
    var ech = new THREE.Group(), x0 = -W / 2 - 1.6;
    for (var zz = -W / 2; zz <= W / 2 + 0.01; zz += 2.4) { P.cylindre(ech, 0.05, 0.05, N * he + 2, mT, x0, (N * he + 2) / 2, zz, { cotes: 5 }); P.cylindre(ech, 0.05, 0.05, N * he + 2, mT, x0 + 1.1, (N * he + 2) / 2, zz, { cotes: 5 }); }
    for (var yy = 2; yy <= N * he + 1.5; yy += 2) {
      P.cylindre(ech, 0.04, 0.04, W, mT, x0, yy + 1.0, 0, { rx: PI / 2, cotes: 5 });
      P.boite(ech, 1.0, 0.06, W, mP, x0 + 0.55, yy, 0);
    }
    // des croix de saint André, de loin en loin
    for (var c = 0; c < 6; c++) P.boite(ech, 0.05, 6.2, 0.05, mT, x0, 6 + c * 5.5, -W / 2 + 2 + (c % 3) * 9, { rx: 0.7 });
    P.fusionner(ech); g.add(ech);
    // un filet de sécurité vert, déchiré, sur deux étages
    var mF = gm(K, new THREE.MeshStandardMaterial({ color: "#3d6b48", roughness: 0.9, transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
    var filet = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(W * 0.6, 6)), mF); filet.rotation.y = PI / 2; filet.position.set(x0 - 0.1, 12, -W * 0.15); g.add(filet);
    g.haut = { x: x0 + 0.55, y: Math.floor((N * he + 1.5 - 2) / 2) * 2 + 2, zMin: -W / 2 + 1, zMax: W / 2 - 1 };
    return g;
  }
  // un ouvrier en casque : le mannequin, et un casque blanc posé sur la tête
  function ouvrier(K, THREE, graine, couleur) {
    var m = K.gens.mannequin({ tenue: "blouson", couleur: couleur || "#c9b089", couleur2: "#5a5a55", graine: graine });
    var casque = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.13, 12, 8, 0, PI * 2, 0, PI / 2)), gm(K, new THREE.MeshStandardMaterial({ color: "#f2f0e6", roughness: 0.4 })));
    casque.position.set(0, 0.17, 0.0); m.os.tete.add(casque);
    var bord = new THREE.Mesh(K.garder(new THREE.CylinderGeometry(0.15, 0.15, 0.015, 14)), casque.material); bord.position.set(0, 0.17, 0.02); m.os.tete.add(bord);
    return m;
  }

  // ─── DEHORS : L'ESPLANADE, LE DÔME, LA TOUR ────────────────────────────────
  function dehors(K, ctx, tex) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: { zenith: "#5a87b8", horizon: "#ece0c4", lueur: "#fff3dc", lueurDir: [0.35, -1], force: 0.9 },
      brouillard: ["#e6dbc2", 0.0026], environnement: { fenetres: 0, lampes: [{ pos: [60, 160, -120], couleur: "#fff6e0", intensite: 12, taille: 18 }] }, reflets: 1.0,
      ambiance: ["#d6dee6", "#a88f66", 0.85] });
    var sol = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(900, 900)), gm(K, new THREE.MeshStandardMaterial({ map: tex.dalles, roughness: 0.92, metalness: 0 })));
    sol.rotation.x = -PI / 2; sol.receiveShadow = true; s.add(sol);
    var d = dome(K, THREE, { peau: tex.peau }); s.add(d);
    var g1 = grue(K, THREE, { hauteur: 58, fleche: 48, angle: 0.6 }); g1.position.set(-82, 0, -30); s.add(g1);
    var g2 = grue(K, THREE, { hauteur: 64, fleche: 52, angle: -2.2, couleur: "#cfa83a" }); g2.position.set(150, 0, 30); s.add(g2);
    var to = tour(K, THREE, { etages: 11 }); to.position.set(190, 0, 75); s.add(to);
    // les casques de la tour : trois ouvriers sur l'échafaudage
    var ouv = [0, 1, 2].map(function (i) { var m = ouvrier(K, THREE, "ouvrier-dehors" + i); m.groupe.scale.setScalar(1); to.add(m.groupe); return m; });
    // le panneau de pharmacie, sur son mât, au bord de l'esplanade
    var pan = new THREE.Group(); pan.position.set(-14, 0, 118); pan.rotation.y = 0.5; s.add(pan);
    P.cylindre(pan, 0.12, 0.12, 5, K.mat.metal({ couleur: "#555a5e" }), 0, 2.5, 0, { cotes: 8 });
    P.boite(pan, 2.4, 1.3, 0.25, K.mat.metal({ couleur: "#2a2c2e", rugosite: 0.5 }), 0, 5.4, 0);
    var ep = ecranPanneau(K);
    var faceP = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(2.2, 1.1)), gm(K, new THREE.MeshBasicMaterial({ map: ep.texture, color: new THREE.Color(1, 1, 1).multiplyScalar(1.6), toneMapped: false })));
    faceP.position.set(0, 5.4, 0.13); pan.add(faceP);
    // des palmiers maigres le long de l'allée
    var mTronc = gm(K, new THREE.MeshStandardMaterial({ color: "#8a7458", roughness: 0.9 })), mPalme = gm(K, new THREE.MeshStandardMaterial({ color: "#6d7a48", roughness: 0.8, side: THREE.DoubleSide }));
    var palm = new THREE.Group();
    for (var i = 0; i < 8; i++) {
      var px = (i % 2 ? 16 : -26), pz = 150 - i * 16;
      P.cylindre(palm, 0.18, 0.28, 8, mTronc, px, 4, pz, { cotes: 6 });
      for (var f = 0; f < 7; f++) { var pa = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.7, 3.6)), mPalme); pa.position.set(px, 8, pz); pa.rotation.set(1.0, f / 7 * PI * 2, 0, "YXZ"); pa.translateY(1.6); palm.add(pa); }
    }
    P.fusionner(palm); s.add(palm);
    // le soleil, derrière le Dôme, en haut à droite : un contre-jour blanc ; les ombres viennent vers nous
    var soleil = new THREE.DirectionalLight("#fff1d6", 3.0);
    soleil.position.set(190, 190, -300); soleil.target.position.set(0, 0, 40); s.add(soleil); s.add(soleil.target);
    var q = K.qualite || {};
    if (q.ombres) {
      soleil.castShadow = true; soleil.shadow.mapSize.set(2048, 2048); soleil.shadow.bias = -0.0006; soleil.shadow.normalBias = 0.05;
      var sc = soleil.shadow.camera; sc.left = -220; sc.right = 220; sc.top = 220; sc.bottom = -220; sc.near = 50; sc.far = 900; sc.updateProjectionMatrix();
    }
    var disque = K.look.halo({ couleur: "#fffaf0", taille: 60, intensite: 1.3, coeur: 0.05 }); disque.position.set(190, 190, -300); s.add(disque);
    var eclatSoleil = K.look.eclat({ couleur: "#fff4e0", largeur: 260, hauteur: 2.2, intensite: 0.5 }); eclatSoleil.position.set(190, 190, -299); s.add(eclatSoleil);
    // la poussière dans le soleil, au premier plan
    var poussiere = K.particules.poussiere({ n: 1600, zone: { min: [-26, 0.3, 100], max: [10, 9, 170] }, couleur: "#fff2d8", opacite: 1, taille: 0.05,
      lumieres: [{ pos: [-10, 30, 140], couleur: "#fff0d0", intensite: 1.4, rayon: 60 }] });
    s.add(poussiere);
    // la chaleur : une nappe claire qui tremble au ras de l'esplanade, au loin
    var mMirage = gm(K, new THREE.MeshBasicMaterial({ color: new THREE.Color("#fff6e4"), transparent: true, opacity: 0.18, depthWrite: false, fog: false }));
    var mirage = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(700, 3.5)), mMirage); mirage.position.set(0, 1.2, 40); s.add(mirage);
    return {
      scene: s, tour: to, look: { bloom: 0.5, rayon: 0.6, seuil: 0.94, exposition: 0.8, contraste: 1.12, saturation: 0.86, noirs: 0.025 },
      maj: function (t, c) {
        ep.maj(t); poussiere.maj(t);
        mirage.position.y = 1.1 + Math.sin(t * 3.1) * 0.08; mMirage.opacity = 0.14 + 0.05 * Math.sin(t * 5.3);
        // les ouvriers : l'un marche le long d'une planche, les autres travaillent
        var h = to.haut;
        ouv[0].marche(t, 0.9); ouv[0].groupe.position.set(h.x, h.y - 6, K.mix(h.zMin, h.zMax, 0.5 + 0.45 * Math.sin(t * 0.07))); ouv[0].groupe.rotation.y = 0;
        ouv[1].tirer(t, 0.6); ouv[1].groupe.position.set(h.x, h.y - 16, -4); ouv[1].groupe.rotation.y = -PI / 2;
        ouv[2].repos(t); ouv[2].groupe.position.set(h.x, h.y - 24, 6); ouv[2].groupe.rotation.y = -PI / 2;
      }
    };
  }

  // ─── DEDANS : LA PELOUSE, LES GRADINS BLANCS, LA BRUME FROIDE ──────────────
  function dedans(K, ctx, tex) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: false, fond: "#cfdbe6", environnement: { zenith: "#e9f1f8", horizon: "#b8c6d2", lueur: "#ffffff", fenetres: 0,
      lampes: [{ pos: [0, 80, 0], couleur: "#f4f8ff", intensite: 6, taille: 30 }] }, reflets: 0.8,
      ambiance: ["#eef4fb", "#56654f", 1.1], brouillard: ["#dfe8ef", 0.006] });
    var voute = dome(K, THREE, { peau: tex.peauDedans, dedans: true, rayon: 92 }); voute.position.y = 0; s.add(voute);
    var pel = P.pelouse({ boue: 0 }); pel.position.set(0, 0.02, 0); s.add(pel);
    var cages = [P.but(), P.but()]; cages[0].position.set(0, 0.02, -52.5); cages[1].position.set(0, 0.02, 52.5); cages[1].rotation.y = PI; cages.forEach(function (c) { s.add(c); });
    // les gradins blancs, vides : deux tribunes, en face et derrière le but
    // des réclames inventées (Gazéo est le commanditaire du livre)
    var noms = ["GAZÉO", "AL-DORADO 2030", "LE DÔME · 20 °C", "MONDIAL D'HIVER", "GAZÉO", "AL-DORADO 2030"];
    var t1 = P.tribune({ largeur: 96, rangs: 22, couleurs: ["#e9ecee", "#d4dade"], toit: false, grillage: false, panneaux: noms, graine: "dome-est" });
    t1.rotation.y = -PI / 2; t1.position.set(37, 0, 0); s.add(t1);
    var t2 = P.tribune({ largeur: 64, rangs: 22, couleurs: ["#dde2e6", "#e9ecee"], toit: false, grillage: false, panneaux: noms, graine: "dome-nord" });
    t2.position.set(0, 0, -56); s.add(t2);
    // la brume froide : des bouches au ras de l'herbe, le long de la touche
    var mGr = gm(K, new THREE.MeshStandardMaterial({ map: tex.grille, roughness: 0.4, metalness: 0.6 }));
    var brumes = [];
    for (var i = 0; i < 6; i++) {
      var z = -40 + i * 16;
      P.boite(s, 0.5, 0.35, 3.0, mGr, 35.2, 0.18, z);
      var b = K.particules.fumee({ n: 34, source: [34.6, 0.25, z], vent: [-1.1, 0.0], montee: 0.04, vie: 7, taille: 2.2, etalement: 2.2, couleur: "#eef6ff", lueur: "#ffffff", opacite: 0.16, graine: "brume" + i });
      s.add(b); brumes.push(b);
    }
    // les Cobalts à l'entraînement : un toro au milieu de la pelouse (un ballon, quatre autour, un dedans)
    var joueurs = [];
    for (var j = 0; j < 5; j++) {
      var m = K.gens.mannequin({ tenue: "survetement", couleur: "#1f3f94", couleur2: "#16285e", graine: "cobalt" + j });
      s.add(m.groupe); joueurs.push(m);
    }
    var ballon = P.ballon({ rayon: 0.11 }); s.add(ballon);
    // la lumière : le jour qui passe par la peau du Dôme, blanc, sans ombre franche
    var jour = new THREE.DirectionalLight("#f3f8ff", 1.6); jour.position.set(-30, 90, 40); jour.target.position.set(0, 0, 0); s.add(jour); s.add(jour.target);
    return {
      scene: s, look: { bloom: 0.45, rayon: 0.5, seuil: 0.93, exposition: 0.92, contraste: 1.04, saturation: 0.78, noirs: 0.015 },
      maj: function (t) {
        brumes.forEach(function (b) { b.maj(t); });
        // le toro : quatre en carré, le ballon qui va de l'un à l'autre, celui du milieu qui court après
        var C = [6, 0, 10], coins = [[-4, -4], [4, -4], [4, 4], [-4, 4]], per = 1.15, k = Math.floor(t / per), u = (t / per) % 1;
        var a = coins[k % 4], bb = coins[(k + 1 + (k % 3 === 0 ? 1 : 0)) % 4];
        for (var q = 0; q < 4; q++) { var jq = joueurs[q]; jq.repos(t + q); jq.groupe.position.set(C[0] + coins[q][0], 0, C[2] + coins[q][1]); jq.groupe.rotation.y = Math.atan2(-coins[q][0], -coins[q][1]); }
        var bx = K.mix(a[0], bb[0], K.lisse(0, 1, u)), bz = K.mix(a[1], bb[1], K.lisse(0, 1, u));
        ballon.position.set(C[0] + bx, 0.11 + Math.sin(u * PI) * 0.15, C[2] + bz); ballon.rotation.x = t * 6;
        var mid = joueurs[4]; mid.marche(t, 2.4);
        mid.groupe.position.set(C[0] + bx * 0.45, 0, C[2] + bz * 0.45); mid.groupe.rotation.y = Math.atan2(bx, bz) * 0.6;
      }
    };
  }

  // ─── LE BANC : LA CLIMATISATION JUSQUE SOUS LES SIÈGES ─────────────────────
  function banc(K, ctx, tex) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: false, fond: "#c9d6e2", environnement: { zenith: "#eef4fa", horizon: "#b9c7d4", lueur: "#ffffff", fenetres: 0, lampes: [{ pos: [0, 60, 0], couleur: "#f4f8ff", intensite: 5, taille: 25 }] },
      reflets: 0.9, ambiance: ["#eef4fb", "#51604a", 0.9], brouillard: ["#d9e4ec", 0.012] });
    var pel = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(40, 40)), K.mat.pelouse({ bandes: 12, boue: 0, repete: [3, 3] })); pel.rotation.x = -PI / 2; s.add(pel);
    var mBeton = K.mat.beton({ couleur: "#d4d2cc", graine: "banc-sol", banches: 0 });
    P.boite(s, 12, 0.2, 3, mBeton, 0, 0.1, -1.5);
    // l'abri : un toit de verre teinté, des montants
    var mMont = K.mat.metal({ couleur: "#c4c9cd", rugosite: 0.3 });
    [-5.8, 5.8].forEach(function (x) { P.boite(s, 0.08, 2.2, 0.08, mMont, x, 1.2, -2.6); P.boite(s, 0.08, 2.0, 0.08, mMont, x, 1.1, 0.4); });
    var mToit = gm(K, new THREE.MeshPhysicalMaterial({ color: "#9fb8cc", roughness: 0.1, transparent: true, opacity: 0.35, envMapIntensity: 1.4, side: THREE.DoubleSide, depthWrite: false }));
    var toit = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(12, 3.4)), mToit); toit.rotation.x = -PI / 2 + 0.12; toit.position.set(0, 2.25, -1.1); s.add(toit);
    // les sièges baquets, blancs, et sous chacun la bouche d'air
    var mSiege = gm(K, new THREE.MeshStandardMaterial({ color: "#1c2433", roughness: 0.5 })), mGr = gm(K, new THREE.MeshStandardMaterial({ map: tex.grille, roughness: 0.4, metalness: 0.6 }));
    var rubans = [], brumes = [], mRuban = gm(K, new THREE.MeshStandardMaterial({ color: GLACE, roughness: 0.6, side: THREE.DoubleSide, emissive: new THREE.Color("#a8c4e0"), emissiveIntensity: 0.15 }));
    for (var i = 0; i < 7; i++) {
      var x = -4.5 + i * 1.5;
      var sg = new THREE.Group(); sg.position.set(x, 0.2, -1.6); s.add(sg);
      P.boite(sg, 0.55, 0.08, 0.5, mSiege, 0, 0.45, 0); P.boite(sg, 0.55, 0.65, 0.08, mSiege, 0, 0.8, -0.26, { rx: -0.12 });
      P.boite(sg, 0.06, 0.45, 0.06, mMont, 0, 0.22, -0.05);
      P.boite(sg, 0.5, 0.2, 0.04, mGr, 0, 0.12, 0.24);
      // deux rubans noués à la grille : ils battent dans le souffle
      for (var r = 0; r < 2; r++) {
        var gr = new THREE.PlaneGeometry(0.04, 0.32, 1, 8); gr.translate(0, -0.16, 0); K.garder(gr);
        var rb = new THREE.Mesh(gr, mRuban); rb.position.set(-0.12 + r * 0.24, 0.2, 0.27); sg.add(rb); rubans.push({ m: rb, g: gr, i: i * 2 + r, base: gr.attributes.position.array.slice() });
      }
      var b = K.particules.fumee({ n: 14, source: [x, 0.36, -1.3], vent: [0.0, 0.55], montee: 0.03, vie: 4, taille: 0.6, etalement: 0.35, couleur: "#f2f8ff", lueur: "#ffffff", opacite: 0.18, graine: "brume-banc" + i });
      s.add(b); brumes.push(b);
    }
    // le petit afficheur, sur le montant
    var eb = ecranBanc(K);
    var aff = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.34, 0.13)), gm(K, new THREE.MeshBasicMaterial({ map: eb.texture, toneMapped: false, color: new THREE.Color(1, 1, 1).multiplyScalar(1.3) })));
    aff.position.set(5.72, 1.55, 0.45); aff.rotation.y = -0.6; s.add(aff);
    P.boite(s, 0.42, 0.2, 0.06, K.mat.metal({ couleur: "#2a2c2e" }), 5.75, 1.55, 0.42, { ry: -0.6 });
    // derrière, les gradins blancs, flous de brume
    var tr = P.tribune({ largeur: 40, rangs: 14, couleurs: ["#e7eaec", "#d6dbdf"], toit: false, grillage: false, panneaux: false, graine: "banc-tribune" });
    tr.position.set(0, 0, -5.4); s.add(tr);
    var jour = new THREE.DirectionalLight("#f3f8ff", 1.5); jour.position.set(-8, 30, 18); jour.target.position.set(0, 0, -1); s.add(jour); s.add(jour.target);
    return {
      scene: s, look: { bloom: 0.4, rayon: 0.5, seuil: 0.96, exposition: 0.88, contraste: 1.1, saturation: 0.82, noirs: 0.02 },
      maj: function (t) {
        eb.maj(t);
        brumes.forEach(function (b) { b.maj(t); });
        rubans.forEach(function (ru) {
          var p = ru.g.attributes.position, b0 = ru.base;
          for (var k = 0; k < p.count; k++) {
            var y = b0[k * 3 + 1], d = -y / 0.26;
            p.setZ(k, b0[k * 3 + 2] + d * d * 0.22 + Math.sin(t * 17 + ru.i + d * 6) * 0.025 * d);
            p.setX(k, b0[k * 3] + Math.sin(t * 11 + ru.i * 2 + d * 4) * 0.02 * d);
          }
          p.needsUpdate = true;
        });
      }
    };
  }

  // ─── LE COULOIR VITRÉ ──────────────────────────────────────────────────────
  // Le couloir va vers -z ; la baie est à droite (x = +1,6), elle regarde la ville.
  // Dehors, au loin (≈ 190 m), en biais : la tour et son échafaudage, qu'on découvre en
  // tournant vers la baie ; l'homme marche en haut.
  function couloir(K, ctx, tex) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: { zenith: "#5c87b6", horizon: "#e6dcc4", lueur: "#fff3dc", lueurDir: [-1, 0.3], force: 0.5 }, brouillard: ["#e3d8c0", 0.0011],
      environnement: { fenetres: 0, lampes: [{ pos: [200, 120, -60], couleur: "#fff4dc", intensite: 9, taille: 30 }, { pos: [-20, 30, 0], couleur: "#dfeaff", intensite: 2, taille: 10 }] }, reflets: 1.0,
      ambiance: ["#cfdbe8", "#8a7a60", 0.5] });
    var L = 60;
    // le sol poli, sombre, qui reflète la baie ; le plafond, son ruban de diodes froides
    var mSol = gm(K, new THREE.MeshStandardMaterial({ color: "#3a3e43", roughness: 0.12, metalness: 0.0, envMapIntensity: 1.4 }));
    var sol = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(3.2, L)), mSol); sol.rotation.x = -PI / 2; sol.position.set(0, 0, -L / 2); sol.receiveShadow = true; s.add(sol);
    var mMur = gm(K, new THREE.MeshStandardMaterial({ color: "#e8ecef", roughness: 0.5 }));
    var mur = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(L, 3.6)), mMur); mur.rotation.y = PI / 2; mur.position.set(-1.6, 1.8, -L / 2); mur.receiveShadow = true; s.add(mur);
    var plaf = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(3.2, L)), gm(K, new THREE.MeshStandardMaterial({ color: "#cfd5da", roughness: 0.7 }))); plaf.rotation.x = PI / 2; plaf.position.set(0, 3.6, -L / 2); s.add(plaf);
    var ruban = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.12, L)), K.mat.lumiere({ couleur: "#eaf2ff", intensite: 2.2 })); ruban.rotation.x = PI / 2; ruban.position.set(-0.6, 3.59, -L / 2); s.add(ruban);
    // le bout du couloir : un mur, une porte de service sombre
    var bout = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(3.2, 3.6)), mMur); bout.position.set(0, 1.8, -L); s.add(bout);
    P.boite(s, 1.1, 2.2, 0.06, K.mat.metal({ couleur: "#3a4048", rugosite: 0.5 }), -0.4, 1.1, -L + 0.04);
    // la baie : un vitrage du sol au plafond, des meneaux tous les trois mètres
    var mVerre = gm(K, new THREE.MeshPhysicalMaterial({ color: "#c9d6dc", roughness: 0.04, metalness: 0, transparent: true, opacity: 0.12, envMapIntensity: 1.2, depthWrite: false, side: THREE.DoubleSide }));
    var verre = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(L, 3.6)), mVerre); verre.rotation.y = -PI / 2; verre.position.set(1.6, 1.8, -L / 2); s.add(verre);
    var mMen = K.mat.metal({ couleur: "#3c4146", rugosite: 0.4 }), men = new THREE.Group();
    for (var z = 0; z >= -L; z -= 3) P.boite(men, 0.1, 3.6, 0.12, mMen, 1.6, 1.8, z);
    P.boite(men, 0.14, 0.1, L, mMen, 1.6, 0.05, -L / 2); P.boite(men, 0.14, 0.12, L, mMen, 1.6, 3.55, -L / 2);
    P.fusionner(men); s.add(men);
    // dehors : l'esplanade blanche, l'horizon, la tour et ses grues
    var solD = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(1200, 1200)), gm(K, new THREE.MeshStandardMaterial({ map: tex.dalles, roughness: 0.95 }))); solD.rotation.x = -PI / 2; solD.position.set(300, -0.6, -60); solD.receiveShadow = true; s.add(solD);
    var hz = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(1400, 160)), gm(K, new THREE.MeshBasicMaterial({ map: tex.horizon, transparent: true, depthWrite: false, fog: false, color: new THREE.Color(1, 1, 1).multiplyScalar(0.95) })));
    hz.rotation.y = -PI / 2; hz.position.set(650, 70, -60); s.add(hz);
    var to = tour(K, THREE, { etages: 11 }); to.position.set(150, -0.6, -130); s.add(to);
    var g1 = grue(K, THREE, { hauteur: 64, fleche: 52, angle: 2.4, couleur: "#cfa83a" }); g1.position.set(118, -0.6, -98); s.add(g1);
    var g2 = grue(K, THREE, { hauteur: 58, fleche: 46, angle: -0.5 }); g2.position.set(215, -0.6, -175); s.add(g2);
    // le gilet orange des chantiers : la seule couleur vive, là-haut, au téléobjectif
    var homme = ouvrier(K, THREE, "homme-planche", "#f0782a"); to.add(homme.groupe);
    var autre = ouvrier(K, THREE, "homme-dessous", "#b8a07a"); to.add(autre.groupe);
    // le soleil entre par la baie : les meneaux dessinent leurs ombres sur le sol poli
    var soleil = new THREE.DirectionalLight("#fff0d4", 2.6);
    soleil.position.set(60, 46, -12); soleil.target.position.set(0, 0, -24); s.add(soleil); s.add(soleil.target);
    var q = K.qualite || {};
    if (q.ombres) {
      soleil.castShadow = true; soleil.shadow.mapSize.set(2048, 2048); soleil.shadow.bias = -0.0005; soleil.shadow.normalBias = 0.02;
      var sc = soleil.shadow.camera; sc.left = -36; sc.right = 36; sc.top = 20; sc.bottom = -20; sc.near = 20; sc.far = 140; sc.updateProjectionMatrix();
      men.traverse(function (o) { if (o.isMesh) o.castShadow = true; });
    }
    // les plafonniers froids : trois lumières le long du couloir
    var lums = [-6, -18, -30].map(function (z) { var l = K.look.ponctuelle({ couleur: "#e6efff", intensite: 4, portee: 9 }); l.position.set(-0.4, 3.2, z); s.add(l); return l; });
    // où est l'homme à t (dans la tour, puis dans le monde) : la caméra le vise sans lire l'image d'avant
    var h = to.haut;
    function zHomme(t) { return K.mix(h.zMax - 2, h.zMin + 4, K.rampe(24, 46, t)); }
    return {
      scene: s, tour: to, homme: homme,
      posHomme: function (t) { return [to.position.x + h.x, to.position.y + h.y, to.position.z + zHomme(t)]; },
      look: { bloom: 0.45, rayon: 0.55, seuil: 0.94, exposition: 0.74, contraste: 1.14, saturation: 0.86, noirs: 0.025 },
      maj: function (t) {
        // l'homme marche le long de la planche du haut, lentement, vers le bout ; l'autre travaille
        homme.marche(t * 0.8, 0.8); homme.groupe.position.set(h.x, h.y, zHomme(t)); homme.groupe.rotation.y = PI;
        autre.tirer(t, 0.5); autre.groupe.position.set(h.x, h.y - 8, 3); autre.groupe.rotation.y = -PI / 2;
      }
    };
  }

  FC.film({
    id: "baie_vitree",
    livre: "mondial_hiver",
    titre: "La baie vitrée",
    duree: 40.5,
    musique: "livre_h9",
    secours: "match",
    couleur: GLACE,
    affiche: 35.6,
    habillage: { vignette: 0.48, grain: 0.06, ratioPaysage: 2.35, ratioPortrait: 0 },
    sortie: { noir: 1.4 },
    // la porte qui retombe derrière soi (le froid), le carillon des haut-parleurs
    sons: [[11.62, "porte"], [12.3, "nouvelle"]],
    textes: [
      { sorte: "lieu", de: 0.9, a: 5.9, texte: "Al-Dorado, le Dôme", sous: "Décembre 2030 · trente-neuf degrés dehors" },
      { sorte: "replique", de: 12.6, a: 18.2, qui: "Les haut-parleurs du Dôme", texte: "Bienvenue sous le Dôme : vingt degrés. Pour votre confort, ne stationnez pas devant les baies." },
      { sorte: "titre", de: 35.8, a: 40.2, texte: "Al-Dorado · 2030", sous: "Vingt degrés dedans", entree: 0.2, sortie: 0.7 }
    ],
    montages: { court: [[0.3, 5.6], [6.4, 10.4], [11.6, 17.9], [19.0, 22.4], [24.2, 28.2], [33.4, 40.2]] },
    preparer: function (K, ctx) {
      var tex = { peau: toilePeau(K, false), peauDedans: toilePeau(K, true), dalles: toileDalles(K), grille: toileGrille(K), horizon: toileHorizon(K) };
      return K.etapes(ctx, [
        function () { ctx.decors.dehors = dehors(K, ctx, tex); },
        function () { ctx.decors.dedans = dedans(K, ctx, tex); },
        function () { ctx.decors.banc = banc(K, ctx, tex); },
        function () { ctx.decors.couloir = couloir(K, ctx, tex); }
      ]);
    },
    plans: [
      // 1 · l'esplanade, au ras du sol : le Dôme dans la chaleur blanche
      { de: 0, a: 6.2, decor: "dehors", entree: "noir", transition: 1.4, fixe: 4.0,
        camera: { pos: K_cles([[0, [-22, 1.2, 175]], [6.2, [-17, 1.9, 150]]], "lin"), cible: K_cles([[0, [0, 20, 0]], [6.2, [6, 22, 0]]], "lin"), fov: 46, epaule: 0.06 },
        cadrage: { portrait: { x: 0.05 } } },
      // 2 · le panneau de pharmacie, puis la tour qu'on finit, son échafaudage, les casques
      { de: 6.2, a: 11.6, decor: "dehors", entree: "coupe", fixe: 3.6,
        camera: { pos: K_cles([[0, [-20, 2.6, 128]], [5.4, [-18, 3.6, 126]]], "douce"), cible: K_cles([[0, [-14, 5.3, 118]], [2.9, [-14, 5.4, 118]], [5.4, [170, 22, 75]]], "douce"), fov: K_cles([[0, 30], [2.9, 28], [5.4, 13]], "douce"), epaule: 0.08 } },
      // 3 · dedans : la pelouse parfaite, les gradins blancs, la brume, les Cobalts
      { de: 11.6, a: 18.6, decor: "dedans", entree: "flash", fixe: 4.0,
        camera: { pos: K_cles([[0, [-30, 9, 34]], [7.0, [-27, 8, 26]]], "lin"), cible: K_cles([[0, [12, 2, -6]], [7.0, [14, 3, -10]]], "lin"), fov: 54, epaule: 0.05 } },
      // 4 · le banc : la brume sous les sièges, les rubans, vingt degrés
      { de: 18.6, a: 23.8, decor: "banc", entree: "coupe", fixe: 2.8,
        camera: { pos: K_cles([[0, [1.6, 0.75, 1.6]], [5.2, [3.6, 1.2, 2.2]]], "douce"), cible: K_cles([[0, [-1.0, 0.45, -1.4]], [5.2, [5.6, 1.45, 0.45]]], "douce"), fov: K_cles([[0, 44], [5.2, 30]]), epaule: 0.1 } },
      // 5 · le couloir vitré : le sol poli, les ombres des meneaux, la ville blanche derrière la vitre
      { de: 23.8, a: 31.6, decor: "couloir", entree: "noir", transition: 0.9, fixe: 4.0,
        camera: { pos: K_cles([[0, [-0.6, 1.6, 2]], [7.8, [0.2, 1.62, -10.5]]], "lin"), cible: K_cles([[0, [1.0, 1.4, -16]], [3.0, [2.2, 1.6, -20]], [7.8, [15.6, 3.4, -23]]], "douce"), fov: 52, epaule: 0.08 },
        cadrage: { portrait: { x: 0.25 } } },
      // 6 · à travers la baie, au téléobjectif : l'échafaudage, l'homme debout là-haut ; le titre
      { de: 31.6, a: 40.5, decor: "couloir", entree: "coupe", fixe: 4.6,
        // la ligne de visée passe la vitre entre deux meneaux (z = -15 et -18)
        camera: { pos: K_cles([[0, [0.5, 1.65, -15.5]], [8.9, [0.9, 1.66, -15.9]]], "lin"),
          // l'homme au tiers gauche, au-dessus du milieu : le titre, centré, ne le couvre pas
          cible: function (l, p, c) { var h = c.decors.couloir.posHomme(c.t); return K_mix3([128, 24, -112], [h[0], h[1] - 0.6, h[2] + 3.0], K_aisance("douce")(Math.min(1, l / 6.5))); },
          fov: K_cles([[0, 40], [6.5, 4.2]], "douce"), epaule: 0.02, frequence: 0.6 } }
    ]
  });

  function K_() { return FC.kit; }
  function K_cles(p, a) { var f = null; return function (t) { if (!f) f = K_().cles(p, a); return f(t); }; }
  function K_aisance(n) { return K_().aisance(n); }
  function K_mix3(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
})(typeof window !== "undefined" ? window : this);
