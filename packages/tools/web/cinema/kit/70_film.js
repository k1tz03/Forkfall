/* ═══════════════════════════════════════════════════════════════════════════
   LA TROUSSE DU CINÉMA — 70 : le film (la ligne de temps).

   Un film se déclare (cinema/films/<id>.js) :
     FusibleCinema.film({
       id, livre, titre, duree, musique, secours, couleur, affiche (le temps de l'affiche),
       habillage: { vignette, grain, ratioPaysage, ratioPortrait },
       sons: [[t, 'porte'], …],                       // les bruits (audio.js)
       textes: [{ sorte: 'lieu'|'replique'|'titre', de, a, texte, sous, qui }],
       montages: { court: [[de, a], …] },             // la coupe de 30 s (l'App Store)
       sortie: { noir: 1.2 },                         // le fondu de la fin
       preparer: function (K, ctx) → Promise|void     // bâtit ctx.decors[nom] = { scene, maj(t, ctx), look }
       plans: [{ de, a, decor, entree: 'coupe'|'noir'|'fondu'|'flash', transition: 0.8,
                 camera: { pos, cible, fov, roulis, epaule, frequence },
                 cadrage: { portrait: { x, y }, paysage: { x, y } },
                 look: { bloom, exposition, contraste, saturation },
                 maj: function (local, p, ctx) {}, fixe: 2.5 }]
     });
   Tout se lit au temps `t` : K.Film(def, o).rendre(t, aspect) dessine l'image de t,
   quelle que soit celle d'avant.

   LE CADRE. La caméra filme un carré (l'image maîtresse) : `fov` est l'angle du carré,
   en hauteur comme en largeur. Chaque format en montre une fenêtre — le paysage 16:9
   toute la largeur et le milieu en hauteur, le portrait 9:16 toute la hauteur et le
   milieu en largeur — que `cadrage` déplace plan par plan (x, y de -1 à 1). Le
   tournage rend le carré une fois et y découpe tous les formats ; le jeu rend
   directement la fenêtre de l'écran (camera.setViewOffset) : la même image.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var K = global.FusibleCinema.kit;
  var T = K.T;

  // la fenêtre d'un format dans le carré : [x, y, l, h] en fractions du carré
  function fenetre(aspect, cad) {
    var w = aspect >= 1 ? 1 : aspect, h = aspect >= 1 ? 1 / aspect : 1;
    var ox = cad && cad.x != null ? cad.x : 0, oy = cad && cad.y != null ? cad.y : 0;
    return [(1 - w) / 2 * (1 + K.borne(ox, -1, 1)), (1 - h) / 2 * (1 - K.borne(oy, -1, 1)), w, h];
  }

  function Film(def, o) {
    o = o || {};
    var THREE = T();
    var F = { def: def, duree: def.duree, couleur: def.couleur || K.LIVRES[def.livre] || "#FF5A4E", plans: def.plans.slice(), sons: (def.sons || []).slice().sort(function (a, b) { return a[0] - b[0]; }) };
    var q = K.QUALITES[o.qualite] || K.QUALITES.moyenne;
    K.qualite = q;
    K.qualiteTextures = q.textures;
    var rendu = null, camera = new THREE.PerspectiveCamera(45, 1, 0.05, 900), cameraB = new THREE.PerspectiveCamera(45, 1, 0.05, 900);
    var ctx = { K: K, THREE: THREE, heros: o.heros || { nom: "Ravenel", genre: "m" }, couleur: F.couleur, qualite: q, decors: {}, film: F, camera: camera, t: 0,
      alea: K.alea("film|" + def.id), tournage: !!o.tournage };
    F.ctx = ctx;

    F.preparer = function () {
      rendu = K.look.Rendu({ canvas: o.canvas, largeur: o.largeur, hauteur: o.hauteur, qualite: q.nom, tournage: o.tournage });
      ctx.rendu = rendu;
      var t0 = Date.now();
      return Promise.resolve(def.preparer ? def.preparer(K, ctx) : null).then(function () {
        // les shaders se compilent maintenant, et chaque décor monte ses textures, pas au milieu
        // d'un plan ; un décor par tâche, pour que la page réponde entre deux (« Passer »)
        return K.etapes(ctx, Object.keys(ctx.decors).map(function (n) {
          return function () {
            var d = ctx.decors[n];
            if (d.maj) d.maj(0, ctx);
            rendu.compiler(d.scene, camera);
          };
        }));
      }).then(function () {
        F.rendu = rendu;
        F.preparation = Date.now() - t0;
        return F;
      });
    };
    // un film qu'on passe pendant qu'il se prépare : les étapes qui restent ne se font pas
    F.annuler = function () { ctx.annule = true; };

    // le plan à t (le dernier tient jusqu'à la fin)
    F.indice = function (t) {
      var P = F.plans, i = 0;
      while (i < P.length - 1 && t >= P[i + 1].de) i++;
      return i;
    };
    function local(i, t) { return t - F.plans[i].de; }
    function progres(i, t) { var p = F.plans[i]; return K.borne((t - p.de) / Math.max(1e-6, p.a - p.de), 0, 1); }

    // la caméra d'un plan à t
    function poserCamera(cam, i, t) {
      var p = F.plans[i], c = p.camera || {}, l = local(i, t), pr = progres(i, t);
      var lire = function (v, def0) { if (v == null) return def0; return typeof v === "function" ? v(l, pr, ctx) : v; };
      var pos = lire(c.pos, [0, 1.6, 6]), cible = lire(c.cible, [0, 1.4, 0]);
      cam.fov = lire(c.fov, 45);
      cam.position.set(pos[0], pos[1], pos[2]);
      cam.up.set(0, 1, 0);
      cam.lookAt(cible[0], cible[1], cible[2]);
      var ep = lire(c.epaule, 0);
      if (ep) {
        var e = K.epaule(t, K.hash(def.id + "|" + i) % 997, c.frequence || 1);
        cam.position.x += e.x * ep * 10; cam.position.y += e.y * ep * 10; cam.position.z += e.z * ep * 10;
        cam.rotateX(e.rx * ep); cam.rotateY(e.ry * ep); cam.rotateZ(e.rz * ep);
      }
      var ro = lire(c.roulis, 0);
      if (ro) cam.rotateZ(ro);
      cam.near = lire(c.pres, 0.05); cam.far = lire(c.loin, 900);
      cam.aspect = 1;
    }
    function cadrageDe(i, t, aspect) {
      var p = F.plans[i], c = p.cadrage && (aspect >= 1 ? p.cadrage.paysage : p.cadrage.portrait);
      if (!c) return null;
      var l = local(i, t), pr = progres(i, t);
      return { x: typeof c.x === "function" ? c.x(l, pr) : c.x, y: typeof c.y === "function" ? c.y(l, pr) : c.y };
    }
    F.fenetre = function (t, aspect) { return fenetre(aspect, cadrageDe(F.indice(t), t, aspect)); };
    function appliquerFenetre(cam, i, t, aspect) {
      if (!aspect || Math.abs(aspect - 1) < 1e-3) { cam.clearViewOffset(); cam.updateProjectionMatrix(); return; }
      var f = fenetre(aspect, cadrageDe(i, t, aspect)), N = 10000;
      cam.setViewOffset(N, N, f[0] * N, f[1] * N, f[2] * N, f[3] * N);
      cam.updateProjectionMatrix();
    }
    // le fondu enchaîné en cours à t : { de: i-1, vers: i, mix } ou null
    function fondu(t) {
      for (var i = 1; i < F.plans.length; i++) {
        var p = F.plans[i];
        if (p.entree !== "fondu" || (q.bloom === 0 && q.nom === "basse")) continue;
        var d = p.transition || 0.9;
        if (Math.abs(t - p.de) < d / 2) return { de: i - 1, vers: i, mix: K.lisse(p.de - d / 2, p.de + d / 2, t) };
      }
      return null;
    }
    F.fondu = fondu;
    // le noir à t (les fondus au noir, l'ouverture, la fin) ; l'éclair à t
    F.noir = function (t) {
      var n = 0;
      F.plans.forEach(function (p, i) {
        var e = p.entree || (i === 0 ? "noir" : "coupe"), d = p.transition || (i === 0 ? 1.2 : 0.8);
        if (e === "noir" || (e === "fondu" && q.nom === "basse")) n = Math.max(n, i === 0 ? 1 - K.lisse(0, d, t - p.de) : 1 - K.lisse(0, d / 2, Math.abs(t - p.de)));
      });
      var s = def.sortie && def.sortie.noir != null ? def.sortie.noir : 1.0;
      n = Math.max(n, K.lisse(F.duree - s, F.duree, t));
      return n;
    };
    F.flash = function (t) {
      var f = 0;
      F.plans.forEach(function (p) {
        if (p.entree !== "flash") return;
        var dt = t - p.de;
        if (dt > -0.06 && dt < 0.6) f = Math.max(f, dt < 0 ? 1 + dt / 0.06 : Math.exp(-dt / 0.11));
      });
      return f;
    };

    // l'image de t ; aspect : celui de l'écran (1 : le carré du tournage)
    F.rendre = function (t, aspect) {
      ctx.t = t;
      var i = F.indice(t), fd = fondu(t), p = F.plans[i];
      if (fd) { i = fd.vers; p = F.plans[i]; }
      var d = ctx.decors[p.decor];
      if (!d) throw new Error("film " + def.id + " : décor « " + p.decor + " » inconnu");
      poserCamera(camera, i, t);
      appliquerFenetre(camera, i, t, aspect);
      ctx.camera = camera; ctx.plan = p; ctx.indice = i;
      if (d.maj) d.maj(t, ctx);
      if (p.maj) p.maj(local(i, t), progres(i, t), ctx);
      rendu.regler(Object.assign({}, d.look || {}, p.look || {}));
      var autre = null;
      if (fd) {
        var pb = F.plans[fd.de], db = ctx.decors[pb.decor];
        poserCamera(cameraB, fd.de, t);
        appliquerFenetre(cameraB, fd.de, t, aspect);
        if (db !== d) { ctx.camera = cameraB; if (db.maj) db.maj(t, ctx); ctx.camera = camera; }
        if (pb.maj) pb.maj(local(fd.de, t), progres(fd.de, t), ctx);
        autre = { scene: db.scene, camera: cameraB, mix: fd.mix };
        // un même décor des deux côtés : on remet l'état du plan entrant
        if (db === d) { if (d.maj) d.maj(t, ctx); if (p.maj) p.maj(local(i, t), progres(i, t), ctx); }
      }
      rendu.rendre(d.scene, camera, autre);
    };

    // l'état de l'habillage à t (bandes, vignettage, textes, noir, éclair)
    F.etat = function (t) {
      var h = def.habillage || {};
      return {
        t: t, couleur: F.couleur, noir: F.noir(t), flash: F.flash(t), flashCouleur: h.flashCouleur || "#FFF4E0",
        vignette: h.vignette == null ? 0.55 : h.vignette, ratioPaysage: h.ratioPaysage || 2.35, ratioPortrait: h.ratioPortrait || 0,
        barres: h.barres == null ? 1 : h.barres,
        textes: (def.textes || []).filter(function (x) { return t >= x.de && t <= x.a; })
      };
    };
    F.grain = (def.habillage && def.habillage.grain != null) ? def.habillage.grain : 0.07;
    // les temps des images fixes (le mouvement réduit) : une par plan
    F.fixes = function () {
      return F.plans.map(function (p) { return { de: p.de, a: p.a, t: p.de + (p.fixe != null ? p.fixe : (p.a - p.de) * 0.55) }; });
    };
    F.taille = function (w, h) { if (rendu) rendu.taille(w, h); };
    F.info = function () { return rendu ? rendu.info() : null; };
    // la mémoire des textures du film (une estimation : RGBA 8 bits, les mipmaps comptés,
    // les cartes d'environnement en demi-flottants) → { textures, octets }
    F.memoire = function () {
      var vues = [], octets = 0, parNom = {};
      function compter(tx) {
        // une texture clonée (une répétition) garde sa source : la carte graphique ne la monte qu'une fois
        var cle = tx && (tx.source || tx);
        if (!tx || vues.indexOf(cle) >= 0) return;
        vues.push(cle);
        var im = tx.image || {}, w = im.width || 0, h = im.height || 0;
        if (tx.isRenderTargetTexture || tx.isCubeTexture) { w = w || 256; h = h || 256; }
        var bpp = tx.type === THREE.HalfFloatType ? 8 : tx.type === THREE.FloatType ? 16 : 4;
        var o = w * h * bpp * (tx.generateMipmaps === false ? 1 : 4 / 3);
        octets += o;
        var nom = tx.name || (tx.isRenderTargetTexture ? "environnement" : "autre");
        parNom[nom] = (parNom[nom] || 0) + o;
      }
      Object.keys(ctx.decors).forEach(function (n) {
        var sc = ctx.decors[n].scene;
        if (sc.environment) compter(sc.environment);
        sc.traverse(function (o) {
          var ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
          ms.forEach(function (m) {
            ["map", "roughnessMap", "bumpMap", "normalMap", "emissiveMap", "alphaMap", "metalnessMap", "aoMap"].forEach(function (k) { compter(m[k]); });
            if (m.uniforms) Object.keys(m.uniforms).forEach(function (k) { var v = m.uniforms[k].value; if (v && v.isTexture) compter(v); });
          });
          if (o.isLight && o.map) compter(o.map);
        });
      });
      var noms = Object.keys(parNom).sort(function (a, b) { return parNom[b] - parNom[a]; });
      return { textures: vues.length, octets: Math.round(octets), parNom: noms.map(function (n) { return [n, Math.round(parNom[n] / 1024)]; }) };
    };
    F.detruire = function () {
      Object.keys(ctx.decors).forEach(function (n) { var d = ctx.decors[n]; if (d && d.detruire) try { d.detruire(); } catch (e) { /* rien */ } });
      if (rendu) rendu.detruire();
      K.liberer();
    };
    return F;
  }

  // des étapes, chacune dans sa tâche du navigateur : entre deux, la page respire (un clic sur
  // « Passer » est entendu, l'écran se redessine). Un film bâtit ses décors ainsi :
  //   return K.etapes(ctx, [function () { ctx.decors.rue = rue(K, ctx); }, …]);
  // Si le film est annulé (ctx.annule), les étapes suivantes ne se font pas.
  function etapes(ctx, liste) {
    return (liste || []).reduce(function (p, fn) {
      return p.then(function () {
        return new Promise(function (ok, ko) {
          setTimeout(function () {
            if (ctx && ctx.annule) { ko(new Error("film annulé")); return; }
            try { ok(fn()); } catch (e) { ko(e); }
          }, 0);
        });
      });
    }, Promise.resolve());
  }

  // un décor : une scène, son ciel, son brouillard, son environnement (les reflets)
  //  o = { ciel: {…}, brouillard: [couleur, densite], environnement: {…} | false, fond: couleur }
  function decor(ctx, o) {
    o = o || {};
    var THREE = T(), s = new THREE.Scene();
    if (o.ciel !== false) s.add(K.look.ciel(o.ciel || {}));
    else s.background = new THREE.Color(o.fond || "#000000");
    if (o.brouillard) K.look.brouillard(s, o.brouillard[0], o.brouillard[1]);
    if (o.environnement !== false) {
      s.environment = K.look.environnement(ctx.rendu, Object.assign({}, o.ciel || {}, o.environnement || {}));
      s.environmentIntensity = o.reflets == null ? 1 : o.reflets;
    }
    if (o.ambiance) s.add(new THREE.HemisphereLight(o.ambiance[0], o.ambiance[1], o.ambiance[2] == null ? 0.3 : o.ambiance[2]));
    return s;
  }

  K.Film = Film;
  K.etapes = etapes;
  K.fenetre = fenetre;
  K.decor = decor;
})(typeof window !== "undefined" ? window : this);
