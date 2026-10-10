# FUSIBLE — Les dix histoires

*La bible du livre : dix romans noirs, une ville, soixante ans de football.*

> Aubérive tient en deux cents mètres de côté. Une rivière, un pont de pierre, un stade au bord de l'eau, une usine qui ferme, une laverie dont le néon clignote, un club privé sans poignée à la porte, un cimetière où le Racing a son caveau. Dix personnes y entrent, à dix époques, par dix portes : deux entraîneurs, deux joueurs, une directrice et un directeur sportifs, un président et une présidente, un sélectionneur et une sélectionneuse. Aucune n'en sort comme elle y est entrée.

---

## 0. Ce que ce livre est

Le porteur du projet a passé commande en ces termes : « des agents avec vingt ans d'expérience dans l'écriture de polars sombres, très sombres et parfois un peu étonnants comme dans *Hotline Miami*, écrivent 10 histoires bien distinctes en prenant en compte tout ce qui est possible de faire dans le jeu […] et que ces 10 histoires soient implémentées dans le jeu, comme les 10 histoires qui figureront à la sortie du jeu… comme si nous commercialisions un livre pour vendre l'histoire. Il faut que chaque histoire dure environ 1 h, pour que la session de jeu soit de 10 h au minimum si le joueur joue en ligne droite sans les histoires secondaires. »

Ce document est ce livre, au stade de sa bible. Il ne contient pas encore les cartes : il contient tout ce qu'il faut pour les écrire. Dix auteurs prendront chacun une histoire, l'écriront en entier à partir de sa fiche, puis l'implémenteront (arcs, cartes, fins, Unes, paroles de la ville, missions). Ce qui est fixé ici ne se rediscute pas dans une histoire ; ce qui n'y est pas est ouvert, à condition de tenir la règle commune (§ 1) et la charte d'écriture (`docs/bible/charte_histoire.md`), qui fait loi pour chaque réplique.

Chaque histoire est un livre : elle a une quatrième de couverture, un genre, un mécanisme qui n'appartient qu'à elle, un coupable ou une vérité qui ne ressemble à aucune autre, trois saisons au moins, un acte final et plusieurs fins méritées. Le joueur qui en finit une doit pouvoir dire ce qui s'est passé à Aubérive, et qui l'a fait.

**Comment lire.** Le § 1 est la règle commune : le ton, ce qu'on ne montre jamais, la ville, le temps, la façon dont les histoires se croisent, ce que le moteur doit apprendre. Le § 2 est la table des dix. Suivent les dix histoires, dans l'ordre où le livre les vend (l'ordre du temps), chacune au même gabarit en dix points (§ 1.11). La relecture de l'éditeur ferme le livre.

---

## 1. La règle commune

### 1.1 Le ton

Le noir, pas le cynisme. Le monde de FUSIBLE est dur — l'argent, les tribunes, les corps qui cassent, la peur de perdre sa place, le racisme des années 1990, les fonds, les franchises — mais chaque personnage a ses raisons, et le livre les lui laisse. Personne n'est méchant pour l'être ; on trahit pour un four de boulangerie, pour une dette de jeu, pour un fils, pour rester dans la photo. Le coupable de chaque histoire doit pouvoir s'expliquer en deux phrases, et ces deux phrases doivent faire mal.

La charte d'écriture s'applique à chaque carte, sans exception : une carte est une scène (quelqu'un, quelque part, à un moment, veut quelque chose de toi) ; aucun personnage n'a de phrase fétiche ; la réplique contient un détail qu'on ne peut pas déplacer (un nom, une heure, un objet, un lieu d'Aubérive) ; le sous-texte passe avant le texte ; chaque sortie répond par une conséquence vue de près ; une graine plantée revient trois à dix cartes plus tard. Les limites du moteur aussi : texte ≤ 200 caractères, libellé ≤ 28, réponse ≤ 140.

### 1.2 La touche : cinq outils de dérangement

Le porteur du projet cite *Hotline Miami* : la nuit au néon, les coups de téléphone qui donnent des ordres sans dire qui appelle, les masques, la violence qui arrive d'un coup et qu'on ne montre pas en entier, les intermèdes où l'on ne sait plus si c'est un rêve, un humour à froid qui fait plus peur que la violence. Ce livre en fait cinq outils, et chaque histoire en possède un qui n'est qu'à elle (son « mécanisme »), plus deux ou trois autres en appoint.

- **L'ordre sans visage.** Une voix au téléphone, un fax sans en-tête, un message sur un répondeur, une oreillette, un portable à clapet : quelqu'un te dit quoi faire et ne dit jamais qui il est. La carte d'ordre est courte, sans adresse, sans formule de politesse ; elle donne une heure, un nom, un prix. Elle ne s'explique pas.
- **Le masque.** Un visage qui n'est pas le sien : trois mille masques en carton, la porte du Rideau Rouge où personne n'a de nom, une vidéo truquée, une voix générée. Le masque dit toujours la même chose : on peut faire le mal avec ta figure.
- **La violence hors champ, en une carte.** Elle arrive d'un coup, au bord du cadre : un bruit, une porte, un cri dans la rue, un pneu qui crisse. La carte suivante est le lendemain : le sang sur la passerelle, le pansement, la chaise vide. On ne montre jamais le coup qui porte.
- **L'intermède.** Une carte à part, au plus une par saison (sauf dans le livre dont l'intermède est le mécanisme, *La Route de la Rive*, et jamais deux de suite), signalée à l'écran (fond plus sombre, texte en italique, aucun locuteur, aucune jauge qui bouge ou presque) : un rêve, un demi-sommeil, une nuit qu'on ne se rappelle pas. L'intermède ne ment jamais sur les faits : il les déforme, et le joueur attentif y trouve un indice vrai.
- **L'humour à froid.** Une phrase banale dite au mauvais moment par quelqu'un qui ne mesure pas l'horreur, ou qui la mesure trop bien : l'assureur qui dit « sans corps, c'est un départ en vacances », le fonctionnaire qui dit « il n'y a pas eu de morts, il y a eu des retours anticipés ». Une par séquence au plus. Jamais une blague, jamais un clin d'œil : une phrase qui glace.

### 1.3 Ce qu'on ne montre jamais

Le coup qui porte, le corps abîmé, la seringue qui entre, le comprimé qu'on avale, l'acte sexuel, la méthode d'un suicide, la torture, un enfant en danger au-delà de la menace dite. Le livre montre l'avant (la boîte sans étiquette posée sur le banc, la porte sans poignée, la voiture qui démarre) et l'après (le gobelet renversé, la lumière restée allumée, le banc vide au vestiaire, la Une du lendemain). Le racisme des tribunes est montré par ses conséquences et par la voix de ceux qu'il vise, qui gardent leur dignité et leur réplique ; il n'est jamais un ressort, jamais un effet de style. Aucun nom réel, nulle part : ni club, ni joueur, ni dirigeant, ni marque, ni compétition, ni commune (Villefranche, Beaulieu, Fontaine, Valmont, Néville, Terrenoire, Corbelin sont interdits ; on dit « le Mondial », jamais le nom réel de la compétition).

### 1.4 La violence, la drogue, le sexe, la police

**La violence** obéit à la règle de la carte unique (§ 1.2) et à la cadence de la charte : jamais deux chocs sur deux cartes consécutives ; après un choc, une ou deux scènes calmes qui en montrent le prix. Chaque fiche donne huit soirs, parfois neuf. Ceux qui portent un numéro de scène clé sont des **ancres de nuit** : le script ou leur intrigue les sert à leur heure et à leur lieu, comme n'importe quelle ancre, sans passer par le tirage. Les autres sont des **événements sombres** au sens du moteur (`kind: evenement`, tag `sombre`, un `lieu:`) : un réservoir que le metteur en scène arme selon l'état du monde, deux par saison au plus, jamais à moins de cinq créneaux d'écart ; un événement dont les conditions ne viennent pas dans sa saison attend la suivante, ou ne tombe pas. Ancres et réservoir ensemble ne font jamais plus de quatre soirs dans une saison, ni deux soirs à moins de cinq créneaux : quand une saison est pleine d'ancres, le réservoir se tait.

**La drogue et le dopage** sont une boîte sans étiquette, un flacon B, « quelque chose pour dormir », « quelque chose pour le genou ». On ne nomme jamais une molécule ni une dose ; on montre ce que ça coûte : un contrôle jeudi, un joueur qui tombe sous la douche, un genou qui tient un match et lâche au suivant, une mère qui trouve la boîte dans le sac de sport. Quand le joueur y touche, la ville le sait (une réplique de passant change) et la police peut le savoir (mission, saisie, garde à vue).

**Le sexe** n'existe qu'en creux. Le Rideau Rouge est un lieu de rendez-vous, de pouvoir et d'argent : une porte sans poignée, du velours, un homme en costume derrière, une ardoise. Ce qui s'y passe se lit dans ce que les gens en rapportent (une photo, une dette, un silence), jamais dans une scène.

