# L'audit des textes (octobre 2026)

> « Je ne veux pas que les gens se rendent compte que tout est écrit avec l'IA. Optimise chaque
> texte pour que tout paraisse le plus vrai possible, que les dialogues aussi, qu'on se croie dans
> l'histoire. » (le porteur)

Le périmètre retenu avec le porteur : **ce que le joueur voit le plus**. Les voix de la ville, les
dix introductions et les scènes jouées, la première heure de chaque livre, les fins, les
conversations surprises ; et, dans tout le reste du jeu, les gestes de remplissage. La matière (qui
fait quoi, les objets, les dates, les noms, l'ordre des révélations) n'a pas bougé : on a récrit la
voix, pas l'histoire.

## 1. Le diagnostic

Mesuré sur tout le corpus (730 000 mots) avant de toucher une ligne.

- **La parole sonnait écrite.** Entre guillemets, le « ne » de la négation était presque toujours
  là : 1 300 « ne … pas » contre 32 sans « ne » dans les répliques des cartes, 957 contre 33 chez
  les passants. Le supporter, la boulangère et le président avaient la même voix.
- **Les mêmes gestes revenaient** : « sans un mot » (270 fois), « pour la première fois » (125),
  « il hoche la tête » (97), « il ne dit rien » (78), « à voix haute » (67), « sans lever les
  yeux » (65), « Il attend. » en chute de carte, « Tout le monde a compris. », « comme si ».
- **Le récit était télégraphique et uniforme** : huit mots par phrase, toujours, et un deux-points
  de révélation par carte (« Gégé déroule la bâche : … »).
- **Des figures revenaient d'une réplique à l'autre** : la maxime déduite (« Quand il garde le
  stylo, il signe quelque chose. »), les symétries (« On ne vous aime pas plus. On ne vous aime pas
  moins. »), la chute qui commente.

## 2. Ce qui a été récrit

| | textes |
|---|---:|
| Les gens de la ville : répliques, tuyaux, services, climats (`gens_*`, `quartier_*`, `paroles_*`) | 2 775 |
| Les scènes jouées et les dix introductions (`cinematiques_h*`, `intro_h*`) | 761 |
| La première heure des dix livres : les quarante premières cartes de trois carrières par livre, leurs réponses et leurs variantes | 646 |
| Les conversations surprises (`vie_conversations.yaml`) | 281 |
| Les fins : épitaphes et indices du Cimetière | 134 |
| Les gestes de remplissage, dans tout le reste (cartes, Unes, set-pieces, scènes de la semaine, activités, missions) | 1 064 |
| Les incohérences d'histoire corrigées (§ 5) | ≈ 30 |

Environ 5 700 textes. La méthode : un inventaire par lot (le texte, sa source, qui parle, à quel
moment), une réécriture par scène entière (une carte et ses deux réponses, une conversation, une
scène jouée se récrivent ensemble), puis un vérificateur (les variables entre accolades
identiques, le tu et le vous conservés, les longueurs du build, aucun guillemet droit, aucun geste
de la liste) avant d'appliquer ; build, lint et tests à chaque lot.

La **bible des voix** (`voix.md`) est née de l'audit : qui garde le « ne » et qui le perd, l'oral de
chaque époque, le tu et le vous, une ligne par personne (185 fiches et quatre voix sans fiche).

## 3. Mesuré, avant et après

| | avant | après |
|---|---:|---:|
| « sans un mot » | 270 | 0 |
| « pour la première fois » | 125 | 0 |
| « hoche la tête » | 97 | 0 |
| « il ne dit rien », « ne répond rien » | 78 | 0 |
| « à voix haute » | 67 | 0 |
| « sans lever les yeux » | 65 | 0 |
| Répliques des gens : « ne … pas » / sans « ne » | 824 / 11 | 198 / 156 |
| Répliques des passants | 957 / 33 | 240 / 180 |
| Conversations surprises | 363 / 7 | 85 / 82 |
| Cartes (toutes, la première heure seule récrite) | 1 300 / 32 | 1 184 / 65 |
| Marques de l'oral pour 1 000 mots (passants, gens, conversations) | 1,9 · 3,3 · 3,5 | 3,7 · 5,0 · 5,1 |
| Deux-points pour 1 000 mots (gens, passants, scènes jouées, fins) | 6,3 · 5,4 · 6,1 · 5,7 | 3,7 · 2,7 · 2,8 · 2,9 |

Le « ne » n'a pas disparu : la secrétaire, le notaire, l'avocat, le président en public le gardent,
et un même personnage le garde en réunion et le perd au comptoir. Les écrits restent écrits (un fax,
une lettre, un article, la montre gravée « Montée — merci » du livre 4).

**Le lint y veille désormais** : un geste de la liste, n'importe où dans le bundle (cartes, ville,
fins, Unes, set-pieces), est une erreur (`kGestesDeRemplissage`, `packages/tools/bin/lint.dart`).
Un geste propre au personnage, ou rien.

