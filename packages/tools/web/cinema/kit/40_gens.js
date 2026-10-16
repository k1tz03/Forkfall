/* ═══════════════════════════════════════════════════════════════════════════
   LA TROUSSE DU CINÉMA — 40 : les gens.

   Des mannequins, jamais des visages : les gens du film sont des silhouettes
   à contre-jour, des dos, des mains, une foule au loin. Un visage, quand il en
   faut un, est une image imprimée (un masque, une photo, une affiche : 10).

     K.gens.mannequin(o)  une personne articulée (bassin, buste, tête, bras,
                          jambes), avec ses poses : repos, marche, fumer,
                          bras (deux angles), leverMasque, tirer, salut, assis
     K.gens.foule(o)      des milliers de personnes instanciées sur des places
                          (une tribune) : elles se balancent, et lèvent ce
                          qu'elles tiennent (un masque) en vague, au temps dit
   Tout se règle sur `t` : poser(t) n'a pas d'état.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var K = global.FusibleCinema.kit;
  var T = K.T;
  var PI = Math.PI;

  function matTissu(couleur, o) {
    var THREE = T();
    return K.garder(new THREE.MeshStandardMaterial({ color: couleur || "#1c1c22", roughness: o && o.rugosite != null ? o.rugosite : 0.92, metalness: 0,
      emissive: o && o.contour ? new THREE.Color(o.contour) : 0x000000, emissiveIntensity: o && o.contour ? 0.0 : 0 }));
  }

  // ─── LE MANNEQUIN
  //  o = { taille: 1.78, carrure: 1, tenue: 'manteau'|'blouson'|'survetement'|'costume', couleur, couleur2,
  //        echarpe: '#7A1F2E' | null, casquette: bool, cigarette: bool, femme: bool, silhouette: bool, graine }
  function mannequin(o) {
    o = o || {};
    var THREE = T(), s = (o.taille || 1.78) / 1.78, k = o.carrure || 1;
    var noir = o.silhouette ? "#07070a" : null;
    var mV = matTissu(noir || o.couleur || "#22232a"), mV2 = matTissu(noir || o.couleur2 || o.couleur || "#1a1b20");
    var mP = matTissu(noir || o.peau || "#8a6a55", { rugosite: 0.75 }), mC = matTissu(noir || "#111114");
    var racine = new THREE.Group(), os = {};
    function pivot(nom, parent, x, y, z) { var g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); os[nom] = g; return g; }
    function piece(parent, geo, mat, x, y, z, ombre) {
      var m = new THREE.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0);
      m.castShadow = ombre !== false; m.receiveShadow = false; parent.add(m); K.garder(geo); return m;
    }
    var bassin = pivot("bassin", racine, 0, 0.95 * s, 0);
    var buste = pivot("buste", bassin, 0, 0.02 * s, 0);
    // le buste : un tronc qui s'évase aux épaules, aplati d'avant en arrière
    var gTorse = new THREE.CylinderGeometry(0.2 * s * k, 0.155 * s * k, 0.56 * s, 14, 1);
    var torse = piece(buste, gTorse, mV, 0, 0.29 * s, 0); torse.scale.z = 0.62;
    if (o.tenue === "manteau" || o.tenue === "imper") {
      var gPan = new THREE.CylinderGeometry(0.175 * s * k, 0.27 * s * k, 0.62 * s, 16, 1, true);
      var pan = piece(bassin, gPan, mV, 0, -0.24 * s, 0); pan.scale.z = 0.7; pan.material = mV; pan.material.side = THREE.DoubleSide;
      os.pan = pan;
    }
    var cou = pivot("cou", buste, 0, 0.57 * s, 0);
    piece(cou, new THREE.CylinderGeometry(0.05 * s, 0.055 * s, 0.1 * s, 8), mP, 0, 0.04 * s, 0);
    var tete = pivot("tete", cou, 0, 0.09 * s, 0);
    var crane = piece(tete, new THREE.SphereGeometry(0.105 * s, 16, 12), mP, 0, 0.1 * s, 0.005); crane.scale.set(0.92, 1.1, 1);
    // les cheveux : une calotte sombre, à l'arrière
    var gCh = new THREE.SphereGeometry(0.11 * s, 14, 10, 0, PI * 2, 0, PI * (o.femme ? 0.75 : 0.55));
    var ch = piece(tete, gCh, mC, 0, 0.115 * s, -0.012); ch.rotation.x = -0.35; ch.scale.set(0.95, 1.08, 1.05);
    if (o.femme) { var queue = piece(tete, new THREE.CylinderGeometry(0.06 * s, 0.03 * s, 0.22 * s, 8), mC, 0, 0.0, -0.09 * s); queue.rotation.x = 0.25; }
    if (o.casquette) {
      piece(tete, new THREE.CylinderGeometry(0.11 * s, 0.112 * s, 0.07 * s, 16), mV2, 0, 0.19 * s, 0);
      var vis = piece(tete, new THREE.BoxGeometry(0.17 * s, 0.012 * s, 0.11 * s), mV2, 0, 0.165 * s, 0.1 * s); vis.rotation.x = 0.12;
    }
    if (o.echarpe) {
      var mE = matTissu(noir || o.echarpe);
      piece(cou, new THREE.TorusGeometry(0.075 * s, 0.03 * s, 8, 16), mE, 0, 0.0, 0.0).rotation.x = PI / 2;
      var bout = piece(buste, new THREE.BoxGeometry(0.08 * s, 0.34 * s, 0.025 * s), mE, 0.05 * s, 0.38 * s, 0.11 * s);
      bout.rotation.z = 0.08;
      os.echarpe = bout;
    }
    // les bras
    ["G", "D"].forEach(function (c, i) {
      var sg = i ? 1 : -1;
      var ep = pivot("epaule" + c, buste, sg * 0.205 * s * k, 0.52 * s, 0);
      piece(ep, new THREE.SphereGeometry(0.062 * s * k, 10, 8), mV, 0, 0, 0);
      piece(ep, new THREE.CapsuleGeometry(0.055 * s * k, 0.24 * s, 4, 10), mV, 0, -0.15 * s, 0);
      var co = pivot("coude" + c, ep, 0, -0.3 * s, 0);
      piece(co, new THREE.CapsuleGeometry(0.047 * s * k, 0.22 * s, 4, 10), mV, 0, -0.13 * s, 0);
      var ma = pivot("main" + c, co, 0, -0.27 * s, 0);
      piece(ma, new THREE.SphereGeometry(0.045 * s, 8, 6), mP, 0, -0.03 * s, 0).scale.set(0.8, 1.2, 0.6);
    });
    if (o.cigarette) {
      var cig = piece(os.mainD, new THREE.CylinderGeometry(0.005 * s, 0.005 * s, 0.07 * s, 6), matTissu("#e8e2d0"), 0.02 * s, -0.05 * s, 0.04 * s, false);
      cig.rotation.x = PI / 2;
      var bout2 = new THREE.Mesh(new THREE.SphereGeometry(0.008 * s, 8, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color("#FF6A2A").multiplyScalar(4), toneMapped: false }));
      bout2.position.set(0.02 * s, -0.05 * s, 0.075 * s); os.mainD.add(bout2); os.braise = bout2;
      K.garder(bout2.geometry); K.garder(bout2.material);
    }
    // les jambes
    ["G", "D"].forEach(function (c, i) {
      var sg = i ? 1 : -1;
      var ha = pivot("hanche" + c, bassin, sg * 0.095 * s, -0.04 * s, 0);
      piece(ha, new THREE.CapsuleGeometry(0.075 * s, 0.33 * s, 4, 10), mV2, 0, -0.22 * s, 0);
      var ge = pivot("genou" + c, ha, 0, -0.45 * s, 0);
      piece(ge, new THREE.CapsuleGeometry(0.06 * s, 0.33 * s, 4, 10), mV2, 0, -0.21 * s, 0);
      var pi = pivot("pied" + c, ge, 0, -0.44 * s, 0);
      piece(pi, new THREE.BoxGeometry(0.1 * s, 0.07 * s, 0.25 * s), mC, 0, -0.02 * s, 0.05 * s);
    });
    racine.traverse(function (x) { if (x.isMesh) x.castShadow = true; });

    var graine = K.hash(o.graine || "mannequin") % 1000;
    var M = { groupe: racine, os: os, taille: s };
    function zero() {
      for (var n in os) if (os[n].rotation) os[n].rotation.set(0, 0, 0);
      os.bassin.position.y = 0.95 * s;
    }
    // le repos : respirer, porter le poids d'une jambe sur l'autre, regarder ailleurs
    M.repos = function (t) {
      zero();
      var g = graine;
      os.buste.rotation.x = 0.03 + Math.sin(t * 1.4 + g) * 0.012;
      os.bassin.rotation.z = K.fbm1(t * 0.15, g + 1) * 0.05;
      os.buste.rotation.z = -os.bassin.rotation.z * 0.6;
      os.tete.rotation.y = K.fbm1(t * 0.12, g + 2) * 0.35;
      os.tete.rotation.x = K.fbm1(t * 0.1, g + 3) * 0.08;
      os.epauleG.rotation.z = -0.06; os.epauleD.rotation.z = 0.06;
      os.coudeG.rotation.x = -0.12; os.coudeD.rotation.x = -0.12;
      os.genouG.rotation.x = 0.04 + Math.max(0, os.bassin.rotation.z) * 1.5; os.genouD.rotation.x = 0.04 + Math.max(0, -os.bassin.rotation.z) * 1.5;
      return M;
    };
    // la marche : le cycle des jambes, les bras à contretemps
    //  v en m/s (1,3 : marcher ; 2,8 : courir) → le pas
    M.marche = function (t, v) {
      zero();
      v = v || 1.3;
      var f = v / (1.45 * s), ph = t * f * PI * 2 + graine, sw = Math.min(0.55, 0.25 + v * 0.12);
      os.hancheG.rotation.x = Math.sin(ph) * sw; os.hancheD.rotation.x = -Math.sin(ph) * sw;
      os.genouG.rotation.x = Math.max(0, -Math.cos(ph)) * sw * 1.6 + 0.05; os.genouD.rotation.x = Math.max(0, Math.cos(ph)) * sw * 1.6 + 0.05;
      os.piedG.rotation.x = -Math.sin(ph) * 0.2; os.piedD.rotation.x = Math.sin(ph) * 0.2;
      os.epauleG.rotation.x = -Math.sin(ph) * sw * 0.8; os.epauleD.rotation.x = Math.sin(ph) * sw * 0.8;
      os.coudeG.rotation.x = -0.25 - Math.max(0, Math.sin(ph)) * 0.3; os.coudeD.rotation.x = -0.25 - Math.max(0, -Math.sin(ph)) * 0.3;
      os.bassin.position.y = 0.95 * s + Math.abs(Math.cos(ph)) * 0.025 * s;
      os.bassin.rotation.y = Math.sin(ph) * 0.08;
      os.buste.rotation.y = -Math.sin(ph) * 0.12; os.buste.rotation.x = 0.04 + v * 0.03;
      return M;
    };
    // fumer : la main monte à la bouche toutes les six secondes, la braise rougit
    M.fumer = function (t) {
      M.repos(t);
      var c = ((t + graine * 0.01) % 6.5) / 6.5, lev = K.cloche(0.05, 0.16, 0.34, 0.46, c);
      os.epauleD.rotation.x = -0.35 - lev * 1.15; os.epauleD.rotation.z = 0.15 + lev * 0.2;
      os.coudeD.rotation.x = -1.2 - lev * 0.9;
      os.tete.rotation.x = -lev * 0.1;
      if (os.braise) os.braise.material.color.set("#FF5A1E").multiplyScalar(2.5 + K.cloche(0.18, 0.24, 0.3, 0.4, c) * 9);
      return lev;
    };
    // les bras : deux angles (avant, côté) par bras, et le coude
    M.bras = function (gAvant, gCote, dAvant, dCote, coude) {
      os.epauleG.rotation.x = -gAvant; os.epauleG.rotation.z = -gCote;
      os.epauleD.rotation.x = -dAvant; os.epauleD.rotation.z = dCote;
      os.coudeG.rotation.x = -(coude == null ? 0.2 : coude); os.coudeD.rotation.x = -(coude == null ? 0.2 : coude);
      return M;
    };
    // lever un masque devant son visage (k de 0 à 1)
    M.leverMasque = function (t, k) {
      M.repos(t);
      var a = K.lisse(0, 1, k);
      M.bras(0.35 + a * 1.35, 0.1, 0.35 + a * 1.35, 0.1, 0.5 + a * 1.25);
      os.tete.rotation.y *= 1 - a; os.tete.rotation.x = -0.05 * a;
      return M;
    };
    // tirer (une bâche, une corde) : penché, les bras devant, un pas en arrière
    M.tirer = function (t, effort) {
      zero();
      var e = effort == null ? 1 : effort, b = Math.sin(t * 2.2 + graine) * 0.06 * e;
      os.buste.rotation.x = 0.35 * e + b;
      os.hancheG.rotation.x = -0.4 * e; os.hancheD.rotation.x = 0.25 * e;
      os.genouG.rotation.x = 0.55 * e; os.genouD.rotation.x = 0.2 * e;
      M.bras(1.1 + b, 0.15, 1.1 - b, 0.15, 0.3);
      os.tete.rotation.x = -0.25 * e;
      return M;
    };
    // le salut : un bras levé qui bouge
    M.salut = function (t) {
      M.repos(t);
      os.epauleD.rotation.z = 2.6; os.epauleD.rotation.x = -0.2;
      os.coudeD.rotation.x = -0.4; os.coudeD.rotation.z = Math.sin(t * 7) * 0.35;
      return M;
    };
    // assis : sur un banc, un siège de tribune
    M.assis = function (t) {
      M.repos(t);
      os.bassin.position.y = 0.48 * s;
      os.hancheG.rotation.x = os.hancheD.rotation.x = -PI / 2 + 0.08;
      os.genouG.rotation.x = os.genouD.rotation.x = PI / 2 - 0.1;
      os.buste.rotation.x = 0.08;
      M.bras(0.55, 0.05, 0.55, 0.05, 0.9);
      return M;
    };
    M.repos(0);
    return M;
  }

  // ─── LA FOULE : des places, une silhouette instanciée par place
  //  o = { places: [{ x, y, z, ry }], debout: bool, couleurs: [...], echarpes: '#7A1F2E',
  //        masque: texture | null, vague: { t0, duree, origine: [x, z], vitesse }, graine }
  // → Group, avec maj(t) ; places[i].leve (le temps où la personne lève son masque) se
  //   calcule de la vague : t0 + distance(place, origine) / vitesse (+ un rien de hasard)
  function foule(o) {
    o = o || {};
    // sur un téléphone, la foule s'éclaircit (K.qualite.foule : la part gardée, tirée de la graine) ;
    // les places gardées sont dans groupe.places (c'est elles qu'il faut animer)
    var kq = (K.qualite && K.qualite.foule) || 1, graineF = K.hash(o.graine || "foule") % 997;
    var THREE = T(), places = (o.places || []).filter(function (p, i) { return kq >= 1 || K.h01(i, graineF) < kq; }), n = places.length, r = K.alea(o.graine || "foule");
    var debout = o.debout !== false;
    // la silhouette, en une géométrie : le corps (0), le bras gauche (1), le bras droit (2)
    function partie(geo, part, tx, ty, tz, sx, sy, sz) {
      geo.scale(sx || 1, sy || 1, sz || 1); geo.translate(tx, ty, tz);
      var c = geo.attributes.position.count, a = new Float32Array(c); a.fill(part);
      geo.setAttribute("aPart", new THREE.BufferAttribute(a, 1));
      return geo.index ? geo.toNonIndexed() : geo;
    }
    var morceaux = [];
    var h0 = debout ? 0 : -0.42;
    // ~80 triangles la personne (trois mille font 240 000) : à vingt pixels de haut, une
    // silhouette n'a pas besoin de plus ; les bouts cachés (le dessous, les fonds) n'en ont pas
    morceaux.push(partie(new THREE.CylinderGeometry(0.19, 0.15, 0.6, 6, 1, true), 0, 0, 1.25 + h0, 0, 1, 1, 0.62));
    morceaux.push(partie(new THREE.CylinderGeometry(0.19 * 0.62, 0.19, 0.06, 6, 1, true), 0, 0, 1.58 + h0, 0, 1, 1, 0.62));
    morceaux.push(partie(new THREE.SphereGeometry(0.11, 6, 4), 0, 0, 1.68 + h0, 0, 0.92, 1.1, 1));
    morceaux.push(partie(new THREE.CylinderGeometry(0.14, 0.17, debout ? 0.92 : 0.5, 5, 1, true), 0, 0, (debout ? 0.48 : 0.62) + h0, 0, 1, 1, 0.7));
    // les bras pendent le long du corps ; le pivot (l'épaule) est à (±0.2, 1.5)
    morceaux.push(partie(new THREE.CylinderGeometry(0.05, 0.045, 0.56, 4, 1, true), 1, -0.215, 1.24 + h0, 0.0));
    morceaux.push(partie(new THREE.CylinderGeometry(0.05, 0.045, 0.56, 4, 1, true), 2, 0.215, 1.24 + h0, 0.0));
    var geo = fusion(morceaux);
    geo.computeVertexNormals();
    var mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, metalness: 0 });
    var U = { uT: { value: 0 }, uLeve: { value: (o.vague && o.vague.duree) || 0.7 }, uEpauleY: { value: 1.5 + h0 } };
    mat.onBeforeCompile = function (sh) {
      for (var k in U) sh.uniforms[k] = U[k];
      sh.vertexShader = sh.vertexShader.replace("#include <common>", [
        "#include <common>", "attribute float aPart; attribute vec4 aInfo; uniform float uT, uLeve, uEpauleY;",
        "mat3 rotX(float a){ float c = cos(a), s = sin(a); return mat3(1.0,0.0,0.0, 0.0,c,s, 0.0,-s,c); }",
        "mat3 rotZ(float a){ float c = cos(a), s = sin(a); return mat3(c,s,0.0, -s,c,0.0, 0.0,0.0,1.0); }"
      ].join("\n")).replace("#include <beginnormal_vertex>", [
        "float leveK = smoothstep(aInfo.y, aInfo.y + uLeve, uT);",
        "float balance = sin(uT * (1.1 + aInfo.x * 0.8) + aInfo.x * 40.0) * (0.03 + 0.05 * aInfo.w);",
        "mat3 Rb = rotZ(balance) * rotX(sin(uT * 0.9 + aInfo.x * 17.0) * 0.02);",
        "float angle = -leveK * 2.35;",
        "mat3 Ra = rotX(angle) * rotZ((aPart > 1.5 ? -1.0 : 1.0) * leveK * 0.22);",
        "vec3 objectNormal = vec3(normal);",
        "if (aPart > 0.5) objectNormal = Ra * objectNormal;",
        "objectNormal = Rb * objectNormal;",
        "#ifdef USE_TANGENT\n vec3 objectTangent = vec3(tangent.xyz);\n#endif"
      ].join("\n")).replace("#include <begin_vertex>", [
        "vec3 transformed = vec3(position);",
        "if (aPart > 0.5) { vec3 piv = vec3(aPart > 1.5 ? 0.2 : -0.2, uEpauleY, 0.0); transformed = Ra * (transformed - piv) + piv; }",
        "transformed = Rb * transformed;",
        "transformed *= vec3(1.0, aInfo.z, 1.0);"
      ].join("\n"));
    };
    K.garder(mat); K.garder(geo);
    var im = new THREE.InstancedMesh(geo, mat, Math.max(1, n));
    var info = new Float32Array(Math.max(1, n) * 4), d = new THREE.Object3D(), col = new THREE.Color();
    var cols = o.couleurs || ["#1a1b20", "#23242a", "#2c2a28", "#15161a", "#2a2f38", "#3a2a26"];
    var v = o.vague || { t0: 1e9, duree: 0.7, origine: [0, 0], vitesse: 20 };
    places.forEach(function (p, i) {
      d.position.set(p.x, p.y, p.z); d.rotation.set(0, p.ry || 0, 0);
      var sc = 0.92 + r() * 0.16; d.scale.set(sc, sc, sc);
      d.updateMatrix(); im.setMatrixAt(i, d.matrix);
      col.set(r() < (o.partEcharpes == null ? 0.18 : o.partEcharpes) ? (o.echarpes || "#5a1822") : r.choix(cols));
      im.setColorAt(i, col);
      var dist = Math.hypot(p.x - v.origine[0], p.z - v.origine[1]);
      p.leve = v.t0 + dist / (v.vitesse || 20) + r() * (v.desordre == null ? 0.35 : v.desordre);
      info[i * 4] = r(); info[i * 4 + 1] = p.leve; info[i * 4 + 2] = 0.9 + r() * 0.2; info[i * 4 + 3] = r();
    });
    im.count = n;
    geo.setAttribute("aInfo", new THREE.InstancedBufferAttribute(info, 4));
    im.instanceMatrix.needsUpdate = true;
    if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.castShadow = false; im.receiveShadow = false; im.frustumCulled = false;
    var groupe = new THREE.Group();
    groupe.add(im);
    // les masques : un quadrilatère par personne, sur les genoux, puis devant le visage
    var masques = null;
    if (o.masque) {
      var gq = new THREE.PlaneGeometry(0.3, 0.36);
      var mm = new THREE.MeshStandardMaterial({ map: o.masque, alphaTest: 0.4, side: THREE.DoubleSide, roughness: 0.85, metalness: 0, emissive: new THREE.Color("#ffffff"), emissiveMap: o.masque, emissiveIntensity: o.lueurMasques == null ? 0.06 : o.lueurMasques });
      mm.onBeforeCompile = function (sh) {
        for (var k in U) sh.uniforms[k] = U[k];
        sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nattribute vec4 aInfo; uniform float uT, uLeve, uEpauleY;")
          .replace("#include <begin_vertex>", [
            "float leveK = smoothstep(aInfo.y, aInfo.y + uLeve, uT);",
            "vec3 transformed = vec3(position);",
            "float bas = uEpauleY - 0.42, haut = uEpauleY + 0.17;",
            "float pench = mix(-1.25, 0.0, leveK);",
            "float c = cos(pench), s = sin(pench); transformed = vec3(transformed.x, transformed.y * c - transformed.z * s, transformed.y * s + transformed.z * c);",
            "float balance = sin(uT * (1.1 + aInfo.x * 0.8) + aInfo.x * 40.0) * (0.03 + 0.05 * aInfo.w);",
            "transformed += vec3(sin(balance) * (haut - 0.2), mix(bas, haut, leveK), mix(0.26, 0.17, leveK));",
            "transformed.y *= aInfo.z;"
          ].join("\n"));
      };
      K.garder(mm); K.garder(gq);
      gq.setAttribute("aInfo", new THREE.InstancedBufferAttribute(info, 4));
      masques = new THREE.InstancedMesh(gq, mm, Math.max(1, n));
      for (var i = 0; i < n; i++) { im.getMatrixAt(i, d.matrix); masques.setMatrixAt(i, d.matrix); }
      masques.count = n; masques.instanceMatrix.needsUpdate = true; masques.frustumCulled = false;
      groupe.add(masques);
    }
    groupe.maj = function (t) { U.uT.value = t; };
    groupe.places = places;
    groupe.corps = im; groupe.masques = masques;
    return groupe;
  }

  // fusionner des géométries non indexées qui ont les mêmes attributs
  function fusion(geos) {
    var THREE = T(), noms = Object.keys(geos[0].attributes), out = new THREE.BufferGeometry();
    noms.forEach(function (nom) {
      var it = geos[0].attributes[nom].itemSize, tot = 0;
      geos.forEach(function (g) { tot += g.attributes[nom].count; });
      var a = new Float32Array(tot * it), o2 = 0;
      geos.forEach(function (g) { a.set(g.attributes[nom].array, o2); o2 += g.attributes[nom].array.length; });
      out.setAttribute(nom, new THREE.BufferAttribute(a, it));
    });
    return out;
  }

  K.gens = { mannequin: mannequin, foule: foule, fusion: fusion };
})(typeof window !== "undefined" ? window : this);
