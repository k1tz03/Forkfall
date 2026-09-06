#!/usr/bin/env node
// FUSIBLE — assemble docs/bible/*.md en une seule page HTML « papier crème ».
//   node docs/bible/tools/build_html.js [chemin/de/sortie.html]
// Aucune dépendance : convertisseur markdown minimal + mise en scène des blocs
// « ### SCÈNE » au gabarit de la charte § 4.1.

const fs = require('fs');
const path = require('path');

const SRC = '/home/user/Forkfall/docs/bible';
const OUT = process.argv[2] || path.join(SRC, 'bible.html');

/* ------------------------------------------------------------------ outils */

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function slug(s) {
  return s
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70) || 'x';
}

const used = new Map();
function anchor(base) {
  const b = slug(base);
  const n = (used.get(b) || 0) + 1;
  used.set(b, n);
  return n === 1 ? b : `${b}-${n}`;
}

/* --------------------------------------------------------------- inline md */

function inline(s) {
  let t = esc(s);
  // code d'abord : on le met de côté pour ne pas le formater
  const codes = [];
  t = t.replace(/`([^`]+)`/g, (_, c) => {
    codes.push(c);
    return `\u0000${codes.length - 1}\u0001`;
  });
  t = t.replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g, (_, txt, href) => {
    const h = /^(https?:|#|mailto:)/.test(href) ? href : href;
    return `<a href="${h}">${txt}</a>`;
  });
  t = t.replace(/\*\*\*([^*\n]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  t = t.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/(^|[^*\w])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  t = t.replace(/(^|\s)_([^_\n]+)_(?=\s|$|[.,;:!?)])/g, '$1<em>$2</em>');
  t = t.replace(/\u0000(\d+)\u0001/g, (_, i) => `<code>${codes[+i]}</code>`);
  return t;
}

/* ---------------------------------------------------- mise en scène (§ 4.1) */

const HEAD_KIND = {
  'SCÈNE': 'scene', 'RÉACTION': 'reaction', 'UNE': 'une',
  'NOUVELLE': 'nouvelle', 'ANECDOTE': 'anecdote', 'SET-PIECE': 'setpiece',
  'FIN': 'fin',
};

// Une ligne de choix : « ← **Libellé** — effets : … — *conséquence* »
function renderChoice(line) {
  const dir = line[0];
  let rest = line.slice(1).trim();
  let label = '';
  const m = rest.match(/^\*\*([^*]+)\*\*\s*(?:—|-{1,2})?\s*/);
  if (m) { label = m[1].trim(); rest = rest.slice(m[0].length); }
  let effets = rest, cons = '';
  const c = rest.match(/—\s*\*([^*]+)\*\s*$/);
  if (c) { cons = c[1]; effets = rest.slice(0, c.index); }
  effets = effets.replace(/^\s*—\s*/, '').replace(/\s*—\s*$/, '');
  effets = effets.replace(/^effets\s*:\s*/i, '');
  return `<div class="ch ${dir === '←' ? 'l' : 'r'}">` +
    `<div class="ch-h"><span class="arw">${dir}</span>` +
    `<span class="ch-lab">${inline(label)}</span></div>` +
    (effets.trim() ? `<div class="ch-fx">${inline(effets.trim())}</div>` : '') +
    (cons ? `<div class="ch-cs">${inline(cons.trim())}</div>` : '') +
    `</div>`;
}

function renderBlock(kind, title, lines) {
  const out = [];
  const choices = [];
  const flush = () => {
    if (choices.length) { out.push(`<div class="choices">${choices.join('')}</div>`); choices.length = 0; }
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line[0] === '←' || line[0] === '→') { choices.push(renderChoice(line)); continue; }
    flush();
    // locuteur : **NOM** *(fonction — expression — didascalie)*
    let m = line.match(/^\*\*([^*]+)\*\*\s*\*\(([^)]*)\)\*\s*(.*)$/);
    if (m && /^[^a-z]*$/.test(m[1].replace(/[^A-Za-zÀ-ÿ]/g, '').slice(0, 3))) {
      out.push(`<p class="cue"><span class="who">${inline(m[1].trim())}</span>` +
        `<span class="dida">${inline(m[2].trim())}</span></p>`);
      if (m[3]) out.push(`<p class="line">${inline(m[3].trim())}</p>`);
      continue;
    }
    // locuteur nu : **NOM** « … »   (format compact)
    m = line.match(/^\*\*([A-ZÀ-ÝŒ0-9ĆŽ' .·’-]{2,40})\*\*\s*[:—-]?\s*(«.*)$/);
    if (m) {
      out.push(`<p class="cue"><span class="who">${inline(m[1].trim())}</span></p>`);
      out.push(`<p class="line">${inline(m[2].trim())}</p>`);
      continue;
    }
    if (line[0] === '«') { out.push(`<p class="line">${inline(line)}</p>`); continue; }
    if (/^\*\*Traces\*\*/.test(line)) { out.push(`<p class="traces">${inline(line)}</p>`); continue; }
    if (/^\*\*[^*]+\*\*\s*:/.test(line)) { out.push(`<p class="meta">${inline(line)}</p>`); continue; }
    out.push(`<p class="misc">${inline(line)}</p>`);
  }
  flush();
  const id = anchor(kind + '-' + title);
  const [num, ...restT] = title.split(/\s+—\s+/);
  const t = restT.join(' — ');
  return `<section class="blk ${kind}" id="${id}">` +
    `<h4 class="blk-h"><span class="kind">${kind === 'scene' ? 'Scène' :
      kind === 'reaction' ? 'Réaction' : kind === 'une' ? 'Une' :
      kind === 'nouvelle' ? 'Nouvelle' : kind === 'anecdote' ? 'Anecdote' :
      kind === 'setpiece' ? 'Set-piece' : 'Fin'}</span>` +
    `<code class="blk-id">${esc(num)}</code>` +
    (t ? `<span class="blk-t">${inline(t)}</span>` : '') + `</h4>` +
    out.join('') + `</section>`;
}

/* -------------------------------------------------------------- convertisseur */

function convert(md, chapId, toc) {
  const lines = md.split('\n');
  const out = [];
  let i = 0;
  let para = [];
  const flushPara = () => {
    if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; }
  };

  while (i < lines.length) {
    const line = lines[i];

    // code fencé
    if (/^\s*```/.test(line)) {
      flushPara();
      const lang = line.trim().slice(3).trim();
      const buf = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      out.push(`<pre class="code"${lang ? ` data-l="${esc(lang)}"` : ''}><code>${esc(buf.join('\n'))}</code></pre>`);
      continue;
    }

    // titres
    let m = line.match(/^(#{1,6})\s+(.*?)\s*$/);
    if (m) {
      flushPara();
      const lvl = m[1].length;
      const txt = m[2];
      const kindM = txt.match(/^(SCÈNE|RÉACTION|UNE|NOUVELLE|ANECDOTE|SET-PIECE|FIN)\s+(.*)$/);
      if (lvl >= 3 && kindM && !/^</.test(kindM[2])) {
        // bloc de gabarit : on avale les lignes non vides qui suivent
        i++;
        while (i < lines.length && !lines[i].trim()) i++;
        const buf = [];
        while (i < lines.length && lines[i].trim() && !/^#{1,6}\s/.test(lines[i])) buf.push(lines[i++]);
        out.push(renderBlock(HEAD_KIND[kindM[1]], kindM[2], buf));
        continue;
      }
      const id = anchor(chapId + '-' + txt);
      const isIntrigue = /^INTRIGUE\s/.test(txt);
      const fiche = txt.match(/\(`([a-z_]+)`\)\s*$/);
      if (lvl === 2) toc.push({ id, txt, intrigue: isIntrigue, perso: fiche ? fiche[1] : null });
      out.push(`<h${lvl} id="${id}" class="${isIntrigue ? 'h-intrigue' : fiche ? 'h-fiche' : ''}">` +
        `<a class="lnk" href="#${id}">§</a>${inline(txt)}</h${lvl}>`);
      i++;
      continue;
    }

    // tableau
    if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|[\s:|-]+\|?\s*$/.test(lines[i + 1])) {
      flushPara();
      const cells = (r) => r.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map((c) => c.trim());
      const head = cells(line);
      i += 2;
      const body = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) body.push(cells(lines[i++]));
      out.push(`<div class="tw"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>` +
        body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('') +
        `</tbody></table></div>`);
      continue;
    }

    // règle
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { flushPara(); out.push('<hr>'); i++; continue; }

    // citation
    if (/^\s*>\s?/.test(line)) {
      flushPara();
      const buf = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^\s*>\s?/, ''));
      out.push(`<blockquote>${convert(buf.join('\n'), chapId, [])}</blockquote>`);
      continue;
    }

    // listes
    if (/^\s*([-*+]|\d+[.)])\s+/.test(line)) {
      flushPara();
      const ord = /^\s*\d+[.)]\s+/.test(line);
      const items = [];
      while (i < lines.length && /^\s*([-*+]|\d+[.)])\s+/.test(lines[i])) {
        let txt = lines[i].replace(/^\s*([-*+]|\d+[.)])\s+/, '');
        i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*([-*+]|\d+[.)])\s+/.test(lines[i])) {
          txt += ' ' + lines[i].trim(); i++;
        }
        items.push(`<li>${inline(txt)}</li>`);
      }
      out.push(`<${ord ? 'ol' : 'ul'}>${items.join('')}</${ord ? 'ol' : 'ul'}>`);
      continue;
    }

    // ligne de choix isolée hors bloc (format compact)
    if (/^\s*(←|→)/.test(line)) {
      flushPara();
      const buf = [];
      while (i < lines.length && /^\s*(←|→)/.test(lines[i])) buf.push(lines[i++].trim());
      out.push(`<div class="choices">${buf.map(renderChoice).join('')}</div>`);
      continue;
    }

    if (!line.trim()) { flushPara(); i++; continue; }

    // paragraphe « carte compacte » : **`id`** · … suivi d'un locuteur
    para.push(line.trim());
    i++;
  }
  flushPara();
  return out.join('\n');
}

