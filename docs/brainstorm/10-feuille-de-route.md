# 10. Feuille de route, MVP et questions ouvertes

## 10.1 Le périmètre du MVP et pourquoi

Le MVP existe pour répondre à une seule question avant d'écrire 900 cartes : **est-ce qu'on relance ?** Il contient donc ce qui fait relancer, et rien d'autre.

| Dans le MVP | Hors du MVP |
|---|---|
| Deux rôles complets : Joueur pro et Entraîneur (avec le sas adjoint), soit les deux rôles les plus attendus et les plus différents (première personne, corps qui parle ; le banc, le fusible) | les sept autres rôles |
| Six postulats, tirage de trois cartes | les postulats prestigieux et déblocables |
| Les quatre jauges, les alarmes, le piège du centre, la dérive passive, la Pression verrouillée puis progressive | traits et objets (V1) |
| La saison en six actes, les Cartes Match double face avec les quatre pictos, la chaîne Coupe, un Grand Match par saison à trois temps forts, le Bilan avec la Une, le Verdict, le Contrat, le Carrefour | tournois de sélection, Cartes Événement d'instance |
| La Carte Objectif et une promesse publique active, la Parole cachée, le Grand Déballage | le Carnet à trois promesses (jamais) |
| Le sablier, les chaînes, trente Nouvelles datées, dix cartes de piège du centre | les trois ères complètes (V1) |
| 280 cartes : 2 × 100 Personnage, 16 alarmes, 16 épitaphes de jauge, 8 fins de choix, 10 Destins de transition, 24 contextes de Match, 40 temps forts, 12 cartes de contrat, plus les Cartes Nouvelles et joker | les 620 autres |
| Les seize personnages transversaux avec relation et trois expressions, Camille, Brian Clow, Madame Josiane et le tutoriel diégétique | leurs trois âges (V1) |
| L'Épitaphe avec icône coupable barrée, la Succession à trois cartes, le Fantôme, la mémoire des clubs | la lignée, le Nemesis, l'Almanach (V1) |
| Le Cimetière et le Panthéon avec 24 Destins | les 36 autres Destins |
| Le moteur déterministe, le Code de Carrière, le Destin du jour et de la semaine, le duel asynchrone, l'image de partage, le texte Markdown | le Fantôme d'un ami, le roast, la ligue, les cameos (V1) |
| Swipe et boutons, taille de texte, daltonisme, réduction de mouvement, mode transport | lecteur d'écran complet (V1) |
| Français et anglais, pseudo-localisation | les autres langues |
| Le style album de vignettes : paper doll, 8 décors, 30 icônes, le gabarit de Une et de communiqué, les écussons procéduraux | les patines d'époque, l'album de carrière visualisé |
| Le lint, la simulation Monte-Carlo, les golden runs, l'intégration continue | l'éditeur web, les bundles distants |

## 10.2 Les jalons pour un développeur solo à plein temps

| Jalon | Quand | Contenu | Critère de sortie |
|---|---|---|---|
| Prototype papier | semaine 2 | 40 cartes imprimées, quatre jauges dessinées, un rôle | trois personnes jouent vingt minutes et veulent « encore une » |
| Cœur et outils | semaines 1 à 4 | état, format de carte, évaluateur, tirage, calendrier, Cartes Match, fins, lint, simulation, 60 cartes d'un rôle | 5 000 runs simulés, médiane de 4 à 5 saisons pour le bot humain-like |
| Interface jouable | semaines 5 à 6 | pile de cartes, swipe, jauges, alarmes, Épitaphe, Succession, sauvegarde | un run complet sur téléphone, à une main, dans un bus |
| MVP | semaine 10 | deux rôles, 280 cartes, Grand Match, promesse, Une, Code de Carrière, duel, partage | 30 testeurs ; plus de 60 % relancent immédiatement après la première mort ; durée moyenne de run entre 12 et 20 minutes |
| Alpha contenu | mois 4 à 5 | six rôles, 700 cartes, seize personnages en trois âges, Cimetière et Panthéon complets, ères scénarisées | aucune carte revue avant la troisième saison en simulation ; chaque fin atteinte au moins une fois |
| Bêta fermée | mois 6 | 900 cartes, art final, audio, accessibilité, français et anglais, TestFlight et piste interne Play, page Steam, démo web | 100 testeurs, taux de plantage < 0,5 %, notes de bêta ≥ 4,5, relecture juridique des clins d'œil faite |
| Lancement | mois 7 à 9 | iOS, Android, démo web ; précommande App Store ; press kit ; trois vidéos de carrières | featuring demandé six semaines avant ; 7 000 wishlists Steam visées avant le port |
| Mise à jour 1 | mois 10 à 12 | Directeur sportif, arcs longs, lecteur d'écran, espagnol, portugais brésilien, allemand, italien, passage à 3,99 € | second pic de ventes |
| Port PC | mois 13 à 15 | Steam à 5,99 €, Steam Deck, Next Fest | |
| Année 2 | | Switch, packs (agent, arbitre, consultant, époques), bundles distants, serveur de défi vérifié si la base le justifie | |

