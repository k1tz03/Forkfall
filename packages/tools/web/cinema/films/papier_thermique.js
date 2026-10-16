/* ═══════════════════════════════════════════════════════════════════════════
   « Papier thermique » — livre 6, « 23 h 58 » (2003, la directrice sportive qui
   doit vendre trente millions ; la couleur du livre : #B49BFF). Le premier film
   du livre.

   QUAND : avant la carte de la photo (ds.h6.sc.photo, ou sa variante de la page
   jetée), la première ancre du livre : « La nuit suivante, à 23 h 58, le fax
   imprime une photo granuleuse ». Le prologue a fini sur la première page (un nom, un
   prix, un délai) ; le film est la nuit d'après, en temps réel, de 23 h 57 min 47 s
   à 23 h 58 min 19 s : le club-house éteint, le bureau, l'horloge dont l'aiguille
   saute, le fax qui sonne et sort son papier. On voit l'en-tête (l'heure, la page,
   aucun numéro), puis le haut d'une photo granuleuse : un rideau, une lampe, deux
   têtes à contre-jour. Le film coupe avant les visages, l'enveloppe et le mot du
   bas : c'est la carte qui les dit. Ni le stagiaire, ni le sous-sol ; seulement,
   au parking, une petite voiture grise garée en marche arrière, prête à partir
   (la ville s'en souviendra en janvier).

   LA LISTE DES PLANS (32,4 s ; image maîtresse carrée, fenêtres 16:9 → 2,35:1 et 9:16)
    1  0,0–5,4   dehors · le parking du club-house, une nuit d'août : la façade de
                 brique, le couloir allumé, le bureau noir à l'étage ; deux voitures,
                 dont une petite grise en marche arrière ; un réverbère, des papillons.
                 [lieu : AUBÉRIVE, CLUB-HOUSE DU RACING / AOÛT 2003 · 23 H 57]
    2  5,4–10,4  bureau · dans le noir : la lune par les stores, le carnet sur le
                 bureau, le tableau des ventes (« 30 M »), le couloir sous la porte ;
                 lente approche du fax qui veille (son voyant vert, « 23:57 »).
    3  10,4–14,6 bureau · l'horloge : la trotteuse monte, l'aiguille saute sur 58.
    4  14,6–19,6 bureau · le fax : la ligne sonne deux fois, l'écran passe à
                 « RÉCEPTION / DE : ---- », le voyant ambre ; le papier commence.
    5  19,6–26,6 bureau · le papier, de tout près : il sort, tiède, l'en-tête
                 (« 23:58 · P.01 »), puis, ligne après ligne, le haut d'une photo
                 granuleuse — un rideau, une lampe, deux têtes à contre-jour.
    6  26,6–32,4 bureau · le bureau vide, le papier qui pend du fax dans les rayures
                 de la lune. [titre : AUBÉRIVE · 2003 / 23 H 58] Noir.
   LA LUMIÈRE : la lune froide à travers les stores (en tournage, les lames font
   leurs ombres ; sur un téléphone, des rayures peintes), le couloir chaud sous la
   porte, l'écran et les voyants du fax ; dehors, un sodium. LE BRUIT : la sonnerie
   de la ligne (14,8 s). LA MUSIQUE : le thème du livre (livre_h6).
   LA COUPE DE 30 S (l'aperçu de l'App Store) : les six plans, resserrés (montages.court).
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var FC = global.FusibleCinema;
  var PI = Math.PI;
  var VIOLET = "#B49BFF";
  // le temps du film est celui de l'horloge : 23 h 58 min 0 s tombe à T_MINUTE
  var T_MINUTE = 12.8, T_SONNE = 14.8, T_PAPIER = 16.6;
  var V_PAPIER = 0.0125;       // m/s : une photo sort lentement, ligne à ligne (40 % de la page en 10 s)
  var LP = 0.297, LARGP = 0.21; // la page (A4)

  function unique(ctx, cle, fn) { var c = ctx.matieresFilm || (ctx.matieresFilm = {}); return c[cle] || (c[cle] = fn()); }
  // l'heure de l'horloge à t (en secondes depuis 23 h 00)
  function secondes(t) { return 58 * 60 - (T_MINUTE - t); }

  // ─── LA PAGE THERMIQUE : l'en-tête (l'heure, la page, pas de numéro), une photo tramée
  // en points noirs (un rideau à plis, une lampe, deux têtes à contre-jour, le bord d'une
  // table, une main, une enveloppe claire), et un mot en bas. Le film n'en montre que le
  // haut ; le reste est là pour que le papier soit vrai.
  function texPage(K) {
    var W = 512, H = 724, c = K.tex.canvas(W, H), x = c.getContext("2d");
    var fond = [239, 236, 224], encre = [44, 39, 33];
    x.fillStyle = "rgb(" + fond.join(",") + ")"; x.fillRect(0, 0, W, H);
    // la photo, en gris, sur une grille de 2 px ; puis tramée (Bayer 8×8)
    var cw = 2, nx = 232, ny = 300, x0 = 24, y0 = 56;
    var bruit = K.tex.couche(nx, ny, { periode: 9, octaves: 4, graine: "photo-rideau" });
    var bayer = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22,
      3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21];
    function ell(px, py, cx, cy, rx, ry) { var dx = (px - cx) / rx, dy = (py - cy) / ry; return dx * dx + dy * dy; }
    var im = x.getImageData(0, 0, W, H), d = im.data;
    for (var j = 0; j < ny; j++) for (var i = 0; i < nx; i++) {
      var px = i * cw, py = j * cw * 800 / (ny * cw);   // dessinée sur 464 × 800, serrée en hauteur
      // le rideau : des plis verticaux qui ondulent
      var g = 0.3 + 0.2 * Math.sin(px * 0.075 + 0.8 * Math.sin(py * 0.012)) + (bruit[j * nx + i] - 0.5) * 0.18;
      // la lampe, en haut à droite, et son cône
      g += 0.75 * Math.exp(-ell(px, py, 352, 96, 46, 40)) + 0.18 * Math.exp(-ell(px, py, 340, 260, 140, 200));
      // deux têtes et leurs épaules, noires à contre-jour (pas de visages : des ombres)
      if (ell(px, py, 150, 360, 50, 62) < 1 || ell(px, py, 150, 520, 118, 96) < 1) g = 0.07 + 0.05 * Math.exp(-ell(px, py, 190, 330, 18, 40));
      if (ell(px, py, 330, 380, 48, 58) < 1 || ell(px, py, 340, 540, 116, 92) < 1) g = 0.06 + 0.06 * Math.exp(-ell(px, py, 300, 350, 16, 38));
      // la table, la main, l'enveloppe claire
      if (py > 600) g = 0.18 + (bruit[j * nx + i] - 0.5) * 0.1;
      if (py > 588 && py < 608) g = 0.55;
      if (Math.abs(px - 236 - (py - 640) * 0.25) < 58 && py > 612 && py < 676) g = 0.82;
      if (ell(px, py, 190, 650, 36, 26) < 1) g = 0.42;
      g = Math.max(0, Math.min(1, g));
      var noir = g * 64 < bayer[(j % 8) * 8 + (i % 8)];
      if (!noir) continue;
      for (var yy = 0; yy < cw; yy++) for (var xx = 0; xx < cw; xx++) {
        var p = ((y0 + j * cw + yy) * W + (x0 + px + xx)) * 4;
        d[p] = encre[0]; d[p + 1] = encre[1]; d[p + 2] = encre[2];
      }
    }
    x.putImageData(im, 0, 0);
    // les lignes de la tête d'impression (un peu plus pâles), une traînée verticale
    x.fillStyle = "rgba(239,236,224,0.16)";
    for (var l = 0; l < H; l += 7) x.fillRect(0, l, W, 1);
    x.fillStyle = "rgba(239,236,224,0.25)"; x.fillRect(311, 0, 2, H);
    // l'en-tête et le mot du bas
    x.fillStyle = "rgb(" + encre.join(",") + ")"; x.textBaseline = "middle";
    x.font = "700 20px " + K.habillage.MONO; x.textAlign = "left"; x.fillText("23:58", 26, 30);
    x.textAlign = "center"; x.fillText("DE : ----------", 256, 30);
    x.textAlign = "right"; x.fillText("P.01", 486, 30);
    x.font = "700 60px " + K.habillage.MONO; x.textAlign = "center"; x.fillText("VENDREDI", 256, 676);
    return K.tex.texture(c, { clamp: true });
  }

  // ─── LE TÉLÉCOPIEUR DE 2003 : un boîtier de plastique beige, le combiné sur le côté,
  // l'écran à cristaux (deux lignes), les touches, deux voyants (vert : allumé ; ambre :
  // réception) ; à l'avant, la fente, et le papier qui sort, file sur le dessus du
  // classeur, plie au bord et pend. Repère : la fente vers +z, le dessus du meuble en y = 0.
  //  o = { bord: la distance de la fente au bord du meuble (m) }
  //  → Group ; maj(t)
  function telecopieur(K, ctx, o) {
    var THREE = ctx.THREE, P = K.props, g = new THREE.Group();
    var mB = K.garder(new THREE.MeshStandardMaterial({ color: "#cdc5b2", roughness: 0.5 }));
    var mS = K.garder(new THREE.MeshStandardMaterial({ color: "#3b3936", roughness: 0.6 }));
    var mT = K.garder(new THREE.MeshStandardMaterial({ color: "#e4ddcc", roughness: 0.45 }));
    P.boite(g, 0.34, 0.09, 0.3, mB, 0, 0.045, -0.12);
    var pente = P.boite(g, 0.34, 0.04, 0.22, mB, 0, 0.1, -0.15); pente.rotation.x = -0.12;
    P.boite(g, 0.3, 0.02, 0.06, mS, 0, 0.085, 0.03);                     // la fente
    P.boite(g, 0.26, 0.05, 0.1, mB, 0, 0.13, -0.24);                       // le capot du rouleau
    // le combiné, à gauche, sur son berceau
    var comb = new THREE.Group(); comb.position.set(-0.22, 0.1, -0.12); g.add(comb);
    P.boite(comb, 0.07, 0.04, 0.24, mB, 0, 0, 0);
    P.boite(comb, 0.075, 0.05, 0.06, mB, 0, 0.012, -0.1); P.boite(comb, 0.075, 0.05, 0.06, mB, 0, 0.012, 0.1);
    // le pavé de touches
    for (var i = 0; i < 12; i++) P.boite(g, 0.022, 0.01, 0.016, mT, 0.03 + (i % 3) * 0.03, 0.128, -0.17 + Math.floor(i / 3) * 0.024, { ombre: false });
    // l'écran : deux lignes, l'heure en veille ; à la sonnerie, la réception
    var ecr = K.tex.ecran({ largeur: 256, hauteur: 80, type: "lcd", fond: "#6f8052", ips: 8, dessiner: function (x, t, w, h) {
      x.fillStyle = "#18200f"; x.font = "700 " + Math.round(h * 0.34) + "px " + K.habillage.MONO; x.textAlign = "left"; x.textBaseline = "middle";
      var s = secondes(t), mn = Math.floor(s / 60) % 60;
      if (t < T_SONNE) { x.fillText("23:" + (mn < 10 ? "0" : "") + mn, w * 0.05, h * 0.3); x.fillText("PRET", w * 0.05, h * 0.72); }
      else { x.fillText(Math.floor(t * 2) % 2 || t > T_PAPIER ? "RECEPTION" : "", w * 0.05, h * 0.3); x.fillText("DE : ----------", w * 0.05, h * 0.72); }
    } });
    var mLcd = K.garder(new THREE.MeshStandardMaterial({ map: ecr.texture, emissive: new THREE.Color("#ffffff"), emissiveMap: ecr.texture, emissiveIntensity: 0.25, roughness: 0.3 }));
    var lcd = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.1, 0.031)), mLcd);
    lcd.rotation.x = -PI / 2 + 0.12; lcd.position.set(-0.06, 0.124, -0.13); g.add(lcd);
    var vert = K.mat.lumiere({ couleur: "#5CFF6A", intensite: 3, toneMapped: false }), ambre = K.mat.lumiere({ couleur: "#FFB22A", intensite: 0.05, toneMapped: false });
    var v1 = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.004, 8, 6)), vert); v1.position.set(0.13, 0.126, -0.075); g.add(v1);
    var v2 = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.004, 8, 6)), ambre); v2.position.set(0.13, 0.126, -0.095); g.add(v2);
    var hv = K.look.halo({ couleur: "#5CFF6A", taille: 0.035, intensite: 0.9 }); hv.position.copy(v1.position); g.add(hv);
    var ha = K.look.halo({ couleur: "#FFB22A", taille: 0.04, intensite: 0 }); ha.position.copy(v2.position); g.add(ha);
    var lueurEcran = K.look.ponctuelle({ couleur: "#b8d48a", intensite: 0.002, portee: 0.5 }); lueurEcran.position.set(-0.06, 0.2, -0.08); g.add(lueurEcran);
    // le papier : une bande de 42 cm, sa face imprimée (la photo) et son dos blanc ; il sort
    // de la fente (y = 0,085, z = 0,06), file à plat jusqu'au bord, plie, pend
    var gp = K.garder(new THREE.PlaneGeometry(LARGP, LP, 1, 64));
    var face = new THREE.Mesh(gp, K.garder(new THREE.MeshStandardMaterial({ map: texPage(K), roughness: 0.55, side: THREE.FrontSide })));
    var dos = new THREE.Mesh(gp, K.garder(new THREE.MeshStandardMaterial({ color: "#e9e6da", roughness: 0.6, side: THREE.BackSide })));
    face.castShadow = true; face.frustumCulled = false; dos.frustumCulled = false; g.add(face); g.add(dos);
    var pos0 = gp.attributes.position.array.slice(), bord = o.bord || 0.24, R = 0.02;
    var Ls = 0.03;   // la petite descente de la fente au plateau
    function chemin(dd, out) {
      if (dd <= Ls) { var e = dd / Ls; out[0] = 0.085 - 0.081 * e * e * (3 - 2 * e); out[1] = 0.06 + dd; return; }
      if (dd <= bord) { out[0] = 0.004; out[1] = 0.06 + dd; return; }
      var a = (dd - bord) / R;
      if (a <= PI / 2) { out[0] = 0.004 - R * (1 - Math.cos(a)); out[1] = 0.06 + bord + R * Math.sin(a); return; }
      out[0] = 0.004 - R - (dd - bord - R * PI / 2); out[1] = 0.06 + bord + R;
    }
    var tmp = [0, 0, 0];
    g.sortie = function (s) {   // s : la longueur sortie (m)
      var p = gp.attributes.position;
      for (var k = 0; k < p.count; k++) {
        var u = (LP / 2 - pos0[k * 3 + 1]);          // 0 au bord qui sort le premier (le haut de la page)
        var dd = s - u;
        if (dd < 0) { p.setXYZ(k, -pos0[k * 3], 0.085, 0.05); continue; }
        chemin(dd, tmp);
        // la face imprimée regarde le haut sur le plateau, l'avant quand elle pend
        p.setXYZ(k, -pos0[k * 3], tmp[0], tmp[1]);   // (x retourné : la face imprimée regarde le haut)
      }
      p.needsUpdate = true; gp.computeVertexNormals(); gp.computeBoundingSphere();
    };
    // la face : le plan est tourné pour que sa normale regarde +y (couché, imprimé dessus)
    face.rotation.set(0, 0, 0); dos.rotation.set(0, 0, 0);
    g.sortie(0);
    g.maj = function (t) {
      ecr.maj(t);
      var rx = t >= T_SONNE ? 1 : 0;
      mLcd.emissiveIntensity = rx ? 0.9 : 0.25;
      lueurEcran.intensity = rx ? 0.05 : 0.006;
      var clign = rx ? (t > T_PAPIER ? 1 : (Math.floor(t * 3) % 2)) : 0;
      ambre.color.set("#FFB22A").multiplyScalar(0.05 + 5 * clign); ha.intensite(1.1 * clign);
      g.sortie(Math.max(0, t - T_PAPIER) * V_PAPIER + (t > T_PAPIER ? 0.004 : 0));
    };
    return g;
  }

  // ─── L'HORLOGE DU BUREAU : un cadran blanc, des traits, l'aiguille des minutes qui
  // saute d'un cran à la minute (une horloge de gare), la trotteuse rouge qui balaie
  //  → Group (le cadran regarde +z) ; maj(t)
  function horloge(K, ctx) {
    var THREE = ctx.THREE, P = K.props, g = new THREE.Group(), R = 0.16;
    var c = K.tex.canvas(512, 512), x = c.getContext("2d");
    x.fillStyle = "#f1eee4"; x.beginPath(); x.arc(256, 256, 250, 0, 7); x.fill();
    x.strokeStyle = "#16130f"; x.lineCap = "butt";
    for (var i = 0; i < 60; i++) {
      var a = i / 60 * PI * 2, gros = i % 5 === 0;
      x.lineWidth = gros ? 14 : 5;
      x.beginPath(); x.moveTo(256 + Math.sin(a) * (gros ? 196 : 222), 256 - Math.cos(a) * (gros ? 196 : 222)); x.lineTo(256 + Math.sin(a) * 240, 256 - Math.cos(a) * 240); x.stroke();
    }
    var cad = new THREE.Mesh(K.garder(new THREE.CircleGeometry(R, 48)), K.garder(new THREE.MeshStandardMaterial({ map: K.tex.texture(c, { clamp: true }), roughness: 0.6 })));
    g.add(cad);
    P.cylindre(g, R + 0.014, R + 0.014, 0.035, K.mat.metal({ couleur: "#2a2a2c", rugosite: 0.4 }), 0, 0, -0.021, { rx: PI / 2, cotes: 48 });
    var verre = new THREE.Mesh(K.garder(new THREE.CircleGeometry(R, 48)), K.garder(new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.05, transparent: true, opacity: 0.08, envMapIntensity: 1.6, depthWrite: false })));
    verre.position.z = 0.02; g.add(verre);
    var mN = K.garder(new THREE.MeshStandardMaterial({ color: "#121110", roughness: 0.5 }));
    function aiguille(l, w, z, m, queue) { var p = new THREE.Group(); p.position.z = z; g.add(p); var b = P.boite(p, w, l + queue, 0.003, m, 0, (l - queue) / 2, 0, { ombre: false }); return p; }
    var hh = aiguille(R * 0.55, 0.018, 0.006, mN, 0.03), mm = aiguille(R * 0.82, 0.012, 0.009, mN, 0.03);
    var mR = K.garder(new THREE.MeshStandardMaterial({ color: "#b81e1e", roughness: 0.4 }));
    var ss = aiguille(R * 0.86, 0.004, 0.012, mR, 0.05);
    var bout = new THREE.Mesh(K.garder(new THREE.CircleGeometry(0.012, 16)), mR); bout.position.set(0, R * 0.62, 0.0005); ss.add(bout);
    var axe = new THREE.Mesh(K.garder(new THREE.CircleGeometry(0.008, 16)), mR); axe.position.z = 0.0135; g.add(axe);
    g.maj = function (t) {
      var s = secondes(t), mn = Math.floor(s / 60);
      // la minute saute (un petit rebond), la trotteuse balaie
      var rebond = Math.exp(-(s % 60) * 9) * Math.sin((s % 60) * 40) * 0.04;
      mm.rotation.z = -(mn % 60) / 60 * PI * 2 - rebond;
      hh.rotation.z = -(((23 + mn / 60) % 12) / 12) * PI * 2;
      ss.rotation.z = -(s % 60) / 60 * PI * 2;
    };
    return g;
  }

  // ─── LE BUREAU DU RECRUTEMENT, la nuit : une pièce de club-house (le papier peint, le
  // lino), la fenêtre à stores sur le stade (la lune), la porte entrouverte sur le couloir
  // allumé ; le bureau, l'écran éteint, le carnet ; le tableau blanc des ventes ; le
  // classeur et le fax ; l'horloge.
  function decorBureau(K, ctx) {
    var THREE = ctx.THREE, P = K.props, q = ctx.qualite;
    var s = K.decor(ctx, { ciel: false, fond: "#040508", environnement: { zenith: "#06080e", horizon: "#141a28", lueur: "#2a2420", fenetres: 10,
      lampes: [{ pos: [-30, 6, 0], couleur: "#9fb4e0", intensite: 1.5, taille: 6 }, { pos: [10, 2, 6], couleur: "#ffc98a", intensite: 1.2, taille: 3 }] }, reflets: 0.6,
      ambiance: ["#1a2236", "#0a0806", 0.13], brouillard: ["#06070b", 0.02] });
    // la pièce : le sol, le plafond, quatre murs ; la fenêtre dans le mur de gauche, la
    // porte dans celui de droite (près du devant). Le milieu de la pièce en z = −0,2.
    var W = 4.4, D = 4.0, H = 2.7, zc = -0.2;
    var mMur = K.mat.papier({ couleur: "#7c7564", graine: "bureau-ds-murs", repete: [3, 2] });
    var sol = new THREE.Mesh(P.planUV(W, D, 1.5), K.mat.bois({ couleur: "#3a2a1c", lames: 6, graine: "bureau-ds-sol", repete: [3, 3] }));
    sol.rotation.x = -PI / 2; sol.position.z = zc; sol.receiveShadow = true; s.add(sol);
    var plaf = new THREE.Mesh(P.planUV(W, D, 2), mMur); plaf.rotation.x = PI / 2; plaf.position.set(0, H, zc); s.add(plaf);
    // un mur (largeur w, centre, rotation) percé d'un trou { x, y, w, h } (coordonnées du mur)
    function mur(w, cx, cz, ry, trou) {
      var g = new THREE.Group(); g.position.set(cx, H / 2, cz); g.rotation.y = ry; s.add(g);
      var mor = function (x0, x1, y0, y1) { if (x1 - x0 < 0.01 || y1 - y0 < 0.01) return; var p = new THREE.Mesh(P.planUV(x1 - x0, y1 - y0, 2), mMur); p.position.set((x0 + x1) / 2, (y0 + y1) / 2 - H / 2, 0); p.receiveShadow = true; p.castShadow = true; g.add(p); };
      if (!trou) { mor(-w / 2, w / 2, 0, H); return g; }
      mor(-w / 2, trou.x - trou.w / 2, 0, H); mor(trou.x + trou.w / 2, w / 2, 0, H);
      mor(trou.x - trou.w / 2, trou.x + trou.w / 2, 0, trou.y - trou.h / 2); mor(trou.x - trou.w / 2, trou.x + trou.w / 2, trou.y + trou.h / 2, H);
      return g;
    }
    mur(W, 0, zc - D / 2, 0);                                                        // le fond
    mur(D, -W / 2, zc, PI / 2, { x: 0.45, y: 1.55, w: 1.5, h: 1.3 });              // gauche : la fenêtre (son milieu en z = zc − 0,45)
    mur(D, W / 2, zc, -PI / 2, { x: 1.2, y: 1.05, w: 0.95, h: 2.1 });              // droite : la porte (son milieu en z = zc + 1,2)
    mur(W, 0, zc + D / 2, PI);                                                       // le devant, pour les contrechamps
    // les stores : des lames inclinées dans l'embrasure
    var zF = -0.2 - 0.45, xF = -W / 2;   // le milieu de la fenêtre (le mur de gauche)
    var mLame = K.garder(new THREE.MeshStandardMaterial({ color: "#c9c3b4", roughness: 0.5 }));
    var lames = new THREE.Group(); s.add(lames);
    for (var l = 0; l < 22; l++) { var lm = P.boite(lames, 0.04, 0.004, 1.48, mLame, xF + 0.05, 1.55 - 0.64 + l * 0.06, zF); lm.rotation.z = 0.55; lm.castShadow = true; }
    P.fusionner(lames);
    // dehors, par la fenêtre : la nuit, les pylônes du stade, le halo de la ville
    var cn = K.tex.canvas(512, 256), xn = cn.getContext("2d"), gr = xn.createLinearGradient(0, 0, 0, 256);
    gr.addColorStop(0, "#04060c"); gr.addColorStop(0.7, "#0e1424"); gr.addColorStop(1, "#1c1a1c");
    xn.fillStyle = gr; xn.fillRect(0, 0, 512, 256);
    xn.fillStyle = "#020305";
    [[90, 70], [420, 60]].forEach(function (p) { xn.fillRect(p[0] - 3, p[1], 6, 196); xn.fillRect(p[0] - 26, p[1] - 30, 52, 32); });
    xn.fillRect(0, 205, 512, 51);
    var lune = xn.createRadialGradient(300, 50, 0, 300, 50, 34); lune.addColorStop(0, "rgba(220,230,255,0.95)"); lune.addColorStop(0.25, "rgba(200,215,250,0.6)"); lune.addColorStop(1, "rgba(0,0,0,0)");
    xn.fillStyle = lune; xn.fillRect(250, 0, 100, 100);
    var nuit = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(9, 4.5)), K.garder(new THREE.MeshBasicMaterial({ map: K.tex.texture(cn, { clamp: true }), fog: false })));
    nuit.rotation.y = PI / 2; nuit.position.set(xF - 4, 1.8, zF); s.add(nuit);
    // la lune : froide, à travers les lames (en tournage, leurs ombres font les rayures)
    var luneL = K.look.projecteur({ couleur: "#a9bde6", intensite: 110, angle: 0.62, penombre: 0.35, decroissance: 2, ombre: true, loin: 12, ombreTaille: 2048, biais: -0.0004 });
    luneL.position.set(xF - 2.6, 2.9, zF + 0.6); s.add(luneL);
    var cLune = new THREE.Object3D(); cLune.position.set(0.6, 0.55, -1.15); s.add(cLune); luneL.target = cLune;
    if (!q.ombres) {
      // sans ombres : les rayures peintes, sur le bureau et sur le sol
      var cr = K.tex.canvas(64, 256), xr = cr.getContext("2d");
      for (var r = 0; r < 256; r += 16) { var gg = xr.createLinearGradient(0, r, 0, r + 9); gg.addColorStop(0, "rgba(255,255,255,0)"); gg.addColorStop(0.5, "rgba(255,255,255,1)"); gg.addColorStop(1, "rgba(255,255,255,0)"); xr.fillStyle = gg; xr.fillRect(0, r, 64, 9); }
      var mRay = K.garder(new THREE.MeshBasicMaterial({ map: K.tex.texture(cr, { clamp: true }), color: new THREE.Color("#7f93c0").multiplyScalar(0.55), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
      [[0.05, 0.0105, -0.9, 2.2, 1.6, 0.2], [0.6, 0.791, -1.1, 1.2, 0.9, 0.2], [1.45, 0.7265, -1.38, 0.5, 0.42, 0.2]].forEach(function (p) { var ray = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(p[3], p[4])), mRay); ray.rotation.set(-PI / 2, 0, p[5]); ray.position.set(p[0], p[1], p[2]); s.add(ray); });
    }
    // la porte entrouverte (mur de droite), le couloir allumé derrière
    // la porte, entrouverte vers l'intérieur (sa charnière côté devant), son chambranle
    var mPorte = K.mat.bois({ couleur: "#5a3a24", lames: 1, graine: "porte-ds", cire: true }), mCadre = K.mat.bois({ couleur: "#2c190e", lames: 1, graine: "chambranle-ds" });
    var charniere = new THREE.Group(); charniere.position.set(W / 2 - 0.04, 0, 1.0 + 0.47); charniere.rotation.y = 1.05; s.add(charniere);
    P.boite(charniere, 0.04, 2.05, 0.9, mPorte, 0, 1.025, -0.45);
    P.cylindre(charniere, 0.025, 0.025, 0.12, K.mat.metal({ couleur: "#c8a45a", rugosite: 0.3 }), -0.06, 1.0, -0.8, { rz: PI / 2, cotes: 10 });
    P.boite(s, 0.1, 0.08, 1.06, mCadre, W / 2 - 0.02, 2.13, 1.0); P.boite(s, 0.1, 2.1, 0.06, mCadre, W / 2 - 0.02, 1.05, 0.5); P.boite(s, 0.1, 2.1, 0.06, mCadre, W / 2 - 0.02, 1.05, 1.5);
    var couloirL = K.look.projecteur({ couleur: "#ffc98a", intensite: 38, angle: 0.55, penombre: 0.5, decroissance: 2, ombre: true, loin: 8, ombreTaille: 1024 });
    couloirL.position.set(W / 2 + 1.2, 2.0, 1.2); s.add(couloirL);
    var cC = new THREE.Object3D(); cC.position.set(0.6, 0, 0.6); s.add(cC); couloirL.target = cC;
    var fondCouloir = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(2, 2.4)), K.garder(new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffd6a0").multiplyScalar(0.5), fog: false })));
    fondCouloir.rotation.y = -PI / 2; fondCouloir.position.set(W / 2 + 1.6, 1.2, 1.0); s.add(fondCouloir);
    if (!q.ombres) {
      var cw2 = K.tex.canvas(128, 128), xw = cw2.getContext("2d"), gw = xw.createLinearGradient(0, 0, 128, 0);
      gw.addColorStop(0, "rgba(255,200,140,0)"); gw.addColorStop(0.5, "rgba(255,200,140,0.8)"); gw.addColorStop(1, "rgba(255,200,140,0)");
      xw.fillStyle = gw; xw.beginPath(); xw.moveTo(54, 0); xw.lineTo(74, 0); xw.lineTo(128, 128); xw.lineTo(0, 128); xw.closePath(); xw.fill();
      var coin = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(1.6, 2.2)), K.garder(new THREE.MeshBasicMaterial({ map: K.tex.texture(cw2, { clamp: true }), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.35, fog: false })));
      coin.rotation.set(-PI / 2, 0, -PI / 2 - 0.4); coin.position.set(1.3, 0.012, 0.9); s.add(coin);
    }
    // le bureau (face à la porte), son fauteuil reculé, l'écran éteint, le carnet, une tasse
    var mBois = K.mat.bois({ couleur: "#5a3b22", lames: 4, graine: "bureau-ds", cire: true });
    var bur = new THREE.Group(); bur.position.set(-0.5, 0, -1.25); s.add(bur);
    P.boite(bur, 1.6, 0.05, 0.8, mBois, 0, 0.75, 0); P.boite(bur, 0.45, 0.72, 0.75, mBois, -0.55, 0.37, 0); P.boite(bur, 0.04, 0.7, 0.7, mBois, 0.76, 0.37, 0);
    var mGris = K.garder(new THREE.MeshStandardMaterial({ color: "#d6d0c2", roughness: 0.5 }));
    P.boite(bur, 0.4, 0.36, 0.38, mGris, -0.35, 0.96, -0.18); P.boite(bur, 0.3, 0.26, 0.2, mGris, -0.35, 0.92, -0.42);
    P.boite(bur, 0.33, 0.26, 0.005, K.garder(new THREE.MeshPhysicalMaterial({ color: "#0c0f10", roughness: 0.1, metalness: 0.2, envMapIntensity: 1.4 })), -0.35, 0.97, 0.012);
    P.boite(bur, 0.44, 0.02, 0.15, mGris, -0.3, 0.785, 0.2);
    var mCarnet = K.garder(new THREE.MeshStandardMaterial({ color: "#151515", roughness: 0.55 }));
    var carnet = P.boite(bur, 0.15, 0.018, 0.21, mCarnet, 0.32, 0.785, 0.1); carnet.rotation.y = 0.18;
    P.boite(bur, 0.006, 0.02, 0.212, K.garder(new THREE.MeshStandardMaterial({ color: "#7a1f2e", roughness: 0.6 })), 0.36, 0.786, 0.1).rotation.y = 0.18;
    P.cylindre(bur, 0.004, 0.004, 0.14, K.mat.metal({ couleur: "#1c2a40", rugosite: 0.35 }), 0.45, 0.8, 0.02, { rx: PI / 2, rz: 0.4, cotes: 8 });
    P.cylindre(bur, 0.04, 0.035, 0.09, K.garder(new THREE.MeshStandardMaterial({ color: "#efe9dc", roughness: 0.35 })), 0.62, 0.82, -0.2, { cotes: 16 });
    var mCh = K.garder(new THREE.MeshStandardMaterial({ color: "#1b1a1c", roughness: 0.55 }));
    var chaise = new THREE.Group(); chaise.position.set(-0.3, 0, -0.45); chaise.rotation.y = 0.5; s.add(chaise);
    P.boite(chaise, 0.5, 0.08, 0.48, mCh, 0, 0.48, 0); P.boite(chaise, 0.48, 0.62, 0.07, mCh, 0, 0.85, -0.24);
    P.cylindre(chaise, 0.03, 0.03, 0.4, K.mat.metal({}), 0, 0.24, 0);
    // le tableau blanc des ventes : l'objectif, au feutre
    var tb = K.tex.canvas(512, 320), xt = tb.getContext("2d");
    xt.fillStyle = "#e8e6df"; xt.fillRect(0, 0, 512, 320);
    xt.fillStyle = "#1d2a7a"; xt.font = "700 70px " + K.habillage.MONO; xt.textAlign = "left"; xt.fillText("30 M", 30, 90);
    xt.font = "400 34px " + K.habillage.MONO; xt.fillStyle = "#1d2a7a"; xt.fillText("JUIN : 21", 34, 170); xt.fillStyle = "#9a1c1c"; xt.fillText("RESTE : 9", 34, 220);
    xt.strokeStyle = "#1d2a7a"; xt.lineWidth = 4; xt.beginPath(); xt.moveTo(300, 60); xt.lineTo(470, 60); xt.moveTo(300, 110); xt.lineTo(430, 110); xt.moveTo(300, 160); xt.lineTo(450, 160); xt.stroke();
    var tableau = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(1.2, 0.75)), K.garder(new THREE.MeshStandardMaterial({ map: K.tex.texture(tb, { clamp: true }), roughness: 0.25, envMapIntensity: 0.8 })));
    tableau.position.set(-0.5, 1.6, -2.18); s.add(tableau);
    P.boite(s, 1.24, 0.79, 0.02, K.mat.metal({ couleur: "#8a8d90", rugosite: 0.35 }), -0.5, 1.6, -2.2);
    // le classeur métallique et le fax dessus, dans le coin, la fente vers la pièce
    var mCl = K.mat.metal({ couleur: "#55595c", rugosite: 0.5, metal: 0.4 });
    var cl = new THREE.Group(); cl.position.set(1.45, 0, -1.55); s.add(cl);
    P.boite(cl, 0.5, 0.72, 0.6, mCl, 0, 0.36, 0);
    for (var tr = 0; tr < 2; tr++) P.boite(cl, 0.42, 0.28, 0.01, mCl, 0, 0.18 + tr * 0.32, 0.302);
    var fx = telecopieur(K, ctx, { bord: 0.28 }); fx.position.set(0, 0.72, -0.04); cl.add(fx);
    // l'horloge, au-dessus du classeur
    var hor = horloge(K, ctx); hor.position.set(1.15, 2.12, -2.19); s.add(hor);
    // un rai de lune sur l'horloge (de la fenêtre, à travers les lames)
    var luneH = K.look.projecteur({ couleur: "#a9bde6", intensite: 70, angle: 0.12, penombre: 0.7, decroissance: 2, ombre: false });
    luneH.position.set(-2.0, 2.45, -0.75); s.add(luneH); luneH.target = hor;
    // un calendrier : août 2003
    var tc = K.tex.texte({ lignes: ["AOÛT", "2003"], fond: "#efe9dc", encre: "#7a1f2e", largeur: 256, hauteur: 300, graine: "calendrier" });
    var cal = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.3, 0.36)), K.garder(new THREE.MeshStandardMaterial({ map: tc.map, roughness: 0.7 })));
    cal.position.set(2.18, 1.5, -1.2); cal.rotation.y = -PI / 2; s.add(cal);
    s.updateMatrixWorld(true);
    return {
      scene: s, fax: fx, horloge: hor,
      look: { bloom: 0.5, rayon: 0.5, seuil: 0.9, exposition: 1.5, contraste: 1.12, saturation: 0.9 },
      maj: function (t) {
        fx.maj(t); hor.maj(t);
        couloirL.intensity = 38 * (1 - 0.04 * Math.max(0, K.bruit1(t * 8, 3)));
      }
    };
  }

  // ─── LE PARKING DU CLUB-HOUSE, une nuit d'août : la façade de brique (le couloir allumé,
  // le bureau noir à l'étage, l'enseigne), le parking, deux voitures, un réverbère au
  // sodium et ses papillons ; derrière, la tribune de béton et les pylônes éteints.
  function decorDehors(K, ctx) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: { zenith: "#03060f", horizon: "#141c30", lueur: "#3a2c24", lueurDir: [0.4, -1], force: 0.8 }, brouillard: ["#0a0e18", 0.012],
      environnement: { fenetres: 18, lampes: [{ pos: [10, 7, 6], couleur: "#ff9a3d", intensite: 3, taille: 3 }] }, reflets: 0.8, ambiance: ["#1c2640", "#080706", 0.12] });
    var sol = new THREE.Mesh(P.planUV(80, 60, 3), K.mat.asphalte({ flaques: 0.08, graine: "parking-ch" })); sol.rotation.x = -PI / 2; sol.receiveShadow = true; s.add(sol);
    // les places : des traits blancs
    var mTrait = K.garder(new THREE.MeshStandardMaterial({ color: "#bdb8aa", roughness: 0.8 }));
    var traits = new THREE.Group(); s.add(traits);
    for (var k = 0; k < 9; k++) P.boite(traits, 0.1, 0.005, 4.6, mTrait, -10 + k * 2.6, 0.004, 6.5, { ombre: false });
    P.fusionner(traits);
    // le club-house : deux niveaux de brique, le toit plat, l'enseigne
    var fa = P.facade({ largeur: 22, etages: 1, vitrine: false, brique: "#5e3226", graine: "club-house", fenetres: { allumees: 0.0, colonnes: 7 } });
    var te = K.tex.texte({ lignes: ["RACING AUBÉRIVE"], fond: "#2a1a14", encre: "#e8dcc0", largeur: 1024, hauteur: 144, peint: true, graine: "enseigne-club-house" });
    var ens = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(5.2, 0.73)), K.garder(new THREE.MeshStandardMaterial({ map: te.map, roughness: 0.7, emissive: new THREE.Color("#ffffff"), emissiveMap: te.map, emissiveIntensity: 0.05 })));
    ens.position.set(0, 3.15, -0.92); s.add(ens);
    var lampeEns = K.look.projecteur({ couleur: "#ffd9a8", intensite: 9, angle: 0.6, penombre: 0.8, decroissance: 2, ombre: false }); lampeEns.position.set(0, 4.3, 0.2); s.add(lampeEns);
    var cEns = new THREE.Object3D(); cEns.position.set(0, 3.0, -1); s.add(cEns); lampeEns.target = cEns;
    fa.position.set(0, 0, -1); s.add(fa);
    // le rez-de-chaussée : la porte vitrée, un auvent, les fenêtres ; celle du couloir allumée
    var mVitre = K.garder(new THREE.MeshPhysicalMaterial({ color: "#07090c", roughness: 0.06, metalness: 0.1, envMapIntensity: 1.4 }));
    var mAllume = K.garder(new THREE.MeshStandardMaterial({ color: "#2a2620", emissive: new THREE.Color("#ffcf96"), emissiveIntensity: 0.7, roughness: 0.4 }));
    [-8, -4.5, 4.5, 8].forEach(function (x, i) { P.boite(s, 1.6, 1.3, 0.06, i === 2 ? mAllume : mVitre, x, 1.6, -0.97, { ombre: false }); });
    P.boite(s, 1.6, 2.3, 0.06, mVitre, 0, 1.15, -0.97, { ombre: false });
    P.boite(s, 3.4, 0.12, 1.4, K.mat.metal({ couleur: "#2a2c2e", rugosite: 0.5 }), 0, 2.6, -0.3);
    var veille = K.look.ponctuelle({ couleur: "#ffd09a", intensite: 6, portee: 10 }); veille.position.set(4.5, 1.6, 0.6); s.add(veille);
    var hc = K.look.halo({ couleur: "#ffd09a", taille: 1.2, intensite: 0.22 }); hc.position.set(4.5, 1.6, -0.9); s.add(hc);
    // l'étage : les fenêtres de la façade sont noires (le bureau du recrutement aussi)
    // derrière : la tribune de béton (refaite après le feu de 1999), les pylônes
    var tri = P.tribune({ largeur: 60, rangs: 14, couleurs: ["#5a5650", "#7A1F2E"], grillage: false, panneaux: false, graine: "est-beton" });
    tri.rotation.y = PI; tri.position.set(6, 0, -34); s.add(tri);
    [[-30, -40], [40, -42]].forEach(function (p, i) {
      var py = P.pylone({ hauteur: 30, colonnes: 4, rangees: 3, intensite: 0, cone: false, graine: "py-ch" + i });
      py.groupe.position.set(p[0], 0, p[1]); s.add(py.groupe); s.updateMatrixWorld(true); py.viser(0, 0, -20); py.tete.remove(py.lumiere);
    });
    // les deux voitures : la tienne, le nez vers le mur ; la petite grise, en marche
    // arrière, le nez vers la sortie
    var v1 = P.voiture({ couleur: "#24324a", plaque: "4127 RV 12" }); v1.position.set(-3.0, 0, 4.6); v1.rotation.y = PI / 2; s.add(v1);
    var v2 = P.voiture({ couleur: "#8a8d90", plaque: "9061 RV 12" }); v2.scale.setScalar(0.86); v2.position.set(3.4, 0, 5.4); v2.rotation.y = -PI / 2; s.add(v2);
    // le réverbère du parking, ses papillons
    var rev = P.reverbere({ hauteur: 6.5, bras: 1.4, intensite: 320, ombre: true, gresille: 0.2, forceCone: 0.1 });
    rev.position.set(0.2, 0, 8.6); rev.rotation.y = PI / 2; s.add(rev);
    s.updateMatrixWorld(true);
    var pl = rev.positionLampe();
    var papillons = K.particules.poussiere({ n: 60, zone: { min: [pl[0] - 0.8, pl[1] - 0.9, pl[2] - 0.8], max: [pl[0] + 0.8, pl[1] + 0.3, pl[2] + 0.8] }, taille: 0.03, couleur: "#ffdca8", opacite: 0.9, graine: "papillons" });
    s.add(papillons);
    var refl = K.look.reflet({ pos: pl, sol: 0.01, couleur: "#FF9A3D", intensite: 0.35, largeur: 1.6, longueur: 7 }); s.add(refl);
    return {
      scene: s,
      look: { bloom: 0.6, rayon: 0.55, seuil: 0.85, exposition: 1.35, contraste: 1.12, saturation: 0.92 },
      maj: function (t, c) { rev.maj(t); papillons.maj(t); refl.maj(c.camera); }
    };
  }

  FC.film({
    id: "papier_thermique",
    livre: "vendre_trente",
    titre: "Papier thermique",
    duree: 32.4,
    musique: "livre_h6",
    secours: "ville_nuit",
    couleur: VIOLET,
    affiche: 24.0,
    habillage: { vignette: 0.6, grain: 0.08, ratioPaysage: 2.35, ratioPortrait: 0 },
    sortie: { noir: 1.2 },
    // la ligne qui sonne deux fois, avant la réception
    sons: [[T_SONNE, "sonnerie"]],
    textes: [
      { sorte: "lieu", de: 1.0, a: 5.0, texte: "Aubérive, club-house du Racing", sous: "Août 2003 · 23 h 57" },
      { sorte: "titre", de: 28.6, a: 32.0, texte: "Aubérive · 2003", sous: "23 h 58", entree: 0.2, sortie: 0.7 }
    ],
    montages: { court: [[0.4, 5.0], [6.0, 9.8], [11.0, 14.2], [14.8, 19.4], [20.2, 26.2], [27.6, 32.2]] },
    preparer: function (K, ctx) {
      return K.etapes(ctx, [
        function () { ctx.decors.dehors = decorDehors(K, ctx); },
        function () { ctx.decors.bureau = decorBureau(K, ctx); }
      ]);
    },
    plans: [
      // 1 · le parking, une nuit d'août : le couloir allumé, le bureau noir, la petite grise
      { de: 0, a: 5.4, decor: "dehors", entree: "noir", transition: 1.2, fixe: 3.0,
        camera: { pos: K_cles([[0, [-4.2, 1.3, 15]], [5.4, [-3.0, 1.45, 11.8]]], "lin"), cible: K_cles([[0, [0.6, 2.1, -1]], [5.4, [0.9, 2.2, -1]]], "lin"), fov: 50, epaule: 0.08 } },
      // 2 · le bureau dans le noir : les stores, le carnet, le tableau ; vers le fax qui veille
      { de: 5.4, a: 10.4, decor: "bureau", entree: "coupe", fixe: 3.0,
        camera: { pos: K_cles([[0, [-1.4, 1.6, 1.5]], [5.0, [0.55, 1.32, 0.1]]], "douce"), cible: K_cles([[0, [-0.3, 1.2, -1.6]], [5.0, [1.42, 0.84, -1.5]]], "douce"), fov: 50, epaule: 0.06 }, look: { exposition: 1.7 } },
      // 3 · l'horloge : la trotteuse monte, l'aiguille saute sur 58
      { de: 10.4, a: 14.6, decor: "bureau", entree: "coupe", fixe: 2.6,
        camera: { pos: K_cles([[0, [1.02, 2.04, -1.42]], [4.2, [1.06, 2.06, -1.5]]], "lin"), cible: [1.15, 2.12, -2.19], fov: 34, epaule: 0.05 } },
      // 4 · le fax : la sonnerie, l'écran, le voyant ambre ; le papier commence
      { de: 14.6, a: 19.6, decor: "bureau", entree: "coupe", fixe: 3.4,
        camera: { pos: K_cles([[0, [1.12, 1.18, -0.95]], [5.0, [1.2, 1.12, -1.05]]], "lin"), cible: [1.42, 0.8, -1.58], fov: 36, epaule: 0.05 } },
      // 5 · le papier, de tout près : l'en-tête, puis le haut de la photo, ligne à ligne
      { de: 19.6, a: 26.6, decor: "bureau", entree: "coupe", fixe: 5.4,
        camera: { pos: K_cles([[0, [1.45, 1.03, -1.63]], [7.0, [1.45, 1.0, -1.58]]], "lin"), cible: K_cles([[0, [1.45, 0.724, -1.5]], [7.0, [1.45, 0.724, -1.44]]], "lin"), fov: 34, epaule: 0.04 } },
      // 6 · le bureau vide, le papier qui pend dans les rayures de la lune
      { de: 26.6, a: 32.4, decor: "bureau", entree: "coupe", fixe: 3.0,
        camera: { pos: K_cles([[0, [0.2, 1.45, 0.9]], [5.8, [-0.1, 1.55, 1.5]]], "lin"), cible: [1.1, 0.95, -1.5], fov: 46, epaule: 0.05 }, look: { exposition: 1.8 } }
    ]
  });

  function K_() { return FC.kit; }
  function K_cles(p, a) { var f = null; return function (t) { if (!f) f = K_().cles(p, a); return f(t); }; }
})(typeof window !== "undefined" ? window : this);