Quatre avant / après :

- Une passante. *Avant* : « Mon mari rentre du stade sans un mot depuis trois semaines. Il ne
  m'explique même plus le hors-jeu. C'est là que je m'inquiète. » *Après* : « Mon mari rentre du
  stade, il pose ses clés et il file au garage. Trois semaines comme ça. Il m'explique même plus le
  hors-jeu. »
- Un parent du club. *Avant* : « Je ne veux pas qu'il finisse capo. Je ne veux pas non plus qu'il
  finisse vendu. » *Après* : « Neuf ans. Je veux pas qu'il finisse capo, ni vendu, alors il reste
  quoi ? »
- Une carte du livre 1. *Avant* : « Il te trouve devant la machine à six heures vingt. Il ne dit
  rien. » *Après* : « Le président te trouve devant la machine à café à six heures vingt et te
  salue du menton. »
- Une fin. *Avant* : « La Nord a chanté {prenom} {nom} sans se tromper d'accent, pour la première
  fois. » *Après* : « Gégé a dirigé les chants, debout sur la rambarde. Ce soir-là, la Nord a chanté
  {prenom} {nom} avec le bon accent. »

## 4. Ce qui n'a pas été repris

- **Les cartes au-delà de la première heure** : seuls les gestes de remplissage en sont partis. Leurs
  répliques gardent leur « ne » et leur récit court (1 184 « ne … pas » contre 65 dans les cartes).
  C'est le prochain chantier, livre par livre, avec la bible des voix.
- **Les scènes de la semaine, les activités, les missions, les Unes, les Nouvelles et les
  set-pieces** : le balayage des gestes seulement.
- Quelques variantes à l'ancienne, hors de la première heure (« Il y en a toujours plus »,
  `cards/selectionneur/h9_intrigues_2029.yaml`).

## 5. Les incohérences corrigées

Ange plie les billets en long, comme le dit Pujade (livre 2) ; la Coupe de 1966 partout (une
conversation disait 1968) ; le patron du tabac du stade qui écoute la Rive est Firmin, la
conversation s'arrête en 2012 ; Paulette, « cinquante ans à la même place » ; Lulu, gardien de 1990
à 2006, ses répliques bornées ; le cognac du père de Valère Escande, jusqu'en 2032 ; Sandrine,
vingt-deux ans en 1991 ; le père de Fabrice, « à son âge » ; Mireille en ville dès 2022, comme son
étiquette ; Ober, à qui Nadia Rouvier prend ses patients « depuis des années » (il arrive en 2009,
la réplique disait 2003) ; « Mbacko » → Mbako ; l'indice de « On l'a laissé » ne cite plus le
titre d'une autre fin (« Minuit et une ») ; l'héroïne accordée au féminin (« Lulu vous a fait
lever », « mamie » ou « papy » chez Mbako, « ma grande » chez Odile, « on vous a vue ») ; le patron
du café de la Mairie s'appelle Désiré (Lacanal le tient de 1990 à 2013), plus Marcel ; Lhoste
n'avoue plus la Nord ; Vialat note « au crayon » ; « cinq chiffres » pour 14-5-84 ; « la télé
débranchée » plutôt que « les téléphones au panier » en 1990 ; le tailleur dit « votre père » avant
2035 ; Mbako ne dit plus « demandez au coach » à un joueur ; et une dizaine de détails dans les
quartiers (Maïwenn, Hagop, Marthe, Aristide, Nawel, Scarpelli, Kowal, Mercadier).

