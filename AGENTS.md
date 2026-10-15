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
| Contenu | 3 749 cartes, 341 arcs, 114 fins, 249 Nouvelles datées, 548 manchettes de Une, 689 variantes de set-piece, 185 personnages (dont 134 gens de la ville) ; la ville : 855 scènes de la semaine |
| Rôles jouables | entraîneur, joueur, président, directeur sportif, sélectionneur — les dix histoires livrées (voir « Les dix histoires ») |
| Moteur | Dart pur, déterministe, 145 tests, 20 goldens ; le mode histoire (`calendar.yaml` `director.jauges_fatales: false`) |
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
  finit ses carrières sur ses propres fins (80 à 97 % selon le livre, le reste à la police,
  au grand déballage ou à la blessure).
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
dart run packages/tools/bin/build_content.dart   # YAML → content/build/content.json + app/assets/content.json
dart run packages/tools/bin/lint.dart            # 0 erreur exigé
cd packages/core && dart test                    # 145 tests
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
du moteur (le Code de Carrière ne rejoue pas la ville).

Ce que la ville porte en plus des cartes :

- **Les scènes de la semaine** (`content/ville/scenes*.yaml`) : le moteur ne sert que deux ou
  trois cartes entre deux samedis ; chaque jour sans carte, et souvent le soir, la ville
  programme une scène (un texte, un ou deux choix, des effets légers), à son lieu et à son
  heure ou qui vient à toi (`rue`, `domicile`). Quand l'heure arrive (une activité,
  « Attendre », « Y aller », le réveil), la ville s'y rend d'un fondu : on ne saute plus trois
  jours sans que rien n'arrive. **« Attendre »** (en bas, ou « Attendre ici » dans le panneau
  d'un lieu) fait passer le temps jusqu'à ce qu'il arrive quelque chose — une scène, quelqu'un
  qui vient te chercher, le rendez-vous qui s'ouvre (un toast dit où), l'heure d'une mission ;
  la nuit, on rentre dormir et l'attente reprend au réveil (deux nuits au plus d'un geste).
  Mesuré en jouant l'histoire 4 en n'attendant que : 3,3 gestes vides entre deux choses
  avant, 1,3 après. Une scène est une mission d'une seule étape (`scene`) que le
  moteur applique sans tirage ; une fois par carrière ; `mission(<id>)` lit une scène vue. Le
  plan du jour se tire de la graine, de la semaine et du jour.
- **Le match à la Rive**, le samedi : la ville va au stade (les passants vers les grilles,
  puis la sortie), vingt-deux joueurs, l'arbitre et le ballon sur la pelouse, les deux tribunes
  remplies selon la jauge tribunes (peintes une fois avec la profondeur du décor), deux ou trois
  actions racontées à leur minute (`ville.yaml` `match:` et les lots `match_textes:`), le tableau,
  la mi-temps, le résultat, et le score peint sur le mur est jusqu'au samedi suivant. Le moteur
  joue un bloc de six journées d'un tirage ; la ville met en scène la dernière, et son score se
  tire de la lettre (V, N, D) pour l'écran seulement.
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
- **La musique** (`packages/tools/web/audio.js`, `MUSIQUE`) : six thèmes NOIRS écrits note à
  note et synthétisés (aucun fichier son) — du synthé de polar, parce que la première
  partition, en majeur, était « beaucoup trop joyeuse » pour des histoires sombres. La Mèche à
  l'accueil (la mineur harmonique, une basse en octaves qui pompe, un motif de trois mi
  répétés), La Filature en ville le jour (une basse en gamme de blues), Néons le soir et la
  nuit (demi-temps, un saxophone de synthèse), La Rive au stade (mi phrygien, basse saturée,
  la tribune qui chante, les claps du virage), Le Fusible sur une carte sombre (une boîte à
  musique désaccordée, cinq notes contre quatre temps, un cœur qui bat), Le Dernier Tour à la
  fin (le motif de La Mèche, lent) — en fondu enchaîné, et un jingle au départ d'une histoire.
  Sous un thème, les couches d'origine se taisent : la nappe, et le lit continu des lieux (la
  pluie, le néon, la rumeur — « un schlash continu » au retour du porteur, mesuré plus fort dans
  les aigus que les thèmes) ; il ne reste du lieu que de rares bruits d'objets, bas (une goutte,
  une porte, des pas, un ballon). En ville, le lieu sonore est la pièce où l'on est, sinon la
  rue ; une carte ouverte a le sien.
  Le moteur a ses effets : la grosse caisse fait pomper les voix `pompe`, un écho ping-pong
  (`echo`), la saturation (`drive`), un filtre par voix que la section balaie (`ouvre`), la
  caisse claire « gated » (`S`), la montée (`z`). La grille : seize cases par mesure, une note
  attaque, `-` la tient, `.` se tait, `~` glisse, `!` accentue ; la basse et les accords en
  degrés sur la grille d'accords ; l'en-tête de `MUSIQUE` dit tout. On vérifie sans
  haut-parleur : `NODE_PATH=/opt/node22/lib/node_modules node packages/tools/web/banc_son.js
  --out /tmp/son` rend chaque thème en WAV, avec ses niveaux et un spectrogramme (viser une
  moyenne vers −21 dB, une crête sous −3 dB, et assez d'énergie au-dessus de 250 Hz pour un
  haut-parleur de téléphone).
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
  commités, embarqués en `data:` par `assemble.js`) ; la couleur et l'heure de chaque histoire,
  de la table `HISTOIRES` du gabarit. **Un livre qui arrive** prend une entrée dans les deux
  (l'assemblage prévient d'une histoire livrée sans vignette).

```bash
# les images (une fois ; ~12 min, 5 Go de mémoire) : le Grand Aubérive de jour, au crépuscule, de nuit,
# sa profondeur, la grille, les brumes des quartiers (`petit` refait l'ancienne zone de 1 000 voxels)
cd docs/design/pixel_iso && for t in day night; do node ville_assets.js $t grille; done && node ville_assets.js dusk && node ville_post.js
# puis la découpe en tuiles WebP (ImageMagick), dans out/ville/web — voir le README du dossier
dart compile js -O2 packages/tools/web/preview.dart -o /tmp/engine.js
node packages/tools/web/assemble.js --engine /tmp/engine.js --out /tmp/ville/index.html --ville docs/design/pixel_iso/out/ville/web
```

La page sort avec un dossier `ville/` à côté (tuiles, profondeur, grille, lieux, sprites) :
elle se sert en HTTP (les JSON sont lus par `fetch`), pas en `file://`.

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
`club`, sa `ville` et son `rival` (cosmétiques, posés après les tirages). Les dix histoires
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
