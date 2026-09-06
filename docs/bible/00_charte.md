# FUSIBLE — Bible scénaristique · 00 · La charte du showrunner

> Onze plumes, un monde. Ce document est normatif : ce qu'il fixe ne se rediscute pas dans un chapitre, il se discute ici. Ce qu'il ne fixe pas est ouvert, à condition de rester importable dans la base de données du jeu (gabarits § 4) et de ne contredire ni `docs/brainstorm/*`, ni `docs/spec_variete_narrative.md`, ni ce qui est déjà écrit dans `content/`. Quand la charte et un fichier `content/` divergent, le fichier `content/` gagne et la charte est corrigée ; quand la charte et le brainstorm divergent, la charte gagne (elle a été écrite après, et pour tous).

Comment lire : § 1 le monde (ce que tout le monde doit savoir avant d'écrire une ligne), § 2 le casting, § 3 les rôles et les postulats, § 4 les gabarits (à recopier tels quels), § 5 le plan des chapitres et la liste des quarante traces transversales, § 6 les interdits et la check-list. Les auteurs écrivent uniquement dans `docs/bible/` ; ils ne touchent ni aux YAML ni au Dart, mais chaque scène qu'ils livrent doit pouvoir être copiée dans un YAML par quelqu'un qui n'a pas lu le chapitre.

Le ton, en une ligne : le narrateur tutoie ; les personnages parlent avec leur tic ; sec, drôle, précis, humain ; **deux phrases par réplique, un tic par réplique, un nom une fois** ; la relation se lit sur le visage, jamais en chiffre ; tendre avec le ballon, féroce avec le business ; le drame est rare, sobre, sans blague, jamais en première saison.

---

## 1. Le monde

### 1.1 Le pays et l'époque

Le pays n'a pas de nom. On dit « le pays », « la Fédération », « la capitale », « les Cobalts » (la sélection, maillot bleu cobalt). Il a une mer à l'ouest (Portclair, Bretagne, Kerbrouck), une mer au sud (Marsange, Roquemont), des montagnes à l'est (Valmont, Haute-Combe), un bassin industriel au nord (Valentienne, Terrenoire, Néville), une vallée au centre où l'on se déteste cordialement (Saint-Étoile et Lyonnet : le derby de la vallée), et une capitale qui se croit seule au monde. Le monde commence en août 1990 et finit en juin 2050. Chaque saison consomme un an ; les personnages vieillissent ; les Nouvelles datées disent l'époque par ses mœurs, jamais par un événement calqué sur un fait réel.

| Décennie | L'argent | La télé et la presse | Le jeu et la tactique | Les mœurs |
|---|---|---|---|---|
| **1990-1999** — l'ère des présidents bâtisseurs | francs ; droits télé qui triplent (1990) puis doublent (1997) ; premiers fonds lointains (1999) ; les clubs vivent des ventes et de la buvette | Télé-Stade rachète Capitale FC (1991) et invente le match du dimanche soir (1994) ; trois journaux papier, le fax, le Minitel du club | libéro, marquage individuel, quotas d'étrangers qui tombent (1995), le but en or (1999) ; les entraîneurs à cassette (Loco) ; le pressing arrive du Nord (Klopf) | l'arrêt Bosquet (1995) libère les joueurs en fin de contrat ; premiers contrôles inopinés (1991) ; les stades passent tout-assis ; les Cobalts perdent une finale aux tirs au but (1990), ratent le Mondial (1994), le gagnent à la maison (1998) |
| **2000-2009** — l'argent arrive | écus dès 2002 ; les droits passent à Médiacrash (2003) qui ne paie pas la deuxième échéance (2006) ; Qatalyst passe du maillot au rachat ; premières commissions à deux chiffres | le Flux (réseau social, 2007) ; Ménèche devient consultant vedette ; La Gazette Rose passe au format tabloïd ; le podcast (2009) | le 4-2-3-1 partout, les préparateurs physiques, les données naissantes (« l'algorithme », 2008) | fair-play financier de l'Union Continentale (2009) ; la première section féminine professionnelle (Mirevaux, 2008) ; les présidents tweetent à 3 h du matin |
| **2010-2019** — l'ère des fonds | le prix des joueurs double tous les quatre ans ; multi-propriété (un club frère dans l'autre hémisphère) ; le naming des stades ; les agents plus riches que les présidents | la vidéo (2016) ; les chaînes de club ; Ménèche directeur d'antenne ; le mème | pressing haut, gardien-libéro, « le modèle » qui note tout ; les jeunes vendus à 16 ans | la tentative de Ligue fermée (2019 : 48 heures) ; les 48 équipes au Mondial (votées en 2017) ; Gégé devient aussi un compte anonyme |
| **2020-2029** — le grand écart | Mondial attribué à Al-Dorado, joué en hiver (2022) ; les clubs-franchises ; le premier transfert à un milliard (2028) | la diffusion en flux (Kick, 2024) ; les journaux papier ne vivent que par L'Écho ; Léa dirige Le Quotidien | l'arbitre algorithmique en test (2027) ; la Main de Dieu désactivée | la grève mondiale des joueurs (2026 : soixante-douze matchs par saison) ; le Mondial des amateurs ; la limite d'âge au Congrès (75 ans) |
| **2030-2039** — les franchises | fonds souverains partout ; la Commission des comptes devient une agence de notation ; Trébignac est racheté par un fonds pour rire | tout se regarde, rien ne se lit ; le commentaire est généré par la voix d'un ancien joueur | football à onze contre un modèle ; « le joueur cloné » (pure blague, une Nouvelle) | la loi des franchises (2040) est en débat dix ans ; les socios reprennent trois clubs (Marsange, Portclair, Saint-Étoile) |
| **2040-2050** — la fin des montées | plus de montée ni de descente en D1 (loi de 2040) ; la D2 et le National deviennent le vrai football | L'Écho de {ville} est le dernier journal ; il paraît le dimanche | le Mondial à 64 ; la Coupe est le seul suspense | l'écran-bilan du siècle en 2050 : « Vous avez incarné 37 personnes, gagné 12 titres, été viré 29 fois » |

Ce tableau sert aux Nouvelles datées (chapitre 31) et aux conditions `year >= …`. Une scène qui cite un objet d'époque (fax, Minitel, Flux, Kick, vidéo, écus) doit porter la condition d'année correspondante. Rien de ce tableau n'est un fait réel maquillé : ce sont des tendances, pas des événements identifiables.

### 1.2 La monnaie

**Francs jusqu'en juin 2001, écus à partir de la saison 2002** (la Nouvelle de 2000 annonce « les contrats en écus dans deux ans »). Le placeholder `{monnaie}` rend « francs » avant 2002 et « écus » ensuite ; le prix du journal en Une passe de « 4,50 F » à « 0,80 écu » (la spec § 1.6 disait « 0,80 € » : on écrit écu, jamais euro, jamais dollar). Un écu vaut à peu près six francs et demi, ce qui permet de garder « cent francs à cinq mille contre un » (cartes existantes) et d'écrire « quinze écus » pour une bière hors de prix en 2030. Ordres de grandeur pour ne pas se tromper d'un zéro : un salaire de D1 en 1990 = 30 000 francs par mois ; un transfert record en 1990 = 60 millions de francs, en 2005 = 40 millions d'écus, en 2020 = 200 millions, en 2028 = un milliard ; la buvette de Trébignac = 12 000 francs par saison, « dont neuf mille en bières ». L'unité vulgaire est « le million » (on ne dit jamais « brique »).

### 1.3 La géographie : trente villes, trente clubs

Le moteur tire le club du joueur (`{club}`), sa ville (`{ville}`) et le rival (`{rival}`) parmi `content/names/fr.yaml` : dans une scène, on écrit **toujours** `{club}`, `{ville}`, `{rival}` pour le club du joueur et son rival, et on ne nomme un club de la table que pour parler *d'un autre* club (l'adversaire de Coupe, le club acheteur, le club voisin). Les villes de la liste du moteur sont en gras.