## 6. Les incohérences qui restent (à l'auteur de trancher)

Elles touchent l'intrigue ou la bible : l'audit les signale sans les corriger.

### La chronologie des visages

- **Josiane**, la secrétaire du club, arrivée en 1987 : elle part « trente-cinq ans après », vers
  2022 (`ville/paroles_gens.yaml:998`, `:1006`, `cards/common/nouvelles_datees.yaml:782`) ; la ville
  la garde jusqu'en 2031 ; une carte de 2020 parle de « la petite Josiane »
  (`cards/common/epoque_2020.yaml:294`) ; ses cent ans se fêtent au livre 10
  (`ville/scenes_h10.yaml:669`, `cards/president/h10_intrigues.yaml:416`, `:508`,
  `cards/president/h10_nouvelles.yaml:99`). Mireille est sa nièce ici, sa sœur là (livre 5). Une
  date de départ et un lien de famille, et s'y tenir.
- **Le Doc** : « Le cabinet du Doc, fermé depuis 2029 » (`ville/paroles_h10.yaml:869`), alors que la
  bible y garde Ober jusqu'en 2050.
- **Paulette** tient le « guichet 14B » au livre 2 (`ville/paroles_h2.yaml:36`,
  `ville/scenes_h2.yaml:30-37`) ; ailleurs, 14B est sa place en tribune depuis 1951. « J'étais là
  en cinquante et un » revient dans trois répliques.
- **Livre 1** : Odette dit « quinze ans » depuis la finale de 1974
  (`cards/entraineur/h1_intrigues.yaml:373`), Massenet « seize ans » (`h1_intrigues.yaml:593`). Massenet est « du
  Quotidien » dans quatre textes (`h1_intrigues.yaml:585`, `en_presse.yaml:182`, `unes.yaml:175`,
  `cards/joueur/pepite_script.yaml:404`), la bible le met à L'Écho de 1990 à 1999.
- **Livre 4** : la tombe de Jules Bertin porte 1902-1983 (`ville/paroles_h4.yaml:43`,
  `cards/joueur/h4_script.yaml:154`), l'accident est de 1984 (peut-être voulu).
- **Le Flux**, le réseau du pays, existe dès 2008-2011 (`ville/gens_quartier.yaml:828`,
  `cards/selectionneur/h7_intrigues.yaml:69`, `:73`, `cards/common/nouvelles_datees.yaml:506`) ; la
  bible le date des années 2020.

### Ce que les gens disent d'eux-mêmes

- **Bertrand Rancé** avoue qu'il jouait aux cartes (« Je joue plus », `ville/cinematiques_h6.yaml:599`,
  et deux répliques de passants) ; la bible dit qu'il ne l'avoue jamais.
- **Lulu**, le gardien du livre 2, parle de « ma ronde de minuit » (`ville/cinematiques_h2.yaml:142`),
  la bible fait ses rondes à onze heures, deux heures et cinq heures ; et il raconte ce qu'il a vu,
  ce qu'il ne fait jamais.
- **Tazi** : « Je mure, je ne décide pas. » La bible des voix range la formule dans ce que personne
  ne dit (§ 1.5), mais l'indice de la fin `escalier_une_marche` la cite (`postulats.yaml:1491`).
- **Pélissou**, le docteur du mardi, dîne seul (`ville/gens_club.yaml:1149`) ou avec un homme du
  fonds (livre 8, `cards/common/paliers_ville_club.yaml:396`).
- **Sandrine** (livre 7) n'a jamais vu la plante devant la 12 et a vu la chambre 12 : deux répliques
  que deux drapeaux compatibles font entendre dans la même partie.
- **Tessandier** choisit le mot de l'affichette en 2029-2031 (`ville/paroles_h9.yaml:37-40`,
  `ville/scenes_h9.yaml:160-166`) ; la bible met Clémence à l'agence dès 2026.
- **La minute de silence** : on la demande pour Tibo en 2011 ; Gégé dit en 2024 « On ne fait pas de
  silence, nous ».