/* ------------------------------------------------------------------ données */

const files = fs.readdirSync(SRC).filter((f) => /^\d.*\.md$/.test(f)).sort();

const TITRES = {
  '00_charte.md': ['00', 'La charte du showrunner', 'Le monde, le casting, les rôles, les dix gabarits, les quarante traces.'],
  '01_personnages_terrain.md': ['01', 'Personnages — le terrain', 'Dix-neuf visages du vestiaire, du virage et de la famille.'],
  '02_personnages_direction_instances.md': ['02', 'Personnages — direction et instances', 'Vingt-trois visages de l’autre côté de la table.'],
  '10_scenarios_joueur.md': ['10', 'Scénarios — le joueur', 'Du terrain en cendrée au contrat de fin de carrière.'],
  '11_scenarios_entraineur.md': ['11', 'Scénarios — l’entraîneur', 'Le promu, l’intérimaire, et trois bancs de plus.'],
  '12_scenarios_directeur_sportif.md': ['12', 'Scénarios — le directeur sportif', 'Vendre trente millions par an, ou protéger un coach.'],
  '13_scenarios_president.md': ['13', 'Scénarios — les présidents', 'La buvette, la mairie, les actionnaires, la valise.'],
  '14_scenarios_selectionneur.md': ['14', 'Scénarios — le sélectionneur', 'La liste, le bus, l’hymne, le tournoi sans respiration.'],
  '15_scenarios_instance.md': ['15', 'Scénarios — les instances', 'Les dossiers, le Congrès, la campagne, l’hôtel du Lac.'],
  '20_journaux.md': ['20', 'Les journaux', 'Quatre voix, les manchettes, la chronologie 1990-2050.'],
  '30_setpieces_alarmes_fins.md': ['30', 'Set-pieces, alarmes et fins', 'Les sept beats, les alarmes, les retrouvailles, les plaques.'],
  '31_anecdotes_et_almanach.md': ['31', 'Anecdotes et Almanach', 'Cent anecdotes, les gags, les objets, les enterrements.'],
  '90_interconnexions.md': ['90', 'Interconnexions', 'La matrice des traces, la couture, les contradictions tranchées.'],
};

