# FUSIBLE (nom de code) : brainstorm et bible de design

Un jeu mobile façon Reigns, basé sur le football : une carte, un pouce, gauche ou droite, quatre jauges à tenir entre le vide et le trop-plein, et le jour où l'une déborde, on est viré. On incarne au hasard un joueur, un entraîneur, un directeur sportif, un président de village ou de Division 1, un sélectionneur ou un dirigeant d'instance ; on monte, on chute, on change de métier au fil des saisons ; le monde persiste et le successeur reprend là où l'on a été viré.

Ce dossier est le résultat de la phase de brainstorm demandée avant tout code. Le projet part de zéro : rien de ce qui existait dans ce dépôt n'est réutilisé.

## Lire dans l'ordre

| Fichier | Contenu | Quand le lire |
|---|---|---|
| [00-bible.md](00-bible.md) | La bible de design : pitch, piliers, boucle retenue, jauges officielles, rôles, saison, fins, croisement des destins, ton et univers, style graphique, décision de monétisation, périmètre MVP / V1 / plus tard, glossaire, titres | d'abord ; c'est la référence que toutes les sections respectent |
| [01-vision.md](01-vision.md) | Pourquoi Reigns et le foot vont ensemble, les personas, les références gardées ou rejetées, l'univers fictif, les titres | pour convaincre quelqu'un en dix minutes |
| [02-boucle-de-jeu.md](02-boucle-de-jeu.md) | La seconde, la minute, la saison, la carrière ; la résolution des matchs et le Grand Match ; le Bilan et les objectifs ; Pression, traits, objets ; le catalogue des 91 fins avec leurs épitaphes ; les 60 Destins | avant d'écrire une ligne de code |
| [03-roles-et-carrieres.md](03-roles-et-carrieres.md) | Les fiches des neuf rôles, 26 postulats de départ, le graphe complet des transitions, les ponts inattendus, les transitions forcées, ce qui se conserve d'un poste à l'autre, trois carrières de référence | avant d'écrire les cartes |
| [04-narration-et-destins.md](04-narration-et-destins.md) | Le ton, les seize personnages transversaux, douze arcs multi-saisons, les anecdotes réelles transposées, le monde persistant (Fantôme, mémoire des clubs, lignée, Nemesis, Almanach), le Panthéon, la rejouabilité | avant d'écrire les cartes |
| [05-banque-de-peripeties.md](05-banque-de-peripeties.md) | Le format d'une carte, douze cartes entièrement rédigées, un catalogue de 92 cartes par rôle, dix chaînes, les cartes joker | la matière première de l'écriture |
| [06-direction-artistique-ux-accessibilite.md](06-direction-artistique-ux-accessibilite.md) | L'album de vignettes, les alternatives écartées, le budget d'assets, les écrans, animations et haptique, la liste de contrôle d'accessibilité, la localisation, l'audio, tablette et web | avant de dessiner |
| [07-social-et-partage.md](07-social-et-partage.md) | Le Code de Carrière, les fonctionnalités sociales classées par palier, l'image de partage, les défis entre amis en détail, dix posts d'exemple, le lancement communautaire | avant de concevoir l'écran de fin |
| [08-monetisation-marche-juridique.md](08-monetisation-marche-juridique.md) | L'état du marché, la recommandation sur le premium à 2-3 €, le tableau des options, le compte d'exploitation à trois scénarios, le plan de prix, le cadre juridique complet (noms, satire, classification, données, contenu communautaire) | avant d'annoncer quoi que ce soit |
| [09-architecture-technique.md](09-architecture-technique.md) | La décision moteur, l'architecture en trois couches, le format de carte, le déterminisme, le pipeline éditorial (lint, simulation, tests), la localisation, la performance, l'intégration continue, la structure de dossiers, les risques | avant d'ouvrir l'éditeur |
| [10-feuille-de-route.md](10-feuille-de-route.md) | Le périmètre du MVP, les jalons, l'ordre de production du contenu, les métriques, les risques, les dix décisions à prendre maintenant, la semaine 1 | pour démarrer |

## Les décisions déjà prises (résumé de la bible)

- **Boucle** : socle Reigns pur (une carte = un moment, quatre jauges qui tuent aux deux bords, 36 à 44 cartes par saison), avec trois greffes : un Grand Match joué en direct en trois temps forts, une promesse publique par saison adossée à une valeur cachée de Parole, et la Une de journal comme objet de partage. Pas de simulation de championnat.
- **Jauges** : VESTIAIRE, TRIBUNES, DIRECTION, CAISSE, aux mêmes emplacements pour tous les rôles, renommées par rôle.
- **Rôles** : neuf rôles en six familles sur un seul moteur ; tirage aléatoire dès le premier run ; transitions par Cartes Destin au Bilan ; la Porte de sortie pour descendre sans mourir.
- **Die & retry** : 91 fins écrites, un Cimetière, une Succession en trois cartes face cachée, le Fantôme du personnage précédent.
- **Croisement des destins** : un monde persistant de 1990 à 2050, seize personnages transversaux avec relation, mémoire des clubs, lignée, Nemesis, Almanach ; la méta donne de la variété, jamais de la puissance.
- **Style** : l'album de vignettes autocollantes, portraits modulaires, écussons procéduraux, Une de journal.
- **Social** : zéro serveur ; un moteur déterministe et un Code de Carrière qui permettent seed partagé, duel, fantôme, roast, ligue ; défis du jour et de la semaine dérivés de la date.
- **Monétisation** : premium 2,99 € au lancement puis 3,99 €, sans publicité ni monnaie virtuelle ; démo web ; Steam à 5,99 € ensuite ; free-to-try sur Android seulement si les ventes le justifient à 90 jours.
- **Technique** : Flutter avec un cœur de règles en Dart pur, tout en données (YAML compilé en JSON), lint et simulation Monte-Carlo dès la semaine 4 ; Expo si l'équipe est en TypeScript, Godot si la Switch est visée d'emblée.
- **Juridique** : tout est fictif ; règle des deux traits pour les clins d'œil ; aucun scandale attaché à un personnage reconnaissable ; liste noire automatisée ; PEGI 12 / 13+ ; zéro donnée collectée.

## Ce qui reste ouvert

Les dix décisions listées en fin de section 10 : moteur, titre, illustrateur, monétisation confirmée, rôles du MVP, genre du protagoniste, début de la chronologie, langue d'écriture, structure juridique, calendrier.

## Méthode

Ce dossier a été produit par un brainstorm en plusieurs passes : idéation indépendante sur huit angles (systèmes et fins, rôles, narration et destins, péripéties, direction artistique et accessibilité, social, monétisation et juridique, technique), trois concepts de boucle centrale jugés par un panel selon deux lentilles (plaisir et rétention ; faisabilité pour un solo et fidélité au brief), puis une synthèse en directeur créatif qui a tranché les contradictions et fixé le vocabulaire dans la bible. Les chiffres de marché sont ceux de septembre 2026 et sont à revérifier au lancement.