**La police** est le dernier mur. Le pont entre une carte et la ville (`var:`) porte l'argent propre (`ville_francs`), l'argent sale (`ville_francs_sales`, qui rend saisissable en premier tout ce qu'on achète ensuite), l'amende (`ville_amende`), le cadeau (`cadeau_<objet>`) et la saisie (`saisie_vehicules`, `saisie_logement`, `saisie_luxe`, `saisie_tout`). Chaque histoire a **sa saisie** : un moment où ce qu'on a acheté ou reçu est repris devant témoins, et ce moment est un tournant du récit, pas une sanction comptable. La fin commune `co_garde_a_vue` existe ; chaque histoire lui donne une ou deux lignes `epitaph_plus` à elle.

### 1.5 Le temps

Les dix histoires s'étalent de 1990 à 2040. L'époque se tient au détail près (charte R9) : 1990-1997, le fax, le bip, la cabine, le Minitel, le répondeur à microcassette, la cassette vidéo, les francs, la télé régionale ; le portable et le SMS vers 1998-2000, le courriel et l'internet des familles après 1997 ; les écus en 2002 ; le Flux (le réseau social du monde) en 2007-2008, le téléphone qui photographie et filme en 2008 ; la vidéo d'arbitrage en 2016 ; la diffusion en flux en 2024 ; le calendrier à soixante-douze matchs (2023) et la grève mondiale des joueurs (2026) ; l'arbitre-machine en essai (2027) ; le Mondial d'hiver d'Al-Dorado (décembre 2030) ; le commentaire dit par la voix générée d'un ancien joueur (années 2030) ; la loi des franchises qui ferme l'escalier de la première division (2040). Toute carte qui cite un objet daté porte sa condition d'année.

### 1.6 La joueuse

Le personnage joué peut être une femme, dans les dix histoires. Les textes de la ville n'accordent jamais au masculin le personnage joué ; les cartes du moteur utilisent `{pg, select, f{e} other{}}` ou une tournure neutre. Trois histoires ont une héroïne par défaut (le livre la dit « elle » dans sa quatrième de couverture) : la directrice sportive de *23 h 58*, la sélectionneuse de *Vingt degrés dedans*, la présidente des *Deux téléphones*. Les sept autres sont écrites au neutre : leurs cartes, leurs lignes de ville et leurs épitaphes ne supposent rien ; la prose de ce livre, elle, dit « il » par commodité de lecture, et rien de plus. Le monde réagit au genre quand l'époque le ferait — un dirigeant de 2003 qui dit « mademoiselle » à une directrice sportive de quarante-deux ans — et jamais pour faire rire.

### 1.7 La ville

Les dix histoires se jouent à **Aubérive**, autour du **Racing Aubérive** (« les Aubes », bordeaux et gris, le stade de la Rive). La coquille de la ville est la même pour toutes : sept quartiers autour du stade, la semaine en cinq tranches (matin, midi, après-midi, soir, nuit), les cartes qui attendent à leur lieu, le match le samedi à 15 h, le classement le dimanche, l'événement sombre qui tombe le soir. Chaque histoire dit quels lieux elle habite, et les habite autrement : la laverie de la rue du Stade n'est pas la même en 1990 (on y lave les maillots du club parce que la machine est saisie) et en 2024 (on s'y réveille sans savoir pourquoi).

Les lieux que les dix histoires se partagent, avec leur clé : l'appartement de la rue des Lilas (`appartement`), le club-house et son escalier où pend la photo de 1974 (`clubhouse`), le stade de la Rive et son couloir (`stade`), le terrain annexe et sa haie de thuyas (`terrain`), le centre de formation (`centre`), la buvette du kop (`buvette`), la laverie (`laverie`), la boutique du club (`boutique`), le tabac-presse du carrefour (`tabac_stade`), la Banque Aubérivoise (`banque`), le cabinet du Doc (`cabinet`), la salle de muscu de l'ancien garage Mazurier (`muscu`), le Corner (`bar`), la mairie et son café (`mairie`, `cafe_mairie`), la rédaction de L'Écho (`echo`), la brasserie du Pont et sa photo de 1962 (`brasserie`), l'hôtel de la Rive (`hotel`), la maison de la presse (`presse`), la boulangerie et l'épicerie (`boulangerie_residentiel`, `epicerie`), l'école (`ecole`), le Terminus et son arrière-salle (`terminus`, `tripot`), la gare routière (`gareRoutiere`), le square des Lilas (`square`), ta voiture (`voiture`), le cimetière, le caveau du Racing et sa plaque neuve dont personne n'a voulu parler (`cimetiere`, `caveau`), la loge du gardien qui note qui vient et quand (`loge`), le fleuriste Aux Immortelles (`fleuriste`), la friche de l'usine avec son feu de palettes, son wagon et sa grande halle où un terrain est tracé à la craie sur le béton (`friche`, `feu`, `wagon`, `halle`), l'église Saint-Aubin (`eglise`), le monument (`monument`), la fontaine et le marché (`fontaine`, `marche`), le kiosque du quai et le tabac du Quai où l'on parie sur tout (`kiosque`, `tabac`), le lavoir (`lavoir`), la pharmacie (`pharmacie`), le cinéma L'Aurore (`cinema`), la librairie-papeterie (`librairie`), le tailleur Brunel, le garage du Pont, Immobilier Tessandier et sa maquette de résidence au bord de la Rive (`tailleur`, `garage`, `agence`), et le Rideau Rouge, le club privé à la porte sans poignée (`club_prive`).

**Les paroles de la ville.** Chaque histoire fournit au moins quarante répliques de passants et de personnages secondaires (§ 7 de chaque fiche en donne quinze, les auteurs écrivent le reste), au format de `content/ville/` : un `qui` (passant, passante, enfant, fan, ancien, commerçant, ou l'id d'un personnage), un `sujet` (match, classement, club, toi, argent, rumeur, quartier, époque, sombre, sponsor, achat), une condition `si` dans la grammaire de la ville (des termes reliés par `&&` : `flag(x)`, `!flag(x)`, `arc(id)`, `possede(objet)`, `mission(id)`, `saison == 2`, `annee >= 1991`, `relation.gege >= 2`, `tribunes < 30`, `serie_d >= 2`, `tranche == nuit`, `jour == sam`…), un texte de cent soixante caractères au plus. Une réplique de ville ne fait pas avancer l'intrigue : elle prouve qu'elle avance. Quand quelque chose a eu lieu (un masque trouvé, une voiture saisie, une Une), la ville le dit avant que le joueur ne le lise.

**Les missions secondaires** sont rares : une par saison au plus, deux par histoire au minimum, trois au plus. Elles viennent d'un donneur à un lieu et une tranche, proposent de l'argent, un service, une boîte, une enveloppe, et elles ont un prix : la police, la jauge, un personnage. Chacune nourrit l'intrigue principale (un indice, une dette, une preuve, une trahison) ; aucune n'est un à-côté.

**Les sponsors louches** : chaque histoire en a un ou deux, inventés, qui proposent de l'argent, une voiture, des « compléments », une table au Rideau Rouge ou une soirée à l'arrière-salle du Terminus. Accepter rapporte vite et se paie tard.

**La boutique et les biens** : costume chez Brunel, chaussures, montre, voiture au garage du Pont, appartement ou pavillon chez Tessandier, et plus tard l'hélicoptère. Ce qu'on achète se voit (un passant le remarque), se prête à un cadeau (un sponsor l'offre), et peut être saisi. Chaque histoire dit ce qu'on y achète, ce qu'on y reçoit, et quelle saisie fait tourner le récit.

### 1.8 Comment les histoires se croisent

**Un monde, dix présents.** Les dix histoires partagent un passé (tout ce qui a eu lieu avant leur année de départ est commun : la finale de 1974, la montée de 1984, le tifo de 1971 du père de Gégé), des destins (ce que la bible fixe pour chaque visage vaut dans chaque livre tant que le joueur ne le change pas : Vaubourg meurt à son bureau en 2026, Gigi Vecchio en 2031, Gégé en 2040, Josiane en 2041) et des objets qui voyagent. Chaque histoire a son présent à elle. Les quatre histoires de 1990 commencent toutes à l'été 1990, parce que le moteur les y attache : ce sont quatre fois le même été, comme quatre témoins d'une même nuit ne racontent jamais la même saison. Le Racing n'y est pas toujours dans la même division ; aucune des quatre ne s'appuie sur le présent d'une autre.

**Ce que chaque livre laisse au monde.** Chaque fiche se termine par une courte liste : les faits de ce livre que les livres suivants tiennent pour vrais. Ils sont écrits pour être vrais **quelle que soit la fin** atteinte par le joueur (une berline grise disparue du parking pendant l'hiver 1990, pas « l'entraîneur était vivant »). Les livres suivants ne citent que ces faits-là.

**Les fils qui traversent le livre** :

- **Le cadavre.** Tibo Rancé, le gamin de dix-sept ans que la directrice sportive de *23 h 58* est sommée de vendre en 2003, est retrouvé mort chambre 12 en 2011 (*Chambre 12*). Joachim Ferlac, le stagiaire qui tape les fax de 23 h 58, est retrouvé mort dans sa voiture en 2023, et sa voix parle encore dans l'oreillette de 2024 (*L'Oreillette*). Jean-Marie Vaubourg meurt à son bureau en 2026, à l'heure que le modèle avait donnée. La berline de l'entraîneur disparu de 1990 sort de la Rive en 2000, vide, le sapin en carton encore au rétroviseur (*La Maquette*).
- **Le témoin.** Sandrine Lavergne, la fille à la mobylette de la nuit de 1984 (*La Route de la Rive*), est en 2011 la réceptionniste de nuit de l'hôtel de la Rive : elle a vu le tableau des clés à 2 h 10 (*Chambre 12*). Didier Vallin, le gamin dont le nom est sous ton sparadrap en 1990 (*La Sirène*), vit à la friche ; en 1999, il a vu qui a mis le feu à la tribune Est (*La Maquette*). Josiane photocopie chaque fax avant qu'il ne blanchisse (2003) ; en 2024, elle sort les photocopies d'un carton ; en 2030, elle a gardé dans sa cave la copie d'un procès-verbal de 2010.
- **Le juge.** Judith Amsel, la procureure, fait geler les berges quand la berline sort de la vase, en 2000, et instruit le dossier du Conseil ; en 2011, c'est elle qui fait sceller la chambre 12. Madame Aubert, maire en 1990, députée en 1999, ministre en 2010, décide du sort des autres pendant quarante ans — et en 2030, c'est elle qu'on juge.
- **La colonne vertébrale.** Lian Mbako a seize ans en 1990 : il est assis à ta place dans *La Route de la Rive*, il est le gamin d'après dans *La Sirène*. En 2011, il est le capitaine mutin qui a trouvé le corps de la chambre 12. En 2030, il sélectionne le Kambara contre les Cobalts. En 2038, président de la Fédération, il a écrit la loi qui ferme l'escalier. Le livre commence avec un garçon qui veut jouer tout de suite et finit avec l'homme qui ferme la porte aux garçons.
- **Les objets.** Les trois mille masques en carton de 1990 reviennent en 2040 : le virage porte le visage de Gégé pour son dernier match. La maquette des Terrasses de la Rive reste dans la vitrine de Madame Tessandier de 1999 à 2040, jaunit, et revient dans le plan du consortium. La photo de 1974 descend l'escalier du club-house dans *Trois mille visages* et remonte dans *Les Deux Téléphones*.

### 1.9 La forme d'une histoire d'une heure

Une heure de jeu, c'est cent cinquante à deux cents cartes vécues, soit trois saisons. Chaque histoire en tient trois au moins, et **arrive quelque part** : un acte final, une révélation, plusieurs fins méritées. La forme :

- **Le prologue** (saison 1, six cartes hors créneau, sans drame) pose le lieu, la blessure, la graine principale et le mécanisme.
- **Saison 1 — l'exposition qui mord.** Le script (ancres aux créneaux 1, 10-11, 16, 17), trois intrigues du réservoir, un ou deux événements sombres dès que la saison le permet, un retournement à l'ancre d'hiver. La dernière carte avant chaque match laisse une question ouverte.
- **Saison 2 — le retournement.** Les graines plantées paient, un allié trahit ou un ennemi se révèle, la saisie tombe souvent ici. La saison finit sur la révélation partielle.
- **Saison 3 — l'acte final.** La vérité entière, le prix, le dernier match ou la dernière nuit, et les fins. Une fin de l'intrigue peut tomber avant la fin de la saison ; si le joueur survit à l'acte final sans en sortir, la carrière continue avec l'épilogue (une carte par saison, les rituels du rôle) jusqu'à une fin commune ou au Carrefour.

**Le dosage** (charte § 4) : par saison, un grand retournement, deux ou trois retournements d'intrigue, un ou deux événements sombres, un intermède au plus (deux dans *La Route de la Rive*) ; jamais deux chocs de suite ; après un choc, une ou deux scènes calmes. Chaque fiche numérote vingt scènes clés ; les auteurs écrivent le reste autour.

### 1.10 Ce que le moteur doit apprendre

Les rôles directeur sportif, président et sélectionneur sont écrits dans la bible et **pas branchés** : six des dix histoires en ont besoin. Ce qu'il faut, dans l'ordre :

- **Trois rôles** dans `content/roles.yaml`, avec les jauges et les fins de la charte (`docs/bible/00_charte.md` § 3.1) : `ds` (le staff, les tribunes, le président, la masse salariale ; jauge fragile la caisse), `president` (le club, les tribunes, les actionnaires, la trésorerie ; jauge fragile la caisse), `selectionneur` (le groupe, le pays, la Fédération, les moyens ; jauge fragile le vestiaire ; l'année civile et ses quatre fenêtres, la chaîne Tournoi).
- **Les lieux des nouveaux rôles** dans `content/ville.yaml` : le bureau du directeur sportif et celui du président au club-house (le bureau du président est à l'étage, la photo de 1974 dans l'escalier), le sélectionneur logé à l'hôtel de la Rive pendant les fenêtres, et pour chacun quatre à six activités (le directeur sportif : regarder les jeunes au centre, le café des agents au café de la Mairie, le fax de nuit, le banquier ; le président : la loge, la banque, la mairie, la buvette, la visite au vestiaire ; le sélectionneur : voir un joueur à l'entraînement, la conférence à L'Écho, la séance au stade, la veillée à l'hôtel).
- **La ville fixée** : les six nouveaux postulats déclarent leur ville et leur club (Aubérive, Racing Aubérive) ; les quatre de 1990 aussi, sans toucher à leurs ids, index, années, jauges et divisions (les goldens en dépendent).
- **Trois formes de carte** : l'**intermède** (un tag `intermede`, rendu à part, § 1.2), la **ligne d'ordre** (une carte d'ordre sans locuteur, rendue comme un fax, un répondeur, une oreillette ou un écran de portable selon l'histoire), et la **chaîne hors ville** (la chaîne Tournoi de *Vingt degrés dedans* se joue à Al-Dorado : la coquille montre le Dôme et non Aubérive).
- **Les fins** de chaque histoire dans `content/endings/` (une fiche par histoire), et les nouvelles lignes `epitaph_plus` de `co_garde_a_vue`.
- **Les visages** : dix-sept personnages existent dans `content/characters.yaml`. Les autres ids cités ici sont ceux de la bible (charte § 2.3 : `amsel`, `barbier`, `dauzat`, `dembo`, `fauvel`, `klopf`, `la_plume`, `malbec`, `paulette`, `rossard`, `rouvier`, `sacha`, `solvang`, `vence`, `vialat`) et se créent avec leur âge de 1990, leur statut et leur adresse dans les rôles nouveaux (bible ch. 01 § 0.1, ch. 02). Les visages nouveaux de chaque histoire sont des voix sans relation, sauf mention : on ne les crée dans `characters.yaml` que s'ils portent une intrigue sur plus d'une saison (Mercadier, Didier Vallin, Sandrine Lavergne, Joachim Ferlac, Nino).

### 1.11 Le gabarit des dix fiches

Chaque histoire suit le même ordre : **1.** la fiche et la quatrième de couverture ; **2.** le genre et la touche ; **3.** le personnage joué ; **4.** la distribution ; **5.** la structure, saison par saison, avec les vingt scènes clés (lieu, texte en une ou deux phrases, les deux choix), les rebondissements, les graines et ce qui les paie, l'acte final ; **6.** les soirs (les événements sombres), les missions, les sponsors, la boutique et la saisie ; **7.** ce que dit la ville ; **8.** les fins et leurs épitaphes ; **9.** la question de saison et les objectifs ; **10.** le volume à produire, et ce que le livre laisse au monde.

Dans les scènes clés, ← est le choix de gauche, → celui de droite ; le libellé tient en vingt-huit caractères ; le texte est un résumé de scène, pas encore la carte : l'auteur l'écrit au gabarit.

---

## 2. La table des dix

L'ordre du livre est l'ordre du temps. Quatre histoires partent de l'été 1990 (les quatre postulats jouables aujourd'hui, approfondis et assombris, sans toucher à leurs ids ni à leur année) ; les six autres s'étalent d'une décennie à l'autre jusqu'à la fermeture de l'escalier, en 2040.

1. **Trois mille visages** — entraîneur (`promu`) — 1990-1993 — *la vengeance* — Tu reviens dans la ville où ton père a été accusé d'avoir vendu la finale de 1974 ; le kop t'adore avant de te connaître et imprime trois mille masques à ton visage, que quelqu'un porte la nuit.
2. **Le Sapin en carton** — entraîneur (`interimaire`) — 1990-1993 — *la disparition* — Tu remplaces un entraîneur « viré » que personne n'a vu partir ; sa voiture reste sur le parking, et chaque lundi le répondeur du bureau a un message de lui.
3. **La Sirène** — joueur (`pepite`) — 1990-1993 — *la descente aux enfers* — Dix-neuf ans, la dernière chose que fabrique une ville dont l'usine ferme ; sous ton nom, sur le sparadrap du crochet, le nom d'un gamin qu'on dit vendu à l'étranger, et la nuit la sirène de l'usine morte se remet à hurler.
4. **La Route de la Rive** — joueur (`fin_de_contrat`) — 1990-1993 — *la rédemption impossible* — Ta dernière année de contrat ; depuis 1984, tu portes la mort d'une fille à mobylette, et chaque nuit, depuis les infiltrations, tu reprends le volant de cette nuit-là.
5. **La Maquette** — président (`geant_dechu`) — 1999-2002 — *le complot* — Tu prends la présidence d'un Racing en dépôt de bilan ; dans la vitrine de l'agence Tessandier, la maquette d'une résidence au bord de la Rive change chaque mois, et le stade y rétrécit.
6. **23 h 58** — directrice sportive (`vendre_trente`) — 2003-2006 — *le chantage* — Chaque nuit à 23 h 58, le fax de ton bureau imprime un nom, un prix, un club ; si tu n'obéis pas, il imprime une photo de toi au Rideau Rouge. Le papier thermique blanchit en six mois.
7. **Chambre 12** — sélectionneur (`apres_fiasco`) — 2011-2013 — *le huis clos* — Les Cobalts se préparent à l'hôtel de la Rive pour le barrage ; la troisième nuit, Tibo Rancé est retrouvé mort chambre 12, et le tableau des clés sait qui y est monté.
8. **L'Oreillette** — directeur sportif (`le_modele`) — 2024-2027 — *la folie* — Le modèle choisit qui acheter et qui vendre ; depuis la mort de son créateur, il parle avec sa voix, et ce qu'il prédit arrive.
9. **Vingt degrés dedans** — sélectionneuse (`mondial_hiver`) — 2029-2031 — *la corruption d'État* — Le fils de la boulangère revient d'Al-Dorado dans un cercueil scellé ; tu dois y emmener les Cobalts pour le Mondial d'hiver, et le pays te demande de sourire.
10. **Les Deux Téléphones** — présidente (`escalier_ferme`) — 2037-2040 — *le double jeu* — Trois saisons pour monter avant que la loi ne ferme l'escalier ; le téléphone de ton bureau est pour la ville, le portable à clapet dans ta poche est pour ceux qui ont payé ta campagne et qui ont besoin que le Racing reste en bas.

**Pourquoi ces six-là.** Trois viennent de la bible et y gagnent une ombre : `geant_dechu` (le Racing, deux titres au mur, rattrapé par la faillite en 1999), `vendre_trente` (le contrat à trente millions, devenu un chantage au fax) et `apres_fiasco` (le bus de 2010, devenu un huis clos à l'hôtel de la Rive). Trois sont inventés parce que la chronologie du monde les appelle et qu'aucun postulat ne les portait : le modèle qui note tout (2008-2015) et le calendrier à soixante-douze matchs (2023) font *L'Oreillette* ; le Mondial d'hiver attribué en 2010 et contesté jusqu'en 2029 fait *Vingt degrés dedans* ; la loi de 2040 qui ferme la première division fait *Les Deux Téléphones*. Les autres postulats de la bible restent ouverts pour plus tard : `coach_intouchable` (2010) et `rachete_fonds` (2007) tombent sur les années de *Chambre 12* et de *23 h 58* et leurs thèmes (le fonds, le monument) y sont déjà ; `pays_emergent` et `bout_du_monde` se jouent en Sylvanie, `fusion_imposee` et `coupe_du_village` à Boisnoir et à Trébignac, loin d'Aubérive.

**Deux par rôle, dix genres, dix mécanismes.** Les deux entraîneurs (la vengeance, la disparition), les deux joueurs (la descente, la rédemption), les deux dirigeants sportifs (le chantage, la folie), les deux présidents (le complot, le double jeu), les deux sélectionneurs (le huis clos, la corruption d'État). Chaque histoire a un objet ou un rituel qui n'est qu'à elle : les masques, la voiture au sapin et le répondeur, la sirène, la route rêvée, la maquette, le fax de 23 h 58, le tableau des clés, l'oreillette, le brassard noir, les deux téléphones.

---

## Histoire 1 — Trois mille visages

### 1. La fiche

**Rôle** : entraîneur · **Postulat** : `promu` (index 0, 1990, Division 1 ; jauges, force, objectif et drapeaux inchangés) · **Club** : le Racing Aubérive, promu en première division, sans un sou · **Président** : Jean-Marie Vaubourg (`aulard`) · **Saisons** : 1990-1991, 1991-1992, 1992-1993 · **Ancien titre** : *Le promu sans un sou*.

> **Quatrième de couverture**
>
> En mars 1975, on a sorti Henri Ravenel de la Rive, sous la passerelle. Un an plus tôt, le capitaine du Racing avait perdu la finale de la Coupe, trois buts à zéro, et la Fédération avait trouvé quarante mille francs dans son casier. Ta mère a pris le car de six heures et tu as pris son nom. Tu avais vingt-trois ans.
>
> Quinze ans plus tard, le Racing monte en première division sans un sou, et c'est toi qu'on appelle pour le tenir. Tu n'as rien dit à personne. Pourtant, la Tribune Nord chante ton nom avant de t'avoir vu, et au premier match à domicile, trois mille visages se lèvent dans le virage : le tien, en carton, imprimé par le kop. Dans l'escalier du club-house, sur la photo de 1974, le cinquième visage a été gratté au couteau.
>
> Un mardi, à minuit, un homme se tient sous ta fenêtre, rue des Lilas. Il porte ta figure. Il ne bouge pas.
>
> Ils t'aiment. Ils feront ce que tu n'oses pas faire. Avec ton visage.

### 2. Le genre et la touche

**La vengeance.** Tu as fait le voyage pour elle, et elle se fait sans toi. Le livre retourne le genre : l'enquêteur est l'arme, la vengeance est collective, et la cible n'est jamais propre — à la fin, il n'y a plus personne d'innocent sur la photo, pas même celui pour qui tu es revenu.

**La touche : les masques.** Le kop imprime trois mille masques de ton visage, qui est aussi celui de ton père (tu lui ressembles quand tu ne dis rien). La nuit, des hommes les portent pour frapper ceux de 1974. Le visage est le mécanisme et la peur : la ville ne sait plus qui elle a salué le matin, la police cherche ta figure, et un enfant du square court en criant « Je suis toi ! ». En appoint : le coup de fil de trois heures (« Samedi soir, on finit. Mets ton masque. »), un intermède par saison (le virage plein de ton visage qui chante avec ta voix ; une seule tête sans masque, au dernier rang, qui regarde la Rive), et l'humour à froid de Gégé, qui tient le compte des masques rendus comme d'autres tiennent une caisse.

### 3. Le personnage joué

Trente-huit ans en 1990, entraîneur de clubs de troisième zone depuis quinze ans, réputé pour faire tenir des équipes qui n'ont rien. Né à Aubérive, fils ou fille d'Henri Ravenel, numéro 5 et capitaine du Racing de 1974. A quitté Aubérive en 1975 sous le nom de sa mère (le nom que le joueur choisit) ; n'y est jamais revenu.

**Ce qu'il veut** : savoir qui a mis l'enveloppe dans le casier, et faire graver le nom de son père sur la plaque neuve du caveau du Racing, que personne n'a voulu nommer. Plus bas, sans le dire : que son père soit innocent. **Ce qu'il cache** : qui il est ; et la dernière lettre d'Henri, qu'il porte depuis quinze ans sans l'avoir jamais lue jusqu'au bout.

### 4. La distribution

- **Gégé** (`gege`) — le capo l'a reconnu au premier regard : le visage d'Henri, qui tenait en 1971 l'autre bout de la bâche de son père (« LE PRÉSIDENT VEND, LE VIRAGE RESTE »). Il fait aimer le nouveau venu au virage, imprime les masques, et prépare sa propre vengeance contre Vaubourg. Il est l'amour et l'arme ; il ne ment jamais, il se tait.
- **Jean-Marie Vaubourg** (`aulard`) — trésorier du club en 1974, président depuis 1977. Il a organisé la vente de la finale avec les bookmakers du Quai pour éponger une dette, puis laissé trouver l'enveloppe chez Henri quand la Fédération a enquêté. Il a payé sa présidence avec l'argent de la finale. Il ne sait pas qui tu es avant la deuxième saison.
- **Gigi Vecchio** (`vecchio`) — vingt-cinq ans en 1974, gardien remplaçant titularisé ce jour-là. Il devait trente mille francs au Quai ; il a laissé passer les trois buts. Il garde depuis, dans un placard de la buvette, le filet de la finale. Il t'aime bien, et c'est sincère.
- **Zoran Vukić** (`vukic`) — l'adjoint, le cahier ; il voit tout de son bord de terrain et te met devant les décisions. C'est lui qui t'appelle à six heures quand on retrouve Gigi.
- **Madame Josiane** (`josiane`) — arrivée en 1987 : elle ne sait rien de 1974, mais elle sait où sont les clés des archives et pourquoi on n'y monte plus.
- **Pierre Massenet** (`meneche`) — il a signé en 1974 l'article « LE CAPITAINE A VENDU ». Il le relit tous les ans en mars. Les masques cambriolent ses archives.
- **Camille** (`camille`) — elle sait d'où tu viens et ne t'a jamais demandé de revenir. Elle éteint la lampe quand l'homme est sous la fenêtre.
- **Lian Mbako** (`mbako`), **Cheikh Ilyas** (`nassir`), **Rocco Fardelli** (`fardelli`), **Dan Corven** (`clow`) — le réservoir du promu reste (le prodige, l'argent qui frappe, l'agent, le mentor) : il donne au livre ses respirations et ses tentations.

**Les visages nouveaux**

- **Henri Ravenel** (mort en 1975) — le père. Il ne parle que dans les intermèdes et dans sa lettre. Ce qu'il voulait : payer le traitement de sa femme. Son secret : il a pris l'enveloppe.
- **Odette Marsal**, 72 ans — photographe de L'Écho en 1974, aujourd'hui à la librairie-papeterie. Elle a une pellicule jamais tirée : le couloir, après la finale. Ce qu'elle veut : qu'on la lui demande enfin. Son secret : elle a vendu une autre photo de ce couloir à Vaubourg, en 1977, pour payer sa boutique.
- **L'inspecteur Lhoste**, 45 ans, police judiciaire de Portclair — il enquête sur les nuits masquées et veut un visage pour son procès-verbal. Son secret : il était dans le virage en 1974, il avait douze ans, sur les épaules de son père.
- **Nino**, six ans — le neveu de Gégé. Il ramasse les masques au square et les revend dix francs aux autres gamins. En 2038, il sera le capo (*Les Deux Téléphones*).

### 5. La structure

**Saison 1 (1990-1991) — Le visage.** Le prologue pose la photo grattée, les deux clés, le chant qui contient déjà ton nom. Au premier match à domicile, les trois mille masques se lèvent ; Vaubourg n'a rien payé et le dit. Tu achètes, ou non, le maillot de 1974 aux enchères de la boutique. Le gardien du cimetière te dit qui a payé la plaque sans nom. À l'ancre d'hiver, au local, Gégé déroule la bâche de 1971 : il sait qui tu es. La saison finit sur l'homme masqué sous ta fenêtre. Le réservoir du promu tourne autour (le prodige, les salaires, Ilyas) ; une phrase dite trop vite à la buvette (« Ceux de 74 paieront ») est la graine qui reviendra peinte sur un mur.

**Saison 2 (1991-1992) — Les nuits.** Les masques sortent. La berline de Vaubourg brûle sur le parking, un masque posé sur le capot. La vitrine de la Banque Aubérivoise porte « 1974 » à la peinture. Les archives de L'Écho disparaissent. L'inspecteur Lhoste s'installe dans ton bureau. Odette tire sa pellicule : le couloir de 1974, Vaubourg, une enveloppe kraft. Puis le cri sous la passerelle : Gigi, la mâchoire cassée, un masque à la main. Ta voiture est saisie devant la Nord, un masque dans le coffre. La saison finit sur l'ardoise de Gigi : « TON PÈRE A PRIS L'ENVELOPPE. »

**Saison 3 (1992-1993) — Le dernier soir.** La lettre de 1975, lue jusqu'au bout. Le ticket de pari caché derrière le carton du maillot encadré, de la main de ton père. Vaubourg ouvre son coffre : la confession signée d'Henri, jamais publiée ; il la garde si les masques s'arrêtent, il la donne à L'Écho s'ils continuent. Gégé prépare la dernière nuit, après le dernier match : les Hauts-de-Rive, la maison du président. L'acte final : la veille, le feu de palettes de la friche, et la salle de presse pleine.

**Les vingt scènes clés**

1. **La photo** — *escalier du club-house, prologue.* Seize joueurs dans la boue de la finale de 1974 ; le cinquième visage est gratté au couteau jusqu'au carton. Josiane descend avec deux clés : « Le bureau, et le local à ballons. Les archives, on n'y monte plus. » ← *Je prends les deux* · → *Le local me suffit*
2. **Le chant** — *grillage de la Tribune Nord, prologue.* Le virage répète un chant où ton nom est déjà, et Gégé, les doigts dans le grillage : « On l'a appris en juin. Tu veux savoir pourquoi on t'aime déjà ? » ← *Dites-le-moi* · → *Je ne veux pas savoir*
3. **Trois mille visages** — *stade, premier match à domicile.* La Nord se lève au coup d'envoi : trois mille fois ta figure en carton, noir sur blanc. Vaubourg, dans la loge, au téléphone : « Qui a payé ça ? Pas moi. » ← *Je salue le virage* · → *Je regarde le terrain*
4. **La première bière** — *buvette, soir.* Gégé pose une bière tiède et un masque plié en quatre : « Le premier sorti de l'imprimerie. Ceux de 74 n'ont jamais payé, tu le sais, ça ? » ← *Ils paieront* · → *74, c'est fini*
5. **Le maillot** — *boutique, mercredi après-midi.* Aux enchères, le maillot de la finale, le 5, la boue encore sur le numéro. Tu lèves la main et les anciens du premier rang se retournent. ← *J'enchéris jusqu'au bout* · → *Je le laisse partir*
6. **La plaque** — *caveau du Racing.* Une plaque neuve, sans nom. Le gardien, de sa loge : « Posée en 1989, payée en liquide par un homme en écharpe. Le club n'a jamais voulu dire pour qui. » ← *Je demande qui* · → *Je pose une fleur*
7. **Le local** — *local du kop, ancre d'hiver.* Gégé déroule la bâche de 1971 : « Mon père l'a peinte. Le tien en tenait l'autre bout, ce jour-là. » Il ne demande rien ; il attend. ← *Qu'est-ce que tu veux ?* · → *Tu te trompes de visage*
8. **L'homme sous la fenêtre** — *rue des Lilas, mardi minuit (événement sombre).* Un homme en manteau porte ton visage. Il ne bouge pas. Camille a éteint la lampe : « Il est là depuis onze heures. » ← *Je descends* · → *J'appelle la police*
9. **La pellicule** — *librairie-papeterie.* Odette Marsal pose une boîte à chaussures sur le comptoir : « Le couloir, après la finale. Jamais tirée. Vous voulez voir qui tenait l'enveloppe ? » ← *Tirez-la* · → *Gardez-la encore*
10. **La berline** — *parking du stade, une heure du matin (événement sombre).* La voiture de Vaubourg brûle ; sur le capot, un masque posé bien droit. Vaubourg, en pyjama sous son manteau : « Dis-moi que ce n'est pas toi. » ← *Ce n'est pas moi* · → *Demandez-vous pourquoi*
11. **L'inspecteur** — *ton bureau.* Lhoste pose le masque roussi sur ta table, côté visage : « Trois témoins vous ont vu au parking à une heure. Vous, ou votre tête. Vous étiez où ? » ← *J'étais chez moi* · → *Demandez au virage*
12. **Six heures** — *téléphone de l'appartement.* Vukić : on a trouvé Gigi sous la passerelle, la mâchoire cassée, un masque dans la main. « Il demande à te voir. Toi, pas la police. » ← *J'y vais maintenant* · → *La police d'abord*
13. **L'ardoise** — *cabinet du Doc.* Gigi, la mâchoire tenue par des fils, écrit à la craie : TON PÈRE A PRIS L'ENVELOPPE. J'AI LAISSÉ PASSER LES TROIS. Il efface avec sa manche avant que tu aies fini de lire. ← *Écrivez-le encore* · → *Effacez tout*
14. **Intermède : le virage** — *rêve.* La Nord est pleine ; trois mille personnes portent ton visage et chantent avec ta voix. Au dernier rang, une seule tête sans masque regarde ailleurs, vers la Rive. Un bouton : *Je monte les marches*
15. **La saisie** — *parking du stade, après le match.* La dépanneuse de la police emporte ta voiture devant la Nord qui sort ; dans le coffre, sous scellés, un masque que tu n'y as pas mis. Gégé, à la grille : « On chante, ou on se tait ? » ← *Chantez* · → *Taisez-vous*
16. **La lettre** — *appartement, nuit.* La dernière lettre d'Henri, lue jusqu'au bout : « J'ai fait ce qu'il fallait pour ta mère. Le reste, Vaubourg le sait. Ne reviens pas. » ← *Je la brûle* · → *Je la garde sur moi*
17. **Le cadre** — *appartement.* Derrière le carton du maillot encadré, un ticket du tabac du Quai daté de la veille de la finale : Racing perdant, trois buts d'écart. L'écriture est celle de la lettre. ← *Je le montre à Gégé* · → *Je le garde pour moi*
18. **Le coffre** — *bureau du président, à l'étage.* Vaubourg sort une confession signée d'Henri, 1975, jamais publiée : « Les masques s'arrêtent, elle reste ici. Ils continuent, L'Écho l'a demain matin. » ← *Gardez-la, j'arrête tout* · → *Publiez. Moi aussi*
19. **Le brasero** — *friche, feu de palettes, la veille du dernier match.* Gégé vide les cartons de masques dans le feu. Il en garde un, le regarde longtemps : « Tu lui ressembles quand tu ne dis rien. » Il te le tend. ← *Je le jette au feu* · → *Je le garde*
20. **La salle de presse** — *stade, après le dernier match.* La salle est pleine ; Massenet est au premier rang, son article de 1974 plié sur les genoux. Le négatif d'Odette est dans ta poche. ← *Je dis tout sur 1974* · → *Je parle du match*

**Les graines et ce qui les paie.** La photo grattée (scène 1) revient restaurée par le négatif (9), puis volée (saison 2), puis rendue dans ton bureau avec le cinquième visage intact. La phrase de la buvette (4) est peinte sur le mur des guichets en saison 2, et l'inspecteur te la lit. Le maillot (5) paie en saison 3 : le ticket est derrière le carton (17). La plaque sans nom (6) attend sa fin. Le filet que Gigi garde dans le placard de la buvette est rendu dans la fin rare. Les masques comptés par Gégé (« deux mille huit cent douze rendus ») sont l'horloge du livre : chaque nuit masquée en fait sortir, la scène 19 les brûle ou non.

**L'acte final.** Le dernier match de 1992-1993, le maintien en jeu. La veille, deux portes : le brasero (si Gégé connaît le ticket et que la relation tient à +2), ou le masque neuf sans trous pour les yeux que Gégé te tend pour monter aux Hauts-de-Rive. Le soir du match, la salle de presse. Les fins tombent sur ces trois cartes.

### 6. Les soirs, les missions, les sponsors, les biens

**Les événements sombres** (huit ; au réservoir, deux par saison au plus ; en première saison, ton stratégique, jamais drame) :

- **L'homme sous la fenêtre** — rue des Lilas (`domicile`), mardi minuit, saison 1 dès que les masques sont sortis. Un homme masqué, immobile, qui s'en va quand tu descends. Nourrit Camille, l'inspecteur, la peur ; pose `masque_sous_fenetre`.
- **Le feu au local** — sous la Tribune Nord (`stade`), nuit, fin de saison 1. Le local brûle ; Gégé, la bâche de son père sous le bras, compte les cartons : il manque quatre cent douze masques. « Le radiateur, ils diront. » Ouvre la question de saison 2 : qui a pris les masques, et qui a mis le feu.
- **La berline** — parking du stade (`parking`), une heure, saison 2. Scène 10.
- **La vitrine** — Banque Aubérivoise (`banque`), nuit, saison 2. « 1974 » à la peinture rouge sur la vitrine, un masque scotché au distributeur. Le directeur, qui a prêté à Vaubourg l'argent de 1977, t'appelle chez toi à minuit pour te demander « ce que vous voulez, exactement ».
- **Les archives** — rédaction de L'Écho (`echo`), 22 h, saison 2. Massenet seul dans la salle des archives vidée, un masque posé sur sa chaise : « Ils veulent que je relise ce que j'ai écrit ? Je l'ai relu tous les ans. »
- **La passerelle** — la passerelle sur la Rive (`rue`), 23 h, ancre d'hiver de la saison 2. On n'entend qu'un cri et des pas sur le quai ; la carte suivante est celle de Vukić à six heures (scène 12), puis le sang lavé au jet sur la pierre.
- **Le coup de fil de trois heures** — appartement (`domicile`), saison 3. Une voix calme : « Samedi soir, on finit. Mets ton masque. » Puis la tonalité.
- **Le cercueil** — devant la grille du stade (`stade`), posé dans la nuit, saison 3 si le virage se retourne (tribunes basses ou relation de Gégé ≤ −1). Un cercueil en contreplaqué, et dessus, peint en blanc : RAVENEL. La ville apprend qui tu es avant que tu le dises.

**Les missions** (trois) :

- **Les masques du square** — donneur : Nino (`square`, soir), si les masques sont sortis. Il les revend dix francs aux gamins. Lui racheter tout son stock (cinq cents francs) fait baisser le compte de Gégé, qui le remarque ; le dénoncer à son oncle coûte une gifle à Nino et un point de relation. Pose `vl_masques_rachetes`.
- **Le registre du Quai** — donneur : le buraliste du tabac du Quai (`tabac`, matin), si tu possèdes le maillot ou si la pellicule est tirée. Cinq mille francs pour consulter le registre des paris de 1974 : un pseudonyme, « M. Jean-Marie », trente mille francs sur la défaite. Le fils du bookmaker prévient Vaubourg le soir même. Pose `vl_registre_lu`.
- **Le carton de Gégé** — donneur : Gégé (`buvette`, soir), si la relation est à +1. Garder un carton chez toi une semaine, « des masques, et autre chose ». La perquisition de Lhoste le trouve, ou non (tirage du metteur en scène). Trouvé, il ouvre la porte de la garde à vue.

**Les sponsors** :

- **Cartonnages de la Rive** (propre, en apparence) — l'imprimeur des masques propose de les vendre à la boutique, quinze francs pièce, son nom sur le short en échange. L'argent est propre (`ville_francs`) ; les masques se multiplient, et le compte de Gégé devient faux.
- **Les Courses du Quai** (louche) — le fils du bookmaker de 1974 offre une « prime de maintien » en liquide, versée si le Racing perd par moins de deux buts contre trois clubs désignés. L'argent est sale (`ville_francs_sales`) ; c'est 1974 qui recommence, et le joueur qui accepte le sait. La dette de Gigi à l'arrière-salle du Terminus (l'intrigue existante `en.sp.gigi`) reste au réservoir : Gigi rejoue sa jeunesse sous tes yeux.

**Les biens et la saisie.** Un entraîneur promu sans un sou gagne vingt-cinq mille francs par mois : le **maillot de 1974** (trente-cinq mille, aux enchères de la boutique) coûte plus d'un mois de salaire, et c'est le seul achat qui compte — il paie en saison 3 (scène 17). Le **costume de confection** de Brunel sert au plateau du dimanche soir. La villa des Hauts-de-Rive, si l'intrigue existante de *La maquette* l'offre, est la cage dorée de Vaubourg. **La saisie** est le tournant de la saison 2 : la police emporte ta voiture du parking du stade devant la Nord qui sort (`saisie_vehicules`), un masque sous scellés dans le coffre (scène 15). Si l'argent du Quai a payé quelque chose, la brigade revient en saison 3 pour le reste (`saisie_luxe`).

### 7. Ce que dit la ville

- *Passant, toi* — si `flag(masques_tifo)` : « Ma fille dort avec votre tête sur la table de nuit. Le carton, je veux dire. Elle dit que vous la gardez. »
- *La boulangère, toi* — si `flag(masques_tifo)` : « On m'a payé avec votre visage plié dans les billets. Je l'ai mis sous la caisse. On ne sait jamais, avec vous. »
- *Ancien, époque* — si `saison == 1` : « Votre façon de vous tenir debout sur le banc, les mains dans le dos… J'ai vu ça une fois. En 1974. Ça ne vous dit rien ? »
- *Enfant, toi* — si `flag(masques_tifo) && tranche == soir` : « Je suis toi ! » (un gamin du square, ton visage sur le sien, qui file vers le kiosque)
- *Fan, club* — si `tribunes >= 80` : « Trois mille, coach. On en refait mille pour le derby. Gégé dit que vous n'aimez pas trop. Vous n'aimez pas ? »
- *Passante, sombre* — si `flag(masque_sous_fenetre)` : « Il était sous votre fenêtre, ou c'était vous ? Avec ces masques, je ne sais plus qui j'ai salué ce matin. »
- *Le garagiste du Pont, sombre* — si `flag(berline_brulee)` : « La berline du président, on l'a remorquée à deux heures. Le masque était encore sur le capot. Personne n'a voulu le toucher. »
- *Ancien, rumeur* — si `flag(phrase_buvette)` : « "Ceux de 74 paieront." C'est peint sur le mur des guichets. On dit que la phrase est de vous. Elle est de vous ? »
- *Gégé, toi* — si `relation.gege >= 2` : « Ton père buvait son café debout, sans sucre, en regardant la pelouse. Le virage l'a remarqué chez toi avant moi. »
- *Josiane, club* — si `flag(photo_volee)` : « La photo de l'escalier a disparu cette nuit. Il reste le clou. Je ne sais pas ce qu'on accroche, maintenant. »
- *Passant, sombre* — si `flag(passerelle)` : « Sous la passerelle, ils ont tout lavé au jet. Il reste une tache sur la pierre. Les gamins font le tour par le pont. »
- *Gigi Vecchio, toi* — si `flag(ardoise_lue)` : « Le filet de 74 est dans le placard de la buvette. Je ne l'ai jamais rendu à personne. Tu le veux ? »
- *Le buraliste du Quai, argent* — si `possede(maillot_1974)` : « Le maillot du 5, c'est vous ? Mon père prenait les paris, cette année-là. Il disait que le 5 ne regardait jamais les tribunes. »
- *Fan, sombre* — si `flag(voiture_saisie)` : « Ils ont emmené votre voiture devant toute la Nord. On a chanté votre nom quand même. Plus fort, même. »
- *Ancien, époque* — si `flag(nom_grave)` : « Ravenel, sur la plaque. Il était temps. On a eu honte assez longtemps à sa place, ou à la nôtre. »

### 8. Les fins

- **Le nom sur la plaque** (`promu_plaque`, la vérité) — tu dis tout en salle de presse, le négatif est publié, la plaque est gravée. *« {prenom} {nom} a fait graver au caveau du Racing le nom de son père et, dessous, ce qu'il avait fait. On le lit encore le jour des Rameaux, et personne ne sait s'il faut s'arrêter devant. »*
- **Les masques ont gagné** (`promu_vengeance`, le prix) — Vaubourg tombe (la perquisition trouve l'argent de 1977), le Racing tombe avec lui. *« Les masques sont montés aux Hauts-de-Rive le soir du dernier match ; Vaubourg est tombé le lundi, et le Racing avec lui. {prenom} {nom} a gardé le dernier masque dans un tiroir, celui qui avait ses yeux. »*
- **Le virage sans masque** (`promu_brasero`, rare) — Gégé connaît le ticket, la relation tient à +2, les masques brûlent à la friche, le Racing se maintient. *« La veille du dernier match, {prenom} {nom} et Gégé ont brûlé deux mille huit cents visages dans le feu de la friche, et le Racing s'est maintenu sans en porter un seul. Gigi a rendu le filet de 1974 ; il pend au local, au-dessus de la porte. »*
- **Le visage** (`promu_visage`, pire que la garde à vue) — tu montes aux Hauts-de-Rive avec le masque ; un gamin du virage tombe du mur de la villa. *« Un garçon de dix-neuf ans est tombé du mur des Hauts-de-Rive, un masque sur la figure : c'était celle de {prenom} {nom}. Le procès a duré deux ans, et la Nord n'a plus jamais imprimé personne. »*
- **Le car de six heures** (`promu_car`) — tu repars sans rien publier. *« {prenom} {nom} a repris le car de six heures, comme sa mère en 1975, le négatif dans la poche. La plaque du caveau est restée sans nom ; le gardien dit qu'on vient la regarder. »*
- **La garde à vue** (`co_garde_a_vue`, ligne propre) — le carton de Gégé trouvé chez toi, ou l'argent du Quai. *Epitaph_plus : « Quarante-huit heures au commissariat avec un carton de masques comme pièce à conviction ; à la fin, Lhoste a demandé lequel était le vrai. »*
- **L'otage du kop** (`en_otage`, ligne propre) — *« Le virage a gardé {nom} comme on garde un visage : imprimé, plié, ressorti les soirs de match. »*
- **Le coupable désigné** (`en_coupable`, ligne propre) — *« On a mis les nuits masquées sur le compte de {nom}, et le budget à zéro par-dessus ; le président a parlé de complot. »*

### 9. La question de saison et les objectifs

**Le fil rouge** garde ses trois ids (`tribune / president / argent`) et change de sens : *Ce club est à qui : à la tribune qui porte ton visage, au président qui a payé sa place avec la finale, ou à l'argent du Quai qui parie depuis 1974 ?* La réponse tirée colore les variantes d'ancre (le chant, le coffre, la prime).

**Les objectifs** : saison 1, le maintien sans dire qui tu es ; saison 2, le maintien et le négatif ; saison 3, le dernier match et la plaque. Les trois objectifs cachés gardent leurs ids et changent d'habit : `promu_deux_maintiens` (« Tenir. Encore. »), `promu_a_lancienne` (refuser Ilyas **et** le Quai : « Il y a de l'argent qui frappe à la porte depuis 1974. »), `promu_banc_gigi` devient *Le filet de Gigi* (Gigi te rend le filet de la finale : « Un gardien de quarante et un ans a gardé autre chose que ses gants. »).

### 10. Le volume, et ce que le livre laisse au monde

**À produire** : prologue, 6 cartes (3 réécrites depuis l'existant) ; script, 12 ancres ; 8 intrigues propres (*Les masques*, *La pellicule*, *La plaque*, *Le maillot*, *Lhoste*, *Ce que Gigi a vu*, *Le coffre*, *Massenet, 1974* : 33 cartes) ; 8 événements sombres (18 cartes) ; 3 intermèdes ; 28 cartes de décor et de routine ; 12 réactions ; une dizaine de variantes « Ravenel » des intrigues existantes du promu, qui restent au réservoir. Soit **environ 125 cartes neuves pour 170 à 190 cartes vécues**. 5 fins neuves et 3 lignes d'épitaphe ; 14 manchettes (« LE VIRAGE AUX TROIS MILLE VISAGES », « LA BERLINE DU PRÉSIDENT », « QUI PORTE LE MASQUE ? », « RAVENEL ») ; 45 répliques de ville ; 3 missions ; 2 sponsors.

**Ce que le livre laisse au monde** : en 1990, le kop du Racing a fait imprimer trois mille masques en carton d'un même visage ; il en reste dans des greniers et au fond d'un tiroir du club-house. Henri Ravenel, capitaine de la finale de 1974, a été retiré de la Rive en mars 1975 ; la plaque neuve du caveau a été payée en 1989 par un homme en écharpe. Nino, le neveu de Gégé, vendait des masques au square à six ans. La photo de 1974 a quitté l'escalier du club-house pendant l'hiver 1991 ; le clou est resté au mur.

---

## Histoire 2 — Le Sapin en carton

### 1. La fiche

**Rôle** : entraîneur · **Postulat** : `interimaire` (index 1, 1990, Division 2 ; jauges, force, objectif et drapeaux inchangés) · **Club** : le Racing Aubérive, en deuxième division, après huit journées · **Président** : Jean-Marie Vaubourg (`aulard`) · **Saisons** : 1990-1991 (dès la neuvième journée), 1991-1992, 1992-1993 · **Ancien titre** : *L'intérimaire*.

> **Quatrième de couverture**
>
> Roland Mercadier a été « remercié » après huit journées. C'est ce que dit le communiqué. Personne ne l'a vu partir. Sa berline grise est restée sur la place peinte ENTRAÎNEUR, un sapin en carton au rétroviseur ; sa compo est encore punaisée au mur du vestiaire ; le matin, sa cafetière est chaude.
>
> On te donne son bureau, son sifflet et son adjoint, pour six semaines, « jusqu'à nouvel ordre ». Tu n'as pas le diplôme. Tu as besoin de ce banc.
>
> Le premier lundi, à sept heures, le répondeur du bureau clignote. Une voix fatiguée, un car qui passe derrière : « C'est Roland. Ne mets pas Bréhaut samedi. » Le lendemain, le Doc trouve ce que personne n'avait dit : le genou de Bréhaut a lâché jeudi.
>
> Chaque lundi, un message. Chaque fois, il a raison. Et une nuit de décembre, la place ENTRAÎNEUR est vide.

### 2. Le genre et la touche

**La disparition.** Le livre ne cherche pas un corps : il cherche pourquoi tout le monde a besoin qu'il n'y en ait pas, ou qu'il y en ait un. Le club a besoin d'un homme disparu, l'assureur d'un homme parti, le réseau de paris d'un homme mort, et toi d'un homme absent : ton banc n'existe que tant qu'il n'est pas là.

**La touche : le répondeur et la voiture.** Le répondeur à microcassette du bureau parle chaque lundi avec la voix de l'absent ; derrière lui, toujours le même bruit, un car qui manœuvre, des pièces qui tombent. La berline, elle, bouge la nuit : trois mètres, de la boue blanche sur les roues, un sapin neuf. C'est l'horloge du livre, visible sur le parking quand on passe en ville. L'intermède : six heures, la brume sur le terrain annexe, un homme siffle sans bruit sur le banc, se retourne, et c'est toi avec dix ans de plus. L'humour à froid est celui de l'assureur : « Sans corps, c'est un départ en vacances. Nous ne remboursons pas les vacances. »

### 3. Le personnage joué

Quarante-trois ans, entraîneur des moins de dix-sept ans du Racing, trois tampons sur quatre au stage fédéral. On te donne le banc parce que tu es là, que tu coûtes peu et qu'on peut te reprendre. **Ce qu'il veut** : ce banc, pour de bon ; le contrat en trois pages. **Ce qu'il cache** : le quatrième tampon qui manque ; puis, dès la deuxième saison, qu'il sait où dort Roland Mercadier.

### 4. La distribution

- **Jean-Marie Vaubourg** (`aulard`) — Mercadier est venu lui montrer, un soir d'octobre, un carnet de paris où figuraient deux joueurs du Racing. Vaubourg l'a « remercié » pour enterrer l'affaire : un scandale de matchs arrangés, c'est la rétrogradation administrative. Puis il a relu la police d'assurance « homme-clé » signée en 1989 : deux millions de francs si l'entraîneur décède, et un juge peut déclarer mort un homme disparu au bout d'un an et un jour.
- **Zoran Vukić** (`vukic`) — six ans adjoint de Mercadier. Il pose les plots à la même place, il connaît la cabine où son ancien patron téléphonait le lundi. Il te teste avant de t'aider.
- **Madame Josiane** (`josiane`) — chaque soir à huit heures, elle traverse la friche avec un cabas. C'est elle qui rebranche la cafetière le matin, « ça fait moins vide ». Son frère, l'homme au blouson gris de la laverie, porte les messages de Roland sans les lire.
- **Titi Bréhaut** (`brehaut`) — capitaine, fidèle à Mercadier. Le premier message le sauve ou le casse.
- **Dembo** (`dembo`) — avant-centre, vingt-quatre ans, une dette à l'arrière-salle du Terminus ; l'un des deux noms du carnet.
- **Pierre Massenet** (`meneche`) — il parie sur l'intérimaire au tabac du Quai (l'intrigue existante *Le pari de Massenet*) et sent l'histoire avant tout le monde.
- **Léa** (`lea`) — vingt-cinq ans, à L'Écho : elle remarque que le réverbère du parking a été « coupé de minuit à deux heures » la nuit où la voiture a disparu. Elle vérifie, elle cite.
- **Gégé** (`gege`) — le virage chante encore Mercadier à la vingtième minute (l'intrigue existante *Le kop qui doute*).
- **Rocco Fardelli** (`fardelli`) — il place le « grand nom » que Vaubourg veut pour janvier (*Le grand nom*) ; le jour où Mercadier sera mort sur le papier, le grand nom signera.
- **Gigi Vecchio** (`vecchio`), **Noé Berthomier** (`legruet`), **Dan Corven** (`clow`), **Camille** (`camille`) — le diplôme, la dérogation, le stage, la maison : le réservoir de l'intérimaire reste et respire autour du mystère.

**Les visages nouveaux**

- **Roland Mercadier**, 52 ans — l'entraîneur disparu. Il vit dans le wagon abandonné de la friche, une radio à piles sur le matelas. Ce qu'il veut : rester en vie, et voir le Racing tenir. Son secret : en 1987, il a parié une fois contre son équipe, en Coupe ; le ticket est dans la poche de quelqu'un, et c'est pour ça qu'il ne va pas à la police.
- **Norbert**, 45 ans — le chauffeur du car du club, celui que tout le monde trouve « normal », qui dort dans le car pendant les matchs. Il tient l'arrière-salle du Terminus ; le « patron de la table » n'est qu'une façade. Il entend tout ce qui se dit dans le car. Ce qu'il veut : le carnet. Son secret : c'est lui qui a le ticket de 1987.
- **Monique Mercadier**, 49 ans — la femme de l'absent. Elle appelle le secrétariat chaque matin à dix heures. Son secret : il l'a appelée une fois, de la cabine, et elle n'a rien dit ; l'assurance-vie de son mari rembourserait le pavillon des Lilas.
- **Monsieur Achard**, 60 ans — inspecteur de La Prévoyance Aubérivoise. Il est le seul à chercher vraiment Mercadier : vivant, il ne paie pas.

### 5. La structure

**Saison 1 (1990-1991) — L'absent.** Le prologue existant reste : la pluie sur la tôle, la berline sur la place peinte, le sifflet de l'autre dans le tiroir, la compo au mur. Le premier lundi, le répondeur. Bréhaut. Monique. La voiture qui a bougé. L'arrière-salle du Terminus, où Norbert te sert un café entre le tapis vert et le cendrier. Dembo à la friche. À la laverie de la rue du Stade, où l'on lave les maillots depuis que l'huissier a pris la machine du club, un homme en blouson gris pose une enveloppe kraft sur le hublot de la 4 : une page arrachée d'un carnet, un match, deux noms, une cote. À l'ancre d'hiver, un dernier message : « Ne me cherche pas. Garde le banc. Et ne monte jamais seul dans le car avec lui. » La saison finit sur la place vide et la flaque d'huile. Le verdict de l'intérim (confirmé, prolongé, déchu) et le contrat ou la porte restent aux ancres existantes.

**Saison 2 (1991-1992) — Le wagon.** L'assureur s'installe. Le lundi à 6 h 40, la cabine de la gare routière : un homme en casquette te voit dans la vitre et raccroche. Le soir, le cabas de Josiane jusqu'au wagon : Mercadier vivant, maigre, qui veut savoir si tu as gagné samedi. Le carnet est dans la roue de secours de sa berline ; la berline est sous une bâche dans la cour du garage du Pont, puis elle n'y est plus. La panne du car, une nuit d'hiver, seul avec Norbert. La saison finit au bord de la Rive : un bruit d'eau, le car du club tous feux éteints sur le quai, et le sapin en carton qui tourne sur l'eau.

**Saison 3 (1992-1993) — Un an et un jour.** L'audience est fixée en avril : le jugement déclaratif de décès. Le jour où Mercadier mourra sur le papier, tu auras ton contrat et le club ses deux millions. Mercadier tousse dans le wagon. Norbert sait où chercher depuis que tu y vas. L'acte final : la nuit où le wagon brûle, puis le dernier match.

**Les vingt scènes clés**

1. **La place peinte** — *parking du stade, prologue.* Sur la place ENTRAÎNEUR, la berline grise de l'autre, un sapin en carton au rétroviseur, un ticket de stationnement de la semaine dernière sous l'essuie-glace. ← *Je me gare à côté* · → *Je me gare loin*
2. **Les cartons** — *bureau de l'entraîneur, prologue.* Josiane hésite entre le tournevis et le scotch : « La plaque est encore à son nom. Je jette ses cartons, ou je les garde ? » ← *Jetez, c'est mon bureau* · → *Gardez-les six semaines*
3. **La diode** — *bureau, lundi 7 h.* La cafetière de Mercadier est chaude, et personne d'autre que Josiane n'a la clé. Sur le répondeur, une diode rouge clignote. ← *J'écoute* · → *J'efface sans écouter*
4. **Le premier message** — *bureau.* Une voix fatiguée, un car qui manœuvre derrière : « C'est Roland. Ne mets pas Bréhaut samedi. Son genou a sonné jeudi, il ne te le dira pas. » ← *Bréhaut sur le banc* · → *Bréhaut titulaire*
5. **Dix heures** — *secrétariat.* Monique Mercadier, au téléphone, comme chaque matin : « Il n'a pas emporté son rasoir. Un homme qu'on vire emporte son rasoir. Vous l'avez vue, sa voiture ? » ← *Elle est au parking* · → *Je ne sais rien*
6. **Trois mètres** — *parking, nuit (événement sombre).* Le gardien du stade te montre la berline : trois mètres plus loin que la veille, de la boue blanche sur les roues, le siège reculé, un sapin neuf. ← *J'appelle la police* · → *Je note, je me tais*
7. **L'arrière-salle** — *Terminus, soir.* Norbert te sert un café entre le tapis vert et le cendrier : « On parle de vous, ici. En bien. Roland, lui, posait trop de questions. » ← *Quelles questions ?* · → *Je bois et je pars*
8. **La palette** — *friche, soir (événement sombre).* Dembo assis sur une palette, deux hommes qui comptent sur leurs doigts. Vukić, à ta portière : « Il leur doit. Il devait aussi une explication à Roland. Tu paies, ou je le ramène ? » ← *Je paie* · → *Ramène-le*
9. **Ne me cherche pas** — *bureau, ancre d'hiver.* Le répondeur : « Garde le banc. Et ne monte jamais seul dans le car avec lui. » Puis des pièces qui tombent dans une cabine. ← *Je garde la cassette* · → *J'efface le message*
10. **La place vide** — *parking, nuit de décembre (événement sombre).* La place ENTRAÎNEUR est vide : une flaque d'huile, des traces de pneus jusqu'à la rue du Stade. Le réverbère est éteint. ← *Je porte plainte* · → *Je fais repeindre la place*
11. **L'assureur** — *bureau du président.* Monsieur Achard pose sa serviette : « Deux millions, homme-clé. Sans corps, c'est un départ en vacances. Nous ne remboursons pas les vacances. » Vaubourg te regarde. ← *Il est parti, c'est tout* · → *Il n'est pas parti*
12. **La cabine** — *gare routière, lundi 6 h 40.* Avant le premier car, un homme en casquette glisse des pièces dans la cabine. Il te voit dans la vitre et raccroche. ← *Je dis son prénom* · → *Je le laisse partir*
13. **Le cabas** — *friche, 20 h.* Josiane traverse la friche sans lampe, son cabas au bras ; elle sait où elle va. Elle frappe deux fois à la porte du wagon. ← *Je la rejoins* · → *Je rentre*
14. **Le wagon** — *wagon, nuit.* Roland Mercadier, en manteau sur un matelas, une radio à piles qui donne les résultats : « Assieds-toi. Tu as laissé Bréhaut sur le banc, samedi ? » ← *Je vous ramène* · → *Je reviendrai*
15. **La roue de secours** — *wagon.* « Le carnet est dans la roue de secours de ma voiture. Quatre ans de paris, les noms, les matchs. Celui qui a la voiture a le carnet. » ← *Je trouve la voiture* · → *Oubliez ce carnet*
16. **La Rive** — *quai, nuit (événement sombre, fin de saison 2).* Un bruit d'eau énorme, puis plus rien. Sur le quai, le car du club tous feux éteints ; dans la Rive, des bulles, et le sapin en carton qui tourne. ← *Je cours vers le car* · → *Je reste dans l'ombre*
17. **Intermède : le banc dans la brume** — *terrain annexe, rêve.* Six heures, le brouillard ; sur le banc, un homme en manteau siffle sans bruit. Il se retourne : c'est toi, avec dix ans de plus. Un bouton : *Je m'assois à côté*
18. **Un an et un jour** — *bureau du président.* Vaubourg tend la convocation du tribunal : audience en avril, « jugement déclaratif de décès ». « Ce jour-là, tu as ton contrat. Il est mort, pour toi ? » ← *Il est mort pour moi* · → *Il est vivant*
19. **Le wagon brûle** — *friche, nuit (acte final).* Le wagon flambe ; Mercadier tousse dans la boue, en chaussettes. Derrière le feu de palettes, une veste de chauffeur. Josiane arrive en courant, sans cabas. ← *Je cours vers Norbert* · → *J'emmène Roland*
20. **La feuille de match** — *stade, dernier match.* Au premier rang du virage, entre deux écharpes, une casquette que tu reconnais. Vukić a vu aussi : « Sur la feuille, je mets son nom, ou le tien ? » ← *Le sien* · → *Le mien*

**Les graines et ce qui les paie.** Le sapin du prologue revient sur l'eau (16), et dans un autre livre au rétroviseur d'une épave (*La Maquette*). La cafetière chaude (3) est le rituel de Josiane, que le cabas révèle (13). La cassette du répondeur, si tu la gardes (9), prouve qu'un homme « disparu » parlait encore en janvier : c'est l'arme contre l'assurance et contre Vaubourg. Le conseil « ne monte jamais seul dans le car avec lui » (9) paie dans la panne de la saison 2. Le ticket de 1987, tenu par Norbert, est ce qui empêche Mercadier de témoigner : il paie dans la fin de la vérité (il témoigne quand même, et il paie aussi).

**L'acte final.** La nuit du feu au wagon (19), deux portes : courir vers Norbert (la vérité, ou le pire) ou emmener Roland (le prix, ou la fin rare). Le dernier match (20) décide de la feuille et du banc.

### 6. Les soirs, les missions, les sponsors, les biens

**Les événements sombres** (neuf) :

- **Trois mètres** — parking (`parking`), nuit, saison 1. Scène 6 ; pose `voiture_bougee`.
- **L'homme au blouson gris** — laverie (`laverie`), 22 h, saisons 1 et 2 : le fil existant (`sb.laverie` et ses deux suites), réhabillé pour ce livre. Trois enveloppes kraft sur le hublot de la 4 : une page du carnet de Roland (un match, deux noms, une cote) ; la copie de la police « homme-clé » de 1989 ; puis un seul mot, NORBERT. L'homme est le frère de Josiane ; il ne dit pas d'où viennent les enveloppes, et il ne lave jamais rien.
- **La palette** — friche (`friche`), soir, saison 1 : l'événement existant *Le joueur qui ne vient pas*, habillé pour Dembo et le carnet.
- **La place vide** — parking, nuit de décembre, fin de saison 1. Scène 10 ; pose `voiture_partie`.
- **Le coup de fil de trois heures** — appartement (`domicile`), saison 2. Une voix calme, sans bonjour : « Il est où ? » Puis : « Tu sais de qui je parle. » La tonalité.
- **La panne** — sur la route du retour, puis la gare routière (`gare`), nuit d'hiver, saison 2. Le car tombe en panne à vingt kilomètres ; les joueurs rentrent en taxi, tu restes avec Norbert à attendre la dépanneuse. Il parle des cabines, de la Rive en hiver, de Roland « qui aimait trop les carnets ». Rien n'arrive. C'est le pire moment du livre.
- **La Rive** — quai (`rue`), nuit, fin de saison 2. Scène 16 ; pose `rive_voiture`.
- **La maison visitée** — rue des Lilas (`domicile`), saison 3, après la saisie : l'événement existant des biens, retourné. On a fouillé chez toi sans rien prendre ; la cassette du répondeur a disparu, ou elle est restée dans ta poche.
- **Le wagon brûle** — friche (`friche`), nuit, acte final. Scène 19.

**Les missions** (trois) :

- **La dette de Dembo** — donneur : Dembo (`bar`, le Corner, soir), si `flag(palette)`. Vingt mille francs pour solder l'arrière-salle. Payer en liquide sale passe par la table du Terminus et pose `vl_dette_dembo` (la brigade s'y intéresse en saison 3) ; refuser le laisse à Norbert.
- **La roue de secours** — donneur : Roland Mercadier (`wagon`, nuit), si `flag(wagon_vu)`. Retrouver la berline sous sa bâche dans la cour du garage du Pont, la nuit, et ouvrir la roue de secours. Réussir rapporte le carnet (`vl_carnet`) ; échouer fait venir la police municipale et prévient Norbert.
- **La cabine** — donneur : Léa (`echo`, après-midi), si `saison >= 2`. Elle a relevé les heures des appels de la cabine de la gare routière ; elle te demande d'y être lundi à 6 h 40 (c'est la scène 12). Pose `vl_cabine`.

**Les sponsors** :

- **Les Cars du Quai** — l'entreprise du cousin de Norbert offre au club un car neuf pour deux saisons, « chauffeur compris ». L'argent est propre sur le papier ; le car est le bureau du réseau, et le fond du car l'endroit où les joueurs viennent payer.
- **La Prévoyance Aubérivoise** — l'assureur propose de floquer son nom sur les maillots si le club renouvelle toutes ses polices. Il préfère payer un sponsoring qu'un mort.

**Les biens et la saisie.** Le club loge l'intérimaire dans l'appartement de fonction du quai, celui où Mercadier dormait la semaine : sa robe de chambre derrière la porte, son rasoir sur le lavabo. Tu vis dans ses affaires. **La saisie** tombe la nuit de la Rive (fin de saison 2) : pour montrer sa bonne foi à l'assureur, Vaubourg reprend l'appartement de fonction (`saisie_logement`) ; tu redescends rue des Lilas avec deux sacs, et le rasoir dans l'un d'eux. Le reste est modeste : une citadine d'occasion au garage du Pont (c'est là que la berline dort sous sa bâche), un costume de confection pour le plateau quand l'histoire sort.

