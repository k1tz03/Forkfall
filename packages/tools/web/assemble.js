#!/usr/bin/env node
// Assemble l'aperçu web jouable (la grammaire de *Reigns*, matériaux du
// football) :
//   node packages/tools/web/assemble.js --engine <engine.js> --out <fichier.html>
// Le gabarit (preview_template.html) contient ses placeholders, remplacés
// littéralement (split/join, aucune interprétation regex) :
//   __CONTENU__       ← le contenu, découpé par build_content en un commun et un
//                       bundle par livre (content/build/livres/, vérifiés contre
//                       content/build/content.json) et compressés (gzip) : embarqués
//                       en base64 dans le fichier seul ; avec --ville, posés à
//                       côté de la page (contenu/commun.<hash>.gz,
//                       contenu/<livre>.<hash>.gz) ; puis demarrage.js, qui les
//                       décompresse (window.FusibleContenu)
//   __TETE__          ← avec --ville : la demande du commun (dès la tête), le
//                       manifeste, les icônes, le service worker, l'aperçu d'un
//                       lien partagé (Open Graph) ; rien sinon
//   __ENGINE_JS__     ← le moteur Dart compilé en JS (dart compile js preview.dart)
//   __ART_JS__        ← packages/tools/web/art.js (le SEUL moteur
//                       d'illustration : SVG plat, géométrique, sans contour.
//                       Il a remplacé la piste « album de vignettes », dont
//                       le code dort sous docs/design/archive/ et n'est plus
//                       assemblé — ne pas le rebrancher.)
//   __AUDIO_JS__      ← packages/tools/web/audio.js (l'univers sonore : les
//                       lieux, les gestes, la synthèse), suivi des thèmes
//                       musique/*.js par ordre alphabétique, chacun dans son
//                       filet (musique_sources.js) — dans la page, pour le
//                       fichier seul comme pour la version jouable ; avec
//                       --ville, le manifeste de la musique enregistrée
//                       (musique/audio/, ses MP3 à côté de la page, musique/)
//   __ACCUEIL_JS__    ← packages/tools/web/accueil/*.webp en data: (les
//                       vignettes des histoires et le panorama de la ville,
//                       découpés par docs/design/pixel_iso/accueil.js) ; avec
//                       --ville, des fichiers à côté de la page (accueil/), que
//                       l'accueil n'attend pas pour se dessiner
//   __FONTS_CSS__     ← le <link> Google Fonts de Space Mono et de Jersey 15
//                       (la seule ressource externe de tout le fichier)
//   __CINEMA__        ← le cinéma (docs/design/cinematiques.md) : le lecteur
//                       (cinema/lecteur.js, window.FusibleCinema) toujours dans la
//                       page ; three.js (vendor/three/fusible-three.js), la trousse
//                       (cinema/kit/*.js, dans l'ordre des noms) et chaque film
//                       (cinema/films/<id>.js), chargés au moment de jouer : des
//                       blocs gzip en base64 dans le fichier seul ; avec --ville,
//                       des fichiers à côté de la page (cinema/, nommés par leur
//                       empreinte, gardés par le service worker)
//   __VILLE_CSS__, __VILLE_JS__ ← vides, sauf avec --ville <dossier> : la
//                       version jouable (la ville d'Aubérive en pixel art,
//                       ville.css + ville.js). Le dossier donné porte les
//                       images de la ville (tuiles, profondeur, grille, lieux,
//                       sprites : scratchpad iso/ville_assets.js + ville_post.js,
//                       docs/design/pixel_iso) ; il est copié sous `ville/`
//                       à côté de la page.
'use strict';
const fs = require('fs');
const path = require('path');

const HERE = __dirname; // packages/tools/web
const ROOT = path.resolve(HERE, '..', '..', '..');
// Répertoire de travail par défaut : `build/web/` à la racine du dépôt, ou
// FUSIBLE_BUILD_DIR s'il est posé. Les options --engine / --out restent
// prioritaires. Aucun chemin absolu propre à une machine n'est écrit ici.
const BUILD_DIR = process.env.FUSIBLE_BUILD_DIR || path.join(ROOT, 'build', 'web');
// Les modules de la ville, insérés dans la fermeture de ville.js (au repère
// /*__VILLE_MODULES__*/), dans cet ordre : ils voient tout ce qu'elle voit.
const VILLE_MODULES = ['ville_dedans.js', 'ville_cinema.js', 'ville_film.js', 'ville_jeux.js', 'ville_vie.js', 'ville_gens.js', 'ville_quartiers.js', 'ville_album.js', 'ville_direct.js', 'ville_dossier.js', 'ville_rythme.js', 'ville_chapitres.js'];
// Les modules de l'aperçu, insérés dans la fermeture du gabarit (au repère
// /*__PREVIEW_MODULES__*/, avant le premier dessin) : ils s'abonnent aux crochets
// (`crochet('debut', fn)`…) et voient tout ce que voit le gabarit.
const PREVIEW_MODULES = ['preview_album.js', 'preview_direct.js', 'preview_dossier.js', 'preview_echos.js', 'preview_partage.js', 'preview_eclair.js', 'preview_film.js'];
// ville_film.js enveloppe ces quatre fonctions de ville_cinema.js (les portes des scènes
// jouées, que les films prennent aussi) : un renommage doit casser l'assemblage, pas les films
const PORTES_DES_FILMS = ['cineDeCarte', 'cineDeDrapeau', 'cineIntro', 'jouerCine'];

