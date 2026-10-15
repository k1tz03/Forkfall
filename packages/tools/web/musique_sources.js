// LA MUSIQUE, CÔTÉ ASSEMBLAGE — audio.js et les thèmes (musique/<clé>.js), en un
// seul texte de script, pour les trois pages qui jouent la musique : l'aperçu
// (assemble.js, le fichier seul comme la version jouable), le banc d'essai
// (banc_son.js) et le juke-box (juke_box.js).
//
//   const M = require('./musique_sources.js');
//   M.fichiers()   les thèmes : [{ nom: 'accueil.js', chemin }], par ordre
//                  alphabétique ; un nom qui commence par « _ » n'est pas chargé
//                  (le modèle du compositeur, un brouillon)
//   M.texte()      audio.js, puis chaque thème dans son filet : une erreur à
//                  l'exécution d'un fichier n'emporte que son thème (elle est
//                  gardée dans FusibleAudio.erreurs()) ; une faute de syntaxe,
//                  elle, arrête l'assemblage ici, avec le nom du fichier et la
//                  ligne — elle aurait tué le script entier, audio.js compris.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ICI = __dirname;
const DOSSIER = path.join(ICI, 'musique');

function fichiers() {
  if (!fs.existsSync(DOSSIER)) return [];
  return fs.readdirSync(DOSSIER)
    .filter((f) => /^[a-z0-9][a-z0-9_]*\.js$/.test(f))
    .sort()
    .map((nom) => ({ nom, chemin: path.join(DOSSIER, nom) }));
}

// une faute de syntaxe se lit ici, avec le fichier et la ligne
function verifier(nom, src) {
  try {
    new vm.Script(src, { filename: 'fichier-de-musique' });
  } catch (e) {
    const ligne = /fichier-de-musique:(\d+)/.exec(String(e.stack || '')) || [];
    throw new Error(nom + (ligne[1] ? ', ligne ' + ligne[1] : '') + ' : ' + e.message);
  }
}

function texte() {
  const morceaux = [fs.readFileSync(path.join(ICI, 'audio.js'), 'utf8')];
  for (const f of fichiers()) {
    const src = fs.readFileSync(f.chemin, 'utf8');
    verifier('musique/' + f.nom, src);
    morceaux.push(
      '/* ── musique/' + f.nom + ' ── */\ntry {\n' + src + '\n} catch (e) {\n' +
      '  if (typeof FusibleAudio === "object" && FusibleAudio._erreur) FusibleAudio._erreur("musique/' + f.nom + '", e);\n' +
      '  else if (typeof console === "object") console.error("musique/' + f.nom + '", e);\n}'
    );
  }
  return morceaux.join('\n');
}

// un brouillon hors de musique/ (le banc et le juke-box, --avec) : vérifié, puis dans son filet
function enveloppe(chemin) {
  const nom = path.basename(chemin), src = fs.readFileSync(chemin, 'utf8');
  verifier(chemin, src);
  return '\n/* ── ' + nom + ' ── */\ntry {\n' + src + '\n} catch (e) { FusibleAudio._erreur(' + JSON.stringify(nom) + ', e); }';
}

module.exports = { fichiers, texte, enveloppe, DOSSIER };