### 7. Ce que dit la ville

- *Passant, rumeur* — si `saison == 1` : « La voiture de l'ancien est toujours au parking ? On dit qu'il est parti en train. Qui part en train et laisse sa voiture ? »
- *Lulu, le gardien du stade, sombre* — si `flag(voiture_bougee)` : « Trois mètres. Je l'ai mesurée au pas, la berline. Elle a roulé cette nuit, et moi j'ai dormi. Je ne dors jamais. »
- *La boulangère, toi* — si `jour == lun && tranche == matin` : « Vous avez la tête de quelqu'un qui a écouté un répondeur. Mon mari avait cette tête-là, le lundi. Une baguette ? »
- *Ancien, club* — si `saison == 1` : « Cinq entraîneurs en huit ans. Celui-là n'a même pas dit au revoir à Paulette. Il lui disait toujours au revoir, à la 14B. »
- *Fan, match* — si `serie_v >= 2` : « La Nord chante encore Mercadier à la vingtième. Ce n'est pas contre vous. On ne sait pas encore comment chanter votre nom. »
- *Enfant, quartier* — si `tranche == soir` : « Il y a un monsieur qui dort dans le wagon de la friche. Ma mère dit que c'est un fantôme qui écoute la radio. »
- *Le buraliste du Quai, argent* — si `flag(arriere_salle)` : « L'arrière-salle, c'est Norbert qui ferme. Le patron de la table, c'est une vitrine. Moi, je n'ai rien dit, je vends des timbres. »
- *Léa, sombre* — si `flag(voiture_partie)` : « Une voiture ne disparaît pas d'un parking éclairé. Le réverbère a été coupé de minuit à deux heures. La mairie dit : un fusible. »
- *Josiane, toi* — si `relation.josiane >= 2` : « Je rebranche la cafetière le matin. Ça fait moins vide. Ne me demandez pas pour qui. »
- *Monique Mercadier, toi* — si `flag(appartement_quai)` : « Vous dormez au quai ? Alors vous l'avez vu, le rasoir. On n'abandonne pas un rasoir. »
- *Gigi Vecchio, club* — si `saison == 2` : « Roland disait : le car, c'est l'endroit où les gens parlent, parce qu'ils croient que le chauffeur n'écoute pas. »
- *Passant, sombre* — si `flag(rive_voiture)` : « Les pompiers ont plongé jusqu'à minuit. Ils ont remonté un sapin en carton. La voiture, la vase l'a gardée. »
- *Fan, club* — si `flag(cdi_signe)` : « Votre plaque est sur la porte, maintenant. Celle de l'autre est dans le tiroir de Josiane. Elle ne jette rien. »
- *Zoran Vukić, toi* — si `flag(wagon_vu)` : « Je ne te demande pas où tu étais hier soir. Je te demande s'il mange. »
- *Ancien, époque* — si `flag(mercadier_revenu)` : « Mercadier au Corner, un demi devant lui, comme si de rien n'était. Il a maigri. Il a dit bonjour à tout le monde, même à Norbert. »

### 8. Les fins

- **Le revenant** (`interim_revenant`, la vérité) — Mercadier témoigne avec la cassette et le carnet ; Norbert est arrêté, deux joueurs suspendus, le Racing rétrogradé sur tapis vert. *« {prenom} {nom} a ramené Roland Mercadier du wagon de la friche jusqu'au tribunal de Portclair, et le Racing est descendu sur tapis vert. On lui a pris le banc ; on lui a laissé la cassette. »*
- **La place de l'autre** (`interim_place`, le prix) — Mercadier est déclaré mort en avril, l'assurance paie, tu signes. *« Roland Mercadier est mort sur le papier un mardi d'avril, et {prenom} {nom} a signé son contrat le mercredi. Le lundi, à sept heures, le répondeur ne clignote plus ; on le regarde quand même. »*
- **Les deux bancs** (`interim_deux_bancs`, rare) — le carnet est retrouvé, Vukić et Josiane sont à +2, tu mets son nom sur la feuille et le Racing tient. *« Le dernier match s'est joué avec deux entraîneurs, l'un sur le banc, l'autre en casquette au premier rang du virage. Au coup de sifflet, la casquette a pris le car de six heures dix ; {prenom} {nom} a gardé le sifflet. »*
- **Le suivant** (`interim_suivant`, pire) — tu cours seul vers Norbert, sans Vukić ni Josiane derrière toi. *« Au printemps, un nouvel intérimaire a trouvé une compo punaisée au mur, une cafetière tiède et une voiture garée sur la place ENTRAÎNEUR. C'était celle de {prenom} {nom}, et personne n'avait assisté au départ. »*
- **La garde à vue** (`co_garde_a_vue`, ligne propre) — trouvé près du wagon en feu, ou l'argent de Dembo tracé. *« Quarante-huit heures pour expliquer la friche à deux heures du matin, un carnet de paris dans la poche et l'odeur d'essence sur les manches. »*
- **Le message de 23 h 47** (`en_sms`, ligne propre) — *« Vaubourg l'a écrit avec une faute, comme toujours ; Roland, lui, aurait appelé. »*
- **Le dauphin** (`en_dauphin`, ligne propre) — *« Vukić a pris le banc et gardé les deux plaques dans le tiroir du milieu. »*

### 9. La question de saison et les objectifs

**Le fil rouge** garde ses ids (`vestiaire / diplome / grand_nom`) : *Tu tiens la place de qui : du vestiaire qui l'attend, du papier que tu n'as pas, ou du grand nom qu'on attend pour le jour où il sera mort ?* **Les objectifs** : saison 1, garder le poste (six semaines, puis juin) ; saison 2, le contrat — et savoir ; saison 3, un an et un jour. Les objectifs cachés gardent leurs ids (`interim_garder_poste`, `interim_sans_papier`, `interim_adjoint_fidele`) ; le troisième prend son sens : l'adjoint de l'autre devient le tien le soir où il te demande « s'il mange ».

### 10. Le volume, et ce que le livre laisse au monde

**À produire** : prologue existant gardé (2 variantes réécrites) ; script, 12 ancres (l'ancre « le retour de l'ancien » de la saison 1, où l'ancien signait chez le rival, est remplacée par « la place vide ») ; 7 intrigues propres (*Le répondeur*, *La berline*, *L'arrière-salle*, *Le wagon*, *Un an et un jour*, *La Prévoyance*, *Dembo* : 32 cartes) ; 9 événements sombres (20 cartes, dont les trois enveloppes du fil existant de la laverie, réécrites) ; 3 intermèdes ; 28 cartes de décor ; 12 réactions ; le réservoir existant de l'intérimaire gardé (le diplôme, le grand nom, le kop qui doute), avec une dizaine de variantes qui lisent la disparition. Soit **environ 120 cartes neuves pour 170 à 190 vécues**. 4 fins neuves et 3 lignes ; 14 manchettes (« OÙ EST MERCADIER ? », « UN SAPIN DANS LA RIVE », « L'INTÉRIMAIRE EST TITULAIRE », « LE CHAUFFEUR ») ; 45 répliques ; 3 missions ; 2 sponsors.

**Ce que le livre laisse au monde** : à l'automne 1990, la berline grise de l'entraîneur Roland Mercadier est restée sur la place ENTRAÎNEUR du parking, un sapin en carton au rétroviseur ; elle a disparu une nuit de décembre. Mercadier n'a plus jamais entraîné le Racing. Norbert conduisait le car du club.

---

## Histoire 3 — La Sirène

### 1. La fiche

**Rôle** : joueur · **Postulat** : `pepite` (index 2, 1990, Division 2 ; jauges, force, drapeaux et président narratif — Fardelli — inchangés) · **Club** : le Racing Aubérive, en deuxième division, « le club de l'usine » : la Tréfilerie est de l'autre côté du parking ; ses vieilles halles sont une friche depuis 1984, le bâtiment C tourne encore · **Saisons** : 1990-1991, 1991-1992, 1992-1993 · **Ancien titre** : *La pépite du club-usine*.

> **Quatrième de couverture**
>
> À seize heures, la sirène de la Tréfilerie traverse le parking du stade. Ta mère finit au bâtiment C ; elle ralentit devant le grillage sans jamais s'arrêter. Au-dessus du crochet du fond, ton nom au feutre sur du sparadrap. Dessous, un autre nom, mal arraché. On lit encore DID.
>
> Tu as dix-neuf ans. L'usine ferme à Noël, et tu es la dernière chose que cette ville fabrique. Tout le monde veut te vendre. Fardelli avance l'argent sans compter, le garage du Pont a un coupé rouge sous une bâche, et le Rideau Rouge ouvre sa porte sans poignée à ceux qui ont un prix.
>
> On t'a dit que Didier jouait à l'étranger. On te dit beaucoup de choses.
>
> Une nuit de février, longtemps après la fermeture, la sirène de l'usine morte se remet à hurler. Il est trois heures. Tu ouvres les yeux sur le béton de la grande halle, et tu ne te rappelles pas le chemin.

### 2. Le genre et la touche

**La descente aux enfers.** Une chute en trois temps — l'argent, la nuit, le corps — vue de l'intérieur, avec la ville pour témoin : la boulangère qui voit passer le coupé, l'épicière qui tient encore l'ardoise de ta mère, le gardien du stade qui compte les nuits. La vérité au fond du puits : ta chute n'est pas un accident, c'est un produit. On casse les gamins pour les racheter.

**La touche : la sirène.** Vivante, elle sonne à seize heures ; à Noël, elle sonne une dernière fois devant toute la ville ; puis elle se tait, et un soir de février elle hurle à trois heures du matin. Quelqu'un, dans la tour de la grande halle, tire la poignée chaque fois qu'un gamin du Racing descend. En appoint : les masques de soie du Rideau Rouge, où personne n'a de nom ; les nuits qu'on ne se rappelle pas et qui finissent à la friche ; l'intermède de l'usine qui tourne la nuit sans ouvriers, ton père à la tréfileuse qui ne se retourne pas ; l'humour à froid de Fardelli (« Tu ne dois rien à personne. Tu me dois tout à moi, ce n'est pas pareil. »).

### 3. Le personnage joué

Dix-neuf ans, né dans la cité de la Tréfilerie. Le père est mort à la tréfileuse en 1986 ; la mère, Odile, tient au bâtiment C. Le meilleur jeune du club depuis Didier. **Ce qu'il veut** : jouer, tout de suite, et garder la maison de la cité, que l'usine vend à ses locataires quand elle ferme. **Ce qu'il cache** : un genou qui a un avis à vingt ans ; puis les avances de Fardelli ; puis la boîte ; puis l'ardoise.

### 4. La distribution

- **Rocco Fardelli** (`fardelli`) — l'agent, le président narratif du postulat. Il avance l'argent de la maison, puis celui du pavillon, puis celui de l'ardoise ; il tient en poche, depuis 1986, un papier signé par ta mère : trente pour cent de ton premier transfert contre vingt mille francs, l'enterrement et les dettes. Il a déjà fait la même chose avec Didier.
- **Jean-Marie Vaubourg** (`aulard`) — « l'usine a besoin d'une vente par an ». Il signe les fax.
- **Madame Josiane** (`josiane`) — trente ans de licences, une seule fausse : celle qui a fait « partir » Didier à l'étranger alors qu'il dormait à la friche. Vaubourg lui avait juré que la mère de Didier toucherait l'argent ; elle l'a vérifié, la mère l'a touché. C'est son unique mensonge, et elle le range à la fin du classeur.
- **Gigi Vecchio** (`vecchio`) — il a vu passer Didier, et la place près de la porte « qui était la sienne, et en juin… ». Il épluche une orange et ne finit pas la phrase.
- **Titi Bréhaut** (`brehaut`) — le capitaine qui te met les bouteilles dans les bras et regarde qui porte.
- **Gégé** (`gege`) — vingt mètres de bâche à ton nom ; il en a déjà plié trois.
- **Doc Sabatier** (`sabatier`) — il écoute ton genou comme une porte, refuse la boîte, et te demande s'il doit écrire ce qu'il entend.
- **Léa** (`lea`) — L'Écho, ta première Une ; puis le journal d'un pays qu'on ne nomme pas qui fait marquer à Didier des buts qu'il ne marque pas.
- **Lian Mbako** (`mbako`) et **sa mère** (`mere_mbako`) — le gamin d'après, seize ans. Sa mère lit tout et signe seule : tout ce que la tienne n'a pas pu faire.
- **Camille** (`camille`), **Nadia Rouvier** (`rouvier`), **Pierre Massenet** (`meneche`) — la maison ; la kiné qui voit les cachets ; le chroniqueur du Quotidien à qui l'on propose les photos avant la Gazette Rose, et qui ne les achète pas.

**Les visages nouveaux**

- **Odile**, 44 ans — ta mère, ouvrière au bâtiment C. Elle veut garder la maison et que tu ne finisses pas comme ton père. Son secret : le papier de 1986 chez Fardelli.
- **Didier Vallin**, 21 ans — le gamin d'avant, « vendu à l'étranger » en juin 1989. Il n'est jamais parti. Il vit dans la grande halle, où il a tracé un terrain à la craie sur le béton, et il a la clé de la tour de la sirène. Ce qu'il veut : qu'on dise son nom à voix haute. Son secret : son nom joue ailleurs, sur la licence d'un autre garçon.
- **Madame Irène**, 55 ans — l'hôtesse du Rideau Rouge, qui tient l'ardoise des jeunes joueurs et la revend à Fardelli. Ancienne lingère du club. Elle appelle ta mère quand tu ne peux plus conduire, et lui ment pour toi. Elle ne fait jamais crédit deux fois.
- **Steph**, 30 ans — l'homme en survêtement neuf de la salle de muscu ; ancien joueur du Racing, il vend la boîte et porte les enveloppes de l'arrière-salle du Terminus.

### 5. La structure

**Saison 1 (1990-1991) — L'argent.** Le prologue existant reste (le crochet, la sirène, les bouteilles, la place près du radiateur ou de la porte, le grillage, Fardelli au parking). En octobre, la lettre de l'usine : fermeture à Noël, les maisons de la cité à vendre aux locataires. Le chèque de Fardelli. Le premier but, la première nuit au Rideau Rouge, l'ardoise. Le genou chez Sabatier. Le 24 décembre, la dernière sirène devant toute la ville. La saison finit sur la visite médicale du grand club (l'ancre existante de la vente, variante du genou caché) : la boîte de Steph pour passer la visite, ou ton genou tel quel ; dans les deux cas, la vente tombe à l'eau — tel quel, le genou parle ; avec la boîte, c'est Fardelli qui réclame dix pour cent de plus la veille de la signature —, et tu restes. On ne vend pas un gamin qui monte : on attend qu'il tombe, et on le rachète.

**Saison 2 (1991-1992) — La nuit.** La boîte. Les photos au café de la Mairie. En février, la sirène à trois heures, et le réveil sur le béton de la grande halle, dans un terrain tracé à la craie. Didier Vallin, vivant. Fardelli avance le pavillon des Lilas pour ta mère sur l'argent d'un transfert qui ne vient pas, par les comptes d'un marchand de spiritueux. La dépanneuse des huissiers devant ton coupé, à la sortie du match, devant la Nord. Ta mère vide ton sac de sport sur la table de la cuisine. La saison finit sur le pavillon saisi : les cartons d'Odile sur le trottoir, les voisins aux fenêtres.

**Saison 3 (1992-1993) — Le corps.** L'arrière-salle du Terminus rachète l'ardoise contre une enveloppe et un match. Momo tombe sous la douche. Léa pose sur son bureau le journal étranger où Didier Vallin, « blond, un mètre quatre-vingt-dix », marque des doublés. Josiane ferme la porte à clé. Fardelli sort le fax d'un petit club au grand avenir, et le papier de 1986. L'acte final : le dernier match, et la sirène.

**Les vingt scènes clés**

1. **Le crochet** — *vestiaire, prologue.* Ton nom au feutre sur du sparadrap ; dessous, un nom mal arraché dont il reste DID. La sirène de seize heures traverse le parking. ← *J'arrache le reste* · → *Je laisse comme ça*
2. **Le grillage** — *grillage du terrain, prologue.* Ta mère ralentit en sortant du bâtiment C, comme chaque jour, sans s'arrêter. Gégé, les doigts dans le grillage : « Si tu viens taper dans nos mains, elle te verra. » ← *Je vais au grillage* · → *Je file au vestiaire*
3. **La lettre de l'usine** — *maison de la cité.* Odile pose la lettre sur la toile cirée : l'usine ferme à Noël, la maison est à vendre, cent quatre-vingt mille francs. « On partira. Ce n'est pas grave. » ← *On ne partira pas* · → *On partira, maman*
4. **Le chèque** — *parking, la voiture de Fardelli.* Il baisse la vitre à moitié, un chèque déjà rempli sur le tableau de bord : « La maison de ta mère. Tu me rendras quand tu vaudras dix fois plus. » ← *Je prends le chèque* · → *Je refuse*
5. **La porte sans poignée** — *Rideau Rouge, samedi soir, après ton premier but.* Du velours, un homme en costume, une musique lente. Madame Irène te tend un masque de soie noire : « Ici, personne n'a de nom. Vous, si : il est sur l'ardoise. » ← *Je mets le masque* · → *Je redescends la rue*
6. **La porte du genou** — *cabinet du Doc.* Sabatier plie ton genou et écoute : « Il a un avis. Je l'écris dans ton dossier, ou je le garde pour moi jusqu'en juin ? » ← *Écrivez-le* · → *Gardez-le pour vous*
7. **La dernière sirène** — *grillage de l'usine, 24 décembre, 16 h.* Toute la ville est au grillage ; les ouvriers sortent avec leurs casiers vidés. Ta mère cherche ton visage dans la foule. ← *Je vais vers elle* · → *Je reste avec l'équipe*
8. **La visite** — *téléphone de la cité, veille de la visite médicale.* Fardelli : « Ton genou, ils ne le verront pas si tu prends ce que Steph te donne ce soir. Huit heures, demain. » ← *Je passe voir Steph* · → *J'y vais tel quel*
9. **La boîte** — *salle de muscu, 21 h (événement sombre).* Steph pose une boîte sans étiquette sur ton banc : « Deux le matin, une le soir. Tout le monde en prend, ici. Didier en prenait. » ← *Je la prends* · → *Je la laisse sur le banc*
10. **Trois heures** — *grande halle, nuit (événement sombre).* La sirène de l'usine morte hurle. Tu ouvres les yeux sur le béton, ta veste sous la tête ; quelqu'un a tracé un terrain à la craie autour de toi. ← *J'appelle quelqu'un* · → *Je rentre à pied*
11. **La ligne de touche** — *grande halle, soir.* Didier Vallin repasse à la craie la ligne de son terrain : « Ils t'ont mis sur mon crochet. Ils t'ont donné la place près de la porte ? » ← *Tu jouais où, avant ?* · → *Je ne te connais pas*
12. **Les photos** — *café de la Mairie (événement sombre).* Un inconnu glisse une enveloppe sous ta soucoupe : toi à trois heures, sortant du Rideau Rouge, le masque à la main. « La Gazette paie cinq mille. Moi, dix, pour qu'elles dorment. » ← *Je paie* · → *Qu'il les vende*
13. **La dépanneuse** — *parking du stade, après le match (la saisie).* Deux huissiers et une dépanneuse devant ton coupé rouge ; la Nord sort par la grille et regarde. Gégé : « On chante ton nom, ou on rentre ? » ← *Chantez* · → *Rentrez chez vous*
14. **Le sac** — *maison de la cité.* Odile a vidé ton sac de sport sur la table, comme elle vidait les poches de ton père le vendredi. La boîte est au milieu, sous la lampe. ← *C'est pour le genou* · → *Je ne mens pas*
15. **L'arrière-salle** — *Terminus, nuit.* Steph : « L'ardoise du Rideau, on te la rachète. Une enveloppe à Portclair dimanche, et samedi tu ne marques pas avant la mi-temps. » ← *Je porte l'enveloppe* · → *Je sors par la cuisine*
16. **Intermède : l'usine la nuit** — *rêve.* L'usine tourne sans ouvriers. Au fond du bâtiment C, ton père est à la tréfileuse en bleu de travail ; le fil avance tout seul et il ne se retourne pas. Un bouton : *J'appelle mon père*
17. **Le journal étranger** — *L'Écho.* Léa déplie un journal d'un pays qu'on ne nomme pas : « DIDIER VALLIN, 21 ANS, DOUBLÉ EN COUPE ». Sur la photo, un garçon blond que personne ici ne connaît. ← *Il faut l'écrire* · → *Laissez-moi lui dire*
18. **Une seule** — *secrétariat.* Josiane ferme la porte à clé, ce qu'elle ne fait jamais : « Trente ans de licences. Une seule fausse : la sienne. Le président disait que sa mère toucherait l'argent. Elle l'a touché. » ← *Vous témoignerez ?* · → *Ça reste entre nous*
19. **Le petit club** — *parking, la voiture de Fardelli.* Un fax d'un club inconnu : trois cent mille, deux ans, « petit club, grand avenir ». Puis un papier jauni : « Ta mère m'a signé tes trente pour cent en 1986. Tu le savais ? » ← *Je signe* · → *Déchirez les deux*
20. **Seize heures** — *stade, dernier match.* À la soixante-dixième, le genou ne répond plus. À seize heures pile, la sirène retentit sur tout le stade, longue, comme pour la fin d'un poste. Le banc te fait signe. ← *Je joue jusqu'au bout* · → *Je sors*

**Les graines et ce qui les paie.** Les trois lettres sous le sparadrap (1) mènent à la halle (11) et au journal étranger (17). La sirène de seize heures (1) se tait à Noël (7), revient à trois heures (10) et sonne pour toi à la fin (20). « Didier en prenait » (9) se paie dans la halle. Le genou que Sabatier garde pour lui (6) se paie à la visite (8) et au dernier match (20). Le chèque de la maison (4) se paie deux fois : par le pavillon saisi, et par le papier de 1986 (19). Le masque de soie du Rideau (5) revient sur les photos (12) et dans la Gazette.

**L'acte final.** Trois cartes à la suite, avec une respiration entre chacune : *Une seule* (Josiane), *Le petit club* (Fardelli), *Seize heures* (le dernier match). La fin rare exige d'avoir rendu à Didier la clé de la sirène (mission) : c'est lui qui tire la poignée, en plein jour.

### 6. Les soirs, les missions, les sponsors, les biens

**Les événements sombres** (huit) :

- **La porte sans poignée** — Rideau Rouge (`club_prive`), samedi 23 h, saison 1 (ton stratégique). Scène 5 ; ouvre `ardoise`.
- **La boîte** — salle de muscu (`muscu`), 21 h, fin de saison 1 ou saison 2 : l'événement existant *La boîte*, habillé de Didier. Scène 9.
- **Les photos** — café de la Mairie (`cafe`), puis la Gazette, saison 2 : l'événement existant *Les photos*, avec le masque de soie.
- **Trois heures** — grande halle (`friche`), nuit de février, saison 2. Scène 10 ; pose `sirene_nuit`.
- **Devant la maison** — maison de la cité (`domicile`), minuit, saison 2. Deux hommes de l'arrière-salle attendent sur le trottoir d'en face, sous le réverbère. Ils ne viennent pas pour toi : ils regardent la fenêtre de ta mère.
- **La dépanneuse** — parking du stade (`parking`), samedi après le match, saison 2. Scène 13 ; la saisie.
- **L'enveloppe** — arrière-salle du Terminus (`tripot`), nuit, saison 3. Scène 15.
- **La douche** — vestiaire (`vestiaire`), saison 3. Momo, le latéral qui avait pris la boîte de Steph, tombe sous la douche. On n'entend que le bruit de l'eau qui continue de couler. La carte suivante est le vestiaire vide, le sol mouillé, et Vukić qui ferme le robinet.

**Les missions** (trois) :

- **L'enveloppe de Portclair** — donneur : Steph (`tripot`, nuit), si `flag(ardoise)`. Porter une enveloppe à Portclair le dimanche, avec ta voiture. Cinq mille francs, argent sale ; un contrôle de gendarmerie sur la départementale est tiré par le metteur en scène. Pose `vl_enveloppe_portee`.
- **La clé de la tour** — donneur : Didier Vallin (`halle`, nuit), si `flag(halle_vue)`. Il a perdu la clé de la tour de la sirène ; elle est restée dans l'ancienne loge du gardien de l'usine, que le liquidateur fait surveiller. Une nuit, une lampe, un chien. Réussir pose `vl_cle_sirene` : c'est la condition de la fin rare.
- **La revente** — donneur : le vendeur du garage du Pont (`garage`, matin), si `possede(coupe_sport)`. Racheter ton coupé à moitié prix avant les huissiers pour solder l'ardoise. La sortie propre, et l'humiliation d'un coupé rouge rendu au garage qui l'a vendu.

**Les sponsors** :

- **Spiritueux Daubrac** (louche) — un marchand de spiritueux de Portclair « prête » le coupé rouge, son nom en lettres d'or sur la portière (`cadeau_coupe_sport`), et paie des « apparitions » au Rideau Rouge. C'est par ses comptes que passe l'argent de Fardelli. Accepter rend tout ce qui suit saisissable.
- **La Tréfilerie** (propre, mourante) — le dernier chèque de l'usine rebondit à Noël. Une carte : le directeur, dans son bureau à moitié vidé, te donne le fanion du club de l'usine de 1958, « le seul objet qu'on ne vend pas aux enchères ».

**Les biens et la saisie.** C'est le livre où l'on achète le plus, et où l'on perd tout devant tout le monde. Le **coupé sport rouge** (garage du Pont, ou prêté par Daubrac), la **montre en or** du courtier de la chambre 7 de l'hôtel de la Rive, le **costume sur mesure** de Brunel pour la première Une, puis le **pavillon aux Lilas** pour ta mère, payé par l'avance d'un transfert qui ne vient pas. **Les deux saisies sont le tournant de la saison 2** : le coupé, devant la Nord (`saisie_vehicules`, scène 13), puis le pavillon (`saisie_logement`), parce que l'argent venait des comptes de Daubrac : Odile sur le trottoir avec ses cartons, les voisins de la cité aux fenêtres. Si l'enveloppe de Portclair a été portée, la brigade revient en saison 3 pour le reste (`saisie_luxe`).

### 7. Ce que dit la ville

- *Ancien, époque* — si `saison == 1` : « Ton père, à la tréfileuse, il chantait en tirant le fil. Toi tu cours en chantant. C'est la même famille. »
- *L'épicière, argent* — si `possede(coupe_sport)` : « Un coupé rouge devant ma vitrine. Ta mère paie encore son ardoise chez moi, tu sais ? Le jeudi, en liquide. »
- *Passante, quartier* — si `flag(usine_fermee)` : « La sirène ne sonne plus à seize heures. Je regarde la pendule à sa place. Elle ne dit pas la même chose. »
- *Enfant, toi* — si `tribunes >= 80` : « Tu me signes mon crochet ? Celui de l'école, au portemanteau. Je veux ton nom au-dessus du mien. »
- *Fan, club* — si `flag(bache_nom)` : « Vingt mètres de bâche à ton nom. Gégé dit que si tu pars, on la plie. Il l'a dit à trois autres. »
- *Lulu, le gardien du stade, sombre* — si `flag(sirene_nuit)` : « Trois heures, la sirène. Le quartier dit que c'est le vent dans la tour. Le vent ne sait pas tirer une poignée. »
- *Gigi Vecchio, club* — si `flag(halle_vue)` : « Didier ? Il avait ta place, près de la porte. Il est parti en juin. Enfin, c'est ce qu'on a écrit. »
- *Passant, sombre* — si `flag(photos_gazette)` : « Page trois de la Gazette, toi à trois heures du matin, un masque à la main. Ma femme demande si c'était un bal. »
- *Madame Irène, toi* — si `tranche == nuit && flag(ardoise)` : « Rentre. Ta mère a appelé ; je lui ai dit que tu n'étais plus ici depuis longtemps. Ne me fais pas mentir deux fois. »
- *Le vendeur du garage du Pont, achat* — si `flag(coupe_saisi)` : « Votre coupé est dans ma cour, sous scellés. Il me prend une place. Les huissiers ne paient pas de loyer. »
- *Odile, toi* — si `flag(boite_trouvee)` : « J'ai jeté ta boîte dans la Rive, du haut du pont. J'aurais dû jeter les cachets de ton père aussi, en 86. »
- *Fan, sombre* — si `flag(douche)` : « Momo, sous la douche. On dit le cœur. Au vestiaire, personne ne dit rien, et le carrelage est encore mouillé. »
- *Passant, rumeur* — si `flag(journal_etranger)` : « Didier Vallin, blond, un mètre quatre-vingt-dix ? Il est brun, Didier. Je l'ai vu hier soir au feu de palettes. »
- *Josiane, club* — si `flag(une_seule)` : « Je range les licences par ordre alphabétique. La sienne, je l'ai mise à la fin. Je ne sais pas pourquoi. »
- *Ancien, époque* — si `flag(sirene_seize_heures)` : « Seize heures, la sirène, en plein match. Toute la tribune s'est levée. Ceux de l'usine ont regardé leur montre. »

### 8. Les fins

- **La sirène** (`pepite_sirene`, la vérité) — avec Didier, Josiane et Léa, tu dis la machine : les avances, l'ardoise, la licence vendue. Fardelli et Vaubourg sont mis en examen ; le Racing perd sa licence professionnelle ; on ne te vend plus à personne. *« {prenom} {nom} a raconté la machine à L'Écho, avec le nom de Didier Vallin écrit en entier, et plus personne n'a voulu l'acheter. Le dimanche, en National, trois cents personnes qui ont connu son père applaudissent encore. »*
- **Le petit club** (`pepite_petit_club`, le prix) — tu signes le fax de Fardelli ; le papier de 1986 est payé ; tu pars. *« {prenom} {nom} a signé pour un petit club au grand avenir et rendu à Fardelli ses trente pour cent, avec les intérêts. Deux ans plus tard, le petit club revend sa licence dix fois plus cher ; Didier dort toujours dans la halle. »*
- **Seize heures** (`pepite_seize_heures`, rare) — la clé de la tour rendue à Didier, la boîte refusée ou jetée, Odile à +1, et tu joues jusqu'au bout. *« À seize heures, la sirène de l'usine a sonné en plein match pour la fin d'un poste, et {prenom} {nom} a fini sur une jambe. Dans la tour de la grande halle, Didier Vallin a lâché la poignée et applaudi tout seul. »*
- **La grande halle** (`pepite_halle`, pire) — tu as porté l'enveloppe, pris la boîte jusqu'au bout, perdu la maison et le genou. *« On a vu {prenom} {nom} repasser à la craie la ligne de touche d'un terrain dessiné sur le béton de la grande halle. Il y a deux crochets au mur, maintenant, et deux noms. »*
- **La garde à vue** (`co_garde_a_vue`, ligne propre) — l'enveloppe de Portclair arrêtée au contrôle, ou la boîte trouvée. *« Quarante-huit heures pour une enveloppe que tu n'avais pas ouverte ; ta mère a attendu sur le banc du couloir, avec le fanion de 1958 dans son sac. »*
- **Les croisés** (`jp_croises`, ligne propre) — la visite passée grâce à la boîte, la vente tombée quand même, et le genou qui lâche au premier match de la saison suivante. *« Le genou a tenu une visite, pas un match. »*
- **Sans club** (`jp_sansclub`, ligne propre) — *« Fardelli a fait suivre ton dossier à onze clubs. Aucun n'a rappelé ; il en a acheté un autre. »*

