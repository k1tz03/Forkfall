# 9. Architecture technique et pipeline de contenu

Le projet part de zéro. Ce jeu est à 90 % une application de lecture et de geste (cartes, texte, jauges, menus, partage) et à 10 % un « jeu » au sens moteur : pas de physique, pas de 3D, pas de boucle temps réel. Le bon outil est un framework d'interface multiplateforme avec un cœur de règles pur, déterministe, entièrement piloté par des données.

## 9.1 La décision moteur

| Critère (sur 5) | Godot 4 | Unity 6 | Flutter | Expo / React Native | Kotlin Multiplatform | Defold | Natif Swift + Kotlin |
|---|---|---|---|---|---|---|---|
| Animation de cartes et haptique | 4 | 4 | 5 (SpringSimulation, haptique native, 120 Hz) | 4 (Reanimated, expo-haptics) | 3 | 3 | 5 |
| Coût de build iOS et Android | 3 | 3 | 4 | 5 (EAS compile l'iOS dans le cloud sans Mac) | 2 | 4 | 2 |
| Taille de l'app | 2 (30-50 Mo) | 2 | 4 (8-15 Mo) | 3 | 3 | 5 (3-6 Mo) | 5 |
| Outillage de contenu (même langage pour le jeu, la CLI, l'éditeur) | 3 | 3 | 5 | 4 | 4 | 2 | 2 |
| Localisation ICU (pluriel, genre) | 2 | 3 | 5 | 4 | 2 | 1 | 4 |
| Courbe pour un solo | 4 | 3 | 4 | 4 si développeur JS, sinon 3 | 2 | 3 | 1 |
| Licences et frais | 5 | 2 | 5 | 4 | 5 | 5 | 5 |
| Portage PC, Switch, web | 4 (Switch via partenaire payant) | 5 | 3 (desktop et web en une commande, pas de Switch) | 2 | 2 | 4 | 1 |
| Longévité | 5 | 3 | 4 | 4 | 4 | 3 | 5 |
| Accessibilité (lecteur d'écran, taille de police, réduction de mouvement) | 2 | 2 | 5 | 5 | 4 | 1 | 5 |
| **Total sur 50** | **34** | **30** | **44** | **39** | **31** | **31** | **35** |

**Décision : Flutter en widgets purs (sans Flame), avec un cœur de jeu en Dart pur.** Arguments décisifs : le swipe avec rotation et retour élastique tient en 150 lignes et tourne à 120 Hz ; le retour haptique est natif sans plugin ; le rendu de texte, la césure, la mise à l'échelle des polices et l'accessibilité sont ceux du système, chose qu'aucun moteur de jeu ne donne pour un jeu de lecture ; un seul langage pour le jeu, les outils en ligne de commande (build, lint, simulation) et un éditeur web éventuel ; le hot reload affiche une carte retouchée en une seconde ; ICU MessageFormat natif ; exports desktop et web en une commande pour la démo et le portage PC. Ce qu'on perd : la Switch (pas de runtime console) et les effets « moteur », remplacés par CustomPainter, des shaders GLSL et Rive pour les micro-animations. Pas de Flame : il ajoute une boucle de jeu et un système de composants inutiles ici et complique la mise en page et l'accessibilité.

**Règles de décision alternatives** : développeur déjà chez lui dans Godot, ou Switch visée dès le départ → Godot 4 (on paie sur la localisation, l'accessibilité et la taille) ; développeur JavaScript ou TypeScript → Expo + Reanimated + expo-haptics, avec le cœur de règles en TypeScript pur, ce qui rend le site d'aperçu et la vérification serveur gratuits ; Unity est surdimensionné et sa gouvernance est un risque pour un premium à 3 € ; le natif en double est exclu. Le risque Flutter (dépendance à Google) est couvert par l'architecture : le cœur Dart pur reste portable (compilable en JavaScript) et l'interface, une trentaine d'écrans, se réécrit en quelques semaines.

Frais incompressibles quel que soit le choix : compte Apple (99 $ par an), Google Play (25 $), un accès macOS pour signer l'iOS (Mac mini d'occasion ou runner macOS de CI).

## 9.2 L'architecture en trois couches

Un monorepo en pub workspaces avec trois paquets.

- **core** : Dart pur, interdit d'importer Flutter (un test échoue si la chaîne apparaît dans le paquet). Il contient le modèle d'état immuable, l'évaluateur de conditions, le tirage, le calendrier, le mini-monde (Force, rang provisoire, Coupe) et la détection des fins. Son API tient en quatre fonctions : démarrer (graine, options de postulat), tirer (renvoie la carte à afficher et les jauges concernées), appliquer (état + choix → nouvel état), fin (état → fin ou rien). Aucune entrée-sortie, aucun accès à l'heure, aucun aléa système : toute source d'aléa est injectée depuis l'état. Objets immuables, un réducteur unique, le contrôleur d'interface ne détient jamais de logique de règle.
- **content** : YAML source, schéma JSON, scripts de compilation vers un bundle JSON compressé.
- **app** : Flutter, qui ne fait que lire un état et pousser des choix.

Conséquence : le même cœur tourne dans les tests en millisecondes, dans les outils en ligne de commande, dans un éditeur web, et, compilé en JavaScript, dans un Worker pour vérifier des runs plus tard.

## 9.3 Le format d'une carte

YAML pour les humains (commentaires, multilignes), JSON pour la machine. Un fichier par arc narratif, 10 à 40 cartes par fichier.

```yaml
id: coach.vestiaire.capitaine_frondeur
roles: [entraineur]
arc: vestiaire
tags: [vestiaire, leadership, star]
speaker: brehaut
weight: 1.0
once: false
cooldown: 25
sablier: false
when: gauges.vestiaire < 45 && season.phase != 'mercato' && !flag('capitaine_exclu')
text: >
  {capitaine} entre sans frapper : « Le groupe ne comprend plus tes choix, coach. »
left:
  label: J'écoute et je change le onze
  effects: { vestiaire: ++, direction: -, set: [a_cede_au_capitaine] }
  answer: Le vestiaire respire. Aulard note que tu plies.
right:
  label: Le capitaine, c'est moi qui le choisis
  effects:
    vestiaire: --
    tribunes: +
    set: [capitaine_exclu]
    schedule: [{ card: coach.vestiaire.fronde, in: [2, 5] }]
    relation: { brehaut: -1 }
```

Champs : identifiant namespacé (rôle.arc.slug), rôles (un ou plusieurs, ou tous), arc, tags (taxonomie fermée), personnage (clé du fichier des personnages, qui porte le portrait, le genre et le tic de langage), poids de base, unique, temps de recharge en tours, priorité (les cartes de chaîne dues passent devant), sablier, condition, texte en ICU avec variables ({club}, {capitaine}, {pg, select, …} pour le genre du protagoniste), gauche et droite avec libellé, effets, réponse affichée après le swipe, ruban de promesse optionnel (créancier, échéance), aperçu optionnel pour forcer ou cacher les icônes de jauges affichées. Le script de build charge tous les fichiers, résout les références, précompile les conditions en arbre syntaxique JSON, vérifie le schéma et écrit le bundle plus un hachage de contenu embarqué dans l'application. Chaînes toujours citées côté build pour éviter le piège du « non » interprété en booléen.

**Les conditions** : une grammaire minuscule (littéraux, chemins pointés comme gauges.direction, vars.contrat_annees, season.phase, player.age, world.rang, comparaisons, et, ou, non, appartenance) et une dizaine de fonctions : flag, seen, since (tours écoulés depuis une carte), count, between, chance (consomme le générateur de l'état, donc déterministe), role_was, phase, relation(brehaut). Le build compile chaque condition en s-expression ; le runtime n'a qu'un évaluateur récursif sur des listes, sans parseur embarqué. Un jeu de vecteurs de test documente la sémantique et permettrait de réimplémenter l'évaluateur à l'identique lors d'un portage. Chemin inconnu = erreur de lint, jamais un null silencieux. Pré-indexation par rôle et par phase pour n'évaluer que 200 à 400 cartes par tour.

**Les effets** : une liste d'opérations pures appliquées par le réducteur : deltas de jauges, pose et retrait de drapeaux, variables (+1, =0, max), planification (carte, fenêtre min-max en cartes, repli abandon ou report), annulation, changement de rôle, fin explicite, effet incertain tiré avec le générateur d'état, relation, Parole, déblocage de Destin. Les magnitudes s'écrivent en symbolique (+, ++, +++) résolues au build via un fichier d'équilibrage (petit 5, moyen 10, gros 18) : un seul fichier resserre ou détend tout le jeu après une campagne de simulation. Liste fermée de drapeaux déclarés avec description, et un lint sur les drapeaux jamais lus.

**Le tirage** : (1) une carte planifiée due et éligible sort en priorité ; (2) sinon filtre par rôle et phase, évaluation des conditions ; (3) poids final = poids de base × multiplicateur de phase (le calendrier de saison est un fichier : phases, longueurs, multiplicateurs par tag comme mercato ×4 en fenêtre et ×0,2 hors fenêtre) × Pression × pénalité de récence (×0,1 si vue dans les quinze derniers tours, ×0,5 si son arc est sorti au tour précédent) × continuité d'arc × alarmes (cartes de secours ×3 quand une jauge est sous 20 ou au-dessus de 80, cartes de risque ×0,5) ; (4) tirage pondéré. Garanties : au moins une carte de mercato par fenêtre, les cartes de tutoriel forcées dans les premiers tours de la première partie. Le mode debug affiche la liste des candidates avec leur poids final : l'outil numéro un pour comprendre pourquoi une carte ne sort jamais.

**Rôles, jauges, transitions et fins en données** : un fichier de rôles (identifiant, libellés des quatre jauges, icônes, fins si vide et si pleine, valeurs de départ, conditions d'entrée, transitions autorisées), un fichier de fins (identifiant, condition, titre, épitaphe, gabarit d'image, rareté, Destin associé, rôles suivants possibles), un fichier de calendrier, un fichier d'équilibrage. Ajouter un rôle = un bloc YAML, 60 cartes et 8 fins, aucun code.

## 9.4 État, sauvegarde, déterminisme

**L'état de partie** est un objet immuable sérialisable en JSON : version de schéma, hachage de contenu, graine, état interne du générateur, tour, saison, rôle, jauges, drapeaux, variables, entités (protagoniste, club, rival, les seize transversaux avec relation et âge), monde (Force, rang provisoire, Coupe, mémoire des clubs, Fantômes, Almanach), cartes planifiées, temps de recharge, historique des choix, statistiques. Quelques kilo-octets ; écriture atomique après chaque swipe (fichier temporaire puis renommage) avec conservation de la sauvegarde précédente ; reprise exacte à la carte en cours. Le profil (Cimetière, Panthéon, statistiques, réglages, tutoriel) est un fichier séparé jamais touché par les runs. Migrations ordonnées au chargement ; un hachage de contenu différent est toléré (cartes disparues → planifications abandonnées). Test de round-trip JSON sur des états générés aléatoirement.

**Le générateur** : xoshiro128** ou PCG32 implémenté à la main (30 lignes) plutôt que l'aléa standard, dont la séquence n'est pas garantie identique entre natif et JavaScript. Tout l'aléa du jeu passe par le générateur stocké dans l'état ; un second flux séparé sert au cosmétique (tremblements, confettis) pour que l'interface ne puisse jamais dévier la partie. Invariant testé en intégration continue : même graine + même liste de choix = même hachage d'état final, sur natif et sur JavaScript, sur cent codes de référence.

**Le Code de Carrière** (section 7) est un produit direct de cette discipline : version de contenu, graine, postulat, bits de swipes, contrôle ; 45 caractères en base32 pour une carrière complète.

**Hors ligne d'abord** : au MVP, aucune requête réseau, et sur Android on ne déclare même pas la permission Internet, ce qui est un argument de fiche (« aucune donnée collectée »). En V1, classements et succès via Game Center et Play Games. Plus tard seulement, si un défi vérifié le justifie, un Worker et une petite base qui reçoivent graine, hachage, choix et version, rejouent la partie avec le cœur compilé en JavaScript et calculent eux-mêmes le score ; la graine du jour publique est alors émise par le serveur. Anti-triche complémentaire à coût faible : limite d'envois, attestation d'appareil seulement si un abus apparaît, bannissement fantôme. Jamais d'enjeu monétaire sur un classement.

## 9.5 Le pipeline éditorial

**Organisation** : content/cards/<rôle>/<arc>.yaml, content/cards/common/ pour les cartes multi-rôles (médias, famille, arbitrage, agents), content/cards/chains/ pour les mini-histoires ; fichiers de tags, de drapeaux, de personnages, de rôles, de fins, de calendrier, d'équilibrage, de noms par pays, de packs (activer des dossiers entiers : une mise à jour thématique par trimestre, ou couper du contenu pour la démo). Cibles : MVP 280 cartes, V1 900, plus tard 1 500 et au-delà. Un bundle unique (3 000 cartes × 500 octets ≈ 1,5 Mo brut, 350 Ko compressé) chargé dans un isolate et indexé en moins de 100 ms sur un Android d'entrée de gamme. Un guide d'écriture vivant (ton, longueurs, gabarit par type de carte).

**Outillage en trois paliers** : (0) VS Code avec l'extension YAML et le schéma JSON : autocomplétion des champs, tags, rôles, personnages, validation en direct, snippets ; (1) aller-retour tableur : export CSV plat pour un co-auteur ou un relecteur non technique, import qui réinjecte en préservant les champs non éditables ; (2) un mini-éditeur web Flutter qui embarque le même cœur : liste filtrable, formulaire, aperçu avec le widget réel du jeu, « tester cette carte » qui fabrique un état satisfaisant la condition, graphe des chaînes de l'arc, à ne démarrer que si un co-auteur arrive. Plus un mode auteur dans la build de développement : appui long sur une carte → identifiant, fichier, ligne, poids, conditions, effets.

**Le lint** en intégration continue : schéma JSON puis une trentaine de règles avec code et sévérité. Bloquantes : identifiant en double, tag ou rôle ou jauge ou drapeau ou personnage inconnu, carte planifiée inexistante, condition non parsable, chemin d'état inconnu, variable ICU indisponible, deux choix identiques, texte ou libellé manquant, nom réel de personne, de club ou de marque (liste noire de la section 8, distance de Levenshtein ≤ 2), somme absolue des effets d'un choix > 40, texte > 160 caractères ou libellé > 28. Avertissements : carte jamais éligible, drapeau écrit jamais lu ou lu jamais écrit, carte de chaîne que rien ne planifie, recharge absente sur une carte à poids élevé, arc de moins de six cartes, personnage sans carte, clé de traduction manquante. Sortie compatible avec les annotations de GitHub. Commencer avec dix règles bloquantes et n'en ajouter que sur incident réel.

**La simulation Monte-Carlo** : un outil en ligne de commande fait tourner le cœur sans interface avec plusieurs bots (aléatoire, toujours à gauche, équilibreur qui choisit le côté dont l'aperçu éloigne le plus des bords, avide qui prend toujours le gros gain, humain-like = équilibreur avec 20 % d'erreurs). 5 000 runs × 60 tours en quelques secondes en Dart natif. Métriques : distribution de la longueur des runs (cible pour le bot humain-like : médiane 150 à 200 cartes soit 4 à 5 saisons, P95 < 500, aucun run > 1 200 ; la politique « tout centrer » ne dépasse pas 7 saisons de moyenne), répartition des causes de mort (aucune jauge > 40 %, chaque fin atteinte au moins une fois sur 5 000), exposition par carte (cartes jamais vues listées), matrice de transitions entre rôles et tour moyen de première transition, temps par phase. Rapport HTML avec histogrammes, comparaison à une base de référence, et budgets qui font échouer le build en intégration continue. Le même outil sert à concevoir : on écrit un arc, on simule, on ajuste le fichier d'équilibrage.

**Les tests** : golden runs (dix graines fixes et des séquences de choix, hachage d'état final comparé à une valeur enregistrée) ; tests de scénario écrits en YAML par l'auteur (état donné, carte, choix, attentes sur les jauges, les drapeaux, les planifications), exécutés par un runner générique ; propriétés sur 500 runs aléatoires (jauges toujours dans 0-100, aucune exception, fin atteinte avant 1 200 tours, aucune carte revue avant sa recharge, round-trip JSON) ; tests widget qui rendent chaque carte avec son texte le plus long par langue à l'échelle de texte 1,0 et 1,3, sur 320 × 568 et 430 × 932 points, et échouent sur tout débordement ; un script génère une planche de toutes les cartes pour relecture visuelle.

**Le graphe** : un outil lit le contenu compilé et produit un fichier Mermaid ou DOT par arc (nœuds = cartes, arêtes = planifications avec leur fenêtre, transitions, fins) et une vue globale des rôles et des fins, publiée dans la documentation par l'intégration continue : on voit les impasses, les chaînes trop longues, un rôle sans porte d'entrée, une fin orpheline.

## 9.6 Localisation, entités, monde

**Localisation** : chaque carte génère des clés (identifiant.text, .left, .right, .answer) ; textes en ICU avec pluriels, sélection de genre du protagoniste et de l'interlocuteur, variables nommées ; fichiers ARB par langue chargés à la demande, une clé manquante retombe sur la langue source avec avertissement ; export CSV ou XLIFF pour les traducteurs (Weblate auto-hébergé ou un simple tableur), import qui reconstruit les fichiers ; pseudo-localisation intégrée (accents partout, +35 % de longueur, crochets aux extrémités) ; polices en sous-ensembles Latin étendu au départ, cyrillique ou CJK ajoutés avec la langue ; un champ « note pour le traducteur » par carte, et l'acceptation que certaines cartes soient réécrites plutôt que traduites. Les labels sémantiques du lecteur d'écran passent par le même pipeline.

**Le générateur d'entités** : fichiers de prénoms par genre, noms de famille, suffixes de clubs, villes fictives par pays ; au démarrage d'un run, le cœur tire avec le générateur d'état un protagoniste (genre au choix ou aléatoire, nationalité, âge selon le rôle), un club, un rival, et compose les figurants (agent, capitaine, journaliste, arbitre) avec genre, nationalité et couches de portrait ; tout est stocké dans l'état et réutilisé par toutes les cartes via les variables, donc le président qui t'a embauché est celui qui te vire. Les seize transversaux sont des recettes fixes. Unicité des noms dans un run, cohérence de genre entre nom et pronoms, test anti-collision contre la liste des 5 000 personnalités.

**Le monde** : une table de 24 clubs fictifs sur quatre divisions avec une Force de base ± 10 recalculée chaque saison, les huit sélections, les instances ; les Cartes Match résolvent un bloc de six journées par la formule de la bible, et le rang provisoire interpole les points sur la table de division ; pas de classement vivant, pas d'effectifs nommés au-delà des trois têtes d'affiche. La Coupe tire ses adversaires dans tout le monde persistant. Le monde porte la mémoire des clubs, les Fantômes (cinq actifs), l'Almanach (soixante gabarits) et l'horloge 1998-2050. Environ 300 lignes, entièrement déterministes ; l'idée verrouillée est que le championnat est un générateur de situations, pas un système que le joueur optimise.

## 9.7 Performance, taille, application

- **Animations** : trois widgets de carte pré-construits dans une pile (courante, suivante à 0,95, troisième cachée), jamais reconstruits pendant le geste ; le drag met à jour un ValueNotifier et seul un AnimatedBuilder applique la transformation ; validation à 30 % de la largeur ou 800 points par seconde ; retour par SpringSimulation (masse 1, raideur 400, amortissement 25) ; jauges en CustomPainter avec RepaintBoundary ; pas de widget Opacity, pas d'ombre floutée animée ; la carte suivante est mise en page pendant l'animation de la précédente ; portraits préchargés par lot de cinq. Cible mesurée : moins de 4 ms de build et raster à 120 Hz sur un iPhone récent, moins de 12 ms sur un Android de 2019 à 2 Go de RAM, appareil de référence obligatoire.
- **Taille** : runtime 5 Mo, code 2 Mo, contenu < 1 Mo, portraits < 3 Mo (couches SVG rasterisées une fois et mises en cache, ou WebP 512 px), polices < 400 Ko, sons < 2 Mo, musique < 5 Mo : total 18 à 20 Mo, budget 30 Mo. Build avec obfuscation, symboles séparés, icônes élaguées, bundle Android par ABI ; un rapport de taille par dossier qui échoue au-delà du budget ; les packs volumineux futurs en téléchargement à la demande.
- **Portraits** : 140 couches vectorielles combinables ; recettes fixes pour les transversaux, composition au tirage pour les figurants ; rasterisation une fois par combinaison dans un cache disque, ou un fichier Rive par gabarit avec entrées d'état (clignement, colère) à 30 Ko pièce ; recoloration des maillots par un shader de 20 lignes ou une matrice de couleur, couleurs tirées d'une palette de 24 paires qui évite les combinaisons réelles identifiables ; une planche de contrôle de 200 combinaisons générée par script.
- **Image de partage** : un widget construit hors écran et rasterisé à trois fois la densité, converti en PNG, partagé par la feuille de partage système ; contenu piloté par le fichier des fins ; QR vers le lien du Code de Carrière ; une dizaine de gabarits visuels par famille de fin.
- **Accessibilité technique** : chaque carte enveloppée d'une sémantique composée avec deux actions personnalisées (« Choisir gauche », « Choisir droit ») ; jauges avec label parlé mis à jour après chaque choix ; boutons activés automatiquement quand un lecteur d'écran est détecté ; respect de l'échelle de texte jusqu'à 1,3 sans troncature puis défilement ; réduction de mouvement ; thèmes clair, sombre et haut contraste.
- **Outils de debug** (flavor dev uniquement, exclus des builds de production et vérifiés absents du binaire) : liste des candidates du tour avec poids, forcer une carte, curseurs de jauges, saut de rôle ou de phase, saisie de graine, « défiler vingt tours », rejouer les cinq derniers choix, inspecteur de carte, et rechargement du contenu à chaud par un petit serveur local qui recompile à chaque sauvegarde YAML.
- **Analytics** : aucun SDK Google ou Meta ; événements agrégés localement (début de run, carte vue, choix, fin, partage, réglages), envoyés par lots seulement si l'utilisateur coche « Aider à équilibrer le jeu » (décoché par défaut) vers un service hébergé en Europe ou un Worker gratuit ; identifiant aléatoire régénéré à chaque désactivation ; les mêmes événements alimentent un écran local « Mes statistiques » ; plantages via le système, ou en MVP un bouton « Exporter le journal » (cinquante derniers événements et la graine).
- **Sauvegarde cloud** (plus tard) : d'abord un code d'export et d'import du profil (compressé, signé localement, texte et QR), puis le stockage clé-valeur iCloud et le dossier applicatif Google Drive, fusion par horodatage avec union des ensembles ; jamais de synchronisation d'un run en cours.
- **Bundles distants signés** (plus tard) : contenu et traductions publiés sur un hébergement statique avec signature Ed25519 et manifeste, vérifiés et activés au prochain nouveau run seulement, désactivés par défaut pour rester sans réseau ; une carte spéciale le soir d'une finale réelle, un correctif d'équilibrage le lendemain d'une plainte ; toujours livré aussi via une mise à jour de l'application.

## 9.8 Intégration et livraison

- **ci.yml** (sur chaque PR et push, moins de six minutes) : format, analyse, tests du cœur, build du contenu, lint, simulation à 2 000 runs avec budgets, tests widget, rapport de taille d'actifs.
- **release.yml** (sur tag) : Android sur Ubuntu (keystore depuis un secret, bundle, piste interne Play) ; iOS sur runner macOS (certificat et profil via fastlane match, IPA, TestFlight avec une clé API App Store Connect) ; version lue du tag, numéro de build = numéro d'exécution, notes générées depuis les commits. Les minutes macOS comptent dix fois sur GitHub ; Codemagic offre 500 minutes macOS par mois et une intégration Flutter clé en main, alternative raisonnable pour un solo sans Mac. Promotion en production toujours manuelle après 24 heures sur la piste interne. Plus tard : captures de store automatisées sur quatre tailles d'écran et trois langues.
- **Liens universels** : fichiers d'association hébergés sur une page statique gratuite ; domaine acheté avant le premier partage public.

## 9.9 La structure de dossiers

```
/
  pubspec.yaml               # workspace : packages/*, app
  packages/
    core/                    # Dart pur, zéro Flutter
      lib/src/model/         # état, entités, rôles
      lib/src/rules/         # AST des conditions, évaluateur, effets
      lib/src/draw/          # directeur de tirage, calendrier, index
      lib/src/world/         # Force, rang, Coupe, mémoire, Fantômes, Almanach
      lib/src/rng/           # xoshiro, codec de graine et de Code de Carrière
      lib/src/save/          # sérialisation, migrations
      test/                  # unitaires, golden_runs/, fixtures/
    content/
      cards/<role>/<arc>.yaml, cards/common/, cards/chains/
      roles.yaml, endings.yaml, calendar.yaml, balance.yaml
      tags.yaml, flags.yaml, characters.yaml, packs.yaml
      names/<pays>.yaml, schema/card.schema.json, tests/*.scenario.yaml
      build/                 # généré : content.json.gz, content.hash
    l10n/                    # fr.arb (source), en.arb, es.arb, exports/
    tools/                   # build_content, lint, simulate, l10n, sheet, screenshots, assets_report, graph
    editor/                  # (V1) mini-éditeur web
  app/
    lib/ui/                  # game/ (pile de cartes, jauges), menus/, ending/, share/, settings/
    lib/state/               # contrôleur de partie, contrôleur de profil
    lib/services/            # stockage, haptique, audio, analytics, services de jeu, deep links
    lib/platform/            # canaux natifs
    assets/                  # content/, portraits/, fonts/, audio/
    test/                    # widget, goldens/
  fastlane/, .github/workflows/, docs/, site/
```

Conventions : app dépend de core, jamais l'inverse ; tools dépend de core et lit content ; le bundle compilé est copié dans les assets par le build.

## 9.10 Ordre de construction et risques

**Ordre recommandé pour un solo** : semaines 1 à 3, le cœur (état, format de carte, évaluateur, tirage, calendrier, Cartes Match, fins) avec 60 cartes d'un seul rôle ; semaine 4, lint et simulation ; semaines 5 et 6, l'interface de swipe, les jauges, les fins, la Succession ; puis contenu, contenu, contenu, avec l'éditeur et l'intégration continue en parallèle. Le prototype papier de la semaine 2 (40 cartes imprimées) se joue avant d'écrire une ligne d'interface.

| Risque | Parade |
|---|---|
| Un appel non seedé casse le déterminisme | interdiction d'importer l'aléa système dans core, test de cent codes de référence natif et JavaScript à chaque build |
| Une règle « vite fait » dans un widget | test d'import qui interdit Flutter dans core, revue régulière |
| Explosion combinatoire des drapeaux | liste fermée déclarée, lint sur les drapeaux jamais lus |
| Sur-ingénierie du schéma de carte | refuser un champ tant que trois cartes n'en ont pas besoin |
| Répétition dès le troisième run | exposition par carte mesurée en simulation, 130 cartes par rôle complet, chaînes et cartes conditionnelles |
| Signature iOS fragile | fastlane match mis en place une fois, documenté |
| Débordements de texte dans les langues longues | tests widget à l'échelle 1,3 sur deux tailles, pseudo-localisation, budgets de longueur au lint |
| Poids de l'application | budget par dossier en intégration continue, vectoriel, palette réduite |
| Dérive vers un jeu de gestion | le monde est un générateur de situations ; pas de classement vivant, pas d'effectifs |
| Dépendance à Flutter | cœur portable, interface de trente écrans réécrivable |
