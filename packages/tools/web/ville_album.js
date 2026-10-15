  // ═══════════════════════════════════════════════════════════════════════════
  // L'ALBUM D'AUBÉRIVE, CÔTÉ VILLE — ville_album.js, inséré par assemble.js dans la fermeture de
  // ville.js (au repère `__VILLE_MODULES__`, après ville_jeux.js : il ajoute un jeu à `JEUX`). Le
  // catalogue, le tirage, l'ouverture et l'album vivent dans preview_album.js (`window.FusibleAlbum`) ;
  // ici, ce qui est de la ville : une pochette s'achète comme une activité (l'argent, le temps, la
  // semaine), un échange est un geste avec quelqu'un (un point de lien, une habitude : l'activité
  // cachée `album_echange_<gens>`, comptée par le moteur), les pochettes qu'on gagne en jouant
  // (un lien qui monte, un service rendu), ce que rapporte une page finie, l'onglet « Album » du Carnet.
  // Le contenu : content/ville/album.yaml (docs : l'en-tête de ce fichier).
  // ═══════════════════════════════════════════════════════════════════════════
  function albumPret() { return !!(window.FusibleAlbum && window.FusibleAlbum.pret); }
  // la graine de la carrière, l'année, l'histoire : ce dont le tirage a besoin
  function albumContexte() {
    var g = coquille && coquille.graine ? coquille.graine() : { seed: 0, postulat: 0 };
    var ps = (window.FusibleApercu && window.FusibleApercu.postulats) || [];
    var p = ps.filter(function (x) { return x.index === g.postulat; })[0];
    return { graine: g.seed | 0, annee: (vue && vue.year) || 1990, histoire: p ? p.id : "" };
  }
  var MOTS_F = ["aucune", "une", "deux", "trois", "quatre", "cinq", "six"], MOTS_M = ["aucun", "un", "deux", "trois", "quatre", "cinq", "six"];
  // ce que la pochette a donné, en une phrase pour le panneau
  function albumPhrase(res) {
    var n = res.ids.length, nv = res.nouvelles, dbl = res.doubles, br = res.brillantes;
    var tot = (MOTS_F[n] || n);
    tot = tot.charAt(0).toUpperCase() + tot.slice(1);
    var t;
    if (nv === n) t = tot + " vignettes, toutes nouvelles.";
    else if (!nv) t = tot + " vignettes que tu avais déjà. Les doubles se gardent pour ceux qui échangent.";
    else t = tot + " vignettes : " + (MOTS_F[nv] || nv) + (nv > 1 ? " nouvelles" : " nouvelle") + ", " + (MOTS_M[dbl] || dbl) + (dbl > 1 ? " doubles." : " double.");
    if (br) t += br > 1 ? " Dont " + (MOTS_F[br] || br) + " brillantes." : " Dont une brillante.";
    if (res.pagesDetail && res.pagesDetail.length) t += " La page « " + res.pagesDetail[0].titre + " » est complète.";
    return t;
  }

  // ─── la pochette : un jeu de la ville (`jeu: pochette`), joué par preview_album.js
  // L'argent, le temps et la semaine sont ceux de l'activité (`francs`, `max_jour`) : `finirActivite`
  // paie quand la pochette est collée. Laisser la pochette ferme sans rien payer.
  JEUX.pochette = {
    sansToile: true,
    regle: "Quatre vignettes dans une pochette. Tu ne sais pas lesquelles.",
    debut: function (j) {
      var A = window.FusibleAlbum, scene = (j.el.querySelector(".v-jeu-scene") || {}).textContent || "";
      // le cadre générique des jeux se tait : la pochette a le sien
      j.el.hidden = true;
      if (!A) { finJeu(null); return; }
      var ctx = albumContexte();
      var ok = A.pochette({
        prix: argent(-(j.a.francs || 0)), scene: scene, graine: ctx.graine, annee: ctx.annee, histoire: ctx.histoire, argent: argent,
        album: function () { ouvrirAlbum(); },
        fin: function (res) {
          if (!res) { finJeu(null); return; }
          albumReclamer();
          finJeu({ gagne: true, score: res.nouvelles, phrase: albumPhrase(res) });
        }
      });
      if (!ok) finJeu(null);
    }
  };

  // ─── l'échange : l'action « Échanger des vignettes » du panneau de celui qui en a
  function albumActiviteEchange(g) {
    var id = "album_echange_" + g.id;
    return (D.activites || []).filter(function (a) { return a.id === id; })[0] || null;
  }
  function albumBloc(g) {
    if (!albumPret()) return "";
    var A = window.FusibleAlbum, cfg = A.echangeDe(g.id), a = cfg && albumActiviteEchange(g);
    if (!cfg || !a) return "";
    var donne = (A.config().echange || {}).donne || 2, spare = 0;
    A.doublesDe().forEach(function (d) { spare += d.reste; });
    var non = pourquoiPas(a, true) || (spare < donne ? "Il te faut " + donne + " doubles : tu en as " + spare + "." : "");
    return '<button type="button" class="v-act v-echange" data-gens="' + esc(g.id) + '"' + (non ? " disabled" : "") + '><b>' + esc(a.label) + '</b>' +
      (non ? '<span class="pourquoi">' + esc(non) + '</span>' : '<span class="cout"><span>' + donne + ' doubles pour une</span></span>') + '</button>';
  }
  function albumEchanger(g, cle) {
    var A = window.FusibleAlbum, cfg = A && A.echangeDe(g.id), a = albumActiviteEchange(g);
    if (!cfg || !a || carteOn || occupe || pourquoiPas(a, true)) return;
    var ctx = albumContexte(), k = g.id + ":" + S.semaine;
    // ce qu'il a déjà donné cette semaine ne revient pas ; le reste de l'année s'efface
    S.albumPris = S.albumPris || {};
    Object.keys(S.albumPris).forEach(function (x) { if (x.split(":")[1] !== String(S.semaine)) delete S.albumPris[x]; });
    var pris = S.albumPris[k] || [];
    fermerPorte();
    occupe = true;
    var ok = A.echange({
      gens: g.id, nom: nomCourt(g.id), scene: cfg.scene, graine: ctx.graine, annee: ctx.annee, histoire: ctx.histoire, semaine: S.semaine, pris: pris,
      fin: function (res) {
        occupe = false;
        if (!res) { ouvrirPorte(cle, null); return; }
        S.albumPris[k] = pris.concat([res.recu]);
        albumReclamer();
        // un geste avec lui : le point de lien, l'habitude, la trace sous l'activité (le moteur compte)
        finirActivite(a, cle, { gagne: true, score: 1, phrase: res.phrase || "L'échange est fait." });
      }
    });
    if (!ok) { occupe = false; ouvrirPorte(cle, null); }
  }

  // ─── les pochettes qu'on gagne en jouant : un lien qui monte d'un cran, un service rendu
  var ALBUM_MOTS = {
    lien: ["{n} te glisse une pochette dans la poche, sans rien dire.", "{n} te tend une pochette fermée. Pour l'album.", "Une pochette de {n}, encore scellée."],
    service: ["{n} ajoute une pochette au service.", "Avec le service, {n} te laisse une pochette sur le comptoir.", "{n} pousse une pochette vers toi, du bout du doigt."]
  };
  // au plus `cadeaux.<raison>` par carrière (album.yaml) ; `delai` : après les mots du palier
  function albumOffrir(raison, qui, delai) {
    if (!albumPret() || !S) return;
    var A = window.FusibleAlbum, max = ((A.config().cadeaux || {})[raison]) | 0;
    S.albumCadeaux = S.albumCadeaux || {};
    if ((S.albumCadeaux[raison] | 0) >= max) return;
    var n = S.albumCadeaux[raison] = (S.albumCadeaux[raison] | 0) + 1;
    A.offrir(1);
    var mots = ALBUM_MOTS[raison] || ALBUM_MOTS.lien, t = mots[(n - 1) % mots.length].replace("{n}", qui ? nomCourt(qui) : "Quelqu'un");
    setTimeout(function () { if (!carteOn) toast(t); }, delai || 0);
  }

  // ─── ce que les pages finies rapportent au moteur : l'argent (par le pont), le drapeau d'un quartier, un tuyau
  function albumReclamer() {
    if (!albumPret() || !S || !coquille || !coquille.mission) return;
    var A = window.FusibleAlbum, dus = A.dus();
    if (!dus.length) return;
    var quartier = false;
    dus.forEach(function (d) {
      if (vue && vue.over) return;
      vue = coquille.mission(d.mission, "rendu", "oui");
      pont(vue);
      A.solder(d.page);
      if (d.quartier) quartier = true;
    });
    if (vue && vue.over) return;
    if (quartier) majQuartiers(true);
    majHud(); sauver();
  }
  // une carrière commence : les quartiers que l'album t'a ouverts d'avance, et ce qu'une page finie à
  // l'accueil n'a pas encore payé
  crochetVille("debut", function () {
    if (!albumPret() || !S || !coquille || !coquille.mission) return;
    var qs = window.FusibleAlbum.permanents();
    qs.forEach(function (c) { vue = coquille.mission("album.quartier." + c, "rendu", "oui"); });
    if (qs.length) { pont(vue); majQuartiers(false); }
    albumReclamer();
  });
  crochetVille("reprise", function () { albumReclamer(); });
  crochetVille("jour", function () { albumReclamer(); });

  // ─── l'onglet « Album » du Carnet
  function ouvrirAlbum() {
    if (!coquille || !S || !albumPret()) return;
    fermerPorte();
    coquille.panneau("Le carnet", '<div class="v-inv v-album">' + ongletsCarnet("album") + '<div class="alb-racine" id="albRacine"></div></div>');
    brancherOnglets();
    window.FusibleAlbum.monter($("albRacine"), { argent: argent, apres: function () { albumReclamer(); }, album: ouvrirAlbum });
  }
