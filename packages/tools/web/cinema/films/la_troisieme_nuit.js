/* ═══════════════════════════════════════════════════════════════════════════
   FILM — « La troisième nuit » (livre 7, « Chambre 12 », 2011, le sélectionneur
   après le fiasco ; la couleur du livre : #FF79B0).

   Novembre 2011, la troisième nuit de la fenêtre, après le coup de téléphone de
   2 h 30 (« Montez au 12. La docteure est déjà là. »). Le livre ne monte jamais à
   la 12 cette nuit-là (cinematiques_h7.yaml : « on voit l'avant et l'après,
   jamais la nuit elle-même ») : le film non plus. Il reste dehors et en bas, et
   il ne montre que ce que le livre dit :
     · le coin du terrain annexe du Racing, dans la brume (celui que le petit
       regardait de sa fenêtre, en mars) ; la 12 est la seule fenêtre allumée ;
     · la 12, de loin : derrière le rideau, l'ombre de quelqu'un d'assis au bord
       du lit, les mains qui ne bougent pas (Arzel, « les mains qui ne font plus
       rien ») ;
     · la réception, vide : le fauteuil de Sandrine Lavergne tourné vers
       l'escalier, son gilet sur le dossier, le cahier de nuit fermé (on ne lit
       pas sa page ce soir), l'horloge à 2 h 38, et le standard qui sonne dans le vide (la voie de la
       police : « le standard de l'hôtel sonne dans le vide ») ; au tableau, les
       vingt-six doubles à leur place (ce que dit la scène de quatre heures) ;
     · la 12 qui s'éteint, après les trois coups de la musique ;
     · 3 h 50 : le parking, le bus de 2010, MONDIAL derrière le pare-brise ; les
       lampes du hall qui s'allument une à une, « comme pour un mariage » (la
       scène jouée qui suit, h7.ci.quatre_heures) ;
     · l'hôtel noir au-dessus du hall allumé ; le coin du terrain, vide.
   Il se joue après la carte de 2 h 10 (sl.h7.a3_deux_heures_dix*, créneau 15,
   2011 : 100 % des carrières, mesuré sur 300), sur ses deux réponses (« J'y
   monte » ou « J'appelle la police ») : rien n'y dépend de la réponse. Il ne
   devance rien : ni le corps, ni qui a pris un double, ni la page du cahier
   que Sandrine lira plus tard ; la 14 n'y est pas.

   LES PLANS (35,5 s ; la musique : livre_h7, 84 à la noire ; l'introduction au
   maillet jusqu'à 5,7 s, les trois coups frappés à 17,1 s, la réponse à 22,9 s,
   la caisse « gated » à 28,6 s : les coupes tombent dessus)
     1   0,0–5,7   le coin du terrain annexe, d'en haut, l'arc, le piquet, la brume ;
                   on lève les yeux : l'hôtel noir, une seule fenêtre allumée au
                   deuxième, l'ombre derrière le rideau · carton « Aubérive, hôtel de
                   la Rive / Novembre 2011 · la troisième nuit, 2 h 31 »
     2   5,7–11,4  la 12, de loin : le rideau, l'ombre de quelqu'un d'assis, la tête
                   basse, qui ne bouge pas
     3  11,4–17,1  derrière le comptoir de la réception, vide : le tableau des
                   doubles, le fauteuil tourné et le gilet, le cahier fermé sous la
                   lampe verte ; au bout, le standard et l'horloge (2 h 38) ; on s'approche
                   du voyant qui clignote : deux fois deux sonneries, personne
     4  17,1–22,9  la 12, plus près : les trois coups (la musique), la lumière
                   s'éteint (18,4 s) ; la vitre noire, le reflet du lampadaire
     5  22,9–28,6  3 h 50, le parking : le bus de 2010, MONDIAL derrière le pare-
                   brise ; au rez-de-chaussée, les fenêtres du hall s'allument une à
                   une · carton « Hôtel de la Rive / 3 h 50 »
     6  28,6–35,5  l'hôtel depuis le terrain : en haut tout est noir, en bas le hall
                   allumé derrière le grillage ; on baisse les yeux vers le coin, son
                   arc, son piquet, vides · titre « Aubérive · 2011 / Chambre 12 »
   La coupe de 30 s (montages.court) : les mêmes plans, resserrés.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var FC = global.FusibleCinema;
  var PI = Math.PI;
  var ROSE = "#FF79B0";
  var COBALT = "#1d3570";

  // ─── L'HÔTEL DE LA RIVE (les mêmes mesures que « Vingt-six doubles ») ─────────
  // le corps : x de -14 à 14, z de -12 à 0 (la façade du parking regarde +z) ; le rez-de-
  // chaussée fait 3,6 m, puis trois étages de 3,1 m ; le flanc est (x = 14) regarde le
  // terrain annexe ; la 12 y est au deuxième, la deuxième fenêtre depuis le parking.
  var HOTEL = { W: 28, D: 12, rdc: 3.6, he: 3.1, E: 3 };
  HOTEL.H = HOTEL.rdc + HOTEL.E * HOTEL.he;
  var F12 = { x: 14, y: 3.6 + 3.1 + 1.55, z: -4.5 };
  var TERRAIN = { x0: 24.4, x1: 79.6, z0: -41.5, z1: -2.5 };
  // les temps : la 12 s'éteint après le troisième coup ; les lampes du hall, une à une
  var NOIR12 = 18.4;
  var HALL = [23.3, 23.85, 24.35, 24.95, 25.55, 26.2, 26.8];

  function vitreSombre(K, THREE) {
    return K.garder(new THREE.MeshPhysicalMaterial({ color: "#0b0f16", roughness: 0.08, metalness: 0.1, envMapIntensity: 1.4 }));
  }
  // une fenêtre allumée : une lumière de chambre (ou de salon), un rideau à moitié tiré
  function toileFenetre(K, graine, chaude) {
    var c = K.tex.canvas(128, 160), x = c.getContext("2d"), r = K.alea(graine);
    var g = x.createLinearGradient(0, 0, 0, 160);
    g.addColorStop(0, chaude ? "#ffd99a" : "#a9b8d8"); g.addColorStop(1, chaude ? "#a65e28" : "#3d4a66");
    x.fillStyle = g; x.fillRect(0, 0, 128, 160);
    x.fillStyle = "rgba(40,18,8,0.45)"; x.fillRect(r() < 0.5 ? 0 : 76, 0, 52, 160);
    x.fillStyle = "rgba(0,0,0,0.85)"; x.fillRect(61, 0, 6, 160);
    return K.tex.texture(c, { clamp: true });
  }
  // la vitre de la 12, éteinte : du noir, et le sodium du terrain qui s'y reflète, flou
  function toileReflet(K) {
    var c = K.tex.canvas(128, 160), x = c.getContext("2d");
    x.fillStyle = "#05070b"; x.fillRect(0, 0, 128, 160);
    var r = x.createRadialGradient(96, 52, 2, 96, 52, 46);
    r.addColorStop(0, "rgba(255,170,90,0.55)"); r.addColorStop(0.35, "rgba(200,110,50,0.18)"); r.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = r; x.fillRect(0, 0, 128, 160);
    var gg = x.createLinearGradient(0, 0, 0, 160); gg.addColorStop(0, "rgba(60,80,110,0.25)"); gg.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = gg; x.fillRect(0, 0, 128, 160);
    x.fillStyle = "rgba(0,0,0,0.9)"; x.fillRect(61, 0, 6, 160);
    return K.tex.texture(c, { clamp: true });
  }
  // la 12, allumée : la lampe de chevet, le rideau tiré aux deux tiers ; sur le rideau,
  // l'ombre de quelqu'un d'assis au bord du lit, la tête basse, les mains sur les genoux
  function toile12(K) {
    var W = 256, H = 320, c = K.tex.canvas(W, H), x = c.getContext("2d");
    var g = x.createRadialGradient(150, 210, 10, 128, 170, 250);
    g.addColorStop(0, "#ffe7b8"); g.addColorStop(0.4, "#e9a865"); g.addColorStop(1, "#6a3014");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    // le rideau (les deux tiers gauches) : une toile claire, ses plis
    x.fillStyle = "rgba(235,200,150,0.55)"; x.fillRect(0, 0, 172, H);
    for (var i = 0; i < 9; i++) {
      var px = 8 + i * 19, gp = x.createLinearGradient(px, 0, px + 19, 0);
      gp.addColorStop(0, "rgba(90,40,14,0.22)"); gp.addColorStop(0.5, "rgba(255,230,190,0.08)"); gp.addColorStop(1, "rgba(90,40,14,0.22)");
      x.fillStyle = gp; x.fillRect(px, 0, 19, H);
    }
    // l'ombre, sur le rideau : quelqu'un d'assis au bord du lit, de profil, la tête basse, les
    // avant-bras sur les genoux (le lit est plus bas que l'appui : on ne voit que le haut)
    x.save();
    x.filter = "blur(4px)";
    x.fillStyle = "rgba(38,15,6,0.82)";
    x.beginPath(); x.ellipse(152, 214, 21, 25, 0.55, 0, 7); x.fill();                                      // la tête, penchée
    x.beginPath(); x.moveTo(132, 228); x.quadraticCurveTo(104, 230, 96, 262); x.quadraticCurveTo(88, 296, 92, 320);   // la nuque, le dos rond
    x.lineTo(176, 320); x.quadraticCurveTo(178, 276, 166, 240); x.closePath(); x.fill();
    x.beginPath(); x.moveTo(150, 262); x.quadraticCurveTo(178, 286, 206, 300); x.lineTo(210, 314); x.quadraticCurveTo(176, 304, 146, 286); x.closePath(); x.fill();   // le bras, vers les genoux
    x.restore();
    // le bas de la fenêtre : le bord du lit, plus sombre
    var gb = x.createLinearGradient(0, 270, 0, H); gb.addColorStop(0, "rgba(40,16,6,0)"); gb.addColorStop(1, "rgba(40,16,6,0.6)");
    x.fillStyle = gb; x.fillRect(0, 270, W, H - 270);
    x.fillStyle = "rgba(0,0,0,0.9)"; x.fillRect(122, 0, 12, H);
    return K.tex.texture(c, { clamp: true });
  }

  // une boîte aux arêtes arrondies (un coussin, un dossier) : w × h × d, rayon r
  function boiteRonde(THREE, w, h, d, r, n) {
    var g = new THREE.BoxGeometry(1, 1, 1, n || 6, n || 6, n || 6), p = g.attributes.position, v = new THREE.Vector3(), c = new THREE.Vector3();
    var inner = new THREE.Vector3(w / 2 - r, h / 2 - r, d / 2 - r);
    for (var i = 0; i < p.count; i++) {
      v.set(p.getX(i) * w, p.getY(i) * h, p.getZ(i) * d);
      c.set(Math.max(-inner.x, Math.min(inner.x, v.x)), Math.max(-inner.y, Math.min(inner.y, v.y)), Math.max(-inner.z, Math.min(inner.z, v.z)));
      v.sub(c); if (v.lengthSq() > 1e-12) v.normalize().multiplyScalar(r);
      v.add(c); p.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    return g;
  }

  // ─── L'HÔTEL, la nuit ─────────────────────────────────────────────────────────
  function hotel(K, ctx) {
    var THREE = ctx.THREE, P = K.props, g = new THREE.Group(), W = HOTEL.W, D = HOTEL.D, H = HOTEL.H;
    var mB = K.mat.brique({ couleur: "#6b3a2c", graine: "hotel-rive", suie: 0.9, humide: 0.3 });
    var corps = new THREE.Mesh(P.boiteUV(W, H, D, 2.4), mB); corps.position.set(0, H / 2, -D / 2); corps.castShadow = true; corps.receiveShadow = true; g.add(corps);
    var mPierre = K.mat.beton({ couleur: "#8d877a", graine: "pierre-hotel" });
    P.boite(g, W + 0.4, 0.4, D + 0.4, mPierre, 0, H + 0.1, -D / 2);
    P.boite(g, W + 0.12, 0.2, 0.18, mPierre, 0, HOTEL.rdc, 0.05);
    P.boite(g, 0.18, 0.2, D + 0.12, mPierre, W / 2 + 0.05, HOTEL.rdc, -D / 2);
    var mCadre = K.mat.peint({ couleur: "#1c1612", rugosite: 0.6 });
    // les étages du parking : tout dort (une fenêtre sur vingt-sept, peut-être)
    var fen = K.tex.fenetres({ colonnes: 9, rangees: 3, allumees: 0.04, mur: "#000000", graine: "hotel-parking-nuit" });
    var mF = K.garder(new THREE.MeshStandardMaterial({ map: fen.map, emissive: new THREE.Color("#ffffff"), emissiveMap: fen.lumiere, emissiveIntensity: 0.8, roughness: 0.2, metalness: 0.1, transparent: true }));
    mF.onBeforeCompile = function (sh) { sh.fragmentShader = sh.fragmentShader.replace("#include <map_fragment>", "#include <map_fragment>\n if (diffuseColor.r + diffuseColor.g + diffuseColor.b < 0.02) discard;"); };
    var pf = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(W * 0.96, HOTEL.E * HOTEL.he)), mF); pf.position.set(0, HOTEL.rdc + HOTEL.E * HOTEL.he / 2, 0.03); g.add(pf);
    // l'enseigne, éteinte : le caisson, les tubes gris
    P.boite(g, 6.4, 1.1, 0.06, K.mat.metal({ couleur: "#141518", rugosite: 0.7 }), 7, 4.55, 0.06);
    var nt = K.tex.neon({ texte: "HÔTEL DE LA RIVE", couleur: "#6b5a60", largeur: 1024, hauteur: 160 });
    var mN = K.garder(new THREE.MeshBasicMaterial({ map: nt.lumiere, transparent: true, depthWrite: false, color: new THREE.Color(0.16, 0.14, 0.15) }));
    var neon = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(6.2, 0.97)), mN); neon.position.set(7, 4.55, 0.12); g.add(neon);
    P.boite(g, 2.4, 0.08, 1.2, K.mat.metal({ couleur: "#2a2c30", rugosite: 0.5 }), 7, 2.75, 0.6);
    // LE HALL, la nuit : il s'allume à 3 h 50, lampe après lampe. Côté parking, la porte
    // vitrée et cinq fenêtres ; côté terrain, trois fenêtres du salon.
    var allumables = [];
    function allumable(geo, tex, k0, pos, ry) {
      var m = K.garder(new THREE.MeshBasicMaterial({ map: tex, color: new THREE.Color(0, 0, 0) }));
      var p = new THREE.Mesh(geo, m); p.position.fromArray(pos); p.rotation.y = ry || 0; g.add(p);
      allumables.push({ m: m, t: HALL[k0 % HALL.length], k: 0.82 + 0.18 * K.h01(k0, 3) });
      return p;
    }
    var gF = K.garder(new THREE.PlaneGeometry(1.6, 1.4)), gP = K.garder(new THREE.PlaneGeometry(1.3, 2.3));
    var tp = K.tex.canvas(64, 128), tpx = tp.getContext("2d"), gp = tpx.createLinearGradient(0, 0, 0, 128);
    gp.addColorStop(0, "#c98a4a"); gp.addColorStop(0.55, "#f2c182"); gp.addColorStop(1, "#ffe2b0");
    tpx.fillStyle = gp; tpx.fillRect(0, 0, 64, 128);
    tpx.fillStyle = "rgba(30,14,6,0.8)"; tpx.fillRect(40, 30, 24, 98);
    var tPorte = K.tex.texture(tp, { clamp: true });
    var sombre = vitreSombre(K, THREE);
    // les fenêtres du parking (l'ordre dit qui s'allume d'abord)
    [[-1, 0], [3.2, 1], [-5.5, 2], [11.4, 4], [-10, 5]].forEach(function (f) {
      var vS = new THREE.Mesh(gF, sombre); vS.position.set(f[0], 1.7, 0.035); g.add(vS);
      allumable(gF, toileFenetre(K, "h" + f[1], true), f[1], [f[0], 1.7, 0.045]);
      P.boite(g, 1.7, 0.08, 0.1, mCadre, f[0], 2.42, 0.07); P.boite(g, 1.7, 0.08, 0.1, mCadre, f[0], 0.98, 0.07);
    });
    var vP = new THREE.Mesh(gP, sombre); vP.position.set(7, 1.15, 0.035); g.add(vP);
    allumable(gP, tPorte, 3, [7, 1.15, 0.045]);
    P.boite(g, 1.5, 0.1, 0.1, mCadre, 7, 2.35, 0.08); P.boite(g, 0.1, 2.4, 0.1, mCadre, 6.3, 1.2, 0.08); P.boite(g, 0.1, 2.4, 0.1, mCadre, 7.7, 1.2, 0.08);
    // les fenêtres du salon, côté terrain (rez-de-chaussée du flanc est)
    [[-2.2, 2], [-6.2, 4], [-10.2, 6]].forEach(function (f, i) {
      var vS = new THREE.Mesh(gF, sombre); vS.rotation.y = PI / 2; vS.position.set(W / 2 + 0.035, 1.7, f[0]); g.add(vS);
      allumable(gF, toileFenetre(K, "s" + i, true), f[1], [W / 2 + 0.045, 1.7, f[0]], PI / 2);
      P.boite(g, 0.1, 0.08, 1.7, mCadre, W / 2 + 0.07, 2.42, f[0]); P.boite(g, 0.1, 0.08, 1.7, mCadre, W / 2 + 0.07, 0.98, f[0]);
    });
    // la lumière qui sort du hall : sur le parking (deux projecteurs), sur l'herbe du flanc (une)
    var lHall = [[3.0, 2.3, 0.6, 4.0, 1.4, 11.0], [-6.0, 2.3, 0.6, 0, 1.2, 12.0], [W / 2 + 0.6, 2.3, -6.2, W / 2 + 6, 0, -6.2]].map(function (p) {
      var l = K.look.projecteur({ couleur: "#FFB46A", intensite: 0, angle: 1.0, penombre: 0.8, ombre: false, loin: 18 });
      l.position.set(p[0], p[1], p[2]); g.add(l);
      var c = new THREE.Object3D(); c.position.set(p[3], p[4], p[5]); g.add(c); l.target = c;
      return l;
    });
    // le flanc du terrain : douze fenêtres (quatre par étage), sombres ; la 12 au deuxième
    var mSombre = vitreSombre(K, THREE), c12 = null;
    for (var et = 0; et < 3; et++) for (var c = 0; c < 4; c++) {
      var z = -1.5 - c * 3, y = HOTEL.rdc + et * HOTEL.he + 1.55, est12 = et === 1 && c === 1;
      var cadre = new THREE.Group(); cadre.position.set(W / 2, y, z); g.add(cadre);
      P.boite(cadre, 0.16, 0.1, 1.3, mCadre, 0.03, 0.82, 0); P.boite(cadre, 0.22, 0.1, 1.4, mPierre, 0.06, -0.82, 0);
      P.boite(cadre, 0.16, 1.7, 0.08, mCadre, 0.03, 0, -0.62); P.boite(cadre, 0.16, 1.7, 0.08, mCadre, 0.03, 0, 0.62);
      if (est12) { c12 = cadre; continue; }
      var vit = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(1.16, 1.56)), mSombre);
      vit.rotation.y = PI / 2; vit.position.set(0.01, 0, 0); cadre.add(vit);
    }
    // la 12 : allumée (l'ombre sur le rideau), puis éteinte (le reflet du sodium)
    var gV = K.garder(new THREE.PlaneGeometry(1.16, 1.56));
    var mNoire = K.garder(new THREE.MeshBasicMaterial({ map: toileReflet(K) }));
    var vNoire = new THREE.Mesh(gV, mNoire); vNoire.rotation.y = PI / 2; vNoire.position.x = 0.008; c12.add(vNoire);
    var m12 = K.garder(new THREE.MeshBasicMaterial({ map: toile12(K), color: new THREE.Color(1, 1, 1), transparent: true }));
    var v12 = new THREE.Mesh(gV, m12); v12.rotation.y = PI / 2; v12.position.x = 0.014; c12.add(v12);
    var l12 = K.look.ponctuelle({ couleur: "#FFC27A", intensite: 2.4, portee: 6 }); l12.position.set(W / 2 + 0.9, F12.y, F12.z); g.add(l12);
    var h12 = K.look.halo({ couleur: "#FFC27A", taille: 2.4, intensite: 0.35 }); h12.position.set(W / 2 + 0.25, F12.y, F12.z); g.add(h12);
    return {
      groupe: g,
      // la 12 : k de 1 (allumée) à 0 (éteinte)
      douze: function (k) {
        m12.opacity = k; m12.color.setScalar(1.15 * k); v12.visible = k > 0.001; l12.intensity = 2.4 * k; h12.intensite(0.35 * k);
      },
      // le hall à t : chaque lampe à son heure, le temps que le tube chauffe
      hall: function (t) {
        var s = 0;
        allumables.forEach(function (a, i) {
          var d = t - a.t, k = d < 0 ? 0 : d < 0.06 ? 0.7 : d < 0.12 ? 0.15 : Math.min(1, 0.55 + d * 1.6);
          a.m.color.setScalar(0.95 * a.k * k); s += k;
        });
        var moy = s / allumables.length;
        lHall[0].intensity = 75 * K.borne((t - HALL[0]) * 1.5, 0, 1) * moy;
        lHall[1].intensity = 60 * K.borne((t - HALL[2]) * 1.5, 0, 1) * moy;
        lHall[2].intensity = 14 * K.borne((t - HALL[2]) * 1.5, 0, 1);
      }
    };
  }

  // ─── LE BUS DE 2010, sous le givre (l'avant regarde +x, posé sur y = 0) ─────────
  var BUS = { L: 12, W: 2.5, bas: 0.34, haut: 3.45 };
  function bus(K, ctx) {
    var THREE = ctx.THREE, P = K.props, g = new THREE.Group(), L = BUS.L, Wb = BUS.W, y0 = BUS.bas, y1 = BUS.haut;
    var mCaisse = K.garder(new THREE.MeshPhysicalMaterial({ color: "#a9adb3", roughness: 0.45, metalness: 0.4, clearcoat: 0.5, clearcoatRoughness: 0.5 }));
    var mBlanc = K.garder(new THREE.MeshStandardMaterial({ color: COBALT, roughness: 0.45, metalness: 0.3 }));
    var mNoir = K.garder(new THREE.MeshStandardMaterial({ color: "#0d0e10", roughness: 0.7 }));
    var mVitre = K.garder(new THREE.MeshPhysicalMaterial({ color: "#070a10", roughness: 0.06, metalness: 0.2, envMapIntensity: 1.6, emissive: new THREE.Color("#2a3f7a"), emissiveIntensity: 0.3 }));
    var pr = new THREE.Shape();
    pr.moveTo(-L / 2, y0); pr.lineTo(L / 2 - 0.1, y0); pr.quadraticCurveTo(L / 2, y0, L / 2, y0 + 0.2); pr.lineTo(L / 2, 1.25);
    pr.lineTo(L / 2 - 0.22, y1 - 0.3); pr.quadraticCurveTo(L / 2 - 0.3, y1, L / 2 - 0.75, y1); pr.lineTo(-L / 2 + 0.4, y1);
    pr.quadraticCurveTo(-L / 2, y1, -L / 2, y1 - 0.35); pr.lineTo(-L / 2, y0);
    var gc = K.garder(new THREE.ExtrudeGeometry(pr, { depth: Wb, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2, curveSegments: 8 }));
    gc.translate(0, 0, -Wb / 2);
    var caisse = new THREE.Mesh(gc, mCaisse); caisse.castShadow = true; caisse.receiveShadow = true; g.add(caisse);
    // le givre, sur le toit : une couche blanche, à peine
    var mGivre = K.garder(new THREE.MeshStandardMaterial({ color: "#dfe6ee", roughness: 0.95, transparent: true, opacity: 0.55 }));
    P.boite(g, L - 1.0, 0.01, Wb - 0.1, mGivre, -0.3, y1 + 0.045, 0, { ombre: false });
    [-1, 1].forEach(function (s) {
      var v = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(L - 1.6, 1.25)), mVitre); v.position.set(-0.45, 2.3, s * (Wb / 2 + 0.045)); v.rotation.y = s > 0 ? 0 : PI; g.add(v);
      for (var m = 0; m < 9; m++) P.boite(g, 0.08, 1.3, 0.02, mNoir, -L / 2 + 0.9 + m * 1.27, 2.3, s * (Wb / 2 + 0.05), { ombre: false });
      P.boite(g, L - 0.4, 0.42, 0.02, mBlanc, 0, 0.82, s * (Wb / 2 + 0.05), { ombre: false });
    });
    // le pare-brise, incliné : la vitre, la banderole derrière, et devant, le givre (une
    // toile de cristaux, plus épaisse dans les coins, que les essuie-glaces n'ont pas touchée)
    var nPB = new THREE.Vector3(0.993, 0.115, 0);
    var pb = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(Wb - 0.16, 1.9)), mVitre);
    pb.position.set(L / 2 - 0.11 + nPB.x * 0.03, 2.2 + nPB.y * 0.03, 0); pb.rotation.y = PI / 2; pb.rotateX(-0.115); g.add(pb);
    var tb = K.tex.texte({ lignes: ["MONDIAL"], fond: "#d8d2c2", encre: COBALT, largeur: 1024, hauteur: 220, graisse: "700", graine: "banderole" });
    var mBan = K.garder(new THREE.MeshStandardMaterial({ map: tb.map, roughness: 0.9, side: THREE.DoubleSide }));
    var gBan = new THREE.PlaneGeometry(Wb - 0.35, 0.42, 12, 1), pB = gBan.attributes.position;
    for (var i = 0; i < pB.count; i++) { var u = pB.getX(i) / ((Wb - 0.35) / 2); pB.setY(i, pB.getY(i) - (1 - u * u) * 0.05); pB.setZ(i, (1 - u * u) * 0.02); }
    gBan.computeVertexNormals(); K.garder(gBan);
    var ban = new THREE.Mesh(gBan, mBan); ban.position.set(L / 2 - 0.11 - 0.065 + nPB.x * 0.045, 2.72 + nPB.y * 0.045, 0); ban.rotation.y = PI / 2; ban.rotateX(-0.115); g.add(ban);
    var Wg = Math.round(512 * Math.max(0.5, K.qualiteTextures)), Hg = Math.round(Wg * 0.8), gcv = K.tex.canvas(Wg, Hg), gx = gcv.getContext("2d"), kk = Wg / 512;
    gx.clearRect(0, 0, Wg, Hg);
    for (var j = 0; j < 2600; j++) {
      var fx = K.h01(j, 41), fy = K.h01(j, 43), bord = Math.max(Math.abs(fx - 0.5), Math.abs(fy - 0.45) * 1.2) * 2;
      // les essuie-glaces ont dégagé deux éventails : le givre y est mince
      var ev = Math.min(Math.hypot(fx - 0.3, fy - 1.0), Math.hypot(fx - 0.72, fy - 1.0));
      var a = (0.08 + 0.5 * Math.pow(bord, 2.2)) * (ev < 0.62 ? 0.35 : 1);
      var lo = (2 + K.h01(j, 47) * 7) * kk, an = K.h01(j, 49) * PI;
      gx.strokeStyle = "rgba(225,235,245," + a.toFixed(3) + ")"; gx.lineWidth = 0.9 * kk;
      gx.beginPath(); gx.moveTo(fx * Wg - Math.cos(an) * lo, fy * Hg - Math.sin(an) * lo); gx.lineTo(fx * Wg + Math.cos(an) * lo, fy * Hg + Math.sin(an) * lo); gx.stroke();
    }
    var mGv = K.garder(new THREE.MeshStandardMaterial({ map: K.tex.texture(gcv, { clamp: true }), transparent: true, depthWrite: false, roughness: 0.9, color: "#ffffff" }));
    var givre = new THREE.Mesh(pb.geometry, mGv); givre.position.set(L / 2 - 0.11 + nPB.x * 0.075, 2.2 + nPB.y * 0.075, 0); givre.rotation.copy(pb.rotation); g.add(givre);
    var la = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(Wb - 0.3, 0.9)), mVitre); la.position.set(-L / 2 - 0.045, 2.6, 0); la.rotation.y = -PI / 2; g.add(la);
    var tl = K.tex.texte({ lignes: ["AUTOCARS DE VALDORNE"], fond: "#00000000", encre: "#c9c6bd", largeur: 1024, hauteur: 96, graine: "loueur" });
    var mL = K.garder(new THREE.MeshStandardMaterial({ map: tl.map, transparent: true, roughness: 0.6 }));
    [-1, 1].forEach(function (s) { var e = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(3.4, 0.32)), mL); e.position.set(1.6, 0.78, s * (Wb / 2 + 0.06)); e.rotation.y = s > 0 ? 0 : PI; g.add(e); });
    [[4.1, 1], [4.1, -1], [-2.9, 1], [-2.9, -1], [-4.2, 1], [-4.2, -1]].forEach(function (p) {
      P.cylindre(g, 0.5, 0.5, 0.3, mNoir, p[0], 0.5, p[1] * (Wb / 2 - 0.1), { rx: PI / 2, cotes: 18 });
      P.cylindre(g, 0.28, 0.28, 0.31, K.mat.metal({ couleur: "#8f9498", rugosite: 0.3 }), p[0], 0.5, p[1] * (Wb / 2 - 0.1), { rx: PI / 2, cotes: 14 });
    });
    P.boite(g, 0.06, 0.18, 0.5, mBlanc, L / 2 + 0.02, 0.85, 0.85, { ombre: false }); P.boite(g, 0.06, 0.18, 0.5, mBlanc, L / 2 + 0.02, 0.85, -0.85, { ombre: false });
    var tPl = K.tex.texte({ lignes: ["DK-412-RV"], fond: "#e8e5da", encre: "#111", largeur: 512, hauteur: 112 });
    var pl = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.52, 0.11)), K.garder(new THREE.MeshStandardMaterial({ map: tPl.map, roughness: 0.5 }))); pl.position.set(L / 2 + 0.05, 0.62, 0); pl.rotation.y = PI / 2; g.add(pl);
    return g;
  }

  // ─── LE TERRAIN ANNEXE, en novembre : l'herbe blanche de givre ─────────────────
  function terrainAnnexe(K, ctx, g) {
    var THREE = ctx.THREE, P = K.props, T = TERRAIN, zc = (T.z0 + T.z1) / 2, xc = (T.x0 + T.x1) / 2;
    var mH = K.mat.pelouse({ bandes: 6, boue: 0.4, graine: "annexe-givre", repete: [3, 2] });
    mH.color = new THREE.Color("#c4cbc4"); mH.roughness = 0.9;
    var herbe = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(66, 50)), mH); herbe.rotation.x = -PI / 2; herbe.position.set(53, 0.01, -20); herbe.receiveShadow = true; g.add(herbe);
    var mLi = K.garder(new THREE.MeshStandardMaterial({ color: "#e4dfcc", roughness: 0.75, transparent: true, opacity: 0.85 }));
    var lg = [[xc, T.z0, T.x1 - T.x0, 0.12], [xc, T.z1, T.x1 - T.x0, 0.12], [T.x0, zc, 0.12, T.z1 - T.z0], [T.x1, zc, 0.12, T.z1 - T.z0], [xc, zc, 0.12, T.z1 - T.z0]].map(function (l) {
      return new THREE.PlaneGeometry(l[2], l[3]).rotateX(-PI / 2).translate(l[0], 0.02, l[1]).toNonIndexed();
    });
    lg.push(new THREE.RingGeometry(0.94, 1.06, 18, 1, 0, PI / 2).rotateX(-PI / 2).translate(T.x0, 0.02, T.z1).toNonIndexed());
    var lignes = new THREE.Mesh(K.gens.fusion(lg), mLi); K.garder(lignes.geometry); g.add(lignes);
    var mBut = K.garder(new THREE.MeshStandardMaterial({ color: "#d8d6cc", roughness: 0.4 }));
    [T.x0, T.x1].forEach(function (bx) {
      P.cylindre(g, 0.06, 0.06, 2.44, mBut, bx, 1.22, zc - 3.66); P.cylindre(g, 0.06, 0.06, 2.44, mBut, bx, 1.22, zc + 3.66);
      P.cylindre(g, 0.06, 0.06, 7.44, mBut, bx, 2.44, zc, { rx: PI / 2 });
    });
    // le piquet du coin, sans drapeau, le givre sur son côté nord
    P.cylindre(g, 0.035, 0.035, 1.5, K.garder(new THREE.MeshStandardMaterial({ color: "#e6e1cf", roughness: 0.45 })), T.x0, 0.75, T.z1, { cotes: 8 });
    var gr = P.grillage({ longueur: 50, hauteur: 2.2 }); gr.rotation.y = PI / 2; gr.position.set(20.6, 0, -20); g.add(gr);
    var mHaie = K.garder(new THREE.MeshStandardMaterial({ color: "#101b13", roughness: 1, bumpMap: K.tex.tissu({ fils: 24 }).relief, bumpScale: 3 }));
    P.boite(g, 66, 3.4, 1.6, mHaie, 53, 1.7, -46); P.boite(g, 1.6, 3.6, 50, mHaie, 86.5, 1.8, -20);
    var lampe = P.reverbere({ hauteur: 7, bras: 1.5, intensite: 170, gresille: 0.6, forceCone: 0.26 });
    lampe.position.set(22.6, 0, 0.6); lampe.rotation.y = 0.7; g.add(lampe);
    // un faisceau plus serré : la flaque sur le coin, pas sur la façade
    lampe.lumiere.angle = 0.78;
    var loin = P.reverbere({ hauteur: 7, bras: 1.5, intensite: 150, gresille: 0.2, forceCone: 0.24 });
    loin.position.set(49, 0, 0.2); loin.rotation.y = PI / 2; g.add(loin);
    return { lampe: lampe, loin: loin };
  }

  // ─── LE DEHORS : le terrain annexe, l'hôtel, le parking, le bus ─────────────────
  function dehors(K, ctx) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: { zenith: "#03060e", horizon: "#1a2440", lueur: "#2e2018", lueurDir: [-0.4, 1], force: 0.7 }, brouillard: ["#1d2536", 0.032],
      environnement: { fenetres: 0 }, reflets: 0.3, ambiance: ["#33405f", "#0a0806", 0.26] });
    // le sol : l'asphalte du parking, humide ; ses lignes ; le trottoir de l'hôtel
    var mA = K.mat.asphalte({ flaques: 0.35, graine: "parking-rive-nuit", reprise: false, ligne: false });
    ["map", "roughnessMap", "bumpMap"].forEach(function (k) { mA[k].repeat.set(6, 6); });
    mA.envMapIntensity = 1.5;
    var sol = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(44, 40)), mA); sol.rotation.x = -PI / 2; sol.position.set(0, 0, 18); sol.receiveShadow = true; s.add(sol);
    var sol2 = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(10, 30)), mA); sol2.rotation.x = -PI / 2; sol2.position.set(17, 0.005, -8); s.add(sol2);
    var mLigne = K.garder(new THREE.MeshStandardMaterial({ color: "#bdb8a6", roughness: 0.7, transparent: true, opacity: 0.55 }));
    var lg = [];
    for (var i = 0; i < 9; i++) lg.push(new THREE.PlaneGeometry(0.12, 5).translate(-12 + i * 3, 0, 0).toNonIndexed());
    for (var j = 0; j < 9; j++) lg.push(new THREE.PlaneGeometry(0.12, 5).translate(-12 + j * 3, 0, 9).toNonIndexed());
    var lignes = new THREE.Mesh(K.gens.fusion(lg), mLigne); K.garder(lignes.geometry); lignes.rotation.x = -PI / 2; lignes.position.set(0, 0.012, 4.5); s.add(lignes);
    P.boite(s, 30, 0.14, 1.6, K.mat.beton({ couleur: "#57534c", graine: "trottoir-hotel", banches: 0 }), 0, 0.07, 0.8);
    var H = hotel(K, ctx); s.add(H.groupe);
    var b = bus(K, ctx); b.position.set(-1.5, 0, 12.5); b.rotation.y = 0.2; s.add(b);
    var v = P.voiture({ couleur: "#3a3f45", plaque: "BR-905-EX" }); v.position.set(-11, 0, 6.5); v.rotation.y = -PI / 2; s.add(v);
    // l'un au-dessus du bus (son toit), l'autre devant son nez : le givre du pare-brise, MONDIAL derrière
    var lamps = [[0.6, 0, 16.2, true, PI * 0.5], [8.6, 0, 8.8, false, -2.61]].map(function (p, k) {
      var r = P.reverbere({ hauteur: 6.8, bras: 1.6, intensite: k ? 110 : 150, ombre: p[3], gresille: k ? 1 : 0.2, forceCone: k ? 0.1 : 0.2 });
      r.position.set(p[0], 0, p[2]); r.rotation.y = p[4]; s.add(r);
      return r;
    });
    // la nuit : une lumière froide, haute, à peine (elle dessine les toits et le givre)
    var lune = new THREE.DirectionalLight("#7088c0", 0.22); lune.position.set(-20, 30, 10); s.add(lune); s.add(lune.target);
    // ce que le lampadaire du coin renvoie sur le flanc de l'hôtel : la 12 éteinte reste une fenêtre
    var flanc = K.look.projecteur({ couleur: "#FFA65A", intensite: 22, angle: 0.5, penombre: 0.9, ombre: false, loin: 20 });
    flanc.position.set(21.5, 4.5, -2.0); s.add(flanc);
    var cFl = new THREE.Object3D(); cFl.position.set(14, 7.6, -5.0); s.add(cFl); flanc.target = cFl;
    var T = terrainAnnexe(K, ctx, s);
    // la brume au ras de l'herbe (le terrain), et sur le parking : des bancs qui dérivent
    var lumB = [
      { pos: T.lampe.positionLampe(), couleur: "#FF9A3D", intensite: 0.22, rayon: 7 },
      { pos: T.loin.positionLampe(), couleur: "#FF9A3D", intensite: 0.3, rayon: 8 },
      { pos: lamps[0].positionLampe(), couleur: "#FF9A3D", intensite: 0.25, rayon: 7 },
      { pos: [HOTEL.W / 2 + 0.9, F12.y, F12.z], couleur: "#FFC27A", intensite: 0.0, rayon: 6 }
    ];
    var brume = K.particules.fumee({ n: 60, source: [40, 0.1, -14], vent: [0.22, 0.06], montee: 0.02, etalement: 32, vie: 34, taille: 4.2, couleur: "#3a4253", lueur: "#3a4253", opacite: 0.05, lumieres: lumB, graine: "brume-terrain" });
    s.add(brume);
    var brume2 = K.particules.fumee({ n: 36, source: [-2, 0.1, 14], vent: [0.18, 0.05], montee: 0.02, etalement: 22, vie: 34, taille: 4, couleur: "#3a4253", lueur: "#3a4253", opacite: 0.06, lumieres: lumB, graine: "brume-parking" });
    s.add(brume2);
    var reflets = [
      K.look.reflet({ pos: lamps[0].positionLampe(), couleur: "#FF9A3D", intensite: 0.7, largeur: 0.9, longueur: 7 }),
      K.look.reflet({ pos: lamps[1].positionLampe(), couleur: "#FF9A3D", intensite: 0.5, largeur: 0.8, longueur: 7 }),
      K.look.reflet({ pos: [7, 0, 0.4], sol: 0.0, couleur: "#FFB46A", intensite: 0.0, largeur: 1.4, longueur: 6 }),
      K.look.reflet({ pos: [-1, 0, 0.4], sol: 0.0, couleur: "#FFB46A", intensite: 0.0, largeur: 2.2, longueur: 6 })
    ];
    reflets.forEach(function (r) { s.add(r); });
    return {
      scene: s, bus: b, hotel: H,
      look: { bloom: 0.8, rayon: 0.6, seuil: 0.82, exposition: 1.3, contraste: 1.14, saturation: 0.88 },
      maj: function (t, c) {
        var plan = c.indice, tout = plan == null;
        // la 12 : allumée jusqu'aux trois coups, puis éteinte (un interrupteur : un dixième de seconde)
        var k12 = 1 - K.lisse(NOIR12, NOIR12 + 0.1, t);
        H.douze(k12);
        brume.materiau.uniforms.uLumCoul.value[3].set("#FFC27A").multiplyScalar(0.9 * k12);
        // le hall, à 3 h 50 (le plan 5 et le dernier)
        H.hall(tout ? HALL[HALL.length - 1] + 1 : t);
        var kH = K.borne((t - HALL[0]) * 0.8, 0, 1);
        reflets[2].maj(c.camera, 0.8 * kH); reflets[3].maj(c.camera, 0.6 * kH);
        reflets[0].maj(c.camera, 1); reflets[1].maj(c.camera, 1);
        lamps.forEach(function (l) { l.maj(t); }); T.lampe.maj(t); T.loin.maj(t);
        // au pied du lampadaire (les plans 1 et 6), son cône passerait devant tout : on le retire
        if (plan === 0 || plan === 5) T.lampe.cone.maj(t, 0);
        flanc.intensity = plan === 3 ? 110 : 22;
        brume.maj(t, c.camera); brume2.maj(t, c.camera);
      }
    };
  }

  // ─── LA RÉCEPTION, la nuit ─────────────────────────────────────────────────────
  // le mur du fond en z = 0 (il regarde +z) : le tableau des clés, l'horloge ; le comptoir
  // devant (sa façade en z = 1,8) ; entre les deux, le fauteuil de Sandrine ; à droite, le
  // mur du standard (x = 2,3, il regarde -x) ; à gauche, hors champ, l'escalier des chambres.
  function hall(K, ctx) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: false, fond: "#020203", environnement: { zenith: "#06060a", horizon: "#1c120c", lueur: "#2a140c", fenetres: 0,
      lampes: [{ pos: [0, 20, 30], couleur: "#FFD49A", intensite: 3, taille: 6 }, { pos: [-30, 6, 20], couleur: "#7f95c8", intensite: 1.5, taille: 8 }] }, reflets: 0.7,
      ambiance: ["#28304a", "#0c0705", 0.34], brouillard: ["#070505", 0.04] });
    var mMur = K.mat.papier({ couleur: "#6e5a40", graine: "papier-hall", repete: [3, 3] });
    var mur = new THREE.Mesh(P.planUV(8, 4, 1.2), mMur); mur.position.set(0, 2, 0); mur.receiveShadow = true; s.add(mur);
    var murD = new THREE.Mesh(P.planUV(6, 4, 1.2), mMur); murD.rotation.y = -PI / 2; murD.position.set(2.3, 2, 2); s.add(murD);
    var mLambris = K.mat.bois({ couleur: "#3a2416", lames: 8, graine: "lambris-hall", cire: true });
    P.boite(s, 8, 1.05, 0.04, mLambris, 0, 0.52, 0.02);
    P.boite(s, 0.04, 1.05, 6, mLambris, 2.28, 0.52, 2);
    var mSol = K.mat.bois({ couleur: "#2a1a10", lames: 10, graine: "parquet-hall", cire: true, repete: [3, 3] });
    var sol = new THREE.Mesh(P.planUV(8, 8, 1.5), mSol); sol.rotation.x = -PI / 2; sol.position.set(0, 0, 3); s.add(sol);
    // le tableau, les vingt-six doubles à leur place
    var mPl = K.mat.bois({ couleur: "#2e1c0e", lames: 3, graine: "tableau-cles", cire: true });
    P.boite(s, 2.02, 0.98, 0.04, mPl, 0, 1.72, 0.03);
    var mMoul = K.mat.bois({ couleur: "#2a180c", lames: 1, graine: "moulure" });
    P.boite(s, 2.12, 0.05, 0.06, mMoul, 0, 2.23, 0.04); P.boite(s, 2.12, 0.05, 0.06, mMoul, 0, 1.21, 0.04);
    P.boite(s, 0.05, 1.06, 0.06, mMoul, -1.04, 1.72, 0.04); P.boite(s, 0.05, 1.06, 0.06, mMoul, 1.04, 1.72, 0.04);
    var mLaiton = K.garder(new THREE.MeshStandardMaterial({ color: "#a57c38", roughness: 0.5, metalness: 0.85, envMapIntensity: 1.3 }));
    var mAcier = K.garder(new THREE.MeshStandardMaterial({ color: "#8d887e", roughness: 0.38, metalness: 0.85 }));
    var gCro = K.gens.fusion([new THREE.CylinderGeometry(0.006, 0.006, 0.05, 6).rotateX(PI / 2).translate(0, 0, 0.025).toNonIndexed(), new THREE.CylinderGeometry(0.006, 0.006, 0.02, 6).translate(0, 0.008, 0.05).toNonIndexed()]);
    gCro.computeVertexNormals(); K.garder(gCro);
    var gCle = K.gens.fusion([new THREE.TorusGeometry(0.011, 0.0014, 6, 18).toNonIndexed().translate(0, -0.011, 0),
      new THREE.TorusGeometry(0.008, 0.0022, 6, 14).toNonIndexed().translate(-0.012, -0.03, -0.002),
      new THREE.BoxGeometry(0.0045, 0.05, 0.003).translate(-0.012, -0.063, -0.002).toNonIndexed(),
      new THREE.BoxGeometry(0.011, 0.007, 0.003).translate(-0.007, -0.083, -0.002).toNonIndexed()]);
    gCle.computeVertexNormals(); K.garder(gCle);
    var gPla = new THREE.CylinderGeometry(0.03, 0.03, 0.006, 24).rotateX(PI / 2); gPla.scale(1, 1.35, 1); gPla.translate(0.008, -0.078, 0.004); K.garder(gPla);
    var crochets = new THREE.InstancedMesh(gCro, mLaiton, 26), clesM = new THREE.InstancedMesh(gCle, mAcier, 26), plaques = new THREE.InstancedMesh(gPla, mLaiton, 26);
    var d = new THREE.Object3D();
    for (var n = 0; n < 26; n++) {
      var rg = Math.floor(n / 9), col = n % 9, x = -0.8 + col * 0.2, y = 2.05 - rg * 0.3;
      d.position.set(x, y, 0.05); d.rotation.set(0, 0, 0); d.updateMatrix(); crochets.setMatrixAt(n, d.matrix);
      d.position.set(x, y - 0.004, 0.09); d.rotation.set(0.1, 0, (K.h01(n, 5) - 0.5) * 0.03); d.updateMatrix();
      clesM.setMatrixAt(n, d.matrix); plaques.setMatrixAt(n, d.matrix);
    }
    s.add(crochets); s.add(clesM); s.add(plaques);
    // l'horloge, au-dessus du tableau : 2 h 38 (la trotteuse tourne)
    var hc = K.tex.canvas(256, 256), hx = hc.getContext("2d");
    hx.fillStyle = "#e9e1cc"; hx.beginPath(); hx.arc(128, 128, 124, 0, 7); hx.fill();
    hx.strokeStyle = "#1a1612"; hx.lineWidth = 6; hx.beginPath(); hx.arc(128, 128, 121, 0, 7); hx.stroke();
    for (var q = 0; q < 60; q++) {
      var an = q / 60 * PI * 2, r0 = q % 5 ? 110 : 98;
      hx.lineWidth = q % 5 ? 2 : 6; hx.beginPath(); hx.moveTo(128 + Math.sin(an) * r0, 128 - Math.cos(an) * r0); hx.lineTo(128 + Math.sin(an) * 116, 128 - Math.cos(an) * 116); hx.stroke();
    }
    hx.fillStyle = "#1a1612"; hx.font = "700 30px 'Space Mono','DejaVu Sans Mono',monospace"; hx.textAlign = "center"; hx.textBaseline = "middle";
    [[12, 0], [3, 1], [6, 2], [9, 3]].forEach(function (h) { var a2 = h[1] * PI / 2; hx.fillText(String(h[0]), 128 + Math.sin(a2) * 78, 130 - Math.cos(a2) * 78); });
    var horloge = new THREE.Group(); horloge.position.set(2.27, 2.36, 0.75); horloge.rotation.y = -PI / 2; s.add(horloge);
    P.cylindre(horloge, 0.2, 0.2, 0.05, K.mat.metal({ couleur: "#2a2620", rugosite: 0.4 }), 0, 0, 0.025, { rx: PI / 2, cotes: 32 });
    var cad = new THREE.Mesh(K.garder(new THREE.CircleGeometry(0.185, 40)), K.garder(new THREE.MeshStandardMaterial({ map: K.tex.texture(hc, { clamp: true }), roughness: 0.5 })));
    cad.position.z = 0.052; horloge.add(cad);
    var mAig = K.garder(new THREE.MeshStandardMaterial({ color: "#14110e", roughness: 0.5 }));
    function aiguille(lo, la2, ang, z) {
      var p = new THREE.Group(); p.position.z = z; horloge.add(p);
      var m = new THREE.Mesh(K.garder(new THREE.BoxGeometry(la2, lo, 0.004).translate(0, lo / 2 - 0.02, 0)), mAig); p.add(m);
      p.rotation.z = -ang; return p;
    }
    aiguille(0.1, 0.012, (2 + 38 / 60) / 12 * PI * 2, 0.056);
    aiguille(0.15, 0.008, 38 / 60 * PI * 2, 0.06);
    var trot = aiguille(0.16, 0.003, 0, 0.064); trot.children[0].material = K.garder(new THREE.MeshStandardMaterial({ color: "#8a1a14", roughness: 0.5 }));
    // le comptoir : la façade, le plateau ; dessus le cahier fermé, le stylo, la lampe verte,
    // la sonnette, le registre fermé
    var mBu = K.mat.bois({ couleur: "#3b2414", lames: 5, graine: "comptoir-reception", cire: true });
    P.boite(s, 3.4, 1.05, 0.05, mBu, 0.2, 0.525, 1.8); P.boite(s, 3.5, 0.05, 0.64, mBu, 0.2, 1.075, 1.5);
    P.boite(s, 0.05, 1.05, 0.6, mBu, -1.5, 0.525, 1.5);
    // le cahier de nuit, fermé (sa couverture de toile bleue), le stylo posé dessus : ce soir,
    // on ne le lit pas
    var mCouv = K.garder(new THREE.MeshStandardMaterial({ color: "#22305a", roughness: 0.85, bumpMap: K.tex.tissu({ fils: 48 }).relief, bumpScale: 0.4 }));
    P.boite(s, 0.23, 0.018, 0.31, mCouv, 0.05, 1.109, 1.42, { ry: -0.1 });
    P.boite(s, 0.226, 0.012, 0.302, K.garder(new THREE.MeshStandardMaterial({ color: "#e6dfcc", roughness: 0.9 })), 0.053, 1.109, 1.42, { ry: -0.1, ombre: false });
    P.cylindre(s, 0.0045, 0.0045, 0.14, K.garder(new THREE.MeshStandardMaterial({ color: "#1f3a8a", roughness: 0.3 })), 0.06, 1.124, 1.42, { rz: PI / 2, ry: 0.5, cotes: 6 });
    var mChrome = K.mat.metal({ couleur: "#c8ccd0", rugosite: 0.15 });
    var son = new THREE.Mesh(K.garder(new THREE.SphereGeometry(0.045, 18, 10, 0, PI * 2, 0, PI / 2)), mChrome); son.position.set(0.95, 1.1, 1.62); s.add(son);
    P.boite(s, 0.32, 0.05, 0.24, K.garder(new THREE.MeshStandardMaterial({ color: "#3a1a14", roughness: 0.6 })), -1.05, 1.125, 1.45, { ry: -0.2 });
    var lampe = new THREE.Group(); lampe.position.set(-0.55, 1.1, 1.35); s.add(lampe);
    P.cylindre(lampe, 0.07, 0.08, 0.025, mLaiton, 0, 0.012, 0); P.cylindre(lampe, 0.008, 0.008, 0.3, mLaiton, 0, 0.16, 0);
    P.cylindre(lampe, 0.05, 0.11, 0.1, K.garder(new THREE.MeshPhysicalMaterial({ color: "#1f5a32", roughness: 0.25, emissive: new THREE.Color("#0c3a1c"), emissiveIntensity: 0.9, side: THREE.DoubleSide })), 0, 0.32, 0, { ouvert: true, cotes: 18 });
    var lL = K.look.projecteur({ couleur: "#FFD49A", intensite: 2.2, angle: 1.1, penombre: 0.8, ombre: false });
    lL.position.set(-0.55, 1.38, 1.35); s.add(lL);
    var cL = new THREE.Object3D(); cL.position.set(0.0, 1.0, 1.4); s.add(cL); lL.target = cL;
    var hL = K.look.halo({ couleur: "#FFD49A", taille: 0.32, intensite: 0.9 }); hL.position.set(-0.55, 1.37, 1.35); s.add(hL);
    // le fauteuil de Sandrine, vide, tourné vers l'escalier ; son gilet sur le dossier
    var mCuir = K.garder(new THREE.MeshStandardMaterial({ color: "#2a1712", roughness: 0.55 }));
    var fauteuil = new THREE.Group(); fauteuil.position.set(0.85, 0, 0.6); fauteuil.rotation.y = -PI / 2 + 0.4; s.add(fauteuil);
    for (var b5 = 0; b5 < 5; b5++) { var br = P.boite(fauteuil, 0.04, 0.03, 0.3, mAcier, 0, 0.05, 0.13); br.position.set(Math.sin(b5 * 1.2566) * 0.14, 0.05, Math.cos(b5 * 1.2566) * 0.14); br.rotation.y = b5 * 1.2566; }
    P.cylindre(fauteuil, 0.025, 0.025, 0.4, mAcier, 0, 0.26, 0);
    var assise = new THREE.Mesh(K.garder(boiteRonde(THREE, 0.48, 0.1, 0.46, 0.04, 4)), mCuir); assise.position.y = 0.5; fauteuil.add(assise);
    var dossier = new THREE.Mesh(K.garder(boiteRonde(THREE, 0.46, 0.56, 0.08, 0.035, 4)), mCuir); dossier.position.set(0, 0.86, -0.22); dossier.rotation.x = -0.1; fauteuil.add(dossier);
    var gilet = new THREE.Mesh(K.garder(boiteRonde(THREE, 0.5, 0.3, 0.12, 0.05, 4)), K.garder(new THREE.MeshStandardMaterial({ color: "#5a2a2e", roughness: 0.95, bumpMap: K.tex.tissu({ fils: 40 }).relief, bumpScale: 0.6 })));
    gilet.position.set(0, 1.04, -0.23); gilet.rotation.x = -0.1; fauteuil.add(gilet);
    // LE STANDARD : un panneau de bois sur le mur de droite, quatre rangs de sept voyants et de
    // sept jacks ; trois cordons en boucle sur la tablette ; un seul voyant qui clignote
    var std = new THREE.Group(); std.position.set(2.27, 0, 0.75); std.rotation.y = -PI / 2; s.add(std);
    P.boite(std, 0.78, 0.82, 0.06, K.mat.peint({ couleur: "#231a14", rugosite: 0.45 }), 0, 1.45, 0.03);
    P.boite(std, 0.84, 0.88, 0.04, K.mat.bois({ couleur: "#3a2414", lames: 1, graine: "standard-cadre", cire: true }), 0, 1.45, 0.0);
    P.boite(std, 0.84, 0.04, 0.42, mBu, 0, 0.98, 0.21);
    var gVo = K.garder(new THREE.SphereGeometry(0.012, 10, 6, 0, PI * 2, 0, PI / 2).rotateX(PI / 2)), gJa = K.garder(new THREE.CylinderGeometry(0.011, 0.011, 0.012, 10).rotateX(PI / 2));
    var mVo = K.garder(new THREE.MeshStandardMaterial({ color: "#5a3a1c", roughness: 0.35, emissive: new THREE.Color("#3a1e08"), emissiveIntensity: 0.4 }));
    var mJa = K.garder(new THREE.MeshStandardMaterial({ color: "#050505", roughness: 0.6 }));
    var voy = new THREE.InstancedMesh(gVo, mVo, 28), jacks = new THREE.InstancedMesh(gJa, mJa, 28);
    var VX = function (c3) { return -0.27 + c3 * 0.09; }, VY = function (r3) { return 1.73 - r3 * 0.17; };
    for (var r3 = 0; r3 < 4; r3++) for (var c3 = 0; c3 < 7; c3++) {
      var k3 = r3 * 7 + c3;
      d.position.set(VX(c3), VY(r3), 0.062); d.rotation.set(0, 0, 0); d.updateMatrix(); voy.setMatrixAt(k3, d.matrix);
      d.position.set(VX(c3), VY(r3) - 0.06, 0.058); d.updateMatrix(); jacks.setMatrixAt(k3, d.matrix);
    }
    std.add(voy); std.add(jacks);
    // le voyant qui appelle (deuxième rang, quatrième colonne) : la ligne de la 15 ? On ne le dit pas.
    var mAppel = K.garder(new THREE.MeshBasicMaterial({ color: new THREE.Color("#FFB347"), toneMapped: false }));
    var appel = new THREE.Mesh(gVo, mAppel); appel.position.set(VX(3), VY(1), 0.064); std.add(appel);
    var hAppel = K.look.halo({ couleur: "#FFB347", taille: 0.1, intensite: 0 }); hAppel.position.set(VX(3), VY(1), 0.09); std.add(hAppel);
    var lAppel = K.look.ponctuelle({ couleur: "#FFB347", intensite: 0, portee: 1.2 }); lAppel.position.set(VX(3), VY(1), 0.2); std.add(lAppel);
    // les cordons : d'un jack à la tablette, et retour (une boucle qui pend)
    [[0, 2, 5, 3, "#7a1712"], [1, 0, 1, 5, "#141414"], [2, 6, 3, 1, "#3c4a2c"]].forEach(function (cd) {
      var a3 = new THREE.Vector3(VX(cd[1]), VY(cd[0]) - 0.06, 0.07), b3 = new THREE.Vector3(VX(cd[3]), VY(cd[2]) - 0.06, 0.07);
      var mid = a3.clone().add(b3).multiplyScalar(0.5); mid.y = 1.02; mid.z = 0.2;
      var crb = new THREE.CatmullRomCurve3([a3, new THREE.Vector3(a3.x, a3.y - 0.1, 0.12), mid, new THREE.Vector3(b3.x, b3.y - 0.1, 0.12), b3]);
      var m3 = new THREE.Mesh(K.garder(new THREE.TubeGeometry(crb, 24, 0.0045, 6)), K.garder(new THREE.MeshStandardMaterial({ color: cd[4], roughness: 0.6 })));
      std.add(m3);
      [a3, b3].forEach(function (pp) { P.cylindre(std, 0.008, 0.008, 0.035, mLaiton, pp.x, pp.y, pp.z - 0.005, { rx: PI / 2, cotes: 8 }); });
    });
    // la lumière de l'escalier, à gauche (quelqu'un l'a laissée allumée) ; un fil froid
    var lEsc = K.look.ponctuelle({ couleur: "#7f95c8", intensite: 6, portee: 8 }); lEsc.position.set(-2.4, 2.3, 0.7); s.add(lEsc);
    // la lampe du tableau : un bras de laiton au-dessus des crochets, elle fait luire les plaques
    var lTab = K.look.projecteur({ couleur: "#FFD49A", intensite: 2.4, angle: 0.8, penombre: 0.8, ombre: false, loin: 4 });
    lTab.position.set(0, 2.45, 0.35); s.add(lTab); var cTab = new THREE.Object3D(); cTab.position.set(0, 1.7, 0); s.add(cTab); lTab.target = cTab;
    P.boite(s, 0.5, 0.05, 0.08, mLaiton, 0, 2.42, 0.2);
    // la veilleuse du standard : une petite lampe au-dessus des voyants
    var lVeil = K.look.ponctuelle({ couleur: "#FFC27A", intensite: 0.7, portee: 2.2 }); lVeil.position.set(1.9, 2.05, 0.75); s.add(lVeil);
    var poussiere = K.particules.poussiere({ n: 260, zone: { min: [-1.0, 1.1, 1.0], max: [0.6, 1.9, 1.9] }, couleur: "#ffd7a0", opacite: 0.45, taille: 0.0035,
      lumieres: [{ pos: [-0.55, 1.38, 1.35], couleur: "#FFD49A", intensite: 1.4, rayon: 1.0 }] });
    s.add(poussiere);
    // les sonneries (deux fois deux) : le voyant s'allume avec la cloche
    var SON = [11.8, 14.6];
    function sonne(t) {
      for (var i = 0; i < SON.length; i++) {
        var dt = t - SON[i];
        if (dt >= 0 && dt < 1.2) return (dt < 0.42 || (dt > 0.62 && dt < 1.04)) ? 1 : 0.25;
      }
      return 0;
    }
    return {
      scene: s,
      look: { bloom: 0.65, rayon: 0.5, seuil: 0.88, exposition: 1.55, contraste: 1.16, saturation: 0.92 },
      maj: function (t) {
        var k = sonne(t);
        mAppel.color.set("#FFB347").multiplyScalar(0.12 + 2.2 * k); hAppel.intensite(0.9 * k); lAppel.intensity = 0.6 * k;
        trot.rotation.z = -((t + 7) % 60) / 60 * PI * 2;
        poussiere.maj(t);
        lL.intensity = 2.2 * (1 - 0.04 * Math.max(0, K.bruit1(t * 10, 13)));
      }
    };
  }

  FC.film({
    id: "la_troisieme_nuit",
    livre: "apres_fiasco",
    titre: "La troisième nuit",
    duree: 35.5,
    musique: "livre_h7",
    secours: "ville_nuit",
    couleur: ROSE,
    affiche: 8.6,
    habillage: { vignette: 0.6, grain: 0.08, ratioPaysage: 2.35, ratioPortrait: 0 },
    sortie: { noir: 1.5 },
    // le standard qui sonne dans le vide : deux fois deux sonneries
    sons: [[11.8, "sonnerie"], [14.6, "sonnerie"]],
    textes: [
      { sorte: "lieu", de: 0.9, a: 5.2, texte: "Aubérive, hôtel de la Rive", sous: "Novembre 2011 · la troisième nuit, 2 h 31" },
      { sorte: "lieu", de: 23.4, a: 27.9, texte: "Hôtel de la Rive", sous: "3 h 50" },
      { sorte: "titre", de: 30.4, a: 34.9, texte: "Aubérive · 2011", sous: "Chambre 12", entree: 0.2, sortie: 0.7 }
    ],
    montages: { court: [[0.4, 5.2], [5.9, 10.8], [11.6, 16.6], [17.1, 21.8], [23.0, 27.8], [29.2, 34.8]] },
    preparer: function (K, ctx) {
      return K.etapes(ctx, [
        function () { ctx.decors.dehors = dehors(K, ctx); },
        function () { ctx.decors.hall = hall(K, ctx); }
      ]);
    },
    plans: [
      // 1 · le piquet du coin, dans la brume ; on monte : l'hôtel, une seule fenêtre allumée
      { de: 0, a: 5.7, decor: "dehors", entree: "noir", transition: 1.4, fixe: 4.6,
        camera: { pos: K_cles([[0, [27.3, 1.65, 0.5]], [5.7, [27.7, 1.75, 0.7]]], "douce"), cible: K_cles([[0, [24.6, 0.05, -2.3]], [1.8, [24.5, 0.1, -2.4]], [4.0, [14, 7.9, -4.6]], [5.7, [14, 7.95, -4.6]]], "douce"),
          fov: K_cles([[0, 44], [5.7, 34]], "douce"), epaule: 0.05 },
        cadrage: { portrait: { x: K_cles([[0, 0], [5.7, -0.1]]) } } },
      // 2 · la 12, de loin, à travers la brume : l'ombre de quelqu'un d'assis
      { de: 5.7, a: 11.4, decor: "dehors", entree: "coupe", fixe: 3.0,
        camera: { pos: K_cles([[0, [31, 1.4, -7.2]], [5.7, [30.6, 1.45, -7.0]]], "lin"), cible: K_cles([[0, [14, 8.1, -4.5]], [5.7, [14, 8.2, -4.5]]], "douce"),
          fov: K_cles([[0, 15], [5.7, 12]], "douce"), epaule: 0.05 } },
      // 3 · la réception, vide : le standard qui sonne dans le vide
      { de: 11.4, a: 17.1, decor: "hall", entree: "coupe", fixe: 3.4,
        camera: { pos: K_cles([[0, [-1.35, 1.42, 0.6]], [5.7, [-0.4, 1.42, 0.64]]], "douce"), cible: K_cles([[0, [2.2, 1.35, 0.72]], [5.7, [2.2, 1.52, 0.75]]], "douce"),
          fov: K_cles([[0, 54], [5.7, 24]], "douce"), epaule: 0.06 } },
      // 4 · la 12, plus près : les trois coups, la lumière s'éteint
      { de: 17.1, a: 22.9, decor: "dehors", entree: "coupe", fixe: 3.4,
        camera: { pos: K_cles([[0, [29.6, 1.5, -6.4]], [5.8, [29.4, 1.52, -6.3]]], "lin"), cible: K_cles([[0, [14, 8.2, -4.5]], [5.8, [14, 8.25, -4.5]]], "douce"),
          fov: K_cles([[0, 14], [5.8, 11]], "douce"), epaule: 0.04 } },
      // 5 · 3 h 50 : le parking, le bus sous le givre ; le hall s'allume, lampe après lampe
      { de: 22.9, a: 28.6, decor: "dehors", entree: "coupe", fixe: 4.2,
        camera: { pos: K_cles([[0, [11.2, 1.4, 17.4]], [5.7, [10.6, 1.45, 16.6]]], "lin"), cible: K_cles([[0, [2.0, 2.0, 6.0]], [5.7, [1.8, 2.05, 6.0]]], "douce"),
          fov: K_cles([[0, 46], [5.7, 42]], "douce"), epaule: 0.06 },
        cadrage: { portrait: { x: K_cles([[0, -0.35], [5.7, -0.25]]) } } },
      // 6 · le terrain annexe, la brume ; la 12 noire, le hall allumé ; le titre
      { de: 28.6, a: 35.5, decor: "dehors", entree: "coupe", fixe: 5.2,
        camera: { pos: K_cles([[0, [27.6, 1.75, 0.7]], [6.9, [27.3, 1.65, 0.5]]], "lin"), cible: K_cles([[0, [14, 5.0, -4.8]], [1.4, [14, 5.0, -4.8]], [3.6, [24.6, 0.05, -2.3]], [6.9, [24.55, 0.05, -2.35]]], "douce"),
          fov: K_cles([[0, 56], [1.4, 56], [3.6, 44], [6.9, 42]], "douce"), epaule: 0.05 },
        cadrage: { portrait: { x: K_cles([[0, 0.1], [6.9, 0.05]]) } } }
    ]
  });

  // les aides de la trousse, lues quand le film tourne (la trousse est chargée avant le film)
  function K_() { return FC.kit; }
  function K_cles(p, a) { var f = null; return function (t) { if (!f) f = K_().cles(p, a); return f(t); }; }
})(typeof window !== "undefined" ? window : this);
