  // ═══ L'AVIS DES TESTEURS (docs/sortie/beta.md) ═══════════════════════════════════
  // « Donner mon avis », sur l'accueil et sur l'écran de fin d'une carrière, dans une version
  // de bêta : la page qui porte <meta name="fusible-version"> (assemble.js --version). Trois
  // questions et une note ; le rapport (la version, le livre, la graine, la carte, l'appareil)
  // se lit en clair avant de partir. Rien ne part sans le joueur : il copie son avis et le colle
  // dans le formulaire de la bêta (<meta name="fusible-retours">, une adresse https ; si elle
  // contient {avis}, l'avis y est glissé, encodé, pour un formulaire qui le pré-remplit).
  var AVIS_BROUILLON = "fusible.avis.v1";
  function avisMeta(nom) {
    var m = document.querySelector('meta[name="' + nom + '"]');
    return m ? String(m.getAttribute("content") || "").trim() : "";
  }
  var avisVersion = avisMeta("fusible-version"), avisRetours = avisMeta("fusible-retours");
  if (!/^https:\/\//.test(avisRetours)) avisRetours = "";
  var avisFin = null;   // la dernière fin vue, pour le rapport d'après une carrière

  function avisAppareil() {
    var ua = navigator.userAgent || "", os = "", nav = "";
    var m;
    if ((m = ua.match(/iPhone OS ([\d_]+)/)) || (m = ua.match(/CPU OS ([\d_]+)/))) os = (/iPad/.test(ua) ? "iPad" : "iPhone") + " iOS " + m[1].replace(/_/g, ".");
    else if ((m = ua.match(/Android ([\d.]+)[^;)]*;\s*([^;)]+)/))) os = "Android " + m[1] + " (" + m[2].trim() + ")";
    else if (/Macintosh/.test(ua)) os = "Mac";
    else if (/Windows/.test(ua)) os = "Windows";
    else if (/Linux/.test(ua)) os = "Linux";
    if ((m = ua.match(/(Firefox|SamsungBrowser|Edg|OPR|CriOS|FxiOS)\/([\d.]+)/))) nav = m[1] + " " + m[2].split(".")[0];
    else if ((m = ua.match(/Chrome\/([\d.]+)/))) nav = "Chrome " + m[1].split(".")[0];
    else if ((m = ua.match(/Version\/([\d.]+).*Safari/))) nav = "Safari " + m[1];
    var ecran = Math.round(window.innerWidth) + "×" + Math.round(window.innerHeight) + " ×" + (Math.round((window.devicePixelRatio || 1) * 10) / 10);
    return [os || "appareil inconnu", nav, "écran " + ecran].filter(Boolean).join(", ");
  }
  function avisContexte() {
    var l = [], v = view, p = null;
    // le livre en cours : `currentPostulat` est son rang dans la liste (le Code de Carrière), parfois son id
    try { p = typeof currentPostulat === "number" ? postulats[currentPostulat] : postulats.filter(function (x) { return x.id === currentPostulat; })[0]; } catch (e) { p = null; }
    if (p) l.push("Livre : " + (p.title || p.id) + " (" + p.id + "), graine " + currentSeed);
    if (v) {
      var ou = [];
      if (v.year) ou.push(String(v.year));
      if (v.season) ou.push("saison " + v.season);
      if (v.card && v.card.id) ou.push("carte " + v.card.id);
      else if (v.cardId) ou.push("carte " + v.cardId);
      if (ou.length) l.push("Où : " + ou.join(", "));
    }
    if (avisFin) l.push("Fin : " + avisFin);
    try {
      var P = window.FusiblePartage, e = P && P._etat && P._etat();
      if (e && e.code) l.push("Code de la carrière : " + e.code);
    } catch (e2) { /* le partage n'est pas là : on s'en passe */ }
    return l;
  }
  function avisTexte(f) {
    var maintenant = new Date(), pad = function (n) { return (n < 10 ? "0" : "") + n; };
    var date = maintenant.getFullYear() + "-" + pad(maintenant.getMonth() + 1) + "-" + pad(maintenant.getDate()) + " " + pad(maintenant.getHours()) + ":" + pad(maintenant.getMinutes());
    var l = ["FUSIBLE, avis de bêta", "Version : " + (avisVersion || "sans numéro"), "Date : " + date]
      .concat(avisContexte(), ["Appareil : " + avisAppareil()]);
    if (f) {
      l.push("");
      if (f.note) l.push("Note : " + f.note + "/5");
      if (f.envie) l.push("Ce qui donne envie de continuer : " + f.envie);
      if (f.gene) l.push("Ce qui a gêné : " + f.gene);
      if (f.bug) l.push("Un bug : " + f.bug);
    }
    return l.join("\n");
  }
  function avisLire() {
    var b = document.getElementById("avisForm");
    if (!b) return null;
    var note = b.querySelector('input[name="avisNote"]:checked');
    return {
      note: note ? note.value : "",
      envie: b.querySelector("#avisEnvie").value.trim(),
      gene: b.querySelector("#avisGene").value.trim(),
      bug: b.querySelector("#avisBug").value.trim()
    };
  }
  function avisGarder() {
    try { localStorage.setItem(AVIS_BROUILLON, JSON.stringify(avisLire() || {})); } catch (e) { /* un brouillon de la session */ }
  }
  function avisOuvrir(opener) {
    var b = {};
    try { b = JSON.parse(localStorage.getItem(AVIS_BROUILLON) || "{}") || {}; } catch (e) { b = {}; }
    var notes = "";
    for (var i = 1; i <= 5; i++) {
      notes += '<label class="avis-note"><input type="radio" name="avisNote" value="' + i + '"' + (String(b.note) === String(i) ? " checked" : "") +
        '><span>' + i + "</span></label>";
    }
    var champ = function (id, label, val, aide) {
      return '<label class="avis-champ" for="' + id + '"><b>' + label + "</b>" + (aide ? "<small>" + aide + "</small>" : "") +
        '<textarea id="' + id + '" rows="3" maxlength="1200">' + escapeHtml(val || "") + "</textarea></label>";
    };
    var html =
      '<form id="avisForm" class="avis" autocomplete="off">' +
      '<p class="note">Une minute, trois questions. Rien ne part tout seul : tu copies ton avis, puis tu le colles dans le formulaire de la bêta.</p>' +
      '<fieldset class="avis-notes"><legend>Ta note, pour l\'instant</legend>' + notes + "</fieldset>" +
      champ("avisEnvie", "Ce qui te donne envie de continuer", b.envie, "") +
      champ("avisGene", "Ce qui t'a ennuyé, perdu ou fait décrocher", b.gene, "Un passage, une carte, un écran : le plus précis possible.") +
      champ("avisBug", "Un bug ?", b.bug, "Ce que tu faisais juste avant, et ce qui s'est passé.") +
      '<details class="avis-rapport"><summary>Ce qui part avec ton avis</summary><pre id="avisApercu"></pre></details>' +
      '<div class="avis-actions"><button type="button" id="avisCopier">Copier mon avis</button>' +
      (avisRetours ? '<a id="avisFormulaire" href="' + escapeHtml(avisRetours) + '" target="_blank" rel="noopener">Ouvrir le formulaire</a>' : "") +
      "</div>" +
      '<p class="note" id="avisEtat" role="status" aria-live="polite"></p>' +
      '<textarea id="avisSecours" class="avis-secours" readonly hidden></textarea>' +
      "</form>";
    openPanel("avis", "Donner mon avis", html, opener || null);
    var f = document.getElementById("avisForm");
    var apercu = function () { document.getElementById("avisApercu").textContent = avisTexte(avisLire()); };
    apercu();
    f.addEventListener("input", function () { avisGarder(); apercu(); });
    f.addEventListener("change", function () { avisGarder(); apercu(); });
    f.addEventListener("submit", function (e) { e.preventDefault(); });
    document.getElementById("avisCopier").addEventListener("click", function () {
      var texte = avisTexte(avisLire()), etat = document.getElementById("avisEtat");
      var secours = function () {
        var t = document.getElementById("avisSecours");
        t.hidden = false; t.value = texte; t.focus(); t.select();
        etat.textContent = "Sélectionne le texte ci-dessous et copie-le.";
      };
      try {
        navigator.clipboard.writeText(texte).then(function () {
          etat.textContent = avisRetours ? "Copié. Ouvre le formulaire et colle-le dans la première case." : "Copié. Colle-le là où tu donnes tes retours.";
        }, secours);
      } catch (e) { secours(); }
    });
    var lien = document.getElementById("avisFormulaire");
    if (lien && avisRetours.indexOf("{avis}") >= 0) {
      lien.addEventListener("click", function () { lien.href = avisRetours.split("{avis}").join(encodeURIComponent(avisTexte(avisLire()).slice(0, 1800))); });
    }
  }

  // les styles : ceux des panneaux du jeu (les jetons de la page)
  (function () {
    var s = document.createElement("style");
    s.textContent =
      ".avis{display:grid;gap:14px}.avis fieldset{border:0;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px;align-items:center}" +
      ".avis legend{flex-basis:100%;margin-bottom:6px;font-weight:700}" +
      ".avis-note{position:relative}.avis-note input{position:absolute;opacity:0;inset:0}" +
      ".avis-note span{display:inline-grid;place-items:center;width:44px;height:44px;border:2px solid var(--creme3,#B0A07C);font-size:18px}" +
      ".avis-note input:checked+span{background:var(--creme,#F2E8CE);color:var(--fond,#1B1109)}" +
      ".avis-note input:focus-visible+span{outline:3px solid var(--creme,#F2E8CE);outline-offset:2px}" +
      ".avis-champ{display:grid;gap:6px}.avis-champ small{color:var(--creme3,#B0A07C)}" +
      ".avis textarea{width:100%;min-height:4.5em;font:inherit;color:inherit;background:rgba(0,0,0,.25);border:2px solid var(--creme3,#B0A07C);padding:8px;resize:vertical}" +
      ".avis-rapport pre{white-space:pre-wrap;word-break:break-word;font-size:12px;margin:8px 0 0;color:var(--creme2,#C4B491)}" +
      ".avis-actions{display:flex;flex-wrap:wrap;gap:12px}" +
      ".avis-actions button,.avis-actions a{min-height:44px;padding:10px 16px;font:inherit;font-weight:700;border:2px solid var(--creme,#F2E8CE);" +
      "background:var(--creme,#F2E8CE);color:var(--fond,#1B1109);text-decoration:none;display:inline-flex;align-items:center;cursor:pointer}" +
      ".avis-actions a{background:transparent;color:var(--creme,#F2E8CE)}" +
      ".avis-secours{min-height:8em}" +
      ".acc-avis{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;margin:18px 0 6px;" +
      "font-family:var(--pix,monospace);color:var(--a-texte3,#A79CC4);font-size:16px}" +
      ".acc-avis button,.fin-avis button{min-height:44px;padding:8px 14px;font:inherit;font-size:18px;cursor:pointer;" +
      "background:var(--a-fond2,#1C1630);color:var(--a-texte,#F6E9CF);border:2px solid var(--a-ligne,#352B52);box-shadow:3px 3px 0 var(--a-ombre,#06040B)}" +
      ".fin-avis{display:flex;justify-content:center;margin:22px 0 8px}" +
      ".fin-avis button{background:transparent;color:var(--creme,#F2E8CE);border-color:var(--creme3,#B0A07C);box-shadow:none;font-family:inherit;font-size:15px}";
    document.head.appendChild(s);
  })();

  // sur l'accueil : la version, et le bouton (seulement dans une version de bêta)
  function avisAccueil() {
    if (!avisVersion || document.getElementById("accAvis")) return;
    var ecran = document.getElementById("titleScreen"), cim = document.getElementById("cimetiere");
    if (!ecran) return;
    var d = document.createElement("div");
    d.className = "acc-avis"; d.id = "accAvis";
    d.innerHTML = "<span>" + escapeHtml(avisVersion) + '</span><button type="button" id="btnAvis">Donner mon avis</button>';
    if (cim && cim.parentNode === ecran) ecran.insertBefore(d, cim.nextSibling); else ecran.appendChild(d);
    document.getElementById("btnAvis").addEventListener("click", function () { avisOuvrir(this); });
  }
  avisAccueil();
  crochet("accueil", function () { avisAccueil(); });

  // à la fin d'une carrière : « Ton avis sur cette histoire »
  crochet("fin", function (v) {
    if (!avisVersion) return;
    avisFin = (v && (v.endingId || (v.ending && v.ending.id))) || "fin";
    var ecran = document.getElementById("endingScreen");
    if (!ecran || document.getElementById("finAvis")) return;
    var d = document.createElement("div");
    d.className = "fin-avis"; d.id = "finAvis";
    d.innerHTML = '<button type="button">Ton avis sur cette histoire</button>';
    ecran.appendChild(d);
    d.querySelector("button").addEventListener("click", function () { avisOuvrir(this); });
  });

  // de quoi vérifier sans jouer (et pour le banc)
  window.FusibleAvis = { ouvrir: avisOuvrir, texte: function () { return avisTexte(avisLire()); }, version: avisVersion, retours: avisRetours };
