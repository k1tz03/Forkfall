# 8. Monétisation, marché et cadre juridique

Réponse directe au commanditaire : **oui, le premium à 2-3 € est le bon modèle**, et il faut le garder. Mais il faut le structurer (prix de lancement puis prix de croisière, PC ensuite, démo web), l'accompagner d'une porte d'entrée gratuite qui ne soit pas du free-to-play, et le protéger juridiquement dès la première carte.

## 8.1 L'état du marché

Chiffres issus des recherches de septembre 2026, à vérifier au moment du lancement.

- Le free-to-play représente environ 96 % des téléchargements et 85 % des revenus mobiles, mais les sorties premium ont augmenté de 77 % en 2025 (près de 750 titres selon Sensor Tower) et les ports premium se vendent.
- Reigns a vendu environ 600 000 unités en un mois à 2,99 $ en 2016, n'a jamais bougé de ce prix, et compte 500 000 à 1 million de possesseurs sur Steam. Balatro a fait 1 million de dollars en une semaine sur mobile et plus de 9 millions à 9,99 $ : le public premium existe et il n'est pas sensible à un euro de plus.
- Les abonnements ne sont plus un refuge : Netflix a fermé des studios et retiré des indés de son catalogue en août 2026 (moins de 1 % des abonnés jouaient régulièrement sur mobile) ; Apple Arcade baisse ses avances depuis 2020 et a retiré Reigns: Beyond en octobre 2025 ; Google Play Pass reste un bonus non exclusif rémunéré à l'engagement.
- Les commissions : 15 % via le Small Business Program d'Apple et le palier Google Play sous 1 million de dollars par an, à activer avant la mise en ligne, sinon 30 %.
- La niche est libre. Football Manager Mobile (9,99 $ + achats intégrés pendant dix ans) est devenu une exclusivité Netflix en 2023. Soccer Manager et Club Soccer Director sont en free-to-play à consommables. Football Chairman Pro plafonne à 1,99 $ + achats intégrés avec une interface austère ; c'est la référence la plus proche pour le rôle de dirigeant. Pocket League Story (4,99 $) date de 2012. New Star Soccer et Retro Goal jouent la carrière de joueur en gratuit + déblocage. Les Reigns-likes non foot (Lapse, Thrones, Dictator) sont en free-to-play à publicités. **Il n'existe aucun jeu de foot narratif premium moderne, et aucun jeu qui couvre tous les postes avec une boucle de trois minutes.**
- Le format swipe est facile à cloner (2048 a dévoré Threes en quelques semaines en 2014) : la barrière est l'écriture et la marque, pas la mécanique. Sortir vite et bien.

## 8.2 La recommandation

**Premium, à 2,99 € / 2,99 $ au lancement (palier identique Apple et Google) pendant 8 à 12 semaines, annoncé comme prix de lancement, puis 3,99 € à la sortie de la première grosse mise à jour de contenu.** La hausse est elle-même une actualité et provoque un second pic. Le net par vente en Europe passe d'environ 2,12 € à 2,85 € (+35 %) avec une élasticité quasi nulle sur ce public. Zéro publicité, zéro monnaie virtuelle, zéro compte, jeu hors ligne : l'achat est l'unique porte d'entrée, comme Reigns, Slay the Spire mobile ou Pocket City.

Pourquoi pas le free-to-play : un développeur solo n'a ni le budget d'acquisition, ni l'outillage analytique, ni les opérations live hebdomadaires que ce modèle exige ; et surtout, dans un die & retry, la seule chose vendable est « ne pas mourir » (relancer une jauge, annuler un licenciement), ce qui transforme la tension en péage et fait fuir exactement le public de Reigns. Le die & retry doit rester gratuit et instantané.

Pourquoi pas les publicités : elles imposent un SDK, une plateforme de consentement, la fenêtre de suivi iOS, le filtrage des publicités de paris et d'alcool pour un public de 13 ans et plus, 10 à 20 Mo de plus, et rapportent 1 à 3 $ pour mille vues là où le foot est roi.

**Ce qui accompagne le premium** :