/// LE CINÉMA (docs/design/cinematiques.md) : le lecteur, toujours dans la page ; three.js,
/// la trousse et les films, chargés quand un film se joue. Les films sont les fichiers de
/// cinema/films/ (l'id d'un film est le nom de son fichier, et il se déclare avec cet id) ;
/// un déclencheur du contenu (`ville.films[].module`) qui nomme un film absent casse
/// l'assemblage.
function cinemaSources() {
  const dir = path.join(HERE, 'cinema');
  const kitDir = path.join(dir, 'kit'), filmsDir = path.join(dir, 'films');
  const kit = fs.readdirSync(kitDir).filter((f) => /^\d\d_[a-z_]+\.js$/.test(f)).sort()
    .map((f) => '/* cinema/kit/' + f + ' */\n' + fs.readFileSync(path.join(kitDir, f), 'utf8')).join('\n;\n');
  const films = {};
  for (const f of fs.readdirSync(filmsDir).filter((x) => /^[a-z0-9_]+\.js$/.test(x)).sort()) {
    const id = f.slice(0, -3), src = fs.readFileSync(path.join(filmsDir, f), 'utf8');
    if (!new RegExp('\\bid:\\s*["\']' + id + '["\']').test(src)) throw new Error('cinema/films/' + f + ' : le film doit se déclarer avec id: "' + id + '"');
    films[id] = src;
  }
  return {
    lecteur: fs.readFileSync(path.join(dir, 'lecteur.js'), 'utf8'),
    three: fs.readFileSync(path.join(HERE, 'vendor', 'three', 'fusible-three.js'), 'utf8'),
    kit, films,
  };
}
function cinemaHtml(c, versDossier, bundle) {
  const zlib = require('zlib');
  const empreinte = (x) => require('crypto').createHash('sha1').update(x).digest('hex').slice(0, 10);
  for (const f of ((bundle.ville || {}).films || [])) {
    if (!c.films[f.module]) throw new Error('ville.films/' + f.id + ' : le film « ' + f.module + ' » n\'est pas dans packages/tools/web/cinema/films/');
  }
  const blocs = [], urls = [];
  if (versDossier) {
    fs.rmSync(path.join(versDossier, 'cinema'), { recursive: true, force: true });
    fs.mkdirSync(path.join(versDossier, 'cinema'), { recursive: true });
  }
  const poser = (cle, texte, nom) => {
    if (versDossier) {
      const u = 'cinema/' + nom + '.' + empreinte(texte) + '.js';
      fs.writeFileSync(path.join(versDossier, u), texte);
      urls.push(u);
      return { url: u };
    }
    const id = 'fusible-cinema-' + cle;
    blocs.push('<script type="application/octet-stream" id="' + id + '">' + zlib.gzipSync(Buffer.from(texte, 'utf8'), { level: 9 }).toString('base64') + '</script>');
    return { el: id };
  };
  const sources = { three: poser('three', c.three, 'three'), kit: poser('kit', c.kit, 'kit'), films: {} };
  for (const [id, src] of Object.entries(c.films)) sources.films[id] = poser('film-' + id, src, 'film.' + id);
  blocs.push('<script>window.FUSIBLE_CINEMA = ' + JSON.stringify(sources) + ';</script>');
  blocs.push('<script>' + c.lecteur.split('</script').join('<\\/script') + '</script>');
  const tous = [c.three, c.kit].concat(Object.values(c.films));
  const octets = tous.reduce((a, s) => a + Buffer.byteLength(s), 0), gz = tous.reduce((a, s) => a + zlib.gzipSync(Buffer.from(s, 'utf8'), { level: 9 }).length, 0);
  console.log('le cinéma : three.js, la trousse et ' + Object.keys(c.films).length + ' film(s), ' + Math.round(octets / 1024) + ' Ko (' + Math.round(gz / 1024) + ' Ko gzip) ' +
    (versDossier ? 'à côté de la page, cinema/' : 'embarqués') + ' ; le lecteur, ' + Math.round(Buffer.byteLength(c.lecteur) / 1024) + ' Ko, dans la page');
  return { html: blocs.join('\n'), urls };
}

