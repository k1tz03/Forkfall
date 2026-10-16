/* ═══════════════════════════════════════════════════════════════════════════
   LA TROUSSE DU CINÉMA — 20 : le rendu (le « look »).

   Un moteur de rendu par film, réglé selon la qualité :
     haute    le tournage (tournage.js) et un ordinateur : ombres 2048, bloom à
              demi-résolution, particules et textures pleines, sans MSAA (au
              logiciel il double le temps d'une image ; le grain le couvre)
     moyenne  un bon téléphone : résolution × 0,85 (DPR ≤ 1,5), bloom à
              demi-résolution, ombres 1024, 30 images/s
     basse    un téléphone faible : résolution × 0,7 (DPR 1), sans bloom ni
              ombres, particules au tiers, 30 images/s — les halos peints
              (K.look.halo) tiennent la lumière à la place du bloom
   La chaîne : la scène en HDR (demi-flottants) → [le fondu enchaîné] → le
   bloom → la tonalité filmique (ACES) et le sRGB → l'étalonnage (contraste,
   ombres bleutées, hautes lumières chaudes, saturation). Le vignettage, le
   grain, les bandes et les textes sont l'habillage (30_habillage.js), dessiné
   par-dessus : le même code en direct et au tournage.

   Les aides de la lumière : un ciel en dégradé, une carte d'environnement
   tirée de ce ciel (les reflets mouillés), le brouillard, les halos peints,
   l'éclat anamorphique (la ligne horizontale des projecteurs), le cône de
   lumière (le faisceau dans la pluie).
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var K = global.FusibleCinema.kit;
  var T = K.T;

  var QUALITES = {
    // le tournage : pas de MSAA (au logiciel, il double le temps d'une image ; le grain et
    // la compression le rendent invisible), le bloom à demi-résolution (il est flou de toute façon)
    // partage : les matières d'un genre partagent une texture teinte (10_textures.js) ;
    // envTaille : la carte d'environnement (les reflets mouillés sont flous de toute façon)
    haute: { nom: "haute", echelle: 1, dprMax: 2, bloom: 0.5, ombres: true, ombreTaille: 2048, msaa: 0, particules: 1, textures: 1, ips: 60, foule: 1, partage: false, envTaille: 256 },
    moyenne: { nom: "moyenne", echelle: 0.85, dprMax: 1.5, bloom: 0.5, ombres: true, ombreTaille: 1024, msaa: 0, particules: 0.6, textures: 0.75, ips: 30, foule: 0.75, partage: true, envTaille: 64 },
    basse: { nom: "basse", echelle: 0.7, dprMax: 1, bloom: 0, ombres: false, ombreTaille: 512, msaa: 0, particules: 0.35, textures: 0.5, ips: 30, foule: 0.45, partage: true, envTaille: 64 }
  };
  // la qualité de départ d'un appareil : les indices qu'il donne de lui-même
  function qualiteAppareil() {
    var n = global.navigator || {}, coeurs = n.hardwareConcurrency || 4, mem = n.deviceMemory || 4;
    var tactile = global.matchMedia && global.matchMedia("(pointer: coarse)").matches;
    // la haute qualité garde une texture par matière (le film de référence : ~550 Mo) : un
    // ordinateur qui a de la mémoire, pas un téléphone (moyenne : ~110 Mo, basse : ~50 Mo)
    if (!tactile && coeurs >= 8 && mem >= 8) return "haute";
    if (coeurs <= 4 || mem <= 3) return "basse";
    return "moyenne";
  }

  // ─── la sortie : la tonalité filmique (ACES, la même que three.js), le sRGB, puis
  // l'étalonnage dans l'espace de l'écran — une seule passe plein écran au lieu de deux
  // (OutputPass puis l'étalonnage) : au tournage, chaque passe coûte une demi-seconde
  var ETALONNAGE = {
    uniforms: {
      tDiffuse: { value: null }, uContraste: { value: 1.08 }, uSaturation: { value: 0.92 },
      uOmbres: { value: null }, uLumieres: { value: null }, uNoirs: { value: 0.012 }, uExpo: { value: 1 }
    },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader: [
      "uniform sampler2D tDiffuse; uniform float uContraste, uSaturation, uNoirs, uExpo; uniform vec3 uOmbres, uLumieres; varying vec2 vUv;",
      "vec3 rrt(vec3 v){ vec3 a = v * (v + 0.0245786) - 0.000090537; vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081; return a / b; }",
      "vec3 aces(vec3 c){",
      "  const mat3 I = mat3(vec3(0.59719, 0.07600, 0.02840), vec3(0.35458, 0.90834, 0.13383), vec3(0.04823, 0.01566, 0.83777));",
      "  const mat3 O = mat3(vec3(1.60475, -0.10208, -0.00327), vec3(-0.53108, 1.10813, -0.07276), vec3(-0.07367, -0.00605, 1.07602));",
      "  c *= uExpo / 0.6; c = O * rrt(I * c); return clamp(c, 0.0, 1.0); }",
      "vec3 srgb(vec3 c){ return mix(pow(c, vec3(0.41666)) * 1.055 - vec3(0.055), c * 12.92, vec3(lessThanEqual(c, vec3(0.0031308)))); }",
      "void main(){",
      "  vec4 c = texture2D(tDiffuse, vUv); vec3 x = srgb(aces(max(c.rgb, vec3(0.0))));",
      "  float l = dot(x, vec3(0.2126, 0.7152, 0.0722));",
      // les ombres prennent la couleur de la nuit, les hautes lumières celle des lampes
      "  x += uOmbres * (1.0 - smoothstep(0.0, 0.45, l)) * 0.06 + uLumieres * smoothstep(0.45, 1.0, l) * 0.05;",
      "  x = mix(vec3(l), x, uSaturation);",
      "  x = (x - 0.5) * uContraste + 0.5;",
      "  x = max(x, vec3(0.0)) * (1.0 - uNoirs) + uNoirs;",
      "  gl_FragColor = vec4(clamp(x, 0.0, 1.0), c.a);",
      "}"
    ].join("\n")
  };
  // le fondu enchaîné : l'autre plan, rendu à part, mêlé au plan courant
  var MELANGE = {
    uniforms: { tDiffuse: { value: null }, tAutre: { value: null }, uMix: { value: 0 } },
    vertexShader: ETALONNAGE.vertexShader,
    fragmentShader: "uniform sampler2D tDiffuse, tAutre; uniform float uMix; varying vec2 vUv; void main(){ gl_FragColor = mix(texture2D(tAutre, vUv), texture2D(tDiffuse, vUv), uMix); }"
  };

  // ─── le moteur de rendu d'un film
  //  o = { canvas, largeur, hauteur (pixels de la mémoire d'image), qualite, tournage: bool }
  function Rendu(o) {
    var THREE = T(), q = QUALITES[o.qualite] || QUALITES.moyenne;
    var r = new THREE.WebGLRenderer({ canvas: o.canvas, antialias: false, alpha: false, depth: true, stencil: false,
      powerPreference: "high-performance", preserveDrawingBuffer: !!o.tournage });
    r.setPixelRatio(1);
    r.setSize(o.largeur, o.hauteur, false);
    // la tonalité se fait dans la passe de sortie (ETALONNAGE), pas dans les matériaux
    r.toneMapping = THREE.NoToneMapping;
    r.toneMappingExposure = 1.0;
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.shadowMap.enabled = !!q.ombres;
    r.shadowMap.type = THREE.PCFShadowMap;   // r186 : le PCF « doux » est le PCF, flouté par shadow.radius
    r.setClearColor(0x000000, 1);
    var rt = new THREE.WebGLRenderTarget(o.largeur, o.hauteur, { type: THREE.HalfFloatType, samples: q.msaa || 0 });
    var composer = new THREE.EffectComposer(r, rt);
    var rp = new THREE.RenderPass(new THREE.Scene(), new THREE.PerspectiveCamera());
    composer.addPass(rp);
    var melange = new THREE.ShaderPass(MELANGE);
    melange.enabled = false;
    composer.addPass(melange);
    var bloom = null;
    if (q.bloom > 0) {
      bloom = new THREE.UnrealBloomPass(new THREE.Vector2(Math.round(o.largeur * q.bloom), Math.round(o.hauteur * q.bloom)), 0.7, 0.55, 0.9);
      composer.addPass(bloom);
    }
    var etal = new THREE.ShaderPass(ETALONNAGE);
    etal.uniforms.uOmbres.value = new THREE.Vector3(0.0, 0.08, 0.16);
    etal.uniforms.uLumieres.value = new THREE.Vector3(0.14, 0.06, -0.04);
    composer.addPass(etal);
    var autre = null;   // la cible du fondu enchaîné, créée au premier fondu

    var R = {
      renderer: r, composer: composer, qualite: q, bloom: bloom, etalonnage: etal,
      largeur: o.largeur, hauteur: o.hauteur,
      taille: function (w, h) {
        R.largeur = w; R.hauteur = h;
        r.setSize(w, h, false);
        composer.setSize(w, h);
        if (bloom) bloom.setSize(Math.round(w * q.bloom), Math.round(h * q.bloom));
        if (autre) autre.setSize(w, h);
      },
      // le look d'un plan : la force du bloom, l'exposition, l'étalonnage
      regler: function (l) {
        l = l || {};
        if (bloom) { bloom.strength = l.bloom == null ? 0.7 : l.bloom; bloom.radius = l.rayon == null ? 0.55 : l.rayon; bloom.threshold = l.seuil == null ? 0.9 : l.seuil; }
        etal.uniforms.uExpo.value = l.exposition == null ? 1 : l.exposition;
        etal.uniforms.uContraste.value = l.contraste == null ? 1.08 : l.contraste;
        etal.uniforms.uSaturation.value = l.saturation == null ? 0.92 : l.saturation;
        etal.uniforms.uNoirs.value = l.noirs == null ? 0.0 : l.noirs;
      },
      // une image : la scène et sa caméra ; `fondu` = { scene, camera, mix } pour un fondu enchaîné
      rendre: function (scene, camera, fondu) {
        if (fondu && fondu.mix < 1) {
          if (!autre) autre = new THREE.WebGLRenderTarget(R.largeur, R.hauteur, { type: THREE.HalfFloatType, samples: q.msaa || 0 });
          r.setRenderTarget(autre);
          r.clear();
          r.render(fondu.scene, fondu.camera);
          r.setRenderTarget(null);
          melange.enabled = true;
          melange.uniforms.tAutre.value = autre.texture;
          melange.uniforms.uMix.value = fondu.mix;
        } else melange.enabled = false;
        rp.scene = scene; rp.camera = camera;
        r.info.autoReset = false; r.info.reset();
        composer.render();
      },
      // la compilation des shaders avant le premier plan (pas d'à-coup au milieu du film)
      compiler: function (scene, camera) { try { r.compile(scene, camera); } catch (e) { /* le premier rendu le fera */ } },
      // ce que coûte l'image (les appels, les triangles), pour le banc
      info: function () { return { appels: r.info.render.calls, triangles: r.info.render.triangles, textures: r.info.memory.textures, geometries: r.info.memory.geometries }; },
      detruire: function () {
        try { composer.dispose && composer.dispose(); } catch (e) { /* rien */ }
        try { rt.dispose(); if (autre) autre.dispose(); } catch (e) { /* rien */ }
        try { r.dispose(); r.forceContextLoss && r.forceContextLoss(); } catch (e) { /* rien */ }
      }
    };
    return R;
  }

  // ─── le ciel : une sphère en dégradé (le zénith, l'horizon, une lueur de ville)
  //  o = { zenith, horizon, lueur, lueurDir: [x, z], rayon }
  function ciel(o) {
    o = o || {};
    var THREE = T();
    var mat = new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: {
        uZenith: { value: new THREE.Color(o.zenith || "#05070f") }, uHorizon: { value: new THREE.Color(o.horizon || "#1b1f33") },
        uLueur: { value: new THREE.Color(o.lueur || "#5a3420") }, uDir: { value: new THREE.Vector3(o.lueurDir ? o.lueurDir[0] : 0, 0, o.lueurDir ? o.lueurDir[1] : -1).normalize() },
        uForce: { value: o.force == null ? 1 : o.force }
      },
      vertexShader: "varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * p; gl_Position.z = gl_Position.w; }",
      fragmentShader: [
        "uniform vec3 uZenith, uHorizon, uLueur, uDir; uniform float uForce; varying vec3 vDir;",
        "void main(){",
        "  float h = clamp(vDir.y, -0.2, 1.0);",
        "  vec3 c = mix(uHorizon, uZenith, smoothstep(0.0, 0.55, h));",
        "  float l = pow(max(dot(normalize(vec3(vDir.x, 0.0, vDir.z)), uDir), 0.0), 3.0) * (1.0 - smoothstep(0.0, 0.35, h));",
        "  c += uLueur * l * uForce;",
        "  c = mix(c, uHorizon * 0.5, smoothstep(0.0, -0.2, h));",
        "  gl_FragColor = vec4(c, 1.0);",
        "}"
      ].join("\n")
    });
    var m = new THREE.Mesh(new THREE.SphereGeometry(o.rayon || 400, 32, 16), mat);
    m.renderOrder = -10; m.frustumCulled = false;
    K.garder(mat); K.garder(m.geometry);
    return m;
  }
  // la carte d'environnement tirée d'un ciel (et de quelques fenêtres au loin) : ce
  // que reflètent l'asphalte mouillé, le métal, la vitre du cadre
  function environnement(rendu, o) {
    o = o || {};
    var THREE = T(), s = new THREE.Scene();
    s.add(ciel(o));
    var r = K.alea(o.graine || "env");
    var n = o.fenetres == null ? 26 : o.fenetres;
    for (var i = 0; i < n; i++) {
      var a = r() * Math.PI * 2, d = 60 + r() * 40, h = 2 + r() * 18;
      var m = new THREE.Mesh(new THREE.PlaneGeometry(2 + r() * 5, 1 + r() * 3),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(r.choix(o.teintes || ["#FFB060", "#FFD49A", "#9FC4FF", "#FF7A50"])).multiplyScalar(0.6 + r() * 1.4), side: THREE.DoubleSide }));
      m.position.set(Math.cos(a) * d, h, Math.sin(a) * d); m.lookAt(0, h, 0);
      s.add(m);
    }
    (o.lampes || []).forEach(function (l) {
      var m = new THREE.Mesh(new THREE.SphereGeometry(l.taille || 3, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(l.couleur || "#ffffff").multiplyScalar(l.intensite || 6) }));
      m.position.set(l.pos[0], l.pos[1], l.pos[2]);
      s.add(m);
    });
    var pm = new THREE.PMREMGenerator(rendu.renderer);
    var env = pm.fromScene(s, 0.035, 0.1, 100, { size: (K.qualite && K.qualite.envTaille) || 256 }).texture;
    pm.dispose();
    s.traverse(function (x) { if (x.geometry) x.geometry.dispose(); if (x.material) x.material.dispose(); });
    K.garder(env);
    return env;
  }
  // le brouillard : exponentiel, de la couleur de l'horizon
  function brouillard(scene, couleur, densite) {
    var THREE = T();
    scene.fog = new THREE.FogExp2(new THREE.Color(couleur || "#0d1222"), densite == null ? 0.03 : densite);
    return scene.fog;
  }

  // ─── les lumières peintes
  // un halo (un globe, une lampe vue de loin) : un sprite additif, qui ne s'éteint
  // pas avec le bloom (il le remplace sur un téléphone faible)
  function halo(o) {
    o = o || {};
    var THREE = T();
    var m = new THREE.SpriteMaterial({ map: K.tex.halo({ coeur: o.coeur || 0.12 }), color: new THREE.Color(o.couleur || "#FFD49A").multiplyScalar(o.intensite == null ? 1 : o.intensite),
      blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false, toneMapped: o.toneMapped === true });
    var s = new THREE.Sprite(m);
    s.scale.set(o.taille || 1, o.taille || 1, 1);
    s.renderOrder = 5;
    K.garder(m);
    s.intensite = function (k) { m.color.set(o.couleur || "#FFD49A").multiplyScalar(k); };
    return s;
  }
  // l'éclat anamorphique : la ligne horizontale qui traverse un projecteur
  function eclat(o) {
    o = o || {};
    var THREE = T();
    var m = new THREE.SpriteMaterial({ map: K.tex.halo({ coeur: 0.04 }), color: new THREE.Color(o.couleur || "#BFD8FF").multiplyScalar(o.intensite == null ? 0.6 : o.intensite),
      blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false, toneMapped: false });
    var s = new THREE.Sprite(m);
    s.scale.set(o.largeur || 12, o.hauteur || 0.18, 1);
    s.renderOrder = 6;
    K.garder(m);
    s.intensite = function (k) { m.color.set(o.couleur || "#BFD8FF").multiplyScalar(k); };
    return s;
  }
  // le cône de lumière : le faisceau qu'on voit dans la pluie et la fumée. Posé à la
  // source, il descend le long de -Y de son groupe (l'orienter avec lookAt + rotation).
  //  o = { longueur, rayonHaut, rayonBas, couleur, intensite, poussiere }
  function cone(o) {
    o = o || {};
    var THREE = T(), L = o.longueur || 10;
    var g = new THREE.CylinderGeometry(o.rayonHaut || 0.2, o.rayonBas || 3, L, 40, 12, true);
    g.translate(0, -L / 2, 0);
    var mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
      uniforms: { uCouleur: { value: new THREE.Color(o.couleur || "#FFE7C0") }, uForce: { value: o.intensite == null ? 0.35 : o.intensite }, uL: { value: L }, uT: { value: 0 }, uPoussiere: { value: o.poussiere == null ? 0.5 : o.poussiere } },
      vertexShader: [
        "varying vec3 vN, vV; varying float vY; varying vec3 vP;",
        "void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); vY = -position.y; vP = position; gl_Position = projectionMatrix * mv; }"
      ].join("\n"),
      fragmentShader: [
        "uniform vec3 uCouleur; uniform float uForce, uL, uT, uPoussiere; varying vec3 vN, vV; varying float vY; varying vec3 vP;",
        "float h(vec3 p){ return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }",
        "float n3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);",
        "  return mix(mix(mix(h(i), h(i+vec3(1,0,0)), f.x), mix(h(i+vec3(0,1,0)), h(i+vec3(1,1,0)), f.x), f.y),",
        "             mix(mix(h(i+vec3(0,0,1)), h(i+vec3(1,0,1)), f.x), mix(h(i+vec3(0,1,1)), h(i+vec3(1,1,1)), f.x), f.y), f.z); }",
        "void main(){",
        "  float bord = pow(abs(dot(normalize(vN), normalize(vV))), 1.6);",
        "  float lg = 1.0 - smoothstep(0.0, uL, vY);",
        "  float tete = smoothstep(0.0, uL * 0.04, vY);",
        "  float p = mix(1.0, 0.55 + 0.9 * n3(vP * 1.3 + vec3(0.0, uT * 0.35, uT * 0.2)), uPoussiere);",
        "  gl_FragColor = vec4(max(uCouleur * uForce * bord * lg * tete * p, vec3(0.0)), 1.0);",
        "}"
      ].join("\n")
    });
    var m = new THREE.Mesh(g, mat);
    m.renderOrder = 4; m.frustumCulled = false;
    K.garder(g); K.garder(mat);
    m.maj = function (t, force) { mat.uniforms.uT.value = t; if (force != null) mat.uniforms.uForce.value = force; };
    return m;
  }
  // le reflet d'une lumière sur un sol mouillé : la traînée verticale des films noirs (une
  // vraie réflexion coûterait la scène deux fois). Un quadrilatère posé au sol sous la
  // lumière, allongé vers la caméra, plus fort dans les flaques ; maj(camera) le tourne.
  //  o = { pos: [x, y, z] (la lumière), sol: 0, couleur, intensite, largeur, longueur, flaques: texture }
  var RIDES = null;
  function rides() {
    if (RIDES) return RIDES;
    var W = 64, H = 256, c = K.tex.canvas(W, H), x = c.getContext("2d"), im = x.createImageData(W, H), d = im.data;
    for (var j = 0; j < H; j++) for (var i = 0; i < W; i++) {
      // v : la coordonnée de texture (0 au pied de la lumière ; la toile est retournée)
      var u = i / (W - 1) - 0.5, v = 1 - j / (H - 1);
      var trav = Math.exp(-u * u * 18) * (0.65 + 0.35 * Math.sin(v * 70 + Math.sin(v * 13) * 3)) * (0.75 + 0.25 * K.h01(j, 3));
      var long = Math.pow(1 - v, 1.6) * K.lisse(0, 0.04, v);
      var a = Math.max(0, Math.min(1, trav * long));
      var p = (j * W + i) * 4; d[p] = d[p + 1] = d[p + 2] = 255 * a; d[p + 3] = 255;
    }
    x.putImageData(im, 0, 0);
    RIDES = K.tex.texture(c, { clamp: true, donnee: true });
    return RIDES;
  }
  function reflet(o) {
    o = o || {};
    var THREE = T(), L = o.longueur || 6, Wd = o.largeur || 0.7;
    var g = K.garder(new THREE.PlaneGeometry(Wd, L));
    g.translate(0, L / 2, 0); g.rotateX(Math.PI / 2);   // posé au sol, il part de la lumière vers +z (puis on le tourne)
    var m = K.garder(new THREE.MeshBasicMaterial({ map: rides(), color: new THREE.Color(o.couleur || "#FF9A3D").multiplyScalar(o.intensite == null ? 1 : o.intensite),
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: true, side: THREE.DoubleSide }));
    var r = new THREE.Mesh(g, m);
    var pied = new THREE.Vector3(o.pos[0], (o.sol || 0) + 0.012, o.pos[2]);
    r.position.copy(pied); r.renderOrder = 2; r.frustumCulled = false;
    var v = new THREE.Vector3();
    r.maj = function (camera, k) {
      camera.getWorldPosition(v);
      r.rotation.set(0, Math.atan2(v.x - pied.x, v.z - pied.z), 0);
      if (k != null) m.color.set(o.couleur || "#FF9A3D").multiplyScalar((o.intensite == null ? 1 : o.intensite) * k);
    };
    return r;
  }

  // une lumière ponctuelle ou un projecteur, avec ses ombres si la qualité le permet
  function projecteur(o) {
    o = o || {};
    var THREE = T(), q = K.qualite || QUALITES.moyenne;
    var l = new THREE.SpotLight(o.couleur || "#FFF1DC", o.intensite == null ? 50 : o.intensite, o.portee || 0, o.angle || 0.5, o.penombre == null ? 0.5 : o.penombre, o.decroissance == null ? 2 : o.decroissance);
    if (o.ombre && q.ombres) {
      l.castShadow = true;
      l.shadow.mapSize.set(o.ombreTaille || q.ombreTaille, o.ombreTaille || q.ombreTaille);
      l.shadow.bias = o.biais == null ? -0.0004 : o.biais;
      l.shadow.normalBias = 0.02;
      l.shadow.radius = 3;
      l.shadow.camera.near = o.pres || 0.1; l.shadow.camera.far = o.loin || 60;
    }
    return l;
  }
  function ponctuelle(o) {
    o = o || {};
    var THREE = T();
    return new THREE.PointLight(o.couleur || "#FFD49A", o.intensite == null ? 5 : o.intensite, o.portee || 0, o.decroissance == null ? 2 : o.decroissance);
  }

  K.QUALITES = QUALITES;
  K.qualiteAppareil = qualiteAppareil;
  K.qualite = QUALITES.moyenne;
  K.look = { Rendu: Rendu, ciel: ciel, environnement: environnement, brouillard: brouillard, halo: halo, eclat: eclat, cone: cone, reflet: reflet,
    projecteur: projecteur, ponctuelle: ponctuelle, ETALONNAGE: ETALONNAGE };
})(typeof window !== "undefined" ? window : this);
