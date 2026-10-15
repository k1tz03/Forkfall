  // ═══════════════════════════════════════════════════════════════════════════
  // LE RYTHME — ville_rythme.js, inséré par assemble.js dans la fermeture de
  // ville.js (au repère `__VILLE_MODULES__`) : il voit et touche tout ce que la
  // ville connaît.
  //
  // Le banc QA a relevé, en jouant le livre 4 quinze minutes en lecteur moyen : 1,5
  // décision par minute, une toutes les 25 secondes ; 42 % du temps à regarder le
  // héros marcher (jusqu'à 18 secondes par « Y aller » vers le port ou la campagne),
  // 22 % à attendre (cinq secondes de fondus pour franchir un dimanche soir), 16 %
  // à lire ; trois minutes vingt de la touche d'une histoire à sa première décision
  // (dont dix secondes de marche : le reste, c'est l'introduction). Trois remèdes, ici :
  //   · au-delà de quelques rues, un fondu court remplace la marche (`sauterVers`) ;
  //     toucher la ville pour marcher, lui, reste une marche ;
  //   · « Attendre », et « Y aller » vers un rendez-vous plus tard : un seul fondu court,
  //     l'heure qui défile dessous (`laisserPasser`) ;
  //   · la carrière s'ouvre sur sa première carte, tout de suite après l'introduction
  //     (`ouvrirSurUneCarte`).
  // ═══════════════════════════════════════════════════════════════════════════
  // au-delà, on ne marche plus : des cases de 4 voxels ; au pas (70 voxels par seconde), 30 cases font
  // une seconde trois quarts, à peu près l'écran en travers. Un véhicule (`usage.vitesse`) fait marcher
  // plus loin pour le même temps à l'écran.
  var MARCHE_COURTE = 30;

  function longueurChemin(ch) {
    var n = 0;
    for (var i = 1; i < ch.length; i++) n += Math.hypot(ch[i][0] - ch[i - 1][0], ch[i][1] - ch[i - 1][1]);
    return n;
  }
  function marcheTropLongue(ch) { return longueurChemin(ch) > MARCHE_COURTE * vitesseBiens(); }
  // dans une pièce, le chemin de la ville n'est pas celui qu'on voit : à vol d'oiseau, que l'on majore
  // un peu (les rues ne vont pas droit)
  function butLoin(cle) {
    var a = LIEU[dedans.cle], b = LIEU[cle];
    if (!a || !a.door || !b || !b.door) return false;
    return Math.hypot(b.door[0] - a.door[0], b.door[1] - a.door[1]) * 1.3 > MARCHE_COURTE * vitesseBiens();
  }

  // ─── le garde-fou : un noir qui dure plus de vingt-cinq secondes n'est plus un fondu (une chaîne d'annonces,
  // la plus longue, en prend une dizaine) ; rien ne le lèvera, et il barre tout l'écran — on le lève
  var FONDU_DEPUIS = 0;
  setInterval(function () {
    var f = $("villeFondu");
    if (!f || !f.classList.contains("on")) { FONDU_DEPUIS = 0; return; }
    if (!FONDU_DEPUIS) { FONDU_DEPUIS = Date.now(); return; }
    if (Date.now() - FONDU_DEPUIS < 25000) return;
    FONDU_DEPUIS = 0;
    f.classList.remove("on"); f.classList.remove("court"); f.classList.remove("vite");
    if (window.console) console.warn("ville : un fondu noir de plus de vingt-cinq secondes a été levé de force");
  }, 1000);

  // ─── un fondu court : 0,35 s pour tomber au noir, 0,35 s pour en sortir
  function fonduCourt(auNoir, ensuite) {
    var f = $("villeFondu"), p = f.querySelector("p");
    f.querySelector("b").textContent = ""; f.querySelector("span").textContent = "";
    p.textContent = ""; p.hidden = true;
    f.classList.add("court"); f.classList.add("on");
    setTimeout(function () {
      // une erreur pendant le noir ne laisse pas l'écran noir : le fondu se lève quand même
      try { if (auNoir) auNoir(); } catch (e) { if (window.console) console.error("fondu court", e); }
      f.classList.remove("on");
      setTimeout(function () { f.classList.remove("court"); if (ensuite) ensuite(); }, 350);
    }, 350);
  }

  // ─── le héros à la porte d'un lieu, pendant le noir ; si l'on y entre, on y entre déjà : un
  // seul fondu pour le trajet et pour la porte
  function poserAuLieu(cle) {
    var l = LIEU[cle];
    if (!l || !l.door) return;
    if (dedans && dedans.cle === cle) { recaler(); return; }     // déjà là : les gens de la pièce suivent l'heure
    if (dedans) aDehors(true);
    var d = plusProche(l.door[0], l.door[1], 16) || l.door, c = centre(d);
    poser(c[0], c[1]);
    S.lieu = cle;
    cam.libre = false;
    var p = visee(); cam.x = p[0]; cam.y = p[1];
    recaler();
    if (doitEntrer(cle)) entrer(cle);
  }
  // aller quelque part de loin : le fondu, puis la même arrivée qu'au bout d'une marche (la carte
  // qui attend, la scène, le panneau du lieu)
  function sauterVers(cle) {
    var l = LIEU[cle];
    if (!l || !l.door || occupe || LAPS || carteOn || CINE || MATCH) return;
    occupe = true;
    fermerPorte(); heros.chemin = null; heros.arrivee = null;
    fonduCourt(function () { poserAuLieu(cle); }, function () {
      occupe = false;
      arriver(cle);
      verifierRue();
    });
  }

  // ─── le temps qui passe, d'un seul fondu
  // Le noir tombe (0,35 s), le temps passe dessous — une tranche après l'autre, les scènes, les
  // échéances, les nuits chez soi : les mêmes règles qu'avant, sans les fondus —, l'heure défile
  // en gros sur le noir (0,9 s au plus), le jour se lève (0,35 s) : deux secondes au plus.
  //   o.jusqua : l'heure d'un rendez-vous plus tard (« Y aller ») ; sinon, jusqu'à ce qu'il
  //              arrive quelque chose (le rendez-vous qui s'ouvre, l'heure d'une mission)
  //   o.vers   : le lieu où l'on se retrouve à l'arrivée, à sa porte
  var LAPS = false;
  function heureCourante() {
    var tr = TRANCHES[S.tranche];
    return { jour: JOUR_MOT[S.jour].charAt(0).toUpperCase() + JOUR_MOT[S.jour].slice(1), tranche: TRANCHE_MOT[tr], heure: HEURE[tr] };
  }
  // on rentre dormir chez soi, sans fondu à part : le noir est déjà là
  function dormirDansLeNoir() {
    var chez = chezToi();
    if (!(dedans && dedans.cle === chez) && LIEU[chez] && LIEU[chez].door) { var c = centre(LIEU[chez].door); poserEnVille(c[0], c[1]); S.lieu = chez; }
    S.eveil = 0;
    var garde = 0;
    do { S.tranche++; if (S.tranche > 4) { S.tranche = 0; nouveauJour(); } } while (S.tranche !== 0 && ++garde < 10);
    // on se réveille chez soi : dans sa pièce, si elle en a une (les gens de la rue et de la pièce, eux,
    // ne sont replacés qu'une fois, à la fin : `laisserPasser`)
    if (aInterieur(chez) && S.lieu === chez) entrer(chez);
  }
  // le temps passe d'un coup, derrière le noir ; ce qui arrive en chemin le dit (`evenement`)
  function avancerSousLeNoir(o, rdvAvant, miAvant) {
    var heures = [], nuits = 0, evenement = false;
    function arret() {
      if (o.jusqua != null) return tNow() >= o.jusqua;
      return (!rdvAvant && rdvVisible()) || (!miAvant && missionOuverte());
    }
    for (var garde = 0; garde < 60 && !arret(); garde++) {
      if (!actif || (vue && vue.over)) { evenement = true; break; }
      if (S.tranche === 4) {
        // la nuit tombée, on rentre dormir ; trois nuits au plus d'un seul geste, puis la main revient
        if (nuits >= 3) break;
        nuits++;
        dormirDansLeNoir();
        heures.push(heureCourante());
        if (echeance() || sceneDue()) { evenement = true; break; }
        continue;
      }
      var ok = pas();
      heures.push(heureCourante());
      if (!ok) { evenement = true; break; }
    }
    return { heures: heures, evenement: evenement };
  }
  // l'heure qui défile sur le noir : six au plus, la dernière est celle où l'on arrive
  function defilerHeures(heures, fin) {
    var f = $("villeFondu"), b = f.querySelector("b"), sp = f.querySelector("span");
    var n = heures.length, saut = Math.max(1, Math.ceil(n / 6)), liste = [];
    for (var k = saut - 1; k < n; k += saut) liste.push(heures[k]);
    if (n && liste[liste.length - 1] !== heures[n - 1]) liste.push(heures[n - 1]);
    var dt = Math.max(150, Math.min(260, 900 / Math.max(1, liste.length))), i = 0;
    (function suivre() {
      if (i >= liste.length) { setTimeout(fin, 120); return; }
      b.textContent = liste[i].jour + " · " + liste[i].tranche; sp.textContent = liste[i].heure;
      i++;
      setTimeout(suivre, dt);
    })();
  }
  // le jour est levé : ce qui commence là où l'on est, sinon l'heure qu'il est
  function finDuTempsPasse(o, arrive) {
    majHud(); sauver();
    if (!actif || (vue && vue.over)) return;
    if (arrive) { arriver(o.vers); verifierRue(); return; }
    if (rdvVisible() && aLaPorte(rdv.lieu)) { arriver(rdv.lieu); return; }
    if (missionOuverte() && aLaPorte(S.mission.lieu)) { arriver(S.mission.lieu); return; }
    var dit = heureCourante().jour + ", " + HEURE[TRANCHES[S.tranche]] + ".";
    if (rdvVisible()) dit += " " + (rdv.type === "match" ? "Le match · " : (rdv.qui ? nomDe(rdv.qui) + " t'attend · " : "On t'attend · ")) + nomLieu(LIEU[rdv.lieu]) + ".";
    else if (missionOuverte()) dit += " " + MISSION[S.mission.id].titre + " · " + nomLieu(LIEU[S.mission.lieu]) + " : c'est l'heure.";
    toast(dit);
    annoncer();
  }
  function laisserPasser(o) {
    o = o || {};
    if (LAPS || carteOn || occupe || CINE || MATCH || !S) return;
    LAPS = true;
    fermerPorte();
    heros.chemin = null; heros.arrivee = null;
    var rdvAvant = !!rdvVisible(), miAvant = missionOuverte();
    var f = $("villeFondu"), h0 = heureCourante(), p = f.querySelector("p");
    f.querySelector("b").textContent = h0.jour + " · " + h0.tranche; f.querySelector("span").textContent = h0.heure;
    p.textContent = ""; p.hidden = true;
    occupe = true;
    f.classList.add("court"); f.classList.add("on");
    setTimeout(function () {
      // le noir est tombé : le temps passe dessous
      occupe = false;
      var r;
      try { r = avancerSousLeNoir(o, rdvAvant, miAvant); majHud(); sauver(); } catch (e) {
        // une erreur sous le noir ne fige pas la ville : le jour se lève là où le temps s'est arrêté
        if (window.console) console.error("le temps qui passe", e);
        f.classList.remove("on"); f.classList.remove("court"); LAPS = false;
        return;
      }
      if (!actif || (vue && vue.over)) { f.classList.remove("on"); f.classList.remove("court"); LAPS = false; return; }
      if (r.evenement) {
        // une carte, une scène a pris la main. Une scène de la ville ou un fondu vite tiennent le noir et le
        // lèvent eux-mêmes (`fonduTexte`, `fonduVite`) ; une carte, elle, n'a pas de fondu : le noir se lève sur
        // elle ; et une scène jouée qui s'ouvre sur son titre (`carteTitre`) a ses propres bandes, et personne
        // d'autre ne lèverait le noir (il barrait le bouton « Passer » : mesuré, une carrière figée douze minutes)
        f.classList.remove("court");
        if (!occupe || (CINE && CINE.c && CINE.c.titre)) f.classList.remove("on");
        LAPS = false;
        return;
      }
      // rien en chemin : on se retrouve à la porte du rendez-vous, si l'on y allait
      var arrive = !!(o.vers && o.jusqua != null && tNow() >= o.jusqua && LIEU[o.vers]);
      if (arrive) poserAuLieu(o.vers); else recaler();     // sous le noir, chacun est déjà à sa place pour l'heure qu'il est
      defilerHeures(r.heures, function () {
        var rendre = function () {
          var allume = f.classList.contains("on"), court = f.classList.contains("court");
          f.classList.remove("on");
          setTimeout(function () { f.classList.remove("court"); occupe = false; LAPS = false; finDuTempsPasse(o, arrive); }, allume ? (court ? 350 : 420) : 0);
        };
        // la fin de la semaine (la Une), la banque, l'huissier : sur le noir, puis le jour se lève
        chapitreSiDu(function () { if (attente.length) f.classList.remove("court"); suiteFondus(rendre); });
      });
    }, 350);
  }

  // une carrière qui commence, ou qui reprend, ne garde rien du temps qui passait dans la précédente : le
  // tribunal de commerce ferme le livre sous le noir sans que `rendre` s'exécute, et `LAPS` (comme `occupe`)
  // restait levé — « Attendre » ne répondait plus à la carrière suivante, jouée dans la même page
  crochetVille("debut", function () { LAPS = false; occupe = false; });
  crochetVille("reprise", function () { LAPS = false; occupe = false; });

  // « Attendre » se grise le temps d'un fondu ou d'une carte (`majHud`), et ne se dégrisait qu'au `majHud`
  // suivant : en sortant d'une pièce (le fondu de la porte), il restait grisé dehors, et le temps ne passait
  // plus tant qu'on ne faisait pas autre chose. Quand la ville est au repos, il est libre.
  var ATT_T = 0;
  function guetterAttendre(ts) {
    if (ts - ATT_T < 300) return;
    ATT_T = ts;
    var bt = $("villeAttendre");
    if (bt && bt.disabled) bt.disabled = false;
  }

  // ─── la carrière s'ouvre sur sa première carte
  // L'introduction jouée, la première carte se montre là où l'on est, sans marche : la première
  // décision suit l'introduction. (Mesuré : 3 min 23 de la touche d'une histoire à la première
  // décision — vingt-quatre répliques, puis la marche jusqu'au club-house.) Le reste de la première
  // semaine ne change pas ; l'aide de la ville se dit après la première réponse.
  var AIDE_VILLE = "Touche la ville pour marcher, un nom pour y aller. En rouge : là où l'on t'attend.";
  function ouvrirSurUneCarte() {
    if (!S) return;
    var servie = !!(rdv && vue && !vue.over && !carteOn && !CINE && !occupe && !rdv.sombre && (rdv.type === "normal" || rdv.type === "prologue") && rdv.cle === cleVue(vue));
    if (servie) { S.aide = 1; montrerCarte(); return; }
    S.aide = 2;
    toast(AIDE_VILLE);
  }
  // la première carte est jouée : l'aide de la ville, quand on est de retour dedans
  function direAideVille() {
    if (!S || S.aide !== 1) return;
    S.aide = 2;
    setTimeout(function () { if (S && !carteOn && !CINE && !occupe) toast(AIDE_VILLE); }, 6200);
  }
