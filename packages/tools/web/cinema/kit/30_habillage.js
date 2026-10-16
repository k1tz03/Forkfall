/* ═══════════════════════════════════════════════════════════════════════════
   LA TROUSSE DU CINÉMA — 30 : l'habillage (ce qui se pose sur l'image).

   Le même dessin en direct (une toile 2D par-dessus la toile WebGL) et au
   tournage (la même toile, composée sur le recadrage de l'image maîtresse) :
     · le noir (les fondus), l'éclair (un flash blanc ou de la couleur du livre) ;
     · les bandes : en paysage, l'image passe en 2,35:1 ; en portrait, pas de
       bandes par défaut (la vidéo verticale se regarde plein cadre) ;
     · le vignettage, et le grain (une couche à part, fondue en « overlay ») ;
     · les textes, trois sortes et pas une de plus :
         lieu      « Aubérive, rue du Port » / « 23 h 40 » : la carte de temps et
                   de lieu, en bas à gauche (en haut en portrait), tapée lettre à lettre ;
         replique  une ligne dite, deux lignes au plus, et qui la dit ;
         titre     le carton du titre, au centre, au néon du livre (comme les
                   cartons des scènes jouées, ville.css .v-cine-titre).
   Les polices sont celles du jeu : Jersey 15 (le pixel), Space Mono (le texte).
   Les zones sûres : en portrait, rien dans les 10 % du haut ni les 22 % du bas
   (l'interface des réseaux) ; en paysage, 6 % tout autour.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var K = global.FusibleCinema.kit;
  var PIX = '"Jersey 15","Space Mono","DejaVu Sans Mono",monospace';
  var MONO = '"Space Mono","DejaVu Sans Mono",ui-monospace,monospace';
  var CREME = "#F2E8CE", CREME2 = "#CBBB92";

  // la toile du grain : 256², gris moyen ± bruit, tirée une fois
  var GRAIN = null;
  function toileGrain() {
    if (GRAIN) return GRAIN;
    var c = global.document.createElement("canvas"), n = 256;
    c.width = c.height = n;
    var x = c.getContext("2d"), im = x.createImageData(n, n), d = im.data, r = K.alea("grain");
    for (var i = 0; i < d.length; i += 4) {
      var v = 128 + (r() + r() + r() - 1.5) * 70;
      d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255;
    }
    x.putImageData(im, 0, 0);
    GRAIN = c;
    return c;
  }
  // le grain d'une image : la toile répétée, décalée à chaque image (24 par seconde,
  // comme la pellicule), à fondre en « overlay » sur l'image
  function grain(x, W, H, t, force, echelle) {
    if (!force) return;
    var g = toileGrain(), f = Math.floor(t * 24), s = (echelle || 1.6) * Math.max(1, Math.min(W, H) / 1080);
    var dx = K.h01(f, 11) * 256, dy = K.h01(f, 23) * 256;
    x.save();
    x.globalAlpha = force;
    x.imageSmoothingEnabled = true;
    x.translate(-dx * s, -dy * s);
    x.scale(s, s);
    x.fillStyle = x.createPattern(g, "repeat");
    x.fillRect(0, 0, W / s + 256, H / s + 256);
    x.restore();
  }

  // la géométrie d'un cadre : les bandes, la zone d'image, les marges sûres
  function cadre(W, H, etat) {
    var paysage = W >= H, ratio = paysage ? (etat.ratioPaysage || 2.35) : (etat.ratioPortrait || 0);
    var b = etat.barres == null ? 1 : etat.barres, hb = 0;
    if (ratio && W / H < ratio) hb = (H - W / ratio) / 2 * b;
    var m = paysage ? Math.round(Math.min(W, H) * 0.06) : Math.round(W * 0.07);
    return { paysage: paysage, bande: hb, x0: m, x1: W - m, y0: Math.max(hb, paysage ? m : H * 0.10), y1: Math.min(H - hb, paysage ? H - m : H * 0.78),
      u: Math.min(W, H) / 1080 };
  }

  // le texte qui casse en lignes dans une largeur, deux lignes au plus (puis on réduit)
  function lignes(x, texte, largeur, police, taille, max) {
    // (les espaces insécables restent dans le mot : « ventes ? » ne laisse pas son « ? » seul)
    var mots = String(texte).split(/[ \t\n\r]+/), out = [], cur = "";
    x.font = police.replace("{t}", taille);
    mots.forEach(function (m) {
      var essai = cur ? cur + " " + m : m;
      if (x.measureText(essai).width > largeur && cur) { out.push(cur); cur = m; } else cur = essai;
    });
    if (cur) out.push(cur);
    if (out.length > (max || 2) && taille > 10) return lignes(x, texte, largeur, police, taille * 0.92, max);
    return { l: out, taille: taille };
  }

  // l'apparition d'un texte : de 0 à 1 sur `entree`, tenu, puis jusqu'à 0 sur `sortie`
  function presence(t, tx) {
    var e = tx.entree == null ? 0.45 : tx.entree, s = tx.sortie == null ? 0.45 : tx.sortie;
    return K.lisse(tx.de, tx.de + e, t) * (1 - K.lisse(tx.a - s, tx.a, t));
  }

  function dessinerLieu(x, W, H, c, tx, t, couleur) {
    var a = presence(t, tx);
    if (a <= 0) return;
    var u = c.u, t1 = Math.round(52 * u * (c.paysage ? 1 : 1.15)), t2 = Math.round(21 * u * (c.paysage ? 1 : 1.12));
    // tapé lettre à lettre : 28 signes par seconde, la ligne du dessous après
    var dt = Math.max(0, t - tx.de), n1 = Math.floor(dt * 28), l1 = String(tx.texte || "").toUpperCase(), l2 = String(tx.sous || "").toUpperCase();
    var v1 = l1.slice(0, n1), v2 = l2.slice(0, Math.max(0, n1 - l1.length - 4));
    var X = c.paysage ? c.x0 : c.x0, Y = c.paysage ? c.y1 - t2 * 2.2 : c.y0 + t1 * 1.1;
    x.save();
    x.globalAlpha = a;
    x.textAlign = "left"; x.textBaseline = "alphabetic";
    // le filet de la couleur du livre
    x.fillStyle = couleur; x.shadowColor = couleur; x.shadowBlur = 12 * u;
    x.fillRect(X, Y - t1 * 1.05, Math.min(1, dt / 0.5) * 64 * u, Math.max(2, 3 * u));
    x.shadowBlur = 0;
    x.font = "400 " + t1 + "px " + PIX;
    x.letterSpacing = Math.round(2 * u) + "px";
    x.shadowColor = "rgba(0,0,0,0.85)"; x.shadowBlur = 14 * u;
    x.fillStyle = CREME; x.fillText(v1, X, Y);
    x.font = "700 " + t2 + "px " + MONO;
    x.letterSpacing = Math.round(4 * u) + "px";
    x.fillStyle = couleur; x.fillText(v2, X, Y + t2 * 1.75);
    x.restore();
  }

  function dessinerReplique(x, W, H, c, tx, t, couleur) {
    var a = presence(t, tx);
    if (a <= 0) return;
    var u = c.u, taille = Math.round(36 * u * (c.paysage ? 1 : 1.12)), larg = (c.x1 - c.x0) * (c.paysage ? 0.78 : 1);
    var L = lignes(x, "« " + tx.texte + " »", larg, "400 {t}px " + MONO, taille, 2);
    var lh = L.taille * 1.38, bas = c.paysage ? Math.min(H - c.bande - L.taille * 0.9, c.y1) : c.y1;
    var y0 = bas - (L.l.length - 1) * lh;
    x.save();
    x.globalAlpha = a;
    x.textAlign = "center"; x.textBaseline = "alphabetic";
    // l'ombre portée : un voile sous les lignes, jamais une boîte
    var gr = x.createLinearGradient(0, y0 - lh * 1.8, 0, bas + lh * 0.6);
    gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(0.5, "rgba(0,0,0,0.42)"); gr.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = gr; x.fillRect(0, y0 - lh * 1.8, W, (bas - y0) + lh * 2.4);
    if (tx.qui) {
      x.font = "700 " + Math.round(L.taille * 0.6) + "px " + MONO;
      x.letterSpacing = Math.round(5 * u) + "px";
      x.fillStyle = couleur; x.shadowColor = couleur; x.shadowBlur = 10 * u;
      x.fillText(String(tx.qui).toUpperCase(), W / 2, y0 - lh * 0.95);
    }
    x.shadowColor = "rgba(0,0,0,0.9)"; x.shadowBlur = 10 * u;
    x.letterSpacing = "0px";
    x.font = "400 " + L.taille + "px " + MONO;
    x.fillStyle = CREME;
    L.l.forEach(function (l, i) { x.fillText(l, W / 2, y0 + i * lh); });
    x.restore();
  }

  function dessinerTitre(x, W, H, c, tx, t, couleur) {
    var a = presence(t, tx);
    if (a <= 0) return;
    var u = c.u, dt = t - tx.de;
    // le néon qui s'allume : la même séquence que le carton des scènes jouées
    var cl = dt < 0.13 ? 0 : dt < 0.19 ? 1 : dt < 0.25 ? 0.25 : dt < 1.0 ? 1 : dt < 1.08 ? 0.4 : 1;
    var taille = Math.round((c.paysage ? 92 : 104) * u), L = lignes(x, String(tx.texte).toUpperCase(), (c.x1 - c.x0), "400 {t}px " + PIX, taille, 2);
    var lh = L.taille * 1.02, y0 = H / 2 - (L.l.length - 1) * lh / 2;
    // un voile sous le titre : le néon se lit sur une image claire comme sur le noir
    x.save();
    x.globalAlpha = a * 0.75;
    var hv = (L.l.length * lh + (tx.sous ? L.taille * 1.6 : 0)) * 1.25, yv = y0 - lh * 0.5 + (L.l.length * lh + (tx.sous ? L.taille * 1.2 : 0)) / 2;
    var gv = x.createLinearGradient(0, yv - hv, 0, yv + hv);
    gv.addColorStop(0, "rgba(0,0,0,0)"); gv.addColorStop(0.5, "rgba(4,3,6,0.62)"); gv.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = gv; x.fillRect(0, yv - hv, W, hv * 2);
    x.restore();
    x.save();
    x.globalAlpha = a;
    x.textAlign = "center"; x.textBaseline = "middle";
    x.font = "400 " + L.taille + "px " + PIX;
    x.letterSpacing = Math.round(3 * u) + "px";
    x.translate(W / 2, 0);
    x.transform(1, 0, -0.105, 1, 0, 0);
    L.l.forEach(function (l, i) {
      var y = y0 + i * lh;
      x.globalAlpha = a * cl;
      // l'aberration : le rouge et le cyan décalés, puis la lettre au néon
      x.fillStyle = "rgba(255,0,90,0.55)"; x.fillText(l, 3 * u + y * 0.105, y);
      x.fillStyle = "rgba(0,220,255,0.45)"; x.fillText(l, -3 * u + y * 0.105, y);
      x.shadowColor = couleur; x.shadowBlur = 26 * u;
      x.fillStyle = couleur; x.fillText(l, y * 0.105, y);
      x.shadowBlur = 0;
    });
    x.restore();
    if (tx.sous) {
      x.save();
      x.globalAlpha = a * K.lisse(0.35, 0.9, dt);
      x.textAlign = "center"; x.textBaseline = "middle";
      x.font = "700 " + Math.round(30 * u) + "px " + MONO;
      x.letterSpacing = Math.round(7 * u) + "px";
      x.shadowColor = "rgba(0,0,0,0.9)"; x.shadowBlur = 12 * u;
      x.fillStyle = CREME;
      x.fillText(String(tx.sous).toUpperCase(), W / 2, y0 + (L.l.length - 1) * lh + L.taille * 1.05);
      x.restore();
    }
  }

  // tout l'habillage d'une image
  //  etat = { t, noir, flash, flashCouleur, barres, ratioPaysage, ratioPortrait, vignette,
  //           textes: [{ sorte, de, a, texte, sous, qui }], couleur }
  function dessiner(x, W, H, etat) {
    var c = cadre(W, H, etat), couleur = etat.couleur || "#FF5A4E", t = etat.t || 0;
    // le vignettage : une ellipse à la mesure du cadre
    var v = etat.vignette == null ? 0.5 : etat.vignette;
    if (v > 0) {
      x.save();
      x.translate(W / 2, H / 2);
      x.scale(W / 2, H / 2);
      var gr = x.createRadialGradient(0, 0, 0.45, 0, 0, 1.42);
      gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0," + v + ")");
      x.fillStyle = gr; x.fillRect(-1, -1, 2, 2);
      x.restore();
    }
    // les bandes, leur filet de néon
    if (c.bande > 0.5) {
      x.fillStyle = "#000"; x.fillRect(0, 0, W, c.bande); x.fillRect(0, H - c.bande, W, c.bande);
    }
    // les textes
    (etat.textes || []).forEach(function (tx) {
      if (t < tx.de || t > tx.a) return;
      if (tx.sorte === "lieu") dessinerLieu(x, W, H, c, tx, t, couleur);
      else if (tx.sorte === "titre") dessinerTitre(x, W, H, c, tx, t, couleur);
      else dessinerReplique(x, W, H, c, tx, t, couleur);
    });
    // le noir et l'éclair, par-dessus tout
    if (etat.noir > 0.001) { x.fillStyle = "rgba(0,0,0," + Math.min(1, etat.noir) + ")"; x.fillRect(0, 0, W, H); }
    if (etat.flash > 0.001) {
      x.save(); x.globalCompositeOperation = "lighter";
      x.fillStyle = K.css(etat.flashCouleur || "#FFF4E0", Math.min(1, etat.flash)); x.fillRect(0, 0, W, H);
      x.restore();
    }
    return c;
  }

  // les polices, avant la première image (le jeu les a ; le tournage les pose)
  function polices() {
    var d = global.document;
    if (!d || !d.fonts || !d.fonts.load) return Promise.resolve();
    var l = ["400 40px \"Jersey 15\"", "400 20px \"Space Mono\"", "700 20px \"Space Mono\"", "italic 400 20px \"Space Mono\""];
    var p = Promise.all(l.map(function (f) { return d.fonts.load(f).catch(function () {}); }));
    return Promise.race([p, new Promise(function (ok) { setTimeout(ok, 2500); })]);
  }

  K.habillage = { dessiner: dessiner, grain: grain, cadre: cadre, polices: polices, PIX: PIX, MONO: MONO };
})(typeof window !== "undefined" ? window : this);
