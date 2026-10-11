  // ═══════════════════════════════════════════════════════════════════════════
  // LA VIE DES PIÈCES ET DES RUES — ville_vie.js, inséré par assemble.js dans la
  // fermeture de ville.js (après ville_jeux.js).
  //
  // Une ville où il se passe quelque chose sans qu'on y touche. Dedans, chacun a
  // ses habitudes selon la pièce : les clients du bar boivent, rient, téléphonent
  // (à partir des portables), changent de table ; le patron écrit l'ardoise ; à
  // l'église on baisse la tête. Dehors, des TABLEAUX VIVANTS
  // (content/ville/tableaux.yaml) devant les lieux, à leur heure : deux fumeurs
  // devant le bar le soir, les gamins au ballon sur la place, les anciens sur leur
  // banc, la file à l'arrêt du car. On peut les toucher : ils disent une parole
  // des gens. Rien de tout cela ne touche le moteur (des gestes à l'écran) ; le
  // tirage des tableaux suit la graine du jour, comme les clients des pièces.
  // ═══════════════════════════════════════════════════════════════════════════
  // Ce que font les gens d'une pièce, selon son ambiance. Un geste peut porter une
  // borne d'époque : « fume<2008 » (on ne fume plus dedans), « telephone>1996 » (le portable).
  var HABITUDES = {
    bar: { client: ["boit", "boit", "boit", "rit", "rit", "fume<2008", "telephone>1996", "lit"], personnel: ["ecrit", "dos", "dos", "pointe", "telephone"], emotes: ["note", "...", "!", "?"] },
    nuit: { client: ["boit", "danse", "danse", "fume", "rit", "telephone>1996"], personnel: ["dos", "boit", "pointe"], emotes: ["note", "coeur", "...", "!"] },
    bureau: { client: ["lit", "ecrit", "telephone>1996", "tete_basse"], personnel: ["ecrit", "ecrit", "telephone", "lit", "pointe"], emotes: ["...", "?", "sueur"] },
    boutique: { client: ["lit", "pointe", "telephone>1996", "tete_basse"], personnel: ["ecrit", "dos", "pointe"], emotes: ["?", "...", "!"] },
    salle: { client: ["lit", "lit", "telephone>1996", "tete_basse", "ecrit"], personnel: ["ecrit", "telephone", "dos"], emotes: ["...", "zzz", "?"] },
    soin: { client: ["tete_basse", "lit", "tete_basse"], personnel: ["ecrit", "lit", "pointe"], emotes: ["sueur", "...", "?"] },
    vestiaire: { client: ["bras_leves", "poing", "ballon", "rit", "tete_basse"], personnel: ["pointe", "ecrit", "bras_leves"], emotes: ["!", "sueur", "colere"] },
    maison: { client: ["lit", "telephone"], personnel: [], emotes: ["zzz", "..."] }
  };
  function annee() { return (vue && vue.year) || 1990; }
  function gesteValide(g) {
    var m = /^([a-z_]+)([<>])(\d+)$/.exec(g);
    if (!m) return g;
    var an = annee(), n = +m[3];
    return (m[2] === "<" ? an < n : an > n) ? m[1] : null;
  }
  function gestesDe(liste) { return (liste || []).map(gesteValide).filter(Boolean); }

  // ─── les habitudes d'une figure : `g.vie` dit ce qu'elle fait de son temps
  function habituer(gens, ambiance) {
    var h = HABITUDES[ambiance] || HABITUDES.salle, t0 = performance.now();
    gens.forEach(function (g, i) {
      if (g.cine || g.conv || g.role === "rdv" || g.role === "mission") return;
      var perso = g.role === "commercant";
      g.vie = { gestes: gestesDe(perso ? h.personnel : h.client), emotes: h.emotes, base: null, bouge: g.role === "client",
        prochain: t0 + 900 + ((i * 1777) % 5200) };
    });
  }
  // l'occupant d'une conversation ou d'une scène ne fait rien d'autre ; celui qui te parle non plus
  function libreDeVivre(g) {
    if (!g.vie || g.cine || g.chemin) return false;
    if (bulle && bulle.g === g) return false;
    if (CONV) for (var k in CONV.voix) if (CONV.voix[k] === g) return false;
    return true;
  }
  function animerGens(gens, ts, dansPiece) {
    for (var i = 0; i < gens.length; i++) {
      var g = gens[i];
      if (g.emote && ts - g.emote.t0 > 2200) g.emote = null;
      if (!libreDeVivre(g)) continue;
      var v = g.vie;
      if (v.finGeste && ts >= v.finGeste) { g.geste = v.base; v.finGeste = 0; }
      if (v.finParle && ts >= v.finParle) { g.parle = false; v.finParle = 0; }
      if (ts < v.prochain) continue;
      v.prochain = ts + 3800 + Math.random() * 7400;
      var r = Math.random();
      if (r < 0.5 && v.gestes && v.gestes.length) {
        // un geste qui dure le temps d'une gorgée, d'un coup de fil, d'une page
        var ge = v.gestes[Math.floor(Math.random() * v.gestes.length)];
        if (ge === "dos" || ge === "tete_basse") v.finGeste = ts + 2200 + Math.random() * 2600;
        else v.finGeste = ts + 1800 + Math.random() * 3400;
        g.geste = ge;
      } else if (r < 0.68 && v.emotes && v.emotes.length) {
        g.emote = { k: v.emotes[Math.floor(Math.random() * v.emotes.length)], t0: ts };
      } else if (r < 0.9) {
        // deux voisins se parlent (sans qu'on entende) : l'un, puis l'autre
        var voisin = voisinDe(g, gens);
        if (voisin && libreDeVivre(voisin)) {
          g.parle = true; v.finParle = ts + 1600 + Math.random() * 1400;
          voisin.vie.finParle = v.finParle + 1500 + Math.random() * 1200;
          setTimeout(function (a) { return function () { if (a.vie && !a.chemin && !(bulle && bulle.g === a)) a.parle = true; }; }(voisin), v.finParle - ts + 120);
          tourner(g, voisin); tourner(voisin, g);
        }
      } else if (dansPiece && v.bouge) {
        changerDePlace(g);
      }
    }
  }
  function voisinDe(g, gens) {
    var cg = caseDe(g.x, g.y), best = null, bd = 99;
    gens.forEach(function (o) {
      if (o === g || !o.vie) return;
      var c = caseDe(o.x, o.y), d = Math.max(Math.abs(c[0] - cg[0]), Math.abs(c[1] - cg[1]));
      if (d < bd && d <= 4) { bd = d; best = o; }
    });
    return best;
  }
  function tourner(a, b) { var dx = b.x - a.x, dy = b.y - a.y; if (Math.abs(dx - dy) > 0.3) a.miroir = (dx - dy) < 0; }
  // un client se lève et va à une autre place libre de la pièce (le zinc, une table)
  function changerDePlace(g) {
    if (!dedans) return false;
    var m = dedans.m, pris = {};
    figurants.forEach(function (x) { if (x.place) pris[x.place] = 1; });
    var libres = Object.keys(m.places).filter(function (n) { return !pris[n] && m.places[n].pour === "client"; });
    if (!libres.length) return false;
    var n = libres[Math.floor(Math.random() * libres.length)], q = m.places[n];
    var de0 = caseDe(g.x, g.y), vers = caseDe(q.x, q.y);
    var a = plusProche(de0[0], de0[1], 6), b = plusProche(vers[0], vers[1], 6);
    if (!a || !b) return false;
    var ch = chemin(a, b);
    if (!ch || ch.length < 2) return false;
    g.place = n; g.pose = null; g.geste = null; g.parle = false;
    g.chemin = [[g.x, g.y]].concat(ch.map(centre)).concat([[q.x, q.y]]); g.i = 0;
    g.vitesse = VITESSE_DEDANS * 0.55;
    g.arrivee = function () { g.x = q.x; g.y = q.y; g.pose = q.pose === "assis" ? "assis" : null; g.miroir = q.miroir; g.vie.prochain = performance.now() + 2500; };
    return true;
  }

  // ─── les tableaux vivants de la rue
  var TABLEAUX = [], cleTableaux = "";
  function tableauOk(t) {
    if (!LIEU[t.lieu] || !LIEU[t.lieu].door) return false;
    if (t.roles && t.roles.length && t.roles.indexOf(S.role) < 0) return false;
    if (t.tranches && t.tranches.length && t.tranches.indexOf(TRANCHES[S.tranche]) < 0) return false;
    if (t.jours && t.jours.length && t.jours.indexOf(JOURS[S.jour]) < 0) return false;
    if (t.si && !siVrai(t.si, t.lieu)) return false;
    return true;
  }
  function poserTableaux() {
    TABLEAUX = [];
    if (!S || dedans || MATCH) return;
    var r = de(hache(S.semaine, S.jour, S.tranche, "tableaux")), parLieu = {};
    (D.tableaux || []).filter(tableauOk).forEach(function (t) { (parLieu[t.lieu] = parLieu[t.lieu] || []).push(t); });
    Object.keys(parLieu).sort().forEach(function (l) {
      var c = parLieu[l], tot = 0;
      c.forEach(function (t) { tot += t.poids || 1; });
      var x = r() * tot, pick = c[0];
      for (var i = 0; i < c.length; i++) { x -= c[i].poids || 1; if (x < 0) { pick = c[i]; break; } }
      // un lieu sur cinq reste calme : la ville ne joue pas tout, tout le temps
      if (r() < 0.2) return;
      installerTableau(pick, r);
    });
  }
  function installerTableau(t, r) {
    var d = LIEU[t.lieu].door, occupees = {};
    for (var id in acteurs) { var ca = caseDe(acteurs[id].x, acteurs[id].y); occupees[ca[0] + "," + ca[1]] = 1; }
    TABLEAUX.forEach(function (q) { var cq = caseDe(q.x, q.y); occupees[cq[0] + "," + cq[1]] = 1; });
    var poses = [];
    t.gens.forEach(function (gd, i) {
      var cell = null;
      if (gd.place) cell = plusProche(d[0] + gd.place[0], d[1] + gd.place[1], 3);
      // sans place : un petit cercle côté rue, à deux ou trois cases de la porte
      for (var k2 = 0; k2 < 16 && (!cell || occupees[cell[0] + "," + cell[1]]); k2++) {
        var a = i * 2.1 + k2 * 0.83, rr = 2 + (k2 % 3) * 0.7;
        cell = plusProche(Math.round(d[0] + 2.5 + Math.cos(a) * rr), Math.round(d[1] + 2.5 + Math.sin(a) * rr), 2);
      }
      if (!cell || occupees[cell[0] + "," + cell[1]]) return;
      occupees[cell[0] + "," + cell[1]] = 1;
      var p = centre(cell), sp = SPRITES[gd.sp] ? gd.sp : (gd.sp === "commercant2" || gd.sp === "garagiste" ? "passant" : "passante");
      var pal = null;
      if (gd.sp === "passant" || gd.sp === "passante") { pal = {}; [PEAUX, MANTEAUX, CHEVEUX].forEach(function (l) { var o = l[Math.floor(r() * l.length)]; for (var kk in o || {}) pal[kk] = o[kk]; }); }
      else if (gd.sp === "enfant" || gd.sp === "fan") pal = PEAUX[Math.floor(r() * PEAUX.length)];
      var g = { tableau: t.id, sp: sp, qui: BOUCHE[gd.sp] || "passant", gens: true, nom: gd.nom || null, x: p[0], y: p[1], miroir: i % 2 === 1, pas: 0, alpha: 1,
        uid: ++UID, lieu: t.lieu, pose: gd.pose || null, geste: gd.geste || null, pal: pal };
      g.vie = { base: gd.geste || null, gestes: gd.geste ? [gd.geste] : [], emotes: gd.emotes || null, prochain: performance.now() + 600 + i * 1300 + r() * 3000 };
      if (!t.parlent) g.vie.solo = true;
      poses.push(g);
      TABLEAUX.push(g);
    });
    // ils se font face (ceux qui parlent) ; les autres regardent la rue
    if (poses.length >= 2 && t.parlent) { tourner(poses[0], poses[1]); tourner(poses[1], poses[0]); for (var j = 2; j < poses.length; j++) tourner(poses[j], poses[0]); }
  }
  function cleDesTableaux() { return S ? S.semaine + ":" + S.jour + ":" + S.tranche + ":" + (dedans ? "d" : "r") + ":" + (MATCH ? "m" : "") : ""; }
  // à chaque image : les tableaux suivent l'heure, chacun vit sa vie (dedans comme dehors)
  function majVie(dt, ts) {
    if (!S) return;
    var cle = cleDesTableaux();
    if (cle !== cleTableaux) { cleTableaux = cle; poserTableaux(); }
    if (CINE || carteOn) return;
    if (dedans) { animerGens(figurants, ts, true); return; }
    // dehors : seuls ceux qu'on voit vivent (et ceux qui parlent ne se parlent qu'entre eux)
    var vus = TABLEAUX.filter(function (g) { return aLEcran(g.x, g.y, 40); });
    animerGens(vus.filter(function (g) { return !g.vie.solo; }), ts, false);
    animerSolos(vus.filter(function (g) { return g.vie.solo; }), ts);
  }
  // un tableau sans conversation : le geste de fond, une émotion de temps en temps
  function animerSolos(gens, ts) {
    gens.forEach(function (g) {
      if (g.emote && ts - g.emote.t0 > 2200) g.emote = null;
      if (!libreDeVivre(g)) return;
      var v = g.vie;
      if (ts < v.prochain) return;
      v.prochain = ts + 5200 + Math.random() * 8000;
      if (v.emotes && v.emotes.length && Math.random() < 0.6) g.emote = { k: v.emotes[Math.floor(Math.random() * v.emotes.length)], t0: ts };
    });
  }
  // ceux qu'on dessine : les tableaux à l'écran, sauf pendant une scène jouée
  function gensDesTableaux() {
    if (dedans || MATCH || CINE || carteOn) return [];
    return TABLEAUX.filter(function (g) { return aLEcran(g.x, g.y, 30); });
  }
