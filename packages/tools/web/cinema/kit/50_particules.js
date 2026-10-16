/* ═══════════════════════════════════════════════════════════════════════════
   LA TROUSSE DU CINÉMA — 50 : les particules.

   Aucune particule n'a d'état : sa place se calcule dans le shader, de sa
   graine et de `t` (le temps du film). Revenir en arrière, sauter, tourner
   image par image : la pluie tombe pareil. Toutes s'accrochent à un volume
   (`zone`, une boîte) qu'elles remplissent en boucle ; un volume qui suit la
   caméra (`suivre: true`) garde ses gouttes à leur place dans le monde (les
   gouttes ne glissent pas quand la caméra bouge).

     K.particules.pluie(o)      des traits qui tombent, plus clairs dans la lumière
     K.particules.neige(o)      des flocons qui dérivent
     K.particules.poussiere(o)  ce qui flotte dans un faisceau
     K.particules.fumee(o)      une fumée qui monte (un fumigène, une cheminée)
     K.particules.etincelles(o) des étincelles en gerbe
     K.particules.confettis(o)  des confettis, des papiers (o.papier : des feuilles)
     K.particules.ronds(o)      les ronds de la pluie sur une flaque
   Chacune rend un Mesh (à ajouter à la scène) avec `maj(t, camera)`.
   Le nombre se règle par la qualité (K.qualite.particules).
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var K = global.FusibleCinema.kit;
  var T = K.T;
  var NL = 4;   // les lumières qui éclairent les particules

  function nombre(n) { return Math.max(8, Math.round(n * ((K.qualite && K.qualite.particules) || 1))); }

  // la géométrie commune : un quadrilatère (x ∈ [-0,5 ; 0,5], y ∈ [0 ; 1]) instancié n fois,
  // chaque instance avec sa graine (trois nombres de [0, 1))
  function geometrie(n, graine) {
    var THREE = T();
    var g = new THREE.InstancedBufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-0.5, 0, 0, 0.5, 0, 0, 0.5, 1, 0, -0.5, 1, 0]), 3));
    g.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), 2));
    g.setIndex([0, 1, 2, 0, 2, 3]);
    var a = new Float32Array(n * 4), r = K.alea(graine || "particules");
    for (var i = 0; i < n * 4; i++) a[i] = r();
    g.setAttribute("aGraine", new THREE.InstancedBufferAttribute(a, 4));
    g.instanceCount = n;
    K.garder(g);
    return g;
  }
  function uniformesLumieres(lumieres) {
    var THREE = T(), pos = [], coul = [], ray = [];
    for (var i = 0; i < NL; i++) {
      var l = (lumieres || [])[i];
      pos.push(new THREE.Vector3().fromArray(l ? l.pos : [0, -999, 0]));
      coul.push(new THREE.Color(l ? l.couleur : "#000000").multiplyScalar(l ? (l.intensite == null ? 1 : l.intensite) : 0));
      ray.push(l ? (l.rayon || 6) : 1);
    }
    return { uLumPos: { value: pos }, uLumCoul: { value: coul }, uLumRayon: { value: ray } };
  }
  var GLSL_COMMUN = [
    "uniform float uT; uniform vec3 uMin, uMax, uCentre; uniform float uSuivre;",
    "uniform vec3 uLumPos[" + NL + "]; uniform vec3 uLumCoul[" + NL + "]; uniform float uLumRayon[" + NL + "];",
    "attribute vec4 aGraine;",
    // ramener un point dans la boîte (centrée sur uCentre si elle suit la caméra)
    "vec3 boite(vec3 p){ vec3 t = uMax - uMin; vec3 o = mix(uMin, uCentre - t * 0.5, uSuivre); return o + mod(p - o, t); }",
    "vec3 eclairage(vec3 p){ vec3 c = vec3(0.0); for (int i = 0; i < " + NL + "; i++){ float d = length(p - uLumPos[i]) / uLumRayon[i]; c += uLumCoul[i] / (1.0 + d * d * 4.0) * (1.0 - smoothstep(0.7, 1.0, d)); } return c; }"
  ].join("\n");

  function materiau(o, vertex, fragment, extra) {
    var THREE = T();
    var u = {
      uT: { value: 0 }, uMin: { value: new THREE.Vector3().fromArray(o.zone ? o.zone.min : [-10, 0, -10]) },
      uMax: { value: new THREE.Vector3().fromArray(o.zone ? o.zone.max : [10, 10, 10]) },
      uCentre: { value: new THREE.Vector3() }, uSuivre: { value: o.suivre ? 1 : 0 },
      uCouleur: { value: new THREE.Color(o.couleur || "#9FB4D0") }, uOpacite: { value: o.opacite == null ? 1 : o.opacite },
      uCarte: { value: o.texture || null }
    };
    var ul = uniformesLumieres(o.lumieres);
    for (var k in ul) u[k] = ul[k];
    for (var k2 in (extra || {})) u[k2] = extra[k2];
    // Jamais de couleur négative : avec le MSAA, un fragment au bord d'un trait fin lit
    // des varyings extrapolés (une UV hors de [0, 1]) ; dans une cible en demi-flottants,
    // rien ne la borne, et une goutte additive ASSOMBRIRAIT l'image (des points noirs).
    var frag = fragment.replace("void main()", "void principal()") +
      "\nvoid main(){ principal(); gl_FragColor = vec4(max(gl_FragColor.rgb, vec3(0.0)), clamp(gl_FragColor.a, 0.0, 1.0)); }";
    var m = new THREE.ShaderMaterial({
      uniforms: u, vertexShader: GLSL_COMMUN + "\n" + vertex, fragmentShader: frag,
      transparent: true, depthWrite: false, blending: o.normal ? THREE.NormalBlending : THREE.AdditiveBlending,
      side: THREE.DoubleSide, fog: false
    });
    K.garder(m);
    return m;
  }
  function mesh(g, m, o) {
    var THREE = T(), x = new THREE.Mesh(g, m);
    x.frustumCulled = false; x.renderOrder = o.ordre == null ? 3 : o.ordre;
    x.name = "particules:" + (o.graine || "");
    var v = new THREE.Vector3(), d = new THREE.Vector3();
    x.maj = function (t, camera) {
      m.uniforms.uT.value = t;
      if (camera && o.suivre) {
        camera.getWorldPosition(v); camera.getWorldDirection(d);
        m.uniforms.uCentre.value.copy(v).addScaledVector(d, o.avance || 0);
      }
    };
    x.lumieres = function (l) { var ul = uniformesLumieres(l); m.uniforms.uLumPos.value = ul.uLumPos.value; m.uniforms.uLumCoul.value = ul.uLumCoul.value; m.uniforms.uLumRayon.value = ul.uLumRayon.value; };
    x.materiau = m;
    return x;
  }

  // ─── LA PLUIE : un trait par goutte, tourné vers la caméra autour de sa chute
  //  o = { n, zone, suivre, avance, vitesse: [x, y, z] m/s, longueur, largeur, couleur, opacite, lumieres }
  function pluie(o) {
    o = o || {};
    var n = nombre(o.n || 6000), v = o.vitesse || [0.6, -9, 0.3];
    var m = materiau(o, [
      "uniform vec3 uVit; uniform float uLong, uLarg; varying float vA; varying vec3 vL; varying vec2 vUv;",
      "void main(){",
      "  vec3 t = uMax - uMin;",
      "  vec3 p = uMin + aGraine.xyz * t + uVit * (uT * (0.85 + 0.3 * aGraine.w));",
      "  p = boite(p);",
      "  vec3 dir = normalize(uVit); vec3 vc = normalize(cameraPosition - p);",
      "  vec3 cote = normalize(cross(dir, vc));",
      "  float lo = uLong * (0.7 + 0.6 * aGraine.w);",
      // une goutte proche n'est pas plus épaisse qu'une goutte lointaine : elle est plus nette.
      // La largeur est celle d'un trait vu à 5 m et plus ; en deçà, elle s'amincit.
      "  float larg = uLarg * clamp(length(cameraPosition - p) / 5.0, 0.22, 1.0);",
      "  vec3 w = p + cote * position.x * larg - dir * position.y * lo;",
      "  vec4 mv = viewMatrix * vec4(w, 1.0);",
      "  float d = -mv.z;",
      "  vA = smoothstep(0.6, 1.6, d) * (1.0 - smoothstep(t.z * 0.45, t.z * 0.6, length(p - mix(uMin + t * 0.5, uCentre, uSuivre))));",
      "  vL = eclairage(p); vUv = uv;",
      "  gl_Position = projectionMatrix * mv;",
      // trop près de l'objectif, une goutte couvrirait l'écran pour rien : elle sort du cadre
      "  if (d < 0.6) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);",
      "}"
    ].join("\n"), [
      "uniform vec3 uCouleur; uniform float uOpacite; varying float vA; varying vec3 vL; varying vec2 vUv;",
      "void main(){ float a = (1.0 - abs(vUv.x - 0.5) * 2.0) * smoothstep(0.0, 0.3, vUv.y) * (1.0 - smoothstep(0.85, 1.0, vUv.y));",
      "  gl_FragColor = vec4((uCouleur * 0.12 + vL) * a * vA * uOpacite, 1.0); }"
    ].join("\n"), { uVit: { value: new (T().Vector3)().fromArray(v) }, uLong: { value: o.longueur || 0.45 }, uLarg: { value: o.largeur || 0.012 } });
    return mesh(geometrie(n, o.graine || "pluie"), m, o);
  }

  // ─── LA NEIGE : des flocons ronds qui dérivent
  function neige(o) {
    o = o || {};
    var n = nombre(o.n || 3000);
    var m = materiau(o, [
      "uniform float uTaille, uChute; varying float vA; varying vec3 vL; varying vec2 vUv;",
      "void main(){",
      "  vec3 t = uMax - uMin; float s = 0.6 + aGraine.w;",
      "  vec3 p = uMin + aGraine.xyz * t + vec3(sin(uT * 0.7 + aGraine.w * 40.0) * 0.35, -uChute * s * uT, cos(uT * 0.5 + aGraine.x * 30.0) * 0.3);",
      "  p = boite(p);",
      "  vec4 mv = viewMatrix * vec4(p, 1.0); mv.xy += (position.xy - vec2(0.0, 0.5)) * uTaille * s;",
      "  vA = smoothstep(0.2, 1.0, -mv.z); vL = eclairage(p); vUv = uv;",
      "  gl_Position = projectionMatrix * mv;",
      "}"
    ].join("\n"), [
      "uniform vec3 uCouleur; uniform float uOpacite; varying float vA; varying vec3 vL; varying vec2 vUv;",
      "void main(){ float r = length(vUv - 0.5) * 2.0; float a = 1.0 - smoothstep(0.4, 1.0, r);",
      "  gl_FragColor = vec4((uCouleur * 0.5 + vL) * a * vA * uOpacite, 1.0); }"
    ].join("\n"), { uTaille: { value: o.taille || 0.035 }, uChute: { value: o.chute || 0.9 } });
    return mesh(geometrie(n, o.graine || "neige"), m, o);
  }

  // ─── LA POUSSIÈRE : des points qui flottent, qu'on ne voit que dans la lumière
  function poussiere(o) {
    o = o || {};
    var n = nombre(o.n || 1500);
    var m = materiau(o, [
      "uniform float uTaille; varying float vA; varying vec3 vL; varying vec2 vUv;",
      "void main(){",
      "  vec3 t = uMax - uMin;",
      "  vec3 p = uMin + aGraine.xyz * t + vec3(sin(uT * 0.21 + aGraine.w * 50.0), sin(uT * 0.13 + aGraine.x * 40.0) * 0.6 + uT * 0.02, cos(uT * 0.17 + aGraine.y * 60.0)) * 0.25;",
      "  p = boite(p);",
      "  vec4 mv = viewMatrix * vec4(p, 1.0); mv.xy += (position.xy - vec2(0.0, 0.5)) * uTaille * (0.5 + aGraine.w);",
      "  vA = smoothstep(0.1, 0.6, -mv.z) * (0.5 + 0.5 * sin(uT * 2.0 + aGraine.w * 90.0)); vL = eclairage(p); vUv = uv;",
      "  gl_Position = projectionMatrix * mv;",
      "}"
    ].join("\n"), [
      "uniform vec3 uCouleur; uniform float uOpacite; varying float vA; varying vec3 vL; varying vec2 vUv;",
      "void main(){ float r = length(vUv - 0.5) * 2.0; float a = 1.0 - smoothstep(0.2, 1.0, r);",
      "  gl_FragColor = vec4((uCouleur * 0.05 + vL) * a * vA * uOpacite, 1.0); }"
    ].join("\n"), { uTaille: { value: o.taille || 0.012 } });
    return mesh(geometrie(n, o.graine || "poussiere"), m, o);
  }

  // ─── LA FUMÉE : des bouffées qui montent, s'élargissent et s'effacent. Teinte de la
  // couleur de la source près d'elle (un fumigène rouge), grise au-dessus.
  //  o = { n, source: [x, y, z], vent: [x, z], montee, vie, taille, couleur, lueur, opacite, etalement }
  function fumee(o) {
    o = o || {};
    var THREE = T(), n = nombre(o.n || 70);
    var src = o.source || [0, 0, 0], vent = o.vent || [0.4, 0.1];
    var m = materiau(Object.assign({}, o, { normal: true, texture: K.tex.fumee({}) }), [
      "uniform vec3 uSrc; uniform vec2 uVent; uniform float uMontee, uVie, uTaille, uEtal; varying float vA; varying vec2 vUv; varying float vAge; varying vec3 vL;",
      "void main(){",
      "  float ph = fract(uT / uVie + aGraine.w);",
      "  float age = ph;",
      "  vec3 p = uSrc + vec3((aGraine.x - 0.5) * uEtal + uVent.x * age * uVie, uMontee * age * uVie * (0.7 + 0.6 * aGraine.y), (aGraine.z - 0.5) * uEtal + uVent.y * age * uVie);",
      "  float s = uTaille * (0.35 + age * 1.9) * (0.7 + 0.6 * aGraine.x);",
      "  float rot = aGraine.y * 6.28 + uT * (aGraine.z - 0.5) * 0.6;",
      "  vec2 q = (position.xy - vec2(0.0, 0.5)); q = mat2(cos(rot), -sin(rot), sin(rot), cos(rot)) * q;",
      "  vec4 mv = viewMatrix * vec4(p, 1.0); mv.xy += q * s;",
      "  vA = smoothstep(0.0, 0.08, age) * (1.0 - smoothstep(0.55, 1.0, age)); vAge = age; vUv = uv; vL = eclairage(p);",
      "  gl_Position = projectionMatrix * mv;",
      "}"
    ].join("\n"), [
      "uniform sampler2D uCarte; uniform vec3 uCouleur, uLueur; uniform float uOpacite; varying float vA; varying vec2 vUv; varying float vAge; varying vec3 vL;",
      "void main(){ float a = texture2D(uCarte, vUv).a * vA * uOpacite;",
      "  vec3 c = mix(uLueur, uCouleur, smoothstep(0.0, 0.45, vAge)) + vL * 0.35;",
      "  gl_FragColor = vec4(c, a); }"
    ].join("\n"), {
      uSrc: { value: new THREE.Vector3().fromArray(src) }, uVent: { value: new THREE.Vector2(vent[0], vent[1]) }, uMontee: { value: o.montee || 0.6 },
      uVie: { value: o.vie || 6 }, uTaille: { value: o.taille || 1.2 }, uEtal: { value: o.etalement || 0.4 },
      uLueur: { value: new THREE.Color(o.lueur || o.couleur || "#888888") }
    });
    var x = mesh(geometrie(n, o.graine || "fumee"), m, Object.assign({ ordre: 7 }, o));
    x.source = function (p) { m.uniforms.uSrc.value.fromArray(p); };
    return x;
  }

  // ─── LES ÉTINCELLES : une gerbe qui retombe (la meuleuse, le feu de palettes)
  function etincelles(o) {
    o = o || {};
    var THREE = T(), n = nombre(o.n || 300), src = o.source || [0, 0, 0];
    var m = materiau(o, [
      "uniform vec3 uSrc, uDir; uniform float uVie, uForce; varying float vA; varying vec2 vUv;",
      "void main(){",
      "  float ph = fract(uT / uVie + aGraine.w); float tt = ph * uVie;",
      "  vec3 v = normalize(uDir + (aGraine.xyz - 0.5) * 1.6) * uForce * (0.5 + aGraine.y);",
      "  vec3 p = uSrc + v * tt + vec3(0.0, -4.9, 0.0) * tt * tt;",
      "  vec3 vel = normalize(v + vec3(0.0, -9.8, 0.0) * tt + vec3(1e-4));",
      "  vec3 vc = normalize(cameraPosition - p); vec3 cote = normalize(cross(vel, vc));",
      "  vec3 w = p + cote * position.x * 0.012 - vel * position.y * 0.09;",
      "  vA = 1.0 - smoothstep(0.3, 1.0, ph); vUv = uv;",
      "  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);",
      "}"
    ].join("\n"), [
      "uniform vec3 uCouleur; uniform float uOpacite; varying float vA; varying vec2 vUv;",
      "void main(){ float a = (1.0 - abs(vUv.x - 0.5) * 2.0); gl_FragColor = vec4(uCouleur * 3.0 * a * vA * uOpacite, 1.0); }"
    ].join("\n"), { uSrc: { value: new THREE.Vector3().fromArray(src) }, uDir: { value: new THREE.Vector3().fromArray(o.direction || [0, 1, 0]) }, uVie: { value: o.vie || 1.4 }, uForce: { value: o.force || 4 } });
    return mesh(geometrie(n, o.graine || "etincelles"), m, Object.assign({}, o, { couleur: o.couleur || "#FFB060" }));
  }

  // ─── LES CONFETTIS ET LES PAPIERS : des carrés qui tournoient en tombant
  //  o = { n, zone, papier: bool (des feuilles), couleurs: [..] (4 au plus), taille }
  function confettis(o) {
    o = o || {};
    var THREE = T(), n = nombre(o.n || (o.papier ? 120 : 1500)), cols = (o.couleurs || ["#F2E8CE", "#7A1F2E", "#8E8C86", "#FF5A4E"]).slice(0, 4);
    while (cols.length < 4) cols.push(cols[0]);
    var m = materiau(Object.assign({}, o, { normal: true }), [
      "uniform float uTaille, uChute; uniform vec3 uCols[4]; varying vec3 vC; varying vec2 vUv; varying float vA;",
      "void main(){",
      "  vec3 t = uMax - uMin; float s = uTaille * (0.6 + aGraine.w * 0.8);",
      "  vec3 p = uMin + aGraine.xyz * t + vec3(sin(uT * 1.3 + aGraine.w * 30.0) * 0.4, -uChute * (0.6 + aGraine.y * 0.8) * uT, cos(uT * 1.1 + aGraine.z * 20.0) * 0.4);",
      "  p = boite(p);",
      "  float a1 = uT * (2.0 + aGraine.x * 5.0) + aGraine.y * 6.28, a2 = uT * (1.5 + aGraine.z * 4.0);",
      "  vec3 q = vec3(position.x, position.y - 0.5, 0.0) * s;",
      "  q = vec3(q.x, q.y * cos(a1), q.y * sin(a1)); q = vec3(q.x * cos(a2) - q.z * sin(a2), q.y, q.x * sin(a2) + q.z * cos(a2));",
      "  int k = int(floor(aGraine.w * 3.999)); vC = uCols[0]; if (k == 1) vC = uCols[1]; if (k == 2) vC = uCols[2]; if (k == 3) vC = uCols[3];",
      "  vC *= 0.35 + 0.65 * abs(cos(a1)); vC += eclairage(p) * 0.6; vUv = uv; vA = 1.0;",
      "  gl_Position = projectionMatrix * viewMatrix * vec4(p + q, 1.0);",
      "}"
    ].join("\n"), [
      "uniform float uOpacite; varying vec3 vC; varying vec2 vUv; varying float vA;",
      "void main(){ gl_FragColor = vec4(vC, uOpacite * vA); }"
    ].join("\n"), { uTaille: { value: o.taille || (o.papier ? 0.3 : 0.05) }, uChute: { value: o.chute || (o.papier ? 0.5 : 1.1) },
      uCols: { value: cols.map(function (c) { return new THREE.Color(c); }) } });
    return mesh(geometrie(n, o.graine || "confettis"), m, Object.assign({ ordre: 2 }, o));
  }

  // ─── LES RONDS DANS LES FLAQUES : la pluie qui frappe le sol
  //  o = { n, zone (min.y = le sol), periode, rayon, couleur, lumieres }
  function ronds(o) {
    o = o || {};
    var THREE = T(), n = nombre(o.n || 400);
    var m = materiau(o, [
      "uniform float uPeriode, uRayon; varying float vA; varying vec2 vUv; varying vec3 vL;",
      "float h1(float n){ return fract(sin(n) * 43758.5453); }",
      "void main(){",
      "  float per = uPeriode * (0.7 + 0.6 * aGraine.w); float c = floor(uT / per + aGraine.x); float ph = fract(uT / per + aGraine.x);",
      "  vec3 t = uMax - uMin;",
      "  vec3 p = vec3(uMin.x + h1(c * 12.9 + aGraine.y * 91.0) * t.x, uMin.y + 0.005, uMin.z + h1(c * 7.3 + aGraine.z * 53.0) * t.z);",
      "  float r = uRayon * (0.3 + ph);",
      "  vec3 w = p + vec3(position.x * 2.0 * r, 0.0, (position.y - 0.5) * 2.0 * r);",
      "  vA = 1.0 - ph; vUv = uv; vL = eclairage(p);",
      "  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);",
      "}"
    ].join("\n"), [
      "uniform vec3 uCouleur; uniform float uOpacite; varying float vA; varying vec2 vUv; varying vec3 vL;",
      "void main(){ float d = length(vUv - 0.5) * 2.0; float a = smoothstep(0.75, 0.9, d) * (1.0 - smoothstep(0.9, 1.0, d));",
      "  gl_FragColor = vec4((uCouleur * 0.2 + vL * 0.8) * a * vA * uOpacite, 1.0); }"
    ].join("\n"), { uPeriode: { value: o.periode || 0.7 }, uRayon: { value: o.rayon || 0.07 } });
    return mesh(geometrie(n, o.graine || "ronds"), m, o);
  }

  // ─── LES GOUTTES QUI TOMBENT D'UN BORD (une gouttière, le bas d'un masque mouillé)
  //  o = { points: [[x, y, z], …], chute, vie }
  function egouttures(o) {
    o = o || {};
    var THREE = T(), pts = o.points || [[0, 2, 0]], n = pts.length * (o.parPoint || 3);
    var g = geometrie(n, o.graine || "egout");
    var src = new Float32Array(n * 3);
    for (var i = 0; i < n; i++) { var p = pts[i % pts.length]; src[i * 3] = p[0]; src[i * 3 + 1] = p[1]; src[i * 3 + 2] = p[2]; }
    g.setAttribute("aSrc", new THREE.InstancedBufferAttribute(src, 3));
    var m = materiau(o, [
      "attribute vec3 aSrc; uniform float uChute, uVie; varying float vA; varying vec2 vUv; varying vec3 vL;",
      "void main(){",
      "  float ph = fract(uT / uVie + aGraine.w); float tt = max(0.0, ph - 0.55) * uVie;",
      "  vec3 p = aSrc + vec3(0.0, -0.5 * 9.8 * tt * tt, 0.0);",
      "  vec3 vc = normalize(cameraPosition - p); vec3 cote = normalize(cross(vec3(0.0, 1.0, 0.0), vc));",
      "  float lo = 0.01 + tt * 0.25;",
      "  vec3 w = p + cote * position.x * 0.006 + vec3(0.0, position.y * lo, 0.0);",
      "  vA = smoothstep(0.4, 0.56, ph) * (1.0 - smoothstep(uChute * 0.9, uChute, aSrc.y - p.y)); vUv = uv; vL = eclairage(p);",
      "  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);",
      "}"
    ].join("\n"), [
      "uniform vec3 uCouleur; uniform float uOpacite; varying float vA; varying vec2 vUv; varying vec3 vL;",
      "void main(){ float a = 1.0 - abs(vUv.x - 0.5) * 2.0; gl_FragColor = vec4((uCouleur * 0.3 + vL) * a * vA * uOpacite, 1.0); }"
    ].join("\n"), { uChute: { value: o.chute || 2 }, uVie: { value: o.vie || 2.2 } });
    return mesh(g, m, o);
  }

  K.particules = { pluie: pluie, neige: neige, poussiere: poussiere, fumee: fumee, etincelles: etincelles, confettis: confettis, ronds: ronds, egouttures: egouttures, nombre: nombre };
})(typeof window !== "undefined" ? window : this);
