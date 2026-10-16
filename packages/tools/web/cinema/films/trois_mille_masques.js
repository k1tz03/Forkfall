/* ═══════════════════════════════════════════════════════════════════════════
   FILM DE RÉFÉRENCE — « Trois mille masques » (livre 1, « Trois mille visages »,
   1990, l'entraîneur promu ; la couleur du livre : #FF5A4E).

   La veille du premier match à la Rive. Ce que le film montre, et pourquoi :
     · la rue du Port, 23 h 40 : la presse des Cartonnages de la Rive tourne
       encore (content/ville/scenes_h1.yaml, « La presse de minuit » : c'est là,
       et pas dans la buvette, qu'on imprime les masques ; le carton qui attend
       sous la table de la buvette porte leur nom) ;
     · la presse : le cliché encré, la platine, la pile de sortie, une épreuve
       pendue sous l'ampoule — ton visage sort par quatre (le visage du héros de la carrière, art.js, imprimé
       noir sur blanc : « noir sur blanc », dit la carte de la présentation) ;
     · la cour : les masques sèchent sur une corde, sous une ampoule nue, la
       pluie au bord de la tôle. Gégé, hors champ, une ligne ;
     · la Nord, vide, mouillée ; les pylônes s'allument un à un ; des silhouettes
       déroulent un tifo ; puis, comme en rêve (l'intermède du livre : « le
       virage plein de ton visage »), trois mille masques se lèvent au coup de
       sifflet ;
     · l'escalier du club-house : la photo de 1974, le cinquième visage gratté
       jusqu'au carton (la neuvième marche, celle qui craque) ;
     · « Aubérive · 1990 ».
   Il se joue avant la carte de la présentation (en.h1.a1_presentation*, S0
   créneau 1), avant la scène jouée du vestiaire : la veille, puis le jour.
   Rien de ce qu'il montre ne devance le livre : le vestiaire ne sait pas ce qu'il y
   a sous les cartons ; le joueur, si.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var FC = global.FusibleCinema;
  var PI = Math.PI;
  var ROUGE = "#FF5A4E";

  // ─── LA RUE DU PORT, 23 H 40 ──────────────────────────────────────────────
  function rueDuPort(K, ctx) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: { zenith: "#02030a", horizon: "#0e1424", lueur: "#3a2416", lueurDir: [0, -1], force: 0.8 },
      brouillard: ["#080b16", 0.036], environnement: { fenetres: 30 }, reflets: 1.0, ambiance: ["#2a3550", "#0a0806", 0.16] });
    var rue = P.rue({ longueur: 70, largeur: 8, trottoir: 2.2, flaques: 0.48, graine: "port" }); rue.position.z = -18; s.add(rue);
    // les façades : à gauche l'atelier des Cartonnages, entre deux immeubles ; à droite trois immeubles
    var gauche = [
      { z: 5.5, w: 9, e: 3, g: "g1", b: "#5f2c22" },
      { z: -6, w: 10, e: 2, g: "atelier", b: "#6b3326", enseigne: { lignes: ["CARTONNAGES DE LA RIVE"], fond: "#1f1712", encre: "#E6DCC2", lumiere: 0.0 } },
      { z: -17, w: 9, e: 3, g: "g3", b: "#583026" }, { z: -28, w: 10, e: 4, g: "g4", b: "#64382a" }, { z: -39, w: 10, e: 3, g: "g5", b: "#5a2c24" }
    ];
    var droite = [{ z: 8, w: 10, e: 3, g: "d1", b: "#5c3226" }, { z: -4, w: 12, e: 4, g: "d2", b: "#6a3a2c" }, { z: -17, w: 10, e: 3, g: "d3", b: "#5e2e22" },
      { z: -29, w: 12, e: 4, g: "d4", b: "#61342a" }, { z: -41, w: 10, e: 3, g: "d5", b: "#5a2e24" }];
    gauche.forEach(function (f) {
      var fa = P.facade({ largeur: f.w, etages: f.e, graine: f.g, brique: f.b, enseigne: f.enseigne, vitrine: true, fenetres: { allumees: f.g === "atelier" ? 0.5 : 0.3 } });
      fa.rotation.y = PI / 2; fa.position.set(-6.2, 0, f.z); s.add(fa);
    });
    droite.forEach(function (f) {
      var fa = P.facade({ largeur: f.w, etages: f.e, graine: f.g, brique: f.b, vitrine: true, fenetres: { allumees: 0.28 } });
      fa.rotation.y = -PI / 2; fa.position.set(6.2, 0, f.z); s.add(fa);
    });
    var fond = P.facade({ largeur: 20, etages: 4, graine: "fond", brique: "#4e2a22", fenetres: { allumees: 0.25 } }); fond.position.set(0, 0, -50); s.add(fond);
    // la vitrine de l'atelier : la lumière chaude de dedans, la presse en ombre
    var vc = K.tex.canvas(512, 256), vx = vc.getContext("2d");
    var gv = vx.createRadialGradient(300, 40, 10, 300, 120, 300); gv.addColorStop(0, "#ffe2b0"); gv.addColorStop(0.45, "#e89a52"); gv.addColorStop(1, "#5a2c14");
    vx.fillStyle = gv; vx.fillRect(0, 0, 512, 256);
    // dedans, en ombre chinoise : la presse (son volant, son bâti), l'établi, les rames, l'ampoule
    vx.fillStyle = "rgba(14,8,5,0.94)"; vx.strokeStyle = "rgba(14,8,5,0.94)";
    vx.lineWidth = 7; vx.beginPath(); vx.arc(372, 168, 46, 0, 7); vx.stroke();
    for (var ry = 0; ry < 6; ry++) { var ra = ry / 6 * Math.PI; vx.beginPath(); vx.moveTo(372 - Math.cos(ra) * 44, 168 - Math.sin(ra) * 44); vx.lineTo(372 + Math.cos(ra) * 44, 168 + Math.sin(ra) * 44); vx.lineWidth = 3; vx.stroke(); }
    vx.beginPath(); vx.moveTo(250, 256); vx.lineTo(262, 150); vx.quadraticCurveTo(250, 110, 290, 80); vx.lineTo(330, 92); vx.lineTo(318, 140); vx.lineTo(340, 256); vx.fill();
    vx.fillRect(268, 70, 70, 10); vx.fillRect(40, 168, 150, 10); vx.fillRect(48, 178, 8, 78); vx.fillRect(176, 178, 8, 78);
    for (var rm = 0; rm < 4; rm++) vx.fillRect(56 + rm * 30, 150 - rm % 2 * 6, 24, 18 + rm % 2 * 6);
    vx.lineWidth = 1.5; vx.beginPath(); vx.moveTo(300, 0); vx.lineTo(300, 34); vx.stroke();
    vx.fillStyle = "rgba(255,240,210,1)"; vx.beginPath(); vx.arc(300, 40, 7, 0, 7); vx.fill();                                       // l'ampoule
    vx.fillStyle = "rgba(255,90,78,1)"; vx.beginPath(); vx.arc(352, 214, 4, 0, 7); vx.fill();                                          // le voyant rouge
    // les croisillons de la vitrine
    vx.fillStyle = "rgba(20,12,8,1)"; vx.fillRect(0, 118, 512, 6); vx.fillRect(170, 0, 6, 256); vx.fillRect(340, 0, 6, 256);
    var vitrine = new THREE.Mesh(new THREE.PlaneGeometry(5.3, 2.3), new THREE.MeshBasicMaterial({ map: K.tex.texture(vc, { clamp: true }), color: new THREE.Color(1, 1, 1).multiplyScalar(0.95), toneMapped: true }));
    K.garder(vitrine.geometry); K.garder(vitrine.material);
    vitrine.rotation.y = PI / 2; vitrine.position.set(-6.13, 1.5, -4.8); s.add(vitrine);
    // la vitre devant : elle reflète la rue (le ciel, les lampadaires), et la buée la voile en bas
    var vbc = K.tex.canvas(256, 128), vbx = vbc.getContext("2d"), vbg = vbx.createLinearGradient(0, 0, 0, 128);
    vbg.addColorStop(0, "#0d0d0d"); vbg.addColorStop(0.6, "#333"); vbg.addColorStop(1, "#8c8c8c");
    vbx.fillStyle = vbg; vbx.fillRect(0, 0, 256, 128);
    for (var vg = 0; vg < 70; vg++) { vbx.fillStyle = "rgba(255,255,255," + (0.15 + K.h01(vg, 41) * 0.3) + ")"; vbx.fillRect(K.h01(vg, 43) * 256, K.h01(vg, 47) * 90, 1.2, 10 + K.h01(vg, 53) * 40); }
    var verreV = new THREE.Mesh(new THREE.PlaneGeometry(5.3, 2.3), new THREE.MeshPhysicalMaterial({ color: "#1a1410", roughness: 0.06, metalness: 0, transparent: true, opacity: 0.32,
      alphaMap: K.tex.texture(vbc, { clamp: true, donnee: true }), envMapIntensity: 2.4, emissive: new THREE.Color("#ffb070"), emissiveIntensity: 0.12, depthWrite: false }));
    K.garder(verreV.geometry); K.garder(verreV.material);
    verreV.rotation.y = PI / 2; verreV.position.set(-6.08, 1.5, -4.8); s.add(verreV);
    // la porte ouverte : la lumière qui sort sur le trottoir mouillé
    var porteL = K.look.projecteur({ couleur: "#FFB46A", intensite: 38, angle: 0.75, penombre: 0.6, decroissance: 2, ombre: true, loin: 20, ombreTaille: 1024 });
    porteL.position.set(-6.9, 2.3, -9.0); s.add(porteL);
    var cp = new THREE.Object3D(); cp.position.set(-3.5, 0, -9.2); s.add(cp); porteL.target = cp;
    var tc = K.tex.canvas(64, 128), tcx = tc.getContext("2d"), gtc = tcx.createLinearGradient(0, 0, 0, 128);
    gtc.addColorStop(0, "#7a4a24"); gtc.addColorStop(0.5, "#e8a35a"); gtc.addColorStop(1, "#ffd59a");
    tcx.fillStyle = gtc; tcx.fillRect(0, 0, 64, 128); tcx.fillStyle = "rgba(20,10,4,0.85)"; tcx.fillRect(38, 40, 26, 88);
    var trou = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 2.25), new THREE.MeshBasicMaterial({ map: K.tex.texture(tc, { clamp: true }), color: new THREE.Color(1, 1, 1).multiplyScalar(1.15) }));
    K.garder(trou.geometry); K.garder(trou.material);
    trou.rotation.y = PI / 2; trou.position.set(-6.16, 1.13, -9.0); s.add(trou);
    var rougeL = K.look.ponctuelle({ couleur: ROUGE, intensite: 2.5, portee: 6 }); rougeL.position.set(-6.6, 1.2, -4.6); s.add(rougeL);
    // l'ouvrier qui fume sur le seuil, à contre-jour
    var ouvrier = K.gens.mannequin({ tenue: "blouson", couleur: "#2a2622", couleur2: "#1a1816", casquette: true, cigarette: true, graine: "ouvrier" });
    ouvrier.groupe.position.set(-5.65, 0.15, -9.45); ouvrier.groupe.rotation.y = PI / 2 + 0.5; s.add(ouvrier.groupe);
    var fumeeCig = K.particules.fumee({ n: 26, source: [-5.5, 1.7, -9.2], vent: [0.25, 0.1], montee: 0.35, vie: 5, taille: 0.22, etalement: 0.05, couleur: "#9a948c", lueur: "#c08a60", opacite: 0.32 });
    s.add(fumeeCig);
    // les lampadaires au sodium
    var lamps = [[5.0, -1], [5.0, -21], [-5.0, -31]].map(function (p, i) {
      var r = P.reverbere({ hauteur: 6.2, bras: 1.5, intensite: i ? 110 : 170, ombre: i === 0, gresille: i === 1 ? 1 : 0.2, forceCone: 0.1 });
      r.position.set(p[0], 0.15, p[1]); r.rotation.y = p[0] > 0 ? PI : 0; s.add(r);
      return r;
    });
    // la berline grise garée devant
    var auto = P.voiture({ couleur: "#2f343b", phares: 0, feux: 0.0, plaque: "8347 RV 12" }); auto.position.set(2.75, 0, -11.5); auto.rotation.y = PI / 2; s.add(auto);
    // la pluie, les ronds dans les flaques
    s.updateMatrixWorld(true);
    var lumPluie = [
      { pos: lamps[0].positionLampe(), couleur: "#FF9A3D", intensite: 1.4, rayon: 7 },
      { pos: [-6.5, 2.0, -9.0], couleur: "#FFB46A", intensite: 1.1, rayon: 4.5 },
      { pos: lamps[1].positionLampe(), couleur: "#FF9A3D", intensite: 1.2, rayon: 7 },
      { pos: [-6.0, 1.5, -4.8], couleur: "#FFC07A", intensite: 0.7, rayon: 4 }
    ];
    var pluie = K.particules.pluie({ n: 9000, zone: { min: [-10, -0.2, -15], max: [10, 9, 15] }, suivre: true, avance: 9, vitesse: [0.9, -10.5, 0.4], longueur: 0.5, largeur: 0.011, couleur: "#7f8fae", opacite: 0.9, lumieres: lumPluie });
    s.add(pluie);
    var ronds = K.particules.ronds({ n: 700, zone: { min: [-4, 0.0, -30], max: [4, 0, 6] }, periode: 0.55, rayon: 0.08, couleur: "#9aa6c0", opacite: 0.75, lumieres: lumPluie });
    s.add(ronds);
    // la chaussée mouillée reflète le ciel de la ville ; et les lumières y traînent
    rue.children[0].material.envMapIntensity = 2.0;
    var reflets = [
      K.look.reflet({ pos: lamps[0].positionLampe(), couleur: "#FF9A3D", intensite: 1.3, largeur: 0.9, longueur: 7 }),
      K.look.reflet({ pos: lamps[1].positionLampe(), couleur: "#FF9A3D", intensite: 1.0, largeur: 0.8, longueur: 7 }),
      K.look.reflet({ pos: [-5.9, 0, -9.0], sol: 0.15, couleur: "#FFB46A", intensite: 0.9, largeur: 0.8, longueur: 4.5 }),
      K.look.reflet({ pos: [-5.9, 0, -5.6], sol: 0.15, couleur: "#FFC07A", intensite: 0.7, largeur: 1.6, longueur: 5 }),
      K.look.reflet({ pos: [-5.9, 0, -3.6], sol: 0.15, couleur: "#FFC07A", intensite: 0.6, largeur: 1.4, longueur: 5 }),
      K.look.reflet({ pos: lamps[2].positionLampe(), couleur: "#FF9A3D", intensite: 0.8, largeur: 0.7, longueur: 6 })
    ];
    reflets.forEach(function (r) { s.add(r); });
    return {
      scene: s, look: { bloom: 0.8, rayon: 0.6, seuil: 0.85, exposition: 1.1, contraste: 1.16, saturation: 0.94 },
      maj: function (t, c) {
        pluie.maj(t, c.camera); ronds.maj(t);
        reflets.forEach(function (r, i) { r.maj(c.camera, i === 1 ? 1 - 0.08 * Math.max(0, K.bruit1(t * 9, 7)) : 1); });
        lamps.forEach(function (l) { l.maj(t); });
        ouvrier.fumer(t + 3);
        fumeeCig.maj(t);
        var bp = new THREE.Vector3(); if (ouvrier.os.braise) { ouvrier.os.braise.getWorldPosition(bp); fumeeCig.source([bp.x, bp.y + 0.02, bp.z]); }
        rougeL.intensity = 2.5 * (0.85 + 0.15 * Math.sin(t * 9));
      }
    };
  }

  // ─── L'ATELIER : LA PRESSE ─────────────────────────────────────────────────
  function atelier(K, ctx, tex) {
    var THREE = ctx.THREE, P = K.props;
    // dedans, l'environnement est noir : seule l'ampoule s'y reflète (dans l'encre, sur l'acier)
    var s = K.decor(ctx, { ciel: false, fond: "#020203", environnement: { zenith: "#030202", horizon: "#0a0604", lueur: "#140a04", fenetres: 0,
      lampes: [{ pos: [0, 60, -10], couleur: "#FFD49A", intensite: 8, taille: 5 }, { pos: [-40, 20, -60], couleur: "#ff9a3d", intensite: 2, taille: 8 }] }, reflets: 0.8,
      ambiance: ["#2c3448", "#140c06", 0.14], brouillard: ["#0d0907", 0.05] });
    var murs = K.mat.brique({ couleur: "#6d4636", graine: "atelier-murs", suie: 0.9, humide: 0.2, repete: [3, 2] });
    var sol = K.mat.beton({ couleur: "#3f3a34", graine: "atelier-sol", taches: 1.1, banches: 0, repete: [3, 3] });
    var piece = P.piece({ largeur: 7, profondeur: 6, hauteur: 3.4, murs: murs, sol: sol, plafond: K.mat.bois({ couleur: "#2a1c12", lames: 6, graine: "plafond" }), fenetre: { mur: "fond", x: -2.0, y: 1.9, w: 1.3, h: 1.1 } });
    s.add(piece);
    // dehors, derrière la vitre : la rue, une lueur de sodium et la pluie
    var dehors = new THREE.Mesh(new THREE.PlaneGeometry(4, 3), new THREE.MeshBasicMaterial({ color: new THREE.Color("#ff9a3d").multiplyScalar(0.5) }));
    K.garder(dehors.geometry); K.garder(dehors.material);
    dehors.position.set(-2.0, 1.9, -4.2); s.add(dehors);
    var pluieDehors = K.particules.pluie({ n: 900, zone: { min: [-3, 0.5, -4.1], max: [-1, 3.2, -3.1] }, vitesse: [0.4, -9, 0], longueur: 0.4, couleur: "#ffb070", opacite: 0.8 });
    s.add(pluieDehors);
    var vitre = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.1), new THREE.MeshPhysicalMaterial({ color: "#0d0f12", roughness: 0.08, transparent: true, opacity: 0.35, envMapIntensity: 1.2 }));
    K.garder(vitre.geometry); K.garder(vitre.material);
    vitre.position.set(-2.0, 1.9, -2.99); s.add(vitre);
    // la presse, l'établi, les piles de papier, une affiche
    var presse = P.presse({ periode: 1.7, feuille: tex.feuille, forme: tex.cliche, voyant: ROUGE, couleur: "#3a5247", depart: 15 });
    presse.position.set(0.2, 0, -0.8); s.add(presse);
    // le froid de la fenêtre : un contre-jour bleu qui dessine les arêtes de la presse
    var froid = K.look.projecteur({ couleur: "#6f86c8", intensite: 9, angle: 0.6, penombre: 0.8, decroissance: 2, ombre: false });
    froid.position.set(-2.0, 2.2, -3.4); s.add(froid);
    var cf = new THREE.Object3D(); cf.position.set(0.3, 1.0, -0.6); s.add(cf); froid.target = cf;
    // la baladeuse accrochée au bâti : une lumière dure, basse, sur l'encre et la platine
    var bal = K.look.projecteur({ couleur: "#FFC88A", intensite: 2.6, angle: 0.8, penombre: 0.5, decroissance: 2, ombre: false });
    bal.position.set(0.85, 1.75, -0.25); s.add(bal);
    var cb = new THREE.Object3D(); cb.position.set(0.2, 1.1, -0.85); s.add(cb); bal.target = cb;
    var balG = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 8), K.mat.lumiere({ couleur: "#FFE2B0", intensite: 6, toneMapped: false })); balG.position.copy(bal.position); s.add(balG); K.garder(balG.geometry);
    P.cylindre(s, 0.05, 0.07, 0.08, K.mat.metal({ couleur: "#2a2a2a", rugosite: 0.5 }), 0.86, 1.79, -0.24, { rx: 0.6 });
    var mBois = K.mat.bois({ couleur: "#4b3220", lames: 5, graine: "etabli" });
    P.boite(s, 2.2, 0.08, 0.8, mBois, -2.3, 0.9, -1.6); P.boite(s, 0.08, 0.9, 0.7, mBois, -3.3, 0.45, -1.6); P.boite(s, 0.08, 0.9, 0.7, mBois, -1.3, 0.45, -1.6);
    var mPap = K.mat.papier({ graine: "rames", couleur: "#ece5d3" });
    for (var i = 0; i < 5; i++) P.boite(s, 0.45, 0.12 + (i % 3) * 0.05, 0.32, mPap, -3.0 + i * 0.36, 0.98 + (0.06 + (i % 3) * 0.025), -1.65 + (i % 2) * 0.05);
    var mEncre = K.mat.metal({ couleur: "#2a2a2c", rugosite: 0.35 });
    [[-1.7, -1.4], [-1.55, -1.75], [-1.45, -1.45]].forEach(function (p) { P.cylindre(s, 0.09, 0.09, 0.14, mEncre, p[0], 1.01, p[1], { cotes: 16 }); });
    var aff = K.tex.texte({ lignes: ["RACING AUBÉRIVE", "SAISON 1990-1991", "SAMEDI À LA RIVE"], fond: "#E6DCC2", encre: "#7A1F2E", largeur: 512, hauteur: 700, graine: "affiche" });
    var mAff = new THREE.MeshStandardMaterial({ map: aff.map, roughness: 0.9 }); K.garder(mAff);
    var affiche = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.82), mAff); K.garder(affiche.geometry);
    affiche.position.set(1.6, 1.9, -2.98); affiche.rotation.z = 0.03; s.add(affiche);
    // l'ampoule nue au-dessus de la presse, et une deuxième, loin, sur l'établi
    var amp = P.ampoule({ fil: 1.0, intensite: 8, ombre: true, balancement: 0.05, graine: "atelier", halo: 0.32 });
    amp.position.set(0.1, 3.4, -0.45); s.add(amp);
    var amp2 = P.ampoule({ fil: 0.7, intensite: 5, ombre: false, balancement: 0.02, graine: "etabli", halo: 0.4 });
    amp2.position.set(-2.4, 3.4, -1.5); s.add(amp2);
    // une épreuve pendue à la ficelle de l'atelier, sous l'ampoule : elle sèche à contre-jour,
    // deux pinces de bois (la corde de la cour, déjà)
    var feuilleLevee = P.feuille({ texture: tex.feuille, largeur: 0.42, hauteur: 0.546, gondole: 1.4, courbe: 0.15 });
    var tenue = new THREE.Group(); tenue.add(feuilleLevee); s.add(tenue);
    var mPince = K.mat.bois({ couleur: "#a8835a", lames: 1, graine: "pince-atelier" });
    [-1, 1].forEach(function (sg) {
      // la pince mord le bord du haut : ses deux mâchoires de part et d'autre du papier (qui
      // se courbe d'un centimètre vers l'avant au bord), le ressort au-dessus
      var at = new THREE.Group(); at.position.set(sg * 0.16, 0.262, 0.011); at.rotation.z = sg * 0.04; tenue.add(at);
      P.boite(at, 0.013, 0.072, 0.008, mPince, 0, 0.012, 0.011); P.boite(at, 0.013, 0.072, 0.008, mPince, 0, 0.012, -0.011);
      P.cylindre(at, 0.0045, 0.0045, 0.03, K.mat.metal({ couleur: "#6d6a66", rugosite: 0.4 }), 0, 0.03, 0, { rx: PI / 2, cotes: 8 });
    });
    var ficelle = P.cylindre(s, 0.0022, 0.0022, 5, K.garder(new THREE.MeshStandardMaterial({ color: "#7b7364", roughness: 0.9 })), -0.55, 1.80 + 0.262 + 0.03, 0.14, { rz: PI / 2, cotes: 6 });
    var poussiere = K.particules.poussiere({ n: 900, zone: { min: [-1.2, 0.6, -1.8], max: [1.4, 2.8, 0.8] }, couleur: "#ffd7a0", opacite: 0.9, taille: 0.01,
      lumieres: [{ pos: [0.1, 2.3, -0.45], couleur: "#FFD49A", intensite: 2.4, rayon: 2.2 }] });
    s.add(poussiere);
    return {
      scene: s, presse: presse, tenue: tenue, feuille: feuilleLevee, ampoule: amp,
      look: { bloom: 0.75, rayon: 0.5, seuil: 0.85, exposition: 1.08, contraste: 1.12, saturation: 0.95 },
      maj: function (t, c) {
        presse.maj(t);
        amp.maj(t); amp2.maj(t, 0.8);
        pluieDehors.maj(t); poussiere.maj(t);
      }
    };
  }

  // ─── LA COUR : LES MASQUES QUI SÈCHENT ─────────────────────────────────────
  function cour(K, ctx, tex) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: { zenith: "#02040a", horizon: "#0e1424", lueur: "#3a2418", lueurDir: [0.3, -1] }, brouillard: ["#090d18", 0.05],
      environnement: { fenetres: 12 }, reflets: 0.8, ambiance: ["#26324c", "#080604", 0.14] });
    // le mur du fond, le sol mouillé, la tôle, les poteaux
    var mur = new THREE.Mesh(P.boiteUV(14, 5, 0.4, 2.4), K.mat.brique({ couleur: "#5d2e22", graine: "cour", suie: 1.0, humide: 1.0 }));
    mur.position.set(0, 2.5, -1.4); mur.receiveShadow = true; mur.castShadow = true; s.add(mur);
    var sol = new THREE.Mesh(P.planUV(16, 12, 4), K.mat.asphalte({ flaques: 0.6, graine: "cour-sol", reprise: false }));
    sol.rotation.x = -PI / 2; sol.position.set(0, 0, 3); sol.receiveShadow = true; s.add(sol);
    var mTole = new THREE.MeshStandardMaterial({ color: "#3a3e42", roughness: 0.5, metalness: 0.6, side: THREE.DoubleSide });
    K.garder(mTole);
    var tole = new THREE.Mesh(new THREE.PlaneGeometry(9, 2.8, 1, 1), mTole); K.garder(tole.geometry);
    tole.rotation.x = -PI / 2 + 0.13; tole.position.set(0, 2.75, 0.0); tole.castShadow = true; tole.receiveShadow = true; s.add(tole);
    var mPost = K.mat.rouille({ peinture: "#2b3133", part: 0.5 });
    [-4.2, 4.2].forEach(function (x) { P.cylindre(s, 0.05, 0.05, 2.6, mPost, x, 1.3, 1.25, { cotes: 8 }); });
    P.boite(s, 8.8, 0.08, 0.1, mPost, 0, 2.58, 1.27);
    // une gouttière qui déborde, une porte de fer, une caisse
    P.cylindre(s, 0.05, 0.05, 4.8, mPost, 3.6, 2.4, -1.15, { cotes: 8 });
    P.boite(s, 1.3, 2.3, 0.08, K.mat.rouille({ peinture: "#24302c", part: 0.45, graine: "porte-cour" }), -3.2, 1.15, -1.18);
    P.boite(s, 0.7, 0.5, 0.5, K.mat.bois({ couleur: "#3e2a1a", lames: 3, graine: "caisse" }), 2.4, 0.25, -0.6, { ry: 0.3 });
    // la corde, les masques (et deux feuilles entières, pas encore découpées)
    var objets = [];
    for (var i = 0; i < 15; i++) {
      if (i === 4 || i === 11) {
        var f = P.feuille({ texture: tex.feuille, largeur: 0.36, hauteur: 0.468, gondole: 2, courbe: -0.1 }); f.position.y = -0.24; objets.push(f);
      } else {
        var m = P.masque({ texture: tex.masque, largeur: 0.25, courbure: 0.55 }); m.position.y = -0.135; objets.push(m);
      }
    }
    var corde = P.cordeLinge({ de: [-4.1, 2.12, 0.35], a: [4.1, 2.12, 0.35], fleche: 0.16, objets: objets, vent: 1, graine: "corde", couleur: "#6d665a", epaisseur: 0.005 });
    s.add(corde);
    // l'ampoule nue, accrochée à la tôle, qui se balance
    var amp = P.ampoule({ fil: 0.16, intensite: 2.4, ombre: true, balancement: 0.16, graine: "cour", halo: 0.2, loin: 9 });
    amp.position.set(0.3, 2.74, 1.0); s.add(amp);
    // par-dessus le mur, la rue : un contre-jour froid qui détache les masques du fond
    var rue = K.look.projecteur({ couleur: "#7f95c8", intensite: 34, angle: 0.5, penombre: 0.9, decroissance: 2, ombre: false });
    rue.position.set(-5, 6.5, -6); s.add(rue);
    var cr = new THREE.Object3D(); cr.position.set(-1.5, 1.9, 0.4); s.add(cr); rue.target = cr;
    // le mur, derrière les masques, prend un peu de l'ampoule : les masques s'en détachent
    var mur2 = K.look.ponctuelle({ couleur: "#FFB46A", intensite: 1.4, portee: 4.5 }); mur2.position.set(0.3, 2.3, -0.9); s.add(mur2);
    // au loin, au-dessus du mur : la lueur d'un lampadaire, et la silhouette des pylônes de la Rive
    var lueur = K.look.halo({ couleur: "#FF9A3D", taille: 6, intensite: 0.5 }); lueur.position.set(-5, 6.5, -14); s.add(lueur);
    var mSil = new THREE.MeshBasicMaterial({ color: "#05070c" }); K.garder(mSil);
    [[-14, -60], [10, -64]].forEach(function (p) {
      var py = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 1.4, 34, 4), mSil); py.position.set(p[0], 17, p[1]); s.add(py); K.garder(py.geometry);
      var tt = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 0.6), mSil); tt.position.set(p[0], 35, p[1]); s.add(tt); K.garder(tt.geometry);
    });
    // la pluie devant la tôle, le rideau qui coule du bord, les ronds
    var lumC = [{ pos: [0.3, 2.45, 1.0], couleur: "#FFD49A", intensite: 2.0, rayon: 3.2 }];
    var pluie = K.particules.pluie({ n: 14000, zone: { min: [-5, -0.2, 1.3], max: [5, 4.2, 5.6] }, vitesse: [0.4, -10, 0.2], longueur: 0.34, largeur: 0.006, couleur: "#7888a8", opacite: 0.6, lumieres: lumC });
    s.add(pluie);
    var bord = []; for (var b = -4.3; b <= 4.3; b += 0.18) bord.push([b + K.h01(Math.round(b * 10), 4) * 0.06, 2.5, 1.32]);
    var rideau = K.particules.egouttures({ points: bord, parPoint: 2, chute: 2.5, vie: 1.1, couleur: "#a8b4cc", opacite: 1, lumieres: lumC });
    s.add(rideau);
    var gouttesMasques = null;
    var ronds = K.particules.ronds({ n: 500, zone: { min: [-6, 0.0, 1.3], max: [6, 0, 7] }, periode: 0.5, rayon: 0.07, couleur: "#9aa6c0", opacite: 0.8, lumieres: lumC });
    s.add(ronds);
    return {
      scene: s, corde: corde, ampoule: amp,
      look: { bloom: 0.7, rayon: 0.55, seuil: 0.9, exposition: 1.4, contraste: 1.14, saturation: 0.92 },
      maj: function (t, c) {
        corde.maj(t); amp.maj(t);
        pluie.maj(t); rideau.maj(t); ronds.maj(t);
        if (!gouttesMasques) {
          // les gouttes qui tombent du bas des masques (leur place se lit une fois posés)
          s.updateMatrixWorld(true);
          gouttesMasques = K.particules.egouttures({ points: corde.points().map(function (p) { return [p[0], p[1] - 0.3, p[2]]; }), parPoint: 1, chute: 2.0, vie: 2.6, couleur: "#a8b4cc", opacite: 0.9, lumieres: lumC });
          s.add(gouttesMasques);
        }
        gouttesMasques.maj(t);
      }
    };
  }

  // ─── LA RIVE : LA NORD, LES PYLÔNES, LE TIFO, LES TROIS MILLE ──────────────
  function stade(K, ctx, tex) {
    var THREE = ctx.THREE, P = K.props, q = ctx.qualite;
    var s = K.decor(ctx, { ciel: { zenith: "#020309", horizon: "#121a2e", lueur: "#3a2418", lueurDir: [0, -1], force: 1.0 }, brouillard: ["#0a0f1c", 0.0105],
      environnement: { fenetres: 8 }, reflets: 0.7, ambiance: ["#1c2640", "#050404", 0.12] });
    var trib = P.tribune({ largeur: 64, rangs: 26, profondeur: 0.8, marche: 0.42, parMetre: 1.9, couleurs: ["#7A1F2E", "#7a7a76"], graine: "nord" });
    s.add(trib);
    // sous le bord du toit, des lampes de service : la Nord n'est jamais tout à fait noire
    var yToit = trib.bas + trib.rangs * 0.42 + 3.7, zToit = -trib.profondeurTotale * 0.28 - 0.6;
    var mLampe = K.mat.lumiere({ couleur: "#FFC27A", intensite: 3, toneMapped: false });
    for (var lx = -28; lx <= 28.1; lx += 8) {
      var lp = P.boite(s, 0.5, 0.12, 0.25, mLampe, lx, yToit, zToit, { ombre: false });
      var hl = K.look.halo({ couleur: "#FFC27A", taille: 1.4, intensite: 0.9 }); hl.position.set(lx, yToit - 0.1, zToit + 0.2); s.add(hl);
    }
    [-20, 0, 20].forEach(function (x) { var pl = K.look.ponctuelle({ couleur: "#FFB466", intensite: 22, portee: 26 }); pl.position.set(x, yToit - 0.5, zToit + 0.5); s.add(pl); });
    var pel = P.pelouse({ boue: 0.25 }); pel.position.set(0, 0.02, 3 + 52.5); s.add(pel);
    var cage = P.but(); cage.position.set(0, 0.02, 3.05); s.add(cage);
    // des tribunes basses sur les côtés, dans le noir (le stade, pas un décor)
    var mBet = K.mat.beton({ couleur: "#3a3834", graine: "laterale" });
    [-1, 1].forEach(function (sg) { var b = new THREE.Mesh(P.boiteUV(8, 6, 100, 3), mBet); b.position.set(sg * 42, 3, 55); s.add(b); });
    // les quatre pylônes : deux près de la Nord, deux au loin (ce sont eux qui l'éclairent)
    var pyl = [
      { p: [-31, 0, 5], c: [0, 0, 40], t: 19.5 }, { p: [31, 0, 5], c: [0, 0, 40], t: 20.2 },
      { p: [-40, 0, 96], c: [-6, 6, -10], t: 21.3, ombre: true }, { p: [40, 0, 96], c: [6, 6, -10], t: 22.75 }
    ].map(function (d) {
      var loin = d.p[2] > 50;
      var p = P.pylone({ hauteur: 34, colonnes: 5, rangees: 4, couleur: "#EEF2FF", intensite: loin ? 21000 : 4800, ombre: !!d.ombre, longueurCone: loin ? 120 : 60, rayonCone: loin ? 24 : 14, forceCone: 0.08, graine: "py" + d.t });
      p.groupe.position.set(d.p[0], 0, d.p[2]); s.add(p.groupe);
      s.updateMatrixWorld(true);
      p.viser(d.c[0], d.c[1], d.c[2]);
      p.lumiere.angle = 0.55; p.lumiere.penombre = 0.7;
      if (d.ombre) { p.lumiere.shadow.camera.far = 180; p.lumiere.shadow.bias = -0.0008; }
      p.debut = d.t;
      return p;
    });
    // le tifo : une toile posée sur la pente, qui se déroule du dernier rang vers le bas
    var N = trib.rangs, haut = new THREE.Vector3(0, trib.bas + N * 0.42 + 1.0, -3.2 - N * 0.8 + 0.6), pente = new THREE.Vector3(0, -0.42, 0.8).normalize();
    var LT = 13.5, WT = 30;
    var gT = new THREE.PlaneGeometry(WT, LT, 30, 24); K.garder(gT);
    var mT = new THREE.MeshStandardMaterial({ map: tex.tifo, roughness: 0.9, side: THREE.DoubleSide, bumpMap: K.tex.tissu({ fils: 128 }).relief, bumpScale: 0.6 }); K.garder(mT);
    var Ut = { uK: { value: 0 } };
    mT.onBeforeCompile = function (sh) {
      sh.uniforms.uK = Ut.uK;
      sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nuniform float uK;").replace("#include <map_fragment>", "#include <map_fragment>\n if (vMapUv.y < 1.0 - uK) discard;");
    };
    var tifo = new THREE.Mesh(gT, mT); tifo.castShadow = true; tifo.receiveShadow = true;
    // le plan du tifo : son haut au dernier rang, il descend la pente
    var axeY = pente.clone().negate(), axeX = new THREE.Vector3(1, 0, 0), axeZ = new THREE.Vector3().crossVectors(axeX, axeY).normalize();
    tifo.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(axeX, axeY, axeZ));
    tifo.position.copy(haut).addScaledVector(pente, LT / 2);
    // les plis : la toile ondule un peu (dans le shader de position, simplement)
    var pp = gT.attributes.position; for (var i = 0; i < pp.count; i++) pp.setZ(i, Math.sin(pp.getX(i) * 0.9 + pp.getY(i) * 0.3) * 0.12 + Math.sin(pp.getY(i) * 2.1) * 0.06);
    gT.computeVertexNormals();
    s.add(tifo);
    var mRoul = new THREE.MeshStandardMaterial({ color: "#6a1a26", roughness: 0.85 }); K.garder(mRoul);
    var rouleau = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, WT, 20), mRoul); rouleau.rotation.z = PI / 2; s.add(rouleau); K.garder(rouleau.geometry);
    // les silhouettes qui tiennent le haut, et deux qui guident le rouleau
    var gens = [];
    for (var g = 0; g < 9; g++) {
      var m = K.gens.mannequin({ silhouette: true, tenue: "blouson", echarpe: g % 3 === 0 ? "#7A1F2E" : null, casquette: g % 4 === 1, graine: "tifo" + g });
      m.groupe.position.set(-13 + g * 3.25, trib.bas + N * 0.42 + 0.02, -3.2 - N * 0.8 - 0.1);
      m.groupe.rotation.y = 0; s.add(m.groupe); gens.push({ m: m, sorte: "haut", i: g });
    }
    [-15.8, 15.8].forEach(function (x, j) {
      var m = K.gens.mannequin({ silhouette: true, tenue: "blouson", graine: "guide" + j });
      s.add(m.groupe); gens.push({ m: m, sorte: "guide", x: x, i: j });
    });
    // les trois mille : la foule (rêvée) qui apparaît rang par rang, puis lève ses masques
    var places = trib.places.filter(function (p) {
      // pas sous le tifo (les rangs du haut, au milieu)
      return !(Math.abs(p.x) < WT / 2 + 0.3 && p.rang > N - 1 - LT * 0.86 / 0.9);
    });
    var foule = K.gens.foule({ places: places, masque: tex.masque, vague: { t0: 29.25, duree: 0.55, origine: [0, -10], vitesse: 26, desordre: 0.3 }, graine: "trois-mille", lueurMasques: 0.12 });
    s.add(foule);
    // l'apparition : chaque rang se lève de l'ombre (une échelle de 0 à 1, rang par rang)
    var gardees = foule.places, app = new Float32Array(Math.max(1, gardees.length));
    gardees.forEach(function (p, i) { app[i] = 27.7 + p.rang * 0.045 + K.h01(i, 77) * 0.35; });
    [foule.corps, foule.masques].forEach(function (im) {
      if (!im) return;
      im.geometry.setAttribute("aApp", new THREE.InstancedBufferAttribute(app, 1));
      var mm = im.material, avant = mm.onBeforeCompile;
      mm.onBeforeCompile = function (sh) {
        avant(sh);
        sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nattribute float aApp;")
          .replace("#include <project_vertex>", "transformed *= smoothstep(aApp, aApp + 0.7, uT);\n#include <project_vertex>");
      };
    });
    // les fumigènes du premier rang : une flamme rouge, sa lumière, sa fumée
    var feux = [-18, -7, 4, 15].map(function (x, j) {
      var src = [x, trib.bas + 1.3, -3.6];
      var f = K.particules.fumee({ n: 60, source: src, vent: [0.5, 0.6], montee: 1.4, vie: 6, taille: 2.4, etalement: 0.6, couleur: "#3a2a2c", lueur: "#ff3a2a", opacite: 0.42, graine: "fumi" + j,
        lumieres: [{ pos: src, couleur: ROUGE, intensite: 1.2, rayon: 6 }] });
      s.add(f);
      var l = K.look.ponctuelle({ couleur: "#ff3a22", intensite: 0, portee: 16, decroissance: 1.5 }); l.position.set(src[0], src[1] + 0.3, src[2] + 0.4); s.add(l);
      var h = K.look.halo({ couleur: "#ff4a30", taille: 1.6, intensite: 0 }); h.position.set(src[0], src[1] + 0.1, src[2] + 0.2); s.add(h);
      return { f: f, l: l, h: h, t0: 28.4 + j * 0.35 };
    });
    // la pluie, qui suit la caméra ; la nuit est mouillée
    var pluie = K.particules.pluie({ n: 12000, zone: { min: [-25, -0.5, -25], max: [25, 26, 25] }, suivre: true, avance: 18, vitesse: [1.2, -11, 0.6], longueur: 0.6, largeur: 0.014, couleur: "#6f7e9c", opacite: 0.9,
      lumieres: [{ pos: [-30, 30, 10], couleur: "#dfe6ff", intensite: 0, rayon: 40 }, { pos: [30, 30, 10], couleur: "#dfe6ff", intensite: 0, rayon: 40 }, { pos: [-25, 20, 70], couleur: "#dfe6ff", intensite: 0, rayon: 55 }, { pos: [25, 20, 70], couleur: "#dfe6ff", intensite: 0, rayon: 55 }] });
    s.add(pluie);
    return {
      scene: s, tribune: trib, pylones: pyl, tifo: tifo, foule: foule,
      look: { bloom: 0.85, rayon: 0.65, seuil: 0.85, exposition: 0.82, contraste: 1.18, saturation: 0.95 },
      maj: function (t, c) {
        pyl.forEach(function (p) { p.maj(t, p.debut); });
        // la pluie s'éclaire avec les pylônes
        var L = pluie.materiau.uniforms.uLumCoul.value;
        pyl.forEach(function (p, j) { var k = K.rampe(p.debut, p.debut + 2.2, t); L[j].set("#dfe6ff").multiplyScalar(k * (j < 2 ? 0.9 : 1.3)); });
        pluie.maj(t, c.camera);
        // le tifo : de 23,7 à 27,0 s, la toile descend la pente
        var k = K.lisse(23.7, 27.0, t);
        Ut.uK.value = Math.max(0.0001, k);
        rouleau.position.copy(haut).addScaledVector(pente, LT * k + 0.1).add(new THREE.Vector3(0, 0.45, 0));
        rouleau.rotation.x = -k * LT / 0.42;
        rouleau.visible = k < 0.995;
        gens.forEach(function (gg) {
          if (gg.sorte === "haut") { gg.m.tirer(t + gg.i * 0.37, 0.4 + 0.6 * K.cloche(23.4, 23.9, 26.6, 27.4, t)); gg.m.groupe.rotation.y = PI; }
          else {
            var pz = haut.clone().addScaledVector(pente, LT * k + 0.6);
            gg.m.groupe.position.set(gg.x, pz.y - 0.2, pz.z + 0.2); gg.m.groupe.rotation.y = gg.x < 0 ? -0.6 : 0.6;
            gg.m.marche(t * 0.5, 0.6);
          }
        });
        foule.maj(t);
        feux.forEach(function (f) {
          var on = K.lisse(f.t0, f.t0 + 0.4, t), fl = on * (0.75 + 0.25 * K.bruit1(t * 18, f.t0 * 10));
          f.l.intensity = 14 * fl; f.h.intensite(2.2 * fl); f.f.maj(t - f.t0 + 30);
          f.f.materiau.uniforms.uOpacite.value = 0.42 * on;
        });
      }
    };
  }

  // ─── L'ESCALIER DU CLUB-HOUSE : LA PHOTO DE 1974 ───────────────────────────
  function escalier(K, ctx, tex) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: false, fond: "#020203", environnement: { zenith: "#0a0b12", horizon: "#2a1c14", lueur: "#5a3014", fenetres: 6 }, reflets: 0.7,
      ambiance: ["#283456", "#0c0806", 0.18], brouillard: ["#0c0a0c", 0.03] });
    var mMur = K.mat.papier({ couleur: "#7b6a50", graine: "papier-peint-escalier", repete: [4, 4] });
    var piece = P.piece({ largeur: 3.2, profondeur: 7, hauteur: 6, murs: mMur, sol: K.mat.bois({ couleur: "#3a2416", lames: 6, graine: "palier" }),
      fenetre: { mur: "droite", x: 0.6, y: 3.7, w: 1.0, h: 1.4 } });
    piece.position.set(0, 0, -1.5); s.add(piece);
    // le lambris, à hauteur d'appui, le long des marches (une bande de bois inclinée)
    var esc = P.escalier({ marches: 17, largeur: 1.15, giron: 0.27, hauteurMarche: 0.18, rampe: "droite", bois: "#5a3820" });
    esc.position.set(-0.98, 0, 1.2); s.add(esc);
    // le palier du premier, en haut des marches
    P.boite(s, 3.2, 0.2, 1.7, K.mat.bois({ couleur: "#3a2416", lames: 6, graine: "palier-haut" }), 0, 17 * 0.18 - 0.08, 1.2 - 17 * 0.27 - 0.85);
    var long = Math.hypot(17 * 0.27, 17 * 0.18), ang = Math.atan2(17 * 0.18, 17 * 0.27);
    var lambris = P.boite(s, 0.03, 0.8, long + 1.2, K.mat.bois({ couleur: "#3a2214", lames: 8, graine: "lambris", cire: true }), -1.585, 0.45 + 17 * 0.18 / 2, 1.2 - 17 * 0.27 / 2, { rx: ang });
    // la photo de 1974, à la neuvième marche ; le clou ; la ficelle
    var m9 = esc.marche(8);
    var cadre = P.cadre({ texture: tex.photo, largeur: 0.92, hauteur: 0.68, couleurBaguette: "#20140c" });
    cadre.rotation.y = PI / 2; cadre.position.set(-1.575, m9[1] + 1.55, 1.2 + m9[2]); s.add(cadre);
    // la fenêtre du palier : le sodium du dehors, et la pluie sur la vitre, projetée sur le mur
    var gobo = K.tex.ecran({ largeur: 256, hauteur: 256, type: "lcd", fond: "#000", ips: 24, dessiner: function (x, t, w, h) {
      // les vitres : le centre (là où la photo reçoit la lumière) tombe dans un carreau, pas sur un meneau
      x.fillStyle = "#fff"; x.fillRect(w * 0.04, h * 0.04, w * 0.92, h * 0.92);
      x.fillStyle = "#000"; x.fillRect(w * 0.74, 0, w * 0.05, h); x.fillRect(0, h * 0.2, w, h * 0.045);
      // les gouttes qui coulent : un trait plus sombre, une tête claire
      for (var i = 0; i < 46; i++) {
        var gx = K.h01(i, 5) * w, v = 0.05 + K.h01(i, 9) * 0.12, gy = ((K.h01(i, 7) + t * v) % 1) * h * 1.2 - h * 0.1;
        x.fillStyle = "rgba(0,0,0,0.28)"; x.fillRect(gx - 0.8, gy - h * 0.14, 1.6, h * 0.14);
        x.fillStyle = "rgba(255,255,255,0.9)"; x.beginPath(); x.arc(gx, gy, 1.5, 0, 7); x.fill();
        x.fillStyle = "rgba(0,0,0,0.4)"; x.beginPath(); x.arc(gx + 0.6, gy + 0.6, 0.9, 0, 7); x.fill();
      }
      for (var j = 0; j < 140; j++) { x.fillStyle = "rgba(0,0,0," + (0.12 + K.h01(j, 3) * 0.22) + ")"; x.beginPath(); x.arc(K.h01(j, 11) * w, K.h01(j, 13) * h, 0.5 + K.h01(j, 17) * 1.1, 0, 7); x.fill(); }
    } });
    var sodium = K.look.projecteur({ couleur: "#FFA650", intensite: 120, angle: 0.5, penombre: 0.22, decroissance: 2, ombre: true, loin: 16, ombreTaille: 1024 });
    sodium.map = gobo.texture;
    sodium.position.set(4.6, 5.2, -0.8); s.add(sodium);
    var cs = new THREE.Object3D(); cs.position.set(-1.58, m9[1] + 1.45, 1.2 + m9[2] + 0.1); s.add(cs); sodium.target = cs;
    var vitre = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.4), new THREE.MeshPhysicalMaterial({ color: "#20160e", roughness: 0.1, transparent: true, opacity: 0.4, emissive: new THREE.Color("#ff9a3d"), emissiveIntensity: 0.25 }));
    K.garder(vitre.geometry); K.garder(vitre.material);
    vitre.rotation.y = -PI / 2; vitre.position.set(1.59, 3.7, -0.9); s.add(vitre);
    var froid = K.look.ponctuelle({ couleur: "#6f86c8", intensite: 4.5, portee: 10 }); froid.position.set(0.6, 5.2, -2.6); s.add(froid);
    // le bleu de la nuit, renvoyé par le mur d'en face : il tient les ombres de la photo
    var froid2 = K.look.ponctuelle({ couleur: "#6f8ad0", intensite: 1.6, portee: 4 }); froid2.position.set(0.6, 3.4, 0.2); s.add(froid2);
    // en bas des marches, la lampe du couloir : les nez de marche sortent du noir
    var bas = K.look.ponctuelle({ couleur: "#c08850", intensite: 3.2, portee: 7 }); bas.position.set(0.9, 1.6, 2.6); s.add(bas);
    var poussiere = K.particules.poussiere({ n: 700, zone: { min: [-1.5, 1.0, -2.5], max: [1.5, 5.0, 2.5] }, couleur: "#ffb070", opacite: 1, taille: 0.008,
      lumieres: [{ pos: [-0.5, 3.6, -0.4], couleur: "#ff9a3d", intensite: 1.2, rayon: 2.5 }] });
    s.add(poussiere);
    var photoPos = new THREE.Vector3(); cadre.updateMatrixWorld(true); cadre.getWorldPosition(photoPos);
    // le cinquième visage, sur le mur : là où la caméra finit
    var v5 = tex.visage5 || { u: 0.55, v: 0.4 };
    var cinquieme = cadre.localToWorld(new THREE.Vector3((v5.u - 0.5) * 0.92, (0.5 - v5.v) * 0.68, 0));
    return {
      scene: s, photo: [photoPos.x, photoPos.y, photoPos.z], cinquieme: [cinquieme.x, cinquieme.y, cinquieme.z],
      look: { bloom: 0.4, rayon: 0.45, seuil: 0.95, exposition: 1.0, contraste: 1.2, saturation: 0.9 },
      maj: function (t) { gobo.maj(t); poussiere.maj(t); }
    };
  }

  FC.film({
    id: "trois_mille_masques",
    livre: "promu",
    titre: "Trois mille masques",
    duree: 41.0,
    musique: "livre_h1",
    secours: "match",
    couleur: ROUGE,
    affiche: 30.6,
    habillage: { vignette: 0.55, grain: 0.075, ratioPaysage: 2.35, ratioPortrait: 0 },
    sortie: { noir: 1.4 },
    // les bruits : la presse qui claque à chaque feuille (« une », audio.js), les contacteurs
    // des pylônes (« porte »), le sifflet quand les masques se lèvent (« match_debut »)
    sons: [[6.08, "une"], [7.78, "une"], [9.48, "une"], [19.5, "porte"], [20.2, "porte"], [21.3, "porte"], [22.75, "porte"], [29.25, "match_debut"]],
    textes: [
      { sorte: "lieu", de: 1.0, a: 4.9, texte: "Aubérive, rue du Port", sous: "La veille du premier match · 23 h 40" },
      { sorte: "replique", de: 14.0, a: 18.7, qui: "Gégé", texte: "Trois mille. Personne n'en parle avant le coup d'envoi. Pas même au vestiaire." },
      { sorte: "titre", de: 37.6, a: 40.8, texte: "Aubérive · 1990", sous: "Trois mille visages", entree: 0.2, sortie: 0.7 }
    ],
    // la coupe de 30 s (l'aperçu de l'App Store) : les mêmes images, des plans resserrés
    montages: { court: [[0.3, 4.9], [5.6, 7.5], [8.0, 9.9], [10.4, 12.6], [13.8, 18.7], [19.3, 20.9], [21.1, 22.3], [24.6, 26.9], [28.2, 31.4], [35.0, 40.9]] },
    preparer: function (K, ctx) {
      var heros = ctx.heros;
      return Promise.all([
        K.tex.visage({ heros: heros, taille: 512 }),
        K.tex.feuilleMasques({ heros: heros, taille: 1024 }),
        K.tex.cliche({ heros: heros, taille: 1024 }),
        K.tex.photoEquipe({ gratte: [4], taille: 2048 }),
        K.tex.tifo({ heros: heros, mot: "NORD", largeur: 1024, hauteur: 512 })
      ]).then(function (r) {
        var tex = { masque: r[0].texture, feuille: r[1].texture, cliche: r[2], photo: r[3].texture, tifo: r[4].texture, visage5: r[3].visages ? r[3].visages[0] : null };
        // un décor par étape : la page reste à l'écoute pendant qu'ils se bâtissent
        return K.etapes(ctx, [
          function () { ctx.decors.rue = rueDuPort(K, ctx); },
          function () { ctx.decors.atelier = atelier(K, ctx, tex); },
          function () { ctx.decors.cour = cour(K, ctx, tex); },
          function () { ctx.decors.stade = stade(K, ctx, tex); },
          function () { ctx.decors.escalier = escalier(K, ctx, tex); }
        ]);
      });
    },
    plans: [
      // 1 · la rue du Port : de haut, derrière le lampadaire, puis à hauteur d'homme, vers la porte
      { de: 0, a: 5.2, decor: "rue", entree: "noir", transition: 1.4, fixe: 3.6,
        camera: { pos: K_cles([[0, [3.0, 7.4, 9]], [5.2, [-0.6, 1.55, -2.6]]], "douce"), cible: K_cles([[0, [-2.0, 2.6, -14]], [5.2, [-5.5, 1.35, -9.3]]], "douce"), fov: 52, epaule: 0.12 },
        cadrage: { portrait: { x: K_cles([[0, 0], [5.2, -0.1]]) } } },
      // 2 · le cliché : ton visage à l'envers, quatre fois, sur le zinc ; les rouleaux l'encrent,
      // la platine se lève et le couvre (le coup), retombe : l'encre brille de nouveau
      { de: 5.2, a: 7.6, decor: "atelier", entree: "coupe",
        camera: { pos: K_cles([[0, [0.3, 1.5, -0.24]], [2.4, [0.25, 1.45, -0.32]]], "lin"), cible: [0.15, 0.98, -0.87], fov: 46, epaule: 0.2 },
        look: { exposition: 1.3, contraste: 1.22 } },
      // 3 · la pile de sortie : ton visage sort par quatre, une feuille de plus à chaque coup
      { de: 7.6, a: 10.0, decor: "atelier", entree: "coupe",
        camera: { pos: K_cles([[0, [-0.12, 1.62, 0.12]], [2.4, [-0.2, 1.5, 0.02]]], "douce"), cible: [-0.6, 0.86, -0.56], fov: 40, epaule: 0.18 } },
      // 4 · une épreuve pendue sous l'ampoule : quatre fois ton visage, à contre-jour
      { de: 10.0, a: 13.0, decor: "atelier", entree: "coupe",
        camera: { pos: K_cles([[0, [-0.5, 1.62, 1.3]], [3.0, [-0.53, 1.68, 1.12]]], "douce"), cible: [-0.52, 1.92, 0.1], fov: 32, epaule: 0.18 },
        maj: function (l, p, c) {
          var d = c.decors.atelier;
          // pendue : elle tourne un peu sur sa ficelle, l'ampoule la traverse
          d.tenue.position.set(-0.55, 1.80, 0.14);
          d.tenue.rotation.set(-0.06 + K_fbm(l * 0.4, 3) * 0.05, K_fbm(l * 0.3, 5) * 0.12, K_fbm(l * 0.5, 7) * 0.025);
          d.feuille.transparence(0.25 + 0.5 * K_lisse(0.3, 1.8, l));
        } },
      // 5 · la cour : la corde, les masques, l'ampoule ; on longe la corde sous la pluie
      { de: 13.0, a: 19.0, decor: "cour", entree: "fondu", transition: 0.9, fixe: 3.2,
        camera: { pos: K_cles([[0, [2.4, 1.42, 3.3]], [6.0, [-1.5, 1.48, 3.1]]], "lin"), cible: K_cles([[0, [1.3, 2.0, 0.35]], [6.0, [-2.4, 1.98, 0.35]]], "lin"), fov: 34, epaule: 0.16 } },
      // 6a · la Nord, vide, de la pelouse ; les deux pylônes proches claquent, la pelouse s'éclaire
      { de: 19.0, a: 21.0, decor: "stade", entree: "noir", transition: 0.9, fixe: 1.8,
        camera: { pos: K_cles([[0, [0, 1.3, 50]], [2.0, [0, 1.45, 46.5]]], "lin"), cible: [0, 8.0, -8], fov: 72, epaule: 0.06 } },
      // 6b · sous un pylône du fond, quand il claque et monte en blanc
      { de: 21.0, a: 22.4, decor: "stade", entree: "coupe", fixe: 1.0,
        camera: { pos: K_cles([[0, [-34, 3.0, 82]], [1.4, [-34.4, 3.3, 81.2]]], "lin"), cible: [-40, 36, 97], fov: 52, epaule: 0.1 } },
      // 6c · la Nord s'allume pour de bon (le dernier pylône)
      { de: 22.4, a: 23.6, decor: "stade", entree: "coupe", fixe: 0.9,
        camera: { pos: K_cles([[0, [6, 1.6, 36]], [1.2, [5.5, 1.7, 34.5]]], "lin"), cible: [0, 7.5, -10], fov: 62, epaule: 0.06 } },
      // 7 · le tifo : des silhouettes le déroulent, du dernier rang vers le bas
      { de: 23.6, a: 27.5, decor: "stade", entree: "coupe", fixe: 3.0,
        camera: { pos: K_cles([[0, [-7, 2.6, 30]], [3.9, [-4.5, 3.4, 25]]], "douce"), cible: [0, 9.5, -14], fov: 50, epaule: 0.08 },
        cadrage: { portrait: { x: 0.12 } } },
      // 8 · les trois mille : ils sortent de l'ombre, rang par rang, puis lèvent ton visage
      { de: 27.5, a: 32.6, decor: "stade", entree: "flash", fixe: 4.4,
        camera: { pos: K_cles([[0, [0, 1.6, 15]], [5.1, [0, 8.5, 36]]], "douce"), cible: K_cles([[0, [0, 6.5, -8]], [5.1, [0, 7.0, -10]]], "douce"), fov: 58, epaule: 0.06 } },
      // 9 · l'escalier : la neuvième marche, la photo de 1974, le cinquième visage
      { de: 32.6, a: 41.0, decor: "escalier", entree: "noir", transition: 1.2, fixe: 4.4,
        camera: {
          pos: function (l, p, c) { var e = c.decors.escalier; return K_mix3([0.55, 1.3, 3.0], [e.cinquieme[0] + 0.85, e.cinquieme[1] + 0.02, e.cinquieme[2] + 0.04], K_aisance("douce")(Math.min(1, l / 6.0))); },
          cible: function (l, p, c) { var e = c.decors.escalier; return K_mix3([e.photo[0], e.photo[1] - 0.35, e.photo[2]], e.cinquieme, K_aisance("douce")(Math.min(1, l / 5.4))); },
          fov: K_cles([[0, 50], [6.0, 32]], "douce"), epaule: 0.1 } }
    ]
  });

  // les aides de la trousse, lues quand le film tourne (la trousse est chargée avant le film)
  function K_() { return FC.kit; }
  function K_cles(p, a) { var f = null; return function (t) { if (!f) f = K_().cles(p, a); return f(t); }; }
  function K_lisse(a, b, x) { return K_().lisse(a, b, x); }
  function K_fbm(x, g) { return K_().fbm1(x, g, 3); }
  function K_aisance(n) { return K_().aisance(n); }
  function K_mix3(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
})(typeof window !== "undefined" ? window : this);
