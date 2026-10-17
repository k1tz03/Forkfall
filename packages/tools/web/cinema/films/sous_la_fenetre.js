/* ═══════════════════════════════════════════════════════════════════════════
   « L'homme sous la fenêtre » — le second film du livre 1, « Trois mille
   visages » (1990-1991, l'entraîneur promu ; la couleur du livre : #FF5A4E).

   La fin de la première saison (S0, créneau 17, la carte en.h1.a5_fenetre :
   « Mardi, minuit, rue des Lilas. En bas, entre deux voitures, un homme en
   manteau porte ton visage. Il ne bouge pas. Camille a éteint la lampe. »). Le
   film se joue avant la carte : la nuit qui la précède, vue de la rue puis de
   la fenêtre. Le premier film (« Trois mille masques ») montrait les masques
   qu'on imprime et le virage qui les lève par amour ; celui-ci montre UN masque,
   sorti du stade, porté la nuit par quelqu'un, sous ta fenêtre : l'amour qui
   devient une menace (la quatrième de couverture : « Ils feront ce que tu
   n'oses pas faire. Avec ton visage. »).

   Ce qu'il montre, et pourquoi — rien que la carte et ce que le joueur sait :
     · la rue des Lilas, minuit, la bruine ; au troisième, ta fenêtre allumée ;
       en face, entre deux voitures, sous le réverbère, un homme immobile ;
     · dedans : la toile cirée, le radio-réveil qui passe de 23:59 à 00:00 (la
       couleur du livre : ses chiffres rouges), la lampe, la vitre mouillée ;
     · l'homme, de dos : les mains jointes dans le dos — ta façon de te tenir
       sur le banc (le vieux du livre : « Votre façon de vous tenir debout sur
       le banc, les mains dans le dos… ») ; il regarde ta fenêtre ;
     · son visage : le tien, imprimé, le carton mouillé, la pluie qui coule ;
       Camille, de la fenêtre, une ligne (au neutre : « comme toi ») ;
     · une main éteint la lampe ; la vitre cesse de refléter la pièce, la rue
       apparaît ; une voiture passe, ses phares le balaient, il ne bouge pas ;
     · de la fenêtre, le regard se resserre sur le masque qui te regarde.
   Rien n'y dit qui porte le masque, ni pourquoi (l'homme s'en va quand on
   descend, la police ne trouve personne : la carte, après le film, le dit).
   Le film ne se joue pas si Camille est partie (`!flag(divorce)` : la variante
   « seul » de la carte n'a personne pour éteindre la lampe ni pour la ligne).

   LES PLANS (35,6 s) — un seul décor, la rue et la pièce du troisième, pour
   que la lumière soit la même dedans et dehors :
     1  0–5,6     la rue des Lilas, la grue : de ta fenêtre allumée au
                  troisième, elle descend le long de la rue jusqu'au réverbère
                  d'en face ; sous lui, entre deux voitures, un homme ; carton
                  « Aubérive, rue des Lilas / Mardi · minuit »  (le lieu, l'heure)
     2  5,6–10,2  dedans, tout près : le radio-réveil sur la toile cirée,
                  23:59 → 00:00 (7,8 s) ; derrière, la lampe et la vitre
                  mouillée (fondu enchaîné depuis la rue)      (chez toi, minuit)
     3  10,2–15,6 la rue, derrière lui, d'un peu haut : ses mains jointes dans
                  le dos ; la caméra monte le long de la façade jusqu'à ta
                  fenêtre ; la ligne de Camille (12,4–17,4)     (il te regarde)
     4  15,6–21   son visage : le tien, imprimé sur le carton mouillé, la tête
                  et les épaules, la pluie dessus               (ton visage, dehors)
     5  21–24,2   dedans : la lampe, le réveil, la vitre ; une main tourne le
                  bouton (le clic, 22,7 s) ; il ne reste que les chiffres rouges
                                                  (on ne voit qu'en s'éteignant)
     6  24,2–30,8 de la fenêtre, par le carreau du bas : l'homme en bas, entre
                  les deux voitures ; une voiture descend la rue, ses phares le
                  prennent (26,6–28,2), elle passe devant lui (28,6), il ne
                  bouge pas                                     (il ne bouge pas)
     7  30,8–35,6 de la même fenêtre, le regard se resserre sur le masque, qui
                  te regarde ; carton « Aubérive · 1991 / Trois mille visages »
                  posé sous lui, sur le manteau
   La lumière : le sodium du réverbère (au-dessus de lui), la lampe chaude de
   la pièce (jusqu'au clic), le rouge des chiffres du réveil (l'accent du
   livre), les phares d'une voiture (blancs, une fois). La pluie est une bruine.
   La ligne : Camille, « Il se tient comme toi sur le banc. Les mains dans le
   dos. » — ce qu'elle voit de la fenêtre, et ce qui fait peur : on ne lui a
   pas seulement pris ton visage.
   La coupe de 30 s (l'App Store) : les mêmes plans, resserrés (montages.court).
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var FC = global.FusibleCinema;
  var PI = Math.PI;
  var ROUGE = "#FF5A4E";
  // la rue des Lilas va le long de z ; ta façade à gauche (x < 0), celle d'en face à droite
  var XG = -5.7, XD = 5.7, EP = 0.35;
  // ta fenêtre, au troisième : la case (colonne 2, rangée 1) des fenêtres de la façade
  var FEN = { y0: 10.54, y1: 12.34, d: 0.59 }, SOL3 = 9.8, HAUT = 2.6;
  var XVITRE = XG - 0.16;
  // l'homme : entre deux voitures, au bord du trottoir d'en face, tourné vers ta fenêtre
  var HOMME = [2.95, 0, -0.05];
  var T_LAMPE = 22.7, T_MINUIT = 7.8;

  // ─── les matières propres au film ────────────────────────────────────────
  // le papier peint de 1970 : des bandes fanées, une petite fleur, des taches d'humidité
  function papierPeint(K) {
    var W = 512, c = K.tex.canvas(W, W), x = c.getContext("2d");
    x.fillStyle = "#7d7a5c"; x.fillRect(0, 0, W, W);
    for (var b = 0; b < 8; b++) { x.fillStyle = b % 2 ? "rgba(255,240,200,0.07)" : "rgba(40,30,10,0.06)"; x.fillRect(b * W / 8, 0, W / 8, W); }
    for (var j = 0; j < 8; j++) for (var i = 0; i < 8; i++) {
      var cx = (i + (j % 2) * 0.5) * W / 8 + W / 16, cy = j * W / 8 + W / 16;
      x.fillStyle = "rgba(150,90,60,0.45)";
      for (var p = 0; p < 4; p++) { x.beginPath(); x.ellipse(cx + Math.cos(p * PI / 2) * 6, cy + Math.sin(p * PI / 2) * 6, 5, 3, p * PI / 2, 0, 7); x.fill(); }
      x.fillStyle = "rgba(70,90,50,0.5)"; x.beginPath(); x.arc(cx, cy, 2.5, 0, 7); x.fill();
    }
    var n = K.tex.couche(W, W, { periode: 3, octaves: 4, graine: "papier-lilas" }), im = x.getImageData(0, 0, W, W), d = im.data;
    for (var q = 0, k = 0; k < n.length; k++, q += 4) { var v = 0.82 + n[k] * 0.3; d[q] *= v; d[q + 1] *= v; d[q + 2] *= v; }
    x.putImageData(im, 0, 0);
    return K.tex.texture(c, {});
  }
  // la toile cirée : un vichy bleu passé, brillante
  function toileCiree(K) {
    var W = 256, c = K.tex.canvas(W, W), x = c.getContext("2d"), n = 8, w = W / n;
    x.fillStyle = "#e8e4d8"; x.fillRect(0, 0, W, W);
    for (var i = 0; i < n; i++) {
      x.fillStyle = "rgba(60,90,130,0.45)"; if (i % 2) { x.fillRect(i * w, 0, w, W); x.fillRect(0, i * w, W, w); }
    }
    for (var k = 0; k < 600; k++) { x.fillStyle = "rgba(255,255,255," + (K.h01(k, 3) * 0.08) + ")"; x.fillRect(K.h01(k, 5) * W, K.h01(k, 7) * W, 2, 2); }
    return K.tex.texture(c, { repete: [3, 2] });
  }
  // le voilage : un tulle clair, une bordure brodée en bas, des plis
  function voilage(K) {
    var W = 256, H = 512, c = K.tex.canvas(W, H), x = c.getContext("2d");
    x.fillStyle = "rgba(235,230,215,0.55)"; x.fillRect(0, 0, W, H);
    x.strokeStyle = "rgba(255,255,255,0.35)"; x.lineWidth = 1;
    for (var i = 0; i < W; i += 4) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, H); x.stroke(); }
    for (var j = 0; j < H; j += 4) { x.beginPath(); x.moveTo(0, j); x.lineTo(W, j); x.stroke(); }
    x.fillStyle = "rgba(240,236,224,0.85)";
    for (var k = 0; k < 8; k++) { x.beginPath(); x.arc(k * W / 8 + W / 16, H - 26, 12, PI, 0); x.fill(); x.fillRect(k * W / 8, H - 26, W / 8, 26); }
    return K.tex.texture(c, { clamp: true });
  }
  // les chiffres du radio-réveil : sept segments rouges, l'heure qui passe
  function reveil(K) {
    var SEG = { 0: "abcfed", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg" };
    function chiffre(x, d, X, Y, w, h, on) {
      var e = w * 0.16, segs = { a: [X + e, Y, w - 2 * e, e], b: [X + w - e, Y + e, e, h / 2 - 1.5 * e], c: [X + w - e, Y + h / 2 + 0.5 * e, e, h / 2 - 1.5 * e],
        d: [X + e, Y + h - e, w - 2 * e, e], e: [X, Y + h / 2 + 0.5 * e, e, h / 2 - 1.5 * e], f: [X, Y + e, e, h / 2 - 1.5 * e], g: [X + e, Y + h / 2 - e / 2, w - 2 * e, e] };
      "abcdefg".split("").forEach(function (s) {
        var r = segs[s]; x.fillStyle = SEG[d].indexOf(s) >= 0 ? on : "rgba(60,12,10,0.55)";
        x.fillRect(r[0], r[1], r[2], r[3]);
      });
    }
    return K.tex.ecran({ largeur: 256, hauteur: 96, type: "lcd", fond: "#070303", ips: 2, dessiner: function (x, t, w, h) {
      var hh = t < T_MINUIT ? [2, 3, 5, 9] : [0, 0, 0, 0];
      var cw = w * 0.17, ch = h * 0.7, y = h * 0.15, on = "#FF4A3A";
      x.shadowColor = "#FF2A1A"; x.shadowBlur = 6;
      chiffre(x, hh[0], w * 0.06, y, cw, ch, on); chiffre(x, hh[1], w * 0.26, y, cw, ch, on);
      x.fillStyle = on; if (Math.floor(t * 2) % 2 === 0) { x.fillRect(w * 0.475, h * 0.33, w * 0.03, w * 0.03); x.fillRect(w * 0.475, h * 0.58, w * 0.03, w * 0.03); }
      chiffre(x, hh[2], w * 0.55, y, cw, ch, on); chiffre(x, hh[3], w * 0.75, y, cw, ch, on);
      x.shadowBlur = 0;
      x.fillStyle = "#FF4A3A"; x.fillRect(w * 0.93, h * 0.2, w * 0.02, w * 0.02);   // le point de l'alarme
    } });
  }
  // la vitre : des gouttes posées, d'autres qui glissent et laissent leur trace
  function gouttesVitre(K) {
    return K.tex.ecran({ largeur: 256, hauteur: 384, type: "lcd", fond: "#000", ips: 20, dessiner: function (x, t, w, h) {
      for (var i = 0; i < 160; i++) {
        var gx = K.h01(i, 21) * w, gy = K.h01(i, 23) * h, r = 0.7 + K.h01(i, 27) * 1.8;
        x.fillStyle = "rgba(255,255,255," + (0.25 + K.h01(i, 29) * 0.45) + ")"; x.beginPath(); x.arc(gx, gy, r, 0, 7); x.fill();
      }
      for (var j = 0; j < 14; j++) {
        var v = 0.04 + K.h01(j, 31) * 0.09, sx = K.h01(j, 33) * w, sy = ((K.h01(j, 35) + t * v) % 1) * h * 1.25 - h * 0.1;
        x.fillStyle = "rgba(255,255,255,0.18)"; x.fillRect(sx - 0.8, sy - h * 0.12, 1.6, h * 0.12);
        x.fillStyle = "rgba(255,255,255,0.95)"; x.beginPath(); x.arc(sx, sy, 2.2, 0, 7); x.fill();
      }
    } });
  }

  // ─── LA RUE DES LILAS, ET LA PIÈCE DU TROISIÈME ─────────────────────────
  function lilas(K, ctx, tex) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: { zenith: "#03040b", horizon: "#141a2c", lueur: "#3a2618", lueurDir: [0, -1], force: 0.75 },
      brouillard: ["#0a0d18", 0.022], environnement: { fenetres: 28 }, reflets: 1.0, ambiance: ["#2c3a58", "#0a0806", 0.2] });
    // la chaussée, les trottoirs
    var rue = P.rue({ longueur: 96, largeur: 7, trottoir: 2.2, flaques: 0.5, graine: "lilas" }); rue.position.z = -12; s.add(rue);
    rue.children[0].material.envMapIntensity = 2.0;

    // ── les façades : la tienne (percée au troisième), les voisines, celles d'en face
    var gauche = [{ z: 10.5, w: 11, e: 4, g: "lg1", b: "#5f2d22" }, { z: 21.5, w: 11, e: 3, g: "lg2", b: "#62352a" },
      { z: -10.5, w: 11, e: 4, g: "lg3", b: "#583026" }, { z: -21.5, w: 11, e: 3, g: "lg4", b: "#64382a" }, { z: -33, w: 12, e: 4, g: "lg5", b: "#5a2c24" }];
    gauche.forEach(function (f) {
      var fa = P.facade({ largeur: f.w, etages: f.e, graine: f.g, brique: f.b, vitrine: true, fenetres: { allumees: 0.1 } });
      fa.rotation.y = PI / 2; fa.position.set(XG, 0, f.z); s.add(fa);
    });
    var droite = [{ z: 0, w: 10, e: 4, g: "ld1", b: "#5c3226" },
      { z: 10.5, w: 11, e: 3, g: "ld2", b: "#61342a" }, { z: 21.5, w: 11, e: 4, g: "ld3", b: "#5e2e22" },
      { z: -10.5, w: 11, e: 3, g: "ld4", b: "#6a3a2c" }, { z: -21.5, w: 11, e: 4, g: "ld5", b: "#5a2e24" }, { z: -33, w: 12, e: 3, g: "ld6", b: "#5e3226" }];
    droite.forEach(function (f) {
      var fa = P.facade({ largeur: f.w, etages: f.e, graine: f.g, brique: f.b, enseigne: f.enseigne, vitrine: true, fenetres: { allumees: 0.15 } });
      fa.rotation.y = -PI / 2; fa.position.set(XD, 0, f.z); s.add(fa);
    });
    var fond = P.facade({ largeur: 18, etages: 4, graine: "lfond", brique: "#4e2a22", fenetres: { allumees: 0.2 } }); fond.position.set(0, 0, -44); s.add(fond);
    var fond2 = P.facade({ largeur: 18, etages: 3, graine: "lfond2", brique: "#4e2a22", fenetres: { allumees: 0.12 } }); fond2.rotation.y = PI; fond2.position.set(0, 0, 36); s.add(fond2);

    // ta façade : le mur de brique percé de ta fenêtre (une forme à trou : la brique suit
    // le mètre d'un seul tenant), les autres fenêtres peintes, une case laissée vide
    var W = 10, H = 16;
    var forme = new THREE.Shape();
    forme.moveTo(-W / 2, 0); forme.lineTo(W / 2, 0); forme.lineTo(W / 2, H); forme.lineTo(-W / 2, H); forme.lineTo(-W / 2, 0);
    var trou = new THREE.Path();
    trou.moveTo(-FEN.d, FEN.y0); trou.lineTo(-FEN.d, FEN.y1); trou.lineTo(FEN.d, FEN.y1); trou.lineTo(FEN.d, FEN.y0); trou.lineTo(-FEN.d, FEN.y0);
    forme.holes.push(trou);
    var gMur = K.garder(new THREE.ShapeGeometry(forme));
    var uv = gMur.attributes.uv; for (var u = 0; u < uv.count; u++) uv.setXY(u, uv.getX(u) / 2.4, uv.getY(u) / 2.4);
    var mBrique = K.mat.brique({ couleur: "#6a3528", graine: "lilas-heros", suie: 0.7 });
    var mur = new THREE.Mesh(gMur, mBrique); mur.rotation.y = PI / 2; mur.position.set(XG, 0, 0); mur.receiveShadow = true; mur.castShadow = true; s.add(mur);
    // l'épaisseur du mur autour de la fenêtre (l'ébrasement), et l'appui de pierre
    var mPierre = K.mat.beton({ couleur: "#8a8478", graine: "pierre-lilas", banches: 0 });
    P.boite(s, EP, 0.06, FEN.d * 2, mPierre, XG - EP / 2, FEN.y1 + 0.03, 0);
    P.boite(s, EP, FEN.y1 - FEN.y0, 0.06, mBrique, XG - EP / 2, (FEN.y0 + FEN.y1) / 2, -FEN.d - 0.03);
    P.boite(s, EP, FEN.y1 - FEN.y0, 0.06, mBrique, XG - EP / 2, (FEN.y0 + FEN.y1) / 2, FEN.d + 0.03);
    P.boite(s, EP + 0.12, 0.07, FEN.d * 2 + 0.2, mPierre, XG - EP / 2 + 0.06, FEN.y0 - 0.035, 0);
    // les autres fenêtres de l'immeuble (la case du troisième, au milieu, est la tienne)
    var fen = K.tex.fenetres({ colonnes: 5, rangees: 4, allumees: 0.1, mur: "#000000", graine: "lilas-heros-fen", teintes: ["#FFC27A", "#FFB36B", "#E8A060"] });
    [fen.map, fen.lumiere].forEach(function (tx) {
      var cv = tx.image, cx2 = cv.getContext("2d"), fw = cv.width / 5, fh = cv.height / 4;
      cx2.fillStyle = "#000"; cx2.fillRect(2 * fw + 1, 1 * fh, fw - 2, fh);
      tx.needsUpdate = true;
    });
    var mF = K.garder(new THREE.MeshStandardMaterial({ map: fen.map, emissive: new THREE.Color("#ffffff"), emissiveMap: fen.lumiere, emissiveIntensity: 0.55, roughness: 0.25, metalness: 0.1, transparent: true }));
    mF.onBeforeCompile = function (sh) { sh.fragmentShader = sh.fragmentShader.replace("#include <map_fragment>", "#include <map_fragment>\n if (diffuseColor.r + diffuseColor.g + diffuseColor.b < 0.02) discard;"); };
    var pf = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(9.8, 4 * 3.1)), mF); pf.rotation.y = PI / 2; pf.position.set(XG + 0.02, 3.6 + 2 * 3.1, 0); s.add(pf);
    P.boite(s, 0.4, 0.35, W + 0.3, mPierre, XG + 0.05, H, 0);
    P.boite(s, 0.2, 0.18, W + 0.1, mPierre, XG + 0.04, 3.6, 0);
    // le rez-de-chaussée : la porte de l'immeuble, des volets fermés
    var mPorte = K.mat.bois({ couleur: "#2e2016", lames: 4, graine: "porte-lilas" });
    P.boite(s, 0.1, 2.5, 1.3, mPorte, XG + 0.03, 1.25, 2.6);
    var mVolet = K.mat.bois({ couleur: "#3b4a40", lames: 7, graine: "volets-lilas" });
    [-3.2, -1.2].forEach(function (z) { P.boite(s, 0.08, 1.7, 1.3, mVolet, XG + 0.03, 1.6, z); });

    // ── la fenêtre : le dormant, les deux battants, les petits bois, la vitre, les gouttes
    var mCadre = K.garder(new THREE.MeshStandardMaterial({ color: "#cfc6ad", roughness: 0.6 }));
    var xc = XVITRE, hF = FEN.y1 - FEN.y0, yc = (FEN.y0 + FEN.y1) / 2;
    P.boite(s, 0.07, 0.07, FEN.d * 2, mCadre, xc, FEN.y1 - 0.035, 0); P.boite(s, 0.07, 0.09, FEN.d * 2, mCadre, xc, FEN.y0 + 0.045, 0);
    P.boite(s, 0.07, hF, 0.07, mCadre, xc, yc, -FEN.d + 0.035); P.boite(s, 0.07, hF, 0.07, mCadre, xc, yc, FEN.d - 0.035);
    P.boite(s, 0.06, hF, 0.06, mCadre, xc, yc, 0);
    P.boite(s, 0.04, 0.03, FEN.d * 2, mCadre, xc, FEN.y0 + 0.08 + 0.64 * (hF - 0.1), 0);
    var mVerre = K.garder(new THREE.MeshPhysicalMaterial({ color: "#10141a", roughness: 0.06, metalness: 0, transparent: true, opacity: 0.22, envMapIntensity: 1.6, depthWrite: false, side: THREE.DoubleSide }));
    var verre = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(FEN.d * 2 - 0.08, hF - 0.1)), mVerre); verre.rotation.y = PI / 2; verre.position.set(xc - 0.005, yc, 0); verre.renderOrder = 3; s.add(verre);
    var gv = gouttesVitre(K);
    var mGouttes = K.garder(new THREE.MeshBasicMaterial({ map: gv.texture, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, color: new THREE.Color("#ffb878").multiplyScalar(0.35), side: THREE.DoubleSide }));
    var gouttes = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(FEN.d * 2 - 0.08, hF - 0.1)), mGouttes); gouttes.rotation.y = PI / 2; gouttes.position.set(xc + 0.004, yc, 0); gouttes.renderOrder = 4; s.add(gouttes);
    // le reflet de la pièce dans la vitre, tant que la lampe brûle : vu de dedans, la vitre est un miroir
    var rc = K.tex.canvas(128, 192), rx = rc.getContext("2d"), rg = rx.createRadialGradient(100, 120, 4, 100, 120, 110);
    rg.addColorStop(0, "rgba(255,214,150,1)"); rg.addColorStop(0.12, "rgba(255,190,120,0.55)"); rg.addColorStop(0.6, "rgba(120,80,40,0.25)"); rg.addColorStop(1, "rgba(60,40,20,0.12)");
    rx.fillStyle = rg; rx.fillRect(0, 0, 128, 192);
    var mReflet = K.garder(new THREE.MeshBasicMaterial({ map: K.tex.texture(rc, { clamp: true }), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, color: new THREE.Color(1, 1, 1).multiplyScalar(0.5), side: THREE.BackSide }));
    var refletVitre = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(FEN.d * 2 - 0.08, hF - 0.1)), mReflet); refletVitre.rotation.y = PI / 2; refletVitre.position.set(xc - 0.012, yc, 0); refletVitre.renderOrder = 5; s.add(refletVitre);
    // vue de la rue, ta fenêtre allumée : la lueur de la lampe derrière le voilage (une face tournée
    // vers la rue : de dedans, on ne la voit pas)
    var lc = K.tex.canvas(128, 192), lx = lc.getContext("2d"), lgr = lx.createRadialGradient(40, 128, 6, 56, 110, 130);
    lgr.addColorStop(0, "rgba(255,228,176,1)"); lgr.addColorStop(0.28, "rgba(255,186,108,0.9)"); lgr.addColorStop(1, "rgba(120,70,34,0.7)");
    lx.fillStyle = lgr; lx.fillRect(0, 0, 128, 192);
    lx.strokeStyle = "rgba(255,240,220,0.18)"; for (var lp = 0; lp < 128; lp += 6) { lx.beginPath(); lx.moveTo(lp, 0); lx.lineTo(lp, 192); lx.stroke(); }
    var mLueur = K.garder(new THREE.MeshBasicMaterial({ map: K.tex.texture(lc, { clamp: true }), color: new THREE.Color(1, 1, 1).multiplyScalar(0.9) }));
    var lueur = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(FEN.d * 2 - 0.08, hF - 0.1)), mLueur); lueur.rotation.y = PI / 2; lueur.position.set(xc - 0.03, yc, 0); s.add(lueur);

    // ── la pièce : deux pièces au troisième ; on voit celle de la fenêtre
    var D = 4.4, LARG = 4.0;
    tex.papierPeint.repeat.set(2.2, 2.2);
    var mPapier = K.garder(new THREE.MeshStandardMaterial({ map: tex.papierPeint, roughness: 0.92 }));
    var piece = P.piece({ largeur: LARG, profondeur: D, hauteur: HAUT, murs: mPapier, sol: K.mat.bois({ couleur: "#4a3020", lames: 7, graine: "parquet-lilas", repete: [3, 3] }),
      plafond: K.mat.beton({ couleur: "#a49c8a", graine: "plafond-lilas", banches: 0, taches: 0.5 }), fenetre: { mur: "fond", x: 0, y: (FEN.y0 + FEN.y1) / 2 - SOL3, w: FEN.d * 2, h: hF } });
    piece.rotation.y = -PI / 2; piece.position.set(XG - EP - D / 2, SOL3, 0); s.add(piece);
    // la table contre le mur, à droite de la fenêtre (vue de dedans), la toile cirée qui brille
    var mBois = K.mat.bois({ couleur: "#5a3a22", lames: 3, graine: "table-lilas" });
    var tz = 1.22, tx0 = XG - EP - 0.5, ty = SOL3 + 0.74;
    [[-0.4, -0.55], [0.4, -0.55], [-0.4, 0.55], [0.4, 0.55]].forEach(function (p) { P.cylindre(s, 0.025, 0.025, 0.72, mBois, tx0 + p[0], SOL3 + 0.36, tz + p[1], { cotes: 8 }); });
    var mToile = K.garder(new THREE.MeshStandardMaterial({ map: tex.toile, roughness: 0.42, metalness: 0, envMapIntensity: 1.2 }));
    P.boite(s, 0.95, 0.03, 1.25, mToile, tx0, ty, tz);
    P.boite(s, 0.95, 0.14, 0.004, mToile, tx0, ty - 0.08, tz - 0.627); P.boite(s, 0.004, 0.14, 1.25, mToile, tx0 - 0.477, ty - 0.08, tz);
    var mChaise = K.mat.bois({ couleur: "#3c2616", lames: 2, graine: "chaise-lilas" });
    P.boite(s, 0.42, 0.04, 0.42, mChaise, tx0 - 0.85, SOL3 + 0.46, tz + 0.1); P.boite(s, 0.04, 0.5, 0.42, mChaise, tx0 - 1.05, SOL3 + 0.72, tz + 0.1);
    // le radio-réveil : ses chiffres rouges ; une petite lueur rouge sur la toile cirée
    var rv = reveil(K);
    var mPlast = K.garder(new THREE.MeshStandardMaterial({ color: "#2a1d16", roughness: 0.4 }));
    var reveilG = new THREE.Group(); reveilG.position.set(tx0 - 0.2, ty + 0.015, tz + 0.03); reveilG.rotation.y = -0.93; s.add(reveilG);
    P.boite(reveilG, 0.2, 0.075, 0.1, mPlast, 0, 0.0375, 0);
    var face = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.17, 0.06)), K.garder(new THREE.MeshBasicMaterial({ map: rv.texture, toneMapped: false, color: new THREE.Color(1, 1, 1).multiplyScalar(1.6) })));
    face.position.set(0, 0.04, 0.0505); reveilG.add(face);
    var lueurRouge = K.look.ponctuelle({ couleur: ROUGE, intensite: 0.05, portee: 1.0 }); lueurRouge.position.set(0, 0.05, 0.1); reveilG.add(lueurRouge);
    // une tasse, L'Écho plié
    var mTasse = K.garder(new THREE.MeshStandardMaterial({ color: "#e4ddd0", roughness: 0.3 }));
    P.cylindre(s, 0.04, 0.035, 0.08, mTasse, tx0 + 0.18, ty + 0.055, tz + 0.42, { cotes: 14 });
    var echo = K.tex.texte({ lignes: ["L'ÉCHO", "D'AUBÉRIVE"], fond: "#e3dccb", encre: "#1c1a18", largeur: 256, hauteur: 128, graine: "echo-lilas" });
    var journal = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.3, 0.2)), K.garder(new THREE.MeshStandardMaterial({ map: echo.map, roughness: 0.9 })));
    journal.rotation.x = -PI / 2; journal.rotation.z = 0.5; journal.position.set(tx0 + 0.05, ty + 0.018, tz + 0.3); s.add(journal);
    // la lampe sur la table, contre la fenêtre : un pied, un abat-jour de tissu, l'ampoule
    var lampe = new THREE.Group(); lampe.position.set(tx0 + 0.3, ty + 0.015, tz - 0.42); s.add(lampe);
    var mLaiton = K.mat.metal({ couleur: "#8a6a3a", rugosite: 0.35 });
    P.cylindre(lampe, 0.07, 0.08, 0.025, mLaiton, 0, 0.012, 0, { cotes: 20 });
    P.cylindre(lampe, 0.009, 0.009, 0.3, mLaiton, 0, 0.17, 0, { cotes: 8 });
    var mAbat = K.garder(new THREE.MeshStandardMaterial({ color: "#d9c9a2", roughness: 0.9, side: THREE.DoubleSide, emissive: new THREE.Color("#ffbe72"), emissiveIntensity: 0.32 }));
    P.cylindre(lampe, 0.085, 0.14, 0.17, mAbat, 0, 0.36, 0, { cotes: 24, ouvert: true });
    var mAmp = K.mat.lumiere({ couleur: "#FFE2B0", intensite: 4, toneMapped: false });
    var ampoule = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.028, 12, 10)), mAmp); ampoule.position.y = 0.33; lampe.add(ampoule);
    var lumLampe = K.look.ponctuelle({ couleur: "#FFC98A", intensite: 0.55, portee: 0 }); lumLampe.position.set(0, 0.33, 0); lampe.add(lumLampe);
    var haloLampe = K.look.halo({ couleur: "#FFC98A", taille: 0.42, intensite: 0.35 }); haloLampe.position.set(0, 0.36, 0); lampe.add(haloLampe);
    // l'interrupteur du pied (le bouton que la main tourne), du côté de la pièce
    var DIRI = [-0.59, 0, 0.8];
    var bouton = P.cylindre(lampe, 0.012, 0.012, 0.028, mPlast, DIRI[0] * 0.085, 0.03, DIRI[2] * 0.085, { cotes: 10 });
    bouton.rotation.order = "YXZ"; bouton.rotation.set(PI / 2, Math.atan2(DIRI[0], DIRI[2]), 0);
    // le voilage, sur la moitié gauche de la fenêtre (vue de dedans) : des plis, une lueur quand la lampe brûle
    var gVoile = new THREE.PlaneGeometry(0.72, hF + 0.25, 24, 1), pv = gVoile.attributes.position;
    for (var i = 0; i < pv.count; i++) pv.setZ(i, Math.sin(pv.getX(i) * 38) * 0.018 + Math.sin(pv.getX(i) * 11) * 0.01);
    gVoile.computeVertexNormals(); K.garder(gVoile);
    var mVoile = K.garder(new THREE.MeshStandardMaterial({ map: tex.voilage, transparent: true, side: THREE.DoubleSide, roughness: 0.95, depthWrite: false, emissive: new THREE.Color("#ffc68a"), emissiveMap: tex.voilage, emissiveIntensity: 0.25 }));
    var voile = new THREE.Mesh(gVoile, mVoile); voile.rotation.y = -PI / 2; voile.position.set(XG - EP - 0.07, yc + 0.05, -0.26); voile.renderOrder = 6; s.add(voile);
    // la lumière de la rue qui entre : un faisceau orange vers le plafond, près de la fenêtre
    var entree = K.look.projecteur({ couleur: "#FF9A3D", intensite: 3.2, angle: 0.75, penombre: 0.9, decroissance: 2, ombre: false });
    entree.position.set(XG - EP + 0.05, FEN.y0 + 0.2, 0); s.add(entree);
    var ce = new THREE.Object3D(); ce.position.set(XG - EP - 2.2, SOL3 + HAUT, 0.1); s.add(ce); entree.target = ce;
    // la lumière qui rebondit dans la pièce (les murs, le plafond) tant que la lampe brûle
    var rebond = K.look.ponctuelle({ couleur: "#FFB070", intensite: 3.4, portee: 0 }); rebond.position.set(-7.1, SOL3 + 2.15, -0.4); s.add(rebond);
    // la main (celle de Camille) : un avant-bras dans une manche de laine, la main, les doigts
    var main = new THREE.Group(); s.add(main);
    var mManche = K.garder(new THREE.MeshStandardMaterial({ color: "#3a3440", roughness: 0.95 }));
    var mPeau = K.garder(new THREE.MeshStandardMaterial({ color: "#a07a62", roughness: 0.7 }));
    var bras = new THREE.Mesh(K.garder(new THREE.CapsuleGeometry(0.042, 0.3, 4, 10)), mManche); bras.rotation.z = PI / 2; bras.position.set(0.23, 0, 0); main.add(bras);
    var paume = new THREE.Mesh(K.garder(new THREE.BoxGeometry(0.085, 0.022, 0.075)), mPeau); paume.position.set(0.0, 0, 0); main.add(paume);
    [-0.027, -0.009, 0.009, 0.027].forEach(function (z, k) {
      var dg = new THREE.Mesh(K.garder(new THREE.CapsuleGeometry(0.0085, 0.05 + (k === 1 || k === 2 ? 0.01 : 0), 3, 6)), mPeau);
      dg.rotation.z = PI / 2 - 0.35; dg.position.set(-0.07, -0.012, z); main.add(dg);
    });
    var pouce = new THREE.Mesh(K.garder(new THREE.CapsuleGeometry(0.009, 0.04, 3, 6)), mPeau); pouce.rotation.set(0.6, 0, PI / 2 - 0.2); pouce.position.set(-0.03, 0.0, 0.048); main.add(pouce);
    main.traverse(function (o) { if (o.isMesh) o.castShadow = false; });

    // ── le réverbère au-dessus de lui, deux autres plus loin (le sodium)
    var lamps = [[4.25, -1.4, 160, true], [-4.25, -16, 120, false], [4.25, -30, 110, false], [-4.25, -42, 100, false]].map(function (p, i) {
      var r = P.reverbere({ hauteur: 6.2, bras: 1.4, intensite: p[2], ombre: p[3], gresille: i === 2 ? 1 : 0.15, forceCone: 0.045, halo: 1.7 });
      r.position.set(p[0], 0.15, p[1]); r.rotation.y = p[0] > 0 ? PI : 0; s.add(r);
      return r;
    });
    // ── le sodium que la chaussée mouillée renvoie sur ta façade : la brique sort du noir
    var renvoi = K.look.projecteur({ couleur: "#E08A48", intensite: 120, angle: 0.55, penombre: 1, decroissance: 2, ombre: false });
    renvoi.position.set(1.5, 0.4, 1.0); s.add(renvoi);
    var cr = new THREE.Object3D(); cr.position.set(XG, 9.5, 0); s.add(cr); renvoi.target = cr;
    // ── au premier étage d'en face, derrière lui, une fenêtre encore allumée : sa lumière tombe
    // sur son dos et sur le trottoir (elle le détache du fond)
    var mFenFace = K.mat.lumiere({ couleur: "#FFB46A", intensite: 1.1 });
    var fenFace = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(1.05, 1.45)), mFenFace); fenFace.rotation.y = -PI / 2; fenFace.position.set(XD - 0.03, 5.15, 1.15); s.add(fenFace);
    var dos = K.look.projecteur({ couleur: "#FFB46A", intensite: 22, angle: 0.45, penombre: 0.8, decroissance: 2, ombre: false });
    dos.position.set(XD - 0.3, 5.0, 1.1); s.add(dos);
    var cd = new THREE.Object3D(); cd.position.set(HOMME[0], 1.0, HOMME[2]); s.add(cd); dos.target = cd;
    // ── les deux voitures entre lesquelles il se tient, une autre plus loin
    var voitures = [[2.6, -3.3, "#2c3440", "4127 RK 12"], [2.6, 3.15, "#3a2a26", "7710 LP 12"], [-2.6, -12, "#2b2d30", "2290 TB 12"], [2.6, 14, "#33302a", "5814 AV 12"]];
    voitures.forEach(function (v) { var a = P.voiture({ couleur: v[2], phares: 0, feux: 0, plaque: v[3] }); a.position.set(v[0], 0, v[1]); a.rotation.y = -PI / 2; s.add(a); });
    // la voiture qui passe : ses phares, ses feux, deux faisceaux
    // elle descend la rue vers -z, sur la file de son côté à lui (on roule à droite) : vue de ta
    // fenêtre, elle passe entre toi et lui, et ses phares le prennent avant qu'elle le dépasse
    var passe = P.voiture({ couleur: "#4a4c50", phares: 1, feux: 0.8, plaque: "9033 RV 12" }); passe.rotation.y = PI / 2; s.add(passe);
    var phares = [-0.55, 0.55].map(function (dz) {
      var l = K.look.projecteur({ couleur: "#FFF1D6", intensite: 0, angle: 0.42, penombre: 0.55, decroissance: 2, ombre: false });
      l.position.set(2.25, 0.62, dz); passe.add(l);
      // les phares visent un peu à droite (le trottoir) : c'est là qu'il se tient
      var c = new THREE.Object3D(); c.position.set(16, -0.3, dz * 3 + 3); passe.add(c); l.target = c;
      var h = K.look.halo({ couleur: "#FFF1D6", taille: 0.9, intensite: 0 }); h.position.set(2.25, 0.6, dz); passe.add(h);
      return { l: l, h: h };
    });

    // ── l'homme : un manteau sombre mouillé, ton visage en carton, les mains jointes dans le dos
    var homme = K.gens.mannequin({ tenue: "manteau", couleur: "#1d1c1f", couleur2: "#151417", peau: "#3a2c26", taille: 1.8, graine: "homme-lilas" });
    homme.groupe.position.set(HOMME[0], HOMME[1], HOMME[2]); homme.groupe.rotation.y = -PI / 2; s.add(homme.groupe);
    homme.groupe.traverse(function (o) { if (o.isMesh && o.material && o.material.roughness > 0.8) o.material.roughness = 0.72; });
    // un manteau d'homme, pas un mannequin d'atelier : les épaules moins rondes, un col relevé
    [homme.os.epauleG, homme.os.epauleD].forEach(function (ep) { if (ep.children[0] && ep.children[0].isMesh) ep.children[0].scale.set(0.82, 0.7, 0.82); });

    var masque = P.masque({ texture: tex.masque, largeur: 0.25, courbure: 0.62, carton: "#a8987a" });
    masque.avant.material.roughnessMap = tex.mouille; masque.avant.material.roughness = 1;
    masque.position.set(0, 0.1 * homme.taille, 0.108); homme.os.tete.add(masque);
    var mElast = K.garder(new THREE.MeshStandardMaterial({ color: "#0c0c0c", roughness: 0.5 }));
    var elastique = new THREE.Mesh(K.garder(new THREE.TorusGeometry(0.119, 0.0042, 4, 32)), mElast); elastique.rotation.x = PI / 2 + 0.12; elastique.position.set(0, 0.1 * homme.taille, -0.004); homme.os.tete.add(elastique);
    // des gouttes qui descendent sur le carton (sa place se calcule de t : pas d'état)
    var mGoutte = K.garder(new THREE.MeshStandardMaterial({ color: "#d8dde4", roughness: 0.03, metalness: 0, envMapIntensity: 2.5, emissive: new THREE.Color("#ffe2b8"), emissiveIntensity: 0.55 }));
    var gGoutte = K.garder(new THREE.SphereGeometry(0.0021, 8, 6));
    var gouttesMasque = [];
    for (var gm = 0; gm < 7; gm++) { var gg = new THREE.Mesh(gGoutte, mGoutte); gg.scale.set(1, 1.5, 0.6); masque.add(gg); gouttesMasque.push(gg); }
    function poseHomme(t) {
      var M = homme, o = M.os;
      M.repos(t * 0.35);
      o.tete.rotation.set(-0.3, 0, 0);
      o.buste.rotation.x = -0.04 + Math.sin(t * 1.1) * 0.006;
      o.cou.rotation.x = -0.12;
      o.epauleG.rotation.set(0.5, 0, -0.1); o.epauleD.rotation.set(0.5, 0, 0.1);
      o.coudeG.rotation.set(0, 0, 1.62); o.coudeD.rotation.set(0, 0, -1.62);
      o.mainG.rotation.set(0, 0, 0.45); o.mainD.rotation.set(0, 0, -0.45);
      if (o.pan) o.pan.rotation.z = Math.sin(t * 0.9) * 0.012;
      var w = 0.25, c = 0.62;
      gouttesMasque.forEach(function (g, i) {
        var per = 2.4 + K.h01(i, 41) * 2.2, ph = ((t + K.h01(i, 43) * per) / per) % 1;
        var gx = (K.h01(i, 47) - 0.5) * 0.17 + Math.sin(ph * 9 + i) * 0.004, gy = 0.1 - ph * 0.21;
        g.position.set(gx, gy, -c * Math.pow(gx / (w / 2), 2) * w * 0.25 + 0.004);
        g.visible = ph < 0.92;
      });
    }
    poseHomme(0);
    s.updateMatrixWorld(true);
    var pm = new THREE.Vector3(); masque.getWorldPosition(pm);

    // ── la pluie (la bruine), les ronds, les reflets
    s.updateMatrixWorld(true);
    var lumPluie = [
      { pos: lamps[0].positionLampe(), couleur: "#FF9A3D", intensite: 1.5, rayon: 7.5 },
      { pos: lamps[1].positionLampe(), couleur: "#FF9A3D", intensite: 1.1, rayon: 7 },
      { pos: [XG + 0.2, (FEN.y0 + FEN.y1) / 2, 0], couleur: "#FFC27A", intensite: 0.6, rayon: 3 },
      { pos: [0, 0.8, -20], couleur: "#FFF1D6", intensite: 0, rayon: 9 }
    ];
    var pluie = K.particules.pluie({ n: 6000, zone: { min: [-9, -0.2, -12], max: [9, 9, 12] }, suivre: true, avance: 7, vitesse: [0.5, -7.5, 0.2], longueur: 0.28, largeur: 0.0075, couleur: "#7f8fae", opacite: 0.55, lumieres: lumPluie });
    s.add(pluie);
    // la bruine devant la fenêtre, vue de dedans (la pluie de la rue suit la caméra : dans la pièce, elle se tait)
    var pluieFen = K.particules.pluie({ n: 1400, zone: { min: [XG + 0.1, FEN.y0 - 2, -2.2], max: [XG + 3.5, FEN.y1 + 1.5, 2.2] }, vitesse: [0.4, -7.5, 0.1], longueur: 0.3, largeur: 0.007, couleur: "#8a96b0", opacite: 0.6,
      lumieres: [{ pos: [XG + 0.6, FEN.y0, 0], couleur: "#FFC27A", intensite: 0.5, rayon: 2.5 }, { pos: lamps[0].positionLampe(), couleur: "#FF9A3D", intensite: 0.9, rayon: 9 }] });
    s.add(pluieFen);
    var ronds = K.particules.ronds({ n: 500, zone: { min: [-3.4, 0.0, -14], max: [3.4, 0, 10] }, periode: 0.6, rayon: 0.055, couleur: "#9aa6c0", opacite: 0.32, lumieres: lumPluie });
    s.add(ronds);
    var reflets = [
      K.look.reflet({ pos: lamps[0].positionLampe(), couleur: "#FF9A3D", intensite: 1.2, largeur: 0.9, longueur: 7 }),
      K.look.reflet({ pos: lamps[1].positionLampe(), couleur: "#FF9A3D", intensite: 0.9, largeur: 0.8, longueur: 7 }),
      K.look.reflet({ pos: lamps[2].positionLampe(), couleur: "#FF9A3D", intensite: 0.7, largeur: 0.7, longueur: 6 }),
      K.look.reflet({ pos: [XG + 0.5, 11, 0], sol: 0, couleur: "#FFC27A", intensite: 0.35, largeur: 0.6, longueur: 5 })
    ];
    reflets.forEach(function (r) { s.add(r); });
    var refletPhares = K.look.reflet({ pos: [0, 0.6, 0], couleur: "#FFF1D6", intensite: 0, largeur: 1.4, longueur: 9 }); s.add(refletPhares);
    var vP = new THREE.Vector3(), uPos = pluie.materiau.uniforms.uLumPos.value, uCoul = pluie.materiau.uniforms.uLumCoul.value;

    return {
      scene: s, homme: homme, masque: masque, lampe: lampe, main: main, masqueMonde: [pm.x, pm.y, pm.z],
      look: { bloom: 0.8, rayon: 0.6, seuil: 0.85, exposition: 1.12, contraste: 1.16, saturation: 0.92 },
      maj: function (t, c) {
        // dans la pièce, loin de la vitre, la pluie de la rue (qui suit la caméra) tomberait dans la
        // pièce : on garde celle de la fenêtre ; contre la vitre, les deux
        var cam = c.camera, haut = cam.position.y > SOL3, profond = haut && cam.position.x < XG - EP - 0.8;
        pluie.visible = !profond; pluieFen.visible = haut;
        pluie.maj(t, cam); pluieFen.maj(t); ronds.maj(t);
        gv.maj(t); rv.maj(t);
        lamps.forEach(function (l) { l.maj(t); });
        reflets.forEach(function (r, i) { r.maj(cam, i === 2 ? 1 - 0.1 * Math.max(0, K.bruit1(t * 9, 7)) : i === 3 ? (t < T_LAMPE ? 1 : 0) : 1); });
        // la lampe : allumée jusqu'au clic
        var k = t < T_LAMPE ? 1 : 0;
        lumLampe.intensity = 0.55 * k; haloLampe.intensite(0.35 * k); rebond.intensity = 3.4 * k;
        mAbat.emissiveIntensity = 0.32 * k + 0.01; mAmp.color.set("#FFE2B0").multiplyScalar(2.5 * k + 0.03);
        mVoile.emissiveIntensity = 0.25 * k + 0.015;
        mReflet.opacity = k; refletVitre.visible = k > 0;
        mLueur.color.setScalar(0.9 * k + 0.015);
        mGouttes.color.set("#ffb878").multiplyScalar(0.22 + 0.16 * k);
        uCoul[2].set("#FFC27A").multiplyScalar(0.6 * k);
        // la voiture qui passe (de 25,3 à 30,8 s), à 8 m/s vers -z : devant lui à 28,6 s ; ses phares
        // sur la rue mouillée
        var zv = 24 - (t - 25.6) * 8, on = K.cloche(25.3, 25.7, 30.4, 30.8, t);
        passe.position.set(0.75, 0, zv); passe.visible = on > 0;
        phares.forEach(function (p) { p.l.intensity = 520 * on; p.h.intensite(1.4 * on); });
        refletPhares.position.set(0.75, 0.012, zv - 2.4); refletPhares.maj(cam, 1.1 * on);
        uPos[3].set(0.75, 0.8, zv - 5); uCoul[3].set("#FFF1D6").multiplyScalar(1.2 * on);
        poseHomme(t);
        // la main de Camille : elle entre par la droite, tourne le bouton, repart
        // elle vient de la pièce (du bas du cadre, du côté de la caméra) jusqu'au bouton du pied
        var mk = K.cloche(21.2, 22.35, 23.1, 24.1, t), recul = (1 - mk) * 0.55;
        main.visible = mk > 0.001;
        vP.set(lampe.position.x + DIRI[0] * 0.17, lampe.position.y + 0.05, lampe.position.z + DIRI[2] * 0.17);
        main.position.set(vP.x + DIRI[0] * recul, vP.y - recul * 0.35 - 0.022 * K.cloche(22.4, 22.65, 22.8, 23.1, t), vP.z + DIRI[2] * recul);
        main.rotation.set(0, Math.atan2(-DIRI[2], DIRI[0]), -0.12);
      }
    };
  }

  FC.film({
    id: "sous_la_fenetre",
    livre: "promu",
    titre: "L'homme sous la fenêtre",
    duree: 35.6,
    musique: "livre_h1",
    musiqueFilm: "film_sous_la_fenetre",
    secours: "suspense",
    couleur: ROUGE,
    affiche: 34.0,
    habillage: { vignette: 0.58, grain: 0.075, ratioPaysage: 2.35, ratioPortrait: 0 },
    sortie: { noir: 1.4 },
    // le clic de l'interrupteur de la lampe
    sons: [[22.7, "reaction"]],
    textes: [
      { sorte: "lieu", de: 1.0, a: 5.2, texte: "Aubérive, rue des Lilas", sous: "Mardi · minuit" },
      { sorte: "replique", de: 12.4, a: 17.4, qui: "Camille", texte: "Il se tient comme toi sur le banc. Les mains dans le dos." },
      { sorte: "titre", de: 31.6, a: 35.2, texte: "Aubérive · 1991", sous: "Trois mille visages", entree: 0.2, sortie: 0.7 }
    ],
    montages: { court: [[0.3, 5.0], [6.0, 9.4], [10.6, 15.0], [15.8, 20.6], [21.6, 25.0], [25.8, 30.4], [31.2, 35.4]] },
    preparer: function (K, ctx) {
      var heros = ctx.heros;
      return K.tex.visage({ heros: heros, taille: 1024, trame: 6 }).then(function (v) {
        // le carton mouillé : des coulures plus sombres, et là où l'eau a glissé, ça brille
        var src = v.canvas, Wm = src.width, c = K.tex.canvas(Wm, Wm), x = c.getContext("2d");
        x.drawImage(src, 0, 0);
        x.globalCompositeOperation = "source-atop";
        for (var i = 0; i < 26; i++) {
          var cx = K.h01(i, 61) * Wm, l = Wm * (0.15 + K.h01(i, 63) * 0.5), y0 = K.h01(i, 65) * Wm * 0.6;
          var gr = x.createLinearGradient(0, y0, 0, y0 + l); gr.addColorStop(0, "rgba(60,40,20,0)"); gr.addColorStop(0.3, "rgba(60,40,20,0.22)"); gr.addColorStop(1, "rgba(60,40,20,0.05)");
          x.fillStyle = gr; x.fillRect(cx - Wm * 0.01, y0, Wm * (0.012 + K.h01(i, 67) * 0.02), l);
        }
        x.globalCompositeOperation = "source-over";
        var r = K.tex.canvas(Wm, Wm), rxx = r.getContext("2d");
        rxx.fillStyle = "#c8c8c8"; rxx.fillRect(0, 0, Wm, Wm);
        for (var j = 0; j < 30; j++) {
          var rx0 = K.h01(j, 71) * Wm, rl = Wm * (0.2 + K.h01(j, 73) * 0.6), ry0 = K.h01(j, 75) * Wm * 0.5;
          rxx.fillStyle = "rgba(20,20,20,0.75)"; rxx.fillRect(rx0, ry0, Wm * 0.008 + K.h01(j, 77) * Wm * 0.012, rl);
        }
        var tex = { masque: K.tex.texture(c, { clamp: true }), mouille: K.tex.texture(r, { clamp: true, donnee: true }),
          papierPeint: papierPeint(K), toile: toileCiree(K), voilage: voilage(K) };
        return K.etapes(ctx, [function () { ctx.decors.lilas = lilas(K, ctx, tex); }]);
      });
    },
    plans: [
      // 1 · ta fenêtre allumée au troisième, dans la bruine ; la grue descend le long de la rue
      // jusqu'au réverbère d'en face : sous lui, entre deux voitures, un homme
      { de: 0, a: 5.6, decor: "lilas", entree: "noir", transition: 1.4, fixe: 4.6,
        camera: { pos: K_cles([[0, [1.2, 11.6, 6.5]], [2.6, [2.3, 9.8, 6.4]], [5.6, [3.9, 6.6, 7.5]]], "douce"), cible: K_cles([[0, [-5.7, 11.35, 0]], [1.4, [-5.4, 11.1, 0]], [5.6, [2.6, 1.2, -0.3]]], "douce"), fov: 50, epaule: 0.1 } },
      // 2 · dedans, tout près : le radio-réveil passe de 23:59 à 00:00 ; derrière, la lampe et la vitre
      { de: 5.6, a: 10.2, decor: "lilas", entree: "fondu", transition: 1.0, fixe: 3.0,
        camera: { pos: K_cles([[0, [-7.2, SOL3 + 0.95, 1.66]], [4.6, [-7.12, SOL3 + 0.93, 1.6]]], "douce"), cible: [-6.62, SOL3 + 0.74, 1.08], fov: 47, epaule: 0.1 },
        // sur un téléphone étroit (393 × 851), les quatre chiffres tiennent dans la largeur
        cadrage: { portrait: { x: 0.13 } },
        look: { exposition: 0.92 } },
      // 3 · derrière lui, d'un peu haut : ses mains jointes dans le dos, puis la façade jusqu'à ta fenêtre
      { de: 10.2, a: 15.6, decor: "lilas", entree: "coupe", fixe: 1.4,
        camera: { pos: K_cles([[0, [5.15, 2.3, 1.15]], [5.4, [5.25, 2.5, 1.2]]], "douce"), cible: K_cles([[0, [3.1, 1.36, -0.05]], [1.6, [3.1, 1.38, -0.05]], [5.4, [XG, FEN.y0 + 0.7, 0]]], "douce"), fov: 42, epaule: 0.14 } },
      // 4 · son visage : le tien, imprimé, mouillé ; la tête et les épaules, la pluie dessus
      { de: 15.6, a: 21.0, decor: "lilas", entree: "coupe", fixe: 3.4,
        camera: { pos: K_cles([[0, [1.66, 1.68, 0.22]], [5.4, [1.82, 1.7, 0.14]]], "lin"), cible: function (l, p, c) { return c.decors.lilas.masqueMonde; }, fov: 30, epaule: 0.12 } },
      // 5 · la lampe, le réveil, la vitre : une main tourne le bouton ; il ne reste que les chiffres rouges
      { de: 21.0, a: 24.2, decor: "lilas", entree: "coupe", fixe: 1.2,
        camera: { pos: K_cles([[0, [-7.6, SOL3 + 1.22, 1.95]], [4.6, [-7.5, SOL3 + 1.2, 1.88]]], "lin"), cible: [-6.3, SOL3 + 0.98, 0.5], fov: 46, epaule: 0.1 },
        // en portrait, le cadre glisse vers le réveil (en bas à droite) : les chiffres rouges restent
        cadrage: { portrait: { x: 0.3 } },
        look: { exposition: 0.95 } },
      // 6 · de la fenêtre, à travers le carreau du bas : l'homme en bas ; une voiture passe, ses phares le balaient
      { de: 24.2, a: 30.8, decor: "lilas", entree: "coupe", fixe: 4.6,
        camera: { pos: K_cles([[0, [-6.28, FEN.y0 + 0.97, 0.3]], [6.6, [-6.24, FEN.y0 + 0.98, 0.28]]], "lin"), cible: [HOMME[0], 0.95, HOMME[2]], fov: 30, epaule: 0.08 } },
      // 7 · le regard se resserre sur le masque, qui te regarde (le titre se pose sur son manteau)
      { de: 30.8, a: 35.6, decor: "lilas", entree: "coupe", fixe: 3.2,
        camera: { pos: [-6.24, FEN.y0 + 0.98, 0.28], cible: function (l, p, c) { var m = c.decors.lilas.masqueMonde; return [m[0], m[1] - 0.27, m[2]]; }, fov: K_cles([[0, 14], [4.8, 11]], "douce"), epaule: 0.05 } }
    ]
  });

  // les aides de la trousse, lues quand le film tourne (la trousse est chargée avant le film)
  function K_() { return FC.kit; }
  function K_cles(p, a) { var f = null; return function (t) { if (!f) f = K_().cles(p, a); return f(t); }; }
})(typeof window !== "undefined" ? window : this);
