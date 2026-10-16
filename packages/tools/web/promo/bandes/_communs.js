/* ═══════════════════════════════════════════════════════════════════════════
   CE QUE LES BANDES PARTAGENT — des débuts de moments, des états de mémoire.
   Un moment commence toujours de la même façon : un livre, une graine, l'introduction
   passée, la première carte. Les bandes composent avec ces morceaux.
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';

// un livre lancé, l'introduction passée, la première carte à l'écran
function depart(livre, graine) {
  return [['demarrer', livre, graine], ['introPasser'], ['attendreCarte']];
}
// … et la première carte jouée : la ville est à toi (on attend que tout se taise), dehors — la
// première carte se joue chez toi, et un saut (`aller`) depuis une pièce laisse la caméra dans la pièce
function enVille(livre, graine, sens) {
  return depart(livre, graine).concat([['repondre', sens || 'gauche'], ['attendreQue', '!etat.carte && !etat.cine && !etat.fondu', 40], ['attendre', 1.2],
    ['sortir'], ['attendreQue', '!etat.dedans && !etat.fondu', 20], ['attendre', 0.8]]);
}
// devant la porte d'un lieu, dehors (le panneau du lieu refermé, la pièce quittée)
function devant(lieu) {
  return [['aller', lieu], ['attendre', 0.9], ['fermerPorte'], ['attendre', 0.4], ['sortir'], ['attendre', 1.6], ['fermerPorte']];
}
// dans la pièce d'un lieu, la légende d'entrée effacée (elle dure 3,8 s)
function dedans(lieu) {
  return [['aller', lieu], ['attendre', 0.9], ['fermerPorte'], ['attendre', 4.6]];
}
// le samedi à la Rive : le moteur avance jusqu'à la carte du match, la ville va au stade
function auStade(livre, graine) {
  return depart(livre, graine).concat([
    ['avancer', 'v.card.beatKind === "match"'],
    ['eval', 'window.FusibleVille._essai("jour", "sam"); window.FusibleVille._essai("tranche", "aprem"); window.FusibleVille._essai("aller", "stade");'],
    ['attendreCarte'], ['attendre', 1.0]]);
}

// les carrières finies que la ville garde (« Tes carrières », preview_dossier.js) : trois
// fantômes plausibles, dont les faits ne disent rien qu'un livre garde pour sa fin
const FANTOMES = [
  { id: 'promo|h3', livre: 'h3', postulat: 'pepite', nom: 'Farid Sannier', prenom: 'Farid', famille: 'Sannier', genre: 'm', debut: 1990, fin: 1993,
    finId: 'pepite_halle', finTitre: 'La grande halle', faits: ['h3_halle'], t: 1792100000000 },
  { id: 'promo|h6', livre: 'h6', postulat: 'vendre_trente', nom: 'Sylvie Nogaret', prenom: 'Sylvie', famille: 'Nogaret', genre: 'f', debut: 2003, fin: 2006,
    finId: 'trente_petit_reste', finTitre: 'Le petit reste', faits: ['h6_tibo_garde'], t: 1792000000000 },
  { id: 'promo|h1', livre: 'h1', postulat: 'promu', nom: 'Marc Delorme', prenom: 'Marc', famille: 'Delorme', genre: 'm', debut: 1990, fin: 1993,
    finId: 'promu_car', finTitre: 'Le car de six heures', faits: ['h1_car', 'h1_salut'], t: 1791900000000 },
];
// les pièces du dossier 1974 qu'on montre : les premières, l'atmosphère — jamais celles qui
// désignent l'homme en écharpe, jamais l'ardoise (le secret du livre 1)
const DOSSIER = ['bache', 'presse_papier', 'carnet'];

module.exports = { depart, enVille, devant, dedans, auStade, FANTOMES, DOSSIER };
