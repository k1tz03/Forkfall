# FUSIBLE — Bible scénaristique · 02 · Les personnages de la direction, des instances, de la presse et de la sélection

> Vingt-deux visages qui ne jouent jamais au ballon et qui décident de tout. Ce chapitre écrit leur fiche complète au gabarit § 4.2 de la charte, leurs deux scènes de palier (−3 la trahison, +3 la faveur) au gabarit § 4.1, leurs deux répliques de retrouvailles, leurs cartes propres, et la table « qui préside quoi, quand ». Il lit les traces que la charte lui attribue (`naming_signe`, `club_actif`, `enveloppe_promise`, `fede_dossier`, `president_ami`, `selection_refusee`, `vote_achete`, `diplome_arrange`, `commission_lettre`, `ligue_fermee_signee`, `mondial_desert`, `aubert_ministre`) et en pose vingt-six nouvelles, chacune avec un lecteur nommé (§ 6 : la matrice à remonter au chapitre 90).

Comment lire : § 1 la règle du chapitre (le même visage, l'autre côté de la table) ; § 2 la table des mandats 1990-2050 ; § 3 la table des retournements par rôle ; § 4 les vingt-deux fiches, chacune suivie de ses deux scènes de palier, de ses retrouvailles et de ses cartes propres ; § 5 les réactions que ce chapitre définit ; § 6 les traces posées et lues ; § 7 la check-list cochée.

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
| 1990-1996 | Legruet (depuis 1988) ; Dauzat secrétaire général | « un président qu'on ne nomme pas » (le syndicat des présidents) ; Aulard et Malbec s'y détestent | « le président de l'Union », sans portrait ; siège à l'hôtel du Lac | Bambini (depuis 1986) | « le ministre », sans nom | Vialat, l'Inspecteur (depuis 1989) | Brissac DTN (depuis 1988) · Colline arbitre de D1 (le sifflet) | Ménèche au Quotidien (« Hors micro ») ; Léa à L'Écho ; Vence en zone mixte pour Télé-Stade ; La Plume à la Gazette |
| 1996-2000 | Legruet réélu 1996 (de sept voix) | Aulard président 1998 | idem | Bambini réélu | Aubert députée 1997 ; « le ministre » toujours sans nom | Vialat | Brissac · Colline (Coupe d'été 1996 : la main sifflée contre son pays) | idem ; le Quotidien titre sur les Cobalts de 1998 |
| 2000-2004 | Legruet réélu 2000 (de neuf voix) | Aulard | idem | Bambini | **Aubert ministre 2002** (`aubert_ministre`) | Vialat | Brissac · Colline raccroche le sifflet (45 ans, 2001), consultant arbitrage à Télé-Stade | Ménèche consultant Télé-Stade 2003 ; Vence présente « Le plateau » 2003 ; Médiacrash prend les droits |
| 2004-2008 | Legruet, dernier mandat ; il « verra ça après le Congrès » de 2008 | Aulard (Malbec attend) | Legruet candidat 2008 | Bambini | Aubert | Vialat | Brissac · Colline « désignateur » officieux | Ménèche ; Gégé sur Radio Tribune (2004-2011) ; le Flux (2007) |
| 2008-2012 | **Aulard 2008** (Malbec battu, « sans passer par les districts ») ; Dauzat | **Malbec 2008** | **Legruet 2008** (élu de neuf voix : il ne fait jamais mieux) | Bambini réélu 2010 ; Nassir au comité du Mondial (`mondial_desert` 2010) | Aubert (jusqu'en 2012) | Vialat | Brissac jusqu'en 2010, puis « le DTN », sans nom ; **Colline responsable de l'arbitrage 2008** | Ménèche directeur d'antenne 2012 ; Barbier à la retraite (2006), l'« algorithme » naît (2008) |
| 2012-2016 | Aulard réélu 2012 ; 2013 : « le ministre » dissout le comité (`sous_tutelle`) | Malbec | Legruet réélu 2012 ; **Dauzat secrétaire général de l'Union 2012** | Bambini se représente à 79 ans (2011), puis se retire en 2016 | « le ministre », sans nom (2012-2020) | Vialat | « le DTN » · Colline | Vence, Ménèche ; la vidéo (2016) |
| 2016-2020 | **toi, sinon Malbec 2016** (« la voie sans les districts », enfin) | Malbec jusqu'en 2020, puis Bréhaut (DS devenu président) | Legruet retraité 2016 → « le dauphin » de Bambini glisse ici, ou toi | **« le dauphin », ou toi** (`elu_surprise` 2016) ; Josiane secrétaire de la FédéMonde (2016-2022) | idem | Vialat | idem | **Léa rédactrice en chef du Quotidien 2018** ; Solvang reprend le carnet de Fardelli (2018) ; Vence directrice de l'info (2020) |
| 2020-2028 | Fauvel 2020 (par défaut : « la voie de la légende », le syndicat l'a porté) ; limite d'âge de 75 ans votée | Bréhaut (2020-2028) | toi, ou « le président de l'Union » | « le dauphin » réélu 2020, **Dauzat secrétaire général de la FédéMonde 2020** ; Amsel frappe à l'hôtel du Lac (2021) | « le ministre » ; Sacha dans l'ONG des ouvriers (2022) | Vialat | Colline face à « la machine » (2027) | Ménèche publie ses mémoires (2025) ; Kick (2024) ; Legruet meurt (2029) |
| 2028-2040 | Fauvel réélu 2028 ; **Mbako 2036** (« le retour », par défaut) | **Nassir 2028** (« le fonds préside la Ligue ») | « le président de l'Union » | « le conseil » : plus de patron identifiable ; Vialat dirige l'agence de notation (2033) | idem | l'agence de notation (Vialat, 2033) puis « l'algorithme de notation » | « la machine » | Vence se retire (2035) ; « la voix générée d'un ancien joueur » commente ; L'Écho, le dimanche |
| 2040-2050 | Mbako jusqu'en 2044, puis « le président », sans nom | la Ligue des franchises (loi de 2040) | idem | idem | idem | l'algorithme | idem | L'Écho de {ville}, dernier journal papier ; l'écran-bilan du siècle (2050) |

Trois notes de lecture. (a) Quand le joueur prend une case, le personnage délogé garde sa fenêtre et sa rancune : Malbec battu en 2016 par toi est ton ennemi de Congrès jusqu'en 2020 (« Entre présidents, on se comprend. Vous, je ne vous comprends pas. »). (b) La Fédération se vote en juin des années 1992, 1996, 2000… ; la Ligue en septembre ; l'Union et la FédéMonde à l'hôtel du Lac, l'année qui suit le Mondial. (c) Les voix sans portrait (« le ministre », « le dauphin », « le président de l'Union », « le DTN ») n'ont pas de relation ; elles sont là pour que le monde tienne quand un personnage à statut est hors fenêtre.

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

---

## 4. Les vingt-deux fiches

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
**Traces** : lea_a_tenu · **Réactions déclenchées** : co.re.vence_direct (§ 5) · **Lu plus tard par** : une.echo.il_a_parle_le_premier (ch. 20), in.dix_huit_millions variante « Léa avait tenu, La Plume non » (ch. 15), jp_consultant (epitaph_plus « Léa lui avait donné vingt-quatre heures », ch. 30)

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
**Traces** : libre_chez_rival · **Réactions déclenchées** : co.re.josiane_a_vu_le_fax (§ 5) · **Lu plus tard par** : une.gazette.parti_libre (ch. 20), ds.mercato variante « le trou au poste » (ch. 12), co.derby variante « il joue contre toi, libre » (ch. 11), co.nemesis.solvang (ch. 90)

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
**Traces** : malbec_denonce (et `fede_dossier`, transversale n° 34, posée ici aussi) · **Réactions déclenchées** : co.re.dauzat_pv (§ 5) · **Lu plus tard par** : en.commission_discipline variante « Malbec a parlé » (ch. 11), in.dossier (ch. 15, lit `fede_dossier`), une.quotidien.entre_presidents (ch. 20), in_defiance (epitaph_plus « le bloc Malbec », ch. 30)

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
**Traces** : annonce_avant_toi · **Réactions déclenchées** : co.re.vence_direct (§ 5) · **Lu plus tard par** : sl_minuit et in_defiance (epitaph_plus, ch. 30), sl.tournoi variante « le groupe sait que tu pars » (ch. 14), in.heritage variante « il l'avait fait à ton prédécesseur » (ch. 15), une.quotidien.annonce_avant_lui (ch. 20)

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
**Traces** : bambini_choque · **Réactions déclenchées** : co.re.vence_direct (§ 5) · **Lu plus tard par** : in.campagne variante « ses confédérations votent contre » (ch. 15), une.gazette.choque (ch. 20, priorité 3), in_pantin et in_defiance (epitaph_plus, ch. 30), pr.ligue_fermee heure 6 variante (ch. 13, lit `ligue_fermee_signee`)

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
**Traces** : pv_fuite · **Réactions déclenchées** : co.re.dauzat_pv (§ 5) · **Lu plus tard par** : in.valises variante « le PV est chez Amsel » (ch. 15, lit `vote_achete`), co.amsel.trahison_six_heures (ci-dessous : « nous avons le procès-verbal »), une.gazette.le_proces_verbal (ch. 20), in_defiance (epitaph_plus « Dauzat a lu la page 12 », ch. 30)

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
**Traces** : recrutement_bloque · **Réactions déclenchées** : co.re.josiane_a_vu_le_fax (§ 5) · **Lu plus tard par** : ds.mercato fenêtre suivante variante « aucune offre entrante » (ch. 12), une.gazette.interdit_de_recruter (ch. 20), ds_contrats et pr_commission (epitaph_plus, ch. 30), en.salaires_retard variante « la ligne douze » (ch. 11, lit `salaires_retard`)

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

## 5. Les réactions définies par ce chapitre

Trois réactions communes (gabarit § 4.4), citées par les scènes ci-dessus ; les autres réactions citées existent (`co.re.josiane_a_lu`, `co.re.gege_decoupe`, `co.re.camille_journal`, `en.re.josiane_cheque`, `en.re.fardelli_numero`). Servies au tirage suivant, hors créneau, jamais `drame`, plafond quatre par saison.

### RÉACTION co.re.josiane_a_vu_le_fax  —  L'accusé de réception
**Après** : co.fardelli.trahison_signe_ailleurs (variante DS, ←), co.solvang.trahison_libre (les deux), co.vialat.trahison_recrutement (←) · **Famille** : tiers qui commente · **Conditions** : `chars.josiane.statut in [club, staff]` ; year < 2010 (« le fax »), sinon variante « le mail »
**JOSIANE** *(secrétaire — neutre — l'accusé de réception à la main, l'heure entourée)*
« Le fax est parti à 23 h 59, j'ai l'accusé ; j'en ai vu passer, vous savez, jamais un aussi tard. »
← **Gardez-le** — effets : direction +, relation.josiane +1 — *Elle le classe. Sous « en retard », un dossier épais.*
→ **Gardez-le** — effets : direction +, relation.josiane +1 — *Elle le classe. Sous « en retard », un dossier épais.*

### RÉACTION co.re.vence_direct  —  On est en direct
**Après** : co.lea.faveur_vingt_quatre_heures (→), co.legruet.trahison_avant_toi (les deux), co.bambini.trahison_choque (les deux) · **Famille** : conséquence immédiate · **Conditions** : `chars.vence.statut == club`
**VENCE** *(Télé-Stade — neutre — le micro tendu par-dessus une barrière)*
« On est en direct, et tout le monde vient de l'entendre avant vous. Un mot ? »
← **Un mot : demain** — effets : tribunes +, relation.vence +1 — *Demain. Elle repasse le mot en boucle jusque-là.*
→ **Pas de mot** — effets : tribunes −, relation.vence −1 — *Le silence passe en direct. Il dure douze secondes ; c'est long.*

### RÉACTION co.re.dauzat_pv  —  Accusé réception
**Après** : co.malbec.trahison_denonce (les deux), co.dauzat.trahison_proces_verbal (les deux) · **Famille** : tiers qui commente · **Conditions** : `chars.dauzat.statut in [club, staff]`
**DAUZAT** *(secrétaire général — neutre — un tampon, une date)*
« J'ai accusé réception du dossier à 9 h 14, et de votre réponse à 9 h 20. C'est dans le procès-verbal. »
← **Notez que je conteste** — effets : direction −, parole +1 — *Il note. Ligne suivante, même page.*
→ **Notez ce que vous voulez** — effets : direction −, relation.dauzat −1 — *Il note ça aussi. Textuellement.*

---

## 6. Les traces : posées ici, lues ailleurs (à remonter dans la matrice du chapitre 90)

### 6.1 Traces transversales de la charte lues par ce chapitre (§ 5.2)

| Trace | Où ce chapitre la lit |
|---|---|
| `naming_signe` | Nassir (fiche, retrouvailles « Arena Qatalyst ») ; Dupuis `faveur_tribune` (variante `_arena`) ; co.nv.2015_arena_dupuis (renvoi ch. 31) |
| `club_actif` | co.nassir.trahison_notification (variante `_proprietaire`) ; co.vialat.trahison_recrutement (variante `_actif`) ; fiche Nassir (président : propriétaire ou actionnaire) |
| `enveloppe_promise` | co.meneche.trahison_dossier (variante « la valise ») ; co.la_plume.trahison_documents ; co.meneche.faveur_enterre (condition) ; co.malbec.trahison_denonce (variante `_enveloppe`) ; fiche Roux (le match arrangé côté amateur) |
| `enveloppe_refusee` | fiche Fardelli (il commence à −1) ; fiche Colline (« il te regarde autrement ») |
| `fede_dossier` | co.josiane.faveur_classeur (variante « la convocation ») ; co.dauzat.trahison_proces_verbal (variante « votre audition ») ; fiche Legruet (il te lâche plus tôt) ; posée aussi par co.malbec.trahison_denonce et co.colline.trahison_rapport (←) |
| `president_ami` | co.aulard.faveur_rappel (renvoi ch. 13) ; co.malbec.faveur_ma_voix (« Aulard ou Malbec ») |
| `selection_refusee` | fiche Legruet (joueur : il commence à −1, « on ne dit pas non deux fois ») |
| `vote_achete` | co.meneche.trahison_dossier (« l'hôtel du Lac ») ; co.la_plume.trahison_documents (« les relevés ») ; co.dauzat.trahison_proces_verbal ; co.amsel.trahison_six_heures ; co.bambini.faveur_mes_amis (renvoi ch. 15) |
| `diplome_arrange` | co.meneche.trahison_dossier (« le tampon ») |
| `commission_lettre` | co.josiane.faveur_classeur (variante « la lettre ») ; co.dauzat.faveur_page_41 (renvoi ch. 13) ; co.vialat.faveur_ligne_douze (la désarme) |
| `ligue_fermee_signee` | fiche Montoya ; co.bambini.trahison_choque (variante `_ligue`) ; co.montoya.trahison_debout (renvoi ch. 13) |
| `mondial_desert` | fiche Nassir (sélectionneur : le calendrier) ; co.nassir.faveur_un_club (renvoi ch. 15) |
| `aubert_ministre` | co.aubert.trahison_subvention (variante ministère) ; co.aubert.faveur_ministere (variante `_ministre`) ; fiche Aubert |
| `ecoutes` | co.meneche.trahison_dossier ; co.la_plume.trahison_documents ; co.amsel.trahison_six_heures ; co.la_plume.faveur_source (renvoi ch. 13) ; fiche Colline |
| `offshore` | co.meneche.faveur_enterre (condition) ; co.la_plume.trahison_documents ; co.amsel.trahison_six_heures ; fiche Amsel (DS) |
| `flacon_b` | co.meneche.trahison_dossier (« le flacon ») ; co.meneche.faveur_enterre (condition) |
| `bus_menace` | co.vence.trahison_en_direct (variante `_bus`) |
| `salaires_retard` | co.vialat.trahison_recrutement (renvoi ch. 11) |
| `mbako_vendu` | co.solvang.faveur_page_trois (renvoi ch. 12) ; co.barbier.faveur_sous_la_pluie (renvoi ch. 11) |
| `gerard_parti` | co.pichon.trahison_cinq_heures et co.roux.trahison_huis_clos (renvois ch. 13) |
| `fusion_signee` | fiche Roux (la fusion recommandée) ; co.aubert.faveur_ministere (renvoi ch. 13) |
| `monde_bosquet` | co.solvang.trahison_libre (year >= 1995, sinon variante `_clause`) |
| `divorce` | co.vence.trahison_en_direct (réaction Camille sous `!divorce`) |

### 6.2 Traces nouvelles posées par ce chapitre (nom · ligne d'Almanach · posée par · lue par)

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

### 6.3 Nouveaux éléments de monde introduits (à déclarer au chapitre 90)

Voix sans portrait : « le fils d'Aulard » (déjà ch. 11), « le fils Malbec », « le fils de Roux » (délégué dès 2012), « le nouveau maire », « le dauphin » (de Bambini), « le président de l'Union », « le DTN » (après 2010), « le secrétaire général » (après 2032), « l'algorithme de notation » (après 2033), « la brigade » et « la procureure suivante », « la machine » (2027), « la voix générée d'un ancien joueur » (années 2030), « le neveu de l'émir » (2030), « le fils de Montoya » (2027), « le fils de Dupuis » (2020), « le Rosé » (déjà charte). Mandats fixés par ce chapitre et absents de la charte : Léa au Quotidien 2018-2035 ; Vence retraite 2035 ; Fauvel président de la Fédération 2020-2036 (par défaut) ; Mbako 2036-2044 (par défaut) ; Bréhaut à la Ligue 2020-2028 ; Nassir à la Ligue 2028-2040 ; Aubert présidente de région 2012-2030 ; Colline consultant arbitrage 2001-2008 ; Amsel retraite 2028 ; Dauzat retraite 2032. Décès fixés : Fardelli 2032, Ménèche 2039, Aulard 2026, Josiane 2041, Bambini 2024, Dauzat 2044, Amsel 2039, Colline 2046, Barbier 2021, Malbec 2033, Dupuis 2034, Pichon 2019, Roux 2014, Aubert 2043 (Legruet 2029 et Montoya 2027 sont de la charte). Détails : l'attachée de presse Léa (1991-1993, joueur), Vaucastel comme club « laissé passer » par Vialat en 1989, Néville comme ville du gamin de Barbier, « Fernand » pour Roux.

---

## 7. La check-list cochée

**Par scène** (quarante-quatre paliers, quarante-quatre retrouvailles, trois réactions) : id conforme § 4.10 (`co.<id>.trahison_<mot>` / `faveur_<mot>`, `co.retrouvailles.<id>_<sourire|noir>`, `co.re.<qui>_<quoi>`) ; rôle, intrigue (palier), étape, moment, lieu, conditions remplis ; locuteur de § 2 avec son statut (`statut_ok`) et son époque (year) ; deux phrases, un tic, un nom une fois, ≤ 200 caractères, présent ; deux libellés ≤ 28, première personne, distincts, sans « Oui / Non », sans le nom du joueur ; effets § 4.11 (un à trois effets de jauge par côté, un `+++` au plus par carte, relation ±1) ; conséquence sans explication ; traces posées déclarées § 6.2 et lues ; réactions citées existantes ou définies § 5 ; `{toi}` seulement chez un locuteur à adresse (Aubert, Vialat, Amsel et La Plume disent « madame ou monsieur {nom} » ou « {nom} » : pas de `{toi}`) ; aucun nom réel, aucune monnaie réelle, aucun chiffre de jauge ; jamais `drame` (le −3 est atteignable en S0) ; les scènes de La Plume et d'Amsel portent `season >= 1`.

**Par chapitre** : 22 fiches (§ 4.2 complet : fonction, genre, âge, camp, fenêtre, suivant, tic et trois torsions, désir, blessure, adresse par rôle, ce qu'il pense de toi, paliers, dans les rôles, trajectoire par décennie, retrouvailles, six à huit cartes propres) ; 44 scènes de palier ; 44 répliques de retrouvailles ; la table des mandats § 2 ; la table des retournements § 3 ; les douze traces attribuées par § 5.2 lues (§ 6.1) ; quarante-quatre traces nouvelles avec lecteur (§ 6.2) ; années cohérentes avec § 1.1 (fax avant 2010, écus après 2002, Plateau après 2003, vidéo après 2016, machine en 2027, Arena Dupuis en 2015) ; les dix-sept existants gardent nom, tic, camp et adresses `entraineur`/`joueur` de `characters.yaml`. Relecture croisée à faire par le chapitre 01 (les retrouvailles de Josiane, Fardelli et Ménèche doivent être harmonisées avec celles de Vukić, Gégé et Vecchio écrites là-bas : même mécanique, même longueur).

**Écart signalé au showrunner** : le chapitre dépasse la longueur indicative (8 000 à 12 000 mots) parce que la charte exige 22 fiches, 44 scènes et 44 retrouvailles au gabarit complet ; rien n'a été ajouté au-delà des nombres de § 5.1. Si la longueur doit baisser, on coupe les « Cartes propres » (elles sont redondantes avec les chapitres 10-15) avant tout le reste.
