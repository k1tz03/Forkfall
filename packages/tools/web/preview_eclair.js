  // ═══════════════════════════════════════════════════════════════════════════
  // LE FUSIBLE — le mode éclair (preview_eclair.js), inséré par assemble.js dans la
  // fermeture du gabarit (PREVIEW_MODULES, au repère `__PREVIEW_MODULES__`).
  //
  // Une carrière de dix minutes, à côté des livres : un rôle et une époque tirés au sort
  // (un entraîneur en 1993, une présidente en 2041), les quatre jauges visibles et mortelles
  // comme dans *Reigns*, PAS de ville — rien que les cartes. Le score est le nombre de
  // semaines tenues (`view.semaines`, dérivé du monde simulé par le moteur) ; le défi du
  // jour est le même pour tout le monde (la date de Paris → un rôle et une graine, par
  // hachage : `defiDe` ci-dessous, le miroir de `defiDuJour` de eclair.dart, parce que le moteur
  // n'est pas encore chargé quand l'accueil se dessine).
  //
  // Ce que ce module fait, et pourquoi il ne touche presque rien au gabarit :
  //  · il passe par les crochets de la coquille (`debut`, `carte`, `reponse`, `fin`,
  //    `reprise`, `accueil`) — le mode se lit sur la vue (`view.mode === "eclair"`) ;
  //  · la ville est contournée en posant `VILLE = null` le temps d'une partie éclair :
  //    toute la coquille retombe sur son chemin « sans ville » (celui de l'aperçu simple,
  //    déjà tenu), et `VILLE` revient à l'accueil. Même chose pour `MODE_HISTOIRE` et les
  //    classes du <body> (`mode-histoire` cache le rail ; `ville-on` cache les cartes) ;
  //  · une partie éclair ne touche JAMAIS aux sauvegardes des livres ni au Cimetière : sa
  //    seule mémoire est `fusible.eclair.v1` (le record, les scores des derniers jours, la
  //    partie en cours qu'on peut reprendre) ;
  //  · le classement du jour (optionnel) passe par la capacité `db` du support, une seule
  //    écriture à la fin d'un défi du jour, jamais au chargement, aucun nom ; sans elle
  //    (ou refusée), il ne reste que le record local, sans une erreur à l'écran.
  //
  // Le tout est dans une fonction : les noms d'ici ne rencontrent jamais ceux de la fermeture.
  // ═══════════════════════════════════════════════════════════════════════════
  (function () {
    var API = window.FusibleApercu;
    if (!API || !API.contenu || !Array.isArray(API.contenu.postulats)) return;

    var CLE = "fusible.eclair.v1", MAX_JOURS = 40;
    var HIST0 = MODE_HISTOIRE, VILLE0 = VILLE;   // ce que les livres attendent, pour le leur rendre
    var enleve = false;                           // `ville-on` ôtée par nous : on la rend
    var E = null;                                 // la partie éclair en cours
    var BRIEF = null;                             // l'affiche de départ, tant qu'elle est ouverte
    var S = charger();                            // ce qui se garde d'une partie à l'autre
    var TEST = { jour: null };                    // pour les essais : une autre date

    // ─── la mémoire (localStorage, jamais bloquante) ─────────────────────────────
    function vide() { return { v: 1, best: 0, bestCartes: 0, parties: 0, jours: {}, cours: null }; }
    function charger() {
      try {
        var o = JSON.parse(localStorage.getItem(CLE));
        if (o && typeof o === "object" && o.v === 1) {
          o.best = o.best | 0; o.bestCartes = o.bestCartes | 0; o.parties = o.parties | 0;
          if (!o.jours || typeof o.jours !== "object") o.jours = {};
          if (!o.cours || typeof o.cours !== "object") o.cours = null;
          return o;
        }
      } catch (e) {}
      return vide();
    }
    function garder() {
      // les scores des quarante derniers jours, pas un de plus
      var ds = Object.keys(S.jours).sort();
      while (ds.length > MAX_JOURS) delete S.jours[ds.shift()];
      try { localStorage.setItem(CLE, JSON.stringify(S)); } catch (e) {}
    }

    // ─── le jour, le défi, les mots ──────────────────────────────────────────────
    // Le jour de Paris : le même instant donne la même date à tout le monde, où qu'il soit,
    // et le défi change à minuit chez nous (le jeu est en français).
    function jourDeParis() {
      if (TEST.jour) return TEST.jour;
      try {
        var p = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
        if (/^\d{4}-\d{2}-\d{2}$/.test(p)) return p;
      } catch (e) {}
      return new Date().toISOString().slice(0, 10);
    }
    // Le défi d'une date : le rôle et la graine, par hachage FNV-1a — le MIROIR de `defiDuJour`
    // (packages/core/lib/src/eclair.dart, qui reste la référence : eclair_test.dart en épingle des valeurs).
    // Il vit ici parce que le moteur n'est pas là à l'accueil (demarrage.js le charge après lui) et que
    // son contenu n'arrive qu'avec un livre : la date suffit, et la liste des postulats éclair.
    function fnv1a32(t) {
      var h = 0x811c9dc5;
      for (var i = 0; i < t.length; i++) { h ^= t.charCodeAt(i) & 0xFF; h = Math.imul(h, 0x01000193) >>> 0; }
      return h >>> 0;
    }
    function defiDe(date, posts) {
      posts = posts || postulatsEclair();
      if (!posts.length || !/^\d{4}-\d{2}-\d{2}$/.test(date || "")) return null;
      var p = posts[fnv1a32("fusible|eclair|role|" + date) % posts.length];
      return { date: date, postulat: p.index, role: p.role, seed: fnv1a32("fusible|eclair|graine|" + date) & 0x7FFFFFFF };
    }
    function defi() { return defiDe(jourDeParis()); }
    function roleNom(role) {
      var rs = (API.contenu && API.contenu.roles) || [];
      for (var i = 0; i < rs.length; i++) if (rs[i] && rs[i].id === role) return String(rs[i].name || role).toLowerCase();
      return String(role || "");
    }
    var ROLE_UN = {
      entraineur: ["un entraîneur", "une entraîneuse"], joueur: ["un joueur", "une joueuse"],
      ds: ["un directeur sportif", "une directrice sportive"], president: ["un président", "une présidente"],
      selectionneur: ["un sélectionneur", "une sélectionneuse"]
    };
    function roleUn(role, genre) { var r = ROLE_UN[role]; return r ? r[genre === "f" ? 1 : 0] : String(role || ""); }
    function majuscule(t) { t = String(t || ""); return t.charAt(0).toUpperCase() + t.slice(1); }
    function semainesTxt(n) { n = n | 0; return n + (n > 1 ? " semaines" : " semaine"); }
    function tenuesTxt(n) { n = n | 0; return n + (n > 1 ? " semaines tenues" : " semaine tenue"); }
    function rangHtml(n) { n = n | 0; return n === 1 ? "1<sup>re</sup>" : n + "<sup>e</sup>"; }
    function dateCourte(d) { var p = String(d || "").split("-"); return p.length === 3 ? p[2] + "/" + p[1] : String(d || ""); }
    function esc(t) { return escapeHtml(t); }
    function postulatsEclair() {
      var l = (API.contenu.postulats || []).filter(function (p) { return p && p.mode === "eclair"; });
      l.sort(function (x, y) { return (x.index | 0) - (y.index | 0); });
      return l;
    }

    // ─── le mode : ce que la coquille retrouve selon la partie ────────────────────
    function passerEnEclair() {
      VILLE = null;                 // pas de ville : la coquille retombe sur son chemin sans ville
      MODE_HISTOIRE = false;        // les jauges se montrent, et le bandeau compte les alertes
      var b = document.body;
      if (b.classList.contains("ville-on")) { b.classList.remove("ville-on"); enleve = true; }
      b.classList.remove("mode-histoire");
      b.classList.add("mode-eclair");
      // une couche de ville restée allumée (un livre laissé en route) ne couvre pas les cartes
      var couche = document.getElementById("villeCouche");
      if (couche) couche.hidden = true;
      var g = document.getElementById("gameScreen");
      if (g) g.classList.remove("carte-on");
    }
    function retourHistoire() {
      VILLE = VILLE0;
      MODE_HISTOIRE = HIST0;
      var b = document.body;
      if (enleve && VILLE0) b.classList.add("ville-on");
      enleve = false;
      b.classList.toggle("mode-histoire", !!HIST0);
      b.classList.remove("mode-eclair");
    }

    // ─── l'accueil : la cartouche du Fusible ──────────────────────────────────────
    // Un fusible de verre pixel par pixel, sa mèche qui brûle au milieu, et les quatre
    // pictogrammes des jauges au-dessous : l'image de ce qu'on va jouer, sans une
    // ressource de plus.
    // un fusible à cartouche, pixel par pixel : deux capuchons de métal, le verre, et la mèche de
    // cuivre qui vient de lâcher au milieu — une étincelle, une flamme, la suie autour
    function ligneFuse(i) {
      var verre = 24, ferr = "MMMM", bord = ".MMM";
      var milieu = [
        "CCCCCCCCCCCCCCCCCCCCCCCC", "GGGGGGGGGGGGGGGGGGGGGGGG", "GGGGGGGGGGGSSGGGGGGGGGGG",
        "WWWWWWWWWWKSSKWWWWWWWWWW", "GGGGGGGGGGGFFGGGGGGGGGGG", "GGGGGGGGGGGGGGGGGGGGGGGG", "CCCCCCCCCCCCCCCCCCCCCCCC"
      ];
      if (i === 0 || i === 8) return bord + new Array(verre + 1).join(".") + "MMM.";
      return ferr + milieu[i - 1] + ferr;
    }
    var FUSE = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(ligneFuse);
    var FUSE_COUL = { M: "#CDB68C", C: "#9A90C2", G: "#3B3158", W: "#FF9A3C", S: "#FFF4D8", F: "#FF5A4E", K: "#1A1218" };
    function fusibleSvg() {
      var r = "";
      FUSE.forEach(function (l, y) {
        for (var x = 0; x < l.length; x++) {
          var c = l.charAt(x);
          if (c === ".") continue;
          r += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + FUSE_COUL[c] + '"/>';
        }
      });
      return '<svg class="fz-fusible" viewBox="0 0 32 9" shape-rendering="crispEdges" aria-hidden="true">' + r + "</svg>";
    }
    function jaugesIcones() {
      var out = "";
      ["vestiaire", "tribunes", "president", "caisse"].forEach(function (n, i) {
        out += '<span class="fz-ic' + (i === 3 ? " bord" : "") + '">' + icon(n, 24) + "</span>";
      });
      return out;
    }

    function monterAccueil() {
      if (!postulatsEclair().length) return;
      var el = document.getElementById("eclairCarte");
      if (!el) {
        el = document.createElement("section");
        el.id = "eclairCarte"; el.className = "fz-carte";
        el.setAttribute("aria-labelledby", "fzTitre");
        var starts = document.querySelector("#titleScreen .starts"), ecran = document.getElementById("titleScreen");
        if (starts && starts.parentNode) starts.parentNode.insertBefore(el, starts);
        else if (ecran) ecran.appendChild(el);
        else return;
        el.addEventListener("click", function (e) {
          var b = e.target && e.target.closest ? e.target.closest("[data-a]") : null;
          if (b) agir(b.getAttribute("data-a"));
        });
        // le doigt posé, le livre de la partie arrive déjà (demarrage.js) : la touche part sans attendre
        el.addEventListener("pointerdown", function (e) {
          var b = e.target && e.target.closest ? e.target.closest("[data-a]") : null;
          if (b) prechauffer(b.getAttribute("data-a"));
        });
      }
      var d = defi();
      var auj = S.jours[jourDeParis()];
      var cours = coursReprenable();
      var puces = '<span class="fz-puce">10 minutes</span><span class="fz-puce">Graine du jour</span>' +
        (S.best ? '<span class="fz-puce or">Record : ' + esc(semainesTxt(S.best)) + "</span>" : "");
      // le rôle du jour se dit à l'accueil ; l'époque, elle, sort de la graine au départ (l'affiche la dit)
      var jour = d
        ? "Rôle du jour : " + esc(roleNom(d.role)) + (auj ? " · tu as tenu " + esc(semainesTxt(auj.s)) : "")
        : "";
      el.innerHTML =
        '<div class="fz-cov">' + fusibleSvg() + '<span class="fz-ics" aria-hidden="true">' + jaugesIcones() + "</span>" +
        '<span class="fz-num">Hors-série</span><span class="fz-neuf">' + esc(dateCourte(jourDeParis())) + '</span><span class="fz-heure">10<i>:</i>00</span></div>' +
        '<div class="fz-corps"><h2 class="fz-t" id="fzTitre">Le Fusible</h2><div class="fz-puces">' + puces + "</div>" +
        '<p class="fz-q">Un rôle et une époque tirés au sort, quatre jauges, pas de ville : rien que des cartes. Une jauge touche le bas ou le haut, et le fusible saute. Combien de semaines tiens-tu ?</p>' +
        (jour ? '<p class="fz-jour">' + jour + "</p>" : "") +
        '<div class="fz-actions">' +
        (cours ? '<button type="button" class="fz-go" data-a="reprendre">Reprendre <small>' + esc(semainesTxt(cours.semaines || 0)) + "</small></button>" : "") +
        '<button type="button" class="' + (cours ? "fz-ot" : "fz-go") + '" data-a="jour">Défi du jour</button>' +
        '<button type="button" class="fz-ot" data-a="autre">Une autre</button></div></div>';
    }
    // la partie en cours, si elle se reprend (même contenu, et la coquille sait la rouvrir)
    function coursReprenable() {
      var c = S.cours;
      if (!c || !c.etat || !window.FusibleCoquille || !window.FusibleCoquille.reprendre) return null;
      if (c.h && content && content.hash && c.h !== content.hash) return null;
      return c;
    }

    function agir(a) {
      if (a === "jour") lancer("jour");
      else if (a === "autre") lancer("libre");
      else if (a === "reprendre") reprendre();
      else if (a === "accueil") quitter();
    }

    // ─── lancer une partie ────────────────────────────────────────────────────────
    // « Une autre » : le rôle et la graine se tirent avant la touche (le livre du rôle se décompresse
    // pendant que le doigt s'appuie), puis la touche les prend.
    var LIBRE = null;
    function libre() {
      if (LIBRE) return LIBRE;
      var ps = postulatsEclair();
      if (!ps.length) return null;
      return (LIBRE = { postulat: ps[Math.floor(Math.random() * ps.length)].index, seed: Math.floor(Math.random() * 0x7fffffff) & 0x7fffffff });
    }
    function prechauffer(a) {
      var CO = window.FusibleContenu, cible = null;
      if (!CO || typeof CO.prechauffer !== "function") return;
      if (a === "jour") { var d = defi(); cible = d && d.postulat; }
      else if (a === "autre") { var l = libre(); cible = l && l.postulat; }
      else if (a === "reprendre") cible = S.cours && S.cours.postulat;
      if (cible != null) { try { CO.prechauffer(cible, 0); } catch (e) {} }
    }
    function lancer(mode) {
      var postulat, seed, date = "";
      if (mode === "jour") {
        var d = defi();
        if (!d) return;
        postulat = d.postulat; seed = d.seed; date = d.date;
      } else {
        var l = libre();
        if (!l) return;
        postulat = l.postulat; seed = l.seed;
        LIBRE = null;
      }
      var depart = E = { mode: mode, date: date, postulat: postulat, seed: seed, fini: false, attente: true };
      S.cours = null;                 // une nouvelle partie remplace celle qu'on avait laissée
      passerEnEclair();
      sansHeritage();
      try { if (typeof audio !== "undefined" && audio && audio.jingle) audio.jingle("depart"); } catch (e) {}
      // Le livre arrive d'abord s'il n'est pas là (demarrage.js) : la carrière commence un peu après l'appel.
      // Si elle ne vient pas (le réseau, un refus), l'accueil reprend son visage de livres.
      var echec = function () { if (E === depart && depart.attente) { E = null; retourHistoire(); monterAccueil(); } };
      try { API.demarrer(postulat, seed).then(function (ok) { if (ok === false) echec(); }, echec); } catch (e) { echec(); }
      setTimeout(echec, 60000);
    }
    // Le dossier « tes fantômes » pose l'héritage des carrières d'avant au départ d'un livre : le Fusible
    // n'en veut pas (la même graine doit donner la même partie à tout le monde). Appel gardé : le module
    // n'est pas toujours dans la page.
    function sansHeritage() {
      try {
        if (window.FusibleDossier && typeof window.FusibleDossier.sansHeritage === "function") window.FusibleDossier.sansHeritage();
      } catch (e) {}
    }
    function reprendre() {
      var c = coursReprenable();
      if (!c) return;
      var Q = window.FusibleCoquille, CO = window.FusibleContenu;
      E = { mode: c.mode || "libre", date: c.date || "", postulat: c.postulat, seed: c.seed, fini: false, reprise: true };
      passerEnEclair();
      var echec = function (e) {
        S.cours = null; garder(); E = null; retourHistoire();
        if (window.console) console.error("éclair : la partie ne se rouvre pas", e);
        monterAccueil();
      };
      var rouvrir = function () {
        try { Q.reprendre(c.etat, c.postulat, c.seed); } catch (e) { echec(e); }
      };
      // le livre de la partie d'abord : le moteur ne connaît que le commun avant qu'il arrive
      if (CO && typeof CO.livre === "function") {
        var p;
        try { p = CO.livre(c.postulat); } catch (e) { echec(e); return; }
        p.then(rouvrir, echec);
      } else rouvrir();
    }
    // sortir en gardant la partie : elle est déjà sauvée à chaque réponse
    function quitter() {
      fermerBrief();
      API.accueil();
    }

    // ─── l'affiche de départ ──────────────────────────────────────────────────────
    function ouvrirBrief(v) {
      fermerBrief();
      var ap = { role: v.role, genre: v.genre };
      var el = document.createElement("div");
      el.id = "fzBrief"; el.className = "fz-brief";
      el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Le Fusible : le départ");
      var premiere = S.parties < 2;
      el.innerHTML =
        '<div class="fz-brief-in">' +
        '<div class="fz-brief-k">' + (E && E.mode === "jour" ? "Graine du jour · " + esc(dateCourte(E.date)) : "Une autre partie") + "</div>" +
        '<h2 class="fz-brief-t">' + esc(majuscule(roleUn(ap.role, ap.genre))) + '<br><span>' + esc(v.year) + "</span></h2>" +
        '<div class="fz-brief-ic" aria-hidden="true">' + jaugesIcones() + "</div>" +
        '<p class="fz-brief-p">Quatre jauges. Si l\'une touche le bas ou le haut, <b>le fusible saute</b>.</p>' +
        (premiere ? '<p class="fz-brief-p">Glisse la carte à gauche ou à droite. Pendant que tu hésites, un petit trait sous une jauge dit <i>qu\'elle va bouger</i>, jamais dans quel sens ; le triangle, après coup, dit où elle est allée. Ton score : les semaines tenues.</p>' : "") +
        '<button type="button" class="fz-go" data-a="commencer">Commencer</button></div>';
      document.body.appendChild(el);
      BRIEF = el;
      el.addEventListener("click", function (e) {
        var b = e.target && e.target.closest ? e.target.closest("[data-a]") : null;
        if (b) fermerBrief();
      });
      var bt = el.querySelector("button");
      if (bt) try { bt.focus(); } catch (e) {}
    }
    function fermerBrief() {
      if (BRIEF && BRIEF.parentNode) BRIEF.parentNode.removeChild(BRIEF);
      BRIEF = null;
    }
    // tant que l'affiche est là, aucune touche n'atteint la carte dessous
    document.addEventListener("keydown", function (e) {
      if (!BRIEF) return;
      e.stopPropagation();
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") { e.preventDefault(); fermerBrief(); }
    }, true);

    // ─── pendant la partie ────────────────────────────────────────────────────────
    function sauverCours(v) {
      if (!E || v.over || typeof window.fusibleEtat !== "function") return;
      var etat = "";
      try { etat = window.fusibleEtat(); } catch (e) {}
      if (!etat) return;
      S.cours = { postulat: E.postulat, seed: E.seed, mode: E.mode, date: E.date, etat: etat, semaines: v.semaines | 0, h: (content && content.hash) || "" };
      garder();
    }
    // un bouton « Accueil » dans le menu du jeu (les parties éclair se gardent d'elles-mêmes)
    function monterMenu() {
      var menu = document.querySelector("#gameScreen .menu");
      if (!menu || document.getElementById("btnFzAccueil")) return;
      var b = document.createElement("button");
      b.type = "button"; b.id = "btnFzAccueil"; b.className = "fz-menu-btn";
      b.setAttribute("aria-label", "Accueil : la partie est gardée");
      b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3 2.5 11.2l1.3 1.5L5 11.7V20h5.2v-5.4h3.6V20H19v-8.3l1.2 1 1.3-1.5Z"/></svg>';
      b.addEventListener("click", function () { quitter(); });
      menu.insertBefore(b, menu.firstChild);
    }

    // ─── la fin ───────────────────────────────────────────────────────────────────
    function jaugeLabel(v, id) {
      var g = (v.gauges || []).filter(function (x) { return x.id === id; })[0];
      return g ? g.label : id;
    }
    function meilleurQue(a, b) {   // a vaut-il mieux que b ? (les semaines, puis les cartes)
      if ((a.semaines | 0) !== (b.semaines | 0)) return (a.semaines | 0) > (b.semaines | 0);
      return (a.cartes | 0) > (b.cartes | 0);
    }
    function rendreFin(v) {
      if (!E || E.fini) return;
      E.fini = true;
      var semaines = v.semaines | 0, cartes = v.turn | 0;
      var ancien = S.best | 0;
      var record = semaines > ancien && semaines > 0;
      S.parties++;
      if (record) { S.best = semaines; S.bestCartes = cartes; }
      if (E.mode === "jour") {
        var j = S.jours[E.date];
        if (!j || meilleurQue({ semaines: semaines, cartes: cartes }, { semaines: j.s, cartes: j.c })) {
          S.jours[E.date] = { s: semaines, c: cartes, r: v.role, f: (v.ending && v.ending.id) || "" };
        }
      }
      S.cours = null;
      garder();
      var pochette = false;
      if (record) {
        // un nouveau record offre une pochette d'album (profile.recompenses.pochettes, preview_album.js)
        try {
          var p = API.profil();
          p.recompenses = p.recompenses || {};
          p.recompenses.pochettes = (p.recompenses.pochettes | 0) + 1;
          API.sauverProfil();
          pochette = true;
        } catch (e) {}
      }

      var e = v.ending || {};
      var gauge = e.gauge || null, plein = e.side === "plein";
      // Une fin que pose une CARTE (la valise, le dauphin) déclare aussi une jauge, pour le Cimetière :
      // on ne dit « à zéro » que d'une jauge qui y est vraiment.
      if (gauge) {
        var au_bord = false;
        (v.gauges || []).forEach(function (g) {
          if (g.id === gauge && (plein ? (g.value | 0) >= 100 : (g.value | 0) <= 0)) au_bord = true;
        });
        if (!au_bord) gauge = null;
      }
      var rail = "";
      (v.gauges || []).forEach(function (g) {
        var fautif = g.id === gauge;
        rail += '<div class="fz-g' + (fautif ? " fautif" : "") + '" style="--op:' + (fautif ? 1 : (0.28 + 0.5 * Math.max(0, Math.min(100, g.value)) / 100).toFixed(2)) + '">' +
          '<span class="fz-gi">' + icon(GAUGE_ART[g.id] || g.icon || "ballon", 30) + "</span>" +
          '<span class="fz-gl">' + esc(g.label) + "</span><b>" + esc(g.value) + "</b></div>";
      });
      var cause = gauge
        ? "<b>" + esc(jaugeLabel(v, gauge)) + "</b> " + (plein ? "au plafond" : "à zéro") + ". "
        : "";
      var ap = { role: v.role, genre: v.genre };
      var el = document.getElementById("fzFin");
      if (!el) {
        el = document.createElement("section");
        el.id = "fzFin"; el.className = "fz-fin";
        var ecran = document.getElementById("endingScreen");
        if (!ecran) return;
        ecran.insertBefore(el, ecran.firstChild);
        el.addEventListener("click", function (ev) {
          var b = ev.target && ev.target.closest ? ev.target.closest("[data-a]") : null;
          if (b) agir(b.getAttribute("data-a") === "rejouer" ? "autre" : b.getAttribute("data-a"));
        });
      }
      el.innerHTML =
        '<div class="fin-verdict"><div class="stamp">Le fusible a sauté</div>' +
        '<div class="sub">' + esc(majuscule(roleUn(ap.role, ap.genre))) + " · " + esc(v.year) + " · " + esc(cartes) + " cartes</div></div>" +
        '<div class="fz-rail" role="img" aria-label="Les quatre jauges à la fin">' + rail + "</div>" +
        '<p class="fz-cause">' + cause + "<i>« " + esc(e.title || "Fin de carrière") + " »</i> " + esc(e.epitaph || "") + "</p>" +
        '<div class="fz-score"><div class="fz-n">' + nombre(String(semaines), 64) + '</div><div class="fz-l">' + (semaines > 1 ? "semaines tenues" : "semaine tenue") + "</div></div>" +
        '<ul class="fz-lignes">' +
        (record ? '<li class="fz-new">Nouveau record !' + (pochette ? " <small>+1 pochette d'album</small>" : "") + "</li>"
                : (S.best ? "<li>Record <b>" + esc(semainesTxt(S.best)) + "</b></li>" : "")) +
        (E.mode === "jour" ? '<li id="fzClass" class="fz-class">Aujourd\'hui : <b>' + esc(semainesTxt((S.jours[E.date] || {}).s | 0)) + "</b></li>" : "") +
        "</ul>" +
        '<p class="fz-devise">Un fusible, ça se change.</p>' +
        '<div class="fz-actions bas">' +
        '<button type="button" class="fz-go" data-a="rejouer">Rejouer</button>' +
        '<button type="button" class="fz-ot" data-a="jour">Graine du jour</button>' +
        '<button type="button" class="fz-ot" data-a="accueil">Accueil</button></div>';
      try { document.getElementById("endingScreen").scrollTop = 0; } catch (x) {}

      if (E.mode === "jour") {
        var info = { date: E.date, semaines: semaines, cartes: cartes, role: v.role, fin: (v.ending && v.ending.id) || "" };
        classer(info).then(function (r) { afficherClassement(info, r); }, function () {});
      }
    }
    function afficherClassement(info, r) {
      var li = document.getElementById("fzClass");
      if (!li) return;
      var moi = S.jours[info.date] || { s: info.semaines };
      var txt = "Aujourd'hui : <b>" + esc(semainesTxt(moi.s)) + "</b>";
      // le rang n'existe que si le résultat est dans la base (écrit, ou déjà aussi bon) : sans cela, la
      // base ne dirait que les autres, et la ligne reste celle du jeu seul (le meilleur score est local)
      if (r && r.rang && r.total > 0) {
        txt = "Aujourd'hui : <b>" + rangHtml(r.rang) + "</b> sur " + esc(r.total);
        if (r.rang === 1 && r.total > 1) txt += " · en tête";
        else if (r.meilleur) txt += " · le meilleur : " + esc(semainesTxt(r.meilleur));
      }
      li.innerHTML = txt;
    }

    // ─── le classement du jour (capacité `db` du support, entièrement facultatif) ───
    // UN document par joueur, `eclair/<son id>` = { date, semaines, cartes, role, fin }, écrit
    // à la fin d'un défi du jour seulement s'il fait mieux que celui du même jour ; aucun nom.
    // Le rang se lit sur les documents du jour. Pas de `db`, pas d'identifiant, une écriture
    // refusée, un délai trop long : on rend `null` (ou ce qu'on a lu) et la page n'en dit rien.
    function classer(info) {
      return new Promise(function (resolve) {
        var cl = window.claude;
        if (!cl || typeof cl.use !== "function") { resolve(null); return; }
        var fait = false;
        function fin(r) { if (!fait) { fait = true; resolve(r); } }
        setTimeout(function () { fin(null); }, 9000);
        var maLigne = { date: info.date, semaines: info.semaines, cartes: info.cartes, role: info.role, fin: info.fin };
        cl.use("db").then(function (db) {
          if (!db) return null;
          return cl.use("user").then(function (user) { return user && typeof user.id === "function" ? user.id() : null; }).then(function (id) {
            var ecrire = function () { return Promise.resolve({ id: id, moi: null }); };
            if (id) {
              var ref = db.doc("eclair/" + id);
              ecrire = function () {
                return ref.get().then(function (snap) {
                  var prev = snap && snap.exists ? snap.data() : null;
                  var memeJour = prev && prev.date === info.date;
                  var moi = memeJour && !meilleurQue(maLigne, prev) ? prev : null;     // le sien du jour est déjà aussi bon
                  if (moi) return { id: id, moi: moi };
                  return ref.set(maLigne).then(function () { return { id: id, moi: maLigne }; }, function () {
                    return { id: id, moi: memeJour ? prev : null };                     // écriture refusée : on lit quand même
                  });
                }, function () { return { id: id, moi: null }; });
              };
            }
            return ecrire().then(function (res) {
              return db.collection("eclair").where("date", "==", info.date).limit(1000).get().then(function (qs) {
                var docs = (qs && qs.docs) || [], total = docs.length, meilleur = 0, rang = 0;
                docs.forEach(function (d) { var x = d.data() || {}; if ((x.semaines | 0) > meilleur) meilleur = x.semaines | 0; });
                if (res.moi) {
                  rang = 1;
                  docs.forEach(function (d) { if (meilleurQue(d.data() || {}, res.moi)) rang++; });
                }
                return { rang: rang, total: total, meilleur: meilleur };
              });
            });
          });
        }).then(fin, function () { fin(null); });
      });
    }

    // ─── les crochets de la coquille ──────────────────────────────────────────────
    // La ville garde une case par livre (`fusible.ville.v2.<postulat>`, ville.js) : une partie éclair n'en a
    // jamais. Si un geste en retard de la ville (un minuteur qui court encore) en a pourtant écrit une pour
    // elle, elle ne doit pas devenir le « Reprendre » de l'accueil — qui la rouvrirait en ville.
    function balayerCases() {
      try {
        var ks = [];
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k && /^fusible\.ville\.v2\.eclair_/.test(k)) ks.push(k);
        }
        ks.forEach(function (k) { localStorage.removeItem(k); });
      } catch (e) {}
    }
    balayerCases();
    crochet("accueil", function () {
      retourHistoire();
      fermerBrief();
      balayerCases();
      try { monterAccueil(); } catch (e) { if (window.console) console.error("éclair : accueil", e); }
    });
    crochet("debut", function (v) {
      if (!v || v.mode !== "eclair") { retourHistoire(); return; }
      if (!E) E = { mode: "libre", date: "", postulat: API.graine().postulat, seed: API.graine().seed, fini: false };
      E.attente = false;
      passerEnEclair();
      monterMenu();
      // la partie n'est pas une « carrière » du livre : le compteur de l'accueil n'en sait rien
      var p = API.profil();
      p.runs = Math.max(0, (p.runs | 0) - 1);
      try { runCount = p.runs; } catch (e) {}
      API.sauverProfil();
      ouvrirBrief(v);
      sauverCours(v);
    });
    crochet("reprise", function (v) {
      if (!v || v.mode !== "eclair") { retourHistoire(); return; }
      if (!E) E = { mode: "libre", date: "", postulat: API.graine().postulat, seed: API.graine().seed, fini: false };
      E.attente = false;
      passerEnEclair();
      monterMenu();
    });
    crochet("carte", function (v) {
      if (!v || v.mode !== "eclair") return;
      var po = document.getElementById("bPoste");
      if (po) po.textContent = tenuesTxt(v.semaines | 0);
    });
    crochet("reponse", function (r) {
      var v = r && r.apres;
      if (!v || v.mode !== "eclair" || !E) return;
      if (v.over) {
        // le Cimetière des livres ne compte pas les fins du Fusible : on retient s'il connaissait déjà celle-ci
        var id = v.ending && v.ending.id, f = (API.profil() || {}).endings || {};
        E.connue = !!(id && f[id]);
        S.cours = null; garder();
      } else sauverCours(v);
    });
    crochet("fin", function (v) {
      if (!v || v.mode !== "eclair") return;
      if (!E) E = { mode: "libre", date: "", postulat: API.graine().postulat, seed: API.graine().seed, fini: false };
      if (!document.body.classList.contains("mode-eclair")) passerEnEclair();
      // filet : si la coquille a noté cette fin au Cimetière malgré tout, on la retire
      try {
        var id = v.ending && v.ending.id, p = API.profil();
        if (E && id && !E.connue && p.endings && p.endings[id]) { delete p.endings[id]; API.sauverProfil(); }
      } catch (e) {}
      rendreFin(v);
    });

    // ─── la feuille de style du mode (rien dans les fichiers partagés) ────────────
    var CSS = [
      "/* ═══ LE FUSIBLE — le mode éclair (preview_eclair.js) ═══ */",
      /* l'accueil : une cartouche, comme celles des livres, framboise */
      ".fz-carte{--acc:#E0164B;margin:20px 5px 2px 0;position:relative;background:var(--a-fond2,#1C1630);color:var(--a-texte,#F6E9CF);box-shadow:0 0 0 3px var(--acc),6px 6px 0 3px var(--a-ombre,#06040B)}",
      ".fz-cov{position:relative;aspect-ratio:16/6.6;overflow:hidden;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 16px 10px;background:linear-gradient(180deg,#2C0F26,#4B1233 62%,#1D0A19)}",
      ".fz-cov::before{content:'';position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(255,255,255,.035) 0 2px,transparent 2px 6px)}",
      ".fz-fusible{display:block;width:50%;max-width:200px;height:auto;filter:drop-shadow(0 0 14px rgba(255,120,50,.5));animation:fzLueur 1.6s steps(4) infinite alternate}",
      "@keyframes fzLueur{from{filter:drop-shadow(0 0 8px rgba(255,120,50,.35))}to{filter:drop-shadow(0 0 18px rgba(255,170,60,.75))}}",
      ".fz-ics{display:flex;gap:8px;position:relative;z-index:1}",
      ".fz-ic{display:grid;place-items:center;width:36px;height:36px;background:rgba(6,4,11,.55);color:#F6E9CF;box-shadow:0 0 0 2px rgba(246,233,207,.18)}",
      ".fz-ic svg{display:block;width:22px;height:22px}",
      ".fz-ic.bord{color:var(--acc);box-shadow:0 0 0 2px var(--acc);animation:fzClign 1.1s steps(1) infinite}",
      "@keyframes fzClign{50%{opacity:.45}}",
      ".fz-num,.fz-neuf,.fz-heure{position:absolute;z-index:2;font-family:var(--pix,monospace);line-height:1}",
      ".fz-num{left:0;top:0;background:var(--acc);color:#0B0814;font-size:13px;font-weight:700;letter-spacing:.06em;padding:5px 8px 4px;text-transform:uppercase}",
      ".fz-neuf{right:0;top:0;background:var(--a-or,#FFC94D);color:#0B0814;font-family:inherit;font-size:12px;font-weight:700;letter-spacing:.04em;padding:5px 8px 4px;text-transform:uppercase}",
      ".fz-heure{right:9px;bottom:9px;background:rgba(6,4,11,.82);color:var(--acc);font-size:15px;letter-spacing:.08em;padding:4px 7px 3px;box-shadow:0 0 0 2px rgba(6,4,11,.82)}",
      ".fz-heure i{font-style:normal;animation:fzClign 1s steps(1) infinite}",
      ".fz-corps{display:block;padding:13px 14px 15px}",
      ".fz-t{margin:0;font-family:var(--pix,monospace);font-size:24px;font-weight:600;line-height:1.15;color:var(--a-texte,#F6E9CF)}",
      ".fz-puces{display:flex;flex-wrap:wrap;gap:8px 9px;margin-top:9px}",
      ".fz-puce{display:inline-flex;align-items:center;font-family:var(--pix,monospace);font-size:13px;line-height:1;letter-spacing:.05em;text-transform:uppercase;padding:4px 7px 3px;background:#0F0C18;color:var(--a-texte2,#CBC1E2);box-shadow:0 0 0 2px var(--a-ligne,#352B52)}",
      ".fz-puce.or{color:var(--a-or,#FFC94D);box-shadow:0 0 0 2px var(--a-or,#FFC94D)}",
      ".fz-q{margin:10px 0 0;font-size:13px;font-style:italic;color:var(--a-texte2,#CBC1E2);line-height:1.5}",
      ".fz-jour{margin:10px 0 0;font-family:var(--pix,monospace);font-size:14px;letter-spacing:.05em;text-transform:uppercase;color:var(--a-texte,#F6E9CF)}",
      ".fz-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:13px}",
      ".fz-go,.fz-ot{flex:1 1 130px;min-height:46px;padding:0 12px;font-family:var(--pix,monospace);font-size:15px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;display:flex;align-items:center;justify-content:center;gap:8px;text-align:center}",
      ".fz-go{background:var(--acc,#E0164B);color:#0B0814;box-shadow:3px 3px 0 0 var(--a-ombre,#06040B)}",
      ".fz-go small{font-size:12px;font-weight:400;letter-spacing:.05em}",
      ".fz-ot{background:transparent;color:var(--a-texte,#F6E9CF);box-shadow:0 0 0 2px var(--a-ligne,#352B52)}",
      ".fz-go:hover,.fz-go:focus-visible{outline:0;transform:translate(-1px,-1px);box-shadow:4px 4px 0 0 var(--a-ombre,#06040B)}",
      ".fz-ot:hover,.fz-ot:focus-visible{outline:0;box-shadow:0 0 0 2px var(--a-or,#FFC94D);color:var(--a-or,#FFC94D)}",
      /* l'affiche de départ */
      ".fz-brief{position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;padding:24px;background:var(--fond,#100905);overflow-y:auto}",
      ".fz-brief-in{width:min(100%,360px);text-align:center;display:flex;flex-direction:column;align-items:center;gap:14px}",
      ".fz-brief-k{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:var(--framboise,#E0164B)}",
      ".fz-brief-t{margin:0;font-size:30px;line-height:1.1;font-weight:700;letter-spacing:.04em;color:var(--creme,#F2E8CE)}",
      ".fz-brief-t span{font-size:46px;letter-spacing:.08em;color:var(--creme,#F2E8CE)}",
      ".fz-brief-ic{display:flex;gap:12px;color:var(--creme,#F2E8CE)}",
      ".fz-brief-ic .fz-ic{background:rgba(255,255,255,.05)}",
      ".fz-brief-p{margin:0;font-size:13.5px;line-height:1.55;color:var(--creme2,#C4B491)}",
      ".fz-brief-p b{color:var(--creme,#F2E8CE)}",
      ".fz-brief .fz-go{width:100%;flex:0 0 auto;margin-top:6px;font-family:inherit;letter-spacing:.14em}",
      /* en partie : le rail se montre, le bouton Accueil, la frise s'efface */
      /* pas de ville : ni son état, ni sa barre d'actions, ni son zoom (elle reste montée, sans servir) */
      "body.mode-eclair #gameScreen > .v-hud,body.mode-eclair #gameScreen > .v-bas,body.mode-eclair #gameScreen > .v-actions,body.mode-eclair #gameScreen > .v-espace,body.mode-eclair #gameScreen .menu button.v-z{display:none!important}",
      ".fz-menu-btn{display:none!important}",
      "body.mode-eclair .fz-menu-btn{display:grid!important}",
      "body.mode-eclair #btnFriseGame{display:none}",
      /* la fin : à la place de la une des livres */
      "body.mode-eclair #endingScreen > :not(#fzFin){display:none!important}",
      ".fz-fin{display:flex;flex-direction:column}",
      ".fz-fin .stamp{font-size:clamp(20px,6.4vw,28px);letter-spacing:.1em;white-space:nowrap}",
      ".fz-rail{display:flex;justify-content:space-between;gap:6px;margin:18px 0 0}",
      ".fz-g{flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:center;gap:3px;opacity:var(--op,.5);color:var(--creme,#F2E8CE)}",
      ".fz-g.fautif{color:var(--framboise,#E0164B)}",
      ".fz-gi svg{display:block;width:30px;height:30px}",
      ".fz-gl{font-size:10px;letter-spacing:.06em;text-transform:uppercase;text-align:center;line-height:1.2;max-width:100%;overflow-wrap:anywhere;min-height:2.4em}",
      ".fz-g b{font-size:13px;font-weight:700;letter-spacing:.06em}",
      ".fz-cause{margin:14px 0 0;font-size:12.5px;line-height:1.5;color:var(--creme2,#C4B491)}",
      ".fz-cause b{color:var(--framboise,#E0164B)}",
      ".fz-cause i{color:var(--creme,#F2E8CE)}",
      ".fz-score{display:flex;flex-direction:column;align-items:center;margin:18px 0 0}",
      ".fz-n svg{display:block;height:64px;width:auto;color:var(--creme,#F2E8CE)}",
      ".fz-l{margin-top:6px;font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:var(--creme2,#C4B491)}",
      ".fz-lignes{list-style:none;margin:14px 0 0;padding:0;text-align:center;font-size:12.5px;letter-spacing:.06em;color:var(--creme2,#C4B491)}",
      ".fz-lignes li{padding:3px 0}",
      ".fz-lignes b{color:var(--creme,#F2E8CE)}",
      ".fz-lignes sup{font-size:.7em}",
      ".fz-lignes .fz-new{color:var(--framboise,#E0164B);font-weight:700;letter-spacing:.14em;text-transform:uppercase}",
      ".fz-lignes .fz-new small{display:block;font-size:11px;font-weight:400;letter-spacing:.06em;text-transform:none;color:var(--creme2,#C4B491);margin-top:2px}",
      ".fz-devise{margin:16px 0 0;text-align:center;font-style:italic;font-size:15px;color:var(--creme,#F2E8CE)}",
      ".fz-fin .fz-actions{margin-top:18px}",
      ".fz-fin .fz-go,.fz-fin .fz-ot{font-family:inherit;font-size:12.5px;letter-spacing:.11em;flex:1 1 100px}",
      ".fz-fin .fz-go{color:var(--creme,#F2E8CE);box-shadow:none}",
      ".fz-fin .fz-ot{color:var(--creme,#F2E8CE);box-shadow:inset 0 0 0 1px var(--fond3,#2E1D0C)}",
      ".fz-fin .fz-ot:hover,.fz-fin .fz-ot:focus-visible{color:var(--framboise,#E0164B);box-shadow:inset 0 0 0 1px var(--framboise,#E0164B)}",
      "@media (prefers-reduced-motion:reduce){.fz-fusible,.fz-ic.bord,.fz-heure i{animation:none}}"
    ].join("\n");
    var st = document.createElement("style");
    st.id = "eclairCss";
    st.textContent = CSS;
    document.head.appendChild(st);

    // ─── pour les essais et la coquille ───────────────────────────────────────────
    window.FusibleEclair = {
      etat: function () { return S; },
      partie: function () { return E; },
      lancer: lancer,
      reprendre: reprendre,
      jour: jourDeParis,
      defi: defi,
      defiDe: defiDe,
      classer: classer,
      // essais seulement : une autre date, pour voir un autre défi
      _jour: function (d) { TEST.jour = d || null; monterAccueil(); },
      _vider: function () { S = vide(); garder(); }
    };
  })();