1. **Une démo web gratuite** : le premier run (une saison, un rôle, Une partageable incluse) en HTML5 sous 20 Mo, hébergée sur itch.io et sur le site du jeu, proposée aux portails de jeux web. Un lien partagé doit montrer quelque chose avant le mur du prix ; les journalistes et streameurs n'installent rien.
2. **La page Steam dès le premier trailer**, port PC à 5,99 € six à neuf mois après le mobile, Switch en année 2 : le PC est le second moteur de revenus.
3. **Sur Android seulement, à l'étude** : une version d'essai avec déblocage unique (drapeau isUnlocked, reçu vérifié, aucun serveur), si à 90 jours les ventes Android sont inférieures à 25 % des ventes iOS ; jamais sur iOS. Le point de coupure et le drapeau sont prévus dans l'architecture dès le départ pour basculer sans refonte.
4. **Un pack supporter** cosmétique et non consommable à 1,99 ou 2,99 € (« Carte de membre fondateur » : dos de cartes, palettes de maillots rétro, cadres de partage, nom aux crédits), attendu chez 3 à 8 % des acheteurs.
5. **Des packs de contenu déterministes** en année 2 si le socle dépasse 20 000 ventes (époques, rôles : agent, arbitre, consultant) à 1,99 €, jamais d'aléatoire payant ; sinon une suite autonome à 3,99 € qui réutilise 90 % du moteur (la stratégie de série de Reigns, cross-promue depuis le menu).
6. **Clause de revoyure** à 90 jours : sous 3 000 ventes cumulées, on active le free-to-try Android ; on ne touche pas à iOS.

## 8.3 Le tableau des options

| Option | Avantages | Inconvénients | Verdict |
|---|---|---|---|
| Premium 2,99 € puis 3,99 € | simple, cohérent avec le die & retry, aucune dette réglementaire, public habitué à payer 3 à 10 € | absent des classements gratuits, dépend du featuring, de la presse et du bouche-à-oreille ; piratage Android | **retenu** |
| Free-to-try + déblocage unique | présence dans les classements gratuits et la recherche (5 à 10 fois plus de téléchargements), conversion de 2 à 5 % sur un cliffhanger, diffusion dans les pays foot à faible pouvoir d'achat | notes de non-acheteurs frustrés, mention « achats intégrés », deux comportements selon la plateforme ; 40 000 téléchargements × 3 % = 1 200 ventes, moins qu'un premium à 4 000 | Android seulement, à la revoyure |
| Modèle « Retro Bowl » (gratuit, pubs facultatives, déblocage) | masse (40 millions de téléchargements pour la référence) | SDK publicitaire, consentement, suivi, publicités de paris, image de jeu à pubs | non au lancement, envisageable en année 2 pour préparer une suite |
| Free-to-play à monnaie virtuelle | le modèle des concurrents outillés | détruit le cœur du jeu ; trois métiers qu'un solo n'a pas | refusé |
| Abonnements de plateforme | avance de trésorerie | pivots des services, exclusivité qui fait disparaître le jeu | ne pas construire pour ; si une offre arrive : minimum garanti ≥ 12 mois de revenus premium projetés (30 à 50 k€), exclusivité ≤ 12 mois, retour des droits automatique, propriété intellectuelle conservée |
| Packs déterministes / suite autonome | prolonge la vie commerciale | matrice de tests, fragmentation ; un pack sur 4 000 ventes ne rembourse pas son écriture | année 2, selon le socle |
| Port PC/Steam puis Switch | 500 000 à 1 million de possesseurs Steam pour Reigns ; wishlists convertibles à 10-15 % la première semaine | médiane Steam 2025 à 249 $ bruts par jeu sans wishlists ; lotcheck Nintendo | **retenu** : page Steam dès le trailer, objectif 7 000 wishlists, Steam Next Fest avec la démo |
| Tarification régionale | volume et notes au Brésil, en Argentine, au Mexique, en Turquie, en Inde, en Indonésie, au Nigeria, en Égypte, au Maroc | net à environ 1 € par unité | retenu : paliers à 0,99-1,49 € |
| Pack supporter cosmétique | signal de communauté, réponse à « comment vous soutenir » | mention « achats intégrés » à expliquer sur la fiche | retenu en V1 |
| Éditeur | featuring, QA, portages, localisation | 30 à 50 % des revenus, perte du calendrier | auto-édition par défaut ; n'approcher un éditeur qu'avec une démo, 5 000 wishlists ou un clip viral ; aides du CNC non dilutives |
| Précommande, promotions, Kickstarter léger | second pic, communauté, presse | une campagne ratée est publique | précommande App Store et pré-inscription Play ; promotions « fin du mercato » à −33 % les 31 janvier et 1er septembre et pendant les tournois d'été ; jamais « gratuit pour une semaine » |
| Partenariats médias foot et créateurs | contenu et caution | négociation chronophage, droits | deux ou trois packs de cartes coécrits à la sortie, sans marque tierce dans le jeu |
| Mac App Store, bundles, Humble | marchés sans travail | tests iPad-sur-Mac | oui, en longue traîne |

## 8.4 Le compte d'exploitation à trois scénarios (24 mois)

