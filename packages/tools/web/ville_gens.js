  // ═══════════════════════════════════════════════════════════════════════════
  // LA VILLE VIVANTE — ville_gens.js, inséré par assemble.js dans la fermeture de
  // ville.js (au repère `__VILLE_MODULES__`). Aubérive se souvient
  // (docs/histoires/ville_vivante.md) : les gens qui tiennent les lieux selon
  // l'époque, ce qu'ils disent selon le lien, le climat de leur réseau, leurs
  // tuyaux, leur service, et le carnet (« Carnet » : les gens, ce qu'on t'a confié,
  // ce qu'on dit de toi). Le moteur tient le compte (la relation, les points de
  // lien, les habitudes, les drapeaux) ; la coquille montre, et ne compte rien.
  // ═══════════════════════════════════════════════════════════════════════════
  var GENS = null, GENS_LISTE = [];
  // le réseau qui dit une jauge cachée, et laquelle
  var RESEAU_JAUGE = { tribunes: "tribunes", vestiaire: "vestiaire", direction: "direction", argent: "caisse" };
  var RESEAU_MOT = { presse: "La presse", rue: "La rue", milieu: "Le milieu", mairie: "La mairie", sante: "Les cabinets", familles: "Les familles", police: "La police" };
  var PALIERS = ["te reconnaît", "te tutoie", "ferait beaucoup pour toi"], FROID = ["te boude", "t'en veut", "ne te sert plus"];
  // les voix anonymes que joue celui qui tient le lieu (les conversations surprises, ville_cinema.js)
  var QUI_TENANCIER = { commercant: 1, commercant2: 1, garagiste: 1 };
  // ce que la ville dit de toi, quand une habitude devient une réputation
  var REPUTATION = {
    comptoir: "un pilier de comptoir", nuit: "un oiseau de nuit", jeu: "{pg, select, f{une joueuse} other{un joueur}}",
    sport: "{pg, select, f{une infatigable} other{un infatigable}}", soin: "quelqu'un qui se ménage",
    culture: "{pg, select, f{une liseuse} other{un liseur}}", foi: "{pg, select, f{une fidèle} other{un fidèle}}",
    famille: "quelqu'un de présent pour les siens", largesse: "quelqu'un qui ne compte pas",
    luxe: "{pg, select, f{une flambeuse} other{un flambeur}}", quartier: "{pg, select, f{une enfant du pays} other{un enfant du pays}}",
    travail: "un bourreau de travail"
  };
  var HABITUDE_MOT = { comptoir: "Le comptoir", nuit: "La nuit", jeu: "Le jeu", sport: "Le sport", soin: "Le repos, les soins", culture: "Lire, regarder",
    foi: "L'église, les tombes", famille: "Les tiens", largesse: "Donner", luxe: "Le luxe", quartier: "Le quartier", travail: "Le travail" };

  var GENS_PAR_LIEU = {}, LIEUX_GENS = [];
  function chargerGens() {
    if (GENS) return;
    GENS = {}; GENS_LISTE = []; GENS_PAR_LIEU = {};
    // dans l'ordre du contenu : le premier d'un lieu le tient
    (D.gens || []).forEach(function (g) { GENS[g.id] = g; GENS_LISTE.push(g); (GENS_PAR_LIEU[g.lieu] = GENS_PAR_LIEU[g.lieu] || []).push(g); });
    LIEUX_GENS = Object.keys(GENS_PAR_LIEU).sort();
  }
  function gensDe(id) { chargerGens(); return (id && GENS[id]) || null; }
  function aFlag(f) { return ((vue && vue.flags) || []).indexOf(f) >= 0; }
  function lienDe(id) { return +(((vue && vue.relations) || {})[id] || 0); }
  function pointsDe(id) { return +(((vue && vue.vars) || {})["lien_" + id] || 0); }
  function habitudeDe(h) { return +(((vue && vue.vars) || {})["hab_" + h] || 0); }
  function seuilsLien() { return (D.vivante && D.vivante.liens) || [2, 5, 9]; }
  function seuilReputation() { return (D.vivante && D.vivante.reputation) || 10; }
  // le nom qu'on dit : le surnom entre guillemets s'il y en a un (« Lulu »), sinon le nom
  function nomCourt(id) {
    var n = nomDe(id), m = /«\s*([^»]+?)\s*»/.exec(n);
    return m ? m[1] : n;
  }
  function sonGens(nom) { if (coquille && coquille.son) coquille.son(nom); }
  function memoGens(id) {
    S.gensMemo = S.gensMemo || {};
    return S.gensMemo[id] = S.gensMemo[id] || { dits: {}, n: 0, climat: -1, cl: -1 };
  }
  // de son époque, de ton rôle, encore de ce monde
  function gensVivant(g) {
    if (!g || !vue || !S) return false;
    var an = vue.year || 1990;
    if (g.annees && (an < g.annees[0] || an > g.annees[1])) return false;
    if (g.roles && g.roles.length && g.roles.indexOf(S.role) < 0) return false;
    var st = ((vue && vue.statuts) || {})[g.id];
    return !(st === "mort" || st === "parti" || st === "vendu" || st === "rival");
  }
  // à son lieu, à cette heure (le lieu ouvert)
  function gensLa(g) {
    if (!gensVivant(g)) return false;
    if (g.tranches && g.tranches.length && g.tranches.indexOf(TRANCHES[S.tranche]) < 0) return false;
    if (g.jours && g.jours.length && g.jours.indexOf(JOURS[S.jour]) < 0) return false;
    if (g.si && !siVrai(g.si, g.lieu)) return false;
    var def = TEXTE_LIEU[g.lieu];
    return !def || ouvert(def);
  }
  function gensDuLieu(cle) { chargerGens(); return (GENS_PAR_LIEU[cle] || []).filter(gensLa); }
  // devant un lieu sans pièce (un quartier, le parvis, les docks), celui qui le tient se tient dehors,
  // comme les commerçants : la ville le montre, on le touche (voulus, ville.js)
  function gensDehors(deja, comme) {
    chargerGens();
    var out = [];
    LIEUX_GENS.forEach(function (cle) {
      if (!LIEU[cle] || comme[cle] || aInterieur(cle) || lieuFerme(cle)) return;
      var def = TEXTE_LIEU[cle];
      if (def && !ouvert(def)) return;
      var t = tenancier(cle), spt = t && spriteDe(t.id);
      if (spt && !deja[t.id]) { out.push({ id: "gens_" + cle, sp: spt, qui: t.id, role: "gensville", lieu: cle }); deja[t.id] = 1; }
    });
    return out;
  }
  // celui qui tient le lieu en ce moment : le premier de son lieu dans le contenu
  function tenancier(cle) { return gensDuLieu(cle)[0] || null; }

  // ─── ce qu'il dit : un tuyau (une fois), le climat de son réseau (dès +1), une réplique selon le lien
  function tuyauPret(g) {
    var rel = lienDe(g.id);
    if (rel < 0) return null;
    return (g.tuyaux || []).filter(function (t) { return rel >= (t.lien == null ? 2 : t.lien) && !aFlag("tuyau_" + t.id) && siVrai(t.si, g.lieu); })[0] || null;
  }
  function phraseClimat(g) {
    var jg = RESEAU_JAUGE[g.reseau];
    if (!jg || !g.climat) return null;
    var v = jauge(jg), tr = v < 35 ? "bas" : v <= 65 ? "moyen" : "haut";
    var ok = (g.climat[tr] || []).map(function (p) { return typeof p === "string" ? { texte: p } : p; }).filter(function (p) { return siVrai(p.si, g.lieu); });
    if (!ok.length) return null;
    // la phrase du moment (un `si`) d'abord ; les autres l'une après l'autre, pour ne pas radoter
    var precis = ok.filter(function (p) { return p.si; });
    if (precis.length) return precis[0].texte;
    var memo = memoGens(g.id);
    memo.cl = (memo.cl + 1) % ok.length;
    return ok[memo.cl].texte;
  }
  function repliqueGens(g) {
    var rel = lienDe(g.id), memo = memoGens(g.id), cands = [];
    (g.repliques || []).forEach(function (r, i) {
      var ok = r.lien < 0 ? rel <= r.lien : rel >= 0 && rel >= r.lien;
      if (ok && siVrai(r.si, g.lieu)) cands.push(i);
    });
    if (!cands.length) return null;
    var jamais = cands.filter(function (i) { return memo.dits[i] == null; });
    var pool = jamais.length ? jamais : cands.slice().sort(function (a, b) { return memo.dits[a] - memo.dits[b]; }).slice(0, Math.max(1, Math.ceil(cands.length / 3)));
    // la plus intime d'abord, puis la plus précise
    function poids(i) { var r = g.repliques[i]; return Math.abs(r.lien) * 10 + (r.si ? String(r.si).split("&&").length : 0); }
    pool.sort(function (a, b) { return poids(b) - poids(a) || a - b; });
    memo.n++;
    memo.dits[pool[0]] = memo.n;
    return g.repliques[pool[0]];
  }
  // ce qu'il te dit quand tu lui parles ; le tuyau passe par le moteur (son drapeau)
  function ditGens(g) {
    var id = g.id, rel = lienDe(id), memo = memoGens(id);
    S.vus[id] = 1;
    var t = tuyauPret(g);
    if (t) {
      var avant = vue;
      vue = coquille.mission("tuyau." + t.id, "dit", "ok");
      pont(vue);
      S.tuyaux = S.tuyaux || {};
      S.tuyaux[t.id] = { qui: id, an: (vue && vue.year) || 0, semaine: S.semaine };
      sonGens("nouvelle");
      annoncerVivant(avant, vue);
      return { texte: remplir(t.texte), note: "Dans ton carnet : ce que " + nomCourt(id) + " t'a confié." };
    }
    var jour = S.semaine * 10 + S.jour;
    if (rel >= 1 && memo.climat !== jour) {
      var c = phraseClimat(g);
      if (c) {
        memo.climat = jour;
        S.climats = S.climats || {};
        S.climats[g.reseau] = { texte: c, qui: id, semaine: S.semaine };
        return { texte: remplir(c) };
      }
    }
    // un visage des livres a aussi ses paroles du moment (content/ville/paroles_*.yaml) : l'une, puis l'autre
    var p = (memo.alt = !memo.alt) ? parole(id, g.lieu) : null;
    if (p) return { texte: remplir(p.texte) };
    var r = repliqueGens(g);
    if (r) return { texte: remplir(r.texte) };
    p = parole(id, g.lieu);
    if (p) return { texte: remplir(p.texte) };
    return { texte: rel < 0 ? nomCourt(id) + " fait mine de ne pas te voir." : "Un signe de tête, et c'est tout.", muet: true };
  }
  // toucher quelqu'un de la ville : sa bulle
  function parlerGens(fig) {
    var g = gensDe(fig.qui), maintenant = performance.now();
    var dit = ditGens(g);
    var dx = heros.x - fig.x, dy = heros.y - fig.y;
    if (Math.abs(dx - dy) > 0.5) fig.miroir = (dx - dy) < 0;
    var duree = Math.max(4600, dit.texte.length * 62);
    fig.arret = maintenant + duree; fig.parle = true;
    if (bulle && bulle.g !== fig) bulle.g.parle = false;
    bulle = { g: fig, nom: nomDe(g.id), texte: dit.texte, muet: !!dit.muet, jusqua: maintenant + duree };
    if (dit.note) setTimeout(function () { toast(dit.note); }, 900);
    majHud(); sauver();
  }

  // ─── le service : une fois par saison, dès que le lien le permet
  function saison() { return (vue && vue.season) || 1; }
  function etatService(g) {
    var sv = g.service;
    if (!sv) return null;
    if (lienDe(g.id) < (sv.lien || 3)) return { non: "Pas encore : il faut que " + nomCourt(g.id) + " te fasse confiance." , cache: lienDe(g.id) < 2 };
    if (!siVrai(sv.si, g.lieu)) return { non: "Pas maintenant.", cache: true };
    if (S.services && S.services[g.id] === saison()) return { non: "Déjà demandé cette saison." };
    if (aFlag("dette_" + g.id)) return { non: "Tu lui dois déjà quelque chose." };
    return { ok: true };
  }
  function rendreService(g, cle) {
    var sv = g.service, avant = vue;
    vue = coquille.mission("service." + g.id, "rendu", "oui");
    pont(vue);
    if (vue.over) return;
    S.services = S.services || {};
    S.services[g.id] = saison();
    sonGens("promesse");
    annoncerVivant(avant, vue);
    majHud(); sauver();
    var fait = remplir(sv.texte), note = sv.dette ? nomCourt(g.id) + " ne l'oubliera pas. Un jour, il faudra rendre." : null;
    if (cle && LIEU[cle]) ouvrirPorte(cle, fait, undefined, note);
    else toast(fait);
  }
  // dans le panneau d'un lieu : ceux qui le tiennent, leur service
  function blocGens(cle) {
    var gl = gensDuLieu(cle);
    if (!gl.length) return "";
    var html = '<div class="v-gens">';
    gl.forEach(function (g) {
      var rel = lienDe(g.id), es = etatService(g);
      html += '<div class="v-gen"><p><b>' + esc(nomDe(g.id)) + '</b><span>' + esc(motLien(g, rel)) + '</span></p><div class="v-gen-b">' +
        '<button type="button" class="v-act v-parler" data-gens="' + esc(g.id) + '"><b>Parler</b></button>';
      if (es && !es.cache) {
        html += '<button type="button" class="v-act v-service" data-gens="' + esc(g.id) + '"' + (es.ok ? "" : " disabled") + '><b>' + esc(g.service.label) + '</b>' +
          (es.ok ? '<span class="cout"><span>une fois par saison' + (g.service.dette ? " · à rendre" : "") + '</span></span>' : '<span class="pourquoi">' + esc(es.non) + '</span>') + '</button>';
      }
      html += '</div></div>';
    });
    return html + '</div>';
  }
  function brancherGens(el, cle) {
    el.querySelectorAll(".v-parler").forEach(function (b) {
      b.addEventListener("click", function () {
        var g = gensDe(b.getAttribute("data-gens"));
        if (!g || carteOn || occupe) return;
        var dit = ditGens(g);
        majHud(); sauver();
        ouvrirPorte(cle, dit.muet ? dit.texte : nomCourt(g.id) + " : « " + dit.texte + " »", undefined, dit.note || null);
      });
    });
    el.querySelectorAll(".v-service").forEach(function (b) {
      b.addEventListener("click", function () {
        var g = gensDe(b.getAttribute("data-gens"));
        if (!g || carteOn || occupe || b.disabled) return;
        if (!b.classList.contains("confirme")) { b.classList.add("confirme"); b.querySelector("b").textContent = "Demander ? " + g.service.label; return; }
        rendreService(g, cle);
      });
    });
  }
  // ce qu'il est pour toi (le carnet, le panneau)
  function motLien(g, rel) {
    if (rel > 0) return ((g && g.paliers) || PALIERS)[Math.min(rel, 3) - 1];
    if (rel < 0) return ((g && g.froid) || FROID)[Math.min(-rel, 3) - 1];
    return pointsDe(g.id) > 0 ? "commence à te connaître" : "ne te connaît pas encore";
  }

  // ─── ce qu'un geste a laissé : la trace sous l'activité, le palier, la réputation
  function traceGeste(a, avant) {
    if (!a.avec) return null;
    var pa = +((avant && avant.vars) || {})["lien_" + a.avec] || 0;
    if (pointsDe(a.avec) <= pa) return null;
    var g = gensDe(a.avec);
    return remplir((g && g.trace) || (nomCourt(a.avec) + " s'en souviendra."));
  }
  function phrasePalier(id, rel, monte) {
    var g = gensDe(id), n = nomCourt(id);
    if (rel > 0 && monte) return n + " " + motLien(g, rel) + ", maintenant.";
    if (rel < 0) return n + " " + motLien(g, rel) + ".";
    if (monte) return n + " te parle de nouveau.";
    return n + " a pris ses distances.";
  }
  // après un geste de la ville (une activité, une scène, un service, un tuyau)
  function annoncerVivant(avant, apres) {
    if (!avant || !apres) return;
    var ra = avant.relations || {}, rb = apres.relations || {}, msgs = [], haut = false, bas = false;
    Object.keys(rb).concat(Object.keys(ra)).sort().forEach(function (id, i, l) {
      if (l.indexOf(id) !== i) return;
      var a0 = +ra[id] || 0, b0 = +rb[id] || 0;
      if (a0 === b0 || !(gensDe(id) || CHARS[id])) return;
      msgs.push(phrasePalier(id, b0, b0 > a0));
      if (b0 > a0) haut = true; else bas = true;
    });
    var fa = avant.flags || [];
    (apres.flags || []).forEach(function (f) {
      if (fa.indexOf(f) >= 0 || f.indexOf("rep_") !== 0 || !REPUTATION[f.slice(4)]) return;
      msgs.push("En ville, on dit de toi : " + remplir(REPUTATION[f.slice(4)]) + ".");
      haut = true;
    });
    if (!msgs.length) return;
    sonGens(bas && !haut ? "palier_bas" : "palier_haut");
    msgs.forEach(function (m, i) { setTimeout(function () { if (!carteOn) toast(m); }, 700 + i * 2600); });
  }

  // ─── le carnet : les gens, ce qu'on t'a confié, le climat, ce qu'on dit de toi
  function ongletsCarnet(actif) {
    return '<div class="v-onglets" role="tablist"><button type="button" role="tab" data-onglet="gens"' + (actif === "gens" ? ' class="on" aria-selected="true"' : "") + '>Les gens</button>' +
      '<button type="button" role="tab" data-onglet="biens"' + (actif === "biens" ? ' class="on" aria-selected="true"' : "") + '>Tes affaires</button></div>';
  }
  function brancherOnglets() {
    document.querySelectorAll(".v-onglets [data-onglet]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.classList.contains("on")) return;
        if (b.getAttribute("data-onglet") === "gens") ouvrirCarnet(); else ouvrirInventaire();
      });
    });
  }
  function ouvrirCarnet() {
    if (!coquille || !S) return;
    chargerGens();
    fermerPorte();
    var html = '<div class="v-inv v-carnet">' + ongletsCarnet("gens");
    // ce qu'on dit de toi
    var reps = Object.keys(REPUTATION).filter(function (h) { return aFlag("rep_" + h); });
    html += "<h3>Ce qu'on dit de toi</h3>";
    if (reps.length) html += '<p class="v-inv-chez">' + reps.map(function (h) { return esc(remplir(REPUTATION[h])); }).join(" · ") + "</p>";
    var enCours = Object.keys(HABITUDE_MOT).filter(function (h) { return !aFlag("rep_" + h) && habitudeDe(h) > 0; })
      .sort(function (a, b) { return habitudeDe(b) - habitudeDe(a) || (a < b ? -1 : 1); }).slice(0, 3);
    if (!reps.length && !enCours.length) html += '<p class="v-inv-vide">Rien encore. Aubérive te regarde faire.</p>';
    if (enCours.length) {
      html += '<ul class="v-habs">' + enCours.map(function (h) {
        var n = habitudeDe(h), s = seuilReputation();
        return '<li><span>' + esc(HABITUDE_MOT[h]) + '</span><i style="--p:' + Math.min(100, Math.round(n / s * 100)) + '%"></i></li>';
      }).join("") + "</ul>";
    }
    // ceux que tu connais
    var connus = GENS_LISTE.filter(function (g) { return gensVivant(g) && (S.vus[g.id] || pointsDe(g.id) > 0 || lienDe(g.id) !== 0); })
      .sort(function (a, b) { return lienDe(b.id) - lienDe(a.id) || pointsDe(b.id) - pointsDe(a.id) || (nomDe(a.id) < nomDe(b.id) ? -1 : 1); });
    html += "<h3>Les gens</h3>";
    if (!connus.length) html += '<p class="v-inv-vide">Personne encore. Un café au comptoir, des courses, un mot au garage : on finit par te reconnaître.</p>';
    connus.forEach(function (g) {
      var rel = lienDe(g.id), es = etatService(g), l = LIEU[g.lieu], s = seuilsLien();
      var crans = "";
      for (var i = 1; i <= 3; i++) crans += '<i class="' + (rel >= i ? "on" : rel <= -i ? "froid" : "") + '"></i>';
      var suite = rel >= 0 && rel < 3 ? Math.max(0, s[rel] - pointsDe(g.id)) : 0;
      html += '<div class="v-pers"><div><b>' + esc(nomDe(g.id)) + '</b><span>' + esc((CHARS[g.id] && CHARS[g.id].label ? CHARS[g.id].label.toLowerCase() + " · " : "") + (l ? nomLieu(l) : "")) + '</span>' +
        '<em>' + esc(motLien(g, rel)) + (es && es.ok ? " · un service possible" : "") + (aFlag("dette_" + g.id) ? " · tu lui dois quelque chose" : "") + '</em></div>' +
        '<span class="v-crans" title="' + esc(suite ? suite + (suite > 1 ? " moments" : " moment") + " ensemble avant le prochain cran" : "") + '">' + crans + '</span></div>';
    });
    // ce qu'on t'a confié
    var confies = [];
    GENS_LISTE.forEach(function (g) { (g.tuyaux || []).forEach(function (t) { if (aFlag("tuyau_" + t.id)) confies.push({ g: g, t: t }); }); });
    if (confies.length) {
      html += "<h3>Ce qu'on t'a confié</h3>";
      confies.forEach(function (c) { html += '<p class="v-confie"><b>' + esc(nomCourt(c.g.id)) + '</b> « ' + esc(remplir(c.t.texte)) + ' »</p>'; });
    }
    // le climat, au dernier mot entendu
    var cl = Object.keys(S.climats || {}).sort();
    if (cl.length) {
      html += "<h3>Ce que pense la ville</h3>";
      cl.forEach(function (r) {
        var c = S.climats[r], jg = RESEAU_JAUGE[r], g = ((vue && vue.gauges) || []).filter(function (x) { return x.id === jg; })[0];
        var il = S.semaine - c.semaine, quand = il <= 0 ? "cette semaine" : il === 1 ? "la semaine dernière" : "il y a " + il + " semaines";
        html += '<p class="v-confie"><b>' + esc((g && g.label) || RESEAU_MOT[r] || r) + '</b> « ' + esc(remplir(c.texte)) + ' » <span>' + esc(nomCourt(c.qui) + ", " + quand) + '</span></p>';
      });
    }
    html += "</div>";
    coquille.panneau("Le carnet", html);
    brancherOnglets();
  }