- **Deux Marcel, deux Yannick** : « Marcel, rangée H », mort en tribune
  (`ville/paroles_personnages.yaml:226`, `ville/paroles_gens.yaml:1173`,
  `cards/entraineur/sombres.yaml:787`), et Marcel Lambrot, qui tient le Corner jusqu'en 2016 ;
  Yannick l'élève et Yannick Bouvreuil. Renommer l'un des deux.
- **Ferlac** : « Trois victoires » (`ville/paroles_h6.yaml:338`) pour une série qui en compte au
  moins quatre.
- **Vecchio** compte « quatre coachs » et s'arrête au pouce
  (`cards/entraineur/arc_vieux_gardien.yaml:18`) : le héros serait le cinquième, la carte dit le
  quatrième.
- **La laverie** (livre 6, `ville/cinematiques_h6.yaml:746`, 2004-2006) : un gérant parle de « ma
  femme », alors que Gisèle Delmotte tient la laverie jusqu'en 2012.
- **Le sapin en carton** : au livre 2, les pompiers remontent le sapin et la voiture reste au fond
  (`ville/cinematiques_h2.yaml:287`, `:319`) ; au livre 5, des plongeurs trouvent la voiture « dix
  ans au fond » avec « un sapin en carton » (`ville/cinematiques_h5.yaml:492`).
- **Rigal** : « Ce bois, c'est moi qui l'ai planté » (`ville/quartier_campagne.yaml:180`), alors que
  le Bois-Joli est le bois du manoir, cédé en 1970, et que Rigal arrive en 1975.
- **Le cahier bleu de Ginette**, volé jusqu'en 2001, est de retour sur le comptoir en 2002-2003
  (`ville/gens_quartier.yaml:1391-1427`) : voulu ?

### Le tu et le vous

Les cartes font foi, la bible des voix est à aligner sur elles ou l'inverse : Sabatier tutoie le
héros des livres 3 et 4 (la bible : vous) ; Bréhaut vouvoie l'intérimaire du livre 2 (la bible :
tu) ; Vaubourg vouvoie aux livres 7 et 8 (la bible : tu) et passe du vous au tu dans une même scène
jouée ; Massenet tutoie dans une scène jouée ; le Doc tutoie au livre 3 ; Brétaud rapporte au vous
les mots de Corven, qui tutoie.

### Les fins

- `jp_bache_pliee` (`endings/joueur.yaml:76`, `:79`) : « La Nord a plié la bâche proprement ; elle
  ne l'a pas brûlée », puis « Le sac est parti au feu le soir même », et la bâche est dans le sac.
- `trente_une_heure` (`endings/h6.yaml:58`) : « Bertrand Rancé avait promis de prévenir {nom} le
  premier », à relire contre le livre 6.
- Quatre titres restent au masculin quand l'héroïne peut être une femme : « Vendu à la découpe »,
  « Parti pour l'or », « Le coupable désigné », « Mort au poste » (`endings.yaml:84`, `:92`, `:207`,
  `endings/setpieces_fins.yaml:92`). Le Cimetière les montre hors d'une carrière : un titre neutre,
  ou deux titres.

### Des répliques qui ne se jouent jamais

- `saison >= 4` ou `saison == 4` dans des livres de trois saisons (la ville compte les saisons à
  partir de 1) : `ville/paroles_h3.yaml:173`, `:363`, `ville/paroles_h4.yaml:274`,
  `ville/scenes_h2.yaml:319`.
- Malo Guérand : une réplique sous `flag(histoire_h9)` (`ville/gens_quartier.yaml`), alors qu'il
  n'est en ville qu'à partir de 2035 et que le livre 9 finit en 2033.

### Moins grave

- Barbier a 71 ans en 1990 dans sa fiche et 71 ans en 2003 au livre 6 ; aucun texte ne lit son âge.
- Thévenot appelle « le petit Rancé » un joueur de dix-sept à vingt-quatre ans ; « le petit Nino », au
  comptoir, a passé cinquante ans (`ville/gens_comptoirs.yaml:137`, après 2034) : de l'affection, ou
  une date oubliée.
