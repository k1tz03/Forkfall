  // ═══════════════════════════════════════════════════════════════════════════
  // LES FILMS DANS LA VILLE — ville_film.js, inséré par assemble.js dans la fermeture
  // de ville.js, après ville_cinema.js (docs/design/cinematiques.md).
  //
  // Un film (cinema/films/<module>.js, trois.js et la trousse) se joue plein écran,
  // par-dessus la ville, au moment que dit son déclencheur (content/ville/films_*.yaml,
  // compilé sous `ville.films`) : au départ d'une carrière, avant ou après une carte,
  // après un drapeau. Il prend les mêmes portes que les scènes jouées : les quatre
  // fonctions qui les trouvent et les jouent (ville_cinema.js) sont enveloppées ici, et
  // un film passe AVANT les scènes jouées du même moment (la veille, puis le jour).
  // Ce module ne réécrit ni ville.js ni ville_cinema.js ; assemble.js vérifie que les
  // quatre noms existent encore (un renommage casserait les films en silence).
  //
  // Le film se joue une fois par carrière (S.filmsVus, dans la sauvegarde). Pendant
  // qu'il tourne, la ville ne se dessine plus (une seule chose à l'écran sur un
  // téléphone) et sa musique est celle du film ; à la fin, tout reprend où c'était.
  // Un film absent de cette version, une page sans WebGL, un chargement raté : la ville
  // passe, la scène jouée suivante (s'il y en a) se joue, la carte arrive.
  // ═══════════════════════════════════════════════════════════════════════════
  var FILM_EN_COURS = null;
  function filmsAJouer(quand, o) {
    var FCin = window.FusibleCinema;
    if (!FCin || !FCin.declencheurs || !S || !D) return [];
    var opts = { vue: vue, vus: S.filmsVus || {}, role: S.role };
    for (var k in (o || {})) opts[k] = o[k];
    return FCin.declencheurs(D.films || [], quand, opts);
  }
  // ce que les déclencheurs de la ville rendent à la place d'une scène : un « film », et la
  // scène qui l'aurait suivi (cherchée à la fin du film, l'état ayant pu changer)
  function pseudoFilm(f, suite) { return { __film: true, id: "film:" + f.id, film: f, suite: suite || null }; }
  var VILLE_FILMS_BRANCHES = (function () {
    if (typeof cineDeCarte !== "function" || typeof cineDeDrapeau !== "function" || typeof cineIntro !== "function" || typeof jouerCine !== "function") {
      if (window.console) console.warn("ville_film : les déclencheurs des scènes jouées ont changé ; les films ne se joueront pas");
      return false;
    }
    var cineDeCarte0 = cineDeCarte, cineDeDrapeau0 = cineDeDrapeau, cineIntro0 = cineIntro, jouerCine0 = jouerCine;
    cineDeCarte = function (id, moment) {
      var f = id ? filmsAJouer("carte", { carte: id, moment: moment || "avant" })[0] : null;
      // avant : la carte redemandera ses scènes quand le film aura fini ; après : la scène d'après
      // la carte, sinon celle qu'un drapeau ouvre (ville.js : `cineDeCarte(…, "apres") || cineDeDrapeau()`)
      if (f) return pseudoFilm(f, moment === "apres" ? function () { return cineDeCarte0(id, "apres") || cineDeDrapeau(); } : null);
      return cineDeCarte0(id, moment);
    };
    cineDeDrapeau = function () {
      var f = filmsAJouer("drapeau")[0];
      if (f) return pseudoFilm(f, function () { return cineDeDrapeau(); });
      return cineDeDrapeau0();
    };
    cineIntro = function () {
      var f = filmsAJouer("debut")[0];
      if (f) return pseudoFilm(f, function () { return cineIntro(); });
      return cineIntro0();
    };
    jouerCine = function (c, ensuite) {
      if (c && c.__film) return jouerFilm(c, ensuite);
      return jouerCine0(c, ensuite);
    };
    return true;
  })();
  // la musique du moment, telle que la coquille la demande : celle du film pendant qu'il tourne
  var momentEnveloppe = false;
  function envelopperMoment() {
    var V = window.FusibleVille, FCin = window.FusibleCinema;
    if (momentEnveloppe || !V || !V.moment) return;
    momentEnveloppe = true;
    var m0 = V.moment;
    V.moment = function () {
      var r = m0.apply(this, arguments);
      if (FILM_EN_COURS && FCin && FCin.films[FILM_EN_COURS.module]) {
        var th = FCin.themeDe(FCin.films[FILM_EN_COURS.module], window.FusibleAudio);
        if (th) r.musique = th;
        r.cine = true;
      }
      return r;
    };
  }
  function jouerFilm(c, ensuite) {
    var FCin = window.FusibleCinema, f = c.film;
    S.filmsVus = S.filmsVus || {};
    S.filmsVus[f.id] = 1;
    sauver();
    var suite = function () {
      var s = c.suite ? c.suite() : null;
      if (s) jouerCine(s, ensuite); else if (ensuite) ensuite();
    };
    if (!FCin || !FCin.jouer || CINE || FILM_EN_COURS) { suite(); return; }
    envelopperMoment();
    FILM_EN_COURS = f;
    occupe = true;
    if (CONV) finConv();
    var etaitActif = actif;
    actif = false;   // la ville se repose le temps du film : sa boucle s'arrête à la prochaine image
    var ent = (vue && vue.entities) || {};
    var heros = { nom: ent.protagonist || S.nom || "", genre: (vue && vue.genre) || ent.genre || "m", annee: vue && vue.year };
    FCin.jouer(f.module, { heros: heros, couleur: couleurCine(), titre: f.titre || "", audio: window.FusibleAudio, rendreTheme: false }).then(function () {
      FILM_EN_COURS = null;
      occupe = false;
      if (etaitActif && !actif) { actif = true; dernier = 0; requestAnimationFrame(image); }
      sonVille();
      suite();
    }, function () {
      FILM_EN_COURS = null; occupe = false;
      if (etaitActif && !actif) { actif = true; dernier = 0; requestAnimationFrame(image); }
      suite();
    });
  }
  // les fichiers du film, d'avance : quelques secondes après le départ (ou la reprise) d'une
  // carrière, quand la ville a fini de poser ses images (rien ne s'exécute avant le film)
  function prechaufferFilms() {
    var FCin = window.FusibleCinema;
    if (!FCin || !FCin.prechauffer || !D) return;
    setTimeout(function () {
      (D.films || []).forEach(function (f) { if (!(S && S.filmsVus && S.filmsVus[f.id]) && FCin.disponible(f.module)) FCin.prechauffer(f.module); });
    }, 9000);
  }
  crochetVille("debut", prechaufferFilms);
  crochetVille("reprise", prechaufferFilms);
