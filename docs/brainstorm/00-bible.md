# 0. Bible de design (nom de code : FUSIBLE)

> Ce document fixe le vocabulaire et les décisions que toutes les autres sections respectent. Là où le brainstorm proposait plusieurs voies, la bible tranche et dit pourquoi. Tout ce qui n'est pas ici est ouvert ; tout ce qui est ici ne se rediscute qu'en changeant la bible.

## 0.1 Pitch

**Une phrase.** Un Reigns du football : une carte, un pouce, gauche ou droite, quatre jauges à tenir entre le vide et le trop-plein, et le jour où l'une déborde, tu es viré. Ton monde, lui, continue sans toi.

**Trois phrases.** Tu incarnes au hasard un joueur, un entraîneur, un directeur sportif, un président de village ou de Division 1, un sélectionneur ou un dirigeant d'instance, et tu traverses ta carrière carte après carte. Les mêmes personnages te suivent d'un métier à l'autre, se souviennent, trahissent ou te rendent la pareille ; les Cartes Destin te font monter du terrain de district au palais de la FédéMonde, ou dégringoler. Chaque licenciement se termine sur une Une de journal partageable, et ton successeur reprend le monde là où tu l'as laissé.

## 0.2 Les cinq piliers

1. **Le swipe ne ment pas.** Une carte = une décision, deux issues, cinq secondes, une main. Jamais de chiffre affiché sur les jauges, jamais de chronomètre, jamais d'écran de gestion.
2. **Viré, pas mort.** Le die & retry est le contenu principal : chaque fin est nommée, écrite pour ce rôle et cette cause, collectionnée au Cimetière, partagée en Une de journal. Le monde persiste et ton successeur hérite de tes amis et de tes ennemis.
3. **Un seul moteur, neuf métiers.** Quatre jauges universelles aux mêmes emplacements pour tous les rôles ; seuls le libellé, l'icône contextuelle et le paquet de cartes changent. Ajouter un rôle coûte des cartes, jamais un écran.
4. **Tendre avec le ballon, féroce avec le business.** On rit des agents, des instances, des sponsors et des présidents ; on ne rit jamais du jeu, du village, du vieux gardien. Le drame existe, rare et sobre.
5. **Tout est donnée.** Cartes, rôles, jauges, fins, calendrier, personnages : des fichiers, pas du code. Un développeur solo écrit le soir, simule la nuit, équilibre le matin.

## 0.3 La boucle retenue

