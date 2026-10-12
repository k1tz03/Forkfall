  // ═══════════════════════════════════════════════════════════════════════════
  // LES SCÈNES JOUÉES ET LES CONVERSATIONS — ville_cinema.js, inséré par
  // assemble.js dans la fermeture de ville.js (après ville_dedans.js).
  //
  // Une scène jouée (content/ville/cinematiques_*.yaml) ne se joue pas : on la
  // regarde. Des personnages, posés dans une pièce ou devant un lieu, marchent,
  // se tournent, font un geste et se parlent de ce qui arrive — l'introduction
  // d'une histoire, ce qui suit une carte, ce qu'on surprend en entrant. La
  // grammaire est celle des cases de Final Fantasy Tactics (les figurines sur la
  // carte, la boîte de dialogue et son portrait) et le ton celui de Hotline Miami
  // (le noir, le néon de l'histoire, les mots qui tombent un à un).
  //
  // Une conversation surprise (`conversations`) se joue sans arrêter personne :
  // deux ou trois voix qui parlent entre elles, en bulles, quand on passe près.
  // ═══════════════════════════════════════════════════════════════════════════
  var CINE = null;              // la scène en cours
  var CONV = null;              // la conversation qu'on entend
  var CHAR_PAR_S = 46;          // la vitesse des mots qui tombent
  var GENS_SP = { passant: 1, passante: 1, enfant: 1, fan: 1, ancien: 1, commercant: 1, commercant2: 1, inconnu: 1, garagiste: 1, portier: 1 };

  function cineOk(c) {
    if (!S || !c) return false;
    if (S.cinesVues && S.cinesVues[c.id]) return false;
    if (c.roles && c.roles.length && c.roles.indexOf(S.role) < 0) return false;
    if (c.si && !siVrai(c.si, c.lieu && c.lieu !== "ici" ? c.lieu : null)) return false;
    return true;
  }
  function cinesDe(quand, filtre) {
    return (D.cinematiques || []).filter(function (c) { return c.quand === quand && (!filtre || filtre(c)) && cineOk(c); });
  }
  // la carte qu'on va montrer (ou qu'on vient de jouer) a sa scène, avant ou après
  function cineDeCarte(id, moment) {
    if (!id) return null;
    return cinesDe("carte", function (c) {
      if ((c.moment || "avant") !== moment) return false;
      return (c.cartes && c.cartes.indexOf(id) >= 0) || (c.prefixe && id.indexOf(c.prefixe) === 0);
    })[0] || null;
  }
  // une scène qu'un drapeau vient d'ouvrir (la première dans l'ordre du fichier)
  function cineDeDrapeau() {
    var fl = (vue && vue.flags) || [];
    return cinesDe("drapeau", function (c) { return fl.indexOf(c.drapeau) >= 0; })[0] || null;
  }
  function cineDeLieu(cle) { return cinesDe("lieu", function (c) { return c.lieu === cle; })[0] || null; }
  function cineIntro() { return cinesDe("debut")[0] || null; }
  function cineParId(id) { return (D.cinematiques || []).filter(function (c) { return c.id === id; })[0] || null; }

  // ─── l'interface : les bandes noires, le titre, la boîte de dialogue
  function uiCine() {
    var el = $("villeCine");
    if (el) return el;
    el = document.createElement("div"); el.className = "v-cine"; el.id = "villeCine"; el.hidden = true;
    el.setAttribute("role", "dialog"); el.setAttribute("aria-label", "Une scène");
    el.innerHTML = '<div class="v-cine-bande haut"></div><div class="v-cine-bande bas"></div>' +
      '<div class="v-cine-titre" hidden><b></b><span></span></div>' +
      '<div class="v-cine-boite" hidden><div class="v-cine-visage"></div><div class="v-cine-mots"><b class="v-cine-nom"></b><p aria-live="polite"></p><i class="v-cine-suite">▼</i></div></div>' +
      '<div class="v-cine-flash"></div>' +
      '<button type="button" class="v-cine-passer">Passer ›</button>';
    document.body.appendChild(el);
    el.addEventListener("click", function (e) { if (e.target.closest(".v-cine-passer")) return; tapeCine(); });
    el.querySelector(".v-cine-passer").addEventListener("click", function (e) { e.stopPropagation(); finCine(true); });
    document.addEventListener("keydown", function (e) {
      if (!CINE) return;
      if (e.key === "Escape") { e.preventDefault(); finCine(true); }
      else if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") { e.preventDefault(); tapeCine(); }
    });
    return el;
  }
  function couleurCine() { return (coquille && coquille.couleur && coquille.couleur()) || "#E0164B"; }

  // ─── jouer une scène
  function jouerCine(c, ensuite) {
    if (!c || CINE || !S) { if (ensuite) ensuite(); return; }
    S.cinesVues = S.cinesVues || {};
    S.cinesVues[c.id] = 1;
    CINE = { c: c, i: -1, ensuite: ensuite || null, attend: null, frappe: null, amb: c.tranche ? AMBIANCE[c.tranche] : null, musique: null, meteo: c.meteo || null };
    if (CONV) finConv();
    occupe = true; fermerPorte(); bulle = null; heros.chemin = null;
    var el = uiCine();
    el.style.setProperty("--cine", couleurCine());
    el.hidden = false;
    el.querySelector(".v-cine-boite").hidden = true;
    el.querySelector(".v-cine-titre").hidden = true;
    document.body.classList.add("v-cine-on");
    requestAnimationFrame(function () { el.classList.add("on"); });
    if (c.titre) carteTitre(c.titre, c.sous || "", function () { installerScene(c); }, etapeSuivante);
    else fonduVite(function () { installerScene(c); }, etapeSuivante);
    sonVille();
    sauver();
  }
  // le décor et la distribution, posés pendant le noir
  function installerScene(c) {
    if (!CINE) return;
    var lieu = c.lieu && c.lieu !== "ici" ? c.lieu : null;
    if (lieu) {
      if (aInterieur(lieu)) { entrer(lieu); var vl = $("villeLieu"); if (vl) vl.classList.remove("on"); }
      else if (LIEU[lieu] && LIEU[lieu].door) { var c0 = centre(LIEU[lieu].door); poserEnVille(c0[0], c0[1]); S.lieu = lieu; recaler(); }
    }
    // dedans : les gens de la pièce sont ceux de l'heure de la scène (la nuit, le club-house est
    // vide ; le soir, le bar est plein), ou personne (`vide: true`) ; le temps de la ville ne bouge pas
    if (dedans) {
      var t0 = S.tranche, tc = c.tranche ? TRANCHES.indexOf(c.tranche) : -1;
      if (tc >= 0) S.tranche = tc;
      occuper();
      S.tranche = t0;
      if (c.vide) figurants = figurants.filter(function (g) { return g.cine; });
    }
    var ids = {}, autres = figurants.filter(function (g) { return !g.cine; }), libres = dedans ? null : placesDe(lieu || lieuProche() || "appartement").slice();
    (c.acteurs || []).forEach(function (a, i) {
      var pos = positionScene(a.place, i, libres), m = pos.place;
      if (a.qui === "toi") {
        heros.x = pos.x; heros.y = pos.y; heros.chemin = null;
        if (m && m.miroir != null) heros.miroir = m.miroir;
        if (a.regarde) heros.miroir = a.regarde === "gauche";
        return;
      }
      var sp = GENS_SP[a.qui] ? (SPRITES[a.qui] ? a.qui : "passant") : spriteDe(a.qui) || "passant";
      // un occupant qui joue dans la scène laisse sa place à son rôle ; un client assis à la
      // place d'un acteur la lui cède (il s'en va)
      autres = autres.filter(function (g) { return g.qui !== a.qui && !(typeof a.place === "string" && g.place === a.place && g.role !== "rdv"); });
      var g = { cine: true, id: a.id, sp: sp, qui: a.qui, nom: a.nom || null, x: pos.x, y: pos.y, miroir: m ? !!m.miroir : (i % 2 === 0),
        pose: a.pose || (m && m.pose) || null, pas: 0, alpha: a.cache ? 0 : 1, cache: !!a.cache, uid: ++UID, place: typeof a.place === "string" ? a.place : null, lieu: lieu };
      if (a.regarde) g.miroir = a.regarde === "gauche";
      ids[a.id] = g;
    });
    figurants = autres.concat(Object.keys(ids).map(function (k) { return ids[k]; }));
    CINE.acteurs = ids;
    // la caméra : un cran plus près, sur le groupe ; elle glissera vers celui qui parle
    cam.libre = false;
    CINE.pres = true; CINE.cible = null; taille();
    var p = visee(); cam.x = p[0]; cam.y = p[1];
  }
  // où regarde la caméra d'une scène : celui qui parle, sinon le groupe ; dans une pièce, sans
  // jamais montrer le noir au-delà des murs quand la pièce est plus large que l'écran
  function viseeCine() {
    var a = CINE.cible, pts = [];
    // celui qui parle, et celui à qui il répond s'il tient dans le même cadre
    if (a) {
      pts.push(a);
      var b = CINE.avant;
      if (b && b !== a && (b.alpha == null || b.alpha > 0.3)) {
        var pa = versImage(a.x, a.y, ZSOL), pb = versImage(b.x, b.y, ZSOL);
        if (Math.abs(pa[0] - pb[0]) < VW * 0.7 && Math.abs(pa[1] - pb[1]) < VH * 0.45) pts.push(b);
      }
    }
    else { pts.push(heros); for (var id in CINE.acteurs || {}) if (CINE.acteurs[id].alpha > 0.3) pts.push(CINE.acteurs[id]); }
    if (!pts.length) return null;
    var sx = 0, sy = 0;
    pts.forEach(function (q) { var pi = versImage(q.x, q.y, ZSOL + 8); sx += pi[0]; sy += pi[1]; });
    var cx = sx / pts.length, cy = sy / pts.length;
    if (dedans) {
      var m = dedans.m, bande = VH - (UI.haut + UI.bas) / k;
      cx = m.w <= VW ? m.w / 2 : clamp(cx, VW / 2, m.w - VW / 2);
      cy = m.h <= bande ? m.h / 2 : clamp(cy, bande / 2, m.h - bande / 2);
    }
    return [cx, cy - UI.decal / k];
  }
  // une place nommée de la pièce, la porte, le centre, ou un décalage en cases ([dx, dy]) ;
  // dehors : autour de la porte du lieu
  function positionScene(place, i, libres) {
    if (dedans) {
      var m = dedans.m;
      if (typeof place === "string" && m.places[place]) { var q = m.places[place]; return { x: q.x, y: q.y, place: q }; }
      if (place === "porte" || place == null && i < 0) { var cp = centre(m.porte); return { x: cp[0], y: cp[1] }; }
      var c0 = [Math.floor(m.size / 2), Math.floor(m.size / 2)];
      var cc = plusProche(c0[0], c0[1], 12) || m.porte;
      if (Array.isArray(place)) { var n = plusProche(cc[0] + place[0], cc[1] + place[1], 6) || cc; var cn = centre(n); return { x: cn[0], y: cn[1] }; }
      if (place === "centre") { var ce = centre(cc); return { x: ce[0], y: ce[1] }; }
      // sans place : la première place libre de la pièce, dans l'ordre du fichier
      var noms = Object.keys(m.places), pris = {};
      figurants.forEach(function (g) { if (g.place) pris[g.place] = 1; });
      for (var j = 0; j < noms.length; j++) if (!pris[noms[j]]) { var qq = m.places[noms[j]]; return { x: qq.x, y: qq.y, place: qq }; }
      var c1 = centre(cc); return { x: c1[0], y: c1[1] };
    }
    var l = LIEU[S.lieu] || LIEU[chezToi()];
    var porte = l && l.door ? l.door : caseDe(heros.x, heros.y);
    if (Array.isArray(place)) { var n2 = plusProche(porte[0] + place[0], porte[1] + place[1], 6) || porte; var c2 = centre(n2); return { x: c2[0], y: c2[1] }; }
    if (place === "porte") { var c3 = centre(porte); return { x: c3[0], y: c3[1] }; }
    if (place === "centre") { var n3 = plusProche(porte[0] + 2, porte[1] + 2, 6) || porte; var c4 = centre(n3); return { x: c4[0], y: c4[1] }; }
    if (libres && libres.length) { var pl = libres.shift(); return { x: pl[0], y: pl[1] }; }
    var n4 = plusProche(porte[0] + 1 + i, porte[1] + 2 - i, 6) || porte; var c5 = centre(n4); return { x: c5[0], y: c5[1] };
  }
  function acteur(id) {
    if (!CINE) return null;
    if (id === "toi") return heros;
    return CINE.acteurs[id] || null;
  }
  function etapeSuivante() {
    if (!CINE) return;
    CINE.attend = null;
    CINE.i++;
    var st = CINE.c.etapes[CINE.i];
    if (!st) { finCine(false); return; }
    try { executer(st); } catch (e) { etapeSuivante(); }
  }
  function apres(ms) { var c = CINE; setTimeout(function () { if (CINE === c) etapeSuivante(); }, ms); }
  function executer(st) {
    var a = st.qui ? acteur(st.qui) : null, el = uiCine();
    // ce qui accompagne une réplique : un geste, une émotion
    if (a && st.geste && st.dit == null) {
      a.geste = st.geste === "debout" ? null : st.geste;
      if (st.geste === "assis") { a.pose = "assis"; a.geste = null; }
      if (st.geste === "debout") {
        // se lever, c'est sortir de sa chaise : un pas vers la case libre la plus proche
        if (a.pose === "assis") { var cs = caseDe(a.x, a.y), lb = plusProche(cs[0], cs[1], 4); if (lb) { var cl = centre(lb); a.x = cl[0]; a.y = cl[1]; } }
        a.pose = null;
      }
      apres(350); return;
    }
    if (a && st.emote && st.dit == null) { a.emote = st.emote === "aucun" ? null : { k: st.emote, t0: performance.now() }; apres(650); return; }
    if (st.titre != null) { carteTitre(st.titre, st.sous || "", null, etapeSuivante); return; }
    if (st.narration != null) { boite(null, remplirCine(st.narration, null), { narration: true }); return; }
    if (st.dit != null || st.pense != null) {
      if (a && st.geste) a.geste = st.geste === "debout" ? null : st.geste;
      if (a && st.emote) a.emote = { k: st.emote, t0: performance.now() };
      boite(st.qui, remplirCine(st.dit != null ? st.dit : st.pense, st.qui), { ton: st.ton, pense: st.dit == null });
      return;
    }
    if (st.va != null && a) { marcherVers(a, st.va, st.attendre === false ? null : etapeSuivante); if (st.attendre === false) apres(120); return; }
    if (st.entre != null && a) {
      var pp = positionScene("porte", 0), cible = st.entre;
      a.x = pp.x; a.y = pp.y; a.alpha = 0; a.cache = false; a.entree = performance.now();
      marcherVers(a, cible === true ? null : cible, etapeSuivante);
      return;
    }
    if (st.sort != null && a) {
      marcherVers(a, "porte", function () { a.sortie = performance.now(); setTimeout(function () { if (!CINE) return; a.alpha = 0; etapeSuivante(); }, 420); });
      return;
    }
    if (st.regarde != null && a) {
      var t = acteur(st.regarde);
      if (t && t !== a) { var dx = t.x - a.x, dy = t.y - a.y; if (Math.abs(dx - dy) > 0.2) a.miroir = (dx - dy) < 0; }
      else if (st.regarde === "gauche" || st.regarde === "droite") a.miroir = st.regarde === "gauche";
      apres(200); return;
    }
    if (st.pause != null) { apres(st.pause); return; }
    if (st.fondu != null) {
      el.querySelector(".v-cine-boite").hidden = true;
      fonduTexte("", "", remplirCine(st.fondu, null), null, etapeSuivante);
      return;
    }
    if (st.secousse != null) { var cvs = $("villeCanvas"); cvs.classList.remove("v-secousse"); void cvs.offsetWidth; cvs.classList.add("v-secousse"); apres(420); return; }
    if (st.flash != null) {
      var f = el.querySelector(".v-cine-flash"), coul = { rouge: "#E0164B", blanc: "#F2E8CE", bleu: "#3FA7FF", noir: "#000" }[st.flash] || couleurCine();
      f.style.background = coul; f.classList.remove("on"); void f.offsetWidth; f.classList.add("on");
      apres(260); return;
    }
    if (st.son != null) { if (coquille && coquille.son) coquille.son(st.son); apres(120); return; }
    if (st.musique != null) { CINE.musique = st.musique; sonVille(); apres(60); return; }
    if (st.meteo != null) { CINE.meteo = st.meteo === "aucune" ? null : st.meteo; apres(60); return; }
    if (st.camera != null) {
      var ca = acteur(st.camera);
      if (ca) { var pc = versImage(ca.x, ca.y, ZSOL + 8); CINE.camera = [pc[0], pc[1] - UI.decal / k]; }
      apres(500); return;
    }
    etapeSuivante();
  }
  // marcher jusqu'à une place (ou jusqu'à la porte), puis la suite
  function marcherVers(a, place, ensuite) {
    var pos = place == null ? positionScene(null, 0) : positionScene(place, 0);
    var de0 = caseDe(a.x, a.y), vers = caseDe(pos.x, pos.y);
    var ch = chemin(plusProche(de0[0], de0[1], 6), plusProche(vers[0], vers[1], 6));
    var fin = function () {
      a.x = pos.x; a.y = pos.y; a.pas = 0;
      if (pos.place && pos.place.miroir != null) a.miroir = pos.place.miroir;
      if (pos.place && pos.place.pose === "assis") a.pose = "assis";
      if (ensuite) ensuite();
    };
    a.pose = null;
    if (!ch || ch.length < 2) { fin(); return; }
    if (a === heros) { heros.chemin = ch.map(centre); heros.i = 0; heros.arrivee = fin; return; }
    a.chemin = ch.map(centre); a.i = 0; a.arrivee = fin;
  }
  // les acteurs bougent même pendant la scène (la ville est « occupée » : rien d'autre ne bouge)
  function majCine(dt, ts) {
    if (CINE && heros.chemin) majMarche(dt);
    for (var i = 0; i < figurants.length; i++) {
      var g = figurants[i];
      if (g.cine && g.chemin) marcherFigurant(g, dt);
      if (g.entree != null) { g.alpha = Math.min(1, (ts - g.entree) / 380); if (g.alpha >= 1) g.entree = null; }
      if (g.emote && ts - g.emote.t0 > 2200) g.emote = null;
    }
    if (CINE && CINE.camera) { cam.libre = true; cam.x += (CINE.camera[0] - cam.x) * Math.min(1, dt * 4); cam.y += (CINE.camera[1] - cam.y) * Math.min(1, dt * 4); }
    else if (CINE && CINE.pres) { var vc = viseeCine(); if (vc) { cam.libre = true; cam.x += (vc[0] - cam.x) * Math.min(1, dt * 2.2); cam.y += (vc[1] - cam.y) * Math.min(1, dt * 2.2); } }
    if (CONV) majConv(ts);
  }
  // la carte de titre : le noir, le titre au néon de l'histoire (au doigt, ou après un temps)
  function carteTitre(titre, sous, auNoir, ensuite) {
    var el = uiCine(), t = el.querySelector(".v-cine-titre");
    el.querySelector(".v-cine-boite").hidden = true;
    t.querySelector("b").textContent = remplirCine(titre, null);
    t.querySelector("span").textContent = remplirCine(sous || "", null);
    t.hidden = false; t.classList.remove("on"); void t.offsetWidth; t.classList.add("on");
    var c = CINE, fait = false;
    setTimeout(function () { if (auNoir) auNoir(); }, 260);
    var fin = function () {
      if (fait || CINE !== c) return;
      fait = true;
      t.classList.remove("on");
      setTimeout(function () { t.hidden = true; if (ensuite) ensuite(); }, 420);
    };
    if (CINE) CINE.attend = fin;
    setTimeout(fin, 2800);
  }
  // la boîte de dialogue : le portrait, le nom au néon, les mots qui tombent
  function boite(qui, texte, o) {
    o = o || {};
    var el = uiCine(), b = el.querySelector(".v-cine-boite"), p = b.querySelector("p"), nom = b.querySelector(".v-cine-nom"), vis = b.querySelector(".v-cine-visage");
    el.querySelector(".v-cine-titre").hidden = true;
    b.hidden = false;
    b.classList.toggle("narration", !!o.narration);
    b.classList.toggle("pense", !!o.pense);
    var a = qui ? acteur(qui) : null;
    Object.keys(CINE.acteurs || {}).forEach(function (k) { CINE.acteurs[k].parle = false; });
    if (a && a !== heros) a.parle = true;
    if (!o.narration && a && CINE.cible && CINE.cible !== a) CINE.avant = CINE.cible;
    CINE.cible = o.narration ? null : a;
    nom.textContent = o.narration ? "" : nomCine(qui);
    vis.innerHTML = ""; vis.hidden = !!o.narration;
    if (!o.narration) portraitCine(vis, qui, o.ton);
    p.textContent = "";
    b.classList.remove("fini");
    var i = 0, c = CINE;
    clearInterval(CINE.frappe);
    CINE.frappe = setInterval(function () {
      if (CINE !== c) return;
      i = Math.min(texte.length, i + 2);
      p.textContent = texte.slice(0, i);
      if (i >= texte.length) { clearInterval(c.frappe); c.frappe = null; b.classList.add("fini"); }
    }, Math.round(2000 / CHAR_PAR_S));
    CINE.attend = function suivre() {
      if (CINE.frappe) { clearInterval(CINE.frappe); CINE.frappe = null; p.textContent = texte; b.classList.add("fini"); CINE.attend = suivre; return; }
      if (a) a.parle = false;
      etapeSuivante();
    };
  }
  function tapeCine() { if (CINE && CINE.attend) CINE.attend(); }
  function nomCine(qui) {
    if (!qui) return "";
    if (qui === "toi") return (vue && vue.entities && vue.entities.protagonist) || S.nom || "Toi";
    var a = acteur(qui);
    if (a && a.nom) return a.nom;
    var q = a ? a.qui : qui;
    if (CHARS[q]) return nomDe(q);
    return NOM_GENS[a ? a.sp : q] || "Quelqu'un";
  }
  // le portrait : celui des cartes pour les visages connus, la figurine agrandie pour les autres
  var PORTRAITS_CINE = {};
  function portraitCine(boiteEl, qui, ton) {
    var a = qui ? acteur(qui) : null, q = qui === "toi" ? (S.role === "joueur" ? "joueur" : "coach") : (a ? a.qui : qui);
    var art = window.FusibleArt, an = (vue && vue.year) || 1990, cle = q + "|" + (ton || "neutre") + "|" + Math.floor(an / 5);
    if (art && art.scene && (CHARS[q] || qui === "toi")) {
      var svg = PORTRAITS_CINE[cle];
      if (!svg) {
        var ch = CHARS[q] || {};
        try { svg = art.scene({ speaker: q, expression: ton || "neutre", camp: ch.camp || "terrain", genre: qui === "toi" ? (vue && vue.genre) || "m" : ch.genre || "m",
          kind: "scene", tone: "", cadrage: "serre", saison: (vue && vue.season) || 0, annee: an, club: (vue && vue.club) || "", seed: "cine|" + q }) || ""; } catch (e) { svg = ""; }
        PORTRAITS_CINE[cle] = svg;
      }
      if (svg) { boiteEl.innerHTML = svg; return; }
    }
    // la figurine du haut du corps, quatre fois plus grande
    var sp = a && a.sp ? a.sp : (qui === "toi" ? (S.role === "joueur" ? "joueur" : "coach") : q), def = SPRITES[sp];
    if (!def) return;
    var rows = def.rows, w = rows[0].length, h = Math.min(rows.length, 12), s = 5, cnv = document.createElement("canvas");
    cnv.width = w * s; cnv.height = h * s;
    var x = cnv.getContext("2d");
    for (var i = 0; i < h; i++) for (var j = 0; j < w; j++) {
      var ch2 = rows[i][j]; if (ch2 === "." || ch2 === " ") continue;
      var col = (a && a.pal && a.pal[ch2]) || def.pal[ch2]; if (!col) continue;
      x.fillStyle = "rgb(" + col[0] + "," + col[1] + "," + col[2] + ")"; x.fillRect(j * s, i * s, s, s);
    }
    cnv.className = "v-cine-figurine";
    boiteEl.appendChild(cnv);
  }
  // les mots : {prenom}, {club}… et {toi}, l'adresse de celui qui parle (son ton neutre)
  function remplirCine(t, qui) {
    if (t == null) return "";
    var s = String(t), a = qui ? acteur(qui) : null, q = a ? a.qui : qui;
    if (s.indexOf("{toi}") >= 0 || s.indexOf("{Toi}") >= 0) {
      var ad = adresseDe(q);
      s = s.split("{toi}").join(ad).split("{Toi}").join(ad.charAt(0).toUpperCase() + ad.slice(1));
    }
    // celui qui parle : le héros a le genre de la carrière ; un visage, le sien ; un anonyme, sa figurine
    var sg = q === "toi" ? null : (CHARS[q] && CHARS[q].genre) || (a && a.sp && /passante/.test(a.sp) ? "f" : "m");
    if (q === "toi") sg = (vue && (vue.genre || (vue.entities && vue.entities.genre))) || "m";
    return remplir(s, null, sg);
  }
  function adresseDe(q) {
    var ch = CHARS[q], role = S.role, t = null;
    if (ch && ch.adresse) { var r = ch.adresse[role] || ch.adresse.entraineur; t = r && (r.neutre || r.sourire); }
    if (!t) t = role === "joueur" ? "{prenom}" : role === "president" ? "président" : role === "selectionneur" ? "coach" : role === "ds" ? "{prenom}" : "coach";
    var genre = (vue && vue.genre) || "m";
    t = t.replace(/\{pg,\s*select,\s*f\{([^}]*)\}\s*other\{([^}]*)\}\}/g, function (m0, f, o) { return genre === "f" ? f : o; });
    return remplir(t);
  }
  // la fin : la ville reprend où la scène l'a laissée
  function finCine(passe) {
    if (!CINE) return;
    var c = CINE;
    clearInterval(c.frappe);
    var el = $("villeCine");
    // la suite, ailleurs (`suite:`) : le noir, puis la scène suivante, sans rendre la main ;
    // « Passer » saute toute la suite
    var suite = !passe && c.c.suite ? cineParId(c.c.suite) : null;
    if (suite && el && !(S.cinesVues && S.cinesVues[suite.id])) {
      S.cinesVues[suite.id] = 1;
      figurants = figurants.filter(function (g) { return !g.cine; });
      heros.chemin = null; heros.arrivee = null; heros.geste = null; heros.emote = null; heros.pose = null; heros.parle = false;
      CINE = { c: suite, i: -1, ensuite: c.ensuite, origine: c.origine || c.c.quand, attend: null, frappe: null,
        amb: suite.tranche ? AMBIANCE[suite.tranche] : null, musique: c.musique, camera: null, meteo: suite.meteo || null };
      el.querySelector(".v-cine-boite").hidden = true;
      if (suite.titre) carteTitre(suite.titre, suite.sous || "", function () { installerScene(suite); }, etapeSuivante);
      else fonduVite(function () { installerScene(suite); }, etapeSuivante);
      sonVille(); sauver();
      return;
    }
    CINE = null;
    if (el) {
      el.classList.remove("on");
      el.querySelector(".v-cine-boite").hidden = true;
      el.querySelector(".v-cine-titre").hidden = true;
      setTimeout(function () { if (!CINE) el.hidden = true; }, 380);
    }
    document.body.classList.remove("v-cine-on");
    figurants = figurants.filter(function (g) { return !g.cine; });
    heros.chemin = null; heros.arrivee = null; cam.libre = false;
    taille();
    heros.geste = null; heros.emote = null; heros.pose = null; heros.parle = false;
    // l'introduction est un prélude : la carrière commence chez toi, à l'heure du départ ;
    // ailleurs, une pièce fermée à cette heure-ci te rend à la rue
    var chez = chezToi();
    if ((c.origine || c.c.quand) === "debut") {
      if (aInterieur(chez)) entrer(chez);
      else if (LIEU[chez] && LIEU[chez].door) { var cz = centre(LIEU[chez].door); poserEnVille(cz[0], cz[1]); S.lieu = chez; }
    } else if (dedans && dedans.cle !== chez && !ouvert(TEXTE_LIEU[dedans.cle] || {}) && !(rdv && rdv.lieu === dedans.cle)) aDehors();
    if (dedans) occuper(); else recaler();
    occupe = false;
    sonVille(); majHud(); sauver();
    if (c.ensuite) c.ensuite();
  }

  // ─── le temps qu'il fait, dehors (une scène sous la pluie, sous la neige, dans la brume) :
  // des gouttes, des flocons, des bancs de brume, dessinés au pixel par-dessus la ville
  function hach(i, s) { var x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); }
  function dessinerMeteo(sorte, ts) {
    var t = ts / 1000, n, i, x, y;
    ctx.save();
    if (sorte === "pluie") {
      ctx.fillStyle = "rgba(10,18,34,0.24)"; ctx.fillRect(0, 0, VW, VH);
      ctx.fillStyle = "rgba(175,195,225,0.55)";
      n = Math.round(VW * VH / 420);
      for (i = 0; i < n; i++) {
        var v = 150 + hach(i, 3) * 90;
        y = (hach(i, 1) * (VH + 20) + t * v) % (VH + 20) - 10;
        x = ((hach(i, 2) * (VW + 40) - t * v * 0.3) % (VW + 40) + VW + 40) % (VW + 40) - 20;
        for (var k2 = 0; k2 < 5; k2++) ctx.fillRect(Math.round(x - k2 * 0.3), Math.round(y + k2), 1, 1);
      }
    } else if (sorte === "neige") {
      ctx.fillStyle = "rgba(235,238,245,0.85)";
      n = Math.round(VW * VH / 1100);
      for (i = 0; i < n; i++) {
        var vn = 9 + hach(i, 5) * 14;
        y = (hach(i, 1) * (VH + 10) + t * vn) % (VH + 10) - 5;
        x = (hach(i, 2) * VW + Math.sin(t * 0.9 + i) * 3 + VW) % VW;
        var sz = hach(i, 4) < 0.25 ? 2 : 1;
        ctx.fillRect(Math.round(x), Math.round(y), sz, sz);
      }
    } else if (sorte === "brume") {
      for (i = 0; i < 6; i++) {
        var by = (hach(i, 7) * VH + Math.sin(t * 0.15 + i) * 8), bx = ((hach(i, 8) * VW + t * (4 + i)) % (VW * 1.6)) - VW * 0.3;
        var g = ctx.createRadialGradient(bx, by, 0, bx, by, VW * 0.45);
        g.addColorStop(0, "rgba(190,196,205,0.16)"); g.addColorStop(1, "rgba(190,196,205,0)");
        ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH);
      }
    }
    ctx.restore();
  }

  // ─── les conversations surprises
  function convOk(cv) {
    if (S.convsVues && S.convsVues[cv.id]) return false;
    if (cv.roles && cv.roles.length && cv.roles.indexOf(S.role) < 0) return false;
    if (cv.tranches && cv.tranches.length && cv.tranches.indexOf(TRANCHES[S.tranche]) < 0) return false;
    if (cv.si && !siVrai(cv.si, cv.lieu)) return false;
    return true;
  }
  // la conversation qui peut se tenir là où l'on est (une pièce, ou devant un lieu sans pièce)
  function convIci() {
    if (CINE || CONV || carteOn || occupe || MATCH) return null;
    var cle = dedans ? dedans.cle : null;
    if (!cle) {
      var lp = lieuProche();
      if (!lp || aInterieur(lp)) return null;
      cle = lp;
    }
    var l = (D.conversations || []).filter(function (cv) { return cv.lieu === cle && convOk(cv); });
    return l[0] || null;
  }
  // dehors, devant un lieu : `porte`, `centre`, un décalage [dx, dy] depuis sa porte, sinon une des
  // places de la rue autour de la porte
  function placeDehors(lieu, place, libres, i) {
    var l = LIEU[lieu], d = l && l.door;
    if (d && (Array.isArray(place) || place === "porte" || place === "centre")) {
      var off = Array.isArray(place) ? place : place === "centre" ? [2, 2] : [0, 0];
      var n = plusProche(d[0] + off[0], d[1] + off[1], 6) || d, c = centre(n);
      return { x: c[0], y: c[1] };
    }
    if (libres && libres.length) { var q = libres.shift(); return { x: q[0], y: q[1] }; }
    return positionScene(null, i, null);
  }
  // les voix prennent corps (si elles n'y sont pas déjà) : dedans à leurs places, dehors près de la porte
  function convInstaller(cv) {
    var voix = {}, libres = dedans ? null : placesDe(cv.lieu).slice();
    var pris = [];
    cv.qui.forEach(function (v, i) {
      var g = null;
      // un visage connu déjà dans la pièce parle d'où il est ; deux anonymes du même genre restent deux
      if (CHARS[v.qui]) figurants.forEach(function (x) { if (!g && x.qui === v.qui && !x.cine && pris.indexOf(x) < 0) g = x; });
      else figurants.forEach(function (x) { if (!g && x.conv && x.convId === cv.id + ":" + v.id) g = x; });
      // la ville vivante (ville_gens.js) : le commerçant d'une conversation, c'est celui qui tient le lieu
      if (!g && QUI_TENANCIER[v.qui]) {
        if (dedans) figurants.forEach(function (x) { if (!g && x.role === "tenancier" && pris.indexOf(x) < 0) g = x; });
        else Object.keys(acteurs).forEach(function (k) { var x = acteurs[k]; if (!g && x.role === "gensville" && x.lieu === cv.lieu && pris.indexOf(x) < 0) g = x; });
      }
      if (!g) {
        // la place d'une voix est à elle : le client qui l'occupe s'en va
        if (dedans && typeof v.place === "string") figurants = figurants.filter(function (x) { return x.cine || x.conv || x.place !== v.place || x.role === "rdv" || x.role === "mission"; });
        var pos = dedans ? positionScene(v.place, i, null) : placeDehors(cv.lieu, v.place, libres, i);
        var sp = GENS_SP[v.qui] ? (SPRITES[v.qui] ? v.qui : "passant") : spriteDe(v.qui) || "passant";
        g = { conv: true, convId: cv.id + ":" + v.id, sp: sp, qui: v.qui, nom: v.nom || null, x: pos.x, y: pos.y, miroir: i % 2 === 1, pose: v.pose || (pos.place && pos.place.pose) || null, pas: 0, alpha: 1, uid: ++UID, lieu: cv.lieu,
          place: typeof v.place === "string" ? v.place : null };
        figurants.push(g);
      }
      voix[v.id] = g; pris.push(g);
    });
    // ils se regardent
    var ids = Object.keys(voix);
    if (ids.length >= 2) { var a = voix[ids[0]], b = voix[ids[1]]; var dx = b.x - a.x, dy = b.y - a.y; if (Math.abs(dx - dy) > 0.2) { a.miroir = (dx - dy) < 0; b.miroir = !a.miroir; } }
    return voix;
  }
  function majConv(ts) {
    var c = CONV;
    if (!c) return;
    if (carteOn || CINE || MATCH) { finConv(); return; }
    // trop loin : la conversation continue sans toi (elle est entendue à moitié)
    var proche = false;
    Object.keys(c.voix).forEach(function (k) { var g = c.voix[k]; var d = Math.max(Math.abs(caseDe(g.x, g.y)[0] - caseDe(heros.x, heros.y)[0]), Math.abs(caseDe(g.x, g.y)[1] - caseDe(heros.x, heros.y)[1])); if (d <= (dedans ? 9 : 7)) proche = true; });
    if (!proche && c.i >= 0) { if (ts - c.loin > 4000) finConv(); return; }
    c.loin = ts;
    if (c.i >= 0 && ts < c.jusqua) return;
    c.i++;
    var r = c.cv.repliques[c.i];
    if (!r) { finConv(); return; }
    var g = c.voix[r.qui];
    if (!g) { c.jusqua = ts; return; }
    var texte = remplir(r.dit, null, (CHARS[g.qui] && CHARS[g.qui].genre) || (/passante/.test(g.sp) ? "f" : "m")), duree = Math.max(2600, texte.length * 58);
    if (r.emote) g.emote = { k: r.emote, t0: ts };
    if (bulle && bulle.g !== g) bulle.g.parle = false;
    g.parle = true;
    Object.keys(c.voix).forEach(function (k) { if (c.voix[k] !== g) c.voix[k].parle = false; });
    var v = null; c.cv.qui.forEach(function (x) { if (x.id === r.qui) v = x; });
    var gensIci = (g.role === "tenancier" || g.role === "gensville") && CHARS[g.qui];
    bulle = { g: g, nom: gensIci ? nomDe(g.qui) : (v && v.nom) || (CHARS[g.qui] ? nomDe(g.qui) : NOM_GENS[g.sp] || "Quelqu'un"), texte: texte, muet: false, jusqua: performance.now() + duree, conv: true };
    c.jusqua = ts + duree + 250;
  }
  function finConv() {
    if (!CONV) return;
    Object.keys(CONV.voix).forEach(function (k) { CONV.voix[k].parle = false; });
    if (bulle && bulle.conv) bulle = null;
    CONV = null;
  }
  // à chaque image, hors scène : une conversation à portée de voix commence
  var convT = 0;
  function guetterConv(ts) {
    if (ts - convT < 700) return;
    convT = ts;
    var cv = convIci();
    if (!cv) return;
    var voix = convInstaller(cv), proche = false, hc = caseDe(heros.x, heros.y);
    Object.keys(voix).forEach(function (k) { var c2 = caseDe(voix[k].x, voix[k].y); if (Math.max(Math.abs(c2[0] - hc[0]), Math.abs(c2[1] - hc[1])) <= (dedans ? 8 : 6)) proche = true; });
    if (!proche) return;
    S.convsVues = S.convsVues || {};
    S.convsVues[cv.id] = 1;
    CONV = { cv: cv, voix: voix, i: -1, jusqua: 0, loin: ts };
    sauver();
  }

  // ─── ce que les personnages font de leur corps : l'émotion au-dessus de la tête
  var EMOTES = {
    "!": { c: "#F2E8CE", px: ["..x..", "..x..", "..x..", ".....", "..x.."] },
    "?": { c: "#F2E8CE", px: [".xxx.", "....x", "..xx.", ".....", "..x.."] },
    "...": { c: "#F2E8CE", px: [".....", ".....", ".....", ".....", "x.x.x"] },
    colere: { c: "#E0164B", px: ["x...x", ".x.x.", ".....", ".x.x.", "x...x"] },
    sueur: { c: "#7CC4FF", px: ["..x..", ".xxx.", "xxxxx", "xxxxx", ".xxx."] },
    coeur: { c: "#E0164B", px: [".x.x.", "xxxxx", "xxxxx", ".xxx.", "..x.."] },
    note: { c: "#FFD34E", px: ["..xxx", "..x.x", "..x..", "xxx..", "xx..."] },
    zzz: { c: "#B9C7FF", px: ["xxxx.", "..x..", ".x...", "xxxx.", "....."] },
    choc: { c: "#FFD34E", px: ["x.x.x", ".xxx.", "xxxxx", ".xxx.", "x.x.x"] },
  };
  function dessinerEmote(g, ts) {
    var e = g.emote && EMOTES[g.emote.k];
    if (!e || !g.tete) return;
    var age = ts - g.emote.t0, saut = age < 160 ? -2 : 0;
    var x0 = Math.round(g.tete[0] - 4), y0 = Math.round(g.tete[1] - 10 + saut);
    ctx.fillStyle = "rgba(14,9,6,.88)"; ctx.fillRect(x0 - 1, y0 - 1, 9, 9);
    ctx.fillStyle = "rgba(14,9,6,.88)"; ctx.fillRect(x0 + 3, y0 + 8, 2, 2);
    ctx.fillStyle = e.c;
    for (var i = 0; i < 5; i++) for (var j = 0; j < 5; j++) if (e.px[i][j] === "x") ctx.fillRect(x0 + 1 + j + (j > 2 ? 0 : 0), y0 + 1 + i, 1, 1);
  }

  // ─── les gestes : ce que le corps tient, ce qu'il fait de ses bras (par-dessus la figurine)
  function couleurBuste(def, pal) {
    var r = def.rows[Math.min(8, def.rows.length - 1)];
    for (var j = 1; j < r.length - 1; j++) { var c = r[j]; if (c !== "." && c !== "k" && c !== " ") return (pal && pal[c]) || def.pal[c] || [120, 40, 50]; }
    return [120, 40, 50];
  }
  function px(x, y, c) { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); }
  function rgbCss(c) { return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")"; }
  function dessinerGeste(g, bx, ts) {
    var def = SPRITES[g.sp];
    if (!def || !bx) return;
    var ge = g.geste, x0 = bx.x, y0 = bx.y, w = bx.w, h = bx.h, av = g.miroir ? -1 : 1;
    var devant = g.miroir ? x0 - 1 : x0 + w, cote = g.miroir ? x0 + 1 : x0 + w - 2;
    var peau = rgbCss((g.pal && g.pal.s) || def.pal.s || [219, 176, 140]), buste = rgbCss(couleurBuste(def, g.pal));
    var epaule = y0 + 7, bouche = y0 + 4;
    if (ge === "telephone") { ctx.fillStyle = "#151313"; ctx.fillRect(cote + av, y0 + 2, 2, 4); px(cote + av, y0 + 6, peau); }
    else if (ge === "boit") { ctx.fillStyle = "#D9A441"; ctx.fillRect(devant, bouche, 2, 3); ctx.fillStyle = "#F2E8CE"; ctx.fillRect(devant, bouche, 2, 1); px(devant - av, bouche + 3, peau); }
    else if (ge === "fume") {
      px(devant, bouche + 1, "#FF7A2E");
      for (var i = 0; i < 3; i++) { var ph = ((ts / 900) + i / 3) % 1; ctx.globalAlpha = 0.55 * (1 - ph); px(devant + Math.round(Math.sin(ph * 6 + i) * 1.4), bouche - Math.round(ph * 9), "#BDB6AA"); }
      ctx.globalAlpha = 1;
    }
    else if (ge === "bras_leves") { ctx.fillStyle = buste; ctx.fillRect(x0 + 1, y0 - 3, 1, 10); ctx.fillRect(x0 + w - 2, y0 - 3, 1, 10); px(x0 + 1, y0 - 4, peau); px(x0 + w - 2, y0 - 4, peau); }
    else if (ge === "poing") { ctx.fillStyle = buste; ctx.fillRect(cote, y0 - 2, 1, 9); ctx.fillStyle = peau; ctx.fillRect(cote - (av < 0 ? 1 : 0), y0 - 4, 2, 2); }
    else if (ge === "pointe") { ctx.fillStyle = buste; ctx.fillRect(av > 0 ? devant - 1 : devant - 2, epaule, 3, 1); px(av > 0 ? devant + 2 : devant - 3, epaule, peau); }
    else if (ge === "pleure") { var tp = (ts / 520) % 1; ctx.globalAlpha = 1 - tp; px(x0 + Math.floor(w / 2) + av, y0 + 4 + Math.round(tp * 6), "#8CC8FF"); ctx.globalAlpha = 1; }
    else if (ge === "ecrit" || ge === "lit") { ctx.fillStyle = "#E9E3D2"; ctx.fillRect(devant - (av > 0 ? 1 : 2), epaule + 2, 3, 2); px(devant - av, epaule + 3, peau); }
    else if (ge === "ballon") { var bz = Math.abs(Math.sin(ts / 260)) * 3; ctx.fillStyle = "#EDEBE2"; ctx.fillRect(devant + av, y0 + h - 3 - Math.round(bz), 3, 3); px(devant + av + 1, y0 + h - 2 - Math.round(bz), "#222"); }
  }
