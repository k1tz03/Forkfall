/* ═══════════════════════════════════════════════════════════════════════════
   « Deux heures » — livre 4, « La Route de la Rive » (1990-1993, le joueur en fin
   de contrat ; la couleur du livre). Docs : docs/design/cinematiques.md.

   Le premier rêve de la route. Le film passe AVANT la carte du premier rêve
   (jp.h4.route.premier_reve, l'intermède qui suit la première infiltration ;
   content/ville/films_h4.yaml) : deux heures du matin, la route de la Rive, une
   chanson de l'été 1984 à la radio, les lampadaires qui passent sur le tableau de
   bord, les mains sur le volant, le virage, le pont, et au bout du pont la lumière
   d'une mobylette. La carte demande à gauche ou à droite : le film s'arrête avant.
   Il ne devance rien : ni la voix qui dit « freine », ni la chevalière, ni la place
   des mains « à dix heures dix », ni les mains sur les genoux, ni la montre (les
   détails des rêves d'après) ; la place du passager reste hors champ ; la lumière ne
   grossit pas. Ce qu'il montre, c'est ce que le joueur croit : tu tiens le volant.

   LES PLANS (36,8 s ; la musique : livre_h4, « La Route de la Rive » ; au tournage,
   la section `C` — « 1984 : la chanson à la radio, les mains de la fête au lieu de
   la caisse ; le do dièse qui ramène la nuit »)
     1   0,0– 6,4  le tableau de bord, dans le noir : la pendule passe de 01:59 à
                   02:00, le cadran de la radio, son aiguille sur une station ; la
                   lumière d'un lampadaire glisse sur le plastique, puis une autre.
                   Carton : « La route de la Rive / Aubérive ».
     2   6,4–12,0  par-dessus l'épaule, de la banquette : les mains sur le volant (la
                   droite en haut, la gauche vers neuf heures, à l'aise) ; les doigts de
                   la droite battent la mesure de la chanson ; par le pare-brise, la route.
     3  12,0–18,4  dehors, de la berge : la voiture longe le quai, en ombre chinoise sur
                   les fenêtres de l'autre rive ; la route mouillée reflète le sodium.
     4  18,4–24,4  par le pare-brise : la ligne blanche, les lampadaires qui passent
                   au-dessus ; de l'autre côté de l'eau, le pont de pierre approche.
     5  24,4–30,4  de loin et de haut, au-dessus de la Rive : le pont de pierre, ses
                   trois arches, ses lampadaires, et au bout, une petite lumière jaune,
                   immobile ; à gauche, les phares qui arrivent au virage.
     6  30,4–36,8  sur le pont, par le pare-brise : les parapets qui passent, le
                   réverbère, la lumière de la mobylette au bout, petite, qui attend.
                   Titre : « Deux heures / La Route de la Rive ».
   La coupe de 30 s (l'aperçu de l'App Store) : les six plans, resserrés.
   La lumière : la nuit bleue, le sodium des lampadaires qui balaie l'habitacle, le
   vert de la pendule, l'ambre de la radio, les phares blancs ; l'accent : la lumière
   jaune de la mobylette, au bout. Les visages : jamais (des mains, un tableau de
   bord, une voiture de loin, un conducteur de dos). Pas de réplique : la chanson tient
   lieu de voix.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var FC = global.FusibleCinema;
  var PI = Math.PI;
  var SODIUM = "#FF9A3D";
  var JAUNE = "#FFD36A";

  // ─── LA ROUTE : le quai (le long de z), le virage à droite, le pont (le long de x)
  //  la voie de droite : x = 1,6 sur le quai ; le virage autour de (11, -196) ; le pont
  //  à z = -205,4 ; → la place et le cap de la voiture à la distance d (m) du départ
  var Q = { x: 1.6, z0: 320, zv: -196, cx: 11, cz: -196, R: 9.4, zp: -205.4 };
  var LQ = Q.z0 - Q.zv, LV = Q.R * PI / 2;
  function surLaRoute(d) {
    if (d <= LQ) return { x: Q.x, z: Q.z0 - d, cap: PI / 2 };
    if (d <= LQ + LV) { var a = PI + (d - LQ) / Q.R; return { x: Q.cx + Q.R * Math.cos(a), z: Q.cz + Q.R * Math.sin(a), cap: PI / 2 - (d - LQ) / Q.R }; }
    return { x: Q.cx + (d - LQ - LV), z: Q.zp, cap: 0 };
  }
  // la voiture, plan par plan (le rêve se monte comme un rêve : chaque plan reprend la
  // route où il veut) : la distance parcourue au temps t du film
  var TRAJETS = [
    [0, 6.4, 40, 16.5],        // le tableau de bord : sur le quai
    [6.4, 12.0, 150, 16.5],    // les mains
    [12.0, 18.4, 210, 16.0],   // dehors, au ras de l'eau
    [18.4, 24.4, 372, 15.0],   // le pare-brise : le pont approche
    [24.4, 30.4, 462, 9.0],    // le virage, d'en haut
    [30.4, 36.8, LQ + LV + 2.5, 4.2]  // sur le pont
  ];
  function distance(t) {
    for (var i = 0; i < TRAJETS.length; i++) { var r = TRAJETS[i]; if (t < r[1] || i === TRAJETS.length - 1) return r[2] + (t - r[0]) * r[3]; }
    return 0;
  }
  // l'habitacle → le monde (la place du conducteur : x vers l'avant, y en haut, z à droite)
  function versMonde(t, p) {
    var v = surLaRoute(distance(t)), c = Math.cos(v.cap), s = Math.sin(v.cap);
    return [v.x + p[0] * c + p[2] * s, p[1], v.z - p[0] * s + p[2] * c];
  }
  function camInterieure(pos, cible) {
    return { pos: function (l, pr, ctx) { return versMonde(ctx.t, pos); }, cible: function (l, pr, ctx) { return versMonde(ctx.t, typeof cible === "function" ? cible(l) : cible); } };
  }

  // ─── LES PIÈCES ──────────────────────────────────────────────────────────
  // une main qui tient le volant : le dos de la main au-dessus de la jante (côté conducteur),
  // quatre doigts de trois phalanges qui passent par-dessus et redescendent devant, le pouce
  // le long de l'intérieur. Le repère : la jante passe par l'origine le long de x ; y vers
  // l'extérieur du volant ; z vers le conducteur. `.poignet` : où l'avant-bras s'attache.
  // .battre(k) lève l'index et le majeur (0 : posés, 1 : levés)
  function main(K, THREE, mPeau, gauche) {
    var g = new THREE.Group(), sg = gauche ? -1 : 1;
    var gP = new THREE.SphereGeometry(1, 16, 12); gP.scale(0.043, 0.05, 0.017); K.garder(gP);
    var dos = new THREE.Mesh(gP, mPeau); dos.position.set(0, 0.012, 0.03); dos.rotation.x = -0.55; g.add(dos);
    var doigts = [], L = [[0.036, 0.023, 0.018], [0.04, 0.026, 0.019], [0.037, 0.024, 0.018], [0.03, 0.019, 0.016]];
    for (var i = 0; i < 4; i++) {
      var base = new THREE.Group(); base.position.set((0.03 - i * 0.02) * sg, 0.045, 0.014); g.add(base);
      var p = base, ph = [];
      for (var j = 0; j < 3; j++) {
        var lj = L[i][j], rj = 0.0082 - j * 0.0008 - (i === 3 ? 0.0008 : 0);
        var c = new THREE.Mesh(K.garder(new THREE.CapsuleGeometry(rj, lj, 3, 8)), mPeau); c.position.y = lj / 2; p.add(c);
        var nxt = new THREE.Group(); nxt.position.y = lj; p.add(nxt);
        ph.push(p); p = nxt;
      }
      doigts.push(ph);
    }
    var pouce = new THREE.Group(); pouce.position.set(0.034 * sg, -0.012, 0.03); g.add(pouce);
    var cp1 = new THREE.Mesh(K.garder(new THREE.CapsuleGeometry(0.0095, 0.03, 3, 8)), mPeau); cp1.position.y = 0.015; pouce.add(cp1);
    var p2 = new THREE.Group(); p2.position.y = 0.03; pouce.add(p2);
    var cp2 = new THREE.Mesh(K.garder(new THREE.CapsuleGeometry(0.0088, 0.022, 3, 8)), mPeau); cp2.position.y = 0.011; p2.add(cp2);
    pouce.rotation.set(-0.35, 0, sg * 1.2); p2.rotation.z = sg * 0.3;
    function serrer(i, k) { var d = doigts[i]; d[0].rotation.x = -1.45 + 0.9 * k; d[1].rotation.x = -1.5 + 1.0 * k; d[2].rotation.x = -1.0 + 0.6 * k; }
    for (var f = 0; f < 4; f++) serrer(f, 0);
    var poignet = new THREE.Object3D(); poignet.position.set(0, -0.035, 0.07); g.add(poignet); g.poignet = poignet;
    g.battre = function (k) { serrer(0, k); serrer(1, k * 0.8); };
    g.traverse(function (o) { if (o.isMesh) o.castShadow = true; });
    return g;
  }
  // un bras : l'épaule, le coude, le poignet (des points du monde) ; deux manches et un coude
  function bras(K, THREE, s, mManche) {
    var gC = K.garder(new THREE.CylinderGeometry(1, 0.86, 1, 12, 1)), gS = K.garder(new THREE.SphereGeometry(1, 12, 8));
    var haut = new THREE.Mesh(gC, mManche), avant = new THREE.Mesh(gC, mManche), coude = new THREE.Mesh(gS, mManche), epaule = new THREE.Mesh(gS, mManche);
    [haut, avant, coude, epaule].forEach(function (m) { m.castShadow = true; s.add(m); });
    var Y = new THREE.Vector3(0, 1, 0), d = new THREE.Vector3();
    function segment(m, a, b, r0) {
      d.subVectors(b, a); var L = d.length();
      m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(Y, d.normalize()); m.scale.set(r0, L, r0);
    }
    return {
      poser: function (E, C, P) { segment(haut, C, E, 0.058); segment(avant, P, C, 0.05); coude.position.copy(C); coude.scale.setScalar(0.05); epaule.position.copy(E); epaule.scale.setScalar(0.062); },
      voir: function (v) { haut.visible = avant.visible = coude.visible = epaule.visible = v; }
    };
  }
  // la pendule du tableau de bord : des chiffres verts, sur le noir
  function pendule(K, txt) {
    var c = K.tex.canvas(256, 96), x = c.getContext("2d");
    x.fillStyle = "#020403"; x.fillRect(0, 0, 256, 96);
    x.font = "700 64px " + K.habillage.MONO; x.textAlign = "center"; x.textBaseline = "middle";
    x.fillStyle = "rgba(90,255,170,0.12)"; x.fillText("88:88", 128, 50);
    x.shadowColor = "rgba(90,255,170,0.7)"; x.shadowBlur = 3; x.fillStyle = "#8CFFC4"; x.fillText(txt, 128, 50);
    return K.tex.texture(c, { clamp: true });
  }
  // le cadran de la radio : les fréquences, rétroéclairées d'ambre ; l'aiguille à part
  function cadranRadio(K) {
    var c = K.tex.canvas(512, 128), x = c.getContext("2d");
    x.fillStyle = "#0a0806"; x.fillRect(0, 0, 512, 128);
    var g = x.createLinearGradient(0, 30, 0, 98); g.addColorStop(0, "#3a2408"); g.addColorStop(0.5, "#6b4410"); g.addColorStop(1, "#3a2408");
    x.fillStyle = g; x.fillRect(24, 30, 464, 68);
    x.fillStyle = "#FFCF7A"; x.font = "700 20px " + K.habillage.MONO; x.textAlign = "center"; x.textBaseline = "middle";
    for (var f = 88; f <= 108; f += 2) { var px = 44 + (f - 88) / 20 * 424; x.fillText(String(f), px, 48); x.fillRect(px - 1, 64, 2, 12); }
    for (var f2 = 88; f2 <= 108; f2 += 0.5) { var px2 = 44 + (f2 - 88) / 20 * 424; x.fillRect(px2 - 0.5, 70, 1, 6); }
    x.font = "700 16px " + K.habillage.MONO; x.textAlign = "left"; x.fillText("FM", 30, 86); x.fillText("MHz", 440, 86);
    return K.tex.texture(c, { clamp: true });
  }
  // le compteur : les chiffres, l'aiguille à part
  function compteur(K) {
    var c = K.tex.canvas(256, 256), x = c.getContext("2d");
    x.fillStyle = "#050505"; x.beginPath(); x.arc(128, 128, 126, 0, 7); x.fill();
    x.strokeStyle = "#9cf2c8"; x.fillStyle = "#9cf2c8"; x.lineWidth = 3; x.font = "700 20px " + K.habillage.MONO; x.textAlign = "center"; x.textBaseline = "middle";
    for (var v = 0; v <= 200; v += 20) {
      var a = PI * 0.75 + v / 200 * PI * 1.5;
      x.beginPath(); x.moveTo(128 + Math.cos(a) * 100, 128 + Math.sin(a) * 100); x.lineTo(128 + Math.cos(a) * 116, 128 + Math.sin(a) * 116); x.stroke();
      x.fillText(String(v), 128 + Math.cos(a) * 80, 128 + Math.sin(a) * 80);
    }
    x.font = "700 14px " + K.habillage.MONO; x.fillText("km/h", 128, 170);
    return K.tex.texture(c, { clamp: true });
  }

  // ─── LA ROUTE DE LA RIVE, LA NUIT ─────────────────────────────────────────
  function route(K, ctx) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: { zenith: "#03050b", horizon: "#161a26", lueur: "#2a1f19", lueurDir: [1, -0.3], force: 0.55 },
      brouillard: ["#0d1018", 0.0072], environnement: { fenetres: 18, teintes: ["#FFB060", "#FFD49A"] },
      reflets: 1.0, ambiance: ["#56688f", "#1a1511", 2.0] });
    var lune = new THREE.DirectionalLight("#9db2da", 1.1); lune.position.set(-60, 70, 160); lune.target.position.set(20, 0, -100); s.add(lune); s.add(lune.target);
    var EAU = -6.5;
    // ── l'eau : noire, lisse ; les murs des quais
    var mEau = K.garder(new THREE.MeshStandardMaterial({ color: "#03060a", roughness: 0.12, metalness: 0.0, envMapIntensity: 0.45 }));
    var eau = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(52, 900)), mEau); eau.rotation.x = -PI / 2; eau.position.set(37, EAU, -60); s.add(eau);
    var mPierre = K.mat.beton({ couleur: "#6f6a60", graine: "quais-rive", banches: 0, taches: 1.0 });
    var quai1 = new THREE.Mesh(P.boiteUV(1.2, -EAU + 0.5, 900, 2), mPierre); quai1.position.set(11.6, (EAU - 0.5) / 2 + 0.5 - 0.5, -60); s.add(quai1);
    var quai2 = new THREE.Mesh(P.boiteUV(1.2, -EAU + 0.5, 900, 2), mPierre); quai2.position.set(62.4, (EAU - 0.5) / 2 + 0.5 - 0.5, -60); s.add(quai2);
    // le parapet bas du quai, côté eau
    P.boite(s, 0.35, 0.55, 520, mPierre, 11.2, 0.275, 60, { ombre: false });
    // ── le sol : la route (la ligne blanche au milieu), l'herbe, la terre
    var mRoute = K.mat.asphalte({ flaques: 0.5, ligne: true, graine: "route-rive", reflets: 1.8, repete: [1, 600 / 12] });
    var routeM = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(6.5, 600)), mRoute); routeM.rotation.x = -PI / 2; routeM.position.set(0, 0.002, 20); routeM.receiveShadow = true; s.add(routeM);
    var mRouteV = K.mat.asphalte({ flaques: 0.5, ligne: false, graine: "route-rive", reflets: 1.8, repete: [4, 4] });
    var gV = K.garder(new THREE.RingGeometry(Q.R + 1.6 - 3.25, Q.R + 1.6 + 3.25, 24, 1, PI / 2, PI / 2));
    var virage = new THREE.Mesh(gV, mRouteV); virage.rotation.x = -PI / 2; virage.position.set(Q.cx, 0.003, Q.cz); s.add(virage);
    var mHerbe = K.garder(new THREE.MeshStandardMaterial({ color: "#10140f", roughness: 0.95 }));
    var herbe = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(700, 900)), mHerbe); herbe.rotation.x = -PI / 2; herbe.position.set(-340, -0.01, -60); s.add(herbe);
    var herbe2 = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(8, 520)), mHerbe); herbe2.rotation.x = -PI / 2; herbe2.position.set(7.5, -0.005, 60); s.add(herbe2);
    var herbe3 = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(300, 900)), mHerbe); herbe3.rotation.x = -PI / 2; herbe3.position.set(213, -0.01, -60); s.add(herbe3);
    // ── le pont de pierre : trois arches, le tablier, les parapets
    var X0 = 11, X1 = 64, ZP = -207, LP = 8.2;
    var fp = new THREE.Shape(); fp.moveTo(X0 - 1, EAU - 1); fp.lineTo(X1 + 1, EAU - 1); fp.lineTo(X1 + 1, 0); fp.lineTo(X0 - 1, 0); fp.lineTo(X0 - 1, EAU - 1);
    [[21.5, 6.4], [37.5, 7.0], [53.5, 6.4]].forEach(function (a) {
      var h = new THREE.Path(); h.moveTo(a[0] - a[1], EAU - 1); h.lineTo(a[0] - a[1], EAU + 0.5); h.absellipse(a[0], EAU + 0.5, a[1], 4.6, PI, 0, true, 0); h.lineTo(a[0] + a[1], EAU - 1); h.lineTo(a[0] - a[1], EAU - 1);
      fp.holes.push(h);
    });
    var gP = K.garder(new THREE.ExtrudeGeometry(fp, { depth: LP, bevelEnabled: false, curveSegments: 18 }));
    var mPont = K.mat.beton({ couleur: "#7d776b", graine: "pont-rive", banches: 0, taches: 1.3, repete: [6, 2] });
    var pont = new THREE.Mesh(gP, mPont); pont.position.set(0, 0, ZP - LP / 2); pont.castShadow = true; pont.receiveShadow = true; s.add(pont);
    var mTab = K.mat.asphalte({ flaques: 0.45, ligne: true, graine: "pont-rive", reflets: 1.8, repete: [1, 56 / 12] });
    var tab = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(6.5, X1 - X0 + 2)), mTab); tab.rotation.set(-PI / 2, 0, PI / 2); tab.position.set((X0 + X1) / 2, 0.006, ZP); s.add(tab);
    [-1, 1].forEach(function (sg) {
      P.boite(s, X1 - X0 + 2, 0.95, 0.45, mPont, (X0 + X1) / 2, 0.475, ZP + sg * 3.75);
      P.boite(s, X1 - X0 + 2, 0.12, 0.55, mPierre, (X0 + X1) / 2, 0.98, ZP + sg * 3.75, { ombre: false });
    });
    // la route continue de l'autre côté
    var routeB = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(6.5, 220)), mRouteV); routeB.rotation.set(-PI / 2, 0, PI / 2); routeB.position.set(X1 + 110, 0.002, ZP); s.add(routeB);
    // ── les lampadaires du quai (un tous les 34 m, côté eau, la crosse sur la route) :
    // un seul appel pour les mâts ; les globes, les halos, les cônes
    var lampes = [];
    for (var zl = 300; zl > -186; zl -= 34) lampes.push([4.7, zl, PI]);
    lampes.push([X0 + 12, ZP - 4.0, -PI / 2]); lampes.push([X0 + 32, ZP - 4.0, -PI / 2]);
    var mMat = K.mat.metal({ couleur: "#22252a", rugosite: 0.5 });
    var gMat = K.garder(new THREE.CylinderGeometry(0.07, 0.11, 6.2, 8)), imMats = new THREE.InstancedMesh(gMat, mMat, lampes.length), dl = new THREE.Object3D();
    var gBras = K.garder(new THREE.BoxGeometry(1.5, 0.07, 0.07)), imBras = new THREE.InstancedMesh(gBras, mMat, lampes.length);
    var mGlobe = K.mat.lumiere({ couleur: SODIUM, intensite: 6, toneMapped: false });
    var gGl = K.garder(new THREE.SphereGeometry(0.2, 12, 6, 0, PI * 2, PI / 2, PI / 2)), imGl = new THREE.InstancedMesh(gGl, mGlobe, lampes.length);
    var tetes = [];
    lampes.forEach(function (l, i) {
      dl.position.set(l[0], 3.1, l[1]); dl.rotation.set(0, 0, 0); dl.scale.set(1, 1, 1); dl.updateMatrix(); imMats.setMatrixAt(i, dl.matrix);
      var ca = Math.cos(l[2]), sa = Math.sin(l[2]);
      dl.position.set(l[0] + 0.7 * ca, 6.2, l[1] - 0.7 * sa); dl.rotation.set(0, l[2], 0); dl.updateMatrix(); imBras.setMatrixAt(i, dl.matrix);
      var tx = l[0] + 1.4 * ca, tz = l[1] - 1.4 * sa;
      dl.position.set(tx, 6.18, tz); dl.rotation.set(0, 0, 0); dl.updateMatrix(); imGl.setMatrixAt(i, dl.matrix);
      tetes.push([tx, 6.15, tz]);
      var h = K.look.halo({ couleur: SODIUM, taille: 2.4, intensite: 1.2 }); h.position.set(tx, 6.1, tz); s.add(h);
      var co = K.look.cone({ longueur: 6.2, rayonHaut: 0.16, rayonBas: 3.2, couleur: SODIUM, intensite: 0.17, poussiere: 0.6 }); co.position.set(tx, 6.1, tz); s.add(co); co.lampe = true;
      tetes[i].cone = co;
    });
    [imMats, imBras, imGl].forEach(function (m) { m.instanceMatrix.needsUpdate = true; s.add(m); });
    // les reflets du sodium sur l'eau : une traînée par lampadaire
    var refl = tetes.map(function (p) { var r = K.look.reflet({ pos: [p[0] > 8 ? p[0] : 12.6, p[1], p[2]], sol: EAU, couleur: SODIUM, intensite: 1.0, largeur: 1.5, longueur: 24 }); s.add(r); return r; });
    var reflR = tetes.map(function (p) { var r = K.look.reflet({ pos: p, couleur: SODIUM, intensite: 0.55, largeur: 1.1, longueur: 14 }); s.add(r); return r; });
    // trois vraies lumières suivent la voiture : les lampadaires les plus proches
    var vraies = [0, 1, 2].map(function () {
      var l = K.look.projecteur({ couleur: SODIUM, intensite: 0, angle: 1.0, penombre: 0.85, decroissance: 2, portee: 11 });
      var c = new THREE.Object3D(); s.add(l); s.add(c); l.target = c; return l;
    });
    // ── les peupliers, côté terre ; au loin, les fenêtres de la ville de l'autre rive
    var mTronc = K.garder(new THREE.MeshStandardMaterial({ color: "#0d0d0c", roughness: 1 })), mHoupp = K.garder(new THREE.MeshStandardMaterial({ color: "#0b100c", roughness: 1 }));
    var nP = 0, peup = [], rp = K.alea("peupliers");
    for (var zz = 300; zz > -200; zz -= 11 + rp() * 4) peup.push([-7.5 - rp() * 2.5, zz, 0.8 + rp() * 0.4]);
    var gTr = K.garder(new THREE.CylinderGeometry(0.16, 0.24, 6, 6)), gHo = K.garder(new THREE.SphereGeometry(1, 10, 8));
    var imTr = new THREE.InstancedMesh(gTr, mTronc, peup.length), imHo = new THREE.InstancedMesh(gHo, mHoupp, peup.length);
    peup.forEach(function (p, i) {
      dl.position.set(p[0], 3, p[1]); dl.rotation.set(0, 0, 0); dl.scale.set(1, 1, 1); dl.updateMatrix(); imTr.setMatrixAt(i, dl.matrix);
      dl.position.set(p[0], 9.5 * p[2], p[1]); dl.scale.set(2.1 * p[2], 7.5 * p[2], 2.1 * p[2]); dl.updateMatrix(); imHo.setMatrixAt(i, dl.matrix);
    });
    [imTr, imHo].forEach(function (m) { m.instanceMatrix.needsUpdate = true; m.castShadow = false; s.add(m); });
    var mBat = K.garder(new THREE.MeshStandardMaterial({ color: "#4a3a32", roughness: 0.9 }));
    var mFen = K.garder(new THREE.MeshBasicMaterial({ color: "#ffffff", toneMapped: false }));
    var bats = [], fens = [], rb = K.alea("autre-rive");
    for (var zb = 240; zb > -420; zb -= 10 + rb() * 9) {
      var hb = 7 + rb() * 12, wb = 8 + rb() * 6, xf = 72 + rb() * 6; bats.push([xf + 5, hb / 2, zb, 10, hb, wb]);
      for (var fy = 2; fy < hb - 1; fy += 3) for (var fz = -wb / 2 + 1.2; fz < wb / 2 - 0.8; fz += 2.2) if (rb() < 0.3) fens.push([xf - 0.03, fy, zb + fz, rb()]);
    }
    var imBat = new THREE.InstancedMesh(K.garder(new THREE.BoxGeometry(1, 1, 1)), mBat, bats.length);
    bats.forEach(function (b, i) { dl.position.set(b[0], b[1], b[2]); dl.rotation.set(0, 0, 0); dl.scale.set(b[3], b[4], b[5]); dl.updateMatrix(); imBat.setMatrixAt(i, dl.matrix); });
    imBat.instanceMatrix.needsUpdate = true; s.add(imBat);
    var imFen = new THREE.InstancedMesh(K.garder(new THREE.PlaneGeometry(0.9, 1.2)), mFen, Math.max(1, fens.length)), cF = new THREE.Color();
    fens.forEach(function (f, i) { dl.position.set(f[0], f[1], f[2]); dl.rotation.set(0, -PI / 2, 0); dl.scale.set(1, 1, 1); dl.updateMatrix(); imFen.setMatrixAt(i, dl.matrix); imFen.setColorAt(i, cF.set(f[3] < 0.7 ? "#FFB765" : "#CFE0FF").multiplyScalar(0.9 + f[3])); });
    imFen.instanceMatrix.needsUpdate = true; if (imFen.instanceColor) imFen.instanceColor.needsUpdate = true; s.add(imFen);
    // ── le réverbère du bout du pont, et la mobylette : une lumière jaune, à l'arrêt
    var rev = P.reverbere({ hauteur: 6.4, bras: 1.3, intensite: 130, forceCone: 0.14 }); rev.position.set(X1 + 0.6, 0, ZP - 2.6); rev.rotation.y = -PI / 2; s.add(rev);
    rev.lumiere.distance = 12;
    var MOB = [X1 + 3.2, 0.95, ZP - 1.6];
    var mMob = K.mat.lumiere({ couleur: JAUNE, intensite: 7, toneMapped: false });
    var phareMob = new THREE.Mesh(K.garder(new THREE.CircleGeometry(0.075, 18)), mMob); phareMob.position.fromArray(MOB); phareMob.rotation.y = -PI / 2; s.add(phareMob);
    var haloMob = K.look.halo({ couleur: JAUNE, taille: 1.6, intensite: 1.3, coeur: 0.08 }); haloMob.position.set(MOB[0] - 0.05, MOB[1], MOB[2]); s.add(haloMob);
    var haloMob2 = K.look.halo({ couleur: JAUNE, taille: 3.2, intensite: 0.12 }); haloMob2.position.set(MOB[0] - 0.1, MOB[1], MOB[2]); s.add(haloMob2);
    var faisMob = K.look.cone({ longueur: 14, rayonHaut: 0.08, rayonBas: 2.2, couleur: JAUNE, intensite: 0.07, poussiere: 0.7 }); faisMob.position.fromArray(MOB); faisMob.rotation.z = -PI / 2 - 0.04; s.add(faisMob);
    var lumMob = K.look.projecteur({ couleur: JAUNE, intensite: 40, angle: 0.4, penombre: 0.7, decroissance: 2 }); lumMob.position.fromArray(MOB); s.add(lumMob);
    var cMob = new THREE.Object3D(); cMob.position.set(MOB[0] - 12, 0, MOB[2]); s.add(cMob); lumMob.target = cMob;
    // ── la brume sur l'eau, près du pont
    var brumes = [[30, EAU + 0.6, -190], [44, EAU + 0.6, -222], [24, EAU + 0.6, -150], [50, EAU + 0.6, -170], [24, EAU + 0.6, 120], [30, EAU + 0.6, 170], [22, EAU + 0.6, 220]].map(function (p, i) {
      var f = K.particules.fumee({ n: 16, source: p, vent: [0.3, -0.1], montee: 0.05, vie: 24, taille: 12, etalement: 12, couleur: "#3a4256", lueur: "#5a5e6e", opacite: 0.16, graine: "brume-rive" + i });
      s.add(f); return f;
    });
    // ── la voiture, dehors (les plans 3 et 5) ; ses phares
    var auto = P.voiture({ couleur: "#2e3238", phares: 1, feux: 1, plaque: "4471 RV 84" }); s.add(auto);
    var phares = [-1, 1].map(function (sg) {
      var l = K.look.projecteur({ couleur: "#FFF1D6", intensite: 220, angle: 0.42, penombre: 0.55, decroissance: 2 });
      var c = new THREE.Object3D(); s.add(l); s.add(c); l.target = c;
      var co = K.look.cone({ longueur: 22, rayonHaut: 0.1, rayonBas: 3.2, couleur: "#FFF1D6", intensite: 0.022, poussiere: 0.8 }); s.add(co);
      return { l: l, c: c, co: co, sg: sg };
    });
    // ── l'habitacle (les plans 1, 2, 4, 6) : le tableau de bord, le volant, les mains
    var hab = new THREE.Group(); s.add(hab);
    var mPlast = K.garder(new THREE.MeshStandardMaterial({ color: "#141518", roughness: 0.88 })), mPlast2 = K.garder(new THREE.MeshStandardMaterial({ color: "#1c1d21", roughness: 0.55 }));
    P.boite(hab, 0.42, 0.24, 1.56, mPlast, 0.62, 0.66, 0);                 // le tableau de bord
    P.boite(hab, 0.3, 0.06, 1.56, mPlast2, 0.5, 0.79, 0);                  // son dessus
    P.boite(hab, 0.16, 0.13, 0.5, mPlast, 0.43, 0.84, -0.38);             // la casquette du compteur
    P.boite(hab, 0.3, 0.3, 0.3, mPlast, 0.45, 0.42, 0.0);                  // la console
    // le capot, devant le pare-brise
    var mCapot = K.garder(new THREE.MeshPhysicalMaterial({ color: "#2e3238", roughness: 0.3, metalness: 0.5, clearcoat: 1, clearcoatRoughness: 0.1 }));
    var capot = P.boite(hab, 1.5, 0.05, 1.6, mCapot, 1.55, 0.74, 0, { rz: -0.07 });
    // les montants, le haut du pare-brise, le rétroviseur, le toit
    P.boite(hab, 0.06, 0.62, 0.08, mPlast, 0.62, 1.04, -0.79, { rz: 0.72 }); P.boite(hab, 0.06, 0.62, 0.08, mPlast, 0.62, 1.04, 0.79, { rz: 0.72 });
    P.boite(hab, 0.18, 0.06, 1.6, mPlast, 0.36, 1.29, 0); P.boite(hab, 1.3, 0.04, 1.6, K.garder(new THREE.MeshStandardMaterial({ color: "#2a2724", roughness: 0.95 })), -0.3, 1.32, 0);
    P.boite(hab, 0.03, 0.06, 0.2, mPlast, 0.33, 1.2, 0.02);
    // la vitre du pare-brise : un reflet à peine
    var mPB = K.garder(new THREE.MeshStandardMaterial({ color: "#0a0d12", roughness: 0.3, metalness: 0.1, transparent: true, opacity: 0.07, envMapIntensity: 0.8, depthWrite: false }));
    var pb = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.62, 1.52)), mPB); pb.position.set(0.62, 1.03, 0); pb.rotation.set(0, -PI / 2, 0); pb.rotateX(0); pb.rotation.z = 0; hab.add(pb);
    pb.rotation.set(0, -PI / 2, 0); pb.rotateOnAxis(new THREE.Vector3(1, 0, 0), -0.85);
    // le compteur, la pendule, la radio
    var mCpt = K.garder(new THREE.MeshBasicMaterial({ map: compteur(K), color: new THREE.Color("#ffffff").multiplyScalar(0.9) }));
    var cpt = new THREE.Mesh(K.garder(new THREE.CircleGeometry(0.075, 32)), mCpt); cpt.position.set(0.345, 0.84, -0.44); cpt.rotation.set(0, -PI / 2, 0); cpt.rotateX(-0.22); hab.add(cpt);
    var aigC = new THREE.Group(); aigC.position.set(0.343, 0.84, -0.44); aigC.rotation.set(0, -PI / 2, 0); aigC.rotateX(-0.22); hab.add(aigC);
    P.boite(aigC, 0.004, 0.06, 0.003, K.mat.lumiere({ couleur: "#FF6A3A", intensite: 2.5, toneMapped: false }), 0, 0.028, 0.002, { ombre: false });
    var tPend = [pendule(K, "01:59"), pendule(K, "02:00")];
    var mPend = K.garder(new THREE.MeshBasicMaterial({ map: tPend[0], color: new THREE.Color("#ffffff").multiplyScalar(0.62), toneMapped: false }));
    var pend = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.1, 0.0375)), mPend); pend.position.set(0.404, 0.735, 0.02); pend.rotation.set(0, -PI / 2, 0); pend.rotateX(-0.3); hab.add(pend);
    var mRad = K.garder(new THREE.MeshBasicMaterial({ map: cadranRadio(K), color: new THREE.Color("#ffffff").multiplyScalar(1.25), toneMapped: false }));
    var rad = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.18, 0.045)), mRad); rad.position.set(0.404, 0.635, 0.02); rad.rotation.set(0, -PI / 2, 0); rad.rotateX(-0.2); hab.add(rad);
    var aigR = P.boite(hab, 0.002, 0.03, 0.0025, K.mat.lumiere({ couleur: "#FF3A2A", intensite: 3, toneMapped: false }), 0.4015, 0.637, 0.02 + (0.09 - (98.4 - 88) / 20 * 0.149), { ombre: false });
    [-1, 1].forEach(function (sg) { P.cylindre(hab, 0.012, 0.012, 0.02, mPlast2, 0.402, 0.635, 0.02 + sg * 0.115, { rz: PI / 2, cotes: 12 }); });
    var lumTab = K.look.ponctuelle({ couleur: "#7CFFB8", intensite: 0.018, portee: 0.7 }); lumTab.position.set(0.32, 0.8, -0.2); hab.add(lumTab);
    var lumRad = K.look.ponctuelle({ couleur: "#FFB45A", intensite: 0.012, portee: 0.5 }); lumRad.position.set(0.34, 0.66, 0.02); hab.add(lumRad);
    // le jour de la route par le pare-brise : une lueur froide sur les mains, entre deux lampadaires
    var lumPB = K.look.ponctuelle({ couleur: "#9db2da", intensite: 0.06, portee: 1.6 }); lumPB.position.set(0.5, 1.22, -0.36); hab.add(lumPB);
    // le volant : la jante, trois branches, le moyeu (sans marque)
    var vol = new THREE.Group(); vol.position.set(0.24, 0.86, -0.38); vol.rotation.set(0, 0, 0.42); hab.add(vol);
    var mVol = K.garder(new THREE.MeshStandardMaterial({ color: "#121212", roughness: 0.45 }));
    var jante = new THREE.Mesh(K.garder(new THREE.TorusGeometry(0.19, 0.016, 10, 48)), mVol); jante.rotation.y = PI / 2; vol.add(jante);
    [PI / 2, PI * 7 / 6, -PI / 6].forEach(function (a) { var b = P.boite(vol, 0.02, 0.18, 0.035, mVol, 0, Math.sin(a) * 0.09, Math.cos(a) * 0.09, { rx: -a + PI / 2 }); b.rotation.set(-(a - PI / 2), 0, 0); });
    P.cylindre(vol, 0.05, 0.055, 0.05, mVol, 0.0, 0, 0, { rz: PI / 2, cotes: 16 });
    P.cylindre(hab, 0.03, 0.03, 0.4, mVol, 0.4, 0.78, -0.38, { rz: PI / 2 - 0.42, cotes: 10 });
    // les mains : la gauche vers onze heures, la droite vers quatre heures (à l'aise)
    var mPeau = K.garder(new THREE.MeshStandardMaterial({ color: "#7a5a48", roughness: 0.7 })), mManche = K.garder(new THREE.MeshStandardMaterial({ color: "#16181d", roughness: 0.9 }));
    function surJante(a, m) {
      var p = new THREE.Group(); p.position.set(0, Math.sin(a) * 0.19, Math.cos(a) * 0.19); p.rotation.x = -(a - PI / 2); vol.add(p);
      m.rotation.y = -PI / 2; p.add(m); return p;
    }
    var mainG = main(K, THREE, mPeau, true), mainD = main(K, THREE, mPeau, false);
    var conducteur = K.gens.mannequin({ silhouette: true, tenue: "blouson", graine: "conducteur", taille: 1.8 });
    conducteur.groupe.position.set(-0.47, 0.12, -0.38); conducteur.groupe.rotation.y = PI / 2; hab.add(conducteur.groupe);
    conducteur.assis(0); conducteur.os.epauleG.visible = conducteur.os.epauleD.visible = false;
    var brasG = bras(K, THREE, s, mManche), brasD = bras(K, THREE, s, mManche);
    var vE = new THREE.Vector3(), vP = new THREE.Vector3(), vC = new THREE.Vector3();
    function poserBras(b, os, mainX, cote) {
      os.getWorldPosition(vE); mainX.poignet.getWorldPosition(vP);
      hab.worldToLocal(vE); hab.worldToLocal(vP);
      vC.copy(vE).add(vP).multiplyScalar(0.5); vC.y -= 0.12; vC.z += cote * 0.07; vC.x -= 0.02;
      hab.localToWorld(vE); hab.localToWorld(vP); hab.localToWorld(vC);
      b.poser(vE, vC, vP);
    }
    surJante(PI * 0.96, mainG); surJante(PI / 2 - 0.55, mainD);
    mainG.rotation.order = mainD.rotation.order = "ZYX"; mainG.rotation.set(-0.8, -PI / 2, 0); mainD.rotation.set(-0.8, -PI / 2, 0);
    // la lumière d'un lampadaire qui passe dans l'habitacle (une par lampadaire croisé)
    var balai = K.look.projecteur({ couleur: SODIUM, intensite: 0, angle: 0.7, penombre: 0.9, decroissance: 2 });
    var cBalai = new THREE.Object3D(); s.add(balai); s.add(cBalai); balai.target = cBalai;
    var tmp = new THREE.Vector3();
    return {
      scene: s,
      look: { bloom: 0.8, rayon: 0.6, seuil: 0.8, exposition: 1.0, contraste: 1.12, saturation: 0.92 },
      maj: function (t, c) {
        var d = distance(t), v = surLaRoute(d), ca = Math.cos(v.cap), sa = Math.sin(v.cap);
        var dedans = c.plan && /interieur/.test(c.plan.role || ""), dos = c.plan && c.plan.role === "interieur-dos";
        // la voiture : dehors, on la voit ; dedans, on est dedans
        auto.visible = !dedans; hab.visible = dedans;
        auto.position.set(v.x, 0, v.z); auto.rotation.y = v.cap;
        hab.position.set(v.x, 0, v.z); hab.rotation.y = v.cap;
        // les phares : devant la voiture, vers la route
        phares.forEach(function (p) {
          var px = v.x + 2.25 * ca + p.sg * 0.55 * sa, pz = v.z - 2.25 * sa + p.sg * 0.55 * ca;
          p.l.position.set(px, 0.62, pz); p.c.position.set(px + 18 * ca, 0, pz - 18 * sa);
          p.co.position.set(px, 0.62, pz); p.co.lookAt(px + 22 * ca, -0.3, pz - 22 * sa); p.co.rotateX(-PI / 2);
          p.co.maj(t);
        });
        // les trois lampadaires les plus proches allument vraiment la route
        var proches = tetes.map(function (p, i) { return { i: i, d: Math.hypot(p[0] - v.x, p[2] - v.z) }; }).sort(function (a, b) { return a.d - b.d; });
        vraies.forEach(function (l, k) {
          var p = tetes[proches[k].i], dd = proches[k].d;
          l.position.set(p[0], p[1], p[2]); l.target.position.set(p[0], 0, p[2]);
          l.intensity = 140 * (1 - K.lisse(40, 60, dd));
        });
        // dans l'habitacle, la lumière du lampadaire qui passe : elle arrive de l'avant,
        // glisse, et s'en va par l'arrière
        if (dedans) {
          var best = null;
          tetes.forEach(function (p) {
            var dx = p[0] - v.x, dz = p[2] - v.z, av = dx * ca - dz * sa;   // devant (+) ou derrière (-)
            if (av > -12 && av < 26 && (!best || Math.abs(av - 3) < Math.abs(best.av - 3))) best = { p: p, av: av };
          });
          if (best) {
            balai.position.set(best.p[0], best.p[1], best.p[2]);
            tmp.set(v.x + 0.6 * ca, 0.8, v.z - 0.6 * sa); balai.target.position.copy(tmp);
            balai.intensity = 17 * K.cloche(-12, -4, 6, 26, best.av);
          } else balai.intensity = 0;
        } else balai.intensity = 0;
        conducteur.groupe.visible = dos;
        if (dedans) {
          conducteur.assis(t); conducteur.os.tete.rotation.y = 0.12 * Math.sin(t * 0.7); conducteur.os.buste.rotation.x = 0.12;
          hab.updateMatrixWorld(true);
          poserBras(brasG, conducteur.os.epauleG, mainG, -1); poserBras(brasD, conducteur.os.epauleD, mainD, 1);
        }
        brasG.voir(dedans); brasD.voir(dedans);
        // la pendule : deux heures (au plan 1, à 2,4 s)
        mPend.map = t < 2.4 ? tPend[0] : tPend[1];
        // les doigts de la main droite battent la mesure (104 à la noire), un peu en retard
        var bat = (t * 104 / 60) % 1, kb = K.cloche(0.0, 0.06, 0.14, 0.3, bat) * (t > 7.0 ? 1 : 0);
        mainD.battre(kb * 0.32);
        lampes.forEach(function (l, i) { tetes[i].cone.maj(t); refl[i].maj(c.camera, 1); reflR[i].maj(c.camera, 1); });
        rev.maj(t, 1);
        var fm = 1 - 0.08 * Math.max(0, K.bruit1(t * 11, 4));
        haloMob.intensite(1.3 * fm); faisMob.maj(t, 0.07 * fm);
        brumes.forEach(function (b) { b.maj(t + 30); });
      }
    };
  }

  FC.film({
    id: "route_deux_heures",
    livre: "fin_de_contrat",
    titre: "Deux heures",
    duree: 36.8,
    musique: "livre_h4",
    musiqueFilm: "film_route_deux_heures",       // la musique écrite sous ses images (le studio) ; sinon le thème du livre
    musiqueDepuis: "C",
    secours: "sombre",
    affiche: 28.6,
    habillage: { vignette: 0.6, grain: 0.08, ratioPaysage: 2.35, ratioPortrait: 0 },
    sortie: { noir: 1.3 },
    sons: [],
    textes: [
      { sorte: "lieu", de: 0.9, a: 5.6, texte: "La route de la Rive", sous: "Aubérive" },
      { sorte: "titre", de: 32.4, a: 36.4, texte: "Deux heures", sous: "La Route de la Rive", entree: 0.2, sortie: 0.7 }
    ],
    montages: { court: [[0.6, 5.8], [7.0, 11.4], [12.6, 17.4], [19.0, 23.4], [25.0, 29.4], [31.4, 36.8]] },
    preparer: function (K, ctx) {
      return K.etapes(ctx, [function () { ctx.decors.route = route(K, ctx); }]);
    },
    plans: [
      // 1 · le tableau de bord : la pendule passe à deux heures, la radio
      Object.assign({ de: 0, a: 6.4, decor: "route", role: "interieur", entree: "noir", transition: 1.4, fixe: 3.2, epaule: 0 },
        { camera: Object.assign(camInterieure([-0.13, 0.9, -0.06], function (l) { return [0.404, 0.69 + l * 0.0015, 0.02 - l * 0.003]; }), { fov: 34, epaule: 0.03 }) }),
      // 2 · les mains sur le volant ; la route par le pare-brise
      Object.assign({ de: 6.4, a: 12.0, decor: "route", role: "interieur-dos", entree: "coupe", fixe: 3.0, look: { exposition: 1.3 } },
        { camera: Object.assign(camInterieure([-0.66, 1.3, 0.24], function (l) { return [0.3, 0.98, -0.34 + l * 0.003]; }), { fov: 40, epaule: 0.035 }) }),
      // 3 · dehors, au ras de l'eau : la voiture le long du quai
      { de: 12.0, a: 18.4, decor: "route", role: "dehors", entree: "coupe", fixe: 3.2,
        camera: { pos: function (l, pr, ctx) { var v = surLaRoute(distance(ctx.t)); return [-7.2, 1.2, v.z + 3.2 - l * 0.25]; }, cible: function (l, pr, ctx) { var v = surLaRoute(distance(ctx.t)); return [v.x + 3, 1.0, v.z - 1.2]; }, fov: 42, epaule: 0.06 } },
      // 4 · par le pare-brise : la ligne blanche, les lampadaires ; le pont approche
      Object.assign({ de: 18.4, a: 24.4, decor: "route", role: "interieur", entree: "coupe", fixe: 3.6 },
        { camera: Object.assign(camInterieure([-0.32, 1.12, -0.38], function (l) { return [30, 0.6, 4.5 + l * 0.6]; }), { fov: 52, epaule: 0.03 }),
          cadrage: { portrait: { x: 0.35 } } }),
      // 5 · d'en haut : le virage, le pont, la lumière au bout
      { de: 24.4, a: 30.4, decor: "route", role: "dehors", entree: "coupe", fixe: 3.4,
        camera: { pos: K_cles([[0, [37, 23, -118]], [6, [36, 22, -121]]], "douce"), cible: K_cles([[0, [27, -1, -204]], [6, [28, -1, -205]]], "douce"), fov: 54, epaule: 0.03 },
        cadrage: { portrait: { x: 0.45 } } },
      // 6 · sur le pont, par le pare-brise : la lumière au bout
      Object.assign({ de: 30.4, a: 36.8, decor: "route", role: "interieur", entree: "coupe", fixe: 3.4 },
        { camera: Object.assign(camInterieure([-0.32, 1.12, -0.38], [40, 0.9, 1.0]), { fov: 46, epaule: 0.025 }) })
    ]
  });

  // les aides de la trousse, lues quand le film tourne (la trousse est chargée avant le film)
  function K_() { return FC.kit; }
  function K_cles(p, a) { var f = null; return function (t) { if (!f) f = K_().cles(p, a); return f(t); }; }
})(typeof window !== "undefined" ? window : this);
