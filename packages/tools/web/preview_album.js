  // ═══════════════════════════════════════════════════════════════════════════
  // L'ALBUM D'AUBÉRIVE — preview_album.js, inséré par assemble.js dans la fermeture du
  // gabarit (PREVIEW_MODULES, au repère `__PREVIEW_MODULES__`). Les pochettes de vignettes du
  // tabac-presse deviennent un album qui se garde d'une carrière à l'autre : le catalogue
  // (content/ville/album.yaml → `ville.album`), ce qu'on possède (localStorage
  // `fusible.album.v1`, jamais dans la partie sauvée), le tirage d'une pochette, son ouverture,
  // l'album qu'on feuillette, l'échange, les Unes (le visage de celui qui fait la Une).
  //
  // La ville (ville_album.js) ne tient que ce qui est de la ville : le prix, l'argent, le temps, le
  // lien d'un échange. Elle parle à ce module par `window.FusibleAlbum` ; ce module lui répond
  // par `document` (l'événement `fusible:album`) et par des fonctions rappelées (`fin`).
  //
  // Le déterminisme : aucune vignette ne vient de `Math.random`. Une pochette se tire de la
  // graine de la carrière et du compteur de pochettes ouvertes (`etat.n`) ; le stock de qui
  // échange, de la graine, de la personne et de la semaine. Le même état rejoue la même pochette.
  //
  // Le tout est dans une fonction : les noms d'ici ne rencontrent jamais ceux de la fermeture.
  // ═══════════════════════════════════════════════════════════════════════════
  (function () {
    var DATA = (content && content.ville && content.ville.album) || (content && content.album) || null;
    if (!DATA || !DATA.pages || !DATA.pages.length) return;
    var CLE = "fusible.album.v1", MAXN = 99;
    var CAT = null;               // le catalogue : pages, vignettes, tirages
    var etat = null;              // ce qu'on possède (le contenu du localStorage)
    var VISAGES = {};             // id de vignette → SVG du visage (rendu une fois)
    var UIDM = 0;                 // les ids des clipPath des maillots
    var OV = null;                // la pochette qui s'ouvre
    var EC = null;                // l'échange en cours
    var QUARTIER = { tilleuls: "Les Tilleuls", port: "Le port", hauts: "Les Hauts", campagne: "La campagne" };

    // ─── les aides
    function entier(v, a, b) { v = Math.floor(+v); return isFinite(v) ? Math.max(a, Math.min(b, v)) : a; }
    function coupe(s, n) { return String(s == null ? "" : s).slice(0, n); }
    function fnv(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
    // un générateur à graine (mulberry32) : ni Math.random, ni horloge
    function rng(graine) {
      var a = graine >>> 0;
      return function () {
        a = (a + 0x6D2B79F5) >>> 0;
        var t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }
    function esc(s) { return escapeHtml(s); }
    function num(n) { return n < 10 ? "00" + n : n < 100 ? "0" + n : String(n); }
    function pluriel(n, un, plus) { return n + " " + (n > 1 ? plus : un); }
    function jouer(nom) { try { if (audio && audio.play && sonMode !== "muet") audio.play(nom); } catch (e) {} }
    function emettre(type, id) {
      try { document.dispatchEvent(new CustomEvent("fusible:album", { detail: { type: type, id: id } })); } catch (e) {}
    }
    function luminance(hex) {
      var m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || "");
      if (!m) return 0;
      return (0.2126 * parseInt(m[1], 16) + 0.7152 * parseInt(m[2], 16) + 0.0722 * parseInt(m[3], 16)) / 255;
    }
    function contraste(hex) { return luminance(hex) > 0.55 ? "#1B1109" : "#FFFFFF"; }
    function carriereActive() { return !!view && !!elTitle && elTitle.hidden; }
    function histoireActuelle() {
      if (!carriereActive()) return "";
      var p = postulats.filter(function (x) { return x.index === currentPostulat; })[0];
      return p ? p.id : "";
    }
    function titreHistoire(id) {
      var p = postulats.filter(function (x) { return x.id === id; })[0];
      return p ? p.title : id;
    }

    // ─── le catalogue : les pages et leurs vignettes, tirés du contenu
    function construire() {
      var par = {}, ordre = [], pages = [], communes = [], brillantes = [], unes = {};
      DATA.pages.forEach(function (p, ip) {
        var pg = { id: p.id, i: ip, section: p.section, titre: p.titre, sous: p.sous, fond: p.fond, bande: p.bande, texte: contraste(p.bande),
          recompense: p.recompense || null, livres: p.livres || null, rarete: p.rarete || "commune", ids: [] };
        (p.vignettes || []).forEach(function (v) {
          var s = { id: v.id, n: v.n, k: v.k, page: p.id, pg: pg, annee: v.annee, epoque: v.epoque || null, rarete: v.rarete || pg.rarete,
            hors: !!v.hors_pochette, echangeable: v.echangeable !== false, dos: v.dos || "", secret: !!v.secret,
            portrait: v.portrait || null, maillot: v.maillot || null, histoire: v.histoire || null, livres: v.livres || null, nom: v.nom, label: v.label || "" };
          if (v.k === "p") {
            var ch = CHARS[v.id] || {};
            s.nom = ch.name || v.id; s.label = ch.label || ""; s.genre = ch.genre || "m"; s.camp = ch.camp || "terrain";
            var gens = ((content.ville && content.ville.gens) || []).filter(function (g) { return g.id === v.id; })[0];
            var l = String(s.label || "").toLowerCase();
            s.dos = (l ? l.charAt(0).toUpperCase() + l.slice(1) + ". " : "") +
              (s.epoque ? "À Aubérive de " + s.epoque[0] + " à " + s.epoque[1] + (gens ? "." : ".") : "Dans l'histoire dès " + s.annee + ".");
          }
          par[s.id] = s; ordre.push(s.id); pg.ids.push(s.id);
          if (!s.hors) (s.rarete === "brillante" ? brillantes : communes).push(s.id);
          if (s.k === "u") unes[s.histoire] = s.id;
        });
        pages.push(pg);
      });
      CAT = { pages: pages, par: par, ordre: ordre, communes: communes, brillantes: brillantes, unes: unes, total: ordre.length };
      return CAT;
    }
    function pageDe(id) { return CAT.pages.filter(function (p) { return p.id === id; })[0] || null; }

    // ─── ce qu'on possède : localStorage, borné, jamais bloquant
    function vide() { return { v: 1, n: 0, s: {}, o: 0, p: {}, d: [], u: {}, q: {}, e: 0, vu: {} }; }
    function charger() {
      var o = vide(), r = null;
      try { r = JSON.parse(localStorage.getItem(CLE)); } catch (e) { r = null; }
      if (r && typeof r === "object") {
        o.n = entier(r.n, 0, 1000000); o.o = entier(r.o, 0, MAXN); o.e = entier(r.e, 0, 1000000);
        if (r.s && typeof r.s === "object") Object.keys(r.s).forEach(function (id) { var n = entier(r.s[id], 0, MAXN); if (CAT.par[id] && n > 0) o.s[id] = n; });
        if (r.vu && typeof r.vu === "object") Object.keys(r.vu).forEach(function (id) { if (CAT.par[id] && o.s[id]) o.vu[id] = 1; });
        if (r.p && typeof r.p === "object") Object.keys(r.p).forEach(function (id) { if (pageDe(id)) o.p[id] = 1; });
        if (Array.isArray(r.d)) r.d.slice(0, 40).forEach(function (id) { if (pageDe(id) && o.d.indexOf(id) < 0) o.d.push(id); });
        if (r.q && typeof r.q === "object") Object.keys(r.q).forEach(function (c) { if (QUARTIER[c]) o.q[c] = 1; });
        if (r.u && typeof r.u === "object") Object.keys(r.u).forEach(function (h) {
          var u = r.u[h];
          if (!CAT.unes[h] || !u || typeof u !== "object") return;
          o.u[h] = { t: coupe(u.t, 90), j: coupe(u.j, 40), a: entier(u.a, 1990, 2050), d: coupe(u.d, 24), g: u.g === "f" ? "f" : "m", r: u.r === "joueur" ? "joueur" : "coach", nom: coupe(u.nom, 32), seed: coupe(u.seed, 16) };
          if (!o.s[CAT.unes[h]]) o.s[CAT.unes[h]] = 1;
        });
      }
      return o;
    }
    function sauver() { try { localStorage.setItem(CLE, JSON.stringify(etat)); } catch (e) {} }

    function possedees() { var n = 0; CAT.ordre.forEach(function (id) { if (etat.s[id]) n++; }); return n; }
    function nbDoubles() { var n = 0; CAT.ordre.forEach(function (id) { if ((etat.s[id] | 0) > 1) n += etat.s[id] - 1; }); return n; }
    function progression(page) {
      var ids = page ? pageDe(page).ids : CAT.ordre, have = 0;
      ids.forEach(function (id) { if (etat.s[id]) have++; });
      return { have: have, total: ids.length };
    }
    function pageFinie(pg) { return pg.ids.every(function (id) { return !!etat.s[id]; }); }

    // ─── les pochettes offertes : celles du profil (les jalons du Cimetière) puis celles de l'album
    function pochettesProfil() { return (profile && profile.recompenses) ? Math.max(0, profile.recompenses.pochettes | 0) : 0; }
    function libres() { return (etat.o | 0) + pochettesProfil(); }
    function prendreLibre() {
      if (pochettesProfil() > 0) { profile.recompenses.pochettes = (profile.recompenses.pochettes | 0) - 1; saveProfile(profile); return true; }
      if (etat.o > 0) { etat.o--; sauver(); return true; }
      return false;
    }
    function offrir(n) { etat.o = Math.min(MAXN, (etat.o | 0) + (n | 0)); sauver(); majEntree(); }

    // ─── ajouter des vignettes : le compte, les pages finies, les événements
    // Rend ce qui a changé : combien de nouvelles, de doubles, de brillantes, et les pages qui viennent d'être finies.
    function ajouter(ids) {
      var res = { ids: ids.slice(), nouvelles: 0, doubles: 0, brillantes: 0, pages: [], nouveaux: [] };
      ids.forEach(function (id) {
        var s = CAT.par[id];
        if (!s) return;
        if (etat.s[id]) res.doubles++; else { res.nouvelles++; res.nouveaux.push(id); }
        if (s.rarete === "brillante") res.brillantes++;
        etat.s[id] = Math.min(MAXN, (etat.s[id] | 0) + 1);
      });
      CAT.pages.forEach(function (pg) {
        if (etat.p[pg.id] || !pageFinie(pg)) return;
        etat.p[pg.id] = 1;
        res.pages.push(pg.id);
        var r = pg.recompense;
        if (r) {
          if (r.pochettes) etat.o = Math.min(MAXN, (etat.o | 0) + r.pochettes);
          if (r.quartier) etat.q[r.quartier] = 1;
          // ce que le moteur applique (l'argent, le drapeau) : la ville le réclame quand elle est là
          if (r.mission && etat.d.indexOf(pg.id) < 0 && etat.d.length < 40) etat.d.push(pg.id);
        }
      });
      sauver();
      // les événements : pour ceux qui écoutent (le dossier 1974, la ville)
      ids.forEach(function (id) { var s = CAT.par[id]; if (s && s.rarete === "brillante") emettre("brillante", id); });
      res.pages.forEach(function (id) { emettre("page", id); });
      majEntree();
      return res;
    }

    // ─── le tirage d'une pochette : graine de la carrière + compteur, jamais Math.random
    function contexte(o) {
      o = o || {};
      var active = carriereActive();
      return {
        graine: o.graine != null ? o.graine : (active ? currentSeed : 0),
        annee: o.annee || (active && view && view.year) || 1990,
        histoire: o.histoire != null ? o.histoire : histoireActuelle()
      };
    }
    function poidsDe(s, ctx) {
      var p = 1;
      if (s.epoque && ctx.annee >= s.epoque[0] && ctx.annee <= s.epoque[1]) p *= (DATA.pochette.epoque || 2.5);
      if (s.pg.livres && ctx.histoire && s.pg.livres[ctx.histoire]) p *= s.pg.livres[ctx.histoire];
      if (s.livres && ctx.histoire && s.livres[ctx.histoire]) p *= s.livres[ctx.histoire];
      return p;
    }
    function tirer(r, ids, poids) {
      var tot = 0, i, w = [];
      for (i = 0; i < ids.length; i++) { w.push(poids(ids[i])); tot += w[i]; }
      var x = r() * tot;
      for (i = 0; i < ids.length; i++) { x -= w[i]; if (x < 0) return ids[i]; }
      return ids[ids.length - 1];
    }
    // les vignettes d'une pochette : une brillante une fois sur `brillante_sur`, les autres d'abord parmi
    // celles qui te manquent (`neuves`), le reste au hasard dans tout l'album — c'est là que naissent les doubles
    function composer(ctx, compte) {
      var P = DATA.pochette, r = rng(fnv(ctx.graine + "|pochette|" + etat.n));
      var cnt = {};
      Object.keys(compte || etat.s).forEach(function (id) { cnt[id] = (compte || etat.s)[id]; });
      var n = P.vignettes, out = [];
      var avec = r() < 1 / P.brillante_sur, pos = Math.floor(r() * n);
      if (!avec) pos = -1;
      for (var i = 0; i < n; i++) {
        var pool = i === pos ? CAT.brillantes : CAT.communes;
        var u = r(), manque = pool.filter(function (id) { return !cnt[id]; });
        var from = (manque.length && u < P.neuves) ? manque : pool;
        var id = tirer(r, from, function (x) { return poidsDe(CAT.par[x], ctx); });
        out.push(id); cnt[id] = (cnt[id] | 0) + 1;
      }
      return out;
    }

    // ─── les visages : ceux des cartes (art.js), un maillot dessiné, ou la figure de celui qui fait la Une
    var COUL = { bleu: "cobalt" };
    function fiche(s) {
      var F = ART && ART.fiches ? ART.fiches() : null, p = s.portrait;
      if (!F || !p || F[s.id]) return;
      function t(v, d) { return v ? (COUL[v] || v) : d; }
      var f = { nom: s.nom || "?", g: "m", camp: "terrain", lieu: "vestiaire", te: p.teint || "clair", co: p.corpulence || "moyen", ch: p.coiffure || "court",
        cv: p.cheveux || "brun", po: p.pilosite || "rase", lu: p.lunettes || "aucune", tn: p.tenue || "maillot", c1: t(p.couleur, "bordeaux"),
        c2: t(p.couleur2, "creme"), ac: p.accessoire || "aucun", yx: (fnv("yeux|" + s.id) & 1) ? "hex" : "fente", portrait: true, tr: p.age || "mur" };
      if (p.couleur_accessoire) f.cc = t(p.couleur_accessoire);
      if (p.coiffe) f.ck = p.coiffe;
      F[s.id] = f;
    }
    // un maillot de 120 × 130 : le torse, le motif, le col, les manches, l'écusson, le sponsor
    function maillotSvg(m, annee) {
      var id = "alm" + (++UIDM), c1 = m.c1, c2 = m.c2;
      var torse = "M36 24C42 31 78 31 84 24L92 30V104H28V30Z";
      var cm = m.manches === "longues" ? ["M28 30L14 34L2 92L16 96L28 56Z", "M92 30L106 34L118 92L104 96L92 56Z"] : ["M28 30L14 34L4 56L20 62L28 50Z", "M92 30L106 34L116 56L100 62L92 50Z"];
      var motif = "", i;
      if (m.motif === "rayures") for (i = 28; i < 92; i += 12) motif += '<rect x="' + i + '" y="20" width="6" height="90" fill="' + c2 + '"/>';
      else if (m.motif === "cerceaux") for (i = 36; i < 104; i += 14) motif += '<rect x="0" y="' + i + '" width="120" height="7" fill="' + c2 + '"/>';
      else if (m.motif === "bande") motif = '<rect x="50" y="20" width="20" height="90" fill="' + c2 + '"/>';
      else if (m.motif === "chevrons") for (i = 40; i < 104; i += 16) motif += '<path d="M28 ' + i + 'L60 ' + (i + 16) + 'L92 ' + i + 'V' + (i + 7) + 'L60 ' + (i + 23) + 'L28 ' + (i + 7) + 'Z" fill="' + c2 + '"/>';
      else if (m.motif === "damier") for (i = 0; i < 9; i++) for (var j = 0; j < 8; j++) if ((i + j) % 2) motif += '<rect x="' + (28 + j * 8) + '" y="' + (24 + i * 9) + '" width="8" height="9" fill="' + c2 + '"/>';
      var col = "";
      if (m.col === "ronde") col = '<path d="M43 25C50 35 70 35 77 25" fill="none" stroke="' + c2 + '" stroke-width="5"/>';
      else if (m.col === "v") col = '<path d="M45 24L60 44L75 24" fill="none" stroke="' + c2 + '" stroke-width="5" stroke-linejoin="round"/>';
      else if (m.col === "polo") col = '<path d="M43 24L60 38L52 46L38 30ZM77 24L60 38L68 46L82 30Z" fill="' + c2 + '"/><path d="M60 38V56" stroke="' + c2 + '" stroke-width="2"/>';
      var sponsor = annee >= 2000 ? '<rect x="44" y="62" width="32" height="10" rx="1" fill="' + c2 + '" opacity=".55"/>' : "";
      var short = '<path d="M32 106H88L94 124H64L60 114L56 124H26Z" fill="' + c2 + '" stroke="' + c1 + '" stroke-width="1.5" opacity=".95"/>';
      return '<svg viewBox="0 0 120 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' +
        '<defs><linearGradient id="' + id + 'g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6EEDC"/><stop offset="1" stop-color="#D3C39C"/></linearGradient>' +
        '<clipPath id="' + id + 'c"><path d="' + torse + '"/>' + cm.map(function (d) { return '<path d="' + d + '"/>'; }).join("") + '</clipPath></defs>' +
        '<rect width="120" height="130" fill="url(#' + id + 'g)"/>' +
        '<ellipse cx="60" cy="124" rx="40" ry="4" fill="#000" opacity=".16"/>' + short +
        '<g clip-path="url(#' + id + 'c)"><rect x="0" y="16" width="120" height="96" fill="' + c1 + '"/>' + motif + sponsor + '</g>' +
        cm.map(function (d) { return '<path d="' + d + '" fill="none" stroke="' + c2 + '" stroke-opacity=".5" stroke-width="1"/>'; }).join("") +
        col + '<path d="M66 41H78V51C78 56 72 59 72 59C72 59 66 56 66 51Z" fill="' + c2 + '" stroke="' + c1 + '" stroke-width="1.2"/></svg>';
    }
    function visage(s) {
      var u = s.k === "u" ? etat.u[s.histoire] : null, cle = s.id + (u ? "|" + u.seed : "");
      if (VISAGES[cle] != null) return VISAGES[cle];
      var svg = "";
      try {
        if (s.k === "e") svg = maillotSvg(s.maillot, s.annee);
        else if (ART && ART.scene) {
          if (s.k === "p") svg = ART.scene({ speaker: s.id, expression: "neutre", camp: s.camp, genre: s.genre, kind: "scene", tone: "", cadrage: "serre", saison: 0, annee: s.annee, club: "", seed: "album|" + s.id });
          else if (s.k === "l") { fiche(s); svg = ART.scene({ speaker: s.id, expression: "neutre", camp: "terrain", genre: "m", kind: "scene", tone: "", cadrage: "serre", saison: 0, annee: s.annee, club: "", seed: "album|" + s.id }); }
          else if (s.k === "u" && u) svg = ART.scene({ speaker: u.r === "joueur" ? "joueur" : "coach", expression: "neutre", camp: "terrain", genre: u.g, kind: "une", tone: "", saison: 1, annee: u.a, club: "", seed: "album|une|" + u.seed + "|" + s.histoire });
        }
      } catch (e) { svg = ""; }
      return (VISAGES[cle] = svg);
    }
    var SIL = '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="38" r="17"/><path d="M14 98c0-24 16-36 36-36s36 12 36 36Z"/></svg>';

    // ─── une vignette : bordure blanche, numéro, photo, bande aux couleurs de la page, nom, étiquette, année
    function anneeTexte(s) {
      if (s.k === "u") { var u = etat.u[s.histoire]; return u ? String(u.a) : String(s.annee); }
      return s.epoque && s.epoque[1] > s.epoque[0] ? s.epoque[0] + "–" + s.epoque[1] : String(s.annee);
    }
    function affiche(s) {
      if (s.k === "u") {
        var u = etat.u[s.histoire] || {};
        return { nom: u.nom || "Toi", label: u.t || "LA UNE", dos: u.j ? (u.j + (u.d ? " · " + u.d : "") + ". Le jour où le journal a titré sur ta saison.") : "" };
      }
      return { nom: s.nom, label: s.label, dos: s.dos };
    }
    function styleDe(s) { return "--f:" + s.pg.fond + ";--b:" + s.pg.bande + ";--t:" + s.pg.texte; }
    // o : { n (le compte, pour le ×2), force (montrer même si on ne l'a pas), nouveau, cls }
    function vignetteHtml(s, o) {
      o = o || {};
      var n = o.n != null ? o.n : (etat.s[s.id] | 0);
      var cls = "alb-vg" + (s.rarete === "brillante" ? " alb-br" : "") + (o.cls ? " " + o.cls : "");
      if (!n && !o.force) {
        return '<span class="' + cls + ' alb-vide" style="' + styleDe(s) + '"><span class="alb-n">' + num(s.n) + '</span><span class="alb-sil">' + SIL + '</span></span>';
      }
      var a = affiche(s), svg = visage(s);
      var nom = s.secret ? '<b class="alb-nom alb-bave" aria-label="nom illisible">█████ ████</b>' : '<b class="alb-nom">' + esc(a.nom) + '</b>';
      var photo = svg ? svg : '<span class="alb-init">' + esc(String(a.nom || "?").charAt(0)) + '</span>';
      return '<span class="' + cls + '" style="' + styleDe(s) + '">' +
        '<span class="alb-n">' + num(s.n) + '</span><span class="alb-an">' + esc(anneeTexte(s)) + '</span>' +
        '<span class="alb-ph">' + photo + '</span>' +
        '<span class="alb-bd">' + nom + '<i class="alb-lab">' + esc(a.label) + '</i></span>' +
        (n > 1 ? '<span class="alb-x">×' + n + '</span>' : "") +
        (o.nouveau ? '<span class="alb-neuf">NEUF</span>' : "") +
        (s.rarete === "brillante" ? '<span class="alb-foil" aria-hidden="true"></span>' : "") + '</span>';
    }
    function vignetteDos(s) {
      var a = affiche(s);
      return '<span class="alb-vg alb-dos' + (s.rarete === "brillante" ? " alb-br" : "") + '" style="' + styleDe(s) + '">' +
        '<span class="alb-dos-n">N° ' + num(s.n) + '</span>' +
        '<span class="alb-dos-t' + (s.secret ? ' alb-bave' : '') + '">' + (s.secret ? "█████ ████" : esc(a.nom)) + '</span>' +
        '<span class="alb-dos-l">' + esc(a.label) + '</span>' +
        '<span class="alb-dos-p">' + esc(a.dos) + '</span>' +
        '<span class="alb-dos-b">' + esc(s.pg.titre) + ' · ' + esc(anneeTexte(s)) + '</span></span>';
    }

    // ═══ l'annonce : un mot en bas de l'écran (la Une collée, une pochette offerte) ═══
    var annonceT = 0;
    function annonce(texte) {
      var el = document.getElementById("albAnnonce");
      if (!el) {
        el = document.createElement("div"); el.id = "albAnnonce"; el.className = "alb-annonce"; el.setAttribute("role", "status");
        document.body.appendChild(el);
      }
      el.textContent = texte;
      el.classList.add("on");
      clearTimeout(annonceT);
      annonceT = setTimeout(function () { el.classList.remove("on"); }, 4200);
    }

    // ═══ L'OUVERTURE D'UNE POCHETTE ═════════════════════════════════════════════
    // Scellée, déchirée, quatre vignettes retournées une à une (un éclat pour une brillante),
    // le récapitulatif. Rien n'entre dans l'album avant la fin : une pochette laissée ou une page
    // rechargée en route ne coûte rien et ne donne rien — et comme le tirage est une graine, la
    // pochette qui revient est la même.
    function ovHtml() {
      var o = OV.o, n = OV.ids.length, k = OV.k, h = "";
      if (OV.etape === "scellee") {
        h = (o.scene ? '<p class="alb-scene">' + esc(o.scene) + '</p>' : "") +
          '<div class="alb-sachet-w" aria-hidden="true"><div class="alb-sachet"><span class="alb-sachet-h"></span><b>VIGNETTES</b><i>' + pluriel(n, "vignette", "vignettes") + '</i><span class="alb-sachet-b"></span></div></div>' +
          (o.gratuite ? '<p class="alb-prix">Offerte</p>' : (o.prix ? '<p class="alb-prix">' + esc(o.prix) + '</p>' : "")) +
          '<div class="alb-btns"><button type="button" class="alb-b alb-pri" data-a="dechirer">Déchirer</button>' +
          '<button type="button" class="alb-b" data-a="laisser">' + (o.gratuite ? "Plus tard" : "Laisser") + '</button></div>';
      } else if (OV.etape === "revele") {
        var info = OV.infos[k], s = CAT.par[info.id];
        h = '<p class="alb-compte">' + (k + 1) + ' / ' + n + '</p>' +
          '<div class="alb-carte' + (OV.retournee ? " alb-retournee" : "") + (info.br ? " alb-brillante" : "") + '" data-a="carte"><div class="alb-carte-in">' +
          '<div class="alb-recto"><span>?</span></div><div class="alb-verso">' + vignetteHtml(s, { n: info.n, force: true }) + '</div></div></div>' +
          '<p class="alb-legende" aria-live="polite"></p>' +
          '<div class="alb-btns"><button type="button" class="alb-b alb-pri" data-a="retourner">Retourner</button>' +
          '<button type="button" class="alb-b" data-a="tout">Tout voir</button></div>';
      } else {
        var nouv = OV.infos.filter(function (i) { return i.nouveau; }).length, dbl = n - nouv, br = OV.infos.filter(function (i) { return i.br; }).length;
        var bits = [];
        if (nouv) bits.push(pluriel(nouv, "nouvelle", "nouvelles"));
        if (dbl) bits.push(pluriel(dbl, "double", "doubles"));
        if (br) bits.push(pluriel(br, "brillante", "brillantes"));
        h = '<h2 class="alb-h">' + (br ? "Une brillante dans la pochette" : "Dans la pochette") + '</h2><p class="alb-sous">' + esc(bits.join(" · ")) + '</p>' +
          '<div class="alb-recap">' + OV.infos.map(function (i) {
            return '<span class="alb-recap-c">' + vignetteHtml(CAT.par[i.id], { n: i.n, force: true }) +
              '<em class="' + (i.nouveau ? "neuf" : "dbl") + '">' + (i.nouveau ? "Nouvelle" : "Double") + '</em></span>';
          }).join("") + '</div>';
        OV.finissent.forEach(function (id) {
          var pg = pageDe(id), r = pg.recompense;
          h += '<div class="alb-fini"><b>Page complète · ' + esc(pg.titre) + '</b>' + (r ? '<span>' + esc(r.texte) + '</span><em>' + esc(resumeRecompense(r, o.argent)) + '</em>' : "") + '</div>';
        });
        h += '<div class="alb-btns"><button type="button" class="alb-b alb-pri" data-a="fin">Coller dans l\'album</button>' +
          (o.album ? '<button type="button" class="alb-b" data-a="album">Voir l\'album</button>' : "") + '</div>';
      }
      return h;
    }
    function ovRendre() {
      OV.scene.innerHTML = ovHtml();
      OV.el.setAttribute("data-etape", OV.etape);
      var b = OV.scene.querySelector(".alb-pri");
      if (b && OV.etape !== "revele") { try { b.focus({ preventScroll: true }); } catch (e) {} }
      if (OV.etape === "revele") ovLegende();
    }
    function ovLegende() {
      var info = OV.infos[OV.k], s = CAT.par[info.id], el = OV.scene.querySelector(".alb-legende");
      if (!el) return;
      if (!OV.retournee) { el.textContent = ""; el.className = "alb-legende"; return; }
      var t = info.nouveau ? "Nouvelle vignette · n° " + num(s.n) : "Un double · tu en as " + info.n;
      if (info.br) t = (s.secret ? "Brillante. Le nom a bavé à l'impression. " : "Brillante ! ") + (info.nouveau ? "Nouvelle · n° " + num(s.n) : "Un double · tu en as " + info.n);
      el.textContent = t;
      el.className = "alb-legende " + (info.br ? "br" : info.nouveau ? "neuf" : "dbl");
    }
    function ovAction(a) {
      if (!OV) return;
      var o = OV.o, info, k;
      if (a === "laisser") { var fin0 = o.fin; ovFermer(); if (fin0) fin0(null); return; }
      if (a === "dechirer") { jouer("porte"); OV.etape = "revele"; OV.k = 0; OV.retournee = false; ovRendre(); return; }
      if (a === "retourner" || a === "carte") {
        if (OV.etape !== "revele") return;
        if (!OV.retournee) {
          OV.retournee = true;
          info = OV.infos[OV.k];
          var carte = OV.scene.querySelector(".alb-carte");
          if (carte) carte.classList.add("alb-retournee");
          jouer(info.br ? "palier_haut" : info.nouveau ? "nouvelle" : "carte_arrivee");
          if (info.br) {
            OV.el.classList.remove("alb-eclat"); void OV.el.offsetWidth; OV.el.classList.add("alb-eclat");
            try { if (navigator.vibrate) navigator.vibrate(30); } catch (e) {}
          }
          ovLegende();
          var btns = OV.scene.querySelector(".alb-btns");
          if (btns) btns.innerHTML = '<button type="button" class="alb-b alb-pri" data-a="suivante">' + (OV.k + 1 >= OV.ids.length ? "Voir les quatre" : "Suivante ›") + '</button>';
          var sb = OV.scene.querySelector('[data-a="suivante"]'); if (sb) { try { sb.focus({ preventScroll: true }); } catch (e) {} }
          return;
        }
        a = "suivante";
      }
      if (a === "suivante") {
        if (OV.etape !== "revele") return;
        k = OV.k + 1;
        if (k >= OV.ids.length) { OV.etape = "recap"; ovRendre(); return; }
        OV.k = k; OV.retournee = false; ovRendre(); jouer("carte_arrivee");
        return;
      }
      if (a === "tout") {
        // on passe : les éclats et les sons de ce qu'on saute se perdent, pas les vignettes
        OV.etape = "recap"; ovRendre(); return;
      }
      if (a === "fin" || a === "album") {
        var voir = a === "album" && o.album, fin = o.fin;
        etat.n++;                                  // le compteur du tirage : la pochette suivante sera une autre
        var res = ajouter(OV.ids);
        if (o.gratuite) prendreLibre();
        res.libre = !!o.gratuite;
        res.pagesDetail = res.pages.map(function (id) { return pageDe(id); });
        ovFermer();
        if (res.pages.length) jouer("une");
        if (fin) fin(res);
        if (voir) setTimeout(o.album, 60);
      }
    }
    function ovFermer() {
      if (!OV) return;
      if (OV.el.parentNode) OV.el.parentNode.removeChild(OV.el);
      OV = null;
    }
    // o : { gratuite, prix (texte), scene, graine, annee, histoire, argent, album (ouvre l'album), fin(res | null) }
    function pochette(o) {
      o = o || {};
      if (OV || (o.gratuite && !libres())) return false;
      var ctx = contexte(o), ids = composer(ctx), tmp = {}, infos = [];
      ids.forEach(function (id) {
        var avant = (etat.s[id] | 0) + (tmp[id] | 0);
        infos.push({ id: id, nouveau: avant === 0, n: avant + 1, br: CAT.par[id].rarete === "brillante" });
        tmp[id] = (tmp[id] | 0) + 1;
      });
      // les pages que cette pochette finirait (pour le dire avant de les coller)
      var finissent = CAT.pages.filter(function (pg) {
        return !etat.p[pg.id] && pg.ids.every(function (id) { return !!etat.s[id] || tmp[id]; }) && pg.ids.some(function (id) { return !etat.s[id]; });
      }).map(function (pg) { return pg.id; });
      var el = document.createElement("div");
      el.className = "alb-ov alb-pochette"; el.id = "albPochette";
      el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Une pochette de vignettes");
      el.innerHTML = '<div class="alb-ov-in"><div class="alb-ov-scene"></div></div>';
      document.body.appendChild(el);
      OV = { el: el, scene: el.querySelector(".alb-ov-scene"), o: o, ids: ids, infos: infos, k: 0, retournee: false, etape: "scellee", finissent: finissent, t: 0 };
      el.addEventListener("click", function (e) {
        var t = e.target.closest ? e.target.closest("[data-a]") : null;
        if (!t || !OV) return;
        var now = Date.now();
        if (now - OV.t < 220) return;      // un doigt qui insiste ne saute pas une vignette
        OV.t = now;
        ovAction(t.getAttribute("data-a"));
      });
      // un clavier ne ferme pas ce qui s'ouvre sous lui : Entrée et Espace activent le bouton, rien d'autre
      el.addEventListener("keydown", function (e) { e.stopPropagation(); });
      ovRendre();
      return true;
    }

    // ═══ LES RÉCOMPENSES D'UNE PAGE ═════════════════════════════════════════════
    function resumeRecompense(r, fmt) {
      var l = [];
      if (r.pochettes) l.push(pluriel(r.pochettes, "pochette offerte", "pochettes offertes"));
      if (r.francs) l.push(fmt ? fmt(r.francs) : r.francs + " F");
      if (r.quartier) l.push(QUARTIER[r.quartier] + " ouvert d'avance");
      if (r.tuyau) l.push("un tuyau");
      return l.join(" · ");
    }
    // les récompenses que le moteur n'a pas encore reçues (la ville les réclame quand elle est là)
    function dus() {
      return etat.d.map(function (id) { var pg = pageDe(id); return pg && pg.recompense ? { page: id, texte: pg.recompense.texte, mission: pg.recompense.mission, quartier: pg.recompense.quartier || null } : null; }).filter(Boolean);
    }
    function solder(id) { var i = etat.d.indexOf(id); if (i >= 0) { etat.d.splice(i, 1); sauver(); } }
    // les quartiers ouverts d'avance, à chaque nouvelle carrière
    function permanents() { return Object.keys(etat.q).sort(); }

    // ═══ LES UNES : le visage de celui qui fait la Une, collé une fois par histoire ═══
    function une(v) {
      var c = v && v.card;
      if (!c || c.beatKind !== "bilan_une" || !c.une) return;
      var h = histoireActuelle(), id = CAT.unes[h];
      if (!id || etat.u[h]) return;
      var d = c.une;
      etat.u[h] = { t: coupe(d.titre, 90), j: coupe(d.journalNom, 40), a: entier(d.annee, 1990, 2050), d: coupe(d.date, 24), g: v.genre === "f" ? "f" : "m",
        r: v.role === "joueur" ? "joueur" : "coach", nom: coupe(v.name || (v.entities && v.entities.protagonist) || "", 32), seed: coupe(String(currentSeed), 16) };
      var res = ajouter([id]);
      annonce(res.pages.length ? "Ta Une est collée : la page « Les Unes » est complète." : "Ta Une est collée dans l'album.");
    }

    // ═══ L'ALBUM QU'ON FEUILLETTE ═══════════════════════════════════════════════
    // monter(el, { argent, apres(res), album }) : l'album dans `el` (la liste des pages, une page, une vignette).
    function monter(el, o) {
      o = o || {};
      var E = { ecran: "liste", page: null, v: null, dos: false };
      var fmt = o.argent || null;
      if (el._albClic) el.removeEventListener("click", el._albClic);
      if (el._albCle) el.removeEventListener("keydown", el._albCle);
      function haut() { var p = el.closest ? el.closest(".plein") : null; if (p) p.scrollTop = 0; }
      function listeHtml() {
        var P = progression(), pct = Math.round(P.have / P.total * 100), li = libres();
        var h = '<div class="alb"><div class="alb-tete"><div class="alb-gros"><b>' + P.have + '</b><small>/' + P.total + '</small></div><div class="alb-tete-d"><span>vignettes · ' + pct + ' %</span>' +
          '<i class="alb-barre" style="--p:' + pct + '%"></i></div></div>' +
          '<p class="alb-stats">' + pluriel(nbDoubles(), "double", "doubles") + ' · ' + pluriel(etat.n, "pochette ouverte", "pochettes ouvertes") + '</p>';
        if (li) h += '<button type="button" class="alb-offerte" data-a="ouvrir"><b>Ouvrir une pochette offerte</b><span>' + pluriel(li, "pochette t'attend", "pochettes t'attendent") + '</span></button>';
        [["legendes", "Les légendes"], ["visages", "Les visages"]].forEach(function (sec) {
          h += '<h3 class="alb-h3">' + sec[1] + '</h3><ul class="alb-pages">';
          CAT.pages.filter(function (pg) { return pg.section === sec[0]; }).forEach(function (pg) {
            var pr = progression(pg.id), fait = pr.have === pr.total, neufs = pg.ids.filter(function (id) { return etat.s[id] && !etat.vu[id]; }).length;
            h += '<li><button type="button" class="alb-page' + (fait ? " fait" : "") + '" data-page="' + esc(pg.id) + '" style="--f:' + pg.fond + ';--b:' + pg.bande + '"><i class="alb-puce"></i>' +
              '<span class="alb-pt"><b>' + esc(pg.titre) + '</b><i class="alb-barre" style="--p:' + Math.round(pr.have / pr.total * 100) + '%"></i></span>' +
              '<span class="alb-pn">' + (fait ? "✓" : pr.have + '/' + pr.total) + (neufs ? '<em>+' + neufs + '</em>' : "") + '</span></button></li>';
          });
          h += '</ul>';
        });
        return h + '</div>';
      }
      function pageHtml() {
        var pg = pageDe(E.page), pr = progression(pg.id), fait = pr.have === pr.total, h;
        var i = pg.i;
        h = '<div class="alb"><button type="button" class="alb-retour" data-a="liste">‹ Les pages</button>' +
          '<header class="alb-ph-t" style="--f:' + pg.fond + ';--b:' + pg.bande + ';--t:' + pg.texte + '"><h2>' + esc(pg.titre) + '</h2><p>' + esc(pg.sous) + '</p>' +
          '<div class="alb-prog"><b>' + pr.have + '/' + pr.total + '</b><i class="alb-barre" style="--p:' + Math.round(pr.have / pr.total * 100) + '%"></i></div></header>' +
          '<div class="alb-grille">';
        pg.ids.forEach(function (id) {
          var s = CAT.par[id], n = etat.s[id] | 0;
          h += '<button type="button" class="alb-c" data-v="' + esc(id) + '" aria-label="' + esc(n ? (affiche(s).nom || "Numéro 5") + ", n° " + s.n : "Vignette n° " + s.n + ", manquante") + '">' +
            vignetteHtml(s, { nouveau: n > 0 && !etat.vu[id] }) + '</button>';
        });
        h += '</div>';
        var r = pg.recompense;
        if (r) {
          h += '<div class="alb-recomp' + (fait ? " fait" : "") + '"><b>' + (fait ? "Page complète" : "À la clé") + '</b>' +
            '<span>' + esc(fait ? r.texte : resumeRecompense(r, fmt)) + '</span>' +
            (fait && r.tuyau ? '<em>« ' + esc(r.tuyau.texte) + ' »</em>' : "") + '</div>';
        }
        h += '<nav class="alb-nav"><button type="button" data-a="prec"' + (i ? "" : " disabled") + ' aria-label="Page précédente">‹</button><span>' + (i + 1) + ' / ' + CAT.pages.length + '</span>' +
          '<button type="button" data-a="suiv"' + (i < CAT.pages.length - 1 ? "" : " disabled") + ' aria-label="Page suivante">›</button></nav></div>';
        // ce qu'on vient de voir n'est plus neuf
        pg.ids.forEach(function (id) { if (etat.s[id]) etat.vu[id] = 1; });
        sauver();
        return h;
      }
      function detailHtml() {
        var s = CAT.par[E.v], n = etat.s[s.id] | 0, pg = s.pg, h;
        h = '<div class="alb"><button type="button" class="alb-retour" data-a="page">‹ ' + esc(pg.titre) + '</button><div class="alb-zoom">';
        if (n) {
          h += '<div class="alb-flip' + (E.dos ? " dos" : "") + '"><div class="alb-flip-in"><div class="alb-flip-f">' + vignetteHtml(s, {}) + '</div><div class="alb-flip-d">' + vignetteDos(s) + '</div></div></div>' +
            '<p class="alb-zoom-t">' + (n > 1 ? "Tu en as " + n + ". " + pluriel(n - 1, "double", "doubles") + " à échanger." : "Tu l'as, en un exemplaire.") + '</p>' +
            '<div class="alb-btns"><button type="button" class="alb-b" data-a="retourner">' + (E.dos ? "Voir la photo" : "Retourner") + '</button></div>';
        } else {
          var ou = s.k === "u" ? "Fais la Une dans « " + titreHistoire(s.histoire) + " » : ton visage est collé là, le jour où le journal titre sur ta saison."
            : s.rarete === "brillante" ? "Une brillante : elle sort des pochettes, une fois sur " + DATA.pochette.brillante_sur + "." + (s.pg.livres ? " On en voit davantage dans certaines histoires." : "")
            : s.epoque ? "Elle sort plus souvent des pochettes quand la carrière est entre " + s.epoque[0] + " et " + s.epoque[1] + "." : "Elle sort des pochettes, ou d'un échange.";
          h += '<div class="alb-flip"><div class="alb-flip-in"><div class="alb-flip-f">' + vignetteHtml(s, {}) + '</div></div></div><p class="alb-zoom-t">Il te manque la n° ' + num(s.n) + '. ' + esc(ou) + '</p>';
        }
        return h + '</div></div>';
      }
      function rendre() {
        el.innerHTML = E.ecran === "liste" ? listeHtml() : E.ecran === "page" ? pageHtml() : detailHtml();
      }
      function va(ecran, page, v) {
        E.ecran = ecran; E.page = page != null ? page : E.page; E.v = v != null ? v : E.v; E.dos = false;
        rendre(); haut();
      }
      el._albClic = function (e) {
        var t = e.target.closest ? e.target.closest("[data-page],[data-v],[data-a]") : null;
        if (!t || !el.contains(t)) return;
        var a = t.getAttribute("data-a"), p = t.getAttribute("data-page"), v = t.getAttribute("data-v");
        if (p) return va("page", p);
        if (v && !a) return va("detail", E.page, v);
        if (a === "liste") return va("liste");
        if (a === "page") return va("page", CAT.par[E.v].page);
        if (a === "prec" || a === "suiv") { var pg = CAT.pages[pageDe(E.page).i + (a === "prec" ? -1 : 1)]; if (pg) va("page", pg.id); return; }
        if (a === "retourner") { E.dos = !E.dos; var f = el.querySelector(".alb-flip"); if (f) f.classList.toggle("dos", E.dos); t.textContent = E.dos ? "Voir la photo" : "Retourner"; return; }
        if (a === "ouvrir") {
          pochette({ gratuite: true, argent: fmt, album: o.album || null, fin: function (res) { rendre(); if (o.apres) o.apres(res); majEntree(); } });
        }
      };
      // Entrée et Espace servent à toucher un bouton ici, pas à fermer le panneau
      el._albCle = function (e) { if (e.key === "Enter" || e.key === " ") e.stopPropagation(); };
      el.addEventListener("click", el._albClic);
      el.addEventListener("keydown", el._albCle);
      rendre();
      return { rendre: rendre, va: va };
    }

    // ═══ L'ÉCHANGE : deux doubles contre une vignette qui manque, chez quelqu'un qui en a ═══
    function echangeDe(gens) { return (DATA.echanges || []).filter(function (e) { return e.gens === gens; })[0] || null; }
    // ce que la personne a cette semaine : un tirage de la graine, de la personne et de la semaine
    function stockDe(cfg, o) {
      var ctx = { graine: o.graine, annee: o.annee, histoire: o.histoire || "" };
      var r = rng(fnv(o.graine + "|echange|" + cfg.gens + "|" + o.semaine));
      var pool = CAT.communes.filter(function (id) { return CAT.par[id].echangeable; });
      var brill = CAT.brillantes.filter(function (id) { return CAT.par[id].echangeable; });
      var fav = {}; (cfg.affinite || []).forEach(function (p) { fav[p] = 1; });
      var poids = function (id) { var s = CAT.par[id], p = poidsDe(s, ctx); return fav[s.page] ? p * 4 : p; };
      var out = [];
      if (brill.length && r() < cfg.brillante) out.push(tirer(r, brill, poids));
      var garde = 0;
      while (out.length < cfg.stock && garde++ < 400) {
        var id = tirer(r, pool, poids);
        if (out.indexOf(id) < 0) out.push(id);
      }
      return out;
    }
    function doublesDe() {
      return CAT.ordre.filter(function (id) { return (etat.s[id] | 0) > 1; }).map(function (id) { return { id: id, reste: etat.s[id] - 1 }; });
    }
    function ecHtml() {
      var o = EC.o, donne = DATA.echange.donne, recoit = DATA.echange.recoit, h;
      var choisis = 0; Object.keys(EC.donnes).forEach(function (id) { choisis += EC.donnes[id]; });
      h = '<h2 class="alb-h">Échanger avec ' + esc(o.nom) + '</h2>' + (o.scene ? '<p class="alb-scene">' + esc(o.scene) + '</p>' : "");
      if (!EC.doubles.length) {
        h += '<p class="alb-vide-t">Tu n\'as aucun double à donner. Les pochettes en font ; les échanges commencent là.</p>';
      } else if (!EC.offre.length) {
        h += '<p class="alb-vide-t">' + esc(o.nom) + ' n\'a rien que tu n\'aies déjà, cette semaine. Reviens plus tard.</p>';
      } else {
        h += '<h3 class="alb-h3">Tu donnes ' + pluriel(donne, "double", "doubles") + ' <small>' + choisis + '/' + donne + '</small></h3><div class="alb-mini-g">';
        EC.doubles.forEach(function (d) {
          var c = EC.donnes[d.id] | 0;
          h += '<button type="button" class="alb-mini' + (c ? " sel" : "") + '" data-d="' + esc(d.id) + '">' + vignetteHtml(CAT.par[d.id], {}) +
            '<em>' + (c ? "donne ×" + c : "reste ×" + d.reste) + '</em></button>';
        });
        h += '</div><h3 class="alb-h3">Tu reçois ' + pluriel(recoit, "vignette", "vignettes") + ' <small>' + (EC.recu ? 1 : 0) + '/' + recoit + '</small></h3><div class="alb-mini-g">';
        EC.offre.forEach(function (id) {
          h += '<button type="button" class="alb-mini' + (EC.recu === id ? " sel" : "") + '" data-r="' + esc(id) + '">' + vignetteHtml(CAT.par[id], { force: true }) +
            '<em>' + (EC.recu === id ? "tu prends" : "elle te manque") + '</em></button>';
        });
        h += '</div>';
      }
      var pret = choisis === donne && !!EC.recu;
      return h + '<div class="alb-btns"><button type="button" class="alb-b alb-pri" data-a="echanger"' + (pret ? "" : " disabled") + '>Échanger</button>' +
        '<button type="button" class="alb-b" data-a="laisser">Laisser</button></div>';
    }
    function ecRendre() {
      var y = EC.scene.scrollTop;
      EC.scene.innerHTML = ecHtml();
      EC.scene.scrollTop = y;
    }
    function ecFermer() { if (EC && EC.el.parentNode) EC.el.parentNode.removeChild(EC.el); EC = null; }
    // o : { gens, nom, scene, graine, annee, histoire, semaine, pris: [ids déjà pris cette semaine], fin(res | null) }
    function echange(o) {
      o = o || {};
      var cfg = echangeDe(o.gens);
      if (EC || !cfg) return false;
      var stock = stockDe(cfg, o), pris = o.pris || [];
      var offre = stock.filter(function (id) { return !etat.s[id] && pris.indexOf(id) < 0; });
      var el = document.createElement("div");
      el.className = "alb-ov alb-echange"; el.id = "albEchange";
      el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Échanger des vignettes");
      el.innerHTML = '<div class="alb-ov-in"><div class="alb-ov-scene"></div></div>';
      document.body.appendChild(el);
      EC = { el: el, scene: el.querySelector(".alb-ov-scene"), o: o, cfg: cfg, offre: offre, doubles: doublesDe(), donnes: {}, recu: null };
      el.addEventListener("click", function (e) {
        var t = e.target.closest ? e.target.closest("[data-d],[data-r],[data-a]") : null;
        if (!t || !EC) return;
        var d = t.getAttribute("data-d"), r = t.getAttribute("data-r"), a = t.getAttribute("data-a"), donne = DATA.echange.donne;
        if (d) {
          var tot = 0; Object.keys(EC.donnes).forEach(function (k) { tot += EC.donnes[k]; });
          var dd = EC.doubles.filter(function (x) { return x.id === d; })[0], c = EC.donnes[d] | 0;
          // un toucher ajoute un exemplaire de trop ; au bout du reste (ou quand c'est plein), on les rend
          if (c < dd.reste && tot < donne) EC.donnes[d] = c + 1;
          else delete EC.donnes[d];
          return ecRendre();
        }
        if (r) { EC.recu = EC.recu === r ? null : r; return ecRendre(); }
        if (a === "laisser") { var f0 = o.fin; ecFermer(); if (f0) f0(null); return; }
        if (a === "echanger") {
          var n = 0; Object.keys(EC.donnes).forEach(function (k) { n += EC.donnes[k]; });
          if (n !== donne || !EC.recu) return;
          var donnes = Object.keys(EC.donnes).sort(), recu = EC.recu, fin = o.fin;
          donnes.forEach(function (id) { etat.s[id] = Math.max(1, (etat.s[id] | 0) - EC.donnes[id]); });
          var res = ajouter([recu]);
          etat.e++; sauver();
          res.donnes = donnes.map(function (id) { return { id: id, n: EC.donnes[id] }; });
          res.recu = recu;
          var fins = EC.cfg.fin || [];
          res.phrase = fins.length ? fins[(etat.e - 1) % fins.length] : "";
          ecFermer();
          jouer("promesse");
          if (fin) fin(res);
        }
      });
      el.addEventListener("keydown", function (e) { e.stopPropagation(); });
      ecRendre();
      return true;
    }

    // ═══ L'ENTRÉE DE L'ACCUEIL : un bouton dans le menu du haut, et les pochettes qui t'attendent ═══
    var ICONE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M5 3h10.5L21 8.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm1 2.2v13.6h12V9.6h-4.4V5.2Zm6 5.3a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2ZM8.6 18c0-1.9 1.5-3.1 3.4-3.1s3.4 1.2 3.4 3.1Z"/></svg>';
    function majEntree() {
      var b = document.getElementById("btnAlbum");
      if (!b) {
        var menu = document.querySelector("#accHero .menu");
        if (!menu) return;
        b = document.createElement("button");
        b.type = "button"; b.id = "btnAlbum"; b.className = "alb-bt";
        b.innerHTML = ICONE + '<span class="alb-pastille" hidden></span>';
        var avant = document.getElementById("btnReglages");
        menu.insertBefore(b, avant);
        b.addEventListener("click", function () { ouvrirDepuisAccueil(b); });
      }
      var n = libres(), p = possedees();
      b.setAttribute("aria-label", "L'album de vignettes : " + p + " sur " + CAT.total + (n ? ", " + pluriel(n, "pochette offerte", "pochettes offertes") : ""));
      var past = b.querySelector(".alb-pastille");
      past.hidden = !n; past.textContent = n > 99 ? "99+" : String(n);
    }
    function ouvrirDepuisAccueil(opener) {
      openPanel("album", "L'album", '<div class="alb-racine" id="albRacine"></div>', opener);
      monter(document.getElementById("albRacine"), { apres: majEntree });
    }

    // ═══ L'API, et l'abonnement aux moments de l'aperçu ═════════════════════════
    construire();
    etat = charger();
    window.FusibleAlbum = {
      pret: true,
      catalogue: function () { return CAT; },
      etat: function () { return etat; },
      possede: function (id) { return etat.s[id] | 0; },
      progression: progression,
      libres: libres,
      offrir: offrir,
      pochette: pochette,
      monter: monter,
      echange: echange,
      echangeDe: echangeDe,
      doublesDe: doublesDe,
      dus: dus,
      solder: solder,
      permanents: permanents,
      annonce: annonce,
      resume: resumeRecompense,
      config: function () { return DATA; },
      // pour les essais : le tirage sans l'ouvrir, une page complétée, l'album remis à zéro
      _essai: {
        composer: function (graine, n, annee, histoire) { var n0 = etat.n; etat.n = n; var r = composer({ graine: graine, annee: annee || 1990, histoire: histoire || "" }); etat.n = n0; return r; },
        donner: function (ids) { return ajouter(ids); },
        une: function (v) { return une(v); },
        completer: function (pageId) { var pg = pageDe(pageId); return pg ? ajouter(pg.ids.slice()) : null; },
        reset: function () { etat = vide(); VISAGES = {}; sauver(); majEntree(); },
        simuler: function (paquets, graine, annee, histoire) {
          var sauve = JSON.stringify(etat), pas = [], brill = 0;
          for (var i = 0; i < paquets; i++) {
            var ids = composer({ graine: graine || 1, annee: annee || 1990, histoire: histoire || "" });
            etat.n++;
            ids.forEach(function (id) { etat.s[id] = Math.min(MAXN, (etat.s[id] | 0) + 1); if (CAT.par[id].rarete === "brillante") brill++; });
            if ((i + 1) % 10 === 0) pas.push(possedees());
          }
          var out = { possedees: possedees(), total: CAT.total, doubles: nbDoubles(), brillantes: brill, pas: pas };
          etat = JSON.parse(sauve);
          return out;
        }
      }
    };
    crochet("accueil", majEntree);
    // La Une : la coquille ne dit pas « carte » pour la page de journal du Bilan (elle sort de `renderGame`
    // avant le crochet) ; on regarde la page s'ouvrir.
    var pageUne = document.getElementById("unePage");
    if (pageUne && window.MutationObserver) {
      new MutationObserver(function () {
        if (!pageUne.hidden) { try { une(view); } catch (e) { if (window.console) console.error("album : une", e); } }
      }).observe(pageUne, { attributes: true, attributeFilter: ["hidden"] });
    }
  })();