| Ville | Club, surnom | Stade | Couleurs | Rival | Division 1990 · trajectoire | Note |
|---|---|---|---|---|---|---|
| **Saint-Étoile** | AS Saint-Étoile, « les Étoilés » | la Marmite | bleu nuit et or | Lyonnet | D1 · club populaire, kop de la Tribune Nord, le local de Gégé | le club par défaut des scènes d'exemple ; « la Marmite » est aussi le mot générique pour tout stade qui chauffe |
| **Lyonnet** | Olympique Lyonnet, « les Soyeux » | stade des Tisserands | grenat et argent | Saint-Étoile | D1 · riche, formateur, premier à recruter des « analystes » | le derby de la vallée, deux fois par an |
| la Capitale | Capitale FC, « les Cravates » | le Grand Stade (1997) ; avant, le Vélodrome de la Porte | noir et blanc | Marsange (le Classique) | D1 · racheté par Télé-Stade (1991), puis par Qatalyst (2011) | on écrit « Capitale FC », jamais un nom de ville réelle ; le brainstorm dit « Paris Capitale FC » : lire « Capitale FC » |
| Marsange | Olympique Marsange, « les Marsangais » | stade de la Corniche | blanc et bleu ciel | Capitale FC | D1 · titre continental 1993 (« la fête dure trois jours, l'audit trois ans ») | le Sud, le port, la fièvre ; premier club repris par des socios (2032) |
| **Valmont** | US Valmont, « les Montagnards » | stade du Col | bleu ciel et blanc | Haute-Combe | D2 · monte et descend, promet et ne tient pas | « Moi aussi j'avais promis la montée à Valmont » (le Fantôme) |
| **Valdorne** | Stade Valdorne, « les Dorés » | stade de la Dorne | jaune et noir | Beaulieu | D2 en 1990, D1 dès 1993 · le meilleur centre de formation du pays | « le recruteur de Valdorne » (Barbier), « le type en doudoune » |
| **Montbéliac** | ES Montbéliac, « les Sangliers » | stade des Bruyères | vert et noir | tous les villages | District puis Régional · l'ennemi héréditaire du foot de village | le rival par défaut du président amateur ; paie ses joueurs en liquide ; la fusion imposée |
| **Portclair** | FC Portclair, « les Dockers » | stade de la Jetée | bleu marine et blanc | Bretagne | D2 · la buvette a brûlé la veille d'une demi-finale (1992 : personne dedans, deux cents merguez) | socios en 2032 |
| **Bretagne** | Étoile Bretagne, « l'Usine » | stade de la Criée | rouge et noir | Portclair | D2 · vend un jeune par an, parfois deux | le club-usine de la pépite |
| **Valentienne** | Racing de Valentienne, « les Rouges du Nord » | stade de la Fosse | rouge et or | Terrenoire | D1 · club ouvrier, tribune la plus froide du pays | Malbec en est le président |
| **Roquemont** | Olympique Roquemont, « les Rocs » | stade du Rocher | blanc et bleu roi | Marsange | D1 · public sanguin, présidents éphémères | quatre entraîneurs par saison en moyenne |
| **Villefranche** | AS Villefranche, « les Francs » | stade des Remparts | violet et blanc | Aubérive | D2 · propre, ennuyeux, solvable | le club qui ne meurt jamais |
| **Beaulieu** | Stade Beaulieu, « les Jardiniers » | stade du Parc | vert pomme et blanc | Valdorne | D1 · bourgeois, pelouse parfaite, silence poli | « le stade où l'on entend les consignes » |
| **Castérac** | FC Castérac, « les Bastidiens » | stade de la Bastide | rouge et jaune | Loubières | National · terre de rugby, terrain prêté | « le terrain donné au rugby » |
| **Fontaine** | US Fontaine, « les Sources » | stade des Eaux-Vives | turquoise et blanc | Aubérive | Régional · ville d'eaux, club de curistes | tendre, absurde |
| **Aubérive** | Racing Aubérive, « les Aubes » | stade de la Rive | bordeaux et gris | Villefranche | D2 · club de la mairie, subventionné, surveillé | Madame Aubert y a été maire avant de monter |
| **Néville** | Sporting Néville, « les Loups » | stade de la Lande | gris et bleu | Valentienne | D2 · le froid, le vent, un gardien de 41 ans | « le froid de Néville » (deux degrés en octobre) |
| Trébignac | FC Trébignac | stade municipal Gérard-Blanchet | jaune et vert | Boisnoir | Régional 2 · le club du tutoriel, la buvette, Gérard, Dédé | « Stade Gérard-Blanchet » est aussi le nom de graine par défaut du Code de Carrière |
| Boisnoir | ES Boisnoir, « les Bûcherons » | stade de la Scierie | marron et blanc | Trébignac, Montbéliac | District · le club du village endetté | le village par défaut du président amateur |
| Kerbrouck | Racing Nordique de Kerbrouck | stade des Dunes | jaune et noir | Néville | D2 · l'extrême nord, un stade dans le sable | on dit « Racing Nordique » |
| Terrenoire | Stade Terrenoire, « les Forgerons » | stade des Hauts-Fourneaux | noir et orange | Valentienne | D1 · l'usine ferme en 1996, le club survit à l'usine | la tribune vétuste ; le rapport sur le bureau |
| Haute-Combe | Stade de Haute-Combe, « les Combards » | stade des Névés | blanc et rouge | Valmont | National · neige jusqu'en mars, matchs reportés | le sanglier dans la surface |
| Vaucastel | FC Vaucastel, « les Châtelains » | stade du Donjon | bleu roi et or | Beaulieu | D2 · dépôt de bilan en 1992, renaît en District, remonte en 2009 | l'exemple de la mémoire des clubs |
| Mirevaux | AS Mirevaux, « les Mirettes » | stade de la Halle | rose et noir | Villefranche | D2 · première section féminine professionnelle (2008) | postulat « Section féminine » |
| Puymarin | US Puymarin, « les Marins » | stade de la Digue | bleu et blanc | Portclair | National · pêcheurs, ferry, déplacements interminables | le Petit Poucet de la Coupe |
| Sainte-Ambre | AS Sainte-Ambre, « les Ambrés » | stade de la Résine | ambre et brun | Castérac | Régional 1 · un mécène, un chéquier, une condition | « le Chéquier du Mécène » |
| Île-Verte | US Île-Verte | stade de l'Anse | vert et blanc | Puymarin | District · une île, un bateau par jour, le Congrès s'y est tenu une fois par erreur | « Le mauvais aéroport » |
| Corbelin | FC Corbelin, « les Corbeaux » | stade des Ardoises | noir | Terrenoire | D2 · club de ville morte, ultras poètes | Gégé y a un cousin |
| Loubières | FC Loubières | stade du Moulin | jaune et bleu | Castérac | Régional · le club fusionné avec Montbéliac (2004) : « le FC United du village » | mémoire à −3 pour la lignée qui a signé la fusion |
| Rochevaux | US Rochevaux, « les Rocailles » | stade des Carrières | gris et rouge | Haute-Combe | Régional · un club, un bar, un tabac, un sponsor (Dupuis) | la boucherie est sur la place |

**L'étranger** (huit sélections, sept pays, jamais de pays réel) : la **Lusitanie** (Sporting Lusitano, technique, mélancolique), la **Castellane** (Real Montoya, le géant de Don Alvaro Montoya, « douze clubs, une table »), la **Vestrie** (SK Vestberg, le pressing et les casquettes, Klopf), la **Dalmarie** (Étoile de Dalmarie, gardiens légendaires, pays de Vukić), l'**Irlonde** (Dunmore Rovers, la pluie, la main qui n'a pas été sifflée), l'émirat d'**Al-Dorado** (Al-Dorado FC, le championnat du désert, Nassir), le **Kambara** (Kambara Stars, sélection ambitieuse, pays d'origine de la famille Mbako, la sélection « de tes parents » du binational), la **Sylvanie** (Union Sylvane, le pays émergent du « coach du bout du monde », un ministre qui donne la compo). Les Cobalts jouent contre ces huit-là et contre « des pays qu'on ne nomme pas » quand il faut un adversaire de plus.

### 1.4 Les compétitions

| Compétition | Format | Ce que le joueur en voit |
|---|---|---|
| Division 1 | 20 clubs (18 dès 1996, « vingt clubs, puis dix-huit »), aller-retour, six blocs | titre ≥ 82 pts, Coupe Continentale ≥ 70, descente ≤ 38 (`content/divisions.yaml`) ; plus de descente après 2040 |
| Division 2 | 20 clubs | montée ≥ 72, barrage 64-71 (un Grand Match), descente ≤ 36 |
| National (D3), Régional 1-2-3, District | poules régionales | l'amateur joue cinq Cartes Match ; montée ≥ 70 |
| la Coupe | tous les clubs, du District à la D1, tirage intégral (« 20 % de chance d'un écart de deux divisions »), 32es en janvier, finale en mai au Grand Stade | un tour par carte pendant le Retour ; le Petit Poucet ; « Capitale FC au stade municipal » |
| la Coupe Continentale | les quatre premiers de D1 ; poules puis élimination directe | une chaîne de trois cartes la saison suivante ; « la fête dure trois jours, l'audit trois ans » |
| la Coupe d'été (1990) puis le Continental | championnat des nations tous les quatre ans (1992, 1996, 2000…) | tournoi du sélectionneur, un été sur deux |
| le Mondial | 1994, 1998 (gagné à la maison), 2002… ; 48 équipes à partir de 2026 ; 64 en 2046 ; un Mondial d'hiver à Al-Dorado (2022) | le sommet du sélectionneur, l'attribution comme dossier de l'instance |
| la Ligue fermée | douze clubs, quarante-huit heures en 2019 ; existe dans le monde persistant si six clubs tiennent | cartes de mépris : « Le derby n'existe plus. Le stade sonne creux. » |
| le Mondial des amateurs | 2026, pendant la grève mondiale des joueurs | une seule carte, un seul postulat déblocable |

Le calendrier de la saison (six actes, 17 créneaux, 36 à 44 cartes) est celui de `content/calendar.yaml` ; le sélectionneur vit en années civiles (quatre fenêtres : mars, juin, septembre-octobre, novembre) ; le dirigeant d'instance en mandats de quatre ans (quatre dossiers par an, un Congrès par an, la Campagne la quatrième année).

### 1.5 Les instances

- **La Fédération** (sigle FNF, on dit « la Fédération » ou « la Fédé » dans la bouche des joueurs) : présidée par Noël Legruet de 1988 à 2008, puis par Aulard (2008-2016), puis par qui le joueur laisse gagner. Son **Congrès** réunit chaque juin les présidents de districts, de ligues et de clubs ; il élit tous les quatre ans (1992, 1996, 2000…). Sa **Commission de discipline** siège « salle 3 » ; on y est convoqué, on y attend, on y « examine ». Son **directeur technique national** (Brissac) tient les diplômes d'entraîneur : sans papier, pas de banc en D1, sauf dérogation de six mois. Son **secrétaire général** (Dauzat) sait tout et garde les procès-verbaux.
- **La Ligue professionnelle** : le syndicat des présidents de D1 et D2 ; répartit les droits télé (« les petits ou les gros ? ») ; Aulard la préside de 1998 à 2008 ; Malbec après lui.
- **La Commission de Contrôle des Comptes** : l'Inspecteur (Madame Vialat) ; deux soldes négatifs de suite déclenchent sa lettre ; elle bloque les recrutements, rétrograde administrativement ; elle « ne juge pas, elle compte ».
- **L'Union Continentale** (UC) : cinquante fédérations, un Comité exécutif, les douze gros clubs qui menacent de fonder leur ligue ; siège dans une ville de lac qu'on ne nomme pas (« l'hôtel du Lac » est celui de ses Congrès et de ses perquisitions) ; le fair-play financier (2009).
- **La FédéMonde** : six confédérations, les milliards du Mondial, un patron en costume bleu (Bambini, 1986-2016, puis son dauphin ou toi), un secrétaire général, un comité d'éthique, et une procureure (Amsel) qui frappe à l'hôtel à six heures du matin.
- **Le Tribunal du Sport** : où l'on conteste une exclusion « pour vice de forme » ; il siège loin et répond tard.
- **Le ministère des Sports** : un ministre qu'on ne nomme pas avant 2002 ; Madame Aubert à partir de 2002 (députée en 1997) ; le ministre « veut venir dans le vestiaire » ; la FédéMonde suspend un pays pour ingérence.

### 1.6 Les journaux et les écrans

| Titre | Ligne éditoriale | Plumes | Rubriques | Prix | Existe |
|---|---|---|---|---|---|
| **Le Quotidien du Ballon** (`quotidien`, bleu) | national, sobre, sérieux, un peu lâche : il attend que la chute soit certaine pour la titrer | Pierre Ménèche (chroniqueur, « Hors micro »), puis Léa (rédactrice en chef, 2018) | « Hors micro » (la chronique), « La cote » (les cotes du week-end), « Le tableau noir » (tactique), « Le carnet » (transferts, naissances, enterrements) | 4,50 F ; 0,80 écu (2002) ; 1,50 écu (2020) ; gratuit « offert par Qatalyst » (2035) | 1946-2050 |
| **La Gazette Rose** (`gazette`, rose) | tabloïd : méchante, drôle, souvent juste ; titre sur le coupable avant le fait ; achète les SMS | La Plume (sans visage, investigation), « le Rosé » (un éditorialiste anonyme qui note les présidents sur vingt) | « Le Rosé », « Le carnet noir » (qui va sauter), « Les promesses, datées » (le mur des promesses publiques), « Vu au parking » | 3 F ; 0,50 écu ; tout en ligne à partir de 2015, payant « dix écus par scandale » | 1971-2050 |
| **L'Écho de {ville}** (`echo`, local) | tendre, local, jamais dupe ; parle du local, de la buvette, du radiateur ; le seul journal que lisent Josiane et Camille | Léa (jusqu'en 2018), puis « le stagiaire de l'Écho » (une voix sans portrait) | « Au local », « La météo de la Marmite » (l'ambiance du stade en degrés : *Froide · Tiède · Bouillante · Explosive*, une ligne par semaine), « Le marché du dimanche », « On nous écrit » | 2,50 F ; 0,60 écu ; « prix libre » (2040) | 1902-2050, le dernier journal papier du pays |
| **Télé-Stade** (la chaîne) | l'audience a toujours raison ; en direct, sans filet | Nathalie Vence (journaliste de terrain, « On est en direct »), Franck Ozanne (le patron) ; Ménèche consultant (2003), puis directeur d'antenne (2012) | « Le match du dimanche soir » (1994), « Le plateau » (les consultants, où l'on peut finir), « La zone mixte » | abonnement | 1984-2050 ; rachète Capitale FC en 1991 ; perd les droits contre Médiacrash en 2003 et les reprend en 2007 |
| **Radio Tribune** | la radio des supporters, de 22 h à minuit | Gégé y a une chronique de 2004 à 2011 | « Les auditeurs ont la parole » | gratuit | 1988-2031 |
| **Le Flux** puis **Kick** | le réseau social (2007), puis la diffusion en flux (2024) : le tweet de 3 h du matin, le mème, le compte anonyme de Gégé | personne, tout le monde | — | — | 2007-2050 |

La Une du Bilan est composée par le moteur (spec § 1.6) : une manchette ≤ 44 caractères, un sous-titre, une photo (la carte fatale), trois brèves tirées de l'Almanach, un pied. Le chapitre 20 fournit les manchettes ; la « météo de la Marmite » est une ligne de pied d'Écho, jamais un chiffre de jauge (« Météo de la Marmite : bouillante » quand TRIBUNES ≥ 80 ; « froide » sous 25 ; « tiède » sinon).

### 1.7 Le glossaire du monde (le vocabulaire des personnages)

- **le local** : le local des ultras sous la Tribune Nord ; on y boit trois bières, on y vote la compo à la craie, on y découpe les Unes.
- **le kop, le virage, la Tribune Nord** : la même chose, dans l'ordre de la bouche qui parle (Ménèche dit kop, Gégé dit le virage, Josiane dit la Tribune Nord).
- **la bâche** : la banderole de vingt mètres ; « la bâche a un nom ».
- **le tifo** : le dessin déployé avant le match ; il coûte ; il se paie en pactes.
- **la Marmite** : le stade de Saint-Étoile, et par extension tout stade qui chauffe ; « la météo de la Marmite » (§ 1.6).
- **le distributeur** : le distributeur de billets du centre commercial où le vestiaire apprend que la paie du 5 n'est pas tombée.
- **le bus** : le bus de l'équipe ; le lieu de la mutinerie (« ils ne veulent plus descendre du bus ») et de la fin *Le bus*.
- **la table du Doc** : la table de massage de Sabatier ; « ça reste entre la table et moi » ; ce qui s'y dit ne se dit pas ailleurs.
- **le sifflet du kiné** : Rouvier siffle la fin d'un entraînement que le coach voulait prolonger ; objet héritable.
- **le cahier** : le cahier de l'entraîneur ; Vukić le garde quand il prend le banc.
- **les deux discours** : le président a toujours deux discours prêts la veille du dernier bloc ; tu n'es que dans un.
- **le placard** : la promotion sans fenêtre ; « Directeur du Développement International ».
- **le SMS de 23 h 47** : le licenciement de l'entraîneur ; il contient une faute.
- **le chèque non daté** : l'indemnité qu'Aulard propose ; « je ne le date pas ».
- **la doudoune** : le recruteur au bord du terrain amateur (« le type en doudoune », Barbier).
- **la buvette** : la trésorerie du foot de village ; Gérard la tient depuis vingt ans ; « ici, on payait en bières ».
- **la caisse** : la boîte en fer de Gérard ; « Gérard a fui » = la caisse est partie « au soleil », « loin » (jamais un pays réel dans une réplique nouvelle ; la carte existante `en.evt.gerard` reste telle quelle).
- **le radiateur, le chauffage** : ce que le promu n'a pas payé ; « le radiateur tousse ».
- **la craie** : ce qui n'est pas encore écrit en dur ; le pacte à la craie.
- **le seau** : Marcelo Loco s'assoit dessus au bord du terrain ; « regardez la cassette ».
- **l'usine** : Étoile Bretagne, et tout club qui vend un jeune par an.
- **la clause** : la clause de départ ; « sa mère l'avait lue, elle l'avait écrite ».
- **le fax** : jusqu'en 2010, le transfert passe ou ne passe pas à 23 h 58.
- **le Classique** : Capitale FC contre Marsange.
- **le derby de la vallée** : Saint-Étoile contre Lyonnet ; « le derby » tout court est celui du joueur contre `{rival}`.
- **le Congrès** : l'assemblée annuelle de la Fédération (juin) ou de la FédéMonde (« à l'hôtel du Lac ») ; « on verra ça après le Congrès ».
- **salle 3** : la Commission de discipline ; on y attend.
- **la Commission** : de Contrôle des Comptes quand elle écrit une lettre ; de discipline quand elle convoque ; l'auteur lève l'ambiguïté par un mot (« la lettre », « la convocation »).
- **l'Inspecteur** : Vialat ; « je ne juge pas, je compte ».
- **l'hôtel du Lac** : où siège l'Union Continentale, où l'on vote, où l'on est réveillé à six heures.
- **la Campagne** : les quatre promesses avant la réélection au Congrès.
- **la liste** : la liste des vingt-six du sélectionneur ; « on est un groupe, pas une liste ».
- **la fenêtre** : la période de sélection (mars, juin, septembre-octobre, novembre).
- **le Dossier** : le CV persistant du personnage joué (Réputation, étiquettes, relations, traits, objet).
- **le Carrefour, la Porte de sortie, la Passation, le Fantôme, la Succession, le Cimetière, le Panthéon, l'Almanach, le Code de Carrière** : mots du moteur (bible § 0.13) ; les personnages ne les prononcent jamais, sauf l'Almanach, qui est aussi le titre de la chronique imprimée chaque été par Le Quotidien (« L'Almanach du Ballon », 1 000 pages, une ligne par club).
- **l'aile de poulet, la merguez, les oranges** : la nourriture du foot ; on en mange dans les épitaphes.
- **écus, francs, le million** : § 1.2.

---

## 2. Le casting

### 2.1 Les règles

1. **Chaque personnage a un tic** : une phrase signature qu'il place dans une réplique sur deux, jamais deux fois dans la même carte, et qu'on peut tordre (« J'en ai vu d'autres. Pas celle-là. »). Le tic est le moteur comique le moins cher du monde : on ne le remplace pas, on le déplace.
2. **Trois visages** (sourire : relation ≥ +1 ; neutre ; noir : relation ≤ −1) ; l'`adresse` (comment il t'appelle) change avec le visage. Un auteur écrit la réplique pour le visage neutre et signale, si besoin, la variante « noir » ou « sourire » dans la didascalie. Jamais de chiffre de relation dans le texte.
3. **Le camp** fixe la couleur de fond de la vignette et le côté du monde d'où il parle : `terrain` (vestiaire, staff, tribune, famille du foot), `direction` (bureau, argent, agents, presse), `instances` (Fédération, Union, FédéMonde, mairie, justice), `selection` (les Cobalts et leurs adversaires), `famille` (la maison). Un personnage change de camp quand il change de métier (Bréhaut passe de `terrain` à `direction` en devenant DS : c'est le même portrait, la bande blanche change).
4. **L'âge est celui de 1990** ; +1 par saison ; le portrait vieillit par paliers (gris à 45, lunettes à 55, canne à 75). Un personnage a une **fenêtre d'activité** ; hors fenêtre il est `retraite` ou `parti`, et ne parle qu'au téléphone, à l'enterrement, ou comme Fantôme. Après lui, un « suivant » sous un autre nom (un nouveau prodige naît, une nouvelle secrétaire). Les chapitres 01 et 02 écrivent la fenêtre et le suivant.
5. **Le désir et la blessure** : ce qu'il veut, ce qu'il n'avouera jamais. Toute scène qui le fait parler doit toucher l'un ou l'autre.
6. **Il traverse les rôles** : le président que tu as eu comme entraîneur devient ton égal quand tu es président, ton électeur quand tu es à la Fédération, ton ennemi quand tu es sélectionneur et qu'il veut ton poste pour son protégé. Chaque fiche dit ce qu'il est dans chaque rôle.
7. **La règle des deux traits** (bible § 0.9) : au plus deux traits reconnaissables d'une personne réelle, jamais son nom, jamais son visage, jamais un scandale attaché à un personnage reconnaissable.
8. **Les seconds rôles** parlent peu (deux à six cartes par rôle) ; les génériques (« un émissaire », « le stagiaire », « ta voix intérieure ») n'ont pas de portrait et n'ont pas de relation.

