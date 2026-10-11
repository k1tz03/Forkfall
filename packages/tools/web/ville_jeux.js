  // ═══════════════════════════════════════════════════════════════════════════
  // LES PETITS JEUX ET LES GESTES À PART — ville_jeux.js, inséré par assemble.js
  // dans la fermeture de ville.js (après ville_cinema.js).
  //
  // Punch Club : il y a toujours quelque chose à faire. Une activité peut porter
  // un petit jeu (`jeu:` — la cible du bar, le 421 sur la piste de feutre, les
  // jongles au terrain, le baby-foot, le flipper, les cartes de l'arrière-salle,
  // les tirs au but) ou un geste à part (`special:` — dormir, la télé, le
  // téléphone, le journal). Le hasard des jeux est celui du doigt et de la
  // ville : il ne touche jamais au moteur ni au Code de Carrière.
  // ═══════════════════════════════════════════════════════════════════════════
  var JEU = null;

  function uiJeu() {
    var el = $("villeJeu");
    if (el) return el;
    el = document.createElement("div"); el.className = "v-jeu"; el.id = "villeJeu"; el.hidden = true;
    el.setAttribute("role", "dialog"); el.setAttribute("aria-label", "Un petit jeu");
    el.innerHTML = '<div class="v-jeu-boite"><h2></h2><p class="v-jeu-regle"></p><canvas width="240" height="200"></canvas>' +
      '<div class="v-jeu-des" hidden></div><p class="v-jeu-score" aria-live="polite"></p>' +
      '<div class="v-jeu-btns"><button type="button" class="v-jeu-action"></button><button type="button" class="v-jeu-fermer">Laisser</button></div></div>';
    document.body.appendChild(el);
    el.querySelector(".v-jeu-fermer").addEventListener("click", function () { finJeu(null); });
    el.querySelector(".v-jeu-action").addEventListener("click", function () { if (JEU && JEU.action) JEU.action(); });
    el.querySelector("canvas").addEventListener("pointerdown", function (e) {
      if (!JEU || !JEU.tape) return;
      var r = this.getBoundingClientRect();
      JEU.tape((e.clientX - r.left) * (this.width / r.width), (e.clientY - r.top) * (this.height / r.height));
    });
    return el;
  }
  // un jeu : ouvre, tourne, rend un résultat (`gagne`, `score`, une phrase) à `fin`
  function jouerJeu(nom, a, fin) {
    var el = uiJeu(), J = JEUX[nom];
    if (!J) { fin({ gagne: false, score: 0, phrase: "" }); return; }
    occupe = true;
    var cv0 = el.querySelector("canvas"), x = cv0.getContext("2d");
    x.imageSmoothingEnabled = false;
    el.querySelector("h2").textContent = a.label;
    el.querySelector(".v-jeu-regle").textContent = J.regle;
    el.querySelector(".v-jeu-score").textContent = "";
    el.querySelector(".v-jeu-des").hidden = true;
    cv0.hidden = !!J.sansToile;
    var act = el.querySelector(".v-jeu-action");
    act.hidden = true;
    el.hidden = false;
    JEU = { nom: nom, a: a, fin: fin, x: x, w: cv0.width, h: cv0.height, t0: performance.now(), fini: false, el: el };
    J.debut(JEU);
    (function boucle(ts) {
      if (!JEU || JEU.fini) return;
      if (J.image) J.image(JEU, ts);
      requestAnimationFrame(boucle);
    })(performance.now());
  }
  function finJeu(res) {
    if (!JEU) return;
    var j = JEU;
    j.fini = true; JEU = null;
    j.el.hidden = true;
    occupe = false;
    if (j.fin) j.fin(res);
  }
  // la fin d'une partie : le score, puis « Fermer » rend la main à la ville
  function resultat(j, gagne, score, phrase) {
    j.tape = null;
    j.el.querySelector(".v-jeu-score").textContent = phrase;
    var act = j.el.querySelector(".v-jeu-action");
    act.textContent = "Continuer"; act.hidden = false;
    j.action = function () { finJeu({ gagne: gagne, score: score, phrase: phrase }); };
    j.el.querySelector(".v-jeu-fermer").hidden = true;
  }
  function fond(j, c) { j.x.fillStyle = c || "#140C08"; j.x.fillRect(0, 0, j.w, j.h); }
  function rond(j, cx, cy, r, c) { j.x.fillStyle = c; j.x.beginPath(); j.x.arc(cx, cy, r, 0, Math.PI * 2); j.x.fill(); }

  var JEUX = {
    // LA CIBLE : la main tremble ; on lâche quand le viseur passe au centre. Trois fléchettes.
    flechettes: {
      regle: "Le viseur tremble comme ta main. Touche pour lancer. Trois fléchettes : soixante points pour gagner.",
      debut: function (j) { j.lances = []; j.total = 0; j.tape = function () { lancerFlechette(j); }; },
      image: function (j, ts) {
        var t = (ts - j.t0) / 1000, cx = 120, cy = 100;
        j.vx = cx + Math.sin(t * 2.3) * 34 + Math.sin(t * 5.1) * 10;
        j.vy = cy + Math.cos(t * 1.9) * 30 + Math.sin(t * 6.3) * 8;
        fond(j);
        [[78, "#1E1A16"], [66, "#E9E3D2"], [54, "#1F5E2E"], [42, "#E9E3D2"], [30, "#8E1B24"], [18, "#1F5E2E"], [8, "#C51F3A"], [3, "#F2E8CE"]].forEach(function (r) { rond(j, cx, cy, r[0], r[1]); });
        j.lances.forEach(function (l) { j.x.fillStyle = "#FFD34E"; j.x.fillRect(l[0] - 1, l[1] - 1, 3, 3); });
        if (j.tape) { j.x.strokeStyle = "#E0164B"; j.x.lineWidth = 1; j.x.beginPath(); j.x.moveTo(j.vx - 7, j.vy); j.x.lineTo(j.vx + 7, j.vy); j.x.moveTo(j.vx, j.vy - 7); j.x.lineTo(j.vx, j.vy + 7); j.x.stroke(); }
      },
    },
    // LE 421 : trois dés, trois lancers ; on garde ce qu'on veut. 4-2-1 paie quatre fois.
    des: {
      sansToile: true,
      regle: "Trois dés, trois lancers. Touche un dé pour le garder. 4-2-1 paie quatre fois la mise, un brelan deux fois, une suite une fois et demie.",
      debut: function (j) {
        j.d = [0, 0, 0]; j.garde = [false, false, false]; j.n = 0;
        var box = j.el.querySelector(".v-jeu-des"); box.hidden = false; box.innerHTML = "";
        for (var i = 0; i < 3; i++) {
          var b = document.createElement("button"); b.type = "button"; b.className = "v-de"; b.textContent = "·"; b.dataset.i = i;
          b.addEventListener("click", function () { var k = +this.dataset.i; if (!j.n || j.n >= 3 || JEU !== j) return; j.garde[k] = !j.garde[k]; this.classList.toggle("garde", j.garde[k]); });
          box.appendChild(b);
        }
        var act = j.el.querySelector(".v-jeu-action"); act.textContent = "Lancer"; act.hidden = false;
        j.action = function () {
          if (j.n >= 3) return;
          j.n++;
          for (var i = 0; i < 3; i++) if (!j.garde[i]) j.d[i] = 1 + Math.floor(Math.random() * 6);
          var bs = box.querySelectorAll(".v-de");
          for (var k = 0; k < 3; k++) { bs[k].textContent = "⚀⚁⚂⚃⚄⚅".charAt(j.d[k] - 1); bs[k].classList.add("roule"); (function (b) { setTimeout(function () { b.classList.remove("roule"); }, 260); })(bs[k]); }
          var s = j.d.slice().sort().join(""), v = s === "124" ? 4 : (j.d[0] === j.d[1] && j.d[1] === j.d[2]) ? 2 : (s === "123" || s === "234" || s === "345" || s === "456") ? 1.5 : 0;
          if (v === 4 || j.n >= 3) {
            var ph = v === 4 ? "Quatre, deux, un. Le patron essuie le comptoir sans un mot et pousse les billets." : v === 2 ? "Un brelan. Au comptoir, quelqu'un siffle." : v === 1.5 ? "Une suite. Ça rembourse, à peine." : "Rien. La piste de feutre garde ta mise.";
            act.hidden = true;
            setTimeout(function () { if (JEU === j) resultat(j, v > 0, v, ph); }, 420);
          } else act.textContent = "Relancer (" + (3 - j.n) + ")";
        };
      },
    },
    // LES JONGLES : touche quand le ballon redescend au pied. On compte.
    jongles: {
      regle: "Touche quand le ballon tombe dans la bande claire, au pied. Dix jongles pour gagner.",
      debut: function (j) { j.by = 40; j.vy = 0; j.n = 0; j.tape = function () { if (j.by > 140 && j.by < 176) { j.vy = -(230 + Math.random() * 40); j.n++; } else perdre(); }; function perdre() { if (j.tape) resultat(j, j.n >= 10, j.n, j.n + (j.n > 1 ? " jongles." : " jongle.") + (j.n >= 10 ? " Les gamins du square ont compté avec toi." : " Le ballon file sous une voiture.")); } j.perdre = perdre; },
      image: function (j, ts) {
        var dt = Math.min(0.04, (ts - (j.tp || ts)) / 1000); j.tp = ts;
        if (j.tape) { j.vy += 420 * dt; j.by += j.vy * dt; if (j.by > 190) j.perdre(); }
        fond(j, "#1D3A22");
        j.x.fillStyle = "rgba(242,232,206,.14)"; j.x.fillRect(0, 140, j.w, 36);
        j.x.fillStyle = "#2B5530"; for (var i = 0; i < 12; i++) j.x.fillRect(i * 20, 186, 10, 14);
        rond(j, 120, j.by, 8, "#EDEBE2"); j.x.fillStyle = "#222"; j.x.fillRect(117, j.by - 2, 4, 4);
        j.x.fillStyle = "#F2E8CE"; j.x.font = "bold 18px monospace"; j.x.fillText(String(j.n), 10, 24);
      },
    },
    // LE BABY-FOOT, LE FLIPPER, LES TIRS AU BUT : un curseur qui va et vient ; on frappe dans la zone. Cinq essais.
    frappe: {
      regle: "Le curseur va et vient. Touche quand il passe dans la zone claire. Cinq essais, trois pour gagner.",
      debut: function (j) { j.essais = 0; j.reussis = 0; j.zone = 0.4 + Math.random() * 0.2; j.tape = function () { var p = j.pos; j.essais++; var ok = Math.abs(p - j.zone) < 0.09; if (ok) j.reussis++; j.flash = { ok: ok, t: performance.now() }; j.zone = 0.2 + Math.random() * 0.6; if (j.essais >= 5) { var g = j.reussis >= 3; resultat(j, g, j.reussis, j.reussis + " sur 5." + (g ? " " + (j.gagneTxt || "Gagné.") : " " + (j.perduTxt || "Perdu."))); } }; },
      image: function (j, ts) {
        var t = (ts - j.t0) / 1000, v = 1.1 + j.essais * 0.25;
        j.pos = 0.5 + 0.5 * Math.sin(t * v * 2.2);
        fond(j);
        j.x.fillStyle = "#3A2A20"; j.x.fillRect(20, 90, 200, 20);
        j.x.fillStyle = "rgba(242,232,206,.35)"; j.x.fillRect(20 + (j.zone - 0.09) * 200, 90, 0.18 * 200, 20);
        j.x.fillStyle = "#E0164B"; j.x.fillRect(20 + j.pos * 200 - 1, 84, 3, 32);
        for (var i = 0; i < 5; i++) { j.x.fillStyle = i < j.essais ? (i < j.reussis ? "#9BD36A" : "#6A2A2A") : "#3A2A20"; j.x.fillRect(80 + i * 18, 140, 12, 12); }
        if (j.flash && ts - j.flash.t < 300) { j.x.fillStyle = j.flash.ok ? "rgba(155,211,106,.25)" : "rgba(224,22,75,.25)"; j.x.fillRect(0, 0, j.w, j.h); }
      },
    },
    // LES CARTES : plus haut que le donneur, trois manches.
    cartes: {
      sansToile: true,
      regle: "Plus haut que le donneur. Trois manches : deux pour emporter la mise.",
      debut: function (j) {
        j.m = 0; j.g = 0; var box = j.el.querySelector(".v-jeu-des"); box.hidden = false; box.innerHTML = '<div class="v-cartes"><span class="toi">?</span><span class="lui">?</span></div>';
        var act = j.el.querySelector(".v-jeu-action"); act.textContent = "Tirer"; act.hidden = false;
        var V = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "V", "D", "R", "As"];
        j.action = function () {
          if (j.m >= 3) return;
          var a = Math.floor(Math.random() * 13), b = Math.floor(Math.random() * 13);
          while (a === b) b = Math.floor(Math.random() * 13);
          j.m++; if (a > b) j.g++;
          box.querySelector(".toi").textContent = V[a]; box.querySelector(".lui").textContent = V[b];
          j.el.querySelector(".v-jeu-score").textContent = "Manche " + j.m + " : " + (a > b ? "à toi." : "au donneur.") + " (" + j.g + " – " + (j.m - j.g) + ")";
          if (j.g >= 2 || j.m - j.g >= 2 || j.m >= 3) { act.hidden = true; var gg = j.g >= 2; setTimeout(function () { if (JEU === j) resultat(j, gg, j.g, gg ? "Le donneur pousse les billets sous le cendrier, vers toi." : "Le donneur ramasse. Personne ne te regarde partir."); }, 600); }
        };
      },
    },
  };
  // la cible : un lancer
  function lancerFlechette(j) {
    if (!j.tape) return;
    var dx = j.vx - 120, dy = j.vy - 100, d = Math.hypot(dx, dy);
    var pts = d < 3 ? 50 : d < 8 ? 25 : d < 18 ? 20 : d < 30 ? 15 : d < 42 ? 10 : d < 54 ? 5 : d < 66 ? 2 : 0;
    j.lances.push([Math.round(j.vx), Math.round(j.vy)]);
    j.total += pts;
    j.el.querySelector(".v-jeu-score").textContent = j.lances.length + " · " + pts + " points (total " + j.total + ")";
    if (j.lances.length >= 3) { var g = j.total >= 60; resultat(j, g, j.total, j.total + " points." + (g ? " Le comptoir te paie un demi." : " Quelqu'un rit dans ton dos.")); }
  }
  JEUX.flechettes.debut = function (j) { j.lances = []; j.total = 0; j.tape = function () { lancerFlechette(j); }; };
  JEUX.babyfoot = { regle: JEUX.frappe.regle, image: JEUX.frappe.image, debut: function (j) { JEUX.frappe.debut(j); j.gagneTxt = "La pissette passe, la demi-volée aussi. Le perdant paie la tournée."; j.perduTxt = "Le goal adverse ricane. Il ne lâche jamais la barre."; } };
  JEUX.flipper = { regle: "La bille arrive : touche quand elle passe dans la zone claire. Cinq billes, trois pour une partie gratuite.", image: JEUX.frappe.image, debut: function (j) { JEUX.frappe.debut(j); j.gagneTxt = "Le flipper claque : partie gratuite. Personne ne la joue."; j.perduTxt = "TILT. Le patron ne relève pas la tête."; } };
  JEUX.penalty = { regle: "Le gardien bouge. Touche quand le curseur est dans la zone claire : le coin qu'il ne couvre pas. Cinq tirs.", image: JEUX.frappe.image, debut: function (j) { JEUX.frappe.debut(j); j.gagneTxt = "Le gardien des moins de quinze ans va chercher le ballon dans les filets."; j.perduTxt = "Il a deviné. Il devine toujours, ce gamin."; } };

  // ─── les gestes à part
  // la télé : les résultats, le classement, ce que l'époque raconte (la frise)
  function regarderTele(cle) {
    var v = vue || {}, out = [];
    var res = (v.resultats || "").split(/\s+/).filter(Boolean).slice(-6);
    if (res.length) out.push("Les résultats de la journée : " + res.map(function (r) { return r === "V" ? "victoire" : r === "N" ? "nul" : "défaite"; }).slice(-3).join(", ") + ".");
    if (v.rank) out.push((v.club || "Le club") + " est " + (v.rank === 1 ? "premier" : v.rank + "e") + " du classement.");
    var fr = v.frise || {}, ev = [];
    (fr.saisons || []).forEach(function (s) { (s.evenements || []).forEach(function (e) { ev.push(e.label); }); });
    (fr.jalons || []).forEach(function (j) { if (j.annee <= (v.year || 9999)) ev.push(j.label); });
    ev.slice(-2).forEach(function (e) { out.push(e + "."); });
    if (!out.length) out.push("Un jeu télévisé, des rires en boîte. Personne ne regarde vraiment.");
    return out.join(" ");
  }
  // le téléphone : quelqu'un que tu connais décroche, et dit une chose du moment
  function ouvrirTelephone(cle) {
    var el = $("villePorte"), connus = Object.keys(S.vus || {}).filter(function (q) { return CHARS[q]; }).sort().slice(0, 12);
    var html = '<h2>Le téléphone</h2><p class="v-sous">' + esc(nomLieu(LIEU[cle]) + " · " + JOUR_MOT[S.jour] + " · " + TRANCHE_MOT[TRANCHES[S.tranche]].toLowerCase()) + '</p>';
    if (!connus.length) html += '<p class="v-texte">Tu ne connais encore personne à qui téléphoner.</p>';
    else {
      html += '<div class="v-acts">';
      connus.forEach(function (q) { html += '<button type="button" class="v-act v-appel" data-q="' + esc(q) + '"><b>' + esc(nomDe(q)) + '</b><span class="cout"><span>' + esc((CHARS[q].label || "").toLowerCase()) + '</span></span></button>'; });
      html += '</div>';
    }
    html += '<div class="v-pied"><button type="button" class="v-sortir">Raccrocher</button></div>';
    el.innerHTML = html; el.classList.remove("v-mission", "v-scene"); el.classList.add("on");
    porteOuverte = cle;
    el.querySelector(".v-sortir").addEventListener("click", fermerPorte);
    el.querySelectorAll(".v-appel").forEach(function (b) {
      b.addEventListener("click", function () {
        var q = b.getAttribute("data-q"), p = parole(q, null);
        S.appels = S.appels || {};
        var deja = S.appels[q] === S.semaine + ":" + S.jour;
        S.appels[q] = S.semaine + ":" + S.jour;
        var texte = deja ? nomDe(q) + " ne décroche pas. La sonnerie, longtemps." : p ? nomDe(q) + ", au bout du fil : « " + remplir(p.texte) + " »" : nomDe(q) + " écoute, dit « oui », raccroche.";
        if (!deja && CHARS[q]) S.vus[q] = 1;
        fermerPorte(); toast(texte); sauver();
      });
    });
  }
  // le journal : la une du jour, et les brèves
  function lireJournal() {
    var v = vue || {}, fr = v.frise || {}, l = [];
    (fr.saisons || []).slice(-1).forEach(function (s) { (s.evenements || []).slice(-3).forEach(function (e) { l.push(e.label); }); });
    var titre = v.rank ? (v.club || "Le club").toUpperCase() + " " + (v.rank <= 3 ? "Y CROIT" : v.rank >= 15 ? "S'ENFONCE" : "TIENT BON") : "LA VILLE ATTEND";
    return "En une : « " + titre + " ». " + (l.length ? "En pages intérieures : " + l.join(" ; ") + "." : "En pages intérieures, les chiens écrasés et la météo du marché.");
  }
  // le crochet du panneau : une activité à jeu ou à geste à part
  window.FusibleVilleJeux = {
    // un objet touché qui n'a qu'un geste à part le joue tout de suite
    objet: function (o, cle) { return false; },
  };
  function faireSpecial(a, cle, texte) {
    if (a.special === "dormir") { fermerPorte(); dormir(); return true; }
    if (a.special === "tele") return regarderTele(cle);
    if (a.special === "journal") return lireJournal();
    if (a.special === "telephone") { ouvrirTelephone(cle); return true; }
    return false;
  }
