# FUSIBLE — Les dix histoires

*La bible du livre : dix romans noirs, une ville, soixante ans de football.*

> Aubérive tient en deux cents mètres de côté. Une rivière, un pont de pierre, un stade au bord de l'eau, une usine qui ferme, une laverie dont le néon clignote, un club privé sans poignée à la porte, un cimetière où le Racing a son caveau. Dix personnes y entrent, à dix époques, par dix portes : un entraîneur, deux joueurs, une directrice sportive, deux présidents, deux sélectionneurs. Aucune n'en sort comme elle y est entrée.

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
- **L'intermède.** Une carte à part, au plus une par saison, signalée à l'écran (fond plus sombre, texte en italique, aucun locuteur, aucune jauge qui bouge ou presque) : un rêve, un demi-sommeil, une nuit qu'on ne se rappelle pas. L'intermède ne ment jamais sur les faits : il les déforme, et le joueur attentif y trouve un indice vrai.
- **L'humour à froid.** Une phrase banale dite au mauvais moment par quelqu'un qui ne mesure pas l'horreur, ou qui la mesure trop bien : l'assureur qui dit « sans corps, c'est un départ en vacances », le fonctionnaire qui dit « il n'y a pas eu de morts, il y a eu des retours anticipés ». Une par séquence au plus. Jamais une blague, jamais un clin d'œil : une phrase qui glace.

### 1.3 Ce qu'on ne montre jamais

Le coup qui porte, le corps abîmé, la seringue qui entre, le comprimé qu'on avale, l'acte sexuel, la méthode d'un suicide, la torture, un enfant en danger au-delà de la menace dite. Le livre montre l'avant (la boîte sans étiquette posée sur le banc, la porte sans poignée, la voiture qui démarre) et l'après (le gobelet renversé, la lumière restée allumée, le banc vide au vestiaire, la Une du lendemain). Le racisme des tribunes est montré par ses conséquences et par la voix de ceux qu'il vise, qui gardent leur dignité et leur réplique ; il n'est jamais un ressort, jamais un effet de style. Aucun nom réel, nulle part : ni club, ni joueur, ni dirigeant, ni marque, ni compétition, ni commune (Villefranche, Beaulieu, Fontaine, Valmont, Néville, Terrenoire, Corbelin sont interdits ; on dit « le Mondial », jamais le nom réel de la compétition).

### 1.4 La violence, la drogue, le sexe, la police

**La violence** obéit à la règle de la carte unique (§ 1.2) et à la cadence de la charte : jamais deux chocs sur deux cartes consécutives ; après un choc, une ou deux scènes calmes qui en montrent le prix. Les événements sombres tombent le soir, à leur lieu, deux par saison au plus, jamais à moins de cinq créneaux d'écart.

**La drogue et le dopage** sont une boîte sans étiquette, un flacon B, « quelque chose pour dormir », « quelque chose pour le genou ». On ne nomme jamais une molécule ni une dose ; on montre ce que ça coûte : un contrôle jeudi, un joueur qui tombe sous la douche, un genou qui tient un match et lâche au suivant, une mère qui trouve la boîte dans le sac de sport. Quand le joueur y touche, la ville le sait (une réplique de passant change) et la police peut le savoir (mission, saisie, garde à vue).

**Le sexe** n'existe qu'en creux. Le Rideau Rouge est un lieu de rendez-vous, de pouvoir et d'argent : une porte sans poignée, du velours, un homme en costume derrière, une ardoise. Ce qui s'y passe se lit dans ce que les gens en rapportent (une photo, une dette, un silence), jamais dans une scène.

