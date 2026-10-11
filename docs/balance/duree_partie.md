# Combien de temps dure une partie ?

Question du porteur (octobre 2026) : « pour chaque histoire, combien de temps dure une partie
pour un humain ? » Une partie, c'est une carrière jouée en ville jusqu'à la fin du livre.
Mesuré le 11 octobre 2026, sur le contenu de la branche à ce jour.

## La réponse

Environ **deux heures par livre** pour un lecteur moyen qui suit l'histoire. *Les Deux
Téléphones* demande 2 h 25, parce que sa carrière dure une saison de plus.

| Livre | Rôle, année | Cartes | Saisons | Lecteur rapide | Lecteur moyen | Lecteur lent | Carrière longue (P90) |
|---|---|---|---|---|---|---|---|
| 1 · Trois mille visages | entraîneur, 1990 | 109 | 3 | 1 h 37 | **1 h 58** | 2 h 28 | 2 h |
| 2 · Le Sapin en carton | entraîneur, 1990 | 109 | 3 | 1 h 37 | **1 h 57** | 2 h 27 | 3 h |
| 3 · La Sirène | joueur, 1990 | 109 | 3 | 1 h 37 | **1 h 58** | 2 h 29 | 4 h 20 |
| 4 · La Route de la Rive | joueur, 1990 | 113 | 3 | 1 h 39 | **1 h 59** | 2 h 31 | 4 h 20 |
| 5 · La Maquette | président, 1999 | 110 | 3 | 1 h 38 | **1 h 58** | 2 h 29 | 2 h |
| 6 · 23 h 58 | directrice sportive, 2003 | 99 | 3 | 1 h 33 | **1 h 53** | 2 h 24 | 1 h 54 |
| 7 · Chambre 12 | sélectionneur, 2011 | 100 | 3 | 1 h 35 | **1 h 55** | 2 h 25 | 2 h 18 |
| 8 · L'Oreillette | directeur sportif, 2024 | 100 | 3 | 1 h 33 | **1 h 53** | 2 h 23 | 1 h 54 |
| 9 · Vingt degrés dedans | sélectionneuse, 2029 | 101 | 3 | 1 h 35 | **1 h 56** | 2 h 26 | 2 h 21 |
| 10 · Les Deux Téléphones | présidente, 2037 | 124 | 4 | 1 h 58 | **2 h 23** | 3 h 02 | 2 h 24 |

- Les colonnes « Cartes » et « Saisons » et les trois durées sont des médianes, sur 300
  carrières par livre.
- La carrière longue est le 90ᵉ centile des durées, pour un lecteur moyen.
- **Les livres 3 et 4 débordent** : environ une carrière sur cinq ne se ferme pas sur une fin
  du livre à la troisième saison. Elle continue alors six saisons ou plus, souvent jusqu'au
  grand déballage, et dure 4 h ou plus. Le livre 2 déborde une fois sur quatorze.

**Où passe le temps (lecteur moyen, carrière médiane) :**

| Part | Durée | Ce que c'est |
|---|---|---|
| Les cartes | 26 à 32 min | ~30 000 caractères à lire : le texte, les boutons, la phrase de conséquence, les Unes. Plus une centaine de décisions. |
| Les scènes jouées du livre | 6 à 8 min | 8 à 12 scènes par carrière : l'introduction, les scènes liées à une carte ou à un drapeau, leurs suites. |
| La ville | 79 à 104 min | Environ 27 min par saison, détaillées ci-dessous. |

Détail de la ville, par saison :
- les scènes de la semaine : ~46 par saison, ~12 min de lecture ;
- les scènes d'entrée et les événements de la semaine : ~8 par saison, ~6 min ;
- la marche et les fondus : ~6 min ;
- six matchs mis en scène : ~3 min.

**La ville fait près des trois quarts d'une partie.**

**Non compté** : flâner. Les activités, les 25 petits jeux, les conversations surprises, la
boutique, toucher les gens. On y passe le temps qu'on veut.

## La méthode

Trois mesures, combinées par `packages/tools/web/duree.js`.

1. **Ce qu'une carrière fait lire.** `packages/tools/bin/duree.dart` joue 300 carrières par
   livre, sans la ville. Il utilise la politique `human_like` de `simulate.dart` (recopiée) et
   les graines `seedOfRun`. Il compte :
   - les cartes par beat ;
   - les caractères lus : le texte, les deux boutons, la phrase de conséquence, les brèves de
     la Une ;
   - les décisions et les saisons ;
   - les scènes jouées du livre que la carrière déclenche. Ce sont l'introduction, `carte`
     (par `prefixe` ou par liste `cartes`), `drapeau` et leurs `suite`. Leur `si` est évalué
     sur l'état du moteur ; le jour, l'heure et les missions sont comptés vrais.
2. **Ce que la ville impose.** `packages/tools/web/joueur_presse.js` joue en ville, dans
   Chromium, la première saison complète des livres 1, 4 et 9. Il joue comme un joueur pressé
   qui suit l'histoire :
   - « Y aller » au rendez-vous, et « Attendre » quand il n'y a nulle part où aller ;
   - il répond aussitôt aux cartes et aux scènes de la semaine ;
   - il fait avancer une scène jouée dès que la réplique est écrite ;
   - il laisse le match du samedi se jouer jusqu'au bout.

   Il chronomètre ce que le jeu impose et note chaque scène de la semaine et chaque réplique.
   Moyenne des trois saisons :

   | Mesure | Valeur |
   |---|---|
   | Durée d'une saison (sans lecture) | 14 à 17 min |
   | Semaines par saison | 7 à 8 |
   | Marche par carte | 5,6 s |
   | Fondus par carte (nuits, semaines, pièces) | 4,1 s |
   | Un match mis en scène | 33 s |
   | Frappe des répliques | 47 caractères/s |
   | Mise en scène hors frappe | 0,6 s par réplique |
   | Scènes de la semaine | 30 à 56 par saison, ~270 caractères chacune |
3. **Le lecteur.** On ajoute le temps de lire et de décider :

   | Lecteur | Vitesse de lecture | Par décision | Pour regarder un classement |
   |---|---|---|---|
   | Moyen | ~220 mots/min (21 caractères/s) | 3 s | 6 s |
   | Rapide | ~280 mots/min (27 caractères/s) | 2 s | 4 s |
   | Lent | ~170 mots/min (16 caractères/s) | 5 s | 9 s |

   Une réplique de scène jouée se lit au moins le temps qu'elle s'écrit, plus 0,4 s pour
   passer à la suivante.

Limites :
- Les taux de la ville (par carte, par saison) viennent de la première saison de trois livres.
  On les applique aux saisons suivantes et aux sept autres livres : la ville est la même pour
  tous.
- Les scènes de la semaine sont tirées une fois par carrière. Si leur réservoir s'épuise dans
  les saisons tardives, la durée est un peu surestimée.

## La refaire

```bash
dart run packages/tools/bin/duree.dart 300 > /tmp/carrieres.json
# la page assemblée avec la ville, servie en HTTP (voir AGENTS.md, « La ville »), puis par livre :
NODE_PATH=/opt/node22/lib/node_modules node packages/tools/web/joueur_presse.js \
  http://127.0.0.1:8765/index.html 0 1 /tmp/saison_0.json 55
node packages/tools/web/duree.js /tmp/carrieres.json /tmp/saison_0.json /tmp/saison_3.json /tmp/saison_8.json
```

Une saison de joueur pressé prend un quart d'heure de temps réel. Il en faut au moins une,
complète : le plafond (55 min) la laisse inachevée si quelque chose bloque.
