// LA DURÉE D'UNE PARTIE, livre par livre : ce que le moteur fait lire (carrieres.json) + ce que la
// ville impose (saison_*.json, le joueur pressé), avec un lecteur humain explicite.
// Voir docs/balance/duree_partie.md. Depuis la racine du dépôt :
//   node packages/tools/web/duree.js carrieres.json saison_0.json [saison_3.json …]
const fs = require('fs');
const R = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const B = process.argv.slice(3).map(f => JSON.parse(fs.readFileSync(f, 'utf8')));
const CT = JSON.parse(fs.readFileSync('content/build/content.json', 'utf8'));
const P = CT.postulats;
const q = (a, p) => { const s = a.slice().sort((x, y) => x - y); return s[Math.round(p * (s.length - 1))]; };
const moy = a => a.reduce((x, y) => x + y, 0) / Math.max(1, a.length);
const somme = a => a.reduce((x, y) => x + y, 0);

// le type d'une scène jouée ; une suite prend le type de la scène qui l'appelle
const CI = {}, PARENT = {};
for (const c of CT.ville.cinematiques) { CI[c.id] = c; if (c.suite) PARENT[c.suite] = c.id; }
const typeDe = id => { let c = CI[id], k = 0; while (c && c.quand === 'suite' && PARENT[c.id] && k++ < 9) c = CI[PARENT[c.id]]; return c ? c.quand : '?'; };
const deVille = id => ['lieu', 'semaine'].includes(typeDe(id));

// ── la ville, mesurée par saison (le joueur pressé ne lit pas : il clique dès que le texte est écrit)
const villes = B.map(b => b.saisons[0]).filter(Boolean);
const M = villes.map(s => {
  const lignes = s.lignes, tc = s.tempsCine || {};
  const lv = lignes.filter(l => deVille(l.ci)), ids = Object.keys(tc);
  return {
    semaines: s.semaines, cartes: s.cartes.length,
    trajet: (s.temps.trajet || 0) / 1000, fondu: ((s.temps.fondu || 0) + (s.temps.attente || 0)) / 1000,
    matchs: s.matchs.length, tMatch: somme(s.matchs) / 1000,
    scenes: s.scenes.length, sceneChars: somme(s.scenes.map(x => x.n + (x.reponse || 0))), sceneChoix: somme(s.scenes.map(x => x.choix ? 1 : 0)),
    lignes: lignes.length, frappe: somme(lignes.map(l => l.frappe)) / 1000, chars: somme(lignes.map(l => l.n)),
    tCine: somme(Object.values(tc)) / 1000,
    // les scènes propres à la ville (en entrant, les événements de la semaine)
    vLignes: lv.length, vChars: somme(lv.map(l => l.n)), vFrappe: somme(lv.map(l => l.frappe)) / 1000,
    vTemps: somme(ids.filter(deVille).map(i => tc[i])) / 1000, vScenes: ids.filter(deVille).length,
    cines: ids.map(i => i + ':' + typeDe(i)),
  };
});
const totalM = k => somme(M.map(m => m[k]));
const trajetParCarte = totalM('trajet') / totalM('cartes'), fonduParCarte = totalM('fondu') / totalM('cartes');
const parMatch = totalM('tMatch') / Math.max(1, totalM('matchs'));
const frappeParCar = totalM('frappe') / totalM('chars');
const horsFrappeParLigne = (totalM('tCine') - totalM('frappe')) / totalM('lignes');
const parSaison = k => totalM(k) / M.length;

