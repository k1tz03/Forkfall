/* ═══════════════════════════════════════════════════════════════════════════
   FUSIBLE — le service worker de la version jouable (assemble.js --ville l'écrit
   à côté de la page, sa version et sa liste de départ remplies).

   · La page (index.html, la navigation) : le réseau d'abord — une nouvelle
     version arrive dès qu'elle est en ligne —, le cache s'il ne répond pas
     (hors ligne, ou plus de trois secondes sur un réseau qui traîne).
   · Le reste (ville/, contenu/, accueil/, icones/) : le cache d'abord. Ces
     fichiers ne changent qu'avec une nouvelle version de la page, et chaque
     version a son cache : l'ancien s'efface quand la nouvelle s'installe (ce
     qui est nommé par son empreinte, contenu/, passe de l'un à l'autre sans
     être retéléchargé). Une tuile, un livre déjà vus se rejouent hors ligne.
   · Ce qui n'est pas d'ici (les polices de Google) passe sans s'arrêter.
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
var VERSION = '__VERSION__';
var CACHE = 'fusible-' + VERSION;
var DEPART = __DEPART__;   // ce qu'il faut pour rouvrir l'accueil hors ligne
var LIVRES = __LIVRES__;   // les livres de cette version : on ne les demande pas d'avance
var STATIQUE = /\/(ville|contenu|accueil|icones)\/[^/]+$/;

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    // contenu/ est nommé par l'empreinte de ses octets : un nom déjà vu dans le cache d'une
    // version précédente est le même fichier. Le commun et le moteur n'y sont pas retéléchargés ;
    // un livre déjà joué y reste (on le reprend hors ligne après une mise à jour)
    var deja = function (u) { return /^contenu\//.test(u) ? caches.match(u) : Promise.resolve(null); };
    return Promise.all(DEPART.map(function (u) {
      return deja(u).then(function (r) { return r ? c.put(u, r) : c.add(u); });
    }).concat(LIVRES.map(function (u) {
      return deja(u).then(function (r) { return r ? c.put(u, r) : null; });
    })));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf('fusible-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function garder(req, rep) {
  if (rep && rep.ok && rep.type === 'basic') {
    var copie = rep.clone();
    caches.open(CACHE).then(function (c) { c.put(req, copie); });
  }
  return rep;
}

// Le cache d'abord. Un fichier qui n'y est pas va au cache, puis la page le lit de là : un
// seul flux (une copie `clone()` garderait chaque tuile en double dans la mémoire du service
// worker, une cinquantaine de Mo après le tour de la ville). Le cache plein : le réseau.
function cacheDabord(req) {
  return caches.match(req).then(function (r) {
    if (r) return r;
    return fetch(req).then(function (rep) {
      if (!rep || !rep.ok || rep.type !== 'basic') return rep;
      return caches.open(CACHE)
        .then(function (c) { return c.put(req, rep); })
        .then(function () { return caches.match(req); })
        .then(function (r2) { return r2 || fetch(req); }, function () { return fetch(req); });
    });
  });
}

// la page en cache : celle de cette adresse, sinon index.html (« ./ » et « index.html » sont la même)
function pageEnCache(req) {
  return caches.match(req, { ignoreSearch: true }).then(function (r) { return r || caches.match('index.html', { ignoreSearch: true }); });
}
function reseauDabord(req) {
  return new Promise(function (ok, ko) {
    var fini = false;
    var minuterie = setTimeout(function () {
      pageEnCache(req).then(function (r) { if (r && !fini) { fini = true; ok(r); } });
    }, 3000);
    fetch(req).then(function (rep) {
      clearTimeout(minuterie);
      garder(req, rep);
      if (fini) return;
      if (rep.ok) { fini = true; ok(rep); return; }
      // le serveur répond mal (une page absente, une erreur) : la copie gardée vaut mieux
      return pageEnCache(req).then(function (r) { if (!fini) { fini = true; ok(r || rep); } });
    }).catch(function () {
      clearTimeout(minuterie);
      pageEnCache(req).then(function (r) {
        if (fini) return;
        fini = true;
        if (r) ok(r); else ko(new Error('hors ligne'));
      });
    });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate' || /\/(index\.html)?$/.test(url.pathname)) {
    e.respondWith(reseauDabord(req));
    return;
  }
  if (STATIQUE.test(url.pathname) || /\/(manifest\.webmanifest|apercu\.jpg)$/.test(url.pathname)) {
    e.respondWith(cacheDabord(req));
  }
});
