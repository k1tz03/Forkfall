#!/usr/bin/env node
// LES ÉCHOS — le banc du module de l'aperçu (preview_echos.js) : le vrai moteur compilé, le vrai
// contenu, le module dans un bac à sable (aucun navigateur). Il vérifie les contrats de la logique
// et des textes, puis rejoue des carrières et compte les lignes (« Gégé s'en souviendra. ») et les
// rubans (« ↩ Parce que tu as dit … ») par quart d'heure de jeu.
//
//   dart compile js -O2 packages/tools/web/preview.dart -o /tmp/engine.js
//   node packages/tools/web/mesure_echos.js --engine /tmp/engine.js [--livres 0,3,9] [--carrieres 12]
//        [--reglages "seuils=4,3,3;ecartRuban=3"] [--assert] [--trace 0:4242]
//
// Un quart d'heure = 14 réponses : docs/balance/duree_partie.md compte ~109 cartes pour ~2 h. Le
// rythme est ce qui fait que ça reste spécial : une poignée de lignes (≈ 3) et un ou deux rubans par
// quart d'heure ; `--assert` fait échouer le banc quand le contenu change au point de sortir des
// bornes (à relancer après chaque lot de cartes ou de drapeaux). Les réglages sont ceux de
// ECHOS_REGLAGES, en tête du module.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ICI = __dirname, RACINE = path.resolve(ICI, '..', '..', '..');
const arg = (nom, defaut) => { const i = process.argv.indexOf('--' + nom); return i < 0 ? defaut : (process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : true); };
const MOTEUR = arg('engine', null);
if (!MOTEUR) { console.error('usage : node mesure_echos.js --engine <engine.js> [--livres 0,3] [--carrieres 12] [--reglages "k=v;…"] [--assert] [--trace livre:graine]'); process.exit(2); }
const LIVRES = (arg('livres', '0,1,2,3,4,5,6,7,8,9') + '').split(',').map(Number);
const CARRIERES = +arg('carrieres', 12), PLAFOND = +arg('plafond', 900), FENETRE = 14;
const BORNES = { lignes: [2, 5], rubans: [0.8, 2.5] };      // par quart d'heure, tous livres confondus

// ─── le moteur, sans navigateur ───────────────────────────────────────────────
const json = fs.readFileSync(arg('content', path.join(RACINE, 'app', 'assets', 'content.json')), 'utf8');
const ctxMoteur = vm.createContext({ console, setTimeout, clearTimeout });
ctxMoteur.self = ctxMoteur.window = ctxMoteur.globalThis = ctxMoteur;
new vm.Script(fs.readFileSync(MOTEUR, 'utf8'), { filename: 'engine.js' }).runInContext(ctxMoteur);
const meta = JSON.parse(ctxMoteur.fusibleLoad(json)), content = JSON.parse(json);
const demarrer = (graine, livre) => JSON.parse(ctxMoteur.fusibleStart(graine, livre, '', '', '', '', ''));
const choisir = (droite) => JSON.parse(ctxMoteur.fusibleChoose(!!droite));

// ─── le module, dans la fermeture qu'il attend (preview_template.html) ────────
const CHARS = {};
content.characters.forEach((c) => { CHARS[c.id] = c; });
const crochets = {}, stock = {}, fenetre = {};
const familyName = (nom) => { const p = String(nom || '').trim().split(/\s+/); return p.length < 2 || /^(Madame|Monsieur|Doc|La|Le|Les)$/.test(p[0]) ? p.join(' ') : p.slice(1).join(' '); };
const localStorage = { getItem: (k) => (k in stock ? stock[k] : null), setItem: (k, v) => { stock[k] = String(v); }, removeItem: (k) => { delete stock[k]; } };
const source = fs.readFileSync(path.join(ICI, 'preview_echos.js'), 'utf8');
const entete = 'var view = null, currentSeed = 0, currentPostulat = 0;\n';
const pied = '\n;return { set: function (v, s, p) { view = v; currentSeed = s; currentPostulat = p; }, x: { echosEval: echosEval, echosCauses: echosCauses, echosNom: echosNom, echosDiff: echosDiff, echosDire: echosDire, echosNeuf: echosNeuf, echosEcrire: echosEcrire, echosLire: echosLire, echosCle: echosCle, setEchos: function (e) { echos = e; }, PAROLES: ECHOS_PAROLES } };';
const aucun = () => 0;
const module_ = new Function('content', 'CHARS', 'postulats', 'familyName', 'crochet', 'VILLE', 'elGame', 'anyPanelOpen', 'document', 'window', 'localStorage', 'setTimeout', 'clearTimeout',
  entete + source + pied)(content, CHARS, meta.postulats, familyName, (nom, fn) => { (crochets[nom] = crochets[nom] || []).push(fn); }, null, { hidden: false }, () => false, undefined, fenetre, localStorage, aucun, aucun);
