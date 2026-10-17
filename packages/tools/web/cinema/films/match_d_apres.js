/* ═══════════════════════════════════════════════════════════════════════════
   « Le match d'après » — livre 10, « Les Deux Téléphones » (2037-2040, la
   présidente du Racing Aubérive ; la couleur du livre : #FFB547, l'ambre).

   Avril 2040, la Rive, le premier match après la nuit de février où Gégé est mort.
   Le plus moderne des noirs du jeu : l'heure bleue, les diodes, les écrans. Ce que le
   film montre, et pourquoi :
     · la Nord pleine à l'heure bleue, sous les pylônes : sur les gradins, des
       centaines d'écrans de téléphone allumés, comme des étoiles basses ; les
       panneaux à diodes qui défilent au bord du terrain ;
     · les panneaux qui s'éteignent d'un coup, le coup de sifflet de la minute ;
     · depuis la loge, derrière la vitre, sans un bruit : les deux équipes autour du
       rond central, tête basse, et à gauche, dans la Nord, les écrans qui s'éteignent
       un à un (les invités de la loge, de dos, à contre-jour) ;
     · Nino, debout sur l'estrade devant le virage, la tête basse, lève le premier masque ; puis la
       vague : trois mille visages de Gégé en carton montent devant les visages. La
       casquette, les lunettes rondes : la fiche d'art.js du socio numéro 1, imprimée
       en trois tons (« trois mille fois le même visage, la casquette, le menton levé
       vers la Nord » : la scène des cartons, h10.ci.cartons, à cinq heures du matin
       après sa mort) ;
     · un masque de près, tenu à deux mains, une écharpe bordeaux nouée au poignet
       (« les masques de Gégé encore noués aux écharpes », l'assemblée) ; puis la Nord
       entière, trois mille fois le même visage.
   Il se joue avant pr.h10.c4_masques* (S2, créneau 14 : toutes les carrières y
   passent ; les six variantes de la carte s'ouvrent sur la même image). Il répond aux
   trois mille masques de 1990 (le film du livre 1), sans les nommer, comme les vieux.
   Il ne devance rien : ni ce que disent les haut-parleurs (la voix de Gigi, ou leur
   silence si elle a été coupée : la carte le dit), ni le salut de Nino, ni le dos des
   masques (l'intermède qui suit) ; personne n'y parle.

   LES PLANS (38,5 s) — la lumière, ce que chaque plan dit
   | 1 | 0–7      | la Nord depuis la pelouse, à l'heure bleue : les pylônes, les écrans
   |   |          | allumés dans les gradins, les panneaux qui défilent ; « La Rive, la
   |   |          | Nord / Avril 2040 · le match d'après » | où, quand ; un stade de 2040
   | 2 | 7–12,4   | au ras des panneaux à diodes, les premiers rangs derrière, les écharpes,
   |   |          | les écrans levés ; les panneaux s'éteignent, le sifflet (« match_debut »)
   |   |          | | la minute commence
   | 3 | 12,4–19,6| la loge, derrière la vitre : les deux équipes autour du rond central ; à
   |   |          | gauche la Nord, où les écrans s'éteignent un à un ; les reflets des
   |   |          | appliques sur la vitre, les invités de dos | on regarde de loin, on
   |   |          | n'entend rien
   | 4 | 19,6–28,6| devant la Nord, au ras de la pelouse, la grue qui monte : Nino lève le
   |   |          | premier masque, puis la vague, trois mille visages de Gégé | le moment
   | 5 | 28,6–38,5| un masque de près, tenu à deux mains, l'écharpe au poignet ; la caméra
   |   |          | recule, la Nord entière ; « Aubérive · 2040 / Les Deux Téléphones » |
   |   |          | le titre
   Le mouvement réduit : une image par plan (`fixe`). La coupe de 30 s (`montages.court`)
   garde les cinq plans, resserrés. La musique : film_match_d_apres, écrite sous ses images
   (packages/tools/studio/partitions/film_match_d_apres.py : elle s'arrête avec les panneaux,
   se tait pendant la minute et reprend sur le premier masque) ; sinon livre_h10 (ses deux
   sonneries d'ouverture sur l'heure bleue), `match` en secours. Aucune réplique : la minute.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var FC = global.FusibleCinema;
  var PI = Math.PI;
  var AMBRE = "#FFB547", BORDEAUX = "#7A1F2E";
  var T_NOIR = 11.2;    // les panneaux s'éteignent : la minute
  var T_NINO = 20.5;    // Nino lève le premier masque
  var T_VAGUE = 21.1;   // la vague part de lui
  var NINO = [7.5, -1.75];  // sa place (x, z), devant le muret, sur une estrade, à droite du but

  function tt(K, n) { return Math.max(64, Math.round(n * (K.qualiteTextures || 1) / 16) * 16); }
  function gm(K, m) { K.garder(m); return m; }

  // ─── LE VISAGE DE GÉGÉ, IMPRIMÉ EN MASQUE ─────────────────────────────────
  // La fiche d'art.js du socio numéro 1 (« gege » : la casquette, les lunettes rondes que
  // l'âge lui pose), cadrée en buste pour que la casquette entre en entier ; le décor ôté
  // (comme la trousse le fait pour le héros), la tête recadrée au format du masque (5 × 6),
  // le cou coupé sous le menton, lissée puis tirée en trois tons par la trousse
  // (K.tex.imprimer) ; deux yeux percés. Les mesures (en unités du portrait, 400) sont
  // celles de cette fiche, cadrée ainsi : le haut de la casquette à 57, le menton à 233,
  // les yeux à 163, de part et d'autre de x = 191.
  function masqueGege(K) {
    var S = tt(K, 1024), k = S / 400;
    var spec = { speaker: "gege", genre: "m", expression: "neutre", camp: "terrain", lieu: "virage", kind: "scene", cadrage: "buste", annee: 2037, seed: "masques-2040" };
    var svg = global.FusibleArt.scene(spec);
    try {
      var doc = new global.DOMParser().parseFromString(svg, "image/svg+xml"), g = doc.querySelector("g[clip-path]");
      var kids = g ? Array.prototype.filter.call(g.childNodes, function (n) { return n.nodeType === 1; }) : [];
      if (kids.length > 1 && kids[kids.length - 1].nodeName.toLowerCase() === "g") {
        for (var i = 0; i < kids.length - 1; i++) g.removeChild(kids[i]);
        g.removeAttribute("clip-path");
        svg = new global.XMLSerializer().serializeToString(doc);
      }
    } catch (e) { /* le portrait entier, décor compris */ }
    return new Promise(function (ok, ko) {
      var img = new global.Image();
      img.onload = function () { var c = K.tex.canvas(S, S); c.getContext("2d").drawImage(img, 0, 0, S, S); ok(c); };
      img.onerror = function () { ko(new Error("art.js : le visage de Gégé ne se lit pas")); };
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    }).then(function (src) {
      // le cadre du masque : x de 96 à 286, y de 50 à 278 (5 × 6), en unités du portrait
      var X0 = 96, Y0 = 50, LW = 190, LH = 228;
      var W = tt(K, 512), H = Math.round(W * 1.2), c = K.tex.canvas(W, H), x = c.getContext("2d");
      x.drawImage(src, X0 * k, Y0 * k, LW * k, LH * k, 0, 0, W, H);
      var sy = H / LH, sx = W / LW;
      // sous le menton, le cou s'en va
      x.globalCompositeOperation = "destination-in";
      var gr = x.createLinearGradient(0, (236 - Y0) * sy, 0, (246 - Y0) * sy);
      gr.addColorStop(0, "#000"); gr.addColorStop(1, "rgba(0,0,0,0)");
      x.fillStyle = gr; x.fillRect(0, 0, W, H);
      x.globalCompositeOperation = "source-over";
      // art.js dessine en aplats : on lisse la couleur (le contour reste net), puis on imprime
      var p = K.tex.canvas(Math.max(8, Math.round(W / 10)), Math.max(8, Math.round(H / 10))), px = p.getContext("2d");
      px.imageSmoothingEnabled = true; px.imageSmoothingQuality = "high"; px.drawImage(c, 0, 0, p.width, p.height);
      var l = K.tex.canvas(W, H), lx = l.getContext("2d");
      lx.imageSmoothingEnabled = true; lx.imageSmoothingQuality = "high";
      lx.filter = "blur(" + Math.max(1, Math.round(W / 40)) + "px)"; lx.drawImage(p, 0, 0, W, H); lx.filter = "none";
      lx.globalCompositeOperation = "destination-in"; lx.drawImage(c, 0, 0); lx.globalCompositeOperation = "source-over";
      // la couleur lissée ne garde que les grandes masses ; on repose les traits (les yeux, la
      // bouche, la monture) par-dessus, à moitié, pour que le visage se reconnaisse
      lx.globalAlpha = 0.6; lx.drawImage(c, 0, 0); lx.globalAlpha = 1;
      var pr = K.tex.imprimer(l, { encre: "#141414", papier: "#EFE9DA", trame: Math.max(3, Math.round(W / 96)), noir: 0.2, blanc: 0.94 });
      var m = K.tex.canvas(W, H), mx = m.getContext("2d");
      mx.drawImage(pr, 0, 0);
      // les yeux percés (dans les verres), et les deux trous de l'élastique
      mx.globalCompositeOperation = "destination-out";
      [[156, 163], [226, 163]].forEach(function (e) { mx.beginPath(); mx.ellipse((e[0] - X0) * sx, (e[1] - Y0) * sy, 9 * sx, 5 * sy, 0, 0, 7); mx.fill(); });
      [[118, 165], [266, 165]].forEach(function (e) { mx.beginPath(); mx.arc((e[0] - X0) * sx, (e[1] - Y0) * sy, 2.2 * sx, 0, 7); mx.fill(); });
      mx.globalCompositeOperation = "source-over";
      return { texture: K.tex.texture(m, { clamp: true }), canvas: m };
    });
  }

  // un masque seul (Nino, le gros plan) : le carton courbé, l'imprimé devant, le dos nu
  function masqueSeul(K, THREE, tex, w) {
    var h = w * 1.2, geo = new THREE.PlaneGeometry(w, h, 10, 1), p = geo.attributes.position;
    for (var i = 0; i < p.count; i++) { var xx = p.getX(i) / (w / 2); p.setZ(i, -0.5 * xx * xx * w * 0.25); }
    geo.computeVertexNormals(); K.garder(geo);
    var avant = gm(K, new THREE.MeshStandardMaterial({ map: tex, alphaTest: 0.45, roughness: 0.82, side: THREE.FrontSide, emissive: new THREE.Color("#ffffff"), emissiveMap: tex, emissiveIntensity: 0.06 }));
    var dos = gm(K, new THREE.MeshStandardMaterial({ map: tex, alphaTest: 0.45, roughness: 0.9, side: THREE.BackSide }));
    dos.onBeforeCompile = function (sh) { sh.fragmentShader = sh.fragmentShader.replace("#include <map_fragment>", "#include <map_fragment>\n diffuseColor.rgb = vec3(0.38, 0.33, 0.25);"); };
    var g = new THREE.Group(), a = new THREE.Mesh(geo, avant), b = new THREE.Mesh(geo, dos);
    a.castShadow = b.castShadow = true; g.add(a); g.add(b);
    return g;
  }

  // ─── LES PANNEAUX À DIODES ─────────────────────────────────────────────────
  // le nom du club qui défile, en cyan ; à la minute, le noir (la grille des diodes seule)
  function ecranDiodes(K) {
    return K.tex.ecran({ largeur: 1024, hauteur: 64, type: "lcd", fond: "#020406", ips: 30, dessiner: function (x, t, w, h) {
      if (t < T_NOIR) {
        x.fillStyle = "#7FE3FF"; x.textBaseline = "middle"; x.textAlign = "left";
        x.font = "700 " + Math.round(h * 0.66) + 'px "Space Mono","DejaVu Sans Mono",monospace';
        var txt = "RACING AUBÉRIVE · LES AUBES · STADE DE LA RIVE · ", lw = x.measureText(txt).width, off = (t * 90) % lw;
        for (var k = -1; k < 3; k++) x.fillText(txt, k * lw - off, h * 0.54);
      }
      x.fillStyle = "rgba(0,0,0,0.5)";
      for (var i = 0; i < w; i += 3) x.fillRect(i, 0, 1, h);
      for (var j = 0; j < h; j += 3) x.fillRect(0, j, w, 1);
    } });
  }

  // ─── LA RIVE, AVRIL 2040 ──────────────────────────────────────────────────
  // La Nord : le bord de la pelouse en z = 0, les gradins vers -z. La pelouse de z = 3 à
  // 108. La tribune d'honneur à l'ouest (-x), avec la loge vitrée au-dessus de ses
  // derniers rangs ; la tribune d'en face à l'est ; quatre pylônes aux coins.
  function stade(K, ctx, tex) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: { zenith: "#0a1530", horizon: "#2b3a5c", lueur: "#b4643c", lueurDir: [-1, 0.25], force: 0.9 },
      brouillard: ["#131b2b", 0.0042], environnement: { fenetres: 0 }, reflets: 0.7, ambiance: ["#2a3a5c", "#0b0a0a", 0.28] });
    // le sol autour : du béton sombre
    var sol = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(400, 400)), K.mat.beton({ couleur: "#2a2a2c", graine: "sol-rive", banches: 0, repete: [40, 40] }));
    sol.rotation.x = -PI / 2; sol.position.set(0, -0.01, 55); sol.receiveShadow = true; s.add(sol);
    // ── LA NORD
    // des sièges sombres : en `basse`, la foule n'a que 45 % de ses places, et des sièges
    // clairs faisaient des trous dans la Nord
    var nord = P.tribune({ largeur: 64, rangs: 26, parMetre: 1.75, couleurs: ["#4a141c", "#2c2c2f"], toit: true, grillage: false, panneaux: false, graine: "nord-2040" });
    s.add(nord); P.fusionner(nord);
    var pel = P.pelouse({ boue: 0.04 }); pel.position.set(0, 0.02, 3 + 52.5); s.add(pel);
    var cage = P.but(); cage.position.set(0, 0.02, 3.05); s.add(cage);
    // l'estrade du capo, dans la fosse, devant le muret
    P.boite(s, 1.2, 0.6, 0.9, K.mat.metal({ couleur: "#2a2c30", rugosite: 0.6 }), NINO[0], 0.3, NINO[1]);
    // ── LES PANNEAUX À DIODES : devant la Nord, et le long des deux touches
    var ed = ecranDiodes(K);
    var mDiode = gm(K, new THREE.MeshBasicMaterial({ map: ed.texture, color: new THREE.Color(1, 1, 1).multiplyScalar(1.5), toneMapped: false }));
    var mCaisse = K.mat.metal({ couleur: "#15171a", rugosite: 0.5 });
    var diodes = new THREE.Group(); s.add(diodes);
    for (var i = 0; i < 8; i++) {
      var px = -28 + i * 8;
      var f = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(7.9, 0.85)), mDiode); f.position.set(px, 0.55, 1.62); diodes.add(f);
      P.boite(diodes, 7.95, 0.95, 0.25, mCaisse, px, 0.55, 1.48, { ombre: false });
    }
    [-1, 1].forEach(function (sg) {
      for (var j = 0; j < 9; j++) {
        var pz = 12 + j * 10;
        var f2 = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(9.9, 0.85)), mDiode); f2.rotation.y = -sg * PI / 2; f2.position.set(sg * 36.5 - sg * 0.13, 0.55, pz); diodes.add(f2);
        P.boite(diodes, 0.25, 0.95, 9.95, mCaisse, sg * 36.5, 0.55, pz, { ombre: false });
      }
    });
    P.fusionner(diodes);
    // la lueur des diodes sur les premiers rangs ; elle s'éteint avec eux
    var lueursD = [-18, 0, 18].map(function (x0) { var l = K.look.ponctuelle({ couleur: "#7FE3FF", intensite: 6, portee: 9 }); l.position.set(x0, 1.0, 1.0); s.add(l); return l; });
    // ── LA TRIBUNE D'HONNEUR (ouest) ET CELLE D'EN FACE (est)
    var ouest = P.tribune({ largeur: 72, rangs: 15, parMetre: 1.4, couleurs: ["#2e2e30", "#4a141c"], toit: true, grillage: false, panneaux: false, graine: "honneur-2040" });
    ouest.rotation.y = PI / 2; ouest.position.set(-37.5, 0, 55.5); s.add(ouest); P.fusionner(ouest);
    var est = P.tribune({ largeur: 84, rangs: 11, parMetre: 1.3, couleurs: ["#333336", "#2a2a2c"], toit: true, grillage: false, panneaux: false, graine: "est-2040" });
    est.rotation.y = -PI / 2; est.position.set(37.5, 0, 55.5); s.add(est); P.fusionner(est);
    // le virage sud : un mur sombre, quelques fenêtres de coursive allumées
    var sud = new THREE.Mesh(P.boiteUV(90, 12, 6, 3), K.mat.beton({ couleur: "#2e2c2a", graine: "sud" })); sud.position.set(0, 6, 116); s.add(sud);
    // ── LA LOGE : une boîte vitrée au-dessus des derniers rangs de la tribune d'honneur
    // (sa vitre en x = -47,9, tournée vers la pelouse) ; dedans, deux appliques, les invités
    var LX = -47.9, LY = 8.2, LZ = 55.5;
    var mLoge = gm(K, new THREE.MeshStandardMaterial({ color: "#2a2422", roughness: 0.8 }));
    // le socle de la loge : du béton sur les derniers rangs (ils n'ont pas de public), et des
    // sièges mats partout (lustrés, ils renvoyaient les pylônes droit dans la vitre)
    P.boite(s, 4.4, 2.8, 9.8, K.mat.beton({ couleur: "#3a3734", graine: "socle-loge" }), LX - 2.1, LY - 1.4, LZ);
    [nord, ouest, est].forEach(function (tr) { if (tr.sieges) { tr.sieges.material.roughness = 0.65; } });
    P.boite(s, 4.2, 0.2, 9.4, gm(K, new THREE.MeshStandardMaterial({ color: "#1a1416", roughness: 0.95 })), LX - 2.1, LY, LZ);     // le sol (moquette)
    P.boite(s, 4.2, 0.2, 9.4, mLoge, LX - 2.1, LY + 3.0, LZ);                                                                       // le plafond
    P.boite(s, 0.2, 3.0, 9.4, mLoge, LX - 4.2, LY + 1.5, LZ);                                                                       // le fond
    [-1, 1].forEach(function (sg) { P.boite(s, 4.2, 3.0, 0.2, mLoge, LX - 2.1, LY + 1.5, LZ + sg * 4.7); });                        // les côtés
    P.boite(s, 0.25, 0.9, 9.4, mLoge, LX + 0.02, LY + 0.45, LZ);                                                                    // l'allège
    // la tablette, mate : vernie, elle renvoyait le pylône nord-est droit dans l'objectif
    P.boite(s, 0.6, 0.05, 9.0, gm(K, new THREE.MeshStandardMaterial({ color: "#2e221a", roughness: 0.92 })), LX - 0.35, LY + 0.92, LZ);
    var mVerre = gm(K, new THREE.MeshPhysicalMaterial({ color: "#1d2329", roughness: 0.04, metalness: 0, transparent: true, opacity: 0.14, envMapIntensity: 0.4, depthWrite: false }));
    var vitre = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(9.4, 2.1)), mVerre); vitre.rotation.y = PI / 2; vitre.position.set(LX + 0.08, LY + 1.95, LZ); s.add(vitre);
    var meneaux = new THREE.Group(); s.add(meneaux);
    for (var mz = -4.6; mz <= 4.61; mz += 2.3) P.boite(meneaux, 0.1, 2.1, 0.08, gm(K, new THREE.MeshStandardMaterial({ color: "#0e0f11", roughness: 0.5 })), LX + 0.08, LY + 1.95, LZ + mz);
    P.fusionner(meneaux);
    // deux verres sur la tablette
    var mGl = gm(K, new THREE.MeshPhysicalMaterial({ color: "#c8d2d8", roughness: 0.05, transparent: true, opacity: 0.35, envMapIntensity: 1.5 }));
    [[-0.3, -1.4], [-0.32, 1.1]].forEach(function (v) { P.cylindre(s, 0.035, 0.028, 0.11, mGl, LX + v[0], LY + 1.0, LZ + v[1], { cotes: 12 }); });
    // les appliques du fond (derrière la caméra), et leur reflet dans la vitre : on le peint
    // dehors, à la place que la vitre lui donne (symétrique par rapport au plan de la vitre)
    var appliques = [[-4.05, 2.1, -2.4], [-4.05, 2.1, 2.2]].map(function (a) {
      var l = K.look.ponctuelle({ couleur: "#FFC98A", intensite: 2.2, portee: 6 }); l.position.set(LX + a[0] + 0.2, LY + a[1], LZ + a[2]); s.add(l);
      var h = K.look.halo({ couleur: "#FFC98A", taille: 0.5, intensite: 0.8 }); h.position.set(LX + a[0] + 0.12, LY + a[1], LZ + a[2]); s.add(h);
      var rf = K.look.halo({ couleur: "#FFB877", taille: 0.3, intensite: 0.1 }); rf.position.set(LX - a[0] + 0.16, LY + a[1], LZ + a[2]); s.add(rf);
      return l;
    });
    // les invités, de dos, assis contre la vitre : des silhouettes
    var invites = K.gens.foule({ places: [{ x: LX - 1.15, y: LY + 0.1, z: LZ - 0.1, ry: PI / 2 + 0.2 }, { x: LX - 1.1, y: LY + 0.1, z: LZ + 0.75, ry: PI / 2 }, { x: LX - 1.25, y: LY + 0.1, z: LZ - 2.2, ry: PI / 2 - 0.15 }],
      debout: false, couleurs: ["#0a0a0d", "#111014", "#0d0c10"], partEcharpes: 0, graine: "invites" });
    s.add(invites);
    // ── LES QUATRE PYLÔNES : ceux du sud éclairent la Nord de face
    var pyl = [
      { p: [-39, -6], c: [0, 0, 45], i: 4200 }, { p: [39, -6], c: [0, 0, 45], i: 4200 },
      { p: [-39, 116], c: [-4, 7, -8], i: 20000, ombre: true }, { p: [39, 116], c: [4, 7, -8], i: 20000 }
    ].map(function (d) {
      var p = P.pylone({ hauteur: 34, colonnes: 5, rangees: 4, couleur: "#EEF2FF", intensite: d.i, ombre: !!d.ombre, longueurCone: d.p[1] > 50 ? 120 : 60, rayonCone: d.p[1] > 50 ? 24 : 14, forceCone: 0.06, graine: "py" + d.p.join("_") });
      p.groupe.position.set(d.p[0], 0, d.p[1]); s.add(p.groupe);
      s.updateMatrixWorld(true);
      p.viser(d.c[0], d.c[1], d.c[2]);
      p.lumiere.angle = 0.55; p.lumiere.penombre = 0.7;
      if (d.ombre) { p.lumiere.shadow.camera.far = 180; p.lumiere.shadow.bias = -0.0008; }
      return p;
    });
    // ── LA FOULE DE LA NORD : trois mille places, chacune avec son masque
    var nordPlaces = nord.places.slice();
    // la place du gros plan (premier rang, un peu à gauche du milieu) : elle a son propre mannequin
    var GP = null, gpI = -1;
    nordPlaces.forEach(function (p, i) { if (p.rang === 1 && (gpI < 0 || Math.abs(p.x + 4.2) < Math.abs(nordPlaces[gpI].x + 4.2))) gpI = i; });
    GP = nordPlaces[gpI]; nordPlaces.splice(gpI, 1);
    var foule = K.gens.foule({ places: nordPlaces, masque: tex.masque, vague: { t0: T_VAGUE, duree: 0.6, origine: NINO, vitesse: 11, desordre: 0.45 }, couleurs: ["#16171b", "#1f2024", "#25221f", "#121318", "#262b33", "#2e2622"],
      echarpes: BORDEAUX, partEcharpes: 0.3, graine: "nord-2040", lueurMasques: 0.1 });
    s.add(foule);
    // le gros plan a sa vague aussi : il lève le sien à son tour
    GP.leve = T_VAGUE + Math.hypot(GP.x - NINO[0], GP.z - NINO[1]) / 11 + 0.2;
    // ── LES ÉCRANS DE TÉLÉPHONE : une place sur quatre, levé à hauteur de tête ; chacun
    // s'éteint pendant la minute, avant que son masque monte
    var gardees = foule.places, tels = [];
    gardees.forEach(function (p, i) { if (K.h01(i, 41) < 0.26) tels.push({ p: p, i: i }); });
    var gTel = K.garder(new THREE.PlaneGeometry(0.075, 0.135));
    var mTel = gm(K, new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }));
    var ecrans = new THREE.InstancedMesh(gTel, mTel, Math.max(1, tels.length));
    var dd = new THREE.Object3D(), col = new THREE.Color();
    tels.forEach(function (e, n) {
      var p = e.p, h1 = K.h01(e.i, 43), h2 = K.h01(e.i, 47);
      dd.position.set(p.x + (h1 - 0.5) * 0.24, p.y + 1.62 + h2 * 0.28, p.z + 0.32); dd.rotation.set(-0.15 + h2 * 0.2, (h1 - 0.5) * 0.4, (h2 - 0.5) * 0.2); dd.updateMatrix();
      ecrans.setMatrixAt(n, dd.matrix);
      e.lum = 1.2 + K.h01(e.i, 53) * 1.4;
      e.teinte = K.h01(e.i, 59) < 0.3 ? "#ffe3c4" : "#d6e6ff";
      e.off = Math.min(T_NOIR + 0.6 + K.h01(e.i, 61) * 8.5, p.leve - 0.35);
      ecrans.setColorAt(n, col.set(e.teinte).multiplyScalar(e.lum));
    });
    ecrans.count = tels.length; ecrans.instanceMatrix.needsUpdate = true; ecrans.frustumCulled = false; ecrans.castShadow = false;
    s.add(ecrans);
    // ── LES TRIBUNES DES CÔTÉS : du monde, assis, une place sur trois
    var cotes = ["ouest", "est"].map(function (nm, j) {
      var tr = j ? est : ouest, ry = j ? -PI / 2 : PI / 2;
      var pl = [];
      tr.updateMatrixWorld(true);
      var v = new THREE.Vector3();
      tr.places.forEach(function (p, i) {
        if (K.h01(i, 71 + j) > 0.3) return;
        // pas sous la loge (ses quatre derniers rangs, au milieu)
        if (!j && p.rang > 10 && Math.abs(p.x) < 5.2) return;
        v.set(p.x, p.y, p.z).applyMatrix4(tr.matrixWorld);
        pl.push({ x: v.x, y: v.y, z: v.z, ry: ry });
      });
      var fo = K.gens.foule({ places: pl, debout: false, couleurs: ["#16171b", "#1f2024", "#25221f", "#262b33"], echarpes: BORDEAUX, partEcharpes: 0.2, graine: "cote-" + nm });
      s.add(fo);
      return fo;
    });
    // ── LES JOUEURS AUTOUR DU ROND CENTRAL, tournés vers le point du milieu (la minute) :
    // les Aubes sur la moitié de la Nord, les visiteurs en face ; l'arbitre au milieu. Vu de la
    // loge (au bout de la ligne médiane), une ligne se verrait par la tranche ; un rond se lit.
    function ronde(de, n, coul, gr) {
      var pl = [];
      for (var q = 0; q < n; q++) { var a = (de + (q + 0.5) / n) * PI, ca = Math.cos(a), sa = Math.sin(a); pl.push({ x: 9.15 * ca, y: 0.02, z: 55.5 + 9.15 * sa, ry: Math.atan2(-ca, -sa) }); }
      var fo = K.gens.foule({ places: pl, couleurs: [coul], partEcharpes: 0, graine: gr }); s.add(fo); return fo;
    }
    var arbitre = K.gens.foule({ places: [{ x: -1.2, y: 0.02, z: 55.5, ry: -PI / 2 }], couleurs: ["#121214"], partEcharpes: 0, graine: "arbitre" }); s.add(arbitre);
    var equipes = [ronde(1, 11, "#a8304a", "aubes"), ronde(0, 11, "#d9d5c8", "visiteurs"), arbitre];
    // ── NINO, sur l'estrade à droite du but, tourné vers la pelouse, la tête basse ; son masque
    var nino = K.gens.mannequin({ tenue: "blouson", couleur: "#23252b", couleur2: "#1a1b1f", casquette: true, echarpe: BORDEAUX, taille: 1.8, graine: "nino-2040" });
    nino.groupe.position.set(NINO[0], 0.6, NINO[1]); s.add(nino.groupe);
    var mNino = masqueSeul(K, THREE, tex.masque, 0.3); s.add(mNino);
    // ── LE GROS PLAN : un homme du premier rang, son masque, l'écharpe nouée au poignet
    var gp = K.gens.mannequin({ tenue: "blouson", couleur: "#1c1d22", couleur2: "#15161a", graine: "gros-plan" });
    gp.groupe.position.set(GP.x, GP.y, GP.z); s.add(gp.groupe);
    var mGp = masqueSeul(K, THREE, tex.masque, 0.3); gp.groupe.add(mGp);
    var mEch = gm(K, new THREE.MeshStandardMaterial({ color: BORDEAUX, roughness: 0.92 }));
    var noeud = new THREE.Mesh(K.garder(new THREE.TorusGeometry(0.052, 0.022, 8, 16)), mEch); noeud.rotation.x = PI / 2; noeud.position.set(0, -0.2, 0); gp.os.coudeG.add(noeud);
    var pan = new THREE.Mesh(K.garder(new THREE.BoxGeometry(0.075, 0.42, 0.018)), mEch); pan.position.set(0.03, -0.42, 0.04); pan.rotation.z = 0.1; gp.os.coudeG.add(pan);
    var reflets = [K.look.reflet({ pos: [0, 0, 1.6], sol: 0.03, couleur: "#7FE3FF", intensite: 0.35, largeur: 20, longueur: 3 })];
    reflets.forEach(function (r) { s.add(r); });
    return {
      scene: s, tribune: nord, foule: foule, gros: GP,
      look: { bloom: 0.75, rayon: 0.6, seuil: 0.84, exposition: 0.95, contraste: 1.14, saturation: 0.9, noirs: 0.02 },
      maj: function (t, c) {
        ed.maj(t);
        pyl.forEach(function (p) { p.maj(t); });
        var allume = 1 - K.lisse(T_NOIR - 0.05, T_NOIR + 0.15, t);
        lueursD.forEach(function (l) { l.intensity = 6 * allume; });
        reflets[0].visible = allume > 0.01;
        reflets.forEach(function (r) { r.maj(c.camera); });
        foule.maj(t); cotes.forEach(function (f) { f.maj(t); }); equipes.forEach(function (f) { f.maj(t); }); invites.maj(t);
        // les masques de la Nord : posés sur les genoux qu'au moment où la loge regarde
        if (foule.masques) foule.masques.visible = t >= 15.5;
        // les écrans : chacun s'éteint à son heure
        tels.forEach(function (e, n) { var k = 1 - K.lisse(e.off, e.off + 0.3, t); ecrans.setColorAt(n, col.set(e.teinte).multiplyScalar(e.lum * k)); });
        if (ecrans.instanceColor) ecrans.instanceColor.needsUpdate = true;
        // Nino : il attend, puis il lève le premier ; son masque monte devant sa tête
        var kn = K.lisse(T_NINO, T_NINO + 0.7, t);
        nino.leverMasque(t, kn); if (kn < 0.5) nino.os.tete.rotation.x = 0.35 * (1 - kn * 2);
        var bas = 1.08, haut = 1.68;
        mNino.position.set(NINO[0], 0.6 + K.mix(bas, haut, kn), NINO[1] + K.mix(0.3, 0.19, kn));
        mNino.rotation.set(K.mix(-1.2, 0, kn), 0, 0);
        mNino.visible = t >= 15.5;
        // le gros plan : sa vague, son masque (dans le repère du mannequin)
        var kg = K.lisse(GP.leve, GP.leve + 0.6, t);
        gp.leverMasque(t, kg);
        mGp.position.set(0, K.mix(bas, haut, kg), K.mix(0.3, 0.19, kg));
        mGp.rotation.set(K.mix(-1.2, 0, kg), 0, 0);
        mGp.visible = t >= 15.5;
      }
    };
  }

  FC.film({
    id: "match_d_apres",
    livre: "escalier_ferme",
    titre: "Le match d'après",
    duree: 38.5,
    musique: "livre_h10",
    musiqueFilm: "film_match_d_apres",
    secours: "match",
    couleur: AMBRE,
    affiche: 36.2,
    habillage: { vignette: 0.55, grain: 0.07, ratioPaysage: 2.35, ratioPortrait: 0 },
    sortie: { noir: 1.4 },
    // le coup de sifflet de la minute
    sons: [[T_NOIR + 0.05, "match_debut"]],
    textes: [
      { sorte: "lieu", de: 0.9, a: 6.2, texte: "La Rive, la Nord", sous: "Avril 2040 · le match d'après" },
      { sorte: "titre", de: 33.8, a: 38.2, texte: "Aubérive · 2040", sous: "Les Deux Téléphones", entree: 0.2, sortie: 0.7 }
    ],
    montages: { court: [[0.4, 5.8], [7.6, 12.0], [13.4, 17.8], [19.8, 26.8], [29.0, 31.2], [33.0, 38.2]] },
    preparer: function (K, ctx) {
      return masqueGege(K).then(function (m) {
        var tex = { masque: m.texture };
        return K.etapes(ctx, [function () { ctx.decors.stade = stade(K, ctx, tex); }]);
      });
    },
    plans: [
      // 1 · la Nord depuis la pelouse, à l'heure bleue : les pylônes, les écrans, les panneaux
      { de: 0, a: 7.0, decor: "stade", entree: "noir", transition: 1.4, fixe: 4.2,
        camera: { pos: K_cles([[0, [9, 1.6, 47]], [7.0, [5.5, 2.1, 31]]], "lin"), cible: K_cles([[0, [0, 6.5, -8]], [7.0, [-1, 7.2, -10]]], "lin"), fov: 52, epaule: 0.05 },
        cadrage: { portrait: { x: -0.1 } } },
      // 2 · au ras des panneaux, les premiers rangs ; les diodes s'éteignent, le sifflet
      { de: 7.0, a: 12.4, decor: "stade", entree: "coupe", fixe: 2.6,
        camera: { pos: K_cles([[0, [-12, 0.85, 6.4]], [5.4, [-6.5, 1.0, 6.0]]], "lin"), cible: K_cles([[0, [-2, 1.9, -1]], [5.4, [2, 2.6, -4]]], "douce"), fov: 46, epaule: 0.08 },
        cadrage: { portrait: { x: 0.2 } } },
      // 3 · la loge, derrière la vitre : les équipes autour du rond, la Nord à gauche qui s'éteint
      { de: 12.4, a: 19.6, decor: "stade", entree: "noir", transition: 0.7, fixe: 5.5,
        camera: { pos: K_cles([[0, [-51.6, 9.75, 57.6]], [7.2, [-50.6, 9.7, 57.0]]], "lin"), cible: K_cles([[0, [0, 2.0, 34]], [7.2, [0, 2.4, 30]]], "lin"), fov: 58, epaule: 0.04 },
        cadrage: { portrait: { x: K_cles([[0, 0.55], [7.2, -0.75]], "douce") } } },
      // 4 · devant la Nord : Nino lève le premier, puis la vague ; la grue monte
      { de: 19.6, a: 28.6, decor: "stade", entree: "coupe", fixe: 6.6,
        camera: { pos: K_cles([[0, [5.6, 1.2, 11.5]], [9.0, [4.2, 3.7, 15.0]]], "douce"), cible: K_cles([[0, [7.2, 2.7, -2.4]], [2.4, [6.8, 3.1, -3.4]], [9.0, [1.5, 6.8, -11]]], "douce"), fov: K_cles([[0, 36], [9.0, 54]], "douce"), epaule: 0.06 },
        cadrage: { portrait: { x: -0.05 } } },
      // 5 · un masque de près, l'écharpe au poignet ; la caméra recule : la Nord entière ; le titre
      { de: 28.6, a: 38.5, decor: "stade", entree: "fondu", transition: 0.9, fixe: 6.0,
        camera: { pos: function (l, p, c) { var g = c.decors.stade.gros, k = K_aisance("douce")(K_borne(l / 9.9)); return [g.x + K_lerp(0.05, 3.0, k), g.y + K_lerp(1.7, 4.4, k), g.z + K_lerp(1.12, 17.5, k)]; },
          cible: function (l, p, c) { var g = c.decors.stade.gros, k = K_aisance("douce")(K_borne(l / 9.9)); return [g.x + K_lerp(0, 4.2, k), g.y + K_lerp(1.7, 4.2, k), g.z + K_lerp(0.15, -6, k)]; },
          fov: K_cles([[0, 40], [9.9, 50]], "douce"), epaule: 0.03 } }
    ]
  });

  function K_() { return FC.kit; }
  function K_cles(p, a) { var f = null; return function (t) { if (!f) f = K_().cles(p, a); return f(t); }; }
  function K_aisance(n) { return K_().aisance(n); }
  function K_borne(v) { return Math.max(0, Math.min(1, v)); }
  function K_lerp(a, b, k) { return a + (b - a) * k; }
})(typeof window !== "undefined" ? window : this);