**La police** est le dernier mur. Le pont entre une carte et la ville (`var:`) porte l'argent propre (`ville_francs`), l'argent sale (`ville_francs_sales`, qui rend saisissable en premier tout ce qu'on achète ensuite), l'amende (`ville_amende`), le cadeau (`cadeau_<objet>`) et la saisie (`saisie_vehicules`, `saisie_logement`, `saisie_luxe`, `saisie_tout`). Chaque histoire a **sa saisie** : un moment où ce qu'on a acheté ou reçu est repris devant témoins, et ce moment est un tournant du récit, pas une sanction comptable. La fin commune `co_garde_a_vue` existe ; chaque histoire lui donne une ou deux lignes `epitaph_plus` à elle.

### 1.5 Le temps

Les dix histoires s'étalent de 1990 à 2040. L'époque se tient au détail près (charte R9) : 1990-1997, le fax, le bip, la cabine, le Minitel, le répondeur à microcassette, la cassette vidéo, les francs, la télé régionale ; le portable et le SMS vers 1998-2000, le courriel et l'internet des familles après 1997 ; les écus en 2002 ; le Flux (le réseau social du monde) en 2007-2008, le téléphone qui photographie et filme en 2008 ; la vidéo d'arbitrage en 2016 ; la diffusion en flux en 2024 ; le calendrier à soixante-douze matchs (2023) et la grève mondiale des joueurs (2026) ; l'arbitre-machine en essai (2027) ; le Mondial d'hiver d'Al-Dorado (décembre 2030) ; le commentaire dit par la voix générée d'un ancien joueur (années 2030) ; la loi des franchises qui ferme l'escalier de la première division (2040). Toute carte qui cite un objet daté porte sa condition d'année.

### 1.6 La joueuse

Le personnage joué peut être une femme, dans les dix histoires. Les textes de la ville n'accordent jamais au masculin le personnage joué ; les cartes du moteur utilisent `{pg, select, f{e} other{}}` ou une tournure neutre. Trois histoires ont une héroïne par défaut (le livre la dit « elle » dans sa quatrième de couverture) : la directrice sportive de *23 h 58*, la sélectionneuse de *Vingt degrés dedans*, la présidente des *Deux téléphones*. Les sept autres sont écrites au neutre. Le monde réagit au genre quand l'époque le ferait — un dirigeant de 2003 qui dit « mademoiselle » à une directrice sportive de quarante-deux ans — et jamais pour faire rire.

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

- **Le cadavre.** Tibo Rancé, le gamin de dix-sept ans que la directrice sportive de *23 h 58* est sommée de vendre en 2003, est retrouvé mort chambre 12 en 2011 (*Chambre 12*). Joachim Ferlac, le stagiaire qui tape les fax de 23 h 58, est retrouvé mort dans sa voiture en 2023, et sa voix parle encore dans l'oreillette de 2024 (*L'Oreillette*). Jean-Marie Vaubourg meurt à son bureau en 2026, à l'heure que le modèle avait donnée. La berline de l'entraîneur disparu de 1990 sort de la Rive en 1999, vide, le sapin en carton encore au rétroviseur (*La Maquette*).
- **Le témoin.** Sandrine Lavergne, la fille à la mobylette de la nuit de 1984 (*La Route de la Rive*), est en 2011 la réceptionniste de nuit de l'hôtel de la Rive : elle a vu le tableau des clés à 2 h 10 (*Chambre 12*). Didier Vallin, le gamin dont le nom est sous ton sparadrap en 1990 (*La Sirène*), vit à la friche ; en 1999, il a vu qui a mis le feu à la tribune Est (*La Maquette*). Josiane photocopie chaque fax avant qu'il ne blanchisse (2003) ; en 2024, elle sort les photocopies d'un carton ; en 2030, elle a gardé dans sa cave la copie d'un procès-verbal de 2010.
- **Le juge.** Judith Amsel, la procureure, ouvre la berline repêchée en 1999 et instruit le dossier du Conseil ; en 2011, c'est elle qui fait sceller la chambre 12. Madame Aubert, maire en 1990, députée en 1999, ministre en 2010, juge tout le monde avec la même phrase — et en 2030, c'est elle qu'on juge.
- **La colonne vertébrale.** Lian Mbako a seize ans en 1990 : il est assis à ta place dans *La Route de la Rive*, il est le gamin d'après dans *La Sirène*. En 2011, il est le capitaine mutin qui a trouvé le corps de la chambre 12. En 2030, il sélectionne le Kambara contre les Cobalts. En 2038, président de la Fédération, il a écrit la loi qui ferme l'escalier. Le livre commence avec un garçon qui veut jouer tout de suite et finit avec l'homme qui ferme la porte aux garçons.
- **Les objets.** Les trois mille masques en carton de 1990 reviennent en 2040 : le virage porte le visage de Gégé pour son dernier match. La maquette des Terrasses de la Rive reste dans la vitrine de Madame Tessandier de 1999 à 2040, jaunit, et revient dans le plan du consortium. La photo de 1974 descend l'escalier du club-house dans *Trois mille visages* et remonte dans *Les Deux Téléphones*.

