/* ═══════════════════════════════════════════════════════════════════════════
   LA TROUSSE DU CINÉMA — 60 : les lieux (les grands décors, en géométrie).

     K.props.tribune(o)     une tribune couverte : gradins de béton, sièges
                            instanciés, toit, grillage, panneaux ; rend ses places
     K.props.pylone(o)      un pylône d'éclairage : treillis, tête de lampes qui
                            s'allument une à une, faisceau, halo, éclat
     K.props.pelouse(o)     la pelouse rayée, ses lignes
     K.props.but(o), K.props.ballon(o)
     K.props.facade(o)      un immeuble de brique, ses fenêtres la nuit, une enseigne
     K.props.rue(o)         une rue : la chaussée mouillée, les trottoirs, les façades
     K.props.reverbere(o)   un lampadaire au sodium (lumière, halo, cône)
     K.props.grillage(o)    un grillage (le virage, la friche)
     K.props.panneaux(o)    les panneaux du bord de terrain (des noms inventés)
     K.props.piece(o)       une pièce : sol, murs, plafond, une fenêtre
     K.props.escalier(o)    un escalier de bois, sa rampe, ses balustres
     K.props.cadre(o)       un cadre sous verre (une photo, une affiche)
   Et les outils : K.props.fusionner(groupe) (un appel par matériau, pour le
   téléphone), K.props.boite / cylindre (une pièce posée en une ligne).
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var K = global.FusibleCinema.kit;
  var T = K.T;
  var PI = Math.PI;

  // ─── les outils
  function boite(parent, w, h, d, mat, x, y, z, o) {
    var THREE = T(), g = K.garder(new THREE.BoxGeometry(w, h, d)), m = new THREE.Mesh(g, mat);
    m.position.set(x || 0, y || 0, z || 0);
    if (o && o.ry) m.rotation.y = o.ry;
    if (o && o.rx) m.rotation.x = o.rx;
    if (o && o.rz) m.rotation.z = o.rz;
    m.castShadow = !(o && o.ombre === false); m.receiveShadow = true;
    if (parent) parent.add(m);
    return m;
  }
  function cylindre(parent, r1, r2, h, mat, x, y, z, o) {
    var THREE = T(), g = K.garder(new THREE.CylinderGeometry(r1, r2, h, (o && o.cotes) || 16, 1, !!(o && o.ouvert))), m = new THREE.Mesh(g, mat);
    m.position.set(x || 0, y || 0, z || 0);
    if (o && o.rx) m.rotation.x = o.rx;
    if (o && o.rz) m.rotation.z = o.rz;
    if (o && o.ry) m.rotation.y = o.ry;
    m.castShadow = !(o && o.ombre === false); m.receiveShadow = true;
    if (parent) parent.add(m);
    return m;
  }
  // une géométrie de boîte dont les UV suivent les mètres (une matière qui se répète
  // à la bonne échelle, quelle que soit la taille de la boîte)
  function boiteUV(w, h, d, metre) {
    var THREE = T(), g = new THREE.BoxGeometry(w, h, d), uv = g.attributes.uv, n = g.attributes.normal, s = 1 / (metre || 1);
    for (var i = 0; i < uv.count; i++) {
      var nx = Math.abs(n.getX(i)), ny = Math.abs(n.getY(i));
      var a = nx > 0.5 ? d : w, b = ny > 0.5 ? d : h;
      uv.setXY(i, uv.getX(i) * a * s, uv.getY(i) * b * s);
    }
    return K.garder(g);
  }
  function planUV(w, h, metre) {
    var THREE = T(), g = new THREE.PlaneGeometry(w, h), uv = g.attributes.uv, s = 1 / (metre || 1);
    for (var i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w * s, uv.getY(i) * h * s);
    return K.garder(g);
  }
  // fusionner les maillages d'un groupe, matériau par matériau (les transformations
  // appliquées) : un pylône de 200 barres devient un appel
  function fusionner(groupe) {
    var THREE = T(), parMat = new Map();
    groupe.updateMatrixWorld(true);
    var inv = new THREE.Matrix4().copy(groupe.matrixWorld).invert();
    groupe.traverse(function (o) {
      if (!o.isMesh || o.isInstancedMesh || o.userData.garder) return;
      var l = parMat.get(o.material);
      if (!l) { l = []; parMat.set(o.material, l); }
      l.push(o);
    });
    var out = new THREE.Group();
    parMat.forEach(function (l, mat) {
      if (l.length < 2) return;
      var geos = l.map(function (o) {
        var g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
        g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld));
        ["position", "normal", "uv"].forEach(function (k) { if (!g.attributes[k]) g.setAttribute(k, new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * (k === "uv" ? 2 : 3)), k === "uv" ? 2 : 3)); });
        Object.keys(g.attributes).forEach(function (k) { if (["position", "normal", "uv"].indexOf(k) < 0) g.deleteAttribute(k); });
        return g;
      });
      var m = new THREE.Mesh(K.gens.fusion(geos), mat);
      m.castShadow = l.some(function (o) { return o.castShadow; }); m.receiveShadow = true;
      K.garder(m.geometry);
      out.add(m);
      l.forEach(function (o) { o.parent.remove(o); });
    });
    groupe.add(out);
    return groupe;
  }

  // ─── les matières des lieux (gardées pour tout le film)
  function grillageTex() {
    var THREE = T(), W = 128, c = K.tex.canvas(W, W), x = c.getContext("2d");
    x.clearRect(0, 0, W, W);
    x.strokeStyle = "#cfd2d4"; x.lineWidth = 5; x.lineCap = "round";
    x.beginPath(); x.moveTo(0, W / 2); x.lineTo(W / 2, 0); x.lineTo(W, W / 2); x.lineTo(W / 2, W); x.closePath(); x.stroke();
    var t = K.tex.texture(c, { donnee: false });
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  var GRILLAGE = null, TOLE = null;
  function tole() {
    if (TOLE) return TOLE;
    var W = 256, c = K.tex.canvas(W, W), x = c.getContext("2d");
    for (var i = 0; i < W; i++) { var v = 128 + Math.sin(i / W * PI * 2 * 8) * 100; x.fillStyle = "rgb(" + (v | 0) + "," + (v | 0) + "," + (v | 0) + ")"; x.fillRect(i, 0, 1, W); }
    TOLE = K.tex.texture(c, { donnee: true });
    return TOLE;
  }

  // ═══ LA TRIBUNE ═══════════════════════════════════════════════════════════
  //  o = { largeur: 64, rangs: 26, profondeur: 0.8, marche: 0.42, parMetre: 1.9, couleurs: ['#7A1F2E', '#8E8C86'],
  //        toit: true, grillage: true, panneaux: [...] , allees: 8 (une allée tous les n mètres), graine }
  // Le bord de la pelouse est en z = 0, la tribune monte vers -z ; le centre en x = 0.
  // → Group ; .places (les sièges : x, y, z, ry), .rangs, .hauteur, .profondeurTotale
  function tribune(o) {
    o = o || {};
    var THREE = T(), g = new THREE.Group(), r = K.alea(o.graine || "tribune");
    var L = o.largeur || 64, N = o.rangs || 26, P = o.profondeur || 0.8, Hm = o.marche || 0.42, recul = 3.2, bas = 1.4;
    var beton = K.mat.beton({ graine: "gradins", couleur: "#5f5b52", banches: 0, repete: null });
    var betonSombre = K.mat.beton({ graine: "mur", couleur: "#4d4a44" });
    // les gradins : une marche par rang, en un seul maillage
    var geos = [];
    for (var i = 0; i < N; i++) {
      var y = bas + i * Hm, z = -recul - i * P;
      var gm = boiteUV(L, Hm, P, 2); gm.translate(0, y - Hm / 2, z - P / 2);
      geos.push(gm.index ? gm.toNonIndexed() : gm);
    }
    // le mur du bas (le muret entre la pelouse et la tribune) et la fosse
    var mur = boiteUV(L + 4, bas + 0.2, 0.35, 2); mur.translate(0, (bas + 0.2) / 2, -recul + 0.17); geos.push(mur.toNonIndexed());
    var fosse = boiteUV(L + 4, 0.1, recul, 2); fosse.translate(0, 0.05, -recul / 2); geos.push(fosse.toNonIndexed());
    var gradins = new THREE.Mesh(K.gens.fusion(geos.map(function (x) { ["position", "normal", "uv"].forEach(function () {}); return x; })), beton);
    gradins.receiveShadow = true; gradins.castShadow = true;
    K.garder(gradins.geometry);
    g.add(gradins);
    // le dos et les côtés : de hauts murs de béton
    var H = bas + N * Hm, D = recul + N * P;
    boite(g, L + 4, H + 4, 0.5, betonSombre, 0, (H + 4) / 2, -D - 0.25);
    [-1, 1].forEach(function (sg) {
      var cote = new THREE.Shape();
      cote.moveTo(0, 0); cote.lineTo(D + 0.5, 0); cote.lineTo(D + 0.5, H + 4); cote.lineTo(recul, bas + 2); cote.lineTo(0, bas + 0.2); cote.lineTo(0, 0);
      var ge = K.garder(new THREE.ExtrudeGeometry(cote, { depth: 0.5, bevelEnabled: false }));
      var m = new THREE.Mesh(ge, betonSombre);
      m.rotation.y = PI / 2; m.position.set(sg * (L / 2 + 2) - (sg > 0 ? 0 : 0.5), 0, 0);
      m.castShadow = true; m.receiveShadow = true;
      g.add(m);
    });
    // le toit : une tôle sur des poutres, du fond jusqu'au tiers des gradins
    if (o.toit !== false) {
      var mTole = new THREE.MeshStandardMaterial({ color: "#2a2c30", roughness: 0.55, metalness: 0.6, bumpMap: tole(), bumpScale: 1.2 });
      K.garder(mTole);
      var prof = D * 0.72, ht = H + 4.5;
      var toit = boite(g, L + 4, 0.12, prof, mTole, 0, ht, -D + prof / 2 - 0.3, { rx: -0.07 });
      var mPout = K.mat.metal({ couleur: "#1c1e22", rugosite: 0.6 });
      for (var px = -L / 2; px <= L / 2 + 0.01; px += L / 6) {
        boite(g, 0.25, 0.6, prof, mPout, px, ht - 0.4, -D + prof / 2 - 0.3, { rx: -0.07 });
        cylindre(g, 0.18, 0.18, ht, mPout, px, ht / 2, -D + 0.6, { cotes: 10 });
      }
      // le bord du toit : une rangée de petites lampes (celles qu'on allume avant les pylônes)
      g.userData.toit = toit;
    }
    // les sièges : un siège = une assise et un dossier, instanciés ; blocs de couleur
    var cols = o.couleurs || ["#7A1F2E", "#8E8C86"], parM = o.parMetre || 1.9, allee = o.allees || 9;
    var places = [], parRang = Math.floor(L * parM);
    var gSiege = (function () {
      var a = new THREE.BoxGeometry(0.42, 0.05, 0.36); a.translate(0, 0.42, 0.04);
      var b = new THREE.BoxGeometry(0.42, 0.34, 0.05); b.translate(0, 0.6, -0.16); b.rotateX(0);
      var p1 = new THREE.BoxGeometry(0.06, 0.4, 0.06); p1.translate(0, 0.2, 0);
      return K.gens.fusion([a.toNonIndexed(), b.toNonIndexed(), p1.toNonIndexed()]);
    })();
    gSiege.computeVertexNormals();
    K.garder(gSiege);
    var mSiege = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.22, metalness: 0.0 });
    K.garder(mSiege);
    var nTot = 0, d = new THREE.Object3D(), col = new THREE.Color(), liste = [];
    for (var ri = 0; ri < N; ri++) {
      for (var si = 0; si < parRang; si++) {
        var x = -L / 2 + (si + 0.5) * L / parRang;
        if (allee && Math.abs(((x + L / 2) % allee) - allee / 2) > allee / 2 - 0.55) continue;   // l'allée
        var yy = bas + ri * Hm, zz = -recul - ri * P - P * 0.55;
        liste.push([x, yy, zz, Math.floor((x + L / 2) / allee)]);
      }
    }
    var sieges = new THREE.InstancedMesh(gSiege, mSiege, liste.length);
    liste.forEach(function (p, i) {
      d.position.set(p[0], p[1], p[2]); d.rotation.set(0, (r() - 0.5) * 0.06, 0); d.updateMatrix();
      sieges.setMatrixAt(i, d.matrix);
      col.set(cols[p[3] % cols.length]).multiplyScalar(0.8 + r() * 0.25);
      sieges.setColorAt(i, col);
      places.push({ x: p[0], y: p[1] + 0.02, z: p[2] + 0.22, ry: 0, rang: Math.round((p[1] - bas) / Hm) });
      nTot++;
    });
    sieges.instanceMatrix.needsUpdate = true; if (sieges.instanceColor) sieges.instanceColor.needsUpdate = true;
    sieges.castShadow = false; sieges.receiveShadow = true;
    g.add(sieges);
    // les allées : des marches plus étroites, des rampes de métal
    var mRampe = K.mat.metal({ couleur: "#8a8f93", rugosite: 0.35 });
    for (var ax = -L / 2 + allee; ax < L / 2 - 0.5; ax += allee) {
      var pts = [new THREE.Vector3(ax, bas + 1.0, -recul), new THREE.Vector3(ax, bas + N * Hm + 1.0, -recul - N * P)];
      var tube = new THREE.Mesh(K.garder(new THREE.TubeGeometry(new THREE.LineCurve3(pts[0], pts[1]), 2, 0.035, 6, false)), mRampe);
      g.add(tube);
    }
    // le grillage du virage, devant
    if (o.grillage !== false) {
      if (!GRILLAGE) GRILLAGE = grillageTex();
      var tg = GRILLAGE.clone(); tg.repeat.set(L * 6, 2.6 * 6); tg.needsUpdate = true; K.garder(tg);
      var mG = new THREE.MeshStandardMaterial({ map: tg, alphaTest: 0.35, side: THREE.DoubleSide, roughness: 0.4, metalness: 0.7, color: "#9aa0a4" });
      K.garder(mG);
      var gr = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(L, 2.6)), mG); gr.position.set(0, bas + 1.5, -recul + 0.25); g.add(gr);
      for (var gx = -L / 2; gx <= L / 2 + 0.01; gx += 3) cylindre(g, 0.03, 0.03, 2.8, mRampe, gx, bas + 1.5, -recul + 0.25, { cotes: 6 });
      cylindre(g, 0.03, 0.03, L, mRampe, 0, bas + 2.8, -recul + 0.25, { rz: PI / 2, cotes: 6 });
    }
    // les panneaux du bord : des noms d'Aubérive, et seulement d'Aubérive
    if (o.panneaux !== false) panneaux({ parent: g, largeur: L, z: 1.2, noms: o.panneaux });
    g.places = places; g.rangs = N; g.hauteur = H; g.profondeurTotale = D; g.bas = bas; g.recul = recul;
    g.sieges = sieges;
    return g;
  }

  // les panneaux du bord de terrain : des enseignes d'Aubérive (inventées)
  var NOMS_PANNEAUX = ["CARTONNAGES DE LA RIVE", "BANQUE AUBÉRIVOISE", "GARAGE DU PONT", "L'ÉCHO D'AUBÉRIVE", "BRASSERIE DU PONT", "TABAC DU QUAI", "TAILLEUR BRUNEL", "AUX IMMORTELLES"];
  function panneaux(o) {
    o = o || {};
    var THREE = T(), g = o.parent || new THREE.Group(), L = o.largeur || 60, noms = o.noms || NOMS_PANNEAUX, n = Math.max(4, Math.round(L / 6.5));
    var w = L / n;
    for (var i = 0; i < n; i++) {
      var nom = noms[i % noms.length], fonds = ["#1d2a44", "#7A1F2E", "#22301f", "#2b2b2b", "#e8e0c8"], fond = fonds[i % fonds.length];
      var t = K.tex.texte({ lignes: [nom], fond: fond, encre: fond === "#e8e0c8" ? "#1a1a1a" : "#efe7d2", largeur: 1024, hauteur: 160, graine: "panneau" + i });
      var m = new THREE.MeshStandardMaterial({ map: t.map, roughness: 0.45, metalness: 0.1, emissive: new THREE.Color("#ffffff"), emissiveMap: t.map, emissiveIntensity: o.lumiere == null ? 0.05 : o.lumiere });
      K.garder(m);
      boite(g, w - 0.08, 0.9, 0.12, m, -L / 2 + (i + 0.5) * w, 0.55, o.z == null ? 1 : o.z);
    }
    return g;
  }

  // ═══ LE PYLÔNE D'ÉCLAIRAGE ════════════════════════════════════════════════
  //  o = { hauteur: 34, colonnes: 5, rangees: 4, couleur: '#EEF2FF', cible: [x, y, z], intensite,
  //        cone: true, ombre: false, graine }
  // → Group ; .tete (le groupe des lampes), .lumiere (le projecteur), .allumer(k, t),
  //   .maj(t, debut) : la tête s'allume lampe à lampe à partir de `debut` (un claquement, un
  //   scintillement, puis la montée en blanc)
  function pylone(o) {
    o = o || {};
    var THREE = T(), g = new THREE.Group(), H = o.hauteur || 34, r = K.alea(o.graine || "pylone");
    var mAcier = K.mat.metal({ couleur: "#3b3f44", rugosite: 0.5, metal: 0.8 });
    var treillis = new THREE.Group();
    var base = 2.2, sommet = 0.7;
    var coin = function (sx, sz, y) { var k = y / H, w = base + (sommet - base) * k; return new THREE.Vector3(sx * w / 2, y, sz * w / 2); };
    var barre = function (a, b, ep) {
      var v = new THREE.Vector3().subVectors(b, a), l = v.length();
      var m = new THREE.Mesh(K.garder(new THREE.BoxGeometry(ep, l, ep)), mAcier);
      m.position.copy(a).addScaledVector(v, 0.5);
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.normalize());
      m.castShadow = true;
      treillis.add(m);
    };
    var coins = [[-1, -1], [1, -1], [1, 1], [-1, 1]], pas = 2.4;
    coins.forEach(function (c) { barre(coin(c[0], c[1], 0), coin(c[0], c[1], H), 0.16); });
    for (var y = 0; y < H - 0.1; y += pas) {
      for (var k = 0; k < 4; k++) {
        var a = coins[k], b = coins[(k + 1) % 4];
        barre(coin(a[0], a[1], y), coin(b[0], b[1], y), 0.06);
        barre(coin(a[0], a[1], y), coin(b[0], b[1], Math.min(H, y + pas)), 0.045);
      }
    }
    g.add(fusionner(treillis));
    // la tête : un cadre, des lampes en grille, tournée vers la cible
    var tete = new THREE.Group();
    tete.position.set(0, H + 1.6, 0);
    g.add(tete);
    var C = o.colonnes || 5, R = o.rangees || 4, ew = 0.95, eh = 0.95;
    boite(tete, C * ew + 0.5, R * eh + 0.5, 0.25, mAcier, 0, 0, -0.25);
    boite(tete, C * ew + 0.7, 0.12, 1.1, mAcier, 0, R * eh / 2 + 0.3, 0.2);
    var gLampe = K.garder(new THREE.CylinderGeometry(0.38, 0.42, 0.5, 18, 1));
    gLampe.rotateX(PI / 2);
    var corps = new THREE.InstancedMesh(gLampe, K.mat.metal({ couleur: "#2a2d31", rugosite: 0.4 }), C * R);
    var gVerre = K.garder(new THREE.CircleGeometry(0.33, 20));
    var mVerre = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
    K.garder(mVerre);
    var verres = new THREE.InstancedMesh(gVerre, mVerre, C * R);
    var d = new THREE.Object3D(), phases = [];
    for (var j = 0; j < R; j++) for (var i = 0; i < C; i++) {
      var n = j * C + i;
      d.position.set((i - (C - 1) / 2) * ew, ((R - 1) / 2 - j) * eh, 0.1); d.rotation.set(0, 0, 0); d.updateMatrix();
      corps.setMatrixAt(n, d.matrix);
      d.position.z = 0.36; d.updateMatrix(); verres.setMatrixAt(n, d.matrix);
      verres.setColorAt(n, new THREE.Color(0, 0, 0));
      phases.push(r() * 0.9);
    }
    corps.instanceMatrix.needsUpdate = true; verres.instanceMatrix.needsUpdate = true;
    tete.add(corps); tete.add(verres);
    // la lumière : un projecteur (l'ombre en option), le halo, l'éclat, le faisceau
    var coul = o.couleur || "#EEF2FF";
    var lum = K.look.projecteur({ couleur: coul, intensite: 0, angle: o.angle || 0.42, penombre: 0.6, decroissance: 2, ombre: !!o.ombre, loin: 160, ombreTaille: 2048 });
    lum.position.set(0, 0, 0.5);
    tete.add(lum);
    var cible = new THREE.Object3D(); g.add(cible); lum.target = cible;
    var halo = K.look.halo({ couleur: coul, taille: o.halo || 9, intensite: 0 });
    halo.position.set(0, 0, 1.2); tete.add(halo);
    var eclat = K.look.eclat({ couleur: "#CFE0FF", largeur: o.eclat || 34, hauteur: 0.35, intensite: 0 });
    eclat.position.set(0, 0, 1.3); tete.add(eclat);
    var faisceau = null;
    if (o.cone !== false) {
      faisceau = K.look.cone({ longueur: o.longueurCone || 60, rayonHaut: 1.6, rayonBas: o.rayonCone || 16, couleur: coul, intensite: 0, poussiere: 0.6 });
      faisceau.position.set(0, 0, 0.8);
      faisceau.rotation.x = -PI / 2;   // -Y du cône → +Z de la tête
      tete.add(faisceau);
    }
    var P = {
      groupe: g, tete: tete, lumiere: lum, cible: cible, halo: halo, eclat: eclat, faisceau: faisceau, intensiteMax: o.intensite || 2600,
      // viser un point du monde : la tête s'y tourne, le projecteur aussi
      viser: function (x, y, z) {
        g.updateMatrixWorld(true);
        var w = new THREE.Vector3(x, y, z);
        cible.position.copy(g.worldToLocal(w.clone()));
        tete.lookAt(w);
        g.updateMatrixWorld(true);
      },
      // k ∈ [0, 1] : la puissance ; chaque lampe la suit avec son retard (allumage en vague)
      allumer: function (k, t) {
        var c = new THREE.Color(), kk = K.borne(k, 0, 1);
        for (var n = 0; n < C * R; n++) {
          var kl = K.lisse(phases[n] * 0.35, phases[n] * 0.35 + 0.65, kk);
          // un scintillement au démarrage : la lampe hésite
          var sc = kl > 0 && kl < 0.9 ? 0.75 + 0.25 * Math.sin((t || 0) * 60 + n * 7.1) : 1;
          var chaud = 1 - kl;
          c.setRGB(1, 0.86 + 0.14 * (1 - chaud * 0.7), 0.7 + 0.3 * (1 - chaud)).multiplyScalar(kl * sc * 7);
          verres.setColorAt(n, c);
        }
        if (verres.instanceColor) verres.instanceColor.needsUpdate = true;
        lum.intensity = P.intensiteMax * kk * kk;
        halo.intensite(kk * 1.6);
        eclat.intensite(kk * 0.55);
        if (faisceau) faisceau.maj(t || 0, kk * (o.forceCone == null ? 0.16 : o.forceCone));
      },
      // à partir de `debut`, le claquement, puis la montée (2,2 s) ; avant : éteint
      maj: function (t, debut) {
        var k = debut == null ? 1 : K.rampe(debut, debut + (o.montee || 2.2), t);
        var kk = k > 0 && k < 0.25 ? k * (0.6 + 0.4 * Math.abs(Math.sin(t * 37))) : k;
        P.allumer(kk, t);
      }
    };
    P.allumer(0, 0);
    if (o.cible) P.viser(o.cible[0], o.cible[1], o.cible[2]);
    g.pylone = P;
    return P;
  }

  // ═══ LA PELOUSE, LE BUT, LE BALLON ════════════════════════════════════════
  function pelouse(o) {
    o = o || {};
    var THREE = T(), L = o.longueur || 105, W = o.largeur || 68;
    var m = K.mat.pelouse({ bandes: 12, lignes: false, repete: null, boue: o.boue || 0.2 });
    var p = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(W, L)), m);
    p.rotation.x = -PI / 2; p.receiveShadow = true;
    m.map.repeat.set(1, 1);
    // les lignes de craie, à part (fines, nettes)
    var g = new THREE.Group(); g.add(p);
    var mL = new THREE.MeshStandardMaterial({ color: "#e9e6d6", roughness: 0.8 }); K.garder(mL);
    var ligne = function (x, z, w, l) { var b = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(w, l)), mL); b.rotation.x = -PI / 2; b.position.set(x, 0.01, z); b.receiveShadow = true; g.add(b); };
    ligne(0, -L / 2 + 0.06, W, 0.12); ligne(0, L / 2 - 0.06, W, 0.12); ligne(-W / 2 + 0.06, 0, 0.12, L); ligne(W / 2 - 0.06, 0, 0.12, L); ligne(0, 0, W, 0.12);
    ligne(0, -L / 2 + 16.5, 40.3, 0.12); ligne(-20.1, -L / 2 + 8.25, 0.12, 16.5); ligne(20.1, -L / 2 + 8.25, 0.12, 16.5);
    ligne(0, L / 2 - 16.5, 40.3, 0.12); ligne(-20.1, L / 2 - 8.25, 0.12, 16.5); ligne(20.1, L / 2 - 8.25, 0.12, 16.5);
    var rond = new THREE.Mesh(K.garder(new THREE.RingGeometry(9.09, 9.21, 64)), mL); rond.rotation.x = -PI / 2; rond.position.y = 0.01; g.add(rond);
    g.longueur = L; g.largeur = W;
    return g;
  }
  function but(o) {
    o = o || {};
    var THREE = T(), g = new THREE.Group(), w = 7.32, h = 2.44, mB = new THREE.MeshStandardMaterial({ color: "#f2f2ee", roughness: 0.35 }); K.garder(mB);
    cylindre(g, 0.06, 0.06, h, mB, -w / 2, h / 2, 0); cylindre(g, 0.06, 0.06, h, mB, w / 2, h / 2, 0);
    cylindre(g, 0.06, 0.06, w + 0.12, mB, 0, h, 0, { rz: PI / 2 });
    // le filet : une trame en transparence
    var c = K.tex.canvas(64, 64), x = c.getContext("2d"); x.strokeStyle = "#e8e8e8"; x.lineWidth = 3; x.strokeRect(0, 0, 64, 64);
    var tn = K.tex.texture(c); tn.repeat.set(24, 10);
    var mF = new THREE.MeshStandardMaterial({ map: tn, alphaTest: 0.3, side: THREE.DoubleSide, roughness: 0.9, color: "#dddddd" }); K.garder(mF);
    var fond = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(w, h + 0.2)), mF); fond.position.set(0, h / 2, -2); fond.rotation.x = -0.25; g.add(fond);
    [-1, 1].forEach(function (s) { var cote = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(2, h)), mF); cote.rotation.y = PI / 2; cote.position.set(s * w / 2, h / 2, -1); g.add(cote); });
    var toit = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(w, 2)), mF); toit.rotation.x = PI / 2; toit.position.set(0, h, -1); g.add(toit);
    return g;
  }
  function ballon(o) {
    o = o || {};
    var THREE = T(), W = 256, c = K.tex.canvas(W * 2, W), x = c.getContext("2d");
    x.fillStyle = o.couleur || "#f1eee4"; x.fillRect(0, 0, W * 2, W);
    // des pentagones noirs en quinconce : un ballon, pas une marque
    x.fillStyle = o.couleur2 || "#151515";
    for (var j = 0; j < 3; j++) for (var i = 0; i < 6; i++) {
      var cx = (i + (j % 2) * 0.5) * W / 3, cy = (j + 0.5) * W / 3, rr = W / 14;
      x.beginPath(); for (var k = 0; k < 5; k++) { var a = k / 5 * PI * 2 - PI / 2; x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } x.fill();
    }
    var m = new THREE.MeshStandardMaterial({ map: K.tex.texture(c), roughness: 0.45 }); K.garder(m);
    var b = new THREE.Mesh(K.garder(new THREE.SphereGeometry(o.rayon || 0.11, 32, 20)), m); b.castShadow = true;
    return b;
  }

  // ═══ LA RUE ═══════════════════════════════════════════════════════════════
  // une façade de brique : les étages, les fenêtres (la nuit, certaines allumées), une
  // corniche, un rez-de-chaussée (une vitrine, une porte), une enseigne peinte
  //  o = { largeur, etages, hauteurEtage, profondeur, brique, fenetres: {colonnes, allumees}, enseigne: { lignes, fond, encre },
  //        vitrine: bool, graine }  → Group (la face avant en z = 0, vers +z)
  function facade(o) {
    o = o || {};
    var THREE = T(), g = new THREE.Group(), W = o.largeur || 10, E = o.etages || 3, he = o.hauteurEtage || 3.1, P = o.profondeur || 8, H = E * he + 3.6;
    var mB = K.mat.brique({ couleur: o.brique || "#6E3426", graine: o.graine || "facade", suie: 0.7 });
    var gb = boiteUV(W, H, P, 2.4);
    var corps = new THREE.Mesh(gb, mB); corps.position.set(0, H / 2, -P / 2); corps.castShadow = true; corps.receiveShadow = true; g.add(corps);
    // les fenêtres : un plan devant la brique, une texture de fenêtres (couleur + lumière)
    var col = (o.fenetres && o.fenetres.colonnes) || Math.max(2, Math.round(W / 2.6));
    var fen = K.tex.fenetres({ colonnes: col, rangees: E, allumees: o.fenetres && o.fenetres.allumees != null ? o.fenetres.allumees : 0.35, mur: "#000000", graine: o.graine || "f" });
    var mF = new THREE.MeshStandardMaterial({ map: fen.map, emissive: new THREE.Color("#ffffff"), emissiveMap: fen.lumiere, emissiveIntensity: o.lumiereFenetres || 0.9, roughness: 0.25, metalness: 0.1, transparent: true, alphaMap: null });
    K.garder(mF);
    mF.onBeforeCompile = function (sh) { sh.fragmentShader = sh.fragmentShader.replace("#include <map_fragment>", "#include <map_fragment>\n if (diffuseColor.r + diffuseColor.g + diffuseColor.b < 0.02) discard;"); };
    var pf = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(W * 0.98, E * he)), mF);
    pf.position.set(0, 3.6 + E * he / 2, 0.02); g.add(pf);
    // la corniche, les bandeaux
    var mPierre = K.mat.beton({ couleur: "#8a8478", graine: "pierre" });
    boite(g, W + 0.3, 0.35, 0.4, mPierre, 0, H, 0.05);
    boite(g, W + 0.1, 0.18, 0.2, mPierre, 0, 3.6, 0.04);
    // le rez-de-chaussée : une vitrine sombre, une porte
    if (o.vitrine !== false) {
      var mV = new THREE.MeshPhysicalMaterial({ color: "#05070a", roughness: 0.05, metalness: 0.0, reflectivity: 0.6, envMapIntensity: 1.2 });
      K.garder(mV);
      boite(g, W * 0.55, 2.4, 0.08, mV, -W * 0.12, 1.5, 0.02);
      var mBoisP = K.mat.bois({ couleur: "#3a2416", graine: "porte" });
      boite(g, 1.0, 2.3, 0.1, mBoisP, W * 0.3, 1.15, 0.03);
    }
    if (o.enseigne) {
      var te = K.tex.texte(Object.assign({ peint: true, largeur: 1024, hauteur: 200, fond: "#241812", encre: "#E8DFC6" }, o.enseigne));
      var mE = new THREE.MeshStandardMaterial({ map: te.map, roughness: 0.7, emissive: new THREE.Color("#ffffff"), emissiveMap: te.map, emissiveIntensity: o.enseigne.lumiere || 0.0 });
      K.garder(mE);
      var en = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(W * 0.86, W * 0.86 * 200 / 1024)), mE); en.position.set(0, 3.0, 0.06); g.add(en);
    }
    g.largeur = W; g.hauteur = H;
    return g;
  }
  // un lampadaire au sodium : le mât, la crosse, la lanterne ; la lumière, le halo, le cône
  //  o = { hauteur: 6, couleur: '#FF9A3D', intensite: 60, cone: true, ombre: false, bras: 1.4 }
  function reverbere(o) {
    o = o || {};
    var THREE = T(), g = new THREE.Group(), H = o.hauteur || 6, b = o.bras == null ? 1.4 : o.bras, coul = o.couleur || "#FF9A3D";
    var mM = K.mat.metal({ couleur: "#23262a", rugosite: 0.5 });
    cylindre(g, 0.07, 0.11, H, mM, 0, H / 2, 0, { cotes: 10 });
    var crosse = new THREE.Mesh(K.garder(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, H - 0.4, 0), new THREE.Vector3(0, H + 0.3, 0), new THREE.Vector3(b, H + 0.15, 0)), 12, 0.045, 6)), mM);
    g.add(crosse);
    var lanterne = new THREE.Group(); lanterne.position.set(b, H + 0.05, 0); g.add(lanterne);
    var cap = cylindre(lanterne, 0.08, 0.32, 0.18, mM, 0, 0.06, 0, { cotes: 14 });
    var globe = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.2, 16, 8, 0, PI * 2, PI / 2, PI / 2)), K.mat.lumiere({ couleur: coul, intensite: 6, toneMapped: false }));
    globe.position.y = 0.02; lanterne.add(globe);
    var lum = K.look.projecteur({ couleur: coul, intensite: o.intensite || 90, angle: 1.0, penombre: 0.8, decroissance: 2, ombre: !!o.ombre, loin: 30 });
    lum.position.set(0, -0.05, 0); lanterne.add(lum);
    var cible = new THREE.Object3D(); cible.position.set(b, 0, 0); g.add(cible); lum.target = cible;
    var halo = K.look.halo({ couleur: coul, taille: o.halo || 2.6, intensite: 1.3 }); halo.position.y = -0.05; lanterne.add(halo);
    var cone = null;
    if (o.cone !== false) { cone = K.look.cone({ longueur: H, rayonHaut: 0.18, rayonBas: H * 0.55, couleur: coul, intensite: o.forceCone || 0.12 }); cone.position.y = -0.04; lanterne.add(cone); }
    g.lanterne = lanterne; g.lumiere = lum; g.halo = halo; g.cone = cone; g.globe = globe;
    g.positionLampe = function () { var v = new THREE.Vector3(); globe.getWorldPosition(v); return [v.x, v.y, v.z]; };
    // un sodium qui grésille (k : l'intensité, de 0 à 1)
    g.maj = function (t, k) {
      var f = 1 - 0.08 * Math.max(0, K.bruit1(t * 9, 7)) * (o.gresille || 0);
      var kk = (k == null ? 1 : k) * f;
      lum.intensity = (o.intensite || 90) * kk; halo.intensite(1.3 * kk); if (cone) cone.maj(t, (o.forceCone || 0.12) * kk);
      globe.material.color.set(coul).multiplyScalar(6 * kk);
    };
    return g;
  }
  // une rue : la chaussée (asphalte mouillé), deux trottoirs, des bordures ; les façades
  // se posent à part (facade). La rue va le long de z, centrée en x = 0.
  //  o = { longueur: 40, largeur: 8, trottoir: 2.2, flaques: 0.4 }
  function rue(o) {
    o = o || {};
    var THREE = T(), g = new THREE.Group(), L = o.longueur || 40, W = o.largeur || 8, tr = o.trottoir || 2.2;
    var mA = K.mat.asphalte({ flaques: o.flaques == null ? 0.42 : o.flaques, ligne: false, graine: o.graine || "rue" });
    mA.map.repeat.set(W / 6, L / 6); mA.roughnessMap.repeat.set(W / 6, L / 6); mA.bumpMap.repeat.set(W / 6, L / 6);
    var ch = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(W, L)), mA); ch.rotation.x = -PI / 2; ch.receiveShadow = true; g.add(ch);
    var mT = K.mat.beton({ couleur: "#55524c", graine: "trottoir", banches: 0, taches: 0.9 });
    [-1, 1].forEach(function (s) {
      var gt = boiteUV(tr, 0.15, L, 1.5);
      var t = new THREE.Mesh(gt, mT); t.position.set(s * (W / 2 + tr / 2), 0.075, 0); t.receiveShadow = true; g.add(t);
      boite(g, 0.18, 0.17, L, K.mat.beton({ couleur: "#7a766c", graine: "bordure" }), s * (W / 2 + 0.09), 0.085, 0);
    });
    g.largeur = W; g.trottoir = tr; g.longueur = L;
    return g;
  }
  function grillage(o) {
    o = o || {};
    var THREE = T();
    if (!GRILLAGE) GRILLAGE = grillageTex();
    var L = o.longueur || 10, H = o.hauteur || 2.4, tg = GRILLAGE.clone(); tg.repeat.set(L * 6, H * 6); tg.needsUpdate = true; K.garder(tg);
    var m = new THREE.MeshStandardMaterial({ map: tg, alphaTest: 0.35, side: THREE.DoubleSide, roughness: 0.4, metalness: 0.7, color: "#9aa0a4" }); K.garder(m);
    var g = new THREE.Group(), p = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(L, H)), m); p.position.y = H / 2; g.add(p);
    var mR = K.mat.metal({ couleur: "#7d8286", rugosite: 0.4 });
    for (var x = -L / 2; x <= L / 2 + 0.01; x += 2.5) cylindre(g, 0.03, 0.03, H + 0.1, mR, x, H / 2, 0, { cotes: 6 });
    return g;
  }

  // ═══ LES INTÉRIEURS ═══════════════════════════════════════════════════════
  // une pièce : un sol, quatre murs (le devant ouvert), un plafond ; une fenêtre dans un mur
  //  o = { largeur, profondeur, hauteur, sol: Material, murs: Material, plafond: Material, fenetre: { mur: 'gauche'|'fond'|'droite', x, y, w, h } }
  function piece(o) {
    o = o || {};
    var THREE = T(), g = new THREE.Group(), W = o.largeur || 5, D = o.profondeur || 5, H = o.hauteur || 2.8;
    var mSol = o.sol || K.mat.bois({ couleur: "#4a2f1c", lames: 6, repete: [W / 1.5, D / 1.5] });
    var mMur = o.murs || K.mat.beton({ couleur: "#8a7f6c", graine: "plâtre", banches: 0, taches: 0.4 });
    var sol = new THREE.Mesh(planUV(W, D, 1.5), mSol); sol.rotation.x = -PI / 2; sol.receiveShadow = true; g.add(sol);
    var plaf = new THREE.Mesh(planUV(W, D, 2), o.plafond || mMur); plaf.rotation.x = PI / 2; plaf.position.y = H; g.add(plaf);
    var murs = { fond: [W, H, 0, H / 2, -D / 2, 0], gauche: [D, H, -W / 2, H / 2, 0, PI / 2], droite: [D, H, W / 2, H / 2, 0, -PI / 2] };
    Object.keys(murs).forEach(function (k) {
      var m = murs[k], fe = o.fenetre && o.fenetre.mur === k ? o.fenetre : null, mesh;
      if (fe) {
        // un mur percé : quatre morceaux autour du trou
        var gr = new THREE.Group(), w = m[0], h = m[1], fx = fe.x || 0, fy = fe.y || 1.4, fw = fe.w || 1.2, fh = fe.h || 1.4;
        var mor = function (x0, x1, y0, y1) { if (x1 - x0 < 0.01 || y1 - y0 < 0.01) return; var p = new THREE.Mesh(planUV(x1 - x0, y1 - y0, 2), mMur); p.position.set((x0 + x1) / 2, (y0 + y1) / 2 - h / 2, 0); p.receiveShadow = true; gr.add(p); };
        mor(-w / 2, fx - fw / 2, 0, h); mor(fx + fw / 2, w / 2, 0, h); mor(fx - fw / 2, fx + fw / 2, 0, fy - fh / 2); mor(fx - fw / 2, fx + fw / 2, fy + fh / 2, h);
        gr.children.forEach(function (p) { p.castShadow = true; });
        mesh = gr;
        g.trou = { mur: k, x: fx, y: fy, w: fw, h: fh };
      } else { mesh = new THREE.Mesh(planUV(m[0], m[1], 2), mMur); mesh.receiveShadow = true; mesh.castShadow = true; }
      mesh.position.set(m[2], m[3], m[4]); mesh.rotation.y = m[5];
      g.add(mesh);
    });
    g.largeur = W; g.profondeur = D; g.hauteur = H;
    return g;
  }
  // un escalier de bois : n marches qui montent vers -z, une rampe et ses balustres
  //  o = { marches: 14, largeur: 1.1, giron: 0.27, hauteurMarche: 0.18, rampe: 'droite'|'gauche', bois }
  function escalier(o) {
    o = o || {};
    var THREE = T(), g = new THREE.Group(), n = o.marches || 14, w = o.largeur || 1.1, gi = o.giron || 0.27, hm = o.hauteurMarche || 0.18;
    var mB = K.mat.bois({ couleur: o.bois || "#5a3820", lames: 3, graine: "marches", cire: true });
    var mC = K.mat.bois({ couleur: "#3b2414", lames: 2, graine: "contremarches" });
    for (var i = 0; i < n; i++) {
      boite(g, w, 0.04, gi + 0.03, mB, 0, (i + 1) * hm, -i * gi - gi / 2 + 0.015);
      boite(g, w, hm, 0.02, mC, 0, (i + 0.5) * hm, -i * gi + 0.0);
    }
    // le limon (la poutre qui porte les marches)
    var long = Math.hypot(n * gi, n * hm), ang = Math.atan2(n * hm, n * gi);
    var sx = o.rampe === "gauche" ? -1 : 1;
    boite(g, 0.06, 0.3, long, mC, sx * (w / 2 + 0.03), n * hm / 2 + 0.05, -n * gi / 2, { rx: ang });
    // la rampe : une main courante sur des balustres tournés
    var mR = K.mat.bois({ couleur: "#2e1b0e", lames: 1, graine: "rampe", cire: true });
    for (var b = 0; b < n; b++) {
      var y0 = (b + 1) * hm, z0 = -b * gi - gi / 2;
      cylindre(g, 0.018, 0.022, 0.9, mR, sx * (w / 2 - 0.05), y0 + 0.45, z0, { cotes: 8 });
    }
    boite(g, 0.07, 0.06, long + 0.3, mR, sx * (w / 2 - 0.05), n * hm / 2 + 0.98, -n * gi / 2, { rx: ang });
    g.marches = n; g.giron = gi; g.hauteurMarche = hm;
    // la position d'une marche (le milieu de son dessus)
    g.marche = function (i) { return [0, (i + 1) * hm + 0.02, -i * gi - gi / 2]; };
    return g;
  }
  // un cadre sous verre : une baguette, un passe-partout, l'image, la vitre qui reflète
  //  o = { texture, largeur, hauteur, baguette: '#2b1a10', verre: true }
  function cadre(o) {
    o = o || {};
    var THREE = T(), g = new THREE.Group(), w = o.largeur || 0.8, h = o.hauteur || 0.6, e = o.baguette == null ? 0.045 : o.epaisseur || 0.045;
    var mBag = K.mat.bois({ couleur: o.couleurBaguette || "#2b1a10", lames: 1, graine: "baguette", cire: true });
    boite(g, w + e * 2, e, 0.03, mBag, 0, h / 2 + e / 2, 0); boite(g, w + e * 2, e, 0.03, mBag, 0, -h / 2 - e / 2, 0);
    boite(g, e, h, 0.03, mBag, -w / 2 - e / 2, 0, 0); boite(g, e, h, 0.03, mBag, w / 2 + e / 2, 0, 0);
    var mImg = new THREE.MeshStandardMaterial({ map: o.texture || null, roughness: 0.85, metalness: 0, color: o.texture ? 0xffffff : 0x777777 }); K.garder(mImg);
    var img = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(w, h)), mImg); img.position.z = 0.002; img.receiveShadow = true; g.add(img);
    if (o.verre !== false) {
      var mV = new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.04, metalness: 0, transmission: 0, transparent: true, opacity: 0.12, reflectivity: 0.5, envMapIntensity: 1.6, depthWrite: false }); K.garder(mV);
      var v = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(w, h)), mV); v.position.z = 0.012; v.renderOrder = 2; g.add(v);
      g.verre = v;
    }
    // le clou, et la ficelle qui dépasse au-dessus
    cylindre(g, 0.004, 0.004, 0.04, K.mat.metal({ couleur: "#8d8f92" }), 0, h / 2 + 0.16, -0.005, { rx: PI / 2, cotes: 6 });
    g.image = img;
    return g;
  }

  K.props = K.props || {};
  var P = K.props;
  P.boite = boite; P.cylindre = cylindre; P.boiteUV = boiteUV; P.planUV = planUV; P.fusionner = fusionner;
  P.tribune = tribune; P.panneaux = panneaux; P.pylone = pylone; P.pelouse = pelouse; P.but = but; P.ballon = ballon;
  P.facade = facade; P.reverbere = reverbere; P.rue = rue; P.grillage = grillage;
  P.piece = piece; P.escalier = escalier; P.cadre = cadre;
  P.NOMS_PANNEAUX = NOMS_PANNEAUX;
})(typeof window !== "undefined" ? window : this);
