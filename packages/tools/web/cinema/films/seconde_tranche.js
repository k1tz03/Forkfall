/* ═══════════════════════════════════════════════════════════════════════════
   « La seconde tranche » — livre 5, « La Maquette » (1999, le président d'un
   géant déchu ; la couleur du livre : #7ED37E). Le premier film du livre.

   QUAND : avant la carte du café de l'agence (pr.h5.a1_cafe, ou sa variante
   pr.h5.a1_cafe_vente), la première ancre du livre, juste après le prologue. Le
   prologue a montré la vitrine (« Une maquette neuve : Les Terrasses de la Rive,
   seconde tranche. Là où se tient le stade, un parc en mousse verte et un lac en
   résine ») ; le film la fait voir, de près, avant que Madame Tessandier ne serve
   son café. Il pose les objets du livre : la maquette (l'horloge du livre), le lac,
   les trois arbres de lichen à la place de l'Est, l'Est elle-même (le chêne de
   1931, la 14B), la plaque de la grille (le terrain donné aux enfants du quartier).
   Rien de ce qui viendra : ni le Conseil, ni le feu, ni qui a voulu quoi.

   LA LISTE DES PLANS (36,4 s ; image maîtresse carrée, fenêtres 16:9 → 2,35:1 et 9:16)
    1  0,0–5,6   quai · la nuit de juillet, au ras de l'eau noire : la rangée de
                 façades du quai, une seule vitrine allumée ; la caméra monte vers elle.
                 [lieu : AUBÉRIVE, QUAI DE LA RIVE / JUILLET 1999 · 23 H 10]
    2  5,6–10,4  quai · la vitrine : Gégé, de dos, l'écharpe du club, devant la
                 maquette sous son capot ; la pluie, et dans le verre l'autre rive.
    3  10,4–16,0 maquette · à hauteur de pouce, l'allée des Terrasses, les gradins
                 blancs, les figurines ; au bout, le lac de résine (une mise au point
                 macro qui glisse).
    4  16,0–21,4 maquette · par-dessus la haie de lichen : le lac, puis les trois
                 arbres plantés là où se tient l'Est. [réplique, Gégé : « À la place de
                 l'Est, trois arbres en lichen. Et la 14B, ils la mettent où ? »]
    5  21,4–24,4 rive · les trois arbres se fondent dans la vraie tribune Est, sous la
                 pluie, éclairée par le seul pylône allumé (un raccord dans le fondu).
    6  24,4–27,4 rive · la 14B : le banc de chêne, le numéro au pochoir, la pluie.
    7  27,4–31,2 rive · derrière l'Est, la grille et sa plaque de fonte : TERRAIN DONNÉ
                 AUX ENFANTS DU QUARTIER · 1931 ; l'eau coule des lettres.
    8  31,2–36,4 quai · le reflet : devant la vitrine ; à minuit le minuteur coupe les
                 spots (le relais claque), il ne reste que le lac — et dans le verre
                 noir, au-dessus des petits immeubles blancs, la vraie tribune, de
                 l'autre côté de l'eau. [titre : AUBÉRIVE · 1999 / LA MAQUETTE] Noir.
   LA LUMIÈRE : la nuit de pluie au sodium (lampadaires, en candelas, decay 2), la
   vitrine chaude (deux spots), le lac de résine éclairé par-dessous ; au stade, un seul
   pylône allumé pour l'entretien et la lampe de service sous le toit de l'Est.
   LE BRUIT : le relais du minuteur (33,4 s). LA MUSIQUE : le thème du livre (livre_h5).
   LA COUPE DE 30 S (l'aperçu de l'App Store) : les huit plans, resserrés (montages.court).
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var FC = global.FusibleCinema;
  var PI = Math.PI;
  var VERT = "#7ED37E";

  // ─── LA MISE AU POINT D'UN OBJECTIF MACRO : une passe de profondeur de champ (BokehPass
  // de three.js), posée dans la chaîne du rendu du film après le fondu, avant le bloom.
  // Chaque plan dit son flou ({ mise au point en mètres, ouverture, flou maximal }) ; sans
  // `flou`, la passe se coupe. On la règle depuis le maj des décors (ctx.plan est le plan
  // entrant, même pendant un fondu), avec la caméra principale du film.
  function flouMacro(K, ctx) {
    var THREE = ctx.THREE, cam = ctx.camera;
    var pass = new THREE.BokehPass(new THREE.Scene(), cam, { focus: 0.3, aperture: 0.03, maxblur: 0.01 });
    pass.enabled = false;
    var co = ctx.rendu.composer;
    co.insertPass(pass, Math.min(2, co.passes.length));
    return function (c) {
      var p = c.plan, f = p && p.flou;
      if (typeof f === "function") f = f(c.t - p.de, K.borne((c.t - p.de) / Math.max(1e-6, p.a - p.de), 0, 1));
      if (!f || !c.decors[p.decor]) { pass.enabled = false; return; }
      pass.enabled = true;
      pass.scene = c.decors[p.decor].scene; pass.camera = cam;
      pass.uniforms.focus.value = f.mise; pass.uniforms.aperture.value = f.ouverture; pass.uniforms.maxblur.value = f.max == null ? 0.012 : f.max;
    };
  }

  // une matière peinte une seule fois par film (la maquette sert deux fois : en gros plan, et
  // dans la vitrine), à la taille que permet la qualité (la moitié sur un téléphone faible)
  function unique(ctx, cle, fn) { var c = ctx.matieresFilm || (ctx.matieresFilm = {}); return c[cle] || (c[cle] = fn()); }
  function tailleQ(K, n) { return Math.max(64, Math.round(n * (K.qualiteTextures || 1) / 16) * 16); }

  // ─── LES MATIÈRES DE LA MAQUETTE (peintes ici : elles ne servent qu'à ce film)
  // le carton plume, blanc cassé, son grain
  function texCarton(K, graine) {
    var W = 256, c = K.tex.canvas(W, W), x = c.getContext("2d"), n = K.tex.couche(W, W, { periode: 8, octaves: 3, graine: graine });
    var im = x.createImageData(W, W), d = im.data;
    for (var i = 0, j = 0; i < n.length; i++, j += 4) { var v = 232 + (n[i] - 0.5) * 18; d[j] = v; d[j + 1] = v * 0.985; d[j + 2] = v * 0.95; d[j + 3] = 255; }
    x.putImageData(im, 0, 0);
    return K.tex.texture(c);
  }
  // le parc : flocage vert, allées de sable qui serpentent, l'ombre du bord du lac
  function texParc(K, o) {
    var W = tailleQ(K, 1024), H = Math.round(W * o.h / o.l), c = K.tex.canvas(W, H), x = c.getContext("2d");
    var n = K.tex.couche(W, H, { periode: 24, octaves: 4, graine: "flocage" }), f = K.tex.couche(W, H, { periode: 3, octaves: 3, graine: "flocage-gros" });
    var im = x.createImageData(W, H), d = im.data;
    for (var i = 0, j = 0; i < n.length; i++, j += 4) {
      var v = 0.74 + (n[i] - 0.5) * 0.6 + (f[i] - 0.5) * 0.3;
      d[j] = 66 * v; d[j + 1] = 98 * v; d[j + 2] = 50 * v; d[j + 3] = 255;
    }
    x.putImageData(im, 0, 0);
    var r = K.alea("flocage-points");
    for (var k = 0; k < W * 7; k++) { x.fillStyle = r() < 0.6 ? "rgba(160,190,110,0.32)" : "rgba(20,35,15,0.42)"; x.fillRect(r() * W, r() * H, 1.5, 1.5); }
    var px = function (u) { return (u / o.l + 0.5) * W; }, pz = function (v) { return (v / o.h + 0.5) * H; };
    x.lineCap = "round"; x.strokeStyle = "#d6cbb0"; x.lineWidth = W * 0.011;
    x.beginPath(); x.moveTo(px(-o.l / 2), pz(0.17)); x.bezierCurveTo(px(-0.15), pz(0.05), px(0.1), pz(0.24), px(o.l / 2), pz(0.04)); x.stroke();
    x.beginPath(); x.moveTo(px(-0.2), pz(-o.h / 2)); x.bezierCurveTo(px(-0.12), pz(-0.12), px(0.16), pz(-0.15), px(0.22), pz(o.h / 2)); x.stroke();
    x.beginPath(); x.ellipse(px(o.lac[0]), pz(o.lac[1]), (o.lacR[0] + 0.014) / o.l * W, (o.lacR[1] + 0.014) / o.h * H, 0, 0, 7); x.stroke();
    var g = x.createRadialGradient(px(o.lac[0]), pz(o.lac[1]), 0, px(o.lac[0]), pz(o.lac[1]), (o.lacR[0] + 0.03) / o.l * W);
    g.addColorStop(0.7, "rgba(0,0,0,0)"); g.addColorStop(0.85, "rgba(0,0,0,0.25)"); g.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    return K.tex.texture(c, { clamp: true });
  }
  // la résine du lac : un bleu-vert profond, plus clair au centre (la lampe dessous), des rides figées
  function texResine(K) {
    var W = 512, c = K.tex.canvas(W, W), x = c.getContext("2d");
    var g = x.createRadialGradient(W / 2, W / 2, 0, W / 2, W / 2, W / 2);
    g.addColorStop(0, "#8fdcc9"); g.addColorStop(0.35, "#38998e"); g.addColorStop(0.75, "#134a48"); g.addColorStop(1, "#08221f");
    x.fillStyle = g; x.fillRect(0, 0, W, W);
    var r = K.alea("resine");
    x.globalCompositeOperation = "lighter";
    for (var k = 0; k < 26; k++) {
      x.strokeStyle = "rgba(180,255,235," + (0.035 + r() * 0.05) + ")"; x.lineWidth = 2 + r() * 4;
      x.beginPath(); x.ellipse(W / 2 + (r() - 0.5) * 60, W / 2 + (r() - 0.5) * 60, 30 + k * 9, 22 + k * 7, r() * 0.4, 0, 7); x.stroke();
    }
    x.globalCompositeOperation = "source-over";
    return K.tex.texture(c, { clamp: true });
  }
  // le lichen teint : une éponge, des creux noirs, des pointes claires (couleur et relief)
  function texLichen(K) {
    var W = 256, c = K.tex.canvas(W, W), x = c.getContext("2d"), n = K.tex.couche(W, W, { periode: 14, octaves: 5, graine: "lichen", gain: 0.62 });
    var im = x.createImageData(W, W), d = im.data;
    var rc = K.tex.canvas(W, W), rx = rc.getContext("2d"), ir = rx.createImageData(W, W), dr = ir.data;
    for (var i = 0, j = 0; i < n.length; i++, j += 4) {
      var v = K.lisse(0.25, 0.8, n[i]);
      d[j] = 22 + 92 * v; d[j + 1] = 34 + 104 * v; d[j + 2] = 16 + 44 * v; d[j + 3] = 255;
      dr[j] = dr[j + 1] = dr[j + 2] = 255 * v; dr[j + 3] = 255;
    }
    x.putImageData(im, 0, 0); rx.putImageData(ir, 0, 0);
    return { map: K.tex.texture(c), relief: K.tex.texture(rc, { donnee: true }) };
  }

  // ─── LA MAQUETTE : « LES TERRASSES DE LA RIVE, SECONDE TRANCHE », au 1/200
  // L'origine est le milieu du socle, son dessus en y = 0 ; la rivière court le long du
  // bord avant (z > 0,34), le parc est là où se tient le stade (le lac en résine sur le rond
  // central, trois arbres de lichen à la place de l'Est), la Nord a rétréci en un petit bloc
  // blanc au bord du parc ; les Terrasses en gradins blancs autour, une allée qui les
  // traverse (z ≈ 0,025), la première tranche (1993) à gauche, le pont de pierre au bout.
  //  → Group { lac (le centre), mLac, mAllume }
  function maquette(K, ctx, o) {
    var THREE = ctx.THREE, P = K.props, g = new THREE.Group();
    o = o || {};
    var carton = unique(ctx, "carton", function () { return texCarton(K, "carton"); });
    var mBlanc = K.garder(new THREE.MeshStandardMaterial({ color: "#e6e2d9", map: carton, roughness: 0.85, metalness: 0 }));
    var mBeige = K.garder(new THREE.MeshStandardMaterial({ color: "#d3c8b2", map: carton, roughness: 0.88 }));
    var mSocle = K.garder(new THREE.MeshStandardMaterial({ color: "#a9a69d", roughness: 0.9 }));
    var mRue = K.garder(new THREE.MeshStandardMaterial({ color: "#7d7b76", roughness: 0.75 }));
    var mSable = K.garder(new THREE.MeshStandardMaterial({ color: "#cfc5ab", roughness: 0.95 }));
    var mVitres = K.garder(new THREE.MeshStandardMaterial({ color: "#1d2128", roughness: 0.2, metalness: 0.3, envMapIntensity: 1.4 }));
    var mAllume = K.garder(new THREE.MeshStandardMaterial({ color: "#2c2a26", emissive: new THREE.Color("#FFC98A"), emissiveIntensity: 1.4, roughness: 0.4 }));
    var mGarde = K.garder(new THREE.MeshPhysicalMaterial({ color: "#e8f4ff", roughness: 0.08, transparent: true, opacity: 0.3, depthWrite: false, envMapIntensity: 1.5 }));
    // le socle, ses rues, la rive
    P.boite(g, 1.42, 0.03, 1.02, mSocle, 0, -0.015, 0, { ombre: false });
    var rive = new THREE.Mesh(new THREE.PlaneGeometry(1.42, 0.16), K.garder(new THREE.MeshPhysicalMaterial({ color: "#0b1c22", roughness: 0.06, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.6 })));
    K.garder(rive.geometry); rive.rotation.x = -PI / 2; rive.position.set(0, -0.004, 0.42); rive.receiveShadow = true; rive.userData.garder = true; g.add(rive);
    P.boite(g, 1.42, 0.006, 0.012, mSable, 0, -0.001, 0.336);
    P.boite(g, 1.42, 0.0015, 0.052, mSable, 0, 0.0008, 0.305);
    P.boite(g, 0.03, 0.0012, 0.6, mRue, 0.38, 0.0006, -0.0, { ombre: false });
    P.boite(g, 0.29, 0.0012, 0.05, mSable, 0.545, 0.0006, 0.0275, { ombre: false });   // l'allée des Terrasses
    P.boite(g, 1.42, 0.0012, 0.03, mRue, 0, 0.0006, -0.485, { ombre: false });
    var pont = new THREE.Group(); pont.position.set(-0.6, 0, 0.42); g.add(pont);
    P.boite(pont, 0.05, 0.004, 0.18, mBeige, 0, 0.007, 0);
    [-0.05, 0, 0.05].forEach(function (z) { P.boite(pont, 0.05, 0.006, 0.012, mBeige, 0, 0.002, z + 0.025); });
    // le parc : la mousse verte là où se tient le stade
    var PARC = { l: 0.74, h: 0.57, cx: -0.01, cz: -0.015, lac: [0.0, 0.0], lacR: [0.085, 0.062] };
    var mParc = K.garder(new THREE.MeshStandardMaterial({ map: unique(ctx, "parc", function () { return texParc(K, PARC); }), roughness: 1, metalness: 0 }));
    var parc = new THREE.Mesh(new THREE.BoxGeometry(PARC.l, 0.004, PARC.h), mParc); K.garder(parc.geometry);
    parc.position.set(PARC.cx, 0.002, PARC.cz); parc.receiveShadow = true; parc.userData.garder = true; g.add(parc);
    // le lac en résine, éclairé par en dessous
    var mLac = K.garder(new THREE.MeshPhysicalMaterial({ color: "#0e2e30", roughness: 0.05, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03,
      emissive: new THREE.Color("#ffffff"), emissiveMap: unique(ctx, "resine", function () { return texResine(K); }), emissiveIntensity: 1.0, envMapIntensity: 0.9 }));
    var lac = new THREE.Mesh(new THREE.CircleGeometry(1, 48), mLac); K.garder(lac.geometry);
    lac.rotation.x = -PI / 2; lac.scale.set(PARC.lacR[0], PARC.lacR[1], 1);
    var lacPos = [PARC.cx + PARC.lac[0], 0.0042, PARC.cz + PARC.lac[1]];
    lac.position.set(lacPos[0], lacPos[1], lacPos[2]); lac.userData.garder = true; g.add(lac);
    // la Nord, rétrécie : un petit bloc blanc à gradins, au bord gauche du parc
    var nord = new THREE.Group(); nord.position.set(-0.36, 0.004, -0.03); g.add(nord);
    for (var gr = 0; gr < 6; gr++) P.boite(nord, 0.0062, 0.003 + gr * 0.0034, 0.13, mBlanc, 0.012 - gr * 0.0062, (0.003 + gr * 0.0034) / 2, 0);
    P.boite(nord, 0.003, 0.028, 0.134, mBlanc, -0.026, 0.014, 0);
    P.boite(nord, 0.018, 0.0015, 0.134, mBlanc, -0.016, 0.0285, 0);
    // les arbres de lichen : onze dans le parc (trois à la place de l'Est), une haie au bord de la promenade
    var tl = unique(ctx, "lichen", function () { return texLichen(K); });
    var mLichen = K.garder(new THREE.MeshStandardMaterial({ map: tl.map, bumpMap: tl.relief, bumpScale: 3, roughness: 1, metalness: 0, color: "#d0dcb0" }));
    var mTronc = K.garder(new THREE.MeshStandardMaterial({ color: "#4e3c2a", roughness: 0.8 }));
    var gBoule = K.garder(new THREE.IcosahedronGeometry(1, 1)), gTronc = K.garder(new THREE.CylinderGeometry(0.0007, 0.0011, 1, 5));
    var ra = K.alea("arbres-parc"), arbres = [];
    var posArbres = [[-0.095, -0.215], [0.0, -0.228], [0.1, -0.212],
      [-0.26, 0.15], [-0.21, -0.17], [0.2, 0.17], [0.27, -0.12], [-0.12, 0.2], [0.14, 0.05], [-0.28, -0.02], [0.3, 0.06]];
    posArbres.forEach(function (p, i) {
      var est = i < 3;
      arbres.push({ x: p[0] + PARC.cx, z: p[1] + PARC.cz, h: (est ? 0.02 : 0.013) + ra() * 0.009, r: (est ? 0.017 : 0.012) + ra() * 0.006, n: (est ? 26 : 16) + Math.floor(ra() * 8) });
    });
    for (var hx = -0.34; hx <= 0.345; hx += 0.012) arbres.push({ x: hx + (ra() - 0.5) * 0.004, z: 0.262 + (ra() - 0.5) * 0.006, h: 0.0, r: 0.0065 + ra() * 0.0025, n: 4, haie: true });
    // le long de l'allée, des buissons bas
    for (var bx = 0.43; bx <= 0.66; bx += 0.022) { arbres.push({ x: bx, z: 0.0065, h: 0, r: 0.0045, n: 3, haie: true }); arbres.push({ x: bx + 0.011, z: 0.0485, h: 0, r: 0.0045, n: 3, haie: true }); }
    var nBoules = 0, nTroncs = 0; arbres.forEach(function (a) { nBoules += a.n; if (!a.haie) nTroncs++; });
    var boules = new THREE.InstancedMesh(gBoule, mLichen, nBoules), troncs = new THREE.InstancedMesh(gTronc, mTronc, Math.max(1, nTroncs));
    var dd = new THREE.Object3D(), ib = 0, it = 0;
    arbres.forEach(function (a) {
      if (!a.haie) { dd.position.set(a.x, a.h / 2 + 0.004, a.z); dd.rotation.set(0, 0, 0); dd.scale.set(1, a.h + a.r * 0.6, 1); dd.updateMatrix(); troncs.setMatrixAt(it++, dd.matrix); }
      for (var k = 0; k < a.n; k++) {
        // une couronne en grappe : des boules de toutes tailles, plus serrées au cœur
        var an = ra() * PI * 2, el = (ra() - 0.35) * 1.6, rad = a.r * Math.sqrt(ra()) * 0.75;
        var s = a.r * (0.22 + ra() * 0.38) * (1.15 - rad / a.r * 0.4);
        dd.position.set(a.x + Math.cos(an) * rad, 0.004 + a.h + a.r * 0.55 + Math.sin(el) * a.r * 0.45, a.z + Math.sin(an) * rad);
        dd.rotation.set(ra() * 3, ra() * 3, ra() * 3); dd.scale.set(s, s * (0.8 + ra() * 0.4), s); dd.updateMatrix(); boules.setMatrixAt(ib++, dd.matrix);
      }
    });
    boules.count = ib; troncs.count = it;
    boules.instanceMatrix.needsUpdate = true; troncs.instanceMatrix.needsUpdate = true;
    boules.castShadow = true; boules.receiveShadow = true; troncs.castShadow = true;
    g.add(boules); g.add(troncs);
    // les lampadaires de la promenade et de l'allée (une perle sur un fil), les bancs
    var mPerle = K.garder(new THREE.MeshStandardMaterial({ color: "#fff4dc", emissive: new THREE.Color("#FFE2B0"), emissiveIntensity: 0.9 }));
    var gPerle = K.garder(new THREE.SphereGeometry(0.0016, 8, 6)), perles = [];
    for (var lx = -0.66; lx <= 0.66; lx += 0.075) perles.push([lx, 0.288]);
    for (var ax = 0.44; ax <= 0.66; ax += 0.055) { perles.push([ax, 0.006]); perles.push([ax + 0.027, 0.048]); }
    perles.forEach(function (p) {
      P.cylindre(g, 0.0005, 0.0005, 0.02, mBlanc, p[0], 0.011, p[1], { cotes: 5 });
      var perle = new THREE.Mesh(gPerle, mPerle); perle.position.set(p[0], 0.0215, p[1]); g.add(perle);
    });
    [[-0.05, 0.12], [0.08, -0.1], [-0.2, 0.06], [0.22, 0.2], [-0.15, -0.21], [0.5, 0.012], [0.6, 0.044]].forEach(function (b) { P.boite(g, 0.011, 0.002, 0.0028, mBlanc, b[0], 0.006, b[1]); });
    // ─── les Terrasses : des immeubles en gradins vers le parc, des balcons, des garde-corps
    // de plexiglas, des fenêtres (une fenêtre sur trois éclairée, comme pour une vente)
    var rb = K.alea("terrasses");
    function immeuble(x, z, l, p, etages, vers, beige) {
      var b = new THREE.Group(); b.position.set(x, 0.0015, z); g.add(b);
      var he = 0.0155, m = beige ? mBeige : mBlanc, fx = vers[0], fz = vers[1];
      for (var e = 0; e < etages; e++) {
        var recul = (fx || fz) ? Math.max(0, e - 2) * 0.0065 : 0;
        var ll = l - (fx ? recul : 0), pp = p - (fz ? recul : 0), ox = -fx * recul / 2, oz = -fz * recul / 2;
        P.boite(b, ll, he * 0.84, pp, m, ox, e * he + he * 0.42, oz);
        P.boite(b, ll + Math.abs(fx) * 0.006, he * 0.14, pp + Math.abs(fz) * 0.006, m, ox + fx * 0.003, e * he + he * 0.91, oz + fz * 0.003);
        // les fenêtres, sur les quatre faces : larges côté parc (les baies des terrasses),
        // étroites ailleurs ; une sur trois éclairée, comme pour une vente
        var faces = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (var fc = 0; fc < 4; fc++) {
          var nx = faces[fc][0], nz = faces[fc][1], parcote = (nx && nx === fx) || (nz && nz === fz);
          var long = nx ? pp : ll, nf = Math.max(2, Math.round(long / (parcote ? 0.014 : 0.012))), lw = long / nf * (parcote ? 0.66 : 0.4);
          for (var w = 0; w < nf; w++) {
            var u = ((w + 0.5) / nf - 0.5) * long, lum = rb() < (parcote ? 0.32 : 0.22) ? mAllume : mVitres, hv = he * (parcote ? 0.56 : 0.42);
            if (nx) P.boite(b, 0.0012, hv, lw, lum, ox + nx * (ll / 2 + 0.0004), e * he + he * 0.44, oz + u, { ombre: false });
            else P.boite(b, lw, hv, 0.0012, lum, ox + u, e * he + he * 0.44, oz + nz * (pp / 2 + 0.0004), { ombre: false });
          }
        }
        if (e > 0 && (fx || fz)) {
          if (fx) P.boite(b, 0.0007, he * 0.32, pp, mGarde, ox + fx * (ll / 2 + 0.0055), e * he + he * 0.98 + 0.0025, oz, { ombre: false });
          else P.boite(b, ll, he * 0.32, 0.0007, mGarde, ox, e * he + he * 0.98 + 0.0025, oz + fz * (pp / 2 + 0.0055), { ombre: false });
        }
      }
      // le toit : un acrotère et deux édicules
      P.boite(b, Math.max(0.02, l - (fx ? Math.max(0, etages - 3) * 0.0065 : 0)) * 0.3, 0.006, 0.012, m, -fx * 0.01, etages * he + 0.003, 0);
      return b;
    }
    // côté droit, de part et d'autre de l'allée (z de 0 à 0,05), en gradins vers le parc (−x)
    immeuble(0.475, -0.21, 0.11, 0.12, 7, [-1, 0]);
    immeuble(0.475, -0.0675, 0.11, 0.125, 6, [-1, 0]);
    immeuble(0.475, 0.1225, 0.11, 0.135, 8, [-1, 0]);
    immeuble(0.615, -0.1225, 0.1, 0.235, 5, [-1, 0]);
    immeuble(0.615, 0.1325, 0.1, 0.155, 6, [-1, 0]);
    // au fond (au-delà de la place de l'Est), en gradins vers le parc (+z)
    immeuble(-0.22, -0.405, 0.15, 0.1, 6, [0, 1]);
    immeuble(-0.02, -0.41, 0.14, 0.1, 8, [0, 1]);
    immeuble(0.19, -0.405, 0.15, 0.1, 7, [0, 1]);
    // la première tranche (1993), à gauche : beige, plus basse, sans gradins
    immeuble(-0.56, -0.25, 0.12, 0.12, 4, [0, 0], true);
    immeuble(-0.56, -0.05, 0.12, 0.12, 5, [0, 0], true);
    immeuble(-0.56, 0.15, 0.12, 0.1, 4, [0, 0], true);
    // les figurines : des gens blancs de neuf millimètres, deux par deux
    var gFig = (function () {
      var corps = new THREE.CylinderGeometry(0.001, 0.0015, 0.0068, 6); corps.translate(0, 0.0034, 0);
      var tete = new THREE.SphereGeometry(0.00105, 6, 4); tete.translate(0, 0.0081, 0);
      return K.garder(K.gens.fusion([corps.toNonIndexed(), tete.toNonIndexed()]));
    })();
    gFig.computeVertexNormals();
    var places = [], rf = K.alea("figurines");
    for (var fi = 0; fi < 14; fi++) { var fpx = -0.6 + rf() * 1.2; places.push([fpx, 0.3 + (rf() - 0.5) * 0.02]); places.push([fpx + 0.004, 0.302 + (rf() - 0.5) * 0.02]); }
    [[-0.03, 0.15], [0.12, -0.12], [-0.18, 0.03], [0.25, 0.16], [0.05, 0.085], [0.0, -0.09], [0.52, 0.03], [0.6, 0.022], [0.34, -0.2]].forEach(function (p) { places.push(p); places.push([p[0] + 0.005, p[1] + 0.002]); });
    var figs = new THREE.InstancedMesh(gFig, mBlanc, places.length);
    places.forEach(function (p, i) { dd.position.set(p[0], 0.0015, p[1]); dd.rotation.set(0, rf() * 6.28, 0); dd.scale.setScalar(0.92 + rf() * 0.16); dd.updateMatrix(); figs.setMatrixAt(i, dd.matrix); });
    figs.instanceMatrix.needsUpdate = true; figs.castShadow = true; g.add(figs);
    [[0.38, -0.22, 0], [0.383, 0.1, PI], [0.2, -0.485, PI / 2], [-0.3, -0.487, PI / 2]].forEach(function (v) {
      var car = new THREE.Group(); car.position.set(v[0], 0.0012, v[1]); car.rotation.y = v[2]; g.add(car);
      P.boite(car, 0.008, 0.0035, 0.021, mBlanc, 0, 0.0028, 0); P.boite(car, 0.007, 0.003, 0.011, mBlanc, 0, 0.0058, -0.001);
    });
    // la plaque de laiton sur la tranche avant : le nom de la maquette
    var tp = K.tex.texte({ lignes: ["LES TERRASSES DE LA RIVE · SECONDE TRANCHE"], fond: "#b8933f", encre: "#2a1d0a", largeur: 1024, hauteur: 96, graine: "plaque-maquette" });
    var plaqueM = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.42, 0.04)), K.garder(new THREE.MeshStandardMaterial({ map: tp.map, roughness: 0.3, metalness: 0.75 })));
    plaqueM.position.set(0, -0.016, 0.5105); plaqueM.userData.garder = true; g.add(plaqueM);
    // un appel par matière : des centaines de boîtes deviennent une dizaine de maillages
    P.fusionner(g);
    g.lac = lacPos; g.mLac = mLac; g.mAllume = mAllume; g.mPerle = mPerle;
    return g;
  }

  // ─── LE DÉCOR : la maquette dans la vitrine, la nuit (la lampe de la vitrine, la rue
  // derrière le verre, la boutique sombre)
  function decorMaquette(K, ctx) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: false, fond: "#030304", environnement: { zenith: "#08080a", horizon: "#161b27", lueur: "#3a2a1a", fenetres: 14,
      lampes: [{ pos: [-30, 40, 30], couleur: "#FFD9A8", intensite: 2.5, taille: 6 }, { pos: [0, 8, 60], couleur: "#ff9a3d", intensite: 2, taille: 10 }] }, reflets: 0.9,
      ambiance: ["#3a4868", "#14100c", 0.22], brouillard: ["#050608", 0.08] });
    var m = maquette(K, ctx);
    s.add(m);
    // le socle de la vitrine, et le plancher de la boutique
    P.boite(s, 1.6, 0.9, 1.2, K.garder(new THREE.MeshStandardMaterial({ color: "#cfcac0", roughness: 0.7 })), 0, -0.48, 0, { ombre: false });
    var sol = new THREE.Mesh(P.planUV(8, 8, 1), K.mat.bois({ couleur: "#2e1f14", lames: 7, graine: "agence-sol", repete: [6, 6] })); sol.rotation.x = -PI / 2; sol.position.y = -0.93; s.add(sol);
    // la lampe de la vitrine : deux spots chauds au plafond, l'un porte l'ombre ; une flaque
    // de lumière au milieu, les bords dans la pénombre
    [[-0.2, 1.0, 0.55, 4.2, [-0.05, 0, -0.1]], [0.55, 0.95, 0.5, 2.6, [0.45, 0, 0.0]], [0.1, 1.1, -0.3, 1.6, [0.0, 0, -0.3]]].forEach(function (p, i) {
      var l = K.look.projecteur({ couleur: i === 2 ? "#FFE2BC" : "#FFD6A0", intensite: p[3], angle: 0.55, penombre: 0.85, decroissance: 2, ombre: i === 0, loin: 4, pres: 0.2, ombreTaille: 2048, biais: -0.0002 });
      l.position.set(p[0], p[1], p[2]); s.add(l);
      var c = new THREE.Object3D(); c.position.set(p[4][0], p[4][1], p[4][2]); s.add(c); l.target = c;
    });
    // la rue, derrière le verre : un contre-jour froid, et la lueur du sodium
    var rue = K.look.projecteur({ couleur: "#7f95c8", intensite: 7, angle: 0.5, penombre: 0.9, decroissance: 2, ombre: false });
    rue.position.set(-0.4, 1.4, 3.2); s.add(rue);
    var cr = new THREE.Object3D(); s.add(cr); rue.target = cr;
    var sod = K.look.ponctuelle({ couleur: "#ff9a3d", intensite: 1.2, portee: 6 }); sod.position.set(1.6, 1.5, 2.6); s.add(sod);
    // le lac éclaire un peu la mousse autour (une lampe sous la résine)
    var lumLac = K.look.ponctuelle({ couleur: "#6fd8c0", intensite: 0.0045, portee: 0.35 }); lumLac.position.set(m.lac[0], 0.006, m.lac[2]); s.add(lumLac);
    // le fond de la boutique et la rue derrière la vitre : des lumières floues
    function toileFond(graine, lumieres, coul) {
      var c = K.tex.canvas(512, 256), x = c.getContext("2d"), r = K.alea(graine);
      var gr = x.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#050608"); gr.addColorStop(0.6, "#0b0d12"); gr.addColorStop(1, "#08070a");
      x.fillStyle = gr; x.fillRect(0, 0, 512, 256);
      x.globalCompositeOperation = "lighter";
      for (var i = 0; i < lumieres; i++) {
        var lx = r() * 512, ly = 75 + r() * 130, rr = 3 + r() * 13, col = r.choix(coul);
        var gg = x.createRadialGradient(lx, ly, 0, lx, ly, rr); gg.addColorStop(0, col); gg.addColorStop(0.5, col.replace(/[\d.]+\)$/, "0.25)")); gg.addColorStop(1, "rgba(0,0,0,0)");
        x.fillStyle = gg; x.beginPath(); x.arc(lx, ly, rr, 0, 7); x.fill();
      }
      return K.tex.texture(c, { clamp: true });
    }
    var fondG = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(6, 3)), K.garder(new THREE.MeshBasicMaterial({ map: toileFond("fond-gauche", 9, ["rgba(255,170,90,0.9)", "rgba(255,210,150,0.8)", "rgba(140,170,255,0.6)"]), color: new THREE.Color(1, 1, 1).multiplyScalar(0.9), fog: false })));
    fondG.position.set(-2.2, 0.2, 0); fondG.rotation.y = PI / 2; s.add(fondG);
    var fondF = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(6, 3)), K.garder(new THREE.MeshBasicMaterial({ map: toileFond("fond-fond", 6, ["rgba(255,200,140,0.7)", "rgba(255,150,80,0.8)"]), color: new THREE.Color(1, 1, 1).multiplyScalar(0.7), fog: false })));
    fondF.position.set(0, 0.2, -1.6); s.add(fondF);
    var fondV = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(8, 3)), K.garder(new THREE.MeshBasicMaterial({ map: toileFond("fond-rue", 12, ["rgba(255,154,61,1)", "rgba(255,194,122,0.9)", "rgba(127,150,210,0.5)"]), color: new THREE.Color(1, 1, 1).multiplyScalar(1.2), fog: false })));
    fondV.position.set(0, 0.3, 2.8); fondV.rotation.y = PI; s.add(fondV);
    return {
      scene: s, maquette: m,
      look: { bloom: 0.55, rayon: 0.5, seuil: 0.9, exposition: 1.1, contraste: 1.14, saturation: 0.95 },
      maj: function (t, c) {
        m.mLac.emissiveIntensity = 1.0 + 0.04 * Math.sin(t * 1.3);
        c.reglerFlou(c);
      }
    };
  }

  // ─── L'EAU : des rides en carte de normales (la Rive, une flaque), qu'on fait glisser
  function texRides(K, graine, rep) {
    var W = 256, n = K.tex.couche(W, W, { periode: 5, octaves: 4, graine: graine, rapportX: 0.6 });
    var c = K.tex.canvas(W, W), x = c.getContext("2d"), im = x.createImageData(W, W), d = im.data;
    var h = function (a, b) { return n[((b + W) % W) * W + ((a + W) % W)]; };
    for (var y = 0; y < W; y++) for (var i = 0; i < W; i++) {
      var dx = (h(i + 1, y) - h(i - 1, y)) * 4, dy = (h(i, y + 1) - h(i, y - 1)) * 4, nz = 1 / Math.sqrt(dx * dx + dy * dy + 1), p = (y * W + i) * 4;
      d[p] = (-dx * nz * 0.5 + 0.5) * 255; d[p + 1] = (-dy * nz * 0.5 + 0.5) * 255; d[p + 2] = (nz * 0.5 + 0.5) * 255; d[p + 3] = 255;
    }
    x.putImageData(im, 0, 0);
    return K.tex.texture(c, { donnee: true, repete: rep });
  }
  // ─── LE REFLET DANS LA VITRINE : « dans le reflet de la vitre, la tribune Est, la vraie,
  // derrière toi » (la carte de la vitrine, au prologue). Un vrai reflet, plan : la rue, la
  // Rive et l'autre rive rendues une fois depuis la caméra miroir d'un point de vue du
  // trottoir (le verre est en z = zVerre, sa normale vers −z), puis projetées sur le verre.
  // Une seule image, à la préparation : le reflet ne coûte rien pendant le film ; vu d'un
  // peu ailleurs, il est un peu faux, ce que la pluie et le verre pardonnent.
  //  → { materiau (à poser sur un plan du verre), capturer(scene, caches[]) }
  function refletPlan(K, ctx, zVerre, vue) {
    var THREE = ctx.THREE, W = ctx.qualite.nom === "basse" ? 512 : 1024;
    var rt = K.garder(new THREE.WebGLRenderTarget(W, W / 2, { type: THREE.HalfFloatType }));
    var cam = new THREE.PerspectiveCamera(64, 2, Math.max(0.5, zVerre - vue.pos[2] - 0.2), 400);
    cam.position.set(vue.pos[0], vue.pos[1], 2 * zVerre - vue.pos[2]);
    cam.lookAt(vue.cible[0], vue.cible[1], 2 * zVerre - vue.cible[2]);
    cam.updateMatrixWorld(true); cam.updateProjectionMatrix();
    var biais = new THREE.Matrix4().set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
    var mat = K.garder(new THREE.ShaderMaterial({
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false,
      uniforms: { tRef: { value: rt.texture }, uMat: { value: biais.clone().multiply(cam.projectionMatrix).multiply(cam.matrixWorldInverse) }, uForce: { value: 0.3 } },
      vertexShader: "uniform mat4 uMat; varying vec4 vP; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vP = uMat * w; gl_Position = projectionMatrix * viewMatrix * w; }",
      fragmentShader: "uniform sampler2D tRef; uniform float uForce; varying vec4 vP; void main(){ vec3 c = texture2DProj(tRef, vP).rgb; gl_FragColor = vec4(max(c, vec3(0.0)) * uForce, 1.0); }"
    }));
    var fait = false;
    return {
      materiau: mat,
      capturer: function (scene, caches) {
        if (fait) return;
        fait = true;
        var r = ctx.rendu.renderer, vis = caches.map(function (o) { var v = o.visible; o.visible = false; return v; });
        r.setRenderTarget(rt); r.clear(); r.render(scene, cam); r.setRenderTarget(null);
        caches.forEach(function (o, i) { o.visible = vis[i]; });
      }
    };
  }

  // ─── L'AGENCE TESSANDIER, quai de la Rive : un rez-de-chaussée de boutique (la vitrine
  // éclairée, la maquette sur son socle, le chevalet de l'affiche), deux étages de brique.
  // Repère local : la façade en z = 0, tournée vers +z ; l'immeuble va vers −z.
  //  → Group { verre, lampes (les spots de la vitrine), maquette, refletMat }
  function agence(K, ctx) {
    var THREE = ctx.THREE, P = K.props, g = new THREE.Group();
    var W = 10, H0 = 3.6, E = 2, he = 3.0, D = 7;
    var mB = K.mat.brique({ couleur: "#5c3428", graine: "agence", suie: 0.7 });
    var mPierre = K.mat.beton({ couleur: "#8a8478", graine: "pierre-agence" });
    var haut = new THREE.Mesh(P.boiteUV(W, E * he + 0.4, D, 2.4), mB); haut.position.set(0, H0 + (E * he + 0.4) / 2, -D / 2); haut.castShadow = true; haut.receiveShadow = true; g.add(haut);
    var fen = K.tex.fenetres({ colonnes: 4, rangees: E, allumees: 0.25, mur: "#000000", graine: "agence-fen" });
    var mF = K.garder(new THREE.MeshStandardMaterial({ map: fen.map, emissive: new THREE.Color("#ffffff"), emissiveMap: fen.lumiere, emissiveIntensity: 0.8, roughness: 0.25, metalness: 0.1, transparent: true }));
    mF.onBeforeCompile = function (sh) { sh.fragmentShader = sh.fragmentShader.replace("#include <map_fragment>", "#include <map_fragment>\n if (diffuseColor.r + diffuseColor.g + diffuseColor.b < 0.02) discard;"); };
    var pf = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(W * 0.96, E * he)), mF); pf.position.set(0, H0 + 0.2 + E * he / 2, 0.02); g.add(pf);
    P.boite(g, W + 0.3, 0.35, 0.45, mPierre, 0, H0 + E * he + 0.55, 0.06);
    P.boite(g, W + 0.1, 0.16, 0.22, mPierre, 0, H0 + 0.1, 0.05);
    // le rez-de-chaussée : trois piles de brique, l'allège de pierre, le bandeau de l'enseigne
    P.boite(g, 1.1, 2.9, 0.5, mB, -4.45, 1.45, -0.25);
    P.boite(g, 0.4, 2.9, 0.5, mB, 2.7, 1.45, -0.25);
    P.boite(g, 1.1, 2.9, 0.5, mB, 4.45, 1.45, -0.25);
    P.boite(g, 6.4, 0.55, 0.5, mPierre, -0.7, 0.275, -0.25);
    var te = K.tex.texte({ lignes: ["IMMOBILIER TESSANDIER"], fond: "#17231d", encre: "#d6c79c", largeur: 1024, hauteur: 112, graine: "enseigne-tessandier" });
    var mEns = K.garder(new THREE.MeshStandardMaterial({ map: te.map, roughness: 0.55, metalness: 0.1, emissive: new THREE.Color("#ffffff"), emissiveMap: te.map, emissiveIntensity: 0.05 }));
    var ens = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(9.6, 0.62)), mEns); ens.position.set(0, 3.24, 0.04); g.add(ens);
    P.boite(g, 10, 0.72, 0.1, K.garder(new THREE.MeshStandardMaterial({ color: "#17231d", roughness: 0.6 })), 0, 3.24, -0.03);
    // la boutique, derrière le verre
    var piece = P.piece({ largeur: 9.0, profondeur: 6.4, hauteur: 2.95, murs: K.mat.papier({ couleur: "#5a4c3c", graine: "agence-murs", repete: [3, 2] }), sol: K.mat.bois({ couleur: "#2a1c12", lames: 6, graine: "agence-parquet", repete: [4, 4] }) });
    piece.position.set(0, 0, -3.45); g.add(piece);
    // la maquette sur son socle blanc, le lac vers la rue
    P.boite(g, 1.6, 1.0, 1.2, K.garder(new THREE.MeshStandardMaterial({ color: "#d4cfc4", roughness: 0.7 })), -0.7, 0.5, -1.05);
    var maq = maquette(K, ctx, { capot: false });
    maq.position.set(-0.7, 1.03, -1.05); g.add(maq);
    // le capot de plexiglas
    var capot = new THREE.Mesh(K.garder(new THREE.BoxGeometry(1.44, 0.22, 1.04)), K.garder(new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.04, transparent: true, opacity: 0.1, envMapIntensity: 1.4, depthWrite: false })));
    capot.position.set(-0.7, 1.14, -1.05); capot.renderOrder = 3; g.add(capot);
    // l'affiche sur son chevalet : la promesse de la seconde tranche
    var ta = K.tex.texte({ lignes: ["LES TERRASSES", "DE LA RIVE", "SECONDE TRANCHE", "VUE IMPRENABLE", "SUR L'EAU"], fond: "#efe9da", encre: "#20352b", largeur: 512, hauteur: 680, graine: "affiche-terrasses" });
    var aff = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.62, 0.82)), K.garder(new THREE.MeshStandardMaterial({ map: ta.map, roughness: 0.8 })));
    aff.position.set(1.55, 1.25, -0.75); aff.rotation.set(-0.12, -0.3, 0); g.add(aff);
    var mChev = K.mat.bois({ couleur: "#3a2616", lames: 1, graine: "chevalet" });
    P.boite(g, 0.04, 1.6, 0.04, mChev, 1.33, 0.8, -0.72, { rz: 0.06 }); P.boite(g, 0.04, 1.6, 0.04, mChev, 1.77, 0.8, -0.86, { rz: -0.06 });
    // le fond : un bureau, un ficus, un cadre ; dans l'ombre
    var bur = P.bureau({ lampe: 0 }); bur.position.set(2.2, 0, -4.4); bur.rotation.y = PI; g.add(bur);
    var mFeuille = K.garder(new THREE.MeshStandardMaterial({ color: "#1d2a1a", roughness: 0.7 }));
    var rf = K.alea("ficus");
    P.cylindre(g, 0.22, 0.17, 0.4, K.garder(new THREE.MeshStandardMaterial({ color: "#5a3a26", roughness: 0.8 })), -3.6, 0.2, -2.6);
    for (var f = 0; f < 26; f++) { var fl = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.13 + rf() * 0.1, 6, 4)), mFeuille); fl.position.set(-3.6 + (rf() - 0.5) * 0.7, 0.8 + rf() * 1.2, -2.6 + (rf() - 0.5) * 0.6); fl.scale.set(1, 0.5, 1); g.add(fl); }
    // le verre de la vitrine : presque rien, un reflet peint (l'autre rive), la pluie dessus
    var mVerre = K.garder(new THREE.MeshPhysicalMaterial({ color: "#0c0e12", roughness: 0.03, metalness: 0, transparent: true, opacity: 0.14, envMapIntensity: 1.8, depthWrite: false }));
    var verre = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(6.4, 2.3)), mVerre); verre.position.set(-0.7, 1.7, -0.02); verre.renderOrder = 4; g.add(verre);
    // le reflet (son matériau est posé par le décor, qui connaît la scène) : un plan sur le verre
    var refl = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(6.4, 2.3)), mVerre); refl.position.set(-0.7, 1.7, -0.01); refl.renderOrder = 5; g.add(refl);
    // le fond de la boutique : une lueur chaude au plafond, l'affiche de la première tranche
    // sous sa lampe-tableau (la vitrine se lit comme une boutique, pas comme un trou)
    var fond = K.look.ponctuelle({ couleur: "#FFC894", intensite: 7, portee: 8 }); fond.position.set(0.2, 2.5, -3.0); g.add(fond);
    var tp1 = K.tex.texte({ lignes: ["LES TERRASSES DE LA RIVE", "PREMIÈRE TRANCHE · 1993", "DERNIERS LOTS"], fond: "#d9d2c0", encre: "#2b3a30", largeur: 768, hauteur: 512, graine: "affiche-1993" });
    var a1 = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(1.2, 0.8)), K.garder(new THREE.MeshStandardMaterial({ map: tp1.map, roughness: 0.7 })));
    a1.position.set(-1.6, 1.8, -6.6); g.add(a1);
    var lt = K.look.projecteur({ couleur: "#FFD9A8", intensite: 2.4, angle: 0.7, penombre: 0.8, decroissance: 2, ombre: false }); lt.position.set(-1.6, 2.6, -6.2); g.add(lt); g.tableau = lt;
    var ca1 = new THREE.Object3D(); ca1.position.set(-1.6, 1.7, -6.65); g.add(ca1); lt.target = ca1;
    // la porte vitrée, à droite
    var mCadre = K.mat.bois({ couleur: "#1e2a22", lames: 1, graine: "porte-agence" });
    P.boite(g, 1.0, 0.1, 0.08, mCadre, 3.4, 2.55, -0.08); P.boite(g, 0.08, 2.6, 0.08, mCadre, 2.94, 1.3, -0.08); P.boite(g, 0.08, 2.6, 0.08, mCadre, 3.86, 1.3, -0.08);
    var vp = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.86, 2.4)), mVerre); vp.position.set(3.4, 1.25, -0.06); g.add(vp);
    // les spots de la vitrine (au plafond de la boutique) ; l'un porte l'ombre
    var lampes = [[-1.2, 2.9, -0.45, 24], [-0.1, 2.9, -0.55, 18]].map(function (p, i) {
      var l = K.look.projecteur({ couleur: "#FFD6A0", intensite: p[3], angle: 0.62, penombre: 0.8, decroissance: 2, ombre: i === 0, loin: 6, ombreTaille: 1024 });
      l.position.set(p[0], p[1], p[2]); g.add(l);
      var c = new THREE.Object3D(); c.position.set(-0.7 + (i ? 0.3 : -0.2), 1.0, -1.05); g.add(c); l.target = c;
      return l;
    });
    // la lumière de la vitrine sur le trottoir mouillé
    var dehors = K.look.projecteur({ couleur: "#FFC48A", intensite: 60, angle: 0.95, penombre: 0.9, decroissance: 2, ombre: false });
    dehors.position.set(-0.7, 2.6, -0.8); g.add(dehors);
    var cd = new THREE.Object3D(); cd.position.set(-0.7, -0.2, 3.2); g.add(cd); dehors.target = cd;
    // la lampe col-de-cygne sur l'enseigne
    var col = K.look.projecteur({ couleur: "#FFE0B0", intensite: 3.2, angle: 0.9, penombre: 0.9, decroissance: 2, ombre: false });
    col.position.set(0, 3.95, 0.7); g.add(col);
    var cc = new THREE.Object3D(); cc.position.set(0, 3.2, 0); g.add(cc); col.target = cc;
    P.cylindre(g, 0.08, 0.12, 0.16, K.mat.metal({ couleur: "#1d2620", rugosite: 0.4 }), 0, 4.0, 0.68, { rx: 0.9 });
    // la pluie sur la vitre, vue du dedans : des gouttes, quelques traînées
    var cg = K.tex.canvas(512, 256), xg = cg.getContext("2d"), rg = K.alea("gouttes-vitre");
    for (var gi = 0; gi < 420; gi++) {
      var gx = rg() * 512, gy = rg() * 256, gr = 0.6 + rg() * 2.2;
      xg.fillStyle = "rgba(200,215,235," + (0.25 + rg() * 0.4) + ")"; xg.beginPath(); xg.arc(gx, gy, gr, 0, 7); xg.fill();
      if (rg() < 0.15) { xg.fillStyle = "rgba(200,215,235,0.18)"; xg.fillRect(gx - 0.5, gy, 1, 6 + rg() * 30); }
    }
    var gouttes = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(6.4, 2.3)), K.garder(new THREE.MeshBasicMaterial({ map: K.tex.texture(cg, { clamp: true }), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.35, side: THREE.BackSide, fog: false })));
    gouttes.position.set(-0.7, 1.7, -0.03); gouttes.renderOrder = 6; g.add(gouttes);
    g.verre = verre; g.reflet = refl; g.lampes = lampes; g.maquette = maq; g.dehors = dehors; g.col = col; g.gouttes = gouttes; g.fond = fond;
    return g;
  }

  // ─── LA TRIBUNE EST, chêne de 1931 : des gradins de planches, des bancs, des poteaux
  // peints au bordeaux du club, un toit en appentis sur des fermes, un bandeau. Repère
  // local : le devant (côté pelouse) en z = 0, tourné vers +z ; les rangs montent vers −z.
  //  o = { longueur: 70, rangs: 12, detail: false (les ferrures, les numéros des places),
  //        numeros: [x0, x1] (la tranche du rang B où l'on peint les numéros) }
  //  → Group { rangs, hautToit, place(rang, numero) → [x, y, z] (le banc, dans le repère local) }
  function tribuneEst(K, ctx, o) {
    o = o || {};
    var THREE = ctx.THREE, P = K.props, g = new THREE.Group();
    var L = o.longueur || 70, N = o.rangs || 12, mh = 0.42, md = 0.78, bas = 1.2, pas = 0.5;
    var mGradin = K.mat.bois({ couleur: "#4f4030", lames: 4, graine: "gradins-1931" });
    var mBanc = K.mat.bois({ couleur: "#6a5640", lames: 2, graine: "bancs-1931" });
    var mPoteau = K.garder(new THREE.MeshStandardMaterial({ color: "#4a1a20", roughness: 0.75 }));
    var mToit = K.garder(new THREE.MeshStandardMaterial({ color: "#23252a", roughness: 0.6, metalness: 0.4 }));
    var mBrique = K.mat.brique({ couleur: "#5a3026", graine: "soubassement-est", suie: 0.8 });
    var geos = { gradin: [], banc: [], poteau: [] };
    function boiteG(liste, w, h, d, x, y, z, metre) { var b = P.boiteUV(w, h, d, metre || 1.2); b.translate(x, y, z); liste.push(b.index ? b.toNonIndexed() : b); }
    // le soubassement de brique, devant
    var sb = new THREE.Mesh(P.boiteUV(L + 0.6, bas, 0.45, 2), mBrique); sb.position.set(0, bas / 2, -0.2); sb.receiveShadow = true; g.add(sb);
    for (var i = 0; i < N; i++) {
      var y = bas + i * mh, z0 = -i * md;
      boiteG(geos.gradin, L, 0.06, md, 0, y, z0 - md / 2, 1.2);                     // la marche
      boiteG(geos.gradin, L, mh, 0.05, 0, y - mh / 2, z0 - md + 0.02, 1.2);        // la contremarche (du rang suivant)
      boiteG(geos.banc, L, 0.06, 0.3, 0, y + 0.43, z0 - md * 0.58, 1.2);           // le banc
      boiteG(geos.banc, L, 0.1, 0.03, 0, y + 0.37, z0 - md * 0.58 + 0.15, 1.2);    // son bandeau, où l'on peint les numéros
      if (o.detail) for (var fx = -L / 2 + 0.75; fx < L / 2; fx += 1.5) boiteG(geos.poteau, 0.05, 0.4, 0.06, fx, y + 0.2, z0 - md * 0.58, 1);
    }
    // le mur du fond, les joues
    var prof = N * md, hT = bas + N * mh;
    boiteG(geos.gradin, L + 0.4, hT + 2.6 - bas, 0.08, 0, bas + (hT + 2.6 - bas) / 2, -prof - 0.05, 1.2);
    [-1, 1].forEach(function (sg) { boiteG(geos.gradin, 0.08, hT + 2.6, prof + 0.6, sg * (L / 2 + 0.2), (hT + 2.6) / 2, -prof / 2 + 0.2, 1.2); });
    // le toit en appentis : plus haut au fond, il déborde sur la pelouse
    var avant = hT + 2.3, fond = hT + 3.1, larg = prof + 1.4, pente = Math.atan2(fond - avant, larg);
    var toit = new THREE.Mesh(K.garder(new THREE.BoxGeometry(L + 1.2, 0.1, Math.hypot(larg, fond - avant))), mToit);
    toit.position.set(0, (avant + fond) / 2, 0.7 - larg / 2); toit.rotation.x = pente; toit.castShadow = true; toit.receiveShadow = true; g.add(toit);
    // les poteaux de devant, leurs jambes de force ; les fermes sous le toit
    for (var px = -L / 2; px <= L / 2 + 0.01; px += 7) {
      boiteG(geos.poteau, 0.24, avant - bas, 0.24, px, bas + (avant - bas) / 2, 0.25, 1);
      boiteG(geos.poteau, 0.14, 0.14, prof + 1.2, px, avant - 0.35, -prof / 2 + 0.1, 1);
      var jf = P.boiteUV(0.12, 2.2, 0.12, 1); jf.rotateX(0.7); jf.translate(px, avant - 1.1, -0.45); geos.poteau.push(jf.toNonIndexed());
    }
    // le bandeau du toit, peint : TRIBUNE EST
    var tb = K.tex.texte({ lignes: ["TRIBUNE EST"], fond: "#4a1a20", encre: "#d8cdb0", largeur: 1024, hauteur: 96, peint: true, graine: "bandeau-est" });
    var bandeau = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(14, 0.62)), K.garder(new THREE.MeshStandardMaterial({ map: tb.map, roughness: 0.8 })));
    bandeau.position.set(0, avant - 0.05, 0.72); g.add(bandeau);
    boiteG(geos.poteau, L + 1.2, 0.6, 0.06, 0, avant - 0.05, 0.69, 1);
    ["gradin", "banc", "poteau"].forEach(function (k) {
      if (!geos[k].length) return;
      var m = new THREE.Mesh(K.gens.fusion(geos[k]), k === "gradin" ? mGradin : k === "banc" ? mBanc : mPoteau);
      m.geometry.computeVertexNormals(); K.garder(m.geometry);
      m.castShadow = true; m.receiveShadow = true; g.add(m);
    });
    // les numéros des places, au pochoir sur le bandeau du banc (le rang B)
    if (o.numeros) {
      var c = K.tex.canvas(2048, 64), x = c.getContext("2d"), n0 = 1, x0 = o.numeros[0], x1 = o.numeros[1];
      x.fillStyle = "rgba(0,0,0,0)"; x.clearRect(0, 0, 2048, 64);
      x.font = "700 44px " + K.habillage.MONO; x.textAlign = "center"; x.textBaseline = "middle"; x.fillStyle = "rgba(226,218,196,0.92)";
      var nb = Math.round((x1 - x0) / pas);
      for (var k = 0; k <= nb; k++) x.fillText((o.premier + k) + "B", (k + 0.5) / (nb + 1) * 2048, 34);
      // l'usure : la peinture partie par endroits
      x.globalCompositeOperation = "destination-out"; var ru = K.alea("pochoir");
      for (var e = 0; e < 900; e++) { x.fillStyle = "rgba(0,0,0," + (0.3 + ru() * 0.7) + ")"; x.fillRect(ru() * 2048, ru() * 64, 1 + ru() * 3, 1 + ru() * 2); }
      var mNum = K.garder(new THREE.MeshStandardMaterial({ map: K.tex.texture(c, { clamp: true }), transparent: true, roughness: 0.7, depthWrite: false }));
      var num = new THREE.Mesh(K.garder(new THREE.PlaneGeometry((nb + 1) * pas, 0.09)), mNum);
      num.position.set((x0 + x1) / 2, bas + 1 * mh + 0.37, -1 * md - md * 0.58 + 0.168); g.add(num);
    }
    g.rangs = N; g.hautToit = avant; g.profondeur = prof; g.bas = bas;
    g.place = function (rang, xx) { return [xx, bas + rang * mh + 0.46, -rang * md - md * 0.58]; };
    return g;
  }

  // ─── LE QUAI DE LA RIVE, la nuit : l'eau, les deux quais, l'agence et sa vitrine,
  // et de l'autre côté le stade (la tribune Est face à l'eau, la Nord, les pylônes
  // éteints), la première tranche des Terrasses au bout. La Rive court le long de x.
  function decorQuai(K, ctx) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: { zenith: "#03040b", horizon: "#151b2c", lueur: "#4a2c18", lueurDir: [0.3, -1], force: 0.9 },
      brouillard: ["#0a0e18", 0.011], environnement: { fenetres: 30, lampes: [{ pos: [0, 12, 80], couleur: "#ff9a3d", intensite: 2.5, taille: 8 }] }, reflets: 1.0,
      ambiance: ["#2a3550", "#0a0806", 0.14] });
    // l'eau de la Rive, plus bas que les quais
    var rides = texRides(K, "rive", [60, 5]);
    var mEau = K.garder(new THREE.MeshPhysicalMaterial({ color: "#05090d", roughness: 0.16, metalness: 0, normalMap: rides, normalScale: new THREE.Vector2(0.35, 0.35), envMapIntensity: 2.4, clearcoat: 0.5, clearcoatRoughness: 0.1 }));
    var eau = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(420, 28)), mEau); eau.rotation.x = -PI / 2; eau.position.set(0, -2.0, 0); eau.receiveShadow = true; s.add(eau);
    var mQuai = K.mat.beton({ couleur: "#5e5a50", graine: "quai-pierre", banches: 3, taches: 1.2 });
    [-1, 1].forEach(function (sg) { var q = new THREE.Mesh(P.boiteUV(420, 2.4, 1.2, 2), mQuai); q.position.set(0, -1.0, sg * 14.6); q.receiveShadow = true; s.add(q); });
    // le quai de l'agence : la rue le long de l'eau, la rambarde, les façades
    var rue = P.rue({ longueur: 220, largeur: 8, trottoir: 2.5, flaques: 0.5, graine: "quai" }); rue.rotation.y = PI / 2; rue.position.set(0, 0, 20.5); s.add(rue);
    rue.children[0].material.envMapIntensity = 2.0;
    var mFer = K.mat.metal({ couleur: "#1c1e20", rugosite: 0.5 });
    P.boite(s, 220, 0.05, 0.05, mFer, 0, 1.0, 14.35); P.boite(s, 220, 0.04, 0.04, mFer, 0, 0.5, 14.35);
    for (var rx = -110; rx <= 110; rx += 2.5) P.cylindre(s, 0.025, 0.025, 1.0, mFer, rx, 0.5, 14.35, { cotes: 6 });
    var ag = agence(K, ctx); ag.rotation.y = PI; ag.position.set(0, 0.15, 27); s.add(ag);
    var voisins = [[-21, 12, 3, "#5a2e24"], [-10.5, 9, 3, "#61342a"], [11, 11, 4, "#5c3226"], [22.5, 12, 3, "#6a3a2c"], [34, 11, 2, "#583026"], [-32.5, 11, 4, "#5e2e22"], [-44, 12, 3, "#64382a"], [46, 13, 3, "#5a2c24"]];
    voisins.forEach(function (v, i) {
      var fa = P.facade({ largeur: v[1], etages: v[2], graine: "quai" + i, brique: v[3], vitrine: true, fenetres: { allumees: 0.22 } });
      fa.rotation.y = PI; fa.position.set(v[0], 0.15, 27); s.add(fa);
    });
    // les lampadaires du quai, côté eau, la crosse au-dessus de la chaussée
    // deux du côté des façades (ils éclairent la brique et le trottoir de l'agence), deux
    // au bord de l'eau, plus loin
    var lamps = [[-38, 15.3, -1], [-9.5, 25.6, 1], [8.5, 25.6, 1], [36, 15.3, -1]].map(function (p, i) {
      var r = P.reverbere({ hauteur: 6.2, bras: 1.4, intensite: i === 2 ? 160 : 130, ombre: false, gresille: i === 1 ? 1 : 0.15, forceCone: 0.09 });
      r.position.set(p[0], 0.15, p[1]); r.rotation.y = p[2] > 0 ? PI / 2 : -PI / 2; s.add(r);
      return r;
    });
    // l'autre rive : le chemin de halage, puis le dos de la tribune Est (son mur de
    // planches, « STADE DE LA RIVE » peint à l'ancienne, la grille) ; la pelouse et la
    // Nord derrière, les pylônes éteints au-dessus
    var halage = new THREE.Mesh(P.planUV(220, 7, 2), K.mat.beton({ couleur: "#4a473f", graine: "halage" })); halage.rotation.x = -PI / 2; halage.position.set(0, 0.0, -17.6); halage.receiveShadow = true; s.add(halage);
    var pel = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(110, 70)), K.mat.pelouse({ bandes: 10, boue: 0.3 })); pel.rotation.x = -PI / 2; pel.position.set(0, 0.02, -66); s.add(pel);
    var est = tribuneEst(K, ctx, { longueur: 70, rangs: 12 }); est.rotation.y = PI; est.position.set(0, 0, -30.5); s.add(est);
    var dosEst = -30.5 + est.profondeur + 0.1;
    var tdos = K.tex.texte({ lignes: ["STADE DE LA RIVE"], largeur: 2048, hauteur: 192, encre: "#e6dcc0", peint: true, graine: "dos-est" });
    var mDos = K.garder(new THREE.MeshStandardMaterial({ map: tdos.map, transparent: true, roughness: 0.9, depthWrite: false }));
    var dos = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(34, 3.2)), mDos); dos.position.set(-10, 5.6, dosEst + 0.02); s.add(dos);
    var mBg = K.mat.brique({ couleur: "#5a3026", graine: "piliers-quai", suie: 1.0, humide: 0.8 });
    [12.4, 17.6].forEach(function (x) { var pi = new THREE.Mesh(P.boiteUV(0.9, 3.0, 0.9, 1.2), mBg); pi.position.set(x, 1.5, dosEst + 0.4); s.add(pi); });
    var mGr = K.mat.metal({ couleur: "#1a1c1e", rugosite: 0.55 });
    for (var gx = 13.0; gx <= 17.05; gx += 0.18) P.cylindre(s, 0.018, 0.018, 2.5, mGr, gx, 1.3, dosEst + 0.4, { cotes: 5 });
    var nord = P.tribune({ largeur: 54, rangs: 16, couleurs: ["#5a5650", "#5a5650"], grillage: false, panneaux: false, graine: "nord-1999" });
    nord.rotation.y = PI / 2; nord.position.set(-58, 0, -66); s.add(nord);
    [[-57, -32], [57, -32], [-57, -100], [57, -100]].forEach(function (p, i) {
      var py = P.pylone({ hauteur: 30, colonnes: 4, rangees: 3, intensite: 0, cone: false, graine: "py-quai" + i });
      py.groupe.position.set(p[0], 0, p[1]); s.add(py.groupe); s.updateMatrixWorld(true); py.viser(0, 0, -66); py.tete.remove(py.lumiere);
    });
    // la première tranche des Terrasses (1993), au bout du stade : du blanc, des balcons
    var fen1 = K.tex.fenetres({ colonnes: 8, rangees: 6, allumees: 0.3, mur: "#d8d2c4", graine: "terrasses-1" });
    var mT1 = K.garder(new THREE.MeshStandardMaterial({ map: fen1.map, emissive: new THREE.Color("#ffffff"), emissiveMap: fen1.lumiere, emissiveIntensity: 0.9, roughness: 0.8 }));
    var mBlanc1 = K.garder(new THREE.MeshStandardMaterial({ color: "#c9c3b5", roughness: 0.85 }));
    [[78, -34, 26, 0.3], [80, -62, 24, -0.25], [104, -48, 22, 0.5]].forEach(function (b) {
      var im = new THREE.Mesh(K.garder(new THREE.BoxGeometry(b[2], 19, 13)), [mBlanc1, mBlanc1, mBlanc1, mBlanc1, mT1, mT1]);
      im.position.set(b[0], 9.5, b[1]); im.rotation.y = b[3]; s.add(im);
    });
    // côté pelouse, les lampes de service de l'Est : une lueur sous le toit, au-dessus du mur
    [-18, 18].forEach(function (x) { var pl = K.look.ponctuelle({ couleur: "#FFB466", intensite: 30, portee: 22 }); pl.position.set(x, est.hautToit - 0.8, -31.2); s.add(pl); });
    // la lampe de la grille, côté halage
    var lampeGrille = K.look.ponctuelle({ couleur: "#FF9A3D", intensite: 45, portee: 16 }); lampeGrille.position.set(15, 4.2, dosEst + 2.0); s.add(lampeGrille);
    var hg = K.look.halo({ couleur: "#FF9A3D", taille: 1.6, intensite: 1.2 }); hg.position.copy(lampeGrille.position); s.add(hg);
    var halLamps = [-30, 2].map(function (x) {
      var r = P.reverbere({ hauteur: 5.5, bras: 1.0, intensite: 170, cone: false, gresille: 0.3 });
      r.position.set(x, 0, -15.0); r.rotation.y = PI / 2; s.add(r);
      return r;
    });
    // le pont de pierre, en aval : trois arches
    var mPont = K.mat.beton({ couleur: "#6e685c", graine: "pont-pierre", banches: 6 });
    var forme = new THREE.Shape(); forme.moveTo(-16, -2.2); forme.lineTo(16, -2.2); forme.lineTo(16, 1.1); forme.lineTo(-16, 1.1); forme.lineTo(-16, -2.2);
    [-9.5, 0, 9.5].forEach(function (c) { var tr = new THREE.Path(); tr.absarc(c, -2.2, 4.1, 0, PI, false); forme.holes.push(tr); });
    var gPont = K.garder(new THREE.ExtrudeGeometry(forme, { depth: 9, bevelEnabled: false, curveSegments: 18 }));
    var pont = new THREE.Mesh(gPont, mPont); pont.rotation.y = PI / 2; pont.position.set(-78, 0, 0); s.add(pont);
    // la pluie, fine ; les ronds sur l'eau et dans les flaques
    s.updateMatrixWorld(true);
    var lumP = [
      { pos: lamps[2].positionLampe(), couleur: "#FF9A3D", intensite: 1.3, rayon: 8 },
      { pos: [0.7, 1.4, 25.8], couleur: "#FFC48A", intensite: 0.45, rayon: 3.5 },
      { pos: lamps[1].positionLampe(), couleur: "#FF9A3D", intensite: 1.1, rayon: 8 },
      { pos: lamps[3].positionLampe(), couleur: "#FF9A3D", intensite: 1.0, rayon: 8 }
    ];
    var pluie = K.particules.pluie({ n: 7000, zone: { min: [-12, -2, -12], max: [12, 10, 12] }, suivre: true, avance: 8, vitesse: [0.8, -10, 0.3], longueur: 0.45, largeur: 0.01, couleur: "#7f8fae", opacite: 0.75, lumieres: lumP });
    s.add(pluie);
    var ronds = K.particules.ronds({ n: 900, zone: { min: [-40, -1.99, -13], max: [40, -1.99, 13] }, periode: 0.6, rayon: 0.12, couleur: "#9aa6c0", opacite: 0.6, lumieres: lumP });
    s.add(ronds);
    var rondsT = K.particules.ronds({ n: 400, zone: { min: [-14, 0.17, 15], max: [14, 0.17, 26.8] }, periode: 0.55, rayon: 0.07, couleur: "#9aa6c0", opacite: 0.7, lumieres: lumP });
    s.add(rondsT);
    // les reflets : les lampadaires et la vitrine sur l'eau et sur le trottoir
    var reflets = [];
    lamps.forEach(function (l) { reflets.push(K.look.reflet({ pos: l.positionLampe(), sol: -2, couleur: "#FF9A3D", intensite: 1.1, largeur: 1.4, longueur: 14 })); });
    halLamps.forEach(function (l) { reflets.push(K.look.reflet({ pos: l.positionLampe(), sol: -2, couleur: "#FF9A3D", intensite: 0.45, largeur: 1.1, longueur: 6 })); });
    var refVitrine = [K.look.reflet({ pos: [0.7, 0, 26.0], sol: 0.17, couleur: "#FFC48A", intensite: 0.9, largeur: 2.6, longueur: 6 }),
      K.look.reflet({ pos: [0.7, 0, 14.5], sol: -2, couleur: "#FFC48A", intensite: 0.3, largeur: 2.0, longueur: 6 })];
    refVitrine.forEach(function (r) { reflets.push(r); });
    reflets.push(K.look.reflet({ pos: [15, 4.2, dosEst + 2.0], sol: -2, couleur: "#FF9A3D", intensite: 0.6, largeur: 1.3, longueur: 12 }));
    reflets.forEach(function (r) { s.add(r); });
    // Gégé, devant la vitrine, l'écharpe au cou ; on ne voit que son dos
    var gege = K.gens.mannequin({ silhouette: true, tenue: "blouson", echarpe: "#7A1F2E", graine: "gege-vitrine" });
    gege.groupe.position.set(0.35, 0.15, 25.85); s.add(gege.groupe);
    // le reflet de l'autre rive dans le verre de la vitrine, vu du trottoir
    var miroir = refletPlan(K, ctx, 27.0, { pos: [0.85, 1.32, 25.0], cible: [0.72, 1.6, 28.1] });
    ag.reflet.material = miroir.materiau;
    // le lac de la maquette, quand tout le reste est éteint : sa lueur dans la vitre noire
    var lueurLac = K.look.halo({ couleur: "#7fe6cf", taille: 0.2, intensite: 0 }); lueurLac.position.set(0.71, 1.2, 28.06); s.add(lueurLac);
    var mq = ag.maquette;
    var D = {
      scene: s, agence: ag, gege: gege, lampadaires: lamps, reflets: reflets, eau: mEau,
      look: { bloom: 0.75, rayon: 0.6, seuil: 0.85, exposition: 1.15, contraste: 1.15, saturation: 0.95 },
      maj: function (t, c) {
        // à la préparation (le premier appel), la rue, la Rive et l'autre rive dans le verre
        miroir.capturer(s, [ag, gege.groupe, pluie, ronds, rondsT]);
        c.reglerFlou(c);
        pluie.maj(t, c.camera); ronds.maj(t); rondsT.maj(t);
        rides.offset.set(t * 0.006, t * 0.011);
        lamps.forEach(function (l) { l.maj(t); }); halLamps.forEach(function (l) { l.maj(t); });
        reflets.forEach(function (r, i) { r.maj(c.camera, 1 - 0.1 * Math.max(0, K.bruit1(t * 3 + i, 9 + i))); });
        gege.repos(t + 4); gege.os.tete.rotation.y *= 0.3; gege.os.tete.rotation.x = 0.12;
        // l'interrupteur de la vitrine, à minuit (un minuteur) : il ne reste que le lac
        var off = c.vitrineEteinte ? c.vitrineEteinte(t) : 0;
        ag.lampes.forEach(function (l, i) { l.intensity = (i ? 18 : 24) * (1 - off); });
        ag.dehors.intensity = 60 * (1 - off);
        ag.fond.intensity = 7 * (1 - off);
        mq.mAllume.emissiveIntensity = 1.4 * (1 - off); mq.mPerle.emissiveIntensity = 0.9 * (1 - off);
        // la vitrine éteinte, le verre ne montre plus que l'autre rive ; le lac reste
        miroir.materiau.uniforms.uForce.value = 0.2 + 1.6 * off;
        ag.tableau.intensity = 2.4 * (1 - off);
        lueurLac.intensite(0.55 * off * (0.95 + 0.05 * Math.sin(t * 1.3)));
        refVitrine.forEach(function (r) { r.maj(c.camera, 1 - off); });
        // l'œil s'habitue au noir : après la vitrine, on ouvre le diaphragme
        D.look.exposition = 1.15 + 0.45 * K.lisse(33.6, 35.2, t);
      }
    };
    return D;
  }

  // ─── LA RIVE, de près : la pelouse sous la pluie (une flaque sur le rond central), la
  // tribune Est et ses bancs numérotés, la 14B ; derrière, la rue et la grille de l'Est
  // avec sa plaque de fonte (TERRAIN DONNÉ AUX ENFANTS DU QUARTIER · 1931)
  function texPlaque(K) {
    var W0 = tailleQ(K, 1024), H0 = Math.round(W0 * 0.375), c = K.tex.canvas(W0, H0), x = c.getContext("2d"), cr = K.tex.canvas(W0, H0), xr = cr.getContext("2d");
    var n = K.tex.couche(W0, H0, { periode: 6, octaves: 4, graine: "fonte" });
    var im = x.createImageData(W0, H0), d = im.data;
    for (var i = 0, j = 0; i < n.length; i++, j += 4) { var v = 26 + n[i] * 30; d[j] = v; d[j + 1] = v * 0.97; d[j + 2] = v * 0.93; d[j + 3] = 255; }
    x.putImageData(im, 0, 0);
    xr.fillStyle = "#555"; xr.fillRect(0, 0, W0, H0);
    // on dessine sur une plaque de 1024 × 384, mise à l'échelle de la texture
    var W = 1024, H = 384, e = W0 / W;
    x.setTransform(e, 0, 0, e, 0, 0); xr.setTransform(e, 0, 0, e, 0, 0);
    // le cadre en relief, les lettres en relief (cirées : plus claires, plus lisses)
    var lignes = ["TERRAIN DONNÉ", "AUX ENFANTS DU QUARTIER", "1931"];
    [x, xr].forEach(function (ct, k) {
      ct.strokeStyle = k ? "#fff" : "#6f6a62"; ct.lineWidth = 16; ct.strokeRect(22, 22, W - 44, H - 44);
      ct.fillStyle = k ? "#fff" : "#8d877c"; ct.textAlign = "center"; ct.textBaseline = "middle";
      lignes.forEach(function (l, li) { ct.font = "700 " + (li === 2 ? 70 : 64) + "px " + K.habillage.MONO; ct.fillText(l, W / 2, 100 + li * 96); });
    });
    // les quatre vis aux coins
    [[60, 60], [W - 60, 60], [60, H - 60], [W - 60, H - 60]].forEach(function (p) { [x, xr].forEach(function (ct, k) { ct.fillStyle = k ? "#ddd" : "#4a463f"; ct.beginPath(); ct.arc(p[0], p[1], 14, 0, 7); ct.fill(); }); });
    return { map: K.tex.texture(c, { clamp: true }), relief: K.tex.texture(cr, { clamp: true, donnee: true }) };
  }
  function decorRive(K, ctx) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: { zenith: "#02030a", horizon: "#121a2e", lueur: "#3a2418", lueurDir: [0, -1], force: 0.9 }, brouillard: ["#0a0f1c", 0.016],
      environnement: { fenetres: 10, lampes: [{ pos: [0, 30, -60], couleur: "#FFC27A", intensite: 2, taille: 10 }] }, reflets: 0.9, ambiance: ["#1c2640", "#050404", 0.13] });
    var pel = P.pelouse({ boue: 0.35 }); pel.rotation.y = PI / 2; pel.position.set(0, 0.02, 0); s.add(pel);
    // la flaque du rond central : de l'eau noire qui tient le ciel
    var flaque = new THREE.Mesh(K.garder(new THREE.CircleGeometry(1, 40)), K.garder(new THREE.MeshPhysicalMaterial({ color: "#05070a", roughness: 0.03, metalness: 0, normalMap: texRides(K, "flaque", [3, 3]), normalScale: new THREE.Vector2(0.12, 0.12), envMapIntensity: 2.6, clearcoat: 1, clearcoatRoughness: 0.02 })));
    flaque.rotation.x = -PI / 2; flaque.scale.set(3.4, 2.2, 1); flaque.position.set(0.6, 0.035, 0.8); s.add(flaque);
    var est = tribuneEst(K, ctx, { longueur: 70, rangs: 12, detail: true, numeros: [-4.5, 4.5], premier: 5 }); est.position.set(0, 0, -36); s.add(est);
    // les lampes de service sous le toit : des flaques de lumière sur les bancs
    var lampesE = [];
    for (var sx = -28; sx <= 28.1; sx += 11.2) {
      var hl = K.look.halo({ couleur: "#FFC27A", taille: 1.2, intensite: 1.1 }); hl.position.set(sx, est.hautToit - 0.6, -36 + 0.4); s.add(hl);
      P.boite(s, 0.5, 0.12, 0.25, K.mat.lumiere({ couleur: "#FFC27A", intensite: 3, toneMapped: false }), sx, est.hautToit - 0.45, -36 + 0.35, { ombre: false });
    }
    var lampe14 = K.look.projecteur({ couleur: "#FFC88A", intensite: 70, angle: 0.7, penombre: 0.8, decroissance: 2, ombre: true, loin: 30, ombreTaille: 1024 });
    lampe14.position.set(0.2, est.hautToit - 0.5, -36 + 0.4); s.add(lampe14);
    var c14 = new THREE.Object3D(); c14.position.set(0, 1.6, -37.4); s.add(c14); lampe14.target = c14;
    [-22, 22].forEach(function (x) { var pl = K.look.ponctuelle({ couleur: "#FFB466", intensite: 40, portee: 26 }); pl.position.set(x, est.hautToit - 0.8, -35.2); s.add(pl); });
    // la Nord, à gauche, dans le noir ; les pylônes éteints
    var nord = P.tribune({ largeur: 54, rangs: 16, couleurs: ["#5a5650", "#5a5650"], grillage: false, panneaux: false, graine: "nord-rive" });
    nord.rotation.y = PI / 2; nord.position.set(-56, 0, 0); s.add(nord);
    // les pylônes : un seul est allumé, celui du coin de la Nord, braqué sur l'Est (la nuit,
    // pour l'entretien) ; les trois autres sont des silhouettes
    var pyl = null;
    [[-57, 34], [57, 34], [-57, -36], [57, -36]].forEach(function (p, i) {
      var allume = i === 0;
      var py = P.pylone({ hauteur: 30, colonnes: 4, rangees: 3, intensite: allume ? 30000 : 0, cone: allume, ombre: allume, longueurCone: 110, rayonCone: 22, forceCone: 0.07, graine: "py-rive" + i });
      py.groupe.position.set(p[0], 0, p[1]); s.add(py.groupe); s.updateMatrixWorld(true);
      if (allume) { py.viser(2, 3, -38); py.lumiere.angle = 0.42; py.lumiere.penombre = 0.6; py.lumiere.shadow.camera.far = 160; py.lumiere.shadow.bias = -0.0006; pyl = py; }
      else { py.viser(0, 0, 0); py.tete.remove(py.lumiere); }
    });
    // derrière l'Est : la rue, la grille, ses piliers de brique, la plaque
    var zg = -36 - est.profondeur - 0.6;
    var rueA = new THREE.Mesh(P.planUV(60, 14, 3), K.mat.asphalte({ flaques: 0.55, graine: "rue-est", reprise: false })); rueA.rotation.x = -PI / 2; rueA.position.set(8, 0.01, zg - 7); rueA.receiveShadow = true; s.add(rueA);
    var mB = K.mat.brique({ couleur: "#5a3026", graine: "piliers-est", suie: 1.0, humide: 0.8 });
    var mGrille = K.mat.metal({ couleur: "#1a1c1e", rugosite: 0.55 });
    [4.6, 11.4].forEach(function (x) { var pi = new THREE.Mesh(P.boiteUV(0.9, 3.0, 0.9, 1.2), mB); pi.position.set(x, 1.5, zg); pi.castShadow = true; pi.receiveShadow = true; s.add(pi); P.boite(s, 1.05, 0.18, 1.05, K.mat.beton({ couleur: "#7a756a", graine: "chapeau" }), x, 3.08, zg); });
    for (var bx = 5.2; bx <= 10.85; bx += 0.16) P.cylindre(s, 0.018, 0.018, 2.5, mGrille, bx, 1.3, zg, { cotes: 6 });
    P.boite(s, 5.9, 0.06, 0.05, mGrille, 8, 2.45, zg); P.boite(s, 5.9, 0.06, 0.05, mGrille, 8, 0.25, zg);
    var tp = texPlaque(K);
    var plaque = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.8, 0.3)), K.garder(new THREE.MeshStandardMaterial({ map: tp.map, bumpMap: tp.relief, bumpScale: 4, roughness: 0.42, metalness: 0.7, roughnessMap: tp.relief })));
    plaque.rotation.y = PI; plaque.position.set(4.6, 1.75, zg - 0.46); s.add(plaque);
    var sodium = K.look.projecteur({ couleur: "#FF9A3D", intensite: 110, angle: 0.9, penombre: 0.7, decroissance: 2, ombre: false });
    sodium.position.set(2.2, 5.6, zg - 5); s.add(sodium);
    var cs = new THREE.Object3D(); cs.position.set(4.6, 1.2, zg); s.add(cs); sodium.target = cs;
    var hs = K.look.halo({ couleur: "#FF9A3D", taille: 2.4, intensite: 1.2 }); hs.position.copy(sodium.position); s.add(hs);
    // la pluie, et les gouttes qui coulent de la plaque
    var lumR = [{ pos: [0.2, est.hautToit - 0.6, -35.6], couleur: "#FFC27A", intensite: 1.6, rayon: 9 }, { pos: [2.2, 5.6, zg - 5], couleur: "#FF9A3D", intensite: 1.6, rayon: 8 }];
    var pluie = K.particules.pluie({ n: 9000, zone: { min: [-12, -0.2, -12], max: [12, 12, 12] }, suivre: true, avance: 7, vitesse: [0.7, -10.5, 0.4], longueur: 0.5, largeur: 0.011, couleur: "#7f8fae", opacite: 0.85, lumieres: lumR });
    s.add(pluie);
    var ronds = K.particules.ronds({ n: 500, zone: { min: [-3.4, 0.04, -1.4], max: [4.6, 0.04, 3.0] }, periode: 0.5, rayon: 0.07, couleur: "#9aa6c0", opacite: 0.8, lumieres: lumR });
    s.add(ronds);
    var gouttes = K.particules.egouttures({ points: [[4.35, 1.6, zg - 0.47], [4.6, 1.6, zg - 0.47], [4.85, 1.6, zg - 0.47]], parPoint: 2, chute: 1.6, vie: 1.4, couleur: "#a8b4cc", opacite: 1, lumieres: lumR });
    s.add(gouttes);
    var refl = K.look.reflet({ pos: [0.2, est.hautToit, -35.6], sol: 0.04, couleur: "#FFC27A", intensite: 0.8, largeur: 1.4, longueur: 18 });
    s.add(refl);
    s.updateMatrixWorld(true);
    var tp0 = new THREE.Vector3(); pyl.tete.getWorldPosition(tp0);
    var reflPy = K.look.reflet({ pos: [tp0.x, tp0.y, tp0.z], sol: 0.04, couleur: "#EEF2FF", intensite: 0.7, largeur: 2.2, longueur: 40 });
    s.add(reflPy);
    return {
      scene: s, tribune: est, zGrille: zg, plaque: plaque,
      look: { bloom: 0.7, rayon: 0.55, seuil: 0.85, exposition: 1.05, contraste: 1.16, saturation: 0.93 },
      maj: function (t, c) {
        c.reglerFlou(c);
        pluie.maj(t, c.camera); ronds.maj(t); gouttes.maj(t); refl.maj(c.camera); reflPy.maj(c.camera);
        lampe14.intensity = 70 * (1 - 0.06 * Math.max(0, K.bruit1(t * 11, 4)));
        pyl.allumer(0.92, t);
      }
    };
  }

  FC.film({
    id: "seconde_tranche",
    livre: "geant_dechu",
    titre: "La seconde tranche",
    duree: 36.4,
    musique: "livre_h5",
    secours: "ville_nuit",
    couleur: VERT,
    affiche: 19.4,
    habillage: { vignette: 0.55, grain: 0.07, ratioPaysage: 2.35, ratioPortrait: 0 },
    sortie: { noir: 1.2 },
    // le minuteur de la vitrine, à minuit : le relais claque, la vitrine s'éteint
    sons: [[33.4, "porte"]],
    textes: [
      { sorte: "lieu", de: 1.0, a: 5.2, texte: "Aubérive, quai de la Rive", sous: "Juillet 1999 · 23 h 10" },
      { sorte: "replique", de: 16.4, a: 21.2, qui: "Gégé", texte: "À la place de l'Est, trois arbres en lichen. Et la 14B, ils la mettent où ?" },
      { sorte: "titre", de: 32.6, a: 36.0, texte: "Aubérive · 1999", sous: "La Maquette", entree: 0.2, sortie: 0.7 }
    ],
    // la coupe de 30 s (l'aperçu de l'App Store) : les mêmes images, des plans resserrés
    montages: { court: [[0.4, 5.2], [6.0, 10.2], [10.6, 15.4], [16.2, 20.8], [21.6, 24.2], [24.6, 27.2], [27.6, 30.6], [32.2, 35.6]] },
    preparer: function (K, ctx) {
      ctx.reglerFlou = flouMacro(K, ctx);
      // à 33,4 s, le minuteur de la vitrine coupe les spots : il ne reste que le lac
      ctx.vitrineEteinte = function (t) { return K.lisse(33.4, 33.48, t); };
      return K.etapes(ctx, [
        function () { ctx.decors.quai = decorQuai(K, ctx); },
        function () { ctx.decors.maquette = decorMaquette(K, ctx); },
        function () { ctx.decors.rive = decorRive(K, ctx); }
      ]);
    },
    plans: [
      // 1 · le quai : au ras de l'eau noire, vers la seule vitrine allumée de la rangée
      { de: 0, a: 5.6, decor: "quai", entree: "noir", transition: 1.4, fixe: 3.4,
        camera: { pos: K_cles([[0, [6, 4.5, -10]], [5.6, [1.6, 0.8, 6.5]]], "douce"), cible: K_cles([[0, [1.0, 3.0, 27]], [5.6, [0.7, 1.6, 27]]], "douce"), fov: 46, epaule: 0.1 } },
      // 2 · la vitrine : Gégé, de dos, devant la maquette ; la pluie, le reflet de l'autre rive
      { de: 5.6, a: 10.4, decor: "quai", entree: "coupe", fixe: 2.6,
        camera: { pos: K_cles([[0, [1.55, 1.42, 20.9]], [4.8, [1.25, 1.4, 22.3]]], "douce"), cible: [0.62, 1.3, 28.0], fov: 38, epaule: 0.12 } },
      // 3 · la seconde tranche : à hauteur de pouce, dans l'allée des Terrasses, vers le lac
      { de: 10.4, a: 16.0, decor: "maquette", entree: "coupe", fixe: 3.0,
        camera: { pos: K_cles([[0, [0.72, 0.024, 0.027]], [5.6, [0.55, 0.027, 0.024]]], "lin"), cible: K_cles([[0, [0.3, 0.03, 0.02]], [5.6, [0.0, 0.012, -0.01]]], "douce"), fov: 56, epaule: 0.04, pres: 0.003, loin: 20 },
        flou: function (l) { return { mise: 0.12 + l * 0.06, ouverture: 0.06, max: 0.012 }; } },
      // 4 · le parc : par-dessus la haie de lichen ; le lac, les trois arbres à la place de l'Est
      { de: 16.0, a: 21.4, decor: "maquette", entree: "coupe", fixe: 3.4,
        camera: { pos: K_cles([[0, [0.205, 0.014, 0.312]], [2.6, [0.18, 0.068, 0.25]], [5.4, [0.03, 0.032, 0.04]]], "douce"), cible: K_cles([[0, [0.16, 0.014, 0.2]], [2.6, [0.0, 0.01, -0.05]], [5.4, [0.0, 0.026, -0.235]]], "douce"), fov: 50, epaule: 0.04, pres: 0.003, loin: 20 },
        flou: function (l, p) { return { mise: K_mix(0.07, 0.27, p), ouverture: 0.05, max: 0.012 }; },
        // en portrait, la fenêtre glisse d'un arbre à l'autre : les trois
        cadrage: { portrait: { x: function (l) { return K_mix(-0.5, 0.5, K_lisse(3.2, 5.4, l)) * K_lisse(2.4, 3.2, l); } } } },
      // 5 · la Rive : les trois arbres de lichen se fondent dans la vraie tribune Est, sous la
      // pluie, éclairée par le seul pylône allumé
      { de: 21.4, a: 24.4, decor: "rive", entree: "fondu", transition: 1.0, fixe: 2.2,
        camera: { pos: K_cles([[0, [1.4, 2.6, -13]], [3.0, [0.8, 3.0, -17]]], "lin"), cible: [0.0, 5.2, -38], fov: 54, epaule: 0.08 } },
      // 6 · la 14B : le banc de chêne, le numéro au pochoir, la pluie dessus
      { de: 24.4, a: 27.4, decor: "rive", entree: "coupe", fixe: 1.8,
        camera: { pos: K_cles([[0, [0.5, 2.32, -35.25]], [3.0, [0.25, 2.22, -35.6]]], "lin"), cible: [0.0, 2.0, -37.05], fov: 28, epaule: 0.1 } },
      // 7 · la plaque de la grille de l'Est : TERRAIN DONNÉ AUX ENFANTS DU QUARTIER · 1931
      { de: 27.4, a: 31.2, decor: "rive", entree: "coupe", fixe: 2.4,
        camera: { pos: function (l, p, c) { var z = c.decors.rive.zGrille; return K_mix3([5.2, 1.8, z - 3.7], [4.75, 1.75, z - 2.95], K_aisance("douce")(p)); },
          cible: function (l, p, c) { var z = c.decors.rive.zGrille; return [4.6, 1.74, z - 0.46]; }, fov: 30, epaule: 0.1 } },
      // 8 · le reflet : devant la vitrine, la maquette allumée ; le minuteur coupe la vitrine,
      // il ne reste que le lac de résine — et dans le verre noir, derrière les petits
      // immeubles blancs, la vraie tribune de l'autre côté de l'eau
      { de: 31.2, a: 36.4, decor: "quai", entree: "noir", transition: 1.0, fixe: 3.0,
        camera: { pos: K_cles([[0, [0.98, 1.3, 24.55]], [5.2, [0.86, 1.28, 25.05]]], "lin"), cible: [0.72, 1.5, 28.1], fov: 30, epaule: 0.06 } }
    ]
  });

  // les aides de la trousse, lues quand le film tourne (la trousse est chargée avant le film)
  function K_() { return FC.kit; }
  function K_cles(p, a) { var f = null; return function (t) { if (!f) f = K_().cles(p, a); return f(t); }; }
  function K_mix(a, b, t) { return a + (b - a) * t; }
  function K_mix3(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function K_aisance(n) { return K_().aisance(n); }
  function K_lisse(a, b, x) { return K_().lisse(a, b, x); }
})(typeof window !== "undefined" ? window : this);
