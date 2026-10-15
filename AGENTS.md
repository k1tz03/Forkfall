# FUSIBLE — reprendre le projet

Ce fichier existe pour qu'un agent (ou un humain) qui n'a rien suivi puisse
reprendre le travail sans poser de question. Il vaut aussi comme `CLAUDE.md`.

## Ce qu'est le jeu

Un jeu mobile né de *Reigns*, sur une carrière de football. Une carte est une
scène ; on glisse à gauche ou à droite ; on vit une histoire — un livre, avec ses
fins — dans une ville en pixel art, Aubérive. **Le mode histoire** (octobre 2026) :
la carrière s'arrête par l'histoire (la fin du livre, la police, la ruine, la
blessure, le grand déballage), plus par les quatre équilibres d'origine
(vestiaire, tribunes, président, caisse), qui ne tuent plus et ne se montrent
plus : ils restent un climat caché qui choisit les variantes des cartes. On
rejoue avec un successeur. La chronologie va de 1990 à 2050, dans un pays qui n'existe
pas : villes, clubs, journaux, compétitions, personnes — tout est inventé.
Français uniquement pour le moment.

**La règle qui ne se négocie pas** : aucun nom réel de club, de joueur, de
dirigeant, de marque ou de compétition, nulle part — ni dans le contenu, ni dans
les visuels, ni dans les prompts de génération d'images. Ce qui peut être réel,
c'est le *sport* : les règles qui changent, l'argent de la télévision, les stades
tout-assis, l'équipement, les tactiques. Jamais les gens.

## L'état, en une page

| | |
|---|---|
| Contenu | 3 988 cartes, 341 arcs, 123 fins, 249 Nouvelles datées, 548 manchettes de Une, 689 variantes de set-piece, 185 personnages (dont 134 gens de la ville) ; la ville : 855 scènes de la semaine |
| Rôles jouables | entraîneur, joueur, président, directeur sportif, sélectionneur — les dix histoires livrées (voir « Les dix histoires ») |
| Moteur | Dart pur, déterministe, 250 tests, 20 goldens ; le mode histoire (`calendar.yaml` `director.jauges_fatales: false`) |
| Qualité | `dart analyze` propre, `lint` 0 erreur (1 avertissement connu : la part des Unes qui nomment le héros) |
| Bible narrative | `docs/bible/`, 13 chapitres, 565 000 mots, et la **charte d'écriture** (`docs/bible/charte_histoire.md`) |
| La ville | la version jouable : Aubérive en pixel art, la semaine en tranches d'heures, les cartes à leur lieu ; **le Grand Aubérive** : la ville au centre d'un monde de 1 800 voxels, le boulevard de ceinture, quatre quartiers qui s'ouvrent au fil de la carrière (les Hauts, les Tilleuls, le port, la campagne : 26 lieux) et le paysage qui continue jusqu'à l'horizon ; **la ville vivante** : chaque geste laisse une trace (un lien, une habitude, un tuyau, un service, une dette) — voir plus bas ; 39 pièces où l'on entre, modelées à la main ; 191 scènes jouées (les dix introductions, 141 scènes des livres, 40 événements de la ville) ; 319 conversations surprises ; 624 activités (dans les pièces, objet par objet, et dehors ; 38 avec un petit jeu) ; 45 tableaux de rue — voir plus bas |
| Durée | une partie ≈ **2 h** par livre pour un lecteur moyen (1 h 35 à 3 h selon le lecteur et le livre ; 4 h et plus quand une carrière des livres 3 ou 4 déborde), dont près des trois quarts en ville — `docs/balance/duree_partie.md`, `packages/tools/bin/duree.dart`, `packages/tools/web/joueur_presse.js` |

## Les dix histoires (où on en est)

Les dix histoires de lancement (`docs/histoires/00_les_dix_histoires.md`) sont des
livres : chacune remplace le contenu d'un postulat par un prologue, une épine
d'ancres à créneaux fixes, ses intrigues, ses événements sombres, ses fins, ses
Unes, ses set-pieces et sa ville (répliques, missions, scènes de la semaine).