Net par unité : mobile 2,99 € → 2,49 € HT × 0,85 = 2,12 € en Europe, environ 2,30 € aux États-Unis, environ 1 € dans les pays à palier réduit, moyenne pondérée avec deux promotions annuelles à −40 % : **1,80 €**. Steam 5,99 € → 3,49 € net, moyenne avec soldes **2,90 €**. Switch 7,99 € → moyenne **3,50 €**.

| Scénario | Mobile | Steam | Switch | Total brut net | Coûts cash | Net |
|---|---|---|---|---|---|---|
| Pessimiste (sans featuring ni presse) | 4 000 ventes = 7 200 € | 1 500 = 4 350 € | 0 | ≈ 11 500 € | ≈ 4 000 € (comptes développeurs, marque INPI, polices et sons, relecture de deux langues, trailer) | ≈ 7 500 €, soit 600 € par mois de travail : échec économique, mais socle technique et portfolio pour un second jeu |
| Réaliste (un featuring Apple, relais Reddit et YouTubeurs Football Manager, 5 000 wishlists) | 30 000 (20 000 iOS, 10 000 Android) = 54 000 € | 12 000 = 34 800 € | 5 000 = 17 500 € | ≈ 106 000 € | ≈ 15 000 € (localisation cinq langues, illustrations, portage Switch, marque EUIPO) | ≈ 91 000 €, soit 3 800 € par mois sur 24 mois : viable pour un solo |
| Optimiste (viralité des cartes partagées, featuring iOS et Android, presse foot généraliste) | 200 000 = 360 000 € | 60 000 = 174 000 € | 25 000 = 87 500 € | ≈ 620 000 € | ≈ 40 000 € (huit langues, ports, marketing, comptable) | ≈ 580 000 € |

Repères : seuil de rentabilité cash ≈ 2 200 ventes ; seuil couvrant neuf mois de travail valorisés 40 000 € ≈ 20 000 ventes toutes plateformes ; à 3,99 €, le net mobile monte à environ 2,45 € par unité ; au-delà de 1 million de dollars annuels, la commission repasse à 30 %. Les unités sont des ordres de grandeur issus de comparables ; le scénario réaliste suppose au moins un featuring, qui ne se commande pas.

## 8.5 Le plan de prix

| Marché | Mobile | Steam | Switch |
|---|---|---|---|
| Europe, Royaume-Uni, Amérique du Nord, Japon, Australie | 2,99 € / 2,99 $ puis 3,99 | 5,99 € | 7,99 € |
| Brésil, Argentine, Mexique, Turquie, Inde, Indonésie, Nigeria, Égypte, Maroc | équivalent 0,99 à 1,49 € | tarification régionale Steam | selon disponibilité |
| Promotions | −30 à −40 % sur quelques jours : fin du mercato (31 janvier, 1er septembre), tournois d'été, finales de juin | soldes saisonnières, Next Fest | soldes eShop |

Comptes : Apple individuel (99 $ par an) puis organisation avec numéro DUNS ; Google Play (25 $) avec, pour un compte personnel, le test fermé obligatoire de douze testeurs pendant quatorze jours avant publication, à planifier ; Steam 100 $ par jeu, remboursables après 1 000 $ de ventes ; portail Nintendo gratuit. Formulaire W-8BEN sur chaque store pour éviter la retenue américaine de 30 % ; les stores agissent comme vendeurs en titre pour la TVA européenne. Micro-entreprise au départ, EURL ou SASU dès qu'on signe avec un éditeur ou que les revenus dépassent 30 à 40 k€. Piratage Android : une vérification de licence légère avec échec doux (une carte in-world « Le trésorier signale que votre licence n'est pas en règle » avec lien vers le store, et le jeu continue), pas de DRM sur Steam, jamais plus de deux jours sur le sujet.

## 8.6 Le cadre juridique

### Noms et marques : la charte de nommage fictif