### 2.2 Les dix-sept personnages existants (`content/characters.yaml`)

| id | Nom, fonction (genre, âge 1990, camp) | Tic | Désir · Blessure | Ce qu'il pense de toi (sourire / neutre / noir) | Dans quels rôles |
|---|---|---|---|---|---|
| `fardelli` | Rocco Fardelli, agent de joueurs (m, 44, direction) | « Mon ami, on parle d'argent ou d'amitié ? » | sa commission, ta loyauté tant qu'elle rapporte · son premier client l'a quitté la semaine de son transfert record | « mon ami » / « mon ami {prenom} » / « monsieur {nom} » | joueur (agent), entraîneur (l'agent de ta star, l'enveloppe), DS (le bulldozer), président (l'adversaire), sélectionneur (l'agent du capitaine), instance (« le carnet noir » comme témoin) |
| `meneche` | Pierre Ménèche, journaliste (m, 42, direction) | « Juste une question, hors micro. » | l'exclusivité, que tu lui doives quelque chose · il a enterré un dossier une fois, par amitié, et on s'en est servi contre lui | « {prenom} » / « coach » / « monsieur {nom} » ; à −3 il sort le dossier, à +3 il l'enterre | tous ; consultant (2003), directeur d'antenne (2012), retraité qui publie ses mémoires (2025) |
| `gege` | Gégé, capo de la Tribune Nord (m, 47, terrain) | « La tribune n'oublie rien. » | la fierté du virage, le respect · son père a été interdit de stade en 1971 pour un tifo | « {prenom} » / « coach » / « {nom} » ; joueur : « petit » / « {prenom} » / « le {numero} » | joueur, entraîneur, président (les abonnements à cinq écus), amateur (il a un cousin partout), instance (le compte anonyme, 2020) ; chroniqueur Radio Tribune 2004-2011 ; élu socios 2032 |
| `aulard` | Jean-Marie Aulard, président (m, 58, direction) | « J'ai pas le temps, j'ai un empire. » | durer, contrôler, être cité · avocat de formation, il n'a jamais joué ; son fils ne veut pas de l'empire | « mon {prenom} » / « {nom} » / « monsieur {nom} » | entraîneur (le patron), joueur (le prix), DS (le patron qui achète sans toi), président (ton égal, puis patron de la Ligue 1998-2008, président de la Fédération 2008-2016), instance (ton adversaire au Congrès) ; te vire souvent, te rappelle toujours |
| `vukic` | Zoran Vukić, entraîneur adjoint (m, 37, terrain) | « Je te le dis parce que personne ne te le dira. » | être numéro 2 d'un numéro 1 qu'il respecte · ancien gardien de Dalmarie, il a lâché un ballon en finale et personne ne le lui a dit | « {prenom} » / « coach » / « {nom} » | entraîneur (l'adjoint, le dauphin), joueur (l'adjoint qui te met sur le banc, puis le coach qui te veut), sélectionneur (ton adjoint ou le sélectionneur de Dalmarie), DS (l'entraîneur que tu nommes) |
| `brehaut` | Titi Bréhaut, capitaine (m, 33, terrain → direction) | « Le groupe vit bien. » | le brassard, puis le costume · son frère est agent et lui a coûté son contrat d'image | « coach » / « coach » / « {nom} » ; joueur : « {prenom} » / « petit » / « le {numero} » | joueur (le capitaine qui te teste), entraîneur (le capitaine, puis DS), DS (ton prédécesseur ou ton successeur), président (DS sous Qatalyst, rival ou allié), sélectionneur (le capitaine écarté, 1990-1994) |
| `sabatier` | Doc Sabatier, médecin du club (m, 51, terrain) | « Ça reste entre la table et moi. » | soigner, parfois trop · ancien de l'équipe cycliste, il sait ce qu'il y a dans le flacon B | « {prenom} » / « coach » / « monsieur {nom} » ; à +3 il prévient d'un contrôle | joueur, entraîneur (la pharmacie), sélectionneur (le médecin des Cobalts), DS (la visite médicale cachée), instance (le témoin de la commission antidopage, 2010) |
| `camille` | Camille, à la maison (f, 32, terrain — `famille` n'est pas son camp dans `characters.yaml` ; le camp `famille` est réservé aux nouveaux venus de la maison, Sacha) | « Tu rentres à quelle heure ? » | que tu existes ailleurs que sur un terrain · elle a renoncé à quelque chose pour te suivre ; son métier (avocate, journaliste, agente, médecin, élue) est tiré au sort et débloque une carte de sauvetage | « {prenom} » / « {prenom} » / « {nom} » ; paliers −1 dispute, −2 chambre d'amis, −3 valise ; +3 secours | tous ; la cinquième jauge ; la carte Naissance (Sacha) |
| `aubert` | Madame Aubert, maire (f, 46, instances) | « Le stade, c'est de l'argent public. » | être réélue, un club qui gagne sans coûter · son fils joue mal et veut jouer | « madame/monsieur {nom} » sur les trois visages (elle ne tutoie personne) | amateur et président amateur (la subvention, la fusion, le synthétique), président pro (le stade dont tu seras locataire), entraîneur (la D2 et la mairie), sélectionneur et instance (députée 1997, ministre des Sports 2002-2012, « une amie précieuse ou une ennemie mortelle ») |
| `legruet` | Noël Legruet, président de la Fédération (m, 63, instances) | « On verra ça après le Congrès. » | rester, nommer, être aimé des districts · il n'a jamais gagné une élection de plus de dix voix | « cher/chère {prenom} » / « madame/monsieur {nom} » / idem | entraîneur (le diplôme, la Commission), joueur (la sélection), sélectionneur (celui qui te nomme et te lâche), instance (ton prédécesseur, ton mentor ou ton adversaire ; vise l'Union Continentale, 2008-2016) ; retraité en 2016, meurt en 2029 |
| `nassir` | Cheikh Nassir, fonds Qatalyst (m, 34, direction) | « Ce n'est pas un club, c'est un actif. » | rendement et image d'État · il aimait le football avant d'en acheter | « {prenom} » / « coach » / « monsieur {nom} » | entraîneur (sponsor → naming → prêt → rachat), joueur (l'exil doré), président (l'actionnaire ou le propriétaire), DS (le budget illimité et ses conditions), instance (le Mondial d'Al-Dorado, 2010-2022) |
| `josiane` | Madame Josiane, secrétaire depuis 1987 (f, 52, direction) | « J'en ai vu passer, vous savez. » | que le club tourne · elle a refusé un poste à la capitale en 1987 pour rester | « {prenom} » / « madame/monsieur {nom} » / idem | tous ; le tutoriel incarné ; secrétaire du club (1990-2008), de la Fédération (2008-2016), de la FédéMonde (2016-2022) ; retraitée en 2022, elle range encore les dossiers ; sa nièce « la petite Josiane » prend la suite au club |
| `clow` | Brian Clow, le mentor (m, 61, terrain) | « Je ne dirais pas que j'étais le meilleur, mais j'étais dans le top un. » | te voir réussir sans le dire · ses quarante-quatre jours dans un grand club ; il boit | « petit » / « {prenom} » / « coach » | entraîneur (trois conseils, l'hôpital, le testament), joueur (le diplôme, « lundi, huit heures »), sélectionneur (le seul qui te dise que tu vas perdre), DS (il refuse de travailler avec ta lignée si tu as été ingrat) ; meurt entre 1995 et 2000 selon la carrière ; un buste au Panthéon ; son fils (« le fils de Clow ») est entraîneur à partir de 2005 |
| `mbako` | Lian Mbako, prodige (m, 16, terrain) | « Je veux jouer. Maintenant. » | jouer, partir, revenir · sa mère négocie tout ; il n'a jamais rien décidé seul | « coach » / « coach » / « monsieur » ; joueur : « {prenom} » / « {prenom} » / « {nom} » | entraîneur (le prodige, l'horloge qui avance), joueur (le prodige d'après, ton poste), sélectionneur (la star des Cobalts 1996-2010, le binational tenté par le Kambara), président (le retour, la statue), instance (le capitaine qui négocie les primes, 2008) ; coach rival (2018), sélectionneur du Kambara (2026), Fantôme |
| `vecchio` | Gigi Vecchio, gardien de 41 ans (m, 41, terrain) | « J'en ai vu d'autres. » | une saison de plus · il a quarante et un ans et personne ne le lui a dit autrement qu'en riant | « coach » sur les trois visages ; joueur : « petit » / « petit » / « {prenom} » | joueur (le tutoriel du corps, l'exemple), entraîneur (la retraite chaque juin, l'entraîneur des gardiens à 45), sélectionneur (« il descend le premier » du bus), amateur (le vieux gardien de Trébignac à 50 ans), président (il tient la buvette des anciens) ; meurt en 2031, minute de silence, l'arbitre ajoute une minute |
| `lea` | Léa, presse (f, 25, direction) | « Vous confirmez ? » | la vérité, en une phrase · elle a commencé à L'Écho parce que Le Quotidien ne l'a pas prise | « {prenom} » / « coach » / « madame/monsieur {nom} » | joueur (l'attachée de presse, la première Une, les mémoires), entraîneur (la conférence), sélectionneur (la zone mixte), instance (rédactrice en chef du Quotidien, 2018 ; la seule qui pose la question), DS (elle sait avant toi) |
| `mere_mbako` | La mère de Mbako, mère et agente (f, 39, terrain) | « Mon fils n'a besoin de personne. » | que son fils décide, et qu'il décide comme elle · on lui a fait signer quelque chose une fois, elle avait dix-neuf ans | « {prenom} » / « coach » / « madame/monsieur {nom} » | entraîneur (elle négocie), joueur (elle t'explique que tu étais le prochain), DS (3 % ou rien), sélectionneur (le Kambara appelle), instance (la mère devenue agente de vingt joueurs, 2010) |

### 2.3 Les personnages nouveaux (à créer dans `characters.yaml` par le chantier données ; les chapitres 01 et 02 en écrivent la fiche complète)

| id | Nom, fonction (genre, âge 1990, camp) | Tic | Désir · Blessure | Adresse (sourire / neutre / noir) | Dans quels rôles |
|---|---|---|---|---|---|
| `bambini` | Giancarlo Bambini, patron de la FédéMonde (m, 58, instances) | « Le football unit le monde. Et mes amis. » | un Mondial plus gros, un mandat de plus · il n'a jamais joué, il a arbitré un match de jeunes et sifflé la fin trop tôt | « cher ami » / « monsieur le président » / « monsieur » | instance (le patron, le rival, le parrain ; se représente à 79 ans), sélectionneur (il remet le trophée à côté d'un dictateur), président (les 48 heures de la Ligue fermée : il « est choqué ») |
| `dauzat` | Aurélien Dauzat, secrétaire général de la Fédération (m, 44, instances) | « C'est dans le procès-verbal. » | durer sous tous les présidents · il ne sera jamais élu, et il le sait mieux que tout le monde | « cher {prenom} » / « monsieur le président » / « {nom} » | instance (l'homme qui sait tout, ennemi mortel s'il se retourne ; secrétaire général de l'Union en 2012, de la FédéMonde en 2020), sélectionneur (le contrat de minuit et une), président (le règlement, page 41) |
| `vialat` | Madame Vialat, l'Inspecteur de la Commission de Contrôle des Comptes (f, 45, instances) | « Je ne juge pas. Je compte. » | un bilan qui tombe juste · elle a laissé passer un club en 1989 ; il a coulé | « madame/monsieur {nom} » sur les trois visages | président (la lettre, le blocage, la rétrogradation), DS (les commissions), entraîneur (le coupable désigné), instance (elle dirige l'agence de notation, 2033) |
| `amsel` | Judith Amsel, procureure (f, 47, instances) | « Nous avons tout notre temps. » | un dossier qui tient · son premier dossier a été classé « par respect pour l'horaire » | « madame/monsieur {nom} » sur les trois visages | instance (le raid à l'aube), président (les écoutes, la valise), joueur (les paris, la brigade), agent (les fuites) |
| `colline` | Colline, arbitre (m, 34, instances) | « J'ai vu. » | la finale continentale · incorruptible dans un monde qui ne l'est pas, ce qui est la blague ; il a sifflé une main en 1996, contre son propre pays | « {prenom} » / « monsieur » / « monsieur » (il vouvoie tout le monde, y compris sa mère) | joueur (le temps fort, la main), entraîneur (le temps additionnel, « il regarde ton banc »), président (les écoutes : il refuse et te regarde), instance (responsable de l'arbitrage à la Fédération, 2008 ; l'arbitre et la machine, 2027) ; retraite obligatoire du sifflet à 45 ans (2001) |
| `loco` | Marcelo Loco, entraîneur mystique (m, 45, terrain) | « Regardez la cassette. » | qu'on le comprenne · personne ne le comprend ; il s'assoit sur un seau parce que le banc est trop loin du terrain | « {prenom} » / « profesor » / (il ne parle pas aux gens qu'il n'aime pas) | entraîneur (le grand nom que le board veut pour janvier, le coach rival, l'espion dans la haie), DS (le coach intouchable), joueur (le coach qui te fait courir 20 kilomètres), président (le postulat déblocable « Le coach-cassette ») |
| `klopf` | Klopf, entraîneur à casquette (m, 38, terrain) | « On court, on presse, on chante. » | le pressing comme une religion · il a perdu trois finales de suite en souriant | « {prenom} » / « coach » / « collègue » | entraîneur (le rival qui gagne le derby, l'adjoint de Loco un temps), sélectionneur (sélectionneur de la Vestrie 2004-2016), président (l'entraîneur que tout le monde veut), DS (il exige un latéral gauche) |
| `la_plume` | La Plume, journaliste d'investigation sans visage (f, 36, direction) | « J'ai les documents. » | que ça sorte · elle n'a pas de visage parce qu'on lui a cassé le sien en 1988 ; elle écrit sous ce nom à La Gazette Rose | « {prenom} » / « {prenom} {nom} » / « {nom} » (par écrit uniquement ; elle n'apparaît que quand Parole ≤ −2 ou qu'une trace judiciaire existe) | tous ; jamais en première saison ; instance (dix-huit millions de pages), président (les écoutes), joueur (l'enregistrement du bar d'hôtel), agent (les mails) |
| `vence` | Nathalie Vence, journaliste de Télé-Stade (f, 32, direction) | « On est en direct. » | la phrase de trop, en direct · elle a fait pleurer un sélectionneur en 1990 et n'a pas aimé ça | « {prenom} » / « coach » / « madame/monsieur {nom} » | joueur (la zone mixte, « vous avez vu l'action ? »), entraîneur (« je n'ai pas vu »), sélectionneur (l'interview de l'élimination, la demande en mariage), instance (le plateau du Congrès), président (le tweet de 3 h du matin lu à l'antenne) ; présentatrice du Plateau (2003), directrice de l'info (2020) |
| `solvang` | Ingrid Solvang, agente (f, 33, direction) | « Mon client décide. Moi, je compte. » | la nouvelle génération contre les gourmettes · Fardelli lui a volé son premier client ; elle a gardé le contrat | « {prenom} » / « {prenom} {nom} » / « {nom} » | joueur (l'agente d'après, le double mandat refusé), DS (l'agent discret, le père-agent, la clause anti-voyage spatial), président (elle représente ton entraîneur), entraîneur (elle veut Mbako), agent (la rivale) ; reprend le carnet de Fardelli en 2018 |
| `barbier` | Lucien Barbier, recruteur de Valdorne (m, 58, direction) | « Je l'ai vu jouer sous la pluie. » | trouver le dernier grand · celui qu'il a raté (un gardien de Néville qui avait dix-sept ans en 1979 : Gigi Vecchio, dit la légende) | « petit » / « {prenom} » / « {nom} » | amateur (le type en doudoune), joueur (le rapport qui dit « trop lent »), entraîneur (le recruteur qui a vu un gamin), DS (ton chef du recrutement, l'algorithme contre l'œil), président amateur (l'indemnité de formation) ; retraite en 2006, revient bénévole à Trébignac |
| `rouvier` | Nadia Rouvier, kiné (f, 30, terrain) | « Respire. Encore. » | ouvrir son cabinet · elle voit ce que le Doc cache et ne peut rien dire | « {prenom} » / « coach » / « monsieur/madame {nom} » | joueur (le genou, l'infiltration : la seconde voix), entraîneur (le sifflet du kiné, le stage commando), sélectionneur (le stage à l'hôtel du sponsor), DS (les huit kilos du carnaval) ; kiné des Cobalts 2002-2014, cabinet à Saint-Étoile ensuite |
| `dembo` | Dembo, avant-centre (m, 24, terrain) | « Donne-moi le ballon, je m'occupe du reste. » | marquer, être aimé, dormir tard · il a été le prodige de quelqu'un ; on l'a vendu à 17 ans, il ne l'a pas digéré | « {prenom} » / « coach » / « patron » (ironique) | joueur (le coéquipier rival, le tireur de penalty, le yacht), entraîneur (la star qui ne défend pas, les huit kilos du carnaval), DS (60 millions d'Al-Dorado), président (la star qu'on vend ou qu'on met au loft), sélectionneur (l'avant-centre naturalisé ? non : celui qui ne chante pas l'hymne) ; consultant en 2010, ruiné en 2015, entraîneur de Corbelin en 2020 |
| `fauvel` | Karim Fauvel, capitaine des Cobalts (m, 27, selection) | « On est un groupe, pas une liste. » | le Mondial · il a manqué le tir au but de 1990 ; on le lui rappelle à chaque fenêtre | « {prenom} » / « coach » / « monsieur le sélectionneur » | sélectionneur (le capitaine, le bus, l'avion des primes ; capitaine 1990-1998, champion 1998), joueur (le capitaine de la sélection qui te reçoit), instance (le président du syndicat des joueurs, 2006 ; la grève mondiale, 2026), entraîneur (le capitaine vieillissant à 33 ans, s'il joue à `{club}`) |
| `brissac` | Solange Brissac, directrice technique nationale (f, 49, selection) | « Les chiffres sont têtus, les joueurs aussi. » | la formation, les diplômes, le jeu · ancienne internationale d'une sélection féminine que personne ne filmait | « {prenom} » / « madame/monsieur {nom} » / idem | entraîneur (le diplôme, la dérogation, le stage de Clow), sélectionneur (l'attaquant naturalisé, la liste, le binational), instance (la commission technique, la sélection féminine et l'égalité des primes), joueur (« trop lent » dit aussi le chiffre) ; DTN 1988-2010, présidente de Mirevaux ensuite |
| `malbec` | Hubert Malbec, président du Racing de Valentienne (m, 54, direction) | « Entre présidents, on se comprend. » | la Ligue, puis la Fédération, sans passer par les districts · Aulard lui a pris un entraîneur et une élection | « cher {prenom} » / « {nom} » / « monsieur » | président (ton égal, ton allié, ton rival ; l'enveloppe côté adverse), entraîneur (le président qui te débauche), DS (le club qui offre 25 millions), instance (président de la Ligue 2008-2020, candidat à la Fédération contre toi), sélectionneur (il veut son joueur dans la liste) |
| `montoya` | Don Alvaro Montoya, président du Real Montoya (m, 60, direction) | « Douze clubs. Une table. Vous êtes assis ou debout ? » | la Ligue fermée · son club a tout gagné et perd de l'argent | « ami » / « président » / « monsieur » | président (les 48 heures), instance (le bloc des douze contre l'Union), entraîneur (le Real Montoya t'appelle à mi-saison), joueur (le transfert du siècle) ; meurt en 2027, son fils reprend « la table » |
| `dupuis` | Dupuis, boucher, sponsor (m, 50, direction) | « Le meilleur du cochon, et je pèse mes mots. » | son nom dans le dos · son fils ne veut pas reprendre la boucherie ; il veut jouer | « petit » / « président » / « {nom} » | président amateur (le maillot rose « DUPUIS », il veut choisir le capitaine), amateur (il paie la tournée), entraîneur amateur (le boucher-sponsor, drapeau `boucher_sponsor` existant), président pro (il a fait fortune en surgelés : « Arena Dupuis », 2015) |
| `gerard` | Gérard, bénévole de la buvette, trésorier (m, 61, terrain) | « Ici, on payait en bières. » | que rien ne change · il a tout donné pendant vingt ans et personne n'a dit merci ; un jour il part avec la caisse (carte existante `en.evt.gerard`) | « petit » / « président » / « {nom} » | président amateur (la caisse, la buvette après 22 h, « Gérard a fui »), amateur (la troisième mi-temps), entraîneur (l'événement existant), président pro (il revient, repenti, tenir la buvette des anciens en 2005) |
| `dede` | Dédé, coach bénévole (m, 52, terrain) | « Bon, on va pas se mentir. » | un gamin qui passe pro · lui n'est jamais passé ; essai raté à Valdorne en 1961, sous la pluie | « petit » / « {prenom} » / « le {numero} » | amateur (ton coach, le neveu du président, la gardienne), président amateur (« le coach bénévole veut être payé »), entraîneur (ton adjoint bénévole si tu redescends), joueur pro (il téléphone après ton premier match en D1) ; meurt en 2012, l'enterrement |
| `pichon` | Roger Pichon, boulanger, président de Trébignac (m, 56, direction) | « Le pain, c'est à cinq heures. Le foot, c'est après. » | que le club existe encore quand il fermera la boulangerie · le club a failli fermer en 1985 | « petit » / « {prenom} » / « monsieur {nom} » | amateur (le président-boulanger, 150 francs au noir, le match arrangé), président amateur (ton prédécesseur, ton successeur), instance (délégué du district au Congrès : une voix) |
| `roux` | Firmin Roux, président du district (m, 66, instances) | « Le district, c'est la base. » | être invité à la table de Legruet · Legruet ne retient jamais son prénom | « mon petit » / « président » / « {nom} » | président amateur (la commission de discipline du district : le premier pied dans la Fédération), amateur (la convocation), instance (l'électorat : trois cents districts qui votent comme Roux), entraîneur amateur (le huis clos) |
| `paulette` | Mamie Paulette, abonnée depuis 1951 (f, 71, terrain) | « J'étais là en cinquante et un. » | mourir au stade, tribune Est, place 14B · son mari y est mort, à la 70e, souriant | « mon petit » / « {prenom} » / « le coach » (jamais ton nom : elle ne retient que ceux qui restent) | tous (une carte par rôle au plus par saison) ; la mémoire du club à voix haute ; elle lit L'Écho ; « Ta loge » et « Le dernier derby » lui font écho ; meurt en 2009, à la 70e, on ne l'a pas réveillée |
| `sacha` | Sacha, ton enfant (f, naît pendant la carrière, famille) | « Tu m'as promis. » | un parent, pas un entraîneur · elle a grandi dans une tribune vide | « papa/maman » / « {prenom} » / « {nom} » (à −1 elle t'appelle par ton nom de famille : c'est la pire chose qu'un enfant puisse dire) | tous à partir de ses six ans (une carte par saison) ; joueur amateur (héritière de 18 à 22 ans à la Succession, trait hérité, trait inversé), président (« Papa, tu as tweeté à 3 h du matin »), sélectionneur (elle ne chante pas l'hymne), instance (elle est dans l'ONG qui compte les ouvriers) |

Vingt-quatre nouveaux, dix-sept anciens : **quarante et un personnages à statut**. Les seconds rôles sans fiche (« un émissaire de Qatalyst », « le stagiaire de l'Écho », « la petite Josiane », « le fils de Clow », « le fils de Montoya », « le fils de Dupuis », « ton cousin des îles », « Maître Vidal, ton avocat », « Tony, ton pote d'enfance ») sont des voix sans portrait : deux cartes chacun au plus par chapitre, jamais de relation.

### 2.4 Qui parle dans quel rôle (minimum garanti par chapitre de scénarios)

| Rôle | Patron (DIRECTION) | Chœur (le tutoriel, le commentaire) | Cœur (le terrain) | Créancier / tentateur | Chroniqueur | Horloge |
|---|---|---|---|---|---|---|
| Joueur amateur | Dédé (le coach), Pichon | Josiane, Gérard | Vecchio (à 50 ans), Dupuis, Paulette | Barbier (la doudoune), Montbéliac (voix) | Léa (L'Écho) | l'âge : 25 ans |
| Joueur pro | Fardelli (agent), Aulard, Vukić (le coach) | Josiane, Rouvier | Bréhaut, Dembo, Vecchio, Mbako | Nassir, Solvang, « ton cousin » | Léa, Vence, Ménèche | Sabatier (le genou) |
| Entraîneur | Aulard, Malbec | Josiane, Vukić | Bréhaut, Vecchio, Mbako, Dembo, Rouvier | Nassir, Fardelli, Gégé | Ménèche, Léa | Clow (l'hôpital), Mbako |
| Directeur sportif | Aulard, Nassir | Josiane, Barbier | Klopf ou Loco (le coach), Bréhaut | Fardelli, Solvang, mère de Mbako | Ménèche, Vence | Vialat (l'Inspecteur) |
| Président amateur | Aubert (la mairie), Roux | Gérard, Josiane | Dédé, Vecchio, Paulette | Dupuis, Montbéliac, « deux acteurs » | Léa (L'Écho) | la Coupe |
| Président pro | Nassir ou les actionnaires, Malbec | Josiane, Dauzat | Bréhaut (DS), Gégé, l'entraîneur (Klopf/Loco/Vukić) | Montoya, Fardelli, Aubert (le stade) | Ménèche, La Plume | Vialat |
| Sélectionneur | Legruet, Brissac, Aubert (ministre) | Josiane (Fédération), Rouvier | Fauvel, Mbako, Vecchio, Dembo | Fardelli (l'agent du capitaine), Malbec | Vence, Ménèche | le tournoi |
| Dirigeant d'instance | le Congrès : Roux, Malbec, Aulard ; Bambini | Josiane, Dauzat | Colline, Fauvel (syndicat), Brissac | Nassir, Montoya, « un émissaire » | La Plume, Léa, Vence | Amsel (la procureure), l'élection |

---

## 3. Les rôles et les postulats

### 3.1 Les huit rôles

Quatre jauges, toujours aux mêmes emplacements ; chaque jauge tue à 0 (vide) et à 100 (pleine) ; les titres des fins sont ceux de `docs/brainstorm/02-boucle-de-jeu.md` § 2.9 et de `content/endings.yaml` (existants pour joueur et entraîneur). Ids de rôle pour les `roles:` des cartes : `joueur_amateur`, `joueur`, `entraineur`, `ds`, `president_amateur`, `president`, `selectionneur`, `instance`.

| Rôle (préfixe) | VESTIAIRE — vide / pleine | TRIBUNES — vide / pleine | DIRECTION — vide / pleine | CAISSE — vide / pleine | Jauge fragile · Posture de match |
|---|---|---|---|---|---|
| Joueur amateur (`am.`) | Les copains — *Le toro* / *Le caïd* | Le bistrot — *Le comptoir* / *Le héros du canton* | Le coach — *La touche* / *Le chouchou* | Le porte-monnaie — *Le patron a dit non* / *L'enveloppe* | TRIBUNES · Je joue / Je bosse lundi |
| Joueur pro (`jp.`) | Vestiaire — *Le mouton noir* / *Le porte-parole* | Tribunes — *Sifflé* / *L'homme-sandwich* | Le club — *La place 14B* / *Le fils spirituel* | Compte — *Sans club* / *La carte Panama* | TRIBUNES · Je fonce / Je me ménage |
| Entraîneur (`en.`) | Vestiaire — *Le bus* / *Le copain* | Tribunes — *La banderole* / *L'otage du kop* (+ *La tribune*, rare) | Le président — *Le SMS de 23h47* / *Promotion-placard* (+ *La valise*, *Le dauphin*) | Le budget — *Vendu à la découpe* / *Le coupable désigné* | DIRECTION · Offensif / Prudent |
| Directeur sportif (`ds.`) | Le staff — *La fronde* / *Le club des copains* | Tribunes — *Le mercato raté* / *L'architecte* | Le président — *D'un commun accord* / *L'homme du président* | Masse salariale — *Les contrats impayables* / *Le roi du mercato* | CAISSE · Le 9 / Le trader |
| Président amateur (`pr.`, rôle `president_amateur`) | Le club — *Plus personne pour tracer les lignes* / *La buvette prend le pouvoir* | Le village — *Le club d'à côté* / *Le maire jaloux* | La mairie — *La subvention* / *L'homme de la mairie* | La caisse — *La buvette* / *Le magot* | CAISSE · Chez nous dans la boue / Chez eux, la recette |
| Président pro (`pr.`, rôle `president`) | Le club — *La grève des salariés* / *Le président fantôme* | Tribunes — *Le siège du siège* / *La mairie* | Actionnaires — *L'AG* / *Le pantin* | Trésorerie — *La Commission des comptes* / *Le fonds* | CAISSE · Je descends au vestiaire / Je reste en loge |
| Sélectionneur (`sl.`) | Le groupe — *Les deux clans* / *La fête* | Le pays — *L'ennemi public* / *L'ambassadeur* | La Fédération — *Minuit et une* / *L'homme du président* | Les moyens — *Les charters* / *Les primes cachées* | VESTIAIRE · Les cadres / Les jeunes |
| Dirigeant d'instance (`in.`) | Le comité — *La motion* / *Le dauphin* | L'opinion — *Les dix-huit millions de pages* / *Le showman* | Le Congrès — *Le vote de défiance* / *Le pantin des confédérations* | Les réserves — *Le taxi* / *Le raid à l'aube* | VESTIAIRE · Le dossier / Le vote |

Fins universelles : *Le Grand Déballage* (Parole ≤ −5), *Le Jubilé* (joueur, 38 ans), *Ta loge* (78 ans), *Mort au poste* (après 70 ans), *La statue de bronze* (la grande porte), *Le burn-out*, *Battu au Congrès* (instance) ; fins de choix, judiciaires, d'imposture et d'objectif : brainstorm 02 § 2.9. Le chapitre 30 les écrit toutes au gabarit § 4.8, avec `epitaph_plus`.

### 3.2 Les postulats

Les quatre existants sont intouchables (ids, index, année, jauges) ; les autres viennent du brainstorm 03 § 3.2, reçoivent un id, un titre, un pitch (sous la pochette), une **question de saison** (le fil rouge tiré : trois réponses possibles, comme `tribune / president / argent` du promu), une année de départ qui étale le monde sur ses six décennies, et trois objectifs cachés (écrits par le chapitre du rôle). Le tirage de départ pondère les familles jamais jouées ; les postulats marqués ★ se débloquent en atteignant le rôle une fois.

| id | Rôle | Titre | Année · club | Pitch (sous la pochette) | Question de saison (fil rouge) |
|---|---|---|---|---|---|
| `promu` (0) | entraîneur | Le promu sans un sou | 1990 · D1 | Promu, ruiné, adoré. Trois histoires par saison, jamais les mêmes. | Ce club est à qui : à la tribune, au président, ou à l'argent ? (`tribune / president / argent`) |
| `interimaire` (1) | entraîneur | L'intérimaire | 1990 · D2 | Six semaines pour devenir indispensable, et personne ne te croit. | `vestiaire / diplome / grand_nom` |
| `pepite` (2) | joueur | La pépite du club-usine | 1990 · D2 (l'usine) | Tout le monde veut te vendre. Toi, tu veux jouer. | `prix / terrain / maison` |
| `fin_de_contrat` (3) | joueur | Fin de contrat à 31 ans | 1990 · D1 | Ton genou a un avis, ton agent en a un autre. | `genou / agent / vestiaire` |
| `village_endette` | joueur amateur | Le club du village endetté | 1991 · District (Boisnoir) | Dix-neuf ans, un boulot, des copains, et un club qui fusionne l'an prochain. | Qu'est-ce que tu ne veux pas perdre : le boulot, les copains, ou le village ? (`boulot / copains / village`) |
| `lache_academie` | joueur amateur | Lâché par l'académie | 1994 · Régional 1 | Valdorne t'a rendu à dix-huit ans. Fardelli t'a gardé. | `revanche / oubli / fardelli` |
| `retour_croises` | joueur | Retour de croisés | 1998 · D1 | Le genou est neuf. Le vestiaire t'a attendu. Le coach, moins. | `corps / place / confiance` |
| `binational` | joueur | Le binational | 2004 · D1 | Deux hymnes, un choix, une vie de sifflets dans un des deux stades. | `pays / famille / carriere` |
| `banc_dore` ★ | joueur | Le banc doré | 2008 · Al-Dorado FC | Le compte est plein, le banc est climatisé, tes jambes rouillent. | `argent / jeu / retour` |
| `capitaine_dechu` ★ | joueur | Capitaine du géant déchu | 2012 · D2 (rétrogradé) | Six titres au mur, un vestiaire de bric et de broc, un brassard qui pèse. | `remontee / fierte / depart` |
| `bout_du_monde` | entraîneur | Le coach du bout du monde | 2001 · Sylvanie | Les salaires sont en retard, le ministre donne la compo, le pays t'adore. | `ministre / salaires / peuple` |
| `six_mois` ★ | entraîneur | Six mois pour gagner | 2006 · D1 (club Qatalyst) | Un vestiaire de stars à trente, un propriétaire à quarante, un titre ou rien. | `stars / proprietaire / jeu` |
| `section_feminine` | entraîneur | Section féminine, année un | 2016 · Mirevaux | Un budget de buvette, des joueuses qui ont un emploi, des médias qui arrivent. | `budget / emploi / medias` |
| `vendre_trente` | DS | Vendre trente millions par an | 2003 · D1 (l'usine) | L'objectif est dans ton contrat : trente millions de ventes. Le coach n'a pas lu ton contrat. | `coach / scouts / president` |
| `coach_intouchable` ★ | DS | Le coach intouchable | 2010 · D1 | Marcelo Loco est vénéré par le président. Tu es le fusible entre deux monuments. | `loco / president / vestiaire` |
| `fusion_imposee` | président amateur | La fusion imposée | 1996 · District (Boisnoir) | Madame Aubert veut marier ton club et Montbéliac. Tu as huit cartes. | `couleurs / mairie / gamins` |
| `coupe_du_village` | président amateur | Le Petit Poucet | 2000 · Régional 2 (Trébignac) | Capitale FC au tirage. Le stade tient deux mille personnes. Le village en a huit cents. | `recette / fete / apres` |
| `geant_dechu` | président pro | Le géant déchu, côté bureau | 1999 · D2 (dépôt de bilan) | Trésorerie à dix, tribunes à quatre-vingt-dix, la Commission dans le couloir. | `commission / kop / vente` |
| `rachete_fonds` | président pro | Racheté par un fonds | 2007 · D1 | Les actionnaires aiment les chiffres, les ultras aiment les couleurs, et le naming est déjà signé. | `naming / kop / titre` |
| `pays_emergent` | sélectionneur | Qualifier la Sylvanie | 2002 · Sylvanie | Le pays est à quatre-vingt-dix. Les joueurs vivent ailleurs. Le ministre a une liste. | `expatries / ministre / jeunes` |
| `apres_fiasco` ★ | sélectionneur | Après le fiasco | 2011 · les Cobalts | Le bus n'est jamais descendu. Le pays est à vingt. Choisis un capitaine entre les mutins et les nouveaux. | `mutins / nouveaux / presse` |
| `heritage_empoisonne` | instance (Fédération) | Héritage empoisonné | 2005 · la Fédération | Ton prédécesseur est parti pour corruption. L'enquête frappe à ton bureau. | `nettoyer / proteger / oublier` |
| `sous_tutelle` | instance (Fédération) | La fédération sous tutelle | 2013 · la Fédération | Le gouvernement a dissous le comité ; la FédéMonde menace de suspendre le pays. | `ministre / fedemonde / districts` |
| `tournoi_desert` ★ | instance (Union Continentale) | Le tournoi du désert | 2009 · l'Union | Première décision : un pays riche et suspect, ou un pays pauvre et honnête. | `argent / parole / votes` |
| `elu_surprise` ★ | instance (FédéMonde) | Élu par surprise | 2016 · la FédéMonde | Le secrétaire général est hostile, les sponsors fuient, Bambini « est choqué ». | `dauzat / sponsors / mondial` |

Postulats dérivés des fins (« Et si… »), déblocables et écrits par le chapitre 30 : `le_revenant` (joueur suspendu, retour), `le_repenti` (dirigeant banni, président amateur, Réputation 90, Propreté 0), `le_vautour` (entraîneur viré trois fois, consultant), `couple_d_affaires` (Camille gère ta carrière), `le_coach_cassette` (jouer Marcelo Loco). Chaque postulat reçoit dans son chapitre : un script d'ouverture (quatre ancres en S0 : slot 1, [10-11], 16, 17 ; trois en S1 ; deux rejouables en S2+), un réservoir d'au moins douze intrigues, dix manchettes, huit réactions, trois objectifs cachés, un `alarm_override` par jauge fragile.

### 3.3 Le graphe de transitions

Une Carte Destin au plus par saison, au Bilan ou à l'hiver, jamais si une jauge est sous 20 (sauf Parole ≥ +3). Refuser est toujours possible ; trois refus ferment la branche deux saisons. On ne redevient jamais joueur.

| De → Vers | Condition | Carte déclencheuse (qui parle) | Passation |
|---|---|---|---|
| Joueur amateur → Joueur pro | saison ≥ 2, Le coach > 50, forme correcte à la carte Recruteur | Barbier : « Je bosse pour Valdorne. Il y a un essai mardi. » | VESTIAIRE 50, TRIBUNES 40 + 0,3 × ancienne, DIRECTION 55, CAISSE 50 |
| Joueur amateur → Entraîneur (amateur) | 34 ans, ou blessure grave à 21 ans (« reconversion précoce », aussi vers arbitre plus tard) | Dédé : « Bon, on va pas se mentir. Tes genoux, c'est fini. Mon sifflet, il est à toi. » | |
| Joueur amateur → Président amateur | retraite, Le bistrot ≥ 50, Compte élevé | Pichon : « Le pain, c'est à cinq heures. Le club, c'est à toi. » | |
| Joueur pro → Entraîneur | âge ≥ 32 ou `genou`, drapeau `diplome` (intrigue *Le diplôme*) | Vukić : « Tes jambes parlent. La réserve n'a pas d'entraîneur. » (existant `roles.yaml`) | |
| Joueur pro → DS | âge ≥ 30, Le club ≥ 60, `capitaine` | Aulard : « Reste, mais en costume. » | |
| Joueur pro → Président amateur | retraite, Tribunes ≥ 50, Compte élevé | Gérard : « Le club de ton enfance te tend les bras. Et la caisse. » | |
| Joueur pro → Sélectionneur ou Fédération | drapeau `legende` (50 sélections et un titre majeur) | Legruet : la voie de la légende, très rare | |
| Adjoint (intérimaire) → Entraîneur | intérim gagné (deux victoires sur trois), ou offre d'un club de National | Aulard : « Le coach a été viré. Trois matchs. » | VESTIAIRE +10 (promotion interne) |
| Entraîneur → Sélectionneur | deux saisons Tribunes ≥ 60 et un titre ou une montée ; ou Legruet à +1 ; ou le sélectionneur en place vient d'être viré (Nouvelle) | Legruet : « On verra ça après le Congrès. Le Congrès, c'est demain. » | |
| Entraîneur → DS | Le président ≥ 70 après trois saisons au même club | Aulard : « Reste, mais en costume. » | |
| Entraîneur → Consultant (intermède) → Sélectionneur | limogeage avec Tribunes > 40 ; puis Audience > 85 | Vence : « Le plateau est à vous. » puis « Le peuple vous réclame. » | |
| Entraîneur (Sylvanie) → Sélectionneur de la Sylvanie | `bout_du_monde`, deux saisons | le ministre : « L'expatrié est adopté. » | |
| DS → Président pro | le président vend ou est destitué (Nouvelle), Tribunes ≥ 55 | Gégé : « Les supporters te réclament. La tribune n'oublie rien, surtout pas ceux qui achètent bien. » | |
| DS → Fédération | commission technique, Brissac à +2 | Brissac : « Les chiffres vous aiment. Le Congrès aussi, peut-être. » | |
| Président amateur → District → Ligue → Fédération | deux à trois saisons par étape, élections, Roux à +1 | Roux : « Le district te propose un siège. » | |
| Président amateur → Président pro | le club monte de quatre divisions en huit saisons (« l'ascension »), ou deux acteurs rachètent le club | Léa : « Vous confirmez ? Le village est en D2. » | |
| Président pro → Fédération | quatre saisons, Trésorerie ≥ 55, Actionnaires ≥ 55, trois alliés présidents à +2 (Malbec, Aulard, un troisième) | l'élection : Carte Destin double face, vote pondéré par Tribunes | |
| Président pro → Union Continentale | via le bloc des douze (« la voie ligue fermée »), Montoya à +2 | Montoya : « Assis ou debout ? » | |
| Sélectionneur → Union Continentale | quart de finale au moins et Le pays ≥ 60 | Bambini : « L'ancienne gloire au comité. Le football unit le monde. » | |
| Sélectionneur → Entraîneur de club | toujours, au Bilan | Malbec : « Entre présidents, on se comprend. Revenez au quotidien. » | |
| Sélectionneur → Ministre | fin *Le Ministre* (Aubert à +2) | Aubert : « Le stade, c'est de l'argent public. Le ministère aussi. » | fin |
| Fédération → Union Continentale | deux mandats, un président de confédération allié | élection | mandats de quatre ans |
| Union Continentale → FédéMonde | deux mandats, deux confédérations alliées | la Campagne (quatre promesses) puis le vote | |
| Instance → réélection ou palier suivant | tous les quatre ans, Carte Destin obligatoire | échec = *Battu au Congrès* | |
| Tout rôle → Porte de sortie | DIRECTION entre 10 et 25, une fois par rôle | « Tu vois le mur arriver. » : chômage (CAISSE −10, TRIBUNES −8, deux cartes avec Camille), puis une offre un cran en dessous | Parole −2 par promesse en cours, drapeau `fuyard` |
| Transitions forcées | faillite du club, décès du président (intérim forcé), coup d'État (Sylvanie), blessure de carrière, suspension longue, enquête judiciaire, le vestiaire te porte (adjoint), le sélectionneur tombe pendant le tournoi (adjoint de sélection), rachat du club, l'appel du pays (binational à 40 ans), Gérard a fui | chacune une carte à liseré or et une carte « Le monde réagit » | brainstorm 03 § 3.3 |

Ce qui se conserve d'un poste à l'autre : la Réputation, les trois étiquettes (Compétence, Loyauté, Propreté), les Relations et les Ennemis (−3), les titres, le compte perso, la Parole, les traits, l'objet, les drapeaux personnels (`diplome`, `genou`, `ami_ultras`, `divorce`, `international`, `capitaine`), l'âge, le nom de famille (la lignée). Ce qui est remis : les jauges (Passation), la Force (celle du nouveau club), les drapeaux de club. Trois personnages « te suivent » (les deux meilleures relations et la pire) : le chapitre 90 écrit leurs cartes de retrouvailles.

---

## 4. Les gabarits (à recopier tels quels)

### 4.1 La scène

```
### SCÈNE <id de carte>  —  <titre court>
**Rôle** : entraineur | joueur | … · **Intrigue** : <id d'arc> · **Étape** : n/N · **Moment** : saison (0 | 1 | 2+), fenêtre de créneaux · **Lieu** : … · **Conditions** : <when en langage du jeu ou en clair>
**<NOM DU PERSONNAGE>** *(fonction — expression : sourire | neutre | noir — didascalie courte)*
« Réplique de deux phrases, un tic, un nom une fois. »
← **<libellé ≤ 28>** — effets : jauges/relations/drapeaux en notation symbolique (+, ++, −, −−, relation.gege +1, set: pacte_gege, react: <id>) — *conséquence en une phrase*
→ **<libellé ≤ 28>** — effets : … — *conséquence*
**Traces** : … · **Réactions déclenchées** : … · **Lu plus tard par** : …
```

Règles d'importation : la réplique devient `text:` (≤ 200 caractères, avec le nom du locuteur et la didascalie courte en tête, comme les cartes existantes : « Gégé, écharpe au cou : « … » ») ; l'expression n'est pas un champ : c'est la relation qui la choisit, la didascalie sert à l'auteur pour écrire juste ; `{toi}` n'est permis que si le locuteur a une `adresse` ; le nom du joueur (`{prenom}`, `{nom}`, `{NOM}`) au plus une fois par carte, jamais dans un libellé, jamais sur deux cartes consécutives d'une même intrigue ; la conséquence devient `answer:` (une phrase, du présent, jamais une explication des effets) ; **Traces** liste les drapeaux posés qui ont une ligne d'Almanach (déclarés dans `traces:` de l'arc) ; **Réactions déclenchées** cite des ids `<rôle>.re.*` définis au gabarit § 4.4 ; **Lu plus tard par** cite les scènes, manchettes, alarmes ou set-pieces qui lisent la trace (c'est la couture, elle est obligatoire : une trace que personne ne lit est une erreur de build hors chantier). Un seul bouton = deux sorties identiques. Une scène de Nouvelle, de réaction ou d'alarme suit le même gabarit avec le champ **Moment** remplacé par sa mécanique (§ 4.4, § 4.6).

**Exemple de scène conforme** (existante, `content/cards/entraineur/arc_kop.yaml`) :

```
### SCÈNE en.kop.pacte  —  Le pacte de la craie
**Rôle** : entraineur · **Intrigue** : en.kop_qui_aime_trop · **Étape** : 3/5 · **Moment** : saison 0, créneaux [9,14] après l'étape « onze » · **Lieu** : le local, sous la Tribune Nord · **Conditions** : relation.gege >= 1
**GÉGÉ** *(capo, Tribune Nord — sourire — solennel, la main tendue)*
« Un pacte : le local rénové cette saison, et « {nom} » chanté dans toute la ville. La tribune n'oublie rien. Tape là. »
← **Je serre la main, promis** — effets : tribunes ++, parole +2, promise, set: pacte_gege — *Il grave la date sur le mur du local. À la craie, pour l'instant.*
→ **Pas de promesse en l'air** — effets : tribunes −, relation.gege −1, next: banderoles [5,9] — *Il garde la main tendue une seconde de trop. Puis il la range.*
**Traces** : pacte_gege · **Réactions déclenchées** : — · **Lu plus tard par** : en.kop.pacte_suite, une.promu.pacte, en_otage (epitaph_plus), grand_deballage (epitaph_plus)
```

### 4.2 La fiche personnage

```
## <NOM>  (`<id>`)
**Fonction** : … · **Genre** : m | f · **Âge en 1990** : … · **Camp** : terrain | direction | instances | selection | famille · **Fenêtre** : 1990-20xx, puis <statut> · **Suivant** : <qui prend sa place dans le monde>
**Tic** : « … » (et ses trois torsions autorisées)
**Désir** : … · **Blessure** : …
**Adresse** (sourire / neutre / noir) : entraineur : … · joueur : … · <autres rôles> : …
**Ce qu'il pense de toi** : à +2 … · à 0 … · à −2 …
**Paliers** : −3 → <id de carte de trahison> · +3 → <id de carte de faveur>
**Dans les rôles** : <rôle> : <fonction narrative, target d'apparitions par saison> · …
**Trajectoire 1990 → 2050** : une ligne par décennie
**Retrouvailles** : co.retrouvailles.<id>_sourire / _noir (deux répliques)
**Cartes propres** : 6 à 10 titres de scènes avec leur chapitre
```

### 4.3 La fiche d'intrigue

```
## INTRIGUE <id d'arc>  —  <Titre>
**Logline** : une phrase. · **Synopsis** : cinq à huit lignes, au présent.
**Rôle(s)** : … · **Postulat(s)** : … ou partagé · **Porteur** : <id> · **Cast** : … · **Thème** : argent | tribune | vestiaire | presse | corps | famille | mercato | instances | direction | absurde
**Saisons** : bucket "0" | "1" | "2+" · **Conditions d'entrée** : <if du pool> · **Exclusions** : … · **Rejouabilité** : jamais | replay {after, max} | ritual (variantes « encore » sur plays())
**Issues** → **Traces** → **Qui les lit** : issue_a → trace_x (ligne d'Almanach : « {annee} : … ») → lue par <scène, manchette, alarme, set-piece, if de pool>
**Séquencier** : étape 1 (fenêtre) → étape 2 [in a,b] → … ; variantes (première vraie gagne) ; une étape au moins glisse en saison suivante (at_season +1) ou justification
**Scènes** : 4 à 6 au gabarit § 4.1
**Épilogue** : effets à la clôture par abandon (club changé) et ligne d'Almanach
```

### 4.4 La réaction

```
### RÉACTION <rôle>.re.<qui>_<quoi>  —  <titre>
**Après** : <id de scène> (← | → | les deux) · **Famille** : relance | conséquence immédiate | tiers qui commente · **Conditions** : …
**<NOM>** *(fonction — expression — didascalie)*
« Deux phrases au plus. Un tic. »
← **<libellé>** — effets : petits (+ / −, relation ±1, set: …) — *conséquence*
→ **<libellé>** — effets : … — *conséquence*   (ou : un seul bouton)
```

Servie au tirage suivant, hors créneau ; jamais `end`, jamais drame, jamais de réaction en chaîne ; plafond quatre par saison ; le nom du joueur n'y figure pas si la scène précédente le portait.

### 4.5 La manchette de Une

```
### UNE une.<postulat|generic>.<mot>
**Journal** : quotidien | gazette | echo · **Priorité** : 0-4 · **Condition** : <when ; les traces de la saison par journal_has('…')> · **Sujet exclu des brèves** : <tag ou arc>
**Titre** : ≤ 44 caractères rendus (test : BRÉHAUT-LEMOINE / SAINT-ÉTOILE), en capitales, {NOM} ou {CLUB}/{VILLE} dans une manchette sur deux
**Sous-titre** : une à deux phrases, un tic cité entre guillemets si un personnage y parle
**Brève suggérée** : une ligne d'Almanach que l'intrigue doit avoir écrite
**Photo** : <id de scène> · **Réaction** : <co.re.… ou <rôle>.re.…> avec condition
```

### 4.6 La Nouvelle datée

```
### NOUVELLE co.nv.<annee>_<mot>  —  <titre>
**Année** : xxxx (servie entre xxxx et xxxx+1) · **Rôles** : … · **Arme** : <set: monde_…, ou poids ×2 d'une entrée de pool>
**<NOM>** *(fonction — didascalie)*
« Deux phrases : le monde bouge, et ce que ça change ici. »
**OK** — effets : un seul bouton, effet identique des deux côtés, petit — *conséquence*
```

### 4.7 La set-piece (beat moteur)

```
### SET-PIECE <beat>  (objective | aftermatch | gm_annonce | cup | bilan_verdict | bilan_contrat | bilan_carrefour)
**Rôle** : …
1. **Condition** : <when> — **Locuteur** : … — « texte » — libellés (optionnels) — conséquences (optionnelles)
2. …
n. **Secours** (sans condition) : « texte »
```

Les variantes lisent les traces, `fil_rouge`, `plays()`, `chars.*`, `relation.*`, `season`, `bilan.tenu` (Bilan seulement) ; zéro aléa ; la première vraie gagne ; la dernière est sans condition.

### 4.8 La fin

```
### FIN <id>  —  <Titre>
**Rôle** : … · **Cause** : <jauge> vide | pleine · choix · chaîne · objectif · âge · **Rareté** : commune | rare · **Dorée** : oui | non · **Partageable** : oui | non
**Épitaphe** : deux phrases, au passé composé ou au présent, qui nomment le joueur une fois ({prenom} {nom}) et accordent en genre ({pg, select, f{e} other{}})
**epitaph_plus** (≤ 2, la première vraie) : — si <when> : « seconde phrase » · — si <when> : « … »
**Et si…** : le postulat dérivé proposé en un tap (ou —)
**Almanach** : « {annee} · <titre>. »
```

### 4.9 L'anecdote (Almanach, détail de monde)

```
### ANECDOTE <chapitre>.<mot>  —  <titre>
**Type** : ligne d'Almanach | détail de décor | légende de club | objet | carte-légende · **Où elle apparaît** : <scène, Nouvelle, brève, épitaphe, Codex> · **Condition** : …
Texte : une à trois phrases, au présent ou au passé composé, ≤ 120 caractères si c'est une ligne d'Almanach.
```

### 4.10 Conventions d'ids

- Préfixes de rôle : `am.` joueur amateur, `jp.` joueur pro, `en.` entraîneur, `ds.` directeur sportif, `pr.` présidents (amateur et pro, distingués par `roles:`), `sl.` sélectionneur, `in.` dirigeant d'instance, `co.` partagé (deux rôles ou plus). Snake_case ASCII, sans accent, sans majuscule.
- Scène d'intrigue : `<préfixe>.<arc>.<etape>` (`en.kop.pacte`) ; variante : suffixe `_<variante>` (`en.kop.onze_froid`, `_encore`, `_sourire`, `_bache`).
- Script d'ouverture d'un postulat : `<préfixe>.<postulat>.<ancre>` (`en.promu.a1_inventaire`, `jp.pepite.p3_vente`).
- Arc (intrigue) : `<préfixe>.<mot_mot>` (`en.kop_qui_aime_trop`, `co.derby`, `sl.le_bus`).
- Réaction : `<préfixe>.re.<qui>_<quoi>` (`en.re.josiane_chauffage`, `co.re.josiane_a_lu`).
- Manchette : `une.<postulat|generic>.<mot>`.
- Nouvelle datée : `co.nv.<annee>_<mot>` ; Nouvelle non datée : `co.nouvelle.<mot>`.
- Alarme : `<préfixe>.alarme.<jauge>_<bas|haut>_<qui>` ; palier : `<préfixe>.<qui>.trahison_<mot>` / `faveur_<mot>` ; retrouvailles : `co.retrouvailles.<id>_<sourire|noir>` ; Fantôme : `co.fantome.<mot>`.
- Fin : `<préfixe court>_<mot>` comme les existantes (`en_bus`, `jp_panama`, `pr_ag`, `sl_minuit`, `in_taxi`, `ds_fronde`, `am_toro`, `pa_buvette` pour le président amateur) ; universelles sans préfixe (`grand_deballage`, `jubile`, `ta_loge`).
- Drapeaux (traces) : snake_case, un nom qui se lit comme un souvenir (`mbako_vendu`, `pacte_gege`), jamais un verbe à l'infinitif, jamais de chiffre.
- Objectifs cachés : `<postulat>_<mot>` (`promu_banc_gigi`).
- Set-pieces : par beat, pas d'id.

### 4.11 La notation des effets

`+` = 5, `++` = 10, `+++` = 18 (`content/balance.yaml`), négatifs de même ; jauges : `vestiaire`, `tribunes`, `direction`, `caisse` (on écrit le nom canonique, jamais le libellé du rôle) ; `force ±n` ; `parole ±n` et `promise` (promesse publique) ; `relation.<id> ±1|±2` ; `set: [drapeau]`, `clear: [drapeau]` ; `outcome: <issue>` ; `react: <id>` ou liste `[{card, if}]` ; `schedule: [{card, in: [a,b]}]` ; `next: {step, in}` ; `char: {<id>: {statut: club|staff|parti|vendu|retraite|rival}}` ; `club: {change: true, division: n}` ; `end: <fin>` ; `journal: {text, poids 1-3, tags}` (seulement si le drapeau n'est pas une trace déclarée). Une carte a de un à trois effets de jauge par côté ; un `+++` par carte au plus ; une carte de drame n'a qu'une sortie ou deux sorties graves.

---

## 5. Le plan des chapitres et l'attribution

Chaque chapitre est un fichier de `docs/bible/`, écrit par une plume, relu par une autre (la relecture croisée est dans le tableau). Tous suivent les gabarits § 4 et lisent § 5.2 avant d'écrire : les traces transversales sont le contrat entre chapitres.

| Fichier | Contenu obligatoire | Nombres attendus | Personnages qu'il fait parler | Traces qu'il lit (§ 5.2) | Relu par |
|---|---|---|---|---|---|
| `01_personnages_terrain.md` | fiches complètes (§ 4.2) des personnages de camp `terrain`, `selection` et `famille` : Gégé, Vukić, Bréhaut, Sabatier, Camille, Clow, Mbako, Vecchio, mère de Mbako, Loco, Klopf, Rouvier, Dembo, Fauvel, Brissac, Gérard, Dédé, Paulette, Sacha ; pour chacun : trajectoire 1990-2050, adresse dans les huit rôles, paliers ±3 (deux scènes), retrouvailles (deux répliques), six à dix cartes propres | 19 fiches ; 38 scènes de palier ; 38 répliques de retrouvailles ; ≥ 6 cartes propres par fiche (titre + une ligne, ou scène complète pour les trois premières) | tous ceux de la liste | mbako_vendu, mbako_lance, pacte_gege, onze_du_virage, gigi_staff, genou_opere, flacon_b, camille_ici, divorce, clow_ingrat, brassard_gigi, bus_menace, derby_perdu, sacha_nee | 02 |
| `02_personnages_direction_instances.md` | fiches des personnages de camp `direction` et `instances` : Fardelli, Ménèche, Aulard, Aubert, Legruet, Nassir, Josiane, Léa, Bambini, Dauzat, Vialat, Amsel, Colline, La Plume, Vence, Solvang, Barbier, Malbec, Montoya, Dupuis, Pichon, Roux ; mêmes rubriques ; plus la table « qui préside quoi, quand » (Fédération, Ligue, Union, FédéMonde, ministère, 1990-2050) | 22 fiches ; 44 scènes de palier ; 44 répliques de retrouvailles ; la table des mandats | tous ceux de la liste | naming_signe, club_actif, enveloppe_promise, fede_dossier, president_ami, selection_refusee, vote_achete, diplome_arrange, commission_lettre, ligue_fermee_signee, mondial_desert, aubert_ministre | 01 |
| `10_scenarios_joueur.md` | joueur amateur et joueur pro : pour chacun des postulats `pepite`, `fin_de_contrat` (reprendre et compléter le plan de la spec § 4.3-4.4 sans le contredire), `village_endette`, `lache_academie`, `retour_croises`, `binational`, `banc_dore`, `capitaine_dechu` : script d'ouverture (S0 : 4 ancres ; S1 : 3 ; S2+ : 2), réservoir, réactions, manchettes, objectifs ; le tutoriel (douze cartes fixes de Trébignac avec Josiane et Vecchio) | par postulat : 1 script (9-11 scènes), ≥ 12 intrigues (4-6 scènes chacune, fiche § 4.3), ≥ 8 réactions, ≥ 10 manchettes, 3 objectifs ; 12 scènes de tutoriel ; 20 temps forts de Grand Match (famille joueur) | Fardelli, Vukić, Aulard, Bréhaut, Dembo, Mbako, Vecchio, Sabatier, Rouvier, Léa, Vence, Gégé, Camille, Solvang, Barbier, Dédé, Pichon, Gérard, Dupuis, Paulette, Legruet, Fauvel, Nassir | pose : genou_opere, capitaine, international, binational_choisi, offshore, mouton_noir, special, enfant_du_pays, essai_pro, patron_furieux ; lit : mbako_vendu (il joue contre toi), selection_refusee, pacte_gege (« ton nom sur la bâche ») | 11 |
| `11_scenarios_entraineur.md` | `promu` et `interimaire` : ne pas réécrire ce qui existe (85 + cartes) mais **compléter** le réservoir de la spec § 4.1-4.2 (les intrigues marquées « à écrire » : salaires en retard, espion dans la haie, cote du promu, cartons de Camille, brassard de Bréhaut, l'adjoint qui dîne, l'enveloppe, la pharmacie, le fils du président, le retour de Mbako, Gigi au staff, le dossier Ménèche, la commission de discipline ; tout le réservoir de l'intérimaire) ; puis `bout_du_monde`, `six_mois`, `section_feminine` en entier | promu : 13 intrigues à écrire ; intérimaire : script + 9 intrigues propres + réactions + manchettes + objectifs ; trois postulats nouveaux complets (grille standard) ; 20 temps forts (famille banc) | Aulard, Josiane, Vukić, Bréhaut, Vecchio, Mbako, mère de Mbako, Gégé, Nassir, Fardelli, Ménèche, Léa, Clow, Sabatier, Rouvier, Dembo, Loco, Klopf, Legruet, Brissac, Malbec, Camille, Aubert | pose : pacte_gege, onze_du_virage, mbako_vendu, mbako_lance, naming_signe, club_actif, gigi_staff, enveloppe_promise, flacon_b, salaires_retard, vukic_dauphin, clow_ingrat, diplome_arrange, derby_perdu, bus_menace ; lit : genou_opere, capitaine, president_ami, fede_dossier | 10, 12 |
| `12_scenarios_directeur_sportif.md` | `vendre_trente`, `coach_intouchable` : le mercato comme sous-paquet dense (deux fenêtres par saison, six à huit offres concrètes chacune), les quatre agents persistants (Fardelli le bulldozer, Solvang la discrète, la mère de Mbako, un père-agent générique), l'Inspecteur, le coach (Loco ou Klopf selon le postulat), le fax de 23 h 58, l'algorithme contre l'œil (Barbier) | grille standard × 2 ; plus 24 cartes d'offres de mercato (12 par fenêtre, avec variables {joueur}, {prix}, {agent}) ; 8 alarmes ; 8 fins (gabarit § 4.8) | Aulard, Nassir, Fardelli, Solvang, mère de Mbako, Barbier, Loco, Klopf, Bréhaut, Josiane, Vialat, Ménèche, Vence, Dembo, Mbako, Malbec | pose : commission_occulte, fax_rate, algorithme_adopte, dembo_vendu, coach_demission ; lit : mbako_vendu, naming_signe, club_actif, enveloppe_promise, genou_opere (visite médicale), president_ami | 11, 13 |
| `13_scenarios_president.md` | président amateur (`fusion_imposee`, `coupe_du_village`) et président pro (`geant_dechu`, `rachete_fonds`) : la buvette, la mairie, Gérard, Dupuis, la Coupe qui amène Capitale FC ; puis les actionnaires, l'entraîneur qu'on vire ou qu'on confirme, Gégé sous les fenêtres, Qatalyst, la Ligue fermée (huit cartes de six heures), le sponsor qui devient propriétaire vu du bureau, les écoutes, la valise | grille standard × 4 ; la chaîne « 48 heures » (8 scènes) ; 16 fins (8 + 8, gabarit § 4.8) ; 20 temps forts (familles président et amateur) | Aubert, Roux, Gérard, Dédé, Dupuis, Pichon, Paulette, Vecchio, Josiane, Léa, Nassir, Malbec, Montoya, Bréhaut (DS), Gégé, Vukić/Klopf/Loco (l'entraîneur), Ménèche, La Plume, Vialat, Amsel, Colline, Fardelli, Camille, Sacha | pose : fusion_signee, naming_signe (côté bureau), club_actif, ligue_fermee_signee, commission_lettre, ecoutes, coach_vire, president_ami, stade_promis, gerard_parti ; lit : pacte_gege (Gégé te rappelle le pacte du coach), mbako_vendu, enveloppe_promise, fede_dossier, aubert_ministre, boucher_sponsor | 12, 14 |
| `14_scenarios_selectionneur.md` | `pays_emergent`, `apres_fiasco` : le calendrier en années civiles (quatre fenêtres, une carte Liste par fenêtre : deux dilemmes), la chaîne Tournoi (poules en Carte Match, chaque tour en Grand Match, sans respiration), le bus, l'avion des primes, le binational, l'hymne, le ministre, le verre de vin, la demande en mariage, le fils du ministre, l'ancien sélectionneur consultant qui te savonne la planche | grille standard × 2 ; 8 cartes Liste (deux par fenêtre) ; la chaîne Tournoi (12 scènes : trois tours × trois temps forts + annonce + après) ; 8 fins ; 20 temps forts (famille sélection) | Legruet, Brissac, Aubert (ministre après 2002), Fauvel, Mbako, Vecchio, Dembo, Klopf (l'adversaire), Sabatier, Rouvier, Vence, Ménèche, Fardelli, Malbec, Josiane, Camille, Sacha, Bambini (la remise du trophée), Dauzat (le contrat de minuit) | pose : selection_refusee, bus_descendu, mutinerie_matee, hymne_impose, binational_bloque, fils_du_ministre, grand_match_perdu ; lit : international, binational_choisi, capitaine, genou_opere, mbako_vendu, gigi_staff (Gigi descend le premier), president_ami | 13, 15 |
| `15_scenarios_instance.md` | `heritage_empoisonne`, `sous_tutelle` (Fédération), `tournoi_desert` (Union), `elu_surprise` (FédéMonde) : les mandats de quatre ans, quatre dossiers par an (Cartes Événement double face : arbitrage vidéo, calendrier, droits télé, attribution du Mondial, 48 équipes, égalité des primes, un Mondial tous les deux ans, les ouvriers des chantiers, la grève mondiale), le Congrès annuel, la Campagne (quatre promesses à quatre confédérations), la réélection ; les valises de l'hôtel du Lac, le raid à l'aube, la variante lanceur d'alerte | grille standard × 4 ; 16 Cartes Événement double face ; la Campagne (4 scènes) ; la chaîne des valises (6 scènes) ; 8 fins ; 20 temps forts (famille instance : le tirage au sort en direct, le trophée à côté du dictateur, la panne de la vidéo en finale) | Legruet, Aulard, Malbec, Roux, Bambini, Dauzat, Josiane, Amsel, Vialat, Colline, La Plume, Léa, Vence, Nassir, Montoya, Fauvel (le syndicat), Brissac, mère de Mbako (l'agente des vingt), Aubert (ministre), Sacha (l'ONG), Camille | pose : fede_dossier, vote_achete, mondial_desert, video_adoptee, ligue_fermee_signee (côté Union), reforme_votee, radie, lanceur_alerte ; lit : president_ami, enveloppe_promise, flacon_b, ecoutes, commission_lettre, selection_refusee, hymne_impose, diplome_arrange | 14, 20 |
| `20_journaux.md` | pour chacun des trois journaux et de Télé-Stade : la voix (dix règles de style par titre), les rubriques, les plumes, les prix par décennie ; les manchettes génériques (tous rôles) ; les manchettes de chaque postulat nouveau (≥ 10 chacune, dont ≥ 3 sur des traces) ; les Unes de fin de carrière (une par famille de fin) ; la météo de la Marmite (les quatre états, dix formulations chacune) ; les brèves types ; les « on nous écrit » | 4 voix ; ≥ 20 manchettes génériques ; ≥ 10 par postulat nouveau (21 postulats × 10 = 210, coordonnées avec les chapitres 10-15 qui en fournissent les titres et les conditions : le chapitre 20 harmonise, ne réécrit pas) ; 12 Unes de fin ; 40 lignes de météo ; 30 brèves | Ménèche, Léa, La Plume, Vence, Ozanne (voix), le Rosé (voix), le stagiaire de l'Écho (voix) | toutes les traces de § 5.2 (une manchette par trace au minimum) | 15, 31 |
| `30_setpieces_alarmes_fins.md` | les set-pieces des sept beats pour chacun des huit rôles (variantes lues sur les traces et le fil rouge, secours inclus) ; les alarmes (deux par jauge par rôle, huit rôles, avec `alarm_overrides` par postulat) ; le piège du centre (dix cartes) ; toutes les fins au gabarit § 4.8 (les 91 plaques du brainstorm § 2.9 dont 23 existent : ne pas réécrire les 23, écrire les autres avec `epitaph_plus`) ; les postulats dérivés (« Et si… ») ; les Cartes Destin de transition (une par arête de § 3.3, avec la carte « Le monde réagit ») | 8 rôles × 7 beats × ≥ 5 variantes = 280 lignes ; 64 alarmes ; 10 cartes du piège ; ≈ 68 fins nouvelles + 23 `epitaph_plus` de relecture ; 5 postulats dérivés ; ≈ 30 Cartes Destin | tous les patrons (Aulard, Fardelli, Legruet, Aubert, Nassir, Bambini, Roux, Malbec), les chœurs (Josiane, Vukić, Gérard, Dauzat), Ménèche (« Ton pari »), Vence (le plateau), Sabatier (le médecin après 70 ans) | toutes les traces de § 5.2 ; en particulier vukic_dauphin, finale_gigi, pacte_gege, mbako_vendu, club_actif, ecoutes, vote_achete, radie, divorce, sacha_nee | 31, 90 |
| `31_anecdotes_et_almanach.md` | les Nouvelles datées 2001-2050 (les 22 de 1990-2000 existent dans la spec : ne pas les réécrire, les compléter jusqu'à 2050, deux par an au plus, une par demi-saison, chacune arme quelque chose) ; les gabarits d'Almanach (lignes moteur : les 11 existent, écrire 40 gabarits de plus par type d'événement) ; les cartes-légendes (une par saison au plus) ; les anecdotes de monde (légendes de clubs, objets, le sanglier, le fax, le seau, Mamie Paulette, le stade Gérard-Blanchet) ; « L'Almanach du Ballon » (la chronique imprimée : dix entrées types par décennie) ; les épitaphes de personnages (l'enterrement de chacun des 41, une ligne) | ≥ 60 Nouvelles datées 2001-2050 ; 40 gabarits d'Almanach ; 12 cartes-légendes ; ≥ 30 anecdotes (gabarit § 4.9) ; 41 lignes d'enterrement | tous (une Nouvelle = un locuteur) | lit toutes les traces de monde (monde_*) et en pose : monde_bosquet, monde_1998, monde_video, monde_flux, monde_ligue_fermee, monde_grève, monde_franchises | 30, 90 |
| `90_interconnexions.md` | la matrice complète : pour chaque trace de § 5.2 (et celles que les chapitres auront ajoutées), qui la pose (scène, chapitre), qui la lit (scène, manchette, alarme, set-piece, fin, chapitre), sa ligne d'Almanach ; les cartes de retrouvailles (deux par personnage à statut, harmonisées avec 01 et 02) ; les cartes du Fantôme (quatre gabarits par type de fin) ; les cartes de mémoire des clubs (accueil à −3, 0, +3 ; « Persona non grata » ; « Le retour du fils prodigue ») ; le Nemesis (trois cartes hostiles templatées par rôle) ; la lignée (Sacha héritière, « Trois générations », le nom qu'on chante ou qu'on insulte) ; les trois carrières de référence du brainstorm 03 § 3.6 rejouées scène par scène (la voie de la légende, le fusible éternel, le rat de tribune) comme tests d'intégration | matrice de ≥ 60 traces (40 imposées + ajouts) ; 82 répliques de retrouvailles ; 16 cartes de Fantôme ; 9 cartes de mémoire ; 24 cartes de Nemesis ; 6 cartes de lignée ; 3 séquenciers de carrière (30 à 50 scènes citées chacun, par id) | tous | toutes ; le chapitre 90 est le relecteur final de la couture : il refuse toute trace posée et jamais lue, et toute trace lue et jamais posée | le showrunner |

Rythme et volume par intrigue : quatre à six scènes, dont une au moins glisse en saison suivante ; une variante au moins lit une trace d'une **autre** intrigue (de préférence d'un autre chapitre : c'est la couture inter-rôles) ; une réaction par intrigue au moins ; une manchette par issue forte. Une intrigue sur trois est légère (thème `absurde` ou `famille`), une sur dix est dramatique (jamais en S0, jamais deux d'affilée dans un réservoir).

### 5.2 Les quarante traces transversales

Ce sont les drapeaux que **plusieurs chapitres** posent ou lisent. Le nom est fixé ; la ligne d'Almanach est écrite par le chapitre qui pose (au gabarit `{annee} : …`, ≤ 120 caractères) ; le chapitre 90 tient la matrice. Les traces déjà déclarées dans `content/flags.yaml` gardent leur nom.

| # | Trace | Posée par (chapitre · scène) | Lue par (chapitres · où) |
|---|---|---|---|
| 1 | `mbako_vendu` ∃ | 11 · en.prodige (vendu), Nouvelle de descente | 10 (il joue contre toi), 12 (le prix de référence), 13 (le retour, la statue), 14 (sa mère négocie la prime), 20 (« Trente millions et un gamin »), 30 (en_decoupe plus) |
| 2 | `mbako_lance` ∃ | 11 · en.prodige | 01 (Mbako à +3 à vie), 14 (« vous m'avez lancé »), 20 |
| 3 | `mbako_garde` ∃ | 11 | 12 (l'option Qatalyst), 20 |
| 4 | `pacte_gege` ∃ | 11 · en.kop.pacte | 10 (la bâche à ton nom), 13 (Gégé réclame le local rénové au président), 20, 30 (en_otage, grand_deballage) |
| 5 | `onze_du_virage` ∃ | 11 · en.kop.onze | 13 (Gégé veut la compo du président), 20, 30 (en_copain, en_banderole) |
| 6 | `ami_ultras` ∃ | 10, 11 · le local | 13 (les abonnements à cinq écus), 15 (le compte anonyme), 30 (en_otage) |
| 7 | `naming_signe` ∃ | 11 · en.nassir (naming) ; 13 · Arena Dupuis / Arena Qatalyst | 10 (« le stade s'appelle comme une boisson »), 12, 13, 20 (« ARENA QATALYST »), 31 (Nouvelle S1) |
| 8 | `club_actif` ∃ | 11, 13 · le rachat | 12 (budget illimité, conditions), 13 (« Notification »), 15 (le fair-play financier), 30 (en_placard plus) |
| 9 | `club_a_lancienne` ∃ | 11, 13 · refus de toute la chaîne Nassir | 13 (trait « Club à l'ancienne »), 20, 30 (objectif) |
| 10 | `nassir_pret` ∃ | 11, 13 | 12, 30 (en_coupable plus) |
| 11 | `gigi_staff` ∃ | 11 · en.vieux_gardien (staff) | 01 (Vecchio à 45), 14 (il descend le premier du bus), 20, 30 (en_retraite plus) |
| 12 | `finale_gigi` ∃ | 11 · A5 | 30 (jubile plus, aftermatch), 20 |
| 13 | `vecchio_promis` ∃ | 11 | 11 (A5 variante), 20 |
| 14 | `enveloppe_promise` ∃ | 11 · en.enveloppe ; 13 · côté président | 11 (la commission de discipline), 13 (Malbec : « entre présidents »), 15 (le dossier au bureau), 20 (« LA VALISE DE {VILLE} »), 30 (en_valise) |
| 15 | `enveloppe_refusee` ∃ | 11, 13 | 02 (Fardelli à −1), 15 (Colline te regarde autrement), 30 (trait Intègre) |
| 16 | `flacon_b` | 10, 11 · co.pharmacie (contrôle positif) | 11 (commission de discipline), 14 (le joueur suspendu dans la liste), 15 (la commission antidopage, Sabatier témoin), 20, 30 (fin *Le flacon B*, postulat `le_revenant`) |
| 17 | `pharmacie_propre` | 10, 11 | 02 (Sabatier ennemi), 14 |
| 18 | `salaires_retard` ∃ | 11 · en.salaires ; 13 · côté trésorerie | 10 (le distributeur), 11 (alarme vestiaire, twist intérimaire), 12 (masse salariale), 20 (« PAYÉS EN RETARD, SAUVÉS À TEMPS ») |
| 19 | `vukic_dauphin` ∃ | 11 · en.adjoint_dine | 10 (Vukić devenu coach ailleurs), 11 (A6, script), 30 (en_sms plus, en_dauphin, set-piece objective) |
| 20 | `clow_ingrat` ∃ | 11 · en.mentor_clow | 01 (pas de testament ; « le fils de Clow » refuse ta lignée), 10 (le stage du diplôme), 20, 90 |
| 21 | `diplome` ∃ / `diplome_arrange` | 10 (jp.diplome_joueur), 11 (en.diplome) / 11 · la dérogation arrangée | 30 (Carrefour), 15 (Brissac ressort le dossier), 11 (dossier Ménèche), 20 (« LE COACH SANS PAPIER ») |
| 22 | `derby_perdu` / `derby_gagne` | 10, 11, 13 · co.derby | 01 (Gégé, Paulette), 20 (« LA VALLÉE A UN PATRON »), 30 (gm_annonce variante « le virage te suit »), 90 (mémoire des clubs) |
| 23 | `camille_ici` | 10, 11 · co.cartons_camille | 01 (paliers de Camille), 30 (objective variante « Josiane sert le café à l'hôtel du club »), 20 |
| 24 | `divorce` ∃ | 01 · palier −3 de Camille | tous (toutes les cartes `famille` lisent `!divorce`), 30 (compte perso ÷ 2, plus de carte de repos), 90 (Sacha à −1) |
| 25 | `sacha_nee` | 01 · la carte Naissance (Camille) | 10 (héritière à la Succession), 13 (« Papa, tu as tweeté »), 14 (elle ne chante pas l'hymne), 15 (l'ONG), 90 (lignée) |
| 26 | `genou_opere` / `genou` ∃ | 10 · jp.genou_parle (bistouri) | 10 (F2, F3), 12 (visite médicale cachée), 14 (le joueur en délicatesse avec son genou), 30 (Carrefour, *Les croisés*), 20 (« LE GENOU DE {NOM} A PARLÉ ») |
| 27 | `capitaine` ∃ | 10 · le brassard | 11 (le capitaine vieillissant si tu es entraîneur ensuite), 14 (le capitaine de la sélection), 30 (jp_porteparole plus, jp_fils plus) |
| 28 | `international` ∃ | 10 · la liste des 26 | 14 (« vous avez été international, vous savez »), 15 (la voie de la légende), 30 (jp_siffle plus, jp_panama plus), 20 (« {NOM} EN BLEU COBALT ») |
| 29 | `binational_choisi` (valeur `cobalts` \| `kambara`) | 10 · jp.selection | 14 (l'appel du pays à 40 ans, le Kambara en face), 15 (les fédérations se disputent), 20 (« IL A CHOISI L'AUTRE MAILLOT ») |
| 30 | `selection_refusee` | 10 · forfait pour le club ; 14 · le joueur qui refuse ta liste | 02 (Legruet à −1), 14 (« on ne dit pas non deux fois »), 15 (le règlement des forfaits), 20 |
| 31 | `special` ∃ | 10, 11 · la première conférence | 10 (le vestiaire a lu), 20 (« LE SPÉCIAL »), 30 (jp_mouton plus, Destin) |
| 32 | `offshore` ∃ | 10 · jp.contrat_image ; 12 · commission offshore | 15 (les documents de La Plume), 30 (jp_panama, jp_sandwich plus), 20 |
| 33 | `president_ami` | 11, 12 · DIRECTION ≥ 80 trois saisons ou `homme_president` ∃ | 13 (Aulard te traite en égal, ou te rappelle qui t'a fait), 14 (Legruet se méfie de l'homme d'Aulard), 15 (le bloc Aulard au Congrès), 30 (sl_homme_president, en_placard plus) |
| 34 | `fede_dossier` | 15 · le dossier ouvert sur toi ou par toi ; 11 · la commission de discipline | 02 (Dauzat, Amsel), 13 (la rétrogradation administrative), 14 (Legruet te lâche), 20 (La Plume), 30 (fins judiciaires) |
| 35 | `vote_achete` | 15 · le vote du désert | 15 (l'hôtel du Lac, le raid), 02 (Bambini à +2 puis « choqué »), 20 (« DIX-HUIT MILLIONS DE PAGES »), 30 (in_raid, *La radiation*, postulat `le_repenti`) |
| 36 | `mondial_desert` | 15 · l'attribution | 14 (le Mondial d'hiver : le calendrier de la sélection), 13 (le club frère à Al-Dorado), 31 (Nouvelle 2022), 20 |
| 37 | `ligue_fermee_signee` | 13 · les 48 heures ; 15 · côté Union | 13 (cartes de mépris), 14 (exclure leurs joueurs des sélections), 15 (le bloc des douze), 90 (l'initiateur devient ennemi de la lignée), 20, 30 (fin *La Ligue fermée*) |
| 38 | `ecoutes` | 13 · le Téléphone rouge | 15 (le désignateur d'arbitres, Colline), 02 (Amsel, La Plume : « quatre mille pages »), 30 (fin *Les écoutes*, titres barrés au Panthéon) |
| 39 | `commission_lettre` | 13 · deux soldes négatifs ; 12 · masse salariale | 11 (le coupable désigné), 12 (interdiction de recruter), 13 (rétrogradation), 20 (« {VILLE} A DE L'ARGENT. D'OÙ ? »), 30 (pr_commission) |
| 40 | `aubert_ministre` (monde) | 31 · Nouvelle 2002 | 13 (le stade, la subvention nationale), 14 (le ministre veut venir dans le vestiaire, c'est elle), 15 (la tutelle), 30 (fin *Le Ministre*), 02 |

Traces de monde posées par les Nouvelles datées (chapitre 31), lues par tous : `monde_bosquet` (1995), `monde_1998`, `monde_video` (2016), `monde_flux` (2007), `monde_ligue_fermee` (2019), `monde_greve` (2026), `monde_franchises` (2040), `monde_ecus` (2002). Traces déjà déclarées et à réutiliser plutôt qu'à doubler : `bus_menace`, `otage_kop`, `homme_president`, `boucher_sponsor`, `fidele`, `parti_tete_haute`, `tribune_a_renover`, `presse_franc`, `pari_promu`, `pari`, `vitamines`, `galactique`, `pisteur`, `mutinerie`, `porte_ouverte`. Toute trace nouvelle qu'un chapitre invente doit être **lue par un autre chapitre** avant d'être livrée, et inscrite dans la matrice du chapitre 90.

---

## 6. Les interdits et la check-list de relecture

### 6.1 Les interdits

1. **Aucun nom réel** : personne (joueur, entraîneur, président, dirigeant, journaliste, ministre), club, ville réelle, stade, compétition, marque, chaîne, journal, pays. Les noms de la table § 1.3 et de `content/names/fr.yaml` sont les seuls autorisés ; un nouveau nom se déclare au chapitre 90. « Paris Capitale FC » se lit « Capitale FC ».
2. **Aucun fait réel transposé** de manière reconnaissable : pas de date qui colle à un événement réel, pas de score célèbre, pas de phrase célèbre. Les anecdotes du brainstorm 04 § 4.4 sont des *situations* (la main, le bus, les valises, la ligue fermée) : on les écrit sans leur décor réel, avec nos villes, nos années, nos personnages ; la spec § 1.5 a déjà remplacé trois Nouvelles pour cette raison, on continue dans cet esprit. Un scandale ne s'attache jamais à un personnage qui partage deux traits avec quelqu'un de réel.
3. **Aucun identifiant de modèle, d'outil ou de génération** nulle part, pas même en commentaire.
4. **Longueurs** : réplique ≤ 200 caractères (cible 160), deux phrases ; libellé ≤ 28 caractères, verbe à la première personne, jamais « Oui / Non » ; manchette ≤ 44 caractères rendus ; ligne d'Almanach ≤ 120 ; épitaphe deux phrases ; `answer` une phrase.
5. **Un tic par réplique**, jamais deux ; le tic peut être tordu, jamais absent trois cartes de suite pour un même personnage.
6. **Un nom une fois** : le nom du joueur au plus une fois par carte, jamais dans un libellé, jamais deux cartes de suite ; le nom d'un autre personnage une fois par réplique.
7. **Pas de chiffre de relation, de jauge ou de probabilité** dans un texte ; la relation se lit sur le visage et dans l'adresse ; « SÛR / ÉQUILIBRÉ / RISQUÉ » sur les temps forts est la seule information chiffrée du jeu.
8. **Pas d'explication dans les conséquences** : l'`answer` raconte ce qui se passe (« Il range l'écharpe. Le mur garde la craie. »), jamais ce que ça fait aux jauges (« Les tribunes baissent »).
9. **Le personnage parle, pas le narrateur** ; quand le narrateur parle (Nouvelle, set-piece, épitaphe), il tutoie.
10. **Sensibilité** : pas de drame gratuit ; le drame (blessure de carrière, deuil, dépression, tribune vétuste) est rare, sobre, sans blague, jamais en première saison, jamais deux d'affilée, jamais partagé en Une quand il est mortel ; pas de blague sur le corps d'un joueur blessé, sur une origine, sur une religion (le jeûne se traite avec respect), sur le genre (la section féminine est écrite avec le même sérieux que le reste) ; pas d'allusion à une personne existante ; pas d'injure dans un libellé ; la corruption, le dopage, les paris sont des situations de satire, jamais des modes d'emploi.
11. **Pas de contradiction avec l'existant** : les 17 personnages gardent nom, tic, camp, adresse ; les quatre postulats gardent ids et années ; les fins existantes gardent titre et épitaphe ; une scène qui reprend une carte existante la cite par id et n'en change que ce que le gabarit permet (variante, réaction, trace).
12. **Pas de monnaie réelle** : francs puis écus ; jamais euro, dollar, livre.
13. **Pas de rail** : toute scène a deux sorties jouables (sauf Nouvelle, réaction à un bouton, drame) ; aucune sortie n'est « la bonne ».

### 6.2 La check-list de relecture (à cocher avant livraison, par scène puis par chapitre)

**Par scène**
- [ ] L'id suit § 4.10 ; le rôle, l'intrigue, l'étape, le moment, le lieu, les conditions sont remplis.
- [ ] Le locuteur existe (§ 2) ; sa fonction et son camp sont ceux de l'époque de la scène ; son statut permet qu'il parle (un personnage `parti` téléphone).
- [ ] Deux phrases, un tic, un nom une fois, ≤ 200 caractères, présent de l'indicatif ; la première phrase pose, la seconde demande.
- [ ] Deux libellés ≤ 28, première personne, distincts, sans « Oui / Non », sans le nom du joueur.
- [ ] Effets en notation § 4.11 ; un à trois effets de jauge par côté ; un `+++` au plus ; une relation ±1 (±2 exceptionnel) ; la conséquence n'explique pas.
- [ ] Les traces posées sont déclarées et **lues** quelque part (« Lu plus tard par » n'est pas vide) ; les réactions citées existent au gabarit § 4.4.
- [ ] `{toi}` seulement si le locuteur a une adresse ; `{NOM}` seulement en capitales de journal ou de bâche.
- [ ] Aucun nom réel, aucun fait réel reconnaissable, aucune monnaie réelle, aucun chiffre de relation ou de jauge.
- [ ] Le ton : tendre avec le ballon, féroce avec le business ; si c'est un drame, il est sobre, unique dans l'intrigue, hors S0.
- [ ] La scène tient sans le chapitre : un intégrateur qui ne l'a pas lu peut la copier dans un YAML.

**Par intrigue**
- [ ] Logline, synopsis, porteur ∈ cast, thème fermé, issues ≥ 2, traces ≥ 1, séquencier avec fenêtres.
- [ ] Quatre à six scènes ; une étape au moins glisse en saison suivante ; variante « encore » si rejouable ; aucune carte `once` dans une intrigue rejouable.
- [ ] Une variante lit une trace d'une autre intrigue, de préférence d'un autre chapitre.
- [ ] Une réaction au moins ; une manchette par issue forte ; l'épilogue par abandon est écrit.
- [ ] Chaque issue est atteignable par un chemin de swipes ; aucune issue n'est « la bonne ».

**Par chapitre**
- [ ] Les nombres de § 5.1 sont atteints (scripts, intrigues, réactions, manchettes, objectifs, anecdotes).
- [ ] Toutes les traces de § 5.2 attribuées au chapitre sont posées et/ou lues ; les traces nouvelles sont déclarées au chapitre 90 avec un lecteur.
- [ ] Chaque personnage à statut convoqué par § 2.4 parle au moins une fois par postulat ; aucun personnage ne parle hors de sa fenêtre.
- [ ] Les années sont cohérentes avec § 1.1 (pas de vidéo avant 2016, pas d'écus avant 2002, pas de Flux avant 2007, pas de fax après 2010).
- [ ] Le ratio 60 / 30 / 10 (léger / stratégique / drame) est respecté à l'échelle du réservoir ; deux drames ne se suivent jamais.
- [ ] Relecture croisée faite par le chapitre indiqué en § 5.1 ; les remarques sont intégrées ou tranchées par le showrunner ici, jamais dans le chapitre.
