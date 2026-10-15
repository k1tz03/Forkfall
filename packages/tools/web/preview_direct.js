  // ═══ LE SAMEDI EN DIRECT (docs/histoires/samedi_direct.md) ════════════════════
  // Dans la ville, le choix de posture du samedi ne part pas tout de suite au moteur :
  // `advance` le propose d'abord à la ville (`VILLE.retenir`, ville_direct.js), qui joue
  // le match jusqu'aux décisions du bord du terrain, puis le rend ici d'un seul appel,
  // avec les décisions. La vue d'après n'est présentée qu'à la sortie du stade : la carte
  // suivante attend que le score soit au mur. Le crochet 'reponse' part à ce moment-là
  // (avec `direct`, les décisions prises), comme pour tout autre choix.
  var directReponse = null;
  if (VILLE && window.FusibleCoquille) {
    window.FusibleCoquille.choisirDirect = function (droite, direct) {
      if (!view || view.over || !view.card || view.card.beatKind !== "match") return null;
      var avant = view;
      view = JSON.parse(window.fusibleChoose(!!droite, JSON.stringify(direct || {})));
      busy = false;
      logAnswer(view.lastAnswer);
      directReponse = { droite: !!droite, avant: avant, apres: view, direct: direct || null };
      return view;
    };
    window.FusibleCoquille.presenterDirect = function () {
      if (!view) return;
      if (directReponse) { var r = directReponse; directReponse = null; annoncer("reponse", r); }
      if (view.over) advanceEnd(); else presenter();
    };
  }