const LECTEURS = {
  rapide: { cps: 27, choix: 2, regard: 4 },   // ~280 mots/min, décide vite
  moyen: { cps: 21, choix: 3, regard: 6 },    // ~220 mots/min
  lent: { cps: 16, choix: 5, regard: 9 },     // ~170 mots/min, savoure
};
const lire = (chars, frappe, L) => Math.max(chars / L.cps, frappe);
// la durée d'une carrière décrite par ses comptes (une carrière, ou la médiane d'un livre)
function duree(x, L) {
  const tCartes = x.chars / L.cps + x.choix * L.choix + x.classements * L.regard;
  const tCine = lire(x.ciChars, x.ciChars * frappeParCar, L) + x.ciLignes * (horsFrappeParLigne + 0.4);
  const tVille = x.cartes * (trajetParCarte + fonduParCarte) + x.matchs * parMatch
    + x.saisons * (parSaison('sceneChars') / L.cps + parSaison('sceneChoix') * L.choix)
    + x.saisons * (lire(parSaison('vChars'), parSaison('vFrappe'), L) + (parSaison('vTemps') - parSaison('vFrappe')) + parSaison('vLignes') * 0.4);
  return { min: Math.round((tCartes + tCine + tVille) / 60), cartes: Math.round(tCartes / 60), cine: Math.round(tCine / 60), ville: Math.round(tVille / 60) };
}
const comptes = c => ({ cartes: c.cards, chars: c.chars, choix: c.choix, saisons: c.seasons, classements: c.kinds.classement || 0, matchs: c.kinds.match || 0, ciLignes: c.ciLignes, ciChars: c.ciChars });
const out = [];
for (const k of Object.keys(R)) {
  const C = R[k], p = P[k];
  const med = f => q(C.map(f), 0.5);
  const x = { cartes: med(c => c.cards), chars: med(c => c.chars), choix: med(c => c.choix), saisons: moy(C.map(c => c.seasons)),
    classements: moy(C.map(c => c.kinds.classement || 0)), matchs: moy(C.map(c => c.kinds.match || 0)), ciLignes: med(c => c.ciLignes), ciChars: med(c => c.ciChars) };
  // chaque carrière a sa durée ; on en prend la médiane (et la carrière médiane pour le détail)
  const L0 = {};
  for (const [nom, L] of Object.entries(LECTEURS)) {
    const d = C.map(c => duree(comptes(c), L)).sort((a, b) => a.min - b.min);
    L0[nom] = d[Math.round(0.5 * (d.length - 1))];
  }
  // la carrière longue : le 90e centile des durées, lecteur moyen
  const longues = C.map(c => duree(comptes(c), LECTEURS.moyen).min);
  const sp = C.map(c => c.seasons).sort((a, b) => a - b);
  out.push({ livre: +k + 1, titre: p.title, role: p.role, annee: p.year, cartes: x.cartes, p10: q(C.map(c => c.cards), 0.1), p90: q(C.map(c => c.cards), 0.9),
    saisons: +x.saisons.toFixed(1), saisonsP90: sp[Math.round(0.9 * (sp.length - 1))], semaines: Math.round(x.saisons * parSaison('semaines')), ciLignes: x.ciLignes,
    p90min: q(longues, 0.9), debord: Math.round(100 * C.filter(c => c.seasons > Math.round(x.saisons) + 1).length / C.length), ...L0 });
}
console.log('mesures de la ville :', JSON.stringify(M.map(m => ({ ...m, cines: m.cines.length })), null, 0));
console.log('par carte : marche ' + trajetParCarte.toFixed(1) + ' s, fondus ' + fonduParCarte.toFixed(1) + ' s · match mis en scène ' + parMatch.toFixed(0) + ' s · frappe ' + (1 / frappeParCar).toFixed(0) + ' car/s · mise en scène hors frappe ' + horsFrappeParLigne.toFixed(1) + ' s/réplique');
for (const o of out) console.log(`livre ${o.livre} ${o.titre.padEnd(22)} ${o.cartes} cartes (${o.p10}-${o.p90}) · ${o.saisons} saisons ≈ ${o.semaines} sem. · rapide ${o.rapide.min} · moyen ${o.moyen.min} (cartes ${o.moyen.cartes}, scènes ${o.moyen.cine}, ville ${o.moyen.ville}) · lent ${o.lent.min} min · P90 ${o.p90min} min (${o.saisonsP90} saisons) · débordent ${o.debord} %`);
fs.writeFileSync(require('path').join(require('path').dirname(process.argv[2]), 'durees.json'), JSON.stringify({ out, M, trajetParCarte, fonduParCarte, parMatch, frappeParCar, horsFrappeParLigne }));
