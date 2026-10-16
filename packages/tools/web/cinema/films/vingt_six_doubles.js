/* ═══════════════════════════════════════════════════════════════════════════
   FILM — « Vingt-six doubles » (livre 7, « Chambre 12 », 2011, le sélectionneur
   après le fiasco ; la couleur du livre : #FF79B0).

   Mars 2011, la veille du premier entraînement : les Cobalts arrivent à l'hôtel
   de la Rive, où le sélectionneur les attend depuis dix jours. Ce que le film
   montre, et pourquoi (docs/histoires/00_les_dix_histoires.md, « Histoire 7 ») :
     · le parking de l'hôtel au crépuscule, sous la bruine : le bus de 2010 garé
       de travers, la banderole MONDIAL au pare-brise (le prologue, « le bus »),
       l'enseigne de l'hôtel qui s'allume, rose ;
     · dans le bus : un nom au sparadrap sur chaque appui-tête, et au dernier
       rang, seul, RANCÉ (la réponse du prologue ; le bus de 2012 la paiera :
       « à la place qui était celle du petit ») ;
     · l'arrivée : des survêtements sous la pluie, un sac à la main, qui passent
       devant le bus ; deux détournent la tête, un s'arrête pour le regarder (les
       mutins, les nouveaux : la question du livre) ;
     · le tableau des clés : vingt-six crochets de laiton, vingt-six doubles, et
       le cahier de Sandrine Lavergne, l'encre bleue, « minuit — 26 » ;
     · la fenêtre de la 12 qui s'allume au deuxième, une silhouette à la vitre ;
       Tibo Rancé, la ligne du prologue (« la fenêtre ») ;
     · ce qu'il voit d'en haut : le coin du terrain annexe du Racing sous la
       pluie, l'arc, la ligne de touche qui s'en va vers l'autre lampadaire ;
     · « Aubérive · 2011 / Chambre 12 ».
   Il se joue avant la carte du brassard (sl.h7.a1_brassard*, 2011, créneau 1 :
   100 % des carrières, mesuré sur 300), donc avant la scène jouée du salon
   (h7.ci.brassard, la veille au soir) : l'arrivée, puis le salon. Il ne
   devance rien : la nuit du 14 novembre n'est pas là ; le petit est vivant, à
   sa fenêtre, son carnet sous le bras, et personne ne prend de double.

   LES PLANS (37 s ; la musique : livre_h7, 84 à la noire, l'introduction au
   maillet 5,7 s, puis le groove ; les trois coups frappés à 17,1 s, la réponse
   à 22,9 s, la caisse « gated » à 28,6 s : les coupes tombent dessus)
     1   0,0–5,7   le parking, de haut, qui descend : le bus de travers, MONDIAL,
                   l'hôtel ; l'enseigne rose s'allume (1,8 s) · crépuscule bleu,
                   bruine, deux sodiums · carton « Aubérive, hôtel de la Rive /
                   Mars 2011 · la veille du premier entraînement »
     2   5,7–11,4  le bus, dedans : l'allée, les appuis-tête au sparadrap, et RANCÉ
                   seul au dernier rang · le gris de la vitre, un sodium par le côté
     3  11,4–17,1  l'arrivée : quatre survêtements sous la pluie, un sac à la main,
                   contre la porte éclairée ; deux détournent la tête, le troisième
                   s'arrête et regarde le bus · la porte qui se referme (16,4 s)
     4  17,1–22,9  le cahier de nuit, l'encre bleue : « minuit — 26 » ; le tableau,
                   vingt-six doubles qui bougent encore (un courant d'air) ; on
                   s'approche de la 12 · le plafonnier, la lampe du comptoir
     5  22,9–28,6  la façade du terrain : au deuxième, la 12 s'allume (23,5 s) ; une
                   silhouette à la vitre (24,6 s) · réplique (Tibo Rancé) :
                   « J'ai appris là, en bas. En novembre, je joue ? »
     6  28,6–37,0  dans la 12 : Tibo de dos à la vitre, une main au montant, le
                   lampadaire du fond contre sa tête ; on passe son épaule (le
                   carnet, l'élastique rouge) : en bas, le coin du terrain sous la
                   pluie · titre « Aubérive · 2011 / Chambre 12 »
   La coupe de 30 s (montages.court) : les mêmes plans, resserrés.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var FC = global.FusibleCinema;
  var PI = Math.PI;
  var ROSE = "#FF79B0";
  var COBALT = "#1d3570";

  // ─── L'HÔTEL DE LA RIVE (le dos sur le parking, le flanc sur le terrain annexe) ───
  // le corps : x de -14 à 14, z de -12 à 0 (la façade du parking regarde +z) ; le rez-de-
  // chaussée fait 3,6 m, puis trois étages de 3,1 m. Le flanc est (x = 14) regarde le
  // terrain annexe ; la 12 y est au deuxième étage, la deuxième fenêtre depuis le parking.
  var HOTEL = { W: 28, D: 12, rdc: 3.6, he: 3.1, E: 3 };
  HOTEL.H = HOTEL.rdc + HOTEL.E * HOTEL.he;
  var F12 = { x: 14, y: 3.6 + 3.1 + 1.55, z: -4.5 };

  function vitreSombre(K, THREE) {
    return K.garder(new THREE.MeshPhysicalMaterial({ color: "#0b0f16", roughness: 0.08, metalness: 0.1, envMapIntensity: 1.4 }));
  }
  // une fenêtre allumée : une lumière de chambre, un rideau à moitié tiré
  function toileFenetre(K, graine, chaude) {
    var c = K.tex.canvas(128, 160), x = c.getContext("2d"), r = K.alea(graine);
    var g = x.createLinearGradient(0, 0, 0, 160);
    g.addColorStop(0, chaude ? "#ffcf8a" : "#a9b8d8"); g.addColorStop(1, chaude ? "#9a5524" : "#3d4a66");
    x.fillStyle = g; x.fillRect(0, 0, 128, 160);
    x.fillStyle = "rgba(40,18,8,0.55)"; x.fillRect(r() < 0.5 ? 0 : 70, 0, 58, 160);
    x.fillStyle = "rgba(0,0,0,0.85)"; x.fillRect(61, 0, 6, 160);
    return K.tex.texture(c, { clamp: true });
  }

  function hotel(K, ctx, o) {
    var THREE = ctx.THREE, P = K.props, g = new THREE.Group(), W = HOTEL.W, D = HOTEL.D, H = HOTEL.H;
    var mB = K.mat.brique({ couleur: "#6b3a2c", graine: "hotel-rive", suie: 0.9, humide: 0.8 });
    var corps = new THREE.Mesh(P.boiteUV(W, H, D, 2.4), mB); corps.position.set(0, H / 2, -D / 2); corps.castShadow = true; corps.receiveShadow = true; g.add(corps);
    var mPierre = K.mat.beton({ couleur: "#8d877a", graine: "pierre-hotel" });
    P.boite(g, W + 0.4, 0.4, D + 0.4, mPierre, 0, H + 0.1, -D / 2);
    P.boite(g, W + 0.12, 0.2, 0.18, mPierre, 0, HOTEL.rdc, 0.05);
    P.boite(g, 0.18, 0.2, D + 0.12, mPierre, W / 2 + 0.05, HOTEL.rdc, -D / 2);
    // les étages du parking : une toile de fenêtres (la nuit, une sur trois allumée)
    var fen = K.tex.fenetres({ colonnes: 9, rangees: 3, allumees: o.allumees == null ? 0.4 : o.allumees, mur: "#000000", graine: "hotel-parking" });
    var mF = K.garder(new THREE.MeshStandardMaterial({ map: fen.map, emissive: new THREE.Color("#ffffff"), emissiveMap: fen.lumiere, emissiveIntensity: 1.1, roughness: 0.2, metalness: 0.1, transparent: true }));
    mF.onBeforeCompile = function (sh) { sh.fragmentShader = sh.fragmentShader.replace("#include <map_fragment>", "#include <map_fragment>\n if (diffuseColor.r + diffuseColor.g + diffuseColor.b < 0.02) discard;"); };
    var pf = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(W * 0.96, HOTEL.E * HOTEL.he)), mF); pf.position.set(0, HOTEL.rdc + HOTEL.E * HOTEL.he / 2, 0.03); g.add(pf);
    // le rez-de-chaussée du parking : la porte de service éclairée, deux fenêtres de l'office
    var mCadre = K.mat.peint({ couleur: "#1c1612", rugosite: 0.6 });
    var tp = K.tex.canvas(64, 128), tpx = tp.getContext("2d"), gp = tpx.createLinearGradient(0, 0, 0, 128);
    gp.addColorStop(0, "#c98a4a"); gp.addColorStop(0.55, "#f2c182"); gp.addColorStop(1, "#ffe2b0");
    tpx.fillStyle = gp; tpx.fillRect(0, 0, 64, 128);
    tpx.fillStyle = "rgba(30,14,6,0.8)"; tpx.fillRect(40, 30, 24, 98);
    var porte = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(1.3, 2.3)), K.mat.lumiere({ map: K.tex.texture(tp, { clamp: true }), couleur: "#ffffff", intensite: 1.3 }));
    porte.position.set(7, 1.15, 0.04); g.add(porte); K.garder(porte.geometry);
    P.boite(g, 1.5, 0.1, 0.1, mCadre, 7, 2.35, 0.08); P.boite(g, 0.1, 2.4, 0.1, mCadre, 6.3, 1.2, 0.08); P.boite(g, 0.1, 2.4, 0.1, mCadre, 7.7, 1.2, 0.08);
    // la marquise de la porte
    P.boite(g, 2.4, 0.08, 1.2, K.mat.metal({ couleur: "#2a2c30", rugosite: 0.5 }), 7, 2.75, 0.6);
    [[-6, "o1"], [-1, "o2"], [12, "o3"]].forEach(function (f) {
      var v = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(1.6, 1.4)), K.mat.lumiere({ map: toileFenetre(K, f[1], true), intensite: 0.75 }));
      v.position.set(f[0], 1.7, 0.04); g.add(v);
      P.boite(g, 1.7, 0.08, 0.1, mCadre, f[0], 2.42, 0.07); P.boite(g, 1.7, 0.08, 0.1, mCadre, f[0], 0.98, 0.07);
    });
    // l'enseigne : HÔTEL DE LA RIVE, au néon rose, au-dessus de la porte
    var nt = K.tex.neon({ texte: "HÔTEL DE LA RIVE", couleur: ROSE, largeur: 1024, hauteur: 160 });
    var mN = K.garder(new THREE.MeshBasicMaterial({ map: nt.lumiere, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, color: new THREE.Color(1, 1, 1).multiplyScalar(2.4) }));
    var neon = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(6.2, 0.97)), mN); neon.position.set(7, 4.55, 0.12); g.add(neon);
    P.boite(g, 6.4, 1.1, 0.06, K.mat.metal({ couleur: "#141518", rugosite: 0.7 }), 7, 4.55, 0.06);
    var lNeon = K.look.ponctuelle({ couleur: ROSE, intensite: 0, portee: 16 }); lNeon.position.set(7, 4.4, 1.2); g.add(lNeon);
    // une applique au coin, sur la brique : elle tient le bout de la façade (les arrivants s'y découpent)
    var mApp = K.mat.lumiere({ couleur: "#FFC98A", intensite: 4, toneMapped: false });
    P.boite(g, 0.22, 0.32, 0.16, mApp, 12.6, 3.0, 0.12, { ombre: false });
    var lApp = K.look.projecteur({ couleur: "#FFB46A", intensite: 26, angle: 1.1, penombre: 0.9, ombre: false });
    lApp.position.set(12.6, 3.1, 0.35); g.add(lApp);
    var cApp = new THREE.Object3D(); cApp.position.set(12.0, 0.8, 0.0); g.add(cApp); lApp.target = cApp;
    var hApp = K.look.halo({ couleur: "#FFC98A", taille: 1.1, intensite: 0.8 }); hApp.position.set(12.6, 3.0, 0.3); g.add(hApp);
    var hNeon = K.look.halo({ couleur: ROSE, taille: 7, intensite: 0 }); hNeon.position.set(7, 4.55, 0.3); g.add(hNeon);
    // la porte : la lumière qui sort sur le parking mouillé
    var lPorte = K.look.projecteur({ couleur: "#FFB46A", intensite: 42, angle: 0.85, penombre: 0.7, ombre: false, loin: 20 });
    lPorte.position.set(7, 2.5, 0.5); g.add(lPorte);
    var cP = new THREE.Object3D(); cP.position.set(7, 0, 6); g.add(cP); lPorte.target = cP;
    // le flanc du terrain : douze fenêtres (quatre par étage), la 12 au deuxième
    var mSombre = vitreSombre(K, THREE), fenetres = [];
    var mLum = K.mat.lumiere({ map: toileFenetre(K, "flanc", true), intensite: 0.8 });
    for (var et = 0; et < 3; et++) for (var c = 0; c < 4; c++) {
      var z = -1.5 - c * 3, y = HOTEL.rdc + et * HOTEL.he + 1.55, est12 = et === 1 && c === 1;
      var cadre = new THREE.Group(); cadre.position.set(W / 2, y, z); g.add(cadre);
      P.boite(cadre, 0.16, 0.1, 1.3, mCadre, 0.03, 0.82, 0); P.boite(cadre, 0.22, 0.1, 1.4, mPierre, 0.06, -0.82, 0);
      P.boite(cadre, 0.16, 1.7, 0.08, mCadre, 0.03, 0, -0.62); P.boite(cadre, 0.16, 1.7, 0.08, mCadre, 0.03, 0, 0.62);
      if (est12) { fenetres.push(cadre); continue; }
      var allumee = (et * 4 + c) % 5 === 2;
      var vit = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(1.16, 1.56)), allumee ? mLum : mSombre);
      vit.rotation.y = PI / 2; vit.position.set(0.01, 0, 0); cadre.add(vit);
    }
    // la 12 : une vitre sombre, puis la lumière de la chambre, puis quelqu'un à la vitre
    var c12 = fenetres[0];
    var vSombre = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(1.16, 1.56)), mSombre); vSombre.rotation.y = PI / 2; vSombre.position.x = 0.0; c12.add(vSombre);
    var t12 = K.tex.canvas(256, 320), x12 = t12.getContext("2d");
    var g12 = x12.createRadialGradient(150, 70, 8, 128, 160, 240); g12.addColorStop(0, "#fff0c8"); g12.addColorStop(0.35, "#f0b26a"); g12.addColorStop(1, "#5a2a12");
    x12.fillStyle = g12; x12.fillRect(0, 0, 256, 320);
    x12.fillStyle = "rgba(60,24,10,0.6)"; x12.fillRect(0, 0, 70, 320);                 // le rideau
    x12.fillStyle = "rgba(0,0,0,0.9)"; x12.fillRect(122, 0, 12, 320);
    var mAllume = K.garder(new THREE.MeshBasicMaterial({ map: K.tex.texture(t12, { clamp: true }), color: new THREE.Color(0, 0, 0), transparent: true, opacity: 1 }));
    var vAllume = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(1.16, 1.56)), mAllume); vAllume.rotation.y = PI / 2; vAllume.position.x = 0.012; c12.add(vAllume);
    // la silhouette : la tête, les épaules, une main posée sur le montant
    var ts = K.tex.canvas(256, 320), xs = ts.getContext("2d");
    xs.fillStyle = "#050302";
    xs.beginPath(); xs.ellipse(150, 118, 30, 36, 0.05, 0, 7); xs.fill();
    xs.beginPath(); xs.moveTo(78, 320); xs.quadraticCurveTo(84, 196, 118, 178); xs.lineTo(184, 178); xs.quadraticCurveTo(222, 196, 226, 320); xs.fill();
    xs.fillRect(138, 146, 26, 40);
    xs.beginPath(); xs.moveTo(214, 214); xs.quadraticCurveTo(236, 150, 246, 96); xs.lineTo(256, 96); xs.lineTo(256, 132); xs.quadraticCurveTo(244, 186, 226, 236); xs.fill();
    var mSil = K.garder(new THREE.MeshBasicMaterial({ map: K.tex.texture(ts, { clamp: true }), transparent: true, opacity: 0, depthWrite: false }));
    var vSil = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(1.16, 1.56)), mSil); vSil.rotation.y = PI / 2; vSil.position.x = 0.02; c12.add(vSil);
    var l12 = K.look.ponctuelle({ couleur: "#FFC27A", intensite: 0, portee: 6 }); l12.position.set(W / 2 + 0.9, F12.y, F12.z); g.add(l12);
    // derrière la vitre, vu du dedans : des perles d'eau et quelques coulures, fines (un millimètre
    // le pixel) ; le montant du milieu, où les deux battants se rejoignent
    var Wg = Math.round(1024 * Math.max(0.5, K.qualiteTextures)), Hg = Math.round(Wg * 1.25), gc = K.tex.canvas(Wg, Hg), gx2 = gc.getContext("2d"), kk = Wg / 1024;
    gx2.clearRect(0, 0, Wg, Hg);
    for (var j = 0; j < 900; j++) {
      var bx = K.h01(j, 11) * Wg, by = K.h01(j, 13) * Hg, br = (0.8 + K.h01(j, 17) * 2.2) * kk;
      // une perle : une lentille (le bord plus clair que le cœur), un point de lumière ; floue, comme
      // ce qui est sur la vitre quand on regarde au loin
      var ga = 0.04 + K.h01(j, 3) * 0.09, gp2 = gx2.createRadialGradient(bx, by, 0, bx, by, br * 1.3);
      gp2.addColorStop(0, "rgba(200,214,240," + (ga * 0.3).toFixed(3) + ")"); gp2.addColorStop(0.7, "rgba(200,214,240," + ga.toFixed(3) + ")"); gp2.addColorStop(1, "rgba(200,214,240,0)");
      gx2.fillStyle = gp2; gx2.beginPath(); gx2.arc(bx, by, br * 1.3, 0, 7); gx2.fill();
      gx2.fillStyle = "rgba(255,246,230,0.12)"; gx2.fillRect(bx - br * 0.4, by - br * 0.5, Math.max(1, br * 0.45), Math.max(1, br * 0.45));
    }
    for (var i = 0; i < 46; i++) {
      var cx0 = K.h01(i, 5) * Wg, cy0 = K.h01(i, 7) * Hg * 0.8, lo = (40 + K.h01(i, 9) * 160) * kk;
      gx2.strokeStyle = "rgba(200,214,240,0.2)"; gx2.lineWidth = 1.4 * kk; gx2.beginPath(); gx2.moveTo(cx0, cy0);
      for (var q = 1; q <= 8; q++) gx2.lineTo(cx0 + (K.h01(i * 9 + q, 19) - 0.5) * 3 * kk, cy0 + lo * q / 8);
      gx2.stroke();
      gx2.fillStyle = "rgba(230,238,255,0.45)"; gx2.beginPath(); gx2.arc(cx0, cy0 + lo, 2.2 * kk, 0, 7); gx2.fill();
    }
    gx2.fillStyle = "rgba(6,4,3,0.97)"; gx2.fillRect(Wg / 2 - 9 * kk, 0, 18 * kk, Hg);
    var gob = { maj: function () {} };
    var mGout = K.garder(new THREE.MeshBasicMaterial({ map: K.tex.texture(gc, { clamp: true }), transparent: true, depthWrite: false, side: THREE.BackSide }));
    var vGout = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(1.16, 1.56)), mGout); vGout.rotation.y = PI / 2; vGout.position.x = -0.03; c12.add(vGout);
    return {
      groupe: g, neon: mN, lNeon: lNeon, hNeon: hNeon, ecranPluie: gob,
      // k : l'enseigne (0 éteinte, 1 allumée, le néon qui hésite au démarrage)
      enseigne: function (t, debut, tubes) {
        var k = t < debut ? 0 : t < debut + 0.12 ? 1 : t < debut + 0.22 ? 0.1 : t < debut + 0.5 ? 0.8 : t < debut + 0.58 ? 0.25 : 1;
        k *= 1 - 0.06 * Math.max(0, K.bruit1(t * 12, 41));
        mN.color.setScalar(2.4 * k * (tubes == null ? 1 : tubes)); lNeon.intensity = 15 * k; hNeon.intensite(0.55 * k);
      },
      // la 12 : k la lumière, s la silhouette
      douze: function (k, s) {
        mAllume.color.setScalar(1.25 * k); vSombre.visible = k < 0.999; l12.intensity = 2.2 * k;
        mSil.opacity = s;
      }
    };
  }

  // le mannequin de la trousse laisse un jour entre le buste et les cuisses : à contre-jour, il se
  // voit. Un bassin le comble (un short, le bas d'un survêtement), de la couleur du bas.
  function etoffer(K, THREE, m, couleur) {
    var s = m.taille, mat = K.garder(new THREE.MeshStandardMaterial({ color: couleur || "#07070a", roughness: 0.92 }));
    var gB = K.garder(new THREE.CylinderGeometry(0.165 * s, 0.17 * s, 0.26 * s, 12));
    var b = new THREE.Mesh(gB, mat); b.position.y = -0.07 * s; b.scale.z = 0.66; b.castShadow = true; m.os.bassin.add(b);
    return m;
  }

  // une boîte aux arêtes arrondies (un coussin, un appui-tête) : w × h × d, rayon r
  function boiteRonde(THREE, w, h, d, r, n) {
    var g = new THREE.BoxGeometry(1, 1, 1, n || 6, n || 6, n || 6), p = g.attributes.position, v = new THREE.Vector3(), c = new THREE.Vector3();
    var demi = new THREE.Vector3(w / 2, h / 2, d / 2), inner = new THREE.Vector3(w / 2 - r, h / 2 - r, d / 2 - r);
    for (var i = 0; i < p.count; i++) {
      v.set(p.getX(i) * w, p.getY(i) * h, p.getZ(i) * d);
      c.set(Math.max(-inner.x, Math.min(inner.x, v.x)), Math.max(-inner.y, Math.min(inner.y, v.y)), Math.max(-inner.z, Math.min(inner.z, v.z)));
      v.sub(c); if (v.lengthSq() > 1e-12) v.normalize().multiplyScalar(r);
      v.add(c); p.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    return g;
  }

  // ─── LE BUS DE 2010 (l'avant regarde +x, posé sur y = 0 ; le dedans se filme) ───
  var BUS = { L: 12, W: 2.5, bas: 0.34, haut: 3.45 };
  // les noms au sparadrap (le dernier rang n'en porte qu'un)
  var NOMS = ["SANNIER", "OLLIER", "BETOMBO", "GUISARD", "LASCOMBE", "BARÈGE", "QUINTARD", "NOGARET", "MBAKO", "KERVADEC", "TOULIER", "DEVRIEUX", "LEBRAZ", "SOUBIRAN", "MALVEZIN", "BERNADAC"];
  function bus(K, ctx) {
    var THREE = ctx.THREE, P = K.props, g = new THREE.Group(), L = BUS.L, Wb = BUS.W, y0 = BUS.bas, y1 = BUS.haut;
    // la livrée : un gris d'argent sali, une bande cobalt (la Fédération l'avait fait repeindre)
    var mCaisse = K.garder(new THREE.MeshPhysicalMaterial({ color: "#a9adb3", roughness: 0.38, metalness: 0.45, clearcoat: 0.7, clearcoatRoughness: 0.3 }));
    var mBlanc = K.garder(new THREE.MeshStandardMaterial({ color: COBALT, roughness: 0.45, metalness: 0.3 }));
    var mNoir = K.garder(new THREE.MeshStandardMaterial({ color: "#0d0e10", roughness: 0.7 }));
    // les vitres : sombres, et derrière, les veilleuses bleues restées allumées depuis 2010
    var mVitre = K.garder(new THREE.MeshPhysicalMaterial({ color: "#070a10", roughness: 0.06, metalness: 0.2, envMapIntensity: 1.6, emissive: new THREE.Color("#2a3f7a"), emissiveIntensity: 0.55 }));
    // la caisse : un profil de côté, extrudé sur la largeur
    var pr = new THREE.Shape();
    pr.moveTo(-L / 2, y0); pr.lineTo(L / 2 - 0.1, y0); pr.quadraticCurveTo(L / 2, y0, L / 2, y0 + 0.2); pr.lineTo(L / 2, 1.25);
    pr.lineTo(L / 2 - 0.22, y1 - 0.3); pr.quadraticCurveTo(L / 2 - 0.3, y1, L / 2 - 0.75, y1); pr.lineTo(-L / 2 + 0.4, y1);
    pr.quadraticCurveTo(-L / 2, y1, -L / 2, y1 - 0.35); pr.lineTo(-L / 2, y0);
    var gc = K.garder(new THREE.ExtrudeGeometry(pr, { depth: Wb, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2, curveSegments: 8 }));
    gc.translate(0, 0, -Wb / 2);
    var caisse = new THREE.Mesh(gc, mCaisse); caisse.castShadow = true; caisse.receiveShadow = true; g.add(caisse);
    // la bande des vitres, dehors : un ruban sombre de chaque côté, les montants
    [-1, 1].forEach(function (s) {
      var v = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(L - 1.6, 1.25)), mVitre); v.position.set(-0.45, 2.3, s * (Wb / 2 + 0.045)); v.rotation.y = s > 0 ? 0 : PI; g.add(v);
      for (var m = 0; m < 9; m++) P.boite(g, 0.08, 1.3, 0.02, mNoir, -L / 2 + 0.9 + m * 1.27, 2.3, s * (Wb / 2 + 0.05), { ombre: false });
      P.boite(g, L - 0.4, 0.42, 0.02, mBlanc, 0, 0.82, s * (Wb / 2 + 0.05), { ombre: false });
    });
    // le pare-brise, incliné, posé sur la caisse : la vitre sombre, la banderole, un voile de reflets
    // devant (la banderole est « derrière la vitre ») ; la lunette arrière
    var nPB = new THREE.Vector3(0.993, 0.115, 0);
    var pb = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(Wb - 0.16, 1.9)), mVitre);
    pb.position.set(L / 2 - 0.11 + nPB.x * 0.03, 2.2 + nPB.y * 0.03, 0); pb.rotation.y = PI / 2; pb.rotateX(-0.115); g.add(pb);
    var mVoile = K.garder(new THREE.MeshPhysicalMaterial({ color: "#0a0e14", roughness: 0.04, metalness: 0.1, envMapIntensity: 2.2, transparent: true, opacity: 0.22, depthWrite: false }));
    var voile = new THREE.Mesh(pb.geometry, mVoile); voile.position.set(L / 2 - 0.11 + nPB.x * 0.06, 2.2 + nPB.y * 0.06, 0); voile.rotation.copy(pb.rotation); g.add(voile);
    var la = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(Wb - 0.3, 0.9)), mVitre); la.position.set(-L / 2 - 0.045, 2.6, 0); la.rotation.y = -PI / 2; g.add(la);
    // la banderole MONDIAL, derrière le pare-brise (elle se lit dehors ; dedans, à l'envers)
    var tb = K.tex.texte({ lignes: ["MONDIAL"], fond: "#d8d2c2", encre: COBALT, largeur: 1024, hauteur: 220, graisse: "700", graine: "banderole" });
    var mBan = K.garder(new THREE.MeshStandardMaterial({ map: tb.map, roughness: 0.9, side: THREE.DoubleSide }));
    var gBan = new THREE.PlaneGeometry(Wb - 0.35, 0.42, 12, 1), pB = gBan.attributes.position;
    for (var i = 0; i < pB.count; i++) { var u = pB.getX(i) / ((Wb - 0.35) / 2); pB.setY(i, pB.getY(i) - (1 - u * u) * 0.05); pB.setZ(i, (1 - u * u) * 0.02); }
    gBan.computeVertexNormals(); K.garder(gBan);
    var ban = new THREE.Mesh(gBan, mBan); ban.position.set(L / 2 - 0.11 - 0.065 + nPB.x * 0.045, 2.72 + nPB.y * 0.045, 0); ban.rotation.y = PI / 2; ban.rotateX(-0.115); g.add(ban);
    // l'écriteau du loueur, le long du flanc
    var tl = K.tex.texte({ lignes: ["AUTOCARS DE VALDORNE"], fond: "#00000000", encre: "#c9c6bd", largeur: 1024, hauteur: 96, graine: "loueur" });
    var mL = K.garder(new THREE.MeshStandardMaterial({ map: tl.map, transparent: true, roughness: 0.6 }));
    [-1, 1].forEach(function (s) { var e = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(3.4, 0.32)), mL); e.position.set(1.6, 0.78, s * (Wb / 2 + 0.06)); e.rotation.y = s > 0 ? 0 : PI; g.add(e); });
    // les roues ; les phares, éteints ; la plaque
    [[4.1, 1], [4.1, -1], [-2.9, 1], [-2.9, -1], [-4.2, 1], [-4.2, -1]].forEach(function (p) {
      P.cylindre(g, 0.5, 0.5, 0.3, mNoir, p[0], 0.5, p[1] * (Wb / 2 - 0.1), { rx: PI / 2, cotes: 18 });
      P.cylindre(g, 0.28, 0.28, 0.31, K.mat.metal({ couleur: "#8f9498", rugosite: 0.3 }), p[0], 0.5, p[1] * (Wb / 2 - 0.1), { rx: PI / 2, cotes: 14 });
    });
    P.boite(g, 0.06, 0.18, 0.5, mBlanc, L / 2 + 0.02, 0.85, 0.85, { ombre: false }); P.boite(g, 0.06, 0.18, 0.5, mBlanc, L / 2 + 0.02, 0.85, -0.85, { ombre: false });
    var tPl = K.tex.texte({ lignes: ["DK-412-RV"], fond: "#e8e5da", encre: "#111", largeur: 512, hauteur: 112 });
    var pl = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.52, 0.11)), K.garder(new THREE.MeshStandardMaterial({ map: tPl.map, roughness: 0.5 }))); pl.position.set(L / 2 + 0.05, 0.62, 0); pl.rotation.y = PI / 2; g.add(pl);

    // ── LE DEDANS : le sol, le plafond, les parois, les vitres vues de l'intérieur
    var dedans = new THREE.Group(); g.add(dedans);
    var mSol = K.garder(new THREE.MeshStandardMaterial({ color: "#26282c", roughness: 0.85 }));
    var mParoi = K.garder(new THREE.MeshStandardMaterial({ color: "#3a3d44", roughness: 0.8 }));
    var mPlafond = K.garder(new THREE.MeshStandardMaterial({ color: "#5c5f66", roughness: 0.9 }));
    var sol = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(L - 0.3, Wb - 0.12)), mSol); sol.rotation.x = -PI / 2; sol.position.set(0, 0.62, 0); dedans.add(sol);
    var pla = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(L - 0.5, Wb - 0.12)), mPlafond); pla.rotation.x = PI / 2; pla.position.set(-0.1, y1 - 0.08, 0); dedans.add(pla);
    // les vitres de l'intérieur : le gris du dehors, la bruine qui coule, la lueur d'un sodium
    var ec = K.tex.ecran({ largeur: 512, hauteur: 128, type: "lcd", fond: "#000", ips: 12, dessiner: function (x, t, w, h) {
      var gg = x.createLinearGradient(0, 0, 0, h); gg.addColorStop(0, "#46526e"); gg.addColorStop(0.55, "#2c3447"); gg.addColorStop(1, "#161a24");
      x.fillStyle = gg; x.fillRect(0, 0, w, h);
      // les lumières du parking, floues
      [[0.18, 0.62, "255,160,80", 26], [0.72, 0.58, "255,190,120", 18], [0.47, 0.66, "255,120,180", 10]].forEach(function (l) {
        var r = x.createRadialGradient(l[0] * w, l[1] * h, 0, l[0] * w, l[1] * h, l[3] * 2);
        r.addColorStop(0, "rgba(" + l[2] + ",0.9)"); r.addColorStop(1, "rgba(" + l[2] + ",0)"); x.fillStyle = r; x.fillRect(0, 0, w, h);
      });
      for (var i = 0; i < 90; i++) {
        var gx = K.h01(i, 21) * w, v = 0.05 + K.h01(i, 23) * 0.12, gy = ((K.h01(i, 25) + t * v) % 1) * h * 1.3 - h * 0.15;
        x.fillStyle = "rgba(0,0,0,0.25)"; x.fillRect(gx - 0.6, gy - h * 0.2, 1.2, h * 0.2);
        x.fillStyle = "rgba(200,215,240,0.8)"; x.beginPath(); x.arc(gx, gy, 1.3, 0, 7); x.fill();
      }
      for (var j = 0; j < 260; j++) { x.fillStyle = "rgba(190,205,230," + (0.12 + K.h01(j, 27) * 0.3) + ")"; x.fillRect(K.h01(j, 29) * w, K.h01(j, 31) * h, 1.2, 1.2); }
    } });
    var mVue = K.garder(new THREE.MeshBasicMaterial({ map: ec.texture, color: new THREE.Color(1, 1, 1).multiplyScalar(0.55) }));
    [-1, 1].forEach(function (s) {
      var v = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(L - 1.6, 1.22)), mVue); v.position.set(-0.45, 2.3, s * (Wb / 2 - 0.03)); v.rotation.y = s > 0 ? PI : 0; dedans.add(v);
      var bas = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(L - 0.4, 1.0)), mParoi); bas.position.set(0, 1.18, s * (Wb / 2 - 0.035)); bas.rotation.y = s > 0 ? PI : 0; dedans.add(bas);
      var hautP = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(L - 0.4, 0.5)), mParoi); hautP.position.set(0, 3.15, s * (Wb / 2 - 0.035)); hautP.rotation.y = s > 0 ? PI : 0; dedans.add(hautP);
      for (var m = 0; m < 9; m++) P.boite(dedans, 0.07, 1.25, 0.03, mParoi, -L / 2 + 0.9 + m * 1.27, 2.3, s * (Wb / 2 - 0.05), { ombre: false });
      // les porte-bagages, en long
      P.boite(dedans, L - 1.2, 0.08, 0.4, mParoi, -0.2, 3.05, s * (Wb / 2 - 0.25), { ombre: false });
    });
    var fond = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(Wb - 0.1, y1 - 0.7)), mParoi); fond.position.set(-L / 2 + 0.05, (y1 + 0.62) / 2, 0); fond.rotation.y = PI / 2; dedans.add(fond);
    var lun = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(Wb - 0.4, 0.8)), mVue); lun.position.set(-L / 2 + 0.07, 2.62, 0); lun.rotation.y = PI / 2; dedans.add(lun);
    // les rideaux : quelques-uns tirés, de travers
    var mRid = K.garder(new THREE.MeshStandardMaterial({ color: "#3b4660", roughness: 0.95, side: THREE.DoubleSide, bumpMap: K.tex.tissu({ fils: 64 }).relief, bumpScale: 0.4 }));
    [[-1, -3.2, 0.55], [1, 0.6, 0.4], [-1, 2.4, 0.3], [1, -4.6, 0.6], [-1, -0.9, 0.35]].forEach(function (r) {
      var gr = new THREE.PlaneGeometry(r[2] * 1.2, 1.25, 6, 1), pp = gr.attributes.position;
      for (var k = 0; k < pp.count; k++) pp.setZ(k, Math.sin(pp.getX(k) * 18) * 0.025);
      gr.computeVertexNormals(); K.garder(gr);
      var ri = new THREE.Mesh(gr, mRid); ri.position.set(r[1], 2.3, r[0] * (Wb / 2 - 0.09)); ri.rotation.y = r[0] > 0 ? PI : 0; dedans.add(ri);
    });
    // les sièges : une assise et un dossier, instanciés ; les appuis-tête, blancs ; et les noms
    var gS = K.gens.fusion([
      new THREE.BoxGeometry(0.46, 0.12, 0.44).translate(0.02, 1.04, 0).toNonIndexed(),
      new THREE.BoxGeometry(0.1, 0.78, 0.44).translate(-0.2, 1.45, 0).toNonIndexed(),
      new THREE.BoxGeometry(0.06, 0.42, 0.4).translate(0.02, 0.83, 0).toNonIndexed()
    ]);
    gS.computeVertexNormals(); K.garder(gS);
    // l'appui-tête : un coussin housse de blanc, aux arêtes arrondies
    var gT = boiteRonde(THREE, 0.12, 0.22, 0.3, 0.045, 5); K.garder(gT);
    var places = [];
    for (var r2 = 0; r2 < 11; r2++) [-1.0, -0.5, 0.5, 1.0].forEach(function (z) { places.push([4.0 - r2 * 0.84, z, r2]); });
    [-1.0, -0.5, 0, 0.5, 1.0].forEach(function (z) { places.push([-5.55, z, 11]); });
    var mSiege = K.garder(new THREE.MeshStandardMaterial({ color: "#2b3a63", roughness: 0.85, bumpMap: K.tex.tissu({ fils: 80 }).relief, bumpScale: 0.5 }));
    var mTete = K.garder(new THREE.MeshStandardMaterial({ color: "#d9d4c6", roughness: 0.9 }));
    var sieges = new THREE.InstancedMesh(gS, mSiege, places.length), tetes = new THREE.InstancedMesh(gT, mTete, places.length), d = new THREE.Object3D();
    places.forEach(function (p, i) {
      d.position.set(p[0], 0, p[1]); d.rotation.set(0, 0, 0); d.updateMatrix(); sieges.setMatrixAt(i, d.matrix);
      d.position.set(p[0] - 0.2, 1.97, p[1]); d.updateMatrix(); tetes.setMatrixAt(i, d.matrix);
    });
    sieges.instanceMatrix.needsUpdate = true; tetes.instanceMatrix.needsUpdate = true; sieges.receiveShadow = true;
    dedans.add(sieges); dedans.add(tetes);
    // les noms : une planche de sparadrap (une case par nom), une étiquette par appui-tête
    var cols = 4, rangs = 5, at = K.tex.canvas(1024, 320), ax = at.getContext("2d");
    ax.clearRect(0, 0, 1024, 320);
    var noms = NOMS.concat(["RANCÉ"]);
    noms.forEach(function (n, k) {
      var cx = (k % cols) * 256, cy = Math.floor(k / cols) * 64, rr = K.alea("tape" + k);
      ax.save(); ax.translate(cx + 128, cy + 32); ax.rotate((rr() - 0.5) * 0.05);
      ax.fillStyle = "#ece6d4"; ax.fillRect(-118, -24, 236, 48);
      ax.fillStyle = "rgba(120,100,70,0.18)"; for (var q = 0; q < 50; q++) ax.fillRect(-118 + rr() * 236, -24 + rr() * 48, 2, 1);
      ax.fillStyle = "#151515"; ax.font = "700 30px 'Space Mono','DejaVu Sans Mono',monospace"; ax.textAlign = "center"; ax.textBaseline = "middle";
      ax.fillText(n, (rr() - 0.5) * 6, 2); ax.restore();
    });
    var mTape = K.garder(new THREE.MeshStandardMaterial({ map: K.tex.texture(at, { clamp: true }), transparent: true, alphaTest: 0.3, roughness: 0.75 }));
    var geos = [];
    places.forEach(function (p, i) {
      var k = p[2] === 11 ? (p[1] === 0.5 ? noms.length - 1 : -1) : (i % NOMS.length);
      if (k < 0) return;
      var pg = new THREE.PlaneGeometry(0.24, 0.06).toNonIndexed(), uv = pg.attributes.uv;
      var u0 = (k % cols) / cols, v0 = 1 - (Math.floor(k / cols) + 1) / rangs;
      for (var q2 = 0; q2 < uv.count; q2++) uv.setXY(q2, u0 + uv.getX(q2) / cols, v0 + uv.getY(q2) / rangs);
      pg.rotateY(PI / 2); pg.rotateX((K.h01(i, 77) - 0.5) * 0.08);
      pg.translate(p[0] - 0.2 + 0.068, 2.0 + (K.h01(i, 79) - 0.5) * 0.03, p[1]);
      geos.push(pg);
    });
    var tapes = new THREE.Mesh(K.gens.fusion(geos), mTape); K.garder(tapes.geometry); dedans.add(tapes);
    // la place de RANCÉ, au dernier rang : sa position (pour la caméra)
    g.rance = [-5.55 - 0.2 + 0.07, 2.0, 0.5];
    // une lumière froide par la lunette arrière, un sodium qui entre de biais
    var froid = K.look.ponctuelle({ couleur: "#8ea6d8", intensite: 2.4, portee: 6 }); froid.position.set(-5.0, 2.8, 0); dedans.add(froid);
    var sod = K.look.ponctuelle({ couleur: "#FF9A3D", intensite: 1.6, portee: 7 }); sod.position.set(0.5, 2.7, 1.0); dedans.add(sod);
    // les veilleuses du plafond, restées allumées depuis 2010 : un filet bleu le long de l'allée
    var mVeil = K.mat.lumiere({ couleur: "#6f8fd8", intensite: 2.2 });
    P.boite(dedans, L - 2.0, 0.02, 0.05, mVeil, -0.4, y1 - 0.1, 0.32, { ombre: false }); P.boite(dedans, L - 2.0, 0.02, 0.05, mVeil, -0.4, y1 - 0.1, -0.32, { ombre: false });
    [2.5, -1.5].forEach(function (x) { var l = K.look.ponctuelle({ couleur: "#6f8fd8", intensite: 1.4, portee: 4.5 }); l.position.set(x, y1 - 0.25, 0); dedans.add(l); });
    dedans.visible = true;
    g.dedans = dedans; g.ecran = ec;
    return g;
  }

  // ─── LES COBALTS QUI ARRIVENT (le plan 3) ───────────────────────────────────
  // quatre survêtements, un sac à la main, du coin du parking à la porte éclairée ; `d` : où
  // chacun en est du chemin au début du plan (le premier entre quand la porte claque)
  var ARRIVEE = { de: [18.0, 3.6], a: [7.2, 1.0], v: 1.25, t0: 11.4, arret: 5.8 };
  function arrivants(K, ctx) {
    var THREE = ctx.THREE, P = K.props, liste = [];
    var mSac = K.garder(new THREE.MeshStandardMaterial({ color: "#0e1015", roughness: 0.7 }));
    [{ d: 6.3, g: "a1" }, { d: 3.9, g: "a2" }, { d: 2.4, g: "a3", regarde: true }, { d: -0.6, g: "a4" }].forEach(function (a, i) {
      var m = etoffer(K, THREE, K.gens.mannequin({ tenue: "survetement", couleur: "#16224a", couleur2: "#121a36", graine: a.g, taille: 1.8 + (i % 2) * 0.06 }), "#121a36");
      var sac = P.boite(null, 0.18, 0.3, 0.62, mSac, 0, -0.2, 0.02);
      m.os.mainD.add(sac);
      liste.push({ m: m, d: a.d, regarde: !!a.regarde });
    });
    return liste;
  }

  // ─── LE TERRAIN ANNEXE (à l'est de l'hôtel, sous la fenêtre de la 12) ────────
  // le terrain : x de 24,4 à 79,6, z de -41,5 à -2,5 ; le coin sud-ouest (le piquet où il
  // s'arrête) est devant la fenêtre de la 12, en contrebas ; le lampadaire penche dessus
  var TERRAIN = { x0: 24.4, x1: 79.6, z0: -41.5, z1: -2.5 };
  function terrainAnnexe(K, ctx, g) {
    var THREE = ctx.THREE, P = K.props, T = TERRAIN, zc = (T.z0 + T.z1) / 2, xc = (T.x0 + T.x1) / 2;
    var mH = K.mat.pelouse({ bandes: 6, boue: 0.55, graine: "annexe", repete: [3, 2] });
    mH.roughness = 0.68; mH.envMapIntensity = 1.4;   // l'herbe mouillée : elle prend un peu la lumière
    var herbe = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(66, 50)), mH); herbe.rotation.x = -PI / 2; herbe.position.set(53, 0.01, -20); herbe.receiveShadow = true; g.add(herbe);
    // les lignes, effacées par l'hiver
    var mLi = K.garder(new THREE.MeshStandardMaterial({ color: "#e4dfcc", roughness: 0.75, transparent: true, opacity: 0.9 }));
    var lg = [[xc, T.z0, T.x1 - T.x0, 0.12], [xc, T.z1, T.x1 - T.x0, 0.12], [T.x0, zc, 0.12, T.z1 - T.z0], [T.x1, zc, 0.12, T.z1 - T.z0], [xc, zc, 0.12, T.z1 - T.z0]].map(function (l) {
      return new THREE.PlaneGeometry(l[2], l[3]).rotateX(-PI / 2).translate(l[0], 0.02, l[1]).toNonIndexed();
    });
    // l'arc du coin, sous la fenêtre de la 12 (un quart de cercle d'un mètre)
    lg.push(new THREE.RingGeometry(0.94, 1.06, 18, 1, 0, PI / 2).rotateX(-PI / 2).translate(T.x0, 0.02, T.z1).toNonIndexed());
    var lignes = new THREE.Mesh(K.gens.fusion(lg), mLi); K.garder(lignes.geometry); g.add(lignes);
    // deux buts sans filet : trois tubes blancs
    var mBut = K.garder(new THREE.MeshStandardMaterial({ color: "#d8d6cc", roughness: 0.4 }));
    [T.x0, T.x1].forEach(function (bx) {
      P.cylindre(g, 0.06, 0.06, 2.44, mBut, bx, 1.22, zc - 3.66); P.cylindre(g, 0.06, 0.06, 2.44, mBut, bx, 1.22, zc + 3.66);
      P.cylindre(g, 0.06, 0.06, 7.44, mBut, bx, 2.44, zc, { rx: PI / 2 });
    });
    // le piquet du coin (celui où il s'arrête), un poteau sans drapeau
    P.cylindre(g, 0.035, 0.035, 1.5, K.garder(new THREE.MeshStandardMaterial({ color: "#e6e1cf", roughness: 0.45 })), T.x0, 0.75, T.z1, { cotes: 8 });
    // le grillage du côté de l'hôtel, la haie de thuyas au fond
    var gr = P.grillage({ longueur: 50, hauteur: 2.2 }); gr.rotation.y = PI / 2; gr.position.set(20.6, 0, -20); g.add(gr);
    var mHaie = K.garder(new THREE.MeshStandardMaterial({ color: "#101b13", roughness: 1, bumpMap: K.tex.tissu({ fils: 24 }).relief, bumpScale: 3 }));
    P.boite(g, 66, 3.4, 1.6, mHaie, 53, 1.7, -46); P.boite(g, 1.6, 3.6, 50, mHaie, 86.5, 1.8, -20);
    // le seul lampadaire du terrain, au coin
    var lampe = P.reverbere({ hauteur: 7, bras: 1.5, intensite: 240, gresille: 0.6, forceCone: 0.15 });
    lampe.position.set(22.6, 0, 0.6); lampe.rotation.y = 0.7; g.add(lampe);
    // un second, loin, le long de la touche : la ligne s'en va dans la pluie
    var loin = P.reverbere({ hauteur: 7, bras: 1.5, intensite: 150, gresille: 0.2, forceCone: 0.12 });
    loin.position.set(49, 0, 0.2); loin.rotation.y = PI / 2; g.add(loin);
    return { lampe: lampe, loin: loin };
  }

  // la chambre 12 vue du dedans : le mur autour de la fenêtre, l'appui, un rideau (pour le
  // plan subjectif ; de dehors, ces faces regardent l'intérieur et ne se voient pas)
  function murDouze(K, ctx, g) {
    var THREE = ctx.THREE, P = K.props, x = HOTEL.W / 2 - 0.12, y0 = F12.y - 0.78, y1 = F12.y + 0.78, z0 = F12.z - 0.58, z1 = F12.z + 0.58;
    var m = K.mat.papier({ couleur: "#4a3a2c", graine: "papier-12" });
    var grp = new THREE.Group(); g.add(grp);
    var mor = function (za, zb, ya, yb) {
      var p = new THREE.Mesh(P.planUV(zb - za, yb - ya, 1), m); p.rotation.y = -PI / 2; p.position.set(x, (ya + yb) / 2, (za + zb) / 2); grp.add(p);
    };
    mor(F12.z - 3, z0, y0 - 2, y1 + 1.5); mor(z1, F12.z + 3, y0 - 2, y1 + 1.5); mor(z0, z1, y1, y1 + 1.5); mor(z0, z1, y0 - 2, y0);
    P.boite(grp, 0.3, 0.05, 1.4, K.mat.bois({ couleur: "#3a2416", lames: 2, graine: "appui-12" }), x - 0.1, y0 - 0.02, F12.z);
    var mRid = K.garder(new THREE.MeshStandardMaterial({ color: "#5a3a2a", roughness: 0.95, side: THREE.DoubleSide }));
    var gr = new THREE.PlaneGeometry(0.6, 2.2, 8, 1), pp = gr.attributes.position;
    for (var k = 0; k < pp.count; k++) pp.setZ(k, Math.sin(pp.getX(k) * 22) * 0.03);
    gr.computeVertexNormals(); K.garder(gr);
    var rid = new THREE.Mesh(gr, mRid); rid.rotation.y = -PI / 2; rid.position.set(x - 0.08, F12.y - 0.05, z1 + 0.4); grp.add(rid);
    // la lampe de la chambre, derrière l'épaule : elle chauffe le mur
    var l = K.look.ponctuelle({ couleur: "#FFC27A", intensite: 2.6, portee: 5 }); l.position.set(x - 2.2, F12.y - 0.25, F12.z - 1.3); grp.add(l);
    return grp;
  }

  // ─── LE DEHORS : le parking, le bus, l'hôtel, le terrain annexe ──────────────
  function dehors(K, ctx) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: { zenith: "#0a1530", horizon: "#34405e", lueur: "#5a3a2c", lueurDir: [-0.4, 1], force: 0.9 }, brouillard: ["#161e30", 0.022],
      environnement: { fenetres: 24 }, reflets: 1.0, ambiance: ["#41527c", "#0a0806", 0.34] });
    var ciel = s.children[0];
    // le sol : l'asphalte du parking (mouillé), ses lignes usées ; un trottoir le long de l'hôtel
    var mA = K.mat.asphalte({ flaques: 0.55, graine: "parking-rive", reprise: false, ligne: false });
    ["map", "roughnessMap", "bumpMap"].forEach(function (k) { mA[k].repeat.set(6, 6); });
    mA.envMapIntensity = 2.0;
    var sol = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(44, 40)), mA); sol.rotation.x = -PI / 2; sol.position.set(0, 0, 18); sol.receiveShadow = true; s.add(sol);
    var sol2 = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(10, 30)), mA); sol2.rotation.x = -PI / 2; sol2.position.set(17, 0.005, -8); s.add(sol2);
    var mLigne = K.garder(new THREE.MeshStandardMaterial({ color: "#bdb8a6", roughness: 0.7, transparent: true, opacity: 0.6 }));
    var lg = [];
    for (var i = 0; i < 9; i++) lg.push(new THREE.PlaneGeometry(0.12, 5).translate(-12 + i * 3, 0, 0).toNonIndexed());
    for (var j = 0; j < 9; j++) lg.push(new THREE.PlaneGeometry(0.12, 5).translate(-12 + j * 3, 0, 9).toNonIndexed());
    var lignes = new THREE.Mesh(K.gens.fusion(lg), mLigne); K.garder(lignes.geometry); lignes.rotation.x = -PI / 2; lignes.position.set(0, 0.012, 4.5); s.add(lignes);
    var mT = K.mat.beton({ couleur: "#57534c", graine: "trottoir-hotel", banches: 0 });
    P.boite(s, 30, 0.14, 1.6, mT, 0, 0.07, 0.8);
    // l'hôtel
    var H = hotel(K, ctx, {}); s.add(H.groupe);
    // le bus, garé de travers sur trois places
    var b = bus(K, ctx); b.position.set(-1.5, 0, 12.5); b.rotation.y = 0.2; s.add(b);
    // une voiture garée, au fond, sous un lampadaire
    var v = P.voiture({ couleur: "#3a3f45", plaque: "BR-905-EX" }); v.position.set(-11, 0, 6.5); v.rotation.y = -PI / 2; s.add(v);
    // les lampadaires du parking : l'un au-dessus du bus (son toit, sa banderole), l'autre au fond
    var lamps = [[0.6, 0, 16.2, true, PI * 0.5], [11.5, 0, 22, false, PI * 1.2]].map(function (p, k) {
      var r = P.reverbere({ hauteur: 6.8, bras: 1.6, intensite: k ? 110 : 150, ombre: p[3], gresille: k ? 1 : 0.2, forceCone: 0.1 });
      r.position.set(p[0], 0, p[2]); r.rotation.y = p[4]; s.add(r);
      return r;
    });
    // le soir qui tombe : une lumière froide, basse, venue de l'ouest (elle dessine le bus et les toits)
    var soir = new THREE.DirectionalLight("#6f86c8", 0.35); soir.position.set(-30, 18, 20); s.add(soir); s.add(soir.target);
    // le terrain annexe ; la chambre 12 vue du dedans
    var T = terrainAnnexe(K, ctx, s);
    var mur12 = murDouze(K, ctx, s);
    // Tibo, de dos, à la fenêtre de la 12 (le plan 6) : un survêtement, une main sur le montant
    var sol12 = HOTEL.rdc + HOTEL.he;
    var tibo = etoffer(K, THREE, K.gens.mannequin({ tenue: "survetement", silhouette: true, graine: "tibo", taille: 1.76, carrure: 0.92 }));
    tibo.groupe.position.set(13.45, sol12, F12.z - 0.36); tibo.groupe.rotation.y = PI / 2; mur12.add(tibo.groupe);
    // le carnet d'écolier sous le bras (le prologue), et son élastique rouge
    var carnet = new THREE.Group(); carnet.position.set(0.04, -0.17, 0.0); tibo.os.epauleG.add(carnet);
    P.boite(carnet, 0.014, 0.21, 0.165, K.garder(new THREE.MeshStandardMaterial({ color: "#1c2433", roughness: 0.8 })), 0, 0, 0);
    P.boite(carnet, 0.017, 0.012, 0.168, K.garder(new THREE.MeshStandardMaterial({ color: "#a3121c", roughness: 0.6 })), 0, -0.05, 0);
    var solChambre = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(4, 6)), K.garder(new THREE.MeshStandardMaterial({ color: "#2a1c18", roughness: 0.95 })));
    solChambre.rotation.x = -PI / 2; solChambre.position.set(11.9, sol12 + 0.01, F12.z); mur12.add(solChambre);
    // les arrivants
    var arr = arrivants(K, ctx);
    arr.forEach(function (a) { s.add(a.m.groupe); });
    // la pluie (elle suit la caméra), les ronds dans les flaques, les traînées des lumières
    s.updateMatrixWorld(true);
    var lumPluie = [
      { pos: lamps[0].positionLampe(), couleur: "#FF9A3D", intensite: 0.8, rayon: 6 },
      { pos: [7, 3.2, 1.6], couleur: "#FFB46A", intensite: 0.7, rayon: 5 },
      { pos: [7, 4.6, 1.0], couleur: ROSE, intensite: 0.0, rayon: 5 },
      { pos: T.lampe.positionLampe(), couleur: "#FF9A3D", intensite: 0.7, rayon: 6 }
    ];
    var PLUIE = { min: [-11, -0.2, -11], max: [11, 10, 11] };
    var pluie = K.particules.pluie({ n: 8000, zone: PLUIE, suivre: true, avance: 7, vitesse: [0.7, -9.5, 0.35], longueur: 0.4, largeur: 0.009, couleur: "#6f7e9c", opacite: 0.5, lumieres: lumPluie });
    s.add(pluie);
    var ronds = K.particules.ronds({ n: 600, zone: { min: [-12, 0.0, 2], max: [16, 0, 26] }, periode: 0.6, rayon: 0.07, couleur: "#9aa6c0", opacite: 0.65, lumieres: lumPluie });
    s.add(ronds);
    var reflets = [
      K.look.reflet({ pos: lamps[0].positionLampe(), couleur: "#FF9A3D", intensite: 1.0, largeur: 0.9, longueur: 8 }),
      K.look.reflet({ pos: lamps[1].positionLampe(), couleur: "#FF9A3D", intensite: 0.8, largeur: 0.8, longueur: 8 }),
      K.look.reflet({ pos: [7, 0, 0.6], sol: 0.0, couleur: "#FFB46A", intensite: 0.9, largeur: 1.2, longueur: 6 }),
      K.look.reflet({ pos: [7, 0, 0.4], sol: 0.0, couleur: ROSE, intensite: 0.0, largeur: 2.6, longueur: 7 })
    ];
    reflets.forEach(function (r) { s.add(r); });
    var cZ = new THREE.Color(), cH = new THREE.Color(), cNuitZ = new THREE.Color("#02040a"), cNuitH = new THREE.Color("#0e1424");
    return {
      scene: s, bus: b, hotel: H, arrivants: arr,
      look: { bloom: 0.8, rayon: 0.6, seuil: 0.85, exposition: 1.32, contraste: 1.14, saturation: 0.92 },
      maj: function (t, c) {
        // pendant la préparation (pas de plan), tout est visible : tout se compile d'avance
        var plan = c.indice, tout = plan == null;
        // le crépuscule qui tombe : le ciel s'éteint de 0 à 26 s
        var nuit = K.lisse(2, 26, t);
        cZ.set("#0a1530").lerp(cNuitZ, nuit); cH.set("#34405e").lerp(cNuitH, nuit);
        ciel.material.uniforms.uZenith.value.copy(cZ); ciel.material.uniforms.uHorizon.value.copy(cH);
        // de près (l'arrivée), les tubes gardent leur rose au lieu de blanchir
        H.enseigne(t, 1.8, plan === 2 ? 0.5 : 1);
        var kN = t < 1.8 ? 0 : 1;
        pluie.materiau.uniforms.uLumCoul.value[2].set(ROSE).multiplyScalar(0.8 * kN);
        reflets[3].maj(c.camera, 0.7 * kN);
        // dans le bus (le plan 2), il ne pleut pas, et on ne voit que le dedans
        var dansBus = plan === 1;
        b.dedans.visible = tout || dansBus; pluie.visible = !dansBus; ronds.visible = !dansBus;
        mur12.visible = tout || plan === 5;
        // vue de la 12, la pluie tombe dehors seulement : une boîte fixe, devant la façade
        var u = pluie.materiau.uniforms, dedans12 = plan === 5;
        u.uSuivre.value = dedans12 ? 0 : 1;
        u.uMin.value.fromArray(dedans12 ? [15.8, -0.2, -18] : PLUIE.min); u.uMax.value.fromArray(dedans12 ? [38, 11, 6] : PLUIE.max);
        pluie.maj(t, c.camera); ronds.maj(t);
        reflets.forEach(function (r, k) { if (k < 3) r.maj(c.camera, 1); });
        lamps.forEach(function (l) { l.maj(t); }); T.lampe.maj(t); T.loin.maj(t);
        // de la fenêtre, le cône du lampadaire se voit de flanc, tout près : à peine
        if (dedans12) T.lampe.cone.maj(t, 0.03);
        if (dansBus) b.ecran.maj(t);
        // Tibo à la fenêtre : il respire, la tête un peu penchée vers le terrain, la main sur le montant
        if (tout || plan === 5) {
          tibo.repos(t * 0.6);
          tibo.os.tete.rotation.x = 0.28; tibo.os.tete.rotation.y = 0.08 + K.fbm1(t * 0.2, 9) * 0.05;
          // (la trousse nomme D le bras du côté +x du mannequin : ici, côté montant gauche de la fenêtre)
          tibo.os.epauleD.rotation.z = 0.42; tibo.os.epauleD.rotation.x = -1.02; tibo.os.coudeD.rotation.x = -1.05;
          tibo.os.epauleG.rotation.z = -0.1; tibo.os.buste.rotation.z = -0.04;
        }
        // la 12 : la lumière à 23,5 s, la silhouette à 24,6 s
        H.douze(K.lisse(23.5, 23.75, t), K.lisse(24.6, 25.8, t) * 0.97);
        // les arrivants : seulement pendant leur plan
        var vis = tout || plan === 2;
        arr.forEach(function (a, k) {
          var dx = ARRIVEE.a[0] - ARRIVEE.de[0], dz = ARRIVEE.a[1] - ARRIVEE.de[1], lo = Math.hypot(dx, dz);
          var fait = (t - ARRIVEE.t0) * ARRIVEE.v + a.d, arrete = a.regarde && fait >= ARRIVEE.arret;
          if (a.regarde) fait = Math.min(fait, ARRIVEE.arret);
          a.m.groupe.visible = vis && fait < lo - 0.3;
          if (!a.m.groupe.visible) return;
          var u = K.borne(fait / lo, -0.4, 1);
          a.m.groupe.position.set(ARRIVEE.de[0] + dx * u, 0, ARRIVEE.de[1] + dz * u);
          a.m.groupe.rotation.y = Math.atan2(dx, dz);
          if (arrete) {
            // il s'arrête, et regarde le bus (à sa gauche)
            var depuis = t - ARRIVEE.t0 - (ARRIVEE.arret - a.d) / ARRIVEE.v;
            a.m.repos(t);
            a.m.os.tete.rotation.y = 1.0 * K.lisse(0, 0.7, depuis);
            a.m.os.buste.rotation.y = 0.3 * K.lisse(0.2, 1.0, depuis);
          } else {
            a.m.marche(t + k * 0.37, ARRIVEE.v);
            // deux détournent la tête du bus
            if (k === 1 || k === 3) a.m.os.tete.rotation.y = -0.5;
          }
          // le bras du sac reste le long du corps
          a.m.os.epauleD.rotation.x *= 0.25; a.m.os.epauleD.rotation.z = 0.08; a.m.os.coudeD.rotation.x = -0.08;
        });
      }
    };
  }

  // ─── LE HALL : le tableau des clés, le cahier de nuit ────────────────────────
  // le mur du fond en z = 0 (il regarde +z) ; le tableau de -0,95 à 0,95 en x ; le
  // bureau de la réception dessous, le cahier ouvert dessus ; le standard à droite
  function hall(K, ctx) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: false, fond: "#030304", environnement: { zenith: "#08070a", horizon: "#24160e", lueur: "#3a1a10", fenetres: 0,
      lampes: [{ pos: [0, 20, 30], couleur: "#FFD49A", intensite: 6, taille: 6 }, { pos: [4, 4, 34], couleur: "#FFC98A", intensite: 3, taille: 14 }, { pos: [-30, 6, 20], couleur: ROSE, intensite: 2.5, taille: 6 }] }, reflets: 0.9,
      ambiance: ["#2a2c3c", "#120a06", 0.16], brouillard: ["#0a0706", 0.06] });
    var mMur = K.mat.papier({ couleur: "#6e5a40", graine: "papier-hall", repete: [3, 3] });
    var mur = new THREE.Mesh(P.planUV(8, 4, 1.2), mMur); mur.position.set(0, 2, 0); mur.receiveShadow = true; s.add(mur);
    var mLambris = K.mat.bois({ couleur: "#3a2416", lames: 8, graine: "lambris-hall", cire: true });
    P.boite(s, 8, 1.05, 0.04, mLambris, 0, 0.52, 0.02);
    // le tableau : une planche de noyer, trois rangs de crochets de laiton
    var mPl = K.mat.bois({ couleur: "#2e1c0e", lames: 3, graine: "tableau-cles", cire: true });
    P.boite(s, 2.02, 0.98, 0.04, mPl, 0, 1.72, 0.03);
    var mMoul = K.mat.bois({ couleur: "#2a180c", lames: 1, graine: "moulure" });
    P.boite(s, 2.12, 0.05, 0.06, mMoul, 0, 2.23, 0.04); P.boite(s, 2.12, 0.05, 0.06, mMoul, 0, 1.21, 0.04);
    P.boite(s, 0.05, 1.06, 0.06, mMoul, -1.04, 1.72, 0.04); P.boite(s, 0.05, 1.06, 0.06, mMoul, 1.04, 1.72, 0.04);
    // le laiton patiné (des rayures, des traces de doigts : la lampe y glisse), l'acier des clés
    var rc = K.tex.canvas(256, 256), rx = rc.getContext("2d"), rr0 = K.alea("laiton");
    rx.fillStyle = "#8a8a8a"; rx.fillRect(0, 0, 256, 256);
    for (var r1 = 0; r1 < 260; r1++) { rx.strokeStyle = "rgba(" + (rr0() < 0.5 ? "40,40,40" : "200,200,200") + "," + (0.15 + rr0() * 0.3) + ")"; rx.lineWidth = 0.6 + rr0(); var a0 = rr0() * 6.28, x0 = rr0() * 256, y0 = rr0() * 256; rx.beginPath(); rx.moveTo(x0, y0); rx.lineTo(x0 + Math.cos(a0) * 30, y0 + Math.sin(a0) * 30); rx.stroke(); }
    for (var r2 = 0; r2 < 14; r2++) { var gr0 = rx.createRadialGradient(rr0() * 256, rr0() * 256, 0, 128, 128, 40 + rr0() * 50); gr0.addColorStop(0, "rgba(160,160,160,0.5)"); gr0.addColorStop(1, "rgba(160,160,160,0)"); rx.fillStyle = gr0; rx.fillRect(0, 0, 256, 256); }
    var tRug = K.tex.texture(rc, { donnee: true });
    var mLaiton = K.garder(new THREE.MeshStandardMaterial({ color: "#a57c38", roughness: 0.55, roughnessMap: tRug, metalness: 0.85, envMapIntensity: 1.3 }));
    var mAcier = K.garder(new THREE.MeshStandardMaterial({ color: "#8d887e", roughness: 0.38, metalness: 0.85 }));
    // les 26 places : trois rangs de neuf (le dernier rang : huit)
    var cles = [];
    for (var n = 1; n <= 26; n++) { var rg = Math.floor((n - 1) / 9), col = (n - 1) % 9; cles.push({ n: n, x: -0.8 + col * 0.2, y: 2.05 - rg * 0.3 }); }
    // le crochet : une tige et un bout relevé
    var gCro = K.gens.fusion([new THREE.CylinderGeometry(0.006, 0.006, 0.05, 6).rotateX(PI / 2).translate(0, 0, 0.025).toNonIndexed(), new THREE.CylinderGeometry(0.006, 0.006, 0.02, 6).translate(0, 0.008, 0.05).toNonIndexed()]);
    gCro.computeVertexNormals(); K.garder(gCro);
    // la clé : l'anneau, l'anneau de la tête, la tige, deux dents (accrochée par l'anneau, elle pend)
    var gCle = K.gens.fusion([new THREE.TorusGeometry(0.011, 0.0014, 6, 18).toNonIndexed().translate(0, -0.011, 0),
      new THREE.TorusGeometry(0.008, 0.0022, 6, 14).toNonIndexed().translate(-0.012, -0.03, -0.002),
      new THREE.BoxGeometry(0.0045, 0.05, 0.003).translate(-0.012, -0.063, -0.002).toNonIndexed(),
      new THREE.BoxGeometry(0.011, 0.007, 0.003).translate(-0.007, -0.083, -0.002).toNonIndexed(), new THREE.BoxGeometry(0.008, 0.006, 0.003).translate(-0.008, -0.072, -0.002).toNonIndexed()]);
    gCle.computeVertexNormals(); K.garder(gCle);
    // la plaque : une poire de laiton, son numéro gravé (une planche de numéros, une case par plaque)
    var gPla = new THREE.CylinderGeometry(0.03, 0.03, 0.006, 24).rotateX(PI / 2); gPla.scale(1, 1.35, 1); gPla.translate(0.008, -0.078, 0.004); K.garder(gPla);
    var crochets = new THREE.InstancedMesh(gCro, mLaiton, 26), clesM = new THREE.InstancedMesh(gCle, mAcier, 26), plaques = new THREE.InstancedMesh(gPla, mLaiton, 26);
    // les numéros gravés : une case de 78 × 128 px par plaque (la plaque fait 6 × 8 cm), le chiffre
    // creusé (sombre) avec un liseré clair en bas (le bord de la gravure qui prend la lumière)
    var at = K.tex.canvas(1024, 256), ax = at.getContext("2d"); ax.clearRect(0, 0, 1024, 256);
    ax.font = "700 52px 'Space Mono','DejaVu Sans Mono',monospace"; ax.textAlign = "center"; ax.textBaseline = "middle";
    for (var k = 0; k < 26; k++) {
      var nx = (k % 13) * (1024 / 13) + 1024 / 26, ny = Math.floor(k / 13) * 128 + 64;
      ax.fillStyle = "rgba(255,226,170,0.55)"; ax.fillText(String(k + 1), nx + 1, ny + 2);
      ax.fillStyle = "rgba(26,16,6,0.95)"; ax.fillText(String(k + 1), nx, ny);
    }
    var mNum = K.garder(new THREE.MeshStandardMaterial({ map: K.tex.texture(at, { clamp: true }), transparent: true, alphaTest: 0.2, roughness: 0.6, metalness: 0.3 }));
    var numeros = [];
    var d = new THREE.Object3D();
    cles.forEach(function (c2, i) {
      d.position.set(c2.x, c2.y, 0.05); d.rotation.set(0, 0, 0); d.updateMatrix(); crochets.setMatrixAt(i, d.matrix);
      var pg = new THREE.PlaneGeometry(0.042, 0.069).toNonIndexed(), uv = pg.attributes.uv, u0 = (i % 13) / 13, v0 = 1 - (Math.floor(i / 13) + 1) / 2;
      for (var q = 0; q < uv.count; q++) uv.setXY(q, u0 + uv.getX(q) / 13, v0 + uv.getY(q) / 2);
      pg.translate(0.008, -0.078, 0.0075); numeros.push(pg);
    });
    crochets.instanceMatrix.needsUpdate = true;
    // les numéros suivent les plaques : une géométrie par plaque, fusionnée, qu'on déplace avec la plaque (un seul appel)
    var gNum = K.gens.fusion(numeros); K.garder(gNum);
    var numMesh = new THREE.Mesh(gNum, mNum); s.add(numMesh);
    var base = gNum.attributes.position.array.slice();
    s.add(crochets); s.add(clesM); s.add(plaques);
    // la pose des doubles à t : chacun pend à son crochet et se balance un peu (un courant d'air)
    var mtx = new THREE.Matrix4(), vtmp = new THREE.Vector3();
    function poser(t, souffle) {
      var pp = gNum.attributes.position;
      cles.forEach(function (c2, i) {
        var a = (Math.sin(t * 2.3 + i * 1.7) * 0.6 + K.fbm1(t * 0.8 + i, 5 + i) * 0.4) * souffle * (0.06 + 0.04 * K.h01(i, 9));
        d.position.set(c2.x, c2.y - 0.004, 0.09); d.rotation.set(0.1 + a * 0.4, 0, a); d.updateMatrix();
        clesM.setMatrixAt(i, d.matrix); plaques.setMatrixAt(i, d.matrix);
        for (var q = 0; q < 6; q++) {
          var o = (i * 6 + q) * 3; vtmp.set(base[o], base[o + 1], base[o + 2]).applyMatrix4(d.matrix); pp.setXYZ(i * 6 + q, vtmp.x, vtmp.y, vtmp.z);
        }
      });
      clesM.instanceMatrix.needsUpdate = true; plaques.instanceMatrix.needsUpdate = true; pp.needsUpdate = true;
    }
    // le bureau de la réception, sous le tableau ; le cahier ouvert, le stylo
    var mBu = K.mat.bois({ couleur: "#3b2414", lames: 5, graine: "bureau-reception", cire: true });
    P.boite(s, 2.6, 0.05, 0.62, mBu, 0.2, 1.02, 0.36); P.boite(s, 2.6, 1.0, 0.04, mBu, 0.2, 0.5, 0.66);
    var cc = K.tex.canvas(1024, 720), cx = cc.getContext("2d");
    var pap = K.tex.papier({ taille: 512, graine: "cahier", couleur: "#ece6d6" });
    cx.fillStyle = cx.createPattern(pap.canvas, "repeat"); cx.fillRect(0, 0, 1024, 720);
    cx.strokeStyle = "rgba(90,120,170,0.35)"; cx.lineWidth = 1;
    for (var gx = 0; gx < 1024; gx += 18) { cx.beginPath(); cx.moveTo(gx, 0); cx.lineTo(gx, 720); cx.stroke(); }
    for (var gy = 0; gy < 720; gy += 18) { cx.beginPath(); cx.moveTo(0, gy); cx.lineTo(1024, gy); cx.stroke(); }
    cx.fillStyle = "rgba(20,10,4,0.25)"; cx.fillRect(506, 0, 12, 720);
    // l'encre bleue : des heures et des chiffres, une ligne par soir ; la dernière, ce soir
    cx.fillStyle = "#1f3a8a"; cx.font = "italic 400 30px 'Space Mono','DejaVu Sans Mono',monospace"; cx.textBaseline = "middle";
    var lignesC = [["23 h 55", "26"], ["0 h 05", "26"], ["23 h 50", "26"], ["0 h 00", "24"], ["1 h 40", "26"], ["23 h 58", "26"], ["0 h 00", "26"]];
    lignesC.forEach(function (l, i2) {
      var y = 90 + i2 * 72, rr = K.alea("encre" + i2);
      cx.save(); cx.translate(560 + rr() * 10, y); cx.rotate((rr() - 0.5) * 0.03); cx.fillText(l[0], 0, 0); cx.fillText("—  " + l[1], 210, 0); cx.restore();
    });
    cx.save(); cx.translate(560, 90 + 7 * 72); cx.rotate(-0.01); cx.fillText("minuit", 0, 0); cx.fillText("—  26", 210, 0); cx.restore();
    var mCa = K.garder(new THREE.MeshStandardMaterial({ map: K.tex.texture(cc, { clamp: true }), roughness: 0.9 }));
    var gCa = new THREE.PlaneGeometry(0.44, 0.31, 16, 1), pc = gCa.attributes.position;
    for (var q3 = 0; q3 < pc.count; q3++) { var u3 = pc.getX(q3) / 0.22; pc.setZ(q3, (1 - Math.abs(u3)) * 0.012 + Math.abs(u3) * 0.004); }
    gCa.computeVertexNormals(); K.garder(gCa);
    var cahier = new THREE.Mesh(gCa, mCa); cahier.rotation.x = -PI / 2; cahier.rotation.z = 0.06; cahier.position.set(0.15, 1.052, 0.42); s.add(cahier);
    P.cylindre(s, 0.0045, 0.0045, 0.14, K.garder(new THREE.MeshStandardMaterial({ color: "#1f3a8a", roughness: 0.3 })), 0.42, 1.058, 0.47, { rz: PI / 2, ry: 0.6, cotes: 6 });
    // la sonnette, le registre fermé
    var mChrome = K.mat.metal({ couleur: "#c8ccd0", rugosite: 0.15 });
    var son = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.045, 18, 10, 0, PI * 2, 0, PI / 2)), mChrome); son.position.set(-0.55, 1.045, 0.5); s.add(son);
    P.boite(s, 0.32, 0.05, 0.24, K.garder(new THREE.MeshStandardMaterial({ color: "#3a1a14", roughness: 0.6 })), -0.95, 1.07, 0.42, { ry: -0.2 });
    // le standard, à droite, derrière sa vitre : les jacks, les voyants
    var ec = K.tex.ecran({ largeur: 256, hauteur: 256, type: "lcd", fond: "#16120e", ips: 10, dessiner: function (x, t, w, h) {
      for (var r = 0; r < 4; r++) for (var c3 = 0; c3 < 7; c3++) {
        var X = 24 + c3 * 32, Y = 30 + r * 52, on = K.h01(r * 7 + c3, 31) < 0.22 ? 1 : 0;
        x.fillStyle = on ? "#ffb347" : "#3a352c"; x.beginPath(); x.arc(X, Y, 6, 0, 7); x.fill();
        x.fillStyle = "#050505"; x.beginPath(); x.arc(X, Y + 18, 5, 0, 7); x.fill();
      }
      x.strokeStyle = "#7a1e18"; x.lineWidth = 4; x.beginPath(); x.moveTo(88, 98); x.quadraticCurveTo(110, 240, 150, 150); x.stroke();
      x.strokeStyle = "#151515"; x.beginPath(); x.moveTo(184, 150); x.quadraticCurveTo(170, 250, 120, 200); x.stroke();
    } });
    var st = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.62, 0.62)), K.garder(new THREE.MeshStandardMaterial({ map: ec.texture, emissive: new THREE.Color("#ffffff"), emissiveMap: ec.texture, emissiveIntensity: 0.6, roughness: 0.6 })));
    st.position.set(1.62, 1.6, 0.05); s.add(st);
    var vitre = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.9, 1.2)), K.garder(new THREE.MeshPhysicalMaterial({ color: "#20160e", roughness: 0.05, transparent: true, opacity: 0.25, envMapIntensity: 2 })));
    vitre.position.set(1.62, 1.65, 0.35); s.add(vitre);
    // la lampe du comptoir : laiton, abat-jour vert, une lumière basse et chaude sur les doubles
    var lampe = new THREE.Group(); lampe.position.set(-0.35, 1.045, 0.5); s.add(lampe);
    P.cylindre(lampe, 0.07, 0.08, 0.025, mLaiton, 0, 0.012, 0); P.cylindre(lampe, 0.008, 0.008, 0.3, mLaiton, 0, 0.16, 0);
    var abat = P.cylindre(lampe, 0.05, 0.11, 0.1, K.garder(new THREE.MeshPhysicalMaterial({ color: "#1f5a32", roughness: 0.25, emissive: new THREE.Color("#0c3a1c"), emissiveIntensity: 0.7, side: THREE.DoubleSide })), 0, 0.32, 0, { ouvert: true, cotes: 18 });
    var lL = K.look.projecteur({ couleur: "#FFD49A", intensite: 0.5, angle: 0.9, penombre: 0.8, ombre: false });
    lL.position.set(-0.35, 1.33, 0.5); s.add(lL);
    var cL = new THREE.Object3D(); cL.position.set(0.2, 1.0, 0.35); s.add(cL); lL.target = cL;
    var hL = K.look.halo({ couleur: "#FFD49A", taille: 0.3, intensite: 0.8 }); hL.position.set(-0.35, 1.32, 0.5); s.add(hL);
    // le plafonnier du hall, devant : il pose sur le tableau l'ombre de chaque crochet
    var lH = K.look.projecteur({ couleur: "#FFC98A", intensite: 15, angle: 0.55, penombre: 0.6, ombre: true, loin: 6, ombreTaille: 1024, pres: 0.5 });
    lH.position.set(0.3, 3.3, 1.6); s.add(lH);
    var cH2 = new THREE.Object3D(); cH2.position.set(0, 1.7, 0); s.add(cH2); lH.target = cH2;
    // le rose de l'enseigne, par la porte vitrée du hall (hors champ, à gauche)
    var lRose = K.look.ponctuelle({ couleur: ROSE, intensite: 2.2, portee: 6 }); lRose.position.set(-2.2, 2.2, 2.4); s.add(lRose);
    var froid = K.look.ponctuelle({ couleur: "#7f95c8", intensite: 0.8, portee: 5 }); froid.position.set(1.5, 2.6, 2.0); s.add(froid);
    var poussiere = K.particules.poussiere({ n: 500, zone: { min: [-1.2, 1.0, 0.1], max: [1.2, 2.4, 0.9] }, couleur: "#ffd7a0", opacite: 0.5, taille: 0.0035,
      lumieres: [{ pos: [-0.35, 1.34, 0.5], couleur: "#FFD49A", intensite: 1.6, rayon: 1.2 }] });
    s.add(poussiere);
    poser(0, 1);
    return {
      scene: s, cles: cles,
      look: { bloom: 0.6, rayon: 0.45, seuil: 0.88, exposition: 1.05, contraste: 1.16, saturation: 0.95 },
      maj: function (t) {
        // un courant d'air : quelqu'un vient d'entrer (les plaques bougent, puis se calment)
        poser(t, 0.35 + 0.65 * (1 - K.lisse(17.1, 21.5, t)));
        ec.maj(t); poussiere.maj(t);
        lL.intensity = 0.5 * (1 - 0.05 * Math.max(0, K.bruit1(t * 10, 13)));
      }
    };
  }

  FC.film({
    id: "vingt_six_doubles",
    livre: "apres_fiasco",
    titre: "Vingt-six doubles",
    duree: 37.0,
    musique: "livre_h7",
    secours: "ville_nuit",
    couleur: ROSE,
    affiche: 26.3,
    habillage: { vignette: 0.55, grain: 0.07, ratioPaysage: 2.35, ratioPortrait: 0 },
    sortie: { noir: 1.4 },
    // les bruits : la porte de service qui se referme derrière les arrivants
    sons: [[16.4, "porte"]],
    textes: [
      { sorte: "lieu", de: 0.9, a: 5.4, texte: "Aubérive, hôtel de la Rive", sous: "Mars 2011 · la veille du premier entraînement" },
      { sorte: "replique", de: 25.6, a: 30.4, qui: "Tibo Rancé", texte: "J'ai appris là, en bas. En novembre, je joue\u00a0?" },
      { sorte: "titre", de: 32.4, a: 36.8, texte: "Aubérive · 2011", sous: "Chambre 12", entree: 0.2, sortie: 0.7 }
    ],
    montages: { court: [[0.4, 5.2], [6.0, 10.6], [11.6, 16.2], [17.1, 21.6], [23.6, 30.0], [31.2, 35.8]] },
    preparer: function (K, ctx) {
      return K.etapes(ctx, [
        function () { ctx.decors.dehors = dehors(K, ctx); },
        function () { ctx.decors.hall = hall(K, ctx); }
      ]);
    },
    plans: [
      // 1 · le parking, de haut : on descend vers le bus, l'enseigne s'allume
      { de: 0, a: 5.7, decor: "dehors", entree: "noir", transition: 1.3, fixe: 4.2,
        camera: { pos: K_cles([[0, [20, 13.5, 30]], [5.7, [13.2, 2.1, 15.2]]], "douce"), cible: K_cles([[0, [1, 1.0, 5]], [5.7, [4.0, 2.2, 11.0]]], "douce"), fov: K_cles([[0, 52], [5.7, 42]], "douce"), epaule: 0.06 },
        cadrage: { portrait: { x: K_cles([[0, 0.05], [5.7, -0.12]]) } } },
      // 2 · le bus, dedans : l'allée vers le dernier rang
      { de: 5.7, a: 11.4, decor: "dehors", entree: "coupe", fixe: 4.6,
        camera: { pos: K_bus([[0, [3.6, 1.86, 0.05]], [5.7, [-3.75, 1.84, 0.12]]]), cible: K_bus([[0, [-5.8, 1.9, 0.12]], [5.7, [-5.75, 1.99, 0.5]]]), fov: K_cles([[0, 52], [5.7, 34]], "douce"), epaule: 0.12 } },
      // 3 · l'arrivée : quatre survêtements sous la pluie, contre la porte
      { de: 11.4, a: 17.1, decor: "dehors", entree: "coupe", fixe: 3.4,
        camera: { pos: K_cles([[0, [10.2, 0.85, 13.6]], [5.7, [9.3, 0.9, 12.7]]], "lin"), cible: K_cles([[0, [10.4, 1.7, 0.5]], [5.7, [8.6, 1.75, 0.6]]], "douce"), fov: 48, epaule: 0.1 },
        cadrage: { portrait: { x: K_cles([[0, 0.35], [5.7, -0.25]]) } } },
      // 4 · le cahier (« minuit — 26 »), le tableau des vingt-six doubles, puis la 12
      { de: 17.1, a: 22.9, decor: "hall", entree: "coupe", fixe: 3.2,
        camera: { pos: K_cles([[0, [0.24, 1.42, 0.78]], [1.3, [0.18, 1.46, 0.8]], [2.6, [-0.08, 1.74, 1.45]], [5.8, [-0.37, 1.69, 0.36]]], "douce"),
          cible: K_cles([[0, [0.24, 1.05, 0.44]], [1.3, [0.2, 1.06, 0.43]], [2.6, [-0.05, 1.72, 0.0]], [5.8, [-0.392, 1.672, 0.08]]], "douce"),
          fov: K_cles([[0, 36], [2.6, 44], [5.8, 30]], "douce"), epaule: 0.1 },
        // en portrait, la fenêtre suit la 12 pendant qu'on s'en approche
        cadrage: { portrait: { x: K_cles([[0, 0], [2.5, 0], [3.4, -0.9], [4.4, -0.85], [5.0, -0.5], [5.8, 0.05]], "douce") } },
        look: { exposition: 1.1 } },
      // 5 · la façade du terrain : la 12 s'allume, une silhouette à la vitre
      { de: 22.9, a: 28.6, decor: "dehors", entree: "coupe", fixe: 3.8,
        camera: { pos: K_cles([[0, [30, 1.4, -10.2]], [5.7, [29, 1.6, -9.3]]], "lin"), cible: K_cles([[0, [14, 7.5, -4.3]], [5.7, [14, 8.1, -4.5]]], "douce"), fov: K_cles([[0, 32], [5.7, 25]], "douce"), epaule: 0.08 },
        cadrage: { portrait: { x: -0.05 } } },
      // 6 · ce qu'il voit : le terrain annexe, d'en haut, derrière la vitre de la 12
      { de: 28.6, a: 37.0, decor: "dehors", entree: "coupe", fixe: 0.5,
        camera: { pos: K_cles([[0, [10.45, 8.4, -5.0]], [1.6, [10.75, 8.42, -4.9]], [3.6, [13.15, 8.58, -4.33]], [8.4, [13.4, 8.62, -4.3]]], "douce"),
          cible: K_cles([[0, [14, 8.3, -4.75]], [1.6, [14, 8.25, -4.7]], [3.6, [24.85, 3.0, -2.27]], [8.4, [24.8, 2.85, -2.3]]], "douce"),
          fov: K_cles([[0, 48], [3.6, 50], [8.4, 44]], "douce"), epaule: 0.06, pres: 0.03 },
        cadrage: { paysage: { y: K_cles([[0, 0], [2.0, 0], [3.6, -0.45]], "douce") } },
        look: { exposition: 1.55 } }
    ]
  });

  // les aides de la trousse, lues quand le film tourne (la trousse est chargée avant le film)
  function K_() { return FC.kit; }
  function K_cles(p, a) { var f = null; return function (t) { if (!f) f = K_().cles(p, a); return f(t); }; }
  // une position dans le bus (son repère) → le monde : le bus est posé et tourné dans le décor
  function K_bus(p) {
    var f = null;
    return function (l, pr, c) {
      if (!f) f = K_().cles(p, "douce");
      var v = f(l), b = c.decors.dehors.bus, THREE = c.THREE;
      var w = new THREE.Vector3(v[0], v[1], v[2]); b.updateMatrixWorld(true); w.applyMatrix4(b.matrixWorld);
      return [w.x, w.y, w.z];
    };
  }
})(typeof window !== "undefined" ? window : this);