let stats = null;
try {
  stats = JSON.parse(require('child_process')
    .execSync(`node ${path.join(SRC, 'tools', 'stats.js')} --json`, { maxBuffer: 64 * 1024 * 1024 }).toString());
} catch (e) { stats = null; }

const chapters = [];
for (const f of files) {
  const md = fs.readFileSync(path.join(SRC, f), 'utf8');
  const [num, titre, sous] = TITRES[f] || [f.slice(0, 2), f.replace(/\.md$/, ''), ''];
  const chapId = 'ch' + num;
  const toc = [];
  // on retire le H1 du fichier : le chapitre porte son propre titre
  const body = convert(md.replace(/^#\s+[^\n]*\n/, ''), chapId, toc);
  chapters.push({ f, num, titre, sous, chapId, toc, body });
}

/* --------------------------------------------------------------------- index */

const persos = [];
const intrigues = [];
for (const c of chapters) {
  for (const t of c.toc) {
    if (t.perso) persos.push({ nom: t.txt.replace(/^\d+\.\s*/, '').replace(/\s*\(`[a-z_]+`\)\s*$/, ''), id: t.perso, anchor: t.id, chap: c.num });
    if (t.intrigue) intrigues.push({ nom: t.txt.replace(/^INTRIGUE\s+/, ''), anchor: t.id, chap: c.num });
  }
}
persos.sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
intrigues.sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));

