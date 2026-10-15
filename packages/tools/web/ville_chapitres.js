  // ═══════════════════════════════════════════════════════════════════════════
  // LES CHAPITRES — ville_chapitres.js, inséré par assemble.js dans la fermeture de
  // ville.js (au repère `__VILLE_MODULES__`) : il voit et touche tout ce que la ville
  // connaît.
  //
  // Un chapitre par semaine de jeu. Quand la semaine se referme — le dimanche soir qui
  // passe au lundi, la ville le sait par le crochet « jour » —, un panneau plein écran,
  // dans le style du journal du jeu : « Une de la semaine » (la manchette : ce que
  // l'Almanach a retenu de neuf, le match, un lien qui a changé, une dette, la décision
  // qui a pesé ; et deux ou trois brèves), puis « La semaine prochaine… » : ce qu'on sait
  // de ce qui attend (le rendez-vous, la mission et son délai, la dette à rendre, le match
  // du samedi). Deux boutons : [Continuer], ou [Reprendre plus tard] — la partie est
  // sauvée, on retourne à l'accueil, et l'on reprend au lundi matin.
  //
  // Pourquoi le passage au lundi, et non le rendez-vous du dimanche (« Le journal du
  // dimanche · chez toi », `rdv.type === "dimanche"`) : ce rendez-vous n'existe que sur les
  // cartes Classement, deux fois par saison ; une semaine sur six aurait eu son chapitre.
  // La semaine, elle, se referme toujours.
  //
  // Au retour d'une partie sauvée (crochet « reprise ») : « Pendant ton absence… », ce qui
  // attend. Le prochain rendez-vous est aussi gardé dans `fusible.rappel` (localStorage),
  // pour que l'accueil puisse le dire.
  //
  // Ce que la ville tient pour la Une : `S.chap`, le carnet de la semaine (les liens et les
  // dettes du lundi, l'Almanach déjà lu, les réponses données, le match) — sauvé avec le reste
  // de `S`, repris au retour. Le moteur ne l'expose pas : la ville le déduit de ses vues.
  // ═══════════════════════════════════════════════════════════════════════════
  var CLE_RAPPEL = "fusible.rappel";
  var DEVISES_CH = { quotidien: "Le journal qui siffle avant l'arbitre", gazette: "Tout ce qu'on n'ose pas dire, en rose", echo: "Le journal de ta rue, depuis toujours" };
  var CH_CARTES_MAX = 8;       // les réponses retenues d'une semaine
  var CH_POIDS = { fin: 90, titre: 80, montee: 80, descente: 80, club: 75, role: 75, objectif: 60, arc: 55, palier: 50, une: 35 };
  var CHAP_DU = null;          // la Une qui attend d'être montrée : { recap, paie }
  var CHAPITRE = null;         // la Une à l'écran : { iv }
  var CHAP_T = 0;
  var RAPPEL_VU = "";
  var ABONNE_CH = false;

  function chMaj(t) { t = String(t == null ? "" : t); return t.charAt(0).toUpperCase() + t.slice(1); }
  // couper à la fin d'un mot, avec une ellipse
  function chCouper(t, max) {
    t = String(t || "").replace(/\s+/g, " ").trim();
    if (t.length <= max) return t;
    var c = t.slice(0, max - 1), i = c.lastIndexOf(" ");
    return (i > max * 0.6 ? c.slice(0, i) : c).replace(/[\s,;:.\-–—]+$/, "") + "…";
  }
  function chOrd(n, fem) { return n === 1 ? (fem ? "1re" : "1er") : n + "e"; }
  // le nom qu'on dit (le surnom entre guillemets s'il y en a un : ville_gens.js)
  function chNom(id) { return typeof nomCourt === "function" ? nomCourt(id) : nomDe(id); }
  // « mardi · soir », « lundi prochain · matin »
  function chQuand(t) {
    var tr = TRANCHES[trancheDe(t)];
    return JOUR_MOT[jourDe(t)] + (semaineDe(t) > S.semaine ? " prochain" : "") + " · " + (tr === "aprem" ? "après-midi" : tr);
  }

  // ─── ce qu'on sait de ce qui attend
  // Le moteur sert les temps dans l'ordre du calendrier (`vue.beats`, `vue.beat`) : s'il y a un match
  // dans les temps qui viennent, avant que les trois places de la semaine (lundi, mercredi, vendredi)
  // soient prises, c'est celui de ce samedi (planifier, ville.js).
  function chMatch() {
    var B = (vue && vue.beats) || [], b = (vue && vue.beat) || 0, libres = Math.max(0, 3 - (S.cartesSemaine || 0)), n = 0;
    for (var i = b; i < B.length && i < b + 8; i++) {
      var k = B[i];
      if (k === "match" || k === "cup") return { jour: STADE_JOURS[k], coupe: k === "cup" };
      if (k === "card" || k === "objective") { if (++n > libres) return null; continue; }
      if (k === "prologue") continue;
      return null;
    }
    return null;
  }
  // des lignes { q: quand, t: quoi }, dans l'ordre où cela viendra ; jamais l'événement sombre
  // (il ne s'annonce pas)
  function chAgenda() {
    var rows = [], v = vue || {};
    if (!S) return rows;
    var maintenant = tNow();
    if (rdv && !rdv.sombre && LIEU[rdv.lieu] && rdv.lieu !== "ici" && rdv.lieu !== "rue") {
      var ou = nomLieu(LIEU[rdv.lieu]), qui = rdv.qui && CHARS[rdv.qui] ? nomDe(rdv.qui) : "";
      if (rdv.type === "match") rows.push({ o: rdv.debut, q: chQuand(rdv.debut), t: (v.card && v.card.beatKind === "cup" ? "La Coupe" : "Le match") + " · " + ou });
      else if (rdv.type === "dimanche") rows.push({ o: rdv.debut, q: JOUR_MOT[jourDe(rdv.debut)], t: "Le journal du dimanche · chez toi" });
      else rows.push({ o: Math.max(rdv.debut, maintenant), q: maintenant >= rdv.debut ? "maintenant" : chQuand(rdv.debut), t: (qui ? qui + " t'attend" : "On t'attend") + " · " + ou });
    }
    var m = !(rdv && rdv.type === "match") && LIEU.stade ? chMatch() : null;
    if (m) rows.push({ o: tDe(S.semaine, m.jour, m.coupe ? 3 : 2), q: JOUR_MOT[m.jour] + " · " + HEURE[TRANCHES[m.coupe ? 3 : 2]], t: (m.coupe ? "La Coupe" : "Le match") + " · " + nomLieu(LIEU.stade) });
    var sm = S.mission, mi = sm && !sm.offre && MISSION[sm.id];
    if (mi && LIEU[sm.lieu]) {
      rows.push({ o: sm.jusqua, q: "avant " + quand(sm.jusqua), t: mi.titre + " · " + nomLieu(LIEU[sm.lieu]) +
        (sm.tranches && sm.tranches.length ? ", " + sm.tranches.map(function (x) { return TRANCHE_MOT[x].toLowerCase(); }).join(" ou ") : "") });
    }
    (v.flags || []).forEach(function (f) {
      if (f.indexOf("dette_") !== 0) return;
      var id = f.slice(6);
      rows.push({ o: 1e9, q: "à rendre", t: "Tu dois quelque chose à " + (CHARS[id] ? chNom(id) : "quelqu'un") + "." });
    });
    if (S.francs < 0) rows.push({ o: 1e9 + 1, q: "la banque", t: "Découvert : " + argent(-S.francs) + ". La prochaine paie doit le combler." });
    // un quartier qui s'est ouvert cette semaine (son message se perdrait sous le panneau)
    if (typeof GRAND_Q !== "undefined" && S.semaine > 1) {
      Object.keys(GRAND_Q).sort().forEach(function (k) { if (S.quartiers && S.quartiers[k] === S.semaine) rows.push({ o: -1, q: "nouveau", t: GRAND_Q[k].ligne }); });
    }
    rows.sort(function (a, b) { return a.o - b.o; });
    return rows.slice(0, 6);
  }
  function chAgendaHtml(rows) {
    return '<ul class="v-agenda">' + rows.map(function (x) { return '<li><b>' + esc(x.q) + '</b><span>' + esc(x.t) + '</span></li>'; }).join("") + '</ul>';
  }

  // ─── le carnet de la semaine
  function chLigne(t) { return String(t || "").replace(/^\s*\d{4}\s*[·:–-]\s*/, "").trim(); }
  // les lignes de l'Almanach de la saison en cours (la frise : ce que le moteur en montre)
  function chAlmanach(v) {
    var sa = (v && v.frise && v.frise.saisons) || [], cur = sa[sa.length - 1], out = [];
    ((cur && cur.evenements) || []).forEach(function (e) {
      out.push({ h: hache("alm", e.type, e.label).toString(36), t: chLigne(e.label), w: CH_POIDS[e.type] || 30 });
    });
    return out;
  }
  // une semaine qui commence : où en sont les liens, les dettes, l'Almanach, la caisse
  function chCarnetNeuf() {
    var v = vue || {}, rel = {}, dettes = [];
    Object.keys(v.relations || {}).sort().forEach(function (k) { if (v.relations[k]) rel[k] = v.relations[k]; });
    (v.flags || []).forEach(function (f) { if (f.indexOf("dette_") === 0) dettes.push(f); });
    return { s: S.semaine, rel: rel, dettes: dettes, alm: chAlmanach(v).map(function (e) { return e.h; }).slice(-40), cartes: [], match: null, fr: Math.round(S.francs) };
  }
  function chCarnet() { return S.chap || (S.chap = chCarnetNeuf()); }
  // chaque réponse donnée : le moteur l'annonce (`reponse`, la coquille), la ville la retient pour la Une
  function chNoterReponse(a) {
    if (!S || !a || !a.avant || !a.avant.card) return;
    var c = a.avant.card, lab = a.droite ? c.rightLabel : c.leftLabel;
    if (!lab || /^(classement|bilan_une)$/.test(c.beatKind || "")) return;
    var ch = c.speaker ? CHARS[c.speaker] : null, C = chCarnet();
    C.cartes.push({ q: c.speaker || "", n: c.speakerName || (ch && ch.name) || "", l: String(lab).slice(0, 40), k: c.kind || "", b: c.beatKind || "" });
    if (C.cartes.length > CH_CARTES_MAX) C.cartes.shift();
  }
  // les moments de la page (la coquille) : on s'y abonne au premier départ ou à la première reprise
  function abonnerCh() {
    var A = window.FusibleApercu;
    if (ABONNE_CH || !A || !A.crochet) return;
    ABONNE_CH = true;
    A.crochet("reponse", function (a) { chNoterReponse(a); direAideVille(); });
    A.crochet("fin", function () { RAPPEL_VU = ""; try { localStorage.removeItem(CLE_RAPPEL); } catch (e) {} });
  }

  // ─── la Une de la semaine qui finit
  // `finie` : la semaine vient de se refermer (S.semaine est déjà celle d'après : le journal date la précédente)
  function chRecap(finie) {
    var C = chCarnet(), v = vue || {}, ent = v.entities || {}, items = [], ordre = 0, hero = ent.protagonist || ent.prenom || "Toi";
    // une ligne pour les brèves (`b`), une pour la manchette (`t`), d'où elle vient (`src`), qui y est (`q`)
    function ajoute(w, b, t, q, src) { if (b) items.push({ w: w, b: b, t: t || b, q: q || null, src: src, o: ordre++ }); }
    // 1. ce que l'Almanach a retenu de neuf
    chAlmanach(v).forEach(function (e) { if (C.alm.indexOf(e.h) < 0) ajoute(e.w, chCouper(e.t, 110), chCouper(e.t, 92), null, "alm"); });
    // 2. une dette est née
    (v.flags || []).forEach(function (f) {
      if (f.indexOf("dette_") !== 0 || C.dettes.indexOf(f) >= 0) return;
      var id = f.slice(6), nom = CHARS[id] ? chNom(id) : "quelqu'un";
      ajoute(62, "Tu dois quelque chose à " + nom + ".", hero + " doit un service à " + nom, id, "dette");
    });
    // 3. un lien a changé de cran
    var ra = C.rel || {}, rb = v.relations || {}, ids = {};
    Object.keys(ra).concat(Object.keys(rb)).forEach(function (id) { ids[id] = 1; });
    Object.keys(ids).sort().forEach(function (id) {
      var a0 = +ra[id] || 0, b0 = +rb[id] || 0, monte = b0 > a0;
      if (a0 === b0 || !(CHARS[id] || (typeof gensDe === "function" && gensDe(id)))) return;
      var dit = typeof phrasePalier === "function" ? phrasePalier(id, b0, monte) : chNom(id) + (monte ? " te fait confiance." : " a pris ses distances.");
      ajoute(45 + 8 * Math.min(3, Math.abs(b0 - a0)), dit, dit, id, "lien");
    });
    // 4. le match de la semaine
    var M = C.match;
    if (M) {
      var adv = M.a || "les visiteurs", sc = M.gf + "–" + M.ga, jour = chMaj(JOUR_MOT[M.j] || "samedi");
      var mot = M.l === "V" ? "victoire" : M.l === "D" ? "défaite" : "match nul";
      ajoute(M.l === "D" ? 58 : M.l === "V" ? 52 : 40, jour + ", " + mot + " " + sc + " contre " + adv + ".", chMaj(mot) + " " + sc + " contre " + adv, null, "match");
    }
    // 5. les réponses données : ce qu'on a dit, et à qui
    var POIDS_K = { evenement: 45, alarme: 36, etape: 32, palier: 30, nouvelle: 24, passe: 24, reaction: 18 };
    C.cartes.forEach(function (c) {
      var nom = c.n || (c.q && CHARS[c.q] ? chNom(c.q) : ""), lab = "« " + chMaj(c.l).replace(/[.\s]+$/, "") + " »";
      ajoute((POIDS_K[c.k] || 22) + (c.b === "objective" ? 10 : 0), (nom ? "À " + nom + " : " : "Ta réponse : ") + lab,
        nom ? lab + " : " + hero + " répond à " + nom : hero + " a tranché : " + lab, c.q || null, "carte");
    });
    // la plus lourde en manchette, les suivantes en brèves
    items.sort(function (a, b) { return (b.w - a.w) || (a.o - b.o); });
    var vus = {}, uniques = items.filter(function (x) { if (vus[x.b]) return false; vus[x.b] = 1; return true; });
    var haut = uniques[0] || null, breves = uniques.slice(1, 4).map(function (x) { return x.b; });
    // une semaine creuse : ce qu'on peut dire quand même (la caisse, le rang)
    var rang = (v.journee || 0) > 0 && v.rank ? v.rank : 0, d = Math.round(S.francs - (C.fr || 0));
    var creux = [
      "En caisse : " + argent(S.francs) + (d ? " (" + (d > 0 ? "+" : "−") + argent(Math.abs(d)) + " sur la semaine)" : "") + ".",
      rang ? "Classement : " + chOrd(rang) + " après la " + chOrd(v.journee, true) + " journée." : "",
      "Aucune visite imprévue, aucun mot de travers : la semaine a tenu à peu de chose."
    ];
    for (var i = 0; breves.length < 2 && i < creux.length; i++) if (creux[i]) breves.push(creux[i]);
    var ville = ent.ville || "Aubérive";
    var titre = haut ? haut.t : [ville + " retient son souffle", "Semaine creuse : le journal remplit avec le temps qu'il fait", "Une semaine pour rien, et personne n'est dupe", "Rien à signaler, dit-on. On le dit toujours trop tôt."][(C.s || 0) % 4];
    // qui est sur la photo : celui de la manchette ou des brèves, sinon toi
    var qui = "toi";
    for (var j = 0; j < Math.min(4, uniques.length); j++) if (uniques[j].q && CHARS[uniques[j].q]) { qui = uniques[j].q; break; }
    var src = haut ? haut.src : "";
    if (finie) S.semaine -= 1;
    var mois = moisCourant();
    if (finie) S.semaine += 1;
    return {
      n: C.s || Math.max(1, S.semaine - 1), titre: titre, breves: breves, qui: qui,
      ton: ((v.relations || {})[qui] || 0) >= 1 ? "sourire" : ((v.relations || {})[qui] || 0) <= -1 ? "noir" : "neutre",
      journal: src === "match" ? "quotidien" : (src === "lien" || src === "dette") ? "gazette" : "echo",
      rang: rang, caisse: argent(S.francs), mois: mois, club: ent.club || v.club || "", ville: ville, hero: hero
    };
  }
  function chPageUne(r, d) {
    var C = (window.FusibleApercu && window.FusibleApercu.contenu) || {}, J = (C.journaux || []).filter(function (j) { return j.id === r.journal; })[0];
    var nomJ = J ? String(J.nom).split("{ville}").join(r.ville).replace(/ de ([AEIOUYÀÂÉÈÊÎÔ])/, " d'$1") : "Le journal";
    var taille = r.titre.length <= 38 ? "" : r.titre.length <= 62 ? " m28" : " m24";
    var nomPhoto = r.qui === "toi" ? r.hero : chNom(r.qui);
    var html = '<div class="une v-une">' +
      '<div class="masthead"><h1><span>' + esc(nomJ) + '</span><small>' + esc(DEVISES_CH[r.journal] || "") + '</small></h1></div>' +
      '<div class="dateline"><span>Chapitre ' + r.n + '</span><span>' + esc(r.mois) + '</span>' + (r.club ? '<span>' + esc(r.club) + '</span>' : "") + '</div>' +
      '<h2 class="etitle' + taille + '">' + esc(r.titre) + '</h2>' +
      '<div class="body-grid"><div class="une-photo"><div class="shot v-une-photo"></div><div class="legend"><b>' + esc(nomPhoto) + '</b> (photo d\'archives)</div></div>' +
      '<div class="sidebar"><div class="box"><div class="bh">En bref</div><ul class="breves">' + r.breves.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join("") + '</ul></div></div></div>' +
      '<div class="pied"><span>' + (r.rang ? 'Classement : <b>' + esc(chOrd(r.rang)) + '</b>' : 'Semaine <b>' + r.n + '</b>') + '</span><span>Caisse : <b>' + esc(r.caisse) + '</b></span></div></div>' +
      '<div class="v-ch-btns"><button type="button" class="v-ch-go">La semaine prochaine ›</button></div>';
    coquille.panneau("Une de la semaine", html);
    var photo = document.querySelector("#panelBody .v-une-photo");
    if (photo) { try { portraitCine(photo, r.qui, r.ton); } catch (e) {} }
    var b = document.querySelector("#panelBody .v-ch-go");
    if (b) b.addEventListener("click", function () { chPageSemaine(d); });
  }
  function chPageSemaine(d) {
    var rows = chAgenda(), h = heureCourante();
    var html = '<div class="v-sem"><p class="v-sem-sous">' + esc(h.jour + ", " + h.heure + " · semaine " + S.semaine) + '</p>' +
      (rows.length ? chAgendaHtml(rows) : '<p class="v-sem-vide">Rien n\'est promis. La semaine est à prendre.</p>') +
      (d.paie ? '<p class="v-paie">' + esc(d.paie) + '</p>' : "") + '</div>' +
      '<div class="v-ch-btns"><button type="button" class="v-ch-go">Continuer</button><button type="button" class="v-ch-pause">Reprendre plus tard</button>' +
      '<p class="v-ch-note">Ta partie est gardée ici : tu reprendras ce ' + esc(JOUR_MOT[S.jour]) + (S.tranche === 0 ? " matin" : "") + '.</p></div>';
    coquille.panneau("La semaine prochaine…", html);
    document.querySelector("#panelBody .v-ch-go").addEventListener("click", function () { coquille.fermer(); });
    document.querySelector("#panelBody .v-ch-pause").addEventListener("click", chPause);
  }
  // la Une est due : on la montre (le temps s'arrête), puis `apres` ; sinon `apres` tout de suite
  function chapitreSiDu(apres) {
    if (!CHAP_DU || !coquille || !actif || !S || (vue && vue.over)) { CHAP_DU = null; if (apres) apres(); return false; }
    var d = CHAP_DU;
    CHAP_DU = null;
    occupe = true;
    fermerPorte();
    var f = $("villeFondu");
    f.classList.remove("on"); f.classList.remove("court");
    if (coquille.son) coquille.son("nouvelle");
    try { chPageUne(d.recap, d); } catch (e) {
      // la Une ne se montre pas : la ville ne reste pas figée pour autant
      if (window.console) console.error("chapitre", e);
      occupe = false;
      if (apres) apres();
      return false;
    }
    // le panneau se referme (le bouton, la croix, une touche) : la suite
    var iv = setInterval(function () {
      if (coquille.panneauOuvert()) return;
      clearInterval(iv);
      CHAPITRE = null;
      occupe = false;
      if (apres) apres();
    }, 200);
    CHAPITRE = { iv: iv };
    return true;
  }
  // la semaine s'est refermée sans que rien ne l'ait montrée (un événement a pris la main, un geste
  // a passé la nuit) : dès que la ville est au repos, la Une
  function guetterChapitre(ts) {
    if (!CHAP_DU || ts - CHAP_T < 400) return;
    CHAP_T = ts;
    if (occupe || carteOn || CINE || MATCH || LAPS || !actif || attente.length) return;
    if ($("villeFondu").classList.contains("on") || (coquille && coquille.panneauOuvert())) return;
    chapitreSiDu(function () { if (!echeance()) sceneDue(); });
  }
  // le dimanche soir passe au lundi : la Une de la semaine qui finit attend son moment ; la paie
  // n'a plus de fondu à part, sa ligne est dans le chapitre
  crochetVille("jour", function () {
    if (!S || S.jour !== 0 || !actif || (vue && vue.over)) return;
    // (si la Une ne se compose pas, la paie garde son fondu : on la retire de la file après)
    var recap = chRecap(true), paie = null;
    attente = attente.filter(function (a) { if (a.paie) { paie = a.texte; return false; } return true; });
    CHAP_DU = { recap: recap, paie: paie };
    S.chap = chCarnetNeuf();
  });
  // le match du samedi : son résultat (celui que la ville met en scène) pour la Une ; sans score lisible, rien
  crochetVille("match", function (M) {
    if (!M || M.gf == null || M.ga == null) return;
    chCarnet().match = { a: M.advVille, gf: M.gf, ga: M.ga, l: M.lettre, j: S.jour };
  });
  crochetVille("debut", function () {
    abonnerCh();
    S.chap = chCarnetNeuf();
    CHAP_DU = null; RAPPEL_VU = "";
  });

  // ─── « Reprendre plus tard » : la partie est sauvée, on retourne à l'accueil
  // C'est `fin()` (l'API de la ville) moins l'effacement de la sauvegarde : la ville s'arrête, le
  // bouton « Reprendre » de l'accueil se remet à jour, et la reprise (`reprendre`) rend tout.
  function chPause() {
    if (!S || !coquille) return;
    if (CHAPITRE) clearInterval(CHAPITRE.iv);
    CHAPITRE = null; CHAP_DU = null; LAPS = false;
    coquille.fermer();
    occupe = false; carteOn = false;
    attente = [];
    fermerPorte();
    // ni message du récit ni intitulé de lieu qui traînent sur l'accueil
    cacherCartouche();
    clearTimeout(toastT);
    var to = $("villeToast"); if (to) to.classList.remove("on");
    sauver();
    if (dedans) aDehors(true);
    actif = false;
    if (cv) cv.hidden = true;
    var c = $("villeCouche"); if (c) c.hidden = true;
    var f = $("villeFondu"); if (f) { f.classList.remove("on"); f.classList.remove("court"); }
    $("villeVoile").classList.remove("on");
    $("gameScreen").classList.remove("carte-on");
    document.body.classList.remove("v-en-scene");
    if (window.FusibleApercu && window.FusibleApercu.accueil) window.FusibleApercu.accueil();
    else if (coquille.ecran) coquille.ecran("title");
    setTimeout(function () { if (typeof boutonReprendre === "function") boutonReprendre(); }, 0);
  }

  // ─── au retour : « Pendant ton absence… »
  function chRappelRetour() {
    if (!S || !actif || !coquille || (vue && vue.over) || CINE || MATCH || CHAPITRE || coquille.panneauOuvert()) return;
    var rows = chAgenda();
    if (!rows.length) return;
    var h = heureCourante();
    coquille.panneau("Pendant ton absence…", '<div class="v-sem"><p class="v-sem-sous">' + esc(h.jour + ", " + h.heure + " · semaine " + S.semaine) + '</p>' + chAgendaHtml(rows) + '</div>' +
      '<div class="v-ch-btns"><button type="button" class="v-ch-go">Continuer</button></div>');
    document.querySelector("#panelBody .v-ch-go").addEventListener("click", function () { coquille.fermer(); });
  }
  crochetVille("reprise", function () {
    abonnerCh();
    if (!S.chap) S.chap = chCarnetNeuf();
    CHAP_DU = null; RAPPEL_VU = "";
    setTimeout(chRappelRetour, 700);
  });

  // ─── pour l'accueil : le prochain rendez-vous de la partie, en une ligne (`fusible.rappel`)
  //   { v: 1, histoire: <id du postulat>, index, texte: « Gégé t'attend · Le Corner · mardi · soir »,
  //     qui, lieu, quand, semaine, t: <Date.now()> } ; la clé disparaît quand rien n'est promis
  function chProchainRdv() {
    if (!S || !rdv || rdv.sombre || !LIEU[rdv.lieu] || rdv.lieu === "ici" || rdv.lieu === "rue") return null;
    var ou = nomLieu(LIEU[rdv.lieu]), qui = rdv.qui && CHARS[rdv.qui] ? nomDe(rdv.qui) : "", maintenant = tNow(), quoi;
    if (rdv.type === "match") quoi = (vue && vue.card && vue.card.beatKind === "cup" ? "La Coupe" : "Le match") + " · " + ou;
    else if (rdv.type === "dimanche") quoi = "Le journal du dimanche · chez toi";
    else quoi = (qui ? qui + " t'attend" : "On t'attend") + " · " + ou;
    var q = rdv.type !== "match" && rdv.type !== "dimanche" && maintenant >= rdv.debut ? "avant " + quand(rdv.fin) : chQuand(rdv.debut);
    return { texte: quoi + " · " + q, qui: qui, lieu: ou, quand: q };
  }
  function rappelEcrire() {
    if (!S || !actif || !coquille) return;
    var r = chProchainRdv(), cle = "";
    if (r) {
      var g = (coquille.graine && coquille.graine()) || {}, P = window.FusibleApercu && window.FusibleApercu.postulats && window.FusibleApercu.postulats[g.postulat];
      cle = JSON.stringify({ v: 1, histoire: (P && P.id) || "", index: g.postulat || 0, texte: r.texte, qui: r.qui, lieu: r.lieu, quand: r.quand, semaine: S.semaine });
    }
    if (cle === RAPPEL_VU) return;
    RAPPEL_VU = cle;
    try {
      if (cle) localStorage.setItem(CLE_RAPPEL, cle.slice(0, -1) + ',"t":' + Date.now() + "}");
      else localStorage.removeItem(CLE_RAPPEL);
    } catch (e) {}
  }

  // pour les essais (packages/tools/web, le banc de la ville) : voir la Une, le rappel, la pause à la demande
  window.FusibleVilleChapitres = {
    recap: function () { return S ? chRecap() : null; },
    agenda: function () { return chAgenda(); },
    ouvrir: function (paie) { if (!S) return false; CHAP_DU = { recap: chRecap(), paie: paie || null }; return chapitreSiDu(); },
    rappel: function () { chRappelRetour(); },
    pause: function () { chPause(); },
    du: function () { return !!CHAP_DU; },
    carnet: function () { return S ? chCarnet() : null; },
    // le temps qui passe est-il en cours (ville_rythme.js) ? : un essai qui attend que la ville soit au repos
    laps: function () { return LAPS; }
  };