Les chiffres de calendrier supposent un solo à plein temps et déjà à l'aise avec le moteur choisi ; ajouter 30 % pour un premier projet dans ce moteur, doubler pour un temps partiel.

## 10.3 L'ordre de production du contenu

1. Les 60 premières cartes de l'Entraîneur (le rôle Reigns par excellence, le plus simple à écrire) et ses 8 fins, pour valider le format, le ton et la simulation.
2. Les cartes de Match, les 40 temps forts et le Grand Match.
3. Le Joueur pro (première personne, le plus cher) : 100 cartes, 8 fins, la chaîne Coupe, la sélection.
4. Les transversaux : alarmes, piège du centre, Pression et Tentation, Nouvelles, vengeance et faveur, Fantôme.
5. Le Président pro, puis le Sélectionneur et son Tournoi, puis l'Instance et sa Campagne.
6. Les rôles courts par substitution : Joueur amateur, Président amateur.
7. Les arcs multi-saisons, les cartes-légendes, les cartes de drame, les Destins secrets.
8. Le Directeur sportif et les packs.

Rythme réaliste : 12 à 15 cartes rédigées, taguées et testées par jour, pas 35. À ce rythme, 900 cartes = 60 à 75 jours d'écriture pure, étalés sur les mois 3 à 6.

## 10.4 Les métriques de succès

| Métrique | Cible | Mesure |
|---|---|---|
| Durée moyenne d'un run | 15 à 20 minutes (4 à 6 saisons) | simulation puis analytics opt-in |
| Taux de relance après une mort | > 60 % dans les dix secondes | bêta, puis analytics |
| Runs par joueur la première semaine | > 8 | analytics |
| Cartes uniques vues au dixième run | > 60 % du paquet des rôles joués | simulation, Codex |
| Répartition des causes de mort | aucune jauge > 40 % ; chaque fin atteinte | simulation |
| Politique « tout centrer » | ≤ 7 saisons de moyenne | simulation |
| Partages par run | > 0,3 (Épitaphe ou Une) | analytics |
| Plantages | < 0,5 % des sessions | rapports système |
| Notes stores | ≥ 4,5 | stores |
| Wishlists Steam avant le port | 7 000 | Steamworks |

## 10.5 Les risques majeurs et leurs parades