### 1.9 La forme d'une histoire d'une heure

Une heure de jeu, c'est cent cinquante à deux cents cartes vécues, soit trois saisons. Chaque histoire en tient trois au moins, et **arrive quelque part** : un acte final, une révélation, plusieurs fins méritées. La forme :

- **Le prologue** (saison 1, six cartes hors créneau, sans drame) pose le lieu, la blessure, la graine principale et le mécanisme.
- **Saison 1 — l'exposition qui mord.** Le script (ancres aux créneaux 1, 10-11, 16, 17), trois intrigues du réservoir, un ou deux événements sombres dès que la saison le permet, un retournement à l'ancre d'hiver. La dernière carte avant chaque match laisse une question ouverte.
- **Saison 2 — le retournement.** Les graines plantées paient, un allié trahit ou un ennemi se révèle, la saisie tombe souvent ici. La saison finit sur la révélation partielle.
- **Saison 3 — l'acte final.** La vérité entière, le prix, le dernier match ou la dernière nuit, et les fins. Une fin de l'intrigue peut tomber avant la fin de la saison ; si le joueur survit à l'acte final sans en sortir, la carrière continue avec l'épilogue (une carte par saison, les rituels du rôle) jusqu'à une fin commune ou au Carrefour.

**Le dosage** (charte § 4) : par saison, un grand retournement, deux ou trois retournements d'intrigue, un ou deux événements sombres, un intermède au plus ; jamais deux chocs de suite ; après un choc, une ou deux scènes calmes. Chaque fiche numérote vingt scènes clés ; les auteurs écrivent le reste autour.

### 1.10 Ce que le moteur doit apprendre

Les rôles directeur sportif, président et sélectionneur sont écrits dans la bible et **pas branchés** : six des dix histoires en ont besoin. Ce qu'il faut, dans l'ordre :

- **Trois rôles** dans `content/roles.yaml`, avec les jauges et les fins de la charte (`docs/bible/00_charte.md` § 3.1) : `ds` (le staff, les tribunes, le président, la masse salariale ; jauge fragile la caisse), `president` (le club, les tribunes, les actionnaires, la trésorerie ; jauge fragile la caisse), `selectionneur` (le groupe, le pays, la Fédération, les moyens ; jauge fragile le vestiaire ; l'année civile et ses quatre fenêtres, la chaîne Tournoi).
- **Les lieux des nouveaux rôles** dans `content/ville.yaml` : le bureau du directeur sportif et celui du président au club-house (le bureau du président est à l'étage, la photo de 1974 dans l'escalier), le sélectionneur logé à l'hôtel de la Rive pendant les fenêtres, et pour chacun quatre à six activités (le directeur sportif : regarder les jeunes au centre, le café des agents au café de la Mairie, le fax de nuit, le banquier ; le président : la loge, la banque, la mairie, la buvette, la visite au vestiaire ; le sélectionneur : voir un joueur à l'entraînement, la conférence à L'Écho, la séance au stade, la veillée à l'hôtel).
- **La ville fixée** : les six nouveaux postulats déclarent leur ville et leur club (Aubérive, Racing Aubérive) ; les quatre de 1990 aussi, sans toucher à leurs ids, index, années, jauges et divisions (les goldens en dépendent).
- **Trois formes de carte** : l'**intermède** (un tag `intermede`, rendu à part, § 1.2), la **ligne d'ordre** (une carte d'ordre sans locuteur, rendue comme un fax, un répondeur, une oreillette ou un écran de portable selon l'histoire), et la **chaîne hors ville** (la chaîne Tournoi de *Vingt degrés dedans* se joue à Al-Dorado : la coquille montre le Dôme et non Aubérive).
- **Les fins** de chaque histoire dans `content/endings/` (une fiche par histoire), et les nouvelles lignes `epitaph_plus` de `co_garde_a_vue`.

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
10. **Les Deux Téléphones** — présidente (`escalier_ferme`) — 2038-2040 — *le double jeu* — Deux saisons pour monter avant que la loi ne ferme l'escalier ; le téléphone de ton bureau est pour la ville, le portable à clapet dans ta poche est pour ceux qui ont payé ta campagne et qui ont besoin que le Racing reste en bas.

