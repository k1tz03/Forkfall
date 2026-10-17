/* ═══════════════════════════════════════════════════════════════════════════
   « Chêne de 1931 » — livre 5, « La Maquette » (1999, le président d'un géant
   déchu ; la couleur du livre : #7ED37E). Le second film du livre.

   QUAND : avant la carte du feu (pr.h5.a4_feu, ou sa variante pr.h5.a4_feu_plaque),
   l'ancre de nuit de la première saison (créneau 9). La carte dit : « Nuit du 27
   novembre. La tribune Est brûle sous la pluie, chêne de 1931, d'un seul bloc. Les
   pompiers arrosent la Nord pour qu'elle ne prenne pas. Au matin, la 14B n'existe
   plus. » La scène jouée qui suit (h5.ci.cendres, le matin) dit les heures de
   Vukić (« Trois heures dix, le premier camion. Trois heures quarante, le toit ») et
   montre Gégé noir de suie : le film montre la nuit qu'elle raconte, sans la main
   (aucun incendiaire, aucun bidon : c'est la mission du témoin), sans la plaque de la
   grille (la variante l'a déposée en octobre), sans rien dire de qui y gagne. Il
   pose seulement, à la fin, ce que le livre pose depuis la vitrine : la maquette.

   LA LISTE DES PLANS (36,8 s ; image maîtresse carrée, fenêtres 16:9 → 2,35:1 et 9:16)
    1  0,0–6,2   stade · le feu. Au ras de la pelouse trempée, sous la pluie rouge :
                 la tribune Est brûle d'un bloc, du premier rang au toit. Lent travelling
                 avant. La sirène du premier camion. [lieu : AUBÉRIVE, STADE DE LA RIVE /
                 27 NOVEMBRE 1999 · 3 H 10]
    2  6,2–12,0  stade · la Nord. Le feu dans le dos de la caméra : les pompiers de dos,
                 casques et bandes, trois lances sur la Nord que le feu éclaire, un camion
                 et son gyrophare bleu ; lente avancée. [réplique, le lieutenant : « L'Est,
                 on la laisse. Toutes les lances sur la Nord. »]
    3  12,0–16,4 stade · Gégé. De profil, contre le feu : l'écharpe, la lance tenue à
                 deux mains vers la Nord ; il tourne la tête vers l'Est, et ne lâche pas.
    4  16,4–20,4 stade · la 14B. Le banc de chêne, le numéro au pochoir ; les flammes
                 montent du rang A, la peinture noircit, le bois rougeoie.
    5  20,4–25,6 stade · le toit. De haut, de trois quarts, depuis la Nord : à 21,6 s le
                 milieu du toit tombe dans les gradins, une gerbe d'étincelles, le feu
                 double. Le coup sourd.
                 [lieu : 3 H 40]
    6  25,6–30,6 quai · l'autre rive. Depuis le quai de l'agence, au ras de l'eau : le
                 feu derrière le dos de l'Est, « STADE DE LA RIVE », la fumée couchée par le
                 vent, la Rive qui brûle aussi, en reflets.
    7  30,6–36,8 quai · la vitrine. Du trottoir : l'enseigne, l'agence Tessandier, la
                 vitrine éteinte depuis minuit (son minuteur, comme dans le premier film) ;
                 dans le verre, l'autre rive qui brûle. Approche jusqu'à la maquette : seul
                 le lac de résine luit, la lueur du feu rougit les petits immeubles blancs,
                 et au-dessus d'eux, dans la vitre, la vraie tribune brûle.
                 [titre : AUBÉRIVE · 1999 / LA MAQUETTE] Noir.
   LA LUMIÈRE : le feu seul (des foyers qui palpitent devant la tribune, en candelas,
   decay 2 ; un pinceau sur la façade de la Nord), la pluie éclairée par lui, le bleu des
   gyrophares ; sans bloom (un téléphone faible), de grands halos font l'air chaud. De
   l'autre côté de l'eau, deux lampadaires au sodium et la vitrine noire. LE FEU est
   peint au shader : des nappes le long des rangs, des langues qui montent du bruit et
   que le vent couche vers la Nord, des braises, une gerbe quand le toit tombe. LES BRUITS : la sirène (0,5 s ; 3,3 s), le
   coup sourd du toit (22,2 s). LA MUSIQUE : le thème du livre (livre_h5).
   LA COUPE DE 30 S (l'aperçu de l'App Store) : les sept plans, resserrés (montages.court).
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var FC = global.FusibleCinema;
  var PI = Math.PI;
  var VERT = "#7ED37E";
  // 3 h 40 : le milieu du toit de l'Est tombe (le même instant dans tous les décors)
  var T_TOIT = 21.6;

  // une matière peinte une seule fois par film, à la taille que permet la qualité
  function unique(ctx, cle, fn) { var c = ctx.matieresFilm || (ctx.matieresFilm = {}); return c[cle] || (c[cle] = fn()); }
  function tailleQ(K, n) { return Math.max(64, Math.round(n * (K.qualiteTextures || 1) / 16) * 16); }

  // ─── LE TOIT QUI TOMBE : l'angle (en radians) dont pend chaque pan (0 à 4, de gauche à
  // droite vu de la pelouse). Avant, le toit craque et s'affaisse un peu ; à T_TOIT, les
  // trois pans du milieu tombent (la pesanteur), rebondissent à peine ; les deux du bout
  // plient après eux.
  function angleToit(K, t, i) {
    var tombe = [0, 1, 1, 1, 0][i], retard = [0, 0.3, 0, 0.45, 0][i], max = [0, 0.6, 0.66, 0.58, 0][i];
    var avant = K.lisse(T_TOIT - 7, T_TOIT, t) * 0.03 * (1.2 + Math.sin(t * 2.3 + i * 1.7));
    if (!tombe) return avant + K.lisse(T_TOIT + 0.5, T_TOIT + 1.8, t) * 0.11;
    var u = (t - T_TOIT - retard) / 0.72;
    if (u <= 0) return avant;
    if (u < 1) return avant + max * u * u;
    var b = u - 1;
    return avant + max - 0.07 * Math.exp(-b * 3) * Math.abs(Math.sin(b * 9));
  }

  // ─── LE FEU, en GLSL : un bruit de valeurs et sa somme d'octaves
  var GLSL_BRUIT = [
    "float hF(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }",
    "float nF(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);",
    "  return mix(mix(hF(i), hF(i + vec2(1.0, 0.0)), f.x), mix(hF(i + vec2(0.0, 1.0)), hF(i + vec2(1.0, 1.0)), f.x), f.y); }",
    "float fbmF(vec2 p){ float s = 0.0, a = 0.5; for (int k = 0; k < 4; k++){ s += a * nF(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return s; }"
  ].join("\n");
  function quad(THREE) {
    var g = new THREE.InstancedBufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-0.5, 0, 0, 0.5, 0, 0, 0.5, 1, 0, -0.5, 1, 0]), 3));
    g.setIndex([0, 1, 2, 0, 2, 3]);
    return g;
  }

  // ─── LES FLAMMES : des nappes verticales tournées vers la caméra autour de la verticale,
  // instanciées (un appel pour tout un feu). Le dessin vient du bruit qui monte : large et
  // presque blanc au pied, une langue orange, des lambeaux rouges qui se détachent en haut.
  //  o = { foyers: [[x, y, z, hauteur, largeur, force]], intensite, graine }
  //  → Mesh, maj(t, force)
  function flammes(K, ctx, o) {
    var THREE = ctx.THREE, f = o.foyers, n = f.length, g = quad(THREE);
    var aPos = new Float32Array(n * 3), aF = new Float32Array(n * 4), r = K.alea(o.graine || "flammes");
    f.forEach(function (p, i) {
      aPos[i * 3] = p[0]; aPos[i * 3 + 1] = p[1]; aPos[i * 3 + 2] = p[2];
      aF[i * 4] = r(); aF[i * 4 + 1] = p[3]; aF[i * 4 + 2] = p[4]; aF[i * 4 + 3] = p[5] == null ? 1 : p[5];
    });
    g.setAttribute("aPos", new THREE.InstancedBufferAttribute(aPos, 3));
    g.setAttribute("aF", new THREE.InstancedBufferAttribute(aF, 4));
    g.instanceCount = n;
    K.garder(g);
    var m = K.garder(new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
      uniforms: { uT: { value: 0 }, uForce: { value: 1 }, uIntens: { value: (o.intensite == null ? 1.7 : o.intensite) * (ctx.qualite.bloom ? 0.8 : 1) },
        uVent: { value: new THREE.Vector2(o.vent ? o.vent[0] : -0.35, o.vent ? o.vent[1] : 0.12) }, uNappe: { value: o.nappe ? 1 : 0 }, uAxe: { value: new THREE.Vector3(1, 0, 0) } },
      vertexShader: [
        "attribute vec3 aPos; attribute vec4 aF; uniform float uT, uForce, uNappe; uniform vec2 uVent; uniform vec3 uAxe; varying vec2 vUv; varying float vS, vI, vNet, vRap;",
        "void main(){",
        "  vec3 vers = cameraPosition - aPos; vers.y = 0.0; vers = normalize(vers + vec3(1e-4, 0.0, 0.0));",
        "  vec3 cote = uNappe > 0.5 ? uAxe : normalize(cross(vec3(0.0, 1.0, 0.0), vers));",
        "  float h = aF.y * (0.75 + 0.35 * sin(uT * 1.7 + aF.x * 23.0) + 0.1 * sin(uT * 5.3 + aF.x * 7.0)) * mix(0.3, 1.0, clamp(uForce, 0.0, 1.0)) * max(1.0, uForce);",
        "  float w = aF.z * (0.9 + 0.2 * sin(uT * 1.3 + aF.x * 13.0));",
        "  float plie = sin(uT * 2.3 + aF.x * 11.0 + position.y * 2.2) * 0.14 * position.y * w;",
        // le vent couche le haut des flammes (vers la Nord)
        "  vec3 p = aPos + cote * (position.x * w + plie) + vec3(0.0, position.y * h, 0.0) + vers * 0.03;",
        "  p.xz += uVent * position.y * position.y * h;",
        "  vUv = vec2(position.x + 0.5, position.y); vS = aF.x; vI = aF.w * clamp(uForce, 0.0, 1.0); vNet = clamp(0.16 + aF.y * 0.04, 0.16, 0.45); vRap = w / max(h, 0.1);",
        "  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);",
        "}"
      ].join("\n"),
      fragmentShader: [
        "uniform float uT, uIntens, uNappe; varying vec2 vUv; varying float vS, vI, vNet, vRap;",
        GLSL_BRUIT,
        "void main(){",
        "  vec2 uv = vUv;",
        // deux bruits qui montent ; le second tord la flamme de côté en hauteur (elle lèche)
        // (une nappe, le long d'un rang : beaucoup de langues côte à côte, autant que sa
        // largeur en compte, et pas d'effilement ; ses deux bouts s'éteignent)
        "  float fx = mix(2.2, max(2.2, vRap * 1.7), uNappe);",
        "  float n1 = fbmF(vec2(uv.x * fx + vS * 17.0, uv.y * 1.3 - uT * 1.9 + vS * 5.0));",
        "  float n2 = fbmF(vec2(uv.x * fx * 2.2 - vS * 9.0, uv.y * 2.6 - uT * 3.3));",
        "  float dx = abs(uv.x - 0.5 + (n2 - 0.5) * 0.5 * uv.y * (1.0 - uNappe)) * 2.0;",
        // le corps : large au pied, effilé en haut ; le bruit le ronge de plus en plus en
        // montant (le haut se déchire en lambeaux, pas en pointe)
        "  float f = 1.0 - dx * mix(0.6 + uv.y * 1.1, 0.0, uNappe) - uv.y * 0.75 + (n1 - 0.5) * (0.5 + uv.y * 1.4) - uNappe * smoothstep(0.7, 1.0, dx) * 1.3;",
        "  float a = smoothstep(0.0, vNet, f) * smoothstep(0.0, 0.12, uv.y) * (1.0 - smoothstep(0.82, 1.0, uv.y));",
        // la chaleur : jaune au cœur du pied, orange, puis un rouge sombre qui s'éteint
        "  float ch = clamp(f * 1.4, 0.0, 1.0) * (1.0 - uv.y * 0.6);",
        "  vec3 c = mix(vec3(0.3, 0.04, 0.008), vec3(1.0, 0.3, 0.035), smoothstep(0.04, 0.5, ch));",
        "  c = mix(c, vec3(1.0, 0.66, 0.3), smoothstep(0.55, 0.95, ch));",
        "  gl_FragColor = vec4(max(c * a * (0.25 + 1.1 * ch) * (0.7 + 0.6 * vS) * uIntens * vI, vec3(0.0)), 1.0);",
        "}"
      ].join("\n")
    }));
    var mesh = new THREE.Mesh(g, m); mesh.frustumCulled = false; mesh.renderOrder = 6;
    mesh.maj = function (t, force) { m.uniforms.uT.value = t; if (force != null) m.uniforms.uForce.value = force; };
    return mesh;
  }

  // ─── LES BRAISES : des points qui montent dans l'air chaud, tourbillonnent et s'éteignent ;
  // ou (avec t0) la gerbe d'un toit qui tombe : toutes partent ensemble, l'air les freine,
  // la pesanteur les reprend.
  //  o = { n, zone: { min, max }, vie, montee, vent: [x, z], taille, intensite, t0 }
  function braises(K, ctx, o) {
    var THREE = ctx.THREE, n = K.particules.nombre(o.n || 1500), g = quad(THREE);
    var a = new Float32Array(n * 4), r = K.alea(o.graine || "braises");
    for (var i = 0; i < n * 4; i++) a[i] = r();
    g.setAttribute("aGraine", new THREE.InstancedBufferAttribute(a, 4));
    g.instanceCount = n; K.garder(g);
    var gerbe = o.t0 != null;
    var m = K.garder(new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
      uniforms: { uT: { value: 0 }, uMin: { value: new THREE.Vector3().fromArray(o.zone.min) }, uMax: { value: new THREE.Vector3().fromArray(o.zone.max) },
        uVie: { value: o.vie || 4 }, uMontee: { value: o.montee || 2.5 }, uVent: { value: new THREE.Vector2(o.vent ? o.vent[0] : 0.6, o.vent ? o.vent[1] : 0.2) },
        uTaille: { value: o.taille || 0.05 }, uT0: { value: gerbe ? o.t0 : -1 }, uIntens: { value: o.intensite == null ? 6 : o.intensite } },
      vertexShader: [
        "attribute vec4 aGraine; uniform float uT, uVie, uMontee, uTaille, uT0; uniform vec3 uMin, uMax; uniform vec2 uVent; varying float vA, vC; varying vec2 vUv;",
        "void main(){",
        "  float vie = uVie * (0.6 + 0.8 * aGraine.w), age, ph;",
        "  vec3 p = uMin + aGraine.xyz * (uMax - uMin);",
        "  if (uT0 >= 0.0) {",
        "    age = uT - uT0 - aGraine.w * 0.25; ph = clamp(age / vie, 0.0, 1.0);",
        "    float ag = max(age, 0.0);",
        "    vec3 v = normalize(vec3(aGraine.x - 0.5, 0.7 + aGraine.y, aGraine.z - 0.5)) * uMontee * (0.6 + aGraine.w * 0.8);",
        "    float k = 1.0 - exp(-ag * 1.2);",
        "    p += v * k / 1.2 + vec3(uVent.x, 0.0, uVent.y) * ag - vec3(0.0, 0.6 * ag * ag, 0.0);",
        "    vA = step(0.0, age) * (1.0 - ph) * (1.0 - ph);",
        "  } else {",
        "    ph = fract(uT / vie + aGraine.w * 7.0); age = ph * vie;",
        "    p += vec3(sin(age * 1.6 + aGraine.x * 40.0) * 0.18 * age + uVent.x * age, uMontee * age * (0.7 + aGraine.y * 0.6), cos(age * 1.3 + aGraine.z * 30.0) * 0.14 * age + uVent.y * age);",
        "    vA = smoothstep(0.0, 0.06, ph) * (1.0 - smoothstep(0.55, 1.0, ph));",
        "  }",
        "  vA *= 0.55 + 0.45 * sin(uT * 13.0 + aGraine.x * 80.0);",
        "  vC = ph;",
        "  vec4 mv = viewMatrix * vec4(p, 1.0); mv.xy += (position.xy - vec2(0.0, 0.5)) * uTaille * (0.5 + aGraine.y);",
        "  vUv = position.xy + vec2(0.5, 0.0);",
        "  gl_Position = projectionMatrix * mv;",
        "}"
      ].join("\n"),
      fragmentShader: [
        "uniform float uIntens; varying float vA, vC; varying vec2 vUv;",
        "void main(){ float d = length(vUv - vec2(0.5)) * 2.0; float a = 1.0 - smoothstep(0.2, 1.0, d);",
        "  vec3 c = mix(vec3(1.0, 0.75, 0.35), vec3(0.9, 0.18, 0.02), vC);",
        "  gl_FragColor = vec4(max(c * a * vA * uIntens, vec3(0.0)), 1.0); }"
      ].join("\n")
    }));
    var mesh = new THREE.Mesh(g, m); mesh.frustumCulled = false; mesh.renderOrder = 7;
    mesh.maj = function (t) { m.uniforms.uT.value = t; };
    return mesh;
  }

  // ─── L'EAU DES LANCES : des gouttes sur une parabole, de la lance au toit de la Nord ;
  // le jet se défait en route (les gouttes s'écartent), il prend la lumière du feu
  //  o = { lances: [{ de: [x, y, z], v: [vx, vy, vz] }] (4 au plus), n, vie, lumieres: [{ pos, couleur, intensite }] }
  function jets(K, ctx, o) {
    var THREE = ctx.THREE, L = o.lances, nl = L.length, n = K.particules.nombre(o.n || 3000), g = quad(THREE);
    var a = new Float32Array(n * 4), r = K.alea("jets");
    for (var i = 0; i < n; i++) { a[i * 4] = Math.floor(r() * nl) + 0.5; a[i * 4 + 1] = r(); a[i * 4 + 2] = r(); a[i * 4 + 3] = r(); }
    g.setAttribute("aGraine", new THREE.InstancedBufferAttribute(a, 4));
    g.instanceCount = n; K.garder(g);
    var de = [], v = [];
    for (var k = 0; k < 4; k++) { var l = L[Math.min(k, nl - 1)]; de.push(new THREE.Vector3().fromArray(l.de)); v.push(new THREE.Vector3().fromArray(l.v)); }
    var lum = o.lumieres || [], pos = [], coul = [];
    for (var j = 0; j < 4; j++) { var q = lum[j]; pos.push(new THREE.Vector3().fromArray(q ? q.pos : [0, -999, 0])); coul.push(new THREE.Color(q ? q.couleur : "#000").multiplyScalar(q ? q.intensite : 0)); }
    var m = K.garder(new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, side: THREE.DoubleSide,
      uniforms: { uT: { value: 0 }, uDe: { value: de }, uV: { value: v }, uVie: { value: o.vie || 1.5 }, uLP: { value: pos }, uLC: { value: coul } },
      vertexShader: [
        "attribute vec4 aGraine; uniform float uT, uVie; uniform vec3 uDe[4], uV[4], uLP[4], uLC[4]; varying float vA; varying vec3 vL; varying vec2 vUv;",
        "void main(){",
        "  int k = int(aGraine.x); vec3 d0 = uDe[0], v0 = uV[0];",
        "  if (k == 1) { d0 = uDe[1]; v0 = uV[1]; } if (k == 2) { d0 = uDe[2]; v0 = uV[2]; } if (k == 3) { d0 = uDe[3]; v0 = uV[3]; }",
        "  float s = fract(uT / uVie * 1.3 + aGraine.y) * uVie;",
        "  vec3 vv = v0 + (vec3(aGraine.z, aGraine.w, aGraine.y) - 0.5) * (0.3 + s * 2.2);",
        "  vec3 p = d0 + vv * s + vec3(0.0, -4.9, 0.0) * s * s;",
        "  vec3 vel = normalize(vv + vec3(0.0, -9.8, 0.0) * s);",
        "  vec3 vc = normalize(cameraPosition - p); vec3 cote = normalize(cross(vel, vc) + vec3(1e-4));",
        "  float larg = 0.05 + s * 0.08, lo = 0.3 + s * 0.25;",
        "  vec3 w = p + cote * position.x * larg - vel * position.y * lo;",
        "  vL = vec3(0.0); for (int i = 0; i < 4; i++) { float dd = length(p - uLP[i]); vL += uLC[i] / (1.0 + dd * dd * 0.02); }",
        "  vA = (1.0 - smoothstep(0.75, 1.0, s / uVie)) * smoothstep(0.0, 0.04, s); vUv = position.xy + vec2(0.5, 0.0);",
        "  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);",
        "}"
      ].join("\n"),
      fragmentShader: [
        "varying float vA; varying vec3 vL; varying vec2 vUv;",
        "void main(){ float a = (1.0 - abs(vUv.x - 0.5) * 2.0) * smoothstep(0.0, 0.2, vUv.y) * (1.0 - smoothstep(0.8, 1.0, vUv.y));",
        "  gl_FragColor = vec4(max((vec3(0.09, 0.09, 0.1) + vL) * a * vA, vec3(0.0)), 1.0); }"
      ].join("\n")
    }));
    var mesh = new THREE.Mesh(g, m); mesh.frustumCulled = false; mesh.renderOrder = 5;
    mesh.maj = function (t) { m.uniforms.uT.value = t; };
    return mesh;
  }
  // la vitesse d'un jet qui part de `de`, monte de `angle` et retombe sur `vers`
  function tir(de, vers, angle) {
    var dx = vers[0] - de[0], dz = vers[2] - de[2], d = Math.hypot(dx, dz), dy = vers[1] - de[1];
    var c = Math.cos(angle), tn = Math.tan(angle);
    var v = Math.sqrt(9.8 * d * d / (2 * c * c * Math.max(0.5, d * tn - dy)));
    return [dx / d * v * c, v * Math.sin(angle), dz / d * v * c];
  }

  // ─── LA TRIBUNE EST, en feu : le chêne de 1931 du premier film, noirci, des braises
  // dans le bois (une carte d'émission qui palpite), le toit en cinq pans qui pivotent à
  // leur charnière du fond (le milieu tombe). Repère : le devant en z = 0, vers +z.
  //  → Group { pans: [{ pivot }], hautToit, fond, profondeur, bas, mh, md, braisesBois, numeros, toit(t) }
  function texBraises(K) {
    var W = tailleQ(K, 512), c = K.tex.canvas(W, W), x = c.getContext("2d"), n = K.tex.couche(W, W, { periode: 7, octaves: 4, graine: "braises-bois" });
    var im = x.createImageData(W, W), d = im.data;
    for (var i = 0, j = 0; i < n.length; i++, j += 4) {
      var v = K.lisse(0.52, 0.85, n[i]);
      d[j] = 255 * v; d[j + 1] = 90 * v * v; d[j + 2] = 10 * v * v; d[j + 3] = 255;
    }
    x.putImageData(im, 0, 0);
    x.globalCompositeOperation = "lighter"; x.strokeStyle = "rgba(255,90,20,0.5)"; x.lineWidth = Math.max(1, W / 256);
    for (var k = 1; k < 6; k++) { x.beginPath(); x.moveTo(k / 6 * W, 0); x.lineTo(k / 6 * W, W); x.stroke(); }
    return K.tex.texture(c);
  }
  function tribuneFeu(K, ctx, o) {
    o = o || {};
    var THREE = ctx.THREE, P = K.props, g = new THREE.Group();
    var L = o.longueur || 70, N = o.rangs || 12, mh = 0.42, md = 0.78, bas = 1.2;
    var braiseTex = unique(ctx, "braises", function () { return texBraises(K); });
    function braiser(m) { m.emissive = new THREE.Color("#ff5a14"); m.emissiveMap = braiseTex; m.emissiveIntensity = 0; return m; }
    var mGradin = braiser(K.mat.bois({ couleur: "#2e241c", lames: 4, graine: "gradins-1931-feu" }));
    var mBanc = braiser(K.mat.bois({ couleur: "#3a2c20", lames: 2, graine: "bancs-1931-feu" }));
    var mPoteau = braiser(K.garder(new THREE.MeshStandardMaterial({ color: "#2a1012", roughness: 0.8 })));
    var mToit = braiser(K.garder(new THREE.MeshStandardMaterial({ color: "#1c1d20", roughness: 0.7, metalness: 0.3 })));
    var mBrique = K.mat.brique({ couleur: "#3e2520", graine: "soubassement-est-feu", suie: 1.4 });
    var geos = { gradin: [], banc: [], poteau: [] };
    function boiteG(liste, w, h, d, x, y, z, metre) { var b = P.boiteUV(w, h, d, metre || 1.2); b.translate(x, y, z); liste.push(b.index ? b.toNonIndexed() : b); }
    var sb = new THREE.Mesh(P.boiteUV(L + 0.6, bas, 0.45, 2), mBrique); sb.position.set(0, bas / 2, -0.2); sb.receiveShadow = true; g.add(sb);
    for (var i = 0; i < N; i++) {
      var y = bas + i * mh, z0 = -i * md;
      boiteG(geos.gradin, L, 0.06, md, 0, y, z0 - md / 2);
      boiteG(geos.gradin, L, mh, 0.05, 0, y - mh / 2, z0 - md + 0.02);
      boiteG(geos.banc, L, 0.06, 0.3, 0, y + 0.43, z0 - md * 0.58);
      boiteG(geos.banc, L, 0.1, 0.03, 0, y + 0.37, z0 - md * 0.58 + 0.15);
      for (var fx = -L / 2 + 0.75; fx < L / 2; fx += 1.5) boiteG(geos.poteau, 0.05, 0.4, 0.06, fx, y + 0.2, z0 - md * 0.58, 1);
    }
    var prof = N * md, hT = bas + N * mh;
    boiteG(geos.gradin, L + 0.4, hT + 2.6 - bas, 0.08, 0, bas + (hT + 2.6 - bas) / 2, -prof - 0.05);
    [-1, 1].forEach(function (sg) { boiteG(geos.gradin, 0.08, hT + 2.6, prof + 0.6, sg * (L / 2 + 0.2), (hT + 2.6) / 2, -prof / 2 + 0.2); });
    var avant = hT + 2.3, fond = hT + 3.1, larg = prof + 1.4, pente = Math.atan2(fond - avant, larg), lt = Math.hypot(larg, fond - avant);
    // le toit en cinq pans, chacun avec ses deux fermes et son bout de bandeau
    var pans = [], lp = (L + 1.2) / 5;
    for (var pn = 0; pn < 5; pn++) {
      var cx = -(L + 1.2) / 2 + lp * (pn + 0.5);
      var pivot = new THREE.Group(); pivot.position.set(cx, fond, 0.7 - larg); g.add(pivot);
      var pan = new THREE.Mesh(K.garder(new THREE.BoxGeometry(lp - 0.06, 0.1, lt)), mToit);
      pan.rotation.x = pente; pan.position.set(0, -(fond - avant) / 2, lt / 2 * Math.cos(pente));
      pan.castShadow = true; pan.receiveShadow = true; pivot.add(pan);
      [-lp * 0.3, lp * 0.3].forEach(function (dx) { var fe = P.boite(pivot, 0.16, 0.18, lt, mPoteau, dx, -(fond - avant) / 2 - 0.15, lt / 2 * Math.cos(pente)); fe.rotation.x = pente; });
      P.boite(pivot, lp - 0.06, 0.6, 0.06, mPoteau, 0, avant - fond - 0.05, larg - 0.01);
      pans.push({ pivot: pivot, x: cx });
    }
    for (var px = -L / 2; px <= L / 2 + 0.01; px += 7) {
      boiteG(geos.poteau, 0.24, avant - bas, 0.24, px, bas + (avant - bas) / 2, 0.25, 1);
      var jf = P.boiteUV(0.12, 2.2, 0.12, 1); jf.rotateX(0.7); jf.translate(px, avant - 1.1, -0.45); geos.poteau.push(jf.toNonIndexed());
    }
    // le bandeau peint, sur le pan du milieu
    var tb = K.tex.texte({ lignes: ["TRIBUNE EST"], fond: "#3a1418", encre: "#bfb39a", largeur: 1024, hauteur: 96, peint: true, graine: "bandeau-est-feu" });
    var bandeau = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(13.6, 0.6)), braiser(K.garder(new THREE.MeshStandardMaterial({ map: tb.map, roughness: 0.8 }))));
    bandeau.material.emissiveIntensity = 0.35;
    bandeau.position.set(0, avant - fond - 0.05, larg + 0.03); pans[2].pivot.add(bandeau);
    ["gradin", "banc", "poteau"].forEach(function (k) {
      var m = new THREE.Mesh(K.gens.fusion(geos[k]), k === "gradin" ? mGradin : k === "banc" ? mBanc : mPoteau);
      m.geometry.computeVertexNormals(); K.garder(m.geometry);
      m.castShadow = true; m.receiveShadow = true; g.add(m);
    });
    // les numéros au pochoir du rang B, autour de la 14B (5B à 23B, la 14B en x = 0)
    var nb = 18, c = K.tex.canvas(2048, 64), x = c.getContext("2d");
    x.font = "700 44px " + K.habillage.MONO; x.textAlign = "center"; x.textBaseline = "middle"; x.fillStyle = "rgba(226,218,196,0.92)";
    for (var k2 = 0; k2 <= nb; k2++) x.fillText((5 + k2) + "B", (k2 + 0.5) / (nb + 1) * 2048, 34);
    x.globalCompositeOperation = "destination-out"; var ru = K.alea("pochoir-feu");
    for (var e = 0; e < 900; e++) { x.fillStyle = "rgba(0,0,0," + (0.3 + ru() * 0.7) + ")"; x.fillRect(ru() * 2048, ru() * 64, 1 + ru() * 3, 1 + ru() * 2); }
    var mNum = K.garder(new THREE.MeshStandardMaterial({ map: K.tex.texture(c, { clamp: true }), transparent: true, roughness: 0.7, depthWrite: false, color: "#ffffff" }));
    var num = new THREE.Mesh(K.garder(new THREE.PlaneGeometry((nb + 1) * 0.5, 0.09)), mNum);
    num.position.set(0, bas + mh + 0.37, -md - md * 0.58 + 0.168); g.add(num);
    g.pans = pans; g.hautToit = avant; g.fond = fond; g.profondeur = prof; g.bas = bas; g.mh = mh; g.md = md; g.longueur = L;
    g.braisesBois = [mGradin, mBanc, mPoteau, mToit]; g.numeros = mNum;
    g.toit = function (t) { pans.forEach(function (p, i) { p.pivot.rotation.x = angleToit(K, t, i); }); };
    return g;
  }

  // ─── LES GENS DU FEU : un pompier (la veste sombre, le casque, deux bandes qui prennent la
  // lumière) qui tient sa lance ; Gégé, en blouson, l'écharpe du club, la lance aussi ; le
  // lieutenant, qui montre la Nord
  function pompier(K, ctx, o) {
    var THREE = ctx.THREE, P = K.props;
    var m = K.gens.mannequin({ tenue: o.tenue || "manteau", couleur: o.couleur || "#15181e", couleur2: "#0f1115", echarpe: o.echarpe || null, carrure: o.carrure || 1.05, graine: o.graine });
    if (!o.echarpe) {
      var casque = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.128, 14, 8, 0, PI * 2, 0, PI * 0.56)), unique(ctx, "casque", function () { return K.garder(new THREE.MeshStandardMaterial({ color: "#b9a876", roughness: 0.3, metalness: 0.6 })); }));
      casque.position.set(0, 0.125, 0); casque.scale.set(1, 0.9, 1.12); m.os.tete.add(casque);
      var mBande = unique(ctx, "bandes", function () { return K.garder(new THREE.MeshStandardMaterial({ color: "#d8d2b0", emissive: new THREE.Color("#e8e0b8"), emissiveIntensity: 0.45, roughness: 0.4 })); });
      [0.1, 0.3].forEach(function (yb) { var b = new THREE.Mesh(K.garder(new THREE.CylinderGeometry(0.207, 0.186, 0.04, 14, 1, true)), mBande); b.position.y = yb; b.scale.z = 0.66; m.os.buste.add(b); });
    }
    var lance = null;
    if (o.lance !== false) {
      lance = new THREE.Group(); m.groupe.add(lance);
      P.cylindre(lance, 0.03, 0.05, 0.55, unique(ctx, "laiton", function () { return K.mat.metal({ couleur: "#9c8f6a", rugosite: 0.3 }); }), 0, 0, 0.12, { rx: PI / 2 });
    }
    m.lance = lance;
    // tenir la lance, l'angle de tir `visee` (rad) ; `tete` : la tête tournée (rad)
    m.tenir = function (t, visee, tete) {
      m.repos(t);
      var os = m.os, b = Math.sin(t * 5.2 + (o.phase || 0)) * 0.02;
      m.bras(1.05 + visee * 0.6 + b, 0.08, 0.85 + visee * 0.6 + b, -0.1, 0.5);
      os.buste.rotation.x = 0.16; os.bassin.rotation.x = -0.05;
      os.hancheG.rotation.x = -0.4; os.hancheD.rotation.x = 0.28; os.genouG.rotation.x = 0.32; os.genouD.rotation.x = 0.12;
      os.tete.rotation.x = -0.18 - visee * 0.3; os.tete.rotation.y = tete || 0;
      if (lance) { lance.position.set(0.02, 1.32, 0.36); lance.rotation.x = -visee; }
    };
    // montrer : le bras droit tendu devant soi (k de 0 à 1)
    m.montrer = function (t, k) {
      m.repos(t);
      var a = K.lisse(0, 1, k);
      m.os.epauleD.rotation.x = -1.35 * a; m.os.epauleD.rotation.z = 0.35 * a; m.os.coudeD.rotation.x = -0.1;
      m.os.tete.rotation.y = 0.3 * a; m.os.tete.rotation.x = -0.1;
    };
    return m;
  }

  // ─── UN CAMION DE POMPIERS : la caisse rouge, la cabine, l'échelle, les gyrophares bleus
  //  → Group, maj(t)
  function camion(K, ctx, graine) {
    var THREE = ctx.THREE, P = K.props, g = new THREE.Group();
    var mRouge = unique(ctx, "rougeCamion", function () { return K.garder(new THREE.MeshPhysicalMaterial({ color: "#5e100e", roughness: 0.35, metalness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.2 })); });
    var mNoir = unique(ctx, "pneu", function () { return K.garder(new THREE.MeshStandardMaterial({ color: "#0d0d0e", roughness: 0.85 })); });
    var mChrome = unique(ctx, "chrome", function () { return K.mat.metal({ couleur: "#a8acb0", rugosite: 0.25 }); });
    var mVitre = unique(ctx, "vitreCamion", function () { return K.garder(new THREE.MeshPhysicalMaterial({ color: "#07090c", roughness: 0.05, metalness: 0.2, envMapIntensity: 1.6 })); });
    P.boite(g, 6.6, 2.3, 2.4, mRouge, -0.6, 1.65, 0); P.boite(g, 2.1, 2.5, 2.4, mRouge, 3.75, 1.75, 0);
    P.boite(g, 0.05, 0.95, 2.1, mVitre, 4.81, 2.35, 0);
    P.boite(g, 1.2, 0.8, 0.05, mVitre, 3.75, 2.35, 1.21); P.boite(g, 1.2, 0.8, 0.05, mVitre, 3.75, 2.35, -1.21);
    P.boite(g, 6.0, 0.12, 0.08, mChrome, -0.6, 3.0, 0.42); P.boite(g, 6.0, 0.12, 0.08, mChrome, -0.6, 3.0, -0.42);
    for (var e = -3.4; e <= 2.2; e += 0.45) P.boite(g, 0.05, 0.05, 0.84, mChrome, e, 3.0, 0);
    [[-2.7, 1], [-2.7, -1], [3.5, 1], [3.5, -1], [-1.3, 1], [-1.3, -1]].forEach(function (p) { P.cylindre(g, 0.52, 0.52, 0.36, mNoir, p[0], 0.52, p[1] * 1.08, { rx: PI / 2, cotes: 16 }); });
    P.fusionner(g);
    var gyros = [];
    [[4.1, 0.6, 0], [4.1, -0.6, 0.5], [-3.8, 0.0, 0.25]].forEach(function (p) {
      var mb = K.mat.lumiere({ couleur: "#3a6bff", intensite: 2, toneMapped: false });
      var b = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.13, 10, 8)), mb); b.position.set(p[0], 3.08, p[1]); g.add(b);
      var h = K.look.halo({ couleur: "#4a7bff", taille: 2.6, intensite: 0 }); h.position.set(p[0], 3.08, p[1]); g.add(h);
      gyros.push({ m: mb, h: h, ph: p[2] });
    });
    var bleu = K.look.ponctuelle({ couleur: "#3a6bff", intensite: 0, portee: 28 }); bleu.position.set(1.5, 3.6, 0); g.add(bleu);
    var dec = K.h01(7, K.hash(graine || "camion") % 997);
    g.maj = function (t) {
      var k = 0;
      gyros.forEach(function (gy) {
        var s = Math.pow(Math.max(0, Math.sin((t * 1.7 + gy.ph + dec) * PI * 2)), 5);
        gy.h.intensite(2.4 * s); gy.m.color.set("#3a6bff").multiplyScalar(0.6 + 7 * s); k = Math.max(k, s);
      });
      bleu.intensity = 70 * k;
    };
    return g;
  }

  // ─── LE STADE EN FEU, côté pelouse : la tribune Est d'un bloc, la pluie rouge dans la
  // lumière du feu, la Nord qu'on arrose, deux camions, deux pompiers, le lieutenant, Gégé
  function decorStadeFeu(K, ctx) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: { zenith: "#02030a", horizon: "#0c0b12", lueur: "#4a1c08", lueurDir: [0, -1], force: 0.8 }, brouillard: ["#090a0f", 0.01],
      environnement: { fenetres: 0, lampes: [{ pos: [0, 8, -60], couleur: "#ff6a20", intensite: 1.2, taille: 20 }, { pos: [-50, 4, -10], couleur: "#3a6bff", intensite: 0.8, taille: 4 }] }, reflets: 0.9,
      ambiance: ["#1a2438", "#070404", 0.11] });
    var pel = P.pelouse({ boue: 0.45 }); pel.rotation.y = PI / 2; pel.position.set(0, 0.02, 0); s.add(pel);
    pel.children[0].material.roughness = 0.5; pel.children[0].material.envMapIntensity = 0.4;
    var est = tribuneFeu(K, ctx, {}); est.position.set(0, 0, -36); s.add(est);
    // le feu : des nappes sur les rangs et au bord du toit, d'un bout à l'autre ; rien
    // devant la 14B (ses flammes à elle viennent du rang A, plus bas)
    var foyers = [], rf = K.alea("foyers-est");
    // de grandes nappes sur les rangs, des langues basses entre les bancs, le bord du toit
    for (var k = 0; k < 112; k++) {
      var grand = k < 72, x = -34 + rf() * 68, rang = Math.floor(rf() * 12);
      if (Math.abs(x) < 3.4 && rang < 5) x += x < 0 ? -3.6 : 3.6;
      foyers.push([x, est.bas + rang * est.mh + 0.3, -36 - rang * est.md - 0.3,
        grand ? 2.2 + 5.5 * Math.pow(rf(), 1.5) : 0.8 + rf() * 0.9, grand ? 2 + rf() * 3 : 0.6 + rf() * 0.7, 0.6 + rf() * 0.5]);
    }
    for (var k2 = 0; k2 < 22; k2++) foyers.push([-34 + k2 * 3.2 + rf() * 2, est.hautToit + 0.1, -36 - 1.5 - rf() * 6, 4 + rf() * 6, 3 + rf() * 3, 0.8]);
    // les deux bouts de la tribune brûlent aussi (les joues de planches)
    [-1, 1].forEach(function (sg) { for (var kj = 0; kj < 8; kj++) foyers.push([sg * 35.7, est.bas + rf() * 4.5, -36.4 - kj * 1.2 - rf() * 0.5, 2 + rf() * 2.5, 1.4 + rf() * 1.4, 0.75]); });
    var feu = flammes(K, ctx, { foyers: foyers, intensite: 1.7, graine: "feu-est" }); s.add(feu);
    // des nappes le long des rangs : le bois brûle d'un bloc, les langues en sortent
    var nappes = [], rn = K.alea("nappes-est");
    for (var kn = 0; kn < 40; kn++) {
      var xn = -31 + rn() * 62, rg = Math.floor(rn() * 12);
      if (Math.abs(xn) < 6 && rg < 4) xn += xn < 0 ? -6.5 : 6.5;
      nappes.push([xn, est.bas + rg * est.mh + 0.32, -36 - rg * est.md - 0.35, 0.9 + rn() * 1.1, 5 + rn() * 6, 0.75 + rn() * 0.3]);
    }
    var nappe = flammes(K, ctx, { foyers: nappes, intensite: 1.5, nappe: true, graine: "nappes-est" }); s.add(nappe);
    // quand le toit tombe : le milieu s'embrase plus haut
    var fl2 = [], rf2 = K.alea("flambee");
    for (var k3 = 0; k3 < 16; k3++) fl2.push([-20 + rf2() * 40, est.bas + 2 + rf2() * 3, -38 - rf2() * 6, 9 + rf2() * 8, 3.5 + rf2() * 3, 0.9]);
    var flambee = flammes(K, ctx, { foyers: fl2, intensite: 1.5, graine: "flambee" }); s.add(flambee);
    // la lueur du feu dans la fumée et la pluie (sans bloom, sur un téléphone, c'est elle
    // qui fait l'air chaud)
    var halo = ctx.qualite.bloom ? 0.35 : 1;   // avec le bloom, la lueur vient déjà des flammes
    var lueurs = [[-20, 8, -42, 34], [0, 10, -42, 40], [20, 8, -42, 34]].map(function (p) {
      var h = K.look.halo({ couleur: "#ff5a18", taille: p[3], intensite: 0.16 }); h.position.set(p[0], p[1], p[2]); s.add(h); return h;
    });
    // la 14B : des flammes qui montent du rang A, sous elle, et sur le rang B à côté
    // (sur la marche du rang B, juste devant le bandeau des numéros : elles montent devant
    // la 14B ; d'autres plus loin sur le rang)
    var yB = est.bas + est.mh + 0.03;
    var f14 = flammes(K, ctx, { foyers: [[-0.42, yB, -36.88, 0.55, 0.32, 1], [0.12, yB, -36.9, 0.7, 0.38, 1], [0.58, yB, -36.88, 0.45, 0.28, 1], [-0.95, yB, -36.92, 0.6, 0.34, 0.9],
      [1.7, yB + 0.44, -37.25, 0.95, 0.5, 1], [-1.9, yB + 0.44, -37.25, 1.1, 0.6, 1], [2.6, est.bas + 2 * est.mh + 0.47, -38.0, 1.2, 0.7, 1], [-0.6, est.bas + 0.1, -36.32, 0.9, 0.5, 0.8]], intensite: 1.5, vent: [-0.12, 0.05], graine: "feu-14b" });
    s.add(f14);
    var fumees = [-24, -8, 8, 24].map(function (x, i) {
      var f = K.particules.fumee({ n: 70, source: [x, est.hautToit + 1, -40], vent: [-0.9, 0.35], montee: 2.2, vie: 9, taille: 7, etalement: 5, couleur: "#1a1615", lueur: "#a04818", opacite: 0.6, graine: "fumee-est" + i,
        lumieres: [{ pos: [x, est.hautToit - 1, -38], couleur: "#ff6a2a", intensite: 1.0, rayon: 15 }] });
      s.add(f); return f;
    });
    var f14f = K.particules.fumee({ n: 26, source: [0.4, est.bas + 0.6, -37.2], vent: [-0.25, 0.1], montee: 0.9, vie: 4, taille: 0.9, etalement: 1.2, couleur: "#2a2422", lueur: "#8a3a18", opacite: 0.3, graine: "fumee-14b",
      lumieres: [{ pos: [0, est.bas + 0.3, -36.3], couleur: "#ff6a2a", intensite: 1.4, rayon: 3 }] });
    s.add(f14f);
    var brs = braises(K, ctx, { n: 2400, zone: { min: [-34, est.bas, -46], max: [34, est.hautToit + 1, -36] }, vie: 5, montee: 2.4, vent: [-0.7, 0.4], taille: 0.08, intensite: 7, graine: "braises-est" });
    s.add(brs);
    var brs14 = braises(K, ctx, { n: 260, zone: { min: [-2, est.bas + 0.3, -37.4], max: [2.4, est.bas + 0.7, -36.8] }, vie: 2.2, montee: 0.9, vent: [-0.15, 0.1], taille: 0.014, intensite: 6, graine: "braises-14b" });
    s.add(brs14);
    var gerbe = braises(K, ctx, { n: 1800, zone: { min: [-18, est.hautToit - 2, -44], max: [18, est.hautToit, -36] }, vie: 3.2, montee: 9, vent: [-0.8, 0.5], taille: 0.12, intensite: 9, t0: T_TOIT + 0.45, graine: "gerbe-toit" });
    s.add(gerbe);
    // la lumière du feu : trois foyers qui palpitent devant la tribune (le milieu porte
    // l'ombre), un au bout gauche (il éclaire la Nord et les pompiers par-derrière), un
    // sous la 14B
    var lumFeu = [[-22, 7, -32.5, 520], [0, 8, -32, 640], [22, 7, -32.5, 520], [-33, 5, -31, 380]].map(function (p, i) {
      var l = i === 1 ? K.look.projecteur({ couleur: "#ff7a2a", intensite: p[3], angle: 1.25, penombre: 0.9, decroissance: 2, ombre: true, loin: 140, ombreTaille: 1024 })
        : K.look.ponctuelle({ couleur: "#ff7a2a", intensite: p[3], portee: 120 });
      l.position.set(p[0], p[1], p[2]); s.add(l);
      if (i === 1) { var c = new THREE.Object3D(); c.position.set(-6, 0, 10); s.add(c); l.target = c; }
      l.base = p[3];
      return l;
    });
    var lum14 = K.look.ponctuelle({ couleur: "#ff6a22", intensite: 0, portee: 7 }); lum14.position.set(0.1, est.bas + 0.25, -36.0); s.add(lum14);
    // le feu sur la façade de la Nord, de l'autre côté du coin : on voit pourquoi on l'arrose
    var surNord = K.look.projecteur({ couleur: "#ff7a2a", intensite: 9000, angle: 0.5, penombre: 0.9, decroissance: 2, ombre: false });
    surNord.position.set(-30, 9, -33); s.add(surNord);
    var cNord = new THREE.Object3D(); cNord.position.set(-58, 6, -14); s.add(cNord); surNord.target = cNord;
    // la Nord, à gauche : on l'arrose pour qu'elle ne prenne pas
    var nord = P.tribune({ largeur: 54, rangs: 16, couleurs: ["#5a5650", "#5a5650"], grillage: false, panneaux: false, graine: "nord-feu" });
    nord.rotation.y = PI / 2; nord.position.set(-56, 0, 0); s.add(nord);
    [[-57, 34], [57, 34], [-57, -36], [57, -36]].forEach(function (p, i) {
      var py = P.pylone({ hauteur: 30, colonnes: 4, rangees: 3, intensite: 0, cone: false, graine: "py-feu" + i });
      py.groupe.position.set(p[0], 0, p[1]); s.add(py.groupe); s.updateMatrixWorld(true); py.viser(0, 0, 0); py.tete.remove(py.lumiere);
    });
    // les camions sur la piste, devant la Nord ; les tuyaux qui traînent jusqu'aux lances
    var camions = [[-49.5, -7, PI / 2 + 0.25], [-49, 9, PI / 2 - 0.1]].map(function (p, i) { var c = camion(K, ctx, "camion" + i); c.position.set(p[0], 0, p[1]); c.rotation.y = p[2]; s.add(c); return c; });
    var cibleNord = [[-64, 12.3, -23], [-64, 12.3, -16.5], [-64, 12.3, -10]];
    var gens = [
      { m: pompier(K, ctx, { graine: "pompier-1", phase: 0 }), p: [-45.5, 0, -21.5], cible: cibleNord[0] },
      { m: pompier(K, ctx, { graine: "pompier-2", phase: 1.3 }), p: [-47, 0, -15.8], cible: cibleNord[1] },
      { m: pompier(K, ctx, { graine: "gege-feu", phase: 2.1, echarpe: "#7A1F2E", tenue: "blouson", couleur: "#1b1816", carrure: 1.1 }), p: [-44, 0, -11.5], cible: cibleNord[2], gege: true },
      { m: pompier(K, ctx, { graine: "lieutenant", phase: 0.7, lance: false }), p: [-42.5, 0, -21.5], lieutenant: true }
    ];
    var ANGLE = 0.68, lances = [];
    gens.forEach(function (gg) {
      var dx = (gg.cible ? gg.cible[0] : -60) - gg.p[0], dz = (gg.cible ? gg.cible[2] : -20) - gg.p[2];
      gg.ry = gg.lieutenant ? Math.atan2(-22, -6) : Math.atan2(dx, dz);
      gg.m.groupe.position.set(gg.p[0], 0, gg.p[2]); gg.m.groupe.rotation.y = gg.ry; s.add(gg.m.groupe);
      if (gg.cible) {
        var d = [gg.p[0] + Math.sin(gg.ry) * (0.36 + 0.3 * Math.cos(ANGLE)), 1.32 + 0.3 * Math.sin(ANGLE), gg.p[2] + Math.cos(gg.ry) * (0.36 + 0.3 * Math.cos(ANGLE))];
        lances.push({ de: d, v: tir(d, gg.cible, ANGLE) });
      }
    });
    var eau = jets(K, ctx, { lances: lances, n: 3600, vie: 1.55, lumieres: [{ pos: [-33, 5, -32], couleur: "#ff7a2a", intensite: 1.1 }, { pos: [-44, 8, -27], couleur: "#ff8a3a", intensite: 0.8 }, { pos: [-58, 10, -22], couleur: "#ff7a2a", intensite: 0.9 }, { pos: [-49, 3.2, -7], couleur: "#3a6bff", intensite: 0.12 }] });
    s.add(eau);
    var vapeur = K.particules.fumee({ n: 44, source: [-66, 12.4, -16], vent: [0.5, 0.25], montee: 1.3, vie: 6, taille: 5, etalement: 10, couleur: "#7a7470", lueur: "#b05a2a", opacite: 0.25, graine: "vapeur-nord",
      lumieres: [{ pos: [-55, 10, -24], couleur: "#ff7a2a", intensite: 1.3, rayon: 25 }] });
    s.add(vapeur);
    // les tuyaux : du camion à chaque lance, sur la pelouse
    var tuyaux = [];
    gens.forEach(function (gg, i) {
      if (!gg.cible) return;
      var cam = camions[i === 2 ? 1 : 0].position;
      var courbe = new THREE.CatmullRomCurve3([new THREE.Vector3(cam.x + 1.5, 0.08, cam.z + 1.2), new THREE.Vector3((cam.x + gg.p[0]) / 2 + 1.5, 0.08, (cam.z + gg.p[2]) / 2 - 1), new THREE.Vector3(gg.p[0] - Math.sin(gg.ry) * 0.5, 0.08, gg.p[2] - Math.cos(gg.ry) * 0.5), new THREE.Vector3(gg.p[0] + Math.sin(gg.ry) * 0.1, 0.9, gg.p[2] + Math.cos(gg.ry) * 0.1)]);
      tuyaux.push(new THREE.TubeGeometry(courbe, 40, 0.045, 6, false).toNonIndexed());
    });
    var tuyau = new THREE.Mesh(K.garder(K.gens.fusion(tuyaux)), unique(ctx, "tuyau", function () { return K.garder(new THREE.MeshStandardMaterial({ color: "#2c2a26", roughness: 0.5 })); }));
    tuyau.geometry.computeVertexNormals(); s.add(tuyau);
    // la pluie, rouge près du feu
    var lumP = [{ pos: [-15, 7, -30], couleur: "#ff7a2a", intensite: 1.0, rayon: 32 }, { pos: [15, 7, -30], couleur: "#ff7a2a", intensite: 1.0, rayon: 32 }, { pos: [0, 3, -34], couleur: "#ffa050", intensite: 0.9, rayon: 14 }, { pos: [-49, 3.2, -1], couleur: "#3a6bff", intensite: 0.6, rayon: 12 }];
    var pluie = K.particules.pluie({ n: 9000, zone: { min: [-20, -0.5, -20], max: [20, 22, 20] }, suivre: true, avance: 14, vitesse: [0.9, -11, 0.4], longueur: 0.55, largeur: 0.013, couleur: "#6f7e9c", opacite: 0.85, lumieres: lumP });
    s.add(pluie);
    var ronds = K.particules.ronds({ n: 700, zone: { min: [-12, 0.04, -30], max: [12, 0.04, 14] }, periode: 0.5, rayon: 0.08, couleur: "#9aa6c0", opacite: 0.7, lumieres: lumP });
    s.add(ronds);
    // le feu sur la pelouse mouillée
    var reflets = [-24, -8, 8, 24].map(function (x) { var r = K.look.reflet({ pos: [x, 7, -34], sol: 0.04, couleur: "#ff7a2a", intensite: 0.12, largeur: 5, longueur: 40 }); s.add(r); return r; });
    s.updateMatrixWorld(true);
    return {
      scene: s, tribune: est, gens: gens,
      look: { bloom: 0.35, rayon: 0.4, seuil: 1.4, exposition: 0.95, contraste: 1.18, saturation: 1.0 },
      maj: function (t, c) {
        var vif = 1 + 0.9 * K.cloche(T_TOIT + 0.3, T_TOIT + 0.8, T_TOIT + 1.8, T_TOIT + 5, t);
        var fl = function (i) { return (0.78 + 0.22 * K.bruit1(t * 7 + i * 3.1, 11 + i) + 0.1 * K.bruit1(t * 23 + i, 5)) * vif; };
        lumFeu.forEach(function (l, i) { l.intensity = l.base * fl(i); });
        lueurs.forEach(function (h, i) { h.intensite(halo * 0.16 * fl(i + 7)); });
        surNord.intensity = 9000 * fl(6);
        lum14.intensity = 3.5 * (0.4 + 0.6 * K.lisse(15.5, 19.5, t)) * fl(5);
        feu.maj(t, 1); nappe.maj(t, 1);
        flambee.maj(t, K.lisse(T_TOIT + 0.35, T_TOIT + 1.4, t) * (1.15 - 0.25 * K.lisse(T_TOIT + 2, T_TOIT + 6, t)));
        f14.maj(t, 0.45 + 0.75 * K.lisse(16.2, 19.6, t));
        brs.maj(t); brs14.maj(t); gerbe.maj(t); fumees.forEach(function (f) { f.maj(t); }); f14f.maj(t); vapeur.maj(t); eau.maj(t);
        pluie.maj(t, c.camera); ronds.maj(t);
        est.toit(t);
        est.braisesBois.forEach(function (m, i) { m.emissiveIntensity = (i === 3 ? 0.4 : 0.6) * fl(i + 4); });
        // la peinture de la 14B noircit
        est.numeros.color.setRGB(1, 1, 1).multiplyScalar(1 - 0.82 * K.lisse(17.0, 20.2, t));
        camions.forEach(function (cm) { cm.maj(t); });
        gens.forEach(function (gg, i) {
          if (gg.lieutenant) { gg.m.montrer(t + i, K.lisse(6.6, 7.6, t)); return; }
          // Gégé tourne la tête vers l'Est (plan 3), et ne lâche pas la lance
          var tete = gg.gege ? -1.05 * K.lisse(13.4, 14.4, t) : 0;
          gg.m.tenir(t + i * 1.7, ANGLE, tete);
        });
        reflets.forEach(function (r, i) { r.maj(c.camera, fl(i)); });
      }
    };
  }

  // ─── LES MATIÈRES DE LA MAQUETTE (les mêmes que dans « La seconde tranche »)
  function texCarton(K, graine) {
    var W = 256, c = K.tex.canvas(W, W), x = c.getContext("2d"), n = K.tex.couche(W, W, { periode: 8, octaves: 3, graine: graine });
    var im = x.createImageData(W, W), d = im.data;
    for (var i = 0, j = 0; i < n.length; i++, j += 4) { var v = 232 + (n[i] - 0.5) * 18; d[j] = v; d[j + 1] = v * 0.985; d[j + 2] = v * 0.95; d[j + 3] = 255; }
    x.putImageData(im, 0, 0);
    return K.tex.texture(c);
  }
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

  // ─── LA MAQUETTE : « LES TERRASSES DE LA RIVE, SECONDE TRANCHE », au 1/200 (celle du
  // premier film : le parc à la place du stade, le lac de résine, trois arbres de lichen
  // à la place de l'Est, la Nord rétrécie, les Terrasses en gradins blancs). L'origine est
  // le milieu du socle, son dessus en y = 0. Les petites fenêtres et les perles des
  // lampadaires sont éteintes (le minuteur de la vitrine) : seul le lac reste allumé.
  //  → Group { lac, mLac }
  function maquette(K, ctx) {
    var THREE = ctx.THREE, P = K.props, g = new THREE.Group();
    var carton = unique(ctx, "carton", function () { return texCarton(K, "carton"); });
    var mBlanc = K.garder(new THREE.MeshStandardMaterial({ color: "#e6e2d9", map: carton, roughness: 0.85, metalness: 0 }));
    var mBeige = K.garder(new THREE.MeshStandardMaterial({ color: "#d3c8b2", map: carton, roughness: 0.88 }));
    var mSocle = K.garder(new THREE.MeshStandardMaterial({ color: "#a9a69d", roughness: 0.9 }));
    var mRue = K.garder(new THREE.MeshStandardMaterial({ color: "#7d7b76", roughness: 0.75 }));
    var mSable = K.garder(new THREE.MeshStandardMaterial({ color: "#cfc5ab", roughness: 0.95 }));
    var mVitres = K.garder(new THREE.MeshStandardMaterial({ color: "#1d2128", roughness: 0.2, metalness: 0.3, envMapIntensity: 1.4 }));
    var mGarde = K.garder(new THREE.MeshPhysicalMaterial({ color: "#e8f4ff", roughness: 0.08, transparent: true, opacity: 0.3, depthWrite: false, envMapIntensity: 1.5 }));
    P.boite(g, 1.42, 0.03, 1.02, mSocle, 0, -0.015, 0, { ombre: false });
    var rive = new THREE.Mesh(new THREE.PlaneGeometry(1.42, 0.16), K.garder(new THREE.MeshPhysicalMaterial({ color: "#0b1c22", roughness: 0.06, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.6 })));
    K.garder(rive.geometry); rive.rotation.x = -PI / 2; rive.position.set(0, -0.004, 0.42); rive.receiveShadow = true; rive.userData.garder = true; g.add(rive);
    P.boite(g, 1.42, 0.006, 0.012, mSable, 0, -0.001, 0.336);
    P.boite(g, 1.42, 0.0015, 0.052, mSable, 0, 0.0008, 0.305);
    P.boite(g, 0.03, 0.0012, 0.6, mRue, 0.38, 0.0006, -0.0, { ombre: false });
    P.boite(g, 0.29, 0.0012, 0.05, mSable, 0.545, 0.0006, 0.0275, { ombre: false });
    P.boite(g, 1.42, 0.0012, 0.03, mRue, 0, 0.0006, -0.485, { ombre: false });
    var pont = new THREE.Group(); pont.position.set(-0.6, 0, 0.42); g.add(pont);
    P.boite(pont, 0.05, 0.004, 0.18, mBeige, 0, 0.007, 0);
    [-0.05, 0, 0.05].forEach(function (z) { P.boite(pont, 0.05, 0.006, 0.012, mBeige, 0, 0.002, z + 0.025); });
    var PARC = { l: 0.74, h: 0.57, cx: -0.01, cz: -0.015, lac: [0.0, 0.0], lacR: [0.085, 0.062] };
    var mParc = K.garder(new THREE.MeshStandardMaterial({ map: unique(ctx, "parc", function () { return texParc(K, PARC); }), roughness: 1, metalness: 0 }));
    var parc = new THREE.Mesh(new THREE.BoxGeometry(PARC.l, 0.004, PARC.h), mParc); K.garder(parc.geometry);
    parc.position.set(PARC.cx, 0.002, PARC.cz); parc.receiveShadow = true; parc.userData.garder = true; g.add(parc);
    var mLac = K.garder(new THREE.MeshPhysicalMaterial({ color: "#0e2e30", roughness: 0.05, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03,
      emissive: new THREE.Color("#ffffff"), emissiveMap: unique(ctx, "resine", function () { return texResine(K); }), emissiveIntensity: 1.0, envMapIntensity: 0.9 }));
    var lac = new THREE.Mesh(new THREE.CircleGeometry(1, 48), mLac); K.garder(lac.geometry);
    lac.rotation.x = -PI / 2; lac.scale.set(PARC.lacR[0], PARC.lacR[1], 1);
    var lacPos = [PARC.cx + PARC.lac[0], 0.0042, PARC.cz + PARC.lac[1]];
    lac.position.set(lacPos[0], lacPos[1], lacPos[2]); lac.userData.garder = true; g.add(lac);
    var nord = new THREE.Group(); nord.position.set(-0.36, 0.004, -0.03); g.add(nord);
    for (var gr = 0; gr < 6; gr++) P.boite(nord, 0.0062, 0.003 + gr * 0.0034, 0.13, mBlanc, 0.012 - gr * 0.0062, (0.003 + gr * 0.0034) / 2, 0);
    P.boite(nord, 0.003, 0.028, 0.134, mBlanc, -0.026, 0.014, 0);
    P.boite(nord, 0.018, 0.0015, 0.134, mBlanc, -0.016, 0.0285, 0);
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
    for (var bx = 0.43; bx <= 0.66; bx += 0.022) { arbres.push({ x: bx, z: 0.0065, h: 0, r: 0.0045, n: 3, haie: true }); arbres.push({ x: bx + 0.011, z: 0.0485, h: 0, r: 0.0045, n: 3, haie: true }); }
    var nBoules = 0, nTroncs = 0; arbres.forEach(function (a) { nBoules += a.n; if (!a.haie) nTroncs++; });
    var boules = new THREE.InstancedMesh(gBoule, mLichen, nBoules), troncs = new THREE.InstancedMesh(gTronc, mTronc, Math.max(1, nTroncs));
    var dd = new THREE.Object3D(), ib = 0, it = 0;
    arbres.forEach(function (a) {
      if (!a.haie) { dd.position.set(a.x, a.h / 2 + 0.004, a.z); dd.rotation.set(0, 0, 0); dd.scale.set(1, a.h + a.r * 0.6, 1); dd.updateMatrix(); troncs.setMatrixAt(it++, dd.matrix); }
      for (var k = 0; k < a.n; k++) {
        var an = ra() * PI * 2, el = (ra() - 0.35) * 1.6, rad = a.r * Math.sqrt(ra()) * 0.75;
        var sc = a.r * (0.22 + ra() * 0.38) * (1.15 - rad / a.r * 0.4);
        dd.position.set(a.x + Math.cos(an) * rad, 0.004 + a.h + a.r * 0.55 + Math.sin(el) * a.r * 0.45, a.z + Math.sin(an) * rad);
        dd.rotation.set(ra() * 3, ra() * 3, ra() * 3); dd.scale.set(sc, sc * (0.8 + ra() * 0.4), sc); dd.updateMatrix(); boules.setMatrixAt(ib++, dd.matrix);
      }
    });
    boules.count = ib; troncs.count = it;
    boules.instanceMatrix.needsUpdate = true; troncs.instanceMatrix.needsUpdate = true;
    boules.castShadow = true; boules.receiveShadow = true; troncs.castShadow = true;
    g.add(boules); g.add(troncs);
    var perles = [];
    for (var lx = -0.66; lx <= 0.66; lx += 0.075) perles.push([lx, 0.288]);
    for (var ax = 0.44; ax <= 0.66; ax += 0.055) { perles.push([ax, 0.006]); perles.push([ax + 0.027, 0.048]); }
    perles.forEach(function (p) {
      P.cylindre(g, 0.0005, 0.0005, 0.02, mBlanc, p[0], 0.011, p[1], { cotes: 5 });
      P.boite(g, 0.003, 0.003, 0.003, mBlanc, p[0], 0.0215, p[1]);
    });
    [[-0.05, 0.12], [0.08, -0.1], [-0.2, 0.06], [0.22, 0.2], [-0.15, -0.21], [0.5, 0.012], [0.6, 0.044]].forEach(function (b) { P.boite(g, 0.011, 0.002, 0.0028, mBlanc, b[0], 0.006, b[1]); });
    function immeuble(x, z, l, p, etages, vers, beige) {
      var b = new THREE.Group(); b.position.set(x, 0.0015, z); g.add(b);
      var he = 0.0155, m = beige ? mBeige : mBlanc, fx = vers[0], fz = vers[1];
      for (var e = 0; e < etages; e++) {
        var recul = (fx || fz) ? Math.max(0, e - 2) * 0.0065 : 0;
        var ll = l - (fx ? recul : 0), pp = p - (fz ? recul : 0), ox = -fx * recul / 2, oz = -fz * recul / 2;
        P.boite(b, ll, he * 0.84, pp, m, ox, e * he + he * 0.42, oz);
        P.boite(b, ll + Math.abs(fx) * 0.006, he * 0.14, pp + Math.abs(fz) * 0.006, m, ox + fx * 0.003, e * he + he * 0.91, oz + fz * 0.003);
        var faces = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (var fc = 0; fc < 4; fc++) {
          var nx = faces[fc][0], nz = faces[fc][1], parcote = (nx && nx === fx) || (nz && nz === fz);
          var long = nx ? pp : ll, nf = Math.max(2, Math.round(long / (parcote ? 0.014 : 0.012))), lw = long / nf * (parcote ? 0.66 : 0.4), hv = he * (parcote ? 0.56 : 0.42);
          for (var w = 0; w < nf; w++) {
            var u = ((w + 0.5) / nf - 0.5) * long;
            if (nx) P.boite(b, 0.0012, hv, lw, mVitres, ox + nx * (ll / 2 + 0.0004), e * he + he * 0.44, oz + u, { ombre: false });
            else P.boite(b, lw, hv, 0.0012, mVitres, ox + u, e * he + he * 0.44, oz + nz * (pp / 2 + 0.0004), { ombre: false });
          }
        }
        if (e > 0 && (fx || fz)) {
          if (fx) P.boite(b, 0.0007, he * 0.32, pp, mGarde, ox + fx * (ll / 2 + 0.0055), e * he + he * 0.98 + 0.0025, oz, { ombre: false });
          else P.boite(b, ll, he * 0.32, 0.0007, mGarde, ox, e * he + he * 0.98 + 0.0025, oz + fz * (pp / 2 + 0.0055), { ombre: false });
        }
      }
      P.boite(b, Math.max(0.02, l - (fx ? Math.max(0, etages - 3) * 0.0065 : 0)) * 0.3, 0.006, 0.012, m, -fx * 0.01, etages * he + 0.003, 0);
      return b;
    }
    immeuble(0.475, -0.21, 0.11, 0.12, 7, [-1, 0]);
    immeuble(0.475, -0.0675, 0.11, 0.125, 6, [-1, 0]);
    immeuble(0.475, 0.1225, 0.11, 0.135, 8, [-1, 0]);
    immeuble(0.615, -0.1225, 0.1, 0.235, 5, [-1, 0]);
    immeuble(0.615, 0.1325, 0.1, 0.155, 6, [-1, 0]);
    immeuble(-0.22, -0.405, 0.15, 0.1, 6, [0, 1]);
    immeuble(-0.02, -0.41, 0.14, 0.1, 8, [0, 1]);
    immeuble(0.19, -0.405, 0.15, 0.1, 7, [0, 1]);
    immeuble(-0.56, -0.25, 0.12, 0.12, 4, [0, 0], true);
    immeuble(-0.56, -0.05, 0.12, 0.12, 5, [0, 0], true);
    immeuble(-0.56, 0.15, 0.12, 0.1, 4, [0, 0], true);
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
    var tp = K.tex.texte({ lignes: ["LES TERRASSES DE LA RIVE · SECONDE TRANCHE"], fond: "#b8933f", encre: "#2a1d0a", largeur: 1024, hauteur: 96, graine: "plaque-maquette" });
    var plaqueM = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.42, 0.04)), K.garder(new THREE.MeshStandardMaterial({ map: tp.map, roughness: 0.3, metalness: 0.75 })));
    plaqueM.position.set(0, -0.016, 0.5105); plaqueM.userData.garder = true; g.add(plaqueM);
    P.fusionner(g);
    g.lac = lacPos; g.mLac = mLac;
    return g;
  }

  // ─── L'EAU : des rides en carte de normales, qu'on fait glisser
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

  // ─── LE REFLET VIVANT DANS LA VITRINE : la caméra du film, réfléchie par le plan du verre
  // (z = zVerre, normale vers −z), rend l'autre rive dans une petite cible à chaque image
  // (le feu bouge, le toit est tombé) ; le plan du reflet la projette (texture2DProj).
  // Ce qui est derrière le verre (la boutique, les façades) est caché pendant ce rendu, et
  // les cartes d'ombre ne sont pas refaites pour lui.
  //  → { materiau, rendre(scene, camera, caches[]) }
  function refletVivant(K, ctx, zVerre) {
    var THREE = ctx.THREE, W = ctx.qualite.nom === "basse" ? 256 : 512;
    var rt = K.garder(new THREE.WebGLRenderTarget(W, W, { type: THREE.HalfFloatType }));
    var cam = new THREE.PerspectiveCamera(40, 1, 0.5, 400);
    var biais = new THREE.Matrix4().set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
    var mat = K.garder(new THREE.ShaderMaterial({
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false,
      uniforms: { tRef: { value: rt.texture }, uMat: { value: new THREE.Matrix4() }, uForce: { value: 1.0 } },
      vertexShader: "uniform mat4 uMat; varying vec4 vP; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vP = uMat * w; gl_Position = projectionMatrix * viewMatrix * w; }",
      fragmentShader: "uniform sampler2D tRef; uniform float uForce; varying vec4 vP; void main(){ vec3 c = texture2DProj(tRef, vP).rgb; gl_FragColor = vec4(max(c, vec3(0.0)) * uForce, 1.0); }"
    }));
    var p = new THREE.Vector3(), q = new THREE.Vector3(), dir = new THREE.Vector3(), haut = new THREE.Vector3(), quat = new THREE.Quaternion();
    return {
      materiau: mat,
      rendre: function (scene, camera, caches) {
        camera.updateMatrixWorld(true);
        camera.getWorldPosition(p); camera.getWorldDirection(dir); camera.getWorldQuaternion(quat);
        q.copy(p).addScaledVector(dir, 10);
        haut.set(0, 1, 0).applyQuaternion(quat);
        p.z = 2 * zVerre - p.z; q.z = 2 * zVerre - q.z; haut.z = -haut.z;
        cam.position.copy(p); cam.up.copy(haut); cam.lookAt(q);
        cam.fov = Math.min(80, camera.fov * 1.35); cam.aspect = 1;
        cam.near = Math.max(0.3, Math.abs(p.z - zVerre) * 0.9); cam.far = 400;
        cam.updateProjectionMatrix(); cam.updateMatrixWorld(true);
        mat.uniforms.uMat.value.copy(biais).multiply(cam.projectionMatrix).multiply(cam.matrixWorldInverse);
        var r = ctx.rendu.renderer, vis = caches.map(function (o) { var v = o.visible; o.visible = false; return v; });
        var auto = r.shadowMap.autoUpdate, avant = r.getRenderTarget();
        r.shadowMap.autoUpdate = false;
        r.setRenderTarget(rt); r.clear(); r.render(scene, cam); r.setRenderTarget(avant);
        r.shadowMap.autoUpdate = auto;
        caches.forEach(function (o, i) { o.visible = vis[i]; });
      }
    };
  }

  // ─── L'AGENCE TESSANDIER, à 3 h 40 : la vitrine éteinte depuis minuit (son minuteur),
  // la maquette sur son socle, le lac de résine qui reste allumé, le chevalet ; la lueur
  // du feu entre par le verre. Repère local : la façade en z = 0, tournée vers +z.
  //  → Group { reflet (le plan du reflet), maquette }
  function agence(K, ctx) {
    var THREE = ctx.THREE, P = K.props, g = new THREE.Group();
    var W = 10, H0 = 3.6, E = 2, he = 3.0, D = 7;
    var mB = K.mat.brique({ couleur: "#5c3428", graine: "agence", suie: 0.7 });
    var mPierre = K.mat.beton({ couleur: "#8a8478", graine: "pierre-agence" });
    var haut = new THREE.Mesh(P.boiteUV(W, E * he + 0.4, D, 2.4), mB); haut.position.set(0, H0 + (E * he + 0.4) / 2, -D / 2); haut.castShadow = true; haut.receiveShadow = true; g.add(haut);
    var fen = K.tex.fenetres({ colonnes: 4, rangees: E, allumees: 0.12, mur: "#000000", graine: "agence-fen-nuit" });
    var mF = K.garder(new THREE.MeshStandardMaterial({ map: fen.map, emissive: new THREE.Color("#ffffff"), emissiveMap: fen.lumiere, emissiveIntensity: 0.6, roughness: 0.25, metalness: 0.1, transparent: true }));
    mF.onBeforeCompile = function (sh) { sh.fragmentShader = sh.fragmentShader.replace("#include <map_fragment>", "#include <map_fragment>\n if (diffuseColor.r + diffuseColor.g + diffuseColor.b < 0.02) discard;"); };
    var pf = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(W * 0.96, E * he)), mF); pf.position.set(0, H0 + 0.2 + E * he / 2, 0.02); pf.userData.garder = true; g.add(pf);
    P.boite(g, W + 0.3, 0.35, 0.45, mPierre, 0, H0 + E * he + 0.55, 0.06);
    P.boite(g, W + 0.1, 0.16, 0.22, mPierre, 0, H0 + 0.1, 0.05);
    P.boite(g, 1.1, 2.9, 0.5, mB, -4.45, 1.45, -0.25);
    P.boite(g, 0.4, 2.9, 0.5, mB, 2.7, 1.45, -0.25);
    P.boite(g, 1.1, 2.9, 0.5, mB, 4.45, 1.45, -0.25);
    P.boite(g, 6.4, 0.55, 0.5, mPierre, -0.7, 0.275, -0.25);
    var te = K.tex.texte({ lignes: ["IMMOBILIER TESSANDIER"], fond: "#17231d", encre: "#d6c79c", largeur: 1024, hauteur: 112, graine: "enseigne-tessandier" });
    var ens = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(9.6, 0.62)), K.garder(new THREE.MeshStandardMaterial({ map: te.map, roughness: 0.55, metalness: 0.1 })));
    ens.position.set(0, 3.24, 0.04); ens.userData.garder = true; g.add(ens);
    P.boite(g, 10, 0.72, 0.1, K.garder(new THREE.MeshStandardMaterial({ color: "#17231d", roughness: 0.6 })), 0, 3.24, -0.03);
    var piece = P.piece({ largeur: 9.0, profondeur: 6.4, hauteur: 2.95, murs: K.mat.papier({ couleur: "#5a4c3c", graine: "agence-murs", repete: [3, 2] }), sol: K.mat.bois({ couleur: "#2a1c12", lames: 6, graine: "agence-parquet", repete: [4, 4] }) });
    piece.position.set(0, 0, -3.45); g.add(piece);
    P.boite(g, 1.6, 1.0, 1.2, K.garder(new THREE.MeshStandardMaterial({ color: "#d4cfc4", roughness: 0.7 })), -0.7, 0.5, -1.05);
    var maq = maquette(K, ctx);
    maq.position.set(-0.7, 1.03, -1.05); g.add(maq);
    var capot = new THREE.Mesh(K.garder(new THREE.BoxGeometry(1.44, 0.22, 1.04)), K.garder(new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.04, transparent: true, opacity: 0.1, envMapIntensity: 1.4, depthWrite: false })));
    capot.position.set(-0.7, 1.14, -1.05); capot.renderOrder = 3; capot.userData.garder = true; g.add(capot);
    var ta = K.tex.texte({ lignes: ["LES TERRASSES", "DE LA RIVE", "SECONDE TRANCHE", "VUE IMPRENABLE", "SUR L'EAU"], fond: "#efe9da", encre: "#20352b", largeur: 512, hauteur: 680, graine: "affiche-terrasses" });
    var aff = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.62, 0.82)), K.garder(new THREE.MeshStandardMaterial({ map: ta.map, roughness: 0.8 })));
    aff.position.set(1.55, 1.25, -0.75); aff.rotation.set(-0.12, -0.3, 0); aff.userData.garder = true; g.add(aff);
    var mChev = K.mat.bois({ couleur: "#3a2616", lames: 1, graine: "chevalet" });
    P.boite(g, 0.04, 1.6, 0.04, mChev, 1.33, 0.8, -0.72, { rz: 0.06 }); P.boite(g, 0.04, 1.6, 0.04, mChev, 1.77, 0.8, -0.86, { rz: -0.06 });
    var bur = P.bureau({ lampe: 0 }); bur.position.set(2.2, 0, -4.4); bur.rotation.y = PI; g.add(bur);
    var mFeuille = K.garder(new THREE.MeshStandardMaterial({ color: "#1d2a1a", roughness: 0.7 }));
    var rf = K.alea("ficus");
    P.cylindre(g, 0.22, 0.17, 0.4, K.garder(new THREE.MeshStandardMaterial({ color: "#5a3a26", roughness: 0.8 })), -3.6, 0.2, -2.6);
    var gF = K.garder(new THREE.SphereGeometry(1, 6, 4));
    for (var f = 0; f < 26; f++) { var fl = new THREE.Mesh(gF, mFeuille); var rr = 0.13 + rf() * 0.1; fl.position.set(-3.6 + (rf() - 0.5) * 0.7, 0.8 + rf() * 1.2, -2.6 + (rf() - 0.5) * 0.6); fl.scale.set(rr, rr * 0.5, rr); g.add(fl); }
    // le verre, presque rien ; le plan du reflet ; les gouttes, vues du trottoir
    var mVerre = K.garder(new THREE.MeshPhysicalMaterial({ color: "#0c0e12", roughness: 0.03, metalness: 0, transparent: true, opacity: 0.12, envMapIntensity: 1.6, depthWrite: false }));
    var verre = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(6.4, 2.3)), mVerre); verre.position.set(-0.7, 1.7, -0.02); verre.renderOrder = 4; verre.userData.garder = true; g.add(verre);
    var refl = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(6.4, 2.3)), mVerre); refl.position.set(-0.7, 1.7, -0.01); refl.renderOrder = 5; refl.userData.garder = true; g.add(refl);
    var mCadre = K.mat.bois({ couleur: "#1e2a22", lames: 1, graine: "porte-agence" });
    P.boite(g, 1.0, 0.1, 0.08, mCadre, 3.4, 2.55, -0.08); P.boite(g, 0.08, 2.6, 0.08, mCadre, 2.94, 1.3, -0.08); P.boite(g, 0.08, 2.6, 0.08, mCadre, 3.86, 1.3, -0.08);
    var vp = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.86, 2.4)), mVerre); vp.position.set(3.4, 1.25, -0.06); vp.userData.garder = true; g.add(vp);
    var cg = K.tex.canvas(512, 256), xg = cg.getContext("2d"), rg = K.alea("gouttes-vitre");
    for (var gi = 0; gi < 420; gi++) {
      var gx = rg() * 512, gy = rg() * 256, gr = 0.6 + rg() * 2.2;
      xg.fillStyle = "rgba(200,215,235," + (0.25 + rg() * 0.4) + ")"; xg.beginPath(); xg.arc(gx, gy, gr, 0, 7); xg.fill();
      if (rg() < 0.15) { xg.fillStyle = "rgba(200,215,235,0.18)"; xg.fillRect(gx - 0.5, gy, 1, 6 + rg() * 30); }
    }
    var mGouttes = K.garder(new THREE.MeshBasicMaterial({ map: K.tex.texture(cg, { clamp: true }), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.22, side: THREE.DoubleSide, fog: false, color: "#ffb27a" }));
    var gouttes = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(6.4, 2.3)), mGouttes);
    gouttes.position.set(-0.7, 1.7, 0.0); gouttes.renderOrder = 6; gouttes.userData.garder = true; g.add(gouttes);
    P.fusionner(g);
    g.reflet = refl; g.maquette = maq;
    return g;
  }

  // ─── LE QUAI, à 3 h 40 : l'eau, les deux quais, l'agence et sa vitrine noire ; de
  // l'autre côté, la tribune Est qui brûle (son dos sur le halage, « STADE DE LA RIVE »),
  // la fumée que le vent couche vers la Nord, la Rive rouge de reflets.
  function decorQuaiFeu(K, ctx) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: { zenith: "#02030a", horizon: "#0d0c13", lueur: "#5a220c", lueurDir: [0, -1], force: 0.9 },
      brouillard: ["#0a0b10", 0.009], environnement: { fenetres: 16, lampes: [{ pos: [0, 14, -70], couleur: "#ff6a20", intensite: 4, taille: 24 }, { pos: [0, 12, 80], couleur: "#ff9a3d", intensite: 1.2, taille: 8 }] }, reflets: 1.0,
      ambiance: ["#1a2438", "#070404", 0.11] });
    var rides = texRides(K, "rive", [60, 5]);
    var mEau = K.garder(new THREE.MeshPhysicalMaterial({ color: "#05080b", roughness: 0.14, metalness: 0, normalMap: rides, normalScale: new THREE.Vector2(0.35, 0.35), envMapIntensity: 2.6, clearcoat: 0.5, clearcoatRoughness: 0.1 }));
    var eau = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(420, 28)), mEau); eau.rotation.x = -PI / 2; eau.position.set(0, -2.0, 0); eau.receiveShadow = true; s.add(eau);
    var mQuai = K.mat.beton({ couleur: "#5e5a50", graine: "quai-pierre", banches: 3, taches: 1.2 });
    [-1, 1].forEach(function (sg) { var q = new THREE.Mesh(P.boiteUV(420, 2.4, 1.2, 2), mQuai); q.position.set(0, -1.0, sg * 14.6); q.receiveShadow = true; s.add(q); });
    var rue = P.rue({ longueur: 220, largeur: 8, trottoir: 2.5, flaques: 0.5, graine: "quai" }); rue.rotation.y = PI / 2; rue.position.set(0, 0, 20.5); s.add(rue);
    rue.children[0].material.envMapIntensity = 2.0;
    // la rambarde : deux lisses, des barreaux (un seul maillage)
    var mFer = K.mat.metal({ couleur: "#1c1e20", rugosite: 0.5 });
    var ramb = new THREE.Group(); s.add(ramb);
    P.boite(ramb, 220, 0.05, 0.05, mFer, 0, 1.0, 14.35); P.boite(ramb, 220, 0.04, 0.04, mFer, 0, 0.5, 14.35);
    for (var rx = -80; rx <= 80; rx += 2.5) P.cylindre(ramb, 0.025, 0.025, 1.0, mFer, rx, 0.5, 14.35, { cotes: 6 });
    P.fusionner(ramb);
    // derrière le verre de la vitrine (cachés dans son reflet) : l'agence, les façades
    var derriere = new THREE.Group(); s.add(derriere);
    var ag = agence(K, ctx); ag.rotation.y = PI; ag.position.set(0, 0.15, 27); derriere.add(ag);
    [[-21, 12, 3, "#5a2e24"], [-10.5, 9, 3, "#61342a"], [11, 11, 4, "#5c3226"], [22.5, 12, 3, "#6a3a2c"], [34, 11, 2, "#583026"], [-32.5, 11, 4, "#5e2e22"]].forEach(function (v, i) {
      var fa = P.facade({ largeur: v[1], etages: v[2], graine: "quai" + i, brique: v[3], vitrine: true, fenetres: { allumees: 0.1 } });
      fa.rotation.y = PI; fa.position.set(v[0], 0.15, 27); derriere.add(fa);
    });
    // les lampadaires du quai : deux devant les façades, un au bord de l'eau
    var lamps = [[-9.5, 25.6, 1], [8.5, 25.6, 1], [36, 15.3, -1]].map(function (p, i) {
      var r = P.reverbere({ hauteur: 6.2, bras: 1.4, intensite: i === 1 ? 140 : 120, ombre: false, gresille: i === 0 ? 1 : 0.15, forceCone: 0.08 });
      r.position.set(p[0], 0.15, p[1]); r.rotation.y = p[2] > 0 ? PI / 2 : -PI / 2; s.add(r);
      return r;
    });
    // l'autre rive : le halage, la tribune qui brûle, la Nord, les pylônes éteints
    var halage = new THREE.Mesh(P.planUV(220, 7, 2), K.mat.beton({ couleur: "#4a473f", graine: "halage" })); halage.rotation.x = -PI / 2; halage.position.set(0, 0.0, -17.6); halage.receiveShadow = true; s.add(halage);
    var pel = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(110, 70)), K.mat.pelouse({ bandes: 10, boue: 0.3 })); pel.rotation.x = -PI / 2; pel.position.set(0, 0.02, -66); s.add(pel);
    var est = tribuneFeu(K, ctx, {}); est.rotation.y = PI; est.position.set(0, 0, -30.5); s.add(est);
    var dosEst = -30.5 + est.profondeur + 0.1;
    var tdos = K.tex.texte({ lignes: ["STADE DE LA RIVE"], largeur: 2048, hauteur: 192, encre: "#e6dcc0", peint: true, graine: "dos-est" });
    var dos = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(34, 3.2)), K.garder(new THREE.MeshStandardMaterial({ map: tdos.map, transparent: true, roughness: 0.9, depthWrite: false })));
    dos.position.set(-10, 5.6, dosEst + 0.02); s.add(dos);
    var mBg = K.mat.brique({ couleur: "#5a3026", graine: "piliers-quai", suie: 1.0, humide: 0.8 });
    [12.4, 17.6].forEach(function (x) { var pi = new THREE.Mesh(P.boiteUV(0.9, 3.0, 0.9, 1.2), mBg); pi.position.set(x, 1.5, dosEst + 0.4); s.add(pi); });
    var grille = new THREE.Group(); s.add(grille);
    var mGr = K.mat.metal({ couleur: "#1a1c1e", rugosite: 0.55 });
    for (var gx = 13.0; gx <= 17.05; gx += 0.18) P.cylindre(grille, 0.018, 0.018, 2.5, mGr, gx, 1.3, dosEst + 0.4, { cotes: 5 });
    P.fusionner(grille);
    var nord = P.tribune({ largeur: 54, rangs: 16, couleurs: ["#5a5650", "#5a5650"], grillage: false, panneaux: false, graine: "nord-1999" });
    nord.rotation.y = PI / 2; nord.position.set(-58, 0, -66); s.add(nord);
    [[-57, -32], [57, -32]].forEach(function (p, i) {
      var py = P.pylone({ hauteur: 30, colonnes: 4, rangees: 3, intensite: 0, cone: false, graine: "py-quai" + i });
      py.groupe.position.set(p[0], 0, p[1]); s.add(py.groupe); s.updateMatrixWorld(true); py.viser(0, 0, -66); py.tete.remove(py.lumiere);
    });
    // la première tranche des Terrasses (1993), au bout du stade : ses façades rougies
    var fen1 = K.tex.fenetres({ colonnes: 8, rangees: 6, allumees: 0.4, mur: "#d8d2c4", graine: "terrasses-1" });
    var mT1 = K.garder(new THREE.MeshStandardMaterial({ map: fen1.map, emissive: new THREE.Color("#ffffff"), emissiveMap: fen1.lumiere, emissiveIntensity: 0.9, roughness: 0.8 }));
    var mBlanc1 = K.garder(new THREE.MeshStandardMaterial({ color: "#c9c3b5", roughness: 0.85 }));
    [[78, -34, 26, 0.3], [80, -62, 24, -0.25], [104, -48, 22, 0.5]].forEach(function (b) {
      var im = new THREE.Mesh(K.garder(new THREE.BoxGeometry(b[2], 19, 13)), [mBlanc1, mBlanc1, mBlanc1, mBlanc1, mT1, mT1]);
      im.position.set(b[0], 9.5, b[1]); im.rotation.y = b[3]; s.add(im);
    });
    var halLamps = [-30, 24].map(function (x) {
      var r = P.reverbere({ hauteur: 5.5, bras: 1.0, intensite: 150, cone: false, gresille: 0.3 });
      r.position.set(x, 0, -15.0); r.rotation.y = PI / 2; s.add(r);
      return r;
    });
    var mPont = K.mat.beton({ couleur: "#6e685c", graine: "pont-pierre", banches: 6 });
    var forme = new THREE.Shape(); forme.moveTo(-16, -2.2); forme.lineTo(16, -2.2); forme.lineTo(16, 1.1); forme.lineTo(-16, 1.1); forme.lineTo(-16, -2.2);
    [-9.5, 0, 9.5].forEach(function (c) { var tr = new THREE.Path(); tr.absarc(c, -2.2, 4.1, 0, PI, false); forme.holes.push(tr); });
    var pont = new THREE.Mesh(K.garder(new THREE.ExtrudeGeometry(forme, { depth: 9, bevelEnabled: false, curveSegments: 18 })), mPont); pont.rotation.y = PI / 2; pont.position.set(-78, 0, 0); s.add(pont);
    // LE FEU, vu de dos : au-dessus du toit, par les planches du mur, et (le toit tombé)
    // une flambée au milieu
    var foyers = [], rf = K.alea("foyers-dos");
    for (var k = 0; k < 40; k++) foyers.push([-34 + rf() * 68, est.fond - 0.6, -22.5 - rf() * 7, 5 + rf() * 8, 3 + rf() * 3, 0.8 + rf() * 0.3]);
    for (var k2 = 0; k2 < 12; k2++) foyers.push([-33 + rf() * 66, 2.5 + rf() * 5, dosEst + 0.15, 1.4 + rf() * 1.8, 1.0 + rf() * 1.2, 0.5]);
    var feu = flammes(K, ctx, { foyers: foyers, intensite: 1.7, graine: "feu-dos" }); s.add(feu);
    var nappesD = [], rn2 = K.alea("nappes-dos");
    for (var kd = 0; kd < 11; kd++) nappesD.push([-31 + kd * 6.2 + rn2() * 1.5, est.fond - 0.4, -21.6 - rn2() * 1.5, 1.6 + rn2() * 1.6, 6 + rn2() * 3, 0.85]);
    var nappeD = flammes(K, ctx, { foyers: nappesD, intensite: 1.5, nappe: true, graine: "nappes-dos" }); s.add(nappeD);
    var fl2 = [], rf2 = K.alea("flambee-dos");
    for (var k3 = 0; k3 < 14; k3++) fl2.push([-18 + rf2() * 36, 3 + rf2() * 3, -24 - rf2() * 6, 12 + rf2() * 9, 4 + rf2() * 3, 0.95]);
    var flambee = flammes(K, ctx, { foyers: fl2, intensite: 1.5, graine: "flambee-dos" }); s.add(flambee);
    var halo = ctx.qualite.bloom ? 0.35 : 1;   // avec le bloom, la lueur vient déjà des flammes
    var lueurs = [[-18, 12, -28, 40], [12, 13, -28, 44]].map(function (p) {
      var h = K.look.halo({ couleur: "#ff5a18", taille: p[3], intensite: 0.14 }); h.position.set(p[0], p[1], p[2]); s.add(h); return h;
    });
    var fumees = [-24, -8, 8, 24].map(function (x, i) {
      var f = K.particules.fumee({ n: 70, source: [x, est.fond + 2, -26], vent: [-1.0, 0.25], montee: 2.4, vie: 10, taille: 8, etalement: 6, couleur: "#1a1615", lueur: "#a04818", opacite: 0.6, graine: "fumee-dos" + i,
        lumieres: [{ pos: [x, est.fond, -26], couleur: "#ff6a2a", intensite: 1.0, rayon: 16 }] });
      s.add(f); return f;
    });
    var brs = braises(K, ctx, { n: 2000, zone: { min: [-34, est.fond - 1, -31], max: [34, est.fond + 2, -21] }, vie: 6, montee: 3, vent: [-0.9, 0.3], taille: 0.12, intensite: 6, graine: "braises-dos" });
    s.add(brs);
    // sa lumière : un foyer haut (il rougit l'eau, les façades du quai, la vitrine), un bas
    // (le mur, le halage)
    var lumHaut = K.look.ponctuelle({ couleur: "#ff7a2a", intensite: 2600, portee: 0 }); lumHaut.position.set(0, 16, -32); s.add(lumHaut);
    var lumBas = K.look.ponctuelle({ couleur: "#ff7030", intensite: 120, portee: 40 }); lumBas.position.set(0, 7, -13); s.add(lumBas);
    // la lueur du feu à travers la vitre, sur la maquette (un pinceau étroit)
    var lueur = K.look.projecteur({ couleur: "#ff8a3a", intensite: 0, angle: 0.13, penombre: 0.9, decroissance: 2, ombre: false });
    lueur.position.set(0.7, 3.0, 19.5); s.add(lueur);
    var cl = new THREE.Object3D(); cl.position.set(0.7, 1.2, 28.05); s.add(cl); lueur.target = cl;
    // la pluie, les ronds sur l'eau et le trottoir
    s.updateMatrixWorld(true);
    var lumP = [
      { pos: lamps[1].positionLampe(), couleur: "#FF9A3D", intensite: 1.2, rayon: 8 },
      { pos: [0, 10, -22], couleur: "#ff7a2a", intensite: 1.3, rayon: 40 },
      { pos: lamps[0].positionLampe(), couleur: "#FF9A3D", intensite: 1.0, rayon: 8 },
      { pos: [0, 2, 8], couleur: "#ff7a2a", intensite: 0.35, rayon: 26 }
    ];
    var pluie = K.particules.pluie({ n: 7000, zone: { min: [-12, -2, -12], max: [12, 10, 12] }, suivre: true, avance: 8, vitesse: [0.8, -10, 0.3], longueur: 0.45, largeur: 0.01, couleur: "#7f8fae", opacite: 0.75, lumieres: lumP });
    s.add(pluie);
    var ronds = K.particules.ronds({ n: 900, zone: { min: [-40, -1.99, -13], max: [40, -1.99, 13] }, periode: 0.6, rayon: 0.12, couleur: "#9aa6c0", opacite: 0.6, lumieres: lumP });
    s.add(ronds);
    var rondsT = K.particules.ronds({ n: 400, zone: { min: [-14, 0.17, 15], max: [14, 0.17, 26.8] }, periode: 0.55, rayon: 0.07, couleur: "#9aa6c0", opacite: 0.7, lumieres: lumP });
    s.add(rondsT);
    // les reflets : le feu sur la Rive (de longues traînées), les lampadaires
    var reflets = [];
    [-22, -9, 4, 17, 28].forEach(function (x, i) { reflets.push(K.look.reflet({ pos: [x, 10, -25], sol: -2, couleur: "#ff7a2a", intensite: 1.2 - (i % 2) * 0.3, largeur: 7, longueur: 34 })); });
    lamps.forEach(function (l) { reflets.push(K.look.reflet({ pos: l.positionLampe(), sol: -2, couleur: "#FF9A3D", intensite: 0.9, largeur: 1.4, longueur: 14 })); });
    halLamps.forEach(function (l) { reflets.push(K.look.reflet({ pos: l.positionLampe(), sol: -2, couleur: "#FF9A3D", intensite: 0.7, largeur: 1.2, longueur: 12 })); });
    reflets.forEach(function (r) { s.add(r); });
    // le reflet vivant de l'autre rive dans le verre de la vitrine
    var miroir = refletVivant(K, ctx, 27.0);
    ag.reflet.material = miroir.materiau;
    var lueurLac = K.look.halo({ couleur: "#7fe6cf", taille: 0.2, intensite: 0.55 }); lueurLac.position.set(0.71, 1.2, 28.06); s.add(lueurLac);
    var mq = ag.maquette;
    var caches = [derriere, pluie, ronds, rondsT];
    return {
      scene: s, agence: ag, tribune: est,
      look: { bloom: 0.35, rayon: 0.4, seuil: 1.4, exposition: 1.05, contraste: 1.16, saturation: 0.98 },
      maj: function (t, c) {
        var fl = function (i) { return 0.8 + 0.2 * K.bruit1(t * 6 + i * 2.3, 21 + i) + 0.08 * K.bruit1(t * 19 + i, 6); };
        est.toit(t);
        feu.maj(t, 1); nappeD.maj(t, 1); flambee.maj(t, K.lisse(T_TOIT + 0.35, T_TOIT + 1.4, t)); brs.maj(t); fumees.forEach(function (f) { f.maj(t); });
        est.braisesBois.forEach(function (m, i) { m.emissiveIntensity = (i === 3 ? 0.5 : 1.0) * fl(i + 3); });
        lumHaut.intensity = 2600 * fl(0); lumBas.intensity = 120 * fl(1);
        lueur.intensity = 40 * fl(2);
        lueurs.forEach(function (h, i) { h.intensite(halo * 0.14 * fl(i + 8)); });
        mq.mLac.emissiveIntensity = 1.0 + 0.04 * Math.sin(t * 1.3);
        lueurLac.intensite(0.55 * (0.95 + 0.05 * Math.sin(t * 1.3)));
        pluie.maj(t, c.camera); ronds.maj(t); rondsT.maj(t);
        rides.offset.set(t * 0.006, t * 0.011);
        lamps.forEach(function (l) { l.maj(t); }); halLamps.forEach(function (l) { l.maj(t); });
        reflets.forEach(function (r, i) { r.maj(c.camera, i < 5 ? fl(i + 5) : 1 - 0.1 * Math.max(0, K.bruit1(t * 3 + i, 9 + i))); });
        // le reflet de l'autre rive dans la vitrine, rendu pour cette image (le plan qui le montre)
        if (c.plan && c.plan.reflet) { miroir.materiau.uniforms.uForce.value = c.plan.reflet; miroir.rendre(s, c.camera, caches); }
        else miroir.materiau.uniforms.uForce.value = 0;
      }
    };
  }

  FC.film({
    id: "chene_1931",
    livre: "geant_dechu",
    titre: "Chêne de 1931",
    duree: 36.8,
    musique: "livre_h5",
    musiqueFilm: "film_chene_1931",
    secours: "sombre",
    couleur: VERT,
    affiche: 22.4,
    habillage: { vignette: 0.6, grain: 0.07, ratioPaysage: 2.35, ratioPortrait: 0 },
    sortie: { noir: 1.2 },
    sons: [[0.5, "sirene"], [3.3, "sirene"], [22.2, "tampon_fin"]],
    textes: [
      { sorte: "lieu", de: 1.0, a: 5.8, texte: "Aubérive, stade de la Rive", sous: "27 novembre 1999 · 3 h 10" },
      { sorte: "replique", de: 6.8, a: 11.6, qui: "Le lieutenant", texte: "L'Est, on la laisse. Toutes les lances sur la Nord." },
      { sorte: "lieu", de: 21.0, a: 24.6, texte: "3 h 40", sous: "" },
      { sorte: "titre", de: 33.6, a: 36.4, texte: "Aubérive · 1999", sous: "La Maquette", entree: 0.2, sortie: 0.7 }
    ],
    // la coupe de 30 s (l'aperçu de l'App Store) : les sept plans, resserrés
    montages: { court: [[0.4, 5.8], [6.4, 11.6], [12.2, 15.6], [16.6, 19.8], [20.6, 24.8], [25.8, 28.6], [31.2, 36.8]] },
    preparer: function (K, ctx) {
      return K.etapes(ctx, [
        function () { ctx.decors.stade = decorStadeFeu(K, ctx); },
        function () { ctx.decors.quai = decorQuaiFeu(K, ctx); }
      ]);
    },
    plans: [
      // 1 · le feu : au ras de la pelouse trempée, la tribune Est d'un bloc
      { de: 0, a: 6.2, decor: "stade", entree: "noir", transition: 1.2, fixe: 3.2,
        camera: { pos: K_cles([[0, [5, 0.55, 12]], [6.2, [3.2, 0.85, 2]]], "lin"), cible: K_cles([[0, [0, 8.2, -40]], [6.2, [-1, 7.6, -40]]], "lin"), fov: 52, epaule: 0.1 } },
      // 2 · la Nord : le feu dans le dos de la caméra ; les pompiers de dos, trois lances sur
      // le toit de la Nord, la vapeur, les gyrophares
      { de: 6.2, a: 12.0, decor: "stade", entree: "coupe", fixe: 2.8,
        camera: { pos: K_cles([[0, [-27, 1.5, -27]], [5.8, [-33, 1.6, -22.5]]], "douce"), cible: K_cles([[0, [-50, 3.4, -15]], [5.8, [-54, 3.8, -14]]], "douce"), fov: 52, epaule: 0.1 } },
      // 3 · Gégé, de profil contre le feu : il tourne la tête vers l'Est, et ne lâche pas
      { de: 12.0, a: 16.4, decor: "stade", entree: "coupe", fixe: 2.8,
        camera: { pos: K_cles([[0, [-47.6, 1.55, -4.4]], [4.4, [-47.2, 1.6, -5.4]]], "lin"), cible: [-38.5, 2.1, -26], fov: 32, epaule: 0.14 } },
      // 4 · la 14B : le numéro au pochoir, les flammes qui montent du rang A
      { de: 16.4, a: 20.4, decor: "stade", entree: "coupe", fixe: 2.6,
        camera: { pos: K_cles([[0, [0.55, 2.3, -35.2]], [4.0, [0.3, 2.2, -35.55]]], "lin"), cible: [0.0, 1.98, -37.06], fov: 30, epaule: 0.12 } },
      // 5 · le toit : à 21,6 s le milieu tombe, la gerbe, le feu double
      { de: 20.4, a: 25.6, decor: "stade", entree: "coupe", fixe: 2.0,
        camera: { pos: K_cles([[0, [-34, 9, 6]], [5.2, [-33, 8.6, 3]]], "lin"), cible: [2, 7, -40], fov: 40, epaule: 0.1 } },
      // 6 · l'autre rive : le feu derrière le dos de l'Est, la Rive rouge
      { de: 25.6, a: 30.6, decor: "quai", entree: "coupe", fixe: 2.6,
        camera: { pos: K_cles([[0, [-7, 0.9, 13.6]], [5.0, [-4.5, 1.0, 13.6]]], "lin"), cible: [2, 9, -30], fov: 54, epaule: 0.08 } },
      // 7 · la vitrine : la maquette dans le noir, le lac ; dans le verre, la vraie tribune brûle
      { de: 30.6, a: 36.8, decor: "quai", entree: "coupe", fixe: 4.2, reflet: 0.45,
        camera: { pos: K_cles([[0, [1.4, 1.6, 17.5]], [6.2, [0.85, 1.42, 25.3]]], "douce"), cible: K_cles([[0, [0.7, 2.0, 27.5]], [6.2, [0.7, 1.42, 28.1]]], "douce"), fov: K_cles([[0, 42], [6.2, 30]], "douce"), epaule: 0.06 } }
    ]
  });

  // les aides de la trousse, lues quand le film tourne (la trousse est chargée avant le film)
  function K_() { return FC.kit; }
  function K_cles(p, a) { var f = null; return function (t) { if (!f) f = K_().cles(p, a); return f(t); }; }
})(typeof window !== "undefined" ? window : this);
