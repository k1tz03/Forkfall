  // ═══ LE PARTAGE ═══ (module de l'aperçu : assemble.js, PREVIEW_MODULES)
  // Partager sa Une, défier un ami, le livre du jour. Le module ne touche ni au moteur ni au
  // gabarit : il s'abonne aux crochets 'accueil', 'debut' et 'fin' de window.FusibleApercu, pose
  // son propre DOM (l'accueil : le défi reçu, le livre du jour, la saisie d'un code ; l'écran de
  // fin : la comparaison, le résultat du jour, « Partager ma Une ») et sa propre feuille de style.
  // Tout est dans une fermeture : aucun nom de plus dans celle de la page.
  //
  //  · LA UNE EN IMAGE — l'écran de fin est relu (#etitle, #epitaph, #unePhoto, #score…) et
  //    composé sur un <canvas> en affiche : story 1080×1920 ou carré 1080×1080, le titre du
  //    journal, la photo, le livre et sa couleur, FUSIBLE, la ligne de défi. Envoyée par le
  //    partage du téléphone ; sinon enregistrée (capacité `downloads` du visualiseur) ; sinon
  //    montrée en grand (appui long). Chaque chemin échoue sans bruit et ne bloque jamais l'écran.
  //  · FAIS MIEUX QUE MOI — un défi = le livre, la graine, ta fin, tes cartes, tes saisons, ton
  //    prénom : un code court avec somme de contrôle (16 signes en base 32, puis le prénom en
  //    clair, à titre de décoration), et un lien `?defi=<code>` (ou `#defi=<code>` : dans le visualiseur la requête
  //    n'atteint pas toujours la page, d'où aussi la saisie du code sur l'accueil). Le texte du
  //    défi part avec l'image, ou seul (« Envoyer le défi » : le partage du téléphone, sinon la
  //    copie). Le défi reçu ne montre que le nombre de cartes ; à la fin de la carrière jouée sur
  //    la même graine, l'écran de fin compare les deux fins.
  //  · LE LIVRE DU JOUR — la date locale (AAAA-MM-JJ) donne un livre et une graine, les mêmes pour
  //    tous ce jour-là. Le résultat reste en local (historique borné) et, quand la base partagée
  //    est là, dans `jour/<id de l'utilisateur>` : un seul document par personne, le dernier
  //    résultat du jour, jamais écrit au chargement. De la collection `jour` on tire « n joueurs
  //    ont fini » et « 43 % ont fini <fin> ». Sans base (fichier local, hors connexion, lecture
  //    seule), la page dit seulement « Partage le lien pour comparer ».
  //
  // Clés localStorage : fusible.defi (le défi en cours : {code, vu}), fusible.jour (le livre du
  // jour lancé : {date, postulat, seed}), fusible.jours (l'historique des résultats du jour,
  // borné), fusible.partage (le format choisi). Capacités du visualiseur demandées à la
  // publication : db (règles : jour lisible par tous, jour/{self} écrit par son auteur), user,
  // downloads. Les chaînes lues dans la base ne sont jamais affichées telles quelles : ce ne sont
  // que des clés dans les tables du jeu.
  (function () {
    var A = window.FusibleApercu;
    if (!A || typeof A.crochet !== "function") return;

    var CLE_DEFI = "fusible.defi", CLE_JOUR = "fusible.jour", CLE_JOURS = "fusible.jours", CLE_PARTAGE = "fusible.partage";
    var B32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";            // base 32 lisible : ni I, ni L, ni O, ni U
    var POLICE = '"Space Mono","DejaVu Sans Mono",ui-monospace,Menlo,Consolas,monospace';
    var PAPIER = "#EFE5CB", ENCRE = "#1B1109", ENCRE2 = "#5A4A33", FRAMBOISE = "#E0164B", CREME = "#F2E8CE", CREME2 = "#C4B491";
    var FORMATS = {
      story: { l: 1080, h: 1920, nom: "Story", rapport: "9:16", fichier: "fusible-une-story.png" },
      carre: { l: 1080, h: 1080, nom: "Carré", rapport: "1:1", fichier: "fusible-une-carre.png" }
    };
    var NBSP = String.fromCharCode(160);                       // l'espace insécable, écrite pour qu'on la voie
    var LETTRES_RE = /^[A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŒÆŸ]$/;
    var JOURS_COURTS = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
    var MOIS_COURTS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

    var etat = {
      defi: null,          // le défi reçu et pas encore joué (décodé)
      avis: "",            // un message poli à montrer une fois sur l'accueil (code du lien illisible)
      carriere: null,      // la carrière qui vient de finir
      code: null,          // son code de défi
      cmp: null,           // la comparaison avec le défi relevé
      jourFin: null,       // le résultat du livre du jour, si c'était lui
      saisieOuverte: false, saisieValeur: "", saisieMessage: "",
      accueil: null, haut: null, pied: null, feuille: null,
      indexFins: null, finsParId: null, demarrage: false, jourLance: null, jour: null
    };
    var db = { lance: false, fini: false, ns: null, uid: null, pret: false, panne: false, refuse: false, docs: [], abonneLe: "", off: null, dernier: "", ecrit: "", file: null, attente: null };

    // ── petits outils ──────────────────────────────────────────────────────
    function $(id) { return document.getElementById(id); }
    function el(tag, cls, txt) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (txt != null) e.textContent = txt;
      return e;
    }
    function vider(n) { while (n && n.firstChild) n.removeChild(n.firstChild); }
    function p2(n) { return (n < 10 ? "0" : "") + n; }
    function pl(n, un, plusieurs) { return n + " " + (n > 1 ? plusieurs : un); }
    function borne(v, a, b) { v = Math.round(+v); if (!(v >= a)) v = a; if (v > b) v = b; return v; }
    function maj1(s) { s = String(s || ""); return s.charAt(0).toUpperCase() + s.slice(1); }
    function lire(cle) { try { var s = localStorage.getItem(cle); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
    function ecrire(cle, v) { try { localStorage.setItem(cle, JSON.stringify(v)); return true; } catch (e) { return false; } }
    function effacer(cle) { try { localStorage.removeItem(cle); } catch (e) {} }
    function bruit(nom, e) { try { if (window.console && console.error) console.error("partage " + nom, e); } catch (x) {} }
    function sur(nom, fn) { return function () { try { return fn.apply(this, arguments); } catch (e) { bruit(nom, e); } }; }
    function fnv(s) {
      var h = 0x811c9dc5, i;
      s = String(s);
      for (i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
      }
      return h >>> 0;
    }
    function temporiser(ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); }
    function reduit() { try { return !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches); } catch (e) { return false; } }

    // ── les livres, la date, le livre du jour ───────────────────────────────
    function postulatDe(i) {
      var l = A.postulats || [], k;
      for (k = 0; k < l.length; k++) if (l[k] && l[k].index === i) return l[k];
      return null;
    }
    // ?chantier : la page montre aussi les livres en cours d'écriture (comme l'accueil de la page)
    function modeChantier() { try { return /[?&]chantier/.test(location.search); } catch (e) { return false; } }
    function livresOuverts() { return (A.postulats || []).filter(function (p) { return p && !p.chantier; }); }
    function couleurLivre(i) {
      var p = postulatDe(i), h = p && A.histoires && A.histoires[p.id];
      return (h && h.c) || "#F6E9CF";
    }
    function aujourdhui() {
      var d = new Date();
      return d.getFullYear() + "-" + p2(d.getMonth() + 1) + "-" + p2(d.getDate());
    }
    function dateCourte(date) {
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date || "");
      if (!m) return "";
      var d = new Date(+m[1], +m[2] - 1, +m[3]);
      return JOURS_COURTS[d.getDay()] + " " + (+m[3]) + " " + MOIS_COURTS[+m[2] - 1];
    }
    function numeroDeJour(date) {
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date || "");
      return m ? Math.floor(Date.UTC(+m[1], +m[2] - 1, +m[3]) / 864e5) : 0;
    }
    // un tirage congruentiel : sans Math.imul (1664525 × 2³² tient dans les 53 bits d'un nombre)
    function lcg(graine) {
      var h = graine >>> 0;
      return function () { h = (h * 1664525 + 1013904223) % 4294967296; return h / 4294967296; };
    }
    function permutation(n, graine) {
      var a = [], r = lcg(graine), i, j, t;
      for (i = 0; i < n; i++) a.push(i);
      for (i = n - 1; i > 0; i--) { j = Math.floor(r() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    }
    // Le livre du jour : les livres ouverts passent chacun leur tour, dans un ordre tiré à
    // chaque cycle (jamais deux jours de suite le même) ; la graine est le hachage de la date.
    function livreDuJour(date) {
      var liste = livresOuverts(), n = liste.length;
      if (!n || !/^\d{4}-\d{2}-\d{2}$/.test(date || "")) return null;
      var jour = numeroDeJour(date), cycle = Math.floor(jour / n), pos = jour - cycle * n;
      var ordre = permutation(n, fnv("sac|" + cycle)), t;
      if (pos === 0 && n > 2) {
        var prec = permutation(n, fnv("sac|" + (cycle - 1)));
        if (ordre[0] === prec[n - 1]) { t = ordre[0]; ordre[0] = ordre[1]; ordre[1] = t; }
      }
      var p = liste[ordre[pos]];
      return { date: date, postulat: p.index, id: p.id, titre: p.title, seed: (fnv("graine|" + date) & 0x7fffffff) || 1 };
    }

    // ── le code de défi ─────────────────────────────────────────────────────
    // 80 bits : livre (5) · graine (32) · cartes (11) · saisons (6) · fin (16, un hachage de
    // son id : l'id d'une fin ne change pas, sa place dans une liste oui) · somme (10) ; en
    // base 32, 16 signes. Le prénom suit, accroché par un tiret, en clair et avec ses accents :
    // une décoration, que la somme ne couvre pas (un code tapé sans lui reste valable). La somme
    // couvre les 70 bits et l'id du livre (un livre déplacé rend les anciens codes invalides).
    function bitsEcrire(bits, v, n) { for (var i = n - 1; i >= 0; i--) bits.push(Math.floor(v / Math.pow(2, i)) % 2); }
    function bitsLire(bits, d, n) { var v = 0, i; for (i = 0; i < n; i++) v = v * 2 + bits[d + i]; return v; }
    // la multiplication 32 bits (Math.imul, sans lui), puis une avalanche de bits (le mélange final d'un hachage classique) : les bas bits
    // du hachage seul se mélangent mal, et la somme n'en garde que dix
    function mul32(a, b) { return (((a & 0xffff) * b) + ((((a >>> 16) * b) & 0xffff) << 16)) >>> 0; }
    function melange(h) {
      h ^= h >>> 16; h = mul32(h, 0x85ebca6b);
      h ^= h >>> 13; h = mul32(h, 0xc2b2ae35);
      h ^= h >>> 16;
      return h >>> 0;
    }
    function hashFin(id) { return melange(fnv("fin|" + id)) & 0xffff; }
    function sommeDe(livreId, charge) {
      return melange(fnv("fusible-defi|" + livreId + "|" + charge)) & 1023;
    }
    // le prénom tel qu'il voyage : majuscules accentuées, tirets, 14 signes au plus
    function nettoyerNom(s) {
      var out = "", i, c;
      s = String(s == null ? "" : s).toUpperCase();
      for (i = 0; i < s.length; i++) {
        c = s.charAt(i);
        if (LETTRES_RE.test(c)) out += c;
        else if (c === "-" || c === " ") out += "-";
      }
      out = out.replace(/-+/g, "-").replace(/^-|-$/g, "");
      if (out.length > 14) {
        // trop long : on coupe à la frontière d'un tiret (Marie-Hélène-Joséphine → Marie-Hélène)
        var cut = out.slice(0, 14), h = out.charAt(14) === "-" ? -1 : cut.lastIndexOf("-");
        out = (h >= 3 ? cut.slice(0, h) : cut).replace(/-$/, "");
      }
      return out;
    }
    function joliNom(s) {
      return String(s || "").toLowerCase().replace(/(^|-)([a-zàâäçéèêëîïôöùûüœæÿ])/g, function (m, a, b) { return a + b.toUpperCase(); });
    }
    // les fins du contenu, par hachage et par id (refait si le contenu a changé : un autre amorçage)
    function indexFins() {
      var liste = A.contenu && A.contenu.endings;
      if (etat.indexFins && etat.finsSrc === liste) return etat.indexFins;
      var ix = {}, par = {};
      var arr = Array.isArray(liste) ? liste : Object.keys(liste || {}).map(function (k) { return liste[k]; });
      arr.forEach(function (e) {
        if (!e || !e.id) return;
        var h = hashFin(e.id);
        (ix[h] = ix[h] || []).push(e.id);
        par[e.id] = e;
      });
      etat.indexFins = ix; etat.finsParId = par; etat.finsSrc = liste;
      return ix;
    }
    function finDeHash(h) { var l = indexFins()[h]; return l && l.length === 1 ? l[0] : ""; }
    function titreFin(id) { indexFins(); var e = etat.finsParId[id]; return e && e.title ? String(e.title) : ""; }
    // « Titre » avec des espaces insécables : le guillemet fermant ne reste jamais seul sur sa ligne
    function libelleFin(id) { var t = titreFin(id); return t ? "«" + NBSP + t + NBSP + "»" : "une autre fin"; }
    function estGav(id) { return /garde_a_vue|^grand_deballage$|^en_coupable$|^jp_panama$/.test(String(id || "")); }
    // « 43 % ont fini ___ » : « en garde à vue » pour les gardes à vue, sinon le titre de la fin
    function finEnPhrase(id) { return estGav(id) ? "en garde à vue" : libelleFin(id); }

    // d : { livre, graine, cartes, saisons, fin, nom } → le code, ou null si la graine ne tient pas
    function coder(d) {
      if (!d) return null;
      var p = postulatDe(d.livre), graine = +d.graine;
      if (!p || !(d.livre >= 0 && d.livre <= 31) || !(graine >= 0 && graine <= 4294967295) || Math.floor(graine) !== graine) return null;
      var cartes = borne(d.cartes, 0, 2047), saisons = borne(d.saisons, 0, 63), bits = [], i, noyau = "";
      bitsEcrire(bits, d.livre, 5); bitsEcrire(bits, graine, 32); bitsEcrire(bits, cartes, 11);
      bitsEcrire(bits, saisons, 6); bitsEcrire(bits, hashFin(String(d.fin || "")), 16);
      var nom = nettoyerNom(d.nom);
      bitsEcrire(bits, sommeDe(p.id, bits.join("")), 10);
      for (i = 0; i < 80; i += 5) noyau += B32.charAt(bitsLire(bits, i, 5));
      return habiller(noyau, nom, { livre: d.livre, graine: graine, cartes: cartes, saisons: saisons, fin: String(d.fin || "") });
    }
    function habiller(noyau, nom, champs) {
      champs.noyau = noyau; champs.nom = nom;
      champs.brut = noyau + (nom ? "-" + nom : "");
      champs.groupe = noyau.replace(/(.{4})(?=.)/g, "$1-") + (nom ? "-" + nom : "");
      return champs;
    }
    function valeurSigne(c) {
      if (c === "O") c = "0"; else if (c === "I" || c === "L") c = "1";
      return c.length === 1 ? B32.indexOf(c) : -1;
    }
    function verifier(signes, nom) {
      var bits = [], k, d = 0;
      for (k = 0; k < 16; k++) bitsEcrire(bits, signes[k], 5);
      var livre = bitsLire(bits, d, 5); d += 5;
      var graine = bitsLire(bits, d, 32); d += 32;
      var cartes = bitsLire(bits, d, 11); d += 11;
      var saisons = bitsLire(bits, d, 6); d += 6;
      var fin = bitsLire(bits, d, 16); d += 16;
      var somme = bitsLire(bits, d, 10);
      var p = postulatDe(livre);
      if (!p) return { ok: false, raison: "invalide" };
      if (sommeDe(p.id, bits.slice(0, 70).join("")) !== somme) return { ok: false, raison: "invalide" };
      if (p.chantier && !modeChantier()) return { ok: false, raison: "livre" };
      var noyau = "";
      for (k = 0; k < 80; k += 5) noyau += B32.charAt(bitsLire(bits, k, 5));
      return { ok: true, defi: habiller(noyau, nom, { livre: livre, graine: graine, cartes: cartes, saisons: saisons, fin: finDeHash(fin) }) };
    }
    // un code lu à partir de la position i0 de `up` (en majuscules) : 16 signes, séparateurs tolérés,
    // puis un prénom collé au code (essayé, puis écarté si la somme ne passe pas)
    function tenter(up, i0) {
      var signes = [], i = i0, sep = 0, c, v;
      while (i < up.length && signes.length < 16) {
        c = up.charAt(i); v = valeurSigne(c);
        if (v >= 0) { signes.push(v); sep = 0; i++; }
        else if (signes.length && sep < 3 && /[\s\-_.·]/.test(c)) { sep++; i++; }
        else break;
      }
      if (signes.length < 16) return null;
      // Le prénom, s'il y en a un, est accroché au code par un tiret (« …-3K1J-LÉA ») : c'est une
      // décoration, la somme ne le couvre pas. Un mot qui suit le code après une espace n'en est pas un.
      var m = /^[-_.]([A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŒÆŸ][A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŒÆŸ-]{0,13})/.exec(up.slice(i));
      return verifier(signes, m ? nettoyerNom(m[1]) : "");
    }
    // un code nu, un lien, un message entier : on cherche d'abord defi=…, puis le texte tel quel
    function lireCode(texte) {
      // une colle ou un lien démesuré (4 000 signes au plus) ne doit pas figer la page : un message de partage en compte ~300
      var t = String(texte == null ? "" : texte).slice(0, 4000), cand = [], m, i, up, r, raison = "", re = /defi=([^&#\s)"'<>]+)/gi;
      if (!t.replace(/\s+/g, "")) return { ok: false, raison: "vide" };
      while ((m = re.exec(t))) { try { cand.push(decodeURIComponent(m[1])); } catch (e) { cand.push(m[1]); } }
      cand.push(t);
      for (var k = 0; k < cand.length; k++) {
        up = cand[k].toUpperCase();
        for (i = 0; i < up.length; i++) {
          if (valeurSigne(up.charAt(i)) < 0) continue;
          r = tenter(up, i);
          if (r && r.ok) return r;
          if (r && !raison) raison = r.raison;
        }
      }
      return { ok: false, raison: raison || "invalide" };
    }
    function messageCode(raison) {
      if (raison === "vide") return "Colle d'abord un code.";
      if (raison === "livre") return "Ce défi vise un livre qui n'est pas encore ouvert dans cette version.";
      return "Ce code n'est pas valide. Vérifie-le signe par signe, ou demande un nouveau défi.";
    }
    // le code dans l'adresse de la page : ?defi=, #defi= (explicites : un code illisible y mérite
    // un mot poli), ou #CODE nu (un fragment quelconque : s'il n'est pas un code, on l'ignore)
    function codeDansUrl() {
      var brut = "", explicite = false, m;
      try {
        m = /[?&]defi=([^&#]*)/.exec(String(location.search || ""));
        if (m) { explicite = true; brut = m[1]; }
        if (!brut) { m = /(?:^#|[#&?])defi=([^&]*)/.exec(String(location.hash || "")); if (m) { explicite = true; brut = m[1]; } }
        if (!brut && !explicite) { m = /^#([0-9A-Za-z\-_.%]{16,60})$/.exec(String(location.hash || "")); if (m) brut = m[1]; }
        if (brut) { try { brut = decodeURIComponent(brut.replace(/\+/g, " ")); } catch (e) {} }
      } catch (e) {}
      return { brut: brut, explicite: explicite };
    }
    function nettoyerUrl() {
      try {
        if (!/^https?:$/.test(location.protocol) || !window.history || !history.replaceState) return;
        var u = new URL(location.href);
        u.searchParams.delete("defi");
        if (/defi=|^#[0-9A-Za-z\-_.%]{16,60}$/.test(u.hash)) u.hash = "";
        history.replaceState(history.state, "", u.pathname + u.search + u.hash);
      } catch (e) {}
    }
    // L'adresse qui sert de base aux liens de défi : celle que l'éditeur de la page a déclarée
    // (`window.FUSIBLE_LIEN`, ou <meta name="fusible-lien" content="https://…">), sinon la page elle-même.
    // Dans un visualiseur qui sert la page dans un cadre, l'adresse du cadre n'est pas toujours celle qu'on partage.
    function baseLien() {
      try {
        var m = document.querySelector('meta[name="fusible-lien"]'), u = window.FUSIBLE_LIEN || (m && m.getAttribute("content")) || "";
        if (/^https:\/\/[^\s]+$/.test(String(u))) return String(u);
      } catch (e) {}
      return "";
    }
    // le lien d'un défi : l'adresse de la page, sans requête ni fragment, plus ?defi=<code>
    function lienDefi(code) {
      try {
        if (!code) return "";
        var base = baseLien(), u;
        if (base) u = new URL(base);
        else if (/^https?:$/.test(location.protocol)) u = new URL(location.href);
        else return "";
        u.hash = ""; u.search = "";
        return u.href + "?defi=" + encodeURIComponent(code.brut);
      } catch (e) { return ""; }
    }

    // ── le défi reçu ────────────────────────────────────────────────────────
    // rend vrai si le défi est resté en mémoire de l'appareil (sans stockage, un rechargement l'oublie)
    function adopterDefi(defi) {
      etat.defi = defi;
      return ecrire(CLE_DEFI, { code: defi.brut, vu: Date.now() });
    }
    function oublierDefi() { etat.defi = null; effacer(CLE_DEFI); }
    function chargerDefiGarde() {
      var s = lire(CLE_DEFI);
      if (!s || typeof s.code !== "string") return;
      var r = lireCode(s.code);
      if (r.ok) etat.defi = r.defi; else effacer(CLE_DEFI);
    }
    function relever() {
      var d = etat.defi;
      if (!d || etat.demarrage) return;
      etat.demarrage = true;
      setTimeout(function () { etat.demarrage = false; }, 900);
      jingle();
      try { A.demarrer(d.livre, d.graine); } catch (e) { bruit("relever", e); }
    }
    function jingle() { try { if (window.FusibleAudio && window.FusibleAudio.jingle) window.FusibleAudio.jingle("depart"); } catch (e) {} }
    function nomDeDefi(d) { return d && d.nom ? joliNom(d.nom) : ""; }

    // ── la base partagée (capacités db et user) ─────────────────────────────
    function capacite(nom) {
      var c = window.claude;
      if (!c || typeof c.use !== "function") return Promise.resolve(null);
      try { return Promise.resolve(c.use(nom)).then(function (ns) { return ns || null; }, function () { return null; }); }
      catch (e) { return Promise.resolve(null); }
    }
    function lancerBase() {
      if (db.lance) return;
      db.lance = true;
      Promise.all([capacite("db"), capacite("user")]).then(function (r) {
        db.ns = r[0]; db.fini = true;
        var user = r[1];
        if (!db.ns) { rafraichirStats(); return null; }
        abonner();                       // la lecture n'attend pas l'identité
        var idP = Promise.resolve(null);
        try { if (user && typeof user.id === "function") idP = Promise.resolve(user.id()).then(function (x) { return x || null; }, function () { return null; }); } catch (e) {}
        return idP.then(function (id) {
          db.uid = id;                   // l'écriture, elle, a besoin de l'id : un résultat en attente part maintenant
          if (db.attente) publier(db.attente);
        });
      }).then(null, function (e) { db.fini = true; bruit("base", e); rafraichirStats(); });
    }
    // une seule écoute, refaite seulement quand la date change
    function abonner() {
      var date = aujourdhui();
      if (!db.ns || db.abonneLe === date) return;
      if (db.off) { try { db.off(); } catch (e) {} db.off = null; }
      db.abonneLe = date; db.pret = false; db.panne = false; db.docs = [];
      try {
        // au plus mille documents par cliché (le plafond de la base) : au-delà, le décompte est un échantillon
        var requete = db.ns.collection("jour").where("date", "==", date);
        if (requete && typeof requete.limit === "function") requete = requete.limit(1000);
        db.off = requete.onSnapshot(function (snap) {
          var l = [];
          try {
            snap.docs.forEach(function (d) {
              try { var x = d.data(); if (x && typeof x === "object") l.push({ id: d.id, data: x }); } catch (e) {}   // un document illisible n'arrête pas les autres
            });
          } catch (e) {}
          var cache = false;
          try { cache = !!(snap.metadata && snap.metadata.fromCache); } catch (e) {}
          // un premier cliché vide venu du cache n'est pas encore un « personne n'a fini » : on attend le vrai
          db.docs = l; db.pret = !(cache && !l.length); db.panne = false;
          rafraichirStats();
        }, function () { db.pret = false; db.panne = true; rafraichirStats(); });
      } catch (e) { db.panne = true; bruit("abonner", e); }
    }
    // « absente » : pas de base ; « attente » : pas encore de réponse ; « prete » : on compte
    function etatBase() {
      if (!db.fini) return "attente";
      if (!db.ns || db.panne) return "absente";
      return db.pret ? "prete" : "attente";
    }
    // Le décompte du jour. `mien` : le résultat du joueur quand il est (ou va être) dans la base ; il
    // remplace son document dans le décompte, que la base l'ait déjà rendu ou pas.
    function statsPour(jour, mien) {
      if (etatBase() !== "prete" || !jour) return null;
      var n = 0, par = Object.create(null);          // les clés viennent de la base : pas de prototype
      function compter(d) {
        if (d && d.date === jour.date && d.postulat === jour.postulat && d.seed === jour.seed && typeof d.fin === "string") {
          n++; par[d.fin] = (par[d.fin] || 0) + 1;
        }
      }
      db.docs.forEach(function (e) { if (!(mien && db.uid && e.id === db.uid)) compter(e.data); });
      if (mien) compter(mien);
      return { n: n, par: par };
    }
    function enTete(s) {
      var id = "", c = 0;
      Object.keys(s.par).sort().forEach(function (k) { if (s.par[k] > c) { c = s.par[k]; id = k; } });
      return { id: id, c: c };
    }
    // jamais au chargement : seulement quand la carrière du livre du jour s'achève
    function publier(res) {
      db.attente = res;
      if (!db.ns || !db.uid || db.refuse) return;
      var cle = [res.date, res.postulat, res.seed, res.fin, res.cartes].join("|");
      if (db.dernier === cle) return;
      db.dernier = cle;
      var corps = { date: res.date, postulat: res.postulat, seed: res.seed, fin: res.fin, cartes: res.cartes };
      db.file = (db.file || Promise.resolve()).then(function () {
        return db.ns.doc("jour/" + db.uid).set(corps);
      }).then(function () {
        if (db.attente === res) db.attente = null;
        db.ecrit = cle;                 // ce résultat est dans la base : le joueur compte parmi les finalistes
        marquerPublie(res);
        rafraichirStats();
      }, function (err) {
        var code = err && err.code;
        if (code === "unavailable" && !res.reessai) {
          res.reessai = true; db.dernier = "";
          setTimeout(function () { publier(res); }, 2500 + Math.floor(Math.random() * 1500));
        } else if (code !== "unavailable") {
          db.refuse = true;          // lecture seule, ou refus : on garde le local, sans erreur à l'écran
        }
        rafraichirStats();
      });
    }
    // Un résultat du jour dans l'historique local (le dernier de la date, trente jours au plus).
    // `pub` : il est déjà dans la base partagée ; rend vrai quand le même résultat y est déjà
    // (un écran de fin redessiné, une carrière rejouée à l'identique) : pas besoin de le réécrire.
    function noterJour(res) {
      var l = lire(CLE_JOURS), deja = false;
      if (!Array.isArray(l)) l = [];
      l = l.filter(function (x) {
        if (x && x.date === res.date && x.postulat === res.postulat && x.seed === res.seed && x.fin === res.fin && x.cartes === res.cartes && x.pub) deja = true;
        return x && x.date !== res.date;
      });
      var e = { date: res.date, postulat: res.postulat, seed: res.seed, fin: res.fin, cartes: res.cartes };
      if (deja) e.pub = 1;
      l.push(e);
      if (l.length > 30) l = l.slice(l.length - 30);
      ecrire(CLE_JOURS, l);
      return deja;
    }
    function marquerPublie(res) {
      var l = lire(CLE_JOURS), k;
      if (!Array.isArray(l)) return;
      for (k = l.length - 1; k >= 0; k--) {
        if (l[k] && l[k].date === res.date && l[k].postulat === res.postulat && l[k].seed === res.seed && l[k].fin === res.fin && l[k].cartes === res.cartes) { l[k].pub = 1; break; }
      }
      ecrire(CLE_JOURS, l);
    }
    function jourLocal(jour) {
      var l = lire(CLE_JOURS), k;
      if (!Array.isArray(l) || !jour) return null;
      for (k = l.length - 1; k >= 0; k--) {
        if (l[k] && l[k].date === jour.date && l[k].postulat === jour.postulat && l[k].seed === jour.seed) return l[k];
      }
      return null;
    }
    function rafraichirStats() {
      sur("stats accueil", majStatsAccueil)();
      sur("stats fin", majHaut)();
    }

    // ── les phrases du livre du jour ────────────────────────────────────────
    function lignesAccueil(jour) {
      var e = etatBase();
      if (e === "attente") return [];
      if (e === "absente") return ["Partage le lien pour comparer."];
      var s = statsPour(jour);
      if (!s || !s.n) return ["Personne n'a encore fini ce livre aujourd'hui."];
      var l = [s.n + (s.n > 1 ? " joueurs ont fini" : " joueur a fini") + " le livre du jour."];
      if (s.n >= 3) { var t = enTete(s); l.push(Math.round(100 * t.c / s.n) + " % ont fini " + finEnPhrase(t.id) + "."); }
      return l;
    }
    // Le résultat du joueur d'abord (toujours connu, en local), puis ce que la base en dit. Si son
    // écriture a été refusée (lecture seule), il n'est pas compté : on montre les autres, sans « toi ».
    function lignesFin(res) {
      var e = etatBase(), jour = { date: res.date, postulat: res.postulat, seed: res.seed };
      var perso = "Ta fin : " + libelleFin(res.fin) + ", " + pl(res.cartes, "carte", "cartes") + ".";
      if (e === "attente") return [perso];
      if (e === "absente") return [perso, "Partage le lien pour comparer."];
      if (res.date !== db.abonneLe) return [perso];        // minuit est passé : le décompte en cours n'est plus celui de ce livre
      var compte = db.ecrit === [res.date, res.postulat, res.seed, res.fin, res.cartes].join("|");
      var s = statsPour(jour, compte ? { date: res.date, postulat: res.postulat, seed: res.seed, fin: res.fin } : null);
      if (!s || !s.n) return [perso, compte ? "Tu es le premier à finir le livre du jour." : "Personne d'autre n'a encore fini ce livre aujourd'hui."];
      var l = [perso, s.n + (s.n > 1 ? " joueurs ont fini" : " joueur a fini") + " le livre du jour."];
      var mien = s.par[res.fin] || 0, t = enTete(s);
      if (compte && s.n === 1 && mien === 1) return [perso, "Tu es le premier à finir le livre du jour."];
      if (s.n >= 3) {
        if (compte && t.id === res.fin) l.push(Math.round(100 * mien / s.n) + " % ont fini " + finEnPhrase(res.fin) + " : comme toi.");
        else {
          if (compte) l.push("Toi : " + libelleFin(res.fin) + ", " + Math.round(100 * mien / s.n) + " % des joueurs.");
          l.push("Le plus fréquent : " + libelleFin(t.id) + ", " + Math.round(100 * t.c / s.n) + " %.");
        }
      }
      if (db.refuse) l.push("Partage le lien pour comparer.");     // lecture seule : le résultat reste chez soi
      return l;
    }

    // ── la comparaison avec le défi ─────────────────────────────────────────
    function verdict(def, moi, cle) {
      var qui = nomDeDefi(def) || "ton ami", Qui = maj1(qui), d = moi.cartes - def.cartes, ecart = Math.abs(d);
      var c = pl(ecart, "carte", "cartes");
      function pick(l) { return l[(cle >>> 0) % l.length]; }
      if (def.fin && def.fin === moi.fin) {
        if (!d) return pick(["Même fin que " + qui + ", à la carte près.", "Même fin, même nombre de cartes : vous avez joué la même partie."]);
        if (d > 0) return pick(["Même fin que " + qui + ", mais " + c + " plus tard.", c + " de plus que " + qui + " pour finir au même endroit."]);
        return pick(["Même fin que " + qui + ", mais " + c + " plus tôt.", "Tu arrives au même endroit que " + qui + ", " + c + " plus vite."]);
      }
      var gavLui = estGav(def.fin), gavMoi = estGav(moi.fin);
      if (gavLui && !gavMoi) return pick([Qui + " a fini en garde à vue. Toi, non.", "Garde à vue pour " + qui + ". Pas pour toi."]);
      if (!gavLui && gavMoi) return pick(["Toi, en garde à vue. " + Qui + ", non.", "Garde à vue pour toi. Pas pour " + qui + "."]);
      if (d > 0) return pick([c + " de plus que " + qui + ". Tu as tenu plus longtemps.", "Tu tiens " + c + " de plus que " + qui + ". Tu as fait mieux."]);
      if (d < 0) return pick([c + " de moins que " + qui + ". " + Qui + " a tenu plus longtemps.", "Il te manque " + c + " pour égaler " + qui + "."]);
      return pick(["Même nombre de cartes que " + qui + ", deux fins différentes.", "À égalité de cartes avec " + qui + " : seule la fin diffère."]);
    }

    // ═══ L'ACCUEIL ═══════════════════════════════════════════════════════════
    // Où le bloc s'installe : sur un repère `<div id="partageAccueil">` si la page en pose un (l'intégrateur
    // le place où il veut), sinon juste après le formulaire du prénom, sinon avant la liste des livres.
    function assurerAccueil() {
      var c = etat.accueil;
      if (c && c.parentNode) return c;
      var repere = $("partageAccueil");
      if (repere && repere.parentNode) { repere.classList.add("pt-accueil"); return (etat.accueil = repere); }
      c = etat.accueil = el("div", "pt-accueil");
      c.id = "partageAccueil";
      var ecran = $("titleScreen"), form = $("nameForm"), liste = $("postulats");
      if (form && form.parentNode) form.parentNode.insertBefore(c, form.nextSibling);
      else if (liste) {
        var n = liste;
        while (n.parentNode && n.parentNode !== ecran) n = n.parentNode;
        if (n.parentNode) n.parentNode.insertBefore(c, n); else (ecran || document.body).appendChild(c);
      } else (ecran || document.body).appendChild(c);
      return c;
    }
    function banniereDefi(d) {
      var b = el("section", "pt-defi");
      b.setAttribute("aria-label", "Un défi t'attend");
      b.appendChild(el("p", "pt-defi-tag", "Défi"));
      var p = el("p", "pt-defi-txt"), nom = nomDeDefi(d), livre = postulatDe(d.livre);
      var bq = el("b", "", nom || "Un ami");
      p.appendChild(bq);
      p.appendChild(document.createTextNode(" te défie sur "));
      p.appendChild(el("b", "", livre ? livre.title : "ce livre"));
      p.appendChild(document.createTextNode(" : "));
      p.appendChild(el("b", "", pl(d.cartes, "carte", "cartes")));
      p.appendChild(document.createTextNode(". Fais mieux."));
      b.appendChild(p);
      var act = el("div", "pt-defi-actions");
      var go = el("button", "pt-defi-go", "Relever le défi");
      go.type = "button";
      go.addEventListener("click", sur("relever", relever));
      var x = el("button", "pt-defi-x", "×");
      x.type = "button";
      x.setAttribute("aria-label", "Ignorer ce défi");
      x.addEventListener("click", sur("ignorer", function () { oublierDefi(); majAccueil(); }));
      act.appendChild(go); act.appendChild(x);
      b.appendChild(act);
      return b;
    }
    function carteDuJour(jour) {
      var p = postulatDe(jour.postulat), h = (A.histoires && A.histoires[p.id]) || {};
      var b = el("button", "pt-jour");
      b.type = "button";
      b.style.setProperty("--acc", h.c || "#F6E9CF");
      var couv = window.FUSIBLE_ACCUEIL && window.FUSIBLE_ACCUEIL.couv && (window.FUSIBLE_ACCUEIL.couv[p.id] || window.FUSIBLE_ACCUEIL.couv.promu);
      var img = el("span", "pt-jour-img");
      if (couv) { var im = document.createElement("img"); im.alt = ""; im.decoding = "async"; im.src = couv; img.appendChild(im); }
      b.appendChild(img);
      var corps = el("span", "pt-jour-corps");
      corps.appendChild(el("span", "pt-jour-tag", "Livre du jour · " + dateCourte(jour.date)));
      corps.appendChild(el("span", "pt-jour-titre", p.title));
      var puces = el("span", "pt-jour-puces");
      puces.appendChild(el("span", "pt-puce", p.roleName || p.role));
      if (p.role !== "selectionneur" && p.division) puces.appendChild(el("span", "pt-puce", "D" + p.division));
      if (p.year) puces.appendChild(el("span", "pt-puce", String(p.year)));
      corps.appendChild(puces);
      var loc = jourLocal(jour);
      corps.appendChild(el("span", "pt-jour-ligne", loc
        ? "Fini : " + libelleFin(loc.fin) + " · " + pl(loc.cartes, "carte", "cartes") + "."
        : "Même livre et même graine pour tous, aujourd'hui."));
      var st = el("span", "pt-jour-stats");
      st.id = "ptJourStats";
      corps.appendChild(st);
      b.appendChild(corps);
      b.setAttribute("aria-label", "Livre du jour : " + p.title + ", " + (p.roleName || p.role) + (p.year ? ", " + p.year : "") + (loc ? ". Déjà fini : rejouer." : ". Même graine pour tous."));
      b.addEventListener("click", sur("livre du jour", function () { lancerJour(jour); }));
      return b;
    }
    function lancerJour(jour) {
      if (etat.demarrage) return;
      etat.demarrage = true;
      setTimeout(function () { etat.demarrage = false; }, 900);
      etat.jourLance = { date: jour.date, postulat: jour.postulat, seed: jour.seed };     // en mémoire aussi : sans stockage
      ecrire(CLE_JOUR, etat.jourLance);
      jingle();
      try { A.demarrer(jour.postulat, jour.seed); } catch (e) { bruit("lancer le livre du jour", e); }
    }
    function saisieCode() {
      var w = el("div", "pt-code");
      var bouton = el("button", "pt-code-ouvre", "J'ai un code de défi");
      bouton.type = "button";
      bouton.setAttribute("aria-expanded", etat.saisieOuverte ? "true" : "false");
      var form = el("form", "pt-code-form");
      form.hidden = !etat.saisieOuverte;
      form.setAttribute("aria-label", "Saisir un code de défi");
      var champ = document.createElement("input");
      champ.type = "text"; champ.className = "pt-code-champ"; champ.id = "ptCodeChamp";
      champ.placeholder = "Colle le code ici"; champ.autocomplete = "off"; champ.spellcheck = false;
      champ.setAttribute("autocapitalize", "characters"); champ.setAttribute("aria-label", "Code de défi");
      champ.value = etat.saisieValeur;
      var ok = el("button", "pt-code-ok", "Voir le défi");
      ok.type = "submit";
      var msg = el("p", "pt-code-msg", etat.saisieMessage);
      msg.id = "ptCodeMsg"; msg.setAttribute("role", "status"); msg.setAttribute("aria-live", "polite");
      form.appendChild(champ); form.appendChild(ok); form.appendChild(msg);
      bouton.addEventListener("click", sur("saisie", function () {
        etat.saisieOuverte = !etat.saisieOuverte;
        form.hidden = !etat.saisieOuverte;
        bouton.setAttribute("aria-expanded", etat.saisieOuverte ? "true" : "false");
        if (etat.saisieOuverte) { try { champ.focus(); } catch (e) {} }
      }));
      champ.addEventListener("input", function () { etat.saisieValeur = champ.value; });
      form.addEventListener("keydown", function (e) { e.stopPropagation(); });
      form.addEventListener("submit", sur("code", function (e) {
        e.preventDefault();
        var r = lireCode(champ.value);
        if (!r.ok) { etat.saisieMessage = messageCode(r.raison); msg.textContent = etat.saisieMessage; return; }
        etat.saisieOuverte = false; etat.saisieValeur = ""; etat.saisieMessage = "";
        adopterDefi(r.defi);
        majAccueil();
      }));
      w.appendChild(bouton); w.appendChild(form);
      return w;
    }
    function majAccueil() {
      var c = assurerAccueil();
      vider(c);
      if (etat.avis) {
        var av = el("p", "pt-avis", etat.avis);
        av.setAttribute("role", "status");
        c.appendChild(av);
        etat.avis = "";
      }
      if (etat.defi) c.appendChild(banniereDefi(etat.defi));
      var jour = livreDuJour(aujourdhui());
      if (jour) { c.appendChild(carteDuJour(jour)); etat.jour = jour; }
      c.appendChild(saisieCode());
      majStatsAccueil();
    }
    function majStatsAccueil() {
      var st = $("ptJourStats"), jour = etat.jour;
      if (!st || !jour) return;
      var l = lignesAccueil(jour);
      st.textContent = l.join(" ");
      st.hidden = !l.length;
    }

    // ═══ L'ÉCRAN DE FIN ══════════════════════════════════════════════════════
    function capturerCarriere(v) {
      v = v || A.vue() || {};
      var g = A.graine() || {}, st = v.stats || {}, ent = v.entities || {};
      return {
        livre: g.postulat, graine: g.seed,
        fin: (v.ending && v.ending.id) || "",
        cartes: v.cardNumber || v.turn || 0,
        saisons: Math.max(st.saisons || 0, v.season || 1),
        prenom: ent.prenom || ""
      };
    }
    function codeDe(c) {
      if (!c) return null;
      return coder({ livre: c.livre, graine: c.graine, cartes: c.cartes, saisons: c.saisons, fin: c.fin, nom: c.prenom });
    }
    function assurerFin() {
      var ecran = $("endingScreen");
      if (!ecran) return false;
      // le haut : juste après le verdict (le tampon) ; le pied : juste avant les actions (Successeur…).
      // Si l'écran change de structure, on se repère sur le tampon et sur le bouton Successeur eux-mêmes.
      // (un repère `<div id="partageHaut">` ou `<div id="partagePied">` posé par la page prime sur ces recherches)
      if (!etat.haut || !etat.haut.parentNode) {
        var reperH = $("partageHaut");
        if (reperH && reperH.parentNode) { reperH.classList.add("pt-haut"); etat.haut = reperH; }
        else {
          etat.haut = el("div", "pt-haut");
          etat.haut.id = "partageHaut";
          var stamp = $("banner"), bloc = stamp ? stamp.parentNode : null;
          if (bloc && bloc !== ecran && ecran.contains(bloc)) bloc.parentNode.insertBefore(etat.haut, bloc.nextSibling);
          else if (stamp && stamp.parentNode) stamp.parentNode.insertBefore(etat.haut, stamp.nextSibling);
          else ecran.insertBefore(etat.haut, ecran.firstChild ? ecran.firstChild.nextSibling : null);
        }
      }
      if (!etat.pied || !etat.pied.parentNode) {
        var reperP = $("partagePied");
        if (reperP && reperP.parentNode) { reperP.classList.add("pt-pied"); etat.pied = reperP; }
        else {
          etat.pied = el("div", "pt-pied");
          etat.pied.id = "partagePied";
          var suivant = $("btnNew"), actions = suivant ? suivant.parentNode : null;
          if (actions && actions !== ecran && ecran.contains(actions)) actions.parentNode.insertBefore(etat.pied, actions);
          else if (suivant && suivant.parentNode) suivant.parentNode.insertBefore(etat.pied, suivant);
          else ecran.appendChild(etat.pied);
        }
      }
      return true;
    }
    function blocComparaison(cmp) {
      var s = el("section", "pt-cmp"), def = cmp.def, moi = cmp.moi, livre = postulatDe(def.livre);
      s.setAttribute("aria-label", "Le défi comparé");
      var nom = nomDeDefi(def);
      s.appendChild(el("p", "pt-etiquette", (nom ? "Le défi de " + nom : "Le défi") + (livre ? " · " + livre.title : "")));
      var cols = el("div", "pt-cols");
      function colonne(qui, fin, cartes, saisons, mieux) {
        var c = el("div", "pt-col" + (mieux ? " mieux" : ""));
        c.appendChild(el("span", "pt-qui", qui));
        c.appendChild(el("span", "pt-col-fin", fin));
        var n = el("span", "pt-n", String(cartes));
        n.appendChild(el("small", "", " " + (cartes > 1 ? "cartes" : "carte")));
        c.appendChild(n);
        c.appendChild(el("span", "pt-s", pl(saisons, "saison", "saisons")));
        return c;
      }
      cols.appendChild(colonne(nom || "Ton ami", def.fin ? libelleFin(def.fin) : "une autre fin", def.cartes, def.saisons, def.cartes > moi.cartes));
      cols.appendChild(colonne("Toi", libelleFin(moi.fin), moi.cartes, moi.saisons, moi.cartes > def.cartes));
      s.appendChild(cols);
      s.appendChild(el("p", "pt-verdict", cmp.phrase));
      return s;
    }
    function blocJour(res) {
      var s = el("section", "pt-jourres"), p = postulatDe(res.postulat);
      s.setAttribute("aria-label", "Le livre du jour");
      s.appendChild(el("p", "pt-etiquette", "Livre du jour · " + dateCourte(res.date) + (p ? " · " + p.title : "")));
      lignesFin(res).forEach(function (t) { s.appendChild(el("p", "pt-jourres-ligne", t)); });
      return s;
    }
    function majHaut() {
      if (!etat.haut || !etat.haut.parentNode) return;
      vider(etat.haut);
      if (etat.cmp) etat.haut.appendChild(blocComparaison(etat.cmp));
      if (etat.jourFin) etat.haut.appendChild(blocJour(etat.jourFin));
    }
    function majPied() {
      var p = etat.pied, c = etat.carriere;
      if (!p) return;
      vider(p);
      if (!c) return;
      var bouton = el("button", "pt-bouton");
      bouton.type = "button";
      bouton.appendChild(document.createTextNode("Partager ma Une"));
      bouton.appendChild(el("small", "", "story · carré"));
      bouton.addEventListener("click", sur("partager", function () { ouvrirFeuille(bouton); }));
      p.appendChild(bouton);
      var code = etat.code;
      if (code) {
        var rang = el("div", "pt-coderang");
        var lab = el("label", "pt-codelab", "Défi");
        lab.setAttribute("for", "ptCodeFin");
        var champ = document.createElement("input");
        champ.type = "text"; champ.readOnly = true; champ.id = "ptCodeFin"; champ.className = "pt-codechamp";
        champ.value = code.groupe; champ.setAttribute("aria-label", "Code de défi, à copier");
        champ.addEventListener("focus", function () { try { champ.select(); } catch (e) {} });
        var copie = el("button", "pt-copie", libelleDefi());
        copie.type = "button";
        var etatCopie = el("p", "pt-copie-etat");
        etatCopie.setAttribute("role", "status"); etatCopie.setAttribute("aria-live", "polite");
        copie.addEventListener("click", sur("défi", function () {
          actionDefi(function (t) { etatCopie.textContent = t; }, champ);
        }));
        rang.appendChild(lab); rang.appendChild(champ);
        p.appendChild(rang); p.appendChild(copie); p.appendChild(etatCopie);
      }
    }
    // appelé quand la carrière s'achève (crochet 'fin'), l'écran de fin déjà dessiné
    function surFin(v) {
      var c = capturerCarriere(v);
      etat.carriere = c;
      etat.code = codeDe(c);
      etat.cmp = null; etat.jourFin = null;
      var d = etat.defi;
      // 1. le défi relevé : même livre, même graine
      if (d && c.livre === d.livre && c.graine === d.graine) {
        etat.cmp = { def: d, moi: c, phrase: verdict(d, c, fnv(d.brut + "|" + c.fin + "|" + c.cartes)) };
        oublierDefi();
      }
      // 2. le livre du jour lancé
      var j = lire(CLE_JOUR) || etat.jourLance;
      if (j && c.livre === j.postulat && c.graine === j.seed && typeof j.date === "string") {
        var res = { date: j.date, postulat: j.postulat, seed: j.seed, fin: c.fin, cartes: c.cartes };
        etat.jourFin = res;
        if (noterJour(res)) db.ecrit = [res.date, res.postulat, res.seed, res.fin, res.cartes].join("|");
        else publier(res);
        lancerBase();
        if (db.ns) abonner();
      }
      if (!assurerFin()) return;
      majHaut();
      majPied();
    }

    // ═══ LE TEXTE DU DÉFI ════════════════════════════════════════════════════
    function nomLivre(i) { var p = postulatDe(i); return p ? p.title : "FUSIBLE"; }
    // avecImage : le texte qui accompagne la Une ; sinon le défi seul
    function texteDefi(c, code, avecImage) {
      var lien = lienDefi(code), livre = nomLivre(c.livre), t;
      if (avecImage) {
        t = "FUSIBLE · " + livre + " — " + libelleFin(c.fin) + ", " + pl(c.cartes, "carte", "cartes") + ". Fais mieux que moi";
        t += lien ? " : " + lien : ".";
      } else {
        t = "Fais mieux que moi sur " + livre + " : " + pl(c.cartes, "carte", "cartes") + ".";
        if (lien) t += "\n" + lien;
      }
      if (code) t += "\nCode de défi : " + code.groupe;
      return t;
    }
    // Le défi seul, sans l'image : « Envoyer le défi » par le partage du téléphone (texte seul) ou,
    // sans lui, « Copier le défi ». `sortie(message)` dit ce qui s'est passé ; `champ`, le code à
    // copier à la main quand même la copie échoue.
    function peutEnvoyerTexte() { try { return typeof navigator.share === "function"; } catch (e) { return false; } }
    function libelleDefi() { return peutEnvoyerTexte() ? "Envoyer le défi" : "Copier le défi"; }
    function actionDefi(sortie, champ) {
      var txt = texteDefi(etat.carriere, etat.code, false);
      function copie() {
        copier(txt).then(function (ok) {
          sortie(ok ? "Défi copié : lien et code." : "Copie impossible : touche le code pour le copier à la main.");
          if (!ok && champ) { try { champ.focus(); } catch (e) {} }
        });
      }
      if (!peutEnvoyerTexte()) { copie(); return; }
      var p;
      try { p = Promise.resolve(navigator.share({ title: "Fais mieux que moi", text: txt })); } catch (e) { p = Promise.reject(e); }
      p.then(function () { sortie("Défi envoyé."); }, function (err) {
        if (err && err.name === "AbortError") return;        // l'écran de partage a été refermé : rien à dire
        copie();
      });
    }
    function copier(txt) {
      return new Promise(function (ok) {
        function repli() {
          var res = false, ancien = document.activeElement;
          try {
            var ta = document.createElement("textarea");
            ta.value = txt; ta.setAttribute("readonly", "");
            ta.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
            document.body.appendChild(ta);
            ta.select();
            try { ta.setSelectionRange(0, txt.length); } catch (e) {}
            res = !!document.execCommand("copy");
            document.body.removeChild(ta);
          } catch (e) {}
          try { if (ancien && ancien.focus) ancien.focus(); } catch (e) {}
          ok(res);
        }
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function () { ok(true); }, repli);
          else repli();
        } catch (e) { repli(); }
      });
    }

    // ═══ L'AFFICHE ═══════════════════════════════════════════════════════════
    // Ce que l'écran de fin montre, relu dans le DOM : l'affiche est la même Une, composée.
    function texteDe(id) {
      var e = $(id);
      return e ? String(e.textContent || "").replace(/\s+/g, " ").trim() : "";
    }
    function lireUne() {
      var h1 = document.querySelector("#une .masthead h1"), petit = h1 ? h1.querySelector("small") : null, titreJournal = "";
      if (h1) { var k; for (k = 0; k < h1.childNodes.length; k++) if (h1.childNodes[k].nodeType === 3) titreJournal += h1.childNodes[k].textContent; }
      var dl = $("dateline") ? $("dateline").children : [], cellules = [];
      var cs = document.querySelectorAll("#score .cell");
      for (var i = 0; i < cs.length; i++) {
        var n = cs[i].querySelector(".n"), l = cs[i].querySelector(".l");
        cellules.push({ n: n ? n.textContent.trim() : "", l: l ? l.textContent.trim() : "" });
      }
      var svg = $("unePhoto") ? $("unePhoto").querySelector("svg") : null, xml = "";
      if (svg) { try { xml = new XMLSerializer().serializeToString(svg); } catch (e) { xml = ""; } }
      var issue = dl[1] ? String(dl[1].textContent || "") : "", m = /n°\s*([\d\s]+)/i.exec(issue);
      return {
        journal: (titreJournal || "Le Quotidien du Ballon").trim(),
        devise: petit ? petit.textContent.trim() : "Le journal qui siffle avant l'arbitre",
        date: dl[0] ? dl[0].textContent.trim() : "",
        issue: m ? "N° " + m[1].replace(/\s+$/, "") : "",
        edition: dl[2] ? dl[2].textContent.trim() : "",
        kicker: texteDe("ekicker"), titre: texteDe("etitle") || "Fin de carrière",
        epitaphe: texteDe("epitaph"), epitaphe2: texteDe("epitaphPlus"),
        legende: texteDe("uneLegend"), tampon: texteDe("banner"),
        cellules: cellules, svg: xml
      };
    }
    function police(poids, px, italique) { return (italique ? "italic " : "") + poids + " " + px + "px " + POLICE; }
    function largeurTexte(g, txt, ecart) { return g.measureText(txt).width + ecart * Math.max(0, txt.length - 1); }
    function texteEspace(g, txt, x, y, ecart, align) {
      var ws = [], w = 0, i, x0;
      for (i = 0; i < txt.length; i++) { ws[i] = g.measureText(txt.charAt(i)).width; w += ws[i]; }
      w += ecart * Math.max(0, txt.length - 1);
      x0 = align === "center" ? x - w / 2 : (align === "right" ? x - w : x);
      g.textAlign = "left";
      for (i = 0; i < txt.length; i++) { g.fillText(txt.charAt(i), x0, y); x0 += ws[i] + ecart; }
    }
    function envelopper(g, txt, largeur, ecart) {
      // la ponctuation haute (; : ! ? ») ne commence pas une ligne, ni « ne la finit : espaces insécables
      var net = String(txt).replace(/[ \t\r\n]+/g, " ").trim().replace(/ ([;:!?»%])/g, NBSP + "$1").replace(/(«) /g, "$1" + NBSP);
      var mots = net.split(" "), lignes = [], cour = "", i, mot, essai, k;
      if (!mots.length || !mots[0]) return [];
      for (i = 0; i < mots.length; i++) {
        mot = mots[i];
        while (largeurTexte(g, mot, ecart) > largeur && mot.length > 1) {   // un mot plus long que la ligne : on le casse
          k = mot.length - 1;
          while (k > 1 && largeurTexte(g, mot.slice(0, k), ecart) > largeur) k--;
          if (cour) { lignes.push(cour); cour = ""; }
          lignes.push(mot.slice(0, k)); mot = mot.slice(k);
        }
        essai = cour ? cour + " " + mot : mot;
        if (cour && largeurTexte(g, essai, ecart) > largeur) { lignes.push(cour); cour = mot; } else cour = essai;
      }
      if (cour) lignes.push(cour);
      // une ligne ne commence ni ne finit par un séparateur (« · ») : il reste au bout de la précédente
      return lignes.map(function (l) { return l.replace(/^[·•]\s+/, "").replace(/\s+[·•]$/, ""); });
    }
    // un bloc de texte à la plus grande taille qui tient en `maxLignes` lignes de `largeur` ;
    // `coupe` : même au plus petit corps le texte ne tenait pas, il est coupé (…)
    function mettreEnPage(g, txt, o) {
      var px = o.max, b = null, lignes, ecart;
      for (; px >= o.min; px -= 2) {
        g.font = police(o.poids, px, o.italique);
        ecart = (o.ecart || 0) * px;
        lignes = envelopper(g, txt, o.largeur, ecart);
        if (lignes.length <= o.maxLignes) { b = { px: px, lignes: lignes, ecart: ecart, coupe: false }; break; }
      }
      if (!b) {
        px = o.min; g.font = police(o.poids, px, o.italique); ecart = (o.ecart || 0) * px;
        lignes = envelopper(g, txt, o.largeur, ecart);
        var trop = lignes.length > o.maxLignes;
        lignes = lignes.slice(0, o.maxLignes);
        if (trop && lignes.length) lignes[lignes.length - 1] = lignes[lignes.length - 1].replace(/[\s.,;:!?-]*$/, "") + "…";
        b = { px: px, lignes: lignes, ecart: ecart, coupe: trop };
      }
      b.lh = Math.round(b.px * (o.interlignage || 1.25));
      b.h = b.lignes.length * b.lh;
      b.poids = o.poids; b.italique = !!o.italique;
      return b;
    }
    function avec(o, extra) {
      var r = {}, k;
      for (k in o) if (Object.prototype.hasOwnProperty.call(o, k)) r[k] = o[k];
      for (k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) r[k] = extra[k];
      return r;
    }
    // le moins de lignes possible : pour 1, puis 2, puis 3 lignes, le plus grand corps qui tient ; on
    // s'arrête au premier nombre de lignes dont le corps reste au-dessus de son seuil (o.seuils[n-1])
    function enPage(g, txt, o) {
      var n, b = null;
      for (n = 1; n <= o.seuils.length; n++) {
        b = mettreEnPage(g, txt, avec(o, { maxLignes: n, min: o.seuils[n - 1] }));
        if (!b.coupe) return b;
      }
      return b;
    }
    function ecrireBloc(g, b, x, y, couleur, align) {
      var i, cy;
      g.fillStyle = couleur; g.textBaseline = "middle"; g.font = police(b.poids, b.px, b.italique);
      for (i = 0; i < b.lignes.length; i++) {
        cy = y + i * b.lh + b.lh / 2;
        if (b.ecart) texteEspace(g, b.lignes[i], x, cy, b.ecart, align || "left");
        else { g.textAlign = align || "left"; g.fillText(b.lignes[i], x, cy); }
      }
    }
    function rng(graine) { var h = (graine >>> 0) || 1; return function () { h = (h * 1664525 + 1013904223) % 4294967296; return h / 4294967296; }; }
    // le papier : un ton chaud, du grain, une vignette
    function papier(g, W, H, graine) {
      var r = rng(graine), i, n = Math.round(W * H / 220), gr;
      g.fillStyle = PAPIER; g.fillRect(0, 0, W, H);
      for (i = 0; i < n; i++) {
        g.fillStyle = r() < 0.5 ? "rgba(70,45,15,0.045)" : "rgba(255,250,235,0.18)";
        g.fillRect(r() * W, r() * H, 1 + r() * 2.2, 1 + r() * 2.2);
      }
      for (i = 0; i < 34; i++) {                                    // de longues fibres horizontales
        g.fillStyle = "rgba(90,60,20,0.03)";
        g.fillRect(r() * W * 0.7, r() * H, 80 + r() * 320, 1);
      }
      gr = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.32, W / 2, H / 2, Math.max(W, H) * 0.78);
      gr.addColorStop(0, "rgba(120,80,20,0)"); gr.addColorStop(1, "rgba(120,80,20,0.2)");
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
    }
    // l'en-tête du journal : filets, date, titre, devise ; rend le y suivant
    function entete(g, u, M, W, y, carre) {
      var LC = W - 2 * M, px = carre ? 20 : 24, ecart = 0.14 * px, titre, bt, gauche, droite;
      g.fillStyle = ENCRE; g.fillRect(M, y, LC, 8); y += 8 + (carre ? 12 : 16);
      g.font = police(400, px, false); g.textBaseline = "middle"; g.fillStyle = ENCRE2;
      // la date à gauche ; l'édition et le numéro à droite, si l'un et l'autre tiennent
      gauche = u.date.toUpperCase();
      droite = ((u.edition ? u.edition + " · " : "") + u.issue).toUpperCase();
      if (largeurTexte(g, gauche, ecart) + largeurTexte(g, droite, ecart) + 40 > LC) droite = u.issue.toUpperCase();
      texteEspace(g, gauche, M, y + px / 2, ecart, "left");
      texteEspace(g, droite, W - M, y + px / 2, ecart, "right");
      y += px + (carre ? 12 : 16);
      g.fillStyle = ENCRE; g.fillRect(M, y, LC, 2); y += 2 + (carre ? 10 : 20);
      titre = u.journal.toUpperCase();
      bt = mettreEnPage(g, titre, { poids: 700, max: carre ? 60 : 72, min: 30, largeur: LC, maxLignes: 1, ecart: 0.075, interlignage: 1.1 });
      ecrireBloc(g, bt, W / 2, y, ENCRE, "center"); y += bt.h + (carre ? 4 : 8);
      g.font = police(400, carre ? 22 : 28, true); g.fillStyle = ENCRE2; g.textAlign = "center"; g.textBaseline = "middle";
      g.fillText(u.devise, W / 2, y + (carre ? 14 : 18)); y += (carre ? 28 : 36) + (carre ? 8 : 14);
      g.fillStyle = ENCRE; g.fillRect(M, y, LC, 6); g.fillRect(M, y + 11, LC, 2);
      return y + 13;
    }
    // la photo : une ombre dure, un cadre d'encre ; le SVG a des coins arrondis (rayon 35 px à 1000 px) :
    // on le rogne de 14 px de chaque côté, sur un fond d'encre
    function photoCadre(g, img, x, y, s) {
      g.fillStyle = ENCRE; g.fillRect(x + 14, y + 14, s, s);
      g.fillRect(x, y, s, s);
      if (img) { try { g.drawImage(img, 14, 14, 972, 972, x, y, s, s); } catch (e) { g.fillStyle = "#3A2A18"; g.fillRect(x, y, s, s); } }
      else { g.fillStyle = "#3A2A18"; g.fillRect(x, y, s, s); }
      g.lineWidth = 6; g.strokeStyle = ENCRE; g.strokeRect(x - 3, y - 3, s + 6, s + 6);
    }
    function tampon(g, txt, cx, cy, maxL, angle) {
      txt = String(txt || "").toUpperCase();
      if (!txt) return;
      var px = 56, ecart, w, h, pad = 30;
      for (; px >= 24; px -= 2) {
        g.font = police(700, px, false); ecart = px * 0.12;
        if (largeurTexte(g, txt, ecart) + 2 * pad <= maxL) break;
      }
      w = largeurTexte(g, txt, ecart) + 2 * pad; h = px * 1.55 + 16;
      g.save();
      g.translate(cx, cy); g.rotate(angle);
      g.fillStyle = "rgba(239,229,203,0.93)"; g.fillRect(-w / 2, -h / 2, w, h);
      g.strokeStyle = FRAMBOISE; g.fillStyle = FRAMBOISE;
      g.lineWidth = 7; g.strokeRect(-w / 2, -h / 2, w, h);
      g.lineWidth = 2.5; g.strokeRect(-w / 2 + 11, -h / 2 + 11, w - 22, h - 22);
      g.textBaseline = "middle"; g.font = police(700, px, false);
      texteEspace(g, txt, 0, 3, ecart, "center");
      g.restore();
    }
    function cellulesStats(g, cells, M, y, LC, carre) {
      var n = cells.length || 1, cw = LC / n, i, hn = carre ? 46 : 58, hl = carre ? 17 : 20;
      g.fillStyle = ENCRE; g.fillRect(M, y, LC, 3);
      for (i = 0; i < cells.length; i++) {
        var cx = M + cw * i + cw / 2;
        if (i) { g.fillStyle = "rgba(27,17,9,0.35)"; g.fillRect(M + cw * i, y + 16, 2, (carre ? 70 : 92)); }
        var bn = mettreEnPage(g, cells[i].n, { poids: 700, max: hn, min: 24, largeur: cw - 18, maxLignes: 1, interlignage: 1.1 });
        ecrireBloc(g, bn, cx, y + 14, ENCRE, "center");
        var bl = mettreEnPage(g, cells[i].l.toUpperCase(), { poids: 400, max: hl, min: 12, largeur: cw - 14, maxLignes: 1, ecart: 0.12, interlignage: 1.1 });
        ecrireBloc(g, bl, cx, y + 14 + bn.h + 4, ENCRE2, "center");
      }
      return y + (carre ? 92 : 118);
    }
    function pixelsLogo(img, g, x, y, w) {
      if (!img) { g.fillStyle = CREME; g.font = police(700, Math.round(w / 6), false); g.textBaseline = "top"; g.textAlign = "left"; g.fillText("FUSIBLE", x, y); return Math.round(w / 6) * 1.2; }
      var h = Math.round(w * img.height / img.width);
      g.imageSmoothingEnabled = false;
      g.drawImage(img, x, y, w, h);
      g.imageSmoothingEnabled = true;
      return h;
    }
    // le pied : la bande d'encre, la couleur du livre, FUSIBLE, le titre du livre, la ligne de défi
    function pied(g, W, H, M, carre, c, code, logo, livre) {
      var LC = W - 2 * M, hp = carre ? 200 : 300, y0 = H - hp, couleur = couleurLivre(c.livre), p = postulatDe(c.livre), hl, bx, b1, bc;
      g.fillStyle = ENCRE; g.fillRect(0, y0, W, hp);
      g.fillStyle = couleur; g.fillRect(0, y0, W, carre ? 10 : 14);
      var puces = [];
      if (p) {
        puces.push(String(p.roleName || p.role || ""));
        if (p.role !== "selectionneur" && p.division) puces.push("D" + p.division);
        if (p.year) puces.push(String(p.year));
      }
      g.textBaseline = "middle";
      if (carre) {
        hl = pixelsLogo(logo, g, M, y0 + 34, 250);
        b1 = mettreEnPage(g, (livre || "").toUpperCase(), { poids: 700, max: 30, min: 16, largeur: 250, maxLignes: 2, ecart: 0.06, interlignage: 1.2 });
        ecrireBloc(g, b1, M, y0 + 34 + hl + 16, couleur, "left");
        g.font = police(400, 17, false); g.fillStyle = CREME2;
        texteEspace(g, puces.join(" · ").toUpperCase(), M, y0 + 34 + hl + 16 + b1.h + 14, 0.1 * 17, "left");
        bx = M + 290;
        if (code) {
          g.font = police(400, 19, false); g.fillStyle = CREME2;
          texteEspace(g, "FAIS MIEUX QUE MOI :", bx, y0 + 52, 0.18 * 19, "left");
          bc = mettreEnPage(g, code.groupe, { poids: 700, max: 34, min: 18, largeur: W - M - bx, maxLignes: 2, interlignage: 1.2 });
          ecrireBloc(g, bc, bx, y0 + 74, CREME, "left");
          g.font = police(400, 18, true); g.fillStyle = CREME2; g.textAlign = "left"; g.textBaseline = "middle";
          g.fillText("Sur l'accueil : « J'ai un code de défi »", bx, y0 + 74 + bc.h + 24);
        } else {
          g.font = police(400, 20, true); g.fillStyle = CREME2; g.textAlign = "left";
          g.fillText("Une carrière de football · Aubérive", bx, y0 + 100);
        }
        return;
      }
      hl = pixelsLogo(logo, g, M, y0 + 44, 330);
      b1 = mettreEnPage(g, (livre || "").toUpperCase(), { poids: 700, max: 44, min: 22, largeur: LC - 380, maxLignes: 2, ecart: 0.06, interlignage: 1.15 });
      ecrireBloc(g, b1, W - M, y0 + 38, couleur, "right");
      g.font = police(400, 21, false); g.fillStyle = CREME2;
      texteEspace(g, puces.join(" · ").toUpperCase(), W - M, y0 + 38 + b1.h + 20, 0.1 * 21, "right");
      if (code) {
        var by = y0 + 144, bh = 126;
        g.lineWidth = 4; g.strokeStyle = FRAMBOISE; g.strokeRect(M + 2, by, LC - 4, bh);
        g.font = police(400, 21, false); g.fillStyle = CREME2;
        texteEspace(g, "FAIS MIEUX QUE MOI :", M + 28, by + 30, 0.18 * 21, "left");
        bc = mettreEnPage(g, code.groupe, { poids: 700, max: 40, min: 20, largeur: LC - 56, maxLignes: 1, interlignage: 1.1 });
        ecrireBloc(g, bc, M + 28, by + 50, CREME, "left");
        g.font = police(400, 19, true); g.fillStyle = CREME2; g.textAlign = "left";
        g.fillText("Sur l'accueil de FUSIBLE : « J'ai un code de défi »", M + 28, by + 102);
      } else {
        g.font = police(400, 24, true); g.fillStyle = CREME2; g.textAlign = "left";
        g.fillText("Une carrière de football · Aubérive · 1990 → 2050", M, y0 + 200);
      }
    }
    // l'affiche : un papier de journal, d'en haut en bas, puis la bande d'encre du pied
    function dessiner(cv, format, u, c, code, photo, logo) {
      var F = FORMATS[format], W = F.l, H = F.h, carre = format === "carre", g, M = carre ? 52 : 64, LC = W - 2 * M;
      var livre = nomLivre(c.livre), y, hp = carre ? 200 : 300, hs = carre ? 92 : 118;
      cv.width = W; cv.height = H;
      g = cv.getContext("2d");
      papier(g, W, H, fnv((code ? code.brut : u.titre) + format));
      y = entete(g, u, M, W, M, carre) + (carre ? 20 : 30);
      var yStats = H - hp - hs - (carre ? 14 : 24), kk, tt, ee;
      if (carre) {
        // deux colonnes : la photo à gauche, le texte à droite
        var S = Math.min(520, yStats - y - 22), xt = M + S + 44, lt = W - M - xt, reste;
        kk = enPage(g, u.kicker.toUpperCase(), { poids: 700, max: 20, seuils: [16, 14, 14], largeur: lt, ecart: 0.1, interlignage: 1.35 });
        tt = enPage(g, u.titre, { poids: 700, max: 66, seuils: [60, 54, 34], largeur: lt, interlignage: 1.08 });
        reste = S - kk.h - tt.h - 40;
        ee = mettreEnPage(g, u.epitaphe, { poids: 400, italique: true, max: 27, min: 15, largeur: lt, maxLignes: 99, interlignage: 1.4 });
        while (ee.h > reste && ee.px > 15) ee = mettreEnPage(g, u.epitaphe, { poids: 400, italique: true, max: ee.px - 1, min: 15, largeur: lt, maxLignes: 99, interlignage: 1.4 });
        if (ee.h > reste) ee = mettreEnPage(g, u.epitaphe, { poids: 400, italique: true, max: 15, min: 15, largeur: lt, maxLignes: Math.max(2, Math.floor(reste / 21)), interlignage: 1.4 });
        photoCadre(g, photo, M + 4, y, S);
        ecrireBloc(g, kk, xt, y - 2, FRAMBOISE, "left");
        ecrireBloc(g, tt, xt, y + kk.h + 12, ENCRE, "left");
        ecrireBloc(g, ee, xt, y + kk.h + 12 + tt.h + 16, ENCRE2, "left");
        tampon(g, u.tampon, M + 210, y + 34, 330, -0.1);
        cellulesStats(g, u.cellules, M, yStats, LC, true);
      } else {
        // le journal, de haut en bas : le chapeau (nom, âge, club), le titre, l'épitaphe, la photo et sa légende
        kk = enPage(g, u.kicker.toUpperCase(), { poids: 700, max: 26, seuils: [18, 16], largeur: LC, ecart: 0.1, interlignage: 1.4 });
        ecrireBloc(g, kk, M, y, FRAMBOISE, "left"); y += kk.h + 14;
        tt = enPage(g, u.titre, { poids: 700, max: 124, seuils: [96, 80, 60], largeur: LC, interlignage: 1.06 });
        ecrireBloc(g, tt, M, y, ENCRE, "left"); y += tt.h + 24;
        // la photo prend ce qui reste (l'ombre, la légende et l'écart avant les chiffres en sont retirés) ;
        // si c'est peu, l'épitaphe se resserre
        var ECART = 46, OMBRE = 14, legH = u.legende ? 70 : 0, MINI = 500, yEpi = y;
        var libre = function () { return yStats - 24 - (yEpi + ee.h + ECART) - OMBRE - legH; };
        ee = mettreEnPage(g, u.epitaphe, { poids: 400, italique: true, max: 40, min: 24, largeur: LC, maxLignes: 6, interlignage: 1.36 });
        while (libre() < MINI && ee.px > 24) ee = mettreEnPage(g, u.epitaphe, { poids: 400, italique: true, max: ee.px - 2, min: 24, largeur: LC, maxLignes: 8, interlignage: 1.32 });
        ecrireBloc(g, ee, M, yEpi, ENCRE2, "left");
        var yPhoto = yEpi + ee.h + ECART, S2 = Math.max(300, Math.min(LC - OMBRE, libre()));
        var px0 = M + Math.round((LC - OMBRE - S2) / 2);
        photoCadre(g, photo, px0, yPhoto, S2);
        tampon(g, u.tampon, px0 + 230, yPhoto + 22, 420, -0.09);
        if (u.legende) {
          var lg = mettreEnPage(g, u.legende, { poids: 400, italique: true, max: 22, min: 17, largeur: S2, maxLignes: 2, interlignage: 1.25 });
          ecrireBloc(g, lg, px0, yPhoto + S2 + OMBRE + 10, ENCRE2, "left");
        }
        cellulesStats(g, u.cellules, M, yStats, LC, false);
      }
      pied(g, W, H, M, carre, c, code, logo, livre);
    }
    // les images dont l'affiche a besoin
    function chargerImage(src, delai) {
      return new Promise(function (ok) {
        var im = new Image(), fini = false;
        function fin(r) { if (!fini) { fini = true; ok(r); } }
        im.onload = function () { fin(im); };
        im.onerror = function () { fin(null); };
        setTimeout(function () { fin(null); }, delai || 4000);
        try { im.src = src; } catch (e) { fin(null); }
      });
    }
    function svgEnImage(xml, taille) {
      if (!xml) return Promise.resolve(null);
      xml = xml.replace(/^<svg\b([^>]*)>/, function (m, attrs) {
        attrs = attrs.replace(/\s(width|height)="[^"]*"/g, "");
        if (!/\sxmlns=/.test(attrs)) attrs += ' xmlns="http://www.w3.org/2000/svg"';
        return '<svg width="' + taille + '" height="' + taille + '"' + attrs + ">";
      });
      return chargerImage("data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml));
    }
    function logoEnImage() {
      var svg = "";
      try { svg = typeof logoPixel === "function" ? logoPixel("FUSIBLE") : ""; } catch (e) { svg = ""; }
      if (!svg) return Promise.resolve(null);
      var m = /viewBox="(-?\d+) (-?\d+) (\d+) (\d+)"/.exec(svg), vw = m ? +m[3] : 60, vh = m ? +m[4] : 10, u = 12;
      svg = svg.replace(/^<svg\b([^>]*)>/, function (mm, attrs) {
        if (!/\sxmlns=/.test(attrs)) attrs += ' xmlns="http://www.w3.org/2000/svg"';
        return '<svg width="' + (vw * u) + '" height="' + (vh * u) + '"' + attrs + ">";
      });
      return chargerImage("data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg));
    }
    function polices() {
      if (!document.fonts || !document.fonts.load) return Promise.resolve();
      var specs = ['700 60px "Space Mono"', '400 30px "Space Mono"', 'italic 400 30px "Space Mono"'];
      var tous = specs.map(function (s) { return document.fonts.load(s, "Aéàç « »").then(null, function () {}); });
      tous.push(document.fonts.ready.then(null, function () {}));
      return Promise.race([Promise.all(tous), temporiser(2500)]);
    }
    // rend une promesse, même quand la lecture de la Une jette : l'écran de fin n'en sait rien
    function composer(format) {
      return Promise.resolve().then(function () { return composerVraiment(format); });
    }
    function composerVraiment(format) {
      var F = FORMATS[format];
      if (!F) return Promise.reject(new Error("format inconnu : " + format));
      var u = lireUne(), c = etat.carriere || capturerCarriere(), code = etat.code || codeDe(c);
      function png(cv) {
        return new Promise(function (ok, ko) {
          try {
            cv.toBlob(function (b) { if (b) ok({ canvas: cv, blob: b, largeur: cv.width, hauteur: cv.height }); else ko(new Error("toBlob")); }, "image/png");
          } catch (e) { ko(e); }
        });
      }
      return Promise.all([polices(), svgEnImage(u.svg, 1000), logoEnImage()]).then(function (r) {
        var cv = document.createElement("canvas");
        dessiner(cv, format, u, c, code, r[1], r[2]);
        // un navigateur qui tient le SVG pour une source non sûre « souille » la toile et refuse
        // l'export : on recommence sans la photo ni le logo plutôt que de ne rien rendre
        return png(cv).then(null, function () {
          var cv2 = document.createElement("canvas");
          dessiner(cv2, format, u, c, code, null, null);
          return png(cv2);
        });
      });
    }

    // ═══ LA FEUILLE DE PARTAGE ═══════════════════════════════════════════════
    function formatChoisi() {
      var s = lire(CLE_PARTAGE);
      return s && FORMATS[s.format] ? s.format : "story";
    }
    function cleCarriere() {
      var c = etat.carriere || {};
      return [c.livre, c.graine, c.fin, c.cartes].join("|");
    }
    function construireFeuille() {
      if (etat.feuille) return etat.feuille;
      var s = etat.feuille = { ouverte: false, format: "story", jeton: 0, cache: {}, cle: "", opener: null, bt: {} };
      var voile = s.voile = el("div", "pt-voile");
      voile.hidden = true;
      var fe = s.fe = el("div", "pt-feuille");
      fe.setAttribute("role", "dialog"); fe.setAttribute("aria-modal", "true"); fe.setAttribute("aria-labelledby", "ptTitre");
      var tete = el("div", "pt-tete"), titre = el("b", "", "Partager ma Une");
      titre.id = "ptTitre";
      var x = s.fermer = el("button", "pt-x", "×");
      x.type = "button"; x.setAttribute("aria-label", "Fermer");
      x.addEventListener("click", sur("fermer", fermerFeuille));
      tete.appendChild(titre); tete.appendChild(x);
      fe.appendChild(tete);
      var fm = el("div", "pt-formats");
      fm.setAttribute("role", "group"); fm.setAttribute("aria-label", "Format de l'image");
      ["story", "carre"].forEach(function (k) {
        var b = el("button", "", FORMATS[k].nom);
        b.type = "button"; b.setAttribute("data-f", k); b.setAttribute("aria-pressed", "false");
        b.appendChild(el("small", "", " " + FORMATS[k].rapport));
        b.addEventListener("click", sur("format", function () { montrerFormat(k); }));
        s.bt[k] = b; fm.appendChild(b);
      });
      fe.appendChild(fm);
      var ap = el("div", "pt-apercu");
      s.img = document.createElement("img");
      s.img.className = "pt-img"; s.img.alt = ""; s.img.hidden = true; s.img.draggable = false;
      s.img.addEventListener("error", function () {
        // une adresse blob refusée par la page hôte : on retombe sur une adresse data:
        var r = s.cache[s.format];
        if (r && !r.repli && r.canvas) { r.repli = true; try { s.img.src = r.canvas.toDataURL("image/png"); } catch (e) {} }
      });
      s.charge = el("p", "pt-charge", "Composition de la Une…");
      ap.appendChild(s.img); ap.appendChild(s.charge);
      fe.appendChild(ap);
      s.aide = el("p", "pt-aide", "Appui long pour l'enregistrer.");
      s.aide.hidden = true;
      s.tel = el("a", "pt-tel", "Télécharger le fichier");
      s.tel.hidden = true;
      fe.appendChild(s.aide); fe.appendChild(s.tel);
      s.codeLigne = el("div", "pt-coderang");
      var lab = el("label", "pt-codelab", "Défi");
      lab.setAttribute("for", "ptCodeFeuille");
      s.code = document.createElement("input");
      s.code.type = "text"; s.code.readOnly = true; s.code.id = "ptCodeFeuille"; s.code.className = "pt-codechamp";
      s.code.setAttribute("aria-label", "Code de défi, à copier");
      s.code.addEventListener("focus", function () { try { s.code.select(); } catch (e) {} });
      s.codeLigne.appendChild(lab); s.codeLigne.appendChild(s.code);
      fe.appendChild(s.codeLigne);
      var act = el("div", "pt-actions");
      s.primaire = el("button", "pt-primaire", "Envoyer");
      s.primaire.type = "button"; s.primaire.disabled = true;
      s.primaire.addEventListener("click", sur("envoyer", agirPrimaire));
      s.copie = el("button", "pt-second", libelleDefi());
      s.copie.type = "button";
      s.copie.addEventListener("click", sur("défi", function () { actionDefi(statut, s.code); }));
      act.appendChild(s.primaire); act.appendChild(s.copie);
      fe.appendChild(act);
      s.etat = el("p", "pt-etat");
      s.etat.setAttribute("role", "status"); s.etat.setAttribute("aria-live", "polite");
      fe.appendChild(s.etat);
      voile.appendChild(fe);
      voile.addEventListener("click", sur("fond", function (e) { if (e.target === voile) fermerFeuille(); }));
      voile.addEventListener("keydown", function (e) {
        if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); fermerFeuille(); return; }
        if (e.key !== "Tab") return;
        var f = fe.querySelectorAll("button:not([disabled]),input,a[href]"), vis = [], i;
        for (i = 0; i < f.length; i++) if (!f[i].hidden && f[i].offsetParent !== null) vis.push(f[i]);
        if (!vis.length) return;
        var premier = vis[0], dernier = vis[vis.length - 1];
        if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
        else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
      });
      document.body.appendChild(voile);
      return s;
    }
    function statut(t) { var s = etat.feuille; if (s && s.etat) s.etat.textContent = t || ""; }
    function peutPartager(fichier) {
      try { return !!(fichier && navigator.share && navigator.canShare && navigator.canShare({ files: [fichier] })); } catch (e) { return false; }
    }
    function majPrimaire() {
      var s = etat.feuille, r = s && s.cache[s.format];
      if (!s) return;
      s.primaire.textContent = r && peutPartager(r.file) ? "Envoyer" : "Enregistrer l'image";
      s.primaire.disabled = !r;
    }
    function obtenirAffiche(format) {
      var s = etat.feuille, cle = cleCarriere();
      if (s.cle !== cle) { effacerCache(s); s.cle = cle; }
      if (s.cache[format]) return Promise.resolve(s.cache[format]);
      return composer(format).then(function (r) {
        var res = { blob: r.blob, canvas: r.canvas, url: "", file: null, largeur: r.largeur, hauteur: r.hauteur };
        try { res.url = URL.createObjectURL(r.blob); } catch (e) { try { res.url = r.canvas.toDataURL("image/png"); } catch (x) {} }
        try { res.file = new File([r.blob], FORMATS[format].fichier, { type: "image/png" }); } catch (e) { res.file = null; }
        s.cache[format] = res;
        return res;
      });
    }
    function effacerCache(s) {
      Object.keys(s.cache).forEach(function (k) { try { if (s.cache[k].url && /^blob:/.test(s.cache[k].url)) URL.revokeObjectURL(s.cache[k].url); } catch (e) {} });
      s.cache = {};
    }
    function montrerFormat(f) {
      var s = etat.feuille;
      if (!s || !FORMATS[f]) return;
      var jeton = ++s.jeton;
      s.format = f;
      ecrire(CLE_PARTAGE, { format: f });
      Object.keys(s.bt).forEach(function (k) { s.bt[k].setAttribute("aria-pressed", k === f ? "true" : "false"); });
      s.fe.classList.remove("pt-grand");
      s.aide.hidden = true; s.tel.hidden = true; s.img.draggable = false;
      s.img.hidden = true; s.charge.hidden = false; s.charge.textContent = "Composition de la Une…";
      s.primaire.disabled = true;
      statut("");
      obtenirAffiche(f).then(function (r) {
        if (jeton !== s.jeton || !s.ouverte) return;
        s.charge.hidden = true;
        s.img.alt = "Aperçu de ta Une, format " + FORMATS[f].nom.toLowerCase();
        s.img.src = r.url;
        s.img.hidden = false;
        majPrimaire();
      }, function (e) {
        if (jeton !== s.jeton) return;
        bruit("composer", e);
        s.charge.hidden = false;
        s.charge.textContent = "L'image n'a pas pu être composée. Le défi reste copiable.";
      });
    }
    // Envoyer : le partage du téléphone, avec le texte du défi ; sinon enregistrer. Le texte est
    // aussi copié (si la page en a le droit) : certaines applications laissent tomber le texte.
    // Chaque chemin rend une promesse : un message, null (la grande image a pris la main) ou
    // undefined (l'utilisateur a refermé l'écran de partage : rien à dire). Le message final
    // est posé une seule fois, avec ce que la copie du texte a donné.
    function agirPrimaire() {
      var s = etat.feuille, f = s.format, r = s.cache[f];
      if (!r) return;
      var txt = texteDefi(etat.carriere, etat.code, true);
      var copie = copier(txt), fait;
      if (peutPartager(r.file)) {
        fait = new Promise(function (ok) {
          var p;
          try { p = Promise.resolve(navigator.share({ files: [r.file], title: "Ma Une dans FUSIBLE", text: txt })); } catch (e) { p = Promise.reject(e); }
          p.then(function () { ok("Envoyé."); }, function (err) {
            if (err && err.name === "AbortError") { ok(undefined); return; }
            enregistrer(f).then(ok);
          });
        });
      } else fait = enregistrer(f);
      Promise.all([fait, copie]).then(function (res) {
        var t = res[0];
        if (t === undefined) return;
        if (t === null) t = "Appui long pour l'enregistrer.";
        statut(t + (res[1] ? " Le défi est aussi copié." : ""));
      }, function (e) { bruit("envoyer", e); });
    }
    function enregistrer(f) {
      var s = etat.feuille, r = s.cache[f];
      if (!r) return Promise.resolve(null);
      return capacite("downloads").then(function (d) {
        if (!d || typeof d.save !== "function") { montrerEnGrand(f); return null; }
        return d.save({ filename: FORMATS[f].fichier, data: r.blob }).then(function () {
          return "Image enregistrée.";
        }, function (err) {
          if (err && err.code === "declined") return "Enregistrement annulé.";
          montrerEnGrand(f);
          return null;
        });
      }).then(null, function (e) { bruit("enregistrer", e); montrerEnGrand(f); return null; });
    }
    // le dernier recours : l'image en grand, pour l'appui long, et un lien de téléchargement
    function montrerEnGrand(f) {
      var s = etat.feuille, r = s && s.cache[f];
      if (!s || !r) return;
      s.fe.classList.add("pt-grand");
      s.aide.hidden = false;
      s.tel.hidden = false;
      s.tel.href = r.url;
      s.tel.setAttribute("download", FORMATS[f].fichier);
      s.img.draggable = true;                  // l'image se glisse aussi vers le bureau
      statut("Appui long pour l'enregistrer.");
      try { s.img.scrollIntoView({ block: "nearest" }); } catch (e) {}
    }
    // la feuille ouverte, le reste de la page est hors d'atteinte (clavier, lecteur d'écran)
    function arrierePlan(ferme) {
      var d = $("device");
      if (!d) return;
      try {
        if (ferme) { d.setAttribute("aria-hidden", "true"); d.inert = true; }
        else { d.removeAttribute("aria-hidden"); d.inert = false; }
      } catch (e) {}
    }
    function ouvrirFeuille(opener) {
      if (!etat.carriere) etat.carriere = capturerCarriere();
      if (!etat.code) etat.code = codeDe(etat.carriere);
      var s = construireFeuille();
      s.ouverte = true; s.opener = opener || document.activeElement;
      s.voile.hidden = false;
      document.documentElement.classList.add("pt-ouvert");
      arrierePlan(true);
      s.codeLigne.hidden = !etat.code;
      s.code.value = etat.code ? etat.code.groupe : "";
      s.copie.hidden = !etat.code;
      statut("");
      montrerFormat(formatChoisi());
      if (reduit()) s.voile.classList.add("on");
      else requestAnimationFrame(function () { s.voile.classList.add("on"); });
      try { s.fermer.focus(); } catch (e) {}
    }
    function fermerFeuille() {
      var s = etat.feuille;
      if (!s || !s.ouverte) return;
      s.ouverte = false; s.jeton++;
      s.voile.classList.remove("on");
      s.voile.hidden = true;
      s.fe.classList.remove("pt-grand");
      document.documentElement.classList.remove("pt-ouvert");
      arrierePlan(false);
      s.img.hidden = true; s.img.removeAttribute("src");
      effacerCache(s);
      try { if (s.opener && s.opener.focus && document.body.contains(s.opener)) s.opener.focus(); } catch (e) {}
    }

    // ═══ LA FEUILLE DE STYLE ═════════════════════════════════════════════════
    var CSS = [
      "/* LE PARTAGE (preview_partage.js) */",
      "html.pt-ouvert{overflow:hidden}",
      ".pt-accueil{display:flex;flex-direction:column;gap:14px;margin:16px 0 0}",
      ".pt-accueil:empty{display:none}",
      ".pt-avis{margin:0;padding:10px 12px;font-size:13px;line-height:1.45;color:var(--a-texte,#F6E9CF);background:#2A1722;box-shadow:inset 0 0 0 2px #E0164B}",
      /* le défi reçu */
      ".pt-defi{padding:12px 14px 14px;background:var(--a-fond2,#1C1630);color:var(--a-texte,#F6E9CF);box-shadow:0 0 0 3px #E0164B,5px 5px 0 3px var(--a-ombre,#06040B)}",
      ".pt-defi-tag{margin:0 0 6px;font-family:var(--pix,'Pixelify Sans','Space Mono',monospace);font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#FF8FA9}",
      ".pt-defi-txt{margin:0;font-size:14px;line-height:1.5}",
      ".pt-defi-txt b{color:var(--a-or,#FFC94D);font-weight:700}",
      ".pt-defi-actions{display:flex;gap:8px;align-items:center;margin-top:12px}",
      ".pt-defi-go{flex:1 1 auto;min-height:46px;padding:0 14px;background:#E0164B;color:#FFF7EF;font-family:var(--pix,'Pixelify Sans','Space Mono',monospace);font-size:16px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;box-shadow:0 0 0 2px #06040B,3px 3px 0 2px #06040B}",
      ".pt-defi-go:focus-visible{outline:2px solid #FFC94D;outline-offset:2px}",
      ".pt-defi-x{flex:0 0 44px;min-height:44px;color:var(--a-texte2,#CBC1E2);font-size:24px;line-height:1}",
      ".pt-defi-x:focus-visible{outline:2px solid #FFC94D;outline-offset:-4px}",
      /* le livre du jour */
      ".pt-jour{--acc:#FF9A3C;display:flex;width:100%;text-align:left;padding:0;background:var(--a-fond2,#1C1630);color:var(--a-texte,#F6E9CF);box-shadow:0 0 0 3px var(--acc),6px 6px 0 3px var(--a-ombre,#06040B);transition:transform 120ms steps(2),box-shadow 120ms steps(2)}",
      ".pt-jour:hover,.pt-jour:focus-visible{outline:0;transform:translate(-2px,-2px);box-shadow:0 0 0 3px var(--acc),8px 8px 0 3px var(--a-ombre,#06040B)}",
      ".pt-jour:focus-visible{outline:2px solid #FFC94D;outline-offset:5px}",
      ".pt-jour:active{transform:translate(3px,3px);box-shadow:0 0 0 3px var(--acc),2px 2px 0 3px var(--a-ombre,#06040B)}",
      ".pt-jour-img{flex:0 0 36%;position:relative;overflow:hidden;background:#0B0814}",
      ".pt-jour-img img{display:block;width:100%;height:100%;object-fit:cover}",
      ".pt-jour-corps{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:6px;padding:11px 12px 12px}",
      ".pt-jour-tag{display:block;font-family:var(--pix,'Pixelify Sans','Space Mono',monospace);font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--acc)}",
      ".pt-jour-titre{display:block;font-family:var(--pix,'Pixelify Sans','Space Mono',monospace);font-size:21px;font-weight:600;line-height:1.15}",
      ".pt-jour-puces{display:flex;flex-wrap:wrap;gap:6px}",
      ".pt-puce{display:inline-block;padding:3px 6px 2px;font-family:var(--pix,'Pixelify Sans','Space Mono',monospace);font-size:12px;line-height:1;letter-spacing:.05em;text-transform:uppercase;background:#0F0C18;color:var(--a-texte2,#CBC1E2);box-shadow:0 0 0 2px var(--a-ligne,#352B52)}",
      ".pt-jour-ligne{display:block;font-size:12px;font-style:italic;line-height:1.45;color:var(--a-texte2,#CBC1E2)}",
      ".pt-jour-stats{display:block;font-size:12px;line-height:1.45;color:var(--a-texte,#F6E9CF)}",
      ".pt-jour-stats[hidden]{display:none}",
      /* le code à coller */
      ".pt-code{display:flex;flex-direction:column;gap:8px}",
      ".pt-code-ouvre{align-self:flex-start;min-height:44px;padding:0 2px;font-family:var(--pix,'Pixelify Sans','Space Mono',monospace);font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:var(--a-texte2,#CBC1E2);text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:5px}",
      ".pt-code-ouvre:hover{color:var(--a-or,#FFC94D)}", ".pt-code-ouvre:focus-visible{color:var(--a-or,#FFC94D);outline:2px solid #FFC94D;outline-offset:3px}",
      ".pt-code-form{display:flex;flex-wrap:wrap;gap:8px}",
      ".pt-code-form[hidden]{display:none}",
      ".pt-code-champ{flex:1 1 150px;min-width:0;min-height:46px;padding:0 10px;background:#0F0C18;color:var(--a-texte,#F6E9CF);border:0;box-shadow:inset 0 0 0 2px var(--a-ligne,#352B52);font-size:14px;letter-spacing:.06em;text-transform:uppercase}",
      ".pt-code-champ::placeholder{text-transform:none;font-style:italic;color:var(--a-texte3,#A79CC4)}",
      ".pt-code-champ:focus{outline:0;box-shadow:inset 0 0 0 2px var(--a-or,#FFC94D)}",
      ".pt-code-ok{flex:0 0 auto;min-height:46px;padding:0 14px;background:var(--a-or,#FFC94D);color:#0B0814;font-family:var(--pix,'Pixelify Sans','Space Mono',monospace);font-size:15px;font-weight:600;letter-spacing:.06em;text-transform:uppercase}",
      ".pt-code-ok:focus-visible{outline:2px solid #fff;outline-offset:2px}",
      ".pt-code-msg{flex:1 1 100%;margin:0;font-size:12.5px;line-height:1.45;color:#FF8FA9}",
      ".pt-code-msg:empty{display:none}",
      /* l'écran de fin : le haut (le défi, le livre du jour), le pied (partager) */
      ".pt-haut{display:flex;flex-direction:column;gap:12px;margin:14px 0 0}",
      ".pt-haut:empty{display:none}",
      ".pt-cmp,.pt-jourres{padding:13px 14px 14px;background:var(--fond2,#241608);border-radius:3px;border-left:3px solid var(--framboise,#E0164B)}",
      ".pt-jourres{border-left-color:#FFC94D}",
      ".pt-etiquette{margin:0 0 9px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--creme3,#B0A07C)}",
      ".pt-cols{display:flex;gap:10px}",
      ".pt-col{flex:1 1 0;min-width:0;display:flex;flex-direction:column;gap:3px;padding:9px 10px 10px;background:var(--fond,#1B1109);border-radius:3px;box-shadow:inset 0 0 0 1px var(--fond3,#2E1D0C)}",
      ".pt-col.mieux{box-shadow:inset 0 0 0 2px var(--vert,#4E9448)}",
      ".pt-qui{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--creme3,#B0A07C);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".pt-col-fin{font-size:13px;font-weight:700;line-height:1.3;color:var(--creme,#F2E8CE);overflow-wrap:anywhere}",
      ".pt-n{font-size:24px;font-weight:700;line-height:1.1;color:var(--creme,#F2E8CE)}",
      ".pt-n small{font-size:11px;font-weight:400;letter-spacing:.12em;text-transform:uppercase;color:var(--creme3,#B0A07C)}",
      ".pt-s{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--creme3,#B0A07C)}",
      ".pt-verdict{margin:11px 0 0;font-size:13.5px;font-style:italic;line-height:1.5;color:var(--creme,#F2E8CE)}",
      ".pt-jourres-ligne{margin:0 0 4px;font-size:13px;line-height:1.5;color:var(--creme2,#C4B491)}",
      ".pt-jourres-ligne:last-child{margin-bottom:0}",
      ".pt-pied{margin-top:20px;display:flex;flex-direction:column;gap:10px}",
      ".pt-pied:empty{display:none}",
      ".pt-bouton{width:100%;min-height:56px;padding:0 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;background:var(--framboise,#E0164B);color:#FFF7EF;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;border-radius:3px;box-shadow:inset 0 -3px 0 rgba(0,0,0,.25)}",
      ".pt-bouton small{font-size:11px;font-weight:400;letter-spacing:.14em;opacity:.9}",
      ".pt-bouton:focus-visible{outline:2px solid var(--creme,#F2E8CE);outline-offset:2px}",
      ".pt-coderang{display:flex;align-items:center;gap:8px;min-width:0}",
      ".pt-codelab{flex:0 0 auto;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--creme3,#B0A07C)}",
      ".pt-codechamp{flex:1 1 auto;min-width:0;min-height:44px;padding:0 9px;background:var(--fond2,#241608);color:var(--creme,#F2E8CE);border:0;border-radius:3px;box-shadow:inset 0 0 0 1px var(--fond3,#2E1D0C);font-size:12px;letter-spacing:.04em;text-overflow:ellipsis}",
      ".pt-codechamp:focus{outline:1px solid var(--framboise,#E0164B)}",
      ".pt-copie{width:100%;min-height:48px;padding:0 12px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--creme2,#C4B491);border-radius:3px;box-shadow:inset 0 0 0 1px var(--trait,#8B7A57)}",
      ".pt-copie:hover{color:var(--framboise,#E0164B);box-shadow:inset 0 0 0 1px var(--framboise,#E0164B)}", ".pt-copie:focus-visible{outline:2px solid var(--creme,#F2E8CE);outline-offset:2px}",
      ".pt-copie-etat{margin:0;font-size:11.5px;line-height:1.4;color:var(--creme3,#B0A07C)}",
      ".pt-copie-etat:empty{display:none}",
      /* la feuille */
      ".pt-voile{position:fixed;inset:0;z-index:200;display:flex;align-items:flex-end;justify-content:center;background:rgba(8,5,3,.74);opacity:0;transition:opacity 160ms linear}",
      ".pt-voile.on{opacity:1}",
      ".pt-voile[hidden]{display:none}",
      ".pt-feuille{width:min(430px,100%);max-height:calc(100vh - 10px);max-height:calc(100dvh - 10px);overflow-y:auto;overscroll-behavior:contain;padding:8px 18px calc(16px + env(safe-area-inset-bottom));background:var(--fond,#1B1109);color:var(--creme,#F2E8CE);border-radius:14px 14px 0 0;box-shadow:0 -2px 0 var(--fond3,#2E1D0C),0 -18px 40px rgba(0,0,0,.5);transform:translateY(22px);transition:transform 200ms ease;font-family:'Space Mono','DejaVu Sans Mono',ui-monospace,Menlo,Consolas,monospace}",
      ".pt-voile.on .pt-feuille{transform:none}",
      ".pt-tete{display:flex;align-items:center;justify-content:space-between;min-height:46px}",
      ".pt-tete b{font-size:12px;letter-spacing:.28em;text-transform:uppercase;color:var(--creme2,#C4B491)}",
      ".pt-x{width:46px;height:46px;margin-right:-12px;display:grid;place-items:center;color:var(--framboise,#E0164B);font-size:26px;line-height:1}",
      ".pt-x:focus-visible,.pt-formats button:focus-visible,.pt-primaire:focus-visible,.pt-second:focus-visible,.pt-tel:focus-visible{outline:2px solid var(--creme,#F2E8CE);outline-offset:2px}",
      ".pt-formats{display:flex;gap:8px;margin:4px 0 10px}",
      ".pt-formats button{flex:1 1 0;min-height:44px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--creme2,#C4B491);border-radius:3px;box-shadow:inset 0 0 0 1px var(--fond3,#2E1D0C)}",
      ".pt-formats button small{font-size:11px;font-weight:400;letter-spacing:.08em;color:var(--creme3,#B0A07C)}",
      ".pt-formats button[aria-pressed=true]{color:var(--creme,#F2E8CE);background:rgba(224,22,75,.14);box-shadow:inset 0 0 0 2px var(--framboise,#E0164B)}",
      ".pt-apercu{display:flex;align-items:center;justify-content:center;min-height:120px;margin:0 0 10px}",
      ".pt-img{display:block;width:auto;height:auto;max-width:100%;max-height:calc(100vh - 340px);max-height:calc(100dvh - 340px);min-height:80px;box-shadow:0 0 0 2px var(--fond3,#2E1D0C),0 10px 26px rgba(0,0,0,.55);-webkit-touch-callout:default;-webkit-user-select:auto;user-select:auto}",
      ".pt-img[hidden],.pt-charge[hidden],.pt-aide[hidden],.pt-tel[hidden]{display:none}",
      ".pt-charge{margin:0;padding:34px 0;font-size:12.5px;font-style:italic;color:var(--creme3,#B0A07C);text-align:center}",
      ".pt-aide{margin:0 0 6px;font-size:12.5px;font-style:italic;line-height:1.45;color:var(--creme2,#C4B491);text-align:center}",
      ".pt-tel{display:block;margin:0 0 10px;min-height:44px;line-height:44px;text-align:center;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--creme,#F2E8CE);text-decoration:underline;text-underline-offset:4px}",
      ".pt-feuille.pt-grand .pt-img{max-height:calc(100vh - 250px);max-height:calc(100dvh - 250px)}",
      ".pt-feuille .pt-coderang{margin:0 0 10px}",
      ".pt-actions{display:flex;gap:8px}",
      ".pt-primaire{flex:1 1 58%;min-height:52px;padding:0 10px;background:var(--framboise,#E0164B);color:#FFF7EF;font-size:12.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;border-radius:3px;box-shadow:inset 0 -3px 0 rgba(0,0,0,.25)}",
      ".pt-primaire[disabled]{opacity:.5;cursor:default}",
      ".pt-second{flex:1 1 42%;min-height:52px;padding:0 8px;font-size:11.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--creme2,#C4B491);border-radius:3px;box-shadow:inset 0 0 0 1px var(--trait,#8B7A57)}",
      ".pt-second[hidden]{display:none}",
      ".pt-etat{margin:8px 0 0;min-height:18px;font-size:12px;line-height:1.45;color:var(--creme2,#C4B491)}",
      "@media (max-height:700px){.pt-img{max-height:calc(100vh - 300px);max-height:calc(100dvh - 300px)}}",
      "@media (prefers-reduced-motion:reduce){.pt-voile,.pt-feuille,.pt-jour{transition:none}}"
    ].join("\n");

    // ═══ LES CROCHETS ════════════════════════════════════════════════════════
    // Ce module est inséré avant le premier dessin de la page : rien de ce qui suit ne doit pouvoir
    // l'empêcher de démarrer (une exception ici arrêterait toute la fermeture de l'hôte).
    try {
      var style = document.createElement("style");
      style.id = "partage-css";
      style.textContent = CSS;
      document.head.appendChild(style);

      // un défi dans l'adresse : on le garde (l'adresse en est nettoyée), l'accueil le montre
      var dansUrl = codeDansUrl();
      if (dansUrl.brut) {
        var lu = lireCode(dansUrl.brut);
        if (lu.ok) { if (adopterDefi(lu.defi)) nettoyerUrl(); }
        else if (dansUrl.explicite) { etat.avis = messageCode(lu.raison); nettoyerUrl(); }
      } else if (dansUrl.explicite) {
        etat.avis = "Ce lien de défi est incomplet : il ne porte pas de code.";
        nettoyerUrl();
      }
      if (!etat.defi) chargerDefiGarde();

      A.crochet("accueil", function () {
        try { majAccueil(); } catch (e) { bruit("accueil", e); }
        try { lancerBase(); abonner(); } catch (e) { bruit("accueil base", e); }
      });
      A.crochet("debut", function () {
        etat.carriere = null; etat.code = null; etat.cmp = null; etat.jourFin = null;
        try { fermerFeuille(); } catch (e) {}
      });
      A.crochet("fin", function (v) {
        try { surFin(v); } catch (e) { bruit("fin", e); }
      });

      // de quoi vérifier sans jouer une carrière (et pour l'intégrateur)
      window.FusiblePartage = {
        coder: coder, lire: lireCode, livreDuJour: livreDuJour, composer: composer, ouvrir: ouvrirFeuille,
        fermer: fermerFeuille, lien: lienDefi,
        texte: function (avecImage) { return texteDefi(etat.carriere, etat.code, !!avecImage); },
        _verdict: verdict, _lignesFin: lignesFin,
        _etat: function () {
          return { defi: etat.defi, carriere: etat.carriere, code: etat.code, cmp: etat.cmp, jourFin: etat.jourFin, base: etatBase(), uid: db.uid, refuse: db.refuse, docs: db.docs.length };
        }
      };
    } catch (e) { bruit("démarrage", e); }
  })();
