# 2. Boucle de jeu, jauges, saisons, matchs, fins de partie et succès

Cette section détaille la boucle fixée par la bible : ce qui se passe à la seconde, à la minute, à la saison et à l'échelle d'une carrière, puis le catalogue complet des fins et des succès. Les noms de jauges sont ceux de la bible : VESTIAIRE, TRIBUNES, DIRECTION, CAISSE.

## 2.1 La seconde : un geste, une carte, un retour

1. **La carte arrive** par le dessous, en 250 ms. Portrait sur le tiers haut, nom et fonction du personnage, réplique de 160 caractères maximum, jamais plus de trois lignes.
2. **Le pouce l'incline.** À 40 pixels de déplacement, le libellé du choix (28 caractères maximum) s'écrit au-dessus de la carte du côté tiré. Au-dessus des jauges concernées, un point s'allume : petit (±1 à 5), moyen (±6 à 12), gros (13 et plus). Jamais le sens, jamais le chiffre. Si la carte porte un **sablier**, une petite icône apparaît dans son coin : une conséquence viendra plus tard, sans dire laquelle ni pour quel côté.
3. **Relâcher** au-delà de 30 % de la largeur valide ; en deçà, retour élastique en 180 ms. Un tap sur la moitié gauche ou droite de l'écran fait la même chose que le swipe (jeu à une main, accessibilité motrice).
4. **La résolution** : la carte part (250 ms), les jauges glissent (300 ms), une ligne de conséquence d'une phrase peut s'afficher sous le HUD (« Ton agent boude. »), la carte suivante monte. Retour haptique : léger au seuil d'inclinaison, moyen à la validation, fort quand une jauge franchit 20 ou 80.
5. **Rythme cible** : 4 à 8 secondes par carte. Une carte d'événement pur (une insulte dans le tunnel) ne fait pas avancer le calendrier ; une Carte Match avance de six journées.

Le HUD tient en trois zones. En haut, les quatre icônes de jauges (crampon, écharpe, fauteuil, billets) remplies verticalement, avec sous chacune le libellé du rôle en cours. Au centre, la carte. En pied, une ligne de contexte : « Saison 3 · Mars · 36 ans · 6e / Obj. Top 5 », et, quand une promesse publique est active, un ruban d'une ligne : « Promis : Top 5, échéance juin ».

## 2.2 La minute : l'enchaînement et la tension

- **Le paquet** filtre les cartes par rôle, acte de saison, drapeaux requis ou interdits, seuils de jauges, âge, division, relation avec le personnage qui parle. Il pondère, favorise les personnages déjà rencontrés, interdit la même carte deux fois en 40 tirages et injecte les cartes de chaîne à distance (2 à 6 cartes plus loin, 6 à 20 pour les sabliers).
- **Les alarmes.** Quand une jauge franchit 20 vers le bas ou 80 vers le haut, l'icône pulse en rouge et une carte d'alarme portée par un personnage entre dans les trois tirages suivants. Huit alarmes par rôle (deux par jauge) : « Le président ne te salue plus », « Gégé chante ton nom… un peu trop », « Ton banquier appelle », « Camille demande si tu comptes rentrer un jour ». C'est la seule aide chiffrée sans chiffre du jeu, et elle rend lisibles les morts par débordement, les moins intuitives.
- **Le piège du centre.** Garder les quatre jauges entre 40 et 60 pendant douze cartes déclenche des cartes qui punissent l'immobilisme (« Tu ne prends jamais position, dit Ménèche », « Il nous faut un projet, dit Aulard »), dont les deux options poussent fort vers un bord ou posent un sablier. Le simulateur (section 9) doit vérifier que la politique « tout centrer » ne dépasse pas sept saisons de moyenne.
- **La dérive passive.** Une jauge « fragile » propre à chaque rôle perd 1 point toutes les deux cartes (CAISSE pour le président, DIRECTION pour l'entraîneur, TRIBUNES pour le joueur, VESTIAIRE pour le sélectionneur et l'instance). Elle augmente avec la Pression (voir 2.6).
- **Les Cartes Nouvelles** (fond journal, un seul choix « OK »), une par acte de saison, servent de respiration entre deux décisions et rendent le monde visible : « Qatalyst rachète 80 % de l'US Valmont », « La FédéMonde impose la vidéo en Division 2 », « Le sélectionneur des Cobalts viré après le Continental ». Elles posent des drapeaux de monde qui ouvrent des Cartes Destin.

## 2.3 La saison : six actes, 36 à 44 cartes

| Acte | Cartes | Ce qui s'y passe |
|---|---|---|
| Pré-saison et mercato d'été | 6 à 8 | la **Carte Objectif** (le patron du rôle fixe l'objectif ; swipe droit = promesse publique, swipe gauche = DIRECTION −8 et aucune dette), 3 à 4 offres de mercato, le stage (un choix d'axe : physique, cohésion ou tournée commerciale), une Nouvelle |
| Aller | 10 à 12 | 3 **Cartes Match** (J1-J6, J7-J12, J13-J19), les chaînes s'amorcent, une Nouvelle |
| Trêve et mercato d'hiver | 3 à 5 | bilan de mi-saison, 2 offres de mercato, la carte « Noël » (trois variantes par rôle : le joueur rentre au pays, l'entraîneur reçoit une montre, le président déjeune avec la maire) |
| Retour | 10 à 12 | 3 Cartes Match (J20-J26, J27-J32, J33-J38), la **chaîne Coupe** (un tour par carte, adversaire tiré dans tout le monde persistant, 20 % de chance forcée d'un écart de deux divisions), cartes Pression ou Tentation selon le rang provisoire |
| Sprint | 3 à 5 | le **Grand Match** en direct (derby retour, finale de Coupe, barrage ou match de la peur selon le rang), sa carte Après-match |
| Bilan | 3 à 4 | **La Une** (le journal titre la saison), **le Verdict** (classement contre objectif), **le Contrat** (rester, partir, réclamer), **le Carrefour** (Cartes Destin si conditions remplies) |

Le mercato est un sous-paquet d'offres concrètes : « Fardelli propose un attaquant quatre étoiles à 12 millions », « Le rival offre 25 millions pour Dembo », « Un vieux gardien libre veut finir chez toi ». Le dernier jour, une carte à fond rouge propose un coup de poker dont une option sur trois pose un sablier (« Dossier médical caché », « Le fax n'est jamais parti »). Refuser trois fois Fardelli fait disparaître ses offres pour deux saisons.