- **Liste noire automatisée** : un fichier d'environ 1 500 termes protégés (instances et leurs sigles, compétitions, clubs des grands championnats et leurs surnoms déposés, joueurs, entraîneurs, présidents, agents, arbitres notables, stades à nom commercial, équipementiers, sponsors, opérateurs de paris, médias, le nom du trophée individuel le plus célèbre qui est une marque d'un groupe de presse) ; un script en pré-commit et en intégration continue scanne chaque texte de carte, chaque nom généré et les métadonnées des stores, et fait échouer le build sur correspondance exacte ou approchée (distance de Levenshtein ≤ 2), avec une liste blanche pour les mots génériques (Coupe, Ligue, Olympique employé seul). Un test génère 100 000 noms procéduraux et vérifie qu'aucun ne collisionne.
- **Règle de nommage des clubs** : jamais la dénomination déposée ni le couple ville + forme sociale qui la constitue ; villes inventées, quartiers, fleuves et surnoms géographiques non déposés ; vérification gratuite de chaque surnom sur les bases INPI, EUIPO et UKIPO ; pas de calembour phonétiquement proche d'une marque (le droit des marques français ne connaît pas d'exception de parodie, elle n'existe qu'en droit d'auteur) ; couleurs libres mais jamais le couple couleur + motif signature ; pays et villes réels utilisables, mais pas les écussons fédéraux ni les surnoms d'équipes nationales déposés.
- **Quinze noms fictifs de référence** : clubs : US Valmont, AS Saint-Étoile, Olympique Lyonnet, Paris Capitale FC, Racing de Valentienne, Stade Valdorne, Stade Bretonnant, FC Portclair, ES Montbéliac, Union du Vieux-Port, Real Montoya, Sporting Lusitano, Al-Dorado FC ; instances : la Fédération (FNF), l'Union Continentale (UC), la FédéMonde ; compétitions : la Coupe, la Coupe Continentale, le Continental, le Mondial (générique), le Ballon d'Argent ; sélection : les Cobalts ; sponsors : FrigoPlus, Médiacrash, Qatalyst, Parions Tout, Brasserie du Stade. Aucun acronyme approchant les instances réelles ; trophées de forme originale (les instances détiennent des marques tridimensionnelles sur les leurs).
- **Personnages** : noms générés à partir de listes de prénoms et de patronymes courants par pays, jamais à partir de bases de joueurs ; un test rejette toute combinaison présente dans une liste de 5 000 personnalités du football et les patronymes uniques à forte identification employés seuls ; les personnages-clins d'œil portent un champ « cible » et passent par la checklist ci-dessous ; aucun clin d'œil aux agents réels vivants, les plus procéduriers du milieu.
- **Blasons, maillots, trophées** : générateur qui exclut les symboles signatures (canon, oiseau, diable, coq, louve, chauve-souris, aigle couronné) et les couples couleurs + motif ; revue manuelle des 200 blasons les plus probables contre les 100 écussons les plus connus avant chaque sortie ; maillots sans logo d'équipementier et sans trois bandes sur les manches.

### La satire des personnes réelles : la règle des deux traits

Cadre : le droit à l'image connaît une exception de caricature quand l'intention humoristique exclut toute confusion, mais les juges la limitent en exploitation commerciale ; la diffamation frappe toute imputation d'un fait précis à une personne identifiable, même sous nom d'emprunt ; l'Allemagne, l'Italie et l'Espagne protègent fortement l'image, les États-Unis ont le right of publicity, le Royaume-Uni le passing off ; Apple rejette les contenus qui humilient une personne réelle précise. Règle : un clin d'œil combine au plus **deux** marqueurs identifiants (une phrase culte paraphrasée + une nationalité, ou une anecdote transposée + une époque), jamais trois (nom approchant + physique + biographie). Exemple valide : un attaquant au col relevé qui saute dans la tribune (deux traits, pas de nom). Exemple interdit : « Éric le King », col relevé, club rouge de Manchester. **Ligne rouge absolue** : toute carte de dopage, de paris truqués, de corruption, de violence ou de mœurs est rattachée à un personnage purement inventé, sans aucun clin d'œil, même pour une personne décédée. Les figures disparues peuvent inspirer des anecdotes positives ou neutres. Chaque carte-clin d'œil passe une checklist (traits comptés, nature du fait, personne vivante ou non). Les seize personnages transversaux de la bible respectent cette règle par construction : les scandales sont portés par des situations et des seconds rôles inventés, jamais par les portraits reconnaissables.

### Le contenu sensible et la classification d'âge

Cible : PEGI 12, ESRB Teen, Apple 13+ (paliers Apple refondus en juillet 2025 : 4+, 9+, 13+, 16+, 18+). Le questionnaire IARC sur Google Play produit d'un coup les classifications PEGI, ESRB, USK, ClassInd, ACB et GRAC ; Apple a le sien ; chaque mise à jour de contenu impose de les refaire. Lignes rouges pour les auteurs :