// Les noms qu'un fichier déclare au premier niveau d'une fermeture (deux espaces) :
// un module partage la fermeture, il ne redéclare jamais un nom de son hôte ni d'un
// autre module (une `function lancer` y remplacerait celle qui démarre la ville, en silence).
function declares(src) {
  const out = new Set();
  for (const m of src.matchAll(/^  function\s+([A-Za-z_$][\w$]*)\s*\(/gm)) out.add(m[1]);
  // `var a = …, b = …` : les noms en tête de chaque segment de profondeur nulle
  for (const m of src.matchAll(/^  var\s/gm)) {
    let i = m.index + m[0].length, prof = 0, debut = true, chaine = null;
    for (; i < src.length; i++) {
      const c = src[i];
      if (chaine) { if (c === '\\') i++; else if (c === chaine) chaine = null; continue; }
      if (debut) { const n = /^\s*([A-Za-z_$][\w$]*)/.exec(src.slice(i, i + 80)); if (n) out.add(n[1]); debut = false; }
      if (c === '"' || c === "'" || c === '`') chaine = c;
      else if ('([{'.includes(c)) prof++;
      else if (')]}'.includes(c)) prof--;
      else if (c === ',' && prof === 0) debut = true;
      else if (c === ';' && prof === 0) break;
    }
  }
  return out;
}

function parseArgs(argv) {
  const opts = { engine: path.join(BUILD_DIR, 'engine.js'), out: path.join(BUILD_DIR, 'fusible_preview.html'), ville: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--engine') opts.engine = argv[++i];
    else if (a === '--out') opts.out = argv[++i];
    else if (a === '--ville') opts.ville = argv[++i];
    else if (a === '--content') opts.content = argv[++i];   // un autre bundle (les essais)
    // le contenu à côté de la page en JSON (non compressé) plutôt qu'en .gz : pour un hôte qui ne sert pas
    // le gzip comme fichier (l'artefact publié) ; il compresse lui-même au transfert, et demarrage.js lit
    // tel quel un bundle qui ne commence pas par l'en-tête gzip
    else if (a === '--contenu-json') opts.contenuJson = true;
    else if (a.startsWith('--engine=')) opts.engine = a.slice(9);
    else if (a.startsWith('--out=')) opts.out = a.slice(6);
    else if (a === '-h' || a === '--help') {
      console.log('usage: node assemble.js [--engine engine.js] [--out fusible_preview.html] [--ville dossier_des_images]');
      process.exit(0);
    } else {
      console.error('argument inconnu : ' + a);
      process.exit(2);
    }
  }
  if (!opts.engine || !opts.out) {
    console.error('--engine et --out attendent une valeur');
    process.exit(2);
  }
  return opts;
}

/// LA POLICE — Space Mono (400/700, romain et italique), par <link> Google
/// Fonts. C'est la SEULE ressource externe de tout le fichier assemblé ; la
/// pile de repli du gabarit (DejaVu Sans Mono, ui-monospace, Menlo, Consolas,
/// monospace) tient le jeu debout hors ligne.
///
/// Trois monospaces ont été comparées côte à côte sur le fond brun réel, à la
/// taille réelle : Space Mono l'emporte sur les chiffres (le 4 ouvert, le 7
/// sans barre mais à talon, le 9 droit — un tableau d'affichage), sur la
/// présence de ses capitales, et sur un italique qui est un vrai dessin et
/// reste lisible à 15,5 px. IBM Plex Mono était plus sage, JetBrains Mono trop
/// technique.
///
/// La police pixel de l'accueil (et des cartons-titres des scènes jouées) est
/// Jersey 15, une seule graisse. Pixelify Sans, qu'elle remplace, lisait
/// « AUGÉRIVE · 20S0 », « FOOTGALL » et « GARRIÈRE » sur un téléphone (ses 5, B
/// et C ressemblent à un S, un G et un G) ; Jersey 15 garde le pixel et ne confond
/// plus ni B, C, G, S, ni 5, 8.
///
/// La feuille ne bloque rien (`media="print"` puis `all` à son arrivée) : une
/// feuille ordinaire fait attendre TOUS les scripts qui la suivent, le temps
/// d'aller chercher un autre serveur — sur un téléphone, une demi-seconde
/// avant le premier écran. Les polices arrivent après, comme `display=swap`
/// le prévoyait déjà.
function fontsCss() {
  const href = 'https://fonts.googleapis.com/css2?' +
    'family=Jersey+15&' +
    'family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap';
  return [
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link rel="stylesheet" href="' + href + '" media="print" onload="this.media=\'all\'">',
    '<noscript><link rel="stylesheet" href="' + href + '"></noscript>',
  ].join('\n');
}

/// L'ACCUEIL — les vignettes des histoires et le panorama de la ville
/// (packages/tools/web/accueil/*.webp, découpés dans les rendus de la ville par
/// docs/design/pixel_iso/accueil.js), embarqués en data: pour que l'accueil
/// tienne dans le fichier seul, avec ou sans la ville à côté.
///   couv_<postulat>.webp → FUSIBLE_ACCUEIL.couv[<postulat>]
///   panorama_<heure>.webp → FUSIBLE_ACCUEIL.panorama[<heure>]
///
/// Avec `versDossier` (la version jouable, servie en HTTP), les images sont
/// copiées dans `accueil/` à côté de la page et nommées par leur chemin : la page
/// pèse un mégaoctet de moins, l'accueil se dessine sans les attendre, et seul le
/// panorama de l'heure est téléchargé.
function accueilJs(versDossier) {
  const dir = path.join(HERE, 'accueil');
  const out = { couv: {}, panorama: {} };
  if (fs.existsSync(dir)) {
    if (versDossier) fs.mkdirSync(path.join(versDossier, 'accueil'), { recursive: true });
    for (const f of fs.readdirSync(dir).sort()) {
      const m = /^(couv|panorama)_([a-z0-9_]+)\.webp$/.exec(f);
      if (!m) continue;
      if (versDossier) {
        fs.copyFileSync(path.join(dir, f), path.join(versDossier, 'accueil', f));
        out[m[1]][m[2]] = 'accueil/' + f;
      } else {
        out[m[1]][m[2]] = 'data:image/webp;base64,' + fs.readFileSync(path.join(dir, f)).toString('base64');
      }
    }
  }
  return 'window.FUSIBLE_ACCUEIL = ' + JSON.stringify(out) + ';';
}

/// LE CONTENU — build_content écrit le bundle entier (content/build/content.json, et
/// sa copie app/assets/content.json que l'application lit) et, pour l'aperçu, le même
/// découpé (content/build/livres/ : commun.json et un fichier par livre, voir
/// packages/tools/bin/src/livres.dart), du même passage. On lit content/build/ : la
/// copie de l'application est commitée et peut retarder sur le contenu (on ne la
/// commite pas à chaque lot). Un autre bundle (`--content`, les essais) part entier,
/// comme commun, sans livres.
function chargerContenu(opts) {
  const construit = path.join(ROOT, 'content', 'build', 'content.json');
  const entierPath = opts.content ? path.resolve(opts.content) : (fs.existsSync(construit) ? construit : path.join(ROOT, 'app', 'assets', 'content.json'));
  const entier = JSON.parse(fs.readFileSync(entierPath, 'utf8')); // un JSON valide avant d'être incrusté
  const dir = path.join(ROOT, 'content', 'build', 'livres');
  const communPath = path.join(dir, 'commun.json');
  const communTexte = fs.existsSync(communPath) ? fs.readFileSync(communPath, 'utf8') : null;
  const commun = communTexte ? JSON.parse(communTexte) : null;
  if (!commun || commun.hash !== entier.hash) {
    if (opts.content) return { entier, communTexte: JSON.stringify(entier), commun: null, livres: {} };
    throw new Error(commun ? 'content/build/livres/ ne vient pas de ' + path.relative(ROOT, entierPath) + ' (' + commun.hash + ' ≠ ' + entier.hash + ') : relance build_content'
      : 'content/build/livres/commun.json absent : relance build_content');
  }
  const livres = {};
  for (const id of commun.__livres.livres) livres[id] = fs.readFileSync(path.join(dir, id + '.json'), 'utf8');
  return { entier, communTexte, commun, livres };
}

/// Avant d'embarquer : l'inflate de secours de demarrage.js rend chaque bundle à
/// l'octet près, et sa fusion rend, pour chaque livre, le bundle entier restreint
/// à ce livre (ce que packages/core/test/livres_test.dart joue en Dart).
function verifierContenu(c, compresses) {
  const FC = require(path.join(HERE, 'demarrage.js'));
  for (const [nom, { texte, gz }] of Object.entries(compresses)) {
    if (Buffer.compare(Buffer.from(FC._degzip(new Uint8Array(gz))), Buffer.from(texte, 'utf8')) !== 0) {
      throw new Error('demarrage.js : l\'inflate de secours ne rend pas ' + nom);
    }
  }
  if (!c.commun) return;
  const d = c.commun.__livres, stables = new Set(d.stables);
  const plages = (p) => { const o = []; for (let i = 0; i + 1 < p.length; i += 2) for (let k = 0; k < p[i + 1]; k++) o.push(p[i] + k); return o; };
  const lire = (o, ch) => ch.split('.').reduce((x, k) => (x ? x[k] : undefined), o);
  const bouchon = (x) => !!x && ((Array.isArray(x.roles) && x.roles.length === 1 && x.roles[0] === '-') || x.qui === '-');
  for (const post of c.entier.postulats || []) {
    const livre = c.livres[post.id] ? JSON.parse(c.livres[post.id]) : null;
    // le bundle entier restreint au livre : ce que la fusion doit rendre
    const attendu = JSON.parse(JSON.stringify(c.entier));
    for (const chemin of Object.keys(d.listes).concat(d.stables)) {
      const tout = lire(c.entier, chemin);
      if (!Array.isArray(tout)) continue;
      const e = livre && livre.listes[chemin], posL = new Set(e ? plages(e.pos) : []);
      let l;
      if (stables.has(chemin)) {
        const cl = lire(c.commun, chemin);
        l = tout.map((x, i) => (bouchon(cl[i]) && !posL.has(i) ? cl[i] : x));
      } else {
        const garde = new Set(plages(d.listes[chemin] || []).concat([...posL]));
        l = tout.filter((x, i) => garde.has(i));
      }
      const ks = chemin.split('.');
      ks.slice(0, -1).reduce((x, k) => x[k], attendu)[ks[ks.length - 1]] = l;
    }
    if (JSON.stringify(FC._fusionner(c.commun, livre)) !== JSON.stringify(attendu)) {
      throw new Error('demarrage.js : la fusion du livre ' + post.id + ' ne rend pas le bundle entier restreint à ce livre');
    }
  }
}

/// Le bloc du contenu (__CONTENU__) : les bundles compressés, où les trouver, et
/// demarrage.js. Le fichier seul les embarque tous (base64). Avec --ville, ce sont
/// des fichiers à côté de la page, et le moteur aussi (`moteurUrl`) : le commun
/// (`communUrl`, rendu avec le bloc), demandé dès la tête de la page (teteHtml),
/// arrive pendant que la page se lit, sans le tiers de plus du base64 ; les livres
/// et le moteur, l'accueil ne les attend pas. Chaque fichier est nommé par
/// l'empreinte de ses octets : un nom ne désigne jamais deux contenus (le cache du
/// navigateur et celui du service worker peuvent le garder sans demander).
const OPTS_CONTENU = { json: false };
function contenuHtml(c, versDossier, moteurUrl) {
  const zlib = require('zlib');
  const gz = (t) => zlib.gzipSync(Buffer.from(t, 'utf8'), { level: 9 });
  const empreinte = (x) => require('crypto').createHash('sha1').update(x).digest('hex').slice(0, 10);
  const compresses = { commun: { texte: c.communTexte, gz: gz(c.communTexte) } };
  for (const [id, t] of Object.entries(c.livres)) compresses[id] = { texte: t, gz: gz(t) };
  verifierContenu(c, compresses);
  const sources = { commun: { el: 'fusible-commun' }, livres: {} };
  const blocs = [];
  let communUrl = null;
  if (versDossier) {
    communUrl = OPTS_CONTENU.json ? 'contenu/commun.' + empreinte(compresses.commun.texte) + '.json' : 'contenu/commun.' + empreinte(compresses.commun.gz) + '.gz';
    fs.mkdirSync(path.join(versDossier, 'contenu'), { recursive: true });
    fs.writeFileSync(path.join(versDossier, communUrl), OPTS_CONTENU.json ? compresses.commun.texte : compresses.commun.gz);
    sources.commun = { url: communUrl };
  } else {
    blocs.push('<script id="fusible-commun" type="application/octet-stream">' + compresses.commun.gz.toString('base64') + '</script>');
  }
  let octetsLivres = 0;
  for (const id of Object.keys(c.livres)) {
    const z = compresses[id].gz;
    octetsLivres += z.length;
    if (versDossier) {
      const nom = OPTS_CONTENU.json ? 'contenu/' + id + '.' + empreinte(compresses[id].texte) + '.json' : 'contenu/' + id + '.' + empreinte(z) + '.gz';
      fs.mkdirSync(path.join(versDossier, 'contenu'), { recursive: true });
      fs.writeFileSync(path.join(versDossier, nom), OPTS_CONTENU.json ? compresses[id].texte : z);
      sources.livres[id] = { url: nom };
    } else {
      blocs.push('<script id="fusible-livre-' + id + '" type="application/octet-stream">' + z.toString('base64') + '</script>');
      sources.livres[id] = { el: 'fusible-livre-' + id };
    }
  }
  if (versDossier) sources.sw = 'sw.js';
  if (moteurUrl) sources.moteur = moteurUrl;
  blocs.push('<script>window.FUSIBLE_CONTENU = ' + JSON.stringify(sources) + ';</script>');
  blocs.push('<script>' + fs.readFileSync(path.join(HERE, 'demarrage.js'), 'utf8').split('</script').join('<\\/script') + '</script>');
  console.log('le contenu : commun ' + Math.round(c.communTexte.length / 1024) + ' Ko → ' + Math.round(compresses.commun.gz.length / 1024) +
    ' Ko gzip (' + (versDossier ? communUrl : 'embarqué en base64') + ') ; ' + Object.keys(c.livres).length + ' livres, ' + Math.round(octetsLivres / 1024) + ' Ko gzip' +
    (versDossier ? ' (à côté de la page, contenu/)' : ' (embarqués)'));
  return { html: blocs.join('\n'), communUrl, livresUrls: Object.values(sources.livres).map((s) => s.url).filter(Boolean) };
}

/// LA MUSIQUE ENREGISTRÉE (packages/tools/web/musique/audio/, écrite par musique_audio.js) : chaque thème
/// rendu par le studio, en MP3 par blocs, et le manifeste que le lecteur d'audio.js lit. Avec --ville, les
/// MP3 sont posés à côté de la page (musique/<clé>.<bloc>.<empreinte>.mp3 : un nom ne désigne jamais deux
/// fichiers, le service worker les garde d'une version à l'autre) et le manifeste, adresses comprises, est
/// passé à `FusibleAudio.enregistrements` dans la page. Le fichier seul n'en prend rien : la synthèse y
/// joue chaque thème (le dire, avec ce qu'il pèserait sinon).
function musiqueEnregistree(versDossier) {
  const src = path.join(HERE, 'musique', 'audio'), manPath = path.join(src, 'manifeste.json');
  if (versDossier) fs.rmSync(path.join(versDossier, 'musique'), { recursive: true, force: true });
  if (!fs.existsSync(manPath)) return { script: '', urls: [] };
  const man = JSON.parse(fs.readFileSync(manPath, 'utf8'));
  const empreinte = (b) => require('crypto').createHash('sha1').update(b).digest('hex').slice(0, 10);
  const urls = [];
  let octets = 0, plusGros = 0;
  if (versDossier) fs.mkdirSync(path.join(versDossier, 'musique'), { recursive: true });
  for (const t of Object.values(man.themes || {})) {
    for (const b of t.blocs) {
      const f = path.join(src, b.fichier);
      if (!fs.existsSync(f)) throw new Error('musique/audio/' + b.fichier + ' absent (le manifeste le cite : relance musique_audio.js)');
      const data = fs.readFileSync(f);
      octets += data.length; plusGros = Math.max(plusGros, data.length);
      if (versDossier) {
        const nom = 'musique/' + b.fichier.replace(/\.mp3$/, '') + '.' + empreinte(data) + '.mp3';
        fs.writeFileSync(path.join(versDossier, nom), data);
        b.fichier = nom;
        urls.push(nom);
      }
    }
  }
  const n = Object.keys(man.themes || {}).length;
  if (!versDossier) {
    console.log('la musique enregistrée : ' + n + ' thèmes (' + (octets / 1e6).toFixed(1) + ' Mo de MP3) ne sont pas dans le fichier seul — ils y pèseraient ' +
      (octets * 4 / 3 / 1e6).toFixed(0) + ' Mo en base64 : la synthèse y joue chaque thème');
    return { script: '', urls: [] };
  }
  console.log('la musique enregistrée : ' + n + ' thèmes, ' + urls.length + ' fichiers, ' + (octets / 1e6).toFixed(1) + ' Mo (le plus gros ' + (plusGros / 1e6).toFixed(2) + ' Mo) → musique/');
  return { script: '\n;FusibleAudio.enregistrements(' + JSON.stringify(man) + ');', urls };
}

/// L'APPLICATION ET LE PARTAGE (--ville) : le manifeste, les icônes, le service
/// worker, l'aperçu d'un lien (Open Graph, Twitter). Les images viennent de
/// packages/tools/web/pwa/ (pwa/genere.js les tire de l'accueil).
const TITRE_PARTAGE = 'Fusible — une carrière de football à Aubérive';
const DESCRIPTION = 'Aubérive, 1990 → 2050. Dix histoires, une ville en pixel art, des cartes qu\'on glisse à gauche ou à droite — et des fins qu\'on n\'avoue pas.';
function teteHtml(communUrl) {
  const a = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  return [
    // le contenu commun part dès la première ligne lue : il arrive pendant que la page se
    // lit (demarrage.js reprend cette promesse) ; une erreur est la sienne, pas celle de la page
    '<script>window.FUSIBLE_COMMUN = window.fetch ? window.fetch(' + JSON.stringify(communUrl) + ') : null; if (window.FUSIBLE_COMMUN) window.FUSIBLE_COMMUN.catch(function () {});</script>',
    '<meta name="description" content="' + a(DESCRIPTION) + '">',
    '<link rel="manifest" href="manifest.webmanifest">',
    '<link rel="icon" type="image/png" sizes="48x48" href="icones/icone-48.png">',
    '<link rel="icon" type="image/png" sizes="192x192" href="icones/icone-192.png">',
    '<link rel="apple-touch-icon" href="icones/apple-touch-icon.png">',
    '<meta name="mobile-web-app-capable" content="yes">',
    '<meta name="apple-mobile-web-app-capable" content="yes">',
    '<meta name="apple-mobile-web-app-title" content="Fusible">',
    '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">',
    '<meta property="og:type" content="website">',
    '<meta property="og:locale" content="fr_FR">',
    '<meta property="og:site_name" content="Fusible">',
    '<meta property="og:title" content="' + a(TITRE_PARTAGE) + '">',
    '<meta property="og:description" content="' + a(DESCRIPTION) + '">',
    '<meta property="og:image" content="apercu.jpg">',
    '<meta property="og:image:type" content="image/jpeg">',
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta property="og:image:alt" content="Aubérive au crépuscule, et le titre FUSIBLE posé au pixel">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="' + a(TITRE_PARTAGE) + '">',
    '<meta name="twitter:description" content="' + a(DESCRIPTION) + '">',
    '<meta name="twitter:image" content="apercu.jpg">',
  ].join('\n');
}
function ecrirePwa(dossier, version, depart, livres, musique) {
  const pwa = path.join(HERE, 'pwa');
  fs.mkdirSync(path.join(dossier, 'icones'), { recursive: true });
  for (const f of ['icone-48.png', 'icone-192.png', 'icone-512.png', 'icone-masquable-512.png', 'apple-touch-icon.png']) {
    fs.copyFileSync(path.join(pwa, f), path.join(dossier, 'icones', f));
  }
  fs.copyFileSync(path.join(pwa, 'apercu.jpg'), path.join(dossier, 'apercu.jpg'));
  const manifeste = {
    name: 'Fusible', short_name: 'Fusible', description: DESCRIPTION, lang: 'fr', dir: 'ltr',
    start_url: './', scope: './', display: 'standalone', orientation: 'portrait',
    // l'encre de prune de l'accueil (preview_template.html, --a-fond)
    background_color: '#120E1C', theme_color: '#120E1C',
    icons: [
      { src: 'icones/icone-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: 'icones/icone-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: 'icones/icone-masquable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
  fs.writeFileSync(path.join(dossier, 'manifest.webmanifest'), JSON.stringify(manifeste, null, 2) + '\n');
  const sw = fs.readFileSync(path.join(HERE, 'sw.js'), 'utf8').split('__VERSION__').join(version)
    .split('__DEPART__').join(JSON.stringify(depart)).split('__LIVRES__').join(JSON.stringify(livres))
    .split('__MUSIQUE__').join(JSON.stringify(musique || []));
  fs.writeFileSync(path.join(dossier, 'sw.js'), sw);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  OPTS_CONTENU.json = !!opts.contenuJson;
  const tplPath = path.join(HERE, 'preview_template.html');
  const artPath = path.join(HERE, 'art.js');
  const musique = require(path.join(HERE, 'musique_sources.js'));
  // la version jouable se sert en HTTP : le contenu des livres, les images de l'accueil
  // et l'application (manifeste, icônes, service worker) sont des fichiers à côté de la page
  const dossier = opts.ville ? path.dirname(path.resolve(opts.out)) : null;
  if (dossier) fs.mkdirSync(dossier, { recursive: true });

  let tpl = fs.readFileSync(tplPath, 'utf8');
  {
    const repere = '/*__PREVIEW_MODULES__*/';
    if (tpl.indexOf(repere) < 0) throw new Error('gabarit : repère /*__PREVIEW_MODULES__*/ absent');
    // il est remplacé partout : cité dans un commentaire, il y collerait les modules (SyntaxError au chargement)
    if (tpl.split(repere).length !== 2) throw new Error('gabarit : le repère /*__PREVIEW_MODULES__*/ ne doit apparaître qu\'une fois');
    const corps = tpl.slice(tpl.lastIndexOf('(function () {'));
    const vus = new Map([...declares(corps)].map((n) => [n, 'preview_template.html']));
    const srcs = PREVIEW_MODULES.map((f) => {
      const src = fs.readFileSync(path.join(HERE, f), 'utf8');
      for (const n of declares(src)) {
        if (vus.has(n)) throw new Error(`${f} redéclare « ${n} », déjà déclaré par ${vus.get(n)}`);
        vus.set(n, f);
      }
      return src;
    });
    // Le repère se lit aussi dans un commentaire du gabarit (les crochets, plus haut) : seul le dernier est le
    // bon. Un `split/join` posait les modules dans la ligne de commentaire, et leur fin devenait du code.
    const iRepere = tpl.lastIndexOf(repere);
    tpl = tpl.slice(0, iRepere) + srcs.join('\n').split('</script').join('<\\/script') + tpl.slice(iRepere + repere.length);
  }
  const engine = fs.readFileSync(opts.engine, 'utf8');
  const art = fs.readFileSync(artPath, 'utf8');
  // audio.js et les thèmes (une faute de syntaxe dans un thème arrête l'assemblage ici) ; avec --ville, le
  // manifeste de la musique enregistrée à leur suite (ses MP3 à côté de la page)
  const enregistree = musiqueEnregistree(dossier);
  const audio = musique.texte() + enregistree.script;
  console.log('la musique : ' + musique.fichiers().map((f) => f.nom.replace(/\.js$/, '')).join(', ') + ' (musique/*.js)');
  const contenu = chargerContenu(opts);
  const bundle = contenu.entier;
  // une histoire livrée sans vignette prend celle du promu : on le dit
  const vignettes = new Set(fs.existsSync(path.join(HERE, 'accueil'))
    ? fs.readdirSync(path.join(HERE, 'accueil')).map((f) => (/^couv_([a-z0-9_]+)\.webp$/.exec(f) || [])[1]).filter(Boolean) : []);
  for (const p of bundle.postulats || []) {
    if (!p.chantier && !vignettes.has(p.id)) {
      console.warn(`accueil : le postulat ${p.id} n'a pas de vignette (docs/design/pixel_iso/accueil.js, VIGNETTES)`);
    }
  }

  const PLACEHOLDERS = ['__CONTENU__', '__TETE__', '__ENGINE_JS__', '__ART_JS__', '__AUDIO_JS__', '__CINEMA__', '__ACCUEIL_JS__', '__FONTS_CSS__', '__VILLE_CSS__', '__VILLE_JS__'];
  for (const p of PLACEHOLDERS) {
    if (tpl.indexOf(p) < 0) throw new Error('placeholder absent du gabarit : ' + p);
  }

  // Jamais de fermeture prématurée du <script> par les scripts (le contenu est en base64).
  const safeEngine = engine.split('</script').join('<\\/script');
  const safeArt = art.split('</script').join('<\\/script');
  const safeAudio = audio.split('</script').join('<\\/script');

  // le moteur : embarqué dans le fichier seul ; à côté de la page avec --ville, nommé par
  // son empreinte (le service worker le garde tant qu'il ne change pas)
  let moteurUrl = null;
  if (dossier) {
    moteurUrl = 'contenu/moteur.' + require('crypto').createHash('sha1').update(engine).digest('hex').slice(0, 10) + '.js';
    // contenu/ n'est qu'à nous : les livres et le moteur d'une version précédente s'en vont
    fs.rmSync(path.join(dossier, 'contenu'), { recursive: true, force: true });
    fs.mkdirSync(path.join(dossier, 'contenu'), { recursive: true });
    fs.writeFileSync(path.join(dossier, moteurUrl), engine);
  }
  const blocContenu = contenuHtml(contenu, dossier, moteurUrl);
  const communUrl = blocContenu.communUrl;
  tpl = tpl.split('__CONTENU__').join(blocContenu.html);
  tpl = tpl.split('__TETE__').join(dossier ? teteHtml(communUrl) : '');
  tpl = tpl.split('__ENGINE_JS__').join(dossier ? '/* le moteur : ' + moteurUrl + ' (demarrage.js le charge) */' : safeEngine);
  tpl = tpl.split('__ART_JS__').join(safeArt);
  tpl = tpl.split('__AUDIO_JS__').join(safeAudio);
  const blocCinema = cinemaHtml(cinemaSources(), dossier, bundle);
  tpl = tpl.split('__CINEMA__').join(blocCinema.html);
  tpl = tpl.split('__FONTS_CSS__').join(fontsCss());
  tpl = tpl.split('__ACCUEIL_JS__').join(accueilJs(dossier));
  // LA VILLE : la feuille et la couche, ou rien.
  let villeCss = '', villeJs = '';
  if (opts.ville) {
    villeCss = '<style>\n' + fs.readFileSync(path.join(HERE, 'ville.css'), 'utf8') + '\n</style>';
    // les modules de la ville (intérieurs, scènes, jeux) entrent dans sa fermeture, au repère
    let villeSrc = fs.readFileSync(path.join(HERE, 'ville.js'), 'utf8');
    // un module partage la fermeture : il ne redéclare jamais un nom de la ville ou d'un autre
    // module (une `function lancer` y remplacerait celle qui démarre la ville, en silence)
    const vus = new Map([...declares(villeSrc)].map((n) => [n, 'ville.js']));
    for (const n of PORTES_DES_FILMS) {
      if (!new RegExp('\\bfunction ' + n + '\\b').test(fs.readFileSync(path.join(HERE, 'ville_cinema.js'), 'utf8'))) {
        throw new Error('ville_film.js enveloppe « ' + n + ' », que ville_cinema.js ne déclare plus');
      }
    }
    for (const f of VILLE_MODULES) {
      for (const n of declares(fs.readFileSync(path.join(HERE, f), 'utf8'))) {
        if (vus.has(n)) throw new Error(`${f} redéclare « ${n} », déjà déclaré par ${vus.get(n)}`);
        vus.set(n, f);
      }
    }
    const modules = VILLE_MODULES.map((f) => fs.readFileSync(path.join(HERE, f), 'utf8')).join('\n');
    if (villeSrc.indexOf('/*__VILLE_MODULES__*/') < 0) throw new Error('ville.js : repère /*__VILLE_MODULES__*/ absent');
    villeSrc = villeSrc.split('/*__VILLE_MODULES__*/').join(modules);
    villeJs = villeSrc.split('</script').join('<\\/script');
  }
  // la version jouable porte son nom dans l'onglet
  if (opts.ville) tpl = tpl.replace('<title>Fusible</title>', '<title>Fusible à Aubérive</title>');
  tpl = tpl.split('__VILLE_CSS__').join(villeCss);
  tpl = tpl.split('__VILLE_JS__').join(villeJs);

  const left = PLACEHOLDERS.filter((p) => tpl.indexOf(p) >= 0);
  if (left.length) throw new Error('placeholder(s) toujours présent(s) après assemblage : ' + left.join(', '));

  fs.mkdirSync(path.dirname(opts.out), { recursive: true });
  fs.writeFileSync(opts.out, tpl);
  console.log('assemblé : ' + opts.out + ' (' + Buffer.byteLength(tpl, 'utf8') + ' octets)');
  if (opts.ville) {
    // les images de la ville, à côté de la page (chemins relatifs : ville/…)
    const dest = path.join(path.dirname(opts.out), 'ville');
    fs.mkdirSync(dest, { recursive: true });
    let n = 0, octets = 0;
    for (const f of fs.readdirSync(opts.ville).sort()) {
      if (!/\.(webp|png|json)$/.test(f)) continue;
      fs.copyFileSync(path.join(opts.ville, f), path.join(dest, f));
      n++; octets += fs.statSync(path.join(dest, f)).size;
    }
    if (!n) throw new Error('--ville : aucune image dans ' + opts.ville);
    // les intérieurs (docs/design/pixel_iso/interieurs_jeu.js), commités à côté de ce script
    const intDir = path.join(HERE, 'interieurs');
    if (fs.existsSync(intDir)) {
      for (const f of fs.readdirSync(intDir).sort()) {
        if (!/\.(webp|json)$/.test(f)) continue;
        fs.copyFileSync(path.join(intDir, f), path.join(dest, f));
        n++; octets += fs.statSync(path.join(dest, f)).size;
      }
    }
    console.log('la ville : ' + n + ' fichiers (' + Math.round(octets / 1024) + ' Ko) → ' + dest);
    // l'application : de quoi rouvrir l'accueil et entrer en ville hors ligne ; le reste
    // (les tuiles, les livres) entre au cache quand on le voit. Une version par page.
    const page = path.basename(opts.out);
    const depart = [page, communUrl, moteurUrl]
      .concat(fs.readdirSync(path.join(dossier, 'accueil')).sort().map((f) => 'accueil/' + f))
      .concat(['lieux.json', 'grille.json', 'sprites.json', 'interieurs.json'].filter((f) => fs.existsSync(path.join(dest, f))).map((f) => 'ville/' + f))
      .concat(fs.readdirSync(dest).filter((f) => /^brume_.*\.webp$/.test(f)).sort().map((f) => 'ville/' + f));
    const version = require('crypto').createHash('sha1').update(tpl).update(JSON.stringify(depart)).update(fs.readFileSync(path.join(HERE, 'sw.js'))).digest('hex').slice(0, 12);
    ecrirePwa(dossier, version, depart, blocContenu.livresUrls.concat(blocCinema.urls), enregistree.urls);
    console.log('l\'application : manifeste, icônes, aperçu, sw.js (version ' + version + ', ' + depart.length + ' fichiers au départ)');
  }
}

try {
  main();
} catch (e) {
  console.error('assemble.js : ' + (e && e.message ? e.message : e));
  process.exit(1);
}
