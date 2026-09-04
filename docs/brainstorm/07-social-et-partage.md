# 7. Confrontation entre amis, social et partage sur les réseaux

Principe : zéro serveur au lancement. Tout le social repose sur un seul primitif, le Code de Carrière, rendu possible par un moteur entièrement déterministe ; chaque licenciement produit une image conçue pour être lue sans connaître le jeu ; les rituels par date remplacent le classement en ligne. Le domaine utilisé ci-dessous (fusible.app) est un exemple à remplacer par le titre retenu.

## 7.1 Le Code de Carrière, socle de tout

- **Le moteur est déterministe** : générateur pseudo-aléatoire seedé (32 bits), chaque tirage (carte suivante, résultat de match, humeur d'un personnage) dérive de la graine, de l'index de carte et de l'état ; aucun appel à l'horloge ni à un aléa non seedé dans la logique ; toutes les jauges en entiers. Les seules variables libres sont les swipes.
- **Le format** : [version de contenu, 1 octet][graine, 4 octets][postulat et options, 1 octet][nombre de swipes, 2 octets][1 bit par swipe][contrôle CRC-8], encodé en base32 sans ambiguïté (pas de O/0 ni I/1). Une carrière de 160 cartes tient en 28 octets, soit 45 caractères groupés par cinq (« FF7A3-9KQ2M-… ») : ça tient dans un SMS, un message Discord, un QR.
- **Deux formes** : le code « seed » de 8 caractères (version + graine + postulat) pour « joue la même carrière que moi », affiché sur la carte Tirage et sur toutes les images ; le code « complet » (avec les choix) pour le fantôme, le replay, le roast, la comparaison, la ligue.
- **L'import** : coller dans un champ, scanner un QR, ouvrir un lien https://fusible.app/c/<code> ; les trois arrivent sur le même écran d'aperçu avant de lancer.
- **La version de contenu** gère les mises à jour du paquet : si elle diffère, dégradation propre (statistiques et roast fonctionnent, replay et fantôme désactivés avec un message clair) ; les paquets des versions précédentes sont conservés en JSON.
- **Le test** : cent codes de référence rejoués à chaque build, état final comparé ; un seul appel non seedé (ordre d'itération d'un dictionnaire, arrondi flottant différent selon la plateforme) casse tout.

Coût presque nul si décidé au jour 1, prohibitif après coup. C'est un critère de choix de moteur (section 9) : un cœur de jeu portable vers le web rend le lecteur de carrière dans le navigateur et la vérification serveur des scores presque gratuits plus tard.

## 7.2 Les fonctionnalités, classées

| Fonctionnalité | Palier | Serveur | Coût | Viralité | Ce que c'est |
|---|---|---|---|---|---|
| L'Épitaphe partageable | MVP | non | faible | très forte | l'image de fin de run, style vignette brillante à bord foil, même cadre et même coin logo sur toutes les images pour être reconnaissable dans un fil comme une grille de Wordle |
| La Une de fin de saison | MVP | non | moyen | forte | l'objet de partage à chaque Bilan, pas seulement à la mort : cinq à douze occasions par run au lieu d'une |
| Accroches et hashtags générés | MVP | non | faible | forte | 80 gabarits de texte à trous pré-remplis dans la feuille de partage, adaptés par réseau, hashtag maison #JaiÉtéViré (#GotSacked) |
| Défi du jour et de la semaine | MVP | non | faible | forte | graine dérivée de la date, postulat imposé, modificateur, une tentative comptée, texte compact façon Wordle |
| Duel asynchrone | MVP | non | faible | forte | même graine, qui tient le plus longtemps ; lien contre lien, verdict avec le premier point de divergence |
| QR, deep links et site d'aperçu | MVP | site statique | moyen | forte | un lien partagé doit montrer quelque chose avant le mur du prix |
| Morts nommées et Destins | MVP | non | faible | forte | 91 fins et 60 Destins à collectionner, chacun une carte partageable avec rareté de conception |
| Export texte Markdown | MVP | non | très faible | moyenne | le récit d'une carrière en huit puces pour Discord, Reddit et forums |
| Passe le téléphone : Succession et Relais | MVP si le temps le permet | non | faible | forte en soirée | le mode qui fait installer le jeu au pote qui l'a vu jouer |
| Classements Game Center et Play Games | V1 | plateformes | faible-moyen | faible-moyen | plus longue carrière, un tableau par rôle, défi de la semaine ; aucune gestion d'amis maison |
| Le Fantôme d'un ami | V1 | non | moyen | moyenne-forte | jouer avec l'ombre d'un ami sur la même graine |
| Le Roast | V1 | non | moyen (écriture) | forte | un chroniqueur fictif démonte la carrière d'un ami à partir de son code |
| Pactes : ton club devient mon rival | V1 | non | moyen | moyenne | le club et le personnage d'un ami injectés dans ma carrière |
| Cartes Cameo | V1 | non | moyen | moyenne-forte | le personnage d'un ami apparaît en agent véreux dans ma partie |
| Mode spectateur et « Et si ? » | V1 | non | faible-moyen | moyenne-forte | rejouer un code comme un film et prendre les commandes à la carte 33 |
| « Toi, tu ferais quoi ? » | V1 | non | faible | forte | exporter un dilemme avec les zones du sticker sondage d'Instagram |
| Ligue entre amis sur quatre semaines | V1 | non (le groupe de messagerie sert de transport) | moyen | moyenne | quatre graines, codes de résultat vérifiés par replay, image de classement |
| Conseil d'administration (passe le téléphone à 3-4) | V1 | non | moyen | moyenne | chaque carte est routée vers le joueur dont c'est le domaine, un veto par saison |
| Mode soirée et mode streamer | V1 | non | faible | moyenne | grande police, minuteur pour laisser voter, fond incrustable, carte de fin sans QR personnel |
| Cartes communautaires | V1 | formulaire en ligne | faible (éditorial) | moyenne | « ma carte est dans le jeu », crédit de l'auteur, pack trimestriel |
| Export vidéo 9:16 | plus tard | non | élevé | très forte | récap animé de 15 secondes ; d'abord un carrousel de cinq images ou un GIF |
| Fiche encyclopédique de carrière | plus tard | non | moyen | moyenne-forte | l'article sérieux d'un personnage absurde |
| Album des rencontres et échanges de doublons | plus tard | non | moyen (illustration) | moyenne-forte | « il me manque le Kaiser » |
| Widget et rappels | plus tard | non | moyen (natif) | faible | rétention pure |
| Clubs de joueurs (guildes) | plus tard, au-delà de 50 000 joueurs | oui | élevé | moyenne | authentification, modération, RGPD : disproportionné pour un jeu à 2,99 € |

## 7.3 L'image de partage

Trois gabarits, générés sur l'appareil par rendu d'un écran caché en texture puis encodage PNG, exportés par la feuille de partage native, sans SDK de réseau social, sans permission, sans suivi.

1. **L'Épitaphe** (1080 × 1350 pour le fil, 1080 × 1920 pour la story) : la vignette du personnage, nom et poste (« Président du Racing de Valentienne »), durée en poste (« 1 147 jours »), trois statistiques de légende (titres, transferts, scandales survécus), la cause de fin en une ligne (« Viré après un 0-6 dans le derby ; les ultras ont brûlé son effigie devant le siège »), l'épitaphe, le numéro de carrière (« Carrière n° 37 »), l'icône coupable barrée, le code seed et un mini QR. Environ 150 épitaphes indexées par rôle, cause et jauge fautive, plus vingt génériques : « Parti comme un fax en panne un soir de mercato », « A tenu moins longtemps qu'une Ligue fermée », « A confondu la main de Dieu et la sienne ».
2. **La Une** : le journal fictif du pays du club, manchette tirée de 120 titres tagués par cause, rôle et intensité avec repli générique et règle de compatibilité (une élimination juste après un titre donne « CHUTE D'UN ROI » plutôt que « DÉGAGE ! »), sous-titres générés par jauge (une phrase par tranche), deux ou trois brèves rappelant les faits de la saison (« Doc Sabatier démissionne », « Fardelli réclame sa commission »), la photo tramée de la carte fatale, le score et le code. Les unes de saison sont archivées dans un kiosque.
3. **Ma carrière** (1080 × 1080) : une frise horizontale avec écussons, rôles, trophées, la cause de la fin en une ligne, le nombre de cartes swipées, le code. Une option masque le pseudo.

Exemples de textes pré-remplis : « Viré après trois saisons pour avoir tweeté contre l'arbitre. Être président ne protège de rien. #JaiÉtéViré » ; « Quatorze ans sélectionneur des Cobalts, éliminé par une grève du bus. Bats-moi : fusible.app/d/… » ; « Mon agent m'a vendu deux fois la même semaine. Le foot, c'est simple. » ; « FUSIBLE S36 · Sélectionneur · 84 cartes · crampon écharpe fauteuil billets → la Fédération m'a lâché · fusible.app/w/36 ». Pour X un gabarit court ; pour Instagram, sans lien mais avec le code ; pour TikTok, une liste de hashtags. Un bouton « Reformuler » tire un autre gabarit.

## 7.4 Les défis entre amis en détail

**Le Destin du jour et de la semaine.** Graine de la semaine = 32 premiers bits d'un hachage de (« fusible-week » + année ISO + numéro de semaine + sel + version de contenu). Tout le monde joue la même carrière et le même modificateur (« Mercato fou : la CAISSE bouge deux fois plus vite », « Vidéo en panne : toutes les cartes d'arbitrage sont piégées », « Semaine du président tweeteur : chaque carte média coûte double », « Mondial : le vestiaire est vide pendant dix cartes »). Une tentative comptée, les suivantes marquées « entraînement » ; score = cartes survécues + bonus de titres. Notification locale le lundi à 9 h : « Cette semaine, tu es directeur sportif du Sporting des Docks, avec 40 millions de dettes. » Classement via les plateformes ou par échange de codes. Sans serveur, rien n'empêche de changer la date du téléphone : assumé, il n'y a aucun enjeu monétaire.

**Le duel asynchrone.** Depuis l'écran de fin, « Défier un ami » ouvre la feuille de partage avec le texte et l'image du duel ; le lien contient le code complet de A (graine, choix, score) et un tag duel. B voit « Julien te défie » (portrait, durée, cause, jamais les choix), joue la même graine ; à sa mort, l'écran VERDICT montre les deux portraits, les durées, les causes, le premier point de divergence (« carte 12 : tu as vendu le capitaine, il l'a gardé »), et une image « Marie 61 – Julien 58 ». B renvoie le verdict ; A reçoit une carte « Résultat du duel » et peut lancer la revanche (nouvelle graine = hachage des deux codes, identique des deux côtés). Anti-triche minimale : le score est recalculé par replay des choix, un score forgé sans choix cohérents est rejeté. Il faut une URL courte avec le code en chemin, car les messageries tronquent.

