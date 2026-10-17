/* ═══════════════════════════════════════════════════════════════════════════
   « La dernière sirène » — livre 3, « La Sirène » (1990, le joueur, la pépite ;
   la couleur du livre : #FF9A3C). Docs : docs/design/cinematiques.md.

   Le 24 décembre 1990, seize heures : la Tréfilerie ferme. Toute la ville est au
   grillage, les ouvriers sortent avec leurs casiers vidés, la sirène de la tour de
   la grande halle sonne une dernière fois (la carte jp.h3.s0_sirene*, S0 créneaux
   10-11 ; content/ville/films_h3.yaml). Le film passe APRÈS la carte : la scène
   jouée du grillage (cinematiques_h3.yaml, h3.ci.derniere_sirene) a montré la veille
   de la sirène, à quinze heures cinquante ; la carte, la sirène et la mère qui cherche
   un visage ; le film, ce que la sirène emporte : la dernière note, les lampes du
   bâtiment C qui s'éteignent, la pointeuse, le portail qu'on enchaîne. Il ne devance
   rien : ni la tour la nuit, ni Didier, ni la clé, ni la vente aux enchères.

   LES PLANS (38 s ; la musique : livre_h3, « Seize heures » ; au tournage, la section
   `creux` — « la dernière sirène : elle tombe sur la machine qui ralentit, puis la
   halle vide, un cœur de grosse caisse »)
     1   0,0– 5,2  le grillage, du milieu de la foule : des centaines de dos en manteau
                   d'hiver, la Tréfilerie dans la brume, le soleil bas derrière la tour ;
                   la caméra s'élève, recule, et finit serrée sur le haut de la tour (la
                   brume se lève un peu). Carton : « La Tréfilerie, Aubérive /
                   24 décembre 1990 · 16 h ». (Le lieu, la ville entière, la sirène qui monte.)
     2   5,2– 9,2  la tour : la sirène en contre-plongée sur le ciel blanc, le rotor dans
                   ses fentes, le voyant orange, les pigeons qui partent, le givre qui
                   tombe. (Elle sonne, une dernière fois.)
     3   9,2–14,0  le portail : le gardien de dos, sa boîte en carton ; les ouvrières et
                   les ouvriers du bâtiment C sortent à contre-jour, leur casier dans les
                   bras, et y laissent tomber leur clé. Le gardien : « Les clés des
                   casiers, là-dedans. Ils comptent les clés, pas les gens. »
     4  14,0–18,2  le bâtiment C, dedans : les rangées de lampes s'éteignent l'une après
                   l'autre, du fond vers la caméra ; les tambours des tréfileuses
                   ralentissent. (La machine s'arrête : le cœur de la musique.)
     5  18,2–23,6  la pointeuse, sous son applique : l'horloge à quatre heures deux (la
                   grande aiguille saute d'une minute), les cartes dans leurs cases ; la
                   caméra glisse jusqu'à celle de ta mère : ton nom de famille, « BÂT. C ».
     6  23,6–28,4  de la cour, à travers le grillage, en contre-plongée : le premier rang,
                   les bras levés, les mains hautes sur les mailles, à contre-jour sur le
                   ciel du soir ; elles lâchent une à une ; au loin, un lampadaire du
                   parking s'allume ; la première neige. (Le silence après.)
     7  28,4–32,4  la chaîne : le portail fermé, le cadenas qui claque ; derrière le
                   treillis, le gardien repart vers sa loge.
     8  32,4–38,0  la Tréfilerie au crépuscule, la foule qui s'en va, la sirène muette, la
                   cheminée sans fumée, la neige sous le sodium ; « Aubérive · 1990 /
                   La Sirène ».
   La coupe de 30 s (l'aperçu de l'App Store) : les huit plans, resserrés.
   La lumière : un jour d'hiver gris, bas, de biais ; le soleil voilé derrière la tour
   (contre-jour), la brume ; puis le crépuscule bleu. L'accent, l'orange du livre : la
   lumière du bâtiment C par sa grande porte, le voyant de la sirène, puis le sodium du
   parking. Les visages : jamais ; des dos, des mains, des silhouettes à contre-jour. La
   réplique est au neutre (le gardien parle aux ouvriers, pas au héros).
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var FC = global.FusibleCinema;
  var PI = Math.PI;
  var ORANGE = "#FF9A3C";

  // le nom de famille du héros (la carte de pointage de sa mère)
  function nomDeFamille(heros) {
    var n = String((heros && heros.nom) || "").trim().split(/\s+/);
    var f = n.length ? n[n.length - 1] : "";
    return (f || "Vasseur").toUpperCase();
  }
  function lumiereHemi(s) { var h = null; s.children.forEach(function (c) { if (c.isHemisphereLight) h = c; }); return h; }
  function cielDe(s) { var m = null; s.children.forEach(function (c) { if (c.material && c.material.uniforms && c.material.uniforms.uZenith) m = c.material; }); return m; }

  // ─── LES PIÈCES ──────────────────────────────────────────────────────────
  // une vitre d'usine : de petits carreaux sertis de fer, certains allumés, d'autres
  // crevés ou encrassés → { map, lumiere }
  function vitresUsine(K, o) {
    var W = 256, H = 192, c = K.tex.canvas(W, H), x = c.getContext("2d"), l = K.tex.canvas(W, H), lx = l.getContext("2d");
    var r = K.alea(o.graine || "vitres"), co = o.colonnes || 6, ra = o.rangees || 5;
    x.fillStyle = "#121314"; x.fillRect(0, 0, W, H); lx.fillStyle = "#000"; lx.fillRect(0, 0, W, H);
    var pw = W / co, ph = H / ra;
    for (var j = 0; j < ra; j++) for (var i = 0; i < co; i++) {
      var X = i * pw + 3, Y = j * ph + 3, w = pw - 6, h = ph - 6, v = r();
      if (v < (o.casses || 0)) { x.fillStyle = "#050506"; x.fillRect(X, Y, w, h); continue; }
      var allume = r() < (o.allumees || 0);
      x.fillStyle = allume ? "#2c2a27" : K.css([0.3 + r() * 0.1, 0.32 + r() * 0.1, 0.34 + r() * 0.1]); x.fillRect(X, Y, w, h);
      if (allume) { var k = 0.5 + r() * 0.5; lx.fillStyle = K.css(o.teinte || "#FFB25E", k); lx.fillRect(X, Y, w, h); }
      x.fillStyle = "rgba(20,16,12,0.35)"; x.fillRect(X, Y + h * 0.7, w, h * 0.3);
    }
    return { map: K.tex.texture(c, { clamp: true }), lumiere: K.tex.texture(l, { clamp: true }) };
  }
  function planVitre(K, THREE, w, h, tv, k) {
    var m = K.garder(new THREE.MeshStandardMaterial({ map: tv.map, emissive: new THREE.Color("#ffffff"), emissiveMap: tv.lumiere, emissiveIntensity: k == null ? 1.6 : k, roughness: 0.25, metalness: 0.3 }));
    return new THREE.Mesh(K.garder(new THREE.PlaneGeometry(w, h)), m);
  }
  // la sirène : le mât, le moteur, le tambour fendu (le rotor tourne derrière les fentes),
  // le chapeau, la boîte de commande et son voyant ; → Group, .maj(vitesse 0..1, t)
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
    var mTamb = K.garder(new THREE.MeshStandardMaterial({ color: "#5c6461", roughness: 0.55, metalness: 0.55, alphaMap: K.tex.texture(ca, { donnee: true }), alphaTest: 0.5, side: THREE.DoubleSide }));
    var tamb = new THREE.Mesh(K.garder(new THREE.CylinderGeometry(0.46, 0.46, 0.4, 32, 1, true)), mTamb); tamb.position.y = 2.92; g.add(tamb);
    var cr = K.tex.canvas(256, 32), rx = cr.getContext("2d");
    rx.fillStyle = "#151717"; rx.fillRect(0, 0, 256, 32);
    for (var b = 0; b < 8; b++) { rx.fillStyle = "#9da19b"; rx.fillRect(b * 32 + 4, 0, 10, 32); }
    var mRot = K.garder(new THREE.MeshStandardMaterial({ map: K.tex.texture(cr, {}), roughness: 0.4, metalness: 0.7 }));
    var rotor = new THREE.Mesh(K.garder(new THREE.CylinderGeometry(0.4, 0.4, 0.36, 24, 1, false)), mRot); rotor.position.y = 2.92; g.add(rotor);
    P.cylindre(g, 0.48, 0.48, 0.05, mR, 0, 2.7, 0, { cotes: 32 });
    P.cylindre(g, 0.48, 0.48, 0.05, mR, 0, 3.14, 0, { cotes: 32 });
    var chapeau = new THREE.Mesh(K.garder(new THREE.ConeGeometry(0.64, 0.36, 32, 1)), mR); chapeau.position.y = 3.35; chapeau.castShadow = true; g.add(chapeau);
    P.cylindre(g, 0.64, 0.64, 0.04, mR, 0, 3.17, 0, { cotes: 32 });
    P.cylindre(g, 0.04, 0.04, 0.2, mAc, 0, 3.6, 0, { cotes: 8 });
    P.boite(g, 0.32, 0.42, 0.16, mR, 0.36, 0.7, 0.1);
    var voy = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.035, 10, 8)), K.mat.lumiere({ couleur: ORANGE, intensite: 6, toneMapped: false }));
    voy.position.set(0.36, 0.86, 0.19); g.add(voy);
    var hv = K.look.halo({ couleur: ORANGE, taille: 0.5, intensite: 1.2 }); hv.position.copy(voy.position); g.add(hv);
    g.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    g.maj = function (vit, t) {
      rotor.rotation.y = -t * 40 * vit;
      var k = vit > 0.04 ? 1 : 0.06;
      voy.material.color.set(ORANGE).multiplyScalar(7 * k); hv.intensite(1.3 * k);
    };
    return g;
  }
  // des pigeons : un petit corps, deux ailes en dièdre (le V qui bat), instanciés ; posés
  // autour de la sirène, ils partent à `t0`, du côté opposé à la caméra (`dir`, un angle)
  function pigeons(K, THREE, o) {
    var n = o.n || 30, g = new THREE.Group(), r = K.alea(o.graine || "pigeons");
    var gC = new THREE.SphereGeometry(0.05, 7, 5); gC.scale(0.85, 0.75, 2.3); K.garder(gC);
    var gA = new THREE.BufferGeometry();
    // une aile : x vers le bout, z vers l'avant ; le bord d'attaque droit, le bout effilé
    gA.setAttribute("position", new THREE.BufferAttribute(new Float32Array([0, 0, 0.05, 0.27, 0, 0.0, 0.2, 0, -0.06, 0, 0, 0.05, 0.2, 0, -0.06, 0, 0, -0.05]), 3));
    gA.computeVertexNormals(); K.garder(gA);
    var mP = K.garder(new THREE.MeshStandardMaterial({ color: "#2b2f33", roughness: 0.9, side: THREE.DoubleSide }));
    var corps = new THREE.InstancedMesh(gC, mP, n), aileG = new THREE.InstancedMesh(gA, mP, n), aileD = new THREE.InstancedMesh(gA, mP, n);
    [corps, aileG, aileD].forEach(function (m) { m.frustumCulled = false; g.add(m); });
    var ds = [];
    for (var i = 0; i < n; i++) {
      var ang = r() * PI * 2, rr = 0.5 + r() * 2.2;
      ds.push({ a: o.dir + (r() - 0.5) * 1.5, v: 2.6 + r() * 3.2, up: 1.0 + r() * 2.2, d: r() * 0.7, ph: r() * 6, k: 0.8 + r() * 0.4,
        x: Math.cos(ang) * rr, z: Math.sin(ang) * rr, y: r() < 0.4 ? 0.9 : -1.6 + r() * 0.3 });
    }
    var d = new THREE.Object3D(), qa = new THREE.Quaternion(), qb = new THREE.Quaternion(), axe = new THREE.Vector3(0, 0, 1), haut = new THREE.Vector3(0, 1, 0);
    g.maj = function (t) {
      for (var i = 0; i < n; i++) {
        var p = ds[i], tt = Math.max(0, t - o.t0 - p.d);
        var x = o.pos[0] + p.x + Math.cos(p.a) * p.v * tt, z = o.pos[2] + p.z + Math.sin(p.a) * p.v * tt, y = o.pos[1] + p.y + p.up * tt - 0.1 * tt * tt;
        var cap = PI / 2 - p.a;
        d.position.set(x, y, z); d.quaternion.setFromAxisAngle(haut, cap); d.scale.setScalar(p.k);
        d.updateMatrix(); corps.setMatrixAt(i, d.matrix);
        // posé : les ailes repliées le long du corps ; en vol : le V qui bat
        var bat = tt > 0 ? 0.25 + Math.sin(tt * 22 + p.ph) * 0.75 : 1.35;
        qa.setFromAxisAngle(haut, cap); qb.setFromAxisAngle(axe, bat);
        d.quaternion.copy(qa).multiply(qb); d.updateMatrix(); aileG.setMatrixAt(i, d.matrix);
        qb.setFromAxisAngle(axe, PI - bat); d.quaternion.copy(qa).multiply(qb); d.updateMatrix(); aileD.setMatrixAt(i, d.matrix);
      }
      corps.instanceMatrix.needsUpdate = aileG.instanceMatrix.needsUpdate = aileD.instanceMatrix.needsUpdate = true;
    };
    g.maj(0);
    return g;
  }
  // ─── LA TRÉFILERIE, DEHORS : LE GRILLAGE, LE BÂTIMENT C, LA TOUR, LE PARKING ───
  function usine(K, ctx) {
    var THREE = ctx.THREE, P = K.props, q = ctx.qualite;
    var JOUR = { zenith: "#80868f", horizon: "#aca89f", lueur: "#e8bb94", brume: "#9c9c97" };
    var SOIR = { zenith: "#18223c", horizon: "#4a5270", lueur: "#b0663c", brume: "#3a3f4e" };
    var s = K.decor(ctx, { ciel: { zenith: JOUR.zenith, horizon: JOUR.horizon, lueur: JOUR.lueur, lueurDir: [0.24, -1], force: 1.1 },
      brouillard: [JOUR.brume, 0.017], environnement: { fenetres: 0, lampes: [{ pos: [48, 26, -220], couleur: "#ffe2c4", intensite: 4, taille: 34 }] }, reflets: 0.7,
      ambiance: ["#b3bdcc", "#3e3731", 3.0] });
    var cielM = cielDe(s), hemi = lumiereHemi(s);
    var cJ = { z: new THREE.Color(JOUR.zenith), h: new THREE.Color(JOUR.horizon), l: new THREE.Color(JOUR.lueur), b: new THREE.Color(JOUR.brume) };
    var cS = { z: new THREE.Color(SOIR.zenith), h: new THREE.Color(SOIR.horizon), l: new THREE.Color(SOIR.lueur), b: new THREE.Color(SOIR.brume) };
    // le soleil d'hiver, bas, voilé, derrière la tour : le contre-jour
    var soleil = new THREE.DirectionalLight("#ffd8b4", 3.6);
    soleil.position.set(30, 22, -150); soleil.target.position.set(0, 0, 0); s.add(soleil); s.add(soleil.target);
    if (q.ombres) {
      soleil.castShadow = true; soleil.shadow.mapSize.set(q.ombreTaille, q.ombreTaille);
      var sc = soleil.shadow.camera; sc.left = -70; sc.right = 70; sc.top = 50; sc.bottom = -50; sc.near = 20; sc.far = 320;
      soleil.shadow.bias = -0.0008; soleil.shadow.normalBias = 0.05; soleil.shadow.radius = 5;
    }
    var disque = K.look.halo({ couleur: "#fff0dc", taille: 36, intensite: 0.85 }); disque.position.set(48, 26, -230); s.add(disque);
    var auree = K.look.halo({ couleur: "#ffd7ae", taille: 120, intensite: 0.35 }); auree.position.set(48, 26, -231); s.add(auree);
    // le sol : l'asphalte du parking (mouillé), le béton de la cour
    var mPark = K.mat.asphalte({ flaques: 0.55, graine: "parking-trefilerie", reflets: 1.5, repete: [26, 8] });
    var park = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(220, 64)), mPark); park.rotation.x = -PI / 2; park.position.set(-5, 0, 32); park.receiveShadow = true; s.add(park);
    var mCour = K.mat.beton({ couleur: "#6b665d", graine: "cour-trefilerie", banches: 0, taches: 1.2, repete: [30, 18] });
    var cour = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(220, 140)), mCour); cour.rotation.x = -PI / 2; cour.position.set(-5, 0.005, -70); cour.receiveShadow = true; s.add(cour);
    var mBriqueC = K.mat.brique({ couleur: "#7a3e2e", graine: "batiment-c", suie: 0.8, humide: 0.7 });
    var mBriqueH = K.mat.brique({ couleur: "#633428", graine: "grande-halle", suie: 1.2, humide: 0.9 });
    var mTole = K.mat.rouille({ peinture: "#4a5052", part: 0.3, graine: "toles" });
    var mPierre = K.mat.beton({ couleur: "#8c877c", graine: "pierre-usine", banches: 0, taches: 0.5 });
    // ── le bâtiment C : 36 × 22 m, 8 m de mur, quatre sheds ; la grande porte ouverte
    var C = { x0: -32, x1: 4, z0: -10, z1: -32, h: 8, porte: [-12.6, -7.4], ph: 4.6 };
    function mur(m, w, h, d, x, y, z) { var b = new THREE.Mesh(P.boiteUV(w, h, d, 1.6), m); b.position.set(x, y, z); b.castShadow = true; b.receiveShadow = true; s.add(b); return b; }
    var eM = 0.5;
    mur(mBriqueC, C.porte[0] - C.x0, C.h, eM, (C.x0 + C.porte[0]) / 2, C.h / 2, C.z0 - eM / 2);
    mur(mBriqueC, C.x1 - C.porte[1], C.h, eM, (C.porte[1] + C.x1) / 2, C.h / 2, C.z0 - eM / 2);
    mur(mBriqueC, C.porte[1] - C.porte[0], C.h - C.ph, eM, (C.porte[0] + C.porte[1]) / 2, C.ph + (C.h - C.ph) / 2, C.z0 - eM / 2);
    mur(mBriqueC, eM, C.h, C.z0 - C.z1, C.x0 + eM / 2, C.h / 2, (C.z0 + C.z1) / 2);
    mur(mBriqueC, eM, C.h, C.z0 - C.z1, C.x1 - eM / 2, C.h / 2, (C.z0 + C.z1) / 2);
    mur(mBriqueC, C.x1 - C.x0, C.h, eM, (C.x0 + C.x1) / 2, C.h / 2, C.z1 + eM / 2);
    P.boite(s, C.porte[1] - C.porte[0] + 0.6, 0.35, 0.6, mPierre, (C.porte[0] + C.porte[1]) / 2, C.ph + 0.17, C.z0 + 0.05);
    P.boite(s, 6, 4.6, 0.12, mTole, C.porte[1] + 3.1, 2.3, C.z0 + 0.12);
    // dedans, vu par la porte : la chaleur de l'atelier (le sol, des lampes, le fond)
    var mSolIn = K.garder(new THREE.MeshStandardMaterial({ color: "#2a2520", roughness: 0.5 }));
    var solIn = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(C.x1 - C.x0, C.z0 - C.z1)), mSolIn); solIn.rotation.x = -PI / 2; solIn.position.set((C.x0 + C.x1) / 2, 0.01, (C.z0 + C.z1) / 2); s.add(solIn);
    var mFond = K.garder(new THREE.MeshStandardMaterial({ color: "#1a1410", emissive: new THREE.Color(ORANGE), emissiveIntensity: 0.12, roughness: 0.9 }));
    var fondIn = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(C.x1 - C.x0 - 1, C.h)), mFond); fondIn.position.set((C.x0 + C.x1) / 2, C.h / 2, C.z1 + eM + 0.02); s.add(fondIn);
    var mLampe = K.mat.lumiere({ couleur: "#FFC27A", intensite: 2.2, toneMapped: false }), mAbatE = K.mat.metal({ couleur: "#3d4a44", rugosite: 0.5 });
    var gAbatE = K.garder(new THREE.ConeGeometry(0.4, 0.26, 16, 1, true)), gAmpE = K.garder(new THREE.SphereGeometry(0.09, 10, 8));
    var lampesIn = [];
    for (var li = 0; li < 3; li++) for (var lj = 0; lj < 4; lj++) {
      var lz = C.z0 - 3 - lj * 5, lx = -13.4 + li * 3.4;
      var ab = new THREE.Mesh(gAbatE, mAbatE); ab.position.set(lx, 5.2, lz); s.add(ab);
      var ampIn = new THREE.Mesh(gAmpE, mLampe); ampIn.position.set(lx, 5.05, lz); s.add(ampIn);
      var hIn = K.look.halo({ couleur: "#FFB466", taille: 1.1, intensite: 0.45 }); hIn.position.set(lx, 5.0, lz); s.add(hIn); lampesIn.push(hIn);
    }
    var lumPorte = K.look.ponctuelle({ couleur: ORANGE, intensite: 11, portee: 24 }); lumPorte.position.set(-10, 3.8, -14); s.add(lumPorte);
    var lumPorte2 = K.look.ponctuelle({ couleur: "#FFB466", intensite: 6, portee: 30 }); lumPorte2.position.set(-10, 4.8, -22); s.add(lumPorte2);
    // la façade : une rangée de hautes fenêtres, quelques carreaux allumés ; l'enseigne peinte
    var tvC = vitresUsine(K, { graine: "batC", colonnes: 6, rangees: 4, allumees: 0.4, casses: 0.03 });
    var tvC2 = [vitresUsine(K, { graine: "batC2", colonnes: 6, rangees: 4, allumees: 0.3, casses: 0.03 }), vitresUsine(K, { graine: "batC3", colonnes: 6, rangees: 4, allumees: 0.5, casses: 0.05 }), tvC];
    var vitresC = [];
    [-29, -24, -19, -3, 1].forEach(function (x, i) {
      var v = planVitre(K, THREE, 2.6, 1.8, tvC2[i % 3], 1.2); v.position.set(x, 5.9, C.z0 + 0.02); s.add(v); vitresC.push(v.material);
      P.boite(s, 2.9, 0.16, 0.25, mPierre, x, 4.95, C.z0 + 0.1);
    });
    var ens = K.tex.texte({ lignes: ["TRÉFILERIE D'AUBÉRIVE · BÂTIMENT C"], fond: null, encre: "#e2d7bf", largeur: 1024, hauteur: 96, peint: true, graine: "enseigne-c" });
    var mEns = K.garder(new THREE.MeshStandardMaterial({ map: ens.map, transparent: true, roughness: 0.9, depthWrite: false }));
    var enseigne = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(14, 1.3)), mEns); enseigne.position.set(-14, 7.1, C.z0 + 0.03); s.add(enseigne);
    // le toit à sheds : quatre dents de scie, la tôle et le verre
    var nS = 4, ws = (C.x1 - C.x0) / nS;
    for (var si = 0; si < nS; si++) {
      var sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(ws, 0); sh.lineTo(ws, 2.7); sh.lineTo(0, 0);
      var gS = K.garder(new THREE.ExtrudeGeometry(sh, { depth: C.z0 - C.z1, bevelEnabled: false }));
      var shed = new THREE.Mesh(gS, mTole); shed.position.set(C.x0 + si * ws, C.h, C.z1); shed.castShadow = true; shed.receiveShadow = true; s.add(shed);
      var verre = planVitre(K, THREE, C.z0 - C.z1 - 0.4, 2.5, tvC, 0.9); vitresC.push(verre.material); verre.rotation.y = PI / 2; verre.position.set(C.x0 + (si + 1) * ws + 0.02, C.h + 1.3, (C.z0 + C.z1) / 2); s.add(verre);
    }
    // ── la grande halle, morte depuis 1984 : plus haute, plus noire, les vitres crevées
    var H = { x0: 9, x1: 48, z0: -15, z1: -48, h: 12.5 };
    var halle = new THREE.Mesh(P.boiteUV(H.x1 - H.x0, H.h, H.z0 - H.z1, 1.6), mBriqueH);
    halle.position.set((H.x0 + H.x1) / 2, H.h / 2, (H.z0 + H.z1) / 2); halle.castShadow = true; halle.receiveShadow = true; s.add(halle);
    var tvH = vitresUsine(K, { graine: "halle", colonnes: 5, rangees: 7, allumees: 0, casses: 0.3 });
    for (var hw = 0; hw < 5; hw++) {
      var vh = planVitre(K, THREE, 4.2, 6.5, tvH, 0); vh.position.set(H.x0 + 6 + hw * 7.4, 5.6, H.z0 + 0.02); s.add(vh);
      P.boite(s, 4.6, 0.25, 0.3, mPierre, H.x0 + 6 + hw * 7.4, 2.25, H.z0 + 0.12);
    }
    var pignon = new THREE.Shape(); pignon.moveTo(0, 0); pignon.lineTo(H.x1 - H.x0, 0); pignon.lineTo((H.x1 - H.x0) / 2, 5.5); pignon.lineTo(0, 0);
    var gP = K.garder(new THREE.ExtrudeGeometry(pignon, { depth: H.z0 - H.z1, bevelEnabled: false }));
    var toitH = new THREE.Mesh(gP, mTole); toitH.position.set(H.x0, H.h, H.z1); toitH.castShadow = true; s.add(toitH);
    // ── la tour de la sirène, au coin de la grande halle : 4,6 m de côté, 24 m
    var T = { x: 8.6, z: -14.6, c: 4.6, h: 24 };
    var tour = new THREE.Mesh(P.boiteUV(T.c, T.h, T.c, 1.6), mBriqueH); tour.position.set(T.x, T.h / 2, T.z); tour.castShadow = true; tour.receiveShadow = true; s.add(tour);
    P.boite(s, T.c + 0.5, 0.45, T.c + 0.5, mPierre, T.x, T.h + 0.22, T.z);
    [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(function (d) {
      P.boite(s, d[0] ? 0.25 : T.c + 0.5, 0.9, d[1] ? 0.25 : T.c + 0.5, mBriqueH, T.x + d[0] * (T.c / 2 + 0.12), T.h + 0.9, T.z + d[1] * (T.c / 2 + 0.12));
    });
    var mNoir = K.garder(new THREE.MeshStandardMaterial({ color: "#060606", roughness: 1 }));
    for (var mi = 0; mi < 6; mi++) { var mt = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.35, 1.3)), mNoir); mt.position.set(T.x + (mi % 2 ? 0.7 : -0.7), 3 + mi * 3.4, T.z + T.c / 2 + 0.02); s.add(mt); }
    var sir = sirene(K, THREE, P); sir.position.set(T.x, T.h + 0.45, T.z); s.add(sir);
    // ── la cheminée de brique, et sa dernière fumée
    var mBriqueCh = K.mat.brique({ couleur: "#6a3526", graine: "cheminee-trefilerie", suie: 1.2, repete: [3, 14] });
    P.cylindre(s, 1.0, 1.7, 40, mBriqueCh, -24, 20, -52, { cotes: 28 });
    P.cylindre(s, 1.12, 1.12, 0.8, K.mat.metal({ couleur: "#222" }), -24, 40, -52, { cotes: 28 });
    var fumee = K.particules.fumee({ n: 40, source: [-24, 40.5, -52], vent: [1.4, 0.3], montee: 1.6, vie: 9, taille: 3.4, etalement: 0.8, couleur: "#8d8c88", lueur: "#9a948c", opacite: 0.32, graine: "cheminee" });
    s.add(fumee);
    // ── la loge du gardien, contre le portail
    P.boite(s, 3, 2.7, 3, mBriqueC, -4, 1.35, -2.2);
    P.boite(s, 3.4, 0.2, 3.4, mTole, -4, 2.8, -2.2);
    var mFenL = K.mat.lumiere({ couleur: "#FFC88A", intensite: 1.8 });
    var fenL = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(1.1, 0.8)), mFenL); fenL.position.set(-4, 1.6, -0.69); s.add(fenL);
    var lumLoge = K.look.ponctuelle({ couleur: "#FFC88A", intensite: 4, portee: 7 }); lumLoge.position.set(-4, 1.7, -0.1); s.add(lumLoge);
    // ── le grillage, de part et d'autre du portail, et le portail (deux battants)
    var gG = P.grillage({ longueur: 32, hauteur: 2.4 }); gG.position.set(-29.2, 0, 0); s.add(gG);
    var gD = P.grillage({ longueur: 42, hauteur: 2.4 }); gD.position.set(13.8, 0, 0); s.add(gD);
    var mTube = K.mat.metal({ couleur: "#30363a", rugosite: 0.5 });
    var battants = [-1, 1].map(function (sg) {
      var b = new THREE.Group(); b.position.set(sg < 0 ? -13.2 : -6.8, 0, 0); s.add(b);
      var w = 3.15, x0 = sg < 0 ? 0 : -w;
      var gr = P.grillage({ longueur: w, hauteur: 2.1 }); gr.position.set(x0 + w / 2, 0.08, 0); b.add(gr);
      P.cylindre(b, 0.045, 0.045, 2.3, mTube, x0, 1.15, 0, { cotes: 8 }); P.cylindre(b, 0.045, 0.045, 2.3, mTube, x0 + w, 1.15, 0, { cotes: 8 });
      P.cylindre(b, 0.035, 0.035, w, mTube, x0 + w / 2, 2.22, 0, { rz: PI / 2, cotes: 8 }); P.cylindre(b, 0.035, 0.035, w, mTube, x0 + w / 2, 0.12, 0, { rz: PI / 2, cotes: 8 });
      b.sg = sg;
      return b;
    });
    // la chaîne et le cadenas (le plan 7) : une boucle de maillons allongés autour des deux
    // montants, le cadenas de laiton moulé, son trou de serrure, l'anse qui claque
    var mChaine = K.mat.metal({ couleur: "#8a8d8e", rugosite: 0.32 });
    var gMaillon = new THREE.TorusGeometry(0.014, 0.0042, 6, 14); gMaillon.scale(1.55, 1, 1); K.garder(gMaillon);
    var nM = 30, chaine = new THREE.InstancedMesh(gMaillon, mChaine, nM), dM = new THREE.Object3D();
    for (var cm = 0; cm < nM; cm++) {
      var u = cm / nM, ang = u * PI * 2, px = Math.cos(ang) * 0.14, pz = Math.sin(ang) * 0.06;
      dM.position.set(-10 + px, 1.06 + Math.sin(ang * 3) * 0.004 - (pz > 0 ? 0.01 * Math.sin(ang) : 0), pz);
      dM.rotation.set(0, -Math.atan2(Math.cos(ang) * 0.06, -Math.sin(ang) * 0.14), cm % 2 ? PI / 2 : 0); dM.updateMatrix(); chaine.setMatrixAt(cm, dM.matrix);
    }
    chaine.instanceMatrix.needsUpdate = true; chaine.castShadow = true; s.add(chaine);
    var cadenas = new THREE.Group(); cadenas.position.set(-10, 0.995, 0.072); s.add(cadenas);
    var mLaiton = K.garder(new THREE.MeshStandardMaterial({ color: "#b8913f", roughness: 0.3, metalness: 1, envMapIntensity: 1.8 }));
    var fc = new THREE.Shape(), wC = 0.03, hC = 0.028, rC = 0.009;
    fc.moveTo(-wC, hC); fc.lineTo(wC, hC); fc.lineTo(wC, -hC + rC); fc.quadraticCurveTo(wC, -hC, wC - rC, -hC); fc.lineTo(-wC + rC, -hC); fc.quadraticCurveTo(-wC, -hC, -wC, -hC + rC); fc.lineTo(-wC, hC);
    var gCad = K.garder(new THREE.ExtrudeGeometry(fc, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.003, bevelSegments: 2, curveSegments: 6 }));
    gCad.translate(0, 0, -0.01);
    var corpsCad = new THREE.Mesh(gCad, mLaiton); corpsCad.castShadow = true; cadenas.add(corpsCad);
    var serrure = new THREE.Mesh(K.garder(new THREE.CircleGeometry(0.0045, 12)), K.garder(new THREE.MeshStandardMaterial({ color: "#0a0806", roughness: 0.8 })));
    serrure.position.set(0, -0.006, 0.0135); cadenas.add(serrure);
    var anse = new THREE.Mesh(K.garder(new THREE.TorusGeometry(0.019, 0.004, 8, 18, PI)), mChaine); anse.position.set(0, 0.028, 0); cadenas.add(anse);
    // ── les lampadaires du parking (éteints, puis le sodium au crépuscule)
    var lamps = [[-18, 11], [-1, 10.5], [17, 12.5], [-40, 13]].map(function (p, i) {
      var r = P.reverbere({ hauteur: 6.6, bras: 1.4, intensite: 140, gresille: i === 1 ? 1 : 0.25, forceCone: 0.09 });
      r.position.set(p[0], 0, p[1]); r.rotation.y = PI / 2; s.add(r);
      r.maj(0, 0);
      return r;
    });
    s.updateMatrixWorld(true);
    var refletsL = lamps.map(function (l) { var rl = K.look.reflet({ pos: l.positionLampe(), couleur: "#FF9A3D", intensite: 0, largeur: 0.9, longueur: 9 }); s.add(rl); return rl; });
    // ── la foule au grillage : des centaines de dos, en manteau d'hiver (mélangés : la
    // foule qui s'en va, au dernier plan, se clairsème au hasard, pas par un bout)
    var rf = K.alea("foule-grillage"), places = [];
    for (var fi = 0; fi < 760; fi++) {
      var fx2 = -46 + rf() * 70, prof = Math.pow(rf(), 1.5) * 8;
      if (fx2 > -11.3 && fx2 < -8.7) continue;                                // devant le portail, on laisse passer
      if (fx2 > -13.6 && fx2 < -6.4 && prof < 2.4) continue;                   // et le seuil, où se tient la caméra
      places.push({ x: fx2, y: 0, z: 0.5 + prof + (rf() - 0.5) * 0.2, ry: PI + (rf() - 0.5) * 0.5, k: rf() });
    }
    places.sort(function (a, b) { return a.k - b.k; });
    var foule = K.gens.foule({ places: places, couleurs: ["#1d1d22", "#2b2723", "#32302c", "#23262e", "#3a332b", "#1a1c24", "#40372c", "#2c3e5a"], partEcharpes: 0.05, echarpes: "#3b1c22", graine: "trefilerie" });
    s.add(foule);
    var nFoule = foule.corps.count;
    // le premier rang au treillis (le plan 6) : quatre silhouettes, les mains sur les mailles ;
    // derrière elles, loin, un lampadaire qui s'allumera (le contre-jour)
    var mains = [-21.0, -20.42, -19.86, -19.3].map(function (x, i) {
      var m = K.gens.mannequin({ silhouette: true, tenue: i % 2 ? "manteau" : "blouson", femme: i === 1 || i === 3, casquette: i === 2, graine: "main" + i, taille: [1.74, 1.64, 1.8, 1.68][i] });
      m.groupe.position.set(x, 0, 0.36 + (i % 2) * 0.08); m.groupe.rotation.y = PI + (i - 1.5) * 0.06; s.add(m.groupe);
      return { m: m, lache: [25.0, 25.9, 26.7, 27.5][i], ph: i * 1.7 };
    });
    var lampeLoin = P.reverbere({ hauteur: 6.6, bras: 1.4, intensite: 150, gresille: 0.4, forceCone: 0.12 });
    lampeLoin.position.set(-21.4, 0, 24.5); lampeLoin.rotation.y = PI / 2; s.add(lampeLoin); lampeLoin.maj(0, 0);
    // ── les ouvriers qui sortent du bâtiment C, leur casier dans les bras (à contre-jour)
    var mCarton = K.mat.papier({ graine: "carton-casier", couleur: "#8a6f4c" });
    var ouvriers = [];
    for (var oi = 0; oi < 6; oi++) {
      var femme = oi % 3 !== 1;
      var ov = K.gens.mannequin({ silhouette: true, tenue: "blouson", femme: femme, casquette: !femme && oi === 4, graine: "ouvrier" + oi, taille: femme ? 1.66 : 1.77 });
      var boite = P.boite(null, 0.4, 0.2, 0.28, mCarton, 0, 0.36, 0.25);
      ov.os.buste.add(boite);
      s.add(ov.groupe);
      ouvriers.push({ m: ov, t0: 3.0 + oi * 0.85 + (oi % 2) * 0.2, x: -10 + (oi % 2 ? 0.55 : -0.55) + (oi === 4 ? 0.3 : 0), v: 1.15 + (oi % 3) * 0.08 });
    }
    // le gardien : de dos, une boîte en carton pour les clés
    var gardien = K.gens.mannequin({ silhouette: true, tenue: "manteau", casquette: true, graine: "gardien" });
    gardien.groupe.position.set(-8.4, 0, -1.1); gardien.groupe.rotation.y = PI + 0.25; s.add(gardien.groupe);
    var boiteCles = P.boite(null, 0.34, 0.16, 0.26, mCarton, 0, 0.3, 0.27); gardien.os.buste.add(boiteCles);
    // ── les pigeons de la tour, le givre qui tombe des tôles, la neige, la brume
    var vol = pigeons(K, THREE, { n: 30, t0: 5.9, pos: [T.x, T.h + 2.2, T.z], dir: -0.6, graine: "pigeons-tour" }); s.add(vol);
    var givre = K.particules.neige({ n: 700, zone: { min: [T.x - 1.6, T.h - 4, T.z - 1.6], max: [T.x + 1.6, T.h + 3.6, T.z + 1.6] }, taille: 0.018, chute: 1.8, couleur: "#ffffff", opacite: 0, graine: "givre" });
    s.add(givre);
    var lumNeige = lamps.slice(0, 3).map(function (l) { return { pos: l.positionLampe(), couleur: "#FF9A3D", intensite: 0, rayon: 9 }; });
    var neige = K.particules.neige({ n: 6000, zone: { min: [-16, 0, -16], max: [16, 14, 16] }, suivre: true, avance: 8, taille: 0.03, chute: 0.55, couleur: "#e3e8ee", opacite: 0, graine: "neige-noel", lumieres: lumNeige });
    s.add(neige);
    var brumes = [[-30, 0.3, -6], [-6, 0.3, -24], [22, 0.3, -10], [-50, 0.3, 4], [-12, 0.3, 20]].map(function (p, i) {
      var f = K.particules.fumee({ n: 18, source: p, vent: [0.35, 0.05], montee: 0.04, vie: 26, taille: 10, etalement: 10, couleur: "#a3a39e", lueur: "#b0aea8", opacite: 0.13, graine: "brume" + i });
      s.add(f); return f;
    });
    return {
      scene: s, T: T, sirene: sir,
      look: { bloom: 0.42, rayon: 0.6, seuil: 0.95, exposition: 1.0, contraste: 1.1, saturation: 0.84 },
      maj: function (t, c) {
        // le jour tombe : de seize heures à seize heures vingt-cinq en trente-huit secondes
        var nuit = K.lisse(12, 33, t);
        if (cielM) {
          cielM.uniforms.uZenith.value.copy(cJ.z).lerp(cS.z, nuit);
          cielM.uniforms.uHorizon.value.copy(cJ.h).lerp(cS.h, nuit);
          cielM.uniforms.uLueur.value.copy(cJ.l).lerp(cS.l, nuit);
        }
        s.fog.color.copy(cJ.b).lerp(cS.b, nuit);
        // la brume se lève un peu quand la caméra monte vers la tour (la fin du plan 1)
        s.fog.density = t < 5.2 ? 0.017 * (1 - 0.55 * K.lisse(2.2, 5.0, t)) : 0.017;
        if (hemi) hemi.intensity = 3.0 * (1 - nuit * 0.8);
        soleil.intensity = 3.6 * (1 - nuit * 0.95);
        disque.intensite(0.85 * (1 - nuit)); auree.intensite(0.35 * (1 - nuit * 0.7));
        // la sirène : le rotor prend sa vitesse, tient, ralentit (la musique : 0-15 s)
        var vit = K.lisse(0, 2.2, t) * (1 - K.lisse(7.5, 15.5, t));
        sir.maj(vit, t);
        vol.maj(t);
        givre.maj(t); givre.materiau.uniforms.uOpacite.value = 1.4 * K.cloche(5.5, 5.9, 8.0, 9.4, t);
        neige.maj(t, c.camera); neige.materiau.uniforms.uOpacite.value = 1.1 * K.lisse(24.6, 28.5, t);
        fumee.maj(t); fumee.materiau.uniforms.uOpacite.value = 0.32 * (1 - K.lisse(12, 30, t));
        brumes.forEach(function (b) { b.maj(t + 40); b.materiau.uniforms.uOpacite.value = 0.13 * (1 - nuit * 0.5); });
        // les lampadaires du parking : le sodium qui s'allume, rouge d'abord, en grésillant
        var lu = neige.materiau.uniforms.uLumCoul.value;
        lamps.forEach(function (l, i) {
          var t0 = 24.9 + i * 0.85, k = K.rampe(t0, t0 + 3.2, t), kk = k > 0 && k < 0.3 ? k * (0.4 + 0.6 * Math.abs(Math.sin(t * 31 + i))) : k;
          l.maj(t, kk); refletsL[i].maj(c.camera, 1.1 * kk);
          if (i < 3) lu[i].set("#FF9A3D").multiplyScalar(1.6 * kk);
        });
        // la lumière de la porte : elle tient, puis s'éteint avec l'atelier
        var porte = 1 - K.lisse(16.2, 17.4, t);
        lumPorte.intensity = 11 * porte; lumPorte2.intensity = 6 * porte;
        mFond.emissiveIntensity = 0.12 * porte + 0.005;
        mLampe.color.set("#FFC27A").multiplyScalar(2.2 * porte + 0.03);
        lampesIn.forEach(function (h) { h.intensite(0.45 * porte); });
        vitresC.forEach(function (m) { m.emissiveIntensity = 1.2 * porte; });
        // les ouvriers : du seuil de l'atelier au portail, le casier dans les bras
        ouvriers.forEach(function (o, i) {
          var tt = t - o.t0, z = -11.5 + Math.max(0, tt) * o.v;
          o.m.groupe.visible = tt > -0.5 && z < 9;
          o.m.marche(t + i * 0.37, o.v);
          o.m.bras(0.9, 0.12, 0.9, 0.12, 1.25);
          // en passant devant le gardien, la main lâche la clé dans sa boîte
          var dz = z + 1.1, lache = K.cloche(-0.9, -0.4, 0.1, 0.5, dz);
          if (lache > 0) { o.m.os.epauleD.rotation.x = -0.9 - 0.5 * lache; o.m.os.epauleD.rotation.z = 0.12 + 0.55 * lache; o.m.os.coudeD.rotation.x = -1.25 + 0.7 * lache; }
          o.m.groupe.position.set(o.x + (z > -1.5 ? (i % 2 ? 0.25 : -0.25) * K.lisse(-1.5, 0.5, z) : 0), 0, z);
          o.m.groupe.rotation.y = 0;
        });
        // le gardien : il tend sa boîte ; au plan 7, il a enchaîné le portail et repart vers la loge
        if (t < 27) { gardien.repos(t); gardien.bras(0.95, 0.1, 0.95, 0.1, 1.2); gardien.groupe.position.set(-8.4, 0, -1.1); gardien.groupe.rotation.y = PI + 0.25; }
        else {
          var tg = t - 29.2;
          if (tg < 1.2) { gardien.repos(t); gardien.bras(1.15, 0.05, 1.2, 0.05, 0.7); gardien.groupe.position.set(-10, 0, -0.5); gardien.groupe.rotation.y = 0; }
          else { gardien.marche(t, 1.05); gardien.groupe.position.set(-10 + (tg - 1.2) * 1.0, 0, -0.5 - (tg - 1.2) * 0.25); gardien.groupe.rotation.y = PI / 2 + 0.25; }
        }
        boiteCles.visible = t < 27;
        // le portail : ouvert, puis refermé (26,9-28,1, hors champ), la chaîne, le cadenas qui claque
        var ferme = K.lisse(26.9, 28.1, t);
        battants.forEach(function (b) { b.rotation.y = b.sg * (-PI / 2 + 0.25) * (1 - ferme); });
        chaine.visible = t > 28.2; cadenas.visible = t > 28.2;
        anse.position.y = 0.028 + 0.022 * (1 - K.lisse(29.95, 30.05, t));
        // les mains sur le treillis : elles lâchent une à une
        mains.forEach(function (o) {
          o.m.repos(t + o.ph);
          var k = 1 - K.lisse(o.lache, o.lache + 0.7, t);
          o.m.bras(2.15 * k + 0.08, 0.06, 2.2 * k + 0.08, 0.06, 0.15 + 0.5 * (1 - k));
          o.m.os.tete.rotation.y *= 0.3; o.m.os.tete.rotation.x = -0.12 * (1 - k) + 0.18 * K.lisse(o.lache, o.lache + 1.2, t);
        });
        var kl = K.rampe(24.3, 27.0, t); lampeLoin.maj(t, kl > 0 && kl < 0.3 ? kl * (0.4 + 0.6 * Math.abs(Math.sin(t * 29))) : kl);
        // la foule s'en va (le dernier plan) : elle se clairsème
        foule.corps.count = Math.round(nFoule * (1 - 0.72 * K.lisse(30, 34, t)));
        foule.maj(t);
      }
    };
  }

  // ─── LE BÂTIMENT C, DEDANS : LES LAMPES, LES TRÉFILEUSES, LA POINTEUSE ─────
  function atelier(K, ctx) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: false, fond: "#05060a", environnement: { zenith: "#0d1018", horizon: "#3a3530", lueur: "#4a3018", fenetres: 0,
      lampes: [{ pos: [0, 40, -30], couleur: "#FFC27A", intensite: 6, taille: 12 }, { pos: [-30, 10, -10], couleur: "#FFC27A", intensite: 4, taille: 8 }, { pos: [30, 10, -20], couleur: "#FFC27A", intensite: 4, taille: 8 }] },
      reflets: 0.8, ambiance: ["#5a6a86", "#1a1410", 0.45], brouillard: ["#17140f", 0.02] });
    var L = 44, W = 22, Hm = 7.5;
    var mSol = K.mat.beton({ couleur: "#45403a", graine: "sol-atelier", banches: 0, taches: 1.0 });
    var mBrique = K.mat.brique({ couleur: "#5e3226", graine: "atelier-c", suie: 1.0, humide: 0.6 });
    var mTole = K.mat.rouille({ peinture: "#3a4042", part: 0.3, graine: "toles-dedans" });
    var sol = new THREE.Mesh(P.planUV(W, L, 3.2), mSol); sol.rotation.x = -PI / 2; sol.position.set(0, 0, -L / 2); sol.receiveShadow = true; s.add(sol);
    [-1, 1].forEach(function (sg) { var m = new THREE.Mesh(P.boiteUV(0.5, Hm, L, 1.6), mBrique); m.position.set(sg * (W / 2 + 0.25), Hm / 2, -L / 2); m.receiveShadow = true; s.add(m); });
    var fond = new THREE.Mesh(P.boiteUV(W, Hm, 0.5, 1.6), mBrique); fond.position.set(0, Hm / 2, -L - 0.25); s.add(fond);
    var mFer = K.mat.metal({ couleur: "#2a2e30", rugosite: 0.6 });
    var plafond = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(W, L)), mTole); plafond.rotation.x = PI / 2; plafond.position.set(0, Hm + 2.2, -L / 2); s.add(plafond);
    var mVerreBleu = K.mat.lumiere({ couleur: "#55688a", intensite: 0.6 });
    for (var f = 0; f < 6; f++) {
      var zf = -3 - f * 7.4;
      P.boite(s, W, 0.18, 0.18, mFer, 0, Hm, zf, { ombre: false });
      var vb = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(W - 0.4, 2.0)), mVerreBleu); vb.position.set(0, Hm + 1.2, zf - 0.1); s.add(vb);
    }
    [-5, 5].forEach(function (x) { for (var c = 0; c < 7; c++) P.boite(s, 0.32, Hm, 0.32, mFer, x, Hm / 2, -2 - c * 6.2); });
    // les lampes : quatre rangées de cinq abat-jour émaillés ; une vraie lumière par rangée,
    // et le faisceau de chaque lampe dans la poussière de l'atelier
    var gAbat = K.garder(new THREE.ConeGeometry(0.46, 0.3, 18, 1, true)), mAbat = K.garder(new THREE.MeshStandardMaterial({ color: "#3f5148", roughness: 0.4, metalness: 0.3, side: THREE.DoubleSide }));
    var gAmp = K.garder(new THREE.SphereGeometry(0.1, 10, 8));
    var rangees = [];
    for (var r = 0; r < 4; r++) {
      var zr = -6 - r * 8.5, mA = K.mat.lumiere({ couleur: "#FFC889", intensite: 5, toneMapped: false }), halos = [], cones = [];
      for (var c2 = 0; c2 < 5; c2++) {
        var xr = -8 + c2 * 4;
        var ab = new THREE.Mesh(gAbat, mAbat); ab.position.set(xr, 5.4, zr); s.add(ab);
        P.cylindre(s, 0.008, 0.008, Hm - 5.4, mFer, xr, 5.4 + (Hm - 5.4) / 2, zr, { cotes: 4, ombre: false });
        var amp = new THREE.Mesh(gAmp, mA); amp.position.set(xr, 5.26, zr); s.add(amp);
        var h = K.look.halo({ couleur: "#FFC27A", taille: 1.5, intensite: 0.85 }); h.position.set(xr, 5.2, zr); s.add(h); halos.push(h);
        var co = K.look.cone({ longueur: 5.2, rayonHaut: 0.42, rayonBas: 2.3, couleur: "#FFC27A", intensite: 0.2, poussiere: 0.7 }); co.position.set(xr, 5.25, zr); s.add(co); cones.push(co);
      }
      var lum = K.look.ponctuelle({ couleur: "#FFC27A", intensite: 150, portee: 24 }); lum.position.set(0, 5.0, zr); s.add(lum);
      var rl = K.look.reflet({ pos: [0, 5.0, zr], couleur: "#FFB466", intensite: 0.55, largeur: 1.4, longueur: 8 }); s.add(rl);
      rangees.push({ lum: lum, mat: mA, halos: halos, cones: cones, reflet: rl, t0: 14.4 + (3 - r) * 0.8 });
    }
    // les tréfileuses : un bâti vert, un pupitre, un tambour vertical cerclé de fil de cuivre, la bobine
    var mBati = K.garder(new THREE.MeshStandardMaterial({ color: "#3b5448", roughness: 0.5, metalness: 0.35 }));
    var cfil = K.tex.canvas(64, 256), fx = cfil.getContext("2d");
    for (var y = 0; y < 256; y += 4) { fx.fillStyle = y % 8 ? "#b86a32" : "#e09a5c"; fx.fillRect(0, y, 64, 4); }
    var mCuivre = K.garder(new THREE.MeshStandardMaterial({ map: K.tex.texture(cfil, {}), roughness: 0.25, metalness: 1.0 }));
    var mTambour = K.mat.metal({ couleur: "#7a8082", rugosite: 0.28 });
    var mFil = K.garder(new THREE.MeshStandardMaterial({ color: "#d08848", roughness: 0.22, metalness: 1.0 }));
    var gVoy = K.garder(new THREE.SphereGeometry(0.022, 10, 8)), mVoy = K.mat.lumiere({ couleur: "#5CFF6A", intensite: 4, toneMapped: false });
    var tambours = [];
    [-2.4, 2.4].forEach(function (x, ci) {
      for (var m = 0; m < 5; m++) {
        var zm = -5 - m * 7.2, g = new THREE.Group(); g.position.set(x, 0, zm); g.rotation.y = ci ? -PI / 2 : PI / 2; s.add(g);
        P.boite(g, 1.6, 0.85, 1.0, mBati, 0, 0.425, 0);
        P.boite(g, 0.5, 0.32, 0.6, mBati, 0.62, 1.0, 0.0, { rz: -0.3 });
        P.boite(g, 0.3, 0.26, 0.26, mBati, -0.85, 1.0, 0);
        var tb = new THREE.Group(); tb.position.set(-0.15, 0.85, 0); g.add(tb);
        P.cylindre(tb, 0.5, 0.5, 0.06, mTambour, 0, 0.03, 0, { cotes: 28 });
        P.cylindre(tb, 0.44, 0.44, 0.34, mCuivre, 0, 0.23, 0, { cotes: 28 });
        P.cylindre(tb, 0.5, 0.5, 0.05, mTambour, 0, 0.42, 0, { cotes: 28 });
        P.boite(tb, 0.92, 0.05, 0.08, mTambour, 0, 0.47, 0);
        P.cylindre(g, 0.36, 0.36, 0.5, mCuivre, -1.4, 0.36, 0, { rz: PI / 2, cotes: 20 });
        P.cylindre(g, 0.43, 0.43, 0.03, mTambour, -1.66, 0.43, 0, { rz: PI / 2, cotes: 24 }); P.cylindre(g, 0.43, 0.43, 0.03, mTambour, -1.14, 0.43, 0, { rz: PI / 2, cotes: 24 });
        var voyM = new THREE.Mesh(gVoy, mVoy); voyM.position.set(0.62 + 0.12, 1.12, 0.16); g.add(voyM);
        var courbe = new THREE.CatmullRomCurve3([new THREE.Vector3(-1.4, 0.72, 0), new THREE.Vector3(-1.1, 0.95, 0.02), new THREE.Vector3(-0.85, 1.0, 0), new THREE.Vector3(-0.55, 1.12, 0.3), new THREE.Vector3(-0.15, 1.12, 0.43)]);
        var fil = new THREE.Mesh(K.garder(new THREE.TubeGeometry(courbe, 24, 0.006, 5, false)), mFil); g.add(fil);
        P.boite(g, 0.6, 0.06, 0.06, mTambour, -1.4, 0.06, 0.25); P.boite(g, 0.6, 0.06, 0.06, mTambour, -1.4, 0.06, -0.25);
        tambours.push({ g: tb, ph: ci * 1.7 + m * 0.9, vit: 1.6 + (m % 3) * 0.3 });
      }
    });
    // les casiers, contre le mur de gauche près de la porte : vidés, portes ouvertes
    var mCasier = K.garder(new THREE.MeshStandardMaterial({ color: "#4d5a52", roughness: 0.6, metalness: 0.4 }));
    var nC = 14, corpsC = new THREE.InstancedMesh(K.garder(new THREE.BoxGeometry(0.42, 1.85, 0.5)), mCasier, nC), portesC = new THREE.InstancedMesh(K.garder(new THREE.BoxGeometry(0.4, 1.8, 0.02)), mCasier, nC);
    var dC = new THREE.Object3D(), rc = K.alea("casiers");
    for (var ic = 0; ic < nC; ic++) {
      var zc = -1.4 - ic * 0.44;
      dC.position.set(-W / 2 + 0.28, 0.93, zc); dC.rotation.set(0, 0, 0); dC.updateMatrix(); corpsC.setMatrixAt(ic, dC.matrix);
      var ouv = 0.4 + rc() * 1.1;
      dC.position.set(-W / 2 + 0.53 + Math.sin(ouv) * 0.2, 0.93, zc + 0.2 - Math.cos(ouv) * 0.2); dC.rotation.set(0, PI / 2 - ouv, 0); dC.updateMatrix(); portesC.setMatrixAt(ic, dC.matrix);
    }
    corpsC.instanceMatrix.needsUpdate = portesC.instanceMatrix.needsUpdate = true; s.add(corpsC); s.add(portesC);
    // ── la pointeuse, sur le pilier près de la porte : l'horloge, la fente, les deux râteliers
    var po = new THREE.Group(); po.position.set(4.82, 0, -2.0); po.rotation.y = -PI / 2; s.add(po);
    var mBoisP = K.mat.bois({ couleur: "#5a3a22", lames: 2, graine: "pointeuse", cire: true });
    P.boite(po, 0.48, 0.72, 0.26, mBoisP, 0, 1.5, 0.13);
    var cad = K.tex.canvas(256, 256), cx = cad.getContext("2d");
    cx.fillStyle = "#e8e2d2"; cx.beginPath(); cx.arc(128, 128, 124, 0, 7); cx.fill();
    cx.strokeStyle = "#1a1a1a"; cx.lineWidth = 4; cx.beginPath(); cx.arc(128, 128, 120, 0, 7); cx.stroke();
    cx.fillStyle = "#1a1a1a"; cx.font = "700 26px " + K.habillage.MONO; cx.textAlign = "center"; cx.textBaseline = "middle";
    for (var hh = 1; hh <= 12; hh++) { var an = hh / 12 * PI * 2 - PI / 2; cx.fillText(String(hh), 128 + Math.cos(an) * 94, 128 + Math.sin(an) * 94); }
    for (var mm = 0; mm < 60; mm++) { var am = mm / 60 * PI * 2; cx.save(); cx.translate(128 + Math.cos(am) * 113, 128 + Math.sin(am) * 113); cx.rotate(am); cx.fillRect(-1, -1, mm % 5 ? 4 : 8, 2); cx.restore(); }
    cx.font = "700 12px " + K.habillage.MONO; cx.fillText("TRÉFILERIE", 128, 160); cx.fillText("D'AUBÉRIVE", 128, 175);
    var mCad = K.garder(new THREE.MeshStandardMaterial({ map: K.tex.texture(cad, { clamp: true }), roughness: 0.35 }));
    var cadran = new THREE.Mesh(K.garder(new THREE.CircleGeometry(0.19, 40)), mCad); cadran.position.set(0, 1.62, 0.265); po.add(cadran);
    var mAig = K.garder(new THREE.MeshStandardMaterial({ color: "#121212", roughness: 0.5 }));
    var pivH = new THREE.Group(), pivM = new THREE.Group(); pivH.position.set(0, 1.62, 0.27); pivM.position.set(0, 1.62, 0.274); po.add(pivH); po.add(pivM);
    P.boite(pivH, 0.014, 0.1, 0.004, mAig, 0, 0.042, 0); P.boite(pivM, 0.009, 0.155, 0.004, mAig, 0, 0.068, 0);
    P.cylindre(po, 0.012, 0.012, 0.01, mAig, 0, 1.62, 0.276, { rx: PI / 2, cotes: 10 });
    var verreP = new THREE.Mesh(K.garder(new THREE.CircleGeometry(0.19, 40)), K.garder(new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.05, transparent: true, opacity: 0.1, envMapIntensity: 1.5, depthWrite: false })));
    verreP.position.set(0, 1.62, 0.28); po.add(verreP);
    P.boite(po, 0.2, 0.025, 0.05, mAig, 0, 1.3, 0.27);
    // les cartes : un atlas peint (chaque rangée une carte), des cartes posées en 3D dans
    // leurs cases (une géométrie, un appel) ; celle de ta mère dépasse un peu plus
    var nomMere = nomDeFamille(ctx.heros);
    // (des noms inventés, sans écho d'un footballeur, d'un entraîneur ni d'un dirigeant réels)
    var noms = ["FERRAND M.", "BONNET Y.", "ROCHER C.", "COURTIAL A.", "GUISARD J.", "NKOLO S.", "TRAORÉ F.", "VAQUEZ R.", "BRUNEAU L.", "MOLINIER G.", "SANNIER B.", "RICCI A.",
      "OLLIER P.", "BETOMBO H.", "ROUSSEL D.", "SABBAH N.", "LOURENÇO M.", "BARÈGE C.", "VIGNAUD E.", "TESTARD R.", "PEYRARD J.", "VOLLAIRE S.", "NOGARET T.", "ESTÈVE V."];
    var NC = 24, MERE = 19, heures = ["15:58", "16:00", "16:01", "16:02"];
    var atl = K.tex.canvas(512, 2048), ax = atl.getContext("2d"), rowH = 2048 / NC;
    for (var ci = 0; ci < NC; ci++) {
      var yy = ci * rowH, nom = ci === MERE ? nomMere + " O." : noms[ci], num = String(100 + (K.hash("carte" + ci) % 800)).padStart(4, "0");
      ax.fillStyle = ci === MERE ? "#ddd3b8" : "#d6ccb2"; ax.fillRect(0, yy, 512, rowH);
      ax.fillStyle = "#b5aa8e"; ax.fillRect(0, yy, 512, 5); ax.fillRect(0, yy + rowH - 3, 512, 3);
      ax.fillStyle = "#2a2a2a"; ax.font = "700 22px " + K.habillage.MONO; ax.textAlign = "left"; ax.textBaseline = "middle";
      ax.fillText(num, 16, yy + 24); ax.font = "700 24px " + K.habillage.MONO; ax.fillText(nom, 92, yy + 24);
      ax.font = "400 15px " + K.habillage.MONO; ax.fillStyle = "#3a3a3a"; ax.fillText("BÂT. C · DÉC. 1990", 16, yy + 54);
      ax.fillStyle = "#8a2a20"; ax.font = "700 16px " + K.habillage.MONO; ax.fillText("24  " + heures[ci % 4], 300, yy + 54);
    }
    var tAtl = K.tex.texture(atl, { clamp: true });
    var mCarte = K.garder(new THREE.MeshStandardMaterial({ map: tAtl, roughness: 0.85, side: THREE.DoubleSide }));
    var geos = [], rcarte = K.alea("cartes");
    for (var k2 = 0; k2 < NC; k2++) {
      var cote = k2 < 12 ? -1 : 1, rang = k2 % 12, gc = new THREE.PlaneGeometry(0.15, 0.075);
      var uv = gc.attributes.uv; for (var iv = 0; iv < uv.count; iv++) uv.setY(iv, 1 - (k2 + 1 - uv.getY(iv)) / NC);
      var sort = k2 === MERE ? 0.035 : 0.004 + rcarte() * 0.012;
      gc.rotateX(-0.16 - rcarte() * 0.06); gc.rotateZ((rcarte() - 0.5) * 0.04);
      gc.translate(cote * 0.52 + (rcarte() - 0.5) * 0.008, 1.94 - rang * 0.083 + sort * 0.4, 0.075 + sort);
      geos.push(gc.toNonIndexed());
    }
    var gCartes = K.gens.fusion(geos); gCartes.computeVertexNormals(); K.garder(gCartes);
    var cartes = new THREE.Mesh(gCartes, mCarte); cartes.castShadow = true; cartes.receiveShadow = true; po.add(cartes);
    [-0.52, 0.52].forEach(function (x) {
      P.boite(po, 0.24, 1.06, 0.07, mBoisP, x, 1.48, 0.035);
      for (var rr = 0; rr < 12; rr++) P.boite(po, 0.24, 0.012, 0.08, mBoisP, x, 1.905 - rr * 0.083, 0.07, { ombre: false });
    });
    // l'applique de la pointeuse : elle tient la scène quand les rangées s'éteignent
    var appl = K.look.projecteur({ couleur: "#FFD49A", intensite: 1.1, angle: 0.95, penombre: 0.6, decroissance: 2, ombre: true, loin: 6, ombreTaille: 1024 });
    appl.position.set(4.0, 2.35, -1.95); s.add(appl); var ca2 = new THREE.Object3D(); ca2.position.set(4.7, 1.5, -2.0); s.add(ca2); appl.target = ca2;
    var applG = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.035, 10, 8)), K.mat.lumiere({ couleur: "#FFE2B0", intensite: 6, toneMapped: false })); applG.position.set(4.62, 2.32, -1.95); s.add(applG);
    var applH = K.look.halo({ couleur: "#FFD49A", taille: 0.35, intensite: 0.6 }); applH.position.set(4.6, 2.3, -1.95); s.add(applH);
    // le jour bleu par la grande porte : un contre-jour froid
    var jour = K.look.projecteur({ couleur: "#8ea2c8", intensite: 34, angle: 0.75, penombre: 0.9, decroissance: 2, ombre: false });
    jour.position.set(0, 4, 3); s.add(jour); var cj = new THREE.Object3D(); cj.position.set(0, 0, -12); s.add(cj); jour.target = cj;
    var poussiere = K.particules.poussiere({ n: 1400, zone: { min: [-7, 1.5, -36], max: [7, 6, -2] }, couleur: "#ffd7a0", opacite: 0.9, taille: 0.013,
      lumieres: rangees.map(function (r) { return { pos: [0, 4.4, r.lum.position.z], couleur: "#FFC27A", intensite: 1.3, rayon: 5 }; }) });
    s.add(poussiere);
    return {
      scene: s,
      look: { bloom: 0.7, rayon: 0.55, seuil: 0.85, exposition: 1.05, contraste: 1.14, saturation: 0.92 },
      maj: function (t, c) {
        var lu = poussiere.materiau.uniforms.uLumCoul.value;
        rangees.forEach(function (r, i) {
          var k = 1 - K.lisse(r.t0, r.t0 + 0.1, t);
          if (t > r.t0 - 0.4 && t < r.t0) k *= K.bruit1(t * 40, i) > 0.15 ? 0.35 : 1;
          r.lum.intensity = 150 * k; r.mat.color.set("#FFC889").multiplyScalar(5 * k + 0.03);
          r.halos.forEach(function (h) { h.intensite(0.85 * k); });
          r.cones.forEach(function (co) { co.maj(t, 0.2 * k); });
          r.reflet.maj(c.camera, k);
          lu[i].set("#FFC27A").multiplyScalar(1.3 * k);
        });
        mVoy.color.set("#5CFF6A").multiplyScalar(4 * (1 - K.lisse(14.25, 14.35, t)) + 0.02);
        // les tambours : ils tournent, puis ralentissent jusqu'à l'arrêt (14,2-17,6 s)
        tambours.forEach(function (tb) {
          var t1 = 14.2, t2 = 17.6, a;
          if (t < t1) a = t * tb.vit; else { var u = Math.min(1, (t - t1) / (t2 - t1)); a = t1 * tb.vit + tb.vit * (t2 - t1) * (u - u * u / 2); }
          tb.g.rotation.y = a + tb.ph;
        });
        // la pointeuse : seize heures deux, puis la grande aiguille saute d'une minute (le tampon)
        var minute = 2 + K.lisse(20.36, 20.46, t);
        pivM.rotation.z = -minute / 60 * PI * 2; pivH.rotation.z = -(4 + minute / 60) / 12 * PI * 2;
        poussiere.maj(t);
      }
    };
  }

  FC.film({
    id: "derniere_sirene",
    livre: "pepite",
    titre: "La dernière sirène",
    duree: 38.0,
    musique: "livre_h3",
    musiqueFilm: "film_derniere_sirene",       // la musique écrite sous ses images (le studio) ; sinon le thème du livre
    musiqueDepuis: "creux",
    secours: "sombre",
    couleur: ORANGE,
    affiche: 35.0,
    habillage: { vignette: 0.5, grain: 0.07, ratioPaysage: 2.35, ratioPortrait: 0 },
    sortie: { noir: 1.4 },
    // la sirène (le vrai bruit, sous la musique), les contacteurs des rangées de lampes,
    // la grande aiguille de la pointeuse, le cadenas
    sons: [[0.15, "sirene"], [5.4, "sirene"], [14.4, "porte"], [15.2, "porte"], [16.0, "porte"], [16.8, "porte"], [20.4, "tampon_fin"], [30.0, "porte"]],
    textes: [
      { sorte: "lieu", de: 0.8, a: 5.0, texte: "La Tréfilerie, Aubérive", sous: "24 décembre 1990 · 16 h" },
      { sorte: "replique", de: 10.2, a: 13.9, qui: "Le gardien", texte: "Les clés des casiers, là-dedans. Ils comptent les clés, pas les gens." },
      { sorte: "titre", de: 34.4, a: 37.8, texte: "Aubérive · 1990", sous: "La Sirène", entree: 0.2, sortie: 0.7 }
    ],
    montages: { court: [[0.3, 5.0], [5.4, 8.6], [9.8, 13.8], [14.2, 17.4], [19.0, 22.8], [24.6, 28.2], [29.4, 31.6], [33.6, 37.9]] },
    preparer: function (K, ctx) {
      return K.etapes(ctx, [
        function () { ctx.decors.usine = usine(K, ctx); },
        function () { ctx.decors.atelier = atelier(K, ctx); }
      ]);
    },
    plans: [
      // 1 · le grillage, du milieu de la foule ; la caméra s'élève et recule
      { de: 0, a: 5.2, decor: "usine", entree: "noir", transition: 1.2, fixe: 3.4,
        camera: { pos: K_cles([[0, [-15, 1.75, 15.5]], [5.2, [-13.2, 3.1, 18.6]]], "douce"), cible: K_cles([[0, [-3, 3.4, -20]], [1.6, [-2, 4.0, -20]], [5.2, [8.6, 26.0, -14.6]]], "douce"), fov: K_cles([[0, 40], [2.2, 40], [5.2, 21]], "douce"), epaule: 0.1 } },
      // 2 · la sirène : la contre-plongée, le voyant, les pigeons, le givre
      { de: 5.2, a: 9.2, decor: "usine", entree: "coupe", fixe: 1.6,
        camera: { pos: K_cles([[0, [4.1, 24.7, -8.9]], [4.0, [4.35, 24.8, -9.3]]], "lin"), cible: [8.6, 27.6, -14.6], fov: 30, epaule: K_cles([[0, 0.25], [1.5, 0.5], [4, 0.2]]) } },
      // 3 · le portail : le gardien de dos, les ouvriers à contre-jour, les clés dans la boîte
      { de: 9.2, a: 14.0, decor: "usine", entree: "coupe", fixe: 2.6,
        camera: { pos: K_cles([[0, [-6.9, 1.6, 1.6]], [4.8, [-7.1, 1.62, 2.2]]], "douce"), cible: [-9.5, 1.45, -10], fov: 38, epaule: 0.12 },
        cadrage: { portrait: { x: -0.12 } } },
      // 4 · le bâtiment C : les rangées de lampes s'éteignent vers nous, les tambours s'arrêtent
      { de: 14.0, a: 18.2, decor: "atelier", entree: "coupe", fixe: 0.6,
        camera: { pos: K_cles([[0, [0.6, 1.1, -1.2]], [4.2, [0.55, 1.12, -3.4]]], "lin"), cible: [0, 2.6, -40], fov: 54, epaule: 0.1 } },
      // 5 · la pointeuse : l'horloge, puis la carte de ta mère
      { de: 18.2, a: 23.6, decor: "atelier", entree: "coupe", fixe: 4.2,
        camera: { pos: K_cles([[0, [3.3, 1.6, -2.02]], [1.6, [3.4, 1.6, -2.0]], [5.4, [4.15, 1.38, -1.53]]], "douce"), cible: K_cles([[0, [4.6, 1.52, -2.0]], [1.6, [4.6, 1.55, -2.0]], [5.4, [4.71, 1.37, -1.49]]], "douce"), fov: 34, epaule: 0.08 } },
      // 6 · le premier rang au treillis, vu de la cour, en contre-plongée : les mains levées sur les
      // mailles, contre le ciel du soir ; elles lâchent une à une ; au loin, un lampadaire s'allume
      { de: 23.6, a: 28.4, decor: "usine", entree: "coupe", fixe: 1.0,
        camera: { pos: K_cles([[0, [-20.0, 1.18, -2.9]], [4.8, [-20.2, 1.22, -1.85]]], "douce"), cible: [-20.3, 3.9, 8], fov: 40, epaule: 0.08 } },
      // 7 · la chaîne : le cadenas qui claque, le gardien qui repart vers la loge
      { de: 28.4, a: 32.4, decor: "usine", entree: "coupe", fixe: 1.8,
        camera: { pos: K_cles([[0, [-9.78, 1.13, 0.5]], [4.0, [-9.82, 1.11, 0.43]]], "lin"), cible: [-10, 1.02, 0.03], fov: 34, epaule: 0.08 } },
      // 8 · la Tréfilerie au crépuscule, la foule qui s'en va, la neige sous le sodium
      { de: 32.4, a: 38.0, decor: "usine", entree: "noir", transition: 0.9, fixe: 2.6,
        camera: { pos: K_cles([[0, [2.5, 1.8, 24.5]], [5.6, [3.2, 2.3, 22]]], "douce"), cible: K_cles([[0, [4, 9, -15]], [5.6, [4.6, 11, -15]]], "douce"), fov: 50, epaule: 0.06 } }
    ]
  });

  // les aides de la trousse, lues quand le film tourne (la trousse est chargée avant le film)
  function K_() { return FC.kit; }
  function K_cles(p, a) { var f = null; return function (t) { if (!f) f = K_().cles(p, a); return f(t); }; }
})(typeof window !== "undefined" ? window : this);