/* ----------------------------------------------------------------------- css */

const CSS = `
:root{
  --creme:#EFE4C6; --papier:#F6EFDC; --encre:#1E1A14; --encre2:#4A423A; --encre3:#8A8072;
  --pelouse:#1F5A32; --tampon:#C8262C; --trait:rgba(30,26,20,.16);
  --font-paper:'Fraunces',Georgia,'Times New Roman',serif;
  --font-ui:'Manrope','Segoe UI',Roboto,Helvetica,Arial,sans-serif;
  --font-cond:'Barlow Condensed','Roboto Condensed','Arial Narrow',sans-serif;
}
*{box-sizing:border-box}
p,li,td,th,h1,h2,h3,h4,h5,h6,.line,.meta,.traces,.misc,.ch-lab,.ch-fx,.ch-cs,.blk-id,.blk-t{overflow-wrap:break-word;min-width:0}
html{scroll-behavior:smooth;scroll-padding-top:12px}
body{margin:0;background:var(--creme);color:var(--encre);font-family:var(--font-ui);
  font-size:16px;line-height:1.62;-webkit-text-size-adjust:100%;
  overflow-wrap:break-word;
  background-image:radial-gradient(rgba(30,26,20,.045) 1px,transparent 1px);background-size:4px 4px}
a{color:var(--pelouse);text-decoration:none;border-bottom:1px solid rgba(31,90,50,.35)}
a:hover{color:var(--tampon);border-bottom-color:var(--tampon)}
code{font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:.86em;
  background:rgba(30,26,20,.06);border:1px solid var(--trait);border-radius:3px;padding:.05em .3em;
  overflow-wrap:anywhere;word-break:break-word}
hr{border:0;border-top:1px solid var(--trait);margin:2.4rem 0}

/* ---- page de garde ---- */
.cover{background:var(--pelouse);color:var(--creme);padding:clamp(2rem,7vw,5.5rem) 1.25rem 3rem;text-align:center;
  border-bottom:6px solid var(--encre)}
.cover .kicker{font-family:var(--font-cond);font-weight:700;letter-spacing:.22em;text-transform:uppercase;
  font-size:.78rem;color:rgba(239,228,198,.7)}
.cover h1{font-family:var(--font-cond);font-weight:800;text-transform:uppercase;letter-spacing:.04em;
  font-size:clamp(3.2rem,15vw,7.5rem);line-height:.86;margin:.5rem 0 .2rem;
  text-shadow:3px 3px 0 var(--encre),6px 6px 0 rgba(200,38,44,.85)}
.cover h2{font-family:var(--font-paper);font-weight:600;font-style:italic;font-size:clamp(1.05rem,3.4vw,1.6rem);
  margin:.1rem auto 1.1rem;max-width:32ch;color:var(--creme);opacity:.95;font-variation-settings:'opsz' 40}
.cover .stamp{display:inline-block;font-family:var(--font-cond);font-weight:800;text-transform:uppercase;
  letter-spacing:.09em;font-size:1rem;color:var(--tampon);background:var(--creme);
  border:3px double var(--tampon);padding:.3rem 1rem;transform:rotate(-3deg);margin:.6rem 0 1.6rem}
.cover .date{font-family:var(--font-cond);letter-spacing:.16em;text-transform:uppercase;font-size:.8rem;opacity:.8}
.figures{display:grid;grid-template-columns:repeat(auto-fit,minmax(112px,1fr));gap:.55rem;
  max-width:900px;margin:2rem auto 0}
.fig{background:var(--creme);color:var(--encre);border:2px solid var(--encre);padding:.55rem .3rem;
  box-shadow:3px 3px 0 rgba(30,26,20,.5)}
.fig b{display:block;font-family:var(--font-cond);font-weight:800;font-size:1.5rem;line-height:1}
.fig span{display:block;font-family:var(--font-cond);font-weight:600;text-transform:uppercase;
  letter-spacing:.1em;font-size:.63rem;color:var(--encre2);margin-top:.15rem}

/* ---- mise en page ---- */
.layout{display:flex;align-items:flex-start;gap:0;max-width:1240px;margin:0 auto}
nav.side{position:sticky;top:0;flex:0 0 262px;max-height:100vh;overflow-y:auto;padding:1.2rem .8rem 4rem;
  border-right:1px solid var(--trait);font-size:.82rem}
nav.side h3{font-family:var(--font-cond);font-weight:800;text-transform:uppercase;letter-spacing:.14em;
  font-size:.72rem;color:var(--encre3);margin:1.2rem 0 .4rem}
nav.side a{display:block;border:0;padding:.12rem 0;color:var(--encre2);line-height:1.35}
nav.side a:hover{color:var(--tampon)}
nav.side .cnum{font-family:var(--font-cond);font-weight:800;color:var(--tampon);margin-right:.4em}
nav.side details{margin:0 0 .35rem}
nav.side summary{cursor:pointer;list-style:none;font-family:var(--font-cond);font-weight:700;
  text-transform:uppercase;letter-spacing:.05em;font-size:.86rem;padding:.18rem 0;color:var(--encre)}
nav.side summary::-webkit-details-marker{display:none}
nav.side details ul{list-style:none;margin:.15rem 0 .5rem;padding:0 0 0 .75rem;border-left:1px solid var(--trait)}
nav.side details li{margin:.05rem 0}
main{flex:1 1 auto;min-width:0;padding:1.5rem clamp(.9rem,3vw,2.4rem) 6rem}
.wrap{max-width:74ch;margin:0 auto}
#menu{display:none}

/* ---- titres ---- */
h2,h3,h4,h5,h6{position:relative;font-family:var(--font-paper);font-weight:700;line-height:1.18;
  font-variation-settings:'opsz' 60;margin:2.2rem 0 .7rem;scroll-margin-top:10px}
h2{font-size:1.62rem;border-bottom:2px solid var(--encre);padding-bottom:.3rem}
h3{font-size:1.24rem;color:var(--encre)}
h4{font-size:1.05rem}
h5,h6{font-size:.96rem;font-style:italic}
h2 .lnk,h3 .lnk,h4 .lnk,h5 .lnk,h6 .lnk{position:absolute;margin-left:-1.1em;width:1.1em;border:0;
  color:var(--encre3);opacity:0;font-weight:400}
h2:hover .lnk,h3:hover .lnk,h4:hover .lnk{opacity:1}
h2.h-intrigue,h3.h-intrigue{font-family:var(--font-cond);font-weight:800;text-transform:uppercase;
  letter-spacing:.03em;color:var(--pelouse);border-bottom:2px solid var(--pelouse)}
h2.h-fiche{font-family:var(--font-cond);font-weight:800;text-transform:uppercase;letter-spacing:.05em;
  font-size:1.9rem;border-bottom:3px double var(--encre)}

/* ---- chapitre ---- */
.chapter{padding-top:1rem}
.chap-head{margin:3rem 0 1.6rem;border-top:6px solid var(--encre);padding-top:1rem}
.chapter:first-of-type .chap-head{border-top:0;margin-top:.5rem}
.chap-head .n{font-family:var(--font-cond);font-weight:800;font-size:3.6rem;line-height:.9;color:var(--tampon)}
.chap-head h1{font-family:var(--font-paper);font-weight:900;font-size:clamp(1.7rem,5vw,2.5rem);
  line-height:1.08;margin:.1rem 0 .3rem;font-variation-settings:'opsz' 100}
.chap-head p{font-family:var(--font-paper);font-style:italic;color:var(--encre2);margin:0}

/* ---- blocs de scène ---- */
.blk{background:var(--papier);border:1.5px solid var(--encre);border-left:5px solid var(--pelouse);
  padding:.85rem 1rem .9rem;margin:1.4rem 0;box-shadow:2px 2px 0 rgba(30,26,20,.12);scroll-margin-top:10px}
.blk.reaction{border-left-color:var(--tampon)}
.blk.une{border-left-color:var(--encre)}
.blk.fin{border-left-color:var(--encre);border-style:double;border-width:3px}
.blk.nouvelle,.blk.anecdote,.blk.setpiece{border-left-color:var(--encre3)}
.blk-h{margin:0 0 .5rem;font-family:var(--font-cond);font-weight:700;font-size:1rem;line-height:1.25;
  display:flex;flex-wrap:wrap;align-items:baseline;gap:.45em}
.blk-h .kind{font-weight:800;text-transform:uppercase;letter-spacing:.14em;font-size:.68rem;
  color:var(--creme);background:var(--pelouse);padding:.1em .5em}
.blk.reaction .kind{background:var(--tampon)}
.blk.fin .kind,.blk.une .kind{background:var(--encre)}
.blk.nouvelle .kind,.blk.anecdote .kind,.blk.setpiece .kind{background:var(--encre3)}
.blk-id{font-size:.76rem;background:transparent;border:0;color:var(--encre2);padding:0}
.blk-t{font-family:var(--font-paper);font-weight:700;font-style:italic;font-size:1.02rem}
.blk .meta{font-size:.78rem;color:var(--encre2);margin:.15rem 0 .55rem;line-height:1.5}
.blk .cue{margin:.7rem 0 .1rem}
.cue .who{font-family:var(--font-cond);font-weight:800;text-transform:uppercase;letter-spacing:.07em;
  font-size:1.02rem;display:inline-block;margin-right:.6em}
.cue .dida{font-style:italic;color:var(--encre2);font-size:.83rem}
.blk .line{margin:.1rem 0 .55rem;padding-left:1.6rem;font-family:var(--font-paper);font-size:1.02rem;
  line-height:1.5;font-variation-settings:'opsz' 24}
.blk .misc{margin:.35rem 0;font-size:.94rem}
.blk .traces{margin:.7rem 0 0;padding-top:.5rem;border-top:1px dashed var(--trait);
  font-family:var(--font-cond);font-weight:600;text-transform:uppercase;letter-spacing:.055em;
  font-size:.72rem;color:var(--encre2);line-height:1.6}
.blk .traces strong{color:var(--encre)}
.choices{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin:.55rem 0 .2rem}
.ch{background:var(--creme);border:1.5px solid var(--encre);padding:.5rem .6rem}
.ch.l{border-top:4px solid var(--pelouse)}
.ch.r{border-top:4px solid var(--tampon)}
.ch-h{display:flex;gap:.4em;align-items:baseline}
.ch .arw{font-weight:700;color:var(--encre3)}
.ch-lab{font-family:var(--font-cond);font-weight:800;text-transform:uppercase;letter-spacing:.045em;font-size:.95rem}
.ch-fx{font-size:.74rem;color:var(--encre2);margin-top:.2rem;line-height:1.45;word-break:break-word}
.ch-cs{font-family:var(--font-paper);font-style:italic;font-size:.88rem;margin-top:.3rem;line-height:1.4}

/* ---- tableaux, code, listes ---- */
.tw{overflow-x:auto;margin:1rem 0;border:1px solid var(--trait);background:var(--papier)}
table{border-collapse:collapse;width:100%;font-size:.84rem;min-width:100%}
th,td{border:1px solid var(--trait);padding:.35rem .5rem;text-align:left;vertical-align:top}
th{font-family:var(--font-cond);font-weight:700;text-transform:uppercase;letter-spacing:.06em;
  font-size:.75rem;background:rgba(31,90,50,.1);white-space:nowrap}
tbody tr:nth-child(even){background:rgba(30,26,20,.035)}
pre.code{background:var(--papier);border:1px solid var(--encre);border-left:4px solid var(--encre3);
  padding:.7rem .8rem;overflow-x:auto;font-size:.8rem;line-height:1.5;margin:1rem 0}
pre.code code{background:none;border:0;padding:0}
blockquote{margin:1rem 0;padding:.2rem 0 .2rem 1rem;border-left:3px solid var(--tampon);
  font-family:var(--font-paper);font-style:italic;color:var(--encre2)}
ul,ol{padding-left:1.3rem}
li{margin:.2rem 0}
main p{margin:.7rem 0}

/* ---- index ---- */
.idx{columns:220px;column-gap:1.6rem}
.idx a{display:block;break-inside:avoid;border:0;padding:.1rem 0;font-size:.9rem}
.idx .cn{font-family:var(--font-cond);font-weight:700;color:var(--tampon);font-size:.72rem;margin-right:.4em}
.idx .nm{font-family:var(--font-cond);font-weight:700;text-transform:uppercase;letter-spacing:.04em}

/* ---- sommaire ---- */
.somm{list-style:none;padding:0;margin:1.2rem 0}
.somm li{display:flex;gap:.8rem;align-items:baseline;border-bottom:1px dotted var(--trait);padding:.45rem 0}
.somm .n{font-family:var(--font-cond);font-weight:800;font-size:1.3rem;color:var(--tampon);flex:0 0 2ch}
.somm a{font-family:var(--font-cond);font-weight:700;text-transform:uppercase;letter-spacing:.04em;
  font-size:1.02rem;border:0}
.somm .s{display:block;font-family:var(--font-paper);font-style:italic;font-size:.86rem;color:var(--encre2);
  text-transform:none;letter-spacing:0;font-weight:400}

@media (max-width:900px){
  .idx{columns:1}
  h2 .lnk,h3 .lnk,h4 .lnk,h5 .lnk,h6 .lnk{display:none}
  .layout{display:block}
  nav.side{position:static;max-height:none;width:auto;flex:none;border-right:0;
    border-bottom:1px solid var(--trait);display:none;padding:1rem}
  nav.side.open{display:block}
  #menu{display:block;position:sticky;top:0;z-index:5;width:100%;border:0;border-bottom:2px solid var(--encre);
    background:var(--pelouse);color:var(--creme);font-family:var(--font-cond);font-weight:800;
    text-transform:uppercase;letter-spacing:.14em;font-size:.85rem;padding:.6rem;cursor:pointer}
  .choices{grid-template-columns:1fr}
  main{padding:1rem .8rem 4rem}
  .blk{padding:.7rem .7rem .75rem}
}
@media print{nav.side,#menu{display:none}.layout{display:block}}
`;

