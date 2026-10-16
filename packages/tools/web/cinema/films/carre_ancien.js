/* ═══════════════════════════════════════════════════════════════════════════
   « Le carré ancien » — livre 4, « La Route de la Rive » (1990-1993, le joueur en
   fin de contrat). Docs : docs/design/cinematiques.md.

   Le 14 mai 1991, dix-huit heures, le cimetière d'Aubérive. Le film passe APRÈS la
   carte du 14 mai (jp.h4.a4_quatorze_mai et sa variante jp.h4.a4_quatorze_mai_seul,
   la fin de la première saison, 1990-1991 ; content/ville/films_h4.yaml) : la carte a dit les
   chrysanthèmes, la question (« Qui est Jules Bertin ? », ou celle du gardien), et
   la pierre enfin lue — 1902-1983. Le film regarde ce que six ans de visites n'avaient
   pas regardé : la pierre, le médaillon d'un vieil homme, les deux pots (le tien, et
   celui de l'abonnement des Immortelles, monté le matin), les six ronds que les pots
   des années d'avant ont laissés sur la dalle ; puis le gardien ferme la grille. Il
   vaut pour les quatre réponses : on n'y voit ni Camille, ni le héros, ni ce qui a été
   dit ; il ne devance rien (ni le registre, ni l'abonnement de Fardelli, ni la tombe
   vide, ni ce qu'est devenue la fille de 1984).

   LES PLANS (37 s ; la musique : livre_h4, « La Route de la Rive » ; au tournage, la
   section `creux` — « freine » : tout s'arrête, la lumière au bout du pont —, puis la
   mélodie entière de `A2`, qui entre sur le médaillon)
     1   0,0– 6,0  l'allée centrale, à contre-jour : les cyprès, les tombes, le soleil bas
                   de dix-huit heures en mai, les ombres longues. Carton : « Cimetière
                   d'Aubérive, carré ancien / 14 mai 1991 · 18 h ».
     2   6,0–12,0  la tombe, au ras de la dalle : deux pots de chrysanthèmes jaunes, l'un
                   dans le papier kraft des Immortelles, la ficelle nouée, l'étiquette ;
                   l'autre, nu.
     3  12,0–18,4  la pierre, de tout près : JULES BERTIN, les lettres creusées, le lichen ;
                   la caméra glisse jusqu'aux dates, 1902 – 1983.
     4  18,4–24,4  le médaillon de porcelaine : un vieil homme à lunettes et barbe blanche,
                   une photo passée ; un reflet du soleil passe sur l'émail. (La mélodie
                   entre.)
     5  24,4–30,2  la dalle, d'en haut : à côté des deux pots, six ronds pâles, les traces
                   des pots des années d'avant.
     6  30,2–37,0  la grille, de la rue, à contre-jour : le gardien la referme ; le
                   gardien : « Deux pots pour Monsieur Bertin. Je l'écris. » ; le fer qui
                   claque ; il repart vers sa loge, dans l'allée. Titre : « Le carré
                   ancien / La Route de la Rive ».
   La coupe de 30 s (l'aperçu de l'App Store) : les six plans, resserrés.
   La lumière : le soleil bas et chaud d'un soir de mai, de face dans l'allée (les cyprès
   et la grille à contre-jour), de face sur la pierre (les lettres creusées dessinées
   par leur ombre) ; l'accent : le jaune des chrysanthèmes. Les visages : jamais (un
   médaillon imprimé, art.js ; le gardien en silhouette contre le soleil, puis de dos).
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var FC = global.FusibleCinema;
  var PI = Math.PI;
  var JAUNE = "#F2C230";

  // ─── LE MÉDAILLON : un portrait d'art.js (un visage tiré d'un nom inventé, vieilli), sans
  // son décor, tiré en sépia sur la porcelaine, l'ovale, le filet, les craquelures
  function portrait(K) {
    var A = global.FusibleArt;
    if (!A || !A.scene) return Promise.resolve(null);
    var svg;
    try {
      svg = A.scene({ speaker: "bertin_2", genre: "m", expression: "neutre", camp: "direction", lieu: "bureau", kind: "scene", cadrage: "buste", annee: 2028, seed: "medaillon" });
      var doc = new global.DOMParser().parseFromString(svg, "image/svg+xml"), g = doc.querySelector("g[clip-path]");
      var kids = g ? Array.prototype.filter.call(g.childNodes, function (n) { return n.nodeType === 1; }) : [];
      if (kids.length > 1 && kids[kids.length - 1].nodeName.toLowerCase() === "g") {
        for (var i = 0; i < kids.length - 1; i++) g.removeChild(kids[i]);
        g.removeAttribute("clip-path");
        svg = new global.XMLSerializer().serializeToString(doc);
      }
    } catch (e) { if (!svg) return Promise.resolve(null); }
    return new Promise(function (ok) {
      var img = new global.Image();
      img.onload = function () { var c = K.tex.canvas(400, 480); c.getContext("2d").drawImage(img, 0, 0, 400, 480); ok(c); };
      img.onerror = function () { ok(null); };
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    });
  }
  function medaillon(K, src) {
    var W = 320, H = 400, c = K.tex.canvas(W, H), x = c.getContext("2d"), r = K.alea("medaillon");
    // la porcelaine
    x.fillStyle = "#e8e0cc"; x.fillRect(0, 0, W, H);
    if (src) {
      // le tirage : lissé, en sépia, peu contrasté, passé au soleil
      var t = K.tex.canvas(W, H), tx = t.getContext("2d");
      if ("filter" in tx) tx.filter = "blur(1.2px) grayscale(1) contrast(1.3) brightness(0.98)";
      tx.drawImage(src, -40, -8, W + 80, H + 96);
      if ("filter" in tx) tx.filter = "none";
      var d = tx.getImageData(0, 0, W, H), p = d.data;
      for (var i = 0; i < p.length; i += 4) {
        var l = (p[i] + p[i + 1] + p[i + 2]) / 765, a = p[i + 3] / 255;
        var fond = 0.82;                                          // le fond du studio, clair
        var v = a * l + (1 - a) * fond;
        v = 0.05 + v * 0.6;                                       // un tirage sombre : au soleil, il remonte
        p[i] = 255 * Math.min(1, v * 1.06 + 0.02); p[i + 1] = 255 * Math.min(1, v * 0.94 + 0.01); p[i + 2] = 255 * Math.min(1, v * 0.74); p[i + 3] = 255;
      }
      tx.putImageData(d, 0, 0);
      x.drawImage(t, 0, 0);
    }
    // le vignettage du tirage, l'ovale, le filet d'or terni
    var g = x.createRadialGradient(W / 2, H / 2, W * 0.34, W / 2, H / 2, W * 0.64);
    g.addColorStop(0, "rgba(150,138,112,0)"); g.addColorStop(1, "rgba(150,138,112,0.55)");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = "destination-in"; x.fillStyle = "#000"; x.beginPath(); x.ellipse(W / 2, H / 2, W / 2 - 4, H / 2 - 4, 0, 0, 7); x.fill();
    x.globalCompositeOperation = "source-over";
    x.strokeStyle = "rgba(140,108,52,0.9)"; x.lineWidth = 7; x.beginPath(); x.ellipse(W / 2, H / 2, W / 2 - 8, H / 2 - 8, 0, 0, 7); x.stroke();
    // les craquelures de l'émail, une écaille, la pluie séchée
    x.strokeStyle = "rgba(60,48,30,0.28)"; x.lineWidth = 1;
    for (var k = 0; k < 14; k++) {
      var cx = r() * W, cy = r() * H, ang = r() * 6.28; x.beginPath(); x.moveTo(cx, cy);
      for (var s = 0; s < 8; s++) { ang += (r() - 0.5) * 1.4; cx += Math.cos(ang) * 9; cy += Math.sin(ang) * 9; x.lineTo(cx, cy); }
      x.stroke();
    }
    x.fillStyle = "rgba(90,80,62,0.5)"; x.beginPath(); x.ellipse(W * 0.82, H * 0.86, 10, 7, 0.4, 0, 7); x.fill();
    for (var q = 0; q < 40; q++) { x.fillStyle = "rgba(120,110,90," + (0.05 + r() * 0.1).toFixed(2) + ")"; x.beginPath(); x.arc(r() * W, H * 0.55 + r() * H * 0.45, 1 + r() * 4, 0, 7); x.fill(); }
    return K.tex.texture(c, { clamp: true });
  }
  // la gravure de la pierre : des lettres creusées (le fond sombre, l'arête éclairée en
  // bas à droite), une croix ; transparente autour → { map }
  function gravure(K) {
    var W = 512, H = 840, c = K.tex.canvas(W, H), x = c.getContext("2d");
    function creuse(txt, y, taille, esp) {
      x.font = "700 " + taille + "px Georgia, 'Times New Roman', serif"; x.textAlign = "center"; x.textBaseline = "middle";
      if ("letterSpacing" in x) x.letterSpacing = (esp || 0) + "px";
      x.fillStyle = "rgba(255,248,230,0.55)"; x.fillText(txt, W / 2 + 2, y + 2);          // l'arête qui prend le jour
      x.fillStyle = "rgba(28,24,20,0.9)"; x.fillText(txt, W / 2, y);                      // le creux
      x.fillStyle = "rgba(10,8,6,0.5)"; x.fillText(txt, W / 2 - 1, y - 1);
    }
    // la croix gravée
    x.fillStyle = "rgba(28,24,20,0.85)"; x.fillRect(W / 2 - 6, 26, 12, 70); x.fillRect(W / 2 - 26, 44, 52, 11);
    x.fillStyle = "rgba(255,248,230,0.4)"; x.fillRect(W / 2 + 6, 28, 2, 70); x.fillRect(W / 2 - 26, 55, 52, 2);
    creuse("JULES BERTIN", 474, 58, 4);
    creuse("1902 – 1983", 562, 44, 6);
    // un filet gravé autour
    x.strokeStyle = "rgba(28,24,20,0.6)"; x.lineWidth = 4; x.strokeRect(22, 14, W - 44, H - 28);
    x.strokeStyle = "rgba(255,248,230,0.3)"; x.lineWidth = 2; x.strokeRect(25, 17, W - 44, H - 28);
    // le lichen, la pluie, l'usure : des croûtes (des grappes de points serrés), surtout sur
    // les bords ; des coulures qui descendent du haut de la pierre
    var r = K.alea("lichen-bertin");
    for (var i = 0; i < 26; i++) {
      var px = r() < 0.7 ? (r() < 0.5 ? 34 + r() * 70 : W - 34 - r() * 70) : 40 + r() * (W - 80), py = 24 + r() * (H - 48), rr = 8 + r() * 24;
      var jaune = r() < 0.6, nb = 18 + Math.floor(r() * 30);
      for (var k = 0; k < nb; k++) {
        var a = r() * 6.283, dd = Math.sqrt(r()) * rr;
        x.fillStyle = jaune ? "rgba(168,158,90," + (0.1 + r() * 0.22).toFixed(2) + ")" : "rgba(70,74,52," + (0.08 + r() * 0.18).toFixed(2) + ")";
        x.beginPath(); x.arc(px + Math.cos(a) * dd, py + Math.sin(a) * dd * 0.8, 1 + r() * 3.2, 0, 7); x.fill();
      }
    }
    for (var j = 0; j < 14; j++) {
      var sx = 30 + r() * (W - 60), sl = 60 + r() * 260, gr = x.createLinearGradient(0, 14, 0, 14 + sl);
      gr.addColorStop(0, "rgba(40,36,30,0.16)"); gr.addColorStop(1, "rgba(40,36,30,0)");
      x.fillStyle = gr; x.fillRect(sx, 14, 3 + r() * 6, sl);
    }
    return K.tex.texture(c, { clamp: true });
  }
  // les six ronds sur la dalle (le calcaire et la rouille laissés par les pots d'avant)
  function ronds(K) {
    var W = 512, c = K.tex.canvas(W, W), x = c.getContext("2d"), r = K.alea("ronds-pots");
    var places = [[0.3, 0.3], [0.62, 0.26], [0.44, 0.52], [0.24, 0.66], [0.68, 0.6], [0.5, 0.8]];
    places.forEach(function (p) {
      var cx = p[0] * W + (r() - 0.5) * 20, cy = p[1] * W + (r() - 0.5) * 20, R = W * 0.11 * (0.92 + r() * 0.16);
      // le dedans : l'eau qui a stagné sous le pot, un voile
      var g = x.createRadialGradient(cx, cy, R * 0.2, cx, cy, R);
      g.addColorStop(0, "rgba(60,58,52,0)"); g.addColorStop(1, "rgba(60,58,52," + (0.06 + r() * 0.06).toFixed(2) + ")");
      x.fillStyle = g; x.beginPath(); x.arc(cx, cy, R, 0, 7); x.fill();
      // le bord : le calcaire, un anneau doux…
      var al = 0.16 + r() * 0.12, an = x.createRadialGradient(cx, cy, R - 9, cx, cy, R + 5);
      an.addColorStop(0, "rgba(214,208,190,0)"); an.addColorStop(0.55, "rgba(214,208,190," + al.toFixed(2) + ")");
      an.addColorStop(0.75, "rgba(220,214,196," + (al * 0.8).toFixed(2) + ")"); an.addColorStop(1, "rgba(214,208,190,0)");
      x.fillStyle = an; x.beginPath(); x.arc(cx, cy, R + 5, 0, 7); x.fill();
      // … que la pluie a mangé par endroits
      x.globalCompositeOperation = "destination-out";
      for (var k = 0; k < 3; k++) {
        var a = r() * 6.283, bx = cx + Math.cos(a) * R, by = cy + Math.sin(a) * R, br = 10 + r() * 22;
        var gb = x.createRadialGradient(bx, by, 0, bx, by, br);
        gb.addColorStop(0, "rgba(0,0,0," + (0.5 + r() * 0.5).toFixed(2) + ")"); gb.addColorStop(1, "rgba(0,0,0,0)");
        x.fillStyle = gb; x.beginPath(); x.arc(bx, by, br, 0, 7); x.fill();
      }
      x.globalCompositeOperation = "source-over";
      // la terre du pot, d'un côté
      var ar = r() * 6.283;
      x.lineWidth = 2 + r() * 2; x.strokeStyle = "rgba(118,76,38," + (0.1 + r() * 0.1).toFixed(2) + ")";
      x.beginPath(); x.arc(cx + 1.5, cy + 1.5, R - 4, ar, ar + 1.6 + r() * 1.8); x.stroke();
    });
    return K.tex.texture(c, { clamp: true });
  }
  // un pot de chrysanthèmes : le pot de terre (emballé ou non), la boule de fleurs jaunes
  function potChrysantheme(K, THREE, P, o) {
    var g = new THREE.Group(), r = K.alea(o.graine);
    var mTerre = K.garder(new THREE.MeshStandardMaterial({ color: "#9a4f2e", roughness: 0.85 }));
    P.cylindre(g, 0.12, 0.09, 0.18, mTerre, 0, 0.09, 0, { cotes: 20 });
    if (o.emballe) {
      // le papier kraft de Madame Huguette : un cône froissé (des plis qui ne dépendent que de
      // l'angle et de la hauteur : pas de fente à la couture), serré par la ficelle, le bord
      // haut déchiré ; l'étiquette du fleuriste pendue à la ficelle
      var gP = new THREE.CylinderGeometry(0.19, 0.11, 0.21, 20, 3, true), pos = gP.attributes.position;
      for (var i = 0; i < pos.count; i++) {
        var ang = Math.atan2(pos.getZ(i), pos.getX(i)), yy = pos.getY(i), serre = Math.abs(yy - 0.035) < 0.01, col = yy > 0.1;
        var k = serre ? 0.8 : 1 + Math.sin(ang * 7 + yy * 9) * 0.035 + Math.sin(ang * 13 + 1.7) * 0.03 + (col ? 0.05 : 0);
        pos.setX(i, pos.getX(i) * k); pos.setZ(i, pos.getZ(i) * k);
        if (col) pos.setY(i, yy + Math.sin(ang * 11) * 0.012 + Math.sin(ang * 5 + 1) * 0.008);
      }
      gP.computeVertexNormals(); K.garder(gP);
      var mPap = K.garder(new THREE.MeshStandardMaterial({ color: "#a98557", roughness: 0.95, metalness: 0, side: THREE.DoubleSide }));
      var pap = new THREE.Mesh(gP, mPap); pap.position.y = 0.105; pap.castShadow = true; g.add(pap);
      var mFic = K.garder(new THREE.MeshStandardMaterial({ color: "#e2d6b8", roughness: 0.9 }));
      var fic = new THREE.Mesh(K.garder(new THREE.TorusGeometry(0.132, 0.0035, 4, 28)), mFic); fic.rotation.x = PI / 2; fic.position.y = 0.14; g.add(fic);
      var et = K.tex.texte({ lignes: ["AUX IMMORTELLES"], fond: "#efe9da", encre: "#3a2a1a", largeur: 512, hauteur: 128, graine: "etiquette" });
      var mEt = K.garder(new THREE.MeshStandardMaterial({ map: et.map, roughness: 0.8, side: THREE.DoubleSide }));
      var tag = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.11, 0.028)), mEt); tag.position.set(0.0, 0.106, 0.146); tag.rotation.set(-0.1, 0, 0.07); g.add(tag);
    }
    // la boule : des fleurs (des pompons jaunes), instanciées sur une demi-sphère
    var n = 70, gF = new THREE.IcosahedronGeometry(0.03, 1), pf = gF.attributes.position;
    for (var j = 0; j < pf.count; j++) { var kk = 1 + (K.h01(j, 5) - 0.5) * 0.5; pf.setXYZ(j, pf.getX(j) * kk, pf.getY(j) * kk * 0.8, pf.getZ(j) * kk); }
    gF.computeVertexNormals(); K.garder(gF);
    var mF = K.garder(new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.75 }));
    var fl = new THREE.InstancedMesh(gF, mF, n), d = new THREE.Object3D(), cc = new THREE.Color();
    for (var f = 0; f < n; f++) {
      var u = r(), v = r(), th = u * PI * 2, ph = Math.acos(1 - v * 1.05), R = 0.14 + r() * 0.015;
      d.position.set(Math.sin(ph) * Math.cos(th) * R, 0.19 + Math.cos(ph) * R * 0.72, Math.sin(ph) * Math.sin(th) * R);
      d.rotation.set(r() * 3, r() * 3, r() * 3); d.scale.setScalar(0.8 + r() * 0.5); d.updateMatrix(); fl.setMatrixAt(f, d.matrix);
      fl.setColorAt(f, cc.set(JAUNE).offsetHSL((r() - 0.5) * 0.03, 0, (r() - 0.5) * 0.12));
    }
    fl.instanceMatrix.needsUpdate = true; fl.instanceColor.needsUpdate = true; fl.castShadow = true; g.add(fl);
    var mFeu = K.garder(new THREE.MeshStandardMaterial({ color: "#2e4a26", roughness: 0.9 }));
    var feuil = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.14, 12, 8, 0, PI * 2, PI * 0.35, PI * 0.4)), mFeu); feuil.position.y = 0.2; g.add(feuil);
    return g;
  }
  // un cyprès : un fuseau (un profil tourné)
  function geoCypres(THREE) {
    var pts = [];
    for (var i = 0; i <= 12; i++) { var u = i / 12, rr = Math.sin(Math.pow(u, 0.75) * PI) * (1 - u * 0.35) * 0.9 + 0.02; pts.push(new THREE.Vector2(rr, u * 8)); }
    var g = new THREE.LatheGeometry(pts, 9);
    var p = g.attributes.position;
    for (var j = 0; j < p.count; j++) { var k = 1 + Math.sin(p.getY(j) * 3.1 + Math.atan2(p.getZ(j), p.getX(j)) * 3) * 0.06; p.setX(j, p.getX(j) * k); p.setZ(j, p.getZ(j) * k); }
    g.computeVertexNormals();
    return g;
  }

  // ─── LE CIMETIÈRE D'AUBÉRIVE, LE SOIR DU 14 MAI ───────────────────────────
  function cimetiere(K, ctx, tex) {
    var THREE = ctx.THREE, P = K.props, q = ctx.qualite;
    var s = K.decor(ctx, { ciel: { zenith: "#5b78a2", horizon: "#e9c497", lueur: "#ffb46a", lueurDir: [-0.6, -0.8], force: 1.25 },
      brouillard: ["#cfae86", 0.0062], environnement: { fenetres: 0, lampes: [{ pos: [-120, 40, -160], couleur: "#ffd7a8", intensite: 6, taille: 22 }] },
      reflets: 0.6, ambiance: ["#a9bcd8", "#5a4632", 2.3] });
    var SOL = new THREE.Vector3(-60, 22, -80);
    var soleil = new THREE.DirectionalLight("#ffd3a0", 3.6);
    soleil.position.copy(SOL); soleil.target.position.set(-8, 0, -6); s.add(soleil); s.add(soleil.target);
    if (q.ombres) {
      soleil.castShadow = true; soleil.shadow.mapSize.set(q.ombreTaille, q.ombreTaille);
      var sc = soleil.shadow.camera; sc.left = -45; sc.right = 45; sc.top = 40; sc.bottom = -40; sc.near = 10; sc.far = 220;
      soleil.shadow.bias = -0.0006; soleil.shadow.normalBias = 0.03; soleil.shadow.radius = 4;
    }
    var disque = K.look.halo({ couleur: "#fff0d8", taille: 26, intensite: 0.9 }); s.add(disque);
    var auree = K.look.halo({ couleur: "#ffc890", taille: 110, intensite: 0.45 }); s.add(auree);
    // ── le sol : l'herbe rase, les allées de gravier
    var mHerbe = K.garder(new THREE.MeshStandardMaterial({ color: "#4a5434", roughness: 0.95 }));
    var herbe = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(400, 400)), mHerbe); herbe.rotation.x = -PI / 2; herbe.receiveShadow = true; s.add(herbe);
    var mGravier = K.mat.beton({ couleur: "#b3a890", graine: "gravier-cimetiere", banches: 0, taches: 1.6, repete: [3, 30] });
    var allee = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(3.2, 100)), mGravier); allee.rotation.x = -PI / 2; allee.position.set(0, 0.004, -12); allee.receiveShadow = true; s.add(allee);
    var mGravier2 = K.mat.beton({ couleur: "#ada28a", graine: "gravier-allee2", banches: 0, taches: 1.6, repete: [10, 1] });
    var allee2 = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(30, 2.2)), mGravier2); allee2.rotation.x = -PI / 2; allee2.position.set(-15.6, 0.005, -9.2); allee2.receiveShadow = true; s.add(allee2);
    // la rue, dehors, devant la grille
    var mRue = K.mat.asphalte({ flaques: 0.0, ligne: false, graine: "rue-cimetiere", repete: [10, 2] });
    var rue = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(80, 10)), mRue); rue.rotation.x = -PI / 2; rue.position.set(0, 0.006, 39); s.add(rue);
    // ── le mur d'enceinte, la grille (deux battants de barreaux)
    var mMur = K.mat.beton({ couleur: "#a89a84", graine: "mur-cimetiere", banches: 0, taches: 1.2, repete: [12, 1] });
    function mur(w, d, x, z) { var m = new THREE.Mesh(P.boiteUV(w, 2.4, d, 2), mMur); m.position.set(x, 1.2, z); m.castShadow = true; m.receiveShadow = true; s.add(m); }
    mur(28.4, 0.45, -16.4, 32); mur(28.4, 0.45, 16.4, 32); mur(0.45, 96, -30.4, -16); mur(0.45, 96, 30.4, -16); mur(61, 0.45, 0, -64);
    var mPilier = K.mat.beton({ couleur: "#b8ab92", graine: "piliers", banches: 0, taches: 0.6 });
    [-1, 1].forEach(function (sg) { P.boite(s, 0.7, 3.0, 0.7, mPilier, sg * 2.15, 1.5, 32); P.boite(s, 0.9, 0.25, 0.9, mPilier, sg * 2.15, 3.1, 32); });
    var mFer = K.mat.metal({ couleur: "#1c1d1e", rugosite: 0.6 });
    var battants = [-1, 1].map(function (sg) {
      var b = new THREE.Group(); b.position.set(sg * 1.78, 0, 32); s.add(b);
      var w = 1.76, gB = K.garder(new THREE.CylinderGeometry(0.014, 0.014, 2.3, 6)), nb = 12;
      var bar = new THREE.InstancedMesh(gB, mFer, nb), d = new THREE.Object3D();
      for (var i = 0; i < nb; i++) { d.position.set(-sg * (0.07 + i * (w - 0.1) / (nb - 1)), 1.2 + (i % 2) * 0.05, 0); d.updateMatrix(); bar.setMatrixAt(i, d.matrix); }
      bar.instanceMatrix.needsUpdate = true; bar.castShadow = true; b.add(bar);
      P.boite(b, w, 0.05, 0.04, mFer, -sg * w / 2, 0.25, 0); P.boite(b, w, 0.05, 0.04, mFer, -sg * w / 2, 2.05, 0);
      P.boite(b, 0.05, 2.3, 0.05, mFer, 0, 1.15, 0); P.boite(b, 0.05, 2.3, 0.05, mFer, -sg * w, 1.15, 0);
      b.sg = sg; b.rotation.y = -sg * 1.35;
      return b;
    });
    // ── les cyprès, le long de l'allée et dans le carré
    var gC = K.garder(geoCypres(THREE)), mCyp = K.garder(new THREE.MeshStandardMaterial({ color: "#26361f", roughness: 1 }));
    var cyp = [], rc = K.alea("cypres");
    for (var zc = 28; zc > -60; zc -= 7.5 + rc() * 2) { cyp.push([-2.6 - rc() * 0.4, zc, 0.9 + rc() * 0.35]); cyp.push([2.6 + rc() * 0.4, zc - 3, 0.9 + rc() * 0.35]); }
    [[-11.5, -11.6, 1.15], [-20, -3, 1.0], [-24, -18, 1.2], [-6.5, -16, 0.95]].forEach(function (c) { cyp.push(c); });
    var imC = new THREE.InstancedMesh(gC, mCyp, cyp.length), dC = new THREE.Object3D();
    cyp.forEach(function (c, i) { dC.position.set(c[0], 0, c[1]); dC.rotation.set(0, rc() * 6, 0); dC.scale.set(c[2], c[2] * (0.9 + rc() * 0.3), c[2]); dC.updateMatrix(); imC.setMatrixAt(i, dC.matrix); });
    imC.instanceMatrix.needsUpdate = true; imC.castShadow = true; imC.receiveShadow = true; s.add(imC);
    // ── les tombes : des dalles, des stèles, des croix (un appel chacune, une teinte chacune)
    var mPierre = K.mat.beton({ couleur: "#a29a8a", graine: "pierres-tombales", banches: 0, taches: 1.4 });
    var dalles = [], steles = [], croix = [], rt = K.alea("tombes");
    function rangee(x0, x1, zSt, face) {                   // face : +1 la stèle regarde +z, -1 regarde -z
      for (var x = x0; x < x1; x += 1.55 + rt() * 0.5) {
        if (Math.abs(x + 9) < 0.9 && face < 0 && Math.abs(zSt + 5.95) < 0.2) continue;   // la place de Monsieur Bertin
        var L = 1.9 + rt() * 0.3, w = 0.85 + rt() * 0.2, h = 0.12 + rt() * 0.12;
        dalles.push([x, h / 2, zSt + face * (L / 2 + 0.08), w, h, L, rt()]);
        var t = rt();
        if (t < 0.55) { var hs = 0.7 + rt() * 0.7; steles.push([x, h + hs / 2, zSt, w * (0.7 + rt() * 0.25), hs, 0.14, rt()]); }
        else if (t < 0.85) { var hc = 0.9 + rt() * 0.5; croix.push([x, h + hc / 2, zSt, 0.1, hc, 0.1, rt()]); croix.push([x, h + hc * 0.72, zSt, 0.5, 0.1, 0.1, rt()]); }
      }
    }
    rangee(-27.5, -1.8, -5.95, -1); rangee(-27.5, -1.8, -12.4, 1);
    rangee(-27.5, -1.8, -15.6, -1); rangee(-27.5, -1.8, -22.0, 1); rangee(-27.5, -1.8, -25.4, -1);
    rangee(-27.5, -1.8, 3.4, -1); rangee(-27.5, -1.8, 10.0, -1); rangee(-27.5, -1.8, 17.0, -1);
    rangee(1.8, 28, -4.0, -1); rangee(1.8, 28, 4.0, -1); rangee(1.8, 28, 12.0, -1); rangee(1.8, 28, -14, -1); rangee(1.8, 28, 20, -1);
    function instances(liste, geo) {
      var im = new THREE.InstancedMesh(geo, mPierre, liste.length), d = new THREE.Object3D(), cc = new THREE.Color();
      liste.forEach(function (b, i) { d.position.set(b[0], b[1], b[2]); d.rotation.set(0, (b[6] - 0.5) * 0.06, (b[6] - 0.5) * 0.04); d.scale.set(b[3], b[4], b[5]); d.updateMatrix(); im.setMatrixAt(i, d.matrix);
        im.setColorAt(i, cc.setHSL(0.09 + b[6] * 0.04, 0.06 + b[6] * 0.08, 0.38 + b[6] * 0.32)); });
      im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; im.castShadow = true; im.receiveShadow = true; s.add(im);
      return im;
    }
    var gB1 = K.garder(new THREE.BoxGeometry(1, 1, 1));
    instances(dalles, gB1); instances(steles, gB1); instances(croix, gB1);
    // deux chapelles de famille, au fond
    [[-18, -30], [-8, -31]].forEach(function (c, i) {
      P.boite(s, 2.4, 3.0, 2.6, mPierre, c[0], 1.5, c[1]);
      var pr = new THREE.Shape(); pr.moveTo(-1.4, 0); pr.lineTo(1.4, 0); pr.lineTo(0, 1.1); pr.lineTo(-1.4, 0);
      var to = new THREE.Mesh(K.garder(new THREE.ExtrudeGeometry(pr, { depth: 2.8, bevelEnabled: false })), mPierre); to.position.set(c[0], 3.0, c[1] - 1.4); to.castShadow = true; s.add(to);
    });
    // ── la tombe de Monsieur Bertin : la dalle, la stèle, la gravure, le médaillon, les pots
    var B = { x: -9, zSt: -5.95 };
    var mGranit = K.mat.beton({ couleur: "#8f897d", graine: "granit-bertin", banches: 0, taches: 1.8 });
    var dalle = P.boite(s, 0.95, 0.18, 2.0, mGranit, B.x, 0.09, B.zSt - 1.08);
    var stele = P.boite(s, 0.8, 1.25, 0.15, mGranit, B.x, 0.18 + 0.625, B.zSt);
    var mGrav = K.garder(new THREE.MeshStandardMaterial({ map: tex.gravure, transparent: true, roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -2 }));
    var grav = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.76, 1.25)), mGrav); grav.position.set(B.x, 0.18 + 0.625, B.zSt - 0.082); grav.rotation.y = PI; s.add(grav);
    var mMed = K.garder(new THREE.MeshStandardMaterial({ map: tex.medaillon, roughness: 0.18, metalness: 0.0, envMapIntensity: 1.2, transparent: true }));
    var med = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.16, 0.2)), mMed); med.position.set(B.x, 1.0, B.zSt - 0.088); med.rotation.y = PI; s.add(med);
    var cadreMed = new THREE.Mesh(K.garder(new THREE.TorusGeometry(0.09, 0.006, 6, 40)), K.mat.metal({ couleur: "#6b5530", rugosite: 0.45 }));
    cadreMed.scale.set(0.9, 1.12, 1); cadreMed.position.set(B.x, 1.0, B.zSt - 0.085); s.add(cadreMed);
    var mReflet = K.garder(new THREE.ShaderMaterial({
      uniforms: { uPos: { value: -2 }, uForce: { value: 0 }, uCouleur: { value: new THREE.Color("#fff2d8") } },
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: "uniform float uPos, uForce; uniform vec3 uCouleur; varying vec2 vUv; void main(){ vec2 q = (vUv - 0.5) * 2.0; float ov = 1.0 - smoothstep(0.84, 0.95, length(q)); float b = q.x * 0.8 + q.y * 0.6 - uPos; float band = exp(-b * b * 14.0) + 0.4 * exp(-(b + 0.3) * (b + 0.3) * 70.0); gl_FragColor = vec4(uCouleur * band * ov * uForce, 1.0); }",
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    var refletMed = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.16, 0.2)), mReflet); refletMed.position.set(B.x, 1.0, B.zSt - 0.0895); refletMed.rotation.y = PI; refletMed.renderOrder = 4; refletMed.visible = false; s.add(refletMed);
    var mRonds = K.garder(new THREE.MeshStandardMaterial({ map: tex.ronds, transparent: true, roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -2, depthWrite: false }));
    var rds = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.9, 0.9)), mRonds); rds.rotation.x = -PI / 2; rds.position.set(B.x, 0.182, B.zSt - 0.62); s.add(rds);
    var pot1 = potChrysantheme(K, THREE, P, { emballe: true, graine: "pot-abonnement" }); pot1.position.set(B.x - 0.22, 0.18, B.zSt - 0.33); pot1.rotation.y = 2.8; s.add(pot1);
    var pot2 = potChrysantheme(K, THREE, P, { emballe: false, graine: "pot-du-jour" }); pot2.position.set(B.x + 0.21, 0.18, B.zSt - 0.4); s.add(pot2);
    // ── le gardien (le plan 6) : il ferme la grille ; en silhouette contre le soleil
    var gardien = K.gens.mannequin({ silhouette: true, tenue: "manteau", casquette: true, graine: "abel", taille: 1.7 });
    s.add(gardien.groupe);
    // la poussière d'or dans le soleil, entre les cyprès
    var poussiere = K.particules.poussiere({ n: 900, zone: { min: [-7.6, 0.3, -12], max: [3, 4, 30] }, couleur: "#ffe2b0", opacite: 0.55, taille: 0.012,
      lumieres: [{ pos: [-6, 2, -8], couleur: "#ffd7a0", intensite: 0.9, rayon: 30 }] });
    s.add(poussiere);
    var vSol = new THREE.Vector3();
    return {
      scene: s,
      look: { bloom: 0.45, rayon: 0.6, seuil: 0.9, exposition: 1.0, contraste: 1.06, saturation: 0.95 },
      maj: function (t, c) {
        // le soleil descend un peu (de dix-huit heures à la fermeture)
        var k = K.lisse(4, 36, t);
        vSol.set(-60, 22 - 12 * k, -80);
        soleil.position.copy(vSol); soleil.intensity = 3.6 - 1.2 * k;
        var dir = vSol.clone().normalize();
        disque.position.copy(dir).multiplyScalar(300); auree.position.copy(dir).multiplyScalar(302);
        // la grille se ferme (31,0-32,6) ; le gardien la pousse, puis tourne la clé
        var f = K.lisse(31.0, 32.6, t);
        battants.forEach(function (b) { b.rotation.y = -b.sg * 1.35 * (1 - f); });
        var tg = t - 30.2;
        // (au milieu, un mètre en retrait : les battants se referment devant lui, pas à travers lui)
        if (tg < 0.8) { gardien.marche(t, 0.9); gardien.groupe.position.set(-0.25 + tg * 0.3, 0, 30.2 + tg * 1.0); gardien.groupe.rotation.y = 0.15; }
        else if (tg < 3.2) { gardien.repos(t); gardien.groupe.position.set(0, 0, 31.0); gardien.groupe.rotation.y = PI * K.lisse(2.8, 3.4, tg); var kb = K.cloche(0.8, 1.2, 2.2, 2.8, tg); gardien.bras(1.2 * kb + 0.1, 0.35 * kb, 1.2 * kb + 0.1, 0.35 * kb, 0.3); }
        else {
          // puis il repart vers sa loge, dans l'allée, à contre-jour (sous le titre)
          var tw = tg - 3.2; gardien.marche(t, 0.85);
          gardien.groupe.position.set(-0.12 * K.lisse(0, 2.5, tw), 0, 31.0 - 0.85 * tw); gardien.groupe.rotation.y = PI * K.lisse(2.8, 3.4, tg);
        }
        gardien.groupe.visible = t > 29.8;
        // le reflet sur l'émail : il traverse le portrait en biais, de bas en haut
        var kr = K.cloche(19.2, 20.4, 22.6, 23.8, t);
        refletMed.visible = kr > 0.001;
        mReflet.uniforms.uPos.value = -1.7 + 3.4 * K.lisse(19.2, 23.8, t); mReflet.uniforms.uForce.value = 0.18 * kr;
        poussiere.maj(t, c.camera);
      }
    };
  }

  FC.film({
    id: "carre_ancien",
    livre: "fin_de_contrat",
    titre: "Le carré ancien",
    duree: 37.0,
    musique: "livre_h4",
    musiqueDepuis: "creux",
    secours: "sombre",
    affiche: 21.6,
    habillage: { vignette: 0.5, grain: 0.07, ratioPaysage: 2.35, ratioPortrait: 0 },
    sortie: { noir: 1.4 },
    sons: [[32.6, "porte"]],
    textes: [
      { sorte: "lieu", de: 0.9, a: 5.4, texte: "Cimetière d'Aubérive, carré ancien", sous: "14 mai 1991 · 18 h" },
      { sorte: "replique", de: 30.4, a: 32.9, qui: "Le gardien", texte: "Deux pots pour Monsieur Bertin. Je l'écris." },
      { sorte: "titre", de: 33.2, a: 36.6, texte: "Le carré ancien", sous: "La Route de la Rive", entree: 0.2, sortie: 0.7 }
    ],
    montages: { court: [[0.5, 5.6], [6.5, 11.2], [12.6, 17.6], [18.8, 23.6], [25.0, 29.2], [30.6, 36.9]] },
    preparer: function (K, ctx) {
      return portrait(K).then(function (src) {
        var tex = { medaillon: medaillon(K, src), gravure: gravure(K), ronds: ronds(K) };
        return K.etapes(ctx, [function () { ctx.decors.cimetiere = cimetiere(K, ctx, tex); }]);
      });
    },
    plans: [
      // 1 · l'allée centrale, à contre-jour
      { de: 0, a: 6.0, decor: "cimetiere", entree: "noir", transition: 1.4, fixe: 3.4,
        camera: { pos: K_cles([[0, [0.35, 1.7, 22]], [6, [0.2, 1.62, 15.5]]], "douce"), cible: K_cles([[0, [-1.6, 2.4, -30]], [6, [-2.4, 2.2, -30]]], "douce"), fov: 46, epaule: 0.06 } },
      // 2 · la tombe, au ras de la dalle : les deux pots
      { de: 6.0, a: 12.0, decor: "cimetiere", entree: "coupe", fixe: 3.4, cadrage: { paysage: { x: 0, y: -0.25 } },
        camera: { pos: K_cles([[0, [-8.45, 0.5, -8.7]], [6, [-8.6, 0.48, -8.0]]], "douce"), cible: K_cles([[0, [-9.0, 0.55, -6.2]], [6, [-9.0, 0.58, -6.2]]], "douce"), fov: 44, epaule: 0.05 } },
      // 3 · la pierre, de tout près : le nom, puis les dates
      { de: 12.0, a: 18.4, decor: "cimetiere", entree: "coupe", fixe: 2.6,
        camera: { pos: K_cles([[0, [-9.16, 0.76, -6.98]], [3.6, [-8.86, 0.75, -6.96]], [6.4, [-8.99, 0.64, -7.0]]], "douce"), cible: K_cles([[0, [-9.12, 0.73, -6.03]], [3.6, [-8.88, 0.73, -6.03]], [6.4, [-9.0, 0.61, -6.03]]], "douce"), fov: 30, epaule: 0.03 } },
      // 4 · le médaillon
      { de: 18.4, a: 24.4, decor: "cimetiere", entree: "coupe", fixe: 3.6,
        camera: { pos: K_cles([[0, [-8.86, 1.02, -6.75]], [6, [-8.97, 1.01, -6.42]]], "douce"), cible: [-9.0, 1.0, -6.03], fov: 32, epaule: 0.03 } },
      // 5 · la dalle, d'en haut : les six ronds, les deux pots
      { de: 24.4, a: 30.2, decor: "cimetiere", entree: "coupe", fixe: 3.0,
        camera: { pos: K_cles([[0, [-9.25, 1.75, -7.85]], [5.8, [-9.05, 1.6, -7.7]]], "douce"), cible: [-9.0, 0.18, -6.62], fov: 40, epaule: 0.03 } },
      // 6 · la grille, de la rue, à contre-jour : le gardien la ferme
      { de: 30.2, a: 37.0, decor: "cimetiere", entree: "coupe", fixe: 3.4,
        camera: { pos: K_cles([[0, [0.6, 1.5, 37.5]], [6.8, [0.4, 1.48, 36.6]]], "douce"), cible: [-0.4, 1.7, 20], fov: 44, epaule: 0.04 } }
    ]
  });

  function K_() { return FC.kit; }
  function K_cles(p, a) { var f = null; return function (t) { if (!f) f = K_().cles(p, a); return f(t); }; }
})(typeof window !== "undefined" ? window : this);