### 9. La question de saison et les objectifs

**Le fil rouge** garde ses ids (`prix / terrain / maison`) : *Qu'est-ce qui te tient debout : le prix qu'on t'a mis, le terrain, ou la maison de ta mère ?* **Les objectifs** : saison 1, jouer et garder la maison ; saison 2, ne rien devoir à personne ; saison 3, choisir où l'on va. Les objectifs cachés gardent leurs ids : `pepite_destination` (choisir sa destination sans le fax de Fardelli), `pepite_enfant_du_club` (« Vingt mètres de bâche, ça engage »), `pepite_brassard_22`.

### 10. Le volume, et ce que le livre laisse au monde

**À produire** : prologue existant gardé (3 variantes lues sur la sirène) ; script, 12 ancres (l'ancre existante de la vente reste, variante du genou caché en tête) ; 8 intrigues propres (*La maison*, *L'ardoise*, *La boîte*, *Didier*, *Le pavillon*, *Les photos*, *Une seule*, *Le papier de 1986* : 34 cartes) ; 8 événements sombres (17 cartes) ; 3 intermèdes ; 26 cartes de décor (la cité, l'épicerie, le grillage, la tour) ; 12 réactions ; le réservoir existant du joueur gardé (le tifo, la première Une, le brassard, le genou qui parle). Soit **environ 125 cartes neuves pour 170 à 190 vécues**. 4 fins neuves et 3 lignes ; 14 manchettes (« LA DERNIÈRE SIRÈNE », « LE COUPÉ DE LA PÉPITE », « QUI EST DIDIER VALLIN ? », « SEIZE HEURES ») ; 45 répliques ; 3 missions ; 2 sponsors.

**Ce que le livre laisse au monde** : la Tréfilerie a fermé à Noël 1990, et sa sirène a sonné la nuit plusieurs fois l'hiver suivant. Didier Vallin vit à la friche ; un terrain est tracé à la craie sur le béton de la grande halle. Une licence au nom de Didier Vallin a été transférée à l'étranger en 1989.

---

## Histoire 4 — La Route de la Rive

### 1. La fiche

**Rôle** : joueur · **Postulat** : `fin_de_contrat` (index 3, 1990, Division 1 ; jauges, force, drapeau `genou` et président inchangés) · **Club** : le Racing Aubérive, en première division · **Saisons** : 1990-1991, 1991-1992, 1992-1993 · **Ancien titre** : *Fin de contrat à 31 ans*.

> **Quatrième de couverture**
>
> Tu as trente et un ans, un genou qui a un avis et une dernière année de contrat. Dans le couloir, les peintres décrochent les photos des anciens ; la tienne part dans un carton marqué ARCHIVES : la montée de 1984.
>
> Cette nuit-là, après la fête, une fille de quinze ans est passée sous les roues de la voiture du club, sur la route de la Rive. Tu conduisais. On te l'a dit le lendemain matin : tu conduisais, et elle était morte. Depuis, chaque 14 mai, tu poses des chrysanthèmes sur sa tombe.
>
> Cet automne, les morceaux de la photo de 1984 arrivent dans ta boîte aux lettres, un par un, avec un visage découpé. Et chaque nuit, depuis les infiltrations, tu reprends le volant. Deux heures du matin, la route de la Rive, une lumière de mobylette au bout.
>
> Tu peux tourner à gauche, ou à droite.

### 2. Le genre et la touche

**La rédemption impossible.** Un homme ou une femme qui veut payer, et qui découvre qu'on lui a fait porter la mauvaise faute pour mieux lui faire taire la vraie. Tu n'as pas conduit ; elle n'est pas morte ; et pourtant tu n'es pas sans faute : six ans de silence, six ans de fleurs sur la mauvaise tombe plutôt qu'une sonnette à la bonne porte. Rien ne se rachète ici. On peut seulement dire.

**La touche : la route.** Un intermède qui revient, une fois par saison et après chaque infiltration : la route de la Rive à deux heures du matin, le pare-brise, la lumière d'une mobylette au bout du pont. Le joueur glisse à gauche ou à droite, et c'est le volant qu'il tourne. Chaque version change un détail vrai : la chanson à la radio, la voix qui dit « freine », la place des mains sur le volant — et à la dernière, tes mains sont sur tes genoux. En appoint : les morceaux de la photo, un par enveloppe, avec un visage découpé que tu crois le tien ; le téléphone de trois heures où l'on n'entend qu'un moteur de mobylette au ralenti ; l'humour à froid du gardien du cimetière (« Monsieur Bertin n'a jamais eu autant de fleurs que depuis sa mort »), et celui du commissaire, à la fin : « C'est prescrit. »

### 3. Le personnage joué

Trente et un ans, le vétéran, la tête dans la lucarne de la montée de 1984. Camille à la maison, Sacha, six ans, qui joue dans la voiture « à gauche ou à droite ». **Ce qu'il veut** : une saison de plus ; ne plus rêver ; être pardonné par quelqu'un. **Ce qu'il cache** : le 14 mai 1984 tel qu'on le lui a raconté ; le genou ; et le rendez-vous annuel au cimetière, que Camille prend pour autre chose.

### 4. La distribution

- **Titi Bréhaut** (`brehaut`) — le capitaine, trente-trois ans, le même genou que toi, et le volant de 1984. Ce soir-là, c'est lui qui conduisait. Tu dormais à côté ; il t'a installé au volant avant l'arrivée des gendarmes, puis il t'a dit, le matin, que tu avais conduit et qu'elle était morte. Il t'aime comme un frère et il a construit sa vie sur cette phrase. C'est le coupable du livre, et il le restera jusqu'à la scène où il le dit.
- **Rocco Fardelli** (`fardelli`) — ton agent depuis 1984. C'est lui qui t'a conduit au cimetière la première fois, en 1985, devant une tombe qui n'était pas la sienne. Il a payé dix ans de chrysanthèmes chez le fleuriste ; il a renégocié tous tes contrats à la baisse « à cause de 1984 ».
- **Jean-Marie Vaubourg** (`aulard`) — il a déclaré volée la voiture du club, réglé l'affaire avec la gendarmerie, et fait signer au passager une déclaration pour l'assurance : « J'étais au volant ». La tienne.
- **Doc Sabatier** (`sabatier`) — appelé avant l'ambulance, cette nuit-là ; il sait qu'elle a vécu. Dans le tiroir de la table, son carnet de ce qu'il a refusé de faire porte une ligne : « 14 mai 1984 — refusé de dire qui conduisait. » Il n'a rien dit non plus. Ses infiltrations te donnent les rêves.
- **Pierre Massenet** (`meneche`) — il a écrit dix lignes sur l'accident ; on lui en a fait enlever huit. C'est le dossier qu'il a enterré par amitié. Il garde les deux du milieu.
- **Zoran Vukić** (`vukic`) — le passeur. « Les gars t'entendent dans le car. Tu dis "freine" en dormant. » Il garde un survêtement à ta taille pour le banc de la réserve.
- **Camille** (`camille`) et **Sacha** (`sacha`, six ans) — Camille voit les fleurs du 14 mai et croit à une autre ; un jour, elle te suit au cimetière et lit le nom sur la pierre : Jules Bertin, 1902-1983. Sacha, dans la voiture, demande à chaque carrefour « À gauche ou à droite ? » ; elle a entendu, à travers la cloison, le mot que tu dis en dormant, et le répète en jouant.
- **Nadia Rouvier** (`rouvier`) — la kiné qui t'entend parler sur la table, et qui connaît quelqu'un aux archives de l'hôpital.
- **Léa** (`lea`) — le corbeau lui écrit : « Demandez-lui où il était le 14 mai 1984. »
- **Lian Mbako** (`mbako`) — seize ans, assis à ta place (le prologue existant). Le seul qui ne te demande rien sur 1984 : il n'était pas né au football.

**Les visages nouveaux**

- **Sandrine Lavergne**, 21 ans — la fille à la mobylette. Paraplégique depuis cette nuit-là ; standardiste à l'hôtel de la Rive, elle passe les appels de toute la ville. Elle a vu le visage du conducteur dans la lumière du phare : Bréhaut. À quinze ans, en état de choc, personne ne l'a crue ; sa déposition s'est perdue. Elle découpe la photo de 1984 et te l'envoie par morceaux. Ce qu'elle veut : que le passager le dise, à voix haute. Elle ne veut ni ton argent ni ton pardon.
- **Jean Lavergne**, 58 ans — son père, le buraliste du tabac du Quai, qui te vend L'Écho chaque matin depuis six ans. Il sait que tu ne conduisais pas. Il te hait pour ton silence, et il te rend la monnaie quand même.
- **Monsieur Abel**, 70 ans — le gardien du cimetière, qui note dans un registre qui vient, et quand. Il a ton nom à chaque 14 mai depuis 1985, et celui de Fardelli une seule fois, le 13 mai 1985, la veille de ta première visite.

### 5. La structure

