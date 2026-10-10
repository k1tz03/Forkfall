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
  // La paie d'une semaine de championnat, en francs de 1990 : D1, D2, D3.
  // Le président tire des indemnités du club ; le sélectionneur est payé par la
  // Fédération, quelle que soit la division.
  var SALAIRE = { entraineur: [20000, 6000, 3000], joueur: [14000, 5000, 2200], ds: [16000, 6000, 3000],
    president: [9000, 4000, 2000], selectionneur: [22000, 22000, 22000] };
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
  // Deux grilles : celle où l'on peut marcher (`grille`, 4 × 4 voxels par case),
  // et sa version « au large » (`LARGE`) — les cases dont les huit voisines sont
  // praticables aussi. Les passants marchent au large : un corps de dix pixels
  // qui longe une façade à moins d'une case finit par mordre dedans.
  var LARGE = null;
  function marchable(cx, cy) { return cx >= 0 && cy >= 0 && cx < G && cy < G && grille[cy * G + cx] === 1; }
  function auLarge(cx, cy) { return cx >= 0 && cy >= 0 && cx < G && cy < G && LARGE[cy * G + cx] === 1; }
  function calculerLarge() {
    LARGE = new Uint8Array(G * G);
    for (var y = 1; y < G - 1; y++) for (var x = 1; x < G - 1; x++) {
      var ok = 1;
      for (var dy = -1; dy <= 1 && ok; dy++) for (var dx = -1; dx <= 1; dx++) if (grille[(y + dy) * G + x + dx] !== 1) { ok = 0; break; }
      LARGE[y * G + x] = ok;
    }
  }
  function caseDe(x, y) { return [Math.floor(x / CELL), Math.floor(y / CELL)]; }
  function centre(c) { return [c[0] * CELL + CELL / 2, c[1] * CELL + CELL / 2]; }
  function plusProche(cx, cy, rayon, ok) {
    ok = ok || marchable;
    if (ok(cx, cy)) return [cx, cy];
    for (var r = 1; r <= (rayon || 12); r++) {
      var best = null, bd = 1e9;
      for (var dy = -r; dy <= r; dy++) for (var dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r || !ok(cx + dx, cy + dy)) continue;
        var d = dx * dx + dy * dy;
        if (d < bd) { bd = d; best = [cx + dx, cy + dy]; }
      }
      if (best) return best;
    }
    return null;
  }
  // A* sur la grille, huit directions sans couper les coins. Pour les passants
  // (`gens`), une case collée à un mur coûte trois fois plus : ils tiennent le
  // milieu du trottoir, et ne rasent les murs que pour franchir une porte.
  var AS = null;
  function chemin(a, b, gens) {
    if (!a || !b) return null;
    var N = G * G;
    if (!AS || AS.n !== N) AS = { n: N, ga: new Float32Array(N), de: new Int32Array(N), ferme: new Uint8Array(N) };
    var ga = AS.ga.fill(Infinity), de = AS.de.fill(-1), ferme = AS.ferme.fill(0);
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
        var nk = ny * G + nx, g = ga[k] + DIRS[i][2] * (gens && !LARGE[nk] ? 3 : 1);
        if (g < ga[nk]) { ga[nk] = g; de[nk] = k; push(nk, g + h(nk)); }
      }
    }
    if (de[ib] < 0 && ia !== ib) return null;
    var pts = [], c = ib;
    while (c >= 0) { pts.push([c % G, Math.floor(c / G)]); if (c === ia) break; c = de[c]; }
    pts.reverse();
    return lisser(pts, gens ? auLarge : marchable);
  }
  // Le segment de centre à centre ne passe que par des cases libres : on
  // parcourt TOUTES les cases qu'il touche (pas seulement celles d'un tracé de
  // Bresenham), et quand il passe pile par un coin, les deux cases du coin
  // doivent être libres — sinon le segment rase l'angle d'un mur.
  function vue_libre(a, b, ok) {
    ok = ok || marchable;
    var x = a[0], y = a[1], nx = Math.abs(b[0] - x), ny = Math.abs(b[1] - y);
    var sx = b[0] > x ? 1 : -1, sy = b[1] > y ? 1 : -1, ix = 0, iy = 0;
    if (!ok(x, y)) return false;
    while (ix < nx || iy < ny) {
      var cmp = (1 + 2 * ix) * ny - (1 + 2 * iy) * nx;
      if (cmp === 0) {
        if (!ok(x + sx, y) || !ok(x, y + sy)) return false;
        x += sx; y += sy; ix++; iy++;
      } else if (cmp < 0) { x += sx; ix++; } else { y += sy; iy++; }
      if (!ok(x, y)) return false;
    }
    return true;
  }
  function lisser(pts, ok) {
    if (pts.length < 3) return pts;
    var out = [pts[0]], i = 0;
    while (i < pts.length - 1) {
      var j = pts.length - 1;
      while (j > i + 1 && !vue_libre(pts[i], pts[j], ok)) j--;
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
  // `opt.pal` remplace des couleurs (les passants ne sont pas des clones) ;
  // `opt.alpha` fond le corps (on passe une porte) ; la boîte dessinée revient,
  // pour qu'un doigt puisse toucher quelqu'un.
  function dessinerSprite(sp, x, y, opt) {
    var def = SPRITES[sp];
    if (!def) return null;
    var rows = def.rows, h = rows.length, w = rows[0].length;
    var miroir = !!opt.miroir, pas = opt.pas || 0, alpha = opt.alpha == null ? 1 : opt.alpha;
    if (alpha <= 0.02) return null;
    var ax = miroir ? w - 1 - def.ax : def.ax;
    var p = versImage(x, y, ZSOL), u0 = Math.round(p[0]), v0 = Math.round(p[1]);
    var ox = u0 - Math.round(cam.x - VW / 2), oy = v0 - Math.round(cam.y - VH / 2);
    if (ox + w < -2 || oy < -2 || ox - w > VW + 2 || oy - h > VH + 2) return null;
    // l'ombre au sol
    ctx.fillStyle = "rgba(0,0,0," + (0.34 * alpha).toFixed(3) + ")";
    ctx.fillRect(ox - 4, oy - 1, 9, 2); ctx.fillRect(ox - 3, oy - 2, 7, 4);
    var teinte = TEINTE[ambiance()], tint = opt.teinte || teinte, pal = opt.pal;
    var im = ctx.createImageData(w, h), d = im.data, jambes = Math.floor(h * 0.72);
    var silhouette = !!opt.silhouette, a8 = Math.round(255 * alpha), vu = false;
    for (var i = 0; i < h; i++) {
      var row = rows[i];
      for (var j = 0; j < w; j++) {
        var src = miroir ? w - 1 - j : j;
        if (pas && i >= jambes) src += (src < w / 2 ? 1 : -1) * pas;
        var ch = src >= 0 && src < w ? row[src] : ".";
        if (ch === "." || ch === " ") continue;
        var col = (pal && pal[ch]) || def.pal[ch];
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
        vu = true;
        var e = def.emit && def.emit[ch];
        d[o] = e ? e[0] : Math.round(col[0] * tint[0]);
        d[o + 1] = e ? e[1] : Math.round(col[1] * tint[1]);
        d[o + 2] = e ? e[2] : Math.round(col[2] * tint[2]);
        d[o + 3] = a8;
      }
    }
    var tmp = dessinerSprite._c || (dessinerSprite._c = document.createElement("canvas"));
    tmp.width = w; tmp.height = h;
    tmp.getContext("2d").putImageData(im, 0, 0);
    ctx.drawImage(tmp, ox - ax, oy - (h - 1));
    return vu ? { x: ox - ax, y: oy - (h - 1), w: w, h: h, tete: [ox, oy - h] } : null;
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
    var reste = VITESSE * dt * (S.vite ? 3 : 1) * vitesseBiens();
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

  // ─────────────────────────────────────────────────────────────── les gens
  // Personne n'apparaît au milieu de la rue, personne ne s'y évapore. Un passant
  // sort d'une porte (le corps se découvre en passant la façade) ou arrive du
  // hors-champ ; il va vers une autre porte, où il entre, ou vers le hors-champ,
  // où il s'efface sans témoin. Ceux qu'on connaît — les présences de
  // ville.yaml, celui qui t'attend, les commerçants sur le pas de leur porte —
  // font de même : ils sortent de chez eux, se postent à une place vérifiée
  // (au large, à deux ou trois cases de la porte, jamais dans un mur), et
  // rentrent quand leur heure est passée. Quand l'écran est au noir (un fondu,
  // une nuit), tout le monde est recalé d'un coup : personne ne l'a vu bouger.
  var SANS_PORTE = { monument: 1, fontaine: 1, marche: 1, lavoir: 1, terrain: 1, cimetiere: 1, caveau: 1, columbarium: 1,
    friche: 1, feu: 1, wagon: 1, halle: 1, square: 1, voiture: 1, buvette: 1, kiosque: 1 };
  // Les commerçants qu'on trouve dehors, à leur heure (et qui ont un mot pour toi).
  var COMMERCES = [
    { lieu: "marche", sp: "commercant", tranches: ["matin", "midi"] },
    { lieu: "kiosque", sp: "commercant2", tranches: ["matin", "midi", "aprem"] },
    { lieu: "fleuriste", sp: "commercant", tranches: ["matin", "aprem"] },
    { lieu: "epicerie", sp: "commercant2", tranches: ["aprem"] },
    { lieu: "tabac", sp: "commercant2", tranches: ["soir"] },
    { lieu: "tabac_stade", sp: "commercant", tranches: ["midi"] },
    { lieu: "garage", sp: "garagiste", tranches: ["matin", "aprem"] },
    { lieu: "boulangerie_residentiel", sp: "commercant", tranches: ["matin"] },
    { lieu: "terminus", sp: "commercant2", tranches: ["aprem"] },
    { lieu: "pharmacie", sp: "commercant", tranches: ["matin"] },
    { lieu: "tailleur", sp: "commercant2", tranches: ["aprem"] },
    { lieu: "club_prive", sp: "portier", tranches: ["soir", "nuit"] }
  ];
  var VITESSE_GENS = 16;
  var PEAUX = [null, null, { s: [176, 128, 92], S: [134, 94, 66] }, { s: [140, 97, 69], S: [107, 71, 51] }, { s: [228, 190, 158], S: [180, 136, 108] }, { s: [118, 80, 58], S: [88, 58, 42] }];
  var MANTEAUX = [null, { q: [96, 60, 48], Q: [70, 42, 34] }, { q: [60, 74, 60], Q: [42, 54, 42] }, { q: [120, 112, 96], Q: [90, 84, 70] },
    { q: [40, 40, 46], Q: [28, 28, 32] }, { q: [130, 40, 44], Q: [96, 28, 32] }, { q: [70, 84, 120], Q: [50, 60, 88] }, { q: [150, 128, 70], Q: [112, 94, 50] }];
  var CHEVEUX = [null, { h: [26, 18, 13] }, { h: [150, 110, 60] }, { h: [110, 60, 30] }, { h: [60, 40, 26] }];
  function auHasard(l) { return l[Math.floor(Math.random() * l.length)]; }
  function melange() {
    var p = {};
    [auHasard(PEAUX), auHasard(MANTEAUX), auHasard(CHEVEUX)].forEach(function (o) { for (var k in o || {}) p[k] = o[k]; });
    return p;
  }
  // Des corps de plus, tirés des silhouettes existantes (d'autres étoffes).
  function variantes() {
    function v(nom, base, pal) {
      if (SPRITES[nom] || !SPRITES[base]) return;
      var b = SPRITES[base], p = {};
      for (var k in b.pal) p[k] = b.pal[k];
      for (var k2 in pal) p[k2] = pal[k2];
      SPRITES[nom] = { rows: b.rows, pal: p, ax: b.ax, emit: b.emit };
    }
    v("ancien", "passant", { h: [196, 192, 186], H: [150, 146, 140], q: [128, 112, 84], Q: [98, 84, 62], j: [70, 66, 60], J: [52, 48, 44] });
    v("commercant", "passante", { q: [214, 208, 194], Q: [168, 162, 150], h: [90, 58, 34] });
    v("commercant2", "passant", { q: [70, 92, 128], Q: [50, 66, 94], h: [60, 40, 26] });
    v("garagiste", "passant", { q: [52, 70, 98], Q: [36, 50, 72], j: [52, 70, 98], J: [36, 50, 72], h: [40, 28, 20] });
    v("portier", "inconnu", { c: [24, 22, 24], C: [14, 13, 14], h: [20, 18, 16] });
  }
  // Un personnage sans sprite (les visages nouveaux des histoires) prend corps
  // d'après sa fiche de portrait (content/portraits.yaml) : la silhouette du
  // passant ou de la passante, son teint, ses cheveux, l'étoffe de sa tenue.
  var PORTRAITS = {};
  var TEINT = { porcelaine: [236, 206, 182], clair: [219, 176, 140], dore: [204, 154, 108], olive: [176, 128, 92], brun: [140, 97, 69], ebene: [96, 64, 46] };
  var CHEVEUX_C = { noir: [26, 18, 13], brun: [60, 40, 26], chatain: [112, 74, 42], roux: [152, 72, 32], blond: [204, 164, 92], gris: [150, 146, 140], blanc: [214, 210, 204] };
  var ETOFFE = { bordeaux: [112, 33, 46], marine: [36, 46, 74], anthracite: [52, 54, 58], noir: [26, 24, 26], pelouse: [60, 110, 52], creme: [214, 206, 186],
    blanc: [226, 224, 218], gris: [120, 120, 118], bleu: [52, 82, 150], ciel: [122, 162, 200], orange: [200, 112, 42], rouge: [170, 42, 42], camel: [170, 130, 80],
    violet: [92, 62, 122], beige: [196, 176, 140], bouteille: [32, 72, 52], jaune: [210, 180, 62], rose: [200, 132, 142], prune: [92, 42, 62] };
  function fonce(c, f) { return [Math.round(c[0] * f), Math.round(c[1] * f), Math.round(c[2] * f)]; }
  function spriteDe(id) {
    if (!id) return null;
    if (SPRITES[id]) return id;
    var p = PORTRAITS[id];
    if (!p) return null;
    var b = SPRITES[(p.genre || (CHARS[id] && CHARS[id].genre)) === "f" ? "passante" : "passant"];
    if (!b) return null;
    var pal = {}, k;
    for (k in b.pal) pal[k] = b.pal[k];
    var t = TEINT[p.teint];
    if (t) { pal.s = t; pal.S = fonce(t, 0.77); }
    var h = p.coiffure === "chauve" ? (t || pal.s) : CHEVEUX_C[p.cheveux];
    if (h) { pal.h = h; pal.H = fonce(h, 0.8); }
    var q = ETOFFE[p.couleur];
    if (q) { pal.q = q; pal.Q = fonce(q, 0.74); }
    var j = ETOFFE[p.couleur2];
    if (j && p.tenue !== "costume" && p.tenue !== "tailleur") { pal.j = fonce(j, 0.8); pal.J = fonce(j, 0.6); }
    SPRITES[id] = { rows: b.rows, pal: pal, ax: b.ax, emit: b.emit };
    return id;
  }
  var NOM_GENS = { passant: "Un passant", passante: "Une passante", enfant: "Un gamin", fan: "Un supporter", ancien: "Un ancien",
    inconnu: "Un homme en gris", commercant: "Le commerçant", commercant2: "Le commerçant", garagiste: "Le garagiste", portier: "Le portier" };
  // de quelle bouche viennent les paroles (content/ville/paroles_*.yaml : `qui`)
  var BOUCHE = { passant: "passant", passante: "passante", enfant: "enfant", fan: "fan", ancien: "ancien", commercant: "commercant",
    commercant2: "commercant", garagiste: "commercant", portier: "commercant" };

  function aPorte(cle) { return !!(LIEU[cle] && LIEU[cle].door && !SANS_PORTE[cle]); }
  // un peu derrière la façade : de là, le corps sort de l'ombre de la porte
  function dedans(cle) {
    var l = LIEU[cle], c = centre(l.door), dx = l.x - c[0], dy = l.y - c[1], d = Math.hypot(dx, dy);
    if (d < 0.5) { dx = -1; dy = -1; d = Math.SQRT2; }
    return [c[0] + dx / d * (d + 4), c[1] + dy / d * (d + 4)];
  }
  // à l'écran ? (les pieds, plus la hauteur d'un corps, avec une marge en pixels d'image)
  function aLEcran(x, y, marge) {
    var p = versImage(x, y, ZSOL), sx = p[0] - (cam.x - VW / 2), sy = p[1] - (cam.y - VH / 2), m = marge || 0;
    return sx > -14 - m && sx < VW + 14 + m && sy > -4 - m && sy < VH + 26 + m;
  }
  // Les places où l'on se poste, devant un lieu : au large, à deux à quatre cases
  // de la porte, en vue de la porte (une ligne droite libre), de préférence du
  // côté de la caméra ; écartées l'une de l'autre. Calculées une fois.
  var PLACES = {};
  function placesDe(cle) {
    if (PLACES[cle]) return PLACES[cle];
    var l = LIEU[cle], d = l.door, cands = [];
    for (var dy = -4; dy <= 4; dy++) for (var dx = -4; dx <= 4; dx++) {
      var r = Math.max(Math.abs(dx), Math.abs(dy));
      if (r < 2) continue;
      var c = [d[0] + dx, d[1] + dy];
      if (!marchable(c[0], c[1]) || !vue_libre(d, c)) continue;
      cands.push([r * 2 + (auLarge(c[0], c[1]) ? 0 : 4) - 0.35 * (dx + dy) + 0.01 * (dx * 7 + dy), c]);
    }
    cands.sort(function (a, b) { return a[0] - b[0]; });
    var out = [];
    cands.forEach(function (k) {
      if (out.length >= 5) return;
      for (var i = 0; i < out.length; i++) if (Math.max(Math.abs(out[i][0] - k[1][0]), Math.abs(out[i][1] - k[1][1])) < 2) return;
      out.push(k[1]);
    });
    if (!out.length) out.push(d.slice());
    PLACES[cle] = out.map(centre);
    return PLACES[cle];
  }
  function caseCamera() { var s = versSol(cam.x, cam.y); return caseDe(s[0], s[1]); }
  // une case au large, juste hors de l'écran (dans la couronne autour de la vue)
  function horsChamp(loinDe) {
    var x0 = cam.x - VW / 2, y0 = cam.y - VH / 2, best = null, bd = -1;
    for (var n = 0; n < 40; n++) {
      var cote = Math.floor(Math.random() * 4), t = Math.random(), m = 34 + Math.random() * 70, u, v;
      if (cote === 0) { u = x0 - m; v = y0 + t * VH; } else if (cote === 1) { u = x0 + VW + m; v = y0 + t * VH; }
      else if (cote === 2) { u = x0 + t * VW; v = y0 - m; } else { u = x0 + t * VW; v = y0 + VH + m + 20; }
      var s = versSol(u, v), c = caseDe(s[0], s[1]);
      if (!auLarge(c[0], c[1])) continue;
      var w = centre(c);
      if (aLEcran(w[0], w[1], 6)) continue;
      if (!loinDe) return c;
      var d = Math.abs(c[0] - loinDe[0]) + Math.abs(c[1] - loinDe[1]);
      if (d > bd) { bd = d; best = c; }
    }
    return best;
  }
  // la case hors de l'écran la plus proche d'une case donnée (pour arriver vite)
  function horsChampPres(c) {
    for (var r = 3; r <= 70; r += 2) {
      for (var n = 0; n < 28; n++) {
        var a = n / 28 * Math.PI * 2, cx = Math.round(c[0] + Math.cos(a) * r), cy = Math.round(c[1] + Math.sin(a) * r);
        if (!auLarge(cx, cy)) continue;
        var w = centre([cx, cy]);
        if (!aLEcran(w[0], w[1], 8)) return [cx, cy];
      }
    }
    return null;
  }
  // une case au large, à l'écran (pour peupler une scène qui sort du noir)
  function aLEcranAuHasard() {
    for (var n = 0; n < 50; n++) {
      var s = versSol(cam.x - VW / 2 + Math.random() * VW, cam.y - VH / 2 + 20 + Math.random() * (VH - 20)), c = caseDe(s[0], s[1]);
      if (auLarge(c[0], c[1])) return c;
    }
    return null;
  }
  // les portes d'où l'on peut sortir (ou entrer) en ce moment, autour de la vue
  function portesProches() {
    var out = [];
    L.places.forEach(function (l) {
      if (!aPorte(l.key)) return;
      var c = centre(l.door);
      if (!aLEcran(c[0], c[1], 150)) return;
      var def = TEXTE_LIEU[l.key];
      if (def && !ouvert(def) && l.key !== "appartement") return;
      out.push(l.key);
    });
    return out;
  }
  // un chemin de gens : la suite de points, sa longueur, et s'il commence ou
  // finit derrière une façade (le fondu de la porte)
  function poserChemin(q, pts, dedansDep, dedansArr) {
    var long = 0;
    for (var i = 1; i < pts.length; i++) long += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    q.chemin = pts; q.i = 0; q.x = pts[0][0]; q.y = pts[0][1];
    q.fait = 0; q.long = long; q.dedansDep = !!dedansDep; q.dedansArr = !!dedansArr;
  }
  function sortePassant() {
    var tr = S.tranche;
    var poids = tr === 4 ? { passant: 3, passante: 1, inconnu: 2 } :
      tr === 3 ? { passant: 3, passante: 3, fan: 1, ancien: 1 } :
      tr === 0 ? { passant: 3, passante: 3, ancien: 2, enfant: 1 } :
      tr === 1 ? { passant: 3, passante: 3, ancien: 1, enfant: 1 } :
      { passant: 2, passante: 2, ancien: 2, enfant: 2, fan: 1 };
    if (S.jour === 5 && tr <= 2) poids.fan = 6;
    if (S.jour === 6 && tr <= 1) poids.ancien = (poids.ancien || 0) + 2;
    var tot = 0, k;
    for (k in poids) tot += poids[k];
    var r = Math.random() * tot;
    for (k in poids) { r -= poids[k]; if (r < 0) return k; }
    return "passant";
  }
  function voulusPassants() {
    var base = [9, 10, 10, 6, 3][S.tranche];
    return clamp(Math.round(base * VW * VH / 180000), S.tranche === 4 ? 1 : 2, 22);
  }
  // Un passant : d'une porte ou du hors-champ, vers une porte ou le hors-champ.
  function nouveauPassant(enScene) {
    var sp = sortePassant();
    var q = { sp: sp, pal: (sp === "passant" || sp === "passante") ? melange() : (sp === "enfant" || sp === "fan") ? auHasard(PEAUX) : null,
      v: VITESSE_GENS * (sp === "ancien" ? 0.7 : sp === "enfant" ? 1.25 : 0.85 + Math.random() * 0.3),
      miroir: false, pas: 0, dist: Math.random() * 16, alpha: 1, arret: 0, gens: true, uid: ++UID };
    var portes = portesProches(), dep = null, depDedans = null, cleDep = null;
    if (enScene) dep = aLEcranAuHasard();
    else if (portes.length && Math.random() < 0.5) { cleDep = auHasard(portes); dep = LIEU[cleDep].door.slice(); depDedans = dedans(cleDep); }
    else dep = horsChamp(null);
    if (!dep) return null;
    if (!destination(q, dep, depDedans, portes, cleDep)) return null;
    return q;
  }
  function destination(q, dep, depDedans, portes, eviter) {
    portes = portes || portesProches();
    var autres = portes.filter(function (c) { return c !== eviter && Math.abs(LIEU[c].door[0] - dep[0]) + Math.abs(LIEU[c].door[1] - dep[1]) > 8; });
    var arr, arrDedans = null;
    if (autres.length && Math.random() < (q.trop ? 1 : 0.45)) { var c2 = auHasard(autres); arr = LIEU[c2].door.slice(); arrDedans = dedans(c2); }
    else arr = horsChamp(dep);
    if (!arr) return false;
    var ch = chemin(dep, arr, true);
    if (!ch || ch.length < 2) return false;
    var pts = ch.map(centre);
    if (depDedans) pts.unshift(depDedans);
    else if (q.chemin) pts.unshift([q.x, q.y]);
    if (arrDedans) pts.push(arrDedans);
    poserChemin(q, pts, !!depDedans, !!arrDedans);
    return true;
  }
  function alphaGens(q) {
    var a = 1;
    if (q.dedansDep) a = Math.min(a, q.fait / 7);
    if (q.dedansArr) a = Math.min(a, (q.long - q.fait) / 7);
    if (q.fondu != null) a = Math.min(a, q.fondu);
    return clamp(a, 0, 1);
  }
  // un pas de gens ; à l'arrivée, `arrive(q)` décide (entrer, s'effacer, repartir, se poster)
  function marcher(q, dt, ts, arrive) {
    if (q.fondu != null) {
      q.fondu += q.fonduSens * dt * 2.5;
      if (q.fondu <= 0) { q.fini = true; return; }
      if (q.fondu >= 1) q.fondu = null;
    }
    if (q.arret && ts < q.arret) { q.pas = 0; q.alpha = alphaGens(q); return; }
    q.arret = 0;
    if (!q.chemin) { q.pas = 0; q.alpha = alphaGens(q); return; }
    var reste = q.v * dt;
    while (reste > 0) {
      var cible = q.chemin[q.i + 1];
      if (!cible) { q.chemin = null; q.pas = 0; arrive(q); q.alpha = alphaGens(q); return; }
      var dx = cible[0] - q.x, dy = cible[1] - q.y, d = Math.hypot(dx, dy);
      if (d <= reste) { q.x = cible[0]; q.y = cible[1]; q.i++; reste -= d; q.fait += d; }
      else { q.x += dx / d * reste; q.y += dy / d * reste; q.fait += reste; reste = 0; }
      if (Math.abs(dx - dy) > 0.01) q.miroir = (dx - dy) < 0;
    }
    q.dist += q.v * dt;
    var ph = Math.floor(q.dist / 4) % 4;
    q.pas = ph === 1 ? 1 : ph === 3 ? -1 : 0;
    q.alpha = alphaGens(q);
  }
  var prochainPassant = 0;
  function majPassants(dt, ts) {
    var voulu = voulusPassants();
    for (var i = passants.length - 1; i >= 0; i--) {
      var q = passants[i];
      // loin de tout regard : on l'oublie (personne ne le voit partir)
      if (q.fini || (!aLEcran(q.x, q.y, 260) && !q.parle)) { passants.splice(i, 1); continue; }
      if (passants.length > voulu && !aLEcran(q.x, q.y, 10) && !q.parle) { passants.splice(i, 1); continue; }
      q.trop = passants.length > voulu;
    }
    if (passants.length < voulu && ts >= prochainPassant) {
      var n = nouveauPassant(false);
      if (n) passants.push(n);
      prochainPassant = ts + 300 + Math.random() * 600;
    }
    passants.forEach(function (q) {
      marcher(q, dt, ts, function (p) {
        if (p.dedansArr || !aLEcran(p.x, p.y, 0)) { p.fini = true; return; }
        // encore sous nos yeux : il repart (ou, s'il y a trop de monde, il rentre)
        if (!destination(p, caseDe(p.x, p.y), null, null, null)) { p.arret = ts + 1500; p.chemin = null; p.essais = (p.essais || 0) + 1; if (p.essais > 3) { p.fondu = 1; p.fonduSens = -1; } }
      });
    });
  }
  // ─── ceux qu'on connaît
  var acteurs = {}, UID = 0;
  function voulus() {
    var out = [], deja = {}, tr = TRANCHES[S.tranche];
    var r = rdvVisible() ? rdv : null;
    if (r && r.qui && spriteDe(r.qui) && LIEU[r.lieu]) { out.push({ id: r.qui, sp: spriteDe(r.qui), qui: r.qui, role: "rdv", lieu: r.lieu }); deja[r.qui] = 1; }
    var cast = {};
    ((vue && vue.cast) || []).forEach(function (q) { cast[q] = 1; });
    var statuts = (vue && vue.statuts) || {};
    (D.presences || []).forEach(function (p) {
      if (deja[p.qui] || !spriteDe(p.qui) || !LIEU[p.lieu]) return;
      // parti, vendu, passé chez le rival, mort : on ne le croise plus
      var st = statuts[p.qui];
      if (st === "mort" || st === "parti" || st === "vendu" || st === "rival") return;
      if (!(cast[p.qui] || S.vus[p.qui])) return;
      if (p.tranches && p.tranches.length && p.tranches.indexOf(tr) < 0) return;
      out.push({ id: p.qui, sp: spriteDe(p.qui), qui: p.qui, role: "presence", lieu: p.lieu });
      deja[p.qui] = 1;
    });
    var sm = S.mission, mm = sm && sm.offre && MISSION[sm.id];
    if (mm && LIEU[sm.lieu]) {
      var spd = (mm.donneur && mm.donneur.sprite) || "inconnu";
      out.push({ id: "mission", sp: SPRITES[spd] ? spd : "inconnu", qui: "mission", role: "mission", lieu: sm.lieu });
    }
    COMMERCES.forEach(function (c) {
      if (!LIEU[c.lieu] || !SPRITES[c.sp] || c.tranches.indexOf(tr) < 0) return;
      var def = TEXTE_LIEU[c.lieu];
      if (def && !ouvert(def)) return;
      out.push({ id: "com_" + c.lieu, sp: c.sp, qui: BOUCHE[c.sp] || "commercant", role: "commercant", lieu: c.lieu });
    });
    // chacun sa place devant le lieu (celui qui t'attend prend la première)
    var parLieu = {};
    out.forEach(function (a) { var l = parLieu[a.lieu] = parLieu[a.lieu] || []; a.place = placesDe(a.lieu)[l.length % placesDe(a.lieu).length]; l.push(a); });
    return out;
  }
  function nouvelActeur(w) {
    var A = { id: w.id, sp: w.sp, qui: w.qui, role: w.role, lieu: w.lieu, place: w.place, x: w.place[0], y: w.place[1], chemin: null, i: 0,
      v: VITESSE_GENS * 0.95, miroir: false, pas: 0, dist: 0, fait: 0, long: 0, alpha: 1, etat: "la", uid: ++UID };
    if (!aLEcran(A.x, A.y, 24)) return A;          // personne ne regarde : il est déjà là
    var cible = caseDe(A.x, A.y), ch = null;
    if (aPorte(w.lieu)) {
      ch = chemin(LIEU[w.lieu].door, cible, true);
      var pts = [dedans(w.lieu)].concat(ch ? ch.map(centre) : [centre(LIEU[w.lieu].door), w.place]);
      poserChemin(A, pts, true, false);
    } else {
      var h = horsChampPres(cible);
      ch = h ? chemin(h, cible, true) : null;
      if (!ch) { A.fondu = 0; A.fonduSens = 1; return A; }   // en dernier recours : il se découpe dans la pénombre
      poserChemin(A, ch.map(centre), false, false);
    }
    A.etat = "va";
    return A;
  }
  function partir(A) {
    A.etat = "part";
    A.arret = 0;
    if (!aLEcran(A.x, A.y, 24)) { A.fini = true; return; }
    var ici = caseDe(A.x, A.y);
    if (aPorte(A.lieu)) {
      var ch = chemin(ici, LIEU[A.lieu].door, true);
      poserChemin(A, [[A.x, A.y]].concat(ch ? ch.map(centre) : []).concat([dedans(A.lieu)]), false, true);
      return;
    }
    var h = horsChampPres(ici), ch2 = h ? chemin(ici, h, true) : null;
    if (!ch2) { A.fondu = 1; A.fonduSens = -1; return; }
    poserChemin(A, [[A.x, A.y]].concat(ch2.map(centre)), false, false);
  }
  function rejoindre(A, place) {
    A.place = place;
    if (!aLEcran(A.x, A.y, 24) && !aLEcran(place[0], place[1], 24)) { A.x = place[0]; A.y = place[1]; A.chemin = null; A.etat = "la"; return; }
    var ch = chemin(caseDe(A.x, A.y), caseDe(place[0], place[1]), true);
    if (ch) { poserChemin(A, [[A.x, A.y]].concat(ch.map(centre)), false, false); A.etat = "va"; }
  }
  function majActeurs(dt, ts) {
    var v = voulus(), parId = {};
    v.forEach(function (w) { parId[w.id] = w; });
    Object.keys(acteurs).forEach(function (id) {
      var A = acteurs[id], w = parId[id];
      if (!w || w.lieu !== A.lieu) { if (A.etat !== "part") partir(A); }
      else {
        A.role = w.role;
        if (A.etat === "part") { A.fini = false; A.fondu = null; rejoindre(A, w.place); }
        else if (w.place[0] !== A.place[0] || w.place[1] !== A.place[1]) rejoindre(A, w.place);
      }
    });
    v.forEach(function (w) { if (!acteurs[w.id]) acteurs[w.id] = nouvelActeur(w); });
    Object.keys(acteurs).forEach(function (id) {
      var A = acteurs[id];
      marcher(A, dt, ts, function (a) {
        if (a.etat === "part") { if (a.dedansArr || !aLEcran(a.x, a.y, 0)) a.fini = true; else { a.fondu = 1; a.fonduSens = -1; } }
        else a.etat = "la";
      });
      // posté : il regarde vers toi quand tu approches
      if (A.etat === "la" && !A.chemin) {
        var dx = heros.x - A.x, dy = heros.y - A.y;
        if (Math.abs(dx) + Math.abs(dy) < 60 && Math.abs(dx - dy) > 0.5) A.miroir = (dx - dy) < 0;
      }
      if (A.fini) delete acteurs[id];
    });
  }
  // L'écran est au noir : chacun est déjà à sa place, et la rue est peuplée.
  function recaler() {
    var v = voulus(), parId = {};
    v.forEach(function (w) { parId[w.id] = w; });
    Object.keys(acteurs).forEach(function (id) { if (!parId[id] || parId[id].lieu !== acteurs[id].lieu) delete acteurs[id]; });
    v.forEach(function (w) {
      var A = acteurs[w.id] || (acteurs[w.id] = { id: w.id, sp: w.sp, qui: w.qui, v: VITESSE_GENS * 0.95, miroir: false, pas: 0, dist: 0, alpha: 1, uid: ++UID });
      A.role = w.role; A.lieu = w.lieu; A.place = w.place; A.x = w.place[0]; A.y = w.place[1];
      A.chemin = null; A.etat = "la"; A.fondu = null; A.fini = false; A.alpha = 1; A.arret = 0;
    });
    passants = [];
    var n = voulusPassants();
    for (var i = 0; i < n * 3 && passants.length < n; i++) {
      var q = nouveauPassant(true);
      if (q) passants.push(q);
    }
    bulle = null;
  }

  // ─────────────────────────────────────────────────────────────── ce qu'ils disent
  // Toucher quelqu'un : il s'arrête, se tourne vers toi, et dit une chose du
  // moment — le match, le classement, une rumeur, ton argent, l'époque — tirée
  // de content/ville/paroles_*.yaml selon son `si`. Les phrases déjà dites
  // passent après celles qu'on n'a jamais entendues ; les plus précises (celles
  // qui ont le plus de conditions) passent devant les banales.
  // LA GRAMMAIRE DE `si` : ET seulement, la même que build_content.dart
  // (`_compileVille` → `si`) — les deux doivent rester d'accord.
  var RE_APPEL = /^(!?)(flag|arc|possede|mission)\(\s*([A-Za-z0-9_.]+)\s*\)$/;
  var RE_NUM = /^([a-z_]+(?:\.[a-z_]+)?)\s*(<=|>=|==|!=|<|>)\s*(-?\d+)$/;
  var RE_MOT = /^([a-z_]+)\s*(==|!=)\s*([A-Za-z_]+)$/;
  function jauge(id) {
    var g = ((vue && vue.gauges) || []).filter(function (x) { return x.id === id; })[0];
    return g ? g.value : 50;
  }
  function valeur(nom) {
    var v = vue || {}, mo = v.monde || {};
    if (nom.indexOf("relation.") === 0) return ((v.relations || {})[nom.slice(9)]) || 0;
    switch (nom) {
      case "rang": return (v.journee || 0) > 0 && v.rank ? v.rank : null;
      case "division": return v.division || 1;
      case "journee": return v.journee || 0;
      case "serie_v": return mo.serie_v || 0;
      case "serie_d": return mo.serie_d || 0;
      case "pts": return mo.pts || 0;
      case "vestiaire": case "tribunes": case "direction": case "caisse": return jauge(nom);
      case "annee": return v.year || 1990;
      case "saison": return v.season || 1;
      case "age": return v.age || 0;
      case "francs": return Math.round(S.francs);
      case "energie": return S.energie;
      case "faim": return S.faim;
      case "semaine": return S.semaine;
    }
    return null;
  }
  function lieuProche() {
    var hc = caseDe(heros.x, heros.y), best = null, bd = 11;
    L.places.forEach(function (l) {
      if (!l.door) return;
      var d = Math.max(Math.abs(l.door[0] - hc[0]), Math.abs(l.door[1] - hc[1]));
      if (d < bd) { bd = d; best = l.key; }
    });
    return best;
  }
  function mot(nom, lieuCtx) {
    switch (nom) {
      case "role": return S.role;
      case "phase": return (vue && vue.phase) || "";
      case "jour": return JOURS[S.jour];
      case "tranche": return TRANCHES[S.tranche];
      case "lieu": return lieuCtx || S.lieu || lieuProche() || "";
    }
    return "";
  }
  function terme(t, lieuCtx) {
    var m = RE_APPEL.exec(t);
    if (m) {
      var oui;
      if (m[2] === "flag") oui = ((vue && vue.flags) || []).indexOf(m[3]) >= 0;
      else if (m[2] === "arc") oui = ((vue && vue.arcsActifs) || []).indexOf(m[3]) >= 0;
      else if (m[2] === "possede") oui = !!(S.biens && S.biens[m[3]]);
      else oui = !!(S.missionsFaites && S.missionsFaites[m[3]]);
      return m[1] ? !oui : oui;
    }
    m = RE_NUM.exec(t);
    if (m) {
      var a = valeur(m[1]), b = +m[3];
      if (a == null) return false;
      switch (m[2]) {
        case "<": return a < b;
        case "<=": return a <= b;
        case ">": return a > b;
        case ">=": return a >= b;
        case "==": return a === b;
        default: return a !== b;
      }
    }
    m = RE_MOT.exec(t);
    if (m) { var w = mot(m[1], lieuCtx); return m[2] === "==" ? w === m[3] : w !== m[3]; }
    return false;
  }
  function siVrai(expr, lieuCtx) {
    if (!expr) return true;
    var ts = String(expr).split("&&");
    for (var i = 0; i < ts.length; i++) if (!terme(ts[i].trim().replace(/['"]/g, ""), lieuCtx)) return false;
    return true;
  }
  // « de Racing » → « du Racing » (le pendant de `articlesDeClub`, text.dart)
  function articles(t) {
    var e = (vue && vue.entities) || {};
    [e.club, e.rival].forEach(function (club) {
      if (!club) return;
      var voy = /^[AEIOUYÉÈÊaeiouyéèê]/.test(club.split(" ")[0]), c = club.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      var av = "(^|[\\s(«\\u00a0\\u2019'\"—–-])";
      t = t.replace(new RegExp(av + "([Dd])(?:e |')" + c, "g"), function (m, a, d) { var maj = d === "D"; return a + (voy ? (maj ? "De l'" : "de l'") : (maj ? "Du " : "du ")) + club; });
      t = t.replace(new RegExp(av + "([Àà]) " + c, "g"), function (m, a, d) { var maj = d === "À"; return a + (voy ? (maj ? "À l'" : "à l'") : (maj ? "Au " : "au ")) + club; });
    });
    return t;
  }
  function remplir(t, extra) {
    var e = (vue && vue.entities) || {}, r = valeur("rang");
    var M = { prenom: e.prenom || "", nom: e.nom || "", club: e.club || "le club", ville: e.ville || "Aubérive", rival: e.rival || "",
      rang: r == null ? "" : r === 1 ? "1er" : r + "e", annee: String((vue && vue.year) || ""), division: "Division " + ((vue && vue.division) || 1) };
    for (var k in extra || {}) M[k] = extra[k];
    return articles(String(t).replace(/\{(\w+)\}/g, function (m, cle) { return M[cle] != null ? M[cle] : m; }));
  }
  function parole(qui, lieuCtx) {
    var P = D.paroles || [], ok = [];
    for (var i = 0; i < P.length; i++) if (P[i].qui === qui && siVrai(P[i].si, lieuCtx)) ok.push(i);
    if (!ok.length) return null;
    S.dits = S.dits || {};
    // jamais dites d'abord ; parmi elles, les plus précises pèsent plus
    var jamais = ok.filter(function (i) { return S.dits[i] == null; });
    var pool = jamais.length ? jamais : ok.slice().sort(function (a, b) { return S.dits[a] - S.dits[b]; }).slice(0, Math.max(1, Math.ceil(ok.length / 3)));
    var tot = 0, poids = pool.map(function (i) { var w = 1 + (P[i].si ? String(P[i].si).split("&&").length * 1.5 : 0); tot += w; return w; });
    var r = Math.random() * tot, pick = pool[0];
    for (var j = 0; j < pool.length; j++) { r -= poids[j]; if (r < 0) { pick = pool[j]; break; } }
    S.dits[pick] = tNow() * 100 + (S.ditsN = (S.ditsN || 0) + 1) % 100;
    return P[pick];
  }
  var bulle = null;
  function parler(g) {
    var maintenant = performance.now(), qui, nom;
    if (g.gens || g.role === "commercant" || !CHARS[g.qui]) { qui = BOUCHE[g.sp] || g.qui; nom = NOM_GENS[g.sp] || "Quelqu'un"; }
    else { qui = g.qui; nom = nomDe(g.qui); }
    var p = qui ? parole(qui, g.lieu || null) : null, texte, muet = false;
    if (p) texte = remplir(p.texte);
    else {
      muet = true;
      texte = g.sp === "inconnu" ? "Il ne répond pas. Il te suit des yeux jusqu'au coin de la rue." : g.sp === "enfant" ? "Le gamin se sauve en riant." : "Un signe de tête, et c'est tout.";
    }
    var dx = heros.x - g.x, dy = heros.y - g.y;
    if (Math.abs(dx - dy) > 0.5) g.miroir = (dx - dy) < 0;
    var duree = Math.max(4200, texte.length * 62);
    g.arret = maintenant + duree; g.parle = true;
    if (bulle && bulle.g !== g) bulle.g.parle = false;
    bulle = { g: g, nom: nom, texte: texte, muet: muet, jusqua: maintenant + duree };
    sauver();
  }
  // toucher quelqu'un : s'il est loin, on va le voir (et il t'attend)
  function toucherQuelquun(g) {
    if (bulle && bulle.g !== g) { bulle.g.parle = false; bulle = null; }
    if (g.role === "rdv" && rdv && LIEU[rdv.lieu]) { allerAuLieu(rdv.lieu); return; }
    if (g.role === "mission" && S.mission && LIEU[g.lieu]) {
      var l = LIEU[g.lieu], c0 = caseDe(heros.x, heros.y);
      if (Math.abs(c0[0] - l.door[0]) + Math.abs(c0[1] - l.door[1]) <= 2 && !heros.chemin) { ouvrirMission(g.lieu); return; }
      allerA(l.door[0], l.door[1], function () { S.lieu = g.lieu; ouvrirMission(g.lieu); });
      return;
    }
    var hc = caseDe(heros.x, heros.y), gc = caseDe(g.x, g.y);
    if (Math.max(Math.abs(hc[0] - gc[0]), Math.abs(hc[1] - gc[1])) <= 5) { heros.chemin = null; parler(g); return; }
    g.arret = performance.now() + 9000;
    var cible = plusProche(gc[0] + 1, gc[1] + 1, 4) || gc;
    S.lieu = null;
    if (!allerA(cible[0], cible[1], function () { parler(g); })) parler(g);
  }
  function majBulle() {
    var el = $("villeBulle");
    if (!el) return;
    var b = bulle;
    if (b && (performance.now() > b.jusqua || b.g.fini || !b.g.tete || carteOn || occupe)) { b.g.parle = false; bulle = null; b = null; }
    if (!b) { el.hidden = true; return; }
    if (el._pour !== b) {
      el._pour = b;
      el.querySelector("b").textContent = b.nom;
      var p = el.querySelector("p");
      p.textContent = b.muet ? b.texte : "« " + b.texte + " »";
      el.classList.toggle("muet", b.muet);
    }
    el.hidden = false;
    var W = VW * k, bw = el.offsetWidth || 220;
    var sx = clamp(b.g.tete[0] * k, bw / 2 + 8, W - bw / 2 - 8), sy = Math.max(b.g.tete[1] * k - 6, el.offsetHeight + 70);
    el.style.left = Math.round(sx) + "px"; el.style.top = Math.round(sy) + "px";
  }

  // ─────────────────────────────────────────────────────────────── l'argent
  // La ville compte en francs de 1990, comme les cartes (`ville_francs: "+50000"`)
  // et la boutique (`prix`). L'affichage suit l'époque : l'inflation (2 % l'an),
  // puis l'écu (6,56 francs) quand le pays passe à la monnaie unique (le drapeau
  // `monde_ecus`, ou 2003 au plus tard).
  var ECU = 6.56;
  function enEcus() { return ((vue && vue.flags) || []).indexOf("monde_ecus") >= 0 || ((vue && vue.year) || 1990) >= 2003; }
  function courant(f) { var an = (vue && vue.year) || 1990, v = f * Math.pow(1.02, Math.max(0, an - 1990)); return enEcus() ? v / ECU : v; }
  function argent(f) {
    var v = courant(f), a = Math.abs(v);
    var r = a >= 100000 ? Math.round(a / 1000) * 1000 : a >= 10000 ? Math.round(a / 100) * 100 : a >= 1000 ? Math.round(a / 10) * 10 : Math.round(a);
    return (v < 0 && r ? "−" : "") + r.toLocaleString("fr-FR") + (enEcus() ? (r > 1 ? " écus" : " écu") : " F");
  }
  function salaire() { var t = SALAIRE[S.role] || SALAIRE.entraineur; return t[clamp(((vue && vue.division) || 1) - 1, 0, t.length - 1)]; }
  // ce qui vient d'entrer ou de sortir, à côté du portefeuille, le temps d'un regard
  function gain(f) {
    if (!f) return;
    var h = $("villeHud"), el = h && h.querySelector(".v-gain");
    if (!el) return;
    el.textContent = (f > 0 ? "+" : "") + argent(f);
    el.classList.toggle("dn", f < 0);
    el.classList.remove("on"); void el.offsetWidth; el.classList.add("on");
  }

  // ─────────────────────────────────────────────────────────────── les biens
  // La boutique (content/ville/boutique.yaml → `objets`) : ce qui s'achète, où, à
  // quelle époque. Un bien acheté passe par le moteur (`Engine.biens`) : ses
  // effets (une jauge, un drapeau `bn_<objet>` que les cartes lisent). L'argent
  // sale salit ce qu'il paie : un bien payé (même en partie) avec de l'argent
  // qu'on ne peut pas expliquer part en premier à chaque saisie.
  var OBJET = {};
  function possede(id) { return !!(S.biens && S.biens[id]); }
  function mesBiens() { return Object.keys(S.biens || {}).sort().filter(function (id) { return OBJET[id]; }); }
  function usage(cle) {
    var best = 0;
    mesBiens().forEach(function (id) { var u = OBJET[id].usage || {}, v = +u[cle] || 0; if (v > best) best = v; });
    return best;
  }
  function vitesseBiens() { var v = usage("vitesse"); return v <= 0 ? 1 : clamp(v > 3 ? 1 + v / 100 : v, 1, 3); }
  function aUnHelico() { return mesBiens().some(function (id) { return !!(OBJET[id].usage || {}).deplacement; }); }
  function logement() {
    var best = null;
    mesBiens().forEach(function (id) { var o = OBJET[id]; if (o.logement && (!best || o.prix > best.prix)) best = o; });
    return best;
  }
  // chez toi : le deux-pièces de la rue des Lilas ; le sélectionneur, lui, loge à
  // l'hôtel de la Rive (la Fédération paie la note)
  function chezToi() { return S && S.role === "selectionneur" && LIEU.hotel ? "hotel" : "appartement"; }
  function nomLieu(l) {
    if (l && l.key === "appartement") { var o = logement(); if (o) return o.logement.nom; }
    return l ? l.label : "";
  }
  function aVendreIci(cle) {
    var an = (vue && vue.year) || 1990;
    return (D.objets || []).filter(function (o) {
      if (o.lieu !== cle) return false;
      if (o.roles && o.roles.indexOf(S.role) < 0) return false;
      if (o.annees && (an < o.annees[0] || an > o.annees[1])) return false;
      return siVrai(o.si, cle);
    });
  }
  function pourquoiPasAcheter(o, lieuOuvert) {
    if (possede(o.id)) return "Déjà à toi.";
    if (!lieuOuvert) return "Fermé à cette heure.";
    if (S.francs < o.prix) return "Il te manque " + argent(o.prix - S.francs) + ".";
    return "";
  }
  function acheter(id, cle) {
    var o = OBJET[id];
    if (!o || carteOn || occupe || pourquoiPasAcheter(o, true)) return;
    var sale = Math.min(Math.max(0, S.sale || 0), o.prix);
    S.sale = (S.sale || 0) - sale;
    S.francs -= o.prix;
    S.biens[id] = { prix: o.prix, depuis: tNow(), sale: sale > 0 };
    gain(-o.prix);
    vue = coquille.biens(id, true);
    pont(vue);
    if (vue.over) return;
    majHud(); sauver();
    ouvrirPorte(cle, "C'est à toi : " + o.nom.charAt(0).toLowerCase() + o.nom.slice(1) + ".");
  }
  function revendre(id) {
    var o = OBJET[id];
    if (!o || !possede(id) || carteOn || occupe) return;
    var f = Math.round(o.prix * (o.revente == null ? 0.5 : o.revente));
    delete S.biens[id];
    S.francs += f;
    gain(f);
    vue = coquille.biens(id, false);
    pont(vue);
    if (vue.over) return;
    majHud(); sauver();
    ouvrirInventaire("Revendu : " + o.nom.charAt(0).toLowerCase() + o.nom.slice(1) + ", pour " + argent(f) + ".");
  }
  // ce que la police emporte, selon l'ordre de saisie (et ce que l'argent sale a payé)
  function aSaisir(quoi) {
    return mesBiens().filter(function (id) {
      var o = OBJET[id], b = S.biens[id];
      if (quoi === "tout" || b.sale) return true;
      if (quoi === "vehicules") return o.categorie === "vehicule";
      if (quoi === "logement") return o.categorie === "logement" || !!o.logement;
      if (quoi === "luxe") return !!o.luxe && o.categorie !== "logement" && !o.logement;
      return false;
    });
  }
  // le cambriolage (`vol_luxe`) : ce qui tient dans un sac — montres, vêtements,
  // bijoux et toiles marqués `luxe` ; pas le lingot (au coffre), ni le bateau, ni
  // la part du trotteur
  var INVOLABLES = { lingot: 1, bateau: 1, trotteur: 1 };
  function aVoler() {
    return mesBiens().filter(function (id) {
      var o = OBJET[id];
      return !!o.luxe && !INVOLABLES[id] && (o.categorie === "montre" || o.categorie === "vetement" || o.categorie === "luxe");
    });
  }
  function ouvrirInventaire(fait) {
    if (!coquille) return;
    fermerPorte();
    var html = '<div class="v-inv">' +
      '<div class="v-inv-solde"><b' + (S.francs < 0 ? ' class="dn"' : "") + '>' + esc(argent(S.francs)) + '</b><span>' +
      (S.francs < 0 ? "à découvert · " : "en poche · ") + "la paie : " + esc(argent(salaire())) + " la semaine</span></div>";
    if ((S.sale || 0) > 0) html += '<p class="v-inv-sale">Dont ' + esc(argent(S.sale)) + " que tu ne saurais pas expliquer.</p>";
    if (fait) html += '<p class="v-inv-fait">' + esc(fait) + "</p>";
    var lg = logement();
    html += "<h3>Chez toi</h3><p class=\"v-inv-chez\">" + esc(lg ? lg.logement.nom : "Deux pièces au troisième, rue des Lilas (en location).") + "</p>";
    var ids = mesBiens();
    html += "<h3>Ce qui est à toi</h3>";
    if (!ids.length) html += '<p class="v-inv-vide">Rien encore. La boutique du club, le tailleur, le garage du Pont, l\'agence Tessandier : à Aubérive, tout se vend.</p>';
    ids.forEach(function (id) {
      var o = OBJET[id], b = S.biens[id], f = Math.round(o.prix * (o.revente == null ? 0.5 : o.revente));
      html += '<div class="v-bien"><div><b>' + esc(o.nom) + '</b><span>' + esc(b.cadeau ? "un cadeau" : "payé " + argent(b.prix)) + (b.sale ? " · argent sale" : "") + '</span></div>' +
        '<button type="button" data-vendre="' + esc(id) + '">Revendre · ' + esc(argent(f)) + "</button></div>";
    });
    var m = S.mission && MISSION[S.mission.id];
    if (m && !S.mission.offre) {
      var l = LIEU[S.mission.lieu];
      html += "<h3>En cours</h3><p class=\"v-inv-chez\"><b>" + esc(m.titre) + "</b> · " + esc(l ? nomLieu(l) : S.mission.lieu) + " · avant " + esc(quand(S.mission.jusqua)) + "</p>";
    }
    html += "</div>";
    coquille.panneau("Tes affaires", html);
    document.querySelectorAll(".v-inv [data-vendre]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (!b.classList.contains("confirme")) { b.classList.add("confirme"); b.textContent = "Sûr ? " + b.textContent.replace(/^Revendre · /, ""); return; }
        coquille.fermer(); revendre(b.getAttribute("data-vendre"));
      });
    });
  }

  // ─────────────────────────────────────────────────────────────── le pont
  // Ce qu'une carte du moteur fait à la ville passe par des compteurs (`vars`) qui
  // ne font que monter : la ville retient ce qu'elle en a déjà appliqué (S.pont)
  // et applique la différence — l'argent, propre ou sale, l'amende, le cadeau
  // d'un sponsor, la saisie.
  var annonces = [];
  function pont(v, prof) {
    if (!v || !v.vars || !S || (prof || 0) > 3) return;
    S.pont = S.pont || {};
    var recu = 0, sale = 0, amende = 0, cadeaux = [], saisies = [], vole = false;
    Object.keys(v.vars).sort().forEach(function (nom) {
      var val = +v.vars[nom] || 0, d = val - (S.pont[nom] || 0);
      S.pont[nom] = val;
      if (!d) return;
      if (nom === "ville_francs") recu += d;
      else if (nom === "ville_francs_sales") sale += d;
      else if (nom === "ville_amende") amende += d;
      else if (d > 0 && nom.indexOf("cadeau_") === 0) cadeaux.push(nom.slice(7));
      else if (d > 0 && nom.indexOf("saisie_") === 0) saisies.push(nom.slice(7));
      else if (d > 0 && nom === "vol_luxe") vole = true;
    });
    var net = recu + sale - amende;
    S.francs += net;
    if (sale > 0) S.sale = (S.sale || 0) + sale;
    if (net) gain(net);
    var appels = false;
    cadeaux.forEach(function (id) {
      if (!OBJET[id] || possede(id)) return;
      S.biens[id] = { prix: OBJET[id].prix, depuis: tNow(), cadeau: true, sale: sale > 0 };
      vue = coquille.biens(id, true); appels = true;
      annonces.push({ titre: "Un cadeau", sous: OBJET[id].nom, texte: OBJET[id].texte });
    });
    if (saisies.length) {
      var pris = {};
      saisies.forEach(function (q) { aSaisir(q).forEach(function (id) { pris[id] = 1; }); });
      var ids = Object.keys(pris).sort(), noms = ids.map(function (id) { return OBJET[id].nom.charAt(0).toLowerCase() + OBJET[id].nom.slice(1); });
      ids.forEach(function (id) { delete S.biens[id]; vue = coquille.biens(id, false); appels = true; });
      var tout = saisies.indexOf("tout") >= 0;
      if (tout) { S.francs = Math.min(0, S.francs); S.sale = 0; }
      var texte = noms.length ? "Ils ont emporté " + liste(noms) + "." : "Ils ont fouillé. Ils n'ont rien trouvé à prendre.";
      if (tout) texte += " Le compte est bloqué.";
      annonces.push({ titre: "La police", sous: JOUR_MOT[S.jour] + ", " + HEURE[TRANCHES[S.tranche]], texte: texte });
    }
    if (vole) {
      var vids = aVoler(), vnoms = vids.map(function (id) { return OBJET[id].nom.charAt(0).toLowerCase() + OBJET[id].nom.slice(1); });
      vids.forEach(function (id) { delete S.biens[id]; vue = coquille.biens(id, false); appels = true; });
      annonces.push({ titre: "Le cambriolage", sous: nomLieu(LIEU.appartement), texte: vnoms.length ? "La porte n'a pas été forcée. Ils ont pris " + liste(vnoms) + "." : "Les tiroirs sont ouverts, les placards aussi. Il n'y avait rien à prendre ; ils ont laissé la porte ouverte pour que tu le saches." });
    }
    if (appels && vue && !vue.over) pont(vue, (prof || 0) + 1);
  }
  function liste(l) { return l.length <= 1 ? (l[0] || "") : l.slice(0, -1).join(", ") + " et " + l[l.length - 1]; }
  function annoncer() {
    if (!annonces.length || carteOn || occupe) return;
    var a = annonces.shift();
    fonduTexte(a.titre, a.sous, a.texte, null, function () { majHud(); annoncer(); });
  }

  // ─────────────────────────────────────────────────────────────── les missions
  // Rares (content/ville/missions.yaml) : quelqu'un, à un lieu, à une heure, te
  // propose une affaire. On l'écoute ou pas ; chaque choix a son prix (l'argent,
  // propre ou sale, les effets par `Engine.mission`), et une étape peut te donner
  // rendez-vous ailleurs, avant un délai. Passé le délai : l'échec, et son prix.
  // Une proposition par semaine au plus, une mission à la fois.
  var MISSION = {};
  function etapeDe(m, id) { return (m.etapes || []).filter(function (e) { return e.id === id; })[0] || null; }
  function montantDe(m, e) {
    var best = 0;
    ((e && e.choix) || []).forEach(function (c) { if (Math.abs(c.francs || 0) > best) best = Math.abs(c.francs); });
    if (!best) (m.etapes || []).forEach(function (x) { (x.choix || []).forEach(function (c) { if (Math.abs(c.francs || 0) > best) best = Math.abs(c.francs); }); });
    return best ? argent(best) : "";
  }
  function proposer(cle) {
    if (S.mission || tNow() - (S.derniereOffre == null ? -99 : S.derniereOffre) < 35) return;
    var tr = TRANCHES[S.tranche], jour = Math.floor(tNow() / 5);
    var ids = Object.keys(MISSION).sort();
    for (var i = 0; i < ids.length; i++) {
      var m = MISSION[ids[i]], d = m.donneur || {};
      if (d.lieu !== cle) continue;
      if (m.roles && m.roles.indexOf(S.role) < 0) continue;
      if (m.une_fois !== false && S.missionsFaites[m.id]) continue;
      if (d.tranches && d.tranches.length && d.tranches.indexOf(tr) < 0) continue;
      if (S.offres[m.id] === jour) continue;
      if (!siVrai(m.si, cle)) continue;
      S.offres[m.id] = jour;
      if (Math.random() >= (m.chance || 0)) continue;
      S.mission = { id: m.id, etape: m.etapes[0].id, offre: true, lieu: cle, jusqua: tNow() + 2 };
      S.derniereOffre = tNow();
      return;
    }
  }
  function missionIci(cle) {
    var sm = S.mission;
    if (!sm || !MISSION[sm.id] || sm.lieu !== cle) return null;
    if (!sm.offre && sm.tranches && sm.tranches.length && sm.tranches.indexOf(TRANCHES[S.tranche]) < 0) return null;
    return MISSION[sm.id];
  }
  // le délai est passé : l'échec de l'étape (ou l'offre qui s'en va)
  function echeanceMission() {
    var sm = S.mission;
    if (!sm || tNow() <= sm.jusqua) return;
    var m = MISSION[sm.id];
    S.mission = null;
    if (sm.offre || !m) return;
    S.missionsFaites[m.id] = true;
    var e = etapeDe(m, sm.etape), ec = e && e.echec;
    vue = coquille.mission(m.id, sm.etape, "");
    pont(vue);
    if (vue.over) return;
    annonces.push({ titre: m.titre, sous: "Trop tard", texte: remplir(ec && ec.texte ? ec.texte : "Le rendez-vous est passé. Personne ne t'a attendu.", { montant: montantDe(m, e) }) });
  }
  function ouvrirMission(cle, etapeId, apres) {
    var sm = S.mission, m = sm && MISSION[sm.id];
    if (!m) return;
    var e = etapeDe(m, etapeId || sm.etape);
    if (!e) { S.mission = null; return; }
    porteOuverte = cle;
    var d = m.donneur || {}, el = $("villePorte");
    var html = '<h2>' + esc(m.titre) + '</h2><p class="v-sous">' + esc(d.nom || "") + " · " + esc(nomLieu(LIEU[cle])) + "</p>";
    if (apres) html += '<p class="v-fait">' + esc(apres) + "</p>";
    html += '<p class="v-texte">' + esc(remplir(e.texte, { montant: montantDe(m, e) })) + "</p><div class=\"v-acts\">";
    (e.choix || []).forEach(function (c) {
      if (!siVrai(c.si, cle)) return;
      var non = c.francs < 0 && S.francs + c.francs < 0 ? "Tu n'as pas cette somme." : "";
      html += '<button type="button" class="v-act v-choix" data-c="' + esc(c.id) + '"' + (non ? " disabled" : "") + "><b>" + esc(c.label) + "</b>" +
        (c.francs ? '<span class="cout"><span class="' + (c.francs > 0 ? "up" : "dn") + '">' + (c.francs > 0 ? "+" : "") + esc(argent(c.francs)) + (c.sale ? " · sale" : "") + "</span></span>" : "") +
        (non ? '<span class="pourquoi">' + esc(non) + "</span>" : "") + "</button>";
    });
    html += "</div>";
    el.innerHTML = html;
    el.classList.add("on", "v-mission");
    el.querySelectorAll(".v-choix").forEach(function (b) {
      b.addEventListener("click", function () { choisirMission(cle, m, e, b.getAttribute("data-c")); });
    });
  }
  function choisirMission(cle, m, e, cid) {
    var c = (e.choix || []).filter(function (x) { return x.id === cid; })[0];
    if (!c || carteOn || occupe) return;
    if (c.francs) {
      S.francs += c.francs;
      if (c.sale && c.francs > 0) S.sale = (S.sale || 0) + c.francs;
      gain(c.francs);
    }
    vue = coquille.mission(m.id, e.id, c.id);
    pont(vue);
    if (vue.over) return;
    var reponse = remplir(c.reponse, { montant: montantDe(m, e) });
    var suite = c.suite && c.suite !== "fin" ? etapeDe(m, c.suite) : null;
    if (!suite) {
      S.mission = null; S.missionsFaites[m.id] = true;
      majHud(); sauver();
      ouvrirPorte(cle, reponse);
      annoncer();
      return;
    }
    if (suite.objectif) {
      var o = suite.objectif;
      S.mission = { id: m.id, etape: suite.id, offre: false, lieu: o.lieu, tranches: o.tranches || [], jusqua: tNow() + (o.delai || 3) * 5 };
      majHud(); sauver();
      var l = LIEU[o.lieu];
      ouvrirPorte(cle, reponse + " — " + (l ? nomLieu(l) : o.lieu) + (o.tranches && o.tranches.length ? ", " + o.tranches.map(function (t) { return TRANCHE_MOT[t].toLowerCase(); }).join(" ou ") : "") + ", avant " + quand(S.mission.jusqua) + ".");
      return;
    }
    S.mission.etape = suite.id; S.mission.offre = false;
    sauver();
    ouvrirMission(cle, suite.id, reponse);
  }

  // ─────────────────────────────────────────────────────────────── le rendu
  var dernier = 0;
  function image(ts) {
    if (!actif) { dernier = 0; return; }
    requestAnimationFrame(image);
    var dt = dernier ? Math.min(0.05, (ts - dernier) / 1000) : 0;
    dernier = ts;
    if (!occupe && !carteOn) { majMarche(dt); majPassants(dt, ts); majActeurs(dt, ts); }
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
    // les gens, du fond vers l'avant (x + y croissant) ; on garde la boîte de
    // chacun, pour qu'un doigt puisse le toucher
    var gens = [];
    for (var i = 0; i < passants.length; i++) gens.push(passants[i]);
    for (var id in acteurs) gens.push(acteurs[id]);
    figurants.forEach(function (g) { gens.push(g); });
    gens.push({ sp: S.role === "joueur" ? "joueur" : "coach", x: heros.x, y: heros.y, miroir: heros.miroir, pas: heros.pas, heros: true });
    gens.sort(function (a, b) { return (a.x + a.y) - (b.x + b.y); });
    dessines = [];
    for (var j = 0; j < gens.length; j++) {
      var g = gens[j];
      var bx = dessinerSprite(g.sp, g.x, g.y, { miroir: g.miroir, pas: g.pas, silhouette: !!g.heros, pal: g.pal, alpha: g.alpha });
      g.tete = bx ? bx.tete : null;
      if (bx && !g.heros) { bx.g = g; dessines.push(bx); }
    }
    // la marque du rendez-vous (jamais pour un événement sombre)
    var m = marqueRdv();
    if (m) dessinerMarque(m[0], m[1], ts);
  }
  var dessines = [];

  // ─────────────────────────────────────────────────────────────── les étiquettes
  var etiquettes = {}, fleche = null;
  function placerEtiquettes() {
    var couche = $("villeCouche");
    if (!couche) return;
    majBulle();
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
        e.type = "button"; e.className = "v-lieu";
        e.addEventListener("click", (function (cle) { return function (ev) { ev.stopPropagation(); allerAuLieu(cle); }; })(l.key));
        couche.appendChild(e); etiquettes[l.key] = e;
      }
      var nm = nomLieu(l);
      if (e.textContent !== nm) e.textContent = nm;
      var ew = e.offsetWidth || 90;
      e.style.left = Math.round(clamp(sx, ew / 2 + 6, VW * k - ew / 2 - 6)) + "px"; e.style.top = Math.round(sy) + "px";
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
      var txt = dir + " " + nomLieu(L2);
      if (fleche.textContent !== txt) fleche.textContent = txt;
      fleche.hidden = false;
      // la flèche entière dans l'écran, jamais coupée par un bord
      var fw = fleche.offsetWidth || 120, fx = clamp(cx + dx / m, fw / 2 + 10, W - fw / 2 - 10);
      fleche.style.left = Math.round(fx) + "px";
    } else fleche.hidden = true;
  }

  // ─────────────────────────────────────────────────────────────── où va une carte
  function lieuDe(c) {
    var B = D.beats || {}, CL = D.cartes_lieux || {}, R = D.rencontres || {}, GN = D.genres || {};
    if (B[c.beatKind]) return B[c.beatKind] === "appartement" ? chezToi() : B[c.beatKind];
    if (c.lieu && CL[c.lieu]) return CL[c.lieu] === "appartement" ? chezToi() : CL[c.lieu];
    if (c.kind && GN[c.kind] === "ici") return "ici";
    if (c.speaker && R[c.speaker]) return R[c.speaker] === "appartement" ? chezToi() : R[c.speaker];
    if (c.kind && GN[c.kind]) return GN[c.kind] === "appartement" ? chezToi() : GN[c.kind];
    return S.tranche >= 3 ? chezToi() : "clubhouse";
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
      r.type = "dimanche"; r.lieu = chezToi();
      r.debut = r.fin = (S.jour === 6 || S.jour === 5 && S.tranche >= 3) ? maintenant : prochain(6, 0, false);
      if (bk === "bilan_une") r.debut = r.fin = maintenant;
      r.force = "scene";
    } else if (bk === "bilan_verdict" || bk === "bilan_contrat") {
      r.lieu = "clubhouse"; r.fin = maintenant + 3; r.force = "vient";
    } else if (bk === "bilan_carrefour") {
      r.lieu = chezToi(); r.debut = r.fin = maintenant; r.force = "scene";
    } else if (bk === "prologue") {
      r.type = "prologue"; r.fin = maintenant + 4; r.force = "vient";
    } else if (c.lieu === "ailleurs") {
      // loin d'Aubérive : la carte se joue tout de suite, la ville s'efface
      r.type = "ailleurs"; r.lieu = "ici"; r.debut = r.fin = maintenant; r.force = "ici";
    } else if ((c.tags || []).indexOf("intermede") >= 0) {
      // l'intermède : une nuit qu'on ne se rappelle pas — il vient la nuit, où que tu sois
      r.type = "intermede"; r.lieu = "ici"; r.qui = null;
      r.debut = r.fin = S.tranche === 4 ? maintenant : tDe(S.semaine, S.jour, 4);
      r.force = "nuit";
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
      // un lieu qui a ses heures (le club privé, l'arrière-salle : le soir) : le
      // rendez-vous se prend quand il est ouvert, et dure jusqu'au lendemain soir
      var def = TEXTE_LIEU[lieu];
      if (def && (def.heures || def.jours) && !ouvertA(def, debut)) {
        debut = prochainOuvert(def, debut);
        fin = debut + 5;
      }
      r.debut = debut; r.fin = fin; r.force = "vient";
    }
    return r;
  }
  function ouvertA(def, t) {
    if (def.heures && def.heures.indexOf(TRANCHES[trancheDe(t)]) < 0) return false;
    if (def.jours && def.jours.indexOf(JOURS[jourDe(t)]) < 0) return false;
    return true;
  }
  function prochainOuvert(def, t) {
    for (var i = 0; i < 70; i++) if (ouvertA(def, t + i)) return t + i;
    return t;
  }
  function rdvVisible() { return rdv && !rdv.sombre && rdv.lieu !== "ici" && rdv.lieu !== "rue" && tNow() >= rdv.debut; }
  // au-dessus de celui qui t'attend, s'il est là ; sinon sur la porte
  function marqueRdv() {
    if (!rdvVisible() || !LIEU[rdv.lieu]) return null;
    var A = rdv.qui && acteurs[rdv.qui];
    if (A && A.etat !== "part" && A.lieu === rdv.lieu && A.alpha > 0.5) return [A.x, A.y];
    var c = centre(LIEU[rdv.lieu].door);
    return [c[0], c[1]];
  }

  // ─────────────────────────────────────────────────────────────── l'arrivée de la carte
  // le décor d'ailleurs, derrière la carte (ville.yaml → `ailleurs`)
  function decorAilleurs(v) {
    var voile = $("villeVoile");
    if (!voile) return;
    var c = v && v.card, A = D.ailleurs || {}, d = null;
    if (c && c.lieu === "ailleurs") {
      (c.tags || []).forEach(function (t) { if (!d && A[t]) d = A[t]; });
      d = d || A.defaut || { titre: "Loin d'Aubérive", sous: "" };
    }
    voile.classList.toggle("ailleurs", !!d);
    var b = voile.querySelector(".v-ailleurs");
    if (!b) { b = document.createElement("div"); b.className = "v-ailleurs"; b.innerHTML = "<b></b><span></span>"; voile.appendChild(b); }
    b.querySelector("b").textContent = d ? d.titre : "";
    b.querySelector("span").textContent = d ? d.sous : "";
  }
  function montrerCarte() {
    fermerPorte();
    carteOn = true;
    heros.chemin = null;
    decorAilleurs(vue);
    $("gameScreen").classList.add("carte-on");
    $("villeVoile").classList.add("on");
    document.body.classList.add("v-carte");
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
    decorAilleurs(null);
    $("gameScreen").classList.remove("carte-on");
    $("villeVoile").classList.remove("on");
    document.body.classList.remove("v-carte");
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
    if (t >= rdv.debut && rdv.force === "nuit") {
      // l'intermède : le noir, puis la carte (rien ne dit si c'était un rêve)
      occupe = true;
      fonduTexte("", "", "", null, function () { occupe = false; montrerCarte(); });
      return true;
    }
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
    if (S.mission && !S.mission.offre && missionIci(cle)) { ouvrirMission(cle); return; }
    proposer(cle);
    ouvrirPorte(cle);
  }

  // La scène : un fondu, l'heure et le lieu, des figurants, puis la carte.
  // (les figurants d'une scène sont posés pendant le noir, à des places vérifiées)
  var FIGURANTS = {
    stade: function (c) { return foule(c, 12, "fan", 9); },
    appartement: function (c) { return foule(c, 5, "fan", 5); },
    buvette: function (c) { return foule(c, 6, "fan", 6); },
    friche: function (c) { return foule(c, 4, "fan", 6); },
    laverie: function () { return seul("laverie", "inconnu"); },
    voiture: function () { return seul("voiture", "inconnu"); },
    club_prive: function () { return seul("club_prive", "inconnu"); },
    tripot: function () { return seul("tripot", "inconnu"); }
  };
  function seul(cle, sp) {
    if (!LIEU[cle]) return [];
    var p = placesDe(cle), q = p[1] || p[0];
    return [{ sp: sp, x: q[0], y: q[1], miroir: true, pas: 0 }];
  }
  function foule(c, n, sp, r) {
    var out = [];
    for (var i = 0; i < n; i++) {
      var a = i * 2.39996, d = 3 + (i % 4) * r / 3;
      var x = c[0] + Math.cos(a) * d, y = c[1] + Math.sin(a) * d * 0.7;
      var cc = caseDe(x, y);
      if (!auLarge(cc[0], cc[1]) || !vue_libre(caseDe(c[0], c[1]), cc)) continue;
      out.push({ sp: sp, x: x, y: y, miroir: i % 2 === 0, pas: 0, pal: auHasard(PEAUX) });
    }
    return out;
  }
  function scene(r) {
    if (occupe) return;
    occupe = true;
    var l = LIEU[r.lieu] || LIEU[S.lieu] || LIEU.appartement;
    var c = centre(l.door);
    var titre = r.type === "match" ? (JOUR_MOT[S.jour] + ", " + HEURE[TRANCHES[S.tranche]]) : (JOUR_MOT[S.jour] + ", " + HEURE[TRANCHES[S.tranche]]);
    var sous = nomLieu(l);
    if (r.type === "match" && vue && vue.card && vue.card.beatKind === "cup") sous = "La Coupe · " + nomLieu(l);
    fonduTexte(titre, sous, r.sombre ? "" : "", function () {
      poser(c[0], c[1]); S.lieu = l.key;
      var p = versImage(heros.x, heros.y, ZSOL + 8); cam.x = p[0]; cam.y = p[1]; cam.libre = false;
      recaler();
      figurants = [];
      var f = FIGURANTS[l.key];
      if (r.sombre && f) figurants = f(c);
      else if (r.type === "match") figurants = foule(c, 10, "fan", 9);
      // un événement sombre vide la rue
      if (r.sombre) passants = [];
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
    echeanceMission();
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
    var j = (vue && vue.journee) || 0, dj = j - (S.journeeDebut || 0);
    S.journeeDebut = j;
    // la paie : autant de semaines de championnat qu'il en a passé (une au moins)
    var paie = salaire() * Math.max(1, dj);
    S.francs += paie;
    var phrase = dj >= 3 ? dj + " semaines plus tard" : dj >= 1 ? "Quelques semaines plus tard" : "La semaine suivante";
    attente.push({ titre: phrase, sous: moisCourant(), texte: "La paie est tombée : " + argent(paie) + "." + (S.francs - paie < 0 && S.francs >= 0 ? " Le découvert est comblé." : "") });
  }
  var attente = [];
  function effondrement() {
    var chez = chezToi(), l = LIEU[chez], c = centre(l.door);
    fonduTexte("Tu t'effondres", JOUR_MOT[S.jour] + ", " + HEURE[TRANCHES[S.tranche]], "On te ramène chez toi. Tu dors jusqu'au lendemain midi.", function () {
      poser(c[0], c[1]); S.lieu = chez;
      while (S.tranche !== 1 || !S._dormi) { S.tranche++; if (S.tranche > 4) { S.tranche = 0; nouveauJour(); S._dormi = true; } }
      S._dormi = false;
      S.energie = 45; S.faim = clamp(S.faim, 10, 100);
      var p = versImage(heros.x, heros.y, ZSOL + 8); cam.x = p[0]; cam.y = p[1]; cam.libre = false;
      recaler();
    }, function () { majHud(); sauver(); echeance(); });
  }
  var allerApresNuit = false;
  function dormir() {
    // jusqu'au matin suivant ; la nuit peut être interrompue par un rendez-vous (ou un événement)
    var depart = S.semaine;
    var lg = logement();
    S.energie = clamp(S.energie + 60 + clamp(Math.max(usage("repos"), lg ? +lg.logement.repos || 0 : 0), 0, 30), 0, 100);
    S.faim = clamp(S.faim - 10 + clamp(usage("faim"), 0, 30), 0, 100);
    var garde = 0;
    do { S.tranche++; if (S.tranche > 4) { S.tranche = 0; nouveauJour(); } } while (S.tranche !== 0 && ++garde < 10);
    majHud(); sauver();
    var titre = JOUR_MOT[S.jour] + ", 7 h";
    fonduTexte(titre, moisCourant(), S.semaine !== depart ? "" : "", recaler, function () {
      suiteFondus();
      if (echeance()) { allerApresNuit = false; return; }
      if (allerApresNuit) {
        allerApresNuit = false;
        if (rdv && LIEU[rdv.lieu] && !rdv.sombre) { if (tNow() < rdv.debut) avancerJusquA(rdv.debut); else allerAuLieu(rdv.lieu); }
      }
    });
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
    if (a.francs < 0 && S.francs + a.francs < 0) return "Pas assez d'argent.";
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
    if (a.francs) out.push('<span class="' + (a.francs > 0 ? "up" : "dn") + '">' + (a.francs > 0 ? "+" : "") + argent(a.francs) + '</span>');
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
    el.classList.remove("v-mission");
    var acts = activitesIci(cle);
    // ce qu'on voit en entrant : la première variante vraie (la vitrine qui
    // change, la plaque gravée…), sinon le texte du lieu
    var vu = (D.lieux_variantes || []).filter(function (v) { return v.lieu === cle && siVrai(v.si, cle); })[0];
    var texteLieu = vu ? remplir(vu.texte) : def.texte;
    var html = '<h2>' + esc(nomLieu(l)) + '</h2>' +
      '<p class="v-sous">' + esc(JOUR_MOT[S.jour] + " · " + TRANCHE_MOT[TRANCHES[S.tranche]].toLowerCase()) + (lieuOuvert ? "" : " · fermé") + '</p>' +
      (texteLieu ? '<p class="v-texte">' + esc(texteLieu) + '</p>' : "") +
      '<p class="v-fait"' + (fait ? "" : " hidden") + '>' + esc(fait || "") + '</p>';
    // le rendez-vous de plus tard, s'il est ici
    if (rdv && rdv.lieu === cle && !rdv.sombre && tNow() < rdv.debut) {
      html += '<p class="v-texte">' + esc((rdv.qui ? nomDe(rdv.qui) : "On") + " t'attend ici " + quand(rdv.debut) + ".") + '</p>';
    }
    // quelqu'un veut te parler (une mission), ou t'attend ici pour la suite
    var mi = missionIci(cle);
    if (mi) {
      var dn = (mi.donneur && mi.donneur.nom) || "Quelqu'un";
      html += '<button type="button" class="v-mi">' + (S.mission.offre ? "<b>" + esc(dn) + "</b> voudrait te parler" : "<b>" + esc(mi.titre) + "</b> · c'est ici, c'est maintenant") + " →</button>";
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
    // ce qui se vend ici (deux gestes pour acheter : on ne vide pas un compte d'un doigt)
    var objets = aVendreIci(cle);
    if (objets.length) {
      html += '<h3 class="v-h">À vendre</h3><div class="v-acts v-objets">';
      objets.forEach(function (o) {
        var non = pourquoiPasAcheter(o, lieuOuvert), a = possede(o.id);
        html += '<button type="button" class="v-act v-objet' + (a ? " a-toi" : "") + '" data-o="' + esc(o.id) + '"' + (non ? " disabled" : "") + '>' +
          '<b>' + esc(o.nom) + '</b><span class="cout"><span class="prix">' + esc(argent(o.prix)) + '</span></span>' +
          '<span class="t">' + esc(remplir(o.texte)) + '</span>' +
          (non ? '<span class="pourquoi">' + esc(non) + '</span>' : "") + '</button>';
      });
      html += '</div>';
    }
    // on t'attend ailleurs : le chemin, d'un geste
    var ailleurs = rdvVisible() && rdv.lieu !== cle && LIEU[rdv.lieu];
    if (ailleurs) html += '<button type="button" class="v-sortir v-y">' + esc((rdv.qui ? nomDe(rdv.qui) + " t'attend · " : "On t'attend · ") + nomLieu(LIEU[rdv.lieu])) + ' →</button>';
    html += '<button type="button" class="v-sortir">Sortir</button>';
    el.innerHTML = html;
    var y = el.querySelector(".v-y");
    if (y) y.addEventListener("click", function () { allerAuLieu(rdv.lieu); });
    el.classList.add("on");
    el.querySelectorAll(".v-act[data-act]").forEach(function (b) {
      b.addEventListener("click", function () { faire(b.getAttribute("data-act")); });
    });
    el.querySelectorAll(".v-objet").forEach(function (b) {
      b.addEventListener("click", function () {
        if (!b.classList.contains("confirme")) {
          el.querySelectorAll(".v-objet.confirme").forEach(function (x) { x.classList.remove("confirme"); });
          b.classList.add("confirme");
          var p = b.querySelector(".prix"); if (p) p.textContent = "Acheter · " + argent(OBJET[b.getAttribute("data-o")].prix);
          return;
        }
        acheter(b.getAttribute("data-o"), cle);
      });
    });
    var bm = el.querySelector(".v-mi");
    if (bm) bm.addEventListener("click", function () { ouvrirMission(cle); });
    el.querySelector(".v-sortir:not(.v-y)").addEventListener("click", fermerPorte);
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
      pont(vue);
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
    fr.textContent = argent(S.francs); fr.classList.toggle("bas", S.francs < 100);
    var r = h.querySelector(".v-rdv");
    if (rdv && !rdv.sombre && rdv.lieu !== "ici" && rdv.lieu !== "rue" && LIEU[rdv.lieu]) {
      var qui = rdv.qui ? nomDe(rdv.qui) : "On";
      var ou = nomLieu(LIEU[rdv.lieu]);
      var txt;
      if (rdv.type === "match") txt = "<b>" + (vue && vue.card && vue.card.beatKind === "cup" ? "La Coupe" : "Le match") + "</b> · " + esc(ou) + " · " + esc(quand(rdv.debut)) + ", " + HEURE[TRANCHES[trancheDe(rdv.debut)]];
      else if (rdv.type === "dimanche") txt = "<b>Le journal du dimanche</b> · chez toi";
      else if (tNow() < rdv.debut) txt = "<b>" + esc(qui) + "</b> t'attendra · " + esc(ou) + " · " + esc(quand(rdv.debut));
      else txt = "<b>" + esc(qui) + "</b> t'attend · " + esc(ou) + " · avant " + esc(quand(rdv.fin));
      r.innerHTML = txt; r.hidden = false;
    } else r.hidden = true;
    var mh = h.querySelector(".v-mi-hud"), sm = S.mission, m = sm && MISSION[sm.id];
    if (m && !sm.offre && LIEU[sm.lieu]) {
      mh.innerHTML = "<b>" + esc(m.titre) + "</b> · " + esc(nomLieu(LIEU[sm.lieu])) + (sm.tranches && sm.tranches.length ? ", " + esc(sm.tranches.map(function (t) { return TRANCHE_MOT[t].toLowerCase(); }).join(" ou ")) : "") + " · avant " + esc(quand(sm.jusqua));
      mh.hidden = false;
    } else mh.hidden = true;
    var bt = $("villeAttendre");
    if (bt) bt.disabled = carteOn || occupe;
  }

  // ─────────────────────────────────────────────────────────────── le plan
  // Le plan : la ville vue de loin (plan.webp, le rendu du jour réduit au tiers),
  // les quartiers, un point par lieu, où tu es, où l'on t'attend. Toucher un
  // point dit son nom et ouvre le chemin ; la liste suit, quartier par quartier.
  var QUARTIERS = [["residentiel", "La rue des Lilas", "Rue des Lilas"], ["stade", "Le carrefour du stade", "Le stade"], ["sport", "Le terrain annexe", "Terrain annexe"],
    ["sante", "Le quartier de la santé", "La santé"], ["vieilleville", "La vieille ville, de l'autre côté de la Rive", "Vieille ville"],
    ["cimetiere", "Le cimetière", "Le cimetière"], ["friche", "La friche", "La friche"]];
  var PLAN_ECHELLE = 1 / 3;
  function surPlan(x, y) { var p = versImage(x, y, ZSOL); return [Math.round(p[0] * PLAN_ECHELLE), Math.round(p[1] * PLAN_ECHELLE)]; }
  function cartePlan() {
    var W0 = Math.round(P.w * PLAN_ECHELLE), H0 = Math.round(P.h * PLAN_ECHELLE);
    var html = '<div class="v-carte" id="villeCarte"><div class="v-carte-in' + (S.tranche >= 3 ? " nuit" : "") + '" style="width:' + W0 + 'px;height:' + H0 + 'px">' +
      '<img src="' + BASE + 'plan.webp" alt="Le plan d\'Aubérive" width="' + W0 + '" height="' + H0 + '" draggable="false">';
    QUARTIERS.forEach(function (q) {
      var n = 0, sx = 0, sy = 0;
      L.places.forEach(function (l) { if (l.door && l.district === q[0]) { var p = surPlan.apply(null, centre(l.door)); sx += p[0]; sy += p[1]; n++; } });
      if (n) html += '<span class="v-q" style="left:' + Math.round(sx / n) + 'px;top:' + Math.round(sy / n - 34) + 'px">' + esc(q[2]) + '</span>';
    });
    var ici = rdvVisible() && LIEU[rdv.lieu] ? rdv.lieu : null;
    L.places.forEach(function (l) {
      if (!l.door || !TEXTE_LIEU[l.key]) return;
      var p = surPlan.apply(null, centre(l.door)), r = l.key === ici;
      html += '<button type="button" class="v-pt' + (r ? " rdv" : "") + (ouvert(TEXTE_LIEU[l.key]) ? "" : " ferme") + '" data-l="' + esc(l.key) + '" style="left:' + p[0] + 'px;top:' + p[1] + 'px" aria-label="' + esc(nomLieu(l)) + '"><i></i>' +
        (r ? '<span>' + esc(nomLieu(l)) + '</span>' : "") + '</button>';
    });
    var h = surPlan(heros.x, heros.y);
    html += '<span class="v-moi" style="left:' + h[0] + 'px;top:' + h[1] + 'px"><i></i><span>Toi</span></span>';
    html += '</div></div><div class="v-carte-note" id="villeCarteNote"><span>Touche un point : son nom, et le chemin.</span></div>';
    return html;
  }
  function brancherPlan() {
    var boite = $("villeCarte");
    if (!boite) return;
    var h = surPlan(heros.x, heros.y);
    boite.scrollLeft = Math.max(0, h[0] - boite.clientWidth / 2);
    boite.scrollTop = Math.max(0, h[1] - boite.clientHeight / 2);
    // glisser pour se promener sur le plan (la souris ; le doigt fait défiler tout seul)
    boite.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.target.closest(".v-pt")) return;
      glisse = { boite: boite, x: e.clientX, y: e.clientY, l: boite.scrollLeft, t: boite.scrollTop };
    });
    boite.querySelectorAll(".v-pt").forEach(function (b) {
      b.addEventListener("click", function () {
        var cle = b.getAttribute("data-l"), l = LIEU[cle], def = TEXTE_LIEU[cle] || {};
        boite.querySelectorAll(".v-pt.choisi").forEach(function (x) { x.classList.remove("choisi"); });
        b.classList.add("choisi");
        var note = $("villeCarteNote");
        var loin = Math.abs(l.door[0] - caseDe(heros.x, heros.y)[0]) + Math.abs(l.door[1] - caseDe(heros.x, heros.y)[1]) > 40;
        note.innerHTML = '<span><b>' + esc(nomLieu(l)) + '</b>' + (ouvert(def) ? "" : " · fermé à cette heure") + '</span><span class="v-carte-btns">' +
          (aUnHelico() && loin ? '<button type="button" class="v-carte-go v-helico">En hélico</button>' : "") + '<button type="button" class="v-carte-go v-pied">Y aller →</button></span>';
        note.querySelector(".v-pied").addEventListener("click", function () { coquille.fermer(); allerAuLieu(cle); });
        var hb = note.querySelector(".v-helico");
        if (hb) hb.addEventListener("click", function () { coquille.fermer(); helico(cle); });
      });
    });
  }
  // l'hélicoptère (un bien qui a `usage: {deplacement: …}`) : un fondu, et te voilà
  function helico(cle) {
    var l = LIEU[cle];
    if (!l || carteOn || occupe) return;
    occupe = true;
    fonduTexte("L'hélicoptère", nomLieu(l), "Le pilote ne pose pas de questions. Aubérive tient dans le hublot.", function () {
      var c = centre(l.door); poser(c[0], c[1]);
      var p = versImage(heros.x, heros.y, ZSOL + 8); cam.x = p[0]; cam.y = p[1]; cam.libre = false;
      recaler();
    }, function () { occupe = false; arriver(cle); });
  }
  var glisse = null;
  window.addEventListener("pointermove", function (e) { if (glisse) { glisse.boite.scrollLeft = glisse.l - (e.clientX - glisse.x); glisse.boite.scrollTop = glisse.t - (e.clientY - glisse.y); } });
  window.addEventListener("pointerup", function () { glisse = null; });
  function ouvrirPlan() {
    if (!coquille) return;
    fermerPorte();
    var html = cartePlan() + '<div class="v-plan">';
    if (rdvVisible() && LIEU[rdv.lieu]) {
      html += '<h3>On t\'attend</h3><button type="button" class="rdv" data-l="' + esc(rdv.lieu) + '"><span>' + esc(nomLieu(LIEU[rdv.lieu])) + '</span><i>' + esc(rdv.qui ? nomDe(rdv.qui) : "") + '</i></button>';
    }
    var parQ = {};
    L.places.forEach(function (l) { if (l.door && TEXTE_LIEU[l.key]) (parQ[l.district] = parQ[l.district] || []).push(l); });
    QUARTIERS.forEach(function (q) {
      var ls = parQ[q[0]];
      if (!ls) return;
      html += '<h3>' + esc(q[1]) + '</h3>';
      ls.forEach(function (l) {
        var def = TEXTE_LIEU[l.key] || {};
        var etat = ouvert(def) ? "" : "fermé";
        html += '<button type="button" data-l="' + esc(l.key) + '"><span>' + esc(nomLieu(l)) + '</span><i>' + esc(etat) + '</i></button>';
      });
    });
    html += '</div>';
    coquille.panneau("Aubérive", html);
    document.querySelectorAll(".v-plan button[data-l]").forEach(function (b) {
      b.addEventListener("click", function () { coquille.fermer(); allerAuLieu(b.getAttribute("data-l")); });
    });
    brancherPlan();
  }
  // attendre : une tranche passe, là où tu es
  function attendre() {
    if (carteOn || occupe) return;
    fermerPorte();
    if (S.tranche === 4) {
      if (S.lieu === chezToi()) { dormir(); return; }
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
      // quelqu'un sous le doigt ? (le plus en avant d'abord ; un corps de dix
      // pixels se touche avec un peu de marge)
      var px = e.clientX / k, py = e.clientY / k, m = Math.max(3, 10 / k);
      for (var i = dessines.length - 1; i >= 0; i--) {
        var b = dessines[i];
        if (px >= b.x - m && px <= b.x + b.w + m && py >= b.y - m && py <= b.y + b.h + m) { toucherQuelquun(b.g); return; }
      }
      if (bulle) { bulle.g.parle = false; bulle = null; }
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
      '<div class="v-besoin v-faim"><i>Faim</i><div class="barre"><u></u></div></div><div class="v-argent"><div class="v-francs"></div><span class="v-gain" aria-live="polite"></span></div></div>' +
      '<p class="v-rdv" hidden></p><p class="v-rdv v-mi-hud" hidden></p>';
    var rail = $("rail");
    rail.parentNode.insertBefore(hud, rail.nextSibling);
    var espace = document.createElement("div"); espace.className = "v-espace";
    var actions = document.createElement("div"); actions.className = "v-actions";
    actions.innerHTML = '<button type="button" id="villePlan">' + icone("carte", 15) + 'Plan</button>' +
      '<button type="button" id="villeAttendre">' + icone("horloge", 15) + 'Attendre</button>' +
      '<button type="button" id="villeBiens">' + icone("caisse", 15) + 'Biens</button>' +
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
    // la bulle de celui qui te parle (au-dessus de sa tête ; un geste la ferme)
    var bu = document.createElement("div"); bu.className = "v-bulle"; bu.id = "villeBulle"; bu.hidden = true; bu.setAttribute("role", "status");
    bu.innerHTML = "<b></b><p></p>";
    bu.addEventListener("click", function () { if (bulle) { bulle.g.parle = false; bulle = null; } });
    couche.appendChild(bu);
    // le zoom, au bout du menu
    var menu = gs.querySelector(".menu");
    var sp = document.createElement("span"); sp.className = "sp"; menu.appendChild(sp);
    var zp = document.createElement("button"); zp.type = "button"; zp.className = "v-z"; zp.setAttribute("aria-label", "Rapprocher la vue"); zp.textContent = "+";
    var zm = document.createElement("button"); zm.type = "button"; zm.className = "v-z"; zm.setAttribute("aria-label", "Éloigner la vue"); zm.textContent = "−";
    menu.appendChild(zm); menu.appendChild(zp);
    zp.addEventListener("click", function () { zoom(1); });
    zm.addEventListener("click", function () { zoom(-1); });
    $("villePlan").addEventListener("click", ouvrirPlan);
    $("villeAttendre").addEventListener("click", attendre);
    $("villeBiens").addEventListener("click", function () { if (!carteOn && !occupe) ouvrirInventaire(); });
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
        // la nuit, on rentre dormir — et au réveil, on reprend le chemin du rendez-vous
        var chez = chezToi(), c = centre(LIEU[chez].door); poser(c[0], c[1]); S.lieu = chez;
        allerApresNuit = true;
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
      calculerLarge();
      PLACES = {};
      SPRITES = r[2];
      variantes();
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
      S.biens = S.biens || {}; S.sale = S.sale || 0; S.pont = S.pont || {}; S.missionsFaites = S.missionsFaites || {};
      S.offres = S.offres || {}; S.dits = S.dits || {}; if (S.derniereOffre == null) S.derniereOffre = -99;
      annonces = [];
      dernierVu = rdv ? rdv.cle : "";
      lancer();
      poser(S.x, S.y);
      var p = versImage(heros.x, heros.y, ZSOL + 8); cam.x = p[0]; cam.y = p[1];
      vue = coquille.reprendre(s.moteur, s.graine && s.graine.postulat, s.graine && s.graine.seed);
      acteurs = {};
      recaler();
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
        PORTRAITS = content.portraits || {};
      } catch (e) { D = {}; }
      (D.lieux || []).forEach(function (l) { TEXTE_LIEU[l.key] = l; });
      (D.objets || []).forEach(function (o) { OBJET[o.id] = o; });
      (D.missions || []).forEach(function (m) { MISSION[m.id] = m; });
      construire();
      charger();
      boutonReprendre();
    },
    // une carrière commence (avant la première vue)
    debut: function (v) {
      var faire = function () {
        S = {
          v: 1, nom: (v.entities && v.entities.protagonist) || "", role: v.role,
          // en poche au départ : une semaine de la paie du rôle (le promu n'a pas un sou, son entraîneur si)
          semaine: 1, jour: 0, tranche: 0, energie: 80, faim: 70,
          francs: Math.max(1240, (SALAIRE[v.role] || SALAIRE.entraineur)[clamp((v.division || 1) - 1, 0, 2)]),
          x: 0, y: 0, lieu: v.role === "selectionneur" && LIEU.hotel ? "hotel" : "appartement", cartesSemaine: 0, faits: {}, jourFaits: {}, vus: {},
          journeeDebut: v.journee || 0, auMatch: false, zoom: 0,
          biens: {}, sale: 0, pont: {}, mission: null, missionsFaites: {}, offres: {}, derniereOffre: -99, dits: {}
        };
        annonces = [];
        rdv = null; dernierVu = ""; figurants = []; passants = []; acteurs = {};
        lancer();
        var c = centre(LIEU[S.lieu].door); poser(c[0], c[1]);
        var p = versImage(heros.x, heros.y, ZSOL + 8); cam.x = p[0]; cam.y = p[1];
        recaler();
        var club = (v.entities && v.entities.club) || "club", leClub = (/^[AEIOUYÉÈÊaeiouyéèê]/.test(club) ? "L'" : "Le ") + club;
        var accueil = S.lieu === "hotel" ? "L'hôtel de la Rive, une chambre sur le quai. La Fédération paie la note ; elle la relira." :
          "Deux pièces au troisième, rue des Lilas. " + leClub + " t'attend. La ville aussi.";
        fonduTexte((v.entities && v.entities.ville ? v.entities.ville : "Aubérive"), moisCourant(), accueil, null, function () {
            toast("Touche la ville pour marcher, un nom pour y aller. En rouge : là où l'on t'attend.");
          });
      };
      if (pret) faire(); else enAttente = faire;
    },
    // une nouvelle vue du moteur : après un choix, une activité, une reprise
    vue: function (v) {
      var go = function () {
        if (!S) return;
        vue = v;
        S.role = v.role;
        pont(v);
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
          if (avant) { decorAilleurs(v); if (coquille) coquille.carte(); carteOn = true; if (rdv.qui) S.vus[rdv.qui] = 1; rdv.montree = true; majHud(); sauver(); return; }
          montrerCarte();
          return;
        }
        cacherCarte();
        majHud();
        sauver();
        // l'échéance a peut-être déjà sonné (un événement du soir, quand il fait déjà nuit)
        setTimeout(function () { suiteFondus(); annoncer(); if (!echeance() && rdv.force === "rue") verifierRue(); }, 600);
      };
      if (pret) go(); else enAttente = go;
    },
    carteVisible: function () { return carteOn; },
    // pour les essais automatiques : qui est où (et marche-t-il dans un mur ?)
    _debug: function () {
      var out = [];
      function add(q, t) {
        var c = caseDe(q.x, q.y), porte = (q.dedansDep && q.i === 0) || (q.dedansArr && q.chemin && q.i >= q.chemin.length - 2);
        out.push({ uid: q.uid, t: t, sp: q.sp, x: +q.x.toFixed(1), y: +q.y.toFixed(1), a: q.alpha == null ? 1 : +q.alpha.toFixed(2),
          ecran: aLEcran(q.x, q.y, -8), loin: !aLEcran(q.x, q.y, -40), mur: !porte && !marchable(c[0], c[1]), porte: !!porte, etat: q.etat || "" });
      }
      passants.forEach(function (q) { add(q, "p"); });
      Object.keys(acteurs).forEach(function (id) { add(acteurs[id], "a:" + id); });
      return { gens: out, heros: [heros.x, heros.y], tranche: S && S.tranche, bulle: bulle ? { nom: bulle.nom, texte: bulle.texte } : null, carte: carteOn, occupe: occupe };
    },
    // pour les essais : de l'argent, une mission offerte ici et maintenant
    _essai: function (quoi, val) {
      if (!S) return null;
      if (quoi === "francs") { S.francs += val; majHud(); }
      if (quoi === "mission" && MISSION[val]) {
        var m = MISSION[val];
        S.mission = { id: m.id, etape: m.etapes[0].id, offre: true, lieu: m.donneur.lieu, jusqua: tNow() + 10 };
      }
      if (quoi === "aller" && LIEU[val]) { var c = centre(LIEU[val].door); poser(c[0], c[1]); var p = versImage(heros.x, heros.y, ZSOL + 8); cam.x = p[0]; cam.y = p[1]; recaler(); arriver(val); }
      if (quoi === "tranche") { while (TRANCHES[S.tranche] !== val) { S.tranche++; if (S.tranche > 4) { S.tranche = 0; nouveauJour(); } } majHud(); }
      return { francs: S.francs, mission: S.mission, biens: S.biens, lieu: S.lieu };
    },
    _toucher: function (uid) {
      var g = passants.filter(function (q) { return q.uid === uid; })[0];
      if (!g) Object.keys(acteurs).forEach(function (id) { if (acteurs[id].uid === uid) g = acteurs[id]; });
      if (g) toucherQuelquun(g);
      return !!g;
    },
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
