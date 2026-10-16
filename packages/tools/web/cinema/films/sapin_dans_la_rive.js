/* ═══════════════════════════════════════════════════════════════════════════
   « Un sapin dans la Rive » — le second film du livre 2, « Le Sapin en carton »
   (1990-1992, l'intérimaire ; la couleur du livre : #6FB0E8).

   La nuit de la Rive (S1, créneau 16, la carte en.h2.s1.rive : « Une heure du
   matin, sous tes fenêtres du quai. Un bruit d'eau énorme, puis plus rien. Le
   car du club est garé, tous feux éteints. Dans la Rive, des bulles, et un
   sapin en carton qui tourne. »). Le film se joue avant la carte : ces
   secondes-là, rien de plus.
     · le quai de la Rive à une heure du matin, de ta fenêtre : l'eau noire, les
       sodiums, la brume, le car du club garé, tous feux éteints ;
     · dedans, l'appartement du quai (il y dormait, c'est payé jusqu'en juin) :
       sur la table, le trousseau et son étiquette à l'encre, « R. M. — ne pas
       perdre » (la carte du verdict) ; au plafond, la lumière de l'eau ;
     · le bruit d'eau énorme, qu'on ne voit pas : au plafond, la lumière de
       l'eau s'affole ; dehors, des ronds sur la Rive, puis plus rien ;
     · le car, tous feux éteints ; la phrase du répondeur, celle de janvier (la
       carte du message, à tous), qu'on entend sans qu'on la dise : « Ne me
       cherche pas. » — la voix de l'absent, sur l'eau où son sapin va remonter.
       (« Ne monte jamais seul… » aurait mis le héros au masculin : le film reste
       au neutre) ;
     · dans la Rive, des bulles, une moire d'essence, et un sapin en carton qui
       remonte et tourne.
   Ce que le film ne montre pas : ce qui est tombé (le lendemain, les plongeurs
   le diront), qui est dans le car, les traces de pneus, l'homme au briquet — la
   carte et ses deux réponses le gardent.

   LES PLANS (33,5 s) — un seul décor, le quai et l'appartement du deuxième, pour
   que la lumière de l'eau soit la même dehors et au plafond :
     1  0–5,5     dehors, devant ta fenêtre, de haut : la Rive, les reflets des
                  lampes de l'autre rive, la brume ; le regard descend jusqu'au
                  quai et au car garé ; carton « Aubérive, quai de la Rive / Une
                  heure du matin »                             (le lieu, l'heure)
     2  5,5–12    dedans : le trousseau sur la table, l'étiquette « R. M. — ne
                  pas perdre » ; la caméra monte au plafond, la lumière de l'eau
                  qui ondule ; le bruit d'eau (10,33 s) : elle s'affole
                                                              (chez lui, chez toi)
     3  12–16     de ta fenêtre, par-dessus le quai : des ronds sur la Rive, qui
                  s'élargissent et cassent le reflet d'une lampe d'en face ;
                  puis plus rien                               (un bruit d'eau)
     4  16–21     sur le quai, au bord de l'eau : le car, tous feux éteints, le
                  long des réverbères ; la phrase du répondeur (16,6–20,6)
                                                              (ne me cherche pas)
     5  21–26     au-dessus de l'eau, bas, dos au quai : des bulles qui crèvent,
                  une moire d'essence dans un reflet ; le sapin en carton
                  remonte (23 s), ses petits ronds                  (des bulles)
     6  26–33,5   le sapin qui tourne sur l'eau noire, de haut ; la caméra
                  s'élève jusqu'à ta fenêtre, l'objectif se resserre (le sapin
                  garde sa taille, le monde grandit autour) ; carton « Aubérive
                  · 1992 / Le Sapin en carton », sous le sapin
   La lumière : le sodium des réverbères du quai et son reflet (l'eau est un
   miroir noir), la brume, la lumière de l'eau au plafond ; le bleu du livre
   dans la nuit. Le son : le thème du livre (« Le Répondeur » ; au tournage, le
   bruit d'eau tombe sur le début de sa boucle), le bruit d'eau (trois coups
   sourds), rien d'autre.
   La coupe de 30 s (l'App Store) : les mêmes plans, resserrés (montages.court).
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var FC = global.FusibleCinema;
  var PI = Math.PI;
  var BLEU = "#6FB0E8";
  // le plongeon tombe sur la caisse claire qui finit l'introduction du thème (au tournage), juste
  // avant le bip qui ouvre sa boucle
  var T_PLOUF = 10.33, T_SAPIN = 23.0;
  // le quai : l'eau en y = 0, le quai à 2,2 m, son bord en z = 0 ; la Rive vers -z
  var QUAI = 2.2;
  // là où c'est tombé, à trois mètres du bord ; le sapin remonte un peu plus loin
  var CENTRE = [-3.5, 0, -5.0], SAPIN = [-3.0, 0, -5.4];
  // le car, garé le long du quai, l'avant vers -x
  var CAR = [5.0, QUAI, 5.2];
  // l'appartement : au deuxième, sa fenêtre sur le quai (la façade en z = 14,3)
  // (assez haut pour voir l'eau par-dessus le quai : à cinq mètres du mur, la Rive se voit encore)
  var ETAGE = 8.6, MUR = 12.0, FENX = -1.0, FENY = ETAGE + 1.45, FENW = 1.3, FENH = 1.5;
  var VUE = [FENX, FENY + 0.05, MUR + 0.26];

  // ─── LES MATIÈRES PROPRES AU FILM ────────────────────────────────────────
  // le sapin en carton, mouillé : le même que celui du rétroviseur, plus sombre
  function sapinTexture(K) {
    var W = 128, H = 192, c = K.tex.canvas(W, H), x = c.getContext("2d");
    x.clearRect(0, 0, W, H);
    var forme = function () {
      x.beginPath(); x.moveTo(64, 14);
      [[100, 64], [80, 64], [112, 116], [86, 116], [122, 168], [72, 168], [72, 186], [56, 186], [56, 168], [6, 168], [42, 116], [16, 116], [48, 64], [28, 64]].forEach(function (p) { x.lineTo(p[0], p[1]); });
      x.closePath();
    };
    x.fillStyle = "#2a7438"; forme(); x.fill();
    x.save(); forme(); x.clip();
    for (var i = 0; i < 260; i++) {
      x.strokeStyle = "rgba(130,200,120," + (0.1 + K.h01(i, 3) * 0.3) + ")"; x.lineWidth = 1.2;
      var px = K.h01(i, 5) * W, py = 20 + K.h01(i, 7) * 150;
      x.beginPath(); x.moveTo(px, py); x.lineTo(px + (K.h01(i, 9) - 0.5) * 10, py + 6); x.stroke();
    }
    // l'eau a bu le carton : des auréoles plus sombres
    for (var j = 0; j < 14; j++) { var gx = K.h01(j, 21) * W, gy = 30 + K.h01(j, 23) * 140, r = 8 + K.h01(j, 25) * 18;
      var g = x.createRadialGradient(gx, gy, 1, gx, gy, r); g.addColorStop(0, "rgba(0,12,4,0.35)"); g.addColorStop(1, "rgba(0,12,4,0)"); x.fillStyle = g; x.fillRect(gx - r, gy - r, r * 2, r * 2); }
    x.restore();
    x.strokeStyle = "rgba(10,30,14,0.85)"; x.lineWidth = 2; forme(); x.stroke();
    x.fillStyle = "#d8d2c2"; x.beginPath(); x.arc(64, 22, 3, 0, 7); x.fill();
    return K.tex.texture(c, { clamp: true });
  }
  // l'étiquette du trousseau : un carton à œillet, l'encre bleue
  function etiquetteTexture(K) {
    var W = 256, H = 128, c = K.tex.canvas(W, H), x = c.getContext("2d");
    x.clearRect(0, 0, W, H);
    x.fillStyle = "#e6dcc2"; x.beginPath(); x.moveTo(30, 6); x.lineTo(W - 6, 6); x.lineTo(W - 6, H - 6); x.lineTo(30, H - 6); x.lineTo(6, H / 2); x.closePath(); x.fill();
    for (var i = 0; i < 900; i++) { x.fillStyle = "rgba(120,100,70," + (K.h01(i, 3) * 0.12) + ")"; x.fillRect(K.h01(i, 5) * W, K.h01(i, 7) * H, 2, 2); }
    x.fillStyle = "#1a1612"; x.beginPath(); x.arc(28, H / 2, 7, 0, 7); x.fill();
    x.strokeStyle = "#bfae86"; x.lineWidth = 3; x.beginPath(); x.arc(28, H / 2, 10, 0, 7); x.stroke();
    x.save(); x.translate(146, 52); x.rotate(-0.05); x.fillStyle = "#1e2c5a"; x.font = "italic 700 34px \"Space Mono\",monospace"; x.textAlign = "center"; x.textBaseline = "middle";
    x.fillText("R. M.", 0, 0); x.font = "italic 400 21px \"Space Mono\",monospace"; x.fillText("— ne pas perdre", 0, 38); x.restore();
    return K.tex.texture(c, { clamp: true });
  }
  // le voilage : un tulle blanc, ses plis
  function voilageTexture(K) {
    var W = 256, H = 256, c = K.tex.canvas(W, H), x = c.getContext("2d");
    for (var i = 0; i < W; i++) { var v = 0.5 + 0.5 * Math.sin(i / W * PI * 12) * Math.sin(i / W * PI * 3 + 1); x.fillStyle = "rgba(236,232,222," + (0.18 + v * 0.3) + ")"; x.fillRect(i, 0, 1, H); }
    var g = x.createLinearGradient(0, H * 0.85, 0, H); g.addColorStop(0, "rgba(236,232,222,0)"); g.addColorStop(1, "rgba(236,232,222,0.25)"); x.fillStyle = g; x.fillRect(0, 0, W, H);
    return K.tex.texture(c, {});
  }

  // ─── L'EAU : un miroir noir qui respire, ses ronds, la moire de l'essence ─
  // Un seul appel : la surface (de petites vagues, les ronds du plongeon et ceux du sapin, le
  // bouillon des premières secondes), le ciel et les sodiums qu'elle reflète (calculés, pas
  // rendus deux fois), la moire là où l'essence remonte, la brume selon la distance.
  function eau(K, THREE, o) {
    var NL = 4, lp = [], lc = [];
    for (var i = 0; i < NL; i++) { var l = o.lumieres[i]; lp.push(new THREE.Vector3().fromArray(l ? l.pos : [0, -999, 0])); lc.push(new THREE.Color(l ? l.couleur : "#000000").multiplyScalar(l ? l.intensite : 0)); }
    var m = new THREE.ShaderMaterial({
      uniforms: {
        uT: { value: 0 }, uT0: { value: T_PLOUF }, uT1: { value: T_SAPIN }, uC: { value: new THREE.Vector2(CENTRE[0], CENTRE[2]) }, uC1: { value: new THREE.Vector2(SAPIN[0], SAPIN[2]) },
        uLumPos: { value: lp }, uLumCoul: { value: lc },
        uCielBas: { value: new THREE.Color(o.cielBas) }, uCielHaut: { value: new THREE.Color(o.cielHaut) }, uFond: { value: new THREE.Color(o.fond) },
        uBrume: { value: new THREE.Color(o.brume) }, uDens: { value: o.densite }, uHuile: { value: 0 }
      },
      vertexShader: "varying vec3 vP; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vP = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",
      fragmentShader: [
        "uniform float uT, uT0, uT1, uDens, uHuile; uniform vec2 uC, uC1;",
        "uniform vec3 uLumPos[4]; uniform vec3 uLumCoul[4]; uniform vec3 uCielBas, uCielHaut, uFond, uBrume;",
        "varying vec3 vP;",
        "float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }",
        "float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);",
        "  return mix(mix(h1(i), h1(i + vec2(1.0, 0.0)), f.x), mix(h1(i + vec2(0.0, 1.0)), h1(i + vec2(1.0, 1.0)), f.x), f.y); }",
        // un train de ronds : trois crêtes qui s'éloignent d'un point, et s'amortissent
        "vec2 ronds(vec2 p, vec2 c, float s, float A0, float v){",
        "  vec2 g = vec2(0.0); if (s <= 0.0) return g;",
        "  vec2 q = p - c; float d = length(q) + 1e-4; vec2 u = q / d;",
        "  for (int k = 0; k < 3; k++) {",
        "    float sk = s - float(k) * 0.5; if (sk <= 0.0) continue;",
        "    float r = v * sk + 0.3;",
        "    float A = A0 * exp(-sk / 4.0) / (1.0 + 0.15 * r) * (1.0 - float(k) * 0.28);",
        "    float e = exp(-pow((d - r) / 0.6, 2.0));",
        "    g += u * A * 6.5 * cos((d - r) * 6.5) * e;",
        "  }",
        "  return g;",
        "}",
        "void main(){",
        "  vec2 p = vP.xz;",
        // la Rive qui respire : quatre houles fines, vers l'aval (+x)
        "  vec2 g = vec2(0.0);",
        "  vec2 d1 = vec2(0.8, 0.6), d2 = vec2(-0.45, 0.89), d3 = vec2(0.95, -0.31), d4 = vec2(0.2, -0.98);",
        "  g += d1 * 2.3 * 0.012 * cos(dot(p, d1) * 2.3 - uT * 1.3);",
        "  g += d2 * 3.7 * 0.007 * cos(dot(p, d2) * 3.7 - uT * 1.9);",
        "  g += d3 * 6.1 * 0.0035 * cos(dot(p, d3) * 6.1 - uT * 2.6);",
        "  g += d4 * 9.7 * 0.002 * cos(dot(p, d4) * 9.7 - uT * 3.3);",
        "  g += (vec2(n2(p * 1.7 + vec2(uT * 0.3, 0.0)), n2(p * 1.7 + vec2(4.0, uT * 0.25))) - 0.5) * 0.05;",
        // le plongeon : ses ronds, le bouillon du milieu ; le sapin qui remonte : de petits ronds
        "  float s = uT - uT0;",
        "  g += ronds(p, uC, s, 0.35, 2.3);",
        "  if (s > 0.0) { float d = length(p - uC); float b = exp(-d * d / 1.4) * (exp(-s / 1.5) + 0.12 * exp(-s / 12.0));",
        "    g += (vec2(n2(p * 3.1 + uT * 2.0), n2(p * 3.1 - uT * 2.3 + 7.0)) - 0.5) * 1.2 * b; }",
        "  g += ronds(p, uC1, uT - uT1, 0.035, 1.1);",
        "  vec3 N = normalize(vec3(-g.x, 1.0, -g.y));",
        "  vec3 V = normalize(cameraPosition - vP); float dist = length(cameraPosition - vP);",
        "  vec3 R = reflect(-V, N); R.y = abs(R.y);",
        "  float F = 0.02 + 0.98 * pow(1.0 - max(dot(N, V), 0.0), 5.0);",
        "  vec3 ciel = mix(uCielBas, uCielHaut, pow(clamp(R.y, 0.0, 1.0), 0.5));",
        "  vec3 c = uFond * (0.5 + 0.5 * N.y) + ciel * F;",
        "  vec3 spec = vec3(0.0), diff = vec3(0.0);",
        "  for (int i = 0; i < 4; i++) {",
        "    vec3 L = uLumPos[i] - vP; float dl = length(L); L /= dl;",
        "    float a = max(dot(R, L), 0.0);",
        // l'eau trouble prend un peu de la lumière des réverbères proches (un brun sourd, sous eux)
        "    if (i < 2) diff += uLumCoul[i] * max(dot(N, L), 0.0) * 0.06 / (1.0 + dl * dl * 0.02);",
        // (les deux lampes d'en face, vues de près, feraient des soleils : leurs éclats sont plus doux)
        "    float w = i < 2 ? 5.0 : 1.3;",
        "    spec += uLumCoul[i] * (pow(a, 700.0) * w + pow(a, 70.0) * 0.16 + pow(a, 9.0) * 0.02) / (1.0 + dl * dl * 0.003);",
        "  }",
        "  c += spec * (0.35 + 0.65 * F * 8.0) + diff * vec3(0.55, 0.42, 0.3);",
        // la moire de l'essence : là où la lumière se reflète, une irisation qui s'étale
        "  if (uHuile > 0.0) {",
        "    float d = length(p - uC + vec2(-0.25 * max(s - 2.0, 0.0) * 0.08, 0.0));",
        "    float rad = 0.4 + uHuile * 3.6;",
        "    float m = smoothstep(rad, rad * 0.45, d + (n2(p * 1.2 + uT * 0.04) - 0.5) * 1.4) * uHuile;",
        // des filets, pas une nappe : l'essence se lit en volutes
        "    m *= 0.35 + 0.65 * smoothstep(0.3, 0.75, n2(p * 2.0 + vec2(uT * 0.05, 1.0)));",
        "    float ph = n2(p * 0.85 + 3.0) * 2.6 + d * 0.9 - uT * 0.04;",
        "    vec3 irise = 0.5 + 0.5 * cos(6.2831 * (ph + vec3(0.0, 0.33, 0.67)));",
        // (elle ne se voit que dans ce que l'eau reflète : le reflet des lampes, le ciel)
        "    c += irise * m * (spec * 1.2 + ciel * F * 4.0 + diff * 0.25);",
        "  }",
        "  float f = 1.0 - exp(-pow(uDens * dist, 2.0));",
        "  c = mix(c, uBrume, f);",
        "  gl_FragColor = vec4(c, 1.0);",
        "}"
      ].join("\n"),
      fog: false
    });
    K.garder(m);
    return m;
  }
  // la lumière de l'eau au plafond : des lignes claires qui ondulent ; `uAgite` les affole
  function caustiques(K, THREE, o) {
    var m = new THREE.ShaderMaterial({
      uniforms: { uT: { value: 0 }, uAgite: { value: 0 }, uForce: { value: o.force }, uCouleur: { value: new THREE.Color(o.couleur) }, uMur: { value: MUR }, uX: { value: FENX } },
      vertexShader: "varying vec3 vP; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vP = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",
      fragmentShader: [
        "uniform float uT, uAgite, uForce, uMur, uX; uniform vec3 uCouleur; varying vec3 vP;",
        "float caus(vec2 p, float t){",
        "  vec2 q = p;",
        "  for (int i = 0; i < 3; i++) { float fi = float(i); q += vec2(sin(q.y * 1.7 + t * 0.9 + fi), cos(q.x * 1.5 - t * 0.8 + fi * 1.3)) * 0.42; }",
        "  float v = sin(q.x * 2.8) * sin(q.y * 2.8);",
        "  return pow(1.0 - abs(v), 7.0);",
        "}",
        "void main(){",
        "  float z = vP.z - uMur, x = vP.x - uX;",
        // la tache de lumière : contre la fenêtre, elle s'éteint en entrant dans la pièce
        "  float m = smoothstep(0.0, 0.25, z) * (1.0 - smoothstep(1.0, 2.6, z)) * (1.0 - smoothstep(0.5 + z * 0.35, 1.2 + z * 0.5, abs(x)));",
        "  float t = uT * (1.0 + 3.0 * uAgite);",
        "  vec2 p = vec2(x * 2.4 + sin(uT * 0.21) * 0.3, z * 3.4 - uT * (0.25 + 1.4 * uAgite));",
        "  float c = caus(p, t) * (0.7 + 1.5 * uAgite) + 0.12;",
        "  gl_FragColor = vec4(uCouleur * c * m * uForce, 1.0);",
        "}"
      ].join("\n"),
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false
    });
    K.garder(m);
    return m;
  }

  // le car du club : un autocar de la fin des années 1980, bordeaux et gris, sans un mot peint ;
  // l'avant regarde +x (on le tourne) ; tous feux éteints
  function autocar(K, THREE, P) {
    var g = new THREE.Group(), L = 11.5, W = 2.5;
    var mGris = K.garder(new THREE.MeshPhysicalMaterial({ color: "#8a8c8f", roughness: 0.45, metalness: 0.15, clearcoat: 0.5, clearcoatRoughness: 0.25 }));
    var mBord = K.garder(new THREE.MeshPhysicalMaterial({ color: "#6a1c28", roughness: 0.45, metalness: 0.12, clearcoat: 0.5, clearcoatRoughness: 0.25 }));
    var mVitre = K.garder(new THREE.MeshPhysicalMaterial({ color: "#05070a", roughness: 0.04, metalness: 0.2, envMapIntensity: 2.4 }));
    var mPneu = K.garder(new THREE.MeshStandardMaterial({ color: "#0e0e0e", roughness: 0.9 }));
    var mNoir = K.garder(new THREE.MeshStandardMaterial({ color: "#0c0d0f", roughness: 0.6 }));
    P.boite(g, L, 1.1, W, mGris, 0, 0.95, 0);
    P.boite(g, L, 0.35, W + 0.01, mBord, 0, 1.55, 0);
    P.boite(g, L - 0.4, 1.0, W - 0.04, mVitre, -0.1, 2.25, 0);
    P.boite(g, L, 0.36, W, mGris, 0, 2.95, 0);
    P.boite(g, 0.08, 1.7, W - 0.1, mVitre, L / 2 + 0.01, 2.0, 0);
    P.boite(g, 0.1, 0.3, W - 0.2, mNoir, L / 2 + 0.03, 0.62, 0);
    [-1, 1].forEach(function (s) {
      [-L / 2 + 1.6, L / 2 - 2.4].forEach(function (x) { P.cylindre(g, 0.5, 0.5, 0.3, mPneu, x, 0.5, s * (W / 2 - 0.12), { rx: PI / 2, cotes: 20 }); });
      P.boite(g, 0.06, 0.16, 0.34, mNoir, L / 2 + 0.03, 0.85, s * 0.85);   // les phares, éteints
    });
    g.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    return g;
  }

  // ─── LE QUAI ET L'APPARTEMENT ────────────────────────────────────────────
  function quai(K, ctx, tex) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: { zenith: "#020308", horizon: "#131a26", lueur: "#3a2a1c", lueurDir: [0.1, -1], force: 1 },
      brouillard: ["#0d121b", 0.022], environnement: { fenetres: 14, teintes: ["#FF9A3D", "#FFC27A"] }, reflets: 1.0, ambiance: ["#2a3a58", "#0a0806", 0.3] });

    // ── les réverbères du quai, leur tête au-dessus de l'eau ; celui du plongeon porte l'ombre
    var lamps = [-16, -4, 8, 20].map(function (x, i) {
      var r = P.reverbere({ hauteur: 6.2, bras: 1.3, intensite: i === 1 ? 190 : 150, ombre: i === 1, gresille: i === 3 ? 1 : 0.12, forceCone: 0.05, halo: 1.8 });
      r.position.set(x, QUAI + 0.15, 1.0); r.rotation.y = PI / 2; s.add(r);   // le bras vers -z : au-dessus de l'eau
      return r;
    });
    s.updateMatrixWorld(true);
    var pl = lamps.map(function (l) { return l.positionLampe(); });

    // ── la Rive : le miroir noir
    // les sodiums du quai, et deux lampes de l'autre rive : de ta fenêtre, leur reflet traverse la
    // Rive là où c'est tombé (les ronds le cassent)
    var mEau = eau(K, THREE, { cielBas: "#1c2536", cielHaut: "#04060b", fond: "#020304", brume: "#0d121b", densite: 0.022,
      lumieres: [{ pos: pl[1], couleur: "#FF9A3D", intensite: 1.6 }, { pos: pl[2], couleur: "#FF9A3D", intensite: 1.4 }, { pos: [-9, 5.5, -41], couleur: "#FFC27A", intensite: 2.6 }, { pos: [7, 6.5, -41], couleur: "#FFB060", intensite: 1.6 }] });
    var riviere = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(170, 60)), mEau); riviere.rotation.x = -PI / 2; riviere.position.set(0, 0, -27); s.add(riviere);

    // ── le quai : le mur de pierre, la margelle, le trottoir, la chaussée
    var mPierre = K.mat.beton({ couleur: "#4e4a43", graine: "quai-pierre", banches: 0, taches: 1 });
    var mur = new THREE.Mesh(P.boiteUV(170, 3.4, MUR + 0.2, 1.6), mPierre); mur.position.set(0, QUAI - 1.7, (MUR + 0.2) / 2); mur.receiveShadow = true; s.add(mur);
    var mMarge = K.mat.beton({ couleur: "#7a756a", graine: "margelle", banches: 0, taches: 0.6 });
    P.boite(s, 170, 0.22, 0.6, mMarge, 0, QUAI + 0.1, 0.3, { ombre: false });
    var trottoir = new THREE.Mesh(P.planUV(170, 2.2, 1.5), K.mat.beton({ couleur: "#55524c", graine: "trottoir-quai", banches: 0, taches: 0.9 }));
    trottoir.rotation.x = -PI / 2; trottoir.position.set(0, QUAI + 0.12, 1.7); trottoir.receiveShadow = true; s.add(trottoir);
    P.boite(s, 170, 0.14, 0.16, mMarge, 0, QUAI + 0.07, 2.84, { ombre: false });
    var chaussee = new THREE.Mesh(P.planUV(170, MUR - 2.84, 6), K.mat.asphalte({ flaques: 0.35, graine: "quai-route", reflets: 1.6 }));
    chaussee.rotation.x = -PI / 2; chaussee.position.set(0, QUAI + 0.005, (MUR + 2.84) / 2); chaussee.receiveShadow = true; s.add(chaussee);
    // une applique au sodium sur la façade, au-dessus du car : son toit, son flanc, la chaussée
    var applique = K.look.projecteur({ couleur: "#FF9A3D", intensite: 70, angle: 0.75, penombre: 0.8, decroissance: 2, ombre: false });
    var HA = QUAI + 6.3;
    applique.intensity = 300; applique.position.set(CAR[0] + 1.5, HA - 0.15, MUR - 0.35); s.add(applique);
    var cApp = new THREE.Object3D(); cApp.position.set(CAR[0] + 0.5, QUAI + 2.4, CAR[2]); s.add(cApp); applique.target = cApp;
    P.boite(s, 0.22, 0.32, 0.3, K.mat.metal({ couleur: "#23262a", rugosite: 0.5 }), CAR[0] + 1.5, HA, MUR - 0.15);
    var hApp = K.look.halo({ couleur: "#FF9A3D", taille: 1.1, intensite: 1.0 }); hApp.position.set(CAR[0] + 1.5, HA - 0.19, MUR - 0.32); s.add(hApp);
    var gApp = new THREE.Mesh(K.garder(new THREE.BoxGeometry(0.18, 0.04, 0.24)), K.mat.lumiere({ couleur: "#FF9A3D", intensite: 5, toneMapped: false })); gApp.position.set(CAR[0] + 1.5, HA - 0.17, MUR - 0.17); s.add(gApp);
    // ── les immeubles du quai, ta façade parmi elles : de la brique, de rares fenêtres allumées
    // (sans ombre : la lumière du quai passe par ta fenêtre, que la pièce découpe)
    var immeubles = P.facade({ largeur: 64, etages: 5, hauteurEtage: 3.0, profondeur: 8, fenetres: { colonnes: 24, allumees: 0.16 }, graine: "quai-immeubles", brique: "#5e3328", vitrine: false });
    immeubles.rotation.y = PI; immeubles.position.set(FENX, QUAI, MUR - 0.02); s.add(immeubles);
    immeubles.traverse(function (o) { if (o.isMesh) o.castShadow = false; });
    // ── le car du club, garé contre le trottoir, l'avant vers l'amont (-x), tous feux éteints
    var car = autocar(K, THREE, P); car.position.set(CAR[0], CAR[1], CAR[2]); car.rotation.y = PI; s.add(car);
    // ── l'autre rive : les entrepôts, leurs rares fenêtres, une grue, des arbres ; tout dans la brume
    var fen = K.tex.fenetres({ colonnes: 36, rangees: 2, allumees: 0.12, mur: "#0a0b0d", graine: "rive-gauche", teintes: ["#FFC27A", "#FFB36B", "#FF9A3D"] });
    var mFen = K.garder(new THREE.MeshStandardMaterial({ map: fen.map, emissive: new THREE.Color("#ffffff"), emissiveMap: fen.lumiere, emissiveIntensity: 1.2, roughness: 0.6 }));
    var entrepots = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(150, 7)), mFen); entrepots.position.set(0, 3.5 + 1.2, -41.5); s.add(entrepots);
    var mSombre = K.garder(new THREE.MeshBasicMaterial({ color: "#06080c" }));
    var sil = new THREE.Group();
    [[-60, 9, 18], [-38, 11, 14], [-20, 8, 20], [2, 12, 16], [22, 9, 22], [46, 10, 18]].forEach(function (b) { P.boite(sil, b[2], b[1], 6, mSombre, b[0], b[1] / 2 + 1.2, -45, { ombre: false }); });
    P.boite(sil, 150, 2.4, 2, mSombre, 0, 0, -40.5, { ombre: false });
    [[30, 20], [30.5, 34]].forEach(function (g) { P.boite(sil, 0.8, g[1], 0.8, mSombre, g[0], g[1] / 2 + 1.2, -46, { ombre: false }); });
    var fleche = P.boite(sil, 18, 0.7, 0.7, mSombre, 24, 21, -46, { ombre: false }); fleche.rotation.z = 0.08;
    for (var a = 0; a < 9; a++) { var arbre = new THREE.Mesh(K.garder(new THREE.ConeGeometry(1.6 + K.h01(a, 3), 6 + K.h01(a, 5) * 3, 6)), mSombre); arbre.position.set(-58 + a * 7.5 + K.h01(a, 7) * 3, 4.5, -39.5); sil.add(arbre); }
    P.fusionner(sil); s.add(sil);
    [[-9, 5.5, 1.3], [7, 6.5, 1.0]].forEach(function (l) {
      var h = K.look.halo({ couleur: "#FFC27A", taille: 1.0, intensite: l[2] }); h.position.set(l[0], l[1], -41.2); s.add(h);
      var b = new THREE.Mesh(K.garder(new THREE.BoxGeometry(0.4, 0.25, 0.2)), K.mat.lumiere({ couleur: "#FFC27A", intensite: 4, toneMapped: false })); b.position.set(l[0], l[1], -41.3); s.add(b);
    });
    // ── la brume sur la Rive : des bancs bas qui dérivent vers l'aval
    // (au large : la brume ne passe pas sous le nez des plans au ras de l'eau, près du quai)
    var brume = K.particules.fumee({ n: 26, source: [-2, 0.9, -17], vent: [0.14, 0.0], montee: 0.012, vie: 26, taille: 4.5, etalement: 18, couleur: "#3a4456", lueur: "#5a5a58", opacite: 0.1, graine: "brume-rive",
      lumieres: [{ pos: pl[1], couleur: "#FF9A3D", intensite: 0.6, rayon: 9 }, { pos: pl[2], couleur: "#FF9A3D", intensite: 0.5, rayon: 9 }] });
    s.add(brume);
    // ── les bulles : de petites coupoles qui crèvent, autour du plongeon (une instance par bulle)
    var NB = 46, mBulle = K.garder(new THREE.MeshPhysicalMaterial({ color: "#1a2028", roughness: 0.05, metalness: 0.0, envMapIntensity: 3.0, transparent: true, opacity: 0.85, clearcoat: 1 }));
    var bulles = new THREE.InstancedMesh(K.garder(new THREE.SphereGeometry(1, 12, 6, 0, PI * 2, 0, PI / 2)), mBulle, NB);
    bulles.frustumCulled = false; s.add(bulles);
    var mtx = new THREE.Matrix4(), qId = new THREE.Quaternion(), vPos = new THREE.Vector3(), vEch = new THREE.Vector3();
    // ── le sapin, à plat sur l'eau, sa ficelle
    var sapin = new THREE.Group(); s.add(sapin);
    var mSap = K.garder(new THREE.MeshStandardMaterial({ map: tex.sapin, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.45, envMapIntensity: 1.2, emissive: new THREE.Color("#1a3a1e"), emissiveMap: tex.sapin, emissiveIntensity: 1.1 }));
    var carton = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.075, 0.112)), mSap); carton.rotation.x = -PI / 2; carton.position.y = 0.004; sapin.add(carton);
    var fil = new THREE.Mesh(K.garder(new THREE.CylinderGeometry(0.0009, 0.0009, 0.1, 4)), K.garder(new THREE.MeshStandardMaterial({ color: "#d8d2c2", roughness: 0.7 })));
    fil.rotation.z = PI / 2; fil.rotation.y = 0.4; fil.position.set(0.0, 0.003, -0.1); sapin.add(fil);
    sapin.scale.setScalar(2.0);   // le plan large le voit : un sapin de rétroviseur, un peu grandi

    // ── l'appartement du quai : la pièce du deuxième, sa fenêtre sur la Rive
    var piece = P.piece({ largeur: 4.4, profondeur: 4.0, hauteur: 2.7, murs: K.mat.beton({ couleur: "#6d6a62", graine: "platre-quai", banches: 0, taches: 0.3 }),
      sol: K.mat.bois({ couleur: "#3e2a1a", lames: 6, graine: "parquet-quai" }), fenetre: { mur: "fond", x: 0, y: 1.45, w: FENW, h: FENH } });
    piece.position.set(FENX, ETAGE, MUR + 2.0); s.add(piece);
    var mCh = K.garder(new THREE.MeshStandardMaterial({ color: "#d4cfc2", roughness: 0.6 }));
    P.boite(s, FENW, 0.06, 0.08, mCh, FENX, FENY + FENH / 2 - 0.03, MUR + 0.02); P.boite(s, FENW + 0.12, 0.05, 0.22, mCh, FENX, FENY - FENH / 2 + 0.02, MUR + 0.08);
    P.boite(s, 0.06, FENH, 0.08, mCh, FENX - FENW / 2 + 0.03, FENY, MUR + 0.02); P.boite(s, 0.06, FENH, 0.08, mCh, FENX + FENW / 2 - 0.03, FENY, MUR + 0.02);
    // une imposte, pas de meneau : de la fenêtre, on regarde la Rive par le grand carreau
    P.boite(s, FENW, 0.05, 0.06, mCh, FENX, FENY + 0.38, MUR + 0.02);
    var mVoile = K.garder(new THREE.MeshStandardMaterial({ map: tex.voilage, transparent: true, depthWrite: false, side: THREE.DoubleSide, roughness: 0.9, emissive: new THREE.Color("#ffb070"), emissiveMap: tex.voilage, emissiveIntensity: 0.06 }));
    var voile = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.7, 1.9)), mVoile); voile.position.set(FENX - FENW / 2 + 0.2, ETAGE + 1.55, MUR + 0.12); voile.renderOrder = 3; s.add(voile);
    // la table contre le mur, à gauche de la fenêtre ; le trousseau et son étiquette
    var mTable = K.mat.bois({ couleur: "#4a3322", lames: 3, graine: "table-quai", cire: true });
    var tx = FENX - 1.35, ty = ETAGE + 0.75, tz = MUR + 0.45;
    P.boite(s, 0.9, 0.04, 0.6, mTable, tx, ty, tz);
    [[-0.4, -0.25], [0.4, -0.25], [-0.4, 0.25], [0.4, 0.25]].forEach(function (p) { P.boite(s, 0.04, 0.73, 0.04, mTable, tx + p[0], ETAGE + 0.365, tz + p[1]); });
    var trousseau = new THREE.Group(); trousseau.position.set(tx + 0.22, ty + 0.021, tz - 0.06); trousseau.rotation.y = 0.5; s.add(trousseau);
    var mCle = K.mat.metal({ couleur: "#b8a878", rugosite: 0.28 });
    var anneau = new THREE.Mesh(K.garder(new THREE.TorusGeometry(0.016, 0.0016, 6, 20)), mCle); anneau.rotation.x = PI / 2; anneau.position.y = 0.002; trousseau.add(anneau);
    [[0.0, 0.3], [0.9, -0.2], [2.0, 0.1]].forEach(function (c, i) {
      var cle = new THREE.Group(); cle.rotation.y = c[0]; trousseau.add(cle);
      var tete = P.cylindre(cle, 0.011, 0.011, 0.002, mCle, 0.028, 0.002, 0, { cotes: 12 });
      var tige = P.boite(cle, 0.045, 0.002, 0.006, mCle, 0.06, 0.002, 0); tige.rotation.y = c[1] * 0.2;
      for (var d = 0; d < 4; d++) P.boite(cle, 0.004, 0.002, 0.004 + K.h01(d + i * 4, 3) * 0.004, mCle, 0.045 + d * 0.008, 0.002, 0.004);
    });
    var etiq = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.075, 0.0375)), K.garder(new THREE.MeshStandardMaterial({ map: tex.etiquette, alphaTest: 0.4, roughness: 0.85, side: THREE.DoubleSide })));
    // l'étiquette se lit de la chaise : son haut vers la fenêtre
    etiq.rotation.x = -PI / 2; etiq.rotation.z = -0.62; etiq.position.set(-0.035, 0.0012, 0.045); trousseau.add(etiq);
    var ficelle = P.boite(trousseau, 0.03, 0.001, 0.001, K.garder(new THREE.MeshStandardMaterial({ color: "#cfc6ae", roughness: 0.8 })), -0.018, 0.0015, 0.01); ficelle.rotation.y = -0.4;
    trousseau.traverse(function (o) { if (o.isMesh) { o.castShadow = false; o.receiveShadow = true; } });
    P.cylindre(s, 0.032, 0.028, 0.1, K.garder(new THREE.MeshPhysicalMaterial({ color: "#c8d2dc", roughness: 0.05, transparent: true, opacity: 0.25, envMapIntensity: 2, depthWrite: false })), tx - 0.25, ty + 0.07, tz + 0.08, { cotes: 16, ombre: false });
    // le réverbère du quai, à hauteur de la fenêtre : sa lumière entre presque à plat et pose sur
    // le mur du fond le carreau et son châssis (les ombres) ; au plafond, la lumière de l'eau ;
    // près de la vitre, ce que le voilage renvoie sur la table
    var montee = K.look.projecteur({ couleur: "#FFA458", intensite: 280, angle: 0.1, penombre: 0.6, decroissance: 2, ombre: true, loin: 30, ombreTaille: 1024 });
    montee.position.copy(new THREE.Vector3().fromArray(pl[1])); montee.position.y -= 0.1; s.add(montee);
    var cm = new THREE.Object3D(); cm.position.set(FENX + 0.2, ETAGE + 1.1, MUR + 4.0); s.add(cm); montee.target = cm;
    var rebond = K.look.ponctuelle({ couleur: "#FFB070", intensite: 0.55, portee: 0 }); rebond.position.set(FENX - 0.75, ETAGE + 1.35, MUR + 0.3); s.add(rebond);
    var plafond = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(3.6, 2.8)), caustiques(K, THREE, { force: 0.2, couleur: "#FFB46A" }));
    plafond.rotation.x = PI / 2; plafond.position.set(FENX, ETAGE + 2.68, MUR + 1.42); plafond.renderOrder = 6; s.add(plafond);
    var mCaus = plafond.material;
    var lueur = K.look.ponctuelle({ couleur: "#FFA060", intensite: 0.7, portee: 0 }); lueur.position.set(FENX, ETAGE + 2.3, MUR + 0.6); s.add(lueur);

    var reflets = lamps.map(function (l, i) { var r = K.look.reflet({ pos: l.positionLampe(), couleur: "#FF9A3D", intensite: [0.5, 0.75, 0.7, 0.45][i], largeur: 1.0, longueur: 14 }); r.position.y = 0.01; s.add(r); return r; });
    // ce que le réverbère du plongeon jette sur le flanc du car (son cône ne le prend qu'au bord)
    var surCar = K.look.projecteur({ couleur: "#FF9A3D", intensite: 140, angle: 0.42, penombre: 0.9, decroissance: 2, ombre: false });
    surCar.position.set(pl[1][0] + 0.4, pl[1][1] - 0.3, pl[1][2] + 0.4); s.add(surCar);
    var cCar = new THREE.Object3D(); cCar.position.set(CAR[0] - 2.5, QUAI + 1.6, CAR[2] - 1.3); s.add(cCar); surCar.target = cCar;

    return {
      scene: s,
      look: { bloom: 0.8, rayon: 0.6, seuil: 0.82, exposition: 1.15, contraste: 1.15, saturation: 0.9 },
      maj: function (t, c) {
        var cam = c.camera;
        mEau.uniforms.uT.value = t;
        // l'essence remonte quelques secondes après, et s'étale
        mEau.uniforms.uHuile.value = K.rampe(T_PLOUF + 2.5, T_PLOUF + 16, t);
        brume.maj(t);
        lamps.forEach(function (l) { l.maj(t); });
        reflets.forEach(function (r, i) { r.maj(cam, i === 3 ? 1 - 0.1 * Math.max(0, K.bruit1(t * 9, 7)) : 1); });
        // la lumière de l'eau au plafond : calme, puis affolée par le plongeon, qui retombe
        var ag = K.lisse(T_PLOUF + 0.25, T_PLOUF + 1.1, t) * Math.exp(-Math.max(0, t - T_PLOUF - 1.1) / 4.5);
        mCaus.uniforms.uT.value = t; mCaus.uniforms.uAgite.value = ag;
        lueur.intensity = 0.7 * (1 + 0.6 * ag * Math.sin(t * 23));
        // les bulles : chacune sa vie (elle naît, gonfle, crève), de moins en moins
        var s0 = t - T_PLOUF, niveau = s0 < 0.3 ? 0 : 0.85 * Math.exp(-s0 / 9) + 0.22;
        for (var i = 0; i < NB; i++) {
          var per = 0.8 + K.h01(i, 3) * 1.7, u = (t + K.h01(i, 5) * 10) / per, cyc = Math.floor(u), ph = u - cyc;
          var vive = s0 > 0.3 && K.h01(i * 13 + cyc, 7) < niveau;
          var ang = K.h01(i * 31 + cyc, 9) * PI * 2, rad = Math.sqrt(K.h01(i * 17 + cyc, 11)) * (0.25 + 0.9 * Math.min(1, s0 / 6));
          var r = vive ? (0.013 + 0.034 * K.h01(i * 7 + cyc, 13)) * K.lisse(0, 0.2, ph) * (ph < 0.86 ? 1 : 0) : 0;
          vPos.set(CENTRE[0] + Math.cos(ang) * rad + s0 * 0.02, 0.0, CENTRE[2] + Math.sin(ang) * rad);
          vEch.set(r, r * 0.8, r);
          mtx.compose(vPos, qId, vEch); bulles.setMatrixAt(i, mtx);
        }
        bulles.instanceMatrix.needsUpdate = true;
        // le sapin : sous l'eau, puis il remonte (23 s), tourne, dérive vers l'aval
        var ss = t - T_SAPIN, haut = ss < 0 ? -0.4 : -0.4 + 0.404 * K.lisse(0, 0.7, ss) + 0.008 * Math.sin(ss * 5) * Math.exp(-ss / 1.2);
        sapin.visible = ss > -0.05;
        sapin.position.set(SAPIN[0] + Math.max(0, ss) * 0.035, haut, SAPIN[2] + Math.sin(Math.max(0, ss) * 0.3) * 0.02);
        sapin.rotation.y = 0.4 + Math.max(0, ss) * 0.32;
        sapin.rotation.x = 0.03 * Math.sin(t * 1.3); sapin.rotation.z = 0.03 * Math.sin(t * 1.1 + 1);
      }
    };
  }

  FC.film({
    id: "sapin_dans_la_rive",
    livre: "interimaire",
    titre: "Un sapin dans la Rive",
    duree: 33.5,
    musique: "livre_h2",
    secours: "sombre",
    couleur: BLEU,
    affiche: 31.4,
    habillage: { vignette: 0.6, grain: 0.075, ratioPaysage: 2.35, ratioPortrait: 0 },
    sortie: { noir: 1.3 },
    // le bruit d'eau énorme : trois coups sourds l'un dans l'autre, puis plus rien
    sons: [[T_PLOUF, "tampon_fin"], [T_PLOUF + 0.03, "une"], [T_PLOUF + 0.09, "porte"]],
    textes: [
      { sorte: "lieu", de: 0.6, a: 4.8, texte: "Aubérive, quai de la Rive", sous: "Une heure du matin" },
      { sorte: "replique", de: 16.6, a: 20.6, qui: "Le répondeur", texte: "Ne me cherche pas." },
      { sorte: "titre", de: 29.0, a: 33.0, texte: "Aubérive · 1992", sous: "Le Sapin en carton", entree: 0.2, sortie: 0.7 }
    ],
    montages: { court: [[0.4, 4.6], [6.2, 12.0], [12.2, 15.6], [16.3, 20.8], [21.4, 25.8], [26.4, 33.4]] },
    preparer: function (K, ctx) {
      var tex = { sapin: sapinTexture(K), etiquette: etiquetteTexture(K), voilage: voilageTexture(K) };
      return K.etapes(ctx, [function () { ctx.decors.quai = quai(K, ctx, tex); }]);
    },
    plans: [
      // 1 · dehors, devant ta fenêtre, de haut : la Rive, les sodiums, la brume, le car
      { de: 0, a: 5.5, decor: "quai", entree: "noir", transition: 1.4, fixe: 1.6,
        camera: { pos: K_cles([[0, [1.6, FENY + 1.6, MUR - 0.4]], [5.5, [1.2, FENY + 0.9, MUR - 1.0]]], "douce"), cible: K_cles([[0, [-1.0, 1.0, -16.0]], [5.5, [0.6, 0.0, -4.0]]], "douce"), fov: 52, epaule: 0.06 } },
      // 2 · dedans : le trousseau, son étiquette ; la caméra monte au plafond ; le bruit d'eau
      { de: 5.5, a: 12.0, decor: "quai", entree: "fondu", transition: 1.0, fixe: 2.4,
        camera: { pos: K_cles([[0, [FENX - 0.95, ETAGE + 1.12, MUR + 0.78]], [3.0, [FENX - 0.9, ETAGE + 1.2, MUR + 0.95]], [5.0, [FENX - 0.3, ETAGE + 1.5, MUR + 2.6]]], "douce"),
          // (le regard monte par le mur, à gauche de la fenêtre : il ne passe pas devant le réverbère)
          cible: K_cles([[0, [FENX - 1.13, ETAGE + 0.77, MUR + 0.39]], [3.0, [FENX - 1.12, ETAGE + 0.8, MUR + 0.4]], [4.1, [FENX - 1.35, ETAGE + 2.05, MUR + 0.05]], [5.0, [FENX - 0.2, ETAGE + 2.7, MUR + 0.6]]], "douce"), fov: K_cles([[0, 34], [3.0, 36], [5.0, 56]], "douce"), epaule: 0.08 },
        // sur un téléphone étroit, le cadre glisse d'abord vers le trousseau (à gauche), puis revient
        cadrage: { portrait: { x: function (l) { return -0.4 * (1 - K_lisse(2.8, 4.8, l)); } } } },
      // 3 · de ta fenêtre : des ronds sur la Rive, la brume ; puis plus rien
      { de: 12.0, a: 16.0, decor: "quai", entree: "coupe", fixe: 1.6,
        camera: { pos: VUE, cible: [CENTRE[0] + 0.3, 0.0, CENTRE[2] - 2.6], fov: K_cles([[0, 30], [4.0, 27]], "lin"), epaule: 0.07 } },
      // 4 · sur le quai, au bord de l'eau : le car, tous feux éteints ; la phrase du répondeur
      { de: 16.0, a: 21.0, decor: "quai", entree: "coupe", fixe: 3.4,
        camera: { pos: K_cles([[0, [CAR[0] - 9.6, QUAI + 1.0, 1.3]], [5.0, [CAR[0] - 9.2, QUAI + 1.05, 1.45]]], "douce"), cible: K_cles([[0, [CAR[0] - 2.0, QUAI + 2.4, CAR[2]]], [5.0, [CAR[0] - 1.4, QUAI + 2.4, CAR[2]]]], "douce"), fov: 58, epaule: 0.06 } },
      // 5 · au-dessus de l'eau, dos au quai : les bulles, la moire ; le sapin remonte
      { de: 21.0, a: 26.0, decor: "quai", entree: "coupe", fixe: 3.0,
        // bas sur l'eau, dos au quai : derrière le sapin, le reflet d'une lampe de l'autre rive, que
        // l'essence irise
        camera: { pos: K_cles([[0, [SAPIN[0] + 0.3, 0.85, SAPIN[2] + 1.6]], [5.0, [SAPIN[0] + 0.22, 0.78, SAPIN[2] + 1.35]]], "douce"), cible: [SAPIN[0] - 0.1, 0.0, SAPIN[2] - 0.35], fov: 42, epaule: 0.08 },
        look: { bloom: 0.5, seuil: 0.9 } },
      // 6 · le sapin qui tourne sur l'eau noire ; la caméra s'élève jusqu'à ta fenêtre ; le titre
      { de: 26.0, a: 33.5, decor: "quai", entree: "coupe", fixe: 5.0,
        // en s'éloignant jusqu'à ta fenêtre, l'objectif se resserre : le sapin garde à peu près sa taille,
        // le monde grandit autour de lui
        camera: { pos: function (l) { return POS6(l); }, cible: function (l) { return cible6(l); }, fov: function (l) { return FOV6(l); }, epaule: 0.03 },
        // de près, les reflets des lampes d'en face sont des soleils : le bloom se retient
        look: { bloom: 0.45, seuil: 0.92 } }
    ]
  });

  // le plan 6 : la caméra s'élève du sapin jusqu'à ta fenêtre ; elle vise un peu en deçà du sapin
  // (vers elle), pour qu'il reste au-dessus du titre, qui se pose au milieu de l'image
  var POS6 = K_cles([[0, [SAPIN[0] + 0.35, 0.95, SAPIN[2] + 0.85]], [7.5, [FENX - 0.6, FENY + 0.6, MUR - 1.2]]], "douce");
  var FOV6 = K_cles([[0, 40], [7.5, 9]], "douce");
  // le sapin à un cinquième de la demi-hauteur du cadre large au-dessus du centre, quel que soit
  // l'objectif : on vise sur l'eau, en deçà de lui, d'autant que l'angle le demande
  function cible6(l) {
    var p = POS6(l), ss = 26.0 + l - T_SAPIN, sx = SAPIN[0] + Math.max(0, ss) * 0.035, sz = SAPIN[2];
    var dx = p[0] - sx, dz = p[2] - sz, dh = Math.sqrt(dx * dx + dz * dz) || 1, dist = Math.sqrt(dh * dh + p[1] * p[1]);
    var demi = Math.atan(Math.tan(FOV6(l) * PI / 360) / 2.35), delta = 0.4 * demi * dist / Math.max(0.2, p[1] / dist);
    return [sx + dx / dh * delta, 0, sz + dz / dh * delta];
  }
  // les aides de la trousse, lues quand le film tourne (la trousse est chargée avant le film)
  function K_() { return FC.kit; }
  function K_cles(p, a) { var f = null; return function (t) { if (!f) f = K_().cles(p, a); return f(t); }; }
  function K_lisse(a, b, x) { return K_().lisse(a, b, x); }
})(typeof window !== "undefined" ? window : this);