**Saison 1 (1990-1991) — La faute.** Le prologue existant reste (les photos décrochées, la radio du genou avec un chiffre entouré au crayon gras — c'est une date, 14/5 —, Mbako à ta place, la plaquette de Léa, Fardelli à la portière, la consultation de onze heures). Le premier morceau de photo sous la porte. La première infiltration, le premier rêve de la route. Le moteur au téléphone à trois heures. Le contrat au rabais, le quinzième match (les ancres existantes). Le 14 mai 1991 : les fleurs, et Camille derrière toi dans l'allée. La saison finit au cimetière : « Qui est Jules Bertin ? »

**Saison 2 (1991-1992) — La tombe vide.** Le registre de Monsieur Abel ; l'abonnement du fleuriste payé par Fardelli. Le corbeau de L'Écho. Les deux lignes de Massenet. Le dossier de l'hôpital : *Lavergne, Sandrine, 15 ans, admise le 14 mai 1984 à 2 h 40, vivante*. Le standard de l'hôtel de la Rive : une voix qui te passe tes propres appels. Jean Lavergne sous ta fenêtre. Les morceaux de la photo, assemblés sur la table de la cuisine : le visage découpé n'est pas le tien, c'est celui d'à côté. Le rêve, encore : tes mains ne sont pas sur le volant. La saison finit sur le parking du stade, la nuit, Bréhaut assis sur le capot de sa voiture : « J'ai conduit. Tu dormais. »

**Saison 3 (1992-1993) — Le micro.** Ce qu'on fait d'une vérité qui accuse son capitaine, son ami, et soi-même. Bréhaut supplie, puis menace, puis propose de parler à ta place. Vaubourg sort la déclaration de 1984, signée de ta main. Fardelli rappelle ce qui est prescrit et ce qui ne l'est pas. Sandrine ne te reçoit qu'une fois, au standard, entre deux appels : elle veut que tu le dises à ton jubilé, au micro du rond central. L'acte final : la dernière nuit sur la route de la Rive, pour de vrai ou en rêve, et le jubilé.

**Les vingt scènes clés**

1. **Le carton** — *couloir du club-house, prologue.* Les peintres rangent les photos des anciens dans un carton marqué ARCHIVES. La tienne est dessus : la montée de 1984, toi au milieu, Bréhaut à ta droite. ← *Je la garde* · → *Qu'ils l'emportent*
2. **Le chiffre entouré** — *salle de soins, prologue.* Sur le négatoscope, la radio de ton genou ; dans un coin, au crayon gras, Sabatier a entouré « 14/5 ». « Tu montes maintenant, ou après la séance ? » ← *Que veut dire ce chiffre ?* · → *Après la séance*
3. **Le premier morceau** — *rue des Lilas, 22 h (événement sombre).* Sous la porte, une enveloppe sans timbre : un morceau de la photo de 1984, un visage découpé aux ciseaux, proprement. ← *Je le montre à Camille* · → *Je le brûle dans l'évier*
4. **La route (premier rêve)** — *intermède, après l'infiltration.* Deux heures, la route de la Rive, une chanson à la radio, la lumière d'une mobylette au bout du pont. Le volant est dans tes mains. ← *Je tourne à gauche* · → *Je tourne à droite*
5. **Le moteur** — *appartement, 3 h (événement sombre).* Le téléphone sonne. Personne ne parle : on entend un moteur de mobylette au ralenti, longtemps, puis la tonalité. ← *Je décroche la prise* · → *J'attends qu'on rappelle*
6. **Le rabais** — *bureau du président.* Vaubourg pousse une page, un chiffre plus petit que l'ancien : « Fardelli a dit oui pour toi. Il dit que tu sais pourquoi tu signes moins que les autres. » ← *Je signe* · → *Je veux savoir pourquoi*
7. **Le 14 mai** — *cimetière, carré ancien, 18 h.* Tu poses les chrysanthèmes. Derrière toi, dans l'allée, Camille, ton manteau sur le bras : « Qui est Jules Bertin ? » ← *Je te dois la vérité* · → *Un ami de mon père*
8. **Le registre** — *loge du gardien.* Monsieur Abel ouvre son registre : « Vous, chaque 14 mai depuis 1985. Monsieur Fardelli, une fois, la veille de votre première visite. Pour Monsieur Bertin. Vous étiez de la famille ? » ← *Où est la vraie tombe ?* · → *Je repars*
9. **Le fleuriste** — *Aux Immortelles.* « Votre abonnement du 14 mai, on le renouvelle ? Monsieur Fardelli l'avait payé pour dix ans, en 1985. Il en reste trois. » ← *Arrêtez l'abonnement* · → *Renouvelez-le*
10. **Les deux lignes** — *L'Écho.* Massenet ouvre un tiroir : « Le 15 mai 1984, j'ai écrit dix lignes. On m'en a fait enlever huit. Il me reste celles du milieu : "La jeune fille a été transportée vivante." » ← *Qui vous l'a demandé ?* · → *Republiez les dix*
11. **Le dossier de l'hôpital** — *cabinet de Rouvier.* La photocopie d'une fiche d'admission : *Lavergne, Sandrine, 15 ans, 2 h 40, vivante, colonne touchée*. Rouvier : « Je n'ai rien vu. Je ne sais pas lire. » ← *Je cherche cette famille* · → *Je range la feuille*
12. **Le standard** — *hôtel de la Rive.* La standardiste est en fauteuil derrière son comptoir, un casque sur la tête. Elle te regarde entrer et ne dit qu'une chose : « Pas vous. Le passager. » ← *J'étais au volant* · → *Qui conduisait ?*
13. **L'homme sous la fenêtre** — *rue des Lilas, minuit (événement sombre).* Jean Lavergne, le buraliste, debout sous ton réverbère, les mains dans les poches. Il ne fume pas, il ne crie pas. Il regarde ta fenêtre. ← *Je descends lui parler* · → *Je tire le rideau*
14. **La photo entière** — *cuisine, nuit.* Tous les morceaux assemblés sur la table : le visage découpé n'est pas le tien. C'est celui d'à côté, sur ta droite. ← *J'appelle Bréhaut* · → *Je range les morceaux*
15. **La route (le rêve d'après)** — *intermède.* La même route, la même lumière au bout du pont. Cette fois, tu regardes tes mains : elles sont posées sur tes genoux. Quelqu'un d'autre tient le volant et dit « ça va aller ». Un bouton : *Je tourne la tête*
16. **Le capot** — *parking du stade, nuit (fin de saison 2).* Bréhaut assis sur le capot de sa voiture, le brassard dans le poing : « J'ai conduit. Tu dormais. Je t'ai mis au volant, j'avais vingt-sept ans et un contrat. » ← *Tu vas le dire* · → *Rentre chez toi*
17. **La déclaration** — *bureau du président.* Vaubourg pose sur le bureau une feuille de 1984, signée de ta main : « J'étais au volant. » « Au pénal, c'est prescrit. Au civil, non. Tu veux vraiment qu'on rouvre ? » ← *Rouvrez* · → *Laissez dormir ça*
18. **La commande** — *standard de l'hôtel de la Rive.* Sandrine, entre deux appels : « Au jubilé, il y a un micro au rond central. Vous le direz là, devant eux. Sinon, ne venez plus acheter le journal chez mon père. » ← *Je le dirai* · → *Je ne peux pas*
19. **La route, pour de vrai** — *route de la Rive, 2 h (événement sombre, acte final).* La veille du jubilé, tu prends la voiture. Au bout du pont, sous le réverbère, un fauteuil vide. ← *Je freine* · → *J'accélère*
20. **Le rond central** — *stade, le jubilé.* Le stade debout, Bréhaut à côté de toi en costume, le micro tendu par Léa. Au premier rang de la tribune Est, un fauteuil. ← *Je dis qui conduisait* · → *Je parle du match*

**Les graines et ce qui les paie.** Le chiffre entouré sur la radio (2) est la date, que Sabatier a notée sur chaque radio de ton genou depuis 1984. Bréhaut, à ta droite sur la photo (1), est le visage découpé (14). L'abonnement du fleuriste (9) et le registre (8) désignent Fardelli. Les deux lignes de Massenet (10) et le dossier de l'hôpital (11) donnent « vivante ». « Pas vous. Le passager. » (12) n'a de sens qu'après le capot (16). Le jeu de Sacha dans la voiture (« à gauche ou à droite ? ») revient en ville et à la dernière route (19).

**L'acte final.** La dernière nuit (19) et le jubilé (20). « Je freine » ouvre le micro ; « J'accélère » mène au pire ou au silence. Au micro, dire qui conduisait est la fin de la vérité ; parler du match est celle du prix ; la fin rare naît d'un Bréhaut convaincu de prendre le micro lui-même.

### 6. Les soirs, les missions, les sponsors, les biens

**Les événements sombres** (huit) :

- **Le premier morceau** — rue des Lilas (`domicile`), 22 h, saison 1. Scène 3 ; il en viendra un par mois, toujours le mardi.
- **Le moteur** — appartement (`domicile`), 3 h, saison 1. Scène 5. Le moteur est celui d'une vraie mobylette, que le frère de Sandrine fait tourner dans la cour du tabac.
- **Le corbeau** — L'Écho (`echo`), saison 2 : l'événement existant *Le corbeau*, réécrit. Léa pose la lettre sur sa table : « Demandez-lui où il était le 14 mai 1984. » Elle ne te la montre pas ; elle te demande si tu veux qu'elle la lise à voix haute.
- **Le capot** — parking du stade (`parking`), après l'entraînement du soir, saison 2 : sur le capot de ta berline, gravé à la clé, « 14-5-84 ». Personne n'a rien vu ; le gardien du stade regarde ailleurs, très appliqué.
- **L'homme sous la fenêtre** — rue des Lilas (`domicile`), minuit, saison 2. Scène 13 : l'événement existant *Ils t'attendent*, réduit à un seul homme qui ne dit rien.
- **La table** — cabinet du Doc (`cabinet`), 21 h, saison 2. Sabatier prépare l'infiltration et ouvre, pour la première fois devant toi, le tiroir de la table : son carnet des refus. « La ligne du 14 mai, je l'ai écrite le 15. Je n'ai rien fait d'autre. » Il te demande si tu veux encore la piqûre.
- **Le capot de Bréhaut** — parking du stade, nuit, fin de saison 2. Scène 16.
- **La route** — route de la Rive (`rue`), 2 h, acte final. Scène 19.

**Les missions** (trois) :

- **Le dossier de l'hôpital** — donneuse : Nadia Rouvier (`cabinet`, après-midi), si `flag(tombe_inconnue)`. Une amie aux archives de l'hôpital de Portclair peut sortir une fiche de 1984, une nuit, le temps d'une photocopie. Le vol d'un dossier médical est un délit : si le metteur en scène tire le contrôle, l'amie perd sa place et Rouvier ne te parle plus. Pose `vl_dossier_hopital`.
- **Le registre** — donneur : Monsieur Abel (`loge`, matin). Cinq cents francs « pour l'entretien des allées », et le registre des visites est ouvert sur la table. C'est la scène 8, en mission ; elle rapporte le nom de Fardelli.
- **Le certificat** — l'intrigue de ville existante (`certificat`) : un médecin sans cabinet, à la pharmacie, propose un certificat d'aptitude pour la visite de prolongation. Le genou passe, le papier est faux, et la Fédération contrôle en saison 3.

**Les sponsors** :

- **Laboratoires Sérène** (louche) — un visiteur médical paie pour que tu « essaies » des ampoules sans notice contre l'inflammation. L'argent est sale, les ampoules sont ce qu'elles sont, et Sabatier refuse de les injecter.
- **Auto-école de la Rive** (propre, et cruel) — elle veut ton visage sur un panneau de quatre mètres, « Le permis, c'est la vie », à l'entrée de la route de la Rive. L'argent est propre. Le panneau est planté à cent mètres du pont.

**Les biens et la saisie.** Un vétéran de première division a de quoi vivre : le **pavillon aux Lilas**, une **berline allemande**, la montre en or que le club t'a offerte en 1984, gravée « Montée — merci ». Ici, la saisie est **le prix de la vérité** : si tu dis qui conduisait, la famille Lavergne attaque au civil — le pénal est prescrit, le civil ne l'est pas —, et le pavillon est saisi pour payer ce que le tribunal compte (`saisie_logement`). Si tu prends la route ivre la dernière nuit, la berline est mise en fourrière au bout du pont (`saisie_vehicules`). La montre de 1984, elle, ne vaut rien à la revente : le club l'avait fait graver.

### 7. Ce que dit la ville

- *Jean Lavergne, le buraliste du Quai, toi* — si `saison == 1 && tranche == matin` : « L'Écho, comme tous les matins. Gardez votre monnaie, je n'en veux pas. »
- *Ancien, époque* — si `saison == 1` : « La montée de 84, c'est vous, la tête dans la lucarne. J'étais derrière le but. Le soir, on a fêté jusqu'au pont. »
- *Passante, quartier* — si `flag(premier_morceau)` : « Il y a une femme en fauteuil qui découpe des photos dans le square, sur le banc du fond. Elle ne dit bonjour à personne. »
- *Sacha, toi* — si `flag(reve_route)` : « Dans la voiture, on joue à gauche ou à droite ? Tu dis toujours à gauche, toi. Pourquoi tu dis toujours à gauche ? »
- *Monsieur Abel, le gardien du cimetière, sombre* — si `flag(quatorze_mai)` : « Monsieur Bertin n'a jamais eu autant de fleurs que depuis sa mort. Vous étiez de la famille ? »
- *Fan, club* — si `tribunes < 40` : « La tête dans la lucarne, en 84. Depuis, tu marques moins et tu boites plus. On t'aime quand même, un peu moins fort. »
- *Nadia Rouvier, toi* — si `flag(infiltration)` : « Tu parles en dormant, sur la table. Tu dis "freine". Je n'écris rien. »
- *Pierre Massenet, rumeur* — si `flag(corbeau_lea)` : « Le 15 mai 1984, j'ai écrit dix lignes. On m'en a fait enlever huit. Il me reste les deux du milieu. »
- *Passant, sombre* — si `flag(lavergne_fenetre)` : « Le buraliste du Quai était sous vos fenêtres hier, à minuit. Il ne fumait même pas. Il regardait. »
- *Camille, toi* — si `flag(camille_cimetiere)` : « Qui est Jules Bertin ? Ne me dis pas un ami. On n'apporte pas des chrysanthèmes à un ami tous les 14 mai. »
- *La fleuriste des Immortelles, achat* — si `flag(quatorze_mai)` : « Votre abonnement du 14 mai, on le renouvelle ? Monsieur Fardelli l'avait payé pour dix ans. Il en reste trois. »
- *Titi Bréhaut, toi* — si `flag(photo_entiere)` : « Le groupe a vu les morceaux de photo dans ton casier. Ils ne demandent rien. Moi non plus. Tu devrais les jeter. »
- *Passante, rumeur* — si `flag(standard_vu)` : « La fille du buraliste, au standard de l'hôtel ? Elle passe les appels de toute la ville. Elle sait qui appelle qui. »
- *Ancien, époque* — si `flag(jubile_annonce)` : « Ton jubilé, on viendra. On était au pont, en 84, pour la fête. Pas après. Après, on dormait. »
- *Jean Lavergne, toi* — si `flag(verite_dite)` : « L'Écho. Gardez la monnaie. Non… rendez-la-moi. Je vous rends la vôtre aussi. »

### 8. Les fins

- **Le micro** (`fdc_micro`, la vérité) — au jubilé, tu dis qui conduisait et qui s'est tu ; le civil suit ; le pavillon est vendu. *« Au rond central de son jubilé, {prenom} {nom} a dit au micro qui conduisait le 14 mai 1984, et qui s'était tu ensuite. Le pavillon des Lilas a payé ce que le tribunal a compté ; Sandrine Lavergne a encaissé le chèque du juge, jamais l'autre. »*
- **Les chrysanthèmes** (`fdc_chrysanthemes`, le prix) — tu te tais pour Bréhaut et pour toi ; tu paies en secret. *« Chaque mois, {prenom} {nom} a envoyé un chèque au tabac du Quai, et chaque mois le chèque est revenu, non encaissé. Les chrysanthèmes sont allés à Jules Bertin jusqu'au bout de l'abonnement. »*
- **Le tour d'honneur** (`fdc_tour_honneur`, rare) — Sandrine entendue en privé, Jean Lavergne à +1, Bréhaut convaincu : c'est lui qui prend le micro. *« Le jour de son jubilé, {prenom} {nom} a fait le tour du terrain en poussant un fauteuil, et c'est Titi Bréhaut qui a pris le micro. Sandrine Lavergne n'a pas pardonné ; elle a regardé le stade se lever. »*
- **La route** (`fdc_route`, pire) — « J'accélère », la dernière nuit. *« On a arrêté {prenom} {nom} à deux heures du matin au bout de la route de la Rive, ivre, le moteur chaud, à dix mètres d'un fauteuil vide sous le réverbère. Le procès-verbal donne l'heure exacte : celle de 1984. »*
- **Prescrit** (`fdc_prescrit`) — tu vas te dénoncer au commissariat sans prévenir personne, ni Sandrine ni Bréhaut. *« Le commissaire a écouté {prenom} {nom} jusqu'au bout, puis il a refermé le dossier : prescrit. On ne punit plus personne pour 1984, et c'est la pire chose qu'on pouvait lui répondre. »*
- **La garde à vue** (`co_garde_a_vue`, ligne propre) — le dossier de l'hôpital, ou le faux certificat. *« Quarante-huit heures pour une photocopie d'hôpital ; la seule faute de 1984 qu'on ait pu te reprocher était celle-là. »*
- **Les croisés** (`jp_croises`, ligne propre) — *« Le genou a lâché au quinzième match, comme Sabatier l'avait écrit en marge d'une radio, au crayon gras. »*
- **Le jubilé** (`jubile`, ligne propre) — tu ne parles que du match. *« Au micro, {nom} a remercié la tribune, le club et sa famille. Au premier rang de l'Est, un fauteuil est reparti avant la fin. »*

La porte du Carrefour reste ouverte : le survêtement de Vukić et le banc de la réserve (la transition existante vers l'entraîneur) sont une sortie sans fin, pour qui a dit, ou pour qui ne dira jamais.

### 9. La question de saison et les objectifs

**Le fil rouge** garde ses ids (`genou / agent / vestiaire`) : *Qui te tient encore : ton genou, ton agent, ou le vestiaire de 1984 ?* **Les objectifs** : saison 1, tenir quinze matchs ; saison 2, savoir qui dort sous la pierre ; saison 3, le jubilé. Les objectifs cachés gardent leurs ids : `fin_saison_entiere`, `fin_passeur` (lire le cahier de Vukić : à la date du 14 mai 1984, il a noté « Départ du pont, 1 h 50. Titi au volant, le petit dort »), `fin_debout`.

### 10. Le volume, et ce que le livre laisse au monde

**À produire** : prologue existant gardé (la radio et le chiffre entouré réécrits) ; script, 12 ancres ; 7 intrigues propres (*Les morceaux*, *Jules Bertin*, *Les deux lignes*, *Le standard*, *Le capot*, *La déclaration*, *Le micro* : 33 cartes) ; 8 événements sombres (16 cartes) ; 5 intermèdes de la route (le seul livre qui en a plus de trois : c'est son mécanisme) ; 26 cartes de décor ; 12 réactions ; le réservoir existant gardé (le genou qui parle, le brassard, la dernière sélection, les mémoires). Soit **environ 120 cartes neuves pour 170 à 190 vécues**. 5 fins neuves et 3 lignes ; 14 manchettes (« LA ROUTE DE LA RIVE », « QUI ÉTAIT AU VOLANT ? », « JUBILÉ : LE SILENCE DU ROND CENTRAL ») ; 45 répliques ; 3 missions ; 2 sponsors.

**Ce que le livre laisse au monde** : Sandrine Lavergne, fille du buraliste du Quai, est en fauteuil depuis la nuit du 14 mai 1984 ; elle travaille à l'hôtel de la Rive. Au carré ancien du cimetière, la tombe de Jules Bertin (1902-1983) a reçu des chrysanthèmes chaque 14 mai pendant des années. La photo de la montée de 1984 est partie aux archives en 1990.

---

## Histoire 5 — La Maquette

### 1. La fiche

**Rôle** : président (`president`, rôle à brancher, § 1.10) · **Postulat** : `geant_dechu` (bible ch. 13 § 4), année 1999, Division 2, après le dépôt de bilan ; jauges de la bible (vestiaire 45, tribunes 90, direction 50, caisse 10), drapeaux `depot_de_bilan` et `deux_titres` · **Club** : le Racing Aubérive, champion en 1962, vainqueur de la Coupe en 1966, finaliste en 1974, redescendu en deuxième division et déposé au greffe cet été · **Patron du moteur** : Jean-Marie Vaubourg (`aulard`), président de la Ligue depuis 1998, qui a quitté le Racing en laissant ses dettes · **Entraîneur** : Zoran Vukić · **Directeur sportif** : Titi Bréhaut · **Saisons** : 1999-2000, 2000-2001, 2001-2002 (les écus arrivent pour la dernière).

> **Quatrième de couverture**
>
> Le Racing a deux titres au mur, un dépôt de bilan au greffe, et toi. Personne ne voulait de la présidence ; tu l'as prise. Ton entreprise de bâtiment est aussi mal en point que le club, mais on t'a fait une promesse.
>
> Dans la vitrine de l'agence Tessandier, au bord de la Rive, une maquette neuve : *Les Terrasses de la Rive, seconde tranche*. Là où se tient le stade, un parc en mousse verte et un petit lac en résine. Chaque mois, la maquette change. Le stade y rétrécit.
>
> Chaque mardi à dix-huit heures, le téléphone de ton bureau sonne. Une voix d'homme, sans nom : « Ici le Conseil. » Tu n'as jamais rencontré le Conseil. Il sait pourtant où tu dors, ce que tu dois, et ce que tu as signé.
>
> Une nuit de novembre, la vieille tribune Est brûle. Toute en bois, de 1931.

### 2. Le genre et la touche

**Le complot.** Trois personnes ordinaires se sont entendues pour qu'un club meure de sa belle mort et qu'un terrain se libère. Elles n'ont tué personne ; elles ont refusé un prêt, racheté une dette, perdu un acte au cadastre, choisi un président. Le livre montre comment on tue une chose publique avec des signatures, et comment on la défend avec un papier jauni plié en huit.

**La touche : la maquette et le Conseil.** La maquette de la vitrine est l'horloge visible du livre : la ville la commente, le joueur peut aller la regarder, et elle change à chaque saison (le stade rétrécit, puis devient un parc, puis un petit panneau porte le nom de ton entreprise sous celui du promoteur). Le Conseil est l'ordre sans visage : une voix le mardi à dix-huit heures, puis une chambre d'hôtel vide où un magnétophone tourne et dit « Merci d'être venu ». L'intermède : tu marches la nuit sur la pelouse et le stade fond comme de la mousse verte ; à sa place, des balcons éclairés, et à chaque balcon, quelqu'un qui te salue. L'humour à froid est celui de Madame Tessandier, qui sert un café qu'on ne propose qu'une fois : « Tout le monde y gagne, sauf la vue. »

### 3. Le personnage joué

Cinquante-quatre ans, patron d'une entreprise de bâtiment de la vallée, né dans le virage, abonné depuis l'âge de huit ans. **Ce qu'il veut** : sauver le club de son enfance, et son entreprise avec. **Ce qu'il cache** : avant d'accepter la présidence, il a écouté l'offre de l'agence Tessandier — le chantier des Terrasses pour son entreprise, un stade neuf « à la friche » pour le club — et il a cru pouvoir tenir les deux. Ce qu'il ne sait pas : que le stade neuf ne sera jamais construit, et qui a proposé son nom.

### 4. La distribution

- **Camille** (`camille`, avocate : le métier est forcé dans ce livre) — elle a rédigé les statuts de la société des Terrasses et proposé ton nom au Conseil. Elle voulait que tu sortes du football vivant et sans dettes ; elle croyait le club mort avant toi. C'est le troisième membre du Conseil, et la coupable du livre.
- **Madame Vialat** (`vialat`) — l'Inspecteur. Un solde négatif ; le second déclenche la lettre. Elle garde dans son sac la coupure de 1992 : Vaucastel, le club qu'elle avait laissé passer en 1989, au greffe trois ans plus tard. Elle refuse la chaise. Elle ne juge pas ; elle compte, et elle peut compter autre chose si on le lui montre.
- **Jean-Marie Vaubourg** (`aulard`) — « cher collègue ». Il a laissé au Racing les dettes de son règne ; à la Ligue, il peut accorder un délai si tu enterres ses comptes de 1998.
- **Gégé** (`gege`) — le kop à quatre-vingt-dix. Le mot de janvier (personne ne part), le siège du club-house, la bâche : LA RIVE AUX ENFANTS DU QUARTIER.
- **Mamie Paulette** (`paulette`) — quatre-vingts ans, place 14B de la tribune Est depuis 1951. Son père, maire d'Aubérive, a signé en 1931 l'acte qui donne le terrain de la Rive « aux enfants du quartier, à perpétuité ». L'original est dans son buffet. La copie du cadastre a été « perdue » en 1976.
- **Zoran Vukić** (`vukic`) et **Titi Bréhaut** (`brehaut`) — l'entraîneur, qui tient le cahier ; le directeur sportif, à qui le Conseil a promis un bureau dans le club d'après.
- **Madame Josiane** (`josiane`) — elle reconnaît la voix de la cassette : le seul homme qui l'appelle « Josie ».
- **Dembo** (`dembo`) — trente-trois ans, la star à vendre, la feuille de grève sur le banc.
- **Hubert Malbec** (`malbec`) et **Cheikh Ilyas** (`nassir`) — la valise de Valentienne pour Dembo ; le premier fonds lointain, trente pour cent pour vingt millions. Deux saluts, deux prix.
- **Judith Amsel** (`amsel`), la procureure — elle gèle les berges quand les plongeurs remontent une voiture, et elle finit par perquisitionner ton entreprise, parce que ton nom est sur la maquette.
- **La Plume** (`la_plume`) et **Léa** (`lea`) — le fax du cadastre, signé d'une plume ; les deux noms de la société civile, et la question du troisième.

**Les visages nouveaux**

- **Madame Tessandier**, 58 ans — l'agence de la vitrine. La première résidence de la Rive (1993) se vend mal ; la seconde tranche, avec la vue sur l'eau à la place des tribunes, est sa dernière chance. Elle est le visage du Conseil, et elle le sait.
- **Pierre-Yves Dorian**, 61 ans — directeur de la Banque Aubérivoise. Il a refusé le prêt de 1998 au dernier moment, puis fait racheter la dette du club à vingt centimes le franc par la SCI Rive Gauche, gérée par son beau-frère. C'est sa voix, le mardi.
- **Didier Vallin**, 30 ans (venu de *La Sirène*) — il vit à la friche. La nuit du feu, il a vu un homme en ciré avec un bidon près de la grille de l'Est, reparti dans une voiture de la résidence. Il veut un lit pour l'hiver.

### 5. La structure

**Saison 1 (1999-2000) — Le Conseil.** Le couloir et l'Inspecteur, la maquette, le café de l'agence, le premier mardi. La caution que la banque exige du président (une graine). Le mot de janvier au local. Paulette à sa place 14B, qui raconte 1931. L'huissier au secrétariat. Le maillot proposé par les Terrasses. La saison finit sur la tribune Est en flammes, une nuit de novembre ; l'assurance ne paiera pas ; le premier solde est négatif.

**Saison 2 (2000-2001) — La vase.** Les plongeurs du confortement des berges remontent une berline grise au sapin en carton ; la procureure gèle le chantier le temps de savoir ce que faisait au fond de la Rive la voiture d'un entraîneur de 1990, et ce délai sauve le club. La maquette change : le stade est devenu un parc, et ton entreprise est inscrite sous le promoteur. Le fax de La Plume : la SCI Rive Gauche. La chambre vide et le magnétophone. Le buffet de Paulette. La grève. Le siège du kop. La saison finit sur l'huissier à ta porte pour la caution, et l'en-tête de la lettre : le cabinet de Camille.

**Saison 3 (2001-2002) — Le vote.** Camille ne nie pas. Le conseil municipal vote la révision du terrain. Vialat compte le second solde. La procureure perquisitionne ton entreprise. L'acte final : la séance du conseil, la Commission, le dernier match devant l'Est en ruine.

**Les vingt scènes clés**

1. **Deux titres** — *couloir du club-house, prologue.* Deux titres au mur, un dépôt de bilan au greffe. Madame Vialat refuse la chaise : « Un solde négatif ; le second déclenche la lettre. Vous vendez, ou vous avez un plan ? » ← *Je vends tout de suite* · → *J'ai un plan*
2. **La vitrine** — *agence Tessandier, prologue.* Une maquette neuve : *Les Terrasses de la Rive, seconde tranche*. Là où est le stade, un parc en mousse verte et un lac en résine. ← *J'entre* · → *Je passe mon chemin*
3. **Le café** — *agence Tessandier.* Madame Tessandier te sert le café qu'on ne propose qu'une fois : « Votre entreprise aura le chantier, le club un stade neuf à la friche. Tout le monde y gagne, sauf la vue. » ← *Je veux voir les plans* · → *Le stade ne bouge pas*
4. **Mardi, dix-huit heures** — *bureau du président.* Le téléphone sonne à l'heure pile. Une voix d'homme, sans nom : « Ici le Conseil. Vendez votre gardien avant jeudi. Nous rappellerons mardi. » ← *Qui êtes-vous ?* · → *Je raccroche*
5. **La caution** — *Banque Aubérivoise.* Dorian fait glisser une feuille : « La banque prête au club si le président se porte caution sur ses biens. Votre maison, votre entreprise. Une formalité. » ← *Je signe la caution* · → *Je refuse*
6. **Le mot de janvier** — *local du kop.* Gégé tient une boîte à chaussures pleine d'abonnements : « Ils ont payé la saison. Dis-moi que personne ne part en janvier, et je le dis au virage. » ← *Personne ne part* · → *Je ne promets rien*
7. **La 14B** — *tribune Est, samedi.* Paulette, une couverture sur les genoux : « Mon père a donné ce terrain en 1931. Aux enfants du quartier. Vous saviez, président ? » ← *Racontez-moi* · → *Je dois descendre*
8. **Le feu** — *stade, nuit de novembre (événement sombre).* La tribune Est brûle sous la pluie ; les pompiers arrosent la Nord pour qu'elle ne prenne pas. Au matin, la 14B n'existe plus. ← *Je porte plainte* · → *Je fais déblayer*
9. **La vase** — *quai, soir (événement sombre).* Les plongeurs remontent une berline grise couverte de vase ; un sapin en carton pend au rétroviseur. La procureure, sous son parapluie : « Les travaux s'arrêtent. Vous avez l'air soulagé. » ← *Je le suis* · → *Ce n'est pas le mot*
10. **La seconde maquette** — *vitrine.* Le parc a mangé les tribunes. Sur un petit panneau de carton, le nom du promoteur, et dessous, celui de ton entreprise. ← *Qu'on retire mon nom* · → *Je laisse faire*
11. **La chambre vide** — *petit salon de l'hôtel de la Rive, 21 h.* On t'a donné rendez-vous avec le Conseil. Le salon est vide ; sur la table basse, un magnétophone tourne : « Merci d'être venu. » ← *J'emporte la cassette* · → *J'écoute jusqu'au bout*
12. **Le fax** — *bureau.* Un fax signé d'une plume : la dette du club rachetée à vingt centimes le franc par la SCI Rive Gauche, gérant un beau-frère de Dorian. ← *J'appelle La Plume* · → *Je le mets au coffre*
13. **Le buffet** — *chez Paulette.* Elle sort du buffet un papier plié en huit : l'acte de 1931, signé de son père. « À perpétuité, ça dure combien, pour un juge ? » ← *Je le porte au notaire* · → *Gardez-le chez vous*
14. **La grève** — *vestiaire (événement sombre).* Dembo pose une feuille sur le banc, vingt-quatre signatures : « Trois mois sans paie. Pas d'entraînement tant qu'elle ne tombe pas. On joue samedi. » ← *Je paie de ma poche* · → *Je signe avec eux*
15. **Intermède : la mousse verte** — *rêve.* Tu marches sur la pelouse la nuit ; le stade fond comme de la mousse ; à sa place, des balcons éclairés, et à chaque balcon quelqu'un te salue. Un bouton : *Je salue*
16. **L'huissier** — *ta maison, 20 h (la saisie).* Un huissier et deux déménageurs : la caution que tu as signée pour le club. En tête de l'ordre, le nom du cabinet de Camille. ← *Je montre l'ordre à Camille* · → *Je signe le procès-verbal*
17. **Camille** — *cuisine, nuit.* Elle range la lettre dans l'enveloppe : « Je voulais que tu sortes de là vivant, et sans dettes. Le club était mort avant toi. Tu le savais. » ← *Tu m'as vendu* · → *Tu avais raison*
18. **Le conseil municipal** — *mairie, soir.* La salle est pleine, la Nord en bas des marches. On vote la révision du terrain de la Rive. « Le président du Racing souhaite-t-il s'exprimer ? » ← *Je lis l'acte de 1931* · → *Je soutiens le projet*
19. **Le second solde** — *bureau.* Vialat, debout, son sac sur l'épaule : « Le second solde est négatif. Je compte. À moins que vous ne me montriez autre chose. » ← *Je vous montre tout* · → *Je n'ai rien d'autre*
20. **Le dernier match** — *stade.* La Nord pleine, l'Est en ruine derrière les barrières, la bâche de Gégé : LA RIVE AUX ENFANTS DU QUARTIER. Les caméras te cherchent dans la loge. ← *Je descends au virage* · → *Je reste en loge*

**Les graines et ce qui les paie.** La caution (5) paie à l'huissier (16) et ouvre Camille (17). La 14B (7) brûle (8), et Paulette rend l'acte (13) que tu lis au conseil (18). La voix du mardi (4) devient une cassette (11), que Josiane reconnaît. La maquette (2, 10) porte ton nom : c'est ce que la procureure perquisitionne. La voiture de la vase (9) gèle les berges et donne au club la saison qu'il lui faut — l'épave d'une autre histoire sauve celle-ci, et personne ici ne sait comment elle est arrivée là.

**L'acte final.** Trois cartes dans la même semaine : le conseil municipal (18), le second solde (19), le dernier match (20). La fin rare se joue devant Vialat.

### 6. Les soirs, les missions, les sponsors, les biens

**Les événements sombres** (huit) :

- **L'huissier du club** — secrétariat (`secretariat`), fin d'après-midi, saison 1 : l'événement existant *L'huissier*. Josiane se met devant la porte ; le photocopieur, la machine à laver des maillots, le bureau du président.
- **Le feu** — tribune Est (`stade`), nuit de novembre, fin de saison 1. Scène 8 ; pose `tribune_est_brulee`.
- **La vase** — quai (`rue`), soir, saison 2. Scène 9 ; pose `rive_voiture`.
- **Le salon vide** — hôtel de la Rive (`hotel`), 21 h, saison 2. Scène 11.
- **La grève** — vestiaire (`vestiaire`), saison 2. Scène 14.
- **Le siège** — club-house (`bureau`), nuit, saison 2 : le kop occupe le club-house, des sacs de couchage sous la photo de 1974 ; Josiane fait le café à six heures et dit qu'elle n'a vu personne.
- **L'huissier de la maison** — ta maison (`domicile`), 20 h, fin de saison 2. Scène 16 ; la saisie.
- **Six heures du matin** — les bureaux de ton entreprise (`bureau`), saison 3 : l'événement existant *Six heures du matin*, retourné. Les imperméables de la procureure ne viennent pas pour les cartons du club, mais pour les tiens : le contrat des Terrasses, daté d'avant ta présidence.

**Les missions** (trois) :

- **Le cadastre** — donneuse : Madame Josiane (`clubhouse`, soir), si `flag(fax_la_plume)`. Sa sœur travaille aux archives de la mairie ; la copie de l'acte de 1931 n'est pas perdue, elle est rangée sous un autre nom. Une clé, une nuit, une lampe de poche. Le metteur en scène tire le gardien de nuit. Pose `vl_cadastre`.
- **La valise de Valentienne** — donneur : Hubert Malbec (`hotel`, soir) : l'intrigue existante *La valise*. Dembo à Valentienne, trois millions en liquide sous la table, de quoi payer les salaires de la grève. Argent sale ; c'est la porte de la garde à vue.
- **Le témoin du feu** — donneur : Didier Vallin (`feu`, nuit), si `flag(tribune_est_brulee)`. Un lit pour l'hiver, une chambre payée à l'hôtel de la Rive, contre ce qu'il a vu la nuit du feu. Pose `vl_temoin_feu`.

**Les sponsors** :

- **Les Terrasses de la Rive** (louche) — le promoteur offre de floquer son nom sur le maillot, généreusement. Le contrat contient une ligne : « accompagnement du projet urbain ». Le Racing porterait sur la poitrine le nom de ce qui doit le remplacer.
- **Le fonds d'Ilyas** (gris) — trente pour cent du club pour vingt millions de francs, en 1999, huit ans avant qu'Almadis n'achète Capitale FC. L'argent est propre et sauve la saison ; il vient avec un naming, un « club frère » à l'autre bout du monde, et un siège au conseil pour un homme que tu ne verras jamais.

**Les biens et la saisie.** Un patron du bâtiment a une **maison** sur la rue Haute, une **berline allemande**, un **costume sur mesure** pour le plateau du dimanche soir. **La saisie est la révélation** : la caution signée en première saison (scène 5) fait saisir la maison (`saisie_logement`) à la fin de la saison 2, et l'ordre porte l'en-tête du cabinet de Camille. Si la valise de Malbec a été prise, la brigade revient en saison 3 et saisit tout (`saisie_tout`) : la berline, le costume, et le portefeuille à zéro.

### 7. Ce que dit la ville

- *Passant, club* — si `saison == 1` : « Deux titres au mur et pas de quoi payer le chauffage. Mon père disait qu'en 62, on chauffait la buvette avec les journaux du lundi. »
- *Madame Tessandier, achat* — si `flag(maquette_vue)` : « La seconde tranche ? Tout est réservé sur plan, sauf le rez-de-chaussée. Il a vue sur les tribunes. Pour l'instant. »
- *Ancien, époque* — si `flag(tribune_est_brulee)` : « L'Est, c'était du chêne de 1931. On a mis soixante ans à l'user. Il a suffi d'une nuit pour la brûler. »
- *Mamie Paulette, toi* — si `flag(acte_lu)` : « Mon père disait : à perpétuité, c'est plus long que le maire suivant. Vous êtes le maire suivant de qui, vous ? »
- *Fan, sombre* — si `flag(rive_voiture)` : « Les plongeurs ont sorti une voiture grise de la Rive, un sapin au rétroviseur. Mon oncle dit que c'était celle d'un entraîneur, en 1990. »
- *Gégé, club* — si `relation.gege >= 1` : « Le virage a payé ses abonnements jusqu'en mai. Si le stade est vendu avant, on campe dedans. Avec les gosses. »
- *Madame Josiane, rumeur* — si `flag(cassette_conseil)` : « Cette voix, sur votre cassette… C'est le directeur de la banque. Il m'appelle Josie depuis trente ans. Personne d'autre. »
- *Passante, sombre* — si `flag(maison_saisie)` : « Les déménageurs étaient chez vous ce matin. Votre femme les regardait faire, les bras croisés. Elle n'avait pas l'air surprise. »
- *Enfant, quartier* — si `flag(maquette_change)` : « Dans la vitrine, ils ont enlevé le stade de la maquette. Mon frère dit qu'ils enlèveront le vrai la nuit. »
- *Le garagiste du Pont, argent* — si `flag(caution_signee)` : « Vous avez mis votre maison en garantie pour le club ? Mon père avait fait ça en 1966, pour la Coupe. On a gagné la Coupe. Il a perdu la maison. »
- *Passant, sombre* — si `mission(temoin_feu)` : « La nuit du feu, il y avait un homme en ciré avec un bidon, près de la grille de l'Est. Il est reparti dans une voiture de la résidence. »
- *Léa, toi* — si `flag(fax_la_plume)` : « La SCI Rive Gauche a été créée un mardi, chez un notaire de Portclair, par trois personnes. J'ai deux noms. Vous avez le troisième ? »
- *Fan, club* — si `flag(siege)` : « On a dormi au club-house. Josiane nous a fait le café à six heures. Elle a dit qu'elle ne nous avait pas vus. »
- *Ancien, époque* — si `annee >= 2002` : « Huit écus le match, au virage. Mon père payait en pièces de vingt centimes, et il râlait déjà. »
- *Passant, rumeur* — si `flag(vote_conseil)` : « Le conseil a voté à une voix près. Ce n'était pas la mienne, je ne suis pas conseiller. Mais je sais de qui. »

### 8. Les fins

- **Le stade est resté** (`geant_stade_reste`, la vérité) — l'acte au conseil, la cassette, le fax, le témoin : Dorian et Madame Tessandier mis en examen, Camille radiée du barreau ; le Racing liquidé, refondé deux divisions plus bas, le terrain protégé. *« {prenom} {nom} a lu l'acte de 1931 devant le conseil municipal, et le terrain de la Rive est resté aux enfants du quartier. Le Racing, lui, est reparti de deux divisions plus bas, sous le même nom et sans un sou. »*
- **Les Terrasses** (`geant_terrasses`, le prix) — tu soutiens le projet ; ton entreprise a le chantier ; la procureure gèle tout pour une voiture repêchée dans la vase. *« {prenom} {nom} a signé la cession du terrain de la Rive, et la procureure a gelé les berges la semaine suivante pour une épave sortie de la vase. La maquette est restée dans la vitrine ; le stade aussi ; la signature aussi. »*
- **L'Inspecteur compte autre chose** (`geant_vialat`, rare) — la cassette, l'acte, le fax et le témoin montrés à Vialat, aucune valise prise, la relation de Vialat à +1. *« Madame Vialat a compté une dernière fois, et pour la première fois elle a compté autre chose que les chiffres : le Racing a passé l'été. {prenom} {nom} a rendu les clés en juin, sans maison, sans Camille, avec un stade. »*
- **La garde à vue** (`co_garde_a_vue`, ligne propre) — la valise de Malbec, la nuit du cadastre, ou le contrat des Terrasses daté d'avant ta présidence. *« Quarante-huit heures pour un contrat signé trop tôt ; la procureure a laissé la maquette sur la table pendant tout l'interrogatoire. »*
- **Le siège du siège** (`pr_siege`, ligne propre) — *« Le kop a dormi trois semaines au club-house ; le président, lui, a fini par dormir ailleurs. »*
- **La Commission des comptes** (`pr_commission`, ligne propre) — *« Elle a compté, pas dans le même sens ; dans son sac, la coupure de 1992 a eu une voisine. »*
- **Le pantin** (`pr_pantin`, ligne propre) — tu as signé tout ce que le cabinet de Camille a rédigé. *« Tout était signé de sa main, rien n'était de sa plume. »*

### 9. La question de saison et les objectifs

**Le fil rouge** (`commission / kop / vente`, de la bible) : *Qui décidera de la Rive : la Commission qui compte, le kop qui l'occupe, ou celui qui vend ?* **Les objectifs** : saison 1, éviter la lettre (un solde négatif au plus) ; saison 2, trouver le Conseil ; saison 3, le vote. Les objectifs cachés de la bible : `geant_sans_lettre`, `geant_mot_tenu` (le mot de janvier tenu), `geant_remonte_propre` (remonter sans fonds, sans valise, sans Terrasses).

### 10. Le volume, et ce que le livre laisse au monde

**À produire** : le rôle de président est neuf — ses set-pieces (objectif, verdict, contrat, carrefour), ses alarmes et ses fins de jauge s'écrivent une fois pour les deux histoires de président (*La Maquette*, *Les Deux Téléphones*), soit environ 40 cartes partagées. Pour ce livre : prologue, 6 cartes ; script, 12 ancres ; 8 intrigues propres (*La maquette*, *Le Conseil*, *La caution*, *La 14B*, *La SCI*, *Le buffet*, *Le siège*, *Camille* : 36 cartes) ; 8 événements sombres (17 cartes) ; 3 intermèdes ; 26 cartes de décor ; 12 réactions ; les intrigues de président de la bible au réservoir (le derby en loge, l'entraîneur qu'on vire, les droits télé, le fils). Soit **environ 135 cartes neuves pour 170 à 190 vécues**. 3 fins neuves et 4 lignes ; 14 manchettes (« LA TRIBUNE EST A BRÛLÉ », « UNE ÉPAVE DANS LA RIVE », « QUI EST LE CONSEIL ? », « LE STADE AUX ENFANTS DU QUARTIER ») ; 45 répliques ; 3 missions ; 2 sponsors.

**Ce que le livre laisse au monde** : en novembre 1999, la tribune Est du stade de la Rive, en bois de 1931, a brûlé ; on l'a reconstruite en béton et gardé un siège 14B. En 2000, les plongeurs du confortement des berges ont remonté de la Rive une berline grise, vide, un sapin en carton au rétroviseur. La maquette de la seconde tranche des Terrasses est restée dans la vitrine de l'agence Tessandier. Un acte de 1931 donne le terrain de la Rive « aux enfants du quartier, à perpétuité ».

---

## Histoire 6 — 23 h 58

### 1. La fiche

**Rôle** : directeur sportif (`ds`, rôle à brancher, § 1.10) — héroïne par défaut, la directrice sportive · **Postulat** : `vendre_trente` (bible ch. 12 § 2), année 2003, Division 1 ; jauges de la bible (vestiaire 50, tribunes 45, direction 60, caisse 35), drapeau `objectif_trente` · **Club** : le Racing Aubérive, en première division, qui ne vit que de ses ventes · **Président** : Arnaud Vaubourg, le fils, sur le papier ; le père, président de la Ligue, au téléphone (patron du moteur : `aulard`) · **Entraîneur** : Vogler (`klopf`), son adjoint Vukić · **Saisons** : 2003-2004, 2004-2005, 2005-2006 · **Ancien titre** : *Vendre trente millions par an*.

> **Quatrième de couverture**
>
> Trente millions d'écus de ventes par an : c'est écrit dans ton contrat, page deux. La page trois, tu ne l'as pas lue.
>
> Tu as quarante-deux ans, tu es la première femme à diriger le recrutement d'un club de première division, et tu as un bureau au club-house avec un fax qui ne s'arrête jamais avant minuit. Chaque nuit, à 23 h 58 — deux minutes avant l'heure où ferme un mercato —, il imprime une page sans en-tête : un nom, un prix, un club.
>
> La première nuit, tu as jeté la page. La deuxième, le fax a imprimé une photo : toi, au Rideau Rouge, une enveloppe à la main, un agent en face. C'était il y a quatre ans. C'était une fois.
>
> Le papier thermique blanchit en six mois. Il te reste six mois pour savoir qui écrit, avant que les preuves ne s'effacent — les siennes et les tiennes.

### 2. Le genre et la touche

**Le chantage.** Une faute ancienne, petite, payée une fois ; quelqu'un l'a gardée, et s'en sert pour te faire vendre des joueurs à des prix qui ne sont pas les leurs. Le livre est une enquête dans son propre bureau : chaque suspect sait quelque chose que le maître chanteur sait aussi, et le coupable est celui à qui personne ne pense parce qu'il tape les rapports des autres.

**La touche : le fax de 23 h 58.** L'ordre sans visage, à l'heure fixe, sans numéro d'appel, sur un papier qui s'efface : le livre a une horloge (le mercato) et un sablier (le papier thermique, qui jaunit puis blanchit de saison en saison, et que Josiane photocopie avant qu'il ne meure). Le fax devient la carte : une page blanche aux bords enroulés, trois lignes en capitales, aucune signature. L'intermède : le fax n'arrête plus, le papier descend l'escalier, traverse la rue du Stade et coule dans la Rive ; sur chaque mètre, un nom et un prix, et le tien au bout. L'humour à froid est celui de Josiane : « Il y en avait un pour vous à 23 h 58. Je l'ai mis sous le presse-papier ; il voulait partir. »

### 3. Le personnage joué

Quarante-deux ans, ancienne adjointe de Lucien Barbier au recrutement dans les années 1990, puis quatre ans dans une agence de joueurs. **Ce qu'elle veut** : réussir là où on l'attend à la faute ; ne pas être la première et la dernière. **Ce qu'elle cache** : en 1999, quand la maison de retraite de son père a menacé de le mettre dehors, elle a pris au Rideau Rouge une enveloppe de Fardelli pour lui envoyer un jeune joueur. Une fois.

### 4. La distribution

- **Rocco Fardelli** (`fardelli`) — cinquante-sept ans, le premier suspect, celui de l'enveloppe. « Si je voulais te faire chanter, je chanterais moi-même, et juste. » Il ne ment pas : il connaît la photo, il ne l'a pas.
- **Ingrid Solvang** (`solvang`) — l'agente discrète, la clause, la rivale de Fardelli ; elle a des raisons de te vouloir à genoux, et aucune de le faire par fax.
- **Lucien Barbier** (`barbier`) — soixante et onze ans, la doudoune, l'œil contre les chiffres, la retraite en 2006. Un fax cite un rapport que lui seul a écrit. Il dicte ses rapports au stagiaire : il n'a plus les yeux pour taper.
- **Madame Vialat** (`vialat`) — elle recompte chaque fenêtre et voit que tes prix sont bas de trente pour cent. « Quelqu'un, quelque part, compte la différence. »
- **Madame Josiane** (`josiane`) — soixante-cinq ans. Elle photocopie chaque fax avant qu'il ne blanchisse et range les copies dans un classeur à part. Ce classeur ressortira en 2024 (*L'Oreillette*).
- **Vogler** (`klopf`) et **Zoran Vukić** (`vukic`) — l'entraîneur qui veut un latéral gauche et voit partir ses milieux ; l'adjoint qui te dit, une fois, que le stagiaire prend l'escalier du sous-sol tous les soirs.
- **Dembo** (`dembo`) — trente-sept ans, capitaine, ton ami depuis vingt ans ; le premier nom du fax.
- **Pierre Massenet** (`meneche`) — consultant de Télé-Stade, la vitre baissée sur le parking.
- **Cheikh Ilyas** (`nassir`) et **Hubert Malbec** (`malbec`) — la canette orange qui veut placer sa recrue ; Valentienne qui offre pour ton capitaine.
- **Léa** (`lea`) — L'Écho, qui écrira l'article et mettra les noms dans l'ordre des faits.

**Les visages nouveaux**

- **Joachim Ferlac**, 24 ans — « le stagiaire », école de commerce, un ordinateur portable, poli avec tout le monde, qui tape au propre les rapports de Barbier et ton carnet. Il croit que le marché est une formule et les gens des variables. Il a acheté ta photo aux archives du Rideau Rouge, qui garde tout et vend parfois. Il envoie les fax du sous-sol du club-house, par une vieille ligne de la buanderie oubliée depuis 1987, et touche des commissions par une société à son nom, JF Conseil. C'est le coupable ; en 2024, il sera le modèle (*L'Oreillette*).
- **Tibo Rancé**, 17 ans — le milieu du centre de formation, celui que tout le monde veut, qui demande si tu veux qu'il signe. En 2011, il mourra chambre 12 (*Chambre 12*).
- **Bertrand Rancé**, 46 ans — son père, chauffeur-livreur, une ardoise à l'arrière-salle du Terminus que le club étranger propose d'effacer si le fils signe.
- **Arnaud Vaubourg**, 38 ans — le président sur le papier, humilié par son père, soupçonné à raison d'avoir envie de tout faire sauter ; il n'a pas le courage d'écrire un fax.

### 5. La structure

**Saison 1 (2003-2004) — Le premier nom.** Le contrat et sa page trois. Le premier fax, la photo, le presse-papier de Josiane. Fardelli au café de la Mairie. Dembo qui lace ses chaussures au bord du terrain annexe et demande si tu le vends ou si tu le lui dis d'abord. La saison finit sur la vente de Dembo à Valentienne, au prix du fax ou à un autre.

**Saison 2 (2004-2005) — Les suspects.** Le gaucher de Kerbrouck cité par le fax ; Barbier et la doudoune. Le Rideau Rouge, cinq ans après : « un garçon poli, l'été où vous avez signé ». Le fax du salon qui imprime une page blanche à 23 h 58. Le petit Rancé au centre, et son père au Terminus. Massenet à la vitre. Vialat aligne tes ventes. La saison finit sur le fax de Tibo : quatre millions, avant lundi, pour un gamin qui en vaut quinze.

**Saison 3 (2005-2006) — Le sous-sol.** Le faux nom écrit dans ton carnet, que seul le stagiaire tape au propre. La nuit du sous-sol, à 23 h 57. L'offre de Ferlac. Le père Rancé, au comptoir du Terminus, qui sait maintenant qui est le stagiaire. L'acte final se joue en une nuit, entre le sous-sol et le Terminus.

**Les vingt scènes clés**

1. **La page deux** — *bureau du directeur sportif, prologue.* Arnaud Vaubourg pose ton contrat ouvert : « Trente millions de ventes par an. Mon père a insisté. La page trois, c'est l'usage. » ← *Je lis la page trois* · → *Je signe sans lire*
2. **23 h 58** — *bureau, nuit.* Le fax se réveille dans le noir et imprime une page sans en-tête : DEMBO — VALENTIENNE — 6 MILLIONS — AVANT VENDREDI. Aucun numéro d'appel. ← *Je jette la page* · → *Je la garde*
3. **La photo** — *bureau, la nuit suivante.* Le fax imprime une photo granuleuse : toi au Rideau Rouge en 1999, une enveloppe kraft à la main, Fardelli en face. Dessous : VENDREDI. ← *J'appelle Fardelli* · → *J'appelle Malbec*
4. **Le presse-papier** — *secrétariat, matin.* Josiane tend une photocopie : « Le papier de fax, ça blanchit ; la photocopie, non. Je continue ? » ← *Continuez, Josiane* · → *Jetez tout*
5. **La gourmette** — *café de la Mairie, midi.* Fardelli remue son café : « Si je voulais te faire chanter, je chanterais moi-même, et juste. Ce n'est pas moi. Mais je connais la photo. » ← *Qui l'a prise ?* · → *Je ne vous crois pas*
6. **Les lacets** — *terrain annexe.* Dembo lace ses chaussures : « On dit que Valentienne me veut. Tu me vends, ou tu me le dis d'abord ? » ← *Je te garde* · → *Je vends, je te le dis*
7. **Le gaucher de Kerbrouck** — *bureau, 23 h 58.* Le fax cite un rapport que seul Barbier a écrit : « Le gaucher de Kerbrouck, sous la pluie, trois millions. » ← *J'attends Barbier* · → *Je vends le gaucher*
8. **La doudoune** — *centre de formation.* Barbier, sa doudoune sur le banc : « Mes rapports, je les dicte au petit stagiaire ; je n'ai plus les yeux pour taper. Tu me soupçonnes ? » ← *Pardon, Lucien* · → *Qui d'autre les lit ?*
9. **La maison garde tout** — *Rideau Rouge, 23 h (événement sombre).* L'homme en costume te reconnaît : « Les photos ? La maison garde tout. Elle vend, parfois. Un garçon poli, l'été où vous avez signé. » ← *Quel garçon ?* · → *Je ressors*
10. **La page blanche** — *ton appartement, 23 h 58 (événement sombre).* Le fax du salon, que personne n'utilise, se réveille et sort une page blanche, encore tiède. ← *Je débranche la ligne* · → *Je laisse branché*
11. **Les chaussettes** — *centre.* Tibo Rancé, les chaussettes sur les chevilles : « Mon père dit qu'un club de l'étranger paie ses dettes si je signe. Vous voulez que je signe ? » ← *Ne signe rien* · → *C'est ta chance*
12. **Le fax du petit** — *bureau, 23 h 58.* RANCÉ — CLUB ÉTRANGER — 4 MILLIONS — AVANT LUNDI. Au matin, Josiane photocopie deux fois. ← *Je vends Tibo* · → *Je refuse*
13. **La vitre** — *parking du club-house (événement sombre).* Massenet baisse la vitre : « Le petit Rancé à quatre millions ? À ce prix-là, on ne vend pas, on se débarrasse. Je dis quoi, dimanche ? » ← *Rien, pour l'instant* · → *La vérité, dimanche*
14. **Le tapis vert** — *arrière-salle du Terminus, nuit.* Bertrand Rancé, une pile de jetons devant un autre : « Si mon fils part lundi, l'ardoise est effacée. Vous allez m'en empêcher ? » ← *Je paie son ardoise* · → *Je le laisse jouer*
15. **Intermède : le papier** — *rêve.* Le papier sort du fax, descend l'escalier, traverse la rue du Stade et coule dans la Rive ; sur chaque mètre, un nom et un prix. Le tien est au bout. Un bouton : *Je déchire*
16. **Trente pour cent** — *bureau.* Vialat aligne tes ventes : « Tous vos prix sont bas de trente pour cent. Je ne juge pas. Quelqu'un, quelque part, compte la différence. » ← *Je vous dis tout* · → *Le marché est bas*
17. **Le faux nom** — *bureau.* Tu écris dans ton carnet un joueur qui n'existe pas : « Sá Moreira, milieu, Lusitanie, deux millions. » Une seule personne tape ton carnet au propre. ← *Je donne le carnet* · → *Je garde le carnet*
18. **23 h 57** — *sous-sol du club-house, la vieille buanderie (acte final).* Une ligne de fax oubliée depuis 1987 ; Joachim Ferlac en pull, l'ordinateur ouvert. À l'écran : SÁ MOREIRA — 2 MILLIONS. ← *J'allume la lumière* · → *J'attends qu'il envoie*
19. **Le modèle** — *sous-sol.* Il ne se lève pas : « Je ne vous fais pas chanter, je vous corrige. Les prix sont faux, les gens aussi. Associez-vous : dans dix ans, on ne vendra plus personne sans moi. » ← *Je vous dénonce* · → *Je m'associe*
20. **Une heure** — *comptoir du Terminus, nuit.* Bertrand Rancé sait qui est le stagiaire. « Laissez-le-moi une heure, et votre photo, personne ne la reverra. » ← *Je préviens la police* · → *Je ne dis rien*

**Les graines et ce qui les paie.** La page trois (1) fait de toi, personnellement, la responsable des commissions d'intermédiaires : c'est ce que Vialat trouve (16). Les photocopies de Josiane (4) survivent au papier thermique et font la preuve (et un autre livre). Barbier qui dicte (8) désigne celui qui tape ; le Rideau qui vend (9) dit « un garçon poli ». Le faux nom (17) piège le seul lecteur du carnet (18). Le père Rancé (14) revient au comptoir (20) avec la pire offre du livre.

**L'acte final.** Une seule nuit : le sous-sol (18, 19), puis le Terminus (20). La fin rare exige d'avoir refusé la vente de Tibo (12), payé l'ardoise du père avec de l'argent propre (14) et gardé Vialat de ton côté.

### 6. Les soirs, les missions, les sponsors, les biens

**Les événements sombres** (huit) — le fax lui-même n'en est pas un : il est le script ; les événements sont ce qu'il fait arriver :

- **La photo** — bureau (`bureau`), nuit, saison 1. Scène 3.
- **Le bureau visité** — bureau, nuit, saison 1 : quelqu'un a déplacé ton carnet d'un centimètre et essayé la combinaison du coffre. Rien ne manque. Josiane l'a remarqué avant toi.
- **La maison garde tout** — Rideau Rouge (`club_prive`), 23 h, saison 2. Scène 9.
- **La page blanche** — appartement (`domicile`), 23 h 58, saison 2. Scène 10.
- **La voiture devant chez toi** — rue (`domicile`), minuit, saison 2 : un homme dans une voiture, un appareil photo sur les genoux, photographie ta porte. Rien que ta porte. C'est le photographe du Rideau, qu'on a payé une seconde fois.
- **La vitre** — parking (`parking`), saison 2. Scène 13.
- **Le tapis vert** — arrière-salle du Terminus (`tripot`), nuit, saison 3. Scène 14.
- **23 h 57** — sous-sol du club-house (`bureau`), acte final. Scènes 18 à 20.

**Les missions** (trois) :

- **Les négatifs du Rideau** — donneur : le portier du Rideau Rouge (`club_prive`, nuit), si `flag(photo_rideau)`. Racheter les négatifs de 1999 : une grosse somme, en liquide. Les avoir ne supprime pas la photo du maître chanteur ; ça supprime toutes les autres. Pose `vl_negatifs`.
- **Les carnets de Barbier** — donneur : Lucien Barbier (`centre`, après-midi), si `flag(barbier_soupconne)`. Rapporter ses vieux carnets de son casier du centre : tu y trouves, glissées entre les pages, des photocopies de ses rapports tapées au propre, avec des annotations d'une autre main. Pose `vl_carnets`.
- **L'ardoise du père** — donneur : Bertrand Rancé (`tripot`, nuit). Payer sa dette pour que le fils n'ait pas à signer. Avec ton argent, c'est une fin rare qui s'ouvre ; avec les primes de la Mutuelle, c'est la porte de la garde à vue.

**Les sponsors** :

- **La canette orange** (gris) — Ilyas, en 2003, veut placer la recrue de son « club frère » contre deux millions sur la manche. L'argent est propre ; la recrue ne joue pas, elle se montre.
- **La Mutuelle des Quais** (louche) — elle propose des « primes de performance » versées à la directrice sportive en personne, en liquide, pour chaque vente au-dessus de l'objectif. C'est par ses comptes que les clubs acheteurs reversent les commissions de JF Conseil : comprendre d'où vient l'argent de la Mutuelle, c'est remonter au sous-sol.

**Les biens et la saisie.** Une directrice sportive de 2003 vit en écus : un **appartement neuf sur la Rive**, dans la première tranche des Terrasses, dont les fenêtres donnent sur le terrain vague de la seconde ; une **citadine** de fonction ; et, à chaque vente, une **montre de plongée en acier** que Fardelli fait livrer (`cadeau_montre_acier`), « pour le temps que tu me fais gagner ». **La saisie** tombe à la fin de la saison 2, quand Vialat bloque tes comptes en attendant l'audit : les montres de Fardelli, les primes de la Mutuelle et ce qu'elles ont payé partent (`saisie_luxe`) devant Arnaud Vaubourg qui « ne savait pas ». C'est le moment où tu n'as plus rien à perdre, et où tu écris un faux nom dans ton carnet.

### 7. Ce que dit la ville

- *Passant, toi* — si `saison == 1` : « Au recrutement, maintenant, c'est vous ? Ma fille dit qu'on n'avait jamais vu ça ici. Moi je dis qu'on verra au mercato. »
- *Madame Josiane, club* — si `flag(photocopies)` : « J'ai un classeur pour vos fax de nuit. Le papier jaunit déjà sur les bords. La photocopie tiendra plus longtemps que nous. »
- *Ancien, époque* — si `annee >= 2004` : « Le fax, bientôt, ce sera fini, dit mon neveu. On enverra tout par l'ordinateur. Comme si les mauvaises nouvelles devaient aller plus vite. »
- *Fan, club* — si `flag(dembo_vendu)` : « Dembo à Valentienne, à trente-sept ans. Vous auriez pu le laisser finir ici. On l'aurait porté jusqu'à la buvette. »
- *La libraire-papetière, rumeur* — si `flag(fax_nuit)` : « Mon fax public ferme à dix-neuf heures. Personne n'envoie rien d'ici à minuit. Il est sous clé, je vous dis. »
- *Enfant, toi* — si `flag(tibo_vendu)` : « Tibo Rancé, il est parti où ? Il m'avait promis un maillot. Il n'a pas eu le temps, je crois. »
- *Passante, sombre* — si `flag(voiture_photo)` : « Il y avait un homme dans une voiture devant chez vous cette nuit, avec un appareil. Il a pris votre porte. Rien que la porte. »
- *Lucien Barbier, toi* — si `flag(barbier_soupconne)` : « Je l'ai vu jouer sous la pluie, le gaucher de Kerbrouck. Je l'ai dit au petit stagiaire. Je dis tout au petit stagiaire. »
- *Vogler, club* — si `flag(trois_ventes)` : « Trois départs depuis août. Je vous demande un latéral gauche, vous m'enlevez un milieu. Vous vendez pour qui ? »
- *Le buraliste du Quai, argent* — si `flag(prix_bas)` : « Au Quai, on parie sur vos ventes, maintenant, plus sur les matchs. Le petit Rancé à quatre millions, c'est à trois contre un. »
- *Pierre Massenet, rumeur* — si `flag(vitre)` : « Dimanche, je dis à l'antenne que vos prix sont bas. Lundi, quelqu'un me dira pourquoi. Il y a toujours quelqu'un. »
- *Fan, sombre* — si `flag(pere_rance)` : « Le père Rancé joue au Terminus tous les soirs depuis que son fils a signé. Il gagne, pour une fois. Ça ne lui va pas. »
- *Passant, quartier* — si `possede(residence_rive)` : « De la résidence, on voit le terrain de la seconde tranche. Ils disaient un parc. C'est toujours un parking, à moitié. »
- *Ancien, club* — si `flag(stagiaire_demasque)` : « Le petit stagiaire qui saluait tout le monde ? Il descendait au sous-sol tous les soirs. On croyait qu'il fumait. »
- *Léa, toi* — si `flag(verite_dimanche)` : « Votre nom et le sien dans le même article. Le vôtre vient en second. Ce n'est pas un cadeau, c'est l'ordre des faits. »

### 8. Les fins

- **Le classeur** (`trente_classeur`, la vérité) — tu dénonces Ferlac et ta propre enveloppe de 1999, avec le classeur de Josiane. *« {prenom} {nom} a posé sur le bureau de la Commission un classeur de photocopies et sa propre photo de 1999, et deux noms sont tombés le même jour. Le papier des fax était blanc depuis longtemps ; celui de Josiane, non. »*
- **L'associée** (`trente_associe`, le prix) — tu t'associes ; les ventes se font au prix du modèle ; Tibo part. *« Trente millions, deux saisons de suite, et un associé qu'on ne voyait jamais : {prenom} {nom} a vendu tous les noms que le fax imprimait à 23 h 58. Dix ans plus tard, on ne vendait plus personne sans le modèle de Joachim Ferlac. »*
- **Le petit reste** (`trente_petit_reste`, rare) — Tibo gardé, l'ardoise du père payée proprement, Ferlac piégé sans violence, Vialat à +1, les trente millions faits quand même. *« Tibo Rancé a joué au Racing jusqu'à vingt ans, et {prenom} {nom} a fait ses trente millions sans le vendre. Le fax s'est tu un jeudi ; Josiane a rangé le classeur en haut de l'armoire, pour plus tard. »*
- **Une heure** (`trente_une_heure`, pire) — tu laisses le père Rancé et les hommes du Terminus prendre le stagiaire « une heure ». *« On a retrouvé le stagiaire au matin sur le quai, vivant, le nez cassé, ses ordinateurs dans la Rive, et l'on a mis en examen {prenom} {nom} pour complicité. Le fax ne sonne plus ; on reçoit encore, certains soirs, des pages blanches. »*
- **La garde à vue** (`co_garde_a_vue`, ligne propre) — les primes de la Mutuelle remontées par la brigade. *« Quarante-huit heures pour expliquer des enveloppes ; la seule photo qu'ils ont posée sur la table était de 1999. »*
- **Le roi du mercato** (`ds_roi_mercato`, ligne propre) — *« Trop de commissions, trop bien rangées : l'enquête a commencé par le bureau du recrutement et fini au sous-sol. »*
- **D'un commun accord** (`ds_commun_accord`, ligne propre) — *« Arnaud Vaubourg a lu le communiqué de trois lignes à la presse ; c'était son père qui l'avait écrit. »*

### 9. La question de saison et les objectifs

**Le fil rouge** (`coach / scouts / president`, de la bible) : *À qui dois-tu les trente millions : au coach qui ne les a pas lus, aux scouts qui les trouvent, ou au président qui les a écrits — et qui t'écrit, la nuit, à 23 h 58 ?* **Les objectifs** : saison 1, les trente millions ; saison 2, garder le petit Rancé et savoir qui écrit ; saison 3, le nom. Les objectifs cachés de la bible : `vendre_trente_deux_ans`, `vendre_trente_sans_fardelli` (« On peut vendre trente millions sans dire "mon ami" »), `vendre_trente_le_petit_reste`.

### 10. Le volume, et ce que le livre laisse au monde

**À produire** : le rôle de directeur sportif est neuf — set-pieces, alarmes, fins de jauge et sous-paquet du mercato (bible ch. 12 § 5) s'écrivent une fois pour les deux histoires du rôle (*23 h 58*, *L'Oreillette*), environ 50 cartes partagées. Pour ce livre : prologue, 6 cartes ; script, 12 ancres ; 8 intrigues propres (*Le fax*, *La photo*, *Dembo*, *Barbier*, *Le petit Rancé*, *Le père*, *Vialat*, *Le sous-sol* : 35 cartes) ; 8 événements sombres (16 cartes) ; 3 intermèdes ; 24 cartes de décor ; 12 réactions ; 24 offres de mercato habillées par le fax. Soit **environ 135 cartes neuves pour 170 à 190 vécues**. 4 fins neuves et 3 lignes ; 14 manchettes (« 23 H 58 », « LE PETIT RANCÉ À QUATRE MILLIONS ? », « LE STAGIAIRE DU SOUS-SOL ») ; 45 répliques ; 3 missions ; 2 sponsors.

**Ce que le livre laisse au monde** : Tibo Rancé, formé au centre du Racing, a quitté le club avant ses vingt et un ans. Joachim Ferlac, stagiaire au Racing en 2003, a fondé plus tard une société d'analyse des joueurs. Madame Josiane garde un classeur de photocopies de fax datés de 2003 à 2006.

---

## Histoire 7 — Chambre 12

### 1. La fiche

**Rôle** : sélectionneur (`selectionneur`, rôle à brancher, § 1.10) · **Postulat** : `apres_fiasco` (bible ch. 14 § 4), année 2011, les Cobalts ; jauges de la bible (vestiaire 40, tribunes 20, direction 55, caisse 50), drapeaux `apres_fiasco`, `fiasco_2010`, `bus_menace` · **Base** : après le fiasco, la Fédération prépare les fenêtres loin de la capitale, à l'hôtel de la Rive et au stade de la Rive — la ville de son président · **Patron du moteur** : Jean-Marie Vaubourg (`aulard`), président de la Fédération · **Années** : 2011, 2012, 2013 (années civiles, quatre fenêtres par an) · **Ancien titre** : *Après le fiasco*.

> **Quatrième de couverture**
>
> En 2010, le bus n'est jamais descendu. Le pays est à vingt. On t'a confié les Cobalts pour le barrage de novembre, et la Fédération t'envoie les préparer loin de la capitale : dix jours à l'hôtel de la Rive, à Aubérive, une ville où personne ne les attend.
>
> Vingt-six joueurs, vingt-six doubles de clés au tableau de la réception, une réceptionniste de nuit qui voit tout de son fauteuil. La troisième nuit, Tibo Rancé, vingt-cinq ans, est retrouvé mort dans la chambre 12.
>
> La police veut sceller l'hôtel. La Fédération veut jouer le barrage. Les mutins accusent les nouveaux, les nouveaux accusent les mutins, et quelqu'un a demandé le double de la 12 à deux heures dix.
>
> Le premier jour, tu as signé une pile de papiers qu'on t'a présentée comme « les visites ». Tu ne les as pas lus.

### 2. Le genre et la touche

**Le huis clos.** Un hôtel, vingt-six hommes, un couloir, une chambre : à chaque fenêtre, pendant trois ans, la sélection revient dormir au même étage, et la vérité avance d'une porte. Le livre retourne la promesse du genre : il n'y a pas d'assassin parmi les vingt-six. Il y a un garçon qui savait qu'il pouvait mourir, une docteure qui l'a laissé jouer, un coéquipier qui lui a donné un sachet, un capitaine qui est entré et ressorti, une Fédération qui a choisi une heure, et une signature au bas d'une pile : la tienne.

**La touche : le tableau des clés.** Vingt-six crochets derrière le comptoir de la réception, vingt-six doubles, et un cahier de nuit où Sandrine Lavergne note qui demande quoi, et quand. Chaque soir de fenêtre, une carte rituelle : le tableau à minuit, les crochets vides. La liste des vingt-six, le rituel du sélectionneur, devient ce tableau. En appoint : le standard de l'hôtel qui sonne à trois heures (« Passez-moi la 12 ») ; la photo publiée sur le Flux à 1 h 47, avec une main dans le coin ; l'intermède du couloir sans fin, où toutes les portes portent le numéro 12 ; l'humour à froid du directeur de l'hôtel : « Nous ne louons plus la 12. À vrai dire, nous ne la louions pas beaucoup avant. »

### 3. Le personnage joué

Cinquante-deux ans, entraîneur de club honorable, nommé parce que personne d'autre ne voulait du poste après le bus. **Ce qu'il veut** : refaire un groupe, qualifier les Cobalts, que le pays revienne. **Ce qu'il cache** : la signature du premier jour, sous celle de la docteure, sur le dossier de Rancé ; puis, à partir de la deuxième année, la page du cahier de nuit qu'il garde dans sa poche.

### 4. La distribution

- **Jean-Marie Vaubourg** (`aulard`) — soixante-dix-neuf ans, président de la Fédération. À quatre heures du matin, en robe de chambre, il décide l'heure de la découverte et que le barrage se joue. Il ne ment pas : il choisit.
- **Madame Josiane** (`josiane`) — secrétaire de la Fédération. Elle a posé un trombone rouge sur le dossier du dessus de la pile, celui de Rancé : son avertissement, que personne n'a lu.
- **Aurélien Dauzat** (`dauzat`) — secrétaire général ; le procès-verbal de quatre heures, dans un registre. Les procès-verbaux ne mentent pas, dit-il ; on leur fait dire ce qu'on a décidé.
- **Lian Mbako** (`mbako`) — trente-sept ans, le capitaine mutin de 2010, sa dernière liste. C'est lui qui a demandé le double de la 12 à 2 h 10, entré, essayé de ranimer le garçon, et qui est ressorti à 2 h 25 sans rien dire. Il avait bu. En 2010, il était resté dans le bus.
- **Karim Fauvel** (`fauvel`) — président du syndicat des joueurs ; il défend les mutins et réclame la vérité, dans cet ordre.
- **Aimé Rossard** (`rossard`) — soixante-treize ans, consultant ; un dimanche soir sur le plateau de Vence, il dit le nom de Mbako.
- **Nadia Rouvier** (`rouvier`) — la kiné des Cobalts, qui coud le numéro de Rancé sur vingt-cinq manches la nuit du barrage, et qui sait où la docteure range ses dossiers.
- **Léa** (`lea`) — encore à L'Écho : elle trouve la photo de 1 h 47.
- **Judith Amsel** (`amsel`), la procureure — elle fait sceller la 12 et ouvre l'information judiciaire.
- **Rocco Fardelli** (`fardelli`) — l'agent de Rancé, soixante-cinq ans, qui appelle le standard à trois heures du matin la nuit suivante parce que son joueur ne répond plus. Personne ne l'a prévenu.
- **Madame Aubert** (`aubert`) — ministre jusqu'en 2012 : elle veut l'hymne chanté et le pays tranquille.
- **Gégé** (`gege`) — le virage d'Aubérive vient devant l'hôtel avec des bougies, parce que Rancé était d'ici ; quelqu'un, dans la même foule, jette une pierre dans la fenêtre du 14.

**Les visages nouveaux**

- **Yanis Ferrol**, 22 ans — le nouveau, milieu de Valdorne, celui qui veut le brassard. La main de la photo de 1 h 47 est la sienne : il a donné à Rancé le sachet qu'il prend avant les matchs. Il ne savait pas, pour le cœur.
- **La docteure Hélène Arzel**, 44 ans — médecin de la Fédération. En 2010, elle a trouvé la maladie du cœur de Rancé ; il l'a suppliée, elle a signé « apte ». Ce qu'elle veut : qu'on dise qu'il a choisi. Son secret : elle a gardé l'original.
- **Sandrine Lavergne**, 42 ans (venue de *La Route de la Rive*) — la réceptionniste de nuit, en fauteuil depuis 1984. Son cahier dit tout ; personne ne le lui a demandé.
- **La commandante Malika Benali**, police judiciaire — elle veut les heures exactes de chaque chose, et les obtient.

### 5. La structure

**2011 — La nuit.** Mars : le bus du fiasco a suivi la sélection jusqu'au parking de l'hôtel ; la pile des visites ; le premier tableau des clés ; le choix du capitaine. Septembre : la liste. Novembre : dix jours à l'hôtel avant le barrage ; la troisième nuit, 2 h 10, puis 2 h 30, le téléphone de ta chambre ; la réunion de quatre heures ; les scellés ; « Passez-moi la 12 » ; le barrage joué en deuil. L'année finit sur la version officielle : malaise cardiaque, constaté à six heures.

**2012 — Les portes.** Chaque fenêtre ramène les Cobalts au même étage ; la 12 reste scellée, puis fermée. La photo de 1 h 47 ; Ferrol. Rossard à l'antenne. Les bougies et la pierre. Le cahier de nuit de Sandrine. Le Continental en juin, si le barrage a été gagné. L'année finit dans le bus du fiasco, la nuit, avec Mbako.

**2013 — Les signatures.** Le dossier de 2010 et ta signature dessous. La docteure Arzel et sa valise. Le procès-verbal de Dauzat. Au printemps, « le ministre » dissout le comité fédéral (`sous_tutelle`) : Vaubourg n'est plus là pour choisir les heures, et le registre reste à Dauzat. L'appartement de fonction repris, et la seule chambre libre de l'hôtel : la 11. L'acte final : la dernière fenêtre, la porte de la 12 ouverte sur la mère de Rancé, et la conférence de presse après le match de qualification.

**Les vingt scènes clés**

1. **Le bus du fiasco** — *parking de l'hôtel de la Rive, prologue.* Le bus de 2010 a suivi la sélection jusqu'ici, la banderole MONDIAL encore sur le pare-brise. Josiane tient les clés : « On le rend, ou vous montez dedans d'abord ? » ← *Je monte dedans* · → *Rendez-le ce matin*
2. **Les visites** — *salon de l'hôtel, prologue.* Josiane pose une pile de dossiers médicaux, un trombone rouge sur celui du dessus : « Tout le monde signe sans lire, ici. » Le dessus, c'est Rancé. ← *Je lis le premier* · → *Je signe la pile*
3. **Le tableau** — *réception, minuit (rituel).* Vingt-six crochets, vingt-six doubles. Sandrine Lavergne, dans son fauteuil : « Ce soir, il en manque deux. Vous voulez savoir lesquels ? » ← *Lesquels ?* · → *Je ne surveille personne*
4. **Le brassard** — *salon.* Mbako, le brassard de 2010 dans la poche, et Yanis Ferrol à l'autre bout du salon. Ils attendent tous les deux. ← *Mbako, une dernière fois* · → *Ferrol, pour la suite*
5. **2 h 10** — *ta chambre, nuit (événement sombre).* Des pas dans le couloir, une porte, puis plus rien. À 2 h 30, le téléphone : Sandrine. « Montez au 12. La docteure est déjà là. » ← *J'y monte* · → *J'appelle la police*
6. **Quatre heures** — *petit salon fermé.* Vaubourg en robe de chambre, Dauzat avec un bloc, la docteure les mains vides : « Malaise cardiaque, découvert à six heures par la kiné. Le barrage se joue. Vous êtes d'accord ? » ← *Je suis d'accord* · → *Je veux la police*
7. **Les scellés** — *couloir du deuxième, matin.* La commandante Benali pose les scellés sur la 12 et se retourne : « Personne ne sort avant ce soir. Vous jouez samedi ? Moi, je travaille samedi. » ← *On jouera* · → *On ne jouera pas*
8. **Passez-moi la 12** — *ta chambre, 3 h (événement sombre).* Le standard sonne. Une voix d'homme âgé, essoufflée : « Passez-moi la 12. C'est son agent. Il ne répond plus depuis hier. » ← *Je lui dis* · → *Je raccroche*
9. **Le barrage** — *stade de la Rive, Grand Match.* Minute de silence ; sur chaque manche, le numéro de Rancé cousu par Rouvier pendant la nuit. Le vestiaire attend que tu parles. ← *Je parle de lui* · → *Je les laisse se taire*
10. **1 h 47** — *L'Écho.* Léa tourne son écran : sur le Flux, à 1 h 47, Rancé vivant, assis sur son lit ; dans le coin, une main qui tient un sachet. « Vous savez à qui est cette main ? » ← *Non* · → *Laissez-moi lui parler*
11. **Le sachet** — *terrain annexe, entraînement.* Ferrol regarde ses crampons : « Il voulait se sentir comme avant. Je lui ai donné ce que je prends avant les matchs. Personne ne savait, pour son cœur ? » ← *Tu vas le dire* · → *Tu ne dis rien*
12. **Le plateau** — *appartement, dimanche soir.* Rossard, sur le plateau de Vence : « Moi, à sa place, je ne garderais pas un capitaine sorti de la 12 à deux heures vingt-cinq. » Il dit le nom de Mbako. ← *J'appelle la chaîne* · → *Je coupe le son*
13. **Le cahier de nuit** — *réception, nuit.* Sandrine ouvre son cahier à la page du 14 novembre : « 2 h 10, double du 12 à M. Mbako. 2 h 25, rendu. » « Personne ne me l'a demandé. Vous me le demandez ? » ← *Je vous le demande* · → *Refermez le cahier*
14. **Intermède : le couloir** — *rêve.* Le couloir du deuxième n'a pas de fin ; toutes les portes portent le numéro 12, derrière chacune une télévision allumée sur le barrage. Tu frappes, et c'est toi qui réponds. Un bouton : *J'ouvre*
15. **Le bus, la nuit** — *parking de l'hôtel (événement sombre).* Mbako seul dans le bus de 2010, une bouteille entre les pieds : « En 2010, je suis resté dans le bus. Cette nuit-là, je suis entré. Il était froid. J'ai eu peur d'être encore celui qui reste. » ← *Tu vas témoigner* · → *Personne ne saura*
16. **La copie** — *cabinet de Rouvier.* Une photocopie de 2010 : *cardiomyopathie, déconseillé en compétition*, signé Arzel. Plus bas, sur la fiche d'aptitude de 2011, ta signature du premier jour. ← *Je vais voir Arzel* · → *Je brûle la copie*
17. **La valise** — *chambre de la docteure.* Arzel range ses ampoules : « Il m'a suppliée. Vendu gamin, ballotté de club en club, il voulait un tournoi, un seul. J'ai signé apte. Vous avez signé en dessous. » ← *On le dira ensemble* · → *Vous le direz seule*
18. **Le procès-verbal** — *salle du conseil de la Fédération, de passage.* Dauzat ouvre un registre : « Quatre heures : malaise cardiaque, constaté à six heures. » « Les procès-verbaux ne mentent pas. On leur fait dire ce qu'on a décidé. » ← *Je veux une copie* · → *Gardez votre registre*
19. **La 12** — *couloir du deuxième, dernière fenêtre de 2013.* L'hôtel n'a jamais reloué la 12. Tu demandes la clé ; la porte s'ouvre sur un lit fait, une télévision éteinte, et la mère de Tibo assise sur la chaise. ← *Je lui dis tout* · → *Je lui présente mes excuses*
20. **La conférence** — *salle de presse du stade, après le match de qualification.* Vence au micro, Léa au fond, Benali près de la porte. On t'a préparé une phrase sur le groupe ; la page du cahier de nuit est dans ta poche. ← *Je raconte la nuit* · → *Je parle du groupe*

**Les graines et ce qui les paie.** Le trombone rouge (2) est l'avertissement de Josiane, que la copie de Rouvier (16) fait relire. Les deux crochets vides du premier soir (3) sont ceux de deux joueurs qui sortaient au Corner : la ritournelle du tableau rend familier ce qui deviendra la preuve (13). Le bus du prologue (1) est le confessionnal de Mbako (15) ; « Rendez-le ce matin » n'y change rien : le loueur n'en veut plus, et le bus reste derrière l'hôtel jusqu'à la fin de 2012. La main de 1 h 47 (10) est celle de Ferrol (11). « Passez-moi la 12 » (8) revient en 2013 : le standard sonne encore, une fois, et c'est la mère.

**L'acte final.** La dernière fenêtre de 2013 : la porte de la 12 (19), puis la conférence (20). La fin rare naît la nuit d'avant, au tableau des clés : si les vingt-six doubles restent aux crochets jusqu'au matin, c'est que le groupe a décidé de parler avant toi.

### 6. Les soirs, les missions, les sponsors, les biens

**Les événements sombres** (huit) — l'hôtel les concentre, la ville les prolonge :

- **2 h 10** — hôtel de la Rive (`hotel`), nuit de novembre 2011. Scène 5 ; pose `rance_mort`.
- **Passez-moi la 12** — hôtel, 3 h, la nuit suivante. Scène 8.
- **Les bougies et la pierre** — devant l'hôtel (`rue`), soir, 2012. Le virage d'Aubérive pose des bougies pour le gamin du centre ; dans la même foule, une pierre traverse la fenêtre du 14, celle de Mbako. On ne sait pas qui a fait quoi ; les deux, peut-être.
- **Les scellés** — couloir du deuxième (`hotel`), nuit, 2012. Briser les scellés pour entrer seul dans la 12 : on y trouve un carnet d'écolier où Rancé avait écrit la liste des tournois qu'il voulait jouer, et la date de son dernier contrôle cardiaque, entourée. La commandante saura que tu es entré.
- **Le plateau** — appartement (`domicile`), dimanche soir, 2012. Scène 12 ; puis le téléphone qui ne s'arrête plus.
- **Le bus, la nuit** — parking de l'hôtel (`parking`), fin 2012. Scène 15.
- **L'enterrement** — caveau du Racing (`cimetiere`), fin d'après-midi de décembre 2011 : Rancé était d'ici. La mère, la pluie, le virage en silence ; le père n'est pas venu, il est au comptoir du Terminus. Fardelli se tient derrière un pilier.
- **Six heures du matin** — hôtel, 2013 : l'événement existant, déplacé. La commandante Benali et deux imperméables frappent à la chambre de la docteure Arzel ; sa valise est faite depuis la veille.

**Les missions** (trois) :

- **Le deuxième étage** — donneuse : Sandrine Lavergne (`hotel`, nuit), si `flag(tableau_cles)`. L'ascenseur de service est en panne depuis 2009 et elle n'a jamais vu les chambres du deuxième. Avec Rouvier, tu la portes dans l'escalier. En haut, devant la 12, elle sort la page du cahier de nuit. Pose `vl_cahier_nuit`.
- **Le dossier de 2010** — donneuse : Nadia Rouvier (`cabinet`, après-midi), si `flag(selfie)`. Sortir de la mallette fermée de la docteure le dossier de 2010, le temps d'une copie. Vol de pièce médicale : le metteur en scène tire la commandante. Pose `vl_dossier_arzel`.
- **La photo effacée** — donneur : un adolescent du square (`square`, soir), si `flag(selfie)`. Il a gardé la capture du post de 1 h 47, que Ferrol a effacé dans la nuit. Il la vend. Pose `vl_capture`.

**Les sponsors** :

- **L'hôtel de la Rive** (gris) — le propriétaire offre d'héberger les Cobalts gratuitement trois ans, si le nom de l'hôtel n'est jamais associé « à l'incident ». Le silence a un tarif de chambre.
- **Fulgor** (louche) — une boisson énergétique, nouveau « partenaire nutrition » de la Fédération, dont les coffrets de récupération étaient dans toutes les chambres, la 12 comprise. Le sachet de Ferrol n'était pas le leur ; ils paient quand même, en primes et en montres (`cadeau_montre_acier`), pour que le sélectionneur dise « malaise cardiaque » à la télévision.

**Les biens et la saisie.** Un sélectionneur vit dans des chambres : la Fédération lui prête un **trois-pièces sur le quai** pendant les fenêtres, et une berline de fonction. **La saisie est le tournant de 2013** : quand tu commences à poser des questions, la Fédération reprend l'appartement de fonction (`saisie_logement`). La seule chambre libre de l'hôtel pour la dernière fenêtre est la 11, celle de Lascombe, le gardien remplaçant, qui n'a plus voulu y dormir : le mur contre la 12. Les montres de Fulgor, si tu les as prises, partent avec l'information judiciaire (`saisie_luxe`).

### 7. Ce que dit la ville

- *Passante, toi* — si `saison == 1` : « Les Cobalts à l'hôtel de la Rive ? Ma mère y faisait la plonge en 1974. Elle dit que les murs sont fins, au deuxième. »
- *Fan, match* — si `tribunes < 30` : « Le pays vous siffle, mais ici on ne siffle pas les Cobalts. On siffle le bus. Il est garé derrière l'hôtel, vous savez. »
- *La fleuriste des Immortelles, sombre* — si `flag(rance_mort)` : « Des gerbes bordeaux et grises pour le petit Rancé. Il était d'ici, vous savez. Le Racing l'avait vendu gamin. »
- *Enfant, rumeur* — si `flag(selfie)` : « Mon cousin a la photo de 1 h 47. On voit une main dans le coin. Il dit que c'est la main d'un nouveau. »
- *Sandrine Lavergne, toi* — si `tranche == nuit` : « Vous descendez tous les soirs regarder mes crochets. Ils ne bougent pas quand vous les regardez. C'est après, qu'ils bougent. »
- *Ancien, époque* — si `flag(rossard_plateau)` : « Rossard a dit le nom de Mbako à la télé. En 1990, il pleurait sur le même plateau. On l'a moins aimé, ce soir. »
- *Passante, sombre* — si `flag(bougies)` : « Des bougies devant l'hôtel, et une pierre dans la fenêtre du 14. On ne sait pas qui a fait quoi. Les deux, peut-être. »
- *Madame Josiane, toi* — si `flag(visites_signees)` : « Le trombone rouge, je l'avais mis sur le premier dossier. On ne lit plus les trombones. »
- *Nadia Rouvier, toi* — si `flag(dossier_arzel)` : « J'ai cousu son numéro sur vingt-cinq manches, cette nuit-là. Depuis, je ne couds plus de numéros. »
- *Fan, sombre* — si `flag(mbako_aveu)` : « Mbako dans le bus, la nuit, tout seul. Les chauffeurs du Terminus l'ont vu. Il pleurait comme un gamin, ils disent. »
- *Passant, quartier* — si `flag(chambre_close)` : « L'hôtel ne loue plus la 12. Ils ont mis une grande plante devant la porte, pour qu'on ne voie pas le numéro. »
- *Jean Lavergne, l'ancien buraliste du Quai, toi* — si `flag(cahier_nuit)` : « Ma fille vous a ouvert son cahier. Elle ne l'ouvre pour personne. Ne lui faites pas regretter. »
- *Léa, rumeur* — si `flag(proces_verbal)` : « Quatre heures du matin dans le procès-verbal, six heures dans le communiqué. Deux heures de différence, c'est un titre. »
- *Ancien, club* — si `annee >= 2013` : « Les Cobalts reviennent à chaque fenêtre. Ils passent devant la 12 sans regarder. Sauf un, toujours le même. »
- *Passante, toi* — si `flag(verite_dite)` : « Vous avez dit "on l'a laissé", à la télévision. Pas "il est mort". Ma fille m'a demandé la différence. »

### 8. Les fins

- **On l'a laissé** (`fiasco_laisse`, la vérité) — au micro, tout : le cœur, la docteure, le sachet, la porte de 2 h 10, l'heure choisie à quatre heures, et ta signature. *« "On l'a laissé", a dit {prenom} {nom} devant les caméras, et le pays a appris la différence entre mourir et être laissé. La lettre de la Fédération est arrivée à minuit et une ; la chambre 12 n'a jamais été relouée. »*
- **Malaise cardiaque** (`fiasco_malaise`, le prix) — la version officielle tient ; les Cobalts se qualifient. *« Les Cobalts ont joué le Mondial avec un numéro cousu sur la manche, et {prenom} {nom} n'a jamais dit autre chose que "malaise cardiaque". Chaque novembre, une gerbe bordeaux et grise arrive au caveau du Racing, sans carte. »*
- **Le tableau complet** (`fiasco_tableau`, rare) — la dernière nuit de 2013, les vingt-six doubles restent aux crochets jusqu'au matin ; Mbako et Arzel parlent d'eux-mêmes ; Sandrine le note. *« La dernière nuit de la fenêtre de 2013, les vingt-six doubles sont restés au tableau jusqu'au matin, et Sandrine Lavergne l'a écrit dans son cahier. Mbako a parlé avant {prenom} {nom}, et c'était mieux ainsi. »*
- **La garde à vue** (`co_garde_a_vue`, ligne propre) — les scellés brisés, ou la page du cahier gardée pendant l'enquête. *« Quarante-huit heures pour une page de cahier gardée dans une poche ; la commandante a demandé l'heure exacte de chaque chose, et tu les savais toutes. »*
- **Les deux clans** (`sl_clans`, ligne propre) — mutins contre nouveaux. *« Deux clans, un couloir, une seule porte fermée ; on dort encore au deuxième en se tournant le dos. »*
- **Minuit et une** (`sl_minuit`, ligne propre) — *« La Fédération a attendu minuit et une, comme d'habitude ; Josiane a mis un trombone rouge sur la lettre. »*
- **L'homme du président** (`sl_homme_president`, ligne propre) — *« Quand Vaubourg est tombé, la chambre 12 est tombée avec lui, et sur toi. »*

### 9. La question de saison et les objectifs

**Le fil rouge** (`mutins / nouveaux / presse`, de la bible) : *À qui rends-tu les Cobalts : aux mutins qui ont tout cassé, aux nouveaux qui n'ont rien vu, ou à la presse qui filme la porte de la chambre 12 ?* **Les objectifs** : 2011, le barrage ; 2012, le Continental et la vérité ; 2013, la qualification et l'audience. Les objectifs cachés de la bible : `fiasco_pays_reconquis`, `fiasco_un_brassard`, `fiasco_le_bus_descend` (un tournoi entier sans que personne ne reste dans le bus — ici, sans que personne ne reste dans une chambre).

### 10. Le volume, et ce que le livre laisse au monde

**À produire** : le rôle de sélectionneur est neuf — set-pieces, cartes Liste, chaîne Tournoi, alarmes, fins de jauge (bible ch. 14 § 5, 7, 10, 11) s'écrivent une fois pour les deux histoires du rôle (*Chambre 12*, *Vingt degrés dedans*), environ 55 cartes partagées. Pour ce livre : prologue, 6 cartes ; script, 12 ancres ; 8 intrigues propres (*Le tableau*, *La nuit du 14*, *La main*, *Le capitaine*, *Le plateau*, *Le cahier*, *La docteure*, *Le procès-verbal* : 36 cartes) ; 8 événements sombres (17 cartes) ; 3 intermèdes ; 22 cartes de décor (l'hôtel, le couloir, la salle du petit-déjeuner, le parking du bus) ; 12 réactions ; 8 cartes Liste habillées en tableau des clés. Soit **environ 135 cartes neuves pour 160 à 180 vécues**. 3 fins neuves et 4 lignes ; 14 manchettes (« CHAMBRE 12 », « MALAISE CARDIAQUE, DIT LA FÉDÉRATION », « 1 H 47 », « ON L'A LAISSÉ ») ; 45 répliques ; 3 missions ; 2 sponsors.

**Ce que le livre laisse au monde** : Tibo Rancé est mort à l'hôtel de la Rive, chambre 12, en novembre 2011 ; l'hôtel ne loue plus la 12 et a mis une grande plante devant la porte. Sandrine Lavergne tient la réception de nuit et note dans un cahier qui demande les doubles des clés. Le bus du fiasco de 2010 est resté près de deux ans sur le parking de l'hôtel.

---

## Histoire 8 — L'Oreillette

### 1. La fiche

**Rôle** : directeur sportif (`ds`) · **Postulat** : `le_modele` (nouveau, à ajouter en fin de `content/postulats.yaml`), année 2024, Division 1 ; jauges proposées : vestiaire 45, tribunes 40, direction 65, caisse 55 ; drapeaux `le_modele`, `club_actif` · **Club** : le Racing Aubérive, en première division, propriété du fonds Almadis depuis 2019 · **Patron du moteur** : Cheikh Ilyas (`nassir`), soixante-huit ans, qui ne vient jamais et dont la voix passe par d'autres ; Jean-Marie Vaubourg (`aulard`), quatre-vingt-douze ans, président d'honneur, monte chaque matin à six heures et demie dans son ancien bureau · **Entraîneur** : Lian Mbako (`mbako`), cinquante ans · **Saisons** : 2024-2025, 2025-2026, 2026-2027.

> **Quatrième de couverture**
>
> 2024. Soixante-douze matchs par saison, un club qui est une ligne dans un tableur, et dans ton oreille, le modèle. Il choisit qui acheter, qui vendre, qui faire jouer. Il ne dort jamais. Depuis janvier, il parle avec la voix de l'homme qui l'a construit : Joachim Ferlac, retrouvé mort en décembre dans sa voiture, à la friche.
>
> « Vendez Kerdal avant lundi. »
>
> Le lundi, Kerdal est mort.
>
> La nuit, les projecteurs du stade vide s'allument tout seuls. Le vieux président d'honneur monte chaque matin à six heures et demie dans son ancien bureau ; le modèle t'a donné la date de sa mort. Tu dors deux heures par nuit. Tu as cessé de savoir si la voix est dans l'oreillette, ou si elle est en toi.

### 2. Le genre et la touche

**La folie.** Pas la folie de cinéma : l'insomnie, les comprimés, le calendrier à soixante-douze matchs, une voix qui sait tout de chacun parce qu'on lui a tout vendu, et un esprit qui finit par l'héberger. Le livre tient l'ambiguïté jusqu'au bout et n'y répond qu'à moitié : la machine est réelle, les morts aussi, la voix qui parle dans le noir à la fin n'est plus celle de personne.

**La touche : l'oreillette.** L'ordre sans visage est dans ton oreille. Les cartes de ce livre ont une troisième ligne : la voix (rendue à part, sous le texte, sans portrait), qui conseille, prédit, compte les jours. Elle prédit parfois le choix du joueur (« Tu vas refuser. Tu refuses toujours à cette heure-ci. »), et l'auteur ne s'en sert que trois fois dans le livre. En appoint : les projecteurs qui s'allument à trois heures sur une pelouse vide ; une vidéo où tu dis, avec ta voix, des choses que tu n'as jamais dites ; la laverie où tu te retrouves à minuit en train de laver la même chemise pour la troisième fois ; l'intermède de la pelouse de nuit, où Kerdal court à côté de toi sans transpirer. L'humour à froid est la vérité de la voix : une intérimaire qui lit un écran dans un centre d'appels de la capitale, « de vingt-deux heures à six heures ; l'après-midi, je fais les assurances ».

### 3. Le personnage joué

Quarante-six ans, analyste devenu directeur sportif. De 2015 à 2020, il a travaillé chez Ferlac Analytique, avant de partir sur une dispute dont il ne parle pas ; Almadis l'a engagé parce qu'il « parle modèle ». **Ce qu'il veut** : gagner avec la machine sans lui appartenir ; dormir. **Ce qu'il cache** : les comprimés du docteur Ober ; qu'il entend la voix même quand l'oreillette est posée sur la table de nuit ; et qu'il a écrit lui-même, en 2017, la ligne de code qui classe un joueur « fin de cycle ».

### 4. La distribution

- **Lian Mbako** (`mbako`) — l'entraîneur, cinquante ans, qui regarde courir ses joueurs et pas leurs courbes ; en 2026, il part sélectionner le Kambara. Le seul à te dire que Kerdal ne dort plus.
- **Jean-Marie Vaubourg** (`aulard`) — quatre-vingt-douze ans, la canne, l'escalier, le clou de la photo de 1974 au passage, le bureau qu'on lui laisse. Il porte un bracelet du club ; le modèle a sa date.
- **Cheikh Ilyas** (`nassir`) — le propriétaire. Il ne parle qu'une fois, en visite : « Ce n'est pas un club, c'est un actif. Le modèle aussi. Et vous, vous êtes un coût. »
- **Madame Josiane** (`josiane`) — quatre-vingt-six ans, retraitée, qui « range encore ». Elle a le classeur des fax de 2003 : Ferlac a commencé par des pages sans signature.
- **Karim Fauvel** (`fauvel`) — président du syndicat des joueurs : soixante-douze matchs, un mort, et la grève mondiale de 2026.
- **Léa** (`lea`) — rédactrice en chef du Quotidien ; elle achète, pour le prouver, les battements de cœur de tes joueurs à un revendeur de données.
- **Gégé** (`gege`) — quatre-vingt-un ans, et « le vieux », le compte anonyme du virage, qui poste à trois heures du matin. Une nuit, ce n'est pas lui.
- **Nino** (voix sans portrait, le neveu de Gégé, capo depuis 2020) — trente-neuf ans, le virage d'aujourd'hui.
- **Nadia Rouvier** (`rouvier`) — kiné à Saint-Étoile, de passage : elle te fait respirer, et enlève ton bracelet.
- **Ingrid Solvang** (`solvang`) — l'agente qui a repris le carnet de Fardelli et « vend à la machine ».
- **Nathalie Vence** (`vence`) — directrice de l'information, qui passe la vidéo truquée à l'antenne et la dément le lendemain.

**Les visages nouveaux**

- **Joachim Ferlac** (1979-2023) — le stagiaire de 2003, devenu le fondateur de Ferlac Analytique, vendu à Almadis en 2020, retrouvé mort dans sa voiture à la friche en décembre 2023. Il ne parle plus qu'avec la voix que le fonds a gardée.
- **Inès Kara**, 23 ans — l'opératrice du service de nuit d'Almadis, dans un centre d'appels de la capitale ; elle lit à voix haute ce que le modèle affiche, et quand il n'affiche rien, elle invente. Ce qu'elle veut : un contrat. Son secret : les phrases les plus terribles sont d'elle.
- **Erwan Kerdal**, 27 ans — défenseur, soixante-dix matchs l'an dernier, des antidouleurs dans son casier. Le modèle l'a classé « fin de cycle ».
- **Le docteur Mathis Ober**, 50 ans — médecin du club. Il prescrit tes comprimés et te demande de garder ton bracelet la nuit ; Almadis le paie pour les courbes de tout le monde, la tienne comprise.

### 5. La structure

**Saison 1 (2024-2025) — La voix.** L'oreillette posée dans ta main ; la voix de Ferlac. Vaubourg à six heures et demie et les jours qui lui restent. Mbako et Kerdal. « Vendez Kerdal avant lundi. » La muscu éclairée un lundi soir. Les projecteurs à trois heures. Les comprimés du docteur. La saison finit sur Kerdal, mort ou sauvé (le seul moyen de le sauver : le reposer contre le modèle et refuser de le vendre — l'objectif caché le plus difficile du livre).

**Saison 2 (2025-2026) — Le bruit.** La vidéo truquée. Le compte du « vieux » qui donne ton adresse. Le classeur de Josiane. La laverie à minuit. La grève de Fauvel. Le nom de l'opératrice, acheté au Terminus ; Inès dans le hall de l'hôtel de la Rive. Les courbes de Léa. La saison finit à six heures et demie, devant la porte fermée de l'ancien bureau, la lumière allumée depuis la veille, la voix qui dit l'heure à la minute.

**Saison 3 (2026-2027) — Le silence.** Le fonds reprend tout ce qui lui appartient : la voiture, le téléphone, l'ordinateur, l'oreillette. Dans le noir, à deux heures, la voix dit : « On commence par les ventes ? » Inès, au téléphone : le service de nuit a été supprimé le 3. L'acte final : le dernier mercato, à 23 h 58, un gamin de seize ans classé « fin de cycle », et personne dans ton oreille.

**Les vingt scènes clés**

1. **La voix** — *bureau du directeur sportif, prologue.* On te pose dans la main une oreillette couleur peau. Tu la mets ; une voix que tu connais : « Bonjour. On commence par les ventes ? » C'est celle de Joachim Ferlac, mort en décembre. ← *Qui parle ?* · → *On commence*
2. **Six heures et demie** — *escalier du club-house, matin.* Vaubourg monte avec sa canne, passe devant le clou où pendait la photo de 1974 et entre dans son ancien bureau. Dans ton oreille : « Il lui reste six cent douze jours. » ← *Taisez-vous* · → *Comment le savez-vous ?*
3. **Trois fois** — *terrain annexe.* Mbako regarde ses joueurs, pas ton écran : « Ton modèle veut Kerdal trois fois cette semaine. Kerdal ne dort plus. Je le fais jouer ? » ← *Le modèle a raison* · → *Il se repose*
4. **Fin de cycle** — *bureau, 23 h.* « Vendez Kerdal avant lundi. » Sur l'écran, une courbe rouge et deux mots : fin de cycle. La voix n'ajoute rien. ← *Je vends Kerdal* · → *Je refuse*
5. **Lundi** — *salle de muscu, 23 h (événement sombre).* La salle est éclairée, la radio crache ; l'agent d'entretien t'appelle : il a trouvé Kerdal entre deux bancs. Dans ton oreille, rien, puis : « C'était lundi. » ← *J'appelle le docteur* · → *J'enlève l'oreillette*
6. **Les projecteurs** — *ta fenêtre, 3 h (événement sombre).* Le stade s'allume, les quatre projecteurs d'un coup, sur une pelouse vide. Une silhouette court seule le long de la ligne de touche. ← *Je vais au stade* · → *Je ferme les volets*
7. **Un demi-comprimé** — *cabinet du docteur, 21 h.* Ober tend une boîte : « Un demi, pas plus. Vous dormirez quatre heures. Et gardez votre bracelet la nuit : j'ai besoin de vos courbes. » ← *Je prends la boîte* · → *Je garde mes courbes*
8. **Le classeur** — *chez Josiane.* Madame Josiane sort un classeur de 2003 : des photocopies de fax, des pages sans en-tête. « Il a commencé comme ça, le petit Ferlac. Votre voix, elle signe ? » ← *Je lis tout* · → *Rangez-le*
9. **La vidéo** — *appartement, minuit (événement sombre).* Sur le Flux, toi, dans ton bureau, qui dis avec ta voix des choses que tu n'as jamais dites sur des joueurs que tu as vendus. Trois cent mille vues. ← *Je porte plainte* · → *Je ne regarde pas*
10. **Le vieux** — *appartement, 3 h (événement sombre).* Le compte que le virage appelle « le vieux » poste : « Le DS du Racing entend des voix. On a l'adresse. » En bas, une voiture ralentit. ← *J'appelle Gégé* · → *J'éteins tout*
11. **À cette heure-ci** — *bureau, nuit.* Une offre pour ton capitaine à l'écran. La voix, calme : « Tu vas refuser. Tu refuses toujours à cette heure-ci. » ← *J'accepte* · → *Je refuse*
12. **La laverie** — *laverie, minuit (événement sombre).* Tu te réveilles sur la chaise en plastique, sous le néon ; ta chemise tourne dans la 4. Le gérant : « C'est la troisième fois ce soir. Vous voulez que je l'arrête ? » ← *Arrêtez-la* · → *Laissez tourner*
13. **La grève** — *vestiaire, 2026.* Fauvel pose une feuille sur le banc : « Soixante-douze matchs, un mort. Les joueurs du monde entier s'arrêtent vendredi. Votre modèle l'avait prévu ? » ← *Je soutiens la grève* · → *Le club joue*
14. **Intermède : la pelouse** — *rêve.* Tu cours sous les projecteurs ; Kerdal court à côté de toi et ne transpire pas. Il dit, avec la voix de Ferlac : « Il te reste trois cent douze jours. » Un bouton : *Je m'arrête*
15. **Le service de nuit** — *hall de l'hôtel de la Rive.* Une jeune femme en parka : « Je suis la voix. Enfin, je la lis. De vingt-deux heures à six heures. L'après-midi, je fais les assurances. » ← *Pourquoi Kerdal ?* · → *Pourquoi moi ?*
16. **Les courbes** — *bureau de Léa, de passage à L'Écho.* Léa étale des feuilles : les battements de cœur de tes joueurs, la nuit, vendus par le sponsor des bracelets. « La vôtre est dedans. Vous dormez deux heures. » ← *Publiez tout* · → *Pas la mienne*
17. **La porte** — *escalier du club-house, 6 h 30 (2026).* L'escalier est vide. La porte de l'ancien bureau est fermée, la lumière allumée depuis la veille ; la voix donne l'heure, à la minute. ← *J'ouvre la porte* · → *J'appelle Josiane*
18. **Propriété du fonds** — *bureau (la saisie).* Le représentant d'Almadis pose une liste : le téléphone, l'ordinateur, la voiture, l'oreillette. « Vous rendez tout ce soir. » ← *Je rends tout* · → *Je garde l'oreillette*
19. **Deux heures** — *appartement, nuit.* Plus rien dans ton oreille, plus d'écran. Dans le noir, la voix : « On commence par les ventes ? » Puis Inès, au téléphone, le lendemain : « Le service de nuit a été supprimé le 3. Il n'y a plus personne au bout. » ← *Personne* · → *Moi*
20. **23 h 58** — *bureau, la dernière minute du dernier mercato.* Une offre pour un gamin de seize ans du centre, que le modèle avait classé « fin de cycle » à seize ans. Ta main sur l'écran. Personne ne parle. ← *Je signe* · → *Je ne signe pas*

**Les graines et ce qui les paie.** Les jours qui restent à Vaubourg (2) paient à la porte du bureau (17). La ligne de code de 2017, que le personnage cache, est celle qui a classé Kerdal (4) et le gamin de la fin (20). Le classeur de Josiane (8) dit d'où vient la voix (un homme qui a toujours donné des ordres sans signer). Le bracelet du docteur (7) explique la vidéo, les courbes et la date de Vaubourg (16). « Tu refuses toujours à cette heure-ci » (11) est une phrase d'Inès (15), pas du modèle. Les projecteurs (6) sont un cycle de maintenance programmé à trois heures : on le découvre trop tard pour que ça rassure.

**L'acte final.** La voix sans oreillette (19) et la dernière minute du mercato (20). La fin rare se joue avant : la veille de la date de Vaubourg, si l'on s'est assis en face de lui.

### 6. Les soirs, les missions, les sponsors, les biens

**Les événements sombres** (huit) :

- **Lundi** — salle de muscu (`muscu`), 23 h, saison 1. Scène 5 ; il n'a pas lieu si Kerdal a été reposé et gardé.
- **Les projecteurs** — stade (`stade`), 3 h, saison 1. Scène 6.
- **La vidéo** — appartement (`domicile`), minuit, saison 2. Scène 9.
- **Le vieux** — appartement, 3 h, saison 2 : l'événement existant *Ils t'attendent*, à l'ère du Flux. Scène 10.
- **La laverie** — laverie (`laverie`), minuit, saison 2. Scène 12 : la laverie de la rue du Stade, où l'on venait recevoir des enveloppes, est devenue l'endroit où l'on se réveille.
- **La friche** — friche (`friche`), soir, saison 2 : la place où l'on a trouvé la voiture de Ferlac ; des bougies électriques, une oreillette posée sur une palette, encore allumée. Tu la prends, ou tu la laisses à la pluie.
- **La porte** — club-house (`bureau`), 6 h 30, fin de saison 2. Scène 17 : le mort de ce livre est celui de tous les autres, et il meurt à l'heure qu'on avait donnée.
- **Deux heures** — appartement, nuit, saison 3. Scène 19.

**Les missions** (trois) :

- **Le nom de la voix** — donneur : un ancien développeur de Ferlac Analytique, au comptoir du Terminus (`terminus`, soir), si `flag(voix_ferlac)`. Il vend le nom et l'horaire de l'opératrice de nuit. Pose `vl_nom_voix` ; ouvre la scène 15.
- **Les cartons de l'escalier** — donneuse : Madame Josiane (`clubhouse`, après-midi). Elle ne monte plus l'escalier ; elle te demande de redescendre trois cartons d'archives du grenier du club-house. Dans le troisième, le classeur de 2003. Pose `vl_classeur`.
- **De quoi dormir** — l'intrigue de ville existante *La cure du préparateur* (`cure_preparateur`, salle de muscu, soir), réhabillée : un préparateur sans club propose « quelque chose pour dormir vraiment ». Le sommeil vient ; le contrôle aussi, peut-être.

**Les sponsors** :

- **Pari-Rive** (louche) — l'application de paris floquée sur le maillot ; elle veut la composition une heure avant sa publication. L'argent est sale (`ville_francs_sales`), et c'est un délit d'initié qui dit son nom.
- **Cadence** (gris) — le sponsor des bracelets offre un bracelet à chacun : joueurs, staff, président d'honneur, anciens du virage. Il revend les courbes à Almadis. Pour toi, une **montre connectée** (`cadeau_montre_connectee`) qui compte tes nuits.

**Les biens et la saisie.** Le directeur sportif de 2024 vit dans un **duplex à la Tréfilerie** — l'usine de 1990 devenue lofts, « on a gardé le pont roulant » —, roule dans une **berline électrique** prêtée par le fonds, porte la **montre** de Cadence. **La saisie est le dépouillement** de la saison 3 : le fonds reprend sa voiture (`saisie_vehicules`), son téléphone, son ordinateur et son oreillette, et la voix reste. Si l'argent de Pari-Rive a payé quelque chose, la brigade financière prend le reste (`saisie_luxe`), et le duplex de la Tréfilerie redevient une vitrine chez Madame Tessandier.

### 7. Ce que dit la ville

- *Passant, toi* — si `saison == 1` : « C'est vous qui parlez tout seul sur le quai, le matin ? Ma femme dit que c'est l'oreillette. Moi je dis que tout le monde en a une. »
- *Enfant, quartier* — si `flag(projecteurs)` : « Le stade s'est allumé cette nuit, tout seul. Mon père dit que c'est la maintenance. Ma sœur dit que c'est Kerdal qui court. »
- *Le pharmacien, achat* — si `flag(comprimes)` : « Votre ordonnance du docteur Ober, encore. Je vous la sers. Je vous dis juste que la dernière fois, vous l'aviez déjà prise. »
- *Fan, sombre* — si `flag(kerdal_mort)` : « Kerdal, soixante-dix matchs l'an dernier. Trouvé entre deux bancs à la muscu. On devrait jouer moins, non ? »
- *Ancien, époque* — si `annee >= 2026` : « La grève de tous les joueurs du monde. En 1990, on aurait ri. Mon petit-fils dit que c'est la première bonne nouvelle du football. »
- *Madame Josiane, club* — si `flag(classeur_lu)` : « Le petit Ferlac tapait les rapports de Barbier, en 2003. Il disait bonjour à tout le monde. Il m'appelait Josie. Personne ne m'appelle Josie. »
- *Lian Mbako, toi* — si `relation.mbako >= 1` : « Mon premier entraîneur me regardait courir. Ton modèle regarde mon cœur la nuit. Je préférais qu'on me regarde courir. »
- *Passante, sombre* — si `flag(video)` : « Je vous ai vu dire des horreurs sur le Flux. Puis ma fille m'a dit que ce n'était pas vous. Je ne sais plus ce que j'ai vu. »
- *Gégé, rumeur* — si `flag(compte_vieux)` : « Le compte du vieux, c'est moi. Mais ce soir-là, ce n'était pas moi. Quelqu'un a mon mot de passe. Je l'avais écrit sur le frigo. »
- *Le vendeur du garage du Pont, achat* — si `flag(voiture_rendue)` : « Ils ont repris votre berline ce matin. Elle est montée toute seule sur le plateau du camion. Elle aussi, elle obéit. »
- *Passant, quartier* — si `possede(duplex_trefilerie)` : « Vous habitez à la Tréfilerie ? Mon grand-père y tirait du fil. Il disait que la sirène lui parlait la nuit. Vous dormez bien, là-bas ? »
- *Nadia Rouvier, toi* — si `flag(insomnie)` : « Respire. Ton bracelet dit cent dix au repos. Enlève-le, et dis-moi ce que dit ta poitrine. »
- *Fan, club* — si `flag(vaubourg_mort)` : « Vaubourg, mort à son bureau à six heures et demie. On dit que le modèle avait l'heure. Mon père dit que Vaubourg avait toujours l'heure, lui. »
- *Léa, rumeur* — si `flag(courbes)` : « Le cœur de vos joueurs se vend quatre écus la nuit. Le vôtre, six. Vous êtes plus rare. »
- *Ancien, époque* — si `flag(sans_oreillette)` : « Vous avez enlevé votre machine ? On vous voit regarder les gens, maintenant. On n'avait plus l'habitude. »

### 8. Les fins

- **Le silence** (`modele_silence`, la vérité) — tu enlèves l'oreillette pour de bon, et tu donnes à Léa les courbes, la voix, le nom de Kerdal et la ligne de 2017 que tu as écrite. Le fonds vend le Racing ; le docteur Ober est mis en examen. *« {prenom} {nom} a enlevé l'oreillette pour de bon et donné à Léa les courbes, la voix et sa propre ligne de code ; le fonds a vendu le Racing au printemps. On dit qu'à la Tréfilerie, une fenêtre s'éteint maintenant avant minuit. »*
- **La voix** (`modele_voix`, le prix) — tu obéis jusqu'au bout ; le Racing gagne ce que le modèle avait prévu ; Almadis te garde, au siège. *« Le Racing a gagné ce que le modèle avait prévu, et {prenom} {nom} a gardé la voix jusqu'au bout. L'année suivante, dans l'oreille du directeur sportif d'après, c'était sa voix qui disait : on commence par les ventes ? »*
- **Six heures et demie** (`modele_six_heures`, rare) — Vaubourg à +1, le classeur lu, l'oreillette posée avant la date, Mbako à +1 : la veille, tu montes t'asseoir en face de lui. *« Le modèle avait l'heure, il n'avait pas la chaise : {prenom} {nom} était assis en face de Jean-Marie Vaubourg quand il est mort à son bureau, à six heures et demie. Le vieux président a dit, à la fin, qu'il n'avait jamais aimé le téléphone. »*
- **La clinique** (`modele_clinique`, pire) — tu as gardé l'oreillette quand on te l'a reprise, et la voix n'a plus quitté la chambre. *« À la clinique des Hauts-de-Rive, {prenom} {nom} demande chaque soir qu'on éteigne la voix, et l'infirmière répond doucement qu'il n'y a personne. Personne ne sait lequel des deux a raison ; la voix, elle, dit l'heure. »*
- **La garde à vue** (`co_garde_a_vue`, ligne propre) — les compositions envoyées à Pari-Rive. *« Quarante-huit heures sans téléphone, sans écran, sans oreillette ; c'est la première fois en trois ans que personne ne t'a parlé à l'oreille. »*
- **Le burn-out** (`burn_out`, ligne propre) — *« Soixante-douze matchs par saison, deux heures de sommeil par nuit ; le corps a pris la décision que la voix n'avait pas prévue. »*
- **D'un commun accord** (`ds_commun_accord`, ligne propre) — *« Le communiqué tenait en trois lignes ; il avait été rédigé par le modèle. »*

### 9. La question de saison et les objectifs

**Le fil rouge** (nouveau : `modele / vestiaire / toi`) : *Qui décide, cette saison : le modèle, le vestiaire, ou toi ?* **Les objectifs** : saison 1, la fenêtre de l'été et celle de l'hiver ; saison 2, tenir les soixante-douze matchs ; saison 3, le silence. **Les objectifs cachés** : `modele_kerdal_vit` (Kerdal reposé contre le modèle et gardé : il vit, et la prédiction ment pour la première fois ; indice : « Une courbe rouge n'est pas une date. »), `modele_sans_voix` (une saison entière sans l'oreillette ; « On peut entendre un vestiaire sans machine. »), `modele_mbako` (Mbako part au Kambara en t'embrassant ; « Il préfère qu'on le regarde courir. »).

### 10. Le volume, et ce que le livre laisse au monde

**À produire** : le rôle de directeur sportif est partagé avec *23 h 58*. Pour ce livre : prologue, 6 cartes ; script, 12 ancres ; 8 intrigues propres (*La voix*, *Kerdal*, *Vaubourg*, *Les courbes*, *La vidéo*, *L'opératrice*, *La grève*, *Le dernier mercato* : 34 cartes) ; 8 événements sombres (16 cartes) ; 3 intermèdes et une trentaine de « lignes de voix » posées sur des cartes existantes ou neuves (la troisième ligne, § 2) ; 24 cartes de décor ; 12 réactions ; le sous-paquet de mercato, habillé par le modèle. Soit **environ 130 cartes neuves pour 170 à 190 vécues**. 4 fins neuves et 3 lignes ; 14 manchettes (« LE MODÈLE AVAIT L'HEURE », « KERDAL, SOIXANTE-DIX MATCHS », « QUI PARLE DANS L'OREILLETTE ? », « LE CŒUR À QUATRE ÉCUS ») ; 45 répliques ; 3 missions ; 2 sponsors.

**Ce que le livre laisse au monde** : Joachim Ferlac est mort en décembre 2023, retrouvé dans sa voiture à la friche ; sa société, Ferlac Analytique, a été vendue à Almadis en 2020. En 2024, le Racing appartenait au fonds Almadis. Jean-Marie Vaubourg est mort à son bureau du club-house, à six heures et demie, en 2026.

---

## Histoire 9 — Vingt degrés dedans

### 1. La fiche

**Rôle** : sélectionneur (`selectionneur`) — héroïne par défaut, la sélectionneuse · **Postulat** : `mondial_hiver` (nouveau), année 2029, les Cobalts ; jauges proposées : vestiaire 55, tribunes 60, direction 50, caisse 70 (l'État paie bien) ; drapeau `mondial_hiver` · **Base** : depuis le Mondial des amateurs de 2026, joué pendant la grève dans les petites villes, le stade de la Rive a une pelouse neuve et la Fédération y prépare les Cobalts ; la sélectionneuse vit rue des Lilas · **Patron du moteur** : Titi Bréhaut (`brehaut`), président de la Fédération depuis 2028 ; au-dessus de lui, « le ministère », une voix · **Années** : 2029, 2030 (le Mondial, en décembre, à Al-Dorado), 2031.

> **Quatrième de couverture**
>
> Janvier 2029, cimetière d'Aubérive. Un cercueil scellé arrive d'Al-Dorado : Kévin Marçais, vingt-quatre ans, électricien sur le chantier du Dôme. Cause du décès : « malaise ». Sa mère pétrit ton pain tous les matins, rue des Lilas. Elle ne te pose qu'une question : « Vous irez quand même ? »
>
> Tu es la première sélectionneuse des Cobalts. Le Mondial se joue en décembre 2030 sous un dôme à vingt degrés, dans un pays à cinquante. Le ministère t'appelle sans dire son nom. L'émirat t'envoie une montre, puis une voiture, puis les clés d'un appartement. Ton capitaine veut porter un brassard noir, taillé dans la chemise de travail d'un mort.
>
> Et dans une cave d'Aubérive, une très vieille secrétaire garde la copie d'un vote de 2010 qui n'aurait jamais dû avoir lieu.

### 2. Le genre et la touche

**La corruption d'État.** Personne, dans ce livre, ne prend une enveloppe pour soi. Un pays a vendu un vote contre un port et du gaz ; vingt ans plus tard, il a besoin que son équipe sourie dans le stade que ce vote a fait construire, et il dispose de tout pour l'obtenir : des cadeaux, des listes, le fisc, les subventions d'une association, un capitaine qu'on dit « fatigué ». Le mal est administratif, poli, et il a une adresse dans la ville : la maison de l'ancienne maire, rue Haute, fenêtre ouverte sur le stade.

**La touche : le brassard noir.** Un objet qui passe de main en main : taillé par la boulangère dans la chemise de travail de son fils, confié au capitaine, réclamé par le ministère, caché dans une valise, confisqué à la douane ou porté dans un tunnel. Où est le brassard ? est la question de chaque acte. En appoint : le ministère au téléphone, une voix jeune et polie qui ne dit jamais son nom (« On vous rappelle que la sélection ne s'exprime pas ») ; les cadeaux livrés le soir par coursier ; l'intermède du Dôme, la porte de service, la chaleur qui est un mur, et sur le toit un garçon en casque qui marche le long du bord et fait signe avec une baguette de pain. L'humour à froid est celui du conseiller : « Il n'y a pas eu de morts sur leurs chantiers. Il y a eu des retours anticipés. »

### 3. Le personnage joué

Cinquante ans, quarante sélections avec les Cobaltes dans les années 1990, entraîneuse de Mirevaux (la première section professionnelle), adjointe des Cobalts, nommée en 2028 : la première femme sur ce banc. **Ce qu'elle veut** : gagner le Mondial, et le faire droit ; dormir. **Ce qu'elle cache** : la « clause de réserve » de son contrat (aucune déclaration « non sportive ») et le fait qu'elle savait, en signant, que le ministère la choisissait aussi pour l'image ; et les listes que sa fille lui envoie chaque semaine.

### 4. La distribution

- **Sacha** (`sacha`) — vingt-sept ans, ta fille, dans l'association qui compte les ouvriers morts sur les chantiers du Mondial. Elle recompte chaque semaine. Elle ne te demande pas de ne pas y aller ; elle te demande ce que tu vas dire.
- **Madame Aubert** (`aubert`) — quatre-vingt-six ans, ancienne maire d'Aubérive, ancienne ministre des Sports (2002-2012). Le soir du vote de décembre 2010, son cabinet a appelé le délégué du pays à 23 h 40. Elle ne nie rien : « Un stade, ça se vote. » C'est la coupable du livre, et la seule à le dire sans baisser les yeux.
- **Madame Josiane** (`josiane`) — quatre-vingt-onze ans. Secrétaire de la Fédération en 2010, elle a tapé le procès-verbal, et en a fait une copie de trop, qui dort dans sa cave.
- **Titi Bréhaut** (`brehaut`) — soixante-douze ans, président de la Fédération ; il veut le Mondial sans histoire et sait ce que coûte une histoire.
- **Cheikh Ilyas** (`nassir`) — soixante-quatorze ans, président de la Ligue, ancien membre du comité du Mondial ; c'est par lui que passent les cadeaux et les bons mots.
- **Lian Mbako** (`mbako`) — sélectionneur du Kambara, dans le groupe des Cobalts : le Kambara portera le brassard noir. Il appelle pour savoir si tu le porteras aussi.
- **Karim Fauvel** (`fauvel`) — président du syndicat des joueurs jusqu'en 2030 : il soutient le brassard, et le ministre lui demande son âge.
- **Léa** (`lea`) — rédactrice en chef du Quotidien : elle publiera les listes de Sacha, et l'heure de 2010 si on la lui donne.
- **Nathalie Vence** (`vence`) — directrice de l'information, qui diffuse le match d'ouverture et sait où sont les caméras du tunnel.
- **Gigi Vecchio** (`vecchio`) — quatre-vingt-un ans, à la buvette des anciens : il demande qu'on lui rapporte « un peu de leur fraîcheur ». Il meurt en 2031.
- **Gégé** (`gege`) — quatre-vingt-sept ans : le virage ne regardera pas ce Mondial-là, exprès.

**Les visages nouveaux**

- **Marie-Jo Marçais**, 52 ans — la boulangère de la rue des Lilas, mère de Kévin. Elle veut qu'on ouvre le cercueil. Son secret : Kévin est parti là-bas pour payer le four de la boulangerie (l'intrigue de ville existante *Le four de la boulangerie*), et elle l'a laissé partir.
- **Noa Vandel**, 26 ans — le capitaine. Il veut porter le brassard au match d'ouverture. Son frère travaille encore sur le chantier du Dôme.
- **Aymeric Sauvan**, 31 ans — conseiller au ministère, la voix sans nom du téléphone, les cafés au café de la Mairie, les cadeaux. Il a peur : si les Cobalts font un geste, le contrat du gaz tombe, et sa carrière avec.
- **Kévin Marçais** (2004-2028) — électricien, mort sur le chantier du Dôme. Il n'apparaît que sur une photo en casque, au-dessus de la caisse, et dans l'intermède.

### 5. La structure

**2029 — Le cercueil.** Janvier : le cercueil scellé au cimetière, la question de la boulangère ; le pain, chaque matin, qui devient le rituel du livre. Le premier appel du ministère. La montre gravée DÔME 2030, livrée à vingt-deux heures. Les listes de Sacha. Le brassard, que Noa déplie au vestiaire. Le conseiller au café de la Mairie. L'année finit sur le barrage de qualification au stade de la Rive, et le ministre qui veut descendre au vestiaire.

**2030 — Les cadeaux.** La voiture blanche sur le parking. La cave de Josiane et l'heure de 2010. La maison de la rue Haute. Le fisc, qui découvre les cadeaux qu'on t'a faits. Le local de l'association forcé. Les deux listes des vingt-six, dont l'une raye le capitaine. Mbako au téléphone. Puis le départ : le brassard dans quelle valise ? Décembre : la chaîne Tournoi, hors ville, sous le Dôme ; l'homme qui tombe d'un échafaudage, au loin ; le tunnel du match d'ouverture.

**2031 — La minute.** Le retour, ou ce qu'il en reste ; l'ouverture du cercueil, ou son silence ; la mort de Gigi Vecchio et la minute de silence où l'arbitre ajoute une minute. Les fins se décident dans le tunnel de décembre et se paient en 2031.

**Les vingt scènes clés**

1. **Le cercueil scellé** — *cimetière, janvier 2029, prologue.* Un cercueil plombé, une étiquette de fret : « Température de transport : 4 °C ». Marie-Jo Marçais, en manteau sur son tablier : « Vous irez quand même ? » ← *Je ne sais pas* · → *J'irai*
2. **Le pain** — *boulangerie, 6 h 30 (rituel).* Marie-Jo te tend ta baguette sans te regarder ; sur le comptoir, la photo de Kévin en casque de chantier. ← *Je paie et je sors* · → *Je reste un moment*
3. **On vous rappelle** — *appartement, 23 h.* Numéro masqué ; une voix jeune et polie : « On vous rappelle que la sélection ne s'exprime pas sur ce qui n'est pas sportif. Bonne soirée. » ← *Qui êtes-vous ?* · → *Je raccroche*
4. **La montre** — *appartement, 22 h.* Un coursier : une montre en or gravée DÔME 2030, et une carte du comité d'organisation, « À la première sélectionneuse des Cobalts ». ← *Je la renvoie* · → *Je la garde*
5. **Les listes** — *appartement.* Sacha pose son ordinateur sur la table : quatre cent douze noms, des âges, des chantiers. « Kévin est à la page six. Tu vas les lire, ou les compter ? » ← *Je les lis tous* · → *Pas ce soir*
6. **Le brassard** — *vestiaire du stade de la Rive.* Noa Vandel déplie un brassard noir cousu à la main : « Marie-Jo l'a taillé dans la chemise de Kévin. Je le porterai au match d'ouverture. Vous m'en empêchez ? » ← *Porte-le* · → *Attends qu'on en parle*
7. **Les retours anticipés** — *café de la Mairie.* Aymeric Sauvan commande deux cafés : « Il n'y a pas eu de morts sur leurs chantiers. Il y a eu des retours anticipés. Votre capitaine porte ce qu'il veut, à l'entraînement. » ← *Et au match ?* · → *Je m'en vais*
8. **Le vestiaire** — *stade de la Rive, barrage de novembre 2029.* À la mi-temps, Sauvan te tend un papier plié : « Le ministre est en tribune. Il souhaite descendre au vestiaire. » ← *Le vestiaire est fermé* · → *Qu'il descende*
9. **La voiture blanche** — *parking du stade, 2030.* Une berline électrique blanche, un nœud sur le capot, les clés au contact, une carte : « Avec les compliments de Dorada. » ← *Je la rends* · → *Je la garde*
10. **La cave** — *chez Josiane, soir.* Elle descend à la cave avec une lampe : « J'ai tapé tous leurs procès-verbaux. Celui-là, j'en ai fait une copie de trop. Décembre 2010. Lisez l'heure. » ← *Je lis* · → *Remettez-le à sa place*
11. **23 h 40** — *cave de Josiane.* « 23 h 40 : appel du cabinet de la ministre. 23 h 52 : le délégué du pays modifie son vote. » En bas de la page, les initiales de Josiane. ← *Je photographie la page* · → *Je la lui laisse*
12. **La rue Haute** — *maison de Madame Aubert, soir.* Une couverture sur les genoux, la fenêtre ouverte sur le stade : « Un port, du gaz pour vingt ans, et un tournoi. Un stade, ça se vote. Le reste se perd. » ← *Vous saviez, pour les morts* · → *Pourquoi me le dire ?*
13. **Le fisc** — *appartement, 20 h (événement sombre).* Un recommandé : contrôle fiscal sur trois ans ; dans la liste des biens « non déclarés », une montre en or et une berline électrique. ← *J'appelle une avocate* · → *J'appelle Sauvan*
14. **Le local forcé** — *au-dessus du kiosque du quai, nuit (événement sombre).* Le petit local de l'association de Sacha : la porte forcée, les ordinateurs partis, les listes imprimées éparpillées dans l'escalier. ← *Je porte plainte* · → *Je ramasse les feuilles*
15. **Les deux listes** — *salon de l'hôtel de la Rive.* Ta liste des vingt-six, et celle que Sauvan a apportée, où le nom de Noa Vandel est barré au crayon : « Le capitaine est fatigué, dit le ministère. » ← *Ma liste, avec Noa* · → *Leur liste*
16. **Le Kambara** — *téléphone.* Lian Mbako : « Le Kambara portera le brassard noir au match d'ouverture. On vous joue au troisième match. Les Cobalts le porteront ? » ← *Oui* · → *Je ne sais pas*
17. **L'échafaudage** — *Dôme d'Al-Dorado, couloir vitré (hors ville).* Vingt degrés, la pelouse parfaite, la climatisation sur le banc. Par la baie vitrée, au loin, un échafaudage, et un homme qui tombe. Personne d'autre n'a vu. ← *Je le dis aux joueurs* · → *Je ne dis rien*
18. **Intermède : la porte de service** — *rêve.* Tu ouvres la porte de service du Dôme ; la chaleur est un mur. Sur le toit, un garçon en casque marche le long du bord sans tomber et te fait signe avec une baguette de pain. Un bouton : *Je lui fais signe*
19. **Le tunnel** — *Dôme, match d'ouverture.* L'hymne dans dix secondes ; Noa Vandel a le brassard dans la main. Sauvan, derrière toi : « S'il entre sur le terrain, la délégation repart demain. Vous aussi. » ← *Noa, mets-le* · → *Noa, donne-le-moi*
20. **La minute** — *stade de la Rive, 2031.* La minute de silence pour Gigi Vecchio ; l'arbitre en ajoute une. Dans la tribune, Marie-Jo, un brassard noir au bras. Les caméras te cherchent. ← *Je mets un brassard* · → *Je reste immobile*

**Les graines et ce qui les paie.** La question de la boulangère (1) est répétée par le pain de chaque matin (2) jusqu'à ce qu'on y réponde (19, 20). La montre (4) et la voiture (9) reviennent dans la lettre du fisc (13) : l'État reprend ce que l'émirat a donné quand tu commences à parler. Les initiales de Josiane au bas du procès-verbal (11) font d'elle un témoin qu'on ne peut pas faire taire : elle a quatre-vingt-onze ans et rien à perdre. La « fatigue » du capitaine (15) est la réponse du ministère au brassard (6). Le geste de Mbako (16) laisse aux Cobalts trois matchs pour décider.

**L'acte final.** Le tunnel du match d'ouverture (19), dans la chaîne Tournoi, sans respiration. Les fins se lisent en 2031, à la minute de silence (20).

### 6. Les soirs, les missions, les sponsors, les biens

**Les événements sombres** (huit) :

- **La veillée** — église Saint-Aubin (`rue`), soir de janvier 2029. Le cercueil plombé dans la nef froide, un cierge. Marie-Jo demande au gendarme de garde qu'on l'ouvre ; il répond que c'est interdit, « scellé sanitaire ». Elle te regarde, comme si tu pouvais quelque chose.
- **On vous rappelle** — appartement (`domicile`), 23 h, 2029. Scène 3 ; l'appel revient une fois par saison, chaque fois un peu plus court.
- **La montre** — appartement, 22 h, 2029. Scène 4.
- **La voiture du capitaine** — parking du centre de formation (`parking`), nuit, 2030. La voiture de Noa Vandel brûle ; sur le mur, à la bombe : TRAÎTRE. Personne ne sait si c'est contre le brassard ou pour lui.
- **Le fisc** — appartement, 20 h, 2030. Scène 13.
- **Le local forcé** — au-dessus du kiosque du quai (`rue`), nuit, 2030. Scène 14.
- **L'échafaudage** — Dôme d'Al-Dorado (hors ville), décembre 2030. Scène 17 : la seule violence du livre se voit derrière une vitre, à trois cents mètres, et dure une seconde.
- **La minute** — stade de la Rive (`stade`), 2031. Scène 20.

**Les missions** (trois) :

- **Le four de la boulangerie** — l'intrigue de ville existante (`boulangere`), réhabillée : Marie-Jo doit encore le four à la banque. Payer le four ne lui rend pas son fils ; elle te sert, ce jour-là, une baguette qu'elle ne fait pas payer, et le lendemain elle te la fait payer de nouveau. Pose `vl_four`.
- **Les cartons de la cave** — donneuse : Madame Josiane (`clubhouse`, la visite du mardi ; elle vit à deux rues), si `flag(listes_lues)`. Descendre ses cartons à la cave, remonter celui de 2010. C'est la scène 10, en mission.
- **La valise** — donneuse : Marie-Jo (`boulangerie_residentiel`, matin), si `flag(brassard)`. Emporter le brassard à Al-Dorado dans ta valise, parce que celle du capitaine sera fouillée. La douane de l'émirat confisque les « objets à caractère politique » : le metteur en scène tire la fouille. Réussir garde le brassard pour le tunnel ; échouer ouvre la garde à vue, à l'étranger.

**Les sponsors** :

- **Dorada** (louche) — la compagnie aérienne de l'émirat transporte gratuitement les Cobalts et offre ce qu'il faut : la montre en or (`cadeau_montre_or`), la berline électrique (`cadeau_electrique`), puis les clés d'un dernier étage avec terrasse chez Madame Tessandier (`cadeau_penthouse`), d'où l'on voit le stade, la mairie, et la fenêtre de ton ancien deux-pièces.
- **Gazéo** (gris) — la compagnie nationale du gaz, sponsor principal des Cobalts depuis le contrat de 2010 ; elle souhaite « un tournoi positif » et paie des primes qui arrivent toujours avant les matchs importants.

**Les biens et la saisie.** La sélectionneuse ne s'achète rien : on lui donne. **La saisie est le retournement de l'État** : le jour où elle commence à poser des questions (la cave, la rue Haute), le fisc requalifie les cadeaux de l'émirat en avantages non déclarés et les saisit (`saisie_luxe`, puis `saisie_vehicules`) ; l'appartement de la terrasse retourne dans la vitrine de Madame Tessandier (`saisie_logement`). Le même État qui a fait livrer la montre envoie l'huissier la reprendre.

### 7. Ce que dit la ville

- *Passante, sombre* — si `saison == 1` : « Le petit Marçais, dans un cercueil plombé. Sa mère n'a même pas pu le voir. On dit que là-bas, ils plombent tout. »
- *Marie-Jo Marçais, toi* — si `tranche == matin` : « Votre baguette. Vous y allez toujours, en décembre ? Je demande, c'est tout. Je demande tous les matins. »
- *Ancien, époque* — si `annee >= 2030` : « Un Mondial en décembre, sous un toit. En 1990, on jouait sous la neige à Aubérive, et on disait que c'était dur. »
- *Enfant, toi* — si `flag(brassard)` : « La maîtresse a dit qu'on pouvait faire des brassards noirs en arts plastiques. Le directeur a dit non. On en a fait quand même. »
- *Fan, club* — si `tribunes >= 70` : « On sera devant l'écran de la place du marché. Si le capitaine met le brassard, on se lève. Sinon, on reste assis. »
- *Gégé, sombre* — si `annee == 2030` : « Le virage ne regardera pas ce Mondial-là. On a soixante ans de matchs dans les jambes ; on peut en rater un. Celui-là, exprès. »
- *Madame Josiane, toi* — si `flag(pv_lu)` : « J'ai tapé ce procès-verbal avec deux doigts, à minuit. Je savais déjà. On sait toujours, quand on tape. »
- *Passant, rumeur* — si `possede(montre_or)` : « Une montre en or gravée "Dôme 2030" ? Le courtier de l'hôtel en avait trois dans sa vitrine. Ils en ont fait pour tout le monde. »
- *Karim Fauvel, club* — si `flag(syndicat_brassard)` : « Le syndicat soutient le brassard. Je l'ai dit au ministre. Il m'a demandé mon âge. »
- *Passant, quartier* — si `flag(local_force)` : « Ils ont forcé le petit local au-dessus du kiosque. Ils n'ont pas touché à la caisse. Que les ordinateurs. »
- *Ancien, sombre* — si `flag(fisc)` : « Un contrôle fiscal pour une montre qu'on vous a offerte ? Mon père disait : quand l'État te fait un cadeau, garde le reçu. »
- *Sacha, toi* — si `relation.sacha >= 1` : « Quatre cent douze, puis quatre cent trente. Je recompte chaque semaine. Toi, tu comptes les points. Ce n'est pas le même travail. »
- *Gigi Vecchio, toi* — si `annee == 2030` : « Ils jouent sous un toit, maintenant ? Moi, j'ai pris la pluie quarante ans. Rapporte-moi un peu de leur fraîcheur. »
- *Fan, sombre* — si `flag(brassard_porte)` : « Le capitaine a mis le brassard. Toute la place s'est levée, même le maire. Le maire s'est rassis le premier. »
- *Ancien, époque* — si `flag(vecchio_mort)` : « Une minute pour Gigi, et l'arbitre en a ajouté une. Il aurait dit que c'était trop. Il aurait compté quand même. »

### 8. Les fins

- **Le brassard** (`mondial_brassard`, la vérité) — Noa entre avec le brassard, tu ne le lui prends pas ; la page de 2010 part chez Léa. *« Au match d'ouverture, Noa Vandel est entré avec un brassard taillé dans une chemise de chantier, et {prenom} {nom} ne le lui a pas pris. Le soir même, Léa publiait l'heure d'un appel de 2010 ; la délégation a pris l'avion du retour, et l'on a ouvert le cercueil de Kévin Marçais. »*
- **Vingt degrés** (`mondial_vingt_degres`, le prix) — tu joues, tu te tais ; demi-finale. *« Les Cobalts sont allés jusqu'en demi-finale sous le Dôme, à vingt degrés, et {prenom} {nom} n'a rien dit d'autre que le score. En rentrant, on a changé de boulangerie. »*
- **Le dos** (`mondial_dos`, rare) — ta liste avec Noa, le brassard porté au dernier match, la page de 2010 entre les mains de Léa, Sacha à +1 : les Cobalts gagnent. *« Les Cobalts ont gagné le Mondial d'hiver, et sur la photo officielle, à côté du chef d'État, on ne voit de {prenom} {nom} que le dos. Le trophée est passé de main en main jusqu'au brassard noir ; la photo n'a jamais été encadrée. »*
- **Le ministère** (`mondial_ministre`, la fin *Le Ministre* de la bible) — tu acceptes, au retour, le portefeuille qu'on te propose. *« Au printemps suivant, on a confié à {prenom} {nom} le ministère des Sports, dans le bureau qu'avait occupé Madame Aubert. Le dossier de 2010 est resté dans le premier tiroir ; c'est l'usage. »*
- **La garde à vue** (`co_garde_a_vue`, ligne propre) — le brassard trouvé dans ta valise à l'aéroport d'Al-Dorado. *« Quarante-huit heures dans un bureau climatisé de l'aéroport, pour un morceau de chemise noire ; on t'a rendu ton passeport, pas le brassard. »*
- **L'ambassade** (`sl_ambassadeur`, ligne propre) — *« Trop populaire pour rester : une ambassade aux îles Basses, loin des boulangeries. »*
- **Minuit et une** (`sl_minuit`, ligne propre) — *« La Fédération a appelé à minuit et une, comme toujours ; c'est Bréhaut qui a lu la lettre, lui-même. »*

### 9. La question de saison et les objectifs

**Le fil rouge** (nouveau : `pays / ministere / ouvriers`) : *Pour qui joues-tu : pour le pays, pour le ministère, ou pour ceux qui ont construit le stade ?* **Les objectifs** : 2029, la qualification ; 2030, le Mondial ; 2031, ce qui reste. **Les objectifs cachés** : `mondial_liste_a_moi` (les vingt-six sans une rature du ministère ; « Le capitaine n'est pas fatigué. »), `mondial_brassard_porte` (« Un morceau de chemise pèse plus lourd qu'un trophée. »), `mondial_pain` (revenir à la boulangerie après le Mondial et repartir avec une baguette ; « Elle demande tous les matins. »).

### 10. Le volume, et ce que le livre laisse au monde

**À produire** : le rôle de sélectionneur est partagé avec *Chambre 12*. Pour ce livre : prologue, 6 cartes ; script, 12 ancres ; 8 intrigues propres (*Le cercueil*, *Le pain*, *Le brassard*, *Les cadeaux*, *La cave*, *La rue Haute*, *Les deux listes*, *Le Kambara* : 35 cartes) ; la chaîne Tournoi hors ville, habillée pour Al-Dorado (12 scènes, dont 6 neuves) ; 8 événements sombres (15 cartes) ; 3 intermèdes ; 22 cartes de décor ; 12 réactions ; 8 cartes Liste. Soit **environ 130 cartes neuves pour 160 à 180 vécues**. 4 fins neuves et 3 lignes ; 14 manchettes (« VINGT DEGRÉS DEDANS », « 23 H 40 », « LE BRASSARD », « UNE MINUTE, ET UNE DE PLUS ») ; 45 répliques ; 3 missions ; 2 sponsors.

**Ce que le livre laisse au monde** : Kévin Marçais, électricien d'Aubérive, est mort sur le chantier du Dôme d'Al-Dorado en 2028 ; il est enterré au cimetière d'Aubérive, et sa mère tient la boulangerie de la rue des Lilas. Un brassard noir a été taillé dans sa chemise de travail. En 2031, au stade de la Rive, l'arbitre a ajouté une minute à la minute de silence pour Gigi Vecchio. Madame Josiane gardait dans sa cave la copie d'un procès-verbal de décembre 2010.

---

## Histoire 10 — Les Deux Téléphones

### 1. La fiche

**Rôle** : président (`president`) — héroïne par défaut, la présidente · **Postulat** : `escalier_ferme` (nouveau), année 2037, Division 2 ; jauges proposées : vestiaire 50, tribunes 75, direction 45 (l'assemblée des socios), caisse 30 ; drapeaux `escalier_ferme`, `socios` · **Club** : le Racing Aubérive, racheté par ses socios en 2034, en deuxième division ; à la fin de la saison 2039-2040, la loi des franchises gèle la première division pour toujours · **Patron du moteur** : Gégé (`gege`), socio numéro 1, quatre-vingt-quatorze ans, dont la voix passe par son neveu Nino, le capo · **Saisons** : 2037-2038, 2038-2039, 2039-2040.

> **Quatrième de couverture**
>
> En 2040, la loi des franchises fermera l'escalier : plus personne ne montera jamais en première division. Le Racing est en deuxième. Les socios t'ont élue présidente sur une seule promesse : monter avant que la porte se ferme.
>
> Tu as deux téléphones. Celui de ton bureau est pour la ville. L'autre, un vieux portable à clapet dans la poche intérieure de ta veste, est pour ceux qui ont payé ta campagne — et qui ont besoin que le Racing reste en bas.
>
> Sur l'escalier nord de la tribune, un maçon mure une marche par mois, « par sécurité ». Gégé a quatre-vingt-quatorze ans et voudrait voir la première division une fois avant de mourir. L'homme qui a écrit la loi est un enfant de cette ville.
>
> Un soir, au local du virage, tu entends sonner un second clapet. Ce n'est pas le tien.

### 2. Le genre et la touche

**Le double jeu.** Une présidente qui joue pour la ville en public et pour le consortium en secret, et qui découvre qu'on a acheté aussi l'autre tête du club : quoi que décident les socios, quelqu'un a déjà été payé pour que ce soit la même chose. Le livre ferme la boucle du monde : il commence par une élection dans la buvette du kop et finit par une assemblée dans la même buvette, devant deux téléphones posés sur la table.

**La touche : les deux téléphones.** Les cartes de ce livre sont marquées par le téléphone qui sonne : le fixe du bureau (la ville, la Fédération, L'Écho) ou le clapet (une sonnerie de 1995, et une voix de femme qui se présente sous le nom du mois : « Ici Madame Septembre », puis Octobre, puis Novembre — l'humour à froid du livre). L'escalier nord qu'on mure une marche par mois est l'horloge visible, en ville et au stade. En appoint : les haut-parleurs du stade qui commentent les matchs avec la voix générée de Gigi Vecchio, mort en 2031 ; les trois mille masques de Gégé, au match d'après sa mort, qui répondent aux trois mille masques de 1990 ; l'intermède de l'escalier, où chaque marche se mure derrière toi, et Gégé qui frappe de l'autre côté du mur.

### 3. Le personnage joué

Cinquante-huit ans, ancienne milieu de la section féminine du Racing (2008-2016), puis patronne d'une entreprise de logistique installée dans les entrepôts de l'ancienne Tréfilerie. Socio numéro 212, élue présidente en 2037. **Ce qu'elle veut** : être celle qui a fait monter le Racing la dernière fois qu'on le pouvait ; sauver son entreprise. **Ce qu'elle cache** : le « pacte de la Rive » signé avant l'élection avec Rive Capital, le paravent du consortium des franchises — sa campagne payée, les dettes de son entreprise effacées, un siège au conseil de la future Ligue des franchises ; en échange, si le Racing est toujours en deuxième division en 2040, le consortium rachète son nom et son centre de formation pour une franchise de la capitale, et le stade se vide.

### 4. La distribution

- **Gégé** (`gege`) — quatre-vingt-quatorze ans, socio numéro 1, la bâche de son père pliée au pied de son lit, au-dessus du local. Il veut voir la première division une fois. Il entend tout, et il a entendu les deux clapets. Il meurt en février 2040 et laisse une lettre.
- **Lian Mbako** (`mbako`) — soixante-trois ans, président de la Fédération depuis 2036. Il a écrit la loi des franchises avec la Ligue : sans elle, huit clubs de première division déposent le bilan ; avec elle, plus aucun gamin ne monte. Il a eu la Fédération en échange. Il était le gamin de 1990 qui voulait jouer tout de suite.
- **Cheikh Ilyas** (`nassir`) — quatre-vingt-un ans, président de la Ligue, qui a fait écrire que la Ligue n'a pas de limite d'âge. Le patriarche du consortium. « Ce n'est pas un club, c'est une place. »
- **Madame Josiane** (`josiane`) — cent ans, à la maison de retraite derrière l'église Saint-Aubin. Elle a gardé la photo de 1974, celle de l'escalier du club-house, et le clou est toujours au mur.
- **Léa** (`lea`) — soixante-douze ans, retraitée ; elle écrit chaque semaine la lettre de lecteur de L'Écho, le dernier journal papier du pays, qui ne paraît plus que le dimanche. Elle a gardé un dictaphone de 1995.
- **Nadia Rouvier** (`rouvier`) — soixante-dix-sept ans, toujours à son cabinet : « Respire. Encore. » Elle sait reconnaître quelqu'un qui a deux téléphones.
- **La voix de Gigi Vecchio** — générée par la chaîne qui diffuse la deuxième division ; elle commente les matchs du Racing et dit « magnifique », un mot que Gigi n'a jamais prononcé.

**Les visages nouveaux**

- **Nino**, 53 ans — le neveu de Gégé, capo depuis 2020, chef des socios. Le consortium le paie aussi, par un second clapet : c'est lui qui fera voter l'accord de franchise si le Racing échoue. Il aime son oncle et il a des dettes. C'est le second coupable, et le livre lui laisse la scène de sa propre trahison.
- **Madame Septembre** (puis Octobre, Novembre…) — la voix du clapet, une femme calme qui change de nom chaque mois. Elle tient les deux téléphones, le tien et celui de Nino.
- **Ahmed Tazi**, 60 ans — le maçon qui mure l'escalier nord, une marche par mois. « Je mure, je ne décide pas. » On lui demandera de murer la dernière la nuit d'avant le dernier match.
- **Clémence Tessandier**, 34 ans — la petite-fille de l'agence. Elle a repeint la vieille maquette des Terrasses : « troisième tranche, 2041 ».

### 5. La structure

**Saison 1 (2037-2038) — Le clapet.** L'élection à la buvette, la promesse à Gégé. Le premier appel du clapet : Madame Septembre. La première marche murée. La maquette repeinte dans la vitrine. La voix de Gigi dans les haut-parleurs. La visite de Mbako sous la photo de 1974 (si elle a été raccrochée) ou sous le clou. La première commande : vendre le meilleur jeune à la capitale. La saison finit sur le classement : assez haut pour y croire.

**Saison 2 (2038-2039) — La seconde sonnerie.** La photo de toi au bar de l'hôtel de la Rive avec une femme en manteau d'automne. Au local, la sonnerie de 1995 dans la veste de Nino. La loi votée, applicable à la fin de la saison suivante. L'hélicoptère blanc posé sur la pelouse, cadeau de Rive Capital, puis saisi sur la même pelouse, devant le virage : le consortium t'a fait payer ta première désobéissance. La saison finit au zinc de la buvette, Nino et toi, deux clapets sur le comptoir.

**Saison 3 (2039-2040) — La dernière marche.** Février : Gégé, dans son lit, qui sait tout, et sa lettre. Le match d'après : trois mille visages de Gégé dans la Nord. Madame Mai et la dernière consigne. La dernière marche, la nuit d'avant. L'acte final tient en deux jours : le dernier match de l'histoire où l'on peut monter, et l'assemblée des socios du lendemain, où Nino lit l'accord de franchise.

**Les vingt scènes clés**

1. **L'élection** — *buvette du kop, prologue.* La buvette pleine, les cartes de socio levées ; Nino lit le résultat. Gégé, au premier rang, te fait signe d'approcher : « Monte-nous avant qu'ils ferment, et je meurs content. » ← *Je vous le promets* · → *Je promets d'essayer*
2. **Madame Septembre** — *bureau du président, nuit, prologue.* Dans ta veste, le clapet sonne : une sonnerie de 1995. « Ici Madame Septembre. Félicitations. Nous parlerons des objectifs. » ← *Je n'ai pas d'objectifs* · → *Je vous écoute*
3. **La première marche** — *escalier nord du stade.* Un maçon mure la première marche, sans se presser : « Par sécurité, présidente. Une par mois. Je mure, je ne décide pas. » ← *Arrêtez ce chantier* · → *Combien de marches ?*
4. **La troisième tranche** — *vitrine Tessandier.* La vieille maquette jaunie des Terrasses a été repeinte : « troisième tranche, 2041 ». À la place du stade, un parc, et une plaque : Racing Capitale, centre de formation. ← *J'entre* · → *Je passe*
5. **La voix de Gigi** — *loge, jour de match.* Les haut-parleurs commentent avec la voix de Gigi Vecchio, mort en 2031. Gégé, à côté de toi : « Il n'a jamais parlé autant de sa vie. Et il ne disait pas "magnifique". » ← *Coupez cette voix* · → *Laissez-le parler*
6. **Le président de la Fédération** — *ton bureau.* Mbako s'assoit sous le clou où pendait la photo de 1974 — ou sous la photo, si tu l'as raccrochée : « Sans la loi, huit clubs déposent le bilan. Je sauve ce qu'on peut sauver. Tu étais où, toi, en 1990 ? » ← *Je jouais au foot* · → *Je vous écoutais*
7. **La première commande** — *clapet, nuit.* « Le petit Brac ira à la capitale cet hiver. Ce sera bien pour lui. Ce sera bien pour vous. » Puis la tonalité. ← *Il reste* · → *Il partira*
8. **La photo** — *appartement, 3 h (événement sombre).* Une photo circule depuis trois heures : toi, au bar de l'hôtel de la Rive, en face d'une femme en manteau d'automne. Dessous : « La présidente boit avec qui ? » ← *Je dis la vérité* · → *Je dis : une amie*
9. **La seconde sonnerie** — *local du kop, soir (événement sombre).* Pendant que Nino parle aux socios, une sonnerie de 1995 sort de sa veste pendue à la patère. La même que la tienne. Gégé, près du poêle, te regarde. ← *Je décroche* · → *Je laisse sonner*
10. **La lettre du dimanche** — *kiosque du quai.* Léa, soixante-douze ans, attend son Écho : « La loi est votée, il reste dix-huit mois. J'écris la lettre de lecteur. Je la signe de mon nom, ou de celui du virage ? » ← *De votre nom* · → *Du virage*
11. **L'hélicoptère** — *pelouse du stade, mardi matin.* Un hélicoptère blanc se pose au rond central ; le pilote te tend une carte : « Avec les compliments de Rive Capital. Il se pose sur un terrain de football. Le vôtre, par exemple. » ← *Renvoyez-le* · → *Je le garde*
12. **Intermède : l'escalier** — *rêve.* Tu montes l'escalier nord dans le noir ; à chaque marche, derrière toi, un bruit de truelle. En haut, tu te retournes : il n'y a plus que le mur, et de l'autre côté, Gégé qui frappe. Un bouton : *Je frappe aussi*
13. **Les pales** — *pelouse, entraînement ouvert du soir (la saisie).* Deux huissiers devant la Nord qui arrive : l'hélicoptère est saisi, la « donation » était un prêt. Le virage regarde les pales s'arrêter. ← *Je parle au virage* · → *Je rentre au club-house*
14. **Le neveu** — *buvette, nuit.* Nino seul au zinc, la veste sur l'épaule, son clapet posé à côté du tien : « Deux téléphones, une seule défaite. Ils nous paient pour la même chose, présidente. » ← *On les trahit ensemble* · → *Chacun pour soi*
15. **La lettre de Gégé** — *chambre de Gégé, au-dessus du local, février 2040.* Dans son lit, la bâche de 1971 sur les pieds : « Je sais pour les deux téléphones. Le tien, et celui du petit. Monte quand même. » ← *Je monterai* · → *Je ne sais plus*
16. **Trois mille visages** — *stade, le match d'après.* La Nord se lève : trois mille visages de Gégé en carton, imprimés dans la nuit. La voix de Gigi dit son nom, puis se tait une minute entière. ← *Je me lève avec eux* · → *Je reste à ma place*
17. **Madame Mai** — *clapet, nuit.* « Le dernier match, vous le perdez. Le lendemain, l'assemblée vote l'accord ; Nino s'en occupe. Nous comptons sur vous deux. » ← *Vous aurez votre défaite* · → *Je raccroche*
18. **La dernière marche** — *escalier nord, la veille.* Il ne reste qu'une marche. Le maçon pose sa truelle : « On m'a demandé de la murer cette nuit, pendant que tout le monde dort. Je la mure, présidente ? » ← *Laissez-la ouverte* · → *Murez-la*
19. **La mi-temps** — *vestiaire, le dernier match.* Un partout ; il faut gagner pour monter. Le clapet vibre dans ta poche. Les joueurs te regardent ; ils ne savent rien. ← *On gagne ce match* · → *Je remonte en loge*
20. **L'assemblée** — *buvette du kop, le lendemain (acte final).* La buvette pleine, les masques de Gégé encore noués aux écharpes. Nino au micro lit l'accord de franchise. Les deux clapets sont sur la table, devant toi. ← *Je montre les clapets* · → *Je laisse voter*

**Les graines et ce qui les paie.** La promesse faite à Gégé (1) revient dans sa lettre (15). Madame Septembre (2) change de nom chaque mois jusqu'à Madame Mai (17) : le joueur compte les mois avec elle. Les marches murées (3) comptent les saisons et la dernière (18) est un choix. La maquette repeinte (4) dit ce que le consortium fera du terrain ; l'acte de 1931 (venu de *La Maquette*, si la photo de 1974 et les archives de Josiane ont été rouvertes) dit qu'il ne le peut pas. La sonnerie de 1995 (2) est reconnue au local (9). Les masques de Gégé (16) répondent à ceux de 1990, que les plus vieux n'arrivent plus à nommer.

**L'acte final.** Deux jours : le dernier match (19), dont le résultat vient du moteur, et l'assemblée (20). La fin rare exige la montée, la dernière marche laissée ouverte, et Nino retourné au zinc (14).

### 6. Les soirs, les missions, les sponsors, les biens

**Les événements sombres** (huit) :

- **Le ciment frais** — escalier nord (`stade`), nuit, saison 1 : dans le ciment de la marche murée du jour, quelqu'un a écrit au doigt « 2040 ». Le maçon refait la marche ; le chiffre revient le mois suivant.
- **La photo** — appartement (`domicile`), 3 h, saison 2. Scène 8.
- **La seconde sonnerie** — local du kop (`stade`), soir, saison 2. Scène 9.
- **Devant chez toi** — sous ta fenêtre (`domicile`), minuit, saison 2 : l'événement existant, à l'ère des socios. Une dizaine de cartes de socio levées sous le réverbère, la photo de l'hôtel imprimée et scotchée sur ta boîte aux lettres. Ils ne crient pas ; ils attendent que tu descendes voter avec eux.
- **La vitrine** — agence Tessandier (`rue`), nuit, saison 2 : la vitrine étoilée d'un coup de pavé ; dans le parc en mousse de la maquette, un masque de 1990 jauni, posé à plat.
- **Les pales** — pelouse (`stade`), soir, fin de saison 2. Scène 13 ; la saisie.
- **La nuit de Gégé** — sa chambre au-dessus du local (`stade`), nuit de février 2040. Nino appelle à deux heures ; il ne dit que l'heure, et qu'il faut imprimer.
- **La dernière marche** — escalier nord, la veille du dernier match. Scène 18.

**Les missions** (trois) :

- **Le dictaphone** — donneuse : Léa (`kiosque`, matin), si `flag(second_clapet)`. Un clapet n'enregistre rien ; son dictaphone de 1995, si. Il faut tenir l'appareil contre le combiné, la nuit, pendant que la voix du mois parle. Pose `vl_enregistrements` : la preuve de la fin de la vérité.
- **La photo de 1974** — donneuse : Madame Josiane (maison de retraite, derrière l'église, `eglise`, matin). Elle te confie la photo de la finale de 1974, qu'elle garde depuis les années 1990 : « Le clou est toujours au mur de l'escalier. Raccrochez-la. » Raccrochée, elle est au-dessus de Mbako quand il vient (scène 6) ; Gégé le sait. Pose `vl_photo_1974`.
- **La truelle** — donneur : Ahmed Tazi (`stade`, soir), si `flag(marche_muree)`. Payer le maçon pour qu'il « oublie » la dernière marche. Payé avec ton argent, c'est un pourboire ; payé avec celui de Rive Capital, c'est la porte de la garde à vue.

**Les sponsors** :

- **Rive Capital** (louche) — le paravent du consortium : il finance le centre de formation, a financé ta campagne, et fait poser un hélicoptère sur la pelouse (`cadeau_helico`). Tout ce qu'il donne se reprend.
- **Les Terrasses, troisième tranche** (gris) — Clémence Tessandier propose de floquer le nom de la résidence sur le maillot : « Ma grand-mère vous l'avait déjà proposé, je crois. À un autre président. »

**Les biens et la saisie.** Une présidente de 2037 a une **villa sur les hauteurs**, une **voiture sans volant** qui sait où elle va (et le dit au consortium), et elle peut acheter au tabac du carrefour l'**oreillette qui répond seule**, avec sa voix, pendant qu'elle est sur l'autre téléphone : la double vie, automatisée. **La saisie est le tournant de la saison 2** : l'hélicoptère de Rive Capital, saisi sur la pelouse devant le virage (`saisie_vehicules`), pales repliées sur un camion, filmé par tout le monde. Dans la fin du pire, la villa des hauteurs brûle une nuit, et c'est toute la ville qui la regarde.

### 7. Ce que dit la ville

- *Ancien, époque* — si `saison == 1` : « La dernière montée possible de l'histoire, et c'est à nous de la faire. On n'a jamais rien fait à temps, ici. »
- *Fan, club* — si `tribunes >= 75` : « Socio numéro trois mille quatre. J'ai voté pour vous. Mon grand-père était au virage en 1974. Montez-nous, c'est tout. »
- *Enfant, quartier* — si `flag(marche_muree)` : « Le monsieur mure une marche de l'escalier tous les mois. On compte avec ma sœur. Il en reste onze. Après, on passe par où ? »
- *Passant, rumeur* — si `flag(maquette_trois)` : « La maquette de chez Tessandier, ils l'ont repeinte. Ma mère dit qu'elle était déjà dans la vitrine quand elle était petite. »
- *Ancien, sombre* — si `flag(voix_gigi)` : « La voix de Gigi au micro, ça me fait pleurer et ça me fait peur. Il dit des choses qu'il n'aurait jamais dites. Il dit "magnifique". »
- *Le buraliste du Quai, argent* — si `possede(helico)` : « Un hélicoptère sur la pelouse ? Au Quai, on parie sur le temps qu'il va rester. Les socios disent Noël. »
- *Passante, sombre* — si `flag(photo_hotel)` : « Au bar de l'hôtel avec une dame en manteau, à minuit ? Ma fille dit que c'est une agente. À cette heure-là, on n'a pas d'agente. »
- *Gégé, toi* — si `relation.gege >= 2` : « J'ai vu la Nord se lever pour dix présidents. Elle se lèvera pour toi si tu montes. Sinon, elle se lèvera quand même, pour partir. »
- *Fan, club* — si `flag(second_clapet)` : « Nino a parlé une heure de l'accord de franchise, ce soir, au local. Avant, il ne parlait que des tambours. »
- *Madame Josiane, toi* — si `mission(photo_1974)` : « Le clou était toujours là. Je l'avais dit à tout le monde, en 1991. Merci d'avoir écouté une vieille dame ; il était temps, j'ai cent ans. »
- *Le vendeur du garage du Pont, achat* — si `flag(helico_saisi)` : « Votre hélicoptère est parti sur un camion, les pales repliées comme un oiseau mort. Mon fils a filmé. Tout le monde a filmé. »
- *Nadia Rouvier, toi* — si `annee >= 2039` : « Respire. Encore. Je fais ça à tout le monde depuis 1990. Toi, tu respires comme quelqu'un qui a deux téléphones. »
- *Fan, sombre* — si `flag(gege_mort)` : « Trois mille visages de Gégé, imprimés dans la nuit. Mon père dit qu'en 1990 on avait fait pareil pour quelqu'un. Il ne se rappelle plus pour qui. »
- *Ancien, époque* — si `annee >= 2040` : « L'escalier est fermé. Mon petit-fils demande ce que c'était, monter. Je lui ai dit : un dimanche soir dans la rue, et personne ne dormait. »
- *Léa, toi* — si `flag(clapets_montres)` : « Deux clapets sur une table d'assemblée. J'ai écrit soixante ans pour voir une chose pareille. Je la raconterai dimanche. »

### 8. Les fins

- **Les deux clapets** (`escalier_clapets`, la vérité) — à l'assemblée, tu poses les deux téléphones et le dictaphone de Léa ; l'accord n'est pas voté ; tu démissionnes ; l'enquête commence chez Rive Capital. *« À l'assemblée des socios, {prenom} {nom} a posé sur la table deux portables à clapet, le sien et celui du capo, et l'accord de franchise n'a pas été voté. L'escalier a fermé quand même ; le Racing, lui, est resté au bord de la Rive, sous son nom. »*
- **La franchise** (`escalier_franchise`, le prix) — le dernier match perdu, l'accord voté, le nom vendu, le siège obtenu. *« Le Racing a perdu son dernier match d'un but, et l'assemblée a vendu son nom le lendemain ; {prenom} {nom} siège depuis au conseil de la Ligue des franchises. Dans la vitrine de l'agence, la troisième tranche n'a jamais été aussi verte. »*
- **La dernière montée** (`escalier_montee`, rare) — le match gagné, la dernière marche laissée ouverte, Nino retourné, la photo de 1974 raccrochée, Gégé à +2 avant sa mort. *« Le Racing est monté en première division le dernier soir où l'on pouvait encore monter, et trois mille visages de Gégé ont envahi la pelouse. Le consortium a pris à {prenom} {nom} tout ce qui était à son nom ; l'escalier nord a gardé sa dernière marche. »*
- **Le mur** (`escalier_mur`, pire) — la dernière marche murée, le match perdu exprès, la lettre de Gégé lue par Nino pour se sauver. *« Le soir de la dernière journée, l'escalier nord a été muré jusqu'en haut, et le lendemain les socios ont lu une lettre de Gégé qui parlait de deux téléphones. On a vu brûler la villa des hauteurs depuis toute la ville ; {prenom} {nom} n'était déjà plus à Aubérive. »*
- **La garde à vue** (`co_garde_a_vue`, ligne propre) — l'argent de Rive Capital remonté par la brigade, ou la truelle payée avec. *« Quarante-huit heures pendant que l'escalier fermait ; dans la cellule, on t'a laissé un seul téléphone, celui du mur. »*
- **Le pantin** (`pr_pantin`, ligne propre) — *« Deux téléphones et pas de voix : la carte de la Ligue des franchises était signée avant que le club soit vendu. »*
- **Le siège du siège** (`pr_siege`, ligne propre) — *« Les socios ont occupé le club-house la nuit de la photo ; ils ont rendu les clés au suivant. »*

### 9. La question de saison et les objectifs

**Le fil rouge** (nouveau : `ville / socios / consortium`) : *Pour qui montes-tu : pour la ville, pour les socios, ou pour ceux qui ont payé ta campagne ?* **Les objectifs** : saison 1, le haut du classement ; saison 2, la course, et les deux téléphones ; saison 3, la dernière montée. **Les objectifs cachés** : `escalier_une_marche` (la dernière marche laissée ouverte ; « Je mure, je ne décide pas. »), `escalier_photo` (la photo de 1974 raccrochée au clou de l'escalier ; « Le clou est toujours là. »), `escalier_sans_clapet` (une saison entière sans décrocher le clapet ; « Une sonnerie de 1995, ça se laisse sonner. »).

### 10. Le volume, et ce que le livre laisse au monde

**À produire** : le rôle de président est partagé avec *La Maquette*. Pour ce livre : prologue, 6 cartes ; script, 12 ancres ; 8 intrigues propres (*Le clapet*, *L'escalier*, *La maquette repeinte*, *Le second clapet*, *L'hélicoptère*, *Mbako*, *La lettre de Gégé*, *L'assemblée* : 35 cartes) ; 8 événements sombres (16 cartes) ; 3 intermèdes et une vingtaine de lignes de la voix de Gigi au stade ; 24 cartes de décor ; 12 réactions ; les intrigues de président de la bible au réservoir (le derby en loge, les droits, l'entraîneur qu'on vire), habillées pour 2037. Soit **environ 130 cartes neuves pour 170 à 190 vécues**. 4 fins neuves et 3 lignes ; 14 manchettes (« L'ESCALIER EST FERMÉ », « DEUX TÉLÉPHONES », « TROIS MILLE VISAGES DE GÉGÉ », « LA DERNIÈRE MONTÉE ») ; 45 répliques ; 3 missions ; 2 sponsors.

**Ce que le livre laisse au monde** : en 2040, la loi des franchises a fermé la première division. Gégé est mort en février 2040 ; au match suivant, la Nord a porté trois mille masques de son visage. L'escalier nord du stade de la Rive a été muré marche par marche entre 2037 et 2040.

---

