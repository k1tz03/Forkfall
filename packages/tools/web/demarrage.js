/* ═══════════════════════════════════════════════════════════════════════════
   FUSIBLE — le démarrage (window.FusibleContenu), inséré par assemble.js avant
   tous les autres scripts de la page.

   Le contenu n'est plus un JSON de 13 Mo lu trois fois : build_content le
   découpe (packages/tools/bin/src/livres.dart) en un bundle COMMUN — ce que
   l'accueil, la ville et tous les livres lisent — et un bundle PAR LIVRE ;
   assemble.js les compresse (gzip) et embarque le commun en base64. Ici :
     · le commun se décompresse tout de suite (DecompressionStream natif, sinon
       l'inflate de secours plus bas) — embarqué dans le fichier seul ; dans la
       version jouable, un fichier demandé dès la tête de la page
       (window.FUSIBLE_COMMUN) — et la page démarre quand il est là
       (`FusibleContenu.pret(fn)`) ;
     · le livre se charge quand une carrière commence ou reprend
       (`FusibleContenu.livre(postulat)`) : un fichier à côté de la page (la
       version jouable, servie en HTTP) ou un bloc embarqué (le fichier seul),
       puis il rejoint le commun, dans l'ordre exact du bundle entier, et le
       moteur relit le tout. L'accueil n'attend jamais un livre.
   La fusion est celle de `fusionnerLivre` (livres.dart) ; assemble.js vérifie
   qu'elle rend, pour chaque livre, le bundle entier restreint à ce livre, et
   packages/core/test/livres_test.dart qu'une carrière y est la même.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var SOURCES = global.FUSIBLE_CONTENU || {};

  // ─── l'inflate de secours (RFC 1951, à la manière de tinf) : pour les
  // navigateurs sans DecompressionStream (Safari avant 16.4). Lent mais exact :
  // assemble.js le vérifie octet pour octet sur chaque bundle.
  var LONG_BASE = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258];
  var LONG_BITS = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
  var DIST_BASE = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577];
  var DIST_BITS = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
  var ORDRE_CL = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
  function arbre(n) { return { t: new Uint16Array(16), s: new Uint16Array(n) }; }
  // l'arbre de Huffman canonique : combien de codes par longueur, puis les symboles rangés
  function batir(a, longueurs, off, n) {
    var i, somme = 0, offs = new Uint16Array(16);
    for (i = 0; i < 16; i++) a.t[i] = 0;
    for (i = 0; i < n; i++) a.t[longueurs[off + i]]++;
    a.t[0] = 0;
    for (i = 0; i < 16; i++) { offs[i] = somme; somme += a.t[i]; }
    for (i = 0; i < n; i++) if (longueurs[off + i]) a.s[offs[longueurs[off + i]]++] = i;
  }
  var FIXE_L = arbre(288), FIXE_D = arbre(30);
  (function () {
    var l = new Uint8Array(288), i;
    for (i = 0; i < 144; i++) l[i] = 8;
    for (; i < 256; i++) l[i] = 9;
    for (; i < 280; i++) l[i] = 7;
    for (; i < 288; i++) l[i] = 8;
    batir(FIXE_L, l, 0, 288);
    for (i = 0; i < 30; i++) l[i] = 5;
    batir(FIXE_D, l, 0, 30);
  })();
  function bit(d) {
    if (!d.n--) { d.tag = d.src[d.i++]; d.n = 7; }
    var b = d.tag & 1;
    d.tag >>>= 1;
    return b;
  }
  function bits(d, n, base) {
    var v = 0;
    for (var m = 1, lim = 1 << n; m < lim; m <<= 1) if (bit(d)) v += m;
    return v + base;
  }
  function symbole(d, a) {
    var somme = 0, cur = 0, len = 0;
    do {
      cur = 2 * cur + bit(d);
      len++;
      somme += a.t[len];
      cur -= a.t[len];
    } while (cur >= 0);
    return a.s[somme + cur];
  }
  function arbresDynamiques(d, lt, dt) {
    var hlit = bits(d, 5, 257), hdist = bits(d, 5, 1), hclen = bits(d, 4, 4), i;
    var l = new Uint8Array(288 + 32), cl = arbre(19);
    for (i = 0; i < 19; i++) l[i] = 0;
    for (i = 0; i < hclen; i++) l[ORDRE_CL[i]] = bits(d, 3, 0);
    batir(cl, l, 0, 19);
    for (i = 0; i < hlit + hdist; i++) l[i] = 0;
    for (var n = 0; n < hlit + hdist;) {
      var s = symbole(d, cl), k, prev;
      if (s < 16) { l[n++] = s; continue; }
      if (s === 16) { prev = l[n - 1]; k = bits(d, 2, 3); }
      else if (s === 17) { prev = 0; k = bits(d, 3, 3); }
      else { prev = 0; k = bits(d, 7, 11); }
      while (k--) l[n++] = prev;
    }
    batir(lt, l, 0, hlit);
    batir(dt, l, hlit, hdist);
  }
  function bloc(d, lt, dt) {
    for (;;) {
      var s = symbole(d, lt);
      if (s === 256) return;
      if (s < 256) { d.out[d.o++] = s; continue; }
      s -= 257;
      var len = bits(d, LONG_BITS[s], LONG_BASE[s]);
      var ds = symbole(d, dt), off = d.o - bits(d, DIST_BITS[ds], DIST_BASE[ds]);
      for (var i = 0; i < len; i++) d.out[d.o++] = d.out[off + i];
    }
  }
  // gzip (RFC 1952) → les octets décompressés ; la taille finale est dans les 4 derniers octets
  function degzipJs(src) {
    if (src[0] !== 0x1f || src[1] !== 0x8b || src[2] !== 8) throw new Error("pas un gzip");
    var flg = src[3], i = 10;
    if (flg & 4) i += 2 + (src[i] | (src[i + 1] << 8));
    if (flg & 8) { while (src[i]) i++; i++; }
    if (flg & 16) { while (src[i]) i++; i++; }
    if (flg & 2) i += 2;
    var n = src.length, taille = (src[n - 4] | (src[n - 3] << 8) | (src[n - 2] << 16) | (src[n - 1] << 24)) >>> 0;
    var d = { src: src, i: i, tag: 0, n: 0, out: new Uint8Array(taille), o: 0 };
    var lt = arbre(288), dt = arbre(30), fin;
    do {
      fin = bit(d);
      var type = bits(d, 2, 0);
      if (type === 0) {
        d.n = 0;
        var len = d.src[d.i] | (d.src[d.i + 1] << 8);
        d.i += 4;
        d.out.set(d.src.subarray(d.i, d.i + len), d.o);
        d.i += len; d.o += len;
      } else if (type === 1) bloc(d, FIXE_L, FIXE_D);
      else if (type === 2) { arbresDynamiques(d, lt, dt); bloc(d, lt, dt); }
      else throw new Error("bloc deflate invalide");
    } while (!fin);
    if (d.o !== taille) throw new Error("gzip tronqué");
    return d.out;
  }
  function texteUtf8(octets) {
    if (global.TextDecoder) return new TextDecoder("utf-8").decode(octets);
    var s = "";
    for (var i = 0; i < octets.length; i += 0x8000) s += String.fromCharCode.apply(null, octets.subarray(i, i + 0x8000));
    return decodeURIComponent(escape(s));
  }

  // ─── décompresser : le natif quand il est là, le secours sinon. Un serveur qui
  // a déjà décompressé (Content-Encoding: gzip) rend du JSON : on le lit tel quel.
  var natif = typeof global.DecompressionStream === "function" && typeof global.Response === "function" && typeof global.Blob === "function";
  function decompresser(octets) {
    if (octets[0] !== 0x1f || octets[1] !== 0x8b) return Promise.resolve(texteUtf8(octets));
    if (natif) {
      try {
        var flux = new Blob([octets]).stream().pipeThrough(new global.DecompressionStream("gzip"));
        return new Response(flux).text().catch(function () { return texteUtf8(degzipJs(octets)); });
      } catch (e) { /* un navigateur qui annonce l'API sans la tenir : le secours */ }
    }
    return new Promise(function (ok) { ok(texteUtf8(degzipJs(octets))); });
  }
  function base64(s) {
    var b = global.atob(s), n = b.length, out = new Uint8Array(n);   // atob saute les blancs
    for (var i = 0; i < n; i++) out[i] = b.charCodeAt(i);
    return out;
  }
  // un bloc embarqué (le texte d'un <script type="application/octet-stream">), lu une fois puis vidé
  function embarque(id) {
    var el = global.document.getElementById(id);
    if (!el) return Promise.reject(new Error("contenu absent : " + id));
    var b = base64(el.textContent);
    el.textContent = "";
    return decompresser(b);
  }
  // `deja` : la réponse déjà demandée (le commun part dès la tête de la page, assemble.js)
  function telecharge(url, deja) {
    return (deja || global.fetch(url)).then(function (r) {
      if (!r.ok) throw new Error(url + " : " + r.status);
      return r.arrayBuffer();
    }).then(function (ab) { return decompresser(new Uint8Array(ab)); });
  }
  // un bundle : un bloc embarqué (`el`, le fichier seul) ou un fichier à côté de la page (`url`)
  function source(src, deja) {
    return src.el ? embarque(src.el) : telecharge(src.url, deja);
  }

  // ─── le commun, le vivant, la fusion
  var vivant = null;      // l'objet que la page, la ville et le moteur lisent : le commun, puis commun + livre
  var descr = null;       // `__livres` : les positions des items communs dans le bundle entier
  var pristines = {};     // chemin → la liste commune intacte (jamais modifiée)
  var courant = null;     // l'id du livre fusionné (null : le commun seul)
  var moteurCharge = false;
  var attente = [], erreurCommun = null, bruts = {}, enCours = {}, ecoutes = [];

  function lire(o, chemin) {
    var ks = chemin.split("."), x = o;
    for (var i = 0; i < ks.length && x; i++) x = x[ks[i]];
    return Array.isArray(x) ? x : null;
  }
  function poser(o, chemin, l) {
    var ks = chemin.split("."), x = o;
    for (var i = 0; i < ks.length - 1; i++) x = x[ks[i]];
    x[ks[ks.length - 1]] = l;
  }
  function dePlages(p) {
    var out = [];
    for (var i = 0; i + 1 < p.length; i += 2) for (var k = 0; k < p[i + 1]; k++) out.push(p[i] + k);
    return out;
  }
  /// commun + livre → les listes du vivant (même algorithme que `fusionnerLivre`,
  /// livres.dart) : une liste compactée reprend l'ordre du bundle entier par les
  /// positions ; une liste stable reçoit les items du livre à leur place.
  function fusionner(livre) {
    var stables = {};
    (descr.stables || []).forEach(function (s) { stables[s] = 1; });
    var faits = {};
    var listes = (livre && livre.listes) || {};
    Object.keys(listes).forEach(function (chemin) {
      var base = pristines[chemin];
      if (!base) return;
      var e = listes[chemin], pos = dePlages(e.pos), its = e.items, m;
      if (stables[chemin]) {
        m = base.slice();
        for (var k = 0; k < pos.length; k++) m[pos[k]] = its[k];
      } else {
        var posC = dePlages((descr.listes || {})[chemin] || []), i = 0, j = 0;
        m = [];
        while (i < base.length || j < its.length) {
          if (j >= its.length || (i < base.length && posC[i] < pos[j])) m.push(base[i++]);
          else m.push(its[j++]);
        }
      }
      poser(vivant, chemin, m);
      faits[chemin] = 1;
    });
    // ce que le livre précédent avait ajouté s'en va : les autres listes reprennent le commun
    Object.keys(pristines).forEach(function (chemin) { if (!faits[chemin]) poser(vivant, chemin, pristines[chemin]); });
  }
  function preparer(txt) {
    var c = JSON.parse(txt);
    descr = c.__livres || null;
    delete c.__livres;
    vivant = c;
    if (descr) {
      Object.keys(descr.listes || {}).concat(descr.stables || []).forEach(function (chemin) {
        var l = lire(c, chemin);
        if (l) pristines[chemin] = l;
      });
    }
  }
  // dans la page : le commun se décompresse dès maintenant (ou dès qu'il arrive), pendant
  // que le reste se lit
  var dansLaPage = !!global.document;
  var promesseCommun = !dansLaPage ? new Promise(function () {}) :
    (SOURCES.commun ? source(SOURCES.commun, global.FUSIBLE_COMMUN) : Promise.reject(new Error("aucun contenu"))).then(preparer);
  // une erreur de la page reste une erreur de la page (pas une promesse rejetée en silence)
  function lancer(f) { try { f(); } catch (e) { global.setTimeout(function () { throw e; }, 0); } }
  promesseCommun.then(function () {
    var fs = attente; attente = null;
    fs.forEach(lancer);
  }, function (e) {
    erreurCommun = e;
    var t = global.document.getElementById("titleScreen");
    if (t) t.innerHTML = '<p class="boot-error">Le contenu n\'a pas pu se charger : ' + String(e && e.message || e).replace(/[<&]/g, "") + '</p>';
    if (global.console) console.error("FusibleContenu", e);
  });

  // ─── après l'accueil : le commun lu, la coquille démarrée (elle a demandé ses images), et la
  // page chargée — `load` n'attend pas le commun, qui peut arriver après lui. Ce qui part
  // ensuite ne dispute ni le réseau ni le fil de la page à l'accueil.
  function apresAccueil(fn, delai) {
    promesseCommun.then(function () {
      var go = function () { global.setTimeout(fn, delai); };
      if (global.document.readyState === "complete") go(); else global.addEventListener("load", go);
    }, function () {});
  }

  // ─── le service worker (la version jouable, servie en HTTP) : la page s'installe
  // et se rejoue hors ligne (sw.js, écrit par assemble.js). Refusé — un hébergement
  // en bac à sable, un fichier ouvert en file:// — on n'insiste pas, sans un mot.
  if (dansLaPage && SOURCES.sw && global.navigator && "serviceWorker" in global.navigator && /^https?:$/.test(global.location.protocol)) {
    apresAccueil(function () {
      try { global.navigator.serviceWorker.register(SOURCES.sw).catch(function () {}); } catch (e) { /* refusé */ }
    }, 1000);
  }

  // ─── un livre : son id depuis l'index du postulat (ou l'id lui-même)
  function idDe(postulat) {
    if (typeof postulat === "string") return postulat;
    var ps = (vivant && vivant.postulats) || [];
    for (var i = 0; i < ps.length; i++) if ((ps[i].index | 0) === (postulat | 0)) return ps[i].id;
    return null;
  }
  function brut(id) {
    if (bruts[id]) return Promise.resolve(bruts[id]);
    if (enCours[id]) return enCours[id];
    var src = (SOURCES.livres || {})[id];
    if (!src) return Promise.resolve(null);     // un livre sans bundle : tout est au commun
    enCours[id] = source(src).then(function (txt) {
      var l = JSON.parse(txt);
      if (descr && l.hash !== vivant.hash) throw new Error("le livre " + id + " ne va pas avec ce contenu");
      bruts = {}; bruts[id] = l;     // un seul livre gardé en mémoire
      delete enCours[id];
      return l;
    }, function (e) { delete enCours[id]; throw e; });
    return enCours[id];
  }
  function chargerMoteur() {
    var j = JSON.stringify(vivant);
    if (global.fusibleCharger) global.fusibleCharger(j); else global.fusibleLoad(j);
    moteurCharge = true;
  }
  // Le moteur lui-même (le Dart compilé) : embarqué dans le fichier seul ; servi à côté de
  // la page dans la version jouable (contenu/moteur.<hash>.js), que l'accueil n'attend pas.
  var promesseScript = null;
  function scriptMoteur() {
    if (global.fusibleLoad) return Promise.resolve();
    if (promesseScript) return promesseScript;
    if (!SOURCES.moteur) return Promise.reject(new Error("le moteur est absent"));
    promesseScript = new Promise(function (ok, ko) {
      var s = global.document.createElement("script");
      s.src = SOURCES.moteur;
      s.onload = function () { if (global.fusibleLoad) ok(); else ko(new Error("le moteur ne s'est pas déclaré")); };
      s.onerror = function () { promesseScript = null; s.parentNode.removeChild(s); ko(new Error(SOURCES.moteur + " : injoignable")); };
      global.document.head.appendChild(s);
    });
    return promesseScript;
  }
  // l'accueil posé et la page chargée, le moteur arrive sans se faire attendre ; sur un
  // réseau lent, les images de l'accueil retardent `load` : deux secondes après l'accueil, il
  // part de toute façon (une histoire touchée le demande aussitôt, s'il n'est pas là)
  if (dansLaPage && SOURCES.moteur) {
    var avance = function () { scriptMoteur().catch(function () {}); };
    apresAccueil(avance, 600);
    promesseCommun.then(function () { global.setTimeout(avance, 2000); }, function () {});
  }

  global.FusibleContenu = {
    /// La page démarre quand le commun est là (tout de suite s'il l'est déjà).
    pret: function (fn) {
      if (attente) attente.push(fn);
      else if (!erreurCommun) fn();
    },
    /// L'objet vivant : le commun, puis commun + le livre en cours (le même objet,
    /// ses listes remplacées à chaque fusion).
    contenu: function () { return vivant; },
    /// Les histoires de l'accueil, comme le moteur les rendait (`_postulatsJson`, preview.dart).
    postulats: function () {
      var roles = {};
      (vivant.roles || []).forEach(function (r) { roles[r.id] = r; });
      return (vivant.postulats || []).slice().sort(function (a, b) { return (a.index | 0) - (b.index | 0); }).map(function (p, i) {
        return {
          index: i, id: p.id, title: p.title, question: p.question == null ? "" : p.question, role: p.role,
          roleName: (roles[p.role] && roles[p.role].name) || p.role, division: p.division == null ? 2 : p.division,
          year: p.year == null ? 1990 : p.year, pitch: p.pitch == null ? "" : p.pitch, chantier: p.chantier === true
        };
      });
    },
    /// Le livre est-il fusionné, et le moteur l'a-t-il lu ?
    charge: function (postulat) { var id = idDe(postulat); return moteurCharge && (!id || courant === id); },
    courant: function () { return courant; },
    /// Charge, décompresse et fusionne le livre, puis le moteur relit le contenu.
    /// Rend une promesse ; les abonnés (`apresFusion`) sont prévenus avant.
    livre: function (postulat) {
      return promesseCommun.then(function () {
        var id = idDe(postulat);
        if (moteurCharge && courant === id) return vivant;
        // le temps que le livre arrive : la mèche court en haut de l'écran (body.charge-livre)
        var corps = global.document.body;
        corps.classList.add("charge-livre");
        var fin = function (x) { corps.classList.remove("charge-livre"); return x; };
        return Promise.all([id ? brut(id) : Promise.resolve(null), scriptMoteur()]).then(function (r) {
          var l = r[0];
          // la fusion et la lecture du moteur tiennent le fil un moment : la mèche est peinte d'abord
          return new Promise(function (ok) {
            (global.requestAnimationFrame || global.setTimeout)(function () { global.setTimeout(function () { ok(l); }, 0); });
          });
        }).then(function (l) {
          if (!(moteurCharge && courant === id)) {
            fusionner(l);
            courant = id;
            chargerMoteur();
            ecoutes.forEach(function (f) { try { f(vivant, id); } catch (e) { if (global.console) console.error("apresFusion", e); } });
          }
          return fin(vivant);
        }, function (e) { fin(); throw e; });
      });
    },
    /// Décompresser un livre d'avance (une partie à reprendre, une cartouche touchée),
    /// sans fusionner ; `delai` (ms) laisse d'abord l'accueil se poser.
    prechauffer: function (postulat, delai) {
      promesseCommun.then(function () {
        global.setTimeout(function () { var id = idDe(postulat); if (id && id !== courant) brut(id).catch(function () {}); }, delai || 0);
      });
    },
    apresFusion: function (fn) { ecoutes.push(fn); },
    // le banc d'essai (assemble.js, les tests) : la fusion seule, et l'inflate de secours
    _fusionner: function (commun, livre) {
      var avant = { v: vivant, d: descr, p: pristines };
      pristines = {}; preparer(JSON.stringify(commun)); fusionner(livre);
      var r = vivant;
      vivant = avant.v; descr = avant.d; pristines = avant.p;
      return r;
    },
    _degzip: degzipJs
  };
  if (typeof module === "object" && module.exports) module.exports = global.FusibleContenu;
})(typeof window !== "undefined" ? window : this);
