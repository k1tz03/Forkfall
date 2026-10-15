  // ═══ LE DOSSIER 1974, EN VILLE ════════════════════════════════════════════════════════
  // (docs/histoires/dossier_1974.md ; content/ville/dossier_1974.yaml) La page tient le dossier
  // (preview_dossier.js, window.FusibleDossier : ce qui se garde d'une carrière à l'autre) ; la
  // ville dit ce qu'on y trouve en marchant : un drapeau `dossier_<pièce>` posé par une scène de
  // la semaine ou un tiroir, une conversation surprise entendue jusqu'à sa dernière réplique, une
  // scène jouée. Elle l'annonce d'un bandeau quand on a les mains libres (ni carte ni scène), et le
  // carnet gagne un onglet : le dossier, pièce par pièce.
  var DOSSIER_VILLE_FILE = [], DOSSIER_VILLE_VUES = {};

  function dossierVilleGuetter() {
    var F = window.FusibleDossier;
    if (!F || !S || !vue || vue.over) return;
    var flags = vue.flags || [];
    F.pieces().forEach(function (p) {
      // une pièce déjà passée par ici (trouvée, ou déjà au dossier) ne se relit plus
      if (DOSSIER_VILLE_VUES[p.id]) return;
      var t = p.trouve || {}, ok = false;
      if (t.drapeau) ok = flags.indexOf(t.drapeau) >= 0;
      // jusqu'au bout : la dernière réplique dite (s'éloigner avant, c'est l'avoir manquée)
      else if (t.conversation) ok = !!(CONV && CONV.cv && CONV.cv.id === t.conversation && CONV.i >= CONV.cv.repliques.length - 1);
      else if (t.cinematique) ok = !!(S.cinesVues && S.cinesVues[t.cinematique]);
      if (ok) { F.trouver(p.id); DOSSIER_VILLE_VUES[p.id] = 1; }
    });
    // le bandeau attend les mains libres : une carte ouverte ou une scène le cacheraient
    if (DOSSIER_VILLE_FILE.length && !carteOn && !CINE) toast(DOSSIER_VILLE_FILE.shift());
  }
  setInterval(dossierVilleGuetter, 700);

  // ce que la page demande à la ville : son bandeau, quand elle tourne
  window.FusibleDossierVille = {
    actif: function () { return !!(S && vue && !vue.over); },
    toast: function (t) { DOSSIER_VILLE_FILE.push(t); }
  };

  // l'onglet du carnet (ville_gens.js, ONGLETS_CARNET)
  function dossierVilleCarnet() {
    var F = window.FusibleDossier;
    if (!F || !coquille || !S) return;
    fermerPorte();
    coquille.panneau("Le carnet", '<div class="v-inv v-carnet">' + ongletsCarnet("dossier") + F.html() + "</div>");
    brancherOnglets();
    F.brancher(document.getElementById("panelBody"));
  }
  ONGLETS_CARNET.push({ cle: "dossier", label: "Le dossier", ouvrir: dossierVilleCarnet });
