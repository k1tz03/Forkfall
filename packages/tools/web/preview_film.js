  // ═══ LES FILMS SANS LA VILLE (docs/design/cinematiques.md) ═══════════════════════
  // Dans la ville, c'est elle qui joue les films à leur moment (ville_film.js). Sans elle
  // (le fichier seul, l'aperçu des cartes), la coquille les joue ici, aux mêmes moments :
  // au départ d'une carrière, avant une carte (le film couvre la carte qui vient d'être
  // dessinée, la carte attend dessous), après une carte, après un drapeau. Un film se joue
  // une fois par carrière (la graine et le livre) ; la mémoire se garde dans le navigateur.
  var FILMS_CLE = "fusible.films.v1";
  function filmsVus() {
    var cle = currentPostulat + ":" + currentSeed, tout = {};
    try { tout = JSON.parse(localStorage.getItem(FILMS_CLE) || "{}") || {}; } catch (e) { tout = {}; }
    return { cle: cle, tout: tout, vus: tout[cle] || {} };
  }
  function filmVu(id) {
    var m = filmsVus();
    m.vus[id] = 1; m.tout[m.cle] = m.vus;
    var cles = Object.keys(m.tout);
    if (cles.length > 40) delete m.tout[cles[0]];   // une mémoire bornée
    try { localStorage.setItem(FILMS_CLE, JSON.stringify(m.tout)); } catch (e) { /* une mémoire de la session */ }
  }
  var filmEnCours = false, filmsEnAttente = [];
  function filmsDuMoment(quand, o) {
    var FCin = window.FusibleCinema;
    if (!FCin || !FCin.declencheurs) return [];
    // la ville tient la carrière : c'est elle qui décide
    if (VILLE && document.body.classList.contains("ville-on")) return [];
    var liste = (content && content.ville && content.ville.films) || [];
    if (!liste.length) return [];
    var opts = { vue: view, vus: filmsVus().vus, role: view && view.role };
    for (var k in (o || {})) opts[k] = o[k];
    return FCin.declencheurs(liste, quand, opts);
  }
  function jouerFilmApercu(f) {
    var FCin = window.FusibleCinema;
    filmVu(f.id);
    filmEnCours = true;
    var ent = (view && view.entities) || {};
    var p = (content.postulats || []).filter(function (x) { return x.index === currentPostulat; })[0], h = p && HISTOIRES[p.id];
    // la musique : celle du film, puis celle du moment (la carte a pu changer pendant le film)
    var apres = function () { filmEnCours = false; try { sonTheme(); } catch (e) { /* rien */ } };
    return FCin.jouer(f.module, { heros: { nom: ent.protagonist || "", genre: (view && view.genre) || ent.genre || "m", annee: view && view.year },
      couleur: h ? h.c : "#E0164B", titre: f.titre || "", audio: audio, rendreTheme: false }).then(function (r) { apres(); return r; }, apres);
  }
  // les films d'un moment, l'un après l'autre ; ceux qui arrivent pendant un film attendent
  function enchainerFilms(liste) {
    liste.forEach(function (f) { if (filmsEnAttente.indexOf(f) < 0) filmsEnAttente.push(f); });
    if (filmEnCours) return;
    var vus = filmsVus().vus;
    filmsEnAttente = filmsEnAttente.filter(function (f) { return !vus[f.id]; });
    var f = filmsEnAttente.shift();
    if (f) jouerFilmApercu(f).then(function () { enchainerFilms([]); });
  }
  crochet("debut", function (v) { if (v && !v.over) enchainerFilms(filmsDuMoment("debut")); });
  crochet("carte", function (v) {
    if (!v || v.over || !v.card) return;
    enchainerFilms(filmsDuMoment("carte", { carte: v.card.id, moment: "avant" }));
  });
  crochet("reponse", function (r) {
    if (!r || !r.apres || r.apres.over) return;
    var apres = r.avant && r.avant.card ? filmsDuMoment("carte", { carte: r.avant.card.id, moment: "apres", vue: r.apres }) : [];
    var drap = filmsDuMoment("drapeau", { vue: r.apres }).filter(function (f) { return !((r.avant && r.avant.flags) || []).some(function (x) { return x === f.drapeau; }); });
    enchainerFilms(apres.concat(drap.filter(function (f) { return apres.indexOf(f) < 0; })));
  });
  if (window.FusibleCinema && window.FusibleContenu) {
    // le livre choisi, ses films d'avance (les fichiers seulement, rien ne s'exécute)
    crochet("debut", function () {
      setTimeout(function () {
        ((content.ville && content.ville.films) || []).forEach(function (f) { if (window.FusibleCinema.disponible(f.module)) window.FusibleCinema.prechauffer(f.module); });
      }, 6000);
    });
  }