**Pourquoi ces six-là.** Trois viennent de la bible et y gagnent une ombre : `geant_dechu` (le Racing, deux titres au mur, rattrapé par la faillite en 1999), `vendre_trente` (le contrat à trente millions, devenu un chantage au fax) et `apres_fiasco` (le bus de 2010, devenu un huis clos à l'hôtel de la Rive). Trois sont inventés parce que la chronologie du monde les appelle et qu'aucun postulat ne les portait : le modèle qui note tout (2008-2015) et le calendrier à soixante-douze matchs (2023) font *L'Oreillette* ; le Mondial d'hiver attribué en 2010 et contesté jusqu'en 2029 fait *Vingt degrés dedans* ; la loi de 2040 qui ferme la première division fait *Les Deux Téléphones*. Les autres postulats de la bible restent ouverts pour plus tard : `coach_intouchable` (2010) et `rachete_fonds` (2007) tombent sur les années de *Chambre 12* et de *23 h 58* et leurs thèmes (le fonds, le monument) y sont déjà ; `pays_emergent` et `bout_du_monde` se jouent en Sylvanie, `fusion_imposee` et `coupe_du_village` à Boisnoir et à Trébignac, loin d'Aubérive.

**Deux par rôle, dix genres, dix mécanismes.** Les deux entraîneurs (la vengeance, la disparition), les deux joueurs (la descente, la rédemption), les deux dirigeants sportifs (le chantage, la folie), les deux présidents (le complot, le double jeu), les deux sélectionneurs (le huis clos, la corruption d'État). Chaque histoire a un objet ou un rituel qui n'est qu'à elle : les masques, la voiture au sapin et le répondeur, la sirène, la route rêvée, la maquette, le fax de 23 h 58, le tableau des clés, l'oreillette, le brassard noir, les deux téléphones.

---

## Histoire 1 — Trois mille visages

### 1. La fiche

**Rôle** : entraîneur · **Postulat** : `promu` (index 0, 1990, Division 1 ; jauges, force, objectif et drapeaux inchangés) · **Club** : le Racing Aubérive, promu en première division, sans un sou · **Président** : Jean-Marie Vaubourg (`aulard`) · **Saisons** : 1990-1991, 1991-1992, 1992-1993 · **Ancien titre** : *Le promu sans un sou*.

> **Quatrième de couverture**
>
> En mars 1975, on a sorti Henri Ravenel de la Rive, sous la passerelle. Un an plus tôt, le capitaine du Racing avait perdu la finale de la Coupe, trois buts à zéro, et la Fédération avait trouvé quarante mille francs dans son casier. Ta mère a pris le car de six heures et ton nom à elle. Tu avais vingt-deux ans.
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

Quarante et un ans en 1990, entraîneur de clubs de troisième zone depuis quinze ans, réputé pour faire tenir des équipes qui n'ont rien. Né à Aubérive, fils ou fille d'Henri Ravenel, numéro 5 et capitaine du Racing de 1974. A quitté Aubérive en 1975 sous le nom de sa mère (le nom que le joueur choisit) ; n'y est jamais revenu.

**Ce qu'il veut** : savoir qui a mis l'enveloppe dans le casier, et faire graver le nom de son père sur la plaque neuve du caveau du Racing, que personne n'a voulu nommer. Plus bas, sans le dire : que son père soit innocent. **Ce qu'il cache** : qui il est ; et la dernière lettre d'Henri, qu'il porte depuis quinze ans sans l'avoir jamais lue jusqu'au bout.

### 4. La distribution

- **Gégé** (`gege`) — le capo l'a reconnu au premier regard : le visage d'Henri, qui le portait sur ses épaules en 1971 pour voir la bâche de son père (« LE PRÉSIDENT VEND, LE VIRAGE RESTE »). Il fait aimer le nouveau venu au virage, imprime les masques, et prépare sa propre vengeance contre Vaubourg. Il est l'amour et l'arme ; il ne ment jamais, il se tait.
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
7. **Le local** — *local du kop, ancre d'hiver.* Gégé déroule la bâche de 1971 : « Mon père l'a peinte. Le tien me portait sur ses épaules pour la voir. » Il ne demande rien ; il attend. ← *Qu'est-ce que tu veux ?* · → *Tu te trompes de visage*
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

**Les événements sombres** (huit, deux par saison au plus ; en première saison, ton stratégique, jamais drame) :

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

**Ce que le livre laisse au monde** : en 1990, le kop du Racing a fait imprimer trois mille masques en carton d'un même visage ; il en reste dans des greniers et au fond d'un tiroir du club-house. Henri Ravenel, capitaine de la finale de 1974, a été retiré de la Rive en mars 1975 ; la plaque neuve du caveau a été payée en 1989 par un homme en écharpe. Nino, le neveu de Gégé, vendait des masques au square à six ans.

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
> Le premier lundi, à sept heures, le répondeur du bureau clignote. Une voix fatiguée, un car qui passe derrière : « C'est Roland. Ne mets pas Bréhaut samedi. » Samedi, Bréhaut se déchire le genou à l'échauffement.
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
- **Madame Josiane** (`josiane`) — chaque soir à huit heures, elle traverse la friche avec un cabas. C'est elle qui rebranche la cafetière le matin, « ça fait moins vide ».
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

**Saison 1 (1990-1991) — L'absent.** Le prologue existant reste : la pluie sur la tôle, la berline sur la place peinte, le sifflet de l'autre dans le tiroir, la compo au mur. Le premier lundi, le répondeur. Bréhaut. Monique. La voiture qui a bougé. L'arrière-salle du Terminus, où Norbert te sert un café entre le tapis vert et le cendrier. Dembo à la friche. À l'ancre d'hiver, un dernier message : « Ne me cherche pas. Garde le banc. Et ne monte jamais seul dans le car avec lui. » La saison finit sur la place vide et la flaque d'huile. Le verdict de l'intérim (confirmé, prolongé, déchu) et le contrat ou la porte restent aux ancres existantes.

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

**Les événements sombres** (huit) :

- **Trois mètres** — parking (`parking`), nuit, saison 1. Scène 6 ; pose `voiture_bougee`.
- **La palette** — friche (`friche`), soir, saison 1 : l'événement existant *Le joueur qui ne vient pas*, habillé pour Dembo et le carnet.
- **La place vide** — parking, nuit de décembre, fin de saison 1. Scène 10 ; pose `voiture_partie`.
- **Le coup de fil de trois heures** — appartement (`domicile`), saison 2. Une voix calme, sans bonjour : « Il est où ? » Puis : « Tu sais de qui je parle. » La tonalité.
- **La panne** — sur la route du retour, puis la gare routière (`gare`), nuit d'hiver, saison 2. Le car tombe en panne à vingt kilomètres ; les joueurs rentrent en taxi, tu restes avec Norbert à attendre la dépanneuse. Il parle des cabines, de la Rive en hiver, de Roland « qui aimait trop les carnets ». Rien n'arrive. C'est le pire moment du livre.
- **La Rive** — quai (`rue`), nuit, fin de saison 2. Scène 16 ; pose `rive_voiture`.
- **La maison visitée** — appartement du quai (`domicile`), saison 3 : l'événement existant des biens, retourné. On a fouillé chez toi sans rien prendre ; la cassette du répondeur a disparu, ou elle est restée dans ta poche.
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

**À produire** : prologue existant gardé (2 variantes réécrites) ; script, 12 ancres (l'ancre « le retour de l'ancien » de la saison 1, où l'ancien signait chez le rival, est remplacée par « la place vide ») ; 7 intrigues propres (*Le répondeur*, *La berline*, *L'arrière-salle*, *Le wagon*, *Un an et un jour*, *La Prévoyance*, *Dembo* : 32 cartes) ; 8 événements sombres (17 cartes) ; 3 intermèdes ; 28 cartes de décor ; 12 réactions ; le réservoir existant de l'intérimaire gardé (le diplôme, le grand nom, le kop qui doute), avec une dizaine de variantes qui lisent la disparition. Soit **environ 120 cartes neuves pour 170 à 190 vécues**. 4 fins neuves et 3 lignes ; 14 manchettes (« OÙ EST MERCADIER ? », « UN SAPIN DANS LA RIVE », « L'INTÉRIMAIRE EST TITULAIRE », « LE CHAUFFEUR ») ; 45 répliques ; 3 missions ; 2 sponsors.

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
- **Camille** (`camille`), **Nadia Rouvier** (`rouvier`), **Pierre Massenet** (`meneche`) — la maison, la kiné qui voit les cachets, la Gazette qui achète les photos.

**Les visages nouveaux**

- **Odile**, 44 ans — ta mère, ouvrière au bâtiment C. Elle veut garder la maison et que tu ne finisses pas comme ton père. Son secret : le papier de 1986 chez Fardelli.
- **Didier Vallin**, 21 ans — le gamin d'avant, « vendu à l'étranger » en juin 1989. Il n'est jamais parti. Il vit dans la grande halle, où il a tracé un terrain à la craie sur le béton, et il a la clé de la tour de la sirène. Ce qu'il veut : qu'on dise son nom à voix haute. Son secret : son nom joue ailleurs, sur la licence d'un autre garçon.
- **Madame Irène**, 55 ans — l'hôtesse du Rideau Rouge, qui tient l'ardoise des jeunes joueurs et la revend à Fardelli. Ancienne lingère du club. Elle appelle ta mère quand tu ne peux plus conduire, et lui ment pour toi. Elle ne fait jamais crédit deux fois.
- **Steph**, 30 ans — l'homme en survêtement neuf de la salle de muscu ; ancien joueur du Racing, il vend la boîte et porte les enveloppes de l'arrière-salle du Terminus.

### 5. La structure

**Saison 1 (1990-1991) — L'argent.** Le prologue existant reste (le crochet, la sirène, les bouteilles, la place près du radiateur ou de la porte, le grillage, Fardelli au parking). En octobre, la lettre de l'usine : fermeture à Noël, les maisons de la cité à vendre aux locataires. Le chèque de Fardelli. Le premier but, la première nuit au Rideau Rouge, l'ardoise. Le genou chez Sabatier. Le 24 décembre, la dernière sirène devant toute la ville. La saison finit sur la visite médicale du grand club (l'ancre existante de la vente, variante du genou caché) : la boîte de Steph pour passer la visite, ou ton genou tel quel ; dans les deux cas, la vente tombe à l'eau, et tu restes.

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
- *Madame Irène, toi* — si `tranche == nuit && flag(ardoise)` : « Rentre. Ta mère a appelé ; je lui ai dit que tu étais parti depuis longtemps. Ne me fais pas mentir deux fois. »
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
- **Les croisés** (`jp_croises`, ligne propre) — la visite passée avec la boîte, le genou qui lâche au premier match du grand club. *« Le genou a tenu une visite, pas un match. »*
- **Sans club** (`jp_sansclub`, ligne propre) — *« Fardelli a fait suivre ton dossier à onze clubs. Aucun n'a rappelé ; il en a acheté un autre. »*

