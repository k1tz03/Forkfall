/* ═══════════════════════════════════════════════════════════════════════════
   LA TROUSSE DU CINÉMA — 00 : la base (docs/design/cinematiques.md).

   Tout ce qu'un film sait faire passe par `t`, le temps du film en secondes :
   la même image sort du lecteur du jeu et de l'outil de tournage. Le hasard
   vient d'une graine (jamais de Math.random) ; le bruit est un bruit de
   valeurs lissé, tiré de la graine. Ici : le hasard, le bruit, les courbes
   d'aisance, les clés (une valeur qui change avec le temps), les couleurs.

   La trousse est un script classique : elle s'accroche à
   window.FusibleCinema.kit (le lecteur, cinema/lecteur.js, le crée) et trouve
   three.js dans window.FusibleTHREE (vendor/three/fusible-three.js).
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";
  var FC = global.FusibleCinema = global.FusibleCinema || {};
  var K = FC.kit = FC.kit || {};
  K.version = "1.0.0";

  // ─── le hasard : un hachage de chaîne (FNV-1a) et un générateur à état (mulberry32)
  function hash(s) {
    s = String(s);
    var h = 2166136261 >>> 0;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h >>> 0;
  }
  function alea(graine) {
    var a = (typeof graine === "number" ? graine : hash(graine)) >>> 0 || 1;
    var r = function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    r.entre = function (x, y) { return x + (y - x) * r(); };
    r.entier = function (n) { return Math.floor(r() * n) % n; };
    r.choix = function (l) { return l[Math.floor(r() * l.length) % l.length]; };
    r.signe = function () { return r() < 0.5 ? -1 : 1; };
    r.gauss = function () { return (r() + r() + r() + r() - 2) * 0.8660254; };
    return r;
  }
  // un nombre de [0, 1) tiré d'un entier et d'une graine, sans état
  function h01(i, graine) {
    var x = Math.imul((i | 0) ^ 0x9E3779B9, 0x85EBCA6B) ^ Math.imul((graine | 0) + 0x632BE5AB, 0xC2B2AE35);
    x ^= x >>> 16; x = Math.imul(x, 0x7FEB352D); x ^= x >>> 15; x = Math.imul(x, 0x846CA68B); x ^= x >>> 16;
    return (x >>> 0) / 4294967296;
  }

  // ─── le bruit : des valeurs aux nœuds d'une grille, lissées entre eux
  function lisseC(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  function bruit1(x, graine) {
    var i = Math.floor(x), f = x - i, g = graine | 0;
    return mix(h01(i, g), h01(i + 1, g), lisseC(f)) * 2 - 1;
  }
  function bruit2(x, y, graine) {
    var ix = Math.floor(x), iy = Math.floor(y), fx = lisseC(x - ix), fy = lisseC(y - iy), g = graine | 0;
    var a = h01(ix + iy * 57131, g), b = h01(ix + 1 + iy * 57131, g);
    var c = h01(ix + (iy + 1) * 57131, g), d = h01(ix + 1 + (iy + 1) * 57131, g);
    return mix(mix(a, b, fx), mix(c, d, fx), fy) * 2 - 1;
  }
  function fbm1(x, graine, octaves) {
    var s = 0, a = 0.5, f = 1, n = octaves || 3, tot = 0;
    for (var k = 0; k < n; k++) { s += a * bruit1(x * f, (graine | 0) + k * 131); tot += a; a *= 0.5; f *= 2.03; }
    return s / tot;
  }
  function fbm2(x, y, graine, octaves) {
    var s = 0, a = 0.5, f = 1, n = octaves || 4, tot = 0;
    for (var k = 0; k < n; k++) { s += a * bruit2(x * f, y * f, (graine | 0) + k * 131); tot += a; a *= 0.5; f *= 2.03; }
    return s / tot;
  }

  // ─── les nombres
  function mix(a, b, t) { return a + (b - a) * t; }
  function borne(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lisse(e0, e1, x) { var t = borne((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); }
  function rampe(e0, e1, x) { return borne((x - e0) / (e1 - e0), 0, 1); }
  // une cloche : 0 hors de [a, d], 1 entre b et c, des rampes lissées entre les deux
  function cloche(a, b, c, d, x) { return lisse(a, b, x) * (1 - lisse(c, d, x)); }

  // ─── les aisances : t ∈ [0, 1] → [0, 1]
  var AISANCE = {
    lin: function (t) { return t; },
    douce: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    entree: function (t) { return t * t * t; },
    sortie: function (t) { return 1 - Math.pow(1 - t, 3); },
    sinus: function (t) { return -(Math.cos(Math.PI * t) - 1) / 2; },
    expo: function (t) { return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); },
    quint: function (t) { return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2; },
    elan: function (t) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    marche: function (t) { return t < 1 ? 0 : 1; }
  };
  function aisance(nom) { return typeof nom === "function" ? nom : (AISANCE[nom] || AISANCE.douce); }

  // ─── les clés : une piste [[t, valeur, aisance?], …] → une fonction du temps.
  // La valeur est un nombre ou une liste de nombres ([x, y, z], une couleur [r, g, b]) ;
  // l'aisance d'une clé vaut pour le trajet qui y ARRIVE (défaut : `douce`).
  function cles(piste, aisanceDefaut) {
    var P = piste.slice().sort(function (a, b) { return a[0] - b[0]; });
    var def = aisance(aisanceDefaut || "douce");
    var liste = Array.isArray(P[0][1]);
    var f = function (t) {
      if (t <= P[0][0]) return liste ? P[0][1].slice() : P[0][1];
      var n = P.length;
      if (t >= P[n - 1][0]) return liste ? P[n - 1][1].slice() : P[n - 1][1];
      var i = 1;
      while (i < n - 1 && P[i][0] < t) i++;
      var a = P[i - 1], b = P[i], e = b[2] ? aisance(b[2]) : def;
      var u = e((t - a[0]) / Math.max(1e-6, b[0] - a[0]));
      if (!liste) return mix(a[1], b[1], u);
      var o = new Array(a[1].length);
      for (var k = 0; k < o.length; k++) o[k] = mix(a[1][k], b[1][k], u);
      return o;
    };
    f.piste = P;
    return f;
  }
  // une valeur ou une piste : la même lecture
  function lire(v, t) { return typeof v === "function" ? v(t) : v; }

  // ─── l'épaule : la caméra tenue à la main (le même tremblement à chaque passage)
  // → { x, y, z } en mètres et { rx, ry, rz } en radians, pour une amplitude 1
  function epaule(t, graine, freq) {
    var g = graine | 0, f = freq || 1;
    return {
      x: fbm1(t * 0.7 * f, g + 1, 3) * 0.012, y: fbm1(t * 0.9 * f, g + 2, 3) * 0.01, z: fbm1(t * 0.5 * f, g + 3, 2) * 0.008,
      rx: fbm1(t * 1.1 * f, g + 4, 3) * 0.0065, ry: fbm1(t * 0.8 * f, g + 5, 3) * 0.008, rz: fbm1(t * 0.6 * f, g + 6, 2) * 0.004
    };
  }

  // ─── les couleurs : '#RRGGBB' ↔ [r, g, b] (0..1, sRGB)
  function rgb(hex) {
    var h = String(hex).replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  function hex(c) {
    var s = "#";
    for (var i = 0; i < 3; i++) { var v = Math.round(borne(c[i], 0, 1) * 255); s += (v < 16 ? "0" : "") + v.toString(16); }
    return s;
  }
  function melange(a, b, t) { var A = rgb(a), B = rgb(b); return hex([mix(A[0], B[0], t), mix(A[1], B[1], t), mix(A[2], B[2], t)]); }
  function css(c, alpha) { var A = Array.isArray(c) ? c : rgb(c); return "rgba(" + Math.round(A[0] * 255) + "," + Math.round(A[1] * 255) + "," + Math.round(A[2] * 255) + "," + (alpha == null ? 1 : alpha) + ")"; }

  // la palette commune des films : la nuit, le sodium, la crème du jeu
  var PALETTE = {
    nuit: "#0A0F1C", nuitBleue: "#101a30", encre: "#06070B", sodium: "#FF9A3D", sodiumPale: "#FFC27A",
    ampoule: "#FFD49A", neonFroid: "#7FD8FF", lune: "#8EA6D8", creme: "#F2E8CE", creme2: "#CBBB92",
    bordeaux: "#7A1F2E", gris: "#8E8C86", brique: "#7D3A2A", beton: "#6E6A5E", pelouse: "#1D4A2A",
    projecteur: "#F4F1E6", framboise: "#E0164B"
  };

  // la couleur de chaque livre (preview_template.html, HISTOIRES) : l'accent de ses films
  var LIVRES = {
    promu: "#FF5A4E", interimaire: "#6FB0E8", pepite: "#FF9A3C", fin_de_contrat: "#FFD84D", geant_dechu: "#7ED37E",
    vendre_trente: "#B49BFF", apres_fiasco: "#FF79B0", le_modele: "#4FE3FF", mondial_hiver: "#DDEFFF", escalier_ferme: "#FFB547"
  };

  K.hash = hash; K.alea = alea; K.h01 = h01;
  K.bruit1 = bruit1; K.bruit2 = bruit2; K.fbm1 = fbm1; K.fbm2 = fbm2;
  K.mix = mix; K.borne = borne; K.lisse = lisse; K.rampe = rampe; K.cloche = cloche;
  K.AISANCE = AISANCE; K.aisance = aisance; K.cles = cles; K.lire = lire; K.epaule = epaule;
  K.rgb = rgb; K.hex = hex; K.melange = melange; K.css = css;
  K.PALETTE = PALETTE; K.LIVRES = LIVRES;
  // three.js, au moment où l'on en a besoin (la trousse peut se lire avant lui)
  K.T = function () { return global.FusibleTHREE; };
})(typeof window !== "undefined" ? window : this);
