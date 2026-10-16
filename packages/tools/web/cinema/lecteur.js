/* ═══════════════════════════════════════════════════════════════════════════
   FUSIBLE — LE LECTEUR DE FILMS (window.FusibleCinema), toujours dans la page :
   il est petit ; ce qu'il charge ne l'est pas (three.js, la trousse, le film),
   et ne se charge qu'au moment de jouer (docs/design/cinematiques.md).

     FusibleCinema.disponible(id)        le film est-il dans cette version ?
     FusibleCinema.charger(id)           → Promise<def> (three, la trousse, le film)
     FusibleCinema.prechauffer(id)       demander les fichiers d'avance (sans les lire)
     FusibleCinema.jouer(id, o)          → Promise<{ fin }> : le film plein écran,
                                           par-dessus le jeu ; « Passer », la musique,
                                           les sous-titres, la pause quand la page se
                                           cache, le mouvement réduit (des images fixes
                                           en fondu), le secours (un carton de texte)
                                           si WebGL manque ou si le chargement échoue.
                                           `fin` : fini | passe | secours | occupe
     FusibleCinema.declencheurs(liste, quand, o)   les films à jouer à ce moment-là
     FusibleCinema.siVrai(si, vue)       la petite grammaire des `si` des films
     FusibleCinema.film(def)             un film se déclare (cinema/films/<id>.js)
     FusibleCinema.tournage              l'outil de tournage (tournage.js) le pilote

   Les sources (assemble.js les écrit dans window.FUSIBLE_CINEMA) :
     { three: { url | el }, kit: { url | el }, films: { <id>: { url | el, livre } } }
   `url` : un fichier à côté de la page (la version jouable) ; `el` : un bloc
   embarqué, gzip en base64 (le fichier seul). Aucune erreur ici ne bloque le jeu :
   au pire, le film ne se joue pas et la partie continue.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var FC = global.FusibleCinema = global.FusibleCinema || {};
  FC.version = "1.0.0";
  FC.films = FC.films || {};
  FC.film = function (def) { FC.films[def.id] = def; return def; };
  var doc = global.document;

  function sources() { return global.FUSIBLE_CINEMA || null; }
  FC.disponible = function (id) { var s = sources(); return !!(s && s.three && s.kit && s.films && s.films[id]); };
  FC.webgl = function () {
    try { var c = doc.createElement("canvas"); return !!(global.WebGL2RenderingContext && c.getContext("webgl2")); } catch (e) { return false; }
  };

  // ─── le chargement : un fichier (<script src>), ou un bloc embarqué décompressé
  function base64(s) { var b = global.atob(s), n = b.length, o = new Uint8Array(n); for (var i = 0; i < n; i++) o[i] = b.charCodeAt(i); return o; }
  function degzip(octets) {
    if (typeof global.DecompressionStream === "function" && typeof global.Response === "function") {
      try {
        var flux = new Blob([octets]).stream().pipeThrough(new global.DecompressionStream("gzip"));
        return new Response(flux).text();
      } catch (e) { /* le secours */ }
    }
    var FCo = global.FusibleContenu;
    if (FCo && FCo._degzip) return Promise.resolve(new TextDecoder("utf-8").decode(FCo._degzip(octets)));
    return Promise.reject(new Error("pas de quoi décompresser"));
  }
  var CHARGES = {};
  function chargerSource(cle, src) {
    if (CHARGES[cle]) return CHARGES[cle];
    var p = new Promise(function (ok, ko) {
      if (!src) { ko(new Error("source absente : " + cle)); return; }
      if (src.url) {
        var s = doc.createElement("script");
        s.src = src.url; s.async = true;
        s.onload = function () { ok(); };
        s.onerror = function () { if (s.parentNode) s.parentNode.removeChild(s); ko(new Error(src.url + " : injoignable")); };
        doc.head.appendChild(s);
      } else if (src.el) {
        var el = doc.getElementById(src.el);
        if (!el) { ko(new Error("bloc absent : " + src.el)); return; }
        degzip(base64(el.textContent)).then(function (txt) {
          var s2 = doc.createElement("script");
          s2.text = txt + "\n//# sourceURL=fusible-cinema-" + cle + ".js";
          doc.head.appendChild(s2);
          ok();
        }, ko);
      } else ko(new Error("source inconnue : " + cle));
    });
    CHARGES[cle] = p;
    p.catch(function () { delete CHARGES[cle]; });
    return p;
  }
  FC.charger = function (id) {
    var s = sources();
    if (!s || !s.films || !s.films[id]) return Promise.reject(new Error("le film " + id + " n'est pas dans cette version"));
    return chargerSource("three", s.three)
      .then(function () { return chargerSource("kit", s.kit); })
      .then(function () { return chargerSource("film:" + id, s.films[id]); })
      .then(function () {
        if (!FC.films[id]) throw new Error("le film " + id + " ne s'est pas déclaré");
        if (!global.FusibleTHREE || !FC.kit || !FC.kit.Film) throw new Error("la trousse ne s'est pas chargée");
        return FC.films[id];
      });
  };
  // les fichiers d'avance, dans le cache du navigateur (et du service worker) : rien ne s'exécute
  FC.prechauffer = function (id) {
    var s = sources();
    if (!s || !global.fetch) return;
    [s.three, s.kit, s.films && s.films[id]].forEach(function (src) { if (src && src.url) global.fetch(src.url).catch(function () {}); });
  };

  // ─── les déclencheurs (content/ville/films_*.yaml, compilés sous ville.films)
  // la grammaire des `si` des films : des termes reliés par && — flag(x), !flag(x),
  // saison / annee / relation.<id> comparés à un nombre (== != >= <= > <)
  FC.siVrai = function (si, vue) {
    if (!si) return true;
    vue = vue || {};
    var fl = vue.flags || [], ok = true;
    String(si).split("&&").forEach(function (t0) {
      if (!ok) return;
      var t = t0.trim().replace(/['"]/g, ""), m;
      if ((m = /^(!)?\s*flag\(\s*([A-Za-z0-9_.]+)\s*\)$/.exec(t))) { var a = fl.indexOf(m[2]) >= 0; ok = m[1] ? !a : a; return; }
      if ((m = /^(saison|annee|relation\.[a-z0-9_]+)\s*(==|!=|>=|<=|>|<)\s*(-?\d+)$/.exec(t))) {
        var v = m[1] === "saison" ? (vue.season || 1) : m[1] === "annee" ? (vue.year || 1990) : ((vue.relations || {})[m[1].slice(9)] || 0), n = +m[3];
        ok = m[2] === "==" ? v === n : m[2] === "!=" ? v !== n : m[2] === ">=" ? v >= n : m[2] === "<=" ? v <= n : m[2] === ">" ? v > n : v < n;
        return;
      }
      ok = false;   // un terme qu'on ne sait pas lire : build_content l'aurait refusé
    });
    return ok;
  };
  //  o = { vue, vus: { id: 1 }, role, carte (id), moment: 'avant'|'apres', drapeaux: true }
  FC.declencheurs = function (liste, quand, o) {
    o = o || {};
    var vue = o.vue || {}, vus = o.vus || {};
    return (liste || []).filter(function (f) {
      if (!f || f.quand !== quand || vus[f.id]) return false;
      if (!FC.disponible(f.module)) return false;
      if (f.roles && f.roles.length && f.roles.indexOf(o.role || vue.role) < 0) return false;
      if (quand === "carte") {
        if ((f.moment || "avant") !== (o.moment || "avant") || !o.carte) return false;
        if (!((f.cartes && f.cartes.indexOf(o.carte) >= 0) || (f.prefixe && o.carte.indexOf(f.prefixe) === 0))) return false;
      }
      if (quand === "drapeau" && (vue.flags || []).indexOf(f.drapeau) < 0) return false;
      return FC.siVrai(f.si, vue);
    });
  };

  // ─── le lecteur
  var STYLE = [
    ".fc-film{position:fixed;inset:0;z-index:2147483000;background:#000;opacity:0;transition:opacity .35s ease;touch-action:none;-webkit-user-select:none;user-select:none;overflow:hidden;--fc:#FF5A4E}",
    ".fc-film.on{opacity:1}",
    ".fc-film canvas{position:absolute;inset:0;width:100%;height:100%;display:block}",
    ".fc-film .fc-grain{mix-blend-mode:overlay;pointer-events:none}",
    ".fc-film .fc-fixe{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity 1.4s ease}",
    ".fc-film .fc-fixe.on{opacity:1}",
    ".fc-film .fc-passer{position:absolute;top:calc(env(safe-area-inset-top,0px) + 10px);right:calc(env(safe-area-inset-right,0px) + 12px);z-index:3;min-height:36px;min-width:44px;padding:0 12px;",
    "font:700 11px/1 'Space Mono','DejaVu Sans Mono',monospace;letter-spacing:.16em;text-transform:uppercase;color:rgba(242,232,206,.62);background:rgba(0,0,0,.28);",
    "border:1px solid rgba(242,232,206,.24);border-radius:2px;cursor:pointer;-webkit-tap-highlight-color:transparent}",
    ".fc-film .fc-passer:hover,.fc-film .fc-passer:focus-visible{color:#F2E8CE;border-color:rgba(242,232,206,.6);outline:0}",
    ".fc-film .fc-attente{position:absolute;left:0;top:0;height:2px;width:0;background:var(--fc);box-shadow:0 0 12px var(--fc);transition:width .5s ease}",
    ".fc-film .fc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}",
    ".fc-film .fc-carton{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:0 28px;text-align:center;opacity:0;transition:opacity .6s}",
    ".fc-film .fc-carton.on{opacity:1}",
    ".fc-film .fc-carton b{font:400 clamp(30px,10vw,58px)/1.05 'Jersey 15','Space Mono',monospace;letter-spacing:.04em;text-transform:uppercase;color:var(--fc);",
    "text-shadow:3px 0 rgba(255,0,90,.55),-3px 0 rgba(0,220,255,.45),0 0 26px var(--fc);transform:skewX(-6deg)}",
    ".fc-film .fc-carton span{font:700 12px/1.4 'Space Mono',monospace;letter-spacing:.24em;text-transform:uppercase;color:#CBBB92}",
    ".fc-film .fc-carton i{font:400 15px/1.45 'Space Mono',monospace;color:#F2E8CE;max-width:30em}"
  ].join("");
  function style() {
    if (doc.getElementById("fc-style")) return;
    var s = doc.createElement("style"); s.id = "fc-style"; s.textContent = STYLE; doc.head.appendChild(s);
  }
  var EN_COURS = null;
  FC.enCours = function () { return !!EN_COURS; };
  FC.passer = function () { if (EN_COURS) EN_COURS.finir("passe"); };

  // la musique du film : son thème s'il existe (les thèmes des livres arrivent avec
  // le moteur de musique), sinon son secours, sinon on ne touche à rien
  function themeDe(def, audio) {
    var th = (audio && audio.THEMES) || [];
    if (def.musique && th.indexOf(def.musique) >= 0) return def.musique;
    if (def.secours && th.indexOf(def.secours) >= 0) return def.secours;
    return null;
  }
  FC.themeDe = themeDe;

  //  o = { heros: { nom, genre }, couleur, qualite, reduit, audio (FusibleAudio), titre, sous (le secours) }
  FC.jouer = function (id, o) {
    o = o || {};
    if (EN_COURS) return Promise.resolve({ fin: "occupe" });
    style();
    var audio = o.audio === undefined ? global.FusibleAudio : o.audio;
    var reduit = o.reduit != null ? !!o.reduit : !!(global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches);
    var racine = doc.createElement("div");
    racine.className = "fc-film"; racine.setAttribute("role", "dialog"); racine.setAttribute("aria-modal", "true");
    racine.setAttribute("aria-label", o.titre ? "Film : " + o.titre : "Un film");
    if (o.couleur) racine.style.setProperty("--fc", o.couleur);
    racine.innerHTML = '<canvas class="fc-image"></canvas><canvas class="fc-habillage"></canvas><canvas class="fc-grain"></canvas>' +
      '<div class="fc-attente"></div><p class="fc-sr" aria-live="polite"></p><button type="button" class="fc-passer">Passer ›</button>';
    doc.body.appendChild(racine);
    var cvImg = racine.querySelector(".fc-image"), cvHab = racine.querySelector(".fc-habillage"), cvGrain = racine.querySelector(".fc-grain");
    var sr = racine.querySelector(".fc-sr"), attente = racine.querySelector(".fc-attente"), bouton = racine.querySelector(".fc-passer");
    global.requestAnimationFrame(function () { racine.classList.add("on"); });
    try { bouton.focus({ preventScroll: true }); } catch (e) { /* rien */ }
    var themeAvant = audio && audio.theme ? audio.theme() : null;

    return new Promise(function (resolve) {
      var fini = false, F = null, raf = 0, minuteurs = [], ecoutes = [];
      var L = { finir: null };
      EN_COURS = L;
      function ecouter(cible, type, fn, opt) { cible.addEventListener(type, fn, opt); ecoutes.push([cible, type, fn, opt]); }
      function finir(raison) {
        if (fini) return;
        fini = true;
        if (F && F.annuler) F.annuler();
        global.cancelAnimationFrame(raf);
        minuteurs.forEach(function (m) { clearTimeout(m); });
        ecoutes.forEach(function (e) { e[0].removeEventListener(e[1], e[2], e[3]); });
        racine.classList.remove("on");
        setTimeout(function () {
          try { if (F) F.detruire(); } catch (e) { /* rien */ }
          if (racine.parentNode) racine.parentNode.removeChild(racine);
          if (EN_COURS === L) EN_COURS = null;
          if (audio && audio.setTheme && o.rendreTheme !== false) { try { audio.setTheme(themeAvant); } catch (e) { /* rien */ } }
          resolve({ fin: raison });
        }, 380);
      }
      L.finir = finir;
      ecouter(bouton, "click", function (e) { e.stopPropagation(); finir("passe"); });
      ecouter(doc, "keydown", function (e) {
        if (e.key === "Escape") { e.preventDefault(); finir("passe"); }
        // le jeu, dessous, n'entend rien pendant le film : une flèche répondrait à la carte qui
        // attend. (Entrée sur « Passer » le déclenche quand même : c'est l'action du bouton.)
        e.stopPropagation();
        if (/^Arrow/.test(e.key)) e.preventDefault();
      }, true);

      // le secours : un carton de texte, quelques secondes, puis la partie reprend
      var cartonPose = false;
      function carton(def, raison) {
        if (fini || cartonPose) return;
        cartonPose = true;
        cvImg.style.display = "none"; cvGrain.style.display = "none";
        attente.style.width = "0";
        var c = doc.createElement("div"); c.className = "fc-carton";
        var tx = (def && def.textes) || [], titre = tx.filter(function (x) { return x.sorte === "titre"; })[0], lieu = tx.filter(function (x) { return x.sorte === "lieu"; })[0];
        var rep = tx.filter(function (x) { return x.sorte === "replique"; })[0];
        var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (ch) { return ch === "&" ? "&amp;" : ch === "<" ? "&lt;" : ch === ">" ? "&gt;" : "&quot;"; }); };
        c.innerHTML = "<b>" + esc((titre && titre.texte) || o.titre || (def && def.titre) || "") + "</b><span>" + esc((titre && titre.sous) || (lieu && lieu.texte) || o.sous || "") + "</span>" +
          (rep ? "<i>« " + esc(rep.texte) + " »" + (rep.qui ? " — " + esc(rep.qui) : "") + "</i>" : "");
        racine.appendChild(c);
        sr.textContent = c.textContent;
        global.requestAnimationFrame(function () { c.classList.add("on"); });
        minuteurs.push(setTimeout(function () { c.classList.remove("on"); }, 4200));
        minuteurs.push(setTimeout(function () { finir(raison || "secours"); }, 4900));
      }

      // le secours avec les mots du film : la trousse et le film se lisent sans three.js (ils
      // ne font que se déclarer ; rien de three.js ne se crée avant `preparer`) ; s'ils ne
      // viennent pas vite, le titre seul
      function cartonDuFilm(raison) {
        if (fini) return;
        if (FC.films[id]) { carton(FC.films[id], raison); return; }
        var s = sources(), fait = false;
        var vite = setTimeout(function () { if (!fait) { fait = true; carton(null, raison); } }, 2500);
        minuteurs.push(vite);
        chargerSource("kit", s && s.kit).then(function () { return chargerSource("film:" + id, s && s.films && s.films[id]); }).then(function () {
          if (!fait) { fait = true; clearTimeout(vite); carton(FC.films[id] || null, raison); }
        }, function () { if (!fait) { fait = true; clearTimeout(vite); carton(null, raison); } });
      }
      if (!FC.webgl()) { cartonDuFilm("secours"); return; }
      attente.style.width = "22%";
      var garde = setTimeout(function () { if (!F && !fini) cartonDuFilm("secours"); }, o.patience || 15000);
      minuteurs.push(garde);

      FC.charger(id).then(function (def) {
        if (fini) return;
        attente.style.width = "55%";
        var K = FC.kit;
        var q = o.qualite || K.qualiteAppareil();
        // la taille de la mémoire d'image : l'écran, la densité plafonnée, l'échelle de la qualité
        var Q = K.QUALITES[q] || K.QUALITES.moyenne, echelle = 1;
        function dimensions() {
          var r = racine.getBoundingClientRect(), dpr = Math.min(global.devicePixelRatio || 1, Q.dprMax) * Q.echelle * echelle;
          return { w: Math.max(2, Math.round(r.width * dpr)), h: Math.max(2, Math.round(r.height * dpr)), cw: r.width, ch: r.height };
        }
        var dim = dimensions();
        cvImg.width = dim.w; cvImg.height = dim.h;
        F = K.Film(def, { canvas: cvImg, largeur: dim.w, hauteur: dim.h, qualite: q, heros: o.heros });
        return K.habillage.polices().then(function () { return F.preparer(); }).then(function () {
          if (fini) return;
          clearTimeout(garde);
          attente.style.width = "100%";
          setTimeout(function () { attente.style.opacity = "0"; }, 300);
          var theme = themeDe(def, audio);
          if (theme && audio && audio.setTheme) { try { audio.setTheme(theme); } catch (e) { /* rien */ } }
          if (reduit) return fixes(def, K, dim, theme);
          return direct(def, K, Q, dimensions, function (d) { dim = d; }, function (k) { echelle = k; });
        });
      }).catch(function (e) {
        if (global.console) console.warn("FusibleCinema : " + (e && e.message ? e.message : e));
        if (!fini) cartonDuFilm("secours");
      });

      // ─── le direct : une image par rafraîchissement (30 par seconde au plus sur un téléphone)
      function direct(def, K, Q, dimensions, poserDim, poserEchelle) {
        var hx = cvHab.getContext("2d"), gx = cvGrain.getContext("2d");
        var dimH = { w: 0, h: 0 };
        function tailleHabillage() {
          var r = racine.getBoundingClientRect(), d = Math.min(global.devicePixelRatio || 1, 2);
          var w = Math.round(r.width * d), h = Math.round(r.height * d);
          if (w !== dimH.w || h !== dimH.h) { cvHab.width = cvGrain.width = w; cvHab.height = cvGrain.height = h; dimH = { w: w, h: h }; }
        }
        tailleHabillage();
        var debut = performance.now(), pause = 0, cacheDepuis = doc.hidden ? debut : 0, dernierRendu = 0, tPrec = -1;
        var mesures = [], niveau = 0, sonsJoues = 0, srTexte = "";
        var pasMin = Q.ips >= 60 ? 0 : 1000 / Q.ips - 2;
        ecouter(doc, "visibilitychange", function () {
          if (doc.hidden) cacheDepuis = performance.now();
          else if (cacheDepuis) { pause += performance.now() - cacheDepuis; cacheDepuis = 0; }
        });
        ecouter(global, "resize", function () {
          var d = dimensions(); cvImg.width = d.w; cvImg.height = d.h; F.taille(d.w, d.h); poserDim(d); tailleHabillage();
        });
        function image(now) {
          if (fini) return;
          raf = global.requestAnimationFrame(image);
          if (cacheDepuis) return;
          if (pasMin && now - dernierRendu < pasMin) return;
          var dt = dernierRendu ? now - dernierRendu : 0;
          dernierRendu = now;
          var t = (now - debut - pause) / 1000;
          if (t >= F.duree) { finir("fini"); return; }
          try {
            F.rendre(t, cvImg.width / cvImg.height);
          } catch (e) { if (global.console) console.warn("FusibleCinema : " + e.message); carton(def, "secours"); return; }
          hx.clearRect(0, 0, dimH.w, dimH.h);
          var etat = F.etat(t);
          K.habillage.dessiner(hx, dimH.w, dimH.h, etat);
          if (Q.nom !== "basse" && F.grain) { gx.clearRect(0, 0, dimH.w, dimH.h); K.habillage.grain(gx, dimH.w, dimH.h, t, F.grain); }
          // les sous-titres pour un lecteur d'écran
          var rep = etat.textes.filter(function (x) { return x.sorte !== "titre"; }).map(function (x) { return (x.qui ? x.qui + " : " : "") + x.texte + (x.sous ? ", " + x.sous : ""); }).join(" ");
          if (rep !== srTexte) { srTexte = rep; sr.textContent = rep; }
          // les bruits du film, quand leur temps passe
          while (sonsJoues < F.sons.length && F.sons[sonsJoues][0] <= t) {
            if (F.sons[sonsJoues][0] > tPrec - 0.25 && audio && audio.play) { try { audio.play(F.sons[sonsJoues][1]); } catch (e) { /* rien */ } }
            sonsJoues++;
          }
          tPrec = t;
          // la qualité qui s'adapte : après une seconde, si l'image coûte plus de 45 ms,
          // on baisse la résolution, puis on coupe le bloom, puis on baisse encore
          if (t > 1.0 && dt > 0 && niveau < 3) {
            mesures.push(dt);
            if (mesures.length >= 24) {
              var moy = mesures.reduce(function (a, b) { return a + b; }, 0) / mesures.length;
              mesures = [];
              if (moy > 45) {
                niveau++;
                if (niveau === 2 && F.rendu && F.rendu.bloom) F.rendu.bloom.enabled = false;
                else { poserEchelle(niveau === 1 ? 0.75 : 0.56); var d = dimensions(); cvImg.width = d.w; cvImg.height = d.h; F.taille(d.w, d.h); poserDim(d); }
              }
            }
          }
        }
        raf = global.requestAnimationFrame(image);
      }

      // ─── le mouvement réduit : une image fixe par plan, en fondu lent, les textes par-dessus
      function fixes(def, K, dim, theme) {
        var imgs = [], plans = F.fixes();
        try {
          plans.forEach(function (p) {
            F.rendre(p.t, cvImg.width / cvImg.height);
            var im = doc.createElement("img"); im.className = "fc-fixe"; im.alt = "";
            im.src = cvImg.toDataURL("image/jpeg", 0.88);
            racine.insertBefore(im, cvHab);
            imgs.push(im);
          });
        } catch (e) { carton(def, "secours"); return; }
        cvImg.style.display = "none"; cvGrain.style.display = "none";
        // la mémoire de la carte graphique se rend tout de suite : il ne reste que des images
        try { F.rendu.detruire(); } catch (e) { /* rien */ }
        var hx = cvHab.getContext("2d"), r = racine.getBoundingClientRect(), d = Math.min(global.devicePixelRatio || 1, 2);
        cvHab.width = Math.round(r.width * d); cvHab.height = Math.round(r.height * d);
        var debut = performance.now(), pause = 0, cacheDepuis = 0, courant = -1;
        ecouter(doc, "visibilitychange", function () {
          if (doc.hidden) cacheDepuis = performance.now();
          else if (cacheDepuis) { pause += performance.now() - cacheDepuis; cacheDepuis = 0; }
        });
        function image(now) {
          if (fini) return;
          raf = global.requestAnimationFrame(image);
          if (cacheDepuis) return;
          var t = (now - debut - pause) / 1000;
          if (t >= F.duree) { finir("fini"); return; }
          var i = 0; while (i < plans.length - 1 && t >= plans[i + 1].de) i++;
          if (i !== courant) { if (courant >= 0) imgs[courant].classList.remove("on"); imgs[i].classList.add("on"); courant = i; }
          var etat = F.etat(t);
          etat.noir = 0; etat.flash = 0;   // pas d'éclair ni de fondu au noir : le fondu des images suffit
          hx.clearRect(0, 0, cvHab.width, cvHab.height);
          K.habillage.dessiner(hx, cvHab.width, cvHab.height, etat);
          var rep = etat.textes.map(function (x) { return (x.qui ? x.qui + " : " : "") + x.texte; }).join(" ");
          if (sr.textContent !== rep) sr.textContent = rep;
        }
        raf = global.requestAnimationFrame(image);
      }
    });
  };

  // ─── LE TOURNAGE (packages/tools/web/cinema/tournage.js) : l'image maîtresse (un
  // carré), puis chaque format découpé dedans et habillé, en JPEG
  var TOURNAGE = null;
  FC.tournage = {
    //  o = { taille: 1920, qualite: 'haute', heros }
    preparer: function (id, o) {
      o = o || {};
      var K = FC.kit, def = FC.films[id];
      if (!def) return Promise.reject(new Error("film inconnu : " + id));
      var S = o.taille || 1920, cv = doc.createElement("canvas");
      cv.width = cv.height = S;
      var F = K.Film(def, { canvas: cv, largeur: S, hauteur: S, qualite: o.qualite || "haute", heros: o.heros, tournage: true });
      TOURNAGE = { F: F, cv: cv, S: S, toiles: {} };
      return K.habillage.polices().then(function () { return F.preparer(); }).then(function () {
        return { id: def.id, livre: def.livre, titre: def.titre, duree: def.duree, musique: def.musique, secours: def.secours, sons: F.sons,
          montages: def.montages || {}, affiche: def.affiche == null ? def.duree * 0.5 : def.affiche, couleur: F.couleur, grain: F.grain,
          textes: def.textes || [], sortie: def.sortie || {}, memoire: F.memoire ? F.memoire() : null, preparation: F.preparation };
      });
    },
    rendre: function (t) { TOURNAGE.F.rendre(t, 1); var i = TOURNAGE.F.info(); return i; },
    film: function () { return TOURNAGE && TOURNAGE.F; },
    //  le format (w × h) découpé dans l'image maîtresse, habillé, en JPEG (base64 sans en-tête) ;
    //  o.textes : les textes à poser à la place de ceux du film (une affiche : [] ou le titre seul)
    composer: function (w, h, t, qualiteJpeg, o) {
      var K = FC.kit, Tt = TOURNAGE, cle = w + "x" + h, c = Tt.toiles[cle];
      if (!c) { c = doc.createElement("canvas"); c.width = w; c.height = h; Tt.toiles[cle] = c; }
      var x = c.getContext("2d"), f = Tt.F.fenetre(t, w / h), etat = Tt.F.etat(t);
      if (o && o.textes) etat.textes = o.textes;
      x.imageSmoothingEnabled = true; x.imageSmoothingQuality = "high";
      x.drawImage(Tt.cv, f[0] * Tt.S, f[1] * Tt.S, f[2] * Tt.S, f[3] * Tt.S, 0, 0, w, h);
      K.habillage.dessiner(x, w, h, etat);
      if (Tt.F.grain) { x.save(); x.globalCompositeOperation = "overlay"; K.habillage.grain(x, w, h, t, Tt.F.grain); x.restore(); }
      return c.toDataURL("image/jpeg", qualiteJpeg || 0.93).slice(23);
    },
    // ce que coûte le film : appels, triangles, textures, le temps d'une image
    mesurer: function (t) {
      var a = performance.now(); TOURNAGE.F.rendre(t, 1);
      var gl = TOURNAGE.F.rendu.renderer.getContext(), px = new Uint8Array(4); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
      var i = TOURNAGE.F.info(); i.ms = performance.now() - a; return i;
    }
  };
})(typeof window !== "undefined" ? window : this);
