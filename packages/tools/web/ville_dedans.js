  // ═══════════════════════════════════════════════════════════════════════════
  // LES INTÉRIEURS — ville_dedans.js, inséré par assemble.js dans la fermeture de
  // ville.js (au repère `__VILLE_MODULES__`) : il voit et touche tout ce que la
  // ville connaît. On entre dans un lieu, on y marche, on touche ses objets.
  //
  // Une pièce est une petite carte (packages/tools/web/interieurs/, rendue par
  // docs/design/pixel_iso/interieurs_jeu.js) : son image de jour et de nuit, sa
  // profondeur, sa grille, sa porte, ses objets et ses places. Entrer met la ville
  // de côté (projection, grille, passants) et pose la pièce à sa place : le
  // dessin, la marche, la profondeur et les bulles gardent le même code.
  // ═══════════════════════════════════════════════════════════════════════════
  var INT = {};            // cle → la pièce (interieurs.json)
  var dedans = null;       // { cle, m, ville (ce qu'on a mis de côté), cleOcc }
  var VITESSE_DEDANS = 17; // voxels par seconde : on traverse une pièce en trois secondes
  var TEINTE_DEDANS = { jour: [1, 0.98, 0.95], crepuscule: [0.94, 0.86, 0.76], nuit: [0.88, 0.79, 0.70] };
  // combien de clients selon l'heure (matin, midi, après-midi, soir, nuit)
  var CLIENTS = { bar: [1, 3, 2, 5, 4], bureau: [1, 2, 2, 1, 0], maison: [0, 0, 0, 0, 0], vestiaire: [1, 2, 2, 1, 0],
    boutique: [1, 2, 2, 1, 0], salle: [1, 2, 2, 2, 1], soin: [1, 2, 1, 0, 0], nuit: [0, 0, 1, 3, 5] };

  function aInterieur(cle) { return !!(cle && INT[cle]); }
  function grilleDe(m) {
    if (m._g) return m._g;
    var bits = atob(m.bits), N = m.size * m.size, g = new Uint8Array(N);
    for (var i = 0; i < N; i++) g[i] = (bits.charCodeAt(i >> 3) >> (i & 7)) & 1;
    return (m._g = g);
  }
  function nomImageDedans(amb) { return "int_" + dedans.cle + "_" + (amb === "jour" ? "jour" : "nuit"); }
  // où l'on est dans la ville (dedans : devant la porte du lieu)
  function posVille() {
    if (dedans && LIEU[dedans.cle] && LIEU[dedans.cle].door) return centre(LIEU[dedans.cle].door);
    return [heros.x, heros.y];
  }
  // la caméra, dedans : la pièce entière au milieu de la bande quand elle y tient, sinon le
  // héros, sans jamais montrer le noir au-delà des murs
  function viseeDedans() {
    var m = dedans.m, p = versImage(heros.x, heros.y, ZSOL + 8);
    var bande = VH - (UI.haut + UI.bas) / k, cx, cy;
    cx = m.w <= VW ? m.w / 2 : clamp(p[0], VW / 2, m.w - VW / 2);
    cy = m.h <= bande ? m.h / 2 : clamp(p[1], bande / 2, m.h - bande / 2);
    return [cx, cy - UI.decal / k];
  }

  // ─── entrer, sortir
  function entrer(cle) {
    var m = INT[cle];
    if (!m) return false;
    if (dedans && dedans.cle === cle) return true;
    if (dedans) aDehors(true);
    dedans = { cle: cle, m: m, cleOcc: "", ville: { P: P, G: G, CELL: CELL, grille: grille, LARGE: LARGE, ZSOL: ZSOL, TUILE: TUILE, COLS: COLS, RANGS: RANGS, passants: passants, acteurs: acteurs } };
    P = { cu: m.cu, cv: m.cv, zl: 0, w: m.w, h: m.h };
    G = m.size; CELL = m.cell; grille = grilleDe(m); calculerLarge(); ZSOL = m.zsol;
    TUILE = Math.max(m.w, m.h) + 2; COLS = 1; RANGS = 1;
    passants = []; acteurs = {}; figurants = [];
    ["jour", "nuit", "prof"].forEach(function (s) { img("int_" + cle + "_" + s); });
    amb0 = ambiance(); fondu = 1;
    S.lieu = cle; S.dedans = cle;
    var c = centre(m.porte);
    heros.x = c[0]; heros.y = c[1]; heros.chemin = null; heros.arrivee = null; heros.miroir = true;
    bulle = null;
    occuper();
    cam.libre = false;
    var p = viseeDedans(); cam.x = p[0]; cam.y = p[1];
    fermerPorte();
    document.body.classList.add("v-dedans");
    cartoucheLieu(cle);
    if (coquille && coquille.ambiance) coquille.ambiance(m.ambiance);
    majHud(); sauver();
    return true;
  }
  // revenir dans la ville, sans fondu (l'appelant est déjà au noir) ; `sansPoser` : on va
  // ailleurs tout de suite (une autre pièce, une scène qui pose le héros elle-même)
  function aDehors(sansPoser) {
    if (!dedans) return;
    var v = dedans.ville, cle = dedans.cle;
    P = v.P; G = v.G; CELL = v.CELL; grille = v.grille; LARGE = v.LARGE; ZSOL = v.ZSOL; TUILE = v.TUILE; COLS = v.COLS; RANGS = v.RANGS;
    passants = v.passants || []; acteurs = v.acteurs || {}; figurants = [];
    dedans = null; S.dedans = null; bulle = null;
    document.body.classList.remove("v-dedans");
    amb0 = ambiance(); fondu = 1;
    for (var key in etiquettesDedans) etiquettesDedans[key].hidden = true;
    if (coquille && coquille.ambiance) coquille.ambiance(null);
    if (sansPoser) return;
    var l = LIEU[cle];
    if (l && l.door) { var c = centre(l.door); poser(c[0], c[1]); } else poser(S.x, S.y);
    S.lieu = cle;
    recaler();
    cam.libre = false;
    var p = visee(); cam.x = p[0]; cam.y = p[1];
  }
  function poserEnVille(x, y) { if (dedans) aDehors(true); poser(x, y); }
  // un fondu court : on passe une porte
  function fonduVite(auNoir, ensuite) {
    var f = $("villeFondu");
    f.querySelector("b").textContent = ""; f.querySelector("span").textContent = "";
    var p = f.querySelector("p"); p.textContent = ""; p.hidden = true;
    f.classList.add("vite"); f.classList.add("on");
    setTimeout(function () {
      if (auNoir) auNoir();
      setTimeout(function () { f.classList.remove("on"); setTimeout(function () { f.classList.remove("vite"); if (ensuite) ensuite(); }, 200); }, 140);
    }, 210);
  }
  function entrerAvecFondu(cle, suite) {
    if (occupe) return;
    occupe = true;
    fonduVite(function () { entrer(cle); }, function () { occupe = false; if (suite) suite(); });
  }
  function sortir(suite) {
    if (!dedans) { if (suite) suite(); return; }
    if (occupe || carteOn) return;
    occupe = true; fermerPorte();
    fonduVite(function () { aDehors(); majHud(); sauver(); }, function () { occupe = false; if (suite) suite(); });
  }
  // ce qui arrive quand on entre : celui qui t'attend, la mission, ou le lieu lui-même
  function arriveeDedans() {
    if (!dedans) return;
    var cle = dedans.cle;
    // une scène attend ici (`quand: lieu`) : on la regarde d'abord
    var cl = !carteOn ? cineDeLieu(cle) : null;
    if (cl) { jouerCine(cl, arriveeDedans); return; }
    if (rdv && !carteOn && rdv.lieu === cle && tNow() >= rdv.debut) {
      if (rdv.force === "scene" || rdv.sombre) { scene(rdv); return; }
      var g = occupantRdv();
      if (g) { allerVers(g, function () { if (rdv && rdv.lieu === cle && !carteOn) montrerCarte(); }); return; }
      montrerCarte();
      return;
    }
    if (S.mission && !S.mission.offre && missionIci(cle)) { ouvrirMission(cle); return; }
    proposer(cle);
  }
  function occupantRdv() {
    for (var i = 0; i < figurants.length; i++) if (figurants[i].role === "rdv") return figurants[i];
    return null;
  }
  // aller jusqu'à quelqu'un (la case libre la plus proche, de préférence devant lui)
  function allerVers(g, quandArrive) {
    var gc = caseDe(g.x, g.y), hc = caseDe(heros.x, heros.y);
    if (Math.max(Math.abs(hc[0] - gc[0]), Math.abs(hc[1] - gc[1])) <= 2) { heros.chemin = null; tourneVers(g); if (quandArrive) quandArrive(); return; }
    var cible = plusProche(gc[0] + 1, gc[1] + 1, 6) || plusProche(gc[0], gc[1], 6);
    if (!cible || !allerA(cible[0], cible[1], function () { tourneVers(g); if (quandArrive) quandArrive(); })) { if (quandArrive) quandArrive(); }
  }
  function tourneVers(g) {
    var dx = g.x - heros.x, dy = g.y - heros.y;
    if (Math.abs(dx - dy) > 0.3) heros.miroir = (dx - dy) < 0;
    var ex = heros.x - g.x, ey = heros.y - g.y;
    if (Math.abs(ex - ey) > 0.3) g.miroir = (ex - ey) < 0;
  }

  // ─── qui est là
  function cleOccupation() { return S.semaine + ":" + S.jour + ":" + S.tranche + ":" + (rdv ? rdv.cle + (tNow() >= rdv.debut ? "+" : "-") : "") + ":" + (S.mission ? S.mission.id + S.mission.offre : ""); }
  function occuper() {
    if (!dedans) return;
    var m = dedans.m, cle = dedans.cle, tr = TRANCHES[S.tranche];
    dedans.cleOcc = cleOccupation();
    var noms = Object.keys(m.places), pris = {}, deja = {}, out = [];
    // les acteurs d'une scène en cours restent où la scène les a mis
    figurants.forEach(function (g) { if (g.cine) { out.push(g); if (g.place) pris[g.place] = 1; deja[g.qui] = 1; } });
    function libre(test) { for (var i = 0; i < noms.length; i++) { var n = noms[i]; if (!pris[n] && test(m.places[n])) return n; } return null; }
    function poserQui(w) {
      var n = null;
      if (w.role === "client") n = libre(function (q) { return q.pour === "client"; });
      else if (w.role === "commercant") n = libre(function (q) { return q.pour === "personnel"; });
      // celui qui tient le lieu (la ville vivante) : sa place à lui, sinon celle du personnel
      else if (w.role === "tenancier") n = libre(function (q) { return q.pour === w.qui; }) || libre(function (q) { return q.pour === "personnel"; }) ||
        libre(function (q) { return q.pour === "visiteur"; }) || libre(function (q) { return q.pour === "client"; });
      else n = libre(function (q) { return q.pour === w.qui; }) || libre(function (q) { return q.pour === "visiteur"; }) || libre(function (q) { return q.pour === "client"; });
      if (!n) return null;
      pris[n] = 1; deja[w.qui] = 1;
      var q = m.places[n];
      var g = { id: w.id, sp: w.sp, qui: w.qui, role: w.role, x: q.x, y: q.y, miroir: q.miroir, pose: q.pose, pas: 0, alpha: 1, lieu: cle, place: n, uid: ++UID, pal: w.pal, gens: w.gens };
      out.push(g);
      return g;
    }
    if (rdv && rdv.lieu === cle && rdv.qui && !rdv.sombre && tNow() >= rdv.debut && spriteDe(rdv.qui)) poserQui({ id: rdv.qui, sp: spriteDe(rdv.qui), qui: rdv.qui, role: "rdv" });
    var cast = {};
    ((vue && vue.cast) || []).forEach(function (q) { cast[q] = 1; });
    var statuts = (vue && vue.statuts) || {};
    (D.presences || []).forEach(function (p) {
      if (p.lieu !== cle || deja[p.qui] || !spriteDe(p.qui)) return;
      var st = statuts[p.qui];
      if (st === "mort" || st === "parti" || st === "vendu" || st === "rival") return;
      if (!(cast[p.qui] || S.vus[p.qui])) return;
      if (p.tranches && p.tranches.length && p.tranches.indexOf(tr) < 0) return;
      if (p.si && !siVrai(p.si, p.lieu)) return;
      poserQui({ id: p.qui, sp: spriteDe(p.qui), qui: p.qui, role: "presence" });
    });
    var sm = S.mission, mm = sm && sm.offre && sm.lieu === cle && MISSION[sm.id];
    if (mm) { var spd = (mm.donneur && mm.donneur.sprite) || "inconnu"; poserQui({ id: "mission", sp: SPRITES[spd] ? spd : "inconnu", qui: "mission", role: "mission" }); }
    var def = TEXTE_LIEU[cle] || {}, ouvertIci = ouvert(def), tient = false;
    // les gens d'Aubérive (ville_gens.js) : celui qui tient le lieu à cette époque, puis ses habitués
    gensDuLieu(cle).forEach(function (g, i) {
      if (deja[g.id] && i === 0) tient = true;      // déjà là (il t'attend, ou c'est un visage du livre)
      if (deja[g.id] || !spriteDe(g.id)) return;
      if (poserQui({ id: "gens_" + g.id, sp: spriteDe(g.id), qui: g.id, role: i === 0 ? "tenancier" : "gensville" }) && i === 0) tient = true;
    });
    // celui qui tient la pièce : son personnel à elle (la barmaid du Rideau Rouge, pas le portier
    // de la rue), sinon le commerçant qu'on voit devant la porte
    if (tient) { /* le lieu a son visage */ }
    else if (ouvertIci && m.personnel && SPRITES[m.personnel]) poserQui({ id: "com_" + cle, sp: m.personnel, qui: BOUCHE[m.personnel] || "commercant", role: "commercant", gens: true });
    else COMMERCES.forEach(function (c) { if (c.lieu === cle && SPRITES[c.sp] && ouvertIci) poserQui({ id: "com_" + cle, sp: c.sp, qui: BOUCHE[c.sp] || "commercant", role: "commercant", gens: true }); });
    if (ouvertIci) {
      var r = de(hache(S.semaine, S.jour, S.tranche, cle, "clients")), n = (CLIENTS[m.ambiance] || CLIENTS.salle)[S.tranche] || 0;
      n = Math.round(n * (0.6 + r() * 0.8));
      var SIL = ["passant", "passante", "passant", "passante", "ancien", "fan"];
      for (var i = 0; i < n; i++) {
        var sp = SIL[Math.floor(r() * SIL.length)], pal = {};
        [PEAUX, MANTEAUX, CHEVEUX].forEach(function (l) { var o = l[Math.floor(r() * l.length)]; for (var kk in o || {}) pal[kk] = o[kk]; });
        poserQui({ id: "client" + i, sp: sp, qui: BOUCHE[sp] || "passant", role: "client", gens: true, pal: pal });
      }
    }
    figurants = out;
    habituer(out, m.ambiance);
  }

  // ─── les objets et la porte : des noms qui flottent, qu'on touche
  var etiquettesDedans = {};
  function objetsIci() { return dedans ? dedans.m.objets : []; }
  function placerEtiquettesDedans() {
    var couche = $("villeCouche");
    if (!couche || !dedans) return;
    for (var c0 in etiquettes) etiquettes[c0].hidden = true;
    if (fleche) fleche.hidden = true;
    majBulle();
    var x0 = cam.x - VW / 2, y0 = cam.y - VH / 2, pris = [], bb = boiteBulle(), vus = {};
    var cands = objetsIci().map(function (o) { var p = versImage(o.x, o.y, o.z + 3); return { cle: "o:" + o.id, nom: o.label, o: o, sx: (p[0] - x0) * k, sy: (p[1] - y0) * k }; });
    var pc = centre(dedans.m.porte), pp = versImage(pc[0], pc[1], ZSOL);
    cands.unshift({ cle: "sortie", nom: "Sortir", sortie: true, sx: (pp[0] - x0) * k, sy: (pp[1] - y0) * k + 22 });
    cands.forEach(function (c) {
      var e = etiquettesDedans[c.cle];
      if (!e) {
        e = document.createElement("button");
        e.type = "button"; e.className = "v-lieu v-obj" + (c.sortie ? " v-sortie" : "");
        e.addEventListener("click", (function (cc) { return function (ev) { ev.stopPropagation(); if (carteOn || occupe) return; if (cc.sortie) allerSortir(); else allerObjet(cc.o); }; })(c));
        couche.appendChild(e); etiquettesDedans[c.cle] = e;
      }
      if (e.textContent !== c.nom) { e.textContent = c.nom; e.hidden = false; e._w = e.offsetWidth; e._h = e.offsetHeight; }
      e._o = c.o || null;
      var ew = e._w || 80, eh = e._h || 20, x = clamp(c.sx, ew / 2 + 6, VW * k - ew / 2 - 6), place = null;
      var crans = [0, -(eh + 3), eh + 3, -2 * (eh + 3)];
      for (var n = 0; n < crans.length && !place; n++) {
        var t = c.sy + crans[n], boite = [x - ew / 2, t - eh, x + ew / 2, t];
        if (t - eh < UI.haut + 4 || t > VH * k - UI.bas) continue;
        if (!chevauche(boite, pris, bb)) place = { t: t, boite: boite };
      }
      if (!place) { e.hidden = true; return; }
      pris.push(place.boite); vus[c.cle] = 1;
      e.style.left = Math.round(x) + "px"; e.style.top = Math.round(place.t) + "px";
      e.hidden = false;
    });
    for (var key in etiquettesDedans) if (!vus[key]) etiquettesDedans[key].hidden = true;
  }
  function allerObjet(o) {
    var a = o.acces, hc = caseDe(heros.x, heros.y);
    fermerPorte();
    if (hc[0] === a[0] && hc[1] === a[1] && !heros.chemin) { tourneVersPoint(o.x, o.y); ouvrirObjet(o); return; }
    allerA(a[0], a[1], function () { tourneVersPoint(o.x, o.y); ouvrirObjet(o); });
  }
  function tourneVersPoint(x, y) { var dx = x - heros.x, dy = y - heros.y; if (Math.abs(dx - dy) > 0.3) heros.miroir = (dx - dy) < 0; }
  function allerSortir() {
    var a = dedans.m.porte, hc = caseDe(heros.x, heros.y);
    fermerPorte();
    if (Math.abs(hc[0] - a[0]) + Math.abs(hc[1] - a[1]) <= 1 && !heros.chemin) { sortir(); return; }
    allerA(a[0], a[1], function () { sortir(); });
  }
  // un objet touché : ce qu'on y fait (les activités qui le nomment), sinon le lieu entier
  function ouvrirObjet(o) {
    if (!dedans || carteOn || occupe) return;
    var cle = dedans.cle;
    if (window.FusibleVilleJeux && window.FusibleVilleJeux.objet && window.FusibleVilleJeux.objet(o, cle)) return;
    ouvrirPorte(cle, null, o);
  }
  // un geste dans la pièce : quelqu'un (déjà traité), un objet, la porte, sinon le sol
  function toucherDedans(u, v) {
    var best = null, bd = 13 * 13;
    objetsIci().forEach(function (o) {
      var p = versImage(o.x, o.y, o.z), d = (p[0] - u) * (p[0] - u) + (p[1] - v) * (p[1] - v);
      if (d < bd) { bd = d; best = o; }
    });
    if (best) { allerObjet(best); return; }
    var pc = centre(dedans.m.porte), pp = versImage(pc[0], pc[1], ZSOL);
    if ((pp[0] - u) * (pp[0] - u) + (pp[1] - v) * (pp[1] - v) < 10 * 10) { allerSortir(); return; }
    var s = versSol(u, v), c = caseDe(s[0], s[1]), cible = plusProche(c[0], c[1], 6);
    if (cible) allerA(cible[0], cible[1], null);
  }
  function toucherQuelquunDedans(g) {
    if (g.role === "rdv") { allerVers(g, function () { if (rdv && !carteOn && tNow() >= rdv.debut) montrerCarte(); }); return; }
    if (g.role === "mission") { allerVers(g, function () { ouvrirMission(dedans.cle); }); return; }
    if (g.cine) return;
    var hc = caseDe(heros.x, heros.y), gc = caseDe(g.x, g.y);
    if (Math.max(Math.abs(hc[0] - gc[0]), Math.abs(hc[1] - gc[1])) <= 3) { heros.chemin = null; tourneVers(g); parler(g); return; }
    allerVers(g, function () { parler(g); });
  }
  // le nom du lieu, en haut, le temps d'entrer
  var cartoucheT = 0;
  function cartoucheLieu(cle) {
    var el = $("villeLieu");
    if (!el) return;
    var l = LIEU[cle], m = INT[cle];
    var vu = (D.lieux_variantes || []).filter(function (v) { return v.lieu === cle && siVrai(v.si, cle); })[0];
    var def = TEXTE_LIEU[cle] || {};
    el.querySelector("b").textContent = (l ? nomLieu(l) : (m && m.nom) || "");
    el.querySelector("span").textContent = vu ? remplir(vu.texte) : (def.texte || "");
    el.classList.add("on");
    clearTimeout(cartoucheT);
    cartoucheT = setTimeout(function () { el.classList.remove("on"); }, 5200);
  }
  // une carte s'ouvre : le nom du lieu s'efface (il se lisait par-dessus son texte quand la
  // carte attendait dans la pièce où l'on vient d'entrer), et ne revient pas après elle
  function cacherCartouche() {
    clearTimeout(cartoucheT);
    var el = $("villeLieu");
    if (el) el.classList.remove("on");
  }
  // à chaque image : les gens de la pièce suivent l'heure
  function majDedans(dt, ts) {
    if (!dedans) return;
    if (!occupe && !carteOn && dedans.cleOcc !== cleOccupation()) occuper();
    for (var i = 0; i < figurants.length; i++) {
      var g = figurants[i];
      if (g.chemin && !g.cine) marcherFigurant(g, dt);
    }
  }
  // un figurant qui marche (une scène le fait aller d'une place à l'autre)
  function marcherFigurant(g, dt) {
    var reste = (g.vitesse || VITESSE_DEDANS * 0.8) * dt;
    while (reste > 0 && g.chemin) {
      var cible = g.chemin[g.i + 1];
      if (!cible) { g.chemin = null; g.pas = 0; var f = g.arrivee; g.arrivee = null; if (f) f(); return; }
      var dx = cible[0] - g.x, dy = cible[1] - g.y, d = Math.hypot(dx, dy);
      if (d <= reste) { g.x = cible[0]; g.y = cible[1]; g.i++; reste -= d; } else { g.x += dx / d * reste; g.y += dy / d * reste; reste = 0; }
      if (Math.abs(dx - dy) > 0.01) g.miroir = (dx - dy) < 0;
    }
    g.dist = (g.dist || 0) + (g.vitesse || VITESSE_DEDANS * 0.8) * dt;
    var ph = Math.floor(g.dist / 4) % 4;
    g.pas = ph === 1 ? 1 : ph === 3 ? -1 : 0;
  }