- **Fusionnés** dans cette branche : 1 « Trois mille visages » (entraîneur, promu),
  2 « Le Sapin en carton » (entraîneur, intérimaire), 3 « La Sirène » (joueur,
  pépite), 5 « La Maquette » (président, géant déchu), 6 « 23 h 58 » (directrice
  sportive, vendre trente), 8 « L'Oreillette » (directeur sportif, le modèle, 2024),
  4 « La Route de la Rive » (joueur, fin de contrat), 7 « Chambre 12 » (sélectionneur,
  après le fiasco, 2011), 9 « Vingt degrés dedans » (la sélectionneuse, le Mondial d'hiver
  de 2030) et 10 « Les Deux Téléphones » (présidente, l'escalier fermé, 2037-2040) — ces
  trois derniers repris et finis par un second auteur, sur la branche de leur prédécesseur
  arrêté. **Les dix sont livrés** ; aucun postulat n'est plus `chantier`, et chaque livre
  finit ses carrières sur ses propres fins (63 à 99 % selon le livre, le reste à la police,
  au grand déballage ou à la blessure). **Un livre se ferme** : son postulat déclare `saisons`
  (3, ou 4 pour les livres 7, 9 et 10) et `fin_de_livre` ; au Bilan de la dernière saison, une
  carrière que rien n'a arrêtée finit sur cette fin (`Engine._finDeLivre`, sans tirage), au lieu
  de courir dans le contenu générique (21 à 29 % des carrières des livres 2, 3 et 4 le faisaient).
  Quatre fins de clôture ont été écrites pour cela (`interim_carte_postale`, `pepite_fin_de_poste`,
  `fdc_quatorze_mai`, `modele_cinq_heures`). Les fins des longues carrières (la retraite, la
  statue…) ne s'atteignent plus dans les livres.
- **Un même prénom, deux personnes** : la Sacha du livre 4 (six ans en 1990) et celle du
  livre 9 (la fille de la sélectionneuse, vingt-sept ans en 2029) ont deux fiches (`sacha`,
  `sacha_fille`). Quand un livre réutilise un visage commun, l'étiquette de la fiche est
  celle de son premier livre, sauf quand la fiche a des **`etiquettes`** par époque
  (`[{des: année, label}]`, validées par `build_content`, lues par l'aperçu selon l'année de
  la carrière) : Vaubourg président de la Ligue en 1998, Bréhaut directeur sportif puis
  président de la Fédération, Vecchio ancien gardien, Gégé « socio numéro 1 » en 2037… Les
  autres visages communs en manquent encore là où un livre les fait vieillir.
- **À la fusion d'un livre** : `git merge --no-ff --no-commit histoire-hN`, puis, si les
  ajouts en fin de `characters.yaml`, `portraits.yaml` ou `flags.yaml` se sont mêlés à
  ceux d'un autre livre (le cas des livres 7 et 10 dans `portraits.yaml`),
  `docs/histoires/chantier/outils/union_ajouts.py histoire-hN <fichiers>` les reconstruit ;
  l'heure et la couleur de la cartouche dans `HISTOIRES` (preview_template.html) ; la
  variante du livre dans « Les douze pages » (le grand déballage) ; build, lint, tests,
  goldens (avec leur raison), `simulate --assert`.

## L'arborescence

```
packages/core/     moteur déterministe, Dart pur (aucun Flutter, aucune I/O)
packages/tools/    build_content, lint, simulate, et l'aperçu web (web/)
content/           la source YAML → content/build/content.json
app/               l'application Flutter
docs/brainstorm/   la bible de conception (11 sections) — le pourquoi
docs/bible/        la bible scénaristique (13 chapitres) — la matière écrite ; charte_histoire.md fait loi pour l'écriture
docs/design/pixel_iso/  le moteur de rendu voxel de la ville (Node) et ses rendus
docs/design/       les directions artistiques (dont trois rejetées)
docs/spec_variete_narrative.md   la spec du metteur en scène (mécanismes, budgets)
docs/balance/      les rapports d'équilibrage, avant/après
```

### Le moteur (`packages/core/lib/src/`)

| Fichier | Ce qu'il fait |
|---|---|
| `engine.dart` | démarre une carrière, sert une carte, applique un choix ; toute la boucle |
| `draw/director.dart` | le metteur en scène : quelle carte à quel moment, et pourquoi |
| `state.dart` | `GameState`, entièrement sérialisable — c'est la sauvegarde |
| `content.dart` | le bundle compilé, lu une fois au démarrage |
| `condition.dart` | le langage des `when` (`flag('x')`, `relation.gege >= 1`, `season >= 2`…) |
| `effects.dart` | ce qu'un choix fait (jauges, relations, drapeaux, réactions, fins…) |
| `world.dart` | le championnat simulé (points, journées, verdict de fin de saison) |
| `standings.dart` | le classement affichable, dérivé de `world` |
| `text.dart` | les placeholders (`{prenom}`, `{toi}`, `{annee}`…) |
| `sfx.dart` | quelle ambiance et quels sons pour la carte servie |
| `goldens.dart` | rejoue un Code de Carrière et en calcule l'empreinte |

**Le mode histoire** (`DirectorConfig.jaugesFatales`, faux dans le contenu du jeu, vrai par
défaut pour les contenus de test) : une jauge à 0 ou 100 n'arrête plus la carrière, le
bandeau « une fin devient atteignable » se tait, et l'aperçu ne montre plus les jauges (le
rail, l'écran de fin, les activités de la ville). Les fins que seule une jauge posait
« dorment » : `build_content` les marque `dormante`, elles sortent du Cimetière, et le lint
les accepte tant que leur `cause:` dit `jauge` ; un `end:` qui les vise les réveille. Mesuré
au changement : 40 à 89 % des carrières d'un livre s'arrêtaient sur une jauge, au milieu du
livre ; elles finissent maintenant sur les fins écrites.

**Le Fusible, le mode éclair** (`docs/histoires/mode_eclair.md`) : une carrière de dix minutes à
côté des livres — un rôle et une époque tirés de la graine, quatre jauges visibles et mortelles, pas
de ville, un score en « semaines tenues », un défi du jour (la date → un rôle et une graine, par
hachage, sans serveur). Cinq postulats cachés (`mode: eclair`, index 10 à 14 : `eclair_entraineur`,
`_joueur`, `_president`, `_ds`, `_selectionneur`), forcés `chantier` par `build_content` — jamais
listés ni tirés ; `GameState.mode` (écrit dans la sauvegarde seulement s'il vaut `eclair`) ;
`packages/core/lib/src/eclair.dart` (`jaugesMortelles`, `semainesTenues`, `defiDuJour`,
`carteDeLivre`) ; le contenu (`content/cards/{president,ds,selectionneur}/eclair.yaml`,
`common/eclair_bureau.yaml`, `entraineur/eclair.yaml`, les fins `ec_tenu_*`) ; la page
(`preview_eclair.js`, clé `fusible.eclair.v1`, jamais une sauvegarde de livre) ; le classement du jour
facultatif (capacité `db`, un document `eclair/<id>` écrit à la fin d'un défi du jour) ; le banc
`packages/tools/bin/eclair.dart` (`--fins`, `--fuites`, `--jours`). **Règles** : l'index des cinq
postulats est le Code de Carrière et leur ordre fixe le défi de chaque jour ; un événement commun qui
doit s'ouvrir en éclair nomme `eclair_<rôle>` dans ses `postulats` ; une carte du mode se lit derrière
`flag('eclair')` ; une carte de livre ne sert jamais en éclair ; le miroir JS `defiDe` reste d'accord
avec `defiDuJour` (valeurs épinglées dans le test) ; un contenu ajouté au mode se mesure (soixante à
cent cartes pour un joueur ordinaire). Les fins des longues carrières (la retraite, la statue…) ne
s'atteignent plus que là : une fin commune atteinte en éclair entre au Cimetière, pas une fin de jauge.

**Le déterminisme est le socle de tout le reste** (partage d'un run, défi entre
amis, sauvegarde, tests). Trois règles à ne jamais casser :

1. Aucun aléa hors du `Rng` porté par `GameState`, consommé dans un ordre fixe.
2. Aucune itération de `Map`/`Set` non triée avant un tirage.
3. Toute liste sérialisée a un ordre stable.

Les 20 goldens (`content/tests/goldens.yaml`, `packages/core/test/goldens_test.dart`)
échouent si une carrière figée ne se rejoue plus à l'identique. Quand un
changement de contenu ou de calendrier les casse **légitimement**, on les
régénère avec `--goldens --write --recode` et **on écrit la raison** dans
l'en-tête du test.

## Les commandes

```bash
dart pub get
dart run packages/tools/bin/build_content.dart   # YAML → content/build/content.json + app/assets/content.json (+ content/build/livres/)
dart run packages/tools/bin/lint.dart            # 0 erreur exigé
cd packages/core && dart test                    # 250 tests (dont livres_test : l'aperçu découpé par livre)
dart run packages/tools/bin/simulate.dart --runs 2000 --assert   # budgets d'équilibrage
```

`simulate` porte tout l'outillage d'analyse : `--narrative --postulat i` (les
budgets de variété et d'histoire), `--reservoir` (à quelle fréquence chaque
intrigue s'ouvre), `--arc <id>` (le détail d'une intrigue), `--trace <graine>
--seasons n` (une carrière lisible en clair), `--diff a b` (deux carrières côte
à côte), `--une-check`, `--goldens`.

L'aperçu web jouable (un seul fichier HTML autonome, aucune ressource externe) :

```bash
dart compile js -O2 packages/tools/web/preview.dart -o /tmp/engine.js
node packages/tools/web/assemble.js --engine /tmp/engine.js --out /tmp/fusible.html
```

**Le contenu de l'aperçu, par livre** (`packages/tools/bin/src/livres.dart`,
`packages/tools/web/demarrage.js`) : la page ne lit plus le bundle entier au démarrage.
`build_content` le découpe en un commun (ce que l'accueil, la ville et tous les livres
lisent) et un bundle par livre, dans `content/build/livres/` ; `assemble.js` les compresse
(gzip), vérifie l'inflate de secours à l'octet et la fusion livre par livre, et refuse un
découpage qui ne vient pas de `content/build/content.json` (relancer `build_content`). Le
fichier seul les embarque tous (base64, le moteur aussi) ; la version jouable les pose à côté
de la page (voir « La ville »). `window.FusibleContenu` : `contenu()` rend le commun, puis
commun + le livre de la carrière (le même objet, ses listes remplacées) ; `livre(postulat)`
charge et fusionne le livre avant que le moteur ne le lise — `startRun`, la reprise de la ville
et `FusibleApercu.demarrer` (qui rend une promesse tenue au départ) le font ; un nouveau chemin
qui commence ou reprend une carrière passe par eux. Les listes découpées sont `cards`, `arcs`,
`unes` et, dans la ville, `scenes`, `cinematiques`, `conversations`, `missions`,
`lieux_variantes` (`setpieces.*` et `paroles` gardent leur longueur, un bouche-trou inerte à la
place des items d'un autre livre) : un module qui en garde un index le refait par
`FusibleContenu.apresFusion(fn)`, ou les lit à la demande. Plus de `#fusible-content` dans la
page : un banc lit `FusibleContenu.contenu()` ou `content/build/content.json`.
`packages/core/test/livres_test.dart` prouve, livre par livre, qu'une carrière sur commun +
livre est celle du bundle entier (goldens, carrières simulées avec la ville, l'héritage des
fantômes, le samedi en direct) ; un contenu qui la casse dit le livre, la graine et la carte.

L'application Flutter : `cd app && flutter pub get && flutter analyze && flutter test`.

## La ville (la version jouable)

La couche « Punch Club » de la préproduction, branchée sur le vrai moteur :
`content/ville.yaml` (les lieux, qui on trouve où, ce qu'on y fait), `Engine.activite`
(une activité bouge les jauges sans rien tirer), et la coquille web avec
`packages/tools/web/ville.js` + `ville.css`. La ville décide **où et quand** une carte se
montre : chaque carte a un lieu (son `lieu:`, sinon son locuteur, sinon son beat) et une
fenêtre dans la semaine (deux ou trois cartes du lundi au vendredi, le match le samedi à
15 h, le classement le dimanche) ; un événement sombre ne s'annonce pas, il tombe le soir.
Le temps et l'argent sont tenus par la coquille (l'énergie et la faim de la préproduction
sont parties avec le mode histoire ; un compteur caché, `eveil`, dit seulement depuis combien
de tranches on n'a pas dormi, pour les répliques) ; la partie se sauvegarde par l'état entier
du moteur (le Code de Carrière ne rejoue pas la ville), **une case par livre**
(`fusible.ville.v2.<id du postulat>` ; l'ancienne case unique `fusible.ville.v1` est rangée dans
celle de son livre à la première lecture) : lancer un livre n'efface jamais celui d'un autre, et
recommencer un livre en cours passe par un dialogue (Reprendre, Recommencer en deux touches,
Retour) ; une carrière finie libère sa case.

Ce que la ville porte en plus des cartes :

- **Les scènes de la semaine** (`content/ville/scenes*.yaml`) : le moteur ne sert que deux ou
  trois cartes entre deux samedis ; chaque jour sans carte, et souvent le soir, la ville
  programme une scène (un texte, un ou deux choix, des effets légers), à son lieu et à son
  heure ou qui vient à toi (`rue`, `domicile`). Quand l'heure arrive (une activité,
  « Attendre », « Y aller », le réveil), la ville s'y rend d'un fondu : on ne saute plus trois
  jours sans que rien n'arrive. **« Attendre »** (en bas, ou « Attendre ici » dans le panneau
  d'un lieu) fait passer le temps jusqu'à ce qu'il arrive quelque chose — une scène, quelqu'un
  qui vient te chercher, le rendez-vous qui s'ouvre (un toast dit où), l'heure d'une mission ;
  la nuit, on rentre dormir sous le noir (trois nuits au plus d'un geste), d'un seul fondu
  court, l'heure qui défile dessus (deux secondes au plus : « La boucle », plus bas).
  Mesuré en jouant l'histoire 4 en n'attendant que : 3,3 gestes vides entre deux choses
  avant, 1,3 après ; puis cinq secondes de fondus pour franchir un dimanche soir (la nuit, la
  paie) avant la boucle, une demi-seconde jusqu'à la carte du lundi après. Une scène
  est une mission d'une seule étape (`scene`) que le
  moteur applique sans tirage ; une fois par carrière ; `mission(<id>)` lit une scène vue. Le
  plan du jour se tire de la graine, de la semaine et du jour.
- **La boucle** (`ville_rythme.js`, `ville_chapitres.js`) : la mesure QA en jouant le livre 4
  quinze minutes — 1,5 décision par minute, 42 % du temps à regarder le héros marcher, 22 % à
  attendre, trois minutes vingt de la touche d'une histoire à sa première décision — a fait
  trois remèdes. **La marche** : au-delà de 30 cases de chemin (`MARCHE_COURTE`, une seconde trois quarts
  de marche ; multipliée par `usage.vitesse` avec un véhicule), « Y aller », un nom
  touché, le plan, la flèche ne marchent plus : un fondu de 0,35 s + 0,35 s, le héros à la porte
  du but (dans sa pièce, s'il y entre : un seul fondu), puis la même arrivée qu'au bout d'une
  marche ; toucher la ville pour marcher reste une marche, l'hélicoptère garde son fondu à
  lui. **Le temps** (`laisserPasser`) : « Attendre », et « Y aller » vers un rendez-vous plus
  tard, ne sont qu'un fondu court, les tranches, les échéances et les nuits chez soi passant
  dessous, l'heure qui défile en gros sur le noir (deux secondes au plus). **L'ouverture** :
  l'introduction jouée, la première carte se montre là où l'on est (`ouvrirSurUneCarte`), sans
  marche ; l'aide de la ville se dit après la première réponse. **Un chapitre par semaine** :
  au passage du dimanche soir au lundi (le crochet `jour`, pas le rendez-vous « Le journal du
  dimanche » : il n'existe qu'aux cartes Classement, deux fois par saison), un panneau « Une de
  la semaine » — la manchette et les brèves tirées de `S.chap`, le carnet que la ville tient de
  la semaine (l'Almanach neuf de la frise, le match, un lien qui a changé, une dette, les
  réponses données) —, puis « La semaine prochaine… » (rendez-vous, match, mission et son
  délai, dettes, un quartier qui s'ouvre), puis [Continuer] ou [Reprendre plus tard] (la partie
  est sauvée, on retourne à l'accueil, on reprend au lundi matin). Au retour d'une partie
  sauvée : « Pendant ton absence… ». Le prochain rendez-vous est gardé dans le `localStorage`
  (`fusible.rappel`) pour que l'accueil le dise. « Attendre » se dégrise de lui-même quand la
  ville est au repos (il restait grisé dehors après un « Sortir »). Mesuré après coup : un
  « Y aller » vers le port ou la campagne passe de 10 à 18 secondes à moins d'une seconde ; la
  première carte suit l'introduction passée de 0,1 seconde, dans les dix livres.
- **Le match à la Rive**, le samedi : la ville va au stade (les passants vers les grilles,
  puis la sortie), vingt-deux joueurs, l'arbitre et le ballon sur la pelouse, les deux tribunes
  remplies selon la jauge tribunes (peintes une fois avec la profondeur du décor), deux ou trois
  actions racontées à leur minute (`ville.yaml` `match:` et les lots `match_textes:`), le tableau,
  la mi-temps, le résultat, et le score peint sur le mur est jusqu'au samedi suivant. Le moteur
  joue un bloc de six journées d'un tirage ; la ville met en scène la dernière, et son score se
  tire de la lettre (V, N, D) pour l'écran seulement.
- **Le samedi en direct** (`docs/histoires/samedi_direct.md`, `content/ville/match_direct.yaml`,
  `ville_direct.js`, `match_direct.dart`) : à la Rive, la ville garde le choix de posture et joue le
  match ; une à trois fois (une au premier samedi, deux ou trois au derby, trois à la dernière
  journée), le jeu s'arrête : la minute, le score, une scène, deux gestes, cinq secondes (dix au
  toucher ou en mouvement réduit ; sans geste, le passif). Un seul appel au moteur
  (`fusibleChoose(droite, direct)`) : le script (`Engine.samediDirect`, pur) se refait à l'identique,
  les mêmes tirages résolvent le bloc, seules les bornes de la dernière journée bougent (±6 points par
  geste, ±10 sur la victoire et ±8 sur le nul par match) ; la trace va dans `GameState.direct` (trente
  au plus). Sans décision, rien ne change (goldens, `simulate`) ; le Code de Carrière ne rejoue pas les
  décisions. Soixante décisions par rôle, situation, moment et époque ; la semaine en ouvre (le
  vestiaire, un lien de deux crans) ; `build_content` vérifie qu'aucun samedi ne reste muet. Ni la
  Coupe, ni le Grand Match, ni le Mondial du livre 9 n'ont de direct.
- **Les échos** (`preview_echos.js`, banc `mesure_echos.js`) : en mode histoire les jauges se taisent ;
  deux choses rares montrent ce que les choix ont fait. *La ligne* : après une réponse d'enjeu, une
  phrase sans chiffre (« Gégé s'en souviendra. », « Ça reviendra. », « Ça se saura en ville. »), posée
  dans la rangée du menu sur une carte, au-dessus du message du récit sur le plan. *Le ruban* : plus
  tard, sur la carte qui lit ce que la réponse a posé (sablier `schedule`/`next`, variante d'étape,
  `when`, ouverture d'intrigue), « ↩ Parce que tu as dit « … » ». Calculé sur les vues du moteur et
  le contenu (condition évaluée à trois valeurs : rien n'est attribué à tort), mémoire par carrière
  (`fusible.echos.v1:<livre>:<graine>`, bornée, effacée à la fin). Rythme : ≈ 3 lignes et ≈ 1 ruban
  par quart d'heure (`node packages/tools/web/mesure_echos.js --engine <engine.js> --assert`).
- **Le partage** (`preview_partage.js`) : « Partager ma Une » compose une affiche (story 1080×1920 ou
  carré 1080×1080) sur un canvas à partir de l'écran de fin, envoyée par le partage du téléphone, sinon
  la capacité `downloads`, sinon l'appui long ; « Fais mieux que moi » : un code de défi de 16 signes
  (livre, graine, fin, cartes, avec une somme de contrôle) et le prénom, en lien `?defi=` ou collé sur
  l'accueil ; le défi relevé finit sur la comparaison des deux fins ; le livre du jour (la date locale
  donne le livre et la graine, les mêmes pour tous) et, dans l'artefact, la part des joueurs par fin
  (base partagée : un document `jour/<id>` par joueur). Un défi ou le livre du jour part sans héritage
  des fantômes. À la publication : `capabilities: {db: {rules: [{path: "jour", read: "view", write:
  "owner"}, {path: "jour/{self}", write: "interact"}]}, user: {}, downloads: true}`.
- **Le domicile** (`ville.yaml` `domiciles`) : par rôle (le sélectionneur à l'hôtel de la Rive),
  et une histoire peut en décider autrement par un drapeau.
- **Loin d'Aubérive** (`ville.yaml` `loin`) : un drapeau d'histoire dit qu'on est parti (le
  Mondial du livre 9, `h9_loin`). Tant qu'il est posé, la ville attend : chaque carte se joue
  tout de suite devant le décor qu'il nomme (`ailleurs`), le match ne se joue plus à la Rive,
  ni scène, ni mission. La carte qui lève le drapeau sur ses deux choix est celle du retour : un
  fondu (« De retour à Aubérive », le texte du retour et la paie des semaines passées), le lundi
  matin chez toi, puis cette carte à son lieu ; en ville, le drapeau se lit déjà levé.

- **Les gens** : personne n'apparaît au milieu de la rue ; un passant sort d'une porte ou
  arrive du hors-champ, et marche au large des murs (une grille érodée, des chemins qui ne
  rasent aucun angle). Les personnages connus (`presences` : le casting de l'histoire, et ceux
  qu'une carte ou une scène de la semaine t'a fait rencontrer), celui qui t'attend et les
  commerçants sortent de chez eux et y rentrent. On les **touche** : ils s'arrêtent et disent
  une réplique du moment, tirée de `content/ville/paroles_*.yaml` selon son `si` (une petite
  grammaire, ET seulement, que `build_content` valide et que `ville.js` évalue — les deux
  doivent rester d'accord).
- **Les missions secondaires** (`content/ville/missions*.yaml`), rares : un donneur à un lieu
  et une heure, des étapes avec rendez-vous et délai, de l'argent propre ou sale, des effets
  appliqués par `Engine.mission` ; leurs risques sont des événements sombres du moteur
  (`ville_risques`).
- **La boutique et les biens** (`content/ville/boutique.yaml`) : vêtements, montres,
  voitures, logements, hélicoptère ; achat en deux gestes, revente, effets par
  `Engine.biens` (drapeaux `bn_*`), usage en ville (la vitesse, l'hélicoptère),
  saisies.
- **L'album d'Aubérive** (`content/ville/album.yaml`, `bin/src/album.dart`, `preview_album.js`,
  `ville_album.js`) : les pochettes du tabac-presse et du kiosque (`jeu: pochette`, quatre vignettes,
  3 F de 1990) remplissent un album qui se garde d'une carrière à l'autre (`fusible.album.v1`) :
  232 vignettes sur 19 pages (les 185 visages par camp et par époque, les maillots, les champions de
  1962, la finale de 1974, tes Unes), 32 brillantes. Le tirage vient de la graine de la carrière et du
  compteur de pochettes (jamais de `Math.random`). On en gagne (un lien qui monte, un service rendu, les
  fins du Cimetière : `profile.recompenses.pochettes`) et on échange deux doubles contre une vignette
  avec six personnes (Gégé, Nino, Hagop, Aram, et les gamins du city-stade) : un geste caché
  `album_echange_<gens>`, donc un point de lien. Une page finie paie (pochettes, tuyau, francs, un
  quartier ouvert d'avance). La cinquième de 1974 est une brillante sans nom ; l'album l'annonce par
  l'événement `fusible:album` (`{type: 'brillante'|'page', id}`), que le dossier 1974 écoute.
- **Le dossier 1974** (`docs/histoires/dossier_1974.md`, `content/ville/dossier_1974.yaml`,
  `preview_dossier.js`, `ville_dossier.js`) : la finale de 1974 et son cinquième visage gratté
  deviennent une enquête qui se garde d'une carrière à l'autre (`fusible.dossier.v1`) : douze pièces,
  une au moins par livre (un tiroir, des scènes de la semaine, des conversations surprises, deux scènes
  jouées du livre 10, la fin du livre 1, la brillante de l'album), un onglet du Carnet, et un épilogue
  en mars 2050 qui se joue depuis l'accueil quand le dossier est complet. Le secret de « Trois mille
  visages » reste à ce livre : seule l'ardoise le dit, et elle ne s'obtient qu'en finissant le livre 1
  sur une de ses fins ; les autres pièces parlent de l'homme en écharpe, jamais de l'enveloppe.
- **Tes fantômes** (`docs/histoires/fantomes.md`, `content/ville/fantomes.yaml`,
  `content/cards/common/fantomes.yaml`) : chaque carrière finie laisse son nom, son livre, ses années,
  sa fin et trois faits au plus (`fusible.fantomes.v1`) ; un livre plus tardif en hérite au crochet
  `debut` par `Engine.heritage` (aucun tirage, seulement des drapeaux `fantome_*`/`dossier_*` et des
  noms) : le vieux du Corner qui se trompe, une plaque, le livre de Léa, Mbako en 2024. Un livre ne se
  souvient que des livres qui commencent avant lui. Le Code de Carrière ne rejoue qu'avec le même
  héritage (la page le garde par graine, `fusible.heritage.v1`) ; un défi ou le livre du jour part sans
  héritage (`FusibleDossier.sansHeritage()`).
- **Les intérieurs** (`docs/design/pixel_iso/interieurs_jeu.js`, `pieces/`, `pieces/_plan.js` ;
  `packages/tools/web/ville_dedans.js`) : on entre dans tous les lieux qui ont une porte (39 pièces,
  toutes modelées à la main ; une pièce ajoutée au plan sans son fichier sort en ébauche). Une pièce
  est une petite carte (son image de jour et de nuit, sa profondeur, sa grille, sa porte) que la ville
  substitue à la sienne : on y marche, on touche ses **objets** (les activités qui les nomment,
  `objet:` ; chaque objet en a au moins une), on y croise ses **occupants** (le patron, les habitués
  à leurs **places**, les clients selon l'heure, celui qui t'attend) ; le bouton **« Ici »** ouvre la
  pièce entière (ce qui ne tient à aucun objet, ses objets, ce qui s'y vend). Le plan est le contrat :
  ses ids d'objets et ses noms de places ne changent plus. Le moteur de rendu tient 255 matières : une
  pièce n'en crée pas, elle peint ses surfaces d'un pinceau (`<clé>_pinceau`, voir les pièces).
- **Les scènes jouées et les conversations** (`content/ville/cinematiques_*.yaml`,
  `ville_cinema.js` ; le format : `docs/histoires/scenes_jouees.md`) : des scènes qu'on regarde
  (l'introduction de chaque histoire, `quand: debut` ; avant ou après une carte ; après un drapeau ;
  en entrant ; un jour de la semaine), mises en scène dans une pièce ou devant un lieu — les
  figurines marchent, font un geste, une émotion au-dessus de la tête, la boîte de dialogue porte le
  portrait des cartes et le néon de l'histoire, la caméra se rapproche de ceux qui parlent ; une scène
  s'enchaîne dans un autre lieu (`suite`), se joue sous la pluie, la neige ou la brume (`meteo`), avec
  ses bruits (la sonnerie, la sirène, une porte…), parmi les gens de son heure (ou seule, `vide`) ; et
  des **conversations surprises**, en bulles, qu'on entend en passant près de ceux qui parlent. Pour
  regarder une scène sans jouer la carrière : `packages/tools/web/voir_scene.js` (le guide le dit).
- **La vie des pièces et des rues** (`ville_vie.js`, `content/ville/tableaux.yaml`) : dedans, chacun a
  ses habitudes selon l'ambiance de la pièce (boire, rire, lire, téléphoner à partir des portables,
  fumer avant l'interdiction, changer de table) ; dehors, des tableaux vivants devant les lieux, à
  leur heure (les fumeurs devant le bar, les gamins au ballon, les anciens sur leur banc, la messe,
  un mariage le samedi), un par lieu au plus, tirés de la graine du jour ; on les touche, ils disent
  une parole des gens. Des gestes à l'écran : le moteur n'en sait rien.
- **Les petits jeux et les gestes à part** (`ville_jeux.js`) : une activité peut porter un jeu
  (`jeu:` la cible, le 421, les jongles, le baby-foot, le flipper, les cartes, les tirs au but) ou un
  geste (`special:` dormir, la télé, le téléphone, le journal). Les modules de la ville partagent sa
  fermeture : `assemble.js` les insère au repère `/*__VILLE_MODULES__*/` et refuse un nom redéclaré.
- **Le pont** : une carte agit sur la ville par des compteurs `var:` en francs de 1990 —
  `ville_francs`, `ville_francs_sales` (l'argent sale salit ce qu'il paie : saisi en premier),
  `ville_amende`, `cadeau_<objet>`, `rendre_<objet>` (un seul objet rendu),
  `saisie_vehicules|logement|luxe|tout`, `vol_luxe` ; la
  ville retient ce qu'elle en a appliqué. L'argent s'affiche selon l'époque (inflation, puis
  l'écu après `monde_ecus`).
- **Le plan** : la ville vue de loin (`plan.webp`), un point par lieu, toi, le rendez-vous ; les
  quartiers fermés sous leur brume, avec ce qui les ouvrira.
- **Le Grand Aubérive** (`docs/histoires/grand_auberive.md`) : « dommage que l'on ait un carré avec
  la carte et qu'autour il n'y ait rien » (le porteur). La ville est posée telle quelle en (400, 400)
  d'un monde de 1 800 voxels (`zone.js`, `buildZone({grand: true})`), dans un boulevard de ceinture
  qui passe la Rive sur deux ponts ; autour, quatre quartiers modelés chacun dans son fichier
  (`district_hauts.js` les tours et l'argent de la télévision, `district_tilleuls.js` la cité,
  `district_port.js` les docks et ce qu'on y décharge, `district_campagne.js` les champs, le centre
  du Bois-Joli, le manoir) ; leurs lieux dans `content/ville/grand_auberive.yaml`. Au-delà du monde,
  plus de maquette sur fond beige : `fond.js` peint un paysage qui continue (des champs dans les
  matières du monde, des haies, des bois, la Rive, les routes et la voie ferrée qui s'en vont, la
  brume, la Capitale à l'horizon) et le moteur efface la tranche du monde (`bordMonde`). Un quartier
  s'ouvre à la 4ᵉ semaine (les Tilleuls), à la 8ᵉ (le port), à la 2ᵉ saison (les Hauts), avec un
  véhicule ou à la 12ᵉ semaine (la campagne), ou par un drapeau d'histoire `quartier_<clé>`
  (`ville_quartiers.js`) ; fermé, il reste visible sous sa brume (`brume_<clé>.webp`, rendue avec la
  ville), on n'y marche pas, ses lieux, ses scènes et ses conversations se taisent.
- **La ville vivante** (`docs/histoires/ville_vivante.md`, `ville_gens.js`) : « toutes ces actions
  anodines n'ont aucun effet sur le jeu » (le porteur). Aubérive se souvient : chaque activité compte
  dans une **habitude** (`habitude:`, douze : comptoir, nuit, jeu, sport, soin, culture, foi,
  famille, largesse, luxe, quartier, travail ; dix gestes font une réputation `rep_<habitude>` et sa
  ligne d'Almanach) ; un geste fait **avec** quelqu'un (`avec:`, ou les `activites:` d'une personne)
  lui donne un point de **lien**, un au plus entre deux cartes, et aux seuils (2, 5, 9) la relation
  du moteur monte d'un cran — un palier programme sa carte (`on_relation`). **Les gens d'Aubérive**
  (`content/ville/gens_*.yaml`, `gens:`) tiennent les lieux selon l'époque (`annees` ; hors de ses
  années, une personne n'est pas là et un geste ne lui donne rien) : leur voix selon le lien
  (`repliques`), dès +1 le **climat** de leur réseau (la jauge cachée dite avec leurs mots,
  `climat: bas|moyen|haut`, par rôle), dès +2 leurs **tuyaux** (une fois, un drapeau `tuyau_<id>`
  que les livres lisent, parfois un drapeau du livre posé directement), dès +3 leur **service** (une
  fois par saison, parfois une **dette** `dette_<id>` qu'une scène viendra réclamer), leurs scènes
  de la semaine et leurs cartes de palier (`content/cards/common/paliers_ville_*.yaml`). Huit lots,
  134 personnes de 1990 à 2050 : les comptoirs, les notables, le club, le quartier (`gens_*.yaml`) et
  les quatre quartiers du Grand Aubérive (`quartier_*.yaml`, avec leurs activités, leurs scènes et
  leurs paroles) ; 384 tuyaux, dont une trentaine posent un drapeau ou une variable d'un livre. Celui
  qui tient un lieu sans pièce se tient devant, comme les commerçants ; `jours:` dit les jours où
  l'on est là (le marché : mercredi, samedi, dimanche). Deux lots écrits en même temps se donnent
  les mêmes prénoms : à la fusion, aucun prénom de la ville ne doit appartenir à deux personnes
  (hors d'une même famille), et aucun patronyme ne doit faire écho à un footballeur. La ville
  montre la trace sous l'activité, un bandeau quand un lien change de cran ou qu'une réputation
  naît, et le **Carnet** (les gens, ce qu'on t'a confié, ce que pense la ville, ce qu'on dit de
  toi ; les affaires en second onglet). Un nouveau visage ne prend pas un mot des réservoirs de
  noms (`content/names/fr.yaml`) : `build_content` le refuse, sinon toutes les carrières figées
  changeraient.
- **La musique** (`packages/tools/web/audio.js`, le moteur ; `packages/tools/web/musique/<clé>.js`,
  un fichier par thème ; la bible et le guide du compositeur : `docs/design/bande_originale.md`) :
  des thèmes NOIRS écrits note à note et synthétisés (aucun fichier son) — de la synthé noire et
  moite qui rejoue les années quatre-vingt sur une cassette fatiguée, parce que la première
  partition, en majeur, était « beaucoup trop joyeuse » pour des histoires sombres. La bible en
  prévoit vingt ; « Fusible » à l'accueil est le modèle (une basse qui court en octaves, une
  accroche de quatre notes, une boucle de trois minutes) ; La Filature (ville le jour), Néons (le
  soir), La Rive (le stade), Garde à vue (une carte sombre) et Le Dernier Tour (la fin, sur le
  motif de l'ancien thème de l'accueil) attendent leurs compositeurs. En fondu enchaîné, et un
  jingle au départ d'une histoire. **Où chacun joue** (bible § 4, `themeDuMoment` du gabarit) : en
  ville le jour, le thème du livre en cours (`livre_hN`) un jour sur deux, le premier compris (son
  introduction jouée a le même : une scène jouée demande `musique: livre`), la promenade l'autre ; les
  quartiers (`decouverte`) le jour d'une découverte (l'événement `fusible:decouverte` : un quartier
  qui s'ouvre, une pièce du dossier ; une page d'album finie) ; la montée (`joie`) jusqu'au lendemain
  d'un bilan tenu ; le soir et la nuit, les néons ; le stade, la Rive ; une carte sombre, la garde à
  vue ; le grand déballage et les décisions du samedi en direct, `suspense` ; le mode éclair,
  `enerve` ; la fin, le dernier tour. Un thème absent de `musique/` cède sa place au plus proche
  (`themeOu`). **La reprise** : en ville on quitte un thème et on y revient sans cesse ; un thème
  retrouvé dans les dix minutes reprend à la section qui suit celle qu'on a quittée (`audio.js`,
  `reprise`), pas à son introduction — chaque section d'un thème doit pouvoir ouvrir le morceau.
  Un thème s'inscrit par `FusibleAudio.theme(clé, définition)` ;
  `musique_sources.js` pose les fichiers après audio.js (l'aperçu, le banc, le juke-box), chacun
  dans son filet : une erreur n'emporte que son thème (`FusibleAudio.erreurs()`).
  Sous un thème, les couches d'origine se taisent : la nappe, et le lit continu des lieux (la
  pluie, le néon, la rumeur — « un schlash continu » au retour du porteur, mesuré plus fort dans
  les aigus que les thèmes) ; il ne reste du lieu que de rares bruits d'objets, bas (une goutte,
  une porte, des pas, un ballon). En ville, le lieu sonore est la pièce où l'on est, sinon la
  rue ; une carte ouverte a le sien.
  Le moteur a ses effets : la grosse caisse fait pomper les voix `pompe`, un écho ping-pong
  (`echo`), la saturation (`drive`), un filtre par voix que la section balaie (`ouvre`), la
  caisse claire « gated » (`S`, et sa porte `batt.porte`), la montée (`z`) ; la salle d'un thème
  (`salle`, `rev`), la cassette (`cassette`, `flotte`), et les instruments `supersaw`, `reese`,
  `stab`, `vox`, `sqbasse`, `pluck2`. La grille : seize cases par mesure, une note attaque, `-` la
  tient, `.` se tait, `~` glisse, `!` accentue ; la basse et les accords en degrés sur la grille
  d'accords ; « L'ÉCRITURE » et « LES VOIX », en tête de la musique dans audio.js, disent tout. On
  vérifie sans haut-parleur : `NODE_PATH=/opt/node22/lib/node_modules node
  packages/tools/web/banc_son.js --boucle --mp3 --out /tmp/son` rend chaque thème (l'introduction
  et deux passages de la boucle) en WAV et en MP3, avec ses niveaux, sa période, sa couture, ses
  sources, un spectrogramme et sa courbe d'énergie (cibles : moyenne −21 dB à ±1,5, crête sous
  −3 dB, 20 % de l'énergie au moins au-dessus de 250 Hz, boucle de 2 min 30, 4 min en ville) ;
  `--verifier` compile seulement, en Node. Le juke-box (`node packages/tools/web/juke_box.js --out
  <dossier>`) les joue tous en direct, pour l'oreille du porteur. Sur une même machine, le rendu
  hors ligne se refait au bit près (l'écho n'a plus qu'un retard dans sa boucle : deux retards
  imbriqués se faisaient servir par Chromium dans un ordre qui changeait d'un rendu à l'autre) ;
  d'une machine à l'autre, une crête peut bouger d'un dixième de décibel.
- **La ruine** : le découvert qui survit à la paie du dimanche fait écrire la banque ;
  s'il dure une semaine de plus, l'huissier vend ce qui se vend (le moins nécessaire
  d'abord, à moitié prix) ; quand il ne trouve plus rien et que le trou dépasse une paie,
  le tribunal de commerce : la fin `co_banqueroute` (`content/endings/ruine.yaml`), posée
  par `Engine.banqueroute`.
- **L'accueil** : la porte d'Aubérive en pixel art. Le panorama de la ville défile sous le
  titre (au crépuscule, de nuit de minuit à 5 h), FUSIBLE est posé au pixel, et chaque
  histoire est une cartouche : une vignette découpée dans la ville à son lieu et à son heure
  (le stade la nuit, la gare routière, la friche au coucher…), sa couleur, l'heure que le
  livre fait revenir (16:00, 23:58, 06:10…), ses puces (rôle, division, année, « Jouée ×n »)
  et « Nouveau » quand elle n'était pas là à la visite précédente. Les images sortent de
  `docs/design/pixel_iso/accueil.js` (les rendus de la ville → `packages/tools/web/accueil/*.webp`,
  commités, embarqués en `data:` par `assemble.js` dans le fichier seul, posés dans `accueil/` à
  côté de la page dans la version jouable) ; la couleur et l'heure de chaque histoire,
  de la table `HISTOIRES` du gabarit. **Un livre qui arrive** prend une entrée dans les deux
  (l'assemblage prévient d'une histoire livrée sans vignette). La police de l'accueil est
  « Jersey 15 » (la Pixelify lisait « AUGÉRIVE », « 20S0 ») ; « Commence ici » se pose sur le
  livre 1 tant qu'aucune carrière n'a été jouée ; un livre en cours porte sa bande « Reprendre ».
  **Le Cimetière** range les fins par livre (« La Sirène · 1/5 », puis « Toutes les histoires ») :
  une fin trouvée montre son titre, une autre son `indice:` (une ligne, 90 caractères au plus,
  `build_content` le vérifie et dérive `livre` du lot `endings/h<N>.yaml`). Des jalons
  récompensent (`JALONS_FINS` : 3 fins, une pochette brillante ; 5, le port ; 8, les Tilleuls ; 12,
  les quatre quartiers ouverts dès la première semaine), gardés dans `profile.recompenses`.

```bash
# les images (une fois ; ~12 min, 5 Go de mémoire) : le Grand Aubérive de jour, au crépuscule, de nuit,
# sa profondeur, la grille, les brumes des quartiers (`petit` refait l'ancienne zone de 1 000 voxels)
cd docs/design/pixel_iso && for t in day night; do node ville_assets.js $t grille; done && node ville_assets.js dusk && node ville_post.js
# puis la découpe en tuiles WebP (ImageMagick), dans out/ville/web — voir le README du dossier
dart compile js -O2 packages/tools/web/preview.dart -o /tmp/engine.js
node packages/tools/web/assemble.js --engine /tmp/engine.js --out /tmp/ville/index.html --ville docs/design/pixel_iso/out/ville/web
```

La page sort avec un dossier `ville/` à côté (tuiles, profondeur, grille, lieux, sprites) :
elle se sert en HTTP (les JSON sont lus par `fetch`), pas en `file://`. À côté d'elle aussi :
`contenu/` (le commun `commun.<empreinte>.gz`, demandé dès la tête de la page ; un
`<livre>.<empreinte>.gz` par livre ; le moteur `moteur.<empreinte>.js`, que l'accueil n'attend
pas — chaque nom est l'empreinte de ses octets), `accueil/` (les vignettes et le panorama),
l'application (`manifest.webmanifest`, `icones/`, `sw.js`) et l'aperçu d'un lien partagé
(`apercu.jpg`, 1200 × 630 ; `pwa/genere.js` refait les images). Le service worker est versionné
par l'assemblage : la page, le réseau d'abord (le cache après trois secondes) ; `ville/`,
`contenu/`, `accueil/`, `icones/`, le cache d'abord ; une mise à jour garde ce qui est nommé par
son empreinte (le commun, le moteur, les livres déjà joués) ; on rejoue hors ligne ce qu'on a vu.
La ville garde ses images décodées dans une réserve bornée (`ville.js`, `RESERVE_IMAGES`), et la
musique se tait quand la page est cachée (`audio.js`). **Pour l'artefact publié** (qui ne sert pas
le `.gz` comme fichier), on assemble avec `--contenu-json` : les bundles de `contenu/` sortent en JSON
non compressé (l'hôte compresse au transfert, `demarrage.js` lit tel quel un bundle sans en-tête
gzip), on ajoute `<meta name="fusible-lien" content="<l'URL de l'artefact>">` (les liens de défi), et
l'on publie avec `capabilities: {db: {rules: [jour, jour/{self}, eclair, eclair/{self}]}, user: {},
downloads: true}` ; les fichiers de `ville/` ne changent pas d'une version à l'autre et restent en place.

## Comment on ajoute du contenu

La bible (`docs/bible/`) est la matière écrite ; son `README.md` § 3 est la table
de conversion scène → YAML, champ par champ. En résumé : une intrigue est un arc
(`content/arcs/<rôle>/<mot>.yaml`) qui enchaîne des étapes, chaque étape cite une
carte (`content/cards/<rôle>/*.yaml`), et le postulat déclare dans son
`programme` (`content/postulats.yaml`) dans quel « bucket » de saison l'intrigue
peut être tirée, avec quel poids.

**On écrit des scènes, pas des répliques à tic** : la charte d'écriture
(`docs/bible/charte_histoire.md`) passe avant le § 3.1 du README de la bible. Un geste,
un objet, une question qui engage ; une graine plantée qui revient trois à dix cartes plus
tard ; jamais une formule qui revient d'une carte à l'autre. Les événements sombres sont
des arcs `kind: evenement` avec un `lieu:` et le tag `sombre` (catalogue : charte § 5) ;
le metteur en scène en arme deux par saison au plus, jamais à moins de cinq cartes
d'écart.

Les contrats que le lint fait respecter : un libellé de bouton ≤ 28 caractères,
un texte ≤ 200 (et ≤ 220 une fois `{toi}` rendu par l'adresse la plus longue), une trace
posée est lue quelque part (les effets des missions et des scènes de la ville comptent), un
drapeau lu par la ville (`si` des répliques, des portes, des scènes, des phrases du match) est
déclaré, une fin déclarée a une porte, `{toi}` exige que le locuteur ait une `adresse`, une
réaction ne se pose pas sur une carte de routine.

**Écrire à plusieurs sans se marcher dessus** : les fins, les manchettes, les set-pieces
et la ville se lisent aussi par lots — `content/endings/<lot>.yaml` (et
`epitaph_plus_ajouts:` pour ajouter une ligne d'épitaphe à une fin commune, comme la garde
à vue, sans toucher à son fichier), `content/unes/<lot>.yaml`, `content/setpieces/<lot>.yaml`
(des variantes rangées avant le secours, jamais un secours), `content/ville/<lot>.yaml`
(`paroles`, `missions`, `objets`, `presences`, `rencontres`). Un postulat peut imposer son
`club`, sa `ville` et son `rival` (cosmétiques, posés après les tirages), son `objective:` de
première saison (sans lui, l'objectif se tire), et sa longueur : `saisons` et `fin_de_livre`
vont ensemble (`build_content` refuse l'un sans l'autre ; la fin compte comme une porte). Les dix histoires
de lancement (`docs/histoires/00_les_dix_histoires.md`) ont leurs outils : le tag
`intermede` (une carte à part, plus sombre, sans locuteur), la ligne d'ordre selon son
support (`fax`, `repondeur`, `portable`, `oreillette`, `telephone`), et `lieu: ailleurs`
(loin d'Aubérive : la ville s'efface derrière le décor que nomme un tag, ville.yaml
`ailleurs`).

## Le chantier ouvert : la direction artistique

L'identité visuelle actuelle (« l'album de vignettes ») **est rejetée par le
porteur du projet**, ainsi que les trois directions proposées ensuite
(`docs/design/piste_nuit.md`, `piste_archive.md`, `piste_affiche.md` — gardées
pour mémoire, à ne pas reprendre telles quelles).

La cible est explicite : **la grammaire visuelle de *Reigns*, avec les matériaux
du football.** Concrètement — fond brun très sombre et chaud, texte crème dans
une monospace, quatre pictogrammes en haut qui font office de jauges (avec un
petit triangle qui indique le sens du changement), une seule illustration
vectorielle plate et géométrique au centre de la carte, un bandeau du bas qui
porte le nom et le temps passé, un unique accent rouge pour l'interface. Et ce
que ça doit sentir, mot pour mot : **le gazon, le jeu de cartes, l'histoire du
foot.**

Deux mécaniques manquantes, vues chez *Reigns* et demandées :

- **La frise** : un écran qui montre où l'on en est dans l'histoire — la
  carrière posée sur une ligne, les années, des pictogrammes pour les événements
  traversés. Elle apparaît de temps à autre, pas à la demande.
- **Le bandeau « nouvelles cartes »** : quand du contenu se débloque, une bande
  colorée l'annonce par-dessus la carte en cours.

Bonne nouvelle pour qui reprend : ce style est *dessinable en code* (SVG plat,
formes géométriques, palette courte). Il ne demande aucun générateur d'images.

**Depuis la ville, la direction a bougé** (retour du porteur, octobre 2026) : l'accueil
« de la version Reigns » n'était « plus du tout d'actualité » — pas de pixel art, trop
monotone, on ne distinguait pas les aventures. L'accueil est désormais en pixel art, tiré
des rendus de la ville, avec une couleur par histoire (voir « L'accueil » plus haut). Les
écrans de jeu (la carte, la fin, les panneaux) gardent encore le brun et le crème : ils
sont les prochains à rejoindre la ville.

## Ce qui reste connu et ouvert

- Les scènes jouées : le vestiaire tient lieu de stade (pas de pièce pour les tribunes ni le local
  du kop) ; une scène `drapeau` se joue juste après sa carte, elle ne saute pas dans le temps ; une
  scène `lieu` se joue à la première entrée, à toute heure (son `si` peut demander l'heure) ; le livre
  2 commence « avant la neuvième journée », mais la ville affiche juillet (le moteur ne fait pas
  commencer une carrière en cours de saison). L'application Flutter ne joue pas la ville.
- La ville : un changement de club garde le même plan de ville (seuls les noms changent) ;
  tous les rôles ont les mêmes lieux ; un logement acheté change le nom de « chez toi », pas
  sa porte ; les statistiques (physique, tactique…) de la préproduction ne sont pas
  branchées. Le match du samedi est mis en scène, mais tous à domicile, et la Coupe et le
  Grand Match restent des cartes. Les scènes de la semaine s'épuisent si le réservoir est
  court (une fois par carrière) : il en faut beaucoup, par rôle et par époque.

- Le mode histoire : l'application Flutter montre encore les quatre jauges (le moteur ne les
  rend plus mortelles, mais l'écran de l'app n'a pas suivi). Le grand déballage (la parole
  à −5, les promesses non tenues) est rattaché aux histoires : en mode histoire, il ne finit
  plus la carrière tout seul, il arme **« Les douze pages »** (`content/arcs/common/
  deballage.yaml`, `Director.armerDeballage`) — quelqu'un pose devant toi le dossier de tes
  promesses, selon le livre (Massenet, Léa, Fardelli et l'épreuve de la Gazette Rose, Madame
  Vialat, le fax de 23 h 58, Dauzat, Sauvan, Nino ; une chemise sous la porte sans livre) ;
  tu réponds à tout (la parole revient à zéro, la carrière continue) ou tu démens (la fin).
  Une fois : la seconde chute n'a plus de scène. Mesuré (300 carrières par livre) : 2 à 17 %
  des carrières finissent ainsi selon le livre.
- Le « J » du bandeau n'affiche pas la vraie journée de championnat, et ne dit
  pas la même chose dans l'aperçu web et dans l'application.
- Après un changement de club en cours de saison, le classement de fin de saison
  n'affiche qu'une demi-saison.
- Deux budgets d'équilibrage restent hors cible et sont documentés dans
  `docs/balance/step4_variete.md` : la récurrence du président en première
  saison, et l'exposition (la part des cartes vues en dix carrières).
- Le directeur sportif (`ds`), le président (`president`) et le sélectionneur
  (`selectionneur`) sont **branchés** (`content/roles.yaml`, `calendar.yaml`,
  `content/endings/roles_bureau.yaml`, `packages/core/test/roles_test.dart`) : mêmes
  quatre jauges sous d'autres noms, leurs fins, leur calendrier (le sélectionneur vit
  l'année des fenêtres internationales, son classement est un classement de nations). Leurs
  transitions de carrière ne sont pas écrites. Le joueur amateur, le président amateur et le
  dirigeant d'instance restent dans la bible seulement.
