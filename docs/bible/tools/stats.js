// FUSIBLE — statistiques de la bible scénaristique.
// node stats.js [--json]
const fs = require('fs'), path = require('path');
const DIR = '/home/user/Forkfall/docs/bible';
const files = fs.readdirSync(DIR).filter(f => /^\d.*\.md$/.test(f)).sort();
const uniq = (s) => new Set(s);
const all = {};
let corpus = '';
const rows = [];
for (const f of files) {
  const t = fs.readFileSync(path.join(DIR, f), 'utf8');
  corpus += '\n' + t;
  const words = (t.match(/[\p{L}\p{N}][\p{L}\p{N}'’\-]*/gu) || []).length;
  const count = (re) => (t.match(re) || []).length;
  rows.push({
    fichier: f,
    mots: words,
    signes: t.length,
    lignes: t.split('\n').length,
    fiches: count(/^## (?:\d+\.\s+)?[^\n]*\(`[a-z_]+`\)\s*$/gm),
    intrigues: count(/^## INTRIGUE (?!<)/gm),
    scenes: count(/^### SCÈNE (?!<)/gm),
    reactions: uniq(t.match(/\b[a-z]{2}\.re\.[a-z_0-9]+/g) || []).size,
    manchettes: uniq(t.match(/\bune\.[a-z_]+\.[a-z_0-9]+/g) || []).size,
    nouvelles: uniq((t.match(/\bco\.nv\.[0-9]{4}_[a-z_0-9]+/g) || []).concat(t.match(/\bco\.nouvelle\.[a-z_0-9]+/g) || [])).size,
    anecdotes: uniq(t.match(/\bco\.dec\.[a-z_0-9]+/g) || []).size + count(/^### ANECDOTE (?!<)/gm),
    fins: count(/^### FIN (?!<)/gm),
    alarmes: uniq(t.match(/\b[a-z]{2}\.alarme\.[a-z_0-9]+/g) || []).size,
    setpieces: count(/^### SET-PIECE (?!<)/gm) + count(/^### \d+\.\d+ `[a-z_]+`/gm),
    variantes_setpiece: count(/^#### /gm),
  });
}
// Totaux dédupliqués sur le corpus entier (un id compté une seule fois).
const C = (re) => (corpus.match(re) || []).length;
const U = (re) => uniq(corpus.match(re) || []).size;
const total = {
  mots: rows.reduce((a, r) => a + r.mots, 0),
  signes: rows.reduce((a, r) => a + r.signes, 0),
  chapitres: rows.length,
  personnages: C(/^## (?:\d+\.\s+)?[^\n]*\(`[a-z_]+`\)\s*$/gm),
  intrigues: C(/^## INTRIGUE (?!<)/gm),
  scenes: C(/^### SCÈNE (?!<)/gm),
  cartes_id: U(/\b(?:am|jp|en|ds|pr|sl|in|co)\.[a-z_0-9]+\.[a-z_0-9]+/g),
  reactions: U(/\b[a-z]{2}\.re\.[a-z_0-9]+/g),
  manchettes: U(/\bune\.[a-z_]+\.[a-z_0-9]+/g),
  nouvelles_datees: U(/\bco\.nv\.[0-9]{4}_[a-z_0-9]+/g),
  nouvelles_a_cote: U(/\bco\.nouvelle\.[a-z_0-9]+/g),
  anecdotes: U(/\bco\.dec\.[a-z_0-9]+/g) + C(/^### ANECDOTE (?!<)/gm),
  fins: C(/^### FIN (?!<)/gm),
  alarmes: U(/\b[a-z]{2}\.alarme\.[a-z_0-9]+/g),
  setpieces: C(/^### SET-PIECE (?!<)/gm) + C(/^### \d+\.\d+ `[a-z_]+`/gm),
  variantes_setpiece: C(/^#### /gm),
  traces: U(/(?:set|clear):\s*\[[^\]]*\]/g) && (() => { const f = new Set(); for (const m of corpus.match(/(?:set|clear):\s*\[[^\]]*\]/g) || []) for (const x of (m.match(/[a-z][a-z_0-9]{2,}/g) || []).slice(1)) f.add(x); return f.size; })(),
};
total.nouvelles = total.nouvelles_datees + total.nouvelles_a_cote;
if (process.argv.includes('--json')) { console.log(JSON.stringify({ rows, total }, null, 2)); process.exit(0); }
const cols = ['fichier','mots','scenes','intrigues','fiches','reactions','manchettes','nouvelles','anecdotes','fins'];
const w = cols.map(c => Math.max(c.length, ...rows.map(r => String(r[c]).length)));
const line = (v) => '| ' + v.map((x, i) => String(x).padEnd(w[i])).join(' | ') + ' |';
console.log(line(cols));
console.log('|' + w.map(n => '-'.repeat(n + 2)).join('|') + '|');
for (const r of rows) console.log(line(cols.map(c => r[c])));
console.log('');
for (const [k, v] of Object.entries(total)) console.log(String(k).padEnd(18) + ' ' + v);
