/* ═══════════════════════════════════════════════════════════════════════════
   FILM — « Six heures dix » (livre 8, « L'Oreillette », 2024, le directeur
   sportif — ou la directrice — conduit par un modèle ; la couleur du livre :
   #4FE3FF).

   Le premier jour, et le premier ordre. Ce que le film montre, et pourquoi
   (docs/histoires/00_les_dix_histoires.md, « Histoire 8 ») — rien que le
   prologue n'ait déjà dit, et l'image de la carte qui suit :
     · l'oreillette couleur peau dans son étui ouvert, sur le bureau du club-
       house, à six heures dix ; sa diode qui bat avec la voix (« Bonjour. On
       commence par les ventes ? », la voix de Joachim Ferlac, mort en
       décembre : le prologue) ;
     · le club dans un tableur : des noms, des matchs, des nuits, des valeurs,
       le calcul qui tourne ; le curseur posé sur VOLLAIRE ;
     · six heures et demie, l'escalier du club-house : Jean-Marie Vaubourg monte,
       une marche, la canne, une marche ; il passe devant le clou où pendait la
       photo de 1974 (« Il lui reste six cent douze jours. ») ;
     · par la fenêtre du bureau, à l'aube, le stade de la Rive : ALMADIS sur le
       toit de la Nord (« le nom écrit sur la tribune »), et sur la grille, une
       bâche blanche ;
     · la bâche de vingt mètres, peinte à la main : VOLLAIRE, L'ENFANT DU QUAI
       (la carte qui suit) ;
     · « Aubérive · 2024 / L'Oreillette ».
   Il se joue avant la carte de Vollaire (ds.h8.a1_vollaire, créneau 1 de la
   saison 2024 : 100 % des carrières du livre, mesuré sur 300), donc après le
   prologue et ses scènes jouées. Il ne devance rien : ni la vente, ni Kerdal,
   ni « fin de cycle » ; on ne voit jamais le héros (ni son visage, ni sa main) ;
   on ne voit pas celui de Vaubourg (de dos, d'en bas, à contre-jour).

   LES PLANS (37 s ; la musique : livre_h8, 110 à la noire, une mesure = 2,18 s ;
   l'introduction : le déclic et la voix (0–2 s), le calcul, la basse (4,4 s) ;
   le tableur à 8,7 s ; la voix revient à 24,0 s : les coupes tombent sur les
   mesures)
     1   0,0–4,4   l'étui ouvert, l'oreillette, la diode qui bat · réplique (dans
                   ton oreille) : « Bonjour. On commence par les ventes ? »
     2   4,4–8,7   l'écran : le club en lignes, le calcul, le curseur sur VOLLAIRE
                   · carton « Aubérive, le club-house / 2024 · six heures dix »
     3   8,7–15,3  l'escalier, d'en bas : la petite lampe de laiton qui éclaire
                   encore le clou et le rectangle de la photo de 1974 ; Vaubourg
                   entre dans le champ et monte, à contre-jour, la canne · réplique
                   (dans ton oreille) : « Il lui reste six cent douze jours. »
     4  15,3–21,8  par la fenêtre du bureau : le stade à l'aube, ALMADIS, la bâche
                   au loin ; le tableur en reflet sur la vitre
     5  21,8–28,4  la bâche, de près : on la longe, lettre après lettre
     6  28,4–37,0  la Nord, la bâche, la brume sur la pelouse vide · titre
                   « Aubérive · 2024 / L'Oreillette »
   La coupe de 30 s (montages.court) : les mêmes plans, resserrés.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var FC = global.FusibleCinema;
  var PI = Math.PI;
  var CYAN = "#4FE3FF";
  var BORDEAUX = "#7A1F2E";

  // le mannequin de la trousse laisse un jour entre le buste et les cuisses : un bassin le comble
  function etoffer(K, THREE, m, couleur) {
    var s = m.taille, mat = K.garder(new THREE.MeshStandardMaterial({ color: couleur || "#07070a", roughness: 0.92 }));
    var b = new THREE.Mesh(K.garder(new THREE.CylinderGeometry(0.165 * s, 0.17 * s, 0.26 * s, 12)), mat); b.position.y = -0.07 * s; b.scale.z = 0.66; b.castShadow = true; m.os.bassin.add(b);
    return m;
  }
  // une boîte aux arêtes arrondies : w × h × d, rayon r
  function boiteRonde(THREE, w, h, d, r, n) {
    var g = new THREE.BoxGeometry(1, 1, 1, n || 6, n || 6, n || 6), p = g.attributes.position, v = new THREE.Vector3(), c = new THREE.Vector3();
    var inner = new THREE.Vector3(w / 2 - r, h / 2 - r, d / 2 - r);
    for (var i = 0; i < p.count; i++) {
      v.set(p.getX(i) * w, p.getY(i) * h, p.getZ(i) * d);
      c.set(Math.max(-inner.x, Math.min(inner.x, v.x)), Math.max(-inner.y, Math.min(inner.y, v.y)), Math.max(-inner.z, Math.min(inner.z, v.z)));
      v.sub(c); if (v.lengthSq() > 1e-12) v.normalize().multiplyScalar(r);
      v.add(c); p.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    return g;
  }

  // ─── LE TABLEUR : le club en lignes (des noms du réservoir, aucun écho) ─────────
  var EFFECTIF = [
    ["KERDAL", 27, 70, "dispo 3/sem"], ["VOLLAIRE", 19, 31, "—"], ["NKOLO", 24, 58, "—"], ["SABBAH", 29, 61, "—"],
    ["PEYRARD", 31, 44, "—"], ["LOURENÇO", 22, 52, "—"], ["ABADIE", 26, 66, "—"], ["MAZEYRAC", 20, 12, "—"],
    ["VIGUIÉ", 28, 63, "—"], ["SOUBIRAN", 33, 39, "—"], ["FERRIOL", 23, 47, "—"], ["BERNADAC", 25, 57, "—"]
  ];
  function dessinerTableur(K, x, t, w, h, miroir) {
    var u = w / 1024;
    x.save();
    if (miroir) { x.translate(w, 0); x.scale(-1, 1); }
    x.fillStyle = "#0b1116"; x.fillRect(0, 0, w, h);
    x.fillStyle = "#121b22"; x.fillRect(0, 0, w, 54 * u);
    x.font = "700 " + Math.round(22 * u) + "px 'Space Mono','DejaVu Sans Mono',monospace"; x.textBaseline = "middle";
    x.fillStyle = CYAN; x.fillText("ALMADIS · MODÈLE", 18 * u, 27 * u);
    x.fillStyle = "#8fa3b0"; x.fillText("RACING AUBÉRIVE 2024-2025", 300 * u, 27 * u);
    var s = Math.floor(t) % 60, hh = "06:10:" + (s < 10 ? "0" : "") + s;
    x.fillStyle = "#d7e3ea"; x.fillText(hh, 880 * u, 27 * u);
    var cols = [["JOUEUR", 18], ["ÂGE", 230], ["MATCHS", 300], ["NUITS", 410], ["VALEUR", 520], ["COURBE", 690], ["", 880]];
    x.font = "700 " + Math.round(17 * u) + "px 'Space Mono','DejaVu Sans Mono',monospace"; x.fillStyle = "#5f7684";
    cols.forEach(function (c) { x.fillText(c[0], c[1] * u, 78 * u); });
    var y0 = 104 * u, lh = 43 * u;
    x.font = "400 " + Math.round(19 * u) + "px 'Space Mono','DejaVu Sans Mono',monospace";
    EFFECTIF.forEach(function (r, i) {
      var y = y0 + i * lh;
      if (i % 2) { x.fillStyle = "rgba(255,255,255,0.025)"; x.fillRect(0, y - lh / 2, w, lh); }
      // le calcul : une cellule de temps en temps se recalcule (elle clignote)
      var cl = K.h01(i * 13 + Math.floor(t * 3), 7) < 0.12;
      x.fillStyle = "#d7e3ea"; x.fillText(r[0], 18 * u, y);
      x.fillStyle = "#8fa3b0"; x.fillText(String(r[1]), 230 * u, y); x.fillText(String(r[2]), 300 * u, y);
      var nuits = (5.2 + K.h01(i, 3) * 2.6 + (cl ? (K.h01(i, Math.floor(t * 3)) - 0.5) * 0.4 : 0)).toFixed(1);
      x.fillStyle = cl ? CYAN : "#8fa3b0"; x.fillText(nuits + " h", 410 * u, y);
      var val = Math.round((0.6 + K.h01(i, 5) * 3.4) * 10) / 10 + (cl ? K.h01(i, Math.floor(t * 3) + 1) * 0.1 : 0);
      x.fillStyle = cl ? CYAN : "#8fa3b0"; x.fillText(val.toFixed(2) + " M", 520 * u, y);
      // la courbe : une petite ligne qui respire
      x.strokeStyle = "#5fb7c8"; x.lineWidth = 2 * u; x.beginPath();
      for (var k = 0; k <= 24; k++) {
        var cx = 690 * u + k * 7 * u, cy = y + (K.fbm1(k * 0.35 + i * 7 + t * 0.4, i + 3) - 0.5) * 22 * u;
        if (k) x.lineTo(cx, cy); else x.moveTo(cx, cy);
      }
      x.stroke();
      x.fillStyle = "#5f7684"; x.fillText(r[3], 880 * u, y);
    });
    // le curseur : sur VOLLAIRE, la ligne choisie
    var yv = y0 + 1 * lh, k2 = 0.65 + 0.35 * (Math.floor(t * 2.5) % 2);
    x.strokeStyle = "rgba(79,227,255," + k2.toFixed(2) + ")"; x.lineWidth = 3 * u; x.strokeRect(6 * u, yv - lh / 2 + 3 * u, w - 12 * u, lh - 6 * u);
    x.fillStyle = "rgba(79,227,255,0.08)"; x.fillRect(6 * u, yv - lh / 2 + 3 * u, w - 12 * u, lh - 6 * u);
    x.restore();
  }

  // ─── LE CLUB-HOUSE : le bureau (l'étui, l'écran, la fenêtre) ; l'escalier ──────
  // le bureau : la table en z ≈ 0, la fenêtre derrière (z = -1,2) ; l'escalier à part, en x = 8
  // (il monte vers -z), le palier et sa fenêtre en haut.
  var ESC = { x: 8, n: 16, gi: 0.27, hm: 0.18, w: 1.2 };
  function bureau(K, ctx) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: false, fond: "#05070a", environnement: { zenith: "#1a2233", horizon: "#9a7f86", lueur: "#d79a7e", fenetres: 0,
      lampes: [{ pos: [0, 6, -30], couleur: "#ffd2b0", intensite: 4, taille: 10 }, { pos: [-20, 4, 10], couleur: "#9fd8ff", intensite: 1.5, taille: 8 }] }, reflets: 0.9,
      ambiance: ["#3a4a66", "#140e0c", 0.18] });
    // ── le bureau : le sol, le mur de la fenêtre, la table
    var mSol = K.mat.bois({ couleur: "#3a2a1e", lames: 7, graine: "parquet-club", repete: [2, 2] });
    var sol = new THREE.Mesh(P.planUV(5, 5, 1.5), mSol); sol.rotation.x = -PI / 2; sol.position.set(0, 0, 0.5); sol.receiveShadow = true; s.add(sol);
    var mMur = K.mat.beton({ couleur: "#6c6a62", graine: "platre-club", banches: 0, taches: 0.5 });
    var zf = -1.2;
    [[-1.8, 1.6, 1.45, 2.9], [1.8, 1.6, 1.45, 2.9]].forEach(function (m) { P.boite(s, m[1], m[3], 0.2, mMur, m[0], m[3] / 2, zf - 0.1); });
    P.boite(s, 2.0, 0.9, 0.2, mMur, 0, 0.45, zf - 0.1); P.boite(s, 2.0, 0.6, 0.2, mMur, 0, 2.6, zf - 0.1);
    var mCad = K.mat.peint({ couleur: "#d9d6cc", rugosite: 0.5 });
    P.boite(s, 2.04, 0.06, 0.14, mCad, 0, 0.92, zf); P.boite(s, 2.04, 0.06, 0.14, mCad, 0, 2.3, zf); P.boite(s, 0.06, 1.4, 0.14, mCad, -1.0, 1.61, zf); P.boite(s, 0.06, 1.4, 0.14, mCad, 1.0, 1.61, zf); P.boite(s, 0.04, 1.4, 0.1, mCad, 0, 1.61, zf);
    // dehors, l'aube : un ciel, le stade au loin (les pylônes, le toit de la Nord)
    var tc = K.tex.canvas(512, 256), cxx = tc.getContext("2d"), gs = cxx.createLinearGradient(0, 0, 0, 256);
    gs.addColorStop(0, "#22304d"); gs.addColorStop(0.55, "#8d6f80"); gs.addColorStop(0.8, "#e7a07c"); gs.addColorStop(1, "#c98a70");
    cxx.fillStyle = gs; cxx.fillRect(0, 0, 512, 256);
    cxx.fillStyle = "#1b1a22"; cxx.fillRect(60, 196, 390, 60); cxx.fillRect(40, 214, 440, 42);
    [[70, 96], [440, 92]].forEach(function (p) { cxx.fillRect(p[0], p[1], 4, 120); cxx.fillRect(p[0] - 12, p[1] - 14, 28, 16); });
    var dehorsV = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(9, 4.5)), K.garder(new THREE.MeshBasicMaterial({ map: K.tex.texture(tc, { clamp: true }), color: new THREE.Color(1, 1, 1).multiplyScalar(0.9) })));
    dehorsV.position.set(0, 1.9, -4.5); s.add(dehorsV);
    var aube = K.look.projecteur({ couleur: "#ffc3a0", intensite: 9, angle: 0.7, penombre: 0.9, ombre: true, loin: 8, ombreTaille: 1024 });
    aube.position.set(0.3, 2.2, -2.6); s.add(aube);
    var cA = new THREE.Object3D(); cA.position.set(0.1, 0.76, 0.2); s.add(cA); aube.target = cA;
    // la table : le plateau, deux pieds-caissons
    var mTab = K.mat.bois({ couleur: "#2a1d14", lames: 2, graine: "table-ds", cire: true });
    P.boite(s, 1.7, 0.04, 0.85, mTab, 0, 0.74, 0.1); P.boite(s, 0.5, 0.72, 0.8, mTab, -0.55, 0.36, 0.1); P.boite(s, 0.05, 0.72, 0.8, mTab, 0.8, 0.36, 0.1);
    // l'ordinateur : le socle, l'écran (le tableur)
    var ec = K.tex.ecran({ largeur: 1024, hauteur: 640, type: "lcd", fond: "#0b1116", ips: 12, dessiner: function (x, t, w, h) { dessinerTableur(K, x, t, w, h, false); } });
    var mEc = K.garder(new THREE.MeshBasicMaterial({ map: ec.texture, color: new THREE.Color(1, 1, 1).multiplyScalar(1.05), toneMapped: true }));
    var mGris = K.garder(new THREE.MeshStandardMaterial({ color: "#2b2f34", roughness: 0.35, metalness: 0.6 }));
    var ordi = new THREE.Group(); ordi.position.set(-0.32, 0.76, 0.18); ordi.rotation.y = 0.32; s.add(ordi);
    P.boite(ordi, 0.36, 0.012, 0.25, mGris, 0, 0.006, 0);
    var charn = new THREE.Group(); charn.position.set(0, 0.012, -0.12); charn.rotation.x = -0.28; ordi.add(charn);
    P.boite(charn, 0.36, 0.235, 0.008, mGris, 0, 0.118, 0);
    var ecM = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.34, 0.2125)), mEc); ecM.position.set(0, 0.118, 0.0045); charn.add(ecM);
    var lEc = K.look.ponctuelle({ couleur: "#9fe9ff", intensite: 0.55, portee: 1.3 }); lEc.position.set(-0.25, 0.95, 0.3); s.add(lEc);
    // une tasse, des feuilles
    P.cylindre(s, 0.04, 0.035, 0.09, K.garder(new THREE.MeshStandardMaterial({ color: "#d8d3c8", roughness: 0.4 })), 0.55, 0.805, 0.32, { cotes: 18 });
    P.boite(s, 0.21, 0.004, 0.297, K.garder(new THREE.MeshStandardMaterial({ color: "#e4e0d6", roughness: 0.9 })), 0.25, 0.762, 0.38, { ry: 0.25 });
    // l'étui, ouvert ; l'oreillette couleur peau, couchée dans son creux ; la diode
    var mEtui = K.garder(new THREE.MeshStandardMaterial({ color: "#3b3c40", roughness: 0.5, metalness: 0.15 }));
    var etui = new THREE.Group(); etui.position.set(0.18, 0.76, 0.12); etui.rotation.y = -0.4; s.add(etui);
    var base = new THREE.Mesh(K.garder(boiteRonde(THREE, 0.062, 0.022, 0.044, 0.01, 4)), mEtui); base.position.y = 0.011; etui.add(base);
    var creux = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.05, 0.032)), K.garder(new THREE.MeshStandardMaterial({ color: "#2a2b2e", roughness: 0.8 })));
    creux.rotation.x = -PI / 2; creux.position.set(0, 0.0222, 0); etui.add(creux);
    var couv = new THREE.Group(); couv.position.set(0, 0.022, -0.022); couv.rotation.x = -1.9; etui.add(couv);
    var lid = new THREE.Mesh(K.garder(boiteRonde(THREE, 0.06, 0.008, 0.042, 0.004, 4)), mEtui); lid.position.set(0, 0.004, 0.021); couv.add(lid);
    var dEtui = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.0012, 6, 4)), K.mat.lumiere({ couleur: "#ffffff", intensite: 4, toneMapped: false })); dEtui.position.set(0, 0.008, 0.0222); etui.add(dEtui);
    var or = P.telephone({ epoque: "oreillette", couleur: "#d6a98c" }); or.position.set(0.004, 0.026, 0.002); or.rotation.set(-PI / 2 + 0.25, 0, 0.3); etui.add(or);
    // ── l'escalier du club-house (il monte vers -z), le palier, sa fenêtre ; le clou de 1974
    var esc = P.escalier({ marches: ESC.n, largeur: ESC.w, giron: ESC.gi, hauteurMarche: ESC.hm, rampe: "droite", bois: "#4a2e1a" });
    esc.position.set(ESC.x, 0, 0); s.add(esc);
    var Hesc = ESC.n * ESC.hm, Zesc = -ESC.n * ESC.gi;
    var mPapier = K.mat.papier({ couleur: "#5b4a3a", graine: "papier-escalier", repete: [2, 2] });
    var murG = new THREE.Mesh(P.planUV(8, 6, 1.2), mPapier); murG.rotation.y = PI / 2; murG.position.set(ESC.x - ESC.w / 2 - 0.02, 3, -2); s.add(murG);
    var murD = new THREE.Mesh(P.planUV(8, 6, 1.2), mPapier); murD.rotation.y = -PI / 2; murD.position.set(ESC.x + ESC.w / 2 + 0.25, 3, -2); s.add(murD);
    P.boite(s, ESC.w + 0.4, 0.1, 2.2, K.mat.bois({ couleur: "#4a2e1a", lames: 4, graine: "palier" }), ESC.x, Hesc + 0.02, Zesc - 1.1);
    // la fenêtre du palier : l'aube, qui découpe ceux qui montent
    var mFen = K.garder(new THREE.MeshBasicMaterial({ map: K.tex.texture(tc, { clamp: true }), color: new THREE.Color(1, 1, 1).multiplyScalar(1.4) }));
    var fen = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(1.0, 1.5)), mFen); fen.position.set(ESC.x, Hesc + 1.55, Zesc - 2.14); s.add(fen);
    var mFond = K.mat.beton({ couleur: "#4d473f", graine: "fond-palier", banches: 0 });
    P.boite(s, ESC.w + 0.6, 0.85, 0.1, mFond, ESC.x, Hesc + 0.42, Zesc - 2.2); P.boite(s, ESC.w + 0.6, 1.6, 0.1, mFond, ESC.x, Hesc + 3.1, Zesc - 2.2);
    P.boite(s, 0.2, 1.5, 0.1, mFond, ESC.x - 0.6, Hesc + 1.55, Zesc - 2.2); P.boite(s, 0.2, 1.5, 0.1, mFond, ESC.x + 0.6, Hesc + 1.55, Zesc - 2.2);
    var lPal = K.look.projecteur({ couleur: "#ffd0b0", intensite: 26, angle: 0.75, penombre: 0.7, ombre: true, loin: 12, ombreTaille: 1024 });
    lPal.position.set(ESC.x, Hesc + 1.9, Zesc - 2.0); s.add(lPal);
    var cPal = new THREE.Object3D(); cPal.position.set(ESC.x, 0.6, 0.4); s.add(cPal); lPal.target = cPal;
    var hPal = K.look.halo({ couleur: "#ffd6bc", taille: 2.6, intensite: 0.5 }); hPal.position.set(ESC.x, Hesc + 1.55, Zesc - 2.0); s.add(hPal);
    // la petite lampe de laiton qui éclairait la photo : elle éclaire toujours le rectangle vide
    var lPhoto = K.look.projecteur({ couleur: "#ffc890", intensite: 2.6, angle: 0.75, penombre: 0.6, ombre: false, loin: 3 });
    lPhoto.position.set(ESC.x - ESC.w / 2 + 0.16, 3.02, -2.15); s.add(lPhoto);
    var cPh = new THREE.Object3D(); cPh.position.set(ESC.x - ESC.w / 2, 2.55, -2.15); s.add(cPh); lPhoto.target = cPh;
    var mLai = K.garder(new THREE.MeshStandardMaterial({ color: "#a57c38", roughness: 0.4, metalness: 0.85 }));
    P.boite(s, 0.12, 0.03, 0.05, mLai, ESC.x - ESC.w / 2 + 0.06, 3.0, -2.15);
    P.cylindre(s, 0.025, 0.035, 0.22, mLai, ESC.x - ESC.w / 2 + 0.13, 3.0, -2.15, { rx: PI / 2, rz: 0.3, cotes: 12 });
    var applique = K.look.ponctuelle({ couleur: "#ffb46a", intensite: 0.6, portee: 4 }); applique.position.set(ESC.x - 0.45, 2.3, -0.4); s.add(applique);
    // la photo de 1974 n'y est plus : un clou, un rectangle plus clair, ses bords nets
    var zc = -2.15, yc = 2.62, tr = K.tex.canvas(128, 104), trx = tr.getContext("2d");
    // le papier peint, là, n'a pas passé : plus vif, plus clair, ses bords nets ; un peu de poussière en haut
    trx.fillStyle = "rgba(176,132,92,1)"; trx.fillRect(4, 4, 120, 96);
    trx.fillStyle = "rgba(60,40,26,0.35)"; trx.fillRect(4, 4, 120, 5);
    trx.strokeStyle = "rgba(40,28,18,0.7)"; trx.lineWidth = 2; trx.strokeRect(4, 4, 120, 96);
    var rect = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.5, 0.4)), K.garder(new THREE.MeshStandardMaterial({ map: K.tex.texture(tr, { clamp: true }), transparent: true, roughness: 0.9 })));
    rect.rotation.y = PI / 2; rect.position.set(ESC.x - ESC.w / 2 - 0.012, yc, zc); s.add(rect);
    P.cylindre(s, 0.0025, 0.0025, 0.03, K.mat.metal({ couleur: "#3a3a3a", rugosite: 0.4 }), ESC.x - ESC.w / 2 + 0.003, yc + 0.24, zc, { rz: PI / 2, cotes: 6 });
    // Vaubourg : un manteau, une casquette, la canne ; de dos, il monte
    var vb = etoffer(K, THREE, K.gens.mannequin({ tenue: "manteau", couleur: "#242428", couleur2: "#1c1c20", taille: 1.66, carrure: 0.9, casquette: true, graine: "vaubourg" }), "#1c1c20");
    vb.groupe.rotation.y = PI; s.add(vb.groupe);
    var mCanne = K.garder(new THREE.MeshStandardMaterial({ color: "#8a6a44", roughness: 0.35, metalness: 0.1 }));
    var canne = new THREE.Group(); vb.os.mainD.add(canne);
    P.cylindre(canne, 0.014, 0.012, 0.86, mCanne, 0, -0.43, 0.02, { cotes: 8 });
    P.cylindre(canne, 0.014, 0.014, 0.12, mCanne, 0, 0.0, 0.07, { rx: PI / 2, cotes: 8 });
    P.cylindre(canne, 0.016, 0.016, 0.04, K.mat.metal({ couleur: "#9a9a9a", rugosite: 0.3 }), 0, -0.86, 0.02, { cotes: 8 });
    // l'écran se reflète (le plan 2) ; les poussières dans la lumière de l'aube (l'escalier)
    var pous = K.particules.poussiere({ n: 300, zone: { min: [ESC.x - 0.6, 0.4, -4.5], max: [ESC.x + 0.6, 4.0, 0.5] }, couleur: "#ffe0c8", opacite: 0.5, taille: 0.004,
      lumieres: [{ pos: [ESC.x, Hesc + 1.6, Zesc - 2.0], couleur: "#ffd0b0", intensite: 1.6, rayon: 4 }] });
    s.add(pous);
    // la montée : quatre marches pendant le plan 3 (une marche, la canne, une marche)
    var M0 = 3, T0 = 9.0, DT = 1.55;
    function monter(t) {
      var e = (t - T0) / DT, n = K.borne(Math.floor(e), 0, 3), u = K.borne(e - n, 0, 1);
      if (e < 0) { n = 0; u = 0; }
      if (e >= 4) { n = 3; u = 1; }
      var a = esc.marche(M0 + n), b = esc.marche(M0 + n + 1), lev = K.lisse(0.62, 1.0, u);
      vb.groupe.position.set(ESC.x + 0.1, a[1] + (b[1] - a[1]) * lev, a[2] + (b[2] - a[2]) * lev);
      vb.repos(t * 0.5);
      vb.os.buste.rotation.x = 0.3; vb.os.tete.rotation.x = 0.22; vb.os.tete.rotation.y = 0;
      // la canne d'abord (le bras gauche — D dans la trousse — vers l'avant, puis posé plus haut)
      var c1 = K.cloche(0.0, 0.12, 0.25, 0.4, u);
      vb.os.epauleD.rotation.x = -0.2 - 0.3 * c1 - 0.1 * lev; vb.os.epauleD.rotation.z = 0.28; vb.os.coudeD.rotation.x = -0.25;
      // la main droite sur la rampe (G dans la trousse)
      vb.os.epauleG.rotation.x = -0.55; vb.os.epauleG.rotation.z = -0.32; vb.os.coudeG.rotation.x = -0.6;
      // la jambe droite monte, puis la gauche la rejoint
      var j1 = K.cloche(0.3, 0.45, 0.6, 0.75, u), j2 = K.cloche(0.68, 0.8, 0.9, 1.0, u);
      vb.os.hancheG.rotation.x = -0.85 * j1 - 0.25 * (u > 0.6 ? 1 - lev : 0); vb.os.genouG.rotation.x = 1.15 * j1 + 0.05;
      vb.os.hancheD.rotation.x = -0.75 * j2; vb.os.genouD.rotation.x = 1.0 * j2 + 0.05;
    }
    return {
      scene: s,
      look: { bloom: 0.75, rayon: 0.5, seuil: 0.85, exposition: 1.15, contraste: 1.14, saturation: 0.9 },
      maj: function (t, c) {
        var plan = c.indice, tout = plan == null;
        ec.maj(t); or.maj(t);
        // la diode bat avec la voix (0,3–2,0 s : « Bonjour. On commence par les ventes ? »)
        var voix = K.lisse(0.25, 0.35, t) * (1 - K.lisse(2.0, 2.3, t));
        dEtui.material.color.setScalar(1.5 + 3 * voix * (0.5 + 0.5 * Math.sin(t * 19)));
        monter(t);
        vb.groupe.visible = tout || plan === 2;
        pous.maj(t);
      }
    };
  }

  // ─── LE STADE DE LA RIVE, à l'aube ──────────────────────────────────────────────
  // la pelouse au centre (la longueur le long de z) ; la Nord derrière le but de -z ; la bâche
  // sur sa grille ; ALMADIS sur son toit ; quatre pylônes éteints ; la fenêtre du bureau du
  // club-house (le plan 4) au coin sud-ouest, au premier étage.
  var NORD = { z: -55.5 };
  var FENETRE = { x: -40, y: 7.0, z: 52 };
  function stade(K, ctx) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: { zenith: "#2a3a5c", horizon: "#e3a688", lueur: "#ffb07a", lueurDir: [1, -0.15], force: 1.3 }, brouillard: ["#a8a4b0", 0.0042],
      environnement: { fenetres: 0 }, reflets: 0.9, ambiance: ["#8496c0", "#3a2c24", 0.55] });
    var pel = P.pelouse({ boue: 0.15 }); s.add(pel);
    // le sol autour : du béton, de la piste
    var mB = K.mat.beton({ couleur: "#55524c", graine: "parvis-rive", banches: 0 });
    var parvis = new THREE.Mesh(P.planUV(180, 200, 4), mB); parvis.rotation.x = -PI / 2; parvis.position.y = -0.02; s.add(parvis);
    // la Nord : gradins, sièges bordeaux et gris, grillage, panneaux d'Aubérive
    var nord = P.tribune({ largeur: 64, rangs: 22, couleurs: [BORDEAUX, "#8E8C86"], graine: "nord-rive" });
    nord.position.set(0, 0, NORD.z); s.add(nord);
    // ALMADIS sur le bord du toit (« le nom écrit sur la tribune »)
    var ta = K.tex.texte({ lignes: ["ALMADIS"], fond: "#1a1d22", encre: "#e8ecef", largeur: 2048, hauteur: 192, graisse: "700", graine: "almadis" });
    var almadis = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(30, 2.8)), K.garder(new THREE.MeshStandardMaterial({ map: ta.map, roughness: 0.5, metalness: 0.2, emissive: new THREE.Color("#ffffff"), emissiveMap: ta.map, emissiveIntensity: 0.12 })));
    // (le bord avant du toit : 72 % de la profondeur depuis le fond, relevé de 0,07 rad)
    var D0 = nord.profondeurTotale, avant = -D0 + D0 * 0.72 - 0.3, Ht = nord.hauteur + 4.5 + Math.sin(0.07) * D0 * 0.36;
    almadis.position.set(0, Ht - 1.25, NORD.z + avant + 0.15); s.add(almadis);
    // les autres tribunes : des masses sombres (on ne les voit qu'au loin)
    var mMasse = K.mat.beton({ couleur: "#3e3c38", graine: "masses-rive", banches: 1 });
    P.boite(s, 6, 16, 92, mMasse, -42, 8, 0); P.boite(s, 6, 18, 92, mMasse, 42, 9, 0); P.boite(s, 70, 14, 8, mMasse, 0, 7, 60);
    // les pylônes, éteints : quatre treillis contre l'aube
    [[-44, -62], [44, -62], [-44, 62], [44, 62]].forEach(function (p) {
      var py = P.pylone({ hauteur: 32, cible: [0, 0, 0], cone: false, graine: "py" + p[0] + p[1] }); py.groupe.position.set(p[0], 0, p[1]); s.add(py.groupe); py.viser(0, 0, 0);
    });
    // la bâche : vingt mètres de toile blanche, peinte à la main, nouée à la grille
    var tb = K.tex.texte({ lignes: ["VOLLAIRE, L'ENFANT DU QUAI"], fond: "#ece7dc", encre: "#141414", largeur: 2048, hauteur: 232, graisse: "700", peint: true, graine: "bache-vollaire" });
    var cb = tb.canvas, cbx = cb.getContext("2d");
    // la bande bordeaux, en haut et en bas ; des coulures sous les lettres
    cbx.fillStyle = BORDEAUX; cbx.fillRect(0, 0, cb.width, cb.height * 0.07); cbx.fillRect(0, cb.height * 0.93, cb.width, cb.height * 0.07);
    for (var dr = 0; dr < 46; dr++) {
      var dx = 120 + K.h01(dr, 61) * (cb.width - 240), dy = cb.height * (0.62 + K.h01(dr, 63) * 0.1), dl = cb.height * (0.04 + K.h01(dr, 65) * 0.14);
      cbx.fillStyle = "rgba(20,20,20,0.85)"; cbx.fillRect(dx, dy, 3 + K.h01(dr, 67) * 2, dl);
    }
    tb.map.needsUpdate = true;
    var Bw = 20, Bh = 2.2, gBa = new THREE.PlaneGeometry(Bw, Bh, 48, 6), pBa = gBa.attributes.position;
    for (var i = 0; i < pBa.count; i++) {
      var bx = pBa.getX(i), by = pBa.getY(i), seg = ((bx + Bw / 2) / 2.5) % 1;
      // la toile se creuse entre deux nœuds, et ondule un peu
      pBa.setZ(i, Math.sin(seg * PI) * 0.06 + Math.sin(bx * 1.3 + by * 2) * 0.015);
      pBa.setY(i, by - Math.sin(seg * PI) * 0.04 * (1 - (by + Bh / 2) / Bh));
    }
    gBa.computeVertexNormals(); K.garder(gBa);
    var bache = new THREE.Mesh(gBa, K.garder(new THREE.MeshStandardMaterial({ map: tb.map, roughness: 0.85, side: THREE.DoubleSide })));
    var zG = NORD.z - nord.recul + 0.25, yG = nord.bas + 1.5;
    bache.position.set(-1.5, yG, zG + 0.08); bache.castShadow = true; bache.receiveShadow = true; s.add(bache);
    var mCorde = K.garder(new THREE.MeshStandardMaterial({ color: "#c9c3b2", roughness: 0.9 }));
    for (var nk = 0; nk <= 8; nk++) [1, -1].forEach(function (sy) { P.cylindre(s, 0.012, 0.012, 0.14, mCorde, -1.5 - Bw / 2 + nk * 2.5, yG + sy * (Bh / 2 - 0.05), zG + 0.03, { rx: PI / 2, cotes: 5 }); });
    // le soleil se lève à l'est (+x), bas : il prend la toile de biais
    var soleil = new THREE.DirectionalLight("#ffc29a", 2.1); soleil.position.set(80, 14, -10); soleil.castShadow = true;
    soleil.shadow.mapSize.set(2048, 2048); var sc = soleil.shadow.camera; sc.left = -40; sc.right = 40; sc.top = 20; sc.bottom = -20; sc.near = 1; sc.far = 200; soleil.shadow.bias = -0.0004;
    soleil.target.position.set(0, 0, -50); s.add(soleil); s.add(soleil.target);
    // la brume au ras de la pelouse
    var brume = K.particules.fumee({ n: 40, source: [0, 0.1, -12], vent: [0.25, 0.05], montee: 0.01, etalement: 70, vie: 40, taille: 10, couleur: "#b9b7c4", lueur: "#d8c0b8", opacite: 0.06, graine: "brume-rive" });
    s.add(brume);
    // la fenêtre du bureau (le plan 4) : le cadre, la vitre, et le tableur qui s'y reflète
    var fg = new THREE.Group(); fg.position.set(FENETRE.x, FENETRE.y, FENETRE.z); s.add(fg);
    var dir = new THREE.Vector3(1.5 - FENETRE.x, 3 - FENETRE.y, NORD.z - FENETRE.z).normalize();
    fg.rotation.y = Math.atan2(dir.x, dir.z);
    var mCadre = K.mat.peint({ couleur: "#cfccc2", rugosite: 0.5 });
    P.boite(fg, 2.1, 0.08, 0.1, mCadre, 0, 0.72, 0.6); P.boite(fg, 2.1, 0.08, 0.1, mCadre, 0, -0.72, 0.6); P.boite(fg, 0.08, 1.5, 0.1, mCadre, -1.02, 0, 0.6); P.boite(fg, 0.08, 1.5, 0.1, mCadre, 1.02, 0, 0.6);
    P.boite(fg, 0.05, 1.5, 0.08, mCadre, 0.0, 0, 0.6);
    var mMurI = K.mat.beton({ couleur: "#2b2a27", graine: "mur-bureau", banches: 0 });
    P.boite(fg, 6, 1.2, 0.2, mMurI, 0, -1.4, 0.7); P.boite(fg, 6, 1.6, 0.2, mMurI, 0, 1.6, 0.7); P.boite(fg, 2, 1.6, 0.2, mMurI, -2.05, 0, 0.7); P.boite(fg, 2, 1.6, 0.2, mMurI, 2.05, 0, 0.7);
    var ecR = K.tex.ecran({ largeur: 512, hauteur: 320, type: "lcd", fond: "#000", ips: 6, dessiner: function (x, t, w, h) { dessinerTableur(K, x, t, w, h, true); } });
    // sur une aube claire, un reflet assombrit plus qu'il n'éclaire : l'écran noir et ses chiffres, en fantôme
    var mRef = K.garder(new THREE.MeshBasicMaterial({ map: ecR.texture, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
    var refl = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(1.25, 0.78)), mRef); refl.position.set(0.12, -0.3, 0.62); refl.rotation.y = PI; fg.add(refl);
    return {
      scene: s,
      look: { bloom: 0.55, rayon: 0.5, seuil: 0.9, exposition: 1.0, contraste: 1.1, saturation: 0.92 },
      maj: function (t, c) {
        var plan = c.indice, tout = plan == null;
        brume.maj(t, c.camera);
        fg.visible = tout || plan === 3;
        if (tout || plan === 3) ecR.maj(t);
      }
    };
  }

  FC.film({
    id: "six_heures_dix",
    livre: "le_modele",
    titre: "Six heures dix",
    duree: 37.0,
    musique: "livre_h8",
    secours: "ville_jour",
    couleur: CYAN,
    affiche: 24.5,
    habillage: { vignette: 0.5, grain: 0.06, ratioPaysage: 2.35, ratioPortrait: 0 },
    sortie: { noir: 1.4 },
    textes: [
      { sorte: "replique", de: 0.5, a: 4.2, qui: "Dans ton oreille", texte: "Bonjour. On commence par les ventes\u00a0?" },
      { sorte: "lieu", de: 4.7, a: 8.5, texte: "Aubérive, le club-house", sous: "2024 · six heures dix" },
      { sorte: "replique", de: 10.2, a: 14.9, qui: "Dans ton oreille", texte: "Il lui reste six cent douze jours." },
      { sorte: "titre", de: 30.6, a: 36.4, texte: "Aubérive · 2024", sous: "L'Oreillette", entree: 0.2, sortie: 0.7 }
    ],
    montages: { court: [[0.2, 4.2], [4.5, 8.5], [9.2, 14.6], [16.0, 20.4], [22.4, 27.4], [30.4, 35.8]] },
    preparer: function (K, ctx) {
      return K.etapes(ctx, [
        function () { ctx.decors.bureau = bureau(K, ctx); },
        function () { ctx.decors.stade = stade(K, ctx); }
      ]);
    },
    plans: [
      // 1 · l'étui ouvert, l'oreillette, la diode
      { de: 0, a: 4.364, decor: "bureau", entree: "noir", transition: 0.9, fixe: 2.4,
        camera: { pos: K_cles([[0, [0.4, 0.96, 0.42]], [4.36, [0.35, 0.92, 0.36]]], "douce"), cible: K_cles([[0, [0.16, 0.775, 0.1]], [4.36, [0.17, 0.78, 0.11]]], "douce"),
          fov: K_cles([[0, 34], [4.36, 28]], "douce"), epaule: 0.02, pres: 0.01 } },
      // 2 · l'écran : le club en lignes, le curseur sur VOLLAIRE
      { de: 4.364, a: 8.727, decor: "bureau", entree: "coupe", fixe: 3.0,
        camera: { pos: K_cles([[0, [-0.27, 0.99, 0.42]], [4.36, [-0.3, 0.975, 0.37]]], "douce"), cible: K_cles([[0, [-0.42, 0.935, 0.08]], [4.36, [-0.43, 0.93, 0.08]]], "douce"),
          fov: K_cles([[0, 36], [4.36, 30]], "douce"), epaule: 0.03, pres: 0.01 },
        cadrage: { portrait: { x: K_cles([[0, -0.5], [4.36, -0.7]]) } } },
      // 3 · l'escalier, d'en bas : Vaubourg monte à contre-jour
      { de: 8.727, a: 15.273, decor: "bureau", entree: "coupe", fixe: 3.6,
        camera: { pos: K_cles([[0, [ESC.x + 0.2, 0.8, 2.6]], [2.4, [ESC.x + 0.2, 0.85, 2.5]], [6.55, [ESC.x + 0.15, 0.95, 2.1]]], "douce"),
          cible: K_cles([[0, [ESC.x - ESC.w / 2, 2.6, -2.15]], [2.4, [ESC.x - 0.3, 2.3, -1.7]], [6.55, [ESC.x - 0.05, 2.2, -2.4]]], "douce"),
          fov: K_cles([[0, 18], [2.4, 28], [6.55, 40]], "douce"), epaule: 0.05 } },
      // 4 · par la fenêtre du bureau : le stade à l'aube, ALMADIS, la bâche au loin
      { de: 15.273, a: 21.818, decor: "stade", entree: "coupe", fixe: 4.0,
        camera: { pos: K_cles([[0, [FENETRE.x - 1.2, FENETRE.y + 0.05, FENETRE.z + 2.0]], [6.55, [FENETRE.x - 0.7, FENETRE.y, FENETRE.z + 1.1]]], "douce"), cible: K_cles([[0, [2, 6, NORD.z - 2]], [6.55, [0, 4.2, NORD.z - 3]]], "douce"),
          fov: K_cles([[0, 34], [6.55, 18]], "douce"), epaule: 0.04 } },
      // 5 · la bâche, de près : on la longe
      { de: 21.818, a: 28.364, decor: "stade", entree: "coupe", fixe: 3.2,
        camera: { pos: K_cles([[0, [-12.5, 2.4, NORD.z + 4.2]], [6.55, [8.0, 2.7, NORD.z + 4.6]]], "lin"), cible: K_cles([[0, [-9.5, 3.1, NORD.z - 3.0]], [6.55, [9.5, 3.1, NORD.z - 3.0]]], "lin"),
          fov: K_cles([[0, 42], [6.55, 42]]), epaule: 0.05 },
        cadrage: { portrait: { x: K_cles([[0, -0.2], [6.55, 0.2]]) } } },
      // 6 · la Nord, la bâche, la brume ; le titre
      { de: 28.364, a: 37.0, decor: "stade", entree: "coupe", fixe: 3.4,
        camera: { pos: K_cles([[0, [16, 1.5, -18]], [8.64, [14.5, 1.7, -21]]], "lin"), cible: K_cles([[0, [-2, 5.5, NORD.z]], [8.64, [-2, 5.8, NORD.z]]], "douce"),
          fov: K_cles([[0, 42], [8.64, 38]], "douce"), epaule: 0.04 },
        cadrage: { portrait: { x: K_cles([[0, -0.15], [8.64, -0.2]]) }, paysage: { y: 0.3 } } }
    ]
  });

  function K_() { return FC.kit; }
  function K_cles(p, a) { var f = null; return function (t) { if (!f) f = K_().cles(p, a); return f(t); }; }
})(typeof window !== "undefined" ? window : this);
