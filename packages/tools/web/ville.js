/* ═══════════════════════════════════════════════════════════════════════════
   FUSIBLE — LA VILLE (la version jouable)

   La couche « Punch Club » de la préproduction, branchée sur le vrai moteur :
   Aubérive en pixel art (rendue hors ligne par le moteur voxel de la direction
   artistique, découpée en tuiles), un personnage qui y marche, une semaine en
   tranches d'heures, et les cartes qui attendent chacune à leur lieu.

   Le partage des rôles :
     · le MOTEUR (Dart compilé) tient la carrière : la carte servie, les
       jauges, les intrigues, les fins. La ville ne tire rien ;
     · la COQUILLE (preview_template.html) montre la carte, le geste, la Une,
       la frise, la fin — elle ne sait pas qu'il y a une ville, sauf par les
       crochets `window.FusibleVille` (ce fichier) et `window.FusibleCoquille`
       (ce qu'elle prête) ;
     · la VILLE (ici) décide OÙ et QUAND la carte se montre, tient le temps, le
       corps (énergie, faim) et les francs, et applique les activités par
       `FusibleCoquille.activite(id)` → `Engine.activite` (les jauges seules).

   Les données : content/ville.yaml (dans le bundle, section `ville`) dit les
   lieux, qui on y trouve, ce qu'on y fait ; les images (dossier `ville/` à côté
   de la page) disent où sont les portes et par où l'on marche.

   La règle de rythme vient de la charte d'écriture (docs/bible/charte_histoire.md
   § 4) : une semaine jouée tient deux ou trois cartes et un match ; les
   événements sombres ne s'annoncent pas sur la carte de la ville.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var BASE = "ville/";
  var CLE_SAUVE = "fusible.ville.v1";
  var TRANCHES = ["matin", "midi", "aprem", "soir", "nuit"];
  var TRANCHE_MOT = { matin: "Matin", midi: "Midi", aprem: "Après-midi", soir: "Soir", nuit: "Nuit" };
  var HEURE = { matin: "9 h", midi: "12 h 30", aprem: "15 h", soir: "20 h", nuit: "23 h 40" };
  var JOURS = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];
  var JOUR_MOT = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  // L'heure du jour → l'image de la ville (trois rendus) et sa profondeur (deux).
  var AMBIANCE = { matin: "jour", midi: "jour", aprem: "jour", soir: "crepuscule", nuit: "nuit" };
  var PROFONDEUR = { jour: "prof_jour", crepuscule: "prof_nuit", nuit: "prof_nuit" };
  // La lumière portée par les personnages (le rendu voxel éclaire le décor, pas eux).
  var TEINTE = { jour: [1, 1, 1], crepuscule: [0.9, 0.76, 0.66], nuit: [0.62, 0.58, 0.68] };
  var SALAIRE = { entraineur: 800, joueur: 1000 };
  var VITESSE = 70;            // voxels par seconde (14 m/s : la ville est petite, c'est la journée qui est courte)
  var TOLERANCE = 1.6;         // un trottoir n'avale pas les pieds
  var STADE_JOURS = { match: 5, cup: 2 };   // samedi, mercredi

  // ─────────────────────────────────────────────────────────────── l'état
  var D = null;                // la section `ville` du bundle
  var L = null;                // lieux.json (portes, projection)
  var P = { cu: -2020, cv: -240, zl: 10, w: 4040, h: 2260 };
  var ZSOL = 12;               // le dessus de la chaussée (z local 2 + le sol logique)
  var G = 250, CELL = 4, grille = null;
  var LIEU = {}, TEXTE_LIEU = {}, SPRITES = {};
  var S = null;                // l'état de la ville (sauvegardé)
  var vue = null;              // la dernière vue du moteur
  var carteOn = false;         // une carte est à l'écran
  var rdv = null;              // la carte en attente : où, quand, comment
  var figurants = [];          // les gens d'une scène (manif, supporters…)
  var passants = [];
  var coquille = null;
  var actif = false;           // la ville est à l'écran
  var porteOuverte = null;     // le lieu dont la porte est ouverte (le panneau)
  var occupe = false;          // un fondu ou une scène est en cours
  var dernierVu = "";          // la clé de la dernière vue planifiée

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&quot;"; }); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function icone(nom, taille) {
    var A = window.FusibleArt;
    try { return A ? A.icon(nom, { size: taille || 16 }) : ""; } catch (e) { return ""; }
  }

  // ─────────────────────────────────────────────────────────────── le temps
  // t = ((semaine × 7) + jour) × 5 + tranche : un entier, qu'on compare.
  function tDe(sem, jour, tr) { return (sem * 7 + jour) * 5 + tr; }
  function tNow() { return tDe(S.semaine, S.jour, S.tranche); }
  function jourDe(t) { return Math.floor(t / 5) % 7; }
  function trancheDe(t) { return t % 5; }
  function semaineDe(t) { return Math.floor(t / 35); }
  function ambiance() { return AMBIANCE[TRANCHES[S.tranche]]; }
  function quand(t) {
    var j = jourDe(t), tr = TRANCHES[trancheDe(t)];
    var rel = semaineDe(t) > S.semaine ? " prochain" : "";
    return JOUR_MOT[j] + rel + " " + (tr === "aprem" ? "après-midi" : tr);
  }
  function moisCourant() {
    // Le mois se déduit de la phase et de la journée de championnat (le moteur
    // ne date pas les jours) : une approximation qui ne ment pas sur la saison.
    var ph = vue && vue.phase, j = (vue && vue.journee) || 0, an = (vue && vue.year) || 1990;
    var m = 7;
    if (ph === "presaison") m = S.semaine <= 1 ? 6 : 7;
    else if (ph === "aller") m = clamp(7 + Math.floor(j / 4), 7, 11);
    else if (ph === "hiver") m = 12;
    else if (ph === "retour") m = clamp(13 + Math.floor(Math.max(0, j - 17) / 4), 13, 16);
    else if (ph === "sprint") m = 16;
    else if (ph === "bilan") m = 17;
    var annee = an + (m >= 12 ? 1 : 0);
    return MOIS[m % 12] + " " + annee;
  }

  // ─────────────────────────────────────────────────────────────── la grille
  function marchable(cx, cy) { return cx >= 0 && cy >= 0 && cx < G && cy < G && grille[cy * G + cx] === 1; }
  function caseDe(x, y) { return [Math.floor(x / CELL), Math.floor(y / CELL)]; }
  function centre(c) { return [c[0] * CELL + CELL / 2, c[1] * CELL + CELL / 2]; }
  function plusProche(cx, cy, rayon) {
    if (marchable(cx, cy)) return [cx, cy];
    for (var r = 1; r <= (rayon || 12); r++) {
      var best = null, bd = 1e9;
      for (var dy = -r; dy <= r; dy++) for (var dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r || !marchable(cx + dx, cy + dy)) continue;
        var d = dx * dx + dy * dy;
        if (d < bd) { bd = d; best = [cx + dx, cy + dy]; }
      }
      if (best) return best;
    }
    return null;
  }
  // A* sur la grille, huit directions sans couper les coins.
  function chemin(a, b) {
    if (!a || !b) return null;
    var N = G * G, ga = new Float32Array(N).fill(Infinity), de = new Int32Array(N).fill(-1), ferme = new Uint8Array(N);
    var tas = [], ia = a[1] * G + a[0], ib = b[1] * G + b[0];
    function h(k) { var x = k % G, y = (k - x) / G, dx = Math.abs(x - b[0]), dy = Math.abs(y - b[1]); return Math.max(dx, dy) + 0.414 * Math.min(dx, dy); }
    function push(k, f) { tas.push([f, k]); var i = tas.length - 1; while (i > 0) { var p = (i - 1) >> 1; if (tas[p][0] <= tas[i][0]) break; var t = tas[p]; tas[p] = tas[i]; tas[i] = t; i = p; } }
    function pop() { var top = tas[0], last = tas.pop(); if (tas.length) { tas[0] = last; var i = 0; for (;;) { var l = 2 * i + 1, r = l + 1, m = i; if (l < tas.length && tas[l][0] < tas[m][0]) m = l; if (r < tas.length && tas[r][0] < tas[m][0]) m = r; if (m === i) break; var t = tas[m]; tas[m] = tas[i]; tas[i] = t; i = m; } } return top; }
    ga[ia] = 0; push(ia, h(ia));
    var DIRS = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, 1.414], [1, -1, 1.414], [-1, 1, 1.414], [-1, -1, 1.414]];
    var n = 0;
    while (tas.length) {
      var k = pop()[1];
      if (ferme[k]) continue;
      ferme[k] = 1;
      if (k === ib) break;
      if (++n > 70000) return null;
      var x = k % G, y = (k - x) / G;
      for (var i = 0; i < 8; i++) {
        var nx = x + DIRS[i][0], ny = y + DIRS[i][1];
        if (!marchable(nx, ny)) continue;
        if (DIRS[i][2] > 1 && (!marchable(x + DIRS[i][0], y) || !marchable(x, y + DIRS[i][1]))) continue;
        var nk = ny * G + nx, g = ga[k] + DIRS[i][2];
        if (g < ga[nk]) { ga[nk] = g; de[nk] = k; push(nk, g + h(nk)); }
      }
    }
    if (de[ib] < 0 && ia !== ib) return null;
    var pts = [], c = ib;
    while (c >= 0) { pts.push([c % G, Math.floor(c / G)]); if (c === ia) break; c = de[c]; }
    pts.reverse();
    return lisser(pts);
  }
  function vue_libre(a, b) {
    var x0 = a[0], y0 = a[1], x1 = b[0], y1 = b[1], dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
    var sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, err = dx - dy;
    for (;;) {
      if (!marchable(x0, y0)) return false;
      if (x0 === x1 && y0 === y1) return true;
      var e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x0 += sx; }
      if (e2 < dx) { err += dx; y0 += sy; }
      if (!marchable(x0, y0)) return false;
    }
  }
  function lisser(pts) {
    if (pts.length < 3) return pts;
    var out = [pts[0]], i = 0;
    while (i < pts.length - 1) {
      var j = pts.length - 1;
      while (j > i + 1 && !vue_libre(pts[i], pts[j])) j--;
      out.push(pts[j]); i = j;
    }
    return out;
  }

  // ─────────────────────────────────────────────────────────────── les images
  var TUILE = 1024, COLS = 4, RANGS = 3;
  var images = {};             // nom → Image
  var profs = {};              // nom → Uint16Array (décodée à la demande)
  function img(nom) {
    var im = images[nom];
    if (!im) {
      im = new Image();
      im.decoding = "async";
      im.onload = function () { im._ok = true; };
      im.src = BASE + nom + ".webp";
      images[nom] = im;
    }
    return im;
  }
  function nomTuile(amb, i) { return amb + "_" + (i < 10 ? "0" : "") + i; }
  function profTuile(nom) {
    if (profs[nom] !== undefined) return profs[nom];
    var im = img(nom);
    if (!im._ok) return null;
    try {
      var c = document.createElement("canvas");
      c.width = im.naturalWidth; c.height = im.naturalHeight;
      var x = c.getContext("2d", { willReadFrequently: true });
      x.drawImage(im, 0, 0);
      var d = x.getImageData(0, 0, c.width, c.height).data, n = c.width * c.height, out = new Uint16Array(n);
      for (var k = 0; k < n; k++) out[k] = (d[k * 4] << 8) | d[k * 4 + 1];
      out.w = c.width;
      profs[nom] = out;
      return out;
    } catch (e) { profs[nom] = null; return null; }
  }
  // la profondeur (x + y + z) du décor au pixel (u, v) de l'image ; 0 : le ciel
  function profondeur(u, v) {
    if (u < 0 || v < 0 || u >= P.w || v >= P.h) return 0;
    var c = Math.floor(u / TUILE), r = Math.floor(v / TUILE), i = r * COLS + c;
    var t = profTuile(nomTuile(PROFONDEUR[ambiance()], i));
    if (!t) return 0;
    var q = t[(v - r * TUILE) * t.w + (u - c * TUILE)];
    return q ? (q - 1) / 8 : 0;
  }
  // monde → image
  function versImage(x, y, z) { return [2 * (x - y) - P.cu, x + y - 2 * z - P.cv]; }
  // image → sol (z = la chaussée)
  function versSol(u, v) {
    var a = (u + P.cu) / 2, b = v + P.cv + 2 * ZSOL;
    return [(a + b) / 2, (b - a) / 2];
  }

  // ─────────────────────────────────────────────────────────────── l'écran
  var cv = null, ctx = null, k = 2, VW = 0, VH = 0;
  var cam = { x: 0, y: 0, cible: null, libre: false };
  var amb0 = null, fondu = 1;  // le fondu enchaîné entre deux heures
  function taille() {
    if (!cv) return;
    var W = window.innerWidth, H = window.innerHeight;
    if (!S || !S.zoom) k = (W >= 1100 && H >= 760) ? 3 : 2; else k = S.zoom;
    VW = Math.ceil(W / k); VH = Math.ceil(H / k);
    cv.width = VW; cv.height = VH;
    ctx.imageSmoothingEnabled = false;
  }

  // ─────────────────────────────────────────────────────────────── les gens
  // Un sprite : rangées de caractères + palette (sprites.json, tirés du moteur voxel).
  function dessinerSprite(sp, x, y, opt) {
    var def = SPRITES[sp];
    if (!def) return;
    var rows = def.rows, h = rows.length, w = rows[0].length;
    var miroir = !!opt.miroir, pas = opt.pas || 0;
    var ax = miroir ? w - 1 - def.ax : def.ax;
    var p = versImage(x, y, ZSOL), u0 = Math.round(p[0]), v0 = Math.round(p[1]);
    var ox = u0 - Math.round(cam.x - VW / 2), oy = v0 - Math.round(cam.y - VH / 2);
    if (ox + w < -2 || oy < -2 || ox - w > VW + 2 || oy - h > VH + 2) return;
    // l'ombre au sol
    ctx.fillStyle = "rgba(0,0,0,0.34)";
    ctx.fillRect(ox - 4, oy - 1, 9, 2); ctx.fillRect(ox - 3, oy - 2, 7, 4);
    var teinte = TEINTE[ambiance()], tint = opt.teinte || teinte;
    var im = ctx.createImageData(w, h), d = im.data, jambes = Math.floor(h * 0.72);
    var silhouette = !!opt.silhouette;
    for (var i = 0; i < h; i++) {
      var row = rows[i];
      for (var j = 0; j < w; j++) {
        var src = miroir ? w - 1 - j : j;
        if (pas && i >= jambes) src += (src < w / 2 ? 1 : -1) * pas;
        var ch = src >= 0 && src < w ? row[src] : ".";
        if (ch === "." || ch === " ") continue;
        var col = def.pal[ch];
        if (!col) continue;
        var px = u0 - ax + j, py = v0 - (h - 1) + i;
        var ds = x + y + ZSOL + (h - 1 - i) / 2, sc = profondeur(px, py);
        var cache = sc && ds < sc - TOLERANCE;
        var o = (i * w + j) * 4;
        if (cache) {
          if (!silhouette) continue;
          d[o] = 242; d[o + 1] = 232; d[o + 2] = 206; d[o + 3] = 110;
          continue;
        }
        var e = def.emit && def.emit[ch];
        d[o] = e ? e[0] : Math.round(col[0] * tint[0]);
        d[o + 1] = e ? e[1] : Math.round(col[1] * tint[1]);
        d[o + 2] = e ? e[2] : Math.round(col[2] * tint[2]);
        d[o + 3] = 255;
      }
    }
    var tmp = dessinerSprite._c || (dessinerSprite._c = document.createElement("canvas"));
    tmp.width = w; tmp.height = h;
    tmp.getContext("2d").putImageData(im, 0, 0);
    ctx.drawImage(tmp, ox - ax, oy - (h - 1));
  }
  // le point d'exclamation d'un rendez-vous, au-dessus de la tête
  function dessinerMarque(x, y, t) {
    var p = versImage(x, y, ZSOL + 12), ox = Math.round(p[0] - (cam.x - VW / 2)), oy = Math.round(p[1] - (cam.y - VH / 2)) + (Math.floor(t / 300) % 2);
    ctx.fillStyle = "#E0164B"; ctx.fillRect(ox - 3, oy - 11, 7, 10); ctx.fillRect(ox - 1, oy - 1, 3, 2);
    ctx.fillStyle = "#F2E8CE"; ctx.fillRect(ox, oy - 9, 1, 4); ctx.fillRect(ox, oy - 4, 1, 1);
  }

  // ─────────────────────────────────────────────────────────────── le héros
  var heros = { x: 0, y: 0, chemin: null, i: 0, miroir: false, pas: 0, dist: 0, arrivee: null };
  function poser(x, y) { heros.x = x; heros.y = y; heros.chemin = null; heros.arrivee = null; S.x = x; S.y = y; }
  function allerA(cx, cy, quandArrive) {
    var a = plusProche.apply(null, caseDe(heros.x, heros.y).concat([16]));
    var b = plusProche(cx, cy, 16);
    var ch = chemin(a, b);
    if (!ch) { toast("Pas de chemin d'ici."); return false; }
    heros.chemin = ch.map(centre); heros.i = 0; heros.arrivee = quandArrive || null;
    cam.libre = false;
    fermerPorte();
    verifierRue();
    return true;
  }
  function allerAuLieu(cle) {
    var l = LIEU[cle];
    if (!l || !l.door) return;
    if (porteOuverte === cle) return;
    var c = caseDe(heros.x, heros.y);
    if (Math.abs(c[0] - l.door[0]) + Math.abs(c[1] - l.door[1]) <= 1 && !heros.chemin) { arriver(cle); return; }
    allerA(l.door[0], l.door[1], function () { arriver(cle); });
  }
  function majMarche(dt) {
    var c = heros.chemin;
    if (!c) { heros.pas = 0; return; }
    var reste = VITESSE * dt * (S.vite ? 3 : 1);
    while (reste > 0 && c) {
      var cible = c[heros.i + 1];
      if (!cible) { heros.chemin = null; var f = heros.arrivee; heros.arrivee = null; S.x = heros.x; S.y = heros.y; if (f) f(); return; }
      var dx = cible[0] - heros.x, dy = cible[1] - heros.y, d = Math.hypot(dx, dy);
      if (d <= reste) { heros.x = cible[0]; heros.y = cible[1]; heros.i++; reste -= d; }
      else { heros.x += dx / d * reste; heros.y += dy / d * reste; reste = 0; }
      // à l'écran, x monte vers la droite-bas et y vers la gauche-bas
      if (Math.abs(dx - dy) > 0.01) heros.miroir = (dx - dy) < 0;
    }
    heros.dist += VITESSE * dt;
    var ph = Math.floor(heros.dist / 5) % 4;
    heros.pas = ph === 1 ? 1 : ph === 3 ? -1 : 0;
  }

  // les passants : des gens qui vont quelque part, pour que la ville respire
  function majPassants(dt) {
    var voulu = S.tranche === 4 ? 3 : S.tranche === 3 ? 6 : 10;
    while (passants.length < voulu) passants.push(nouveauPassant());
    if (passants.length > voulu) passants.length = voulu;
    for (var i = 0; i < passants.length; i++) {
      var q = passants[i];
      if (!q.chemin || q.i >= q.chemin.length - 1) { passants[i] = nouveauPassant(); continue; }
      var cible = q.chemin[q.i + 1], dx = cible[0] - q.x, dy = cible[1] - q.y, d = Math.hypot(dx, dy), v = 16 * dt;
      if (d <= v) { q.x = cible[0]; q.y = cible[1]; q.i++; } else { q.x += dx / d * v; q.y += dy / d * v; }
      if (Math.abs(dx - dy) > 0.01) q.miroir = (dx - dy) < 0;
      q.dist += v; var ph = Math.floor(q.dist / 4) % 4; q.pas = ph === 1 ? 1 : ph === 3 ? -1 : 0;
    }
  }
  function caseAuHasard(prochede) {
    for (var n = 0; n < 60; n++) {
      var cx, cy;
      if (prochede) { cx = prochede[0] + Math.floor((Math.random() - 0.5) * 70); cy = prochede[1] + Math.floor((Math.random() - 0.5) * 70); }
      else { cx = Math.floor(Math.random() * G); cy = Math.floor(Math.random() * G); }
      if (marchable(cx, cy)) return [cx, cy];
    }
    return null;
  }
  function nouveauPassant() {
    var pres = caseDe(heros.x, heros.y), a = caseAuHasard(pres), b = caseAuHasard(pres);
    var sorte = ["passant", "passante", "passant", "passante", "enfant", "fan"][Math.floor(Math.random() * 6)];
    var ch = a && b ? chemin(a, b) : null;
    var pts = ch ? ch.map(centre) : null;
    return { sp: sorte, chemin: pts, i: 0, x: pts ? pts[0][0] : -999, y: pts ? pts[0][1] : -999, miroir: false, pas: 0, dist: 0 };
  }

  // ─────────────────────────────────────────────────────────────── le rendu
  var dernier = 0;
  function image(ts) {
    if (!actif) { dernier = 0; return; }
    requestAnimationFrame(image);
    var dt = dernier ? Math.min(0.05, (ts - dernier) / 1000) : 0;
    dernier = ts;
    if (!occupe && !carteOn) { majMarche(dt); majPassants(dt); }
    // la caméra suit le héros, sauf si on l'a déplacée à la main
    var p = versImage(heros.x, heros.y, ZSOL + 8);
    if (!cam.libre) { cam.x += (p[0] - cam.x) * Math.min(1, dt * 6); cam.y += (p[1] - cam.y) * Math.min(1, dt * 6); }
    dessiner(ts);
    placerEtiquettes();
  }
  function dessinerTuiles(amb, alpha) {
    var x0 = Math.round(cam.x - VW / 2), y0 = Math.round(cam.y - VH / 2);
    ctx.globalAlpha = alpha;
    for (var r = 0; r < RANGS; r++) for (var c = 0; c < COLS; c++) {
      var tx = c * TUILE, ty = r * TUILE;
      if (tx > x0 + VW || ty > y0 + VH || tx + TUILE < x0 || ty + TUILE < y0) continue;
      var im = img(nomTuile(amb, r * COLS + c));
      if (im._ok) ctx.drawImage(im, tx - x0, ty - y0);
    }
    ctx.globalAlpha = 1;
  }
  function dessiner(ts) {
    ctx.fillStyle = "#0E0906";
    ctx.fillRect(0, 0, VW, VH);
    var amb = ambiance();
    if (amb0 && amb0 !== amb && fondu < 1) {
      dessinerTuiles(amb0, 1);
      fondu = Math.min(1, fondu + 0.03);
      dessinerTuiles(amb, fondu);
    } else { amb0 = amb; fondu = 1; dessinerTuiles(amb, 1); }
    // les gens, du fond vers l'avant (x + y croissant)
    var gens = [];
    for (var i = 0; i < passants.length; i++) if (passants[i].chemin) gens.push(passants[i]);
    presences().forEach(function (g) { gens.push(g); });
    figurants.forEach(function (g) { gens.push(g); });
    gens.push({ sp: S.role === "joueur" ? "joueur" : "coach", x: heros.x, y: heros.y, miroir: heros.miroir, pas: heros.pas, heros: true });
    gens.sort(function (a, b) { return (a.x + a.y) - (b.x + b.y); });
    for (var j = 0; j < gens.length; j++) {
      var g = gens[j];
      dessinerSprite(g.sp, g.x, g.y, { miroir: g.miroir, pas: g.pas, silhouette: !!g.heros });
    }
    // la marque du rendez-vous (jamais pour un événement sombre)
    var m = marqueRdv();
    if (m) dessinerMarque(m[0], m[1], ts);
  }
  // Ceux qu'on croise à leur place (ville.yaml → presences) — s'ils sont de la
  // distribution du postulat ou déjà entrés dans ta carrière — et celui qui
  // t'attend pour la carte en cours.
  function presences() {
    var out = [], tr = TRANCHES[S.tranche], deja = {};
    var r = rdvVisible() ? rdv : null;
    if (r && r.qui && SPRITES[r.qui] && LIEU[r.lieu]) {
      var l = LIEU[r.lieu]; var c = centre(l.door);
      out.push({ sp: r.qui, x: c[0] + 3, y: c[1] - 3, miroir: true, pas: 0 });
      deja[r.qui] = 1;
    }
    var cast = {};
    ((vue && vue.cast) || []).forEach(function (q) { cast[q] = 1; });
    (D.presences || []).forEach(function (p) {
      if (deja[p.qui] || !SPRITES[p.qui] || !LIEU[p.lieu]) return;
      if (!(cast[p.qui] || S.vus[p.qui])) return;
      if (p.tranches && p.tranches.indexOf(tr) < 0) return;
      var c = centre(LIEU[p.lieu].door);
      out.push({ sp: p.qui, x: c[0] - 4, y: c[1] + 2, miroir: false, pas: 0 });
      deja[p.qui] = 1;
    });
    return out;
  }

  // ─────────────────────────────────────────────────────────────── les étiquettes
  var etiquettes = {}, fleche = null;
  function placerEtiquettes() {
    var couche = $("villeCouche");
    if (!couche) return;
    var x0 = cam.x - VW / 2, y0 = cam.y - VH / 2;
    var hc = caseDe(heros.x, heros.y), cible = rdvVisible() ? rdv.lieu : null;
    var vus = {};
    for (var i = 0; i < L.places.length; i++) {
      var l = L.places[i];
      if (!l.door) continue;
      var sx = (l.u - x0) * k, sy = (l.v - y0) * k;
      var dedans = sx > -40 && sy > 30 && sx < VW * k + 40 && sy < VH * k + 40;
      var dist = Math.abs(l.door[0] - hc[0]) + Math.abs(l.door[1] - hc[1]);
      var montrer = dedans && (l.key === cible || dist < 34 || (k <= 1 && TEXTE_LIEU[l.key]));
      if (!montrer) continue;
      vus[l.key] = 1;
      var e = etiquettes[l.key];
      if (!e) {
        e = document.createElement("button");
        e.type = "button"; e.className = "v-lieu"; e.textContent = l.label;
        e.addEventListener("click", (function (cle) { return function (ev) { ev.stopPropagation(); allerAuLieu(cle); }; })(l.key));
        couche.appendChild(e); etiquettes[l.key] = e;
      }
      e.style.left = Math.round(sx) + "px"; e.style.top = Math.round(sy) + "px";
      e.classList.toggle("rdv", l.key === cible);
      e.classList.toggle("loin", dist >= 20 && l.key !== cible);
      e.hidden = false;
    }
    for (var key in etiquettes) if (!vus[key]) etiquettes[key].hidden = true;
    // la flèche vers le rendez-vous, quand il est hors de l'écran
    if (!fleche) {
      fleche = document.createElement("button");
      fleche.type = "button"; fleche.className = "v-fleche";
      fleche.addEventListener("click", function (ev) { ev.stopPropagation(); if (rdvVisible() && LIEU[rdv.lieu]) allerAuLieu(rdv.lieu); });
      couche.appendChild(fleche);
    }
    var L2 = cible && LIEU[cible];
    if (L2 && !vus[cible]) {
      var W = VW * k, H = VH * k, cx = W / 2, cy = H / 2;
      var tx = (L2.u - x0) * k, ty = (L2.v - y0) * k, dx = tx - cx, dy = ty - cy;
      var m = Math.max(Math.abs(dx) / (W / 2 - 70), Math.abs(dy) / (H / 2 - 150), 1);
      fleche.style.left = Math.round(cx + dx / m) + "px"; fleche.style.top = Math.round(cy + dy / m) + "px";
      var ang = Math.atan2(dy, dx), dir = ["→", "↘", "↓", "↙", "←", "↖", "↑", "↗"][(Math.round(ang / (Math.PI / 4)) + 8) % 8];
      fleche.textContent = dir + " " + L2.label;
      fleche.hidden = false;
    } else fleche.hidden = true;
  }

  // ─────────────────────────────────────────────────────────────── où va une carte
  function lieuDe(c) {
    var B = D.beats || {}, CL = D.cartes_lieux || {}, R = D.rencontres || {}, GN = D.genres || {};
    if (B[c.beatKind]) return B[c.beatKind];
    if (c.lieu && CL[c.lieu]) return CL[c.lieu];
    if (c.kind && GN[c.kind] === "ici") return "ici";
    if (c.speaker && R[c.speaker]) return R[c.speaker];
    if (c.kind && GN[c.kind]) return GN[c.kind];
    return S.tranche >= 3 ? "appartement" : "clubhouse";
  }
  function estSombre(c) { return (c.tags || []).indexOf("sombre") >= 0; }
  function cleVue(v) { return v && v.card ? (v.turn + ":" + v.card.id + ":" + v.season) : ""; }

  // La semaine : deux ou trois cartes, et le samedi ne bouge pas.
  function planifier(v) {
    var c = v.card, maintenant = tNow(), bk = c.beatKind, lieu = lieuDe(c);
    var r = { cle: cleVue(v), lieu: lieu, qui: c.speaker || null, type: "normal", debut: maintenant, fin: maintenant, force: "vient", sombre: false };
    function prochain(jour, tr, apresMaintenant) {
      var t = tDe(S.semaine, jour, tr);
      if (t < maintenant || (apresMaintenant && t === maintenant)) t += 35;
      return t;
    }
    if (bk === "match" || bk === "cup") {
      r.type = "match"; r.lieu = "stade";
      r.debut = r.fin = prochain(STADE_JOURS[bk], bk === "cup" ? 3 : 2, false);
      r.force = "scene";
    } else if (bk === "gm_te" || bk === "aftermatch") {
      r.type = "match"; r.lieu = "stade";
      r.debut = r.fin = (S.lieu === "stade" && S.auMatch) ? maintenant : prochain(5, 2, false);
      r.force = "scene";
    } else if (bk === "gm_annonce") {
      r.type = "normal"; r.lieu = "stade"; r.fin = Math.min(maintenant + 6, prochain(5, 1, false));
      r.force = "vient";
    } else if (bk === "classement" || bk === "bilan_une") {
      r.type = "dimanche"; r.lieu = "appartement";
      r.debut = r.fin = (S.jour === 6 || S.jour === 5 && S.tranche >= 3) ? maintenant : prochain(6, 0, false);
      if (bk === "bilan_une") r.debut = r.fin = maintenant;
      r.force = "scene";
    } else if (bk === "bilan_verdict" || bk === "bilan_contrat") {
      r.lieu = "clubhouse"; r.fin = maintenant + 3; r.force = "vient";
    } else if (bk === "bilan_carrefour") {
      r.lieu = "appartement"; r.debut = r.fin = maintenant; r.force = "scene";
    } else if (bk === "prologue") {
      r.type = "prologue"; r.fin = maintenant + 4; r.force = "vient";
    } else if (lieu === "ici" || c.kind === "reaction" || c.kind === "alarme") {
      r.type = "ici"; r.lieu = "ici"; r.debut = r.fin = maintenant; r.force = "ici";
    } else if (estSombre(c)) {
      // L'événement sombre ne prend pas rendez-vous : il arrive le soir même
      // (ou le lendemain soir), là où il doit arriver ; si tu y passes avant,
      // il t'y attend.
      r.type = "sombre"; r.sombre = true; r.qui = c.speaker || null;
      var soir = tDe(S.semaine, S.jour, 3);
      r.fin = maintenant < soir ? soir : soir + 5;
      if (lieu === "stade") r.fin = Math.min(r.fin + 0, prochain(5, 1, false));
      r.force = lieu === "rue" ? "rue" : "scene";
    } else {
      // une carte de la semaine : la première dès lundi, la deuxième mercredi,
      // la troisième vendredi ; deux jours pour y aller, et jamais après le samedi midi
      var rang = S.cartesSemaine, j0 = Math.min(4, rang * 2);
      var debut = Math.max(maintenant, tDe(S.semaine, j0, 0));
      var limite = tDe(S.semaine, 5, 1);
      if (rang >= 3 || debut > limite) debut = tDe(S.semaine + 1, 0, 0);
      var fin = debut + 9;
      if (semaineDe(debut) === S.semaine) fin = Math.min(fin, limite);
      if (fin <= debut) fin = debut + 1;
      r.debut = debut; r.fin = fin; r.force = "vient";
    }
    return r;
  }
  function rdvVisible() { return rdv && !rdv.sombre && rdv.lieu !== "ici" && rdv.lieu !== "rue" && tNow() >= rdv.debut; }
  function marqueRdv() {
    if (!rdvVisible() || !LIEU[rdv.lieu]) return null;
    var c = centre(LIEU[rdv.lieu].door);
    return rdv.qui && SPRITES[rdv.qui] ? [c[0] + 3, c[1] - 3] : [c[0], c[1]];
  }

  // ─────────────────────────────────────────────────────────────── l'arrivée de la carte
  function montrerCarte() {
    fermerPorte();
    carteOn = true;
    heros.chemin = null;
    $("gameScreen").classList.add("carte-on");
    $("villeVoile").classList.add("on");
    if (rdv) {
      if (rdv.type === "normal" || rdv.type === "prologue") S.cartesSemaine += (rdv.type === "normal" ? 1 : 0);
      if (rdv.qui) S.vus[rdv.qui] = 1;
      if (rdv.type === "match") S.auMatch = true;
      rdv.montree = true;
    }
    if (coquille) coquille.carte();
    sauver();
  }
  function cacherCarte() {
    carteOn = false;
    $("gameScreen").classList.remove("carte-on");
    $("villeVoile").classList.remove("on");
  }
  // Ce qui se passe quand l'heure du rendez-vous est passée : on vient te
  // chercher, ou la scène a lieu (le match, l'événement, le dimanche).
  function echeance() {
    if (!rdv || carteOn || occupe) return false;
    var t = tNow();
    if (rdv.force === "ici" || (t >= rdv.fin && rdv.force === "vient") || (t >= rdv.fin && rdv.force === "rue")) {
      if (rdv.force === "vient" && rdv.qui && CHARS[rdv.qui]) toast(nomDe(rdv.qui) + " ne t'a pas vu venir : c'est " + (CHARS[rdv.qui].genre === "f" ? "elle" : "lui") + " qui vient.");
      montrerCarte();
      return true;
    }
    if (t >= rdv.fin && rdv.force === "scene") { scene(rdv); return true; }
    return false;
  }
  function verifierRue() {
    // l'événement de la rue te tombe dessus pendant que tu marches
    if (!rdv || rdv.force !== "rue" || carteOn || occupe) return;
    if (tNow() < rdv.debut + 1) return;
    setTimeout(function () {
      if (!rdv || rdv.force !== "rue" || carteOn) return;
      heros.chemin = null;
      montrerCarte();
    }, 1600);
  }
  function arriver(cle) {
    S.lieu = cle;
    sauver();
    // le rendez-vous est ici, et c'est l'heure (ou l'événement t'y attendait)
    if (rdv && !carteOn && rdv.lieu === cle && tNow() >= rdv.debut) {
      if (rdv.force === "scene" || rdv.sombre) { scene(rdv); return; }
      montrerCarte();
      return;
    }
    ouvrirPorte(cle);
  }

  // La scène : un fondu, l'heure et le lieu, des figurants, puis la carte.
  var FIGURANTS = {
    stade: function (c) { return foule(c, 12, "fan", 9); },
    appartement: function (c) { return foule(c, 5, "fan", 5); },
    buvette: function (c) { return foule(c, 6, "fan", 6); },
    friche: function (c) { return foule(c, 4, "fan", 6); },
    laverie: function (c) { return [{ sp: "inconnu", x: c[0] + 4, y: c[1] - 2, miroir: true, pas: 0 }]; },
    voiture: function (c) { return [{ sp: "inconnu", x: c[0] + 5, y: c[1] + 1, miroir: true, pas: 0 }]; }
  };
  function foule(c, n, sp, r) {
    var out = [];
    for (var i = 0; i < n; i++) {
      var a = i * 2.39996, d = 3 + (i % 4) * r / 3;
      var x = c[0] + Math.cos(a) * d, y = c[1] + Math.sin(a) * d * 0.7;
      var cc = caseDe(x, y);
      if (!marchable(cc[0], cc[1])) continue;
      out.push({ sp: sp, x: x, y: y, miroir: i % 2 === 0, pas: 0 });
    }
    return out;
  }
  function scene(r) {
    if (occupe) return;
    occupe = true;
    var l = LIEU[r.lieu] || LIEU[S.lieu] || LIEU.appartement;
    var c = centre(l.door);
    var titre = r.type === "match" ? (JOUR_MOT[S.jour] + ", " + HEURE[TRANCHES[S.tranche]]) : (JOUR_MOT[S.jour] + ", " + HEURE[TRANCHES[S.tranche]]);
    var sous = l.label;
    if (r.type === "match" && vue && vue.card && vue.card.beatKind === "cup") sous = "La Coupe · " + l.label;
    fonduTexte(titre, sous, r.sombre ? "" : "", function () {
      poser(c[0], c[1]); S.lieu = l.key;
      var p = versImage(heros.x, heros.y, ZSOL + 8); cam.x = p[0]; cam.y = p[1]; cam.libre = false;
      figurants = [];
      var f = FIGURANTS[l.key];
      if (r.sombre && f) figurants = f(c);
      else if (r.type === "match") figurants = foule(c, 10, "fan", 9);
    }, function () {
      occupe = false;
      setTimeout(montrerCarte, r.sombre ? 900 : 300);
    });
  }

  // ─────────────────────────────────────────────────────────────── le temps qui passe
  function avancer(n) {
    for (var i = 0; i < n; i++) {
      if (!pas()) return false;
    }
    majHud();
    sauver();
    return true;
  }
  // une tranche : le corps s'use, et l'heure du rendez-vous peut sonner
  function pas() {
    var nuit = S.tranche === 4;
    S.faim = clamp(S.faim - (nuit ? 4 : 8), 0, 100);
    S.energie = clamp(S.energie - (nuit ? 8 : 2) - (S.faim <= 0 ? 6 : 0), 0, 100);
    S.tranche++;
    if (S.tranche > 4) { S.tranche = 0; nouveauJour(); }
    if (S.faim <= 0) S.energie = Math.min(S.energie, 50);
    if (S.energie <= 0) { effondrement(); return false; }
    if (echeance()) return false;
    return true;
  }
  function nouveauJour() {
    S.jour++;
    S.jourFaits = {};
    if (S.jour > 6) { S.jour = 0; nouvelleSemaine(); }
  }
  function nouvelleSemaine() {
    S.semaine++;
    S.cartesSemaine = 0;
    S.auMatch = false;
    S.francs += SALAIRE[S.role] || 800;
    var j = (vue && vue.journee) || 0, dj = j - (S.journeeDebut || 0);
    S.journeeDebut = j;
    var phrase = dj >= 3 ? dj + " semaines plus tard" : dj >= 1 ? "Quelques semaines plus tard" : "La semaine suivante";
    attente.push({ titre: phrase, sous: moisCourant(), texte: "La paie est tombée : " + (SALAIRE[S.role] || 800) + " F." });
  }
  var attente = [];
  function effondrement() {
    var l = LIEU.appartement, c = centre(l.door);
    fonduTexte("Tu t'effondres", JOUR_MOT[S.jour] + ", " + HEURE[TRANCHES[S.tranche]], "On te ramène chez toi. Tu dors jusqu'au lendemain midi.", function () {
      poser(c[0], c[1]); S.lieu = "appartement";
      while (S.tranche !== 1 || !S._dormi) { S.tranche++; if (S.tranche > 4) { S.tranche = 0; nouveauJour(); S._dormi = true; } }
      S._dormi = false;
      S.energie = 45; S.faim = clamp(S.faim, 10, 100);
    }, function () { majHud(); sauver(); echeance(); });
  }
  function dormir() {
    // jusqu'au matin suivant ; la nuit peut être interrompue par un rendez-vous (ou un événement)
    var depart = S.semaine;
    S.energie = clamp(S.energie + 60, 0, 100);
    S.faim = clamp(S.faim - 10, 0, 100);
    var garde = 0;
    do { S.tranche++; if (S.tranche > 4) { S.tranche = 0; nouveauJour(); } } while (S.tranche !== 0 && ++garde < 10);
    majHud(); sauver();
    var titre = JOUR_MOT[S.jour] + ", 7 h";
    fonduTexte(titre, moisCourant(), S.semaine !== depart ? "" : "", null, function () { suiteFondus(); echeance(); });
  }
  function suiteFondus() {
    if (!attente.length) return;
    var a = attente.shift();
    fonduTexte(a.titre, a.sous, a.texte, null, suiteFondus);
  }

  // ─────────────────────────────────────────────────────────────── le fondu
  function fonduTexte(titre, sous, texte, auNoir, ensuite) {
    var f = $("villeFondu");
    f.querySelector("b").textContent = titre || "";
    f.querySelector("span").textContent = sous || "";
    var p = f.querySelector("p"); p.textContent = texte || ""; p.hidden = !texte;
    f.classList.add("on");
    var duree = texte ? 2300 : 1300;
    setTimeout(function () {
      if (auNoir) auNoir();
      setTimeout(function () { f.classList.remove("on"); setTimeout(function () { if (ensuite) ensuite(); }, 380); }, duree);
    }, 420);
  }
  var toastT = 0;
  function toast(msg) {
    var t = $("villeToast");
    if (!t || !msg) return;
    t.textContent = msg;
    t.classList.add("on");
    clearTimeout(toastT);
    toastT = setTimeout(function () { t.classList.remove("on"); }, 4200);
  }

  // ─────────────────────────────────────────────────────────────── la porte
  function ouvert(def) {
    var tr = TRANCHES[S.tranche], j = JOURS[S.jour];
    if (def.heures && def.heures.indexOf(tr) < 0) return false;
    if (def.jours && def.jours.indexOf(j) < 0) return false;
    return true;
  }
  function activitesIci(cle) {
    return (D.activites || []).filter(function (a) { return a.lieu === cle && (!a.roles || a.roles.indexOf(S.role) >= 0); });
  }
  function pourquoiPas(a, lieuOuvert) {
    if (!lieuOuvert) return "Fermé à cette heure.";
    if (!ouvert(a)) return "Pas à cette heure-ci.";
    if (a.energie < 0 && S.energie + a.energie < 0) return "Tu n'as plus l'énergie.";
    if (a.francs < 0 && S.francs + a.francs < 0) return "Pas assez de francs.";
    if (a.max_jour && (S.jourFaits[a.id] || 0) >= a.max_jour) return "Déjà fait aujourd'hui.";
    if (a.tranches > 0 && S.tranche === 4 && !a.nuit) return "Il est trop tard.";
    return "";
  }
  function coutHtml(a) {
    var out = [];
    if (a.tranches > 0) out.push('<span>' + (a.tranches === 1 ? "1 tranche" : a.tranches + " tranches") + '</span>');
    if (a.nuit) out.push('<span>la nuit</span>');
    if (a.energie) out.push('<span class="' + (a.energie > 0 ? "up" : "dn") + '">énergie ' + (a.energie > 0 ? "+" : "−") + Math.abs(a.energie) + '</span>');
    if (a.faim) out.push('<span class="' + (a.faim > 0 ? "up" : "dn") + '">faim ' + (a.faim > 0 ? "+" : "−") + Math.abs(a.faim) + '</span>');
    if (a.francs) out.push('<span class="' + (a.francs > 0 ? "up" : "dn") + '">' + (a.francs > 0 ? "+" : "−") + Math.abs(a.francs) + ' F</span>');
    var J = a.jauges || {};
    Object.keys(J).sort().forEach(function (g) {
      var deja = S.faits[a.id] === S.semaine;
      out.push('<span class="j ' + (deja ? "" : J[g] > 0 ? "up" : "dn") + '">' + icone(g === "direction" ? "president" : g, 13) + (deja ? "·" : (J[g] > 0 ? "▲" : "▼")) + '</span>');
    });
    return out.join("");
  }
  function ouvrirPorte(cle, fait) {
    var l = LIEU[cle];
    if (!l) return;
    porteOuverte = cle;
    var def = TEXTE_LIEU[cle] || {};
    var lieuOuvert = ouvert(def) || (rdv && rdv.lieu === cle);
    var el = $("villePorte");
    var acts = activitesIci(cle);
    var html = '<h2>' + esc(l.label) + '</h2>' +
      '<p class="v-sous">' + esc(JOUR_MOT[S.jour] + " · " + TRANCHE_MOT[TRANCHES[S.tranche]].toLowerCase()) + (lieuOuvert ? "" : " · fermé") + '</p>' +
      (def.texte ? '<p class="v-texte">' + esc(def.texte) + '</p>' : "") +
      '<p class="v-fait"' + (fait ? "" : " hidden") + '>' + esc(fait || "") + '</p>';
    // le rendez-vous de plus tard, s'il est ici
    if (rdv && rdv.lieu === cle && !rdv.sombre && tNow() < rdv.debut) {
      html += '<p class="v-texte">' + esc((rdv.qui ? nomDe(rdv.qui) : "On") + " t'attend ici " + quand(rdv.debut) + ".") + '</p>';
    }
    if (acts.length) {
      html += '<div class="v-acts">';
      acts.forEach(function (a) {
        var non = pourquoiPas(a, lieuOuvert);
        var deja = a.jauges && S.faits[a.id] === S.semaine;
        html += '<button type="button" class="v-act" data-act="' + esc(a.id) + '"' + (non ? " disabled" : "") + '>' +
          '<b>' + esc(a.label) + '</b><span class="cout">' + coutHtml(a) + '</span>' +
          (non ? '<span class="pourquoi">' + esc(non) + '</span>' : deja ? '<span class="pourquoi">Déjà fait cette semaine : ça fatigue sans rien changer.</span>' : "") +
          '</button>';
      });
      html += '</div>';
    }
    html += '<button type="button" class="v-sortir">Sortir</button>';
    el.innerHTML = html;
    el.classList.add("on");
    el.querySelectorAll(".v-act").forEach(function (b) {
      b.addEventListener("click", function () { faire(b.getAttribute("data-act")); });
    });
    el.querySelector(".v-sortir").addEventListener("click", fermerPorte);
  }
  function fermerPorte() {
    porteOuverte = null;
    var el = $("villePorte");
    if (el) el.classList.remove("on");
  }
  function faire(id) {
    var a = null;
    (D.activites || []).forEach(function (x) { if (x.id === id) a = x; });
    if (!a || carteOn || occupe) return;
    var cle = porteOuverte;
    if (pourquoiPas(a, true)) return;
    S.francs += a.francs || 0;
    S.faim = clamp(S.faim + (a.faim || 0), 0, 100);
    if (!a.nuit) S.energie = clamp(S.energie + (a.energie || 0), 0, 100);
    S.jourFaits[a.id] = (S.jourFaits[a.id] || 0) + 1;
    var texte = a.texte;
    if (a.jauges && S.faits[a.id] !== S.semaine) {
      S.faits[a.id] = S.semaine;
      vue = coquille.activite(a.id);
      if (vue.over) return;
    } else if (a.jauges) texte += " Cette semaine, ça ne change plus rien.";
    if (a.nuit) { fermerPorte(); dormir(); return; }
    var ok = avancer(a.tranches || 0);
    majHud(); sauver();
    if (ok && !carteOn && !occupe && cle) ouvrirPorte(cle, texte);
    else toast(texte);
  }

  // ─────────────────────────────────────────────────────────────── le HUD
  var CHARS = {};
  function nomDe(id) { var c = CHARS[id]; return c ? c.name : id; }
  function majHud() {
    var h = $("villeHud");
    if (!h || !S) return;
    h.querySelector(".v-temps b").textContent = JOUR_MOT[S.jour] + " · " + TRANCHE_MOT[TRANCHES[S.tranche]];
    h.querySelector(".v-temps span").textContent = "Semaine " + S.semaine + " · " + moisCourant();
    var be = h.querySelector(".v-energie"), bf = h.querySelector(".v-faim");
    be.querySelector("u").style.width = S.energie + "%"; be.classList.toggle("bas", S.energie <= 20);
    bf.querySelector("u").style.width = S.faim + "%"; bf.classList.toggle("bas", S.faim <= 15);
    var fr = h.querySelector(".v-francs");
    fr.textContent = S.francs.toLocaleString("fr-FR") + " F"; fr.classList.toggle("bas", S.francs < 100);
    var r = h.querySelector(".v-rdv");
    if (rdv && !rdv.sombre && rdv.lieu !== "ici" && rdv.lieu !== "rue" && LIEU[rdv.lieu]) {
      var qui = rdv.qui ? nomDe(rdv.qui) : "On";
      var ou = LIEU[rdv.lieu].label;
      var txt;
      if (rdv.type === "match") txt = "<b>" + (vue && vue.card && vue.card.beatKind === "cup" ? "La Coupe" : "Le match") + "</b> · " + esc(ou) + " · " + esc(quand(rdv.debut)) + ", " + HEURE[TRANCHES[trancheDe(rdv.debut)]];
      else if (rdv.type === "dimanche") txt = "<b>Le journal du dimanche</b> · chez toi";
      else if (tNow() < rdv.debut) txt = "<b>" + esc(qui) + "</b> t'attendra · " + esc(ou) + " · " + esc(quand(rdv.debut));
      else txt = "<b>" + esc(qui) + "</b> t'attend · " + esc(ou) + " · avant " + esc(quand(rdv.fin));
      r.innerHTML = txt; r.hidden = false;
    } else r.hidden = true;
    var bt = $("villeAttendre");
    if (bt) bt.disabled = carteOn || occupe;
  }

  // ─────────────────────────────────────────────────────────────── le plan
  function ouvrirPlan() {
    if (!coquille) return;
    var html = '<div class="v-plan">';
    if (rdvVisible() && LIEU[rdv.lieu]) {
      html += '<h3>On t\'attend</h3><button type="button" class="rdv" data-l="' + esc(rdv.lieu) + '"><span>' + esc(LIEU[rdv.lieu].label) + '</span><i>' + esc(rdv.qui ? nomDe(rdv.qui) : "") + '</i></button>';
    }
    var parQ = {};
    L.places.forEach(function (l) { if (l.door && TEXTE_LIEU[l.key]) (parQ[l.district] = parQ[l.district] || []).push(l); });
    var QUARTIERS = [["residentiel", "La rue des Lilas"], ["stade", "Le carrefour du stade"], ["sport", "Le terrain annexe"], ["sante", "Le quartier de la santé"], ["vieilleville", "La vieille ville, de l'autre côté de la Rive"], ["cimetiere", "Le cimetière"], ["friche", "La friche"]];
    QUARTIERS.forEach(function (q) {
      var ls = parQ[q[0]];
      if (!ls) return;
      html += '<h3>' + esc(q[1]) + '</h3>';
      ls.forEach(function (l) {
        var def = TEXTE_LIEU[l.key] || {};
        var etat = ouvert(def) ? "" : "fermé";
        html += '<button type="button" data-l="' + esc(l.key) + '"><span>' + esc(l.label) + '</span><i>' + esc(etat) + '</i></button>';
      });
    });
    html += '</div>';
    coquille.panneau("Aubérive", html);
    document.querySelectorAll(".v-plan button[data-l]").forEach(function (b) {
      b.addEventListener("click", function () { coquille.fermer(); allerAuLieu(b.getAttribute("data-l")); });
    });
  }
  // attendre : une tranche passe, là où tu es
  function attendre() {
    if (carteOn || occupe) return;
    fermerPorte();
    if (S.tranche === 4) {
      if (S.lieu === "appartement") { dormir(); return; }
      toast("Il est tard. Rentre dormir : la nuit, tout peut arriver.");
    }
    avancer(1);
    if (!carteOn && !occupe && S.lieu && LIEU[S.lieu] && TEXTE_LIEU[S.lieu]) {
      var c = caseDe(heros.x, heros.y), l = LIEU[S.lieu];
      if (Math.abs(c[0] - l.door[0]) + Math.abs(c[1] - l.door[1]) <= 1) ouvrirPorte(S.lieu);
    }
  }

  // ─────────────────────────────────────────────────────────────── la sauvegarde
  function sauver() {
    if (!S || !coquille) return;
    try {
      localStorage.setItem(CLE_SAUVE, JSON.stringify({ v: 1, moteur: coquille.sauver(), ville: S, rdv: rdv, graine: coquille.graine(), quand: Date.now() }));
    } catch (e) {}
  }
  function lireSauve() {
    try { var s = JSON.parse(localStorage.getItem(CLE_SAUVE) || "null"); return s && s.v === 1 && s.moteur ? s : null; } catch (e) { return null; }
  }
  function effacerSauve() { try { localStorage.removeItem(CLE_SAUVE); } catch (e) {} }

  // ─────────────────────────────────────────────────────────────── l'entrée
  function brancherEntrees() {
    var depart = null, bouge = false;
    cv.addEventListener("pointerdown", function (e) {
      if (carteOn || occupe) return;
      depart = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y }; bouge = false;
      try { cv.setPointerCapture(e.pointerId); } catch (x) {}
    });
    cv.addEventListener("pointermove", function (e) {
      if (!depart) return;
      var dx = e.clientX - depart.x, dy = e.clientY - depart.y;
      if (!bouge && Math.hypot(dx, dy) > 8) bouge = true;
      if (bouge) { cam.libre = true; cam.x = depart.cx - dx / k; cam.y = depart.cy - dy / k; }
    });
    function fin(e) {
      if (!depart) return;
      var tape = !bouge;
      depart = null;
      if (!tape || carteOn || occupe) return;
      var u = cam.x - VW / 2 + e.clientX / k, v = cam.y - VH / 2 + e.clientY / k;
      // un lieu sous le doigt (sa porte, ou son nom) ?
      var best = null, bd = 30 * 30;
      L.places.forEach(function (l) {
        if (!l.door) return;
        var c = centre(l.door), p = versImage(c[0], c[1], ZSOL);
        var d1 = (p[0] - u) * (p[0] - u) + (p[1] - v) * (p[1] - v), d2 = (l.u - u) * (l.u - u) + (l.v - v) * (l.v - v);
        var d = Math.min(d1, d2);
        if (d < bd) { bd = d; best = l; }
      });
      if (best) { allerAuLieu(best.key); return; }
      var s = versSol(u, v), c = caseDe(s[0], s[1]);
      var cible = plusProche(c[0], c[1], 10);
      if (cible) { S.lieu = null; allerA(cible[0], cible[1], null); }
    }
    cv.addEventListener("pointerup", fin);
    cv.addEventListener("pointercancel", function () { depart = null; });
    cv.addEventListener("wheel", function (e) {
      e.preventDefault();
      zoom(e.deltaY < 0 ? 1 : -1);
    }, { passive: false });
    window.addEventListener("resize", taille);
    document.addEventListener("keydown", function (e) {
      if (!actif || carteOn || occupe || (coquille && coquille.panneauOuvert())) return;
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
      if (e.key === "Escape") { fermerPorte(); return; }
      var dir = { ArrowUp: [-1, -1], ArrowDown: [1, 1], ArrowLeft: [-1, 1], ArrowRight: [1, -1] }[e.key];
      if (!dir) return;
      e.preventDefault();
      var c = caseDe(heros.x, heros.y), n = plusProche(c[0] + dir[0] * 6, c[1] + dir[1] * 6, 4);
      if (n) { S.lieu = null; allerA(n[0], n[1], null); }
    });
  }
  function zoom(sens) {
    var z = clamp((S && S.zoom ? S.zoom : k) + sens, 1, 4);
    if (S) S.zoom = z;
    taille();
  }

  // ─────────────────────────────────────────────────────────────── la construction
  function construire() {
    document.body.classList.add("ville-on");
    cv = document.createElement("canvas"); cv.id = "villeCanvas"; cv.hidden = true;
    cv.setAttribute("aria-label", "La ville : touche un lieu pour y aller");
    document.body.insertBefore(cv, document.body.firstChild);
    ctx = cv.getContext("2d");
    var couche = document.createElement("div"); couche.id = "villeCouche"; couche.hidden = true;
    document.body.insertBefore(couche, cv.nextSibling);
    var voile = document.createElement("div"); voile.id = "villeVoile";
    document.body.appendChild(voile);
    var gs = $("gameScreen");
    // l'état de la ville, sous le rail ; un espace ; les actions, au-dessus du bandeau
    var hud = document.createElement("div"); hud.className = "v-hud"; hud.id = "villeHud";
    hud.innerHTML = '<div class="v-temps"><b></b><span></span></div>' +
      '<div class="v-corps"><div class="v-besoin v-energie"><i>Énergie</i><div class="barre"><u></u></div></div>' +
      '<div class="v-besoin v-faim"><i>Faim</i><div class="barre"><u></u></div></div><div class="v-francs"></div></div>' +
      '<p class="v-rdv" hidden></p>';
    var rail = $("rail");
    rail.parentNode.insertBefore(hud, rail.nextSibling);
    var espace = document.createElement("div"); espace.className = "v-espace";
    var actions = document.createElement("div"); actions.className = "v-actions";
    actions.innerHTML = '<button type="button" id="villePlan">' + icone("carte", 15) + 'Plan</button>' +
      '<button type="button" id="villeAttendre">' + icone("horloge", 15) + 'Attendre</button>' +
      '<button type="button" id="villeRdv">' + icone("fleche", 15) + 'Y aller</button>';
    var bandeau = $("bandeau");
    gs.insertBefore(espace, bandeau);
    gs.insertBefore(actions, bandeau);
    var porte = document.createElement("div"); porte.className = "v-porte"; porte.id = "villePorte"; porte.setAttribute("role", "dialog"); porte.setAttribute("aria-label", "Le lieu");
    document.body.appendChild(porte);
    var fondu = document.createElement("div"); fondu.className = "v-fondu"; fondu.id = "villeFondu"; fondu.setAttribute("aria-live", "polite");
    fondu.innerHTML = '<b></b><span></span><p hidden></p>';
    document.body.appendChild(fondu);
    var t = document.createElement("div"); t.className = "v-toast"; t.id = "villeToast"; t.setAttribute("role", "status");
    document.body.appendChild(t);
    var z = document.createElement("div"); z.className = "v-zoom";
    z.innerHTML = '<button type="button" aria-label="Rapprocher">+</button><button type="button" aria-label="Éloigner">−</button>';
    gs.parentNode.appendChild(z);
    z.children[0].addEventListener("click", function () { zoom(1); });
    z.children[1].addEventListener("click", function () { zoom(-1); });
    $("villePlan").addEventListener("click", ouvrirPlan);
    $("villeAttendre").addEventListener("click", attendre);
    $("villeRdv").addEventListener("click", function () {
      if (rdv && LIEU[rdv.lieu] && !rdv.sombre) { if (tNow() < rdv.debut) avancerJusquA(rdv.debut); else allerAuLieu(rdv.lieu); }
      else toast("Personne ne t'attend. La ville est à toi.");
    });
    taille();
    brancherEntrees();
  }
  // le temps file jusqu'au rendez-vous (et s'arrête si quelque chose arrive avant)
  function avancerJusquA(t) {
    if (carteOn || occupe) return;
    fermerPorte();
    var garde = 0;
    while (tNow() < t && garde++ < 80) {
      if (S.tranche === 4) {
        // la nuit, on rentre dormir
        var c = centre(LIEU.appartement.door); poser(c[0], c[1]); S.lieu = "appartement";
        dormir();
        return;
      }
      if (!pas()) { majHud(); sauver(); return; }
    }
    majHud(); sauver();
    suiteFondus();
    if (rdv && LIEU[rdv.lieu] && !carteOn && !occupe) allerAuLieu(rdv.lieu);
  }

  function chargerJson(nom) {
    return fetch(BASE + nom).then(function (r) { if (!r.ok) throw new Error(nom + " : " + r.status); return r.json(); });
  }
  var pret = false, enAttente = null;
  function charger() {
    return Promise.all([chargerJson("lieux.json"), chargerJson("grille.json"), chargerJson("sprites.json")]).then(function (r) {
      L = r[0]; P = L.projection || P; ZSOL = 2 + (P.zl || 10);
      L.places.forEach(function (l) { LIEU[l.key] = l; });
      var gr = r[1]; G = gr.size; CELL = gr.cell;
      var bits = atob(gr.bits); grille = new Uint8Array(G * G);
      for (var i = 0; i < G * G; i++) grille[i] = (bits.charCodeAt(i >> 3) >> (i & 7)) & 1;
      SPRITES = r[2];
      pret = true;
      if (enAttente) { var f = enAttente; enAttente = null; f(); }
    }).catch(function (e) {
      toast("La ville n'a pas pu se charger : " + e.message);
    });
  }

  // ─────────────────────────────────────────────────────────────── l'écran titre
  function boutonReprendre() {
    var s = lireSauve(), old = $("villeReprendre");
    if (old) old.parentNode.removeChild(old);
    if (!s) return;
    var b = document.createElement("button");
    b.type = "button"; b.className = "v-reprendre"; b.id = "villeReprendre";
    var v = s.ville || {};
    b.innerHTML = '<b>Reprendre</b><span>' + esc((v.nom || "") + " · " + (JOUR_MOT[v.jour] || "") + ", semaine " + (v.semaine || 1)) + '</span>';
    b.addEventListener("click", function () { reprendre(s); });
    var ident = $("nameForm");
    ident.parentNode.insertBefore(b, ident);
  }
  function reprendre(s) {
    var faire = function () {
      S = s.ville; rdv = s.rdv || null;
      S.vus = S.vus || {}; S.faits = S.faits || {}; S.jourFaits = S.jourFaits || {};
      dernierVu = rdv ? rdv.cle : "";
      lancer();
      poser(S.x, S.y);
      var p = versImage(heros.x, heros.y, ZSOL + 8); cam.x = p[0]; cam.y = p[1];
      vue = coquille.reprendre(s.moteur, s.graine && s.graine.postulat, s.graine && s.graine.seed);
    };
    if (pret) faire(); else enAttente = faire;
  }

  function lancer() {
    actif = true;
    cv.hidden = false; $("villeCouche").hidden = false;
    taille();
    requestAnimationFrame(image);
  }

  // ─────────────────────────────────────────────────────────────── l'API (la coquille appelle)
  window.FusibleVille = {
    noms: { ville: "Aubérive", club: "Racing Aubérive" },
    // la coquille est prête : on construit la couche et on charge les images
    pret: function () {
      coquille = window.FusibleCoquille;
      try {
        var content = JSON.parse(document.getElementById("fusible-content").textContent);
        D = content.ville || {};
        (content.characters || []).forEach(function (c) { CHARS[c.id] = c; });
      } catch (e) { D = {}; }
      (D.lieux || []).forEach(function (l) { TEXTE_LIEU[l.key] = l; });
      construire();
      charger();
      boutonReprendre();
    },
    // une carrière commence (avant la première vue)
    debut: function (v) {
      var faire = function () {
        S = {
          v: 1, nom: (v.entities && v.entities.protagonist) || "", role: v.role,
          semaine: 1, jour: 0, tranche: 0, energie: 80, faim: 70, francs: 1240,
          x: 0, y: 0, lieu: "appartement", cartesSemaine: 0, faits: {}, jourFaits: {}, vus: {},
          journeeDebut: v.journee || 0, auMatch: false, zoom: 0
        };
        rdv = null; dernierVu = ""; figurants = []; passants = [];
        lancer();
        var c = centre(LIEU.appartement.door); poser(c[0], c[1]);
        var p = versImage(heros.x, heros.y, ZSOL + 8); cam.x = p[0]; cam.y = p[1];
        fonduTexte((v.entities && v.entities.ville ? v.entities.ville : "Aubérive"), moisCourant(),
          "Deux pièces au troisième, rue des Lilas. Le " + ((v.entities && v.entities.club) || "club") + " t'attend. La ville aussi.", null, null);
      };
      if (pret) faire(); else enAttente = faire;
    },
    // une nouvelle vue du moteur : après un choix, une activité, une reprise
    vue: function (v) {
      var go = function () {
        if (!S) return;
        vue = v;
        S.role = v.role;
        var cle = cleVue(v);
        if (cle === dernierVu && rdv) {
          // même carte (une activité a bougé les jauges) : rien à replanifier
          if (!carteOn) majHud();
          return;
        }
        var avant = carteOn;
        dernierVu = cle;
        figurants = figurants.filter(function () { return false; });
        if (v.lastAnswer && avant) setTimeout(function () { toast(v.lastAnswer); }, 380);
        // le match prend l'après-midi ; on rentre au vestiaire, puis le soir tombe
        var etait = rdv;
        rdv = planifier(v);
        if (etait && etait.type === "match" && rdv.type !== "match") { S.auMatch = false; if (S.tranche < 3) S.tranche = 3; }
        // la carte suivante est-elle pour tout de suite ?
        var t = tNow();
        if (rdv.force === "ici" || (rdv.lieu === S.lieu && t >= rdv.debut && rdv.force !== "rue" && !rdv.sombre) || (rdv.force === "scene" && t >= rdv.fin && rdv.type !== "sombre" && rdv.lieu === S.lieu)) {
          if (avant) { if (coquille) coquille.carte(); carteOn = true; if (rdv.qui) S.vus[rdv.qui] = 1; rdv.montree = true; majHud(); sauver(); return; }
          montrerCarte();
          return;
        }
        cacherCarte();
        majHud();
        sauver();
        // l'échéance a peut-être déjà sonné (un événement du soir, quand il fait déjà nuit)
        setTimeout(function () { suiteFondus(); if (!echeance() && rdv.force === "rue") verifierRue(); }, 600);
      };
      if (pret) go(); else enAttente = go;
    },
    carteVisible: function () { return carteOn; },
    fin: function () {
      actif = false; carteOn = false;
      effacerSauve();
      if (cv) cv.hidden = true;
      var c = $("villeCouche"); if (c) c.hidden = true;
      fermerPorte();
      $("villeVoile").classList.remove("on");
      $("gameScreen").classList.remove("carte-on");
      setTimeout(boutonReprendre, 0);
    }
  };
})();
