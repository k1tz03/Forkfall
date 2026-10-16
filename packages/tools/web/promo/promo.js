#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   LA PROMO DE FUSIBLE — bandes-annonces, aperçus des boutiques, captures d'écran,
   la bannière de Google Play. Une configuration par bande (bandes/<id>.js) ; le
   mode d'emploi : README.md, à côté.

     NODE_PATH=/opt/node22/lib/node_modules node packages/tools/web/promo/promo.js <commande> [bande] [options]

   Les commandes :
     site                 assemble la version jouable (la ville) dans <sortie>/site
     tourner <bande>      capture les moments de jeu (le temps virtuel, 30 i/s)
     musique <bande>      rend la musique (banc_son.js), la monte sur les mesures, au bon niveau
     monter <bande>       monte la bande dans chaque format (et vérifie : ffprobe, niveau, planches)
     ecrans <bande>       compose les captures d'écran des boutiques (Apple 6,9", Google Play)
     banniere <bande>     la bannière de Google Play (1024 × 500), si la bande en déclare une
     tout <bande>         tourner, musique, monter, ecrans, banniere
     decoupage <bande>    le script de la bande, plan par plan (temps, mesures, source, cadre, légendes)
     verifier             relit les livrables : ffprobe, niveau sonore, poids (rapport.json)

   Les options :
     --sp <dossier>       le dossier de travail partagé (défaut : $FUSIBLE_SP, sinon /tmp/fusible)
     --sortie <dossier>   où tout s'écrit (défaut : <sp>/agents/lot-promo) : travail/, livrables/
     --site <dossier>     le site assemblé (défaut : <sortie>/site)
     --moments a,b        tourner : ces moments seulement ;  --profils social,appstore,apple,google
     --poses              tourner : les images fixes seules, sans vidéo (pour régler un moment)
     --magasins a,b       ecrans : apple, google (défaut : les deux)
     --formats a,b        monter : 9x16, 16x9, 4x5, appstore (défaut : ceux de la bande)
     --force              refaire même ce qui est déjà fait
     --engine, --ville    site : le moteur compilé et les tuiles de la ville
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const C = require('./lib/commun');

async function site(o) {
  const d = C.dossiers(o);
  const engine = path.resolve(o.engine || path.join(d.sp, 'integ', 'engine.js'));
  const ville = path.resolve(o.ville || path.join(d.sp, 'build_ville', 'ville_grand'));
  if (!fs.existsSync(path.join(C.DEPOT, 'content', 'build', 'content.json'))) {
    throw new Error('pas de content/build/content.json : `dart run packages/tools/bin/build_content.dart` d\'abord');
  }
  for (const [f, quoi] of [[engine, '--engine'], [ville, '--ville']]) if (!fs.existsSync(f)) throw new Error(quoi + ' introuvable : ' + f);
  C.assurer(d.site);
  const r = spawnSync('node', [path.join(C.WEB, 'assemble.js'), '--engine', engine, '--out', path.join(d.site, 'index.html'), '--ville', ville],
    { stdio: 'inherit', env: Object.assign({}, process.env, { NODE_PATH: C.NODE_PATH }) });
  if (r.status !== 0) throw new Error('assemble.js a échoué');
  C.journal('le site : ' + path.join(d.site, 'index.html'));
}

function bandeDe(o) {
  const nom = o._[1];
  if (!nom) throw new Error('quelle bande ? (packages/tools/web/promo/bandes/<id>.js)');
  const f = fs.existsSync(nom) ? nom : path.join(C.PROMO, 'bandes', nom.replace(/\.js$/, '') + '.js');
  return C.lireConfig(f);
}

async function main() {
  const o = C.lireOptions(process.argv.slice(2));
  const cmd = o._[0];
  const t0 = Date.now();
  if (!cmd || cmd === 'aide' || o.help || o.h) {
    console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(2, 29).map((l) => l.replace(/^ {0,3}/, '')).join('\n'));
    return;
  }
  if (cmd === 'site') return site(o);
  if (cmd === 'verifier') return require('./lib/controle').verifierTout(o);
  const cfg = bandeDe(o);
  if (cmd === 'decoupage') { console.log(require('./lib/montage').decoupage(cfg)); return; }
  const faire = {
    tourner: () => require('./lib/tournage').tourner(cfg, o),
    musique: () => require('./lib/musique').musiques(cfg, o),
    monter: () => require('./lib/montage').monter(cfg, o),
    ecrans: () => require('./lib/ecrans').ecrans(cfg, o),
    banniere: () => require('./lib/ecrans').banniere(cfg, o),
  };
  if (cmd === 'tout') {
    for (const k of ['tourner', 'musique', 'monter', 'ecrans', 'banniere']) await faire[k]();
  } else if (faire[cmd]) await faire[cmd]();
  else throw new Error('commande inconnue : ' + cmd);
  C.journal('fini en ' + C.hms((Date.now() - t0) / 1000));
}

main().catch((e) => { console.error('promo : ' + (e && e.stack ? e.stack : e)); process.exit(1); });