### 9. La question de saison et les objectifs

**Le fil rouge** garde ses ids (`prix / terrain / maison`) : *Qu'est-ce qui te tient debout : le prix qu'on t'a mis, le terrain, ou la maison de ta mère ?* **Les objectifs** : saison 1, jouer et garder la maison ; saison 2, ne rien devoir à personne ; saison 3, choisir où l'on va. Les objectifs cachés gardent leurs ids : `pepite_destination` (choisir sa destination sans le fax de Fardelli), `pepite_enfant_du_club` (« Vingt mètres de bâche, ça engage »), `pepite_brassard_22`.

### 10. Le volume, et ce que le livre laisse au monde

**À produire** : prologue existant gardé (3 variantes lues sur la sirène) ; script, 12 ancres (l'ancre existante de la vente reste, variante du genou caché en tête) ; 8 intrigues propres (*La maison*, *L'ardoise*, *La boîte*, *Didier*, *Le pavillon*, *Les photos*, *Une seule*, *Le papier de 1986* : 34 cartes) ; 8 événements sombres (17 cartes) ; 3 intermèdes ; 26 cartes de décor (la cité, l'épicerie, le grillage, la tour) ; 12 réactions ; le réservoir existant du joueur gardé (le tifo, la première Une, le brassard, le genou qui parle). Soit **environ 125 cartes neuves pour 170 à 190 vécues**. 4 fins neuves et 3 lignes ; 14 manchettes (« LA DERNIÈRE SIRÈNE », « LE COUPÉ DE LA PÉPITE », « QUI EST DIDIER VALLIN ? », « SEIZE HEURES ») ; 45 répliques ; 3 missions ; 2 sponsors.

**Ce que le livre laisse au monde** : la Tréfilerie a fermé à Noël 1990, et sa sirène a sonné la nuit plusieurs fois l'hiver suivant. Didier Vallin vit à la friche ; un terrain est tracé à la craie sur le béton de la grande halle. Une licence au nom de Didier Vallin a été transférée à l'étranger en 1989.

---

