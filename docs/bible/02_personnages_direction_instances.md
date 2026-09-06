# FUSIBLE — Bible scénaristique · 02 · Les personnages de la direction, des instances, de la presse et de la sélection

> Vingt-trois visages qui ne jouent jamais au ballon et qui décident de tout. Ce chapitre écrit leur fiche complète au gabarit § 4.2 de la charte, leurs deux scènes de palier (−3 la trahison, +3 la faveur) au gabarit § 4.1, leurs deux répliques de retrouvailles, leurs cartes propres, et la table « qui préside quoi, quand ». Il lit les traces que la charte lui attribue (`naming_signe`, `club_actif`, `enveloppe_promise`, `fede_dossier`, `president_ami`, `selection_refusee`, `vote_achete`, `diplome_arrange`, `commission_lettre`, `ligue_fermee_signee`, `mondial_desert`, `aubert_ministre`) et en pose quarante-quatre par les paliers et une centaine par les intrigues, chacune avec un lecteur nommé (§ 7 : la matrice à remonter au chapitre 90). Il ajoute au casting le sélectionneur en place, Aimé Rossard (§ 4.3), et vingt-trois intrigues propres, une par personnage, qui écrivent le retournement rôle par rôle (§ 6).

Comment lire : § 1 la règle du chapitre (le même visage, l'autre côté de la table) ; § 2 la table des mandats 1990-2050 ; § 3 la table des retournements par rôle ; § 4 les vingt-trois fiches (vingt-deux de la charte, plus Rossard), chacune suivie de ses deux scènes de palier, de ses retrouvailles et de ses cartes propres ; § 5 les vingt-trois intrigues propres (quatre scènes chacune : le retournement) ; § 6 les réactions que ce chapitre définit ; § 7 les traces posées et lues ; § 8 la check-list cochée.

Conventions d'ids de ce chapitre : les paliers sont communs à tous les rôles où le personnage parle, donc préfixés `co.` (`co.<id>.trahison_<mot>`, `co.<id>.faveur_<mot>`) ; ils sont programmés par `on_relation` dans `characters.yaml`, servis dans [1,3] cartes après le franchissement, une fois par carrière, hors du sac ; jamais `drame` (le palier −3 est atteignable en S0). Les retrouvailles sont `co.retrouvailles.<id>_sourire` / `_noir`, servies en [2,6] après une Passation ou un changement de club, `same_club: false`, `fallback: drop`. Un personnage hors fenêtre (`retraite`, `parti`) ne parle qu'au téléphone, à l'enterrement ou comme Fantôme : chaque scène le dit dans **Conditions** (`statut_ok`). Les adresses des dix-sept existants sont celles de `characters.yaml` pour `entraineur` et `joueur` ; ce chapitre les complète pour `joueur_amateur`, `ds`, `president_amateur`, `president`, `selectionneur`, `instance`. Dans les fiches et les répliques, « madame ou monsieur {nom} » et « madame/monsieur {nom} » sont la notation d'auteur de `{pg, select, f{madame} other{monsieur}} {nom}` ; « cher {prenom} », « mon {prenom} », « le {numero} » suivent la même règle d'accord (`{pg, select, f{chère} other{cher}}`).

---

## 1. La règle du chapitre : le même visage, l'autre côté de la table

Un personnage de direction ou d'instance ne change pas quand tu changes de rôle. C'est la table qui tourne. Fardelli, qui te vendait quand tu étais joueur, négocie *contre* toi quand tu es directeur sportif, avec le carnet que tu as rempli. Aulard, qui te virait par SMS quand tu étais entraîneur, est ton pair à la Ligue quand tu es président, ton électeur au Congrès quand tu es à la Fédération, et ton adversaire quand il veut la Fédération pour lui. Legruet te donne le diplôme, la sélection, le poste de sélectionneur, puis te lâche « après le Congrès », puis devient ton prédécesseur dont on ouvre les tiroirs. Josiane te suit partout, parce que Josiane suit les dossiers, pas les gens.

Trois règles d'écriture en découlent, et chaque fiche les applique :

1. **La relation est portable, la fonction ne l'est pas.** Ce que tu as fait à Fardelli quand tu étais joueur, Fardelli le sait quand tu es DS. La relation (−3 à +3) traverse les rôles ; le visage change de côté de la table, pas d'expression. Une scène de palier est donc écrite pour *tous* les rôles où le personnage parle, avec une variante par côté de table quand le sens l'exige (« il vend ta star » côté entraîneur, « il vend le joueur que tu voulais acheter » côté DS).
2. **La fonction est datée.** Le tableau des mandats § 2 dit qui préside quoi. Une scène qui fait parler « Aulard, président de la Fédération » porte `year >= 2008 && year < 2016`. Une scène qui le fait parler « président de {club} » porte `year < 1998` ou un `chars.aulard.statut`.
3. **Le retournement se dit en une réplique, jamais en exposition.** On n'écrit pas « je suis maintenant ton adversaire ». On écrit Fardelli, en face, qui pose ton ancien contrat sur la table : « Mon ami, on parle d'argent ou d'amitié ? Tu avais signé la page trois sans la lire, à l'époque. Ton joueur non plus. »

---

## 2. Qui préside quoi, quand (1990-2050)

Le monde « par défaut » est celui que le joueur trouve s'il n'y monte pas lui-même. Dès qu'il occupe une case, la case d'après devient « le suivant » (une voix sans portrait) ou le personnage à statut déplacé d'une case. Les âges sont ceux de la charte (âge en 1990, +1 par saison) ; on ne les discute pas, on en fait des répliques (« Legruet a soixante-trois ans depuis 1990 »).

| Mandat | Fédération (FNF) | Ligue professionnelle | Union Continentale | FédéMonde | Ministère des Sports | Commission de Contrôle des Comptes | DTN · Arbitrage | Presse et écrans |
|---|---|---|---|---|---|---|---|---|
| 1990-1996 | Legruet (depuis 1988) ; Dauzat secrétaire général | « un président qu'on ne nomme pas » (le syndicat des présidents) ; Aulard et Malbec s'y détestent | « le président de l'Union », sans portrait ; siège à l'hôtel du Lac | Bambini (depuis 1986) | « le ministre », sans nom | Vialat, l'Inspecteur (depuis 1989) | Brissac DTN (depuis 1988) · Rossard sélectionneur des Cobalts (1986-1994) · Colline arbitre de D1 (le sifflet) | Ménèche au Quotidien (« Hors micro ») ; Léa à L'Écho ; Vence en zone mixte pour Télé-Stade ; La Plume à la Gazette |
| 1996-2000 | Legruet réélu 1996 (de sept voix) | Aulard président 1998 | idem | Bambini réélu | Aubert députée 1997 ; « le ministre » toujours sans nom | Vialat | Brissac · Colline (Coupe d'été 1996 : la main sifflée contre son pays) | idem ; Rossard consultant Télé-Stade (1995), « moi, à sa place » ; le Quotidien titre sur les Cobalts de 1998 |
| 2000-2004 | Legruet réélu 2000 (de neuf voix) | Aulard | idem | Bambini | **Aubert ministre 2002** (`aubert_ministre`) | Vialat | Brissac · Colline raccroche le sifflet (45 ans, 2001), consultant arbitrage à Télé-Stade | Ménèche consultant Télé-Stade 2003 ; Vence présente « Le plateau » 2003 ; Médiacrash prend les droits |
| 2004-2008 | Legruet, dernier mandat ; il « verra ça après le Congrès » de 2008 | Aulard (Malbec attend) | Legruet candidat 2008 | Bambini | Aubert | Vialat | Brissac · Colline « désignateur » officieux | Ménèche ; Gégé sur Radio Tribune (2004-2011) ; le Flux (2007) |
| 2008-2012 | **Aulard 2008** (Malbec battu, « sans passer par les districts ») ; Dauzat | **Malbec 2008** | **Legruet 2008** (élu de neuf voix : il ne fait jamais mieux) | Bambini réélu 2010 ; Nassir au comité du Mondial (`mondial_desert` 2010) | Aubert (jusqu'en 2012) | Vialat | Brissac jusqu'en 2010, puis Castan (DTN 2010-2030, ch. 01) ; **Colline responsable de l'arbitrage 2008** | Ménèche directeur d'antenne 2012 ; Barbier à la retraite (2006), l'« algorithme » naît (2008) |
| 2012-2016 | Aulard réélu 2012 ; 2013 : « le ministre » dissout le comité (`sous_tutelle`) | Malbec | Legruet réélu 2012 ; **Dauzat secrétaire général de l'Union 2012** | Bambini se représente à 79 ans (2011), puis se retire en 2016 | « le ministre », sans nom (2012-2020) | Vialat | Castan · Colline | Vence, Ménèche ; la vidéo (2016) |
| 2016-2020 | **toi, sinon Malbec 2016** (« la voie sans les districts », enfin) | Malbec jusqu'en 2020, puis Bréhaut (DS devenu président) | Legruet retraité 2016 → « le dauphin » de Bambini glisse ici, ou toi | **« le dauphin », ou toi** (`elu_surprise` 2016) ; Josiane secrétaire de la FédéMonde (2016-2022) | idem | Vialat | idem | **Léa rédactrice en chef du Quotidien 2018** ; Solvang reprend le carnet de Fardelli (2018) ; Vence directrice de l'info (2020) |
| 2020-2028 | « le président » (voix sans portrait, 2020-2028 : élu par les districts du fils de Roux ; Fauvel préside le syndicat des joueurs jusqu'en 2030, ch. 01) ; limite d'âge de 75 ans votée | Bréhaut (2020-2028) | toi, ou « le président de l'Union » | « le dauphin » réélu 2020, **Dauzat secrétaire général de la FédéMonde 2020** ; Amsel frappe à l'hôtel du Lac (2021) | « le ministre » ; Sacha dans l'ONG des ouvriers (2022) | Vialat | Colline face à « la machine » (2027) | Ménèche publie ses mémoires (2025) ; Kick (2024) ; Legruet meurt (2029) |
| 2028-2040 | Bréhaut 2028 (de la Ligue à la Fédération) ; **Mbako 2036** (« le retour », par défaut) | **Nassir 2028** (« le fonds préside la Ligue ») | « le président de l'Union » | « le conseil » : plus de patron identifiable ; Vialat dirige l'agence de notation (2033) | idem | l'agence de notation (Vialat, 2033) puis « l'algorithme de notation » | « la machine » | Vence se retire (2035) ; « la voix générée d'un ancien joueur » commente ; L'Écho, le dimanche |
| 2040-2050 | Mbako jusqu'en 2044, puis « le président », sans nom | la Ligue des franchises (loi de 2040) | idem | idem | idem | l'algorithme | idem | L'Écho de {ville}, dernier journal papier ; l'écran-bilan du siècle (2050) |

Trois notes de lecture. (a) Quand le joueur prend une case, le personnage délogé garde sa fenêtre et sa rancune : Malbec battu en 2016 par toi est ton ennemi de Congrès jusqu'en 2020 (« Entre présidents, on se comprend. Vous, je ne vous comprends pas. »). (b) La Fédération se vote en juin des années 1992, 1996, 2000… ; la Ligue en septembre ; l'Union et la FédéMonde à l'hôtel du Lac, l'année qui suit le Mondial. (c) Les voix sans portrait (« le ministre », « le dauphin », « le président de l'Union », « le président » de 2020, « le sélectionneur de 98 ») n'ont pas de relation ; elles sont là pour que le monde tienne quand un personnage à statut est hors fenêtre.

---

## 3. La table des retournements : ce que chacun est pour toi, rôle par rôle

Une ligne par personnage, une cellule par rôle ; la cellule dit la *fonction narrative* et, entre parenthèses, le nombre d'apparitions visées par saison hors casting (`default_target`). « — » = il ne parle pas dans ce rôle (au plus une carte de Nouvelle ou d'enterrement).

| | Joueur amateur | Joueur pro | Entraîneur | Directeur sportif | Président amateur | Président pro | Sélectionneur | Instance |
|---|---|---|---|---|---|---|---|---|
| **Fardelli** | la doudoune n'est pas lui, mais il a sa carte (0,5) | ton agent, ton prix (2,5) | l'agent de ta star ; l'enveloppe (1) | **en face** : le bulldozer, ton ancien contrat sur la table (2,5) | — | l'adversaire qui vend à Malbec (1) | l'agent du capitaine ; l'avion des primes (1) | le témoin du carnet noir (0,5) |
| **Ménèche** | une brève dans L'Écho, signée de lui (0,5) | la première interview, le mème (1) | la conférence, le dossier (1,5) | la vitre baissée le dernier jour du mercato (1) | — | le direct, « virer le coach ? » (1) | l'ancien sélectionneur consultant qui te savonne, c'est lui qui tend le micro (1,5) | ses mémoires te citent ; le plateau du Congrès (1) |
| **Aulard** | — | le prix, « petit » (1) | le patron (3) | le patron qui achète sans toi (2) | — | **ton égal**, puis patron de la Ligue, puis président de la Fédération (2) | le président de club qui refuse de libérer ses joueurs (0,5) | **ton électeur, puis ton adversaire au Congrès** (2) |
| **Josiane** | Trébignac : le tutoriel (2) | le tutoriel, le fax (1,5) | le chœur, les comptes (2) | le fax de 23 h 58 (1,5) | la trésorière bénévole (1,5) | le chœur, la lettre (1,5) | secrétaire de la Fédération (2008-2016) (1) | secrétaire de la Fédération puis de la FédéMonde (2) |
| **Léa** | L'Écho, « On nous écrit » (1) | l'attachée de presse, la première Une (1,5) | la conférence (1) | elle sait avant toi (1) | L'Écho, la Coupe (1) | « Vous confirmez ? » sous les fenêtres (1) | la zone mixte (1) | la rédactrice en chef qui pose *la* question (1,5) |
| **Aubert** | la mairie prête le terrain (0,5) | — | la D2 et la mairie ; la tribune vétuste (0,5) | — | la subvention, la fusion, le synthétique (2) | le stade dont tu seras locataire (1) | **la ministre dans le vestiaire** (1) | la tutelle, « une amie précieuse ou une ennemie mortelle » (1) |
| **Legruet** | — | la sélection (0,5) | le diplôme, salle 3 (0,5) | — | — | le Congrès, une voix contre toi (0,5) | **celui qui te nomme et te lâche** (2) | prédécesseur, mentor ou adversaire (1,5) |
| **Nassir** | — | l'exil doré (0,5) | sponsor → naming → prêt → rachat (1,5) | le budget illimité et ses conditions (2) | — | l'actionnaire ou le propriétaire (2) | le Mondial d'hiver : le calendrier (0,5) | le tournoi du désert, les votes (1,5) |
| **Bambini** | — | — | — | — | — | la Ligue fermée : « je suis choqué » (0,5) | la remise du trophée à côté d'un dictateur (0,5) | **le patron, le rival, le parrain** (2) |
| **Dauzat** | — | — | la convocation salle 3 (0,5) | — | le règlement, page 41 (0,5) | le règlement, page 41 (1) | le contrat de minuit et une (1) | l'homme qui sait tout (2) |
| **Vialat** | — | — | le coupable désigné (0,5) | les commissions, la masse salariale (1,5) | — | la lettre, le blocage, la rétrogradation (2) | — | l'agence de notation (1) |
| **Amsel** | — | les paris, la brigade (0,5) | — | les fuites, les mails (0,5) | — | les écoutes, la valise (1) | — | **le raid à l'aube** (1,5) |
| **Colline** | — | le temps fort, la main (1) | le temps additionnel, « il regarde ton banc » (0,5) | — | — | il refuse et te regarde (0,5) | l'arbitre de la finale (0,5) | responsable de l'arbitrage ; l'arbitre et la machine (1) |
| **La Plume** | — | l'enregistrement du bar d'hôtel (0,5) | jamais en S0 ; le dossier (0,5) | les mails (0,5) | — | les écoutes (1) | — | dix-huit millions de pages (1,5) |
| **Vence** | — | « vous avez vu l'action ? » (1) | « je n'ai pas vu » (1) | la vitre, en direct (0,5) | — | le tweet de 3 h lu à l'antenne (1) | **l'interview de l'élimination** (2) | le plateau du Congrès (1) |
| **Solvang** | — | l'agente d'après, le double mandat refusé (1) | elle veut Mbako (0,5) | **l'agente discrète, en face ou à côté** (2) | — | elle représente ton entraîneur (1) | — | la rivale de Fardelli au carnet (0,5) |
| **Barbier** | **la doudoune** (1,5) | le rapport « trop lent » (0,5) | le recruteur qui a vu un gamin (0,5) | ton chef du recrutement ; l'œil contre l'algorithme (2) | l'indemnité de formation (1) | — | — | — |
| **Malbec** | — | — | le président qui te débauche (0,5) | le club qui offre 25 millions (1) | — | **ton égal, allié ou rival ; l'enveloppe côté adverse** (2) | il veut son joueur dans la liste (0,5) | président de la Ligue, candidat contre toi (1,5) |
| **Montoya** | — | le transfert du siècle (0,5) | le Real Montoya t'appelle à mi-saison (0,5) | — | — | **« Assis ou debout ? »** (1) | — | le bloc des douze (1) |
| **Dupuis** | il paie la tournée (1) | — | le boucher-sponsor (0,5) | — | **le maillot rose, le capitaine** (2) | Arena Dupuis (2015) (0,5) | — | — |
| **Pichon** | le président-boulanger, 150 francs (1,5) | il téléphone après ton premier match en D1 (0,5) | — | — | **ton prédécesseur, ton successeur** (1) | — | — | délégué du district : une voix (0,5) |
| **Roux** | la convocation (0,5) | — | le huis clos (amateur) (0,5) | — | **la commission du district, le siège** (1,5) | — | — | l'électorat : trois cents districts votent comme lui (1,5) |
| **Rossard** (§ 4.3) | — | le sélectionneur en place, 1990-1994 : la liste, le cinquième tireur (1) | le consultant du dimanche soir, « moi, à sa place » (1) | — | — | il veut un banc, il le dit à Malbec (0,5) | **celui dont tu as pris la place ; il te savonne à l'antenne et te parle en privé** (1,5) | 1998 à l'ordre du jour ; il se propose après le fiasco (1) |

---

## 4. Les vingt-trois fiches

### 4.1 La direction : l'argent, les agents, la presse

## ROCCO FARDELLI  (`fardelli`)
**Fonction** : agent de joueurs · **Genre** : m · **Âge en 1990** : 44 · **Camp** : direction · **Fenêtre** : 1990-2018, puis `retraite` (il téléphone, il vient aux enterrements, il vend encore un joueur « pour le plaisir » en 2024) ; meurt en 2032, gourmette au poignet · **Suivant** : Solvang reprend le carnet (2018), et la page qui te concerne
**Tic** : « Mon ami, on parle d'argent ou d'amitié ? » — torsions : « On a parlé d'amitié. Maintenant, l'argent. » · « Mon ami, on ne parle plus. » · « Ma commission, on en parle ou on en parle ? »
**Désir** : sa commission, et ta loyauté tant qu'elle rapporte · **Blessure** : son premier client l'a quitté la semaine de son transfert record ; depuis, il fait signer la page trois avant la page une
**Adresse** (sourire / neutre / noir) : entraineur, joueur : `characters.yaml` · joueur_amateur : « petit » / « petit » / « {nom} » · ds, president : « mon ami » / « monsieur le directeur » ou « monsieur le président » / « {nom} » · selectionneur : « mon ami » / « coach » / « monsieur {nom} » · instance : « cher ami » / « monsieur le président » / « {nom} »
**Ce qu'il pense de toi** : à +2 tu es un client, donc un ami · à 0 tu es une commission qui n'a pas encore de date · à −2 tu es un dossier qu'il a déjà vendu à quelqu'un d'autre
**Paliers** : −3 → `co.fardelli.trahison_signe_ailleurs` · +3 → `co.fardelli.faveur_premier_appel`
**Dans les rôles** : joueur : il te vend, il te prolonge, il t'exile ; la moitié de tes cartes de mercato (2,5) · entraîneur : l'agent de ta star, l'enveloppe (1) · **DS : il est en face.** Il sort de sa serviette le contrat que tu as signé joueur, la clause que tu n'avais pas lue, et il te la vend (2,5) · président : il vend à Malbec ce que tu ne peux pas payer (1) · sélectionneur : l'agent du capitaine, celui qui « organise » l'avion des primes (1) · instance : le témoin dont Amsel lit le carnet à voix haute (0,5)
**Trajectoire** : 1990 la gourmette et le fax, dix pour cent · 2000 les écus, les commissions à deux chiffres, Solvang lui vole un client (il dit l'inverse) · 2010 plus riche que les présidents ; il représente vingt joueurs et un entraîneur (Loco) · 2018 il donne le carnet à Solvang « sauf trois pages » · 2020 retraité à Marsange, il vend encore Dembo à un club de Kambara en 2024 · 2032 l'enterrement : trois présidents, deux procureures, aucun joueur
**Retrouvailles** : `co.retrouvailles.fardelli_sourire` / `_noir` (ci-dessous)
**Cartes propres** : *La valeur* (ch. 10, P1 de la pépite) · *La page trois* (ch. 12 : le contrat que tu as signé joueur) · *L'enveloppe* (ch. 11, ∃ `en.enveloppe`) · *Le bulldozer* (ch. 12 : quinze millions plus deux) · *L'avion des primes* (ch. 14) · *Le carnet lu à voix haute* (ch. 15, Amsel) · *Le dernier client* (ch. 31, 2024) · *La gourmette au Panthéon* (ch. 90, Fantôme)

### SCÈNE co.fardelli.trahison_signe_ailleurs  —  Signé ailleurs
**Rôle** : joueur | entraineur | ds | president | selectionneur · **Intrigue** : palier (`on_relation` −3) · **Étape** : palier −3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : le parking du centre, moteur allumé · **Conditions** : relation.fardelli <= -3 ; `statut_ok: [club, rival]` ; variante `_ds` si role == 'ds'
**FARDELLI** *(agent — noir — il ne descend pas de la voiture, la vitre à moitié baissée)*
« Mon client a signé ce matin, {toi}. Tu l'apprendras dans la presse, je te le dis par politesse. »
← **Qui, et où ?** — effets : vestiaire −−, tribunes −, set: star_vendue_dos, char: {dembo: {statut: vendu}} — *Il dit le nom de {rival}. Il ne dit pas le prix : il le laisse à Ménèche.*
→ **Bon débarras** — effets : vestiaire −, direction −, caisse +, set: star_vendue_dos, relation.fardelli −1 — *La vitre remonte. Le vestiaire, lui, a déjà lu la presse.*
Variante `_ds` (role == 'ds') : « Le joueur que vous vouliez a signé à {rival} ce matin, {toi}. Votre fax est parti à 23 h 59. Le mien à 23 h 58. » — ← **Je conteste l'heure** — effets : direction −, caisse −, set: star_vendue_dos, react: co.re.josiane_a_vu_le_fax — *Josiane a l'accusé de réception. Il dit 23 h 59.* → **On trouvera mieux** — effets : tribunes −−, vestiaire −, set: star_vendue_dos — *Le coach te demande qui. Tu n'as pas encore le nom.*
**Traces** : star_vendue_dos · **Réactions déclenchées** : co.re.josiane_a_vu_le_fax (variante DS) · **Lu plus tard par** : une.generic.vendu_dans_le_dos (ch. 20), ds_mercato_rate (epitaph_plus, ch. 30), co.nemesis.fardelli (ch. 90), en.retour_mbako variante « vendu par Fardelli » (ch. 11)

### SCÈNE co.fardelli.faveur_premier_appel  —  Le premier appel
**Rôle** : joueur | entraineur | ds | selectionneur · **Intrigue** : palier (`on_relation` +3) · **Étape** : palier +3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : ton téléphone, 7 h 10 · **Conditions** : relation.fardelli >= 3 ; `statut_ok: [club, rival, retraite]` (retraité, il appelle quand même)
**FARDELLI** *(agent — sourire — il chuchote, il est dans un couloir d'hôtel)*
« Un grand club te veut, {toi}, et je te le dis en premier, avant le président. Mon ami, on parle d'argent ou d'amitié ? »
← **D'amitié : je reste** — effets : direction +, tribunes +, set: premier_appel, relation.fardelli +1 — *Il rit. Il note quand même le nom du club, pour l'an prochain.*
→ **D'argent : dis-leur oui** — effets : caisse ++, direction −−, set: premier_appel, schedule: [{card: co.carrefour.offre_fardelli, in: [4,9]}] — *Le président l'apprend par Ménèche. Ménèche l'apprend par Fardelli.*
**Traces** : premier_appel · **Réactions déclenchées** : — · **Lu plus tard par** : bilan_carrefour variante « l'offre est arrivée par Fardelli » (ch. 30), une.generic.premier_appel (ch. 20), co.retrouvailles.fardelli_sourire (ci-dessous)

**Retrouvailles** — `co.retrouvailles.fardelli_sourire` (relation ≥ +2, `statut_ok: [club, rival, retraite]`) : Fardelli, au téléphone, un verre qu'on entend : « Nouveau bureau, {toi} ? Mon ami, on parle d'argent ou d'amitié : je passe lundi avec les deux. » — un bouton **Lundi, alors** — effets : direction +, relation.fardelli +1 — *Il passe lundi. Avec un joueur.* · `co.retrouvailles.fardelli_noir` (relation ≤ −2) : Fardelli, dans le hall, sans se lever : « Nouveau bureau, même {nom}. Mon ami, on ne parle plus ; j'ai déjà parlé à votre président. » — un bouton **Je note** — effets : direction −, vestiaire − — *Ton président a un joueur de trop. Il vient de Fardelli.*

---

## PIERRE MÉNÈCHE  (`meneche`)
**Fonction** : journaliste, chroniqueur du Quotidien (« Hors micro »), puis consultant Télé-Stade (2003), directeur d'antenne (2012) · **Genre** : m · **Âge en 1990** : 42 · **Camp** : direction · **Fenêtre** : 1990-2025, puis `retraite` (ses mémoires sortent en 2025 ; il y a un chapitre à ton nom) ; meurt en 2039, en direct, pendant un plateau d'anciens · **Suivant** : Vence à l'antenne ; « le Rosé » (voix) au papier
**Tic** : « Juste une question, hors micro. » — torsions : « Juste une réponse, hors micro. » · « Pas de question. Micro. » · « Juste une question, et le micro est allumé. »
**Désir** : l'exclusivité, et que tu lui doives quelque chose · **Blessure** : il a enterré un dossier une fois, par amitié, et on s'en est servi contre lui ; depuis il enterre avec un reçu
**Adresse** : entraineur, joueur : `characters.yaml` · joueur_amateur : « petit » / « {prenom} {nom} » / « {nom} » · ds, president, selectionneur : « {prenom} » / « monsieur le président » ou « monsieur le sélectionneur » / « {nom} » · instance : « {prenom} » / « monsieur le président » / « monsieur {nom} »
**Ce qu'il pense de toi** : à +2 tu es une source, donc protégé · à 0 tu es un sujet · à −2 tu es une Une qu'il garde au chaud
**Paliers** : −3 → `en.meneche.trahison_dossier` (∃, entraîneur) et `co.meneche.trahison_dossier` (les autres rôles, ci-dessous) · +3 → `co.meneche.faveur_enterre`
**Dans les rôles** : joueur : la première interview, le mème des trois « je ne commente pas » (1) · entraîneur : la conférence, le dossier, la cote (1,5) · DS : la vitre baissée le dernier jour du mercato (1) · président : le direct où l'on te demande de virer ton coach (1) · **sélectionneur : il tend le micro à l'ancien sélectionneur devenu consultant, et c'est toi que l'on découpe** (1,5) · instance : le plateau du Congrès ; en 2025, ses mémoires citent ta trace la plus lourde (1)
**Trajectoire** : 1990 le carnet à spirale, « Hors micro » · 2000 le tabloïd le copie, il passe à la télé (2003), il devient une voix · 2010 directeur d'antenne (2012) : il ne pose plus les questions, il choisit qui les pose · 2020 il enterre ou sort un dernier dossier, puis les mémoires (2025) · 2030 le plateau des anciens, il cite tes promesses datées · 2039 il meurt à l'antenne, on coupe la pub
**Retrouvailles** : `co.retrouvailles.meneche_sourire` / `_noir`
**Cartes propres** : *La cote du promu* (ch. 11, ∃) · *Le dossier Ménèche* (ch. 11, gabarit dossier, six variantes sur les traces) · *Le mème* (ch. 10) · *La vitre de la voiture* (ch. 12) · *Virer le coach ?* (ch. 13, en direct) · *L'ancien sélectionneur consultant* (ch. 14) · *Ton pari* (ch. 30, set-piece Bilan) · *Le chapitre à ton nom* (ch. 31, 2025)

### SCÈNE co.meneche.trahison_dossier  —  Le dossier, page une
**Rôle** : joueur | ds | president | selectionneur | instance · **Intrigue** : palier (`on_relation` −3) · **Étape** : palier −3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : la zone mixte, ou le plateau (year >= 2003) · **Conditions** : relation.meneche <= -3 ; `statut_ok: [club, retraite]` (retraité, c'est un chapitre de mémoires) ; variantes lues dans l'ordre : `flag('enveloppe_promise')` → « la valise » ; `flag('flacon_b')` → « le flacon » ; `flag('ecoutes')` → « quatre mille pages » ; `flag('vote_achete')` → « l'hôtel du Lac » ; `flag('diplome_arrange')` → « le tampon » ; sinon « les promesses, datées »
**MÉNÈCHE** *(journaliste — noir — le dossier fermé sur la table, la main dessus)*
« Le dossier sort demain, {toi} : la valise, avec les dates. Juste une question, hors micro : vous voulez répondre avant, ou après ? »
← **Avant, et à visage découvert** — effets : parole −2, tribunes −−, direction −, set: dossier_sorti — *Ta réponse est en page une. Le dossier aussi, en plus gros.*
→ **Après, avec mon avocat** — effets : parole −2, direction −−, set: dossier_sorti, relation.meneche −1 — *Maître Vidal lit la page une avant toi. Il la relit.*
**Traces** : dossier_sorti · **Réactions déclenchées** : co.re.josiane_a_lu (∃, si `!seen`) · **Lu plus tard par** : une.generic.dossier_meneche (ch. 20), grand_deballage (epitaph_plus, ch. 30), in.valises variante « la presse a déjà tout » (ch. 15), co.fantome.consultant (ch. 90)

### SCÈNE co.meneche.faveur_enterre  —  Le reçu
**Rôle** : joueur | entraineur | ds | president | selectionneur | instance · **Intrigue** : palier (`on_relation` +3) · **Étape** : palier +3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : le bar de l'hôtel, tard · **Conditions** : relation.meneche >= 3 ; `statut_ok: [club, retraite]` ; une trace judiciaire ou de Parole existe (`parole <= -1 || flag('enveloppe_promise') || flag('flacon_b') || flag('offshore') || flag('ecoutes')`) ; sinon variante `_rien` : il enterre « pour plus tard »
**MÉNÈCHE** *(journaliste — sourire — il pousse une enveloppe fermée vers toi, il garde la main dessus)*
« J'ai un dossier sur vous, {toi}, et je l'enterre ce soir. Juste une question, hors micro : vous signez le reçu ? »
← **Je signe** — effets : direction +, parole +1, set: dossier_enterre, relation.meneche +1 — *Il garde le reçu. C'est sa façon d'être fidèle.*
→ **Pas de reçu entre amis** — effets : tribunes +, set: dossier_enterre, relation.meneche −1 — *Il enterre quand même. Sans reçu, il dort moins bien.*
**Traces** : dossier_enterre · **Réactions déclenchées** : — · **Lu plus tard par** : une.gazette.ce_que_le_quotidien_na_pas_ecrit (ch. 20, La Plume), in.valises variante « le dossier enterré ressort » (ch. 15, Amsel), co.nv.2025_memoires_meneche (ch. 31 : le chapitre manquant), co.retrouvailles.meneche_sourire

**Retrouvailles** — `co.retrouvailles.meneche_sourire` (≥ +2) : Ménèche, micro éteint posé sur la table : « Nouveau costume, {toi}. Juste une question, hors micro : je vous appelle comment, maintenant ? » — un bouton **Comme avant** — effets : tribunes +, relation.meneche +1 — *Il t'appelle comme avant. À l'antenne, il dit le titre.* · `co.retrouvailles.meneche_noir` (≤ −2) : Ménèche, micro allumé : « Nouveau costume, même dossier. Juste une question, micro : vous avez lu ce que j'ai écrit sur {nom} ? » — un bouton **J'ai lu** — effets : tribunes −, direction − — *Ton nouveau patron aussi. Il a corné la page.*

---

## JEAN-MARIE AULARD  (`aulard`)
**Fonction** : président de {club} (1990-1998), président de la Ligue (1998-2008), président de la Fédération (2008-2016) · **Genre** : m · **Âge en 1990** : 58 · **Camp** : direction (bande `instances` de 2008 à 2016) · **Fenêtre** : 1990-2016, puis `retraite` (il téléphone à 23 h 47, il vient au Congrès en spectateur, il te « rappelle » encore) ; meurt en 2026, dans son bureau, un empire et pas le temps · **Suivant** : « le fils d'Aulard » (voix ; ch. 11 `en.fils_aulard`), qui ne veut pas de l'empire ; Malbec à la Ligue
**Tic** : « J'ai pas le temps, j'ai un empire. » — torsions : « J'ai le temps. J'ai plus d'empire. » · « J'ai pas le temps, j'ai une Fédération. » · « J'ai pas le temps, j'ai un enterrement. »
**Désir** : durer, contrôler, être cité · **Blessure** : avocat de formation, il n'a jamais joué ; son fils ne veut pas de l'empire ; il t'a viré par SMS pour ne pas avoir à te regarder
**Adresse** : entraineur, joueur : `characters.yaml` · joueur_amateur : « petit » / « {nom} » / « {nom} » · ds : « mon {prenom} » / « {nom} » / « monsieur {nom} » · president : « cher {prenom} » / « cher collègue » / « monsieur {nom} » · selectionneur : « {prenom} » / « monsieur le sélectionneur » / « monsieur {nom} » · instance : « cher {prenom} » / « cher collègue » / « monsieur le président » (à −2 le titre est une insulte)
**Ce qu'il pense de toi** : à +2 tu es sa création, et il le dit à la presse · à 0 tu es une ligne de son organigramme · à −2 tu es un SMS qu'il n'a pas encore envoyé
**Paliers** : −3 → `co.aulard.trahison_cheque_non_date` · +3 → `co.aulard.faveur_rappel`
**Dans les rôles** : entraîneur : le patron, les deux discours, le SMS (3) · joueur : le prix ; « petit » (1) · DS : il achète sans toi, via son beau-frère (2) · **président : ton égal.** Il t'appelle « cher collègue » et vote contre toi à la Ligue pour la répartition des droits (2) · sélectionneur : le président qui « n'a pas le temps » de libérer ses joueurs pour un amical (0,5) · **instance : ton électeur en 2008 ou ton adversaire en 2012 ; à la Fédération, tu ouvres ses tiroirs** (2). Il te vire souvent, il te rappelle toujours : c'est le palier +3.
**Trajectoire** : 1990 le président bâtisseur, la tribune à son nom en projet · 2000 patron de la Ligue, il répartit les droits « aux gros, donc aux bons » · 2008 président de la Fédération contre Malbec ; Josiane le suit · 2016 battu ou retiré, il tweete à 3 h · 2020 il vient au Congrès en spectateur, il compte les voix à voix haute · 2026 mort au bureau ; l'Almanach : « {annee} : Aulard n'a plus d'empire. Il a eu le temps. »
**Retrouvailles** : `co.retrouvailles.aulard_sourire` / `_noir`
**Cartes propres** : *L'objectif* (ch. 30, set-piece `objective`, dix variantes) · *Le SMS de 23 h 47* (ch. 30, ∃ `en_sms`) · *Reste, mais en costume* (ch. 30, Carte Destin joueur → DS, entraîneur → DS) · *Le fils du président* (ch. 11) · *Les droits télé : les petits ou les gros ?* (ch. 13) · *Le bloc Aulard au Congrès* (ch. 15, lit `president_ami`) · *Le tweet de 3 h* (ch. 13) · *Le chèque non daté* (ci-dessous)

### SCÈNE co.aulard.trahison_cheque_non_date  —  Le chèque non daté
**Rôle** : entraineur | ds | president | instance · **Intrigue** : palier (`on_relation` −3) · **Étape** : palier −3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : son bureau, la porte ouverte pour que Josiane entende · **Conditions** : relation.aulard <= -3 ; `statut_ok: [club, rival, retraite]` ; variante `_pair` si role in ['president', 'instance'] (le chèque devient « ma voix »)
**AULARD** *(président — noir — il fait glisser un chèque, signé, sans date)*
« Votre indemnité, {toi}, signée ; je ne la date pas, vous partirez quand je le dirai. J'ai pas le temps, j'ai un empire. »
← **Je prends le chèque** — effets : caisse ++, direction −−, vestiaire −, set: cheque_non_date — *Josiane le date. De demain.*
→ **Je le déchire devant vous** — effets : direction −−, tribunes +, parole +1, set: cheque_non_date, relation.aulard −1 — *Il en a un autre dans le tiroir. Il n'est pas daté non plus.*
Variante `_pair` : « Ma voix, cher collègue, je ne la date pas : elle ira contre vous au Congrès qui m'arrangera. J'ai pas le temps, j'ai un empire. » — ← **Votez, on comptera** — effets : direction −−, set: cheque_non_date — *Roux a entendu. Roux compte pour trois cents.* → **Je vous offre un poste** — effets : direction −, caisse −, set: cheque_non_date, relation.aulard +1 — *Il accepte le placard. Il le meuble.*
**Traces** : cheque_non_date · **Réactions déclenchées** : en.re.josiane_cheque (∃, entraîneur, si `relation.josiane >= 0`) · **Lu plus tard par** : en_sms et en_placard (epitaph_plus, ch. 30), in.congres variante « le bloc Aulard vote contre » (ch. 15), une.generic.cheque_non_date (ch. 20), co.nemesis.aulard (ch. 90)

### SCÈNE co.aulard.faveur_rappel  —  Je te rappelle toujours
**Rôle** : entraineur | ds | president | selectionneur | instance · **Intrigue** : palier (`on_relation` +3) · **Étape** : palier +3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : le téléphone, une heure indue · **Conditions** : relation.aulard >= 3 ; `statut_ok: [club, rival, retraite]`
**AULARD** *(président — sourire — il ne dit pas bonjour, il ne dit jamais bonjour)*
« Je t'ai viré deux fois, {toi}, et je te rappellerai toujours : le jour où ça tombe, tu as un bureau chez moi. J'ai pas le temps, j'ai un empire. »
← **Je garde le numéro** — effets : direction ++, set: aulard_rappelle, relation.aulard +1 — *Il raccroche. Josiane note l'heure : c'est une promesse, elle les date.*
→ **Je n'en aurai pas besoin** — effets : direction +, tribunes +, parole +1, set: aulard_rappelle — *Il rit. Il note quand même.*
**Traces** : aulard_rappelle · **Réactions déclenchées** : — · **Lu plus tard par** : Porte de sortie variante « l'offre d'Aulard, un cran en dessous » (ch. 30), bilan_carrefour variante « le bureau chez Aulard » (ch. 30), en.aulard_rappelle (ch. 11, `if: flag('aulard_rappelle')` : poids ×2), pr.president_ami variante (ch. 13, lit aussi `president_ami`)

**Retrouvailles** — `co.retrouvailles.aulard_sourire` (≥ +2) : Aulard, un cigare qu'il n'allume pas : « Nouveau fauteuil, {toi} ; je l'ai eu avant vous, il grince. J'ai pas le temps, j'ai un empire, mais j'ai une minute. » — un bouton **Une minute, alors** — effets : direction +, relation.aulard +1 — *Une minute. Il en prend douze.* · `co.retrouvailles.aulard_noir` (≤ −2) : Aulard, sans se retourner : « Le fauteuil de {nom}, on me l'a décrit. J'ai pas le temps, j'ai un empire ; j'ai un vote aussi. » — un bouton **Je m'en souviendrai** — effets : direction −, relation.aulard −1 — *Lui aussi. C'est son métier.*

---

## MADAME JOSIANE  (`josiane`)
**Fonction** : secrétaire du club depuis 1987 ; de la Fédération (2008-2016) ; de la FédéMonde (2016-2022) · **Genre** : f · **Âge en 1990** : 52 · **Camp** : direction (bande `instances` de 2008 à 2022) · **Fenêtre** : 1990-2022, puis `retraite` (elle range encore les dossiers ; elle téléphone pour dire qu'un fax est arrivé, alors qu'il n'y a plus de fax) ; meurt en 2041, on trouve le classeur rangé · **Suivant** : « la petite Josiane », sa nièce, au club (voix sans portrait) ; à la Fédération, Dauzat garde les procès-verbaux, elle gardait les gens
**Tic** : « J'en ai vu passer, vous savez. » — torsions : « J'en ai vu passer. Pas comme vous. » · « J'en verrai passer d'autres, vous savez. » · « Celui-là, je l'ai vu arriver. »
**Désir** : que le club tourne · **Blessure** : elle a refusé un poste à la capitale en 1987 pour rester ; personne ne le sait, sauf le classeur
**Adresse** : entraineur, joueur : `characters.yaml` · joueur_amateur : « {prenom} » / « {prenom} » / « {nom} » · ds, president, selectionneur, instance : « {prenom} » / « monsieur le président » ou « madame la présidente » (le titre exact du rôle) / idem, plus sec
**Ce qu'elle pense de toi** : à +2 tu es quelqu'un qu'elle a vu arriver et qu'elle voudrait voir rester · à 0 tu es un dossier de plus · à −2 tu es rangé sous les autres
**Paliers** : −3 → `co.josiane.trahison_sous_les_autres` · +3 → `co.josiane.faveur_classeur`
**Dans les rôles** : joueur amateur : le tutoriel de Trébignac, douze cartes (2) · joueur pro : le fax, la paie du 5 (1,5) · entraîneur : le chœur, les comptes, le chauffage (2) · DS : le fax de 23 h 58, l'accusé de réception (1,5) · président amateur : la trésorière bénévole qui tient la caisse avec Gérard, et qui compte après lui (1,5) · président pro : la lettre de la Commission, vue avant toi (1,5) · sélectionneur, instance : **elle t'a suivi.** Secrétaire de la Fédération quand Aulard y monte (2008), de la FédéMonde après ; à l'hôtel du Lac, c'est elle qui ouvre à six heures (2)
**Trajectoire** : 1990 le classeur, le radiateur, le fax · 2000 le fax imprime « 1900 », elle le range · 2008 elle suit Aulard à la Fédération « parce que les dossiers y sont pires » · 2016 la FédéMonde ; elle sert le café à Amsel · 2022 retraitée à Saint-Étoile ; sa nièce prend le club · 2041 l'enterrement : tout le monde y est ; personne ne sait qui a rangé le classeur
**Retrouvailles** : `co.retrouvailles.josiane_sourire` / `_noir`
**Cartes propres** : *L'inventaire* (ch. 11, ∃ A1) · *Le tutoriel de Trébignac* (ch. 10, douze cartes) · *Le fax de 23 h 58* (ch. 12) · *La lettre vue avant* (ch. 13) · *Le café de six heures* (ch. 15) · *La rentrée* (ch. 30, set-piece `objective`, variante « l'hôtel du club ») · *Le classeur* (ci-dessous) · *La petite Josiane* (ch. 31, 2022)

### SCÈNE co.josiane.trahison_sous_les_autres  —  Sous les autres
**Rôle** : joueur | entraineur | ds | president_amateur | president | selectionneur | instance · **Intrigue** : palier (`on_relation` −3) · **Étape** : palier −3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : son bureau ; la porte est fermée, ce qui n'arrive jamais · **Conditions** : relation.josiane <= -3 ; `statut_ok: [club, staff]`
**JOSIANE** *(secrétaire — noir — elle ne lève pas les yeux du classeur)*
« Votre successeur a demandé le dossier, {toi} ; je le lui ai donné complet, avec vos promesses datées. J'en ai vu passer, vous savez. »
← **Quel successeur ?** — effets : direction −−, tribunes −, set: dossier_transmis — *Elle dit le nom. Tu l'avais lu dans le journal sans le lire.*
→ **Vous auriez pu me prévenir** — effets : direction −, vestiaire −, set: dossier_transmis, relation.josiane −1 — *Elle t'a prévenu. Trois fois. C'était dans le classeur.*
**Traces** : dossier_transmis · **Réactions déclenchées** : — · **Lu plus tard par** : en_sms, ds_commun_accord, pr_ag (epitaph_plus « Josiane avait déjà donné le dossier », ch. 30), bilan_verdict variante « le successeur est dans le couloir » (ch. 30), une.echo.josiane_range (ch. 20)

### SCÈNE co.josiane.faveur_classeur  —  Le classeur, avant
**Rôle** : entraineur | ds | president_amateur | president | selectionneur | instance · **Intrigue** : palier (`on_relation` +3) · **Étape** : palier +3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : le couloir, un café, deux sucres · **Conditions** : relation.josiane >= 3 ; `statut_ok: [club, staff]` ; variantes : `flag('commission_lettre')` → « la lettre » ; `flag('fede_dossier')` → « la convocation » ; sinon « le second discours »
**JOSIANE** *(secrétaire — sourire — elle te tend une photocopie, pliée en quatre, comme un mot d'école)*
« La lettre arrive lundi, {toi} ; je vous l'ai photocopiée avant qu'elle n'existe. J'en ai vu passer, vous savez, mais je ne les ai jamais montrées. »
← **Merci, Josiane** — effets : direction ++, set: josiane_prevenu, relation.josiane +1 — *Tu as le week-end. Le président ne l'a pas.*
→ **Je ne vous compromets pas** — effets : direction +, parole +1, set: josiane_prevenu — *Elle range la photocopie. Elle te la raconte de mémoire.*
**Traces** : josiane_prevenu · **Réactions déclenchées** : — · **Lu plus tard par** : pr.commission variante « tu savais avant la lettre » (ch. 13, lit `commission_lettre`), in.dossier variante « la convocation, une semaine d'avance » (ch. 15, lit `fede_dossier`), bilan_verdict variante « Josiane t'avait montré le discours » (ch. 30), une.echo.josiane_savait (ch. 20)

**Retrouvailles** — `co.retrouvailles.josiane_sourire` (≥ +2, `statut_ok: [club, staff, retraite]`) : Josiane, un carton sous le bras : « J'ai suivi le dossier, {toi} ; il se trouve que c'était le vôtre. J'en ai vu passer, vous savez, j'ai préféré celui-là. » — un bouton **Posez le carton, Josiane** — effets : direction +, relation.josiane +1 — *Elle le pose. Le radiateur d'ici tousse aussi.* · `co.retrouvailles.josiane_noir` (≤ −2) : Josiane, au téléphone du nouveau bureau : « On m'a demandé des renseignements sur {nom}. J'en ai vu passer, vous savez ; j'ai dit la vérité. » — un bouton **Laquelle ?** — effets : direction −, relation.josiane −1 — *Celle du classeur. Elle est datée.*

---

## LÉA  (`lea`)
**Fonction** : journaliste de L'Écho de {ville} (1990-2018), puis rédactrice en chef du Quotidien du Ballon (2018-2035), puis « On nous écrit » dans L'Écho du dimanche · **Genre** : f · **Âge en 1990** : 25 · **Camp** : direction · **Fenêtre** : 1990-2050 (à 85 ans elle signe encore le dimanche) · **Suivant** : « le stagiaire de l'Écho » (voix) quand elle monte au Quotidien ; personne au Quotidien quand elle en descend
**Tic** : « Vous confirmez ? » — torsions : « Vous ne confirmez pas. Je note. » · « Je confirme. Vous ? » · « Vous confirmez la Une ? »
**Désir** : la vérité, en une phrase · **Blessure** : elle a commencé à L'Écho parce que Le Quotidien ne l'a pas prise ; elle le dirige depuis 2018 et n'a jamais changé la formule de refus
**Adresse** : entraineur, joueur : `characters.yaml` · joueur_amateur : « {prenom} » / « {prenom} » / « {nom} » · ds, president, president_amateur : « {prenom} » / « monsieur le président » ou « madame la présidente » / « madame/monsieur {nom} » · selectionneur : « {prenom} » / « coach » / « monsieur le sélectionneur » (le titre devient froid) · instance : « {prenom} » / « monsieur le président » / « monsieur {nom} »
**Ce qu'elle pense de toi** : à +2 tu réponds, donc elle t'appelle avant d'écrire · à 0 tu es une citation · à −2 tu es une question sans réponse, en Une
**Paliers** : −3 → `co.lea.trahison_une_question` · +3 → `co.lea.faveur_vingt_quatre_heures`
**Dans les rôles** : joueur amateur : L'Écho, la rubrique « Au local » (1) · joueur pro : l'attachée de presse (elle l'a été deux saisons, 1991-1993, pour payer son loyer), la première Une, les mémoires (1,5) · entraîneur : la conférence, la question gentille qui ne l'est pas (1) · **DS : elle sait avant toi ; le fax n'est pas encore parti qu'elle a le nom** (1) · président amateur : la Coupe, le Petit Poucet (1) · président pro : « Vous confirmez ? » sous tes fenêtres, avec Gégé derrière (1) · sélectionneur : la zone mixte, une seule question (1) · **instance : rédactrice en chef, la seule qui pose *la* question ; ses Unes lisent tes traces** (1,5)
**Trajectoire** : 1990 L'Écho, le vélo, le carnet · 2000 elle refuse le tabloïd, elle reste au local · 2010 le stagiaire, le Flux, elle ne tweete pas · 2018 rédactrice en chef du Quotidien ; sa première Une est une question · 2030 elle rend le Quotidien à « personne », elle rentre à L'Écho · 2050 le dernier journal papier ; c'est elle qui l'imprime
**Retrouvailles** : `co.retrouvailles.lea_sourire` / `_noir`
**Cartes propres** : *La première Une* (ch. 10) · *Les mémoires* (ch. 10) · *La zone mixte* (ch. 14) · *Vous confirmez ? Le village est en D2* (ch. 30, Carte Destin président amateur → pro) · *La question* (ch. 15) · *Le stagiaire de l'Écho* (ch. 20, voix) · *Vingt-quatre heures* (ci-dessous) · *La dernière imprimeuse* (ch. 31, 2050)

### SCÈNE co.lea.trahison_une_question  —  Une question, une Une
**Rôle** : joueur | entraineur | ds | president | selectionneur | instance · **Intrigue** : palier (`on_relation` −3) · **Étape** : palier −3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : la zone mixte ; elle est la dernière, elle a attendu · **Conditions** : relation.lea <= -3 ; `statut_ok: [club]`
**LÉA** *(presse — noir — le carnet fermé ; la question, elle la sait par cœur)*
« Une question, une seule, et je la mets en Une demain avec ou sans votre réponse : vous saviez ? Vous confirmez ? »
← **Je savais** — effets : parole −1, tribunes −−, direction −, set: une_lea — *La Une dit « IL SAVAIT ». Le Quotidien, la Gazette et L'Écho ont la même.*
→ **Je ne réponds pas à ça** — effets : tribunes −, direction −−, set: une_lea, relation.lea −1 — *La Une est un point d'interrogation. Il fait toute la page.*
**Traces** : une_lea · **Réactions déclenchées** : co.re.gege_decoupe (∃) · **Lu plus tard par** : une.generic.vous_saviez (ch. 20, priorité 3), grand_deballage (epitaph_plus, ch. 30), jp.memoires variante « le chapitre qu'elle n'a pas relu » (ch. 10), co.nemesis.lea (ch. 90)

### SCÈNE co.lea.faveur_vingt_quatre_heures  —  Vingt-quatre heures
**Rôle** : joueur | entraineur | ds | president | selectionneur | instance · **Intrigue** : palier (`on_relation` +3) · **Étape** : palier +3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : le téléphone, 22 h, elle boucle · **Conditions** : relation.lea >= 3 ; `statut_ok: [club]` ; variante `_instance` (year >= 2018 && role == 'instance') : « je tiens la Une du Quotidien »
**LÉA** *(presse — sourire — on entend la rotative derrière elle)*
« J'ai l'histoire, {toi}, et je la tiens vingt-quatre heures pour que vous parliez en premier. Vous confirmez ? »
← **Je parle demain matin** — effets : tribunes +, direction +, parole +1, set: lea_a_tenu, relation.lea +1 — *Tu parles à huit heures. À neuf, elle imprime ta version, avec la sienne dessous.*
→ **Publiez, je ne me cache pas** — effets : tribunes ++, direction −, set: lea_a_tenu — *Elle publie à minuit. La Gazette, à une heure, avec des fautes.*
**Traces** : lea_a_tenu · **Réactions déclenchées** : co.re.vence_direct (§ 6) · **Lu plus tard par** : une.echo.il_a_parle_le_premier (ch. 20), in.dix_huit_millions variante « Léa avait tenu, La Plume non » (ch. 15), jp_consultant (epitaph_plus « Léa lui avait donné vingt-quatre heures », ch. 30)

**Retrouvailles** — `co.retrouvailles.lea_sourire` (≥ +2) : Léa, sur le trottoir, avant tout le monde : « Nouveau poste, même carnet, {toi}. Vous confirmez que je garde votre numéro ? » — un bouton **Gardez-le** — effets : tribunes +, relation.lea +1 — *Elle l'a déjà. Elle voulait l'entendre.* · `co.retrouvailles.lea_noir` (≤ −2) : Léa, dans la salle, au dernier rang : « J'ai écrit sur {nom} hier, avant la nomination. Vous confirmez que vous ne l'avez pas lu ? » — un bouton **Je l'ai lu** — effets : tribunes −, direction − — *Tout le monde l'a lu. C'est le premier rang qui te regarde.*

---

## CHEIKH NASSIR  (`nassir`)
**Fonction** : le fonds Qatalyst : sponsor, puis propriétaire ; rachète Capitale FC (2011) ; comité du Mondial (2010-2022) ; président de la Ligue (2028-2040) · **Genre** : m · **Âge en 1990** : 34 · **Camp** : direction · **Fenêtre** : 1990-2045, puis `retraite` (il regarde les matchs d'Al-Dorado FC seul, dans une loge vide) · **Suivant** : « un émissaire de Qatalyst » (voix), puis « le neveu de l'émir » (voix, 2030)
**Tic** : « Ce n'est pas un club, c'est un actif. » — torsions : « Ce n'était pas un club. C'était un actif. Il ne l'est plus. » · « Ce n'est pas un Mondial, c'est un actif. » · « Ce n'est pas un actif. C'est un club. » (une seule fois dans la carrière : le palier +3)
**Désir** : rendement et image d'État · **Blessure** : il aimait le football avant d'en acheter ; il a été gardien remplaçant à quatorze ans, il n'est jamais entré
**Adresse** : entraineur, joueur : `characters.yaml` · ds : « {prenom} » / « monsieur le directeur » / « monsieur {nom} » · president : « {prenom} » / « cher président » / « monsieur {nom} » · selectionneur : « coach » sur les trois visages (il ne comprend pas ce rôle) · instance : « cher ami » / « monsieur le président » / « monsieur {nom} »
**Ce qu'il pense de toi** : à +2 tu es un actif qui monte · à 0 tu es une ligne du bilan · à −2 tu es un actif déprécié, et on notifie
**Paliers** : −3 → `co.nassir.trahison_notification` · +3 → `co.nassir.faveur_un_club`
**Dans les rôles** : joueur : l'exil doré, le banc climatisé (0,5) · entraîneur : sponsor → naming → prêt → rachat (∃, 1,5) · **DS : le budget illimité et ses conditions ; chaque recrue passe par le club frère d'Al-Dorado** (2) · **président : si tu as signé `club_actif` en entraîneur, il est ton propriétaire ; sinon il est l'actionnaire qui veut trente pour cent** (2) · sélectionneur : le Mondial d'hiver (`mondial_desert`) décale ta fenêtre de novembre (0,5) · instance : le tournoi du désert, les votes, la loge de l'hôtel du Lac (1,5)
**Trajectoire** : 1990 la canette orange, le maillot · 2000 les écus, le prêt à 51 %, Arena Qatalyst · 2011 Capitale FC ; 2010-2022 le Mondial d'Al-Dorado, en hiver · 2020 le club frère de l'autre hémisphère, la multi-propriété · 2028 il préside la Ligue, « la Ligue est un actif » · 2040 la loi des franchises est sa loi ; 2045 la loge vide
**Retrouvailles** : `co.retrouvailles.nassir_sourire` / `_noir`
**Cartes propres** : *Le maillot* (ch. 11, ∃) · *Le rachat* (ch. 11, ∃) · *Le budget illimité* (ch. 12) · *L'émir veut un joueur pour Noël* (ch. 13) · *Le club frère* (ch. 13, lit `mondial_desert`) · *Le tournoi du désert* (ch. 15) · *Notification* (ci-dessous)

### SCÈNE co.nassir.trahison_notification  —  Notification
**Rôle** : entraineur | ds | president · **Intrigue** : palier (`on_relation` −3) · **Étape** : palier −3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : ta boîte mail (year >= 2000) ou un fax (avant) · **Conditions** : relation.nassir <= -3 ; `statut_ok: [club, rival]` ; variante `_proprietaire` si `flag('club_actif')` (c'est un licenciement), sinon il retire le sponsoring
**NASSIR** *(fonds — noir — ce n'est pas lui : c'est une notification, il n'a pas signé)*
« Le fonds met fin au partenariat avec effet immédiat, {toi}, les panneaux seront retirés lundi. Ce n'est pas un club, c'est un actif. »
← **Je rends les panneaux** — effets : caisse −−, tribunes +, set: nassir_retire — *Gégé t'aide. Il garde un panneau, pour le local.*
→ **Je négocie l'indemnité** — effets : caisse −, direction −, set: nassir_retire, relation.nassir −1 — *L'émissaire propose une somme. Elle est en écus, elle n'est pas datée.*
Variante `_proprietaire` : « Le conseil vous remercie, {toi}, avec effet immédiat ; votre badge ne fonctionnera plus à midi. Ce n'est pas un club, c'est un actif. » — ← **Je descends dire au revoir** — effets : direction −−, vestiaire ++, set: nassir_retire — *Le badge marche encore jusqu'à midi. Tu prends ton temps.* → **Je réponds par avocat** — effets : direction −−, caisse +, set: nassir_retire — *Maître Vidal compte les mois. L'émissaire compte les heures.*
**Traces** : nassir_retire · **Réactions déclenchées** : co.re.gege_decoupe (∃ ; il découpe la notification) · **Lu plus tard par** : en_placard et pr_pantin (epitaph_plus « Notification », ch. 30), en.nassir_proprietaire variante « encore » (ch. 11 : « nous revoilà, sans panneaux »), une.gazette.notification (ch. 20), ds.mercato variante « le budget est parti avec les panneaux » (ch. 12)

### SCÈNE co.nassir.faveur_un_club  —  C'est un club
**Rôle** : entraineur | ds | president | instance · **Intrigue** : palier (`on_relation` +3) · **Étape** : palier +3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : la tribune vide, après un match, il est resté · **Conditions** : relation.nassir >= 3 ; `statut_ok: [club, rival]`
**NASSIR** *(fonds — sourire — sans canette, sans émissaire, sans téléphone)*
« Une saison sans condition, {toi} : le budget, sans club frère, sans option sur un gamin. Ce n'est pas un actif, c'est un club. »
← **Je prends la saison** — effets : caisse +++, set: nassir_sans_condition, relation.nassir +1 — *Il ne demande rien. C'est la première fois ; ça te fait peur.*
→ **Gardez l'argent, restez là** — effets : tribunes ++, caisse +, set: nassir_sans_condition, set: club_a_lancienne — *Il reste dans la tribune vide. Il a l'air d'un supporter.*
**Traces** : nassir_sans_condition (et `club_a_lancienne` ∃ à droite) · **Réactions déclenchées** : — · **Lu plus tard par** : ds.mercato fenêtre d'hiver variante « sans condition » (ch. 12), pr.actionnaires variante (ch. 13), in.tournoi_desert variante « il vous doit une saison » (ch. 15, lit aussi `mondial_desert`), en_coupable (epitaph_plus, ch. 30)

**Retrouvailles** — `co.retrouvailles.nassir_sourire` (≥ +2) : Nassir, par courrier, à la main : « Nouveau poste, {toi} ; nous avons un actif dans votre nouvelle ville, il s'appelle comme votre stade. Ce n'est pas un club, c'est un actif, mais il vous attend. » — un bouton **Je note l'adresse** — effets : caisse +, relation.nassir +1 — *L'adresse est celle d'Arena Qatalyst. Tu en es locataire.* · `co.retrouvailles.nassir_noir` (≤ −2) : un émissaire, sans portrait, lit : « Le fonds a été informé de la nomination de {nom}. Le fonds révisera ses positions en conséquence. Ce n'est pas un club, c'est un actif. » — un bouton **Dites-lui que j'ai lu** — effets : caisse −, direction − — *Le fonds a déjà révisé. Ton budget a une ligne en moins.*

---

## INGRID SOLVANG  (`solvang`)
**Fonction** : agente de joueurs ; reprend le carnet de Fardelli en 2018 · **Genre** : f · **Âge en 1990** : 33 · **Camp** : direction · **Fenêtre** : 1990-2040, puis `retraite` (elle enseigne « le contrat » à des gamins de seize ans et à leurs mères) · **Suivant** : « le père-agent » générique (voix), puis la mère de Mbako, agente de vingt joueurs (2010)
**Tic** : « Mon client décide. Moi, je compte. » — torsions : « Mon client a décidé. J'ai compté. » · « Je ne décide pas. Je compte, et ça suffit. » · « Mon client ne décide plus. Moi non plus. » (l'enterrement de Fardelli)
**Désir** : la nouvelle génération contre les gourmettes · **Blessure** : Fardelli lui a volé son premier client ; elle a gardé le contrat, et le contrat avait une page trois qu'il n'avait pas lue
**Adresse** (sourire / neutre / noir) : joueur, joueur_amateur : « {prenom} » / « {prenom} {nom} » / « {nom} » · entraineur, selectionneur : « {prenom} » / « coach » / « {nom} » · ds, president : « {prenom} » / « monsieur le directeur » ou « monsieur le président » / « {nom} » · instance : « {prenom} » / « monsieur le président » / « {nom} »
**Ce qu'elle pense de toi** : à +2 tu lis les contrats, donc elle te les montre · à 0 tu es une partie au contrat · à −2 tu es une clause qu'elle va faire jouer
**Paliers** : −3 → `co.solvang.trahison_libre` · +3 → `co.solvang.faveur_page_trois`
**Dans les rôles** : joueur : l'agente d'après, le double mandat refusé (1) · entraîneur : elle veut Mbako, elle le dit à sa mère (0,5) · **DS : l'agente discrète, en face ou à côté ; la clause anti-voyage spatial, le père-agent, l'algorithme qu'elle lit mieux que Barbier** (2) · président : elle représente ton entraîneur, et son préavis (1) · instance : la rivale de Fardelli au carnet ; elle témoigne sans qu'on le lui demande (0,5)
**Trajectoire** : 1990 un bureau sans gourmette, deux clients · 2000 l'arrêt Bosquet est son outil : les joueurs libres, comptés · 2010 la mère de Mbako lui prend l'idée, elle s'en amuse · 2018 le carnet de Fardelli, « sauf trois pages » : elle les retrouve · 2030 elle représente des joueurs clonés (une Nouvelle, pure blague) · 2040 la retraite ; le cours « la page trois »
**Retrouvailles** : `co.retrouvailles.solvang_sourire` / `_noir`
**Cartes propres** : *Le double mandat refusé* (ch. 10) · *La clause anti-voyage spatial* (ch. 12) · *Le père-agent* (ch. 12) · *Le préavis de ton entraîneur* (ch. 13) · *Les trois pages* (ch. 15) · *Libre* (ci-dessous)

### SCÈNE co.solvang.trahison_libre  —  Parti libre
**Rôle** : entraineur | ds | president · **Intrigue** : palier (`on_relation` −3) · **Étape** : palier −3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : le bureau, un contrat posé à l'envers · **Conditions** : relation.solvang <= -3 ; `statut_ok: [club, rival]` ; year >= 1995 (`monde_bosquet`), sinon variante `_clause` (« la clause, au centime »)
**SOLVANG** *(agente — noir — elle retourne le contrat : la date de fin est surlignée)*
« Mon client part libre en juin, chez {rival}, et vous l'apprenez aujourd'hui parce que la loi m'y oblige. Mon client décide. Moi, je compte. »
← **Je prolonge, à son prix** — effets : caisse −−, vestiaire +, set: libre_chez_rival, relation.solvang −1 — *Son prix a doublé entre le couloir et le bureau. Elle a compté.*
→ **Qu'il parte, tant pis** — effets : caisse −, tribunes −−, set: libre_chez_rival — *Il marque contre toi en septembre. La Gazette avait la date.*
**Traces** : libre_chez_rival · **Réactions déclenchées** : co.re.josiane_a_vu_le_fax (§ 6) · **Lu plus tard par** : une.gazette.parti_libre (ch. 20), ds.mercato variante « le trou au poste » (ch. 12), co.derby variante « il joue contre toi, libre » (ch. 11), co.nemesis.solvang (ch. 90)

### SCÈNE co.solvang.faveur_page_trois  —  La page trois
**Rôle** : joueur | ds | president · **Intrigue** : palier (`on_relation` +3) · **Étape** : palier +3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : un café loin du stade · **Conditions** : relation.solvang >= 3 ; `statut_ok: [club, rival]` ; variante `_joueur` si role == 'joueur' (« votre contrat a une page trois »)
**SOLVANG** *(agente — sourire — elle pousse une photocopie : une page, un paragraphe entouré)*
« Le contrat que Fardelli vous vend a une page trois, {toi} ; voilà ce qu'elle dit, et voilà ce que vous pouvez en faire. Mon client décide. Moi, je compte. »
← **Je fais jouer la page trois** — effets : caisse ++, direction +, set: page_trois_solvang, relation.fardelli −1 — *Fardelli l'apprend au fax. Il l'avait écrite lui-même, en 1990.*
→ **Je la garde pour plus tard** — effets : direction +, set: page_trois_solvang, relation.solvang +1 — *Elle sourit. Plus tard, c'est son métier.*
**Traces** : page_trois_solvang · **Réactions déclenchées** : — · **Lu plus tard par** : ds.fax variante « la page trois » (ch. 12, lit aussi `mbako_vendu`), jp.clause variante (ch. 10), co.retrouvailles.fardelli_noir (le contrat qu'il n'a pas relu), une.quotidien.page_trois (ch. 20)

**Retrouvailles** — `co.retrouvailles.solvang_sourire` (≥ +2) : Solvang, un dossier fin : « Nouveau bureau, {toi} ; mon client y a une clause, je vous la montre avant qu'on vous la vende. Mon client décide. Moi, je compte. » — un bouton **Montrez** — effets : direction +, relation.solvang +1 — *Elle montre. Tu lis. C'est nouveau.* · `co.retrouvailles.solvang_noir` (≤ −2) : Solvang, sans s'asseoir : « J'ai trois clients dans le nouveau club de {nom}. Ils ont tous une page trois. » — un bouton **Je les lirai** — effets : vestiaire −, direction − — *Ils les ont lues avant toi. C'est elle qui les a écrites.*

---

## NATHALIE VENCE  (`vence`)
**Fonction** : journaliste de terrain de Télé-Stade (« On est en direct »), présentatrice du Plateau (2003), directrice de l'information (2020) · **Genre** : f · **Âge en 1990** : 32 · **Camp** : direction · **Fenêtre** : 1990-2035, puis `retraite` (elle commente encore les finales des Cobalts, sans micro, depuis la tribune de presse) · **Suivant** : « la voix générée d'un ancien joueur » (voix, 2030) ; le stagiaire de l'Écho pour le local
**Tic** : « On est en direct. » — torsions : « On n'est plus en direct. Maintenant, dites-le. » · « On est en direct, et vous aussi. » · « On était en direct. Ça se revoit. »
**Désir** : la phrase de trop, en direct · **Blessure** : elle a fait pleurer un sélectionneur en 1990 et n'a pas aimé ça ; elle recommence chaque fois, pour vérifier
**Adresse** : joueur, joueur_amateur : « {prenom} » / « {prenom} {nom} » / « madame/monsieur {nom} » · entraineur : « {prenom} » / « coach » / « madame/monsieur {nom} » · ds, president, instance : « {prenom} » / « monsieur le président » (le titre exact) / « madame/monsieur {nom} » · selectionneur : « {prenom} » / « monsieur le sélectionneur » / « madame/monsieur {nom} »
**Ce qu'elle pense de toi** : à +2 tu réponds en direct, elle te protège du montage · à 0 tu es un plan de coupe · à −2 tu es la phrase de trop qu'elle attend
**Paliers** : −3 → `co.vence.trahison_en_direct` · +3 → `co.vence.faveur_plateau`
**Dans les rôles** : joueur : la zone mixte, « vous avez vu l'action ? » (1) · entraîneur : « je n'ai pas vu », le mème (1) · DS : la vitre baissée, caméra allumée (0,5) · président : le tweet de 3 h du matin lu à l'antenne, mot pour mot (1) · **sélectionneur : l'interview de l'élimination ; la demande en mariage (si Camille ≥ +2) ; c'est elle qui te tend le micro quand le bus ne descend pas** (2) · instance : le plateau du Congrès, ton vote décrypté par Ménèche à côté d'elle (1)
**Trajectoire** : 1990 la Coupe d'été perdue aux tirs au but, un sélectionneur en larmes · 2000 le Plateau (2003), les consultants, Ménèche à sa droite · 2010 les chaînes de club, elle refuse la chaîne de Capitale FC · 2020 directrice de l'info ; Kick (2024) diffuse ses directs en boucle · 2030 la voix générée la remplace ; elle porte plainte pour rire · 2035 la tribune de presse, sans micro
**Retrouvailles** : `co.retrouvailles.vence_sourire` / `_noir`
**Cartes propres** : *Vous avez vu l'action ?* (ch. 10) · *Je n'ai pas vu* (ch. 11) · *Le tweet lu à l'antenne* (ch. 13) · *L'interview de l'élimination* (ch. 14) · *La demande en mariage* (ch. 14) · *Le plateau est à vous* (ch. 30, Carte Destin consultant) · *Le peuple vous réclame* (ch. 30) · *La phrase de trop* (ci-dessous)

### SCÈNE co.vence.trahison_en_direct  —  La phrase de trop
**Rôle** : joueur | entraineur | president | selectionneur | instance · **Intrigue** : palier (`on_relation` −3) · **Étape** : palier −3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : la zone mixte, le voyant rouge · **Conditions** : relation.vence <= -3 ; `statut_ok: [club]` ; variante `_bus` si `flag('bus_menace')` (« vos joueurs sont restés dans le bus, et vous ? »)
**VENCE** *(Télé-Stade — noir — le micro tenu trop près, elle ne le retire pas)*
« On est en direct, {toi}, et je vous lis ce que vous avez dit hors caméra à mon cadreur. Vous le répétez pour nous ? »
← **Je le répète** — effets : tribunes −−, direction −−, parole −1, set: phrase_de_trop — *Tu le répètes. C'est pire dit calmement.*
→ **Coupez** — effets : tribunes −, direction −, set: phrase_de_trop, relation.vence −1 — *On ne coupe pas. On est en direct : c'est le titre du soir.*
**Traces** : phrase_de_trop · **Réactions déclenchées** : co.re.camille_journal (∃, `!flag('divorce')`) · **Lu plus tard par** : une.generic.la_phrase_de_trop (ch. 20), sl_ennemi_public et in_showman (epitaph_plus, ch. 30), sl.consultant_savonne variante « Vence repasse la phrase » (ch. 14), co.fantome.consultant (ch. 90)

### SCÈNE co.vence.faveur_plateau  —  Le plateau est à vous
**Rôle** : entraineur | selectionneur | president | instance · **Intrigue** : palier (`on_relation` +3) · **Étape** : palier +3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : le couloir des loges, le voyant éteint · **Conditions** : relation.vence >= 3 ; `statut_ok: [club]` ; year >= 2003 (le Plateau existe), sinon variante `_radio` (« la radio du dimanche soir »)
**VENCE** *(Télé-Stade — sourire — elle a coupé le micro elle-même, elle te le montre)*
« Le jour où ça tombe, {toi}, le fauteuil du dimanche est à vous : je vous le garde, sans montage. On est en direct, mais pas ce soir. »
← **Je garde le fauteuil** — effets : tribunes +, direction +, set: plateau_offert, relation.vence +1 — *Elle en parle à Ozanne. Ozanne « voit ça après l'audience ».*
→ **Je ne finirai pas consultant** — effets : vestiaire +, parole +1, set: plateau_offert — *Elle sourit. Ils disent tous ça, et elle les a tous eus.*
**Traces** : plateau_offert · **Réactions déclenchées** : — · **Lu plus tard par** : Carte Destin « Le plateau est à vous » (ch. 30, poids ×2), jp_consultant et en_retraite (epitaph_plus, ch. 30), sl.consultant_savonne variante « c'est toi qui savonnes, maintenant » (ch. 14), une.quotidien.fauteuil_du_dimanche (ch. 20)

**Retrouvailles** — `co.retrouvailles.vence_sourire` (≥ +2) : Vence, caméra baissée : « Nouvelle vie, {toi}, et je suis la première, comme d'habitude. On est en direct : vous voulez dire quelque chose ou on garde ça pour nous ? » — un bouton **Pour nous** — effets : tribunes +, relation.vence +1 — *Elle garde. Le cadreur aussi, il l'aime bien.* · `co.retrouvailles.vence_noir` (≤ −2) : Vence, voyant rouge : « On est en direct devant le nouveau bureau de {nom}, et on a ressorti les images de l'ancien. Vous les commentez ? » — un bouton **Je passe** — effets : tribunes −, direction − — *Les images passent sans toi. Elles ont le son.*

---

## LA PLUME  (`la_plume`)
**Fonction** : journaliste d'investigation sans visage, à La Gazette Rose ; elle n'apparaît que par écrit, quand Parole ≤ −2 ou qu'une trace judiciaire existe ; jamais en première saison · **Genre** : f · **Âge en 1990** : 36 · **Camp** : direction · **Fenêtre** : 1990-2050 (La Plume est une signature, pas une personne ; quand l'une s'arrête, une autre signe ; on ne l'enterre pas, on la relit) · **Suivant** : elle-même
**Tic** : « J'ai les documents. » — torsions : « J'avais les documents. Je les ai donnés. » · « Je n'ai pas les documents. Pas encore. » · « Vous avez les documents. Moi, j'ai les copies. »
**Désir** : que ça sorte · **Blessure** : elle n'a pas de visage parce qu'on lui a cassé le sien en 1988, sur un parking de D2, pour une enveloppe qu'elle avait vue
**Adresse** (par écrit uniquement) : tous rôles : « {prenom} » / « {prenom} {nom} » / « {nom} » ; jamais de titre, jamais « monsieur »
**Ce qu'elle pense de toi** : à +2 tu es une source, donc une adresse qu'elle protège · à 0 tu es un nom dans un tableau · à −2 tu es le titre du prochain dossier
**Paliers** : −3 → `co.la_plume.trahison_documents` · +3 → `co.la_plume.faveur_source`
**Dans les rôles** : joueur : l'enregistrement du bar d'hôtel, les paris (0,5) · entraîneur : le dossier, l'enveloppe (0,5, jamais S0) · DS : les mails, la commission aux îles (0,5) · président : les écoutes, quatre mille pages (1) · **instance : dix-huit millions de pages ; l'hôtel du Lac ; elle et Amsel ne se parlent pas, elles se lisent** (1,5)
**Trajectoire** : 1990 le fax anonyme, le Rosé la protège · 2000 le tabloïd passe au format ; elle refuse la photo · 2010 le Flux : elle ne poste rien, on la cite partout · 2015 la Gazette en ligne, « dix écus par scandale » : c'est son prix · 2020 dix-huit millions de pages, l'hôtel du Lac · 2040 la Gazette n'existe plus ; elle signe dans L'Écho, le dimanche, sous le même nom
**Retrouvailles** : `co.retrouvailles.la_plume_sourire` / `_noir` (par écrit, un mot glissé)
**Cartes propres** : *L'enregistrement* (ch. 10, jp.pari) · *Les mails* (ch. 12) · *Quatre mille pages* (ch. 13, lit `ecoutes`) · *Dix-huit millions de pages* (ch. 15, lit `vote_achete`) · *Ce que le Quotidien n'a pas écrit* (ch. 20, lit `dossier_enterre`) · *La source* (ci-dessous)

### SCÈNE co.la_plume.trahison_documents  —  J'ai les documents
**Rôle** : joueur | entraineur | ds | president | instance · **Intrigue** : palier (`on_relation` −3) · **Étape** : palier −3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière, jamais en S0 (`season >= 1`) · **Lieu** : une enveloppe kraft dans ton casier, sans timbre · **Conditions** : relation.la_plume <= -3 ; variantes lues dans l'ordre : `flag('ecoutes')` → « les transcriptions » ; `flag('vote_achete')` → « les relevés de l'hôtel » ; `flag('offshore')` → « la société des îles » ; `flag('enveloppe_promise')` → « la valise » ; sinon « vos promesses, avec les dates »
**LA PLUME** *(par écrit — noir — une feuille, une ligne, pas de signature ; on sait)*
« J'ai les documents, {toi} : les transcriptions, toutes. Ça sort samedi ; je vous écris pour que vous ne disiez pas que vous ne saviez pas. »
← **Je publie avant elle** — effets : parole −2, tribunes −−, direction −, set: documents_publies — *Ta version sort vendredi. La sienne samedi, avec les pages que tu as sautées.*
→ **J'attends samedi** — effets : parole −2, direction −−, tribunes −, set: documents_publies — *Samedi, le stade lit. Dimanche, il siffle en lisant.*
**Traces** : documents_publies · **Réactions déclenchées** : co.re.josiane_a_lu (∃, si `!seen`) · **Lu plus tard par** : grand_deballage, pr_commission, in_pages (epitaph_plus, ch. 30), in.valises variante « la Gazette a tout » (ch. 15), une.gazette.les_documents (ch. 20, priorité 3), co.amsel.faveur_temoin (ci-dessous : « vous avez lu la Gazette, moi aussi »)

### SCÈNE co.la_plume.faveur_source  —  La source
**Rôle** : entraineur | ds | president | selectionneur | instance · **Intrigue** : palier (`on_relation` +3) · **Étape** : palier +3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière, `season >= 1` · **Lieu** : une cabine, puis un mail (year >= 2000) · **Conditions** : relation.la_plume >= 3
**LA PLUME** *(par écrit — sourire, si une feuille peut sourire — trois lignes cette fois)*
« Vous n'êtes pas le sujet, {toi}, vous êtes la source : je sors le dossier de {rival} samedi, et votre nom n'y est pas. J'ai les documents. »
← **Donnez-moi mes pages** — effets : direction +, tribunes +, set: source_plume, relation.la_plume +1 — *Elle n'a pas de pages sur toi. Elle en aura.*
→ **Ne mêlez pas mon nom à ça** — effets : direction +, parole +1, set: source_plume — *Ton nom n'y est pas. Le dossier sort. {rival} le lit à ta place.*
**Traces** : source_plume · **Réactions déclenchées** : — · **Lu plus tard par** : in.lanceur_alerte variante « la Gazette t'a précédé » (ch. 15, pose `lanceur_alerte`), pr.ecoutes variante « ce sont les écoutes du rival qui sortent » (ch. 13), co.nemesis (ch. 90 : le rival devient Nemesis), une.gazette.la_source (ch. 20)

**Retrouvailles** — `co.retrouvailles.la_plume_sourire` (≥ +2) : un mot dans le premier courrier du nouveau bureau : « Bienvenue, {toi}. Le tiroir du bas a un double fond ; j'ai les documents de celui d'avant, pas encore les vôtres. » — un bouton **Je regarde le tiroir** — effets : direction +, relation.la_plume +1 — *Le double fond est vide. Elle a déjà tout.* · `co.retrouvailles.la_plume_noir` (≤ −2) : un mot, même papier : « Nouveau bureau, même {nom}. J'ai les documents, et j'ai maintenant une adresse où les envoyer. » — un bouton **Qu'elle envoie** — effets : direction −, tribunes − — *Elle envoie. Au journal, pas à toi.*

---

## LUCIEN BARBIER  (`barbier`)
**Fonction** : recruteur de Valdorne, « le type en doudoune » · **Genre** : m · **Âge en 1990** : 58 · **Camp** : direction · **Fenêtre** : 1990-2006, puis `retraite` (bénévole à Trébignac : il regarde les moins de treize ans sous la pluie) ; meurt en 2021, au bord d'un terrain de District, on a fini le match · **Suivant** : « l'algorithme » (2008), puis « le modèle » (2015), qui n'ont jamais vu personne jouer sous la pluie
**Tic** : « Je l'ai vu jouer sous la pluie. » — torsions : « Je l'ai vu jouer au sec. Ça ne compte pas. » · « L'algorithme ne l'a jamais vu sous la pluie. » · « Je ne l'ai pas vu jouer. Je l'ai vu s'échauffer, ça m'a suffi. »
**Désir** : trouver le dernier grand · **Blessure** : celui qu'il a raté : un gardien de Néville qui avait dix-sept ans en 1979, dit la légende, et qui s'appelait Vecchio
**Adresse** (sourire / neutre / noir) : joueur_amateur, joueur : « petit » / « {prenom} » / « {nom} » · entraineur : « petit » / « coach » / « {nom} » · ds : « petit » / « patron » / « monsieur {nom} » (il déteste dire « monsieur ») · president_amateur : « petit » / « président » / « {nom} »
**Ce qu'il pense de toi** : à +2 tu regardes les matchs jusqu'au bout, donc tu vaux quelque chose · à 0 tu lis les rapports · à −2 tu lis les chiffres, et il écrit « trop lent » sur les tiens
**Paliers** : −3 → `co.barbier.trahison_trop_lent` · +3 → `co.barbier.faveur_sous_la_pluie`
**Dans les rôles** : **joueur amateur : la doudoune au bord du terrain ; « Je bosse pour Valdorne. Il y a un essai mardi. » (Carte Destin, 1,5)** · joueur pro : le rapport qui dit « trop lent » (0,5) · entraîneur : le recruteur qui a vu un gamin, et qui te le dit avant Fardelli (0,5) · **DS : ton chef du recrutement ; l'œil contre l'algorithme, chaque fenêtre (2)** · président amateur : l'indemnité de formation, quinze mille francs et une caisse de vin (1)
**Trajectoire** : 1990 la doudoune, le carnet, les pluies · 2000 il refuse le portable ; Valdorne lui donne un stagiaire, qui devient l'algorithme · 2006 la retraite ; Trébignac, bénévole · 2010 il dit du modèle qu'il « n'a jamais pris froid » · 2021 mort au bord d'un terrain ; l'Almanach : « {annee} : Barbier a vu son dernier gamin. Il pleuvait. »
**Retrouvailles** : `co.retrouvailles.barbier_sourire` / `_noir`
**Cartes propres** : *La doudoune* (ch. 30, Carte Destin amateur → pro) · *Trop lent* (ch. 10) · *L'algorithme contre l'œil* (ch. 12) · *L'indemnité de formation* (ch. 13) · *Le gamin de Néville* (ch. 31, anecdote Vecchio) · *Sous la pluie* (ci-dessous)

### SCÈNE co.barbier.trahison_trop_lent  —  Trop lent
**Rôle** : joueur_amateur | joueur | ds · **Intrigue** : palier (`on_relation` −3) · **Étape** : palier −3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : le parking boueux, la doudoune fermée jusqu'au menton · **Conditions** : relation.barbier <= -3 ; `statut_ok: [club, rival, retraite]` ; variante `_ds` si role == 'ds' (le rapport vise ta recrue)
**BARBIER** *(recruteur — noir — il te tend une feuille, deux mots dessus)*
« Mon rapport dit « trop lent », {toi}, et Valdorne lit mes rapports. Je l'ai vu jouer sous la pluie ; il pleuvait, ça n'a rien changé. »
← **Regardez-moi encore une fois** — effets : tribunes +, direction −, set: rapport_trop_lent, relation.barbier −1 — *Il revient samedi. Il pleut. Il écrit la même chose.*
→ **Gardez votre rapport** — effets : direction −−, caisse −, set: rapport_trop_lent — *Le rapport circule. Fardelli en a une copie ; il vend quand même, moins cher.*
**Traces** : rapport_trop_lent · **Réactions déclenchées** : — · **Lu plus tard par** : Carte Destin amateur → pro variante « Valdorne a lu le rapport » (ch. 30 : l'essai est refusé), jp.pepite P1 variante « trois millions, dit Fardelli ; trop lent, dit Barbier » (ch. 10), ds.algorithme variante (ch. 12), une.echo.trop_lent (ch. 20)

### SCÈNE co.barbier.faveur_sous_la_pluie  —  Sous la pluie
**Rôle** : entraineur | ds | president_amateur · **Intrigue** : palier (`on_relation` +3) · **Étape** : palier +3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : la buvette d'un terrain de District, un café qui fume · **Conditions** : relation.barbier >= 3 ; `statut_ok: [club, staff, retraite]`
**BARBIER** *(recruteur — sourire — il ne te tend rien ; il te dit un nom, une fois, à voix basse)*
« Il y a un gamin à Néville que personne n'a vu, {toi}, et je te le donne parce que je n'ai plus de club à qui le donner. Je l'ai vu jouer sous la pluie. »
← **Je le fais signer demain** — effets : caisse −, vestiaire +, force +2, set: gamin_barbier, relation.barbier +1 — *Le gamin signe. Il a seize ans, une mère qui lit les clauses, et un nom que l'Almanach retiendra.*
→ **Je le laisse à Valdorne** — effets : direction +, parole +1, set: gamin_barbier — *Valdorne ne l'a jamais vu. Il signe à {rival}, sous la pluie.*
**Traces** : gamin_barbier · **Réactions déclenchées** : en.re.fardelli_numero (∃, si role == 'entraineur') · **Lu plus tard par** : ds.mercato fenêtre d'été variante « la recrue gratuite » (ch. 12), en.prodige variante « le second prodige » (ch. 11, `if: flag('gamin_barbier') && flag('mbako_vendu')`), pr.indemnite_formation variante (ch. 13), co.nv.2021_barbier (ch. 31 : l'enterrement, « le gamin y était »)

**Retrouvailles** — `co.retrouvailles.barbier_sourire` (≥ +2, `statut_ok: [club, retraite]`) : Barbier, à la grille, doudoune ouverte : « Nouveau club, {toi} ; j'ai regardé ta réserve hier, sous la pluie, il y en a un. Je l'ai vu jouer sous la pluie, je ne dis pas ça pour tout le monde. » — un bouton **Lequel ?** — effets : vestiaire +, relation.barbier +1 — *Il dit le numéro. Pas le nom : il ne les retient pas.* · `co.retrouvailles.barbier_noir` (≤ −2) : Barbier, sans s'arrêter : « On m'a demandé un rapport sur {nom}. J'ai écrit ce que j'avais vu. Sous la pluie. » — un bouton **Et alors ?** — effets : direction − — *Deux mots. Les mêmes qu'avant.*

---

## HUBERT MALBEC  (`malbec`)
**Fonction** : président du Racing de Valentienne (1990-2008), président de la Ligue (2008-2020), candidat à la Fédération (2016) · **Genre** : m · **Âge en 1990** : 54 · **Camp** : direction (bande `instances` de 2008 à 2020) · **Fenêtre** : 1990-2020, puis `retraite` (il siège au Congrès comme président d'honneur, il compte les voix des autres) ; meurt en 2033 · **Suivant** : Bréhaut à la Ligue (2020), puis Nassir (2028) ; à Valentienne, « le fils Malbec » (voix)
**Tic** : « Entre présidents, on se comprend. » — torsions : « Entre présidents, on se comprenait. » · « Entre présidents, on ne se comprend pas : on se compte. » · « Vous n'êtes plus président. On ne se comprend plus. »
**Désir** : la Ligue, puis la Fédération, sans passer par les districts · **Blessure** : Aulard lui a pris un entraîneur (1994) et une élection (2008) ; il a gardé les deux lettres
**Adresse** (sourire / neutre / noir) : entraineur, selectionneur : « cher {prenom} » / « coach » / « monsieur » · joueur : « petit » / « {nom} » / « monsieur » · ds : « cher {prenom} » / « monsieur le directeur » / « monsieur » · president, president_amateur, instance : « cher {prenom} » / « cher collègue » / « monsieur » (à −2 le « monsieur » n'a pas de nom derrière : tu n'existes pas)
**Ce qu'il pense de toi** : à +2 tu es un président avec qui l'on se comprend · à 0 tu es une voix · à −2 tu es la créature d'Aulard, même si tu ne l'as jamais rencontré
**Paliers** : −3 → `co.malbec.trahison_denonce` · +3 → `co.malbec.faveur_ma_voix`
**Dans les rôles** : entraîneur : le président qui te débauche à mi-saison, « Valentienne a un banc froid et un contrat chaud » (0,5) · DS : le club qui offre 25 millions pour ton capitaine (1) · **président : ton égal, ton allié pour la répartition des droits, ton rival pour l'enveloppe côté adverse ; s'il lit `enveloppe_promise`, c'est lui que trois de ses joueurs ont trahi** (2) · sélectionneur : il veut son joueur dans la liste, et il a la voix de Valentienne au Congrès (0,5) · **instance : président de la Ligue, candidat contre toi en 2016 ; battu, il t'attend en 2020** (1,5)
**Trajectoire** : 1990 la tribune la plus froide du pays, un président qui ne l'est pas · 1998 Aulard prend la Ligue ; il attend dix ans · 2008 la Ligue ; il perd la Fédération contre Aulard, il garde la lettre · 2016 candidat contre toi ou élu par défaut · 2020 président d'honneur ; il compte à voix haute · 2033 l'enterrement ; Aulard est déjà mort, il a gagné ça
**Retrouvailles** : `co.retrouvailles.malbec_sourire` / `_noir`
**Cartes propres** : *Le banc froid* (ch. 11) · *Vingt-cinq millions* (ch. 12) · *Les droits télé : les petits ou les gros ?* (ch. 13) · *L'enveloppe côté adverse* (ch. 13, lit `enveloppe_promise`) · *Son joueur dans la liste* (ch. 14) · *Le candidat contre toi* (ch. 15) · *Revenez au quotidien* (ch. 30, Carte Destin sélectionneur → club) · *Ma voix* (ci-dessous)

### SCÈNE co.malbec.trahison_denonce  —  Entre présidents
**Rôle** : entraineur | ds | president | instance · **Intrigue** : palier (`on_relation` −3) · **Étape** : palier −3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : le salon de la Ligue, café froid · **Conditions** : relation.malbec <= -3 ; `statut_ok: [club, rival, retraite]` ; variante `_enveloppe` si `flag('enveloppe_promise')` (il a le nom des trois joueurs), sinon il dépose ta lettre de la Commission au Congrès
**MALBEC** *(président — noir — il pose une chemise cartonnée, il ne l'ouvre pas)*
« Entre présidents, on se comprend, {toi} : j'ai déposé votre dossier à la Fédération ce matin, avec les pièces. Vous comprendrez. »
← **Quelles pièces ?** — effets : direction −−, tribunes −, set: malbec_denonce, set: fede_dossier — *Il ouvre la chemise. Tu reconnais ta signature, et une date.*
→ **Déposez, je n'ai rien caché** — effets : direction −, parole +1, set: malbec_denonce, set: fede_dossier, relation.malbec −1 — *Dauzat accuse réception. Il accuse toujours réception.*
**Traces** : malbec_denonce (et `fede_dossier`, transversale n° 34, posée ici aussi) · **Réactions déclenchées** : co.re.dauzat_pv (§ 6) · **Lu plus tard par** : en.commission_discipline variante « Malbec a parlé » (ch. 11), in.dossier (ch. 15, lit `fede_dossier`), une.quotidien.entre_presidents (ch. 20), in_defiance (epitaph_plus « le bloc Malbec », ch. 30)

### SCÈNE co.malbec.faveur_ma_voix  —  Ma voix, et celle du Nord
**Rôle** : president | selectionneur | instance · **Intrigue** : palier (`on_relation` +3) · **Étape** : palier +3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : la tribune de la Fosse, deux degrés, il t'a prêté une écharpe · **Conditions** : relation.malbec >= 3 ; `statut_ok: [club, rival, retraite]`
**MALBEC** *(président — sourire — il parle en regardant le terrain, pas toi)*
« Vous aurez ma voix au Congrès, {toi}, et celle du Nord vote comme moi depuis vingt ans. Entre présidents, on se comprend. »
← **Je compte sur vous** — effets : direction ++, set: voix_malbec, relation.malbec +1 — *Il compte pour toi. C'est la première fois qu'il compte pour quelqu'un.*
→ **Je ne veux rien devoir** — effets : direction +, parole +1, set: voix_malbec — *Il vote quand même. Il te le rappellera.*
**Traces** : voix_malbec · **Réactions déclenchées** : — · **Lu plus tard par** : Carte Destin président pro → Fédération (ch. 30 : « trois alliés » ; `voix_malbec` en compte deux), in.election variante « le Nord vote » (ch. 15), pr.president_ami variante (ch. 13, lit `president_ami` : « Aulard ou Malbec, il faut choisir »), une.quotidien.le_nord_a_vote (ch. 20)

**Retrouvailles** — `co.retrouvailles.malbec_sourire` (≥ +2) : Malbec, une écharpe de Valentienne pliée : « Nouveau bureau, {toi}, et le mien est en face. Entre présidents, on se comprend ; entre voisins, on déjeune. » — un bouton **Jeudi** — effets : direction +, relation.malbec +1 — *Jeudi. Il paie. Il note qu'il a payé.* · `co.retrouvailles.malbec_noir` (≤ −2) : Malbec, au Congrès, sans se lever : « Le nom de {nom} sur une porte. Entre présidents, on se comprend ; vous, je ne vous ai jamais compris. » — un bouton **Ça viendra** — effets : direction −, relation.malbec −1 — *Ça ne vient pas. Il vote contre par habitude.*

---

## DON ALVARO MONTOYA  (`montoya`)
**Fonction** : président du Real Montoya (Castellane), le géant qui a tout gagné et perd de l'argent ; le patron des douze · **Genre** : m · **Âge en 1990** : 60 · **Camp** : direction · **Fenêtre** : 1990-2027, meurt en 2027 à la table, pendant un vote · **Suivant** : « le fils de Montoya » (voix), qui reprend « la table » et y ajoute une chaise
**Tic** : « Douze clubs. Une table. Vous êtes assis ou debout ? » — torsions : « Onze clubs. Une table. Il manque une chaise. » · « Vous étiez assis. Vous êtes debout. » · « Une table. Douze chaises. Aucun club. » (2019, les 48 heures)
**Désir** : la Ligue fermée · **Blessure** : son club a tout gagné et perd de l'argent ; son père a vendu la première table, celle du café où le club est né
**Adresse** (sourire / neutre / noir) : president, instance : « ami » / « président » / « monsieur » · entraineur : « ami » / « míster » / « monsieur » · joueur : « chico » / « {nom} » / « monsieur » · autres rôles : il ne parle pas (« Montoya ne parle pas aux gens qui n'ont pas de chaise »)
**Ce qu'il pense de toi** : à +2 tu es assis · à 0 tu es debout · à −2 tu n'es pas dans la pièce
**Paliers** : −3 → `co.montoya.trahison_debout` · +3 → `co.montoya.faveur_assis`
**Dans les rôles** : joueur : le transfert du siècle, un pont (0,5) · entraîneur : le Real Montoya t'appelle à mi-saison, la veille d'un derby (0,5) · **président : « Assis ou debout ? » ; les 48 heures ; s'il lit `ligue_fermee_signee`, tu es assis, et il te le rappelle à chaque Nouvelle de mépris** (1) · **instance : le bloc des douze contre l'Union ; à l'hôtel du Lac il a une suite, tu as une chambre** (1)
**Trajectoire** : 1990 douze clubs, une idée · 2000 les droits, la Coupe Continentale trop petite pour lui · 2010 la multi-propriété, le club frère · 2019 les 48 heures ; six clubs tiennent, ou aucun · 2027 il meurt à la table, en votant ; son fils prend la chaise encore chaude · 2040 la loi des franchises est sa table, sans lui
**Retrouvailles** : `co.retrouvailles.montoya_sourire` / `_noir` (le fils, après 2027)
**Cartes propres** : *Le transfert du siècle* (ch. 10) · *Le Real appelle* (ch. 11) · *Les 48 heures* (ch. 13, huit scènes de six heures) · *Le bloc des douze* (ch. 15) · *Assis ou debout ?* (ch. 30, Carte Destin président → Union) · *Le vote de trop* (ch. 31, 2027) · *Debout* (ci-dessous)

### SCÈNE co.montoya.trahison_debout  —  Debout
**Rôle** : president | instance · **Intrigue** : palier (`on_relation` −3) · **Étape** : palier −3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : la salle de la table ; ta chaise n'y est plus · **Conditions** : relation.montoya <= -3 ; `statut_ok: [club, rival]` ; year >= 2010 (l'ère des fonds), sinon variante `_coupe` (« votre club ne jouera plus nos amicaux »)
**MONTOYA** *(président — noir — il compte les chaises du doigt, à voix haute)*
« Onze clubs, une table, et il manque une chaise : la vôtre, {toi}. Vous êtes debout, et vous le resterez. »
← **Je reste debout** — effets : direction −, tribunes ++, set: exclu_de_la_table — *Gégé t'applaudit sous les fenêtres. Le Quotidien parle de « courage ». La Gazette, de « chaise ».*
→ **Je rachète une chaise** — effets : caisse −−−, direction +, set: exclu_de_la_table, relation.montoya −1 — *Il vend la chaise. Elle est plus chère que le club.*
**Traces** : exclu_de_la_table · **Réactions déclenchées** : — · **Lu plus tard par** : pr.ligue_fermee cartes de mépris variante « tu n'étais même pas à la table » (ch. 13, lit `ligue_fermee_signee`), in.bloc_des_douze variante (ch. 15), une.quotidien.debout (ch. 20), pr_siege (epitaph_plus, ch. 30)

### SCÈNE co.montoya.faveur_assis  —  Assis
**Rôle** : president | instance · **Intrigue** : palier (`on_relation` +3) · **Étape** : palier +3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : sa suite à l'hôtel du Lac ; une chaise vide, à sa droite · **Conditions** : relation.montoya >= 3 ; `statut_ok: [club, rival]`
**MONTOYA** *(président — sourire — il tire la chaise lui-même)*
« Douze clubs, une table, et la chaise à ma droite est à vous, {toi} : elle mène à l'Union sans passer par les districts. Assis ? »
← **Assis** — effets : direction ++, tribunes −−, set: chaise_montoya, relation.montoya +1 — *Tu t'assieds. Gégé l'apprend par la Gazette, avec une photo de la chaise.*
→ **Debout, mais merci** — effets : tribunes +, direction −, set: chaise_montoya — *Il laisse la chaise vide. Il ne la donne à personne d'autre.*
**Traces** : chaise_montoya · **Réactions déclenchées** : co.re.gege_decoupe (∃, ← seulement) · **Lu plus tard par** : Carte Destin président pro → Union Continentale « la voie ligue fermée » (ch. 30 : `chaise_montoya` remplace « Montoya à +2 »), in.bloc_des_douze variante « tu as une chaise » (ch. 15), pr.ligue_fermee heure 1 variante (ch. 13), une.gazette.la_chaise (ch. 20)

**Retrouvailles** — `co.retrouvailles.montoya_sourire` (≥ +2 ; après 2027, « le fils de Montoya » lit la même réplique avec « mon père disait ») : Montoya, sans se lever : « Nouveau titre, ami, même table. Douze clubs, une table : votre chaise a suivi. » — un bouton **Je m'assieds** — effets : direction +, relation.montoya +1 — *La chaise a suivi. Elle est un peu plus loin du centre.* · `co.retrouvailles.montoya_noir` (≤ −2) : Montoya, par un émissaire : « Don Alvaro a appris pour {nom}. Il fait dire : douze clubs, une table, et toujours pas de chaise. » — un bouton **Dites-lui que je suis debout** — effets : direction − — *Il le sait. Il a fait retirer la chaise du couloir aussi.*

---

## DUPUIS  (`dupuis`)
**Fonction** : boucher, sponsor du club de village ; « Arena Dupuis » (2015, fortune faite dans les surgelés) · **Genre** : m · **Âge en 1990** : 50 · **Camp** : direction · **Fenêtre** : 1990-2020, puis `retraite` (il vient au stade avec son tablier, par habitude) ; meurt en 2034 · **Suivant** : « le fils de Dupuis » (voix), qui ne voulait pas reprendre la boucherie et qui reprend les surgelés
**Tic** : « Le meilleur du cochon, et je pèse mes mots. » — torsions : « Le meilleur du cochon, et je pèse mes joueurs. » · « Je pèse mes mots. Ils font douze kilos. » · « Le meilleur du surgelé, et je pèse mes mots. » (2015)
**Désir** : son nom dans le dos · **Blessure** : son fils ne veut pas reprendre la boucherie ; il veut jouer, et il joue mal
**Adresse** (sourire / neutre / noir) : joueur_amateur : « petit » / « petit » / « {nom} » · president_amateur, president : « petit » / « président » / « {nom} » · entraineur : « petit » / « coach » / « {nom} » · autres rôles : il ne parle pas
**Ce qu'il pense de toi** : à +2 tu portes son nom dans le dos sans rire · à 0 tu portes son nom · à −2 tu portes un autre nom, et il pèse le sien
**Paliers** : −3 → `co.dupuis.trahison_montbeliac` · +3 → `co.dupuis.faveur_tribune`
**Dans les rôles** : joueur amateur : il paie la tournée, il veut te voir jouer, il veut que son fils joue (1) · entraîneur amateur : le boucher-sponsor, drapeau `boucher_sponsor` (∃, 0,5) · **président amateur : le maillot rose « DUPUIS », cinq mille francs ; il veut choisir le capitaine ; son fils dans l'équipe première** (2) · président pro : « Arena Dupuis », dix millions d'écus, un nom de stade qui sent le cochon (0,5)
**Trajectoire** : 1990 le maillot rose, la boucherie sur la place · 2000 les surgelés, le camion, le premier million · 2015 Arena Dupuis ; Gégé refuse de prononcer le nom · 2020 il cède au fils ; le fils enlève « cochon » de l'enseigne · 2034 l'enterrement ; le club joue en rose ce jour-là, par respect ou par contrat
**Retrouvailles** : `co.retrouvailles.dupuis_sourire` / `_noir`
**Cartes propres** : *Le maillot rose* (ch. 13, PA-03) · *Le boucher veut choisir le capitaine* (ch. 13) · *La tournée* (ch. 10) · *Arena Dupuis* (ch. 13, pose `naming_signe` côté amateur devenu pro) · *Le fils qui joue mal* (ch. 10) · *Chez Montbéliac* (ci-dessous)

### SCÈNE co.dupuis.trahison_montbeliac  —  Le cochon change de camp
**Rôle** : joueur_amateur | president_amateur | entraineur · **Intrigue** : palier (`on_relation` −3) · **Étape** : palier −3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : devant la boucherie ; les maillots roses sont dans un carton, sur le trottoir · **Conditions** : relation.dupuis <= -3 ; `statut_ok: [club, rival]`
**DUPUIS** *(boucher — noir — il pousse le carton du pied vers toi)*
« Montbéliac porte mon nom dimanche, {toi}, en vert, ça jure mais ils ont dit merci. Le meilleur du cochon, et je pèse mes mots. »
← **Je vous rachète le carton** — effets : caisse −−, tribunes +, set: dupuis_chez_montbeliac — *Tu joues en rose sans le nom. Le village voit le trou dans le dos.*
→ **Bon appétit à Montbéliac** — effets : caisse −, tribunes −, set: dupuis_chez_montbeliac, relation.dupuis −1 — *Dimanche, Montbéliac gagne en vert et rose. Le maillot est immonde. Il est sur toutes les photos.*
**Traces** : dupuis_chez_montbeliac · **Réactions déclenchées** : — · **Lu plus tard par** : pr.montbeliac variante « ils ont ton sponsor » (ch. 13, thème Montbéliac), une.echo.le_cochon_est_parti (ch. 20), pa_buvette (epitaph_plus « Dupuis pesait ses mots chez le voisin », ch. 30), co.derby amateur variante (ch. 10)

### SCÈNE co.dupuis.faveur_tribune  —  La tribune Dupuis
**Rôle** : president_amateur | president | entraineur · **Intrigue** : palier (`on_relation` +3) · **Étape** : palier +3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : la buvette, un jambon entier sur le comptoir · **Conditions** : relation.dupuis >= 3 ; `statut_ok: [club, rival, retraite]` ; variante `_arena` si year >= 2015 && role == 'president' (« dix millions et le nom »)
**DUPUIS** *(boucher — sourire — il découpe en parlant, il ne se coupe jamais)*
« Je vous paie la tribune, {toi}, en dur, avec des sièges, et je ne demande qu'une plaque. Le meilleur du cochon, et je pèse mes mots : une plaque. »
← **Une plaque, et grande** — effets : caisse ++, tribunes +, set: tribune_dupuis, relation.dupuis +1 — *La plaque fait deux mètres. Elle sent le neuf et le saucisson.*
→ **Une plaque, pas le stade** — effets : caisse +, tribunes ++, set: tribune_dupuis — *Il accepte. Il grave le nom en plus petit que prévu. Un peu.*
**Traces** : tribune_dupuis · **Réactions déclenchées** : — · **Lu plus tard par** : pr.stade variante « la tribune est payée » (ch. 13, remplace `stade_promis`), en.evt.tribune variante « la tribune Nord est neuve, c'est l'autre qui tombe » (ch. 11, ∃ adaptée), co.nv.2015_arena_dupuis (ch. 31, lit aussi `naming_signe`), une.echo.la_tribune_dupuis (ch. 20)

**Retrouvailles** — `co.retrouvailles.dupuis_sourire` (≥ +2) : Dupuis, un colis sous vide : « Nouveau club, {toi}, et le boucher d'ici est un incapable ; je vous livre le dimanche. Le meilleur du cochon, et je pèse mes mots. » — un bouton **Livrez** — effets : vestiaire +, relation.dupuis +1 — *Il livre. Le vestiaire mange mieux qu'à la capitale.* · `co.retrouvailles.dupuis_noir` (≤ −2) : Dupuis, au téléphone du magasin : « On m'a dit pour {nom}. Je pèse mes mots : bon débarras, et j'ai mis le maillot au congélateur. » — un bouton **Gardez-le au frais** — effets : tribunes − — *Il le garde. Il le ressortira pour Montbéliac.*

---

### 4.2 Les instances : la mairie, la Fédération, l'Union, la FédéMonde, la justice, le sifflet, le village

## MADAME AUBERT  (`aubert`)
**Fonction** : maire d'Aubérive (1990-1997), députée (1997-2002), ministre des Sports (2002-2012), puis présidente de région (2012-2030) · **Genre** : f · **Âge en 1990** : 46 · **Camp** : instances · **Fenêtre** : 1990-2030, puis `retraite` (elle inaugure encore, sans ruban) ; meurt en 2043 · **Suivant** : « le nouveau maire » (voix), qui veut son fils à lui dans l'équipe ; « le ministre », sans nom, après 2012
**Tic** : « Le stade, c'est de l'argent public. » — torsions : « Le ministère, c'est de l'argent public aussi. » · « Le stade, c'est de l'argent public. Le vestiaire, non : je n'y entre pas. » · « Ce n'était pas de l'argent public. C'était le mien. » (le palier +3)
**Désir** : être réélue ; un club qui gagne sans coûter · **Blessure** : son fils joue mal et veut jouer ; elle l'a fait titulariser une fois, il a raté un penalty décisif, elle a perdu cent voix
**Adresse** : « madame/monsieur {nom} » sur les trois visages, dans tous les rôles (elle ne tutoie personne, elle ne prénomme personne ; à −2 elle ajoute le titre : « monsieur {nom}, sélectionneur »)
**Ce qu'elle pense de toi** : à +2 tu es un dossier qui rapporte des voix · à 0 tu es un dossier · à −2 tu es une ligne budgétaire qu'elle va supprimer en séance
**Paliers** : −3 → `co.aubert.trahison_subvention` · +3 → `co.aubert.faveur_ministere`
**Dans les rôles** : joueur amateur : la mairie prête le terrain, et le reprend pour la fête de la ville (0,5) · entraîneur : la D2 et la mairie, la tribune vétuste (∃ `en.evt.tribune`, 0,5) · **président amateur : la subvention, la fusion avec Montbéliac, le synthétique contre le nom de la ville et son fils** (2) · président pro : le stade dont tu seras locataire, dont elle choisit le nom (1) · **sélectionneur : la ministre veut venir dans le vestiaire ; l'hymne ; le fils du ministre est le sien** (1, year 2002-2012) · **instance : la tutelle (2013 est le ministre suivant, mais c'est son dossier) ; « une amie précieuse ou une ennemie mortelle »** (1)
**Trajectoire** : 1990 le ruban, la subvention, la buvette de Portclair (Nouvelle 1992) · 1997 députée ; le Grand Stade de la capitale · 2002 ministre (`aubert_ministre`) ; elle entre dans le vestiaire des Cobalts, une fois · 2012 la région ; les stades locatifs · 2030 la retraite ; son fils est président de Fontaine, il joue toujours mal · 2043 l'enterrement au stade des Eaux-Vives, argent public
**Retrouvailles** : `co.retrouvailles.aubert_sourire` / `_noir`
**Cartes propres** : *Le synthétique* (ch. 13) · *La fusion* (ch. 13, pose `fusion_signee`) · *Le stade dont tu seras locataire* (ch. 11, ∃ ; ch. 13) · *La ministre dans le vestiaire* (ch. 14, lit `aubert_ministre`) · *La tutelle* (ch. 15) · *Le Ministre* (ch. 30, fin) · *La subvention* (ci-dessous)

### SCÈNE co.aubert.trahison_subvention  —  Argent public
**Rôle** : president_amateur | president | entraineur | selectionneur | instance · **Intrigue** : palier (`on_relation` −3) · **Étape** : palier −3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : la salle du conseil ; elle lit, elle ne te regarde pas · **Conditions** : relation.aubert <= -3 ; `statut_ok: [club, rival, staff]` ; variantes : role in ['selectionneur','instance'] && year >= 2002 → « le ministère retire son soutien » ; sinon la subvention
**AUBERT** *(maire — noir — elle lit une délibération, ton nom est à la ligne quatre)*
« La subvention est supprimée à l'unanimité moins une voix, madame ou monsieur {nom}, et le terrain revient à la ville en juin. Le stade, c'est de l'argent public. »
← **Je conteste en séance** — effets : caisse −−, direction −−, tribunes +, set: subvention_coupee — *Tu parles six minutes. Elle en note deux, pour le procès-verbal.*
→ **On jouera sans la ville** — effets : caisse −−, tribunes ++, set: subvention_coupee, relation.aubert −1 — *Le rugby récupère le terrain à la rentrée. Vous jouez chez Boisnoir.*
**Traces** : subvention_coupee · **Réactions déclenchées** : — · **Lu plus tard par** : pa_subvention et pr_mairie (epitaph_plus, ch. 30), pr.terrain_rugby variante (ch. 13), sl.ministre variante « le ministère ne paie plus les charters » (ch. 14, lit `aubert_ministre`), une.echo.argent_public (ch. 20)

### SCÈNE co.aubert.faveur_ministere  —  Le ministère aussi
**Rôle** : president_amateur | president | selectionneur | instance · **Intrigue** : palier (`on_relation` +3) · **Étape** : palier +3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : son bureau, un ruban coupé encadré au mur · **Conditions** : relation.aubert >= 3 ; `statut_ok: [club, rival, staff]` ; variante `_ministre` si year >= 2002 && year < 2012 (la subvention nationale), sinon la subvention communale doublée
**AUBERT** *(maire — sourire — le seul sourire qu'elle ait ; il est court)*
« J'ai inscrit votre club au budget de l'an prochain, madame ou monsieur {nom}, avant le vote et sans contrepartie. Le stade, c'est de l'argent public, et j'en dispose. »
← **J'accepte, venez en tribune** — effets : caisse +++, direction +, set: aubert_soutien, relation.aubert +1 — *Elle vient. Elle compte les sièges vides, pour l'an prochain.*
→ **Sans contrepartie ?** — effets : caisse ++, parole +1, set: aubert_soutien — *Vraiment. Son fils ne joue pas. Elle a écrit « sans contrepartie » au stylo, et signé.*
**Traces** : aubert_soutien · **Réactions déclenchées** : — · **Lu plus tard par** : pr.fusion variante « la mairie est de ton côté » (ch. 13), in.tutelle variante « la ministre te couvre » (ch. 15, lit `aubert_ministre`), fin *Le Ministre* (ch. 30 : `aubert_soutien` remplace « Aubert à +2 »), une.echo.la_mairie_paie (ch. 20)

**Retrouvailles** — `co.retrouvailles.aubert_sourire` (≥ +2) : Aubert, par lettre à en-tête : « Vos nouvelles fonctions, madame ou monsieur {nom}, m'ont été signalées ; ma porte vous reste ouverte, aux heures d'ouverture. Le stade, c'est de l'argent public. » — un bouton **Je prends rendez-vous** — effets : direction +, relation.aubert +1 — *Le rendez-vous est dans trois semaines. Elle le tient à la minute.* · `co.retrouvailles.aubert_noir` (≤ −2) : Aubert, même en-tête : « J'ai appris la nomination de {nom}. J'ai demandé à mes services de ressortir le dossier du stade. Le stade, c'est de l'argent public. » — un bouton **Qu'ils ressortent** — effets : direction −, caisse − — *Ils ressortent. Le dossier a grossi depuis.*

---

## NOËL LEGRUET  (`legruet`)
**Fonction** : président de la Fédération (1988-2008), président de l'Union Continentale (2008-2016) · **Genre** : m · **Âge en 1990** : 63 · **Camp** : instances · **Fenêtre** : 1990-2016, puis `retraite` (il vient au Congrès, il « verra ça après ») ; meurt en 2029 ; l'enterrement est un Congrès · **Suivant** : Aulard (2008), puis toi ; à l'Union, « le dauphin »
**Tic** : « On verra ça après le Congrès. » — torsions : « Le Congrès, c'est demain. » · « On a vu ça après le Congrès. On n'a rien vu. » · « Il n'y a plus de Congrès. On verra ça après. »
**Désir** : rester, nommer, être aimé des districts · **Blessure** : il n'a jamais gagné une élection de plus de dix voix ; il compte les districts la nuit
**Adresse** : entraineur, joueur : `characters.yaml` · joueur_amateur : « mon petit » / « monsieur {nom} » / idem · ds, president, president_amateur : « cher {prenom} » / « cher président » / « monsieur {nom} » · selectionneur : « cher {prenom} » / « monsieur le sélectionneur » / « monsieur {nom} » · instance : « cher {prenom} » / « cher collègue » / « monsieur {nom} »
**Ce qu'il pense de toi** : à +2 tu es une voix qu'il a, et un poste qu'il te donne · à 0 tu es « après le Congrès » · à −2 tu es quelqu'un dont il annonce le départ avant de le lui dire
**Paliers** : −3 → `co.legruet.trahison_avant_toi` · +3 → `co.legruet.faveur_les_districts`
**Dans les rôles** : joueur : la sélection, la liste des 26 ; s'il lit `selection_refusee`, il commence à −1 et le dit (« on ne dit pas non deux fois ») (0,5) · entraîneur : le diplôme, la dérogation, salle 3 (0,5) · président : une voix contre toi au Congrès, avec le sourire (0,5) · **sélectionneur : celui qui te nomme (« Le Congrès, c'est demain. ») et qui te lâche (« Minuit et une ») ; s'il lit `fede_dossier`, il te lâche plus tôt** (2) · **instance : ton prédécesseur (`heritage_empoisonne` : on ouvre ses tiroirs), ton mentor (il te donne les districts) ou ton adversaire (il vise l'Union et te laisse la Fédération vide)** (1,5)
**Trajectoire** : 1990 la Fédération, les districts, sept voix · 2000 réélu de neuf ; le Mondial 1998 est « le sien » · 2008 l'Union, de neuf voix encore ; Aulard prend la Fédération · 2016 la retraite ; il vient au Congrès en spectateur, on le laisse parler · 2029 l'enterrement ; trois cents districts, une voix chacun · L'Almanach : « {annee} : Legruet est mort. On verra ça après le Congrès. »
**Retrouvailles** : `co.retrouvailles.legruet_sourire` / `_noir`
**Cartes propres** : *Le diplôme* (ch. 11) · *La liste des 26* (ch. 10) · *Le Congrès, c'est demain* (ch. 30, Carte Destin entraîneur → sélectionneur) · *Minuit et une* (ch. 14, fin) · *Le fils du ministre* (ch. 14) · *Les tiroirs du prédécesseur* (ch. 15, `heritage_empoisonne`) · *La voie de la légende* (ch. 30, Carte Destin joueur → Fédération) · *Avant toi* (ci-dessous)

### SCÈNE co.legruet.trahison_avant_toi  —  Annoncé avant toi
**Rôle** : entraineur | selectionneur | instance | joueur · **Intrigue** : palier (`on_relation` −3) · **Étape** : palier −3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : la télé du couloir ; Vence parle, Legruet est à côté d'elle · **Conditions** : relation.legruet <= -3 ; `statut_ok: [club, retraite]` ; variante `_joueur` si role == 'joueur' (« il n'est pas dans la liste, et il l'apprend avec vous »)
**LEGRUET** *(Fédération — noir — à l'écran, il regarde la caméra, pas toi)*
« La Fédération annonce qu'elle se séparera de son sélectionneur après le tournoi, monsieur {nom} l'a appris comme vous. On verra ça après le Congrès. »
← **Je démissionne ce soir** — effets : direction −−, tribunes +, parole +1, set: annonce_avant_toi — *Ta lettre arrive après son communiqué. Dauzat les classe dans cet ordre.*
→ **Je reste jusqu'au bout** — effets : direction −−, vestiaire +, set: annonce_avant_toi, relation.legruet −1 — *Tu restes. Le groupe joue pour toi, la Fédération contre.*
**Traces** : annonce_avant_toi · **Réactions déclenchées** : co.re.vence_direct (§ 6) · **Lu plus tard par** : sl_minuit et in_defiance (epitaph_plus, ch. 30), sl.tournoi variante « le groupe sait que tu pars » (ch. 14), in.heritage variante « il l'avait fait à ton prédécesseur » (ch. 15), une.quotidien.annonce_avant_lui (ch. 20)

### SCÈNE co.legruet.faveur_les_districts  —  Les districts
**Rôle** : selectionneur | instance | president · **Intrigue** : palier (`on_relation` +3) · **Étape** : palier +3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : la salle des pas perdus du Congrès, la veille du vote · **Conditions** : relation.legruet >= 3 ; `statut_ok: [club, retraite]`
**LEGRUET** *(Fédération — sourire — il te prend le bras, il ne le fait jamais)*
« Les districts votent comme moi depuis vingt ans, {toi}, et j'ai dit à Roux de voter comme vous. On verra ça après le Congrès : vous l'aurez gagné. »
← **J'accepte les districts** — effets : direction ++, set: districts_legruet, relation.legruet +1 — *Roux transmet. Trois cents voix se déplacent d'un fauteuil.*
→ **Je veux gagner sans héritage** — effets : direction +, parole +1, set: districts_legruet, relation.roux +1 — *Roux vote pour toi quand même. Il dit que c'est son idée.*
**Traces** : districts_legruet · **Réactions déclenchées** : — · **Lu plus tard par** : in.election variante « les districts sont à toi » (ch. 15 : +votes), Battu au Congrès (epitaph_plus « même avec les districts », ch. 30), Carte Destin président amateur → district → Fédération (ch. 30 : `districts_legruet` accélère), co.roux.faveur_siege (ci-dessous, variante « Legruet a parlé »)

**Retrouvailles** — `co.retrouvailles.legruet_sourire` (≥ +2, `statut_ok: [club, retraite]`) : Legruet, une main sur l'épaule : « On m'a dit votre nomination, cher {prenom}, je l'avais prévue. On verra ça après le Congrès : le Congrès, c'est demain, venez dîner. » — un bouton **Je viens** — effets : direction +, relation.legruet +1 — *Le dîner a trente couverts. Tu es à sa droite ; Roux à sa gauche.* · `co.retrouvailles.legruet_noir` (≤ −2) : Legruet, à la tribune du Congrès, sans te nommer : « Un nouveau visage à cette table, celui de monsieur {nom}. On verra ça après le Congrès ; ou pas. » — un bouton **On verra** — effets : direction −, relation.legruet −1 — *La salle rit poliment. Elle vote comme lui.*

---

## GIANCARLO BAMBINI  (`bambini`)
**Fonction** : patron de la FédéMonde (1986-2016) · **Genre** : m · **Âge en 1990** : 58 · **Camp** : instances · **Fenêtre** : 1990-2016, puis `retraite` (il « conseille » ; il est « choqué » à chaque scandale, depuis son salon) ; meurt en 2024, en costume bleu · **Suivant** : « le dauphin » (voix), ou toi (`elu_surprise`)
**Tic** : « Le football unit le monde. Et mes amis. » — torsions : « Le football unit le monde. Mes amis, moins. » · « Le football divise le monde. Mes amis restent. » · « Je suis choqué. Le football unit le monde. »
**Désir** : un Mondial plus gros, un mandat de plus · **Blessure** : il n'a jamais joué ; il a arbitré un match de jeunes et sifflé la fin trop tôt, un gamin pleurait, il a offert un ballon
**Adresse** (sourire / neutre / noir) : instance : « cher ami » / « monsieur le président » / « monsieur » · president, selectionneur : « cher ami » / « cher président » ou « cher sélectionneur » / « monsieur » · autres rôles : il ne parle pas (il ne connaît pas les gens qui ne votent pas)
**Ce qu'il pense de toi** : à +2 tu es un ami, donc une confédération · à 0 tu es un vote · à −2 tu es un scandale dont il est choqué
**Paliers** : −3 → `co.bambini.trahison_choque` · +3 → `co.bambini.faveur_mes_amis`
**Dans les rôles** : président : les 48 heures ; il « est choqué » par la Ligue fermée et signe le communiqué depuis un yacht qui n'est pas le sien (0,5) · sélectionneur : il remet le trophée à côté d'un dictateur ; il te serre la main deux fois pour la photo (0,5) · **instance : le patron (Union : il te tient), le rival (FédéMonde : tu le remplaces), le parrain (il te fait élire et te le rappelle) ; à 79 ans il se représente, contre toi si tu es là** (2)
**Trajectoire** : 1990 le Mondial de 1994, les milliards, le costume · 2000 le Mondial de 2002, « le football unit le monde » gravé dans le hall · 2010 l'attribution du désert (`mondial_desert`), les 48 équipes votées (2017, sans lui, mais c'est son idée) · 2011 se représente à 79 ans · 2016 il « se retire » ; le comité d'éthique le suspend pour « un virement entre amis » (2017) · 2024 l'enterrement, à l'hôtel du Lac ; Amsel est là, à l'heure
**Retrouvailles** : `co.retrouvailles.bambini_sourire` / `_noir`
**Cartes propres** : *Le trophée à côté du dictateur* (ch. 14, temps fort) · *Choqué* (ch. 13, les 48 heures) · *Se représenter à 79 ans* (ch. 15) · *L'ancienne gloire au comité* (ch. 30, Carte Destin sélectionneur → Union) · *Le Parrain* (ch. 30, Destin) · *Mes amis* (ci-dessous)

### SCÈNE co.bambini.trahison_choque  —  Choqué
**Rôle** : instance | president | selectionneur · **Intrigue** : palier (`on_relation` −3) · **Étape** : palier −3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : le plateau de Télé-Stade ; il est en duplex, toi en cabine · **Conditions** : relation.bambini <= -3 ; `statut_ok: [club, retraite]` ; variante `_ligue` si `flag('ligue_fermee_signee')` (« choqué par la Ligue fermée »)
**BAMBINI** *(FédéMonde — noir — le sourire reste, seule la voix change)*
« Je suis choqué, monsieur, par ce que j'apprends de {nom}, et le comité d'éthique l'est aussi. Le football unit le monde. Et mes amis. »
← **Vous saviez avant moi** — effets : direction −−, tribunes +, set: bambini_choque — *Il est « encore plus choqué ». Le comité d'éthique ouvre un dossier à ton nom, à sa demande.*
→ **Je suis choqué aussi** — effets : direction −, tribunes −, parole −1, set: bambini_choque, relation.bambini −1 — *Vous êtes choqués ensemble, en direct. Le mème dure quatre ans.*
**Traces** : bambini_choque · **Réactions déclenchées** : co.re.vence_direct (§ 6) · **Lu plus tard par** : in.campagne variante « ses confédérations votent contre » (ch. 15), une.gazette.choque (ch. 20, priorité 3), in_pantin et in_defiance (epitaph_plus, ch. 30), pr.ligue_fermee heure 6 variante (ch. 13, lit `ligue_fermee_signee`)

### SCÈNE co.bambini.faveur_mes_amis  —  Mes amis sont tes amis
**Rôle** : instance | selectionneur · **Intrigue** : palier (`on_relation` +3) · **Étape** : palier +3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : sa suite à l'hôtel du Lac ; deux présidents de confédération attendent dans le couloir · **Conditions** : relation.bambini >= 3 ; `statut_ok: [club, retraite]`
**BAMBINI** *(FédéMonde — sourire — il ouvre la porte du couloir d'un geste : les deux hommes entrent)*
« Deux confédérations, {toi}, qui votent comme moi depuis vingt ans, et qui voteront comme vous. Le football unit le monde. Et mes amis sont les vôtres. »
← **Je serre les mains** — effets : direction ++, parole −1, set: amis_bambini, relation.bambini +1 — *Tu serres quatre mains. La Plume compte les montres aux poignets.*
→ **Je gagnerai sans vos amis** — effets : direction +, tribunes +, parole +1, set: amis_bambini — *Ils votent quand même pour toi. Ils ne savent pas voter autrement.*
**Traces** : amis_bambini · **Réactions déclenchées** : — · **Lu plus tard par** : in.campagne (ch. 15 : deux confédérations acquises ; `vote_achete` devient inutile ou tentant), in_pantin (epitaph_plus « les amis de Bambini », ch. 30), in.valises variante « les amis sont dans le couloir à six heures » (ch. 15, lit `vote_achete`), une.quotidien.les_amis (ch. 20)

**Retrouvailles** — `co.retrouvailles.bambini_sourire` (≥ +2) : Bambini, deux poignées de main : « Cher ami, un nouveau titre, et toujours le mien à côté sur la photo. Le football unit le monde : dînons. » — un bouton **Dînons** — effets : direction +, relation.bambini +1 — *Le dîner est photographié. Tu es à sa gauche, le dictateur à sa droite.* · `co.retrouvailles.bambini_noir` (≤ −2) : Bambini, par communiqué : « La FédéMonde prend acte de la nomination de {nom}. Le football unit le monde ; il ne choisit pas ses membres. » — un bouton **Je prends acte aussi** — effets : direction − — *Le communiqué a deux lignes. La seconde est « choqué ».*

---

## AURÉLIEN DAUZAT  (`dauzat`)
**Fonction** : secrétaire général de la Fédération (1990-2012), de l'Union (2012-2020), de la FédéMonde (2020-2032) · **Genre** : m · **Âge en 1990** : 44 · **Camp** : instances · **Fenêtre** : 1990-2032, puis `retraite` (il garde les procès-verbaux chez lui, dans l'ordre) ; meurt en 2044, le dernier PV signé de sa main · **Suivant** : « le secrétaire général » (voix), sans nom, dès 2032 ; Josiane tenait les gens, lui tient les pages
**Tic** : « C'est dans le procès-verbal. » — torsions : « Ce n'est pas dans le procès-verbal. Donc ça n'a pas eu lieu. » · « Ce sera dans le procès-verbal. Vous choisissez la formulation. » · « Il n'y a pas de procès-verbal. Il n'y a que moi. »
**Désir** : durer sous tous les présidents · **Blessure** : il ne sera jamais élu, et il le sait mieux que tout le monde ; il s'est présenté une fois, en 1992, au district de sa ville, et a perdu contre Roux
**Adresse** (sourire / neutre / noir) : instance : « cher {prenom} » / « monsieur le président » / « {nom} » · president, selectionneur : « cher {prenom} » / « monsieur le président » ou « monsieur le sélectionneur » / « {nom} » · entraineur, president_amateur : « cher {prenom} » / « monsieur » / « {nom} »
**Ce qu'il pense de toi** : à +2 tu lis les procès-verbaux, donc il te montre la page 41 · à 0 tu es une signature en bas de page · à −2 tu es une ligne qu'il a gardée, avec la date et l'heure
**Paliers** : −3 → `co.dauzat.trahison_proces_verbal` · +3 → `co.dauzat.faveur_page_41`
**Dans les rôles** : entraîneur : la convocation salle 3, l'attente, « on examine » (0,5) · président amateur, président pro : le règlement, page 41 ; la rétrogradation administrative se conteste sur un vice de forme qu'il connaît (1) · sélectionneur : le contrat de minuit et une, qu'il a rédigé et qu'il te lit (1) · **instance : l'homme qui sait tout ; ennemi mortel s'il se retourne ; secrétaire général de l'Union puis de la FédéMonde, il te précède partout et t'y attend** (2)
**Trajectoire** : 1990 le procès-verbal du Congrès, à la main · 2000 il numérote les pages, il ajoute la page 41 · 2008 Aulard le garde ; il garde Aulard · 2012 l'Union : il apprend une langue de plus, celle des valises · 2020 la FédéMonde ; Amsel lui demande les PV, il les donne dans l'ordre · 2032 la retraite ; 2044 mort ; l'Almanach : « {annee} : Dauzat n'est plus dans le procès-verbal. »
**Retrouvailles** : `co.retrouvailles.dauzat_sourire` / `_noir`
**Cartes propres** : *Salle 3* (ch. 11) · *Le contrat de minuit et une* (ch. 14) · *La page 41* (ch. 13) · *Le secrétaire général hostile* (ch. 15, `elu_surprise`) · *Les procès-verbaux d'Amsel* (ch. 15) · *Le procès-verbal* (ci-dessous)

### SCÈNE co.dauzat.trahison_proces_verbal  —  C'est dans le procès-verbal
**Rôle** : president | selectionneur | instance · **Intrigue** : palier (`on_relation` −3) · **Étape** : palier −3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : la salle du comité ; il lit debout · **Conditions** : relation.dauzat <= -3 ; `statut_ok: [club, staff]` ; variantes : `flag('vote_achete')` → « la séance de l'hôtel du Lac » ; `flag('fede_dossier')` → « votre audition » ; sinon « la réunion que vous croyiez informelle »
**DAUZAT** *(secrétaire général — noir — il lit d'une voix égale, page 12, ligne 8)*
« La réunion que vous croyiez informelle, {toi}, a un procès-verbal, et la procureure en a copie depuis ce matin. C'est dans le procès-verbal. »
← **Ce PV est faux** — effets : direction −−, tribunes −, parole −1, set: pv_fuite — *Le PV est vrai. Il a ta signature en bas, et l'heure.*
→ **Je demande la page suivante** — effets : direction −, set: pv_fuite, relation.dauzat −1 — *La page suivante te concerne aussi. Il la lit plus lentement.*
**Traces** : pv_fuite · **Réactions déclenchées** : co.re.dauzat_pv (§ 6) · **Lu plus tard par** : in.valises variante « le PV est chez Amsel » (ch. 15, lit `vote_achete`), co.amsel.trahison_six_heures (ci-dessous : « nous avons le procès-verbal »), une.gazette.le_proces_verbal (ch. 20), in_defiance (epitaph_plus « Dauzat a lu la page 12 », ch. 30)

### SCÈNE co.dauzat.faveur_page_41  —  La page 41
**Rôle** : president_amateur | president | selectionneur | instance · **Intrigue** : palier (`on_relation` +3) · **Étape** : palier +3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : son bureau sans fenêtre ; le règlement ouvert à une page que personne n'ouvre · **Conditions** : relation.dauzat >= 3 ; `statut_ok: [club, staff]`
**DAUZAT** *(secrétaire général — sourire — il pose le doigt sur un alinéa, il ne le lit pas : il te laisse lire)*
« Il y a une page 41 dans le règlement, {toi}, et personne ne la lit ; elle annule un vote pour vice de forme. C'est dans le procès-verbal, quand vous voudrez. »
← **Je garde la page** — effets : direction ++, set: page_41, relation.dauzat +1 — *Il replie le règlement. Il sait que tu sais.*
→ **Je la lis au Congrès** — effets : direction +, tribunes +, parole +1, set: page_41 — *Le Congrès découvre la page 41. Roux la trouve trop longue.*
**Traces** : page_41 · **Réactions déclenchées** : — · **Lu plus tard par** : in.congres variante « le vote de défiance est annulé pour vice de forme » (ch. 15), pr.commission variante « la rétrogradation contestée » (ch. 13, lit `commission_lettre`), in_defiance (epitaph_plus « la page 41 n'a pas suffi », ch. 30), sl.minuit variante « le contrat a une page 41 » (ch. 14)

**Retrouvailles** — `co.retrouvailles.dauzat_sourire` (≥ +2, `statut_ok: [club, staff, retraite]`) : Dauzat, un classeur sous le bras, le bon : « Votre nomination est au procès-verbal, {toi}, page une ; c'est rare. Je vous ai préparé le règlement, avec un signet. » — un bouton **Merci pour le signet** — effets : direction +, relation.dauzat +1 — *Le signet est à la page 41. Évidemment.* · `co.retrouvailles.dauzat_noir` (≤ −2) : Dauzat, même classeur : « La nomination de {nom} est au procès-verbal, avec les votes contre, nominativement. C'est dans le procès-verbal. » — un bouton **Combien de contre ?** — effets : direction − — *Il dit le nombre. Puis les noms. Il connaît les noms.*

---

## MADAME VIALAT  (`vialat`)
**Fonction** : l'Inspecteur de la Commission de Contrôle des Comptes (1989-2033), puis directrice de l'agence de notation (2033-2045) · **Genre** : f · **Âge en 1990** : 45 · **Camp** : instances · **Fenêtre** : 1990-2045, puis `retraite` (elle compte les recettes de la buvette de Trébignac, bénévole, à la ligne) · **Suivant** : « l'algorithme de notation » (voix), qui ne laisse rien passer et ne comprend rien
**Tic** : « Je ne juge pas. Je compte. » — torsions : « J'ai compté. Maintenant, on juge. » · « Je ne compte plus. Je note. » (2033) · « Je ne juge pas. J'ai laissé passer un club, une fois. Je compte depuis. »
**Désir** : un bilan qui tombe juste · **Blessure** : elle a laissé passer un club en 1989 ; il a coulé (Vaucastel, dépôt de bilan 1992) ; elle a la coupure dans son sac
**Adresse** : « madame/monsieur {nom} » sur les trois visages, dans tous les rôles ; à −2 elle ajoute « et votre trésorier »
**Ce qu'elle pense de toi** : à +2 tes chiffres tombent juste, donc elle te prévient de la ligne fausse · à 0 tu es un solde · à −2 tu es deux soldes négatifs de suite, et la lettre est déjà tapée
**Paliers** : −3 → `co.vialat.trahison_recrutement` · +3 → `co.vialat.faveur_ligne_douze`
**Dans les rôles** : entraîneur : le coupable désigné quand la caisse est pleine et les comptes faux (0,5) · **DS : les commissions, la masse salariale ; chaque fenêtre, elle recompte ce que tu as signé** (1,5) · **président : la lettre (`commission_lettre`), le blocage des recrutements, la rétrogradation administrative ; « elle ne juge pas, elle compte » et ça suffit** (2) · instance : l'agence de notation (2033) ; les clubs ont une note, toi aussi (1)
**Trajectoire** : 1990 la calculatrice, la lettre type · 2000 les écus : elle refait tous les bilans à la main · 2009 le fair-play financier de l'Union : « ils comptent comme moi, en plus lent » · 2020 elle rétrograde un club de socios et un club de fonds la même semaine · 2033 l'agence de notation ; elle note Trébignac « AAA, buvette comprise » · 2045 la retraite, la buvette, la ligne
**Retrouvailles** : `co.retrouvailles.vialat_sourire` / `_noir`
**Cartes propres** : *La lettre* (ch. 13, pose `commission_lettre`) · *Le blocage* (ch. 12) · *La rétrogradation administrative* (ch. 13) · *Le coupable désigné* (ch. 11, fin `en_coupable`) · *Le fair-play financier* (ch. 15, lit `club_actif`) · *L'agence de notation* (ch. 15, 2033) · *Ligne douze* (ci-dessous)

### SCÈNE co.vialat.trahison_recrutement  —  Interdit de recruter
**Rôle** : ds | president | entraineur · **Intrigue** : palier (`on_relation` −3) · **Étape** : palier −3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : une lettre recommandée ; Josiane l'a vue avant toi · **Conditions** : relation.vialat <= -3 ; `statut_ok: [club, staff]` ; variante `_actif` si `flag('club_actif')` (« le fonds compte comme vous : mal »)
**VIALAT** *(Inspecteur — noir — la lettre est courte ; elle la lit au téléphone pour être sûre)*
« Votre club est interdit de recrutement jusqu'à nouvel ordre, madame ou monsieur {nom}, et la masse salariale est plafonnée au chiffre de la ligne douze. Je ne juge pas. Je compte. »
← **Je vends pour repasser** — effets : caisse ++, vestiaire −−, tribunes −, set: recrutement_bloque — *Tu vends le meilleur. Elle recompte. C'est juste, à trois mille près.*
→ **Je saisis le Tribunal** — effets : direction −, caisse −, set: recrutement_bloque, relation.vialat −1 — *Le Tribunal siège loin et répond tard. Le mercato ferme avant.*
**Traces** : recrutement_bloque · **Réactions déclenchées** : co.re.josiane_a_vu_le_fax (§ 6) · **Lu plus tard par** : ds.mercato fenêtre suivante variante « aucune offre entrante » (ch. 12), une.gazette.interdit_de_recruter (ch. 20), ds_contrats et pr_commission (epitaph_plus, ch. 30), en.salaires_retard variante « la ligne douze » (ch. 11, lit `salaires_retard`)

### SCÈNE co.vialat.faveur_ligne_douze  —  Ligne douze
**Rôle** : ds | president | president_amateur | instance · **Intrigue** : palier (`on_relation` +3) · **Étape** : palier +3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : le couloir de la Commission ; elle ne s'arrête pas, elle ralentit · **Conditions** : relation.vialat >= 3 ; `statut_ok: [club, staff]`
**VIALAT** *(Inspecteur — sourire, c'est-à-dire un demi-millimètre — sans dossier, sans stylo)*
« Votre ligne douze est fausse, madame ou monsieur {nom}, et la lettre part vendredi si elle l'est encore jeudi. Je ne juge pas. Je compte, et je vous le dis une fois. »
← **Je corrige avant jeudi** — effets : caisse −, direction ++, set: ligne_douze, relation.vialat +1 — *Jeudi, la ligne tombe juste. Vendredi, pas de lettre. Elle ne te regarde pas ; c'est sa façon.*
→ **Ma ligne douze est juste** — effets : direction −, caisse +, parole +1, set: ligne_douze — *Elle recompte. Tu avais raison. Elle t'écrit pour le dire, à la ligne.*
**Traces** : ligne_douze · **Réactions déclenchées** : — · **Lu plus tard par** : pr.commission variante « la lettre n'est jamais partie » (ch. 13 : `ligne_douze` désarme `commission_lettre`), pr_commission (epitaph_plus « elle avait prévenu, une fois », ch. 30), ds.masse_salariale variante (ch. 12), in.agence_notation variante « elle vous note bien » (ch. 15)

**Retrouvailles** — `co.retrouvailles.vialat_sourire` (≥ +2) : Vialat, sans lever la tête de son cahier : « Vos nouveaux comptes sont arrivés avant vous, madame ou monsieur {nom} ; ils sont justes, ce qui m'inquiète. Je ne juge pas. Je compte. » — un bouton **Comptez** — effets : caisse +, relation.vialat +1 — *Elle compte. C'est juste. Elle recommence, pour être sûre.* · `co.retrouvailles.vialat_noir` (≤ −2) : Vialat, une lettre déjà tapée : « La nomination de {nom} a été notée ; les comptes de son prédécesseur aussi. Je ne juge pas. Je compte : deux soldes négatifs. » — un bouton **Je n'y suis pour rien** — effets : caisse −, direction − — *Elle le sait. La lettre est à ton nom quand même : c'est la fonction qui reçoit.*

---

## JUDITH AMSEL  (`amsel`)
**Fonction** : procureure ; les paris, les valises, les écoutes, l'hôtel du Lac · **Genre** : f · **Âge en 1990** : 47 · **Camp** : instances · **Fenêtre** : 1990-2028, puis `retraite` (elle écrit un livre sans nom dedans ; La Plume le commente) ; meurt en 2039 · **Suivant** : « la brigade » (voix), puis « la procureure suivante », qui frappe à sept heures : Amsel disait que c'était trop tard
**Tic** : « Nous avons tout notre temps. » — torsions : « Nous n'avons plus le temps. Vous non plus. » · « J'ai tout mon temps. Vous, six heures. » · « Nous avons eu tout notre temps. Il est six heures. »
**Désir** : un dossier qui tient · **Blessure** : son premier dossier a été classé « par respect pour l'horaire » ; depuis, elle arrive avant l'horaire
**Adresse** : « madame/monsieur {nom} » sur les trois visages ; à +2 elle dit « madame/monsieur {nom}, vous êtes témoin » ; à −2 elle ne dit plus rien : elle lit
**Ce qu'elle pense de toi** : à +2 tu es un témoin, donc quelqu'un qu'elle protège d'un dossier · à 0 tu es un nom dans un dossier qui n'est pas encore le tien · à −2 tu es un dossier, et elle a tout son temps
**Paliers** : −3 → `co.amsel.trahison_six_heures` · +3 → `co.amsel.faveur_temoin`
**Dans les rôles** : joueur : les paris, la brigade, l'enregistrement (0,5) · DS : les fuites, les mails, la société des îles (0,5, lit `offshore`) · **président : les écoutes (`ecoutes`), la valise, la garde à vue de vingt-quatre heures qui « ne juge pas »** (1) · **instance : le raid à l'aube ; elle frappe à l'hôtel du Lac à six heures ; elle et La Plume ne se parlent pas, elles arrivent à la même heure** (1,5)
**Trajectoire** : 1990 les paris d'un match de D2, le premier dossier classé · 2000 les commissions aux îles ; elle apprend le mot « offshore » et ne le prononce jamais · 2010 les écoutes d'un président (le tien, ou celui de {rival}) · 2021 l'hôtel du Lac, six heures, dix-huit chambres · 2028 la retraite ; le livre sans nom · 2039 l'enterrement à sept heures ; tout le monde est en avance
**Retrouvailles** : `co.retrouvailles.amsel_sourire` / `_noir`
**Cartes propres** : *La brigade* (ch. 10, jp.pari) · *Les mails* (ch. 12) · *La garde à vue* (ch. 13, lit `ecoutes`) · *Le raid à l'aube* (ch. 15, lit `vote_achete`) · *Le carnet de Fardelli lu à voix haute* (ch. 15) · *Le lanceur d'alerte* (ch. 15) · *Six heures* (ci-dessous)

### SCÈNE co.amsel.trahison_six_heures  —  Six heures
**Rôle** : president | instance | ds · **Intrigue** : palier (`on_relation` −3) · **Étape** : palier −3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière, `season >= 1` · **Lieu** : la porte d'une chambre d'hôtel, ou de ton bureau ; il fait encore nuit · **Conditions** : relation.amsel <= -3 ; `statut_ok: [club, staff]` ; variantes lues dans l'ordre : `flag('ecoutes')` → « les transcriptions » ; `flag('vote_achete')` → « les relevés de l'hôtel » ; `flag('pv_fuite')` → « le procès-verbal » ; `flag('offshore')` → « la société des îles » ; sinon « un dossier que vous ne connaissez pas encore »
**AMSEL** *(procureure — noir — deux hommes en imperméable derrière elle ; elle n'a pas frappé fort)*
« Il est six heures, madame ou monsieur {nom}, nous avons les transcriptions et un mandat ; nous avons tout notre temps, vous avez le temps de vous habiller. »
← **J'appelle Maître Vidal** — effets : direction −−, tribunes −−, caisse −, set: perquisition — *Maître Vidal arrive à sept heures. Elle avait fini à six heures et demie.*
→ **Je ne dirai rien sans avocat** — effets : direction −−, tribunes −, set: perquisition, relation.amsel −1 — *Tu ne dis rien. Les cartons parlent : il y en a douze.*
**Traces** : perquisition · **Réactions déclenchées** : co.re.josiane_a_lu (∃, si `!seen` : « j'ai rangé les cartons qu'ils ont laissés ») · **Lu plus tard par** : in.valises chaîne (ch. 15 : la perquisition saute une étape), fins judiciaires *Les écoutes*, *La radiation*, *La valise* (ch. 30 : `perquisition` en condition d'entrée), postulat dérivé `le_repenti` (ch. 30), une.gazette.six_heures (ch. 20, priorité 3), co.la_plume.trahison_documents (« elle a les copies, moi les originaux »)

### SCÈNE co.amsel.faveur_temoin  —  Témoin
**Rôle** : president | instance | ds | joueur · **Intrigue** : palier (`on_relation` +3) · **Étape** : palier +3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière, `season >= 1` · **Lieu** : un bureau du tribunal, à l'heure exacte du rendez-vous · **Conditions** : relation.amsel >= 3 ; `statut_ok: [club, staff]`
**AMSEL** *(procureure — sourire, c'est-à-dire qu'elle referme le dossier — un seul dossier sur la table, et ce n'est pas le tien)*
« Vous n'êtes pas un dossier, madame ou monsieur {nom}, vous êtes un témoin, et je vous le propose une fois. Nous avons tout notre temps : le vôtre commence maintenant. »
← **Je témoigne** — effets : direction −, tribunes +, parole +2, set: temoin_amsel, relation.amsel +1 — *Tu témoignes trois heures. Le dossier a un autre nom que le tien ; tu le connais.*
→ **Ni dossier ni témoin** — effets : direction +, set: temoin_amsel — *Elle note. Elle a tout son temps ; elle te le laisse.*
**Traces** : temoin_amsel · **Réactions déclenchées** : — · **Lu plus tard par** : in.lanceur_alerte variante « la procureure t'attend » (ch. 15, pose `lanceur_alerte`), postulat dérivé `le_repenti` variante « le témoin » (ch. 30), pr.ecoutes variante « ce sont celles du rival » (ch. 13, lit `ecoutes`), co.nemesis (ch. 90 : celui que tu as nommé devient Nemesis), une.quotidien.temoin (ch. 20)

**Retrouvailles** — `co.retrouvailles.amsel_sourire` (≥ +2) : Amsel, une carte de visite, à l'heure : « Vos nouvelles fonctions, madame ou monsieur {nom}, font de vous quelqu'un qu'on approche ; voici mon numéro direct. Nous avons tout notre temps. » — un bouton **Je garde la carte** — effets : direction +, relation.amsel +1 — *La carte n'a pas d'adresse. Elle n'en a pas besoin.* · `co.retrouvailles.amsel_noir` (≤ −2) : Amsel, par courrier officiel : « La nomination de {nom} a été portée à ma connaissance. Le dossier reste ouvert. Nous avons tout notre temps. » — un bouton **Moi aussi** — effets : direction − — *Non. Elle, oui.*

---

## COLLINE  (`colline`)
**Fonction** : arbitre de D1 (1990-2001), consultant arbitrage (2001-2008), responsable de l'arbitrage à la Fédération (2008-2027) · **Genre** : m · **Âge en 1990** : 34 · **Camp** : instances · **Fenêtre** : 1990-2027, puis `retraite` (il arbitre des matchs de moins de treize ans, à Trébignac, sans sifflet : il dit « j'ai vu ») ; meurt en 2046 · **Suivant** : « la machine » (2027), « l'arbitre algorithmique » (voix), qui voit tout et ne regarde personne
**Tic** : « J'ai vu. » — torsions : « J'ai vu. Je n'ai rien vu d'autre. » · « Je n'ai pas vu. Je ne siffle pas ce que je n'ai pas vu. » · « La machine a vu. Moi aussi. On n'a pas vu la même chose. »
**Désir** : la finale continentale · **Blessure** : incorruptible dans un monde qui ne l'est pas, ce qui est la blague ; il a sifflé une main en 1996, contre son propre pays, et son propre pays l'a sifflé jusqu'en 2001
**Adresse** (sourire / neutre / noir) : tous rôles : « {prenom} » / « monsieur » / « monsieur » ; il vouvoie tout le monde, y compris sa mère ; à +2 le prénom, et c'est tout ce qu'il donnera jamais
**Ce qu'il pense de toi** : à +2 tu ne lui as jamais rien demandé, donc il te regarde en face · à 0 tu es un banc · à −2 tu lui as demandé quelque chose, une fois, et il l'a noté dans son rapport
**Paliers** : −3 → `co.colline.trahison_rapport` · +3 → `co.colline.faveur_rien`
**Dans les rôles** : joueur : le temps fort, la main qu'il a vue ou pas (1) · entraîneur : le temps additionnel, « il regarde ton banc » (carte-légende, 0,5) · **président : les écoutes : « le désignateur pourrait s'occuper du choix de l'arbitre » — il refuse et te regarde ; s'il lit `enveloppe_refusee`, il te regarde autrement** (0,5) · sélectionneur : l'arbitre de ta finale, celui qui a sifflé contre son pays et qui sifflera contre le tien (0,5) · **instance : responsable de l'arbitrage (2008) ; l'arbitre et la machine (2027) : cent pour cent de justice, zéro pour cent d'émotion, signez** (1)
**Trajectoire** : 1990 le sifflet, la D1, un rapport par match · 1996 la main, contre son pays ; sifflé cinq ans · 2001 quarante-cinq ans, retraite du sifflet ; consultant, il dit « j'ai vu » à la télé · 2008 responsable de l'arbitrage ; le désignateur, c'est lui, et on ne le désigne pas · 2016 la vidéo ; il la regarde comme un adversaire · 2027 la machine ; il refuse de signer, puis signe, puis part
**Retrouvailles** : `co.retrouvailles.colline_sourire` / `_noir`
**Cartes propres** : *La main* (ch. 10, carte-légende) · *Le temps additionnel* (ch. 11, carte-légende, Colline ≥ +2) · *Il refuse et te regarde* (ch. 13, lit `ecoutes`) · *L'arbitre de la finale* (ch. 14) · *L'assistance vidéo* (ch. 15, pose `video_adoptee`) · *L'arbitre et la machine* (ch. 15, 2027) · *Rien* (ci-dessous)

### SCÈNE co.colline.trahison_rapport  —  Le rapport
**Rôle** : joueur | entraineur | president | selectionneur | instance · **Intrigue** : palier (`on_relation` −3) · **Étape** : palier −3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : le tunnel ; il a rangé le sifflet, pas le stylo · **Conditions** : relation.colline <= -3 ; `statut_ok: [club, staff]` ; variante `_instance` si role == 'instance' (le rapport vise ta réforme : « j'ai vu ce que la machine ne voit pas »)
**COLLINE** *(arbitre — noir — il te regarde ; il n'a que ça, et ça suffit)*
« J'ai vu, monsieur, et j'ai écrit ce que j'ai vu : votre banc, votre geste, votre mot ; le rapport part ce soir à la Commission. J'ai vu. »
← **J'ai dit ce qu'on pense** — effets : direction −−, tribunes +, set: rapport_colline, set: fede_dossier — *La Commission convoque. Salle 3. On examine.*
→ **Je m'excuse, à vous seul** — effets : direction −, vestiaire −, parole +1, set: rapport_colline, relation.colline −1 — *Il accepte l'excuse. Le rapport part quand même : il ne modifie pas ce qu'il a vu.*
**Traces** : rapport_colline (et `fede_dossier` à gauche) · **Réactions déclenchées** : — · **Lu plus tard par** : en.commission_discipline variante « le rapport Colline » (ch. 11), in.dossier (ch. 15, lit `fede_dossier`), une.quotidien.il_a_vu (ch. 20), pr_ecoutes (epitaph_plus « Colline avait refusé, et vu », ch. 30, lit `ecoutes`)

### SCÈNE co.colline.faveur_rien  —  Rien
**Rôle** : joueur | entraineur | president | selectionneur | instance · **Intrigue** : palier (`on_relation` +3) · **Étape** : palier +3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : le rond central, avant le coup d'envoi ; tout le stade voit · **Conditions** : relation.colline >= 3 ; `statut_ok: [club, staff]`
**COLLINE** *(arbitre — sourire, c'est-à-dire qu'il te dit ton prénom — il te serre la main devant les deux bancs)*
« Je ne vous donnerai rien, {prenom}, ni une minute ni un penalty, et tout le stade vient de me voir vous le dire. J'ai vu. »
← **C'est tout ce que je voulais** — effets : tribunes ++, direction +, parole +1, set: titre_propre, relation.colline +1 — *Le stade a vu. Ce que tu gagneras ce soir, tu l'auras gagné.*
→ **Une minute, quand même ?** — effets : tribunes +, set: titre_propre, relation.colline −1 — *Il ne rit pas. Il ajoute le temps réglementaire. Pas une seconde de plus.*
**Traces** : titre_propre · **Réactions déclenchées** : co.re.gege_decoupe (∃ : Gégé découpe la photo de la poignée de main) · **Lu plus tard par** : *La statue de bronze* (epitaph_plus « Colline n'avait rien donné », ch. 30), carte-légende *Le temps additionnel* (ch. 11 : `titre_propre` la débloque), in.arbitre_machine variante « vous savez ce qu'un arbitre voit » (ch. 15), une.echo.il_ne_donne_rien (ch. 20)

**Retrouvailles** — `co.retrouvailles.colline_sourire` (≥ +2) : Colline, dans le tunnel, sans s'arrêter : « Nouveau banc, {prenom} ; je vous verrai comme les autres. J'ai vu. » — un bouton **C'est tout ce que je demande** — effets : tribunes +, relation.colline +1 — *Il te voit comme les autres. C'est déjà beaucoup.* · `co.retrouvailles.colline_noir` (≤ −2) : Colline, au briefing d'avant-match, à la troisième personne : « Monsieur {nom} est sur le banc d'en face. J'ai vu. Je verrai. » — un bouton **Voyez** — effets : direction − — *Il voit. Il note. Il ne se trompe jamais sur toi, malheureusement.*

---

## ROGER PICHON  (`pichon`)
**Fonction** : boulanger, président du FC Trébignac (1985-2000, puis quand personne ne veut) ; délégué du district au Congrès (une voix) · **Genre** : m · **Âge en 1990** : 56 · **Camp** : direction · **Fenêtre** : 1990-2019 ; il ferme la boulangerie en 2008 et garde le club ; meurt en 2019, à cinq heures, la pâte était faite · **Suivant** : toi (transition amateur → président amateur), sinon Gérard, et l'on sait comment ça finit (`en.evt.gerard`)
**Tic** : « Le pain, c'est à cinq heures. Le foot, c'est après. » — torsions : « Le pain, c'est fini. Le foot, c'est tout le temps. » (2008) · « Le foot, c'est à cinq heures aussi, le dimanche. » · « Le pain, c'est à cinq heures. Le club, c'est à toi. » (la Carte Destin)
**Désir** : que le club existe encore quand il fermera la boulangerie · **Blessure** : le club a failli fermer en 1985 ; il l'a repris avec la caisse de la boulangerie, et personne ne le sait, sauf Gérard, qui a compté
**Adresse** (sourire / neutre / noir) : joueur_amateur, joueur : « petit » / « {prenom} » / « monsieur {nom} » · president_amateur, president : « petit » / « président » / « monsieur {nom} » · instance : « petit » / « monsieur le président » / « monsieur {nom} » · autres rôles : il téléphone (« le boulanger de Trébignac au téléphone »)
**Ce qu'il pense de toi** : à +2 tu viens à cinq heures, donc tu comprends · à 0 tu viens le dimanche · à −2 tu ne viens plus, et le club non plus
**Paliers** : −3 → `co.pichon.trahison_cinq_heures` · +3 → `co.pichon.faveur_les_cles`
**Dans les rôles** : **joueur amateur : le président-boulanger, 150 francs au noir, le match arrangé qu'il refuse, la tournée qu'il ne paie pas (« le boucher paie »)** (1,5) · joueur pro : il téléphone après ton premier match en D1, à cinq heures du matin, il n'a pas regardé l'heure (0,5) · **président amateur : ton prédécesseur (il te laisse la caisse, et Gérard) ou ton successeur (il reprend quand tu montes, ou quand tu tombes)** (1) · instance : délégué du district, une voix, qu'il donne à Roux ou à toi (0,5)
**Trajectoire** : 1990 le pain, le club, 150 francs · 2000 la Coupe : Capitale FC au stade municipal Gérard-Blanchet, il fait des sandwichs · 2008 il ferme la boulangerie ; le club a un nouveau trésorier · 2012 l'enterrement de Dédé ; il fait le discours, à cinq heures · 2019 il meurt ; l'Almanach : « {annee} : Pichon est mort à cinq heures. Le foot, c'était après. »
**Retrouvailles** : `co.retrouvailles.pichon_sourire` / `_noir`
**Cartes propres** : *150 francs au noir* (ch. 10) · *Le match arrangé* (ch. 10) · *Le club, c'est à toi* (ch. 30, Carte Destin amateur → président amateur) · *Capitale FC au stade municipal* (ch. 13) · *Le coup de fil de cinq heures* (ch. 10) · *Une voix* (ch. 15) · *Les clés* (ci-dessous)

### SCÈNE co.pichon.trahison_cinq_heures  —  Le pain, c'est à cinq heures
**Rôle** : joueur_amateur | president_amateur · **Intrigue** : palier (`on_relation` −3) · **Étape** : palier −3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : la boulangerie, cinq heures moins dix ; il ne lève pas les yeux du pétrin · **Conditions** : relation.pichon <= -3 ; `statut_ok: [club, retraite]` ; variante `_president` si role == 'president_amateur' (il reprend le club)
**PICHON** *(boulanger — noir — de la farine jusqu'aux coudes ; il parle au pétrin)*
« Le pain, c'est à cinq heures, et le foot, c'est après ; toi, c'est fini, {toi} : plus de licence ici, plus de 150 francs, plus rien. »
← **Je jouerai à Montbéliac** — effets : tribunes −−, vestiaire −, caisse +, set: pichon_reprend — *Montbéliac te prend. Le village ne te parle plus, même chez le boucher.*
→ **Je reste, à la buvette** — effets : tribunes +, caisse −, set: pichon_reprend, relation.pichon −1 — *Tu tiens la buvette avec Gérard. Gérard compte ce que tu bois.*
Variante `_president` : « Le pain, c'est à cinq heures ; le club, je le reprends, {toi}, avec la caisse, avant que tu la vides. » — ← **Reprenez-le, et Gérard avec** — effets : direction −−, caisse +, set: pichon_reprend — *Il reprend. Gérard reste, avec la caisse. Tu sais ce que ça veut dire.* → **Le club est à ses électeurs** — effets : direction −, tribunes +, set: pichon_reprend — *Le village vote. Il vote pour le pain.*
**Traces** : pichon_reprend · **Réactions déclenchées** : — · **Lu plus tard par** : pa_club (epitaph_plus « Pichon avait repris les clés », ch. 30), am.montbeliac variante « tu joues chez l'ennemi » (ch. 10), une.echo.le_boulanger_reprend (ch. 20), pr.gerard variante « Gérard a fui avec la caisse de Pichon » (ch. 13, lit `gerard_parti`)

### SCÈNE co.pichon.faveur_les_cles  —  Les clés
**Rôle** : joueur_amateur | president_amateur | instance · **Intrigue** : palier (`on_relation` +3) · **Étape** : palier +3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : le comptoir, un trousseau posé sur une baguette · **Conditions** : relation.pichon >= 3 ; `statut_ok: [club, retraite]` ; variante `_instance` si role == 'instance' (« ma voix, et celle du district »)
**PICHON** *(boulanger — sourire — il essuie ses mains avant de pousser le trousseau)*
« Les clés du stade, de la buvette et de la caisse, {toi}, et Gérard ne le sait pas encore. Le pain, c'est à cinq heures ; le club, c'est à toi. »
← **Je prends les clés** — effets : direction ++, tribunes +, set: cles_pichon, relation.pichon +1 — *Tu as trois clés. La caisse a un double, Gérard l'a.*
→ **Gardez-les encore une saison** — effets : tribunes +, parole +1, set: cles_pichon — *Il les garde. Il les met à ton nom sur l'étiquette.*
**Traces** : cles_pichon · **Réactions déclenchées** : — · **Lu plus tard par** : Carte Destin amateur → président amateur (ch. 30 : `cles_pichon` remplace « Compte élevé »), in.election variante « le district de Pichon » (ch. 15 : une voix, la première), pr.gerard variante « tu avais les clés, lui le double » (ch. 13), une.echo.les_cles (ch. 20)

**Retrouvailles** — `co.retrouvailles.pichon_sourire` (≥ +2, `statut_ok: [club, retraite]`) : Pichon, au téléphone, cinq heures : « J'ai vu ton nom dans le journal, petit, à cinq heures ; le pain était fait, alors j'appelle. Le foot, c'est après, mais bravo. » — un bouton **Merci, Roger** — effets : tribunes +, relation.pichon +1 — *Il raccroche. Il est cinq heures deux, il a du retard.* · `co.retrouvailles.pichon_noir` (≤ −2) : Pichon, à Gérard, assez fort pour qu'on entende : « {nom} a un nouveau poste. Le pain, c'est à cinq heures ; il ne s'est jamais levé. » — un bouton **J'ai entendu** — effets : tribunes − — *Le village aussi. Il achète son pain chez lui.*

---

## FIRMIN ROUX  (`roux`)
**Fonction** : président du district (1990-2012) · **Genre** : m · **Âge en 1990** : 66 · **Camp** : instances · **Fenêtre** : 1990-2012, puis `retraite` (il vient au Congrès avec sa carte de délégué, périmée, qu'on accepte) ; meurt en 2014 ; trois cents districts envoient une couronne chacun · **Suivant** : « le fils de Roux » (voix), délégué dès 2012, qui vote comme son père votait
**Tic** : « Le district, c'est la base. » — torsions : « La base, c'est le district. Le sommet, c'est loin. » · « Le district, c'est la base. La base a voté. » · « Sans le district, pas de base. Sans base, pas de Legruet. »
**Désir** : être invité à la table de Legruet · **Blessure** : Legruet ne retient jamais son prénom ; en 1992, il a battu Dauzat pour le district et Legruet a félicité « Fernand »
**Adresse** (sourire / neutre / noir) : joueur_amateur, president_amateur : « mon petit » / « président » / « {nom} » · entraineur : « mon petit » / « coach » / « {nom} » · instance : « mon petit » / « cher collègue » / « {nom} » · autres rôles : il ne parle pas (il ne connaît que les gens du district)
**Ce qu'il pense de toi** : à +2 tu viens aux réunions du district, donc tu es la base · à 0 tu es un club du district · à −2 tu as sauté le district, et le district ne saute pas
**Paliers** : −3 → `co.roux.trahison_huis_clos` · +3 → `co.roux.faveur_siege`
**Dans les rôles** : joueur amateur : la convocation pour un coup de coude, la commission du samedi matin (0,5) · entraîneur amateur : le huis clos, le terrain fermé trois matchs (0,5) · **président amateur : la commission de discipline du district (le premier pied dans la Fédération), la fusion (il la « recommande »), le siège** (1,5) · **instance : l'électorat ; trois cents districts votent comme Roux ; s'il lit `enveloppe_promise` côté amateur (le match arrangé), il ne vote plus comme toi** (1,5)
**Trajectoire** : 1990 le district, la commission, le samedi matin · 1992 il bat Dauzat ; Legruet dit « Fernand » · 2000 la Coupe : il exige que Trébignac joue « à domicile, dans la boue » · 2008 il vote Aulard contre Malbec « parce qu'Aulard a dit mon prénom » · 2012 le fils ; la retraite ; 2014 l'enterrement, trois cents couronnes ; Legruet dit « Firmin », enfin
**Retrouvailles** : `co.retrouvailles.roux_sourire` / `_noir`
**Cartes propres** : *La commission du samedi matin* (ch. 10) · *Le huis clos* (ch. 13, PA-07) · *La fusion recommandée* (ch. 13, lit `fusion_signee`) · *Le district te propose un siège* (ch. 30, Carte Destin) · *Trois cents districts* (ch. 15) · *Fernand* (ch. 31, anecdote) · *Le siège* (ci-dessous)

### SCÈNE co.roux.trahison_huis_clos  —  Huis clos
**Rôle** : joueur_amateur | president_amateur | entraineur | instance · **Intrigue** : palier (`on_relation` −3) · **Étape** : palier −3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : la salle du district, un samedi matin ; il préside, il n'a pas ôté son manteau · **Conditions** : relation.roux <= -3 ; `statut_ok: [club, retraite]` ; variante `_instance` si role == 'instance' (« trois cents districts votent contre »)
**ROUX** *(district — noir — il lit la décision sans la lire : il la connaît)*
« Le district, c'est la base, et la base a décidé : votre stade est fermé trois matchs, {toi}, à huis clos, sans buvette. Vous jouerez chez Montbéliac. »
← **Je fais appel à la Ligue** — effets : direction −−, caisse −, set: huis_clos — *La Ligue confirme. La Ligue confirme toujours le district : c'est la base.*
→ **On jouera dans la boue** — effets : tribunes +, caisse −−, set: huis_clos, relation.roux −1 — *Vous jouez à huis clos chez l'ennemi. Le village écoute depuis le parking.*
**Traces** : huis_clos · **Réactions déclenchées** : — · **Lu plus tard par** : pa_village (epitaph_plus « le district avait fermé le stade », ch. 30), pr.buvette variante « trois matchs sans recette » (ch. 13, lit aussi `gerard_parti`), une.echo.huis_clos (ch. 20), in.election variante « le district de Roux vote contre » (ch. 15)

### SCÈNE co.roux.faveur_siege  —  Le siège
**Rôle** : president_amateur | instance · **Intrigue** : palier (`on_relation` +3) · **Étape** : palier +3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : la buvette du district, après la commission ; il t'a gardé une chaise · **Conditions** : relation.roux >= 3 ; `statut_ok: [club, retraite]` ; variante `_legruet` si `flag('districts_legruet')` (« Legruet a parlé, mais c'est moi qui décide »)
**ROUX** *(district — sourire — il pousse la chaise avec le pied, comme au café)*
« Le district te propose un siège, mon petit, à la commission d'abord, à ma place ensuite. Le district, c'est la base ; tu commences par la base. »
← **Je prends le siège** — effets : direction ++, tribunes −, set: siege_district, relation.roux +1 — *Tu sièges le samedi matin. Le village te voit partir en costume.*
→ **Je reste au club** — effets : tribunes +, set: siege_district — *Il garde le siège vide. Il l'appelle « le tien » devant tout le monde.*
**Traces** : siege_district · **Réactions déclenchées** : — · **Lu plus tard par** : Carte Destin président amateur → district (ch. 30 : `siege_district` remplace « Roux à +1 »), in.election (ch. 15 : trois cents districts votent comme Roux), co.legruet.faveur_les_districts (ci-dessus : Roux transmet), une.echo.le_siege (ch. 20)

**Retrouvailles** — `co.retrouvailles.roux_sourire` (≥ +2, `statut_ok: [club, retraite]`) : Roux, sa carte de délégué à la main : « On m'a dit ton nouveau poste, mon petit ; le district est fier, et le district, c'est la base. Tu viens dire bonjour samedi ? » — un bouton **Samedi** — effets : tribunes +, relation.roux +1 — *Samedi, ils sont vingt. Ils t'applaudissent debout, sauf Montbéliac.* · `co.retrouvailles.roux_noir` (≤ −2) : Roux, au Congrès, à voix haute : « {nom} a sauté le district. Le district, c'est la base ; la base ne saute pas. » — un bouton **La base m'entendra** — effets : direction − — *La base entend. Elle vote comme Roux.*

---

### 4.3 La sélection : le sélectionneur en place

Le camp `selection` est celui du chapitre 01 (Fauvel, Brissac). Ce chapitre y ajoute le seul personnage de sélection qui ne joue pas et ne compte pas : celui qui a le poste avant toi, et qui le commente après. La charte le nomme sans le nommer (« le sélectionneur en place vient d'être viré », « l'ancien sélectionneur consultant qui te savonne la planche », « elle a fait pleurer un sélectionneur en 1990 ») ; il reçoit ici un nom, une fiche, deux paliers, deux retrouvailles et une intrigue, à déclarer au chapitre 90.

## AIMÉ ROSSARD  (`rossard`)
**Fonction** : sélectionneur des Cobalts (1986-1994), puis consultant de Télé-Stade (1995-2015), « le plateau du dimanche » avant Ménèche et à côté de lui · **Genre** : m · **Âge en 1990** : 52 · **Camp** : selection (bande `direction` dès 1995 : il commente) · **Fenêtre** : 1990-2015, puis `retraite` (il vient aux matchs des Cobalts en tribune de presse, sans micro, à côté de Vence retraitée ; il téléphone à ses successeurs la veille des listes) ; meurt en 2022, pendant le Mondial d'hiver, devant une séance de tirs au but · **Suivant** : « le sélectionneur de 98 » (voix sans portrait : celui qui gagne à la maison avec le groupe de Rossard, si tu n'y es pas), puis toi ; au plateau, Ménèche (2003), puis Dembo consultant (2010)
**Tic** : « Moi, à votre place, je l'aurais fait. » — torsions : « Moi, à ma place, je ne l'ai pas fait. » · « Moi, à votre place, j'y étais. » · « Moi, à sa place, j'ai pleuré. »
**Désir** : qu'on lui rende 1998 : que quelqu'un dise à voix haute que le groupe champion à la maison était le sien · **Blessure** : la finale de 1990 perdue aux tirs au but, les larmes en direct devant Vence, le Mondial de 1994 raté, le limogeage par Nouvelle ; puis son successeur a gagné 1998 avec vingt-trois joueurs qu'il avait choisis, et personne n'a prononcé son nom ce soir-là
**Adresse** (sourire / neutre / noir) : joueur, joueur_amateur : « petit » / « {prenom} » / « le {numero} » · entraineur : « petit » / « coach » / « collègue » · selectionneur : « petit » / « collègue » / « monsieur le sélectionneur » (le titre, chez lui, est une lame) · ds, president : « petit » / « président » / « monsieur » · instance : « {prenom} » / « monsieur le président » / « monsieur »
**Ce qu'il pense de toi** : à +2 tu l'écoutes, donc il te dit ce qu'il a vu avant de le dire à l'antenne · à 0 tu es un sujet de plateau · à −2 tu es la planche qu'il savonne, et il le fait bien
**Paliers** : −3 → `co.rossard.trahison_remplacant` · +3 → `co.rossard.faveur_vingt_trois`
**Dans les rôles** : joueur (1990-1994) : le sélectionneur en place, celui qui t'appelle ou non pour la Coupe d'été et le Mondial raté ; il cherche un cinquième tireur (1) · entraîneur : le consultant qui commente ton derby le dimanche soir ; « moi, à sa place » ; la Nouvelle de son limogeage (1994) ouvre la Carte Destin (0,5) · **sélectionneur : celui dont tu as pris la place, ou celui qui veut la place que tu as ; il tend le cou vers Ménèche et Vence pour te découper, et te dit en privé ce qu'il voit de ton groupe** (1,5) · président : il veut un banc, n'importe lequel, il le dit à Malbec (0,5) · instance : après le fiasco de 2011 il se propose, à soixante-treize ans ; il veut que le Congrès honore 1998 (1)
**Trajectoire** : 1990 la finale aux tirs au but, les larmes devant Vence, il ne s'en remet pas et le cache mal · 1994 le Mondial raté, viré par communiqué (« le sélectionneur en place vient d'être viré ») ; Legruet ne l'a pas appelé · 1995 consultant Télé-Stade ; il inaugure « moi, à sa place » · 1998 le titre à la maison, sans lui, avec ses vingt-trois ; il commente la finale sans une faute de voix, et rentre seul · 2003 le Plateau ; Ménèche à sa gauche, Vence en face ; il découpe tous les sélectionneurs, un par un, avec justesse · 2011 après le fiasco du bus, il se propose ; on ne le rappelle pas · 2015 il quitte l'antenne ; Dembo prend son fauteuil · 2022 il meurt devant une séance de tirs au but, à la télé, le cinquième tireur n'avait pas encore tiré ; l'Almanach : « {annee} : Rossard est mort avant le cinquième tir. Moi, à sa place, dit-on. »
**Retrouvailles** : `co.retrouvailles.rossard_sourire` / `_noir`
**Cartes propres** : *Le cinquième tireur* (§ 5, `co.rossard.planche_cinquieme`) · *Moi, à sa place* (§ 5) · *Le savon* (§ 5) · *Quatre-vingt-dix-huit* (§ 5) · *Le sélectionneur en place vient d'être viré* (ch. 31, Nouvelle 1994) · *Le consultant qui te savonne* (ch. 14) · *Le fauteuil d'à côté* (ch. 30, Carte Destin consultant : il te cède ou te refuse le fauteuil) · *Le remplaçant* (ci-dessous)

### SCÈNE co.rossard.trahison_remplacant  —  Le remplaçant
**Rôle** : selectionneur | entraineur | joueur · **Intrigue** : palier (`on_relation` −3) · **Étape** : palier −3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : le plateau de Télé-Stade ; tu es en cabine, lui en lumière · **Conditions** : relation.rossard <= -3 ; `statut_ok: [club, staff, retraite]` ; year >= 1995 ; variante `_joueur` si role == 'joueur' && year < 1995 (« il n'est pas dans ma liste, et je le dis ici avant de le lui dire »)
**ROSSARD** *(consultant — noir — il regarde la caméra deux, celle de ton visage en incrustation)*
« Le sélectionneur sera remplacé après le tournoi, et je vous donne le nom du suivant ce soir : il a dit oui hier. Moi, à sa place, je l'aurais fait. »
← **Je réponds en direct** — effets : tribunes −, direction −−, parole +1, set: remplacant_nomme — *Tu réponds. Le nom qu'il a donné passe en bandeau sous ta réponse, tout du long.*
→ **Je coupe la cabine** — effets : direction −−, vestiaire +, set: remplacant_nomme, relation.rossard −1 — *La cabine reste allumée. Le groupe regarde depuis l'hôtel ; le groupe connaît le nom.*
Variante `_joueur` : « Le {numero} n'est pas dans ma liste, et je le dis ici avant de le lui dire : il n'a pas le niveau, pas encore. Moi, à sa place, je travaillerais. » — ← **Je travaillerai** — effets : vestiaire +, tribunes −, set: remplacant_nomme — *Tu travailles. La liste suivante est celle d'un autre sélectionneur.* → **Il ne me verra plus** — effets : tribunes +, direction −, set: remplacant_nomme, set: selection_refusee — *Il ne te voit plus. Legruet non plus : c'est le règlement des forfaits.*
**Traces** : remplacant_nomme (et `selection_refusee` à droite de la variante joueur) · **Réactions déclenchées** : co.re.vence_direct (§ 6) · **Lu plus tard par** : sl.tournoi variante « le groupe connaît le nom du suivant » (ch. 14), sl_minuit (epitaph_plus « Rossard avait donné le nom », ch. 30), une.quotidien.le_nom_du_suivant (ch. 20), co.legruet.trahison_avant_toi (variante « Rossard l'a dit avant Legruet »), co.fantome.consultant (ch. 90)

### SCÈNE co.rossard.faveur_vingt_trois  —  Les vingt-trois
**Rôle** : selectionneur | entraineur | instance · **Intrigue** : palier (`on_relation` +3) · **Étape** : palier +3 · **Moment** : [1,3] cartes après le franchissement, une fois par carrière · **Lieu** : un café près de la Fédération, un cahier d'écolier posé fermé · **Conditions** : relation.rossard >= 3 ; `statut_ok: [club, staff, retraite]` ; year >= 1998
**ROSSARD** *(consultant — sourire — il pousse le cahier ; sur la couverture, un chiffre : 98)*
« Les vingt-trois de quatre-vingt-dix-huit, comment on les tenait, ce qu'on leur disait la veille ; c'est mon groupe, et je vous le donne. Moi, à votre place, j'y étais. »
← **Je prends le cahier** — effets : vestiaire ++, direction +, set: cahier_rossard, relation.rossard +1 — *Le cahier a des noms rayés et des noms entourés. Fauvel est entouré deux fois.*
→ **Gardez-le pour le Congrès** — effets : tribunes +, parole +1, set: cahier_rossard, set: rossard_honore — *Il le garde. Il dit au Congrès que 98 était à lui, et la salle applaudit sans se lever.*
**Traces** : cahier_rossard (et `rossard_honore` à droite) · **Réactions déclenchées** : — · **Lu plus tard par** : sl.liste variante « le cahier de 98 » (ch. 14 : la carte Liste lit `cahier_rossard`), co.rossard.planche_quatre_vingt_dix_huit (§ 5), co.fauvel_liste variante « entouré deux fois » (ch. 01), une.quotidien.le_cahier_de_98 (ch. 20), sl_fete (epitaph_plus « le cahier de Rossard était dans le bus », ch. 30)

**Retrouvailles** — `co.retrouvailles.rossard_sourire` (≥ +2, `statut_ok: [club, staff, retraite]`) : Rossard, au téléphone, la télé allumée derrière : « Nouveau poste, petit, et je suis à l'antenne dimanche : je dirai du bien, ce qui ne m'arrive pas. Moi, à votre place, je regarderais. » — un bouton **Je regarderai** — effets : tribunes +, relation.rossard +1 — *Il dit du bien. Ménèche, à côté, s'étonne en direct.* · `co.retrouvailles.rossard_noir` (≤ −2) : Rossard, sur le plateau, sans te nommer : « Un nouveau visage à ce poste, et je l'ai déjà vu perdre : il n'était pas dans ma liste de 1992, et il n'y a pas manqué. Moi, à sa place, je l'aurais fait. » — un bouton **Il n'oublie rien** — effets : tribunes −, direction − — *Il n'oublie rien. La régie ressort l'image de 1992 ; tu n'y es pas.*

---

## 5. Les intrigues propres : le retournement, rôle par rôle

Vingt-trois intrigues, une par personnage, au gabarit § 4.3 de la charte, avec quatre scènes chacune au gabarit § 4.1. Elles suivent la convention du chapitre 01 : le mot d'arc est l'id du personnage (`co.<id>_<mot>`), les scènes sont `co.<id>.<mot>_<etape>` ; les chapitres 10-15 gardent leurs propres mots d'arc et ne rentrent pas dans ces espaces. Chaque étape est gardée par un rôle (« **Rôle** » de la scène) : l'intrigue s'ouvre à la première étape dont le rôle correspond à celui du personnage joué, les étapes des autres rôles restent en réserve et se servent quand la lignée y arrive ; c'est ainsi qu'un personnage de direction « traverse les rôles » (charte § 2.1, règle 6). Une étape au moins glisse en saison suivante (`at_season +1`) ; une variante au moins lit une trace d'un autre chapitre. Les drapeaux internes (lus seulement par l'intrigue elle-même) sont notés entre crochets dans **Traces** et ne reçoivent pas de ligne d'Almanach ; les traces déclarées reçoivent la leur au § 7.2. Aucune scène de drame ; aucune scène de La Plume ou d'Amsel en S0.

---

## INTRIGUE co.fardelli_page_trois  —  La page trois
**Logline** : Rocco Fardelli te fait signer la page trois avant la page une ; vingt ans plus tard, il te la vend, en face, avec ta propre signature en bas. · **Synopsis** : Joueur, il pose le contrat à l'envers : signe d'abord, on lit après. Entraîneur, il tient ta star par une page trois que tu n'as pas écrite et te propose le prodige en échange. Directeur sportif, il s'assoit en face et sort de sa serviette le contrat que tu as signé joueur : la clause est la même, le client a changé. Un jour, dans une salle sans fenêtre, Amsel lit son carnet à voix haute et arrive à ta page. Ce que tu as lu ou pas lu en 1990 décide de ce que tu peux dire en 2012.
**Rôle(s)** : joueur, entraineur, ds, president, instance · **Postulat(s)** : partagé (`pepite`, `fin_de_contrat`, `promu`, `vendre_trente`, `heritage_empoisonne`) · **Porteur** : fardelli · **Cast** : Fardelli, Solvang, Josiane, Amsel, Mbako (nommé) · **Thème** : mercato
**Saisons** : "0" (étape 1), "1" et "2+" (étapes 2-4) · **Conditions d'entrée** : `chars.fardelli.statut in [club, rival]` ; étape 4 : `season >= 1 && year >= 2005` · **Exclusions** : jamais deux étapes dans la même saison · **Rejouabilité** : jamais (les traces suivent la lignée)
**Issues** → **Traces** → **Qui les lit** : `signe_sans_lire` → [page_trois_signee] → étape 3 · `lu_avant_de_signer` → [page_trois_lue] → étape 3, Solvang `faveur_page_trois` (elle te montre une page que tu connais) · `prodige_donne` → `prodige_a_fardelli` (Almanach : « {annee} : {nom} a donné le prodige à Fardelli contre une saison de sa star. ») → ch. 11 (en.prodige variante « son agent est Fardelli »), ch. 01 (mère de Mbako à −1), ch. 20 · `page_barree` → `page_trois_barree` (« {annee} : {nom} a barré la page trois de Fardelli. Le joueur a signé chez {rival}. ») → ch. 12 (mercato : Fardelli n'apporte plus d'offre cette fenêtre), ch. 90 (Nemesis), ch. 20 · `carnet_reconnu` / `carnet_nie` → `carnet_reconnu` (« {annee} : Amsel a lu le carnet de Fardelli. {nom} a reconnu sa page. ») / `carnet_nie` (« {annee} : la page de {nom} dans le carnet de Fardelli. Il a dit que ce n'était pas la sienne. ») → ch. 15 (in.valises), ch. 30 (fins judiciaires, `le_repenti`), co.la_plume.trahison_documents (variante « la page du carnet »), ch. 20
**Séquencier** : étape 1 `page_une` (joueur, S0 [3,8]) → étape 2 `page_trois_star` (entraineur, S1+ [9,14], `at_season +1`) → étape 3 `en_face` (ds, [2,10] ; variantes lues sur `page_trois_lue` / `page_trois_signee`) → étape 4 `voix_haute` (president | instance, S1+, year >= 2005 ; variante « témoin » si `flag('temoin_amsel')`)
**Scènes** : 4
**Épilogue** : par abandon (club changé avant l'étape 3), Fardelli garde la page ; l'Almanach écrit « {annee} : Fardelli a gardé la page trois de {nom}. Pour plus tard. » ; la trace `page_trois_signee` reste lisible par Solvang.

### SCÈNE co.fardelli.page_trois_page_une  —  La page une
**Rôle** : joueur · **Intrigue** : co.fardelli_page_trois · **Étape** : 1/4 · **Moment** : saison 0, créneaux [3,8] · **Lieu** : un café de gare, le contrat posé à l'envers · **Conditions** : `chars.fardelli.statut == club` ; `!flag('agente_solvang')`
**FARDELLI** *(agent — neutre — il fait tourner le contrat vers toi, dernière page dessus, un stylo déjà décapuchonné)*
« Mon ami, on parle d'argent ou d'amitié ? Signe la page trois d'abord, c'est de la cuisine, la page une on la lira ensemble. »
← **Je signe la page trois** — effets : caisse ++, direction +, set: page_trois_signee — *Tu signes. Il replie la page trois avant que tu aies pu la retourner, et il commande deux cafés.*
→ **Je lis d'abord** — effets : caisse +, direction −, set: page_trois_lue, relation.fardelli −1 — *Tu lis. Il y a un pourcentage sur tes transferts futurs, sans date de fin. Il le voit que tu le vois.*
**Traces** : [page_trois_signee], [page_trois_lue] · **Réactions déclenchées** : co.re.solvang_compte (§ 6, si `chars.solvang.statut in [club, rival]`) · **Lu plus tard par** : co.fardelli.page_trois_en_face (les deux variantes), co.solvang.faveur_page_trois (« la page que Fardelli vous vend »), jp.contrat_image variante « la page trois avait un pourcentage » (ch. 10)

### SCÈNE co.fardelli.page_trois_star  —  La page trois de la star
**Rôle** : entraineur · **Intrigue** : co.fardelli_page_trois · **Étape** : 2/4 · **Moment** : saison 1 ou plus (`at_season +1`), créneaux [9,14] · **Lieu** : le parking du centre, sa voiture à cheval sur deux places · **Conditions** : `chars.fardelli.statut in [club, rival]` ; `chars.dembo.statut == club` ; variante `_vendu` si `flag('mbako_vendu')` (il ne demande plus le prodige : il demande le suivant, « le gamin de Barbier » si `flag('gamin_barbier')`)
**FARDELLI** *(agent — neutre — il tapote la vitre avec la gourmette, il ne sort pas)*
« Ta star a une page trois, coach, et la page trois dit juin : je la déchire si le petit signe chez moi. Mon ami, on parle d'argent ou d'amitié ? »
← **Le petit est à lui** — effets : vestiaire +, direction +, tribunes −, set: prodige_a_fardelli, set: mbako_agent_fardelli, relation.mere_mbako −1 — *Dembo reste. La mère de Mbako apprend le nom de l'agent par le fax du club, et rappelle trois fois.*
→ **Ni le petit ni la page** — effets : vestiaire −, tribunes +, relation.fardelli −1 — *Il remonte la vitre. En juin, la page trois s'applique ; le vestiaire lit le nom du club dans la presse.*
**Traces** : prodige_a_fardelli (et `mbako_agent_fardelli` ∃) · **Réactions déclenchées** : en.re.fardelli_numero (∃) · **Lu plus tard par** : en.prodige variante « son agent est Fardelli » (ch. 11), co.mere_trois_pour_cent variante « vous l'avez donné à la gourmette » (ch. 01), une.gazette.le_petit_a_une_gourmette (ch. 20), co.fardelli.page_trois_en_face (variante « vous m'avez déjà donné un petit »)

### SCÈNE co.fardelli.page_trois_en_face  —  En face
**Rôle** : ds · **Intrigue** : co.fardelli_page_trois · **Étape** : 3/4 · **Moment** : toute saison, créneaux [2,10] (fenêtre de mercato) · **Lieu** : ton bureau ; il s'assied sans qu'on le lui propose, la serviette sur les genoux · **Conditions** : `chars.fardelli.statut in [club, rival]` ; variantes lues dans l'ordre : `flag('page_trois_lue')` → « vous l'aviez lue, à l'époque » ; `flag('page_trois_signee')` → « vous l'aviez signée sans lire » ; sinon « la page trois, vous connaissez »
**FARDELLI** *(agent — neutre — il sort deux contrats : celui du joueur qu'il vend, et un plus vieux, jauni, avec ta signature)*
« Même page trois qu'en 1990, monsieur le directeur, même pourcentage, même absence de date ; vous l'aviez signée sans lire. Mon ami, on parle d'argent ou d'amitié ? »
← **Je signe, page une** — effets : caisse −−, force +2, vestiaire +, set: page_trois_ds — *Le joueur arrive lundi. La page trois arrive avec lui ; Vialat la lira en juin.*
→ **Je barre la page trois** — effets : direction −, tribunes −, set: page_trois_barree, relation.fardelli −1, react: co.re.solvang_compte — *Il range les deux contrats dans le même ordre. Le joueur signe chez {rival} à 23 h 58.*
**Traces** : page_trois_barree, [page_trois_ds] · **Réactions déclenchées** : co.re.solvang_compte (§ 6) · **Lu plus tard par** : ds.mercato fenêtre suivante variante « Fardelli n'apporte rien » (ch. 12), co.vialat.soldes_intermediaire (§ 5 : la commission sans date), co.nemesis.fardelli (ch. 90), une.quotidien.la_page_trois_a_vingt_ans (ch. 20)

### SCÈNE co.fardelli.page_trois_voix_haute  —  À voix haute
**Rôle** : president | instance · **Intrigue** : co.fardelli_page_trois · **Étape** : 4/4 · **Moment** : saison 1 ou plus, year >= 2005, créneaux [6,15] · **Lieu** : une salle du tribunal sans fenêtre ; Amsel lit, Fardelli n'est pas là · **Conditions** : `season >= 1` ; `chars.amsel.statut in [club, staff]` ; variante `_temoin` si `flag('temoin_amsel')` (elle lit ta page « pour mémoire »)
**AMSEL** *(procureure — neutre — un carnet à spirale ouvert sur la table, une page cornée, ton nom en haut)*
« Page quarante-deux du carnet de monsieur Fardelli : votre nom, une date, un pourcentage sans fin, madame ou monsieur {nom}. Nous avons tout notre temps : vous reconnaissez cette page ? »
← **Je reconnais ma signature** — effets : parole +1, direction −, tribunes +, set: carnet_reconnu — *Tu reconnais. Elle tourne la page ; la suivante n'est pas la tienne, et tu connais le nom.*
→ **Ce n'est pas ma page** — effets : parole −2, direction +, set: carnet_nie — *Elle note. Elle a l'original, avec le café de 1990 dessus.*
**Traces** : carnet_reconnu, carnet_nie · **Réactions déclenchées** : co.re.josiane_a_lu (∃, si `!seen`) · **Lu plus tard par** : in.valises chaîne (ch. 15 : « le carnet est au dossier »), fins *La radiation*, *Les écoutes* (ch. 30 : `carnet_nie` en `epitaph_plus`), postulat dérivé `le_repenti` (ch. 30), co.la_plume.trahison_documents (variante « la page du carnet »), une.gazette.page_quarante_deux (ch. 20)

---

## INTRIGUE co.meneche_hors_micro  —  Hors micro
**Logline** : Pierre Ménèche te pose une question hors micro à vingt ans et la publie à soixante-dix, dans un chapitre à ton nom ; entre les deux, il t'a fait promettre en direct. · **Synopsis** : Première interview, micro posé : il te demande ce que tu penses du patron. Deux saisons plus tard, « Hors micro » cite un proche du vestiaire, et le proche c'est toi ; il propose de ne pas te nommer contre la compo en avance. Président ou sélectionneur, il te tend le micro du Plateau et te demande, en direct, si tu vires ou si tu gardes ; Rossard est à côté. En 2025, il t'envoie les épreuves de ses mémoires : le chapitre à ton nom contient ce que tu as dit hors micro.
**Rôle(s)** : joueur, entraineur, ds, president, selectionneur, instance · **Postulat(s)** : partagé · **Porteur** : meneche · **Cast** : Ménèche, Rossard, Vence, Josiane, Léa (nommée) · **Thème** : presse
**Saisons** : "0" (étape 1), "1" (étape 2), "2+" (étapes 3-4) · **Conditions d'entrée** : `chars.meneche.statut in [club, retraite]` ; étape 3 : year >= 2003 ; étape 4 : year >= 2025 · **Exclusions** : pas la même saison que `en.meneche.dossier` (ch. 11) · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `dit_hors_micro` → `hors_micro_dit` (« {annee} : {nom} a parlé hors micro à Ménèche. Ménèche a un carnet. ») → étape 2, ch. 11 (le dossier Ménèche, variante « votre propre phrase »), ch. 20 · `rien_hors_micro` → [hors_micro_rien] → étape 2 (il cite quelqu'un d'autre) · `compo_donnee` → `compo_meneche` (« {annee} : Ménèche avait la compo avant le vestiaire. Un proche la lui donnait. ») → ch. 11 (en.kop variante « la compo est dans le journal »), ch. 01 (Bréhaut : « le groupe a lu »), ch. 20 · `promis_en_direct` → `promesse_plateau` (« {annee} : {nom} a promis en direct, chez Ménèche. ») → ch. 30 (set-piece `bilan_verdict` : « tu l'avais dit au Plateau »), ch. 20 (« Les promesses, datées »), ch. 14 · `chapitre_relu` / `chapitre_brut` → `chapitre_meneche` (« {annee} : Ménèche a publié un chapitre au nom de {nom}. Relu, ou pas. ») → ch. 31 (Nouvelle 2025), ch. 90 (Fantôme consultant), ch. 20
**Séquencier** : étape 1 `premiere` (joueur | entraineur, S0 [4,9]) → étape 2 `chronique` (entraineur | ds, S1 [3,8], `at_season +1`) → étape 3 `direct` (president | selectionneur, year >= 2003, [10,15]) → étape 4 `memoires` (tous rôles, year >= 2025, `statut_ok: [retraite]`)
**Scènes** : 4
**Épilogue** : par abandon, la phrase hors micro reste dans le carnet ; l'Almanach écrit « {annee} : Ménèche a une phrase de {nom} en réserve. » ; `hors_micro_dit` reste lisible par ch. 11.

### SCÈNE co.meneche.hors_micro_premiere  —  Première question
**Rôle** : joueur | entraineur · **Intrigue** : co.meneche_hors_micro · **Étape** : 1/4 · **Moment** : saison 0, créneaux [4,9] · **Lieu** : la salle de presse vide, après les autres ; il pose le micro sur la table, côté mousse vers toi · **Conditions** : `chars.meneche.statut == club`
**MÉNÈCHE** *(journaliste — neutre — il ferme son carnet pour montrer qu'il le ferme)*
« Juste une question, hors micro : le président, vous en pensez quoi, vraiment ? Ça reste entre nous, ou ça reste entre nous et le journal, à vous de voir. »
← **Je dis ce que je pense** — effets : tribunes +, direction −, set: hors_micro_dit, relation.meneche +1 — *Tu le dis. Il ne note rien ; il n'a pas besoin, il a une mémoire de journaliste.*
→ **Rien hors micro** — effets : direction +, tribunes −, set: hors_micro_rien — *Il rouvre le carnet et écrit « prudent ». C'est un adjectif qui te suivra.*
**Traces** : hors_micro_dit, [hors_micro_rien] · **Réactions déclenchées** : co.re.lea_confirme (§ 6) · **Lu plus tard par** : co.meneche.hors_micro_chronique, en.meneche.dossier variante « votre propre phrase » (ch. 11), jp.premiere_une variante (ch. 10), une.quotidien.hors_micro (ch. 20)

### SCÈNE co.meneche.hors_micro_chronique  —  Un proche du vestiaire
**Rôle** : entraineur | ds · **Intrigue** : co.meneche_hors_micro · **Étape** : 2/4 · **Moment** : saison 1 (`at_season +1`), créneaux [3,8] · **Lieu** : le couloir des vestiaires, le journal du jour plié à la page « Hors micro » · **Conditions** : `chars.meneche.statut == club` ; variante `_autre` si `flag('hors_micro_rien')` (le proche est quelqu'un d'autre, et tu sais qui)
**MÉNÈCHE** *(journaliste — neutre — il te tend le journal ouvert, une phrase entourée au stylo rouge)*
« « Un proche du vestiaire », c'est vous, et le vestiaire l'a compris avant vous. Juste une réponse, hors micro : la compo le vendredi, et je cite quelqu'un d'autre. »
← **Il aura la compo** — effets : vestiaire −, tribunes +, set: compo_meneche — *Il l'a le vendredi. Le samedi, Bréhaut te demande qui la lui donne.*
→ **Qu'il cite qui il veut** — effets : direction −−, vestiaire +, parole +1, relation.meneche −1 — *Il te cite. Nommément, le lendemain, avec la phrase entière.*
**Traces** : compo_meneche · **Réactions déclenchées** : co.re.josiane_a_lu (∃, `!seen`) · **Lu plus tard par** : en.kop variante « la compo est dans le journal avant le local » (ch. 11), co.brehaut_costume variante « le groupe a lu, et ce n'est pas le groupe qui parle » (ch. 01), une.gazette.un_proche_du_vestiaire (ch. 20), co.meneche.hors_micro_memoires (le chapitre cite la compo)

### SCÈNE co.meneche.hors_micro_direct  —  En direct, chez lui
**Rôle** : president | selectionneur · **Intrigue** : co.meneche_hors_micro · **Étape** : 3/4 · **Moment** : saison 2 ou plus, year >= 2003, créneaux [10,15] · **Lieu** : le Plateau de Télé-Stade ; Ménèche au centre, Rossard à sa droite, le voyant rouge · **Conditions** : `chars.meneche.statut == club` ; variante `_selectionneur` si role == 'selectionneur' (« vous gardez le capitaine ? » ; Rossard souffle « moi, à sa place »)
**MÉNÈCHE** *(consultant — neutre — il ne dit plus « hors micro » : il montre le micro)*
« Pas de question, micro : vous virez votre entraîneur avant dimanche, oui ou non, et vous le dites ici. Le pays regarde, monsieur le président. »
← **Je le garde, je le dis** — effets : promise, direction +, vestiaire +, set: promesse_plateau — *Tu le dis. Le bandeau l'écrit. Rossard ajoute qu'à ta place il l'aurait viré.*
→ **Ça se dira hors micro** — effets : tribunes −, direction −, relation.meneche +1 — *Le silence dure. Rossard le remplit ; il a une liste de noms, et il la lit.*
**Traces** : promesse_plateau · **Réactions déclenchées** : co.re.rossard_plateau (§ 6) · **Lu plus tard par** : bilan_verdict variante « tu l'avais promis au Plateau » (ch. 30, lit `promesse_plateau` et `bilan.tenu`), pr.coach_vire variante « tu avais dit le contraire en direct » (ch. 13), une.quotidien.les_promesses_datees (ch. 20), co.meneche.hors_micro_memoires

### SCÈNE co.meneche.hors_micro_memoires  —  Le chapitre à ton nom
**Rôle** : joueur | entraineur | ds | president | selectionneur | instance · **Intrigue** : co.meneche_hors_micro · **Étape** : 4/4 · **Moment** : toute saison, year >= 2025, créneaux [5,12] · **Lieu** : un paquet d'épreuves, un post-it : « chapitre 11 » · **Conditions** : `chars.meneche.statut == retraite` ; variantes lues dans l'ordre : `flag('dossier_enterre')` → « le dossier que j'ai enterré est dedans, avec le reçu » ; `flag('promesse_plateau')` → « votre promesse en direct, datée » ; `flag('hors_micro_dit')` → « votre phrase de 1990 » ; sinon « quatre pages, c'est peu »
**MÉNÈCHE** *(retraité — neutre — au téléphone ; on entend une machine à écrire, il n'a jamais changé)*
« Chapitre onze, c'est vous : votre phrase de 1990, hors micro, en exergue. Juste une question, et le micro est éteint pour de bon : vous relisez, ou vous me laissez faire ? »
← **Je relis et je corrige** — effets : direction +, parole +1, set: chapitre_meneche, set: chapitre_relu — *Tu corriges deux dates. Il garde la phrase ; c'est la seule chose qu'il ne négocie pas.*
→ **Qu'il publie sans moi** — effets : tribunes +, direction −, set: chapitre_meneche — *Il publie. Le chapitre est juste, ce qui est pire.*
**Traces** : chapitre_meneche, [chapitre_relu] · **Réactions déclenchées** : co.re.lea_confirme (§ 6) · **Lu plus tard par** : co.nv.2025_memoires_meneche (ch. 31 : la Nouvelle lit `chapitre_meneche` et cite l'exergue), co.fantome.consultant (ch. 90), *Ta loge* (epitaph_plus « le chapitre onze », ch. 30), une.quotidien.chapitre_onze (ch. 20)

---

## INTRIGUE co.aulard_empire  —  L'empire
**Logline** : Jean-Marie Aulard te fait signer son organigramme, te fait embaucher son fils, te demande ton vote comme un égal, et te laisse ses tiroirs. · **Synopsis** : Entraîneur ou DS, il t'apporte l'organigramme : ton nom est une case sous la sienne, avec un projet de deux ans à signer. Une saison plus tard, son fils refuse l'empire, et il te demande de lui trouver une case. Président, tu es son égal à la Ligue : les droits télé, les petits ou les gros, et il a besoin de ta voix ; s'il t'a viré un jour, il te demande si tu lui en veux encore. À la Fédération après lui, Josiane t'apporte ses tiroirs : des brouillons de SMS, avec des fautes, dont le tien.
**Rôle(s)** : entraineur, ds, president, instance · **Postulat(s)** : partagé (`promu`, `interimaire`, `vendre_trente`, `geant_dechu`, `rachete_fonds`, `heritage_empoisonne`) · **Porteur** : aulard · **Cast** : Aulard, Josiane, « le fils d'Aulard » (voix), Malbec, Roux (nommé) · **Thème** : direction
**Saisons** : "0" (étape 1), "1" (étape 2), "2+" (étapes 3-4) · **Conditions d'entrée** : `chars.aulard.statut in [club, rival, retraite]` ; étape 3 : year >= 1998 (il préside la Ligue) ou `role == 'president'` ; étape 4 : year >= 2016 && role == 'instance' · **Exclusions** : pas la même saison que `en.fils_aulard` (ch. 11) · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `projet_signe` → `projet_aulard` (« {annee} : {nom} a signé le projet d'Aulard. Deux ans, une case. ») → ch. 30 (set-piece `objective` variante « le projet dit deux ans »), ch. 11 (`en.promu` A2 variante), ch. 20 · `fils_case` → `fils_aulard_staff` (« {annee} : le fils d'Aulard a une case dans le staff de {nom}. Il ne la voulait pas. ») → ch. 11 (en.fils_aulard variante « il est déjà chez toi »), ch. 01 (Vukić : « il dîne avec le fils »), ch. 20 · `vote_gros` / `vote_petits` → `vote_gros` (« {annee} : {nom} a voté les droits télé avec les gros. Aulard a compté. ») / `vote_petits` (« {annee} : {nom} a voté avec les petits. Malbec a noté. ») → ch. 13 (pr.droits_tele), ch. 15 (le bloc Aulard au Congrès), co.malbec.lettres_candidat (§ 5), ch. 20 · `tiroirs_ouverts` / `tiroirs_fermes` → `tiroirs_aulard` (« {annee} : {nom} a ouvert les tiroirs d'Aulard. Des brouillons, des fautes. ») → ch. 15 (`heritage_empoisonne` : « le prédécesseur a laissé des tiroirs »), ch. 30 (in_showman plus), co.retrouvailles.aulard_noir, ch. 20
**Séquencier** : étape 1 `organigramme` (entraineur | ds, S0 [2,6]) → étape 2 `fils` (entraineur | ds | president, S1 [6,12], `at_season +1`) → étape 3 `cher_collegue` (president, [8,14] ; variante `_cheque` si `flag('cheque_non_date')`) → étape 4 `tiroirs` (instance, year >= 2016 ; variantes sur `vote_gros`, `president_ami`)
**Scènes** : 4
**Épilogue** : par abandon, l'organigramme reste au mur du bureau avec ta case barrée ; l'Almanach écrit « {annee} : la case de {nom} dans l'organigramme d'Aulard est barrée. Au feutre. »

### SCÈNE co.aulard.empire_organigramme  —  L'organigramme
**Rôle** : entraineur | ds · **Intrigue** : co.aulard_empire · **Étape** : 1/4 · **Moment** : saison 0, créneaux [2,6] · **Lieu** : son bureau ; un organigramme plastifié couvre le mur, ta case est encore vide · **Conditions** : `chars.aulard.statut == club`
**AULARD** *(président — neutre — il écrit ton nom dans la case au feutre, en majuscules, sans te demander l'orthographe)*
« Voilà l'empire, {toi}, et voilà votre case : deux ans, un projet, une signature en bas. J'ai pas le temps, j'ai un empire, signez avant Josiane. »
← **Je signe les deux ans** — effets : direction ++, promise, set: projet_aulard — *Tu signes. Josiane date. La case est plastifiée le soir même ; on ne l'efface plus au feutre.*
→ **Un an, pas deux** — effets : direction −, parole +1, tribunes + — *Il raye le deux et écrit un. Il ne plastifie pas. Il attend.*
**Traces** : projet_aulard · **Réactions déclenchées** : co.re.malbec_compris (§ 6, si `chars.malbec.statut in [club, rival]`) · **Lu plus tard par** : set-piece `objective` variante « le projet dit deux ans » (ch. 30), en.promu.a2 variante « tu as déjà signé un projet » (ch. 11), une.quotidien.une_case_dans_lempire (ch. 20), co.aulard.empire_tiroirs (le brouillon de ton SMS date du jour de la signature)

### SCÈNE co.aulard.empire_fils  —  La case du fils
**Rôle** : entraineur | ds | president · **Intrigue** : co.aulard_empire · **Étape** : 2/4 · **Moment** : saison 1 (`at_season +1`), créneaux [6,12] · **Lieu** : le parking de la tribune présidentielle ; le fils attend dans la voiture, il ne descend pas · **Conditions** : `chars.aulard.statut in [club, rival]` ; variante `_president` si role == 'president' (il te demande une case dans *ton* club : « entre collègues »)
**AULARD** *(président — neutre — il parle bas, ce qui ne lui arrive jamais)*
« Mon fils ne veut pas de l'empire, il veut « faire du football » ; trouvez-lui une case dans votre staff, {toi}, avec une porte. J'ai pas le temps, j'ai un empire, et pas d'héritier. »
← **Une case, avec une porte** — effets : direction ++, vestiaire −, set: fils_aulard_staff — *Le fils a un bureau à côté de Vukić. Vukić te dit ce que personne ne te dira : il dîne bien.*
→ **Pas d'héritier chez moi** — effets : direction −−, tribunes +, relation.aulard −1 — *Il remonte en voiture. Le fils te fait un signe par la vitre ; c'est le seul qui ait l'air soulagé.*
**Traces** : fils_aulard_staff · **Réactions déclenchées** : — · **Lu plus tard par** : en.fils_aulard variante « il est déjà dans le staff » (ch. 11), co.vukic_cahier variante « l'adjoint qui dîne avec le fils » (ch. 01, lit `vukic_dauphin`), une.gazette.le_fils_a_une_porte (ch. 20), co.aulard.empire_tiroirs (le fils a rangé les tiroirs)

### SCÈNE co.aulard.empire_cher_collegue  —  Cher collègue
**Rôle** : president · **Intrigue** : co.aulard_empire · **Étape** : 3/4 · **Moment** : saison 2 ou plus, créneaux [8,14] · **Lieu** : le salon de la Ligue, une table ovale ; il a la place au bout, tu as celle en face de Malbec · **Conditions** : `chars.aulard.statut in [club, rival]` ; year >= 1998 (il préside la Ligue) ; variante `_cheque` si `flag('cheque_non_date')` (« vous m'en voulez encore pour le chèque ? »)
**AULARD** *(président de la Ligue — neutre — il te dit « cher collègue » pour la première fois, et il écoute comment ça sonne)*
« Les droits télé, cher collègue : les gros ou les petits, et j'ai besoin de votre voix parce que Malbec a la sienne. J'ai pas le temps, j'ai un empire ; vous en avez un aussi, maintenant. »
← **Je vote avec les gros** — effets : caisse ++, tribunes −, direction +, set: vote_gros, relation.aulard +1 — *Les gros gagnent d'une voix. Malbec note le nom de la voix ; il a un carnet pour ça.*
→ **Je vote avec les petits** — effets : caisse −, tribunes +, set: vote_petits, relation.malbec +1, relation.aulard −1 — *Les petits perdent quand même. Aulard te sourit : il aime savoir où tu es assis.*
**Traces** : vote_gros, vote_petits · **Réactions déclenchées** : co.re.malbec_compris (§ 6) · **Lu plus tard par** : pr.droits_tele (ch. 13 : la répartition lit `vote_gros`), in.congres variante « le bloc Aulard se souvient de ta voix » (ch. 15, lit aussi `president_ami`), co.malbec.lettres_candidat (§ 5 : « vous aviez voté avec lui »), une.quotidien.les_gros_ou_les_petits (ch. 20)

### SCÈNE co.aulard.empire_tiroirs  —  Les tiroirs
**Rôle** : instance · **Intrigue** : co.aulard_empire · **Étape** : 4/4 · **Moment** : toute saison, year >= 2016, créneaux [1,5] · **Lieu** : le bureau de la Fédération, le sien hier ; Josiane pose un carton sur la table · **Conditions** : `chars.aulard.statut in [retraite, rival]` ; `chars.josiane.statut in [staff, retraite]` ; variantes lues dans l'ordre : `flag('cheque_non_date')` → « le double de votre chèque, daté cette fois » ; `flag('vote_gros')` → « la liste des voix qu'il a achetées avec les droits » ; `flag('president_ami')` → « votre nom dans la colonne « les miens » » ; sinon « des brouillons de SMS, avec des fautes »
**JOSIANE** *(secrétaire de la Fédération — neutre — elle ouvre le tiroir du haut du carton, elle ne touche pas au reste)*
« Les tiroirs de monsieur Aulard, des brouillons de SMS avec des fautes, dont le vôtre. J'en ai vu passer, vous savez ; ceux-là, personne ne les a lus. »
← **Je les publie** — effets : tribunes ++, direction −−, parole +1, set: tiroirs_aulard, set: tiroirs_ouverts — *La Gazette titre sur les fautes. Aulard, à la retraite, tweete à 3 h que c'était de l'autocorrection.*
→ **Je referme le carton** — effets : direction +, relation.aulard +1, set: tiroirs_aulard — *Josiane referme. Elle garde le carton chez elle, dans l'ordre ; elle te le rappellera au bon moment.*
**Traces** : tiroirs_aulard, [tiroirs_ouverts] · **Réactions déclenchées** : co.re.josiane_a_lu (∃, ← seulement) · **Lu plus tard par** : in.heritage variante « le prédécesseur avait des tiroirs » (ch. 15, `heritage_empoisonne`), in_showman (epitaph_plus « les tiroirs d'Aulard », ch. 30), co.retrouvailles.aulard_noir (« vous avez ouvert mes tiroirs »), une.gazette.les_fautes_daulard (ch. 20)

---

## INTRIGUE co.josiane_fiche  —  La fiche
**Logline** : Madame Josiane ouvre une fiche cartonnée à ton nom le premier jour, et la referme trente ans plus tard, à la Fédération, en te demandant à qui la donner. · **Synopsis** : Le premier matin, elle veut ta date de naissance et le nom qu'on met sur la porte. Un 6 du mois, la paie du 5 n'est pas tombée : elle le sait avant le distributeur et te demande si tu préviens le vestiaire ou si tu attends le président. Des années plus tard, sélectionneur ou dirigeant, tu la retrouves à la Fédération : elle t'a suivi parce que les dossiers y sont pires, et elle a ta fiche ; Dauzat la réclame pour les archives. En 2022, sa nièce arrive avec le classeur, et la tante téléphone pour dire qu'un fax est arrivé.
**Rôle(s)** : tous · **Postulat(s)** : partagé (le tutoriel de Trébignac est au chapitre 10 ; cette intrigue commence après lui) · **Porteur** : josiane · **Cast** : Josiane, Dauzat, « la petite Josiane » (voix), Gérard (nommé, président amateur) · **Thème** : direction
**Saisons** : "0" (étapes 1-2), "2+" (étapes 3-4) · **Conditions d'entrée** : `chars.josiane.statut in [club, staff]` ; étape 3 : year >= 2008 && role in ['selectionneur','instance'] ; étape 4 : year >= 2022 · **Exclusions** : pas en même temps que `en.salaires` (ch. 11) pour l'étape 2 · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `nom_sur_la_porte` → [fiche_nom] / [fiche_prenom] → étape 3, set-piece `objective` variante « le nom sur la porte » (ch. 30) · `paie_dite` / `paie_attendue` → `paie_dite` (« {annee} : la paie du 5 n'est pas tombée. {nom} l'a dit au vestiaire avant le distributeur. ») → ch. 11 (alarme vestiaire, lit aussi `salaires_retard`), ch. 10 (« le distributeur »), ch. 20 · `fiche_tiroir` / `fiche_archives` → `fiche_josiane` (« {annee} : Josiane a gardé la fiche de {nom} dans son tiroir. Dauzat a les autres. ») → ch. 15 (Dauzat : « il manque une fiche aux archives »), co.dauzat.pv_ordre (§ 5 : la fiche manquante), ch. 20 · `petite_josiane` → `petite_josiane` (« {annee} : la petite Josiane a pris le classeur. La tante appelle pour les fax. ») → ch. 31 (Nouvelle 2022), ch. 30 (set-piece `objective` variante « la nièce sert le café »), ch. 90 (retrouvailles de Josiane après 2022 : la nièce parle)
**Séquencier** : étape 1 `arrivee` (tous, S0 [1,3]) → étape 2 `paie` (joueur | entraineur | ds | president, S0 [7,12] ; variante `_encore` si `flag('salaires_retard')`) → étape 3 `federation` (selectionneur | instance, year >= 2008, [2,6], `at_season +1`) → étape 4 `niece` (tous, year >= 2022)
**Scènes** : 4
**Épilogue** : par abandon, la fiche suit ton dossier chez le suivant (lit `dossier_transmis` si posé) ; l'Almanach écrit « {annee} : la fiche de {nom} a changé de classeur. Josiane l'a portée elle-même. »

### SCÈNE co.josiane.fiche_arrivee  —  Le nom sur la porte
**Rôle** : joueur_amateur | joueur | entraineur | ds | president_amateur | president | selectionneur | instance · **Intrigue** : co.josiane_fiche · **Étape** : 1/4 · **Moment** : saison 0, créneaux [1,3] · **Lieu** : son bureau, la porte ouverte ; une fiche cartonnée vierge, un stylo à bille attaché par une ficelle · **Conditions** : `chars.josiane.statut == club` ; `!flag('fiche_nom') && !flag('fiche_prenom')`
**JOSIANE** *(secrétaire — neutre — elle écrit avant que tu répondes : elle connaît déjà la date)*
« Date de naissance, et le nom qu'on met sur la porte : le nom entier, ou le prénom, comme le précédent ? J'en ai vu passer, vous savez ; ceux qui mettent le prénom restent moins. »
← **Le nom entier** — effets : direction +, set: fiche_nom — *Elle écrit le nom. Elle le vérifie sur ta carte d'identité, sans s'excuser.*
→ **Le prénom, ça suffit** — effets : vestiaire +, set: fiche_prenom — *Elle écrit le prénom. Elle ajoute le nom au crayon, dessous, pour plus tard.*
**Traces** : [fiche_nom], [fiche_prenom] · **Réactions déclenchées** : — · **Lu plus tard par** : co.josiane.fiche_federation (elle relit la fiche), set-piece `objective` variante « le nom sur la porte est au crayon » (ch. 30), co.retrouvailles.josiane_sourire

### SCÈNE co.josiane.fiche_paie  —  Le 6 du mois
**Rôle** : joueur | entraineur | ds | president · **Intrigue** : co.josiane_fiche · **Étape** : 2/4 · **Moment** : saison 0, créneaux [7,12] · **Lieu** : le couloir, sept heures ; elle t'attend avec le relevé du club plié en deux · **Conditions** : `chars.josiane.statut == club` ; variante `_encore` si `flag('salaires_retard')` (« c'est la deuxième fois ; la deuxième, ils vont au distributeur en groupe ») ; variante `_president` si role == 'president' (« c'est vous qu'on attend »)
**JOSIANE** *(secrétaire — neutre — elle parle sans montrer le relevé, elle le garde contre elle)*
« La paie du 5 n'est pas tombée et le distributeur du centre commercial le dira à midi. J'en ai vu passer, vous savez : on prévient le vestiaire, ou on attend le président ? »
← **Je préviens le vestiaire** — effets : vestiaire +, direction −, set: paie_dite — *Tu le dis à Bréhaut avant midi. Le vestiaire râle contre le président, pas contre toi ; c'est la différence.*
→ **J'attends le président** — effets : vestiaire −−, direction +, set: salaires_retard — *Midi, le distributeur. Le vestiaire apprend, et apprend que tu savais.*
**Traces** : paie_dite (et `salaires_retard` ∃ à droite) · **Réactions déclenchées** : co.re.josiane_a_lu (∃) · **Lu plus tard par** : en.alarme.vestiaire_bas_distributeur variante « tu avais prévenu » (ch. 30), en.salaires (ch. 11 : lit `paie_dite` : le vestiaire te croit), jp.distributeur variante (ch. 10), une.echo.le_six_du_mois (ch. 20)

### SCÈNE co.josiane.fiche_federation  —  Elle t'a suivi
**Rôle** : selectionneur | instance · **Intrigue** : co.josiane_fiche · **Étape** : 3/4 · **Moment** : saison 1 ou plus (`at_season +1`), year >= 2008, créneaux [2,6] · **Lieu** : un bureau de la Fédération ; le même radiateur, ou son frère ; ta fiche cartonnée, jaunie, sur le classeur · **Conditions** : `chars.josiane.statut == staff` ; `chars.dauzat.statut in [club, staff]` ; variantes : `flag('fiche_prenom')` → « vous aviez mis le prénom, vous êtes resté quand même » ; `flag('dossier_transmis')` → « j'ai donné votre dossier une fois ; la fiche, non »
**JOSIANE** *(secrétaire de la Fédération — neutre — elle pose la fiche à plat, ta date de naissance dessus, l'encre a passé)*
« Votre fiche de l'époque, {toi}, je l'ai apportée dans mon carton ; monsieur Dauzat la veut pour les archives. J'en ai vu passer, vous savez : celle-là, je préférerais la garder. »
← **Gardez-la dans votre tiroir** — effets : direction +, relation.josiane +1, set: fiche_josiane — *Elle la range. Dauzat inscrit au procès-verbal qu'une fiche manque, sans dire laquelle.*
→ **Aux archives, tout** — effets : direction +, parole +1, relation.dauzat +1 — *Dauzat la classe. Elle est entre celles d'Aulard et de Legruet ; il l'a fait exprès, il dit que non.*
**Traces** : fiche_josiane · **Réactions déclenchées** : co.re.dauzat_pv (§ 6) · **Lu plus tard par** : co.dauzat.pv_ordre (§ 5 : « il manque une fiche, la procureure le sait »), in.heritage variante « les archives sont complètes, sauf une fiche » (ch. 15), co.retrouvailles.josiane_sourire (« c'était le vôtre »), une.echo.la_fiche_de_1990 (ch. 20)

### SCÈNE co.josiane.fiche_niece  —  La petite Josiane
**Rôle** : joueur | entraineur | ds | president_amateur | president | selectionneur | instance · **Intrigue** : co.josiane_fiche · **Étape** : 4/4 · **Moment** : toute saison, year >= 2022, créneaux [1,4] · **Lieu** : le bureau de Josiane, sans Josiane ; une jeune femme avec le même classeur et une autre coiffure · **Conditions** : `chars.josiane.statut == retraite`
**LA PETITE JOSIANE** *(voix sans portrait — nièce, secrétaire — elle décroche le téléphone qui sonne avant de te répondre)*
« C'est ma tante : elle dit qu'un fax est arrivé pour vous, et il n'y a plus de fax depuis douze ans. Elle m'a laissé le classeur ; vous me gardez, ou vous prenez quelqu'un qui n'a pas de tante ? »
← **Vous restez, et le classeur** — effets : direction +, vestiaire +, set: petite_josiane — *Elle raccroche. Elle range ton arrivée sous ton nom ; la tante avait déjà fait la fiche.*
→ **Le poste reste vacant** — effets : caisse +, tribunes −, direction − — *Elle emporte le classeur. Le radiateur tousse pour personne.*
**Traces** : petite_josiane · **Réactions déclenchées** : — · **Lu plus tard par** : co.nv.2022_petite_josiane (ch. 31 : la Nouvelle lit `petite_josiane`), set-piece `objective` variante « la nièce sert le café à l'hôtel du club » (ch. 30), co.retrouvailles.josiane_sourire après 2022 (ch. 90 : la nièce lit la réplique de la tante, avec « elle m'a dit de vous dire »)

---

## INTRIGUE co.lea_carnet  —  Le carnet, au local
**Logline** : Léa te pose une question pour L'Écho, une pour le fax, une pour la Une du Quotidien, et une pour un lecteur du dimanche ; c'est toujours « vous confirmez ? », et c'est toujours toi qui changes. · **Synopsis** : Au local, elle te demande de confirmer que tu restes : c'est pour la rubrique. Directeur sportif ou président, elle a le nom avant le fax et t'appelle à vingt-deux heures. Rédactrice en chef, elle pose *la* question au Congrès, celle que le Quotidien attendait depuis vingt ans, et ta promesse de 1992 est dans son carnet. Revenue à L'Écho, elle t'apporte la lettre d'un lecteur qui parle de toi, et te propose de répondre.
**Rôle(s)** : joueur_amateur, joueur, entraineur, ds, president_amateur, president, selectionneur, instance · **Postulat(s)** : partagé · **Porteur** : lea · **Cast** : Léa, Gégé (nommé), « le stagiaire de l'Écho » (voix), Vence (réaction) · **Thème** : presse
**Saisons** : "0" (étape 1), "1" (étape 2), "2+" (étapes 3-4) · **Conditions d'entrée** : `chars.lea.statut == club` ; étape 3 : year >= 2018 && role in ['instance','selectionneur'] ; étape 4 : year >= 2035 · **Exclusions** : — · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `confirme_reste` → `promesse_echo` (« {annee} : « Je reste », a confirmé {nom} dans L'Écho. Rubrique « Au local ». ») → étape 3, ch. 20 (« Les promesses, datées »), ch. 30 (bilan_carrefour variante « tu l'avais confirmé à L'Écho »), ch. 90 (mémoire des clubs) · `lea_savait` / `lea_niee` → `lea_savait` (« {annee} : Léa avait le nom avant le fax. {nom} a confirmé. ») / `lea_niee` (« {annee} : {nom} a nié à Léa ce que le fax a confirmé une heure après. ») → ch. 12 (ds.fax variante), ch. 20, co.lea.trahison_une_question (variante « vous m'aviez déjà menti une fois ») · `reponse_lea` / `question_esquivee` → `question_lea` (« {annee} : au Congrès, Léa a posé la question. {nom} a répondu, ou pas. ») → ch. 15 (in.congres variante), ch. 30 (Battu au Congrès plus), ch. 20 (priorité 3) · `lettre_echo` → `lettre_echo` (« {annee} : un lecteur a écrit à L'Écho sur {nom}. {nom} a répondu le dimanche. ») → ch. 31 (L'Écho du dimanche, 2040+), ch. 30 (*Ta loge* plus), ch. 90 (lignée)
**Séquencier** : étape 1 `au_local` (joueur_amateur | joueur | entraineur, S0 [5,10]) → étape 2 `avant_le_fax` (ds | president, S1 [2,9], `at_season +1`) → étape 3 `la_question` (instance | selectionneur, year >= 2018, [12,16] ; variantes sur `promesse_echo`, `vote_achete`, `mondial_desert`) → étape 4 `dimanche` (tous, year >= 2035)
**Scènes** : 4
**Épilogue** : par abandon, elle garde le carnet ; l'Almanach écrit « {annee} : Léa a une page au nom de {nom}. Elle n'est pas finie. »

### SCÈNE co.lea.carnet_au_local  —  Au local
**Rôle** : joueur_amateur | joueur | entraineur · **Intrigue** : co.lea_carnet · **Étape** : 1/4 · **Moment** : saison 0, créneaux [5,10] · **Lieu** : le local des ultras, sous la Tribune Nord ; elle a pris une bière pour ne pas déranger, elle ne la boit pas · **Conditions** : `chars.lea.statut == club` ; year < 2018 ; variante `_amateur` si role == 'joueur_amateur' (« vous restez au village ? »)
**LÉA** *(L'Écho — neutre — le carnet ouvert sur le genou, Gégé regarde par-dessus son épaule)*
« C'est pour « Au local », une ligne, pas plus : vous restez la saison prochaine, quoi qu'il arrive ? Vous confirmez ? »
← **Je confirme, je reste** — effets : tribunes +, promise, set: promesse_echo — *Elle écrit « je reste », entre guillemets, avec la date. Gégé la recopie sur le mur, à la craie.*
→ **Je ne confirme rien** — effets : tribunes −, direction +, relation.lea −1 — *Elle écrit « ne confirme pas ». C'est une ligne aussi ; elle passe le dimanche.*
**Traces** : promesse_echo · **Réactions déclenchées** : co.re.gege_decoupe (∃, ← : il découpe la ligne) · **Lu plus tard par** : co.lea.carnet_la_question (« vous aviez confirmé en {annee} »), une.echo.il_reste (ch. 20, « Les promesses, datées »), bilan_carrefour variante « L'Écho a ta promesse » (ch. 30), co.gege_virage variante « la ligne est sur le mur » (ch. 01, lit aussi `pacte_gege`)

### SCÈNE co.lea.carnet_avant_le_fax  —  Vingt-deux heures
**Rôle** : ds | president · **Intrigue** : co.lea_carnet · **Étape** : 2/4 · **Moment** : saison 1 (`at_season +1`), créneaux [2,9] (fenêtre de mercato) · **Lieu** : ton téléphone, vingt-deux heures ; on entend la rotative · **Conditions** : `chars.lea.statut == club` ; year < 2010 (le fax) ; variante `_mail` si year >= 2010
**LÉA** *(L'Écho — neutre — elle dit le nom du joueur avant de dire bonjour)*
« J'ai le nom, le club et l'heure du fax, et je boucle à minuit. Vous confirmez, ou je publie « le club n'a pas souhaité confirmer » sous le nom ? »
← **Je confirme, publiez** — effets : tribunes +, direction −, set: lea_savait — *Elle publie à minuit. Le fax part à 23 h 58 ; le président l'apprend par le journal, comme prévu.*
→ **Je nie, pour ce soir** — effets : direction +, parole −1, set: lea_niee — *Elle publie « n'a pas souhaité confirmer ». À 23 h 58, le fax confirme pour toi.*
**Traces** : lea_savait, lea_niee · **Réactions déclenchées** : co.re.josiane_a_vu_le_fax (§ 6, → seulement) · **Lu plus tard par** : ds.fax variante « Léa avait le nom » (ch. 12), co.lea.trahison_une_question (variante « vous m'aviez déjà menti une fois »), une.echo.lecho_savait (ch. 20), co.lea.carnet_la_question (elle a les deux dates)

### SCÈNE co.lea.carnet_la_question  —  La question
**Rôle** : instance | selectionneur · **Intrigue** : co.lea_carnet · **Étape** : 3/4 · **Moment** : saison 2 ou plus, year >= 2018, créneaux [12,16] (le Congrès, ou la conférence de la liste) · **Lieu** : la salle de presse du Congrès ; elle a le premier rang, le Quotidien l'a toujours · **Conditions** : `chars.lea.statut == club` ; variantes lues dans l'ordre : `flag('vote_achete')` → « les relevés de l'hôtel du Lac » ; `flag('mondial_desert')` → « les ouvriers du chantier » ; `flag('promesse_echo')` → « vous m'aviez confirmé que vous restiez, en {annee} » ; sinon « la question que ce journal n'a jamais posée »
**LÉA** *(rédactrice en chef du Quotidien — neutre — le même carnet qu'au local, la couverture recollée)*
« Une question, la seule que ce journal n'a jamais posée à personne, et je vous la pose : vous saviez, et vous êtes resté quand même ? Vous confirmez ? »
← **Je réponds, en une phrase** — effets : parole +1, tribunes +, direction −, set: question_lea, set: reponse_lea — *Ta phrase est la Une. Elle ne coupe rien ; elle ajoute la date de 1992 en dessous.*
→ **Pas de question d'Écho ici** — effets : tribunes −−, direction +, set: question_lea, relation.lea −1 — *Elle ne relève pas. Le Quotidien titre sur le silence, et sur L'Écho, qu'elle n'a jamais quitté.*
**Traces** : question_lea, [reponse_lea] · **Réactions déclenchées** : co.re.vence_direct (§ 6) · **Lu plus tard par** : in.congres variante « la Une du Quotidien la veille du vote » (ch. 15), Battu au Congrès (epitaph_plus « Léa avait posé la question », ch. 30), une.quotidien.vous_saviez (ch. 20, priorité 3 ; partage la manchette de `une_lea`), co.lea.carnet_dimanche (le lecteur cite la Une)

### SCÈNE co.lea.carnet_dimanche  —  On nous écrit
**Rôle** : joueur | entraineur | ds | president_amateur | president | selectionneur | instance · **Intrigue** : co.lea_carnet · **Étape** : 4/4 · **Moment** : toute saison, year >= 2035, créneaux [3,9] · **Lieu** : L'Écho de {ville}, un dimanche ; elle a soixante-dix ans et le vélo · **Conditions** : `chars.lea.statut == club` ; variante `_question` si `flag('question_lea')` (le lecteur cite la Une du Congrès)
**LÉA** *(L'Écho — sourire — une lettre manuscrite, une enveloppe timbrée, ce qui n'existe plus)*
« Un lecteur de la tribune Est nous écrit sur vous, trois pages, et il termine par une question. Vous confirmez que vous lui répondez, ou je réponds à votre place ? »
← **Je réponds au lecteur** — effets : tribunes +, parole +1, set: lettre_echo — *Ta réponse paraît le dimanche suivant, sous la sienne. Il t'écrit à nouveau ; c'est parti pour durer.*
→ **Répondez pour moi** — effets : direction +, relation.lea +1, set: lettre_echo — *Elle répond. C'est mieux que ce que tu aurais écrit, et plus juste que ce que tu aurais voulu.*
**Traces** : lettre_echo · **Réactions déclenchées** : — · **Lu plus tard par** : L'Écho du dimanche (ch. 31 : rubrique « On nous écrit », 2040-2050), *Ta loge* (epitaph_plus « un lecteur de la tribune Est lui écrivait encore », ch. 30), co.lignee (ch. 90 : la lettre est lue par Sacha à la Succession)

---

## INTRIGUE co.nassir_actif  —  L'actif
**Logline** : Cheikh Nassir t'achète comme joueur, te prête un club frère comme directeur sportif, te prend trente pour cent comme président, et te demande ta voix pour la loi des franchises ; à chaque fois, il ne s'agit pas d'un club. · **Synopsis** : Joueur, il t'offre le banc climatisé d'Al-Dorado. Directeur sportif, chaque recrue doit passer un an par le club frère, et il commence par ton meilleur jeune. Président, il veut trente pour cent, ou, s'il est déjà propriétaire, il t'apporte la décision du conseil. À la Ligue qu'il préside, en 2028, il compte les voix pour la loi des franchises, et la tienne est celle qui manque.
**Rôle(s)** : joueur, ds, president, instance · **Postulat(s)** : partagé (`banc_dore`, `vendre_trente`, `coach_intouchable`, `rachete_fonds`, `tournoi_desert`) ; la chaîne entraîneur existe (`en.nassir.*`, ch. 11) et n'est pas réécrite · **Porteur** : nassir · **Cast** : Nassir, « un émissaire de Qatalyst » (voix), Gégé (nommé), Barbier (nommé), Vialat (réaction) · **Thème** : argent
**Saisons** : "0" (étape 1), "1" (étape 2), "2+" (étapes 3-4) · **Conditions d'entrée** : `chars.nassir.statut in [club, rival]` ; étape 1 : year >= 2000 ; étape 2 : year >= 2011 ; étape 4 : year >= 2028 · **Exclusions** : étape 3 jamais la même saison que `pr.actionnaires` (ch. 13) · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `exil_dore` → `exil_dore` (« {annee} : {nom} est parti au soleil. Le banc était climatisé. ») → ch. 10 (`banc_dore` : le postulat commence par cette trace), ch. 20, ch. 90 (mémoire du club quitté) · `exil_refuse` → [exil_refuse] → étape 3 (« vous aviez refusé ma vitrine ») · `club_frere_pret` / `club_frere_refus` → `club_frere_pret` (« {annee} : le meilleur jeune de {club} a passé un an à Al-Dorado. Prêté par contrat. ») → ch. 12 (mercato variante « il revient bronzé »), ch. 13 (le club frère), ch. 14 (Brissac : « il joue dans le désert »), ch. 20 · `nassir_trente` / `nassir_zero` → `nassir_trente` (« {annee} : Qatalyst a pris trente pour cent de {club}. Le kop a compté. ») / `nassir_zero` (« {annee} : {nom} a refusé les trente pour cent. Le fonds a acheté {rival}. ») → ch. 13 (actionnaires ; cartes de mépris si `ligue_fermee_signee`), ch. 15 (fair-play financier), ch. 20 · `vote_franchises` / `vote_contre_franchises` → `vote_franchises` (« {annee} : {nom} a voté la loi des franchises. Il n'y a plus de descente. ») / `vote_contre_franchises` (« {annee} : {nom} a voté contre les franchises. La loi est passée quand même. ») → ch. 31 (Nouvelle 2040 `monde_franchises`), ch. 30 (fin *La Ligue fermée* plus), ch. 90 (lignée : « ton nom est sur la loi »), ch. 20
**Séquencier** : étape 1 `vitrine` (joueur, year >= 2000, S0+ [6,12]) → étape 2 `club_frere` (ds, year >= 2011, [2,9], `at_season +1`) → étape 3 `trente_pour_cent` (president, [5,12] ; variante `_proprietaire` si `flag('club_actif')`) → étape 4 `franchises` (instance | president, year >= 2028 ; variantes sur `nassir_trente`, `club_a_lancienne`)
**Scènes** : 4
**Épilogue** : par abandon, l'émissaire envoie une lettre : « le fonds a révisé ses positions » ; l'Almanach écrit « {annee} : Qatalyst a révisé ses positions sur {nom}. Par courrier. »

### SCÈNE co.nassir.actif_vitrine  —  La vitrine
**Rôle** : joueur · **Intrigue** : co.nassir_actif · **Étape** : 1/4 · **Moment** : saison 0 ou plus, year >= 2000, créneaux [6,12] · **Lieu** : une loge vide après le match ; une canette orange non ouverte devant toi, une devant lui · **Conditions** : `chars.nassir.statut in [club, rival]` ; `age >= 27`
**NASSIR** *(fonds — neutre — il ne touche pas à la canette : elle est là pour la photo qu'on ne prend pas)*
« Al-Dorado FC a besoin d'un visage connu, {toi}, et le vôtre l'est encore deux ans : trois fois votre salaire, un banc climatisé. Ce n'est pas un club, c'est un actif ; vous seriez sa vitrine. »
← **Je pars au soleil** — effets : caisse +++, tribunes −−, vestiaire −, set: exil_dore, club: {change: true} — *Tu signes dans la loge. Gégé l'apprend par la Gazette ; il découpe ta photo et la retourne contre le mur.*
→ **Je reste, sans vitrine** — effets : tribunes ++, caisse −, set: exil_refuse — *Il range la canette. Il dit qu'il repassera ; il repasse toujours, avec un autre chiffre.*
**Traces** : exil_dore, [exil_refuse] · **Réactions déclenchées** : co.re.gege_decoupe (∃, ←) · **Lu plus tard par** : jp.banc_dore script d'ouverture (ch. 10 : `exil_dore` posée ici remplace l'ancre), co.nassir.actif_trente_pour_cent (variante « vous aviez refusé ma vitrine »), co.memoire_clubs (ch. 90 : « parti au soleil » à −2), une.gazette.la_vitrine (ch. 20)

### SCÈNE co.nassir.actif_club_frere  —  Le club frère
**Rôle** : ds · **Intrigue** : co.nassir_actif · **Étape** : 2/4 · **Moment** : saison 1 ou plus (`at_season +1`), year >= 2011, créneaux [2,9] · **Lieu** : une visioconférence ; derrière lui, une pelouse trop verte pour le climat · **Conditions** : `chars.nassir.statut == club` ; variante `_barbier` si `flag('gamin_barbier')` (le jeune est celui de Barbier ; Barbier téléphone pendant l'appel)
**NASSIR** *(fonds — neutre — un émissaire lui tend une feuille, il ne la lit pas, il la connaît)*
« Chaque recrue passe un an par le club frère, c'est dans le protocole, et nous commençons par votre meilleur jeune. Ce n'est pas un club, c'est un actif : il circule. »
← **Il part un an** — effets : caisse ++, vestiaire −, tribunes −, set: club_frere_pret — *Le jeune part. Il revient bronzé, plus cher, et avec un agent qui parle une langue de plus.*
→ **Il reste ici** — effets : direction −−, tribunes +, set: club_frere_refus, relation.nassir −1 — *L'émissaire note. Le protocole a une page sur les refus ; elle est courte.*
**Traces** : club_frere_pret, [club_frere_refus] · **Réactions déclenchées** : co.re.vialat_recompte (§ 6) · **Lu plus tard par** : ds.mercato fenêtre suivante variante « il revient bronzé » (ch. 12), pr.club_frere (ch. 13, lit aussi `mondial_desert`), sl.liste variante « il joue dans le désert, Brissac n'a pas de chiffres » (ch. 14), co.barbier.doudoune_tableur (§ 5 : « l'algorithme l'a noté là-bas, sous le soleil »)

### SCÈNE co.nassir.actif_trente_pour_cent  —  Trente pour cent
**Rôle** : president · **Intrigue** : co.nassir_actif · **Étape** : 3/4 · **Moment** : saison 2 ou plus, créneaux [5,12] · **Lieu** : ton bureau ; il est venu seul, ce qui veut dire que l'émissaire attend en bas · **Conditions** : `chars.nassir.statut in [club, rival]` ; `!flag('club_actif')` ; variante `_proprietaire` si `flag('club_actif')` (il est ton propriétaire : « le conseil a décidé, je vous l'apporte moi-même ») ; variante `_vitrine` si `flag('exil_refuse')` (« vous aviez refusé d'être ma vitrine ; le club le sera »)
**NASSIR** *(fonds — neutre — un document d'une page, un chiffre : trente)*
« Trente pour cent du club, cher président, contre la dette et le stade rénové ; le kop gardera ses couleurs, c'est écrit. Ce n'est pas un club, c'est un actif, et un actif se partage. »
← **Trente pour cent** — effets : caisse +++, direction −−, tribunes −, set: nassir_trente — *Tu signes. Gégé compte : trente pour cent du kop, ce sont trois cents sièges vides le dimanche.*
→ **Zéro pour cent** — effets : caisse −, tribunes ++, set: nassir_zero, relation.nassir −1 — *Il range la page. Il achète trente pour cent de {rival} le mois suivant, et te le fait savoir.*
Variante `_proprietaire` : « Le conseil a voté votre budget, et il a voté une clause : chaque recrue passe par le club frère. Ce n'est pas un club, c'est un actif ; vous en êtes le gérant. » — ← **Je gère** — effets : caisse ++, direction +, vestiaire −, set: nassir_trente — *Tu gères. Le mot est sur ta porte, à la place de « président ».* → **Je démissionne du conseil** — effets : direction −−, tribunes ++, set: nassir_zero — *Tu démissionnes. Le conseil nomme un gérant. Il ne s'appelle pas président non plus.*
**Traces** : nassir_trente, nassir_zero · **Réactions déclenchées** : co.re.gege_decoupe (∃, ←) · **Lu plus tard par** : pr.actionnaires (ch. 13 : `nassir_trente` change le patron), pr.ligue_fermee cartes de mépris variante « le fonds vote pour toi » (ch. 13, lit `ligue_fermee_signee`), in.fair_play variante « votre club a un actionnaire d'État » (ch. 15), une.gazette.trente_pour_cent (ch. 20), co.nassir.actif_franchises

### SCÈNE co.nassir.actif_franchises  —  La voix qui manque
**Rôle** : instance | president · **Intrigue** : co.nassir_actif · **Étape** : 4/4 · **Moment** : toute saison, year >= 2028, créneaux [12,16] · **Lieu** : la salle de la Ligue ; il préside, la table est ronde maintenant · **Conditions** : `chars.nassir.statut in [club, rival]` ; variantes : `flag('nassir_trente')` → « vous êtes déjà un actif à trente pour cent » ; `flag('club_a_lancienne')` → « vous m'aviez dit « c'est un club », je m'en souviens » ; sinon neutre
**NASSIR** *(président de la Ligue — neutre — il compte les mains levées avec le stylo, sans regarder les visages)*
« Il manque une voix pour la loi des franchises, plus de descente, plus de montée, des clubs qui durent ; la vôtre. Ce n'est pas un club, c'est un actif, et un actif ne descend pas. »
← **Je vote la loi** — effets : direction ++, tribunes −−−, set: vote_franchises — *La loi passe d'une voix. Gégé brûle un abonnement sous tes fenêtres, le sien.*
→ **Je vote contre** — effets : tribunes ++, direction −−, set: vote_contre_franchises — *La loi passe quand même, l'année suivante, avec une autre voix. Tu n'es plus à la table.*
**Traces** : vote_franchises, vote_contre_franchises · **Réactions déclenchées** : co.re.gege_decoupe (∃, ←) · **Lu plus tard par** : co.nv.2040_franchises (ch. 31 : la Nouvelle nomme la voix), fin *La Ligue fermée* (epitaph_plus « la voix qui manquait », ch. 30), co.lignee (ch. 90 : « ton nom est sur la loi »), une.quotidien.la_voix_qui_manquait (ch. 20)

---

## INTRIGUE co.solvang_double_mandat  —  Le double mandat
**Logline** : Ingrid Solvang refuse de représenter deux parties à la fois ; elle te fait choisir ton agent, puis ton prodige, puis ta clause, puis ton entraîneur, et à chaque fois elle compte. · **Synopsis** : Joueur, elle te propose de te représenter à condition que tu quittes Fardelli : elle ne fait pas de double mandat. Entraîneur, elle veut Mbako et sa mère dit non ; elle te demande un mot. Directeur sportif, elle est en face avec un père-agent et une clause absurde sur les voyages hors atmosphère, et elle t'explique qu'elle a compté. Président, elle représente ton entraîneur, dont le préavis expire le jour où Malbec appelle.
**Rôle(s)** : joueur, entraineur, ds, president · **Postulat(s)** : partagé (`pepite`, `fin_de_contrat`, `promu`, `vendre_trente`, `rachete_fonds`) · **Porteur** : solvang · **Cast** : Solvang, Fardelli (nommé), la mère de Mbako, « le père-agent » (voix), Malbec (nommé) · **Thème** : mercato
**Saisons** : "0" (étape 1), "1" (étape 2), "2+" (étapes 3-4) · **Conditions d'entrée** : `chars.solvang.statut in [club, rival]` ; étape 3 : year >= 1995 · **Exclusions** : pas la même saison que `co.fardelli.page_trois_page_une` (les deux agents ne se disputent pas la même semaine) · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `agente_solvang` / `agente_fardelli` → `agente_solvang` (« {annee} : {nom} a quitté Fardelli pour Solvang. Fardelli a gardé la page trois. ») → ch. 10 (les offres arrivent par elle), co.fardelli.page_trois_en_face (variante « vous étiez chez elle »), ch. 20 · `mot_a_la_mere` / `mere_decide` → `solvang_mbako` (« {annee} : Solvang a eu Mbako. {nom} a parlé à la mère. ») → ch. 11 (en.prodige : l'agente est Solvang), ch. 01 (mère de Mbako : « vous lui avez parlé pour elle »), ch. 20 · `clause_spatiale` / `clause_refusee` → `clause_spatiale` (« {annee} : le contrat a une clause sur les voyages hors atmosphère. {nom} l'a signée. ») → ch. 12 (la clause anti-voyage spatial, ∃ dans le plan), ch. 31 (anecdote), ch. 20 · `preavis_double` / `coach_parti` → `coach_parti_solvang` (« {annee} : l'entraîneur de {nom} est parti chez Malbec. Solvang avait le préavis. ») → ch. 13 (pr.coach_vire variante « il est parti tout seul »), co.malbec.lettres_banc_froid (§ 5 : « je vous ai pris votre coach »), ch. 20
**Séquencier** : étape 1 `refuse` (joueur, S0 [4,10]) → étape 2 `mere` (entraineur, S1 [6,12], `at_season +1` ; lit `mbako_mere`) → étape 3 `pere_agent` (ds, year >= 1995, [2,9]) → étape 4 `preavis` (president, [10,15])
**Scènes** : 4
**Épilogue** : par abandon, elle envoie une facture d'honoraires pour les heures de lecture ; l'Almanach écrit « {annee} : Solvang a facturé à {nom} le temps de lire. »

### SCÈNE co.solvang.mandat_refuse  —  Un seul mandat
**Rôle** : joueur · **Intrigue** : co.solvang_double_mandat · **Étape** : 1/4 · **Moment** : saison 0, créneaux [4,10] · **Lieu** : un bureau sans gourmette ni trophée ; deux chaises, un contrat de trois pages, la troisième en premier · **Conditions** : `chars.solvang.statut in [club, rival]` ; `chars.fardelli.statut in [club, rival]`
**SOLVANG** *(agente — neutre — elle pose la page trois dessus, à l'endroit, et attend que tu la lises)*
« Je ne fais pas de double mandat : vous quittez Fardelli, ou vous restez chez lui, mais pas les deux. Mon client décide. Moi, je compte, et je commence par la page trois. »
← **Je signe chez elle** — effets : direction −, caisse +, set: agente_solvang, relation.fardelli −1 — *Fardelli l'apprend par fax. Il garde ta page trois de 1990 ; elle ne s'annule pas.*
→ **Je reste chez Fardelli** — effets : caisse +, set: agente_fardelli — *Elle range le contrat sans le froisser. Elle te dit qu'elle relira le sien avec plaisir, un jour.*
**Traces** : agente_solvang, [agente_fardelli] · **Réactions déclenchées** : co.re.solvang_compte (§ 6, → seulement : elle compte quand même) · **Lu plus tard par** : jp.mercato (ch. 10 : les offres passent par Solvang), co.fardelli.page_trois_en_face (variante « vous étiez chez elle, la page trois vous a suivi »), co.retrouvailles.fardelli_noir, une.quotidien.sans_gourmette (ch. 20)

### SCÈNE co.solvang.mandat_mere  —  Un mot à la mère
**Rôle** : entraineur · **Intrigue** : co.solvang_double_mandat · **Étape** : 2/4 · **Moment** : saison 1 (`at_season +1`), créneaux [6,12] · **Lieu** : la grille du centre de formation ; la mère de Mbako est à vingt mètres, elle a vu Solvang avant toi · **Conditions** : `chars.mbako.statut == club` ; `!flag('mbako_vendu')` ; variante `_agente` si `flag('mbako_mere')` (la mère négocie elle-même : « elle n'a pas besoin de moi, elle l'a dit ; elle a besoin d'une page trois »)
**SOLVANG** *(agente — neutre — un dossier fin, le nom de Mbako dessus, pas de photo)*
« La mère du petit dit qu'il n'a besoin de personne, et elle a raison jusqu'au premier contrat ; un mot de vous, coach, et elle m'écoute. Mon client décide. Moi, je compte. »
← **Je parle à la mère** — effets : direction +, vestiaire −, set: solvang_mbako, relation.mere_mbako −1 — *Tu parles. La mère t'écoute, signe avec Solvang, et t'en veut d'avoir eu raison.*
→ **C'est à la mère de décider** — effets : tribunes +, relation.mere_mbako +1 — *Solvang hoche la tête. La mère signe avec Fardelli le mois suivant ; personne n'a rien décidé.*
**Traces** : solvang_mbako · **Réactions déclenchées** : — · **Lu plus tard par** : en.prodige variante « son agente est Solvang, elle lit tout » (ch. 11), co.mere_trois_pour_cent variante « vous avez parlé pour elle » (ch. 01), co.solvang.trahison_libre (variante « c'est le petit qui part libre »), une.echo.la_mere_a_ecoute (ch. 20)

### SCÈNE co.solvang.mandat_pere_agent  —  La clause spatiale
**Rôle** : ds · **Intrigue** : co.solvang_double_mandat · **Étape** : 3/4 · **Moment** : saison 2 ou plus, year >= 1995, créneaux [2,9] · **Lieu** : ton bureau ; un père en costume trop neuf, sa fille ou son fils de dix-sept ans dans le couloir, Solvang entre les deux · **Conditions** : `chars.solvang.statut in [club, rival]` ; variante `_agente` si `flag('agente_solvang')` (« vous savez comment je compte, vous avez été mon client »)
**SOLVANG** *(agente — neutre — elle lit la clause à voix haute parce que le père n'ose pas)*
« Clause dix-neuf : aucun voyage hors de l'atmosphère pendant la durée du contrat ; le père y tient, il a lu quelque chose. Mon client décide. Moi, je compte, et ça ne coûte rien. »
← **J'accepte la clause** — effets : caisse −, vestiaire +, set: clause_spatiale — *Tu signes la clause dix-neuf. Le père pleure un peu. Le gamin ne va jamais dans l'espace ; il va en D2.*
→ **Pas de clause spatiale** — effets : direction +, tribunes +, set: clause_refusee, react: co.re.solvang_compte — *Le père se lève. Solvang reste assise ; elle a une deuxième version, sans la clause, plus chère.*
**Traces** : clause_spatiale, [clause_refusee] · **Réactions déclenchées** : co.re.solvang_compte (§ 6) · **Lu plus tard par** : ds.mercato offre « le père-agent » (ch. 12 : `clause_spatiale` en variante « il l'a déjà signée ailleurs »), anecdote 31.clause_spatiale (ch. 31 : la clause devient une légende de club), une.gazette.hors_atmosphere (ch. 20), co.solvang.faveur_page_trois

### SCÈNE co.solvang.mandat_preavis  —  Le préavis
**Rôle** : president · **Intrigue** : co.solvang_double_mandat · **Étape** : 4/4 · **Moment** : saison 2 ou plus, créneaux [10,15] · **Lieu** : la loge, un quart d'heure avant le coup d'envoi ; ton entraîneur est en bas, il ne sait pas qu'elle est là · **Conditions** : `chars.solvang.statut in [club, rival]` ; `chars.malbec.statut in [club, rival]`
**SOLVANG** *(agente — neutre — elle te montre une date sur son téléphone, ou sur un agenda papier avant 2007)*
« Le préavis de votre entraîneur expire jeudi et Valentienne appelle vendredi ; je vous le dis parce que je représente aussi votre intérêt à le savoir. Mon client décide. Moi, je compte les jours. »
← **Je double le préavis** — effets : caisse −−, vestiaire +, direction +, set: preavis_double — *Tu signes avant le coup d'envoi. Malbec appelle vendredi quand même, pour te féliciter, entre présidents.*
→ **Qu'il parte s'il veut** — effets : vestiaire −, direction −, tribunes −, set: coach_parti_solvang, char: {entraineur: {statut: rival}} — *Il part. Il gagne le derby en septembre pour Valentienne, et il t'embrasse.*
**Traces** : preavis_double, coach_parti_solvang · **Réactions déclenchées** : co.re.malbec_compris (§ 6) · **Lu plus tard par** : pr.coach_vire variante « il est parti tout seul, le préavis était court » (ch. 13), co.malbec.lettres_banc_froid (§ 5 : le banc froid a pris ton coach), co.klopf_pressing variante « il t'embrasse après le derby de Valentienne » (ch. 01), une.quotidien.le_preavis (ch. 20)

---

## INTRIGUE co.vence_action  —  Vous avez vu l'action ?
**Logline** : Nathalie Vence te demande si tu as vu l'action, et tu réponds pendant quarante ans : en zone mixte, devant le ralenti, après l'élimination, et depuis la direction de l'information. · **Synopsis** : Joueur, la main ou le penalty : « vous avez vu l'action ? ». Entraîneur, « je n'ai pas vu » est devenu un mème et elle te montre le ralenti en direct. Sélectionneur, l'interview de l'élimination : elle a fait pleurer Rossard au même endroit en 1990, et elle tient le micro de la même façon ; si Camille est là, c'est autre chose qui se dit. Directrice de l'information, elle te propose de ne pas diffuser une image contre un direct.
**Rôle(s)** : joueur, entraineur, selectionneur, president, instance · **Postulat(s)** : partagé · **Porteur** : vence · **Cast** : Vence, Rossard (nommé), Camille, Ozanne (voix), Colline (nommé) · **Thème** : presse
**Saisons** : "0" (étape 1), "1" (étape 2), "2+" (étapes 3-4) · **Conditions d'entrée** : `chars.vence.statut == club` ; étape 2 : `flag('vence_pas_vu')` ; étape 3 : le tournoi ; étape 4 : year >= 2020 · **Exclusions** : — · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `vence_franc` / `vence_pas_vu` → `vence_franc` (« {annee} : « J'ai vu, c'était la main. » {nom}, en zone mixte. ») → ch. 10 (le vestiaire a lu), co.colline.vu_main (§ 5 : Colline t'a entendu), ch. 20 · [vence_pas_vu] → étape 2 · `replay_regarde` / `replay_refuse` → `vence_replay` (« {annee} : Vence a repassé le ralenti à {nom}, en direct. Il a regardé. ») → ch. 11 (en.conference variante « le ralenti »), ch. 30 (set-piece `aftermatch` variante), ch. 20 · `larmes_direct` / `sec_direct` → `larmes_direct` (« {annee} : {nom} a pleuré devant Vence après l'élimination. Comme Rossard. ») / `sec_direct` (« {annee} : éliminé, {nom} a répondu sec à Vence. Douze secondes. ») → ch. 14 (l'interview de l'élimination : cette scène *est* la carte ; ch. 14 la cite), ch. 30 (sl_ennemi_public, sl_ambassadeur plus), co.rossard.planche_savon (§ 5), ch. 20 · `exclu_vence` / `tout_diffuse` → `exclu_vence` (« {annee} : Vence a gardé une image contre un direct. {nom} a parlé en premier. ») → ch. 13 (le tweet de 3 h : elle ne le lit pas), ch. 15 (le plateau du Congrès), ch. 20
**Séquencier** : étape 1 `zone_mixte` (joueur, S0 [9,14] après un Grand Match) → étape 2 `ralenti` (entraineur, S1 [3,10], `at_season +1`, `flag('vence_pas_vu')`) → étape 3 `elimination` (selectionneur, le tournoi ; variante `_camille` si `relation.camille >= 2`) → étape 4 `directrice` (president | instance, year >= 2020)
**Scènes** : 4
**Épilogue** : par abandon, elle garde l'image ; l'Almanach écrit « {annee} : Vence a une image de {nom} qu'elle n'a pas diffusée. Ça se revoit. »

### SCÈNE co.vence.action_zone_mixte  —  Zone mixte
**Rôle** : joueur · **Intrigue** : co.vence_action · **Étape** : 1/4 · **Moment** : saison 0, créneaux [9,14], après un Grand Match · **Lieu** : la zone mixte ; une barrière, un micro, un voyant rouge · **Conditions** : `chars.vence.statut == club` ; variante `_colline` si `chars.colline.statut == club` (l'arbitre du match est Colline, et il passe derrière elle)
**VENCE** *(Télé-Stade — neutre — le micro à dix centimètres, elle ne recule pas)*
« On est en direct : la main sur le deuxième but, vous l'avez vue, vous, de là où vous étiez ? Le pays vous regarde répondre. »
← **J'ai vu, c'était la main** — effets : tribunes +, vestiaire −, parole +2, set: vence_franc — *Tu le dis. Le vestiaire l'entend dans le couloir ; le buteur aussi.*
→ **Je n'ai pas vu** — effets : tribunes −, vestiaire +, set: vence_pas_vu — *Tu ne l'as pas vue. La régie repasse l'action pendant que tu le dis. Trois fois.*
**Traces** : vence_franc, [vence_pas_vu] · **Réactions déclenchées** : co.re.colline_vu (§ 6, variante `_colline`) · **Lu plus tard par** : jp.vestiaire_a_lu variante « tu as dit la main » (ch. 10), co.colline.vu_main (§ 5), co.vence.action_ralenti, une.quotidien.il_a_vu_la_main (ch. 20)

### SCÈNE co.vence.action_ralenti  —  Le ralenti
**Rôle** : entraineur · **Intrigue** : co.vence_action · **Étape** : 2/4 · **Moment** : saison 1 (`at_season +1`), créneaux [3,10] · **Lieu** : le bord du terrain, après le match ; un écran de contrôle qu'un cadreur tient à bout de bras · **Conditions** : `chars.vence.statut == club` ; `flag('vence_pas_vu')` ; year >= 1994 (le match du dimanche soir)
**VENCE** *(Télé-Stade — neutre — elle tourne l'écran vers toi, l'action est en pause sur la main)*
« « Je n'ai pas vu », vous l'avez dit trois saisons de suite et c'est devenu une phrase de café ; ce soir on a l'image, et on est en direct. Vous regardez ? »
← **Je regarde, en direct** — effets : tribunes −, parole +1, direction +, set: vence_replay — *Tu regardes. C'était la main. Tu le dis ; le mème change de sens, il devient une punchline.*
→ **Je ne regarde pas** — effets : tribunes −−, relation.vence −1 — *Tu ne regardes pas. L'écran reste tourné vers la caméra ; le pays regarde à ta place.*
**Traces** : vence_replay · **Réactions déclenchées** : co.re.camille_journal (∃, `!flag('divorce')`) · **Lu plus tard par** : en.conference variante « le ralenti de dimanche » (ch. 11), set-piece `aftermatch` variante « Vence a l'image » (ch. 30), une.gazette.il_a_regarde (ch. 20), co.fantome.consultant (ch. 90 : « il n'a pas vu », le mème sur ta plaque)

### SCÈNE co.vence.action_elimination  —  L'élimination
**Rôle** : selectionneur · **Intrigue** : co.vence_action · **Étape** : 3/4 · **Moment** : le tournoi, après le Grand Match perdu (chaîne Tournoi, ch. 14) · **Lieu** : le bord de la pelouse ; le stade se vide ; c'est le même endroit qu'en 1990, elle le sait, tu le sais · **Conditions** : `chars.vence.statut == club` ; `flag('grand_match_perdu')` ; variante `_camille` si `relation.camille >= 2 && !flag('divorce')` (la question devient : « quelqu'un vous attend ? ») ; variante `_rossard` si `chars.rossard.statut in [club, retraite]` (Rossard commente en duplex)
**VENCE** *(Télé-Stade — neutre — le micro plus bas que d'habitude, comme une main tendue)*
« On est en direct, et je ne vous demande pas si vous avez vu l'action ; je vous demande ce que vous dites au pays, là, maintenant. Prenez le temps qu'il faut. »
← **Je pleure, tant pis** — effets : tribunes ++, direction −, vestiaire +, set: larmes_direct — *Tu pleures. Elle baisse le micro. Le pays te pardonne tout, sauf le score.*
→ **Je réponds sec** — effets : tribunes −, direction +, set: sec_direct — *Douze secondes de phrases courtes. Rossard, en duplex, dit qu'à ta place il aurait pleuré.*
Variante `_camille` : « On est en direct, et il y a quelqu'un derrière moi qui vous attend depuis le coup de sifflet. Vous voulez lui dire quelque chose, ou on coupe ? » — ← **Je lui dis, devant tous** — effets : tribunes ++, relation.camille +2, set: larmes_direct, set: demande_en_direct — *Tu lui demandes. Elle dit oui. Vence coupe, pour une fois ; le cadreur, non.* → **On coupe** — effets : direction +, relation.camille −1, set: sec_direct — *On coupe. Camille rentre en voiture ; toi en bus, avec le groupe.*
**Traces** : larmes_direct, sec_direct, [demande_en_direct] · **Réactions déclenchées** : co.re.rossard_plateau (§ 6) · **Lu plus tard par** : sl.tournoi_apres (ch. 14 : la scène *est* l'interview de l'élimination du plan ; ch. 14 la cite par id), sl_ennemi_public et sl_ambassadeur (epitaph_plus, ch. 30), co.camille_naissance variante « la demande en direct » (ch. 01), co.rossard.planche_savon (§ 5), une.quotidien.il_a_pleure (ch. 20, jamais si `divorce` : sensibilité)

### SCÈNE co.vence.action_directrice  —  Une image contre un direct
**Rôle** : president | instance · **Intrigue** : co.vence_action · **Étape** : 4/4 · **Moment** : toute saison, year >= 2020, créneaux [4,12] · **Lieu** : son bureau de directrice, des écrans partout, un seul allumé : le tien · **Conditions** : `chars.vence.statut == club` ; variantes lues dans l'ordre : `flag('phrase_de_trop')` → « la phrase, on l'a encore » ; role == 'president' → « le tweet de 3 h, on l'a » ; sinon « une image du Congrès, un couloir, une enveloppe qui change de main »
**VENCE** *(directrice de l'information — neutre — elle coupe l'écran quand tu entres : c'est une politesse, et une menace)*
« On a une image de vous, et je peux ne pas la diffuser si vous me donnez un direct, demain, vingt heures, sans questions convenues. On est en direct, ou on est en archives : choisissez. »
← **Le direct, demain** — effets : direction +, tribunes +, parole −1, set: exclu_vence — *Tu passes à vingt heures. L'image ne sort pas ; elle est dans un tiroir, et le tiroir a une date.*
→ **Diffusez, je ne troque pas** — effets : tribunes −, direction −, parole +1, set: tout_diffuse — *L'image passe au journal. Elle dure quatre secondes ; on la repasse toute la semaine.*
**Traces** : exclu_vence, [tout_diffuse] · **Réactions déclenchées** : co.re.lea_confirme (§ 6) · **Lu plus tard par** : pr.tweet_3h variante « Vence ne le lit pas à l'antenne » (ch. 13, lit `exclu_vence`), in.congres variante « l'image du couloir » (ch. 15, lit `vote_achete`), in_showman (epitaph_plus « une image contre un direct », ch. 30), une.gazette.larchive (ch. 20)

---

## INTRIGUE co.la_plume_copies  —  Les copies
**Logline** : La Plume n'a pas de visage et a toutes les copies ; elle te prévient par écrit avant chaque samedi, et un jour elle te propose de devenir la source plutôt que le sujet. · **Synopsis** : Joueur, une lettre sans timbre : l'enregistrement du bar d'hôtel existe, ton nom y est, pas encore en titre. Directeur sportif, elle a les mails d'une commission et te demande de confirmer une ligne. Président, sur quatre mille pages d'écoutes, elle t'envoie la page où c'est ta voix. Dirigeant, elle a dix-huit millions de pages sur l'hôtel du Lac, et ton nom n'y est pas encore : elle te propose de lui donner les documents.
**Rôle(s)** : joueur, ds, president, instance · **Postulat(s)** : partagé (jamais `promu` en S0 ; `heritage_empoisonne`, `tournoi_desert`, `elu_surprise`, `geant_dechu`, `rachete_fonds`, `vendre_trente`) · **Porteur** : la_plume · **Cast** : La Plume (par écrit), Amsel (réaction), Maître Vidal (voix), le Rosé (voix) · **Thème** : presse
**Saisons** : "1" (étape 1), "2+" (étapes 2-4) · **Conditions d'entrée** : `season >= 1` ; `parole <= -2 || flag('pisteur') || flag('offshore') || flag('ecoutes') || flag('vote_achete') || flag('enveloppe_promise')` · **Exclusions** : jamais deux étapes dans la même saison ; jamais après un drame · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `source_bar` / `silence_plume` → `source_bar` (« {annee} : {nom} a répondu à La Plume, sans signer. Elle a gardé la lettre. ») → ch. 10 (jp.pari : la brigade ne vient pas), co.amsel.temps_brigade (§ 5), ch. 20 · `ligne_confirmee` / `ligne_niee` → `ligne_confirmee` (« {annee} : une ligne des mails de {club} confirmée par {nom}. Une seule. ») / `ligne_niee` (« {annee} : {nom} a nié une ligne. La Gazette avait la ligne et la réponse. ») → ch. 12 (commission_occulte), ch. 30 (ds_contrats plus), ch. 15 (Amsel lit la Gazette), ch. 20 · `demission_avant` / `attente_samedi` → `demission_avant` (« {annee} : {nom} a démissionné le vendredi. Les écoutes sont sorties le samedi. ») → ch. 13 (pr.ecoutes : la fin *Les écoutes* devient *La démission*), ch. 30, ch. 20 · `documents_donnes` / `documents_gardes` → `lanceur_alerte` (trace ch. 15, posée ici aussi) / `documents_gardes` (« {annee} : {nom} avait les documents de l'hôtel du Lac. Il les a gardés. ») → ch. 15 (in.lanceur_alerte, in.valises), ch. 30 (in_raid, *La radiation* plus), ch. 20
**Séquencier** : étape 1 `bar` (joueur, S1+ [6,12]) → étape 2 `mails` (ds, [3,9], `at_season +1` ; lit `offshore`) → étape 3 `page_2411` (president, [8,14] ; lit `ecoutes`) → étape 4 `dix_huit_millions` (instance, [10,16] ; lit `vote_achete`, `source_plume`)
**Scènes** : 4
**Épilogue** : par abandon, une dernière feuille : « je garde les copies » ; l'Almanach écrit « {annee} : La Plume a gardé les copies de {nom}. Sans date. »

### SCÈNE co.la_plume.copies_bar  —  Le bar de l'hôtel
**Rôle** : joueur · **Intrigue** : co.la_plume_copies · **Étape** : 1/4 · **Moment** : saison 1 ou plus, créneaux [6,12] · **Lieu** : une enveloppe kraft dans ton casier, pas de timbre, une feuille · **Conditions** : `season >= 1` ; `flag('pisteur') || flag('pari')` ; `chars.amsel.statut in [club, staff]`
**LA PLUME** *(par écrit — neutre — trois lignes tapées, pas de signature, le papier de la Gazette)*
« J'ai les documents : l'enregistrement du bar de l'hôtel, quarante minutes, votre voix à la dix-huitième. Vous n'êtes pas le titre, pas encore ; écrivez-moi à cette adresse si vous voulez le rester. »
← **Je lui écris, sans signer** — effets : parole +1, direction −, set: source_bar — *Tu écris. Elle publie la dix-huitième minute sans ton nom ; le nom qu'elle publie, tu le connais.*
→ **Je ne réponds pas** — effets : tribunes −, set: silence_plume — *Samedi, quarante minutes, tous les noms. La brigade vient lundi, à l'entraînement.*
**Traces** : source_bar, [silence_plume] · **Réactions déclenchées** : co.re.amsel_note (§ 6) · **Lu plus tard par** : jp.pari variante « la brigade ne vient pas, quelqu'un a parlé » (ch. 10), co.amsel.temps_brigade (§ 5 : « vous aviez écrit à la Gazette, elle nous l'a dit »), une.gazette.dix_huitieme_minute (ch. 20), co.la_plume.faveur_source

### SCÈNE co.la_plume.copies_mails  —  Une ligne
**Rôle** : ds · **Intrigue** : co.la_plume_copies · **Étape** : 2/4 · **Moment** : saison 2 ou plus (`at_season +1`), créneaux [3,9] · **Lieu** : un mail sans expéditeur, year >= 2000 ; un fax avant · **Conditions** : `season >= 1` ; `flag('offshore') || flag('page_trois_ds')` ; variante `_page_trois` si `flag('page_trois_ds')` (la ligne est la page trois de Fardelli)
**LA PLUME** *(par écrit — neutre — une ligne d'un mail, surlignée, et une question dessous)*
« J'ai les documents : deux cents pages de mails, et une ligne où vous écrivez « on verra pour la date ». Confirmez-la, je publie la ligne ; niez-la, je publie les deux cents pages. »
← **Je confirme la ligne** — effets : direction −−, parole +1, tribunes −, set: ligne_confirmee — *La ligne paraît, seule, entre guillemets. Vialat la recopie dans son cahier, à la ligne douze.*
→ **Je nie, par avocat** — effets : direction +, parole −1, set: ligne_niee — *Maître Vidal nie. Samedi, deux cents pages ; la ligne est en page une, avec la lettre de Maître Vidal.*
**Traces** : ligne_confirmee, ligne_niee · **Réactions déclenchées** : co.re.vialat_recompte (§ 6) · **Lu plus tard par** : ds.commission_occulte (ch. 12 : l'issue lit `ligne_confirmee`), ds_contrats (epitaph_plus « une ligne confirmée », ch. 30), co.amsel.trahison_six_heures (variante « la Gazette a tout, nous avons le reste »), une.gazette.deux_cents_pages (ch. 20)

### SCÈNE co.la_plume.copies_page_2411  —  Page 2 411
**Rôle** : president · **Intrigue** : co.la_plume_copies · **Étape** : 3/4 · **Moment** : saison 2 ou plus, créneaux [8,14] · **Lieu** : ton bureau, un vendredi ; une seule feuille, photocopiée de travers · **Conditions** : `season >= 1` ; `flag('ecoutes')` ; variante `_rival` si `flag('source_plume')` (la voix est celle du président de {rival}, pas la tienne)
**LA PLUME** *(par écrit — neutre — une transcription, deux voix, la tienne est en gras)*
« J'ai les documents : quatre mille pages d'écoutes, et la page 2 411 est la vôtre, avec le nom de l'arbitre. Ça sort samedi ; vous avez jusqu'à vendredi soir pour être quelqu'un d'autre. »
← **Je démissionne vendredi** — effets : direction −−−, tribunes −, parole +1, set: demission_avant — *Tu démissionnes à dix-huit heures. Samedi, la page sort avec « l'ancien président » ; c'est un mot de plus, et c'est tout ce que tu as gagné.*
→ **Je reste, j'attends samedi** — effets : tribunes −−, direction −, set: attente_samedi — *Samedi, le stade lit la page 2 411. Colline, en tribune, la lit aussi ; il te regarde une seconde.*
**Traces** : demission_avant, attente_samedi · **Réactions déclenchées** : co.re.colline_vu (§ 6) · **Lu plus tard par** : pr.ecoutes chaîne (ch. 13 : `demission_avant` remplace la fin *Les écoutes* par *La démission*, ch. 30), co.colline.vu_designateur (§ 5 : « la page 2 411 avait mon nom »), co.amsel.temps_garde_a_vue (§ 5 : elle a la page originale), une.gazette.page_2411 (ch. 20, priorité 3)

### SCÈNE co.la_plume.copies_dix_huit_millions  —  Dix-huit millions de pages
**Rôle** : instance · **Intrigue** : co.la_plume_copies · **Étape** : 4/4 · **Moment** : saison 2 ou plus, créneaux [10,16] · **Lieu** : un mot glissé sous la porte de ta chambre, hôtel du Lac, la veille du vote · **Conditions** : `season >= 1` ; `flag('vote_achete') || flag('amis_bambini') || flag('chaise_montoya')` ; variante `_source` si `flag('source_plume')` (« vous avez déjà été la source une fois »)
**LA PLUME** *(par écrit — neutre — une feuille de l'hôtel, en-tête arraché)*
« J'ai dix-huit millions de pages sur cet hôtel et votre nom n'y est pas encore ; vous pouvez rester absent, ou me donner les documents de la suite d'à côté. J'ai les documents. Presque tous. »
← **Je donne les documents** — effets : tribunes ++, direction −−, parole +1, set: lanceur_alerte — *Tu glisses l'enveloppe sous sa porte ; tu ne sais pas laquelle, tu choisis bien. Samedi, la suite d'à côté est vide.*
→ **Je garde les documents** — effets : direction +, tribunes −, set: documents_gardes — *Tu gardes. Samedi, dix-huit millions de pages, sans toi. La semaine d'après, avec.*
**Traces** : lanceur_alerte (trace ch. 15, posée ici aussi), documents_gardes · **Réactions déclenchées** : co.re.amsel_note (§ 6) · **Lu plus tard par** : in.lanceur_alerte chaîne (ch. 15 : la variante lanceur d'alerte commence ici), in.valises (ch. 15 : `documents_gardes` = tu es dans la chaîne des valises), in_raid et *La radiation* (epitaph_plus, ch. 30), une.gazette.dix_huit_millions (ch. 20, priorité 4)

---

## INTRIGUE co.barbier_doudoune  —  La doudoune
**Logline** : Lucien Barbier te regarde sous la pluie à dix-neuf ans, écrit « trop lent » à vingt-cinq, se bat contre l'algorithme quand tu es son patron, et vend un gamin quinze mille francs et une caisse de vin quand tu es président de village. · **Synopsis** : Amateur, un type en doudoune au bord du terrain : il y a un essai mardi, tu bosses mardi. Pro, son rapport dit « trop lent » et Fardelli en a une copie ; il te propose de courir sous la pluie devant lui. Directeur sportif, il est ton chef du recrutement et le stagiaire a un tableur : le même joueur, deux notes. Président amateur, Valdorne prend ton gamin : le tarif de la Fédération, ou la caisse de vin.
**Rôle(s)** : joueur_amateur, joueur, ds, president_amateur · **Postulat(s)** : partagé (`village_endette`, `lache_academie`, `pepite`, `vendre_trente`, `coupe_du_village`) · **Porteur** : barbier · **Cast** : Barbier, « le stagiaire de Valdorne » (voix, devient « l'algorithme »), Fardelli (nommé), Pichon (nommé), Dédé (nommé) · **Thème** : mercato
**Saisons** : "0" (étape 1), "1" (étape 2), "2+" (étapes 3-4) · **Conditions d'entrée** : `chars.barbier.statut in [club, rival, retraite]` ; étape 3 : year >= 2008 · **Exclusions** : étape 1 jamais la même saison que la Carte Destin amateur → pro (ch. 30 : elle la précède) · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `conge_pose` / `mardi_bosse` → `essai_pro` (∃ ch. 10, posée ici) / `essai_manque` (« {annee} : il y avait un essai à Valdorne mardi. {nom} bossait. ») → ch. 30 (Carte Destin amateur → pro : `essai_manque` retarde d'une saison), ch. 10 (`village_endette`, question `boulot`), ch. 20 · `couru_pluie` / `chiffres_agent` → `couru_pluie` (« {annee} : {nom} a couru sous la pluie devant Barbier. Le rapport a changé. ») → co.barbier.trahison_trop_lent (ne se déclenche pas si posée), ch. 10 (P1 de la pépite : le prix monte), ch. 20 · `oeil_barbier` / `algorithme_adopte` → `oeil_barbier` (« {annee} : {nom} a choisi l'œil de Barbier contre le tableur. Il pleuvait. ») / `algorithme_adopte` (trace ch. 12, posée ici aussi) → ch. 12 (l'algorithme contre l'œil : la suite du réservoir), co.brissac_chiffres variante « les chiffres sont têtus, l'œil aussi » (ch. 01), ch. 20 · `indemnite_vin` / `indemnite_tarif` → `indemnite_vin` (« {annee} : Valdorne a pris le gamin de {ville}. Quinze mille francs et une caisse de vin. ») → ch. 13 (pr.indemnite_formation), ch. 31 (anecdote : la caisse de vin est encore à la buvette), ch. 20
**Séquencier** : étape 1 `mardi` (joueur_amateur, S0 [8,13]) → étape 2 `rapport` (joueur, S1 [2,8], `at_season +1`) → étape 3 `tableur` (ds, year >= 2008, [1,6]) → étape 4 `caisse_de_vin` (president_amateur, [11,16])
**Scènes** : 4
**Épilogue** : par abandon, il écrit un dernier rapport, deux mots ; l'Almanach écrit « {annee} : Barbier a écrit deux mots sur {nom}. Il pleuvait. »

### SCÈNE co.barbier.doudoune_mardi  —  Il y a un essai mardi
**Rôle** : joueur_amateur · **Intrigue** : co.barbier_doudoune · **Étape** : 1/4 · **Moment** : saison 0, créneaux [8,13] · **Lieu** : le bord du terrain de District, sous la pluie ; il est le seul à ne pas être sous l'abri · **Conditions** : `chars.barbier.statut == club` ; year < 2006 ; `age <= 22`
**BARBIER** *(recruteur — neutre — la doudoune fermée jusqu'au menton, un carnet qui a pris l'eau)*
« Je bosse pour Valdorne, petit, et il y a un essai mardi, dix heures, sous la pluie si on a de la chance. Je t'ai vu jouer sous la pluie ; mardi, je veux te voir au sec. »
← **Je pose un jour de congé** — effets : caisse −, direction +, tribunes −, set: essai_pro — *Tu poses le jour. Le patron dit non ; tu y vas quand même. Dédé te prête le minibus.*
→ **Mardi, je bosse** — effets : caisse +, tribunes +, set: essai_manque, relation.barbier −1 — *Tu bosses. Il revient le samedi suivant, sous la pluie, sans rien dire ; il a un autre gamin dans le carnet.*
**Traces** : essai_pro (∃), essai_manque · **Réactions déclenchées** : co.re.pichon_cinq_heures (§ 6) · **Lu plus tard par** : Carte Destin amateur → pro (ch. 30 : `essai_manque` reporte d'une saison ; `essai_pro` l'ouvre), am.village_endette question de saison `boulot` (ch. 10), co.dede_sifflet variante « le minibus de l'essai » (ch. 01), une.echo.un_essai_a_valdorne (ch. 20)

### SCÈNE co.barbier.doudoune_rapport  —  Deux mots
**Rôle** : joueur · **Intrigue** : co.barbier_doudoune · **Étape** : 2/4 · **Moment** : saison 1 (`at_season +1`), créneaux [2,8] · **Lieu** : le parking du centre, après l'entraînement ; il pleut, il attend que ça tombe plus fort · **Conditions** : `chars.barbier.statut in [club, rival]` ; `chars.fardelli.statut in [club, rival]` ; variante `_pluie` si `flag('essai_pro')` (« tu étais au sec, mardi, je m'en souviens »)
**BARBIER** *(recruteur — neutre — il te montre son carnet ouvert : « trop lent », souligné)*
« Mon rapport dit deux mots et ton agent en a une copie, il te vendra moins cher à cause de moi. Je l'ai vu jouer sous la pluie, j'ai écrit ; cours vingt minutes devant moi maintenant, et je réécris. »
← **Je cours sous la pluie** — effets : vestiaire +, tribunes +, set: couru_pluie, relation.barbier +1 — *Tu cours. Il raye un mot ; il en reste un, « lent », puis il raye aussi. Fardelli reçoit le nouveau rapport ; il vend plus cher.*
→ **Mon agent a mes chiffres** — effets : direction −, caisse −, relation.barbier −1 — *Il referme le carnet. Le rapport reste ; il est dans tous les clubs de D1 avant la fin du mois.*
**Traces** : couru_pluie · **Réactions déclenchées** : en.re.fardelli_numero (∃, si role == 'joueur' : Fardelli appelle) · **Lu plus tard par** : co.barbier.trahison_trop_lent (ne se déclenche pas si `couru_pluie`), jp.pepite P1 variante « trois millions et un rapport rayé » (ch. 10), co.brissac_chiffres variante « le chiffre dit lent, l'homme dit qu'il a couru » (ch. 01), une.echo.il_a_couru (ch. 20)

### SCÈNE co.barbier.doudoune_tableur  —  Le tableur
**Rôle** : ds · **Intrigue** : co.barbier_doudoune · **Étape** : 3/4 · **Moment** : saison 2 ou plus, year >= 2008, créneaux [1,6] · **Lieu** : la salle de réunion ; un projecteur, un tableau à colonnes, et Barbier debout, il ne s'assied pas devant un écran · **Conditions** : `chars.barbier.statut in [staff, club]` (il est ton chef du recrutement, ou retraité rappelé) ; variante `_desert` si `flag('club_frere_pret')` (le joueur a été noté « sous le soleil », il n'a jamais vu de pluie)
**BARBIER** *(chef du recrutement — neutre — il éteint le projecteur avec la main, sans chercher le bouton)*
« Le stagiaire le note quatre-vingt-deux, moi je l'ai vu jouer sous la pluie et il ne l'a pas aimée ; c'est le même joueur, patron, et il n'y a qu'une signature. La vôtre. »
← **L'œil de Barbier** — effets : caisse −, force +1, vestiaire +, set: oeil_barbier, relation.barbier +1 — *Tu signes celui de Barbier. Il pleut le jour de la présentation ; le joueur sourit, Barbier note.*
→ **Le tableur** — effets : direction +, caisse +, set: algorithme_adopte, relation.barbier −1 — *Tu signes celui du tableur. Barbier range son carnet dans la doudoune ; il ne le rouvre plus devant toi.*
**Traces** : oeil_barbier, algorithme_adopte (trace ch. 12, posée ici aussi) · **Réactions déclenchées** : co.re.vialat_recompte (§ 6) · **Lu plus tard par** : ds.algorithme réservoir (ch. 12 : `oeil_barbier` ouvre la variante « le stagiaire démissionne » ; `algorithme_adopte` ouvre « le modèle note tout »), co.brissac_chiffres (ch. 01), ds_architecte (epitaph_plus « il avait choisi l'œil », ch. 30), une.quotidien.quatre_vingt_deux (ch. 20)

### SCÈNE co.barbier.doudoune_caisse_de_vin  —  La caisse de vin
**Rôle** : president_amateur · **Intrigue** : co.barbier_doudoune · **Étape** : 4/4 · **Moment** : saison 2 ou plus, créneaux [11,16] · **Lieu** : la buvette du stade municipal ; une caisse de douze bouteilles posée sur le comptoir, Gérard la regarde · **Conditions** : `chars.barbier.statut in [club, rival, retraite]` ; `chars.gerard.statut in [club, staff]`
**BARBIER** *(recruteur — neutre — il pousse la caisse de deux centimètres vers toi, c'est son offre)*
« Valdorne prend votre gamin de quinze ans, président : l'indemnité au tarif de la Fédération dans six mois, ou la caisse de vin tout de suite. Je l'ai vu jouer sous la pluie, il vaut mieux que ça. »
← **La caisse de vin** — effets : caisse +, tribunes +, vestiaire −, set: indemnite_vin — *Gérard ouvre une bouteille pour goûter. Le gamin part lundi ; le village boit à sa santé, douze fois.*
→ **Le tarif de la Fédération** — effets : caisse ++, direction +, relation.barbier −1, set: indemnite_tarif — *Le tarif arrive en avril, par virement. Barbier reprend la caisse ; il la donne à Dédé.*
**Traces** : indemnite_vin, [indemnite_tarif] · **Réactions déclenchées** : co.re.pichon_cinq_heures (§ 6) · **Lu plus tard par** : pr.indemnite_formation (ch. 13 : lit `indemnite_vin` : « la Fédération demande le reçu »), co.gerard_boite variante « la caisse de vin est dans la boîte » (ch. 01), anecdote 31.caisse_de_vin (ch. 31), une.echo.douze_bouteilles (ch. 20)

---

## INTRIGUE co.malbec_deux_lettres  —  Les deux lettres
**Logline** : Hubert Malbec garde deux lettres d'Aulard depuis 1994 et 2008 ; il te débauche, t'achète un capitaine, te montre la lettre qu'il n'a pas envoyée, et te propose de ne pas se présenter contre toi. · **Synopsis** : Entraîneur, il t'appelle à mi-saison : le banc de Valentienne est froid, le contrat est chaud. Directeur sportif, vingt-cinq millions pour ton capitaine, et il sait que le capitaine hésite. Président, trois de ses joueurs ont levé le pied contre toi : il a écrit à la Fédération, il ne l'a pas envoyé, et il te le montre, entre présidents. Candidat contre toi à la Fédération, il sort les deux lettres d'Aulard et t'offre de se retirer contre la répartition des droits.
**Rôle(s)** : entraineur, ds, president, instance · **Postulat(s)** : partagé (`promu`, `interimaire`, `vendre_trente`, `geant_dechu`, `rachete_fonds`, `sous_tutelle`) · **Porteur** : malbec · **Cast** : Malbec, Aulard (nommé), Solvang (nommée), Roux (nommé), Dauzat (réaction) · **Thème** : direction
**Saisons** : "1" (étape 1), "2+" (étapes 2-4) · **Conditions d'entrée** : `chars.malbec.statut in [club, rival, retraite]` ; étape 4 : year >= 2008 · **Exclusions** : étape 3 jamais la même saison que `en.enveloppe` (ch. 11) · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `malbec_ecoute` / `malbec_refuse` → `malbec_ecoute` (« {annee} : {nom} a écouté Valentienne à mi-saison. Le banc était froid. ») → ch. 11 (le président l'apprend : DIRECTION lit la trace), co.aulard.empire_cher_collegue (variante « vous avez écouté Malbec »), ch. 20 · `capitaine_vendu` / `capitaine_garde` → `capitaine_vendu_malbec` (« {annee} : le capitaine de {club} vendu à Valentienne. Vingt-cinq millions. ») → ch. 12 (masse salariale), ch. 01 (Bréhaut : « vous m'avez vendu au Nord »), ch. 13 (Gégé : « le capitaine joue pour eux »), ch. 20 · `dette_malbec` / `lettre_envoyee` → `dette_malbec` (« {annee} : Malbec n'a pas envoyé la lettre. {nom} lui doit une. ») / `fede_dossier` (∃ § 5.2, posée à droite) → ch. 15 (le bloc Malbec vote comme sa dette), co.malbec.lettres_candidat, ch. 20 · `pacte_malbec` / `duel_malbec` → `pacte_malbec` (« {annee} : Malbec s'est retiré contre les droits télé. {nom} a signé. ») / `duel_malbec` (« {annee} : Malbec contre {nom} au Congrès. Les deux lettres d'Aulard sur la table. ») → ch. 15 (in.election : `pacte_malbec` = un candidat de moins ; `duel_malbec` = la Campagne contre lui), ch. 30 (Battu au Congrès plus), ch. 20
**Séquencier** : étape 1 `banc_froid` (entraineur, S1 [8,13]) → étape 2 `vingt_cinq` (ds, [2,9], `at_season +1`) → étape 3 `lettre_non_envoyee` (president, [9,14] ; lit `enveloppe_promise`) → étape 4 `candidat` (instance, year >= 2008, [12,16] ; lit `vote_gros`, `vote_petits`, `voix_malbec`)
**Scènes** : 4
**Épilogue** : par abandon, il classe ta lettre avec les deux autres ; l'Almanach écrit « {annee} : Malbec a une troisième lettre. Elle est de {nom}. »

### SCÈNE co.malbec.lettres_banc_froid  —  Le banc froid
**Rôle** : entraineur · **Intrigue** : co.malbec_deux_lettres · **Étape** : 1/4 · **Moment** : saison 1, créneaux [8,13] · **Lieu** : ton téléphone, un mardi soir ; derrière lui, le vent de la Fosse · **Conditions** : `chars.malbec.statut in [club, rival]` ; `chars.aulard.statut == club` ; variante `_coach_parti` si `flag('coach_parti_solvang')` (il a déjà pris ton coach ailleurs : « je collectionne »)
**MALBEC** *(président de Valentienne — neutre — il parle comme s'il t'avait déjà fait signer)*
« Valentienne a un banc froid et un contrat chaud, cher {prenom}, et votre président ne vous rappelle jamais avant 23 h 47. Entre présidents, on se comprend ; entre vous et moi, on se parle. »
← **J'écoute** — effets : direction −−, caisse +, set: malbec_ecoute — *Tu écoutes vingt minutes. Aulard le sait à 23 h 46 ; il t'envoie un SMS, sans faute, c'est mauvais signe.*
→ **Je reste ici** — effets : direction +, parole +1, set: malbec_refuse — *Tu refuses. Il te rappelle en juin, puis en décembre ; il a un calendrier pour ça.*
**Traces** : malbec_ecoute, [malbec_refuse] · **Réactions déclenchées** : co.re.malbec_compris (§ 6) · **Lu plus tard par** : en.direction (ch. 11 : DIRECTION lit `malbec_ecoute` : « le président sait que tu as écouté »), co.aulard.empire_cher_collegue (variante « vous m'avez quitté pour lui »), co.solvang.mandat_preavis (§ 5), une.gazette.le_banc_froid (ch. 20)

### SCÈNE co.malbec.lettres_vingt_cinq  —  Vingt-cinq millions
**Rôle** : ds · **Intrigue** : co.malbec_deux_lettres · **Étape** : 2/4 · **Moment** : saison 2 ou plus (`at_season +1`), créneaux [2,9] · **Lieu** : le salon de la Ligue, entre deux réunions ; il t'a apporté un café de la machine · **Conditions** : `chars.malbec.statut in [club, rival]` ; `chars.brehaut.statut == club` (le capitaine est Bréhaut) ou `flag('capitaine')` lue sur un autre nom · variante `_ecoute` si `flag('malbec_ecoute')` (« vous m'aviez écouté, une fois »)
**MALBEC** *(président de Valentienne — neutre — il pose une feuille pliée en trois : un chiffre, une signature)*
« Vingt-cinq millions pour votre capitaine, monsieur le directeur, et je sais qu'il hésite parce que son frère me l'a dit. Entre présidents, on se comprend ; entre directeurs, on compte. »
← **Je vends** — effets : caisse +++, vestiaire −−, tribunes −, set: capitaine_vendu_malbec, char: {brehaut: {statut: vendu}} — *Bréhaut part au Nord. Le groupe vit moins bien ; il le dit au journal, avec le tic.*
→ **Il n'est pas à vendre** — effets : tribunes +, direction −, set: capitaine_garde — *Il reprend la feuille. Il la garde pliée ; il te la ressortira le jour où ton capitaine vieillira.*
**Traces** : capitaine_vendu_malbec, [capitaine_garde] · **Réactions déclenchées** : co.re.solvang_compte (§ 6, ← : elle représente le frère) · **Lu plus tard par** : co.brehaut_costume variante « vendu au Nord » (ch. 01), ds.masse_salariale (ch. 12 : le trou), pr.gege variante « le capitaine joue pour Valentienne » (ch. 13), une.quotidien.vingt_cinq_millions (ch. 20)

### SCÈNE co.malbec.lettres_non_envoyee  —  La lettre qu'il n'a pas envoyée
**Rôle** : president · **Intrigue** : co.malbec_deux_lettres · **Étape** : 3/4 · **Moment** : saison 2 ou plus, créneaux [9,14] · **Lieu** : la tribune de la Fosse, deux degrés ; il t'a prêté une écharpe, tu ne l'as pas mise · **Conditions** : `chars.malbec.statut in [club, rival]` ; `flag('enveloppe_promise') || flag('enveloppe_rival')` ; variante `_rien` sinon (il montre une lettre vide : « je n'ai rien contre vous, encore »)
**MALBEC** *(président de Valentienne — neutre — il sort une lettre timbrée, non postée, et te la tend par l'enveloppe)*
« Trois de mes joueurs ont levé le pied contre vous, on me l'a dit, et j'ai écrit à la Fédération ; je ne l'ai pas envoyée. Entre présidents, on se comprend : vous me devez une, ou je la poste. »
← **Je vous dois une** — effets : direction +, parole −1, set: dette_malbec, relation.malbec +1 — *Il range la lettre. Il te dira quand ; ce sera au Congrès, devant Roux.*
→ **Postez-la** — effets : direction −−, tribunes +, parole +1, set: fede_dossier, relation.malbec −1 — *Il la poste depuis le stade. Dauzat accuse réception le lendemain, à 9 h 14.*
**Traces** : dette_malbec (et `fede_dossier` ∃ à droite) · **Réactions déclenchées** : co.re.dauzat_pv (§ 6, →) · **Lu plus tard par** : in.congres variante « Malbec réclame sa dette » (ch. 15, lit `dette_malbec`), en.commission_discipline (ch. 11, lit `fede_dossier`), co.malbec.lettres_candidat (« vous me devez une »), une.quotidien.la_lettre_non_postee (ch. 20)

### SCÈNE co.malbec.lettres_candidat  —  Les deux lettres
**Rôle** : instance · **Intrigue** : co.malbec_deux_lettres · **Étape** : 4/4 · **Moment** : saison 2 ou plus, year >= 2008, créneaux [12,16] (la veille du Congrès électoral) · **Lieu** : la salle des pas perdus ; deux lettres jaunies sur une table basse, 1994 et 2008, signées Aulard · **Conditions** : `chars.malbec.statut in [club, rival, retraite]` ; variantes lues dans l'ordre : `flag('dette_malbec')` → « vous me devez une, je viens la chercher » ; `flag('vote_gros')` → « vous aviez voté avec lui » ; `flag('voix_malbec')` → « je vous avais donné ma voix ; rendez-la-moi » ; sinon neutre
**MALBEC** *(candidat — neutre — il pose la main sur les deux lettres, pas sur la tienne)*
« Il m'a pris un entraîneur en 1994 et une élection en 2008, et je ne veux pas d'une troisième lettre : je me retire contre la répartition des droits, signée ce soir. Entre présidents, on se comprend. »
← **Il se retire, je signe** — effets : direction ++, tribunes −, caisse −, set: pacte_malbec — *Il se retire à dix heures. Tu es élu à onze. Les petits clubs lisent la répartition à midi.*
→ **Qu'il se présente** — effets : direction −, parole +1, set: duel_malbec — *Il se présente. Roux compte les districts à voix haute ; ça dure jusqu'au soir.*
**Traces** : pacte_malbec, duel_malbec · **Réactions déclenchées** : co.re.roux_base (§ 6) · **Lu plus tard par** : in.election (ch. 15 : `pacte_malbec` retire un candidat ; `duel_malbec` ouvre la Campagne contre lui), Battu au Congrès (epitaph_plus « Malbec avait deux lettres, et la troisième », ch. 30), co.retrouvailles.malbec_noir, une.quotidien.les_deux_lettres (ch. 20)

---

## INTRIGUE co.montoya_table  —  La table
**Logline** : Don Alvaro Montoya te propose une chaise à chaque rôle, et son fils reprend la table quand il meurt dessus. · **Synopsis** : Joueur, le transfert du siècle et un pont pour le passer. Entraîneur, il t'appelle la veille du derby : le Real a besoin d'un míster mardi. Président, le premier dîner des douze, et une chaise que Gégé photographiera. Dirigeant, après 2027, le fils vient demander à l'Union une chaise pour la Ligue fermée, avec la même phrase que le père.
**Rôle(s)** : joueur, entraineur, president, instance · **Postulat(s)** : partagé (`pepite`, `banc_dore`, `six_mois`, `rachete_fonds`, `tournoi_desert`, `elu_surprise`) · **Porteur** : montoya · **Cast** : Montoya, « le fils de Montoya » (voix), Gégé (nommé), Bambini (nommé), Nassir (nommé) · **Thème** : instances
**Saisons** : "0" (étape 1), "1" (étape 2), "2+" (étapes 3-4) · **Conditions d'entrée** : `chars.montoya.statut in [club, rival]` ; étape 3 : year >= 2010 ; étape 4 : year >= 2027 · **Exclusions** : étape 3 jamais la même saison que la chaîne des 48 heures (ch. 13) · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `transfert_siecle` / `reste` → `transfert_siecle` (« {annee} : {nom} au Real Montoya. Le transfert du siècle, et un pont. ») → ch. 10 (le club change de pays : Castellane), ch. 90 (mémoire du club quitté), ch. 20 (« LE PONT ») · `derby_abandonne` / `derby_dabord` → `derby_abandonne` (« {annee} : {nom} a pris l'avion la veille du derby. Le Real appelait. ») → ch. 11 (co.derby : le derby se joue sans toi), ch. 01 (Gégé : « la tribune n'oublie rien »), ch. 20 · `assis_diner` / `debout_diner` → `assis_diner` (« {annee} : {nom} a dîné à la table des douze. Assis. ») → ch. 13 (la chaîne des 48 heures commence à l'heure 1 avec une chaise), co.montoya.faveur_assis (ne se déclenche pas si posée : la chaise est déjà tirée), ch. 20 · `chaise_fils` / `fils_debout` → `fils_montoya_chaise` (« {annee} : le fils de Montoya a eu une chaise à l'Union. {nom} l'a tirée. ») → ch. 15 (in.bloc_des_douze après 2027), ch. 30 (fin *La Ligue fermée* plus), ch. 20
**Séquencier** : étape 1 `pont` (joueur, S0+ [6,12]) → étape 2 `veille_du_derby` (entraineur, S1 [10,14], `at_season +1`) → étape 3 `diner` (president, year >= 2010, [4,10]) → étape 4 `fils` (instance, year >= 2027, [8,14] ; lit `ligue_fermee_signee`, `chaise_montoya`, `exclu_de_la_table`)
**Scènes** : 4
**Épilogue** : par abandon, la chaise reste vide, on ne la donne pas ; l'Almanach écrit « {annee} : une chaise vide à la table de Montoya. Elle était pour {nom}. »

### SCÈNE co.montoya.table_pont  —  Le pont
**Rôle** : joueur · **Intrigue** : co.montoya_table · **Étape** : 1/4 · **Moment** : saison 0 ou plus, créneaux [6,12] · **Lieu** : un salon d'hôtel à la capitale ; il a fait venir une table, sa table, pour la réunion · **Conditions** : `chars.montoya.statut in [club, rival]` ; `force >= 60` ou `flag('galactique')`
**MONTOYA** *(président du Real — neutre — il te montre une chaise vide de la main ; il ne se lève pas)*
« Le Real paie ce que votre club demande et le double de ce que vous gagnez ; c'est le transfert du siècle, chico, et le pont pour le passer. Douze clubs, une table : vous êtes assis ou debout ? »
← **Je m'assieds** — effets : caisse +++, tribunes −−, set: transfert_siecle, club: {change: true} — *Tu t'assieds. Le pont, c'est un chèque à ton club, un à ton agent, et un à quelqu'un que tu ne connais pas.*
→ **Je reste debout, ici** — effets : tribunes ++, caisse −, relation.montoya −1 — *Tu restes debout. Il fait retirer la chaise ; il ne repropose jamais deux fois, c'est sa légende.*
**Traces** : transfert_siecle · **Réactions déclenchées** : co.re.gege_decoupe (∃, ←) · **Lu plus tard par** : jp.mercato (ch. 10 : le club devient le Real Montoya, Castellane), co.memoire_clubs (ch. 90 : « le transfert du siècle » à −1 chez le club quitté), une.gazette.le_pont (ch. 20), co.montoya.table_diner (« vous avez déjà été assis chez moi »)

### SCÈNE co.montoya.table_veille_du_derby  —  La veille du derby
**Rôle** : entraineur · **Intrigue** : co.montoya_table · **Étape** : 2/4 · **Moment** : saison 1 (`at_season +1`), créneaux [10,14], la veille du derby · **Lieu** : ton téléphone, à l'hôtel de mise au vert ; le groupe dort, ou fait semblant · **Conditions** : `chars.montoya.statut in [club, rival]` ; `tribunes >= 55` (le derby compte)
**MONTOYA** *(président du Real — neutre — il ne demande pas si tu es libre : il dit l'heure du vol)*
« Le Real a besoin d'un míster mardi et l'avion part demain à dix heures, pendant votre derby ; on ne vous le proposera pas deux fois. Douze clubs, une table : assis ou debout ? »
← **Je prends l'avion** — effets : direction −−, tribunes −−−, caisse ++, set: derby_abandonne, club: {change: true} — *Tu prends l'avion. Le derby se joue sans toi ; la bâche a ton nom, rayé.*
→ **Après le derby** — effets : parole +1, tribunes +, set: derby_dabord, relation.montoya −1 — *Tu restes. Le Real prend Klopf mardi. Le derby, tu le perds ou tu le gagnes, mais tu y es.*
**Traces** : derby_abandonne, [derby_dabord] · **Réactions déclenchées** : co.re.gege_decoupe (∃, ←) · **Lu plus tard par** : co.derby variante « le coach est parti la veille » (ch. 11, pose aussi `derby_perdu` par forfait de banc), co.gege_virage (ch. 01 : « la tribune n'oublie rien, surtout la veille »), co.klopf_pressing variante « le Real l'a pris à ta place » (ch. 01), une.gazette.lavion_de_dix_heures (ch. 20)

### SCÈNE co.montoya.table_diner  —  Le premier dîner
**Rôle** : president · **Intrigue** : co.montoya_table · **Étape** : 3/4 · **Moment** : saison 2 ou plus, year >= 2010, créneaux [4,10] · **Lieu** : une salle de restaurant privatisée ; douze couverts, onze présidents, une chaise sans carton · **Conditions** : `chars.montoya.statut in [club, rival]` ; `!flag('ligue_fermee_signee')` ; variante `_deja` si `flag('transfert_siecle')` (« vous avez déjà été assis chez moi, chico ; président, on dit ami »)
**MONTOYA** *(président du Real — neutre — il fait signe au serveur d'apporter le douzième carton, vierge, avec un stylo)*
« Onze présidents dînent ici une fois par an, et la douzième chaise n'a pas de carton depuis trois ans ; écrivez votre nom, ou ne l'écrivez pas. Douze clubs, une table. »
← **J'écris mon nom** — effets : direction +, tribunes −, caisse +, set: assis_diner — *Tu écris. Le serveur photographie la table pour Montoya ; la Gazette a la photo le lendemain, avec un cercle rouge.*
→ **Je dîne debout, au bar** — effets : tribunes +, direction −, set: debout_diner — *Tu dînes au bar. Nassir vient te parler ; il n'est pas assis non plus, il possède le restaurant.*
**Traces** : assis_diner, [debout_diner] · **Réactions déclenchées** : co.re.gege_decoupe (∃, ← : il découpe la photo et entoure la chaise) · **Lu plus tard par** : pr.ligue_fermee heure 1 (ch. 13 : `assis_diner` = tu es à la table quand ça commence), co.montoya.faveur_assis (ne se déclenche pas si `assis_diner`), in.bloc_des_douze (ch. 15), une.gazette.la_douzieme_chaise (ch. 20)

### SCÈNE co.montoya.table_fils  —  Le fils
**Rôle** : instance · **Intrigue** : co.montoya_table · **Étape** : 4/4 · **Moment** : toute saison, year >= 2027, créneaux [8,14] · **Lieu** : ton bureau de l'Union ; le fils a apporté une chaise pliante, il l'ouvre lui-même · **Conditions** : `chars.montoya.statut == parti` (mort en 2027) ; variantes lues dans l'ordre : `flag('exclu_de_la_table')` → « mon père vous avait retiré la chaise ; je vous la rends » ; `flag('chaise_montoya')` → « vous étiez à sa droite ; je suis à sa place » ; `flag('ligue_fermee_signee')` → « vous aviez signé ; l'Union peut signer aussi »
**LE FILS DE MONTOYA** *(voix sans portrait — il a la phrase du père et pas la voix)*
« Mon père est mort à la table en votant, et il m'a laissé la phrase : douze clubs, une table ; l'Union a-t-elle une chaise pour la Ligue, ou pas ? Je m'assieds si vous dites oui. »
← **Une chaise à l'Union** — effets : direction −, caisse ++, tribunes −−, set: fils_montoya_chaise — *Il s'assied. La Ligue fermée a un siège au comité ; six clubs tiennent, et les six sont contents.*
→ **Pas de chaise** — effets : tribunes +, direction +, caisse −, relation.montoya −1 — *Il replie la chaise. Il l'emporte ; il reviendra avec, chaque année, c'est sa légende à lui.*
**Traces** : fils_montoya_chaise · **Réactions déclenchées** : — · **Lu plus tard par** : in.bloc_des_douze après 2027 (ch. 15 : le bloc a un siège ou non), fin *La Ligue fermée* (epitaph_plus « le fils avait une chaise pliante », ch. 30), co.nv.2027_montoya (ch. 31 : la Nouvelle de sa mort lit la trace l'année suivante), une.quotidien.la_chaise_pliante (ch. 20)

---

## INTRIGUE co.dupuis_nom_dans_le_dos  —  Le nom dans le dos
**Logline** : Dupuis veut son nom dans le dos ; il paie la tournée pour que son fils joue, le maillot rose pour choisir le capitaine, dix millions pour le stade, et le club joue en rose à son enterrement, par respect ou par contrat. · **Synopsis** : Amateur, il paie la tournée et te demande de faire jouer le fils, qui joue mal. Président de village, le maillot rose « DUPUIS » vaut cinq mille francs et un capitaine de son choix. Président pro, en 2015, le boucher est un magnat des surgelés : Arena Dupuis, dix millions, et Gégé qui refuse de prononcer le nom. À sa mort, le fils demande que le club joue en rose ce jour-là.
**Rôle(s)** : joueur_amateur, president_amateur, president, entraineur · **Postulat(s)** : partagé (`village_endette`, `fusion_imposee`, `coupe_du_village`, `geant_dechu`, `rachete_fonds`) · **Porteur** : dupuis · **Cast** : Dupuis, « le fils de Dupuis » (voix), Gégé (nommé), Dédé (nommé), Paulette (nommée) · **Thème** : absurde
**Saisons** : "0" (étape 1), "1" (étape 2), "2+" (étapes 3-4) · **Conditions d'entrée** : `chars.dupuis.statut in [club, rival, retraite]` ; étape 3 : year >= 2015 ; étape 4 : year >= 2034 · **Exclusions** : étape 2 jamais la même saison que `pr.maillot_rose` (ch. 13, PA-03 : cette scène en est la suite) · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `fils_joue` / `fils_banc` → `fils_dupuis_joue` (« {annee} : le fils Dupuis a joué. Il a raté un penalty ; la tournée était payée. ») → ch. 10 (am.match : le fils est dans le onze), ch. 13 (Dupuis veut choisir le capitaine : « et mon fils, il l'a été »), ch. 20 · `capitaine_dupuis` / `capitaine_vestiaire` → `capitaine_dupuis` (« {annee} : le boucher a choisi le capitaine de {club}. Il porte du rose. ») → ch. 13 (PA-03 suite), ch. 01 (Dédé : « le brassard sent le cochon »), ch. 20 · `arena_dupuis` / `dupuis_refuse_arena` → `naming_signe` (∃ § 5.2, posée ici côté Dupuis) + `arena_dupuis` (« {annee} : le stade de {ville} s'appelle Arena Dupuis. Gégé dit « le stade ». ») → ch. 13 (le naming côté bureau), ch. 31 (Nouvelle 2015), ch. 01 (Gégé refuse le nom), ch. 20 · `rose_enterrement` / `couleurs_gardees` → `rose_enterrement` (« {annee} : {club} a joué en rose pour l'enterrement de Dupuis. Par respect, ou par contrat. ») → ch. 31 (l'enterrement, une ligne), ch. 90 (mémoire des clubs : le maillot rose est dans la vitrine), ch. 20
**Séquencier** : étape 1 `tournee` (joueur_amateur, S0 [4,9]) → étape 2 `capitaine` (president_amateur, S1 [3,8], `at_season +1`) → étape 3 `arena` (president, year >= 2015, [5,11] ; lit `naming_signe`) → étape 4 `rose` (tous, year >= 2034)
**Scènes** : 4
**Épilogue** : par abandon, le maillot rose reste dans le carton ; l'Almanach écrit « {annee} : un carton de maillots roses chez Dupuis. Le nom de {nom} n'est pas dessus. »

### SCÈNE co.dupuis.dos_tournee  —  La tournée
**Rôle** : joueur_amateur · **Intrigue** : co.dupuis_nom_dans_le_dos · **Étape** : 1/4 · **Moment** : saison 0, créneaux [4,9] · **Lieu** : le bistrot du village, après le match ; il a posé un billet sur le comptoir et sa main dessus · **Conditions** : `chars.dupuis.statut == club` ; `chars.dede.statut in [club, staff]`
**DUPUIS** *(boucher — neutre — il désigne son fils du menton ; le fils regarde ses chaussures)*
« La tournée est pour moi, petit, et dimanche prochain mon gars joue, tu le diras à Dédé qui ne m'écoute pas. Le meilleur du cochon, et je pèse mes mots : il joue. »
← **Je le dis à Dédé** — effets : caisse +, vestiaire −, tribunes +, set: fils_dupuis_joue — *Dédé le fait jouer, à droite, loin du ballon. Le ballon vient quand même ; c'est un penalty, et c'est raté.*
→ **Dédé fait l'équipe** — effets : vestiaire +, relation.dupuis −1, caisse − — *Il retire la main du billet, puis le billet. La tournée est pour toi ; il pèse le prix.*
**Traces** : fils_dupuis_joue · **Réactions déclenchées** : co.re.pichon_cinq_heures (§ 6) · **Lu plus tard par** : co.dede_sifflet variante « le neveu du président, et maintenant le fils du boucher » (ch. 01), am.match Carte Match variante « le fils Dupuis est dans le onze » (ch. 10), co.dupuis.dos_capitaine (« il a joué, il peut être capitaine »), une.echo.le_fils_a_joue (ch. 20)

### SCÈNE co.dupuis.dos_capitaine  —  Le brassard rose
**Rôle** : president_amateur · **Intrigue** : co.dupuis_nom_dans_le_dos · **Étape** : 2/4 · **Moment** : saison 1 (`at_season +1`), créneaux [3,8] · **Lieu** : la buvette ; un brassard rose sur le comptoir, brodé « DUPUIS » aussi · **Conditions** : `chars.dupuis.statut == club` ; `flag('boucher_sponsor')` ou maillot rose signé (ch. 13) ; variante `_fils` si `flag('fils_dupuis_joue')` (« il a joué, il a raté, il a le droit »)
**DUPUIS** *(boucher-sponsor — neutre — il tend le brassard comme un morceau qu'il aurait choisi)*
« Cinq mille francs de maillots, président, et je ne demande qu'une chose : le capitaine, c'est moi qui le choisis, et il porte ça. Le meilleur du cochon, et je pèse mes mots. »
← **Il choisit le capitaine** — effets : caisse ++, vestiaire −−, set: capitaine_dupuis — *Il choisit son fils. Le vestiaire vote un autre capitaine, en secret, sans brassard ; ça tient toute la saison.*
→ **Le vestiaire choisit** — effets : caisse −, vestiaire +, relation.dupuis −1 — *Il reprend le brassard. Les maillots restent ; le nom aussi, un peu plus petit qu'avant, il a téléphoné au brodeur.*
**Traces** : capitaine_dupuis · **Réactions déclenchées** : — · **Lu plus tard par** : pr.maillot_rose suite (ch. 13 : PA-03 lit `capitaine_dupuis`), co.dede_sifflet (ch. 01 : « le brassard sent le cochon »), pa_buvette (epitaph_plus « le capitaine était rose », ch. 30), une.echo.le_brassard_rose (ch. 20)

### SCÈNE co.dupuis.dos_arena  —  Arena Dupuis
**Rôle** : president · **Intrigue** : co.dupuis_nom_dans_le_dos · **Étape** : 3/4 · **Moment** : saison 2 ou plus, year >= 2015, créneaux [5,11] · **Lieu** : ton bureau ; il est venu en costume, il a gardé le tablier plié dans la poche, ça se voit · **Conditions** : `chars.dupuis.statut in [club, rival]` ; variante `_qatalyst` si `flag('naming_signe')` (« le stade s'appelle déjà comme une boisson ; je paie plus »)
**DUPUIS** *(magnat des surgelés — neutre — un chèque de dix millions d'écus, signé, et une maquette de plaque)*
« Dix millions pour dix ans, et le stade s'appelle Arena Dupuis, avec la tête de cochon en petit, je ne suis pas fou. Le meilleur du surgelé, et je pèse mes mots : dix millions. »
← **Arena Dupuis** — effets : caisse +++, tribunes −−, direction +, set: naming_signe, set: arena_dupuis — *La plaque est posée un mardi. Gégé dit « le stade » ; Paulette dit « la tribune Est » ; personne ne dit le nom.*
→ **Le stade garde son nom** — effets : tribunes ++, caisse −, set: dupuis_refuse_arena, relation.dupuis −1 — *Il range le chèque. Il achète le nom du stade de {rival} le mois suivant ; c'est immonde, et c'est sur toutes les photos.*
**Traces** : naming_signe (∃), arena_dupuis, [dupuis_refuse_arena] · **Réactions déclenchées** : co.re.gege_decoupe (∃, ←) · **Lu plus tard par** : co.nv.2015_arena_dupuis (ch. 31), pr.naming côté bureau (ch. 13 : `arena_dupuis` = le naming est celui de Dupuis, pas de Qatalyst), co.gege_virage variante « il ne dit pas le nom » (ch. 01), une.gazette.arena_cochon (ch. 20)

### SCÈNE co.dupuis.dos_rose  —  En rose
**Rôle** : joueur | entraineur | ds | president_amateur | president · **Intrigue** : co.dupuis_nom_dans_le_dos · **Étape** : 4/4 · **Moment** : toute saison, year >= 2034, créneaux [2,8] · **Lieu** : le parking du stade ; le fils de Dupuis a apporté un carton, le même qu'en 1990, les maillots ont jauni · **Conditions** : `chars.dupuis.statut == parti` ; variante `_contrat` si `flag('arena_dupuis')` (« c'est dans le contrat de naming, article douze : un match en rose »)
**LE FILS DE DUPUIS** *(voix sans portrait — il n'a pas le tablier, il a le carton)*
« Mon père est mort hier et il pesait ses mots jusqu'au bout : le club en rose dimanche, avec son nom. Je ne demande pas si c'est dans le contrat ; je demande si vous le faites. »
← **En rose, dimanche** — effets : tribunes +, vestiaire −, set: rose_enterrement — *Le club joue en rose. Le stade a l'air d'une boucherie le dimanche matin ; le fils pleure, et Gégé porte le maillot, une fois.*
→ **Aux couleurs du club** — effets : direction −, caisse −, tribunes − — *Le club joue en bleu. Le fils dépose le carton devant la tribune ; il y reste tout le match, personne n'ose le déplacer.*
**Traces** : rose_enterrement · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 31 (l'enterrement de Dupuis, une ligne : « {club} jouait en rose »), co.memoire_clubs (ch. 90 : le maillot rose dans la vitrine du club), « la petite Paulette » (voix, ch. 01) lit la ligne à la 14B, une.echo.en_rose (ch. 20)

---

## INTRIGUE co.aubert_argent_public  —  Argent public
**Logline** : Madame Aubert paie le synthétique contre le nom de la ville, te loue le stade qu'elle a fait construire, entre dans le vestiaire des Cobalts en tant que ministre, et propose un délégué du gouvernement à la Fédération sous tutelle. · **Synopsis** : Président de village, le synthétique est voté si le club prend le nom de la ville et le fils de la maire. Président pro, le nouveau stade est à elle : tu seras locataire, et elle en choisit le nom, même si Qatalyst l'a déjà acheté. Sélectionneur, elle est ministre et veut entrer dans le vestiaire avant le match. Dirigeant, la Fédération est sous tutelle : c'est son dossier, et le délégué qu'elle propose a un bureau prêt.
**Rôle(s)** : president_amateur, president, selectionneur, instance · **Postulat(s)** : partagé (`fusion_imposee`, `coupe_du_village`, `geant_dechu`, `rachete_fonds`, `pays_emergent`, `apres_fiasco`, `sous_tutelle`) · **Porteur** : aubert · **Cast** : Aubert, « le fils Aubert » (voix), Nassir (nommé), Fauvel (nommé), Dauzat (réaction) · **Thème** : instances
**Saisons** : "0" (étape 1), "1" (étape 2), "2+" (étapes 3-4) · **Conditions d'entrée** : `chars.aubert.statut in [club, rival, staff]` ; étape 3 : year >= 2002 && year < 2012 (`aubert_ministre`) ; étape 4 : year >= 2013 · **Exclusions** : étape 1 jamais la même saison que `pr.fusion` (ch. 13) · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `synthetique_fils` / `boue_gardee` → `synthetique_fils` (« {annee} : le synthétique de {ville}, contre le nom et le fils de la maire. ») / `boue_gardee` (« {annee} : {club} a gardé la boue et son nom. La maire a gardé le budget. ») → ch. 13 (le nom du club dans les cartes suivantes ; la fusion « recommandée » par Roux lit `boue_gardee`), ch. 10 (Dédé : « on a le fils de la maire à droite »), ch. 20 · `stade_locataire` / `stade_prive` → `stade_locataire` (« {annee} : {club} est locataire de son stade. La ville a choisi le nom. ») / `stade_prive` (« {annee} : {nom} a promis un stade privé. La ville attend. ») → ch. 13 (pr.stade : le loyer chaque saison ; `stade_prive` = promesse publique), co.dupuis.dos_arena (« le stade est à la ville, le nom aussi »), ch. 20 · `ministre_vestiaire` / `vestiaire_ferme` → `ministre_vestiaire` (« {annee} : la ministre est entrée dans le vestiaire des Cobalts. Avant le match. ») → ch. 14 (le fils du ministre : « elle l'a vu de près »), ch. 01 (Fauvel : « on est un groupe, pas une réception »), ch. 20 · `delegue_accepte` / `tutelle_refusee` → `delegue_accepte` (« {annee} : un délégué du gouvernement au comité de la Fédération. {nom} a dit oui. ») / `tutelle_refusee` (« {annee} : {nom} a refusé le délégué. La FédéMonde a écrit. ») → ch. 15 (`sous_tutelle` : question de saison `ministre / fedemonde / districts`), ch. 30 (fin *Le Ministre* plus ; *La suspension du pays*), ch. 20
**Séquencier** : étape 1 `synthetique` (president_amateur, S0 [5,11]) → étape 2 `locataire` (president, S1 [4,10], `at_season +1` ; lit `naming_signe`) → étape 3 `vestiaire` (selectionneur, 2002-2011, la veille d'un Grand Match) → étape 4 `delegue` (instance, year >= 2013, [2,7])
**Scènes** : 4
**Épilogue** : par abandon, la délibération est reportée « à la prochaine séance » ; l'Almanach écrit « {annee} : la ville a reporté le dossier de {nom}. À la prochaine séance. »

### SCÈNE co.aubert.public_synthetique  —  Le synthétique
**Rôle** : president_amateur · **Intrigue** : co.aubert_argent_public · **Étape** : 1/4 · **Moment** : saison 0, créneaux [5,11] · **Lieu** : la salle du conseil ; un plan du terrain déroulé, une ligne budgétaire surlignée · **Conditions** : `chars.aubert.statut == club`
**AUBERT** *(maire — neutre — elle lit la délibération avant de te la proposer ; elle a déjà voté dans sa tête)*
« Le synthétique est voté si le club porte le nom de la ville et si mon fils est dans l'effectif ; deux conditions, une signature. Le stade, c'est de l'argent public, madame ou monsieur {nom}. »
← **Le synthétique, et son fils** — effets : caisse ++, vestiaire −, tribunes −, set: synthetique_fils — *Le club s'appelle comme la ville. Le fils joue à droite ; Dédé l'a mis là parce qu'il y a moins de ballons.*
→ **La boue et notre nom** — effets : tribunes ++, caisse −, set: boue_gardee, relation.aubert −1 — *Le synthétique va au rugby. Vous jouez dans la boue, avec votre nom ; ça se chante mieux.*
**Traces** : synthetique_fils, boue_gardee · **Réactions déclenchées** : co.re.dupuis_pese (§ 6) · **Lu plus tard par** : pr.fusion (ch. 13 : Roux « recommande » la fusion plus fort si `boue_gardee`), co.dede_sifflet (ch. 01 : « le fils de la maire à droite, le fils du boucher à gauche »), am.village_endette question `village` (ch. 10), une.echo.le_synthetique (ch. 20)

### SCÈNE co.aubert.public_locataire  —  Locataire
**Rôle** : president · **Intrigue** : co.aubert_argent_public · **Étape** : 2/4 · **Moment** : saison 1 (`at_season +1`), créneaux [4,10] · **Lieu** : le chantier du stade ; un casque pour toi, pas pour elle · **Conditions** : `chars.aubert.statut in [club, rival]` ; year >= 1997 ; variante `_qatalyst` si `flag('naming_signe')` (« votre sponsor a acheté un nom que la ville n'a pas vendu »)
**AUBERT** *(élue — neutre — elle montre les tribunes du bout de son stylo, comme des lignes d'un tableau)*
« Le stade sera à la ville, vous en serez locataire, et la ville choisit le nom, dans cet ordre. Le stade, c'est de l'argent public, madame ou monsieur {nom} ; le loyer aussi, à l'envers. »
← **Locataire, à son prix** — effets : caisse −−, direction +, set: stade_locataire — *Tu signes le bail. Le nom du stade est celui d'un ancien maire ; Gégé l'appelle « la Marmite », comme avant.*
→ **Je construis ailleurs** — effets : caisse −−−, tribunes +, promise, set: stade_prive — *Tu promets un stade privé. Elle note la date ; elle fait voter un terrain agricole à l'endroit prévu.*
**Traces** : stade_locataire, stade_prive · **Réactions déclenchées** : co.re.vialat_recompte (§ 6) · **Lu plus tard par** : pr.stade réservoir (ch. 13 : le loyer chaque saison, ou la promesse du stade privé au mur de la Gazette), co.dupuis.dos_arena (§ 5 : « le nom est à la ville »), co.nassir.actif_trente_pour_cent (variante « le stade rénové n'est pas à vous »), une.quotidien.locataire_chez_soi (ch. 20)

### SCÈNE co.aubert.public_vestiaire  —  La ministre dans le vestiaire
**Rôle** : selectionneur · **Intrigue** : co.aubert_argent_public · **Étape** : 3/4 · **Moment** : saison 2 ou plus, year >= 2002 && year < 2012, la veille ou le jour d'un Grand Match du tournoi · **Lieu** : le couloir du vestiaire des Cobalts ; une porte fermée, un protocole, deux gardes du corps qui ne savent pas où se mettre · **Conditions** : `chars.aubert.statut == staff` (ministre) ; `flag('aubert_ministre')` ; variante `_fauvel` si `chars.fauvel.statut == club` (Fauvel bloque la porte de l'intérieur)
**AUBERT** *(ministre des Sports — neutre — elle ne demande pas la permission : elle demande l'heure)*
« Je souhaite saluer les joueurs avant le coup d'envoi, cinq minutes, une photo, aucun discours. Le stade, c'est de l'argent public, monsieur {nom}, sélectionneur ; le vestiaire est dedans. »
← **Elle entre** — effets : direction ++, vestiaire −−, set: ministre_vestiaire — *Elle entre. Cinq minutes, une photo, un discours quand même. Fauvel chante l'hymne pour deux, plus fort que d'habitude.*
→ **Le vestiaire est fermé** — effets : vestiaire ++, direction −−, set: vestiaire_ferme, relation.aubert −1 — *Elle attend dans le couloir. Elle regarde le match depuis la loge ; le ministère ne paie plus les charters l'année d'après.*
**Traces** : ministre_vestiaire, vestiaire_ferme · **Réactions déclenchées** : co.re.vence_direct (§ 6) · **Lu plus tard par** : sl.fils_du_ministre (ch. 14 : lit `ministre_vestiaire` : « elle l'a vu de près, elle le veut dans la liste »), co.fauvel_liste variante « on est un groupe, pas une réception » (ch. 01), sl_charters (epitaph_plus « le ministère ne payait plus », ch. 30, lit `vestiaire_ferme`), une.quotidien.la_ministre_au_vestiaire (ch. 20)

### SCÈNE co.aubert.public_delegue  —  Le délégué
**Rôle** : instance · **Intrigue** : co.aubert_argent_public · **Étape** : 4/4 · **Moment** : toute saison, year >= 2013, créneaux [2,7] · **Lieu** : le bureau de la région ; elle n'est plus ministre, le dossier de la tutelle est le sien quand même, il a son écriture · **Conditions** : `chars.aubert.statut in [club, staff, retraite]` ; `flag('sous_tutelle') || postulat == 'sous_tutelle'` ; variante `_soutien` si `flag('aubert_soutien')` (« je vous couvre, si vous prenez le délégué »)
**AUBERT** *(présidente de région — neutre — elle pousse un organigramme ; une case est déjà remplie, celle du délégué)*
« Le gouvernement lève la tutelle si un délégué siège au comité, avec voix délibérative ; il a un bureau prêt. Le stade, c'est de l'argent public, madame ou monsieur {nom} ; la Fédération aussi. »
← **J'accepte le délégué** — effets : direction ++, tribunes −, vestiaire −, set: delegue_accepte — *Le délégué siège. Il vote comme Aubert ; la FédéMonde écrit qu'elle « prend note », ce qui veut dire qu'elle attend.*
→ **Pas de délégué** — effets : direction −−, tribunes +, set: tutelle_refusee — *La tutelle reste. La FédéMonde menace de suspendre le pays ; Bambini est choqué, par communiqué.*
**Traces** : delegue_accepte, tutelle_refusee · **Réactions déclenchées** : co.re.dauzat_pv (§ 6) · **Lu plus tard par** : in.tutelle chaîne (ch. 15 : `sous_tutelle` lit les deux traces à chaque dossier), fin *Le Ministre* (ch. 30 : `delegue_accepte` en `epitaph_plus`), fin *Le pays suspendu* (ch. 30 : `tutelle_refusee` en condition), co.bambini.trahison_choque (variante « choqué par la tutelle »), une.quotidien.le_delegue (ch. 20)

---

## INTRIGUE co.legruet_apres_le_congres  —  Après le Congrès
**Logline** : Noël Legruet te dit « après le Congrès » quand tu es joueur, entraîneur, sélectionneur et président de la Fédération ; le Congrès est toujours demain, et un jour c'est toi qui tiens l'agenda. · **Synopsis** : Joueur, il te donne la liste des vingt-six si ton club te libère, et il ne le demande pas au club. Entraîneur, la dérogation de six mois pour le diplôme, à voir « après le Congrès », qui est dans huit mois. Sélectionneur, ton contrat finit à minuit et une, le Congrès est demain, et il te propose de signer une prolongation en blanc. Président de la Fédération après lui, Josiane t'apporte ses tiroirs : la liste des districts qui lui doivent une subvention, et donc une voix.
**Rôle(s)** : joueur, entraineur, selectionneur, instance · **Postulat(s)** : partagé (`pepite`, `binational`, `promu`, `interimaire`, `pays_emergent`, `apres_fiasco`, `heritage_empoisonne`) · **Porteur** : legruet · **Cast** : Legruet, Dauzat, Josiane, Roux (nommé), Brissac (nommée) · **Thème** : instances
**Saisons** : "0" (étapes 1-2), "2+" (étapes 3-4) · **Conditions d'entrée** : `chars.legruet.statut in [club, retraite]` ; étape 1 : year < 2008 ; étape 3 : year < 2008 ; étape 4 : year >= 2008 · **Exclusions** : étape 2 jamais la même saison que `en.diplome` (ch. 11) · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `liste_acceptee` / `club_dabord` → `international` (∃, posée ici) / `selection_refusee` (∃ § 5.2, posée ici) → ch. 14, ch. 15, co.legruet.trahison_avant_toi, ch. 20 · `derogation_attendue` / `stage_lundi` → `derogation_attendue` (« {annee} : la dérogation de {nom}, à voir après le Congrès. Le Congrès était dans huit mois. ») → ch. 11 (en.diplome : `diplome_arrange` devient possible), ch. 01 (Brissac : « le papier attend le Congrès, pas moi »), ch. 20 · `contrat_blanc` / `minuit_attendu` → `contrat_blanc` (« {annee} : {nom} a signé une prolongation en blanc. Legruet a rempli. ») / `minuit_attendu` (« {annee} : {nom} a attendu le Congrès. Le contrat finissait à minuit et une. ») → ch. 14 (fin *Minuit et une* : `contrat_blanc` la désarme, `minuit_attendu` la rapproche), co.dauzat.pv_minuit (§ 5), ch. 20 · `liste_publiee` / `liste_gardee` → `liste_districts_publiee` (« {annee} : {nom} a publié la liste des districts de Legruet. Trois cents subventions, trois cents voix. ») / `liste_districts_gardee` (« {annee} : {nom} a gardé la liste des districts. Et les districts. ») → ch. 15 (`heritage_empoisonne` : question `nettoyer / proteger / oublier`), ch. 30 (Battu au Congrès plus ; in_pantin plus), co.roux.base_prenom (§ 5), ch. 20
**Séquencier** : étape 1 `liste` (joueur, S0 [8,13]) → étape 2 `derogation` (entraineur, S0 [1,5]) → étape 3 `blanc` (selectionneur, [13,16], la veille du Congrès, `at_season +1`) → étape 4 `tiroirs` (instance, year >= 2008, [1,5])
**Scènes** : 4
**Épilogue** : par abandon, tout est reporté « après le Congrès » ; l'Almanach écrit « {annee} : le dossier de {nom} a été vu après le Congrès. Il n'a rien été vu. »

### SCÈNE co.legruet.congres_liste  —  Si votre club vous libère
**Rôle** : joueur · **Intrigue** : co.legruet_apres_le_congres · **Étape** : 1/4 · **Moment** : saison 0, créneaux [8,13] · **Lieu** : le téléphone du club ; Josiane te passe l'appel avec un air qu'elle n'a pas d'habitude · **Conditions** : `chars.legruet.statut == club` ; year < 2008 ; `force >= 55` ; variante `_rossard` si `chars.rossard.statut == club` && year < 1995 (« le sélectionneur vous veut ; moi, je vous appelle »)
**LEGRUET** *(président de la Fédération — neutre — il dit ton nom comme s'il lisait une liste, parce qu'il lit une liste)*
« Vous êtes dans la liste des vingt-six si votre club vous libère, cher {prenom}, et je ne le lui demande pas : c'est vous qui le lui demandez. On verra ça après le Congrès ; le stage est lundi. »
← **J'y vais, le club suivra** — effets : tribunes ++, direction −, vestiaire −, set: international — *Tu y vas. Le président l'apprend par Josiane, puis par L'Écho ; il ne dit rien, il note.*
→ **Le club d'abord** — effets : direction +, tribunes −, set: selection_refusee, relation.legruet −1 — *Tu restes. Il raye ton nom au stylo ; on ne dit pas non deux fois, il te le rappellera.*
**Traces** : international (∃), selection_refusee (∃) · **Réactions déclenchées** : co.re.josiane_a_lu (∃) · **Lu plus tard par** : sl.liste (ch. 14 : « vous avez été international, vous savez »), in.forfaits (ch. 15 : le règlement des forfaits lit `selection_refusee`), co.legruet.trahison_avant_toi (variante `_joueur`), co.rossard.planche_cinquieme (§ 5 : Rossard t'attend au stage), une.quotidien.en_bleu_cobalt (ch. 20)

### SCÈNE co.legruet.congres_derogation  —  Six mois, après le Congrès
**Rôle** : entraineur · **Intrigue** : co.legruet_apres_le_congres · **Étape** : 2/4 · **Moment** : saison 0, créneaux [1,5] · **Lieu** : le bureau de la Fédération ; Brissac est à la porte, elle n'entre pas, elle attend le chiffre · **Conditions** : `chars.legruet.statut == club` ; `!flag('diplome')` ; variante `_brissac` si `relation.brissac >= 1` (elle a dit oui au stage, lui dit « après »)
**LEGRUET** *(président de la Fédération — neutre — il signe une dérogation de six mois sans lire la date, il la connaît)*
« Six mois de dérogation pour le banc, cher {prenom}, et le diplôme, on verra ça après le Congrès ; le Congrès est en juin, ça vous laisse une saison. Ne le dites pas à madame Brissac. »
← **J'attends le Congrès** — effets : direction +, vestiaire −, set: derogation_attendue — *Tu attends. Le Congrès reporte le point diplômes à l'année suivante ; la dérogation, elle, expire.*
→ **Le stage, lundi, chez Clow** — effets : vestiaire −−, direction −, set: diplome, relation.brissac +1 — *Tu pars lundi. Brissac tamponne le papier elle-même ; Legruet dit qu'il l'avait prévu, après le Congrès.*
**Traces** : derogation_attendue (et `diplome` ∃ à droite) · **Réactions déclenchées** : co.re.josiane_a_lu (∃) · **Lu plus tard par** : en.diplome (ch. 11 : `derogation_attendue` ouvre la variante « la dérogation a expiré, il reste le tampon » et `diplome_arrange`), co.brissac_chiffres (ch. 01 : « le papier attendait le Congrès »), co.clow_lundi (ch. 01 : « lundi, huit heures »), une.gazette.le_coach_sans_papier (ch. 20)

### SCÈNE co.legruet.congres_blanc  —  En blanc
**Rôle** : selectionneur · **Intrigue** : co.legruet_apres_le_congres · **Étape** : 3/4 · **Moment** : saison 1 ou plus (`at_season +1`), créneaux [13,16], la veille du Congrès · **Lieu** : le couloir de l'hôtel du Congrès ; Dauzat tient le contrat, Legruet tient le stylo · **Conditions** : `chars.legruet.statut == club` ; year < 2008 ; variante `_dossier` si `flag('fede_dossier')` (« signez en blanc, et le dossier reste dans le tiroir »)
**LEGRUET** *(président de la Fédération — neutre — il te tend une feuille avec ta signature à faire et rien au-dessus)*
« Votre contrat s'arrête à minuit et une, cher {prenom}, et le Congrès est demain : signez la prolongation en blanc, je remplis après. On verra ça après le Congrès, c'est le principe. »
← **Je signe en blanc** — effets : direction ++, parole −1, vestiaire −, set: contrat_blanc — *Tu signes. Il remplit après le Congrès : deux ans, un salaire, et un article neuf que Dauzat a rédigé.*
→ **Je signe après le Congrès** — effets : direction −−, parole +1, set: minuit_attendu — *Minuit et une. Le Congrès vote, réélit Legruet de neuf voix, et « verra » ton contrat en septembre.*
**Traces** : contrat_blanc, minuit_attendu · **Réactions déclenchées** : co.re.dauzat_pv (§ 6) · **Lu plus tard par** : fin *Minuit et une* (ch. 14, ch. 30 : `contrat_blanc` la désarme une saison ; `minuit_attendu` la rapproche), co.dauzat.pv_minuit (§ 5 : l'article neuf), sl.homme_president variante (ch. 30, lit aussi `president_ami`), une.quotidien.signe_en_blanc (ch. 20)

### SCÈNE co.legruet.congres_tiroirs  —  Les districts de Legruet
**Rôle** : instance · **Intrigue** : co.legruet_apres_le_congres · **Étape** : 4/4 · **Moment** : toute saison, year >= 2008, créneaux [1,5] · **Lieu** : le bureau de la Fédération, le sien hier ; un tiroir à clé, la clé est dans la serrure · **Conditions** : `chars.legruet.statut in [retraite, rival]` (il est à l'Union, ou retiré) ; `chars.josiane.statut in [staff, retraite]` ; variante `_roux` si `relation.roux >= 1` (Roux figure sur la liste, deux fois)
**JOSIANE** *(secrétaire de la Fédération — neutre — elle ouvre le tiroir et ne regarde pas dedans : elle sait)*
« La liste des districts de Legruet : trois cents lignes, une subvention, une date, une voix en face. J'en ai vu passer, vous savez ; celle-là, tout le monde la connaît, personne ne l'a vue. »
← **Je publie la liste** — effets : tribunes ++, direction −−, parole +1, set: liste_districts_publiee — *La Gazette titre « TROIS CENTS VOIX ». Roux téléphone : il est sur la liste, il ne conteste pas, il demande pourquoi si peu.*
→ **Je garde la liste** — effets : direction ++, parole −1, set: liste_districts_gardee — *Tu gardes. Les districts votent comme avant, pour la même raison ; Legruet t'appelle pour te féliciter, après le Congrès.*
**Traces** : liste_districts_publiee, liste_districts_gardee · **Réactions déclenchées** : co.re.roux_base (§ 6) · **Lu plus tard par** : in.heritage (ch. 15 : `heritage_empoisonne` lit les deux traces à la première Campagne), in.election (ch. 15 : `liste_districts_gardee` = les districts sont à toi), co.roux.base_prenom (§ 5 : « je suis sur la liste, deux fois »), in_pantin et Battu au Congrès (epitaph_plus, ch. 30), une.gazette.trois_cents_voix (ch. 20, priorité 3)

---

## INTRIGUE co.bambini_trophee  —  Le trophée
**Logline** : Giancarlo Bambini te remet un trophée à côté d'un dictateur, t'appelle à trois heures pour un communiqué, te demande ta confédération à soixante-dix-neuf ans, et te téléphone quand le comité d'éthique le suspend. · **Synopsis** : Sélectionneur, la finale est gagnée ou perdue : il te serre la main deux fois pour la photo, et le troisième homme sur la photo gouverne un pays qu'on ne nomme pas. Président, les quarante-huit heures de la Ligue fermée : il est choqué, et il faut ta signature sous son communiqué avant l'aube. Dirigeant de l'Union, en 2011, il se représente et compte tes voix. En 2017, retiré, suspendu pour un virement entre amis, il t'appelle : tu présides, ou tu es sur la photo.
**Rôle(s)** : selectionneur, president, instance · **Postulat(s)** : partagé (`pays_emergent`, `apres_fiasco`, `rachete_fonds`, `geant_dechu`, `tournoi_desert`, `elu_surprise`) · **Porteur** : bambini · **Cast** : Bambini, « le dictateur » (voix sans réplique), Vence (réaction), Amsel (nommée), Dauzat (nommé) · **Thème** : instances
**Saisons** : "2+" (toutes les étapes) · **Conditions d'entrée** : `chars.bambini.statut in [club, retraite]` ; étape 2 : year == 2019 ou `flag('monde_ligue_fermee')` ; étape 3 : year >= 2011 && year < 2016 ; étape 4 : year >= 2017 · **Exclusions** : jamais en S0 (le personnage n'a rien à faire dans une première saison) · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `main_serree` / `main_refusee` → `main_serree` (« {annee} : {nom} a serré la main du dictateur pour la photo. Deux fois. ») / `main_refusee` (« {annee} : {nom} est passé devant la main. La photo a un trou. ») → ch. 14 (temps fort « le trophée à côté du dictateur » : la scène *est* ce temps fort), ch. 15 (Sacha, l'ONG : « tu lui as serré la main »), ch. 30 (sl_ambassadeur plus), ch. 20 · `communique_signe` / `communique_refuse` → `communique_signe` (« {annee} : {nom} a signé le communiqué de Bambini à trois heures. « Choqué ». ») → ch. 13 (chaîne des 48 heures, heure 6 : la variante « tu as signé avec lui »), co.montoya.trahison_debout, ch. 20 · `vote_bambini` / `contre_bambini` → `vote_bambini` (« {annee} : la confédération de {nom} a voté Bambini à soixante-dix-neuf ans. ») / `contre_bambini` (« {annee} : {nom} a voté contre Bambini. Il a été élu quand même. ») → ch. 15 (la Campagne : les confédérations se souviennent), co.bambini.faveur_mes_amis (ne se déclenche pas si `contre_bambini`), ch. 20 · `bambini_lache` / `bambini_protege` → `bambini_lache` (« {annee} : le comité d'éthique a suspendu Bambini. {nom} a laissé faire. ») / `bambini_protege` (« {annee} : {nom} a protégé Bambini. Un virement entre amis. ») → ch. 15 (in.valises : `bambini_protege` = tu es dans la chaîne), ch. 30 (in_pantin, *La radiation* plus), co.amsel.temps_hotel_du_lac (§ 5), ch. 20
**Séquencier** : étape 1 `photo` (selectionneur, la finale du tournoi) → étape 2 `trois_heures` (president, 2019, la nuit des 48 heures) → étape 3 `soixante_dix_neuf` (instance, 2011-2015, [10,15], `at_season +1`) → étape 4 `ethique` (instance, year >= 2017, [3,9])
**Scènes** : 4
**Épilogue** : par abandon, il envoie une photo dédicacée ; l'Almanach écrit « {annee} : une photo dédicacée de Bambini pour {nom}. Il n'est pas dessus. »

### SCÈNE co.bambini.trophee_photo  —  La photo
**Rôle** : selectionneur · **Intrigue** : co.bambini_trophee · **Étape** : 1/4 · **Moment** : la finale du tournoi (chaîne Tournoi, ch. 14), gagnée ou perdue · **Lieu** : le podium ; le trophée, Bambini, et un troisième homme en uniforme que le protocole appelle « le chef de l'État hôte » · **Conditions** : `chars.bambini.statut == club` ; variante `_perdu` si `flag('grand_match_perdu')` (c'est la médaille, pas le trophée ; la main est la même)
**BAMBINI** *(FédéMonde — neutre — il te tient le coude pour te placer, il a l'habitude des photos)*
« Le trophée, cher sélectionneur, et une poignée de main pour la photo, puis une deuxième pour la télévision de notre hôte. Le football unit le monde. Et mes amis. »
← **Je serre la main, deux fois** — effets : direction +, tribunes −, set: main_serree — *Tu serres. La photo fait le tour du monde ; Sacha, à la maison, la voit avant toi.*
→ **Je passe devant** — effets : direction −−, tribunes ++, parole +1, set: main_refusee — *Tu passes. La photo a un trou à ta place ; la télévision de l'hôte le remplit avec un plan large.*
**Traces** : main_serree, main_refusee · **Réactions déclenchées** : co.re.vence_direct (§ 6) · **Lu plus tard par** : sl.tournoi temps fort « le trophée à côté du dictateur » (ch. 14 : cette scène en est l'écriture), co.sacha_promis variante « tu lui as serré la main » (ch. 01, `sacha_nee`), sl_ambassadeur et sl_ennemi_public (epitaph_plus, ch. 30), une.quotidien.la_poignee_de_main (ch. 20)

### SCÈNE co.bambini.trophee_trois_heures  —  Trois heures du matin
**Rôle** : president · **Intrigue** : co.bambini_trophee · **Étape** : 2/4 · **Moment** : saison 2 ou plus, year == 2019 ou `flag('monde_ligue_fermee')`, la nuit de la chaîne des 48 heures (ch. 13) · **Lieu** : ton téléphone, trois heures ; on entend un moteur, il est sur un bateau qui n'est pas le sien · **Conditions** : `chars.bambini.statut in [club, retraite]` ; variante `_assis` si `flag('ligue_fermee_signee') || flag('assis_diner')` (« vous étiez à la table ; signez le communiqué, ça vous en sortira »)
**BAMBINI** *(FédéMonde — neutre — il lit le communiqué avant de dire bonjour ; il y a le mot « choqué » deux fois)*
« La FédéMonde est choquée par la Ligue fermée ; le communiqué sort à six heures, signé des présidents fidèles, et vous en êtes si vous dites oui maintenant. Le football unit le monde, cher président. »
← **Je signe le communiqué** — effets : direction +, tribunes +, set: communique_signe — *Ton nom est sous « choqué ». Montoya lit la liste à sa table ; il fait retirer une chaise, la tienne ou une autre.*
→ **Rien à trois heures** — effets : direction −, parole +1, set: communique_refuse — *Le communiqué sort sans toi. La Gazette compte les absents ; tu es dans la colonne du milieu, celle qui n'a pas de titre.*
**Traces** : communique_signe, [communique_refuse] · **Réactions déclenchées** : co.re.gege_decoupe (∃, ←) · **Lu plus tard par** : pr.ligue_fermee heure 6 (ch. 13 : `communique_signe` ferme la porte de la table), co.montoya.trahison_debout (variante « vous avez signé chez Bambini »), in_defiance (epitaph_plus « choqué à trois heures », ch. 30), une.gazette.choque_a_trois_heures (ch. 20)

### SCÈNE co.bambini.trophee_soixante_dix_neuf  —  Soixante-dix-neuf ans
**Rôle** : instance · **Intrigue** : co.bambini_trophee · **Étape** : 3/4 · **Moment** : saison 2 ou plus (`at_season +1`), year >= 2011 && year < 2016, créneaux [10,15] · **Lieu** : sa suite à l'hôtel du Lac ; un gâteau d'anniversaire dont personne n'a soufflé les bougies · **Conditions** : `chars.bambini.statut == club` ; role == 'instance' && (Union ou Fédération) ; variante `_main` si `flag('main_refusee')` (« vous avez raté une photo avec moi, une fois »)
**BAMBINI** *(FédéMonde — neutre — il compte sur ses doigts, à voix haute, jusqu'à ta confédération)*
« Je me représente, cher ami, à soixante-dix-neuf ans, parce que le Mondial de 2018 a besoin d'un père ; il me manque votre confédération. Le football unit le monde. Et mes amis votent. »
← **Nous votons pour lui** — effets : direction ++, parole −1, tribunes −, set: vote_bambini, relation.bambini +1 — *Il est réélu. Il te cite dans son discours, entre deux amis ; La Plume note l'ordre.*
→ **Contre lui, et je le dis** — effets : direction −−, tribunes +, parole +1, set: contre_bambini, relation.bambini −1 — *Il est réélu quand même. Il ne te cite pas ; il te regarde, et le comité d'éthique reçoit un courrier anonyme sur ta confédération.*
**Traces** : vote_bambini, contre_bambini · **Réactions déclenchées** : co.re.amsel_note (§ 6, → : elle note qui a voté contre) · **Lu plus tard par** : in.campagne (ch. 15 : les confédérations votent selon `vote_bambini`), co.bambini.faveur_mes_amis (ne se déclenche pas si `contre_bambini`), in_pantin (epitaph_plus « la confédération avait voté Bambini », ch. 30), une.quotidien.soixante_dix_neuf_ans (ch. 20)

### SCÈNE co.bambini.trophee_ethique  —  Un virement entre amis
**Rôle** : instance · **Intrigue** : co.bambini_trophee · **Étape** : 4/4 · **Moment** : toute saison, year >= 2017, créneaux [3,9] · **Lieu** : ton téléphone, le soir ; il appelle de son salon, on entend une télévision qui parle de lui · **Conditions** : `chars.bambini.statut == retraite` ; role == 'instance' ; variante `_preside` si tu présides la FédéMonde (`elu_surprise`) : « vous présidez ; le comité vous obéit »
**BAMBINI** *(retiré — neutre — la voix a vieilli, le tic non)*
« Le comité d'éthique me suspend pour un virement entre amis, et vous pouvez lui dire d'attendre le Congrès ; c'est ce que j'aurais fait pour vous. Le football unit le monde. Et mes amis, cher ami. »
← **Le comité fait son travail** — effets : parole +1, direction −, tribunes +, set: bambini_lache — *Le comité suspend. Il est choqué, depuis son salon ; la télévision derrière lui le répète toute la soirée.*
→ **Le comité attendra** — effets : direction +, parole −1, tribunes −, set: bambini_protege — *Le comité attend. Amsel n'attend pas ; elle a tout son temps, et elle a la date du virement.*
**Traces** : bambini_lache, bambini_protege · **Réactions déclenchées** : co.re.amsel_note (§ 6, →) · **Lu plus tard par** : in.valises (ch. 15 : `bambini_protege` te met dans la chaîne ; `bambini_lache` t'en sort), co.amsel.temps_hotel_du_lac (§ 5), *La radiation* et in_pantin (epitaph_plus, ch. 30), co.nv.2024_bambini (ch. 31 : l'enterrement lit la trace), une.gazette.un_virement_entre_amis (ch. 20)

---

## INTRIGUE co.dauzat_proces_verbal  —  Le procès-verbal
**Logline** : Aurélien Dauzat rédige la sanction, le contrat de minuit et une, la lettre de démission qu'il ne signe pas, et l'ordre dans lequel il donne les procès-verbaux à la procureure ; il te précède partout, et il t'y attend. · **Synopsis** : Entraîneur, salle 3 : on examine, et il te demande si tu acceptes ou si tu contestes pour vice de forme. Sélectionneur, le contrat de minuit et une, il l'a rédigé, il te le lit, article neuf compris. Dirigeant élu par surprise, il est hostile et le dit poliment : il reste et sert, ou il part avec les procès-verbaux. À la FédéMonde, Amsel lui demande les PV, et il te demande l'ordre.
**Rôle(s)** : entraineur, selectionneur, instance, president · **Postulat(s)** : partagé (`promu`, `interimaire`, `pays_emergent`, `apres_fiasco`, `elu_surprise`, `heritage_empoisonne`, `geant_dechu`) · **Porteur** : dauzat · **Cast** : Dauzat, Amsel, Josiane (nommée), Legruet (nommé), Roux (nommé) · **Thème** : instances
**Saisons** : "0" (étape 1), "1" (étape 2), "2+" (étapes 3-4) · **Conditions d'entrée** : `chars.dauzat.statut in [club, staff]` ; étape 3 : year >= 2012 (il est à l'Union) ou `elu_surprise` ; étape 4 : year >= 2020 · **Exclusions** : étape 1 jamais la même saison que `en.commission_discipline` (ch. 11 : cette scène en est le préambule) · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `sanction_acceptee` / `vice_de_forme` → `vice_de_forme` (« {annee} : {nom} a contesté salle 3. Vice de forme, page 41. ») → ch. 11 (en.commission_discipline : la sanction tombe ou saute), co.dauzat.faveur_page_41 (variante « vous connaissez déjà la page »), ch. 20 · `contrat_minuit` / `article_barre` → `article_barre` (« {annee} : {nom} a fait barrer l'article neuf. Dauzat l'a réécrit page 41. ») → ch. 14 (fin *Minuit et une* : l'article neuf est la clause de départ), co.legruet.congres_blanc (§ 5), ch. 20 · `dauzat_garde` / `dauzat_parti` → `dauzat_garde` (« {annee} : Dauzat est resté sous {nom}. Il sert, il note. ») / `dauzat_parti` (« {annee} : Dauzat est parti avec les procès-verbaux. Amsel les a reçus le lendemain. ») → ch. 15 (`elu_surprise` : question `dauzat`), ch. 30 (in_dauphin, in_motion plus), co.amsel.temps_hotel_du_lac (§ 5), ch. 20 · `pv_ordre` / `pv_desordre` → `pv_ordre` (« {annee} : les PV donnés à Amsel dans l'ordre. Le dernier en dernier. ») / `pv_desordre` (« {annee} : {nom} a demandé le dernier PV d'abord. Amsel a compris. ») → ch. 15 (in.valises : `pv_desordre` = entrave), ch. 30 (fins judiciaires), ch. 20
**Séquencier** : étape 1 `salle_3` (entraineur, S0 [6,12], après un carton ou un mot) → étape 2 `minuit` (selectionneur, S1 [13,16], `at_season +1`) → étape 3 `hostile` (instance, [1,4] ; `elu_surprise` ou year >= 2012) → étape 4 `ordre` (instance, year >= 2020, [8,14] ; lit `vote_achete`, `pv_fuite`, `fiche_josiane`)
**Scènes** : 4
**Épilogue** : par abandon, il classe ton dossier « sans suite » et le note au procès-verbal ; l'Almanach écrit « {annee} : le dossier de {nom} est sans suite. C'est dans le procès-verbal. »

### SCÈNE co.dauzat.pv_salle_3  —  Salle 3
**Rôle** : entraineur · **Intrigue** : co.dauzat_proces_verbal · **Étape** : 1/4 · **Moment** : saison 0, créneaux [6,12], après un incident de banc · **Lieu** : le couloir de la Fédération ; une porte avec un 3, quatre chaises, tu attends depuis une heure · **Conditions** : `chars.dauzat.statut == club` ; `flag('rapport_colline') || flag('banc_assume') || flag('adjoint_livre')` ou incident de Carte Match ; variante `_colline` si `flag('rapport_colline')` (« le rapport dit « j'ai vu » ; nous examinons ce qu'il a vu »)
**DAUZAT** *(secrétaire général — neutre — il sort de la salle 3 avec une feuille, il ne t'invite pas à entrer)*
« La commission examine et propose trois matchs de suspension de banc ; vous acceptez, ou vous contestez pour vice de forme, et alors on examine encore. C'est dans le procès-verbal, dans les deux cas. »
← **J'accepte les trois matchs** — effets : vestiaire −, direction +, set: sanction_acceptee — *Tu acceptes. Vukić prend le banc trois matchs ; il en gagne deux, et le président le remarque.*
→ **Je conteste, vice de forme** — effets : direction −, tribunes +, set: vice_de_forme, relation.dauzat +1 — *Tu contestes. Il sourit d'un millimètre : le vice existe, page 41, et tu es le premier à le chercher.*
**Traces** : [sanction_acceptee], vice_de_forme · **Réactions déclenchées** : co.re.dauzat_pv (§ 6) · **Lu plus tard par** : en.commission_discipline (ch. 11 : `vice_de_forme` annule la sanction et pose `fede_dossier` d'une autre façon), co.vukic_cahier variante « trois matchs sur le banc » (ch. 01, lit `vukic_dauphin`), co.dauzat.faveur_page_41, une.quotidien.salle_3 (ch. 20)

### SCÈNE co.dauzat.pv_minuit  —  Article neuf
**Rôle** : selectionneur · **Intrigue** : co.dauzat_proces_verbal · **Étape** : 2/4 · **Moment** : saison 1 (`at_season +1`), créneaux [13,16] · **Lieu** : son bureau sans fenêtre ; ton contrat, douze pages, il lit debout, tu es assis · **Conditions** : `chars.dauzat.statut == club` ; variante `_blanc` si `flag('contrat_blanc')` (« vous aviez signé en blanc ; voilà ce que j'ai écrit »)
**DAUZAT** *(secrétaire général — neutre — il lit l'article neuf sans changer de voix : c'est celui qui te fait partir)*
« Article neuf : le contrat prend fin à minuit et une le jour de l'élimination, sans indemnité ; il est de ma main. C'est dans le procès-verbal ; vous signez tel quel, ou vous faites barrer ? »
← **Je signe tel quel** — effets : direction ++, set: contrat_minuit — *Tu signes. Il tamponne. L'article neuf attend l'élimination ; tout le monde attend l'élimination.*
→ **Je fais barrer l'article** — effets : direction −, parole +1, set: article_barre — *Il barre. Il réécrit la même chose à la page 41, en plus petit ; il te le dit, c'est sa loyauté.*
**Traces** : [contrat_minuit], article_barre · **Réactions déclenchées** : — · **Lu plus tard par** : fin *Minuit et une* (ch. 14, ch. 30 : `article_barre` la retarde d'un tournoi), co.legruet.congres_blanc (§ 5), co.dauzat.faveur_page_41 (variante « vous savez ce qu'il y a page 41 : votre article neuf »), une.quotidien.larticle_neuf (ch. 20)

### SCÈNE co.dauzat.pv_hostile  —  Il reste, ou il part
**Rôle** : instance · **Intrigue** : co.dauzat_proces_verbal · **Étape** : 3/4 · **Moment** : saison 2 ou plus, créneaux [1,4] (les premières cartes d'un mandat) · **Lieu** : ton nouveau bureau ; il est déjà dedans, il a rangé tes affaires dans l'ordre qu'il juge bon · **Conditions** : `chars.dauzat.statut == staff` ; `postulat == 'elu_surprise'` ou year >= 2012 ; variante `_fiche` si `flag('fiche_josiane')` (« il manque une fiche aux archives ; je sais laquelle »)
**DAUZAT** *(secrétaire général — neutre — il pose un procès-verbal vierge, daté d'aujourd'hui, et un stylo)*
« Je ne vous ai pas voté et je ne le cache pas, monsieur le président : je reste et je sers, ou je pars avec les procès-verbaux, qui sont à moi. C'est dans le procès-verbal, quand vous aurez choisi. »
← **Restez, et servez** — effets : direction +, vestiaire +, set: dauzat_garde — *Il reste. Il te sert ; il note tout, à commencer par cette phrase, et tu ne sauras jamais dans quel sens.*
→ **Partez, avec vos PV** — effets : direction −−, tribunes +, set: dauzat_parti, relation.dauzat −1, char: {dauzat: {statut: parti}} — *Il part le soir même, trois cartons. Amsel reçoit une copie le lendemain ; elle dit qu'elle n'a rien demandé.*
**Traces** : dauzat_garde, dauzat_parti · **Réactions déclenchées** : co.re.josiane_a_lu (∃) · **Lu plus tard par** : in.elu_surprise question de saison `dauzat` (ch. 15), in_dauphin et in_motion (epitaph_plus, ch. 30), co.amsel.temps_hotel_du_lac (§ 5 : elle a les PV de Dauzat), co.retrouvailles.dauzat_noir, une.quotidien.il_reste_ou_il_part (ch. 20)

### SCÈNE co.dauzat.pv_ordre  —  Dans l'ordre
**Rôle** : instance · **Intrigue** : co.dauzat_proces_verbal · **Étape** : 4/4 · **Moment** : saison 2 ou plus, year >= 2020, créneaux [8,14] · **Lieu** : les archives de la FédéMonde ; des rayonnages, une lettre d'Amsel posée sur le chariot · **Conditions** : `chars.dauzat.statut == staff` ; `flag('vote_achete') || flag('pv_fuite') || flag('bambini_protege')` ; variante `_fiche` si `flag('fiche_josiane')` (« il manque une fiche ; la procureure le sait »)
**DAUZAT** *(secrétaire général — neutre — il tient deux procès-verbaux, un dans chaque main, le plus récent est plus épais)*
« La procureure demande dix ans de procès-verbaux et je les donne, c'est la loi ; je vous demande l'ordre : chronologique, ou le dernier d'abord. C'est dans le procès-verbal, l'ordre aussi. »
← **Dans l'ordre** — effets : parole +1, direction −, set: pv_ordre — *Chronologique. Amsel lit dix ans ; elle arrive au dernier en juin, et il est six heures.*
→ **Le dernier d'abord** — effets : direction +, parole −1, set: pv_desordre — *Le dernier d'abord. Amsel comprend que c'est le dernier qui compte ; elle a tout son temps, elle commence par lui.*
**Traces** : pv_ordre, pv_desordre · **Réactions déclenchées** : co.re.amsel_note (§ 6) · **Lu plus tard par** : in.valises (ch. 15 : `pv_desordre` = entrave, saute une étape vers le raid), co.amsel.temps_hotel_du_lac (§ 5), fins judiciaires (ch. 30 : `pv_desordre` en `epitaph_plus`), une.gazette.dans_lordre (ch. 20)

---

## INTRIGUE co.vialat_deux_soldes  —  Deux soldes
**Logline** : Madame Vialat te fait signer le tableau des dépenses d'un président, te demande le nom d'un intermédiaire, t'envoie la lettre après deux soldes négatifs, et te note AAA ou pas quand elle dirige l'agence. · **Synopsis** : Entraîneur, la caisse est pleine et les comptes faux : le président te désigne, elle te tend le tableau à signer. Directeur sportif, une commission est partie vers un intermédiaire sans nom, et elle veut le nom. Président, deux soldes négatifs : la lettre, le blocage, et un plan qu'elle propose une fois, vendre avant jeudi. Directrice de l'agence de notation, elle note tous les clubs, et te demande si on publie.
**Rôle(s)** : entraineur, ds, president, instance · **Postulat(s)** : partagé (`promu`, `six_mois`, `vendre_trente`, `coach_intouchable`, `geant_dechu`, `rachete_fonds`, `tournoi_desert`) · **Porteur** : vialat · **Cast** : Vialat, Josiane (nommée), Fardelli (nommé), Aulard (nommé), Gérard (nommé) · **Thème** : argent
**Saisons** : "0" (étape 1), "1" (étape 2), "2+" (étapes 3-4) · **Conditions d'entrée** : `chars.vialat.statut in [club, staff]` ; étape 4 : year >= 2033 · **Exclusions** : étape 3 jamais la même saison que `pr.commission` (ch. 13 : cette scène le précède et pose la trace ; ch. 13 la lit) · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `tableau_signe` / `tableau_refuse` → `tableau_signe` (« {annee} : {nom} a signé le tableau des dépenses du président. Coupable désigné. ») / `tableau_refuse` (« {annee} : {nom} n'a pas signé ce qu'il n'avait pas dépensé. La lettre est allée au président. ») → ch. 11 (fin `en_coupable` : `tableau_signe` en condition ; `tableau_refuse` la désarme), co.aulard.trahison_cheque_non_date (variante), ch. 20 · `nom_donne` / `nom_tu` → `nom_donne` (« {annee} : {nom} a donné le nom de l'intermédiaire à Vialat. Fardelli l'a su. ») / `nom_tu` (« {annee} : un intermédiaire sans nom dans les comptes de {club}. {nom} ne le connaissait pas. ») → ch. 12 (`commission_occulte`), ch. 15 (Amsel : « vous aviez tu le nom »), co.fardelli.page_trois_voix_haute (§ 5), ch. 20 · `plan_vialat` / `tribunal_saisi` → `commission_lettre` (∃ § 5.2, posée ici) + `plan_vialat` (« {annee} : {nom} a vendu avant jeudi. Vialat avait proposé, une fois. ») / `tribunal_saisi` (« {annee} : {club} a saisi le Tribunal du Sport. Il a répondu tard. ») → ch. 13 (pr.commission : rétrogradation ou non), ch. 12 (interdiction de recruter), ch. 30 (pr_commission plus), ch. 20 · `notes_publiees` / `notes_secretes` → `notes_publiees` (« {annee} : l'agence a publié les notes. Trébignac est AAA, buvette comprise. ») → ch. 15 (in.agence_notation), ch. 31 (Nouvelle 2033), ch. 90 (mémoire des clubs : la note), ch. 20
**Séquencier** : étape 1 `tableau` (entraineur, S0 [12,16], `caisse >= 70`) → étape 2 `intermediaire` (ds, S1 [2,9], `at_season +1` ; lit `page_trois_ds`, `offshore`) → étape 3 `jeudi` (president, [11,15] ; deux soldes négatifs) → étape 4 `agence` (instance | president, year >= 2033, [4,10])
**Scènes** : 4
**Épilogue** : par abandon, elle recompte et envoie le solde ; l'Almanach écrit « {annee} : Vialat a recompté {club} après le départ de {nom}. Ça tombait juste. Elle a recommencé. »

### SCÈNE co.vialat.soldes_tableau  —  Le tableau
**Rôle** : entraineur · **Intrigue** : co.vialat_deux_soldes · **Étape** : 1/4 · **Moment** : saison 0, créneaux [12,16] · **Lieu** : le bureau du président, sans le président ; Vialat a pris sa chaise, ce qui ne se fait pas, et elle le sait · **Conditions** : `chars.vialat.statut == club` ; `caisse >= 70` (la caisse est pleine) ; variante `_aulard` si `chars.aulard.statut == club` (le tableau est de sa main, sans signature)
**VIALAT** *(Inspecteur — neutre — un tableau à colonnes, des dépenses au nom du sportif, une ligne pour ta signature)*
« Le président m'a remis ce tableau : les dépenses sont sportives, donc les vôtres, et il manque votre signature. Je ne juge pas, madame ou monsieur {nom}. Je compte, et je compte ce qui est signé. »
← **Je signe le tableau** — effets : direction ++, caisse −, tribunes −, set: tableau_signe — *Tu signes. Elle compte ce qui est signé ; c'est toi. Le président te remercie par SMS, avec une faute.*
→ **Je n'ai rien dépensé** — effets : direction −−, parole +1, set: tableau_refuse — *Elle range le tableau. La lettre part au président, à son nom ; il la reçoit un mardi, il te vire un mercredi.*
**Traces** : tableau_signe, tableau_refuse · **Réactions déclenchées** : co.re.josiane_a_lu (∃) · **Lu plus tard par** : fin `en_coupable` (ch. 30 : `tableau_signe` en condition ; `tableau_refuse` la remplace par `en_sms` avec `epitaph_plus`), co.aulard.trahison_cheque_non_date (variante « le chèque et le tableau »), une.gazette.le_coupable_a_signe (ch. 20)

### SCÈNE co.vialat.soldes_intermediaire  —  L'intermédiaire
**Rôle** : ds · **Intrigue** : co.vialat_deux_soldes · **Étape** : 2/4 · **Moment** : saison 1 (`at_season +1`), créneaux [2,9] · **Lieu** : le couloir de la Commission ; elle ne s'arrête pas, elle ralentit, un relevé à la main · **Conditions** : `chars.vialat.statut == club` ; `flag('page_trois_ds') || flag('offshore') || flag('commission_occulte')` ; variante `_page_trois` si `flag('page_trois_ds')` (la commission est celle de la page trois de Fardelli, sans date)
**VIALAT** *(Inspecteur — neutre — elle lit une ligne du relevé : un montant, une date, un destinataire vide)*
« Trois pour cent versés à un intermédiaire sans nom le douze du mois, madame ou monsieur {nom}, et je veux le nom. Je ne juge pas. Je compte, et je ne compte pas les gens sans nom. »
← **Je donne le nom** — effets : direction −, parole +1, set: nom_donne, relation.fardelli −1 — *Tu le dis. Elle l'écrit sans réagir ; Fardelli l'apprend le lendemain par un fax qui n'est pas d'elle.*
→ **Je ne connais pas ce nom** — effets : direction +, parole −1, set: nom_tu — *Elle note « inconnu ». Elle souligne. Amsel, plus tard, lira le mot souligné.*
**Traces** : nom_donne, nom_tu · **Réactions déclenchées** : co.re.solvang_compte (§ 6, ← : elle compte pour Fardelli, cette fois) · **Lu plus tard par** : ds.commission_occulte (ch. 12 : l'issue lit `nom_donne` / `nom_tu`), co.amsel.trahison_six_heures (variante « vous aviez tu le nom »), co.fardelli.page_trois_voix_haute (§ 5), une.quotidien.lintermediaire (ch. 20)

### SCÈNE co.vialat.soldes_jeudi  —  Avant jeudi
**Rôle** : president · **Intrigue** : co.vialat_deux_soldes · **Étape** : 3/4 · **Moment** : saison 2 ou plus, créneaux [11,15] · **Lieu** : une lettre recommandée, et elle-même, dans ton bureau, pour être sûre que tu l'as lue · **Conditions** : `chars.vialat.statut == club` ; deux soldes négatifs de suite (`flag('bilan_manque')` sur deux saisons) ; variante `_ligne_douze` si `flag('ligne_douze')` (« je vous avais prévenu une fois ; je ne préviens pas deux fois ») ; variante `_actif` si `flag('club_actif')` (« le fonds compte comme vous, mal »)
**VIALAT** *(Inspecteur — neutre — la lettre est posée ; elle a une deuxième feuille, à la main, qu'elle ne pose pas encore)*
« Deux soldes négatifs, la lettre : interdiction de recruter, rétrogradation en juin, madame ou monsieur {nom}. Je ne juge pas ; je compte, et si vous vendez avant jeudi, je recompte. »
← **Je vends avant jeudi** — effets : caisse ++, vestiaire −−, tribunes −, set: commission_lettre, set: plan_vialat — *Tu vends le meilleur, mercredi soir. Jeudi, elle recompte ; juste, à trois mille près. Elle ne dit pas merci ; elle ne juge pas.*
→ **Je saisis le Tribunal** — effets : direction −, caisse −, set: commission_lettre, set: tribunal_saisi, relation.vialat −1 — *Le Tribunal siège loin. Il répond en septembre ; la rétrogradation est déjà appliquée, et le Tribunal la confirme.*
**Traces** : commission_lettre (∃), plan_vialat, tribunal_saisi · **Réactions déclenchées** : co.re.josiane_a_lu (∃) · **Lu plus tard par** : pr.commission (ch. 13 : `plan_vialat` évite la rétrogradation ; `tribunal_saisi` l'applique avec un an de retard), ds.recrutement_bloque (ch. 12), pr_commission (epitaph_plus « elle avait proposé jeudi », ch. 30), co.vialat.faveur_ligne_douze (ne se déclenche pas après cette scène), une.gazette.avant_jeudi (ch. 20)

### SCÈNE co.vialat.soldes_agence  —  AAA, buvette comprise
**Rôle** : instance | president · **Intrigue** : co.vialat_deux_soldes · **Étape** : 4/4 · **Moment** : toute saison, year >= 2033, créneaux [4,10] · **Lieu** : l'agence de notation, un open space qu'elle a refusé ; elle a gardé un bureau fermé, avec le radiateur · **Conditions** : `chars.vialat.statut == staff` (directrice de l'agence) ; variante `_trebignac` si `chars.gerard.statut == retraite` (Gérard a fait recompter la buvette)
**VIALAT** *(directrice de l'agence — neutre — une liste de trente clubs, trente notes, la tienne au milieu)*
« L'agence a noté les trente clubs, de AAA à D, et Trébignac est AAA, buvette comprise ; le conseil veut publier, je vous demande votre avis, une fois. Je ne juge pas. Je note, maintenant. »
← **Publiez les notes** — effets : tribunes −, direction +, parole +1, set: notes_publiees — *Les notes paraissent. Les clubs D perdent leur sponsor ; Trébignac reçoit un fonds pour rire, et Gérard le compte.*
→ **Pas de notes publiques** — effets : direction −, caisse +, set: notes_secretes — *Elle range la liste. Elle te donne ta note, à l'oreille ; tu ne la répètes à personne, et tout le monde la connaît.*
**Traces** : notes_publiees, [notes_secretes] · **Réactions déclenchées** : co.re.vialat_recompte (§ 6) · **Lu plus tard par** : in.agence_notation (ch. 15 : le dossier de 2033), co.nv.2033_notation (ch. 31 : « Trébignac AAA »), co.memoire_clubs (ch. 90 : la note du club à l'accueil), co.gerard_boite variante « le fonds pour rire » (ch. 01), une.quotidien.aaa_buvette_comprise (ch. 20)

---

## INTRIGUE co.amsel_tout_notre_temps  —  Tout notre temps
**Logline** : Judith Amsel arrive avant l'horaire : à l'entraînement pour un bar, au bureau pour vingt-quatre heures, à l'hôtel du Lac à six heures, et dans un livre sans nom où elle te demande la permission d'en mettre un. · **Synopsis** : Joueur, la brigade vient à l'entraînement pour un bar d'hôtel, et elle te demande ce que tu as vu. Président, la garde à vue de vingt-quatre heures, qui ne juge pas. Dirigeant, elle frappe à six heures à l'hôtel du Lac : la suite d'à côté est celle de Bambini ou de Montoya, et elle te demande quelle porte d'abord. Retraitée, elle écrit un livre sans nom dedans, et te demande si elle peut mettre le tien.
**Rôle(s)** : joueur, president, instance, ds · **Postulat(s)** : partagé (jamais en S0 ; `pepite`, `fin_de_contrat`, `geant_dechu`, `rachete_fonds`, `vendre_trente`, `tournoi_desert`, `elu_surprise`, `heritage_empoisonne`) · **Porteur** : amsel · **Cast** : Amsel, La Plume (par écrit), Maître Vidal (voix), Dauzat (nommé), Bambini (nommé), Montoya (nommé) · **Thème** : instances
**Saisons** : "1" (étape 1), "2+" (étapes 2-4) · **Conditions d'entrée** : `season >= 1` ; `chars.amsel.statut in [club, staff, retraite]` · **Exclusions** : jamais deux étapes la même saison ; jamais après un drame · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `brigade_parle` / `brigade_muet` → `brigade_parle` (« {annee} : la brigade à l'entraînement. {nom} a dit ce qu'il avait vu au bar. ») / `brigade_muet` (« {annee} : {nom} n'a rien vu au bar de l'hôtel. La brigade a noté. ») → ch. 10 (jp.pari : l'issue), co.la_plume.copies_bar (§ 5), ch. 20 · `valise_expliquee` / `silence_garde_a_vue` → `valise_expliquee` (« {annee} : vingt-quatre heures de garde à vue. {nom} a expliqué la valise. ») / `silence_garde_a_vue` (« {annee} : vingt-quatre heures. {nom} n'a rien dit ; les cartons, si. ») → ch. 13 (pr.ecoutes, la valise : les fins *Les écoutes* et *La valise* lisent), ch. 30, ch. 20 · `ma_porte_dabord` / `porte_voisine` → `ma_porte_dabord` (« {annee} : six heures, hôtel du Lac. {nom} a ouvert sa porte le premier. ») / `porte_voisine` (« {annee} : six heures, hôtel du Lac. {nom} a montré la porte d'à côté. ») → ch. 15 (in.valises : `ma_porte_dabord` = lanceur d'alerte ou coupable ; `porte_voisine` = témoin ou délateur), co.bambini.trophee_ethique (§ 5), ch. 30 (in_raid, *La radiation*, `le_repenti`), ch. 20 · `nom_dans_le_livre` / `anonyme_livre` → `nom_dans_le_livre` (« {annee} : Amsel a écrit un livre sans nom. Sauf un : {nom}. ») → ch. 31 (Nouvelle 2028 : le livre), ch. 30 (*Ta loge* plus), ch. 90 (lignée), ch. 20
**Séquencier** : étape 1 `brigade` (joueur, S1+ [4,10]) → étape 2 `garde_a_vue` (president, [8,14], `at_season +1` ; lit `ecoutes`, `enveloppe_promise`) → étape 3 `hotel_du_lac` (instance, [12,16] ; lit `vote_achete`, `bambini_protege`, `pv_desordre`, `documents_gardes`) → étape 4 `livre` (tous, year >= 2028)
**Scènes** : 4
**Épilogue** : par abandon, le dossier reste ouvert ; l'Almanach écrit « {annee} : le dossier de {nom} est resté ouvert. Amsel avait tout son temps. »

### SCÈNE co.amsel.temps_brigade  —  La brigade
**Rôle** : joueur · **Intrigue** : co.amsel_tout_notre_temps · **Étape** : 1/4 · **Moment** : saison 1 ou plus, créneaux [4,10] · **Lieu** : le terrain d'entraînement ; deux voitures grises sur la pelouse d'honneur, le coach n'a pas sifflé la fin · **Conditions** : `season >= 1` ; `flag('pisteur') || flag('pari') || flag('silence_plume')` ; variante `_source` si `flag('source_bar')` (« la Gazette nous a transmis votre lettre ; nous ne l'avons pas demandée »)
**AMSEL** *(procureure — neutre — elle a un carnet, pas de stylo ; elle retient)*
« Le bar de l'hôtel, le vendredi, quarante minutes, nous avons la bande, et nous avons tout notre temps : dites-moi ce que vous avez vu, madame ou monsieur {nom}, pas ce que vous avez entendu. »
← **Je dis ce que j'ai vu** — effets : parole +1, vestiaire −−, direction +, set: brigade_parle — *Tu le dis. Le vestiaire te regarde revenir ; deux joueurs ne reviennent pas à l'entraînement du lendemain.*
→ **Je n'ai rien vu** — effets : vestiaire +, direction −, set: brigade_muet, relation.amsel −1 — *Tu n'as rien vu. Elle note « n'a rien vu », avec l'heure ; elle a tout son temps, et la bande.*
**Traces** : brigade_parle, brigade_muet · **Réactions déclenchées** : co.re.amsel_note (§ 6) · **Lu plus tard par** : jp.pari (ch. 10 : l'issue lit les deux traces), co.la_plume.copies_bar (§ 5), jp_siffle (epitaph_plus « il avait parlé à la brigade », ch. 30), une.gazette.deux_voitures_grises (ch. 20)

### SCÈNE co.amsel.temps_garde_a_vue  —  Vingt-quatre heures
**Rôle** : president · **Intrigue** : co.amsel_tout_notre_temps · **Étape** : 2/4 · **Moment** : saison 2 ou plus (`at_season +1`), créneaux [8,14] · **Lieu** : une pièce sans fenêtre, un café froid, une horloge qui a une aiguille de trop · **Conditions** : `season >= 1` ; `flag('ecoutes') || flag('enveloppe_promise') || flag('attente_samedi')` ; variante `_page` si `flag('attente_samedi')` (« la page 2 411, en original »)
**AMSEL** *(procureure — neutre — elle pose une valise sur la table ; elle est vide, c'est une pièce à conviction)*
« Vingt-quatre heures, madame ou monsieur {nom}, et une valise dont nous connaissons le trajet, pas le contenu ; nous avons tout notre temps. Expliquez-la, ou taisez-vous : c'est votre droit. »
← **J'explique la valise** — effets : parole −1, direction −−, tribunes +, set: valise_expliquee — *Tu expliques. Ça prend six heures ; elle ne pose qu'une question, à la fin, sur une date.*
→ **Je me tais** — effets : direction −, tribunes −−, set: silence_garde_a_vue — *Tu te tais. Les cartons parlent ; Maître Vidal arrive à la quatorzième heure et parle pour toi, mal.*
**Traces** : valise_expliquee, silence_garde_a_vue · **Réactions déclenchées** : co.re.josiane_a_lu (∃ : « j'ai rangé le bureau après eux ») · **Lu plus tard par** : pr.ecoutes et pr.valise (ch. 13 : l'issue), fins *Les écoutes*, *La valise* (ch. 30 : `epitaph_plus` sur `valise_expliquee`), co.colline.vu_designateur (§ 5), une.gazette.vingt_quatre_heures (ch. 20, priorité 3)

### SCÈNE co.amsel.temps_hotel_du_lac  —  Quelle porte d'abord
**Rôle** : instance · **Intrigue** : co.amsel_tout_notre_temps · **Étape** : 3/4 · **Moment** : saison 2 ou plus, créneaux [12,16] (le Congrès de l'Union ou de la FédéMonde) · **Lieu** : le couloir du troisième étage de l'hôtel du Lac, six heures ; deux imperméables ; la suite d'à côté a la lumière allumée · **Conditions** : `season >= 1` ; `flag('vote_achete') || flag('bambini_protege') || flag('pv_desordre') || flag('documents_gardes') || flag('amis_bambini')` ; variantes lues dans l'ordre : `flag('lanceur_alerte')` → « vous nous avez écrit ; nous sommes venus quand même » ; `flag('pv_desordre')` → « Dauzat nous a donné le dernier d'abord ; c'est vous qui l'avez demandé » ; `flag('bambini_protege')` → « le comité a attendu ; nous, non »
**AMSEL** *(procureure — neutre — elle a deux mandats, un dans chaque main ; elle ne dit pas lequel est le tien)*
« Six heures, madame ou monsieur {nom}, et deux portes sur ce palier : la vôtre, et celle d'à côté, où la lumière est allumée. Nous avons tout notre temps ; vous, vous avez le choix de la porte. »
← **La mienne d'abord** — effets : parole +2, direction −−, tribunes +, set: ma_porte_dabord — *Tu ouvres. Ils entrent ; ils prennent trois cartons, et une heure plus tard ils frappent à côté, plus fort.*
→ **Celle d'à côté** — effets : direction +, parole −1, tribunes −, set: porte_voisine — *Tu montres la porte. La lumière s'éteint ; ils entrent quand même. Le voisin, en sortant, te regarde : il a compris.*
**Traces** : ma_porte_dabord, porte_voisine · **Réactions déclenchées** : co.re.amsel_note (§ 6) · **Lu plus tard par** : in.valises chaîne (ch. 15 : les deux traces branchent la chaîne : lanceur d'alerte, coupable, témoin, délateur), in_raid et *La radiation* (ch. 30), postulat dérivé `le_repenti` (ch. 30), co.bambini.trophee_ethique (§ 5), co.nemesis (ch. 90 : le voisin devient Nemesis si `porte_voisine`), une.gazette.six_heures_deux_portes (ch. 20, priorité 4)

### SCÈNE co.amsel.temps_livre  —  Un livre sans nom
**Rôle** : joueur | entraineur | ds | president | selectionneur | instance · **Intrigue** : co.amsel_tout_notre_temps · **Étape** : 4/4 · **Moment** : toute saison, year >= 2028, créneaux [3,9] · **Lieu** : un café, à l'heure exacte ; un manuscrit avec des blancs à la place des noms · **Conditions** : `chars.amsel.statut == retraite` ; une trace de cette intrigue existe (`flag('brigade_parle') || flag('valise_expliquee') || flag('ma_porte_dabord') || flag('porte_voisine') || flag('temoin_amsel')`)
**AMSEL** *(retraitée — neutre — elle a le même carnet ; il est plein, elle en a un autre)*
« Un livre sans aucun nom, madame ou monsieur {nom}, et le blanc de la page cent douze est le vôtre ; je demande la permission de le remplir. Nous avons tout notre temps ; l'éditeur, moins. »
← **Mon nom, en entier** — effets : tribunes +, parole +1, direction −, set: nom_dans_le_livre — *Elle remplit le blanc. Le livre sort avec un seul nom ; La Plume le commente sur une page, sans en dire un autre.*
→ **Sans mon nom** — effets : direction +, tribunes −, set: anonyme_livre — *Elle laisse le blanc. Tout le monde le remplit en lisant ; c'est pire, elle te l'avait dit.*
**Traces** : nom_dans_le_livre, [anonyme_livre] · **Réactions déclenchées** : co.re.lea_confirme (§ 6) · **Lu plus tard par** : co.nv.2028_livre_amsel (ch. 31 : la Nouvelle cite la page cent douze), *Ta loge* (epitaph_plus « page cent douze », ch. 30), co.lignee (ch. 90 : Sacha lit le livre), une.quotidien.page_cent_douze (ch. 20)

---

## INTRIGUE co.colline_jai_vu  —  J'ai vu
**Logline** : Colline a vu la main, ton banc, la demande que tu lui as faite, et ce que la machine ne voit pas ; il te le dit en face, et il l'écrit. · **Synopsis** : Joueur, la main sur le deuxième but : il vient te demander si c'était la main, devant le stade. Entraîneur, ton adjoint a insulté le quatrième arbitre au temps additionnel, et Colline te demande si c'est ton banc. Président, le désignateur des arbitres, c'est lui ; ta demande, il la refuse, et il te regarde. Responsable de l'arbitrage, en 2027, la machine arrive : cent pour cent de justice, et il te demande de signer, ou pas.
**Rôle(s)** : joueur, entraineur, president, instance · **Postulat(s)** : partagé (`pepite`, `fin_de_contrat`, `promu`, `interimaire`, `geant_dechu`, `rachete_fonds`, `sous_tutelle`, `elu_surprise`) · **Porteur** : colline · **Cast** : Colline, Vence (nommée), Vukić (nommé), « la machine » (voix, 2027), Amsel (nommée) · **Thème** : instances
**Saisons** : "0" (étape 1), "1" (étape 2), "2+" (étapes 3-4) · **Conditions d'entrée** : `chars.colline.statut in [club, staff]` ; étape 1 : year < 2001 (le sifflet) ; étape 3 : year >= 2008 ; étape 4 : year >= 2027 · **Exclusions** : étape 3 jamais la même saison que `pr.ecoutes` (ch. 13 : cette scène le précède) · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `main_avouee` / `main_niee` → `main_avouee` (« {annee} : {nom} a dit à Colline que c'était la main. Le stade a entendu. ») / `main_niee` (« {annee} : la main de {nom}. Colline n'a pas sifflé ; {nom} n'a rien senti. ») → ch. 10 (carte-légende *La main*), co.vence.action_zone_mixte (§ 5), ch. 30 (jp_siffle, jp_porteparole plus), ch. 20 · `banc_assume` / `adjoint_livre` → `banc_assume` (« {annee} : au temps additionnel, {nom} a dit « c'est mon banc ». Trois matchs. ») / `adjoint_livre` (« {annee} : {nom} a livré son adjoint à Colline. Vukić a noté. ») → co.dauzat.pv_salle_3 (§ 5), ch. 01 (Vukić : « je te le dis parce que personne ne te le dira : tu m'as livré »), ch. 11 (carte-légende *Le temps additionnel*), ch. 20 · `demande_retiree` / `demande_insistee` → `demande_retiree` (« {annee} : {nom} a retiré sa demande au désignateur. Colline a regardé. ») / `demande_insistee` (« {annee} : {nom} a insisté auprès du désignateur. Colline a écrit. ») → ch. 13 (pr.ecoutes : `demande_insistee` pose `ecoutes` par la suite ; `demande_retiree` la désarme), co.amsel.temps_garde_a_vue (§ 5), ch. 20 · `machine_signee` / `machine_refusee` → `machine_signee` (« {annee} : {nom} a signé l'arbitre algorithmique. Colline est parti. ») / `machine_refusee` (« {annee} : {nom} a gardé l'homme. La machine attendra une saison. ») → ch. 15 (le dossier « l'arbitre et la machine », 2027), ch. 31 (Nouvelle 2027), ch. 30 (in_showman, in_motion plus), ch. 20
**Séquencier** : étape 1 `main` (joueur, S0, après un Grand Match, year < 2001) → étape 2 `banc` (entraineur, S1 [9,14], `at_season +1`) → étape 3 `designateur` (president, year >= 2008, [6,12]) → étape 4 `machine` (instance, year >= 2027, [4,10])
**Scènes** : 4
**Épilogue** : par abandon, il écrit un rapport neutre ; l'Almanach écrit « {annee} : Colline a vu {nom}. Il n'a rien écrit d'autre. »

### SCÈNE co.colline.vu_main  —  La main
**Rôle** : joueur · **Intrigue** : co.colline_jai_vu · **Étape** : 1/4 · **Moment** : saison 0, après un Grand Match, créneaux [9,14] · **Lieu** : le rond central, juste après le coup de sifflet final ; il marche vers toi, il ne court jamais · **Conditions** : `chars.colline.statut == club` ; year < 2001 ; variante `_franc` si `flag('vence_franc')` (il a entendu ta réponse à Vence : « vous l'avez dit à la télévision ; dites-le-moi »)
**COLLINE** *(arbitre — neutre — il ne te regarde pas la main, il te regarde toi)*
« Le deuxième but, monsieur : j'étais mal placé, je n'ai pas vu, et je ne siffle pas ce que je n'ai pas vu. Vous, vous étiez bien placé ; c'était la main ? »
← **C'était la main** — effets : tribunes −, parole +2, vestiaire −, set: main_avouee, relation.colline +1 — *Tu le dis. Il ne peut plus rien changer ; il te serre la main, celle-là, devant le stade qui siffle.*
→ **Je n'ai rien senti** — effets : tribunes +, set: main_niee, relation.colline −1 — *Tu n'as rien senti. Il hoche la tête ; il écrit dans le rapport « n'a rien senti », entre guillemets.*
**Traces** : main_avouee, main_niee · **Réactions déclenchées** : co.re.colline_vu (§ 6) · **Lu plus tard par** : carte-légende *La main* (ch. 10 : `main_avouee` la débloque en légende positive), co.vence.action_zone_mixte (§ 5, variante), jp_siffle et jp_porteparole (epitaph_plus, ch. 30), co.colline.faveur_rien (variante « vous m'aviez dit la main »), une.quotidien.cetait_la_main (ch. 20)

### SCÈNE co.colline.vu_banc  —  Ton banc
**Rôle** : entraineur · **Intrigue** : co.colline_jai_vu · **Étape** : 2/4 · **Moment** : saison 1 (`at_season +1`), créneaux [9,14], après un match tendu · **Lieu** : le tunnel, tout de suite après ; Vukić est derrière toi, il a la mâchoire serrée · **Conditions** : `chars.colline.statut == club` ; `chars.vukic.statut == staff` ; year < 2001
**COLLINE** *(arbitre — neutre — le sifflet rangé, le stylo sorti, le carnet ouvert à une page où il y a déjà une ligne)*
« Au temps additionnel, votre banc a dit un mot au quatrième arbitre, et j'ai vu qui ; le rapport dira « le banc de {nom} », ou un nom. Lequel ? »
← **C'est mon banc, c'est moi** — effets : direction −, vestiaire ++, set: banc_assume — *Il écrit ton nom. Trois matchs. Vukić te le dit parce que personne ne te le dira : il l'aurait pris.*
→ **C'est l'adjoint** — effets : vestiaire −−, direction +, set: adjoint_livre, relation.vukic −1 — *Il écrit le nom de l'adjoint. Vukić prend les trois matchs ; il ne t'en parle jamais, ce qui est sa façon d'en parler.*
**Traces** : banc_assume, adjoint_livre · **Réactions déclenchées** : — · **Lu plus tard par** : co.dauzat.pv_salle_3 (§ 5 : la convocation lit `banc_assume`), co.vukic_cahier variante « tu m'as livré » (ch. 01, lit `adjoint_livre`), carte-légende *Le temps additionnel* (ch. 11), en_dauphin (epitaph_plus « Vukić avait pris les trois matchs », ch. 30), une.quotidien.le_banc_de_nom (ch. 20)

### SCÈNE co.colline.vu_designateur  —  Le désignateur
**Rôle** : president · **Intrigue** : co.colline_jai_vu · **Étape** : 3/4 · **Moment** : saison 2 ou plus, year >= 2008, créneaux [6,12] · **Lieu** : son bureau à la Fédération, sans photo, sans trophée ; une liste d'arbitres, un match entouré · **Conditions** : `chars.colline.statut == staff` (responsable de l'arbitrage) ; ta demande a été faite par un tiers (ton DS ou « un émissaire ») ; variante `_page` si `flag('attente_samedi')` (« la page 2 411 avait mon nom ; je l'ai lue aussi ») ; variante `_enveloppe` si `flag('enveloppe_refusee')` (« vous aviez dit non à une enveloppe, une fois ; je m'en souviens, et je vous regarde autrement »)
**COLLINE** *(responsable de l'arbitrage — neutre — il te regarde ; il n'a que ça, et ça suffit)*
« Votre directeur sportif m'a demandé qui arbitrerait le derby, monsieur, et il l'a demandé comme on demande autre chose ; je refuse. J'ai vu. Retirez la demande, ou j'écris qu'elle a été faite. »
← **Je retire la demande** — effets : parole +1, direction −, set: demande_retiree, relation.colline +1 — *Tu retires. Il n'écrit rien ; il te regarde une seconde de plus, et c'est tout ce que tu auras.*
→ **J'insiste** — effets : direction −−, tribunes −, set: demande_insistee, relation.colline −1 — *Il écrit. Le derby est arbitré par lui-même, exceptionnellement ; il ne te donne rien, et le stade le voit.*
**Traces** : demande_retiree, demande_insistee · **Réactions déclenchées** : co.re.colline_vu (§ 6) · **Lu plus tard par** : pr.ecoutes (ch. 13 : `demande_insistee` ouvre la chaîne des écoutes ; `demande_retiree` la ferme), co.amsel.temps_garde_a_vue (§ 5 : « la demande est au dossier »), pr_ecoutes (epitaph_plus « Colline avait refusé, et vu », ch. 30), une.quotidien.il_a_refuse (ch. 20)

### SCÈNE co.colline.vu_machine  —  La machine
**Rôle** : instance · **Intrigue** : co.colline_jai_vu · **Étape** : 4/4 · **Moment** : toute saison, year >= 2027, créneaux [4,10] · **Lieu** : la salle du comité ; un écran, un pourcentage, et Colline debout, il ne s'assied pas devant un écran · **Conditions** : `chars.colline.statut == staff` ; variante `_titre_propre` si `flag('titre_propre')` (« vous savez ce qu'un arbitre voit ; vous l'avez eu, une fois »)
**COLLINE** *(responsable de l'arbitrage — neutre — il te tend une feuille : un chiffre, cent, et une ligne pour signer)*
« L'arbitre algorithmique : cent pour cent de justice, zéro pour cent d'émotion, et ma démission agrafée derrière si vous signez. J'ai vu ce qu'elle ne voit pas ; signez, ou gardez l'homme une saison. »
← **Je signe la machine** — effets : direction +, tribunes −, set: machine_signee, char: {colline: {statut: retraite}} — *Tu signes. La machine siffle tout, juste ; le stade siffle la machine, ce qui ne change rien, et il le sait.*
→ **Je garde l'homme** — effets : tribunes +, direction −, set: machine_refusee, relation.colline +1 — *Il reprend la feuille. La machine attend une saison en salle 3 ; elle a tout son temps, elle aussi.*
**Traces** : machine_signee, machine_refusee · **Réactions déclenchées** : co.re.vence_direct (§ 6) · **Lu plus tard par** : in.arbitre_machine (ch. 15 : le dossier de 2027 lit les deux traces), co.nv.2027_machine (ch. 31), in_showman et in_motion (epitaph_plus, ch. 30), co.retrouvailles.colline_sourire après 2027 (ch. 90 : « la machine a vu, moi aussi »), une.quotidien.cent_pour_cent (ch. 20)

---

## INTRIGUE co.pichon_cent_cinquante  —  Cent cinquante francs
**Logline** : Roger Pichon te paie cent cinquante francs au noir, refuse le match arrangé, t'appelle à cinq heures après ton premier match en D1, et te demande, quand tu es président à sa place, si on continue comme avant. · **Synopsis** : Amateur, cent cinquante francs par match, de la main à la main, à cinq heures. Montbéliac propose cinq cents pour perdre ; il refuse et te demande de refuser aussi. Pro, ton premier match en D1 : le téléphone sonne à cinq heures du matin, il n'a pas regardé l'heure. Président de village à sa place, il te demande si on paie encore au noir, ou si on déclare tout et on ferme en avril.
**Rôle(s)** : joueur_amateur, joueur, president_amateur · **Postulat(s)** : partagé (`village_endette`, `lache_academie`, `pepite`, `fusion_imposee`, `coupe_du_village`) · **Porteur** : pichon · **Cast** : Pichon, Gérard, Dédé (nommé), « Montbéliac » (voix), Roux (nommé), Vialat (nommée) · **Thème** : argent
**Saisons** : "0" (étapes 1-2), "1" (étape 3), "2+" (étape 4) · **Conditions d'entrée** : `chars.pichon.statut in [club, retraite]` ; étape 4 : role == 'president_amateur' && club == Trébignac ou lignée passée par Trébignac · **Exclusions** : étape 2 jamais la même saison que `am.match_arrange` (ch. 10 : cette scène en est le préambule) · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `francs_noir` / `benevole` → `francs_noir` (« {annee} : cent cinquante francs par match, de la main à la main. {nom} a pris. ») → ch. 10 (`village_endette` : question `boulot`), co.pichon.francs_successeur (§ 5), ch. 15 (Vialat : « on payait au noir, vous le savez »), ch. 20 · `match_refuse` / `match_arrange` → `match_refuse` (« {annee} : Montbéliac a proposé cinq cents francs pour perdre. {nom} a dit non, avec Pichon. ») / `enveloppe_promise` (∃ § 5.2, posée ici côté amateur) → ch. 10 (am.match_arrange : la suite), ch. 15 (Roux ne vote plus comme toi), co.roux.base_samedi (§ 5), ch. 20 · `pichon_appel` → `pichon_appel` (« {annee} : premier match en D1. Pichon a appelé à cinq heures, il n'avait pas regardé l'heure. ») → ch. 30 (*Le Jubilé* plus), ch. 90 (mémoire de Trébignac : accueil à +3), co.retrouvailles.pichon_sourire, ch. 20 · `noir_continue` / `tout_declare` → `noir_continue` (« {annee} : à Trébignac, on paie encore au noir. {nom} a signé les papiers de la Fédération. ») / `tout_declare` (« {annee} : {nom} a tout déclaré. La buvette ferme en avril. ») → ch. 13 (la caisse : Vialat lit `noir_continue` ; `tout_declare` = CAISSE fragile), co.gerard_boite (ch. 01), ch. 20
**Séquencier** : étape 1 `noir` (joueur_amateur, S0 [2,6]) → étape 2 `arrange` (joueur_amateur, S0 [10,14]) → étape 3 `cinq_heures` (joueur, S1 [1,4] après la Passation, `at_season +1`) → étape 4 `successeur` (president_amateur, [1,6])
**Scènes** : 4
**Épilogue** : par abandon, il met ton nom sur une étiquette de la caisse, « en cas » ; l'Almanach écrit « {annee} : Pichon a mis le nom de {nom} sur la caisse. En cas. »

### SCÈNE co.pichon.francs_noir  —  De la main à la main
**Rôle** : joueur_amateur · **Intrigue** : co.pichon_cent_cinquante · **Étape** : 1/4 · **Moment** : saison 0, créneaux [2,6] · **Lieu** : l'arrière-boutique de la boulangerie, cinq heures dix ; une enveloppe posée sur un sac de farine · **Conditions** : `chars.pichon.statut == club` ; year < 2002 (francs) ; variante `_ecus` si year >= 2002 (« vingt-cinq écus, c'est pareil, c'est de la main à la main »)
**PICHON** *(boulanger — neutre — il pousse l'enveloppe avec le dos de la main pour ne pas la farinée)*
« Cent cinquante francs par match, de la main à la main ; personne ne le sait, sauf Gérard qui compte. Le pain, c'est à cinq heures ; le foot, c'est après, mais ça se paie avant. »
← **Je prends** — effets : caisse +, tribunes +, set: francs_noir — *Tu prends. Gérard note dans la boîte en fer : ton nom, cent cinquante, une croix. Il y a beaucoup de croix.*
→ **Je joue pour rien** — effets : caisse −, vestiaire +, direction +, set: benevole, relation.pichon +1 — *Tu refuses. Il remet l'enveloppe dans la farine ; il te donne un pain, tous les samedis, jusqu'à la fin.*
**Traces** : francs_noir, [benevole] · **Réactions déclenchées** : co.re.pichon_cinq_heures (§ 6, → : il rappelle pour le pain) · **Lu plus tard par** : am.village_endette question de saison `boulot` (ch. 10), co.gerard_boite (ch. 01 : « ton nom est dans la boîte, avec une croix »), co.pichon.francs_successeur (§ 5), co.vialat.soldes_agence (§ 5 : « buvette comprise »), une.echo.de_la_main_a_la_main (ch. 20)

### SCÈNE co.pichon.francs_arrange  —  Cinq cents pour perdre
**Rôle** : joueur_amateur · **Intrigue** : co.pichon_cent_cinquante · **Étape** : 2/4 · **Moment** : saison 0, créneaux [10,14], la semaine du match contre Montbéliac · **Lieu** : le parking du stade municipal Gérard-Blanchet ; une voiture verte, Pichon debout à côté, il a refusé de monter · **Conditions** : `chars.pichon.statut == club` ; le prochain adversaire est Montbéliac
**PICHON** *(boulanger — neutre — il te montre la voiture verte du menton ; la vitre est baissée, on ne voit pas qui)*
« Montbéliac propose cinq cents francs par joueur pour perdre dimanche, et j'ai dit non pour moi ; je ne peux pas dire non pour toi, petit, le pain c'est à cinq heures, le reste c'est ta conscience. »
← **Je refuse avec lui** — effets : tribunes ++, caisse −, vestiaire +, set: match_refuse, relation.pichon +1 — *Tu refuses. La voiture verte repart ; dimanche, Montbéliac joue dur, et perd, et le village le sait.*
→ **Je prends les cinq cents** — effets : caisse ++, tribunes −−, vestiaire −, set: enveloppe_promise, relation.pichon −1 — *Tu prends. Dimanche, tu joues mal exprès, et c'est plus difficile que de jouer bien. Roux l'apprend au district.*
**Traces** : match_refuse (et `enveloppe_promise` ∃ à droite, côté amateur) · **Réactions déclenchées** : co.re.roux_base (§ 6, →) · **Lu plus tard par** : am.match_arrange (ch. 10 : la suite lit les deux), co.roux.base_samedi (§ 5 : « le district sait pour la voiture verte »), in.election (ch. 15 : Roux ne vote plus comme toi si `enveloppe_promise` posée ici), am_toro (epitaph_plus « il avait pris les cinq cents », ch. 30), une.echo.la_voiture_verte (ch. 20)

### SCÈNE co.pichon.francs_cinq_heures  —  Cinq heures du matin
**Rôle** : joueur · **Intrigue** : co.pichon_cent_cinquante · **Étape** : 3/4 · **Moment** : saison 1 (`at_season +1`), créneaux [1,4], après ton premier match en D1 · **Lieu** : ton téléphone, cinq heures du matin ; on entend le pétrin · **Conditions** : `chars.pichon.statut in [club, retraite]` ; lignée passée par Trébignac (`flag('francs_noir') || flag('benevole') || flag('match_refuse')`)
**PICHON** *(boulanger — sourire — il parle fort, à cause du pétrin, et parce qu'il est content)*
« Je t'ai vu à la télé hier soir, petit, en D1, avec ton nom dans le dos ; le pain est fait, alors j'appelle, je n'ai pas regardé l'heure. Le foot, c'est après, mais là, c'est maintenant. »
← **Je décroche, et j'écoute** — effets : tribunes +, vestiaire +, set: pichon_appel, relation.pichon +1 — *Tu écoutes vingt minutes. Il te raconte le match mieux que Ménèche ; il a tout vu, il a tout compris, il pétrit.*
→ **Je dors, il est cinq heures** — effets : caisse +, relation.pichon −1 — *Tu raccroches. Il rappelle le lendemain, à cinq heures ; il n'a toujours pas regardé l'heure.*
**Traces** : pichon_appel · **Réactions déclenchées** : co.re.camille_journal (∃, `!flag('divorce')` : « c'était qui, à cinq heures ? ») · **Lu plus tard par** : *Le Jubilé* (epitaph_plus « Pichon appelait à cinq heures », ch. 30), co.memoire_clubs (ch. 90 : Trébignac t'accueille à +3 si `pichon_appel`), co.retrouvailles.pichon_sourire, une.echo.cinq_heures_du_matin (ch. 20)

### SCÈNE co.pichon.francs_successeur  —  Comme avant
**Rôle** : president_amateur · **Intrigue** : co.pichon_cent_cinquante · **Étape** : 4/4 · **Moment** : saison 2 ou plus, créneaux [1,6] (les premières cartes de ta présidence) · **Lieu** : la buvette, avant l'ouverture ; Gérard essuie des verres propres, Pichon est assis à ta place, il se lève quand tu entres · **Conditions** : `chars.pichon.statut in [club, retraite]` ; `chars.gerard.statut in [club, staff]` ; variantes : `flag('francs_noir')` → « tu as pris, à l'époque, tu sais comment ça marche » ; `flag('benevole')` → « tu jouais pour rien ; les autres, non »
**PICHON** *(ancien président — neutre — il te tend un stylo et une liasse de la Fédération, à signer en bas)*
« La Fédération dit que tout le monde est bénévole ; la boîte de Gérard dit autre chose. Tu signes et on continue comme avant, ou tu déclares tout et on ferme en avril : le club, c'est à toi. »
← **On continue comme avant** — effets : caisse −, vestiaire +, direction −, set: noir_continue — *Tu signes. Gérard range la boîte ; Vialat, un jour, comptera la buvette, et la buvette tombera juste, à cent cinquante près.*
→ **Tout déclaré** — effets : caisse −−, direction +, parole +1, set: tout_declare, relation.pichon −1 — *Tu déclares. Trois joueurs partent à Montbéliac, qui paie en liquide ; la buvette ferme en avril, et rouvre en septembre, avec des prix.*
**Traces** : noir_continue, tout_declare · **Réactions déclenchées** : co.re.vialat_recompte (§ 6, ←) · **Lu plus tard par** : pr.caisse réservoir (ch. 13 : `noir_continue` ouvre « Gérard a fui » plus tôt ; `tout_declare` rend CAISSE fragile une saison), co.gerard_boite (ch. 01 : « la boîte a une page à ton nom, président »), co.vialat.soldes_agence (§ 5), pa_buvette et pa_magot (epitaph_plus, ch. 30), une.echo.comme_avant (ch. 20)

---

## INTRIGUE co.roux_la_base  —  La base
**Logline** : Firmin Roux te convoque un samedi matin pour un coude, recommande la fusion, te demande de dire son prénom à la tribune du Congrès, et son fils te demande si tu viendras à l'enterrement. · **Synopsis** : Amateur, un coup de coude et une convocation au district, un samedi, il préside en manteau. Président de village, il « recommande » la fusion avec Montbéliac : c'est un vote, et le sien pèse. Dirigeant, trois cents districts votent comme lui, et il ne demande qu'une chose : que tu dises « Firmin » à la tribune, ce que Legruet n'a jamais fait. Après 2012, le fils vote comme le père votait ; à la mort du père, il te demande si tu viens, avec une couronne.
**Rôle(s)** : joueur_amateur, president_amateur, instance · **Postulat(s)** : partagé (`village_endette`, `lache_academie`, `fusion_imposee`, `coupe_du_village`, `heritage_empoisonne`, `sous_tutelle`) · **Porteur** : roux · **Cast** : Roux, « le fils de Roux » (voix), Legruet (nommé), Pichon (nommé), Aubert (nommée), Dauzat (nommé) · **Thème** : instances
**Saisons** : "0" (étape 1), "1" (étape 2), "2+" (étapes 3-4) · **Conditions d'entrée** : `chars.roux.statut in [club, retraite]` ; étape 3 : year >= 2008 && year < 2013 ; étape 4 : year >= 2014 · **Exclusions** : étape 2 jamais la même saison que `pr.fusion` (ch. 13 : cette scène est le vote du district, ch. 13 écrit la fusion elle-même) · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `excuse_roux` / `coude_assume` → `coude_assume` (« {annee} : un coup de coude, trois matchs. {nom} a dit qu'il le referait. ») → ch. 10 (am.commission : la suspension), co.roux.trahison_huis_clos (variante « vous aviez déjà assumé un coude »), ch. 20 · `fusion_votee` / `fusion_contre` → `fusion_signee` (trace ch. 13, posée ici aussi) / `fusion_contre` (« {annee} : {nom} a voté contre la fusion au district. Roux a recommandé quand même. ») → ch. 13 (`fusion_imposee` : question `couleurs / mairie / gamins`), co.aubert.public_synthetique (§ 5), ch. 90 (mémoire de Loubières à −3 pour la lignée qui a signé), ch. 20 · `firmin_dit` / `firmin_tu` → `firmin_dit` (« {annee} : à la tribune du Congrès, {nom} a dit « Firmin ». Trois cents districts ont entendu. ») / `firmin_tu` (« {annee} : {nom} a dit « monsieur le président du district ». Roux a compté. ») → ch. 15 (in.election : `firmin_dit` = les districts ; `firmin_tu` = ils votent comme Legruet), co.legruet.faveur_les_districts (variante), ch. 31 (anecdote « Fernand »), ch. 20 · `couronne_roux` / `roux_sans_couronne` → `couronne_roux` (« {annee} : l'enterrement de Roux. {nom} avait une couronne, et trois cents autres. ») → ch. 15 (le fils de Roux vote comme le père : `couronne_roux` le confirme), ch. 31 (l'enterrement, une ligne), ch. 90 (le fils de Roux dans la lignée des voix), ch. 20
**Séquencier** : étape 1 `samedi` (joueur_amateur, S0 [6,12], après une Carte Match avec carton) → étape 2 `fusion` (president_amateur, S1 [7,12], `at_season +1`) → étape 3 `prenom` (instance, 2008-2012, [13,16] : le Congrès) → étape 4 `fils` (instance, year >= 2014, [2,8])
**Scènes** : 4
**Épilogue** : par abandon, il te met sur la liste des « absents excusés » du district ; l'Almanach écrit « {annee} : {nom}, absent excusé au district. Roux a lu le nom. »

### SCÈNE co.roux.base_samedi  —  Le samedi matin
**Rôle** : joueur_amateur · **Intrigue** : co.roux_la_base · **Étape** : 1/4 · **Moment** : saison 0, créneaux [6,12], après une Carte Match avec un carton · **Lieu** : la salle du district, un samedi, neuf heures ; il préside, il n'a pas ôté son manteau, il ne l'ôtera pas · **Conditions** : `chars.roux.statut == club` ; variante `_voiture_verte` si `flag('enveloppe_promise')` (« le district sait pour la voiture verte ; on ne l'examine pas aujourd'hui, on s'en souvient »)
**ROUX** *(président du district — neutre — il lit le rapport de l'arbitre, un bénévole, en le tenant loin de ses yeux)*
« Un coup de coude à la soixante-dixième, l'arbitre a écrit « volontaire », et la commission, c'est moi : tu t'excuses, ou tu assumes, mon petit. Le district, c'est la base, et la base a un règlement. »
← **Je m'excuse** — effets : direction +, tribunes −, set: excuse_roux — *Tu t'excuses. Un match. Il note « s'est excusé » ; ça compte, au district, ça compte même beaucoup.*
→ **J'assume, je le referais** — effets : tribunes ++, direction −−, set: coude_assume — *Tu assumes. Trois matchs. Il note « le referait » ; le village t'aime pour ça, et le district s'en souvient.*
**Traces** : [excuse_roux], coude_assume · **Réactions déclenchées** : co.re.pichon_cinq_heures (§ 6) · **Lu plus tard par** : am.commission (ch. 10 : la suspension se joue en Cartes Match), co.roux.trahison_huis_clos (variante), co.dede_sifflet variante « trois matchs, et Dédé te fait tracer les lignes » (ch. 01), une.echo.le_referait (ch. 20)

### SCÈNE co.roux.base_fusion  —  Recommandée
**Rôle** : president_amateur · **Intrigue** : co.roux_la_base · **Étape** : 2/4 · **Moment** : saison 1 (`at_season +1`), créneaux [7,12] · **Lieu** : la salle du district ; Aubert est venue, elle est assise au fond, elle a le dossier ; Montbéliac a envoyé quelqu'un · **Conditions** : `chars.roux.statut == club` ; `postulat == 'fusion_imposee'` ou `flag('boue_gardee')` ; variante `_boue` si `flag('boue_gardee')` (« vous avez gardé la boue ; la fusion vous donne un synthétique »)
**ROUX** *(président du district — neutre — il dit « recommande » comme on dit « ordonne » quand on est poli)*
« Le district recommande la fusion avec Montbéliac, un seul club, et je mets aux voix ; la vôtre compte, président, la mienne aussi. Le district, c'est la base, et la base veut un club qui tient. »
← **Je vote la fusion** — effets : direction ++, tribunes −−, caisse +, set: fusion_signee — *Tu votes. La fusion passe. Le nouveau club a deux couleurs et aucun nom ; Loubières s'en souviendra pour trois générations.*
→ **Je vote contre** — effets : tribunes ++, direction −, set: fusion_contre, relation.roux −1 — *Tu votes contre. La fusion est « recommandée » quand même, à l'unanimité moins toi ; Aubert note ton nom, à la ligne quatre.*
**Traces** : fusion_signee (trace ch. 13), fusion_contre · **Réactions déclenchées** : co.re.dupuis_pese (§ 6) · **Lu plus tard par** : pr.fusion chaîne (ch. 13 : les huit cartes lisent `fusion_signee` / `fusion_contre`), co.aubert.public_synthetique (§ 5), co.memoire_clubs (ch. 90 : Loubières à −3 pour la lignée qui a signé), co.aubert.trahison_subvention (variante « vous aviez voté contre la fusion »), une.echo.recommandee (ch. 20)

### SCÈNE co.roux.base_prenom  —  Firmin
**Rôle** : instance · **Intrigue** : co.roux_la_base · **Étape** : 3/4 · **Moment** : saison 2 ou plus, year >= 2008 && year < 2013, créneaux [13,16] (le Congrès) · **Lieu** : les coulisses de la tribune du Congrès ; il a sa carte de délégué à la main, il la tient comme un ticket · **Conditions** : `chars.roux.statut == club` ; variantes lues dans l'ordre : `flag('liste_districts_gardee')` → « je suis sur la liste de Legruet, deux fois ; je m'en fiche, je veux le prénom » ; `flag('districts_legruet')` → « Legruet a dit de voter pour vous ; il n'a pas dit mon prénom » ; sinon neutre
**ROUX** *(président du district — neutre — il parle bas, ce qui chez lui veut dire qu'il est ému)*
« Trois cents districts votent comme moi, mon petit, et je ne demande qu'une chose : à la tribune, dites « Firmin », pas « le district ». Le district, c'est la base ; la base a un prénom. »
← **Firmin, à la tribune** — effets : direction ++, tribunes +, set: firmin_dit, relation.roux +1 — *Tu le dis. Il ne bouge pas. Trois cents délégués regardent leur carte ; le soir, ils votent comme lui, pour toi.*
→ **Monsieur le président** — effets : direction −, set: firmin_tu, relation.roux −1 — *Tu dis le titre. Il applaudit comme les autres. Le soir, les districts votent comme Legruet leur a dit, et Legruet n'a rien dit.*
**Traces** : firmin_dit, firmin_tu · **Réactions déclenchées** : co.re.roux_base (§ 6) · **Lu plus tard par** : in.election (ch. 15 : `firmin_dit` = les districts votent pour toi ; `firmin_tu` = ils votent « comme Legruet »), co.legruet.faveur_les_districts (variante « Roux a dit que c'était son idée »), anecdote 31.fernand (ch. 31 : la légende du prénom), Battu au Congrès (epitaph_plus « il n'avait pas dit Firmin », ch. 30), une.echo.firmin (ch. 20)

### SCÈNE co.roux.base_fils  —  La couronne
**Rôle** : instance · **Intrigue** : co.roux_la_base · **Étape** : 4/4 · **Moment** : toute saison, year >= 2014, créneaux [2,8] · **Lieu** : ton téléphone ; le fils appelle depuis la salle du district, on entend les chaises · **Conditions** : `chars.roux.statut == parti` (mort en 2014) ; variante `_firmin` si `flag('firmin_dit')` (« il a gardé la coupure de presse, avec le prénom entouré »)
**LE FILS DE ROUX** *(voix sans portrait — délégué du district ; il a la carte du père, périmée, on l'accepte)*
« Mon père est mort ce matin, et trois cents districts envoient une couronne chacun ; vous venez samedi avec la vôtre, ou vous envoyez le secrétaire général ? La base compte les couronnes. »
← **Je viens, avec une couronne** — effets : tribunes +, direction +, set: couronne_roux — *Tu viens. Trois cent une couronnes ; Legruet, à quatre-vingt-sept ans, dit « Firmin » devant le cercueil, enfin.*
→ **J'envoie Dauzat** — effets : direction −, tribunes −, set: roux_sans_couronne, relation.roux −1 — *Dauzat y va. Il note au procès-verbal qui était là ; ton nom n'y est pas, et le fils l'a lu.*
**Traces** : couronne_roux, [roux_sans_couronne] · **Réactions déclenchées** : co.re.dauzat_pv (§ 6, →) · **Lu plus tard par** : in.election après 2014 (ch. 15 : le fils de Roux vote pour toi si `couronne_roux`, contre si `roux_sans_couronne`), ch. 31 (l'enterrement de Roux : « trois cent une couronnes »), co.legruet.faveur_les_districts (ch. 90 : la variante posthume « Firmin, enfin »), une.echo.trois_cent_une_couronnes (ch. 20)

---

## INTRIGUE co.rossard_planche  —  La planche savonnée
**Logline** : Aimé Rossard cherche un cinquième tireur en 1992, commente ton derby en 1996, te savonne la planche quand tu prends sa place, et demande au Congrès, en 2008, qu'on lui rende 1998. · **Synopsis** : Joueur, il t'appelle au stage pour une chose : après le tir au but manqué de Fauvel, il veut un volontaire pour le cinquième. Entraîneur, il commente ton derby le dimanche soir : « moi, à sa place » ; Vence te demande de répondre. Sélectionneur, la veille du tournoi, il te dit en privé qu'il va te découper à l'antenne, que c'est son métier, et te donne ce qu'il a vu de ton groupe, contre un titre de conseiller. Président de la Fédération, il demande que le Congrès honore 1998, son groupe, qu'un autre a mené.
**Rôle(s)** : joueur, entraineur, selectionneur, instance · **Postulat(s)** : partagé (`pepite`, `fin_de_contrat`, `promu`, `interimaire`, `pays_emergent`, `apres_fiasco`, `heritage_empoisonne`) · **Porteur** : rossard · **Cast** : Rossard, Fauvel, Vence, Ménèche (nommé), Legruet (nommé), « le sélectionneur de 98 » (voix) · **Thème** : presse
**Saisons** : "0" (étape 1), "1" (étape 2), "2+" (étapes 3-4) · **Conditions d'entrée** : `chars.rossard.statut in [club, staff, retraite]` ; étape 1 : year < 1995 ; étape 2 : year >= 1995 ; étape 4 : year >= 2008 · **Exclusions** : étape 3 jamais la même saison que `sl.consultant_savonne` (ch. 14 : cette scène est le versant privé ; ch. 14 écrit le versant plateau) · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `cinquieme_tireur` / `tireur_refuse` → `cinquieme_tireur` (« {annee} : {nom} s'est proposé pour le cinquième tir au but. Rossard a noté. ») / `tireur_refuse` (« {annee} : {nom} ne tire pas les penaltys. Rossard a noté aussi. ») → ch. 14 (les temps forts « tirs au but » de la famille sélection : `cinquieme_tireur` en variante SÛR), ch. 01 (Fauvel : « tu t'es proposé après moi »), ch. 30 (jp_porteparole plus), ch. 20 · `rossard_repondu` / `rossard_ignore` → `rossard_repondu` (« {annee} : {nom} a répondu au consultant, en direct. Le consultant a aimé. ») → ch. 14 (sl.consultant_savonne : « vous m'aviez répondu, à l'époque »), co.vence.action_ralenti (§ 5), ch. 20 · `rossard_conseiller` / `rossard_libre` → `rossard_conseiller` (« {annee} : Rossard, conseiller du sélectionneur. Il a arrêté de savonner ; Ménèche a pris le relais. ») / `rossard_libre` (« {annee} : Rossard a découpé {nom} à l'antenne, avec justesse. Il l'avait prévenu. ») → ch. 14 (la chaîne Tournoi : le plateau te découpe ou non), ch. 01 (Fauvel : « le conseiller a le cahier »), ch. 30 (sl_ennemi_public, sl_fete plus), ch. 20 · `rossard_honore` / `rossard_oublie` → `rossard_honore` (posée aussi par le palier +3) / `rossard_oublie` (« {annee} : le Congrès n'a pas honoré 1998. Rossard a commenté le Congrès. ») → ch. 15 (in.congres : un point à l'ordre du jour), ch. 31 (Nouvelle 2022 : sa mort lit les deux), co.fauvel_liste (ch. 01 : Fauvel dit que 98, c'était le groupe), ch. 20
**Séquencier** : étape 1 `cinquieme` (joueur, S0 [8,13], year < 1995 ; lit `international`) → étape 2 `plateau` (entraineur, S1 [10,14], year >= 1995, `at_season +1`) → étape 3 `savon` (selectionneur, la veille du tournoi) → étape 4 `quatre_vingt_dix_huit` (instance, year >= 2008, [13,16])
**Scènes** : 4
**Épilogue** : par abandon, il commente ton départ le dimanche soir : « moi, à sa place, je serais resté » ; l'Almanach écrit « {annee} : Rossard a commenté le départ de {nom}. À sa place, il serait resté. »

### SCÈNE co.rossard.planche_cinquieme  —  Le cinquième tireur
**Rôle** : joueur · **Intrigue** : co.rossard_planche · **Étape** : 1/4 · **Moment** : saison 0, créneaux [8,13], year < 1995 · **Lieu** : le stage des Cobalts, un soir, la salle vidéo ; la cassette de la finale de 1990 est en pause sur le poteau gauche · **Conditions** : `chars.rossard.statut == club` ; `flag('international')` ; `chars.fauvel.statut in [club, staff]` ; variante `_fauvel` si `relation.fauvel >= 1` (Fauvel est dans la salle et regarde ailleurs)
**ROSSARD** *(sélectionneur — neutre — il remet la cassette en marche, la coupe avant le tir, la remet, la coupe)*
« Il me manque un cinquième tireur depuis quatre-vingt-dix, {prenom}, et je ne désigne plus : je prends des volontaires. Moi, à ta place, je lèverais la main ; c'est facile, je n'ai jamais tiré. »
← **Je tire le cinquième** — effets : vestiaire +, tribunes +, direction +, set: cinquieme_tireur, relation.fauvel +1 — *Tu lèves la main. Fauvel te regarde, pour la première fois ; il ne dit rien, il chante l'hymne pour deux, ce soir-là.*
→ **Je ne tire pas les penaltys** — effets : vestiaire −, direction −, set: tireur_refuse — *Tu ne lèves pas la main. Il note. Il n'a toujours pas de cinquième tireur ; il ne l'aura jamais, c'est sa légende.*
**Traces** : cinquieme_tireur, tireur_refuse · **Réactions déclenchées** : — · **Lu plus tard par** : temps forts « tirs au but » de la famille sélection (ch. 14 : `cinquieme_tireur` en variante SÛR ; `tireur_refuse` en RISQUÉ), co.fauvel_liste variante « tu t'es proposé après moi » (ch. 01), jp_porteparole (epitaph_plus « il tirait le cinquième », ch. 30), une.quotidien.le_cinquieme_tireur (ch. 20)

### SCÈNE co.rossard.planche_plateau  —  Moi, à sa place
**Rôle** : entraineur · **Intrigue** : co.rossard_planche · **Étape** : 2/4 · **Moment** : saison 1 (`at_season +1`), créneaux [10,14], le dimanche soir après le derby · **Lieu** : la zone mixte, avec un écran de retour : Rossard parle sur le plateau, Vence tient le micro vers toi · **Conditions** : `chars.rossard.statut == staff` (consultant) ; year >= 1995 ; `chars.vence.statut == club` ; variante `_gagne` si `flag('derby_gagne')` (il trouve quand même quelque chose : « moi, à sa place, j'aurais gagné plus large »)
**ROSSARD** *(consultant, à l'écran — neutre — il ne te voit pas ; il parle à Ménèche, et à trois millions de personnes)*
« Le coach a changé de système à la soixantième et il a perdu le milieu ; moi, à sa place, je l'aurais fait à la mi-temps, mais je ne suis pas à sa place. Personne n'y est. »
← **Je réponds au consultant** — effets : tribunes +, direction −, parole +1, set: rossard_repondu — *Tu réponds dans le micro de Vence. Il t'entend dans l'oreillette ; il sourit, à l'antenne, c'est rare, et il dit que tu as raison sur un point.*
→ **Je le laisse parler** — effets : direction +, tribunes −, set: rossard_ignore — *Tu ne réponds pas. Il parle jusqu'à la pub ; il a douze minutes, il les prend toutes.*
**Traces** : rossard_repondu, [rossard_ignore] · **Réactions déclenchées** : co.re.rossard_plateau (§ 6) · **Lu plus tard par** : sl.consultant_savonne (ch. 14 : variante « vous m'aviez répondu, à l'époque »), co.vence.action_ralenti (§ 5 : Vence a l'image de ta réponse), co.rossard.planche_savon (« vous m'aviez répondu ; je m'en souviens »), une.quotidien.moi_a_sa_place (ch. 20)

### SCÈNE co.rossard.planche_savon  —  Le savon
**Rôle** : selectionneur · **Intrigue** : co.rossard_planche · **Étape** : 3/4 · **Moment** : saison 2 ou plus, la veille du tournoi (chaîne Tournoi, ch. 14 : avant l'annonce) · **Lieu** : le parking de l'hôtel des Cobalts ; il a attendu dans sa voiture, il sort quand tu passes, comme Fardelli, mais il n'a pas de gourmette · **Conditions** : `chars.rossard.statut in [staff, retraite]` ; variantes lues dans l'ordre : `flag('rossard_repondu')` → « vous m'aviez répondu, à l'époque ; je m'en souviens, c'est pour ça que je suis là » ; `flag('cahier_rossard')` → « vous avez mon cahier ; je viens vous dire ce qui n'est pas dedans » ; sinon neutre
**ROSSARD** *(consultant — neutre — il parle vite, il a un plateau dans deux heures)*
« Je vais vous découper à l'antenne trois semaines, c'est mon métier ; mais voilà ce que j'ai vu de votre groupe, et c'est vrai. Moi, à votre place, je me nommerais un conseiller, et ce serait moi. »
← **Je le nomme conseiller** — effets : tribunes +, direction −, vestiaire −, set: rossard_conseiller, relation.rossard +2 — *Tu le nommes. Il ne découpe plus ; Ménèche s'en charge, moins bien. Le groupe se demande pourquoi l'ancien est dans le bus.*
→ **Qu'il me découpe** — effets : vestiaire +, tribunes −, parole +1, set: rossard_libre — *Il te découpe trois semaines, avec justesse ; à la fin, il dit que c'était quand même un groupe. Tu ne sais pas si c'est un compliment.*
**Traces** : rossard_conseiller, rossard_libre · **Réactions déclenchées** : co.re.rossard_plateau (§ 6, →) · **Lu plus tard par** : sl.tournoi chaîne (ch. 14 : le plateau du soir lit `rossard_libre` ; le bus lit `rossard_conseiller`), co.fauvel_liste variante « le conseiller a le cahier, on est un groupe, pas un cahier » (ch. 01), sl_ennemi_public et sl_fete (epitaph_plus, ch. 30), co.vence.action_elimination (§ 5, variante `_rossard`), une.gazette.le_conseiller (ch. 20)

### SCÈNE co.rossard.planche_quatre_vingt_dix_huit  —  Quatre-vingt-dix-huit
**Rôle** : instance · **Intrigue** : co.rossard_planche · **Étape** : 4/4 · **Moment** : saison 2 ou plus, year >= 2008, créneaux [13,16] (l'ordre du jour du Congrès) · **Lieu** : ton bureau de la Fédération ; il est venu sans rendez-vous, Josiane l'a laissé entrer parce qu'elle l'a vu passer en 1990 · **Conditions** : `chars.rossard.statut in [staff, retraite]` ; `!flag('rossard_honore')` ; variante `_fauvel` si `chars.fauvel.statut in [club, staff]` (Fauvel, au syndicat, a écrit une lettre : « 98, c'était le groupe »)
**ROSSARD** *(consultant — neutre — il pose une photo de 1998 : vingt-trois joueurs, et un homme qu'on a coupé au bord)*
« Le groupe de 98 était le mien, vingt-trois noms sur vingt-trois, et le Congrès peut le dire en une ligne, point douze. Moi, à votre place, je l'aurais fait ; à ma place, je le demande. »
← **Point douze, le Congrès** — effets : direction +, tribunes −, set: rossard_honore, relation.rossard +1 — *Le Congrès vote la ligne. Fauvel se lève et dit que c'était le groupe ; la salle applaudit les deux, sans se lever.*
→ **98, c'est un autre** — effets : parole +1, direction −, set: rossard_oublie, relation.rossard −1 — *Tu refuses. Il commente le Congrès le dimanche soir ; à ta place, dit-il, il aurait eu le courage. Il a peut-être raison.*
**Traces** : rossard_honore, rossard_oublie · **Réactions déclenchées** : co.re.lea_confirme (§ 6) · **Lu plus tard par** : in.congres (ch. 15 : le point douze), co.nv.2022_rossard (ch. 31 : sa mort lit `rossard_honore` / `rossard_oublie`), co.fauvel_liste (ch. 01 : « c'était le groupe »), co.rossard.faveur_vingt_trois (ne se déclenche plus si `rossard_oublie`), une.quotidien.point_douze (ch. 20)

---

## 6. Les réactions définies par ce chapitre

Treize réactions communes (gabarit § 4.4) : trois citées par les paliers du § 4, dix par les intrigues du § 5 ; les autres réactions citées existent (`co.re.josiane_a_lu`, `co.re.gege_decoupe`, `co.re.camille_journal`, `en.re.josiane_cheque`, `en.re.fardelli_numero`). Servies au tirage suivant, hors créneau, jamais `drame`, plafond quatre par saison.

### RÉACTION co.re.josiane_a_vu_le_fax  —  L'accusé de réception
**Après** : co.fardelli.trahison_signe_ailleurs (variante DS, ←), co.solvang.trahison_libre (les deux), co.vialat.trahison_recrutement (←), co.lea.carnet_avant_le_fax (→) · **Famille** : tiers qui commente · **Conditions** : `chars.josiane.statut in [club, staff]` ; year < 2010 (« le fax »), sinon variante « le mail »
**JOSIANE** *(secrétaire — neutre — l'accusé de réception à la main, l'heure entourée)*
« Le fax est parti à 23 h 59, j'ai l'accusé ; j'en ai vu passer, vous savez, jamais un aussi tard. »
← **Gardez-le** — effets : direction +, relation.josiane +1 — *Elle le classe. Sous « en retard », un dossier épais.*
→ **Gardez-le** — effets : direction +, relation.josiane +1 — *Elle le classe. Sous « en retard », un dossier épais.*

### RÉACTION co.re.vence_direct  —  On est en direct
**Après** : co.lea.faveur_vingt_quatre_heures (→), co.legruet.trahison_avant_toi (les deux), co.bambini.trahison_choque (les deux), co.rossard.trahison_remplacant (les deux), co.lea.carnet_la_question, co.aubert.public_vestiaire, co.bambini.trophee_photo, co.colline.vu_machine · **Famille** : conséquence immédiate · **Conditions** : `chars.vence.statut == club`
**VENCE** *(Télé-Stade — neutre — le micro tendu par-dessus une barrière)*
« On est en direct, et tout le monde vient de l'entendre avant vous. Un mot ? »
← **Un mot : demain** — effets : tribunes +, relation.vence +1 — *Demain. Elle repasse le mot en boucle jusque-là.*
→ **Pas de mot** — effets : tribunes −, relation.vence −1 — *Le silence passe en direct. Il dure douze secondes ; c'est long.*

### RÉACTION co.re.dauzat_pv  —  Accusé réception
**Après** : co.malbec.trahison_denonce (les deux), co.dauzat.trahison_proces_verbal (les deux), co.josiane.fiche_federation, co.malbec.lettres_non_envoyee (→), co.aubert.public_delegue, co.legruet.congres_blanc, co.dauzat.pv_salle_3, co.roux.base_fils (→) · **Famille** : tiers qui commente · **Conditions** : `chars.dauzat.statut in [club, staff]`
**DAUZAT** *(secrétaire général — neutre — un tampon, une date)*
« J'ai accusé réception du dossier à 9 h 14, et de votre réponse à 9 h 20. C'est dans le procès-verbal. »
← **Notez que je conteste** — effets : direction −, parole +1 — *Il note. Ligne suivante, même page.*
→ **Notez ce que vous voulez** — effets : direction −, relation.dauzat −1 — *Il note ça aussi. Textuellement.*

Dix réactions supplémentaires, définies pour les intrigues du § 5 (chaque intrigue en cite une au moins) ; mêmes règles : tirage suivant, hors créneau, jamais `drame`, plafond quatre par saison, le nom du joueur n'y figure pas.

### RÉACTION co.re.solvang_compte  —  Elle compte
**Après** : co.fardelli.page_trois_page_une (les deux), co.fardelli.page_trois_en_face (→), co.solvang.mandat_refuse (→), co.solvang.mandat_pere_agent (→), co.malbec.lettres_vingt_cinq (←), co.vialat.soldes_intermediaire (←) · **Famille** : tiers qui commente · **Conditions** : `chars.solvang.statut in [club, rival]`
**SOLVANG** *(agente — neutre — elle passe dans le couloir, elle ne s'arrête pas, elle a déjà compté)*
« Mon client décide. Moi, je compte : ce que vous venez de signer, ou de ne pas signer, a un prix, et je l'ai. »
← **Dites-le-moi** — effets : direction +, relation.solvang +1 — *Elle le dit. C'est plus que tu pensais, dans un sens ou dans l'autre.*
→ **Gardez-le** — effets : caisse +, relation.solvang −1 — *Elle le garde. Elle le facturera à quelqu'un d'autre.*

### RÉACTION co.re.rossard_plateau  —  Moi, à sa place
**Après** : co.meneche.hors_micro_direct (les deux), co.vence.action_elimination (les deux), co.rossard.planche_plateau (les deux), co.rossard.planche_savon (→) · **Famille** : conséquence immédiate · **Conditions** : `chars.rossard.statut in [staff, retraite]` ; year >= 1995
**ROSSARD** *(consultant — neutre — à l'écran de la zone mixte, il ne sait pas que tu regardes)*
« Moi, à sa place, je l'aurais fait autrement, et je l'ai dit avant le match. Personne n'est à sa place, c'est le problème du poste. »
← **Je coupe l'écran** — effets : vestiaire +, relation.rossard −1 — *L'écran s'éteint. Le groupe l'a entendu quand même ; le groupe entend tout.*
→ **Je le laisse finir** — effets : tribunes −, relation.rossard +1 — *Il finit. Il termine par « mais c'est un groupe » ; tu ne sais toujours pas si c'est un compliment.*

### RÉACTION co.re.lea_confirme  —  Vous confirmez ?
**Après** : co.meneche.hors_micro_premiere (les deux), co.meneche.hors_micro_memoires (les deux), co.vence.action_directrice (les deux), co.amsel.temps_livre (les deux), co.rossard.planche_quatre_vingt_dix_huit (les deux) · **Famille** : tiers qui commente · **Conditions** : `chars.lea.statut == club`
**LÉA** *(presse — neutre — elle a entendu, elle a le carnet, elle veut la phrase exacte)*
« On m'a rapporté ce que vous venez de dire, en une phrase, et je ne publie pas une phrase rapportée. Vous confirmez ? »
← **Je confirme** — effets : tribunes +, parole +1 — *Elle publie la phrase, entre guillemets, avec la date. C'est ta phrase ; ça change tout.*
→ **Je ne confirme rien** — effets : direction +, relation.lea −1 — *Elle ne publie pas. La Gazette publie la phrase rapportée, sans guillemets, avec une faute.*

### RÉACTION co.re.roux_base  —  La base a entendu
**Après** : co.malbec.lettres_candidat (les deux), co.legruet.congres_tiroirs (les deux), co.pichon.francs_arrange (→), co.roux.base_prenom (les deux) · **Famille** : tiers qui commente · **Conditions** : `chars.roux.statut in [club, retraite]`
**ROUX** *(district — neutre — il a sa carte de délégué à la main, il la tient comme un ticket)*
« Le district, c'est la base, et la base a entendu ce que vous venez de faire ; je ne dis pas ce qu'elle en pense. Je le dirai au vote. »
← **Qu'elle vote** — effets : direction −, relation.roux −1 — *Elle votera. Elle vote toujours ; c'est ce qu'elle a de mieux.*
→ **Je viens samedi** — effets : tribunes +, relation.roux +1 — *Tu viens samedi. Ils sont vingt ; ils t'écoutent en manteau.*

### RÉACTION co.re.dupuis_pese  —  Je pèse mes mots
**Après** : co.aubert.public_synthetique (les deux), co.roux.base_fusion (les deux) · **Famille** : tiers qui commente · **Conditions** : `chars.dupuis.statut in [club, rival]` ; role in ['president_amateur', 'joueur_amateur']
**DUPUIS** *(boucher — neutre — il essuie ses mains sur le tablier avant de parler, par politesse)*
« La mairie décide, et le boucher paie les maillots ; je pèse mes mots, président : si le nom change, le mien reste dans le dos. Le meilleur du cochon, c'est moi. »
← **Le nom reste dans le dos** — effets : caisse +, relation.dupuis +1 — *Il reste. En plus gros, il a rappelé le brodeur.*
→ **On verra pour le dos** — effets : caisse −, relation.dupuis −1 — *Il ne voit rien. Il pèse le prochain chèque ; il est plus léger.*

### RÉACTION co.re.amsel_note  —  Elle note
**Après** : co.la_plume.copies_bar (les deux), co.la_plume.copies_dix_huit_millions (les deux), co.bambini.trophee_soixante_dix_neuf (→), co.bambini.trophee_ethique (→), co.dauzat.pv_ordre (les deux), co.amsel.temps_brigade (les deux), co.amsel.temps_hotel_du_lac (les deux) · **Famille** : tiers qui commente · **Conditions** : `season >= 1` ; `chars.amsel.statut in [club, staff]`
**AMSEL** *(procureure — neutre — par courrier, deux lignes, à l'heure du courrier)*
« Nous avons pris note de votre décision, à la date et à l'heure ; elle figurera au dossier, quel que soit le dossier. Nous avons tout notre temps. »
← **J'en prends note aussi** — effets : direction −, parole +1 — *Tu notes. Elle a noté avant ; c'est son métier, et elle le fait à l'heure.*
→ **Pas de réponse au courrier** — effets : direction +, relation.amsel −1 — *Tu ne réponds pas. Elle note ça aussi ; ça fait une ligne de plus.*

### RÉACTION co.re.vialat_recompte  —  Elle recompte
**Après** : co.nassir.actif_club_frere (les deux), co.la_plume.copies_mails (les deux), co.barbier.doudoune_tableur (les deux), co.aubert.public_locataire (les deux), co.vialat.soldes_agence (les deux), co.pichon.francs_successeur (←) · **Famille** : tiers qui commente · **Conditions** : `chars.vialat.statut in [club, staff]`
**VIALAT** *(Inspecteur — neutre — au téléphone, une calculatrice qu'on entend)*
« Votre décision a un coût que vous n'avez pas calculé, madame ou monsieur, et je l'ai calculé pour vous ; il tient sur une ligne. Je ne juge pas. Je compte. »
← **Quelle ligne ?** — effets : caisse −, direction + — *Elle dit la ligne. Tu la corriges avant jeudi ; c'est devenu une habitude.*
→ **Comptez ce que vous voulez** — effets : caisse +, relation.vialat −1 — *Elle compte. Ce qu'elle veut, c'est ce qui est vrai ; c'est le problème.*

### RÉACTION co.re.malbec_compris  —  Entre présidents
**Après** : co.aulard.empire_organigramme (les deux), co.aulard.empire_cher_collegue (les deux), co.solvang.mandat_preavis (les deux), co.malbec.lettres_banc_froid (les deux) · **Famille** : tiers qui commente · **Conditions** : `chars.malbec.statut in [club, rival]`
**MALBEC** *(président de Valentienne — neutre — un texto, ou un fax avant 2000, trois lignes, pas de bonjour)*
« Entre présidents, on se comprend : il vous l'a faite aussi, celle-là, et il me l'avait faite en 1994. J'ai gardé la lettre ; gardez la vôtre. »
← **Je garde la lettre** — effets : direction +, relation.malbec +1 — *Tu gardes. Vous êtes deux à garder des lettres ; ça s'appelle un bloc.*
→ **Je n'ai pas de lettre** — effets : direction −, relation.malbec −1 — *Tu n'en as pas. Il t'en enverra une, un jour, pour que tu en aies.*

### RÉACTION co.re.pichon_cinq_heures  —  Cinq heures
**Après** : co.barbier.doudoune_mardi (les deux), co.barbier.doudoune_caisse_de_vin (les deux), co.dupuis.dos_tournee (les deux), co.pichon.francs_noir (→), co.roux.base_samedi (les deux) · **Famille** : tiers qui commente · **Conditions** : `chars.pichon.statut in [club, retraite]`
**PICHON** *(boulanger — neutre — au téléphone, cinq heures, le pétrin derrière)*
« J'ai su, pour hier, petit, et j'appelle parce que le pain est fait ; je ne dis pas que tu as eu tort. Le foot, c'est après, et après, c'est maintenant. »
← **Merci, Roger** — effets : tribunes +, relation.pichon +1 — *Il raccroche. Il est cinq heures deux ; il a du retard sur les baguettes.*
→ **Il est cinq heures** — effets : relation.pichon −1 — *Il le sait. Il rappellera demain, à la même heure ; il n'a jamais regardé l'heure.*

### RÉACTION co.re.colline_vu  —  J'ai vu
**Après** : co.vence.action_zone_mixte (les deux, variante `_colline`), co.la_plume.copies_page_2411 (→), co.colline.vu_main (les deux), co.colline.vu_designateur (les deux) · **Famille** : conséquence immédiate · **Conditions** : `chars.colline.statut in [club, staff]`
**COLLINE** *(arbitre — neutre — il passe, il ne s'arrête pas, il te regarde en passant)*
« J'ai vu ce que vous venez de faire, monsieur, et je ne l'écrirai pas : ce n'est pas dans mon rapport, c'est dans ma mémoire. J'ai vu. »
← **C'est tout ce que je demande** — effets : parole +1, relation.colline +1 — *Il hoche la tête. Sa mémoire est longue ; elle est juste.*
→ **Écrivez ce que vous voulez** — effets : direction −, relation.colline −1 — *Il n'écrit rien. Il n'oublie rien non plus ; c'est pire, et il le sait.*

---

## 7. Les traces : posées ici, lues ailleurs (à remonter dans la matrice du chapitre 90)

### 7.1 Traces transversales de la charte lues par ce chapitre (§ 5.2)

| Trace | Où ce chapitre la lit |
|---|---|
| `naming_signe` | Nassir (fiche, retrouvailles « Arena Qatalyst ») ; Dupuis `faveur_tribune` (variante `_arena`) ; co.dupuis.dos_arena (variante `_qatalyst`, et la pose côté Dupuis) ; co.aubert.public_locataire (variante `_qatalyst`) ; co.nv.2015_arena_dupuis (renvoi ch. 31) |
| `club_actif` | co.nassir.trahison_notification (variante `_proprietaire`) ; co.vialat.trahison_recrutement (variante `_actif`) ; co.nassir.actif_trente_pour_cent (variante `_proprietaire`) ; co.vialat.soldes_jeudi (variante `_actif`) ; fiche Nassir |
| `enveloppe_promise` | co.meneche.trahison_dossier (variante « la valise ») ; co.la_plume.trahison_documents ; co.meneche.faveur_enterre (condition) ; co.malbec.trahison_denonce (variante `_enveloppe`) ; co.malbec.lettres_non_envoyee (condition) ; co.amsel.temps_garde_a_vue (condition) ; co.roux.base_samedi (variante « la voiture verte ») ; **posée** côté amateur par co.pichon.francs_arrange (→) |
| `enveloppe_refusee` | fiche Fardelli (il commence à −1) ; fiche Colline (« il te regarde autrement ») |
| `fede_dossier` | co.josiane.faveur_classeur (variante « la convocation ») ; co.dauzat.trahison_proces_verbal (variante « votre audition ») ; co.legruet.congres_blanc (variante `_dossier`) ; fiche Legruet ; posée aussi par co.malbec.trahison_denonce, co.colline.trahison_rapport (←) et co.malbec.lettres_non_envoyee (→) |
| `president_ami` | co.aulard.faveur_rappel (renvoi ch. 13) ; co.malbec.faveur_ma_voix (« Aulard ou Malbec ») ; co.aulard.empire_tiroirs (variante « votre nom dans la colonne « les miens » ») ; co.aulard.empire_cher_collegue (renvoi ch. 15) |
| `selection_refusee` | fiche Legruet (joueur : il commence à −1, « on ne dit pas non deux fois ») ; **posée** par co.legruet.congres_liste (→) et co.rossard.trahison_remplacant (variante joueur, →) |
| `vote_achete` | co.meneche.trahison_dossier (« l'hôtel du Lac ») ; co.la_plume.trahison_documents (« les relevés ») ; co.dauzat.trahison_proces_verbal ; co.amsel.trahison_six_heures ; co.bambini.faveur_mes_amis (renvoi ch. 15) ; co.lea.carnet_la_question (variante) ; co.la_plume.copies_dix_huit_millions, co.dauzat.pv_ordre, co.amsel.temps_hotel_du_lac (conditions d'entrée) |
| `diplome_arrange` | co.meneche.trahison_dossier (« le tampon ») ; co.legruet.congres_derogation (la rend possible par `derogation_attendue`, renvoi ch. 11) |
| `commission_lettre` | co.josiane.faveur_classeur (variante « la lettre ») ; co.dauzat.faveur_page_41 (renvoi ch. 13) ; co.vialat.faveur_ligne_douze (la désarme) ; **posée** par co.vialat.soldes_jeudi (les deux côtés) |
| `ligue_fermee_signee` | fiche Montoya ; co.bambini.trahison_choque (variante `_ligue`) ; co.montoya.trahison_debout (renvoi ch. 13) ; co.montoya.table_fils (variante) ; co.bambini.trophee_trois_heures (variante `_assis`) ; co.nassir.actif_trente_pour_cent (renvoi ch. 13) |
| `mondial_desert` | fiche Nassir (sélectionneur : le calendrier) ; co.nassir.faveur_un_club (renvoi ch. 15) ; co.lea.carnet_la_question (variante « les ouvriers du chantier ») ; co.nassir.actif_club_frere (renvoi ch. 13) |
| `aubert_ministre` | co.aubert.trahison_subvention (variante ministère) ; co.aubert.faveur_ministere (variante `_ministre`) ; co.aubert.public_vestiaire (condition) ; fiche Aubert |
| `ecoutes` | co.meneche.trahison_dossier ; co.la_plume.trahison_documents ; co.amsel.trahison_six_heures ; co.la_plume.faveur_source (renvoi ch. 13) ; co.la_plume.copies_page_2411 et co.amsel.temps_garde_a_vue (conditions) ; co.colline.vu_designateur (la pose en aval, par `demande_insistee`) ; fiche Colline |
| `offshore` | co.meneche.faveur_enterre (condition) ; co.la_plume.trahison_documents ; co.amsel.trahison_six_heures ; fiche Amsel (DS) |
| `flacon_b` | co.meneche.trahison_dossier (« le flacon ») ; co.meneche.faveur_enterre (condition) |
| `bus_menace` | co.vence.trahison_en_direct (variante `_bus`) |
| `salaires_retard` | co.vialat.trahison_recrutement (renvoi ch. 11) |
| `mbako_vendu` | co.solvang.faveur_page_trois (renvoi ch. 12) ; co.barbier.faveur_sous_la_pluie (renvoi ch. 11) |
| `gerard_parti` | co.pichon.trahison_cinq_heures et co.roux.trahison_huis_clos (renvois ch. 13) |
| `fusion_signee` | fiche Roux (la fusion recommandée) ; co.aubert.faveur_ministere (renvoi ch. 13) |
| `monde_bosquet` | co.solvang.trahison_libre (year >= 1995, sinon variante `_clause`) |
| `divorce` | co.vence.trahison_en_direct (réaction Camille sous `!divorce`) ; co.vence.action_elimination (variante `_camille` sous `!divorce`) ; co.pichon.francs_cinq_heures (réaction) |
| `international`, `capitaine`, `genou_opere` | co.legruet.congres_liste (pose `international`) ; co.malbec.lettres_vingt_cinq (lit `capitaine`) ; fiches Legruet, Malbec |
| `pisteur`, `pari`, `offshore` | co.la_plume.copies_bar, co.amsel.temps_brigade (conditions) ; co.la_plume.copies_mails, co.vialat.soldes_intermediaire (conditions) |
| `grand_match_perdu`, `derby_gagne`, `derby_perdu` | co.vence.action_elimination, co.bambini.trophee_photo (variante `_perdu`) ; co.rossard.planche_plateau (variante `_gagne`) ; co.montoya.table_veille_du_derby (pose `derby_perdu` par forfait de banc, renvoi ch. 11) |
| `mbako_mere`, `gamin_barbier`, `vukic_dauphin`, `boucher_sponsor`, `sous_tutelle`, `monde_ligue_fermee` | co.solvang.mandat_mere ; co.fardelli.page_trois_star, co.nassir.actif_club_frere ; co.aulard.empire_fils ; co.dupuis.dos_capitaine ; co.aubert.public_delegue ; co.bambini.trophee_trois_heures |

### 7.2 Traces nouvelles posées par les paliers (nom · ligne d'Almanach · posée par · lue par)

Toutes en snake_case, un souvenir, jamais un verbe à l'infinitif ; la ligne d'Almanach est écrite par le moteur au `set`. Chaque lecteur est nommé dans la scène (« Lu plus tard par ») ; le chapitre 90 vérifie qu'il existe.

| # | Trace | Ligne d'Almanach (`{annee} : …`, ≤ 120) | Posée par | Lue par |
|---|---|---|---|---|
| 1 | `star_vendue_dos` | {annee} : Fardelli a vendu la star de {nom} dans son dos. Le vestiaire l'a lu dans la presse. | co.fardelli.trahison_signe_ailleurs | ch. 20 (Une), ch. 30 (ds_mercato_rate plus), ch. 90 (Nemesis), ch. 11 (retour de Mbako) |
| 2 | `premier_appel` | {annee} : un grand club a appelé {nom}. Fardelli l'a dit en premier, avant le président. | co.fardelli.faveur_premier_appel | ch. 30 (bilan_carrefour), ch. 20, co.retrouvailles.fardelli_sourire |
| 3 | `dossier_sorti` | {annee} : le dossier Ménèche est sorti, avec les dates. {nom} a répondu avant, ou après. | co.meneche.trahison_dossier | ch. 20, ch. 30 (grand_deballage plus), ch. 15 (valises), ch. 90 (Fantôme consultant) |
| 4 | `dossier_enterre` | {annee} : Ménèche a enterré un dossier sur {nom}. Il a gardé le reçu. | co.meneche.faveur_enterre | ch. 20 (La Plume : « ce que le Quotidien n'a pas écrit »), ch. 15 (Amsel), ch. 31 (mémoires 2025) |
| 5 | `cheque_non_date` | {annee} : Aulard a posé un chèque non daté devant {nom}. Josiane l'a daté. | co.aulard.trahison_cheque_non_date | ch. 30 (en_sms, en_placard plus), ch. 15 (bloc Aulard), ch. 20, ch. 90 (Nemesis) |
| 6 | `aulard_rappelle` | {annee} : « Je te vire souvent, je te rappelle toujours. » Aulard a rappelé {nom}. | co.aulard.faveur_rappel | ch. 30 (Porte de sortie, Carrefour), ch. 11 (en.aulard_rappelle ×2), ch. 13 |
| 7 | `dossier_transmis` | {annee} : Josiane a donné le dossier de {nom} au successeur. Complet, daté. | co.josiane.trahison_sous_les_autres | ch. 30 (en_sms, ds_commun_accord, pr_ag plus ; bilan_verdict), ch. 20 |
| 8 | `josiane_prevenu` | {annee} : Josiane a montré la lettre à {nom} avant qu'elle n'existe. Une seule fois. | co.josiane.faveur_classeur | ch. 13 (commission), ch. 15 (convocation), ch. 30 (bilan_verdict), ch. 20 |
| 9 | `une_lea` | {annee} : une question en Une, signée Léa : « Vous saviez ? » {nom} a répondu, ou pas. | co.lea.trahison_une_question | ch. 20 (priorité 3), ch. 30 (grand_deballage plus), ch. 10 (mémoires), ch. 90 |
| 10 | `lea_a_tenu` | {annee} : Léa a tenu l'histoire vingt-quatre heures. {nom} a parlé le premier. | co.lea.faveur_vingt_quatre_heures | ch. 20, ch. 15 (dix-huit millions), ch. 30 (jp_consultant plus) |
| 11 | `nassir_retire` | {annee} : Qatalyst a retiré ses panneaux, par notification. Gégé en a gardé un. | co.nassir.trahison_notification | ch. 30 (en_placard, pr_pantin plus), ch. 11 (variante « encore »), ch. 20, ch. 12 |
| 12 | `nassir_sans_condition` | {annee} : une saison sans condition, offerte par Nassir à {nom}. « C'est un club. » | co.nassir.faveur_un_club | ch. 12 (fenêtre), ch. 13, ch. 15 (tournoi du désert), ch. 30 (en_coupable plus) |
| 13 | `libre_chez_rival` | {annee} : le joueur de {nom} est parti libre chez {rival}. Solvang avait compté. | co.solvang.trahison_libre | ch. 20, ch. 12, ch. 11 (derby), ch. 90 (Nemesis) |
| 14 | `page_trois_solvang` | {annee} : Solvang a montré la page trois à {nom}. Fardelli l'avait écrite en 1990. | co.solvang.faveur_page_trois | ch. 12 (fax), ch. 10 (clause), ch. 20, co.retrouvailles.fardelli_noir |
| 15 | `phrase_de_trop` | {annee} : la phrase de trop, en direct, répétée par {nom} à Vence. | co.vence.trahison_en_direct | ch. 20, ch. 30 (sl_ennemi_public, in_showman plus), ch. 14, ch. 90 |
| 16 | `plateau_offert` | {annee} : Vence a gardé le fauteuil du dimanche pour {nom}. Sans montage. | co.vence.faveur_plateau | ch. 30 (Carte Destin consultant ×2 ; jp_consultant, en_retraite plus), ch. 14, ch. 20 |
| 17 | `documents_publies` | {annee} : La Plume avait les documents. Elle les a sortis un samedi. {nom} savait. | co.la_plume.trahison_documents | ch. 30 (grand_deballage, pr_commission, in_pages plus), ch. 15, ch. 20, co.amsel.faveur_temoin |
| 18 | `source_plume` | {annee} : {nom} n'était pas le sujet de La Plume. C'était la source. Le sujet, c'était {rival}. | co.la_plume.faveur_source | ch. 15 (lanceur_alerte), ch. 13 (écoutes du rival), ch. 90 (Nemesis), ch. 20 |
| 19 | `rapport_trop_lent` | {annee} : le rapport de Barbier disait « trop lent ». Il pleuvait. | co.barbier.trahison_trop_lent | ch. 30 (Carte Destin amateur → pro), ch. 10, ch. 12, ch. 20 |
| 20 | `gamin_barbier` | {annee} : Barbier a donné un gamin de Néville à {nom}. Vu sous la pluie. | co.barbier.faveur_sous_la_pluie | ch. 12, ch. 11 (second prodige), ch. 13, ch. 31 (enterrement 2021) |
| 21 | `malbec_denonce` | {annee} : Malbec a déposé le dossier de {nom} à la Fédération. Entre présidents. | co.malbec.trahison_denonce | ch. 11 (commission), ch. 15, ch. 20, ch. 30 (in_defiance plus) |
| 22 | `voix_malbec` | {annee} : Malbec a promis sa voix à {nom}, et celle du Nord. | co.malbec.faveur_ma_voix | ch. 30 (Carte Destin président → Fédération), ch. 15, ch. 13, ch. 20 |
| 23 | `exclu_de_la_table` | {annee} : onze clubs, une table, pas de chaise pour {nom}. Debout. | co.montoya.trahison_debout | ch. 13 (mépris), ch. 15, ch. 20, ch. 30 (pr_siege plus) |
| 24 | `chaise_montoya` | {annee} : Montoya a tiré une chaise pour {nom}. À sa droite. | co.montoya.faveur_assis | ch. 30 (Carte Destin président → Union), ch. 15, ch. 13, ch. 20 |
| 25 | `dupuis_chez_montbeliac` | {annee} : DUPUIS dans le dos de Montbéliac. En vert et rose. | co.dupuis.trahison_montbeliac | ch. 13, ch. 20, ch. 30 (pa_buvette plus), ch. 10 |
| 26 | `tribune_dupuis` | {annee} : Dupuis a payé la tribune, en dur. Une plaque de deux mètres. | co.dupuis.faveur_tribune | ch. 13 (remplace stade_promis), ch. 11 (tribune), ch. 31 (2015), ch. 20 |
| 27 | `subvention_coupee` | {annee} : la subvention de {ville} supprimée, à l'unanimité moins une voix. | co.aubert.trahison_subvention | ch. 30 (pa_subvention, pr_mairie plus), ch. 13, ch. 14, ch. 20 |
| 28 | `aubert_soutien` | {annee} : Aubert a inscrit le club au budget. « Sans contrepartie », au stylo. | co.aubert.faveur_ministere | ch. 13, ch. 15 (tutelle), ch. 30 (fin *Le Ministre*), ch. 20 |
| 29 | `annonce_avant_toi` | {annee} : Legruet a annoncé le départ de {nom} à la télé. {nom} regardait. | co.legruet.trahison_avant_toi | ch. 30 (sl_minuit, in_defiance plus), ch. 14, ch. 15, ch. 20 |
| 30 | `districts_legruet` | {annee} : Legruet a donné ses districts à {nom}. Roux a transmis. | co.legruet.faveur_les_districts | ch. 15 (élection), ch. 30 (Battu au Congrès plus ; Carte Destin), co.roux.faveur_siege |
| 31 | `bambini_choque` | {annee} : Bambini « est choqué » par {nom}. En direct. Le mème a duré quatre ans. | co.bambini.trahison_choque | ch. 15 (Campagne), ch. 20, ch. 30 (in_pantin, in_defiance plus), ch. 13 |
| 32 | `amis_bambini` | {annee} : les amis de Bambini sont ceux de {nom}. Deux confédérations. | co.bambini.faveur_mes_amis | ch. 15 (Campagne, valises), ch. 30 (in_pantin plus), ch. 20 |
| 33 | `pv_fuite` | {annee} : la réunion « informelle » de {nom} avait un procès-verbal. Amsel en a copie. | co.dauzat.trahison_proces_verbal | ch. 15, co.amsel.trahison_six_heures, ch. 20, ch. 30 |
| 34 | `page_41` | {annee} : Dauzat a montré la page 41 à {nom}. Personne ne la lit. | co.dauzat.faveur_page_41 | ch. 15 (défiance annulée), ch. 13 (rétrogradation contestée), ch. 30, ch. 14 |
| 35 | `recrutement_bloque` | {annee} : {club} interdit de recrutement. Vialat a compté : ligne douze. | co.vialat.trahison_recrutement | ch. 12, ch. 20, ch. 30 (ds_contrats, pr_commission plus), ch. 11 |
| 36 | `ligne_douze` | {annee} : Vialat a prévenu {nom} une fois. Ligne douze. La lettre n'est pas partie. | co.vialat.faveur_ligne_douze | ch. 13 (désarme commission_lettre), ch. 30, ch. 12, ch. 15 |
| 37 | `perquisition` | {annee} : six heures du matin, deux imperméables, douze cartons. Amsel avait tout son temps. | co.amsel.trahison_six_heures | ch. 15 (valises), ch. 30 (fins judiciaires, le_repenti), ch. 20, co.la_plume.trahison_documents |
| 38 | `temoin_amsel` | {annee} : {nom} n'était pas un dossier. C'était un témoin. Trois heures. | co.amsel.faveur_temoin | ch. 15 (lanceur_alerte), ch. 30 (le_repenti), ch. 13, ch. 90, ch. 20 |
| 39 | `rapport_colline` | {annee} : Colline a vu, et écrit. Le rapport est parti le soir même. | co.colline.trahison_rapport | ch. 11 (commission), ch. 15, ch. 20, ch. 30 (pr_ecoutes plus) |
| 40 | `titre_propre` | {annee} : Colline n'a rien donné à {nom}. Tout le stade l'a vu. | co.colline.faveur_rien | ch. 30 (statue de bronze plus), ch. 11 (carte-légende), ch. 15, ch. 20 |
| 41 | `pichon_reprend` | {annee} : Pichon a repris les clés. Le pain, c'est à cinq heures. | co.pichon.trahison_cinq_heures | ch. 30 (pa_club plus), ch. 10, ch. 20, ch. 13 |
| 42 | `cles_pichon` | {annee} : trois clés sur une baguette. Le club est à {nom}. Gérard a le double. | co.pichon.faveur_les_cles | ch. 30 (Carte Destin), ch. 15, ch. 13, ch. 20 |
| 43 | `huis_clos` | {annee} : le district a fermé le stade trois matchs. Sans buvette. | co.roux.trahison_huis_clos | ch. 30 (pa_village plus), ch. 13, ch. 20, ch. 15 |
| 44 | `siege_district` | {annee} : Roux a proposé un siège à {nom}. Le samedi matin, en costume. | co.roux.faveur_siege | ch. 30 (Carte Destin), ch. 15, co.legruet.faveur_les_districts, ch. 20 |

Traces transversales **posées aussi** par ce chapitre (déjà déclarées, pas de doublon) : `fede_dossier` (co.malbec.trahison_denonce, co.colline.trahison_rapport ←), `club_a_lancienne` (co.nassir.faveur_un_club →). Demandes au chapitre 20 : une manchette par trace nouvelle (quarante-quatre titres, ≤ 44 caractères, listés dans chaque « Lu plus tard par ») ; au chapitre 30 : les `epitaph_plus` cités ; au chapitre 90 : les six cartes de Nemesis qui lisent `star_vendue_dos`, `cheque_non_date`, `une_lea`, `libre_chez_rival`, `source_plume`, `temoin_amsel`.

### 7.3 Traces nouvelles posées par les intrigues et par les paliers de Rossard (nom · posée par · lue par)

La ligne d'Almanach de chaque trace est écrite dans la fiche de son intrigue (§ 5, rubrique **Issues → Traces → Qui les lit**) ; les drapeaux internes entre crochets (agente_fardelli, anonyme_livre, benevole, capitaine_garde, chapitre_relu, clause_refusee, club_frere_refus, communique_refuse, contrat_minuit, debout_diner, demande_en_direct, derby_dabord, dupuis_refuse_arena, excuse_roux, exil_refuse, fiche_nom, fiche_prenom, hors_micro_rien, indemnite_tarif, malbec_refuse, notes_secretes, page_trois_ds, page_trois_lue, page_trois_signee, reponse_lea, rossard_ignore, roux_sans_couronne, sanction_acceptee, silence_plume, tiroirs_ouverts, tout_diffuse, vence_pas_vu) n'ont pas de ligne et ne sont lus que par leur intrigue. Chaque lecteur est nommé dans la scène (« Lu plus tard par ») ; le chapitre 90 vérifie qu'il existe.

| # | Trace | Posée par | Lue par |
|---|---|---|---|
| 1 | `remplacant_nomme` | co.rossard.trahison_remplacant | ch. 14, ch. 30, ch. 20, co.legruet.trahison_avant_toi, co.fantome.consultant, ch. 90 |
| 2 | `cahier_rossard` | co.rossard.faveur_vingt_trois | ch. 14, co.rossard.planche_quatre_vingt_dix_huit, § 5, ch. 01, ch. 20, ch. 30 |
| 3 | `page_trois_barree` | co.fardelli.page_trois_en_face | ch. 12, co.vialat.soldes_intermediaire, § 5, co.nemesis.fardelli, ch. 90, ch. 20 |
| 4 | `carnet_reconnu` | co.fardelli.page_trois_voix_haute | ch. 15, ch. 30, co.la_plume.trahison_documents, ch. 20 |
| 5 | `carnet_nie` | co.fardelli.page_trois_voix_haute | ch. 15, ch. 30, co.la_plume.trahison_documents, ch. 20 |
| 6 | `hors_micro_dit` | co.meneche.hors_micro_premiere | co.meneche.hors_micro_chronique, ch. 11, ch. 10, ch. 20 |
| 7 | `compo_meneche` | co.meneche.hors_micro_chronique | ch. 11, ch. 01, ch. 20, co.meneche.hors_micro_memoires |
| 8 | `promesse_plateau` | co.meneche.hors_micro_direct | ch. 30, ch. 13, ch. 20, co.meneche.hors_micro_memoires |
| 9 | `chapitre_meneche` | co.meneche.hors_micro_memoires | co.nv.2025_memoires_meneche, ch. 31, co.fantome.consultant, ch. 90, ch. 30, ch. 20 |
| 10 | `projet_aulard` | co.aulard.empire_organigramme | ch. 30, ch. 11, ch. 20, co.aulard.empire_tiroirs |
| 11 | `fils_aulard_staff` | co.aulard.empire_fils | ch. 11, ch. 01, ch. 20, co.aulard.empire_tiroirs |
| 12 | `vote_gros` | co.aulard.empire_cher_collegue | ch. 13, ch. 15, co.malbec.lettres_candidat, § 5, ch. 20 |
| 13 | `vote_petits` | co.aulard.empire_cher_collegue | ch. 13, ch. 15, co.malbec.lettres_candidat, § 5, ch. 20 |
| 14 | `tiroirs_aulard` | co.aulard.empire_tiroirs | ch. 15, ch. 30, co.retrouvailles.aulard_noir, ch. 20 |
| 15 | `fiche_josiane` | co.josiane.fiche_federation | co.dauzat.pv_ordre, § 5, ch. 15, co.retrouvailles.josiane_sourire, ch. 20 |
| 16 | `petite_josiane` | co.josiane.fiche_niece | co.nv.2022_petite_josiane, ch. 31, ch. 30, co.retrouvailles.josiane_sourire, ch. 90 |
| 17 | `promesse_echo` | co.lea.carnet_au_local | co.lea.carnet_la_question, ch. 20, ch. 30, ch. 01 |
| 18 | `lea_savait` | co.lea.carnet_avant_le_fax | ch. 12, co.lea.trahison_une_question, ch. 20, co.lea.carnet_la_question |
| 19 | `lea_niee` | co.lea.carnet_avant_le_fax | ch. 12, co.lea.trahison_une_question, ch. 20, co.lea.carnet_la_question |
| 20 | `question_lea` | co.lea.carnet_la_question | ch. 15, ch. 30, ch. 20, co.lea.carnet_dimanche |
| 21 | `lettre_echo` | co.lea.carnet_dimanche | ch. 31, ch. 30, ch. 90 |
| 22 | `exil_dore` | co.nassir.actif_vitrine | ch. 10, co.nassir.actif_trente_pour_cent, ch. 90, ch. 20 |
| 23 | `club_frere_pret` | co.nassir.actif_club_frere | ch. 12, ch. 13, ch. 14, co.barbier.doudoune_tableur, § 5 |
| 24 | `nassir_trente` | co.nassir.actif_trente_pour_cent | ch. 13, ch. 15, ch. 20, co.nassir.actif_franchises |
| 25 | `nassir_zero` | co.nassir.actif_trente_pour_cent | ch. 13, ch. 15, ch. 20, co.nassir.actif_franchises |
| 26 | `vote_franchises` | co.nassir.actif_franchises | co.nv.2040_franchises, ch. 31, ch. 30, ch. 90, ch. 20 |
| 27 | `vote_contre_franchises` | co.nassir.actif_franchises | co.nv.2040_franchises, ch. 31, ch. 30, ch. 90, ch. 20 |
| 28 | `agente_solvang` | co.solvang.mandat_refuse | ch. 10, co.fardelli.page_trois_en_face, co.retrouvailles.fardelli_noir, ch. 20 |
| 29 | `solvang_mbako` | co.solvang.mandat_mere | ch. 11, ch. 01, co.solvang.trahison_libre, ch. 20 |
| 30 | `clause_spatiale` | co.solvang.mandat_pere_agent | ch. 12, ch. 31, ch. 20, co.solvang.faveur_page_trois |
| 31 | `preavis_double` | co.solvang.mandat_preavis | ch. 13, co.malbec.lettres_banc_froid, § 5, ch. 01, ch. 20 |
| 32 | `coach_parti_solvang` | co.solvang.mandat_preavis | ch. 13, co.malbec.lettres_banc_froid, § 5, ch. 01, ch. 20 |
| 33 | `vence_franc` | co.vence.action_zone_mixte | ch. 10, co.colline.vu_main, § 5, co.vence.action_ralenti, ch. 20 |
| 34 | `vence_replay` | co.vence.action_ralenti | ch. 11, ch. 30, ch. 20, co.fantome.consultant, ch. 90 |
| 35 | `larmes_direct` | co.vence.action_elimination | ch. 14, ch. 30, ch. 01, co.rossard.planche_savon, § 5, ch. 20 |
| 36 | `sec_direct` | co.vence.action_elimination | ch. 14, ch. 30, ch. 01, co.rossard.planche_savon, § 5, ch. 20 |
| 37 | `exclu_vence` | co.vence.action_directrice | ch. 13, ch. 15, ch. 30, ch. 20 |
| 38 | `source_bar` | co.la_plume.copies_bar | ch. 10, co.amsel.temps_brigade, § 5, ch. 20, co.la_plume.faveur_source |
| 39 | `ligne_confirmee` | co.la_plume.copies_mails | ch. 12, ch. 30, co.amsel.trahison_six_heures, ch. 20 |
| 40 | `ligne_niee` | co.la_plume.copies_mails | ch. 12, ch. 30, co.amsel.trahison_six_heures, ch. 20 |
| 41 | `demission_avant` | co.la_plume.copies_page_2411 | ch. 13, ch. 30, co.colline.vu_designateur, § 5, co.amsel.temps_garde_a_vue, ch. 20 |
| 42 | `attente_samedi` | co.la_plume.copies_page_2411 | ch. 13, ch. 30, co.colline.vu_designateur, § 5, co.amsel.temps_garde_a_vue, ch. 20 |
| 43 | `pos` | co.la_plume.copies_dix_huit_millions | ch. 15, ch. 30, ch. 20 |
| 44 | `documents_gardes` | co.la_plume.copies_dix_huit_millions | ch. 15, ch. 30, ch. 20 |
| 45 | `essai_manque` | co.barbier.doudoune_mardi | ch. 30, ch. 10, ch. 01, ch. 20 |
| 46 | `couru_pluie` | co.barbier.doudoune_rapport | co.barbier.trahison_trop_lent, ch. 10, ch. 01, ch. 20 |
| 47 | `oeil_barbier` | co.barbier.doudoune_tableur | ch. 12, ch. 01, ch. 30, ch. 20 |
| 48 | `indemnite_vin` | co.barbier.doudoune_caisse_de_vin | ch. 13, ch. 01, ch. 31, ch. 20 |
| 49 | `malbec_ecoute` | co.malbec.lettres_banc_froid | ch. 11, co.aulard.empire_cher_collegue, co.solvang.mandat_preavis, § 5, ch. 20 |
| 50 | `capitaine_vendu_malbec` | co.malbec.lettres_vingt_cinq | ch. 01, ch. 12, ch. 13, ch. 20 |
| 51 | `pacte_malbec` | co.malbec.lettres_candidat | ch. 15, ch. 30, co.retrouvailles.malbec_noir, ch. 20 |
| 52 | `duel_malbec` | co.malbec.lettres_candidat | ch. 15, ch. 30, co.retrouvailles.malbec_noir, ch. 20 |
| 53 | `transfert_siecle` | co.montoya.table_pont | ch. 10, ch. 90, ch. 20, co.montoya.table_diner |
| 54 | `derby_abandonne` | co.montoya.table_veille_du_derby | ch. 11, ch. 01, ch. 20 |
| 55 | `assis_diner` | co.montoya.table_diner | ch. 13, co.montoya.faveur_assis, ch. 15, ch. 20 |
| 56 | `fils_montoya_chaise` | co.montoya.table_fils | ch. 15, ch. 30, co.nv.2027_montoya, ch. 31, ch. 20 |
| 57 | `fils_dupuis_joue` | co.dupuis.dos_tournee | ch. 01, ch. 10, co.dupuis.dos_capitaine, ch. 20 |
| 58 | `capitaine_dupuis` | co.dupuis.dos_capitaine | ch. 13, ch. 01, ch. 30, ch. 20 |
| 59 | `arena_dupuis` | co.dupuis.dos_arena | co.nv.2015_arena_dupuis, ch. 31, ch. 13, ch. 01, ch. 20 |
| 60 | `rose_enterrement` | co.dupuis.dos_rose | ch. 31, ch. 90, ch. 01, ch. 20 |
| 61 | `synthetique_fils` | co.aubert.public_synthetique | ch. 13, ch. 01, ch. 10, ch. 20 |
| 62 | `boue_gardee` | co.aubert.public_synthetique | ch. 13, ch. 01, ch. 10, ch. 20 |
| 63 | `stade_locataire` | co.aubert.public_locataire | ch. 13, co.dupuis.dos_arena, § 5, co.nassir.actif_trente_pour_cent, ch. 20 |
| 64 | `stade_prive` | co.aubert.public_locataire | ch. 13, co.dupuis.dos_arena, § 5, co.nassir.actif_trente_pour_cent, ch. 20 |
| 65 | `ministre_vestiaire` | co.aubert.public_vestiaire | ch. 14, ch. 01, ch. 30, ch. 20 |
| 66 | `vestiaire_ferme` | co.aubert.public_vestiaire | ch. 14, ch. 01, ch. 30, ch. 20 |
| 67 | `delegue_accepte` | co.aubert.public_delegue | ch. 15, ch. 30, co.bambini.trahison_choque, ch. 20 |
| 68 | `tutelle_refusee` | co.aubert.public_delegue | ch. 15, ch. 30, co.bambini.trahison_choque, ch. 20 |
| 69 | `contrat_blanc` | co.legruet.congres_blanc | ch. 14, ch. 30, co.dauzat.pv_minuit, § 5, ch. 20 |
| 70 | `minuit_attendu` | co.legruet.congres_blanc | ch. 14, ch. 30, co.dauzat.pv_minuit, § 5, ch. 20 |
| 71 | `liste_districts_publiee` | co.legruet.congres_tiroirs | ch. 15, co.roux.base_prenom, § 5, ch. 30, ch. 20 |
| 72 | `liste_districts_gardee` | co.legruet.congres_tiroirs | ch. 15, co.roux.base_prenom, § 5, ch. 30, ch. 20 |
| 73 | `main_serree` | co.bambini.trophee_photo | ch. 14, ch. 01, ch. 30, ch. 20 |
| 74 | `main_refusee` | co.bambini.trophee_photo | ch. 14, ch. 01, ch. 30, ch. 20 |
| 75 | `communique_signe` | co.bambini.trophee_trois_heures | ch. 13, co.montoya.trahison_debout, ch. 30, ch. 20 |
| 76 | `vote_bambini` | co.bambini.trophee_soixante_dix_neuf | ch. 15, co.bambini.faveur_mes_amis, ch. 30, ch. 20 |
| 77 | `contre_bambini` | co.bambini.trophee_soixante_dix_neuf | ch. 15, co.bambini.faveur_mes_amis, ch. 30, ch. 20 |
| 78 | `bambini_lache` | co.bambini.trophee_ethique | ch. 15, co.amsel.temps_hotel_du_lac, § 5, ch. 30, co.nv.2024_bambini, ch. 31 |
| 79 | `bambini_protege` | co.bambini.trophee_ethique | ch. 15, co.amsel.temps_hotel_du_lac, § 5, ch. 30, co.nv.2024_bambini, ch. 31 |
| 80 | `vice_de_forme` | co.dauzat.pv_salle_3 | ch. 11, ch. 01, co.dauzat.faveur_page_41, ch. 20 |
| 81 | `article_barre` | co.dauzat.pv_minuit | ch. 14, ch. 30, co.legruet.congres_blanc, § 5, co.dauzat.faveur_page_41, ch. 20 |
| 82 | `dauzat_garde` | co.dauzat.pv_hostile | ch. 15, ch. 30, co.amsel.temps_hotel_du_lac, § 5, co.retrouvailles.dauzat_noir, ch. 20 |
| 83 | `dauzat_parti` | co.dauzat.pv_hostile | ch. 15, ch. 30, co.amsel.temps_hotel_du_lac, § 5, co.retrouvailles.dauzat_noir, ch. 20 |
| 84 | `pv_ordre` | co.dauzat.pv_ordre | ch. 15, co.amsel.temps_hotel_du_lac, § 5, ch. 30, ch. 20 |
| 85 | `pv_desordre` | co.dauzat.pv_ordre | ch. 15, co.amsel.temps_hotel_du_lac, § 5, ch. 30, ch. 20 |
| 86 | `tableau_signe` | co.vialat.soldes_tableau | ch. 30, co.aulard.trahison_cheque_non_date, ch. 20 |
| 87 | `tableau_refuse` | co.vialat.soldes_tableau | ch. 30, co.aulard.trahison_cheque_non_date, ch. 20 |
| 88 | `nom_donne` | co.vialat.soldes_intermediaire | ch. 12, co.amsel.trahison_six_heures, co.fardelli.page_trois_voix_haute, § 5, ch. 20 |
| 89 | `nom_tu` | co.vialat.soldes_intermediaire | ch. 12, co.amsel.trahison_six_heures, co.fardelli.page_trois_voix_haute, § 5, ch. 20 |
| 90 | `plan_vialat` | co.vialat.soldes_jeudi | ch. 13, ch. 12, ch. 30, co.vialat.faveur_ligne_douze, ch. 20 |
| 91 | `tribunal_saisi` | co.vialat.soldes_jeudi | ch. 13, ch. 12, ch. 30, co.vialat.faveur_ligne_douze, ch. 20 |
| 92 | `notes_publiees` | co.vialat.soldes_agence | ch. 15, co.nv.2033_notation, ch. 31, ch. 90, ch. 01, ch. 20 |
| 93 | `brigade_parle` | co.amsel.temps_brigade | ch. 10, co.la_plume.copies_bar, § 5, ch. 30, ch. 20 |
| 94 | `brigade_muet` | co.amsel.temps_brigade | ch. 10, co.la_plume.copies_bar, § 5, ch. 30, ch. 20 |
| 95 | `valise_expliquee` | co.amsel.temps_garde_a_vue | ch. 13, ch. 30, co.colline.vu_designateur, § 5, ch. 20 |
| 96 | `silence_garde_a_vue` | co.amsel.temps_garde_a_vue | ch. 13, ch. 30, co.colline.vu_designateur, § 5, ch. 20 |
| 97 | `ma_porte_dabord` | co.amsel.temps_hotel_du_lac | ch. 15, ch. 30, co.bambini.trophee_ethique, § 5, ch. 90, ch. 20 |
| 98 | `porte_voisine` | co.amsel.temps_hotel_du_lac | ch. 15, ch. 30, co.bambini.trophee_ethique, § 5, ch. 90, ch. 20 |
| 99 | `nom_dans_le_livre` | co.amsel.temps_livre | co.nv.2028_livre_amsel, ch. 31, ch. 30, ch. 90, ch. 20 |
| 100 | `main_avouee` | co.colline.vu_main | ch. 10, co.vence.action_zone_mixte, § 5, ch. 30, co.colline.faveur_rien, ch. 20 |
| 101 | `main_niee` | co.colline.vu_main | ch. 10, co.vence.action_zone_mixte, § 5, ch. 30, co.colline.faveur_rien, ch. 20 |
| 102 | `banc_assume` | co.colline.vu_banc | co.dauzat.pv_salle_3, § 5, ch. 01, ch. 11, ch. 30, ch. 20 |
| 103 | `adjoint_livre` | co.colline.vu_banc | co.dauzat.pv_salle_3, § 5, ch. 01, ch. 11, ch. 30, ch. 20 |
| 104 | `demande_retiree` | co.colline.vu_designateur | ch. 13, co.amsel.temps_garde_a_vue, § 5, ch. 30, ch. 20 |
| 105 | `demande_insistee` | co.colline.vu_designateur | ch. 13, co.amsel.temps_garde_a_vue, § 5, ch. 30, ch. 20 |
| 106 | `machine_signee` | co.colline.vu_machine | ch. 15, co.nv.2027_machine, ch. 31, ch. 30, co.retrouvailles.colline_sourire, ch. 90 |
| 107 | `machine_refusee` | co.colline.vu_machine | ch. 15, co.nv.2027_machine, ch. 31, ch. 30, co.retrouvailles.colline_sourire, ch. 90 |
| 108 | `francs_noir` | co.pichon.francs_noir | ch. 10, ch. 01, co.pichon.francs_successeur, § 5, co.vialat.soldes_agence, ch. 20 |
| 109 | `c` | co.pichon.francs_arrange | ch. 10, co.roux.base_samedi, § 5, ch. 15, ch. 30, ch. 20 |
| 110 | `pichon_appel` | co.pichon.francs_cinq_heures | ch. 30, ch. 90, co.retrouvailles.pichon_sourire, ch. 20 |
| 111 | `noir_continue` | co.pichon.francs_successeur | ch. 13, ch. 01, co.vialat.soldes_agence, § 5, ch. 30, ch. 20 |
| 112 | `tout_declare` | co.pichon.francs_successeur | ch. 13, ch. 01, co.vialat.soldes_agence, § 5, ch. 30, ch. 20 |
| 113 | `coude_assume` | co.roux.base_samedi | ch. 10, co.roux.trahison_huis_clos, ch. 01, ch. 20 |
| 114 | `fusion_contre` | co.roux.base_fusion | ch. 13, co.aubert.public_synthetique, § 5, ch. 90, co.aubert.trahison_subvention, ch. 20 |
| 115 | `firmin_dit` | co.roux.base_prenom | ch. 15, co.legruet.faveur_les_districts, ch. 31, ch. 30, ch. 20 |
| 116 | `firmin_tu` | co.roux.base_prenom | ch. 15, co.legruet.faveur_les_districts, ch. 31, ch. 30, ch. 20 |
| 117 | `couronne_roux` | co.roux.base_fils | ch. 15, ch. 31, co.legruet.faveur_les_districts, ch. 90, ch. 20 |
| 118 | `cinquieme_tireur` | co.rossard.planche_cinquieme | ch. 14, ch. 01, ch. 30, ch. 20 |
| 119 | `tireur_refuse` | co.rossard.planche_cinquieme | ch. 14, ch. 01, ch. 30, ch. 20 |
| 120 | `rossard_repondu` | co.rossard.planche_plateau | ch. 14, co.vence.action_ralenti, § 5, co.rossard.planche_savon, ch. 20 |
| 121 | `rossard_conseiller` | co.rossard.planche_savon | ch. 14, ch. 01, ch. 30, co.vence.action_elimination, § 5, ch. 20 |
| 122 | `rossard_libre` | co.rossard.planche_savon | ch. 14, ch. 01, ch. 30, co.vence.action_elimination, § 5, ch. 20 |
| 123 | `rossard_honore` | co.rossard.planche_quatre_vingt_dix_huit | ch. 15, co.nv.2022_rossard, ch. 31, ch. 01, co.rossard.faveur_vingt_trois, ch. 20 |
| 124 | `rossard_oublie` | co.rossard.planche_quatre_vingt_dix_huit | ch. 15, co.nv.2022_rossard, ch. 31, ch. 01, co.rossard.faveur_vingt_trois, ch. 20 |

### 7.4 Nouveaux éléments de monde introduits (à déclarer au chapitre 90)

Voix sans portrait : « le fils d'Aulard » (déjà ch. 11), « le fils Malbec », « le fils de Roux » (délégué dès 2012), « le nouveau maire », « le dauphin » (de Bambini), « le président de l'Union », « le DTN » (après 2010), « le secrétaire général » (après 2032), « l'algorithme de notation » (après 2033), « la brigade » et « la procureure suivante », « la machine » (2027), « la voix générée d'un ancien joueur » (années 2030), « le neveu de l'émir » (2030), « le fils de Montoya » (2027), « le fils de Dupuis » (2020), « le Rosé » (déjà charte). Personnage nouveau, à déclarer au chapitre 90 et à créer dans `characters.yaml` : **Aimé Rossard** (`rossard`, sélectionneur des Cobalts 1986-1994, consultant Télé-Stade 1995-2015, camp `selection`, § 4.3), avec les voix « le sélectionneur de 98 », « le stagiaire de Valdorne » (devient « l'algorithme »), « le père-agent », « le fils Aubert », « le dictateur » (sans réplique), « Maître Vidal » (déjà charte). Mandats fixés par ce chapitre et absents de la charte : Léa au Quotidien 2018-2035 ; Vence retraite 2035 ; à la Fédération, « le président » sans nom 2020-2028, Bréhaut 2028-2036, Mbako 2036-2044 (par défaut ; Fauvel reste au syndicat jusqu'en 2030 comme l'écrit le chapitre 01) ; Castan DTN 2010-2030 (ch. 01) ; Bréhaut à la Ligue 2020-2028 ; Nassir à la Ligue 2028-2040 ; Aubert présidente de région 2012-2030 ; Colline consultant arbitrage 2001-2008 ; Amsel retraite 2028 ; Dauzat retraite 2032. Décès fixés : Fardelli 2032, Ménèche 2039, Aulard 2026, Josiane 2041, Bambini 2024, Dauzat 2044, Amsel 2039, Colline 2046, Barbier 2021, Malbec 2033, Dupuis 2034, Pichon 2019, Roux 2014, Aubert 2043 (Legruet 2029 et Montoya 2027 sont de la charte). Décès fixés en plus : Rossard 2022 (devant une séance de tirs au but). Détails : l'attachée de presse Léa (1991-1993, joueur), Vaucastel comme club « laissé passer » par Vialat en 1989, Néville comme ville du gamin de Barbier, « Fernand » pour Roux, la clause dix-neuf (« hors de l'atmosphère »), la page 2 411, le point douze du Congrès, la caisse de douze bouteilles de Valdorne, la carte de délégué périmée du fils de Roux.

---

## 8. La check-list cochée

**Par scène** (quarante-six paliers, quarante-six retrouvailles, quatre-vingt-douze scènes d'intrigue, treize réactions) : id conforme § 4.10 (`co.<id>.trahison_<mot>` / `faveur_<mot>`, `co.retrouvailles.<id>_<sourire|noir>`, `co.re.<qui>_<quoi>`) ; rôle, intrigue (palier), étape, moment, lieu, conditions remplis ; locuteur de § 2 avec son statut (`statut_ok`) et son époque (year) ; deux phrases, un tic, un nom une fois, ≤ 200 caractères, présent ; deux libellés ≤ 28, première personne, distincts, sans « Oui / Non », sans le nom du joueur ; effets § 4.11 (un à trois effets de jauge par côté, un `+++` au plus par carte, relation ±1) ; conséquence sans explication ; traces posées déclarées § 6.2 et lues ; réactions citées existantes ou définies § 5 ; `{toi}` seulement chez un locuteur à adresse (Aubert, Vialat, Amsel et La Plume disent « madame ou monsieur {nom} » ou « {nom} » : pas de `{toi}`) ; aucun nom réel, aucune monnaie réelle, aucun chiffre de jauge ; jamais `drame` (le −3 est atteignable en S0) ; les scènes de La Plume et d'Amsel portent `season >= 1` ; les scènes d'intrigue portent chacune un rôle, une étape n/4, une fenêtre de créneaux, une condition d'année quand un objet d'époque est cité (fax avant 2010, Plateau après 2003, machine en 2027, écus après 2002), deux sorties jouables, et un « Lu plus tard par » non vide ; les voix sans portrait (la petite Josiane, le fils de Montoya, le fils de Dupuis, le fils de Roux) parlent une fois chacune et n'ont pas de relation.

**Par intrigue** (vingt-trois) : logline, synopsis, porteur ∈ cast, thème fermé, issues ≥ 2, traces ≥ 1 avec ligne d'Almanach ≤ 120, séquencier à quatre étapes avec fenêtres, une étape au moins en `at_season +1`, une variante au moins qui lit une trace d'un autre chapitre (§ 7.1), une réaction au moins (§ 6), un épilogue par abandon, aucune issue « la bonne », aucune scène de drame, La Plume et Amsel jamais en S0.

**Par chapitre** : 23 fiches (§ 4.2 complet : fonction, genre, âge, camp, fenêtre, suivant, tic et trois torsions, désir, blessure, adresse par rôle, ce qu'il pense de toi, paliers, dans les rôles, trajectoire par décennie, retrouvailles, six à huit cartes propres) ; 46 scènes de palier ; 46 répliques de retrouvailles ; 23 intrigues et 92 scènes d'intrigue ; 13 réactions ; la table des mandats § 2 (corrigée sur le chapitre 01 : Fauvel au syndicat, Castan DTN) ; la table des retournements § 3 ; les douze traces attribuées par § 5.2 lues (§ 7.1) ; quarante-quatre traces nouvelles de palier (§ 7.2) et les traces d'intrigue (§ 7.3), toutes avec lecteur ; années cohérentes avec § 1.1 (fax avant 2010, écus après 2002, Plateau après 2003, vidéo après 2016, machine en 2027, Arena Dupuis en 2015) ; les dix-sept existants gardent nom, tic, camp et adresses `entraineur`/`joueur` de `characters.yaml`. Longueur : le chapitre dépasse la cible parce que les minima de la charte (vingt-trois fiches, paliers et retrouvailles) et l'intrigue propre par personnage (même exigence que le chapitre 01) l'imposent ; les scènes sont denses plutôt que nombreuses (quatre par intrigue, le minimum du gabarit). Relecture croisée à faire par le chapitre 01 (les retrouvailles de Josiane, Fardelli et Ménèche doivent être harmonisées avec celles de Vukić, Gégé et Vecchio écrites là-bas : même mécanique, même longueur ; les scènes de Fauvel dans co.rossard_planche et co.bambini_trophee lisent la fiche Fauvel du chapitre 01).

**Écart signalé au showrunner** : le chapitre dépasse la longueur indicative (8 000 à 12 000 mots) parce que la charte exige 22 fiches, 44 scènes et 44 retrouvailles au gabarit complet ; rien n'a été ajouté au-delà des nombres de § 5.1. Si la longueur doit baisser, on coupe les « Cartes propres » (elles sont redondantes avec les chapitres 10-15) avant tout le reste.
