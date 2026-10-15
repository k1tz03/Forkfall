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
     · la VILLE (ici) décide OÙ et QUAND la carte se montre, tient le temps et
       les francs, et applique les activités par `FusibleCoquille.activite(id)`
       → `Engine.activite` (les jauges seules, un climat caché : le mode
       histoire ne les montre plus). L'énergie et la faim de la préproduction
       sont parties (retour du porteur, octobre 2026) : on ne surveille plus de
       barres, on vit la semaine. La ruine, elle, reste : le découvert qui dure
       appelle l'huissier, et l'huissier qui ne trouve plus rien, la banqueroute.

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
  var CLE_SAUVE = "fusible.ville.v1";        // l'ancienne case unique : rangée dans celle de son livre (voir « la sauvegarde »)
  var CLE_CASE = "fusible.ville.v2.";        // + l'id du livre : une case par livre
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

  // ─────────────────────────────────────────────────────────────── les crochets
  // Les modules de la ville (assemble.js, VILLE_MODULES) s'abonnent aux moments de la
  // ville au lieu de réécrire ce fichier :
  //   'debut'       une carrière commence en ville (la vue)
  //   'reprise'     une partie sauvée reprend (la sauvegarde lue)
  //   'jour'        un nouveau jour se lève (S.jour vient de changer)
  //   'semaine'     une nouvelle semaine commence (S.semaine vient de changer)
  //   'match'       le match du samedi commence (M, l'état de la mise en scène)
  //   'apres_match' on quitte le stade (la vue)
  // Un crochet qui lève une erreur ne casse pas la ville (elle part dans la console).
  var CROCHETS_VILLE = {};
  function crochetVille(nom, fn) { (CROCHETS_VILLE[nom] = CROCHETS_VILLE[nom] || []).push(fn); }
  function annoncerVille(nom, a) {
    (CROCHETS_VILLE[nom] || []).forEach(function (fn) { try { fn(a); } catch (e) { if (window.console) console.error("crochet ville " + nom, e); } });
  }

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
  var RETOUR = {};             // les cartes du retour : elles lèvent un drapeau de `loin` sur leurs deux choix

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
  function ambiance() { if (CINE && CINE.amb) return CINE.amb; return AMBIANCE[TRANCHES[S.tranche]]; }
  function quand(t) {
    var j = jourDe(t), tr = TRANCHES[trancheDe(t)];
    var rel = semaineDe(t) > S.semaine ? " prochain" : "";
    return JOUR_MOT[j] + rel + " " + (tr === "aprem" ? "après-midi" : tr);
  }
  function moisCourant() {
    // Le mois se déduit de la phase et de la journée de championnat (le moteur
    // ne date pas les jours) : une approximation qui ne ment pas sur la saison.
    var ph = vue && vue.phase, j = (vue && vue.journee) || 0, an = (vue && vue.year) || 1990;
    // le sélectionneur vit l'année civile des fenêtres internationales : l'objectif
    // en janvier, les fenêtres du printemps et de l'automne, le tournoi et le
    // bilan en décembre (le moteur date sa Une de décembre, engine.dart)
    if (S && S.role === "selectionneur") {
      var ms = 0;
      if (ph === "aller") ms = clamp(2 + Math.floor(j / 6), 2, 5);
      else if (ph === "hiver") ms = 7;
      else if (ph === "retour") ms = clamp(8 + Math.floor(Math.max(0, j - 18) / 6), 8, 10);
      else if (ph === "sprint" || ph === "bilan") ms = 11;
      return MOIS[ms] + " " + an;
    }
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
  // (un quartier fermé du Grand Aubérive ne se marche pas : ville_quartiers.js)
  function marchable(cx, cy) { return cx >= 0 && cy >= 0 && cx < G && cy < G && grille[cy * G + cx] === 1 && !caseBloquee(cx, cy); }
  function auLarge(cx, cy) { return cx >= 0 && cy >= 0 && cx < G && cy < G && LARGE[cy * G + cx] === 1 && !caseBloquee(cx, cy); }
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
  // LA MÉMOIRE DES IMAGES. Une tuile décodée pèse 4 Mo (1024 × 1024 × 4 octets), sa
  // profondeur 2 Mo de plus ; le tour du Grand Aubérive en gardait une centaine, plus de
  // 900 Mo pour l'onglet — un téléphone le ferme. On garde ce que l'écran a montré aux
  // deux dernières images et ce qui l'entoure déjà chargé, plus une réserve des plus
  // récentes ; le reste est rendu et revient de lui-même s'il resert. Les tuiles sont des
  // ImageBitmap (décodées hors du fil de la page) : `close()` rend leur mémoire tout de
  // suite, quand une <img> vidée la garde au cache du navigateur. Sans elles, des <img>.
  var RESERVE_IMAGES = 6, RESERVE_PROFS = 3, tic = 0;
  var BITMAPS = typeof window.createImageBitmap === "function" && typeof window.fetch === "function";
  function img(nom) {
    var im = images[nom];
    if (!im) {
      if (BITMAPS) {
        // en attendant : une place vide, qu'on ne dessine pas
        im = images[nom] = { _ok: false, _t: tic, naturalWidth: 0, naturalHeight: 0 };
        var place = im;
        fetch(BASE + nom + ".webp").then(function (r) { if (!r.ok) throw new Error(nom + " : " + r.status); return r.blob(); })
          .then(function (b) {
            return createImageBitmap(b).catch(function (e) {
              // un navigateur qui ne décode pas ce format en ImageBitmap : des <img>, désormais
              if (images[nom] === place) { BITMAPS = false; delete images[nom]; img(nom); }
              throw e;
            });
          })
          .then(function (bm) {
            if (images[nom] !== place) { bm.close(); return; }   // rendue entre-temps
            bm._ok = true; bm._t = place._t; bm.naturalWidth = bm.width; bm.naturalHeight = bm.height;
            images[nom] = bm;
          }).catch(function () { /* absente : le noir, comme avant */ });
      } else {
        im = new Image();
        im.decoding = "async";
        im.onload = function () { im._ok = true; };
        im.src = BASE + nom + ".webp";
        images[nom] = im;
      }
    }
    im._t = tic;
    return im;
  }
  // garder sans demander : le voisinage de l'écran, s'il est déjà là
  function garderImage(nom) { var im = images[nom]; if (im) im._t = tic; }
  function rendreImage(nom) {
    var im = images[nom];
    if (!im) return;
    delete images[nom];
    im._ok = false;
    if (typeof im.close === "function") im.close();
    else if (im.removeAttribute) { im.onload = null; im.removeAttribute("src"); }
  }
  // une fois par image dessinée : ce qui n'a pas servi depuis deux images et dépasse la réserve s'en va
  function menageImages() {
    tic++;
    function vieux(table, reserve, rendre) {
      var noms = Object.keys(table).filter(function (n) { return !table[n] || table[n]._t < tic - 2; });
      if (noms.length <= reserve) return;
      noms.sort(function (a, b) { return (table[a] ? table[a]._t : -1) - (table[b] ? table[b]._t : -1); });
      for (var i = 0; i < noms.length - reserve; i++) rendre(noms[i]);
    }
    vieux(images, RESERVE_IMAGES, rendreImage);
    vieux(profs, RESERVE_PROFS, function (n) { delete profs[n]; });
  }
  function nomTuile(amb, i) { if (dedans) return nomImageDedans(amb); return amb + "_" + (i < 10 ? "0" : "") + i; }
  // une tuile pas encore là : la même, à une autre heure, si on l'a (plutôt que le noir)
  function repliTuile(amb, i) {
    for (var k in PROFONDEUR) {
      var im = k !== amb && images[nomTuile(k, i)];
      if (im && im._ok) { im._t = tic; return im; }
    }
    return null;
  }
  var toileProf = null;        // une seule toile pour lire les profondeurs (pas une par tuile)
  function profTuile(nom) {
    if (profs[nom] !== undefined) { if (profs[nom]) profs[nom]._t = tic; return profs[nom]; }
    var im = img(nom);
    if (!im._ok) return null;
    try {
      var c = toileProf || (toileProf = document.createElement("canvas"));
      c.width = im.naturalWidth; c.height = im.naturalHeight;
      var x = c.getContext("2d", { willReadFrequently: true });
      x.drawImage(im, 0, 0);
      var d = x.getImageData(0, 0, c.width, c.height).data, n = c.width * c.height, out = new Uint16Array(n);
      for (var k = 0; k < n; k++) out[k] = (d[k * 4] << 8) | d[k * 4 + 1];
      out.w = c.width;
      out._t = tic;
      profs[nom] = out;
      // la profondeur est lue : l'image elle-même ne sert plus
      rendreImage(nom);
      c.width = c.height = 0;
      return out;
    } catch (e) { profs[nom] = null; return null; }
  }
  // la profondeur (x + y + z) du décor au pixel (u, v) de l'image ; 0 : le ciel
  function profondeur(u, v) {
    if (u < 0 || v < 0 || u >= P.w || v >= P.h) return 0;
    var c = Math.floor(u / TUILE), r = Math.floor(v / TUILE), i = r * COLS + c;
    var t = profTuile(dedans ? "int_" + dedans.cle + "_prof" : nomTuile(PROFONDEUR[ambiance()], i));
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
    // une scène jouée se regarde d'un cran plus près (si l'écran le permet)
    if (CINE && CINE.pres && Math.ceil(W / (k + 1)) >= 120 && k < 4) k += 1;
    VW = Math.ceil(W / k); VH = Math.ceil(H / k);
    cv.width = VW; cv.height = VH;
    ctx.imageSmoothingEnabled = false;
    mesurerUI();
  }

  // La bande de ville : ce que l'interface laisse voir entre le haut (menu, rail,
  // l'heure) et le bas (le rendez-vous, les actions, le bandeau). Mesurée quand
  // une taille change ; la caméra y centre le héros, la flèche et les noms des
  // lieux s'y tiennent, et les deux dégradés s'arrêtent où l'interface s'arrête.
  var UI = { haut: 0, bas: 0, decal: 0 };
  function mesurerUI() {
    var gs = $("gameScreen"), hud = $("villeHud");
    if (carteOn || !gs || !hud || !hud.offsetParent) return;
    var H = window.innerHeight, haut = 0, bas = H;
    [gs.querySelector(".menu"), $("rail"), hud].forEach(function (e) {
      if (e && e.offsetParent) haut = Math.max(haut, e.getBoundingClientRect().bottom);
    });
    [$("villeBas"), gs.querySelector(".v-actions"), $("bandeau")].forEach(function (e) {
      if (!e || !e.offsetParent) return;
      var r = e.getBoundingClientRect();
      if (r.height > 0) bas = Math.min(bas, r.top);
    });
    UI.haut = Math.round(haut); UI.bas = Math.round(H - bas); UI.decal = (UI.haut - UI.bas) / 2;
    var st = document.documentElement.style;
    st.setProperty("--v-haut", UI.haut + "px"); st.setProperty("--v-bas", UI.bas + "px");
  }
  // où regarde la caméra : le héros, au milieu de la bande de ville
  function visee() {
    if (CINE && CINE.pres) { var vc = viseeCine(); if (vc) return vc; }
    if (dedans) return viseeDedans();
    var p = versImage(heros.x, heros.y, ZSOL + 8); return [p[0], p[1] - UI.decal / k];
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
    var ax = miroir ? w - 1 - def.ax : def.ax, z = opt.z == null ? ZSOL : opt.z;
    var p = versImage(x, y, z), u0 = Math.round(p[0]), v0 = Math.round(p[1]);
    var ox = u0 - Math.round(cam.x - VW / 2), oy = v0 - Math.round(cam.y - VH / 2);
    if (ox + w < -2 || oy < -2 || ox - w > VW + 2 || oy - h > VH + 2) return null;
    // l'ombre au sol
    ctx.fillStyle = "rgba(0,0,0," + (0.34 * alpha).toFixed(3) + ")";
    ctx.fillRect(ox - 4, oy - 1, 9, 2); ctx.fillRect(ox - 3, oy - 2, 7, 4);
    var teinte = (dedans ? TEINTE_DEDANS : TEINTE)[ambiance()], tint = opt.teinte || teinte, pal = opt.pal;
    var im = ctx.createImageData(w, h), d = im.data, jambes = Math.floor(h * 0.72);
    // assis : le corps descend sur le siège, les jambes repliées ne gardent que les pieds ;
    // à genoux : pareil, sans siège
    var ge = opt.geste, t = opt.t || 0;
    var assis = opt.pose === "assis" || ge === "genou", coupe = assis ? Math.max(0, h - jambes - 2) : 0;
    // la tête qui parle hoche ; baissée, elle descend d'un pixel ; le rire saute, la peur tremble
    var tete = Math.min(6, Math.floor(h * 0.3)), dyTete = (opt.parle && Math.floor(t / 170) % 2) || ge === "tete_basse" || ge === "pleure" ? 1 : 0;
    var dyCorps = ge === "rit" || ge === "danse" ? (Math.floor(t / 130) % 2 ? -1 : 0) : 0;
    var dxCorps = ge === "tremble" ? (Math.floor(t / 70) % 2 ? 1 : -1) : ge === "frappe" ? (t % 900 < 160 ? (miroir ? -2 : 2) : 0) : 0;
    if (ge === "danse" && Math.floor(t / 420) % 2) miroir = !miroir, ax = miroir ? w - 1 - def.ax : def.ax;
    var dos = ge === "dos", couche = ge === "couche";
    var silhouette = !!opt.silhouette, a8 = Math.round(255 * alpha), vu = false;
    for (var i = 0; i < h; i++) {
      if (coupe && i >= jambes && i < jambes + coupe) continue;
      var row = rows[i], ii = (coupe && i < jambes ? i + coupe : i) + (i < tete ? dyTete : 0);
      if (ii >= h) continue;
      for (var j = 0; j < w; j++) {
        var src = miroir ? w - 1 - j : j;
        if (pas && i >= jambes) src += (src < w / 2 ? 1 : -1) * pas;
        var ch = src >= 0 && src < w ? row[src] : ".";
        if (ch === "." || ch === " ") continue;
        if (dos && i < tete + 1) { if (ch === "s") ch = "h"; else if (ch === "S") ch = "H"; }
        var col = (pal && pal[ch]) || def.pal[ch];
        if (!col) continue;
        var px = u0 - ax + j + dxCorps, py = v0 - (h - 1) + ii + dyCorps;
        var ds = x + y + z + (h - 1 - ii) / 2 + (assis ? 1.5 : 0), sc = profondeur(px, py);
        var cache = !couche && sc && ds < sc - TOLERANCE;
        var o = (ii * w + j) * 4;
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
    if (couche) {
      // couché : le corps tourné d'un quart, les pieds vers où il regardait
      ctx.save(); ctx.translate(ox, oy - 2); ctx.rotate(miroir ? Math.PI / 2 : -Math.PI / 2);
      ctx.drawImage(tmp, -ax, -(h - 1) + 3); ctx.restore();
      return vu ? { x: ox - h / 2, y: oy - 6, w: h, h: 6, tete: [ox + (miroir ? -h / 2 : h / 2), oy - 6] } : null;
    }
    ctx.drawImage(tmp, ox - ax + dxCorps, oy - (h - 1) + dyCorps);
    return vu ? { x: ox - ax + dxCorps, y: oy - (h - 1) + dyCorps, w: w, h: h, tete: [ox + dxCorps, oy - h + dyCorps] } : null;
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
  // le chemin d'ici à une case (la plus proche qui se marche) ; `null` s'il n'y en a pas
  function cheminVers(cx, cy) {
    return chemin(plusProche.apply(null, caseDe(heros.x, heros.y).concat([16])), plusProche(cx, cy, 16));
  }
  function allerA(cx, cy, quandArrive, deja) {
    var ch = deja || cheminVers(cx, cy);
    if (!ch) { toast("Pas de chemin d'ici."); return false; }
    heros.chemin = ch.map(centre); heros.i = 0; heros.arrivee = quandArrive || null;
    cam.libre = false;
    fermerPorte();
    verifierRue();
    return true;
  }
  function allerAuLieu(cle) {
    if (dedans && cle === dedans.cle) { arriveeDedans(); return; }
    if (lieuFerme(cle)) { var q0 = GRAND_Q[QUARTIER_DE[cle]]; toast(q0.nom + " : le quartier " + q0.indice + "."); return; }
    var l = LIEU[cle];
    if (!l || !l.door) return;
    // dans une pièce : si le but est loin, un seul fondu de la pièce à sa porte (ville_rythme.js) ;
    // sinon on sort d'abord, et l'on marche
    if (dedans) { if (butLoin(cle)) sauterVers(cle); else sortir(function () { allerAuLieu(cle); }); return; }
    if (porteOuverte === cle) return;
    var c = caseDe(heros.x, heros.y);
    if (Math.abs(c[0] - l.door[0]) + Math.abs(c[1] - l.door[1]) <= 1 && !heros.chemin) { arriver(cle); return; }
    // au-delà de quelques rues, la marche n'apprend rien : un fondu court remplace le trajet (toucher la
    // ville pour marcher, lui, reste une marche)
    var ch = cheminVers(l.door[0], l.door[1]);
    if (ch && marcheTropLongue(ch)) { sauterVers(cle); return; }
    allerA(l.door[0], l.door[1], function () { arriver(cle); }, ch);
  }
  function majMarche(dt) {
    var c = heros.chemin;
    if (!c) { heros.pas = 0; return; }
    var reste = dedans ? VITESSE_DEDANS * dt : VITESSE * dt * (S.vite ? 3 : 1) * vitesseBiens();
    while (reste > 0 && c) {
      var cible = c[heros.i + 1];
      if (!cible) { heros.chemin = null; var f = heros.arrivee; heros.arrivee = null; S.x = heros.x; S.y = heros.y; if (f) f(); return; }
      var dx = cible[0] - heros.x, dy = cible[1] - heros.y, d = Math.hypot(dx, dy);
      if (d <= reste) { heros.x = cible[0]; heros.y = cible[1]; heros.i++; reste -= d; }
      else { heros.x += dx / d * reste; heros.y += dy / d * reste; reste = 0; }
      // à l'écran, x monte vers la droite-bas et y vers la gauche-bas
      if (Math.abs(dx - dy) > 0.01) heros.miroir = (dx - dy) < 0;
    }
    heros.dist += (dedans ? VITESSE_DEDANS : VITESSE) * dt;
    var ph = Math.floor(heros.dist / (dedans ? 3 : 5)) % 4;
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
    { lieu: "marche", sp: "commercant", tranches: ["matin", "midi"], jours: ["mer", "sam", "dim"] },
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
  function seuilPorte(cle) {
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
    if (S.sortieStade === tNow()) poids.fan = 8;
    if (S.jour === 6 && tr <= 1) poids.ancien = (poids.ancien || 0) + 2;
    var tot = 0, k;
    for (k in poids) tot += poids[k];
    var r = Math.random() * tot;
    for (k in poids) { r -= poids[k]; if (r < 0) return k; }
    return "passant";
  }
  function voulusPassants() {
    var base = [9, 10, 10, 6, 3][S.tranche] * (jourDeMatch() || S.sortieStade === tNow() ? 1.7 : 1);
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
    else if (S.sortieStade === tNow() && aPorte("stade") && Math.random() < 0.6) { cleDep = "stade"; dep = LIEU.stade.door.slice(); depDedans = seuilPorte("stade"); }
    else if (portes.length && Math.random() < 0.5) { cleDep = auHasard(portes); dep = LIEU[cleDep].door.slice(); depDedans = seuilPorte(cleDep); }
    else dep = horsChamp(null);
    if (!dep) return null;
    if (!destination(q, dep, depDedans, portes, cleDep)) return null;
    return q;
  }
  function destination(q, dep, depDedans, portes, eviter) {
    portes = portes || portesProches();
    var autres = portes.filter(function (c) { return c !== eviter && Math.abs(LIEU[c].door[0] - dep[0]) + Math.abs(LIEU[c].door[1] - dep[1]) > 8; });
    var arr, arrDedans = null;
    if (jourDeMatch() && aPorte("stade") && eviter !== "stade" && Math.random() < (q.sp === "fan" ? 0.8 : 0.4)) { arr = LIEU.stade.door.slice(); arrDedans = seuilPorte("stade"); }
    else if (autres.length && Math.random() < (q.trop ? 1 : 0.45)) { var c2 = auHasard(autres); arr = LIEU[c2].door.slice(); arrDedans = seuilPorte(c2); }
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
      if (p.si && !siVrai(p.si, p.lieu)) return;
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
      if (c.jours && c.jours.indexOf(JOURS[S.jour]) < 0) return;
      var def = TEXTE_LIEU[c.lieu];
      if (def && !ouvert(def)) return;
      var t = tenancier(c.lieu), spt = t && spriteDe(t.id);
      if (spt && !deja[t.id]) { out.push({ id: "com_" + c.lieu, sp: spt, qui: t.id, role: "gensville", lieu: c.lieu }); deja[t.id] = 1; return; }
      out.push({ id: "com_" + c.lieu, sp: c.sp, qui: BOUCHE[c.sp] || "commercant", role: "commercant", lieu: c.lieu });
    });
    var comme = {};
    COMMERCES.forEach(function (c) { comme[c.lieu] = 1; });
    out = out.concat(gensDehors(deja, comme));
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
      var pts = [seuilPorte(w.lieu)].concat(ch ? ch.map(centre) : [centre(LIEU[w.lieu].door), w.place]);
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
      poserChemin(A, [[A.x, A.y]].concat(ch ? ch.map(centre) : []).concat([seuilPorte(A.lieu)]), false, true);
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
      if (!w || w.lieu !== A.lieu || w.qui !== A.qui) { if (A.etat !== "part") partir(A); }
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
    if (dedans) { occuper(); bulle = null; return; }
    var v = voulus(), parId = {};
    v.forEach(function (w) { parId[w.id] = w; });
    Object.keys(acteurs).forEach(function (id) { if (!parId[id] || parId[id].lieu !== acteurs[id].lieu || parId[id].qui !== acteurs[id].qui) delete acteurs[id]; });
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
  var RE_MOT = /^([a-z_]+)\s*(==|!=)\s*([A-Za-z0-9_]+)$/;
  function jauge(id) {
    var g = ((vue && vue.gauges) || []).filter(function (x) { return x.id === id; })[0];
    return g ? g.value : 50;
  }
  function valeur(nom) {
    var v = vue || {}, mo = v.monde || {};
    if (nom.indexOf("relation.") === 0) return ((v.relations || {})[nom.slice(9)]) || 0;
    // la ville vivante : les gestes comptés d'une habitude (docs/histoires/ville_vivante.md)
    if (nom.indexOf("habitude.") === 0) return +((v.vars || {})["hab_" + nom.slice(9)] || 0);
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
      // l'éveil : les tranches depuis le dernier sommeil (5 et plus : une nuit blanche)
      case "eveil": return S.eveil || 0;
      case "semaine": return S.semaine;
    }
    return null;
  }
  function lieuProche() {
    if (dedans) return dedans.cle;
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
      if (m[2] === "flag") oui = ((vue && vue.flags) || []).indexOf(m[3]) >= 0 && !(D.loin && D.loin[m[3]] && !(S && S.loin));
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
  // le genre, comme les cartes (text.dart) : {pg, select, f{…} other{…}} pour le héros, {sg, …}
  // pour celui qui parle ; une option peut porter un mot ({prenom}), pas un autre choix
  var SELECT = /\{(pg|sg),\s*select,\s*((?:[a-z]+\s*\{(?:[^{}]|\{\w+\})*\}\s*)+)\}/g;
  function choisirGenre(s, sg) {
    if (s.indexOf("select") < 0) return s;
    var pg = (vue && (vue.genre || (vue.entities && vue.entities.genre))) || "m";
    return s.replace(SELECT, function (m, nom, corps) {
      var g = nom === "pg" ? pg : (sg || "m"), opts = {};
      corps.replace(/([a-z]+)\s*\{((?:[^{}]|\{\w+\})*)\}/g, function (m2, k, v) { opts[k] = v; return ""; });
      return opts[g] != null ? opts[g] : (opts.other != null ? opts.other : "");
    });
  }
  function remplir(t, extra, sg) {
    t = choisirGenre(String(t), sg);
    var e = (vue && vue.entities) || {}, r = valeur("rang");
    var M = { prenom: e.prenom || "", nom: e.nom || "", club: e.club || "le club", ville: e.ville || "Aubérive", rival: e.rival || "",
      rang: r == null ? "" : r === 1 ? "1er" : r + "e", annee: String((vue && vue.year) || ""), division: "Division " + ((vue && vue.division) || 1) };
    // le groupe d'une sélection, selon l'époque (le moteur dit pareil : text.dart)
    var an = (vue && vue.year) || 1990;
    M.groupe = an < 2011 ? "vingt-trois" : "vingt-six"; M.Groupe = an < 2011 ? "Vingt-trois" : "Vingt-six";
    // comme les cartes (text.dart) : le nom en capitales, les initiales
    M.NOM = (e.nom || "").toLocaleUpperCase("fr-FR");
    M.initiales = ((e.prenom || "").charAt(0) + (e.nom || "").charAt(0)).toLocaleUpperCase("fr-FR");
    // tes fantômes (preview_dossier.js, Engine.heritage) : le nom d'une carrière d'avant, élidé
    // comme dans les cartes (« celle d'Ollivier »)
    var fa = (vue && vue.fantomes) || {};
    for (var f in fa) M[f] = fa[f];
    t = String(t).replace(/(^|[\s(«'’-])([Dd]e|[Qq]ue) \{(fantome_\w+)\}/g, function (m, a, w, k) {
      return M[k] && /^[AEIOUYÀÂÉÈÊËÎÏÔÙÛaeiouyàâéèêëîïôùû]/.test(M[k]) ? a + w.slice(0, -1) + "'" + M[k] : m;
    });
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
    // une conversation surprise en cours : ceux qui parlent ne s'interrompent pas pour toi
    if (CONV) { for (var kv in CONV.voix) if (CONV.voix[kv] === g) return; }
    // les gens d'Aubérive (ville_gens.js) : un tuyau, le climat, une réplique selon le lien
    if (!g.cine && gensDe(g.qui)) { parlerGens(g); return; }
    var maintenant = performance.now(), qui, nom;
    if (g.gens || g.role === "commercant" || !CHARS[g.qui]) { qui = BOUCHE[g.sp] || g.qui; nom = g.nom || NOM_GENS[g.sp] || "Quelqu'un"; }
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
    cacherCartouche();
    if (bulle && bulle.g !== g) { bulle.g.parle = false; bulle = null; }
    if (dedans) { toucherQuelquunDedans(g); return; }
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
    if (b.conv && cartoucheVisible()) { el.hidden = true; return; }
    if (el._pour !== b) {
      el._pour = b;
      el.querySelector("b").textContent = b.nom;
      var p = el.querySelector("p");
      p.textContent = b.muet ? b.texte : "« " + b.texte + " »";
      el.classList.toggle("muet", b.muet);
    }
    el.hidden = false;
    // dans la bande de ville : jamais sous le rail ni sous les actions
    var W = VW * k, bw = el.offsetWidth || 220, bh = el.offsetHeight || 60;
    var sx = clamp(b.g.tete[0] * k, bw / 2 + 8, W - bw / 2 - 8);
    var sy = Math.max(Math.min(b.g.tete[1] * k - 6, VH * k - UI.bas - 10), UI.haut + bh + 12);
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
    var v = courant(f), a = Math.abs(v), ecus = enEcus();
    var r = a >= 100000 ? Math.round(a / 1000) * 1000 : a >= 10000 ? Math.round(a / 100) * 100 : a >= 1000 ? Math.round(a / 10) * 10 : Math.round(a);
    // les petites sommes en écus gardent leurs décimales (un café ne coûte pas « 0 écu »)
    if (ecus && a > 0 && a < 10) r = Math.round(a * (a < 1 ? 100 : 10)) / (a < 1 ? 100 : 10);
    return (v < 0 && r ? "−" : "") + r.toLocaleString("fr-FR") + (ecus ? (r >= 2 ? " écus" : " écu") : " F");
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
  // où l'on dort : par rôle (le sélectionneur à l'hôtel de la Rive), et une
  // histoire peut en décider autrement (ville.yaml `domiciles`)
  function domicileDe(role, flags) {
    var Dm = D.domiciles || {}, dr = Dm.drapeaux || {}, f = flags || [];
    for (var i = 0; i < f.length; i++) if (dr[f[i]] && LIEU[dr[f[i]]]) return dr[f[i]];
    var r = (Dm.roles || {})[role];
    return r && LIEU[r] ? r : "appartement";
  }
  function chezToi() { return S ? domicileDe(S.role, vue && vue.flags) : "appartement"; }
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
    var html = '<div class="v-inv">' + ongletsCarnet("biens") +
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
    coquille.panneau("Le carnet", html);
    brancherOnglets();
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
    var recu = 0, sale = 0, amende = 0, cadeaux = [], saisies = [], rendus = [], vole = false;
    Object.keys(v.vars).sort().forEach(function (nom) {
      var val = +v.vars[nom] || 0, d = val - (S.pont[nom] || 0);
      S.pont[nom] = val;
      if (!d) return;
      if (nom === "ville_francs") recu += d;
      else if (nom === "ville_francs_sales") sale += d;
      else if (nom === "ville_amende") amende += d;
      else if (d > 0 && nom.indexOf("cadeau_") === 0) cadeaux.push(nom.slice(7));
      else if (d > 0 && nom.indexOf("rendre_") === 0) rendus.push(nom.slice(7));
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
    // un objet rendu (la villa au notaire, la montre au commissariat) : lui seul, la carte a dit pourquoi
    rendus.forEach(function (id) {
      if (!OBJET[id] || !possede(id)) return;
      delete S.biens[id]; vue = coquille.biens(id, false); appels = true;
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
    menageImages();
    var dt = dernier ? Math.min(0.05, (ts - dernier) / 1000) : 0;
    dernier = ts;
    if (!occupe && !carteOn) { majMarche(dt); if (!dedans) { majPassants(dt, ts); majActeurs(dt, ts); } }
    else if (CINE && !dedans && !CINE.c.vide) majPassants(dt, ts);
    if (dedans) majDedans(dt, ts);
    majCine(dt, ts);
    majVie(dt, ts);
    if (!occupe && !carteOn && !MATCH && !CINE) { guetterConv(ts); guetterChapitre(ts); guetterAttendre(ts); }
    if (MATCH) majMatch(dt, ts);
    // la caméra suit le héros, sauf si on l'a déplacée à la main (ou si le match la tient)
    var p = visee();
    if (!cam.libre && !MATCH) { cam.x += (p[0] - cam.x) * Math.min(1, dt * 6); cam.y += (p[1] - cam.y) * Math.min(1, dt * 6); }
    dessiner(ts);
    placerEtiquettes();
  }
  function dessinerTuiles(amb, alpha) {
    var x0 = Math.round(cam.x - VW / 2), y0 = Math.round(cam.y - VH / 2);
    ctx.globalAlpha = alpha;
    var m = TUILE / 2;           // le voisinage : ce qui entre dans l'écran au bout de quelques pas
    for (var r = 0; r < RANGS; r++) for (var c = 0; c < COLS; c++) {
      var tx = c * TUILE, ty = r * TUILE;
      // le voisinage de l'écran reste en mémoire s'il est déjà chargé (on ne le demande pas)
      if (tx > x0 + VW + m || ty > y0 + VH + m || tx + TUILE + m < x0 || ty + TUILE + m < y0) continue;
      if (tx > x0 + VW || ty > y0 + VH || tx + TUILE < x0 || ty + TUILE < y0) { garderImage(nomTuile(amb, r * COLS + c)); continue; }
      var im = img(nomTuile(amb, r * COLS + c));
      if (!im._ok) im = repliTuile(amb, r * COLS + c) || im;
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
    // la brume des quartiers fermés (le Grand Aubérive)
    dessinerBrumes(Math.round(cam.x - VW / 2), Math.round(cam.y - VH / 2));
    // le panneau du mur est (le dernier score), la foule les jours de match
    if (!dedans) { dessinerPanneau(); dessinerFoule(ts); }
    // les gens, du fond vers l'avant (x + y croissant) ; on garde la boîte de
    // chacun, pour qu'un doigt puisse le toucher
    var gens = [], rue = !(CINE && CINE.c.vide && !dedans), joue = {};
    if (CINE && CINE.acteurs) for (var ja in CINE.acteurs) joue[CINE.acteurs[ja].qui] = 1;
    if (rue) for (var i = 0; i < passants.length; i++) gens.push(passants[i]);
    for (var id in acteurs) if (rue && !joue[acteurs[id].qui]) gens.push(acteurs[id]);
    figurants.forEach(function (g) { gens.push(g); });
    gensDesTableaux().forEach(function (g) { gens.push(g); });
    if (MATCH) {
      gensDuMatch(gens);
      // au match : l'entraîneur et le sélectionneur sur le banc ; le joueur est sur la pelouse ; les autres en loge
      if (S.role === "entraineur" || S.role === "selectionneur") gens.push({ sp: "coach", x: STADE.banc[0], y: STADE.banc[1], miroir: true, pas: 0, heros: true });
    } else gens.push({ sp: S.role === "joueur" ? "joueur" : "coach", x: heros.x, y: heros.y, miroir: heros.miroir, pas: heros.pas, heros: true,
      geste: heros.geste, emote: heros.emote, pose: heros.pose, parle: heros.parle });
    gens.sort(function (a, b) { return (a.x + a.y) - (b.x + b.y); });
    dessines = [];
    for (var j = 0; j < gens.length; j++) {
      var g = gens[j];
      if (g.ballon) { dessinerBallon(g); continue; }
      var bx = dessinerSprite(g.sp, g.x, g.y, { miroir: g.miroir, pas: g.pas, silhouette: !!g.heros || !!g.silhouette, pal: g.pal, alpha: g.alpha, z: g.z, pose: g.pose, geste: g.geste, t: ts, parle: g.parle });
      g.tete = bx ? bx.tete : null;
      if (g.heros) { heros.tete = g.tete; if (heros.emote) g.emote = heros.emote; }
      if (bx && g.geste) dessinerGeste(g, bx, ts);
      if (g.emote) dessinerEmote(g, ts);
      if (bx && !g.heros && !g.match) { bx.g = g; dessines.push(bx); }
    }
    // la marque du rendez-vous (jamais pour un événement sombre)
    var m = CINE ? null : marqueRdv();
    if (m) dessinerMarque(m[0], m[1], ts);
    // le temps qu'il fait pendant une scène, dehors
    if (CINE && CINE.meteo && !dedans) dessinerMeteo(CINE.meteo, ts);
  }
  var dessines = [];

  // ─────────────────────────────────────────────────────────────── les étiquettes
  var etiquettes = {}, fleche = null;
  function chevauche(b, pris, bb) {
    function sur(p) { return b[0] < p[2] + 2 && b[2] > p[0] - 2 && b[1] < p[3] + 2 && b[3] > p[1] - 2; }
    return (bb && sur(bb)) || pris.some(sur);
  }
  function boiteBulle() {
    var el = $("villeBulle");
    if (!el || el.hidden) return null;
    var x = parseFloat(el.style.left) || 0, y = parseFloat(el.style.top) || 0, w = el.offsetWidth, h = el.offsetHeight;
    return [x - w / 2, y - h - 6, x + w / 2, y];
  }
  function placerEtiquettes() {
    var couche = $("villeCouche");
    if (!couche) return;
    if (dedans) { placerEtiquettesDedans(); return; }
    if (MATCH) {
      for (var cle0 in etiquettes) etiquettes[cle0].hidden = true;
      if (fleche) fleche.hidden = true;
      if ($("villeBulle")) $("villeBulle").hidden = true;
      return;
    }
    majBulle();
    var x0 = cam.x - VW / 2, y0 = cam.y - VH / 2;
    placerNomsBrume(x0, y0);
    var hc = caseDe(heros.x, heros.y), cible = rdvVisible() ? rdv.lieu : null;
    var vus = {}, cands = [];
    for (var i = 0; i < L.places.length; i++) {
      var l = L.places[i];
      if (!l.door || lieuFerme(l.key)) continue;
      var sx = (l.u - x0) * k, sy = (l.v - y0) * k;
      // dans la bande de ville seulement : un nom sous le rail ou sous les actions
      // serait invisible, et on le toucherait quand même
      var dansBande = sx > -40 && sy > UI.haut + 26 && sx < VW * k + 40 && sy < VH * k - UI.bas + 4;
      var dist = Math.abs(l.door[0] - hc[0]) + Math.abs(l.door[1] - hc[1]);
      var montrer = dansBande && (l.key === cible || dist < 34 || (k <= 1 && TEXTE_LIEU[l.key]));
      if (montrer) cands.push({ l: l, sx: sx, sy: sy, dist: dist, rdv: l.key === cible });
    }
    // Deux noms ne se chevauchent jamais : le rendez-vous d'abord, puis du plus
    // proche au plus loin ; un nom qui tomberait sur un autre (ou sur la bulle de
    // celui qui parle) monte d'un cran, ou descend, ou se tait. Il garde le cran
    // de l'image d'avant tant qu'il y tient : les noms ne sautillent pas.
    cands.sort(function (a, b) { return (b.rdv - a.rdv) || (a.dist - b.dist) || (a.l.key < b.l.key ? -1 : 1); });
    var pris = [], bb = boiteBulle(), W = VW * k, bas = VH * k - UI.bas;
    // la flèche vers le rendez-vous, quand il est hors de la bande : posée la
    // première, au bord, dans la direction du lieu
    if (!fleche) {
      fleche = document.createElement("button");
      fleche.type = "button"; fleche.className = "v-fleche";
      fleche.addEventListener("click", function (ev) { ev.stopPropagation(); if (rdvVisible() && LIEU[rdv.lieu]) allerAuLieu(rdv.lieu); });
      couche.appendChild(fleche);
    }
    var L2 = cible && LIEU[cible];
    if (L2 && !(cands.length && cands[0].rdv)) {
      var H = VH * k, cx = W / 2, hb = H - UI.bas - 24, hh = UI.haut + 24;
      var cy = (hh + hb) / 2, demi = Math.max(30, (hb - hh) / 2);
      var tx = (L2.u - x0) * k, ty = (L2.v - y0) * k, dx = tx - cx, dy = ty - cy;
      var m = Math.max(Math.abs(dx) / (W / 2 - 70), Math.abs(dy) / demi, 1);
      var ang = Math.atan2(dy, dx), dir = ["→", "↘", "↓", "↙", "←", "↖", "↑", "↗"][(Math.round(ang / (Math.PI / 4)) + 8) % 8];
      var txt = dir + " " + nomLieu(L2);
      if (fleche.textContent !== txt) { fleche.textContent = txt; fleche.hidden = false; fleche._w = fleche.offsetWidth; fleche._h = fleche.offsetHeight; }
      // la flèche entière dans l'écran, jamais coupée par un bord ; si la bulle
      // de quelqu'un tombe dessus, elle glisse au-dessus ou au-dessous, ou se tait
      // le temps qu'il parle
      var fw = fleche._w || 120, fh = fleche._h || 24, fx = clamp(cx + dx / m, fw / 2 + 10, W - fw / 2 - 10), fy = null;
      var essais = [cy + dy / m].concat(bb ? [bb[3] + fh / 2 + 6, bb[1] - fh / 2 - 6] : []);
      for (var q = 0; q < essais.length && fy === null; q++) {
        var y = essais[q], bf = [fx - fw / 2, y - fh / 2, fx + fw / 2, y + fh / 2];
        if (y - fh / 2 >= UI.haut + 6 && y + fh / 2 <= H - UI.bas - 6 && !chevauche(bf, [], bb)) fy = y;
      }
      if (fy !== null) {
        fleche.style.left = Math.round(fx) + "px"; fleche.style.top = Math.round(fy) + "px";
        fleche.hidden = false;
        pris.push([fx - fw / 2, fy - fh / 2, fx + fw / 2, fy + fh / 2]);
      } else fleche.hidden = true;
    } else fleche.hidden = true;
    for (var j = 0; j < cands.length; j++) {
      var c = cands[j], e = etiquettes[c.l.key];
      if (!e) {
        e = document.createElement("button");
        e.type = "button"; e.className = "v-lieu"; e._dy = 0;
        e.addEventListener("click", (function (cle) { return function (ev) { ev.stopPropagation(); allerAuLieu(cle); }; })(c.l.key));
        couche.appendChild(e); etiquettes[c.l.key] = e;
      }
      var nm = nomLieu(c.l);
      if (e.textContent !== nm || e._rdv !== c.rdv) {
        e.textContent = nm; e._rdv = c.rdv;
        e.classList.toggle("rdv", c.rdv);
        e.hidden = false; e._w = e.offsetWidth; e._h = e.offsetHeight;
      }
      e.classList.toggle("loin", c.dist >= 20 && !c.rdv);
      var ew = e._w || 90, eh = e._h || 20, x = clamp(c.sx, ew / 2 + 6, W - ew / 2 - 6);
      var crans = c.rdv ? [0] : [e._dy, 0, -(eh + 3), eh + 3, -2 * (eh + 3)], place = null;
      for (var n = 0; n < crans.length && !place; n++) {
        var t = c.sy + crans[n], boite = [x - ew / 2, t - eh, x + ew / 2, t];
        if (!c.rdv && (t - eh < UI.haut + 6 || t > bas)) continue;
        if (c.rdv || !chevauche(boite, pris, bb)) place = { t: t, dy: crans[n], boite: boite };
      }
      if (!place) continue;
      pris.push(place.boite); vus[c.l.key] = 1; e._dy = place.dy;
      e.style.left = Math.round(x) + "px"; e.style.top = Math.round(place.t) + "px";
      e.hidden = false;
    }
    for (var key in etiquettes) if (!vus[key]) etiquettes[key].hidden = true;
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
    var r = { cle: cleVue(v), lieu: lieu, qui: c.speaker || null, type: "normal", debut: maintenant, fin: maintenant, force: "vient", sombre: false, beat: bk };
    // loin d'Aubérive (ville.yaml `loin`) : toute carte se joue là où l'on est,
    // le match aussi, sauf la carte du retour
    if (loinDe(v) && !RETOUR[c.id]) {
      r.type = "ailleurs"; r.lieu = "ici"; r.debut = r.fin = maintenant; r.force = "ici";
      return r;
    }
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
    if (dedans) { var gr = rdv && !carteOn ? occupantRdv() : null; return gr ? [gr.x, gr.y] : null; }
    if (!rdvVisible() || !LIEU[rdv.lieu]) return null;
    var A = rdv.qui && acteurs[rdv.qui];
    if (A && A.etat !== "part" && A.lieu === rdv.lieu && A.alpha > 0.5) return [A.x, A.y];
    var c = centre(LIEU[rdv.lieu].door);
    return [c[0], c[1]];
  }

  // ─────────────────────────────────────────────────────────────── l'arrivée de la carte
  // loin d'Aubérive pour un temps : le premier drapeau de `loin` que porte la vue
  function loinDe(v) {
    var Lo = (D && D.loin) || {}, f = (v && v.flags) || [], cles = Object.keys(Lo).sort();
    for (var i = 0; i < cles.length; i++) if (f.indexOf(cles[i]) >= 0) return { flag: cles[i], decor: Lo[cles[i]].decor, retour: Lo[cles[i]].retour || "" };
    return null;
  }
  // le décor d'ailleurs, derrière la carte (ville.yaml → `ailleurs`)
  function decorAilleurs(v) {
    var voile = $("villeVoile");
    if (!voile) return;
    var c = v && v.card, A = D.ailleurs || {}, d = null, lo = loinDe(v), loin = !!(lo && c && !RETOUR[c.id]);
    if (c && (c.lieu === "ailleurs" || loin)) {
      (c.tags || []).forEach(function (t) { if (!d && A[t]) d = A[t]; });
      d = d || (loin && A[lo.decor]) || A.defaut || { titre: "Loin d'Aubérive", sous: "" };
    }
    voile.classList.toggle("ailleurs", !!d);
    var b = voile.querySelector(".v-ailleurs");
    if (!b) { b = document.createElement("div"); b.className = "v-ailleurs"; b.innerHTML = "<b></b><span></span>"; voile.appendChild(b); }
    b.querySelector("b").textContent = d ? d.titre : "";
    b.querySelector("span").textContent = d ? d.sous : "";
  }
  function montrerCarte() {
    var cav = vue && vue.card && !CINE ? cineDeCarte(vue.card.id, "avant") : null;
    if (cav) { carteOn = false; jouerCine(cav, montrerCarte); return; }
    fermerPorte();
    cacherCartouche();
    var to = $("villeToast");
    if (to && vue && vue.lastAnswer && to.textContent === vue.lastAnswer) { clearTimeout(toastT); to.classList.remove("on"); }
    carteOn = true;
    heros.chemin = null;
    decorAilleurs(vue);
    $("gameScreen").classList.add("carte-on");
    $("villeVoile").classList.add("on");
    document.body.classList.add("v-en-scene");
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
    sonVille();
    decorAilleurs(null);
    $("gameScreen").classList.remove("carte-on");
    $("villeVoile").classList.remove("on");
    document.body.classList.remove("v-en-scene");
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
    // l'événement de la rue te tombe dessus pendant que tu marches (dehors)
    if (!rdv || rdv.force !== "rue" || carteOn || occupe || dedans) return;
    if (tNow() < rdv.debut + 1) return;
    setTimeout(function () {
      // entre-temps, une scène ou un fondu a pu commencer : la carte attend (le prochain pas la relance)
      if (!rdv || rdv.force !== "rue" || carteOn || occupe || $("villePorte").classList.contains("on")) return;
      heros.chemin = null;
      montrerCarte();
    }, 1600);
  }
  // on entre dans la pièce du lieu : fermé à cette heure, la porte reste close (sauf chez soi, ou si
  // l'on t'y attend) ; et le match se joue sur la pelouse, pas dans la pièce
  function doitEntrer(cle) {
    var attenduIci = (rdv && rdv.lieu === cle && tNow() >= rdv.debut) || (S.mission && S.mission.lieu === cle) || cle === chezToi();
    return aInterieur(cle) && !carteOn && (ouvert(TEXTE_LIEU[cle] || {}) || attenduIci) && !(rdv && rdv.lieu === cle && rdv.type === "match" && tNow() >= rdv.debut);
  }
  function arriver(cle) {
    S.lieu = cle;
    sauver();
    // un lieu qui a sa pièce : on y entre, et tout s'y passe (sauf le match, sur la pelouse)
    if (dedans && dedans.cle === cle) { arriveeDedans(); return; }
    var clieu = !aInterieur(cle) && !carteOn ? cineDeLieu(cle) : null;
    if (clieu) { jouerCine(clieu, function () { arriver(cle); }); return; }
    if (doitEntrer(cle)) {
      entrerAvecFondu(cle, arriveeDedans);
      return;
    }
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
      // dans la pièce du lieu, s'il en a une (le match, lui, se joue sur la pelouse)
      if (r.type !== "match" && aInterieur(l.key)) { entrer(l.key); return; }
      poserEnVille(c[0], c[1]); S.lieu = l.key;
      var p = visee(); cam.x = p[0]; cam.y = p[1]; cam.libre = false;
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

  // ─────────────────────────────────────────────────────────────── le match
  // Le samedi, la ville se rend au stade : les passants prennent le chemin des
  // grilles, les deux tribunes se remplissent, vingt-deux joueurs entrent sur la
  // pelouse. Le moteur joue un bloc de six journées d'un seul tirage (six
  // lettres : V, N, D) ; la ville met en scène la dernière, celle d'aujourd'hui,
  // chez nous. Le score se tire de la lettre, les buts et leurs minutes du
  // score : pour l'écran seulement, sans toucher au moteur ni au Code de
  // Carrière. Deux ou trois actions sont racontées à leur minute (les phrases
  // de ville.yaml `match:`), la populaire se lève sur nos buts, et le panneau
  // du mur est garde le résultat jusqu'au samedi suivant.
  //
  // Le stade (docs/design/pixel_iso/scene_quartier.js, posé en 330, 420 dans la
  // zone, le monde 10 plus haut) : la pelouse (le but nord en y0), les gradins
  // de la populaire à l'est (qui montent vers le mur, on y voit des dos) et de
  // la tribune ouest (des visages), le panneau sur le mur est, côté rue.
  var STADE = {
    x0: 346, x1: 451, y0: 436, y1: 549, poteaux: [388, 409],
    tribunes: [
      { n: 6, x: function (k) { return 463.5 + 4 * k; }, z: function (k) { return 15 + 3 * k; }, y0: 458, y1: 553, pas: 2, dos: true, kop: true },
      { n: 4, x: function (k) { return 335 + 3 * k; }, z: function (k) { return 14 + 2 * k; }, y0: 438, y1: 551, pas: 2.2, dos: false, kop: false }
    ],
    panneau: { x: 488.3, yG: 521, yD: 479, zH: 25 },
    banc: [457, 497]
  };
  // le 4-4-2 de ceux qui défendent le but sud (a : la largeur, d'ouest en est ;
  // b : la longueur, du but nord au but sud) ; les visiteurs le jouent en miroir
  var ONZE = [[0.5, 0.95], [0.15, 0.8], [0.38, 0.84], [0.62, 0.84], [0.85, 0.8], [0.14, 0.63], [0.38, 0.66], [0.62, 0.66], [0.86, 0.63], [0.4, 0.5], [0.6, 0.49]];
  var MAILLOTS = [
    { t: [44, 74, 140], A: [44, 74, 140], w: [44, 74, 140], p: [232, 230, 222] },
    { t: [214, 172, 44], A: [214, 172, 44], w: [214, 172, 44], p: [32, 30, 28] },
    { t: [232, 230, 222], A: [232, 230, 222], w: [232, 230, 222], p: [32, 30, 28] },
    { t: [46, 112, 64], A: [46, 112, 64], w: [232, 230, 222], p: [232, 230, 222] },
    { t: [26, 26, 28], A: [26, 26, 28], w: [200, 64, 52], p: [26, 26, 28] }
  ];
  var DOMICILE = { p: [226, 220, 204], w: [214, 206, 190] };   // le Racing : bordeaux rayé, short blanc
  var GARDIENS = [{ t: [70, 128, 74], A: [70, 128, 74], w: [70, 128, 74], p: [30, 30, 30] }, { t: [226, 128, 44], A: [226, 128, 44], w: [226, 128, 44], p: [30, 30, 30] }];
  var ARBITRE = { t: [22, 22, 24], A: [22, 22, 24], w: [22, 22, 24], p: [22, 22, 24] };
  var CHEVEUX_J = [{ y: [36, 26, 20], Y: [56, 41, 31] }, { y: [120, 84, 44], Y: [92, 64, 34] }, { y: [196, 156, 92], Y: [160, 122, 70] }, { y: [20, 16, 14], Y: [36, 28, 24] }, { y: [150, 150, 146], Y: [110, 110, 106] }];
  var PEAUX_J = [{ s: [140, 97, 69], S: [107, 71, 51] }, { s: [219, 176, 140], S: [168, 122, 94] }, { s: [196, 150, 110], S: [150, 108, 78] }, { s: [96, 64, 44], S: [72, 46, 32] }];
  var SCORES = { V: [[1, 0], [2, 0], [2, 1], [3, 1], [1, 0], [2, 1], [3, 0], [3, 2], [4, 1], [2, 0]], N: [[0, 0], [1, 1], [1, 1], [2, 2], [0, 0], [1, 1]], D: [[0, 1], [1, 2], [0, 2], [1, 3], [0, 1], [2, 3]] };
  var MATCH = null;

  // un dé qui ne bouge pas : la même carrière, le même samedi, le même score
  function hache() {
    var h = 2166136261;
    for (var i = 0; i < arguments.length; i++) {
      var s = String(arguments[i]);
      for (var j = 0; j < s.length; j++) { h ^= s.charCodeAt(j); h = Math.imul(h, 16777619); }
      h ^= 31; h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function de(graine) {
    var a = graine >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), a | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function sansAccent(s) { return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  // « Olympique de Saint-Machin » → « Saint-Machin » : on parle d'un club par sa ville
  var PREFIXES = /^(fc|ac|as|us|sc|rc|cs|es|ol|og|sa|ca|af|aj|ea|sco|stade|racing|club|olympique|sporting|athletic|union|association|sportive|sportif|real|entente|avenir|etoile|étoile|jeunesse|de|du|des|la|le|les|d|l)$/i;
  function villeDuClub(nom) {
    var mots = String(nom || "").replace(/[’']/g, "' ").split(/\s+/).filter(Boolean), i = 0;
    while (i < mots.length - 1 && PREFIXES.test(mots[i].replace(/'$/, ""))) i++;
    return mots.slice(i).join(" ").replace(/' /g, "'") || String(nom || "");
  }
  function surPanneau(nom) { return sansAccent(nom).toUpperCase().replace(/[^A-Z0-9 -]/g, "").trim().slice(0, 9).trim(); }

  // le match d'aujourd'hui, tiré de la dernière lettre du bloc
  function preparerMatch(v) {
    var lettres = String(v.resultats || "").trim().split(/\s+/).filter(Boolean);
    var lettre = lettres[lettres.length - 1] || "N";
    var g = (coquille && coquille.graine && coquille.graine()) || {};
    var r = de(hache(g.seed || 0, v.season, v.journee, v.blocs, lettres.join("")));
    var sc = SCORES[lettre] || SCORES.N, s = sc[Math.floor(r() * sc.length)];
    var autres = (v.standings || []).filter(function (x) { return !x.toi && x.club; });
    var advNom = autres.length ? autres[Math.floor(r() * autres.length)].club : "les visiteurs";
    var nous = (v.entities && v.entities.club) || v.club || "Racing Aubérive";
    var M = {
      lettre: lettre, lettres: lettres, gf: s[0], ga: s[1], r: r,
      nous: nous, nousCourt: surPanneau(villeDuClub(nous)), adv: advNom, advVille: villeDuClub(advNom), advCourt: surPanneau(villeDuClub(advNom)),
      maillot: MAILLOTS[Math.floor(r() * MAILLOTS.length)], role: v.role, journee: v.journee, rang: v.rank
    };
    M.ev = evenements(M.gf, M.ga, r);
    distribuer(M, v);
    return M;
  }
  // les buts et une occasion, à leur minute ; on en raconte trois au plus
  function evenements(gf, ga, r) {
    var ev = [], pris = {};
    function minute(lo, hi) {
      for (var k = 0; k < 40; k++) {
        var m = lo + Math.floor(r() * (hi - lo + 1)), libre = true;
        for (var d = -3; d <= 3; d++) if (pris[m + d]) libre = false;
        if (libre) { pris[m] = 1; return m; }
      }
      return lo + Math.floor(r() * (hi - lo + 1));
    }
    for (var i = 0; i < gf; i++) ev.push({ t: "pour", m: minute(4, 88) });
    for (var j = 0; j < ga; j++) ev.push({ t: "contre", m: minute(4, 88) });
    if (gf + ga < 2) ev.push({ t: r() < 0.55 ? "poteau" : "arret", m: minute(9, 84) });
    ev.sort(function (a, b) { return a.m - b.m; });
    var a = 0, b = 0;
    ev.forEach(function (e) { if (e.t === "pour") a++; if (e.t === "contre") b++; e.score = a + "-" + b; });
    (ev.length <= 3 ? ev : [ev[0], ev[Math.floor(ev.length / 2)], ev[ev.length - 1]]).forEach(function (e) { e.dit = true; });
    return ev;
  }
  // qui marque chez nous, qui garde nos buts : les visages de l'effectif à l'âge
  // où ils jouent (ville.yaml `match.joueurs`), le protagoniste s'il est joueur,
  // et sinon un poste (« ton avant-centre »)
  function distribuer(M, v) {
    var MD = D.match || {}, an = v.year || 1990, st = v.statuts || {}, r = M.r;
    var gens = [], gardien = null;
    (MD.joueurs || []).forEach(function (j) {
      if (an < j.de || an > j.a || !CHARS[j.id]) return;
      if (st[j.id] && st[j.id] !== "present") return;
      if (j.gardien) gardien = nomDe(j.id); else gens.push(nomDe(j.id));
    });
    var postes = (MD.postes || ["ton avant-centre"]).slice();
    M.gardien = gardien || MD.gardien || "ton gardien";
    M.ev.forEach(function (e) {
      if (e.t !== "pour" && e.t !== "poteau") return;
      if (M.role === "joueur" && e.t === "pour" && r() < 0.45) { e.toi = true; return; }
      var pool = gens.concat(gens).concat(postes);
      e.qui = pool[Math.floor(r() * pool.length)];
    });
  }
  // une phrase, la moins dite d'abord, et ses trous remplis (« de le numéro 9 » → « du numéro 9 »)
  function phraseMatch(type, M) {
    var T = ((D.match && D.match.textes) || {})[type] || [], ok = [];
    for (var i = 0; i < T.length; i++) if (siVrai(T[i].si)) ok.push(i);
    if (!ok.length) return "";
    S.phrasesMatch = S.phrasesMatch || {};
    var cle = function (i) { return type + ":" + i; };
    var min = Infinity;
    ok.forEach(function (i) { min = Math.min(min, S.phrasesMatch[cle(i)] || 0); });
    var pool = ok.filter(function (i) { return (S.phrasesMatch[cle(i)] || 0) === min; });
    var pick = pool[Math.floor(M.r() * pool.length)];
    S.phrasesMatch[cle(pick)] = (S.phrasesMatch[cle(pick)] || 0) + 1;
    return T[pick].texte;
  }
  function remplirMatch(t, V) {
    function maj(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
    var X = { qui: V.qui, Qui: maj(V.qui), adv: V.adv, Adv: maj(V.adv), gardien: V.gardien, Gardien: maj(V.gardien), score: V.score };
    return String(t).replace(/(^|[\s(«])([Dd])e \{(\w+)\}/g, function (m, avant, d, k) {
      var x = X[k];
      if (x == null) return m;
      if (/^[AEIOUYÉÈÊÂÎÔaeiouyéèêâîô]/.test(x)) return avant + d + "'" + x;
      if (/^le /.test(x)) return avant + (d === "D" ? "Du " : "du ") + x.slice(3);
      if (/^les /.test(x)) return avant + (d === "D" ? "Des " : "des ") + x.slice(4);
      return avant + d + "e " + x;
    }).replace(/\{(\w+)\}/g, function (m, k) { return X[k] != null ? X[k] : m; });
  }
  function texteAction(e, M) {
    var type = e.t === "pour" && e.toi ? "pour_toi" : e.t;
    var t = phraseMatch(type, M);
    var score = e.t === "contre" ? e.score.split("-").reverse().join("-") : e.score;
    return remplirMatch(t, { qui: e.qui || "", adv: M.advVille, gardien: M.gardien, score: score });
  }

  // ─── la foule : les deux tribunes, peintes une fois par match dans l'image de
  // la ville (la profondeur du décor cache ce que les murs cachent), en trois
  // poses : deux pour respirer, une pour se lever
  var FOULE = null;
  var MANTEAUX_F = [[58, 46, 40], [74, 62, 52], [40, 44, 58], [96, 82, 64], [66, 60, 58], [110, 96, 80], [52, 58, 48], [120, 40, 46], [150, 140, 120], [88, 30, 38]];
  var PEAUX_F = [[219, 176, 140], [196, 150, 110], [140, 97, 69], [96, 64, 44]];
  var CHEVEUX_F = [[36, 26, 20], [92, 61, 36], [150, 150, 146], [196, 156, 92], [20, 16, 14], [60, 44, 30]];
  function couchefoule(M) {
    var amb = ambiance(), cle = amb + ":" + M.remplissage + ":" + M.graineFoule;
    if (FOULE && FOULE.cle === cle) return FOULE;
    var u0 = 1500, v0 = 880, w = 700, h = 440, profAmb = PROFONDEUR[amb];
    // la profondeur des tuiles du stade doit être là, sinon les murs ne cacheraient rien
    for (var r0 = Math.floor(v0 / TUILE); r0 <= Math.floor((v0 + h) / TUILE); r0++)
      for (var c0 = Math.floor(u0 / TUILE); c0 <= Math.floor((u0 + w) / TUILE); c0++)
        if (!profTuile(nomTuile(profAmb, r0 * COLS + c0))) return null;
    var poses = [0, 1, 2].map(function () { var c = document.createElement("canvas"); c.width = w; c.height = h; return c; });
    var ctxs = poses.map(function (c) { return c.getContext("2d"); });
    var r = de(M.graineFoule), teinte = TEINTE[amb];
    function col(c) { return "rgb(" + Math.round(c[0] * teinte[0]) + "," + Math.round(c[1] * teinte[1]) + "," + Math.round(c[2] * teinte[2]) + ")"; }
    STADE.tribunes.forEach(function (T) {
      for (var k = 0; k < T.n; k++) for (var y = T.y0; y <= T.y1; y += T.pas) {
        if (r() > M.remplissage) continue;
        var X = T.x(k) + (r() - 0.5) * 0.8, Y = y + (r() - 0.5) * 0.6, Z = T.z(k);
        var visiteur = !T.kop && Y < 466 && r() < 0.85;
        var manteau = visiteur ? M.maillot.t : MANTEAUX_F[Math.floor(r() * MANTEAUX_F.length)];
        var echarpe = visiteur ? M.maillot.p : (T.kop ? (r() < 0.6 ? [128, 28, 44] : r() < 0.3 ? [214, 206, 190] : null) : (r() < 0.25 ? [128, 28, 44] : null));
        var peau = PEAUX_F[Math.floor(r() * PEAUX_F.length)], cheveux = CHEVEUX_F[Math.floor(r() * CHEVEUX_F.length)];
        var bonnet = r() < 0.15 ? (r() < 0.5 ? [128, 28, 44] : [214, 206, 190]) : null;
        var bouge = r() < 0.3;
        var p = versImage(X, Y, Z), u = Math.round(p[0]), v = Math.round(p[1]);
        // la silhouette : 3 de large, 5 de haut, les pieds en (u, v)
        var fig = [
          [null, bonnet || cheveux, null],
          [null, T.dos ? (bonnet || cheveux) : peau, null],
          [echarpe || manteau, echarpe || manteau, manteau],
          [manteau, manteau, manteau],
          [null, fonce(manteau, 0.6), null]
        ];
        for (var pose = 0; pose < 3; pose++) {
          var dv = pose === 2 ? -2 : (pose === 1 && bouge ? -1 : 0);
          for (var i = 0; i < 5; i++) for (var j = 0; j < 3; j++) {
            var c = fig[i][j];
            if (pose === 2 && i === 1 && j !== 1) c = manteau;            // les bras levés
            if (!c) continue;
            var pu = u - 1 + j, pv = v - 4 + i + dv;
            var ds = X + Y + Z + (4 - i - dv) / 2, sc = profondeur(pu, pv);
            if (sc && ds < sc - TOLERANCE) continue;
            ctxs[pose].fillStyle = col(c);
            ctxs[pose].fillRect(pu - u0, pv - v0, 1, 1);
          }
        }
      }
    });
    FOULE = { cle: cle, u0: u0, v0: v0, poses: poses };
    return FOULE;
  }
  function dessinerFoule(ts) {
    if (!MATCH) return;
    var F = couchefoule(MATCH);
    if (!F) return;
    var pose = MATCH.liesse > 0 ? (Math.floor(ts / 140) % 2 ? 2 : 0) : (Math.floor(ts / 520) % 2);
    var x0 = Math.round(cam.x - VW / 2), y0 = Math.round(cam.y - VH / 2);
    ctx.drawImage(F.poses[pose], F.u0 - x0, F.v0 - y0);
  }

  // ─── le panneau du mur est : deux noms et un score, en petites lettres de
  // trois points sur cinq, posé de biais sur la brique comme tout le reste
  var GLYPHES = {
    "0": "111101101101111", "1": "010110010010111", "2": "111001111100111", "3": "111001111001111", "4": "101101111001001",
    "5": "111100111001111", "6": "111100111101111", "7": "111001010010010", "8": "111101111101111", "9": "111101111001111",
    A: "010101111101101", B: "110101110101110", C: "011100100100011", D: "110101101101110", E: "111100110100111",
    F: "111100110100100", G: "011100101101011", H: "101101111101101", I: "111010010010111", J: "001001001101010",
    K: "101101110101101", L: "100100100100111", M: "101111111101101", N: "110101101101101", O: "010101101101010",
    P: "110101110100100", Q: "010101101110011", R: "110101110101101", S: "011100010001110", T: "111010010010010",
    U: "101101101101111", V: "101101101101010", W: "101101111111101", X: "101101010101101", Y: "101101010010010",
    Z: "111001010100111", "-": "000000111000000", " ": "000000000000000"
  };
  function ecrire(c2, txt, x, y, echelle, couleur) {
    c2.fillStyle = couleur;
    for (var n = 0; n < txt.length; n++) {
      var g = GLYPHES[txt.charAt(n)] || GLYPHES[" "];
      for (var i = 0; i < 15; i++) if (g.charAt(i) === "1") c2.fillRect(x + n * 4 * echelle + (i % 3) * echelle, y + Math.floor(i / 3) * echelle, echelle, echelle);
    }
  }
  function largeur(txt, echelle) { return txt.length * 4 * echelle - echelle; }
  var PANNEAU = null;
  function panneauCanvas() {
    var P0 = (MATCH && MATCH.enCours) ? { dom: MATCH.nousCourt, ext: MATCH.advCourt, gf: MATCH.score[0], ga: MATCH.score[1] } : S.panneau;
    if (!P0) return null;
    var amb = ambiance(), cle = [P0.dom, P0.ext, P0.gf, P0.ga, amb].join("|");
    if (PANNEAU && PANNEAU.cle === cle) return PANNEAU.c;
    var c = PANNEAU && PANNEAU.c || document.createElement("canvas");
    c.width = 84; c.height = 20;
    var x = c.getContext("2d"), t = TEINTE[amb], nuit = amb !== "jour";
    function col(a, lum) { var f = lum ? 1 : 1; return "rgb(" + Math.round(a[0] * (lum ? 1 : t[0]) * f) + "," + Math.round(a[1] * (lum ? 1 : t[1]) * f) + "," + Math.round(a[2] * (lum ? 1 : t[2]) * f) + ")"; }
    x.clearRect(0, 0, 84, 20);
    x.fillStyle = col([58, 44, 34]); x.fillRect(0, 0, 84, 20);
    x.fillStyle = col([20, 16, 13]); x.fillRect(1, 1, 82, 18);
    ecrire(x, P0.dom, 3, 3, 1, col([226, 214, 186], nuit));
    ecrire(x, P0.ext, 81 - largeur(P0.ext, 1), 3, 1, col([226, 214, 186], nuit));
    var sc = P0.gf + "-" + P0.ga;
    ecrire(x, sc, 42 - Math.floor(largeur(sc, 2) / 2), 9, 2, col([255, 184, 72], true));
    PANNEAU = { cle: cle, c: c };
    return c;
  }
  function dessinerPanneau() {
    var c = panneauCanvas();
    if (!c) return;
    var P0 = STADE.panneau, p = versImage(P0.x, P0.yG, P0.zH);
    var ox = Math.round(p[0] - (cam.x - VW / 2)), oy = Math.round(p[1] - (cam.y - VH / 2));
    if (ox > VW + 10 || ox < -100 || oy > VH + 70 || oy < -70) return;
    ctx.save();
    ctx.setTransform(1, -0.5, 0, 1, ox, oy);
    ctx.drawImage(c, 0, 0);
    ctx.restore();
  }

  // ─── la scène : l'entrée des joueurs, le jeu, les actions, la fin
  function aPied(a, b) { return [STADE.x0 + a * (STADE.x1 - STADE.x0), STADE.y0 + b * (STADE.y1 - STADE.y0)]; }
  function jouerMatch(v, ensuite) {
    if (MATCH) return;
    if (dedans) aDehors();
    var M = preparerMatch(v);
    var g = (coquille && coquille.graine && coquille.graine()) || {};
    M.graineFoule = hache(g.seed || 0, v.season, v.journee, "foule");
    var tr = (v.gauges || []).filter(function (x) { return x.id === "tribunes"; })[0];
    M.remplissage = Math.round(clamp(0.35 + ((tr ? tr.value : 50) / 100) * 0.55, 0.3, 0.92) * 20) / 20;
    M.minute = 0; M.vitesse = 0; M.score = [0, 0]; M.prochain = 0; M.liesse = 0; M.pause = 0;
    M.enCours = true; M.phase = "entree"; M.t = 0; M.ensuite = ensuite;
    annoncerVille("match", M);
    M.lignes = [];
    // les vingt-deux, l'arbitre ; le protagoniste joueur porte le numéro 9 de chez nous
    var rj = de(hache(g.seed || 0, "maillots", v.season));
    M.joueurs = [];
    for (var eq = 0; eq < 2; eq++) for (var n = 0; n < 11; n++) {
      var base = eq === 0 ? ONZE[n] : [1 - ONZE[n][0], 1 - ONZE[n][1]];
      var pal = {}, kit = n === 0 ? GARDIENS[eq] : (eq === 0 ? DOMICILE : M.maillot), k2;
      for (k2 in kit) pal[k2] = kit[k2];
      var pe = PEAUX_J[Math.floor(rj() * PEAUX_J.length)], ch = CHEVEUX_J[Math.floor(rj() * CHEVEUX_J.length)];
      for (k2 in pe) pal[k2] = pe[k2];
      for (k2 in ch) pal[k2] = ch[k2];
      var j = { eq: eq, n: n, base: base, a: 0.86 + rj() * 0.06, b: 1.04, pal: pal, sp: "joueur", miroir: false, pas: 0, dist: rj() * 10, vit: 0.1 + rj() * 0.03 };
      if (eq === 0 && n === 9 && M.role === "joueur") { j.heros = true; j.pal = null; }
      M.joueurs.push(j);
    }
    M.arbitre = { a: 0.9, b: 1.04, sp: "joueur", pal: ARBITRE, miroir: false, pas: 0, dist: 0, vit: 0.12, base: [0.55, 0.5] };
    M.ballon = { a: 0.5, b: 0.5, z: 0, vol: null };
    M.porteur = null; M.equipe = 0; M.decision = 1;
    MATCH = M; FOULE = null; PANNEAU = null;
    sonVille();
    occupe = true; passants = []; figurants = [];
    document.body.classList.add("v-au-stade");
    var el = $("villeMatch");
    el.querySelector(".dom").textContent = villeDuClub(M.nous);
    el.querySelector(".ext").textContent = M.advVille;
    el.querySelector(".fin").hidden = true;
    el.querySelector(".v-match-legende").hidden = true;
    majTableau();
    el.hidden = false;
    cam.libre = true;
    var c = aPied(0.5, 0.5), p = versImage(c[0], c[1], ZSOL);
    cam.x = p[0]; cam.y = p[1] - UI.decal / k;
    legende(remplirMatch("{Adv} à la Rive.", { adv: M.advVille }) + " " + (M.remplissage >= 0.75 ? "Les deux tribunes sont pleines." : M.remplissage >= 0.55 ? "La populaire est pleine, l'ouest à moitié." : "Il reste des places partout."), 3200);
  }
  function majTableau() {
    var el = $("villeMatch"), M = MATCH;
    if (!el || !M) return;
    el.querySelector(".sc").textContent = M.score[0] + " – " + M.score[1];
    var mn = Math.min(90, Math.floor(M.minute));
    el.querySelector(".mn").textContent = M.phase === "entree" ? "" : M.phase === "fin" ? "Fin" : M.phase === "mi" ? "Mi-temps" : mn + "'";
  }
  var legendeFin = 0;
  function legende(txt, ms) {
    var el = $("villeMatch").querySelector(".v-match-legende");
    el.textContent = txt; el.hidden = false;
    el.classList.remove("on"); void el.offsetWidth; el.classList.add("on");
    legendeFin = performance.now() + (ms || 3800);
  }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function passer(vers, duree, haut) {
    var B = MATCH.ballon;
    B.vol = { a0: B.a, b0: B.b, a1: vers.a, b1: vers.b, t: 0, d: duree, h: haut || 0, vers: vers.j || null, fin: vers.fin || null };
    MATCH.porteur = null;
  }
  function plusProches(eq, a, b, n) {
    return MATCH.joueurs.filter(function (j) { return j.eq === eq && j.n !== 0; })
      .sort(function (x, y) { return Math.hypot(x.a - a, x.b - b) - Math.hypot(y.a - a, y.b - b); }).slice(0, n);
  }
  // une action écrite : le ballon va au buteur, près du but, puis au fond (ou sur le poteau, ou dans les gants)
  function lancerAction(e) {
    var M = MATCH, nous = e.t === "pour" || e.t === "poteau", eq = nous ? 0 : 1;
    var butB = nous ? -0.02 : 1.02, sens = nous ? 1 : -1;
    var tireur = e.toi ? M.joueurs.filter(function (j) { return j.heros; })[0] : null;
    if (!tireur) tireur = M.joueurs.filter(function (j) { return j.eq === eq && (j.n === 9 || j.n === 10); })[Math.floor(M.r() * 2)];
    var ra = 0.3 + M.r() * 0.4, rb = nous ? 0.17 + M.r() * 0.06 : 0.83 - M.r() * 0.06;
    tireur.force = [ra, rb];
    M.action = { e: e, tireur: tireur, etape: "approche", t: 0 };
    M.equipe = eq;
    var passeur = plusProches(eq, ra, rb + sens * 0.18, 2)[1] || plusProches(eq, ra, rb, 1)[0];
    M.ballon.a = passeur.a; M.ballon.b = passeur.b;
    passer({ a: ra, b: rb, j: tireur }, 0.7, 2);
    M.action.butB = butB;
  }
  function tirer() {
    var M = MATCH, A = M.action, e = A.e;
    var px = (STADE.poteaux[0] - STADE.x0) / (STADE.x1 - STADE.x0), qx = (STADE.poteaux[1] - STADE.x0) / (STADE.x1 - STADE.x0);
    var cible;
    if (e.t === "pour" || e.t === "contre") cible = { a: lerp(px, qx, 0.2 + M.r() * 0.6), b: A.butB, fin: "but" };
    else if (e.t === "poteau") cible = { a: M.r() < 0.5 ? px : qx, b: A.butB + 0.02, fin: "poteau" };
    else cible = { a: 0.5 + (M.r() - 0.5) * 0.08, b: 0.94, fin: "arret" };
    passer(cible, 0.42, e.t === "poteau" ? 3 : 1.5);
    A.etape = "tir";
  }
  function finAction(fin) {
    var M = MATCH, A = M.action, e = A.e;
    e.fait = true;
    if (fin === "but") {
      if (e.t === "pour") { M.score[0]++; M.liesse = 3.2; } else M.score[1]++;
      majTableau();
      PANNEAU = null;
    }
    var txt = e.dit ? e.m + "e · " + texteAction(e, M) : e.m + "e · " + (e.t === "pour" ? "But ! " + M.score[0] + "-" + M.score[1] + "." : e.t === "contre" ? "But pour " + M.advVille + " : " + M.score[0] + "-" + M.score[1] + "." : texteAction(e, M));
    M.lignes.push(txt);
    legende(txt, e.dit ? 4600 : 2200);
    M.pause = e.dit ? 3.4 : 1.6;
    A.etape = "fete";
    if (fin === "poteau") { M.ballon.vol = null; passer({ a: M.ballon.a + (M.r() - 0.5) * 0.2, b: 0.2 }, 0.5, 1); }
    if (fin === "arret") { var gk = M.joueurs[0]; M.ballon.vol = null; M.porteur = gk; M.equipe = 0; }
  }
  function engagement(eq) {
    var M = MATCH;
    M.joueurs.forEach(function (j) { j.force = null; });
    M.ballon.a = 0.5; M.ballon.b = 0.5; M.ballon.z = 0; M.ballon.vol = null;
    var avant = M.joueurs.filter(function (j) { return j.eq === eq && j.n === 9; })[0];
    M.porteur = avant; M.equipe = eq; M.decision = 0.8;
    avant.a = 0.5; avant.b = 0.5;
  }
  function majMatch(dt, ts) {
    var M = MATCH;
    if (!M) return;
    // le samedi en direct (ville_direct.js) : l'anneau, les buts ; une décision ouverte ralentit tout
    if (M.direct) directTic();
    var dtCam = dt;
    if (M.gel) dt *= 0.25;
    M.t += dt;
    if (M.liesse > 0) M.liesse -= dt;
    var leg = $("villeMatch").querySelector(".v-match-legende");
    if (!leg.hidden && performance.now() > legendeFin) leg.hidden = true;
    // l'horloge : vite entre les actions, lentement à leur approche, arrêtée pendant les fêtes
    if (M.phase === "entree") {
      if (M.t > 3.4) { M.phase = "jeu"; engagement(0); majTableau(); }
    } else if (M.phase === "jeu" || M.phase === "mi") {
      if (M.pause > 0) {
        M.pause -= dt;
        if (M.pause <= 0) {
          if (M.phase === "mi") { M.phase = "jeu"; engagement(1); }
          else if (M.action) { var e0 = M.action.e; M.action = null; if (e0.t === "pour") engagement(1); else if (e0.t === "contre") engagement(0); }
        }
      } else if (!M.action) {
        var e = M.ev[M.prochain], avance = e ? e.m - M.minute : 99;
        var vit = avance < 1.6 ? 1.3 : 6.5;
        var avant = M.minute;
        M.minute += vit * dt;
        if (avant < 45 && M.minute >= 45 && (!e || e.m > 45)) { M.minute = 45; M.phase = "mi"; M.pause = 1.8; legende("Mi-temps · " + M.score[0] + "-" + M.score[1] + ".", 1800); }
        else if (e && M.minute >= e.m) { M.minute = e.m; M.prochain++; if (e.t === "decision") directMoment(e); else lancerAction(e); }
        else if (M.minute >= 90) { finirMatch(); return; }
        majTableau();
      }
    }
    if (M.phase === "fin") { cameraMatch(dtCam); return; }
    // le ballon
    var B = M.ballon;
    if (B.vol) {
      var V = B.vol;
      V.t += dt;
      var q = Math.min(1, V.t / V.d);
      B.a = lerp(V.a0, V.a1, q); B.b = lerp(V.b0, V.b1, q); B.z = V.h * 4 * q * (1 - q);
      if (q >= 1) {
        B.vol = null; B.z = 0;
        if (V.fin) finAction(V.fin);
        else if (V.vers) {
          M.porteur = V.vers; M.decision = 0.5 + M.r() * 0.9;
          if (M.action && M.action.etape === "approche" && V.vers === M.action.tireur) { M.action.etape = "controle"; M.action.t = 0; }
        }
      }
    } else if (M.porteur && M.phase === "jeu" && M.pause <= 0) {
      var p = M.porteur, sens = p.eq === 0 ? -1 : 1;
      B.a = p.a + 0.006; B.b = p.b + sens * 0.012; B.z = 0;
      if (M.action && M.action.etape === "controle") {
        M.action.t += dt;
        if (M.action.t > 0.55) tirer();
      } else if (!M.action) {
        M.decision -= dt;
        if (M.decision <= 0) {
          var adverse = p.eq === 0 ? 1 : 0;
          var danger = p.eq === 0 ? p.b < 0.3 : p.b > 0.7;
          if (danger || M.r() < 0.16) {
            // le ballon change de camp : un tacle, une interception
            var t2 = plusProches(adverse, p.a, p.b, 1)[0];
            passer({ a: t2.a, b: t2.b, j: t2 }, 0.3, 0);
          } else {
            var amis = plusProches(p.eq, p.a, p.b + sens * 0.2, 4).filter(function (j) { return j !== p; });
            var choix = amis[Math.floor(M.r() * amis.length)];
            var d = Math.hypot(choix.a - p.a, choix.b - p.b);
            passer({ a: choix.a, b: choix.b, j: choix }, clamp(d / 0.55, 0.25, 1), d > 0.28 ? 2.5 : 0);
          }
        }
      }
    }
    // un ballon perdu (un poteau, un dégagement) : le plus proche le ramasse
    var libre = !B.vol && !M.porteur && M.phase === "jeu" && !(M.action && M.action.etape !== "fete");
    if (libre) {
      var pr = M.joueurs.slice().sort(function (x, y) { return Math.hypot(x.a - B.a, x.b - B.b) - Math.hypot(y.a - B.a, y.b - B.b); })[0];
      if (Math.hypot(pr.a - B.a, pr.b - B.b) < 0.035) { M.porteur = pr; M.equipe = pr.eq; M.decision = 0.6 + M.r() * 0.6; libre = false; }
    }
    // les joueurs : le bloc suit le ballon, le plus proche presse, le gardien glisse sur sa ligne
    var ba = B.vol ? B.vol.a1 : B.a, bb = B.vol ? B.vol.b1 : B.b;
    var presseur = M.phase === "jeu" ? plusProches(M.equipe === 0 ? 1 : 0, ba, bb, 1)[0] : null;
    var chasseur = libre ? plusProches(M.equipe, ba, bb, 1)[0] : null;
    M.joueurs.concat([M.arbitre]).forEach(function (j) {
      var ta, tb;
      if (M.phase === "entree") { ta = j.base[0]; tb = j.base[1] < 0.5 ? Math.max(0.3, j.base[1]) : Math.min(0.7, j.base[1]); if (j === M.arbitre) { ta = 0.55; tb = 0.5; } }
      else if (j.force) { ta = j.force[0]; tb = j.force[1]; }
      else if (j === M.arbitre) { ta = clamp(ba + 0.12, 0.1, 0.9); tb = clamp(bb + 0.06, 0.1, 0.9); }
      else if (j.n === 0) { ta = 0.5 + (ba - 0.5) * 0.3; tb = j.eq === 0 ? 0.96 : 0.04; }
      else {
        var att = M.equipe === j.eq ? (j.eq === 0 ? -0.08 : 0.08) : 0;
        ta = clamp(j.base[0] + (ba - 0.5) * 0.35, 0.04, 0.96);
        tb = clamp(j.base[1] + (bb - 0.5) * 0.5 + att, 0.04, 0.96);
        if (j === presseur || j === chasseur || j === M.porteur) { ta = ba; tb = bb; }
      }
      if (M.action && M.action.etape === "fete" && M.action.e.t === "pour" && j === M.action.tireur) { ta = 1.02; tb = 0.3; }
      var da = ta - j.a, db = tb - j.b, d = Math.hypot(da, db), pasMax = j.vit * dt * (j === M.porteur ? 0.7 : 1);
      if (d > 0.004) {
        var f = Math.min(1, pasMax / d);
        j.a += da * f; j.b += db * f;
        var w = STADE.x1 - STADE.x0, l = STADE.y1 - STADE.y0, du = 2 * (da * w - db * l);
        if (Math.abs(du) > 0.01) j.miroir = du < 0;
        j.dist += pasMax * 120;
        var ph = Math.floor(j.dist / 4) % 4;
        j.pas = ph === 1 ? 1 : ph === 3 ? -1 : 0;
      } else j.pas = 0;
    });
    cameraMatch(dtCam);
  }
  function cameraMatch(dt) {
    // `M.cible` : une décision du direct regarde le banc, la Nord, la loge ou le joueur
    var M = MATCH, B = M.ballon, c = aPied(clamp(B.a, 0.15, 0.85), clamp(B.b, 0.1, 0.9)), p = M.cible ? versImage(M.cible[0], M.cible[1], M.cible[2]) : versImage(c[0], c[1], ZSOL);
    // (au-dessus de la carte de décision, à mi-hauteur entre elle et le tableau : `cibleSy`)
    var ty = M.cible && M.cibleSy ? p[1] + (window.innerHeight / 2 - M.cibleSy) / k : p[1] - UI.decal / k;
    cam.x += (p[0] - cam.x) * Math.min(1, dt * 1.8); cam.y += (ty - cam.y) * Math.min(1, dt * 1.8);
  }
  // les vingt-deux, l'arbitre, le ballon : ajoutés aux gens que la ville dessine
  function gensDuMatch(gens) {
    var M = MATCH;
    if (!M) return;
    M.joueurs.concat([M.arbitre]).forEach(function (j) {
      var w = aPied(j.a, j.b);
      gens.push({ sp: j.sp, x: w[0], y: w[1], miroir: j.miroir, pas: j.pas, pal: j.pal, silhouette: !!j.heros, match: true, emote: j.emote });
    });
    var B = M.ballon, wb = aPied(B.a, B.b);
    gens.push({ ballon: true, x: wb[0], y: wb[1], z: B.z });
  }
  function dessinerBallon(g) {
    var p = versImage(g.x, g.y, ZSOL), ox = Math.round(p[0] - (cam.x - VW / 2)), oy = Math.round(p[1] - (cam.y - VH / 2));
    ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.fillRect(ox - 1, oy, 3, 1);
    var h = Math.round(g.z * 3);
    ctx.fillStyle = "#F4F0E6"; ctx.fillRect(ox - 1, oy - 2 - h, 2, 2);
    ctx.fillStyle = "#9A948A"; ctx.fillRect(ox, oy - 1 - h, 1, 1);
  }
  function finirMatch() {
    var M = MATCH;
    M.phase = "fin"; M.enCours = false; M.minute = 90;
    // si l'on a passé : les buts qui manquent tombent d'un coup
    M.ev.forEach(function (e) {
      if (e.fait) return;
      e.fait = true;
      if (e.t === "pour") M.score[0]++; else if (e.t === "contre") M.score[1]++;
      if (e.dit) M.lignes.push(e.m + "e · " + texteAction(e, M));
    });
    M.prochain = M.ev.length; M.action = null;
    S.panneau = { dom: M.nousCourt, ext: M.advCourt, gf: M.score[0], ga: M.score[1] };
    PANNEAU = null;
    majTableau();
    if (M.score[0] > M.score[1]) M.liesse = 4;
    var el = $("villeMatch"), f = el.querySelector(".fin");
    el.querySelector(".v-match-legende").hidden = true;
    f.querySelector(".v-match-score .d").textContent = M.nous;
    f.querySelector(".v-match-score .s").textContent = M.score[0] + " – " + M.score[1];
    f.querySelector(".v-match-score .e").textContent = M.adv;
    f.querySelector(".v-match-sifflet").textContent = remplirMatch(phraseMatch(M.lettre === "V" ? "fin_v" : M.lettre === "D" ? "fin_d" : "fin_n", M), { adv: M.advVille, gardien: M.gardien });
    var ul = f.querySelector("ul");
    ul.innerHTML = "";
    M.lignes.forEach(function (l) { var li = document.createElement("li"); li.textContent = l; ul.appendChild(li); });
    var j1 = Math.max(1, (M.journee || 6) - M.lettres.length + 1), puces = f.querySelector(".v-match-bloc");
    puces.innerHTML = "";
    M.lettres.forEach(function (l, i) {
      var s = document.createElement("span");
      s.className = "v-puce " + (l === "V" ? "v" : l === "D" ? "d" : "n");
      s.innerHTML = "<i>J" + (j1 + i) + "</i><b>" + l + "</b>";
      puces.appendChild(s);
    });
    var pts = M.lettres.reduce(function (t, l) { return t + (l === "V" ? 3 : l === "N" ? 1 : 0); }, 0);
    f.querySelector(".v-match-pts").textContent = "Six journées, " + pts + " point" + (pts > 1 ? "s" : "") + (M.rang ? " · " + (M.rang === 1 ? "1er" : M.rang + "e") + " au classement" : "");
    f.hidden = false;
    f.querySelector("button").focus();
  }
  function quitterStade() {
    var M = MATCH;
    if (!M) return;
    MATCH = null; FOULE = null; PANNEAU = null;
    sonVille();
    $("villeMatch").hidden = true;
    document.body.classList.remove("v-au-stade");
    occupe = false;
    cam.libre = false;
    S.sortieStade = tDe(S.semaine, S.jour, 3);
    var ensuite = M.ensuite;
    annoncerVille("apres_match", vue);
    if (ensuite) ensuite();
  }
  // le samedi avant le match : la ville va au stade
  function jourDeMatch() {
    return !!(rdv && rdv.type === "match" && rdv.beat === "match" && S.jour === 5 && S.tranche <= 2 && semaineDe(rdv.debut) === S.semaine);
  }

  // ─────────────────────────────────────────────────────────────── les scènes de la semaine
  // Le moteur sert deux ou trois cartes entre deux samedis ; le reste de la
  // semaine, la ville a sa vie. Chaque jour sans carte, et souvent le soir, elle
  // programme une scène de content/ville/scenes*.yaml, à son lieu et à son
  // heure, ou qui vient à toi (on t'arrête dans la rue ; le téléphone sonne chez
  // toi). Quand l'heure arrive — le temps passe : une activité, « Attendre »,
  // « Y aller », le réveil —, la ville s'y rend d'un fondu, comme pour un
  // rendez-vous : on ne saute plus trois jours sans que rien n'arrive. Deux
  // choix, des effets légers que le moteur applique sans rien tirer
  // (Engine.mission, étape `scene`) ; une fois par carrière.
  var SCENE = {};
  function lieuScene(sc) { return sc.lieu === "domicile" ? chezToi() : sc.lieu === "rue" ? "rue" : (LIEU[sc.lieu] ? sc.lieu : null); }
  function sceneOk(sc, jour) {
    if (sc.cine && !cineOk(sc.cine)) return false;
    if (sc.roles && sc.roles.indexOf(S.role) < 0) return false;
    if (!sc.rejouable && S.scenesVues && S.scenesVues[sc.id] != null) return false;
    if (sc.jours && sc.jours.indexOf(JOURS[jour]) < 0) return false;
    var cle = lieuScene(sc);
    if (!cle || lieuFerme(cle)) return false;     // un quartier encore fermé (le Grand Aubérive)
    return siVrai(sc.si, cle === "rue" ? null : cle);
  }
  // les tranches où la scène peut se jouer ce jour-là, à partir de `depuis` (un lieu a ses heures)
  function tranchesScene(sc, jour, depuis, permises) {
    var cle = lieuScene(sc), def = cle && TEXTE_LIEU[cle];
    return sc.tranches.filter(function (t) {
      var i = TRANCHES.indexOf(t);
      if (i < depuis || permises.indexOf(t) < 0) return false;
      return !(def && (def.heures || def.jours)) || ouvertA(def, tDe(S.semaine, jour, i));
    });
  }
  function planifierScenes() {
    if (!S) return;
    var cle = S.semaine + ":" + S.jour;
    if (S.scenesJour && S.scenesJour.cle === cle) return;
    var jour = S.jour, depuis = S.tranche, plan = [];
    // le jour a son rendez-vous du moteur (une carte qui s'ouvre, le match, le dimanche) : pas de scène de jour
    var occupeJour = !!(rdv && !rdv.sombre && rdv.type !== "ici" && semaineDe(rdv.debut) === S.semaine && jourDe(rdv.debut) === jour);
    var g = (coquille && coquille.graine && coquille.graine()) || {};
    var r = de(hache(g.seed || 0, "scenes", S.semaine, jour, (vue && vue.season) || 1, (vue && vue.year) || 0));
    var tous = Object.keys(SCENE).sort().map(function (id) { return SCENE[id]; });
    function placer(permises) {
      var cands = tous.filter(function (sc) {
        return !plan.some(function (p) { return p.id === sc.id; }) && sceneOk(sc, jour) && tranchesScene(sc, jour, depuis, permises).length > 0;
      });
      if (!cands.length) return;
      // les plus précises (une histoire, un drapeau, une époque) pèsent plus
      var poids = cands.map(function (sc) { return (+sc.poids || 1) * (1 + (sc.si ? String(sc.si).split("&&").length * 1.5 : 0)); });
      var tot = poids.reduce(function (a, b) { return a + b; }, 0), x = r() * tot, sc = cands[0];
      for (var i = 0; i < cands.length; i++) { x -= poids[i]; if (x < 0) { sc = cands[i]; break; } }
      var ts = tranchesScene(sc, jour, depuis, permises);
      plan.push({ id: sc.id, t: tDe(S.semaine, jour, TRANCHES.indexOf(ts[Math.floor(r() * ts.length)])), fait: false });
    }
    if (!occupeJour) placer(["matin", "midi", "aprem"]);
    if (r() < (occupeJour ? 0.5 : 0.35)) placer(["soir", "nuit"]);
    S.scenesJour = { cle: cle, plan: plan };
  }
  // l'heure d'une scène est venue (le temps vient de passer, ou l'on se réveille) : la ville s'y rend
  function sceneDue() {
    if (!S || carteOn || occupe || MATCH) return false;
    planifierScenes();
    var t = tNow(), plan = (S.scenesJour && S.scenesJour.plan) || [];
    for (var i = 0; i < plan.length; i++) {
      var p = plan[i];
      if (p.fait) continue;
      if (p.t < t) { p.fait = true; continue; }
      if (p.t === t && SCENE[p.id] && sceneOk(SCENE[p.id], S.jour)) { p.fait = true; jouerScene(SCENE[p.id]); return true; }
    }
    return false;
  }
  function jouerScene(sc) {
    if (sc.cine) { S.scenesVues = S.scenesVues || {}; S.scenesVues[sc.id] = 1; jouerCine(sc.cine); return; }
    occupe = true;
    fermerPorte();
    var cle = lieuScene(sc), titre = JOUR_MOT[S.jour] + ", " + HEURE[TRANCHES[S.tranche]];
    titre = titre.charAt(0).toUpperCase() + titre.slice(1);
    fonduTexte(titre, cle === "rue" ? "Dans la rue" : nomLieu(LIEU[cle]), "", function () {
      if (cle !== "rue" && aInterieur(cle)) { entrer(cle); return; }
      if (cle !== "rue" && LIEU[cle]) { var c = centre(LIEU[cle].door); poserEnVille(c[0], c[1]); S.lieu = cle; }
      else if (dedans) aDehors();
      var p = visee(); cam.x = p[0]; cam.y = p[1]; cam.libre = false;
      recaler();
    }, function () {
      occupe = false;
      ouvrirScene(sc);
    });
  }
  function ouvrirScene(sc) {
    var cle = lieuScene(sc), e = sc.etapes[0], el = $("villePorte");
    // une scène est une rencontre : son visage se montre ensuite en ville (`presences`)
    if (sc.qui && CHARS[sc.qui]) S.vus[sc.qui] = 1;
    porteOuverte = cle === "rue" ? null : cle;
    var qui = sc.qui ? (CHARS[sc.qui] ? nomDe(sc.qui) : (NOM_GENS[sc.qui] || "")) : "";
    var ou = cle === "rue" ? "dans la rue" : nomLieu(LIEU[cle]);
    var html = '<h2>' + esc(sc.titre) + '</h2><p class="v-sous">' + esc((qui ? qui + " · " : "") + ou) + "</p>" +
      '<p class="v-texte">' + esc(remplir(e.texte)) + '</p><div class="v-acts">';
    (e.choix || []).forEach(function (c) {
      var non = c.francs < 0 && S.francs + c.francs < 0 ? "Tu n'as pas cette somme." : "";
      html += '<button type="button" class="v-act v-choix" data-c="' + esc(c.id) + '"' + (non ? " disabled" : "") + "><b>" + esc(c.label) + "</b>" +
        (c.francs ? '<span class="cout"><span class="' + (c.francs > 0 ? "up" : "dn") + '">' + (c.francs > 0 ? "+" : "") + esc(argent(c.francs)) + (c.sale ? " · sale" : "") + "</span></span>" : "") +
        (non ? '<span class="pourquoi">' + esc(non) + "</span>" : "") + "</button>";
    });
    // aucun choix à ta portée (tout coûte plus que ce que tu as) : on s'en va sans rien dire, et la
    // scène est passée (vue, sans ses effets) — sinon le panneau n'aurait aucune sortie
    var payable = (e.choix || []).some(function (c) { return !(c.francs < 0 && S.francs + c.francs < 0); });
    if (!payable) html += '<button type="button" class="v-act v-passer"><b>Laisser passer</b><span class="pourquoi">Rien de tout cela n\'est dans tes moyens.</span></button>';
    html += "</div>";
    el.innerHTML = html;
    el.classList.remove("v-mission");
    el.classList.add("on", "v-scene");
    el.querySelectorAll(".v-choix").forEach(function (b) {
      b.addEventListener("click", function () { choisirScene(sc, b.getAttribute("data-c")); });
    });
    var passer = el.querySelector(".v-passer");
    if (passer) passer.addEventListener("click", function () {
      S.scenesVues = S.scenesVues || {};
      S.scenesVues[sc.id] = S.semaine;
      sauver();
      el.classList.remove("v-scene");
      fermerPorte();
      annoncer();
    });
  }
  function choisirScene(sc, cid) {
    var e = sc.etapes[0], c = (e.choix || []).filter(function (x) { return x.id === cid; })[0];
    if (!c || carteOn || occupe) return;
    if (c.francs) {
      S.francs += c.francs;
      if (c.sale && c.francs > 0) S.sale = (S.sale || 0) + c.francs;
      gain(c.francs);
    }
    if (c.effets) {
      var avantScene = vue;
      vue = coquille.mission(sc.id, "scene", c.id);
      pont(vue);
      if (vue.over) return;
      annoncerVivant(avantScene, vue);
    }
    S.scenesVues = S.scenesVues || {};
    S.scenesVues[sc.id] = S.semaine;
    S.missionsFaites[sc.id] = true;   // `mission(<id>)` lit une scène vue : deux scènes s'enchaînent
    majHud(); sauver();
    var cle = lieuScene(sc), el = $("villePorte"), reponse = remplir(c.reponse);
    el.classList.remove("v-scene");
    if (cle !== "rue" && LIEU[cle]) { ouvrirPorte(cle, reponse); annoncer(); return; }
    el.innerHTML = '<h2>' + esc(sc.titre) + '</h2><p class="v-sous">dans la rue</p><p class="v-texte">' + esc(reponse) + '</p><button type="button" class="v-sortir">Continuer</button>';
    el.classList.add("on");
    el.querySelector(".v-sortir").addEventListener("click", fermerPorte);
    annoncer();
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
  // une tranche : l'heure du rendez-vous peut sonner
  function pas() {
    S.eveil = (S.eveil || 0) + 1;
    S.tranche++;
    if (S.tranche > 4) { S.tranche = 0; nouveauJour(); }
    echeanceMission();
    if (echeance()) return false;
    if (sceneDue()) return false;
    return true;
  }
  function nouveauJour() {
    S.jour++;
    S.jourFaits = {};
    S.scenesJour = null;
    if (S.jour > 6) { S.jour = 0; nouvelleSemaine(); }
    annoncerVille("jour");
  }
  function nouvelleSemaine(sansFondu) {
    S.semaine++;
    annoncerVille("semaine");
    S.cartesSemaine = 0;
    S.auMatch = false;
    var j = (vue && vue.journee) || 0, dj = j - (S.journeeDebut || 0);
    S.journeeDebut = j;
    // la paie : autant de semaines de championnat qu'il en a passé (une au moins)
    var paie = salaire() * Math.max(1, dj);
    S.francs += paie;
    var phrase = dj >= 3 ? dj + " semaines plus tard" : dj >= 1 ? "Quelques semaines plus tard" : "La semaine suivante";
    var texte = "La paie est tombée : " + argent(paie) + "." + (S.francs - paie < 0 && S.francs >= 0 ? " Le découvert est comblé." : "");
    if (!sansFondu) attente.push({ titre: phrase, sous: moisCourant(), texte: texte, paie: true });
    ruine();
    return texte;
  }
  // le retour d'un voyage : le lundi matin, chez toi ; la paie des semaines passées
  // là-bas tombe (son texte rejoint celui du fondu du retour)
  function rentrerDeVoyage() {
    S.jour = 0; S.tranche = 0; S.eveil = 0; S.jourFaits = {}; S.scenesJour = null;
    var paie = nouvelleSemaine(true);
    S.lieu = chezToi();
    return paie;
  }
  // LA RUINE (le mode histoire : la carrière s'arrête par l'histoire, et la
  // banqueroute en est une). Le découvert qui survit à la paie : la banque
  // écrit. La semaine suivante, s'il dure : l'huissier passe et vend ce qui se
  // vend (le moins nécessaire d'abord, à la moitié du prix). Quand il n'y a
  // plus rien à prendre et que le trou dépasse encore une paie, c'est le
  // tribunal de commerce : la fin `co_banqueroute`.
  function ruine() {
    if (S.francs >= 0) { S.dette = 0; return; }
    S.dette = (S.dette || 0) + 1;
    var seuil = -salaire();
    // la première semaine, la banque écrit toujours : on n'apprend pas la ruine par l'huissier
    if (S.dette === 1) {
      attente.push({ titre: "La banque", sous: moisCourant(), texte: "Une lettre de la Banque Aubérivoise : ton compte est à découvert de " + argent(-S.francs) + ". La prochaine paie devra le combler." });
      return;
    }
    var vendus = [];
    ["luxe", "vehicules", "logement", "tout"].forEach(function (q) {
      if (S.francs >= 0) return;
      aSaisir(q).forEach(function (id) {
        if (S.francs >= 0 || !possede(id)) return;
        S.francs += Math.round(OBJET[id].prix * 0.5);
        vendus.push(OBJET[id].nom.charAt(0).toLowerCase() + OBJET[id].nom.slice(1));
        delete S.biens[id]; vue = coquille.biens(id, false);
      });
    });
    if (vendus.length) {
      attente.push({ titre: "L'huissier", sous: moisCourant(), texte: "Il a emporté " + liste(vendus) + "." + (S.francs < 0 ? " Il reste " + argent(-S.francs) + " à rembourser." : " La dette est soldée.") });
      if (S.francs >= 0) S.dette = 0;
      return;
    }
    if (S.francs < seuil) {
      attente.push({ titre: "Le tribunal de commerce", sous: moisCourant(), texte: "L'huissier est revenu les mains vides. Il manque " + argent(-S.francs) + ", et plus rien ne se vend.", banqueroute: true });
    } else {
      attente.push({ titre: "La banque", sous: moisCourant(), texte: "Le découvert dure : " + argent(-S.francs) + ". La banque ne relance plus par lettre ; elle passera." });
    }
  }
  var attente = [];
  function dormir(texteNuit) {
    // jusqu'au matin suivant ; la nuit peut être interrompue par un rendez-vous (ou un événement)
    var depart = S.semaine;
    S.eveil = 0;
    var garde = 0;
    do { S.tranche++; if (S.tranche > 4) { S.tranche = 0; nouveauJour(); } } while (S.tranche !== 0 && ++garde < 10);
    majHud(); sauver();
    var titre = JOUR_MOT[S.jour] + ", 7 h";
    // on se réveille chez soi : dans sa pièce, si elle en a une
    fonduTexte(titre, moisCourant(), texteNuit || "", function () {
      var chez = chezToi();
      if (aInterieur(chez) && S.lieu === chez) entrer(chez); else recaler();
    }, function () {
      // la Une de la semaine qui finit (s'il y en a une), les fondus en attente, puis ce qui est dû
      chapitreSiDu(function () { suiteFondus(function () { if (!echeance()) sceneDue(); }); });
    });
  }
  // les fondus en attente (la banque, l'huissier…), l'un après l'autre ;
  // `apres` : ce qui vient quand le dernier est fini (tout de suite, s'il n'y en a pas)
  function suiteFondus(apres) {
    if (!attente.length) { if (apres) apres(); return; }
    var a = attente.shift();
    // le tribunal de commerce : après son texte, l'écran de fin de la banqueroute
    fonduTexte(a.titre, a.sous, a.texte, null, a.banqueroute ? function () { attente = []; sauver(); coquille.banqueroute(); } : function () { suiteFondus(apres); });
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
    return (D.activites || []).filter(function (a) {
      return a.lieu === cle && !a.cache && (!a.roles || a.roles.indexOf(S.role) >= 0) && (!a.jours || a.jours.indexOf(JOURS[S.jour]) >= 0) && (!a.si || siVrai(a.si, cle));
    });
  }
  function pourquoiPas(a, lieuOuvert) {
    if (!lieuOuvert) return "Fermé à cette heure.";
    if (!ouvert(a)) return "Pas à cette heure-ci.";
    if (a.francs < 0 && S.francs + a.francs < 0) return "Pas assez d'argent.";
    if (a.max_jour && (S.jourFaits[a.id] || 0) >= a.max_jour) return "Déjà fait aujourd'hui.";
    if (a.tranches > 0 && S.tranche === 4 && !a.nuit) return "Il est trop tard.";
    return "";
  }
  function coutHtml(a) {
    var out = [];
    if (a.tranches > 0) out.push('<span>' + (a.tranches === 1 ? "1 tranche" : a.tranches + " tranches") + '</span>');
    if (a.nuit) out.push('<span>la nuit</span>');
    if (a.francs) out.push('<span class="' + (a.francs > 0 ? "up" : "dn") + '">' + (a.francs > 0 ? "+" : "") + argent(a.francs) + '</span>');
    // le mode histoire ne montre pas les jauges : l'activité ne les annonce plus
    var J = document.body.classList.contains("mode-histoire") ? {} : (a.jauges || {});
    Object.keys(J).sort().forEach(function (g) {
      var deja = S.faits[a.id] === S.semaine;
      out.push('<span class="j ' + (deja ? "" : J[g] > 0 ? "up" : "dn") + '">' + icone(g === "direction" ? "president" : g, 13) + (deja ? "·" : (J[g] > 0 ? "▲" : "▼")) + '</span>');
    });
    return out.join("");
  }
  var porteObjet = null;       // l'objet touché dont le panneau est ouvert (dedans)
  function ouvrirPorte(cle, fait, objet, trace) {
    var l = LIEU[cle];
    if (!l) return;
    porteOuverte = cle;
    if (objet !== undefined) porteObjet = objet || null;
    objet = porteObjet && dedans && dedans.cle === cle ? porteObjet : null;
    var def = TEXTE_LIEU[cle] || {};
    var lieuOuvert = ouvert(def) || (rdv && rdv.lieu === cle);
    var el = $("villePorte");
    el.classList.remove("v-mission");
    var vlc = $("villeLieu"); if (vlc) vlc.classList.remove("on");
    var acts = activitesIci(cle), toutes = acts, piece = !!(dedans && dedans.cle === cle), objPropre = false;
    // dedans, un objet touché : ce qu'on y fait ; s'il ne porte rien, ce qui se fait dans la pièce.
    // La pièce entière (le bouton « Ici ») : ce qui ne tient à aucun objet, ses objets, ce qui s'y vend.
    if (objet) {
      var aObj = acts.filter(function (a) { return a.objet === objet.id; });
      objPropre = aObj.length > 0;
      acts = objPropre ? aObj : acts.filter(function (a) { return !a.objet; });
    } else if (piece) acts = acts.filter(function (a) { return !a.objet || !dedans.m.objets.some(function (o) { return o.id === a.objet; }); });
    // ce qu'on voit en entrant : la première variante vraie (la vitrine qui
    // change, la plaque gravée…), sinon le texte du lieu
    var vu = (D.lieux_variantes || []).filter(function (v) { return v.lieu === cle && siVrai(v.si, cle); })[0];
    var texteLieu = vu ? remplir(vu.texte) : def.texte;
    var html = '<h2>' + esc(objet ? objet.label : nomLieu(l)) + '</h2>' +
      '<p class="v-sous">' + esc((objet ? nomLieu(l) + " · " : "") + JOUR_MOT[S.jour] + " · " + TRANCHE_MOT[TRANCHES[S.tranche]].toLowerCase()) + (lieuOuvert ? "" : " · fermé") + '</p>' +
      (texteLieu && !objet ? '<p class="v-texte">' + esc(texteLieu) + '</p>' : "") +
      '<p class="v-fait"' + (fait ? "" : " hidden") + '>' + esc(fait || "") + '</p>' +
      (trace ? '<p class="v-trace">' + esc(trace) + '</p>' : "");
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
    // ceux qui tiennent le lieu (la ville vivante) : leur parler, leur demander un service
    if (!objet || !objPropre) html += blocGens(cle);
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
    // dans la pièce entière : ses objets, chacun d'un geste (on y va, on voit ce qu'on y fait)
    var objetsPiece = piece && !objet ? dedans.m.objets.filter(function (o) { return toutes.some(function (a) { return a.objet === o.id; }); }) : [];
    if (objetsPiece.length) {
      html += '<h3 class="v-h">Dans la pièce</h3><div class="v-acts v-dans">';
      objetsPiece.forEach(function (o) { html += '<button type="button" class="v-act v-va" data-obj="' + esc(o.id) + '"><b>' + esc(o.label) + '</b><span class="cout">›</span></button>'; });
      html += '</div>';
    }
    // ce qui se vend ici (deux gestes pour acheter : on ne vide pas un compte d'un doigt)
    var objets = objet && objPropre ? [] : aVendreIci(cle);
    // un objet qui a ses propres gestes : le reste de la pièce est à un geste
    if (objet && objPropre) {
      var reste = toutes.filter(function (a) { return !a.objet; }).length + aVendreIci(cle).length + (dedans.m.objets.length > 1 ? 1 : 0);
      if (reste) html += '<button type="button" class="v-sortir v-reste">Le reste de la pièce ›</button>';
    }
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
    html += '<div class="v-pied"><button type="button" class="v-sortir v-att">Attendre ici</button><button type="button" class="v-sortir">' + (dedans ? "Fermer" : "Sortir") + '</button></div>';
    el.innerHTML = html;
    el.querySelector(".v-att").addEventListener("click", function () { attendre(); });
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
    brancherGens(el, cle);
    var br = el.querySelector(".v-reste");
    if (br) br.addEventListener("click", function () { ouvrirPorte(cle, null, null); });
    el.querySelectorAll(".v-va").forEach(function (b) {
      b.addEventListener("click", function () {
        var o = dedans && dedans.m.objets.filter(function (x) { return x.id === b.getAttribute("data-obj"); })[0];
        if (o) { fermerPorte(); allerObjet(o); }
      });
    });
    el.querySelector(".v-pied .v-sortir:not(.v-att)").addEventListener("click", fermerPorte);
  }
  function fermerPorte() {
    porteOuverte = null; porteObjet = null;
    var el = $("villePorte");
    if (el) el.classList.remove("on");
  }
  function faire(id) {
    var a = null;
    (D.activites || []).forEach(function (x) { if (x.id === id) a = x; });
    if (!a || carteOn || occupe) return;
    var cle = porteOuverte;
    if (pourquoiPas(a, true)) return;
    // un petit jeu : la mise d'abord, la partie, puis la suite
    if (a.jeu) {
      var objet0 = porteObjet;
      fermerPorte();
      // la scène d'avant la partie : une variante du texte (la partie dira la suite)
      jouerJeu(a.jeu, a, function (res) {
        if (!res) { if (cle) ouvrirPorte(cle, null, objet0); return; }
        porteObjet = objet0; porteOuverte = cle;
        finirActivite(a, cle, res);
      }, varianteDe(a));
      return;
    }
    finirActivite(a, cle, null);
  }
  // une variante du texte d'une activité, tour à tour (la première fois, la première)
  function varianteDe(a) {
    if (a.textes && a.textes.length) { S.variantes = S.variantes || {}; var iv = S.variantes[a.id] = ((S.variantes[a.id] == null ? -1 : S.variantes[a.id]) + 1) % a.textes.length; return remplir(a.textes[iv]); }
    return remplir(a.texte || "");
  }
  function finirActivite(a, cle, res) {
    var mise = a.francs || 0, gain = 0;
    // les jeux d'argent paient la mise : le 421 selon la combinaison, les cartes au double
    if (res && res.gagne && mise < 0 && (a.jeu === "des" || a.jeu === "cartes")) gain = Math.round(-mise * (a.jeu === "des" ? res.score : 2));
    S.francs += mise + gain;
    S.jourFaits[a.id] = (S.jourFaits[a.id] || 0) + 1;
    // une variante du texte, tour à tour ; après un jeu, ce que la partie a donné
    var texte = res ? res.phrase + (gain ? " (+" + argent(gain) + ")" : "") : varianteDe(a);
    if (a.special) {
      var sp = faireSpecial(a, cle, texte);
      if (sp === true) { majHud(); sauver(); return; }
      if (typeof sp === "string") texte = texte + " " + sp;
    }
    // les jauges et l'effet propre, une fois par semaine (une partie perdue ne compte pas) ; le lien
    // et l'habitude, à chaque geste : la ville vivante (docs/histoires/ville_vivante.md)
    var compte = (a.jauges || a.effets) && (!res || res.gagne) && S.faits[a.id] !== S.semaine, trace = null;
    if (compte || a.avec || a.habitude) {
      if (compte) S.faits[a.id] = S.semaine;
      var avantGeste = vue;
      vue = coquille.activite(a.id, !compte);
      pont(vue);
      if (vue.over) return;
      trace = traceGeste(a, avantGeste);
      annoncerVivant(avantGeste, vue);
    }
    if (a.nuit) { fermerPorte(); dormir(); return; }
    var ok = avancer(a.tranches || 0);
    majHud(); sauver();
    if (ok && !carteOn && !occupe && cle) ouvrirPorte(cle, texte, undefined, trace);
    else toast(trace ? texte + " " + trace : texte);
  }

  // ─────────────────────────────────────────────────────────────── le HUD
  var CHARS = {};
  function nomDe(id) { var c = CHARS[id]; return c ? c.name : id; }
  // la musique suit la ville : le jour, le soir, le stade (la coquille choisit le thème) ;
  // le lieu aussi, hors carte : la pièce où l'on est, sinon la rue (une carte a le sien)
  function sonVille() {
    if (!coquille) return;
    if (coquille.sonTheme) coquille.sonTheme();
    if (!carteOn && coquille.ambiance) coquille.ambiance(dedans ? dedans.m.ambiance : null);
  }
  function majHud() {
    var h = $("villeHud");
    if (!h || !S) return;
    sonVille();
    majQuartiers();
    h.querySelector(".v-temps b").textContent = JOUR_MOT[S.jour] + " · " + TRANCHE_MOT[TRANCHES[S.tranche]];
    h.querySelector(".v-temps span").textContent = "Sem. " + S.semaine + " · " + moisCourant();
    var fr = h.querySelector(".v-francs");
    fr.textContent = argent(S.francs); fr.classList.toggle("bas", S.francs < 100);
    var hb = $("villeBas"), r = hb.querySelector(".v-rdv");
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
    var mh = hb.querySelector(".v-mi-hud"), sm = S.mission, m = sm && MISSION[sm.id];
    if (m && !sm.offre && LIEU[sm.lieu]) {
      mh.innerHTML = "<b>" + esc(m.titre) + "</b> · " + esc(nomLieu(LIEU[sm.lieu])) + (sm.tranches && sm.tranches.length ? ", " + esc(sm.tranches.map(function (t) { return TRANCHE_MOT[t].toLowerCase(); }).join(" ou ")) : "") + " · avant " + esc(quand(sm.jusqua));
      mh.hidden = false;
    } else mh.hidden = true;
    var bt = $("villeAttendre");
    if (bt) bt.disabled = carteOn || occupe;
    rappelEcrire();
  }

  // ─────────────────────────────────────────────────────────────── le plan
  // Le plan : la ville vue de loin (plan.webp, le rendu du jour réduit au tiers),
  // les quartiers, un point par lieu, où tu es, où l'on t'attend. Toucher un
  // point dit son nom et ouvre le chemin ; la liste suit, quartier par quartier.
  var QUARTIERS = [["residentiel", "La rue des Lilas", "Rue des Lilas"], ["stade", "Le carrefour du stade", "Le stade"], ["sport", "Le terrain annexe", "Terrain annexe"],
    ["sante", "Le quartier de la santé", "La santé"], ["vieilleville", "La vieille ville, de l'autre côté de la Rive", "Vieille ville"],
    ["cimetiere", "Le cimetière", "Le cimetière"], ["friche", "La friche", "La friche"]];
  var PLAN_ECHELLE = 1 / 3;
  function surPlan(x, y) {
    var PP = dedans ? dedans.ville.P : P, z = dedans ? dedans.ville.ZSOL : ZSOL;
    return [Math.round((2 * (x - y) - PP.cu) * PLAN_ECHELLE), Math.round((x + y - 2 * z - PP.cv) * PLAN_ECHELLE)];
  }
  function cartePlan() {
    var PP = dedans ? dedans.ville.P : P;
    var W0 = Math.round(PP.w * PLAN_ECHELLE), H0 = Math.round(PP.h * PLAN_ECHELLE);
    var html = '<div class="v-carte" id="villeCarte"><div class="v-carte-in' + (S.tranche >= 3 ? " nuit" : "") + '" style="width:' + W0 + 'px;height:' + H0 + 'px">' +
      '<img src="' + BASE + 'plan.webp" alt="Le plan d\'Aubérive" width="' + W0 + '" height="' + H0 + '" draggable="false">' + planBrumes(W0, H0);
    QUARTIERS.forEach(function (q) {
      var n = 0, sx = 0, sy = 0;
      L.places.forEach(function (l) { if (l.door && l.district === q[0]) { var p = surPlan.apply(null, centre(l.door)); sx += p[0]; sy += p[1]; n++; } });
      if (n) html += '<span class="v-q" style="left:' + Math.round(sx / n) + 'px;top:' + Math.round(sy / n - 34) + 'px">' + esc(q[2]) + '</span>';
    });
    var ici = rdvVisible() && LIEU[rdv.lieu] ? rdv.lieu : null;
    L.places.forEach(function (l) {
      if (!l.door || !TEXTE_LIEU[l.key] || lieuFerme(l.key)) return;
      var p = surPlan.apply(null, centre(l.door)), r = l.key === ici;
      html += '<button type="button" class="v-pt' + (r ? " rdv" : "") + (ouvert(TEXTE_LIEU[l.key]) ? "" : " ferme") + '" data-l="' + esc(l.key) + '" style="left:' + p[0] + 'px;top:' + p[1] + 'px" aria-label="' + esc(nomLieu(l)) + '"><i></i>' +
        (r ? '<span>' + esc(nomLieu(l)) + '</span>' : "") + '</button>';
    });
    var h = surPlan.apply(null, posVille());
    html += '<span class="v-moi" style="left:' + h[0] + 'px;top:' + h[1] + 'px"><i></i><span>Toi</span></span>';
    html += '</div></div><div class="v-carte-note" id="villeCarteNote"><span>Touche un point : son nom, et le chemin.</span></div>';
    return html;
  }
  function brancherPlan() {
    var boite = $("villeCarte");
    if (!boite) return;
    var h = surPlan.apply(null, posVille());
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
        var pv = posVille(), cz = dedans ? dedans.ville.CELL : CELL, hc0 = [Math.floor(pv[0] / cz), Math.floor(pv[1] / cz)];
        var loin = Math.abs(l.door[0] - hc0[0]) + Math.abs(l.door[1] - hc0[1]) > 40;
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
    // le fondu court du trajet (ville_rythme.js) : l'hélicoptère ne doit pas être plus lent qu'un
    // « Y aller » ; il garde sa phrase, en bandeau, à l'arrivée
    fonduCourt(function () {
      var c = centre(l.door); poserEnVille(c[0], c[1]);
      var p = visee(); cam.x = p[0]; cam.y = p[1]; cam.libre = false;
      recaler();
    }, function () { occupe = false; toast("L'hélicoptère se pose. Le pilote ne pose pas de questions."); arriver(cle); });
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
  // attendre : le temps passe jusqu'à ce qu'il arrive quelque chose — une
  // scène, quelqu'un qui vient te chercher, le rendez-vous qui s'ouvre, l'heure
  // d'une mission ; la nuit tombée, on rentre dormir. Retour client : « on passe
  // une grande partie de son temps à passer des demi-journées, il n'y a rien à
  // faire entre les dialogues qui arrivent plusieurs jours plus tard » — une
  // tranche par geste, c'était trois gestes vides en moyenne entre deux choses ;
  // puis une chaîne de fondus (une nuit, une paie, un fondu par tranche : treize
  // secondes par « Attendre », mesuré en jouant l'histoire 4). Désormais un seul
  // fondu court, l'heure qui défile dessous (ville_rythme.js, `laisserPasser`).
  // Et le panneau du lieu ne se rouvre plus tout seul après l'attente : il
  // couvrait le bouton, on ne pouvait plus passer.
  function aLaPorte(cle) {
    if (dedans) return dedans.cle === cle;
    var l = LIEU[cle];
    if (!l || !l.door) return false;
    var c = caseDe(heros.x, heros.y);
    return Math.abs(c[0] - l.door[0]) + Math.abs(c[1] - l.door[1]) <= 1;
  }
  function missionOuverte() {
    var sm = S.mission;
    return !!(sm && !sm.offre && MISSION[sm.id] && missionIci(sm.lieu));
  }
  function attendre() { laisserPasser(); }

  // ─────────────────────────────────────────────────────────────── la sauvegarde
  // UNE CASE PAR LIVRE (`fusible.ville.v2.<id du postulat>`) : commencer un livre n'écrase jamais la
  // carrière d'un autre, et une carrière finie libère sa case. Seul le même livre recommencé efface sa
  // case, et l'accueil le demande d'abord (preview_template.html : Reprendre, ou Recommencer en deux
  // gestes). Le contenu d'une case est celui de l'ancienne case unique, inchangé.
  var sauveFinie = false;        // la carrière en cours est finie : aucune case ne se réécrit sous elle
  var sauveAvertie = false;      // l'appareil est plein : on l'a déjà dit
  var sauveMigree = false;
  function idLivre(index) {
    var ps = (window.FusibleApercu && window.FusibleApercu.postulats) || [];
    for (var i = 0; i < ps.length; i++) if (ps[i].index === index) return ps[i].id;
    return null;
  }
  function titreLivre(id) {
    var ps = (window.FusibleApercu && window.FusibleApercu.postulats) || [];
    for (var i = 0; i < ps.length; i++) if (ps[i].id === id) return ps[i].title || id;
    return id;
  }
  function lireCase(id) {
    try { var s = JSON.parse(localStorage.getItem(CLE_CASE + id) || "null"); return s && s.v === 1 && s.moteur ? s : null; } catch (e) { return null; }
  }
  // L'ancienne case unique va dans celle de son livre (`graine.postulat` en dit l'index), sans écraser
  // une partie plus récente de ce livre ; elle ne disparaît qu'une fois la copie faite. Un livre
  // inconnu ou une case illisible : on n'y touche pas, rien ne se perd.
  function migrerSauve() {
    if (sauveMigree || !(window.FusibleApercu && window.FusibleApercu.postulats)) return;
    sauveMigree = true;
    try {
      var brut = localStorage.getItem(CLE_SAUVE);
      if (!brut) return;
      var s = JSON.parse(brut), id = s && s.v === 1 && s.moteur ? idLivre(s.graine && s.graine.postulat) : null;
      if (!id) return;
      var la = lireCase(id);
      if (!la || (la.quand || 0) < (s.quand || 0)) localStorage.setItem(CLE_CASE + id, brut);
      localStorage.removeItem(CLE_SAUVE);
    } catch (e) {}
  }
  // les cases pleines, la plus récente d'abord : [{ id, s }]
  function toutesSauves() {
    migrerSauve();
    var ps = (window.FusibleApercu && window.FusibleApercu.postulats) || [], out = [];
    ps.forEach(function (p) { var s = lireCase(p.id); if (s) out.push({ id: p.id, s: s }); });
    out.sort(function (a, b) { return (b.s.quand || 0) - (a.s.quand || 0); });
    return out;
  }
  function sauver() {
    if (!S || !coquille || sauveFinie) return;
    migrerSauve();
    var g = coquille.graine(), id = idLivre(g.postulat);
    if (!id) return;
    try {
      localStorage.setItem(CLE_CASE + id, JSON.stringify({ v: 1, moteur: coquille.sauver(), ville: S, rdv: rdv, graine: g, quand: Date.now() }));
    } catch (e) {
      // le navigateur refuse d'écrire (mémoire pleine, navigation privée) : la case des autres livres ne se
      // touche pas, et on le dit une fois
      if (!sauveAvertie) { sauveAvertie = true; toast("Sauvegarde impossible : le navigateur refuse (mémoire pleine ou navigation privée)."); }
    }
  }
  // la case d'un livre (par défaut, celui de la carrière en cours)
  function effacerSauve(id) {
    try {
      if (!id && coquille) id = idLivre(coquille.graine().postulat);
      if (id) localStorage.removeItem(CLE_CASE + id);
    } catch (e) {}
  }

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
      if (dedans) { toucherDedans(u, v); return; }
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
      '<div class="v-corps"><div class="v-argent"><div class="v-francs"></div><span class="v-gain" aria-live="polite"></span></div></div>';
    var rail = $("rail");
    rail.parentNode.insertBefore(hud, rail.nextSibling);
    var espace = document.createElement("div"); espace.className = "v-espace";
    // le rendez-vous et la mission en cours, au-dessus du bouton qui y mène
    var basHud = document.createElement("div"); basHud.className = "v-bas"; basHud.id = "villeBas";
    basHud.innerHTML = '<p class="v-rdv" hidden></p><p class="v-rdv v-mi-hud" hidden></p>';
    var actions = document.createElement("div"); actions.className = "v-actions";
    actions.innerHTML = '<button type="button" id="villePlan">' + icone("carte", 15) + 'Plan</button>' +
      '<button type="button" id="villeAttendre">' + icone("horloge", 15) + 'Attendre</button>' +
      '<button type="button" id="villeBiens">' + icone("carnet", 15) + 'Carnet</button>' +
      '<button type="button" id="villeRdv">' + icone("fleche", 15) + 'Y aller</button>' +
      '<button type="button" id="villeIci">' + icone("caisse", 15) + 'Ici</button>' +
      '<button type="button" id="villeSortir">' + icone("fleche", 15) + 'Sortir</button>';
    var bandeau = $("bandeau");
    gs.insertBefore(espace, bandeau);
    gs.insertBefore(basHud, bandeau);
    gs.insertBefore(actions, bandeau);
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(function () { mesurerUI(); });
      [hud, basHud, actions, bandeau, rail].forEach(function (e) { ro.observe(e); });
    }
    var porte = document.createElement("div"); porte.className = "v-porte"; porte.id = "villePorte"; porte.setAttribute("role", "dialog"); porte.setAttribute("aria-label", "Le lieu");
    document.body.appendChild(porte);
    var fondu = document.createElement("div"); fondu.className = "v-fondu"; fondu.id = "villeFondu"; fondu.setAttribute("aria-live", "polite");
    fondu.innerHTML = '<b></b><span></span><p hidden></p>';
    document.body.appendChild(fondu);
    var t = document.createElement("div"); t.className = "v-toast"; t.id = "villeToast"; t.setAttribute("role", "status");
    document.body.appendChild(t);
    // dedans : le nom du lieu et ce qu'on y voit, le temps d'entrer
    var vl = document.createElement("div"); vl.className = "v-cartouche"; vl.id = "villeLieu"; vl.setAttribute("aria-live", "polite");
    vl.innerHTML = "<b></b><span></span>";
    document.body.appendChild(vl);
    // le match : le tableau, la phrase de l'action, le résultat
    var vm = document.createElement("div"); vm.className = "v-match"; vm.id = "villeMatch"; vm.hidden = true;
    vm.innerHTML = '<div class="v-match-tableau" aria-live="polite"><b class="dom"></b><span class="sc">0 – 0</span><b class="ext"></b><i class="mn"></i></div>' +
      '<button type="button" class="v-match-passer">Passer ›</button><p class="v-match-legende" role="status" hidden></p>' +
      '<div class="fin" role="dialog" aria-label="Le résultat" hidden><span class="v-match-sur">Fin du match</span><div class="v-match-score"><b class="d"></b><span class="s"></span><b class="e"></b></div><p class="v-match-sifflet"></p><ul></ul>' +
      '<div class="v-match-bloc"></div><p class="v-match-pts"></p><button type="button" class="v-match-quitter">Quitter le stade</button></div>';
    document.body.appendChild(vm);
    // (le samedi en direct : « Passer » mène d'abord à la prochaine décision)
    vm.querySelector(".v-match-passer").addEventListener("click", function () { if (MATCH && MATCH.phase !== "fin" && !(MATCH.direct && directPasser())) finirMatch(); });
    vm.querySelector(".v-match-quitter").addEventListener("click", quitterStade);
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
    $("villeAttendre").addEventListener("click", function () { attendre(); });
    $("villeSortir").addEventListener("click", function () { if (dedans && !carteOn && !occupe) allerSortir(); });
    $("villeIci").addEventListener("click", function () { if (dedans && !carteOn && !occupe) ouvrirPorte(dedans.cle, null, null); });
    $("villeBiens").addEventListener("click", function () { if (!carteOn && !occupe) ouvrirCarnet(); });
    $("villeRdv").addEventListener("click", function () {
      if (rdv && LIEU[rdv.lieu] && !rdv.sombre) { if (tNow() < rdv.debut) avancerJusquA(rdv.debut); else allerAuLieu(rdv.lieu); }
      // on viendra te trouver là où tu es (le prologue du livre 9, dans la rue) : il n'y a nulle
      // part où marcher, y aller c'est attendre — « personne ne t'attend » était faux
      else if (rdv && !rdv.sombre && (rdv.lieu === "rue" || rdv.lieu === "ici") && (rdv.force === "vient" || rdv.force === "rue")) attendre();
      else toast("Personne ne t'attend. La ville est à toi.");
    });
    taille();
    brancherEntrees();
  }
  // le temps file jusqu'au rendez-vous, d'un seul fondu, et te voilà à sa porte (s'il arrive
  // quelque chose avant, cela prend la main : ville_rythme.js, `laisserPasser`)
  function avancerJusquA(t) { laisserPasser({ jusqua: t, vers: rdv && !rdv.sombre && LIEU[rdv.lieu] ? rdv.lieu : null }); }

  function chargerJson(nom) {
    return fetch(BASE + nom).then(function (r) { if (!r.ok) throw new Error(nom + " : " + r.status); return r.json(); });
  }
  var pret = false, enAttente = null;
  function charger() {
    return Promise.all([chargerJson("lieux.json"), chargerJson("grille.json"), chargerJson("sprites.json"),
      chargerJson("interieurs.json").catch(function () { return { pieces: {} }; })]).then(function (r) {
      INT = (r[3] && r[3].pieces) || {};
      L = r[0]; P = L.projection || P; ZSOL = 2 + (P.zl || 10);
      COLS = Math.ceil(P.w / TUILE); RANGS = Math.ceil(P.h / TUILE);
      L.places.forEach(function (l) { LIEU[l.key] = l; });
      initMonde(L);
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
  // « Reprendre », au-dessus du nom : la carrière la plus récente, tous livres confondus (chaque
  // cartouche de l'accueil porte aussi la sienne : `sauves()`, `reprendreLivre()`)
  function boutonReprendre() {
    var l = toutesSauves(), old = $("villeReprendre");
    if (old) old.parentNode.removeChild(old);
    if (!l.length) return;
    var s = l[0].s, v = s.ville || {};
    var b = document.createElement("button");
    b.type = "button"; b.className = "v-reprendre"; b.id = "villeReprendre";
    b.innerHTML = '<b>Reprendre</b><span>' + esc((v.nom ? v.nom + " · " : "") + (JOUR_MOT[v.jour] || "") + ", semaine " + (v.semaine || 1)) + '</span><span>' + esc(titreLivre(l[0].id)) + '</span>';
    b.addEventListener("click", function () { reprendre(s); });
    var ident = $("nameForm");
    ident.parentNode.insertBefore(b, ident);
    // le livre de la partie se décompresse d'avance, une fois l'accueil posé (demarrage.js)
    if (window.FusibleContenu) window.FusibleContenu.prechauffer(s.graine && s.graine.postulat, 1200);
  }
  var repriseEnCours = false;
  function reprendre(s) {
    // le livre de la partie d'abord : il rejoint le commun et le moteur le relit (demarrage.js)
    var FC = window.FusibleContenu, livre = s.graine && s.graine.postulat;
    if (FC && !FC.charge(livre)) {
      if (repriseEnCours) return;
      repriseEnCours = true;
      FC.livre(livre).then(function () { repriseEnCours = false; reprendre(s); },
        function () {
          repriseEnCours = false;
          if (coquille && coquille.panneau) coquille.panneau("Pas de réseau", '<p class="note">Le livre de cette partie n\'est pas arrivé jusqu\'ici. Vérifie la connexion, puis touche « Reprendre » de nouveau.</p>');
        });
      return;
    }
    var faire = function () {
      sauveFinie = false;
      S = s.ville; rdv = s.rdv || null;
      S.vus = S.vus || {}; S.faits = S.faits || {}; S.jourFaits = S.jourFaits || {};
      S.biens = S.biens || {}; S.sale = S.sale || 0; S.pont = S.pont || {}; S.missionsFaites = S.missionsFaites || {};
      S.offres = S.offres || {}; S.dits = S.dits || {}; if (S.derniereOffre == null) S.derniereOffre = -99;
      S.scenesVues = S.scenesVues || {};
      // une partie sauvée avant le Grand Aubérive : la ville a glissé de (O, O) dans le monde
      if (MONDE && MONDE.O && !S.grand) { S.x += MONDE.O; S.y += MONDE.O; S.grand = 1; }
      annonces = [];
      dernierVu = rdv ? rdv.cle : "";
      FERMES = {}; BLOQUE = null; majQuartiers(false);
      lancer();
      poser(S.x, S.y);
      var p = visee(); cam.x = p[0]; cam.y = p[1];
      vue = coquille.reprendre(s.moteur, s.graine && s.graine.postulat, s.graine && s.graine.seed);
      if (S.blocsVus == null) S.blocsVus = (vue && vue.blocs) || 0;
      annoncerVille("reprise", s);
      acteurs = {};
      recaler();
      // on était dans une pièce : on y est encore
      var piece = S.dedans; S.dedans = null;
      if (piece && aInterieur(piece) && !(vue && vue.over)) entrer(piece);
      // la carte qui se joue là où l'on est (loin d'Aubérive, une alarme) : tout de suite
      if (vue && !vue.over && rdv && rdv.force === "ici" && !carteOn) montrerCarte();
    };
    if (pret) faire(); else enAttente = faire;
  }

  function lancer() {
    actif = true;
    cv.hidden = false; $("villeCouche").hidden = false;
    taille();
    requestAnimationFrame(image);
  }

  /*__VILLE_MODULES__*/

  // ─── le contenu : le commun au démarrage, puis commun + le livre de la carrière
  // (demarrage.js, window.FusibleContenu, le même objet) ; les index se refont à
  // chaque fusion — les scènes, les missions, la carte du retour viennent du livre
  function indexerContenu() {
    var content = null;
    try {
      content = window.FusibleContenu ? window.FusibleContenu.contenu() : JSON.parse(document.getElementById("fusible-content").textContent);
      D = content.ville || {};
      (content.characters || []).forEach(function (c) { CHARS[c.id] = c; });
      PORTRAITS = content.portraits || {};
    } catch (e) { D = {}; }
    [TEXTE_LIEU, OBJET, MISSION, SCENE, RETOUR].forEach(function (t) { for (var k in t) delete t[k]; });
    (D.lieux || []).forEach(function (l) { TEXTE_LIEU[l.key] = l; });
    (D.objets || []).forEach(function (o) { OBJET[o.id] = o; });
    (D.missions || []).forEach(function (m) { MISSION[m.id] = m; });
    (D.scenes || []).forEach(function (sc) { SCENE[sc.id] = sc; });
    // une scène jouée de la semaine se programme comme une scène (le plan du jour la tire)
    (D.cinematiques || []).forEach(function (c) {
      if (c.quand !== "semaine") return;
      SCENE["ci:" + c.id] = { id: "ci:" + c.id, titre: c.titre || "", lieu: c.lieu === "ici" ? "rue" : c.lieu, tranches: c.tranches || ["matin", "midi", "aprem"], jours: c.jours, roles: c.roles, si: c.si, poids: c.poids || 1, cine: c };
    });
    // la carte du retour d'un voyage : elle lève le drapeau de `loin` sur ses deux choix
    var Lo = D.loin || {};
    ((content && content.cards) || []).forEach(function (c) {
      var g = (c.left && c.left.effects && c.left.effects.clear) || [], d = (c.right && c.right.effects && c.right.effects.clear) || [];
      for (var f in Lo) if (g.indexOf(f) >= 0 && d.indexOf(f) >= 0) RETOUR[c.id] = f;
    });
  }

  // ─────────────────────────────────────────────────────────────── l'API (la coquille appelle)
  window.FusibleVille = {
    noms: { ville: "Aubérive", club: "Racing Aubérive" },
    // la coquille est prête : on construit la couche et on charge les images
    pret: function () {
      coquille = window.FusibleCoquille;
      indexerContenu();
      if (window.FusibleContenu) window.FusibleContenu.apresFusion(indexerContenu);
      construire();
      charger();
      boutonReprendre();
    },
    // une carrière commence (avant la première vue)
    debut: function (v) {
      var faire = function () {
        sauveFinie = false;
        S = {
          v: 1, nom: (v.entities && v.entities.protagonist) || "", role: v.role,
          // en poche au départ : une semaine de la paie du rôle (le promu n'a pas un sou, son entraîneur si)
          semaine: 1, jour: 0, tranche: 0, eveil: 0, dette: 0,
          francs: Math.max(1240, (SALAIRE[v.role] || SALAIRE.entraineur)[clamp((v.division || 1) - 1, 0, 2)]),
          x: 0, y: 0, lieu: domicileDe(v.role, v.flags), cartesSemaine: 0, faits: {}, jourFaits: {}, vus: {},
          journeeDebut: v.journee || 0, auMatch: false, zoom: 0,
          biens: {}, sale: 0, pont: {}, mission: null, missionsFaites: {}, offres: {}, derniereOffre: -99, dits: {},
          blocsVus: v.blocs || 0, panneau: null, scenesVues: {}, scenesJour: null, grand: MONDE ? 1 : 0, quartiers: {}
        };
        annonces = [];
        FERMES = {}; BLOQUE = null; vue = v; majQuartiers(false);
        if (dedans) aDehors(true);
        rdv = null; dernierVu = ""; figurants = []; passants = []; acteurs = {};
        lancer();
        var c = centre(LIEU[S.lieu].door); poser(c[0], c[1]);
        var p = visee(); cam.x = p[0]; cam.y = p[1];
        recaler();
        // l'introduction de l'histoire (une scène jouée, `quand: debut`) remplace l'arrivée en ville
        vue = v;
        annoncerVille("debut", v);
        var intro = cineIntro();
        if (intro) { jouerCine(intro, ouvrirSurUneCarte); return; }
        var club = (v.entities && v.entities.club) || "club", leClub = (/^[AEIOUYÉÈÊaeiouyéèê]/.test(club) ? "L'" : "Le ") + club;
        var accueil = S.lieu === "hotel" ? "L'hôtel de la Rive, une chambre sur le quai. La Fédération paie la note ; elle la relira." :
          "Deux pièces au troisième, rue des Lilas. " + leClub + " t'attend. La ville aussi.";
        fonduTexte((v.entities && v.entities.ville ? v.entities.ville : "Aubérive"), moisCourant(), accueil, null, ouvrirSurUneCarte);
      };
      if (pret) faire(); else enAttente = faire;
    },
    // une nouvelle vue du moteur : après un choix, une activité, une reprise
    vue: function (v) {
      var go = function () {
        if (!S) return;
        var precedente = vue && vue.card ? vue.card.id : null;
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
        // ce que le choix a produit se lit en haut de la carte suivante quand elle s'enchaîne ;
        // en bas de la ville seulement quand on y revient (les deux à la fois : le doublon signalé)
        var reponse = v.lastAnswer && avant ? v.lastAnswer : null;
        dernierVu = cle;
        figurants = figurants.filter(function () { return false; });
        var etait = rdv;
        // le départ (un drapeau de `loin` vient d'être posé) et le retour (il est
        // levé, ou la carte du retour arrive)
        var lo = loinDe(v), estRetour = !!(v.card && RETOUR[v.card.id]), depart = null, retour = null;
        if (S.loin && (!lo || estRetour)) {
          retour = ((D.loin || {})[S.loin] || {}).retour || "";
          S.loin = null;
          retour = [retour, rentrerDeVoyage()].filter(Boolean).join(" ");
        } else if (!S.loin && lo && !estRetour) {
          S.loin = lo.flag;
          depart = (D.ailleurs || {})[lo.decor] || (D.ailleurs || {}).defaut || { titre: "Loin d'Aubérive", sous: "" };
        }
        rdv = planifier(v);
        if (depart || retour !== null) {
          // un fondu : la carte d'avant reste sous le noir, aucune touche ne répond
          carteOn = false; occupe = true; S.auMatch = false;
          if (v.blocs != null) S.blocsVus = Math.max(S.blocsVus || 0, v.blocs);
          if (depart) {
            fonduTexte(depart.titre, depart.sous, "", function () { decorAilleurs(v); }, function () { occupe = false; montrerCarte(); });
          } else {
            fonduTexte("De retour à " + ((v.entities && v.entities.ville) || "Aubérive"), moisCourant(), retour, function () {
              cacherCarte();
              if (aInterieur(S.lieu)) entrer(S.lieu);
              else { var c0 = centre(LIEU[S.lieu].door); poserEnVille(c0[0], c0[1]); }
              var p0 = visee(); cam.x = p0[0]; cam.y = p0[1]; cam.libre = false;
              recaler(); majHud();
            }, function () { occupe = false; suite(false, reponse); });
          }
          sauver();
          return;
        }
        // le bloc vient d'être joué : la ville met le match en scène, puis le soir tombe
        if (etait && etait.type === "match" && etait.beat === "match" && v.resultats && (v.blocs || 0) > (S.blocsVus || 0) && (D.match && D.match.textes)) {
          S.blocsVus = v.blocs || 0;
          cacherCarte();
          majHud();
          jouerMatch(v, function () { S.auMatch = false; if (S.tranche < 3) S.tranche = 3; majHud(); sauver(); suite(false); });
          return;
        }
        if (v.blocs != null) S.blocsVus = Math.max(S.blocsVus || 0, v.blocs);
        // le match prend l'après-midi ; on rentre au vestiaire, puis le soir tombe
        if (etait && etait.type === "match" && rdv.type !== "match") { S.auMatch = false; if (S.tranche < 3) S.tranche = 3; }
        // une scène jouée suit la carte qu'on vient de jouer, ou le drapeau qu'elle a posé
        var capres = !v.over ? (cineDeCarte(precedente, "apres") || cineDeDrapeau()) : null;
        if (capres) {
          if (carteOn) { cacherCarte(); }
          jouerCine(capres, function () { suite(false, reponse); });
          return;
        }
        suite(avant, reponse);
      };
      // la suite d'une vue : la carte d'après est-elle pour tout de suite ?
      var suite = function (avant, reponse) {
        var t = tNow();
        if (rdv.force === "ici" || (rdv.lieu === S.lieu && t >= rdv.debut && rdv.force !== "rue" && !rdv.sombre) || (rdv.force === "scene" && t >= rdv.fin && rdv.type !== "sombre" && rdv.lieu === S.lieu)) {
          if (avant && vue && vue.card && cineDeCarte(vue.card.id, "avant")) { cacherCarte(); montrerCarte(); return; }
          if (avant) { decorAilleurs(v); if (coquille) coquille.carte(); carteOn = true; if (rdv.qui) S.vus[rdv.qui] = 1; rdv.montree = true; majHud(); sauver(); return; }
          montrerCarte();
          return;
        }
        cacherCarte();
        majHud();
        sauver();
        if (reponse) setTimeout(function () { if (!carteOn && !CINE) toast(reponse); }, 380);
        // l'échéance a peut-être déjà sonné (un événement du soir, quand il fait déjà nuit)
        setTimeout(function () { suiteFondus(); annoncer(); if (!echeance() && rdv.force === "rue") verifierRue(); }, 600);
      };
      if (pret) go(); else enAttente = go;
    },
    carteVisible: function () { return carteOn; },
    // le samedi en direct (ville_direct.js) : la coquille propose le choix de posture du
    // samedi ; true, la ville le garde et joue le match (le moteur l'aura avec les décisions)
    retenir: function (droite) { return typeof directRetenir === "function" && directRetenir(droite); },
    // pour les essais : ce que le moteur retient de la ville vivante
    _vivant: function () {
      var v = vue || {}, out = { rel: {}, vars: {}, flags: (v.flags || []).filter(function (f) { return /^(rep|tuyau|service|dette)_/.test(f); }) };
      Object.keys(v.vars || {}).forEach(function (k2) { if (/^(lien|hab)_/.test(k2)) out.vars[k2] = v.vars[k2]; });
      Object.keys(v.relations || {}).forEach(function (k2) { if (v.relations[k2]) out.rel[k2] = v.relations[k2]; });
      out.ici = gensDuLieu(dedans ? dedans.cle : S.lieu).map(function (g) { return g.id; });
      return out;
    },
    // pour les essais automatiques : qui est où (et marche-t-il dans un mur ?)
    _debug: function () {
      var out = [];
      function add(q, t) {
        var c = caseDe(q.x, q.y), porte = (q.dedansDep && q.i === 0) || (q.dedansArr && q.chemin && q.i >= q.chemin.length - 2);
        out.push({ uid: q.uid, t: t, sp: q.sp, x: +q.x.toFixed(1), y: +q.y.toFixed(1), a: q.alpha == null ? 1 : +q.alpha.toFixed(2),
          ecran: aLEcran(q.x, q.y, -8), loin: !aLEcran(q.x, q.y, -40), mur: !porte && !marchable(c[0], c[1]), porte: !!porte, etat: q.etat || "", pose: q.pose || null, geste: q.geste || null, parle: !!q.parle, emote: q.emote ? q.emote.k : null });
      }
      passants.forEach(function (q) { add(q, "p"); });
      Object.keys(acteurs).forEach(function (id) { add(acteurs[id], "a:" + id); });
      figurants.forEach(function (q) { add(q, "f:" + (q.qui || q.sp)); });
      TABLEAUX.forEach(function (q) { add(q, "t:" + q.tableau); });
      return { gens: out, heros: [heros.x, heros.y], tranche: S && S.tranche, bulle: bulle ? { nom: bulle.nom, texte: bulle.texte } : null, carte: carteOn, occupe: occupe,
        cine: CINE ? { id: CINE.c.id, etape: CINE.i, lieu: CINE.c.lieu } : null, conv: CONV ? { id: CONV.cv.id, i: CONV.i } : null,
        genre: vue ? [vue.genre, vue.entities && vue.entities.genre, vue.entities && vue.entities.prenom] : null,
        dedans: dedans ? { cle: dedans.cle, objets: dedans.m.objets.map(function (o) { return o.id; }), porte: dedans.m.porte } : null, ui: [UI.haut, UI.bas, VW, VH, k] };
    },
    // pour les essais : de l'argent, une mission offerte ici et maintenant
    _essai: function (quoi, val) {
      if (!S) return null;
      if (quoi === "francs") { S.francs += val; majHud(); }
      if (quoi === "mission" && MISSION[val]) {
        var m = MISSION[val];
        S.mission = { id: m.id, etape: m.etapes[0].id, offre: true, lieu: m.donneur.lieu, jusqua: tNow() + 10 };
      }
      if (quoi === "aller" && LIEU[val]) { var c = centre(LIEU[val].door); poserEnVille(c[0], c[1]); var p = visee(); cam.x = p[0]; cam.y = p[1]; recaler(); arriver(val); }
      if (quoi === "match" && vue && !MATCH) {
        var v2 = {}, kk;
        for (kk in vue) v2[kk] = vue[kk];
        v2.resultats = val || "V N V D V V"; v2.blocs = (vue.blocs || 0) + 1;
        cacherCarte();
        jouerMatch(v2, function () { if (S.tranche < 3) S.tranche = 3; majHud(); });
      }
      if (quoi === "scene" && SCENE[val] && !carteOn && !occupe) jouerScene(SCENE[val]);
      if (quoi === "tranche" && TRANCHES.indexOf(val) >= 0) { S.tranche = TRANCHES.indexOf(val); majHud(); if (dedans) occuper(); }
      if (quoi === "jour" && JOURS.indexOf(val) >= 0) { S.jour = JOURS.indexOf(val); majHud(); if (dedans) occuper(); }
      // la ville vivante : qui tient ce lieu en ce moment, et qui y est
      if (quoi === "tenancier") { var tq = tenancier(val); return { tient: tq && tq.id, la: gensDuLieu(val).map(function (g) { return g.id; }), tous: GENS_LISTE.filter(function (g) { return g.lieu === val; }).map(function (g) { return g.id + (gensLa(g) ? "" : " (absent)"); }) }; }
      // le Grand Aubérive : la semaine (les quartiers s'ouvrent), un lieu demandé comme le joueur, le zoom
      if (quoi === "semaine") { S.semaine = val; majHud(); return { fermes: FERMES }; }
      if (quoi === "allerLieu") { allerAuLieu(val); return { toast: $("villeToast").classList.contains("on") ? $("villeToast").textContent : null }; }
      if (quoi === "zoom") { zoom(val); return { k: k }; }
      if (quoi === "quartiers") return { fermes: FERMES, monde: !!MONDE, heros: [Math.round(heros.x), Math.round(heros.y)] };
      // toucher quelqu'un qu'on voit (la ville vivante : sa bulle)
      if (quoi === "parler") {
        var qg = figurants.concat(Object.keys(acteurs).map(function (k2) { return acteurs[k2]; })).filter(function (q) { return q.qui === val; })[0];
        if (!qg) return { erreur: "personne ici : " + val };
        parler(qg);
        return bulle ? { nom: bulle.nom, texte: bulle.texte } : null;
      }
      // une scène jouée ou une conversation, à la demande (packages/tools/web/voir_scene.js)
      if (quoi === "cine") {
        var ci = cineParId(val);
        if (!ci) return { erreur: "scène inconnue : " + val };
        S.cinesVues = S.cinesVues || {};
        for (var su = ci, n0 = 0; su && n0 < 9; su = su.suite ? cineParId(su.suite) : null, n0++) delete S.cinesVues[su.id];
        if (CINE || MATCH) return { erreur: "une scène ou un match occupe l'écran" };
        if (carteOn) cacherCarte();
        occupe = false; fermerPorte();
        jouerCine(ci);
        return { cine: ci.id };
      }
      if (quoi === "conv") {
        var cv = (D.conversations || []).filter(function (x) { return x.id === val; })[0];
        if (!cv) return { erreur: "conversation inconnue : " + val };
        if (carteOn || CINE || MATCH) return { erreur: "une carte, une scène ou un match occupe l'écran" };
        if (CONV) finConv();
        if (aInterieur(cv.lieu)) { if (!dedans || dedans.cle !== cv.lieu) entrer(cv.lieu); }
        else if (LIEU[cv.lieu] && LIEU[cv.lieu].door) {
          if (dedans) aDehors(true);
          var c3 = centre(LIEU[cv.lieu].door); poserEnVille(c3[0], c3[1]); var p3 = visee(); cam.x = p3[0]; cam.y = p3[1]; recaler();
        }
        S.convsVues = S.convsVues || {}; S.convsVues[cv.id] = 1;
        CONV = { cv: cv, voix: convInstaller(cv), i: -1, jusqua: 0, loin: performance.now() };
        // le héros à portée de voix : à côté de la première
        var v0 = CONV.voix[Object.keys(CONV.voix)[0]];
        if (v0) { var c0 = caseDe(v0.x, v0.y), pr = plusProche(c0[0] + 2, c0[1] + 1, 6) || plusProche(c0[0], c0[1], 6); if (pr) { var cp = centre(pr); heros.x = cp[0]; heros.y = cp[1]; heros.chemin = null; } }
        return { conv: cv.id };
      }
      if (quoi === "plan") { planifierScenes(); return S.scenesJour; }
      if (quoi === "tranche") { while (TRANCHES[S.tranche] !== val) { S.tranche++; if (S.tranche > 4) { S.tranche = 0; nouveauJour(); } } majHud(); }
      // la ruine : une paie qui tombe sur un découvert (la banque, l'huissier, le tribunal)
      if (quoi === "paie") { attente = []; ruine(); majHud(); suiteFondus(); return { francs: S.francs, dette: S.dette, attente: attente.length }; }
      return { francs: S.francs, mission: S.mission, biens: S.biens, lieu: S.lieu, rdv: rdv, match: MATCH ? { phase: MATCH.phase, minute: Math.round(MATCH.minute), score: MATCH.score.slice(), lignes: MATCH.lignes.slice(), adv: MATCH.adv, ev: MATCH.ev.map(function (e) { return e.m + e.t + (e.dit ? "*" : ""); }) } : null, panneau: S.panneau };
    },
    // ce que la musique doit savoir : le soir et la nuit, le stade, une carte à l'écran
    moment: function () { return { nuit: !!S && S.tranche >= 3, match: !!MATCH, carte: carteOn, actif: actif, cine: !!CINE, musique: CINE ? CINE.musique || null : (typeof directMusique === "function" ? directMusique() : null) }; },
    _toucher: function (uid) {
      var g = passants.filter(function (q) { return q.uid === uid; })[0];
      if (!g) Object.keys(acteurs).forEach(function (id) { if (acteurs[id].uid === uid) g = acteurs[id]; });
      if (g) toucherQuelquun(g);
      return !!g;
    },
    // les cases par livre : l'accueil y lit « Reprendre » sur chaque cartouche
    sauves: function () {
      var out = {};
      toutesSauves().forEach(function (e) {
        var v = e.s.ville || {};
        out[e.id] = { nom: v.nom || "", semaine: v.semaine || 1, jour: v.jour || 0, role: v.role || "", quand: e.s.quand || 0 };
      });
      return out;
    },
    reprendreLivre: function (id) { var s = lireCase(id); if (s) reprendre(s); return !!s; },
    effacerLivre: function (id) {
      effacerSauve(id);
      // le rappel de l'accueil (ville_chapitres.js) parlait peut-être de ce livre-là
      try { var r = JSON.parse(localStorage.getItem("fusible.rappel") || "null"); if (r && r.histoire === id) localStorage.removeItem("fusible.rappel"); } catch (e) {}
      boutonReprendre();
    },
    rafraichirReprise: boutonReprendre,
    fin: function () {
      if (dedans) aDehors(true);
      actif = false; carteOn = false;
      // une carrière finie libère sa case, et aucun geste en retard (un minuteur) ne la réécrit
      sauveFinie = true;
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