**Calendriers spécifiques.** Le sélectionneur vit en années civiles : quatre fenêtres (mars, juin, septembre-octobre, novembre), chacune une carte Liste (deux dilemmes : rappeler le vieux capitaine ou lancer Mbako, sélectionner le joueur en délicatesse avec la justice) et une Carte Match de deux ou trois rencontres ; un été sur deux, la chaîne Tournoi : poules en Carte Match, puis chaque tour à élimination directe en Grand Match, sans carte narrative entre eux. Le dirigeant d'instance vit en mandats de quatre ans : quatre dossiers par an (arbitrage vidéo, calendrier, droits TV, attribution du Mondial) en Cartes Événement double face, un Congrès annuel, et, la quatrième année, la Campagne (quatre promesses à des confédérations) puis la Carte Destin de réélection. L'amateur joue cinq Cartes Match, une Coupe qui peut lui amener Paris Capitale FC, et des libellés « Le comité », « Le bistrot », « La mairie ».

## 2.4 Les matchs : une carte, pas une simulation

**La Carte Match (double face).** Face avant : le bloc (« J7-J12 : trois déplacements dont le leader »), quatre pictos de lisibilité (force adverse en étoiles de 1 à 5, domicile ou extérieur, smiley d'humeur du VESTIAIRE en trois états, trois derniers résultats), et un choix de posture propre au rôle : Offensif / Prudent (entraîneur), Les cadres / Les jeunes (entraîneur, sélectionneur), Je joue blessé / Je me ménage (joueur), Je descends au vestiaire / Je reste en loge (président). Face arrière, révélée 1,2 s après le swipe avec la clameur ou les sifflets : « V N V D V V · 14 pts », un score en gros (« Valmont 2-1 Montbéliac »), une ligne de commentaire tirée de 40 gabarits qui nomme la malchance quand p_victoire dépassait 0,6 et que le résultat est une défaite (« Le derby bascule sur une sortie ratée du gardien »), puis les effets.

**La formule**, pour chacune des six rencontres du bloc :

- p_victoire = borné(0,40 + (Force − ForceAdverse) / 150 + modificateurs, 0,10, 0,80)
- p_nul = 0,25 − |Force − ForceAdverse| / 400 ; le reste est une défaite
- ForceAdverse = moyenne de la division ± 10, +6 pour un « gros » nommé sur la carte
- Modificateurs : VESTIAIRE ≥ 70 : +0,06 ; VESTIAIRE ≤ 30 : −0,10 ; TRIBUNES ≤ 25 : −0,04 à domicile ; DIRECTION ≤ 20 : −0,03 ; Offensif : +0,05 victoire et −0,08 nul ; Prudent : l'inverse ; quatre Prudent d'affilée : VESTIAIRE −6 (« on s'ennuie »)

**Effets** : victoire TRIBUNES +2, DIRECTION +2 ; défaite TRIBUNES −3, DIRECTION −3 ; nul rien ; derby gagné TRIBUNES +5 en plus ; défaite contre le rival TRIBUNES −6 ; plus l'effet propre de la posture. Pour le joueur, la face arrière ajoute « ta note moyenne 6,8 · 2 buts », tirée de ta Force personnelle et de l'attitude choisie ; la note fait bouger DIRECTION (le coach) et TRIBUNES, le résultat collectif fait bouger VESTIAIRE. Un remplaçant (DIRECTION < 35) voit « deux entrées en jeu » et des effets divisés par deux.

**La Force** (0 à 100) n'est pas une base de données. Elle se lit dans le Dossier comme cinq lignes notées en étoiles (gardien, défense, milieu, attaque, banc) et trois têtes d'affiche nommées (portrait, poste, âge, un trait : Sanguin, Fêtard, Meneur, Fragile, Mercenaire, Enfant du club). Les têtes d'affiche parlent dans les cartes, se blessent, se vendent, vieillissent. Le mercato monte une ligne d'une étoile ou remplace une tête d'affiche, dans la limite de deux étoiles par fenêtre.

**Le Grand Match (en direct).** Une carte-annonce (« DERBY. La Marmite est pleine. Adversaire : 4 étoiles, à domicile, vestiaire souriant »), puis trois temps forts. Chaque temps fort est une carte standard avec un bandeau « 67e · 0-1 » en en-tête, une situation et deux choix portant sous le libellé un profil SÛR, ÉQUILIBRÉ ou RISQUÉ, la seule information chiffrée du jeu. Résolution : p = 0,50 + modificateur du choix (−0,15 / 0 / +0,15) + (Force − ForceAdverse) / 150 + 0,05 si VESTIAIRE ≥ 70 + 0,05 si Parole ≥ 3. Succès ou échec modifie le score et applique un mini-effet (±3 sur une jauge). Le résultat final applique les effets d'une Carte Match doublés. Les temps forts sont écrits par famille de rôle : joueur (tirer le penalty ou le laisser au capitaine, tacle appuyé, jouer blessé, la main de Dieu), banc (remplacement, changement de système, faire monter le gardien sur le corner, ordre des tireurs), président (descendre au vestiaire à la mi-temps, alpaguer l'arbitre dans le tunnel, tweeter), amateur (l'arbitre absent, la bagarre de parents, la buvette sans glace), instance (le tirage au sort en direct, la remise du trophée à côté d'un dictateur, la panne de la vidéo en finale). Cent temps forts templatés (cinq familles × vingt) avec les variables {adversaire}, {minute}, {score}, {capitaine}.

**Après-match.** Après chaque Grand Match, une carte dont les effets s'inversent selon le résultat : « Féliciter / Recadrer », « Parler à la presse / Se taire ». Recadrer après une victoire coûte VESTIAIRE et gagne DIRECTION ; après une défaite, l'inverse.

**Exemple pas à pas.** Entraîneur du Stade Valdorne (Division 2, Force 44). Carte Match J13-J19, face avant : « Trois réceptions dont le leader. ★★★☆☆ · domicile · vestiaire neutre · V N D ». Posture : Offensif. Calcul pour la réception du leader : ForceAdverse 56, p_victoire = 0,40 + (44 − 56) / 150 + 0,05 = 0,37 ; p_nul = 0,25 − 12 / 400 = 0,22. Face arrière : « V V N D V V · 13 pts · Valdorne 2-1 Racing Nordique · Le leader tombe à Valdorne sur un but de Dembo à la 88e ». Effets : quatre victoires (+8 TRIBUNES, +8 DIRECTION), une défaite (−3, −3), Offensif (+2 VESTIAIRE). Pied de page : « Saison 1 · Février · 41 ans · 5e / Obj. Maintien ». Le rang provisoire dépasse l'objectif : le paquet injecte une carte Tentation dans les quatre tirages suivants (Fardelli : « L'Olympique Lyonnet aime ton foot »).

