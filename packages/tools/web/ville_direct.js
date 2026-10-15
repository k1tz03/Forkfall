  // ═══════════════════════════════════════════════════════════ LE SAMEDI EN DIRECT
  // docs/histoires/samedi_direct.md. Le samedi, à la Rive, le choix de posture ne part
  // plus tout de suite au moteur : la ville le retient (`FusibleVille.retenir`, que la
  // coquille appelle dans `advance`), demande au moteur le script du samedi
  // (`fusibleDirect` : les décisions, leurs minutes, le score à chacune, l'adversaire),
  // joue le match jusqu'à la dernière décision — chacune gèle le jeu : une carte, deux
  // gestes, un anneau de cinq secondes — puis rend le tout au moteur d'un seul appel
  // (`FusibleCoquille.choisirDirect`). Le moteur résout le bloc et écrit la fin du match ;
  // la ville la joue, et ne présente la vue d'après qu'à la sortie du stade
  // (`FusibleCoquille.presenterDirect`). Rien ici ne tire au hasard : tout vient du
  // script, ou du dé du match (`M.r`, haché sur la graine et la journée).
  var DIRECT = null;              // { sc, droite, choix, carte, vue, trace, score }
  var DIRECT_SEC = 5, DIRECT_SEC_LENT = 10;
  var directReduit = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

  function directProfil() { try { return (window.FusibleApercu && window.FusibleApercu.profil()) || {}; } catch (e) { return {}; } }
  function directLent() { return directReduit || !!directProfil().directLent; }
  function directDuree() { return directLent() ? DIRECT_SEC_LENT : DIRECT_SEC; }
  function directSon(nom) { try { if (coquille && coquille.son) coquille.son(nom); } catch (e) {} }
  // la musique : pendant une décision, le stade se tait et le cœur bat (le thème `sombre`)
  function directMusique() { return DIRECT && DIRECT.carte && !DIRECT.carte.fait ? "sombre" : null; }

  // la carte du match est-elle un samedi qu'on peut jouer en direct ?
  function directPossible() {
    return !!(actif && S && vue && vue.card && vue.card.beatKind === "match" && rdv && rdv.type === "match" && rdv.beat === "match" &&
      S.auMatch && !MATCH && !CINE && D && D.match && D.match.textes && window.fusibleDirect && coquille && coquille.choisirDirect);
  }

  // la coquille vient de recevoir le choix de posture : on le garde, et le match commence
  function directRetenir(droite) {
    if (!directPossible()) return false;
    var r = null;
    try { r = JSON.parse(window.fusibleDirect(!!droite)); } catch (e) { r = null; }
    var sc = r && r.scenario;
    if (!sc || !sc.decisions || !sc.decisions.length) return false;
    DIRECT = { sc: sc, droite: !!droite, choix: [], carte: null, vue: null, trace: null, score: "0-0", siffle: false };
    cacherCarte();
    majHud();
    jouerMatch(vue, directSortie);
    return true;
  }

  // le match se prépare (crochet 'match') : l'adversaire et les buts du script, les décisions
  // à leur minute, une occasion quand le match est maigre ; qui marque, comme d'habitude
  crochetVille("match", function (M) {
    if (!DIRECT || M.direct) return;
    var sc = DIRECT.sc;
    M.direct = DIRECT;
    M.adv = sc.adversaire; M.advVille = sc.adv; M.advCourt = surPanneau(sc.adv);
    M.lettre = null; M.lettres = [];
    var ev = sc.buts.map(function (b) { return { t: b[1] ? "pour" : "contre", m: b[0], dit: true }; });
    if (sc.buts.length < 2 && sc.fin > 14) {
      for (var k = 0; k < 30; k++) {
        var m = 9 + Math.floor(M.r() * (sc.fin - 13));
        var loin = Math.abs(m - 45) > 1 && ev.every(function (e) { return Math.abs(e.m - m) > 3; }) &&
          sc.decisions.every(function (d) { return Math.abs(d.minute - m) > 3; });
        if (loin) { ev.push({ t: M.r() < 0.55 ? "poteau" : "arret", m: m, dit: true }); break; }
      }
    }
    sc.decisions.forEach(function (d, i) { ev.push({ t: "decision", m: d.minute, i: i }); });
    M.ev = directOrdonner(ev);
    distribuer(M, vue);
  });
  function directOrdonner(ev) {
    ev.sort(function (a, b) { return a.m - b.m || (a.t === "decision" ? 1 : 0) - (b.t === "decision" ? 1 : 0); });
    var a = 0, b = 0;
    ev.forEach(function (e) { if (e.t === "pour") a++; if (e.t === "contre") b++; e.score = a + "-" + b; });
    return ev;
  }

  // ─── la décision : le jeu s'arrête, la carte s'ouvre
  function directCible(camera) {
    if (camera === "banc") return [STADE.banc[0], STADE.banc[1], ZSOL];
    if (camera === "kop") return [475, 505, 24];
    if (camera === "loge") return [340, 497, 18];
    var j = MATCH && MATCH.joueurs.filter(function (x) { return x.heros; })[0];
    if (j) { var w = aPied(j.a, j.b); return [w[0], w[1], ZSOL]; }
    return null;
  }
  function directHeros() {
    if (!MATCH) return null;
    if (S.role === "joueur") return MATCH.joueurs.filter(function (x) { return x.heros; })[0] || null;
    return (S.role === "entraineur" || S.role === "selectionneur") ? heros : null;
  }
  function directMoment(e) {
    var M = MATCH;
    if (!M || !DIRECT) return;
    var d = DIRECT.sc.decisions[e.i];
    if (!d) return;
    M.pause = 1e9; M.gel = true;
    // la caméra va au banc, à la Nord, en loge ou au joueur (pas de travelling en mouvement réduit)
    M.cible = directReduit ? null : directCible(d.camera); M.cibleSy = null;
    var total = directDuree();
    DIRECT.carte = { d: d, e: e, total: total, reste: total, fait: false, avant: performance.now() };
    var h = directHeros();
    if (h) h.emote = { k: "?", t0: performance.now() };
    directSon("match_debut");
    sonVille();
    directOuvrir(d);
  }

  var directEl = null;
  function directCarte() {
    if (directEl) return directEl;
    var vm = $("villeMatch");
    if (!vm) return null;
    var el = document.createElement("div");
    el.className = "v-direct"; el.id = "villeDirect"; el.hidden = true; el.tabIndex = -1;
    el.setAttribute("role", "alertdialog"); el.setAttribute("aria-labelledby", "villeDirectTexte");
    el.innerHTML = '<div class="v-direct-tete"><b class="v-direct-mn"></b><span class="v-direct-sc"></span>' +
      '<button type="button" class="v-direct-anneau"><svg viewBox="0 0 40 40" aria-hidden="true"><circle class="fond" cx="20" cy="20" r="16"/>' +
      '<circle class="arc" cx="20" cy="20" r="16" pathLength="100"/></svg><i></i></button></div>' +
      '<p class="v-direct-texte" id="villeDirectTexte"></p>' +
      '<div class="v-direct-gestes"><button type="button" class="v-direct-g" data-cote="g"></button><button type="button" class="v-direct-g" data-cote="d"></button></div>' +
      '<p class="v-direct-aide"></p>';
    vm.appendChild(el);
    el.querySelectorAll(".v-direct-g").forEach(function (b) {
      b.addEventListener("click", function () { directChoisir(b.getAttribute("data-cote") === "d", false); });
    });
    // l'anneau : dix secondes au lieu de cinq (une préférence du profil, gardée)
    el.querySelector(".v-direct-anneau").addEventListener("click", function () {
      if (directReduit) return;
      var p = directProfil();
      p.directLent = !p.directLent;
      try { if (window.FusibleApercu) window.FusibleApercu.sauverProfil(); } catch (e) {}
      var c = DIRECT && DIRECT.carte;
      if (c && !c.fait) {
        var t = directDuree();
        c.reste = Math.max(0, c.reste + (t - c.total)); c.total = t;
        if (c.reste <= 0.4) c.reste = 0.4;
      }
      directAnneau();
    });
    document.addEventListener("keydown", function (e) {
      var c = DIRECT && DIRECT.carte;
      if (!c || c.fait || !directEl || directEl.hidden) return;
      if (e.key === "ArrowLeft" || e.key === "1") { e.preventDefault(); directChoisir(false, false); }
      else if (e.key === "ArrowRight" || e.key === "2") { e.preventDefault(); directChoisir(true, false); }
    });
    // le compte s'arrête quand la page est cachée : on repart d'ici au retour
    document.addEventListener("visibilitychange", function () { if (DIRECT && DIRECT.carte) DIRECT.carte.avant = performance.now(); });
    directEl = el;
    return el;
  }
  function directOuvrir(d) {
    var el = directCarte();
    if (!el) return;
    var s = d.score.split("-");
    el.querySelector(".v-direct-mn").textContent = d.minute + "e";
    el.querySelector(".v-direct-sc").textContent = s[0] + " – " + s[1];
    el.querySelector(".v-direct-texte").textContent = d.texte;
    var bs = el.querySelectorAll(".v-direct-g");
    bs[0].textContent = d.gauche.label; bs[1].textContent = d.droite.label;
    bs[0].classList.toggle("defaut", d.defaut === "gauche"); bs[1].classList.toggle("defaut", d.defaut === "droite");
    bs[0].classList.remove("pris"); bs[1].classList.remove("pris");
    bs[0].disabled = bs[1].disabled = false;
    var passif = d.defaut === "gauche" ? d.gauche.label : d.droite.label;
    var p = directProfil();
    el.querySelector(".v-direct-aide").textContent = "Sans geste : « " + passif + " »." + (p.directVu || directReduit ? "" : " L'anneau : dix secondes.");
    if (!p.directVu) { p.directVu = 1; try { if (window.FusibleApercu) window.FusibleApercu.sauverProfil(); } catch (e) {} }
    $("villeMatch").querySelector(".v-match-legende").hidden = true;
    document.body.classList.add("v-direct-on");
    el.hidden = false;
    el.classList.remove("on"); void el.offsetWidth; el.classList.add("on");
    // ce que la caméra regarde se tient entre le tableau et la carte, pas dessous
    if (MATCH) {
      var tb = $("villeMatch").querySelector(".v-match-tableau").getBoundingClientRect(), cr = el.getBoundingClientRect();
      MATCH.cibleSy = Math.round((tb.bottom + cr.top) / 2);
    }
    directAnneau();
    try { el.focus({ preventScroll: true }); } catch (e) {}
  }
  function directAnneau() {
    var c = DIRECT && DIRECT.carte;
    if (!directEl || !c) return;
    var a = directEl.querySelector(".v-direct-anneau");
    a.querySelector(".arc").style.strokeDashoffset = String(Math.round((1 - c.reste / c.total) * 1000) / 10);
    a.querySelector("i").textContent = String(Math.max(0, Math.ceil(c.reste - 0.05)));
    a.classList.toggle("lent", c.total > DIRECT_SEC);
    a.setAttribute("aria-label", "Il reste " + Math.max(0, Math.ceil(c.reste)) + " secondes" + (directReduit ? "" : (c.total > DIRECT_SEC ? " ; toucher pour revenir à cinq" : " ; toucher pour en avoir dix")));
  }

  // le geste (ou le temps qui le prend : le côté passif)
  function directChoisir(droite, temps) {
    var c = DIRECT && DIRECT.carte, M = MATCH;
    if (!c || c.fait || !M) return;
    c.fait = true;
    var d = c.d, cote = droite ? d.droite : d.gauche;
    DIRECT.choix.push({ id: d.id, c: droite ? "d" : "g", t: temps ? 1 : 0 });
    if (directEl) {
      directEl.querySelectorAll(".v-direct-g").forEach(function (b) { b.disabled = true; b.classList.toggle("pris", (b.getAttribute("data-cote") === "d") === droite); });
      directEl.classList.add("ferme");
    }
    var h = directHeros();
    if (h) h.emote = { k: cote.foule === "siffle" ? "colere" : "!", t0: performance.now() };
    directSon(droite ? "choix_droite" : "choix_gauche");
    if (cote.foule === "leve") M.liesse = 2.6;
    directPouls("decide");
    M.lignes.push(d.minute + "e · « " + cote.label + " »" + (temps ? " (le temps a choisi)" : ""));
    setTimeout(function () {
      if (directEl) { directEl.hidden = true; directEl.classList.remove("ferme"); }
      document.body.classList.remove("v-direct-on");
      if (!MATCH || MATCH !== M) return;
      legende((temps ? "Personne n'a rien dit. " : "") + cote.reponse, 4200);
      sonVille();
    }, directReduit ? 0 : 380);
    setTimeout(function () {
      if (!MATCH || MATCH !== M) return;
      if (h) h.emote = null;
      M.gel = false; M.cible = null; M.cibleSy = null; M.pause = 1.6;
    }, directReduit ? 900 : 2300);
    if (DIRECT.choix.length >= DIRECT.sc.decisions.length) directMoteur();
  }

  // ─── un seul appel au moteur, après la dernière décision : la lettre, la fin du match
  function directMoteur() {
    var M = MATCH, X = DIRECT;
    if (!M || !X || X.vue) return;
    var v2 = null, tr = null;
    try {
      v2 = coquille.choisirDirect(X.droite, { d: X.choix });
      tr = JSON.parse(window.fusibleDirect(true)).dernier;
    } catch (e) { if (window.console) console.error("samedi en direct", e); }
    // (le moteur n'a pas répondu : la carte du match reste en attente, on la rejouera)
    if (!v2) { X.echec = true; return; }
    X.vue = v2; X.trace = tr;
    var lettres = String(v2.resultats || "").trim().split(/\s+/).filter(Boolean);
    M.lettres = lettres; M.lettre = lettres[lettres.length - 1] || "N";
    M.journee = v2.journee; M.rang = v2.rank;
    // la fin du match : les buts d'après la dernière décision prévue
    var fin = X.sc.fin, apres = [];
    if (tr && tr.s === X.sc.saison && tr.b === X.sc.blocs) {
      tr.buts.forEach(function (b) { if (b[0] > fin) apres.push({ t: b[1] ? "pour" : "contre", m: b[0], dit: true }); });
    }
    var avant = M.ev;
    M.ev = apres; distribuer(M, vue);
    M.ev = directOrdonner(avant.concat(apres));
    var gf = 0, ga = 0;
    M.ev.forEach(function (e) { if (e.t === "pour") gf++; if (e.t === "contre") ga++; });
    // le score est au mur dès maintenant : une page rechargée d'ici la fin reprend après le match
    S.blocsVus = v2.blocs || S.blocsVus;
    S.panneau = { dom: M.nousCourt, ext: M.advCourt, gf: gf, ga: ga };
    sauver();
  }

  // ─── à chaque image du match : l'anneau, les buts (le tableau bat, la tribune répond)
  function directTic() {
    var X = DIRECT, M = MATCH;
    if (!X || !M) return;
    var c = X.carte, now = performance.now();
    if (c && !c.fait) {
      var dt = Math.min(0.25, Math.max(0, (now - c.avant) / 1000));
      c.avant = now;
      if (!document.hidden) c.reste -= dt;
      directAnneau();
      if (c.reste <= 0) directChoisir(c.d.defaut === "droite", true);
    }
    var sc = M.score[0] + "-" + M.score[1];
    if (sc !== X.score) {
      var p = X.score.split("-");
      directSon(+M.score[0] > +p[0] ? "match_but" : "match_encaisse");
      directPouls("but");
      X.score = sc;
    }
    if (M.phase === "fin" && !X.siffle) { X.siffle = true; directSon("sifflet_final"); }
  }
  function directPouls(quoi) {
    var t = $("villeMatch") && $("villeMatch").querySelector(".v-match-tableau");
    if (!t || directReduit) return;
    t.classList.remove("v-direct-but", "v-direct-decide"); void t.offsetWidth;
    t.classList.add("v-direct-" + quoi);
  }

  // « Passer » : jusqu'à la prochaine décision (les buts d'avant tombent d'un coup), puis la fin
  function directPasser() {
    var X = DIRECT, M = MATCH;
    if (!X || !M) return false;
    if (X.carte && !X.carte.fait) return true;
    var idx = -1;
    for (var i = M.prochain; i < M.ev.length; i++) if (M.ev[i].t === "decision") { idx = i; break; }
    if (idx < 0) return !X.vue && !X.echec;
    for (var j = M.prochain; j < idx; j++) {
      var e = M.ev[j];
      if (e.fait) continue;
      e.fait = true;
      if (e.t === "pour") M.score[0]++; else if (e.t === "contre") M.score[1]++;
      if (e.dit) M.lignes.push(e.m + "e · " + texteAction(e, M));
    }
    M.action = null; M.ballon.vol = null; M.porteur = null;
    if (M.phase === "mi" || M.phase === "entree") M.phase = "jeu";
    M.prochain = idx + 1; M.minute = M.ev[idx].m;
    PANNEAU = null;
    majTableau();
    directMoment(M.ev[idx]);
    return true;
  }

  // la sortie du stade : la vue d'après arrive enfin (la carte suivante, le soir qui tombe)
  function directSortie() {
    var X = DIRECT;
    DIRECT = null;
    if (directEl) directEl.hidden = true;
    document.body.classList.remove("v-direct-on");
    S.auMatch = false;
    if (S.tranche < 3) S.tranche = 3;
    majHud();
    if (X && X.vue && coquille && coquille.presenterDirect) { coquille.presenterDirect(); return; }
    sauver();
  }