**Le Fantôme.** L'avatar miniature de l'ami s'affiche en haut ; trois réglages : Spoiler (une flèche fantôme indique son choix avant le tien, exclu des scores), Révélation (son choix apparaît après le tien, vert si identique, rouge sinon), Muet (seulement le marqueur de mort). Compteur de divergence (« 14 désaccords sur 40 cartes »), frise en bas ; à l'index où l'ami est mort, la carte est encadrée de noir avec « Ici, Julien a été viré » ; la dépasser déclenche une fanfare et « Tu as survécu à Julien ». Le mode spectateur rejoue un code comme un film (×1, ×3, ×10, résumé automatique sur les cartes marquantes) et « Prendre les commandes » bifurque ; le nouveau code inclut l'index de bifurcation et un hachage du code parent, ce qui dessine des arbres de carrières (« La carrière de Julien a sept branches »).

**Le Roast.** On colle un code complet ; un chroniqueur fictif (« Daniel Ribollo », le râleur de l'after, ou Ménèche, le bourru des plateaux) produit quatre à six phrases, une note sur dix et une image de plateau TV. Moteur à règles, pas d'intelligence artificielle : des détecteurs de contradictions à partir des tags des cartes (a vendu le capitaine puis s'est plaint du manque de leaders ; a refusé trois fois le même agent puis a signé le quatrième ; a viré son adjoint avant une finale ; a promis « zéro transfert » puis dépensé 80 millions), cent gabarits par chroniqueur, quinze ouvertures et clôtures, le fait le plus grave en dernier (« Vendre ton capitaine à la 12e carte pour pleurer du manque de leaders à la 30e, c'est du niveau district », « 2/10, la note d'un défenseur qui joue le hors-jeu tout seul »). Le ton vise le jeu, jamais la personne. « Réponds-lui » lance un duel.

**La ligue entre amis.** Un commissaire crée une ligue (nom, quatre graines, points 3/1/0 par rang hebdomadaire ou cumul de cartes) et partage un code « L-… » ; chaque membre joue la journée de la semaine et poste son code de résultat dans le groupe ; n'importe qui colle tout le texte du groupe, le jeu extrait les codes, vérifie par replay, met à jour le tableau et génère « Classement, journée 2 » avec podium, écarts et une ligne de commentaire (« Julien, dernier pour la deuxième semaine : la relégation approche »). Le dernier reçoit un handicap la semaine suivante, le premier un titre honorifique sur sa carte de fin.

**Les pactes et les cameos.** Depuis le code d'un ami, le jeu extrait son club et son personnage et crée un rival personnalisé injecté dans ma prochaine carrière, avec une quinzaine de cartes paramétriques (« Julien chambre ton équipe en conférence de presse », « Le club de Julien propose une entente sur le prix des billets du derby ») ; si les deux importent l'autre, « Pacte scellé : le Derby des Docks entre Marie et Julien », et un bilan du derby s'alimente à chaque échange. Le code personnage « P-… » (prénom, avatar en quatre couches, deux traits parmi douze, rôle rêvé) fait apparaître un ami en PNJ (agent, journaliste, arbitre mystique qui consulte les astres) ; dix cameos actifs au plus ; le résumé de fin dit « Julien est apparu quatre fois : il t'a coûté deux scandales ». Prénoms filtrés et renommables ; les carrières avec rival ou cameo sont marquées hors défis, car elles ne sont plus comparables sur la même graine.

**Passe le téléphone.** Succession : A joue jusqu'à son licenciement, B hérite du même club dans l'état exact (jauges, dettes, scandales en cours) avec la carte « Le nouveau coach découvre le vestiaire pourri par son prédécesseur », score d'équipe et classement individuel (« Marie a redressé le club, Julien l'a coulé »). Relais : le téléphone change de main toutes les cinq cartes. Conseil d'administration : chacun prend un rôle (président, coach, capitaine, agent), le jeu route chaque carte vers la personne concernée selon son tag de domaine, un veto par saison ; cela exige que chaque carte soit taguée par domaine dès l'écriture.

## 7.5 Dix posts d'exemple

1. « Trois saisons à Valmont. Un titre. Un tweet à 3 h du matin. Viré. #JaiÉtéViré » (Épitaphe).
2. « IL AVAIT PROMIS LA MONTÉE. IL RENTRE À PIED. La Une de ma saison 8. » (Une).
3. « Toi, tu ferais quoi ? Ton meilleur joueur veut partir, les ultras grondent, le fonds propose 51 %. Gauche ou droite ? » (dilemme avec sticker sondage).
4. « Duel : je t'ai laissé le Stade Ardent en pleine crise, j'ai tenu 58 cartes. Fais mieux. fusible.app/d/… ».
5. « FUSIBLE S36 · Sélectionneur · 84 cartes · crampon écharpe fauteuil billets → la Fédération m'a lâché » (texte Wordle).
6. « Mon pote Julien est apparu dans ma carrière en agent véreux. Il m'a coûté deux scandales. Ça ne m'étonne pas. » (cameo).
7. « Roast de la carrière de Marie par Ménèche : 2/10, "la note d'un défenseur qui joue le hors-jeu tout seul". » (roast).
8. « J'ai débloqué la fin "Le raid à l'aube" (légendaire). Des messieurs en imperméable à six heures du matin. » (Destin).
9. « Ligue des Potes, journée 2 : Julien dernier pour la deuxième semaine, la relégation approche. » (classement).
10. « Ma carrière en une frise : joueur amateur → capitaine → adjoint → viré → consultant → sélectionneur → viré à deux mois du Mondial. » (frise).

## 7.6 Le lancement communautaire

- **Le site d'aperçu** (statique, GitHub Pages ou Cloudflare Pages) décode le code en JavaScript et affiche portrait, poste, durée, cause, épitaphe, badges des stores ; si le cœur de jeu est portable, il rejoue la carrière en lecture seule dans le navigateur : la meilleure bande-annonce possible, puisqu'elle est personnalisée. Fichiers d'association Universal Links et App Links, domaine acheté avant le premier partage public, bouton « Ouvrir dans l'appli » pour les navigateurs intégrés des messageries.
- **La démo web** (le premier run, section 8) est l'entonnoir : chaque lien partagé mène à quelque chose de jouable avant le prix.
- **Reddit et Discord** : le récit Markdown est le format natif des communautés de jeux de management ; un serveur Discord modeste avec un salon « épitaphes » et un salon « propose ta carte ».
- **Les créateurs foot** cherchent des formats courts : le mode streamer (grande police, minuteur pour le vote du chat, fond incrustable) coûte presque rien ; Reigns a explosé grâce aux vidéos.
- **Les cartes communautaires** : un formulaire de proposition, une sélection par trimestre, le crédit de l'auteur dans la carte, une image « Ma carte est dans le jeu », un concours mensuel de la meilleure épitaphe republiée par le compte du jeu. Une cession simple des droits dans le formulaire.
- **Les trois vidéos de lancement** racontent les trois carrières de référence (section 3.6) : trois vies très différentes dans le même jeu.
