  // ═══ LES ÉCHOS ══════════════════════════════════════════════════════════
  // « Montrer chaque conséquence tout de suite, et la faire revenir plus tard. »
  //
  // En mode histoire les quatre jauges se taisent : le joueur ne voit presque plus
  // ce que ses choix ont fait (mesuré : retourner une décision d'un livre laisse la
  // fin intacte 60 à 90 % du temps, et rien ne dit lesquelles comptent). Ce module
  // ajoute deux choses, rares exprès, qui ne touchent ni au moteur ni à la graine
  // (la vue du moteur porte déjà les drapeaux et les relations : on la compare) :
  //
  //   1. LA LIGNE — juste après une réponse, une phrase brève dit ce qui a bougé hors
  //      de l'écran : « Gégé s'en souviendra. » (une relation monte ou descend),
  //      « Ça reviendra. » (un drapeau que des cartes liront), « Ça se saura en
  //      ville. » (l'argent sale, l'amende, la saisie). Jamais un chiffre ; une seule
  //      par réponse ; rien sur une carte sans enjeu (routine, nouvelle, un seul
  //      bouton). Elle se pose PAR-DESSUS l'écran suivant (la barre du haut quand une
  //      carte est ouverte, au-dessus du message du récit sur la ville) : aucune mise
  //      en page ne bouge, et le doigt la traverse.
  //   2. LE RUBAN — plus tard, sur la carte qui lit ce que cette réponse a posé :
  //      « ↩ Parce que tu as dit « JE PRENDS LES DEUX » ». Quatre sources, de la plus
  //      sûre à la moins sûre : le sablier tenu (la réponse a programmé cette carte :
  //      `schedule`, ou une branche d'arc : `next`), puis ce que la carte lit d'un
  //      drapeau ou d'une relation — la variante d'étape qui l'a choisie, son `when`,
  //      l'ouverture de son intrigue (le `when` de l'arc, le programme du livre : un
  //      événement sombre naît de l'état du monde), la suite d'arc qui y mène. La
  //      condition est évaluée sur la vue pour n'attribuer que ce qui a vraiment ouvert
  //      la carte : un `ou` que d'autres raisons rendraient vrai ne donne rien (mieux
  //      vaut se taire que mentir). Une réponse n'est rappelée qu'une fois, une carte
  //      n'a son ruban qu'une fois, et il glisse avec elle.
  //
  // La mémoire des origines (drapeau ou relation → la carte, le libellé, le tour de
  // la réponse qui l'a changé) suit la carrière : une clé par graine dans
  // localStorage, bornée, effacée à la fin ; une carrière reprise garde ses rubans.
  //
  // Le rythme est ce qui fait que ça reste spécial. Mesuré sur les dix livres (`node
  // packages/tools/web/mesure_echos.js --engine …`, 120 carrières ; un quart d'heure =
  // 14 réponses, docs/balance/duree_partie.md) : ≈ 2,8 lignes (p50 3, p90 5), dont deux
  // sur trois nomment quelqu'un, et ≈ 1,1 ruban (p50 1, p90 2 ou 3). Le plafond des rubans
  // est celui du contenu (une carrière compte une dizaine de rappels traçables) ; ce
  // que des lots de cartes ajouteront le fera monter. Les réglages sont en tête
  // (ECHOS_REGLAGES) ; `window.FusibleEchos` (journal, etat, rejets) sert aux essais.

  var ECHOS_CLE = "fusible.echos.v1:", ECHOS_REPERTOIRE = "fusible.echos.v1.index";
  var ECHOS_GARDEES = 24;                          // carrières dont on garde la mémoire dans le navigateur
  var ECHOS_BORNE = { f: 90, r: 40, c: 60, vu: 160 };
  // ce que le moteur ou la ville posent seuls : jamais le fait d'une réponse
  var ECHOS_SYSTEME = /^(bilan_|role_was_|descente$|rep_|tuyau_|service_|dette_|quartier_|monde_|histoire_h\d|_)/;
  // les compteurs par lesquels une carte agit sur la ville et qui se savent (pas l'argent propre)
  var ECHOS_VILLE = /^(ville_amende|ville_francs_sales|saisie_|vol_|cadeau_)/;
  var ECHOS_SANS_ENJEU = { routine: 1, nouvelle: 1, passe: 1 };
  var ECHOS_BEATS = { narrative: 1, prologue: 1 };   // les temps où le joueur tranche vraiment
  var ECHOS_REGLAGES = {
    premiere: 3,            // la toute première ligne d'une carrière : le seuil ordinaire, mais sans attendre d'écart (elle apprend le geste)
    seuils: [4, 3, 3],      // le score qu'il faut selon l'écart à la dernière ligne : 1 réponse, 2, 3 et plus
    fenetre: 14, plafond: 5, // jamais plus de `plafond` lignes sur `fenetre` réponses (≈ un quart d'heure de jeu)
    memeVisage: 8,          // réponses avant qu'on reparle du même visage (sauf un cran fort)
    ecartRuban: 3,          // cartes entre deux rubans
    ecartOrigine: 3,        // cartes entre une réponse et le ruban qui la rappelle (drapeau, relation)
    ecartSablier: 2,        // idem quand la réponse a programmé la carte elle-même
    duree: 3400, parLettre: 45
  };

  // ─── les mots : jamais un chiffre, jamais la même phrase deux fois de suite ────
  // {N} : le nom de celui qui s'en souvient. Pas de « à {N} » ni de « de {N} » (les contractions).
  var ECHOS_PAROLES = {
    // quelqu'un se rapproche : léger, moyen, fort
    chaud: [
      ["{N} s'en souviendra.", "{N} a pris note.", "{N} a retenu ta réponse.", "{N} te regardera autrement.", "{N} garde ça de côté.", "Ce n'est pas rien, pour {N}.", "{N} t'a un peu plus à la bonne.", "{N} aura ça en tête."],
      ["{N} te fait crédit.", "{N} te le revaudra.", "{N} ne l'oubliera pas.", "{N} t'ouvre sa porte.", "Avec {N}, quelque chose a changé.", "{N} t'écoutera, la prochaine fois."],
      ["{N} ne l'oubliera jamais.", "{N} se range derrière toi.", "Tu viens de gagner {N}.", "{N} te suivra.", "{N} est avec toi, jusqu'au bout."]
    ],
    // quelqu'un se ferme : léger, moyen, fort
    froid: [
      ["{N} ne l'oubliera pas.", "{N} a noté. Sans rien dire.", "{N} n'a pas aimé.", "{N} garde ça pour plus tard.", "{N} te regardera de travers.", "{N} s'en souviendra. Pas pour te remercier.", "{N} a pris ça de travers.", "{N} fait le compte."],
      ["{N} ne te le pardonnera pas.", "{N} a rayé ton nom de sa liste.", "{N} ne t'attendra plus.", "Entre {N} et toi, ça s'est fermé.", "{N} ne te fera plus de cadeau."],
      ["{N} te le fera payer.", "{N} est contre toi, désormais.", "{N} ne te le pardonnera jamais.", "{N} est dans l'autre camp, maintenant.", "Entre {N} et toi, c'est la guerre."]
    ],
    // sans visage : un drapeau que des cartes liront (revient), un que la ville ou la Une liront (saura),
    // plusieurs d'un coup (fort), l'argent sale et ses suites (ville)
    revient: ["Ça reviendra.", "On te le rappellera.", "Tu retrouveras ça sur ton chemin.", "Quelque chose vient de se mettre en route.", "Ça compte, même si personne ne le dit.", "Tu viens de planter quelque chose.",
      "Quelqu'un tient le compte.", "Ce n'est pas fini.", "Cette réponse-là, on te la ressortira.", "Tu n'as pas fini d'en entendre parler.", "Ça te sera rendu, d'une manière ou d'une autre."],
    saura: ["Ça se saura en ville.", "Quelqu'un a vu.", "Ça n'en restera pas là.", "La ville en parlera.", "Ça ne restera pas entre ces murs.", "Le journal en prendra note.", "Ça se saura avant la fin de la semaine."],
    fort: ["Il n'y a plus de retour en arrière.", "Ça va se savoir, partout.", "Toute la ville le saura avant ce soir.", "Ce que tu viens de faire ne se défait pas.", "Plus personne ne pourra dire qu'il ne savait pas."],
    ville: ["Ça se saura en ville.", "On en parlera à la boulangerie.", "Les voisins ont vu.", "Ça se saura au comptoir.", "Ça fera le tour du quartier.", "Quelqu'un a noté ton adresse."]
  };

  var echos = null;                 // la mémoire de la carrière en cours (null : aucune)
  var echosIdx = null;              // l'index du contenu, bâti à la première utilisation
  var echosJournal = [];            // ce qui s'est montré cette session (les essais le lisent)
  var echosTimer = 0, echosAttenteT = 0, echosAttente = null;
  var echosRejets = {};             // pourquoi une réponse n'a pas eu sa ligne (les essais comptent)

  // ─── de petits outils ───────────────────────────────────────────────────────
  function echosHash(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function echosVrai(x) { return typeof x === "number" ? x !== 0 : typeof x === "string" ? x.length > 0 : !!x; }
  function echosDom() { return typeof document !== "undefined" && !!document.body; }
  function echosGarde(f) { try { return f(); } catch (e) { return null; } }
  function echosAbreger(s, n) { s = String(s == null ? "" : s).replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n - 1) + "…" : s; }

  // ─── la mémoire d'une carrière ──────────────────────────────────────────────
  function echosCle() { return ECHOS_CLE + currentPostulat + ":" + currentSeed; }
  function echosNeuf() {
    // o : les origines (f drapeaux, r relations, c cartes programmées) ; vu : les cartes qui ont eu leur ruban ;
    // n : le rythme (l dernière ligne, r dernier ruban, nl lignes, nr rubans, h les tours des dernières lignes,
    // g 1 si la dernière ligne était sans visage) ;
    // u : la dernière phrase de chaque seau ; p : le dernier tour où l'on a parlé de chacun ; og : les réponses déjà rappelées ;
    // cur : le ruban de la carte à l'écran (pour qu'une reprise la remontre sans en consommer un autre)
    return { v: 1, k: echosCle(), o: { f: {}, r: {}, c: {} }, vu: [], n: { l: -9, r: -9, nl: 0, nr: 0, h: [], g: 0 }, u: {}, p: {}, og: [], cur: null };
  }
  function echosLire(cle) {
    return echosGarde(function () {
      var j = JSON.parse(localStorage.getItem(cle));
      if (!j || j.v !== 1 || !j.o) return null;
      // un champ manquant (une version plus ancienne, un stockage tronqué) ne casse rien : on le recrée
      var n = echosNeuf();
      ["f", "r", "c"].forEach(function (k) { j.o[k] = j.o[k] && typeof j.o[k] === "object" ? j.o[k] : n.o[k]; });
      j.vu = j.vu instanceof Array ? j.vu : []; j.og = j.og instanceof Array ? j.og : []; j.u = j.u || {}; j.p = j.p || {};
      j.n = j.n || {}; ["l", "r", "nl", "nr", "g"].forEach(function (k) { if (typeof j.n[k] !== "number") j.n[k] = n.n[k]; });
      j.n.h = j.n.h instanceof Array ? j.n.h : [];
      return j;
    });
  }
  // les plus vieilles origines partent d'abord : la mémoire reste petite (quelques Ko)
  function echosBorner() {
    ["f", "r", "c"].forEach(function (k) {
      var m = echos.o[k], ids = Object.keys(m);
      if (ids.length <= ECHOS_BORNE[k]) return;
      ids.sort(function (a, b) { return m[a][0] - m[b][0] || (a < b ? -1 : 1); });
      ids.slice(0, ids.length - ECHOS_BORNE[k]).forEach(function (id) { delete m[id]; });
    });
    if (echos.vu.length > ECHOS_BORNE.vu) echos.vu = echos.vu.slice(-ECHOS_BORNE.vu);
    if (echos.og.length > ECHOS_BORNE.vu) echos.og = echos.og.slice(-ECHOS_BORNE.vu);
  }
  function echosEcrire() {
    if (!echos) return;
    echosBorner();
    echosGarde(function () {
      localStorage.setItem(echos.k, JSON.stringify(echos));
      var rep = JSON.parse(localStorage.getItem(ECHOS_REPERTOIRE) || "[]");
      if (!(rep instanceof Array)) rep = [];
      rep = rep.filter(function (k) { return k !== echos.k; });
      rep.push(echos.k);
      while (rep.length > ECHOS_GARDEES) localStorage.removeItem(rep.shift());
      localStorage.setItem(ECHOS_REPERTOIRE, JSON.stringify(rep));
    });
  }
  function echosOublier(cle) {
    echosGarde(function () {
      localStorage.removeItem(cle);
      var rep = JSON.parse(localStorage.getItem(ECHOS_REPERTOIRE) || "[]");
      if (rep instanceof Array) localStorage.setItem(ECHOS_REPERTOIRE, JSON.stringify(rep.filter(function (k) { return k !== cle; })));
    });
  }

  // ─── l'index du contenu : qui lit quoi ──────────────────────────────────────
  // ctx[carte] = { when, variante (le `if` de la variante d'étape qui la porte), entrees (les `if` des suites
  // d'arc qui mènent à son étape), ouv (l'arc qu'elle ouvre : son `when` et les `if` du programme du livre
  // l'ont rendu possible — un événement sombre naît de l'état du monde) } ; lit[drapeau] = 1 quand une carte,
  // une étape ou une intrigue le lit (sinon seules la Une, les fins ou la ville le lisent : « ça se saura »
  // plutôt que « ça reviendra »).
  function echosScanner(n, out) {
    if (!(n instanceof Array)) return;
    if (typeof n[0] !== "string") { n.forEach(function (x) { echosScanner(x, out); }); return; }
    if (n[0] === "path" && typeof n[1] === "string" && n[1].indexOf("flags.") === 0) out[n[1].slice(6)] = 1;
    else if (n[0] === "call" && n[1] === "flag" && n[2] && n[2][0] && n[2][0][0] === "lit") out[n[2][0][1]] = 1;
    for (var i = 1; i < n.length; i++) echosScanner(n[i], out);
  }
  function echosIndex() {
    if (echosIdx) return echosIdx;
    var I = { carte: {}, ctx: {}, arc: {}, lit: {}, pool: {} };
    var cartes = content.cards instanceof Array ? content.cards : Object.keys(content.cards || {}).map(function (k) { return content.cards[k]; });
    cartes.forEach(function (k) {
      if (!k || !k.id) return;
      I.carte[k.id] = k;
      if (k.when) { I.ctx[k.id] = { when: k.when, variante: null, entrees: [] }; echosScanner(k.when, I.lit); }
    });
    (content.arcs instanceof Array ? content.arcs : []).forEach(function (a) {
      I.arc[a.id] = a;
      if (a.when) echosScanner(a.when, I.lit);
      (a.requires || []).concat(a.excludes || []).forEach(function (f) { if (typeof f === "string") I.lit[f] = 1; });
      var steps = a.steps || [], entrees = {};
      steps.forEach(function (st) {
        (st.next || []).forEach(function (nx) {
          if (nx && nx.step && nx.if) { (entrees[nx.step] = entrees[nx.step] || []).push(nx.if); echosScanner(nx.if, I.lit); }
        });
      });
      steps.forEach(function (st) {
        var vars = st.card instanceof Array ? st.card : [{ id: st.card }];
        vars.forEach(function (vr) {
          var id = typeof vr === "string" ? vr : vr && vr.id;
          if (!id) return;
          var c = I.ctx[id] = I.ctx[id] || { when: null, variante: null, entrees: [] };
          c.arc = a.id; c.step = st.id;
          c.variante = vr && vr.if ? vr.if : null;
          c.entrees = entrees[st.id] || [];
          if (st === steps[0]) c.ouv = a.id;
          if (vr && vr.if) echosScanner(vr.if, I.lit);
        });
      });
    });
    // les intrigues que le programme d'un livre ouvre sous condition : pool[livre][arc] = les `if` de ses entrées
    (content.postulats || []).forEach(function (p) {
      var prog = p.programme || {}, m = I.pool[p.id] = {};
      Object.keys(prog).forEach(function (b) {
        ((prog[b] && prog[b].pool) || []).forEach(function (e) {
          if (!e || !e.arc) return;
          (m[e.arc] = m[e.arc] || []).push(e.if || ["lit", true]);        // une entrée sans `if` s'ouvre sans condition
          if (e.if) echosScanner(e.if, I.lit);
        });
      });
    });
    echosIdx = I;
    return I;
  }

  // ─── évaluer une condition sur la vue (vrai, faux, ou undefined : la vue ne le dit pas) ─
  var ECHOS_VARS_VUES = /^(ville_|saisie_|cadeau_|rendre_|vol_|lien_|hab_)/;
  function echosCmp(op, a, b) {
    if (typeof a === "number" && typeof b === "number") {
      switch (op) { case "<": return a < b; case "<=": return a <= b; case ">": return a > b; case ">=": return a >= b; case "==": return a === b; case "!=": return a !== b; }
    }
    if (op === "==") return a === b;
    if (op === "!=") return a !== b;
    return false;
  }
  function echosAMoi(v, f) { return (v.flags || []).indexOf(f) >= 0; }
  function echosChemin(p, v, c) {
    var m, i, g;
    if (p.indexOf("flags.") === 0) return echosAMoi(v, p.slice(6));
    if (p.indexOf("relation.") === 0) return (v.relations || {})[p.slice(9)] || 0;
    if (p === "speaker.relation") return c && c.speaker ? (v.relations || {})[c.speaker] || 0 : 0;
    if (p.indexOf("gauges.") === 0) { g = p.slice(7); for (i = 0; i < (v.gauges || []).length; i++) if (v.gauges[i].id === g) return v.gauges[i].value; return 50; }
    if (p.indexOf("vars.") === 0) {
      g = p.slice(5);
      if (v.vars && g in v.vars) return v.vars[g];
      return ECHOS_VARS_VUES.test(g) ? 0 : undefined;     // la vue n'expose que les compteurs de la ville
    }
    m = /^chars\.(.+)\.statut$/.exec(p);
    if (m) return ((v.statuts || {})[m[1]]) || "present";
    switch (p) {
      case "year": return v.year;
      case "turn": return v.turn;
      case "season": case "season.index": return (v.season || 1) - 1;       // la vue compte à partir de un
      case "season.phase": return v.phase;
      case "age": case "player.age": return v.age;
      case "role": return v.role;
      case "postulat": return postulats[currentPostulat] ? postulats[currentPostulat].id : undefined;
      case "world.rang": return v.rank;
      case "world.division": return v.division;
      case "speaker": return (c && c.speaker) || "";
    }
    return undefined;
  }
  function echosAppel(nom, args, v, c) {
    var a = (args || []).map(function (x) { return echosEval(x, v, c); }), r;
    for (var i = 0; i < a.length; i++) if (a[i] === undefined) return undefined;
    switch (nom) {
      case "flag": return echosAMoi(v, a[0]);
      case "role_was": return echosAMoi(v, "role_was_" + a[0]);
      case "relation": return (v.relations || {})[a[0]] || 0;
      case "expression": r = (v.relations || {})[a[0]] || 0; return r >= 1 ? "sourire" : (r <= -1 ? "noir" : "neutre");
      case "phase": return v.phase === a[0];
      case "in_cast": return (v.cast || []).indexOf(a[0]) >= 0;
      case "between": return typeof a[0] === "number" && a[0] >= a[1] && a[0] <= a[2];
      case "enemy": return ((v.relations || {})[a[0]] || 0) <= -3 ? true : undefined;   // un ennemi se pose à -3 ; hors de là, la vue ne sait pas
    }
    return undefined;
  }
  function echosEval(n, v, c) {
    if (!(n instanceof Array)) return n;
    var i, x, inc = false;
    switch (n[0]) {
      case "lit": return n[1];
      case "path": return echosChemin(n[1], v, c);
      case "and":
        for (i = 1; i < n.length; i++) { x = echosEval(n[i], v, c); if (x === undefined) inc = true; else if (!echosVrai(x)) return false; }
        return inc ? undefined : true;
      case "or":
        for (i = 1; i < n.length; i++) { x = echosEval(n[i], v, c); if (x === undefined) inc = true; else if (echosVrai(x)) return true; }
        return inc ? undefined : false;
      case "not": x = echosEval(n[1], v, c); return x === undefined ? undefined : !echosVrai(x);
      case "cmp":
        x = echosEval(n[2], v, c); i = echosEval(n[3], v, c);
        return x === undefined || i === undefined ? undefined : echosCmp(n[1], x, i);
      case "in":
        x = echosEval(n[1], v, c);
        if (x === undefined) return undefined;
        for (i = 0; i < (n[2] || []).length; i++) { var y = echosEval(n[2][i], v, c); if (y === undefined) inc = true; else if (y === x) return true; }
        return inc ? undefined : false;
      case "call": return echosAppel(n[1], n[2], v, c);
    }
    return undefined;
  }

  // ─── qui a ouvert cette carte ? (les lectures dont le joueur est l'auteur) ──────
  // Les origines : echos.o.f[drapeau] = [tour, carte, libellé, année, +1 posé / -1 levé] ;
  // echos.o.r[personnage] = [tour, carte, libellé, année, écart] ; echos.o.c[carte] = [tour, carte, libellé, année].
  function echosOrigineF(f, veut) {
    var o = echos.o.f[f];
    return o && (veut ? o[4] === 1 : o[4] === -1) ? o : null;
  }
  function echosOrigineR(id, v) {
    var o = echos.o.r[id], cur = (v.relations || {})[id] || 0;
    return o && cur !== 0 && (o[4] > 0) === (cur > 0) ? o : null;
  }
  // La lecture d'une feuille, avec son origine : un drapeau, ou une relation dans une comparaison.
  function echosAtome(n, t, v, c) {
    var id = null, o = null;
    function rel(x) {
      if (!(x instanceof Array)) return null;
      if (x[0] === "path" && x[1] === "speaker.relation") return c && c.speaker ? c.speaker : null;
      if (x[0] === "path" && typeof x[1] === "string" && x[1].indexOf("relation.") === 0) return x[1].slice(9);
      if (x[0] === "call" && (x[1] === "relation" || x[1] === "expression" || x[1] === "enemy") && x[2] && x[2][0] && x[2][0][0] === "lit") return x[2][0][1];
      return null;
    }
    if (n[0] === "path" && typeof n[1] === "string" && n[1].indexOf("flags.") === 0) { id = n[1].slice(6); o = echosOrigineF(id, t); }
    else if (n[0] === "call" && n[1] === "flag" && n[2] && n[2][0] && n[2][0][0] === "lit") { id = n[2][0][1]; o = echosOrigineF(id, t); }
    else if (n[0] === "cmp" || n[0] === "call") {
      id = rel(n[0] === "cmp" ? n[2] : n) || (n[0] === "cmp" ? rel(n[3]) : null);
      if (id) o = echosOrigineR(id, v);
    }
    return o ? { o: o, id: id } : null;
  }
  // Rend la liste des atomes (avec origine) qui expliquent que `n` vaille `t`, [] si rien n'y est du fait du
  // joueur, ou null quand la condition tient pour une raison qui n'est pas la sienne (ou que la vue
  // contredit la carte) : alors on ne dit rien.
  function echosCauses(n, t, v, c) {
    if (!(n instanceof Array)) return [];
    var val = echosEval(n, v, c), i, r, out = [], kids;
    if (val !== undefined && echosVrai(val) !== t) return null;
    if (n[0] === "not") return echosCauses(n[1], !t, v, c);
    if (n[0] === "and" || n[0] === "or") {
      kids = n.slice(1);
      if ((n[0] === "and") === t) {                    // toutes les branches comptent
        for (i = 0; i < kids.length; i++) { r = echosCauses(kids[i], t, v, c); if (r === null) return null; out = out.concat(r); }
        return out;
      }
      var tenues = 0;                                  // une seule suffisait : elles doivent toutes venir du joueur
      for (i = 0; i < kids.length; i++) {
        var kv = echosEval(kids[i], v, c);
        if (kv !== undefined && echosVrai(kv) !== t) continue;
        r = echosCauses(kids[i], t, v, c);
        if (r === null || !r.length) return null;
        out = out.concat(r); tenues++;
      }
      return tenues ? out : null;
    }
    var at = echosAtome(n, t, v, c);
    return at ? [at] : [];
  }

  // ─── le nom qu'on dit ────────────────────────────────────────────────────────
  function echosNom(id, v) {
    var ch = CHARS[id];
    if (!ch || !ch.name) return "";
    if (v && v.statuts && v.statuts[id] === "mort") return "";             // un mort ne s'en souviendra pas
    var nom = String(ch.name), m = /«\s*([^»]+?)\s*»/.exec(nom);
    if (m) return m[1];                                                     // le surnom d'abord (« Mado »)
    var court = familyName(nom);
    if (court === nom) return nom.length > 16 ? nom.split(/\s+/).pop() : nom;   // un seul mot, ou un titre : tel quel (sauf « Le père Anatole Brousse »)
    // deux visages de la même famille dans la partie : le prénom les distingue
    var lies = ((v && v.cast) || []).concat(Object.keys((v && v.relations) || {}));
    for (var i = 0; i < lies.length; i++) {
      var o = CHARS[lies[i]];
      if (o && lies[i] !== id && familyName(String(o.name)) === court) return nom.split(/\s+/)[0];
    }
    return court;
  }
  function echosMinuscule(nom) { return /^(Le|La|Les|L')/.test(nom) ? nom.charAt(0).toLowerCase() + nom.slice(1) : nom; }
  function echosDire(modele, nom) {
    var i = modele.indexOf("{N}");
    if (i < 0) return modele;
    return modele.split("{N}").join(i === 0 ? nom : echosMinuscule(nom));
  }
  // La rangée du menu, quand une carte est ouverte : la place libre à droite de la dernière icône visible (les trois
  // du début, et celles qu'un autre module y ajoute). null hors navigateur ou sans menu.
  function echosRangee() {
    var m = echosDom() ? document.querySelector("#gameScreen .menu") : null;
    if (!m) return null;
    var r = m.getBoundingClientRect(), g = r.left;
    for (var i = 0; i < m.children.length; i++) {
      var b = m.children[i], rb = b.getBoundingClientRect();
      if (!rb.width || getComputedStyle(b).visibility === "hidden") continue;
      if (rb.right > g && rb.right < r.left + r.width / 2) g = rb.right;      // les icônes du côté gauche
    }
    return r.width ? { gauche: g + 8, droite: r.right, haut: r.top, hauteur: r.height } : null;
  }
  // Combien de lettres tient la ligne : deux lignes dans la place libre de la barre du haut, plus sur la ville.
  function echosLargeur() {
    if (!echosCarteOuverte()) return 80;
    var rg = echosRangee(), w = rg ? rg.droite - rg.gauche : 205;
    return Math.max(30, 2 * Math.floor((w - 19) / 7) - 4);
  }
  // Un modèle par tirage déterministe (la graine, le nombre de lignes déjà dites), jamais deux fois le même d'affilée ;
  // ceux qui tiennent dans la place d'abord, le plus court sinon.
  function echosChoisir(liste, cle, nom) {
    var max = echosLargeur();
    var ok = liste.filter(function (m) { return echosDire(m, nom).length <= max; });
    if (!ok.length) ok = [liste.slice().sort(function (a, b) { return echosDire(a, nom).length - echosDire(b, nom).length; })[0]];
    var h = echosHash(currentSeed + "|" + echos.n.nl + "|" + cle) % ok.length;
    if (ok.length > 1 && ok[h] === echos.u[cle]) h = (h + 1) % ok.length;
    echos.u[cle] = ok[h];
    return ok[h];
  }

  // ─── 1. LA LIGNE : ce qu'une réponse a changé hors de l'écran ───────────────────
  function echosDiff(a, b) {
    var fa = {}, fb = {}, d = { pose: [], retire: [], rel: [], ville: [] };
    (a.flags || []).forEach(function (f) { fa[f] = 1; });
    (b.flags || []).forEach(function (f) { fb[f] = 1; if (!fa[f] && !ECHOS_SYSTEME.test(f)) d.pose.push(f); });
    (a.flags || []).forEach(function (f) { if (!fb[f] && !ECHOS_SYSTEME.test(f)) d.retire.push(f); });
    var ra = a.relations || {}, rb = b.relations || {}, ids = {};
    Object.keys(ra).concat(Object.keys(rb)).forEach(function (id) { ids[id] = 1; });
    Object.keys(ids).sort().forEach(function (id) {
      var x = ra[id] || 0, y = rb[id] || 0;
      if (x !== y) d.rel.push({ id: id, de: x, a: y, d: y - x });
    });
    var va = a.vars || {}, vb = b.vars || {};
    Object.keys(vb).sort().forEach(function (k) { if (ECHOS_VILLE.test(k) && (vb[k] || 0) > (va[k] || 0)) d.ville.push(k); });
    return d;
  }
  function echosSigne(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; }
  // Le meilleur candidat d'une réponse : { score, seau, dir, nom }, ou null. Le score dit si ça mérite une ligne.
  function echosCandidat(c, d, apres, tour) {
    var cands = [], I = echosIndex();
    var parle = apres.card && apres.card.kind === "reaction" ? apres.card.speaker : null;   // il va répondre tout de suite : on le verra
    d.rel.forEach(function (r) {
      var nom = echosNom(r.id, apres);
      if (!nom) return;
      var s = echosSigne(r.d), niveau = 0;
      if (echosSigne(r.a) === s) niveau = (Math.abs(r.d) >= 2 || Math.abs(r.a) >= 3) ? 2 : (Math.abs(r.a) >= 2 ? 1 : 0);
      var hors = r.id !== c.speaker && r.id !== parle;                     // quelqu'un que la carte ne montrait pas : le vrai caché
      var score = 3 + niveau + (hors ? 1 : 0) - (r.id === parle ? 2 : 0);
      // pas deux fois de suite le même visage, sauf quand ça bascule
      var dernier = echos ? echos.p[r.id] : null, recent = dernier != null && tour - dernier < ECHOS_REGLAGES.memeVisage;
      if (recent && niveau < 2) score -= niveau === 1 ? 1 : 2;
      cands.push({ score: score, dir: s > 0 ? "chaud" : "froid", seau: (s > 0 ? "chaud" : "froid") + niveau, nom: nom, id: r.id, tri: 3 - niveau });
    });
    var flags = d.pose.concat(d.retire);
    if (flags.length) {
      var lus = flags.filter(function (f) { return I.lit[f]; }).length;
      // un tournant (un événement sombre, un face-à-face) qui pose de quoi revenir : la phrase grave ; le reste, plus discret
      var tournant = lus && (c.kind === "evenement" || c.kind === "palier" || (c.tags || []).indexOf("sombre") >= 0);
      var sc = (lus ? 3 : 2) + (flags.length >= 2 ? 1 : 0);
      cands.push({ score: sc, dir: "neutre", seau: tournant ? "fort" : (lus ? "revient" : "saura"), nom: "", tri: 5 });
    }
    if (d.ville.length) cands.push({ score: 3, dir: "neutre", seau: "ville", nom: "", tri: 6 });
    if (!cands.length) return null;
    cands.sort(function (x, y) { return y.score - x.score || x.tri - y.tri; });
    return cands[0];
  }
  function echosRefus(raison) { echosRejets[raison] = (echosRejets[raison] || 0) + 1; return false; }
  function echosPorte(score, tour) {
    var R = ECHOS_REGLAGES, depuis = tour - echos.n.l;
    if (echos.n.nl === 0) return score >= R.premiere || echosRefus("score");
    var recentes = echos.n.h.filter(function (t) { return tour - t < R.fenetre; }).length;
    if (recentes >= R.plafond) return echosRefus("plafond");     // un quart d'heure ne porte qu'une poignée de lignes
    return score >= (depuis <= 1 ? R.seuils[0] : depuis === 2 ? R.seuils[1] : R.seuils[2]) || echosRefus("score");
  }
  // Deux lignes sans visage de suite, c'est du bruit : après une phrase du monde, la suivante doit nommer quelqu'un (sauf la grave).
  function echosAlterne(cand) {
    return !(cand.dir === "neutre" && cand.seau !== "fort" && echos.n.g && echos.n.nl > 0) || echosRefus("alterne");
  }
  function echosParole(cand) {
    var P = ECHOS_PAROLES, liste;
    if (cand.seau.indexOf("chaud") === 0 || cand.seau.indexOf("froid") === 0) liste = P[cand.seau.slice(0, 5)][+cand.seau.charAt(5)];
    else liste = P[cand.seau];
    return echosDire(echosChoisir(liste, cand.seau, cand.nom), cand.nom);
  }

  // ─── ce que la réponse laisse derrière elle : les origines du ruban ─────────────
  // Le sablier tenu : les cartes que cette réponse programme (`schedule`) ou vers lesquelles elle aiguille l'arc (`next`).
  function echosLiens(c, droite) {
    var I = echosIndex(), k = I.carte[c.id], cote = k && k[droite ? "right" : "left"], e = cote && cote.effects, ids = [];
    if (!e) return ids;
    (e.schedule || []).forEach(function (s) { if (s && s.card) ids.push(s.card); });
    if (e.next && e.next.step) {
      var ctx = I.ctx[c.id], arc = ctx && I.arc[ctx.arc];
      ((arc && arc.steps) || []).forEach(function (st) {
        if (st.id !== e.next.step) return;
        (st.card instanceof Array ? st.card : [{ id: st.card }]).forEach(function (vr) { var id = typeof vr === "string" ? vr : vr && vr.id; if (id) ids.push(id); });
      });
    }
    return ids;
  }
  function echosNoter(c, droite, avant, d) {
    var libelle = echosAbreger(droite ? c.rightLabel : c.leftLabel, 40);
    if (!libelle) return;
    var o = echos.o;
    function trace(extra) { var r = [avant.turn, c.id, libelle, avant.year]; return extra === undefined ? r : r.concat([extra]); }
    d.pose.forEach(function (f) { o.f[f] = trace(1); });
    d.retire.forEach(function (f) { o.f[f] = trace(-1); });
    d.rel.forEach(function (r) { o.r[r.id] = trace(r.d); });
    echosLiens(c, droite).forEach(function (id) { o.c[id] = trace(); });
  }

  // ─── la ligne à l'écran ──────────────────────────────────────────────────────
  function echosCarteOuverte() { return VILLE ? VILLE.carteVisible() : (!elGame.hidden && !!view && !view.over); }
  function echosElLigne() {
    if (!echosDom()) return null;
    var e = document.getElementById("echoLigne");
    if (!e) {
      e = document.createElement("div");
      e.id = "echoLigne"; e.className = "echo-ligne haut";
      e.setAttribute("role", "status"); e.setAttribute("aria-live", "polite");
      document.body.appendChild(e);
    }
    return e;
  }
  // Sur une carte : la barre du haut, à droite des icônes du menu (la place est vide). Sur la ville : au-dessus
  // du message du récit (le même gabarit), qu'on mesure quand il est là.
  function echosPlacer() {
    var e = echosElLigne();
    if (!e) return;
    var carte = echosCarteOuverte();
    e.classList.toggle("haut", carte);
    e.classList.toggle("bas", !carte);
    e.style.bottom = ""; e.style.top = ""; e.style.right = ""; e.style.maxWidth = "";
    if (carte) {
      // dans la rangée du menu (sa hauteur et ses icônes changent d'un écran à l'autre : on les mesure), à droite de la
      // dernière icône, centrée : une ligne tombe en face des icônes, deux restent dans la rangée et ne mordent pas sur
      // la phrase du récit juste dessous
      var rg = echosRangee();
      if (rg) {
        e.style.maxWidth = Math.max(110, Math.round(rg.droite - rg.gauche)) + "px";
        e.style.right = Math.round(document.documentElement.clientWidth - rg.droite) + "px";
        e.style.top = Math.round(rg.haut + (rg.hauteur - Math.min(e.offsetHeight, rg.hauteur)) / 2) + "px";
      }
    } else {
      var t = document.getElementById("villeToast");
      if (t && t.classList.contains("on")) e.style.bottom = Math.round(window.innerHeight - t.getBoundingClientRect().top + 6) + "px";
    }
  }
  function echosCacherLigne() {
    clearTimeout(echosTimer);
    var e = echosDom() ? document.getElementById("echoLigne") : null;
    if (e) e.classList.remove("on");
  }
  function echosBloque() {
    var b = document.body.classList, f = document.getElementById("villeFondu");
    return b.contains("v-cine-on") || b.contains("v-au-stade") || !!(f && f.classList.contains("on")) || anyPanelOpen();
  }
  function echosMontrer(a) {
    var e = echosElLigne();
    if (!e) return;
    clearTimeout(echosTimer);
    e.textContent = a.texte;
    e.setAttribute("data-dir", a.dir);
    echosPlacer();
    void e.offsetWidth;                      // relancer la transition d'entrée
    e.classList.add("on");
    echosTimer = setTimeout(echosCacherLigne, ECHOS_REGLAGES.duree + a.texte.length * ECHOS_REGLAGES.parLettre);
  }
  // On attend le bon moment : une scène jouée, un fondu, le stade ou un panneau ouvert reportent la ligne ; sur la
  // ville, on laisse d'abord le message du récit arriver pour se poser au-dessus. Soixante secondes au plus.
  function echosEssayer() {
    clearTimeout(echosAttenteT);
    var a = echosAttente;
    if (!a || !echosDom()) return;
    var age = Date.now() - a.t0;
    if (age > 60000) { echosAttente = null; return; }
    if (echosBloque()) { echosAttenteT = setTimeout(echosEssayer, 500); return; }
    if (!echosCarteOuverte() && age < 650) { echosAttenteT = setTimeout(echosEssayer, 650 - age); return; }
    echosAttente = null;
    echosMontrer(a);
  }

  // ─── 2. LE RUBAN ─────────────────────────────────────────────────────────────
  function echosRetirerRuban() {
    if (!echosDom()) return;
    var l = document.querySelectorAll(".echo-ruban");
    for (var i = 0; i < l.length; i++) if (l[i].parentNode) l[i].parentNode.removeChild(l[i]);
  }
  function echosPoserRuban(libelle, an) {
    // sur la carte elle-même : elle l'emporte quand on la glisse (le ruban ne reste pas seul au milieu du vide)
    var st = echosDom() ? document.getElementById("card") : null;
    if (!st) return;
    echosRetirerRuban();
    var dit = "Parce que tu as dit \u00AB\u00A0" + libelle + "\u00A0\u00BB" + (an && view && an !== view.year ? ", en " + an : "");
    var r = document.createElement("div");
    r.className = "echo-ruban";
    r.setAttribute("aria-hidden", "true");           // la carte est une image (role="img") : ses enfants ne se lisent pas, sa légende, si
    var fleche = document.createElement("i"), pre = document.createElement("span"), lab = document.createElement("b");
    fleche.textContent = "\u21A9";
    pre.className = "e-pre"; pre.textContent = "Parce que tu as dit";
    lab.className = "e-lab"; lab.textContent = "\u00AB\u00A0" + libelle + "\u00A0\u00BB";
    r.appendChild(fleche); r.appendChild(pre); r.appendChild(lab);
    st.appendChild(r);
    st.setAttribute("aria-label", (st.getAttribute("aria-label") || "Carte").replace(/\. Parce que tu as dit.*$/, "") + ". " + dit);
    // le libellé ne tient pas ? la formule courte ; s'il ne tient toujours pas, il s'abrège avec des points (CSS)
    if (lab.scrollWidth > lab.clientWidth + 1) pre.textContent = "Tu as dit";
    if (window.requestAnimationFrame) window.requestAnimationFrame(function () { r.classList.add("on"); });
    else r.classList.add("on");
  }
  // Quelle origine rappeler sur cette carte ? { o, type } ou null. Sablier d'abord (la réponse a programmé la carte),
  // puis la variante d'étape qui la porte, sa condition, la suite d'arc qui y mène ; à rang égal, la plus ancienne.
  function echosChoisirRuban(v) {
    var c = v.card, I = echosIndex(), info = I.ctx[c.id] || {}, cands = [], R = ECHOS_REGLAGES;
    var lien = echos.o.c[c.id];
    if (lien && v.turn - lien[0] >= R.ecartSablier) cands.push({ p: 5, o: lien, type: "sablier" });
    function ajouter(noeud, p, type) {
      if (!noeud) return;
      var at = echosCauses(noeud, true, v, c);
      (at || []).forEach(function (a) { if (v.turn - a.o[0] >= R.ecartOrigine) cands.push({ p: p, o: a.o, type: type }); });
    }
    function neuve(x) { return echos.og.indexOf(x.o[1] + "@" + x.o[0]) < 0; }    // une réponse n'est rappelée qu'une fois
    ajouter(info.variante, 4, "variante");
    ajouter(info.when, 3, "condition");
    if (info.ouv) {
      // l'intrigue s'ouvre quand son `when` est vrai ET que l'une de ses entrées du programme l'est (un « ou » : s'il y en a une
      // sans condition, ou qu'une autre raison la rend vraie, la carte serait venue sans toi et echosCauses se tait)
      var arc = I.arc[info.ouv], ps = postulats[currentPostulat], ent = ps && I.pool[ps.id] ? I.pool[ps.id][info.ouv] : null;
      ajouter(arc && arc.when, 3.5, "intrigue");
      if (ent && ent.length) ajouter(ent.length === 1 ? ent[0] : ["or"].concat(ent), 3.5, "intrigue");
    }
    (info.entrees || []).forEach(function (n) { ajouter(n, 2, "suite"); });
    cands = cands.filter(neuve);
    if (!cands.length) return null;
    cands.sort(function (x, y) { return y.p - x.p || x.o[0] - y.o[0]; });
    return cands[0];
  }

  // ─── les crochets ────────────────────────────────────────────────────────────
  // L'index du contenu coûte quelques dizaines de millisecondes sur un téléphone : on le bâtit pendant que le joueur
  // lit sa première carte, pas au moment où elle se dessine (le premier appel qui le demande le bâtit sinon).
  function echosPreparer() { if (!echosIdx) setTimeout(echosIndex, 1500); }
  function echosRepartir() {
    // une carrière qui commence ou reprend : rien ne reste à l'écran de la précédente
    echosCacherLigne(); echosAttente = null; clearTimeout(echosAttenteT); echosRetirerRuban();
  }
  crochet("debut", function () {
    echosRepartir();
    echos = echosNeuf();
    echosPreparer();
    echosOublier(echos.k);                 // « rejouer cette graine » repart de zéro
    echosJournal = [];
    echosRejets = {};
  });
  crochet("reprise", function (v) {
    echosRepartir();
    echosPreparer();
    echos = echosLire(echosCle()) || echosNeuf();
    echos.k = echosCle();
    // une sauvegarde plus ancienne que la mémoire (un retour en arrière) : on oublie ce qui n'a pas encore eu lieu
    ["f", "r", "c"].forEach(function (k) {
      Object.keys(echos.o[k]).forEach(function (id) { if (echos.o[k][id][0] >= v.turn) delete echos.o[k][id]; });
    });
    if (echos.n.l >= v.turn) echos.n.l = -9;
    if (echos.n.r > v.turn) echos.n.r = -9;
    echos.n.h = echos.n.h.filter(function (t) { return t < v.turn; });
    Object.keys(echos.p).forEach(function (id) { if (echos.p[id] >= v.turn) delete echos.p[id]; });
    echosJournal = [];
  });
  crochet("accueil", echosRepartir);
  crochet("fin", function () {
    echosRepartir();
    if (echos) echosOublier(echos.k);
    echos = null;
  });
  crochet("reponse", function (e) {
    echosCacherLigne(); echosAttente = null; clearTimeout(echosAttenteT); echosRetirerRuban();
    if (echos) echos.cur = null;                 // le ruban de la carte qu'on quitte ne se remontrera pas
    var avant = e && e.avant, apres = e && e.apres, c = avant && avant.card;
    if (!echos || !c || !apres || c.single || !ECHOS_BEATS[c.beatKind] || ECHOS_SANS_ENJEU[c.kind]) return;
    var d = echosDiff(avant, apres);
    var cand = null;
    if (!apres.over) {                           // à la fin d'une carrière, l'écran de fin parle seul
      cand = echosCandidat(c, d, apres, avant.turn);
      if (!cand) echosRefus("rien");
      else if (!echosPorte(cand.score, avant.turn) || !echosAlterne(cand)) cand = null;
    }
    echosNoter(c, !!e.droite, avant, d);
    if (cand) {
      var texte = echosParole(cand);
      echos.n.l = avant.turn; echos.n.nl++;
      echos.n.h.push(avant.turn); if (echos.n.h.length > 8) echos.n.h.shift();
      echos.n.g = cand.dir === "neutre" ? 1 : 0;
      if (cand.id) echos.p[cand.id] = avant.turn;
      echosJournal.push({ t: "ligne", tour: avant.turn, carte: c.id, texte: texte, seau: cand.seau, score: cand.score });
      echosAttente = { texte: texte, dir: cand.dir, t0: Date.now() };
      // la carte suivante est dessinée après ce crochet : on attend qu'elle le soit pour savoir où se poser
      clearTimeout(echosAttenteT);
      echosAttenteT = setTimeout(echosEssayer, 140);
    }
    echosEcrire();
  });
  crochet("carte", function (v) {
    echosRetirerRuban();
    if (!echos || !v || !v.card) return;
    var c = v.card, cle = c.id + "|" + v.turn;
    // la ligne en cours suit la carte qui s'ouvre (la barre du haut) ; une reprise remontre le ruban déjà gagné
    if (echosDom() && document.getElementById("echoLigne") && document.getElementById("echoLigne").classList.contains("on")) echosPlacer();
    if (!ECHOS_BEATS[c.beatKind] || ECHOS_SANS_ENJEU[c.kind] || (c.tags || []).indexOf("intermede") >= 0) return;
    if (echos.cur && echos.cur[0] === cle) { echosPoserRuban(echos.cur[1], echos.cur[2]); return; }
    echos.cur = null;
    if (echos.vu.indexOf(c.id) >= 0 || v.turn - echos.n.r < ECHOS_REGLAGES.ecartRuban) return;
    var r = echosChoisirRuban(v);
    if (!r) return;
    echos.vu.push(c.id);
    echos.og.push(r.o[1] + "@" + r.o[0]);
    echos.n.r = v.turn; echos.n.nr++;
    echos.cur = [cle, r.o[2], r.o[3]];
    delete echos.o.c[c.id];
    echosJournal.push({ t: "ruban", tour: v.turn, carte: c.id, libelle: r.o[2], origine: { carte: r.o[1], tour: r.o[0] }, type: r.type });
    echosPoserRuban(r.o[2], r.o[3]);
    echosEcrire();
  });

  echosElLigne();

  // Pour les essais et le rapport : ce qui s'est montré, et la mémoire (lecture seule).
  window.FusibleEchos = {
    journal: function () { return echosJournal.slice(); },
    etat: function () { return echos ? JSON.parse(JSON.stringify(echos)) : null; },
    reglages: ECHOS_REGLAGES,
    paroles: ECHOS_PAROLES,
    rejets: function () { return JSON.parse(JSON.stringify(echosRejets)); },
    // le calcul seul, sans rien montrer : { ligne: {texte, dir, score} | null, diff } pour une paire de vues
    _evaluer: function (avant, apres, droite) {
      var d = echosDiff(avant, apres), cand = echosCandidat(avant.card, d, apres, avant.turn);
      return { diff: d, candidat: cand };
    }
  };
