  // ═══ LE DOSSIER 1974 ET TES FANTÔMES ══════════════════════════════════════════════════
  // (docs/histoires/dossier_1974.md, fantomes.md ; content/ville/dossier_1974.yaml, fantomes.yaml)
  // Ce que la page garde d'une carrière à l'autre, dans ce navigateur seulement (localStorage,
  // borné, chaque accès sous try) :
  //   · le dossier 1974 : les pièces trouvées (une scène, un tiroir, une conversation, une scène
  //     jouée, la fin d'un livre, la vignette brillante de l'album) ; complet, il ouvre l'épilogue
  //     de mars 2050, qu'on regarde depuis l'accueil ;
  //   · tes fantômes : de chaque carrière finie, ton nom, ton livre, tes années, ta fin et trois
  //     faits au plus. Une carrière d'un livre plus tardif s'en souvient : au début, la page pose
  //     ces faits par `fusibleHeritage` (Engine.heritage : des drapeaux, des noms, aucun tirage).
  // Le passé seulement : un livre ne se souvient que des livres qui commencent avant lui. Une
  // carrière héritière se rejoue avec le même héritage (gardé à côté de sa graine) ; le Code de
  // Carrière, lui, ne rejoue que les carrières sans héritage.
  var DOSSIER_LS = "fusible.dossier.v1";
  var FANTOMES_LS = "fusible.fantomes.v1";
  var FANTOMES_NOTES_LS = "fusible.fantomes.notes.v1";
  var HERITAGE_LS = "fusible.heritage.v1";
  var DOSSIER_DEF = (content.ville && content.ville.dossier) || null;
  var FANTOMES_DEF = (content.ville && content.ville.fantomes && content.ville.fantomes.livres) || {};
  // bornes : quarante carrières gardées, huit carrières en cours notées, douze héritages, trois faits
  var FANTOMES_MAX = 40, FANTOMES_NOTES_MAX = 8, HERITAGE_MAX = 12, FANTOMES_FAITS_MAX = 3;
  var dossierNeuves = [], dossierSansHeritage = false;

  function dossierLire(cle, defaut) {
    try { var v = JSON.parse(localStorage.getItem(cle)); return v == null ? defaut : v; } catch (e) { return defaut; }
  }
  function dossierEcrire(cle, v) {
    try { localStorage.setItem(cle, JSON.stringify(v)); } catch (e) {}
  }

  // ─── le livre joué : h1…h10 (le drapeau `histoire_hN` de son postulat, compilé par build_content)
  function dossierPostulat() {
    for (var i = 0; i < postulats.length; i++) if (postulats[i].index === currentPostulat) return postulats[i];
    return null;
  }
  function fantomeLivreDe(postulatId) {
    var ks = Object.keys(FANTOMES_DEF);
    for (var i = 0; i < ks.length; i++) if (FANTOMES_DEF[ks[i]].postulat === postulatId) return ks[i];
    return null;
  }
  function fantomeTitreLivre(livre) {
    var d = FANTOMES_DEF[livre], p = d ? postulats.filter(function (x) { return x.id === d.postulat; })[0] : null;
    return p ? p.title : "";
  }

  // ─── le dossier
  function dossierPieces() { return (DOSSIER_DEF && DOSSIER_DEF.pieces) || []; }
  function dossierPiece(id) { return dossierPieces().filter(function (p) { return p.id === id; })[0] || null; }
  function dossierEtat() {
    var d = dossierLire(DOSSIER_LS, null);
    if (!d || typeof d !== "object" || !d.pieces || typeof d.pieces !== "object") d = { pieces: {} };
    return d;
  }
  function dossierCompte() {
    var d = dossierEtat(), req = dossierPieces().filter(function (p) { return p.requise; });
    var n = req.filter(function (p) { return d.pieces[p.id]; }).length;
    return { n: n, total: req.length, complet: req.length > 0 && n === req.length, brillante: !!d.pieces.brillante };
  }
  // une pièce entre au dossier ; vrai si elle est neuve. Elle porte le nom de la carrière qui l'a
  // trouvée (en jeu, ou sur son écran de fin) ; trouvée depuis l'accueil, elle n'en porte pas.
  function dossierTrouver(id) {
    var p = dossierPiece(id), d = dossierEtat();
    if (!p || d.pieces[id]) return false;
    var enJeu = view && $("titleScreen") && $("titleScreen").hidden;
    var ent = (enJeu && view.entities) || null, po = ent ? dossierPostulat() : null;
    d.pieces[id] = { t: Date.now(), livre: po ? fantomeLivreDe(po.id) : null, nom: ent ? (ent.nom || ent.prenom || "") : "", annee: ent ? view.year : null };
    dossierEcrire(DOSSIER_LS, d);
    dossierNeuves.push(id);
    return true;
  }
  function dossierAnnoncer(id) {
    var p = dossierPiece(id);
    if (!p) return;
    var t = "Une pièce du dossier 1974 : " + p.titre + ".", v = window.FusibleDossierVille;
    if (v && v.actif && v.actif() && $("gameScreen") && !$("gameScreen").hidden) v.toast(t); else dossierToast(t);
  }
  function dossierToast(t) {
    var el = $("dossierToast");
    if (!el) {
      el = document.createElement("div");
      el.id = "dossierToast";
      el.className = "dos-toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = t;
    el.classList.add("on");
    clearTimeout(dossierToast.minuterie);
    dossierToast.minuterie = setTimeout(function () { el.classList.remove("on"); }, 4200);
  }
  // les pièces que pose un drapeau (une scène, un tiroir, une carte)
  function dossierLireDrapeaux(flags) {
    if (!flags || !flags.length) return;
    dossierPieces().forEach(function (p) {
      var dr = p.trouve && p.trouve.drapeau;
      if (dr && flags.indexOf(dr) >= 0 && dossierTrouver(p.id)) dossierAnnoncer(p.id);
    });
  }

  // ─── tes fantômes : les carrières finies, la plus récente d'abord
  function fantomeCarrieres() {
    var l = dossierLire(FANTOMES_LS, []);
    return Array.isArray(l) ? l.filter(function (c) { return c && typeof c === "object" && FANTOMES_DEF[c.livre]; }) : [];
  }
  function fantomeNotes() {
    var n = dossierLire(FANTOMES_NOTES_LS, {});
    return n && typeof n === "object" && !Array.isArray(n) ? n : {};
  }
  function fantomeCle() { return currentSeed + "|" + currentPostulat; }
  // un fait qui tient à une carte (Mbako assis à ta place) : noté au moment du choix
  function fantomeNoter(fait) {
    var n = fantomeNotes(), cle = fantomeCle(), l = Array.isArray(n[cle]) ? n[cle] : [];
    if (l.indexOf(fait) < 0) l.push(fait);
    delete n[cle];
    n[cle] = l;
    var ks = Object.keys(n);
    while (ks.length > FANTOMES_NOTES_MAX) delete n[ks.shift()];
    dossierEcrire(FANTOMES_NOTES_LS, n);
  }
  // les faits gardés, dans l'ordre du livre (les fins d'abord), trois au plus
  function fantomeFaits(livre, finId, flags, notes) {
    var out = [];
    ((FANTOMES_DEF[livre] || {}).faits || []).forEach(function (f) {
      if (out.length >= FANTOMES_FAITS_MAX) return;
      var ok = (f.fins && f.fins.indexOf(finId) >= 0) ||
        (f.drapeaux && f.drapeaux.some(function (x) { return flags.indexOf(x) >= 0; })) ||
        (f.cartes && notes.indexOf(f.id) >= 0);
      if (ok) out.push(f.id);
    });
    return out;
  }
  function fantomeFait(id) {
    var livre = String(id).split("_")[0], l = ((FANTOMES_DEF[livre] || {}).faits || []).filter(function (f) { return f.id === id; });
    return l[0] || null;
  }
  // la fin d'une carrière : on la garde (une fois, même si l'écran de fin se redessine)
  function fantomeGarder(v, e, ent, po, livre) {
    var flags = e.flags || v.flags || [], cle = fantomeCle(), id = cle + "|" + (v.turn || 0);
    var l = fantomeCarrieres();
    for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i];
    var notes = fantomeNotes()[cle] || [];
    var debut = e.startYear || po.year || 1990;
    var c = {
      id: id, livre: livre, postulat: po.id,
      nom: String(e.nom || ent.protagonist || "").slice(0, 40), prenom: String(ent.prenom || "").slice(0, 14),
      famille: String(ent.nom || "").slice(0, 16), genre: ent.genre === "f" ? "f" : "m",
      debut: debut, fin: Math.max(debut, v.year || debut),
      finId: e.id || "", finTitre: String(e.title || "").slice(0, 60),
      faits: fantomeFaits(livre, e.id, flags, notes), t: Date.now()
    };
    l.unshift(c);
    dossierEcrire(FANTOMES_LS, l.slice(0, FANTOMES_MAX));
    var n = fantomeNotes();
    if (n[cle]) { delete n[cle]; dossierEcrire(FANTOMES_NOTES_LS, n); }
    return c;
  }
  // ce que la carrière qui commence reçoit des livres d'avant (et le dossier déjà rassemblé)
  function fantomeHeritage() {
    var po = dossierPostulat();
    if (!po) return null;
    var livre = fantomeLivreDe(po.id), an = livre ? FANTOMES_DEF[livre].annee : po.year;
    var drapeaux = [], noms = {}, pris = {};
    fantomeCarrieres().forEach(function (c) {
      var def = FANTOMES_DEF[c.livre];
      // le passé seulement, et un seul fantôme par livre : le plus récent
      if (!def || pris[c.livre] || c.livre === livre || !(def.annee < an)) return;
      pris[c.livre] = true;
      drapeaux.push("fantome_" + c.livre);
      (c.faits || []).forEach(function (f) { if (fantomeFait(f)) drapeaux.push("fantome_" + f); });
      var nom = c.famille || c.prenom || "";
      if (nom) noms["fantome_" + c.livre] = nom;
      if (c.debut) noms["fantome_" + c.livre + "_annees"] = c.debut + (c.fin && c.fin !== c.debut ? "-" + c.fin : "");
    });
    var d = dossierEtat();
    dossierPieces().forEach(function (p) { if (d.pieces[p.id]) drapeaux.push("dossier_" + p.id); });
    drapeaux.sort();
    return { drapeaux: drapeaux, noms: noms };
  }

  // ─── les moments du jeu
  crochet("debut", function () {
    dossierNeuves = [];
    if (!window.fusibleHeritage || !view || view.over) return;
    var cle = fantomeCle(), garde = dossierLire(HERITAGE_LS, {});
    if (!garde || typeof garde !== "object" || Array.isArray(garde)) garde = {};
    if (dossierSansHeritage) { dossierSansHeritage = false; return; }
    // la même graine du même livre se rejoue avec le même héritage (« à l'identique »)
    var h = garde[cle] && Array.isArray(garde[cle].drapeaux) ? garde[cle] : fantomeHeritage();
    if (!h || (!h.drapeaux.length && !Object.keys(h.noms || {}).length)) return;
    try {
      view = JSON.parse(window.fusibleHeritage(JSON.stringify(h)));
    } catch (e) {
      if (window.console) console.error("héritage", e);
      return;
    }
    delete garde[cle];
    garde[cle] = h;
    var ks = Object.keys(garde);
    while (ks.length > HERITAGE_MAX) delete garde[ks.shift()];
    dossierEcrire(HERITAGE_LS, garde);
  });
  crochet("reprise", function () { dossierNeuves = []; });
  crochet("reponse", function (a) {
    if (!a) return;
    var c = a.avant && a.avant.card, po = dossierPostulat(), livre = po && fantomeLivreDe(po.id);
    if (c && livre) {
      (FANTOMES_DEF[livre].faits || []).forEach(function (f) {
        if (f.cartes && f.cartes.indexOf(c.id) >= 0 && (f.cote === "droite") === !!a.droite) fantomeNoter(f.id);
      });
    }
    dossierLireDrapeaux(a.apres && a.apres.flags);
  });
  crochet("fin", function (v) {
    v = v || view;
    if (!v) return;
    var e = v.ending || {}, ent = v.entities || {}, po = dossierPostulat(), livre = po && fantomeLivreDe(po.id);
    dossierLireDrapeaux(e.flags || v.flags);
    // les pièces qu'on ne trouve qu'au bout d'un livre
    if (livre) {
      dossierPieces().forEach(function (p) {
        var t = p.trouve || {};
        if (t.fin === livre && (t.fins || []).indexOf(e.id) >= 0) dossierTrouver(p.id);
      });
    }
    var c = livre && po ? fantomeGarder(v, e, ent, po, livre) : null;
    fantomeEcranFin(c);
  });
  crochet("accueil", function () { dossierAccueil(); });
  // l'album (ville_album.js) : la vignette brillante de 1974 entre au dossier
  document.addEventListener("fusible:album", function (ev) {
    var d = ev && ev.detail;
    if (!d || !d.id) return;
    dossierPieces().forEach(function (p) {
      if (p.trouve && p.trouve.album === d.id && dossierTrouver(p.id)) {
        dossierAnnoncer(p.id);
        if ($("titleScreen") && !$("titleScreen").hidden) dossierAccueil();
      }
    });
  });

  // ─── la photo de 1974 : cinq visages, le cinquième gratté jusqu'au carton (intact quand le
  // dossier est complet, ou quand la vignette brillante y est)
  function dossierPhoto(intact) {
    var s = '<svg class="dos-photo" viewBox="0 0 64 30" aria-hidden="true" shape-rendering="crispEdges">' +
      '<rect x="0" y="0" width="64" height="30" fill="#E8DCC0"/><rect x="2" y="2" width="60" height="26" fill="#3A2E24"/>';
    for (var i = 0; i < 5; i++) {
      var x = 5 + i * 11;
      s += '<rect x="' + (x + 1) + '" y="7" width="7" height="7" fill="#C9B79A"/><rect x="' + (x + 2) + '" y="6" width="5" height="2" fill="#2A211A"/>' +
        '<rect x="' + x + '" y="15" width="9" height="11" fill="#5E7A9C"/><rect x="' + (x + 3) + '" y="15" width="3" height="3" fill="#E8DCC0"/>';
    }
    if (intact) s += '<rect x="48" y="5" width="11" height="22" fill="none" stroke="#FFC94D" stroke-width="1"/>';
    else s += '<path d="M49 5l3 4-2 3 4 3-3 3 3 4-4 3M52 5l2 3-3 4 4 3-2 4 3 3" stroke="#F4EEDC" stroke-width="1.2" fill="none"/><rect x="50" y="6" width="8" height="9" fill="#F4EEDC" opacity=".85"/>';
    return s + "</svg>";
  }

  // ─── le dossier, pièce par pièce (l'accueil, et l'onglet du carnet en ville)
  function dossierHtml() {
    if (!DOSSIER_DEF) return '<p class="note">Le dossier n\'est pas dans ce contenu.</p>';
    var d = dossierEtat(), k = dossierCompte();
    var html = '<div class="dos-panneau"><div class="dos-tete">' + dossierPhoto(k.complet || k.brillante) +
      '<p>La finale de 1974 : cinq visages sur la photo de l\'escalier, le cinquième gratté au couteau jusqu\'au carton. ' +
      'Chaque livre en garde une pièce ; certaines dorment en ville.</p></div>' +
      '<p class="dos-compte"><b>' + k.n + "</b> / " + k.total + " pièces" + (k.complet ? " · le dossier est complet" : "") + "</p>";
    html += '<ol class="dos-pieces">';
    dossierPieces().forEach(function (p) {
      var a = d.pieces[p.id];
      // la vignette brillante n'est pas requise : on ne la montre que trouvée
      if (!p.requise && !a) return;
      if (a) {
        var qui = [a.annee ? "en " + a.annee : "", a.nom || ""].filter(Boolean).join(", ");
        html += '<li class="dos-p ok"><span class="dos-date">' + escapeHtml(p.date) + '</span><b>' + escapeHtml(p.titre) + "</b><p>" + escapeHtml(p.texte) + "</p>" +
          (qui ? '<span class="dos-src">Trouvée ' + escapeHtml(qui) + "</span>" : "") + "</li>";
      } else {
        var livres = (p.livres || []).map(fantomeTitreLivre).filter(Boolean);
        html += '<li class="dos-p"><span class="dos-date">' + escapeHtml(p.date) + '</span><b>· · ·</b><p class="dos-ou">' + escapeHtml(p.ou) + "</p>" +
          (livres.length ? '<span class="dos-src">' + escapeHtml(livres.join(" · ")) + "</span>" : "") + "</li>";
      }
    });
    html += "</ol>";
    if (k.complet) html += '<button type="button" class="dos-epi-b" data-dos="epilogue"><b>L\'épilogue</b><span>Aubérive, mars 2050</span></button>';
    return html + "</div>";
  }
  // les boutons d'un panneau du dossier (l'épilogue)
  function dossierBrancher(racine) {
    if (!racine) return;
    racine.querySelectorAll("[data-dos='epilogue']").forEach(function (b) {
      b.addEventListener("click", function () { dossierEpilogue(); });
    });
  }
  function fantomesHtml() {
    var l = fantomeCarrieres();
    var html = '<div class="dos-panneau"><p class="note">Aubérive se souvient de tes carrières. Un livre d\'après croise leurs noms : ' +
      "un vieux du Corner qui raconte tes matchs en se trompant, une plaque, un gamin de 1990 devenu grand. Le passé seulement : un livre ne se souvient pas de ce qui vient après lui.</p>";
    if (!l.length) return html + '<p class="dos-vide">Aucune carrière finie pour l\'instant. La première laissera son nom.</p></div>';
    html += '<ol class="dos-carrieres">';
    l.forEach(function (c) {
      var faits = (c.faits || []).map(fantomeFait).filter(Boolean);
      html += "<li><b>" + escapeHtml(c.nom || c.famille || "Sans nom") + "</b><span>" + escapeHtml([fantomeTitreLivre(c.livre), c.debut + (c.fin && c.fin !== c.debut ? "-" + c.fin : "")].filter(Boolean).join(" · ")) + "</span>" +
        (c.finTitre ? "<em>" + escapeHtml(c.finTitre) + "</em>" : "") +
        (faits.length ? "<ul>" + faits.map(function (f) { return "<li>" + escapeHtml(f.texte) + "</li>"; }).join("") + "</ul>" : "") + "</li>";
    });
    return html + "</ol></div>";
  }

  // ─── l'accueil : le dossier, tes carrières, et l'épilogue quand le dossier est complet
  function dossierAccueil() {
    var ecran = $("titleScreen");
    if (!ecran || !DOSSIER_DEF) return;
    var el = $("dossierAccueil");
    if (!el) {
      el = document.createElement("div");
      el.id = "dossierAccueil";
      el.className = "dos-acc acc-panneau";
      var cim = $("cimetiere");
      if (cim && cim.parentNode === ecran) ecran.insertBefore(el, cim); else ecran.appendChild(el);
    }
    var k = dossierCompte(), n = fantomeCarrieres().length;
    el.innerHTML = '<h2 class="acc-h"><span>Ce qui reste</span><small>d\'une carrière à l\'autre</small></h2>' +
      (k.complet ? '<button type="button" class="dos-acc-b epi" data-dos="epilogue">' + dossierPhoto(true) + '<span><b>L\'épilogue</b><small>Le dossier 1974 · mars 2050</small></span></button>' : "") +
      '<button type="button" class="dos-acc-b" data-dos="dossier">' + (k.complet ? "" : dossierPhoto(k.brillante)) + '<span><b>Le dossier 1974</b><small>' + k.n + " / " + k.total + " pièces</small></span></button>" +
      '<button type="button" class="dos-acc-b" data-dos="carrieres"><span><b>Tes carrières</b><small>' + (n ? plural(n, "carrière gardée", "carrières gardées") : "aucune encore") + "</small></span></button>";
    el.querySelector("[data-dos='dossier']").addEventListener("click", function (ev) {
      openPanel("dossier", "Le dossier 1974", dossierHtml(), ev.currentTarget);
      dossierBrancher($("panelBody"));
    });
    el.querySelector("[data-dos='carrieres']").addEventListener("click", function (ev) {
      openPanel("carrieres", "Tes carrières", fantomesHtml(), ev.currentTarget);
    });
    dossierBrancher(el);
  }

  // ─── l'écran de fin : ce que la ville gardera, et les pièces de cette carrière
  function fantomeEcranFin(c) {
    var ecran = $("endingScreen");
    if (!ecran) return;
    var old = $("dossierFin");
    if (old) old.parentNode.removeChild(old);
    var faits = c ? (c.faits || []).map(fantomeFait).filter(Boolean) : [];
    var neuves = dossierNeuves.map(dossierPiece).filter(Boolean);
    if (!faits.length && !neuves.length) return;
    var apres = c && Object.keys(FANTOMES_DEF).some(function (l) { return FANTOMES_DEF[l].annee > FANTOMES_DEF[c.livre].annee; });
    var el = document.createElement("div");
    el.id = "dossierFin";
    el.className = "dos-fin";
    var html = "";
    if (faits.length) {
      html += '<div class="dos-fin-h">Ce que la ville gardera</div><ul>' + faits.map(function (f) { return "<li>" + escapeHtml(f.texte) + "</li>"; }).join("") + "</ul>" +
        (apres ? '<p class="dos-fin-n">Les livres d\'après s\'en souviendront.</p>' : "");
    }
    if (neuves.length) {
      var k = dossierCompte();
      html += '<div class="dos-fin-h">Le dossier 1974 · ' + k.n + " / " + k.total + "</div><ul>" +
        neuves.map(function (p) { return "<li><b>" + escapeHtml(p.titre) + "</b> — " + escapeHtml(p.texte) + "</li>"; }).join("") + "</ul>" +
        (k.complet ? '<p class="dos-fin-n">Le dossier est complet. L\'épilogue t\'attend à l\'accueil.</p>' : "");
    }
    el.innerHTML = html;
    var actions = ecran.querySelector(".fin-actions");
    if (actions) ecran.insertBefore(el, actions); else ecran.appendChild(el);
  }

  // ─── l'épilogue de 2050 : la scène jouée du dossier (do.ci.epilogue), sans carrière, sur le
  // club-house de nuit. On ne garde que ce qui se dit ; la mise en scène de la ville (qui marche
  // où) n'a pas de pièce ici.
  function dossierEpilogue() {
    var id = DOSSIER_DEF && DOSSIER_DEF.epilogue && DOSSIER_DEF.epilogue.cinematique;
    var ci = ((content.ville && content.ville.cinematiques) || []).filter(function (x) { return x.id === id; })[0];
    if (!ci || !dossierCompte().complet || $("dossierEpi")) return;
    var etapes = (ci.etapes || []).filter(function (e) { return e.narration || e.dit || e.pense; });
    var el = document.createElement("div");
    el.id = "dossierEpi";
    el.className = "dos-epi";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", ci.titre || "L'épilogue");
    el.tabIndex = -1;
    el.innerHTML = '<div class="dos-epi-fond"></div><div class="dos-epi-voile"></div>' +
      '<button type="button" class="dos-epi-passer">Passer</button>' +
      '<div class="dos-epi-titre"><b></b><span></span></div>' +
      '<div class="dos-epi-boite" hidden><div class="dos-epi-visage"></div><div class="dos-epi-mots"><span class="dos-epi-nom"></span><p aria-live="polite"></p></div></div>' +
      '<div class="dos-epi-fin" hidden></div>';
    document.body.appendChild(el);
    // le club-house la nuit (les pièces de la ville, à côté de la page), sinon la vignette du livre 10
    var fond = el.querySelector(".dos-epi-fond"), img = new Image();
    img.onload = function () { fond.style.backgroundImage = "url('" + img.src + "')"; };
    img.onerror = function () { if (ACCUEIL.couv.escalier_ferme) fond.style.backgroundImage = "url('" + ACCUEIL.couv.escalier_ferme + "')"; };
    img.src = "ville/int_clubhouse_nuit.webp";
    el.querySelector(".dos-epi-titre b").textContent = ci.titre || "";
    el.querySelector(".dos-epi-titre span").textContent = ci.sous || "";
    var themeAvant = audio && audio.theme ? audio.theme() : null;
    if (audio && audio.setTheme) audio.setTheme("fin");
    var i = -1, frappe = null, texte = "", boite = el.querySelector(".dos-epi-boite"), p = boite.querySelector("p");
    function fermer() {
      clearInterval(frappe);
      document.removeEventListener("keydown", clavier);
      if (el.parentNode) el.parentNode.removeChild(el);
      if (audio && audio.setTheme) audio.setTheme(themeAvant || ($("titleScreen") && !$("titleScreen").hidden ? "accueil" : null));
      var d = dossierEtat();
      d.epilogueVu = (d.epilogueVu | 0) + 1;
      dossierEcrire(DOSSIER_LS, d);
    }
    function generique() {
      el.classList.add("fini");
      boite.hidden = true;
      el.querySelector(".dos-epi-titre").hidden = true;
      // ceux qui l'ont rassemblé : le nom de chaque carrière qui a trouvé une pièce, par année
      var d = dossierEtat(), vus = {}, qui = [];
      dossierPieces().forEach(function (pc) {
        var a = d.pieces[pc.id];
        if (!a || !a.nom || vus[a.nom]) return;
        vus[a.nom] = 1;
        qui.push(a);
      });
      qui.sort(function (x, y) { return (x.annee || 9999) - (y.annee || 9999); });
      var noms = qui.map(function (a) { return a.nom + (a.annee ? ", " + a.annee : ""); });
      var ep = DOSSIER_DEF.epilogue || {}, f = el.querySelector(".dos-epi-fin");
      f.innerHTML = dossierPhoto(true) + "<b>" + escapeHtml(DOSSIER_DEF.titre || "") + "</b>" +
        (d.pieces.brillante && ep.brillante ? '<p class="dos-epi-brillante">' + escapeHtml(ep.brillante) + "</p>" : "") +
        (noms.length ? "<p>" + escapeHtml(ep.generique || "") + " :</p><p class=\"dos-epi-noms\">" + escapeHtml(noms.join(" · ")) + "</p>" : "") +
        '<button type="button" class="dos-epi-ok">Refermer</button>';
      f.hidden = false;
      f.querySelector(".dos-epi-ok").addEventListener("click", function (ev) { ev.stopPropagation(); fermer(); });
      f.querySelector(".dos-epi-ok").focus();
    }
    function etape() {
      i++;
      if (i >= etapes.length) { generique(); return; }
      var e = etapes[i], qui = e.narration ? null : (e.qui || "toi");
      el.querySelector(".dos-epi-titre").hidden = true;
      boite.hidden = false;
      boite.classList.toggle("narration", !!e.narration);
      boite.classList.toggle("pense", !!e.pense);
      var vis = boite.querySelector(".dos-epi-visage"), nom = boite.querySelector(".dos-epi-nom");
      vis.innerHTML = "";
      vis.hidden = !qui;
      nom.textContent = qui ? (qui === "toi" ? "Toi" : (CHARS[qui] && CHARS[qui].name) || "") : "";
      if (qui && window.FusibleArt && window.FusibleArt.scene) {
        var ch = CHARS[qui] || {};
        try {
          vis.innerHTML = window.FusibleArt.scene({ speaker: qui === "toi" ? "coach" : qui, expression: "neutre", camp: ch.camp || "terrain", genre: ch.genre || "m",
            kind: "scene", tone: "", cadrage: "serre", saison: 0, annee: 2050, club: "", seed: "epilogue|" + qui }) || "";
        } catch (er) { vis.innerHTML = ""; }
      }
      texte = String(e.narration || e.dit || e.pense || "");
      var n = 0;
      p.textContent = "";
      clearInterval(frappe);
      if (reduce) { p.textContent = texte; frappe = null; return; }
      frappe = setInterval(function () {
        n = Math.min(texte.length, n + 2);
        p.textContent = texte.slice(0, n);
        if (n >= texte.length) { clearInterval(frappe); frappe = null; }
      }, 40);
    }
    function suivre() {
      if (!el.querySelector(".dos-epi-fin").hidden) return;
      if (frappe) { clearInterval(frappe); frappe = null; p.textContent = texte; return; }
      etape();
    }
    function clavier(ev) {
      if (ev.key === "Escape") fermer();
      else if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); suivre(); }
    }
    el.addEventListener("click", suivre);
    el.querySelector(".dos-epi-passer").addEventListener("click", function (ev) { ev.stopPropagation(); fermer(); });
    document.addEventListener("keydown", clavier);
    el.focus();
    // le titre, puis la première réplique
    setTimeout(function () { if (i < 0 && el.parentNode) etape(); }, reduce ? 600 : 2600);
  }

  // ─── la feuille du dossier (l'accueil, les panneaux, l'écran de fin, l'épilogue)
  (function () {
    var css = document.createElement("style");
    css.id = "dossierCss";
    css.textContent =
      ".dos-acc{display:flex;flex-direction:column;gap:10px;margin:22px 0 14px;padding:12px}" +
      ".dos-acc .acc-h{margin:2px 2px 4px}.dos-acc .dos-photo{width:80px;height:38px}" +
      ".dos-acc-b{display:flex;align-items:center;gap:12px;width:100%;min-height:52px;padding:8px 10px;text-align:left;color:var(--a-texte);background:#0F0C18;box-shadow:0 0 0 2px var(--a-ligne)}" +
      ".dos-acc-b:hover,.dos-acc-b:focus-visible{outline:0;box-shadow:0 0 0 2px var(--a-or)}" +
      ".dos-acc-b span{display:flex;flex-direction:column;gap:3px;min-width:0}" +
      ".dos-acc-b b{font-family:var(--pix);font-size:17px;font-weight:600;line-height:1.15}" +
      ".dos-acc-b small{font-family:var(--pix);font-size:12px;letter-spacing:.07em;text-transform:uppercase;color:var(--a-texte3)}" +
      ".dos-acc-b.epi{box-shadow:0 0 0 2px var(--a-or),4px 4px 0 2px var(--a-ombre)}" +
      ".dos-acc-b.epi b{color:var(--a-or)}" +
      ".dos-photo{display:block;width:64px;height:30px;flex:0 0 auto;image-rendering:pixelated}" +
      ".dos-panneau{display:flex;flex-direction:column;gap:6px}" +
      ".dos-tete{display:flex;gap:12px;align-items:flex-start}" +
      ".dos-tete .dos-photo{width:96px;height:45px}" +
      ".dos-tete p{margin:0;font-size:12.5px;font-style:italic;line-height:1.55;color:var(--creme2)}" +
      ".dos-compte{margin:8px 0 2px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--creme3)}" +
      ".dos-compte b{color:var(--creme);font-size:13px}" +
      ".dos-pieces,.dos-carrieres{list-style:none;margin:0;padding:0}" +
      ".dos-p,.dos-carrieres>li{padding:10px 0;border-bottom:1px solid var(--fond3)}" +
      ".dos-p .dos-date{display:block;font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--creme3)}" +
      ".dos-p b{display:block;margin-top:2px;font-size:13.5px;color:var(--creme)}" +
      ".dos-p:not(.ok) b{letter-spacing:.3em;color:var(--creme3)}" +
      ".dos-p p{margin:4px 0 0;font-size:12.5px;line-height:1.55;color:var(--creme2)}" +
      ".dos-p .dos-ou{font-style:italic}" +
      ".dos-src{display:block;margin-top:4px;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--creme3)}" +
      ".dos-carrieres>li b{display:block;font-size:13.5px;color:var(--creme)}" +
      ".dos-carrieres>li span{display:block;font-size:11px;letter-spacing:.06em;color:var(--creme3);margin-top:2px}" +
      ".dos-carrieres>li em{display:block;font-size:12px;color:var(--creme2);margin-top:4px}" +
      ".dos-carrieres ul,.dos-fin ul{margin:6px 0 0;padding:0 0 0 16px;font-size:12px;line-height:1.5;color:var(--creme2)}" +
      ".dos-vide{font-size:12.5px;font-style:italic;color:var(--creme3)}" +
      ".dos-epi-b{display:flex;flex-direction:column;gap:2px;width:100%;min-height:52px;margin-top:12px;padding:10px 12px;text-align:left;color:var(--creme);border:1px solid #FFC94D;background:rgba(255,201,77,.08)}" +
      ".dos-epi-b b{font-size:14px;color:#FFC94D}.dos-epi-b span{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--creme2)}" +
      ".dos-fin{margin:18px 0 0;padding:12px 14px;border:1px solid var(--fond3);background:var(--fond2)}" +
      ".dos-fin-h{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--creme3);margin-top:14px}.dos-fin-h:first-child{margin-top:4px}" +
      ".dos-fin-h+ul{margin-bottom:8px}.dos-fin li b{color:var(--creme)}" +
      ".dos-fin-n{margin:4px 0;font-size:12px;font-style:italic;color:var(--creme2)}" +
      ".dos-toast{position:fixed;left:50%;top:calc(12px + env(safe-area-inset-top));transform:translate(-50%,-8px);z-index:70;max-width:min(92vw,420px);" +
      "padding:10px 14px;background:#0F0C18;color:#F6E9CF;font-size:13px;line-height:1.4;box-shadow:0 0 0 2px #FFC94D,4px 4px 0 2px #06040B;opacity:0;pointer-events:none;transition:opacity .25s,transform .25s}" +
      ".dos-toast.on{opacity:1;transform:translate(-50%,0)}" +
      ".dos-epi{position:fixed;inset:0;z-index:80;background:#06040B;color:#F6E9CF;overflow:hidden;cursor:pointer}" +
      ".dos-epi:focus{outline:0}.dos-epi [hidden]{display:none!important}" +
      // la pièce dessinée de bord à bord, sans recadrage : elle fait 192 pixels de large
      ".dos-epi-fond{position:absolute;inset:0;background:#06040B 50% 24%/min(100%,760px) auto no-repeat;image-rendering:pixelated;filter:saturate(.75)}" +
      ".dos-epi-voile{position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,4,11,.6),rgba(6,4,11,.1) 30%,rgba(6,4,11,.35) 55%,rgba(6,4,11,.92) 80%,#06040B);transition:background .6s}" +
      ".dos-epi.fini .dos-epi-voile{background:rgba(6,4,11,.86)}" +
      ".dos-epi-passer{position:absolute;top:calc(8px + env(safe-area-inset-top));right:8px;z-index:2;min-width:64px;min-height:44px;padding:0 12px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#CBC1E2;background:rgba(6,4,11,.6)}" +
      ".dos-epi-titre{position:absolute;left:16px;right:16px;top:38%;z-index:1;display:flex;flex-direction:column;gap:8px;text-align:center}" +
      ".dos-epi-titre b{font-family:var(--pix,monospace);font-size:26px;font-weight:600;color:#FFC94D;text-shadow:2px 2px 0 #06040B}" +
      ".dos-epi-titre span{font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:#CBC1E2}" +
      ".dos-epi-boite{position:absolute;left:12px;right:12px;bottom:calc(16px + env(safe-area-inset-bottom));z-index:1;display:flex;gap:12px;align-items:flex-start;" +
      "padding:12px;background:rgba(15,12,24,.94);box-shadow:0 0 0 2px #352B52,4px 4px 0 2px #06040B;min-height:96px}" +
      ".dos-epi-visage{flex:0 0 72px;width:72px;height:72px;overflow:hidden;background:#1C1630}" +
      ".dos-epi-visage svg{display:block;width:100%;height:100%}" +
      ".dos-epi-mots{flex:1 1 auto;min-width:0}" +
      ".dos-epi-nom{display:block;font-family:var(--pix,monospace);font-size:14px;letter-spacing:.06em;color:#FFC94D;margin-bottom:4px}" +
      ".dos-epi-mots p{margin:0;font-size:14px;line-height:1.5}" +
      ".dos-epi-boite.narration .dos-epi-mots p{font-style:italic;color:#CBC1E2}" +
      ".dos-epi-boite.pense .dos-epi-mots p{font-style:italic}" +
      ".dos-epi-fin{position:absolute;left:16px;right:16px;top:50%;transform:translateY(-50%);z-index:1;display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center;cursor:default}" +
      ".dos-epi-fin .dos-photo{width:128px;height:60px}" +
      ".dos-epi-fin b{font-family:var(--pix,monospace);font-size:22px;color:#FFC94D}" +
      ".dos-epi-fin p{margin:0;font-size:13px;line-height:1.55;color:#CBC1E2;max-width:30em}" +
      ".dos-epi-fin .dos-epi-brillante{font-style:italic;color:#F6E9CF}" +
      ".dos-epi-fin .dos-epi-noms{color:#F6E9CF;letter-spacing:.04em}" +
      ".dos-epi-ok{min-height:44px;min-width:140px;margin-top:6px;padding:0 16px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#0B0814;background:#FFC94D}" +
      "@media (prefers-reduced-motion:reduce){.dos-toast{transition:none}}";
    document.head.appendChild(css);
  })();

  // ─── ce que d'autres modules et la ville lisent
  window.FusibleDossier = {
    pieces: dossierPieces,
    etat: dossierEtat,
    compte: dossierCompte,
    // une pièce trouvée ailleurs (la ville) : au dossier, et le bandeau si elle est neuve
    trouver: function (id) { var n = dossierTrouver(id); if (n) dossierAnnoncer(id); return n; },
    html: dossierHtml,
    brancher: dossierBrancher,
    carrieres: fantomeCarrieres,
    heritage: fantomeHeritage,
    // la prochaine carrière part sans héritage (un défi, un livre du jour : le Code rejoue juste)
    sansHeritage: function () { dossierSansHeritage = true; },
    epilogue: dossierEpilogue
  };
