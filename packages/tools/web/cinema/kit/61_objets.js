/* ═══════════════════════════════════════════════════════════════════════════
   LA TROUSSE DU CINÉMA — 61 : les objets (ce que les inserts regardent).

     K.props.presse(o)       une presse à platine : le volant, le disque d'encre,
                             les rouleaux, la platine qui se referme ; maj(t)
     K.props.ampoule(o)      une ampoule nue au bout de son fil, qui se balance
     K.props.masque(o)       un masque de carton cintré (l'imprimé devant, le
                             carton derrière)
     K.props.cordeLinge(o)   une corde, des pinces, ce qui sèche (des masques)
     K.props.feuille(o)      une feuille (imprimée), un peu gondolée
     K.props.voiture(o)      une berline de 1990 (phares, feux, plaque inventée)
     K.props.usine(o)        une halle à sheds, sa cheminée, sa sirène
     K.props.couloir(o)      un couloir d'hôtel, ses portes numérotées, ses appliques
     K.props.porte(o)        une porte et son numéro
     K.props.bureau(o)       un bureau, sa lampe, ses papiers, sa chaise
     K.props.fax(o)          un télécopieur de 1990 et son papier thermique
     K.props.telephone(o)    o.epoque : cadran | repondeur | clapet | smartphone | oreillette
     K.props.dome(o)         un dôme de stade (l'hiver d'Al-Dorado)
     K.props.eglise(o)       une église de pierre, sa rosace allumée
     K.props.buvette(o)      la buvette d'un virage : le comptoir, le rideau de fer, le néon
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var K = global.FusibleCinema.kit;
  var T = K.T;
  var PI = Math.PI;
  var P = K.props = K.props || {};
  var boite = function () { return P.boite.apply(null, arguments); };
  var cylindre = function () { return P.cylindre.apply(null, arguments); };

  function fonte(couleur, rug) { return K.garder(new (T().MeshStandardMaterial)({ color: couleur || "#2e3a35", roughness: rug == null ? 0.55 : rug, metalness: 0.6 })); }
  function plastique(couleur, rug) { return K.garder(new (T().MeshStandardMaterial)({ color: couleur || "#d8d0bc", roughness: rug == null ? 0.45 : rug, metalness: 0 })); }
  function lumineux(couleur, k) { return K.mat.lumiere({ couleur: couleur, intensite: k == null ? 3 : k, toneMapped: false }); }

  // ═══ LA PRESSE À PLATINE ══════════════════════════════════════════════════
  //  o = { periode: 1.6 (s par feuille), feuille: texture (l'imprimé), couleur: fonte, voyant: '#FF5A4E',
  //        forme: K.tex.cliche(…) résolu ({ map, rugosite, relief } : la plaque encrée) ou une texture,
  //        depart: 0 (feuilles déjà sur la pile au temps 0) }
  // À chaque tour : une feuille blanche sur la platine, la platine se referme (le coup, vers
  // 0,5 du tour), elle se rouvre imprimée, et la feuille glisse sur la pile de sortie.
  // Le devant de la presse regarde +z ; le marbre (la forme) est vertical, la platine
  // bascule de l'avant pour venir le presser. → Group ; .maj(t) ; .feuilleSortie (Mesh) ;
  // .ouverture(t) (0 : fermée, 1 : ouverte)
  function presse(o) {
    o = o || {};
    var THREE = T(), g = new THREE.Group(), per = o.periode || 1.6;
    // la fonte peinte (écaillée aux arêtes), l'acier, et l'encre : un film noir et gras, que la
    // lumière ne fait briller que par endroits (une rugosité en nappes)
    var rf = K.tex.rouille({ peinture: o.couleur || "#3a5247", part: 0.12, graine: "fonte-presse" });
    var mF = K.garder(new THREE.MeshStandardMaterial({ map: rf.map, roughnessMap: rf.rugosite, bumpMap: rf.relief, bumpScale: 0.5, roughness: 0.75, metalness: 0.45 }));
    var mAcier = K.mat.metal({ couleur: "#8f9496", rugosite: 0.25 });
    var ne = K.tex.couche(256, 256, { periode: 3, octaves: 4, graine: "encre" }), nc = K.tex.canvas(256, 256), nx = nc.getContext("2d"), ni = nx.createImageData(256, 256);
    for (var q = 0; q < ne.length; q++) { var v = 20 + ne[q] * 120; ni.data[q * 4] = ni.data[q * 4 + 1] = ni.data[q * 4 + 2] = v; ni.data[q * 4 + 3] = 255; }
    nx.putImageData(ni, 0, 0);
    var mEncre = K.garder(new THREE.MeshStandardMaterial({ color: "#0a0a0b", roughness: 1, roughnessMap: K.tex.texture(nc, { donnee: true }), metalness: 0.1, envMapIntensity: 2.2 }));
    // les deux bâtis : un profil en C, extrudé
    var profil = new THREE.Shape();
    profil.moveTo(-0.45, 0); profil.lineTo(0.55, 0); profil.lineTo(0.5, 0.18); profil.lineTo(0.18, 0.3); profil.quadraticCurveTo(0.12, 0.75, 0.32, 1.05);
    profil.lineTo(0.42, 1.25); profil.lineTo(0.2, 1.42); profil.quadraticCurveTo(-0.3, 1.2, -0.38, 0.6); profil.lineTo(-0.45, 0);
    var gBati = K.garder(new THREE.ExtrudeGeometry(profil, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2, curveSegments: 10 }));
    [-0.42, 0.34].forEach(function (x) { var b = new THREE.Mesh(gBati, mF); b.rotation.y = -PI / 2; b.position.set(x, 0, 0); b.castShadow = true; b.receiveShadow = true; g.add(b); });
    // les entretoises, le socle
    boite(g, 0.92, 0.1, 0.9, mF, -0.04, 0.05, 0.05);
    cylindre(g, 0.035, 0.035, 0.84, mAcier, -0.04, 0.32, -0.25, { rz: PI / 2 });
    cylindre(g, 0.045, 0.045, 0.84, mAcier, -0.04, 0.3, 0.3, { rz: PI / 2 });
    // le marbre : la plaque verticale qui tient la forme (le visage en relief, encré)
    var marbre = boite(g, 0.62, 0.5, 0.08, mF, -0.04, 0.98, -0.12);
    var fo = o.forme && o.forme.map ? o.forme : (o.forme ? { map: o.forme } : null);
    var mForme = K.garder(new THREE.MeshStandardMaterial(fo ? { map: fo.map, roughnessMap: fo.rugosite || null, roughness: fo.rugosite ? 1 : 0.3, bumpMap: fo.relief || null, bumpScale: 1.2, metalness: 0.25, envMapIntensity: 1.6 }
      : { color: "#1a1a1a", roughness: 0.18, metalness: 0.5 }));
    // la forme : la feuille à l'envers, de sa taille (0,34 × 0,44), debout sur le marbre
    var forme = boite(g, 0.34, 0.44, 0.012, mForme, -0.04, 0.98, -0.075);
    // la platine : bascule autour d'un axe bas, à l'avant
    var charn = new THREE.Group(); charn.position.set(-0.04, 0.62, 0.24); g.add(charn);
    boite(charn, 0.66, 0.54, 0.09, mF, 0, 0.36, -0.06);
    var mTympan = K.garder(new THREE.MeshStandardMaterial({ color: "#d9d2bf", roughness: 0.9 }));
    var tympan = boite(charn, 0.5, 0.4, 0.01, mTympan, 0, 0.36, -0.11);
    // la feuille posée sur la platine (on la voit partir et revenir imprimée)
    var mFeuille = K.garder(new THREE.MeshStandardMaterial({ map: o.feuille || null, color: o.feuille ? 0xffffff : 0xefe9da, roughness: 0.9, side: THREE.DoubleSide }));
    var mBlanche = K.garder(new THREE.MeshStandardMaterial({ color: 0xefe9da, roughness: 0.9, side: THREE.DoubleSide }));
    var feuille = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.34, 0.44)), mFeuille); feuille.rotation.y = PI; feuille.position.set(0, 0.36, -0.118); charn.add(feuille);
    // le disque d'encre, en haut, et les rouleaux sur leurs bras
    var disque = cylindre(g, 0.3, 0.3, 0.03, mEncre, -0.04, 1.42, -0.02, { cotes: 48 });
    disque.rotation.x = -0.35;
    cylindre(g, 0.06, 0.08, 0.2, mF, -0.04, 1.32, -0.05, { cotes: 12 });
    // les rouleaux encreurs : un chariot qui descend sur la forme (au contact de sa face) et
    // remonte prendre l'encre au disque ; ils roulent, ils ne glissent pas
    var bras = new THREE.Group(); bras.position.set(-0.04, 1.5, -0.022); g.add(bras);
    var rouleaux = [];
    for (var i = 0; i < 3; i++) {
      var rl = cylindre(bras, 0.045, 0.045, 0.4, mEncre, 0, 0, 0, { rz: PI / 2, cotes: 24 });
      rl.position.set(0, -i * 0.11, 0); rouleaux.push(rl);
      cylindre(bras, 0.012, 0.012, 0.5, mAcier, 0, -i * 0.11, 0, { rz: PI / 2, cotes: 8 });
    }
    boite(bras, 0.03, 0.3, 0.03, mF, -0.26, -0.11, 0.03); boite(bras, 0.03, 0.3, 0.03, mF, 0.24, -0.11, 0.03);
    // le volant, sur le côté : la jante, les rayons, le moyeu
    var volant = new THREE.Group(); volant.position.set(0.5, 0.62, -0.05); g.add(volant);
    var jante = new THREE.Mesh(K.garder(new THREE.TorusGeometry(0.42, 0.035, 10, 48)), mF); jante.rotation.y = PI / 2; jante.castShadow = true; volant.add(jante);
    for (var k = 0; k < 6; k++) { var ry = boite(volant, 0.03, 0.82, 0.03, mF, 0, 0, 0); ry.rotation.x = k / 6 * PI; }
    cylindre(volant, 0.06, 0.06, 0.1, mAcier, 0, 0, 0, { rz: PI / 2, cotes: 14 });
    // le moteur, la courroie, le voyant (rouge : la presse tourne)
    boite(g, 0.24, 0.2, 0.26, fonte("#1c2420"), 0.62, 0.12, -0.35);
    var voyant = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.018, 10, 8)), lumineux(o.voyant || "#FF5A4E", 6)); voyant.position.set(0.62, 0.25, -0.22); g.add(voyant);
    var hv = K.look.halo({ couleur: o.voyant || "#FF5A4E", taille: 0.16, intensite: 1.6 }); hv.position.copy(voyant.position); g.add(hv);
    // la tablette de sortie, et la pile qui monte
    var mBois = K.mat.bois({ couleur: "#5b3b22", lames: 3, graine: "tablette" });
    boite(g, 0.5, 0.03, 0.4, mBois, -0.75, 0.82, 0.25);
    var pile = new THREE.Group(); pile.position.set(-0.75, 0.84, 0.25); g.add(pile);
    var nPile = 24, feuilles = [];
    for (var f = 0; f < nPile; f++) {
      var ff = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.34, 0.44)), mFeuille);
      ff.rotation.x = -PI / 2; ff.rotation.z = (K.h01(f, 3) - 0.5) * 0.12; ff.position.set((K.h01(f, 5) - 0.5) * 0.02, f * 0.0035, (K.h01(f, 7) - 0.5) * 0.02);
      ff.visible = false; ff.receiveShadow = true; pile.add(ff); feuilles.push(ff);
    }
    g.traverse(function (x) { if (x.isMesh && x !== voyant) { x.castShadow = true; x.receiveShadow = true; } });
    g.feuille = feuille; g.forme = forme; g.disque = disque; g.volant = volant; g.pile = pile; g.charniere = charn;
    // 0 : fermée (la platine contre le marbre), 1 : grande ouverte
    g.ouverture = function (t) { var c = (t / per) % 1; return 1 - K.cloche(0.30, 0.46, 0.54, 0.68, c); };
    g.maj = function (t, o2) {
      var c = (t / per) % 1, cycles = Math.floor(t / per);
      volant.rotation.x = -t / per * PI * 2;
      var ouv = g.ouverture(t);
      // ouverte, la platine se couche vers l'avant, la feuille face au ciel (on la pose, on la
      // reprend) ; fermée, elle est debout contre le marbre
      charn.rotation.x = 1.45 * ouv;
      // les rouleaux descendent sur la forme pendant que la platine est ouverte, puis remontent
      var desc = K.lisse(0.0, 0.14, c) - K.lisse(0.16, 0.3, c), course = 0.5 * desc;
      bras.position.y = 1.5 - course;
      rouleaux.forEach(function (rl, j) { rl.rotation.x = course / 0.045 + j * 1.3; });
      disque.rotation.y = cycles * 0.4 + K.lisse(0.75, 0.95, c) * 0.4;
      // la feuille de la platine : blanche jusqu'au coup, imprimée ensuite
      feuille.material = c > 0.5 ? mFeuille : mBlanche;
      // la pile : une feuille de plus à chaque tour, qui glisse de la platine vers la pile
      var sortie = t / per - 0.72, livrees = sortie < 0 ? 0 : Math.floor(sortie) + 1;
      var empile = Math.min(nPile, (o2 && o2.pile != null ? o2.pile : livrees + (o.depart || 0)));
      var arrivee = sortie < 0 ? 1 : K.lisse(0, 0.32, sortie - Math.floor(sortie));
      for (var f2 = 0; f2 < nPile; f2++) {
        var fv = feuilles[f2]; fv.visible = f2 < empile;
        var base = fv.userData.base || (fv.userData.base = fv.position.clone());
        if (f2 === empile - 1 && arrivee < 1) {
          fv.position.set(base.x + (1 - arrivee) * 0.42, base.y + Math.sin(arrivee * PI) * 0.05 + (1 - arrivee) * 0.06, base.z - (1 - arrivee) * 0.12);
        } else fv.position.copy(base);
      }
    };
    g.maj(0);
    return g;
  }

  // ═══ L'AMPOULE NUE ════════════════════════════════════════════════════════
  //  o = { fil: 0.8 (m), couleur: '#FFD49A', intensite: 18, ombre: true, balancement: 0.12 (rad), graine }
  // Le haut du fil est l'origine du groupe. → Group ; .maj(t) ; .lumiere ; .positionLampe()
  function ampoule(o) {
    o = o || {};
    var THREE = T(), g = new THREE.Group(), L = o.fil || 0.8, coul = o.couleur || "#FFD49A";
    var bras = new THREE.Group(); g.add(bras);
    cylindre(bras, 0.004, 0.004, L, K.mat.metal({ couleur: "#111", rugosite: 0.8 }), 0, -L / 2, 0, { cotes: 5 });
    cylindre(bras, 0.022, 0.018, 0.07, plastique("#1a1715", 0.6), 0, -L - 0.03, 0, { cotes: 12 });
    var verre = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.036, 18, 14)), K.garder(new THREE.MeshStandardMaterial({ color: "#fff6e6", emissive: new THREE.Color(coul), emissiveIntensity: 4, roughness: 0.15 })));
    verre.scale.set(1, 1.2, 1); verre.position.y = -L - 0.1; bras.add(verre);
    var fil = new THREE.Mesh(K.garder(new THREE.TorusGeometry(0.012, 0.0025, 4, 12, PI)), lumineux("#FFE2B0", 24)); fil.position.y = -L - 0.1; bras.add(fil);
    var q = K.qualite || {};
    var lum = new THREE.PointLight(coul, o.intensite || 18, o.portee || 0, 2);
    lum.position.y = -L - 0.12;
    if (o.ombre && q.ombres) {
      lum.castShadow = true; lum.shadow.mapSize.set(q.ombreTaille / 2, q.ombreTaille / 2); lum.shadow.bias = -0.002; lum.shadow.radius = 4;
      lum.shadow.camera.near = 0.05; lum.shadow.camera.far = o.loin || 12;
    }
    bras.add(lum);
    var halo = K.look.halo({ couleur: coul, taille: o.halo || 0.7, intensite: 1.4 }); halo.position.y = -L - 0.1; bras.add(halo);
    var graine = K.hash(o.graine || "ampoule") % 997;
    g.maj = function (t, k) {
      var a = o.balancement == null ? 0.12 : o.balancement;
      bras.rotation.z = Math.sin(t * Math.sqrt(9.8 / L) * 0.95 + graine) * a + K.fbm1(t * 0.3, graine) * a * 0.4;
      bras.rotation.x = Math.cos(t * Math.sqrt(9.8 / L) * 0.83 + graine * 2) * a * 0.45;
      var kk = (k == null ? 1 : k) * (1 - 0.06 * Math.max(0, K.bruit1(t * 14, graine + 3)));
      lum.intensity = (o.intensite || 18) * kk; halo.intensite(1.4 * kk); verre.material.emissiveIntensity = 4 * kk;
    };
    g.lumiere = lum; g.verre = verre; g.bras = bras;
    g.positionLampe = function () { var v = new THREE.Vector3(); verre.getWorldPosition(v); return [v.x, v.y, v.z]; };
    g.maj(0);
    return g;
  }

  // ═══ LE MASQUE DE CARTON ══════════════════════════════════════════════════
  //  o = { texture (le visage imprimé, détouré), largeur: 0.24, courbure: 0.5, carton: '#B9A888' }
  function masque(o) {
    o = o || {};
    var THREE = T(), w = o.largeur || 0.24, h = w * 1.0, c = o.courbure == null ? 0.5 : o.courbure;
    var geo = new THREE.PlaneGeometry(w, h, 10, 1), p = geo.attributes.position;
    for (var i = 0; i < p.count; i++) { var x = p.getX(i) / (w / 2); p.setZ(i, -c * x * x * w * 0.25); }
    geo.computeVertexNormals(); K.garder(geo);
    var avant = K.garder(new THREE.MeshStandardMaterial({ map: o.texture || null, alphaTest: 0.45, roughness: 0.82, side: THREE.FrontSide }));
    var dos = K.garder(new THREE.MeshStandardMaterial({ map: o.texture || null, alphaTest: 0.45, roughness: 0.9, side: THREE.BackSide }));
    var carton = K.rgb(o.carton || "#A8987A");
    dos.onBeforeCompile = function (sh) { sh.fragmentShader = sh.fragmentShader.replace("#include <map_fragment>", "#include <map_fragment>\n diffuseColor.rgb = vec3(" + carton.map(function (v) { return Math.pow(v, 2.2).toFixed(3); }).join(",") + ");"); };
    var g = new THREE.Group();
    var a = new THREE.Mesh(geo, avant), b = new THREE.Mesh(geo, dos);
    a.castShadow = b.castShadow = true; a.receiveShadow = b.receiveShadow = true;
    g.add(a); g.add(b);
    g.avant = a; g.dos = b;
    return g;
  }
  // une feuille (imprimée), un peu gondolée
  function feuille(o) {
    o = o || {};
    var THREE = T(), w = o.largeur || 0.34, h = o.hauteur || 0.44;
    var geo = new THREE.PlaneGeometry(w, h, 8, 8), p = geo.attributes.position;
    for (var i = 0; i < p.count; i++) { var x = p.getX(i), y = p.getY(i); p.setZ(i, (Math.sin(x * 9 + 1) * 0.004 + Math.sin(y * 7) * 0.003) * (o.gondole == null ? 1 : o.gondole) + (o.courbe || 0) * y * y); }
    geo.computeVertexNormals(); K.garder(geo);
    var m = K.garder(new THREE.MeshStandardMaterial({ map: o.texture || null, color: o.texture ? 0xffffff : 0xefe9da, roughness: 0.9, side: THREE.DoubleSide,
      emissive: new THREE.Color("#ffffff"), emissiveMap: o.texture || null, emissiveIntensity: o.transparence || 0 }));
    var f = new THREE.Mesh(geo, m); f.castShadow = true; f.receiveShadow = true;
    f.transparence = function (k) { m.emissiveIntensity = k; };
    return f;
  }

  // ═══ LA CORDE À LINGE ═════════════════════════════════════════════════════
  //  o = { de: [x, y, z], a: [x, y, z], fleche: 0.18, objets: [Object3D…] (pendus à intervalles réguliers),
  //        vent: 1, graine } → Group ; .maj(t) ; .pinces (positions)
  function cordeLinge(o) {
    o = o || {};
    var THREE = T(), g = new THREE.Group(), A = new THREE.Vector3().fromArray(o.de || [-2, 2, 0]), B = new THREE.Vector3().fromArray(o.a || [2, 2, 0]), fl = o.fleche == null ? 0.18 : o.fleche;
    var pt = function (u) { var v = new THREE.Vector3().lerpVectors(A, B, u); v.y -= fl * 4 * u * (1 - u); return v; };
    var courbe = new THREE.CatmullRomCurve3([0, 0.2, 0.4, 0.6, 0.8, 1].map(pt));
    var corde = new THREE.Mesh(K.garder(new THREE.TubeGeometry(courbe, 40, o.epaisseur || 0.006, 5, false)), K.garder(new THREE.MeshStandardMaterial({ color: o.couleur || "#c9c2b0", roughness: 0.8 })));
    corde.castShadow = true; g.add(corde);
    var objets = o.objets || [], n = objets.length, mPince = K.mat.bois({ couleur: "#b08a5a", lames: 1, graine: "pince" }), attaches = [];
    var graine = K.hash(o.graine || "corde") % 991;
    objets.forEach(function (ob, i) {
      var u = (i + 0.5) / n + (K.h01(i, graine) - 0.5) * 0.35 / n, p = pt(u);
      var at = new THREE.Group(); at.position.copy(p); g.add(at);
      boite(at, 0.012, 0.07, 0.018, mPince, 0, -0.01, 0.006);
      boite(at, 0.012, 0.07, 0.018, mPince, 0, -0.01, -0.006);
      var pend = new THREE.Group(); pend.position.y = -0.03; at.add(pend);
      ob.position.y = ob.position.y || 0;
      pend.add(ob);
      attaches.push({ g: at, pend: pend, i: i, u: u });
    });
    g.maj = function (t) {
      var v = o.vent == null ? 1 : o.vent;
      attaches.forEach(function (a) {
        var s = graine + a.i * 13;
        a.pend.rotation.x = (Math.sin(t * 1.3 + a.i * 0.7) * 0.08 + K.fbm1(t * 0.5 + a.i, s) * 0.25) * v;
        a.pend.rotation.y = K.fbm1(t * 0.35 + a.i * 0.3, s + 5) * 0.5 * v;
        a.pend.rotation.z = K.fbm1(t * 0.6, s + 9) * 0.06 * v;
      });
    };
    g.points = function () { return attaches.map(function (a) { var w = new THREE.Vector3(); a.g.getWorldPosition(w); return [w.x, w.y, w.z]; }); };
    g.maj(0);
    return g;
  }

  // ═══ LA BERLINE DE 1990 ═══════════════════════════════════════════════════
  //  o = { couleur: '#3b3f46', phares: 0..1, feux: 0..1, plaque: '8347 RV 12' }
  // l'avant regarde +x ; les roues touchent y = 0
  function voiture(o) {
    o = o || {};
    var THREE = T(), g = new THREE.Group(), L = 4.4, W = 1.7;
    var mC = K.garder(new THREE.MeshPhysicalMaterial({ color: o.couleur || "#3b3f46", roughness: 0.32, metalness: 0.5, clearcoat: 1, clearcoatRoughness: 0.12 }));
    var mVitre = K.garder(new THREE.MeshPhysicalMaterial({ color: "#0b0e12", roughness: 0.05, metalness: 0.1, envMapIntensity: 1.5 }));
    var mPneu = K.garder(new THREE.MeshStandardMaterial({ color: "#121212", roughness: 0.85 })), mJ = K.mat.metal({ couleur: "#a8adb2", rugosite: 0.25 });
    var bas = new THREE.Shape();
    bas.moveTo(-L / 2, 0.32); bas.lineTo(-L / 2 + 0.05, 0.72); bas.lineTo(L / 2 - 0.15, 0.78); bas.lineTo(L / 2, 0.6); bas.lineTo(L / 2, 0.32); bas.lineTo(-L / 2, 0.32);
    var gb = K.garder(new THREE.ExtrudeGeometry(bas, { depth: W - 0.1, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3 }));
    gb.translate(0, 0, -(W - 0.1) / 2);
    var caisse = new THREE.Mesh(gb, mC); caisse.castShadow = true; caisse.receiveShadow = true; g.add(caisse);
    var hab = new THREE.Shape();
    hab.moveTo(-L / 2 + 0.35, 0.76); hab.lineTo(-L / 2 + 0.75, 1.2); hab.lineTo(L / 2 - 1.55, 1.24); hab.lineTo(L / 2 - 1.05, 0.79); hab.lineTo(-L / 2 + 0.35, 0.76);
    var gh = K.garder(new THREE.ExtrudeGeometry(hab, { depth: W - 0.34, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2 }));
    gh.translate(0, 0, -(W - 0.34) / 2);
    var habit = new THREE.Mesh(gh, mVitre); habit.castShadow = true; g.add(habit);
    var toit = new THREE.Mesh(K.garder(new THREE.BoxGeometry(1.75, 0.05, W - 0.36)), mC); toit.position.set(-0.32, 1.23, 0); g.add(toit);
    [[1.35, 1], [1.35, -1], [-1.3, 1], [-1.3, -1]].forEach(function (p) {
      cylindre(g, 0.31, 0.31, 0.2, mPneu, p[0], 0.31, p[1] * (W / 2 - 0.12), { rx: PI / 2, cotes: 20 });
      cylindre(g, 0.18, 0.18, 0.21, mJ, p[0], 0.31, p[1] * (W / 2 - 0.12), { rx: PI / 2, cotes: 16 });
    });
    boite(g, 0.12, 0.14, W, mJ, L / 2 + 0.04, 0.42, 0); boite(g, 0.12, 0.14, W, mJ, -L / 2 - 0.04, 0.42, 0);
    var phare = lumineux("#FFF1D0", (o.phares == null ? 0 : o.phares) * 8 + 0.05), feu = lumineux("#FF2A20", (o.feux == null ? 0.2 : o.feux) * 5 + 0.05);
    [-1, 1].forEach(function (s) {
      boite(g, 0.03, 0.12, 0.32, phare, L / 2 + 0.02, 0.6, s * 0.55, { ombre: false });
      boite(g, 0.03, 0.12, 0.3, feu, -L / 2 - 0.02, 0.62, s * 0.58, { ombre: false });
    });
    var pl = K.tex.texte({ lignes: [o.plaque || "8347 RV 12"], fond: "#e9e6dc", encre: "#111", largeur: 512, hauteur: 112 });
    var mPl = K.garder(new THREE.MeshStandardMaterial({ map: pl.map, roughness: 0.5 }));
    var plaque = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.52, 0.11)), mPl); plaque.rotation.y = -PI / 2; plaque.position.set(-L / 2 - 0.11, 0.42, 0); g.add(plaque);
    g.phares = phare; g.feux = feu;
    return g;
  }

  // ═══ L'USINE : la halle à sheds, la cheminée, la sirène ═══════════════════
  //  o = { largeur: 30, profondeur: 18, sheds: 5, cheminee: 32, sirene: true, fenetres: 0.1 }
  function usine(o) {
    o = o || {};
    var THREE = T(), g = new THREE.Group(), W = o.largeur || 30, D = o.profondeur || 18, H = 7, n = o.sheds || 5;
    var mB = K.mat.brique({ couleur: "#5e3024", graine: "usine", suie: 1, humide: 0.7 });
    var corps = new THREE.Mesh(P.boiteUV(W, H, D, 2.4), mB); corps.position.set(0, H / 2, -D / 2); corps.castShadow = true; corps.receiveShadow = true; g.add(corps);
    var mT = K.mat.rouille({ peinture: "#2d3436", part: 0.4 }), mVerre = K.garder(new THREE.MeshPhysicalMaterial({ color: "#1a2228", roughness: 0.2, metalness: 0.2, emissive: new THREE.Color("#3a4a52"), emissiveIntensity: 0.15 }));
    var ws = W / n;
    for (var i = 0; i < n; i++) {
      var x0 = -W / 2 + i * ws;
      var sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(ws, 0); sh.lineTo(ws, 2.4); sh.lineTo(0, 0);
      var gs = K.garder(new THREE.ExtrudeGeometry(sh, { depth: D, bevelEnabled: false }));
      var s = new THREE.Mesh(gs, mT); s.position.set(x0, H, -D); s.castShadow = true; g.add(s);
      var v = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(D - 0.4, 2.2)), mVerre); v.rotation.y = PI / 2; v.position.set(x0 + ws + 0.02, H + 1.2, -D / 2); g.add(v);
    }
    var fen = K.tex.fenetres({ colonnes: Math.round(W / 3), rangees: 1, allumees: o.fenetres == null ? 0.08 : o.fenetres, mur: "#000000", graine: "usine" });
    var mF = K.garder(new THREE.MeshStandardMaterial({ map: fen.map, emissive: new THREE.Color("#ffffff"), emissiveMap: fen.lumiere, emissiveIntensity: 1.5, transparent: true, roughness: 0.3 }));
    mF.onBeforeCompile = function (sh) { sh.fragmentShader = sh.fragmentShader.replace("#include <map_fragment>", "#include <map_fragment>\n if (diffuseColor.r + diffuseColor.g + diffuseColor.b < 0.02) discard;"); };
    var pf = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(W * 0.95, 3.2)), mF); pf.position.set(0, 3.6, 0.02); g.add(pf);
    if (o.cheminee !== false) {
      var hc = o.cheminee || 32, mC = K.mat.brique({ couleur: "#6a3526", graine: "cheminee", suie: 1.2, repete: [3, 12] });
      var ch = cylindre(g, 0.9, 1.5, hc, mC, W / 2 - 3, hc / 2, -D - 3, { cotes: 24 });
      cylindre(g, 1.0, 1.0, 0.6, K.mat.metal({ couleur: "#222" }), W / 2 - 3, hc, -D - 3, { cotes: 24 });
      g.cheminee = ch; g.hautCheminee = [W / 2 - 3, hc + 0.3, -D - 3];
    }
    if (o.sirene !== false) {
      var sir = new THREE.Group(); sir.position.set(-W / 2 + 4, H + 3.2, -2); g.add(sir);
      var mS = K.mat.metal({ couleur: "#40464a", rugosite: 0.45 });
      cylindre(sir, 0.06, 0.06, 3, mS, 0, -1.5, 0, { cotes: 8 });
      cylindre(sir, 0.28, 0.28, 0.5, mS, 0, 0.1, 0, { cotes: 16 });
      [0, PI / 2, PI, 3 * PI / 2].forEach(function (a) { var pav = cylindre(sir, 0.05, 0.22, 0.45, mS, Math.cos(a) * 0.4, 0.1, Math.sin(a) * 0.4, { cotes: 12, ouvert: true }); pav.rotation.z = -PI / 2; pav.rotation.y = -a; });
      g.sirene = sir;
    }
    return g;
  }

  // ═══ LE COULOIR D'HÔTEL ═══════════════════════════════════════════════════
  //  o = { longueur: 16, largeur: 1.8, hauteur: 2.6, portes: 6, premier: 7, moquette: '#4a1c22', applique: '#FFC98A' }
  // le couloir s'en va vers -z
  function porte(o) {
    o = o || {};
    var THREE = T(), g = new THREE.Group();
    var mB = K.mat.bois({ couleur: o.bois || "#4b2c1a", lames: 1, graine: "porte" + (o.numero || ""), cire: true });
    boite(g, 0.9, 2.05, 0.05, mB, 0, 1.025, 0);
    var mCh = K.mat.bois({ couleur: "#2c190e", lames: 1, graine: "chambranle" });
    boite(g, 1.06, 0.08, 0.08, mCh, 0, 2.09, 0); boite(g, 0.08, 2.1, 0.08, mCh, -0.49, 1.05, 0); boite(g, 0.08, 2.1, 0.08, mCh, 0.49, 1.05, 0);
    cylindre(g, 0.025, 0.025, 0.12, K.mat.metal({ couleur: "#c8a45a", rugosite: 0.3 }), 0.34, 1.0, 0.07, { rx: PI / 2, cotes: 10 });
    if (o.numero != null) {
      var t = K.tex.texte({ lignes: [String(o.numero)], fond: "#b8933f", encre: "#1b130a", largeur: 256, hauteur: 160 });
      var pl = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.16, 0.1)), K.garder(new THREE.MeshStandardMaterial({ map: t.map, roughness: 0.3, metalness: 0.7 })));
      pl.position.set(0, 1.62, 0.03); g.add(pl);
    }
    return g;
  }
  function couloir(o) {
    o = o || {};
    var THREE = T(), L = o.longueur || 16, W = o.largeur || 1.8, H = o.hauteur || 2.6, n = o.portes || 6;
    // la moquette : des losanges fanés
    var c = K.tex.canvas(256, 256), x = c.getContext("2d");
    x.fillStyle = o.moquette || "#4a1c22"; x.fillRect(0, 0, 256, 256);
    x.strokeStyle = "rgba(200,160,90,0.35)"; x.lineWidth = 6;
    x.beginPath(); x.moveTo(128, 10); x.lineTo(246, 128); x.lineTo(128, 246); x.lineTo(10, 128); x.closePath(); x.stroke();
    var tm = K.tex.texture(c); tm.repeat.set(W / 0.6, L / 0.6);
    var mSol = K.garder(new THREE.MeshStandardMaterial({ map: tm, roughness: 0.95 }));
    var mMur = K.mat.papier({ couleur: "#8c7a5c", graine: "papierpeint", repete: [L / 1.2, 2] });
    var g = P.piece({ largeur: W, profondeur: L, hauteur: H, sol: mSol, murs: mMur });
    g.children.forEach(function (ch) { ch.position.z -= L / 2; });
    var portes = [];
    for (var i = 0; i < n; i++) {
      var cote = i % 2 ? 1 : -1, z = -1.5 - Math.floor(i / 2) * (L - 3) / Math.ceil(n / 2);
      var p = porte({ numero: (o.premier || 7) + i });
      p.position.set(cote * (W / 2 - 0.04), 0, z - (i % 2) * 0.9); p.rotation.y = -cote * PI / 2;
      g.add(p); portes.push(p);
    }
    // les appliques : une lumière chaude tous les trois mètres, l'une qui grésille
    var appliques = [];
    for (var a = 0; a < Math.floor(L / 3); a++) {
      var ap = new THREE.Group(); ap.position.set((a % 2 ? 1 : -1) * (W / 2 - 0.08), 1.9, -1 - a * 3); g.add(ap);
      var verre = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.07, 12, 8, 0, PI * 2, 0, PI / 2)), lumineux(o.applique || "#FFC98A", 3)); verre.rotation.x = PI; ap.add(verre);
      var l = new THREE.PointLight(o.applique || "#FFC98A", 1.6, 5, 2); ap.add(l);
      var h = K.look.halo({ couleur: o.applique || "#FFC98A", taille: 0.5, intensite: 1 }); ap.add(h);
      appliques.push({ l: l, v: verre, h: h });
    }
    g.portes = portes; g.appliques = appliques;
    g.maj = function (t) {
      appliques.forEach(function (ap, i) {
        var k = i === 2 ? (K.bruit1(t * 11, 5) > 0.35 ? 0.15 : 1) : 1;
        ap.l.intensity = 1.6 * k; ap.h.intensite(k); ap.v.material.color.set(o.applique || "#FFC98A").multiplyScalar(3 * k);
      });
    };
    return g;
  }

  // ═══ LE BUREAU ════════════════════════════════════════════════════════════
  function bureau(o) {
    o = o || {};
    var THREE = T(), g = new THREE.Group(), mB = K.mat.bois({ couleur: o.bois || "#4a2e1a", lames: 4, graine: "bureau", cire: true });
    boite(g, 1.6, 0.05, 0.8, mB, 0, 0.75, 0);
    boite(g, 0.45, 0.72, 0.75, mB, -0.55, 0.37, 0); boite(g, 0.45, 0.72, 0.75, mB, 0.55, 0.37, 0);
    var mPoig = K.mat.metal({ couleur: "#b89a5a" });
    for (var i = 0; i < 3; i++) { boite(g, 0.4, 0.2, 0.01, mB, -0.55, 0.62 - i * 0.22, 0.38); boite(g, 0.1, 0.02, 0.02, mPoig, -0.55, 0.62 - i * 0.22, 0.395); }
    // le sous-main, les papiers, une lampe à abat-jour vert
    boite(g, 0.6, 0.006, 0.42, K.garder(new THREE.MeshStandardMaterial({ color: "#2d3a2a", roughness: 0.8 })), 0, 0.778, 0.08);
    var rp = K.alea("papiers");
    for (var p = 0; p < 6; p++) { var f = boite(g, 0.21, 0.002, 0.29, K.mat.papier({ graine: "papiers" }), 0.3 + rp() * 0.1, 0.78 + p * 0.003, 0.05 + rp() * 0.1); f.rotation.y = (rp() - 0.5) * 0.4; }
    var lampe = new THREE.Group(); lampe.position.set(-0.55, 0.775, -0.15); g.add(lampe);
    var mL = K.mat.metal({ couleur: "#b89a5a", rugosite: 0.3 });
    cylindre(lampe, 0.09, 0.1, 0.03, mL, 0, 0.015, 0); cylindre(lampe, 0.012, 0.012, 0.35, mL, 0, 0.19, 0);
    var abat = cylindre(lampe, 0.06, 0.14, 0.12, K.garder(new THREE.MeshPhysicalMaterial({ color: "#1f5a32", roughness: 0.2, metalness: 0.1, emissive: new THREE.Color("#0c3a1c"), emissiveIntensity: 0.6, side: THREE.DoubleSide })), 0, 0.37, 0.05, { ouvert: true, cotes: 20 });
    abat.rotation.x = 0.35;
    var l = K.look.projecteur({ couleur: "#FFD9A0", intensite: o.lampe == null ? 6 : o.lampe, angle: 0.9, penombre: 0.7, ombre: !!o.ombre, loin: 6 });
    l.position.set(0, 0.34, 0.06); lampe.add(l);
    var cib = new THREE.Object3D(); cib.position.set(0.3, -0.4, 0.5); lampe.add(cib); l.target = cib;
    var h = K.look.halo({ couleur: "#FFD9A0", taille: 0.25, intensite: 0.8 }); h.position.set(0, 0.31, 0.08); lampe.add(h);
    // la chaise
    var mCh = K.garder(new THREE.MeshStandardMaterial({ color: "#1d1a18", roughness: 0.6 }));
    boite(g, 0.5, 0.08, 0.5, mCh, 0, 0.48, -0.75); boite(g, 0.5, 0.6, 0.07, mCh, 0, 0.82, -1.0);
    cylindre(g, 0.03, 0.03, 0.42, K.mat.metal({}), 0, 0.23, -0.75);
    g.lampe = l; g.plateau = 0.78;
    return g;
  }

  // ═══ LE TÉLÉCOPIEUR (1990) ════════════════════════════════════════════════
  //  o = { texte: [lignes du fax], sortie: 0..1 (le papier qui sort), voyant }
  function fax(o) {
    o = o || {};
    var THREE = T(), g = new THREE.Group(), mP = plastique("#cfc6b0", 0.5), mS = plastique("#3a3835", 0.6);
    boite(g, 0.38, 0.11, 0.3, mP, 0, 0.055, 0);
    var dessus = new THREE.Shape(); dessus.moveTo(-0.19, 0); dessus.lineTo(0.19, 0); dessus.lineTo(0.19, 0.04); dessus.lineTo(-0.19, 0.07);
    boite(g, 0.38, 0.03, 0.12, mS, 0, 0.125, 0.08);
    for (var i = 0; i < 12; i++) boite(g, 0.022, 0.012, 0.018, plastique("#e9e3d4", 0.4), -0.12 + (i % 4) * 0.03, 0.142, 0.05 + Math.floor(i / 4) * 0.025);
    var ecr = K.tex.ecran({ largeur: 256, hauteur: 64, type: "lcd", fond: "#7a8c5a", dessiner: function (x, t, w, h) { x.fillStyle = "#1c2412"; x.font = "700 " + Math.round(h * 0.55) + "px " + K.habillage.MONO; x.textAlign = "left"; x.textBaseline = "middle"; x.fillText(o.ecran || "23:58  RECEPTION", w * 0.04, h / 2); } });
    var lcd = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.12, 0.03)), K.garder(new THREE.MeshStandardMaterial({ map: ecr.texture, emissive: new THREE.Color("#ffffff"), emissiveMap: ecr.texture, emissiveIntensity: 0.6 })));
    lcd.rotation.x = -PI / 2; lcd.position.set(0.09, 0.141, 0.06); g.add(lcd);
    var voy = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.006, 8, 6)), lumineux(o.voyant || "#5CFF6A", 4)); voy.position.set(0.16, 0.142, 0.1); g.add(voy);
    // le rouleau, la fente, le papier thermique qui sort et retombe
    cylindre(g, 0.035, 0.035, 0.3, plastique("#f1ede2", 0.7), 0, 0.12, -0.11, { rz: PI / 2 });
    var lignes = o.texte || ["23 H 58", "", "UN NOM, UN PRIX, UN CLUB."];
    var tp = K.tex.texte({ lignes: lignes, fond: "#efece2", encre: "#2a2a2a", largeur: 512, hauteur: 640, police: K.habillage.MONO, graisse: "400" });
    var LP = 0.3, gp = new THREE.PlaneGeometry(0.21, LP, 1, 24); K.garder(gp);
    var mPap = K.garder(new THREE.MeshStandardMaterial({ map: tp.map, roughness: 0.6, side: THREE.DoubleSide }));
    var pap = new THREE.Mesh(gp, mPap); pap.castShadow = true; g.add(pap);
    var pos0 = gp.attributes.position.array.slice();
    // le papier sort de la fente vers l'avant et s'enroule vers le bas (un arc de cercle,
    // puis droit) ; k : la part sortie (0 à 1)
    g.sortie = function (k) {
      var p = gp.attributes.position, kap = 7, sortie = LP * K.borne(k, 0, 1);
      for (var i2 = 0; i2 < p.count; i2++) {
        var u = (LP / 2 - pos0[i2 * 3 + 1]) / LP;      // 0 : le bord qui sort en premier
        var d = Math.max(0, sortie - u * LP), a = Math.min(PI / 2, d * kap), y, z;
        if (d * kap <= PI / 2) { y = -(1 - Math.cos(a)) / kap; z = Math.sin(a) / kap; }
        else { y = -1 / kap - (d - PI / 2 / kap); z = 1 / kap; }
        p.setXYZ(i2, pos0[i2 * 3], 0.13 + y, 0.14 + z);
      }
      p.needsUpdate = true; gp.computeVertexNormals();
    };
    g.sortie(o.sortie == null ? 0.6 : o.sortie);
    g.ecran = ecr; g.voyant = voy;
    return g;
  }

  // ═══ LES TÉLÉPHONES DE CHAQUE ÉPOQUE ══════════════════════════════════════
  //  o = { epoque: 'cadran' (1960-1995) | 'repondeur' (1985-2000) | 'clapet' (1998-2010) |
  //        'smartphone' (2008-) | 'oreillette' (2020-), couleur, ecran: fn(ctx, t, w, h), allume: 0..1 }
  function telephone(o) {
    o = o || {};
    var THREE = T(), g = new THREE.Group(), e = o.epoque || "cadran";
    if (e === "cadran") {
      var mP = plastique(o.couleur || "#2a2826", 0.35);
      var corps = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.11, 24, 12, 0, PI * 2, 0, PI / 2)), mP); corps.scale.set(1.1, 0.75, 1.0); g.add(corps);
      cylindre(g, 0.105, 0.11, 0.02, mP, 0, 0.005, 0);
      var cad = new THREE.Mesh(K.garder(new THREE.RingGeometry(0.018, 0.05, 32)), plastique("#d8d2c4", 0.4)); cad.rotation.x = -PI / 2 + 0.6; cad.position.set(0, 0.075, 0.045); g.add(cad);
      for (var i = 0; i < 10; i++) { var a = -0.6 + i / 10 * PI * 1.65; var tr = new THREE.Mesh(K.garder(new THREE.CircleGeometry(0.0075, 10)), plastique("#111", 0.5)); tr.position.set(Math.cos(a) * 0.036, 0.077 + Math.sin(a) * 0.036 * 0.55, 0.047 + Math.sin(a) * 0.036 * 0.82 * 0.35); tr.rotation.x = -PI / 2 + 0.6; g.add(tr); }
      var comb = new THREE.Group(); comb.position.set(0, 0.11, -0.01); g.add(comb);
      var crv = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.1, -0.015, 0), new THREE.Vector3(-0.05, 0.012, 0), new THREE.Vector3(0.05, 0.012, 0), new THREE.Vector3(0.1, -0.015, 0)]);
      comb.add(new THREE.Mesh(K.garder(new THREE.TubeGeometry(crv, 16, 0.017, 8, false)), mP));
      [-0.1, 0.1].forEach(function (x) { var c = cylindre(comb, 0.03, 0.026, 0.035, mP, x, -0.025, 0, { cotes: 14 }); });
      // le cordon en spirale
      var pts = []; for (var k = 0; k < 120; k++) { var u = k / 119, ang = u * PI * 2 * 22; pts.push(new THREE.Vector3(-0.12 - u * 0.25 + Math.cos(ang) * 0.008, 0.06 - u * 0.05 + Math.sin(ang) * 0.008, -0.02 + u * 0.1)); }
      g.add(new THREE.Mesh(K.garder(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 240, 0.0025, 5, false)), mP));
      g.combine = comb;
    } else if (e === "repondeur") {
      var mR = plastique(o.couleur || "#1e1e20", 0.4);
      boite(g, 0.22, 0.05, 0.16, mR, 0, 0.025, 0);
      var vit = boite(g, 0.08, 0.004, 0.05, K.garder(new THREE.MeshPhysicalMaterial({ color: "#0d0d10", roughness: 0.05, transparent: true, opacity: 0.85 })), -0.04, 0.052, 0.01);
      for (var b = 0; b < 5; b++) boite(g, 0.022, 0.008, 0.014, plastique("#77736c"), 0.04 + (b % 3) * 0.028, 0.054, -0.03 + Math.floor(b / 3) * 0.03);
      var led = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.005, 8, 6)), lumineux("#FF2A20", 6)); led.position.set(0.09, 0.054, 0.05); g.add(led);
      var hl = K.look.halo({ couleur: "#FF2A20", taille: 0.05, intensite: 1.2 }); hl.position.copy(led.position); g.add(hl);
      g.maj = function (t) { var on = Math.floor(t * 2) % 2 === 0 ? 1 : 0.05; led.material.color.set("#FF2A20").multiplyScalar(6 * on); hl.intensite(1.2 * on); };
    } else if (e === "clapet") {
      var mK = plastique(o.couleur || "#2b2f36", 0.3), haut = new THREE.Group();
      boite(g, 0.048, 0.012, 0.09, mK, 0, 0.006, 0);
      haut.position.set(0, 0.012, -0.045); g.add(haut);
      boite(haut, 0.048, 0.01, 0.09, mK, 0, 0, -0.045);
      var ec = K.tex.ecran({ largeur: 128, hauteur: 160, type: "lcd", fond: "#0a1a2a", dessiner: o.ecran || function (x, t, w, h) { x.fillStyle = "#7fd8ff"; x.font = "700 " + Math.round(h * 0.12) + "px " + K.habillage.MONO; x.textAlign = "center"; x.fillText("1 MESSAGE", w / 2, h * 0.45); } });
      var sc = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.036, 0.045)), K.garder(new THREE.MeshBasicMaterial({ map: ec.texture, toneMapped: false })));
      sc.rotation.x = -PI / 2; sc.position.set(0, 0.0055, -0.05); haut.add(sc);
      haut.rotation.x = -(o.ouvert == null ? 2.6 : o.ouvert);
      g.ecran = ec;
    } else if (e === "smartphone") {
      var r2 = new THREE.Shape(), w2 = 0.072, h2 = 0.15, rr = 0.009;
      r2.moveTo(-w2 / 2 + rr, -h2 / 2); r2.lineTo(w2 / 2 - rr, -h2 / 2); r2.quadraticCurveTo(w2 / 2, -h2 / 2, w2 / 2, -h2 / 2 + rr); r2.lineTo(w2 / 2, h2 / 2 - rr); r2.quadraticCurveTo(w2 / 2, h2 / 2, w2 / 2 - rr, h2 / 2);
      r2.lineTo(-w2 / 2 + rr, h2 / 2); r2.quadraticCurveTo(-w2 / 2, h2 / 2, -w2 / 2, h2 / 2 - rr); r2.lineTo(-w2 / 2, -h2 / 2 + rr); r2.quadraticCurveTo(-w2 / 2, -h2 / 2, -w2 / 2 + rr, -h2 / 2);
      var gs = K.garder(new THREE.ExtrudeGeometry(r2, { depth: 0.008, bevelEnabled: true, bevelThickness: 0.001, bevelSize: 0.001, bevelSegments: 2 }));
      var s = new THREE.Mesh(gs, K.garder(new THREE.MeshPhysicalMaterial({ color: o.couleur || "#15161a", roughness: 0.25, metalness: 0.6, clearcoat: 1 }))); s.rotation.x = -PI / 2; g.add(s);
      var ec2 = K.tex.ecran({ largeur: 240, hauteur: 500, type: "lcd", fond: "#05070a", dessiner: o.ecran || function (x, t, w, h) { x.fillStyle = "#e9eef5"; x.font = "400 " + Math.round(w * 0.2) + "px " + K.habillage.MONO; x.textAlign = "center"; x.fillText("00:00", w / 2, h * 0.3); } });
      var sc2 = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(w2 - 0.006, h2 - 0.008)), K.garder(new THREE.MeshBasicMaterial({ map: ec2.texture, toneMapped: false, color: new THREE.Color(1, 1, 1).multiplyScalar(o.allume == null ? 1 : o.allume) })));
      sc2.rotation.x = -PI / 2; sc2.position.y = 0.0095; g.add(sc2);
      g.ecran = ec2;
    } else {
      // l'oreillette : une coque, un crochet, une diode
      var mO = plastique(o.couleur || "#d9dde2", 0.25);
      var coque = new THREE.Mesh(K.garder(new THREE.CapsuleGeometry(0.007, 0.018, 4, 10)), mO); coque.rotation.z = 0.6; g.add(coque);
      var embout = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.0075, 12, 8)), plastique("#9aa0a6", 0.6)); embout.position.set(-0.008, -0.004, 0.006); g.add(embout);
      var cro = new THREE.Mesh(K.garder(new THREE.TorusGeometry(0.018, 0.0018, 6, 24, PI * 1.2)), mO); cro.position.set(0.006, 0.01, -0.006); cro.rotation.set(0, PI / 2, 0.3); g.add(cro);
      var d = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.0013, 6, 4)), lumineux("#4FE3FF", 8)); d.position.set(0.004, 0.012, 0.007); g.add(d);
      var hd = K.look.halo({ couleur: "#4FE3FF", taille: 0.02, intensite: 1.5 }); hd.position.copy(d.position); g.add(hd);
      g.maj = function (t) { var k = 0.3 + 0.7 * Math.pow(0.5 + 0.5 * Math.sin(t * 3.2), 4); d.material.color.set("#4FE3FF").multiplyScalar(8 * k); hd.intensite(1.5 * k); };
    }
    g.traverse(function (x) { if (x.isMesh) { x.castShadow = true; x.receiveShadow = true; } });
    if (!g.maj) g.maj = function (t) { if (g.ecran) g.ecran.maj(t); };
    else { var m0 = g.maj; g.maj = function (t) { m0(t); if (g.ecran) g.ecran.maj(t); }; }
    return g;
  }

  // ═══ LE DÔME ══════════════════════════════════════════════════════════════
  //  o = { rayon: 60, nervures: 24, couleur: '#DDEFFF', lumiere: 1 }
  function dome(o) {
    o = o || {};
    var THREE = T(), g = new THREE.Group(), R = o.rayon || 60, n = o.nervures || 24, coul = o.couleur || "#DDEFFF";
    var mPeau = K.garder(new THREE.MeshPhysicalMaterial({ color: "#1d2733", roughness: 0.3, metalness: 0.3, clearcoat: 0.6, emissive: new THREE.Color(coul), emissiveIntensity: 0.04 }));
    // la calotte : du sommet (θ = 0) jusqu'à θmax, écrasée en hauteur, posée sur son socle
    var tm = PI * 0.42, ech = 0.55, bas = R * Math.cos(tm) * ech;
    var peau = new THREE.Mesh(K.garder(new THREE.SphereGeometry(R, 64, 24, 0, PI * 2, 0, tm)), mPeau); peau.scale.y = ech; peau.position.y = -bas + 6; g.add(peau);
    var mN = lumineux(coul, (o.lumiere == null ? 1 : o.lumiere) * 2.2);
    var surDome = function (th, ph, plus) { return new THREE.Vector3((R + plus) * Math.sin(th) * Math.cos(ph), (R + plus) * Math.cos(th) * ech - bas + 6, (R + plus) * Math.sin(th) * Math.sin(ph)); };
    for (var i = 0; i < n; i++) {
      var ph = i / n * PI * 2, pts = [];
      for (var k = 0; k <= 24; k++) pts.push(surDome(k / 24 * tm, ph, 0.3));
      g.add(new THREE.Mesh(K.garder(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.22, 4, false)), mN));
    }
    for (var j = 1; j <= 4; j++) {
      var th = j / 5 * tm, rr = R * Math.sin(th), y = R * Math.cos(th) * ech - bas + 6;
      var anneau = new THREE.Mesh(K.garder(new THREE.TorusGeometry(rr + 0.2, 0.18, 4, 96)), mN); anneau.rotation.x = PI / 2; anneau.position.y = y; g.add(anneau);
    }
    cylindre(g, R * Math.sin(tm) * 1.0, R * Math.sin(tm) * 1.04, 6, K.mat.beton({ couleur: "#9aa3ad", graine: "dome" }), 0, 3, 0, { cotes: 96 });
    g.peau = peau;
    return g;
  }

  // ═══ L'ÉGLISE ═════════════════════════════════════════════════════════════
  function eglise(o) {
    o = o || {};
    var THREE = T(), g = new THREE.Group(), W = 10, D = 22, H = 9;
    var mPierre = K.mat.beton({ couleur: "#7c776a", graine: "pierre-eglise", banches: 7, taches: 0.8 });
    var nef = new THREE.Mesh(P.boiteUV(W, H, D, 3), mPierre); nef.position.set(0, H / 2, -D / 2); nef.castShadow = true; nef.receiveShadow = true; g.add(nef);
    var toit = new THREE.Shape(); toit.moveTo(-W / 2 - 0.4, 0); toit.lineTo(0, 4.5); toit.lineTo(W / 2 + 0.4, 0); toit.lineTo(-W / 2 - 0.4, 0);
    var gt = K.garder(new THREE.ExtrudeGeometry(toit, { depth: D + 0.6, bevelEnabled: false }));
    var mArd = K.garder(new THREE.MeshStandardMaterial({ color: "#2b3036", roughness: 0.45, metalness: 0.3 }));
    var tt = new THREE.Mesh(gt, mArd); tt.position.set(0, H, -D - 0.3); tt.castShadow = true; g.add(tt);
    var clocher = new THREE.Mesh(P.boiteUV(4, 18, 4, 3), mPierre); clocher.position.set(0, 9, 1); clocher.castShadow = true; g.add(clocher);
    var fl = new THREE.Mesh(K.garder(new THREE.ConeGeometry(3, 9, 4)), mArd); fl.rotation.y = PI / 4; fl.position.set(0, 22.5, 1); g.add(fl);
    // la rosace : un cercle de lumière, ses meneaux
    var c = K.tex.canvas(256, 256), x = c.getContext("2d");
    x.fillStyle = "#000"; x.fillRect(0, 0, 256, 256);
    var cols = ["#d8a040", "#a03030", "#3050a0", "#e0c070"];
    for (var k = 0; k < 12; k++) { x.fillStyle = cols[k % 4]; x.beginPath(); x.moveTo(128, 128); x.arc(128, 128, 118, k / 12 * PI * 2, (k + 1) / 12 * PI * 2); x.fill(); }
    x.strokeStyle = "#000"; x.lineWidth = 8; for (var m = 0; m < 12; m++) { x.beginPath(); x.moveTo(128, 128); x.lineTo(128 + Math.cos(m / 12 * PI * 2) * 120, 128 + Math.sin(m / 12 * PI * 2) * 120); x.stroke(); }
    x.beginPath(); x.arc(128, 128, 40, 0, 7); x.stroke(); x.beginPath(); x.arc(128, 128, 118, 0, 7); x.stroke();
    var tr = K.tex.texture(c, { clamp: true });
    var ros = new THREE.Mesh(K.garder(new THREE.CircleGeometry(1.4, 48)), K.garder(new THREE.MeshBasicMaterial({ map: tr, color: new THREE.Color(1, 1, 1).multiplyScalar(o.rosace == null ? 2.2 : o.rosace), toneMapped: false })));
    ros.position.set(0, 12, 3.02); g.add(ros);
    var porteE = P.boite(g, 1.8, 3.2, 0.2, K.mat.bois({ couleur: "#3a2214", lames: 4, graine: "porte-eglise" }), 0, 1.6, 3.0);
    g.rosace = ros;
    return g;
  }

  // ═══ LA BUVETTE ═══════════════════════════════════════════════════════════
  //  o = { neon: 'BUVETTE', couleur: '#FF5A4E', rideau: 0..1 (la part baissée), largeur: 4 }
  function buvette(o) {
    o = o || {};
    var THREE = T(), g = new THREE.Group(), W = o.largeur || 4, H = 3, D = 3;
    var mB = K.mat.beton({ couleur: "#5c5850", graine: "buvette", taches: 1 });
    var mur = new THREE.Mesh(P.boiteUV(W, H, D, 2), mB); mur.position.set(0, H / 2, -D / 2); mur.castShadow = true; mur.receiveShadow = true; g.add(mur);
    // le guichet : un trou sombre et chaud, le comptoir, le rideau de fer à moitié baissé
    var fond = P.boite(g, W * 0.7, 1.2, 0.05, K.garder(new THREE.MeshStandardMaterial({ color: "#1a120c", emissive: new THREE.Color("#5a2a10"), emissiveIntensity: 0.4 })), 0, 1.6, 0.03);
    var comptoir = P.boite(g, W * 0.75, 0.08, 0.5, K.mat.bois({ couleur: "#4a2c18", lames: 3, graine: "comptoir", cire: true }), 0, 1.0, 0.25);
    var tole = K.mat.rouille({ peinture: "#5a5f60", part: 0.25 });
    var rideau = P.boite(g, W * 0.72, 1.2, 0.03, tole, 0, 1.6 + 1.2 / 2 * (1 - (o.rideau == null ? 0.4 : o.rideau)), 0.06);
    rideau.scale.y = o.rideau == null ? 0.4 : o.rideau;
    var nt = K.tex.neon({ texte: o.neon || "BUVETTE", couleur: o.couleur || "#FF5A4E", largeur: 1024, hauteur: 220 });
    var mN = K.garder(new THREE.MeshBasicMaterial({ map: nt.lumiere, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, color: new THREE.Color(1, 1, 1).multiplyScalar(2.2) }));
    var neon = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(W * 0.8, W * 0.8 * 220 / 1024)), mN); neon.position.set(0, 2.55, 0.06); g.add(neon);
    var ln = new THREE.PointLight(o.couleur || "#FF5A4E", 6, 9, 2); ln.position.set(0, 2.5, 0.8); g.add(ln);
    // deux caisses de bière en guise de table
    var mCaisse = plastique("#2c4a2c", 0.6);
    P.boite(g, 0.4, 0.3, 0.3, mCaisse, -1.1, 0.15, 1.2); P.boite(g, 0.4, 0.3, 0.3, mCaisse, -1.1, 0.45, 1.2, { ry: 0.2 });
    g.neon = neon; g.lumiereNeon = ln;
    g.maj = function (t) {
      var k = K.bruit1(t * 6, 3) > 0.55 ? 0.3 : 1;
      mN.color.setScalar(2.2 * k); ln.intensity = 6 * k;
    };
    return g;
  }

  P.presse = presse; P.ampoule = ampoule; P.masque = masque; P.feuille = feuille; P.cordeLinge = cordeLinge;
  P.voiture = voiture; P.usine = usine; P.couloir = couloir; P.porte = porte; P.bureau = bureau; P.fax = fax;
  P.telephone = telephone; P.dome = dome; P.eglise = eglise; P.buvette = buvette;
})(typeof window !== "undefined" ? window : this);
