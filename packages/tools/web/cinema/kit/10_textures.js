/* ═══════════════════════════════════════════════════════════════════════════
   LA TROUSSE DU CINÉMA — 10 : les matières (textures procédurales).

   Aucun fichier image : tout est peint sur un canvas au chargement, puis
   gardé (une clé = une texture). Les matières se répètent sans couture (le
   bruit est périodique). Chaque matière rend ce qu'il faut à un matériau PBR :
   `map` (la couleur), `rugosite` (roughnessMap : les flaques brillent), `relief`
   (bumpMap : le joint est plus bas que la brique), parfois `lumiere`
   (emissiveMap : une fenêtre allumée).

     K.tex.brique(o)  K.tex.beton(o)  K.tex.asphalte(o)  K.tex.pelouse(o)
     K.tex.rouille(o) K.tex.bois(o)   K.tex.papier(o)    K.tex.tissu(o)
     K.tex.texte(o)   K.tex.fenetres(o)  K.tex.neon(o)   K.tex.ecran(o)
     K.tex.halo(o)    K.tex.fumee(o)  K.tex.goutte()
     K.tex.visage(o)  → Promise (art.js : un visage imprimé, noir sur blanc)
     K.tex.feuilleMasques(o), K.tex.cliche(o) (la plaque qui l'imprime, à l'envers),
     K.tex.photoEquipe(o), K.tex.tifo(o) → Promise
     K.mat.*          les matériaux qui vont avec

   La taille suit la qualité (K.qualiteTextures : 1 en haute, 0,5 sur un
   téléphone faible). Les noms écrits sur une matière sont inventés, toujours.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var K = global.FusibleCinema.kit;
  var T = K.T;
  K.qualiteTextures = 1;

  var CACHE = {};          // clé → valeur (texture, ou promesse)
  var CREES = [];          // tout ce qu'on a créé, pour tout rendre à la fin d'un film
  function garder(cle, fn) {
    if (CACHE[cle]) return CACHE[cle];
    var v = fn();
    CACHE[cle] = v;
    // le nom de chaque texture dit d'où elle vient (F.memoire les compte par nom)
    var nommer = function (r) { if (r && typeof r === "object") Object.keys(r).forEach(function (k) { if (r[k] && r[k].isTexture && !r[k].name) r[k].name = cle.split("|")[0] + "." + k; }); return r; };
    if (v && typeof v.then === "function") v.then(nommer, function () {}); else nommer(v);
    return v;
  }
  function taille(n) { return Math.max(64, Math.round(n * K.qualiteTextures / 16) * 16); }
  function canvas(w, h) {
    var c = global.document.createElement("canvas");
    c.width = w; c.height = h;
    return c;
  }
  // un canvas → une texture three, répétée, filtrée
  function texture(c, o) {
    var THREE = T();
    o = o || {};
    var tx = new THREE.CanvasTexture(c);
    tx.wrapS = tx.wrapT = o.clamp ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;
    tx.colorSpace = o.donnee ? THREE.NoColorSpace : THREE.SRGBColorSpace;
    tx.anisotropy = o.anisotropie || 8;
    if (o.repete) tx.repeat.set(o.repete[0], o.repete[1]);
    tx.needsUpdate = true;
    CREES.push(tx);
    return tx;
  }

  // ─── le bruit périodique en couches (Float32Array w×h dans [0, 1])
  function couche(w, h, o) {
    o = o || {};
    var out = new Float32Array(w * h), graine = K.hash(o.graine || "couche");
    var p0 = o.periode || 8, oct = o.octaves || 4, amp = 1, tot = 0, gain = o.gain || 0.5;
    for (var k = 0; k < oct; k++) {
      var px = Math.max(1, Math.round(p0 * Math.pow(2, k) * (o.rapportX || 1))), py = Math.max(1, Math.round(p0 * Math.pow(2, k)));
      var g = new Float32Array(px * py), r = K.alea(graine + k * 977);
      for (var i = 0; i < g.length; i++) g[i] = r();
      for (var y = 0; y < h; y++) {
        var fy = y / h * py, iy = Math.floor(fy), ty = fy - iy; ty = ty * ty * (3 - 2 * ty);
        var y0 = (iy % py) * px, y1 = ((iy + 1) % py) * px;
        for (var x = 0; x < w; x++) {
          var fx = x / w * px, ix = Math.floor(fx), tx = fx - ix; tx = tx * tx * (3 - 2 * tx);
          var x0 = ix % px, x1 = (ix + 1) % px;
          var a = g[y0 + x0] + (g[y0 + x1] - g[y0 + x0]) * tx, b = g[y1 + x0] + (g[y1 + x1] - g[y1 + x0]) * tx;
          out[y * w + x] += (a + (b - a) * ty) * amp;
        }
      }
      tot += amp; amp *= gain;
    }
    for (var j = 0; j < out.length; j++) out[j] /= tot;
    return out;
  }
  // une couche → un canvas en niveaux de gris (pour un relief, une rugosité)
  function grisDe(w, h, f) {
    var c = canvas(w, h), x = c.getContext("2d"), im = x.createImageData(w, h), d = im.data;
    for (var i = 0, j = 0; i < f.length; i++, j += 4) { var v = Math.max(0, Math.min(255, f[i] * 255)); d[j] = d[j + 1] = d[j + 2] = v; d[j + 3] = 255; }
    x.putImageData(im, 0, 0);
    return c;
  }
  function couleurs(c) { return K.rgb(c).map(function (v) { return v * 255; }); }
  // un pinceau de grain : des points fins, clairs et sombres, partout
  function grain(x, w, h, n, alpha, graine) {
    var r = K.alea(graine);
    for (var i = 0; i < n; i++) {
      var v = r() < 0.5 ? 0 : 255;
      x.fillStyle = "rgba(" + v + "," + v + "," + v + "," + (alpha * r()) + ")";
      var s = r() < 0.9 ? 1 : 2;
      x.fillRect(Math.floor(r() * w), Math.floor(r() * h), s, s);
    }
  }

  // ─── LA BRIQUE : rangs décalés, joints en retrait, chaque brique sa teinte,
  // des épaufrures, la suie qui descend et l'humidité qui remonte
  function brique(o) {
    o = o || {};
    var cle = "brique|" + JSON.stringify(o);
    return garder(cle, function () {
      var W = taille(o.taille || 1024), H = W, rangs = o.rangs || 18, parRang = o.parRang || 4, j = Math.max(2, Math.round(W / 220));
      var r = K.alea(o.graine || "brique"), base = couleurs(o.couleur || "#7D3A2A"), joint = couleurs(o.joint || "#77706a");
      var cc = canvas(W, H), x = cc.getContext("2d"), hc = canvas(W, H), hx = hc.getContext("2d"), rc = canvas(W, H), rx = rc.getContext("2d");
      x.fillStyle = "rgb(" + joint.join(",") + ")"; x.fillRect(0, 0, W, H);
      hx.fillStyle = "#3a3a3a"; hx.fillRect(0, 0, W, H);
      rx.fillStyle = "#f0f0f0"; rx.fillRect(0, 0, W, H);
      var bh = H / rangs, bw = W / parRang;
      for (var ry = 0; ry < rangs; ry++) {
        var dec = ry % 2 ? bw / 2 : 0;
        for (var bx = -1; bx <= parRang; bx++) {
          var X0 = bx * bw + dec + j / 2, Y0 = ry * bh + j / 2, ww = bw - j, hh = bh - j;
          var k = 0.78 + r() * 0.36, rouge = r() < 0.08 ? 0.75 : 1, brule = r() < 0.12;
          var cr = base[0] * k * rouge, cg = base[1] * k * (brule ? 0.82 : 1), cb = base[2] * k * (brule ? 0.8 : 1);
          x.fillStyle = "rgb(" + (cr | 0) + "," + (cg | 0) + "," + (cb | 0) + ")";
          x.fillRect(X0, Y0, ww, hh);
          // le haut de la brique, plus clair ; le bas, plus sombre (une lumière qui tombe)
          var gr = x.createLinearGradient(0, Y0, 0, Y0 + hh);
          gr.addColorStop(0, "rgba(255,230,210,0.10)"); gr.addColorStop(0.5, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0,0.16)");
          x.fillStyle = gr; x.fillRect(X0, Y0, ww, hh);
          var hv = 170 + (r() * 60 | 0);
          hx.fillStyle = "rgb(" + hv + "," + hv + "," + hv + ")"; hx.fillRect(X0, Y0, ww, hh);
          var rv = 190 + (r() * 40 | 0);
          rx.fillStyle = "rgb(" + rv + "," + rv + "," + rv + ")"; rx.fillRect(X0, Y0, ww, hh);
          // les épaufrures : des coins mangés, sur la couleur et dans le relief
          var ne = r() < 0.5 ? 1 + (r() * 3 | 0) : 0;
          for (var e = 0; e < ne; e++) {
            var ex = X0 + (r() < 0.5 ? 0 : ww) + (r() - 0.5) * 6, ey = Y0 + r() * hh, es = 2 + r() * bh * 0.25;
            x.fillStyle = "rgba(" + joint.map(function (v) { return v * 0.85 | 0; }).join(",") + ",0.9)";
            x.beginPath(); x.arc(ex, ey, es, 0, 7); x.fill();
            hx.fillStyle = "#555"; hx.beginPath(); hx.arc(ex, ey, es, 0, 7); hx.fill();
          }
        }
      }
      // le grain de la terre cuite et du mortier
      var n = couche(W, H, { periode: 32, octaves: 3, graine: (o.graine || "b") + "g" });
      var big = couche(W, H, { periode: 3, octaves: 3, graine: (o.graine || "b") + "s" });
      var im = x.getImageData(0, 0, W, H), d = im.data, ih = hx.getImageData(0, 0, W, H), dh = ih.data, ir = rx.getImageData(0, 0, W, H), dr = ir.data;
      var suie = o.suie == null ? 0.5 : o.suie, humide = o.humide == null ? 0.5 : o.humide;
      for (var p = 0, q = 0; p < n.length; p++, q += 4) {
        var yy = (p / W | 0) / H, g = (n[p] - 0.5) * 46, s = big[p];
        var sale = Math.max(0, (s - 0.45) * 2.2) * suie * (0.6 + 0.4 * (1 - yy));
        var hum = humide * K.lisse(0.55, 1.0, yy + (s - 0.5) * 0.3);
        var m = (1 - sale * 0.55) * (1 - hum * 0.35);
        d[q] = Math.max(0, Math.min(255, (d[q] + g) * m));
        d[q + 1] = Math.max(0, Math.min(255, (d[q + 1] + g) * m));
        d[q + 2] = Math.max(0, Math.min(255, (d[q + 2] + g * 0.9) * m));
        dh[q] = dh[q + 1] = dh[q + 2] = Math.max(0, Math.min(255, dh[q] + (n[p] - 0.5) * 50));
        var rv2 = dr[q] - hum * 120;
        dr[q] = dr[q + 1] = dr[q + 2] = Math.max(30, Math.min(255, rv2));
      }
      x.putImageData(im, 0, 0); hx.putImageData(ih, 0, 0); rx.putImageData(ir, 0, 0);
      grain(x, W, H, W * 8, 0.18, (o.graine || "b") + "p");
      return { map: texture(cc, o), relief: texture(hc, { donnee: true }), rugosite: texture(rc, { donnee: true }) };
    });
  }

  // ─── LE BÉTON : des banches, des coulures, des taches, des trous d'air
  function beton(o) {
    o = o || {};
    return garder("beton|" + JSON.stringify(o), function () {
      var W = taille(o.taille || 1024), H = W, base = couleurs(o.couleur || "#6E6A5E");
      var a = couche(W, H, { periode: 4, octaves: 5, graine: (o.graine || "beton") + "a" });
      var b = couche(W, H, { periode: 24, octaves: 3, graine: (o.graine || "beton") + "b" });
      var cc = canvas(W, H), x = cc.getContext("2d"), im = x.createImageData(W, H), d = im.data;
      var rc = canvas(W, H), rx = rc.getContext("2d"), ir = rx.createImageData(W, H), dr = ir.data;
      var banches = o.banches == null ? 4 : o.banches, taches = o.taches == null ? 0.6 : o.taches;
      for (var p = 0, q = 0; p < a.length; p++, q += 4) {
        var y = (p / W | 0), xx = p % W;
        var v = 0.82 + (a[p] - 0.5) * 0.5 + (b[p] - 0.5) * 0.18;
        // les banches : une ligne plus sombre à chaque coffrage, et la coulure qui en part
        if (banches) { var by = (y / H * banches) % 1; v *= 1 - 0.18 * K.cloche(0.0, 0.004, 0.012, 0.02, by); v *= 1 - 0.08 * Math.max(0, a[(p + W * 7) % a.length] - 0.62) * 4 * (1 - by); }
        var t = Math.max(0, a[p] - 0.6) * 2.4 * taches;
        v *= 1 - t * 0.5;
        d[q] = Math.min(255, base[0] * v); d[q + 1] = Math.min(255, base[1] * v); d[q + 2] = Math.min(255, base[2] * v); d[q + 3] = 255;
        var rr = 225 - t * 160 - (xx % 97 === 0 ? 0 : 0);
        dr[q] = dr[q + 1] = dr[q + 2] = Math.max(40, rr); dr[q + 3] = 255;
      }
      x.putImageData(im, 0, 0); rx.putImageData(ir, 0, 0);
      // les trous d'air
      var r = K.alea((o.graine || "beton") + "t");
      for (var i = 0; i < W * 0.9; i++) { x.fillStyle = "rgba(20,18,16," + (0.2 + r() * 0.4) + ")"; x.beginPath(); x.arc(r() * W, r() * H, 0.6 + r() * 1.8, 0, 7); x.fill(); }
      grain(x, W, H, W * 10, 0.16, (o.graine || "beton") + "g");
      var rel = grisDe(W, H, a);
      return { map: texture(cc, o), relief: texture(rel, { donnee: true }), rugosite: texture(rc, { donnee: true }) };
    });
  }

  // ─── L'ASPHALTE MOUILLÉ : le gravillon, les fissures, les reprises, et les
  // flaques (la rugosité tombe à presque rien : c'est là que la ville se reflète)
  function asphalte(o) {
    o = o || {};
    return garder("asphalte|" + JSON.stringify(o), function () {
      var W = taille(o.taille || 1024), H = W, g = o.graine || "asphalte";
      var a = couche(W, H, { periode: 3, octaves: 5, graine: g + "a" });
      var f = couche(W, H, { periode: 2, octaves: 4, graine: g + "f" });
      var cc = canvas(W, H), x = cc.getContext("2d"), im = x.createImageData(W, H), d = im.data;
      var rc = canvas(W, H), rx = rc.getContext("2d"), ir = rx.createImageData(W, H), dr = ir.data;
      var mc = canvas(W, H), mx = mc.getContext("2d"), imm = mx.createImageData(W, H), dm = imm.data;
      var seuil = 1 - (o.flaques == null ? 0.35 : o.flaques) * 0.5, r = K.alea(g + "r");
      for (var p = 0, q = 0; p < a.length; p++, q += 4) {
        var fl = K.lisse(seuil, seuil + 0.05, f[p]);
        var bord = K.cloche(seuil - 0.04, seuil, seuil + 0.02, seuil + 0.06, f[p]);
        var v = 0.17 + (a[p] - 0.5) * 0.08 + (r() < 0.06 ? r() * 0.12 : 0);
        v *= 1 - fl * 0.45;
        d[q] = 255 * v * 0.95; d[q + 1] = 255 * v * 0.97; d[q + 2] = 255 * v * 1.06; d[q + 3] = 255;
        var ru = 0.62 + (a[p] - 0.5) * 0.3;
        ru = ru * (1 - fl) + 0.03 * fl + bord * 0.1;
        dr[q] = dr[q + 1] = dr[q + 2] = Math.max(0, Math.min(255, ru * 255)); dr[q + 3] = 255;
        dm[q] = dm[q + 1] = dm[q + 2] = fl * 255; dm[q + 3] = 255;
      }
      x.putImageData(im, 0, 0); rx.putImageData(ir, 0, 0); mx.putImageData(imm, 0, 0);
      // les fissures : des marches au hasard, fines et sombres
      var rf = K.alea(g + "fissures");
      x.strokeStyle = "rgba(6,6,8,0.55)"; x.lineWidth = Math.max(1, W / 900);
      for (var k = 0; k < 9; k++) {
        var cx = rf() * W, cy = rf() * H, ang = rf() * 6.28;
        x.beginPath(); x.moveTo(cx, cy);
        for (var s = 0; s < 40; s++) { ang += (rf() - 0.5) * 0.9; cx += Math.cos(ang) * W / 160; cy += Math.sin(ang) * W / 160; x.lineTo(cx, cy); }
        x.stroke();
      }
      // une reprise de chaussée, plus noire, et la peinture d'une ligne usée
      if (o.reprise !== false) { x.fillStyle = "rgba(8,8,10,0.35)"; x.fillRect(W * 0.62, 0, W * 0.16, H); }
      if (o.ligne) {
        for (var yl = 0; yl < H; yl += H / 4) {
          x.fillStyle = "rgba(225,220,200,0.55)"; x.fillRect(W * 0.5 - W / 120, yl, W / 60, H / 7);
        }
      }
      grain(x, W, H, W * 14, 0.22, g + "g");
      return { map: texture(cc, o), rugosite: texture(rc, { donnee: true }), flaques: texture(mc, { donnee: true }), relief: texture(grisDe(W, H, a), { donnee: true }) };
    });
  }

  // ─── LA PELOUSE : les bandes de la tondeuse, le brin, les lignes de craie usées
  function pelouse(o) {
    o = o || {};
    return garder("pelouse|" + JSON.stringify(o), function () {
      var W = taille(o.taille || 1024), H = W, g = o.graine || "pelouse", bandes = o.bandes || 8;
      var a = couche(W, H, { periode: 6, octaves: 4, graine: g + "a" });
      var fin = couche(W, H, { periode: 96, octaves: 2, graine: g + "f", rapportX: 0.25 });
      var cc = canvas(W, H), x = cc.getContext("2d"), im = x.createImageData(W, H), d = im.data;
      var base = couleurs(o.couleur || "#2B5E2E");
      for (var p = 0, q = 0; p < a.length; p++, q += 4) {
        var xx = p % W, b = Math.floor(xx / W * bandes) % 2;
        var v = (b ? 1.12 : 0.88) * (0.85 + (a[p] - 0.5) * 0.4) * (0.82 + fin[p] * 0.36);
        var boue = o.boue ? Math.max(0, a[p] - 0.72) * 3 * o.boue : 0;
        d[q] = base[0] * v * (1 - boue) + 70 * boue; d[q + 1] = base[1] * v * (1 - boue) + 52 * boue; d[q + 2] = base[2] * v * (1 - boue) + 32 * boue; d[q + 3] = 255;
      }
      x.putImageData(im, 0, 0);
      if (o.lignes) {
        x.strokeStyle = "rgba(235,232,215,0.82)"; x.lineWidth = W / 140;
        x.strokeRect(W * 0.04, H * 0.04, W * 0.92, H * 0.92);
        x.beginPath(); x.moveTo(W * 0.5, H * 0.04); x.lineTo(W * 0.5, H * 0.96); x.stroke();
        x.beginPath(); x.arc(W * 0.5, H * 0.5, W * 0.12, 0, 7); x.stroke();
      }
      grain(x, W, H, W * 12, 0.12, g + "g");
      return { map: texture(cc, o), rugosite: texture(grisDe(W, H, a.map(function (v) { return 0.55 + v * 0.3; })), { donnee: true }) };
    });
  }

  // ─── LA ROUILLE : une peinture qui cède, des coulures orange
  function rouille(o) {
    o = o || {};
    return garder("rouille|" + JSON.stringify(o), function () {
      var W = taille(o.taille || 512), H = W, g = o.graine || "rouille";
      var a = couche(W, H, { periode: 5, octaves: 5, graine: g + "a" }), peinture = couleurs(o.peinture || "#3E4A4C");
      var cc = canvas(W, H), x = cc.getContext("2d"), im = x.createImageData(W, H), d = im.data;
      var rc = canvas(W, H), rx = rc.getContext("2d"), ir = rx.createImageData(W, H), dr = ir.data;
      var part = o.part == null ? 0.3 : o.part;
      for (var p = 0, q = 0; p < a.length; p++, q += 4) {
        var y = (p / W | 0) / H, ru = K.lisse(1 - part, 1 - part + 0.12, a[p] + y * 0.15);
        var or = [120 + a[p] * 70, 58 + a[p] * 30, 28];
        d[q] = peinture[0] * (1 - ru) + or[0] * ru; d[q + 1] = peinture[1] * (1 - ru) + or[1] * ru; d[q + 2] = peinture[2] * (1 - ru) + or[2] * ru; d[q + 3] = 255;
        dr[q] = dr[q + 1] = dr[q + 2] = 120 + ru * 120; dr[q + 3] = 255;
      }
      x.putImageData(im, 0, 0); rx.putImageData(ir, 0, 0);
      grain(x, W, H, W * 6, 0.2, g + "g");
      return { map: texture(cc, o), rugosite: texture(rc, { donnee: true }), relief: texture(grisDe(W, H, a), { donnee: true }) };
    });
  }

  // ─── LE BOIS : des lames, le fil, les nœuds ; clair, sombre ou ciré
  function bois(o) {
    o = o || {};
    return garder("bois|" + JSON.stringify(o), function () {
      var W = taille(o.taille || 512), H = W, g = o.graine || "bois", lames = o.lames || 5, base = couleurs(o.couleur || "#6B4325");
      var fil = couche(W, H, { periode: 4, octaves: 4, graine: g + "f", rapportX: 12 });
      var cc = canvas(W, H), x = cc.getContext("2d"), im = x.createImageData(W, H), d = im.data, r = K.alea(g);
      var teintes = []; for (var l = 0; l < lames; l++) teintes.push(0.82 + r() * 0.3);
      for (var p = 0, q = 0; p < fil.length; p++, q += 4) {
        var xx = p % W, y = p / W | 0, li = Math.floor(xx / W * lames), lx = (xx / W * lames) % 1;
        var veine = 0.5 + 0.5 * Math.sin((fil[p] * 9 + y / H * 3 + li * 1.7) * 6.28);
        var v = teintes[li] * (0.8 + veine * 0.28) * (lx < 0.012 || lx > 0.988 ? 0.45 : 1);
        d[q] = base[0] * v; d[q + 1] = base[1] * v; d[q + 2] = base[2] * v; d[q + 3] = 255;
      }
      x.putImageData(im, 0, 0);
      for (var n = 0; n < lames * 1.5; n++) {
        var nx = (r() * lames | 0) / lames * W + W / lames * (0.3 + r() * 0.4), ny = r() * H;
        var gr = x.createRadialGradient(nx, ny, 0, nx, ny, W / 50);
        gr.addColorStop(0, "rgba(30,15,6,0.7)"); gr.addColorStop(1, "rgba(30,15,6,0)");
        x.fillStyle = gr; x.beginPath(); x.ellipse(nx, ny, W / 70, W / 30, 0, 0, 7); x.fill();
      }
      grain(x, W, H, W * 4, 0.1, g + "g");
      return { map: texture(cc, o), relief: texture(grisDe(W, H, fil), { donnee: true }), rugosite: texture(grisDe(W, H, fil.map(function (v) { return (o.cire ? 0.25 : 0.62) + v * 0.2; })), { donnee: true }) };
    });
  }

  // ─── LE PAPIER ET LE CARTON : des fibres, un blanc cassé qui n'est jamais blanc
  function papier(o) {
    o = o || {};
    return garder("papier|" + JSON.stringify(o), function () {
      var W = taille(o.taille || 512), H = W, g = o.graine || "papier", base = couleurs(o.couleur || "#EDE6D3");
      var a = couche(W, H, { periode: 8, octaves: 4, graine: g });
      var cc = canvas(W, H), x = cc.getContext("2d"), im = x.createImageData(W, H), d = im.data;
      for (var p = 0, q = 0; p < a.length; p++, q += 4) {
        var v = 0.93 + (a[p] - 0.5) * 0.12;
        d[q] = base[0] * v; d[q + 1] = base[1] * v; d[q + 2] = base[2] * v; d[q + 3] = 255;
      }
      x.putImageData(im, 0, 0);
      var r = K.alea(g + "f");
      x.lineWidth = 0.6;
      for (var i = 0; i < W * 1.2; i++) {
        var fx = r() * W, fy = r() * H, an = r() * 6.28, lo = 3 + r() * 10;
        x.strokeStyle = r() < 0.5 ? "rgba(255,255,255,0.35)" : "rgba(120,100,70,0.18)";
        x.beginPath(); x.moveTo(fx, fy); x.quadraticCurveTo(fx + Math.cos(an + 0.6) * lo * 0.5, fy + Math.sin(an + 0.6) * lo * 0.5, fx + Math.cos(an) * lo, fy + Math.sin(an) * lo); x.stroke();
      }
      return { map: texture(cc, o), relief: texture(grisDe(W, H, a), { donnee: true }), canvas: cc };
    });
  }

  // ─── LE TISSU : la trame d'une bâche, d'un tifo, d'un rideau
  function tissu(o) {
    o = o || {};
    return garder("tissu|" + JSON.stringify(o), function () {
      var W = taille(o.taille || 256), H = W, pas = Math.max(2, Math.round(W / (o.fils || 96)));
      var c = canvas(W, H), x = c.getContext("2d");
      x.fillStyle = "#808080"; x.fillRect(0, 0, W, H);
      for (var y = 0; y < H; y += pas) for (var xx = 0; xx < W; xx += pas) {
        var on = ((xx / pas) + (y / pas)) % 2 === 0;
        x.fillStyle = on ? "#a0a0a0" : "#5a5a5a"; x.fillRect(xx, y, pas, pas);
      }
      return { relief: texture(c, { donnee: true, repete: o.repete }) };
    });
  }

  // ─── LE TEXTE PEINT OU IMPRIMÉ : une enseigne, une affiche, une plaque
  //  o = { lignes: ['CARTONNAGES', 'DE LA RIVE'], largeur, hauteur, fond, encre,
  //        police, graisse, interligne, peint (l'écaille, la main qui tremble), graine }
  function texte(o) {
    o = o || {};
    return garder("texte|" + JSON.stringify(o), function () {
      var W = taille(o.largeur || 1024), H = taille(o.hauteur || 256), r = K.alea(o.graine || "texte");
      var c = canvas(W, H), x = c.getContext("2d");
      if (o.fond) { x.fillStyle = o.fond; x.fillRect(0, 0, W, H); }
      var lignes = o.lignes || [""], n = lignes.length, inter = o.interligne || 1.12;
      var t = o.taille ? o.taille * W : H / (n * inter) * 0.86;
      var police = o.police || '"Space Mono","DejaVu Sans Mono",monospace', graisse = o.graisse || "700";
      x.textBaseline = "middle"; x.textAlign = "center";
      for (var i = 0; i < n; i++) {
        var y = H / 2 + (i - (n - 1) / 2) * t * inter, s = lignes[i], tt = t;
        x.font = graisse + " " + tt + "px " + police;
        var lw = x.measureText(s).width;
        if (lw > W * 0.94) { tt *= W * 0.94 / lw; x.font = graisse + " " + tt + "px " + police; lw = x.measureText(s).width; }
        if (!o.peint) { x.fillStyle = o.encre || "#111"; x.fillText(s, W / 2, y); continue; }
        // peint à la main : chaque lettre un peu à côté, un peu de travers
        var x0 = W / 2 - lw / 2;
        x.textAlign = "left";
        for (var k = 0; k < s.length; k++) {
          var ch = s[k], cw = x.measureText(ch).width;
          x.save();
          x.translate(x0 + cw / 2, y + (r() - 0.5) * tt * 0.05);
          x.rotate((r() - 0.5) * 0.05);
          x.fillStyle = o.encre || "#EFE7D2";
          x.fillText(ch, -cw / 2, 0);
          x.restore();
          x0 += cw;
        }
        x.textAlign = "center";
      }
      if (o.peint) {
        // l'écaille : la peinture partie par plaques
        x.globalCompositeOperation = "destination-out";
        for (var e = 0; e < W * 0.6; e++) { x.fillStyle = "rgba(0,0,0," + (0.3 + r() * 0.7) + ")"; x.beginPath(); x.arc(r() * W, r() * H, 0.5 + r() * W / 260, 0, 7); x.fill(); }
        x.globalCompositeOperation = "source-over";
      }
      return { map: texture(c, { clamp: true }), canvas: c };
    });
  }

  // ─── LES FENÊTRES : une façade la nuit (couleur + lumière émise)
  //  o = { colonnes, rangees, allumees (0..1), largeur, hauteur, mur, teintes, graine }
  function fenetres(o) {
    o = o || {};
    return garder("fenetres|" + JSON.stringify(o), function () {
      var W = taille(o.largeur || 512), H = taille(o.hauteur || 512), co = o.colonnes || 4, ra = o.rangees || 4, r = K.alea(o.graine || "fen");
      var c = canvas(W, H), x = c.getContext("2d"), l = canvas(W, H), lx = l.getContext("2d");
      x.fillStyle = o.mur || "#2a2522"; x.fillRect(0, 0, W, H);
      lx.fillStyle = "#000"; lx.fillRect(0, 0, W, H);
      var teintes = o.teintes || ["#FFC27A", "#FFD49A", "#FFB36B", "#9FC4FF", "#FFE7C2"];
      var fw = W / co, fh = H / ra;
      for (var j = 0; j < ra; j++) for (var i = 0; i < co; i++) {
        var X = i * fw + fw * 0.2, Y = j * fh + fh * 0.18, w = fw * 0.6, h = fh * 0.58;
        x.fillStyle = "#0b0c10"; x.fillRect(X, Y, w, h);
        x.fillStyle = "rgba(255,255,255,0.05)"; x.fillRect(X, Y + h, w, fh * 0.05);
        if (r() < (o.allumees == null ? 0.35 : o.allumees)) {
          var tnt = r.choix(teintes), k = 0.45 + r() * 0.55;
          var gr = lx.createLinearGradient(X, Y, X, Y + h);
          gr.addColorStop(0, K.css(tnt, k)); gr.addColorStop(1, K.css(tnt, k * 0.6));
          lx.fillStyle = gr; lx.fillRect(X, Y, w, h);
          x.fillStyle = K.css(tnt, 0.75); x.fillRect(X, Y, w, h);
          // un rideau tiré à moitié, une silhouette parfois
          if (r() < 0.5) { lx.fillStyle = "rgba(0,0,0,0.55)"; lx.fillRect(X + w * (r() < 0.5 ? 0 : 0.55), Y, w * 0.45, h); }
          if (r() < 0.15) { lx.fillStyle = "rgba(0,0,0,0.8)"; lx.beginPath(); lx.ellipse(X + w * 0.5, Y + h * 0.55, w * 0.12, h * 0.3, 0, 0, 7); lx.fill(); }
        }
        // les croisillons
        x.fillStyle = "#16120f"; x.fillRect(X + w / 2 - 1, Y, 2, h); x.fillRect(X, Y + h * 0.45, w, 2);
        lx.fillStyle = "#000"; lx.fillRect(X + w / 2 - 1, Y, 2, h); lx.fillRect(X, Y + h * 0.45, w, 2);
      }
      return { map: texture(c, o), lumiere: texture(l, o) };
    });
  }

  // ─── LE NÉON : des lettres en tubes, et leur halo (à poser en emissiveMap)
  function neon(o) {
    o = o || {};
    return garder("neon|" + JSON.stringify(o), function () {
      var W = taille(o.largeur || 1024), H = taille(o.hauteur || 256), c = canvas(W, H), x = c.getContext("2d");
      x.fillStyle = "#000"; x.fillRect(0, 0, W, H);
      var t = o.taille ? o.taille * H : H * 0.56, police = o.police || '"Jersey 15","Space Mono",monospace';
      x.font = (o.graisse || "400") + " " + t + "px " + police; x.textAlign = "center"; x.textBaseline = "middle";
      var lw = x.measureText(o.texte || "").width;
      if (lw > W * 0.9) { t *= W * 0.9 / lw; x.font = (o.graisse || "400") + " " + t + "px " + police; }
      x.lineJoin = "round"; x.lineWidth = Math.max(2, t / 14);
      x.shadowColor = o.couleur || "#FF5A4E"; x.shadowBlur = t / 3;
      x.strokeStyle = o.couleur || "#FF5A4E"; x.strokeText(o.texte || "", W / 2, H / 2);
      x.shadowBlur = 0; x.lineWidth = Math.max(1, t / 34); x.strokeStyle = "#fff7f0"; x.strokeText(o.texte || "", W / 2, H / 2);
      return { lumiere: texture(c, { clamp: true }), canvas: c };
    });
  }

  // ─── L'ÉCRAN : un CRT ou un LCD qu'on redessine avec le temps
  //  o = { largeur, hauteur, type: 'crt'|'lcd', dessiner(ctx, t, w, h) } → { texture, maj(t) }
  function ecran(o) {
    o = o || {};
    var W = taille(o.largeur || 512), H = taille(o.hauteur || 384), c = canvas(W, H), x = c.getContext("2d");
    var tx = texture(c, { clamp: true }), dernier = -1;
    var maj = function (t) {
      var f = Math.floor(t * (o.ips || 15));
      if (f === dernier) return;
      dernier = f;
      x.save();
      x.fillStyle = o.fond || "#05080a"; x.fillRect(0, 0, W, H);
      if (o.dessiner) o.dessiner(x, t, W, H);
      x.restore();
      if (o.type !== "lcd") {
        x.fillStyle = "rgba(0,0,0,0.28)";
        for (var y = 0; y < H; y += 3) x.fillRect(0, y, W, 1);
        var gr = x.createRadialGradient(W / 2, H / 2, W * 0.2, W / 2, H / 2, W * 0.75);
        gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0,0.55)");
        x.fillStyle = gr; x.fillRect(0, 0, W, H);
      }
      tx.needsUpdate = true;
    };
    maj(0);
    return { texture: tx, maj: maj, canvas: c };
  }

  // ─── LES LUMIÈRES PEINTES : un halo (les globes, les reflets, les flares), une
  // bouffée de fumée, une goutte (une étincelle, un éclat)
  function halo(o) {
    o = o || {};
    return garder("halo|" + JSON.stringify(o), function () {
      var W = o.taille || 128, c = canvas(W, W), x = c.getContext("2d");
      var gr = x.createRadialGradient(W / 2, W / 2, 0, W / 2, W / 2, W / 2);
      gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(o.coeur || 0.12, "rgba(255,255,255,0.65)");
      gr.addColorStop(0.4, "rgba(255,255,255,0.14)"); gr.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = gr; x.fillRect(0, 0, W, W);
      return texture(c, { clamp: true });
    });
  }
  function fumee(o) {
    o = o || {};
    return garder("fumee|" + JSON.stringify(o), function () {
      var W = o.taille || 256, c = canvas(W, W), x = c.getContext("2d"), n = couche(W, W, { periode: 4, octaves: 4, graine: o.graine || "fumee" });
      var im = x.createImageData(W, W), d = im.data;
      for (var p = 0, q = 0; p < n.length; p++, q += 4) {
        var px = p % W / W - 0.5, py = (p / W | 0) / W - 0.5, rr = Math.sqrt(px * px + py * py) * 2;
        var a = Math.max(0, 1 - rr) * Math.max(0, n[p] * 1.6 - 0.35);
        d[q] = d[q + 1] = d[q + 2] = 255; d[q + 3] = Math.min(255, Math.pow(a, 1.3) * 255 * 2.2);
      }
      x.putImageData(im, 0, 0);
      return texture(c, { clamp: true });
    });
  }
  function goutte() {
    return garder("goutte", function () {
      var W = 32, H = 128, c = canvas(W, H), x = c.getContext("2d");
      var gr = x.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.75, "rgba(255,255,255,0.7)"); gr.addColorStop(1, "rgba(255,255,255,1)");
      x.fillStyle = gr; x.beginPath(); x.ellipse(W / 2, H / 2, W * 0.18, H / 2, 0, 0, 7); x.fill();
      return texture(c, { clamp: true });
    });
  }

  // ═══ LES VISAGES IMPRIMÉS — art.js (window.FusibleArt) dessine ; on imprime ═══
  // Le héros n'a pas de visage de face dans art.js (« jamais de face ») : celui des
  // masques est un visage déduit de son nom (une fiche que art.js tire de l'id), qui
  // reste le même pour toute la carrière. Ce qu'on en fait : du noir sur du blanc,
  // comme une presse de 1990 le sortirait — trois tons, une trame de points.
  function svgVersCanvas(svg, W, H) {
    return new Promise(function (ok, ko) {
      var img = new Image();
      img.onload = function () { var c = canvas(W, H || W); c.getContext("2d").drawImage(img, 0, 0, W, H || W); ok(c); };
      img.onerror = function () { ko(new Error("art.js : le SVG ne se lit pas")); };
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    });
  }
  function art() {
    var A = global.FusibleArt;
    if (!A || !A.scene) throw new Error("art.js absent");
    return A;
  }
  // un portrait d'art.js SANS son décor : la figure seule, sur du transparent. Le
  // portrait est le décor (trois plans) puis UN groupe, la figure (art.js, `portrait`) :
  // on garde le dernier enfant du groupe découpé.
  function artDecoupe(spec, W) {
    var svg = art().scene(spec);
    try {
      var doc = new global.DOMParser().parseFromString(svg, "image/svg+xml"), g = doc.querySelector("g[clip-path]");
      var kids = g ? Array.prototype.filter.call(g.childNodes, function (n) { return n.nodeType === 1; }) : [];
      if (kids.length > 1 && kids[kids.length - 1].nodeName.toLowerCase() === "g") {
        for (var i = 0; i < kids.length - 1; i++) g.removeChild(kids[i]);
        g.removeAttribute("clip-path");
        svg = new global.XMLSerializer().serializeToString(doc);
      }
    } catch (e) { /* le portrait entier, décor compris */ }
    return svgVersCanvas(svg, W);
  }
  // l'identité du visage d'un héros : son nom fait la fiche (teint, coupe, poil). art.js
  // déduit une fiche de l'id ; on prend la première, parmi quelques ids tirés du nom,
  // qui n'a ni casquette ni lunettes (un masque de carnaval n'a pas de visière).
  function specHeros(heros, o) {
    heros = heros || {};
    var nom = String(heros.nom || "Ravenel").trim(), genre = heros.genre === "f" ? "f" : "m";
    var base = "visage_" + K.hash(nom + "|" + genre).toString(36), id = base, F = global.__FA_FICHES__;
    if (F && F.ficheDeduite) {
      for (var k = 0; k < 24; k++) {
        var cand = k ? base + "_" + k : base, f = F.ficheDeduite(cand, { genre: genre });
        if (f.ch !== "casquette" && f.ch !== "bonnet" && (!f.lu || f.lu === "aucune")) { id = cand; break; }
      }
    }
    return { speaker: id, genre: genre, expression: (o && o.expression) || "neutre", camp: "terrain", lieu: (o && o.lieu) || "virage",
      kind: "scene", cadrage: (o && o.cadrage) || "serre", annee: (o && o.annee) || heros.annee || 1990, seed: "masque" };
  }
  // la photo d'un visage (art.js), en couleur, décor compris : pour une affiche, un cadre
  function visageCouleur(spec, W) {
    try { return svgVersCanvas(art().scene(spec), W || 512); } catch (e) { return Promise.reject(e); }
  }
  // l'impression : la luminance en trois tons (le noir plein, la trame, le papier). Les
  // niveaux se règlent sur l'image (les 6 % les plus sombres au noir, les 22 % les plus
  // clairs au papier) : un teint sombre s'imprime aussi bien qu'un teint clair.
  //  o = { encre: '#121212', papier: null (transparent) | couleur, trame: taille du point }
  function imprimer(src, o) {
    o = o || {};
    var W = src.width, H = src.height, c = canvas(W, H), x = c.getContext("2d");
    var sd = src.getContext("2d").getImageData(0, 0, W, H).data, im = x.createImageData(W, H), d = im.data;
    var encre = couleurs(o.encre || "#141414"), papier = o.papier ? couleurs(o.papier) : null;
    var pas = o.trame || Math.max(3, Math.round(W / 110)), ang = 0.785, ca = Math.cos(ang), sa = Math.sin(ang);
    var hist = new Uint32Array(256), n = 0;
    for (var i = 0; i < sd.length; i += 4) if (sd[i + 3] > 128) { hist[(0.299 * sd[i] + 0.587 * sd[i + 1] + 0.114 * sd[i + 2]) | 0]++; n++; }
    var centile = function (f) { var s = 0; for (var k = 0; k < 256; k++) { s += hist[k]; if (s >= f * n) return k / 255; } return 1; };
    var bas = o.noir == null ? centile(0.08) + 0.02 : o.noir, haut = o.blanc == null ? Math.max(bas + 0.12, centile(0.70)) : o.blanc;
    for (var y = 0; y < H; y++) for (var xx = 0; xx < W; xx++) {
      var p = (y * W + xx) * 4;
      var L = (0.299 * sd[p] + 0.587 * sd[p + 1] + 0.114 * sd[p + 2]) / 255;
      var a = sd[p + 3] / 255;
      // la trame à 45° : un point d'encre dont la taille dit le gris
      var u = (xx * ca + y * sa) / pas, v = (-xx * sa + y * ca) / pas;
      var fu = u - Math.floor(u) - 0.5, fv = v - Math.floor(v) - 0.5, dist = Math.sqrt(fu * fu + fv * fv) * 1.41;
      var gris = K.borne((L - bas) / (haut - bas), 0, 1);
      var enc = L < bas ? 1 : L > haut ? 0 : (dist < Math.sqrt(1 - gris) * 0.98 ? 1 : 0);
      if (enc) { d[p] = encre[0]; d[p + 1] = encre[1]; d[p + 2] = encre[2]; d[p + 3] = 255 * a; }
      else if (papier) { d[p] = papier[0]; d[p + 1] = papier[1]; d[p + 2] = papier[2]; d[p + 3] = 255 * a; }
      else d[p + 3] = 0;
    }
    x.putImageData(im, 0, 0);
    return c;
  }
  // un portrait d'art.js est dessiné à plat (des aplats, des arêtes vives) ; une photo, non :
  // on le réduit puis on le regrandit en lissant, et on le floute un peu (la couleur
  // seulement : le contour, qui découpe le masque, reste net). `k` : l'échelle du lissage,
  // en pixels du canvas.
  function adoucir(c, k) {
    var W = c.width, H = c.height, f = Math.max(2, k || W / 48), w = Math.max(8, Math.round(W / f * 2)), h = Math.max(8, Math.round(H / f * 2));
    var p = canvas(w, h), px = p.getContext("2d");
    px.imageSmoothingEnabled = true; px.imageSmoothingQuality = "high"; px.drawImage(c, 0, 0, w, h);
    var o = canvas(W, H), ox = o.getContext("2d");
    ox.imageSmoothingEnabled = true; ox.imageSmoothingQuality = "high";
    if ("filter" in ox) ox.filter = "blur(" + (f * 0.32).toFixed(1) + "px)";
    ox.drawImage(p, 0, 0, W, H);
    if ("filter" in ox) ox.filter = "none";
    var r = canvas(W, H), rx = r.getContext("2d");
    rx.drawImage(c, 0, 0);
    rx.globalCompositeOperation = "source-atop";
    rx.drawImage(o, 0, 0);
    rx.globalCompositeOperation = "source-over";
    return r;
  }
  // où est la tête dans un portrait `serre` découpé : son milieu (les yeux tombent à
  // y = 175 sur 400, art.js `reglageCadre`) et sa demi-largeur à la hauteur des yeux
  function mesurerTete(c) {
    var W = c.width, y = Math.round(W * 175 / 400), d = c.getContext("2d").getImageData(0, y, W, 1).data, g = -1, dr = -1;
    for (var i = 0; i < W; i++) if (d[i * 4 + 3] > 100) { if (g < 0) g = i; dr = i; }
    if (g < 0) return { cx: W / 2, demi: W * 0.3, yeuxY: y };
    return { cx: (g + dr) / 2, demi: (dr - g) / 2, yeuxY: y };
  }
  // le visage du héros, imprimé noir sur blanc, découpé en masque : le contour de la
  // tête (le cou coupé sous le menton), deux yeux percés, deux trous pour l'élastique
  //  → Promise<{ canvas, texture }> ; o = { heros, taille, papier, encre, masque: true, yeux: true }
  function visage(o) {
    o = o || {};
    var cle = "visage|" + JSON.stringify(o);
    return garder(cle, function () {
      var W = taille(o.taille || 512);
      return artDecoupe(specHeros(o.heros, o), W).then(function (src) {
        var m = mesurerTete(src);
        // le carré autour de la tête : du haut du crâne au menton
        var cote = Math.min(W, m.demi * 2.3), x0 = m.cx - cote / 2, y0 = m.yeuxY - cote * 0.52;
        var cw = W, cx = canvas(cw, cw), x = cx.getContext("2d");
        x.drawImage(src, x0, y0, cote, cote, 0, 0, cw, cw);
        // sous le menton, le cou s'en va (le masque s'arrête à la mâchoire)
        x.globalCompositeOperation = "destination-in";
        var gr = x.createLinearGradient(0, cw * 0.80, 0, cw * 0.88);
        gr.addColorStop(0, "#000"); gr.addColorStop(1, "rgba(0,0,0,0)");
        x.fillStyle = gr; x.fillRect(0, 0, cw, cw);
        x.globalCompositeOperation = "source-over";
        // art.js dessine à plat (des polygones, des aplats) : on lisse à l'échelle d'un trait
        // (la tête fait une trentaine de « traits » de large), et le tirage devient une photo
        var lisse = o.net ? cx : adoucir(cx, cw / 34);
        var pr = imprimer(lisse, { encre: o.encre || "#151515", papier: o.papier || "#F1ECDF", trame: o.trame });
        if (o.masque === false) return { canvas: pr, texture: texture(pr, { clamp: true }) };
        var mk = canvas(cw, cw), mx = mk.getContext("2d");
        mx.drawImage(pr, 0, 0);
        mx.globalCompositeOperation = "destination-out";
        var ey = (m.yeuxY - y0) / cote * cw, ex = (m.demi - 18 * W / 400) * 0.42 / cote * cw;
        if (o.yeux !== false) {
          mx.beginPath(); mx.ellipse(cw / 2 - ex, ey, cw * 0.052, cw * 0.03, 0, 0, 7); mx.fill();
          mx.beginPath(); mx.ellipse(cw / 2 + ex, ey, cw * 0.052, cw * 0.03, 0, 0, 7); mx.fill();
        }
        mx.beginPath(); mx.arc(cw / 2 - m.demi / cote * cw * 0.9, ey, cw * 0.013, 0, 7); mx.fill();
        mx.beginPath(); mx.arc(cw / 2 + m.demi / cote * cw * 0.9, ey, cw * 0.013, 0, 7); mx.fill();
        mx.globalCompositeOperation = "source-over";
        return { canvas: mk, texture: texture(mk, { clamp: true }) };
      });
    });
  }
  // une feuille de presse : quatre visages (« ton visage sort par quatre »), les traits
  // de coupe, et la ligne de l'imprimeur en pied de page
  function feuilleMasques(o) {
    o = o || {};
    return garder("feuille|" + JSON.stringify(o), function () {
      return visage({ heros: o.heros, taille: 512, masque: false, papier: "#F1ECDF" }).then(function (v) {
        var W = taille(o.taille || 1024), H = Math.round(W * 1.3), c = canvas(W, H), x = c.getContext("2d");
        var p = papier({ taille: 512, graine: "feuille", couleur: "#F1ECDF" });
        x.fillStyle = x.createPattern(p.canvas, "repeat"); x.fillRect(0, 0, W, H);
        var m = W * 0.06, cw = (W - m * 3) / 2, ch = cw * 1.12;
        for (var j = 0; j < 2; j++) for (var i = 0; i < 2; i++) {
          var X = m + i * (cw + m), Y = m + j * (ch + m);
          x.save();
          x.globalCompositeOperation = "multiply";
          x.drawImage(v.canvas, X, Y + (ch - cw) / 2, cw, cw);
          x.restore();
          // le pointillé de la découpe
          x.setLineDash([W / 120, W / 160]); x.strokeStyle = "rgba(20,20,20,0.5)"; x.lineWidth = Math.max(1, W / 700);
          x.beginPath(); x.ellipse(X + cw / 2, Y + ch / 2, cw * 0.47, ch * 0.49, 0, 0, 7); x.stroke(); x.setLineDash([]);
        }
        // les traits de coupe aux coins, le repère de couleur, la ligne de l'imprimeur
        x.strokeStyle = "#111"; x.lineWidth = Math.max(1, W / 600);
        [[m * 0.5, m * 0.5], [W - m * 0.5, m * 0.5], [m * 0.5, H - m * 1.6], [W - m * 0.5, H - m * 1.6]].forEach(function (q) {
          x.beginPath(); x.moveTo(q[0] - m * 0.3, q[1]); x.lineTo(q[0] + m * 0.3, q[1]); x.moveTo(q[0], q[1] - m * 0.3); x.lineTo(q[0], q[1] + m * 0.3); x.stroke();
        });
        x.fillStyle = "#151515"; x.font = "700 " + Math.round(W / 46) + 'px "Space Mono","DejaVu Sans Mono",monospace'; x.textAlign = "left";
        x.fillText(o.ligne || "CARTONNAGES DE LA RIVE · AUBÉRIVE · TIRAGE 3000", m, H - m * 0.9);
        x.textAlign = "right"; x.fillText(o.numero || "N° 0412", W - m, H - m * 0.9);
        return { canvas: c, texture: texture(c, { clamp: true }) };
      });
    });
  }
  // le cliché : la plaque de zinc qui imprime la feuille, à l'envers (le miroir de la
  // feuille), l'encre noire et grasse sur les reliefs, le zinc mat dans les creux.
  //  o = les options de feuilleMasques → Promise<{ map, rugosite, relief }>
  function cliche(o) {
    o = o || {};
    return garder("cliche|" + JSON.stringify(o), function () {
      return feuilleMasques(o).then(function (f) {
        var W = f.canvas.width, H = f.canvas.height;
        var src = f.canvas.getContext("2d").getImageData(0, 0, W, H).data;
        var zinc = couche(W, H, { periode: 6, octaves: 4, graine: "zinc" });
        var cm = canvas(W, H), cr = canvas(W, H), cb = canvas(W, H);
        var im = cm.getContext("2d").createImageData(W, H), ir = cr.getContext("2d").createImageData(W, H), ib = cb.getContext("2d").createImageData(W, H);
        for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
          var q = (y * W + (W - 1 - x)) * 4, p = (y * W + x) * 4;      // le miroir
          var L = (0.299 * src[q] + 0.587 * src[q + 1] + 0.114 * src[q + 2]) / 255;
          var e = K.borne((0.62 - L) / 0.24, 0, 1), z = zinc[y * W + x];
          var c = (1 - e) * (168 + z * 46) + e * 10;
          // le zinc est froid : sous une ampoule, il redevient gris
          im.data[p] = c * 0.86; im.data[p + 1] = c * 0.95; im.data[p + 2] = Math.min(255, c * 1.12 + (1 - e) * 8); im.data[p + 3] = 255;
          var rg = (1 - e) * (95 + z * 60) + e * 30;
          ir.data[p] = ir.data[p + 1] = ir.data[p + 2] = rg; ir.data[p + 3] = 255;
          var rl = e * 220 + z * 30;
          ib.data[p] = ib.data[p + 1] = ib.data[p + 2] = rl; ib.data[p + 3] = 255;
        }
        cm.getContext("2d").putImageData(im, 0, 0); cr.getContext("2d").putImageData(ir, 0, 0); cb.getContext("2d").putImageData(ib, 0, 0);
        return { map: texture(cm, { clamp: true }), rugosite: texture(cr, { clamp: true, donnee: true }), relief: texture(cb, { clamp: true, donnee: true }) };
      });
    });
  }
  // la photo d'équipe : seize joueurs dans la boue, en deux rangs, un tirage sépia
  // collé sur carton ; `gratte` : les visages grattés au couteau jusqu'au carton
  //  o = { joueurs: 16, gratte: [4], legende, annee: 1974, taille }
  function photoEquipe(o) {
    o = o || {};
    return garder("photo|" + JSON.stringify(o), function () {
      var n = o.joueurs || 16, parRang = Math.ceil(n / 2), an = o.annee || 1974, faits = [];
      try { art(); } catch (e) { return Promise.reject(e); }
      for (var i = 0; i < n; i++) {
        faits.push(artDecoupe({ speaker: "finale" + an + "_" + i, expression: i % 5 === 2 ? "sourire" : "neutre", camp: "terrain", lieu: "terrain",
          kind: "scene", cadrage: "buste", annee: an, club: "bordeaux", seed: "photo" + an }, 256));
      }
      return Promise.all(faits).then(function (bustes) {
        var W = taille(o.taille || 1024), H = Math.round(W * 0.74), c = canvas(W, H), x = c.getContext("2d");
        var bord = W * 0.055, iw = W - bord * 2, ih = H - bord * 2.6;
        // le carton de montage
        var p = papier({ taille: 512, graine: "montage", couleur: "#D9CDB2" });
        x.fillStyle = x.createPattern(p.canvas, "repeat"); x.fillRect(0, 0, W, H);
        // le tirage : la tribune floue derrière, le gazon devant, deux rangs de joueurs
        var ph = canvas(Math.round(iw), Math.round(ih)), px = ph.getContext("2d");
        var g0 = px.createLinearGradient(0, 0, 0, ih); g0.addColorStop(0, "#77746c"); g0.addColorStop(0.42, "#9a978c"); g0.addColorStop(0.5, "#57564c"); g0.addColorStop(1, "#3a3a30");
        px.fillStyle = g0; px.fillRect(0, 0, iw, ih);
        var rt = K.alea("tribune74");
        for (var tb = 0; tb < 260; tb++) { px.fillStyle = "rgba(" + (40 + rt() * 60 | 0) + "," + (40 + rt() * 55 | 0) + "," + (36 + rt() * 50 | 0) + ",0.5)"; px.fillRect(rt() * iw, rt() * ih * 0.42, 3 + rt() * 8, 4 + rt() * 9); }
        var bw = iw / parRang * 1.22, haut = [], bas = [];
        for (var k = 0; k < n; k++) (k < parRang ? haut : bas).push(k);
        var poser = function (liste, piedY, echelle, decale) {
          liste.forEach(function (k, j) {
            var cx2 = (j + 0.5 + decale) * iw / (liste.length + decale * 2), s = bw * echelle;
            px.drawImage(adoucir(bustes[k], bustes[k].width / 30), cx2 - s / 2, piedY - s, s, s);
          });
        };
        poser(haut, ih * 0.66, 1.0, 0);
        poser(bas, ih * 1.03, 1.06, 0.18);
        // la boue de la finale sur les maillots du bas
        var gb = px.createLinearGradient(0, ih * 0.72, 0, ih);
        gb.addColorStop(0, "rgba(60,44,28,0)"); gb.addColorStop(1, "rgba(60,44,28,0.55)");
        px.fillStyle = gb; px.fillRect(0, ih * 0.72, iw, ih * 0.28);
        // le tirage sépia, son grain, son vignettage
        var im = px.getImageData(0, 0, iw | 0, ih | 0), d = im.data, r = K.alea("photo-grain");
        for (var q = 0; q < d.length; q += 4) {
          var L = (0.3 * d[q] + 0.59 * d[q + 1] + 0.11 * d[q + 2]) / 255;
          L = Math.pow(L, 0.92) + (r() - 0.5) * 0.09;
          d[q] = Math.min(255, L * 255 * 1.08 + 18); d[q + 1] = Math.min(255, L * 255 * 0.94 + 10); d[q + 2] = Math.min(255, L * 255 * 0.72);
        }
        px.putImageData(im, 0, 0);
        var vg = px.createRadialGradient(iw / 2, ih / 2, iw * 0.25, iw / 2, ih / 2, iw * 0.7);
        vg.addColorStop(0, "rgba(40,25,10,0)"); vg.addColorStop(1, "rgba(40,25,10,0.55)");
        px.fillStyle = vg; px.fillRect(0, 0, iw, ih);
        x.drawImage(ph, bord, bord);
        // les visages grattés : des coups de couteau qui mangent le tirage jusqu'au carton
        var visages = [];
        (o.gratte || []).forEach(function (k) {
          var dHaut = k < parRang, rang = dHaut ? haut : bas, j = rang.indexOf(k), dec = dHaut ? 0 : 0.18, ech = dHaut ? 1 : 1.06;
          var cx3 = bord + (j + 0.5 + dec) * iw / (rang.length + dec * 2), cy3 = bord + (dHaut ? ih * 0.66 : ih * 1.03) - bw * ech * 0.55;
          var rr = K.alea("gratte" + k);
          for (var s = 0; s < 70; s++) {
            var an2 = -0.9 + rr() * 0.5 + (rr() < 0.3 ? 1.2 : 0), lo = bw * (0.08 + rr() * 0.22);
            var sx = cx3 + (rr() - 0.5) * bw * 0.34, sy = cy3 + (rr() - 0.5) * bw * 0.3;
            x.strokeStyle = rr() < 0.7 ? "rgba(232,224,204," + (0.6 + rr() * 0.4) + ")" : "rgba(190,176,150,0.9)";
            x.lineWidth = 0.8 + rr() * W / 500;
            x.beginPath(); x.moveTo(sx, sy); x.lineTo(sx + Math.cos(an2) * lo, sy + Math.sin(an2) * lo); x.stroke();
          }
          // le fond du grattage : le carton, ses fibres
          x.fillStyle = "rgba(225,214,190,0.55)";
          x.beginPath(); x.ellipse(cx3, cy3, bw * 0.15, bw * 0.19, 0.2, 0, 7); x.fill();
          visages.push({ u: cx3 / W, v: cy3 / H });
        });
        // la légende tapée sur le carton
        x.fillStyle = "#2a2118"; x.font = "400 " + Math.round(W / 44) + 'px "Space Mono","DejaVu Sans Mono",monospace'; x.textAlign = "center";
        x.fillText(o.legende || "RACING AUBÉRIVE · FINALE DE LA COUPE · " + an, W / 2, H - bord * 0.75);
        return { canvas: c, texture: texture(c, { clamp: true }), visages: visages };
      });
    });
  }
  // le tifo : un visage géant sur la toile, les deux couleurs du club, un mot
  //  o = { heros, largeur, hauteur, couleurs: ['#7A1F2E', '#8E8C86'], mot: 'NORD' }
  function tifo(o) {
    o = o || {};
    return garder("tifo|" + JSON.stringify(o), function () {
      return visage({ heros: o.heros, taille: 512, yeux: false, masque: false, papier: "#ECE6D6", trame: 7 }).then(function (v) {
        var W = taille(o.largeur || 1024), H = taille(o.hauteur || 640), c = canvas(W, H), x = c.getContext("2d");
        var cols = o.couleurs || ["#7A1F2E", "#8E8C86"];
        // les bandes du club
        var nb = 10;
        for (var i = 0; i < nb; i++) { x.fillStyle = cols[i % 2]; x.fillRect(i * W / nb, 0, W / nb + 1, H); }
        // le visage, au centre, dans un grand ovale crème
        x.save(); x.beginPath(); x.ellipse(W / 2, H * 0.47, H * 0.36, H * 0.44, 0, 0, 7); x.clip(); x.fillStyle = "#ECE6D6"; x.fillRect(0, 0, W, H);
        x.drawImage(v.canvas, W / 2 - H * 0.42, H * 0.47 - H * 0.47, H * 0.84, H * 0.94);
        x.restore();
        x.strokeStyle = "#ECE6D6"; x.lineWidth = H / 60; x.beginPath(); x.ellipse(W / 2, H * 0.47, H * 0.37, H * 0.45, 0, 0, 7); x.stroke();
        if (o.mot) {
          x.font = "700 " + Math.round(H * 0.16) + 'px "Space Mono","DejaVu Sans Mono",monospace'; x.fillStyle = "#ECE6D6"; x.textAlign = "center"; x.textBaseline = "middle";
          x.fillText(o.mot, W * 0.16, H * 0.5); x.fillText(o.mot, W * 0.84, H * 0.5);
        }
        // la toile : des plis et l'usure de la peinture
        var n = couche(W, H, { periode: 3, octaves: 3, graine: "tifo-plis", rapportX: 0.4 });
        var im = x.getImageData(0, 0, W, H), d = im.data;
        for (var p = 0, q = 0; p < n.length; p++, q += 4) { var k = 0.82 + n[p] * 0.3; d[q] *= k; d[q + 1] *= k; d[q + 2] *= k; }
        x.putImageData(im, 0, 0);
        return { canvas: c, texture: texture(c, { clamp: true }) };
      });
    });
  }

  // ═══ LES MATÉRIAUX qui vont avec (MeshStandardMaterial) ═══════════════════
  function standard(o) {
    var THREE = T();
    var m = new THREE.MeshStandardMaterial(o);
    CREES.push(m);
    return m;
  }
  function avecRepetition(m, rep) {
    if (!rep) return m;
    ["map", "roughnessMap", "bumpMap", "emissiveMap", "normalMap"].forEach(function (k) {
      if (m[k]) { m[k] = m[k].clone(); m[k].repeat.set(rep[0], rep[1]); m[k].needsUpdate = true; CREES.push(m[k]); }
    });
    return m;
  }
  // Sur un téléphone (K.qualite.partage : moyenne, basse), les matières d'un même genre
  // partagent UNE texture peinte en gris, que la couleur du matériau teinte : douze façades
  // de brique font une texture au lieu de douze (la mémoire d'un film passe de 160 à 50 Mo).
  // Au tournage (haute), chaque matière garde sa graine et ses réglages.
  var GRIS = { brique: "#8c8c8c", beton: "#8a8a8a", bois: "#7a7a7a" };
  function partage() { return !!(K.qualite && K.qualite.partage); }
  function teinte(c, base) { var THREE = T(), a = new THREE.Color(c), b = new THREE.Color(base); return a.setRGB(a.r / b.r, a.g / b.g, a.b / b.b); }
  function commun(genre, o, defaut, fixes) {
    if (!partage()) return { o: o, couleur: o.teinte || 0xffffff };
    return { o: Object.assign({ taille: o.taille }, fixes, { couleur: GRIS[genre], graine: "partage-" + genre }), couleur: teinte(o.couleur || defaut, GRIS[genre]) };
  }
  var mat = {
    brique: function (o) { o = o || {}; var p = commun("brique", o, "#7D3A2A", { suie: 0.8, humide: 0.5 }), t = brique(p.o); return avecRepetition(standard({ map: t.map, roughnessMap: t.rugosite, bumpMap: t.relief, bumpScale: o.relief || 2.2, roughness: 1, metalness: 0, color: p.couleur }), o.repete); },
    beton: function (o) { o = o || {}; var p = commun("beton", o, "#6E6A5E", { taches: 1 }), t = beton(p.o); return avecRepetition(standard({ map: t.map, roughnessMap: t.rugosite, bumpMap: t.relief, bumpScale: o.relief || 1.2, roughness: 1, metalness: 0, color: p.couleur }), o.repete); },
    asphalte: function (o) { o = o || {}; var t = asphalte(o); return avecRepetition(standard({ map: t.map, roughnessMap: t.rugosite, bumpMap: t.relief, bumpScale: 0.6, roughness: 1, metalness: 0.0, envMapIntensity: o.reflets || 1.4 }), o.repete); },
    pelouse: function (o) { o = o || {}; var t = pelouse(o); return avecRepetition(standard({ map: t.map, roughnessMap: t.rugosite, roughness: 1, metalness: 0 }), o.repete); },
    rouille: function (o) { o = o || {}; var t = rouille(o); return avecRepetition(standard({ map: t.map, roughnessMap: t.rugosite, bumpMap: t.relief, bumpScale: 0.8, roughness: 1, metalness: 0.55 }), o.repete); },
    bois: function (o) { o = o || {}; var p = commun("bois", o, "#6B4325", { lames: 5, cire: o.cire }), t = bois(p.o); return avecRepetition(standard({ map: t.map, roughnessMap: t.rugosite, bumpMap: t.relief, bumpScale: 0.6, roughness: 1, metalness: 0, color: partage() ? p.couleur : 0xffffff }), o.repete); },
    papier: function (o) { o = o || {}; var t = papier(o); return avecRepetition(standard({ map: t.map, bumpMap: t.relief, bumpScale: 0.3, roughness: 0.92, metalness: 0 }), o.repete); },
    metal: function (o) { o = o || {}; return standard({ color: o.couleur || 0x3a3d40, roughness: o.rugosite == null ? 0.45 : o.rugosite, metalness: o.metal == null ? 0.85 : o.metal }); },
    peint: function (o) { o = o || {}; return standard({ color: o.couleur || 0x777777, roughness: o.rugosite == null ? 0.6 : o.rugosite, metalness: o.metal || 0 }); },
    lumiere: function (o) {
      o = o || {};
      var THREE = T();
      var m = new THREE.MeshBasicMaterial({ color: new THREE.Color(o.couleur || "#ffffff").multiplyScalar(o.intensite || 1), map: o.map || null, transparent: !!o.transparent, toneMapped: o.toneMapped !== false });
      CREES.push(m);
      return m;
    }
  };

  // tout rendre à la carte graphique (la fin d'un film)
  function liberer() {
    CREES.forEach(function (x) { try { x.dispose(); } catch (e) { /* rien */ } });
    CREES = []; CACHE = {};
  }

  K.tex = {
    couche: couche, canvas: canvas, texture: texture,
    brique: brique, beton: beton, asphalte: asphalte, pelouse: pelouse, rouille: rouille, bois: bois, papier: papier, tissu: tissu,
    texte: texte, fenetres: fenetres, neon: neon, ecran: ecran, halo: halo, fumee: fumee, goutte: goutte,
    visage: visage, visageCouleur: visageCouleur, specHeros: specHeros, imprimer: imprimer,
    feuilleMasques: feuilleMasques, cliche: cliche, photoEquipe: photoEquipe, tifo: tifo
  };
  K.mat = mat;
  K.garder = function (x) { CREES.push(x); return x; };
  K.liberer = liberer;
})(typeof window !== "undefined" ? window : this);
