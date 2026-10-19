  // ═══ NOTER LE JEU SUR LES STORES (docs/sortie.md, « La note sur les stores ») ═════════
  // La fenêtre de note est celle du téléphone : SKStoreReviewController chez Apple, l'« in-app
  // review » de Google Play. Apple refuse les fenêtres de note maison ; Google interdit de poser
  // une question avant ou pendant la sienne, et de la recouvrir. La page ne dessine donc rien :
  // elle choisit le moment, et le demande à l'application (`window.FusibleNatif.demanderNote()`,
  // que pose la coquille iOS ou Android). Le système décide encore s'il l'affiche (Apple : trois
  // fois par an au plus ; Google : un quota). Hors de l'application (le web, la bêta), rien.
  //
  // Le moment : au retour à l'accueil après la fin d'un livre (pas du mode éclair), jamais pendant
  // une carte, un film ou un match ; si le joueur a joué deux jours différents et quarante-cinq
  // minutes ; au plus une fois tous les soixante jours, trois fois en tout ; plus jamais après
  // qu'il a touché « Noter » sur l'accueil (le lien vers la fiche, toujours là dans l'application).
  var NOTE_CLE = "fusible.note.v1";
  var NOTE = { jours: 2, minutes: 45, ecartJours: 60, foisMax: 3 };
  function noteEtat() {
    try { return JSON.parse(localStorage.getItem(NOTE_CLE) || "{}") || {}; } catch (e) { return {}; }
  }
  function noteGarder(e) {
    try { localStorage.setItem(NOTE_CLE, JSON.stringify(e)); } catch (x) { /* la mémoire de la session */ }
  }
  function noteNatif() {
    var N = window.FusibleNatif;
    return N && typeof N.demanderNote === "function" ? N : null;
  }
  // la décision, sans effet de bord : on la teste telle quelle (window.FusibleNote.decision)
  function noteDecision(e, maintenant, natif) {
    if (!natif) return { ok: false, raison: "hors de l'application" };
    if (e.fini) return { ok: false, raison: "le joueur a déjà ouvert la fiche" };
    if ((e.fois || 0) >= NOTE.foisMax) return { ok: false, raison: "déjà demandé " + NOTE.foisMax + " fois" };
    if ((e.jours || []).length < NOTE.jours) return { ok: false, raison: "pas encore " + NOTE.jours + " jours de jeu" };
    if ((e.minutes || 0) < NOTE.minutes) return { ok: false, raison: "pas encore " + NOTE.minutes + " minutes de jeu" };
    if (e.derniere && maintenant - e.derniere < NOTE.ecartJours * 864e5) return { ok: false, raison: "demandé il y a moins de " + NOTE.ecartJours + " jours" };
    return { ok: true, raison: "le bon moment" };
  }

  // les jours et le temps de jeu : un jour compte quand la page s'ouvre, le temps quand elle est visible
  (function () {
    var e = noteEtat(), d = new Date(), j = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    e.jours = e.jours || [];
    if (e.jours.indexOf(j) < 0) { e.jours.push(j); if (e.jours.length > 10) e.jours.shift(); }
    noteGarder(e);
    var t0 = Date.now();
    function compter() {
      var n = noteEtat();
      n.minutes = Math.round(((n.minutes || 0) + (Date.now() - t0) / 60000) * 10) / 10;
      t0 = Date.now();
      noteGarder(n);
    }
    document.addEventListener("visibilitychange", function () { if (document.hidden) compter(); else t0 = Date.now(); });
    setInterval(function () { if (!document.hidden) compter(); }, 60000);
  })();

  // la fin d'un livre arme le moment ; le retour à l'accueil le joue
  var noteArmee = false;
  crochet("fin", function (v) {
    noteArmee = !!(v && v.ending) && v.mode !== "eclair";
  });
  crochet("accueil", function () {
    noteBouton();
    if (!noteArmee) return;
    noteArmee = false;
    var e = noteEtat(), N = noteNatif(), d = noteDecision(e, Date.now(), N);
    if (!d.ok) return;
    e.fois = (e.fois || 0) + 1; e.derniere = Date.now();
    noteGarder(e);
    // l'accueil se pose d'abord, la fenêtre du système vient après
    setTimeout(function () { try { N.demanderNote(); } catch (x) { /* le système a refusé : rien à dire */ } }, 1500);
  });

  // « Noter », sur l'accueil, dans l'application seulement : le lien vers la fiche du store
  // (le joueur l'a choisi : on ne lui demandera plus rien)
  function noteBouton() {
    var N = noteNatif();
    if (!N || typeof N.ouvrirFiche !== "function" || document.getElementById("accNoter")) return;
    var ecran = document.getElementById("titleScreen");
    if (!ecran) return;
    var b = document.createElement("button");
    b.type = "button"; b.id = "accNoter"; b.className = "acc-noter";
    b.textContent = N.plateforme === "android" ? "Noter sur Google Play" : "Noter sur l'App Store";
    b.addEventListener("click", function () {
      var e = noteEtat(); e.fini = true; noteGarder(e);
      try { N.ouvrirFiche(); } catch (x) { /* la fiche ne s'ouvre pas : tant pis */ }
    });
    var avis = document.getElementById("accAvis"), cim = document.getElementById("cimetiere");
    var apres = avis || cim;
    if (apres && apres.parentNode === ecran) ecran.insertBefore(b, apres.nextSibling); else ecran.appendChild(b);
  }
  (function () {
    var s = document.createElement("style");
    s.textContent = ".acc-noter{display:block;margin:14px auto 6px;min-height:44px;padding:8px 16px;cursor:pointer;" +
      "font-family:var(--pix,monospace);font-size:18px;background:transparent;color:var(--a-texte2,#CBC1E2);" +
      "border:2px solid var(--a-ligne,#352B52)}";
    document.head.appendChild(s);
  })();
  noteBouton();

  window.FusibleNote = {
    etat: noteEtat,
    decision: function (e, maintenant) { return noteDecision(e || noteEtat(), maintenant || Date.now(), noteNatif()); },
    regles: NOTE
  };