## 2.5 Le Bilan et les objectifs

- **Points → rang** : les points des six blocs (maximum 108) sont convertis par une table par division. Division 1 : ≥ 82 titre, ≥ 70 Coupe Continentale, ≤ 38 descente. Division 2 : ≥ 72 montée directe, 64-71 barrage (un Grand Match), ≤ 36 descente. Amateur : ≥ 70 montée. Le rang provisoire affiché en pied de page interpole ces tables après chaque bloc, sans classement vivant.
- **Effets de saison** : titre TRIBUNES +20, DIRECTION +15, CAISSE +10 ; montée TRIBUNES +12, DIRECTION +12, CAISSE +8 et ForceAdverse +12 la saison suivante ; descente TRIBUNES −15, DIRECTION −25, CAISSE −15, Force −8 ; Coupe Continentale CAISSE +10, VESTIAIRE −4 (fatigue) et une chaîne de trois cartes la saison suivante ; maintien tranquille : rien, et c'est un piège (« Il nous faut un projet »).
- **L'objectif** est tiré d'une table selon la Force du club et la Pression : le patron demande toujours un cran de plus que la Force ne le justifie, avec la garantie qu'il reste atteignable à 55 % sans mercato. Catalogue : Maintien ; Top 10 ; Top 5 ; Coupe Continentale ; Titre ; Gagner la Coupe ; Vendre pour X ; Réduire la masse salariale de 20 % ; Titulariser trois jeunes ; (sélectionneur) Se qualifier, Passer les poules, Demi-finale ; (instance) Attribuer le Mondial sans scandale, Signer un sponsor majeur, Faire voter la réforme ; (joueur) 20 titularisations, 10 buts, Prolonger, Être appelé chez les Cobalts.
- **Le Verdict** : objectif tenu → DIRECTION +15, Parole +1, prochain objectif un cran plus haut ; raté → DIRECTION −20, TRIBUNES −10, Parole −2 (la promesse était publique). Il n'y a pas de mort automatique par objectif : c'est la jauge qui tue, et si elle casse à la carte Verdict, l'épitaphe est celle de l'objectif manqué (voir 2.9).
- **Le Contrat** : prolonger, partir, réclamer une augmentation. Refuser une offre extérieure pose le drapeau « fidèle » (TRIBUNES +6, une carte « Fidèle » dans le paquet).
- **Le Carrefour** : une Carte Destin au plus par saison, seulement si aucune jauge n'est sous 20 (ou Parole ≥ 3). Détail en section 3.

## 2.6 La carrière : difficulté, Pression, âge