1. **Paris** : références narratives admises (l'enveloppe d'un parieur, une offre de match truqué), mais toute mécanique où le joueur mise de l'argent du jeu sur un résultat aléatoire relève du jeu d'argent simulé, classé PEGI 18 depuis 2020 : interdit dans le design. Aucun mot-clé lié aux paris dans les métadonnées.
2. **Dopage, drogue, alcool** : références textuelles seulement, jamais de consommation dans les illustrations, pas de glamourisation ni de mode d'emploi (une scène d'ivresse illustrée bascule en PEGI 16) ; un sponsor de bière fictif peut exister, une carte qui récompense l'ivresse non.
3. **Langage** : vulgarité légère, aucune insulte discriminatoire.
4. **Violence** : bagarres de tribune en texte, pas de sang à l'image.
5. **Sexualité** : sous-entendus et tabloïds, rien d'explicite.
6. **Discrimination** : le racisme des tribunes est un problème à traiter, jamais un choix récompensé ; ignorer a une conséquence négative.
7. **Corruption** : thème libre.

### Données personnelles : la stratégie « zéro donnée »

Hors ligne, sans compte, sans SDK d'analyse ni de publicité : la fiche App Store affiche « Données non collectées » et le formulaire Google Play « aucune donnée collectée », et cela doit être strictement vrai. Une politique de confidentialité d'une page reste obligatoire (aucune donnée collectée, achats traités par les stores, classements par Game Center et Play Games). Rapports de plantage par le système d'exploitation. Classification 13+ sans catégorie Enfants ni marketing enfantin, ce qui écarte COPPA et le RGPD applicable aux mineurs. Chaque ajout de SDK tiers rouvre tout le chantier : à décider consciemment. Si de l'analyse arrive plus tard : données agrégées sans identifiant d'appareil, bannière de consentement en Europe.

### Le contenu communautaire et le « real name fix »

- **Zéro serveur au MVP** : le partage passe par des images rendues localement et des codes, les classements par les plateformes, qui sont responsables de traitement et modèrent les pseudonymes ; le développeur n'héberge rien et n'a pas de statut d'hébergeur. Un serveur communautaire ferait arriver en bloc le statut d'hébergeur, le règlement européen sur les services numériques, le signalement et le retrait, la règle Apple 1.2, le filtre de vulgarité multilingue et la gestion des mineurs : trois à six semaines de travail puis une charge permanente, pas avant l'année 2.
- **Leçon du procès Manchester United contre Sega et Sports Interactive (2020-2021)** : la plainte visait aussi la tolérance envers les patchs tiers restaurant blasons et noms réels. Politique : une fonction « Renommer » limitée au texte, stockée sur l'appareil, jamais synchronisée ; aucune importation ni exportation de packs de noms, aucun lien vers des packs communautaires, aucune fonction nommée « vrais noms » ; aucun import d'images ; les cartes partagées avec noms personnalisés portent la mention « noms modifiés par le joueur » et aucun logo ; ne pas héberger, lier ni commenter les packs que la communauté produirait.
- **Les cartes proposées par les joueurs** transitent par un formulaire en ligne avec cession simple des droits ; elles sont réécrites par le développeur avant intégration.

### Achats intégrés, musique, textes, contrats

- Aucun contenu payant aléatoire ; tout achat non consommable avec bouton « Restaurer les achats » ; prix en devise locale ; fiche store : « Achats intégrés facultatifs et cosmétiques ». Une régression sur la restauration après changement de téléphone est la première cause de notes à une étoile sur les jeux premium.
- Aucun chant de stade réel (mélodies protégées), aucun hymne d'instance ; chants originaux sans paroles ; hymnes nationaux en arrangement original court ou absents ; polices sous licence OFL ; illustrations originales ou CC0, jamais de photos de joueurs ni de stades reconnaissables ; un fichier de licences listant chaque asset ; musique sans empreinte Content ID pour que les streameurs diffusent sans réclamation.
- Aucune importation de bases de données de joueurs, de transferts ou de statistiques (droit sui generis des producteurs de bases) ; les faits sont libres, les textes sont réécrits ; citations cultes paraphrasées ; une note de sources par carte historique.
- Toute prestation freelance (illustration, musique, traduction) avec cession de droits écrite, explicite et délimitée ; contrat de licence utilisateur court ; mentions légales et adresse de contact sur le site ; disclaimer au premier lancement et sur la fiche (« Toute ressemblance avec des clubs, personnes ou institutions existants serait fortuite »).
- **Le titre du jeu** : recherche d'antériorité sur les bases INPI, EUIPO et USPTO, vérification sur les stores, Steam, les noms de domaine et les réseaux ; dépôt à l'INPI (190 € pour une classe, classes 9 et 41) ou à l'EUIPO (850 € pour une classe) avant l'annonce ; jamais « Reigns », « Football Manager » ni le nom d'une instance dans le titre, le sous-titre, les mots-clés ou la description (Apple rejette les références à d'autres applications) ; la comparaison « dans l'esprit de Reigns » est réservée au dossier de presse.
