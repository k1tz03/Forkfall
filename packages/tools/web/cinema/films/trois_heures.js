/* ═══════════════════════════════════════════════════════════════════════════
   FILM — « Trois heures » (livre 8, « L'Oreillette », 2024, le directeur
   sportif — ou la directrice — conduit par un modèle ; la couleur du livre :
   #4FE3FF).

   Les projecteurs (la scène 6 du livre, un événement sombre) : à trois heures,
   par la baie du duplex de la Tréfilerie, le stade de la Rive s'allume, les
   quatre projecteurs d'un coup, sur une pelouse vide ; une silhouette court
   seule le long de la ligne de touche. Ce que le film montre :
     · le duplex, la nuit : l'usine de 1990 devenue loft, « on a gardé le pont
       roulant » ; le crochet au-dessus du lit défait, vide ;
     · la table de nuit : l'oreillette dans son étui, sa diode ; la montre de
       Cadence (le sponsor) qui compte les nuits : 2 h 59, puis 3 h 00 ;
     · par la baie : la ville éteinte, le stade au loin ; les quatre pylônes
       s'allument d'un coup, la brume blanchit, la lumière entre dans la pièce
       et pose la grille de la baie sur le béton ;
     · le stade, vide, en plein jour de nuit : quelqu'un court seul le long de la
       touche, vers nous, passe, s'en va — quatre ombres autour de lui ;
     · le duplex encore : le crochet, la baie, le stade allumé au loin ;
     · « Aubérive · 2024 / L'Oreillette ».
   Il se joue avant la carte des projecteurs (ds.h8.a3_projecteurs, ou sa
   variante quand Kerdal vit : créneau 16, 2024 : 100 % des carrières du livre,
   mesuré sur 300) et vaut pour les deux : la silhouette n'a pas de nom, pas de
   visage, et le film ne dit pas pourquoi le stade s'allume (le cycle de
   maintenance, on l'apprend plus tard, ou jamais). On ne voit pas le héros.

   LES PLANS (35 s ; la musique : livre_h8, 110 à la noire, une mesure = 2,18 s ;
   les coupes tombent sur les mesures)
     1   0,0–4,4   le duplex dans le noir : le crochet du pont roulant, à contre-
                   jour sur la baie ; la ville éteinte, la brume orangée au ras des
                   toits · carton « Aubérive, la Tréfilerie / 2024 · trois heures
                   moins une »
     2   4,4–8,7   la table de nuit : l'oreillette dans son étui, sa diode ; la
                   montre de Cadence : 02:59, puis 03:00 (8,2 s)
     3   8,7–13,1  la baie : les toits, le stade au loin ; les quatre pylônes d'un
                   coup (9,6 s), leurs faisceaux dans la brume, la lumière qui entre
     4  13,1–19,6  le stade, du coin : la pelouse vide sous les pylônes ; au bout de
                   la touche, quelqu'un court vers nous
     5  19,6–26,2  il passe au ras de la touche, une silhouette, ses quatre ombres ;
                   on le suit, il s'en va
     6  26,2–35,0  le duplex : la grille de la baie, le stade allumé au loin, la
                   lumière froide en carreaux sur le béton · titre « Aubérive ·
                   2024 / L'Oreillette »
   La coupe de 30 s (montages.court) : les mêmes plans, resserrés.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var FC = global.FusibleCinema;
  var PI = Math.PI;
  var CYAN = "#4FE3FF";
  var BORDEAUX = "#7A1F2E";
  var ALLUME = 9.6;          // trois heures : les quatre projecteurs d'un coup
  var MONTRE = 8.2;          // la montre passe à 3 h 00

  function etoffer(K, THREE, m, couleur) {
    var s = m.taille, mat = K.garder(new THREE.MeshStandardMaterial({ color: couleur || "#07070a", roughness: 0.92 }));
    var b = new THREE.Mesh(K.garder(new THREE.CylinderGeometry(0.165 * s, 0.17 * s, 0.26 * s, 12)), mat); b.position.y = -0.07 * s; b.scale.z = 0.66; b.castShadow = true; m.os.bassin.add(b);
    return m;
  }
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

  // ─── LE DUPLEX DE LA TRÉFILERIE ─────────────────────────────────────────────────
  // la pièce : x de -6 à 6, z de -5 (la baie) à 5, 6,5 m sous les fermes ; dehors, vers -z, la
  // ville et, à 360 m, le stade de la Rive (ses quatre pylônes).
  var LOFT = { W: 12, D: 10, H: 6.5 };
  var STADE_LOIN = { x: 60, z: -240 };
  function duplex(K, ctx) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: { zenith: "#02040c", horizon: "#283252", lueur: "#5a3c2a", lueurDir: [0.2, -1], force: 1.0 }, brouillard: ["#1a2030", 0.0024],
      environnement: { fenetres: 6 }, reflets: 0.7, ambiance: ["#26324c", "#080606", 0.12] });
    var ciel = s.children[0];
    // ── la pièce : le béton ciré, la brique, les fermes d'acier
    var mSol = K.mat.beton({ couleur: "#3a3936", graine: "beton-cire", banches: 0, taches: 0.3 });
    mSol.roughness = 0.35; mSol.envMapIntensity = 1.2;
    var sol = new THREE.Mesh(P.planUV(LOFT.W, LOFT.D, 2), mSol); sol.rotation.x = -PI / 2; sol.receiveShadow = true; s.add(sol);
    var mBr = K.mat.brique({ couleur: "#5e3428", graine: "trefilerie", suie: 0.6, humide: 0.1 });
    var murs = [[LOFT.D, -LOFT.W / 2, 0, PI / 2], [LOFT.D, LOFT.W / 2, 0, -PI / 2], [LOFT.W, 0, LOFT.D / 2, PI]];
    murs.forEach(function (m) { var w = new THREE.Mesh(P.planUV(m[0], LOFT.H, 1.5), mBr); w.position.set(m[1], LOFT.H / 2, m[2]); w.rotation.y = m[3]; w.receiveShadow = true; s.add(w); });
    var mAc = K.mat.metal({ couleur: "#2c2f33", rugosite: 0.55 });
    // la baie : un mur de verre d'usine, des petits carreaux sur une grille d'acier
    var zB = -LOFT.D / 2, bx0 = -4.5, bx1 = 4.5, by0 = 0.6, by1 = 5.5;
    P.boite(s, LOFT.W, by0, 0.3, mBr, 0, by0 / 2, zB); P.boite(s, LOFT.W, LOFT.H - by1, 0.3, mBr, 0, (LOFT.H + by1) / 2, zB);
    P.boite(s, LOFT.W / 2 + bx0, by1 - by0, 0.3, mBr, (-LOFT.W / 2 + bx0) / 2, (by0 + by1) / 2, zB); P.boite(s, LOFT.W / 2 - bx1, by1 - by0, 0.3, mBr, (LOFT.W / 2 + bx1) / 2, (by0 + by1) / 2, zB);
    var grille = [];
    for (var gx = bx0; gx <= bx1 + 0.01; gx += 0.6) grille.push(new THREE.BoxGeometry(0.045, by1 - by0, 0.07).translate(gx, (by0 + by1) / 2, zB).toNonIndexed());
    for (var gy = by0; gy <= by1 + 0.01; gy += 0.49) grille.push(new THREE.BoxGeometry(bx1 - bx0, 0.045, 0.07).translate(0, gy, zB).toNonIndexed());
    var gGr = K.gens.fusion(grille); gGr.computeVertexNormals(); K.garder(gGr);
    var baie = new THREE.Mesh(gGr, mAc); baie.castShadow = true; s.add(baie);
    var mVit = K.garder(new THREE.MeshPhysicalMaterial({ color: "#0a0e14", roughness: 0.1, metalness: 0.0, transparent: true, opacity: 0.12, envMapIntensity: 1.2, depthWrite: false }));
    var vit = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(bx1 - bx0, by1 - by0)), mVit); vit.position.set(0, (by0 + by1) / 2, zB + 0.02); s.add(vit);
    // les fermes du toit, et le pont roulant : deux chemins de roulement, la poutre jaune passée,
    // le chariot, les câbles, le crochet au-dessus du lit
    for (var fz = -4; fz <= 4.01; fz += 4) P.boite(s, LOFT.W, 0.35, 0.18, mAc, 0, LOFT.H - 0.2, fz);
    // le toit : des planches noircies au-dessus des fermes
    P.boite(s, LOFT.W, 0.12, LOFT.D + 0.4, K.mat.bois({ couleur: "#191512", lames: 12, graine: "toit-duplex" }), 0, LOFT.H + 0.06, 0, { ombre: false });
    P.boite(s, 0.3, 0.45, LOFT.D, mAc, -LOFT.W / 2 + 0.35, 5.4, 0); P.boite(s, 0.3, 0.45, LOFT.D, mAc, LOFT.W / 2 - 0.35, 5.4, 0);
    var mJaune = K.garder(new THREE.MeshStandardMaterial({ color: "#9c8432", roughness: 0.7, metalness: 0.3 }));
    var ZP = 1.2;
    P.boite(s, LOFT.W - 0.5, 0.6, 0.35, mJaune, 0, 5.85, ZP); P.boite(s, LOFT.W - 0.5, 0.08, 0.6, mJaune, 0, 5.52, ZP); P.boite(s, LOFT.W - 0.5, 0.08, 0.6, mJaune, 0, 6.18, ZP);
    P.boite(s, 0.9, 0.5, 0.9, mJaune, 0.4, 5.25, ZP);
    var crochet = new THREE.Group(); s.add(crochet);
    [-0.12, 0.12].forEach(function (dx) { P.cylindre(crochet, 0.012, 0.012, 2.0, mAc, 0.4 + dx, 4.0, ZP, { cotes: 6 }); });
    P.boite(crochet, 0.42, 0.5, 0.22, mJaune, 0.4, 2.85, ZP);
    var gCr = K.garder(new THREE.TorusGeometry(0.13, 0.04, 8, 20, PI * 1.4)); var cr = new THREE.Mesh(gCr, mAc); cr.position.set(0.4, 2.42, ZP); cr.rotation.z = PI * 0.8; crochet.add(cr);
    P.cylindre(crochet, 0.035, 0.035, 0.22, mAc, 0.4, 2.62, ZP, { cotes: 8 });
    // le lit, défait, vide ; la table de nuit
    var mDrap = K.garder(new THREE.MeshStandardMaterial({ color: "#c9ccd2", roughness: 0.9 }));
    P.boite(s, 2.0, 0.3, 2.2, K.mat.bois({ couleur: "#2a2420", lames: 3, graine: "lit-duplex" }), 0.4, 0.15, 1.6);
    var mat = new THREE.Mesh(K.garder(boiteRonde(THREE, 1.9, 0.22, 2.05, 0.06, 4)), mDrap); mat.position.set(0.4, 0.41, 1.6); s.add(mat);
    var gDu = boiteRonde(THREE, 1.95, 0.16, 1.4, 0.07, 10), pDu = gDu.attributes.position;
    for (var i = 0; i < pDu.count; i++) { var px = pDu.getX(i), pz = pDu.getZ(i); pDu.setY(i, pDu.getY(i) + Math.sin(px * 3.1 + pz * 2.3) * 0.05 + Math.sin(px * 7 - pz * 5) * 0.02); }
    gDu.computeVertexNormals(); K.garder(gDu);
    var duvet = new THREE.Mesh(gDu, mDrap); duvet.position.set(0.45, 0.58, 2.05); duvet.rotation.y = 0.12; duvet.castShadow = true; duvet.receiveShadow = true; s.add(duvet);
    [-0.45, 0.45].forEach(function (dx) { var o = new THREE.Mesh(K.garder(boiteRonde(THREE, 0.7, 0.16, 0.45, 0.07, 4)), mDrap); o.position.set(0.4 + dx, 0.6, 0.72); o.rotation.y = dx * 0.2; s.add(o); });
    var mTab = K.mat.bois({ couleur: "#1e1a17", lames: 1, graine: "chevet-duplex" });
    var TN = { x: 1.75, y: 0.5, z: 0.8 };
    P.boite(s, 0.5, 0.5, 0.45, mTab, TN.x, TN.y / 2, TN.z);
    // l'étui ouvert, l'oreillette, sa diode
    var mEtui = K.garder(new THREE.MeshStandardMaterial({ color: "#3b3c40", roughness: 0.5, metalness: 0.15 }));
    var etui = new THREE.Group(); etui.position.set(TN.x - 0.025, TN.y, TN.z + 0.03); etui.rotation.y = 0.5; s.add(etui);
    var base = new THREE.Mesh(K.garder(boiteRonde(THREE, 0.062, 0.022, 0.044, 0.01, 4)), mEtui); base.position.y = 0.011; etui.add(base);
    var creux = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.05, 0.032)), K.garder(new THREE.MeshStandardMaterial({ color: "#2a2b2e", roughness: 0.8 }))); creux.rotation.x = -PI / 2; creux.position.y = 0.0222; etui.add(creux);
    var couv = new THREE.Group(); couv.position.set(0, 0.022, -0.022); couv.rotation.x = -1.9; etui.add(couv);
    var lid = new THREE.Mesh(K.garder(boiteRonde(THREE, 0.06, 0.008, 0.042, 0.004, 4)), mEtui); lid.position.set(0, 0.004, 0.021); couv.add(lid);
    var or = P.telephone({ epoque: "oreillette", couleur: "#d6a98c" }); or.position.set(0.004, 0.026, 0.002); or.rotation.set(-PI / 2 + 0.25, 0, 0.3); etui.add(or);
    // la montre de Cadence : un boîtier rond carré, le bracelet ; son écran : l'heure, les nuits
    var montre = new THREE.Group(); montre.position.set(TN.x + 0.065, TN.y + 0.006, TN.z - 0.035); montre.rotation.y = -0.35; s.add(montre);
    var mBo = K.garder(new THREE.MeshStandardMaterial({ color: "#16181b", roughness: 0.3, metalness: 0.5 }));
    var boitier = new THREE.Mesh(K.garder(boiteRonde(THREE, 0.04, 0.011, 0.046, 0.005, 4)), mBo); boitier.position.y = 0.0055; montre.add(boitier);
    P.boite(montre, 0.022, 0.003, 0.2, K.garder(new THREE.MeshStandardMaterial({ color: "#2a2d31", roughness: 0.8 })), 0, 0.0015, 0, { ombre: false });
    var ecM = K.tex.ecran({ largeur: 256, hauteur: 296, type: "lcd", fond: "#000000", ips: 10, dessiner: function (x, t, w, h) {
      var trois = t >= MONTRE, hh = trois ? "03:00" : "02:59";
      x.fillStyle = "#e8eef2"; x.font = "700 78px 'Space Mono','DejaVu Sans Mono',monospace"; x.textAlign = "center"; x.textBaseline = "middle";
      x.fillText(hh, w / 2, h * 0.42);
      x.fillStyle = CYAN; x.font = "700 26px 'Space Mono','DejaVu Sans Mono',monospace"; x.fillText("CADENCE", w / 2, h * 0.14);
      x.fillStyle = "#8aa0ac"; x.font = "400 24px 'Space Mono','DejaVu Sans Mono',monospace"; x.fillText("SOMMEIL 0 h 52", w / 2, h * 0.7);
      // les battements : une petite courbe qui court
      x.strokeStyle = "#e05a5a"; x.lineWidth = 3; x.beginPath();
      for (var k = 0; k <= 40; k++) { var cx = w * 0.15 + k * w * 0.0175, ph = (k / 40 + t * 0.9) % 1, cy = h * 0.86 - (ph > 0.46 && ph < 0.5 ? 18 : ph > 0.5 && ph < 0.53 ? -10 : 0); if (k) x.lineTo(cx, cy); else x.moveTo(cx, cy); }
      x.stroke();
    } });
    var ecr = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(0.034, 0.039)), K.garder(new THREE.MeshBasicMaterial({ map: ecM.texture, color: new THREE.Color(1, 1, 1).multiplyScalar(1.3) })));
    ecr.rotation.x = -PI / 2; ecr.position.y = 0.0118; montre.add(ecr);
    var lMontre = K.look.ponctuelle({ couleur: "#cfe6ff", intensite: 0.05, portee: 0.4 }); lMontre.position.set(TN.x + 0.1, TN.y + 0.08, TN.z - 0.04); s.add(lMontre);
    // un verre d'eau
    var mVerre = K.garder(new THREE.MeshPhysicalMaterial({ color: "#d8e4ea", roughness: 0.05, transparent: true, opacity: 0.25, envMapIntensity: 1.5 }));
    P.cylindre(s, 0.033, 0.03, 0.1, mVerre, TN.x - 0.16, TN.y + 0.05, TN.z - 0.12, { cotes: 18, ouvert: true });
    // ── dehors : la ville (des toits, quelques fenêtres), le stade au loin
    var mToit = K.garder(new THREE.MeshStandardMaterial({ color: "#121318", roughness: 0.95 }));
    var gT = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0); K.garder(gT);
    // les toits proches, sous la fenêtre (on les voit de haut : le duplex est au troisième), et
    // leurs fenêtres allumées
    var bloc = [], fenL = [], d = new THREE.Object3D();
    for (var k = 0; k < 150; k++) {
      var zz = -26 - Math.pow(K.h01(k, 3), 0.9) * 190, xx = (K.h01(k, 5) - 0.5) * (90 + (-zz) * 1.5), w0 = 8 + K.h01(k, 7) * 16, h0 = -4.5 + K.h01(k, 9) * 7, p0 = 6 + K.h01(k, 11) * 12;
      if (Math.abs(xx - STADE_LOIN.x) < 50 && zz < -180) continue;
      bloc.push([xx, zz, w0, h0, p0]);
      var hb = h0 + 8;
      if (K.h01(k, 15) < 0.45) fenL.push([xx + (K.h01(k, 17) - 0.5) * w0 * 0.7, -8 + hb * (0.35 + K.h01(k, 19) * 0.45), zz + p0 / 2 + 0.05]);
      if (K.h01(k, 21) < 0.3) fenL.push([xx + (K.h01(k, 23) - 0.5) * w0 * 0.7, -8 + hb * (0.25 + K.h01(k, 25) * 0.5), zz + p0 / 2 + 0.05]);
    }
    var toits = new THREE.InstancedMesh(gT, mToit, bloc.length);
    bloc.forEach(function (b, i) { d.position.set(b[0], -8, b[1]); d.scale.set(b[2], b[3] + 8, b[4]); d.rotation.set(0, 0, 0); d.updateMatrix(); toits.setMatrixAt(i, d.matrix); });
    toits.instanceMatrix.needsUpdate = true; s.add(toits);
    var gFe = new THREE.PlaneGeometry(1.1, 1.4); K.garder(gFe);
    var fenetresV = new THREE.InstancedMesh(gFe, K.garder(new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffc27a").multiplyScalar(2.2), fog: false })), Math.max(1, fenL.length));
    fenL.forEach(function (f, i) { d.position.set(f[0], f[1], f[2]); d.scale.set(1, 1, 1); d.rotation.set(0, 0, 0); d.updateMatrix(); fenetresV.setMatrixAt(i, d.matrix); });
    fenetresV.instanceMatrix.needsUpdate = true; s.add(fenetresV);
    // la ville au loin, derrière le stade : une toile peinte (le ciel, la brume orangée des
    // réverbères, les toits en dents de scie, des fenêtres, des sodiums)
    var tv = K.tex.canvas(2048, 512), tvx = tv.getContext("2d"), rv = K.alea("ville-toile");
    var gv = tvx.createLinearGradient(0, 0, 0, 512);
    gv.addColorStop(0, "#03050c"); gv.addColorStop(0.5, "#101830"); gv.addColorStop(0.74, "#2c2c40"); gv.addColorStop(0.82, "#5a4234"); gv.addColorStop(0.9, "#2a1e1c"); gv.addColorStop(1, "#0a0808");
    tvx.fillStyle = gv; tvx.fillRect(0, 0, 2048, 512);
    tvx.fillStyle = "#06070b"; tvx.beginPath(); tvx.moveTo(0, 512);
    for (var vx = 0; vx <= 2048;) { var hv = 418 - rv() * 22 - (rv() < 0.07 ? rv() * 70 : 0), lw = 10 + rv() * 34; tvx.lineTo(vx, hv); tvx.lineTo(vx + lw, hv); vx += lw; }
    tvx.lineTo(2048, 512); tvx.closePath(); tvx.fill();
    for (var vi = 0; vi < 900; vi++) { var wx = rv() * 2048, wy = 426 + rv() * 70; if (rv() < 0.55) { tvx.fillStyle = rv() < 0.75 ? "rgba(255,192,112,0.95)" : "rgba(200,220,255,0.85)"; tvx.fillRect(wx, wy, 2, 2); } }
    for (var vj = 0; vj < 180; vj++) {
      var lx = rv() * 2048, ly = 436 + rv() * 64, gl = tvx.createRadialGradient(lx, ly, 0, lx, ly, 7);
      gl.addColorStop(0, "rgba(255,168,80,0.95)"); gl.addColorStop(1, "rgba(255,168,80,0)"); tvx.fillStyle = gl; tvx.fillRect(lx - 7, ly - 7, 14, 14);
    }
    var toile = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(1100, 140)), K.garder(new THREE.MeshBasicMaterial({ map: K.tex.texture(tv, { clamp: true }), fog: false })));
    toile.position.set(40, 47, -460); s.add(toile);
    // le stade, au loin : quatre masses de tribunes, la pelouse (elle s'éclaire), quatre pylônes
    var st = new THREE.Group(); st.position.set(STADE_LOIN.x, -8, STADE_LOIN.z); s.add(st);
    var mMas = K.garder(new THREE.MeshStandardMaterial({ color: "#1a1b1f", roughness: 0.9 }));
    P.boite(st, 76, 16, 8, mMas, 0, 8, -58); P.boite(st, 76, 16, 8, mMas, 0, 8, 58); P.boite(st, 8, 18, 104, mMas, -42, 9, 0); P.boite(st, 8, 18, 104, mMas, 42, 9, 0);
    var mPel = K.garder(new THREE.MeshBasicMaterial({ color: new THREE.Color(0, 0, 0) }));
    var pel = new THREE.Mesh(K.garder(new THREE.PlaneGeometry(76, 108)), mPel); pel.rotation.x = -PI / 2; pel.position.y = 0.2; st.add(pel);
    var pylones = [[-44, -62], [44, -62], [-44, 62], [44, 62]].map(function (p) {
      var py = P.pylone({ hauteur: 34, intensite: 0, cone: true, longueurCone: 70, rayonCone: 24, forceCone: 0.22, halo: 12, eclat: 30, graine: "pyl" + p[0] + p[1] });
      py.groupe.position.set(p[0], 0, p[1]); st.add(py.groupe); py.viser(STADE_LOIN.x, -8, STADE_LOIN.z);
      // de si loin, le projecteur n'éclaire rien d'ici : on garde le halo, l'éclat, le faisceau
      py.lumiere.parent.remove(py.lumiere);
      return py;
    });
    // la brume au-dessus du stade, qui blanchit : un halo immense
    var lueur = K.look.halo({ couleur: "#cfe0ff", taille: 90, intensite: 0, coeur: 0.02, toneMapped: true }); lueur.position.set(STADE_LOIN.x, 24, STADE_LOIN.z + 30); s.add(lueur);
    // la lumière du stade dans la pièce : froide, basse, elle pose la grille de la baie sur le lit
    // (un projecteur posé dehors, contre la baie, tourné vers la pièce : il n'éclaire pas la ville)
    var lStade = K.look.projecteur({ couleur: "#dfe8ff", intensite: 0, angle: 0.62, penombre: 0.35, ombre: true, loin: 30, ombreTaille: 2048, decroissance: 0, pres: 0.5 });
    lStade.position.set(1.4, 4.4, -12); s.add(lStade);
    var cSt = new THREE.Object3D(); cSt.position.set(0.3, 0, 3.0); s.add(cSt); lStade.target = cSt;
    // la ville dans la pièce, avant : un reste de bleu par la baie
    var lVille = K.look.projecteur({ couleur: "#4a5f8f", intensite: 22, angle: 0.9, penombre: 1, ombre: false, loin: 14 });
    lVille.position.set(0, 4.5, -6); s.add(lVille); var cV = new THREE.Object3D(); cV.position.set(0.3, 0, 2); s.add(cV); lVille.target = cV;
    var cZ = new THREE.Color(), cH = new THREE.Color();
    return {
      scene: s,
      look: { bloom: 0.85, rayon: 0.6, seuil: 0.82, exposition: 1.35, contraste: 1.14, saturation: 0.85 },
      maj: function (t, c) {
        var plan = c.indice, tout = plan == null;
        or.maj(t); ecM.maj(t);
        var k = tout ? 1 : K.rampe(ALLUME, ALLUME + 0.35, t);
        // le claquement : les quatre d'un coup, une hésitation, puis plein
        var kk = k > 0 && k < 1 ? k * (0.55 + 0.45 * Math.abs(Math.sin(t * 41))) : k;
        pylones.forEach(function (py) { py.intensiteMax = 0; py.allumer(kk, t); });
        mPel.color.set("#7fa58a").multiplyScalar(0.55 * kk);
        lueur.intensite(0.025 * kk);
        lStade.intensity = 0.55 * kk;
        cZ.set("#010208").lerp(new THREE.Color("#0b1220"), kk * 0.6); cH.set("#121826").lerp(new THREE.Color("#3a4a66"), kk);
        ciel.material.uniforms.uZenith.value.copy(cZ); ciel.material.uniforms.uHorizon.value.copy(cH);
      }
    };
  }

  // ─── LE STADE DE LA RIVE, la nuit, les quatre pylônes allumés ────────────────────
  // la pelouse au centre (la longueur le long de z) ; la touche est en x = 34 ; la tribune
  // Est derrière (elle regarde -x), la Nord au bout (z < 0).
  var TOUCHE = 33.6;
  var COURSE = { z0: -23.4, t0: 13.1, v: 6.0 };
  function stade(K, ctx) {
    var THREE = ctx.THREE, P = K.props;
    var s = K.decor(ctx, { ciel: { zenith: "#010309", horizon: "#1c2638", lueur: "#2a3448", lueurDir: [0, -1], force: 0.9 }, brouillard: ["#1a2232", 0.008],
      environnement: { fenetres: 0 }, reflets: 0.8, ambiance: ["#4a5a7a", "#101010", 0.25] });
    var pel = P.pelouse({ boue: 0.1 }); s.add(pel);
    var mB = K.mat.beton({ couleur: "#45433e", graine: "parvis-rive-nuit", banches: 0 });
    var parvis = new THREE.Mesh(P.planUV(180, 200, 4), mB); parvis.rotation.x = -PI / 2; parvis.position.y = -0.02; s.add(parvis);
    // la tribune Est, le long de la touche (elle regarde -x) ; la Nord au bout
    var est = P.tribune({ largeur: 96, rangs: 18, couleurs: [BORDEAUX, "#8E8C86"], graine: "est-rive", panneaux: false });
    est.rotation.y = -PI / 2; est.position.set(38, 0, 0); s.add(est);
    var nord = P.tribune({ largeur: 64, rangs: 22, couleurs: [BORDEAUX, "#8E8C86"], graine: "nord-rive" });
    nord.position.set(0, 0, -55.5); s.add(nord);
    var mMasse = K.mat.beton({ couleur: "#2e2d2a", graine: "masses-rive-nuit", banches: 1 });
    P.boite(s, 6, 16, 92, mMasse, -42, 8, 0); P.boite(s, 70, 14, 8, mMasse, 0, 7, 60);
    // les quatre pylônes, allumés (le plan 3 a vu le claquement)
    var pylones = [[-44, -62], [44, -62], [-44, 62], [44, 62]].map(function (p) {
      var py = P.pylone({ hauteur: 34, intensite: 40000, cone: true, forceCone: 0.08, longueurCone: 60, rayonCone: 14, graine: "py" + p[0] + p[1] });
      py.groupe.position.set(p[0], 0, p[1]); s.add(py.groupe); py.viser(p[0] * 0.25, 0, p[1] * 0.25);
      return py;
    });
    var buts = [-1, 1].map(function (sz) { var b = P.but({}); b.position.set(0, 0, sz * 52.5); b.rotation.y = sz > 0 ? PI : 0; s.add(b); return b; });
    // le coureur : un survêtement sombre, sans nom ; il court le long de la touche, vers nous
    var cou = etoffer(K, THREE, K.gens.mannequin({ tenue: "survetement", couleur: "#23272e", couleur2: "#1c1f25", peau: "#221e1c", taille: 1.8, graine: "coureur" }), "#1c1f25");
    cou.groupe.rotation.y = 0; s.add(cou.groupe);
    // ses quatre ombres, une par pylône : des traînées douces, couchées sur l'herbe
    var to = K.tex.canvas(64, 256), tox = to.getContext("2d"), go = tox.createLinearGradient(0, 0, 0, 256);
    // (le haut de la toile est le bout de l'ombre, le bas est aux pieds)
    go.addColorStop(0, "rgba(0,0,0,0)"); go.addColorStop(0.35, "rgba(0,0,0,0.35)"); go.addColorStop(1, "rgba(0,0,0,0.78)");
    tox.fillStyle = go; tox.beginPath(); tox.ellipse(32, 128, 20, 126, 0, 0, 7); tox.fill();
    var mOmb = K.garder(new THREE.MeshBasicMaterial({ map: K.tex.texture(to, { clamp: true }), transparent: true, depthWrite: false, opacity: 0.8 }));
    var gOmb = new THREE.PlaneGeometry(0.8, 1).translate(0, 0.5, 0).rotateX(-PI / 2); K.garder(gOmb);
    var ombres = [[-44, -62], [44, -62], [-44, 62], [44, 62]].map(function (p) { var o = new THREE.Mesh(gOmb, mOmb); o.renderOrder = 2; o.userData.p = p; s.add(o); return o; });
    var pas = new THREE.Vector3();
    function courir(t) {
      var z = COURSE.z0 + (t - COURSE.t0) * COURSE.v;
      cou.groupe.position.set(TOUCHE + 0.6, 0, z); cou.groupe.rotation.y = 0;
      var ph = t * 2 * PI * 1.45, sw = 0.9, os = cou.os;
      cou.repos(t);
      os.buste.rotation.x = 0.22; os.tete.rotation.x = -0.05; os.tete.rotation.y = 0;
      os.hancheG.rotation.x = Math.sin(ph) * sw; os.hancheD.rotation.x = -Math.sin(ph) * sw;
      os.genouG.rotation.x = 0.25 + Math.max(0, -Math.cos(ph)) * 1.6; os.genouD.rotation.x = 0.25 + Math.max(0, Math.cos(ph)) * 1.6;
      os.epauleG.rotation.x = -Math.sin(ph) * 0.95; os.epauleD.rotation.x = Math.sin(ph) * 0.95;
      os.epauleG.rotation.z = -0.12; os.epauleD.rotation.z = 0.12;
      os.coudeG.rotation.x = -1.45; os.coudeD.rotation.x = -1.45;
      os.bassin.position.y = 0.95 * cou.taille + Math.abs(Math.cos(ph)) * 0.07;
      os.bassin.rotation.y = Math.sin(ph) * 0.12; os.buste.rotation.y = -Math.sin(ph) * 0.18;
      ombres.forEach(function (o) {
        var p = o.userData.p, dx = TOUCHE + 0.6 - p[0], dz = z - p[1], dd = Math.hypot(dx, dz), L = 1.8 * dd / 34;
        // la quad s'allonge vers -z ; tournée de atan2 + π, elle s'en va à l'opposé du pylône
        o.position.set(TOUCHE + 0.6, 0.03, z); o.rotation.y = Math.atan2(dx, dz) + PI; o.scale.set(1, 1, L);
      });
      pas.set(TOUCHE + 0.6, 0, z);
      return pas;
    }
    var brume = K.particules.fumee({ n: 50, source: [0, 0.3, 0], vent: [0.2, 0.05], montee: 0.02, etalement: 90, vie: 40, taille: 8, couleur: "#3c4658", lueur: "#3c4658", opacite: 0.1, graine: "brume-nuit",
      lumieres: pylones.map(function (py) { var v = new THREE.Vector3(); py.tete.getWorldPosition(v); return { pos: [v.x, v.y, v.z], couleur: "#dfe8ff", intensite: 1.2, rayon: 60 }; }) });
    s.add(brume);
    return {
      scene: s, coureur: courir,
      look: { bloom: 0.8, rayon: 0.6, seuil: 0.85, exposition: 1.15, contraste: 1.14, saturation: 0.86 },
      maj: function (t, c) {
        pylones.forEach(function (py) { py.maj(t, ALLUME); });
        courir(t);
        brume.maj(t, c.camera);
      }
    };
  }

  FC.film({
    id: "trois_heures",
    livre: "le_modele",
    titre: "Trois heures",
    duree: 35.0,
    musique: "livre_h8",
    secours: "ville_nuit",
    couleur: CYAN,
    affiche: 11.6,
    habillage: { vignette: 0.55, grain: 0.07, ratioPaysage: 2.35, ratioPortrait: 0 },
    sortie: { noir: 1.5 },
    // le claquement des quatre projecteurs
    sons: [[ALLUME, "une"]],
    textes: [
      { sorte: "lieu", de: 0.8, a: 4.2, texte: "Aubérive, la Tréfilerie", sous: "2024 · trois heures moins une" },
      { sorte: "titre", de: 28.6, a: 34.4, texte: "Aubérive · 2024", sous: "L'Oreillette", entree: 0.2, sortie: 0.7 }
    ],
    montages: { court: [[0.3, 4.3], [5.2, 8.7], [9.0, 13.0], [14.0, 18.8], [20.2, 25.6], [28.4, 34.4]] },
    preparer: function (K, ctx) {
      return K.etapes(ctx, [
        function () { ctx.decors.duplex = duplex(K, ctx); },
        function () { ctx.decors.stade = stade(K, ctx); }
      ]);
    },
    plans: [
      // 1 · le duplex dans le noir : le pont roulant, le crochet, le lit vide, la baie
      { de: 0, a: 4.364, decor: "duplex", entree: "noir", transition: 1.2, fixe: 3.2,
        camera: { pos: K_cles([[0, [1.15, 2.55, 4.7]], [4.36, [1.05, 2.6, 4.25]]], "douce"), cible: K_cles([[0, [0.35, 2.7, -5]], [4.36, [0.35, 2.72, -5]]], "douce"),
          fov: K_cles([[0, 50], [4.36, 46]], "douce"), epaule: 0.04 } },
      // 2 · la table de nuit : l'oreillette, la montre (2 h 59, puis 3 h 00)
      { de: 4.364, a: 8.727, decor: "duplex", entree: "coupe", fixe: 4.0,
        camera: { pos: K_cles([[0, [1.8, 0.8, 1.03]], [4.36, [1.8, 0.77, 0.98]]], "douce"), cible: K_cles([[0, [1.79, 0.505, 0.785]], [4.36, [1.795, 0.505, 0.78]]], "douce"),
          fov: K_cles([[0, 30], [4.36, 25]], "douce"), epaule: 0.02, pres: 0.01 } },
      // 3 · la baie : le stade au loin s'allume
      { de: 8.727, a: 13.091, decor: "duplex", entree: "coupe", fixe: 3.4,
        camera: { pos: K_cles([[0, [1.2, 2.3, -3.1]], [4.36, [1.3, 2.35, -3.6]]], "douce"), cible: K_cles([[0, [STADE_LOIN.x * 0.3, 1.0, -120]], [4.36, [STADE_LOIN.x * 0.32, 1.2, -120]]], "douce"),
          fov: K_cles([[0, 40], [4.36, 34]], "douce"), epaule: 0.03 } },
      // 4 · le stade : la pelouse vide ; au fond, quelqu'un court vers nous
      { de: 13.091, a: 19.636, decor: "stade", entree: "coupe", fixe: 4.6,
        camera: { pos: K_cles([[0, [TOUCHE + 2.6, 0.75, 54.5]], [6.55, [TOUCHE + 2.4, 0.8, 53.0]]], "douce"), cible: K_cles([[0, [TOUCHE - 2, 1.4, 0]], [6.55, [TOUCHE - 1.2, 1.3, 10]]], "douce"),
          fov: K_cles([[0, 46], [6.55, 30]], "douce"), epaule: 0.05 },
        cadrage: { portrait: { x: K_cles([[0, 0.15], [6.55, 0.2]]) } } },
      // 5 · il passe, au ras de la touche : quatre ombres ; il s'en va
      { de: 19.636, a: 26.182, decor: "stade", entree: "coupe", fixe: 2.6,
        camera: { pos: K_cles([[0, [TOUCHE - 4.2, 1.15, 29.0]], [6.55, [TOUCHE - 4.0, 1.2, 31.0]]], "douce"),
          cible: function (l, pr, c) { var p = c.decors.stade.coureur(c.t); return [p.x, 0.75, p.z]; },
          fov: K_cles([[0, 44], [6.55, 52]], "douce"), epaule: 0.05 } },
      // 6 · le duplex : le crochet, la baie, le stade allumé au loin ; le titre
      { de: 26.182, a: 35.0, decor: "duplex", entree: "coupe", fixe: 3.0,
        camera: { pos: K_cles([[0, [-2.6, 1.4, 4.4]], [8.8, [-2.2, 1.45, 3.9]]], "lin"), cible: K_cles([[0, [1.0, 2.4, -4.0]], [8.8, [1.1, 2.4, -4.0]]], "douce"),
          fov: K_cles([[0, 50], [8.8, 46]], "douce"), epaule: 0.04 },
        cadrage: { portrait: { x: K_cles([[0, 0.2], [8.8, 0.25]]) } } }
    ]
  });

  function K_() { return FC.kit; }
  function K_cles(p, a) { var f = null; return function (t) { if (!f) f = K_().cles(p, a); return f(t); }; }
})(typeof window !== "undefined" ? window : this);