**La Pression** (0 à 10, affichée dans le Dossier comme un thermomètre nommé : Tranquille, Attendu, Sous surveillance, Siège éjectable, Fin de règne) monte de 1 par saison survécue et par objectif réussi, baisse de 1 quand on redescend d'un cran (revenir en amateur soulage). Elle pilote quatre leviers lisibles : la dérive passive (de 1 point toutes les deux cartes à 2 points toutes les trois cartes), la table d'objectifs (deux crans de plus à partir de 6), le paquet (les cartes « retorses », vente d'un joueur sans prévenir, journaliste qui a des photos, vote truqué, n'apparaissent qu'à partir de 4), et l'amplitude des effets négatifs des cartes retorses (×1,25 à partir de 8). Jamais de dés truqués cachés. La première carrière verrouille la Pression à 0 pendant deux saisons.

**L'âge** augmente de 1 à chaque Bilan ; le portrait vieillit par paliers (gris à 45, lunettes à 55, canne à 75). Le joueur voit sa Force personnelle baisser de 3 par saison après 31 ans ; à 35, la carte « Les jambes » propose de raccrocher ; à 38, le Jubilé. Après 70 ans, chaque saison programme la carte « Le médecin » (5 % puis +5 % par an de « Mort au poste », une fin dorée). À 75, un rival au Congrès peut proposer une limite d'âge.

**Le monde durcit sans compteur** : monter de division augmente la ForceAdverse ; un titre gonfle TRIBUNES et DIRECTION vers le trop-plein ; les journalistes attendent la chute.

## 2.7 Traits, objets, économie

**Traits** (trois actifs au plus, le plus ancien remplacé avec une carte « Tu as changé ») gagnés par trois choix d'une même famille ou par un événement : Sanguin (TRIBUNES +8 sur les provocations, suspensions ×2, débloque « Le coup de tête »), Tacticien (Force +2, cartes de tableau noir, VESTIAIRE s'ennuie), Homme de réseau (offres +1, cartes d'arrangement, expose aux fins judiciaires), Intègre (immunise contre les fins de corruption, ferme les cartes de valise), Formateur (jeunes +1 étoile), Mercenaire (offres +1, VESTIAIRE −10 à chaque arrivée), Bavard (cartes de presse ×2), Enfant du club (TRIBUNES ne descend jamais sous 15 tant que tu restes ; partir vaut −30 partout ailleurs). Dix traits au lancement, qui suivent le personnage à travers les rôles.

**Objets** (à la manière de Reigns, un seul héritable à la mort) : le Brassard (débloque « Discours », VESTIAIRE +3 par Grand Match gagné), le Carnet noir de Fardelli (+1 offre par mercato, 10 % par fenêtre qu'il te vende sans te demander), la Clause libératoire, le Tableau de Pepe Guardian (Force +4, chaque usage coûte 2 VESTIAIRE), le Chéquier du Mécène (CAISSE +15 une fois par saison, il veut choisir l'entraîneur à la troisième), le Téléphone rouge de la Ligue, la Montre suisse (DIRECTION +10 à l'instance ; si « Audit » sort, fin « Le raid à l'aube »), le Sifflet du kiné, l'Écharpe du kop, le Cabinet d'avocats (transforme une fin judiciaire en suspension, une fois), Léo le Lion (la mascotte, kidnappable par les ultras), le Dossier médical caché (objet maudit), le Bus (annule une fin VESTIAIRE vide, une fois). Un objet = une icône, une phrase, une à trois règles, trois à six cartes.

**Économie** : il n'y a que deux chiffres en plus des jauges, tous deux dans le Dossier, jamais imposés : le budget (ou le compte en banque) et la Réputation (0 à 100, le CV, qui filtre les offres au Carrefour). La CAISSE est la projection en jauge des flux ; le président voit une mini-comptabilité par saison (droits TV par division, billetterie = capacité × (40 % + TRIBUNES / 2), sponsors = Réputation × 0,3, masse salariale par étoiles) ; deux soldes négatifs de suite déclenchent « La Commission de Contrôle des Comptes ». En amateur, la buvette, la subvention municipale, la cotisation et Gérard qui tient la caisse depuis vingt ans.

## 2.8 Effets à retardement, chaînes, tutoriel

**Le planificateur** : toute option peut programmer 0 à 3 cartes futures {carte, délai min, délai max en cartes, probabilité, condition d'annulation, variables}. À chaque tirage, les cartes différées échues passent avant le paquet normal. Une carte différée porte une condition d'annulation (« même club », « même rôle », « tête d'affiche encore présente ») ; sinon elle devient une carte « Nouvelles du passé » à effet réduit. Exemples de chaînes : « Le jeune du centre » (le recruteur a vu un gamin → il fait ses débuts 20 à 30 cartes plus tard → un grand club offre 30 millions une saison plus tard → vendre : CAISSE +20, TRIBUNES −10, « Il marque contre toi » ; garder : « Son agent réclame un salaire de star ») ; « Le stade promis » (le président promet un stade à Madame Aubert contre une subvention → les municipales un an plus tard : chantier non lancé = subvention perdue, DIRECTION −20) ; « Le frère du capitaine » (Bréhaut : « Mon frère est agent, il a un plan pour ton contrat d'image » → quatre cartes plus tard, « Le fisc veut te parler des Îles Caïmans »).

**Le tutoriel est un personnage.** La première carrière est imposée : joueur de 19 ans qui signe au FC Trébignac (Régional 2), Pression verrouillée. Madame Josiane, secrétaire du club depuis 1987, commente les jauges sans jamais dire le mot tutoriel (« Le coach n'aime pas qu'on soit en retard, tu vois la petite icône du fauteuil ? Elle vient de descendre. »), et Gigi Vecchio, gardien de 38 ans, explique le vestiaire et le corps (« À ton âge, je faisais pareil. À mon âge, je paye. »). Les douze premières cartes sont fixes et enseignent dans l'ordre : le swipe, les points d'aperçu, une jauge qui monte, une qui descend, la Carte Match, le sablier, le Dossier, le Bilan. La première mort est presque garantie et scénarisée à la fin de la saison 2 pour montrer le Cimetière, la Succession et le retry. Des cartes-conseil uniques apparaissent à la première jauge sous 20, au premier objet, au premier Carrefour. Madame Josiane réapparaît dans les autres rôles : secrétaire de la Fédération, puis de la FédéMonde, elle a suivi ta carrière. Le tutoriel est sautable dès la deuxième installation.

**Gestes spéciaux** : aucun au MVP. En V2, un bouton « sifflet » (une fois par saison) sur les cartes taguées « reportable » repousse la carte de 3 à 8 tirages avec effets ×1,5 et TRIBUNES −2 (« le coach temporise »). Jamais de geste vertical : il entre en conflit avec les gestes système et dilue le plaisir binaire.

## 2.9 Le catalogue des fins

Chaque fin a un identifiant, une cause, un rôle, une épitaphe de deux phrases, et une place au Cimetière (une plaque de casier de vestiaire, grise tant qu'elle n'est pas découverte, avec le compteur « Fins découvertes 17 / 88 »). Quand plusieurs jauges cassent sur la même carte, la première dans l'ordre du HUD gagne. Si la jauge casse à la carte Verdict, l'épitaphe de l'objectif manqué remplace celle de la jauge.

### Fins de jauge, rôles complets (deux par jauge)

| Rôle | Jauge | Vide (0) | Épitaphe | Pleine (100) | Épitaphe |
|---|---|---|---|---|---|
| Joueur | VESTIAIRE | Le mouton noir | « On ne t'a plus jamais fait de passe. Même à l'entraînement. Même au toro. » | Le porte-parole | « Trop aimé pour être gardé. Vendu à la trêve avec une lettre du vestiaire et une aile de poulet. » |
| Joueur | TRIBUNES | Sifflé | « Sifflé à l'échauffement, à la mi-temps et à la sortie du parking. Le parking, ça n'était jamais arrivé. » | L'homme-sandwich | « Tu as signé plus de contrats publicitaires que de passes décisives. Ton agent a pleuré de joie. Le coach a pleuré tout court. » |
| Joueur | DIRECTION | La place 14B | « Tu as fini par connaître par cœur les tribunes du stade. Depuis la place 14B. » | Le fils spirituel | « Le coach t'aimait tant qu'il t'a emmené dans son nouveau club. En deuxième division kazakhe. » |
| Joueur | CAISSE | Sans club | « Ton agent a filé, le syndicat des joueurs t'a proposé son stage de chômeurs. Tu as fini en Régional 1, payé en merguez. » | La carte Panama | « Le contrat d'image aux Caïmans était une idée de ton cousin. Le fisc a eu une idée aussi. » |
| Entraîneur | VESTIAIRE | Le bus | « Le vestiaire a refusé de descendre du bus. Tu es descendu seul, ta valise à la main. Il pleuvait, évidemment. » | Le copain | « Tu étais leur meilleur ami. Les meilleurs amis ne se font pas obéir. Le président l'a compris avant toi. » |
| Entraîneur | TRIBUNES | La banderole | « La banderole faisait vingt mètres. Ton nom en prenait douze. Le mot DEHORS, le reste. » | L'otage du kop | « Les ultras t'aimaient tant qu'ils composaient ton équipe. Le président a préféré les laisser composer ton successeur. » |
| Entraîneur | DIRECTION | Le SMS de 23 h 47 | « Viré par SMS entre la conférence de presse et le parking. Le message contenait une faute d'orthographe. Tu l'as corrigée. » | Promotion-placard | « Nommé Directeur du Développement International. Ton bureau n'a pas de fenêtre. Ni de téléphone. Ni de développement. » |
| Entraîneur | CAISSE | Vendu à la découpe | « Plus de budget. L'équipe a été vendue joueur par joueur, et toi avec les meubles. » | Le coupable désigné | « Tu as réclamé et obtenu des moyens fous. La Commission a bloqué le club, et le président a trouvé le nom du responsable sur ta porte. » |
| Président pro | VESTIAIRE | La grève des salariés | « Le jour du derby, même le jardinier était en grève. La pelouse a tenu. Pas toi. » | Le président fantôme | « L'entraîneur signait les recrues, les contrats et les cartes de vœux. Le Conseil a signé ton départ. Il ne manquait que ça. » |
| Président pro | TRIBUNES | Le siège du siège | « Les supporters ont occupé le siège du club. Tu as appris ce jour-là que le tien était éjectable. » | La mairie | « Porté par les tribunes, tu t'es présenté à la mairie. Tu as perdu. Le club aussi, entre-temps. » |
| Président pro | DIRECTION | L'AG | « À l'assemblée générale, on a voté ton départ à main levée. La tienne était la seule à ne pas se lever. Elle a été comptée quand même. » | Le pantin | « Tu étais si proche de la Ligue qu'on t'y a offert un bureau. Le club a été vendu pendant que tu signais la carte de membre. » |
| Président pro | CAISSE | La Commission des comptes | « La Commission a compté. Tu avais compté aussi, mais pas dans le même sens. » | Le fonds | « Un fonds a trouvé ta trésorerie magnifique. Il l'a achetée. Avec le club autour. Sans toi. » |
| Sélectionneur | VESTIAIRE | Les deux clans | « Deux clans, un vestiaire, une seule porte. Tu étais du mauvais côté de la porte. » | La fête | « Tu les as laissés fêter. Ils ont fêté. Le pays entier a vu les photos. Les photos étaient nettes. » |
| Sélectionneur | TRIBUNES | L'ennemi public | « Un pays entier a appris ton nom pour le crier. Tu as déménagé. Ils ont suivi. » | L'ambassadeur | « Trop populaire pour un chef d'État nerveux. Nommé ambassadeur aux îles Australes. Il n'y a pas de terrain de football aux îles Australes. Tu as vérifié. » |
| Sélectionneur | DIRECTION | Minuit et une | « Ton contrat expirait à minuit. Legruet a attendu minuit et une pour t'appeler. Il a raccroché à minuit deux. » | L'homme du président | « Tu étais l'homme du président. Le président est tombé. Ses hommes aussi. Tu étais le premier de la liste. » |
| Sélectionneur | CAISSE | Les charters | « La Fédération n'avait plus de quoi payer les charters. Elle a sacrifié le plus gros salaire. Tu voyageais en première. » | Les primes cachées | « Le sponsor te versait des primes que la Fédération ignorait. Elle l'a appris par la presse, un dimanche. Rupture pour faute grave le lundi. » |
| Dirigeant d'instance | VESTIAIRE | La motion | « Le comité exécutif a voté une motion de défiance. À l'unanimité. Ton siège était vide : tu étais aux toilettes. » | Le dauphin | « Ton dauphin t'a remercié pour tout. Puis il a fait voter ta suspension. Pour tout, également. » |
| Dirigeant d'instance | TRIBUNES | Les dix-huit millions de pages | « Les documents fuités faisaient dix-huit millions de pages. Aucune n'était à ton avantage. Même la page de garde. » | Le showman | « Tu avais une émission de télé, une chanson et une ligne de vêtements. Le comité d'éthique n'avait qu'un dossier. Il a suffi. » |
| Dirigeant d'instance | DIRECTION | Le vote de défiance | « Le Congrès a voté. Deux cent onze voix contre, une abstention. La tienne. » | Le pantin des confédérations | « Tu étais la marionnette des grandes confédérations. Elles t'ont lâché le jour où elles n'avaient plus besoin de toi. C'était un mardi. » |
| Dirigeant d'instance | CAISSE | Le taxi | « Les sponsors sont partis. L'hôtel du Congrès a demandé un acompte. Tu n'avais pas de quoi payer le taxi. Le chauffeur a voté contre toi. » | Le raid à l'aube | « À six heures du matin, des messieurs en imperméable ont frappé à la porte de l'hôtel. Ils ne venaient pas pour le petit déjeuner. » |

### Fins de jauge, rôles courts

| Rôle | Jauge | Vide | Pleine |
|---|---|---|---|
| Joueur amateur | VESTIAIRE | Le toro (plus personne ne te fait la passe, tu changes de club de canton) | Le caïd (le coach te vire pour reprendre le vestiaire) |
| Joueur amateur | TRIBUNES (Le bistrot) | Le comptoir (on ne te sert plus) | Le héros du canton (tu ne viens plus t'entraîner, tu signes des autographes) |
| Joueur amateur | DIRECTION (Le coach) | La touche (tu regardes tous les matchs depuis le banc, tu arrêtes) | Le chouchou (le coach part, le suivant te met dehors) |
| Joueur amateur | CAISSE | Le patron a dit non (ton employeur refuse les samedis) | L'enveloppe (le club voisin paye au noir, la Ligue régionale radie) |
| Président amateur | VESTIAIRE (Le club) | Plus personne pour tracer les lignes (forfait général, AG) | La buvette prend le pouvoir (tes cousins ont décidé que le club, c'est eux) |
| Président amateur | TRIBUNES (Le village) | Le club d'à côté (les gamins signent à l'US voisine) | Le maire jaloux (Madame Aubert donne le terrain au rugby) |
| Président amateur | DIRECTION (La mairie) | La subvention (coupée, stade fermé, club dissous) | L'homme de la mairie (le maire perd les élections, son successeur nettoie) |
| Président amateur | CAISSE | La buvette (Gérard est parti en Thaïlande, la caisse aussi) | Le magot (trop de liquide, la gendarmerie s'intéresse à la caisse) |
| Directeur sportif | VESTIAIRE (Le staff) | La fronde (coach et capitaine te lâchent en conférence de presse) | Le club des copains (les commissions occultes remontent) |
| Directeur sportif | TRIBUNES | Le mercato raté (on te met tout sur le dos, viré avec le coach) | L'architecte (on te crédite de tout, un géant te recrute et te broie) |
| Directeur sportif | DIRECTION | D'un commun accord (le communiqué de trois lignes) | L'homme du président (le club est racheté, le nouveau propriétaire a son homme) |
| Directeur sportif | CAISSE (Masse salariale) | Les contrats impayables (le président te livre à la Commission) | Le roi du mercato (trop de commissions, l'enquête commence par ton bureau) |

### Fins de choix et de chaîne (jamais aléatoires)

- **Le Grand Déballage** (tout rôle, Parole ≤ −5) : « Le dossier faisait douze pages. Chaque page, une promesse. Chaque promesse, une date. Tu te souvenais de toutes. »
- **Le Chèque** (accepter d'être viré avec indemnités quand le président le propose ; score ×0,7) : « Tu as pris le chèque. Il était gros. La porte aussi. »
- **Le coup de tête** (joueur Sanguin, finale, insulte sur la famille) : « Une insulte sur ta sœur, un coup de tête dans un sternum, une carrière qui s'achève sur un carton rouge. Les statues ont été commandées quand même. »
- **Le kung-fu** (joueur, supporter insultant après une expulsion) : « Tu as tenté un coup de pied retourné sur un supporter. Neuf mois de suspension. Une carrière de comédien. »
- **La morsure** (joueur, trois fois la même méthode) : « Tu as mordu un défenseur. Pour la troisième fois. La commission a jugé que la méthode manquait de variété. »
- **Le flacon B** (joueur, les vitamines de Doc Sabatier acceptées trois fois) : « Tu étais au sommet de ta forme. Le flacon B aussi. »
- **Les croisés** (joueur, jouer blessé au Grand Match avec le drapeau « genou ») : « Tes ligaments ont rendu leur tablier avant toi. Le kiné a dit qu'il avait vu pire. Il mentait. »
- **La chaussure** (entraîneur Sanguin, défaite en Coupe) : « Tu as shooté dans une chaussure. Elle a atterri sur l'arcade de ta star. Sa compagne a appelé un tabloïd. Le tabloïd a appelé ton président. »
- **L'espion dans la haie** (entraîneur Tacticien) : « Ton stagiaire a été surpris dans les buissons de l'adversaire avec des jumelles. Tu as tout avoué en conférence de presse. En trois heures. Avec des diapositives. »
- **Le verre de vin** (sélectionneur, faux homme d'affaires) : « Un journaliste déguisé en homme d'affaires, un verre de vin, une phrase de trop. Soixante-sept jours à la tête des Cobalts. »
- **La demande en mariage** (sélectionneur éliminé) : « Éliminé, tu as profité de l'interview pour demander Camille en mariage. Camille a dit oui. La Fédération, non. »
- **Le pari** (joueur ou entraîneur, la carte du bookmaker) : « Tu avais parié sur ta propre équipe. Pour perdre. Elle a gagné. Tu as tout perdu. »
- **Le Ministre** (sélectionneur ou président, accepter le poste) : « Champion, tu as été nommé ministre des Sports. Tu as découvert ce qu'était un député. Tu as regretté les défenseurs centraux. »
- **L'Exil doré** (joueur, accepter le chèque d'Al-Dorado en cours de saison) : « Deux cents millions, un stade climatisé, un championnat sans enjeu. Tu n'as plus jamais touché un ballon qui compte. »

### Fins judiciaires et financières

- **La valise** (président Homme de réseau, avant un match décisif) : « Une valise a été retrouvée dans le jardin d'un joueur adverse. Elle contenait de l'argent et ton nom. Le club a été rétrogradé. La valise a été relaxée. »
- **Les écoutes** (président ou instance, le Téléphone rouge) : « Tes conversations avec les désignateurs d'arbitres ont été enregistrées. Elles étaient passionnantes. Le tribunal a été passionné. »
- **La Ligue fermée** (grand club ou instance) : « Tu as annoncé une ligue fermée un dimanche soir. Elle a été enterrée le mardi. Toi, le mercredi. »
- **Dix-huit mois** (tout rôle, CAISSE > 85 et carte Fisc) : « Fraude fiscale, dix-huit mois, une cellule avec vue sur le parking. Ton codétenu te demandait des pronostics. Tu les donnais faux. »
- **Le sponsor** (président, sponsor douteux) : « Ton sponsor maillot s'est révélé être une société-écran. Le maillot était très joli. On l'a vu dans le journal, rubrique justice. »
- **La radiation** (instance, chaîne des valises) : « Suspendu huit ans de toute activité liée au football. Tu as pris un abonnement au golf. Tu n'aimes pas le golf. »
- **La pelouse** (président, subvention détournée) : « La mairie a repris le stade. Tu as joué tes matchs à domicile dans un parc. Le parc n'avait pas de tribune. Ni de toi. »

### Fins d'imposture et de destin

- **Le faux cousin** (joueur recruté sur un coup de fil d'un prétendu Ballon d'Argent) : « Tu as joué cinquante-trois minutes. On a compris à la deuxième. »
- **Le fax** (joueur, transfert du dernier jour) : « Ton transfert de rêve est mort dans un fax, à 23 h 59 min 58 s. Tu as passé la saison en tribune. Le fax a été promu. »
- **L'agent** (joueur avec le Carnet noir) : « Fardelli t'a vendu dans le Golfe pendant que tu dormais. Le contrat était signé de ta main. Tu ne t'en souviens pas. Lui non plus. »
- **Le consultant** (entraîneur viré trois fois de suite, Réputation < 20) : « Plus personne ne t'a rappelé. Tu commentes maintenant les matchs des autres en disant "à mon époque" toutes les vingt secondes. »
- **La statue** (joueur Enfant du club, club relégué deux fois) : « Tu as tout refusé pour ton club. Il est descendu en Régional 3 avec toi. On a fait ta statue. En résine. »
- **Le mauvais aéroport** (instance) : « Le Congrès qui devait te réélire s'est tenu sur une autre île. Tu étais à l'aéroport de la mauvaise. On a voté sans toi, par respect pour l'horaire. »
- **Battu au Congrès** (instance, réélection perdue) : « Cent douze voix contre quatre-vingt-dix-neuf. Tu avais promis un Mondial à tout le monde. Tout le monde a préféré la promesse de l'autre. »

### Fins d'objectif (épitaphes de remplacement à la carte Verdict)

- **La relégation** : « Descendu en division inférieure. Le stade a paru très grand tout d'un coup, et tes actionnaires très petits. »
- **La photo de famille** (Top 5 manqué d'un point) : « Sixième à un point. On a refait la photo de famille du club sans toi. Le photographe s'est excusé, lui. »
- **La non-qualification** (sélectionneur) : « Le pays regardera le Mondial à la télévision. Toi aussi, mais dans une autre langue, depuis un pays où l'on ne te reconnaît pas encore. »
- **La réforme enterrée** (instance) : « Ta grande réforme a été rejetée par 180 voix. Elle sera votée dans dix ans, sous un autre nom, par quelqu'un d'autre. »
- **Le pouce** (joueur, objectif de l'agent) : « Vingt titularisations demandées. Douze obtenues. Fardelli a répondu à ton message trois semaines plus tard, avec un pouce. »

### Fins de fin de vie et fins heureuses (dorées au Cimetière)

- **Le Jubilé** (joueur à 38 ans sans Destin accepté) : « Stade plein, tour d'honneur, ton fils au bras. Tu as demandé où était le vestiaire. Par habitude. »
- **Ta loge** (tout rôle à 78 ans) : « Tu t'es endormi dans ta loge à la 70e minute, souriant. Le derby a été gagné. On ne t'a pas réveillé pour te le dire. »
- **Mort au poste** (après 70 ans, la carte du médecin) : « Tu es mort dans ton fauteuil, au stade, pendant la 89e minute. Le stade a observé une minute de silence. L'arbitre a ajouté une minute d'arrêt de jeu. »
- **La statue de bronze** (fin volontaire à partir de la dixième saison, Réputation > 85, aucune jauge sous 40 : la seule sortie par la grande porte) : « Tu as tout gagné, tout dit, et tu es parti avant qu'on te le demande. Un cas unique dans l'histoire de ce jeu. »
- **Le burn-out** (trois cartes Pression d'affilée avec une série noire) : « Tu as fait un malaise à la troisième conférence de presse de la journée. Le médecin a prescrit du repos. Le président a prescrit un remplaçant. »
- **Le dernier derby** (président amateur, 80 ans, refuse de passer la main) : « Tu as présidé le club soixante ans. Le dernier derby a été gagné. Tu ne l'as pas su : tu t'étais endormi à la 70e. »

Total : 40 fins de jauge pour les rôles complets, 12 pour les rôles courts, 14 fins de choix, 7 judiciaires, 7 d'imposture, 5 d'objectif, 6 de fin de vie, soit 91 plaques au Cimetière en V1.

## 2.10 Les succès (le Panthéon)

Chaque Destin est une carte à collectionner avec une condition vérifiable par un compteur simple, vérifiée à la mort et au Bilan.

**Carrière et longévité** : Le Coup du chapeau (trois saisons complètes dans le même rôle) ; Le Grand Chelem (occuper les neuf rôles, toutes carrières confondues) ; Le Passeur (quatre rôles dans une seule carrière) ; De la cave au grenier (commencer président amateur, finir président de Division 1 dans la même carrière) ; Loyauté (dix saisons au même club) ; L'enfant du club (jouer puis entraîner le même club) ; La Trilogie (international, sélectionneur champion et dirigeant d'instance dans le même monde) ; Mathusalem (Mort au poste) ; La grande porte (La statue de bronze) ; Le Globe-trotter (huit clubs en une carrière) ; Madame Josiane te salue (la retrouver dans trois rôles).

**Sportifs** : Les Invincibles (une saison sans défaite) ; Le Triplé (championnat, Coupe et Coupe Continentale la même saison) ; Remontada (gagner un Grand Match lancé à 0-2) ; La Panenka (choisir le piqué au temps fort des tirs au but en finale) ; Le Petit Poucet (gagner la Coupe avec un club amateur) ; Le Miracle (le titre avec un club du tiers inférieur) ; Le Soulier (meilleur buteur trois saisons de suite) ; Zéro pointé (le Mondial sans encaisser en phase finale) ; Le Derby éternel (cinq derbies d'affilée) ; Le Banc en or (trois Grands Matchs gagnés grâce au remplaçant lancé au temps fort).

**Collection et mort** : Collectionneur (20 fins) ; Le Cimetière plein (toutes) ; L'Homme des 44 jours (viré en moins de douze cartes après une prise de fonction) ; La Mort douce (mourir avec les quatre jauges entre 45 et 55) ; Le Cercle vertueux (une saison sans qu'aucune jauge sorte de 25-75) ; La Roulette (les huit fins de jauge d'un même rôle) ; Le Récidiviste (trois fois la même fin) ; Héritier (commencer avec un objet hérité et mourir à cause de lui).

**Secrets** (silhouette « ? » tant qu'ils ne sont pas obtenus) : La Main de Dieu (marquer de la main au temps fort et ne pas l'avouer) ; Le Fair-play (l'avouer et perdre : débloque le trait Intègre) ; Le Traître (partir chez le rival et gagner le derby retour contre ton ancien club) ; La Dynastie (faire débuter une tête d'affiche qui porte ton nom) ; Les mouettes (répondre à la presse par une métaphore sur les oiseaux) ; Le Sèche-cheveux (trois savons à la mi-temps, trois victoires) ; La bouteille (écarter le soda du sponsor en conférence de presse) ; Le Spécial (se présenter comme spécial à la première conférence et survivre trois saisons) ; Homme de parole (dix promesses tenues d'affilée) ; Sept clubs, sept sacs (viré sept fois dans la même carrière, un poste à chaque fois).

**Sociaux** : Voix du peuple (partager dix épitaphes) ; La Une (partager trois unes de fin de saison) ; Le Défi du vestiaire (battre le score d'un ami sur le même Code de Carrière) ; Le Pronostiqueur (prévoir sa propre fin à la carte « Ton pari » du Bilan et l'obtenir la saison suivante).

Soixante Destins au lancement, dont douze secrets.