| Risque | Parade |
|---|---|
| Faim de contenu : répétition dès le troisième run | 130 cartes par rôle complet, 40 % de cartes conditionnelles, chaînes, exposition mesurée en simulation, rôles courts par substitution, packs trimestriels |
| Le pilote automatique : centrer les jauges devient une routine | piège du centre, dérive passive, Pression, sabliers, promesses ; budget de simulation qui échoue si « centrer » dépasse sept saisons |
| Le rôle instance trop abstrait | personnages forts (Bambini, le secrétaire général, La Plume), la Campagne, le registre bureaucratique, les Cartes Événement double face ; sorti en V1 mais testé en alpha |
| L'étiquette « clone de Reigns » | l'album de vignettes, le Grand Match, la Parole, la Une, les personnages qui changent de camp, le ton ; jamais « Reigns » dans les métadonnées |
| Le risque juridique des clins d'œil | règle des deux traits, liste noire automatisée, scandales sur des inventés seulement, relecture juridique d'une journée avant la sortie |
| Le déterminisme cassé | interdiction de l'aléa système dans le cœur, cent codes de référence à chaque build |
| L'écriture qui prend deux fois plus de temps que prévu | rythme de 12 à 15 cartes par jour posé dès le début, MVP à deux rôles, rôles courts par substitution, mises à jour gratuites plutôt qu'un lancement tardif |
| Aucun featuring ni presse | démo web, page Steam et wishlists dès le trailer, précommande, cartes communautaires, mode streamer, trois vidéos de carrières ; clause de revoyure à 90 jours |
| Le piratage Android | vérification légère à échec doux, free-to-try Android à la revoyure |
| Le solo qui s'épuise | chaque système livrable indépendamment, jalons de deux semaines, prototype papier avant le code, aucun système qui dépasse une semaine |

## 10.6 Les décisions à prendre maintenant

1. **Le moteur.** Flutter avec un cœur Dart pur est la recommandation ; Expo si vous êtes plus à l'aise en TypeScript ; Godot si la Switch est un objectif dès le départ. *Recommandation : Flutter, sauf si vous êtes déjà chez vous dans l'un des deux autres.*
2. **Le titre.** FUSIBLE / Sacked, ou un autre de la liste. *Recommandation : FUSIBLE, vérification d'antériorité cette semaine.*
3. **Le style graphique.** L'album de vignettes autocollantes est retenu ; dessinez-vous vous-même ou faut-il un illustrateur freelance (2 000 à 4 000 €) ? *Recommandation : paper doll vectoriel en interne, portraits des seize transversaux par un freelance si le trait ne suit pas.*
4. **La monétisation.** Premium 2,99 € puis 3,99 €, avec démo web ; free-to-try Android à la revoyure seulement. *Recommandation : oui, tel quel.*
5. **Les rôles du MVP.** Joueur pro + Entraîneur. *Recommandation : oui ; le Président pro est le troisième si le temps le permet.*
6. **Le genre du protagoniste.** Une joueuse ou une dirigeante dès le MVP coûte un sélecteur ICU par carte et rien de plus. *Recommandation : oui, dès la première carte.*
7. **Le début de la chronologie.** 1990-91 (ère moderne, patines plus tard) ou 1950 avec les ères graphiques dès la V1 (coût élevé). *Décidé : 1990-91 (années 90).*
8. **La langue d'écriture.** Décidé : **le MVP est en français uniquement** ; l'anglais est ajouté en version finale. (La bible garde l'architecture ICU multilingue, mais un seul fichier de langue est livré au MVP.)
9. **La structure juridique et les comptes.** Micro-entreprise, comptes développeurs, domaine, dépôt de marque. *Recommandation : tout ouvrir en semaine 1, le test fermé Google Play prend quatorze jours.*
10. **Le calendrier.** Plein temps ou temps partiel ; la feuille de route ci-dessus suppose le plein temps.

## 10.7 La semaine 1

- Lundi : lire la bible, trancher les dix décisions ci-dessus, ouvrir le dépôt avec la structure de dossiers de la section 9, écrire le fichier des rôles et des jauges.
- Mardi : écrire vingt cartes de l'Entraîneur dans le format YAML, le fichier des seize personnages, le calendrier de saison ; imprimer le prototype papier.
- Mercredi : le cœur : état, évaluateur de conditions, effets, tirage, Carte Match avec la formule ; premiers tests.
- Jeudi : le lint et la simulation Monte-Carlo ; 5 000 runs sur vingt cartes pour voir la forme de la courbe ; vingt cartes de plus.
- Vendredi : la pile de cartes et le swipe en Flutter, les quatre jauges, l'Épitaphe ; jouer vingt minutes debout ; ouvrir les comptes développeurs, acheter le domaine, lancer la recherche d'antériorité du titre.
- Week-end : faire jouer le prototype papier à trois personnes et noter ce qui les fait rire.