/* ---------------------------------------------------------------------- html */

const S = stats ? stats.total : {};
const nf = (n) => (n == null ? '—' : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '));
const FIG = [
  ['mots', 'Mots'], ['scenes', 'Scènes'], ['intrigues', 'Intrigues'],
  ['personnages', 'Personnages'], ['reactions', 'Réactions'], ['manchettes', 'Manchettes'],
  ['nouvelles', 'Nouvelles'], ['anecdotes', 'Anecdotes'], ['fins', 'Fins'],
  ['alarmes', 'Alarmes'], ['traces', 'Traces'], ['cartes_id', 'Cartes'],
];

const DATE = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const nav = `<nav class="side" id="side">
<h3>Chapitres</h3>
${chapters.map((c) => `<details><summary><span class="cnum">${c.num}</span>${esc(c.titre)}</summary><ul>
${c.toc.map((t) => `<li><a href="#${t.id}">${esc(t.txt.replace(/^INTRIGUE\s+/, '').replace(/\*/g, ''))}</a></li>`).join('')}
</ul></details>`).join('')}
<h3>Index</h3>
<a href="#index-personnages">Index des personnages</a>
<a href="#index-intrigues">Index des intrigues</a>
<a href="#sommaire">Sommaire</a>
</nav>`;

const html = `<title>FUSIBLE — Bible scénaristique</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,500&family=Manrope:wght@500;600;700;800&display=swap" rel="stylesheet">
<style>${CSS}</style>

<header class="cover">
  <div class="kicker">Jeu mobile · une carte, deux gestes</div>
  <h1>Fusible</h1>
  <h2>Bible scénaristique — une carrière de football, de 1990 à 2050, dans un pays qui n’existe pas.</h2>
  <div class="stamp">Document de travail</div>
  <div class="date">${esc(DATE)} · ${chapters.length} chapitres</div>
  <div class="figures">
    ${FIG.map(([k, l]) => `<div class="fig"><b>${nf(S[k])}</b><span>${l}</span></div>`).join('')}
  </div>
</header>

<button id="menu" type="button" aria-expanded="false">Sommaire</button>
<div class="layout">
${nav}
<main><div class="wrap">

<h2 id="sommaire"><a class="lnk" href="#sommaire">§</a>Sommaire</h2>
<ul class="somm">
${chapters.map((c) => `<li><span class="n">${c.num}</span><span><a href="#${c.chapId}">${esc(c.titre)}</a><span class="s">${esc(c.sous)}</span></span></li>`).join('')}
<li><span class="n">·</span><span><a href="#index-personnages">Index des personnages</a><span class="s">${persos.length} fiches de personnage, par ordre alphabétique.</span></span></li>
<li><span class="n">·</span><span><a href="#index-intrigues">Index des intrigues</a><span class="s">${intrigues.length} intrigues, par ordre alphabétique.</span></span></li>
</ul>

${chapters.map((c) => `<section class="chapter" id="${c.chapId}">
<div class="chap-head"><div class="n">${c.num}</div><h1>${esc(c.titre)}</h1><p>${esc(c.sous)}</p></div>
${c.body}
</section>`).join('\n')}

<section class="chapter" id="index-personnages">
<div class="chap-head"><div class="n">A</div><h1>Index des personnages</h1><p>${persos.length} fiches complètes, chapitres 01 et 02.</p></div>
<div class="idx">${persos.map((p) => `<a href="#${p.anchor}"><span class="cn">${p.chap}</span><span class="nm">${esc(p.nom)}</span> <code>${esc(p.id)}</code></a>`).join('')}</div>
</section>

<section class="chapter" id="index-intrigues">
<div class="chap-head"><div class="n">B</div><h1>Index des intrigues</h1><p>${intrigues.length} intrigues au gabarit § 4.3.</p></div>
<div class="idx">${intrigues.map((p) => `<a href="#${p.anchor}"><span class="cn">${p.chap}</span>${inline(p.nom)}</a>`).join('')}</div>
</section>

</div></main>
</div>
<script>
(function(){
  var b=document.getElementById('menu'),s=document.getElementById('side');
  if(!b||!s)return;
  b.addEventListener('click',function(){
    var o=s.classList.toggle('open');
    b.setAttribute('aria-expanded',o?'true':'false');
  });
  s.addEventListener('click',function(e){
    if(e.target.tagName==='A'&&window.innerWidth<=900){s.classList.remove('open');b.setAttribute('aria-expanded','false');}
  });
})();
</script>
`;

fs.writeFileSync(OUT, html);
const kb = (fs.statSync(OUT).size / 1048576).toFixed(2);
console.log(`${OUT} — ${kb} Mo · ${chapters.length} chapitres · ${persos.length} personnages · ${intrigues.length} intrigues`);