const E = fenetre.FusibleEchos, X = module_.x;
const tirer = (nom, a) => (crochets[nom] || []).forEach((fn) => fn(a));
(arg('reglages', '') + '').split(';').filter(Boolean).forEach((kv) => { const [k, v] = kv.split('='); E.reglages[k] = v.indexOf(',') >= 0 ? v.split(',').map(Number) : +v; });

// ─── 1. les contrats de la logique et des textes ──────────────────────────────
let echecs = 0;
const verifier = (nom, f) => { try { f(); console.log('  ok    ' + nom); } catch (e) { echecs++; console.log('  ÉCHEC ' + nom + '\n        ' + String(e.message).split('\n')[0]); } };
const lit = (x) => ['lit', x], flag = (f) => ['call', 'flag', [lit(f)]];
const vue = (o) => Object.assign({ flags: [], relations: {}, gauges: [], vars: {}, statuts: {}, cast: [], year: 1991, turn: 40, season: 2, phase: 'aller', card: { id: 'x', speaker: 'gege' } }, o || {});
const memoire = (f) => { const e = X.echosNeuf(); Object.assign(e.o.f, f || {}); X.setEchos(e); return e; };
const origine = (tour, libelle, sens) => [tour, 'c' + tour, libelle, 1990, sens];
console.log('les contrats');
verifier('condition : le faux l\'emporte sur l\'inconnu, la saison de la vue compte à partir de un', () => {
  const v = vue({ flags: ['a'] });
  assert.strictEqual(X.echosEval(['and', flag('b'), ['path', 'pression']], v, v.card), false);
  assert.strictEqual(X.echosEval(['or', flag('b'), ['path', 'pression']], v, v.card), undefined);
  assert.strictEqual(X.echosEval(['cmp', '==', ['path', 'season'], lit(1)], v, v.card), true);
});
verifier('causes : un « et » rend ce que le joueur a posé', () => {
  const v = vue({ flags: ['a'] }); memoire({ a: origine(5, 'Je signe', 1) });
  assert.deepStrictEqual(X.echosCauses(['and', ['cmp', '>=', ['path', 'season'], lit(1)], flag('a')], true, v, v.card).map((x) => x.id), ['a']);
});
verifier('causes : un « ou » que d\'autres raisons rendent vrai ne dit rien (mieux vaut se taire que mentir)', () => {
  const v = vue({ flags: ['a', 'b'] }); memoire({ a: origine(5, 'Je signe', 1) });         // b est un drapeau de départ
  assert.strictEqual(X.echosCauses(['or', flag('a'), flag('b')], true, v, v.card), null);
});
verifier('causes : un drapeau levé par une réponse explique un « non » ; jamais posé, il n\'explique rien', () => {
  memoire({ x: origine(5, 'Je démens', -1) });
  assert.deepStrictEqual(X.echosCauses(['not', flag('x')], true, vue(), vue().card).map((x) => x.id), ['x']);
  memoire({});
  assert.deepStrictEqual(X.echosCauses(['not', flag('x')], true, vue(), vue().card), []);
});
verifier('noms : le nom de famille, le prénom quand deux visages le partagent, le surnom, un titre', () => {
  assert.strictEqual(X.echosNom('vukic', vue()), 'Vukić');
  assert.strictEqual(X.echosNom('josiane', vue()), 'Madame Josiane');
  assert.strictEqual(X.echosNom('aulard', vue({ cast: ['aulard', 'arnaud_vaubourg'] })), 'Jean-Marie');
  assert.strictEqual(X.echosNom('mado', vue()), 'Mado');
  assert.strictEqual(X.echosNom('vukic', vue({ statuts: { vukic: 'mort' } })), '');
});
verifier('paroles : un point à la fin, aucun chiffre, aucun résidu, la majuscule tombe en milieu de phrase', () => {
  const P = X.PAROLES, noms = ['Gégé', 'Madame Josiane', 'Le docteur Ober', 'La mère de Mbako'];
  const modeles = [];
  ['chaud', 'froid'].forEach((d) => P[d].forEach((l) => { assert.strictEqual(new Set(l).size, l.length); l.forEach((m) => modeles.push([m, true])); }));
  ['revient', 'saura', 'fort', 'ville'].forEach((k) => P[k].forEach((m) => modeles.push([m, false])));
  modeles.forEach(([m, nominal]) => {
    assert.ok(/\.$/.test(m) && !/\d/.test(m), m);
    assert.ok(!/ (à|de|d'|du|des) \{N\}/.test(m), 'contraction : ' + m);
    assert.strictEqual((m.match(/\{N\}/g) || []).length, nominal ? 1 : 0, m);
    (nominal ? noms : ['x']).forEach((n) => { const d = X.echosDire(m, n); assert.ok(!/[{}]/.test(d) && d.length <= 70, d); });
  });
  assert.strictEqual(X.echosDire('Tu viens de gagner {N}.', 'La mère de Mbako'), 'Tu viens de gagner la mère de Mbako.');
});
verifier('mémoire : écrite, relue, bornée, et une valeur illisible ne casse rien', () => {
  X.echosCle(); module_.set(vue(), 777, 3);
  const e = X.echosNeuf(); X.setEchos(e);
  for (let i = 0; i < 300; i++) { e.o.f['f' + i] = origine(i, 'libellé ' + i, 1); e.vu.push('c' + i); }
  X.echosEcrire();
  const j = X.echosLire(X.echosCle());
  assert.ok(Object.keys(j.o.f).length <= 90 && j.vu.length <= 160 && JSON.stringify(j).length < 20000);
  assert.ok(j.o.f.f299 && !j.o.f.f0, 'les plus vieilles origines partent d\'abord');
  localStorage.setItem(X.echosCle(), '{pas du json');
  assert.strictEqual(X.echosLire(X.echosCle()), null);
});

// ─── 2. une carrière lisible (--trace livre:graine) ───────────────────────────
function jouer(livre, graine, rythme, suivre) {
  let v = demarrer(graine, livre); module_.set(v, graine, livre); tirer('debut', v); tirer('carte', v);
  let n = 0, dits = 0;
  const montrer = (v2, a, droite) => {
    const j = E.journal();
    while (dits < j.length) {
      const x = j[dits++];
      if (!suivre) continue;
      if (x.t === 'ligne') console.log(`#${x.tour} LIGNE [${x.seau} ${x.score}] « ${x.texte} »   ← ${x.carte} : « ${droite ? a.card.rightLabel : a.card.leftLabel} »`);
      else console.log(`#${x.tour} RUBAN [${x.type}] ↩ Parce que tu as dit « ${x.libelle} »   (sur ${x.carte} ; la réponse était sur ${x.origine.carte}, tour ${x.origine.tour})`);
    }
  };
  const fenetres = [];
  let lignes = 0, rubans = 0, derL = 0, derR = 0;
  while (!v.over && n < PLAFOND) {
    const avant = v, droite = rythme(n);
    v = choisir(droite); module_.set(v, graine, livre); n++;
    tirer('reponse', { droite, avant, apres: v });
    montrer(v, avant, droite);
    if (v.over) { tirer('fin', v); break; }
    tirer('carte', v);
    montrer(v, avant, droite);
    if (n % FENETRE === 0) { const j = E.journal(); lignes = j.filter((x) => x.t === 'ligne').length; rubans = j.filter((x) => x.t === 'ruban').length; fenetres.push([lignes - derL, rubans - derR]); derL = lignes; derR = rubans; }
  }
  const j = E.journal();
  return { reponses: n, lignes: j.filter((x) => x.t === 'ligne').length, rubans: j.filter((x) => x.t === 'ruban').length, fenetres, journal: j };
}
const trace = arg('trace', null);
if (trace && trace !== true) {
  const [livre, graine] = trace.split(':').map(Number);
  console.log('\nune carrière (livre ' + (livre + 1) + ', graine ' + graine + ')');
  jouer(livre, graine, (n) => ((graine + n * 17 + livre) % 7) < 3.5, true);
}

// ─── 3. le rythme : lignes et rubans par quart d'heure ────────────────────────
const rythmes = [(r) => (n) => ((r * 2654435761 + n * 40503) >>> 7) % 2 === 0, (r) => (n) => ((r * 97 + n * 31) % 10) < 3, (r) => (n) => ((r * 57 + n * 13) % 10) < 7];
const quantile = (a, q) => { if (!a.length) return 0; a = a.slice().sort((x, y) => x - y); return a[Math.min(a.length - 1, Math.floor(a.length * q))]; };
console.log('\nle rythme (réglages ' + JSON.stringify(E.reglages) + ')');
console.log('livre | carrières | réponses | lignes/carrière | rubans/carrière | lignes par quart d\'heure (p10/p50/p90) | rubans par quart d\'heure (p10/p50/p90)');
const tout = { rep: 0, lignes: 0, rubans: 0, fl: [], fr: [], c: 0, seaux: {}, types: {} };
LIVRES.forEach((livre) => {
  const L = { rep: 0, lignes: 0, rubans: 0, fl: [], fr: [] };
  for (let r = 0; r < CARRIERES; r++) {
    const graine = 5000 + r * 7919 + livre * 104729;
    const c = jouer(livre, graine, rythmes[r % rythmes.length](r + livre), false);
    L.rep += c.reponses; L.lignes += c.lignes; L.rubans += c.rubans;
    c.fenetres.forEach((w) => { L.fl.push(w[0]); L.fr.push(w[1]); });
    c.journal.forEach((x) => { if (x.t === 'ligne') tout.seaux[x.seau] = (tout.seaux[x.seau] || 0) + 1; else tout.types[x.type] = (tout.types[x.type] || 0) + 1; });
  }
  const q = (a) => [.1, .5, .9].map((p) => quantile(a, p)).join('/');
  console.log(`${livre + 1} | ${CARRIERES} | ${(L.rep / CARRIERES).toFixed(0)} | ${(L.lignes / CARRIERES).toFixed(1)} | ${(L.rubans / CARRIERES).toFixed(1)} | ${(L.lignes / L.rep * FENETRE).toFixed(2)} (${q(L.fl)}) | ${(L.rubans / L.rep * FENETRE).toFixed(2)} (${q(L.fr)})`);
  tout.rep += L.rep; tout.lignes += L.lignes; tout.rubans += L.rubans; tout.c += CARRIERES; tout.fl = tout.fl.concat(L.fl); tout.fr = tout.fr.concat(L.fr);
});
const lignesQ = tout.lignes / tout.rep * FENETRE, rubansQ = tout.rubans / tout.rep * FENETRE;
console.log(`tous | ${tout.c} | ${(tout.rep / tout.c).toFixed(0)} | ${(tout.lignes / tout.c).toFixed(1)} | ${(tout.rubans / tout.c).toFixed(1)} | ${lignesQ.toFixed(2)} | ${rubansQ.toFixed(2)}`);
console.log('seaux de lignes ' + JSON.stringify(tout.seaux) + ' ; sources de rubans ' + JSON.stringify(tout.types));
if (arg('assert', false)) {
  const ok = lignesQ >= BORNES.lignes[0] && lignesQ <= BORNES.lignes[1] && rubansQ >= BORNES.rubans[0] && rubansQ <= BORNES.rubans[1];
  console.log((ok ? 'ok' : 'ÉCHEC') + ` : ${lignesQ.toFixed(2)} lignes (bornes ${BORNES.lignes}) et ${rubansQ.toFixed(2)} rubans (bornes ${BORNES.rubans}) par quart d'heure`);
  if (!ok) echecs++;
}
process.exit(echecs ? 1 : 0);
