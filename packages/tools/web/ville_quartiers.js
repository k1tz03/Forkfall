  // ═══════════════════════════════════════════════════════════════════════════
  // LE GRAND AUBÉRIVE — ville_quartiers.js, inséré par assemble.js dans la fermeture de ville.js
  // (au repère `__VILLE_MODULES__`). La ville est au centre d'un monde plus grand
  // (docs/histoires/grand_auberive.md) : le boulevard de ceinture, et quatre quartiers qui
  // s'ouvrent au fil de la carrière. Un quartier fermé reste visible, sous la brume (un masque par
  // quartier, rendu avec la ville : brume_<clé>.webp, au quart), avec son nom et ce qui l'ouvrira ;
  // on n'y marche pas, ses lieux se taisent, et sur le plan aussi. Son ouverture est un moment.
  // ═══════════════════════════════════════════════════════════════════════════
  var GRAND_Q = {
    tilleuls: { nom: "Les Tilleuls", semaine: 4, ligne: "Les Tilleuls : le boulevard de ceinture ne s'arrête plus là. La cité attend derrière ses tilleuls.", indice: "s'ouvre à la 4ᵉ semaine" },
    port: { nom: "Le port de la Rive", semaine: 8, ligne: "Le port : les grilles des quais sont ouvertes. Ce qu'on y décharge ne se déclare pas.", indice: "s'ouvre à la 8ᵉ semaine" },
    hauts: { nom: "Les Hauts", saison: 2, ligne: "Les Hauts : les tours sont inaugurées. Là-haut, on vend le football au mètre carré.", indice: "s'ouvre à la 2ᵉ saison" },
    campagne: { nom: "La campagne", semaine: 12, vehicule: true, ligne: "La campagne : la départementale file entre les champs, jusqu'au Bois-Joli et au manoir.", indice: "s'ouvre avec une voiture, ou à la 12ᵉ semaine" }
  };
  var MONDE = null;          // lieux.json `monde` : { N, O, quartiers: [{cle, x, y, w, h}], brume }
  var FERMES = {};           // clé → vrai : les quartiers sous la brume en ce moment
  var BLOQUE = null;         // la grille de marche des quartiers fermés (1 : on n'y va pas)
  var QUARTIER_DE = {};      // clé d'un lieu → son quartier (pour les lieux des quartiers)
  var LEVEE = {};            // clé → l'instant où sa brume a commencé de se lever (le fondu de l'ouverture)
  var DUREE_LEVEE = 2600;

  function initMonde(l) {
    MONDE = (l && l.monde && l.monde.quartiers && l.monde.quartiers.length) ? l.monde : null;
    QUARTIER_DE = {};
    if (!MONDE) return;
    (l.places || []).forEach(function (p) { if (GRAND_Q[p.district]) QUARTIER_DE[p.key] = p.district; });
    // le stade (ville.js) est écrit dans la ville d'avant : il suit la ville, posée en (O, O)
    if (MONDE.O && !STADE._decale) {
      var O = MONDE.O;
      STADE.x0 += O; STADE.x1 += O; STADE.y0 += O; STADE.y1 += O;
      STADE.poteaux = [STADE.poteaux[0] + O, STADE.poteaux[1] + O];
      STADE.panneau = { x: STADE.panneau.x + O, yG: STADE.panneau.yG + O, yD: STADE.panneau.yD + O, zH: STADE.panneau.zH };
      STADE.banc = [STADE.banc[0] + O, STADE.banc[1] + O];
      STADE.tribunes.forEach(function (T) { var fx = T.x; T.x = function (k) { return fx(k) + O; }; T.y0 += O; T.y1 += O; });
      STADE._decale = true;
    }
  }
  function aUnVehicule() {
    for (var id in (S && S.biens) || {}) {
      var o = OBJET[id];
      if (o && o.categorie === "vehicule") return true;
    }
    return false;
  }
  // les quartiers que des fins trouvées ont ouverts d'avance (le profil : `recompenses.quartiers`,
  // posé par les paliers du Cimetière, preview_template.html JALONS_FINS)
  function quartiersDuProfil() {
    try {
      var A = window.FusibleApercu, r = A && A.profil && A.profil().recompenses;
      return r && Array.isArray(r.quartiers) ? r.quartiers : [];
    } catch (e) { return []; }
  }
  function quartierOuvert(cle) {
    var q = GRAND_Q[cle];
    if (!q || !MONDE) return true;
    if (quartiersDuProfil().indexOf(cle) >= 0) return true;
    if (((vue && vue.flags) || []).indexOf("quartier_" + cle) >= 0) return true;
    if (q.semaine && S && S.semaine >= q.semaine) return true;
    if (q.saison && vue && (vue.season || 1) >= q.saison) return true;
    if (q.vehicule && aUnVehicule()) return true;
    return false;
  }
  function lieuFerme(cle) { var q = QUARTIER_DE[cle]; return !!(q && FERMES[q]); }
  // ce qui est fermé en ce moment ; un quartier qui vient de s'ouvrir se dit (une fois par carrière)
  function majQuartiers(annoncer) {
    if (!MONDE || !S) return;
    var change = false;
    S.quartiers = S.quartiers || {};
    MONDE.quartiers.forEach(function (q) {
      var ferme = !quartierOuvert(q.cle);
      if (!!FERMES[q.cle] !== ferme) change = true;
      FERMES[q.cle] = ferme;
      if (!ferme && !S.quartiers[q.cle]) {
        S.quartiers[q.cle] = S.semaine || 1;
        // au début d'une carrière déjà avancée (une reprise), pas de fanfare
        if (annoncer !== false && GRAND_Q[q.cle]) {
          LEVEE[q.cle] = performance.now();
          setTimeout(function () { if (coquille && coquille.son) coquille.son("nouvelle"); toast(GRAND_Q[q.cle].ligne); }, 600);
        }
      }
    });
    if (change || !BLOQUE) bloquer();
  }
  function bloquer() {
    if (!MONDE) { BLOQUE = null; return; }
    var g = dedans ? dedans.ville.G : G, c = dedans ? dedans.ville.CELL : CELL;
    BLOQUE = new Uint8Array(g * g);
    MONDE.quartiers.forEach(function (q) {
      if (!FERMES[q.cle]) return;
      for (var y = Math.floor(q.y / c); y < Math.ceil((q.y + q.h) / c); y++) for (var x = Math.floor(q.x / c); x < Math.ceil((q.x + q.w) / c); x++)
        if (x >= 0 && y >= 0 && x < g && y < g) BLOQUE[y * g + x] = 1;
    });
  }
  function caseBloquee(cx, cy) { return !dedans && BLOQUE && cx >= 0 && cy >= 0 && cx < G && cy < G && BLOQUE[cy * G + cx] === 1; }

  // ─── la brume, par-dessus la ville (au quart : douce sur les bords, et légère à charger)
  function dessinerBrumes(x0, y0) {
    if (!MONDE || dedans) return;
    var q4 = MONDE.brume || 4, a = ambiance(), nuit = a === "nuit" || a === "crepuscule";
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    var t = performance.now();
    MONDE.quartiers.forEach(function (q) {
      // fermé : la brume entière ; ouvert à l'instant : elle se lève, en fondu
      var leve = 1;
      if (!FERMES[q.cle]) {
        if (!LEVEE[q.cle]) return;
        leve = 1 - (t - LEVEE[q.cle]) / DUREE_LEVEE;
        if (leve <= 0) { delete LEVEE[q.cle]; return; }
      }
      var im = img("brume_" + q.cle);
      if (!im._ok) return;
      ctx.globalAlpha = (nuit ? 0.55 : 0.82) * leve * leve;
      ctx.drawImage(im, x0 / q4, y0 / q4, VW / q4, VH / q4, 0, 0, VW, VH);
    });
    ctx.restore();
  }
  // le nom d'un quartier fermé, et ce qui l'ouvrira, au milieu de sa brume
  var nomsBrume = {};
  function placerNomsBrume(x0, y0) {
    var couche = $("villeCouche");
    if (!couche || !MONDE) return;
    MONDE.quartiers.forEach(function (q) {
      var e = nomsBrume[q.cle];
      if (!e) {
        e = document.createElement("div"); e.className = "v-brume-nom";
        e.innerHTML = "<b></b><span></span>";
        couche.appendChild(e); nomsBrume[q.cle] = e;
      }
      var G0 = GRAND_Q[q.cle];
      if (!FERMES[q.cle] || dedans || MATCH || !G0) { e.hidden = true; return; }
      // le point du quartier le plus proche de ce qu'on regarde (le sol sous le milieu de l'écran,
      // ramené dans le quartier, un peu en dedans) : le nom se lit dans la brume qu'on voit
      var u = x0 + VW / 2, v = y0 + VH / 2, d = (u + P.cu) / 2, s2 = v + P.cv + 2 * ZSOL;
      var gx = clamp((s2 + d) / 2, q.x + 50, q.x + q.w - 50), gy = clamp((s2 - d) / 2, q.y + 50, q.y + q.h - 50);
      var p = versImage(gx, gy, ZSOL), sx = (p[0] - x0) * k, sy = (p[1] - y0) * k;
      var dansBande = sx > 40 && sy > UI.haut + 30 && sx < VW * k - 40 && sy < VH * k - UI.bas - 20;
      if (!dansBande) { e.hidden = true; return; }
      if (e.querySelector("b").textContent !== G0.nom) { e.querySelector("b").textContent = G0.nom; e.querySelector("span").textContent = G0.indice; }
      e.hidden = false;
      e.style.left = Math.round(sx) + "px"; e.style.top = Math.round(sy) + "px";
    });
  }
  // sur le plan : la brume des quartiers fermés, leurs noms
  function planBrumes(W0, H0) {
    if (!MONDE) return "";
    var html = "";
    MONDE.quartiers.forEach(function (q) {
      var G0 = GRAND_Q[q.cle];
      if (!G0) return;
      var c = surPlan(q.x + q.w / 2, q.y + q.h / 2);
      if (FERMES[q.cle]) html += '<img class="v-plan-brume" src="' + BASE + 'brume_' + q.cle + '.webp" alt="" width="' + W0 + '" height="' + H0 + '" draggable="false">';
      html += '<span class="v-q v-q-grand' + (FERMES[q.cle] ? " ferme" : "") + '" style="left:' + c[0] + 'px;top:' + c[1] + 'px">' + esc(G0.nom) +
        (FERMES[q.cle] ? '<small>' + esc(G0.indice) + '</small>' : "") + '</span>';
    });
    return html;
  }