Le panel de concepts a opposé trois boucles. La bible retient le socle **CARTON** (fidélité maximale à Reigns, meilleure faisabilité solo, meilleur die & retry) et lui greffe trois idées de **FUSIBLE** (le Grand Match en direct, la promesse publique avec la Parole cachée, la Une de journal) ainsi que les outils de lisibilité de **Feuille de Match** (étoiles adverses, sablier, ligne d'objectif). La simulation de championnat à effectifs nommés est écartée : c'est un Football Manager de poche, et un solo s'y perdrait.

**La seconde.** Une carte au centre : portrait sur le tiers haut, nom et fonction, 160 caractères maximum. Le pouce incline la carte ; le libellé du choix (28 caractères maximum) apparaît du côté tiré ; au-dessus des jauges concernées, un point (petit, moyen, gros) dit l'ampleur, jamais le sens. Relâcher au-delà de 30 % de la largeur valide. Un tap sur la moitié gauche ou droite de l'écran remplace le swipe. Jauges animées en 300 ms, carte suivante. Cible : 5 secondes par carte.

**Les types de cartes.**

| Type | Apparence | Fonction |
|---|---|---|
| Personnage | portrait, fond de couleur du personnage | la carte standard : une réplique, deux choix |
| Match | double face, fond stade, liseré vert | résout un bloc de 6 journées avec un choix de posture |
| Grand Match | 3 cartes « temps fort » avec bandeau minute · score | le match joué en direct : derby retour, finale, barrage, tour de tournoi |
| Objectif | ruban de promesse | l'été, le patron fixe l'objectif ; accepter = promesse publique |
| Destin | liseré or, jingle | transition de carrière ou événement majeur, au Bilan ou à l'hiver |
| Nouvelle | fond journal, un seul choix « OK » | le monde bouge sans toi ; pose des drapeaux de monde |
| Alarme | icône de jauge qui pulse | injectée quand une jauge franchit 20 ou 80 |
| Bilan / Une | une de journal | classement, verdict de l'objectif, contrat, Carrefour |
| Épitaphe | portrait, icône coupable barrée | fin de run, deux phrases écrites pour ce rôle et cette cause |
| Succession | trois cartes face cachée | le run suivant commence sans passer par un menu |

**La saison en six actes** (36 à 44 cartes, 4 à 5 minutes) : Pré-saison et mercato d'été (6 à 8 cartes, dont la carte Objectif) ; Aller (10 à 12 cartes dont 3 Cartes Match) ; Trêve et mercato d'hiver (3 à 5 cartes) ; Retour (10 à 12 cartes dont 3 Cartes Match et la chaîne Coupe, un tour par carte) ; Sprint (le Grand Match : derby retour, finale, barrage ou match de la peur selon le rang provisoire) ; Bilan (la Une, le Verdict, le Contrat, le Carrefour). Un run moyen dure 5 saisons, soit 15 à 20 minutes ; un très bon run 12 saisons et trois métiers ; le run légendaire, du district à la FédéMonde, 35 saisons.

## 0.4 Les jauges officielles

Quatre jauges, toujours quatre, toujours aux mêmes emplacements. Chaque jauge tue à 0 et à 100. Leur nom canonique dans les données et dans ce document est en capitales ; le libellé affiché dépend du rôle.

| Emplacement | Nom canonique | Icône | Ce que c'est | Vide (0) | Pleine (100) |
|---|---|---|---|---|---|
| 1 | VESTIAIRE | crampon | ceux avec qui tu travailles tous les jours : coéquipiers, joueurs, staff, comité | la mutinerie : le groupe te lâche | le groupe te possède : tu n'es plus le chef |
| 2 | TRIBUNES | écharpe | le dehors : supporters, ultras, médias, village, nation, opinion mondiale | sifflets et banderoles : on te sacrifie pour calmer la rue | plus grand que le club : l'idole se perd ou fait peur |
| 3 | DIRECTION | fauteuil | ceux qui signent ton contrat et peuvent le déchirer | viré : la mort classique | l'homme du président : quand il tombe, tu tombes |
| 4 | CAISSE | billets | l'argent : ton compte, le budget, la trésorerie, les réserves | faillite, ruine, dépôt de bilan | trop d'argent, trop vite : le fisc, le fair-play financier, la perquisition |

**Libellés par rôle.**

| Rôle | VESTIAIRE | TRIBUNES | DIRECTION | CAISSE |
|---|---|---|---|---|
| Joueur amateur | Les copains | Le bistrot | Le coach | Le porte-monnaie |
| Joueur pro | Vestiaire | Tribunes | Le club | Compte en banque |
| Entraîneur (amateur / pro) | Vestiaire | Les parents / Tribunes | Le comité / Le président | La buvette / Le budget |
| Directeur sportif | Le staff | Tribunes | Le président | Masse salariale |
| Président amateur | Le club | Le village | La mairie | La caisse |
| Président pro | Le club | Tribunes | Actionnaires | Trésorerie |
| Sélectionneur | Le groupe | Le pays | La Fédération | Les moyens |
| Dirigeant d'instance | Le comité | L'opinion | Le Congrès | Les réserves |

**Valeurs cachées ou secondaires** (jamais des jauges, jamais affichées en chiffres) :

- **Force** (0 à 100) : le niveau de l'équipe, ou ton niveau personnel si tu es joueur (il décline de 3 par saison après 31 ans). Nourrit la résolution des matchs.
- **Parole** (−5 à +5, départ 0) : promesse tenue +1, trahie −1, trahie et publique −2. À −3, une carte d'alerte de Pierre Ménèche ; à −5, la mort universelle « Le Grand Déballage ». À +3, bonus aux temps forts et Destins accessibles même avec une jauge sous 20.
- **Relation** (−3 à +3) avec chacun des seize personnages transversaux ; lue par les conditions des cartes ; survit aux changements de métier.
- **Rang provisoire et objectif** : affichés en pied d'écran (« Saison 3 · Mars · 36 ans · 6e / Obj. Top 5 »), calculés par interpolation des points, sans classement vivant.

## 0.5 Les rôles officiels

Neuf rôles jouables, en six familles, un seul moteur.

| Rôle | Famille | Statut | Âge au tirage | Durée typique |
|---|---|---|---|---|
| Joueur amateur | Joueur | rôle d'entrée, pool court | 17-22 | 1-3 saisons |
| Joueur pro | Joueur | complet | 19-31 | 3-10 saisons |
| Entraîneur (adjoint, amateur, pro par substitution) | Banc | complet | 32-55 | 2-8 saisons |
| Directeur sportif | Bureau | court | 35-55 | 2-5 saisons |
| Président amateur | Bureau | court | 40-65 | 2-6 saisons |
| Président pro | Bureau | complet | 40-65 | 2-8 saisons |
| Sélectionneur | Sélection | complet | 40-62 | 2-6 cycles |
| Dirigeant d'instance (trois paliers : Fédération, Union Continentale, FédéMonde) | Instance | complet, pool partagé, noms substitués | 45-70 | mandats de 4 ans |
| Agent de joueurs | Intermède | plus tard (pack) | 30-60 | 1-3 saisons |

Intermèdes prévus plus tard, jamais comme carrières longues : arbitre, consultant TV, capo des ultras, propriétaire-investisseur.

**Tirage de départ** : aléatoire dès le premier run parmi les six familles (c'est le brief), pondéré ×2 vers les familles jamais jouées, avec un retirage gratuit. Trois cartes-postulat sont tirées, on en retourne une. Les postulats prestigieux (commencer patron de la FédéMonde, joueur star de Paris Capitale) se débloquent en ayant atteint le rôle une fois.

**Transitions** : elles n'arrivent qu'au Bilan ou au mercato d'hiver, par une Carte Destin à liseré or, jamais plus d'une par saison, et seulement si aucune jauge n'est sous 20 (personne ne recrute un homme radioactif, sauf Parole ≥ +3). La Porte de sortie, en cours de saison, est la seule façon de descendre l'échelle sans mourir : elle coûte (Tribunes, Caisse, promesses publiques trahies), ce n'est pas un filet. On ne redevient jamais joueur. Le graphe complet est en section 3.

**Passation** : VESTIAIRE = 50 (+10 si promotion interne), TRIBUNES = 40 + 0,3 × ancienne valeur, DIRECTION = 55, CAISSE = 50. Force = celle du nouveau club. Parole, Relations, drapeaux personnels et âge se conservent ; trois personnages « te suivent » (les deux meilleures relations et la pire).

## 0.6 Saison et matchs

- **Carte Match (double face)** : face avant, le bloc (« J7-J12, trois déplacements dont le leader »), quatre pictos de lisibilité (force adverse en étoiles de 1 à 5, domicile ou extérieur, smiley d'humeur du VESTIAIRE, trois derniers résultats) et un choix de posture (Offensif / Prudent, Les cadres / Les jeunes, Je joue blessé / Je me ménage). Face arrière, 1,2 s après le swipe : « V N V D V V · 14 pts », un score en gros, une ligne de commentaire générée qui nomme la malchance quand il y en a, puis les effets.
- **Formule** : p_victoire = borné(0,40 + (Force − ForceAdverse) / 150 + modificateurs, 0,10, 0,80) ; p_nul = 0,25 − |Force − ForceAdverse| / 400. Modificateurs : VESTIAIRE ≥ 70 : +0,06 ; ≤ 30 : −0,10 ; TRIBUNES ≤ 25 : −0,04 à domicile ; DIRECTION ≤ 20 : −0,03 ; Offensif +0,05 victoire / −0,08 nul ; Prudent l'inverse. Quatre Prudent d'affilée : VESTIAIRE −6.
- **Grand Match (en direct)** : 1 à 2 par saison, jamais plus. Trois temps forts, chacun une carte avec bandeau « 67e · 0-1 », une situation, deux choix étiquetés SÛR / ÉQUILIBRÉ / RISQUÉ (la seule information chiffrée du jeu). p = 0,50 + modificateur du choix (−0,15 / 0 / +0,15) + (Force − ForceAdverse) / 150 + 0,05 si VESTIAIRE ≥ 70 + 0,05 si Parole ≥ 3. Effets du résultat final doublés par rapport à une Carte Match.
- **Bilan** : points des six blocs convertis en rang par une table par division ; titre, montée, maintien, descente et leurs effets ; verdict de l'objectif (tenu : DIRECTION +15, Parole +1 ; raté : DIRECTION −20, TRIBUNES −10, Parole −2).
- **Variantes** : le sélectionneur vit en années civiles avec quatre fenêtres et, un été sur deux, une chaîne Tournoi (chaque tour à élimination directe est un Grand Match) ; le dirigeant d'instance vit en mandats de quatre ans avec des Cartes Événement double face à la place des matchs et une Campagne de quatre promesses avant la Carte Destin de réélection ; l'amateur a cinq Cartes Match et une Coupe qui peut lui amener un grand club.

## 0.7 Fin de run et die & retry

1. **Carton rouge** : une jauge touche 0 ou 100 après application des effets. L'écran s'assombrit, un carton rouge se lève au ralenti, coup de sifflet, puis l'Épitaphe : portrait, icône coupable barrée avec la mention « vide » ou « déborde », deux phrases écrites pour ce rôle et cette cause, le score, les Destins débloqués, le bouton Partager.
2. **Le Grand Déballage** : Parole ≤ −5, fin universelle même avec quatre jauges au vert, avec une Une listant chaque promesse trahie.
3. **Fins de choix** : une dizaine, jamais aléatoires (Le Chèque, Le Coup de tête, Garde à vue, L'Exil doré, Ministre).
4. **Fins d'âge** : joueur à 38 ans sans Destin accepté = « Le Jubilé » (bonne fin) ; tout rôle à 78 ans = « Ta loge » (bonne fin). Élection perdue au Congrès = « Battu au Congrès ».
5. **Score** : saisons × 10 + trophées × 25 + métiers occupés × 20 + promesses tenues × 5 − promesses trahies × 5 + fins inédites × 15.
6. **Succession** : après l'Épitaphe, trois cartes face cachée piochées parmi les personnages du run à relation ≥ +1 (l'adjoint, le capitaine, l'enfant qui débute joueur amateur, le protégé devenu directeur sportif) plus « Nouveau tirage ». Retourner une carte est le premier swipe du run suivant. Le mort devient le **Fantôme** : un PNJ qui revient citer sa propre épitaphe.
7. **Le Cimetière** : le mur des fins, avec épitaphes ; c'est un objectif de collection au même titre que le Panthéon.

Il n'y a pas de victoire finale. Une carrière se juge au score, au Cimetière et au Panthéon.

## 0.8 Croisement des destins et méta-progression

- **Un seul monde persistant** par sauvegarde : mêmes clubs (avec leur division), mêmes seize personnages transversaux (âge, relation, drapeaux de mémoire), un drapeau « ton prédécesseur » qui alimente des cartes dédiées. « Nouveau monde » depuis l'écran titre remet tout à zéro, Panthéon et Cimetière exceptés.
- **Une chronologie** : le monde commence en 1990-91 et court jusqu'en 2050 ; chaque run consomme ses saisons. Trois ères scénarisées par des Cartes Nouvelles datées : l'ère des présidents bâtisseurs (1990-2005), l'ère des fonds (2005-2025), l'ère du futur (2025-2050 : Mondial élargi, ligues fermées, arbitre algorithmique). Les patines visuelles par époque sont pour plus tard.
- **Mémoire des clubs** : rancune ou gratitude par drapeaux ; le club amateur d'un run précédent peut être celui qui t'élimine en Coupe.
- **Lignée** : fils, fille, neveu, filleul comme successeurs ; le nom se transmet.
- **Le Panthéon** : 60 Destins nommés (succès sous forme de cartes : « L'enfant du club », « Le Grand Chelem », « La Trilogie », « Homme de parole ») ; **l'Almanach** : la chronique générée du monde, une ligne par saison.
- **Rejouabilité** : tirage aléatoire des rôles, postulats déblocables, seeds partageables (Code de Carrière), Destin du jour et de la semaine dérivés de la date sans serveur, modificateurs de monde plus tard, mode « Vestiaire fermé » (ironman) en V1.
- La méta donne de la variété, jamais de la puissance.

## 0.9 Ton et univers

**Charte de ton.** Tendre et sérieux avec le ballon, le terrain, la buvette, le vieux gardien. Féroce et drôle avec tout ce qui l'entoure : agents, instances, sponsors, médias, présidents. Le drame (blessure, deuil, dépression) est rare, sobre, sans blague. Deux phrases par carte, une voix par personnage.

**Tout est fictif, reconnaissable par clin d'œil.** Règle des deux traits : un personnage peut partager au plus deux traits reconnaissables avec une personne réelle, jamais son nom, jamais son visage, et aucun scandale n'est attaché à un personnage reconnaissable.

**Instances et compétitions.**

| Réel (jamais utilisé dans le jeu) | Nom officiel dans le jeu |
|---|---|
| fédération nationale | la Fédération (FNF) |
| confédération continentale | l'Union Continentale (UC) |
| instance mondiale | la FédéMonde |
| championnats nationaux | Division 1, Division 2, National, Régional, District |
| coupe nationale | la Coupe |
| coupe continentale des clubs | la Coupe Continentale |
| championnat continental des nations | le Continental |
| coupe du monde | le Mondial |
| commission financière | la Commission de Contrôle des Comptes |

**Le pays** n'est jamais nommé ; la sélection s'appelle « les Cobalts ». **Clubs du pool de départ** (extraits) : US Valmont, AS Saint-Étoile (stade de la Marmite), Olympique Lyonnet, Paris Capitale FC, Racing de Valentienne, Stade Valdorne, Stade Bretonnant, FC Portclair, ES Montbéliac (le rival de village), Sporting Lusitano et Al-Dorado FC (étranger). Fonds souverain : Qatalyst.

**Les seize personnages transversaux** (mêmes portraits, trois variantes d'âge, une voix de texte, une relation chacun) : Rocco Fardelli (agent, gourmette et cigare), Pierre Ménèche (journaliste, chemise ouverte, mémoire d'éléphant), Gégé (capo de la Tribune Nord), Jean-Marie Aulard (président bâtisseur, avocat de formation), Zoran Vukić (adjoint fidèle, ancien gardien), Titi Bréhaut (capitaine puis directeur sportif), Doc Sabatier (médecin du club), Camille (la personne qui partage ta vie, seule carte qui parle d'autre chose que de foot), Madame Aubert (maire), Noël Legruet (président de la Fédération), Giancarlo Bambini (patron de la FédéMonde, costume bleu, ambitions de calendrier), Cheikh Nassir (fonds Qatalyst), Madame Josiane (secrétaire du club depuis 1987, le tutoriel incarné), Brian Clow (le mentor, entraîneur à la retraite), Lian Mbako (le jeune prodige, l'horloge qui avance), Gigi Vecchio (le vieux gardien, l'horloge qui recule).

## 0.10 Style graphique et UX de base

**L'album de vignettes autocollantes.** Chaque carte est une vignette (bord blanc irrégulier, fond en aplat, buste en ligne claire), chaque run remplit un album, chaque fin de saison et chaque fin de run est une Une de journal sportif, chaque club a un écusson héraldique généré. Portraits modulaires (paper doll : environ 40 têtes en couches donnent des centaines de visages), 12 à 14 décors, une cinquantaine d'icônes. Les outils de génération servent au concept et à la palette, jamais à l'asset final.

**UX.** Portrait, une main, zéro chronomètre. Tout ce qui se touche est dans le tiers inférieur. Jauges lisibles par forme, icône, hachure et position, jamais par la couleur seule. Swipe et boutons dès le MVP, police pour dyslexiques, taille de texte dynamique, réduction de mouvement, lecteur d'écran en V1. Audio poli : jamais de musique forcée, mode transports qui bascule sur l'haptique, commentateur en texte façon radio.

## 0.11 Monétisation : la décision

**Premium, comme le demande le commanditaire, mais structuré.** 2,99 € / 2,99 $ au lancement (palier identique Apple et Google), 3,99 € en régime de croisière après la première grosse mise à jour ; zéro publicité, zéro monnaie virtuelle, zéro compte, jeu hors ligne. Commission de 15 % via les programmes petites entreprises, soit environ 2,10 € net par vente en Europe.

**Ce qui l'accompagne** : une démo web gratuite (le premier run, une saison, un rôle, Une partageable incluse) comme entonnoir, car un lien partagé doit montrer quelque chose avant le mur du prix ; un port PC/Steam à 5,99 € six à neuf mois après le mobile ; sur Android seulement, à l'étude, une version d'essai avec achat unique de déblocage (le piratage y rend le premium à l'entrée fragile) ; plus tard, un « pack supporter » cosmétique non consommable et des packs de rôles ou d'époques à 1,99 €. Aucun abonnement de plateforme n'est attendu. L'argumentaire complet est en section 8.

## 0.12 Périmètre

| Palier | Contenu | Cartes | Objectif |
|---|---|---|---|
| Prototype papier (semaine 2) | 1 rôle, 40 cartes imprimées | 40 | valider le plaisir du swipe et des quatre jauges |
| MVP jouable (semaine 10) | Joueur pro + Entraîneur, Cartes Match, 1 Grand Match, promesse publique, épitaphes, Succession | ≈ 280 | vérifier sur 30 testeurs que l'on relance |
| V1 lancement (mois 7 à 9) | Joueur amateur (court), Joueur pro, Entraîneur, Président amateur (court), Président pro, Sélectionneur, Instance à trois paliers ; 16 personnages ; 30 Nouvelles ; 60 Destins ; Cimetière ; seeds et défis sans serveur ; FR + EN | ≈ 900 | sortie iOS + Android + démo web |
| Mise à jour 1 (gratuite) | Directeur sportif, arcs longs (Super Ligue, valises, écoutes), lecteur d'écran, ES/PT-BR/DE/IT | + 250 | relancer les téléchargements |
| Plus tard | Agent, arbitre, consultant, époques et patines, Steam, Switch, packs | + 200 par pack | seconde vie commerciale |

## 0.13 Glossaire

- **Run** : une carrière, du tirage à l'Épitaphe.
- **Postulat** : la situation de départ tirée (rôle, âge, club, contexte, deux modificateurs).
- **Carte Destin** : la carte à liseré or qui propose une transition ou un événement majeur.
- **Carrefour** : le moment du Bilan où les Cartes Destin peuvent apparaître.
- **Porte de sortie** : l'offre de descendre l'échelle en cours de saison, quand DIRECTION est entre 10 et 25.
- **Passation** : le recalcul des jauges au changement de rôle.
- **Grand Match** : le match joué en direct en trois temps forts.
- **Bloc** : six journées résolues par une Carte Match.
- **Sablier** : l'icône d'une carte à conséquence différée (6 à 20 cartes plus tard).
- **Drapeau** : une variable booléenne posée ou consommée par les cartes ; les chaînes en sont faites.
- **Parole** : la valeur cachée des promesses.
- **Le Grand Déballage** : la mort par Parole.
- **Fantôme** : le personnage du run précédent revenu en PNJ.
- **Succession** : les trois cartes face cachée après l'Épitaphe.
- **Cimetière** : la collection des fins. **Panthéon** : la collection des Destins (succès). **Almanach** : la chronique du monde.
- **Code de Carrière** : la graine et la version de contenu, encodées pour partager un destin.
- **Nouvelle** : la carte fond journal qui fait bouger le monde.

## 0.14 Huit titres commerciaux à l'étude

| Titre | Pour | Contre |
|---|---|---|
| FUSIBLE | dit exactement le die & retry du foot ; un mot, mémorable | peu lisible hors francophonie (titre par langue possible : *Sacked*) |
| Carton rouge / Red Card | universel, icône évidente | générique, ancien jeu homonyme, difficile à déposer |
| 89e minute / 89th Minute | la tension du Grand Match ; chiffre visible en icône | ne dit pas le côté carrière |
| Viré ! / Sacked! | brutal, drôle, direct | agressif en vitrine, moins « collection » |
| Homme du président | ironique, très foot, raconte une fin | long, masculin |
| Dernière journée | double sens (journée de championnat, dernier jour au poste) | doux, peu accrocheur en vignette de store |
| Coach démission | banderole connue de tous | ne couvre que le banc |
| L'Album | la métaphore visuelle, la collection | trop neutre, invisible en recherche de store |

Recommandation : **FUSIBLE** en francophonie et **Sacked** ailleurs, sous-titre commun « Une carrière, un swipe à la fois ». À vérifier à l'INPI et à l'EUIPO avant l'annonce (voir section 8).
